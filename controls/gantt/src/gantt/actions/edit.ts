import { isNullOrUndefined, isUndefined, extend, setValue, getValue, deleteObject, createElement, isBlazor } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { TaskFieldsModel, EditSettingsModel, ResourceFieldsModel } from '../models/models';
import { IGanttData, ITaskData, ITaskbarEditedEventArgs, IValidateArgs, IParent, IPredecessor } from '../base/interface';
import { IActionBeginEventArgs, ITaskAddedEventArgs, ITaskDeletedEventArgs, RowDropEventArgs } from '../base/interface';
import { ColumnModel, Column as GanttColumn } from '../models/column';
import { DataManager, DataUtil, Query } from '@syncfusion/ej2-data';
import { ReturnType, RecordDoubleClickEventArgs, Row, Column, IEditCell, EJ2Intance } from '@syncfusion/ej2-grids';
import { getSwapKey, isScheduledTask, getTaskData, isRemoteData, getIndex } from '../base/utils';
import { RowPosition } from '../base/enum';
import { CellEdit } from './cell-edit';
import { TaskbarEdit } from './taskbar-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';
import { NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { MultiSelect, CheckBoxSelection, DropDownList } from '@syncfusion/ej2-dropdowns';
import { ConnectorLineEdit } from './connector-line-edit';



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
    /** @hidden */
    private ganttData: IGanttData[];
    /** @hidden */
    private draggedRecord: IGanttData;
    /** @hidden */
    private updateParentRecords: IGanttData[] = [];
    /** @hidden */
    private droppedRecord: IGanttData;
    /** @hidden */
    public isaddtoBottom: boolean = false;
    /** @hidden */
    private dropPosition: string;
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
        if (this.parent.taskFields.dependency) {
            this.parent.connectorLineEditModule = new ConnectorLineEdit(this.parent);
        }
        if (this.parent.editSettings.allowAdding || (this.parent.editSettings.allowEditing &&
            (this.parent.editSettings.mode === 'Dialog' || this.parent.editSettings.mode === 'Auto'))) {
            this.dialogModule = new DialogEdit(this.parent);
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
        this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
        this.parent.treeGrid.editSettings.allowAdding = this.parent.editSettings.allowAdding;
        this.parent.treeGrid.editSettings.allowDeleting = this.parent.editSettings.allowDeleting;
        this.parent.treeGrid.editSettings.showDeleteConfirmDialog = this.parent.editSettings.showDeleteConfirmDialog;
        this.updateDefaultColumnEditors();
    }

    private getModuleName(): string {
        return 'edit';
    }

    /**
     * Method to update default edit params and editors for Gantt
     */
    private updateDefaultColumnEditors(): void {
        let customEditorColumns: string[] =
            [this.parent.taskFields.id, this.parent.taskFields.progress, this.parent.taskFields.resourceInfo, 'taskType'];
        for (let i: number = 0; i < customEditorColumns.length; i++) {
            if (!isNullOrUndefined(customEditorColumns[i]) && customEditorColumns[i].length > 0) {
                let column: ColumnModel = this.parent.getColumnByField(customEditorColumns[i], this.parent.treeGridModule.treeGridColumns);
                if (column) {
                    if (column.field === this.parent.taskFields.id) {
                        this.updateIDColumnEditParams(column);
                    } else if (column.field === this.parent.taskFields.progress) {
                        this.updateProgessColumnEditParams(column);
                    } else if (column.field === this.parent.taskFields.resourceInfo) {
                        this.updateResourceColumnEditor(column);
                    } else if (column.field === 'taskType') {
                        this.updateTaskTypeColumnEditor(column);
                    }
                }
            }
        }
    }
    /**
     * Method to update editors for id column in Gantt
     */
    private updateIDColumnEditParams(column: ColumnModel): void {
        let editParam: NumericTextBoxModel = {
            min: 0,
            decimals: 0,
            validateDecimalOnType: true,
            format: 'n0',
            showSpinButton: false
        };
        this.updateEditParams(column, editParam);
    }

    /**
     * Method to update edit params of default progress column
     */
    private updateProgessColumnEditParams(column: ColumnModel): void {
        let editParam: NumericTextBoxModel = {
            min: 0,
            decimals: 0,
            validateDecimalOnType: true,
            max: 100,
            format: 'n0'
        };
        this.updateEditParams(column, editParam);
    }
    /**
     * Assign edit params for id and progress columns
     */
    private updateEditParams(column: ColumnModel, editParam: object): void {
        if (isNullOrUndefined(column.edit)) {
            column.edit = {};
            column.edit.params = {};
        } else if (isNullOrUndefined(column.edit.params)) {
            column.edit.params = {};
        }
        extend(column.edit.params, editParam);
        let ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
        ganttColumn.edit = column.edit;
    }
    /**
     * Method to update resource column editor for default resource column
     */
    private updateResourceColumnEditor(column: ColumnModel): void {
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getResourceEditor();
            let ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
            ganttColumn.editType = 'dropdownedit';
            ganttColumn.edit = column.edit;
        }
    }

    /**
     * Method to create resource custom editor
     */
    private getResourceEditor(): IEditCell {
        let resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
        let editObject: IEditCell = {};
        let editor: MultiSelect;
        MultiSelect.Inject(CheckBoxSelection);
        editObject.write = (args: { rowData: Object, element: Element, column: GanttColumn, row: HTMLElement, requestType: string }) => {
            this.parent.treeGridModule.currentEditRow = {};
            editor = new MultiSelect({
                dataSource: new DataManager(this.parent.resources),
                fields: { text: resourceSettings.name, value: resourceSettings.id },
                mode: 'CheckBox',
                showDropDownIcon: true,
                popupHeight: '350px',
                delimiterChar: ',',
                value: this.parent.treeGridModule.getResourceIds(args.rowData as IGanttData) as number[]
            });
            editor.appendTo(args.element as HTMLElement);
        };
        editObject.read = (element: HTMLElement): string => {
            let value: Object[] = (<EJ2Intance>element).ej2_instances[0].value;
            let resourcesName: string[] = [];
            if (isNullOrUndefined(value)) {
                value = [];
            }
            for (let i: number = 0; i < value.length; i++) {
                for (let j: number = 0; j < this.parent.resources.length; j++) {
                    if (this.parent.resources[j][resourceSettings.id] === value[i]) {
                        resourcesName.push(this.parent.resources[j][resourceSettings.name]);
                        break;
                    }
                }
            }
            this.parent.treeGridModule.currentEditRow[this.parent.taskFields.resourceInfo] = value;
            return resourcesName.join(',');
        };
        editObject.destroy = () => {
            if (editor) {
                editor.destroy();
            }
        };
        return editObject;
    }
    /**
     * Method to update task type column editor for task type
     */
    private updateTaskTypeColumnEditor(column: ColumnModel): void {
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getTaskTypeEditor();
            let ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
            ganttColumn.editType = 'dropdownedit';
            ganttColumn.edit = column.edit;
        }
    }
    /**
     * Method to create task type custom editor
     */
    private getTaskTypeEditor(): IEditCell {
        let editObject: IEditCell = {};
        let editor: DropDownList;
        let types: Object[] = [{ 'ID': 1, 'Value': 'FixedUnit' }, { 'ID': 2, 'Value': 'FixedWork' }, { 'ID': 3, 'Value': 'FixedDuration' }];
        editObject.write = (args: { rowData: Object, element: Element, column: GanttColumn, row: HTMLElement, requestType: string }) => {
            this.parent.treeGridModule.currentEditRow = {};
            editor = new DropDownList({
                dataSource: new DataManager(types),
                fields: { value: 'Value' },
                popupHeight: '350px',
                value: getValue('taskType', (args.rowData as IGanttData).ganttProperties),
            });
            editor.appendTo(args.element as HTMLElement);
        };
        editObject.read = (element: HTMLElement): string => {
            let value: string = (<EJ2Intance>element).ej2_instances[0].value;
            let key: string = 'taskType';
            this.parent.treeGridModule.currentEditRow[key] = value;
            return value;
        };
        editObject.destroy = () => {
            if (editor) {
                editor.destroy();
            }
        };
        return editObject;
    }
    /**
     * @private
     */
    public reUpdateEditModules(): void {
        let editSettings: EditSettingsModel = this.parent.editSettings;
        if (editSettings.allowEditing) {
            if (this.parent.editModule.cellEditModule && editSettings.mode === 'Dialog') {
                this.cellEditModule.destroy();
                this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
            } else if (isNullOrUndefined(this.parent.editModule.cellEditModule) && editSettings.mode === 'Auto') {
                this.cellEditModule = new CellEdit(this.parent);
            }
            if (this.parent.editModule.dialogModule && editSettings.mode === 'Auto') {
                this.parent.treeGrid.recordDoubleClick = undefined;
            } else if (isNullOrUndefined(this.parent.editModule.dialogModule)) {
                this.dialogModule = new DialogEdit(this.parent);
            }
        } else {
            if (this.cellEditModule) {
                this.cellEditModule.destroy();
            }
            if (this.dialogModule) {
                this.dialogModule.destroy();
            }
        }

        if (editSettings.allowDeleting && editSettings.showDeleteConfirmDialog) {
            if (isNullOrUndefined(this.confirmDialog)) {
                let confirmDialog: HTMLElement = createElement('div', {
                    id: this.parent.element.id + '_deleteConfirmDialog',
                });
                this.parent.element.appendChild(confirmDialog);
                this.renderDeleteConfirmDialog();
            }
        } else if (!editSettings.allowDeleting || !editSettings.showDeleteConfirmDialog) {
            if (this.confirmDialog && !this.confirmDialog.isDestroyed) {
                this.confirmDialog.destroy();
            }
        }

        if (editSettings.allowTaskbarEditing) {
            if (isNullOrUndefined(this.parent.editModule.taskbarEditModule)) {
                this.taskbarEditModule = new TaskbarEdit(this.parent);
            }
        } else {
            if (this.taskbarEditModule) {
                this.taskbarEditModule.destroy();
            }
        }
    }

    private recordDoubleClick(args: RecordDoubleClickEventArgs): void {
        if (this.parent.editSettings.allowEditing && this.parent.editSettings.mode === 'Dialog') {
            let ganttData: IGanttData;
            if (args.row) {
                let rowIndex: number = getValue('rowIndex', args.row);
                ganttData = this.parent.currentViewData[rowIndex];
            }
            if (!isNullOrUndefined(ganttData)) {
                this.dialogModule.openEditDialog(ganttData);
            }
        }
        this.parent.ganttChartModule.recordDoubleClick(args);
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
        if (isNullOrUndefined(data) || isNullOrUndefined(data[tasks.id])) {
            return;
        }
        let ganttData: IGanttData = this.parent.getRecordByID(data[tasks.id]);
        if (isBlazor()) {
            let keys: string[] = Object.keys(data);
            if (keys.indexOf(tasks.startDate) !== -1 && !isNullOrUndefined(getValue(this.parent.taskFields.startDate, data))) {
                setValue(
                    this.parent.taskFields.startDate,
                    this.parent.dataOperation.getDateFromFormat(getValue(this.parent.taskFields.startDate, data)), data);
            }
            if (keys.indexOf(tasks.endDate) !== -1 && !isNullOrUndefined(getValue(this.parent.taskFields.endDate, data))) {
                setValue(
                    this.parent.taskFields.endDate,
                    this.parent.dataOperation.getDateFromFormat(getValue(this.parent.taskFields.endDate, data)), data);
            }
            /* tslint:disable-next-line */
            if (keys.indexOf(tasks.baselineStartDate) !== -1 && !isNullOrUndefined(getValue(this.parent.taskFields.baselineStartDate, data))) {
                setValue(
                    this.parent.taskFields.baselineStartDate,
                    this.parent.dataOperation.getDateFromFormat(getValue(this.parent.taskFields.baselineStartDate, data)), data);
            }
            if (keys.indexOf(tasks.baselineEndDate) !== -1 && !isNullOrUndefined(getValue(this.parent.taskFields.baselineEndDate, data))) {
                setValue(
                    this.parent.taskFields.baselineEndDate,
                    this.parent.dataOperation.getDateFromFormat(getValue(this.parent.taskFields.baselineEndDate, data)), data);
            }
        }
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
            if (isNullOrUndefined(key) || (isNullOrUndefined(data[key]) && !ganttObj.allowUnscheduledTasks)) {
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
            tasks.baselineEndDate, tasks.id].indexOf(key) !== -1) {
                let column: ColumnModel = ganttObj.columnByField[key];
                /* tslint:disable-next-line */
                let value: any = data[key];
                if (!isNullOrUndefined(column) && (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit')) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                let ganttPropKey: string = ganttPropByMapping[key];
                if (key === tasks.id) {
                    ganttPropKey = 'taskId';
                } else if (key === tasks.name) {
                    ganttPropKey = 'taskName';
                }
                if (!isNullOrUndefined(ganttPropKey)) {
                    ganttObj.setRecordValue(ganttPropKey, value, ganttData.ganttProperties, true);
                }
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
            } else if (tasks.indicators === key) {
                let value: Object[] = data[key];
                ganttObj.setRecordValue('indicators', value, ganttData.ganttProperties, true);
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.work === key) {
                ganttObj.setRecordValue('work', data[key], ganttData.ganttProperties, true);
                this.parent.dataOperation.updateMappingData(ganttData, 'work');
                this.parent.dataOperation.updateMappingData(ganttData, 'duration');
                this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
            } else if (key === 'taskType') {
                ganttObj.setRecordValue('taskType', data[key], ganttData.ganttProperties, true);
                //this.parent.dataOperation.updateMappingData(ganttData, 'taskType');
            } else if (ganttObj.customColumns.indexOf(key) !== -1) {
                let column: ColumnModel = ganttObj.columnByField[key];
                /* tslint:disable-next-line */
                let value: any = data[key];
                if (isNullOrUndefined(column.edit)) {
                    if (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') {
                        value = ganttObj.dataOperation.getDateFromFormat(value);
                    }
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.manual === key) {
                ganttObj.setRecordValue('isAutoSchedule', !data[key], ganttData.ganttProperties, true);
                this.parent.setRecordValue(key, data[key], ganttData);
                this.updateTaskScheduleModes(ganttData);
             }
        }
        if (isScheduleValueUpdated) {
            this.validateScheduleValues(scheduleFieldNames, ganttData, data);
        }
    }

    /**
     * To update duration, work, resource unit 
     * @param currentData
     * @param column 
     */
    public updateResourceRelatedFields(currentData: IGanttData, column: string): void {
        let ganttProp: ITaskData = currentData.ganttProperties;
        let taskType: string = ganttProp.taskType;
        let isEffectDriven: boolean;
        let isAutoSchedule: boolean = ganttProp.isAutoSchedule;
        if (!isNullOrUndefined(ganttProp.resourceInfo)) {
            if (ganttProp.work > 0 || column === 'work') {
                switch (taskType) {
                    case 'FixedUnit':
                        if (isAutoSchedule && ganttProp.resourceInfo.length &&
                            (column === 'work' || ((column === 'resource')))) {
                            this.parent.dataOperation.updateDurationWithWork(currentData);
                        } else if (!isAutoSchedule && column === 'work') {
                            this.parent.dataOperation.updateUnitWithWork(currentData);
                        } else {
                            this.parent.dataOperation.updateWorkWithDuration(currentData);
                        }
                        break;
                    case 'FixedWork':
                        if (ganttProp.resourceInfo.length === 0) {
                            return;
                        } else if (isAutoSchedule) {
                            if (column === 'duration' || column === 'endDate') {
                                this.parent.dataOperation.updateUnitWithWork(currentData);
                                if (ganttProp.duration === 0) {
                                    this.parent.setRecordValue('work', 0, ganttProp);
                                    if (!isNullOrUndefined(this.parent.taskFields.work)) {
                                        this.parent.dataOperation.updateMappingData(currentData, 'work');
                                    }
                                }
                            } else {
                                this.parent.dataOperation.updateDurationWithWork(currentData);
                            }
                        } else {
                            if (column === 'work') {
                                this.parent.dataOperation.updateUnitWithWork(currentData);
                            } else {
                                this.parent.dataOperation.updateWorkWithDuration(currentData);
                            }
                        }
                        break;
                    case 'FixedDuration':
                        if (ganttProp.resourceInfo.length && (column === 'work' || (isAutoSchedule &&
                             isEffectDriven && (column === 'resource')))) {
                            this.parent.dataOperation.updateUnitWithWork(currentData);
                        } else {
                            this.parent.dataOperation.updateWorkWithDuration(currentData);
                        }
                        break;
                }
            } else {
                this.parent.dataOperation.updateWorkWithDuration(currentData);
            }
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
     * Method to update the resource records while editing
     * @private 
     */
    public updateRsourceRecords(args: ITaskbarEditedEventArgs, isResourceEdited?: boolean, previousResources?: Object[]): void {
        let editedRecords: IGanttData[] = [];
        let unassignedTasks: IGanttData;
        if (!args.data.hasChildRecords) {
            for (let i: number = 0; i < this.parent.getTaskIds().length; i++) {
                if (this.parent.getTaskIds()[i] === 'T' + args.data.ganttProperties.taskId) {
                    editedRecords.push(this.parent.currentViewData[i]);
                    this.updateGanttProperties(args.data, this.parent.currentViewData[i]);
                    this.parent.dataOperation.updateTaskData(this.parent.currentViewData[i]);
                }
            }
        }
        if (isResourceEdited) {
            // Block for if the resources of the task gets edited.
            let addRecords: IGanttData[] = [];
            this.deleteRow(editedRecords);
            if (args.data.taskData[this.parent.taskFields.resourceInfo].length) {
                args.data.taskData[this.parent.taskFields.resourceInfo].forEach((resourceID: string) => {
                    let taskIds: string[] = this.parent.getTaskIds();
                    addRecords.push(this.parent.currentViewData[taskIds.indexOf('R' + resourceID)]);
                });
                for (let j: number = 0; j < addRecords.length; j++) {
                    if (!addRecords[j][this.parent.taskFields.resourceInfo]) {
                        let data: IGanttData = { ...args.data };
                        data[this.parent.taskFields.resourceInfo] = data.taskData[this.parent.taskFields.resourceInfo];
                        /* tslint:disable-next-line */
                        this.parent.isSameResourceAdd = true;
                        this.parent.editModule.addRecord(data, 'Child', this.parent.ids.indexOf(addRecords[j].ganttProperties.rowUniqueID));
                        this.parent.isSameResourceAdd = false;
                    }
                }
            } else {
                // Block for if the added record has no resources
                for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                    if (this.parent.currentViewData[i].ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask')) {
                        unassignedTasks = this.parent.currentViewData[i];
                    }
                }
                this.parent.isOnEdit = false;
                if (unassignedTasks) {
                    /* tslint:disable-next-line */
                    this.parent.editModule.addRecord({ ...args.data }, 'Child', this.parent.ids.indexOf(unassignedTasks.ganttProperties.rowUniqueID));
                } else {
                    // Block for create the unassigned task.
                    let unassignTask: Object = {};
                    unassignTask[this.parent.taskFields.id] = 0;
                    unassignTask[this.parent.taskFields.name] = this.parent.localeObj.getConstant('unassignedTask');
                    this.parent.editModule.addRecord({ ...unassignTask }, 'Bottom');
                    this.parent.editModule.addRecord({ ...args.data }, 'Child', this.parent.ids.length - 1);
                }
            }
        } else {
            for (let j: number = 0; j < editedRecords.length; j++) {
                let editArgs: ITaskbarEditedEventArgs = {};
                editArgs.data = editedRecords[j];
                this.parent.isOnEdit = true;
                this.initiateUpdateAction(editArgs);
                this.parent.isOnEdit = false;
            }
        }
    }
    /**
     * Method to copy the ganttProperties values
     * @private
     */
    public updateGanttProperties(data: IGanttData, updateData: IGanttData): void {
        let skipProperty: string[] = ['taskId', 'uniqueID', 'rowUniqueID', 'parentId'];
        Object.keys(data.ganttProperties).forEach((property: string) => {
            if (skipProperty.indexOf(property) === -1) {
                updateData.ganttProperties[property] = data.ganttProperties[property];
            }
        });
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
            this.parent.connectorLineEditModule.addRemovePredecessor(args.data);
        }
        let validateObject: object = {};
        if (isValidatePredecessor) {
            validateObject = this.parent.connectorLineEditModule.validateTypes(args.data);
            this.parent.isConnectorLineUpdate = true;
            if (!isNullOrUndefined(getValue('violationType', validateObject))) {
                let newArgs: IValidateArgs = this.validateTaskEvent(args);
                if (newArgs.validateMode.preserveLinkWithEditing === false &&
                    newArgs.validateMode.removeLink === false &&
                    newArgs.validateMode.respectLink === false) {
                    this.parent.connectorLineEditModule.openValidationDialog(validateObject);
                } else {
                    this.parent.connectorLineEditModule.applyPredecessorOption();
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
        let blazorArgs: IValidateArgs = {};
        this.resetValidateArgs();
        this.parent.currentEditedArgs = newArgs;
        newArgs.cancel = false;
        newArgs.data = editedEventArgs.data;
        newArgs.requestType = 'validateLinkedTask';
        newArgs.validateMode = this.parent.dialogValidateMode;
        newArgs.editEventArgs = editedEventArgs;
        if (isBlazor()) {
            blazorArgs = { ...newArgs };
            this.parent.updateDataArgs(newArgs);
            this.parent.currentEditedArgs = blazorArgs;
        }
        this.parent.actionBeginTask(newArgs);
        return isBlazor() ? blazorArgs : newArgs;
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
        /** Update parent up-to zeroth level */
        if (ganttRecord.parentItem || this.parent.taskMode !== 'Auto') {
            this.parent.dataOperation.updateParentItems(ganttRecord, true);
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
        if (ganttRecord.hasChildRecords && this.taskbarMoved && this.parent.taskMode === 'Auto') {
            this.updateChildItems(ganttRecord);
        }
    }
    /**
     * To update records while changing schedule mode.
     * @return {void}
     * @private
     */
    public updateTaskScheduleModes(data: IGanttData): void {
        let currentValue: Date = data[this.parent.taskFields.startDate];
        let ganttProp: ITaskData = data.ganttProperties;
        if (data.hasChildRecords && ganttProp.isAutoSchedule) {
            this.parent.setRecordValue('startDate', ganttProp.autoStartDate, ganttProp, true);
            this.parent.setRecordValue('endDate', ganttProp.autoEndDate, ganttProp, true);
            this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(data, true), ganttProp, true);
            this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttProp, true), ganttProp, true);
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(ganttProp.width, ganttProp.progress),
                ganttProp,
                true
            );
            this.parent.dataOperation.calculateDuration(data);
         } else  if (data.hasChildRecords && !ganttProp.isAutoSchedule) {
            this.parent.dataOperation.updateWidthLeft(data);
            this.parent.dataOperation.calculateDuration(data);
            this.parent.setRecordValue('autoStartDate', ganttProp.startDate, ganttProp, true);
            this.parent.setRecordValue('autoEndDate', ganttProp.endDate, ganttProp, true);
            this.parent.setRecordValue('autoDuration',  this.parent.dataOperation.calculateAutoDuration(data), ganttProp, true);
            this.parent.dataOperation.updateAutoWidthLeft(data);
        } else {
            let startDate: Date = this.parent.dateValidationModule.checkStartDate(currentValue, data.ganttProperties);
            this.parent.setRecordValue('startDate', startDate, data.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(data, 'startDate');
            this.parent.dateValidationModule.calculateEndDate(data);
            this.parent.setRecordValue(
                'taskData.' + this.parent.taskFields.manual,
                data[this.parent.taskFields.manual], data);
            this.parent.dataOperation.updateWidthLeft(data);
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
                this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, false),
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
                this.parent.dataOperation.getProgressWidth(
                    parent.ganttProperties.isAutoSchedule ? parent.ganttProperties.width : parent.ganttProperties.autoWidth,
                    parentProgress),
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
                /* tslint:disable-next-line */
                let dataId: number | string = this.parent.viewType === 'ProjectView' ? originalData.ganttProperties.taskId : originalData.ganttProperties.rowUniqueID;
                this.parent.treeGrid.grid.setRowData(dataId, originalData);
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
            durationDiff = this.parent.dateValidationModule.getDuration(validStartDate, validEndDate, 'minute', true, false);
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
        if (childRecords.length) {
            this.parent.dataOperation.updateParentItems(ganttRecord, true);
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

    /**
     * 
     * @private
     */
    public initiateSaveAction(args: ITaskbarEditedEventArgs): void {
        this.parent.showSpinner();
        let eventArgs: IActionBeginEventArgs = {};
        let modifiedTaskData: IGanttData[] = [];
        eventArgs.requestType = 'beforeSave';
        eventArgs.data = args.data;
        eventArgs.modifiedRecords = this.parent.editedRecords;
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords);
        if (args.action && args.action === 'DrawConnectorLine') {
            eventArgs.action = 'DrawConnectorLine';
        }
        if (isBlazor()) {
            eventArgs = this.parent.updateDataArgs(eventArgs);
            modifiedTaskData = eventArgs.modifiedTaskData;
        }
        this.parent.trigger('actionBegin', eventArgs, (eventArgs: IActionBeginEventArgs) => {
            if (eventArgs.cancel) {
                this.reUpdatePreviousRecords();
                this.parent.chartRowsModule.refreshRecords([args.data]);
                this.resetEditProperties();
                // Trigger action complete event with save canceled request type
            } else {
                if (isRemoteData(this.parent.dataSource)) {
                    let data: DataManager = this.parent.dataSource as DataManager;
                    let updatedData: object = {
                        changedRecords: isBlazor() ? modifiedTaskData : eventArgs.modifiedTaskData
                    };
                    /* tslint:disable-next-line */
                    let query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                    let crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                    crud.then((e: ReturnType) => this.dmSuccess(e, args))
                        .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                } else {
                    this.saveSuccess(args);
                }
            }
        });
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
        if (this.parent.isConnectorLineUpdate && !isNullOrUndefined(this.parent.connectorLineEditModule)) {
            this.parent.updatedConnectorLineCollection = [];
            this.parent.connectorLineIds = [];
            this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(this.parent.editedRecords);
            this.updateScheduleDatesOnEditing(args);
        }
        if (!this.parent.editSettings.allowTaskbarEditing || (this.parent.editSettings.allowTaskbarEditing &&
            !this.taskbarEditModule.dependencyCancel)) {
            eventArgs.requestType = 'save';
            eventArgs.data = args.data;
            eventArgs.modifiedRecords = this.parent.editedRecords;
            eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords);
            if (!isNullOrUndefined(args.action)) {
                setValue('action', args.action, eventArgs);
            }
            if (args.action === 'TaskbarEditing') {
                eventArgs.taskBarEditAction = args.taskBarEditAction;
            }
            this.endEditAction(args);
            if (isBlazor()) {
                this.parent.updateDataArgs(eventArgs);
            }
            this.parent.trigger('actionComplete', eventArgs);
        } else {
            this.taskbarEditModule.dependencyCancel = false;
            this.resetEditProperties();
            if (isBlazor()) {
                this.parent.updateDataArgs(eventArgs);
            }
        }
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
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
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

    private deleteResourceRecords(selectedRecords: IGanttData[]): void {
        let deleteRecords: IGanttData[] = [];
        for (let i: number = 0; i < selectedRecords.length; i++) {
            /* tslint:disable-next-line */
            if (selectedRecords[i].parentItem) {
                for (let j: number = 0; j < this.parent.getTaskIds().length; j++) {
                    if (this.parent.getTaskIds()[j] === 'T' + selectedRecords[i].ganttProperties.taskId) {
                        deleteRecords.push(this.parent.currentViewData[j]);
                    }
                }
            }
        }
        this.deleteRow(deleteRecords);
    }

    private deleteSelectedItems(): void {
        if (!this.isFromDeleteMethod) {
            let selectedRecords: IGanttData[] = [];
            if (this.parent.selectionSettings.mode !== 'Cell') {
                selectedRecords = this.parent.selectionModule.getSelectedRecords();
            } else if (this.parent.selectionSettings.mode === 'Cell') {
                selectedRecords = this.parent.selectionModule.getCellSelectedRecords();
            }
            if (this.parent.viewType === 'ResourceView') {
                this.deleteResourceRecords(selectedRecords);
            } else {
                this.deleteRow(selectedRecords);
            }
        } else {
            if (this.targetedRecords.length) {
                if (this.parent.viewType === 'ResourceView') {
                    this.deleteResourceRecords(this.targetedRecords);
                } else {
                    this.deleteRow(this.targetedRecords);
                }
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
            rowItems.forEach((item: IGanttData): void => {
                item.isDelete = true;
            });
            if (this.parent.viewType === 'ResourceView' && !tasks.length) {
                rowItems = [];
            }
            for (let i: number = 0; i < rowItems.length; i++) {
                let deleteRecord: IGanttData = rowItems[i];
                if (this.deletedTaskDetails.indexOf(deleteRecord) !== -1) {
                    continue;
                }
                if (deleteRecord.parentItem) {
                    let childRecord: IGanttData[] = this.parent.getParentTask(deleteRecord.parentItem).childRecords;
                    let filteredRecord: IGanttData[] = childRecord.length === 1 ?
                        childRecord : childRecord.filter((data: IGanttData): boolean => {
                            return !data.isDelete;
                        });
                    if (filteredRecord.length > 0) {
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
            if (this.parent.selectionModule && this.parent.allowSelection) {
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

    public removePredecessorOnDelete(record: IGanttData): void {
        let predecessors: IPredecessor[] = record.ganttProperties.predecessor;
        for (let i: number = 0; i < predecessors.length; i++) {
            let predecessor: IPredecessor = predecessors[i];
            if (predecessor.from.toString() === record.ganttProperties.rowUniqueID.toString()) {
                let toRecord: IGanttData = this.parent.getRecordByID(predecessor.to.toString());
                if (!isNullOrUndefined(toRecord)) {
                let toRecordPredcessor: IPredecessor[] = extend([], [], toRecord.ganttProperties.predecessor, true) as IPredecessor[];
                let index: number;
                for (let t: number = 0; t < toRecordPredcessor.length; t++) {
                    if (toRecordPredcessor[t].to.toString() === toRecord.ganttProperties.rowUniqueID.toString()
                        && toRecordPredcessor[t].from.toString() === record.ganttProperties.rowUniqueID.toString()) {
                        index = t;
                        break;
                    }
                }
                toRecordPredcessor.splice(index, 1);
                this.updatePredecessorValues(toRecord, toRecordPredcessor);
            }
            } else if (predecessor.to.toString() === record.ganttProperties.rowUniqueID.toString()) {
                let fromRecord: IGanttData = this.parent.getRecordByID(predecessor.from.toString());
                if (!isNullOrUndefined(fromRecord)) {
                let fromRecordPredcessor: IPredecessor[] = extend([], [], fromRecord.ganttProperties.predecessor, true) as IPredecessor[];
                let index: number;
                for (let t: number = 0; t < fromRecordPredcessor.length; t++) {
                    if (fromRecordPredcessor[t].from.toString() === fromRecord.ganttProperties.rowUniqueID.toString()
                        && fromRecordPredcessor[t].to.toString() === record.ganttProperties.rowUniqueID.toString()) {
                        index = t;
                        break;
                    }
                }
                fromRecordPredcessor.splice(index, 1);
                this.updatePredecessorValues(fromRecord, fromRecordPredcessor);
            }
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

    /**
     * Method to update TaskID of a gantt record
     */
    public updateTaskId(currentId: string | number, newId: number | string): void {
        let cId: string = typeof currentId === 'number' ? currentId.toString() : currentId;
        let nId: string = typeof newId === 'number' ? newId.toString() : newId;
        let ids: string[] = this.parent.ids;
        if (!isNullOrUndefined(cId) && !isNullOrUndefined(nId)) {
            let cIndex: number = ids.indexOf(cId);
            let nIndex: number = ids.indexOf(nId);
            // return false for invalid taskID
            if (cIndex === -1 || nIndex > -1) {
                return;
            }
            let thisRecord: IGanttData = this.parent.flatData[cIndex];
            thisRecord.ganttProperties.taskId = thisRecord.ganttProperties.rowUniqueID = nId;
            thisRecord.taskData[this.parent.taskFields.id] = nId;
            thisRecord[this.parent.taskFields.id] = nId;
            ids[cIndex] = nId;
            if (thisRecord.hasChildRecords && this.parent.taskFields.parentID) {
                let childRecords: IGanttData[] = thisRecord.childRecords;
                for (let count: number = 0; count < childRecords.length; count++) {
                    let childRecord: IGanttData = childRecords[count];
                    childRecord[this.parent.taskFields.parentID] = newId;
                    this.parent.chartRowsModule.refreshRecords([childRecord]);
                }
            }
            if (this.parent.taskFields.dependency && !isNullOrUndefined(thisRecord.ganttProperties.predecessor)) {
                let predecessors: IPredecessor[] = thisRecord.ganttProperties.predecessor;
                let currentGanttRecord: IGanttData;
                for (let i: number = 0; i < predecessors.length; i++) {
                    let predecessor: IPredecessor = predecessors[i];
                    if (predecessor.to === cId) {
                        currentGanttRecord = this.parent.flatData[ids.indexOf(predecessor.from)];
                    } else if (predecessor.from === cId) {
                        currentGanttRecord = this.parent.flatData[ids.indexOf(predecessor.to)];
                    }
                    this.updatePredecessorOnUpdateId(currentGanttRecord, cId, nId);
                }
            }
            this.updatePredecessorOnUpdateId(thisRecord, cId, nId);
            this.parent.treeGrid.refresh();
        }
    }
    private updatePredecessorOnUpdateId(currentGanttRecord: IGanttData, cId: string, nId: string): void {
        if (this.parent.currentViewData.indexOf(currentGanttRecord) > -1) {
            let pred: IPredecessor[] = currentGanttRecord.ganttProperties.predecessor;
            for (let j: number = 0; j < pred.length; j++) {
                let pre: IPredecessor = pred[j];
                if (pre.to === cId) {
                    pre.to = nId;
                } else if (pre.from === cId) {
                    pre.from = nId;
                }
            }
        }
        this.updatePredecessorValues(currentGanttRecord, currentGanttRecord.ganttProperties.predecessor);
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

    public removeFromDataSource(deleteRecordIDs: string[]): void {
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
        let blazorArgs: IActionBeginEventArgs = {};
        if (isBlazor()) {
            eventArgs = this.parent.updateDataArgs(eventArgs);
            blazorArgs.modifiedTaskData = eventArgs.modifiedTaskData;
            blazorArgs.data = eventArgs.data;
        }
        this.parent.trigger('actionBegin', eventArgs, (eventArgs: IActionBeginEventArgs) => {
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
                        /* tslint:disable-next-line */
                        deletedRecords: isBlazor() ? getTaskData(blazorArgs.data as IGanttData[]) : getTaskData(eventArgs.data as IGanttData[]), // to check
                        changedRecords: isBlazor() ? blazorArgs.modifiedTaskData : eventArgs.modifiedTaskData
                    };
                    if (isBlazor()) {
                        let blazAddedRec : string =  'addedRecords';
                        updatedData[blazAddedRec] = [];
                    }
                    let crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id) as Promise<Object>;
                    crud.then((e: ReturnType) => this.deleteSuccess(args))
                        .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                } else {
                    this.deleteSuccess(args);
                }
            }
        });
    }

    private deleteSuccess(args: ITaskDeletedEventArgs): void {
        let flatData: IGanttData[] = this.parent.flatData;
        let currentData: IGanttData[] = this.parent.currentViewData;
        let deletedRecords: IGanttData[] = this.parent.getRecordFromFlatdata(args.deletedRecordCollection);
        let deleteRecordIDs: string[] = [];
        for (let i: number = 0; i < deletedRecords.length; i++) {
            let deleteRecord: IGanttData = deletedRecords[i];
            let currentIndex: number = currentData.indexOf(deleteRecord);
            let flatIndex: number = flatData.indexOf(deleteRecord);
            let treeGridParentIndex: number = this.parent.treeGrid.parentData.indexOf(deleteRecord);
            let childIndex: number;
            if (currentIndex !== -1) { currentData.splice(currentIndex, 1); }
            if (flatIndex !== -1) { flatData.splice(flatIndex, 1); }
            if (!isNullOrUndefined(deleteRecord)) {
                deleteRecordIDs.push(deleteRecord.ganttProperties.rowUniqueID.toString());
                if (flatIndex !== -1) {
                    this.parent.ids.splice(flatIndex, 1);
                    if (this.parent.viewType === 'ResourceView') {
                        this.parent.getTaskIds().splice(flatIndex, 1);
                    }
                }
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
                this.updateTreeGridUniqueID(deleteRecord, 'delete');
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
        if (isBlazor()) {
            this.parent.updateDataArgs(eventArgs);
        }
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
            if (ids.indexOf(obj[taskModel.id].toString()) !== -1 && !this.parent.isSameResourceAdd) {
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
                obj[taskModel.endDate] = this.parent.getFormatedDate(startDate, this.parent.getDateFormat());
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
        cAddedRecord.index = parseInt(cAddedRecord.ganttProperties.rowUniqueID.toString(), 10) - 1;
        if (!isNullOrUndefined(parentItem)) {
            this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), cAddedRecord);
            let pIndex: number = cAddedRecord.parentItem ? cAddedRecord.parentItem.index : null;
            this.parent.setRecordValue('parentIndex', pIndex, cAddedRecord);
            let parentUniqId: string = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
            this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
            if (!isNullOrUndefined(this.parent.taskFields.id) &&
                !isNullOrUndefined(this.parent.taskFields.parentID) && cAddedRecord.parentItem) {
                this.parent.setRecordValue(this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord.taskData, true);
                this.parent.setRecordValue('parentId', cAddedRecord.parentItem.taskId, cAddedRecord.ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord, true);
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
    public getChildCount(record: IGanttData, count: number): number {
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
    public updatePredecessorOnIndentOutdent(parentRecord: IGanttData): void {
        let len: number = parentRecord.ganttProperties.predecessor.length;
        let parentRecordTaskData: ITaskData = parentRecord.ganttProperties;
        let predecessorCollection: IPredecessor[] = parentRecordTaskData.predecessor;
        let childRecord: IGanttData;
        let predecessorIndex: number;
        let id: string;
        let updatedPredecessor: IPredecessor[] = [];
        for (let count: number = 0; count < len; count++) {
            if (predecessorCollection[count].to === parentRecordTaskData.rowUniqueID.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].from);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                let predecessorCollections: IPredecessor[];
                predecessorCollections = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                predecessorCollections.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', predecessorCollections, childRecord.ganttProperties, true);
            } else if (predecessorCollection[count].from === parentRecordTaskData.rowUniqueID.toString()) {
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
            if (record.ganttProperties.rowUniqueID.toString() !== predecessorCollection[count].from) {
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
        let recordIndex: number;
        let updatedCollectionIndex: number;
        let childIndex: number;
        switch (rowPosition) {
            case 'Top':
                flatRecords.splice(0, 0, record);
                currentViewData.splice(0, 0, record);
                ids.splice(0, 0, record.ganttProperties.rowUniqueID.toString()); // need to check NAN
                break;
            case 'Bottom':
                flatRecords.push(record);
                currentViewData.push(record);
                ids.push(record.ganttProperties.rowUniqueID.toString()); // need to check NAN
                if (this.parent.viewType === 'ResourceView') {
                    let taskId: string = record.level === 0 ? 'R' + record.ganttProperties.taskId : 'T' + record.ganttProperties.taskId;
                    this.parent.getTaskIds().push(taskId);
                }
                break;
            case 'Above':
                /*Record Updates*/
                recordIndex = flatRecords.indexOf(this.addRowSelectedItem);
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem);
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
                        this.parent.expandByID(Number(this.addRowSelectedItem.ganttProperties.rowUniqueID));
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
        ids.splice(recordIndex, 0, record.ganttProperties.rowUniqueID.toString());
        if (this.parent.viewType === 'ResourceView') {
            let taskId: string = record.level === 0 ? 'R' + record.ganttProperties.taskId : 'T' + record.ganttProperties.taskId;
            this.parent.getTaskIds().splice(recordIndex, 0, taskId);
        }
        /* data Source update */
        if (!isNullOrUndefined(parentItem)) {
            childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem);
            /*Child collection update*/
            parentItem.childRecords.splice(childIndex, 0, record);
            if (this.parent.dataSource instanceof DataManager &&
                isNullOrUndefined(parentItem.taskData[this.parent.taskFields.parentID])) {
                let child: string = this.parent.taskFields.child;
                if (parentItem.taskData[child] && parentItem.taskData[child].length > 0) {
                    parentItem.taskData[child].push(record.taskData);
                } else {
                    parentItem.taskData[child] = [];
                    parentItem.taskData[child].push(record.taskData);
                }
            }
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
        eventArgs.action =  eventArgs.requestType  = event;
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
    public updateRealDataSource(addedRecord: IGanttData, rowPosition: RowPosition): void {
        let taskFields: TaskFieldsModel = this.parent.taskFields;
        let dataSource: Object[] = this.parent.dataSource as Object[];
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
            let child : string = this.parent.taskFields.child;
            if (this.isBreakLoop) {
                break;
            }
            if (getValue(
                this.parent.taskFields.id, dataCollection[i]).toString() ===
                this.addRowSelectedItem.ganttProperties.rowUniqueID.toString()) {
                if (rowPosition === 'Above') {
                    dataCollection.splice(i, 0, record);
                } else if (rowPosition === 'Below') {
                    dataCollection.splice(i + 1, 0, record);
                } else if (rowPosition === 'Child') {
                    if (dataCollection[i][child] && dataCollection[i][child].length > 0) {
                        dataCollection[i][child].push(record);
                    } else {
                        dataCollection[i][child] = [];
                        dataCollection[i][child].push(record);
                    }
                }
                this.isBreakLoop = true;
                break;
            } else if (dataCollection[i][child]) {
                let childRecords: ITaskData[] = dataCollection[i][child];
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
    /* tslint:disable-next-line:max-func-body-length */
    public addRecord(data?: Object | IGanttData, rowPosition?: RowPosition, rowIndex?: number): void {
        if (this.parent.editModule && this.parent.editSettings.allowAdding) {
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
        let blazorArgs: ITaskAddedEventArgs = {};
        if (isBlazor()) {
            if (!Array.isArray(args.data)) {
                let customData: IGanttData[] = [];
                customData.push(args.data);
                setValue('data', customData, args);
            }
            blazorArgs = { ...args };
        }
        this.parent.trigger('actionBegin', args, (args: ITaskAddedEventArgs) => {
            if (!args.cancel) {
                if (rowPosition === 'Child' && this.addRowSelectedItem && this.addRowSelectedItem.ganttProperties.predecessor
                    && this.addRowSelectedItem.ganttProperties.predecessor.length > 0) {
                    this.updatePredecessorOnIndentOutdent(this.addRowSelectedItem);
                }
                if (isBlazor()) {
                    blazorArgs.data = blazorArgs.data[0];
                    args = blazorArgs;
                    this._resetProperties();
                }
                if (isRemoteData(this.parent.dataSource)) {
                    let data: DataManager = this.parent.dataSource as DataManager;
                    let updatedData: object = {
                        addedRecords: [args.newTaskData], // to check
                        changedRecords: args.modifiedTaskData
                    };
                    let prevID: string = args.data.ganttProperties.taskId.toString();
                    /* tslint:disable-next-line */
                    let query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                    let crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                    crud.then((e: { addedRecords: Object[], changedRecords: Object[] }) => {
                        if (this.parent.taskFields.id && !isNullOrUndefined(e.addedRecords[0][this.parent.taskFields.id]) &&
                            e.addedRecords[0][this.parent.taskFields.id].toString() !== prevID) {
                            this.parent.setRecordValue(
                                'taskId', e.addedRecords[0][this.parent.taskFields.id], args.data.ganttProperties, true);
                            this.parent.setRecordValue(
                                'taskData.' + this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data);
                            this.parent.setRecordValue(
                                this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data);
                            this.parent.setRecordValue(
                                'rowUniqueID', e.addedRecords[0][this.parent.taskFields.id].toString(), args.data.ganttProperties, true);
                            let idsIndex: number = this.parent.ids.indexOf(prevID);
                            if (idsIndex !== -1) {
                            this.parent.ids[idsIndex] = e.addedRecords[0][this.parent.taskFields.id].toString();
                            }
                        }
                        if (cAddedRecord.level === 0) {
                            this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                        }
                        this.updateTreeGridUniqueID(cAddedRecord, 'add');
                        this.refreshNewlyAddedRecord(args, cAddedRecord);
                        this._resetProperties();
                    }).catch((e: { result: Object[] }) => {
                        this.removeAddedRecord();
                        this.dmFailure(e as { result: Object[] }, args);
                        this._resetProperties();
                    });
                } else {
                    this.updateRealDataSource(args.data, rowPosition);
                    if (cAddedRecord.level === 0) {
                        this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                    }
                    this.updateTreeGridUniqueID(cAddedRecord, 'add');
                    this.refreshNewlyAddedRecord(args, cAddedRecord);
                    this._resetProperties();
                }
            } else {
                args = isBlazor() ? blazorArgs : args;
                this.removeAddedRecord();
                this.reUpdatePreviousRecords();
                if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                    this.dialogModule.dialogObj.hide();
                }
                this.dialogModule.dialogClose();
                this._resetProperties();
            }
        });
        }
    }
    /**
     * Method to reset the flag after adding new record
     */
    private _resetProperties(): void {
        this.parent.isOnEdit = false;
        this.parent.hideSpinner();
        this.addRowSelectedItem = null;
        this.newlyAddedRecordBackup = null;
        this.isBreakLoop = false;
        this.parent.element.tabIndex = 0;
        this.parent.initiateEditAction(false);
    }

    /**
     * Method to update unique id collection in TreeGrid
     */
    private updateTreeGridUniqueID(data: IGanttData, action: string): void {
        if (action === 'add') {
            setValue('uniqueIDCollection.' + data.uniqueID, data, this.parent.treeGrid);
        } else if (action === 'delete') {
            deleteObject(getValue('uniqueIDCollection', this.parent.treeGrid), data.uniqueID);
        }
    }


    private refreshNewlyAddedRecord(args: ITaskAddedEventArgs, cAddedRecord: IGanttData): void {
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
        if (isBlazor()) {
            this.parent.updateDataArgs(args);
        }
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
        let idsIndex: number = ids.indexOf(this.newlyAddedRecordBackup.ganttProperties.rowUniqueID.toString());
        deleteObject(this.parent.previousRecords, flatRecords[flatRecordsIndex].uniqueID);
        if (this.newlyAddedRecordBackup.parentItem) {
            let parentItem: IGanttData = this.parent.getParentTask(this.newlyAddedRecordBackup.parentItem);
            let parentIndex: number = parentItem.childRecords.indexOf(this.newlyAddedRecordBackup);
            parentItem.childRecords.splice(parentIndex, 1);
            if (parentItem.childRecords.length === 0) {
                parentItem.hasChildRecords = false;
            }
        }
        flatRecords.splice(flatRecordsIndex, 1);
        currentViewData.splice(currentViewDataIndex, 1);
        ids.splice(idsIndex, 1);
    }
    /**
     * indent a selected record
     */
    public indent(): void {
        let index : number = this.parent.selectedRowIndex;
        let isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
            this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        let dropIndex: number;
        let prevRecord: IGanttData = this.parent.currentViewData[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
        if (!this.parent.editSettings.allowEditing || index === 0 || index === -1 || !isSelected ||
            this.parent.viewType === 'ResourceView' || this.parent.currentViewData[index].level - prevRecord.level === 1) {
                return;
        } else {
            if (prevRecord.level > (this.parent.selectionModule.getSelectedRecords()[0] as IGanttData).level) {
                let thisParent: IGanttData = this.parent.getRecordByID(prevRecord.parentItem.taskId);
                for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                    if ((this.parent.currentViewData[i] as IGanttData).taskData === thisParent.taskData) {
                        dropIndex = i;
                    }
                }
            } else {
                dropIndex = this.parent.selectionModule.getSelectedRowIndexes()[0] - 1;
            }
            this.indentOutdentRow([this.parent.selectionModule.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
    }

    /**
     * To perform outdent operation for selected row
     */
    public outdent(): void {
        let index: number = this.parent.selectionModule.getSelectedRowIndexes()[0];
        let dropIndex: number;
        let isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
            this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        if (!this.parent.editSettings.allowEditing || index === -1 || index === 0 || !isSelected ||
            this.parent.viewType === 'ResourceView' || this.parent.currentViewData[index].level === 0) {
            return;
        } else {
            let thisParent : IGanttData = this.parent.getRecordByID((this.parent.selectionModule.getSelectedRecords()[0] as
            IGanttData).parentItem.taskId);
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                if ((this.parent.currentViewData[i] as IGanttData).taskData === thisParent.taskData) {
                    dropIndex = i;
                }
            }
            this.indentOutdentRow([index], dropIndex, 'below');
        }
    }
    private indentOutdentRow(fromIndexes: number[], toIndex: number, pos: string): void {
        if (fromIndexes[0] !== toIndex && pos === 'above' || 'below' || 'child') {
            if (pos === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (pos === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (pos === 'child') {
                this.dropPosition = 'middleSegment';
            }
            let action: string;
            let record: IGanttData[] = [];
            for (let i: number = 0; i < fromIndexes.length; i++) {
                record[i] = this.parent.currentViewData[fromIndexes[i]];
            }
            let isByMethod: boolean = true;
            let args: RowDropEventArgs = {
                data: record,
                dropIndex: toIndex,
                dropPosition: this.dropPosition
            };
            if (this.dropPosition === 'middleSegment') {
                action =  'indenting';
            } else if (this.dropPosition === 'bottomSegment') {
                action =  'outdenting';
            }
            let actionArgs: IActionBeginEventArgs = {
                action : action,
                data: record[0],
                cancel: false
            };
            this.parent.trigger('actionBegin', actionArgs, (actionArgs: IActionBeginEventArgs) => {
                if (!actionArgs.cancel) {
                    this.reArrangeRows(args, isByMethod);
                } else {
                    return;
                }
            });
        } else {
            return;
        }
    }
    private reArrangeRows(args: RowDropEventArgs, isByMethod?: boolean): void {
        this.dropPosition = args.dropPosition;
        if (args.dropPosition !== 'Invalid' && this.parent.editModule) {
            let obj: Gantt = this.parent; let draggedRec: IGanttData; let droppedRec: IGanttData;
            this.droppedRecord = obj.currentViewData[args.dropIndex];
            let dragRecords: IGanttData[] = [];
            droppedRec = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data as IGanttData);
            } else {
                dragRecords = args.data;
            }
            let c: number = 0;
            let dLength: number = dragRecords.length;
            for (let i: number = 0; i < dLength; i++) {
                this.parent.isOnEdit = true;
                draggedRec = dragRecords[i];
                this.draggedRecord = draggedRec;
                if (this.dropPosition !== 'Invalid') {
                    if (isByMethod) {
                        this.deleteDragRow();
                    }
                    let recordIndex1: number = this.ganttData.indexOf(droppedRec);
                    if (this.dropPosition === 'topSegment') {
                        this.dropAtTop(recordIndex1);
                    }
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRec.hasChildRecords) {
                            if (this.parent.taskFields.parentID && (this.parent.dataSource as IGanttData[]).length > 0) {
                               (this.parent.dataSource as IGanttData[]).splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.parent.flatData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            this.ganttData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());

                        } else {
                            c = this.parent.editModule.getChildCount(droppedRec, 0);
                            if (this.parent.taskFields.parentID && (this.parent.dataSource as IGanttData[]).length > 0) {
                               (this.parent.dataSource as IGanttData[]).splice(recordIndex1 + c + 1, 0, this.draggedRecord.taskData);
                            }
                            this.ganttData.splice(recordIndex1 + c + 1, 0, this.draggedRecord);
                            this.parent.flatData.splice(recordIndex1 + c + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + c + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                        }
                        draggedRec.parentItem = this.ganttData[recordIndex1].parentItem;
                        draggedRec.parentUniqueID = this.ganttData[recordIndex1].parentUniqueID;
                        draggedRec.level = this.ganttData[recordIndex1].level;
                        if (draggedRec.hasChildRecords) {
                            let level: number = 1;
                            this.updateChildRecordLevel(draggedRec, level);
                            this.updateChildRecord(draggedRec, recordIndex1 + c + 1);
                        }
                        if (droppedRec.parentItem) {
                            let record: IGanttData[] = this.parent.getParentTask(droppedRec.parentItem).childRecords;
                            let childRecords: IGanttData[] = record;
                            let droppedRecordIndex: number = childRecords.indexOf(droppedRec) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRec);
                        }
                    }
                    if (this.dropPosition === 'middleSegment') {
                        this.dropMiddle(recordIndex1);
                    }
                    if (!isNullOrUndefined(draggedRec.parentItem && this.updateParentRecords.indexOf(draggedRec.parentItem) !== -1)) {
                        this.updateParentRecords.push(draggedRec.parentItem);
                    }
                }
                this.refreshDataSource();
            }
            if (this.dropPosition === 'middleSegment') {
                if (droppedRec.ganttProperties.predecessor) {
                this.parent.editModule.removePredecessorOnDelete(droppedRec);
                droppedRec.ganttProperties.predecessor = null;
                droppedRec.ganttProperties.predecessorsName = null;
                droppedRec[this.parent.taskFields.dependency] = null;
                droppedRec.taskData[this.parent.taskFields.dependency] = null;
            }
                if (droppedRec.ganttProperties.isMilestone) {
                    this.parent.setRecordValue('isMilestone', false, droppedRec.ganttProperties, true);
                    if (!isNullOrUndefined(droppedRec.taskData[this.parent.taskFields.milestone])) {
                        if (droppedRec.taskData[this.parent.taskFields.milestone] === true) {
                            droppedRec.taskData[this.parent.taskFields.milestone] = false;
                        }
                    }
                }
        }
            for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[k]);
            }
            this.updateParentRecords = [];
            this.parent.isOnEdit = false;
        }
        this.parent.treeGrid.refresh();
        if (this.dropPosition === 'middleSegment') {
            args.requestType = 'indented';
        } else if (this.dropPosition === 'bottomSegment') {
            args.requestType = 'outdented';
        }
        args.modifiedRecords = this.parent.editedRecords;
        this.parent.trigger('actionComplete', args);
        this.parent.editedRecords = [];
    }
    private refreshDataSource(): void {
        let draggedRec: IGanttData = this.draggedRecord;
        let droppedRec: IGanttData = this.droppedRecord;
        let proxy: Gantt = this.parent;
        let tempData: Object;
        let indx: number;
        if (this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.json.length > 0) {
            tempData = (<DataManager>proxy.dataSource).dataSource.json;
        } else {
            tempData = proxy.dataSource;
        }
        if ((tempData as IGanttData[]).length > 0 && (!isNullOrUndefined(droppedRec) && !droppedRec.parentItem)) {
            for (let i: number = 0; i < Object.keys(tempData).length; i++) {
                if (tempData[i][this.parent.taskFields.child] === droppedRec.taskData[this.parent.taskFields.child]) {
                    indx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.taskFields.parentID) {
                    (tempData as IGanttData[]).splice(indx, 0, draggedRec.taskData);
                }
           } else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.taskFields.parentID) {
                    (tempData as IGanttData[]).splice(indx + 1, 0, draggedRec.taskData);
                }
           }
        } else if (!this.parent.taskFields.parentID && (!isNullOrUndefined(droppedRec) && droppedRec.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                let rowPos: RowPosition = this.dropPosition === 'topSegment' ? 'Above' : 'Below';
                this.parent.editModule.addRowSelectedItem = droppedRec;
                this.parent.editModule.updateRealDataSource(draggedRec, rowPos);
                delete this.parent.editModule.addRowSelectedItem;
            }
        }
        if (this.parent.taskFields.parentID) {
           if (draggedRec.parentItem) {
              if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                draggedRec[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.parentID];
                draggedRec.taskData[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.parentID];
              } else {
                draggedRec[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.id];
                draggedRec.taskData[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.id];
              }
           } else {
            draggedRec[this.parent.taskFields.parentID] = null;
            draggedRec.taskData[this.parent.taskFields.parentID] = null;
           }
        }
    }
    private deleteDragRow(): void {
        if (this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.json.length > 0) {
            this.ganttData = this.parent.dataSource.dataSource.json;
        } else {
            this.ganttData = this.parent.currentViewData as IGanttData[];
        }
        let delRow: IGanttData;
        delRow = this.parent.getTaskByUniqueID(this.draggedRecord.uniqueID);
        this.removeRecords(delRow);
    }

    private dropAtTop(recordIndex1: number): void {
        let obj: Gantt = this.parent;
        if (obj.taskFields.parentID && (this.parent.dataSource as IGanttData[]).length > 0) {
            (this.parent.dataSource as IGanttData[]).splice(recordIndex1, 0, this.draggedRecord.taskData);
        }
        this.draggedRecord.level = this.ganttData[recordIndex1].level;
        this.draggedRecord.parentUniqueID = this.ganttData[recordIndex1].parentUniqueID;
        this.draggedRecord.parentItem = this.ganttData[recordIndex1].parentItem;
        this.ganttData.splice(recordIndex1, 0, this.draggedRecord);
        this.parent.flatData.splice(recordIndex1, 0, this.draggedRecord);
        this.parent.ids.splice(recordIndex1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
        if (this.draggedRecord.hasChildRecords) {
            let levl: number = 1;
            this.updateChildRecord(this.draggedRecord, recordIndex1);
            this.updateChildRecordLevel(this.draggedRecord, levl);
        }
        if (this.droppedRecord.parentItem) {
            let record: IGanttData[] = this.parent.getParentTask(this.droppedRecord.parentItem).childRecords;
            let childRecords: IGanttData[] = record;
            let droppedRecordIndex: number = childRecords.indexOf(this.droppedRecord);
            childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
        }
        if (!isNullOrUndefined(this.draggedRecord.parentItem && this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
            this.updateParentRecords.push(this.draggedRecord.parentItem);
        }
    }
    private dropMiddle(recordIndex1: number): void {
        let obj: Gantt = this.parent;
        let childRec: number = this.parent.editModule.getChildCount(this.droppedRecord, 0);
        let childRecordsLength: number = (isNullOrUndefined(childRec) ||
            childRec === 0) ? recordIndex1 + 1 :
            childRec + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (obj.taskFields.parentID &&  (this.parent.dataSource as IGanttData[]).length > 0) {
                (this.parent.dataSource as IGanttData[]).splice(childRecordsLength, 0, this.draggedRecord.taskData);
            }
            this.parent.flatData.splice(childRecordsLength, 0, this.draggedRecord);
            this.ganttData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.ids.splice(childRecordsLength, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
            if (isNullOrUndefined(this.draggedRecord.parentItem &&
                this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
                this.updateParentRecords.push(this.draggedRecord.parentItem);
            }
        }
    }
    private updateChildRecordLevel(record: IGanttData, levl: number): number {
        let length: number = 0;
        let currentRec: IGanttData;
        levl++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let j: number = 0; j < length; j++) {
            currentRec = record.childRecords[j];
            let parentData: IGanttData;
            if (record.parentItem) {
                parentData = this.parent.getParentTask(record.parentItem);
            }
            currentRec.level = record.parentItem ? parentData.level + levl : record.level + 1;
            if (currentRec.hasChildRecords) {
                levl--;
                levl = this.updateChildRecordLevel(currentRec, levl);
            }
        }
        return levl;
    }
    private updateChildRecord(record: IGanttData, count: number, expanded?: boolean): number {
        let currentRec: IGanttData;
        let obj: Gantt = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRec = record.childRecords[i];
            count++;
            obj.currentViewData.splice(count, 0, currentRec);
            obj.flatData.splice(count, 0, currentRec);
            this.parent.ids.splice(count, 0, currentRec.ganttProperties.rowUniqueID.toString());
            if (obj.taskFields.parentID && (obj.dataSource as IGanttData[]).length > 0) {
                (obj.dataSource as IGanttData[]).splice(count, 0, currentRec.taskData);
            }
            if (currentRec.hasChildRecords) {
                count = this.updateChildRecord(currentRec, count);
            }
        }
        return count;
    }
    private removeRecords(record: IGanttData): void {
        let obj: Gantt = this.parent;
        let dataSource: Object;
        dataSource = this.parent.dataSource;
        let delRow: IGanttData = record;
        let flatParent: IGanttData = this.parent.getParentTask(delRow.parentItem);
        if (delRow) {
            if (delRow.parentItem) {
                let childRecords: IGanttData[] = flatParent ? flatParent.childRecords : [];
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(delRow);
                    flatParent.childRecords.splice(childIndex, 1);
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParent);
                }
            }
             //method to delete the record from datasource collection
            if (delRow && !this.parent.taskFields.parentID) {
                let deleteRecordIDs: string[] = [];
                deleteRecordIDs.push(delRow.ganttProperties.rowUniqueID.toString());
                this.parent.editModule.removeFromDataSource(deleteRecordIDs);
            }
            if (obj.taskFields.parentID) {
                if (delRow.hasChildRecords && delRow.childRecords.length > 0) {
                    this.removeChildItem(delRow);
                }
                let indx: number;
                let ganttData: IGanttData[] = (dataSource as IGanttData[]).length > 0 ?
                    dataSource as IGanttData[] : this.parent.currentViewData;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (ganttData[i][this.parent.taskFields.id] === delRow.taskData[this.parent.taskFields.id]) {
                        indx = i;
                    }
                }
                if (indx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(indx, 1);
                    }
                    this.ganttData.splice(indx, 1);
                    this.parent.flatData.splice(indx, 1);
                    this.parent.ids.splice(indx, 1);
                }
            }
            let recordIdx: number = this.ganttData.indexOf(delRow);
            if (!obj.taskFields.parentID) {
                let deletedRecordCount: number = this.parent.editModule.getChildCount(delRow, 0);
                this.ganttData.splice(recordIdx, deletedRecordCount + 1);
                this.parent.flatData.splice(recordIdx, deletedRecordCount + 1);
                this.parent.ids.splice(recordIdx, deletedRecordCount + 1);
            }
            if (delRow.parentItem && flatParent && flatParent.childRecords && !flatParent.childRecords.length) {
                flatParent.expanded = false;
                flatParent.hasChildRecords = false;
            }
        }
    }
    private removeChildItem(record: IGanttData): void {
        let obj: Gantt = this.parent;
        let currentRec: IGanttData;
        let indx: number;
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRec = record.childRecords[i];
            let data: Object;
            data = (this.parent.dataSource as IGanttData[]).length > 0 ?
               this.parent.dataSource as IGanttData[] : this.parent.currentViewData;
            for (let i: number = 0; i < (< IGanttData[]>data).length; i++) {
                if (data[i][this.parent.taskFields.id] === currentRec.taskData[this.parent.taskFields.id]) {
                    indx = i;
                }
            }
            if (indx !== -1) {
                if ((obj.dataSource as IGanttData[]).length > 0) {
                    (obj.dataSource as IGanttData[]).splice(indx, 1);
                }
                this.ganttData.splice(indx, 1);
                this.parent.flatData.splice(indx, 1);
                this.parent.ids.splice(indx, 1);
            }
            if (currentRec.hasChildRecords) {
                this.removeChildItem(currentRec);
            }
        }
    }
    private recordLevel(): void {
        let obj: Gantt = this.parent;
        let draggedRec: IGanttData = this.draggedRecord;
        let droppedRec: IGanttData = this.droppedRecord;
        let childItem: string = obj.taskFields.child;
        if (!droppedRec.hasChildRecords) {
            droppedRec.hasChildRecords = true;
            if (!droppedRec.childRecords.length) {
                droppedRec.childRecords = [];
                if (!obj.taskFields.parentID && isNullOrUndefined(droppedRec.taskData[childItem])) {
                    droppedRec.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            let parentItem: IGanttData = extend({}, droppedRec);
            delete parentItem.childRecords;
            let createParentItem: IParent = {
                uniqueID : parentItem.uniqueID,
                expanded : parentItem.expanded,
                level : parentItem.level,
                index : parentItem.index,
                taskId : parentItem.ganttProperties.rowUniqueID
            };
            draggedRec.parentItem = createParentItem;
            draggedRec.parentUniqueID = droppedRec.uniqueID;
            droppedRec.childRecords.splice(droppedRec.childRecords.length, 0, draggedRec);
            if (!isNullOrUndefined(draggedRec) && !obj.taskFields.parentID && !isNullOrUndefined(droppedRec.taskData[childItem])) {
                droppedRec.taskData[obj.taskFields.child].splice(droppedRec.childRecords.length, 0, draggedRec.taskData);
            }
            if (!draggedRec.hasChildRecords) {
                draggedRec.level = droppedRec.level + 1;
            } else {
                let level: number = 1;
                draggedRec.level = droppedRec.level + 1;
                this.updateChildRecordLevel(draggedRec, level);
            }
            droppedRec.expanded = true;
        }
    }
}