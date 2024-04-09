import { isNullOrUndefined, isUndefined, extend, setValue, getValue, deleteObject, createElement } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { TaskFieldsModel, EditSettingsModel, ResourceFieldsModel } from '../models/models';
import { IGanttData, ITaskData, ITaskbarEditedEventArgs, IValidateArgs, IParent, IPredecessor } from '../base/interface';
import { IActionBeginEventArgs, ITaskAddedEventArgs, ITaskDeletedEventArgs, RowDropEventArgs } from '../base/interface';
import { ColumnModel, Column as GanttColumn } from '../models/column';
import { ColumnModel as GanttColumnModel } from '../models/column';
import { DataManager, DataUtil, Query, AdaptorOptions, ODataAdaptor, WebApiAdaptor, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ReturnType, RecordDoubleClickEventArgs, Row, Column, IEditCell, EJ2Intance, getUid } from '@syncfusion/ej2-grids';
import { getSwapKey, isScheduledTask, getTaskData, isRemoteData, getIndex, isCountRequired, updateDates } from '../base/utils';
import { RowPosition } from '../base/enum';
import { CellEdit } from './cell-edit';
import { TaskbarEdit } from './taskbar-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';
import { NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { MultiSelect, CheckBoxSelection, DropDownList } from '@syncfusion/ej2-dropdowns';
import { ConnectorLineEdit } from './connector-line-edit';
import { ITreeData } from '@syncfusion/ej2-treegrid';
import { CriticalPath } from '..';



/**
 * The Edit Module is used to handle editing actions.
 *
 */
export class Edit {
    private parent: Gantt;
    private isFromDeleteMethod: boolean = false;
    private targetedRecords: IGanttData[] = [];
    private isNewRecordAdded: boolean = false;
    private isValidatedEditedRecord: boolean = false;
    private createArray: boolean = true;
    public isFirstCall:boolean;
    /**
     * @private
     */
    /** @hidden */
    private ganttData: Object[] | DataManager;
    /** @hidden */
    private treeGridData: ITreeData[];
    /** @hidden */
    private draggedRecord: IGanttData;
    /** @hidden */
    private updateParentRecords: IGanttData[] = [];
    /** @hidden */
    private droppedRecord: IGanttData;
    /** @hidden */
    private isTreeGridRefresh: boolean;
    /** @hidden */
    public isaddtoBottom: boolean = false;
    /** @hidden */
    public addRowPosition: RowPosition;
    /** @hidden */
    public addRowIndex: number;
    /** @hidden */
    private dropPosition: string;
    public confirmDialog: Dialog = null;
    private taskbarMoved: boolean = false;
    private predecessorUpdated: boolean = false;
    public newlyAddedRecordBackup: IGanttData;
    public isBreakLoop: boolean = false;
    public addRowSelectedItem: IGanttData;
    public cellEditModule: CellEdit;
    public taskbarEditModule: TaskbarEdit;
    public dialogModule: DialogEdit;
    private editedRecord: IGanttData;
    constructor(parent?: Gantt) {
        this.parent = parent;
        this.parent.predecessorModule.validatedChildItems = [];
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
            const confirmDialog: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_deleteConfirmDialog'
            });
            this.parent.element.appendChild(confirmDialog);
            this.renderDeleteConfirmDialog();
        }
        this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
        this.parent.treeGrid.editSettings.allowAdding = this.parent.editSettings.allowAdding;
        this.parent.treeGrid.editSettings.allowDeleting = this.parent.editSettings.allowDeleting;
        this.parent.treeGrid.editSettings.showDeleteConfirmDialog = this.parent.editSettings.showDeleteConfirmDialog;
        this.parent.treeGrid.editSettings.allowNextRowEdit = this.parent.editSettings.allowNextRowEdit;
        this.updateDefaultColumnEditors();
    }

    private getModuleName(): string {
        return 'edit';
    }

    /**
     * Method to update default edit params and editors for Gantt
     *
     * @returns {void} .
     */
    private updateDefaultColumnEditors(): void {
        const customEditorColumns: string[] =
            [this.parent.taskFields.id, this.parent.taskFields.progress, this.parent.taskFields.resourceInfo, 'taskType'];
        for (let i: number = 0; i < customEditorColumns.length; i++) {
            if (!isNullOrUndefined(customEditorColumns[i as number]) && customEditorColumns[i as number].length > 0) {
                // eslint-disable-next-line
                const column: ColumnModel = this.parent.getColumnByField(customEditorColumns[i], this.parent.treeGridModule.treeGridColumns);
                if (column) {
                    if (column.field === this.parent.taskFields.id) {
                        this.updateIDColumnEditParams(column);
                    } else if (column.field === this.parent.taskFields.progress && isNullOrUndefined(column.edit)) {
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
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateIDColumnEditParams(column: ColumnModel): void {
        const editParam: NumericTextBoxModel = {
            min: 0,
            decimals: 0,
            enableRtl: this.parent.enableRtl,
            validateDecimalOnType: true,
            format: 'n0',
            showSpinButton: false
        };
        this.updateEditParams(column, editParam);
    }

    /**
     * Method to update edit params of default progress column
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateProgessColumnEditParams(column: ColumnModel): void {
        const editParam: NumericTextBoxModel = {
            min: 0,
            enableRtl: this.parent.enableRtl,
            decimals: 0,
            validateDecimalOnType: true,
            max: 100,
            format: 'n0'
        };
        this.updateEditParams(column, editParam);
    }
    /**
     * Assign edit params for id and progress columns
     *
     * @param {ColumnModel} column .
     * @param {object} editParam .
     * @returns {void} .
     */
    private updateEditParams(column: ColumnModel, editParam: object): void {
        if (isNullOrUndefined(column.edit)) {
            column.edit = {};
            column.edit.params = {};
        } else if (isNullOrUndefined(column.edit.params)) {
            column.edit.params = {};
        }
        extend(editParam, column.edit.params);
        column.edit.params = editParam;
        const ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
        ganttColumn.edit = column.edit;
    }
    /**
     * Method to update resource column editor for default resource column
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateResourceColumnEditor(column: ColumnModel): void {
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getResourceEditor();
            const ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
            ganttColumn.editType = 'dropdownedit';
            ganttColumn.edit = column.edit;
        }
    }

    /**
     * Method to create resource custom editor
     *
     * @returns {IEditCell} .
     */
    private getResourceEditor(): IEditCell {
        const resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
        const editObject: IEditCell = {};
        let editor: MultiSelect;
        MultiSelect.Inject(CheckBoxSelection);
        editObject.write = (args: { rowData: Object, element: Element, column: GanttColumn, row: HTMLElement, requestType: string }) => {
            this.parent.treeGridModule.currentEditRow = {};
            editor = new MultiSelect({
                dataSource: new DataManager(this.parent.resources),
                fields: { text: resourceSettings.name, value: resourceSettings.id },
                enableRtl: this.parent.enableRtl,
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
            const resourcesName: string[] = [];
            if (isNullOrUndefined(value)) {
                value = [];
            }
            for (let i: number = 0; i < value.length; i++) {
                for (let j: number = 0; j < this.parent.resources.length; j++) {
                    if (this.parent.resources[j as number][resourceSettings.id] === value[i as number]) {
                        resourcesName.push(this.parent.resources[j as number][resourceSettings.name]);
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
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateTaskTypeColumnEditor(column: ColumnModel): void {
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getTaskTypeEditor();
            const ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
            ganttColumn.editType = 'dropdownedit';
            ganttColumn.edit = column.edit;
        }
    }
    /**
     * Method to create task type custom editor
     *
     * @returns {IEditCell} .
     */
    private getTaskTypeEditor(): IEditCell {
        const editObject: IEditCell = {};
        let editor: DropDownList;
        const types: Object[] = [{ 'ID': 1, 'Value': 'FixedUnit' }, { 'ID': 2, 'Value': 'FixedWork' }, { 'ID': 3, 'Value': 'FixedDuration' }];
        editObject.write = (args: { rowData: Object, element: Element, column: GanttColumn, row: HTMLElement, requestType: string }) => {
            this.parent.treeGridModule.currentEditRow = {};
            editor = new DropDownList({
                dataSource: new DataManager(types),
                enableRtl: this.parent.enableRtl,
                fields: { value: 'Value' },
                popupHeight: '350px',
                value: getValue('taskType', (args.rowData as IGanttData).ganttProperties)
            });
            editor.appendTo(args.element as HTMLElement);
        };
        editObject.read = (element: HTMLElement): string => {
            const value: string = (<EJ2Intance>element).ej2_instances[0].value;
            const key: string = 'taskType';
            this.parent.treeGridModule.currentEditRow[key as string] = value;
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
     * @returns {void} .
     * @private
     */
    public reUpdateEditModules(): void {
        const editSettings: EditSettingsModel = this.parent.editSettings;
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
                const confirmDialog: HTMLElement = createElement('div', {
                    id: this.parent.element.id + '_deleteConfirmDialog'
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
                const rowIndex: number = getValue('rowIndex', args.row);
                ganttData = this.parent.currentViewData[rowIndex as number];
            }
            if (!isNullOrUndefined(ganttData)) {
                this.dialogModule.openEditDialog(ganttData);
            }
        }
        this.parent.ganttChartModule.recordDoubleClick(args);
    }
    /**
     * @returns {void} .
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
     *
     * @param {Object} data - Defines new data to update.
     * @returns {void} .
     */
    public updateRecordByID(data: Object): void {
        if (!this.parent.readOnly) {
            const tasks: TaskFieldsModel = this.parent.taskFields;
            if (isNullOrUndefined(data) || isNullOrUndefined(data[tasks.id])) {
                return;
            }
            const ganttData: IGanttData = this.parent.viewType === 'ResourceView' ?
                this.parent.flatData[this.parent.getTaskIds().indexOf('T' + data[tasks.id])] : this.parent.getRecordByID(data[tasks.id]);
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent['isUndoRedoItemPresent']('Edit') && ganttData) {
                this.parent.undoRedoModule['createUndoCollection']();
                let details: Object = {};
                details['requestType'] = ((this.parent.contextMenuModule && this.parent.contextMenuModule.item) ? this.parent.contextMenuModule.item : 'methodUpdate');
                details['modifiedRecords'] = extend([], [ganttData], [], true);
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as any) = details;
            }
            if (!isNullOrUndefined(this.parent.editModule) && ganttData) {
                this.parent.isOnEdit = true;
                this.validateUpdateValues(data, ganttData, true);
                if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
                    if (this.parent.viewType == 'ProjectView' && data['ganttProperties'].predecessor) {
                        for (let i: number = 0; i < data['ganttProperties'].predecessor.length; i++) {
                            let isValid: IPredecessor[] = ganttData.ganttProperties.predecessor.filter((pred: IPredecessor) => {
                                return pred.from != data['ganttProperties'].predecessor[i as number].from && pred.from != data['ganttProperties'].predecessor[i as number].to;
                            });
                            if (isValid.length > 0) {
                                for (let j: number = 0; j < isValid.length; j++) {
                                    const record: IGanttData = this.parent.flatData[this.parent.ids.indexOf(isValid[j as number].from)];
                                    for (let k: number = 0; k < record.ganttProperties.predecessor.length; k++) {
                                        if (record.ganttProperties.predecessor[k as number].from == isValid[j as number].from && record.ganttProperties.predecessor[k as number].to == isValid[j as number].to) {
                                            record.ganttProperties.predecessor.splice(k, 1);
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    else if (!data['ganttProperties'].predecessor && ganttData.ganttProperties.predecessor) {
                        for (let i: number = 0; i < ganttData.ganttProperties.predecessor.length; i++) {
                            let id: string;
                            if (ganttData.ganttProperties.taskId.toString() == ganttData.ganttProperties.predecessor[i as number].from) {
                                id = ganttData.ganttProperties.predecessor[i as number].to;
                            }
                            else {
                                id = ganttData.ganttProperties.predecessor[i as number].from;
                            }
                            const parentRec: IGanttData = this.parent.flatData[this.parent.ids.indexOf(id)];
                            for (let j: number = 0; j < parentRec.ganttProperties.predecessor.length; j++) {
                                if (parentRec.ganttProperties.predecessor[j as number].from == ganttData.ganttProperties.predecessor[i as number].from && parentRec.ganttProperties.predecessor[j as number].to == ganttData.ganttProperties.predecessor[i as number].to) {
                                    parentRec.ganttProperties.predecessor.splice(j, 1);
                                }
                            }
                        }
                    }
                    ganttData.ganttProperties.resourceInfo = data['ganttProperties'].resourceInfo;
                }
                if (data[this.parent.taskFields.resourceInfo]) {
                    if (ganttData.ganttProperties.duration === 0) {
                        this.parent.dataOperation.updateWorkWithDuration(ganttData);
                    }
                    if (!this.parent.undoRedoModule || !this.parent.undoRedoModule['isUndoRedoPerformed']) {
                        this.updateResourceRelatedFields(ganttData, 'resource');
                    }
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
                const keys: string[] = Object.keys(data);
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
                    const args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
                    args.data = ganttData;
                    if (this.parent.viewType === 'ResourceView') {
                        args.action = 'methodUpdate';
                    }
                    this.parent.editModule.initiateUpdateAction(args);
                }
            }
        }
    }
    /**
     *
     * @param {object} data .
     * @param {IGanttData} ganttData .
     * @param {boolean} isFromDialog .
     * @returns {void} .
     * @private
     */
    public validateUpdateValues(data: Object, ganttData: IGanttData, isFromDialog?: boolean): void {
        const ganttObj: Gantt = this.parent;
        const tasks: TaskFieldsModel = ganttObj.taskFields;
        const ganttPropByMapping: Object = getSwapKey(ganttObj.columnMapping);
        const scheduleFieldNames: string[] = [];
        let isScheduleValueUpdated: boolean = false;
        if (!isNullOrUndefined(ganttData[tasks.milestone])) {
            if (ganttData[tasks.milestone] === true) {
                ganttData[tasks.milestone] = false;
            }
        }
        for (const key of Object.keys(data)) {
            if ([tasks.startDate, tasks.endDate, tasks.duration].indexOf(key) !== -1) {
                if (isNullOrUndefined(data[`${key}`]) && !ganttObj.allowUnscheduledTasks) {
                    continue;
                }
                if (isFromDialog) {
                    if (tasks.duration === key) {
                        ganttObj.dataOperation.updateDurationValue(data[key as string], ganttData.ganttProperties);
                        if (ganttData.ganttProperties.duration > 0 && ganttData.ganttProperties.isMilestone) {
                            this.parent.setRecordValue('isMilestone', false, ganttData.ganttProperties, true);
                        }
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key as string]);
                    } else {
                        let tempDate: Date = typeof data[key as string] === 'string' ? new Date(data[key as string] as string) : data[key as string];
                        if (key === tasks.endDate && isNullOrUndefined(ganttData.ganttProperties.startDate) && (isNullOrUndefined(data[tasks.duration]) || data[tasks.duration] === ""|| Number.isNaN(data[tasks.duration]))) {
                            tempDate = ganttData.ganttProperties.endDate
                        }
                        ganttObj.setRecordValue(ganttPropByMapping[key as string], tempDate, ganttData.ganttProperties, true);
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key as string]);
                    }
                } else {
                    scheduleFieldNames.push(key);
                    isScheduleValueUpdated = true;
                }
            } else if (tasks.resourceInfo === key) {
                const resourceData: Object[] = ganttObj.dataOperation.setResourceInfo(data);
                if (this.parent.viewType === 'ResourceView') {
                    if (JSON.stringify(resourceData) !== JSON.stringify(ganttData.ganttProperties.resourceInfo)) {
                        this.parent.editModule.dialogModule.isResourceUpdate  = true;
                        this.parent.editModule.dialogModule.previousResource = !isNullOrUndefined(ganttData.ganttProperties.resourceInfo) ?
                            [...ganttData.ganttProperties.resourceInfo] : [];
                    } else {
                        this.parent.editModule.dialogModule.isResourceUpdate = false;
                    }
                }
                if (!this.parent.undoRedoModule || !this.parent.undoRedoModule['isUndoRedoPerformed']) {
                    ganttData.ganttProperties.resourceInfo = resourceData;
                }
                ganttObj.dataOperation.updateMappingData(ganttData, 'resourceInfo');
            } else if (tasks.dependency === key) {
                //..
            } else if ([tasks.progress, tasks.notes, tasks.durationUnit, tasks.expandState,
                tasks.milestone, tasks.name, tasks.baselineStartDate,
                tasks.baselineEndDate, tasks.id, tasks.segments,tasks.cssClass].indexOf(key) !== -1) {
                const column: ColumnModel = ganttObj.columnByField[key as string];
                /* eslint-disable-next-line */
                let value: any = data[key as string];
                if (!isNullOrUndefined(column) && (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit')) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                let ganttPropKey: string = ganttPropByMapping[key as string];
                if (key === tasks.id) {
                    ganttPropKey = 'taskId';
                } else if (key === tasks.name) {
                    ganttPropKey = 'taskName';
                }else if (key === tasks.cssClass) {
                    ganttPropKey = 'cssClass'
                }else if(key===tasks.milestone){
                    ganttPropKey = 'isMilestone';
                    if (!isNullOrUndefined(tasks.duration)) {
                         const ganttProp: ITaskData = ganttData.ganttProperties;
                        let durationValue: any = data[tasks.duration];
                        if(value){
                            durationValue = 0;
                        } else {
                           durationValue = durationValue <= 0 ?  1 : durationValue;
                        }
                        ganttObj.setRecordValue(tasks.duration, durationValue, ganttData, true);
                        ganttObj.setRecordValue('duration', durationValue, ganttProp, true);
                        ganttObj.setRecordValue('taskData.' + tasks.duration, durationValue, ganttData);                  
                    }
                }else if ((key === tasks.segments) && (!isNullOrUndefined(ganttData.ganttProperties.segments))) {
                    ganttPropKey = 'segments';
                    /* eslint-disable-next-line */
                    if (data && !isNullOrUndefined(data[this.parent.taskFields.segments]) && data[this.parent.taskFields.segments].length > 0) {
                        let totDuration: number = 0;
                        for (let i: number = 0; i < ganttData.ganttProperties.segments.length; i++) {
                            totDuration = totDuration + ganttData.ganttProperties.segments[i as number].duration;
                        }
                        const sdate: Date = ganttData.ganttProperties.startDate;
                        /* eslint-disable-next-line */
                        const edate: Date = this.parent.dataOperation.getEndDate(sdate, totDuration, ganttData.ganttProperties.durationUnit, ganttData.ganttProperties, false);
                        ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(edate), ganttData.ganttProperties, true);
                    }
                }
                if (!isNullOrUndefined(ganttPropKey)) {
                    ganttObj.setRecordValue(ganttPropKey, value, ganttData.ganttProperties, true);
                }
                if ((key === tasks.baselineStartDate || key === tasks.baselineEndDate) &&
                    (ganttData.ganttProperties.baselineStartDate && ganttData.ganttProperties.baselineEndDate)) {
                    ganttObj.setRecordValue('baselineStartDate', ganttObj.dataOperation.checkBaselineStartDate(ganttData.ganttProperties.baselineStartDate),ganttData.ganttProperties, true);
                    if (ganttData.ganttProperties.baselineEndDate && ganttData.ganttProperties.baselineEndDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
                        ganttObj.dataOperation.setTime(this.parent.defaultEndTime, ganttData.ganttProperties.baselineEndDate);
                    }
                    if ((ganttData.ganttProperties.baselineStartDate && ganttData.ganttProperties.baselineEndDate &&
                        (ganttData.ganttProperties.baselineStartDate.getTime() > ganttData.ganttProperties.baselineEndDate.getTime())) ||
                        ((!isNullOrUndefined(ganttData.ganttProperties.baselineStartDate) && !isNullOrUndefined(ganttData.ganttProperties.startDate) && (ganttData.ganttProperties.baselineStartDate.getTime() === ganttData.ganttProperties.startDate.getTime())) 
                        && (!isNullOrUndefined(ganttData.ganttProperties.baselineEndDate) && !isNullOrUndefined(ganttData.ganttProperties.endDate) && (ganttData.ganttProperties.baselineEndDate.toLocaleDateString() === ganttData.ganttProperties.endDate.toLocaleDateString())) &&
                        ganttData.ganttProperties.isMilestone)) {
                                ganttData.ganttProperties.baselineEndDate = ganttData.ganttProperties.baselineStartDate;
                    }
                    ganttObj.setRecordValue('baselineEndDate', ganttObj.dataOperation.checkBaselineEndDate(ganttData.ganttProperties.baselineEndDate),ganttData.ganttProperties, true);
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
                /* eslint-disable-next-line */
                if (key === tasks.segments && data && !isNullOrUndefined(data[this.parent.taskFields.segments]) && data[this.parent.taskFields.segments].length > 0) {
                    ganttObj.dataOperation.setSegmentsInfo(ganttData, true);
                }
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.indicators === key) {
                const value: Object[] = data[key as string];
                ganttObj.setRecordValue('indicators', value, ganttData.ganttProperties, true);
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.work === key) {
                ganttObj.setRecordValue('work', data[key as string], ganttData.ganttProperties, true);
                this.parent.dataOperation.updateMappingData(ganttData, 'work');
                this.parent.dataOperation.updateMappingData(ganttData, 'duration');
                this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
            } else if (key === tasks.type) {
                ganttObj.setRecordValue('taskType', data[key as string], ganttData.ganttProperties, true);
                //this.parent.dataOperation.updateMappingData(ganttData, 'taskType');
            } else if (ganttObj.customColumns.indexOf(key) !== -1) {
                const column: ColumnModel = ganttObj.columnByField[key as string];
                /* eslint-disable-next-line */
                let value: any = data[key as string];
                if (isNullOrUndefined(column.edit)) {
                    if (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') {
                        value = ganttObj.dataOperation.getDateFromFormat(value);
                    }
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.manual === key) {
                ganttObj.setRecordValue('isAutoSchedule', !data[key as string], ganttData.ganttProperties, true);
                this.parent.setRecordValue(key, data[key as string], ganttData);
                this.updateTaskScheduleModes(ganttData);
            }
        }
        if (isScheduleValueUpdated) {
            this.validateScheduleValues(scheduleFieldNames, ganttData, data);
        }
    }

    /**
     * To update duration, work, resource unit
     *
     * @param {IGanttData} currentData .
     * @param {string} column .
     * @returns {void} .
     */
    public updateResourceRelatedFields(currentData: IGanttData, column: string): void {
        const ganttProp: ITaskData = currentData.ganttProperties;
        const taskType: string = ganttProp.taskType;
        let isEffectDriven: boolean;
        const isAutoSchedule: boolean = ganttProp.isAutoSchedule;
        if (!isNullOrUndefined(ganttProp.resourceInfo)) {
            if (ganttProp.work > 0 || column === 'work') {
                switch (taskType) {
                case 'FixedUnit':
                    if (ganttProp.resourceInfo.length === 0) {
                        return;
                    }
                    else if (isAutoSchedule && ganttProp.resourceInfo.length &&
                            (column === 'work' || (column === 'resource'))) {
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
                                this.parent.setRecordValue('work', 0, ganttProp, true);
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
        const ganttObj: Gantt = this.parent;
        if (fieldNames.length > 2) {
            ganttObj.dataOperation.calculateScheduledValues(ganttData, data, false);
        } else if (fieldNames.length > 1) {
            this.validateScheduleByTwoValues(data, fieldNames, ganttData);
        } else {
            this.dialogModule.validateScheduleValuesByCurrentField(fieldNames[0], data[fieldNames[0]], ganttData);
        }
    }
    private validateScheduleByTwoValues(data: Object, fieldNames: string[], ganttData: IGanttData): void {
        const ganttObj: Gantt = this.parent; let startDate: Date; let endDate: Date; let duration: string;
        const tasks: TaskFieldsModel = ganttObj.taskFields; const ganttProp: ITaskData = ganttData.ganttProperties;
        const isUnscheduledTask: boolean = ganttObj.allowUnscheduledTasks;
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
        const taskData: ITaskData = data.ganttProperties;
        const prevData: IGanttData = this.parent.previousRecords &&
            this.parent.previousRecords[data.uniqueID];
        if (prevData && prevData.ganttProperties) {
            const prevStart: Date = getValue('ganttProperties.startDate', prevData) as Date;
            const prevEnd: Date = getValue('ganttProperties.endDate', prevData) as Date;
            const prevDuration: number = getValue('ganttProperties.duration', prevData);
            const prevDurationUnit: string = getValue('ganttProperties.durationUnit', prevData);
            const keys: string[] = Object.keys(prevData.ganttProperties);
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
        const prevData: IGanttData = this.parent.previousRecords[data.uniqueID];
        // eslint-disable-next-line
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
     *
     * @param {IGanttData} data .
     * @returns {boolean} .
     */
    private isCheckPredecessor(data: IGanttData): boolean {
        let isValidatePredecessor: boolean = false;
        const prevData: IGanttData = this.parent.previousRecords[data.uniqueID];

        if (prevData && this.parent.taskFields.dependency && this.parent.isInPredecessorValidation &&
            this.parent.predecessorModule.getValidPredecessor(data).length > 0) {

            if (this.isTaskbarMoved(data)) {
                isValidatePredecessor = true;
            }
        }
        return isValidatePredecessor;
    }
    /**
     * Method to copy the ganttProperties values
     *
     * @param {IGanttData} data .
     * @param {IGanttData} updateData .
     * @returns {void} .
     * @private
     */
    public updateGanttProperties(data: IGanttData, updateData: IGanttData): void {
        const skipProperty: string[] = ['taskId', 'uniqueID', 'rowUniqueID', 'parentId'];
        Object.keys(data.ganttProperties).forEach((property: string) => {
            if (skipProperty.indexOf(property) === -1) {
                updateData.ganttProperties[property as string] = data.ganttProperties[property as string];
            }
        });
    }
    /**
     * Method to update all dependent record on edit action
     *
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     * @private
     */
    public initiateUpdateAction(args: ITaskbarEditedEventArgs): void {
        let isValidatePredecessor: boolean = this.isCheckPredecessor(args.data);
        let parentData:any;
        let childRecordIndex:any;
        if (!isNullOrUndefined(args.data.parentItem) && !isValidatePredecessor) {
            parentData = this.parent.getRecordByID(args.data.parentItem.taskId)
            if (this.isTaskbarMoved(args.data) && this.parent.predecessorModule.getValidPredecessor(parentData).length > 0
            && this.parent.isInPredecessorValidation) {
                isValidatePredecessor  = true;
            } else {
                isValidatePredecessor  = false;
            }
        } else if (args.data.childRecords.length > 0 && !isValidatePredecessor) {
            isValidatePredecessor = this.isCheckPredecessor(args.data);
            if (!isValidatePredecessor && this.isTaskbarMoved(args.data) ) {
                for (let i: number = 0; i<args.data.childRecords.length; i++) {
                    if (this.parent.predecessorModule.getValidPredecessor(args.data.childRecords[i as number]).length > 0) {
                        childRecordIndex = i;
                        isValidatePredecessor  = true;
                    }
                }
            }
        }
        if(!this.parent.undoRedoModule || (this.parent.undoRedoModule && !this.parent.undoRedoModule['currentAction'] || (this.parent.undoRedoModule['currentAction'] && this.parent.undoRedoModule['currentAction']['action'] != 'indent' && this.parent.undoRedoModule['currentAction']['action'] != 'outdent'))) {
            this.taskbarMoved = this.isTaskbarMoved(args.data);
        }
        this.predecessorUpdated = this.isPredecessorUpdated(args.data);
        if (this.predecessorUpdated) {
            this.parent.isConnectorLineUpdate = true;
            this.parent.connectorLineEditModule.addRemovePredecessor(args.data);
        }
        let validateObject: object = {};
        if (isValidatePredecessor) {
            if (!isNullOrUndefined(parentData)) {
                validateObject = this.parent.connectorLineEditModule.validateTypes(parentData,args.data);
            } else if (!isNullOrUndefined(childRecordIndex)) {
                validateObject = this.parent.connectorLineEditModule.validateTypes(args.data.childRecords[childRecordIndex as number],args.data);
            } else {
                validateObject = this.parent.connectorLineEditModule.validateTypes(args.data);
            }
            this.parent.isConnectorLineUpdate = true;
            if (!isNullOrUndefined(getValue('violationType', validateObject))) {
                const newArgs: IValidateArgs = this.validateTaskEvent(args);
                if (newArgs.validateMode.preserveLinkWithEditing === false &&
                    newArgs.validateMode.removeLink === false &&
                    newArgs.validateMode.respectLink === false) {
                    this.parent.connectorLineEditModule.openValidationDialog(validateObject);
                } else {
                    if (this.parent.editModule && this.parent.editModule.dialogModule &&
                        this.parent.editModule.dialogModule['isEdit'] && this.predecessorUpdated) {
                        this.isValidatedEditedRecord = true;
                        this.parent.predecessorModule.validatePredecessor(args.data, [], '');
                    }
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
     * @param {ITaskbarEditedEventArgs} editedEventArgs method to trigger validate predecessor link by dialog
     * @returns {IValidateArgs} .
     */
    private validateTaskEvent(editedEventArgs: ITaskbarEditedEventArgs): IValidateArgs {
        const newArgs: IValidateArgs = {};
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
     * @param {ITaskAddedEventArgs} args - Edited event args like taskbar editing, dialog editing, cell editing
     * @returns {void} .
     * @private
     */
    public updateEditedTask(args: ITaskbarEditedEventArgs): void {
        const ganttRecord: IGanttData = args.data;
        this.editedRecord = ganttRecord;
        if (this.parent.autoCalculateDateScheduling) {
            this.updateParentChildRecord(ganttRecord);
        }
        if ((this.parent.isConnectorLineUpdate || (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'])) && this.parent.autoCalculateDateScheduling) {
            /* validating predecessor for updated child items */
            for (let i: number = 0; i < this.parent.predecessorModule.validatedChildItems.length; i++) {
                const child: IGanttData = this.parent.predecessorModule.validatedChildItems[i as number];
                if (child.ganttProperties.predecessor && child.ganttProperties.predecessor.length > 0) {
                    this.parent.editedTaskBarItem = child;
                    if (!this.isValidatedEditedRecord) {
                        this.isFirstCall = true;
                    }
                    this.parent.predecessorModule.validatePredecessor(child, [], '');
                }
            }
            this.parent.predecessorModule.isValidatedParentTaskID = '';
            /** validating predecessor for current edited records */
            if (ganttRecord.ganttProperties.predecessor) {
                this.parent.isMileStoneEdited = ganttRecord.ganttProperties.isMilestone;
                if (this.taskbarMoved) {
                    this.parent.editedTaskBarItem = ganttRecord;
                }
                if (!this.isValidatedEditedRecord) {
                   this.isFirstCall = true;
                   this.parent.predecessorModule.validatePredecessor(ganttRecord, [], '');
                }
                this.isValidatedEditedRecord = false;
            }
            if (this.parent.allowParentDependency && this.parent.predecessorModule.isValidatedParentTaskID != ganttRecord.ganttProperties.taskId && ganttRecord.hasChildRecords && this.parent.previousRecords[ganttRecord.uniqueID].ganttProperties.startDate &&
                (args.action === "DrawConnectorLine")) {
                this.parent.predecessorModule['updateChildItems'](ganttRecord);
            }
            this.parent.predecessorModule.isValidatedParentTaskID = '';
            if(this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
                for (let i: number = 0; i < ganttRecord.childRecords.length; i++) {
                    if (ganttRecord.childRecords[i as number].ganttProperties.predecessor) {
                        this.parent.predecessorModule.validatePredecessor(ganttRecord.childRecords[i as number], [], '');
                    }
                }
            }
            this.updateParentItemOnEditing();
            this.parent.dataOperation.updateParentItems(ganttRecord, true);
        }
        /** Update parent up-to zeroth level */
        if (ganttRecord.parentItem) {
            if (this.parent.autoCalculateDateScheduling) {
                this.parent.dataOperation.updateParentItems(ganttRecord, true);
            }
            let parentData: IGanttData = this.parent.getRecordByID(ganttRecord.parentItem.taskId);
            if (!isNullOrUndefined(parentData)) {
                if (!parentData.ganttProperties.predecessorsName) {
                    this.isFirstCall = true;
                    this.parent.predecessorModule.validatePredecessor(parentData, [], '');
                    this.updateParentItemOnEditing();
                    this.parent.ganttChartModule.reRenderConnectorLines()
                }
            }
        }
        if (this.parent.UpdateOffsetOnTaskbarEdit && this.parent.connectorLineEditModule && args.data) {
           this.parent.connectorLineEditModule['calculateOffset'](args.data);
        }
        this.parent.predecessorModule['validatedParentIds'] = [];
        this.initiateSaveAction(args);
    }

    private updateParentItemOnEditing(): void {
        const childRecord: object[] = getValue('parentRecord', this.parent.predecessorModule);
        for (let i: number = 0; i < childRecord.length; i++) {
            this.parent.dataOperation.updateParentItems(childRecord[i as number]);
        }
        setValue('parentRecord', [], this.parent.predecessorModule);
        setValue('parentIds', [], this.parent.predecessorModule);
    }
    /**
     * To update parent records while perform drag action.
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateParentChildRecord(data: IGanttData): void {
        const ganttRecord: IGanttData = data;
        if (ganttRecord.hasChildRecords && this.taskbarMoved && (ganttRecord[this.parent.taskFields.manual] === false || this.parent.taskMode === 'Auto') && (!isNullOrUndefined(this.parent.editModule.cellEditModule) && !this.parent.editModule.cellEditModule.isResourceCellEdited)) {
            this.parent.predecessorModule['updateChildItems'](ganttRecord);
        }
        if (!isNullOrUndefined(this.parent.editModule.cellEditModule)) {
            this.parent.editModule.cellEditModule.isResourceCellEdited = false;
        }
    }
    /**
     * To update records while changing schedule mode.
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateTaskScheduleModes(data: IGanttData): void {
        const currentValue: Date = data[this.parent.taskFields.startDate];
        const ganttProp: ITaskData = data.ganttProperties;
        if (data.hasChildRecords && ganttProp.isAutoSchedule) {
            this.parent.setRecordValue('startDate', ganttProp.autoStartDate, ganttProp, true);
            this.parent.setRecordValue('endDate', ganttProp.autoEndDate, ganttProp, true);
            this.parent.setRecordValue('StartDate', ganttProp.autoStartDate, data, true);
            this.parent.setRecordValue('EndDate', ganttProp.autoEndDate, data, true);
            this.parent.setRecordValue('taskData.StartDate', ganttProp.autoStartDate, data, true);
            this.parent.setRecordValue('taskData.EndDate', ganttProp.autoEndDate, data, true);
            this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(data, true), ganttProp, true);
            this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttProp, true), ganttProp, true);
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(ganttProp.width, ganttProp.progress),
                ganttProp,
                true
            );
            this.parent.dataOperation.calculateDuration(data);
        } else if (data.hasChildRecords && !ganttProp.isAutoSchedule) {
            this.parent.dataOperation.updateWidthLeft(data);
            this.parent.dataOperation.calculateDuration(data);
            this.parent.setRecordValue('autoStartDate', ganttProp.autoStartDate, ganttProp, true);
            this.parent.setRecordValue('autoEndDate', ganttProp.autoEndDate, ganttProp, true);
            this.parent.setRecordValue('autoDuration', this.parent.dataOperation.calculateAutoDuration(data), ganttProp, true);
            this.parent.dataOperation.updateAutoWidthLeft(data);
        } else {
            const startDate: Date = this.parent.dateValidationModule.checkStartDate(currentValue, data.ganttProperties);
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
     * To update progress value of parent tasks
     *
     * @param {IParent} cloneParent .
     * @returns {void} .
     * @private
     */
    public updateParentProgress(cloneParent: IParent): void {
        let parentProgress: number = 0;
        const parent: IGanttData = this.parent.getParentTask(cloneParent);
        const childRecords: IGanttData[] = parent.childRecords;
        const childCount: number = childRecords ? childRecords.length : 0;
        let totalProgress: number = 0;
        let milesStoneCount: number = 0;
        let taskCount: number = 0;
        let totalDuration: number = 0;
        let progressValues: Object = {};
        if (childRecords) {
            for (let i: number = 0; i < childCount; i++) {
                if ((!childRecords[i as number].ganttProperties.isMilestone || childRecords[i as number].hasChildRecords) &&
                    isScheduledTask(childRecords[i as number].ganttProperties)) {
                    progressValues = this.parent.dataOperation.getParentProgress(childRecords[i as number]);
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
     *
     * @param {object} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    public revertCellEdit(args: object): void {
        this.parent.editModule.reUpdatePreviousRecords(false, true);
        this.resetEditProperties();
    }

    /**
     * @param {boolean} isRefreshChart .
     * @param {boolean} isRefreshGrid .
     * @returns {void} .
     * @private
     */
    public reUpdatePreviousRecords(isRefreshChart?: boolean, isRefreshGrid?: boolean): void {
        const collection: object = this.parent.previousRecords;
        const keys: string[] = Object.keys(collection);
        for (let i: number = 0; i < keys.length; i++) {
            const uniqueId: string = keys[i as number];
            const prevTask: IGanttData = collection[uniqueId as string] as IGanttData;
            const originalData: IGanttData = this.parent.getTaskByUniqueID(uniqueId);
            this.copyTaskData(originalData.taskData, prevTask.taskData);
            delete prevTask.taskData;
            this.copyTaskData(originalData.ganttProperties, prevTask.ganttProperties);
            delete prevTask.ganttProperties;
            this.copyTaskData(originalData, prevTask);
            const rowIndex: number = this.parent.currentViewData.indexOf(originalData);
            if (isRefreshChart) {
                this.parent.chartRowsModule.refreshRow(rowIndex);
            }
            if (isRefreshGrid) {
                const dataId: number | string = this.parent.viewType === 'ProjectView' ? originalData.ganttProperties.taskId : originalData.ganttProperties.rowUniqueID;
                this.parent.treeGrid.grid.setRowData(dataId, originalData);
                const row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                    this.parent.treeGrid.grid.getDataRows()[rowIndex as number].getAttribute('data-uid'));
                row.data = originalData;
            }
        }
    }
    /**
     * Copy previous task data value to edited task data
     *
     * @param {object} existing .
     * @param {object} newValue .
     * @returns {void} .
     */
    private copyTaskData(existing: Object, newValue: object): void {
        if (!isNullOrUndefined(newValue)) {
            extend(existing, newValue);
        }
    }

    /**
     * To update schedule date on editing.
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private updateScheduleDatesOnEditing(args: ITaskbarEditedEventArgs): void {
        //..
    }

    /**
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     * @private
     */
    public initiateSaveAction(args: ITaskbarEditedEventArgs): void {
        let eventArgs: IActionBeginEventArgs = {};
        eventArgs.requestType = 'beforeSave';
        eventArgs.data = args.data;
        eventArgs.cancel = false;
        this.createArray = true;
        if (this.parent.toolbarModule && this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['getUndoCollection'].length > 0) {
            this.parent.toolbarModule.enableItems([this.parent.controlId + '_undo'], true); // enable toolbar items.
        }
        eventArgs.modifiedRecords = this.parent.editedRecords;
        if (!isNullOrUndefined(args.target)) {
            eventArgs.target = args.target;
        }
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords, true);
        if (args.action && args.action === 'DrawConnectorLine') {
            eventArgs.action = 'DrawConnectorLine';
        }
        const ganttObj: Gantt = this.parent;
        const currentBaselineStart = { ...eventArgs.data.ganttProperties.baselineStartDate };
        const currentBaselineEnd = { ...eventArgs.data.ganttProperties.baselineEndDate };
        const currentProgress = eventArgs.data.ganttProperties.progress;
        this.parent.trigger('actionBegin', eventArgs, (eventArg: IActionBeginEventArgs) => {
            if (currentBaselineStart != eventArg.data["ganttProperties"].baselineStartDate
            || currentBaselineEnd != eventArg.data["ganttProperties"].baselineEndDate) {
                ganttObj.setRecordValue(
                    'baselineLeft', ganttObj.dataOperation.calculateBaselineLeft(
                        eventArg.data['ganttProperties']),
                    eventArg.data['ganttProperties'], true);
                ganttObj.setRecordValue(
                    'baselineWidth', ganttObj.dataOperation.calculateBaselineWidth(
                        eventArg.data['ganttProperties']),
                    eventArg.data['ganttProperties'], true);
            }
            if (!isNullOrUndefined(this.parent.taskFields.progress) && currentProgress != eventArg.data["ganttProperties"].progress) {
                const width: number = eventArg.data['ganttProperties'].isAutoSchedule ? eventArg.data['ganttProperties'].width :
                    eventArg.data['ganttProperties'].autoWidth;
                this.parent.setRecordValue(
                    'progressWidth',
                    this.parent.dataOperation.getProgressWidth(width, eventArg.data['ganttProperties'].progress),
                    eventArg.data['ganttProperties'],
                    true
                );
            }
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer" ) {
                this.parent.showMaskRow();
            } else {
                this.parent.showSpinner();
            }
            if (eventArg.cancel) {
                this.reUpdatePreviousRecords();
                this.parent.chartRowsModule.refreshRecords([args.data]);
                this.resetEditProperties(eventArgs);
                // Trigger action complete event with save canceled request type
            } else {
                eventArg.modifiedTaskData = getTaskData(eventArg.modifiedRecords, null, null, this.parent);
                if (isRemoteData(this.parent.dataSource)) {
                    const data: DataManager = this.parent.dataSource as DataManager;
                    const updatedData: object = {
                        changedRecords: eventArg.modifiedTaskData
                    };
                    const query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                    let crud: Promise<Object> = null;
                    const dataAdaptor: AdaptorOptions = data.adaptor;
                    if (!(dataAdaptor instanceof WebApiAdaptor && dataAdaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                        crud = data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                    } else {
                        const changedRecords: string = 'changedRecords';
                        crud = data.update(this.parent.taskFields.id, updatedData[changedRecords as string], null, query) as Promise<Object>;
                    }
                    crud.then((e: ReturnType) => this.dmSuccess(e, args))
                        .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                } else {
                    this.saveSuccess(args);
                }
                if (this.parent.enableVirtualization && this.parent.enableTimelineVirtualization) {
                    this.parent.ganttChartModule['setVirtualHeight']();
                }
                if (this.parent.undoRedoModule) {
                    this.parent.previousFlatData = extend([], this.parent.flatData, [], true) as IGanttData[];
                }
            }
        });
    }

    private dmSuccess(e: any, args: ITaskbarEditedEventArgs): void {
        let eLength: any;
        let rec: any;
        if(e.changedRecords){
            eLength = e.changedRecords['length'];
        }
        else{
            eLength = e['length'];
        }
        for (let i = 0; i < eLength; i++) {
            if(e.changedRecords){
             rec = e.changedRecords[parseInt(i.toString(), 10)];
            }
            else{
             rec = e[parseInt(i.toString(), 10)];
            }
            let _aLength: any = Object.keys(rec).length;
            for (let j = 0, _a = Object.keys(rec); j < _aLength; j++) {
                let key: any = _a[parseInt(j.toString(), 10)];
                this.parent.editedRecords[parseInt(i.toString(), 10)][`${key}`] = rec[`${key}`];
                this.parent.editedRecords[parseInt(i.toString(), 10)].taskData[`${key}`] = rec[`${key}`];
            }
            if (this.parent.taskFields.id !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['taskId'] = rec[this.parent.taskFields.id];
            }
            if (this.parent.taskFields.name !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['taskName'] = rec[this.parent.taskFields.name];
            }
            if (this.parent.taskFields.startDate !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['startDate'] = rec[this.parent.taskFields.startDate];
            }
            if (this.parent.taskFields.endDate !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['endDate'] = rec[this.parent.taskFields.endDate];
            }
            if (this.parent.taskFields.duration !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['duration'] = parseFloat(rec[this.parent.taskFields.duration]);
            }
            if (this.parent.taskFields.durationUnit !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['durationUnit'] = rec[this.parent.taskFields.durationUnit];
            }
            if (this.parent.taskFields.progress !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['progress'] = rec[this.parent.taskFields.progress];
            }
            if (this.parent.taskFields.dependency !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['dependency'] = rec[this.parent.taskFields.dependency];
            }
            if (this.parent.taskFields.parentID !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['parentID'] = rec[this.parent.taskFields.parentID];
            }
            if (this.parent.taskFields.baselineEndDate !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['baselineEndDate'] = rec[this.parent.taskFields.baselineEndDate];
            }
            if (this.parent.taskFields.baselineStartDate !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['baselineStartDate'] = rec[this.parent.taskFields.baselineStartDate];
            }
            if (this.parent.taskFields.resourceInfo !== null) {
                this.parent.editedRecords[parseInt(i.toString(), 10)].ganttProperties['resources'] = rec[this.parent.taskFields.resourceInfo];
            }
        }
        this.saveSuccess(args);

    }

    private dmFailure(e: { result: Object[] }, args: ITaskbarEditedEventArgs): void {// eslint-disable-line
        if (this.deletedTaskDetails.length) {
            const deleteRecords: IGanttData[] = this.deletedTaskDetails;
            for (let d: number = 0; d < deleteRecords.length; d++) {
                deleteRecords[d as number].isDelete = false;
            }
            this.deletedTaskDetails = [];
        }
        this.reUpdatePreviousRecords(true, true);
        this.resetEditProperties();
        this.parent.trigger('actionFailure', { error: e });
    }
    private updateSharedTask(data: IGanttData): void {
        const ids: string[] = data.ganttProperties.sharedTaskUniqueIds;
        for (let i: number = 0; i < ids.length; i++) {
            const editRecord: IGanttData = this.parent.flatData[this.parent.ids.indexOf(ids[i as number].toString())];
            if (editRecord && editRecord.uniqueID !== data.uniqueID) {
                this.updateGanttProperties(data, editRecord);
                this.parent.setRecordValue('taskData', data.taskData, editRecord, true);
                this.parent.dataOperation.updateTaskData(editRecord);
                this.parent.dataOperation.updateResourceName(editRecord);
                if (!isNullOrUndefined(editRecord.parentItem)) {
                    this.parent.dataOperation.updateParentItems(editRecord.parentItem);
                }
            }
        }
    }
    /**
     * Method for save action success for local and remote data
     *
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     */
    private saveSuccess(args: ITaskbarEditedEventArgs): void {
        const eventArgs: IActionBeginEventArgs = {};
        if (this.parent.timelineSettings.updateTimescaleView) {
            const tempArray: IGanttData[] = this.parent.editedRecords;
            this.parent.timelineModule.updateTimeLineOnEditing([tempArray], args.action);
        }
        if (this.parent.viewType === 'ResourceView') {
            if (args.action === 'TaskbarEditing' || args.action === 'DrawConnectorLine') {
                this.updateSharedTask(args.data);
            } else if (args.action === 'DialogEditing' || args.action === 'CellEditing'  || args.action === 'methodUpdate') {
                if (this.parent.editModule.dialogModule.isResourceUpdate) {
                    /* eslint-disable-next-line */
                    this.updateResoures(this.parent.editModule.dialogModule.previousResource, args.data.ganttProperties.resourceInfo, args.data);
                    this.updateSharedTask(args.data);
                    this.isTreeGridRefresh = true;
                } else {
                    this.updateSharedTask(args.data);
                }
            }
            // method to update the edited parent records
            for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[k as number]);
            }
            this.updateParentRecords = [];
            this.parent.editModule.dialogModule.isResourceUpdate = false;
            this.parent.editModule.dialogModule.previousResource = [];
        }
        if (!this.isTreeGridRefresh) {
            if (this.parent.editSettings.allowEditing && this.parent.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0) {
                this.parent.treeGrid.endEdit();
            }
            this.parent.chartRowsModule.refreshRecords(this.parent.editedRecords);
            if (!this.parent.allowTaskbarOverlap && this.parent.showOverAllocation) {
                this.parent.contentHeight = this.parent['element'].getElementsByClassName('e-content')[0].children[0]['offsetHeight'];
                this.parent.ganttChartModule.chartBodyContent.style.height = this.parent.contentHeight + 'px';
                this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
                if (this.parent.taskFields.dependency) {
                    this.parent.ganttChartModule.reRenderConnectorLines();
                }
            } 
            if ((this.parent.isConnectorLineUpdate || (this.parent.undoRedoModule && this.parent.undoRedoModule['currentAction'] && this.parent.undoRedoModule['currentAction']['connectedRecords'])) && !isNullOrUndefined(this.parent.connectorLineEditModule)) {
                this.parent.updatedConnectorLineCollection = [];
                this.parent.connectorLineIds = [];
                this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(this.parent.editedRecords);
                this.parent.ganttChartModule.reRenderConnectorLines();
                this.updateScheduleDatesOnEditing(args);
            }
        }
        if (this.parent.enableCriticalPath) {
            let criticalModule: CriticalPath = this.parent.criticalPathModule;
            criticalModule.showCriticalPath(true);
            criticalModule.criticalConnectorLine(criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection, true, criticalModule.predecessorCollectionTaskIds);
        }
        if (!this.parent.editSettings.allowTaskbarEditing || (this.parent.editSettings.allowTaskbarEditing &&
            !this.taskbarEditModule.dependencyCancel)) {
            eventArgs.requestType = 'save';
            eventArgs.data = args.data;
            eventArgs.modifiedRecords = this.parent.editedRecords;
            eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords, null, null, this.parent);
            if (!isNullOrUndefined(args.action)) {
                setValue('action', args.action, eventArgs);
            }
            if (args.action === 'TaskbarEditing') {
                eventArgs.taskBarEditAction = args.taskBarEditAction;
            }
            this.endEditAction(args);
            this.parent.trigger('actionComplete', eventArgs);
            if (this.parent.allowTaskbarDragAndDrop && this.parent.rowDragAndDropModule && this.parent.rowDragAndDropModule['draggedRecord']) {
                this.parent.rowDragAndDropModule['draggedRecord'] = null;
            }
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
                this.parent.hideMaskRow();
            } else {
                this.parent.hideSpinner();
            }
        } else {
            this.taskbarEditModule.dependencyCancel = false;
            this.resetEditProperties();
        }
        if (this.parent.viewType === 'ResourceView' && this.isTreeGridRefresh) {
            this.parent.treeGrid.parentData = [];
            this.parent.updatedConnectorLineCollection = [];
            this.parent.connectorLineIds = [];
            this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
            this.parent.treeGrid.refresh();
            this.isTreeGridRefresh = false;
        }
       this.parent.editedRecords = [];
    }

    private updateResoures(prevResource: Object[], currentResource: Object[], updateRecord: IGanttData): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentLength: number = currentResource ? currentResource.length : 0;
        const previousLength: number = prevResource ? prevResource.length : 0;
        if (currentLength === 0 && previousLength === 0) {
            return;
        }
        for (let index: number = 0; index < currentLength; index++) {
            const recordIndex: number[] = [];
            let resourceID: string | number = parseInt(currentResource[index as number][this.parent.resourceFields.id], 10).toString();
            if (resourceID === 'NaN') {
                resourceID = currentResource[index as number][this.parent.resourceFields.id];
            }
            for (let i: number = 0; i < prevResource.length; i++) {
                let prevResourceID: string | number = parseInt(prevResource[i as number][this.parent.resourceFields.id], 10).toString();
                if (prevResourceID === 'NaN') {
                    prevResourceID = prevResource[i as number][this.parent.resourceFields.id];
                }
                if (prevResourceID === resourceID) {
                    recordIndex.push(i);
                    break;
                }
            }
            if (recordIndex.length === 0) {
                const parentRecord: IGanttData = flatRecords[this.parent.getTaskIds().indexOf('R' + resourceID)];
                if (parentRecord) {
                    this.addNewRecord(updateRecord, parentRecord);
                }
            } else {
                let record1: any = parseInt(recordIndex[0].toString(), 10);
                if (record1.toString() === "NaN") {
                    record1 = recordIndex[0].toString()
                }
                prevResource.splice(record1, 1);
            }
        }
        const prevLength: number = prevResource ? prevResource.length : 0;
        for (let index: number = 0; index < prevLength; index++) {
            const taskID: string = updateRecord.ganttProperties.taskId;
            const resourceID: string = prevResource[index as number][this.parent.resourceFields.id];
            const record: IGanttData = flatRecords[this.parent.getTaskIds().indexOf('R' + resourceID)];
            if (!isNullOrUndefined(record)) {
                for (let j: number = 0; j < record.childRecords.length; j++) {
                    if (record.childRecords[j as number].ganttProperties.taskId === taskID) {
                        this.removeChildRecord(record.childRecords[j as number]);
                    }
                }
            }
        }
        if (currentLength > 0) {
            const parentTask: IGanttData = this.parent.getParentTask(updateRecord.parentItem);
            if (parentTask) {
                if (parentTask.ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask')) {
                    this.removeChildRecord(updateRecord);
                }
            }
        }
        //Assign resource to unassigned task
        if (currentLength === 0) {
            this.checkWithUnassignedTask(updateRecord);
        }
        if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.flatData[this.parent.flatData.length - 1].ganttProperties.taskName == this.parent.localeObj.getConstant('unassignedTask')) {
            this.parent.flatData.splice(this.parent.flatData.length - 1, 1);
            this.parent.currentViewData.splice(this.parent.currentViewData.length - 1, 1);
            this.parent.taskIds.splice(this.parent.flatData.length - 1, 1);
            this.parent.ids.splice(this.parent.flatData.length - 1, 1);
        }
    }
    /**
     * @param {IGanttData} updateRecord .
     * @returns {void} .
     * @private
     */
    public checkWithUnassignedTask(updateRecord: IGanttData): void {
        let unassignedTasks: IGanttData = null;
        // Block for check the unassigned task.
        for (let i: number = 0; i < this.parent.flatData.length; i++) {
            if (this.parent.flatData[i as number].ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask')) {
                unassignedTasks = this.parent.flatData[i as number];
            }
        }
        if (!isNullOrUndefined(unassignedTasks)) {
            this.addNewRecord(updateRecord, unassignedTasks);
        } else {
            // Block for create the unassigned task.
            const unassignTaskObj: Object = {};
            unassignTaskObj[this.parent.taskFields.id] = 0;
            unassignTaskObj[this.parent.taskFields.name] = this.parent.localeObj.getConstant('unassignedTask');
            const beforeEditStatus: boolean = this.parent.isOnEdit;
            this.parent.isOnEdit = false;
            const cAddedRecord: IGanttData = this.parent.dataOperation.createRecord(unassignTaskObj, 0);
            this.parent.isOnEdit = beforeEditStatus;
            this.addRecordAsBottom(cAddedRecord);
            const parentRecord: IGanttData = this.parent.flatData[this.parent.flatData.length - 1];
            this.addNewRecord(updateRecord, parentRecord);
            let source:any=this.parent.dataSource;
            source.push(updateRecord.taskData);
        }
        const updatedData: IGanttData = this.parent.currentViewData.filter((data: IGanttData) => {
                return (data.ganttProperties.taskId === updateRecord.ganttProperties.taskId &&
                    (data.hasChildRecords === updateRecord.hasChildRecords));
            })[0];
        updateRecord.parentItem = updatedData.parentItem;
        updateRecord.parentUniqueID = updatedData.parentUniqueID;
    }

    private addRecordAsBottom(cAddedRecord: IGanttData): void {
        const recordIndex1: number = this.parent.flatData.length;
        this.parent.currentViewData.splice(recordIndex1 + 1, 0, cAddedRecord);
        this.parent.flatData.splice(recordIndex1 + 1, 0, cAddedRecord);
        this.parent.ids.splice(recordIndex1 + 1, 0, cAddedRecord.ganttProperties.rowUniqueID.toString());
        const taskId: string = cAddedRecord.level === 0 ? 'R' + cAddedRecord.ganttProperties.taskId : 'T' + cAddedRecord.ganttProperties.taskId;
        this.parent.getTaskIds().splice(recordIndex1 + 1, 0, taskId);
        this.updateTreeGridUniqueID(cAddedRecord, 'add');
    }

    private addNewRecord(updateRecord: IGanttData, parentRecord: IGanttData): void {
        let cAddedRecord: IGanttData = null;
        cAddedRecord = extend({}, {}, updateRecord, true);
        this.parent.setRecordValue('uniqueID', getUid(this.parent.element.id + '_data_'), cAddedRecord);
        this.parent.setRecordValue('uniqueID', cAddedRecord.uniqueID, cAddedRecord.ganttProperties, true);
        const uniqueId: string = cAddedRecord.uniqueID.replace(this.parent.element.id + '_data_', '');
        this.parent.setRecordValue('rowUniqueID', uniqueId, cAddedRecord);
        this.parent.setRecordValue('rowUniqueID', uniqueId, cAddedRecord.ganttProperties, true);
        this.parent.setRecordValue('level', 1, cAddedRecord);
        if (this.parent.taskFields.parentID) {
            this.parent.setRecordValue('parentId', parentRecord.ganttProperties.taskId, cAddedRecord.ganttProperties, true);
        }
        this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentRecord), cAddedRecord);
        const parentUniqId: string = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
        this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
        updateRecord.ganttProperties.sharedTaskUniqueIds.push(uniqueId);
        cAddedRecord.ganttProperties.sharedTaskUniqueIds = updateRecord.ganttProperties.sharedTaskUniqueIds;
        this.addRecordAsChild(parentRecord, cAddedRecord);
    }
    private removeChildRecord(record: IGanttData): void {
        const gObj: Gantt = this.parent;
        let data: IGanttData[] = [];
        if (this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.json.length > 0) {
            data = this.parent.dataSource.dataSource.json;
        } else {
            data = this.parent.currentViewData;
        }
        const dataSource: Object = this.parent.dataSource;
        const deletedRow: IGanttData = record;
        const flatParentData: IGanttData = this.parent.getParentTask(deletedRow.parentItem);
        if (deletedRow) {
            if (deletedRow.parentItem) {
                const deleteChildRecords: IGanttData[] = flatParentData ? flatParentData.childRecords : [];
                let childIndex: number = 0;
                if (deleteChildRecords && deleteChildRecords.length > 0) {
                    if (deleteChildRecords.length === 1) {
                        //For updating the parent record which has no child reords.
                        this.parent.isOnDelete = true;
                        deleteChildRecords[0].isDelete = true;
                        this.parent.dataOperation.updateParentItems(flatParentData);
                        this.parent.isOnDelete = false;
                        deleteChildRecords[0].isDelete = false;
                    }
                    childIndex = deleteChildRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParentData);
                }
            }
            if (deletedRow.ganttProperties.sharedTaskUniqueIds.length) {
                const uniqueIDIndex: number =
                    deletedRow.ganttProperties.sharedTaskUniqueIds.indexOf(deletedRow.ganttProperties.rowUniqueID);
                deletedRow.ganttProperties.sharedTaskUniqueIds.splice(uniqueIDIndex, 1);
            }
            this.updateTreeGridUniqueID(deletedRow, 'delete');
            //method to delete the record from datasource collection
            if (!this.parent.taskFields.parentID) {
                const deleteRecordIDs: string[] = [];
                deleteRecordIDs.push(deletedRow.ganttProperties.rowUniqueID.toString());
                if (this.parent.viewType === 'ProjectView') {
                   this.parent.editModule.removeFromDataSource(deleteRecordIDs);
                }
            }
            const flatRecordIndex: number = this.parent.flatData.indexOf(deletedRow);
            if (gObj.taskFields.parentID) {
                let idx: number;
                const ganttData: IGanttData[] = this.parent.currentViewData;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (ganttData[i as number].ganttProperties.rowUniqueID === deletedRow.ganttProperties.rowUniqueID) {
                        idx = i;
                    }
                }
                if (idx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(idx, 1);
                    }
                    data.splice(idx, 1);
                    this.parent.flatData.splice(flatRecordIndex, 1);
                    this.parent.ids.splice(flatRecordIndex, 1);
                    this.parent.getTaskIds().splice(flatRecordIndex, 1);
                }
            }
            const recordIndex: number = data.indexOf(deletedRow);
            if (!gObj.taskFields.parentID) {
                const deletedRecordCount: number = this.parent.editModule.getChildCount(deletedRow, 0);
                data.splice(recordIndex, deletedRecordCount + 1);
                this.parent.flatData.splice(flatRecordIndex, deletedRecordCount + 1);
                this.parent.ids.splice(flatRecordIndex, deletedRecordCount + 1);
                this.parent.getTaskIds().splice(flatRecordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                this.parent.setRecordValue('expanded', false, flatParentData);
                this.parent.setRecordValue('hasChildRecords', false, flatParentData);
            }
        }
    }
    // Method to add new record after resource edit
    private addRecordAsChild(droppedRecord: IGanttData, draggedRecord: IGanttData): void {
        const gObj: Gantt = this.parent;
        const recordIndex1: number = this.parent.flatData.indexOf(droppedRecord);
        const childRecords: number = this.parent.editModule.getChildCount(droppedRecord, 0);
        let childRecordsLength: number;
        let spliceIndex: number;
        const parentTask: IGanttData = this.parent.getTaskByUniqueID(draggedRecord.parentItem.uniqueID);
        if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.dialogModule['indexes'] && this.dialogModule['indexes'].deletedIndexes && this.dialogModule['indexes'].deletedIndexes.length > 0) {
            if (parentTask.ganttProperties.taskName == this.parent.localeObj.getConstant('unassignedTask')) {
                childRecordsLength = this.parent.taskIds.length + 1;
            }
            else {
                for (let j: number = 0; j < this.dialogModule['indexes'].deletedIndexes.length; j++) {
                    if (this.dialogModule['indexes'].deletedIndexes[j as number].data.parentUniqueID == draggedRecord.parentUniqueID && draggedRecord.ganttProperties.taskId == this.dialogModule['indexes'].deletedIndexes[j as number].data.ganttProperties.taskId) {
                        let toIndex: number = this.dialogModule['indexes'].deletedIndexes[j as number].index;
                        this.dialogModule['indexes'].deletedIndexes[j as number].position == 'above' ? (childRecordsLength = toIndex) : (childRecordsLength = toIndex + 1);
                        for (let i: number = 0; i < droppedRecord.childRecords.length; i++) {
                            if ('T' + droppedRecord.childRecords[i as number].ganttProperties.taskId == this.dialogModule['indexes'].deletedIndexes[j as number].id) {
                                this.dialogModule['indexes'].deletedIndexes[j as number].position == 'above' ? (spliceIndex = i) : spliceIndex = i + 1;
                                break;
                            }
                        }
                        break;
                    }
                    else if (this.dialogModule['indexes'].deletedIndexes[j as number].data.parentUniqueID !== draggedRecord.parentUniqueID && draggedRecord.ganttProperties.taskId == this.dialogModule['indexes'].deletedIndexes[j as number].data.ganttProperties.taskId) {
                        let draggedParent: IGanttData = this.parent.getTaskByUniqueID(draggedRecord.parentItem.uniqueID);
                        childRecordsLength = draggedParent.index + draggedParent.childRecords.length + 1;
                        break;
                    }
                }
            }
        }
        else if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && parentTask.ganttProperties.taskName == this.parent.localeObj.getConstant('unassignedTask') && this.parent.undoRedoModule['currentAction']['deletedRecordsDetails']) {
            for (let i: number = 0; i < this.parent.undoRedoModule['currentAction']['deletedRecordsDetails'].length; i++) {
                if (this.parent.undoRedoModule['currentAction']['deletedRecordsDetails'][i as number].data.ganttProperties.taskId == draggedRecord.ganttProperties.taskId) {
                    if (parentTask.index) {
                        childRecordsLength = this.parent.undoRedoModule['currentAction']['deletedRecordsDetails'][i as number].data.index;
                        spliceIndex = childRecordsLength - parentTask.index - 1;
                    }
                    else {
                        childRecordsLength = (isNullOrUndefined(childRecords) ||
                            childRecords === 0) ? recordIndex1 + 1 :
                            childRecords + recordIndex1 + 1;
                        spliceIndex = 0;
                    }
                    break;
                }
            }
        }
        else if (!isNullOrUndefined(this.addRowIndex) && this.addRowPosition && droppedRecord.childRecords && this.addRowPosition !== 'Child') {
            const dropChildRecord: IGanttData = droppedRecord.childRecords[this.addRowIndex];
            const position: RowPosition = this.addRowPosition === 'Above' || this.addRowPosition === 'Below' ? this.addRowPosition :
                'Child';
            childRecordsLength = dropChildRecord ? this.addRowIndex + recordIndex1 + 1 :
                childRecords + recordIndex1 + 1;
            childRecordsLength = position === 'Above' ? childRecordsLength : childRecordsLength + 1;
        } else {
            childRecordsLength = (isNullOrUndefined(childRecords) ||
                childRecords === 0) ? recordIndex1 + 1 :
                childRecords + recordIndex1 + 1;
        }
        //this.ganttData.splice(childRecordsLength, 0, this.draggedRecord);
        this.parent.currentViewData.splice(childRecordsLength, 0, draggedRecord);
        this.parent.flatData.splice(childRecordsLength, 0, draggedRecord);
        this.parent.ids.splice(childRecordsLength, 0, draggedRecord.ganttProperties.rowUniqueID.toString());
        this.updateTreeGridUniqueID(draggedRecord, 'add');
        const recordId: string = draggedRecord.level === 0 ? 'R' + draggedRecord.ganttProperties.taskId : 'T' + draggedRecord.ganttProperties.taskId;
        this.parent.getTaskIds().splice(childRecordsLength, 0, recordId);
        if (!droppedRecord.hasChildRecords) {
            this.parent.setRecordValue('hasChildRecords', true, droppedRecord);
            this.parent.setRecordValue('expanded', true, droppedRecord);
            if (!droppedRecord.childRecords.length) {
                droppedRecord.childRecords = [];
                if (!gObj.taskFields.parentID && isNullOrUndefined(droppedRecord.taskData[this.parent.taskFields.child])) {
                    droppedRecord.taskData[this.parent.taskFields.child] = [];
                }
            }
        }
        if (spliceIndex >= 0) {
            droppedRecord.childRecords.splice(spliceIndex, 0, draggedRecord);
        }
        else {
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
        }
        if (!isNullOrUndefined(draggedRecord) && !this.parent.taskFields.parentID
            && !isNullOrUndefined(droppedRecord.taskData[this.parent.taskFields.child])) {
            droppedRecord.taskData[this.parent.taskFields.child].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
        }

        if (!isNullOrUndefined(draggedRecord.parentItem)) {
            //collection to update the parent records
            this.updateParentRecords.push(droppedRecord);
        }
    }

    private resetEditProperties(args?: object): void {
        this.parent.currentEditedArgs = {};
        this.resetValidateArgs();
        this.parent.editedTaskBarItem = null;
        this.parent.isOnEdit = false;
        this.parent.predecessorModule.validatedChildItems = [];
        this.parent.isConnectorLineUpdate = false;
        this.parent.editedTaskBarItem = null;
        this.taskbarMoved = false;
        this.predecessorUpdated = false;
        if (!isNullOrUndefined(this.dialogModule) && (isNullOrUndefined(args) ||
        (!isNullOrUndefined(args) && args['requestType'] === 'beforeSave' && !args['cancel']))) {
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
        this.parent.hideSpinner();
        this.parent.initiateEditAction(false);
    }
    /**
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
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
    // eslint-disable-next-line
    private saveFailed(args: ITaskbarEditedEventArgs): void {
        this.reUpdatePreviousRecords();
        this.parent.hideSpinner();
        //action failure event trigger
    }

    /**
     * To render delete confirmation dialog
     *
     * @returns {void} .
     */
    private renderDeleteConfirmDialog(): void {
        const dialogObj: Dialog = new Dialog({
            width: '320px',
            isModal: true,
            visible: false,
            enableRtl: this.parent.enableRtl,
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
            animationSettings: { effect: 'None' }
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
        const focussedElement: HTMLElement = this.parent.element.querySelector('.e-treegrid');
        focussedElement.focus();
    }
    /**
     * @returns {void} .
     * @private
     */
    public startDeleteAction(): void {
        if (this.parent.editSettings.allowDeleting && !this.parent.readOnly) {
            if (this.parent.editSettings.showDeleteConfirmDialog) {
                this.confirmDialog.show();
            } else {
                this.deleteSelectedItems();
                const focusingElement: HTMLElement = this.parent.element.querySelector('.e-treegrid');
                focusingElement.focus();
            }
        }
    }
    /**
     *
     * @param {IGanttData[]} selectedRecords - Defines the deleted records
     * @returns {void} .
     * Method to delete the records from resource view Gantt.
     */
    private deleteResourceRecords(selectedRecords: IGanttData[]): void {
        const deleteRecords: IGanttData[] = [];
        for (let i: number = 0; i < selectedRecords.length; i++) {
            if (selectedRecords[i as number].parentItem) {
                if (selectedRecords[i as number].ganttProperties.sharedTaskUniqueIds.length === 1) {
                    const data: IGanttData = selectedRecords[i as number];
                    const ids: string[] = data.ganttProperties.sharedTaskUniqueIds;
                    for (let j: number = 0; j < ids.length; j++) {
                        if (this.parent.ids.indexOf(ids[j as number].toString()) !== -1) {
                            deleteRecords.push(this.parent.flatData[this.parent.ids.indexOf(ids[j as number].toString())]);
                        }
                        else if(this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['currentAction'] && this.parent.undoRedoModule['currentAction']['action'] == 'Delete') {
                            deleteRecords.push(this.parent.flatData[this.parent.taskIds.indexOf('T' + selectedRecords[i as number].ganttProperties.taskId)]);
                        }
                    }
                    if (this.parent.ids.indexOf(data.ganttProperties.rowUniqueID) !== -1 && deleteRecords.indexOf(this.parent.flatData[this.parent.ids.indexOf(data.ganttProperties.rowUniqueID)]) === -1) {
                        deleteRecords.push(this.parent.flatData[this.parent.ids.indexOf(data.ganttProperties.rowUniqueID)]);
                    }
                }
                else if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && selectedRecords[i as number].ganttProperties.sharedTaskUniqueIds.length > 1) {
                    deleteRecords.push(selectedRecords[i as number]);
                }
            }
            else {
                const resourceParent: IGanttData = this.parent.flatData.filter((data: IGanttData) => {
                    return (data.ganttProperties.taskId === selectedRecords[i as number].ganttProperties.taskId &&
                    data.hasChildRecords);       
                })[0];
                deleteRecords.push(resourceParent);
            }
        }
        this.deleteRow(deleteRecords);
    }

    public add(record: IGanttData, totalRecords: IGanttData[]) {
        totalRecords.push(record);
        if (record.hasChildRecords) {
            let child: IGanttData[] = record.childRecords;
            for (let i: number = 0; i < child.length; i++) {
                this.add(child[i as number], totalRecords)
            }
        }
        else {
            if (totalRecords.indexOf(record) == -1) {
                totalRecords.push(record);
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
     *
     * @param {number | string | number[] | string[] | IGanttData | IGanttData[]} taskDetail - Defines the details of data to delete.
     * @returns {void} .
     * @public
     */
    public deleteRecord(taskDetail: number | string | number[] | string[] | IGanttData | IGanttData[]): void {
        this.isFromDeleteMethod = true;
        const variableType: string = typeof (taskDetail);
        this.targetedRecords = [];
        switch (variableType) {
        case 'number':
        case 'string':
        {
            const taskId: string = taskDetail.toString();
            if (this.parent.viewType === 'ResourceView') {
                if (!isNullOrUndefined(taskId) && this.parent.getTaskIds().indexOf('T' + taskId) !== -1) {
                    this.targetedRecords.push(this.parent.flatData[this.parent.getTaskIds().indexOf('T' + taskId)]);
                }
            } else {
                if (!isNullOrUndefined(taskId) && this.parent.ids.indexOf(taskId) !== -1) {
                    this.targetedRecords.push(this.parent.getRecordByID(taskId));
                }
            }
            break;
        }
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
     *
     * @param {object[]} taskDetailArray .
     * @returns {void} .
     */
    private updateTargetedRecords(taskDetailArray: object[]): void {
        if (taskDetailArray.length) {
            const variableType: string = typeof (taskDetailArray[0]);
            if (variableType === 'object') {
                this.targetedRecords = taskDetailArray;
            } else {
                // Get record from array of task ids
                for (let i: number = 0; i < taskDetailArray.length; i++) {
                    const id: string = taskDetailArray[i as number].toString();
                    if (this.parent.viewType === 'ResourceView') {
                        if (!isNullOrUndefined(id) && this.parent.getTaskIds().indexOf('T' + id) !== -1) {
                            this.targetedRecords.push(this.parent.flatData[this.parent.getTaskIds().indexOf('T' + id)]);
                        }
                    } else if (!isNullOrUndefined(id) && this.parent.ids.indexOf(id) !== -1) {
                        this.targetedRecords.push(this.parent.getRecordByID(id));
                    }
                }
            }
        }
    }

    private deleteRow(tasks: IGanttData[]): void {
        let rowItems: IGanttData[] = tasks && tasks.length ? tasks :
            this.parent.selectionModule.getSelectedRecords();
        this.parent.addDeleteRecord = true;
        if (rowItems.length) {
            this.parent.isOnDelete = true;
            rowItems.forEach((item: IGanttData): void => {
                item.isDelete = true;
            });
            if (this.parent.viewType === 'ResourceView' && !tasks.length) {
                rowItems = [];
            }
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent['isUndoRedoItemPresent']('Delete')) {
                if (this.parent.undoRedoModule['redoEnabled'] && !this.parent.undoRedoModule['isUndoRedoPerformed']) {
                    this.parent.undoRedoModule['disableRedo']();
                    this.parent.undoRedoModule['getUndoCollection'][0] = [];
                }
                if (!this.parent.undoRedoModule['isUndoRedoPerformed']) {
                    this.parent.undoRedoModule['createUndoCollection']();
                }
                let records: Object = {};
                records['action'] = 'Delete';
                records['deletedRecordsDetails'] = [];
                this.parent.undoRedoModule['findPosition'](extend([],[],rowItems,true) as IGanttData[],records,'deletedRecordsDetails');
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as any) = records;
            }
            for (let i: number = 0; i < rowItems.length; i++) {
                const deleteRecord: IGanttData = rowItems[i as number];
                if (this.deletedTaskDetails.indexOf(deleteRecord) !== -1) {
                    continue;
                }
                let deleteItems: IGanttData[] = [deleteRecord];
                if (this.parent.viewType == 'ResourceView' && this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && rowItems[i as number].ganttProperties.resourceInfo && rowItems[i as number].ganttProperties.resourceInfo.length > 1) {
                    deleteItems = [];
                    if (!rowItems[i as number].hasChildRecords) {
                        const id: string = 'T' + rowItems[i as number].ganttProperties.taskId;
                        this.parent.taskIds.reduce(function (a: any, e: any, j: any) {
                            if (e === id) {
                                deleteItems.push(this.parent.flatData[j as number]);
                            }
                        }.bind(this), []);
                    }
                }
                for (let j: number = 0; j < deleteItems.length; j++) {
                    const parentTask: IGanttData = this.parent.getParentTask(deleteItems[j as number].parentItem);
                    if (deleteItems[j as number].parentItem) {
                        const childRecord: IGanttData[] = parentTask.childRecords;
                        const filteredRecord: IGanttData[] = childRecord.length === 1 ?
                            childRecord : childRecord.filter((data: IGanttData): boolean => {
                                return !data.isDelete;
                            });
                        if (filteredRecord.length > 0) {
                            this.parent.dataOperation.updateParentItems(deleteItems[j as number].parentItem);
                        }
                    }
                    const predecessor: IPredecessor[] = deleteItems[j as number].ganttProperties.predecessor;
                    let canDeletePredecessor: boolean = true;
                    if (this.parent.viewType === 'ResourceView' && parentTask && parentTask.ganttProperties.taskName !==
                        this.parent.localeObj.getConstant('unassignedTask')) {
                        canDeletePredecessor = false;
                    }
                    if (predecessor && predecessor.length && canDeletePredecessor) {
                        this.removePredecessorOnDelete(deleteItems[j as number]);
                    }
                    this.deletedTaskDetails.push(deleteItems[j as number]);
                    if (deleteItems[j as number].hasChildRecords) {
                        this.deleteChildRecords(deleteItems[j as number]);
                    }
                }
            }
            if (this.parent.selectionModule && this.parent.allowSelection) {
                // clear selection
                this.parent.selectionModule.clearSelection();
            }
            const delereArgs: ITaskDeletedEventArgs = {};
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
        const predecessors: IPredecessor[] = record.ganttProperties.predecessor;
        for (let i: number = 0; i < predecessors.length; i++) {
            const predecessor: IPredecessor = predecessors[i as number];
            const recordId: string = this.parent.viewType === 'ResourceView' ? record.ganttProperties.taskId :
                record.ganttProperties.rowUniqueID;
            if (predecessor.from.toString() === recordId.toString()) {
                const toRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.to.toString());
                if (!isNullOrUndefined(toRecord)) {
                    const toRecordPredcessor: IPredecessor[] = extend([], [], toRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    let index: number;
                    for (let t: number = 0; t < toRecordPredcessor.length; t++) {
                        const toId: string = this.parent.viewType === 'ResourceView' ? toRecord.ganttProperties.taskId :
                            toRecord.ganttProperties.rowUniqueID;
                        if (toRecordPredcessor[t as number].to.toString() === toId.toString()
                            && toRecordPredcessor[t as number].from.toString() === recordId.toString()) {
                            index = t;
                            break;
                        }
                    }
                    toRecordPredcessor.splice(index, 1);
                    this.updatePredecessorValues(toRecord, toRecordPredcessor);
                }
            } else if (predecessor.to.toString() === recordId.toString()) {
                const fromRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.from.toString());
                if (!isNullOrUndefined(fromRecord)) {
                    const fromRecordPredcessor: IPredecessor[] = extend(
                        [], [], fromRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    let index: number;
                    for (let t: number = 0; t < fromRecordPredcessor.length; t++) {
                        const fromId: string = this.parent.viewType === 'ResourceView' ? fromRecord.ganttProperties.taskId :
                            fromRecord.ganttProperties.rowUniqueID;
                        if (fromRecordPredcessor[t as number].from.toString() === fromId.toString()
                            && fromRecordPredcessor[t as number].to.toString() === recordId.toString()) {
                            index = t;
                            break;
                        }
                    }
                    if (record.uniqueID == fromRecord.parentUniqueID || record.parentUniqueID == fromRecord.uniqueID || this.parent.isOnDelete) {
                        fromRecordPredcessor.splice(index, 1);
                        this.updatePredecessorValues(fromRecord, fromRecordPredcessor);
                    }
                }
            }
        }
    }

    private updatePredecessorValues(record: IGanttData, predcessorArray: IPredecessor[]): void {
        this.parent.setRecordValue('predecessor', predcessorArray, record.ganttProperties, true);
        const predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
    }

    /**
     * Method to update TaskID of a gantt record
     *
     * @param {string | number} currentId .
     * @param {number | string} newId .
     * @returns {void} .
     */
    public updateTaskId(currentId: string | number, newId: number | string): void {
        if (!this.parent.readOnly) {
            const cId: string = typeof currentId === 'number' ? currentId.toString() : currentId;
            const nId: string = typeof newId === 'number' ? newId.toString() : newId;
            const ids: string[] = this.parent.ids;
            if (!isNullOrUndefined(cId) && !isNullOrUndefined(nId)) {
                const cIndex: number = ids.indexOf(cId);
                const nIndex: number = ids.indexOf(nId);
                // return false for invalid taskID
                if (cIndex === -1 || nIndex > -1) {
                    return;
                }
                const thisRecord: IGanttData = this.parent.flatData[cIndex as number];
                thisRecord.ganttProperties.taskId = thisRecord.ganttProperties.rowUniqueID = nId;
                thisRecord.taskData[this.parent.taskFields.id] = nId;
                thisRecord[this.parent.taskFields.id] = nId;
                ids[cIndex as number] = nId;
                if (thisRecord.hasChildRecords && this.parent.taskFields.parentID) {
                    const childRecords: IGanttData[] = thisRecord.childRecords;
                    for (let count: number = 0; count < childRecords.length; count++) {
                        const childRecord: IGanttData = childRecords[count as number];
                        childRecord[this.parent.taskFields.parentID] = newId;
                        this.parent.chartRowsModule.refreshRecords([childRecord]);
                    }
                }
                if (this.parent.taskFields.dependency && !isNullOrUndefined(thisRecord.ganttProperties.predecessor)) {
                    const predecessors: IPredecessor[] = thisRecord.ganttProperties.predecessor;
                    let currentGanttRecord: IGanttData;
                    for (let i: number = 0; i < predecessors.length; i++) {
                        const predecessor: IPredecessor = predecessors[i as number];
                        if (predecessor.to === cId) {
                            currentGanttRecord = this.parent.flatData[ids.indexOf(predecessor.from)];
                        } else if (predecessor.from === cId) {
                            currentGanttRecord = this.parent.flatData[ids.indexOf(predecessor.to)];
                        }
                        this.updatePredecessorOnUpdateId(currentGanttRecord, cId, nId);
                    }
                }
                this.parent.treeGrid.parentData = [];
                this.parent.treeGrid.refresh();
            }
        }
    }
    private updatePredecessorOnUpdateId(currentGanttRecord: IGanttData, cId: string, nId: string): void {
        if (this.parent.flatData.indexOf(currentGanttRecord) > -1) {
            const pred: IPredecessor[] = currentGanttRecord.ganttProperties.predecessor;
            for (let j: number = 0; j < pred.length; j++) {
                const pre: IPredecessor = pred[j as number];
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
        const childRecords: IGanttData[] = record.childRecords;
        for (let c: number = 0; c < childRecords.length; c++) {
            const childRecord: IGanttData = childRecords[c as number];
            if (this.deletedTaskDetails.indexOf(childRecord) !== -1) {
                continue;
            }
            const predecessor: IPredecessor[] = childRecord.ganttProperties.predecessor;
            let canDeletePredecessor: boolean = true;
            const parentTask: IGanttData = this.parent.getParentTask(childRecord.parentItem);
            if (this.parent.viewType === 'ResourceView' && parentTask && parentTask.ganttProperties.taskName !==
                this.parent.localeObj.getConstant('unassignedTask')) {
                canDeletePredecessor = false;
            }
            if (predecessor && predecessor.length && canDeletePredecessor) {
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
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json;
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
            if (record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i as number]).toString()) !== -1) {
                if (dataCollection[i as number][this.parent.taskFields.child]) {
                    const childRecords: ITaskData[] = dataCollection[i as number][this.parent.taskFields.child];
                    this.removeData(childRecords, record);
                }
                record.splice(record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i as number]).toString()), 1);
                dataCollection.splice(i, 1);
                if (record.length === 0) {
                    this.isBreakLoop = true;
                    break;
                }
            } else if (dataCollection[i as number][this.parent.taskFields.child]) {
                const childRecords: ITaskData[] = dataCollection[i as number][this.parent.taskFields.child];
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
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection, null, null, this.parent);
        this.parent.trigger('actionBegin', eventArgs, (eventArg: IActionBeginEventArgs) => {
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer" ) {
                this.parent.showMaskRow();
            } else {
                this.parent.showSpinner();
            }
            if (eventArg.cancel) {
                const deleteRecords: IGanttData[] = this.deletedTaskDetails;
                for (let d: number = 0; d < deleteRecords.length; d++) {
                    deleteRecords[d as number].isDelete = false;
                }
                this.deletedTaskDetails = [];
                this.reUpdatePreviousRecords();
                this.parent.initiateEditAction(false);
                this.parent.hideSpinner();
            } else {
                if (isRemoteData(this.parent.dataSource)) {
                    const data: DataManager = this.parent.dataSource as DataManager;
                    if (this.parent.timezone) {
                        (eventArg.modifiedRecords as IGanttData[]).forEach((modifiedRecord: IGanttData) => {
                            updateDates(modifiedRecord, this.parent);
                        });
                    }
                    const updatedData: object = {
                        deletedRecords: getTaskData(eventArg.data as IGanttData[], null, null, this.parent), // to check
                        changedRecords: eventArg.modifiedTaskData
                    };
                    const adaptor: AdaptorOptions = data.adaptor;
                    const query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                    if (!(adaptor instanceof WebApiAdaptor && adaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                        const crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                        crud.then(() => this.deleteSuccess(args))
                            .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                    } else {
                        const deletedRecords: string = 'deletedRecords';
                        let deleteCrud: Promise<Object> = null;
                        for (let i: number = 0; i < updatedData[deletedRecords as string].length; i++) {
                            deleteCrud = data.remove(this.parent.taskFields.id, updatedData[deletedRecords as string][i as number],
                                                     null, query) as Promise<Object>;
                        }
                        deleteCrud.then(() => {
                            const changedRecords: string = 'changedRecords';
                            const updateCrud: Promise<Object> =
                                data.update(this.parent.taskFields.id, updatedData[changedRecords as string], null, query) as Promise<Object>;
                            updateCrud.then(() => this.deleteSuccess(args))
                                .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                        }).catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                    }
                } else {
                    this.deleteSuccess(args);
                }
            }
        });
    }

    private deleteSuccess(args: ITaskDeletedEventArgs): void {
        const flatData: IGanttData[] = this.parent.flatData;
        const currentData: IGanttData[] = this.parent.currentViewData;
        const deletedRecords: IGanttData[] = [];
        for (let i: number = 0; i < args.deletedRecordCollection.length; i++) {
            if (this.parent.viewType === 'ProjectView') {
                deletedRecords.push(this.parent.getRecordByID(args.deletedRecordCollection[i as number].ganttProperties.taskId));
            }
            else {
                let id: string;
                if (args.deletedRecordCollection[i as number].hasChildRecords) {
                    id = 'R' + args.deletedRecordCollection[i as number].ganttProperties.taskId;
                }
                else {
                    id = 'T' + args.deletedRecordCollection[i as number].ganttProperties.taskId;
                }
                if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
                    deletedRecords.push(this.parent.getTaskByUniqueID(args.deletedRecordCollection[i as number].uniqueID));
                }
                else {
                    deletedRecords.push(this.parent.flatData[this.parent.taskIds.indexOf(id.toString())]);
                }
            }
        }
        const deleteRecordIDs: string[] = [];
        if (deletedRecords.length > 0) {
            this.parent.selectedRowIndex = deletedRecords[deletedRecords.length - 1].index;
        }
        for (let i: number = 0; i < deletedRecords.length; i++) {
            const deleteRecord: IGanttData = deletedRecords[i as number];
            let currentIndex: number;
            let flatIndex: number;
            if (this.parent.viewType === 'ResourceView') {
                if (deleteRecord.hasChildRecords) {
                    currentIndex = this.parent.taskIds.indexOf('R' + deleteRecord.ganttProperties.taskId.toString());
                    flatIndex = this.parent.taskIds.indexOf('R' + deleteRecord.ganttProperties.taskId.toString());
                }
                else {
                    currentIndex = this.parent.taskIds.indexOf('T' + deleteRecord.ganttProperties.taskId.toString());
                    flatIndex = this.parent.taskIds.indexOf('T' + deleteRecord.ganttProperties.taskId.toString());
                }
            }
            else {
                currentIndex = currentData.indexOf(deleteRecord);
                flatIndex = flatData.indexOf(deleteRecord);
            }
            const treeGridParentIndex: number = this.parent.treeGrid.parentData.indexOf(deleteRecord);
            const tempData: ITaskData[] = getValue('dataOperation.dataArray', this.parent);
            const dataIndex: number = tempData.indexOf(deleteRecord.taskData);
            let childIndex: number;
            if (currentIndex !== -1) { currentData.splice(currentIndex, 1); }
            if (flatIndex !== -1) { flatData.splice(flatIndex, 1); }
            if (dataIndex !== -1) { tempData.splice(dataIndex, 1); }
            if (!isNullOrUndefined(deleteRecord)) {
                deleteRecordIDs.push(deleteRecord.ganttProperties.taskId.toString());
                if (flatIndex !== -1) {
                    this.parent.ids.splice(flatIndex, 1);
                    if (this.parent.viewType === 'ResourceView') {
                        this.parent.getTaskIds().splice(flatIndex, 1);
                        if (!deleteRecord.hasChildRecords) {
                            deleteRecord.ganttProperties.resourceInfo = null;
                            delete deleteRecord.ganttProperties.resourceNames;
                            deleteRecord[this.parent.taskFields.resourceInfo] = null;
                            deleteRecord.ganttProperties.sharedTaskUniqueIds = [];
                            delete deleteRecord.taskData[this.parent.taskFields.resourceInfo];
                        }
                    }
                }
                if (deleteRecord.level === 0 && treeGridParentIndex !== -1) {
                    this.parent.treeGrid.parentData.splice(treeGridParentIndex, 1);
                }
                if (deleteRecord.parentItem) {
                    const parentItem: IGanttData = this.parent.getParentTask(deleteRecord.parentItem);
                    if (parentItem) {
                        const childRecords: IGanttData[] = parentItem.childRecords;
                        childIndex = childRecords.indexOf(deleteRecord);
                        if (childIndex !== -1) { childRecords.splice(childIndex, 1); }
                        if (!childRecords.length) {
                            this.parent.setRecordValue('hasChildRecords', false, parentItem);
                        }
                    }
                }
                this.updateTreeGridUniqueID(deleteRecord, 'delete');
            }
        }
        if (deleteRecordIDs.length > 0) {
            this.removeFromDataSource(deleteRecordIDs);
        }
        const eventArgs: IActionBeginEventArgs = {};
        this.parent.updatedConnectorLineCollection = [];
        this.parent.connectorLineIds = [];
        this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        this.parent.treeGrid.parentData = [];
        this.parent.treeGrid.refresh();
        if (this.parent.enableImmutableMode) {
            this.refreshRecordInImmutableMode();
        }
        // Trigger actioncomplete event for delete action
        eventArgs.requestType = 'delete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection, null, null, this.parent);
        setValue('action', args.action, eventArgs);
        this.parent.isOnDelete = false;
        if (this.parent.viewType === 'ResourceView' && (!this.parent.undoRedoModule || (this.parent.undoRedoModule && (!this.parent.undoRedoModule['isUndoRedoPerformed'] || (this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['currentAction']['action'] == 'Delete'))))) {
            const updateUnAssignedResources: IGanttData[] = eventArgs.data.filter((data: IGanttData) => {
                return !data.hasChildRecords;
            })
            for (let i: number = 0; i < updateUnAssignedResources.length; i++) {
                let unassignedTask: IGanttData = this.parent.flatData.filter((data: IGanttData) => {
                    return data.ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask');
                })[0];
                let isDuplicate: IGanttData[] = [];
                if (unassignedTask) {
                    isDuplicate = unassignedTask.childRecords.filter((data: IGanttData) => {
                        return data.ganttProperties.taskId === updateUnAssignedResources[i as number].ganttProperties.taskId;
                    });
                }
                const parentTask = this.parent.getParentTask(updateUnAssignedResources[i as number].parentItem);
                if (parentTask && parentTask.ganttProperties.taskName !==
                    this.parent.localeObj.getConstant('unassignedTask') && isDuplicate.length === 0) {
                    this.checkWithUnassignedTask(updateUnAssignedResources[i as number]);
                }
                else if (!parentTask && (!isDuplicate || isDuplicate.length === 0)) {
                    this.checkWithUnassignedTask(updateUnAssignedResources[i as number]);
                }
                unassignedTask = this.parent.flatData.filter((data: IGanttData) => {
                    return data.ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask');
                })[0];
                let parentItem: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                    if (data.ganttProperties.taskId == updateUnAssignedResources[i as number].ganttProperties.taskId && (!data.hasChildRecords && data.parentItem)
                        && unassignedTask.uniqueID === data.parentItem.uniqueID) {
                        return data;
                    }
                    else {
                        return null
                    }
                });
                if (parentItem[0]) {
                    this.parent.dataOperation.updateParentItems(parentItem[0]);
                }
            }
        }
        this.parent.trigger('actionComplete', eventArgs);
        this.deletedTaskDetails = [];
        this.parent.initiateEditAction(false);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
            this.parent.hideMaskRow();
        } else {
            this.parent.hideSpinner();
        }
    }

    /**
     *
     * @returns {number | string} .
     * @private
     */
    public getNewTaskId(): number | string {
        const ids: string[] = this.parent.viewType === 'ResourceView' ? this.parent.getTaskIds() : this.parent.ids;
        const maxId: number = ids.length
        let newTaskId: number | string = maxId + 1;
        if (this.parent.viewType === 'ResourceView') {
            if (ids.indexOf('T' + newTaskId) !== -1 || ids.indexOf('R' + newTaskId) !== -1) {
                newTaskId = newTaskId + 1;
                if (ids.indexOf('T' + newTaskId) !== -1 || ids.indexOf('R' + newTaskId) !== -1) {
                    do {
                        newTaskId = newTaskId + 1;
                    } while (ids.indexOf('T' + newTaskId) !== -1 || ids.indexOf('R' + newTaskId) !== -1);
                }
            }
        } else {
            if (ids.indexOf(newTaskId.toString()) != -1) {
                newTaskId = newTaskId + 1;
                if (ids.indexOf(newTaskId.toString()) != -1) {
                    do {
                        newTaskId = newTaskId + 1;
                    } while (ids.indexOf(newTaskId.toString()) != -1);
                }
            }
        }
        if (this.parent.columnByField[this.parent.taskFields.id].editType === "stringedit") {
            return newTaskId = newTaskId.toString();
        } else {
            return newTaskId;
        }
    }

    /**
     * @param {object} obj .
     * @param {RowPosition} rowPosition .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private prepareNewlyAddedData(obj: Object, rowPosition: RowPosition): void {
        const taskModel: TaskFieldsModel = this.parent.taskFields;
        let id: string | number;
        let newTaskIDmd: string | number;
        const ids: string[] = this.parent.ids;
        /*Validate Task Id of data*/
        if (obj[taskModel.id]) {
            if (ids.indexOf(obj[taskModel.id].toString()) !== -1) {
                obj[taskModel.id] = null;
            } else {
                if (typeof(obj[taskModel.id]) === "string") {
                    newTaskIDmd = obj[taskModel.id]
                } else {
                    newTaskIDmd = parseInt(obj[taskModel.id], 10)
                }
                obj[taskModel.id] = isNullOrUndefined(newTaskIDmd) ? null : newTaskIDmd;
            }
        }
        if (!obj[taskModel.id]) {
            id = this.getNewTaskId();
            obj[taskModel.id] = id;
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
                const startDate: Date = this.parent.dataOperation.getDateFromFormat(this.parent.projectStartDate);
                startDate.setDate(startDate.getDate() + 4);
                obj[taskModel.endDate] = this.parent.getFormatedDate(startDate, this.parent.getDateFormat());
            }
        }
    }

    /**
     * @param {object} obj .
     * @param {number} level .
     * @param {RowPosition} rowPosition .
     * @param {IGanttData} parentItem .
     * @returns {IGanttData} .
     * @private
     */
    private updateNewlyAddedDataBeforeAjax(
        obj: Object, level: number, rowPosition: RowPosition, parentItem?: IGanttData): IGanttData {
        const cAddedRecord: IGanttData = this.parent.dataOperation.createRecord(obj, level);
        cAddedRecord.index = parseInt(cAddedRecord.ganttProperties.rowUniqueID.toString(), 10) - 1;
        if (!isNullOrUndefined(parentItem)) {
            this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), cAddedRecord);
            const pIndex: number = cAddedRecord.parentItem ? cAddedRecord.parentItem.index : null;
            this.parent.setRecordValue('parentIndex', pIndex, cAddedRecord);
            const parentUniqId: string = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
            this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
            if (!isNullOrUndefined(this.parent.taskFields.id) &&
                !isNullOrUndefined(this.parent.taskFields.parentID) && cAddedRecord.parentItem) {
                if (this.parent.viewType === 'ProjectView') {
                    this.parent.setRecordValue(
                        this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord.taskData, true);
                }
                this.parent.setRecordValue('parentId', cAddedRecord.parentItem.taskId, cAddedRecord.ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord, true);
            }
        }
        this.parent.isOnEdit = true;
        if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
            if (obj['hasChildRecords']) {
                let totalRecords: IGanttData[] = [];
                let currentAction: Object[] = this.parent.undoRedoModule['currentAction']['deletedRecordsDetails'];
                for (let i: number = 0; i < obj['childRecords'].length; i++) {
                    this.add(obj['childRecords'][i as number], totalRecords);
                }
                for (let j: number = 0; j < currentAction.length; j++) {
                    if (obj['ganttProperties'].taskId == currentAction[j as number]['data'].ganttProperties.taskId) {
                        if (currentAction[j as number]['position'] == 'child') {
                            rowPosition = 'Child';
                        }
                        else if (currentAction[j as number]['position'] == 'below') {
                            rowPosition = 'Below';
                        }
                        else if (currentAction[j as number]['position'] == 'above') {
                            rowPosition = 'Above';
                        }
                        this.backUpAndPushNewlyAddedRecord(cAddedRecord, rowPosition, parentItem);
                        for (let i: number = 0; i < totalRecords.length; i++) {
                            if (this.parent.viewType == 'ProjectView') {
                                if (totalRecords[i as number].parentItem.taskId == cAddedRecord.ganttProperties.taskId) {
                                    totalRecords[i as number].parentItem.index = cAddedRecord.index;
                                    totalRecords[i as number].parentItem.taskId = cAddedRecord.ganttProperties.taskId;
                                    totalRecords[i as number].parentItem.uniqueID = cAddedRecord.ganttProperties.uniqueID;
                                    totalRecords[i as number].parentUniqueID = cAddedRecord.ganttProperties.uniqueID;
                                }
                            }
                            else {
                                totalRecords[i as number].parentItem.index = cAddedRecord.index;
                                totalRecords[i as number].parentItem.taskId = cAddedRecord.ganttProperties.rowUniqueID;
                                totalRecords[i as number].parentItem.uniqueID = cAddedRecord.ganttProperties.uniqueID;
                                totalRecords[i as number].parentUniqueID = cAddedRecord.ganttProperties.uniqueID;
                            }

                        }
                        break;
                    }
                }
                this.addRowSelectedItem = cAddedRecord;
                cAddedRecord.taskData[this.parent.taskFields.child] = [];
                for (let k: number = 0; k < totalRecords.length; k++) {
                    this.parent.isOnEdit = false;
                    let newRecord: IGanttData = this.parent.dataOperation.createRecord(totalRecords[k as number], totalRecords[k as number].level);
                    if (newRecord.childRecords.length == 0 && newRecord.taskData[this.parent.taskFields.child]) {
                        newRecord.taskData[this.parent.taskFields.child] = [];
                    }
                    parentItem = this.parent.getRecordByID(totalRecords[k as number].parentItem.taskId);
                    if (!isNullOrUndefined(parentItem)) {
                        this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), newRecord);
                        const pIndex: number = newRecord.parentItem ? newRecord.parentItem.index : null;
                        this.parent.setRecordValue('parentIndex', pIndex, newRecord);
                        const parentUniqId: string = newRecord.parentItem ? newRecord.parentItem.uniqueID : null;
                        this.parent.setRecordValue('parentUniqueID', parentUniqId, newRecord);
                        if (!isNullOrUndefined(this.parent.taskFields.id) &&
                            !isNullOrUndefined(this.parent.taskFields.parentID) && newRecord.parentItem) {
                            if (this.parent.viewType === 'ProjectView') {
                                this.parent.setRecordValue(
                                    this.parent.taskFields.parentID, newRecord.parentItem.taskId, newRecord.taskData, true);
                            }
                            this.parent.setRecordValue('parentId', newRecord.parentItem.taskId, newRecord.ganttProperties, true);
                            this.parent.setRecordValue(this.parent.taskFields.parentID, newRecord.parentItem.taskId, newRecord, true);
                        }
                    }
                    this.parent.isOnEdit = true;
                    if (newRecord.parentItem) {
                        if (parentItem.childRecords.length == 0) {
                            rowPosition = 'Child';
                        }
                        else {
                            rowPosition = 'Below';
                        }
                    }
                    if (this.parent.getParentTask(newRecord.parentItem).childRecords.length > 0) {
                        this.addRowSelectedItem = this.parent.getParentTask(newRecord.parentItem).childRecords[this.parent.getParentTask(newRecord.parentItem).childRecords.length - 1];
                    }
                    this.backUpAndPushNewlyAddedRecord(newRecord, rowPosition, parentItem);
                    for (let i: number = 0; i < totalRecords.length; i++) {
                        if (this.parent.viewType == 'ProjectView') {
                            if (totalRecords[i as number].parentItem.taskId == newRecord.ganttProperties.taskId) {
                                totalRecords[i as number].parentItem.index = newRecord.index;
                                totalRecords[i as number].parentItem.taskId = newRecord.ganttProperties.taskId;
                                totalRecords[i as number].parentItem.uniqueID = newRecord.ganttProperties.uniqueID;
                                totalRecords[i as number].parentUniqueID = newRecord.ganttProperties.uniqueID;
                            }
                        }
                        else {
                            totalRecords[i as number].parentItem.index = cAddedRecord.index;
                            totalRecords[i as number].parentItem.taskId = cAddedRecord.ganttProperties.rowUniqueID;
                            totalRecords[i as number].parentItem.uniqueID = cAddedRecord.ganttProperties.uniqueID;
                            totalRecords[i as number].parentUniqueID = cAddedRecord.ganttProperties.uniqueID;
                        }

                    }
                }
            }
            else {
                this.backUpAndPushNewlyAddedRecord(cAddedRecord, rowPosition, parentItem);
            }
        }
        else {
            this.backUpAndPushNewlyAddedRecord(cAddedRecord, rowPosition, parentItem);
        }
        // need to push in dataSource also.
        if (this.parent.taskFields.dependency && cAddedRecord.ganttProperties.predecessorsName) {
            if (!this.parent.undoRedoModule || !this.parent.undoRedoModule['isUndoRedoPerformed']) {
                this.parent.predecessorModule.ensurePredecessorCollectionHelper(cAddedRecord, cAddedRecord.ganttProperties);
            } 
            this.parent.predecessorModule.updatePredecessorHelper(cAddedRecord);
            this.parent.predecessorModule.validatePredecessorDates(cAddedRecord);
        }
        if (cAddedRecord.parentItem && this.parent.getParentTask(cAddedRecord.parentItem).ganttProperties.isAutoSchedule) {
            this.parent.dataOperation.updateParentItems(cAddedRecord.parentItem);
        }
        this.parent.isOnEdit = false;
        return cAddedRecord;
    }

    /**
     * @param {IGanttData} record .
     * @param {number} count .
     * @returns {number} .
     * @private
     */
    public getChildCount(record: IGanttData, count: number): number {
        let currentRecord: IGanttData;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i as number];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }

    /**
     * @param {IGanttData} data .
     * @param {number} count .
     * @param {IGanttData[]} collection .
     * @returns {number} .
     * @private
     */
    private getVisibleChildRecordCount(data: IGanttData, count: number, collection: IGanttData[]): number {
        let childRecords: IGanttData[];
        let length: number;
        if (data.hasChildRecords) {
            childRecords = data.childRecords;
            length = childRecords.length;
            for (let i: number = 0; i < length; i++) {
                if (collection.indexOf(childRecords[i as number]) !== -1) {
                    count++;
                }
                if (childRecords[i as number].hasChildRecords) {
                    count = this.getVisibleChildRecordCount(childRecords[i as number], count, collection);
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
     * @param {IGanttData} parentRecord .
     * @returns {void} .
     * @private
     */
    public updatePredecessorOnIndentOutdent(parentRecord: IGanttData): void {
        const len: number = parentRecord.ganttProperties.predecessor.length;
        const parentRecordTaskData: ITaskData = parentRecord.ganttProperties;
        const predecessorCollection: IPredecessor[] = parentRecordTaskData.predecessor;
        let childRecord: IGanttData;
        let predecessorIndex: number;
        const updatedPredecessor: IPredecessor[] = [];
        let validPredecessor : boolean;
        for (let count: number = 0; count < len; count++) {
            const fromRecord: IGanttData = this.parent.getRecordByID(predecessorCollection[count as number].from);
            const toRecord: IGanttData = this.parent.getRecordByID(predecessorCollection[count as number].to)
            validPredecessor = this.parent.connectorLineEditModule.validateParentPredecessor(fromRecord, toRecord);
            if (!validPredecessor || !this.parent.allowParentDependency) {
                if (predecessorCollection[count as number].to === parentRecordTaskData.rowUniqueID.toString()) {
                    childRecord = this.parent.getRecordByID(predecessorCollection[count as number].from);
                    predecessorIndex = getIndex(predecessorCollection[count as number], 'from', childRecord.ganttProperties.predecessor, 'to');
                    // eslint-disable-next-line
                    let predecessorCollections: IPredecessor[] = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                    predecessorCollections.splice(predecessorIndex, 1);
                    this.parent.setRecordValue('predecessor', predecessorCollections, childRecord.ganttProperties, true);
                } else if (predecessorCollection[count as number].from === parentRecordTaskData.rowUniqueID.toString()) {
                    childRecord = this.parent.getRecordByID(predecessorCollection[count as number].to);
                    const prdcList: string[] = (childRecord.ganttProperties.predecessorsName.toString()).split(',');
                    const str: string = predecessorCollection[count as number].from + predecessorCollection[count as number].type;
                    const ind: number = prdcList.indexOf(str);
                    prdcList.splice(ind, 1);
                    this.parent.setRecordValue('predecessorsName', prdcList.join(','), childRecord.ganttProperties, true);
                    this.parent.setRecordValue(this.parent.taskFields.dependency, prdcList.join(','), childRecord);
                    predecessorIndex = getIndex(predecessorCollection[count as number], 'from', childRecord.ganttProperties.predecessor, 'to');
                    // eslint-disable-next-line
                    const temppredecessorCollection: IPredecessor[] = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                    temppredecessorCollection.splice(predecessorIndex, 1);
                    this.parent.setRecordValue('predecessor', temppredecessorCollection, childRecord.ganttProperties, true);
                    this.parent.predecessorModule.validatePredecessorDates(childRecord);
                }
            }
        }
        if (!validPredecessor || !this.parent.allowParentDependency) {
            this.parent.setRecordValue('predecessor', updatedPredecessor, parentRecord.ganttProperties, true);
            this.parent.setRecordValue('predecessorsName', '', parentRecord.ganttProperties, true);
        }
    }

    /**
     * @param {IPredecessor[]} predecessorCollection .
     * @param {IGanttData} record .
     * @returns {string} .
     * @private
     */
    private predecessorToString(predecessorCollection: IPredecessor[], record: IGanttData): string {
        const predecessorString: string[] = [];
        let count: number = 0;
        const length: number = predecessorCollection.length;
        for (count; count < length; count++) {
            if (record.ganttProperties.rowUniqueID.toString() !== predecessorCollection[count as number].from) {
                let tem: string = predecessorCollection[count as number].from + predecessorCollection[count as number].type;
                predecessorCollection[count as number].offset =
                    isNaN(predecessorCollection[count as number].offset) ? 0 : predecessorCollection[count as number].offset;
                if (predecessorCollection[count as number].offset !== 0) {
                    if (predecessorCollection[count as number].offset < 0) {
                        tem += predecessorCollection[count as number].offset.toString() + 'd';
                    } else if (predecessorCollection[count as number].offset > 0) {
                        tem += '+' + predecessorCollection[count as number].offset.toString() + 'd';
                    }
                }
                predecessorString.push(tem);
            }
        }
        return predecessorString.join(',');
    }

    /**
     * @param {IGanttData} record .
     * @param {RowPosition} rowPosition .
     * @param {IGanttData} parentItem .
     * @returns {void} .
     * @private
     */
    private backUpAndPushNewlyAddedRecord(
        record: IGanttData, rowPosition: RowPosition, parentItem?: IGanttData): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        const ids: string[] = this.parent.ids;
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
                const taskId: string = record.level === 0 ? 'R' + record.ganttProperties.taskId : 'T' + record.ganttProperties.taskId;
                this.parent.getTaskIds().push(taskId);
            }
            break;
        case 'Above':
            /*Record Updates*/
            recordIndex = flatRecords.indexOf(this.addRowSelectedItem);
            updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem);
            this.recordCollectionUpdate(childIndex, recordIndex, updatedCollectionIndex, record, parentItem, rowPosition);
            break;
        case 'Below':
            currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
            if (this.addRowSelectedItem.hasChildRecords) {
                const dataChildCount: number = this.getChildCount(this.addRowSelectedItem, 0);
                recordIndex = currentItemIndex + dataChildCount + 1;
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
            } else {
                recordIndex = currentItemIndex + 1;
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
            }
            this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem, rowPosition);
            break;
        case 'Child':
            currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
            if (this.addRowSelectedItem.hasChildRecords) {
                const dataChildCount: number = this.getChildCount(this.addRowSelectedItem, 0);
                recordIndex = currentItemIndex + dataChildCount + 1;
                //Expand Add record's parent item for project view
                if (!this.addRowSelectedItem.expanded && !this.parent.enableMultiTaskbar) {
                    this.parent.expandByID(this.addRowSelectedItem.ganttProperties.rowUniqueID);
                }
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
            } else {
                this.parent.setRecordValue('hasChildRecords', true, this.addRowSelectedItem);
                this.parent.setRecordValue('isMilestone', false, this.addRowSelectedItem.ganttProperties, true);
                this.parent.setRecordValue('expanded', true, this.addRowSelectedItem);
                this.parent.setRecordValue('childRecords', [], this.addRowSelectedItem);
                recordIndex = currentItemIndex + 1;
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
                if (this.addRowSelectedItem.ganttProperties.predecessor) {
                    this.updatePredecessorOnIndentOutdent(this.addRowSelectedItem);
                }
                if (!isNullOrUndefined(this.addRowSelectedItem.ganttProperties.segments)) {
                    this.addRowSelectedItem.ganttProperties.segments = null;
                }
            }
            this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem, rowPosition);
            break;
        }
        this.newlyAddedRecordBackup = record;
    }

    /**
     * @param {number} childIndex .
     * @param {number} recordIndex .
     * @param {number} updatedCollectionIndex .
     * @param {IGanttData} record .
     * @param {IGanttData} parentItem .
     * @returns {void} .
     * @private
     */
    private recordCollectionUpdate(
        childIndex: number, recordIndex: number, updatedCollectionIndex: number, record: IGanttData, parentItem: IGanttData, rowPosition: RowPosition): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        const ids: string[] = this.parent.ids;
        /* Record collection update */
        flatRecords.splice(recordIndex, 0, record);
        currentViewData.splice(updatedCollectionIndex, 0, record);
        if (this.parent.viewType === 'ResourceView' && typeof(record.ganttProperties.taskId) === "number" && (!this.parent.undoRedoModule || !this.parent.undoRedoModule['isUndoRedoPerformed'])) {
            let taskString: number = record.ganttProperties.taskId;
            ids.push(taskString.toString());
        }
        ids.splice(recordIndex, 0, record.ganttProperties.rowUniqueID.toString());
        if (this.parent.viewType === 'ResourceView') {
            const taskId: string = record.level === 0 ? 'R' + record.ganttProperties.taskId : 'T' + record.ganttProperties.taskId;
            this.parent.getTaskIds().splice(recordIndex, 0, taskId);
        }
        /* data Source update */
        if (!isNullOrUndefined(parentItem)) {
            if (rowPosition == 'Above') {
                childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem);
            } else if(rowPosition == 'Below') {
                childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem) + 1;
            } else {
                childIndex = parentItem.childRecords.length;
            }
            /*Child collection update*/
            parentItem.childRecords.splice(childIndex, 0, record);
            if (!this.parent.taskFields.child) {
                this.parent.taskFields.child = 'Children';
            }
            if ((this.parent.dataSource instanceof DataManager &&
                isNullOrUndefined(parentItem.taskData[this.parent.taskFields.parentID])) ||
                 !isNullOrUndefined(this.parent.dataSource)) {
                const child: string = this.parent.taskFields.child;
                if (parentItem.taskData[child as string] && parentItem.taskData[child as string].length > 0) {
                    if (rowPosition === 'Above' || rowPosition === 'Below') {
                        parentItem.taskData[child as string].splice(childIndex, 0, record.taskData);
                    }
                    else {
                        parentItem.taskData[child as string].push(record.taskData);
                    }
                } else {
                    parentItem.taskData[child as string] = [];
                    parentItem.taskData[child as string].push(record.taskData);
                }
                this.isNewRecordAdded = true;
            }
        }
    }

    /**
     * @param {IGanttData} cAddedRecord .
     * @param {IGanttData} modifiedRecords .
     * @param {string} event .
     * @returns {ITaskAddedEventArgs} .
     * @private
     */
    private constructTaskAddedEventArgs(
        cAddedRecord: IGanttData[], modifiedRecords: IGanttData[], event: string): ITaskAddedEventArgs {
        const eventArgs: ITaskAddedEventArgs = {};
        eventArgs.action = eventArgs.requestType = event;
        if (cAddedRecord.length > 1) {
            eventArgs.data = [];
            eventArgs.newTaskData = [];
            eventArgs.recordIndex = [];
            for (let i: number = 0; i < cAddedRecord.length; i++) {
                (eventArgs.data[i as number] as IGanttData[]) = (cAddedRecord[i as number] as IGanttData[]);
                (eventArgs.newTaskData[i as number]) = (getTaskData([cAddedRecord[i as number]], eventArgs.data[i as number] as boolean,
                                                        eventArgs, this.parent));
                eventArgs.recordIndex[i as number] = cAddedRecord[i as number].index;
            }
        }
        else if (cAddedRecord.length === 1) {
            for (let i: number = 0; i < cAddedRecord.length; i++) {
                (eventArgs.data) = (cAddedRecord[i as number]);
                (eventArgs.newTaskData) = (getTaskData([cAddedRecord[i as number]], eventArgs.data as boolean, eventArgs, this.parent));
                eventArgs.recordIndex = cAddedRecord[i as number].index;
            }
        }

        eventArgs.modifiedRecords = modifiedRecords;
        eventArgs.modifiedTaskData = getTaskData(modifiedRecords, null, null, this.parent);
        return eventArgs;
    }

    /**
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private addSuccess(args: ITaskAddedEventArgs): void {
        // let addedRecords: IGanttData = args.addedRecord;
        // let eventArgs: IActionBeginEventArgs = {};
        this.parent.updatedConnectorLineCollection = [];
        this.parent.connectorLineIds = [];
        this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        this.parent.treeGrid.parentData = [];
        this.parent.addDeleteRecord = true;
        this.parent.selectedRowIndex = 0;
        this.parent.treeGrid['isAddedFromGantt'] = true;
        this.parent.treeGrid.refresh();
        if (this.parent.enableImmutableMode) {
            this.parent.modifiedRecords = args.modifiedRecords;
            this.parent.modifiedRecords.push(args.data as IGanttData);
            this.refreshRecordInImmutableMode();
        }
    }

    private refreshRecordInImmutableMode(data? : object, dragged? : boolean): void {
        if (!dragged && !isNullOrUndefined(data)) {
            for (let i: number = data[0].index + 1; i < this.parent.currentViewData.length; i++) {
                if (data[0].level < this.parent.currentViewData[i as number].level) {
                   this.parent.modifiedRecords.push(this.parent.currentViewData[i as number]);
                } else {
                    break;
                }
            }
        }
        for (let i: number = 0; i < this.parent.modifiedRecords.length; i++) {
            const originalData: IGanttData = this.parent.modifiedRecords[i as number];
            let treeIndex: number = this.parent.rowDragAndDropModule && this.parent.allowRowDragAndDrop ? 1 : 0;
            const uniqueTaskID: string = this.parent.taskFields.id;
            let originalIndex: number = this.parent.currentViewData.findIndex((data: IGanttData) => {
                return (data[uniqueTaskID as string] === originalData[uniqueTaskID as string]);
            });
            if (this.parent.treeGrid.getRows()[originalIndex as number]) {
                const row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                    this.parent.treeGrid.grid.getDataRows()[originalIndex as number].getAttribute('data-uid'));
                this.parent.treeGrid.renderModule.cellRender({
                    data: row.data, cell: this.parent.treeGrid.getRows()[originalIndex as number].cells[this.parent.treeColumnIndex + treeIndex],
                    column: this.parent.treeGrid.grid.getColumns()[this.parent.treeColumnIndex],
                    requestType: 'rowDragAndDrop'
                });
                this.parent.treeGrid.renderModule.RowModifier({
                    data: originalData, row: this.parent.treeGrid.getRows()[originalIndex as number], rowHeight: this.parent.rowHeight
                });
            }
        }
    }
    /**
     * @param {IGanttData} addedRecord .
     * @param {RowPosition} rowPosition .
     * @returns {void} .
     * @private
     */
    public updateRealDataSource(addedRecord: IGanttData | IGanttData[], rowPosition: RowPosition): void {
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        let dataSource: Object[] = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
            this.parent.dataSource as Object[];
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        for (let i: number = 0; i < (addedRecord as IGanttData[]).length; i++) {
            if (isNullOrUndefined(rowPosition) || isNullOrUndefined(this.addRowSelectedItem)) {
                rowPosition = rowPosition === 'Bottom' ? 'Bottom' : 'Top';
            }
            if (rowPosition === 'Top') {
                dataSource.splice(0, 0, addedRecord[i as number].taskData);
            } else if (rowPosition === 'Bottom') {
                dataSource.push(addedRecord[i as number].taskData);
            } else {
                if (!isNullOrUndefined(taskFields.id) && !isNullOrUndefined(taskFields.parentID)) {
                    dataSource.push(addedRecord[i as number].taskData);
                } else {
                    if (!this.isNewRecordAdded) {
                        this.addDataInRealDataSource(dataSource, addedRecord[i as number].taskData, rowPosition);
                    }
                    this.isNewRecordAdded = false;
                }
            }
            this.isBreakLoop = false;
        }
    }

    /**
     * @param {object[]} dataCollection .
     * @param {IGanttData} record .
     * @param {RowPosition} rowPosition .
     * @returns {void} .
     * @private
     */
    private addDataInRealDataSource(
        dataCollection: Object[], record: IGanttData, rowPosition?: RowPosition): boolean | void {
        for (let i: number = 0; i < dataCollection.length; i++) {
            const child: string = this.parent.taskFields.child;
            if (this.isBreakLoop) {
                break;
            }
            if (getValue(
                this.parent.taskFields.id, dataCollection[i as number]).toString() ===
                this.addRowSelectedItem.ganttProperties.rowUniqueID.toString()) {
                let index: number;
                if (this.parent.rowDragAndDropModule && this.parent.rowDragAndDropModule['droppedRecord'] && this.parent.viewType === 'ResourceView') {
                    for (let i: number = 0; i < dataCollection.length; i++) {
                        if (dataCollection[i as number][this.parent.taskFields.id] == this.parent.rowDragAndDropModule['droppedRecord'].ganttProperties.taskId) {
                            index = i;
                            break;
                        }
                    }
                }
                if (rowPosition === 'Above') {
                    if (index) {
                        dataCollection.splice(index, 0, record);
                    }
                    else {
                        dataCollection.splice(i, 0, record);
                    }
                } else if (rowPosition === 'Below') {
                    if (index) {
                        dataCollection.splice(index + 1, 0, record);
                    }
                    else {
                        dataCollection.splice(i + 1, 0, record);
                    }
                } else if (rowPosition === 'Child') {
                    if (dataCollection[i as number][child as string] && dataCollection[i as number][child as string].length > 0) {
                        dataCollection[i as number][child as string].push(record);
                    } else {
                        dataCollection[i as number][child as string] = [];
                        dataCollection[i as number][child as string].push(record);
                    }
                }
                this.isBreakLoop = true;
                break;
            } else if (dataCollection[i as number][child as string]) {
                const childRecords: ITaskData[] = dataCollection[i as number][child as string];
                this.addDataInRealDataSource(childRecords, record, rowPosition);
            }
        }
    }

    /**
     * Method to update the values to client side from server side.
     *
     * @param {Object} e - Defines the new modified data from the server.
     * @param {ITaskAddedEventArgs} args - Defines the client side data.
     * @returns {void} .
     */
    public updateClientDataFromServer(e: { addedRecords: Object[], changedRecords: Object[] }, args: ITaskAddedEventArgs): void {
        const serverReturnedValue: Object = e.addedRecords[0];
        const _aLength: number = Object.keys(serverReturnedValue).length;
        for (let j: number = 0, _a = Object.keys(serverReturnedValue); j < _aLength; j++) {
            let key: string = _a[parseInt(j.toString(), 10)];
            (args.data as IGanttData)[`${key}`] = serverReturnedValue[`${key}`];
        }
        if (this.parent.taskFields.id !== null) {
            (args.data as IGanttData).ganttProperties['taskId'] = serverReturnedValue[this.parent.taskFields.id];
        }
        if (this.parent.taskFields.name !== null) {
            (args.data as IGanttData).ganttProperties['taskName'] = serverReturnedValue[this.parent.taskFields.name];
        }
        if (this.parent.taskFields.startDate !== null) {
            (args.data as IGanttData).ganttProperties['startDate'] = serverReturnedValue[this.parent.taskFields.startDate];
        }
        if (this.parent.taskFields.endDate !== null) {
            (args.data as IGanttData).ganttProperties['endDate'] = serverReturnedValue[this.parent.taskFields.endDate];
        }
        if (this.parent.taskFields.duration !== null) {
            (args.data as IGanttData).ganttProperties['duration'] = parseFloat(serverReturnedValue[this.parent.taskFields.duration]);
        }
        if (this.parent.taskFields.durationUnit !== null) {
            (args.data as IGanttData).ganttProperties['durationUnit'] = serverReturnedValue[this.parent.taskFields.durationUnit];
        }
        if (this.parent.taskFields.progress !== null) {
            (args.data as IGanttData).ganttProperties['progress'] = serverReturnedValue[this.parent.taskFields.progress];
        }
        if (this.parent.taskFields.dependency !== null) {
            (args.data as IGanttData).ganttProperties['dependency'] = serverReturnedValue[this.parent.taskFields.dependency];
        }
        if (this.parent.taskFields.parentID !== null) {
            (args.data as IGanttData).ganttProperties['parentID'] = serverReturnedValue[this.parent.taskFields.parentID];
        }
        if (this.parent.taskFields.baselineEndDate !== null) {
            (args.data as IGanttData).ganttProperties['baselineEndDate'] = serverReturnedValue[this.parent.taskFields.baselineEndDate];
        }
        if (this.parent.taskFields.baselineStartDate !== null) {
            (args.data as IGanttData).ganttProperties['baselineStartDate'] = serverReturnedValue[this.parent.taskFields.baselineStartDate];
        }
        if (this.parent.taskFields.resourceInfo !== null) {
            (args.data as IGanttData).ganttProperties['resources'] = serverReturnedValue[this.parent.taskFields.resourceInfo];
        }
    }
    
    /**
     * Method to add new record.
     *
     * @param {Object[] | Object} data - Defines the new data to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @returns {void} .
     * @private
     */
    public addRecord(data?: Object[] | Object, rowPosition?: RowPosition, rowIndex?: number): void {
        let tempTaskID:string = this.parent.taskFields.id
        if (this.parent.editModule && this.parent.editSettings.allowAdding) {
            this.parent.isDynamicData = true;
            this.parent.isOnAdded = true;
            let cAddedRecord: IGanttData[] = [];
            if (isNullOrUndefined(data)) {
                this.validateTaskPosition(data, rowPosition, rowIndex, cAddedRecord);
            }
            else if (data instanceof Array) {
                if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
                    let addData: Object[] | Object = data;
                    let addIndex: number = rowIndex;
                    if (this.parent.viewType === 'ResourceView') {
                        if (data[0]['position'] == 'below') {
                            rowPosition = 'Below';
                        }
                        else if (data[0]['position'] == 'above') {
                            rowPosition = 'Above';
                        }
                        else if (data[0]['position'] == 'child') {
                            rowPosition = 'Child';
                        }
                        addIndex = this.parent.taskIds.indexOf(data[0]['id'].toString());
                        addData = data[0]['data'];
                    }
                    this.validateTaskPosition(addData, rowPosition, addIndex, cAddedRecord);
                }
                else {
                    for (let i: number = 0; i < data.length; i++) {
                        this.validateTaskPosition(data[i as number], rowPosition, rowIndex, cAddedRecord);
                    }
                }
            }
            else if (typeof (data) == 'object') {
                this.validateTaskPosition(data, rowPosition, rowIndex, cAddedRecord);
            }
            else {
                return;
            }
            let args: ITaskAddedEventArgs = {};
            args = this.constructTaskAddedEventArgs(cAddedRecord, this.parent.editedRecords, 'beforeAdd');
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent['isUndoRedoItemPresent']('Add')) {
                if (this.parent.undoRedoModule['redoEnabled']) {
                    this.parent.undoRedoModule['disableRedo']();
                }
                this.parent.undoRedoModule['createUndoCollection']();
            }
            this.parent.trigger('actionBegin', args, (args: ITaskAddedEventArgs) => {
                this.parent.previousRecords={};
                if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer" ) {
                    this.parent.showMaskRow()
                } else {
                    this.parent.showSpinner()
                }
                const tasks: TaskFieldsModel = this.parent.taskFields;
                let ganttData: IGanttData;
                if (this.parent.viewType === 'ResourceView') {
                    if (args.data['childRecords'].length > 0) {
                        ganttData = this.parent.flatData[this.parent.getTaskIds().indexOf('R' + args.data[tasks.id])]
                    }
                    else {
                        ganttData = this.parent.flatData[this.parent.getTaskIds().indexOf('T' + args.data[tasks.id])]
                    }
                }
                else {
                    ganttData = this.parent.getRecordByID(args.data[tasks.id])
                }
                if (!isNullOrUndefined(ganttData)) {
                   this.validateUpdateValues(args.newTaskData, ganttData, true);
                   this.parent.dateValidationModule.calculateEndDate(ganttData);
                   this.parent.dataOperation.updateWidthLeft(ganttData);
                   this.parent.dataOperation.updateParentItems(ganttData);
                }
                if(!isNullOrUndefined(args.data[`${tempTaskID}`])) {
                    if(args.data[tempTaskID as string] != args.data['ganttProperties']['taskId']) {
                        for (const key of Object.keys(this.parent.ids)) {
                            if (this.parent.ids[key as string] === args.data['ganttProperties']['taskId'].toString()) {
                                this.parent.ids[key as string] = args.data[tempTaskID as string].toString();
                                break;
                            }
                        }
                        args.data['ganttProperties']['taskId'] = args.data[tempTaskID as string];
                        args.newTaskData[tempTaskID as string] = args.data[tempTaskID as string];
                        args.data['ganttProperties']['rowUniqueID'] = args.data[tempTaskID as string].toString();
                    }
                }
                if (!args.cancel) {
                    let record: Object = {};
                    if (isRemoteData(this.parent.dataSource)) {
                        const data: DataManager = this.parent.dataSource as DataManager;
                        const updatedData: object = {
                            addedRecords: [args.newTaskData], // to check
                            changedRecords: args.modifiedTaskData
                        };
                        /* tslint:disable-next-line */
                        const query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                        const adaptor: any = data.adaptor;
                        if (!(adaptor instanceof WebApiAdaptor || adaptor instanceof ODataAdaptor || adaptor instanceof ODataV4Adaptor) || data.dataSource.batchUrl) {
                            /* tslint:disable-next-line */
                            const crud: Promise<Object> =
                                data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                            crud.then((e: { addedRecords: Object[], changedRecords: Object[] }) => {
                                if (e.addedRecords[0][this.parent.taskFields.id].toString() != args.data['ganttProperties']['taskId']) {
                                    args.data['ganttProperties']['taskId'] = e.addedRecords[0][this.parent.taskFields.id].toString();
                                    args.newTaskData[tempTaskID as string] = e.addedRecords[0][this.parent.taskFields.id].toString();
                                    args.data['ganttProperties']['rowUniqueID'] = e.addedRecords[0][this.parent.taskFields.id].toString();
                                    this.parent.ids.push(e.addedRecords[0][this.parent.taskFields.id].toString());
                                }
                                const prevID: string = (args.data as IGanttData).ganttProperties.taskId.toString();
                                if (this.parent.taskFields.id && !isNullOrUndefined(e.addedRecords[0][this.parent.taskFields.id]) &&
                                    e.addedRecords[0][this.parent.taskFields.id].toString() == prevID) {
                                    this.parent.setRecordValue(
                                        'taskId', e.addedRecords[0][this.parent.taskFields.id], (args.data as IGanttData).ganttProperties, true);
                                    this.parent.setRecordValue(
                                        'taskData', e.addedRecords[0], args.data as IGanttData);
                                    this.parent.setRecordValue(
                                        this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data as IGanttData);
                                    this.parent.setRecordValue(
                                        'rowUniqueID', e.addedRecords[0][this.parent.taskFields.id].toString(),
                                        (args.data as IGanttData).ganttProperties, true);
                                    this.updateClientDataFromServer(e,args);
                                    const idsIndex: number = this.parent.ids.indexOf(prevID);
                                    if (idsIndex !== -1) {
                                        this.parent.ids[idsIndex as number] = e.addedRecords[0][this.parent.taskFields.id].toString();
                                    }
                                }
                                this.updateNewRecord(cAddedRecord, args);
                            }).catch((e: { result: Object[] }) => {
                                this.removeAddedRecord();
                                this.dmFailure(e as { result: Object[] }, args as ITaskbarEditedEventArgs);
                                this._resetProperties();
                            });
                        } else {
                            const addedRecords: string = 'addedRecords';
                            const insertCrud: Promise<Object> = data.insert(updatedData[addedRecords as string], null, query) as Promise<Object>;
                            insertCrud.then((e: ReturnType) => {
                                let addedRecords: Object;
                                if (!isNullOrUndefined(e[0])) {
                                    addedRecords = e[0];
                                }
                                else {
                                    addedRecords = updatedData['addedRecords'][0];
                                }
                                this.updateNewRecord(cAddedRecord, args);
                            }).catch((e: { result: Object[] }) => {
                                this.removeAddedRecord();
                                this.dmFailure(e as { result: Object[] }, args as ITaskbarEditedEventArgs);
                                this._resetProperties();
                            });
                        }
                    } else {
                        if (this.parent.viewType === 'ProjectView') {
                            if ((rowPosition === 'Top' || rowPosition === 'Bottom') ||
                                ((rowPosition === 'Above' || rowPosition === 'Below' || rowPosition === 'Child') || isNullOrUndefined(rowPosition) && !(args.data as IGanttData).parentItem)) {
                                    if (args.data instanceof Array) {
                                        this.updateRealDataSource(args.data as IGanttData, rowPosition);
                                    } else {
                                        let data: Object[] = [];
                                        data.push(args.data);
                                        this.updateRealDataSource(data as IGanttData, rowPosition);
                                        this.parent.currentSelection = cAddedRecord[0].ganttProperties
                                    }
                                }
                        } else {
                            const dataSource: Object[] = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
                            this.parent.dataSource as Object[]; // eslint-disable-line
                            dataSource.push((args.data as IGanttData).taskData);
                        }
                        if ((cAddedRecord as IGanttData).level === 0) {
                            this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                        }
                        this.updateTreeGridUniqueID(cAddedRecord as IGanttData, 'add');
                        if (this.parent.viewType === 'ResourceView' && this.parent.undoRedoModule && this.parent.undoRedoModule['currentAction']) {
                            let canDelete: boolean = false;
                            if (args.data['hasChildRecords']) {
                                canDelete = true;
                            }
                            else {
                                if (args.data['parentItem']) {
                                    const parentTask: IGanttData = this.parent.getTaskByUniqueID(args.data['parentItem'].uniqueID);
                                    if (parentTask.ganttProperties.taskName != this.parent.localeObj.getConstant('unassignedTask')) {
                                        canDelete = true;
                                    }
                                }
                            }
                            if (this.parent.taskIds.indexOf('R0') != -1 && this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['currentAction']['action'] === 'Delete'
                                && canDelete) {
                                const unassignedTask: IGanttData = this.parent.flatData[this.parent.taskIds.indexOf('R0')];
                                let isPresent: IGanttData[] = unassignedTask.childRecords.filter((data: IGanttData) => { return data.ganttProperties.taskId == args.data['ganttProperties'].taskId });
                                if (args.data['hasChildRecords']) {
                                    isPresent = args.data['childRecords']
                                }
                                for (let j: number = 0; j < isPresent.length; j++) {
                                    if (unassignedTask.childRecords.length == 1) {
                                        this.parent.flatData.splice(this.parent.taskIds.indexOf('R0'), 2);
                                        this.parent.ids.splice(this.parent.taskIds.indexOf('R0'), 2);
                                        this.parent.taskIds.splice(this.parent.taskIds.indexOf('R0'), 2);
                                    }
                                    else {
                                        let index: number = this.parent.taskIds.indexOf('T' + isPresent[j as number].ganttProperties.taskId);
                                        const id: string = 'T' + isPresent[j as number].ganttProperties.taskId;
                                        const indexes: number[] = this.parent.taskIds.reduce(function (a, e, i) {
                                            if (e === id)
                                                a.push(i);
                                            return a;
                                        }, []);
                                        index = indexes[indexes.length - 1];
                                        this.parent.taskIds.splice(index, 1);
                                        this.parent.flatData.splice(index, 1)
                                        this.parent.ids.splice(index, 1);
                                    }
                                }
                                if (unassignedTask && this.parent.viewType === 'ResourceView') {
                                    const isValid: IGanttData = this.parent.flatData[this.parent.taskIds.indexOf('R0') + 1];
                                    if (!isValid) {
                                        this.parent.flatData.splice(this.parent.taskIds.indexOf('R0'), 1);
                                        this.parent.ids.splice(this.parent.taskIds.indexOf('R0'), 1);
                                        this.parent.taskIds.splice(this.parent.taskIds.indexOf('R0'), 1);
                                    }
                                }
                            }
                        }
                        this.refreshNewlyAddedRecord(args, cAddedRecord);
                        if(this.parent.viewType === 'ResourceView' && this.parent.taskFields.work && ganttData){
                            this.parent.dataOperation.updateParentItems(ganttData, true);
                        }
                        if (this.parent.undoRedoModule && (!this.parent.undoRedoModule['isUndoRedoPerformed'] || (this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['currentAction']['action'] == 'Add' && this.parent.viewType === 'ResourceView'))
                            && this.parent['isUndoRedoItemPresent']('Add')) {
                            record['action'] = 'Add';
                            let tempArray: IGanttData[] = (args.data as IGanttData[]).length > 0 ? extend([], [], args.data as IGanttData[], true) as IGanttData[] : [args.data as IGanttData];
                            let addedRec: IGanttData[] = [];
                            for (let i: number = 0; i < tempArray.length; i++) {
                                addedRec = (this.parent.flatData.filter((data: IGanttData) => {
                                    return (tempArray[i as number].index == data.index && tempArray[i as number]['ganttProperties'].taskId == data.ganttProperties.taskId);
                                }));
                            }
                            record['addedRecords'] = extend([], [], addedRec, true);
                            (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as any) = record;
                        }
                        this._resetProperties();
                    }
                    this.parent.isOnAdded = false;
                } else {
                    args = args;
                    this.removeAddedRecord();
                    this.reUpdatePreviousRecords();
                    this._resetProperties();
                }
            });
        }
    }

    /**
     * Method to validateTaskPosition.
     *
     * @param {Object | object[] } data - Defines the new data to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @param {IGanttData} cAddedRecord - Defines the single data to validate.
     * @returns {void} .
     * @private
     */
      public createNewRecord(): IGanttData {
        const tempRecord: IGanttData = {};
        const ganttColumns: GanttColumnModel[] = this.parent.ganttColumns;
        const taskSettingsFields: TaskFieldsModel = this.parent.taskFields;
        const taskId: number | string = this.parent.editModule.getNewTaskId();
        for (let i: number = 0; i < ganttColumns.length; i++) {
            const fieldName: string = ganttColumns[i as number].field;
            if (fieldName === taskSettingsFields.id) {
                tempRecord[fieldName as string] = taskId;
            } else if (ganttColumns[i as number].field === taskSettingsFields.startDate) {
                if (isNullOrUndefined(tempRecord[taskSettingsFields.endDate])) {
                    tempRecord[fieldName as string] = this.parent.editModule.dialogModule.getMinimumStartDate();
                } else {
                    tempRecord[fieldName as string] = new Date(tempRecord[taskSettingsFields.endDate]);
                }
                if (this.parent.timezone) {
                    tempRecord[fieldName as string] = this.parent.dateValidationModule.remove(tempRecord[fieldName as string],
                                                      this.parent.timezone);
                }
            } else if (ganttColumns[i as number].field === taskSettingsFields.endDate) {
                if (isNullOrUndefined(tempRecord[taskSettingsFields.startDate])) {
                    tempRecord[fieldName as string] = this.parent.editModule.dialogModule.getMinimumStartDate();
                } else {
                    tempRecord[fieldName as string] = new Date(tempRecord[taskSettingsFields.startDate]);
                }
                if (this.parent.timezone) {
                    tempRecord[fieldName as string] = this.parent.dateValidationModule.remove(tempRecord[fieldName as string],
                                                      this.parent.timezone);
                }
            } else if (ganttColumns[i as number].field === taskSettingsFields.duration) {
                tempRecord[fieldName as string] = 1;
            } else if (ganttColumns[i as number].field === taskSettingsFields.name) {
                tempRecord[fieldName as string] = this.parent.editModule.dialogModule['localeObj'].getConstant('addDialogTitle')+' '+ taskId;
            } else if (ganttColumns[i as number].field === taskSettingsFields.progress) {
                tempRecord[fieldName as string] = 0;
            } else if (ganttColumns[i as number].field === taskSettingsFields.work) {
                tempRecord[fieldName as string] = 0;
            } else if (ganttColumns[i as number].field === 'taskType') {
                tempRecord[fieldName as string] = this.parent.taskType;
            } else if (ganttColumns[i as number].field === taskSettingsFields.milestone) {
                tempRecord[fieldName as string] = null;
            } else {
                tempRecord[this.parent.ganttColumns[i as number].field] = '';
            }
        }
        return tempRecord;
    }
    public validateTaskPosition(data?: Object | object[], rowPosition?: RowPosition, rowIndex?: number, cAddedRecord?: IGanttData[]): void {
        const selectedRowIndex: number = isNullOrUndefined(rowIndex) || isNaN(parseInt(rowIndex.toString(), 10)) ?
            this.parent.selectionModule ?
                (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both') &&
                    this.parent.selectionModule.selectedRowIndexes.length === 1 ?
                    this.parent.selectionModule.selectedRowIndexes[0] :
                    this.parent.selectionSettings.mode === 'Cell' &&
                        this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        this.parent.selectionModule.getSelectedRowCellIndexes()[0].rowIndex : null : null : rowIndex;
        this.addRowSelectedItem = isNullOrUndefined(selectedRowIndex) ? null : this.parent.updatedRecords[selectedRowIndex as number];
        rowPosition = isNullOrUndefined(rowPosition) ? this.parent.editSettings.newRowPosition : rowPosition;
        data = isNullOrUndefined(data) ? this.createNewRecord() : data;
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
        let parentItem: IGanttData;
        switch (rowPosition) {
        case 'Top':
        case 'Bottom':
            if (this.parent.viewType === 'ResourceView') {
                level = 1;
            } else {
                level = 0;
            }
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
        if (!this.parent.undoRedoModule || !this.parent.undoRedoModule['isUndoRedoPerformed']) {
            this.prepareNewlyAddedData(data, rowPosition);
        }
        const AddRecord: IGanttData = (this.updateNewlyAddedDataBeforeAjax(data, level, rowPosition, parentItem));
        cAddedRecord.push(AddRecord);
    }

    private updateNewRecord(cAddedRecord: IGanttData[], args: ITaskAddedEventArgs): void {
        if ((cAddedRecord as IGanttData).level === 0) {
            this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
            const tempData: ITaskData[] = getValue('dataOperation.dataArray', this.parent);
            tempData.splice(0, 0, (cAddedRecord as IGanttData).taskData);
        }
        this.updateTreeGridUniqueID(cAddedRecord as IGanttData, 'add');
        this.refreshNewlyAddedRecord(args, cAddedRecord);
        this._resetProperties();
    }
    /**
     * Method to reset the flag after adding new record
     *
     * @returns {void} .
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
     *
     * @param {IGanttData} data .
     * @param {string} action .
     * @returns {void} .
     */
    private updateTreeGridUniqueID(data: IGanttData, action: string): void {
        if (action === 'add') {
            setValue('uniqueIDCollection.' + data.uniqueID, data, this.parent.treeGrid);
        } else if (action === 'delete') {
            deleteObject(getValue('uniqueIDCollection', this.parent.treeGrid), data.uniqueID);
        }
    }


    private refreshNewlyAddedRecord(args: ITaskAddedEventArgs, cAddedRecord: IGanttData[]): void {
        if (this.parent.selectionModule && this.parent.allowSelection &&
            (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both')) {
            this.parent.staticSelectedRowIndex = this.parent.currentViewData.indexOf(args.data as IGanttData);
        }
        if (this.parent.timelineSettings.updateTimescaleView) {
            let tempArray: IGanttData[] = [];
            if (args.modifiedRecords.length > 0) {
                tempArray = (args.data as IGanttData[]).length > 0 ? extend([],[],args.data as IGanttData[],true) as IGanttData[] : [args.data as IGanttData];                // eslint-disable-next-line
                tempArray.push.apply(tempArray, args.modifiedRecords);
            } else {
                tempArray = (args.data as IGanttData[]).length > 0 ? extend([],[],args.data as IGanttData[],true) as IGanttData[] : [args.data as IGanttData];            }
            this.parent.timelineModule.updateTimeLineOnEditing([tempArray], args.action);
        }
        this.addSuccess(args);
        args = this.constructTaskAddedEventArgs(cAddedRecord, args.modifiedRecords, 'add');
        if (this.dialogModule.isAddNewResource && !this.parent.isEdit && this.parent.taskFields.work){
            this.parent.dataOperation.updateWorkWithDuration(cAddedRecord[0]);
        }
        this.parent.trigger('actionComplete', args);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
            this.parent.hideMaskRow();
        } else {
            this.parent.hideSpinner();
        }
        if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
            this.dialogModule.dialogObj.hide();
        }
        this.dialogModule.dialogClose();
        if (this.parent.viewType === 'ResourceView') {
            if (cAddedRecord.length > 1) {
                for (let i: number = 0; i < cAddedRecord.length; i++) {
                    (args.data[i as number] as IGanttData).ganttProperties.sharedTaskUniqueIds.push((args.data[i as number] as IGanttData)
                        .ganttProperties.rowUniqueID);
                    if ((args.data[i as number] as IGanttData).ganttProperties.resourceInfo) {
                        // if ((args.data[i] as IGanttData).ganttProperties.resourceInfo.length > 1) {
                        const resources: Object[] =
                            extend([], [], (args.data[i as number] as IGanttData).ganttProperties.resourceInfo, true) as Object[];
                        resources.splice(0, 1);
                        this.updateResoures([], resources, args.data[i as number] as IGanttData);
                        // }
                    }
                    else {
                        if (!this.parent.undoRedoModule || (this.parent.undoRedoModule && !args.data[i as number]['hasChildRecords'] && this.parent.undoRedoModule['isUndoRedoPerformed'] || !this.parent.undoRedoModule['isUndoRedoPerformed'])) {
                            this.removeChildRecord(args.data[i as number] as IGanttData);
                            this.parent.editModule.checkWithUnassignedTask(args.data[i as number] as IGanttData);
                        }
                    }
                    for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                        this.parent.dataOperation.updateParentItems(this.updateParentRecords[k as number]);
                    }
                    this.updateParentRecords = [];
                }
            }
            else {
                (args.data as IGanttData).ganttProperties.sharedTaskUniqueIds.push((args.data as IGanttData).ganttProperties.rowUniqueID);
                // eslint-disable-next-line
                if ((args.data as IGanttData).ganttProperties.resourceInfo && (args.data as IGanttData).ganttProperties.resourceInfo.length) {
                    if ((args.data as IGanttData).ganttProperties.resourceInfo.length > 1) {
                        // eslint-disable-next-line
                        const resources: Object[] = extend([], [], (args.data as IGanttData).ganttProperties.resourceInfo, true) as Object[];
                        resources.splice(0, 1);
                        this.updateResoures([], resources, args.data as IGanttData);
                    }
                }
                else {
                    if (!this.parent.undoRedoModule || (this.parent.undoRedoModule && !args.data['hasChildRecords'] && this.parent.undoRedoModule['isUndoRedoPerformed'] || !this.parent.undoRedoModule['isUndoRedoPerformed'])) {
                        this.removeChildRecord(args.data as IGanttData);
                        this.parent.editModule.checkWithUnassignedTask(args.data as IGanttData);
                    }
                }
                for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                    this.parent.dataOperation.updateParentItems(this.updateParentRecords[k as number]);
                }
                this.updateParentRecords = [];
            }
        }
    }

    /**
     *
     * @returns {void} .
     * @private
     */
    private removeAddedRecord(): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        const ids: string[] = this.parent.ids;
        const flatRecordsIndex: number = flatRecords.indexOf(this.newlyAddedRecordBackup);
        const currentViewDataIndex: number = currentViewData.indexOf(this.newlyAddedRecordBackup);
        const idsIndex: number = ids.indexOf(this.newlyAddedRecordBackup.ganttProperties.rowUniqueID.toString());
        deleteObject(this.parent.previousRecords, flatRecords[flatRecordsIndex as number].uniqueID);
        if (this.newlyAddedRecordBackup.parentItem) {
            const parentItem: IGanttData = this.parent.getParentTask(this.newlyAddedRecordBackup.parentItem);
            const parentIndex: number = parentItem.childRecords.indexOf(this.newlyAddedRecordBackup);
            parentItem.childRecords.splice(parentIndex, 1);
        }
        flatRecords.splice(flatRecordsIndex, 1);
        currentViewData.splice(currentViewDataIndex, 1);
        ids.splice(idsIndex, 1);
    }
    private getPrevRecordIndex(): number {
        const prevRecord: IGanttData = this.parent.updatedRecords[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
        const selectedRecord: IGanttData = this.parent.selectionModule.getSelectedRecords()[0];
        const parent: IGanttData = this.parent.getRootParent(prevRecord, selectedRecord.level);
        const prevIndex: number = this.parent.updatedRecords.indexOf(parent);
        return prevIndex;
    }
    /**
     * indent a selected record
     *
     * @returns {void} .
     */
    public indent(): void {
        const index: number = this.parent.selectedRowIndex;
        const isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
            this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        let dropIndex: number;
        const prevRecord: IGanttData = this.parent.updatedRecords[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
        const selectedRecord: IGanttData = this.parent.selectionModule.getSelectedRecords()[0];
        if (!this.parent.editSettings.allowEditing || index === 0 || index === -1 || !isSelected ||
            this.parent.viewType === 'ResourceView' || this.parent.updatedRecords[index as number].level - prevRecord.level === 1) {
            return;
        } else {
            if (prevRecord.level - selectedRecord.level === 0) {
                dropIndex = this.parent.selectionModule.getSelectedRowIndexes()[0] - 1;
            } else {
                dropIndex = this.getPrevRecordIndex();
            }
            this.indentOutdentRow([this.parent.selectionModule.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
    }

    /**
     * To perform outdent operation for selected row
     *
     * @returns {void} .
     */
    public outdent(): void {
        const index: number = this.parent.selectionModule.getSelectedRowIndexes()[0];
        let dropIndex: number;
        const isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
            this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        if (!this.parent.editSettings.allowEditing || index === -1 || index === 0 || !isSelected ||
            this.parent.viewType === 'ResourceView' || this.parent.updatedRecords[index as number].level === 0) {
            return;
        } else {
            const thisParent: IGanttData = this.parent.getTaskByUniqueID((this.parent.selectionModule.getSelectedRecords()[0] as
                IGanttData).parentItem.uniqueID);
            dropIndex = this.parent.updatedRecords.indexOf(thisParent);
            this.indentOutdentRow([index], dropIndex, 'below');
        }
    }
    private indentOutdentRow(fromIndexes: number[], toIndex: number, pos: string): void {
        // eslint-disable-next-line
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
            const record: IGanttData[] = [];
            for (let i: number = 0; i < fromIndexes.length; i++) {
                if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['currentAction']) {
                    if (this.parent.undoRedoModule['currentAction']['modifiedRecord']) {
                        record[i as number] = this.parent.undoRedoModule['currentAction']['modifiedRecord'][i as number].data;
                    }
                    else {
                        record[i as number] = this.parent.undoRedoModule['currentAction']['data'][i as number];
                    }
                }
                else {
                    record[i as number] = this.parent.updatedRecords[fromIndexes[i as number]];
                }
            }
            const isByMethod: boolean = true;
            const args: RowDropEventArgs = {
                data: record,
                dropIndex: toIndex,
                dropPosition: this.dropPosition
            };
            if (this.dropPosition === 'middleSegment') {
                action =  'indenting';
            } else if (this.dropPosition === 'bottomSegment') {
                action =  'outdenting';
            }
            const actionArgs: IActionBeginEventArgs = {
                action : action,
                data: record[0],
                cancel: false
            };
            this.parent.trigger('actionBegin', actionArgs, (actionArg: IActionBeginEventArgs) => {
                if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer" ) {
                    this.parent.showMaskRow()
                } else {
                    this.parent.showSpinner()
                }
                if (!actionArg.cancel) {
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
            const obj: Gantt = this.parent; let draggedRec: IGanttData;
            this.droppedRecord = obj.updatedRecords[args.dropIndex];
            const action: string = args.dropPosition == 'middleSegment' ? 'Indent' : 'Outdent';
            if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent['isUndoRedoItemPresent'](action)) {
                let record: Object = {};
                record['action'] = action;
                record['modifiedRecord'] = [];
                record['selectedRowIndexes'] = extend([], [], this.parent.selectionModule.selectedRowIndexes, true);
                this.parent.undoRedoModule['findPosition'](extend([],[],[args.data as IGanttData],true)[0],record,'modifiedRecord');
                record['droppedRecord'] = extend([], [], this.droppedRecord, true);
                if (this.parent.undoRedoModule['redoEnabled']) {
                    this.parent.undoRedoModule['redoEnabled'] = false;
                    this.parent.undoRedoModule['getUndoCollection'] = [];
                    this.parent.undoRedoModule['getRedoCollection'] = [];
                    if(this.parent.toolbarModule) {
                        this.parent.toolbarModule.enableItems([this.parent.controlId + '_redo'], false);
                    }
                    this.parent.undoRedoModule['getUndoCollection'][0] = [];
                }
                this.parent.undoRedoModule['createUndoCollection']();
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as any) = record;
            }
            let dragRecords: IGanttData[] = [];
            const droppedRec: IGanttData = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data as IGanttData);
            } else {
                dragRecords = args.data;
            }
            let c: number = 0;
            const dLength: number = dragRecords.length;
            for (let i: number = 0; i < dLength; i++) {
                this.parent.isOnEdit = true;
                draggedRec = dragRecords[i as number];
                this.draggedRecord = draggedRec;
                if (this.dropPosition !== 'Invalid') {
                    if (isByMethod) {
                        this.deleteDragRow();
                    }
                    const recordIndex1: number = this.treeGridData.indexOf(droppedRec);
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRec.hasChildRecords) {
                            if (this.parent.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                                (this.ganttData as IGanttData[]).splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                        } else {
                            c = this.parent.editModule.getChildCount(droppedRec, 0);
                            if (this.parent.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                                (this.ganttData as IGanttData[]).splice(recordIndex1 + c + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + c + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + c + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                            const idIndex: number = this.parent.ids.indexOf(this.draggedRecord[this.parent.taskFields.id].toString());
                            if (idIndex !== recordIndex1 + c + 1) {
                                this.parent.ids.splice(idIndex, 1);
                                this.parent.ids.splice(recordIndex1 + c + 1, 0, this.draggedRecord[this.parent.taskFields.id].toString());
                            }
                        }
                        this.parent.setRecordValue('parentItem', this.treeGridData[recordIndex1 as number].parentItem, draggedRec);
                        this.parent.setRecordValue('parentUniqueID', this.treeGridData[recordIndex1 as number].parentUniqueID, draggedRec);
                        this.parent.setRecordValue('level', this.treeGridData[recordIndex1 as number].level, draggedRec);
                        if (draggedRec.hasChildRecords) {
                            const level: number = 1;
                            this.updateChildRecordLevel(draggedRec, level);
                            this.updateChildRecord(draggedRec, recordIndex1 + c + 1);
                        }
                        if (droppedRec.parentItem) {
                            const record: IGanttData[] = this.parent.getParentTask(droppedRec.parentItem).childRecords;
                            const childRecords: IGanttData[] = record;
                            const droppedRecordIndex: number = childRecords.indexOf(droppedRec) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRec);
                        }
                    }
                    if (this.dropPosition === 'middleSegment') {
                        this.dropMiddle(recordIndex1);
                    }
                    if (!isNullOrUndefined(draggedRec.parentItem && this.updateParentRecords.indexOf(draggedRec.parentItem) !== -1)) {
                        this.updateParentRecords.push(this.parent.getTaskByUniqueID(draggedRec.parentItem.uniqueID));
                    }
                }
                if (isNullOrUndefined(draggedRec.parentItem)) {
                    const parentRecords: ITreeData[] = this.parent.treeGrid.parentData;
                    const newParentIndex: number = parentRecords.indexOf(this.droppedRecord);
                    if (this.dropPosition === 'bottomSegment') {
                        parentRecords.splice(newParentIndex + 1, 0, draggedRec);
                    }
                }
                this.refreshDataSource();
            }
            if (this.dropPosition === 'middleSegment') {
                if ( !isNullOrUndefined(droppedRec.ganttProperties.predecessor)) {
                    const len: number = droppedRec.ganttProperties.predecessor.length;
                    for (let count: number = len - 1; count >=0 ; count--) {
                        if (!isNullOrUndefined(droppedRec.ganttProperties.predecessor)) {
                            const fromRecord: IGanttData = this.parent.getRecordByID(droppedRec.ganttProperties.predecessor[count as number].from);
                            const toRecord: IGanttData = this.parent.getRecordByID(droppedRec.ganttProperties.predecessor[count as number].to);
                            const validPredecessor: boolean = this.parent.connectorLineEditModule.validateParentPredecessor(fromRecord, toRecord);
                            if (droppedRec.ganttProperties.predecessor && (!validPredecessor || !this.parent.allowParentDependency)) {
                                this.parent.editModule.removePredecessorOnDelete(droppedRec);
                                droppedRec.ganttProperties.predecessor.splice(count, 1);
                                droppedRec.ganttProperties.predecessorsName = null;
                                droppedRec[this.parent.taskFields.dependency] = null;
                                droppedRec.taskData[this.parent.taskFields.dependency] = null;
                            }
                        }
                    }
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
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[k as number]);
            }
            this.parent.editedRecords.forEach(record => {
                this.isFirstCall = true;
                this.parent.predecessorModule.validatePredecessor(record, [], '');
            });
            for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[k as number]);
            }
            this.updateParentRecords = [];
            this.parent.isOnEdit = false;
        }
        this.refreshRecord(args);
    }
    /**
     * @returns {void} .
     * @private
     */
    public refreshRecord(args: RowDropEventArgs, isDrag?: boolean): void {
        if (isRemoteData(this.parent.dataSource)) {
            const data: DataManager = this.parent.dataSource as DataManager;
            const updatedData: object = {
                changedRecords: getTaskData(this.parent.editedRecords, null, null, this.parent)
            };
            const queryValue: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
            let crud: Promise<Object> = null;
            const adaptor: AdaptorOptions = data.adaptor;
            if (!(adaptor instanceof WebApiAdaptor && adaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                crud = data.saveChanges(updatedData, this.parent.taskFields.id, null, queryValue) as Promise<Object>;
            } else {
                const changedRecords: string = 'changedRecords';
                crud = data.update(this.parent.taskFields.id, updatedData[changedRecords as string], null, queryValue) as Promise<Object>;
            }
            crud.then((e: ReturnType) => this.indentSuccess(e, args, isDrag))
                .catch((e: { result: Object[] }) => this.indentFailure(e as { result: Object[] }));
        } else {
            this.indentOutdentSuccess(args, isDrag);
        }
    }
    private indentSuccess(e: ReturnType, args: RowDropEventArgs, isDrag: boolean): void {
        this.indentOutdentSuccess(args, isDrag);
    }
    private indentFailure(e: { result: Object[] }): void {
        this.parent.trigger('actionFailure', { error: e });
    }
    private indentOutdentSuccess(args: RowDropEventArgs, isDrag: boolean): void {
        this.parent.treeGrid.parentData = [];
        this.parent.treeGrid.refresh();
        if (this.parent.enableImmutableMode) {
            this.refreshRecordInImmutableMode(args.data, isDrag);
            this.parent.chartRowsModule.refreshRecords(this.parent.editedRecords);
        }
        if (isDrag) {
            args.requestType = 'rowDropped';
        } else {
            if (this.dropPosition === 'middleSegment') {
                args.requestType = 'indented';
            } else if (this.dropPosition === 'bottomSegment') {
                args.requestType = 'outdented';
            }
        }
        args.modifiedRecords = this.parent.editedRecords;
        if (this.parent.timezone) {
            for (let i: number = 0; i < args.modifiedRecords.length; i++) {
                updateDates(args.modifiedRecords[i as number], this.parent);
            }
        }
        this.parent.trigger('actionComplete', args);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
            this.parent.hideMaskRow();
        } else {
            this.parent.hideSpinner();
        }
        if (this.parent.rowDragAndDropModule) {
           this.parent.rowDragAndDropModule['draggedRecord'] = null;
        }
    }
    private refreshDataSource(): void {
        const draggedRec: IGanttData = this.draggedRecord;
        const droppedRec: IGanttData = this.droppedRecord;
        const proxy: Gantt = this.parent;
        let tempData: Object;
        let indx: number;
        if (this.parent.dataSource instanceof DataManager) {
            tempData = getValue('dataOperation.dataArray', this.parent);
        } else {
            tempData = proxy.dataSource;
        }
        if ((tempData as IGanttData[]).length > 0 && (!isNullOrUndefined(droppedRec) && !droppedRec.parentItem)) {
            for (let i: number = 0; i < Object.keys(tempData).length; i++) {
                if (tempData[i as number][this.parent.taskFields.child] === droppedRec.taskData[this.parent.taskFields.child]) {
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
                const rowPos: RowPosition = this.dropPosition === 'topSegment' ? 'Above' : 'Below';
                this.parent.editModule.addRowSelectedItem = droppedRec;
                let dragRecord: IGanttData[] = [];
                if (!Array.isArray(draggedRec)) {
                   dragRecord[0] = draggedRec;
                }
                else {
                   dragRecord = draggedRec;
                }
                this.parent.editModule.updateRealDataSource(dragRecord, rowPos);
                delete this.parent.editModule.addRowSelectedItem;
            }
        }
        if (this.parent.taskFields.parentID) {
            if (draggedRec.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRec[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.parentID];
                    draggedRec.taskData[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.parentID];
                    draggedRec.ganttProperties['parentId'] = droppedRec[this.parent.taskFields.parentID];
                } else {
                    draggedRec[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.id];
                    draggedRec.taskData[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.id];
                    draggedRec.ganttProperties['parentId'] = droppedRec[this.parent.taskFields.id];
                }
            } else {
                draggedRec[this.parent.taskFields.parentID] = null;
                draggedRec.taskData[this.parent.taskFields.parentID] = null;
                draggedRec.ganttProperties['parentId'] = null;
            }
        }
    }
    private deleteDragRow(): void {
        if (this.parent.dataSource instanceof DataManager) {
            this.ganttData = getValue('dataOperation.dataArray', this.parent);
        } else {
            this.ganttData = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
                this.parent.dataSource;
        }
        this.treeGridData = isCountRequired(this.parent) ?
            getValue('result', this.parent.treeGrid.dataSource) : this.parent.treeGrid.dataSource;
        const delRow: IGanttData = this.parent.getTaskByUniqueID(this.draggedRecord.uniqueID);
        this.removeRecords(delRow);
    }
    private updateIndentedChildRecords(indentedRecord: IGanttData) {
        let createParentItem: IParent = {
            uniqueID: indentedRecord.uniqueID,
            expanded: indentedRecord.expanded,
            level: indentedRecord.level,
            index: indentedRecord.index,
            taskId: indentedRecord.ganttProperties.rowUniqueID
        };
        for (let i: number = 0; i < indentedRecord.childRecords.length; i++) {
            this.parent.setRecordValue('parentItem', createParentItem, indentedRecord.childRecords[i as number]);
            this.parent.setRecordValue('parentUniqueID', indentedRecord.uniqueID, indentedRecord.childRecords[i as number]);
        }
        if (indentedRecord.hasChildRecords) {
            (indentedRecord as IGanttData[]) = indentedRecord.childRecords;
            for (let j = 0; j < indentedRecord['length']; j++) {
                this.updateIndentedChildRecords(indentedRecord[j as number]);
            }
        }
    }
    private dropMiddle(recordIndex1: number): void {
        const obj: Gantt = this.parent;
        let childRec: number;
        let childRecordsLength: number;
        if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.undoRedoModule['currentAction']['modifiedRecord']
           && this.parent.undoRedoModule['currentAction']['modifiedRecord'][0].position !== 'child') {
            if (this.parent.undoRedoModule['currentAction']['modifiedRecord'][0].position == 'above') {
                childRecordsLength = this.parent.ids.indexOf(this.parent.undoRedoModule['currentAction']['modifiedRecord'][0].id.toString());
            }
            else if (this.parent.undoRedoModule['currentAction']['modifiedRecord'][0].position == 'below') {
                childRecordsLength = this.parent.ids.indexOf(this.parent.undoRedoModule['currentAction']['modifiedRecord'][0].id.toString()) + 1;
            }
        }
        else {
            childRec = this.parent.editModule.getChildCount(this.droppedRecord, 0);
            childRecordsLength = (isNullOrUndefined(childRec) ||
                childRec === 0) ? recordIndex1 + 1 :
                childRec + recordIndex1 + 1;
        }
        if (this.dropPosition === 'middleSegment') {
            if (obj.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                (this.ganttData as IGanttData[]).splice(childRecordsLength, 0, this.draggedRecord.taskData);
            }
            this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.ids.splice(childRecordsLength, 0, this.draggedRecord[this.parent.taskFields.id].toString());
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
                if (this.parent.enableImmutableMode) {
                    let indentedRecord = this.draggedRecord;
                    this.updateIndentedChildRecords(indentedRecord);
                }
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
            currentRec = record.childRecords[j as number];
            let parentData: IGanttData;
            if (record.parentItem) {
                const id: string = 'uniqueIDCollection';
                parentData = this.parent.treeGrid[id as string][record.parentItem.uniqueID];
            }
            currentRec.level = record.parentItem ? parentData.level + levl : record.level + 1;
            if (currentRec.hasChildRecords) {
                levl--;
                levl = this.updateChildRecordLevel(currentRec, levl);
            }
        }
        return levl;
    }
    /* eslint-disable-next-line */
    private updateChildRecord(record: IGanttData, count: number, expanded?: boolean): number {
        let currentRec: IGanttData;
        const obj: Gantt = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRec = record.childRecords[i as number];
            count++;
            obj.flatData.splice(count, 0, currentRec);
            this.parent.ids.splice(count, 0, currentRec.ganttProperties.rowUniqueID.toString());
            if (obj.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                (this.ganttData as IGanttData[]).splice(count, 0, currentRec.taskData);
            }
            if (currentRec.hasChildRecords) {
                count = this.updateChildRecord(currentRec, count);
            }
        }
        return count;
    }
    private removeRecords(record: IGanttData): void {
        const obj: Gantt = this.parent;
        let dataSource: Object;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = getValue('dataOperation.dataArray', this.parent);
        } else {
            dataSource = this.parent.dataSource;
        }
        const delRow: IGanttData = record;
        if (delRow) {
            const flatParent: IGanttData = this.parent.getParentTask(delRow.parentItem);
            if (delRow.parentItem) {
                const childRecords: IGanttData[] = flatParent ? flatParent.childRecords : [];
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(delRow);
                    flatParent.childRecords.splice(childIndex, 1);
                    if (!this.parent.taskFields.parentID) {
                        flatParent.taskData[this.parent.taskFields.child].splice(childIndex, 1);
                    }
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParent);
                }
            }
            if (obj.taskFields.parentID) {
                if (delRow.hasChildRecords && delRow.childRecords.length > 0) {
                    this.removeChildItem(delRow);
                }
                let indx: number;
                const ganttData: IGanttData[] = (dataSource as IGanttData[]).length > 0 ?
                    dataSource as IGanttData[] : this.parent.currentViewData;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (ganttData[i as number][this.parent.taskFields.id] === delRow.taskData[this.parent.taskFields.id]) {
                        indx = i;
                    }
                }
                if (indx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(indx, 1);
                    }
                    let gridIndx: number;
                    for (let i: number = 0; i < this.treeGridData.length; i++) {
                        if (this.treeGridData[i as number][this.parent.taskFields.id] === delRow.taskData[this.parent.taskFields.id]) {
                            gridIndx = i;
                        }
                    }
                    this.treeGridData.splice(gridIndx, 1);
                    this.parent.ids.splice(gridIndx, 1);
                    if (this.parent.treeGrid.parentData.indexOf(delRow) !== -1) {
                        this.parent.treeGrid.parentData.splice(this.parent.treeGrid.parentData.indexOf(delRow), 1);
                    }
                }
            }
            const recordIdx: number = this.treeGridData.indexOf(delRow);
            if (!obj.taskFields.parentID) {
                const deletedRecordCount: number = this.getChildCount(delRow, 0);
                this.treeGridData.splice(recordIdx, deletedRecordCount + 1);
                this.parent.ids.splice(recordIdx, deletedRecordCount + 1);
                const parentIndex: number = (this.ganttData as IGanttData[]).indexOf(delRow.taskData);
                if (parentIndex !== -1) {
                    (this.ganttData as IGanttData[]).splice(parentIndex, 1);
                    this.parent.treeGrid.parentData.splice(parentIndex, 1);
                }
            }
            if (delRow.parentItem && flatParent && flatParent.childRecords && !flatParent.childRecords.length) {
                this.parent.setRecordValue('expanded', false, flatParent);
                this.parent.setRecordValue('hasChildRecords', false, flatParent);
            }
        }
    }
    private removeChildItem(record: IGanttData): void {
        let currentRec: IGanttData;
        let indx: number;
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRec = record.childRecords[i as number];
            let data: Object;
            if (this.parent.dataSource instanceof DataManager) {
                data = getValue('dataOperation.dataArray', this.parent);
            } else {
                data = this.parent.dataSource;
            }
            for (let j: number = 0; j < (<IGanttData[]>data).length; j++) {
                if (data[j as number][this.parent.taskFields.id] === currentRec.taskData[this.parent.taskFields.id]) {
                    indx = j;
                }
            }
            if (indx !== -1) {
                if ((data as IGanttData[]).length > 0) {
                    (data as IGanttData[]).splice(indx, 1);
                }
                let gridIndx: number;
                for (let i: number = 0; i < this.treeGridData.length; i++) {
                    if (this.treeGridData[i as number][this.parent.taskFields.id] === currentRec.taskData[this.parent.taskFields.id]) {
                        gridIndx = i;
                    }
                }
                this.treeGridData.splice(gridIndx, 1);
                this.parent.ids.splice(gridIndx, 1);
            }
            if (currentRec.hasChildRecords) {
                this.removeChildItem(currentRec);
            }
        }
    }
    private recordLevel(): void {
        const obj: Gantt = this.parent;
        const draggedRec: IGanttData = this.draggedRecord;
        const droppedRec: IGanttData = this.droppedRecord;
        const childItem: string = obj.taskFields.child;
        if (!droppedRec.hasChildRecords) {
            droppedRec.hasChildRecords = true;
            if (!droppedRec.childRecords.length) {
                droppedRec.childRecords = [];
                if (!obj.taskFields.parentID && isNullOrUndefined(droppedRec.taskData[childItem as string])) {
                    droppedRec.taskData[childItem as string] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            const parentItem: IGanttData = extend({}, droppedRec);
            delete parentItem.childRecords;
            const createParentItem: IParent = {
                uniqueID: parentItem.uniqueID,
                expanded: parentItem.expanded,
                level: parentItem.level,
                index: parentItem.index,
                taskId: parentItem.ganttProperties.rowUniqueID
            };
            this.parent.setRecordValue('parentItem', createParentItem, draggedRec);
            this.parent.setRecordValue('parentUniqueID', droppedRec.uniqueID, draggedRec);
            droppedRec.childRecords.splice(droppedRec.childRecords.length, 0, draggedRec);
            if (!isNullOrUndefined(draggedRec) && !obj.taskFields.parentID && !isNullOrUndefined(droppedRec.taskData[childItem as string])) {
                droppedRec.taskData[obj.taskFields.child].splice(droppedRec.childRecords.length, 0, draggedRec.taskData);
            }
            if (!isNullOrUndefined(droppedRec.ganttProperties.segments) && droppedRec.ganttProperties.segments.length > 0) {
                droppedRec.ganttProperties.segments = null;
                droppedRec.taskData[obj.taskFields.segments] = null;
            }
            if (!draggedRec.hasChildRecords) {
                draggedRec.level = droppedRec.level + 1;
            } else {
                const level: number = 1;
                draggedRec.level = droppedRec.level + 1;
                this.updateChildRecordLevel(draggedRec, level);
            }
            droppedRec.expanded = true;
        }
    }
}
