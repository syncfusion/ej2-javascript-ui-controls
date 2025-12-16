import { isNullOrUndefined as isNOU, getValue, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ITaskData, ITaskbarEditedEventArgs, IGanttData, CellEditArgs, ITaskSegment } from '../base/interface';
import { ColumnModel } from '../models/column';
import { EJ2Intance } from '@syncfusion/ej2-grids';
import { TaskFieldsModel, EditDialogFieldSettingsModel, ResourceFieldsModel } from '../models/models';
import { TreeGrid, Edit } from '@syncfusion/ej2-treegrid';
import { Deferred } from '@syncfusion/ej2-data';
import { Tab } from '@syncfusion/ej2-navigations';
import { ConstraintType } from '../base/enum';
import { CalendarContext } from '../base/calendar-context';
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
    public currentEditedRowData: IGanttData ;
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
        if (
            args.columnObject &&
            args.columnObject.field === this.parent.taskFields.constraintType &&
            args.columnObject.edit &&
            args.columnObject.edit.params &&
            Array.isArray(args.columnObject.edit.params['dataSource'])
        ) {
            const constraintTypeDataSource: {
                text: string;
                value: ConstraintType;
            }[] = Object.keys(ConstraintType)
                .filter((key: string) => !isNaN(Number(ConstraintType[key as any])))
                .map((key: string) => ({
                    text: this.parent.treeGridModule['getLocalizedConstraintTypeText'](key),
                    value: ConstraintType[key as keyof typeof ConstraintType]
                }));
            if (args.rowData && args.rowData.hasChildRecords) {
                const asSoonAsPossibleText: string = this.parent.treeGridModule['getLocalizedConstraintTypeText']('AsSoonAsPossible');
                const startNoEarlierThanText: string = this.parent.treeGridModule['getLocalizedConstraintTypeText']('StartNoEarlierThan');
                const finishNoLaterThanText: string = this.parent.treeGridModule['getLocalizedConstraintTypeText']('FinishNoLaterThan');
                args.columnObject.edit.params['dataSource'] = constraintTypeDataSource.filter(function (item: { text: string }): boolean {
                    return item.text === asSoonAsPossibleText ||
                        item.text === startNoEarlierThanText ||
                        item.text === finishNoLaterThanText;
                });
            } else {
                args.columnObject.edit.params['dataSource'] = constraintTypeDataSource;
            }
        }
        if (data.hasChildRecords && ((field === taskSettings.endDate &&
            ((!isNullOrUndefined(data[taskSettings.manual]) && data[taskSettings.manual] === false) ||
                this.parent.taskMode === 'Auto')) || field === taskSettings.duration ||
            field === taskSettings.progress || field === taskSettings.work || field === taskSettings.type || field === 'taskType' || (field === taskSettings.dependency && !this.parent.allowParentDependency))) {
            args.cancel = true;
        } else {
            const callBackPromise: Deferred = new Deferred();
            const parentReference: Gantt = this.parent;
            this.currentEditedRowData = args.rowData;
            this.parent.trigger('cellEdit', args, (arg: CellEditArgs) => {
                if (arg.columnName === parentReference.taskFields.progress && arg.rowData.hasChildRecords) {
                    arg.cancel = true;
                }
                if (!args.rowData.ganttProperties.isAutoSchedule) {
                    const { constraintDate, constraintType } = this.parent.taskFields;
                    if ([constraintDate, constraintType].indexOf(args.columnObject.field) !== -1) {
                        arg.cancel = true;
                    }
                }
                if (data.level === 0 && this.parent.viewType === 'ResourceView') {
                    arg.cancel = true;
                }
                callBackPromise.resolve(arg);
                if (!arg.cancel) {
                    if (arg.columnName === this.parent.taskFields.notes || arg.columnName === 'WBSPredecessor') {
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
        if ((field === taskSettings.notes && !this.parent.showInlineNotes) || field === 'WBSPredecessor') {
            args.cancel = true;
            const columnTypes: string[] =
                this.parent.editModule.dialogModule.updatedEditFields.map((x: EditDialogFieldSettingsModel) => { return x.type; });
            const index: number = field === 'WBSPredecessor' ? columnTypes.indexOf('Dependency') : columnTypes.indexOf('Notes');
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
    // private isValueChange(args: Record<string, unknown>, field: string): boolean {
    //     const data: IGanttData = getValue('data', args);
    //     const editedValue: Record<string, unknown> = data[`${field}`];
    //     const previousValue: Record<string, unknown> = getValue('previousData', args);
    //     if ((isNOU(editedValue) && !isNOU(previousValue)) || (!isNOU(editedValue) && isNOU(previousValue))) {
    //         return true;
    //     } else if (!isNOU(editedValue) && !isNOU(previousValue)) {
    //         if (editedValue instanceof Date) {
    //             return editedValue.getTime() !== data.taskData[field as string].getTime() ? true : false;
    //         } else if (field === this.parent.taskFields.resourceInfo) {
    //             return editedValue !== previousValue ? true : false;
    //         } else if (editedValue !== data.taskData[field as string]) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    /**
     * Initiate cell save action on Gantt with arguments from TreeGrid
     *
     * @param {object} args .
     * @param {object} editedObj .
     * @returns {void} .
     * @private
     */
    public initiateCellEdit(args: object, editedObj: object): void {
        let isValid: boolean = true;
        if (args['name'] === 'actionComplete' && args['previousData'] === args['data'][args['column'].field]) {
            isValid = false;
        }
        if (this.parent.undoRedoModule && this.parent['isUndoRedoItemPresent']('Edit')) {
            if (isValid) {
                if (this.parent.undoRedoModule['redoEnabled']) {
                    this.parent.undoRedoModule['disableRedo']();
                }
                this.parent.undoRedoModule['createUndoCollection']();
                const action: Object = {};
                action['action'] = 'CellEditing';
                action['editedColumn'] = args['column'].field;
                action['modifiedRecords'] = [];
                this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] = action;
            }
        }
        const column: ColumnModel = getValue('column', args);
        const data: IGanttData = getValue('data', args);
        const editedArgs: ITaskbarEditedEventArgs = {};
        editedArgs.action = 'CellEditing';
        editedArgs.data = this.parent.getTaskByUniqueID(data.uniqueID);
        const previousValue: Record<string, unknown> = getValue('previousData', args);
        const isBaseline: boolean = this.parent.taskFields.baselineEndDate === column.field ||
            this.parent.taskFields.baselineStartDate === column.field ? true : false;
        const editedValue: object = this.parent.allowUnscheduledTasks && !isBaseline ? data[column.field] :
            ((isNullOrUndefined(data[column.field])
                || data[column.field] === '') && (this.parent.taskFields.duration === column.field ||
                    this.parent.taskFields.startDate === column.field || this.parent.taskFields.endDate === column.field ||
                    this.parent.taskFields.baselineDuration === column.field ||
                    this.parent.taskFields.baselineEndDate === column.field || this.parent.taskFields.baselineStartDate === column.field)) ?
                previousValue : data[column.field];
        if (!isNOU(data)) {
            data[column.field] = previousValue;
            editedArgs.data[column.field] = previousValue;
            this.parent.initiateEditAction(true);
            if (this.parent.weekWorkingTime.length > 0 && editedValue && (column.field === this.parent.taskFields.startDate ||
                column.field === this.parent.taskFields.baselineStartDate)) {
                const sDate: Date = column.field === this.parent.taskFields.startDate ? data.ganttProperties.startDate :
                    data.ganttProperties.baselineStartDate;
                const prevDay: number = this.parent['getStartTime'](sDate);
                if (prevDay / 3600 === sDate.getHours()) {
                    const dayStartTime: number = this.parent['getStartTime'](editedValue as Date);
                    this.parent.dataOperation.setTime(dayStartTime, editedValue as Date);
                    this.parent.setRecordValue(column.field, editedValue, editedArgs.data);
                }
                else {
                    this.parent.setRecordValue(column.field, editedValue, editedArgs.data);
                }
            }
            else {
                this.parent.setRecordValue(column.field, editedValue, editedArgs.data);
            }
            if (column.field === this.parent.taskFields.name) {
                this.taskNameEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.startDate) {
                this.startDateEdited(editedArgs, false);
            } else if (column.field === this.parent.taskFields.constraintDate || column.field === this.parent.taskFields.constraintType) {
                this.constraintEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.endDate) {
                this.endDateEdited(editedArgs, args['previousData']);
            } else if (column.field === this.parent.taskFields.duration) {
                this.durationEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.resourceInfo) {
                this.resourceEdited(editedArgs, editedObj, data);
            } else if (column.field === this.parent.taskFields.progress) {
                this.progressEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.baselineStartDate) {
                this.startDateEdited(editedArgs, true);
            } else if (column.field === this.parent.taskFields.baselineEndDate) {
                this.endDateEditedforBaseline(editedArgs, args['previousData']);
            } else if (column.field === this.parent.taskFields.baselineDuration) {
                this.durationEdited(editedArgs, true);
            } else if (column.field === this.parent.taskFields.dependency) {
                this.dependencyEdited(editedArgs, previousValue);
            } else if (column.field === this.parent.taskFields.notes) {
                this.notedEdited(editedArgs);
            } else if (column.field === this.parent.taskFields.work) {
                this.workEdited(editedArgs);
            } else if ((column.field === this.parent.taskFields.type || column.field === 'taskType') &&
            !isNOU(this.parent.taskFields.work)) {
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
        if (this.parent.treeGridModule['isDateColumnCellEdit']) {
            this.parent.treeGridModule['isDateColumnCellEdit'] = false;
        }
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
     * To update task schedule mode cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @param {Date} currentValue .
     * @param {boolean} isBaseline - Indicates whether the calculation is specific to baseline dates.
     * @returns {void} .
     */
    /* eslint-disable */
    private updateGanttDataProperties(args: ITaskbarEditedEventArgs, currentValue: Date, isBaseline?: boolean): void {
        const ganttData: IGanttData = args.data;
        const taskProperties: ITaskData = ganttData.ganttProperties;
        const { startdateField, enddateField, durationField } = this.parent.dateValidationModule.getFieldMappings(isBaseline);
        if (isNOU(currentValue)) {
            if (!ganttData.hasChildRecords) {
                if (!isBaseline) {
                    this.parent.setRecordValue(startdateField, null, taskProperties, true);
                    this.parent.setRecordValue('isMilestone', false, taskProperties, true);
                }
                if (!(taskProperties.startDate === null && taskProperties.endDate === null && taskProperties.duration !== null)) {
                    this.parent.setRecordValue(durationField, null, taskProperties, true);
                }
            }
        } else if (taskProperties[enddateField] || !isNOU(taskProperties[durationField])) {
            this.parent.setRecordValue(startdateField, new Date(currentValue.getTime()), taskProperties, true);
            if (!isBaseline || (isBaseline && !isNullOrUndefined(this.parent.taskFields.baselineDuration))) {
                this.parent.dateValidationModule.calculateEndDate(ganttData, isBaseline);
            }
        } else if (isNOU(taskProperties[enddateField]) && isNOU(taskProperties[durationField])) {
            this.parent.setRecordValue(startdateField, new Date(currentValue.getTime()), taskProperties, true);
        }
        if (!isBaseline) {
            this.parent.setRecordValue('isMilestone', taskProperties.duration === 0 ? true : false, taskProperties, true);
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(ganttData, startdateField);
        this.parent.dataOperation.updateMappingData(ganttData, enddateField);
        this.parent.dataOperation.updateMappingData(ganttData, durationField);
    }
    /* eslint-enable */
    /**
     * To update task start date cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @param {boolean} isBaseline - Indicates whether the calculation is specific to baseline dates.
     * @returns {void} .
     */
    private startDateEdited(args: ITaskbarEditedEventArgs, isBaseline?: boolean): void {
        const ganttData: IGanttData = args.data;
        const ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = isBaseline ? args.data[this.parent.taskFields.baselineStartDate] :
            args.data[this.parent.taskFields.startDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        currentValue = this.parent.dateValidationModule.checkStartDate(
            currentValue, ganttData.ganttProperties, ganttData.ganttProperties.isMilestone, undefined, isBaseline);
        if (args.data.ganttProperties.constraintDate) {
            args.data.ganttProperties.constraintDate = currentValue;
        }
        this.updateGanttDataProperties(args, currentValue, isBaseline);
        this.updateEditedRecord(args);
    }
    private constraintEdited(args: ITaskbarEditedEventArgs): void {
        const ganttData: IGanttData = args.data;
        const ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = args.data[this.parent.taskFields.startDate];
        let constraintDate: Date = args.data[this.parent.taskFields.constraintDate];
        const constraintType: ConstraintType = args.data[this.parent.taskFields.constraintType];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        if (!isNullOrUndefined(constraintDate)) {
            this.parent.setRecordValue('constraintDate', new Date(constraintDate.getTime()), ganttProb, true);
        } else {
            const startDate: Date = ganttData[this.parent.taskFields.startDate];
            const endDate: Date = ganttData[this.parent.taskFields.endDate];
            switch (constraintType) {
            case ConstraintType.MustStartOn:
            case ConstraintType.StartNoEarlierThan:
            case ConstraintType.StartNoLaterThan:
                if (!isNullOrUndefined(startDate)) {
                    this.parent.setRecordValue('constraintDate', new Date(startDate.getTime()), ganttProb, true);
                    constraintDate = ganttProb.constraintDate;
                }
                break;
            case ConstraintType.MustFinishOn:
            case ConstraintType.FinishNoEarlierThan:
            case ConstraintType.FinishNoLaterThan:
                if (!isNullOrUndefined(endDate)) {
                    this.parent.setRecordValue('constraintDate', new Date(endDate.getTime()), ganttProb, true);
                    constraintDate = ganttProb.constraintDate;
                }
                break;
            }
        }
        this.parent.setRecordValue('constraintType', constraintType, ganttProb, true);
        if (ganttProb.predecessor && ganttProb.constraintType === ConstraintType.AsSoonAsPossible) {
            const predecessorDate: Date = this.parent.predecessorModule.getPredecessorDate(args.data, ganttProb.predecessor);
            if (predecessorDate) {
                currentValue = predecessorDate;
            }
        } else if (ganttProb.constraintType === ConstraintType.StartNoEarlierThan ||
            ganttProb.constraintType === ConstraintType.MustStartOn ||
            ganttProb.constraintType === ConstraintType.MustFinishOn
        ) {
            currentValue = this.parent.dateValidationModule.getDateByConstraint(ganttData, constraintDate);
        }
        else {
            currentValue = this.parent.dateValidationModule.getDateByConstraint(ganttData, currentValue);
        }
        this.updateGanttDataProperties(args, currentValue);
        this.parent.dataOperation.updateMappingData(ganttData, 'constraintDate');
        this.updateEditedRecord(args);
    }

    public validateEndDateWithSegments(ganttProp: ITaskData): ITaskSegment[] {
        const ganttSegments: ITaskSegment[] = [];
        const segments: ITaskSegment[] = ganttProp.segments;
        const calendarContext: CalendarContext = ganttProp
            ? ganttProp.calendarContext
            : this.parent.defaultCalendarContext;
        for (let i: number = 0; i < segments.length; i++) {
            const segment: ITaskSegment = segments[parseInt(i.toString(), 10)];
            let endDate: Date = segment.endDate;
            endDate = (!isNullOrUndefined(ganttProp.endDate)) && endDate.getTime() <
                ganttProp.endDate.getTime() && i !== segments.length - 1 ? endDate : ganttProp.endDate;
            segment.duration = this.parent.dataOperation.getDuration(
                segment.startDate, endDate, ganttProp.durationUnit, ganttProp.isAutoSchedule,
                ganttProp.isMilestone, undefined, calendarContext
            );
            if (segments.length > 0 && endDate.getTime() < segment.startDate.getTime()
                && endDate.getTime() <= ganttProp.endDate.getTime()) {
                segments[i - 1].duration = this.parent.dataOperation.getDuration(
                    segments[i - 1].startDate, ganttProp.endDate, ganttProp.durationUnit,
                    ganttProp.isAutoSchedule, ganttProp.isMilestone, undefined, calendarContext);
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
     * @param {Date} previousValue .
     * @returns {void} .
     */
    private endDateEdited(args: ITaskbarEditedEventArgs, previousValue: Date): void {
        const ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = args.data[this.parent.taskFields.endDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        if (isNOU(currentValue)) {
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            if (!(ganttProb.startDate === null && ganttProb.endDate === null && ganttProb.duration !== null)) {
                this.parent.setRecordValue('duration', null, ganttProb, true);
            }
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
        } else {
            let dayEndTime: number = this.parent['getCurrentDayEndTime'](currentValue);
            if ((currentValue.getHours() === 0 || (previousValue &&
                currentValue.toTimeString().slice(0, 5) === previousValue.toTimeString().slice(0, 5))) && dayEndTime !== 86400) {
                this.parent.dateValidationModule.setTime(dayEndTime, currentValue);
            }
            currentValue = this.parent.dateValidationModule.checkEndDate(currentValue, ganttProb, ganttProb.isMilestone);
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            if (!isNOU(ganttProb.startDate) && isNOU(ganttProb.duration)) {
                if (this.parent.dateValidationModule.compareDates(ganttProb.endDate, ganttProb.startDate) === -1) {
                    this.parent.setRecordValue('endDate', new Date(ganttProb.startDate.getTime()), ganttProb, true);
                    dayEndTime = this.parent['getCurrentDayEndTime'](ganttProb.endDate);
                    this.parent.dateValidationModule.setTime(dayEndTime, ganttProb.endDate);
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
            if (this.compareDatesFromRecord(ganttProb) <= 0) {
                this.parent.dateValidationModule.calculateDuration(args.data);
            } else {
                this.parent.editModule.revertCellEdit(args);
            }
            this.updateDates(args);
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
     * To update task end date cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args - Arguments associated with the taskbar edit event.
     * @param {Date} previousValue - The previous baseline end date value before editing.
     * @returns {void} .
     */
    private endDateEditedforBaseline(args: ITaskbarEditedEventArgs, previousValue: Date): void {
        const ganttProb: ITaskData = args.data.ganttProperties;
        let currentValue: Date = args.data[this.parent.taskFields.baselineEndDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        if (isNOU(currentValue)) {
            this.parent.setRecordValue('baselineEndDate', currentValue, ganttProb, true);
            if (!(ganttProb.baselineStartDate === null && ganttProb.baselineEndDate === null && ganttProb.baselineDuration !== null)) {
                this.parent.setRecordValue('baselineDuration', null, ganttProb, true);
            }
        } else {
            let dayEndTime: number = this.parent['getCurrentDayEndTime'](currentValue);
            if ((currentValue.getHours() === 0 || (previousValue &&
                currentValue.toTimeString().slice(0, 5) === previousValue.toTimeString().slice(0, 5))) && dayEndTime !== 86400) {
                this.parent.dateValidationModule.setTime(dayEndTime, currentValue);
            }
            currentValue = this.parent.dateValidationModule.checkEndDate(currentValue, ganttProb, ganttProb.isMilestone, true);
            this.parent.setRecordValue('baselineEndDate', currentValue, ganttProb, true);
            if (!isNOU(ganttProb.baselineStartDate) && isNOU(ganttProb.baselineDuration)) {
                if (this.parent.dateValidationModule.compareDates(ganttProb.baselineEndDate, ganttProb.baselineStartDate) === -1) {
                    this.parent.setRecordValue('baselineEndDate', new Date(ganttProb.baselineStartDate.getTime()), ganttProb, true);
                    dayEndTime = this.parent['getCurrentDayEndTime'](ganttProb.baselineEndDate);
                    this.parent.dateValidationModule.setTime(dayEndTime, ganttProb.baselineEndDate);
                }
            } else if (!isNOU(ganttProb.baselineDuration) && isNOU(ganttProb.baselineStartDate)) {
                this.parent.setRecordValue(
                    'baselineStartDate',
                    this.parent.dateValidationModule.getStartDate(ganttProb.baselineEndDate, ganttProb.baselineDuration,
                                                                  ganttProb.durationUnit, ganttProb, true),
                    ganttProb,
                    true
                );
            }
            if (this.compareDatesFromRecord(ganttProb, true) <= 0) {
                this.parent.dateValidationModule.calculateDuration(args.data, true);
            } else {
                this.parent.editModule.revertCellEdit(args);
            }
            this.updateDatesforBaseline(args);
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'baselineStartDate');
        this.parent.dataOperation.updateMappingData(args.data, 'baselineEndDate');
        this.parent.dataOperation.updateMappingData(args.data, 'baselineDuration');
        this.updateEditedRecord(args);
    }
    /**
     * To update duration cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @param {boolean} isBaseline - Indicates whether the calculation is specific to baseline dates.
     * @returns {void} .
     */
    /* eslint-disable */
    private durationEdited(args: ITaskbarEditedEventArgs, isBaseline?: boolean): void {
        const regex: RegExp = /^[^\d.-]+$/;
        const duration: string = isBaseline ? 'baselineDuration' : 'duration';
        if (regex.test(args.data[this.parent.taskFields[duration]])) {
            const err: string = `The provided value for the ${this.parent.taskFields[duration]} field is invalid. Please ensure the ${this.parent.taskFields[duration]} field contains only valid numeric values.`;
            this.parent.trigger('actionFailure', { error: err });
        }
        const ganttProb: ITaskData = args.data.ganttProperties;
        if (!isBaseline && parseInt(args.data[this.parent.taskFields.duration], 10) < 0) {
            args.data[this.parent.taskFields.duration] = ganttProb.duration;
        }
        else if (isBaseline && parseInt(args.data[this.parent.taskFields.baselineDuration], 10) < 0) {
            args.data[this.parent.taskFields.baselineDuration] = ganttProb.baselineDuration;
        }
        const durationString: string = args.data[this.parent.taskFields[duration]];
        this.parent.dataOperation.updateDurationValue(durationString, ganttProb, isBaseline);
        if (!isBaseline) {
            this.updateDates(args);
            this.parent.editModule.updateResourceRelatedFields(args.data, 'duration');
        }
        else {
            this.updateDatesforBaseline(args);
        }
        this.updateEditedRecord(args);
    }
    /* eslint-enable */
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
            if (args.data[this.parent.taskFields.duration] !== null) {
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
                if (!isNullOrUndefined(this.parent.taskFields.milestone)) {
                    this.parent.setRecordValue(this.parent.taskFields.milestone, false, args.data, true);
                }
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
     * To update start date, end date based on duration.
     *
     * @param {ITaskbarEditedEventArgs} args - The taskbar edited event arguments containing task data.
     * @returns {void} .
     */
    private updateDatesforBaseline(args: ITaskbarEditedEventArgs): void {
        const ganttProb: ITaskData = args.data.ganttProperties;
        const endDate: Date = this.parent.dateValidationModule.getDateFromFormat(ganttProb.baselineEndDate);
        const startDate: Date = this.parent.dateValidationModule.getDateFromFormat(ganttProb.baselineStartDate);
        const currentDuration: number = ganttProb.baselineDuration;
        if (isNOU(startDate) && !isNOU(endDate)) {
            this.parent.setRecordValue(
                'baselineStartDate',
                this.parent.dateValidationModule.getStartDate(endDate, currentDuration, ganttProb.durationUnit,
                                                              ganttProb, undefined, true),
                ganttProb,
                true
            );
        }
        if (currentDuration !== 0) {
            this.parent.setRecordValue(
                'baselineStartDate',
                this.parent.dateValidationModule.checkStartDate(ganttProb.baselineStartDate, ganttProb, undefined, undefined, true),
                ganttProb,
                true
            );
        }
        this.parent.dateValidationModule.calculateEndDate(args.data, true);
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'baselineEndDate');
        this.parent.dataOperation.updateMappingData(args.data, 'baselineStartDate');
        this.parent.dataOperation.updateMappingData(args.data, 'baselineDuration');
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
                        if (previousResource[newIndex as number][resourceSettings.id] === editedResourceId[count as number]) {
                            index = newIndex;
                            break;
                        } else {
                            index = -1;
                        }
                    }
                }
                if (!isNOU(index) && index !== -1) {
                    editedResources.push(previousResource[parseInt(index.toString(), 10)]);
                } else {
                    const resource: Object[] = resourceData.filter((resourceInfo: Object) => {
                        return (editedResourceId[count as number] === resourceInfo[resourceSettings.id]);
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
        const specialCharacterPattern: RegExp = /[!@#$%^&*()_=[\]{};:<>|./?-]/;
        if (specialCharacterPattern.test(editedArgs.data[this.parent.taskFields.dependency])) {
            const err: string = `The provided value for the ${this.parent.taskFields.dependency} field is invalid. Please ensure that the ${this.parent.taskFields.dependency} field does not contain any special characters.`;
            this.parent.trigger('actionFailure', { error: err });
        }
        this.parent.predecessorModule.updateUnscheduledDependency(editedArgs.data);
        const FF: string = this.parent.localeObj.getConstant('FF');
        const FS: string = this.parent.localeObj.getConstant('FS');
        const SS: string = this.parent.localeObj.getConstant('SS');
        const SF: string = this.parent.localeObj.getConstant('SF');
        let value: string = '';
        if (!isNullOrUndefined(editedArgs.data[this.parent.taskFields.dependency])) {
            const splitString: string[] = (editedArgs.data[this.parent.taskFields.dependency] as string).split(',');
            splitString.map((splitvalue: string, index: number) => {
                if (splitvalue.includes(FF)) {
                    value += splitvalue.replace(FF, 'FF');
                    value += (splitString.length !== index + 1) ? ',' : '';
                } else if (splitvalue.includes(FS)) {
                    value += splitvalue.replace(FS, 'FS');
                    value += (splitString.length !== index + 1) ? ',' : '';
                } else if (splitvalue.includes(SS)) {
                    value += splitvalue.replace(SS, 'SS');
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
                else if (splitvalue.includes(SF)) {
                    value += splitvalue.replace(SF, 'SF');
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
                else {
                    value += splitvalue;
                    value += (splitString.length !== index + 1) ? ',' : '';
                }
            });
        }
        if (!this.parent.connectorLineEditModule.updatePredecessor(
            editedArgs.data,
            value, editedArgs)) {
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
        if (editedArgs.data[this.parent.taskFields.work] < 0 || isNullOrUndefined(editedArgs.data[this.parent.taskFields.work])) {
            editedArgs.data[this.parent.taskFields.work] = 0;
        }
        this.parent['updateDuration'] = true;
        const workValue: number = editedArgs.data[this.parent.taskFields.work];
        this.parent.setRecordValue('work', workValue, ganttProb, true);
        this.parent.editModule.updateResourceRelatedFields(editedArgs.data, 'work');
        this.updateDates(editedArgs);
        this.updateEditedRecord(editedArgs);
        this.parent['updateDuration'] = false;
    }
    /**
     * To update task type cell with new value
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @param {object} editedObj .
     * @returns {void} .
     */
    private typeEdited(args: ITaskbarEditedEventArgs, editedObj: Object): void {
        const key: string = this.parent.taskFields.type || 'taskType';
        const ganttProb: ITaskData = args.data.ganttProperties;
        const taskType: string = editedObj[`${key}`];
        this.parent.setRecordValue('taskType', taskType, ganttProb, true);
        // To validate the work column as well, if duartion column value is 0, when FixedDuration type
        if (ganttProb.taskType === 'FixedDuration' && ganttProb.duration === 0) {
            this.parent.editModule.updateResourceRelatedFields(args.data, 'work');
        }
        //this.parent.dataOperation.updateMappingData(args.data, 'taskType');
        this.updateEditedRecord(args);
    }
    /**
     * To compare start date and end date from Gantt record
     *
     * @param {ITaskData} ganttRecord .
     * @param {boolean} isBaseline .
     * @returns {number} .
     */
    private compareDatesFromRecord(ganttRecord: ITaskData, isBaseline?: boolean): number {
        const sDate: Date = this.parent.dateValidationModule.getValidStartDate(ganttRecord, null, isBaseline);
        const eDate: Date = this.parent.dateValidationModule.getValidEndDate(ganttRecord, null, isBaseline);
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
