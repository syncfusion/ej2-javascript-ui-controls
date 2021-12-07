import { extend, select } from '@syncfusion/ej2-base';
import { remove, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EditEventArgs, AddEventArgs, SaveEventArgs, CustomEditEventArgs, CustomAddEventArgs } from '../base/interface';
import { parentsUntil, isGroupAdaptive, refreshForeignData, getObject, gridActionHandler } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { ReturnType } from '../base/type';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DataUtil } from '@syncfusion/ej2-data';
import { freezeTable } from '../base/enum';
import { addRemoveEventListener } from '../base/util';
import * as literals from '../base/string-literals';

/**
 * `NormalEdit` module is used to handle normal('inline, dialog, external') editing actions.
 *
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
    private evtHandlers: { event: string, handler: Function }[];

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.renderer = renderer;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    protected clickHandler(e: MouseEvent): void {
        const target: Element = e.target as Element;
        const gObj: IGrid = this.parent;
        if ((((parentsUntil(target,  literals.gridContent) &&
            parentsUntil(parentsUntil(target,  literals.gridContent), 'e-grid').id === gObj.element.id)) || (gObj.frozenRows
                && parentsUntil(target, literals.headerContent))) && !parentsUntil(target, 'e-unboundcelldiv')) {
            this.rowIndex = parentsUntil(target, literals.rowCell)
                ? parseInt(target.parentElement.getAttribute(literals.ariaRowIndex), 10) : -1;
            if (gObj.isEdit) {
                gObj.editModule.endEdit();
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        if (parentsUntil(e.target as Element, literals.rowCell) && this.parent.editSettings.allowEditOnDblClick) {
            this.parent.editModule.startEdit(parentsUntil(e.target as Element, literals.row) as HTMLTableRowElement);
        }
    }

    /**
     * The function used to trigger editComplete
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public editComplete(e: NotifyArgs): void {
        this.parent.isEdit = false;
        const action: string = 'action';
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

    private getEditArgs(editedData: object, rowObj?: Row<Column>, isScroll?: boolean): CustomEditEventArgs {
        const primaryKeys: string[] = this.parent.getPrimaryKeyFieldNames();
        const primaryKeyValues: string[] = [];
        for (let i: number = 0; i < primaryKeys.length; i++) {
            primaryKeyValues.push(getObject(primaryKeys[i], editedData));
        }
        const args: CustomEditEventArgs = {
            primaryKey: primaryKeys, primaryKeyValue: primaryKeyValues, requestType: 'beginEdit',
            rowData: editedData, rowIndex: this.rowIndex, type: 'edit', cancel: false,
            foreignKeyData: rowObj && rowObj.foreignKeyData, target: undefined, isScroll: isScroll
        };
        return args;
    }

    protected startEdit(tr: Element): void {
        const gObj: IGrid = this.parent;
        this.rowIndex = this.editRowIndex = parseInt(tr.getAttribute(literals.ariaRowIndex), 10);
        if (gObj.enableVirtualization || gObj.enableInfiniteScrolling) {
            const selector: string = '.e-row[aria-rowindex="' + this.rowIndex + '"]';
            const virtualRow: Element = this.parent.element.querySelector(selector);
            if (!virtualRow) {
                return;
            }
        }
        const e: { data: Object, index: number, isScroll: boolean } = { data: undefined, index: this.rowIndex, isScroll: false };
        this.parent.notify(events.virtualScrollEditActionBegin, e);
        if (isGroupAdaptive(gObj)) {
            const rObj: Row<Column> = gObj.getRowObjectFromUID(tr.getAttribute('data-uid'));
            this.previousData = rObj.data;
        } else if (!this.previousData && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
            this.previousData = e.data;
        } else if (!this.parent.enableVirtualization) {
            this.previousData = extend({}, {}, gObj.getCurrentViewRecords()[this.rowIndex], true);
        }
        const editedData: Object = extend({}, {}, e.data || this.previousData, true);
        this.uid = tr.getAttribute('data-uid');
        const rowObj: Row<Column> = gObj.getRowObjectFromUID(this.uid);
        const args: CustomEditEventArgs = this.getEditArgs(editedData, rowObj, e.isScroll);
        args.row = tr;
        if (!args.isScroll) {
            this.parent.notify(
                events.createVirtualValidationForm,
                { uid: this.uid, prevData: this.previousData, argsCreator: this.getEditArgs.bind(this), renderer: this.renderer }
            );
            gObj.trigger(events.beginEdit, args, (begineditargs: EditEventArgs) => {
                begineditargs.type = 'actionBegin';
                gObj.trigger(events.actionBegin, begineditargs, (editargs: EditEventArgs) => {
                    if (!editargs.cancel) {
                        this.inlineEditHandler(editargs, tr);
                    }
                });
            });
        } else {
            this.inlineEditHandler(args, tr);
        }
    }

    private inlineEditHandler(editargs: EditEventArgs, tr: Element): void {
        const gObj: IGrid = this.parent;
        gObj.isEdit = true;
        editargs.row = editargs.row ? editargs.row : tr;
        if (gObj.editSettings.mode !== 'Dialog') {
            gObj.clearSelection();
        }
        if (gObj.editSettings.mode === 'Dialog' && (<{ selectionModule?: { preventFocus: boolean } }>gObj).selectionModule) {
            (<{ selectionModule?: { preventFocus: boolean } }>gObj).selectionModule.preventFocus = true;
            editargs.row.classList.add('e-dlgeditrow');
        }
        this.renderer.update(editargs);
        this.uid = tr.getAttribute('data-uid');
        gObj.editModule.applyFormValidation();
        editargs.type = 'actionComplete';
        gObj.trigger(events.actionComplete, editargs);
        this.args = editargs;
        if (this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'textwrap' });
        }
    }

    protected updateRow(index: number, data: Object): void {
        const gObj: IGrid = this.parent;
        this.editRowIndex = index;
        const args: SaveEventArgs = {
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
        const gObj: IGrid = this.parent;
        const isValid: boolean = gObj.editModule.editFormValidate();
        const validationArgs: { prevData: object, isValid: boolean, editIdx: number, addIdx: number } = {
            prevData: this.previousData, isValid: true, editIdx: this.editRowIndex, addIdx: this.addedRowIndex
        };
        gObj.notify(events.validateVirtualForm, validationArgs);
        return (isValid && validationArgs.isValid);
    }

    protected endEdit(): void {
        const gObj: IGrid = this.parent;
        if (!this.parent.isEdit || !this.editFormValidate()) {
            return;
        }
        let editedData: Object = extend({}, {}, this.previousData, true);
        const args: SaveEventArgs = extend(this.args, {
            requestType: 'save', type: events.actionBegin, data: editedData, cancel: false,
            previousData: this.previousData, selectedRow: gObj.selectedRowIndex, foreignKeyData: {}
        });
        const index: number = gObj.getFrozenMode() === 'Right' ? 1 : 0;
        const isDlg: boolean = gObj.editSettings.mode === 'Dialog';
        const dlgWrapper: Element = select('#' + gObj.element.id + '_dialogEdit_wrapper', document);
        const dlgForm: Element = isDlg ? dlgWrapper.querySelector('.e-gridform') : gObj.element.getElementsByClassName('e-gridform')[index];
        const data: { virtualData: Object, isAdd: boolean, isScroll: boolean, endEdit?: boolean } = {
            virtualData: extend({}, {}, this.previousData, true), isAdd: false, isScroll: false, endEdit: true
        };
        this.parent.notify(events.getVirtualData, data);
        if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
            && this.parent.editSettings.mode === 'Normal' && Object.keys(data.virtualData).length) {
            if (this.parent.isEdit) {
                this.currentVirtualData = editedData = args.data = data.virtualData;
            }
        } else {
            editedData = gObj.editModule.getCurrentEditedData(dlgForm, editedData);
        }
        if (gObj.isFrozenGrid() && gObj.editSettings.mode === 'Normal') {
            const mhdrFrm: Element = gObj.getMovableVirtualHeader().querySelector('.e-gridform');
            const mCntFrm: Element = gObj.getMovableVirtualContent().querySelector('.e-gridform');
            const mvblEle: Element[] = [mhdrFrm || mCntFrm];
            let frHdrFrm: Element; let frCntFrm: Element; let frEle: Element[] = [];
            if (gObj.getFrozenMode() === literals.leftRight) {
                frHdrFrm = gObj.getFrozenRightHeader().querySelector('.e-gridform');
                frCntFrm = gObj.getFrozenRightContent().querySelector('.e-gridform');
                frEle = [frHdrFrm || frCntFrm];
            }
            gridActionHandler(
                this.parent,
                (tableName: freezeTable, elements: Element[]) => {
                    for (const ele of elements) {
                        if (ele) {
                            editedData = gObj.editModule.getCurrentEditedData(ele, editedData);
                        }
                    }
                },
                [[], mvblEle, frEle]
            );
        }
        let eleLength: number = [].slice.call(gObj.element.getElementsByClassName(literals.editedRow)).length;
        if (!data.isAdd && Object.keys(this.currentVirtualData).length && !eleLength) {
            eleLength = 1;
        }
        if (isDlg ? dlgWrapper.getElementsByClassName(literals.editedRow).length : eleLength) {
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
        const gObj: IGrid = this.parent;
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
        if (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) {
            this.parent.getCurrentViewRecords()[this.editRowIndex] = data;
        }
    }

    private requestSuccess(args: Object): void {
        if (this.parent.editModule.formObj && !this.parent.editModule.formObj.isDestroyed) {
            this.destroyElements();
            this.stopEditStatus();
            if (this.parent.editSettings.mode === 'Dialog' && (<{ action?: string }>args).action !== 'add' &&
                (<{ selectionModule?: { preventFocus: boolean } }>this.parent).selectionModule) {
                this.parent.element.querySelector('.e-dlgeditrow').classList.remove('e-dlgeditrow');
            }
        }
    }

    private editSuccess(e: Object, args: EditArgs): void {
        if (!isNullOrUndefined(e) && !(e instanceof Array)) {
            const rowData: string = 'rowData';
            args.data = extend({}, extend({}, args[rowData], args.data), e);
        }
        this.requestSuccess(args);
        this.parent.trigger(events.beforeDataBound, args);
        args.type = events.actionComplete;
        this.parent.isEdit = false;
        this.refreshRow(args.data);
        this.parent.notify(events.virtualScrollEditSuccess, args);
        this.parent.editModule.checkLastRow(args.row);
        this.parent.editModule.isLastRow = false;
        this.updateCurrentViewData(args.data);
        this.blazorTemplate();
        this.editRowIndex = null;
        this.parent.trigger(events.actionComplete, args);
        if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
            || (!this.parent.isPersistSelection) && !this.parent.selectionSettings.checkboxOnly) {
            if (this.parent.editSettings.mode !== 'Dialog') {
                this.parent.selectRow(this.rowIndex > -1 ? this.rowIndex : this.editRowIndex);
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
        if (this.parent.isFrozenGrid() && this.cloneFrozen) {
            this.cloneFrozen.remove();
            this.frozen.classList.remove('e-hiddenrow');
        }
    }

    private blazorTemplate(): void {
        const cols: Column[] = this.parent.getColumns();
        if (this.parent.editSettings.template && this.parent.editSettings.mode === 'Normal') {
            updateBlazorTemplate(this.parent.element.id + 'editSettingsTemplate', 'Template', this.parent.editSettings);
        }
        for (let i: number = 0; i < cols.length; i++) {
            const col: Column = cols[i];
            if (col.template) {
                updateBlazorTemplate(this.parent.element.id + col.uid, 'Template', col, false);
            }
            if (col.editTemplate) {
                updateBlazorTemplate(this.parent.element.id + col.uid + 'editTemplate', 'EditTemplate', col);
            }
        }
    }

    private editFailure(e: ReturnType): void {
        this.parent.trigger(events.actionFailure, ({ error: e }));
        this.parent.hideSpinner();
        this.parent.log('actionfailure', { error: e });
    }

    private needRefresh(): boolean {
        let refresh: boolean = true;
        const editedRow: Element = this.parent.element.querySelector('.e-gridform');
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && this.parent.editSettings.mode === 'Normal' && !editedRow) {
            refresh = false;
        }
        return refresh;
    }

    private refreshRow(data: Object): void {
        const frzCols: boolean = this.parent.isFrozenGrid();
        const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.uid);
        if (rowObj) {
            rowObj.changes = data;
            this.parent.notify(events.refreshVirtualCache, { data: data });
            refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
            if (this.needRefresh()) {
                row.refresh(rowObj, this.parent.getColumns() as Column[], true);
            }
            const tr: Element[] = [].slice.call(this.parent.element.querySelectorAll('[aria-rowindex="' + rowObj.index + '"]'));
            if (frzCols && tr.length) {
                for (let i: number = 0; i < tr.length; i++) {
                    const rowUid: string = tr[i].getAttribute('data-uid');
                    if (rowUid !== this.uid) {
                        rowObj = this.parent.getRowObjectFromUID(rowUid);
                        rowObj.changes = data;
                        row.refresh(rowObj, this.parent.getColumns(), true);
                        this.parent.editModule.checkLastRow(tr[i]);
                    }
                }
            }
        }
    }

    protected closeEdit(): void {
        if (!this.parent.isEdit) { return; }
        const gObj: IGrid = this.parent;
        const args: { data: Object, requestType: string, cancel: boolean, selectedRow: number, type: string } = extend(this.args, {
            requestType: 'cancel', type: events.actionBegin, cancel: false, data: this.previousData, selectedRow: gObj.selectedRowIndex
        }) as { data: Object, requestType: string, cancel: boolean, selectedRow: number, type: string };
        gObj.notify(events.virtualScrollEditCancel, args);
        this.blazorTemplate();
        gObj.trigger(
            events.actionBegin, args,
            (closeEditArgs: { cancel: boolean, data: Object, requestType: string, selectedRow: number, type: string }) => {
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
                    this.refreshRow(closeEditArgs.data);
                }
                const isLazyLoad: boolean = gObj.groupSettings.enableLazyLoading && gObj.groupSettings.columns.length
                    && !gObj.getContentTable().querySelector('tr.e-emptyrow');
                if (!gObj.getContentTable().querySelector('tr.e-emptyrow') &&
                    !gObj.getContentTable().querySelector('tr.e-row') && !isLazyLoad) {
                    gObj.renderModule.emptyRow();
                }
                if (gObj.editSettings.mode !== 'Dialog') {
                    gObj.selectRow(this.rowIndex);
                }
                gObj.trigger(events.actionComplete, closeEditArgs);
            });
    }

    protected addRecord(data?: Object, index?: number): void {
        const gObj: IGrid = this.parent;
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
        const cols: Column[] = gObj.getColumns();
        const rowData: { virtualData: Object, isScroll: boolean } = { virtualData: {}, isScroll: false };
        this.parent.notify(events.getVirtualData, rowData);
        for (let i: number = 0; i < cols.length; i++) {
            if (rowData.isScroll && cols[i].getFreezeTableName() !== 'movable') {
                continue;
            }
            if (cols[i].field) {
                DataUtil.setValue(cols[i].field, cols[i].defaultValue, this.previousData);
            }
        }
        const args: CustomAddEventArgs = {
            cancel: false, foreignKeyData: {}, //foreign key support
            requestType: 'add', data: this.previousData, type: events.actionBegin, index: index,
            rowData: this.previousData, target: undefined, isScroll: rowData.isScroll
        };
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && Object.keys(rowData.virtualData).length) {
            args.data = args.rowData = rowData.virtualData;
        }
        if (!args.isScroll) {
            this.parent.notify(
                events.createVirtualValidationForm,
                { uid: this.uid, prevData: this.previousData, argsCreator: this.getEditArgs.bind(this), renderer: this.renderer }
            );
            gObj.trigger(events.actionBegin, args, (addArgs: AddEventArgs) => {
                if (addArgs.cancel) {
                    return;
                }
                this.inlineAddHandler(addArgs);
            });
        } else {
            this.inlineAddHandler(args);
        }
    }

    private inlineAddHandler(addArgs: AddEventArgs): void {
        const gObj: IGrid = this.parent;
        gObj.isEdit = true;
        if (gObj.editSettings.mode !== 'Dialog') {
            gObj.clearSelection();
        }
        this.renderer.addNew(addArgs);
        gObj.editModule.applyFormValidation();
        addArgs.type = events.actionComplete;
        addArgs.row = gObj.element.querySelector('.' + literals.addedRow);
        gObj.trigger(events.actionComplete, addArgs);
        this.args = addArgs as EditArgs;
    }

    protected deleteRecord(fieldname?: string, data?: Object): void {
        this.editRowIndex = this.parent.selectedRowIndex;
        if (data) {
            data = (data instanceof Array) ? data : [data];
            const gObj: IGrid = this.parent;
            const dataLen: number = Object.keys(data).length;
            fieldname = fieldname || this.parent.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < dataLen; i++) {
                let tmpRecord: Object;
                const contained: boolean = gObj.currentViewData.some((record: Object) => {
                    tmpRecord = record;
                    return data[i] === getObject(fieldname, record) || data[i] === record;
                });
                data[i] = contained ? tmpRecord : data[i][fieldname] ? data[i] : { [fieldname]: data[i] };
            }
        }
        const args: object = {
            requestType: 'delete', type: events.actionBegin, foreignKeyData: {}, //foreign key support
            data: data ? data : this.parent.getSelectedRecords(), tr: this.parent.getSelectedRows(), cancel: false
        };
        if (!isNullOrUndefined(this.parent.commandDelIndex)) {
            (<{ data?: Object[] }>args).data[0] =
            this.parent.getRowObjectFromUID(this.parent.getRowByIndex(this.parent.commandDelIndex).getAttribute('data-uid')).data;
        }
        if (this.parent.enableVirtualization && (<{ data?: Object[] }>args).data.length > 1) {
            const uid: string = this.parent.getSelectedRows()[0].getAttribute('data-uid');
            (<{ data?: Object[] }>args).data = [this.parent.getRowObjectFromUID(uid).data];
        }
        this.parent.notify(events.modelChanged, args);
    }

    private stopEditStatus(): void {
        const gObj: IGrid = this.parent;
        const addElements: Element[] = [].slice.call(gObj.element.getElementsByClassName(literals.addedRow));
        const editElements: Element[] = [].slice.call(gObj.element.getElementsByClassName(literals.editedRow));
        for (let i: number = 0; i < addElements.length; i++) {
            remove(addElements[i]);
        }
        for (let i: number = 0; i < editElements.length; i++) {
            editElements[i].classList.remove(literals.editedRow);
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.evtHandlers = [{ event: events.crudAction, handler: this.editHandler },
            { event: events.doubleTap, handler: this.dblClickHandler },
            { event: events.click, handler: this.clickHandler },
            { event: events.recordAdded, handler: this.requestSuccess },
            { event: events.dblclick, handler: this.dblClickHandler },
            { event: events.deleteComplete, handler: this.editComplete },
            { event: events.saveComplete, handler: this.editComplete },
            { event: events.rowModeChange, handler: this.closeEdit },
            { event: events.closeInline, handler: this.closeForm }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    }

    /**
     * @returns {void}
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
    selectedRow?: number;
    type?: string;
    promise?: Promise<Object>;
    row?: Element;
}
