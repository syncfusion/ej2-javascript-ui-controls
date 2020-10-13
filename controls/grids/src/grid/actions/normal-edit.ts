import { extend, isBlazor } from '@syncfusion/ej2-base';
import { remove, isNullOrUndefined, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EditEventArgs, AddEventArgs, SaveEventArgs } from '../base/interface';
import { parentsUntil, isGroupAdaptive, refreshForeignData, getObject } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { ReturnType } from '../base/type';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DataUtil } from '@syncfusion/ej2-data';

/**
 * `NormalEdit` module is used to handle normal('inline, dialog, external') editing actions.
 * @hidden
 */
export class NormalEdit {
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected renderer: EditRender;
    public formObj: FormValidator;
    protected previousData: Object;
    private editRowIndex: number;
    private rowIndex: number;
    private addedRowIndex: number;
    private uid: string;
    private args: EditEventArgs = {};
    private cloneRow: Element;
    private originalRow: Element;
    private frozen: Element;
    private cloneFrozen: Element;
    private currentVirtualData: Object = {};

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.renderer = renderer;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    protected clickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let gObj: IGrid = this.parent;
        if ((((parentsUntil(target, 'e-gridcontent') &&
            parentsUntil(parentsUntil(target, 'e-gridcontent'), 'e-grid').id === gObj.element.id)) || (gObj.frozenRows
                && parentsUntil(target, 'e-headercontent'))) && !parentsUntil(target, 'e-unboundcelldiv')) {
            this.rowIndex = parentsUntil(target, 'e-rowcell') ? parseInt(target.parentElement.getAttribute('aria-rowindex'), 10) : -1;
            if (gObj.isEdit) {
                gObj.editModule.endEdit();
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        if (parentsUntil(e.target as Element, 'e-rowcell') && this.parent.editSettings.allowEditOnDblClick) {
            this.parent.editModule.startEdit(parentsUntil(e.target as Element, 'e-row') as HTMLTableRowElement);
        }
    }

    /**
     * The function used to trigger editComplete
     * @return {void}
     * @hidden
     */
    public editComplete(e: NotifyArgs): void {
        this.parent.isEdit = false;
        let action: string = 'action';
        if (isBlazor() && !this.parent.isJsComponent) { e.rows = null; }
        switch (e.requestType as string) {
            case 'save':
                if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
                    || (!this.parent.isPersistSelection)) {
                    if (e[action] !== 'edit') {
                        this.parent.selectRow(0);
                    }
                }
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'save',
                    type: events.actionComplete
                }));
                break;
            case 'delete':
                if (isBlazor() && !this.parent.isJsComponent) {
                    let d: string = 'data';
                    e[d] = e[d][0];
                }
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'delete',
                    type: events.actionComplete
                }));
                if (!this.parent.isCheckBoxSelection) {
                    this.parent.selectRow(this.editRowIndex);
                }
                break;
        }
    }

    protected startEdit(tr: Element): void {
        let gObj: IGrid = this.parent;
        let primaryKeys: string[] = gObj.getPrimaryKeyFieldNames();
        let primaryKeyValues: string[] = [];
        this.rowIndex = this.editRowIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
        if (gObj.enableVirtualization || gObj.enableInfiniteScrolling) {
            let selector: string = '.e-row[aria-rowindex="' + this.rowIndex + '"]';
            let virtualRow: Element = this.parent.element.querySelector(selector);
            if (!virtualRow) {
                return;
            }
        }
        if (isBlazor()) {
            let cols: Column[] = this.parent.getColumns();
            for (let i: number = 0; i < cols.length; i++) {
                let col: Column = cols[i];
                if (col.template) {
                    resetBlazorTemplate(gObj.element.id + col.uid, 'Template', this.rowIndex);
                }
            }
        }
        if (isGroupAdaptive(gObj)) {
            let rObj: Row<Column> = gObj.getRowObjectFromUID(tr.getAttribute('data-uid'));
            this.previousData = rObj.data;
        } else if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
            let e: { data: Object, index: number } = { data: this.previousData, index: this.rowIndex };
            this.parent.notify(events.virtualScrollEditActionBegin, e);
            this.previousData = e.data;
        } else {
            this.previousData = gObj.getCurrentViewRecords()[this.rowIndex];
        }
        for (let i: number = 0; i < primaryKeys.length; i++) {
            primaryKeyValues.push(getObject(primaryKeys[i], this.previousData));
        }
        this.uid = tr.getAttribute('data-uid');
        let rowObj: Row<Column> = gObj.getRowObjectFromUID(this.uid);
        let args: EditEventArgs = {
            primaryKey: primaryKeys, primaryKeyValue: primaryKeyValues, requestType: 'beginEdit',
            rowData: this.previousData, rowIndex: this.rowIndex, type: 'edit', cancel: false,
            foreignKeyData: rowObj && rowObj.foreignKeyData, target: undefined
        };
        if (!isBlazor() || this.parent.isJsComponent) {
            args.row = tr;
        }
        gObj.trigger(events.beginEdit, args, (begineditargs: EditEventArgs) => {
            begineditargs.type = 'actionBegin';
            gObj.trigger(events.actionBegin, begineditargs, (editargs: EditEventArgs) => {
                if (!editargs.cancel) {
                let cloneRow: string = 'cloneRow';
                let frozen: string = 'frozen';
                let cloneFrozen: string = 'cloneFrozen';
                gObj.isEdit = true;
                editargs.row = editargs.row ? editargs.row :  tr;
                if (isBlazor() && gObj.isServerRendered) {
                   this.originalRow = editargs.row;
                   this.cloneRow = editargs.row.cloneNode(true) as Element;
                   editargs[cloneRow] = this.cloneRow;
                }
                if (gObj.editSettings.mode !== 'Dialog') {
                    gObj.clearSelection();
                }
                if (gObj.editSettings.mode === 'Dialog' && (<{ selectionModule?: { preventFocus: boolean } }>gObj).selectionModule) {
                    (<{ selectionModule?: { preventFocus: boolean } }>gObj).selectionModule.preventFocus = true;
                    editargs.row.classList.add('e-dlgeditrow');
                }
                this.renderer.update(editargs);
                if (isBlazor()) {
                    editargs.form = null;
                    this.cloneFrozen = editargs[cloneFrozen];
                    this.frozen = editargs[frozen];
                    this.cloneRow = editargs[cloneRow];
                    this.originalRow = editargs.row;
                }
                this.uid = tr.getAttribute('data-uid');
                gObj.editModule.applyFormValidation();
                editargs.type = 'actionComplete';
                gObj.trigger(events.actionComplete, editargs);
                this.args = editargs;
                if (this.parent.allowTextWrap) {
                    this.parent.notify(events.freezeRender, { case: 'textwrap' });
                }
                if (isBlazor()) {
                    this.parent.notify(events.toolbarRefresh, {});
                    (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
                    this.parent.notify('start-edit', {});
                }
            }
            });
        });
    }

    protected updateRow(index: number, data: Object): void {
        let gObj: IGrid = this.parent;
        this.editRowIndex = index;
        let args: SaveEventArgs = {
            requestType: 'save', action: 'edit', type: events.actionBegin, data: data, cancel: false,
            previousData: gObj.getCurrentViewRecords()[index],
            row: gObj.getRowByIndex(index)
        };
        gObj.showSpinner();
        gObj.notify(events.updateData, args);
        if (args.promise) {
            args.promise.then(() => gObj.refresh()).catch((e: ReturnType) => this.edFail(e));
        } else {
            gObj.refresh();
        }
    }

    private editFormValidate(): boolean {
        let gObj: IGrid = this.parent;
        let form1: boolean = gObj.editModule.formObj.validate();
        let form2: boolean = gObj.editModule.mFormObj ? gObj.editModule.mFormObj.validate() : true;
        return (form1 && form2);
    }

    protected endEdit(): void {
        let gObj: IGrid = this.parent;
        if (!this.parent.isEdit || !this.editFormValidate()) {
            return;
        }
        let editedData: Object = extend({}, {}, this.previousData, true);
        let args: SaveEventArgs = extend(this.args, {
            requestType: 'save', type: events.actionBegin, data: editedData, cancel: false,
            previousData: this.previousData, selectedRow: gObj.selectedRowIndex, foreignKeyData: {}
        });
        let isDlg: Boolean = gObj.editSettings.mode === 'Dialog';
        let dlgWrapper: Element = document.querySelector('#' + gObj.element.id + '_dialogEdit_wrapper');
        let dlgForm: Element = isDlg ? dlgWrapper.querySelector('.e-gridform') : gObj.element.querySelector('.e-gridform');
        let data: { virtualData: Object, isAdd: boolean } = { virtualData: {}, isAdd: false };
        this.parent.notify(events.getVirtualData, data);
        if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
            && this.parent.editSettings.mode === 'Normal' && !dlgForm) {
            if (this.parent.isEdit) {
                this.currentVirtualData = editedData = args.data = data.virtualData;
            }
        } else {
            editedData = gObj.editModule.getCurrentEditedData(dlgForm, editedData);
        }
        if (gObj.getFrozenColumns() && gObj.editSettings.mode === 'Normal') {
            let mForm: Element = gObj.element.querySelector('.e-movableheader').querySelector('.e-gridform');
            if (gObj.frozenRows && mForm) {
                editedData = gObj.editModule.getCurrentEditedData(mForm, editedData);
            } else {
                let form: Element = gObj.element.querySelector('.e-movablecontent').querySelector('.e-gridform');
                if (form) {
                    editedData = gObj.editModule.getCurrentEditedData(form, editedData);
                }
            }
        }
        if (isBlazor()) {
            let form: string = 'form';
            let movableForm: string = 'movableForm';
            args[form] = null;
            args[movableForm] = null;
            args.row = {};
        }
        let eleLength: number = [].slice.call(gObj.element.querySelectorAll('.e-editedrow')).length;
        if (!data.isAdd && Object.keys(this.currentVirtualData).length && !eleLength) {
            eleLength = 1;
        }
        if (isDlg ? dlgWrapper.querySelectorAll('.e-editedrow').length : eleLength) {
            args.action = 'edit';
            gObj.trigger(events.actionBegin, args, (endEditArgs: SaveEventArgs) => {
                if (endEditArgs.cancel) {
                    return;
                }
                gObj.showSpinner();
                gObj.notify(events.updateData, endEditArgs);
            });
        } else {
            args.action = 'add';
            args.selectedRow = 0;
            args.index = this.addedRowIndex;
            gObj.notify(events.virtualScrollEditSuccess, {});
            gObj.notify(events.modelChanged, args);
            this.addedRowIndex = null;
            if (args.cancel) {
                return;
            }
        }
    }

    private destroyElements(): void {
        let gObj: IGrid = this.parent;
        gObj.editModule.destroyWidgets();
        gObj.editModule.destroyForm();
        this.parent.notify(events.dialogDestroy, {});
    }

    private editHandler(args: EditArgs): void {
        if (args.promise) {
            args.promise.then((e: ReturnType) => this.edSucc(e, args)).catch((e: ReturnType) => this.edFail(e));
        } else {
            this.editSuccess(args.data, args);
        }
    }

    private edSucc(e: ReturnType, args: EditArgs): void {
        this.editSuccess(e, args);
    }

    private edFail(e: ReturnType): void {
        if (isBlazor() && this.parent.isServerRendered) {
            let error: string = 'error';
            let message: string = 'message';
            if (!isNullOrUndefined(e[error]) && !isNullOrUndefined(e[error][message])) {
                e[error] = e[error][message];
            }
        }
        this.editFailure(e);
    }

    private updateCurrentViewData(data: Object): void {
        if (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) {
            this.parent.getCurrentViewRecords()[this.editRowIndex] = data;
        }
    }

    private requestSuccess(args: Object): void {
        if (this.parent.editModule.formObj && !this.parent.editModule.formObj.isDestroyed) {
            this.destroyElements();
            this.stopEditStatus();
            if (this.parent.editSettings.mode === 'Dialog' && (<{ action?: string }>args).action !== 'add') {
                this.parent.element.querySelector('.e-dlgeditrow').classList.remove('e-dlgeditrow');
            }
        }
    }

    private editSuccess(e: Object, args: EditArgs): void {
        if (!isNullOrUndefined(e) && !(e instanceof Array)) {
            let rowData: string = 'rowData';
            args.data = extend({}, extend({}, args[rowData], args.data), e);
        }
        let editArgs: Object;
        this.requestSuccess(args);
        this.parent.trigger(events.beforeDataBound, args);
        args.type = events.actionComplete;
        this.parent.isEdit = false;
        if (isBlazor() && this.parent.isServerRendered) {
            this.closeForm();
            let rowIndex: string = 'rowIndex';
            let action: string = 'action';
            let data: string = 'data';
            editArgs = {requestType: args.requestType,
                   rowIndex: args[rowIndex], action: args[action], data: args[data]};
            this.parent.notify('editsuccess', editArgs);
        } else {
            this.refreshRow(args.data);
        }
        this.parent.notify(events.virtualScrollEditSuccess, args);
        this.parent.editModule.checkLastRow(args.row);
        this.parent.editModule.isLastRow = false;
        this.updateCurrentViewData(args.data);
        this.blazorTemplate();
        if (!(isBlazor() && this.parent.isServerRendered)) {
            this.editRowIndex = null;
            this.parent.trigger(events.actionComplete, args);
        }
        if (isBlazor()) {
            this.parent.notify(events.toolbarRefresh, {});
        }
        if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
            || (!this.parent.isPersistSelection)) {
            if (this.parent.editSettings.mode !== 'Dialog') {
                if (isBlazor() && this.parent.isServerRendered) {
                    let rowIndex: string = 'editRowIndex';
                    editArgs[rowIndex] = this.rowIndex > -1 ? this.rowIndex : this.editRowIndex;
                } else {
                    this.parent.selectRow(this.rowIndex > -1 ? this.rowIndex : this.editRowIndex);
                }
            }
        }
        this.parent.hideSpinner();
    }

    private closeForm(): void {
        if (!this.cloneRow && this.parent.isEdit) {
            this.stopEditStatus();
        }
        if (this.cloneRow) {
            this.cloneRow.remove();
            this.cloneRow = null;
            this.originalRow.classList.remove('e-hiddenrow');
        }
        if (this.parent.getFrozenColumns() && this.cloneFrozen) {
            this.cloneFrozen.remove();
            this.frozen.classList.remove('e-hiddenrow');
        }
    }

    private blazorTemplate(): void {
        let cols: Column[] = this.parent.getColumns();
        if (this.parent.editSettings.template && this.parent.editSettings.mode === 'Normal') {
            updateBlazorTemplate(this.parent.element.id + 'editSettingsTemplate', 'Template', this.parent.editSettings);
        }
        for (let i: number = 0; i < cols.length; i++) {
            let col: Column = cols[i];
            if (col.template) {
                updateBlazorTemplate(this.parent.element.id + col.uid, 'Template', col, false);
            }
            if (col.editTemplate) {
                updateBlazorTemplate(this.parent.element.id + col.uid + 'editTemplate', 'EditTemplate', col);
            }
        }
    }

    private editFailure(e: ReturnType): void {
        this.parent.trigger(events.actionFailure, ((isBlazor() && e instanceof Array) ? e[0] : { error: e }));
        this.parent.hideSpinner();
        this.parent.log('actionfailure', { error: e });
    }

    private needRefresh(): boolean {
        let refresh: boolean = true;
        let editedRow: Element = this.parent.element.querySelector('.e-gridform');
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && this.parent.editSettings.mode === 'Normal' && !editedRow) {
            refresh = false;
        }
        return refresh;
    }

    private refreshRow(data: Object): void {
        let frzCols: number = this.parent.getFrozenColumns();
        let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.uid);
        if (rowObj) {
            rowObj.changes = data;
            this.parent.notify(events.refreshVirtualCache, data);
            refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
            if (this.needRefresh()) {
                row.refresh(rowObj, this.parent.getColumns() as Column[], true);
            }
            if (frzCols) {
                let uid: string;
                let tr: Element = this.parent.element.querySelector('[data-uid=' + rowObj.uid + ']');
                if ((parentsUntil(tr, 'e-frozencontent')) || (parentsUntil(tr, 'e-frozenheader'))) {
                    if (this.parent.infiniteScrollSettings.enableCache) {
                        uid = this.parent.getMovableRowByIndex(rowObj.index).getAttribute('data-uid');
                    } else {
                        uid = this.parent.getMovableRows()[rowObj.index].getAttribute('data-uid');
                    }
                } else {
                    if (this.parent.infiniteScrollSettings.enableCache) {
                        uid = this.parent.getRowByIndex(rowObj.index).getAttribute('data-uid');
                    } else {
                        uid = this.parent.getRows()[rowObj.index].getAttribute('data-uid');
                    }
                }
                rowObj = this.parent.getRowObjectFromUID(uid);
                rowObj.changes = data;
                row.refresh(rowObj, this.parent.columns as Column[], true);
                this.parent.editModule.checkLastRow(tr);
            }
        }
    }

    protected closeEdit(): void {
        if (!this.parent.isEdit) { return; }
        let gObj: IGrid = this.parent;
        let args: { data: Object, requestType: string, cancel: Boolean, selectedRow: Number, type: string } = extend(this.args, {
            requestType: 'cancel', type: events.actionBegin, cancel: false, data: this.previousData, selectedRow: gObj.selectedRowIndex
        }) as { data: Object, requestType: string, cancel: Boolean, selectedRow: Number, type: string };
        gObj.notify(events.virtualScrollEditCancel, args);
        this.blazorTemplate();
        if (isBlazor()) {
            let form: string = 'form';
            args[form] = null;
        }
        gObj.trigger(
            events.actionBegin, args,
            (closeEditArgs: { cancel: Boolean, data: Object, requestType: string, selectedRow: Number, type: string }) => {
                if (closeEditArgs.cancel) {
                    return;
                }
                if (this.parent.editSettings.mode === 'Dialog') {
                    this.parent.notify(events.dialogDestroy, {});
                }
                gObj.isEdit = false;
                this.stopEditStatus();
                closeEditArgs.type = events.actionComplete;
                if (gObj.editSettings.mode !== 'Dialog') {
                    if (isBlazor() && gObj.isServerRendered) {
                        this.closeForm();
                    } else {
                        this.refreshRow(closeEditArgs.data);
                    }
                }
                let isLazyLoad: boolean = gObj.groupSettings.enableLazyLoading && gObj.groupSettings.columns.length
                    && !gObj.getContentTable().querySelector('tr.e-emptyrow');
                if (!gObj.getContentTable().querySelector('tr.e-emptyrow') &&
                    !gObj.getContentTable().querySelector('tr.e-row') && !isLazyLoad) {
                    gObj.renderModule.emptyRow();
                }
                if (gObj.editSettings.mode !== 'Dialog') {
                    gObj.selectRow(this.rowIndex);
                }
                gObj.trigger(events.actionComplete, closeEditArgs);
                if (isBlazor()) {
                    this.parent.notify(events.toolbarRefresh, {});
                    this.parent.notify('close-edit', {});
                }
            });
    }

    protected addRecord(data?: Object, index?: number): void {
        let gObj: IGrid = this.parent;
        this.addedRowIndex = index = !isNullOrUndefined(index) ? index : 0;
        if (data) {
            gObj.notify(events.modelChanged, {
                requestType: 'save', type: events.actionBegin, data: data, selectedRow: 0, action: 'add', index: index
            });
            return;
        }
        if (gObj.isEdit) {
            return;
        }
        this.previousData = {};
        this.uid = '';
        let cols: Column[] = ((<{ columnModel?: Column[] }>gObj).columnModel);
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field) {
                DataUtil.setValue(cols[i].field, cols[i].defaultValue, this.previousData);
            }
        }
        let args: AddEventArgs = {
            cancel: false, foreignKeyData: {}, //foreign key support
            requestType: 'add', data: this.previousData, type: events.actionBegin, index: index,
            rowData: this.previousData, target: undefined
        };
        let rowData: { virtualData: Object } = { virtualData: {} };
        this.parent.notify(events.getVirtualData, rowData);
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && Object.keys(rowData.virtualData).length) {
            args.data = args.rowData = rowData.virtualData;
        }
        if (isBlazor()) {
            let form: string = 'form';
            args[form] = null;
        }
        gObj.trigger(events.actionBegin, args, (addArgs: AddEventArgs) => {
            if (addArgs.cancel) {
                return;
            }
            gObj.isEdit = true;
            if (gObj.editSettings.mode !== 'Dialog') {
                gObj.clearSelection();
            }
            this.renderer.addNew(addArgs);
            gObj.editModule.applyFormValidation();
            addArgs.type = events.actionComplete;
            addArgs.row = gObj.element.querySelector('.e-addedrow');
            gObj.trigger(events.actionComplete, addArgs);
            if (isBlazor()) {
                this.parent.notify(events.toolbarRefresh, {});
                this.parent.notify('start-add', {});
            }
            this.args = addArgs as EditArgs;
        });

    }

    protected deleteRecord(fieldname?: string, data?: Object): void {
        this.editRowIndex = this.parent.selectedRowIndex;
        if (data) {
            data = (data instanceof Array) ? data : [data];
            let gObj: IGrid = this.parent;
            let index: number = 0;
            let dataLen: number = Object.keys(data).length;
            fieldname = fieldname || this.parent.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < dataLen; i++) {
                let tmpRecord: Object;
                let contained: boolean = gObj.currentViewData.some((record: Object) => {
                    tmpRecord = record;
                    return data[i] === getObject(fieldname, record) || data[i] === record;
                });
                data[i] = contained ? tmpRecord : { [fieldname]: data[i] };
            }
        }
        let args: object = {
            requestType: 'delete', type: events.actionBegin, foreignKeyData: {}, //foreign key support
            data: data ? data : this.parent.getSelectedRecords(), tr: this.parent.getSelectedRows(), cancel: false
        };
        if (!isNullOrUndefined(this.parent.commandDelIndex)) {
            (<{ data?: Object[] }>args).data[0] =
            this.parent.getRowObjectFromUID(this.parent.getRowByIndex(this.parent.commandDelIndex).getAttribute('data-uid')).data;
        }
        if (this.parent.enableVirtualization && (<{ data?: Object[] }>args).data.length > 1) {
            let uid: string = this.parent.getSelectedRows()[0].getAttribute('data-uid');
            (<{ data?: Object[] }>args).data = [this.parent.getRowObjectFromUID(uid).data];
        }
        let dataInString: string = 'data';
        if (isBlazor() && !this.parent.isJsComponent) {
            args[dataInString] = args[dataInString][0];
        }
        this.parent.notify(events.modelChanged, args);
    }

    private stopEditStatus(): void {
        let gObj: IGrid = this.parent;
        let elem: Element = gObj.element.querySelector('.e-addedrow');
        let mElem: Element;
        let editMElem: Element;
        if (gObj.getFrozenColumns()) {
            mElem = gObj.element.querySelectorAll('.e-addedrow')[1];
            editMElem = gObj.element.querySelectorAll('.e-editedrow')[1];
            if (mElem) {
                remove(mElem);
            }
            if (editMElem) {
                editMElem.classList.remove('e-editedrow');
            }
        }
        if (elem) {
            remove(elem);
        }
        elem = gObj.element.querySelector('.e-editedrow');
        if (elem) {
            elem.classList.remove('e-editedrow');
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.crudAction, this.editHandler, this);
        this.parent.on(events.doubleTap, this.dblClickHandler, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.recordAdded, this.requestSuccess, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.deleteComplete, this.editComplete, this);
        this.parent.on(events.saveComplete, this.editComplete, this);
        this.parent.on('closeinline', this.closeForm, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.crudAction, this.editHandler);
        this.parent.off(events.doubleTap, this.dblClickHandler);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.recordAdded, this.requestSuccess);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.deleteComplete, this.editComplete);
        this.parent.off(events.saveComplete, this.editComplete);
        this.parent.off('closeinline', this.closeForm);
    }

    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.renderer.destroy();
    }
}

interface EditArgs {
    data?: Object;
    requestType?: string;
    previousData?: Object;
    selectedRow?: Number;
    type?: string;
    promise?: Promise<Object>;
    row?: Element;
}
