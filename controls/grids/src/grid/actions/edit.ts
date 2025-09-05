import { KeyboardEventArgs, L10n, closest, addClass, select, updateCSSText } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
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
import { parentsUntil, getComplexFieldID, getParsedFieldID, setComplexFieldID, getScrollBarWidth, setValidationRuels } from '../base/util';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DatePickerEditCell } from '../renderer/datepicker-edit-cell';
import { calculateRelativeBasedPosition, OffsetPosition } from '@syncfusion/ej2-popups';
import { EJ2Intance } from '../base/interface';
import { TemplateEditCell } from '../renderer/template-edit-cell';
import { DataUtil } from '@syncfusion/ej2-data';
import { Row } from '../models/row';
import { addRemoveEventListener, padZero, getParentIns } from '../base/util';
import { Matrix } from '../services/focus-strategy';
import * as literals from '../base/string-literals';

/**
 * The `Edit` module is used to handle editing actions.
 */
export class Edit implements IAction {
    //Internal variables
    protected renderer: EditRender;
    /** @hidden */
    public editModule: IEdit;
    /** @hidden */
    public formObj: FormValidator;
    /** @hidden */
    public virtualFormObj: FormValidator;
    /** @hidden */
    public isShowAddedRowValidate: boolean = false;
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
    /* @hidden */
    public dialogObj: Dialog;
    private fieldname: string = '';
    private data: Object = {};
    /* @hidden */
    public alertDObj: Dialog;
    private actionBeginFunction: Function;
    private actionCompleteFunction: Function;
    private onDataBoundFunction: Function;
    private preventObj: {
        instance: Object,
        handler: Function, arg1?: Object, arg2?: Object, arg3?: Object, arg4?: Object, arg5?: Object, arg6?: Object, arg7?: Object,
        arg8?: Object
    };
    private eventDetails: { event: string, handler: Function }[];
    /* @hidden */
    public isLastRow?: boolean;
    /* @hidden */
    public deleteRowUid: string;
    /* @hidden */
    public editCellDialogClose: boolean = false;
    /**
     * Constructor for the Grid editing module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the servicelocator
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
        const cols: Column[] = (<{columnModel?: Column[]}>this.parent).columnModel;
        for (let i: number = 0; i < cols.length; i++) {
            if (this.parent.editSettings.template || cols[parseInt(i.toString(), 10)].editTemplate) {
                const templteCell: string = 'templateedit';
                cols[parseInt(i.toString(), 10)].edit = extend(new Edit.editCellType[`${templteCell}`](this.parent),
                                                               cols[parseInt(i.toString(), 10)].edit || {});
            } else {
                cols[parseInt(i.toString(), 10)].edit = extend(
                    new Edit.editCellType[cols[parseInt(i.toString(), 10)].editType
                        && Edit.editCellType[cols[parseInt(i.toString(), 10)].editType] ?
                        cols[parseInt(i.toString(), 10)].editType : 'defaultedit'](this.parent, this.serviceLocator),
                    cols[parseInt(i.toString(), 10)].edit || {}
                );
            }
        }
        this.parent.log('primary_column_missing');
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'edit';
    }

    /**
     * @param {NotifyArgs} e - specifies the notifyargs
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const gObj: IGrid = this.parent;
        for (const prop of Object.keys(e.properties)) {
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
                gObj.isEdit = gObj.editSettings.showAddNewRow ? true : false;
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
     *
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     * @returns {void}
     */
    public startEdit(tr?: HTMLTableRowElement): void {
        const gObj: IGrid = this.parent;
        const isTreeGrid: string = 'isTreeGrid';
        if (!gObj.editSettings.allowEditing || (gObj.isEdit && (!gObj.editSettings.showAddNewRow ||
            (gObj.editSettings.showAddNewRow && !isNullOrUndefined(gObj.element.querySelector('.' + literals.editedRow)))))
            || gObj.editSettings.mode === 'Batch') {
            return;
        }
        this.parent.element.classList.add('e-editing');
        if (!gObj.getSelectedRows().length || isNullOrUndefined(this.parent.getRowByIndex(
            parseInt(this.parent.getSelectedRows()[0].getAttribute('aria-rowindex'), 10) - 1))) {
            if (!tr) {
                this.showDialog('EditOperationAlert', this.alertDObj);
                return;
            }
        } else if (!tr) {
            if (this.parent[`${isTreeGrid}`] && this.parent.allowPaging && gObj.selectionModule.selectedRowIndexes.length) {
                const selectedIndex: any = gObj.selectionModule.selectedRowIndexes[0];
                tr = gObj.getRowByIndex(selectedIndex) as HTMLTableRowElement;
            }
            else {
                tr = gObj.getSelectedRows()[0] as HTMLTableRowElement;
            }
        }
        if (this.parent.enableVirtualization && this.parent.editSettings.mode === 'Normal') {
            const idx: number = parseInt(tr.getAttribute('aria-rowindex'), 10) - 1;
            tr = this.parent.getRowByIndex(idx) as HTMLTableRowElement;
        }
        const lastTr: HTMLTableRowElement = gObj.getContent().querySelector('tr:last-child') as HTMLTableRowElement;
        const hdrTbody: Element = gObj.getHeaderContent().querySelector('tbody');
        if (gObj.frozenRows && isNullOrUndefined(lastTr) && hdrTbody && hdrTbody.querySelector('tr:last-child')) {
            this.isLastRow = tr.rowIndex === parseInt((gObj.getHeaderContent().querySelector(
                'tbody').querySelector('tr:last-child') as HTMLTableRowElement).getAttribute('aria-rowindex'), 10) - 1;
        } else if (lastTr) {
            this.isLastRow = tr.rowIndex === lastTr.rowIndex;
        }
        if (tr.style.display === 'none') {
            return;
        }
        this.editModule.startEdit(tr);
        this.refreshToolbar();
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        this.parent.notify('start-edit', {});
        if (gObj.editSettings.showAddNewRow) {
            this.destroyToolTip();
        }
    }

    /**
     * @param {Element} tr - specifies the tr element
     * @param {object} args - specifies the object
     * @param {Element} args.row -specfifes the row
     * @param {string} args.requestType - specifies the request type
     * @returns {void}
     * @hidden
     */
    public checkLastRow(tr: Element, args?: { row?: Element, requestType?: string }): void {
        const checkLastRow: boolean = this.isLastRow;
        if (this.parent.height !== 'auto' && this.parent.editSettings.newRowPosition === 'Bottom' && args && args.requestType === 'add' &&
            (this.parent.getContent().firstElementChild as HTMLElement).offsetHeight > this.parent.getContentTable().scrollHeight) {
            addClass([].slice.call(tr.getElementsByClassName(literals.rowCell)), 'e-lastrowadded');
        } else if (checkLastRow && tr && tr.classList) {
            addClass([].slice.call(tr.getElementsByClassName(literals.rowCell)), 'e-lastrowcell');
        }
    }

    /**
     * Cancels edited state.
     *
     * @returns {void}
     */
    public closeEdit(): void {
        if (this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.showConfirmDialog
            && this.parent.element.getElementsByClassName('e-updatedtd').length) {
            this.showDialog('CancelEdit', this.dialogObj);
            return;
        }
        this.parent.element.classList.remove('e-editing');
        this.editModule.closeEdit();
        this.refreshToolbar();
        this.parent.notify(events.closeEdit, { requestType: 'cancel' });
        if (this.parent.editSettings.showAddNewRow) {
            this.destroyToolTip();
        }
    }

    protected refreshToolbar(): void {
        this.parent.notify(events.toolbarRefresh, {});
    }

    /**
     * To adds a new row at the top with the given data. When data is not passed, it will add empty rows.
     * > `editSettings.allowEditing` should be true.
     *
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added
     * @returns {void}
     */
    public addRecord(data?: Object, index?: number): void {
        if (!this.parent.editSettings.allowAdding) {
            return;
        }
        const args: { startEdit: boolean } = { startEdit: true };
        if (!data) {
            this.parent.notify(events.virtualScrollAddActionBegin, args);
        }
        if (args.startEdit) {
            this.parent.element.classList.add('e-editing');
            this.editModule.addRecord(data, index);
            this.refreshToolbar();
            this.parent.notify('start-add', {});
        }
    }

    /**
     * Deletes a record with the given options. If fieldname and data are not given, the Grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     *
     * @param {string} fieldname - Defines the primary key field name of the column.
     * @param {Object} data - Defines the JSON data record to be deleted.
     * @returns {void}
     */
    public deleteRecord(fieldname?: string, data?: Object): void {
        const gObj: IGrid = this.parent;
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
            this.fieldname = fieldname;
            this.data = data;
            this.showDialog('ConfirmDelete', this.dialogObj);
            return;
        }
        this.editModule.deleteRecord(fieldname, data);

    }

    /**
     * Deletes a visible row by TR element.
     *
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     * @returns {void}
     */
    public deleteRow(tr: HTMLTableRowElement): void {
        this.deleteRowUid = tr.getAttribute('data-uid');
        const rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.deleteRowUid);
        if (!isNullOrUndefined(rowObj)) {
            this.deleteRecord(null, rowObj.data);
        }
    }

    /**
     * If Grid is in editable state, you can save a record by invoking endEdit.
     *
     * @returns {void}
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
     *
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     * @returns {void}
     */
    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        this.editModule.updateCell(rowIndex, field, value);
    }

    /**
     * To update the specified row by given values without changing into edited state.
     *
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     * @returns {void}
     */
    public updateRow(index: number, data: Object): void {
        this.editModule.updateRow(index, data);
    }

    /**
     * Resets added, edited, and deleted records in the batch mode.
     *
     * @returns {void}
     */
    public batchCancel(): void {
        this.closeEdit();
    }

    /**
     * Bulk saves added, edited, and deleted records in the batch mode.
     *
     * @returns {void}
     */
    public batchSave(): void {
        this.endEdit();
    }

    /**
     * Changes a particular cell into edited state based on the row index and field name provided in the `batch` mode.
     *
     * @param {number} index - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform batch edit.
     * @returns {void}
     */
    public editCell(index: number, field: string): void {
        this.editModule.editCell(index, field);
    }

    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     *
     * @returns {boolean} returns whether the form is validated
     */
    public editFormValidate(): boolean {
        return this.formObj ? this.formObj.validate() : true;
    }

    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     *
     * @returns {Object} returns the Object
     */
    public getBatchChanges(): Object {
        return this.editModule.getBatchChanges ? this.editModule.getBatchChanges() : {};
    }

    /**
     * Gets the current value of the edited component.
     *
     * @returns {Object} returns the Object
     */
    public getCurrentEditCellData(): Object {
        const obj: Object = this.getCurrentEditedData(this.formObj.element, {});
        return obj[Object.keys(obj)[0]];
    }

    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     *
     * @returns {void}
     */
    public saveCell(): void {
        this.editModule.saveCell();
    }

    private endEditing(): void {
        if (!this.parent.editSettings.showAddNewRow) {
            this.parent.element.classList.remove('e-editing');
        }
        this.editModule.endEdit();
        this.isShowAddedRowValidate = false;
        this.refreshToolbar();
    }

    private showDialog(content: string, obj: Dialog): void {
        obj.content = '<div>' + this.l10n.getConstant(content) + '</div>';
        obj.dataBind();
        obj.show();
        if (this.parent.enableRtl) {
            obj.refresh();
        }
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
        case 'dateonly':
            // eslint-disable-next-line no-cond-assign
            val = value && (value = new Date(value as string| Date)) ?
                (value as Date).getFullYear() + '-' + padZero((value as Date).getMonth() + 1) + '-' + padZero((value as Date).getDate()) : null;
            break;
        }
        return val;
    }

    private destroyToolTip(): void {
        const elements: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-griderror'));
        for (const elem of elements) {
            remove(elem);
        }
        (this.parent.getContent().firstElementChild as HTMLElement).style.position = 'relative';
        if (this.parent.isFrozenGrid()) {
            if (this.parent.element.querySelector('.e-gridheader')) {
                (this.parent.element.querySelector('.e-gridheader') as HTMLElement).style.position = '';
            }
            (this.parent.element.querySelector('.e-gridcontent') as HTMLElement).style.position = '';
        }
    }

    private createConfirmDlg(): void {
        this.dialogObj = this.dlgWidget(
            [
                {
                    click: this.dlgOk.bind(this),
                    buttonModel: { content: this.l10n.getConstant('OKButton'),
                        cssClass: this.parent.cssClass ? 'e-primary' + ' ' + this.parent.cssClass : 'e-primary',
                        isPrimary: true }
                },
                {
                    click: this.dlgCancel.bind(this),
                    buttonModel: { cssClass: this.parent.cssClass ? 'e-flat' + ' ' + this.parent.cssClass : 'e-flat',
                        content: this.l10n.getConstant('CancelButton') }
                }
            ],
            'EditConfirm');
    }

    private createAlertDlg(): void {
        this.alertDObj = this.dlgWidget(
            [
                {
                    click: this.alertClick.bind(this),
                    buttonModel: { content: this.l10n.getConstant('OKButton'),
                        cssClass: this.parent.cssClass ? 'e-flat' + ' ' + this.parent.cssClass : 'e-flat',
                        isPrimary: true }
                }
            ],
            'EditAlert');
    }

    private alertClick(): void {
        this.alertDObj.hide();
    }

    private dlgWidget(btnOptions: Object[], name: string): Dialog {
        const div: HTMLElement = this.parent.createElement('div', { id: this.parent.element.id + name });
        this.parent.element.appendChild(div);
        const options: Object = {
            showCloseIcon: false,
            isModal: true,
            visible: false,
            closeOnEscape: true,
            target: this.parent.element,
            width: '320px',
            animationSettings: { effect: 'None' },
            cssClass: this.parent.cssClass ? this.parent.cssClass : ''
        };
        (options as { buttons: Object[] }).buttons = btnOptions;
        const obj: Dialog = new Dialog(options);
        const isStringTemplate: string = 'isStringTemplate';
        obj[`${isStringTemplate}`] = true;
        obj.appendTo(div);
        return obj;
    }

    private dlgCancel(): void {
        if (this.parent.pagerModule) {
            this.parent.pagerModule.isForceCancel = false;
        }
        this.parent.focusModule.clearIndicator();
        this.dialogObj.hide();
        this.parent.focusModule.restoreFocus({ requestType: 'cancel' });
        this.parent.notify('cancelcnfrmDlg', {});
    }

    private dlgOk(): void {
        switch ((this.dialogObj.element.querySelector('.e-dlg-content').firstElementChild as HTMLElement).innerText) {
        case this.l10n.getConstant('ConfirmDelete'):
            this.editModule.deleteRecord(this.fieldname, this.data);
            if (this.parent.editSettings.showDeleteConfirmDialog  && !this.parent.allowSelection) {
                this.parent.commandDelIndex = undefined;
            }
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
            }
            if (this.parent.pagerModule) {
                this.parent.pagerModule.isForceCancel = false;
            }
            this.executeAction();
            break;
        }
        this.dlgCancel();
    }

    private destroyEditComponents(): void {
        if (this.parent.isEdit) {
            this.destroyWidgets();
            this.destroyForm();
        }
        this.destroy();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.eventDetails = [{ event: events.inBoundModelChanged, handler: this.onPropertyChanged },
            { event: events.initialEnd, handler: this.initialEnd },
            { event: events.keyPressed, handler: this.keyPressHandler },
            { event: events.autoCol, handler: this.updateColTypeObj },
            { event: events.tooltipDestroy, handler: this.destroyToolTip },
            { event: events.preventBatch, handler: this.preventBatch },
            { event: events.destroyForm, handler: this.destroyForm },
            { event: events.destroy, handler: this.destroyEditComponents }];
        addRemoveEventListener(this.parent, this.eventDetails, true, this);
        this.actionBeginFunction = this.onActionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.parent.on(events.destroyEditForm, this.actionBeginFunction);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.eventDetails, false);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.off(events.destroyEditForm, this.actionBeginFunction);
    }

    private actionComplete(e: NotifyArgs): void {
        const actions: string[] = ['add', 'beginEdit', 'save', 'delete', 'cancel', 'filterAfterOpen', 'filterchoicerequest'];
        if (actions.indexOf(e.requestType) < 0) {
            this.parent.isEdit = this.parent.editSettings.showAddNewRow ? true : false;
        }
        if (e.requestType === 'batchsave') {
            this.parent.focusModule.restoreFocus({ requestType: 'save' });
        }
        this.refreshToolbar();
    }

    /**
     * @param {Element} form - specifies the element
     * @param {Object} editedData - specifies the edited data
     * @returns {Object} returns the object
     * @hidden
     */
    public getCurrentEditedData(form: Element, editedData: Object): Object {
        const gObj: IGrid = this.parent;
        if (gObj.editSettings.template) {
            const elements: HTMLInputElement[] = [].slice.call((<HTMLFormElement>form).elements);
            for (let k: number = 0; k < elements.length; k++) {
                if (((elements[parseInt(k.toString(), 10)].hasAttribute('name') && (elements[parseInt(k.toString(), 10)].className !== 'e-multi-hidden')) ||
                    elements[parseInt(k.toString(), 10)].classList.contains('e-multiselect')) && !(elements[parseInt(k.toString(), 10)].type === 'hidden' &&
                    (parentsUntil(elements[parseInt(k.toString(), 10)], 'e-switch-wrapper') || parentsUntil(elements[parseInt(k.toString(), 10)], 'e-checkbox-wrapper')))) {
                    const field: string = (elements[parseInt(k.toString(), 10)].hasAttribute('name')) ? setComplexFieldID(elements[parseInt(k.toString(), 10)].getAttribute('name')) :
                        setComplexFieldID(elements[parseInt(k.toString(), 10)].getAttribute('id'));
                    const column: Column = gObj.getColumnByField(field) || { field: field, type: elements[parseInt(k.toString(), 10)].getAttribute('type') } as Column;
                    let value: string | Date | boolean;
                    if (column.type === 'checkbox' || column.type === 'boolean') {
                        value = elements[parseInt(k.toString(), 10)].checked;
                    } else if (elements[parseInt(k.toString(), 10)].value) {
                        value = elements[parseInt(k.toString(), 10)].value;
                        if ((<EJ2Intance>(elements[parseInt(k.toString(), 10)] as Element)).ej2_instances &&
                            (<Object[]>(<EJ2Intance>(elements[parseInt(k.toString(), 10)] as Element)).ej2_instances).length &&
                            !isNullOrUndefined((<EJ2Intance>(elements[parseInt(k.toString(), 10)] as Element)).ej2_instances[0].value)) {
                            elements[parseInt(k.toString(), 10)].blur();
                            value = ((<EJ2Intance>(elements[parseInt(k.toString(), 10)] as Element))
                                .ej2_instances[0] as { value?: string | boolean | Date }).value;
                        }
                    } else if ((<EJ2Intance>(elements[parseInt(k.toString(), 10)] as Element)).ej2_instances) {
                        value = ((<EJ2Intance>(elements[parseInt(k.toString(), 10)] as Element))
                            .ej2_instances[0] as { value?: string | boolean | Date }).value;
                    }
                    if (column.edit && typeof column.edit.read === 'string') {
                        value = getValue(column.edit.read, window)(elements[parseInt(k.toString(), 10)], value);
                    } else if (column.edit && column.edit.read) {
                        value = (column.edit.read as Function)(elements[parseInt(k.toString(), 10)], value);
                    }
                    value = gObj.editModule.getValueFromType(column, value) as string;
                    if (elements[parseInt(k.toString(), 10)].type === 'radio') {
                        if (elements[parseInt(k.toString(), 10)].checked) {
                            DataUtil.setValue(column.field, value, editedData);
                        }
                    } else {
                        if (typeof value === 'string') {
                            this.parent.sanitize(value as string);
                        }
                        DataUtil.setValue(column.field, value, editedData);
                    }
                }
            }
            return editedData;
        }

        const col: Column[] = (<{columnModel?: Column[]}>gObj).columnModel.filter((col: Column) => col.editTemplate);
        for (let j: number = 0; j < col.length; j++) {
            if (form[getComplexFieldID(col[parseInt(j.toString(), 10)].field)]) {
                let inputElements: HTMLInputElement[] = [].slice.call(form[getComplexFieldID(col[parseInt(j.toString(), 10)].field)])
                    .filter((element: HTMLInputElement) => element.tagName.toLowerCase() === 'input');
                inputElements = inputElements.length ? inputElements : [form[getComplexFieldID(col[parseInt(j.toString(), 10)].field)]];
                let temp: HTMLInputElement[] = inputElements.filter((e: HTMLInputElement) =>
                    !isNullOrUndefined(((<EJ2Intance>(e as Element)).ej2_instances)));
                if (temp.length === 0) {
                    temp = inputElements.filter((e: HTMLInputElement) => e.hasAttribute('name'));
                }
                for (let k: number = 0; k < temp.length; k++) {
                    let value: number | string | Date | boolean = this.getValue(col[parseInt(j.toString(), 10)],
                                                                                temp[parseInt(k.toString(), 10)], editedData);
                    if (col[parseInt(j.toString(), 10)].type === 'string') {
                        value = this.parent.sanitize(value as string);
                    }
                    DataUtil.setValue(col[parseInt(j.toString(), 10)].field, value, editedData);
                }
            }
        }

        const inputs: HTMLInputElement[] = [].slice.call(form.getElementsByClassName('e-field'));
        for (let i: number = 0, len: number = inputs.length; i < len; i++) {
            const col: Column = gObj.getColumnByUid(inputs[parseInt(i.toString(), 10)].getAttribute('data-mappinguid'));
            if (col && col.field) {
                let value:  number | string | Date | boolean = this.getValue(col, inputs[parseInt(i.toString(), 10)], editedData);
                if (col.type === 'string' && !(col.isForeignColumn() && typeof value !== 'string')) {
                    value = this.parent.sanitize(value as string);
                }
                DataUtil.setValue(col.field, value, editedData);
            }
        }
        return editedData;
    }

    private getValue(col: Column, input: HTMLInputElement, editedData: Object): string | boolean | number | Date {
        let value: string | boolean | number | Date = (<EJ2Intance>(input as Element)).ej2_instances ?
            (<EJ2Intance>(input as Element)).ej2_instances[0].value : input.value;
        const gObj: IGrid = this.parent;
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
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionBegin(e: NotifyArgs): void {
        if ((e.requestType === 'columnstate' || (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache
            && e.requestType === 'sorting')) && this.parent.isEdit && this.parent.editSettings.mode !== 'Batch') {
            this.closeEdit();
        } else {
            const editRow: Element = this.parent.element.querySelector('.' + literals.editedRow);
            const addRow: Element = this.parent.element.querySelector('.' + literals.addedRow);
            if (editRow && this.parent.frozenRows && e.requestType === 'virtualscroll'
                && parseInt(parentsUntil(editRow, literals.row).getAttribute(literals.ariaRowIndex), 10) - 1 < this.parent.frozenRows) {
                return;
            }
            const restrictedRequestTypes: string[] = ['filterAfterOpen', 'filterBeforeOpen', 'filterchoicerequest', 'filterSearchBegin', 'save', 'infiniteScroll', 'virtualscroll'];
            const isRestrict: boolean = restrictedRequestTypes.indexOf(e.requestType) === -1;
            const isAddRows: boolean =  !this.parent.editSettings.showAddNewRow || (this.parent.editSettings.showAddNewRow &&
                !isNullOrUndefined(this.parent.element.querySelector('.e-editedrow')));
            const isDestroyVirtualForm: boolean = (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) && this.formObj
                && isAddRows && !this.formObj.isDestroyed && (editRow || addRow || e.requestType === 'cancel') && isRestrict;
            if ((!this.parent.enableVirtualization && isAddRows && this.parent.editSettings.mode !== 'Batch' && this.formObj && !this.formObj.isDestroyed
                && isRestrict && !e.cancel) || isDestroyVirtualForm) {
                this.destroyWidgets();
                this.destroyForm();
            }
        }

    }

    /**
     * @param {Column[]} cols - specfies the column
     * @returns {void}
     * @hidden
     */
    public destroyWidgets(cols?: Column[]): void {
        const gObj: IGrid = this.parent;
        gObj.isWidgetsDestroyed = true;
        if (gObj.editSettings.template) {
            let parentIns: IGrid = getParentIns(this.parent);
            parentIns = parentIns.isReact ? parentIns : this.parent;
            parentIns.destroyTemplate(['editSettingsTemplate']);
            if (this.parent.isReact) {
                this.parent.renderTemplates();
            }
        }
        if (this.parent.editSettings.mode === 'Dialog' && this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            cols = [];
            const allColumns: Column[] = this.parent.getColumns();
            for (let i: number = 0; i < allColumns.length; i++) {
                const column: Column = allColumns[parseInt(i.toString(), 10)];
                if (column.visible || (this.parent.groupSettings.columns.indexOf(column.field) > -1)) {
                    cols.push(column);
                }
            }
        }
        else {
            cols = cols ? cols : this.parent.getCurrentVisibleColumns(this.parent.enableColumnVirtualization) as Column[];
        }
        if (cols.some((column: Column) => !isNullOrUndefined(column.editTemplate))) {
            this.parent.destroyTemplate(['editTemplate']);
            if (this.parent.isReact) {
                this.parent.renderTemplates();
            }
        }
        for (const col of cols) {
            let temp: Function = col.edit.destroy as Function;
            if (col.edit.destroy) {
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                    temp();
                } else {
                    (col.edit.destroy as Function)();
                }
            }
        }
        const elements: HTMLInputElement[] = [].slice.call((<HTMLFormElement>this.formObj.element).elements);
        for (let i: number = 0; i < elements.length; i++) {
            const element: HTMLInputElement = elements[parseInt(i.toString(), 10)];
            if (element.hasAttribute('name')) {
                const instanceElement: HTMLInputElement = isNullOrUndefined(element.parentElement) ? null :  element.parentElement.classList.contains('e-ddl') ?
                    element.parentElement.querySelector('input') : element;
                if (<EJ2Intance>(instanceElement as Element) && (<EJ2Intance>(instanceElement as Element)).ej2_instances &&
                    (<Object[]>(<EJ2Intance>(instanceElement as Element)).ej2_instances).length &&
                    !(<EJ2Intance>(instanceElement as Element)).ej2_instances[0].isDestroyed) {
                    (<EJ2Intance>(instanceElement as Element)).ej2_instances[0].destroy();
                    instanceElement.remove();
                }
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroyForm(): void {
        this.destroyToolTip();
        const formObjects: FormValidator[] = [this.formObj, this.virtualFormObj];
        const col: Column[] = (<{columnModel?: Column[]}>this.parent).columnModel.filter((col: Column) => col.editTemplate);
        for (let i: number = 0; i < formObjects.length; i++) {
            if (formObjects[parseInt(i.toString(), 10)] && formObjects[parseInt(i.toString(), 10)].element
                && !formObjects[parseInt(i.toString(), 10)].isDestroyed) {
                formObjects[parseInt(i.toString(), 10)].destroy();
                const parentIns: IGrid = getParentIns(this.parent);
                if (parentIns.isReact && this.parent.editSettings.mode === 'Dialog'
                    && (!isNullOrUndefined(this.parent.editSettings.template) || col.length)) {
                    formObjects[parseInt(i.toString(), 10)].element.remove();
                }
            }
        }
        this.destroyToolTip();
    }

    /**
     * To destroy the editing.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement) { return; }
        const hasGridChild: boolean = gridElement.querySelector('.' + literals.gridHeader) &&
            gridElement.querySelector( '.' + literals.gridContent) ? true : false;
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
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        if (isMacLike && e.metaKey && e.action === 'ctrlEnter') {
            e.action = 'insert';
        }
        switch (e.action) {
        case 'insert':
            this.addRecord();
            break;
        case 'delete':
            if (((e.target as HTMLElement).tagName !== 'INPUT' || (e.target as HTMLElement).classList.contains('e-checkselect'))
                && !document.querySelector('.e-popup-open.e-edit-dialog')) {
                this.deleteRecord();
            }
            break;
        case 'f2':
            this.startEdit();
            break;
        case 'enter':
            if (!parentsUntil(e.target as HTMLElement, 'e-unboundcelldiv') && this.parent.editSettings.mode !== 'Batch' &&
                    (parentsUntil(e.target as HTMLElement, literals.gridContent) || ((this.parent.frozenRows ||
                    (this.parent.editSettings.showAddNewRow && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)))
                    && parentsUntil(e.target as HTMLElement, literals.headerContent)))
                    && (!document.getElementsByClassName('e-popup-open').length || (document.querySelectorAll('.e-popup-open .e-editcell').length &&
                    !document.querySelectorAll('.e-popup-open:not(.e-dialog)').length))) {
                e.preventDefault();
                if (this.parent.isEdit) {
                    this.parent.isFocusFirstCell = true;
                }
                this.endEdit();
            }
            break;
        case 'escape':
            if (this.parent.isEdit && !this.editCellDialogClose) {
                if (this.parent.editSettings.mode === 'Batch') {
                    this.editModule.escapeCellEdit();
                } else {
                    this.curretRowFocus(e);
                }
            }
            if (this.editCellDialogClose) {
                this.editCellDialogClose = false;
            }
            break;
        case 'tab':
        case 'shiftTab':
            this.curretRowFocus(e);
            break;
        }
    }

    private curretRowFocus(e: KeyboardEventArgs): void {
        if (this.parent.isEdit && this.parent.editSettings.mode !== 'Batch') {
            this.parent.isWidgetsDestroyed = false;
            const editedRow: Element = parentsUntil(e.target as Element, 'e-editedrow') || parentsUntil(e.target as Element, 'e-addedrow');
            if (editedRow) {
                let focusableEditCells: HTMLElement[] = [].slice.call(editedRow.querySelectorAll('.e-input:not(.e-disabled)'));
                const commandColCell: HTMLElement[] = [].slice.call(editedRow.querySelectorAll('.e-unboundcell'));
                if (commandColCell && commandColCell.length) {
                    for (let i: number = 0; i < commandColCell.length; i++) {
                        focusableEditCells = focusableEditCells.concat([].slice
                            .call(commandColCell[parseInt(i.toString(), 10)].querySelectorAll('.e-btn:not(.e-hide)')));
                    }
                }
                let rowCell: Element = parentsUntil(e.target as Element, 'e-rowcell');
                rowCell = rowCell && rowCell.classList.contains('e-unboundcell') ? e.target as Element : rowCell;
                let lastCell: Element = parentsUntil(focusableEditCells[focusableEditCells.length - 1], 'e-rowcell');
                lastCell = lastCell && lastCell.classList.contains('e-unboundcell') ?
                    focusableEditCells[focusableEditCells.length - 1] as Element : lastCell;
                if ((rowCell === lastCell && e.action === 'tab') || e.action === 'escape' ||
                    (rowCell === parentsUntil(focusableEditCells[0], 'e-rowcell') && e.action === 'shiftTab' &&
                        !this.parent.editSettings.showAddNewRow)) {
                    const uid: string = editedRow.getAttribute('data-uid');
                    const rows: Element[] = this.parent.allowGrouping ? (!isNullOrUndefined(this.parent.getContent()) ?
                        [].slice.call(this.parent.getContent().querySelectorAll('tr')) : []) : this.parent.getRows();
                    let rowIndex: number = rows.map((m: HTMLTableRowElement) => m.getAttribute('data-uid')).indexOf(uid);
                    if (this.parent.frozenRows) {
                        if (parentsUntil(editedRow, 'e-gridheader')) {
                            rowIndex = (editedRow as HTMLTableRowElement).rowIndex;
                        } else if (parentsUntil(editedRow, 'e-gridcontent')) {
                            rowIndex = rowIndex - this.parent.frozenRows;
                        }
                    }
                    if (editedRow.classList.contains('e-addedrow')) {
                        rowIndex = 0;
                    }
                    if (e.action === 'escape') {
                        this.parent.isFocusFirstCell = true;
                        this.closeEdit();
                    } else {
                        this.isShowAddedRowValidate = true;
                        this.parent.selectionModule.preventFocus = false;
                        this.parent.isFocusFirstCell = true;
                        this.endEdit();
                        this.isShowAddedRowValidate = false;
                    }
                    if (this.parent.focusModule.active && (!this.parent.editSettings.showAddNewRow ||
                        editedRow.classList.contains('e-editedrow') || (this.parent.editSettings.showAddNewRow &&
                        (editedRow.classList.contains('e-addedrow') && isNullOrUndefined(this.parent.element.querySelector(
                            '.e-griderror:not([style*="display: none"])')))))) {
                        let firstCellIndex: number = 0;
                        const matrix: Matrix = this.parent.focusModule.active.matrix;
                        if (matrix && matrix.matrix.length && matrix.matrix[parseInt(rowIndex.toString(), 10)]) {
                            const rowMatrix: number[]  = matrix.matrix[parseInt(rowIndex.toString(), 10)];
                            for (let i: number = 0; i < rowMatrix.length; i++) {
                                if (rowMatrix[parseInt(i.toString(), 10)] > 0) {
                                    firstCellIndex = i;
                                    break;
                                }
                            }
                        }
                        const firstCell: Element = getValue(`${rowIndex}.cells.${firstCellIndex}`, this.parent.focusModule.active.matrix.getRowsFromIndex(rowIndex, this.parent.focusModule.active));
                        if (firstCell && firstCell.getBoundingClientRect().width === 0) {
                            const firstContentCellIndex: number[] = this.parent.focusModule.active.matrix.nextVisibleCellFocus(
                                rowIndex,
                                firstCellIndex,
                                e.action,
                                this.parent.focusModule.active.keyActions[e.action],
                                this.parent.focusModule.active,
                                this.parent.focusModule.active.matrix.current[1]
                            );
                            firstCellIndex = firstContentCellIndex[1];
                        }
                        this.parent.focusModule.active.matrix.current = [rowIndex, firstCellIndex];
                    }
                }
                if (this.parent.editSettings.showAddNewRow && e.action === 'tab' && parentsUntil(e.target as Element, 'e-addedrow')) {
                    this.isShowAddedRowValidate = true;
                }
            }
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
     * @param {Column[]} cols - specifies the column
     * @param {Object} newRule - specifies the new rule object
     * @returns {void}
     * @hidden
     */
    public applyFormValidation(cols?: Column[], newRule?: Object): void {
        const gObj: IGrid = this.parent;
        const idx: number = 0;
        const form: HTMLFormElement = this.parent.editSettings.mode !== 'Dialog' ?
            gObj.editSettings.showAddNewRow && gObj.element.querySelector('.' + literals.editedRow) ?
                gObj.element.querySelector('.' + literals.editedRow).getElementsByClassName('e-gridform')[parseInt(idx.toString(), 10)] as HTMLFormElement :
                gObj.element.getElementsByClassName('e-gridform')[parseInt(idx.toString(), 10)] as HTMLFormElement :
            select('#' + gObj.element.id + '_dialogEdit_wrapper .e-gridform', document) as HTMLFormElement;
        const index: number = 1;
        let rules: Object = {};
        const mRules: Object = {};
        const frRules: Object = {};
        cols = cols ? cols : gObj.getColumns() as Column[];
        for (let i: number = 0; i < cols.length; i++) {
            if (!cols[parseInt(i.toString(), 10)].visible && (gObj.editSettings.mode !== 'Dialog' || (gObj.groupSettings.columns.indexOf(cols[parseInt(i.toString(), 10)].field) === -1
                && gObj.editSettings.mode === 'Dialog'))) {
                continue;
            }
            if (cols[parseInt(i.toString(), 10)].validationRules && isNullOrUndefined(newRule)) {
                setValidationRuels(cols[parseInt(i.toString(), 10)], index, rules, mRules, frRules, cols.length);
            }
        }

        rules = extend(rules, mRules, frRules);
        this.parent.editModule.formObj = this.createFormObj(form, newRule ? newRule : rules);
    }

    /**
     * @param {HTMLFormElement} form - Defined Form element
     * @param {Object} rules - Defines form rules
     * @returns {FormValidator} Returns formvalidator instance
     * @hidden
     */
    public createFormObj(form: HTMLFormElement, rules: Object): FormValidator {
        return new FormValidator(form, {
            rules: rules as { [name: string]: { [rule: string]: Object } },
            locale: this.parent.locale,
            validationComplete: (args: { status: string, inputName: string, element: HTMLElement, message: string }) => {
                this.validationComplete(args);
            },
            customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                const uid: string = inputElement.getAttribute('data-mappinguid');
                const args: Object = {
                    column: this.parent.getColumnByUid(uid),
                    error: error,
                    inputElement: inputElement,
                    value: (inputElement as HTMLInputElement).value
                };
                if ((!(event && event['relatedTarget'] && event['relatedTarget'].classList.contains('e-cancelbutton')) &&
                    !this.parent.editSettings.showAddNewRow) || (this.parent.editSettings.showAddNewRow && event && event.target &&
                    (parentsUntil(event.target as Element, this.parent.element.id + '_update', true) ||
                    (parentsUntil(event.target as Element, 'e-grid-menu') && ((event.target as Element).classList.contains('e-save') ||
                    (event.target as Element).querySelector('.e-save'))) || this.isShowAddedRowValidate ||
                    (parentsUntil(event.target as Element, 'e-unboundcell') && parentsUntil(event.target as Element, 'e-update')) ||
                    (event['action'] === 'enter' && (parentsUntil(event.target as Element, 'e-content') || parentsUntil(event.target as Element, 'e-addedrow'))))) ||
                    (this.parent.editSettings.showAddNewRow && !isNullOrUndefined(this.parent.element.querySelector('.' + literals.editedRow)))) {
                    this.valErrorPlacement(inputElement, error);
                }
                this.isShowAddedRowValidate = false;
                this.parent.notify(events.valCustomPlacement, args);
            }
        });
    }

    private valErrorPlacement(inputElement: HTMLElement, error: HTMLElement): void {
        if (this.parent.isEdit) {
            const id: string = error.getAttribute('for');
            const elem: Element = this.getElemTable(inputElement).querySelector('#' + getParsedFieldID(id) + '_Error');
            if (!elem) {
                this.createTooltip(inputElement, error, id, '');
            } else {
                elem.querySelector('.e-tip-content').innerHTML = error.outerHTML;
            }
        }
    }

    private getElemTable(inputElement: Element): Element {
        let isFrozenHdr: boolean;
        const gObj: IGrid = this.parent;
        let table: Element;
        if (gObj.editSettings.mode !== 'Dialog') {
            isFrozenHdr = (gObj.frozenRows && closest(inputElement, '.' + literals.row) && gObj.frozenRows
                > (parseInt(closest(inputElement, '.' + literals.row).getAttribute(literals.ariaRowIndex), 10) - 1 || 0));
            table = this.parent.isFrozenGrid() ? gObj.element : isFrozenHdr || (gObj.editSettings.showAddNewRow &&
                (gObj.enableVirtualization || gObj.enableInfiniteScrolling)) ? gObj.getHeaderTable() : gObj.getContentTable();
        } else {
            table = select('#' + gObj.element.id + '_dialogEdit_wrapper', document);
        }
        return table;
    }

    public resetElemPosition(elem: HTMLElement, args: { status: string, inputName: string,
        element: HTMLElement, message: string }): void {
        const td: Element = parentsUntil(args.element, literals.rowCell);
        if (td) {
            const tdRight: number = td.getBoundingClientRect().right;
            const elemRight: number = elem.getBoundingClientRect().right;
            if (elemRight > tdRight) {
                const offSet: number = elemRight - tdRight;
                elem.style.left = (elem.offsetLeft - offSet) + 'px';
            }
        }
    }

    private validationComplete(args: { status: string, inputName: string, element: HTMLElement, message: string }): void {
        if (this.parent.isEdit) {
            const elem: HTMLElement = this.getElemTable(args.element).querySelector('#' + getParsedFieldID(args.inputName) + '_Error') as HTMLElement;
            if (this.parent.editSettings.showAddNewRow && !elem && args.element) {
                const error: Element = parentsUntil(args.element, 'e-rowcell').querySelector('.e-error');
                if (error) {
                    error.classList.remove('e-error');
                }
            }
            if (elem) {
                if (args.status === 'failure') {
                    elem.style.display = '';
                    this.resetElemPosition(elem, args);
                } else {
                    elem.style.display = 'none';
                }
            }
        }
    }

    private createTooltip(element: Element, error: HTMLElement, name: string, display: string): void {
        let formObj: HTMLFormElement = this.formObj.element;
        const customForm: Element = parentsUntil(element, 'e-virtual-validation');
        if (customForm) {
            formObj = this.virtualFormObj.element;
        }
        const gcontent: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        const isScroll: boolean = gcontent.scrollHeight > gcontent.clientHeight || gcontent.scrollWidth > gcontent.clientWidth;
        const isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        const td: Element = closest(element, '.' + literals.rowCell);
        const row: Element = closest(element, '.' + literals.row);
        let isFHdr: boolean;
        let isFHdrLastRow: boolean = false;
        let validationForBottomRowPos: boolean;
        let isBatchModeLastRow: boolean = false;
        const isAddNewRow: boolean = this.parent.editSettings.showAddNewRow && !isNullOrUndefined(parentsUntil(element, literals.addedRow))
            && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling);
        const viewPortRowCount: number = Math.round(this.parent.getContent().clientHeight / this.parent.getRowHeight()) - 1;
        let rows: Element[] = [].slice.call(this.parent.getContent().getElementsByClassName(literals.row));
        if (this.parent.editSettings.mode === 'Batch') {
            rows = [].slice.call(this.parent.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)'));
            if (viewPortRowCount > 1 && rows.length > viewPortRowCount && parseInt(rows[rows.length - 1].
                getAttribute(literals.ariaRowIndex), 10) - 1 === parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1) {
                isBatchModeLastRow = true;
            }
        }
        if (isInline) {
            if (this.parent.frozenRows || isAddNewRow) {
                const headerRows: string = this.parent.editSettings.showAddNewRow ? '.e-row:not(.e-hiddenrow.e-addedrow)' :
                    '.e-row:not(.e-hiddenrow)';
                const fHearderRows: HTMLCollection = [].slice.call(
                    this.parent.getHeaderTable().querySelector(literals.tbody).querySelectorAll(headerRows));
                isFHdr = fHearderRows.length > (parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1 || 0);
                isFHdrLastRow = isFHdr && parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1 === fHearderRows.length - 1;
                const insertRow: Element[] = [].slice.call(
                    this.parent.getHeaderTable().querySelector(literals.tbody).querySelectorAll('.e-row:not(.e-hiddenrow)'));
                if (insertRow.length === 1 && (insertRow[0].classList.contains('e-addedrow') || insertRow[0].classList.contains('e-insertedrow'))) {
                    isFHdrLastRow = true;
                }
            }
            if (isFHdrLastRow || (viewPortRowCount > 1 && rows.length > viewPortRowCount
                && ((this.parent.editSettings.newRowPosition === 'Bottom' && (this.editModule.args
                    && this.editModule.args.requestType === 'add')) || (td.classList.contains('e-lastrowcell')
                        && !row.classList.contains(literals.addedRow)))) || isBatchModeLastRow) {
                validationForBottomRowPos = true;
            }
        }
        const table: Element = isInline ?
            (isFHdr ? this.parent.getHeaderTable() : this.parent.getContentTable()) :
            select('#' + this.parent.element.id + '_dialogEdit_wrapper .e-dlg-content', document);
        const client: ClientRect = table.getBoundingClientRect();
        const left: number = isInline ?
            this.parent.element.getBoundingClientRect().left : client.left;
        const input: HTMLElement = closest(element, 'td') as HTMLElement;
        const inputClient: ClientRect = input ? input.getBoundingClientRect() : element.parentElement.getBoundingClientRect();
        const div: HTMLElement = this.parent.createElement('div', {
            className: 'e-tooltip-wrap e-lib e-control e-popup e-griderror',
            id: name + '_Error'
        });
        const divStyles: string = 'display:' + display + ';top:' +
            ((isFHdr ? inputClient.top + inputClient.height : inputClient.bottom - client.top) + table.scrollTop + 9) + 'px;left:' +
            (inputClient.left - left + table.scrollLeft + inputClient.width / 2) + 'px;' +
            'max-width:' + inputClient.width + 'px;text-align:center;';
        updateCSSText(div, divStyles);
        if (this.parent.cssClass) {
            div.classList.add(this.parent.cssClass);
        }

        if (isInline && client.left < left) {
            div.style.left = parseInt(div.style.left, 10) - client.left + left + 'px';
        }
        const content: Element = this.parent.createElement('div', { className: 'e-tip-content' });
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
        if (!customForm && (this.parent.frozenRows || isAddNewRow) && this.parent.editSettings.mode !== 'Dialog') {
            const getEditCell: HTMLElement = this.parent.editSettings.mode === 'Normal' ?
                closest(element, '.e-editcell') as HTMLElement : closest(element, '.' + literals.table) as HTMLElement;
            getEditCell.style.position = 'relative';
            div.style.position = 'absolute';
            if (this.parent.editSettings.mode === 'Batch' ||
                (closest(element, '.' + literals.frozenContent) || closest(element, '.' + literals.frozenHeader))
                || (this.parent.frozenRows || isAddNewRow)) {
                if (this.parent.isFrozenGrid()) {
                    if (td.classList.contains('e-unfreeze')) {
                        addClass([div], 'e-unfreeze');
                        formObj.appendChild(div);
                    } else {
                        const elem: HTMLElement = closest(td, '.e-gridheader') ? this.parent.element.querySelector('.e-gridheader') :
                            rows.length === 1 ? this.parent.element.querySelector('.e-gridcontent').querySelector('.e-content') :
                                this.parent.element.querySelector('.e-gridcontent');
                        elem.appendChild(div);
                        elem.style.position = 'relative';
                    }
                } else {
                    formObj.appendChild(div);
                }
            }
        } else {
            if (customForm) {
                this.virtualFormObj.element.appendChild(div);
            } else {
                if (this.parent.editSettings.mode !== 'Dialog' && this.parent.isFrozenGrid()) {
                    if (td.classList.contains('e-unfreeze')) {
                        addClass([div], 'e-unfreeze');
                        this.formObj.element.appendChild(div);
                    } else {
                        const elem: HTMLElement = closest(td, '.e-gridheader') ? this.parent.element.querySelector('.e-gridheader') :
                            rows.length === 1 ? this.parent.element.querySelector('.e-gridcontent').querySelector('.e-content') :
                                this.parent.element.querySelector('.e-gridcontent');
                        elem.appendChild(div);
                        elem.style.position = 'relative';
                    }
                } else {
                    this.formObj.element.appendChild(div);
                }
            }
        }
        if (!isNullOrUndefined(td)){
            if (td.classList.contains('e-fixedfreeze')) {
                div.classList.add('e-fixederror');
            } else if (td.classList.contains('e-leftfreeze') || td.classList.contains('e-rightfreeze')) {
                div.classList.add('e-freezeerror');
            }
        }
        if (!validationForBottomRowPos && isInline && gcontent.getBoundingClientRect().bottom < inputClient.bottom + inputClient.height) {
            const contentDiv: HTMLElement = this.parent.getContent().querySelector('.e-content');
            if (this.parent.currentViewData.length === 0 && contentDiv.scrollTop === 0) {
                contentDiv.scrollTop = div.offsetHeight + arrow.scrollHeight;
            }
            else {
                gcontent.scrollTop = gcontent.scrollTop + div.offsetHeight + arrow.scrollHeight;
            }
        }
        const lineHeight: number = parseInt(
            document.defaultView.getComputedStyle(div, null).getPropertyValue('font-size'), 10
        );
        if ((this.parent.frozenRows || isAddNewRow) && this.parent.editSettings.mode !== 'Dialog') {
            div.style.left = input.offsetLeft + (input.offsetWidth / 2 - div.offsetWidth / 2) + 'px';
        } else {
            div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
        }
        if (div.getBoundingClientRect().width < inputClient.width &&
            div.querySelector('label').getBoundingClientRect().height / (lineHeight * 1.2) >= 2) {
            div.style.width = div.style.maxWidth;
        }
        if (isInline && !isScroll && !this.parent.allowPaging || (this.parent.frozenRows || isAddNewRow)) {
            // gcontent.style.position = 'static';
            const pos: OffsetPosition = calculateRelativeBasedPosition(input, div);
            div.style.top = pos.top + inputClient.height + 9 + 'px';
        }
        if (validationForBottomRowPos) {
            if (isScroll && this.parent.height !== 'auto' && (!this.parent.frozenRows || !isAddNewRow)
                && !this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling && !(div.classList.contains('e-freezeerror')
             && div.classList.contains('e-fixederror'))) {
                const scrollWidth: number = gcontent.scrollWidth > gcontent.offsetWidth ? getScrollBarWidth() : 0;
                const gHeight: number | string = this.parent.height.toString().indexOf('%') === -1 ?
                    parseInt(this.parent.height as string, 10) : gcontent.offsetHeight;
                div.style.bottom = ((gHeight as number) - gcontent.querySelector('table').offsetHeight
                    - scrollWidth) + inputClient.height + 9 + 'px';
            } else {
                div.style.bottom = inputClient.height + 9 + 'px';
            }
            if (rows.length < viewPortRowCount && this.parent.editSettings.newRowPosition === 'Bottom' && (this.editModule.args
                && this.editModule.args.requestType === 'add')) {
                const rowsCount: number = this.parent.frozenRows ? (isAddNewRow ? this.parent.frozenRows + 1 : this.parent.frozenRows) +
                    (rows.length - 1) : rows.length - 1;
                const rowsHeight: number = rowsCount * this.parent.getRowHeight();
                const position: number = this.parent.getContent().clientHeight - rowsHeight;
                div.style.bottom = position + 9 + 'px';
            }
            div.style.top = null;
        }
    }

    /**
     * @param {Column} col - specfies the column
     * @returns {boolean} returns the whether column is grouped
     * @hidden
     */
    public checkColumnIsGrouped(col: Column): boolean {
        return !col.visible && !(this.parent.groupSettings.columns.indexOf(col.field) > -1);
    }

    /**
     * @param {object} editors -specfies the editors
     * @returns {void}
     * @hidden
     */
    public static AddEditors(editors: object): void {
        Edit.editCellType = extend(Edit.editCellType, editors);
    }
}
