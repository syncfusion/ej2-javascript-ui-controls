import { isNullOrUndefined as isNOU, getValue, isBlazor, getElement } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ITaskData, ITaskbarEditedEventArgs, IGanttData, CellEditArgs } from '../base/interface';
import { ColumnModel } from '../models/column';
import { EJ2Intance } from '@syncfusion/ej2-grids';
import { TaskFieldsModel, EditDialogFieldSettingsModel } from '../models/models';
import { TreeGrid, Edit } from '@syncfusion/ej2-treegrid';
import { Deferred } from '@syncfusion/ej2-data';
import { Tab } from '@syncfusion/ej2-navigations';
/**
 * To handle cell edit action on default columns and custom columns
 */
export class CellEdit {
    private parent: Gantt;
    /**
     * @private
     */
    public isCellEdit: boolean = false;
    constructor(ganttObj: Gantt) {
        this.parent = ganttObj;
        this.bindTreeGridProperties();
    }
    /**
     * Bind all editing related properties from Gantt to TreeGrid
     */
    private bindTreeGridProperties(): void {
        this.parent.treeGrid.editSettings.allowEditing = this.parent.editSettings.allowEditing;
        this.parent.treeGrid.editSettings.mode = 'Cell';
        this.parent.treeGrid.cellEdit = this.ensureEditCell.bind(this);
        if (this.parent.editSettings.allowEditing) {
            TreeGrid.Inject(Edit);
        }
    }
    /**
     * Ensure current cell was editable or not
     * @param args 
     */
    private ensureEditCell(args: CellEditArgs): void | Deferred {
        let data: IGanttData = args.rowData;
        let field: string = args.columnName;
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        if (this.parent.editSettings.mode === 'Dialog') {
            args.cancel = true;
            return;
        }
        if (data.hasChildRecords && (field === taskSettings.endDate || field === taskSettings.duration
            || field === taskSettings.dependency || field === taskSettings.progress)) {
            args.cancel = true;
        } else {
            let callBackPromise: Deferred = new Deferred();
            this.parent.trigger('cellEdit', args, (args: CellEditArgs) => {
                if (isBlazor()) {
                    args.cell = getElement(args.cell);
                    args.row = getElement(args.row);
                }
                callBackPromise.resolve(args);
                if (!args.cancel) {
                    this.isCellEdit = true;
                    if (!isNOU(this.parent.toolbarModule)) {
                        this.parent.toolbarModule.refreshToolbarItems();
                    }
                    if (args.columnName === this.parent.taskFields.notes) {
                        this.openNotesEditor(args);
                    }
                }
            });
            return callBackPromise;
        }
    }
    /**
     * To render edit dialog and to focus on notes tab
     * @param args 
     */
    private openNotesEditor(args: CellEditArgs): void {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let data: IGanttData = args.rowData;
        let field: string = args.columnName;
        if ((field === taskSettings.notes && !this.parent.showInlineNotes)) {
            args.cancel = true;
            let columnTypes: string[] =
                this.parent.editModule.dialogModule.updatedEditFields.map((x: EditDialogFieldSettingsModel) => { return x.type; });
            let index: number = columnTypes.indexOf('Notes');
            if (index !== -1) {
                this.parent.editModule.dialogModule.openEditDialog(data.ganttProperties.taskId);
                let tabObj: Tab = (<EJ2Intance>document.getElementById(this.parent.element.id + '_Tab')).ej2_instances[0];
                tabObj.selectedItem = index;
            }
        }
    }
    private isValueChange(args: object, field: string): boolean {
        let data: IGanttData = getValue('data', args);
        let editedValue: object = data[field];
        let previousValue: object = getValue('previousData', args);
        if ((isNOU(editedValue) && !isNOU(previousValue)) || (!isNOU(editedValue) && isNOU(previousValue))) {
            return true;
        } else if (!isNOU(editedValue) && !isNOU(previousValue)) {
            if (editedValue instanceof Date) {
                return editedValue.getTime() !== data.taskData[field].getTime() ? true : false;
            } else if (field === this.parent.taskFields.resourceInfo) {
                return editedValue !== previousValue ? true : false;
            } else if (editedValue !== data.taskData[field]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Initiate cell save action on Gantt with arguments from TreeGrid
     * @param args 
     * @param editedObj 
     * @private
     */
    public initiateCellEdit(args: object, editedObj: object): void {
        let column: ColumnModel = getValue('column', args);
        let data: IGanttData = getValue('data', args);
        let editedArgs: ITaskbarEditedEventArgs = {};
        editedArgs.action = 'CellEditing';
        editedArgs.data = this.parent.getTaskByUniqueID(data.uniqueID);
        let previousValue: object = getValue('previousData', args);
        let tempEditedValue: boolean = column.editType === 'stringedit' &&
         column.field === 'Duration' ? data[column.field] !== '' : !isNOU(data[column.field]);
        let editedValue: object = this.parent.allowUnscheduledTasks ? data[column.field] : tempEditedValue ? data[column.field] :
            previousValue;
        if (!isNOU(data)) {
            data[column.field] = previousValue;
            editedArgs.data[column.field] = previousValue;
            this.parent.initiateEditAction(true);
            this.parent.setRecordValue(column.field, editedValue, editedArgs.data);
            if (column.field === this.parent.taskFields.name) {
                this.taskNameEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.startDate) {
                this.startDateEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.endDate) {
                this.endDateEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.duration) {
                this.durationEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.resourceInfo) {
                this.resourceEdited(editedArgs, editedObj);
            } else if (column.field === this.parent.taskFields.progress) {
                this.progressEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.baselineStartDate
                || column.field === this.parent.taskFields.baselineEndDate) {
                this.baselineEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.dependency) {
                this.dependencyEdited(editedArgs, previousValue);
            } else if (column.field === this.parent.taskFields.notes) {
                this.notedEdited(editedArgs);
            } else {
                this.parent.setRecordValue('taskData.' + column.field, editedArgs.data[column.field], editedArgs.data);
                this.parent.editModule.initiateSaveAction(editedArgs);
            }
        } else {
            this.parent.editModule.endEditAction(args);
        }
        this.isCellEdit = false;
        if (!isNOU(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * To update task name cell with new value
     * @param args 
     */
    private taskNameEdited(args: ITaskbarEditedEventArgs): void {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.name, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('taskName', args.data[this.parent.taskFields.name], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    }
    /**
     * To update task notes cell with new value
     * @param args 
     */
    private notedEdited(args: ITaskbarEditedEventArgs): void {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.notes, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('notes', args.data[this.parent.taskFields.notes], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    }
    /**
     * To update task start date cell with new value
     * @param args 
     */
    private startDateEdited(args: ITaskbarEditedEventArgs): void {
        let ganttData: IGanttData = args.data;
        let ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = args.data[this.parent.taskFields.startDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        currentValue = this.parent.dateValidationModule.checkStartDate(currentValue);
        if (isNOU(currentValue)) {
            if (!ganttData.hasChildRecords) {
                this.parent.setRecordValue('startDate', null, ganttProb, true);
                this.parent.setRecordValue('duration', null, ganttProb, true);
                this.parent.setRecordValue('isMilestone', false, ganttProb, true);
            }
        } else if (ganttProb.endDate || !isNOU(ganttProb.duration)) {
            this.parent.setRecordValue('startDate', new Date(currentValue.getTime()), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(ganttData);
        } else if (isNOU(ganttProb.endDate) && isNOU(ganttProb.duration)) {
            this.parent.setRecordValue('startDate', new Date(currentValue.getTime()), ganttProb, true);
        }
        this.parent.setRecordValue('isMilestone', ganttProb.duration === 0 ? true : false, ganttProb, true);
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(ganttData, 'startDate');
        this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
        this.parent.dataOperation.updateMappingData(ganttData, 'duration');
        this.updateEditedRecord(args);
    }

    /**
     * To update task end date cell with new value
     * @param args 
     */
    private endDateEdited(args: ITaskbarEditedEventArgs): void {
        let ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = args.data[this.parent.taskFields.endDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        if (isNOU(currentValue)) {
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            this.parent.setRecordValue('duration', null, ganttProb, true);
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
        } else {
            if ((currentValue.getHours() === 0 && this.parent.defaultEndTime !== 86400)) {
                this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, currentValue);
            }
            currentValue = this.parent.dateValidationModule.checkEndDate(currentValue, ganttProb);
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            if (!isNOU(ganttProb.startDate) && isNOU(ganttProb.duration)) {
                if (this.parent.dateValidationModule.compareDates(ganttProb.endDate, ganttProb.startDate) === -1) {
                    this.parent.setRecordValue('endDate', new Date(ganttProb.startDate.getTime()), ganttProb, true);
                    this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, ganttProb.endDate);
                }
            } else if (!isNOU(ganttProb.duration) && isNOU(ganttProb.startDate)) {
                this.parent.setRecordValue(
                    'startDate',
                    this.parent.dateValidationModule.getStartDate(ganttProb.endDate, ganttProb.duration, ganttProb.durationUnit, ganttProb),
                    ganttProb,
                    true
                );
            }
            if (this.compareDatesFromRecord(ganttProb) === -1) {
                this.parent.dateValidationModule.calculateDuration(args.data);
            } else {
                this.parent.editModule.revertCellEdit(args);
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            if (ganttProb.isMilestone) {
                this.parent.setRecordValue(
                    'startDate',
                    this.parent.dateValidationModule.checkStartDate(ganttProb.startDate, ganttProb),
                    ganttProb,
                    true
                );
            }
            this.parent.dataOperation.updateWidthLeft(args.data);
        }
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
        this.updateEditedRecord(args);
    }
    /**
     * To update duration cell with new value
     * @param args 
     */
    private durationEdited(args: ITaskbarEditedEventArgs): void {
        let ganttProb: ITaskData = args.data.ganttProperties;
        let endDate: Date = this.parent.dateValidationModule.getDateFromFormat(ganttProb.endDate);
        let startDate: Date = this.parent.dateValidationModule.getDateFromFormat(ganttProb.startDate);
        let durationString: string = args.data[this.parent.taskFields.duration];
        this.parent.dataOperation.updateDurationValue(durationString, ganttProb);
        let currentDuration: number = ganttProb.duration;

        if (isNOU(currentDuration)) {
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
            this.parent.setRecordValue('endDate', null, ganttProb, true);
        } else {
            if (isNOU(startDate) && !isNOU(endDate)) {
                this.parent.setRecordValue(
                    'startDate',
                    this.parent.dateValidationModule.getStartDate(endDate, currentDuration, ganttProb.durationUnit, ganttProb),
                    ganttProb,
                    true
                );
            }
            if (currentDuration !== 0 && ganttProb.isMilestone) {
                this.parent.setRecordValue('isMilestone', false, ganttProb, true);
                this.parent.setRecordValue(
                    'startDate',
                    this.parent.dateValidationModule.checkStartDate(ganttProb.startDate, ganttProb),
                    ganttProb,
                    true
                );
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(args.data);
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
        this.updateEditedRecord(args);
    }
    /**
     * To update progress cell with new value
     * @param args 
     */
    private progressEdited(args: ITaskbarEditedEventArgs): void {
        let ganttRecord: IGanttData = args.data;
        this.parent.setRecordValue(
            'progress',
            (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]),
            ganttRecord.ganttProperties, true);
        this.parent.setRecordValue(
            'taskData.' + this.parent.taskFields.progress,
            (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]),
            args.data);
        if (!args.data.hasChildRecords) {
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(ganttRecord.ganttProperties.width, ganttRecord.ganttProperties.progress),
                ganttRecord.ganttProperties,
                true
            );
        }
        this.updateEditedRecord(args);
    }
    /**
     * To update baselines with new baseline start date and baseline end date
     * @param args 
     */
    private baselineEdited(args: ITaskbarEditedEventArgs): void {
        let ganttRecord: ITaskData = args.data.ganttProperties;
        let baseLineStartDate: Date = args.data[this.parent.taskFields.baselineStartDate];
        let baseLineEndDate: Date = args.data[this.parent.taskFields.baselineEndDate];
        if (baseLineEndDate && baseLineEndDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, baseLineEndDate);
        }
        this.parent.setRecordValue(
            'baselineStartDate',
            this.parent.dateValidationModule.checkBaselineStartDate(baseLineStartDate),
            ganttRecord,
            true);
        this.parent.setRecordValue(
            'baselineEndDate',
            this.parent.dateValidationModule.checkBaselineEndDate(baseLineEndDate),
            ganttRecord,
            true);
        if (ganttRecord.baselineStartDate && ganttRecord.baselineEndDate) {
            this.parent.setRecordValue(
                'baselineLeft',
                this.parent.dataOperation.calculateBaselineLeft(ganttRecord),
                ganttRecord, true
            );
            this.parent.setRecordValue(
                'baselineWidth',
                this.parent.dataOperation.calculateBaselineWidth(ganttRecord),
                ganttRecord,
                true
            );
        }
        this.updateEditedRecord(args);
    }
    /**
     * To update task's resource cell with new value
     * @param args 
     * @param editedObj 
     */
    private resourceEdited(args: ITaskbarEditedEventArgs, editedObj: Object): void {
        if (editedObj[this.parent.taskFields.resourceInfo]) {
            args.data.ganttProperties.resourceInfo = this.parent.dataOperation.setResourceInfo(editedObj);
            this.parent.dataOperation.updateMappingData(args.data, 'resourceInfo');
            this.updateEditedRecord(args);
        }
    }
    /**
     * To update task's predecessor cell with new value
     * @param editedArgs 
     * @param cellEditArgs 
     */
    private dependencyEdited(editedArgs: ITaskbarEditedEventArgs, cellEditArgs: Object): void {
        if (!this.parent.connectorLineEditModule.updatePredecessor(
            editedArgs.data,
            editedArgs.data[this.parent.taskFields.dependency])) {
            this.parent.editModule.revertCellEdit(cellEditArgs);
        }
    }
    /**
     * To compare start date and end date from Gantt record
     * @param ganttRecord 
     */
    private compareDatesFromRecord(ganttRecord: ITaskData): number {
        let sDate: Date = this.parent.dateValidationModule.getValidStartDate(ganttRecord);
        let eDate: Date = this.parent.dateValidationModule.getValidEndDate(ganttRecord);
        return this.parent.dateValidationModule.compareDates(sDate, eDate);
    }
    /**
     * To start method save action with edited cell value
     * @param args 
     */
    private updateEditedRecord(args: ITaskbarEditedEventArgs): void {
        this.parent.editModule.initiateUpdateAction(args);
    }
    /**
     * To remove all public private properties
     * @private
     */
    public destroy(): void {
        // Destroy Method
        this.parent.editModule.cellEditModule = undefined;
    }
}