import { extend } from '@syncfusion/ej2-base';
import { remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EditEventArgs, AddEventArgs, SaveEventArgs } from '../base/interface';
import { parentsUntil, refreshForeignData, getObject } from '../base/util';
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
        switch (e.requestType as string) {
            case 'save':
                if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
                    || (!this.parent.isPersistSelection)) {
                    this.parent.selectRow(0);
                }
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'save',
                    type: events.actionComplete
                }));
                break;
            case 'delete':
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'delete',
                    type: events.actionComplete
                }));
                this.parent.selectRow(this.editRowIndex);
                break;
        }
    }

    protected startEdit(tr: Element): void {
        let gObj: IGrid = this.parent;
        let primaryKeys: string[] = gObj.getPrimaryKeyFieldNames();
        let primaryKeyValues: string[] = [];
        this.rowIndex = this.editRowIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
        this.previousData = gObj.getCurrentViewRecords()[this.rowIndex];
        for (let i: number = 0; i < primaryKeys.length; i++) {
            primaryKeyValues.push(this.previousData[primaryKeys[i]]);
        }
        this.uid = tr.getAttribute('data-uid');
        let rowObj: Row<Column> = gObj.getRowObjectFromUID(this.uid);
        let args: EditEventArgs = {
            row: tr, primaryKey: primaryKeys, primaryKeyValue: primaryKeyValues, requestType: 'beginEdit',
            rowData: this.previousData, rowIndex: this.rowIndex, type: 'edit', cancel: false,
            foreignKeyData: rowObj && rowObj.foreignKeyData
        };
        gObj.trigger(events.beginEdit, args);
        args.type = 'actionBegin';
        gObj.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        gObj.isEdit = true;
        if (gObj.editSettings.mode !== 'Dialog') {
            gObj.clearSelection();
        }
        if (gObj.editSettings.mode === 'Dialog') {
            (<{selectionModule?: {preventFocus: boolean}}>gObj).selectionModule.preventFocus = true;
            args.row.classList.add('e-dlgeditrow');
        }
        this.renderer.update(args);
        this.uid = tr.getAttribute('data-uid');
        gObj.editModule.applyFormValidation();
        args.type = 'actionComplete';
        gObj.trigger(events.actionComplete, args);
        this.args = args;
        if (this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'textwrap' });
        }
    }

    protected updateRow(index: number, data: Object): void {
        let gObj: IGrid = this.parent;
        let args: SaveEventArgs = {
            requestType: 'save', type: events.actionBegin, data: data, cancel: false,
            previousData: gObj.getCurrentViewRecords()[index]
        };
        gObj.showSpinner();
        gObj.notify(events.updateData, args);
        gObj.refresh();
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
        editedData = gObj.editModule.getCurrentEditedData(gObj.element.querySelector('.e-gridform'), editedData);
        if (gObj.getFrozenColumns() && gObj.editSettings.mode === 'Normal') {
            let mForm: Element = gObj.element.querySelector('.e-movableheader').querySelector('.e-gridform');
            if (gObj.frozenRows && mForm) {
                editedData = gObj.editModule.getCurrentEditedData(mForm, editedData);
            } else {
                editedData = gObj.editModule.getCurrentEditedData(
                    gObj.element.querySelector('.e-movablecontent').querySelector('.e-gridform'), editedData);
            }
        }
        if (gObj.element.querySelectorAll('.e-editedrow').length) {
            args.action = 'edit';
            gObj.trigger(events.actionBegin, args);
            if (args.cancel) {
                return;
            }
            gObj.showSpinner();
            gObj.notify(events.updateData, args);
        } else {
            args.action = 'add';
            args.selectedRow = 0;
            args.index = this.addedRowIndex;
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
        this.editFailure(e);
    }

    private updateCurrentViewData(data: Object): void {
        this.parent.getCurrentViewRecords()[this.editRowIndex] = data;
    }

    private requestSuccess(args: Object): void {
        if (this.parent.editModule.formObj && !this.parent.editModule.formObj.isDestroyed) {
            this.destroyElements();
            this.stopEditStatus();
            if (this.parent.editSettings.mode === 'Dialog' && (<{action?: string}>args).action !== 'add') {
                this.parent.element.querySelector('.e-dlgeditrow').classList.remove('e-dlgeditrow');
            }
        }
    }

    private editSuccess(e: Object, args: EditArgs): void {
        if (!isNullOrUndefined(e)) {
            args.data = e;
        }
        this.requestSuccess(args);
        this.parent.trigger(events.beforeDataBound, args);
        args.type = events.actionComplete;
        this.parent.isEdit = false;
        this.refreshRow(args.data);
        this.updateCurrentViewData(args.data);
        this.parent.trigger(events.actionComplete, args);
        if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
            || (!this.parent.isPersistSelection)) {
            if (this.parent.editSettings.mode !== 'Dialog') {
                this.parent.selectRow(this.rowIndex > -1 ? this.rowIndex : this.editRowIndex);
            }
        }
        this.parent.hideSpinner();
    }

    private editFailure(e: ReturnType): void {
        this.parent.trigger(events.actionFailure, e);
        this.parent.hideSpinner();
    }

    private refreshRow(data: Object): void {
        let frzCols: number = this.parent.getFrozenColumns();
        let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.uid);
        if (rowObj) {
            rowObj.changes = data;
            refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
            row.refresh(rowObj, this.parent.getColumns() as Column[], true);
            if (frzCols) {
                let uid: string;
                let tr: Element = this.parent.element.querySelector('[data-uid=' + rowObj.uid + ']');
                if ((parentsUntil(tr, 'e-frozencontent')) || (parentsUntil(tr, 'e-frozenheader'))) {
                    uid = this.parent.getMovableRows()[rowObj.index].getAttribute('data-uid');
                } else {
                    uid = this.parent.getRows()[rowObj.index].getAttribute('data-uid');
                }
                rowObj = this.parent.getRowObjectFromUID(uid);
                rowObj.changes = data;
                row.refresh(rowObj, this.parent.columns as Column[], true);
            }
        }
    }

    protected closeEdit(): void {
        if (!this.parent.isEdit) { return; }
        let gObj: IGrid = this.parent;
        let args: { data: Object, requestType: string, selectedRow: Number, type: string } = extend(this.args, {
            requestType: 'cancel', type: events.actionBegin, data: this.previousData, selectedRow: gObj.selectedRowIndex
        }) as { data: Object, requestType: string, selectedRow: Number, type: string };
        gObj.trigger(events.actionBegin, args);
        if (this.parent.editSettings.mode === 'Dialog') {
            this.parent.notify(events.dialogDestroy, {});
        }
        gObj.isEdit = false;
        this.stopEditStatus();
        args.type = events.actionComplete;
        if (gObj.editSettings.mode !== 'Dialog') {
            this.refreshRow(args.data);
        }
        if (gObj.getContentTable().querySelector('tr.e-emptyrow') &&
            !gObj.getContentTable().querySelector('tr.e-row')) {
            gObj.getContentTable().querySelector('tr.e-emptyrow').classList.remove('e-hide');
        }
        if (gObj.editSettings.mode !== 'Dialog') {
            gObj.selectRow(this.rowIndex);
        }
        gObj.trigger(events.actionComplete, args);
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
        (<Column[]>gObj.columns).forEach((col: Column) => {
            if (col.field) {
                DataUtil.setValue(col.field, col.defaultValue, this.previousData );
            }
        });
        let args: AddEventArgs = {
            cancel: false, foreignKeyData: {}, //foreign key support
            requestType: 'add', data: this.previousData, type: events.actionBegin, index: index,
            rowData: this.previousData
        };
        gObj.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        gObj.isEdit = true;
        if (gObj.editSettings.mode !== 'Dialog') {
            gObj.clearSelection();
        }
        this.renderer.addNew(args);
        gObj.editModule.applyFormValidation();
        args.type = events.actionComplete;
        args.row = gObj.element.querySelector('.e-addedrow');
        gObj.trigger(events.actionComplete, args);
        this.args = args as EditArgs;
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
        this.parent.notify(events.modelChanged, {
            requestType: 'delete', type: events.actionBegin, foreignKeyData: {}, //foreign key support
            data: data ? data : this.parent.getSelectedRecords(), tr: this.parent.getSelectedRows(), cancel: false
        });
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
}