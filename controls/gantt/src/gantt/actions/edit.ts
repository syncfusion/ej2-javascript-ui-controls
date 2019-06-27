import { isNullOrUndefined, isUndefined, extend, setValue, getValue, deleteObject, createElement } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { TaskFieldsModel, EditSettingsModel } from '../models/models';
import { IGanttData, ITaskData, ITaskbarEditedEventArgs, IValidateArgs, IParent, IPredecessor } from '../base/interface';
import { IActionBeginEventArgs, ITaskAddedEventArgs, ITaskDeletedEventArgs } from '../base/interface';
import { ColumnModel } from '../models/column';
import { EditType } from '../base/enum';
import { DataManager, DataUtil, Query } from '@syncfusion/ej2-data';
import { ReturnType, RecordDoubleClickEventArgs, Row, Column } from '@syncfusion/ej2-grids';
import { getSwapKey, isScheduledTask, getTaskData, isRemoteData, getIndex } from '../base/utils';
import { RowPosition } from '../base/enum';
import { CellEdit } from './cell-edit';
import { TaskbarEdit } from './taskbar-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';

/**
 * The Edit Module is used to handle editing actions.
 */
export class Edit {
    private parent: Gantt;
    public validatedChildItems: IGanttData[];
    private isFromDeleteMethod: boolean = false;
    private targetedRecords: IGanttData[] = [];
    /**
     * @private
     */
    public confirmDialog: Dialog = null;
    private taskbarMoved: boolean = false;
    private predecessorUpdated: boolean = false;
    public newlyAddedRecordBackup: IGanttData;
    public isBreakLoop: Boolean = false;
    public addRowSelectedItem: IGanttData;
    public cellEditModule: CellEdit;
    public taskbarEditModule: TaskbarEdit;
    public dialogModule: DialogEdit;
    constructor(parent?: Gantt) {
        this.parent = parent;
        this.validatedChildItems = [];
        if (this.parent.editSettings.allowEditing && this.parent.editSettings.mode === 'Auto') {
            this.cellEditModule = new CellEdit(this.parent);
        }
        if (this.parent.editSettings.allowAdding || (this.parent.editSettings.allowEditing &&
            (this.parent.editSettings.mode === 'Dialog' || this.parent.editSettings.mode === 'Auto'))) {
            this.dialogModule = new DialogEdit(this.parent);
            if (this.parent.editSettings.mode === 'Dialog') {
                this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
            }
        }
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.taskbarEditModule = new TaskbarEdit(this.parent);
        }
        if (this.parent.editSettings.allowDeleting) {
            let confirmDialog: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_deleteConfirmDialog',
            });
            this.parent.element.appendChild(confirmDialog);
            this.renderDeleteConfirmDialog();
        }
        this.parent.treeGrid.editSettings.allowAdding = this.parent.editSettings.allowAdding;
        this.parent.treeGrid.editSettings.allowDeleting = this.parent.editSettings.allowDeleting;
        this.parent.treeGrid.editSettings.showDeleteConfirmDialog = this.parent.editSettings.showDeleteConfirmDialog;
    }

    private getModuleName(): string {
        return 'edit';
    }

    /**
     * @private
     */
    public reUpdateEditModules(): void {
        let editSettings: EditSettingsModel = this.parent.editSettings;
        if (this.parent.editModule.cellEditModule && (!editSettings.allowEditing ||
            editSettings.mode === 'Dialog')) {
            this.cellEditModule.destroy();
        } else if (!isNullOrUndefined(this.cellEditModule) && editSettings.allowEditing &&
            editSettings.mode === 'Auto') {
            this.cellEditModule = new CellEdit(this.parent);
        }
        if (this.taskbarEditModule && !editSettings.allowTaskbarEditing) {
            this.taskbarEditModule.destroy();
        } else if (!isNullOrUndefined(this.taskbarEditModule) && editSettings.allowTaskbarEditing) {
            this.taskbarEditModule = new TaskbarEdit(this.parent);
        }
        if (this.dialogModule && !editSettings.allowEditing) {
            this.dialogModule.destroy();
        } else if (!isNullOrUndefined(this.dialogModule) && editSettings.allowEditing) {
            this.dialogModule = new DialogEdit(this.parent);
            if (this.parent.editSettings.mode === 'Dialog') {
                this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
            }
        }
        if (this.confirmDialog && !this.confirmDialog.isDestroyed &&
            !editSettings.allowDeleting) {
            this.confirmDialog.destroy();
        } else if (!isNullOrUndefined(this.confirmDialog) && this.parent.editSettings.allowDeleting) {
            let confirmDialog: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_deleteConfirmDialog',
            });
            this.parent.element.appendChild(confirmDialog);
            this.renderDeleteConfirmDialog();
        }
    }

    private recordDoubleClick(args: RecordDoubleClickEventArgs): void {
        let ganttData: IGanttData;
        if (args.row) {
            let rowIndex: number = getValue('rowIndex', args.row);
            ganttData = this.parent.currentViewData[rowIndex];
        }
        if (!isNullOrUndefined(ganttData) && this.parent.editSettings.allowEditing) {
            this.dialogModule.openEditDialog(ganttData);
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        if (this.cellEditModule) {
            this.cellEditModule.destroy();
        }
        if (this.taskbarEditModule) {
            this.taskbarEditModule.destroy();
        }
        if (this.dialogModule) {
            this.dialogModule.destroy();
        }
        if (this.confirmDialog && !this.confirmDialog.isDestroyed) {
            this.confirmDialog.destroy();
        }
    }
    /**
     * @private
     */
    public deletedTaskDetails: IGanttData[] = [];
    /**
     * Method to update record with new values.
     * @param {Object} data - Defines new data to update.
     */
    public updateRecordByID(data: Object): void {
        let tasks: TaskFieldsModel = this.parent.taskFields;
        let ganttData: IGanttData = this.parent.getRecordByID(data[tasks.id]);
        if (!isNullOrUndefined(this.parent.editModule) && ganttData) {
            this.parent.isOnEdit = true;
            this.validateUpdateValues(data, ganttData, true);
            let keys: string[] = Object.keys(data);
            if (keys.indexOf(tasks.startDate) !== -1 || keys.indexOf(tasks.endDate) !== -1 ||
                keys.indexOf(tasks.duration) !== -1) {
                this.parent.dataOperation.calculateScheduledValues(ganttData, ganttData.taskData, false);
            }
            this.parent.dataOperation.updateWidthLeft(ganttData);
            if (!isUndefined(data[this.parent.taskFields.dependency]) &&
                data[this.parent.taskFields.dependency] !== ganttData.ganttProperties.predecessorsName) {
                this.parent.connectorLineEditModule.updatePredecessor(
                    ganttData, data[this.parent.taskFields.dependency]);
            } else {
                let args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
                args.data = ganttData;
                this.parent.editModule.initiateUpdateAction(args);
            }
        }
    }
    /**
     * 
     * @param data 
     * @param ganttData 
     * @param isFromDialog 
     * @private
     */
    public validateUpdateValues(data: Object, ganttData: IGanttData, isFromDialog?: boolean): void {
        let ganttObj: Gantt = this.parent;
        let tasks: TaskFieldsModel = ganttObj.taskFields;
        let ganttPropByMapping: Object = getSwapKey(ganttObj.columnMapping);
        let scheduleFieldNames: string[] = [];
        let isScheduleValueUpdated: boolean = false;
        for (let key of Object.keys(data)) {
            if (isNullOrUndefined(key)) {
                continue;
            }
            if ([tasks.startDate, tasks.endDate, tasks.duration].indexOf(key) !== -1) {
                if (isFromDialog) {
                    if (tasks.duration === key) {
                        ganttObj.dataOperation.updateDurationValue(data[key], ganttData.ganttProperties);
                        if (ganttData.ganttProperties.duration > 0 && ganttData.ganttProperties.isMilestone) {
                            this.parent.setRecordValue('isMilestone', false, ganttData.ganttProperties, true);
                        }
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key]);
                    } else {
                        ganttObj.setRecordValue(ganttPropByMapping[key], data[key], ganttData.ganttProperties, true);
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key]);
                    }
                } else {
                    scheduleFieldNames.push(key);
                    isScheduleValueUpdated = true;
                }
            } else if (tasks.resourceInfo === key) {
                let resourceData: Object[] = ganttObj.dataOperation.setResourceInfo(data);
                ganttData.ganttProperties.resourceInfo = resourceData;
                ganttObj.dataOperation.updateMappingData(ganttData, 'resourceInfo');
            } else if (tasks.dependency === key) {
                //..
            } else if ([tasks.progress, tasks.notes, tasks.durationUnit, tasks.expandState,
            tasks.milestone, tasks.name, tasks.baselineStartDate,
            tasks.baselineEndDate, tasks.indicators, tasks.id].indexOf(key) !== -1) {
                let column: ColumnModel = ganttObj.columnByField[key];
                /* tslint:disable-next-line */
                let value: any = data[key];
                if (column.editType === EditType.DatePicker || column.editType === EditType.DateTimePicker) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                let ganttPropKey: string = ganttPropByMapping[key];
                if (key === tasks.id) {
                    ganttPropKey = 'taskId';
                } else if (key === tasks.name) {
                    ganttPropKey = 'taskName';
                }
                ganttObj.setRecordValue(ganttPropKey, value, ganttData.ganttProperties, true);
                if ((key === tasks.baselineStartDate || key === tasks.baselineEndDate) &&
                    (ganttData.ganttProperties.baselineStartDate && ganttData.ganttProperties.baselineEndDate)) {
                    ganttObj.setRecordValue(
                        'baselineLeft', ganttObj.dataOperation.calculateBaselineLeft(
                            ganttData.ganttProperties),
                        ganttData.ganttProperties, true);
                    ganttObj.setRecordValue(
                        'baselineWidth', ganttObj.dataOperation.calculateBaselineWidth(
                            ganttData.ganttProperties),
                        ganttData.ganttProperties, true);
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (ganttObj.customColumns.indexOf(key) !== -1) {
                let column: ColumnModel = ganttObj.columnByField[key];
                /* tslint:disable-next-line */
                let value: any = data[key];
                if (column.editType === EditType.DatePicker || column.editType === EditType.DateTimePicker) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            }
        }
        if (isScheduleValueUpdated) {
            this.validateScheduleValues(scheduleFieldNames, ganttData, data);
        }
    }

    private validateScheduleValues(fieldNames: string[], ganttData: IGanttData, data: Object): void {
        let ganttObj: Gantt = this.parent;
        if (fieldNames.length > 2) {
            ganttObj.dataOperation.calculateScheduledValues(ganttData, data, false);
        } else if (fieldNames.length > 1) {
            this.validateScheduleByTwoValues(data, fieldNames, ganttData);
        } else {
            this.dialogModule.validateScheduleValuesByCurrentField(fieldNames[0], data[fieldNames[0]], ganttData);
        }
    }
    private validateScheduleByTwoValues(data: Object, fieldNames: string[], ganttData: IGanttData): void {
        let ganttObj: Gantt = this.parent; let startDate: Date; let endDate: Date; let duration: string;
        let tasks: TaskFieldsModel = ganttObj.taskFields; let ganttProp: ITaskData = ganttData.ganttProperties;
        let isUnscheduledTask: boolean = ganttObj.allowUnscheduledTasks;
        if (fieldNames.indexOf(tasks.startDate) !== -1) {
            startDate = data[tasks.startDate];
        }
        if (fieldNames.indexOf(tasks.endDate) !== -1) {
            endDate = data[tasks.endDate];
        }
        if (fieldNames.indexOf(tasks.duration) !== -1) {
            duration = data[tasks.duration];
        }
        if (startDate && endDate || (isUnscheduledTask && (fieldNames.indexOf(tasks.startDate) !== -1) &&
            (fieldNames.indexOf(tasks.endDate) !== -1))) {
            ganttObj.setRecordValue('startDate', ganttObj.dataOperation.getDateFromFormat(startDate), ganttProp, true);
            ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(endDate), ganttProp, true);
            ganttObj.dataOperation.calculateDuration(ganttData);
        } else if (endDate && duration || (isUnscheduledTask &&
            (fieldNames.indexOf(tasks.endDate) !== -1) && (fieldNames.indexOf(tasks.duration) !== -1))) {
            ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(endDate), ganttProp, true);
            ganttObj.dataOperation.updateDurationValue(duration, ganttProp);
        } else if (startDate && duration || (isUnscheduledTask && (fieldNames.indexOf(tasks.startDate) !== -1)
            && (fieldNames.indexOf(tasks.duration) !== -1))) {
            ganttObj.setRecordValue('startDate', ganttObj.dataOperation.getDateFromFormat(startDate), ganttProp, true);
            ganttObj.dataOperation.updateDurationValue(duration, ganttProp);
        }
    }

    private isTaskbarMoved(data: IGanttData): boolean {
        let isMoved: boolean = false;
        let taskData: ITaskData = data.ganttProperties;
        let prevData: IGanttData = this.parent.previousRecords &&
            this.parent.previousRecords[data.uniqueID];
        if (prevData && prevData.ganttProperties) {
            let prevStart: Date = getValue('ganttProperties.startDate', prevData) as Date;
            let prevEnd: Date = getValue('ganttProperties.endDate', prevData) as Date;
            let prevDuration: number = getValue('ganttProperties.duration', prevData);
            let prevDurationUnit: string = getValue('ganttProperties.durationUnit', prevData);
            let keys: string[] = Object.keys(prevData.ganttProperties);
            if (keys.indexOf('startDate') !== -1 || keys.indexOf('endDate') !== -1 ||
                keys.indexOf('duration') !== -1 || keys.indexOf('durationUnit') !== -1) {
                if ((isNullOrUndefined(prevStart) && !isNullOrUndefined(taskData.startDate)) ||
                    (isNullOrUndefined(prevEnd) && !isNullOrUndefined(taskData.endDate)) ||
                    (isNullOrUndefined(taskData.startDate) && !isNullOrUndefined(prevStart)) ||
                    (isNullOrUndefined(taskData.endDate) && !isNullOrUndefined(prevEnd)) ||
                    (prevStart && prevStart.getTime() !== taskData.startDate.getTime())
                    || (prevEnd && prevEnd.getTime() !== taskData.endDate.getTime())
                    || (!isNullOrUndefined(prevDuration) && prevDuration !== taskData.duration)
                    || (!isNullOrUndefined(prevDuration) && prevDuration === taskData.duration &&
                        prevDurationUnit !== taskData.durationUnit)) {
                    isMoved = true;
                }
            }
        }
        return isMoved;
    }

    private isPredecessorUpdated(data: IGanttData): boolean {
        let isPredecessorUpdated: boolean = false;
        let prevData: IGanttData = this.parent.previousRecords[data.uniqueID];
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            if (data.ganttProperties.predecessorsName !== prevData.ganttProperties.predecessorsName) {
                isPredecessorUpdated = true;
            } else {
                this.parent.setRecordValue('predecessor', prevData.ganttProperties.predecessor, data.ganttProperties, true);
            }
        }
        return isPredecessorUpdated;
    }

    /**
     * Method to check need to open predecessor validate dialog
     * @param data 
     */
    private isCheckPredecessor(data: IGanttData): boolean {
        let isValidatePredecessor: boolean = false;
        let prevData: IGanttData = this.parent.previousRecords[data.uniqueID];

        if (prevData && this.parent.taskFields.dependency && this.parent.isInPredecessorValidation &&
            this.parent.predecessorModule.getValidPredecessor(data).length > 0) {

            if (this.isTaskbarMoved(data)) {
                isValidatePredecessor = true;
            }
        }
        return isValidatePredecessor;
    }

    /**
     * Method to update all dependent record on edit action
     * @param args
     * @private 
     */
    public initiateUpdateAction(args: ITaskbarEditedEventArgs): void {
        let isValidatePredecessor: boolean = this.isCheckPredecessor(args.data);
        this.taskbarMoved = this.isTaskbarMoved(args.data);
        this.predecessorUpdated = this.isPredecessorUpdated(args.data);
        if (this.predecessorUpdated) {
            this.parent.isConnectorLineUpdate = true;
            this.parent.predecessorModule.addRemovePredecessor(args.data);
        }
        let validateObject: object = {};
        if (isValidatePredecessor) {
            validateObject = this.parent.predecessorModule.validateTypes(args.data);
            this.parent.isConnectorLineUpdate = true;
            if (!isNullOrUndefined(getValue('violationType', validateObject))) {
                let newArgs: IValidateArgs = this.validateTaskEvent(args);
                if (newArgs.validateMode.preserveLinkWithEditing === false &&
                    newArgs.validateMode.removeLink === false &&
                    newArgs.validateMode.respectLink === false) {
                    this.parent.predecessorModule.openValidationDialog(validateObject);
                } else {
                    this.parent.predecessorModule.applyPredecessorOption();
                }
            } else {
                this.updateEditedTask(args);
            }
        } else {
            if (this.taskbarMoved) {
                this.parent.isConnectorLineUpdate = true;
            }
            this.updateEditedTask(args);
        }
    }

    /**
     * 
     * @param data method to trigger validate predecessor link by dialog
     */
    private validateTaskEvent(editedEventArgs: ITaskbarEditedEventArgs): IValidateArgs {
        let newArgs: IValidateArgs = {};
        this.resetValidateArgs();
        this.parent.currentEditedArgs = newArgs;
        newArgs.cancel = false;
        newArgs.data = editedEventArgs.data;
        newArgs.requestType = 'validateLinkedTask';
        newArgs.validateMode = this.parent.dialogValidateMode;
        newArgs.editEventArgs = editedEventArgs;
        this.parent.actionBeginTask(newArgs);
        return newArgs;
    }

    private resetValidateArgs(): void {
        this.parent.dialogValidateMode.preserveLinkWithEditing = true;
        this.parent.dialogValidateMode.removeLink = false;
        this.parent.dialogValidateMode.respectLink = false;
    }

    /**
     * 
     * @param args - Edited event args like taskbar editing, dialog editing, cell editing 
     * @private
     */
    public updateEditedTask(args: ITaskbarEditedEventArgs): void {
        let ganttRecord: IGanttData = args.data;
        /** Update parent up-to zeroth level */
        if (ganttRecord.parentItem) {
            this.parent.dataOperation.updateParentItems(ganttRecord.parentItem);
        }
        this.updateParentChildRecord(ganttRecord);
        if (this.parent.isConnectorLineUpdate) {
            /* validating predecessor for updated child items */
            for (let i: number = 0; i < this.validatedChildItems.length; i++) {
                let child: IGanttData = this.validatedChildItems[i];
                if (child.ganttProperties.predecessor && child.ganttProperties.predecessor.length > 0) {
                    this.parent.editedTaskBarItem = child;
                    this.parent.predecessorModule.validatePredecessor(child, [], '');
                }
            }
            /** validating predecessor for current edited records */
            if (ganttRecord.ganttProperties.predecessor) {
                this.parent.isMileStoneEdited = ganttRecord.ganttProperties.isMilestone;
                if (this.taskbarMoved) {
                    this.parent.editedTaskBarItem = ganttRecord;
                }
                this.parent.predecessorModule.validatePredecessor(ganttRecord, [], '');
            }
        }
        this.initiateSaveAction(args);
    }

    /**
     * To update parent records while perform drag action.
     * @return {void}
     * @private
     */
    public updateParentChildRecord(data: IGanttData): void {
        let ganttRecord: IGanttData = data;
        if (ganttRecord.hasChildRecords && this.taskbarMoved) {
            this.updateChildItems(ganttRecord);
        }
    }

    /**
     * 
     * @param data 
     * @param newStartDate 
     */
    private calculateDateByRoundOffDuration(data: IGanttData, newStartDate: Date): void {
        let ganttRecord: IGanttData = data;
        let taskData: ITaskData = ganttRecord.ganttProperties;
        let projectStartDate: Date = new Date(newStartDate.getTime());
        if (!isNullOrUndefined(taskData.endDate) && isNullOrUndefined(taskData.startDate)) {
            let endDate: Date = this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, null);
            this.parent.setRecordValue(
                'endDate',
                this.parent.dateValidationModule.checkEndDate(endDate, ganttRecord.ganttProperties),
                taskData,
                true);
        } else {
            this.parent.setRecordValue(
                'startDate',
                this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData),
                taskData,
                true);
            if (!isNullOrUndefined(taskData.duration)) {
                this.parent.dateValidationModule.calculateEndDate(ganttRecord);
            }
        }
        this.parent.dataOperation.updateWidthLeft(data);
        this.parent.dataOperation.updateTaskData(ganttRecord);
    }

    /**
     * To update progress value of parent tasks
     * @param cloneParent 
     * @private
     */
    public updateParentProgress(cloneParent: IParent): void {
        let parentProgress: number = 0;
        let parent: IGanttData = this.parent.getParentTask(cloneParent);
        let childRecords: IGanttData[] = parent.childRecords;
        let childCount: number = childRecords ? childRecords.length : 0;
        let totalProgress: number = 0;
        let milesStoneCount: number = 0;
        let taskCount: number = 0;
        let totalDuration: number = 0;
        let progressValues: Object = {};
        if (childRecords) {
            for (let i: number = 0; i < childCount; i++) {
                if ((!childRecords[i].ganttProperties.isMilestone || childRecords[i].hasChildRecords) &&
                    isScheduledTask(childRecords[i].ganttProperties)) {
                    progressValues = this.parent.dataOperation.getParentProgress(childRecords[i]);
                    totalProgress += getValue('totalProgress', progressValues);
                    totalDuration += getValue('totalDuration', progressValues);
                } else {
                    milesStoneCount += 1;
                }
            }
            taskCount = childCount - milesStoneCount;
            parentProgress = taskCount > 0 ? Math.round(totalProgress / totalDuration) : 0;
            if (isNaN(parentProgress)) {
                parentProgress = 0;
            }
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(parent.ganttProperties.width, parentProgress),
                parent.ganttProperties,
                true);
            this.parent.setRecordValue('progress', Math.floor(parentProgress), parent.ganttProperties, true);
            this.parent.setRecordValue('totalProgress', totalProgress, parent.ganttProperties, true);
            this.parent.setRecordValue('totalDuration', totalDuration, parent.ganttProperties, true);
        }
        this.parent.dataOperation.updateTaskData(parent);
        if (parent.parentItem) {
            this.updateParentProgress(parent.parentItem);
        }
    }

    /**
     * Method to revert cell edit action
     * @param args 
     * @private
     */
    public revertCellEdit(args: object): void {
        this.parent.editModule.reUpdatePreviousRecords(false, true);
        this.resetEditProperties();
    }

    /**
     *
     * @return {void}
     * @private
     */
    public reUpdatePreviousRecords(isRefreshChart?: boolean, isRefreshGrid?: boolean): void {
        let collection: object = this.parent.previousRecords;
        let keys: string[] = Object.keys(collection);
        for (let i: number = 0; i < keys.length; i++) {
            let uniqueId: string = keys[i];
            let prevTask: IGanttData = collection[uniqueId] as IGanttData;
            let originalData: IGanttData = this.parent.getTaskByUniqueID(uniqueId);
            this.copyTaskData(originalData.taskData, prevTask.taskData);
            delete prevTask.taskData;
            this.copyTaskData(originalData.ganttProperties, prevTask.ganttProperties);
            delete prevTask.ganttProperties;
            this.copyTaskData(originalData, prevTask);
            let rowIndex: number = this.parent.currentViewData.indexOf(originalData);
            if (isRefreshChart) {
                this.parent.chartRowsModule.refreshRow(rowIndex);
            }
            if (isRefreshGrid) {
                this.parent.treeGrid.grid.setRowData(originalData.ganttProperties.taskId, originalData);
                let row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                    this.parent.treeGrid.grid.getDataRows()[rowIndex].getAttribute('data-uid'));
                row.data = originalData;
            }
        }
    }
    /**
     * Copy previous task data value to edited task data
     * @param existing 
     * @param newValue 
     */
    private copyTaskData(existing: Object, newValue: object): void {
        if (!isNullOrUndefined(newValue)) {
            extend(existing, newValue);
        }
    }

    /**
     * To update schedule date on editing.
     * @return {void}
     * @private
     */
    private updateScheduleDatesOnEditing(args: ITaskbarEditedEventArgs): void {
        //..
    }

    /**
     * 
     * @param ganttRecord 
     */
    private updateChildItems(ganttRecord: IGanttData): void {
        let previousData: IGanttData = this.parent.previousRecords[ganttRecord.uniqueID];
        let previousStartDate: Date;
        if (isNullOrUndefined(previousData) ||
            (isNullOrUndefined(previousData) && !isNullOrUndefined(previousData.ganttProperties))) {
            previousStartDate = new Date(ganttRecord.ganttProperties.startDate.getTime());
        } else {
            previousStartDate = new Date(previousData.ganttProperties.startDate.getTime());
        }
        let currentStartDate: Date = ganttRecord.ganttProperties.startDate;
        let childRecords: IGanttData[] = [];
        let validStartDate: Date;
        let validEndDate: Date;
        let calcEndDate: Date;
        let isRightMove: boolean;
        let durationDiff: number;
        this.getUpdatableChildRecords(ganttRecord, childRecords);
        if (childRecords.length === 0) {
            return;
        }
        if (previousStartDate.getTime() > currentStartDate.getTime()) {
            validStartDate = this.parent.dateValidationModule.checkStartDate(currentStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(previousStartDate, ganttRecord.ganttProperties);
            isRightMove = false;
        } else {
            validStartDate = this.parent.dateValidationModule.checkStartDate(previousStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(currentStartDate, ganttRecord.ganttProperties);
            isRightMove = true;
        }
        //Get Duration
        if (validStartDate.getTime() >= validEndDate.getTime()) {
            durationDiff = 0;
        } else {
            durationDiff = this.parent.dateValidationModule.getDuration(validStartDate, validEndDate, 'minute', true);
        }
        for (let i: number = 0; i < childRecords.length; i++) {
            if (childRecords[i].ganttProperties.isAutoSchedule) {
                if (durationDiff > 0) {
                    let startDate: Date = isScheduledTask(childRecords[i].ganttProperties) ?
                        childRecords[i].ganttProperties.startDate : childRecords[i].ganttProperties.startDate ?
                            childRecords[i].ganttProperties.startDate : childRecords[i].ganttProperties.endDate ?
                                childRecords[i].ganttProperties.endDate : new Date(previousStartDate.toString());
                    if (isRightMove) {
                        calcEndDate = this.parent.dateValidationModule.getEndDate(
                            this.parent.dateValidationModule.checkStartDate(
                                startDate,
                                childRecords[i].ganttProperties,
                                childRecords[i].ganttProperties.isMilestone),
                            durationDiff,
                            'minute',
                            childRecords[i].ganttProperties,
                            false
                        );
                    } else {
                        calcEndDate = this.parent.dateValidationModule.getStartDate(
                            this.parent.dateValidationModule.checkEndDate(startDate, childRecords[i].ganttProperties),
                            durationDiff,
                            'minute',
                            childRecords[i].ganttProperties);
                    }
                    this.calculateDateByRoundOffDuration(childRecords[i], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i]) === -1) {
                        this.validatedChildItems.push(childRecords[i]);
                    }
                } else if (isNullOrUndefined(previousData)) {
                    calcEndDate = previousStartDate;
                    this.calculateDateByRoundOffDuration(childRecords[i], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i]) === -1) {
                        this.validatedChildItems.push(childRecords[i]);
                    }
                }
            }
        }
    }

    /**
     * To get updated child records. 
     * @param parentRecord 
     * @param childLists 
     */
    private getUpdatableChildRecords(parentRecord: IGanttData, childLists: IGanttData[]): void {
        let childRecords: IGanttData[] = parentRecord.childRecords;
        for (let i: number = 0; i < childRecords.length; i++) {
            if (childRecords[i].ganttProperties.isAutoSchedule) {
                childLists.push(childRecords[i]);
                if (childRecords[i].hasChildRecords) {
                    this.getUpdatableChildRecords(childRecords[i], childLists);
                }
            }
        }
    }


    private initiateSaveAction(args: ITaskbarEditedEventArgs): void {
        this.parent.showSpinner();
        let eventArgs: IActionBeginEventArgs = {};
        eventArgs.requestType = 'beforeSave';
        eventArgs.data = args.data;
        eventArgs.modifiedRecords = this.parent.editedRecords;
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords);
        this.parent.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) {
            this.reUpdatePreviousRecords();
            this.parent.chartRowsModule.refreshRecords([args.data]);
            this.resetEditProperties();
            // Trigger action complete event with save canceled request type
        } else {
            if (isRemoteData(this.parent.dataSource)) {
                let data: DataManager = this.parent.dataSource as DataManager;
                let updatedData: object = {
                    changedRecords: eventArgs.modifiedTaskData
                };
                let crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id, null, new Query()) as Promise<Object>;
                crud.then((e: ReturnType) => this.dmSuccess(e, args))
                    .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
            } else {
                this.saveSuccess(args);
            }
        }
    }

    private dmSuccess(e: ReturnType, args: ITaskbarEditedEventArgs): void {
        this.saveSuccess(args);
    }
    private dmFailure(e: { result: Object[] }, args: ITaskbarEditedEventArgs): void {
        if (this.deletedTaskDetails.length) {
            let deleteRecords: IGanttData[] = this.deletedTaskDetails;
            for (let d: number = 0; d < deleteRecords.length; d++) {
                deleteRecords[d].isDelete = false;
            }
            this.deletedTaskDetails = [];
        }
        this.reUpdatePreviousRecords(true, true);
        this.resetEditProperties();
        this.parent.trigger('actionFailure', { error: e });
    }

    /**
     * Method for save action success for local and remote data
     */
    private saveSuccess(args: ITaskbarEditedEventArgs): void {
        let eventArgs: IActionBeginEventArgs = {};
        if (this.parent.timelineSettings.updateTimescaleView) {
            let tempArray: IGanttData[] = this.parent.editedRecords;
            this.parent.timelineModule.updateTimeLineOnEditing(tempArray, args.action);
        }
        this.parent.chartRowsModule.refreshRecords(this.parent.editedRecords);
        if (this.parent.isConnectorLineUpdate) {
            this.parent.updatedConnectorLineCollection = [];
            this.parent.connectorLineIds = [];
            this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(this.parent.editedRecords);
            this.updateScheduleDatesOnEditing(args);
        }
        eventArgs.requestType = 'save';
        eventArgs.modifiedRecords = this.parent.editedRecords;
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords);
        setValue('action', args.action, eventArgs);
        this.endEditAction(args);
        this.parent.trigger('actionComplete', eventArgs);
    }

    private resetEditProperties(): void {
        this.parent.currentEditedArgs = {};
        this.resetValidateArgs();
        this.parent.editedTaskBarItem = null;
        this.parent.isOnEdit = false;
        this.validatedChildItems = [];
        this.parent.isConnectorLineUpdate = false;
        this.parent.editedTaskBarItem = null;
        this.taskbarMoved = false;
        this.predecessorUpdated = false;
        if (!isNullOrUndefined(this.dialogModule)) {
            this.dialogModule.dialogClose();
        }
        this.parent.hideSpinner();
        this.parent.initiateEditAction(false);
    }
    /**
     * @private
     */
    public endEditAction(args: ITaskbarEditedEventArgs): void {
        this.resetEditProperties();
        if (args.action === 'TaskbarEditing') {
            this.parent.trigger('taskbarEdited', args);
        } else if (args.action === 'CellEditing') {
            this.parent.trigger('endEdit', args);
        } else if (args.action === 'DialogEditing') {
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
    }

    private saveFailed(args: ITaskbarEditedEventArgs): void {
        this.reUpdatePreviousRecords();
        this.parent.hideSpinner();
        //action failure event trigger
    }

    /**
     * To render delete confirmation dialog
     * @return {void}
     */
    private renderDeleteConfirmDialog(): void {
        let dialogObj: Dialog = new Dialog({
            width: '320px',
            isModal: true,
            visible: false,
            content: this.parent.localeObj.getConstant('confirmDelete'),
            buttons: [
                {
                    click: this.confirmDeleteOkButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.closeConfirmDialog.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        dialogObj.appendTo('#' + this.parent.element.id + '_deleteConfirmDialog');
        this.confirmDialog = dialogObj;
    }

    private closeConfirmDialog(): void {
        this.confirmDialog.hide();
    }

    private confirmDeleteOkButton(): void {
        this.deleteSelectedItems();
        this.confirmDialog.hide();
        let focussedElement: HTMLElement = <HTMLElement>this.parent.element.querySelector('.e-treegrid');
        focussedElement.focus();
    }
    /**
     * @private
     */
    public startDeleteAction(): void {
        if (this.parent.editSettings.allowDeleting) {
            if (this.parent.editSettings.showDeleteConfirmDialog) {
                this.confirmDialog.show();
            } else {
                this.deleteSelectedItems();
            }
        }
    }

    private deleteSelectedItems(): void {
        if (!this.isFromDeleteMethod) {
            let selectedRecords: IGanttData[] = [];
            if (this.parent.selectionSettings.mode !== 'Cell') {
                selectedRecords = this.parent.selectionModule.getSelectedRecords();
            } else if (this.parent.selectionSettings.mode === 'Cell') {
                selectedRecords = this.parent.selectionModule.getCellSelectedRecords();
            }
            this.deleteRow(selectedRecords);
        } else {
            if (this.targetedRecords.length) {
                this.deleteRow(this.targetedRecords);
            }
            this.isFromDeleteMethod = false;
        }
    }

    /**
     * Method to delete record.
     * @param {number | string | number[] | string[] | IGanttData | IGanttData[]} taskDetail - Defines the details of data to delete. 
     * @public
     */
    public deleteRecord(taskDetail: number | string | number[] | string[] | IGanttData | IGanttData[]): void {
        this.isFromDeleteMethod = true;
        let variableType: string = typeof (taskDetail);
        this.targetedRecords = [];
        switch (variableType) {
            case 'number':
            case 'string':
                let taskId: string = taskDetail.toString();
                if (!isNullOrUndefined(taskId) && this.parent.ids.indexOf(taskId) !== -1) {
                    this.targetedRecords.push(this.parent.getRecordByID(taskId));
                }
                break;
            case 'object':
                if (!Array.isArray(taskDetail)) {
                    this.targetedRecords.push(taskDetail.valueOf());
                } else {
                    this.updateTargetedRecords(taskDetail as object[]);
                }
                break;
            default:
        }
        this.startDeleteAction();
    }
    /**
     * To update 'targetedRecords collection' from given array collection
     * @param taskDetailArray 
     */
    private updateTargetedRecords(taskDetailArray: object[]): void {
        if (taskDetailArray.length) {
            let variableType: string = typeof (taskDetailArray[0]);
            if (variableType === 'object') {
                this.targetedRecords = taskDetailArray;
            } else {
                // Get record from array of task ids
                for (let i: number = 0; i < taskDetailArray.length; i++) {
                    let taskId: string = taskDetailArray[i].toString();
                    if (!isNullOrUndefined(taskId) && this.parent.ids.indexOf(taskId) !== -1) {
                        this.targetedRecords.push(this.parent.getRecordByID(taskId));
                    }
                }
            }
        }
    }

    private deleteRow(tasks: IGanttData[]): void {
        let flatData: IGanttData[] = this.parent.flatData;
        let rowItems: IGanttData[] = tasks && tasks.length ? tasks :
            this.parent.selectionModule.getSelectedRecords();
        if (rowItems.length) {
            this.parent.isOnDelete = true;
            for (let i: number = 0; i < rowItems.length; i++) {
                let deleteRecord: IGanttData = rowItems[i];
                if (this.deletedTaskDetails.indexOf(deleteRecord) !== -1) {
                    continue;
                }
                deleteRecord.isDelete = true;
                if (deleteRecord.parentItem) {
                    let childLength: number = this.parent.getParentTask(deleteRecord.parentItem).childRecords.length;
                    if (childLength > 1) {
                        this.parent.dataOperation.updateParentItems(deleteRecord.parentItem);
                    }
                }
                let predecessor: IPredecessor[] = deleteRecord.ganttProperties.predecessor;
                if (predecessor && predecessor.length) {
                    this.removePredecessorOnDelete(deleteRecord);
                }
                this.deletedTaskDetails.push(deleteRecord);
                if (deleteRecord.hasChildRecords) {
                    this.deleteChildRecords(deleteRecord);
                }
            }
            if (this.parent.allowSelection) {
                // clear selection
                this.parent.selectionModule.clearSelection();
            }
            let delereArgs: ITaskDeletedEventArgs = {};
            delereArgs.deletedRecordCollection = this.deletedTaskDetails;
            delereArgs.updatedRecordCollection = this.parent.editedRecords;
            delereArgs.cancel = false;
            delereArgs.action = 'delete';
            this.initiateDeleteAction(delereArgs);
            this.parent.isOnDelete = false;
        }
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }

    private removePredecessorOnDelete(record: IGanttData): void {
        let predecessors: IPredecessor[] = record.ganttProperties.predecessor;
        for (let i: number = 0; i < predecessors.length; i++) {
            let predecessor: IPredecessor = predecessors[i];
            if (predecessor.from.toString() === record.ganttProperties.taskId.toString()) {
                let toRecord: IGanttData = this.parent.getRecordByID(predecessor.to.toString());
                let toRecordPredcessor: IPredecessor[] = extend([], [], toRecord.ganttProperties.predecessor, true) as IPredecessor[];
                let index: number;
                for (let t: number = 0; t < toRecordPredcessor.length; t++) {
                    if (toRecordPredcessor[t].to.toString() === toRecord.ganttProperties.taskId.toString()
                        && toRecordPredcessor[t].from.toString() === record.ganttProperties.taskId.toString()) {
                        index = t;
                        break;
                    }
                }
                toRecordPredcessor.splice(index, 1);
                this.updatePredecessorValues(toRecord, toRecordPredcessor);
            } else if (predecessor.to.toString() === record.ganttProperties.taskId.toString()) {
                let fromRecord: IGanttData = this.parent.getRecordByID(predecessor.from.toString());
                let fromRecordPredcessor: IPredecessor[] = extend([], [], fromRecord.ganttProperties.predecessor, true) as IPredecessor[];
                let index: number;
                for (let t: number = 0; t < fromRecordPredcessor.length; t++) {
                    if (fromRecordPredcessor[t].from.toString() === fromRecord.ganttProperties.taskId.toString()
                        && fromRecordPredcessor[t].to.toString() === record.ganttProperties.taskId.toString()) {
                        index = t;
                        break;
                    }
                }
                fromRecordPredcessor.splice(index, 1);
                this.updatePredecessorValues(fromRecord, fromRecordPredcessor);
            }
        }
    }

    private updatePredecessorValues(record: IGanttData, predcessorArray: IPredecessor[]): void {
        this.parent.setRecordValue('predecessor', predcessorArray, record.ganttProperties, true);
        let predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
    }

    private deleteChildRecords(record: IGanttData): void {
        let childRecords: IGanttData[] = record.childRecords;
        for (let c: number = 0; c < childRecords.length; c++) {
            let childRecord: IGanttData = childRecords[c];
            if (this.deletedTaskDetails.indexOf(childRecord) !== -1) {
                continue;
            }
            let predecessor: IPredecessor[] = childRecord.ganttProperties.predecessor;
            if (predecessor && predecessor.length) {
                this.removePredecessorOnDelete(childRecord);
            }
            this.deletedTaskDetails.push(childRecord);
            if (childRecord.hasChildRecords) {
                this.deleteChildRecords(childRecord);
            }
        }
    }

    private removeFromDataSource(deleteRecordIDs: string[]): void {
        let dataSource: Object[];
        let taskFields: TaskFieldsModel = this.parent.taskFields;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json as Object[];
        } else {
            dataSource = this.parent.dataSource as Object[];
        }
        this.removeData(dataSource, deleteRecordIDs);
        this.isBreakLoop = false;
    }
    private removeData(dataCollection: Object[], record: string[]): boolean | void {
        for (let i: number = 0; i < dataCollection.length; i++) {
            if (this.isBreakLoop) {
                break;
            }
            if (record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i]).toString()) !== -1) {
                if (dataCollection[i][this.parent.taskFields.child]) {
                    let childRecords: ITaskData[] = dataCollection[i][this.parent.taskFields.child];
                    this.removeData(childRecords, record);
                }
                record.splice(record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i]).toString()), 1);
                dataCollection.splice(i, 1);
                if (record.length === 0) {
                    this.isBreakLoop = true;
                    break;
                }
            } else if (dataCollection[i][this.parent.taskFields.child]) {
                let childRecords: ITaskData[] = dataCollection[i][this.parent.taskFields.child];
                this.removeData(childRecords, record);
            }
        }
    }

    private initiateDeleteAction(args: ITaskDeletedEventArgs): void {
        this.parent.showSpinner();
        let eventArgs: IActionBeginEventArgs = {};
        eventArgs.requestType = 'beforeDelete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection);
        this.parent.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) {
            let deleteRecords: IGanttData[] = this.deletedTaskDetails;
            for (let d: number = 0; d < deleteRecords.length; d++) {
                deleteRecords[d].isDelete = false;
            }
            this.deletedTaskDetails = [];
            this.reUpdatePreviousRecords();
            this.parent.initiateEditAction(false);
            this.parent.hideSpinner();
        } else {
            if (isRemoteData(this.parent.dataSource)) {
                let data: DataManager = this.parent.dataSource as DataManager;
                let updatedData: object = {
                    deletedRecords: eventArgs.data, // to check
                    changedRecords: eventArgs.modifiedTaskData
                };
                let crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id) as Promise<Object>;
                crud.then((e: ReturnType) => this.deleteSuccess(args))
                    .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
            } else {
                this.deleteSuccess(args);
            }
        }
    }

    private deleteSuccess(args: ITaskDeletedEventArgs): void {
        let flatData: IGanttData[] = this.parent.flatData;
        let currentData: IGanttData[] = this.parent.currentViewData;
        let deletedRecords: IGanttData[] = args.deletedRecordCollection;
        let deleteRecordIDs: string[] = [];
        for (let i: number = 0; i < deletedRecords.length; i++) {
            let deleteRecord: IGanttData = deletedRecords[i];
            let currentIndex: number = currentData.indexOf(deleteRecord);
            let flatIndex: number = flatData.indexOf(deleteRecord);
            let treeGridParentIndex: number = this.parent.treeGrid.parentData.indexOf(deleteRecord);
            let childIndex: number;
            if (currentIndex !== -1) { currentData.splice(currentIndex, 1); }
            if (flatIndex !== -1) { flatData.splice(flatIndex, 1); }
            deleteRecordIDs.push(deleteRecord.ganttProperties.taskId.toString());
            if (flatIndex !== -1) { this.parent.ids.splice(flatIndex, 1); }
            if (deleteRecord.level === 0 && treeGridParentIndex !== -1) {
                this.parent.treeGrid.parentData.splice(treeGridParentIndex, 1);
            }
            if (deleteRecord.parentItem) {
                let parentItem: IGanttData = this.parent.getParentTask(deleteRecord.parentItem);
                if (parentItem) {
                    let childRecords: IGanttData[] = parentItem.childRecords;
                    childIndex = childRecords.indexOf(deleteRecord);
                    if (childIndex !== -1) { childRecords.splice(childIndex, 1); }
                    if (!childRecords.length) {
                        parentItem.hasChildRecords = false;
                    }
                }
            }
        }
        if (deleteRecordIDs.length > 0) {
            this.removeFromDataSource(deleteRecordIDs);
        }
        let eventArgs: IActionBeginEventArgs = {};
        this.parent.updatedConnectorLineCollection = [];
        this.parent.connectorLineIds = [];
        this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        // this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(flatData);
        this.parent.treeGrid.refresh();
        // Trigger actioncomplete event for delete action
        eventArgs.requestType = 'delete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection);
        setValue('action', args.action, eventArgs);
        this.parent.trigger('actionComplete', eventArgs);
        this.deletedTaskDetails = [];
        this.parent.initiateEditAction(false);
        this.parent.hideSpinner();
    }

    /**
     *
     * @return {number | string}
     * @private
     */
    public getNewTaskId(): number | string {
        let maxId: number = DataUtil.aggregates.max(this.parent.flatData, this.parent.taskFields.id);
        if (!isNullOrUndefined(maxId)) {
            return parseInt(maxId.toString(), 10) + 1;
        } else {
            return 1;
        }
    }

    /**
     *
     * @return {void}
     * @private
     */
    private prepareNewlyAddedData(obj: Object, rowPosition: RowPosition): void {
        let taskModel: TaskFieldsModel = this.parent.taskFields;
        let id: string | number;
        let ids: string[] = this.parent.ids;
        /*Validate Task Id of data*/
        if (obj[taskModel.id]) {
            if (ids.indexOf(obj[taskModel.id].toString()) !== -1) {
                obj[taskModel.id] = null;
            } else {
                obj[taskModel.id] = isNullOrUndefined(obj[taskModel.id]) ? null : parseInt(obj[taskModel.id], 10);
            }
        }
        if (!obj[taskModel.id]) {
            id = this.getNewTaskId();
            obj[taskModel.id] = id;
        }
        if (taskModel.name && !obj[taskModel.name]) {
            obj[taskModel.name] = 'New Task' + ' ' + obj[taskModel.id];
        }
        if (!this.parent.allowUnscheduledTasks && !obj[taskModel.startDate]) {
            obj[taskModel.startDate] = this.parent.projectStartDate;
        }
        if (!this.parent.allowUnscheduledTasks && taskModel.duration && isNullOrUndefined(obj[taskModel.duration])) {
            if (!obj[taskModel.endDate]) {
                obj[taskModel.duration] = '5';
            }
        }
        if (taskModel.progress) {
            obj[taskModel.progress] = obj[taskModel.progress] ? (obj[taskModel.progress] > 100 ? 100 : obj[taskModel.progress]) : 0;
        }
        if (!this.parent.allowUnscheduledTasks && !obj[taskModel.endDate] && taskModel.endDate) {
            if (!obj[taskModel.duration]) {
                let startDate: Date = this.parent.dataOperation.getDateFromFormat(this.parent.projectStartDate);
                startDate.setDate(startDate.getDate() + 4);
                obj[taskModel.endDate] = this.parent.getFormatedDate(startDate, this.parent.dateFormat);
            }
        }
    }

    /**
     *
     * @return {IGanttData}
     * @private
     */
    private updateNewlyAddedDataBeforeAjax(
        obj: Object, level: number, rowPosition: RowPosition, parentItem?: IGanttData): IGanttData {
        let cAddedRecord: IGanttData;
        cAddedRecord = this.parent.dataOperation.createRecord(obj, level);
        cAddedRecord.index = parseInt(cAddedRecord.ganttProperties.taskId.toString(), 10) - 1;
        if (!isNullOrUndefined(parentItem)) {
            this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), cAddedRecord);
            let pIndex: number = cAddedRecord.parentItem ? cAddedRecord.parentItem.index : null;
            this.parent.setRecordValue('parentIndex', pIndex, cAddedRecord);
            let parentUniqId: string = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
            this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
            if (!isNullOrUndefined(this.parent.taskFields.id) &&
                !isNullOrUndefined(this.parent.taskFields.parentID) && cAddedRecord.parentItem) {
                this.parent.setRecordValue(this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord.taskData, true);
            }
        }
        this.backUpAndPushNewlyAddedRecord(cAddedRecord, rowPosition, parentItem);
        // need to push in dataSource also.
        this.parent.isOnEdit = true;
        if (this.parent.taskFields.dependency && cAddedRecord.ganttProperties.predecessorsName) {
            this.parent.predecessorModule.ensurePredecessorCollectionHelper(cAddedRecord, cAddedRecord.ganttProperties);
            this.parent.predecessorModule.updatePredecessorHelper(cAddedRecord);
            this.parent.predecessorModule.validatePredecessorDates(cAddedRecord);
        } else {
            if (cAddedRecord.parentItem && this.parent.getParentTask(cAddedRecord.parentItem).ganttProperties.isAutoSchedule) {
                this.parent.dataOperation.updateParentItems(cAddedRecord.parentItem);
            }
        }
        return cAddedRecord;
    }

    /**
     *
     * @return {number}
     * @private
     */
    private getChildCount(record: IGanttData, count: number): number {
        let currentRecord: IGanttData;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }

    /**
     *
     * @return {number}
     * @private
     */
    private getVisibleChildRecordCount(data: IGanttData, count: number, collection: IGanttData[]): number {
        let childRecords: IGanttData[];
        let length: number;
        if (data.hasChildRecords) {
            childRecords = data.childRecords;
            length = childRecords.length;
            for (let i: number = 0; i < length; i++) {
                if (collection.indexOf(childRecords[i]) !== -1) {
                    count++;
                }
                if (childRecords[i].hasChildRecords) {
                    count = this.getVisibleChildRecordCount(childRecords[i], count, collection);
                }
            }
        } else {
            if (collection.indexOf(data) !== -1) {
                count++;
            }
        }
        return count;
    }

    /**
     *
     * @return {void}
     * @private
     */
    private updatePredecessorOnIndentOutdent(parentRecord: IGanttData): void {
        let len: number = parentRecord.ganttProperties.predecessor.length;
        let parentRecordTaskData: ITaskData = parentRecord.ganttProperties;
        let predecessorCollection: IPredecessor[] = parentRecordTaskData.predecessor;
        let childRecord: IGanttData;
        let predecessorIndex: number;
        let id: string;
        let updatedPredecessor: IPredecessor[] = [];
        for (let count: number = 0; count < len; count++) {
            if (predecessorCollection[count].to === parentRecordTaskData.taskId.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].from);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                let predecessorCollections: IPredecessor[];
                predecessorCollections = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                predecessorCollections.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', predecessorCollections, childRecord.ganttProperties, true);
            } else if (predecessorCollection[count].from === parentRecordTaskData.taskId.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].to);
                let stringPredecessor: string = this.predecessorToString(childRecord.ganttProperties.predecessor, parentRecord);
                let prdcList: string[] = (childRecord.ganttProperties.predecessorsName.toString()).split(',');
                let str: string = predecessorCollection[count].from + predecessorCollection[count].type;
                let ind: number = prdcList.indexOf(str);
                prdcList.splice(ind, 1);
                this.parent.setRecordValue('predecessorsName', prdcList.join(','), childRecord.ganttProperties, true);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                let temppredecessorCollection: IPredecessor[];
                temppredecessorCollection = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                temppredecessorCollection.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', temppredecessorCollection, childRecord.ganttProperties, true);
                this.parent.predecessorModule.validatePredecessorDates(childRecord);
            }
        }
        this.parent.setRecordValue('predecessor', updatedPredecessor, parentRecord.ganttProperties, true);
        this.parent.setRecordValue('predecessorsName', '', parentRecord.ganttProperties, true);
    }

    /**
     *
     * @return {string}
     * @private
     */
    private predecessorToString(predecessorCollection: IPredecessor[], record: IGanttData): string {
        let predecessorString: string[] = [];
        let count: number = 0;
        let length: number = predecessorCollection.length;
        for (count; count < length; count++) {
            if (record.ganttProperties.taskId.toString() !== predecessorCollection[count].from) {
                let tem: string = predecessorCollection[count].from + predecessorCollection[count].type;
                predecessorCollection[count].offset =
                    isNaN(predecessorCollection[count].offset) ? 0 : predecessorCollection[count].offset;
                if (predecessorCollection[count].offset !== 0) {
                    if (predecessorCollection[count].offset < 0) {
                        tem += predecessorCollection[count].offset.toString() + 'd';
                    } else if (predecessorCollection[count].offset > 0) {
                        tem += '+' + predecessorCollection[count].offset.toString() + 'd';
                    }
                }
                predecessorString.push(tem);
            }
        }
        return predecessorString.join(',');
    }

    /**
     *
     * @return {void}
     * @private
     */
    private backUpAndPushNewlyAddedRecord(
        record: IGanttData, rowPosition: RowPosition, parentItem?: IGanttData): void {
        let flatRecords: IGanttData[] = this.parent.flatData;
        let currentViewData: IGanttData[] = this.parent.currentViewData;
        let ids: string[] = this.parent.ids;
        let currentItemIndex: number;
        switch (rowPosition) {
            case 'Top':
                flatRecords.splice(0, 0, record);
                currentViewData.splice(0, 0, record);
                ids.splice(0, 0, record.ganttProperties.taskId.toString()); // need to check NAN
                break;
            case 'Bottom':
                flatRecords.push(record);
                currentViewData.push(record);
                ids.push(record.ganttProperties.taskId.toString()); // need to check NAN
                break;
            case 'Above':
                let childIndex: number;
                /*Record Updates*/
                let recordIndex: number = flatRecords.indexOf(this.addRowSelectedItem);
                let updatedCollectionIndex: number = currentViewData.indexOf(this.addRowSelectedItem);
                this.recordCollectionUpdate(childIndex, recordIndex, updatedCollectionIndex, record, parentItem);
                break;
            case 'Below':
                currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
                if (this.addRowSelectedItem.hasChildRecords) {
                    let dataChildCount: number = this.getChildCount(this.addRowSelectedItem, 0);
                    recordIndex = currentItemIndex + dataChildCount + 1;
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
                } else {
                    recordIndex = currentItemIndex + 1;
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
                }
                this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem);
                break;
            case 'Child':
                currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
                if (this.addRowSelectedItem.hasChildRecords) {
                    let dataChildCount: number = this.getChildCount(this.addRowSelectedItem, 0);
                    recordIndex = currentItemIndex + dataChildCount + 1;
                    //Expand Add record's parent item 
                    if (!this.addRowSelectedItem.expanded) {
                        this.parent.expandByID(this.addRowSelectedItem.ganttProperties.taskId);
                    }
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
                } else {
                    this.addRowSelectedItem.hasChildRecords = true;
                    this.addRowSelectedItem.childRecords = [];
                    this.addRowSelectedItem.expanded = true;
                    this.addRowSelectedItem.ganttProperties.isMilestone = false;
                    recordIndex = currentItemIndex + 1;
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
                    if (this.addRowSelectedItem.ganttProperties.predecessor) {
                        this.updatePredecessorOnIndentOutdent(this.addRowSelectedItem);
                    }
                }
                this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem);
                break;
        }
        this.newlyAddedRecordBackup = record;
    }

    /**
     *
     * @return {ITaskAddedEventArgs}
     * @private
     */
    private recordCollectionUpdate(
        childIndex: number, recordIndex: number, updatedCollectionIndex: number, record: IGanttData, parentItem: IGanttData): void {
        let flatRecords: IGanttData[] = this.parent.flatData;
        let currentViewData: IGanttData[] = this.parent.currentViewData;
        let ids: string[] = this.parent.ids;
        /* Record collection update */
        flatRecords.splice(recordIndex, 0, record);
        currentViewData.splice(updatedCollectionIndex, 0, record);
        ids.splice(recordIndex, 0, record.ganttProperties.taskId.toString());
        /* data Source update */
        if (!isNullOrUndefined(parentItem)) {
            childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem);
            /*Child collection update*/
            parentItem.childRecords.splice(childIndex, 0, record);
        }
    }

    /**
     *
     * @return {ITaskAddedEventArgs}
     * @private
     */
    private constructTaskAddedEventArgs(
        cAddedRecord: IGanttData, modifiedRecords: IGanttData[], event: string): ITaskAddedEventArgs {
        let eventArgs: ITaskAddedEventArgs = {};
        eventArgs.action = event;
        eventArgs.data = cAddedRecord;
        eventArgs.newTaskData = getTaskData([cAddedRecord])[0];
        eventArgs.recordIndex = cAddedRecord.index;
        eventArgs.modifiedRecords = modifiedRecords;
        eventArgs.modifiedTaskData = getTaskData(modifiedRecords);
        return eventArgs;
    }

    /**
     *
     * @return {void}
     * @private
     */
    private addSuccess(args: ITaskAddedEventArgs, ): void {
        // let addedRecords: IGanttData = args.addedRecord;
        // let eventArgs: IActionBeginEventArgs = {};
        // this.parent.updatedConnectorLineCollection = [];
        // this.parent.connectorLineIds = [];
        // this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        this.parent.treeGrid.refresh();
    }

    /**
     *
     * @return {void}
     * @private
     */
    private updateRealDataSource(addedRecord: IGanttData, rowPosition: RowPosition): void {
        let dataSource: Object[];
        let taskFields: TaskFieldsModel = this.parent.taskFields;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json as Object[];
        } else {
            dataSource = this.parent.dataSource as Object[];
        }
        if (rowPosition === 'Top') {
            dataSource.splice(0, 0, addedRecord.taskData);
        } else if (rowPosition === 'Bottom') {
            dataSource.push(addedRecord);
        } else {
            if (!isNullOrUndefined(taskFields.id) && !isNullOrUndefined(taskFields.parentID)) {
                dataSource.push(addedRecord.taskData);
            } else {
                this.addDataInRealDataSource(dataSource, addedRecord.taskData, rowPosition);
            }
        }
        this.isBreakLoop = false;
    }

    /**
     *
     * @return {boolean | void}
     * @private
     */
    private addDataInRealDataSource(
        dataCollection: Object[], record: IGanttData, rowPosition?: RowPosition): boolean | void {
        for (let i: number = 0; i < dataCollection.length; i++) {
            if (this.isBreakLoop) {
                break;
            }
            if (getValue(
                this.parent.taskFields.id, dataCollection[i]).toString() ===
                this.addRowSelectedItem.ganttProperties.taskId.toString()) {
                if (rowPosition === 'Above') {
                    dataCollection.splice(i, 0, record);
                } else if (rowPosition === 'Below') {
                    dataCollection.splice(i + 1, 0, record);
                } else if (rowPosition === 'Child') {
                    /* tslint:disable-next-line */
                    if (dataCollection[i]['subtasks'] && dataCollection[i]['subtasks'].length > 0) {
                        /* tslint:disable-next-line */
                        dataCollection[i]['subtasks'].push(record);
                    } else {
                        /* tslint:disable-next-line */
                        dataCollection[i]['subtasks'] = [];
                        /* tslint:disable-next-line */
                        dataCollection[i]['subtasks'].push(record);
                    }
                }
                this.isBreakLoop = true;
                break;
            } else if (dataCollection[i][this.parent.taskFields.child]) {
                let childRecords: ITaskData[] = dataCollection[i][this.parent.taskFields.child];
                this.addDataInRealDataSource(childRecords, record, rowPosition);
            }
        }
    }

    /**
     * Method to add new record.
     * @param {Object | IGanttData} data - Defines the new data to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @return {void}
     * @private
     */
    public addRecord(data?: Object | IGanttData, rowPosition?: RowPosition, rowIndex?: number): void {
        let selectedRowIndex: number = isNullOrUndefined(rowIndex) || isNaN(parseInt(rowIndex.toString(), 10)) ?
            this.parent.selectionModule ?
                (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both') &&
                    this.parent.selectionModule.selectedRowIndexes.length === 1 ?
                    this.parent.selectionModule.selectedRowIndexes[0] :
                    this.parent.selectionSettings.mode === 'Cell' && this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        this.parent.selectionModule.getSelectedRowCellIndexes()[0].rowIndex : null : null : rowIndex;
        this.addRowSelectedItem = isNullOrUndefined(selectedRowIndex) ? null : this.parent.currentViewData[selectedRowIndex];
        rowPosition = isNullOrUndefined(rowPosition) ? this.parent.editSettings.newRowPosition : rowPosition;
        data = isNullOrUndefined(data) ? this.parent.editModule.dialogModule.composeAddRecord() : data;
        if (((isNullOrUndefined(selectedRowIndex) || selectedRowIndex < 0 ||
            isNullOrUndefined(this.addRowSelectedItem)) && (rowPosition === 'Above'
                || rowPosition === 'Below'
                || rowPosition === 'Child')) || !rowPosition || (rowPosition !== 'Above'
                    && rowPosition !== 'Below'
                    && rowPosition !== 'Child' && rowPosition !== 'Top' &&
                    rowPosition !== 'Bottom')) {
            rowPosition = 'Top';
        }
        let level: number = 0;
        let cAddedRecord: IGanttData;
        let args: ITaskAddedEventArgs = {};
        let parentItem: IGanttData;
        switch (rowPosition) {
            case 'Top':
            case 'Bottom':
                level = 0;
                break;
            case 'Above':
            case 'Below':
                level = this.addRowSelectedItem.level;
                parentItem = this.parent.getParentTask(this.addRowSelectedItem.parentItem);
                break;
            case 'Child':
                level = this.addRowSelectedItem.level + 1;
                parentItem = this.addRowSelectedItem;
                break;
        }
        //Add Action Init.
        this.prepareNewlyAddedData(data, rowPosition);
        cAddedRecord = this.updateNewlyAddedDataBeforeAjax(data, level, rowPosition, parentItem);
        args = this.constructTaskAddedEventArgs(cAddedRecord, this.parent.editedRecords, 'beforeAdd');
        this.parent.showSpinner();
        this.parent.trigger('actionBegin', args);
        if (!args.cancel) {
            if (isRemoteData(this.parent.dataSource)) {
                let data: DataManager = this.parent.dataSource as DataManager;
                let updatedData: object = {
                    addedRecords: [args.newTaskData], // to check
                    changedRecords: args.modifiedTaskData
                };
                let crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id, null, new Query()) as Promise<Object>;
                crud.then((e: { addedRecords: Object[], changedRecords: Object[] }) => {
                    if (this.parent.taskFields.id && !isNullOrUndefined(e.addedRecords[0][this.parent.taskFields.id]) &&
                        e.addedRecords[0][this.parent.taskFields.id] !== args.data.ganttProperties.taskId) {
                        this.parent.setRecordValue(
                            'taskId', e.addedRecords[0][this.parent.taskFields.id], args.data.ganttProperties, true);
                        this.parent.setRecordValue(
                            'taskData.' + this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data);
                        this.parent.setRecordValue(
                            this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data);
                    }
                    if (cAddedRecord.level === 0) {
                        this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                    }
                    this.RefreshNewlyAddedRecord(args, cAddedRecord);
                }).catch((e: { result: Object[] }) => {
                    this.removeAddedRecord();
                    this.dmFailure(e as { result: Object[] }, args);
                });
            } else {
                this.updateRealDataSource(args.data, rowPosition);
                if (cAddedRecord.level === 0) {
                    this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                }
                this.RefreshNewlyAddedRecord(args, cAddedRecord);
            }
        } else {
            this.removeAddedRecord();
            this.reUpdatePreviousRecords();
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
        this.parent.isOnEdit = false;
        this.parent.hideSpinner();
        this.addRowSelectedItem = null;
        this.newlyAddedRecordBackup = null;
        this.isBreakLoop = false;
        this.parent.element.tabIndex = 0;
        this.parent.initiateEditAction(false);
    }

    private RefreshNewlyAddedRecord(args: ITaskAddedEventArgs, cAddedRecord: IGanttData): void {
        if (this.parent.selectionModule && this.parent.allowSelection &&
            (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both')) {
            this.parent.staticSelectedRowIndex = this.parent.currentViewData.indexOf(args.data);
        }
        if (this.parent.timelineSettings.updateTimescaleView) {
            let tempArray: IGanttData[] = [];
            if (args.modifiedRecords.length > 0) {
                tempArray.push(args.data);
                tempArray.push.apply(tempArray, args.modifiedRecords);
            } else {
                tempArray = [args.data];
            }
            this.parent.timelineModule.updateTimeLineOnEditing(tempArray, args.action);
        }
        this.addSuccess(args);
        args = this.constructTaskAddedEventArgs(cAddedRecord, args.modifiedRecords, 'add');
        this.parent.trigger('actionComplete', args);
        if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
            this.dialogModule.dialogObj.hide();
        }
        this.dialogModule.dialogClose();
    }

    /**
     *
     * @return {void}
     * @private
     */
    private removeAddedRecord(): void {
        let flatRecords: IGanttData[] = this.parent.flatData;
        let currentViewData: IGanttData[] = this.parent.currentViewData;
        let ids: string[] = this.parent.ids;
        let flatRecordsIndex: number = flatRecords.indexOf(this.newlyAddedRecordBackup);
        let currentViewDataIndex: number = currentViewData.indexOf(this.newlyAddedRecordBackup);
        let idsIndex: number = ids.indexOf(this.newlyAddedRecordBackup.ganttProperties.taskId.toString());
        deleteObject(this.parent.previousRecords, flatRecords[flatRecordsIndex].uniqueID);
        if (this.newlyAddedRecordBackup.parentItem) {
            let parentItem: IGanttData = this.parent.getParentTask(this.newlyAddedRecordBackup.parentItem);
            let parentIndex: number = parentItem.childRecords.indexOf(this.newlyAddedRecordBackup);
            parentItem.childRecords.splice(parentIndex, 1);
        }
        flatRecords.splice(flatRecordsIndex, 1);
        currentViewData.splice(currentViewDataIndex, 1);
        ids.splice(idsIndex, 1);
    }
}