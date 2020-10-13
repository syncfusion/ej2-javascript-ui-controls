import { KeyboardEventArgs, L10n, closest, addClass } from '@syncfusion/ej2-base';
import { extend, getValue, resetBlazorTemplate, updateBlazorTemplate, isBlazor } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs, IEdit } from '../base/interface';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { BooleanEditCell } from '../renderer/boolean-edit-cell';
import { DropDownEditCell } from '../renderer/dropdown-edit-cell';
import { NumericEditCell } from '../renderer/numeric-edit-cell';
import { DefaultEditCell } from '../renderer/default-edit-cell';
import { InlineEdit } from './inline-edit';
import { BatchEdit } from './batch-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';
import { parentsUntil, getComplexFieldID, setComplexFieldID, getScrollBarWidth } from '../base/util';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DatePickerEditCell } from '../renderer/datepicker-edit-cell';
import { calculateRelativeBasedPosition, OffsetPosition } from '@syncfusion/ej2-popups';
import { EJ2Intance } from '../base/interface';
import { TemplateEditCell } from '../renderer/template-edit-cell';
import { DataUtil } from '@syncfusion/ej2-data';
import { Row } from '../models/row';

/**
 * The `Edit` module is used to handle editing actions.
 */
export class Edit implements IAction {
    //Internal variables                  
    private edit: Edit;
    protected renderer: EditRender;
    private editModule: IEdit;
    /** @hidden */
    public formObj: FormValidator;
    public mFormObj: FormValidator;
    private static editCellType: Object = {
        'dropdownedit': DropDownEditCell, 'numericedit': NumericEditCell,
        'datepickeredit': DatePickerEditCell, 'datetimepickeredit': DatePickerEditCell,
        'booleanedit': BooleanEditCell, 'defaultedit': DefaultEditCell,
        'templateedit': TemplateEditCell
    };
    private editType: Object = { 'Inline': InlineEdit, 'Normal': InlineEdit, 'Batch': BatchEdit, 'Dialog': DialogEdit };
    //Module declarations
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected l10n: L10n;
    private dialogObj: Dialog;
    private alertDObj: Dialog;
    private actionBeginFunction: Function;
    private actionCompleteFunction: Function;
    private preventObj: {
        instance: Object,
        handler: Function, arg1?: Object, arg2?: Object, arg3?: Object, arg4?: Object, arg5?: Object, arg6?: Object, arg7?: Object,
        arg8?: Object
    };
    /* @hidden */
    public isLastRow?: boolean;
    /* @hidden */
    public deleteRowUid: string;
    /**
     * Constructor for the Grid editing module
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.addEventListener();
        this.updateEditObj();
        this.createAlertDlg();
        this.createConfirmDlg();
    }

    private updateColTypeObj(): void {
        let cols: Column[] = (<{columnModel?: Column[]}>this.parent).columnModel;
        for (let i: number = 0; i < cols.length; i++) {
            if (this.parent.editSettings.template || cols[i].editTemplate) {
                let templteCell: string = 'templateedit';
                cols[i].edit = extend(new Edit.editCellType[templteCell](this.parent), cols[i].edit || {});
            } else {
                cols[i].edit = extend(
                    new Edit.editCellType[cols[i].editType && Edit.editCellType[cols[i].editType] ?
                        cols[i].editType : 'defaultedit'](this.parent, this.serviceLocator),
                    cols[i].edit || {}
                );
            }
        }
        this.parent.log('primary_column_missing');
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'edit';
    }

    /**
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        let gObj: IGrid = this.parent;
        let newProp: Object = e.properties;
        for (let prop of Object.keys(e.properties)) {
            switch (prop) {
                case 'allowAdding':
                case 'allowDeleting':
                case 'allowEditing':
                    if (gObj.editSettings.allowAdding || gObj.editSettings.allowEditing || gObj.editSettings.allowDeleting) {
                        this.initialEnd();
                    }
                    break;
                case 'mode':
                    this.updateEditObj();
                    gObj.isEdit = false;
                    gObj.refresh();
                    break;
            }
        }
    }

    private updateEditObj(): void {
        if (this.editModule) {
            this.editModule.destroy();
        }
        this.renderer = new EditRender(this.parent, this.serviceLocator);
        this.editModule = new this.editType[this.parent.editSettings.mode](this.parent, this.serviceLocator, this.renderer);
    }

    private initialEnd(): void {
        this.updateColTypeObj();
    }

    /**
     * Edits any bound record in the Grid by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    public startEdit(tr?: HTMLTableRowElement): void {
        let gObj: IGrid = this.parent;
        if (!gObj.editSettings.allowEditing || gObj.isEdit || gObj.editSettings.mode === 'Batch') {
            return;
        }
        this.parent.element.classList.add('e-editing');
        if (!gObj.getSelectedRows().length) {
            if (!tr) {
                this.showDialog('EditOperationAlert', this.alertDObj);
                return;
            }
        } else if (!tr) {
            tr = gObj.getSelectedRows()[0] as HTMLTableRowElement;
        }
        this.isLastRow = tr.rowIndex === (this.parent.getContent().querySelector('tr:last-child') as HTMLTableRowElement).rowIndex;
        if (tr.style.display === 'none') {
            return;
        }
        this.editModule.startEdit(tr);
        if (!isBlazor()) {
            this.refreshToolbar();
            (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
            this.parent.notify('start-edit', {});
        }
    }

    /**
     * @hidden
     */
    public checkLastRow(tr: Element, args?: { row?: Element, requestType?: string }): void {
        let checkLastRow: boolean = this.isLastRow;
        if (this.parent.height !== 'auto' && this.parent.editSettings.newRowPosition === 'Bottom' && args &&
            args.requestType === 'add' && this.parent.height > this.parent.getContentTable().scrollHeight) {
            addClass(tr.querySelectorAll('.e-rowcell'), 'e-lastrowadded');
        } else if (checkLastRow && tr && tr.classList) {
            addClass(tr.querySelectorAll('.e-rowcell'), 'e-lastrowcell');
        }
    }

    /**
     * Cancels edited state.
     */
    public closeEdit(): void {
        if (this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.showConfirmDialog
            && this.parent.element.querySelectorAll('.e-updatedtd').length) {
            this.showDialog('CancelEdit', this.dialogObj);
            return;
        }
        this.parent.element.classList.remove('e-editing');
        this.editModule.closeEdit();
        if (!isBlazor()) {
            this.refreshToolbar();
            this.parent.notify('close-edit', {});
        }
    }

    protected refreshToolbar(): void {
        this.parent.notify(events.toolbarRefresh, {});
    }

    /**
     * To adds a new row at the top with the given data. When data is not passed, it will add empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added
     */
    public addRecord(data?: Object, index?: number): void {
        if (!this.parent.editSettings.allowAdding) {
            return;
        }
        let args: { startEdit: boolean } = { startEdit: true };
        if (!data) {
            this.parent.notify(events.virtualScrollAddActionBegin, args);
        }
        if (args.startEdit) {
            this.parent.element.classList.add('e-editing');
            this.editModule.addRecord(data, index);
            if (!isBlazor()) {
                this.refreshToolbar();
                this.parent.notify('start-add', {});
            }
        }
    }

    /**
     * Deletes a record with the given options. If fieldname and data are not given, the Grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldname - Defines the primary key field name of the column.
     * @param {Object} data - Defines the JSON data record to be deleted.
     */
    public deleteRecord(fieldname?: string, data?: Object): void {
        let gObj: IGrid = this.parent;
        if (!gObj.editSettings.allowDeleting) {
            return;
        }
        if (!data) {
            if (!gObj.getSelectedRecords().length && isNullOrUndefined(gObj.commandDelIndex)) {
                this.showDialog('DeleteOperationAlert', this.alertDObj);
                return;
            }
        }
        if (gObj.editSettings.showDeleteConfirmDialog) {
            this.showDialog('ConfirmDelete', this.dialogObj);
            return;
        }
        this.editModule.deleteRecord(fieldname, data);

    }

    /**
     * Deletes a visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    public deleteRow(tr: HTMLTableRowElement): void {
        this.deleteRowUid = tr.getAttribute('data-uid');
        let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.deleteRowUid);
        if (!isNullOrUndefined(rowObj)) {
            this.deleteRecord(null, rowObj.data);
        }
    }

    /**
     * If Grid is in editable state, you can save a record by invoking endEdit.
     */
    public endEdit(): void {
        if (this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.showConfirmDialog &&
            (isNullOrUndefined(this.formObj) || this.formObj.validate())) {
            this.parent.editModule.saveCell();
            this.parent.notify(events.editNextValCell, {});
            if (isNullOrUndefined(this.formObj) || this.formObj.validate()) {
                this.showDialog('BatchSaveConfirm', this.dialogObj);
                return;
            }
        }
        this.endEditing();
    }

    /**
     * To update the specified cell by given value without changing into edited state. 
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     */
    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        this.editModule.updateCell(rowIndex, field, value);
    }

    /**
     * To update the specified row by given values without changing into edited state.
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     */
    public updateRow(index: number, data: Object): void {
        this.editModule.updateRow(index, data);
    }

    /**
     * Resets added, edited, and deleted records in the batch mode.
     */
    public batchCancel(): void {
        this.closeEdit();
    }

    /**
     * Bulk saves added, edited, and deleted records in the batch mode.
     */
    public batchSave(): void {
        this.endEdit();
    }

    /**
     * Changes a particular cell into edited state based on the row index and field name provided in the `batch` mode.
     * @param {number} index - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform batch edit.
     */
    public editCell(index: number, field: string): void {
        this.editModule.editCell(index, field);
    }

    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    public editFormValidate(): boolean {
        if (this.formObj) {
            return this.formObj.validate();
        }
        return false;
    }

    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     * @return {Object}
     */
    public getBatchChanges(): Object {
        return this.editModule.getBatchChanges ? this.editModule.getBatchChanges() : {};
    }

    /**
     * Gets the current value of the edited component.
     */
    public getCurrentEditCellData(): Object {
        let obj: Object = this.getCurrentEditedData(this.formObj.element, {});
        return obj[Object.keys(obj)[0]];
    }

    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     */
    public saveCell(): void {
        this.editModule.saveCell();
    }

    private endEditing(): void {
        this.parent.element.classList.remove('e-editing');
        this.editModule.endEdit();
        this.refreshToolbar();
    }

    private showDialog(content: string, obj: Dialog): void {
        obj.content = '<div>' + this.l10n.getConstant(content) + '</div>';
        obj.dataBind();
        obj.show();
    }

    public getValueFromType(col: Column, value: string | Date | boolean): number | string | Date | boolean {
        let val: number | string | Date | boolean = value;
        switch (col.type) {
            case 'number':
                val = !isNaN(parseFloat(value as string)) ? parseFloat(value as string) : null;
                break;
            case 'boolean':
                if (col.editType !== 'booleanedit') {
                    val = value === this.l10n.getConstant('True') || value === true ? true : false;
                }
                break;
            case 'date':
            case 'datetime':
                if (col.editType !== 'datepickeredit' && col.editType !== 'datetimepickeredit'
                && value && (value as string).length) {
                    val = new Date(value as string);
                } else if (value === '') {
                    val = null;
                }
                break;
        }
        return val;
    }

    private destroyToolTip(): void {
        let elements: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-griderror'));
        for (let elem of elements) {
            remove(elem);
        }
        (this.parent.getContent().firstElementChild as HTMLElement).style.position = 'relative';
    }

    private createConfirmDlg(): void {
        this.dialogObj = this.dlgWidget(
            [
                {
                    click: this.dlgOk.bind(this),
                    buttonModel: { content: this.l10n.getConstant('OKButton'), cssClass: 'e-primary', isPrimary: true }
                },
                {
                    click: this.dlgCancel.bind(this),
                    buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('CancelButton') }
                }
            ],
            'EditConfirm');
    }

    private createAlertDlg(): void {
        this.alertDObj = this.dlgWidget(
            [
                {
                    click: this.alertClick.bind(this), buttonModel:
                        { content: this.l10n.getConstant('OKButton'), cssClass: 'e-flat', isPrimary: true }
                }
            ],
            'EditAlert');
    }

    private alertClick(): void {
        this.alertDObj.hide();
    }

    private dlgWidget(btnOptions: Object[], name: string): Dialog {
        let div: HTMLElement = this.parent.createElement('div', { id: this.parent.element.id + name });
        this.parent.element.appendChild(div);
        let options: Object = {
            showCloseIcon: false,
            isModal: true,
            visible: false,
            closeOnEscape: true,
            target: this.parent.element,
            width: '320px',
            animationSettings: { effect: 'None' }
        };
        (options as { buttons: Object[] }).buttons = btnOptions;
        let obj: Dialog = new Dialog(options);
        let isStringTemplate: string = 'isStringTemplate';
        obj[isStringTemplate] = true;
        obj.appendTo(div);
        return obj;
    }

    private dlgCancel(): void {
        this.parent.focusModule.clearIndicator();
        this.parent.focusModule.restoreFocus();
        this.dialogObj.hide();
    }

    private dlgOk(e: MouseEvent): void {
        switch ((this.dialogObj.element.querySelector('.e-dlg-content').firstElementChild as HTMLElement).innerText) {
            case this.l10n.getConstant('ConfirmDelete'):
                this.editModule.deleteRecord();
                break;
            case this.l10n.getConstant('CancelEdit'):
                this.editModule.closeEdit();
                break;
            case this.l10n.getConstant('BatchSaveConfirm'):
                this.endEditing();
                break;
            case this.l10n.getConstant('BatchSaveLostChanges'):
                if (this.parent.editSettings.mode === 'Batch') {
                    this.editModule.addCancelWhilePaging();
                    if (isBlazor() && this.parent.isServerRendered) {
                        this.editModule.closeEdit();
                    }
                }
                this.executeAction();
                break;
        }
        this.dlgCancel();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.initialEnd, this.initialEnd, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.autoCol, this.updateColTypeObj, this);
        this.parent.on(events.tooltipDestroy, this.destroyToolTip, this);
        this.parent.on(events.preventBatch, this.preventBatch, this);
        this.parent.on(events.destroyForm, this.destroyForm, this);
        this.actionBeginFunction = this.onActionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.initialEnd, this.initialEnd);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.autoCol, this.updateColTypeObj);
        this.parent.off(events.tooltipDestroy, this.destroyToolTip);
        this.parent.off(events.preventBatch, this.preventBatch);
        this.parent.off(events.destroyForm, this.destroyForm);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
    }

    private actionComplete(e: NotifyArgs): void {
        let actions: string[] = ['add', 'beginEdit', 'save', 'delete', 'cancel'];
        if (actions.indexOf(e.requestType) < 0) {
            this.parent.isEdit = false;
        }
        if (e.requestType === 'batchsave') {
            this.parent.focusModule.restoreFocus();
        }
        this.refreshToolbar();
    }

    /**
     * @hidden
     */
    public getCurrentEditedData(form: Element, editedData: Object): Object {
        let gObj: IGrid = this.parent;
        if (gObj.editSettings.template) {
            let elements: HTMLInputElement[] = [].slice.call((<HTMLFormElement>form).elements);
            for (let k: number = 0; k < elements.length; k++) {
                if ((elements[k].hasAttribute('name') && (elements[k].className !== 'e-multi-hidden')) ||
                    elements[k].classList.contains('e-multiselect')) {
                    let field: string = (elements[k].hasAttribute('name')) ? setComplexFieldID(elements[k].getAttribute('name')) :
                        setComplexFieldID(elements[k].getAttribute('id'));
                    let column: Column = gObj.getColumnByField(field) || { field: field, type: elements[k].getAttribute('type') } as Column;
                    let value: string | Date | boolean;
                    if (column.type === 'checkbox' || column.type === 'boolean') {
                        value = elements[k].checked;
                    } else if (elements[k].value) {
                        value = elements[k].value;
                        if ((<EJ2Intance>(elements[k] as Element)).ej2_instances &&
                            (<Object[]>(<EJ2Intance>(elements[k] as Element)).ej2_instances).length &&
                            !isNullOrUndefined((<EJ2Intance>(elements[k] as Element)).ej2_instances[0].value)) {
                            elements[k].blur();
                            value = ((<EJ2Intance>(elements[k] as Element)).ej2_instances[0] as { value?: string | boolean | Date }).value;
                            if ((column.type === 'date' || column.type === 'dateTime' || column.type === 'datetime') &&
                                ((<EJ2Intance>(elements[k] as Element)).ej2_instances[0].isServerRendered)) {
                                value = elements[k].value;
                            }
                        }
                    } else if ((<EJ2Intance>(elements[k] as Element)).ej2_instances) {
                        value = ((<EJ2Intance>(elements[k] as Element)).ej2_instances[0] as { value?: string | boolean | Date }).value;
                    }
                    if (column.edit && typeof column.edit.read === 'string') {
                        value = getValue(column.edit.read, window)(elements[k], value);
                    } else if (column.edit && column.edit.read) {
                        value = (column.edit.read as Function)(elements[k], value);
                    }
                    value = gObj.editModule.getValueFromType(column, value) as string;
                    if (elements[k].type === 'radio') {
                        if (elements[k].checked) {
                            DataUtil.setValue(column.field, value, editedData);
                        }
                    } else {
                        DataUtil.setValue(column.field, value, editedData);
                    }
                }
            }
            return editedData;
        }

        let col: Column[] = (<{columnModel?: Column[]}>gObj).columnModel.filter((col: Column) => col.editTemplate);
        for (let j: number = 0; j < col.length; j++) {
            if (form[getComplexFieldID(col[j].field)]) {
                let inputElements: HTMLInputElement[] = [].slice.call(form[getComplexFieldID(col[j].field)]);
                inputElements = inputElements.length ? inputElements : [form[getComplexFieldID(col[j].field)]];
                let temp: HTMLInputElement[] = inputElements.filter((e: HTMLInputElement) =>
                    !isNullOrUndefined(((<EJ2Intance>(e as Element)).ej2_instances)));
                if (temp.length === 0) {
                    temp = inputElements.filter((e: HTMLInputElement) => e.hasAttribute('name'));
                }
                for (let k: number = 0; k < temp.length; k++) {
                    let value: number | string | Date | boolean = this.getValue(col[j], temp[k], editedData);
                    DataUtil.setValue(col[j].field, value, editedData);
                }
            }
        }

        let inputs: HTMLInputElement[] = [].slice.call(form.querySelectorAll('.e-field'));
        for (let i: number = 0, len: number = inputs.length; i < len; i++) {
            let col: Column = gObj.getColumnByUid(inputs[i].getAttribute('e-mappinguid'));
            if (col && col.field) {
                let value:  number | string | Date | boolean = this.getValue(col, inputs[i], editedData);
                DataUtil.setValue(col.field, value, editedData);
            }
        }
        return editedData;
    }

    private getValue(col: Column, input: HTMLInputElement, editedData: Object): string | boolean | number | Date {
        let value: string | boolean | number | Date = (<EJ2Intance>(input as Element)).ej2_instances &&
            !(isBlazor() && (<EJ2Intance>(input as Element)).ej2_instances[0].isServerRendered
            && (col.type === 'date' || col.type === 'datetime')) ?
            (<EJ2Intance>(input as Element)).ej2_instances[0].value : input.value;
        let gObj: IGrid = this.parent;
        let temp: Function = col.edit.read as Function;
        if (col.type === 'checkbox' || col.type === 'boolean') {
            value = input.checked;
        }
        if (typeof temp === 'string') {
            temp = getValue(temp, window);
            value = gObj.editModule.getValueFromType(col, (temp)(input, value));
        } else {
            value = gObj.editModule.getValueFromType(col, (col.edit.read as Function)(input, value));
        }
        if (isNullOrUndefined(editedData[col.field]) && value === '') {
            value = editedData[col.field];
        }
        return value;
    }

    /**
     * @hidden
     */
    public onActionBegin(e: NotifyArgs): void {
        if (e.requestType === 'columnstate' && this.parent.isEdit
        && this.parent.editSettings.mode !== 'Batch') {
            this.closeEdit();
        } else {
            let restrictedRequestTypes: string[] = ['filterafteropen', 'filterbeforeopen', 'filterchoicerequest', 'save', 'infiniteScroll'];
            if (this.parent.editSettings.mode !== 'Batch' && this.formObj && !this.formObj.isDestroyed
                && restrictedRequestTypes.indexOf(e.requestType) === -1 && !e.cancel) {
                this.destroyWidgets();
                this.destroyForm();
            }
        }

    }

    /**
     * @hidden
     */
    public destroyWidgets(cols?: Column[]): void {
        let gObj: IGrid = this.parent;
        if (gObj.editSettings.template) {
            this.parent.destroyTemplate(['editSettingsTemplate']);
            if (this.parent.isReact) {
                this.parent.renderTemplates();
            }
        }
        cols = cols ? cols : this.parent.getVisibleColumns() as Column[];
        if (cols.some((column: Column) => !isNullOrUndefined(column.editTemplate))) {
            this.parent.destroyTemplate(['editTemplate']);
            if (this.parent.isReact) {
                this.parent.renderTemplates();
            }
        }
        for (let col of cols) {
            let temp: Function = col.edit.destroy as Function;
            if (isBlazor() && col.editTemplate) {
                resetBlazorTemplate(this.parent.element.id + col.uid + 'editTemplate', 'EditTemplate');
                updateBlazorTemplate(this.parent.element.id + col.uid + 'editTemplate', 'EditTemplate', col, false);
            }
            if (col.edit.destroy) {
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                    temp();
                } else {
                    (col.edit.destroy as Function)();
                }
            }
        }
        let elements: HTMLInputElement[] = [].slice.call((<HTMLFormElement>this.formObj.element).elements);
        for (let i: number = 0; i < elements.length; i++) {
            if (elements[i].hasAttribute('name')) {
                if ((<EJ2Intance>(elements[i] as Element)).ej2_instances &&
                    (<Object[]>(<EJ2Intance>(elements[i] as Element)).ej2_instances).length &&
                    !(<EJ2Intance>(elements[i] as Element)).ej2_instances[0].isDestroyed) {
                    (<EJ2Intance>(elements[i] as Element)).ej2_instances[0].destroy();
                }
            }
        }
    }

    /**
     * @hidden
     */
    public destroyForm(): void {
        this.destroyToolTip();
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
        this.destroyToolTip();
    }

    /**
     * To destroy the editing. 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (!gridElement) { return; }
        let hasGridChild: Boolean = gridElement.querySelector('.e-gridheader') &&
            gridElement.querySelector('.e-gridcontent') ? true : false;
        if (hasGridChild) { this.destroyForm(); }
        this.removeEventListener();
        let elem: Element = this.dialogObj.element;
        if (elem.childElementCount > 0) {
            this.dialogObj.destroy();
            remove(elem);
        }
        elem = this.alertDObj.element;
        if (elem.childElementCount > 0) {
            this.alertDObj.destroy();
            remove(elem);
        }
        if (!hasGridChild) { return; }
        if (this.editModule) {
            this.editModule.destroy();
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'insert':
                this.addRecord();
                break;
            case 'delete':
                if (((e.target as HTMLElement).tagName !== 'INPUT' || (e.target as HTMLElement).classList.contains('e-checkselect'))
                    && !document.querySelector('.e-popup-open')) {
                    this.deleteRecord();
                }
                break;
            case 'f2':
                this.startEdit();
                break;
            case 'enter':
                if (!parentsUntil(e.target as HTMLElement, 'e-unboundcelldiv') && this.parent.editSettings.mode !== 'Batch' &&
                    (parentsUntil(e.target as HTMLElement, 'e-gridcontent') || (this.parent.frozenRows
                        && parentsUntil(e.target as HTMLElement, 'e-headercontent')))
                    && !document.querySelectorAll('.e-popup-open').length) {
                    e.preventDefault();
                    this.endEdit();
                }
                break;
            case 'escape':
                if (this.parent.isEdit) {
                    if (this.parent.editSettings.mode === 'Batch') {
                        this.editModule.escapeCellEdit();
                    } else {
                        this.closeEdit(); }
                }
                break;
        }
    }

    private preventBatch(args: {
        instance: Object,
        handler: Function, arg1?: Object, arg2?: Object, arg3?: Object,
        arg4?: Object, arg5?: Object, arg6?: Object, arg7?: Object
    }): void {
        this.preventObj = args;
        this.showDialog('BatchSaveLostChanges', this.dialogObj);
    }

    private executeAction(): void {
        this.preventObj.handler.call(
            this.preventObj.instance, this.preventObj.arg1, this.preventObj.arg2, this.preventObj.arg3, this.preventObj.arg4,
            this.preventObj.arg5, this.preventObj.arg6, this.preventObj.arg7, this.preventObj.arg8);
    }

    /**
     * @hidden
     */
    public applyFormValidation(cols?: Column[]): void {
        let gObj: IGrid = this.parent;
        let frzCols: number = gObj.getFrozenColumns();
        let form: HTMLFormElement = this.parent.editSettings.mode !== 'Dialog' ?
        gObj.element.querySelector('.e-gridform') as HTMLFormElement :
        document.querySelector('#' + gObj.element.id + '_dialogEdit_wrapper').querySelector('.e-gridform') as HTMLFormElement;
        let mForm: HTMLFormElement = gObj.element.querySelectorAll('.e-gridform')[1] as HTMLFormElement;
        let rules: Object = {};
        let mRules: Object = {};
        cols = cols ? cols : gObj.getColumns() as Column[];
        for (let i: number = 0; i < cols.length; i++) {
            if (!cols[i].visible) {
                continue;
            }
            if (isBlazor() && cols[i].editTemplate) {
                continue;
            }
            if (i < frzCols && cols[i].validationRules) {
                rules[getComplexFieldID(cols[i].field)] = cols[i].validationRules;
            } else if (i >= frzCols && cols[i].validationRules) {
                mRules[getComplexFieldID(cols[i].field)] = cols[i].validationRules;
            }
        }
        if (frzCols && this.parent.editSettings.mode !== 'Dialog') {
            this.parent.editModule.mFormObj = this.createFormObj(mForm, mRules);
        } else {
            rules = extend(rules, mRules);
        }
        if (isBlazor() && this.parent.editSettings.template) {
            this.parent.editModule.formObj = this.createFormObj(form, {});
        } else {
            this.parent.editModule.formObj = this.createFormObj(form, rules);
        }
    }

    private createFormObj(form: HTMLFormElement, rules: Object): FormValidator {
        return new FormValidator(form, {
            rules: rules as { [name: string]: { [rule: string]: Object } },
            locale: this.parent.locale,
            validationComplete: (args: { status: string, inputName: string, element: HTMLElement, message: string }) => {
                this.validationComplete(args);
            },
            customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                let uid: string = inputElement.getAttribute('e-mappinguid');
                let args: Object = {
                    column: this.parent.getColumnByUid(uid),
                    error: error,
                    inputElement: inputElement,
                    value: (inputElement as HTMLInputElement).value,
                };
                this.valErrorPlacement(inputElement, error);
                this.parent.notify(events.valCustomPlacement, args);
            }
        });
    }

    private valErrorPlacement(inputElement: HTMLElement, error: HTMLElement): void {
        if (this.parent.isEdit) {
            let id: string = error.getAttribute('for');
            let elem: Element = this.getElemTable(inputElement).querySelector('#' + id + '_Error');
            if (!elem) {
                this.createTooltip(inputElement, error, id, '');
            } else {
                elem.querySelector('.e-tip-content').innerHTML = error.outerHTML;
            }
        }
    }

    private getElemTable(inputElement: Element): Element {
        let isFHdr: boolean;
        if (this.parent.editSettings.mode !== 'Dialog') {
            isFHdr = (this.parent.frozenRows && this.parent.frozenRows
                > (parseInt(closest(inputElement, '.e-row').getAttribute('aria-rowindex'), 10) || 0));
        }
        return this.parent.editSettings.mode !== 'Dialog' ? isFHdr ? this.parent.getHeaderTable() : this.parent.getContentTable() :
            document.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper');
    }

    private validationComplete(args: { status: string, inputName: string, element: HTMLElement, message: string }): void {
        if (this.parent.isEdit) {
            let elem: HTMLElement = this.getElemTable(args.element).querySelector('#' + args.inputName + '_Error') as HTMLElement;
            if (elem) {
                if (args.status === 'failure') {
                    elem.style.display = '';
                } else {
                    elem.style.display = 'none';
                }
            }
        }
    }

     // tslint:disable-next-line:max-func-body-length
     private createTooltip(element: Element, error: HTMLElement, name: string, display: string): void {
        let gcontent: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        if (this.parent.getFrozenColumns()) {
            gcontent = this.parent.getMovableVirtualContent() as HTMLElement;
        }
        let isScroll: boolean = gcontent.scrollHeight > gcontent.clientHeight || gcontent.scrollWidth > gcontent.clientWidth;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        let td: Element = closest(element, '.e-rowcell');
        let row: Element = closest(element, '.e-row');
        let fCont: Element = this.parent.getContent().querySelector('.e-frozencontent');
        let isFHdr: boolean;
        let isFHdrLastRow: boolean = false;
        let validationForBottomRowPos: boolean;
        let isBatchModeLastRow: boolean = false;
        let viewPortRowCount: number = Math.round(this.parent.getContent().clientHeight / this.parent.getRowHeight()) - 1;
        let rows: Element[] = !fCont ? [].slice.call(this.parent.getContent().querySelectorAll('.e-row'))
            : [].slice.call(this.parent.getFrozenVirtualContent().querySelectorAll('.e-row'));
        if (this.parent.editSettings.mode === 'Batch') {
            if (viewPortRowCount > 1 && rows.length >= viewPortRowCount
                && rows[rows.length - 1].getAttribute('aria-rowindex') === row.getAttribute('aria-rowindex')) {
                isBatchModeLastRow = true;
            }
        }
        if (isInline) {
            if (this.parent.frozenRows) {
                let fHeraderRows: HTMLCollection = this.parent.getFrozenColumns() ?
                    this.parent.getFrozenVirtualHeader().querySelector('tbody').children
                    : this.parent.getHeaderTable().querySelector('tbody').children;
                isFHdr = fHeraderRows.length > (parseInt(row.getAttribute('aria-rowindex'), 10) || 0);
                isFHdrLastRow = isFHdr && parseInt(row.getAttribute('aria-rowindex'), 10) === fHeraderRows.length - 1;
            }
            if (isFHdrLastRow || (viewPortRowCount > 1 && rows.length >= viewPortRowCount
                && ((this.parent.editSettings.newRowPosition === 'Bottom' && (this.editModule.args
                    && this.editModule.args.requestType === 'add')) || (td.classList.contains('e-lastrowcell')
                        && !row.classList.contains('e-addedrow')))) || isBatchModeLastRow) {
                validationForBottomRowPos = true;
            }
        }
        let table: Element = isInline ?
            (isFHdr ? this.parent.getHeaderTable() : this.parent.getContentTable()) :
            document.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper').querySelector('.e-dlg-content');
        let client: ClientRect = table.getBoundingClientRect();
        let left: number = isInline ?
            this.parent.element.getBoundingClientRect().left : client.left;
        let input: HTMLElement = closest(element, 'td') as HTMLElement;
        let inputClient: ClientRect = input ? input.getBoundingClientRect() : element.parentElement.getBoundingClientRect();
        let div: HTMLElement = this.parent.createElement('div', {
            className: 'e-tooltip-wrap e-lib e-control e-popup e-griderror',
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                ((isFHdr ? inputClient.top + inputClient.height : inputClient.bottom - client.top
                    - (this.parent.getFrozenColumns() ? fCont.scrollTop : 0)) + table.scrollTop + 9) + 'px;left:' +
                (inputClient.left - left + table.scrollLeft + inputClient.width / 2) + 'px;' +
                'max-width:' + inputClient.width + 'px;text-align:center;'
        });

        if (isInline && client.left < left) {
            div.style.left = parseInt(div.style.left, 10) - client.left + left + 'px';
        }
        let content: Element = this.parent.createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        let arrow: Element;
        if (validationForBottomRowPos) {
            arrow = this.parent.createElement('div', { className: 'e-arrow-tip e-tip-bottom' });
            arrow.appendChild(this.parent.createElement('div', { className: 'e-arrow-tip-outer e-tip-bottom' }));
            arrow.appendChild(this.parent.createElement('div', { className: 'e-arrow-tip-inner e-tip-bottom' }));
        } else {
            arrow = this.parent.createElement('div', { className: 'e-arrow-tip e-tip-top' });
            arrow.appendChild(this.parent.createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
            arrow.appendChild(this.parent.createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        }
        div.appendChild(content);
        div.appendChild(arrow);
        if ((this.parent.getFrozenColumns() || this.parent.frozenRows) && this.parent.editSettings.mode !== 'Dialog') {
            let getEditCell: HTMLElement = this.parent.editSettings.mode === 'Normal' ?
                closest(element, '.e-editcell') as HTMLElement : closest(element, '.e-table') as HTMLElement;
            getEditCell.style.position = 'relative';
            div.style.position = 'absolute';
            if (this.parent.editSettings.mode === 'Batch' ||
                (closest(element, '.e-frozencontent') || closest(element, '.e-frozenheader'))
                || (this.parent.frozenRows && !this.parent.getFrozenColumns())) {
                this.formObj.element.appendChild(div);
            } else {
                this.mFormObj.element.appendChild(div);
            }
        } else {
            this.formObj.element.appendChild(div);
        }
        if (!validationForBottomRowPos && isInline && gcontent.getBoundingClientRect().bottom < inputClient.bottom + inputClient.height) {
            gcontent.scrollTop = gcontent.scrollTop + div.offsetHeight + arrow.scrollHeight;
        }
        let lineHeight: number = parseInt(
            document.defaultView.getComputedStyle(div, null).getPropertyValue('font-size'), 10
        );
        if (div.getBoundingClientRect().width < inputClient.width &&
            div.querySelector('label').getBoundingClientRect().height / (lineHeight * 1.2) >= 2) {
            div.style.width = div.style.maxWidth;
        }
        if ((this.parent.getFrozenColumns() || this.parent.frozenRows)
            && (this.parent.editSettings.mode === 'Normal' || this.parent.editSettings.mode === 'Batch')) {
            div.style.left = input.offsetLeft + (input.offsetWidth / 2 - div.offsetWidth / 2) + 'px';
        } else {
            div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
        }
        if (isInline && !isScroll && !this.parent.allowPaging || this.parent.getFrozenColumns() || this.parent.frozenRows) {
            gcontent.style.position = 'static';
            let pos: OffsetPosition = calculateRelativeBasedPosition(input, div);
            div.style.top = pos.top + inputClient.height + 9 + 'px';
        }
        if (validationForBottomRowPos) {
            if (isScroll && !this.parent.getFrozenColumns() && this.parent.height !== 'auto' && !this.parent.frozenRows
                && !this.parent.enableVirtualization) {
                let scrollWidth: number = gcontent.scrollWidth > gcontent.offsetWidth ? getScrollBarWidth() : 0;
                div.style.bottom = ((this.parent.height as number) - gcontent.querySelector('table').offsetHeight
                    - scrollWidth) + inputClient.height + 9 + 'px';
            } else {
                div.style.bottom = inputClient.height + 9 + 'px';
            }
            if (rows.length < viewPortRowCount && this.parent.editSettings.newRowPosition === 'Bottom' && (this.editModule.args
                && this.editModule.args.requestType === 'add')) {
                let rowsCount: number = this.parent.frozenRows ? this.parent.frozenRows + (rows.length - 1) : rows.length - 1;
                let rowsHeight: number = rowsCount * this.parent.getRowHeight();
                let position: number = this.parent.getContent().clientHeight - rowsHeight;
                div.style.bottom = position + 9 + 'px';
            }
            div.style.top = null;
        }
    }
    /**
     * @hidden
     */
    public checkColumnIsGrouped(col: Column): boolean {
        return !col.visible && !(this.parent.groupSettings.columns.indexOf(col.field) > -1);
    }

    /**
     * @hidden
     */
    public static AddEditors(editors: object): void {
        Edit.editCellType = extend(Edit.editCellType, editors);
    }
}
