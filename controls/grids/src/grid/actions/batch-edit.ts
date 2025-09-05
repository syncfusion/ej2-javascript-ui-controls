import { extend, addClass, removeClass, setValue, closest, select, EventHandler } from '@syncfusion/ej2-base';
import { remove, classList } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { isNullOrUndefined, KeyboardEventArgs, isUndefined } from '@syncfusion/ej2-base';
import { IGrid, BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs } from '../base/interface';
import { BatchAddArgs, CellEditArgs, CellSaveArgs, CellFocusArgs, BatchCancelArgs } from '../base/interface';
import { CellType } from '../base/enum';
import { parentsUntil, refreshForeignData, getObject, addRemoveEventListener, getCellFromRow } from '../base/util';
import { getCellByColAndRowIndex, addFixedColumnBorder } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { ServiceLocator } from '../services/service-locator';
import { IModelGenerator } from '../base/interface';
import { RowModelGenerator } from '../services/row-model-generator';
import { Column } from '../models/column';
import { FocusStrategy } from '../services/focus-strategy';
import { DataUtil } from '@syncfusion/ej2-data';
import * as literals from '../base/string-literals';

/**
 * `BatchEdit` module is used to handle batch editing actions.
 *
 * @hidden
 */
export class BatchEdit {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private form: Element;
    public formObj: FormValidator;
    private renderer: EditRender;
    private focus: FocusStrategy;
    private dataBoundFunction: Function;
    private batchCancelFunction: Function;
    private removeSelectedData: Object[];
    private cellDetails: {
        rowData?: Object, field?: string, value?: string,
        isForeignKey?: boolean, column?: Column, rowIndex?: number, cellIndex?: number,
        foreignKeyData?: Object
    } = {};
    private isColored: boolean;
    private isAdded: boolean;
    private originalCell: Object = {};
    private cloneCell: Object = {};
    private editNext: boolean = false;
    private preventSaveCell: boolean = false;
    private index: number;
    private crtRowIndex: number;
    private field: string;
    private initialRender: boolean = true;
    private validationColObj: { field: string, cellIdx: number }[] = [];
    private isAdd: boolean;
    private newReactTd: Element;
    private evtHandlers: { event: string, handler: Function }[];
    /** @hidden */
    public addBatchRow: boolean = false;
    private prevEditedBatchCell: boolean = false;
    private mouseDownElement: Element;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = renderer;
        this.focus = serviceLocator.getService<FocusStrategy>('focus');
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.evtHandlers = [{ event: events.click, handler: this.clickHandler },
            { event: events.dblclick, handler: this.dblClickHandler },
            { event: events.beforeCellFocused, handler: this.onBeforeCellFocused },
            { event: events.cellFocused, handler: this.onCellFocused },
            { event: events.doubleTap, handler: this.dblClickHandler },
            { event: events.keyPressed, handler: this.keyDownHandler },
            { event: events.editNextValCell, handler: this.editNextValCell },
            { event: events.destroy, handler: this.destroy }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
        EventHandler.add(this.parent.element, 'mousedown', this.mouseDownHandler, this);
        this.dataBoundFunction = this.dataBound.bind(this);
        this.batchCancelFunction = this.batchCancel.bind(this);
        this.parent.addEventListener(events.dataBound, this.dataBoundFunction);
        this.parent.addEventListener(events.batchCancel, this.batchCancelFunction);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
        EventHandler.remove(this.parent.element, 'mousedown', this.mouseDownHandler);
        this.parent.removeEventListener(events.dataBound, this.dataBoundFunction);
        this.parent.removeEventListener(events.batchCancel, this.batchCancelFunction);
    }

    private batchCancel(): void {
        this.parent.focusModule.restoreFocus({ requestType: 'batchCancel' });
    }

    private dataBound(): void {
        this.parent.notify(events.toolbarRefresh, {});
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    protected mouseDownHandler(e: MouseEvent): void {
        if (!isNullOrUndefined(this.parent.element.querySelector('.e-gridform'))){
            this.mouseDownElement = e.target as Element;
        }
        else {
            this.mouseDownElement = undefined;
        }
    }

    protected clickHandler(e: MouseEvent): void {
        if (!parentsUntil(e.target as Element, this.parent.element.id + '_add', true)) {
            if ((this.parent.isEdit && closest(this.form, 'td') !== closest(e.target as Element, 'td'))
                && isNullOrUndefined(this.mouseDownElement) || this.mouseDownElement === e.target as Element) {
                this.saveCell();
                this.editNextValCell();
            }
            if (parentsUntil(e.target as HTMLElement, literals.rowCell) && !this.parent.isEdit) {
                this.setCellIdx(e.target as HTMLTableCellElement);
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        const target: Element = parentsUntil(e.target as Element, literals.rowCell);
        const tr: Element = parentsUntil(e.target as Element, literals.row);
        const rowIndex: number = tr && parseInt(tr.getAttribute(literals.ariaRowIndex), 10) - 1;
        const colIndex: number = target && parseInt(target.getAttribute(literals.ariaColIndex), 10) - 1;
        if (!isNullOrUndefined(target) && !isNullOrUndefined(rowIndex) && !isNaN(colIndex)
            && !target.parentElement.classList.contains(literals.editedRow) &&
                (this.parent.getColumns()[parseInt(colIndex.toString(), 10)] as Column).allowEditing) {
            this.editCell(
                rowIndex, (this.parent.getColumns()[parseInt(colIndex.toString(), 10)] as Column).field, this.isAddRow(rowIndex));
        }
    }

    private onBeforeCellFocused(e: CellFocusArgs): void {
        if (this.parent.isEdit && this.validateFormObj() &&
            (e.byClick || (['tab', 'shiftTab', 'enter', 'shiftEnter'].indexOf(e.keyArgs.action) > -1))) {
            e.cancel = true;
            if (e.byClick) {
                e.clickArgs.preventDefault();
            } else {
                e.keyArgs.preventDefault();
            }
        }
    }

    private onCellFocused(e: CellFocusArgs): void {
        const clear: boolean = (!e.container.isContent || !e.container.isDataCell) && !(this.parent.frozenRows && e.container.isHeader);
        if (this.parent.focusModule.active) {
            this.prevEditedBatchCell = this.parent.focusModule.active.matrix.current.toString() === this.prevEditedBatchCellMatrix()
                .toString();
            this.crtRowIndex = [].slice.call(this.parent.focusModule.active.getTable().rows).indexOf(closest(e.element, 'tr'));
        }
        if (!e.byKey || clear) {
            if ((this.parent.isEdit && clear)) {
                this.saveCell();
            }
            return;
        }
        let [rowIndex, cellIndex]: number[] = e.container.indexes;
        const actualIndex: number = e.element.getAttribute('aria-colindex') ? parseInt(e.element.getAttribute('aria-colindex'), 10) - 1 : cellIndex;
        if (actualIndex !== cellIndex) {
            cellIndex = actualIndex;
        }
        if (this.parent.frozenRows && e.container.isContent) {
            rowIndex += ((this.parent.getContent().querySelector('.e-hiddenrow') ? 0 : this.parent.frozenRows) +
                this.parent.getHeaderContent().querySelectorAll('.e-insertedrow').length);
        }
        let isEdit: boolean = this.parent.isEdit;
        if (!this.parent.element.getElementsByClassName('e-popup-open').length) {
            isEdit = isEdit && !this.validateFormObj();
            switch (e.keyArgs.action) {
            case 'tab':
            case 'shiftTab':
                // eslint-disable-next-line no-case-declarations
                const indent: number = this.parent.isRowDragable() && this.parent.isDetail() ? 2 :
                    this.parent.isRowDragable() || this.parent.isDetail() ? 1 : 0;
                // eslint-disable-next-line no-case-declarations
                const col: Column = this.parent.getColumns()[cellIndex - indent];
                if (col && !this.parent.isEdit) {
                    this.editCell(rowIndex, col.field);
                }
                if (isEdit || this.parent.isLastCellPrimaryKey) {
                    this.editCellFromIndex(rowIndex, cellIndex);
                }
                break;
            case 'enter':
            case 'shiftEnter':
                e.keyArgs.preventDefault();
                // eslint-disable-next-line no-case-declarations
                const args: { cancel: boolean, keyArgs: object } = {cancel: false, keyArgs: e.keyArgs};
                this.parent.notify('beforeFocusCellEdit', args);
                if (!args.cancel && isEdit) {
                    this.editCell(rowIndex, this.cellDetails.column.field);
                }
                break;
            case 'f2':
                this.editCellFromIndex(rowIndex, cellIndex);
                this.focus.focus();
                break;
            }
        }
    }

    private isAddRow(index: number): boolean {
        return this.parent.getDataRows()[parseInt(index.toString(), 10)].classList.contains('e-insertedrow');
    }

    private editCellFromIndex(rowIdx: number, cellIdx: number): void {
        this.cellDetails.rowIndex = rowIdx;
        this.cellDetails.cellIndex = cellIdx;
        this.editCell(rowIdx, (this.parent.getColumns() as Column[])[parseInt(cellIdx.toString(), 10)].field, this.isAddRow(rowIdx));
    }

    public closeEdit(): void {
        const gObj: IGrid = this.parent;
        const rows: Row<Column>[] = this.parent.getRowsObject();
        const argument: BeforeBatchSaveArgs = { cancel: false, batchChanges: this.getBatchChanges() };
        gObj.notify(events.beforeBatchCancel, argument);
        if (argument.cancel) {
            return;
        }

        if (gObj.isEdit) {
            this.saveCell(true);
        }
        this.isAdded = false;
        let selectedIndexes: number[] = [];
        if (gObj.selectionModule) {
            selectedIndexes = gObj.selectionModule.selectedRowIndexes;
        }
        gObj.clearSelection();
        for (let i: number = 0; i < rows.length; i++) {
            let isInsert: boolean = false;
            const isDirty: boolean = rows[parseInt(i.toString(), 10)].isDirty;
            isInsert = this.removeBatchElementChanges(rows[parseInt(i.toString(), 10)], isDirty);
            if (isInsert) { rows.splice(i, 1); }
            if (isInsert) {
                i--;
            }
        }
        if (!gObj.getContentTable().querySelector('tr.e-row')) {
            gObj.renderModule.renderEmptyRow();
        }
        let args: BatchCancelArgs = {
            requestType: 'batchCancel', rows: this.parent.getRowsObject()
        };
        gObj.notify(events.batchCancel, {
            rows: this.parent.getRowsObject().length ? this.parent.getRowsObject() :
                [new Row<Column>({ isDataRow: true, cells: [new Cell<Column>({ isDataCell: true, visible: true })] })]
        });
        if (gObj.isCheckBoxSelection && (gObj.selectionSettings.checkboxOnly || gObj.selectionSettings.persistSelection)) {
            gObj.selectRows(selectedIndexes);
        } else {
            gObj.selectRow(this.cellDetails.rowIndex);
        }
        this.refreshRowIdx();
        gObj.notify(events.toolbarRefresh, {});
        this.parent.notify(events.tooltipDestroy, {});
        args = { requestType: 'batchCancel', rows: this.parent.getRowsObject() };
        gObj.trigger(events.batchCancel, args);
    }

    private removeBatchElementChanges(row: Row<Column>, isDirty: boolean): boolean {
        const gObj: IGrid = this.parent;
        const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        let isInstertedRemoved: boolean = false;
        if (isDirty) {
            row.isDirty = isDirty;
            const tr: HTMLElement = gObj.getRowElementByUID(row.uid) as HTMLElement;
            if (tr) {
                if (tr.classList.contains('e-insertedrow')) {
                    remove(tr);
                    isInstertedRemoved = true;
                } else {
                    refreshForeignData(row, this.parent.getForeignKeyColumns(), row.data);
                    delete row.changes;
                    delete row.edit;
                    row.isDirty = false;
                    classList(tr, [], ['e-hiddenrow', 'e-updatedtd']);
                    rowRenderer.refresh(row, gObj.getColumns() as Column[], false);
                }
                if (this.parent.aggregates.length > 0) {
                    const type: string = 'type';
                    const editType: Object[] = [];
                    editType[`${type}`] = 'cancel';
                    this.parent.notify(events.refreshFooterRenderer, editType);
                    if (this.parent.groupSettings.columns.length > 0) {
                        this.parent.notify(events.groupAggregates, editType);
                    }
                }
            }
        }
        return isInstertedRemoved;
    }

    public deleteRecord(fieldname?: string, data?: Object): void {
        this.saveCell();
        if (this.validateFormObj()) {
            this.saveCell(true);
        }
        this.isAdded = false;
        this.bulkDelete(fieldname, data);
        if (this.parent.aggregates.length > 0) {
            if (!(this.parent.isReact || this.parent.isVue)) {
                this.parent.notify(events.refreshFooterRenderer, {});
            }
            if (this.parent.groupSettings.columns.length > 0) {
                this.parent.notify(events.groupAggregates, {});
            }
            if (this.parent.isReact || this.parent.isVue) {
                this.parent.notify(events.refreshFooterRenderer, {});
            }
        }
    }

    public addRecord(data?: Object): void {
        this.bulkAddRow(data);
    }

    public endEdit(): void {
        if (this.parent.isEdit && this.validateFormObj()) {
            return;
        }
        this.batchSave();
    }

    private validateFormObj(): boolean {
        return this.parent.editModule.formObj && !this.parent.editModule.formObj.validate();
    }

    public batchSave(): void {
        const gObj: IGrid = this.parent;
        const deletedRecords: string = 'deletedRecords';
        if (gObj.isCheckBoxSelection) {
            const checkAllBox: Element = gObj.element.querySelector('.e-checkselectall').parentElement;
            if (checkAllBox.classList.contains('e-checkbox-disabled') &&
                gObj.pageSettings.totalRecordsCount > gObj.currentViewData.length) {
                removeClass([checkAllBox], ['e-checkbox-disabled']);
            }
        }
        this.saveCell();
        if (gObj.isEdit || this.editNextValCell() || gObj.isEdit) {
            return;
        }
        const changes: Object = this.getBatchChanges();
        if (this.parent.selectionSettings.type === 'Multiple' && changes[`${deletedRecords}`].length &&
            this.parent.selectionSettings.persistSelection) {
            changes[`${deletedRecords}`] = this.removeSelectedData;
            this.removeSelectedData = [];
        }
        const original: Object = {
            changedRecords: this.parent.getRowsObject()
                .filter((row: Row<Column>) => row.isDirty && ['add', 'delete'].indexOf(row.edit) === -1)
                .map((row: Row<Column>) => row.data)
        };
        const args: BeforeBatchSaveArgs = { batchChanges: changes, cancel: false };
        gObj.trigger(events.beforeBatchSave, args, (beforeBatchSaveArgs: BeforeBatchSaveArgs) => {
            if (beforeBatchSaveArgs.cancel) {
                return;
            }
            gObj.showSpinner();
            gObj.notify(events.bulkSave, { changes: changes, original: original });
        });
    }

    public getBatchChanges(): Object {
        const changes: { addedRecords: Object[], deletedRecords: Object[], changedRecords: Object[] } = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        const rows: Row<Column>[] = this.parent.getRowsObject() as Row<Column>[];
        for (const row of rows) {
            if (row.isDirty) {
                switch (row.edit) {
                case 'add':
                    changes.addedRecords.push(row.changes);
                    break;
                case 'delete':
                    changes.deletedRecords.push(row.data);
                    break;
                default:
                    changes.changedRecords.push(row.changes);
                }
            }
        }
        return changes;
    }

    /**
     * @param {string} uid - specifes the uid
     * @returns {void}
     * @hidden
     */
    public removeRowObjectFromUID(uid: string): void {
        const rows: Row<Column>[] = this.parent.getRowsObject() as Row<Column>[];
        let i: number = 0;
        for (let len: number = rows.length; i < len; i++) {
            if (rows[parseInt(i.toString(), 10)].uid === uid) {
                break;
            }
        }
        rows.splice(i, 1);
    }

    /**
     * @param {Row<Column>} row - specifies the row object
     * @returns {void}
     * @hidden
     */
    public addRowObject(row: Row<Column>): void {
        const gObj: IGrid = this.parent;
        const isTop: boolean = gObj.editSettings.newRowPosition === 'Top';
        const rowClone: Row<Column> = row.clone();
        if (isTop) {
            gObj.getRowsObject().unshift(rowClone);
        }
        else {
            gObj.getRowsObject().push(rowClone);
        }
    }
    // tslint:disable-next-line:max-func-body-length
    private bulkDelete(fieldname?: string, data?: Object): void {
        this.removeSelectedData = [];
        const gObj: IGrid = this.parent;
        let index: number = gObj.selectedRowIndex;
        const selectedRows: Element[] = gObj.getSelectedRows();
        const args: BeforeBatchDeleteArgs = {
            primaryKey: this.parent.getPrimaryKeyFieldNames(),
            rowIndex: index,
            rowData: data ? data : gObj.getSelectedRecords(),
            cancel: false
        };
        if (data) {
            args.row = gObj.editModule.deleteRowUid ? gObj.getRowElementByUID(gObj.editModule.deleteRowUid)
                : gObj.getRows()[gObj.getCurrentViewRecords().indexOf(data)];
        } else {
            args.row = selectedRows;
        }
        if (!args.row) {
            return;
        }
        // tslint:disable-next-line:max-func-body-length
        gObj.trigger(events.beforeBatchDelete, args, (beforeBatchDeleteArgs: BeforeBatchDeleteArgs) => {
            if (beforeBatchDeleteArgs.cancel) {
                return;
            }
            this.removeSelectedData = gObj.getSelectedRecords();
            gObj.clearSelection();
            beforeBatchDeleteArgs.row = beforeBatchDeleteArgs.row ?
                beforeBatchDeleteArgs.row as Element : data ? gObj.getRows()[parseInt(index.toString(), 10)] as Element :
                    selectedRows as Element[];
            if (selectedRows.length === 1 || data) {
                if (Array.isArray(beforeBatchDeleteArgs.row)) {
                    beforeBatchDeleteArgs.row = beforeBatchDeleteArgs.row[0];
                }
                let uid: string = beforeBatchDeleteArgs.row.getAttribute('data-uid');
                uid = data && this.parent.editModule.deleteRowUid ? uid = this.parent.editModule.deleteRowUid : uid;
                if (beforeBatchDeleteArgs.row.classList.contains('e-insertedrow')) {
                    this.removeRowObjectFromUID(uid);
                    remove(beforeBatchDeleteArgs.row);
                } else {
                    const rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
                    rowObj.isDirty = true;
                    rowObj.edit = 'delete';
                    classList(beforeBatchDeleteArgs.row as HTMLTableRowElement, ['e-hiddenrow', 'e-updatedtd'], []);
                    if (gObj.frozenRows && index < gObj.frozenRows && gObj.getDataRows().length >= gObj.frozenRows) {
                        gObj.getHeaderTable().querySelector(literals.tbody).appendChild(gObj.getRowByIndex(gObj.frozenRows - 1));
                    }
                }
                delete beforeBatchDeleteArgs.row;
            } else {
                if (data) {
                    index = parseInt((beforeBatchDeleteArgs.row as Element).getAttribute(literals.ariaRowIndex), 10) - 1;
                }
                for (let i: number = 0; i < selectedRows.length; i++) {
                    const uniqueid: string = selectedRows[parseInt(i.toString(), 10)].getAttribute('data-uid');
                    if (selectedRows[parseInt(i.toString(), 10)].classList.contains('e-insertedrow')) {
                        this.removeRowObjectFromUID(uniqueid);
                        remove(selectedRows[parseInt(i.toString(), 10)]);
                    } else {
                        classList(selectedRows[parseInt(i.toString(), 10)] as HTMLTableRowElement, ['e-hiddenrow', 'e-updatedtd'], []);
                        const selectedRow: Row<Column> = gObj.getRowObjectFromUID(uniqueid);
                        selectedRow.isDirty = true;
                        selectedRow.edit = 'delete';
                        if (gObj.frozenRows && index < gObj.frozenRows && gObj.getDataRows().length >= gObj.frozenRows) {
                            gObj.getHeaderTable().querySelector(literals.tbody).appendChild(gObj.getRowByIndex(gObj.frozenRows - 1));
                        }
                    }
                }
                delete beforeBatchDeleteArgs.row;
            }
            this.refreshRowIdx();
            if (data) {
                gObj.editModule.deleteRowUid = undefined;
            }
            if (!gObj.isCheckBoxSelection) {
                gObj.selectRow(index);
            }
            gObj.trigger(events.batchDelete, beforeBatchDeleteArgs);
            gObj.notify(events.batchDelete, { rows: this.parent.getRowsObject() });
            gObj.focusModule.restoreFocus({ requestType: 'batchDelete' });
            gObj.notify(events.toolbarRefresh, {});
            if (!gObj.getContentTable().querySelector('tr.e-row')) {
                gObj.renderModule.renderEmptyRow();
            }
        });
    }

    private refreshRowIdx(): void {
        const gObj: IGrid = this.parent;
        const rows: Element[] = gObj.getAllDataRows(true);
        const dataObjects: Row<Column>[] = gObj.getRowsObject().filter((row: Row<Column>) => !row.isDetailRow);
        for (let i: number = 0, j: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[parseInt(i.toString(), 10)].classList.contains(literals.row) && !rows[parseInt(i.toString(), 10)].classList.contains('e-hiddenrow')) {
                rows[parseInt(i.toString(), 10)].setAttribute(literals.ariaRowIndex, (j + 1).toString());
                dataObjects[parseInt(i.toString(), 10)].index = j;
                j++;
            } else {
                rows[parseInt(i.toString(), 10)].removeAttribute(literals.ariaRowIndex);
                dataObjects[parseInt(i.toString(), 10)].index = -1;
            }
        }
    }

    private bulkAddRow(data?: Object): void {
        const gObj: IGrid = this.parent;
        if (!gObj.editSettings.allowAdding) {
            if (gObj.isEdit) { this.saveCell(); }
            return;
        }
        if (gObj.isEdit) {
            this.saveCell();
            this.parent.notify(events.editNextValCell, {});
        }
        if (this.validateFormObj()) {
            return;
        }
        if (this.initialRender) {
            const visibleColumns: Column[] = gObj.getVisibleColumns();
            for (let i: number = 0; i < visibleColumns.length; i++) {
                if (visibleColumns[parseInt(i.toString(), 10)].validationRules &&
                    visibleColumns[parseInt(i.toString(), 10)].validationRules['required']) {
                    const obj: { field: string, cellIdx: number } = { field: (visibleColumns[parseInt(i.toString(), 10)]['field']).slice(), cellIdx: i };
                    this.validationColObj.push(obj);
                }
            }
            this.initialRender = false;
        }
        this.parent.element.classList.add('e-editing');
        const defaultData: Object = data ? data : this.getDefaultData();
        const args: BeforeBatchAddArgs = {
            defaultData: defaultData,
            primaryKey: gObj.getPrimaryKeyFieldNames(),
            cancel: false
        };
        gObj.trigger(events.beforeBatchAdd, args, (beforeBatchAddArgs: BeforeBatchAddArgs) => {
            if (beforeBatchAddArgs.cancel) {
                return;
            }
            this.isAdded = true;
            gObj.clearSelection();
            const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
            const model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
            const modelData: Row<Column>[] = model.generateRows([beforeBatchAddArgs.defaultData]);
            const tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
            addFixedColumnBorder(tr);
            let col: Column;
            let index: number;
            for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                tr.insertBefore(this.parent.createElement('td', { className: 'e-indentcell' }), tr.firstChild);
                modelData[0].cells.unshift(new Cell<Column>({ cellType: CellType.Indent }));
            }
            let tbody: Element = gObj.getContentTable().querySelector(literals.tbody);
            tr.classList.add('e-insertedrow');
            if (tbody.querySelector('.e-emptyrow')) {
                const emptyRow: Element = tbody.querySelector('.e-emptyrow');
                emptyRow.parentNode.removeChild(emptyRow);
                if (gObj.frozenRows && gObj.element.querySelector('.e-frozenrow-empty')) {
                    gObj.element.querySelector('.e-frozenrow-empty').classList.remove('e-frozenrow-empty');
                }
            }
            if (gObj.frozenRows && gObj.editSettings.newRowPosition === 'Top') {
                tbody = gObj.getHeaderTable().querySelector(literals.tbody);
            } else {
                tbody = gObj.getContentTable().querySelector(literals.tbody);
            }
            if (this.parent.editSettings.newRowPosition === 'Top') {
                tbody.insertBefore(tr, tbody.firstChild);
            } else {
                tbody.appendChild(tr);
            }
            addClass([].slice.call(tr.getElementsByClassName(literals.rowCell)), ['e-updatedtd']);
            modelData[0].isDirty = true;
            modelData[0].changes = extend({}, {}, modelData[0].data, true);
            modelData[0].edit = 'add';
            this.addRowObject(modelData[0]);
            this.refreshRowIdx();
            this.focus.forgetPrevious();
            gObj.notify(events.batchAdd, { rows: this.parent.getRowsObject() });
            const changes: Object = this.getBatchChanges();
            const btmIdx: number = this.getBottomIndex();
            if (this.parent.editSettings.newRowPosition === 'Top') {
                gObj.selectRow(0);
            } else {
                gObj.selectRow(btmIdx);
            }
            if (!data) {
                index = this.findNextEditableCell(0, true);
                col = (gObj.getColumns()[parseInt(index.toString(), 10)] as Column);
                if (this.parent.editSettings.newRowPosition === 'Top') {
                    this.editCell(0, col.field, true);
                } else {
                    this.editCell(btmIdx, col.field, true);
                }
            }
            if (this.parent.aggregates.length > 0 && (data || changes[literals.addedRecords].length)) {
                this.parent.notify(events.refreshFooterRenderer, {});
            }
            const args1: BatchAddArgs = {
                defaultData: beforeBatchAddArgs.defaultData, row: tr,
                columnObject: col, columnIndex: index, primaryKey: beforeBatchAddArgs.primaryKey,
                cell: !isNullOrUndefined(index) ? tr.cells[parseInt(index.toString(), 10)] : undefined
            };
            gObj.trigger(events.batchAdd, args1);
        });
    }

    private findNextEditableCell(columnIndex: number, isAdd: boolean, isValOnly?: boolean): number {
        const cols: Column[] = this.parent.getColumns() as Column[];
        const endIndex: number = cols.length;
        let validation: boolean;
        for (let i: number = columnIndex; i < endIndex; i++) {
            validation = isValOnly ? isNullOrUndefined(cols[parseInt(i.toString(), 10)].validationRules) : false;
            // if (!isAdd && this.checkNPCell(cols[parseInt(i.toString(), 10)])) {
            //     return i;
            // } else
            if (isAdd && (!cols[parseInt(i.toString(), 10)].template || cols[parseInt(i.toString(), 10)].field)
                && cols[parseInt(i.toString(), 10)].allowEditing && cols[parseInt(i.toString(), 10)].visible &&
                !(cols[parseInt(i.toString(), 10)].isIdentity && cols[parseInt(i.toString(), 10)].isPrimaryKey) && !validation) {
                return i;
            }
        }
        return -1;
    }

    private getDefaultData(): Object {
        const gObj: IGrid = this.parent;
        const data: Object = {};
        const dValues: Object = { 'number': 0, 'string': null, 'boolean': false, 'date': null, 'datetime': null, 'dateonly': null };
        for (const col of ((<{ columnModel?: Column[] }>gObj).columnModel)) {
            if (col.field) {
                setValue(col.field, Object.keys(col).indexOf('defaultValue') >= 0 ? col.defaultValue : dValues[col.type], data);
            }
        }
        return data;
    }

    private setCellIdx(target: HTMLTableCellElement): void {
        let gLen: number = 0;
        if (this.parent.allowGrouping) {
            gLen = this.parent.groupSettings.columns.length;
        }
        this.cellDetails.cellIndex = target.cellIndex - gLen;
        this.cellDetails.rowIndex = parseInt(target.getAttribute('data-index'), 10);
    }

    public editCell(index: number, field: string, isAdd?: boolean): void {
        const gObj: IGrid = this.parent;
        const col: Column = gObj.getColumnByField(field);
        this.index = index;
        this.field = field;
        this.isAdd = isAdd;
        let visibleRows: Element[] = gObj.getDataRows();
        visibleRows = visibleRows.filter((row: HTMLElement) => row.style.display !== 'none' && !row.classList.contains('e-childrow-hidden'));
        const lastRowIndex: number = parseInt(visibleRows[visibleRows.length - 1].getAttribute('aria-rowindex'), 10) - 1;
        const checkEdit: boolean = gObj.isEdit && !(this.cellDetails.column.field === field
            && (this.cellDetails.rowIndex === index && lastRowIndex !== index && this.prevEditedBatchCell));
        if (gObj.editSettings.allowEditing) {
            if (!checkEdit && (col.allowEditing || (!col.allowEditing && gObj.focusModule.active
                && gObj.focusModule.active.getTable().rows[this.crtRowIndex]
                && gObj.focusModule.active.getTable().rows[this.crtRowIndex].classList.contains('e-insertedrow')))) {
                this.editCellExtend(index, field, isAdd);
            } else if (checkEdit) {
                this.editNext = true;
                this.saveCell();
            }
        }
    }

    public editCellExtend(index: number, field: string, isAdd?: boolean): void {
        const gObj: IGrid = this.parent;
        const col: Column = gObj.getColumnByField(field);
        const keys: string[] = gObj.getPrimaryKeyFieldNames();
        if (gObj.isEdit) {
            return;
        }
        let rowData: Object = extend({}, {}, this.getDataByIndex(index), true);
        const row: Element = gObj.getDataRows()[parseInt(index.toString(), 10)];
        rowData = extend({}, {}, this.getDataByIndex(index), true);
        if ((keys[0] === col.field && !row.classList.contains('e-insertedrow')) || col.columns ||
            (col.isPrimaryKey && col.isIdentity) || col.commands) {
            this.parent.isLastCellPrimaryKey = true;
            return;
        }
        this.parent.isLastCellPrimaryKey = false;
        this.parent.element.classList.add('e-editing');
        const rowObj: Row<Column> = gObj.getRowObjectFromUID(row.getAttribute('data-uid'));
        const cells: Element[] = [].slice.apply((row as HTMLTableRowElement).cells);
        const args: CellEditArgs = {
            columnName: col.field, isForeignKey: !isNullOrUndefined(col.foreignKeyValue),
            primaryKey: keys, rowData: rowData,
            validationRules: extend({}, col.validationRules ? col.validationRules : {}),
            value: getObject(col.field, rowData),
            type: !isAdd ? 'edit' : 'add', cancel: false,
            foreignKeyData: rowObj && rowObj.foreignKeyData
        };
        args.cell = cells[this.getColIndex(cells, this.getCellIdx(col.uid))];
        args.row = row;
        args.columnObject = col;
        if (!args.cell) { return; }
        gObj.trigger(events.cellEdit, args, (cellEditArgs: CellEditArgs) => {
            if (cellEditArgs.cancel) { return; }
            cellEditArgs.cell = cellEditArgs.cell ? cellEditArgs.cell : cells[this.getColIndex(cells, this.getCellIdx(col.uid))];
            cellEditArgs.row = cellEditArgs.row ? cellEditArgs.row : row;
            cellEditArgs.columnObject = cellEditArgs.columnObject ? cellEditArgs.columnObject : col;
            // cellEditArgs.columnObject.index = isNullOrUndefined(cellEditArgs.columnObject.index) ? 0 : cellEditArgs.columnObject.index;
            this.cellDetails = {
                rowData: rowData, column: col, value: cellEditArgs.value, isForeignKey: cellEditArgs.isForeignKey, rowIndex: index,
                cellIndex: parseInt((cellEditArgs.cell as HTMLTableCellElement).getAttribute(literals.ariaColIndex), 10) - 1,
                foreignKeyData: cellEditArgs.foreignKeyData
            };
            if (cellEditArgs.cell.classList.contains('e-updatedtd')) {
                this.isColored = true;
                cellEditArgs.cell.classList.remove('e-updatedtd');
            }
            gObj.isEdit = true;
            const checkSelect: boolean = !isNullOrUndefined(cellEditArgs.row.querySelector('.e-selectionbackground')) ? true : false;
            gObj.clearSelection();
            if ((!gObj.isCheckBoxSelection || !gObj.isPersistSelection) && (checkSelect || !gObj.selectionSettings.checkboxOnly)) {
                gObj.selectRow(this.cellDetails.rowIndex, true);
            }
            this.renderer.update(cellEditArgs);
            this.parent.notify(events.batchEditFormRendered, cellEditArgs);
            this.form = select('#' + gObj.element.id + 'EditForm', gObj.element);
            gObj.editModule.applyFormValidation([col]);
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        });
    }

    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        const gObj: IGrid = this.parent;
        const col: Column = gObj.getColumnByField(field);
        const index: number = gObj.getColumnIndexByField(field);
        const isInsertedBatchRow: boolean = gObj.getRowByIndex(rowIndex).classList.contains('e-insertedrow') &&
            gObj.getRowByIndex(rowIndex).classList.contains('e-batchrow');
        if (col && (!col.isPrimaryKey || isInsertedBatchRow) && col.allowEditing) {
            const td: Element = this.parent.isSpan ? getCellFromRow(gObj, rowIndex, index) :
                getCellByColAndRowIndex(this.parent, col, rowIndex, index);
            if (this.parent.isSpan && !td) {
                return;
            }
            const rowObj: Row<Column> = gObj.getRowObjectFromUID(td.parentElement.getAttribute('data-uid'));
            if (gObj.isEdit ||
                (!rowObj.changes && ((!(value instanceof Date) && rowObj.data['' + field] !== value) ||
                    ((value instanceof Date) && new Date(rowObj.data['' + field]).toString() !== new Date(value).toString()))) ||
                (rowObj.changes && ((!(value instanceof Date) && rowObj.changes['' + field] !== value) ||
                    ((value instanceof Date) && new Date(rowObj.changes['' + field]).toString() !== new Date(value).toString())))) {
                this.refreshTD(td, col, rowObj, value);
                const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                    this.parent.parentDetails.parentInstObj.isReact;
                if (((this.parent.isReact && this.parent.requireTemplateRef) || (isReactChild &&
                    this.parent.parentDetails.parentInstObj.requireTemplateRef)) && col.template) {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    const thisRef: BatchEdit = this;
                    const newReactTd: Element = this.newReactTd;
                    thisRef.parent.renderTemplates(function (): void {
                        thisRef.parent.trigger(events.queryCellInfo, {
                            cell: newReactTd || td, column: col, data: rowObj.changes
                        });
                    });
                }
                else if ((this.parent.isReact || isReactChild) && col.template) {
                    this.parent.renderTemplates();
                    this.parent.trigger(events.queryCellInfo, {
                        cell: this.newReactTd || td, column: col, data: rowObj.changes
                    });
                }
                else {
                    this.parent.trigger(events.queryCellInfo, {
                        cell: this.newReactTd || td, column: col, data: rowObj.changes
                    });
                }
            }
        }
    }

    private setChanges(rowObj: Row<Column>, field: string, value: string | number | boolean | Date): void {
        if (!rowObj.changes) {
            rowObj.changes = extend({}, {}, rowObj.data, true);
        }
        if (!isNullOrUndefined(field)) {
            if (typeof value === 'string') {
                value = this.parent.sanitize(value);
            }
            DataUtil.setValue(field, value, rowObj.changes);
        }
        if (rowObj.data[`${field}`] !== value) {
            const type: string = this.parent.getColumnByField(field).type;
            if ((type === 'date' || type === 'datetime')) {
                if (new Date(rowObj.data[`${field}`]).toString() !== new Date(value as Date).toString()) {
                    rowObj.isDirty = true;
                }
            } else {
                rowObj.isDirty = true;
            }
        }
    }

    public updateRow(index: number, data: Object): void {
        const keys: string[] = Object.keys(data);
        for (const col of keys) {
            this.updateCell(index, col, data[`${col}`]);
        }
    }

    private getCellIdx(uid: string): number {
        let cIdx: number = this.parent.getColumnIndexByUid(uid) + this.parent.groupSettings.columns.length;
        if (!isNullOrUndefined(this.parent.detailTemplate) || !isNullOrUndefined(this.parent.childGrid)) {
            cIdx++;
        }
        if (this.parent.isRowDragable()) { cIdx++; }
        return cIdx;
    }

    private refreshTD(td: Element, column: Column, rowObj: Row<Column>, value: string | number | boolean | Date): void {
        const cell: CellRenderer = new CellRenderer(this.parent, this.serviceLocator);
        value = column.type === 'number' && !isNullOrUndefined(value) ? parseFloat(value as string) : value;
        if (rowObj) {
            this.setChanges(rowObj, column.field, value);
            refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
        }
        const rowcell: Cell<Column>[] = rowObj ? rowObj.cells : undefined;
        let parentElement: HTMLTableRowElement;
        let cellIndex: number;
        if (this.parent.isReact) {
            parentElement = td.parentElement as HTMLTableRowElement;
            cellIndex = (td as HTMLTableCellElement).cellIndex;
        }
        const index: number = 0;
        if (rowObj) {
            cell.refreshTD(
                td, rowcell[this.getCellIdx(column.uid) - index] as Cell<Column>, rowObj.changes, { 'index': this.getCellIdx(column.uid) });
        }
        if (this.parent.isReact) {
            this.newReactTd = parentElement.cells[parseInt(cellIndex.toString(), 10)];
            parentElement.cells[parseInt(cellIndex.toString(), 10)].classList.add('e-updatedtd');
        } else {
            td.classList.add('e-updatedtd');
        }
        td.classList.add('e-updatedtd');
        this.parent.notify(events.toolbarRefresh, {});
    }

    private getColIndex(cells: Element[], index: number): number {
        let cIdx: number = 0;
        if (this.parent.allowGrouping && this.parent.groupSettings.columns) {
            cIdx = this.parent.groupSettings.columns.length;
        }
        if (!isNullOrUndefined(this.parent.detailTemplate) || !isNullOrUndefined(this.parent.childGrid)) {
            cIdx++;
        }
        if (this.parent.isRowDragable()) { cIdx++; }
        for (let m: number = 0; m < cells.length; m++) {
            const colIndex: number = parseInt(cells[parseInt(m.toString(), 10)].getAttribute(literals.ariaColIndex), 10) - 1;
            if (colIndex === index - cIdx) {
                return m;
            }
        }
        return -1;
    }

    private editNextValCell(): void {
        const gObj: IGrid = this.parent;
        const insertedRows: NodeListOf<Element> = gObj.element.querySelectorAll('.e-insertedrow');
        const isSingleInsert: boolean = insertedRows.length === 1 ? true : false;
        if (isSingleInsert && this.isAdded && !gObj.isEdit) {
            const btmIdx: number = this.getBottomIndex();
            for (let i: number = this.cellDetails.cellIndex; i < gObj.getColumns().length; i++) {
                if (gObj.isEdit) {
                    return;
                }
                const index: number = this.findNextEditableCell(this.cellDetails.cellIndex + 1, true, true);
                const col: Column = (gObj.getColumns()[parseInt(index.toString(), 10)] as Column);
                if (col) {
                    if (this.parent.editSettings.newRowPosition === 'Bottom') {
                        this.editCell(btmIdx, col.field, true);
                    } else {
                        const args: { index: number, column: Column } = { index: 0, column: col };
                        this.parent.notify(events.nextCellIndex, args);
                        this.editCell(args.index, col.field, true);
                    }
                    this.saveCell();
                }
            }
            if (!gObj.isEdit) {
                this.isAdded = false;
            }
        }
        else if (!isSingleInsert && this.isAdded && !gObj.isEdit) {
            for (let i: number = 0; i < insertedRows.length; i++) {
                if (!gObj.isEdit) {
                    for (let j: number = 0; j < this.validationColObj.length; j++) {
                        if (gObj.isEdit) {
                            break;
                        }
                        else if (insertedRows[parseInt(i.toString(), 10)].querySelectorAll('td:not(.e-hide, .e-rowdragdrop, .e-detailrowcollapse, .e-detailrowexpand, .e-indentcell)')[this.validationColObj[parseInt(j.toString(), 10)].cellIdx].innerHTML === '') {
                            this.editCell(parseInt(insertedRows[parseInt(i.toString(), 10)].getAttribute('aria-rowindex'), 10) - 1, this.validationColObj[parseInt(j.toString(), 10)].field);
                            if (this.validateFormObj()) {
                                this.saveCell();
                            }
                        }
                    }
                }
                else {
                    break;
                }
            }
            if (!gObj.isEdit) {
                this.isAdded = false;
            }
        }
    }

    public escapeCellEdit(): void {
        const args: CellSaveArgs = this.generateCellArgs();
        args.value = args.previousValue;
        if (args.value || !this.cellDetails.column.validationRules) {
            this.successCallBack(args, args.cell.parentElement, args.column, true)(args);
        }
    }

    private generateCellArgs(): Object {
        const gObj: IGrid = this.parent;
        this.parent.element.classList.remove('e-editing');
        const column: Column = this.cellDetails.column;
        const obj: Object = {};
        obj[column.field] = getObject(column.field, this.cellDetails.rowData);
        let editedData: Object = gObj.editModule.getCurrentEditedData(this.form, obj);
        const cloneEditedData: Object = extend({}, editedData);
        editedData = extend({}, editedData, this.cellDetails.rowData);
        const value: string = getObject(column.field, cloneEditedData);
        if (!isNullOrUndefined(column.field) && !isUndefined(value)) {
            setValue(column.field, value, editedData);
        }
        const args: CellSaveArgs = {
            columnName: column.field,
            value: getObject(column.field, editedData),
            rowData: this.cellDetails.rowData,
            column: column,
            previousValue: this.cellDetails.value,
            isForeignKey: this.cellDetails.isForeignKey,
            cancel: false
        };

        args.cell = this.form.parentElement;
        args.columnObject = column;
        return args;
    }

    public saveCell(isForceSave?: boolean): void {
        if (this.preventSaveCell || !this.form) { return; }
        const gObj: IGrid = this.parent;
        if (!isForceSave && (!gObj.isEdit || this.validateFormObj())) {
            return;
        }
        this.preventSaveCell = true;
        const args: CellSaveArgs = this.generateCellArgs();
        const tr: Element = args.cell.parentElement;
        const col: Column = args.column;
        args.cell.removeAttribute('aria-label');
        if (!isForceSave) {
            gObj.trigger(events.cellSave, args, this.successCallBack(args, tr, col));
            gObj.notify(events.batchForm, { formObj: this.form });
        } else {
            this.successCallBack(args, tr, col)(args);
        }
    }


    private successCallBack(cellSaveArgs: CellSaveArgs, tr: Element, column: Column, isEscapeCellEdit?: boolean): Function {
        return (cellSaveArgs: CellSaveArgs) => {
            const gObj: IGrid = this.parent;
            cellSaveArgs.cell = cellSaveArgs.cell ? cellSaveArgs.cell : this.form.parentElement;
            cellSaveArgs.columnObject = cellSaveArgs.columnObject ? cellSaveArgs.columnObject : column;
            // cellSaveArgs.columnObject.index = isNullOrUndefined(cellSaveArgs.columnObject.index) ? 0 : cellSaveArgs.columnObject.index;
            if (cellSaveArgs.cancel) {
                this.preventSaveCell = false;
                if (this.editNext) {
                    this.editNext = false;
                    if (this.cellDetails.rowIndex === this.index && this.cellDetails.column.field === this.field) {
                        return;
                    }
                    this.editCellExtend(this.index, this.field, this.isAdd);
                }
                return;
            }
            gObj.editModule.destroyWidgets([column]);
            gObj.isEdit = false;
            gObj.editModule.destroyForm();
            this.parent.notify(events.tooltipDestroy, {});
            const rowObj: Row<Column> = gObj.getRowObjectFromUID(tr.getAttribute('data-uid'));
            this.refreshTD(cellSaveArgs.cell, column, rowObj, cellSaveArgs.value);
            if (this.parent.isReact) {
                cellSaveArgs.cell = this.newReactTd;
            }
            removeClass([tr], [literals.editedRow, 'e-batchrow']);
            removeClass([cellSaveArgs.cell], ['e-editedbatchcell', 'e-boolcell']);
            if (!isNullOrUndefined(cellSaveArgs.value) && cellSaveArgs.value.toString() ===
                (!isNullOrUndefined(this.cellDetails.value) ? this.cellDetails.value : '').toString() && !this.isColored
                || (isNullOrUndefined(cellSaveArgs.value) && isNullOrUndefined(rowObj.data[column.field]) &&
                    isNullOrUndefined(this.cellDetails.value) && !cellSaveArgs.cell.parentElement.classList.contains('e-insertedrow'))) {
                cellSaveArgs.cell.classList.remove('e-updatedtd');
            }
            if (isNullOrUndefined(isEscapeCellEdit)) {
                const isReactCompiler: boolean = gObj.isReact && column.template && typeof (column.template) !== 'string';
                const isReactChild: boolean = gObj.parentDetails && gObj.parentDetails.parentInstObj
                 && gObj.parentDetails.parentInstObj.isReact;
                if (isReactCompiler || isReactChild) {
                    if (gObj.requireTemplateRef) {
                        gObj.renderTemplates(function (): void {
                            gObj.trigger(events.cellSaved, cellSaveArgs);
                        });
                    } else {
                        gObj.renderTemplates();
                        gObj.trigger(events.cellSaved, cellSaveArgs);
                    }
                } else {
                    gObj.trigger(events.cellSaved, cellSaveArgs);
                }
            }
            gObj.notify(events.toolbarRefresh, {});
            this.isColored = false;
            if (this.parent.aggregates.length > 0) {
                if (!(this.parent.isReact || this.parent.isVue)) {
                    this.parent.notify(events.refreshFooterRenderer, {});
                }
                if (this.parent.groupSettings.columns.length > 0 && !this.isAddRow(this.cellDetails.rowIndex)) {
                    this.parent.notify(events.groupAggregates, {});
                }
                if (this.parent.isReact || this.parent.isVue) {
                    this.parent.notify(events.refreshFooterRenderer, {});
                }
            }
            this.preventSaveCell = false;
            if (this.editNext) {
                this.editNext = false;
                if (this.cellDetails.rowIndex === this.index && this.cellDetails.column.field === this.field && this.prevEditedBatchCell) {
                    return;
                }
                const col: Column = gObj.getColumnByField(this.field);
                if (col && (col.allowEditing || (!col.allowEditing && gObj.focusModule.active
                    && gObj.focusModule.active.getTable().rows[this.crtRowIndex]
                    && gObj.focusModule.active.getTable().rows[this.crtRowIndex].classList.contains('e-insertedrow')))) {
                    this.editCellExtend(this.index, this.field, this.isAdd);
                }
            }
            if (isEscapeCellEdit) {
                gObj.notify(events.restoreFocus, {});
            }
        };
    }

    private prevEditedBatchCellMatrix(): number[] {
        let editedBatchCellMatrix: number[] = [];
        const gObj: IGrid = this.parent;
        const editedBatchCell: Element = gObj.focusModule.active.getTable().querySelector('.e-editedbatchcell');
        if (editedBatchCell) {
            const tr: Element = editedBatchCell.parentElement;
            const rowIndex: number = [].slice.call(this.parent.focusModule.active.getTable().rows).indexOf(tr);
            const cellIndex: number = [].slice.call((tr as HTMLTableRowElement).cells).indexOf(editedBatchCell);
            editedBatchCellMatrix = [rowIndex, cellIndex];
        }
        return editedBatchCellMatrix;
    }

    protected getDataByIndex(index: number): Object {
        const row: Row<Column> = this.parent.getRowObjectFromUID(this.parent.getDataRows()[parseInt(index.toString(), 10)].getAttribute('data-uid'));
        return row.changes ? row.changes : row.data;
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if (this.addBatchRow || ((e.action === 'tab' || e.action === 'shiftTab') && this.parent.isEdit)) {
            const gObj: IGrid = this.parent;
            const btmIdx: number = this.getBottomIndex();
            const rowcell: Element = parentsUntil(e.target as Element, literals.rowCell);
            if (this.addBatchRow || (rowcell && !this.parent.isReact)) {
                let cell: Element;
                if (rowcell) {
                    cell = rowcell.querySelector('.e-field');
                }
                if (this.addBatchRow || cell) {
                    const visibleColumns: Column[] = this.parent.getVisibleColumns();
                    const columnIndex: number = e.action === 'tab' ? visibleColumns.length - 1 : 0;
                    if (this.addBatchRow
                        || visibleColumns[parseInt(columnIndex.toString(), 10)].field === cell.getAttribute('id').slice(this.parent.element.id.length)) {
                        if (this.cellDetails.rowIndex === btmIdx && e.action === 'tab') {
                            if (gObj.editSettings.newRowPosition === 'Top') {
                                gObj.editSettings.newRowPosition = 'Bottom';
                                this.addRecord();
                                gObj.editSettings.newRowPosition = 'Top';
                            } else {
                                this.addRecord();
                            }
                            this.addBatchRow = false;
                        } else {
                            this.saveCell();
                        }
                    }
                }
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addCancelWhilePaging(): void {
        if (this.validateFormObj()) {
            this.parent.notify(events.destroyForm, {});
            this.parent.isEdit = false;
            this.editNext = false;
            this.mouseDownElement = undefined;
            this.isColored = false;
        }
    }

    private getBottomIndex(): number {
        const changes: Object = this.getBatchChanges();
        return this.parent.getCurrentViewRecords().length + changes[literals.addedRecords].length -
            changes[literals.deletedRecords].length - 1;
    }
}
