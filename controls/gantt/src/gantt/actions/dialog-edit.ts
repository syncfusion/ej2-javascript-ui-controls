import { remove, extend, isNullOrUndefined, createElement, L10n, getValue, setValue, closest, isBlazor } from '@syncfusion/ej2-base';
import { DataManager, DataUtil } from '@syncfusion/ej2-data';
import { Dialog, PositionDataModel, DialogModel } from '@syncfusion/ej2-popups';
import { Tab, TabModel, TabItemModel, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { Grid, Edit, Toolbar as GridToolbar, Page, GridModel, GridActionEventArgs } from '@syncfusion/ej2-grids';
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
import { AddDialogFieldSettingsModel, EditDialogFieldSettingsModel, TaskFieldsModel, ResourceFieldsModel } from '../models/models';
import { CObject } from '../base/enum';
import { ColumnModel as GanttColumnModel } from '../models/column';
import { TextBox, NumericTextBox, NumericTextBoxModel, MaskedTextBox } from '@syncfusion/ej2-inputs';
import { IGanttData, ITaskData, IDependencyEditData, IPredecessor, ITaskbarEditedEventArgs, ActionBeginArgs } from '../base/interface';
import { CheckBox, CheckBoxModel } from '@syncfusion/ej2-buttons';
import { DatePicker, DateTimePicker, DatePickerModel } from '@syncfusion/ej2-calendars';
import { DropDownList, ComboBox, ComboBoxModel, ChangeEventArgs, DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { isScheduledTask } from '../base/utils';
import {
    TreeGridModel, ColumnModel as TreeGridColumnModel,
    TreeGrid, Selection, Filter, Edit as TreeGridEdit
} from '@syncfusion/ej2-treegrid';
import { getUid } from '../base/utils';
interface EJ2Instance extends HTMLElement {
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
    private addedRecord: object = null;
    private dialogEditValidationFlag: boolean = false;
    private tabObj: Tab;
    public ganttResources: Object[] = [];
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
        };
        this.processDialogFields();
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.on('chartDblClick', this.dblClickHandler, this);
    }

    private dblClickHandler(e: PointerEvent): void {
        let ganttData: IGanttData = this.parent.ganttChartModule.getRecordByTarget(e);
        if (!isNullOrUndefined(ganttData)) {
            this.openEditDialog(ganttData);
        }
    }

    /**
     * Method to validate add and edit dialog fields property.
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
        let newDialogFields: AddDialogFieldSettingsModel[] = [];
        let emptyCustomColumn: number = 0;
        for (let i: number = 0; i < dialogFields.length; i++) {
            let fieldItem: AddDialogFieldSettingsModel = getActualProperties(dialogFields[i]);
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
     */
    private getGeneralColumnFields(): string[] {
        let fields: string[] = [];
        for (let key of Object.keys(this.parent.columnMapping)) {
            if (key === 'dependency' || key === 'resourceInfo' || key === 'notes') {
                continue;
            }
            fields.push(this.parent.columnMapping[key]);
        }
        return fields;
    }

    /**
     * Method to get custom column fields
     */
    private getCustomColumnFields(): string[] {
        let fields: string[] = [];
        for (let i: number = 0; i < this.parent.customColumns.length; i++) {
            fields.push(this.parent.customColumns[i]);
        }
        return fields;
    }

    /**
     * Get default dialog fields when fields are not defined for add and edit dialogs
     */
    private getDefaultDialogFields(): AddDialogFieldSettingsModel[] {
        let dialogFields: AddDialogFieldSettingsModel[] = [];
        let fieldItem: AddDialogFieldSettingsModel = {};
        let fields: string[];
        let columnMapping: { [key: string]: string; } = this.parent.columnMapping;
        if (Object.keys(columnMapping).length !== 0) {
            fieldItem.type = 'General';
            fields = this.getGeneralColumnFields();
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
        if (this.parent.customColumns.length > 0) {
            fieldItem = {};
            fieldItem.type = 'Custom';
            dialogFields.push(fieldItem);
        }
        return dialogFields;
    }
    /**
     * @private
     */
    public openAddDialog(): void {
        this.isEdit = false;
        this.editedRecord = this.composeAddRecord();
        this.createDialog();
    }
    /**
     *
     * @return {Date}
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
     * @private
     */
    public composeAddRecord(): IGanttData {
        let tempData: IGanttData = {};
        tempData.ganttProperties = {};
        let columns: GanttColumnModel[] = this.parent.ganttColumns;
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let id: number | string = this.parent.editModule.getNewTaskId();
        for (let i: number = 0; i < columns.length; i++) {
            let field: string = columns[i].field;
            if (field === taskSettings.id) {
                tempData[field] = id;
                tempData.ganttProperties.rowUniqueID = tempData[field];
            } else if (columns[i].field === taskSettings.startDate) {
                if (isNullOrUndefined(tempData[taskSettings.endDate])) {
                    tempData[field] = this.getMinimumStartDate();
                } else {
                    tempData[field] = new Date(tempData[taskSettings.endDate]);
                }
                tempData.ganttProperties.startDate = new Date(tempData[field]);
            } else if (columns[i].field === taskSettings.endDate) {
                if (isNullOrUndefined(tempData[taskSettings.startDate])) {
                    tempData[field] = this.getMinimumStartDate();
                } else {
                    tempData[field] = new Date(tempData[taskSettings.startDate]);
                }
                tempData.ganttProperties.endDate = new Date(tempData[field]);
            } else if (columns[i].field === taskSettings.duration) {
                tempData[field] = 1;
                tempData.ganttProperties.duration = tempData[field];
                tempData.ganttProperties.durationUnit = this.parent.durationUnit.toLocaleLowerCase();
            } else if (columns[i].field === taskSettings.name) {
                tempData[field] = 'New Task ' + id;
                tempData.ganttProperties.taskName = tempData[field];
            } else if (columns[i].field === taskSettings.progress) {
                tempData[field] = 0;
                tempData.ganttProperties.progress = tempData[field];
            } else if (columns[i].field === taskSettings.work) {
                tempData[field] = 0;
                tempData.ganttProperties.work = tempData[field];
            } else if (columns[i].field === 'taskType') {
                tempData[field] = this.parent.taskType;
                tempData.ganttProperties.taskType = tempData[field];
            } else {
                tempData[this.parent.ganttColumns[i].field] = '';
            }
        }
        return tempData;
    }
    /**
     * @private
     */
    public openToolbarEditDialog(): void {
        let gObj: Gantt = this.parent;
        if (gObj.editModule && gObj.editSettings.allowEditing) {
            let selectedRowId: number | string = gObj.selectionModule ?
                (gObj.selectionSettings.mode === 'Row' || gObj.selectionSettings.mode === 'Both') &&
                    gObj.selectionModule.selectedRowIndexes.length === 1 ?
                    gObj.currentViewData[gObj.selectionModule.selectedRowIndexes[0]].ganttProperties.rowUniqueID :
                    gObj.selectionSettings.mode === 'Cell' &&
                        gObj.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        gObj.currentViewData[gObj.selectionModule.getSelectedRowCellIndexes()[0].rowIndex].ganttProperties.rowUniqueID :
                        null : null;
            if (!isNullOrUndefined(selectedRowId)) {
                this.openEditDialog(selectedRowId);
            }
        }
    }
    /**
     * @param taskId 
     * @private
     */
    public openEditDialog(taskId: number | string | Object): void {
        let ganttObj: Gantt = this.parent;
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
        let ganttObj: Gantt = this.parent;
        let dialogModel: DialogModel = {};
        this.beforeOpenArgs.dialogModel = dialogModel;
        this.beforeOpenArgs.rowData = this.editedRecord;
        this.beforeOpenArgs.rowIndex = this.rowIndex;
        let dialogMaxWidth: string = this.parent.isAdaptive ? '' : '600px';
        let dialog: HTMLElement = this.parent.createElement(
            'div', { id: ganttObj.element.id + '_dialog', styles: 'max-width:' + dialogMaxWidth });
        ganttObj.element.appendChild(dialog);
        dialogModel.animationSettings = { effect: 'None' };
        dialogModel.header = this.localeObj.getConstant(this.isEdit ? 'editDialogTitle' : 'addDialogTitle');
        dialogModel.isModal = true;
        dialogModel.cssClass = 'e-gantt-dialog';
        dialogModel.allowDragging = this.parent.isAdaptive ? false : true;
        dialogModel.showCloseIcon = true;
        let position: PositionDataModel = this.parent.isAdaptive ? { X: 'top', Y: 'left' } : { X: 'center', Y: 'center' };
        dialogModel.position = position;
        //dialogModel.width = '750px';
        dialogModel.height = this.parent.isAdaptive ? '100%' : 'auto';
        dialogModel.target = this.parent.element;
        dialogModel.close = this.dialogClose.bind(this);
        dialogModel.closeOnEscape = true;
        dialogModel.open = (args: object) => {
            let dialogElement: HTMLElement = getValue('element', args);
            let generalTabElement: HTMLElement = dialogElement.querySelector('#' + this.parent.element.id + 'GeneralTabContainer');
            if (generalTabElement && generalTabElement.scrollHeight > generalTabElement.offsetHeight) {
                generalTabElement.classList.add('e-scroll');
            }
            if (this.tabObj.selectedItem === 0) {
                this.tabObj.select(0);
            }
            if (this.parent.isAdaptive) {
                dialogElement.style.maxHeight = 'none';
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
        let target: HTMLElement = e.target as HTMLElement;
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
     * @private
     */
    public dialogClose(): void {
        if (this.dialog) {
            this.resetValues();
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
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.destroyDialogInnerElements();
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    }

    private destroyDialogInnerElements(): void {
        let ganttObj: Gantt = this.parent;
        let tabModel: TabModel = this.beforeOpenArgs.tabModel;
        let items: TabItemModel[] = tabModel.items;
        for (let i: number = 0; i < items.length; i++) {
            let element: HTMLElement = items[i].content as HTMLElement;
            let id: string = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.destroyCustomField(element);
                } else if (id === 'Dependency') {
                    let gridObj: Grid = <Grid>(<EJ2Instance>element).ej2_instances[0];
                    gridObj.destroy();
                } else if (id === 'Notes') {
                    let rte: RichTextEditor = <RichTextEditor>(<EJ2Instance>element).ej2_instances[0];
                    rte.destroy();
                } else if (id === 'Resources') {
                    let treeGridObj: TreeGrid = <TreeGrid>(<EJ2Instance>element).ej2_instances[0];
                    treeGridObj.destroy();
                } else if (id.indexOf('Custom') !== -1) {
                    this.destroyCustomField(element);
                }
            }
        }
    }

    private destroyCustomField(element: HTMLElement): void {
        let childNodes: NodeList = element.childNodes;
        let ganttObj: Gantt = this.parent;
        for (let i: number = 0; i < childNodes.length; i++) {
            let div: HTMLElement = childNodes[i] as HTMLElement;
            let inputElement: HTMLInputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]') as HTMLInputElement;
            if (inputElement) {
                let fieldName: string = inputElement.id.replace(ganttObj.element.id, '');
                /* tslint:disable-next-line:no-any */
                let controlObj: any = <any>(<EJ2Instance>div.querySelector('#' + ganttObj.element.id + fieldName)).ej2_instances[0];
                if (!isNullOrUndefined(controlObj)) {
                    let column: GanttColumnModel = ganttObj.columnByField[fieldName];
                    if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
                        let destroy: Function = column.edit.destroy as Function;
                        if (typeof destroy !== 'string') {
                            (column.edit.destroy as Function)();
                        }
                    } else {
                        controlObj.destroy();
                    }
                }
            }
        }
    }
    /**
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
     */
    private getEditFields(): AddDialogFieldSettingsModel[] {
        if (this.isEdit) {
            return this.updatedEditFields;
        } else {
            return this.updatedAddFields;

        }
    }
    /* tslint:disable-next-line:max-func-body-length */
    private createTab(dialogModel: DialogModel, dialog: HTMLElement): void {
        let ganttObj: Gantt = this.parent;
        let tabModel: TabModel = {}; let tabItems: TabItemModel[] = [];
        let dialogSettings: AddDialogFieldSettingsModel[] = this.getEditFields();
        let tabElement: HTMLElement;
        let tasks: TaskFieldsModel = ganttObj.taskFields;
        let length: number = dialogSettings.length;
        tabModel.items = tabItems;
        tabModel.locale = this.parent.locale;
        this.beforeOpenArgs.tabModel = tabModel;
        let count: number = 0; let index: number = 0;
        if (length > 0) {
            for (let i: number = 0; i < length; i++) {
                let dialogField: AddDialogFieldSettingsModel = dialogSettings[i];
                let tabItem: TabItemModel = {};
                if (dialogField.type === 'General') {
                    if (Object.keys(ganttObj.columnMapping).length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('generalTab');
                    }
                    tabItem.content = 'General';
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
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
                        dialogField.headerText = this.localeObj.getConstant('customTab');
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
        let args: ActionBeginArgs = {
            rowData: this.beforeOpenArgs.rowData as IGanttData,
            name: this.beforeOpenArgs.name as string,
            requestType: this.beforeOpenArgs.requestType as string,
            cancel: this.beforeOpenArgs.cancel as boolean
        };
        this.parent.trigger('actionBegin', isBlazor() ? args : this.beforeOpenArgs, (args: ActionBeginArgs | CObject) => {
            this.renderTabItems();
            if (!args.cancel) {
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
                let actionCompleteArgs: CObject = {
                    action: 'OpenDialog',
                    requestType: this.isEdit ? 'openEditDialog' : 'openAddDialog',
                    data: this.beforeOpenArgs.rowData,
                    element: this.dialog,
                    cancel: false
                };
                if (isBlazor()) {
                    this.parent.updateDataArgs(actionCompleteArgs);
                }
                this.parent.trigger('actionComplete', actionCompleteArgs, (actionCompleteArgs: CObject) => {
                    if (actionCompleteArgs.cancel) {
                        this.resetValues();
                    }
                });
            }
        });
    }

    private tabSelectedEvent(args: SelectEventArgs): void {
        let ganttObj: Gantt = this.parent;
        let id: string = (args.selectedContent.childNodes[0] as HTMLElement).id;
        if (this.parent.isAdaptive) {
            this.responsiveTabContent(id, ganttObj);
        }
        if (id === ganttObj.element.id + 'ResourcesTabContainer') {
            let resourceTreeGrid: TreeGrid = <TreeGrid>(<EJ2Instance>ganttObj.element.querySelector('#' + id)).ej2_instances[0];
            let resources: Object[] = this.ganttResources;
            let currentViewData: Object[] = resourceTreeGrid.getCurrentViewRecords();
            if (resources && resources.length > 0) {
                currentViewData.forEach((data: CObject, index: number): void => {
                    for (let i: number = 0; i < resources.length; i++) {
                        if (data.taskData[ganttObj.resourceFields.id] === resources[i][ganttObj.resourceFields.id] &&
                            !isNullOrUndefined(resourceTreeGrid.selectionModule) &&
                            resourceTreeGrid.getSelectedRowIndexes().indexOf(index) === -1) {
                            resourceTreeGrid.selectRow(index);
                        }
                    }
                });
            }
        } else if (id === ganttObj.element.id + 'NotesTabContainer') {
            ((<EJ2Instance>ganttObj.element.querySelector('#' + id)).ej2_instances[0] as RichTextEditor).refresh();
        }
    }

    private responsiveTabContent(id: string, ganttObj: Gantt): void {
        let dialogContent: HTMLElement = document.getElementById(ganttObj.element.id + '_dialog_dialog-content');
        let dialogContentHeight: number = dialogContent.clientHeight;
        dialogContentHeight -= (dialogContent.querySelector('.e-tab-header') as HTMLElement).offsetHeight;
        let grid: HTMLElement = document.querySelector('#' + id);
        if (grid.classList.contains('e-grid')) {
            dialogContentHeight -= (((grid as EJ2Instance).ej2_instances[0] as Grid).getHeaderContent() as HTMLElement).offsetHeight;
            let toolbar: HTMLElement = grid.querySelector('.e-toolbar');
            if (toolbar) {
                dialogContentHeight -= toolbar.offsetHeight;
            }
        }
        grid.parentElement.style.height = dialogContentHeight + 'px';
    }

    private getFieldsModel(fields: string[]): Object {
        let fieldsModel: Object = {};
        let columnByField: Object = this.parent.columnByField;
        for (let i: number = 0; i < fields.length; i++) {
            if (fields[i] === this.parent.taskFields.dependency ||
                fields[i] === this.parent.taskFields.resourceInfo ||
                fields[i] === this.parent.taskFields.notes) {
                continue;
            }
            if (!isNullOrUndefined(columnByField[fields[i]])) {
                let fieldName: string = fields[i];
                this.createInputModel(columnByField[fieldName], fieldsModel);
            }
        }
        return fieldsModel;
    }
    private createInputModel(column: GanttColumnModel, fieldsModel: Object): Object {
        let ganttObj: Gantt = this.parent;
        let locale: string = this.parent.locale;
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let common: Object = {
            placeholder: column.headerText,
            floatLabelType: 'Auto',
        };
        switch (column.editType) {
            case 'booleanedit':
                let checkboxModel: CheckBoxModel = {
                    label: column.headerText,
                    locale: locale,
                };
                fieldsModel[column.field] = checkboxModel;
                break;
            case 'stringedit':
                let textBox: TextBox = common as TextBox;
                if (column.field === ganttObj.columnMapping.duration) {
                    textBox.change = (args: CObject): void => {
                        this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = common;
                break;
            case 'numericedit':
                let numeric: NumericTextBoxModel = <NumericTextBoxModel>common;
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
            case 'datepickeredit':
                let datePickerObj: DatePickerModel = common as DatePickerModel;
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
            case 'datetimepickeredit':
                let dateTimePickerObj: DatePickerModel = common as DatePickerModel;
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
            case 'dropdownedit':
                if (column.field === 'taskType' || column.field === ganttObj.columnMapping.manual) {
                    let dataKey: string = 'dataSource';
                    let fieldsKey: string = 'fields';
                    let types: Object[] = [
                        { 'ID': 1, 'Value': 'FixedUnit' }, { 'ID': 2, 'Value': 'FixedWork' }, { 'ID': 3, 'Value': 'FixedDuration' }];
                    common[dataKey] = types;
                    common[fieldsKey] = { value: 'Value' };
                    let dropDownListObj: DropDownListModel = common as DropDownListModel;
                    dropDownListObj.change = (args: CObject | ChangeEventArgs): void => {
                        if (column.field === taskSettings.manual) {
                            this.editedRecord.ganttProperties.isAutoSchedule = !args.value as boolean;
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
        let dialog: HTMLElement = ganttObj.editModule.dialogModule.dialog;
        let targetId: string = null; let inputElement: HTMLInputElement;
        let currentData: IGanttData = ganttObj.editModule.dialogModule.editedRecord;
        if (!isNullOrUndefined(args.element)) {
            inputElement = args.element as HTMLInputElement;
            targetId = inputElement.getAttribute('id');
        } else if (!isNullOrUndefined(args.container)) {
            inputElement = args.container as HTMLInputElement;
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId) as HTMLInputElement;
        } else if (!isNullOrUndefined((args.event as CObject).path[1])) {
            inputElement = (args.event as CObject).path[1] as HTMLInputElement;
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId);
        }
        let cellValue: string = inputElement.value;
        let colName: string = targetId.replace(ganttObj.element.id, '');
        this.validateScheduleValuesByCurrentField(colName, cellValue, this.editedRecord);
        let ganttProp: ITaskData = currentData.ganttProperties;
        let tasks: TaskFieldsModel = ganttObj.taskFields;
        if (!isNullOrUndefined(tasks.startDate)) {
            this.updateScheduleFields(dialog, ganttProp, 'startDate');
        }
        if (!isNullOrUndefined(tasks.endDate)) {
            this.updateScheduleFields(dialog, ganttProp, 'endDate');
        }
        if (!isNullOrUndefined(tasks.duration)) {
            this.updateScheduleFields(dialog, ganttProp, 'duration');
        }
        if (!isNullOrUndefined(tasks.work)) {
            this.updateScheduleFields(dialog, ganttProp, 'work');
        }
        this.dialogEditValidationFlag = false;
        return true;
    }

    private updateScheduleFields(dialog: HTMLElement, ganttProp: ITaskData, ganttField: string): void {
        let ganttObj: Gantt = this.parent;
        let ganttId: string = ganttObj.element.id;
        let columnName: string = getValue(ganttField, ganttObj.columnMapping);
        let col: GanttColumnModel = ganttObj.columnByField[columnName];
        let tempValue: string | Date | number;
        if (col.editType === 'stringedit') {
            let textBox: TextBox = <TextBox>(<EJ2Instance>dialog.querySelector('#' + ganttId + columnName)).ej2_instances[0];
            tempValue = !isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read) ? (col.edit.read as Function)() :
            !isNullOrUndefined(col.valueAccessor) ? (col.valueAccessor as Function)
            (columnName, ganttObj.editModule.dialogModule.editedRecord, col) :
            this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
            if (textBox.value !== tempValue.toString()) {
                textBox.value = tempValue as string;
                textBox.dataBind();
            }
        } else if (col.editType === 'datepickeredit' || col.editType === 'datetimepickeredit') {
            let picker: DatePicker = col.editType === 'datepickeredit' ?
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
            let numericTextBox: NumericTextBox = <NumericTextBox>(
                <EJ2Instance>dialog.querySelector('#' + ganttId + columnName)).ej2_instances[0];
            tempValue = ganttProp[ganttField];
            if (!isNullOrUndefined(tempValue)) {
                numericTextBox.value = tempValue as number;
                numericTextBox.dataBind();
            }
        }
    }

    /**
     * @private
     */
    public validateDuration(ganttData: IGanttData): void {
        let ganttProp: ITaskData = ganttData.ganttProperties;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.duration)) {
                this.parent.setRecordValue('endDate', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            } else if (isScheduledTask(ganttProp) || !isNullOrUndefined(ganttProp.startDate)) {
                if (ganttData.ganttProperties.isMilestone && ganttData.ganttProperties.duration !== 0) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                this.parent.dateValidationModule.calculateEndDate(ganttData);
            } else if (!isScheduledTask(ganttProp) && !isNullOrUndefined(ganttProp.endDate)) {
                this.parent.dateValidationModule.calculateStartDate(ganttData);
            }
            let milestone: boolean = ganttProp.duration === 0 ? true : false;
            this.parent.setRecordValue('isMilestone', milestone, ganttProp, true);
            this.dialogEditValidationFlag = true;
        }
    }
    private validateStartDate(ganttData: IGanttData): void {
        let ganttProp: ITaskData = ganttData.ganttProperties;
        let tasks: TaskFieldsModel = this.parent.taskFields;
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
        let ganttProp: ITaskData = ganttData.ganttProperties;
        let tasks: TaskFieldsModel = this.parent.taskFields;
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
     * @param columnName 
     * @param value 
     * @param currentData
     * @private 
     */
    public validateScheduleValuesByCurrentField(columnName: string, value: string, currentData: IGanttData): boolean {
        let ganttObj: Gantt = this.parent;
        let ganttProp: ITaskData = currentData.ganttProperties;
        let taskSettings: TaskFieldsModel = ganttObj.taskFields;
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
                startDate = this.parent.dateValidationModule.checkStartDate(startDate);
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
        if (columnName === 'taskType') {
            this.parent.setRecordValue('taskType', value, ganttProp, true);
        }
        if (taskSettings.manual === columnName) {
            this.parent.editModule.updateTaskScheduleModes(currentData);
        }
        return true;
    }

    private getPredecessorModel(fields: string[]): Object {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['ID', 'Name', 'Type', 'Offset', 'UniqueId'];
        }
        let inputModel: GridModel = {};
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
            },
        ];
        let columns: GridColumnModel[] = [];
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
                    defaultValue: '0 days', validationRules: { required: true }, width: '100px'
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
        let ganttObj: Gantt = this.parent;
        let resourceSettings: ResourceFieldsModel = ganttObj.resourceFields;
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = [resourceSettings.id, resourceSettings.name, resourceSettings.unit, resourceSettings.group];
        }

        let inputModel: TreeGridModel = {
            allowFiltering: true,
            treeColumnIndex: 5,
            editSettings: { allowEditing: true, mode: 'Cell' },
            locale: this.parent.locale,
            allowSelection: true,
            rowHeight: this.parent.isAdaptive ? 48 : null,
            filterSettings: { type: 'Menu' },
            selectionSettings: { checkboxOnly: true, checkboxMode: 'Default', persistSelection: true, type: 'Multiple' }
        };
        let columns: TreeGridColumnModel[] = [
            { type: 'checkbox', allowEditing: false, allowSorting: false, allowFiltering: false, width: 60 },
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
        let inputModel: RichTextEditorModel = {
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
        let tabModel: TabModel = this.beforeOpenArgs.tabModel;
        let items: TabItemModel[] = tabModel.items;
        let index: number = 0;
        for (let i: number = 0; i < items.length; i++) {
            let item: TabItemModel = items[i];
            if (item.content instanceof HTMLElement) {
                continue;
            } else if (item.content === 'General') {
                item.content = this.renderGeneralTab(item.content);
            } else if (item.content === 'Dependency') {
                if (this.editedRecord.hasChildRecords) {
                    item.disabled = true;
                }
                item.content = this.renderPredecessorTab(item.content);
            } else if (item.content === 'Resources') {
                item.content = this.renderResourceTab(item.content);
            } else if (item.content === ('Custom' + '' + index)) {
                item.content = this.renderCustomTab(item.content);
                index++;
            } else if (item.content === 'Notes') {
                item.content = this.renderNotesTab(item.content);
            }
        }
    }
    private renderGeneralTab(itemName: string): HTMLElement {
        let ganttObj: Gantt = this.parent;
        let itemModel: Object = this.beforeOpenArgs[itemName];
        let divElement: HTMLElement = this.createDivElement('e-edit-form-row', ganttObj.element.id
            + '' + itemName + 'TabContainer');
        for (let key of Object.keys(itemModel)) {
            if (this.parent.columnByField[key].visible === false) {
                continue;
            }
            let column: GanttColumnModel = this.parent.columnByField[key];
            let inputModel: { [key: string]: Object } = itemModel[key];
            divElement.appendChild(this.renderInputElements(inputModel, column));
        }
        return divElement;
    }

    private isCheckIsDisabled(column: GanttColumnModel): boolean {
        let disabled: boolean = false;
        if (column.allowEditing === false || column.isPrimaryKey || this.parent.readOnly) {
            if (this.parent.customColumns.indexOf(column.field) !== -1) {
                disabled = true;
            } else {
                if (column.field === this.parent.taskFields.id) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.name) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.duration) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.progress) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.startDate) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.endDate) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.baselineStartDate) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.baselineEndDate) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.work) {
                    disabled = true;
                } else if (column.field === 'taskType') {
                    disabled = true;
                }
            }
        }
        if (this.isEdit) {
            if (column.field === this.parent.taskFields.id) {
                disabled = true;
            }
            if (this.editedRecord.hasChildRecords) {
                if (column.field === this.parent.taskFields.endDate) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.duration) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.progress) {
                    disabled = true;
                } else if (column.field === this.parent.taskFields.work) {
                    disabled = true;
                } else if (column.field === 'taskType') {
                    disabled = true;
                }
            }
        }
        return disabled;
    }

    private renderPredecessorTab(itemName: string): HTMLElement {
        let ganttObj: Gantt = this.parent;
        let gridModel: GridModel = this.beforeOpenArgs[itemName];
        let dependencyColumn: GanttColumnModel = this.parent.columnByField[this.parent.taskFields.dependency];
        if (dependencyColumn.allowEditing === false || dependencyColumn.isPrimaryKey || this.parent.readOnly) {
            gridModel.editSettings.allowEditing = false;
            gridModel.editSettings.allowAdding = false;
            gridModel.editSettings.allowDeleting = false;
        }
        let ganttData: IGanttData = this.beforeOpenArgs.rowData;
        let preData: IPreData[] = [];
        this.taskNameCollection();
        if (this.isEdit) {
            preData = this.predecessorEditCollection(ganttData);
            this.updatePredecessorDropDownData(ganttData);
        }
        gridModel.dataSource = preData;
        gridModel.actionBegin = this.gridActionBegin.bind(this);
        let columns: GridColumnModel[] = <GridColumnModel[]>gridModel.columns;
        columns[1].edit = {
            write: (args: CObject): void => {
                if (getValue('requestType', args) === 'add') {
                    setValue('rowData.uniqueId', getUid(), args);
                }
                let field: string = 'name';
                let autoObj: ComboBox = new ComboBox({
                    dataSource: new DataManager(this.idCollection),
                    popupHeight: '180px',
                    allowCustom: false,
                    fields: { value: 'text' },
                    value: args.rowData[field],
                    change: (args: ChangeEventArgs) => {
                        let tr: HTMLElement = closest(args.element, 'tr') as HTMLElement;
                        let idInput: HTMLInputElement = tr.querySelector('#' + this.parent.element.id + 'DependencyTabContainerid');
                        if (idInput) {
                            if (!isNullOrUndefined(args.itemData) && !isNullOrUndefined(args.item)) {
                                idInput.value = (args.itemData as IPreData).id;
                            } else {
                                idInput.value = '';
                            }
                        }
                    },
                    autofill: true,
                });
                autoObj.appendTo(args.element as HTMLElement);
            },
            read: (args: HTMLElement): string => {
                let ej2Instance: ComboBoxModel =
                    <CObject>(<EJ2Instance>args).ej2_instances[0];
                return ej2Instance.value as string;
            }
        };
        Grid.Inject(Edit, Page, GridToolbar, ForeignKey);
        let gridObj: Grid = new Grid(gridModel);
        let divElement: HTMLElement = this.createDivElement('e-dependent-div', ganttObj.element.id + '' + itemName + 'TabContainer');
        gridObj.appendTo(divElement);
        return divElement;
    }

    private gridActionBegin(args: GridActionEventArgs): void {
        let itemName: string =  'Dependency';
        let gridModel: GridModel = this.beforeOpenArgs[itemName] as GridModel;
        if (args.requestType === 'add' || args.requestType === 'beginEdit') {
            let isEdit: boolean = args.requestType === 'add' ? false : true;
            this.idCollection = extend([], [], this.preTableCollection, true) as IDependencyEditData[];
            let gridData: Object[] = gridModel.dataSource as object[];
            for (let i: number = 0; i <= gridData.length; i++) {
                this.idCollection.forEach((data: IDependencyEditData, index: number): void => {
                    if (data.id === getValue('id', gridData[i])) {
                        let selectedItem: object = getValue('rowData', args);
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
            let ganttObj: Gantt = this.parent;
            let treeGridId: HTMLElement = ganttObj.element.querySelector('#' + resourceTreeGridId);
            let resourceTreeGrid: TreeGrid = <TreeGrid>(<EJ2Instance>treeGridId).ej2_instances[0];
            if (!isNullOrUndefined(resourceTreeGrid) && resourceTreeGrid.getSelectedRecords().length > 0) {
                let tempRecords: CObject[] = <CObject[]>resourceTreeGrid.getSelectedRecords();
                let index: number;
                let selectedItems: CObject[] = [];
                for (index = 0; index < tempRecords.length; index++) {
                    selectedItems.push(<CObject>tempRecords[index].taskData);
                }
                this.ganttResources = <Object[]>extend([], selectedItems);
            } else {
                this.ganttResources = [];
            }
        } else {
            this.ganttResources = [];
        }
    }

    private renderResourceTab(itemName: string): HTMLElement {
        let ganttObj: Gantt = this.parent;
        let resourceSettings: ResourceFieldsModel = ganttObj.resourceFields;
        let ganttData: IGanttData = this.beforeOpenArgs.rowData;
        let rowResource: Object[] = ganttData.ganttProperties.resourceInfo;
        let inputModel: TreeGridModel = this.beforeOpenArgs[itemName];
        let resourceTreeGridId: string = ganttObj.element.id + '' + itemName + 'TabContainer';
        let resourceData: Object[] = <Object[]>extend([], [], ganttObj.resources, true);
        this.parent.dataOperation.updateResourceUnit(resourceData);
        if (!isNullOrUndefined(rowResource)) {
            let count: number;
            let rowResourceLength: number = rowResource.length;
            let index: number;
            let resourceDataLength: number = resourceData.length;
            for (count = 0; count < rowResourceLength; count++) {
                for (index = 0; index < resourceDataLength; index++) {
                    if (rowResource[count][resourceSettings.id] === resourceData[index][resourceSettings.id]) {
                        resourceData[index][resourceSettings.unit] = rowResource[count][resourceSettings.unit];
                    }
                }
            }
        }
        inputModel.dataSource = resourceData;
        let resourceInfo: Object[] = ganttData.ganttProperties.resourceInfo;
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

        let divElement: HTMLElement = this.createDivElement('e-resource-div', resourceTreeGridId);
        TreeGrid.Inject(Selection, Filter, TreeGridEdit);
        let treeGridObj: TreeGrid = new TreeGrid(inputModel);
        let resourceColumn: GanttColumnModel = this.parent.columnByField[this.parent.taskFields.resourceInfo];
        if (resourceColumn.allowEditing === false || resourceColumn.isPrimaryKey || this.parent.readOnly) {
            treeGridObj.allowSelection = false;
            treeGridObj.allowFiltering = false;
            treeGridObj.editSettings.allowEditing = false;
        }
        treeGridObj.appendTo(divElement);
        return divElement;
    }
    private renderCustomTab(itemName: string): HTMLElement {
        return this.renderGeneralTab(itemName);
    }

    private renderNotesTab(itemName: string): HTMLElement {
        let ganttObj: Gantt = this.parent;
        let inputModel: RichTextEditorModel = this.beforeOpenArgs[itemName];
        let ganttProp: ITaskData = this.editedRecord.ganttProperties;
        let divElement: HTMLElement = this.createDivElement('', ganttObj.element.id + '' + itemName + 'TabContainer');
        RichTextEditor.Inject(RTEToolbar, Link, HtmlEditor, QuickToolbar, Count);
        inputModel.value = ganttProp.notes;
        let notesColumn: GanttColumnModel = this.parent.columnByField[this.parent.taskFields.notes];
        if (notesColumn.allowEditing === false || notesColumn.isPrimaryKey || this.parent.readOnly) {
            inputModel.enabled = false;
        }
        let rteObj: RichTextEditor = new RichTextEditor(inputModel);
        rteObj.appendTo(divElement);
        return divElement;
    }

    private renderInputElements(inputModel: CObject, column: GanttColumnModel): HTMLElement {
        let ganttId: string = this.parent.element.id;
        let ganttData: IGanttData = this.editedRecord;
        let divElement: HTMLElement = this.createDivElement('e-edit-form-column');
        let inputElement: HTMLElement;
        let editArgs: Object = { column: column, data: ganttData };
        if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
            let create: Function = column.edit.create as Function;
            if (typeof create !== 'string') {
                inputElement = (column.edit.create as Function)(editArgs);
                inputElement.className = '';
                inputElement.setAttribute('type', 'text');
                inputElement.setAttribute('id', ganttId + '' + column.field);
                inputElement.setAttribute('name', column.field);
                inputElement.setAttribute('title', column.field);
                divElement.appendChild(inputElement);
            }
        } else {
            inputElement = this.createInputElement('', ganttId + '' + column.field, column.field);
            divElement.appendChild(inputElement);
        }
        inputModel.enabled = !this.isCheckIsDisabled(column);
        if (column.field === this.parent.taskFields.duration) {
            if (!isNullOrUndefined(column.valueAccessor)) {
                inputModel.value = (column.valueAccessor as Function)(column.field, ganttData, column);
            } else if (isNullOrUndefined(column.edit)) {
                let ganttProp: ITaskData = ganttData.ganttProperties;
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
            if (typeof write !== 'string') {
                let inputObj: Inputs = (column.edit.write as Function)({ column: column, rowData: ganttData, element: inputElement });
                if (column.field === this.parent.taskFields.duration) {
                inputObj.change = (args: CObject): void => {
                    this.validateScheduleFields(args, column, this.parent);
                };
            }
            }
        } else {
            let inputObj: Inputs = new this.inputs[column.editType](inputModel);
            inputObj.appendTo(inputElement);
        }
        return divElement;
    };

    private taskNameCollection(): void {
        let flatData: IGanttData[] = this.parent.flatData;
        this.preTaskIds = [];
        this.preTableCollection = [];
        for (let i: number = 0; i < flatData.length; i++) {
            let data: IGanttData = flatData[i];
            if (data.hasChildRecords) {
                continue;
            }
            let taskId: string = this.parent.viewType === 'ResourceView' ? data.ganttProperties.taskId.toString()
                : data.ganttProperties.rowUniqueID.toString();
            let tempObject: IDependencyEditData = {
                id: taskId,
                text: (taskId + '-' + data.ganttProperties.taskName),
                value: taskId
            };
            this.preTaskIds.push(tempObject.id);
            this.preTableCollection.push(tempObject);
        }
    }

    private predecessorEditCollection(ganttData: IGanttData): IPreData[] {
        let preDataCollection: IPreData[] = [];
        let ganttProp: ITaskData = ganttData.ganttProperties;
        if (this.isEdit && !isNullOrUndefined(this.parent.taskFields.dependency) && !isNullOrUndefined(ganttData) &&
            !isNullOrUndefined(ganttProp.predecessor)) {
            let predecessor: IPredecessor[] = ganttProp.predecessor;
            let idCollection: IDependencyEditData[] = this.preTableCollection;
            for (let i: number = 0; i < predecessor.length; i++) {
                let from: string = predecessor[i].from.toString();
                let preData: IPreData = {};
                let taskID: string = this.parent.viewType === 'ResourceView' ? ganttProp.taskId : ganttProp.rowUniqueID;
                if (taskID.toString() !== from) {
                    preData.id = from;
                    for (let index: number = 0; index < idCollection.length; index++) {
                        if (idCollection[index].value === from) {
                            preData.name = idCollection[index].text;
                            break;
                        }
                    }
                    preData.type = predecessor[i].type;
                    let offset: number = predecessor[i].offset;
                    let offsetUnit: string = predecessor[i].offsetUnit;
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
        let id: string = this.parent.viewType === 'ResourceView' ? ganttData.ganttProperties.taskId.toString()
            : ganttData.ganttProperties.rowUniqueID.toString();
        index = this.preTaskIds.indexOf(id);
        this.preTableCollection.splice(index, 1);
        this.preTaskIds.splice(index, 1);
        this.validSuccessorTasks(ganttData, this.preTaskIds, this.preTableCollection);
    }

    private validSuccessorTasks(data: IGanttData, ids: string[], idCollection: IDependencyEditData[]): void {
        let ganttProp: ITaskData = data.ganttProperties;
        if (ganttProp.predecessor && ganttProp.predecessor.length > 0) {
            let predecessor: IPredecessor[] = ganttProp.predecessor;
            let fromId: string = this.parent.viewType === 'ResourceView' ? ganttProp.taskId.toString() : ganttProp.rowUniqueID.toString();
            predecessor.forEach((item: IPredecessor) => {
                if (item.from.toString() === fromId) {
                    let toId: string = item.to; let idIndex: number = -1;
                    idIndex = ids.indexOf(toId);
                    if (idIndex > -1) {
                        ids.splice(idIndex, 1);
                        idCollection.splice(idIndex, 1);
                    }
                    let ganttData: IGanttData = this.parent.connectorLineModule.getRecordByID(toId);
                    this.validSuccessorTasks(ganttData, ids, idCollection);
                }
            });
        }
    }

    private getPredecessorType(): IDependencyEditData[] {
        let typeText: string[] = [this.parent.getPredecessorTextValue('SS'), this.parent.getPredecessorTextValue('SF'),
        this.parent.getPredecessorTextValue('FS'), this.parent.getPredecessorTextValue('FF')];
        let types: IDependencyEditData[] = [
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
        let ganttObj: Gantt = this.parent;
        let tabModel: TabModel = this.beforeOpenArgs.tabModel;
        let items: TabItemModel[] = tabModel.items;
        for (let i: number = 0; i < items.length; i++) {
            let element: HTMLElement = items[i].content as HTMLElement;
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
                }
            }
        }
        if (this.isEdit) {
            /**
             * If any update on edited task do it here
             */
            this.parent.dataOperation.updateWidthLeft(this.rowData);
            let editArgs: ITaskbarEditedEventArgs = {
                data: this.rowData,
                action: 'DialogEditing'
            };
            this.parent.editModule.initiateUpdateAction(editArgs);
        } else {
            if (this.parent.viewType === 'ResourceView') {
                let newRecords: Object = extend({}, this.addedRecord, true);
                if (newRecords[this.parent.taskFields.resourceInfo].length) {
                    for (let i: number = 0; i < newRecords[this.parent.taskFields.resourceInfo].length; i++) {
                        let id: string = newRecords[this.parent.taskFields.resourceInfo][i].toString();
                        let parentRecordIndex: number = this.parent.getTaskIds().indexOf('R' + id.toString());
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
    private updateGeneralTab(generalForm: HTMLElement, isCustom: boolean): void {
        let ganttObj: Gantt = this.parent;
        let childNodes: NodeList = generalForm.childNodes;
        let tasksData: Object = {};
        if (!this.isEdit) {
            tasksData = this.addedRecord;
        }
        for (let i: number = 0; i < childNodes.length; i++) {
            let div: HTMLElement = childNodes[i] as HTMLElement;
            let inputElement: HTMLInputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                let fieldName: string = inputElement.id.replace(ganttObj.element.id, '');
                let controlObj: CObject = <CObject>(<EJ2Instance>div.querySelector('#' + ganttObj.element.id + fieldName)).ej2_instances[0];
                let column: GanttColumnModel = ganttObj.columnByField[fieldName];
                if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
                    let read: Function = column.edit.read as Function;
                    if (typeof read !== 'string') {
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
    }
    private updatePredecessorTab(preElement: HTMLElement): void {
        let gridObj: Grid = <Grid>(<EJ2Instance>preElement).ej2_instances[0];
        if (gridObj.isEdit) {
            gridObj.endEdit();
        }
        let dataSource: IPreData[] = <IPreData[]>gridObj.dataSource;
        let predecessorName: string[] = [];
        let newValues: IPredecessor[] = [];
        let predecessorString: string = '';
        let ids: string[] = [];
        for (let i: number = 0; i < dataSource.length; i++) {
            let preData: IPreData = dataSource[i];
            let newId: string = preData.name.split('-')[0];
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
        let treeGridObj: TreeGrid = <TreeGrid>(<EJ2Instance>resourceElement).ej2_instances[0];
        if (treeGridObj) {
            treeGridObj.grid.endEdit();
        }
        let selectedItems: CObject[] = <CObject[]>this.ganttResources;
        if (this.parent.viewType === 'ResourceView' && !isNullOrUndefined(this.rowData.ganttProperties)) {
            if (JSON.stringify(this.ganttResources) !== JSON.stringify(this.rowData.ganttProperties.resourceInfo)) {
                this.isResourceUpdate = true;
                this.previousResource = !isNullOrUndefined(this.rowData.ganttProperties.resourceInfo) ?
                    [...this.rowData.ganttProperties.resourceInfo] : [];
            } else {
                this.isResourceUpdate = false;
            }
        }
        let idArray: object[] = [];
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
        let ganttObj: Gantt = this.parent;
        let rte: RichTextEditor = <RichTextEditor>(<EJ2Instance>notesElement).ej2_instances[0];
        if (this.isEdit) {
            this.parent.setRecordValue('notes', rte.getHtml(), this.rowData.ganttProperties, true);
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
