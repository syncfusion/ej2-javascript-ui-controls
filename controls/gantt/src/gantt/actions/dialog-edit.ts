import { remove, extend, isNullOrUndefined, createElement, L10n, getValue, setValue, closest } from '@syncfusion/ej2-base';
import { DataManager, DataUtil } from '@syncfusion/ej2-data';
import { Dialog, PositionDataModel, DialogModel } from '@syncfusion/ej2-popups';
import { Tab, TabModel, TabItemModel, SelectEventArgs } from '@syncfusion/ej2-navigations';
import {
    Grid, Edit, Toolbar as GridToolbar, Page, GridModel, GridActionEventArgs, getObject, ActionEventArgs
} from '@syncfusion/ej2-grids';
import {
    ColumnModel as GridColumnModel, ForeignKey,
    getActualProperties, RowSelectEventArgs
} from '@syncfusion/ej2-grids';
import { Gantt } from '../base/gantt';
import {
    RichTextEditor, Toolbar as RTEToolbar, Link, HtmlEditor, QuickToolbar,
    RichTextEditorModel,
    Count
} from '@syncfusion/ej2-richtexteditor';
import { AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, TaskFieldsModel, ResourceFieldsModel, AddDialogFieldSettings } from '../models/models';
import { CObject } from '../base/enum';
import { ColumnModel as GanttColumnModel } from '../models/column';
import { TextBox, NumericTextBox, NumericTextBoxModel, MaskedTextBox, TextBoxModel, FormValidatorModel, FormValidator } from '@syncfusion/ej2-inputs';
import {
    IGanttData, ITaskData, ITaskSegment, IDependencyEditData, IPredecessor, ITaskbarEditedEventArgs, ActionBeginArgs
} from '../base/interface';
import { CheckBox, CheckBoxModel } from '@syncfusion/ej2-buttons';
import { DatePicker, DateTimePicker, DatePickerModel } from '@syncfusion/ej2-calendars';
import { DropDownList, ComboBox, ComboBoxModel, ChangeEventArgs, DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { isScheduledTask } from '../base/utils';
import {
    TreeGridModel, ColumnModel as TreeGridColumnModel,
    TreeGrid, Selection, Filter, Edit as TreeGridEdit, VirtualScroll
} from '@syncfusion/ej2-treegrid';
import { getUid } from '../base/utils';
interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line
    ej2_instances: Object[];
}

/**
 *
 * @hidden
 */
export class DialogEdit {
    //Internal variables
    //Module declarations
    private isEdit: boolean;
    /**
     * @private
     */
    public dialog: HTMLElement;
    public isAddNewResource: boolean;
    /**
     * @private
     */
    public dialogObj: Dialog;
    private preTableCollection: IDependencyEditData[];
    private preTaskIds: string[];
    private localeObj: L10n;
    private parent: Gantt;
    private rowIndex: number;
    private numericOrString: any;
    private types: IDependencyEditData[];
    private editedRecord: IGanttData;
    private rowData: IGanttData;
    private beforeOpenArgs: CObject;
    private inputs: Object;
    private idCollection: IDependencyEditData[];
    /**
     * @private
     */
    public updatedEditFields: EditDialogFieldSettingsModel[] = null;
    private updatedAddFields: AddDialogFieldSettingsModel[] = null;
    private addedRecord: Record<string, unknown> = null;
    private dialogEditValidationFlag: boolean = false;
    private tabObj: Tab;
    private selectedSegment: ITaskSegment;
    public ganttResources: Object[] = [];
    private isValidData: boolean = true;
    /**
     * @private
     */
    public previousResource: Object[] = [];
    /**
     * @private
     */
    public isResourceUpdate: boolean = false;
    /**
     * Constructor for render module
     *
     * @param {Gantt} parent .
     * @returns {void} .
     */
    constructor(parent: Gantt) {
        this.parent = parent;
        this.localeObj = this.parent.localeObj;
        this.beforeOpenArgs = { cancel: false };
        this.types = this.getPredecessorType();
        this.rowData = {};
        this.editedRecord = {};
        this.inputs = {
            booleanedit: CheckBox,
            dropdownedit: DropDownList,
            datepickeredit: DatePicker,
            datetimepickeredit: DateTimePicker,
            maskededit: MaskedTextBox,
            numericedit: NumericTextBox,
            stringedit: TextBox,
            defaultedit: TextBox
        };
        this.processDialogFields();
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.on('chartDblClick', this.dblClickHandler, this);
    }

    private dblClickHandler(e: PointerEvent): void {
        const ganttData: IGanttData = this.parent.ganttChartModule.getRecordByTarget(e);
        if (!isNullOrUndefined(ganttData) && this.parent.editModule && this.parent.editSettings.allowEditing) {
            this.openEditDialog(ganttData);
        }
    }

    /**
     * Method to validate add and edit dialog fields property.
     *
     * @returns {void} .
     * @private
     */
    public processDialogFields(): void {
        if (isNullOrUndefined(this.parent.editDialogFields) ||
            this.parent.editDialogFields && this.parent.editDialogFields.length === 0) {
            this.updatedEditFields = this.getDefaultDialogFields();
            this.updatedEditFields = this.validateDialogFields(this.updatedEditFields);
        } else {
            this.updatedEditFields = this.validateDialogFields(this.parent.editDialogFields);
        }
        if (isNullOrUndefined(this.parent.addDialogFields) ||
            this.parent.addDialogFields && this.parent.addDialogFields.length === 0) {
            this.updatedAddFields = this.getDefaultDialogFields();
            this.updatedAddFields = this.validateDialogFields(this.updatedAddFields);
        } else {
            this.updatedAddFields = this.validateDialogFields(this.parent.addDialogFields);
        }
    }

    private validateDialogFields(dialogFields: AddDialogFieldSettingsModel[]): AddDialogFieldSettingsModel[] {
        const newDialogFields: AddDialogFieldSettingsModel[] = [];
        let emptyCustomColumn: number = 0;
        for (let i: number = 0; i < dialogFields.length; i++) {
            const fieldItem: AddDialogFieldSettingsModel = getActualProperties(dialogFields[i]);
            if (fieldItem.type === 'General' && (isNullOrUndefined(fieldItem.fields) || fieldItem.fields.length === 0)) {
                fieldItem.fields = this.getGeneralColumnFields();
            }
            if (fieldItem.type === 'Dependency' && isNullOrUndefined(this.parent.taskFields.dependency)
                || fieldItem.type === 'Resources' && isNullOrUndefined(this.parent.taskFields.resourceInfo)
                || fieldItem.type === 'Notes' && isNullOrUndefined(this.parent.taskFields.notes)) {
                continue;
            }
            if (fieldItem.type === 'Custom' && (isNullOrUndefined(fieldItem.fields) || fieldItem.fields.length === 0)) {
                emptyCustomColumn += 1;
                fieldItem.fields = this.getCustomColumnFields();
            }
            if (emptyCustomColumn > 1) {
                continue;
            }
            newDialogFields.push(fieldItem);
        }
        return newDialogFields;
    }
    /**
     * Method to get general column fields
     *
     * @returns {string[]} .
     */
    private getGeneralColumnFields(): string[] {
        const fields: string[] = [];
        for (const key of Object.keys(this.parent.columnMapping)) {
            if (key === 'dependency' || key === 'resourceInfo' || key === 'notes') {
                continue;
            }
            fields.push(this.parent.columnMapping[key]);
        }
        return fields;
    }

    /**
     * Method to get custom column fields
     *
     * @returns {void} .
     */
    private getCustomColumnFields(): string[] {
        const fields: string[] = [];
        for (let i: number = 0; i < this.parent.customColumns.length; i++) {
            fields.push(this.parent.customColumns[i]);
        }
        return fields;
    }

    /**
     * Get default dialog fields when fields are not defined for add and edit dialogs
     *
     * @returns {AddDialogFieldSettings} .
     */
    private getDefaultDialogFields(): AddDialogFieldSettingsModel[] {
        const dialogFields: AddDialogFieldSettingsModel[] = [];
        let fieldItem: AddDialogFieldSettingsModel = {};
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const columnMapping: { [key: string]: string; } = this.parent.columnMapping;
        if (Object.keys(columnMapping).length !== 0) {
            fieldItem.type = 'General';
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('dependency', columnMapping))) {
            fieldItem = {};
            if (this.parent.columnByField[columnMapping.dependency.valueOf()].visible !== false) {
                fieldItem.type = 'Dependency';
            }
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('resourceInfo', columnMapping))) {
            fieldItem = {};
            if (this.parent.columnByField[columnMapping.resourceInfo.valueOf()].visible !== false) {
                fieldItem.type = 'Resources';
            }
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('notes', columnMapping))) {
            fieldItem = {};
            if (this.parent.columnByField[columnMapping.notes.valueOf()].visible !== false) {
                fieldItem.type = 'Notes';
            }
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('segments', taskFields))) {
            fieldItem = {};
            fieldItem.type = 'Segments';
            dialogFields.push(fieldItem);
        }
        if (this.parent.customColumns.length > 0) {
            fieldItem = {};
            fieldItem.type = 'Custom';
            dialogFields.push(fieldItem);
        }
        return dialogFields;
    }
    /**
     * @returns {void} .
     * @private
     */
    public openAddDialog(): void {
        this.isEdit = false;
        this.editedRecord = this.composeAddRecord();
        this.createDialog();
    }
    /**
     *
     * @returns {Date} .
     * @private
     */
    public getMinimumStartDate(): Date {
        let minDate: Date = DataUtil.aggregates.min(this.parent.flatData, 'ganttProperties.startDate');
        if (!isNullOrUndefined(minDate)) {
            minDate = new Date(minDate.getTime());
        } else {
            minDate = new Date(this.parent.timelineModule.timelineStartDate.getTime());
        }
        minDate = this.parent.dateValidationModule.checkStartDate(minDate);
        return new Date(minDate.getTime());
    }

    /**
     * @returns {IGanttData} .
     * @private
     */
    public composeAddRecord(): IGanttData {
        const tempData: IGanttData = {};
        tempData.ganttProperties = {};
        const columns: GanttColumnModel[] = this.parent.ganttColumns;
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const id: number | string = this.parent.editModule.getNewTaskId();
        for (let i: number = 0; i < columns.length; i++) {
            const field: string = columns[i].field;
            if (field === taskSettings.id) {
                tempData[field] = id;
                tempData.ganttProperties.rowUniqueID = tempData[field];
            } else if (columns[i].field === taskSettings.startDate) {
                if (isNullOrUndefined(tempData[taskSettings.endDate])) {
                    tempData[field] = this.getMinimumStartDate();
                } else {
                    tempData[field] = new Date(tempData[taskSettings.endDate]);
                }
                if (this.parent.timezone) {
                    tempData[field] = this.parent.dateValidationModule.remove(tempData[field], this.parent.timezone);
                }
                tempData.ganttProperties.startDate = new Date(tempData[field]);
            } else if (columns[i].field === taskSettings.endDate) {
                if (isNullOrUndefined(tempData[taskSettings.startDate])) {
                    tempData[field] = this.getMinimumStartDate();
                } else {
                    tempData[field] = new Date(tempData[taskSettings.startDate]);
                }
                if (this.parent.timezone) {
                    tempData[field] = this.parent.dateValidationModule.remove(tempData[field], this.parent.timezone);
                }
                tempData.ganttProperties.endDate = new Date(tempData[field]);
            } else if (columns[i].field === taskSettings.duration) {
                tempData[field] = 1;
                tempData.ganttProperties.duration = tempData[field];
                tempData.ganttProperties.durationUnit = this.parent.durationUnit.toLocaleLowerCase();
            } else if (columns[i].field === taskSettings.name) {
                tempData[field] = this.localeObj.getConstant('addDialogTitle')+' '+ id;
                tempData.ganttProperties.taskName = tempData[field];
            } else if (columns[i].field === taskSettings.progress) {
                tempData[field] = 0;
                tempData.ganttProperties.progress = tempData[field];
            } else if (columns[i].field === taskSettings.work) {
                tempData[field] = 0;
                tempData.ganttProperties.work = tempData[field];
            } else if (columns[i].field === taskSettings.type) {
                tempData[field] = this.parent.taskType;
                tempData.ganttProperties.taskType = tempData[field];
            } else {
                tempData[this.parent.ganttColumns[i].field] = '';
            }
        }
        tempData.ganttProperties.isAutoSchedule = (this.parent.taskMode === 'Auto') ? true :
            (this.parent.taskMode === 'Manual') ? false :
                tempData[taskSettings.manual] === true ? false : true;
        return tempData;
    }
    /**
     * @returns {void} .
     * @private
     */
    public openToolbarEditDialog(): void {
        const gObj: Gantt = this.parent;
        if (gObj.editModule && gObj.editSettings.allowEditing) {
            if (this.parent.ganttChartModule.focusedRowIndex > -1 && gObj.selectionModule) {
                gObj.selectionModule.selectRow(this.parent.ganttChartModule.focusedRowIndex, false, false);
            }
            const selectedRowId: number | string = gObj.selectionModule ?
                (gObj.selectionSettings.mode === 'Row' || gObj.selectionSettings.mode === 'Both') &&
                    gObj.selectionModule.selectedRowIndexes.length === 1 ?
                    gObj.updatedRecords[gObj.selectionModule.selectedRowIndexes[0]].ganttProperties.rowUniqueID :
                    gObj.selectionSettings.mode === 'Cell' &&
                        gObj.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        gObj.updatedRecords[gObj.selectionModule.getSelectedRowCellIndexes()[0].rowIndex].ganttProperties.rowUniqueID :
                        null : null;
            if (!isNullOrUndefined(selectedRowId)) {
                this.openEditDialog(selectedRowId);
            }
        }
    }
    /**
     * @param { number | string | object} taskId .
     * @returns {void} .
     * @private
     */
    public openEditDialog(taskId: number | string | object): void {
        const ganttObj: Gantt = this.parent;
        if (!isNullOrUndefined(taskId)) {
            if (!isNullOrUndefined(taskId['ganttProperties'])) {
                if (typeof taskId['ganttProperties']['taskId'] === 'string') {
                    this.numericOrString = "stringedit";
                } else {
                    this.numericOrString = "numericedit";
                }
            }
            if (isNullOrUndefined(taskId['ganttProperties']) && !isNullOrUndefined(taskId)) {
                if (isNaN(Number(taskId)) || this.parent.columnByField[this.parent.taskFields.id].editType === "stringedit") {
                    this.numericOrString = "stringedit";
                } else {
                    this.numericOrString = "numericedit";
                }
            }
        }
        if (typeof taskId === 'object' && !isNullOrUndefined(taskId)) {
            this.rowIndex = this.parent.currentViewData.indexOf(taskId);
            if (this.rowIndex > -1) {
                this.rowData = taskId;
            }
        } else if (!isNullOrUndefined(taskId)) {
            this.rowIndex = ganttObj.ids.indexOf(taskId.toString());
            if (this.rowIndex > -1) {
                this.rowData = ganttObj.flatData[this.rowIndex];
            }
        } else if (ganttObj.selectedRowIndex > -1) {
            this.rowData = ganttObj.currentViewData[ganttObj.selectedRowIndex];
            this.rowIndex = ganttObj.selectedRowIndex;
        }
        this.isEdit = true;
        if (this.parent.viewType === 'ResourceView' && this.rowData.level === 0) {
            return;
        }
        if (Object.keys(this.rowData).length !== 0) {
            this.editedRecord = extend({}, {}, this.rowData, true);
            this.createDialog();
        }
    }

    private createDialog(): void {
        const ganttObj: Gantt = this.parent;
        const dialogModel: DialogModel = {};
        this.beforeOpenArgs.dialogModel = dialogModel;
        this.beforeOpenArgs.rowData = this.editedRecord;
        this.beforeOpenArgs.rowIndex = this.rowIndex;
        const dialogMaxWidth: string = this.parent.isAdaptive ? '' : '600px';
        const dialog: HTMLElement = this.parent.createElement(
            'div', { id: ganttObj.element.id + '_dialog', styles: 'max-width:' + dialogMaxWidth });
	     dialog.classList.add('e-gantt-dialog');
        ganttObj.element.appendChild(dialog);
        dialogModel.animationSettings = { effect: 'None' };
        dialogModel.header = this.localeObj.getConstant(this.isEdit ? 'editDialogTitle' : 'addDialogTitle');
        dialogModel.isModal = true;
        dialogModel.allowDragging = this.parent.isAdaptive ? false : true;
        dialogModel.showCloseIcon = true;
        const position: PositionDataModel = this.parent.isAdaptive ? { X: 'top', Y: 'left' } : { X: 'center', Y: 'center' };
        dialogModel.position = position;
        //dialogModel.width = '750px';
        dialogModel.height = this.parent.isAdaptive ? '100%' : 'auto';
        dialogModel.target = document.body;
        dialogModel.close = this.dialogClose.bind(this);
        dialogModel.closeOnEscape = true;
	dialogModel.beforeClose = function (args){
            if(args.closedBy == "escape"){
                if(args.event.name == "key-pressed" && args.event.target.nodeName == 'INPUT'){
                    args.cancel = true;
                }
            }
        };
        dialogModel.open = (args: Record<string, unknown>) => {
            const dialogElement: HTMLElement = getValue('element', args);
            const generalTabElement: HTMLElement = dialogElement.querySelector('#' + this.parent.element.id + 'GeneralTabContainer');
            if (generalTabElement && generalTabElement.scrollHeight > generalTabElement.offsetHeight) {
                generalTabElement.classList.add('e-scroll');
            }
            if (this.tabObj.selectedItem === 0) {
                this.tabObj.select(0);
            }
            if (this.parent.isAdaptive) {
                dialogElement.style.maxHeight = 'none';
            }
            if (this.parent.focusModule) {
                this.parent.focusModule.setActiveElement(dialogElement);
            }
        };
        dialogModel.locale = this.parent.locale;
        dialogModel.buttons = [{
            buttonModel: {
                content: this.localeObj.getConstant('saveButton'), cssClass: 'e-primary'
            },
            click: this.buttonClick.bind(this)
        }, {
            buttonModel: { cssClass: 'e-flat', content: this.localeObj.getConstant('cancel') },
            click: this.buttonClick.bind(this)
        }];
        this.createTab(dialogModel, dialog);
    }

    private buttonClick(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        target.style.pointerEvents = 'none';
        if ((this.localeObj.getConstant('cancel')).toLowerCase() === (e.target as HTMLInputElement).innerText.trim().toLowerCase()) {
            if (this.dialog && !this.dialogObj.isDestroyed) {
                this.dialogObj.hide();
                this.dialogClose();
            }
        } else {
            this.initiateDialogSave();
            target.style.pointerEvents = 'auto';
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public dialogClose(): void {
        if (this.dialog) {
            this.resetValues();
        }
        if (!isNullOrUndefined(this.parent.focusModule) &&
            !isNullOrUndefined(this.parent.focusModule.getActiveElement(true))) {
            this.parent.focusModule.getActiveElement(true).focus();
        }
    }

    private resetValues(): void {
        this.isEdit = false;
        this.isAddNewResource = false;
        this.editedRecord = {};
        this.rowData = {};
        this.rowIndex = -1;
        this.addedRecord = null;
        this.ganttResources = [];
        this.dialogEditValidationFlag = false;
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.destroyDialogInnerElements();
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    }

    private destroyDialogInnerElements(): void {
        const ganttObj: Gantt = this.parent;
        const tabModel: TabModel = this.beforeOpenArgs.tabModel;
        const items: TabItemModel[] = tabModel.items;
        for (let i: number = 0; i < items.length; i++) {
            const element: HTMLElement = items[i].content as HTMLElement;
            let id: string = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.destroyCustomField(element);
                } else if (id === 'Dependency') {
                    const gridObj: Grid = <Grid>(<EJ2Instance>element).ej2_instances[0];
                    gridObj.destroy();
                } else if (id === 'Notes') {
                    const rte: RichTextEditor = <RichTextEditor>(<EJ2Instance>element).ej2_instances[0];
                    rte.destroy();
                } else if (id === 'Resources') {
                    const treeGridObj: TreeGrid = <TreeGrid>(<EJ2Instance>element).ej2_instances[0];
                    treeGridObj.destroy();
                } else if (id.indexOf('Custom') !== -1) {
                    this.destroyCustomField(element);
                }
            }
        }
    }

    private destroyCustomField(element: HTMLElement): void {
        const childNodes: NodeList = element.childNodes;
        const ganttObj: Gantt = this.parent;
        for (let i: number = 0; i < childNodes.length; i++) {
            const div: HTMLElement = childNodes[i] as HTMLElement;
            const inputElement: HTMLInputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                const fieldName: string = inputElement.id.replace(ganttObj.element.id, '');
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const controlObj: any = <any>(<EJ2Instance>div.querySelector('#' + ganttObj.element.id + fieldName)).ej2_instances[0];
                if (!isNullOrUndefined(controlObj)) {
                    const column: GanttColumnModel = ganttObj.columnByField[fieldName];
                    if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
                        let destroy: Function = column.edit.destroy as Function;
                        if (typeof destroy === 'string') {
                            destroy = getObject(destroy, window);
                            destroy();
                        } else {
                            (column.edit.destroy as () => void)();
                        }
                    } else {
                        controlObj.destroy();
                    }
                }
            }
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.resetValues();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('chartDblClick', this.dblClickHandler);
        this.parent.editModule.dialogModule = undefined;
    }
    /**
     * Method to get current edit dialog fields value
     *
     * @returns {AddDialogFieldSettings} .
     */
    private getEditFields(): AddDialogFieldSettingsModel[] {
        if (this.isEdit) {
            return this.updatedEditFields;
        } else {
            return this.updatedAddFields;

        }
    }
    private createTab(dialogModel: DialogModel, dialog: HTMLElement): void {
        const ganttObj: Gantt = this.parent;
        const tabModel: TabModel = {}; const tabItems: TabItemModel[] = [];
        const dialogSettings: AddDialogFieldSettingsModel[] = this.getEditFields();
        let tabElement: HTMLElement;
        const tasks: TaskFieldsModel = ganttObj.taskFields;
        const length: number = dialogSettings.length;
        tabModel.items = tabItems;
        tabModel.locale = this.parent.locale;
        this.beforeOpenArgs.tabModel = tabModel;
        let count: number = 0; let index: number = 0;
        if (length > 0) {
            for (let i: number = 0; i < length; i++) {
                const dialogField: AddDialogFieldSettingsModel = dialogSettings[i];
                const tabItem: TabItemModel = {};
                if (dialogField.type === 'General') {
                    if (Object.keys(ganttObj.columnMapping).length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('generalTab');
                    }
                    tabItem.content = 'General';
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
                } else if (dialogField.type === 'Segments') {
                    if (isNullOrUndefined(tasks.segments)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('segments');
                    }
                    tabItem.content = 'Segments';
                    this.beforeOpenArgs[tabItem.content] = this.getSegmentsModel(dialogField.fields);
                } else if (dialogField.type === 'Dependency') {
                    if (isNullOrUndefined(tasks.dependency)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('dependency');
                    }
                    tabItem.content = 'Dependency';
                    this.beforeOpenArgs[tabItem.content] = this.getPredecessorModel(dialogField.fields);
                } else if (dialogField.type === 'Resources') {
                    if (isNullOrUndefined(tasks.resourceInfo)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('resourceName');
                    }
                    tabItem.content = 'Resources';
                    this.beforeOpenArgs[tabItem.content] = this.getResourcesModel(dialogField.fields);
                } else if (dialogField.type === 'Notes') {
                    if (isNullOrUndefined(tasks.notes)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('notes');
                    }
                    tabItem.content = 'Notes';
                    this.beforeOpenArgs[tabItem.content] = this.getNotesModel(dialogField.fields);
                } else {
                    if (isNullOrUndefined(dialogField.fields) || dialogField.fields.length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('customTab');   // eslint-disable-next-line
                        count++;
                    }
                    tabItem.content = 'Custom' + '' + index++;
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
                }
                tabItem.header = { text: dialogField.headerText };
                tabItems.push(tabItem);
            }
        }
        this.beforeOpenArgs.requestType = this.isEdit ? 'beforeOpenEditDialog' : 'beforeOpenAddDialog';
        const args: ActionBeginArgs = {
            rowData: this.beforeOpenArgs.rowData as IGanttData,
            name: this.beforeOpenArgs.name as string,
            requestType: this.beforeOpenArgs.requestType as string,
            cancel: this.beforeOpenArgs.cancel as boolean
        };
        this.parent.trigger('actionBegin', this.beforeOpenArgs, (arg: ActionBeginArgs | CObject) => {
            this.renderTabItems();
            if (!arg.cancel) {
                tabModel.selected = this.tabSelectedEvent.bind(this);
                tabModel.height = this.parent.isAdaptive ? '100%' : 'auto';
                tabModel.overflowMode = 'Scrollable';
                this.tabObj = new Tab(tabModel);
                this.tabObj.isStringTemplate = true;
                tabElement = this.parent.createElement('div', { id: ganttObj.element.id + '_Tab' });
                this.tabObj.appendTo(tabElement);
                dialogModel.content = tabElement;
                this.dialog = dialog;
                this.dialogObj = new Dialog(dialogModel);
                this.dialogObj.isStringTemplate = true;
                this.dialogObj.appendTo(this.dialog);
                const actionCompleteArgs: CObject = {
                    action: 'OpenDialog',
                    requestType: this.isEdit ? 'openEditDialog' : 'openAddDialog',
                    data: this.beforeOpenArgs.rowData,
                    element: this.dialog,
                    cancel: false
                };
                this.parent.trigger('actionComplete', actionCompleteArgs, (actionCompleteArg: CObject) => {
                    if (actionCompleteArg.cancel) {
                        this.resetValues();
                    }
                });
            }
        });
    }

    private tabSelectedEvent(args: SelectEventArgs): void {
        const ganttObj: Gantt = this.parent;
        const id: string = (args.selectedContent.childNodes[0] as HTMLElement).id;
        if (this.parent.isAdaptive) {
            this.responsiveTabContent(id, ganttObj);
        }
        if (id === ganttObj.element.id + 'ResourcesTabContainer') {
            this.resourceSelection(id);
        } else if (id === ganttObj.element.id + 'NotesTabContainer') {
            ((<EJ2Instance>document.getElementById(id)).ej2_instances[0] as RichTextEditor).refresh();
	    let notesTabElement: HTMLElement = document.querySelector('#' + this.parent.element.id + 'NotesTabContainer') as HTMLInputElement;
            notesTabElement.style.overflow = 'scroll';
        } else if (id === ganttObj.element.id + 'SegmentsTabContainer') {
            if (isNullOrUndefined((this.beforeOpenArgs.rowData as IGanttData).ganttProperties.startDate)) {
                ((<EJ2Instance>document.getElementById(id)).ej2_instances[0] as Grid)
                    .enableToolbarItems([this.parent.element.id + 'SegmentsTabContainer' + '_add'], false);
            } else {
                ((<EJ2Instance>document.getElementById(id)).ej2_instances[0] as Grid)
                    .enableToolbarItems([this.parent.element.id + 'SegmentsTabContainer' + '_add'], true);
            }

        }
    }

    private responsiveTabContent(id: string, ganttObj: Gantt): void {
        const dialogContent: HTMLElement = document.getElementById(ganttObj.element.id + '_dialog_dialog-content');
        let dialogContentHeight: number = dialogContent.clientHeight;
        dialogContentHeight -= (dialogContent.querySelector('.e-tab-header') as HTMLElement).offsetHeight;
        const grid: HTMLElement = document.querySelector('#' + id);
        if (grid.classList.contains('e-grid')) {
            dialogContentHeight -= (((grid as EJ2Instance).ej2_instances[0] as Grid).getHeaderContent() as HTMLElement).offsetHeight;
            const toolbar: HTMLElement = grid.querySelector('.e-toolbar');
            if (toolbar) {
                dialogContentHeight -= toolbar.offsetHeight;
            }
        }
        grid.parentElement.style.height = dialogContentHeight + 'px';
    }

    private getFieldsModel(fields: string[]): Record<string, unknown> {
        const fieldsModel: Record<string, unknown> = {};
        const columnByField: Object = this.parent.columnByField;
        for (let i: number = 0; i < fields.length; i++) {
            if (fields[i] === this.parent.taskFields.dependency ||
                fields[i] === this.parent.taskFields.resourceInfo ||
                fields[i] === this.parent.taskFields.notes) {
                continue;
            }
            if (!isNullOrUndefined(columnByField[fields[i]])) {
                const fieldName: string = fields[i];
                this.createInputModel(columnByField[fieldName], fieldsModel);
            }
        }
        return fieldsModel;
    }
    private createInputModel(column: GanttColumnModel, fieldsModel: object): object {
        const ganttObj: Gantt = this.parent;
        const locale: string = this.parent.locale;
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const common: Object = {
            placeholder: column.headerText,
            floatLabelType: 'Auto'
        };
        if(!isNullOrUndefined(this.parent.taskFields.id) && !isNullOrUndefined(this.parent.columnMapping.id)
        && !isNullOrUndefined(this.numericOrString) ){
            if(taskSettings.id === column.field) {
                column.editType = this.numericOrString;
            }
        };
        switch (column.editType) {
        case 'booleanedit':
        {
            const checkboxModel: CheckBoxModel = {
                label: column.headerText,
                locale: locale
            };
            fieldsModel[column.field] = checkboxModel;
            break;
        }
        case 'defaultedit':        
        case 'stringedit':
        {
            const textBox: TextBox = common as TextBox;
            if (column.field === ganttObj.columnMapping.duration || column.field === ganttObj.columnMapping.id || column.field === ganttObj.columnMapping.startDate ||
                    column.field === ganttObj.columnMapping.endDate) {
                textBox.change = (args: CObject): void => {
                    this.validateScheduleFields(args, column, ganttObj);
                };
            }
            fieldsModel[column.field] = common;
            break;
        }
        case 'numericedit':
        {
            const numeric: NumericTextBoxModel = <NumericTextBoxModel>common;
            if (taskSettings.progress === column.field) {
                numeric.min = 0;
                numeric.max = 100;
            }
            if (taskSettings.work === column.field) {
                numeric.change = (args: CObject): void => {
                    this.validateScheduleFields(args, column, ganttObj);
                };
            }
            fieldsModel[column.field] = numeric;
            break;
        }
        case 'datepickeredit':
        {
            const datePickerObj: DatePickerModel = common as DatePickerModel;
            datePickerObj.format = this.parent.getDateFormat();
            datePickerObj.strictMode = true;
            datePickerObj.firstDayOfWeek = ganttObj.timelineModule.customTimelineSettings.weekStartDay;
            if (column.field === ganttObj.columnMapping.startDate ||
                    column.field === ganttObj.columnMapping.endDate) {
                datePickerObj.renderDayCell = this.parent.renderWorkingDayCell.bind(this.parent);
                datePickerObj.change = (args: CObject): void => {
                    this.validateScheduleFields(args, column, ganttObj);
                };
            }
            fieldsModel[column.field] = datePickerObj;
            break;
        }
        case 'datetimepickeredit':
        {
            const dateTimePickerObj: DatePickerModel = common as DatePickerModel;
            dateTimePickerObj.format = this.parent.getDateFormat();
            dateTimePickerObj.strictMode = true;
            dateTimePickerObj.firstDayOfWeek = ganttObj.timelineModule.customTimelineSettings.weekStartDay;
            if (column.field === ganttObj.columnMapping.startDate ||
                    column.field === ganttObj.columnMapping.endDate) {
                dateTimePickerObj.renderDayCell = this.parent.renderWorkingDayCell.bind(this.parent);
                dateTimePickerObj.change = (args: CObject): void => {
                    this.validateScheduleFields(args, column, ganttObj);
                };
            }
            fieldsModel[column.field] = dateTimePickerObj;
            break;
        }
        case 'dropdownedit':
            if (column.field === ganttObj.columnMapping.type || column.field === ganttObj.columnMapping.manual) {
                const dataKey: string = 'dataSource';
                const fieldsKey: string = 'fields';
                const types: Record<string, unknown>[] = [
                    { 'ID': 1, 'Value': 'FixedUnit' }, { 'ID': 2, 'Value': 'FixedWork' }, { 'ID': 3, 'Value': 'FixedDuration' }];
                common[dataKey] = types;
                common[fieldsKey] = { value: 'Value' };
                const dropDownListObj: DropDownListModel = common as DropDownListModel;
                dropDownListObj.change = (args: CObject | ChangeEventArgs): void => {
                    if (column.field === taskSettings.manual) {
                        this.editedRecord.ganttProperties.isAutoSchedule = !args.value;
                    }
                    this.validateScheduleFields(args as CObject, column, ganttObj);
                };
            }
            fieldsModel[column.field] = common;
            break;
        case 'maskededit':
            fieldsModel[column.field] = common;
            break;
        }
        if (!isNullOrUndefined(column.edit) && !isNullOrUndefined(column.edit.params)) {
            extend(fieldsModel[column.field], column.edit.params);
        }
        return fieldsModel;
    }

    private validateScheduleFields(args: CObject, column: GanttColumnModel, ganttObj: Gantt): boolean {
        let dialog: HTMLElement;
        if (!isNullOrUndefined(ganttObj.editModule.dialogModule.dialog)) {
            dialog = ganttObj.editModule.dialogModule.dialog;
        }
        let targetId: string = null; let inputElement: HTMLInputElement;
        const currentData: IGanttData = ganttObj.editModule.dialogModule.editedRecord;
        let cellValue: string = null;
        let colName: string = null;
        let formObject:FormValidator;
        const ids: string[] = this.parent.viewType === 'ResourceView' ? this.parent.getTaskIds() : this.parent.ids;
        const strViewType: string = this.parent.viewType;      
        if (!isNullOrUndefined(args.element)) {
            inputElement = args.element as HTMLInputElement;
            targetId = inputElement.getAttribute('id');
        } else if (!isNullOrUndefined(args.container)) {
            inputElement = args.container as HTMLInputElement;
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId);
        } else if (!isNullOrUndefined(args.event) && !isNullOrUndefined((args.event as CObject).path[1])) {
            inputElement = (args.event as CObject).path[1] as HTMLInputElement;
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId);
        }
        if (isNullOrUndefined(inputElement)) {
            cellValue = args.value as string;
            colName = column.field;
        } else {
            cellValue = inputElement.value;
            colName = targetId.replace(ganttObj.element.id, '');
            if (this.parent.columnByField[this.parent.taskFields.id].editType === "stringedit") {
                let customFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
                    if (strViewType === 'ResourceView') {
                        return ids.indexOf('T' + args['value']) === -1 && ids.indexOf('R' + args['value']) === -1 ;
                    } else {
                        return ids.indexOf(args['value']) === -1;
                    }
                };
                let options: FormValidatorModel = {
                    rules: {
                        [this.parent.taskFields.id]: { required: true, minLength: [customFn, 'ID is already present, please enter new value']}
                    }
                }
                formObject = new FormValidator('#'+this.parent.element.id+'GeneralTabContainer', options);
            } 
        }
        if (colName.search('Segments') === 0) {
            colName = colName.replace('SegmentsTabContainer', '');
            this.validateSegmentFields(ganttObj, colName, cellValue, args);
            return true;
        } else {
            this.validateScheduleValuesByCurrentField(colName, cellValue, this.editedRecord);
            const ganttProp: ITaskData = currentData.ganttProperties;
            const tasks: TaskFieldsModel = ganttObj.taskFields;
            if (!isNullOrUndefined(tasks.startDate) && tasks.startDate !== colName) {
                this.updateScheduleFields(dialog, ganttProp, 'startDate');
            }
            if (!isNullOrUndefined(tasks.endDate) && tasks.endDate !== colName) {
                this.updateScheduleFields(dialog, ganttProp, 'endDate');
            }
            if (!isNullOrUndefined(tasks.duration) && tasks.duration !== colName) {
                this.updateScheduleFields(dialog, ganttProp, 'duration');
            }
            if (!isNullOrUndefined(tasks.work) && tasks.work !== colName) {
                this.updateScheduleFields(dialog, ganttProp, 'work');
            }
            this.dialogEditValidationFlag = false;
            return true;
        }
    }

    private updateScheduleFields(dialog: HTMLElement, ganttProp: ITaskData, ganttField: string): void {
        const ganttObj: Gantt = this.parent;
        const ganttId: string = ganttObj.element.id;
        const columnName: string = getValue(ganttField, ganttObj.columnMapping);
        const col: GanttColumnModel = ganttObj.columnByField[columnName];
        let tempValue: string | Date | number;
        const taskField: TaskFieldsModel = this.parent.taskFields;
        if (col.editType === 'stringedit') {
            const textBox: TextBox = <TextBox>(<EJ2Instance>dialog.querySelector('#' + ganttId + columnName)).ej2_instances[0];
            tempValue = !isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read) ? (col.edit.read as () => void)() :
                !isNullOrUndefined(col.valueAccessor) ? (col.valueAccessor as Function) (columnName, ganttObj.editModule.dialogModule.editedRecord, col) :   // eslint-disable-line
                    this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
            if (textBox.value !== tempValue.toString() && taskField.duration === columnName) {
                textBox.value = tempValue as string;
                textBox.dataBind();
            } else if (taskField.startDate === columnName || taskField.endDate === columnName) {
                textBox.value = taskField.startDate === columnName ? ganttProp.startDate.toString() : ganttProp.endDate.toString();
                textBox.dataBind();
            }
        } else if (col.editType === 'datepickeredit' || col.editType === 'datetimepickeredit') {
            const picker: DatePicker = col.editType === 'datepickeredit' ?
                <DatePicker>(<EJ2Instance>dialog.querySelector('#' + ganttId + columnName)).ej2_instances[0] :
                <DateTimePicker>(<EJ2Instance>dialog.querySelector('#' + ganttId + columnName)).ej2_instances[0];
            tempValue = ganttProp[ganttField];
            if (((isNullOrUndefined(picker.value)) && !isNullOrUndefined(tempValue)) ||
                (isNullOrUndefined(tempValue) && !isNullOrUndefined(picker.value)) ||
                (picker.value !== tempValue && !isNullOrUndefined(picker.value) && !isNullOrUndefined(tempValue)
                    && picker.value.toString() !== tempValue.toString())) {
                picker.value = tempValue as Date;
                picker.dataBind();
            }
        } else if (col.editType === 'numericedit') {
            const numericTextBox: NumericTextBox = <NumericTextBox>(
                <EJ2Instance>dialog.querySelector('#' + ganttId + columnName)).ej2_instances[0];
            tempValue = ganttProp[ganttField];
            if (!isNullOrUndefined(tempValue) && numericTextBox.value !== tempValue) {
                numericTextBox.value = tempValue as number;
                numericTextBox.dataBind();
            }
        }
    }

    /**
     * @param {IGanttData} ganttData .
     * @returns {void} .
     * @private
     */
    public validateDuration(ganttData: IGanttData): void {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.duration)) {
                this.parent.setRecordValue('endDate', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            } else if (isScheduledTask(ganttProp) || !isNullOrUndefined(ganttProp.startDate)) {
                if (ganttData.ganttProperties.isMilestone && ganttData.ganttProperties.duration !== 0) {
                    this.parent.dateValidationModule.checkStartDate(ganttProp.startDate);
                }
                this.parent.dateValidationModule.calculateEndDate(ganttData);
            } else if (!isScheduledTask(ganttProp) && !isNullOrUndefined(ganttProp.endDate)) {
                this.parent.dateValidationModule.calculateStartDate(ganttData);
            }
            const milestone: boolean = ganttProp.duration === 0 ? true : false;
            this.parent.setRecordValue('isMilestone', milestone, ganttProp, true);
            this.dialogEditValidationFlag = true;
        }
    }
    private validateStartDate(ganttData: IGanttData): void {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        const tasks: TaskFieldsModel = this.parent.taskFields;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.startDate)) {
                this.parent.setRecordValue('duration', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
                if (this.parent.allowUnscheduledTasks && isNullOrUndefined(tasks.endDate)) {
                    this.parent.setRecordValue('endDate', null, ganttProp, true);
                }
            } else if (isScheduledTask(ganttProp)) {
                if (isNullOrUndefined(tasks.duration)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                } else if (isNullOrUndefined(tasks.endDate)) {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                } else {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
            } else {
                if (!isNullOrUndefined(ganttProp.endDate)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                } else if (!isNullOrUndefined(ganttProp.duration)) {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
            }
            this.dialogEditValidationFlag = true;
        }
    }
    private validateEndDate(ganttData: IGanttData): void {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        const tasks: TaskFieldsModel = this.parent.taskFields;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.endDate)) {
                this.parent.setRecordValue('duration', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            } else if (isScheduledTask(ganttProp)) {
                if (isNullOrUndefined(tasks.duration)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                } else if (isNullOrUndefined(ganttProp.startDate)) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                } else {
                    if (!isNullOrUndefined(ganttProp.segments) && ganttProp.segments.length > 0) {
                        ganttProp.segments = this.parent.editModule.cellEditModule.validateEndDateWithSegments(ganttProp);
                    }
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
            } else {
                if (!isNullOrUndefined(ganttProp.duration)) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                } else if (!isNullOrUndefined(ganttProp.startDate)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
            }
            this.dialogEditValidationFlag = true;
        }
    }
    /**
     *
     * @param {string} columnName .
     * @param {string} value .
     * @param {IGanttData} currentData .
     * @returns {boolean} .
     * @private
     */
    public validateScheduleValuesByCurrentField(columnName: string, value: string, currentData: IGanttData): boolean {
        const ganttObj: Gantt = this.parent;
        const ganttProp: ITaskData = currentData.ganttProperties;
        const taskSettings: TaskFieldsModel = ganttObj.taskFields;
        if (taskSettings.duration === columnName) {
            if (!isNullOrUndefined(value) && value !== '') {
                ganttObj.dataOperation.updateDurationValue(value, ganttProp);
            } else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('duration', null, ganttProp, true);
                }
            }
            this.validateDuration(currentData);
            this.parent.editModule.updateResourceRelatedFields(currentData, 'duration');
        }
        if (taskSettings.startDate === columnName) {
            if (value !== '') {
                let startDate: Date = this.parent.dateValidationModule.getDateFromFormat(value);
                startDate = this.parent.dateValidationModule.checkStartDate(startDate, ganttProp);
                this.parent.setRecordValue('startDate', startDate, ganttProp, true);
            } else {
                if (ganttObj.allowUnscheduledTasks && !(currentData.hasChildRecords)) {
                    this.parent.setRecordValue('startDate', null, ganttProp, true);
                }
            }
            this.validateStartDate(currentData);
        }
        if (taskSettings.endDate === columnName) {
            if (value !== '') {
                let endDate: Date = this.parent.dateValidationModule.getDateFromFormat(value);
                if (endDate.getHours() === 0 && ganttObj.defaultEndTime !== 86400) {
                    this.parent.dateValidationModule.setTime(ganttObj.defaultEndTime, endDate);
                }
                endDate = this.parent.dateValidationModule.checkEndDate(endDate, ganttProp);
                if (isNullOrUndefined(ganttProp.startDate) || endDate.getTime() > (ganttProp.startDate).getTime()) {
                    this.parent.setRecordValue('endDate', endDate, ganttProp, true);
                }
            } else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('endDate', null, ganttProp, true);
                }
            }
            this.validateEndDate(currentData);
        }
        if (taskSettings.work === columnName) {
            if (!isNullOrUndefined(value) && value !== '') {
                this.parent.setRecordValue('work', value, ganttProp, true);
                this.parent.editModule.updateResourceRelatedFields(currentData, 'work');
                this.validateDuration(currentData);
            }
        }
        if (columnName === taskSettings.type) {
            this.parent.setRecordValue('taskType', value, ganttProp, true);
        }
        if (taskSettings.manual === columnName) {
            this.parent.editModule.updateTaskScheduleModes(currentData);
        }
        return true;
    }
    private getSegmentsModel(fields: string[]): Object {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = [];
            if (!isNullOrUndefined(taskSettings.startDate)) {
                fields.push('startDate');
            }
            if (!isNullOrUndefined(taskSettings.endDate)) {
                fields.push('endDate');
            }
            if (!isNullOrUndefined(taskSettings.duration)) {
                fields.push('duration');
            }
        }
        const segmentInputModel: GridModel = {};
        segmentInputModel.editSettings = {
            allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Bottom'
        };
        segmentInputModel.locale = this.parent.locale;
        segmentInputModel.dataSource = [];
        segmentInputModel.rowHeight = this.parent.isAdaptive ? 48 : null;
        segmentInputModel.toolbar = [
            {
                id: this.parent.element.id + 'SegmentsTabContainer' + '_add', prefixIcon: 'e-add',
                tooltipText: this.localeObj.getConstant('add'), align: 'Right',
                text: this.parent.isAdaptive ? '' : this.localeObj.getConstant('add')
            },
            {
                id: this.parent.element.id + 'SegmentsTabContainer' + '_delete', prefixIcon: 'e-delete',
                tooltipText: this.localeObj.getConstant('delete'), align: 'Right',
                text: this.parent.isAdaptive ? '' : this.localeObj.getConstant('delete')
            }
        ];
        const gridColumns: GridColumnModel[] = [];
        for (let i: number = 0; i < fields.length; i++) {
            let gridColumn: GridColumnModel = {};
            const generalTabString: string = 'General';
            switch (fields[i]) {
            case 'startDate':
            case 'endDate':
                gridColumn = {
                    field: fields[i], headerText: this.localeObj.getConstant(fields[i]), editType: 'stringedit', width: '200px',
                    edit: {
                        write: (args: CObject): void => {
                            let datePickerModel: object;
			    if (!isNullOrUndefined(this.beforeOpenArgs[generalTabString])) {
                                datePickerModel = this.beforeOpenArgs[generalTabString][this.parent.taskFields[fields[i]]];
                            } else {
                                let columnFields: string[] = this.getGeneralColumnFields();
                                let columnModel: object = this.getFieldsModel(columnFields);
                                datePickerModel = columnModel[this.parent.taskFields[fields[i]]];
                            }
			    const value: string = args.rowData[(args.column as GridColumnModel).field];
                            setValue('value', value, datePickerModel);
		            const datePicker: DatePicker = new this.inputs[this.parent.columnByField[this.parent.taskFields[fields[i]]].editType](datePickerModel);
                            datePicker.appendTo(args.element as HTMLElement);
                        },
                        read: (args: HTMLElement): Date => {
                            const ej2Instance: DatePickerModel =
                                    <CObject>(<EJ2Instance>args).ej2_instances[0];
                            return ej2Instance.value as Date;
                        }

                    },
                    format: this.parent.getDateFormat()
                };
                if (fields[i] === 'startDate') {
                    gridColumn.validationRules = { required: true };
                }
                gridColumns.push(gridColumn);
                break;
            case 'duration':
                gridColumn = {
                    field: fields[i], headerText: this.localeObj.getConstant(fields[i]), editType: 'stringedit', width: '100px',
                    edit: {
                        write: (args: CObject): void => {
                            let inputTextModel: object;
                            if (!isNullOrUndefined(this.beforeOpenArgs[generalTabString])) {
                             inputTextModel = this.beforeOpenArgs[generalTabString][this.parent.taskFields[fields[i]]];
                            } else {
                                let columnFields: string[] = this.getGeneralColumnFields();
                                let columnModel: object = this.getFieldsModel(columnFields);
                                inputTextModel = columnModel[this.parent.taskFields[fields[i]]];
                            }
			    (inputTextModel as TextBox).floatLabelType = 'Never';
                            const value: string = args.rowData[(args.column as GridColumnModel).field];
                            if (!isNullOrUndefined(value)) {
                                setValue('value', value, inputTextModel);
                            } else {
                                setValue('value', null, inputTextModel);
                            }
                            setValue('value', value, inputTextModel);
                            const inputModel: TextBox = new TextBox(inputTextModel);
                            inputModel.appendTo(args.element as HTMLElement);
                        },
                        read: (args: HTMLElement): string => {
                            const ej2Instance: TextBoxModel =
                                <CObject>(<EJ2Instance>args).ej2_instances[0];
                            return ej2Instance.value.toString();
                        }
                    }
                };
                gridColumns.push(gridColumn);
                break;
            }
        }
        segmentInputModel.columns = gridColumns;
        segmentInputModel.height = this.parent.isAdaptive ? '100%' : '153px';
        return segmentInputModel;
    }
    private getGridColumnByField(fieldName: string, columns: GridColumnModel[]): GridColumnModel {
        let column: GridColumnModel;
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[i].field === fieldName) {
                column = columns[i];
            }
        }
        return column;
    }
    private updateSegmentField(columnName: string, args: CObject, segment: ITaskSegment): void {
        const dialog: HTMLElement = this.parent.editModule.dialogModule.dialog;
        const gridModel: GridModel = getValue('Segments', this.beforeOpenArgs) as GridModel;
        const col: GridColumnModel = this.getGridColumnByField(columnName, gridModel.columns as GridColumnModel[]);
        const ganttId: string = this.parent.element.id;
        const tempValue: string | Date | number = segment[columnName];
        let inputValue: TextBox | DatePicker;

        if (col.editType === 'stringedit') {
            inputValue = <TextBox>(<EJ2Instance>dialog.querySelector('#' + ganttId + 'SegmentsTabContainer' + columnName))
                .ej2_instances[0] as TextBox;
        } else if (col.editType === 'datepickeredit') {
            inputValue = <DatePicker>(<EJ2Instance>dialog.querySelector('#' + ganttId + 'SegmentsTabContainer' + columnName))
                .ej2_instances[0] as DatePicker;
        }
        if (inputValue.value.toString() !== tempValue.toString()) {
            inputValue.value = tempValue as string;
            inputValue.dataBind();
        }
    }
    private validateSegmentFields(ganttObj: Gantt, columnName: string, cellValue: string, args: CObject): void {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        if (!isNullOrUndefined(taskSettings.duration) && taskSettings.duration.toLowerCase() === columnName.toLowerCase()) {
            if (!isNullOrUndefined(cellValue) && cellValue !== '') {
                this.selectedSegment.duration = Number(cellValue);
                let endDate: Date = ganttObj.dataOperation.getEndDate(
                    this.selectedSegment.startDate, Number(cellValue), this.editedRecord.ganttProperties.durationUnit,
                    this.editedRecord.ganttProperties, false
                );
                endDate = ganttObj.dataOperation.checkEndDate(endDate, this.editedRecord.ganttProperties, false);
                this.selectedSegment.endDate = endDate;
            }
        }
        if (!isNullOrUndefined(taskSettings.startDate) && taskSettings.startDate.toLowerCase() === columnName.toLowerCase()) {
            if (cellValue !== '') {
                let startDate: Date = this.parent.dateValidationModule.getDateFromFormat(cellValue);
                startDate = this.parent.dateValidationModule.checkStartDate(startDate);
                this.selectedSegment.startDate = startDate;

                if (!isNullOrUndefined(taskSettings.endDate)) {
                    this.selectedSegment.endDate = this.parent.dataOperation.getEndDate(
                        startDate, this.selectedSegment.duration, this.editedRecord.ganttProperties.durationUnit,
                        this.editedRecord.ganttProperties, false
                    );
                }
            }
        }
        if (!isNullOrUndefined(taskSettings.endDate) && taskSettings.endDate.toLowerCase() === columnName.toLowerCase()) {
            if (cellValue !== '') {
                let endDate: Date = this.parent.dateValidationModule.getDateFromFormat(cellValue);
                if (endDate.getHours() === 0 && ganttObj.defaultEndTime !== 86400) {
                    this.parent.dateValidationModule.setTime(ganttObj.defaultEndTime, endDate);
                }
                endDate = this.parent.dateValidationModule.checkEndDate(endDate, this.editedRecord.ganttProperties);
                this.selectedSegment.endDate = endDate;
                this.selectedSegment.duration = this.parent.dataOperation.getDuration(
                    this.selectedSegment.startDate, this.selectedSegment.endDate, this.editedRecord.ganttProperties.durationUnit,
                    true, false, true
                );
            }
        }
        if (!isNullOrUndefined(taskSettings.startDate)) {
            this.updateSegmentField('startDate', args, this.selectedSegment);
        }
        if (!isNullOrUndefined(taskSettings.endDate)) {
            this.updateSegmentField('endDate', args, this.selectedSegment);
        }
        if (!isNullOrUndefined(taskSettings.duration)) {
            this.updateSegmentField('duration', args, this.selectedSegment);
        }
    }
    private getPredecessorModel(fields: string[]): Object {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['ID', 'Name', 'Type', 'Offset', 'UniqueId'];
        }
        const inputModel: GridModel = {};
        inputModel.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
        inputModel.locale = this.parent.locale;
        inputModel.dataSource = [];
        inputModel.rowHeight = this.parent.isAdaptive ? 48 : null;
        inputModel.toolbar = [
            {
                id: this.parent.element.id + 'DependencyTabContainer' + '_add', prefixIcon: 'e-add',
                tooltipText: this.localeObj.getConstant('add'), align: 'Right',
                text: this.parent.isAdaptive ? '' : this.localeObj.getConstant('add')
            },
            {
                id: this.parent.element.id + 'DependencyTabContainer' + '_delete', prefixIcon: 'e-delete',
                tooltipText: this.localeObj.getConstant('delete'), align: 'Right',
                text: this.parent.isAdaptive ? '' : this.localeObj.getConstant('delete')
            }
        ];
        const columns: GridColumnModel[] = [];
        for (let i: number = 0; i < fields.length; i++) {
            let column: GridColumnModel = {};
            if (fields[i].toLowerCase() === 'id') {
                column = {
                    field: 'id', headerText: this.localeObj.getConstant('id'), allowEditing: false, width: '70px'
                };
                columns.push(column);
            } else if (fields[i].toLowerCase() === 'name') {
                column = {
                    field: 'name', headerText: this.localeObj.getConstant('name'), editType: 'stringedit', width: '250px',
                    validationRules: { required: true }
                };
                columns.push(column);
            } else if (fields[i].toLowerCase() === 'type') {
                column = {
                    field: 'type', headerText: this.localeObj.getConstant('type'), editType: 'dropdownedit',
                    dataSource: this.types, foreignKeyField: 'id', foreignKeyValue: 'text',
                    defaultValue: 'FS', validationRules: { required: true }, width: '150px'
                };
                columns.push(column);
            } else if (fields[i].toLowerCase() === 'offset') {
                column = {
                    field: 'offset', headerText: this.localeObj.getConstant('offset'), editType: 'stringedit',
                    defaultValue: this.parent.dataOperation.getDurationString(
                        0, (this.beforeOpenArgs.rowData as IGanttData).ganttProperties.durationUnit),
                    validationRules: { required: true }, width: '100px'
                };
                columns.push(column);
            } else if (fields[i].toLowerCase() === 'uniqueid') {
                column = {
                    field: 'uniqueId', isPrimaryKey: true, visible: false, defaultValue: getUid().toString()
                };
                columns.push(column);
            }
        }
        inputModel.columns = columns;
        inputModel.height = this.parent.isAdaptive ? '100%' : '153px';
        return inputModel;
    }
    private getResourcesModel(fields: string[]): Object {
        const ganttObj: Gantt = this.parent;
        const resourceSettings: ResourceFieldsModel = ganttObj.resourceFields;
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = [resourceSettings.id, resourceSettings.name, resourceSettings.unit, resourceSettings.group];
        }

        const inputModel: TreeGridModel = {
            allowFiltering: true,
            treeColumnIndex: -1,
            childMapping: '',
            editSettings: { allowEditing: true, mode: 'Cell' },
            locale: this.parent.locale,
            allowSelection: true,
            rowHeight: this.parent.isAdaptive ? 48 : null,
            filterSettings: { type: 'Menu' },
            selectionSettings: { checkboxOnly: true, checkboxMode: 'Default', persistSelection: true, type: 'Multiple' }
        };
        const columns: TreeGridColumnModel[] = [
            { type: 'checkbox', allowEditing: false, allowSorting: false, allowFiltering: false, width: 60 }
        ];
        for (let i: number = 0; i < fields.length; i++) {
            let column: TreeGridColumnModel = {};
            if (fields[i] === resourceSettings.id) {
                column = {
                    field: resourceSettings.id,
                    headerText: this.localeObj.getConstant('id'), isPrimaryKey: true, width: '100px',
                    allowEditing: false
                };
                columns.push(column);
            } else if (fields[i] === resourceSettings.name) {
                column = {
                    field: resourceSettings.name, headerText: this.localeObj.getConstant('name'),
                    allowEditing: false
                };
                columns.push(column);
            } else if (fields[i] === resourceSettings.unit) {
                column = {
                    field: resourceSettings.unit,
                    headerText: this.localeObj.getConstant('unit'),
                    editType: 'numericedit',
                    edit: { params: { min: 0 } }
                };
                columns.push(column);
            } else if (fields[i] === resourceSettings.group && !isNullOrUndefined(resourceSettings.group)) {
                column = {
                    field: resourceSettings.group,
                    headerText: this.localeObj.getConstant('group'),
                    allowEditing: false
                };
                columns.push(column);
            }
        }
        inputModel.columns = columns;
        inputModel.height = this.parent.isAdaptive ? '100%' : '196px';
        return inputModel;
    }

    private getNotesModel(fields: string[]): Object {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['Bold', 'Italic', 'Underline', 'StrikeThrough',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                'LowerCase', 'UpperCase', '|',
                'Alignments', 'OrderedList', 'UnorderedList',
                'Outdent', 'Indent', '|', 'CreateTable',
                'CreateLink', '|', 'ClearFormat', 'Print',
                '|', 'Undo', 'Redo'];
        }
        const inputModel: RichTextEditorModel = {
            placeholder: this.localeObj.getConstant('writeNotes'),
            toolbarSettings: {
                items: fields
            },
            height: this.parent.isAdaptive ? '100%' : 'auto',
            locale: this.parent.locale
        };
        return inputModel;
    }

    private createDivElement(className?: string, id?: string): HTMLElement {
        return createElement('div', { className: className, id: id });
    }

    private createInputElement(className: string, id: string, fieldName: string, type?: string): HTMLElement {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', id: id, name: fieldName,
                title: fieldName
            }
        });
    }
    private renderTabItems(): void {
        const tabModel: TabModel = this.beforeOpenArgs.tabModel;
        const items: TabItemModel[] = tabModel.items;
        let index: number = 0;
        for (let i: number = 0; i < items.length; i++) {
            const item: TabItemModel = items[i];
            if (item.content instanceof HTMLElement) {
                continue;
            } else if (item.content === 'General') {
                item.content = this.renderGeneralTab(item.content);
            } else if (item.content === 'Dependency') {
                item.content = this.renderPredecessorTab(item.content);
            } else if (item.content === 'Resources') {
                item.content = this.renderResourceTab(item.content);
            } else if (item.content === ('Custom' + '' + index)) {
                item.content = this.renderCustomTab(item.content);
                index++;
            } else if (item.content === 'Notes') {
                item.content = this.renderNotesTab(item.content);
            } else if (item.content === 'Segments') {
                if (this.editedRecord.hasChildRecords) {
                    item.disabled = true;
                }
                item.content = this.renderSegmentsTab(item.content);
            }
        }
    }
    private segmentGridActionBegin(args: ActionEventArgs): void {
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const itemName: string = 'Segments';
        const gridModel: GridModel = this.beforeOpenArgs[itemName] as GridModel;
        if (args.requestType === 'add' || args.requestType === 'beginEdit' || args.requestType === 'save') {
            const gridData: Record<string, unknown>[] = gridModel.dataSource as Record<string, unknown>[];
            const selectedItem: Record<string, unknown> = getValue('rowData', args);
            const startDate: Date = (this.beforeOpenArgs.rowData as IGanttData).ganttProperties.startDate;
            if (!isNullOrUndefined(startDate)) {
                if (args.requestType === 'add') {
                    let arg: Record<string, unknown> = {};
                    let sDate: Date = getValue('startDate', selectedItem);
                    let eDate: Date = getValue('endDate', selectedItem);
                    let duration: number = getValue('duration', selectedItem);
                    const startDate: Date = !isNullOrUndefined(gridData) && gridData.length > 0 ?
                        !isNullOrUndefined(taskFields.endDate) ? new Date((getValue('endDate', gridData[0]) as Date).getTime()) :
                            new Date((getValue('startDate', gridData[0]) as Date).getTime()) :
                        !isNullOrUndefined((this.beforeOpenArgs.rowData as IGanttData).ganttProperties.startDate) &&
                        new Date((this.beforeOpenArgs.rowData as IGanttData).ganttProperties.startDate.getTime());
                    startDate.setHours(0, 0, 0, 0);
                    if (!isNullOrUndefined(gridData) && gridData.length > 0) {
                        startDate.setDate(startDate.getDate() + 2);
                    }
                    sDate = this.parent.dataOperation.checkStartDate(startDate);
                    eDate = this.parent.dateValidationModule.getDateFromFormat(sDate);
                    if (eDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
                        this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, eDate);
                    }
                    eDate = !isNullOrUndefined(taskFields.endDate) && !isNullOrUndefined(gridData) && gridData.length <= 0 ?
                        (this.beforeOpenArgs.rowData as IGanttData).ganttProperties.endDate : eDate;

                    duration = !isNullOrUndefined(taskFields.duration) && !isNullOrUndefined(gridData) && gridData.length <= 0 ?
                        (this.beforeOpenArgs.rowData as IGanttData).ganttProperties.duration : 1;
                    arg = {
                        startDate: sDate,
                        endDate: eDate,
                        duration: duration
                    };
                    args.rowData = arg;
                }
            }
            this.selectedSegment = args.rowData;
            // if (args.requestType === 'save') {
            //     // let duration: string = 'duration';
            //     // let tempDuration: Object = this.parent.dataOperation.getDurationValue(args.data[duration]);
            //     // args.data[duration] = getValue('duration', tempDuration);
            //     this.selectedSegment = !isNullOrUndefined(this.editedRecord.ganttProperties.segments[args.rowIndex]) ?
            //         this.editedRecord.ganttProperties.segments[args.rowIndex] : !isNullOrUndefined(gridData[args.rowIndex]) ?
            //             gridData[args.rowIndex] : gridData;
            // }
        }
    }
    private renderSegmentsTab(itemName: string): HTMLElement {
        const ganttObj: Gantt = this.parent;
        const gridModel: GridModel = this.beforeOpenArgs[itemName];
        const ganttData: IGanttData = this.beforeOpenArgs.rowData;
        let preData: ITaskSegment[] = [];
        if (this.isEdit) {
            preData = isNullOrUndefined(ganttData.ganttProperties.segments) ? [] : ganttData.ganttProperties.segments;
        }
        gridModel.dataSource = preData;
        gridModel.actionBegin = this.segmentGridActionBegin.bind(this);
        Grid.Inject(Edit, Page, GridToolbar, ForeignKey);
        const gridObj: Grid = new Grid(gridModel);
        const divElement: HTMLElement = this.createDivElement('', ganttObj.element.id + '' + itemName + 'TabContainer');
        gridObj.appendTo(divElement);
        return divElement;
    }
    private renderGeneralTab(itemName: string): HTMLElement {
        const ganttObj: Gantt = this.parent;
        const itemModel: Object = this.beforeOpenArgs[itemName];
        const divElement: HTMLElement = this.createDivElement('e-edit-form-row', ganttObj.element.id
            + '' + itemName + 'TabContainer');
        for (const key of Object.keys(itemModel)) {
            if (this.parent.columnByField[key].visible === false) {
                continue;
            }
            const column: GanttColumnModel = this.parent.columnByField[key];
            const inputModel: { [key: string]: Record<string, unknown> } = itemModel[key];
            divElement.appendChild(this.renderInputElements(inputModel, column));
        }
        return divElement;
    }

    private isCheckIsDisabled(column: GanttColumnModel): boolean {
        let disabled: boolean = false;
        let stringOrNumber: number | string;
        if (column.allowEditing === false || column.isPrimaryKey || this.parent.readOnly) {
            if (this.parent.customColumns.indexOf(column.field) !== -1) {
                disabled = true;
            } else {
                if (column.field === this.parent.taskFields.id || column.field === this.parent.taskFields.name ||
                    column.field === this.parent.taskFields.duration || column.field === this.parent.taskFields.progress ||
                    column.field === this.parent.taskFields.startDate || column.field === this.parent.taskFields.endDate ||
                    column.field === this.parent.taskFields.baselineStartDate || column.field === this.parent.taskFields.baselineEndDate ||
                    column.field === this.parent.taskFields.work || column.field ===this.parent.taskFields.type) {
                    for (let i: number = 0; i<this.parent.currentViewData['length']; i++) {
                        if(!isNullOrUndefined(this.parent.currentViewData[i].ganttProperties.taskId)) {
                            stringOrNumber = this.parent.currentViewData[i].ganttProperties.taskId;
                            break;
                        }
                    }
                    if (typeof(stringOrNumber) === "string") {
                        disabled = false;
                    } else {
                        disabled = true;
                    }
                }
            }
        }
        if (this.isEdit) {
            if (column.field === this.parent.taskFields.id) {
                disabled = true;
            }
            if (this.editedRecord.hasChildRecords) {
                if ((column.field === this.parent.taskFields.endDate && ((!isNullOrUndefined(this.editedRecord['isManual']) &&
                    this.editedRecord['isManual'] == false) || this.parent.taskMode == 'Auto')) || column.field === this.parent.taskFields.duration ||
                    column.field === this.parent.taskFields.progress || column.field === this.parent.taskFields.work ||
                    column.field === this.parent.taskFields.type) {
                    disabled = true;
                }
            }
        }
        return disabled;
    }

    private isParentValid(data: IGanttData[]) {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uniqueID == this.beforeOpenArgs.rowData['uniqueID']) {
                    this.isValidData = false;
                    break
                }
                if (data[i].hasChildRecords) {
                    this.isParentValid(data[i].childRecords)
                }
                if (!this.isValidData) {
                    break;
                }
            }
        }
        return this.isValidData;
    }

    private renderPredecessorTab(itemName: string): HTMLElement {
        const ganttObj: Gantt = this.parent;
        const gridModel: GridModel = this.beforeOpenArgs[itemName];
        const dependencyColumn: GanttColumnModel = this.parent.columnByField[this.parent.taskFields.dependency];
        if (dependencyColumn.allowEditing === false || dependencyColumn.isPrimaryKey || this.parent.readOnly) {
            gridModel.editSettings.allowEditing = false;
            gridModel.editSettings.allowAdding = false;
            gridModel.editSettings.allowDeleting = false;
        }
        const ganttData: IGanttData = this.beforeOpenArgs.rowData;
        let preData: IPreData[] = [];
        this.taskNameCollection();
        if (this.isEdit) {
            preData = this.predecessorEditCollection(ganttData);
            this.updatePredecessorDropDownData(ganttData);
        }
        gridModel.dataSource = preData;
        gridModel.actionBegin = this.gridActionBegin.bind(this);
        const columns: GridColumnModel[] = <GridColumnModel[]>gridModel.columns;
        columns[1].edit = {
            write: (args: CObject): void => {
                if (getValue('requestType', args) === 'add') {
                    setValue('rowData.uniqueId', getUid(), args);
                }
                const field: string = 'name';
                const autoObj: ComboBox = new ComboBox({
                    dataSource: new DataManager(this.idCollection),
                    popupHeight: '180px',
                    allowCustom: false,
                    fields: { value: 'text' },
                    value: args.rowData[field],
                    change: (arg: ChangeEventArgs) => {
                        const tr: HTMLElement = closest(arg.element, 'tr') as HTMLElement;
                        const idInput: HTMLInputElement = tr.querySelector('#' + this.parent.element.id + 'DependencyTabContainerid');
                        if (idInput) {
                            if (!isNullOrUndefined(arg.itemData) && !isNullOrUndefined(arg.item)) {
                                idInput.value = (arg.itemData as IPreData).id;
                            } else {
                                idInput.value = '';
                            }
                        }
                    },
                    autofill: true
                });
                autoObj.appendTo(args.element as HTMLElement);
            },
            read: (args: HTMLElement): string => {
                const ej2Instance: ComboBoxModel =
                    <CObject>(<EJ2Instance>args).ej2_instances[0];
                return ej2Instance.value as string;
            }
        };
        Grid.Inject(Edit, Page, GridToolbar, ForeignKey);
        const gridObj: Grid = new Grid(gridModel);
        const divElement: HTMLElement = this.createDivElement('e-dependent-div', ganttObj.element.id + '' + itemName + 'TabContainer');
        gridObj.appendTo(divElement);
        return divElement;
    }

    private gridActionBegin(args: GridActionEventArgs): void {
        const itemName: string = 'Dependency';
        const gridModel: GridModel = this.beforeOpenArgs[itemName] as GridModel;
        if (args.requestType === 'add' || args.requestType === 'beginEdit') {
            const isEdit: boolean = args.requestType === 'add' ? false : true;
            this.idCollection = extend([], [], this.preTableCollection, true) as IDependencyEditData[];
            const gridData: Record<string, unknown>[] = gridModel.dataSource as Record<string, unknown>[];
            for (let i: number = 0; i <= gridData.length; i++) {
                // eslint-disable-next-line
                this.idCollection.forEach((data: IDependencyEditData, index: number): void => {
                    if (data.id === getValue('id', gridData[i])) {
                        const selectedItem: object = getValue('rowData', args);
                        if (isEdit && getValue('id', selectedItem) === data.id) {
                            return;
                        }
                        this.idCollection.splice(this.idCollection.indexOf(data), 1);
                    }
                });
            }
        }
    }

    private updateResourceCollection(args: RowSelectEventArgs, resourceTreeGridId: string): void {
        if (!isNullOrUndefined(args.data) && Object.keys(args.data).length) {
            const ganttObj: Gantt = this.parent;
            const treeGridId: HTMLElement = document.querySelector('#' + resourceTreeGridId);
            const resourceTreeGrid: TreeGrid = <TreeGrid>(<EJ2Instance>treeGridId).ej2_instances[0];
            if (!isNullOrUndefined(resourceTreeGrid) && resourceTreeGrid.getSelectedRecords().length > 0) {
                const tempRecords: CObject[] = <CObject[]>resourceTreeGrid.getSelectedRecords();
                let index: number;
                const selectedItems: CObject[] = [];
                for (index = 0; index < tempRecords.length; index++) {
                    selectedItems.push(<CObject>tempRecords[index].taskData);
                }
                this.ganttResources = <Record<string, unknown>[]>extend([], selectedItems);
            } else {
                this.ganttResources = [];
            }
        } else {
            this.ganttResources = [];
        }
    }

    private renderResourceTab(itemName: string): HTMLElement {
        const ganttObj: Gantt = this.parent;
        const resourceSettings: ResourceFieldsModel = ganttObj.resourceFields;
        const ganttData: IGanttData = this.beforeOpenArgs.rowData;
        const rowResource: Object[] = ganttData.ganttProperties.resourceInfo;
        const inputModel: TreeGridModel = this.beforeOpenArgs[itemName];
        const resourceTreeGridId: string = ganttObj.element.id + '' + itemName + 'TabContainer';
        let resourceData: Object[] = [];
        if (this.parent.viewType === 'ResourceView') {
            for (let i: number = 0; i < ganttObj.currentViewData.length; i++) {
                for (let j: number = 0; j < ganttObj.resources.length; j++) {
                    if (ganttObj.currentViewData[i][ganttObj.taskFields.id] === ganttObj.resources[j][resourceSettings.id] && 
                        (ganttObj.currentViewData[i].hasChildRecords || isNullOrUndefined(ganttObj.currentViewData[i].parentItem))) {
                        resourceData.push(ganttObj.resources[j]);
                    }
                }
            }
        }
	else {
            resourceData = extend([], [], ganttObj.resources, true) as Object[];
        }
	this.parent.dataOperation.updateResourceUnit(resourceData);
        if (!isNullOrUndefined(rowResource)) {
            let count: number;
            const rowResourceLength: number = rowResource.length;
            let index: number;
            const resourceDataLength: number = resourceData.length;
            for (count = 0; count < rowResourceLength; count++) {
                for (index = 0; index < resourceDataLength; index++) {
                    if (rowResource[count][resourceSettings.id] === resourceData[index][resourceSettings.id]) {
                        resourceData[index][resourceSettings.unit] = rowResource[count][resourceSettings.unit];
                    }
                }
            }
        }
        inputModel.dataSource = resourceData;
        const resourceInfo: Object[] = ganttData.ganttProperties.resourceInfo;
        if (this.isEdit && !isNullOrUndefined(resourceInfo)) {
            for (let i: number = 0; i < resourceInfo.length; i++) {
                this.ganttResources.push(resourceInfo[i]);
            }
        }
        inputModel.rowSelected = (args: RowSelectEventArgs): void => {
            this.updateResourceCollection(args, resourceTreeGridId);
        };
        inputModel.rowDeselected = (args: RowSelectEventArgs): void => {
            this.updateResourceCollection(args, resourceTreeGridId);
        };

        const divElement: HTMLElement = this.createDivElement('e-resource-div', resourceTreeGridId);
        TreeGrid.Inject(Selection, Filter, TreeGridEdit, VirtualScroll);
        const treeGridObj: TreeGrid = new TreeGrid(inputModel);
        const resourceColumn: GanttColumnModel = this.parent.columnByField[this.parent.taskFields.resourceInfo];
        if (resourceColumn.allowEditing === false || resourceColumn.isPrimaryKey || this.parent.readOnly) {
            treeGridObj.allowSelection = false;
            treeGridObj.allowFiltering = false;
            treeGridObj.editSettings.allowEditing = false;
        }
        treeGridObj.dataBound = () => {
            if (this.parent.editDialogFields.length >= 1 && this.parent.editDialogFields[0].type === 'Resources') {
                const id: string = this.parent.element.id + 'ResourcesTabContainer';
                this.resourceSelection(id);
            }
        }
        treeGridObj.appendTo(divElement);
        return divElement;
    }
    private resourceSelection(id: string) {
        const resourceTreeGrid: TreeGrid = <TreeGrid>(<EJ2Instance>document.querySelector('#' + id)).ej2_instances[0];
        let currentViewData: Object[] = resourceTreeGrid.getCurrentViewRecords();
        let resources: Object[] = this.ganttResources;
        if (resources && resources.length > 0) {
            currentViewData.forEach((data: CObject, index: number): void => {
                for (let i: number = 0; i < resources.length; i++) {
                    if (data.taskData[this.parent.resourceFields.id] === resources[i][this.parent.resourceFields.id] &&
                        !isNullOrUndefined(resourceTreeGrid.selectionModule) &&
                        resourceTreeGrid.getSelectedRowIndexes().indexOf(index) === -1) {
                        resourceTreeGrid.selectRow(index);
                    }
                }
            });
        }
    }
    private renderCustomTab(itemName: string): HTMLElement {
        return this.renderGeneralTab(itemName);
    }

    private renderNotesTab(itemName: string): HTMLElement {
        const ganttObj: Gantt = this.parent;
        const inputModel: RichTextEditorModel = this.beforeOpenArgs[itemName];
        const ganttProp: ITaskData = this.editedRecord.ganttProperties;
        const divElement: HTMLElement = this.createDivElement('', ganttObj.element.id + '' + itemName + 'TabContainer');
        RichTextEditor.Inject(RTEToolbar, Link, HtmlEditor, QuickToolbar, Count);
        inputModel.value = ganttProp.notes;
        const notesColumn: GanttColumnModel = this.parent.columnByField[this.parent.taskFields.notes];
        if (notesColumn.allowEditing === false || notesColumn.isPrimaryKey || this.parent.readOnly) {
            inputModel.enabled = false;
        }
        const rteObj: RichTextEditor = new RichTextEditor(inputModel);
        rteObj.appendTo(divElement);
        return divElement;
    }

    private renderInputElements(inputModel: CObject, column: GanttColumnModel): HTMLElement {
        const ganttId: string = this.parent.element.id;
        const ganttData: IGanttData = this.editedRecord;
        const divElement: HTMLElement = this.createDivElement('e-edit-form-column');
        let inputElement: HTMLElement;
        const editArgs: Record<string, unknown> = { column: column, data: ganttData };
        if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
            let create: Function = column.edit.create as Function;
            if (typeof create === 'string') {
                create = getObject(create, window);
                inputElement = create(editArgs);
            } else {
                inputElement = (column.edit.create as Function)(editArgs);
            }
            inputElement.className = '';
            inputElement.setAttribute('type', 'text');
            inputElement.setAttribute('id', ganttId + '' + column.field);
            inputElement.setAttribute('name', column.field);
            inputElement.setAttribute('title', column.field);
            divElement.appendChild(inputElement);
        } else {
            inputElement = this.createInputElement('', ganttId + '' + column.field, column.field);
            divElement.appendChild(inputElement);
        }
        inputModel.enabled = !this.isCheckIsDisabled(column);
        if (column.field === this.parent.taskFields.duration) {
            if (!isNullOrUndefined(column.valueAccessor)) {
                if (typeof column.valueAccessor === 'string') {
                    const valueAccessor: Function = getObject(column.valueAccessor, window);
                    inputModel.value = valueAccessor(column.field, ganttData, column);
                } else {
                    inputModel.value = (column.valueAccessor as Function)(column.field, ganttData, column);
                }
            } else if (isNullOrUndefined(column.edit)) {
                const ganttProp: ITaskData = ganttData.ganttProperties;
                inputModel.value = this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
            }
        } else {
            if (column.editType === 'booleanedit') {
                if (ganttData[column.field] === true) {
                    inputModel.checked = true;
                } else {
                    inputModel.checked = false;
                }
            } else {
                inputModel.value = ganttData[column.field];
            }
        }
        if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
            let write: Function = column.edit.write as Function;
            let inputObj: Inputs;
            if (typeof write === 'string') {
                write = getObject(write, window);
                inputObj = write({
                    column: column, rowData: ganttData, element: inputElement
                });
            } else {
                inputObj = (column.edit.write as Function)({
                    column: column, rowData: ganttData, element: inputElement
                });
            }
            if (column.field === this.parent.taskFields.duration) {
                inputObj.change = (args: CObject): void => {
                    this.validateScheduleFields(args, column, this.parent);
                };
            }
        } else {
            const inputObj: Inputs = new this.inputs[column.editType](inputModel);
            inputObj.appendTo(inputElement);
        }
        return divElement;
    }

    private taskNameCollection(): void {
        const flatData: IGanttData[] = this.parent.flatData;
        this.preTaskIds = [];
        this.preTableCollection = [];
        for (let i: number = 0; i < flatData.length; i++) {
            const data: IGanttData = flatData[i];
            let currentFlatData: IGanttData = data;
            if (data.parentUniqueID === this.beforeOpenArgs.rowData['uniqueID']) {
                this.isValidData = false
            }
            else {
                do {
                    if (currentFlatData.parentItem) {
                        currentFlatData = this.parent.flatData[this.parent.ids.indexOf(currentFlatData.parentItem.taskId)];
                        if (currentFlatData.uniqueID == this.beforeOpenArgs.rowData['uniqueID']) {
                            this.isValidData = false;
                            break;
                        }
                    }
                }
                while (currentFlatData.parentItem)
            }
            if (data.hasChildRecords && this.isValidData) {
                this.isValidData = this.isParentValid(data.childRecords);
            }
            if (!this.isValidData) {
                this.isValidData = true;
                continue;
            }
            const taskId: string = this.parent.viewType === 'ResourceView' ? data.ganttProperties.taskId.toString()
                : data.ganttProperties.rowUniqueID.toString();
            const tempObject: IDependencyEditData = {
                id: taskId,
                text: (taskId + '-' + data.ganttProperties.taskName),
                value: taskId
            };
            this.preTaskIds.push(tempObject.id);
            this.preTableCollection.push(tempObject);
        }
    }

    private predecessorEditCollection(ganttData: IGanttData): IPreData[] {
        const preDataCollection: IPreData[] = [];
        const ganttProp: ITaskData = ganttData.ganttProperties;
        if (this.isEdit && !isNullOrUndefined(this.parent.taskFields.dependency) && !isNullOrUndefined(ganttData) &&
            !isNullOrUndefined(ganttProp.predecessor)) {
            const predecessor: IPredecessor[] = ganttProp.predecessor;
            const idCollection: IDependencyEditData[] = this.preTableCollection;
            for (let i: number = 0; i < predecessor.length; i++) {
                const from: string = predecessor[i].from.toString();
                const preData: IPreData = {};
                const taskID: string = this.parent.viewType === 'ResourceView' ? ganttProp.taskId : ganttProp.rowUniqueID;
                if (taskID.toString() !== from) {
                    preData.id = from;
                    for (let index: number = 0; index < idCollection.length; index++) {
                        if (idCollection[index].value === from) {
                            preData.name = idCollection[index].text;
                            break;
                        }
                    }
                    preData.type = predecessor[i].type;
                    const offset: number = predecessor[i].offset;
                    const offsetUnit: string = predecessor[i].offsetUnit;
                    preData.offset = this.parent.dataOperation.getDurationString(offset, offsetUnit);
                    preData.uniqueId = getUid();
                    preDataCollection.push(preData);
                }
            }
        }
        return preDataCollection;
    }

    private updatePredecessorDropDownData(ganttData: IGanttData): void {
        let index: number = -1;
        const id: string = this.parent.viewType === 'ResourceView' ? ganttData.ganttProperties.taskId.toString()
            : ganttData.ganttProperties.rowUniqueID.toString();
        index = this.preTaskIds.indexOf(id);
        this.preTableCollection.splice(index, 1);
        this.preTaskIds.splice(index, 1);
        this.validSuccessorTasks(ganttData, this.preTaskIds, this.preTableCollection);
    }

    private validSuccessorTasks(data: IGanttData, ids: string[], idCollection: IDependencyEditData[]): void {
        const ganttProp: ITaskData = data.ganttProperties;
        if (ganttProp.predecessor && ganttProp.predecessor.length > 0) {
            const predecessor: IPredecessor[] = ganttProp.predecessor;
            const fromId: string = this.parent.viewType === 'ResourceView' ? ganttProp.taskId.toString() : ganttProp.rowUniqueID.toString();
            predecessor.forEach((item: IPredecessor) => {
                if (item.from.toString() === fromId) {
                    const toId: string = item.to; let idIndex: number = -1;
                    idIndex = ids.indexOf(toId);
                    if (idIndex > -1) {
                        ids.splice(idIndex, 1);
                        idCollection.splice(idIndex, 1);
                    }
                    const ganttData: IGanttData = this.parent.connectorLineModule.getRecordByID(toId);
                    this.validSuccessorTasks(ganttData, ids, idCollection);
                }
            });
        }
    }

    private getPredecessorType(): IDependencyEditData[] {
        const typeText: string[] = [this.parent.getPredecessorTextValue('SS'), this.parent.getPredecessorTextValue('SF'),
            this.parent.getPredecessorTextValue('FS'), this.parent.getPredecessorTextValue('FF')];
        const types: IDependencyEditData[] = [
            { id: 'FS', text: typeText[2], value: typeText[2] },
            { id: 'FF', text: typeText[3], value: typeText[3] },
            { id: 'SS', text: typeText[0], value: typeText[0] },
            { id: 'SF', text: typeText[1], value: typeText[1] }
        ];
        return types;
    }
    private initiateDialogSave(): boolean {
        if (this.isEdit) {
            this.parent.initiateEditAction(true);
        } else {
            this.addedRecord = {};
        }
        const ganttObj: Gantt = this.parent;
        const tabModel: TabModel = this.beforeOpenArgs.tabModel;
        const items: TabItemModel[] = tabModel.items;
        for (let i: number = 0; i < items.length; i++) {
            const element: HTMLElement = items[i].content as HTMLElement;
            let id: string = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.updateGeneralTab(element, false);
                } else if (id === 'Dependency') {
                    this.updatePredecessorTab(element);
                } else if (id === 'Notes') {
                    this.updateNotesTab(element);
                } else if (id === 'Resources') {
                    this.updateResourceTab(element);
                } else if (id.indexOf('Custom') !== -1) {
                    this.updateCustomTab(element);
                } else if (id === 'Segments') {
                    this.updateSegmentsData(element, this.beforeOpenArgs.rowData);
                }
            }
        }
        if (this.isEdit) {
            /**
             * If any update on edited task do it here
             */
            this.parent.dataOperation.updateWidthLeft(this.rowData);
            const editArgs: ITaskbarEditedEventArgs = {
                data: this.rowData,
                action: 'DialogEditing'
            };
            this.parent.editModule.initiateUpdateAction(editArgs);
        } else {
            if (this.parent.viewType === 'ResourceView') {
                const newRecords: Object = extend({}, this.addedRecord, true);
                if (newRecords[this.parent.taskFields.resourceInfo].length) {
                    for (let i: number = 0; i < newRecords[this.parent.taskFields.resourceInfo].length; i++) {
                        const id: string = newRecords[this.parent.taskFields.resourceInfo][i].toString();
                        const parentRecordIndex: number = this.parent.getTaskIds().indexOf('R' + id.toString());
                        if (parentRecordIndex !== -1) {
                            this.parent.editModule.addRecord(this.addedRecord, 'Child', parentRecordIndex);
                            break;
                        }
                    }
                } else {
                    this.parent.editModule.addRecord(this.addedRecord, 'Bottom');
                }
            } else {
                this.parent.editModule.addRecord(this.addedRecord, this.parent.editSettings.newRowPosition);
            }
        }
        return true;
    }

    private updateSegmentTaskData(dataSource: ITaskSegment[]): void {
        const userData: ITaskSegment[] = [];
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        for (let i: number = 0; i < dataSource.length; i++) {
            const taskData: Object = {};

            if (!isNullOrUndefined(taskSettings.startDate)) {
                taskData[this.parent.taskFields.startDate] = dataSource[i].startDate;
            }
            if (!isNullOrUndefined(taskSettings.endDate)) {
                taskData[this.parent.taskFields.endDate] = dataSource[i].endDate;
            }
            if (!isNullOrUndefined(taskSettings.duration)) {
                taskData[this.parent.taskFields.duration] = Number(dataSource[i].duration);
                dataSource[i].duration = taskData[this.parent.taskFields.duration];
            }
            userData.push(taskData);
        }
        if (!this.isEdit) {
            this.addedRecord[taskSettings.segments] = userData;
        } else {
            this.rowData.ganttProperties.segments = dataSource;
            this.parent.setRecordValue(
                'segments', this.parent.dataOperation.setSegmentsInfo(this.rowData, false), this.rowData.ganttProperties, true
            );
            this.parent.setRecordValue(
                'taskData.' + this.parent.taskFields.segments,
                userData,
                this.rowData);
            if (dataSource.length <= 0){
                this.validateDuration(this.rowData);
        }
    }
    }
    // eslint-disable-next-line
    private updateSegmentsData(segmentForm: HTMLElement, data: IGanttData): void {
        const gridObj: Grid = <Grid>(<EJ2Instance>segmentForm).ej2_instances[0];
        if (gridObj.isEdit) {
            gridObj.endEdit();
        }
        const dataSource: ITaskSegment[] = <ITaskSegment[]>gridObj.currentViewData;
        this.updateSegmentTaskData(dataSource);
    }

    private updateGeneralTab(generalForm: HTMLElement, isCustom: boolean): void {
        const ganttObj: Gantt = this.parent;
        const childNodes: NodeList = generalForm.childNodes;
        let tasksData: Record<string, unknown> = {};
        if (!this.isEdit) {
            tasksData = this.addedRecord;
        }
        for (let i: number = 0; i < childNodes.length; i++) {
            const div: HTMLElement = childNodes[i] as HTMLElement;
            const inputElement: HTMLInputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                const fieldName: string = inputElement.id.replace(ganttObj.element.id, '');
                const controlObj: CObject = <CObject>(<EJ2Instance>div.querySelector('#' + ganttObj.element.id + fieldName)).ej2_instances[0];
                if (this.parent.columnByField[this.parent.taskFields.id].editType === "stringedit" && fieldName === this.parent.taskFields.id) {
                    const valueString: string = controlObj.value.toString();
                    controlObj.value = valueString;
                }
                const column: GanttColumnModel = ganttObj.columnByField[fieldName];
                if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
                    let read: Function = column.edit.read as Function;
                    if (typeof read === 'string') {
                        read = getObject(read, window);
                        tasksData[fieldName] = read(inputElement, controlObj.value);
                    } else {
                        tasksData[fieldName] = (column.edit.read as Function)(inputElement, controlObj.value);
                    }
                } else if (isCustom && column.editType === 'booleanedit') {
                    if (inputElement.checked === true) {
                        tasksData[fieldName] = true;
                    } else {
                        tasksData[fieldName] = false;
                    }
                } else {
                    tasksData[fieldName] = controlObj.value;
                }
            }
        }
        if (this.isEdit) {
            this.updateScheduleProperties(this.editedRecord, this.rowData);
            ganttObj.editModule.validateUpdateValues(tasksData, this.rowData, true);
        }
    }
    private updateScheduleProperties(fromRecord: IGanttData, toRecord: IGanttData): void {
        this.parent.setRecordValue('startDate', fromRecord.ganttProperties.startDate, toRecord.ganttProperties, true);
        this.parent.setRecordValue('endDate', fromRecord.ganttProperties.endDate, toRecord.ganttProperties, true);
        this.parent.setRecordValue('duration', fromRecord.ganttProperties.duration, toRecord.ganttProperties, true);
        this.parent.setRecordValue('durationUnit', fromRecord.ganttProperties.durationUnit, toRecord.ganttProperties, true);
        this.parent.setRecordValue('work', fromRecord.ganttProperties.work, toRecord.ganttProperties, true);
        this.parent.setRecordValue('type', fromRecord.ganttProperties.taskType, toRecord.ganttProperties, true);
        if (!isNullOrUndefined(this.parent.taskFields.startDate)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.startDate);
        }
        if (!isNullOrUndefined(this.parent.taskFields.endDate)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.endDate);
        }
        if (!isNullOrUndefined(this.parent.taskFields.duration)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.duration);
            this.parent.setRecordValue('durationUnit', fromRecord.ganttProperties.durationUnit, this.rowData, true);
            if (this.rowData.ganttProperties.duration === 0) {
                this.parent.setRecordValue('isMilestone', true, this.rowData.ganttProperties, true);
            } else {
                this.parent.setRecordValue('isMilestone', false, this.rowData.ganttProperties, true);
            }
        }
        if (!isNullOrUndefined(this.parent.taskFields.work)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.work);
        }
        if (!isNullOrUndefined(this.parent.taskFields.manual)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.manual);
        }
        if (!isNullOrUndefined(this.parent.taskFields.type)) {
            this.parent.dataOperation.updateMappingData(this.rowData, "type");
        }
    }
    private updatePredecessorTab(preElement: HTMLElement): void {
        const gridObj: Grid = <Grid>(<EJ2Instance>preElement).ej2_instances[0];
        if (gridObj.isEdit) {
            gridObj.endEdit();
        }
        const dataSource: IPreData[] = <IPreData[]>gridObj.dataSource;
        const predecessorName: string[] = [];
        let newValues: IPredecessor[] = [];
        let predecessorString: string = '';
        const ids: string[] = [];
        for (let i: number = 0; i < dataSource.length; i++) {
            const preData: IPreData = dataSource[i];
            const newId: string = preData.name.split('-')[0];
            if (preData.id !== newId) {
                preData.id = newId;
            }
            if (ids.indexOf(preData.id) === -1) {
                let name: string = preData.id + preData.type;
                if (preData.offset && preData.offset.indexOf('-') !== -1) {
                    name += preData.offset;
                } else {
                    name += ('+' + preData.offset);
                }
                predecessorName.push(name);
                ids.push(preData.id);
            }
        }
        if (this.isEdit) {
            if (predecessorName.length > 0) {
                newValues = this.parent.predecessorModule.calculatePredecessor(predecessorName.join(','), this.rowData);
                this.parent.setRecordValue('predecessor', newValues, this.rowData.ganttProperties, true);
                predecessorString = this.parent.predecessorModule.getPredecessorStringValue(this.rowData);
            } else {
                newValues = [];
                this.parent.setRecordValue('predecessor', newValues, this.rowData.ganttProperties, true);
                predecessorString = '';
            }
            this.parent.setRecordValue('predecessorsName', predecessorString, this.rowData.ganttProperties, true);
            this.parent.setRecordValue(
                'taskData.' + this.parent.taskFields.dependency,
                predecessorString,
                this.rowData);
            this.parent.setRecordValue(
                this.parent.taskFields.dependency,
                predecessorString,
                this.rowData);
            this.parent.predecessorModule.updateUnscheduledDependency(this.rowData);
        } else {
            this.addedRecord[this.parent.taskFields.dependency] = predecessorName.length > 0 ? predecessorName.join(',') : '';
        }
    }
    private updateResourceTab(resourceElement: HTMLElement): void {
        const treeGridObj: TreeGrid = <TreeGrid>(<EJ2Instance>resourceElement).ej2_instances[0];
        if (treeGridObj) {
            treeGridObj.grid.endEdit();
        }
        const selectedItems: CObject[] = <CObject[]>this.ganttResources;
        if (this.parent.viewType === 'ResourceView' && !isNullOrUndefined(this.rowData.ganttProperties)) {
            if (JSON.stringify(this.ganttResources) !== JSON.stringify(this.rowData.ganttProperties.resourceInfo)) {
                this.isResourceUpdate = true;
                this.previousResource = !isNullOrUndefined(this.rowData.ganttProperties.resourceInfo) ?
                    [...this.rowData.ganttProperties.resourceInfo] : [];
            } else {
                this.isResourceUpdate = false;
            }
        }
        const idArray: object[] = [];
        if (this.isEdit) {
            this.parent.setRecordValue('resourceInfo', selectedItems, this.rowData.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(this.rowData, 'resourceInfo');
            this.parent.editModule.updateResourceRelatedFields(this.rowData, 'resource');
            this.validateDuration(this.rowData);
        } else {
            for (let i: number = 0; i < selectedItems.length; i++) {
                idArray.push(selectedItems[i][this.parent.resourceFields.id]);
                this.isAddNewResource = true;
            }
            this.addedRecord[this.parent.taskFields.resourceInfo] = idArray;
        }
    }
    private updateNotesTab(notesElement: HTMLElement): void {
        const ganttObj: Gantt = this.parent;
        const rte: RichTextEditor = <RichTextEditor>(<EJ2Instance>notesElement).ej2_instances[0];
        if (this.isEdit) {
            if (ganttObj.columnByField[ganttObj.taskFields.notes].disableHtmlEncode) {
                this.parent.setRecordValue('notes', rte.getHtml(), this.rowData.ganttProperties, true);
            } else {
                this.parent.setRecordValue('notes', rte.getText(), this.rowData.ganttProperties, true);
            }
            ganttObj.dataOperation.updateMappingData(this.rowData, 'notes');
        } else {
            this.addedRecord[this.parent.taskFields.notes] = rte.getHtml();
        }
    }
    private updateCustomTab(customElement: HTMLElement): void {
        this.updateGeneralTab(customElement, true);
    }
}

/**
 * @hidden
 */
export type Inputs =
    CheckBox |
    DropDownList |
    TextBox |
    NumericTextBox |
    DatePicker |
    DateTimePicker |
    MaskedTextBox;

/**
 * @hidden
 */
export interface IPreData {
    id?: string;
    name?: string;
    type?: string;
    offset?: string;
    uniqueId?: number;
}
