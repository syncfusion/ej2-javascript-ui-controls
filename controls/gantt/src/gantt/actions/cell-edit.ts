import { isNullOrUndefined as isNOU, getValue, getElement, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ITaskData, ITaskbarEditedEventArgs, IGanttData, CellEditArgs, ITaskSegment } from '../base/interface';
import { ColumnModel } from '../models/column';
import { EJ2Intance } from '@syncfusion/ej2-grids';
import { TaskFieldsModel, EditDialogFieldSettingsModel, ResourceFieldsModel } from '../models/models';
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
    public isResourceCellEdited: boolean = false;
    public editedColumn: ColumnModel;
    constructor(ganttObj: Gantt) {
        this.parent = ganttObj;
        this.bindTreeGridProperties();
    }
    /**
     * Bind all editing related properties from Gantt to TreeGrid
     *
     * @returns {void} .
     */
    private bindTreeGridProperties(): void {
        this.parent.treeGrid.editSettings.allowEditing = this.parent.editSettings.allowEditing;
        this.parent.treeGrid.editSettings.allowNextRowEdit = this.parent.editSettings.allowNextRowEdit;
        this.parent.treeGrid.editSettings.mode = 'Cell';
        this.parent.treeGrid.cellEdit = this.ensureEditCell.bind(this);
        if (this.parent.editSettings.allowEditing) {
            TreeGrid.Inject(Edit);
        }
    }
    /**
     * Ensure current cell was editable or not
     *
     * @param {CellEditArgs} args .
     * @returns {void | Deferred} .
     */
    private ensureEditCell(args: CellEditArgs): void | Deferred {
        const data: IGanttData = args.rowData;
        const field: string = args.columnName;
        this.editedColumn = this.parent.getColumnByField(field, this.parent.ganttColumns);
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        if (this.parent.readOnly) {
            args.cancel = true;
            return;
        }
        if (this.parent.editSettings.mode === 'Dialog') {
            args.cancel = true;
            return;
        }
        if (data.hasChildRecords && ((field === taskSettings.endDate && ((!isNullOrUndefined(data['isManual']) &&
            data['isManual'] === false) || this.parent.taskMode === 'Auto')) || field === taskSettings.duration
            ||field === taskSettings.progress || field === taskSettings.work || field === 'taskType')) {
            args.cancel = true;
        } else {
            const callBackPromise: Deferred = new Deferred();
            this.parent.trigger('cellEdit', args, (arg: CellEditArgs) => {
                if (data.level === 0 && this.parent.viewType === 'ResourceView') {
                    arg.cancel = true;
                }
                callBackPromise.resolve(arg);
                if (!arg.cancel) {
                    if (arg.columnName === this.parent.taskFields.notes) {
                        this.openNotesEditor(arg);
                    } else {
                        this.isCellEdit = true;
                        if (!isNOU(this.parent.toolbarModule)) {
                            this.parent.toolbarModule.refreshToolbarItems();
                        }
                    }
                }
            });
            return callBackPromise;
        }
    }
    /**
     * To render edit dialog and to focus on notes tab
     *
     * @param {CellEditArgs} args .
     * @returns {void} .
     */
    private openNotesEditor(args: CellEditArgs): void {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const data: IGanttData = args.rowData;
        const field: string = args.columnName;
        if ((field === taskSettings.notes && !this.parent.showInlineNotes)) {
            args.cancel = true;
            const columnTypes: string[] =
                this.parent.editModule.dialogModule.updatedEditFields.map((x: EditDialogFieldSettingsModel) => { return x.type; });
            const index: number = columnTypes.indexOf('Notes');
            if (index !== -1) {
                this.parent.editModule.dialogModule.openEditDialog(data.ganttProperties.rowUniqueID);
                const tabObj: Tab = (<EJ2Intance>document.getElementById(this.parent.element.id + '_Tab')).ej2_instances[0];
                tabObj.selectedItem = index;
            }
        }
        if (field === taskSettings.notes && this.parent.showInlineNotes === true) {
            this.isCellEdit = true;
        }
    }
    private isValueChange(args: Record<string, unknown>, field: string): boolean {
        const data: IGanttData = getValue('data', args);
        const editedValue: Record<string, unknown> = data[field];
        const previousValue: Record<string, unknown> = getValue('previousData', args);
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
     *
     * @param {object} args .
     * @param {object} editedObj .
     * @returns {void} .
     * @private
     */
    public initiateCellEdit(args: object, editedObj: object): void {
        const column: ColumnModel = getValue('column', args);
        const data: IGanttData = getValue('data', args);
        const editedArgs: ITaskbarEditedEventArgs = {};
        editedArgs.action = 'CellEditing';
        editedArgs.data = this.parent.getTaskByUniqueID(data.uniqueID);
        const previousValue: Record<string, unknown> = getValue('previousData', args);
        const editedValue: object = this.parent.allowUnscheduledTasks ? data[column.field] : ((isNullOrUndefined(data[column.field])
            || data[column.field] === '') && (this.parent.taskFields.duration === column.field ||
                this.parent.taskFields.startDate === column.field || this.parent.taskFields.endDate === column.field)) ? previousValue
            : data[column.field];
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
                this.resourceEdited(editedArgs, editedObj, data);
            } else if (column.field === this.parent.taskFields.progress) {
                this.progressEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.baselineStartDate
                || column.field === this.parent.taskFields.baselineEndDate) {
                this.baselineEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.dependency) {
                this.dependencyEdited(editedArgs, previousValue);
            } else if (column.field === this.parent.taskFields.notes) {
                this.notedEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.work) {
                this.workEdited(editedArgs);
            } else if (column.field === 'taskType' && !isNOU(this.parent.taskFields.work)) {
                this.typeEdited(editedArgs, editedObj);
            } else if (column.field === this.parent.taskFields.manual) {
                this.taskmodeEdited(editedArgs);
            } else {
                this.parent.setRecordValue('taskData.' + column.field, editedArgs.data[column.field], editedArgs.data);
                this.parent.editModule.initiateSaveAction(editedArgs);
            }
        } else {
            this.parent.editModule.endEditAction(args);
        }
        this.isCellEdit = false;
        if (!isNullOrUndefined(this.parent.editModule.cellEditModule.editedColumn)) {
            this.parent.editModule.cellEditModule.editedColumn = null;
        }
        if (!isNOU(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * To update task name cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private taskNameEdited(args: ITaskbarEditedEventArgs): void {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.name, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('taskName', args.data[this.parent.taskFields.name], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    }
    /**
     * To update task notes cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private notedEdited(args: ITaskbarEditedEventArgs): void {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.notes, args.data[this.parent.taskFields.notes], args.data);
        this.parent.setRecordValue('notes', args.data[this.parent.taskFields.notes], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    }
    /**
     * To update task schedule mode cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private taskmodeEdited(args: ITaskbarEditedEventArgs): void {
        this.parent.setRecordValue(
            'isAutoSchedule',
            !args.data[this.parent.taskFields.manual],
            args.data.ganttProperties, true);
        this.parent.editModule.updateTaskScheduleModes(args.data);
        this.updateEditedRecord(args);
    }
    /**
     * To update task start date cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private startDateEdited(args: ITaskbarEditedEventArgs): void {
        const ganttData: IGanttData = args.data;
        const ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = args.data[this.parent.taskFields.startDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        currentValue = this.parent.dateValidationModule.checkStartDate(currentValue, ganttData.ganttProperties, ganttData.ganttProperties.isMilestone);
        if (isNOU(currentValue)) {
            if (!ganttData.hasChildRecords) {
                this.parent.setRecordValue('startDate', null, ganttProb, true);
                this.parent.setRecordValue('duration', null, ganttProb, true);
                this.parent.setRecordValue('isMilestone', false, ganttProb, true);
                if (this.parent.allowUnscheduledTasks && isNOU(this.parent.taskFields.endDate)) {
                    this.parent.setRecordValue('endDate', null, ganttProb, true);
                }
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

    public validateEndDateWithSegments(ganttProp: ITaskData): ITaskSegment[] {
        const ganttSegments: ITaskSegment[] = [];
        const segments: ITaskSegment[] = ganttProp.segments;
        for (let i: number = 0; i < segments.length; i++) {
            const segment: ITaskSegment = segments[i];
            let endDate: Date = segment.endDate;
            endDate = (!isNullOrUndefined(ganttProp.endDate)) && endDate.getTime() <
                ganttProp.endDate.getTime() && i !== segments.length - 1 ? endDate : ganttProp.endDate;
            segment.duration = this.parent.dataOperation.getDuration(
                segment.startDate, endDate, ganttProp.durationUnit, ganttProp.isAutoSchedule,
                ganttProp.isMilestone
            );
            if (segments.length > 0 && endDate.getTime() < segment.startDate.getTime()
                && endDate.getTime() <= ganttProp.endDate.getTime()) {
                segments[i - 1].duration = this.parent.dataOperation.getDuration(
                    segments[i - 1].startDate, ganttProp.endDate, ganttProp.durationUnit,
                    ganttProp.isAutoSchedule, ganttProp.isMilestone);
                continue;
            }
            ganttSegments.push(segment);
        }
        return ganttSegments;
    }

    /**
     * To update task end date cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private endDateEdited(args: ITaskbarEditedEventArgs): void {
        const ganttProb: ITaskData = args.data.ganttProperties;
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
            if (!isNullOrUndefined(ganttProb.segments)) {
                ganttProb.segments = this.validateEndDateWithSegments(ganttProb);
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
        }
        if (!isNullOrUndefined(args.data.ganttProperties.segments) && args.data.ganttProperties.segments.length > 0) {
            this.parent.setRecordValue(
                'segments', this.parent.dataOperation.setSegmentsInfo(args.data, false), args.data.ganttProperties, true
            );
            this.parent.dataOperation.updateMappingData(args.data, 'segments');
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
        this.parent.editModule.updateResourceRelatedFields(args.data, 'endDate');
        this.updateEditedRecord(args);
    }
    /**
     * To update duration cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private durationEdited(args: ITaskbarEditedEventArgs): void {
        const ganttProb: ITaskData = args.data.ganttProperties;
        const durationString: string = args.data[this.parent.taskFields.duration];
        this.parent.dataOperation.updateDurationValue(durationString, ganttProb);
        this.updateDates(args);
        this.parent.editModule.updateResourceRelatedFields(args.data, 'duration');
        this.updateEditedRecord(args);
    }
    /**
     * To update start date, end date based on duration
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private updateDates(args: ITaskbarEditedEventArgs): void {
        const ganttProb: ITaskData = args.data.ganttProperties;
        const endDate: Date = this.parent.dateValidationModule.getDateFromFormat(ganttProb.endDate);
        const startDate: Date = this.parent.dateValidationModule.getDateFromFormat(ganttProb.startDate);
        const currentDuration: number = ganttProb.duration;
        if (isNOU(currentDuration)) {
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
            if (args.data[this.parent.taskFields.duration]!=null) {
                this.parent.setRecordValue('endDate', null, ganttProb, true);
            }
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
            if (!isNullOrUndefined(ganttProb.segments) && ganttProb.segments.length > 0) {
                this.parent.setRecordValue('segments', this.parent.dataOperation.setSegmentsInfo(args.data, false), ganttProb, true);
                this.parent.dataOperation.updateMappingData(args.data, 'segments');
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(args.data);
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
    }
    /**
     * To update progress cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private progressEdited(args: ITaskbarEditedEventArgs): void {
        const ganttRecord: IGanttData = args.data;
        this.parent.setRecordValue(
            'progress',
            (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]),
            ganttRecord.ganttProperties, true);
        this.parent.setRecordValue(
            'taskData.' + this.parent.taskFields.progress,
            (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]),
            args.data);
        if (!ganttRecord.ganttProperties.isAutoSchedule) {
            this.parent.setRecordValue('autoWidth',
                                       this.parent.dataOperation.calculateWidth(ganttRecord, false), ganttRecord.ganttProperties, true);
        }
        if (!isNullOrUndefined(args.data.ganttProperties.segments) && args.data.ganttProperties.segments.length > 0 &&
           !isNullOrUndefined(this.parent.editModule.taskbarEditModule)) {
            this.parent.editModule.taskbarEditModule.updateSegmentProgress(args.data.ganttProperties);
        }
        if (!args.data.hasChildRecords) {
            const width: number = ganttRecord.ganttProperties.isAutoSchedule ? ganttRecord.ganttProperties.width :
                ganttRecord.ganttProperties.autoWidth;
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(width, ganttRecord.ganttProperties.progress),
                ganttRecord.ganttProperties,
                true
            );
        }
        this.updateEditedRecord(args);
    }
    /**
     * To update baselines with new baseline start date and baseline end date
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private baselineEdited(args: ITaskbarEditedEventArgs): void {
        const ganttRecord: ITaskData = args.data.ganttProperties;
        const baseLineStartDate: Date = args.data[this.parent.taskFields.baselineStartDate];
        const baseLineEndDate: Date = args.data[this.parent.taskFields.baselineEndDate];
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
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @param {object} editedObj .
     * @param {IGanttData} previousData .
     * @returns {void} .
     */
    private resourceEdited(args: ITaskbarEditedEventArgs, editedObj: Object, previousData: IGanttData): void {
        const resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
        const editedResourceId: string[] = editedObj[this.parent.taskFields.resourceInfo];
        if (editedResourceId) {
            this.isResourceCellEdited = true;
            const tempResourceInfo: Object[] = this.parent.dataOperation.setResourceInfo(editedObj);
            const editedResouceLength: number = tempResourceInfo.length;
            const previousResource: Object[] = previousData.ganttProperties.resourceInfo;
            let index: number;
            const editedResources: Object[] = [];
            const resourceData: Object[] = this.parent.resources;
            let newIndex: number;
            for (let count: number = 0; count < editedResouceLength; count++) {
                if (previousResource) {
                    const previousResourceLength: number = previousResource.length;
                    for (newIndex = 0; newIndex < previousResourceLength; newIndex++) {
                        if (previousResource[newIndex][resourceSettings.id] === editedResourceId[count]) {
                            index = newIndex;
                            break;
                        } else {
                            index = -1;
                        }
                    }
                }
                if (!isNOU(index) && index !== -1) {
                    editedResources.push(previousResource[index]);
                } else {
                    const resource: Object[] = resourceData.filter((resourceInfo: Object) => {
                        return (editedResourceId[count] === resourceInfo[resourceSettings.id]);
                    });
                    const ganttDataResource: Object = extend({}, resource[0]);
                    ganttDataResource[resourceSettings.unit] = 100;
                    editedResources.push(ganttDataResource);
                }
            }
            args.data.ganttProperties.resourceInfo = editedResources;
            this.parent.dataOperation.updateMappingData(args.data, 'resourceInfo');
            this.parent.editModule.updateResourceRelatedFields(args.data, 'resource');
            if (this.parent.viewType === 'ResourceView') {
                this.parent.editModule.dialogModule.isResourceUpdate = true;
                this.parent.editModule.dialogModule.previousResource = previousResource;
            }
            this.updateDates(args);
            this.updateEditedRecord(args);
        }
    }
    /**
     * To update task's predecessor cell with new value
     *
     * @param {ITaskbarEditedEventArgs} editedArgs .
     * @param {object} cellEditArgs .
     * @returns {void} .
     */
    private dependencyEdited(editedArgs: ITaskbarEditedEventArgs, cellEditArgs: object): void {
        this.parent.predecessorModule.updateUnscheduledDependency(editedArgs.data);
        if (!this.parent.connectorLineEditModule.updatePredecessor(
            editedArgs.data,
            editedArgs.data[this.parent.taskFields.dependency], editedArgs)) {
            this.parent.editModule.revertCellEdit(cellEditArgs);
        }
    }
    /**
     * To update task's work cell with new value
     *
     * @param {ITaskbarEditedEventArgs} editedArgs .
     * @returns {void} .
     */
    private workEdited(editedArgs: ITaskbarEditedEventArgs): void {
        const ganttProb: ITaskData = editedArgs.data.ganttProperties;
        const workValue: number = editedArgs.data[this.parent.taskFields.work];
        this.parent.setRecordValue('work', workValue, ganttProb, true);
        this.parent.editModule.updateResourceRelatedFields(editedArgs.data, 'work');
        this.updateDates(editedArgs);
        this.updateEditedRecord(editedArgs);
    }
    /**
     * To update task type cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @param {object} editedObj .
     * @returns {void} .
     */
    private typeEdited(args: ITaskbarEditedEventArgs, editedObj: Object): void {
        const key: string = 'taskType';
        const ganttProb: ITaskData = args.data.ganttProperties;
        const taskType: string = editedObj[key];
        this.parent.setRecordValue('taskType', taskType, ganttProb, true);
        //this.parent.dataOperation.updateMappingData(args.data, 'taskType');
        this.updateEditedRecord(args);
    }
    /**
     * To compare start date and end date from Gantt record
     *
     * @param {ITaskData} ganttRecord .
     * @returns {number} .
     */
    private compareDatesFromRecord(ganttRecord: ITaskData): number {
        const sDate: Date = this.parent.dateValidationModule.getValidStartDate(ganttRecord);
        const eDate: Date = this.parent.dateValidationModule.getValidEndDate(ganttRecord);
        return this.parent.dateValidationModule.compareDates(sDate, eDate);
    }
    /**
     * To start method save action with edited cell value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     */
    private updateEditedRecord(args: ITaskbarEditedEventArgs): void {
        this.parent.editModule.initiateUpdateAction(args);
    }
    /**
     * To remove all public private properties
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
        this.parent.editModule.cellEditModule = undefined;
    }
}
