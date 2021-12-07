import { extend, addClass, removeClass, setValue, closest, select } from '@syncfusion/ej2-base';
import { remove, classList } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { isNullOrUndefined, KeyboardEventArgs, isUndefined } from '@syncfusion/ej2-base';
import { IGrid, BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs } from '../base/interface';
import { BatchAddArgs, CellEditArgs, CellSaveArgs, CellFocusArgs, BatchCancelArgs } from '../base/interface';
import { CellType, freezeTable } from '../base/enum';
import { parentsUntil, inArray, refreshForeignData, getObject, alignFrozenEditForm, gridActionHandler, addRemoveEventListener } from '../base/util';
import { splitFrozenRowObjectCells, getGridRowElements } from '../base/util';
import { sliceElements, getCellByColAndRowIndex, getMovableTbody, getFrozenRightTbody } from '../base/util';
import { getGridRowObjects } from '../base/util';
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
    private field: string;
    private isAdd: boolean;
    private newReactTd: Element;
    private evtHandlers: { event: string, handler: Function }[];

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
            { event: events.closeBatch, handler: this.closeForm },
            { event: events.destroy, handler: this.destroy }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
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
        this.parent.removeEventListener(events.dataBound, this.dataBoundFunction);
        this.parent.removeEventListener(events.batchCancel, this.batchCancelFunction);
    }

    private batchCancel(): void {
        this.parent.focusModule.restoreFocus();
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

    protected clickHandler(e: MouseEvent): void {
        if (!parentsUntil(e.target as Element, this.parent.element.id + '_add', true)) {
            if (this.parent.isEdit && closest(this.form, 'td') !== closest(e.target as Element, 'td')) {
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
        const rowIndex: number = tr && parseInt(tr.getAttribute(literals.ariaRowIndex), 10);
        const colIndex: number = target && parseInt(target.getAttribute(literals.ariaColIndex), 10);
        if (!isNullOrUndefined(target) && !isNullOrUndefined(rowIndex) && !isNaN(colIndex)
            && !target.parentElement.classList.contains(literals.editedRow)) {
            this.editCell(
                rowIndex, (this.parent.getColumns()[colIndex] as Column).field, this.isAddRow(rowIndex));
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
        const frzCols: number = this.parent.getFrozenLeftCount();
        const frzRightCols: number = this.parent.getFrozenRightColumnsCount();
        const mCont: Element = this.parent.getContent().querySelector('.' + literals.movableContent);
        const mHdr: Element = this.parent.getHeaderContent().querySelector('.' + literals.movableHeader);
        const clear: boolean = (!e.container.isContent || !e.container.isDataCell) && !(this.parent.frozenRows && e.container.isHeader);
        if (!e.byKey || clear) {
            if (this.parent.isEdit && clear) {
                this.saveCell();
            }
            return;
        }
        let [rowIndex, cellIndex]: number[] = e.container.indexes;
        if (frzCols && (mCont.contains(e.element) || (this.parent.frozenRows && mHdr.contains(e.element)))) {
            cellIndex += frzCols;
        }
        if (frzRightCols) {
            const frHdr: Element = this.parent.getHeaderContent().querySelector('.e-frozen-right-header');
            const frCont: Element = this.parent.getContent().querySelector('.e-frozen-right-content');
            if (frCont.contains(e.element) || (this.parent.frozenRows && frHdr.contains(e.element))) {
                cellIndex += (frzCols + this.parent.getMovableColumnsCount());
            }
        }
        if (this.parent.frozenRows && e.container.isContent) {
            rowIndex += this.parent.frozenRows;
        }
        let isEdit: boolean = this.parent.isEdit;
        if (!this.parent.element.getElementsByClassName('e-popup-open').length) {
            isEdit = isEdit && !this.validateFormObj();
            switch (e.keyArgs.action) {
            case 'tab':
            case 'shiftTab':
                // eslint-disable-next-line no-case-declarations
                const col: Column = this.parent.getColumns()[e.indexes[1]];
                if (col && !this.parent.isEdit) {
                    this.editCell(e.indexes[0], col.field);
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
        return this.parent.getDataRows()[index].classList.contains('e-insertedrow');
    }

    private editCellFromIndex(rowIdx: number, cellIdx: number): void {
        this.cellDetails.rowIndex = rowIdx;
        this.cellDetails.cellIndex = cellIdx;
        this.editCell(rowIdx, (this.parent.getColumns() as Column[])[cellIdx].field, this.isAddRow(rowIdx));
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
        gObj.clearSelection();
        const allRows: Row<Column>[][] = getGridRowObjects(this.parent);
        for (let i: number = 0; i < rows.length; i++) {
            let isInsert: boolean = false;
            const isDirty: boolean = rows[i].isDirty;
            gridActionHandler(
                this.parent,
                (tableName: freezeTable, rows: Row<Column>[]) => {
                    isInsert = this.removeBatchElementChanges(rows[i], isDirty);
                    if (isInsert) { rows.splice(i, 1); }
                },
                allRows
            );
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
        gObj.selectRow(this.cellDetails.rowIndex);
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
                    editType[type] = 'cancel';
                    this.parent.notify(events.refreshFooterRenderer, editType);
                    if (this.parent.groupSettings.columns.length > 0) {
                        this.parent.notify(events.groupAggregates, editType);
                    }
                }
            }
        }
        return isInstertedRemoved;
    }

    private removeHideAndSelection(tr: Element): void {
        if (tr.classList.contains('e-hiddenrow')) {
            tr.removeAttribute('aria-selected');
            const tdElements: Element[] = [].slice.call(tr.getElementsByClassName('e-selectionbackground'));
            for (let i: number = 0; i < tdElements.length; i++) {
                removeClass([tdElements[i]], ['e-selectionbackground', 'e-active']);
            }
        }
        classList(tr, [], ['e-hiddenrow', 'e-updatedtd']);
    }

    public deleteRecord(fieldname?: string, data?: Object): void {
        this.saveCell();
        if (this.validateFormObj()) {
            this.saveCell(true);
        }
        this.isAdded = false;
        this.bulkDelete(fieldname, data);
        if (this.parent.aggregates.length > 0) {
            this.parent.notify(events.refreshFooterRenderer, {});
            if (this.parent.groupSettings.columns.length > 0) {
                this.parent.notify(events.groupAggregates, {});
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

    private closeForm(): void {
        for (let i: number = 0; i < Object.keys(this.originalCell).length; i++) {
            for (let j: number = 0; j < Object.keys(this.cloneCell).length; j++) {
                if (Object.keys(this.originalCell)[i] === Object.keys(this.cloneCell)[j]) {
                    this.cloneCell[Object.keys(this.cloneCell)[j]].replaceWith(this.originalCell[Object.keys(this.originalCell)[i]]);
                    if (this.originalCell[Object.keys(this.originalCell)[i]].classList.contains('e-selectionbackground')) {
                        this.originalCell[Object.keys(this.originalCell)[i]]
                            .classList.remove('e-selectionbackground', 'e-cellselectionbackground', 'e-active');
                    }
                }
            }
        }
        this.cloneCell = {};
        this.originalCell = {};
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
        if (this.parent.selectionSettings.type === 'Multiple' && changes[deletedRecords].length &&
            this.parent.selectionSettings.persistSelection) {
            changes[deletedRecords] = this.removeSelectedData;
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
            if (rows[i].uid === uid) {
                break;
            }
        }
        gridActionHandler(
            this.parent,
            (tableName: freezeTable, rows: Row<Column>[]) => {
                rows.splice(i, 1);
            },
            getGridRowObjects(this.parent)
        );
    }

    /**
     * @param {Row<Column>} row - specifies the row object
     * @returns {void}
     * @hidden
     */
    public addRowObject(row: Row<Column>): void {
        const gObj: IGrid = this.parent;
        const isTop: boolean = gObj.editSettings.newRowPosition === 'Top';
        gridActionHandler(
            this.parent,
            (tableName: freezeTable, rows: Row<Column>[]) => {
                const rowClone: Row<Column> = row.clone();
                rowClone.cells = splitFrozenRowObjectCells(gObj, rowClone.cells, tableName);
                if (isTop) {
                    rows.unshift(rowClone);
                } else {
                    rows.push(rowClone);
                }
            },
            getGridRowObjects(this.parent), true
        );
    }

    // tslint:disable-next-line:max-func-body-length
    private bulkDelete(fieldname?: string, data?: Object): void {
        this.removeSelectedData = [];
        const gObj: IGrid = this.parent;
        let index: number = gObj.selectedRowIndex;
        let selectedRows: Element[] = gObj.getSelectedRows();
        const args: BeforeBatchDeleteArgs = {
            primaryKey: this.parent.getPrimaryKeyFieldNames(),
            rowIndex: index,
            rowData: data ? data : gObj.getSelectedRecords()[0],
            cancel: false
        };
        if (data) {
            args.row = gObj.editModule.deleteRowUid ? gObj.getRowElementByUID(gObj.editModule.deleteRowUid)
                : gObj.getRows()[gObj.getCurrentViewRecords().indexOf(data)];
        } else {
            args.row = data ? gObj.getRows()[index] : selectedRows[0];
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
                beforeBatchDeleteArgs.row : data ? gObj.getRows()[index] : selectedRows[0];
            if (this.parent.isFrozenGrid()) {
                if (data) {
                    index = parseInt(beforeBatchDeleteArgs.row.getAttribute(literals.ariaRowIndex), 10);
                    selectedRows = [];
                    selectedRows.push(gObj.getRowByIndex(index));
                    selectedRows.push(gObj.getMovableRowByIndex(index));
                    if (gObj.getFrozenMode() === literals.leftRight) {
                        selectedRows.push(gObj.getFrozenRightRowByIndex(index));
                    }
                }
                for (let i: number = 0; i < selectedRows.length; i++) {
                    const uid: string = selectedRows[i].getAttribute('data-uid');
                    if (selectedRows[i].classList.contains('e-insertedrow')) {
                        this.removeRowObjectFromUID(uid);
                        remove(selectedRows[i]);
                    } else {
                        const rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
                        rowObj.isDirty = true;
                        rowObj.edit = 'delete';
                        classList(selectedRows[i], ['e-hiddenrow', 'e-updatedtd'], []);
                        if (gObj.frozenRows && index < gObj.frozenRows && gObj.getMovableDataRows().length >= gObj.frozenRows) {
                            gObj.getMovableHeaderTbody().appendChild(gObj.getMovableRowByIndex(gObj.frozenRows - 1));
                            gObj.getFrozenHeaderTbody().appendChild(gObj.getRowByIndex(gObj.frozenRows - 1));
                            if (gObj.getFrozenMode() === literals.leftRight) {
                                gObj.getFrozenRightHeaderTbody().appendChild(gObj.getFrozenRightRowByIndex(gObj.frozenRows - 1));
                            }
                        }
                        if (gObj.frozenRows && index < gObj.frozenRows && gObj.getDataRows().length >= gObj.frozenRows) {
                            gObj.getHeaderTable().querySelector( literals.tbody).appendChild(gObj.getRowByIndex(gObj.frozenRows - 1));
                        }
                    }
                    delete selectedRows[i];
                }
            } else if (!this.parent.isFrozenGrid() && (selectedRows.length === 1 || data)) {
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
                }
                delete beforeBatchDeleteArgs.row;
            } else {
                for (let i: number = 0; i < selectedRows.length; i++) {
                    const uniqueid: string = selectedRows[i].getAttribute('data-uid');
                    if (selectedRows[i].classList.contains('e-insertedrow')) {
                        this.removeRowObjectFromUID(uniqueid);
                        remove(selectedRows[i]);
                    } else {
                        classList(selectedRows[i] as HTMLTableRowElement, ['e-hiddenrow', 'e-updatedtd'], []);
                        const selectedRow: Row<Column> = gObj.getRowObjectFromUID(uniqueid);
                        selectedRow.isDirty = true;
                        selectedRow.edit = 'delete';
                        delete selectedRows[i];
                    }
                }
            }
            this.refreshRowIdx();
            if (data) {
                gObj.editModule.deleteRowUid = undefined;
                if (gObj.getSelectedRows().length) {
                    index = parseInt(gObj.getSelectedRows()[0].getAttribute(literals.ariaRowIndex), 10);
                }
            }
            if (!gObj.isCheckBoxSelection) {
                gObj.selectRow(index);
            }
            gObj.trigger(events.batchDelete, beforeBatchDeleteArgs);
            gObj.notify(events.batchDelete, { rows: this.parent.getRowsObject() });
            gObj.notify(events.toolbarRefresh, {});
        });
    }

    private refreshRowIdx(): void {
        const gObj: IGrid = this.parent;
        const rows: Element[] = gObj.getAllDataRows(true);
        const dataRows: Element[][] = getGridRowElements(this.parent);
        const dataObjects: Row<Column>[][]  = getGridRowObjects(this.parent);
        for (let i: number = 0, j: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[i].classList.contains(literals.row) && !rows[i].classList.contains('e-hiddenrow')) {
                gridActionHandler(
                    this.parent,
                    (tableName: freezeTable, rowElements: Element[], rowObjects: Row<Column>[]) => {
                        rowElements[i].setAttribute(literals.ariaRowIndex, j.toString());
                        rowObjects[i].index = j;
                    },
                    dataRows, null, dataObjects
                );
                j++;
            } else {
                gridActionHandler(
                    this.parent,
                    (tableName: freezeTable, rowElements: Element[], rowObjects: Row<Column>[]) => {
                        rowElements[i].removeAttribute(literals.ariaRowIndex);
                        rowObjects[i].index = -1;
                    },
                    dataRows, null, dataObjects
                );
            }
        }
    }

    private getIndexFromData(data: Object): number {
        return inArray(data, this.parent.getCurrentViewRecords());
    }

    private bulkAddRow(data?: Object): void {
        const gObj: IGrid = this.parent;
        if (!gObj.editSettings.allowAdding) {
            return;
        }
        if (gObj.isEdit) {
            this.saveCell();
            this.parent.notify(events.editNextValCell, {});
        }
        if (gObj.isEdit) { return; }
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
            let mTr: Element;
            let frTr: Element;
            const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
            const model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
            const modelData: Row<Column>[] = model.generateRows([beforeBatchAddArgs.defaultData]);
            let tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
            let col: Column;
            let index: number;
            for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                tr.insertBefore(this.parent.createElement('td', { className: 'e-indentcell' }), tr.firstChild);
                modelData[0].cells.unshift(new Cell<Column>({ cellType: CellType.Indent }));
            }
            let tbody: Element = gObj.getContentTable().querySelector( literals.tbody);
            tr.classList.add('e-insertedrow');
            if (tbody.querySelector('.e-emptyrow')) {
                const emptyRow: Element = tbody.querySelector('.e-emptyrow');
                emptyRow.parentNode.removeChild(emptyRow);
                this.removeFrozenTbody();
            }
            if (gObj.isFrozenGrid()) {
                frTr = tr.cloneNode(true) as Element;
                mTr = this.renderMovable(tr, frTr);
                tr = gObj.getFrozenMode() === 'Right' ? frTr as HTMLTableRowElement : tr;
                this.renderFrozenAddRow(tr, mTr, frTr);
            }
            if (gObj.frozenRows && gObj.editSettings.newRowPosition === 'Top') {
                tbody = gObj.getHeaderTable().querySelector( literals.tbody);
            } else {
                tbody = gObj.getContentTable().querySelector( literals.tbody);
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
            gObj.notify(events.batchAdd, { rows: this.parent.getRowsObject(), args: { isFrozen: this.parent.isFrozenGrid() } });
            const changes: Object = this.getBatchChanges();
            const btmIdx: number = this.getBottomIndex();
            if (this.parent.editSettings.newRowPosition === 'Top') {
                gObj.selectRow(0);
            } else {
                gObj.selectRow(btmIdx);
            }
            if (!data) {
                index = this.findNextEditableCell(0, true);
                col = (gObj.getColumns()[index] as Column);
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
                columnObject: col, columnIndex: index, primaryKey: beforeBatchAddArgs.primaryKey, cell: tr.cells[index]
            };
            gObj.trigger(events.batchAdd, args1);
            if (gObj.isFrozenGrid()) {
                alignFrozenEditForm(mTr.querySelector('td:not(.e-hide)'), tr.querySelector('td:not(.e-hide)'));
            }
        });
    }

    private renderFrozenAddRow(tr: Element, mTr: Element, frTr: Element): void {
        const gObj: IGrid = this.parent;
        const mTbody: Element = getMovableTbody(this.parent);
        const frTbody: Element = getFrozenRightTbody(this.parent);
        if (gObj.editSettings.newRowPosition === 'Top') {
            mTbody.insertBefore(mTr, mTbody.firstChild);
        } else {
            mTbody.appendChild(mTr);
        }
        addClass([].slice.call(mTr.getElementsByClassName(literals.rowCell)), ['e-updatedtd']);
        if (frTbody && frTr) {
            if (gObj.editSettings.newRowPosition === 'Top') {
                frTbody.insertBefore(frTr, frTbody.firstChild);
            } else {
                frTbody.appendChild(frTr);
            }
            addClass([].slice.call(frTr.getElementsByClassName(literals.rowCell)), ['e-updatedtd']);
            alignFrozenEditForm(frTr.querySelector('td:not(.e-hide)'), tr.querySelector('td:not(.e-hide)'));
        }
        if (gObj.height === 'auto') {
            gObj.notify(events.frozenHeight, {});
        }
    }

    private removeFrozenTbody(): void {
        const gObj: IGrid = this.parent;
        if (gObj.isFrozenGrid()) {
            const moveTbody: Element = gObj.getContent().querySelector('.' + literals.movableContent).querySelector( literals.tbody);
            (moveTbody.firstElementChild).parentNode.removeChild(moveTbody.firstElementChild);
            if (gObj.getFrozenMode() === literals.leftRight) {
                const frTbody: Element = gObj.getContent().querySelector('.e-frozen-right-content').querySelector( literals.tbody);
                (frTbody.firstElementChild).parentNode.removeChild(frTbody.firstElementChild);
            }
        }
    }

    private renderMovable(ele: Element, rightEle: Element): Element {
        const mEle: Element = ele.cloneNode(true) as Element;
        const movable: number = this.parent.getMovableColumnsCount();
        const left: number = this.parent.getFrozenLeftCount();
        const right: number = this.parent.getFrozenRightColumnsCount();
        sliceElements(ele, 0, left);
        sliceElements(mEle, left, right ? mEle.children.length - right : mEle.children.length);
        sliceElements(rightEle, left + movable, rightEle.children.length);
        return mEle;
    }

    private findNextEditableCell(columnIndex: number, isAdd: boolean, isValOnly?: boolean): number {
        const cols: Column[] = this.parent.getColumns() as Column[];
        const endIndex: number = cols.length;
        let validation: boolean;
        for (let i: number = columnIndex; i < endIndex; i++) {
            validation = isValOnly ? isNullOrUndefined(cols[i].validationRules) : false;
            if (!isAdd && this.checkNPCell(cols[i])) {
                return i;
            } else if (isAdd && !cols[i].template && cols[i].visible && cols[i].allowEditing &&
                !(cols[i].isIdentity && cols[i].isPrimaryKey) && !validation) {
                return i;
            }
        }
        return -1;
    }

    private checkNPCell(col: Column): boolean {
        return !col.template && col.visible && !col.isPrimaryKey && !col.isIdentity && col.allowEditing;
    }

    private getDefaultData(): Object {
        const gObj: IGrid = this.parent;
        const data: Object = {};
        const dValues: Object = { 'number': 0, 'string': null, 'boolean': false, 'date': null, 'datetime': null };
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
        this.cellDetails.rowIndex = parseInt(target.getAttribute('index'), 10);
    }

    public editCell(index: number, field: string, isAdd?: boolean): void {
        const gObj: IGrid = this.parent;
        const col: Column = gObj.getColumnByField(field);
        this.index = index;
        this.field = field;
        this.isAdd = isAdd;
        const checkEdit: boolean = gObj.isEdit && !(this.cellDetails.column.field === field
            && (this.cellDetails.rowIndex === index && this.parent.getDataRows().length - 1 !== index));
        if (gObj.editSettings.allowEditing) {
            if (!checkEdit && col.allowEditing) {
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
        let row: Element;
        let mRowData: Row<Column>;
        let rowData: Object = extend({}, {}, this.getDataByIndex(index), true);
        if (col.getFreezeTableName() === 'movable' || col.getFreezeTableName() === literals.frozenRight) {
            row = col.getFreezeTableName() === 'movable' ? gObj.getMovableDataRows()[index] : gObj.getFrozenRightDataRows()[index];
            mRowData = this.parent.getRowObjectFromUID(row.getAttribute('data-uid'));
            rowData = mRowData.changes ? extend({}, {}, mRowData.changes, true) : rowData;
        } else {
            row = gObj.getDataRows()[index];
            rowData = extend({}, {}, this.getDataByIndex(index), true);
        }
        if ((keys[0] === col.field && !row.classList.contains('e-insertedrow')) || col.columns ||
            (col.isPrimaryKey && col.isIdentity)) {
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
            cellEditArgs.columnObject.index = isNullOrUndefined(cellEditArgs.columnObject.index) ? 0 : cellEditArgs.columnObject.index;
            this.cellDetails = {
                rowData: rowData, column: col, value: cellEditArgs.value, isForeignKey: cellEditArgs.isForeignKey, rowIndex: index,
                cellIndex: parseInt((cellEditArgs.cell as HTMLTableCellElement).getAttribute(literals.ariaColIndex), 10),
                foreignKeyData: cellEditArgs.foreignKeyData
            };
            if (cellEditArgs.cell.classList.contains('e-updatedtd')) {
                this.isColored = true;
                cellEditArgs.cell.classList.remove('e-updatedtd');
            }
            gObj.isEdit = true;
            gObj.clearSelection();
            if (!gObj.isCheckBoxSelection || !gObj.isPersistSelection) {
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
        if (col && !col.isPrimaryKey && col.allowEditing) {
            const td: Element = getCellByColAndRowIndex(this.parent, col, rowIndex, index);
            const rowObj: Row<Column> = col.getFreezeTableName() === 'movable' ? this.parent.getMovableRowsObject()[rowIndex] :
                col.getFreezeTableName() === literals.frozenRight ? gObj.getFrozenRightRowsObject()[rowIndex]
                    : gObj.getRowObjectFromUID(td.parentElement.getAttribute('data-uid'));
            this.refreshTD(td, col, rowObj, value);
            this.parent.trigger(events.queryCellInfo, {
                cell: this.newReactTd || td, column: col, data: rowObj.changes
            });
        }
    }

    private setChanges(rowObj: Row<Column>, field: string, value: string | number | boolean | Date): void {
        let currentRowObj: Row<Column>;
        if (!this.parent.isFrozenGrid()) {
            if (!rowObj.changes) {
                rowObj.changes = extend({}, {}, rowObj.data, true);
            }
            if (!isNullOrUndefined(field)) {
                DataUtil.setValue(field, value, rowObj.changes);
            }
            if (rowObj.data[field] !== value) {
                const type: string = this.parent.getColumnByField(field).type;
                if ((type === 'date' || type === 'datetime')) {
                    if (new Date(rowObj.data[field]).toString() !== new Date(value as Date).toString()) {
                        rowObj.isDirty = true;
                    }
                } else {
                    rowObj.isDirty = true;
                }
            }
        } else {
            const rowEle: Element = this.parent.getRowElementByUID(rowObj.uid);
            const rowIndex: number = parseInt(rowEle.getAttribute(literals.ariaRowIndex), 10);
            currentRowObj = this.parent.getRowsObject()[rowIndex];
            if (!currentRowObj.changes) {
                currentRowObj.changes = extend({}, {}, rowObj.data, true);
            }
            if (!isNullOrUndefined(field)) {
                setValue(field, value, currentRowObj.changes);
            }
            const movableRowObject: Row<Column> = this.parent.getMovableRowsObject()[rowIndex];
            movableRowObject.changes = extend({}, {}, currentRowObj.changes, true);
            if (rowObj.data[field] !== value) {
                movableRowObject.isDirty = true;
                currentRowObj.isDirty = true;
            }
            if (this.parent.getFrozenMode() === literals.leftRight) {
                const frRowObject: Row<Column> = this.parent.getFrozenRightRowsObject()[rowIndex];
                frRowObject.changes = extend({}, {}, currentRowObj.changes, true);
                if (rowObj.data[field] !== value) {
                    frRowObject.isDirty = true;
                }
            }
        }
    }

    public updateRow(index: number, data: Object): void {
        const keys: string[] = Object.keys(data);
        for (const col of keys) {
            this.updateCell(index, col, data[col]);
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
        let rowcell: Cell<Column>[];
        value = column.type === 'number' && !isNullOrUndefined(value) ? parseFloat(value as string) : value;
        this.setChanges(rowObj, column.field, value);
        let frzCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount()
            || this.parent.getFrozenRightColumnsCount();
        frzCols = frzCols && this.parent.isRowDragable() ? frzCols + 1 : frzCols;
        refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
        if (frzCols && column.getFreezeTableName() === 'movable' && this.parent.getColumns().length === rowObj.cells.length) {
            rowcell = rowObj.cells.slice(frzCols, rowObj.cells.length);
        } else {
            rowcell = rowObj.cells;
        }
        let parentElement: HTMLTableRowElement;
        let cellIndex: number;
        if (this.parent.isReact) {
            parentElement = td.parentElement as HTMLTableRowElement;
            cellIndex = (td as HTMLTableCellElement).cellIndex;
        }
        let index: number = 0;
        if (frzCols) {
            index = column.getFreezeTableName() === 'movable' && this.parent.getFrozenMode() !== 'Right'
                ? frzCols : column.getFreezeTableName() === literals.frozenRight
                    ? this.parent.getFrozenLeftColumnsCount() + this.parent.getMovableColumnsCount() : index;
        }
        cell.refreshTD(
            td, rowcell[this.getCellIdx(column.uid) - index] as Cell<Column>, rowObj.changes, { 'index': this.getCellIdx(column.uid) });
        if (this.parent.isReact) {
            this.newReactTd = parentElement.cells[cellIndex];
            parentElement.cells[cellIndex].classList.add('e-updatedtd');
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
            const colIndex: number = parseInt(cells[m].getAttribute(literals.ariaColIndex), 10);
            if (colIndex === index - cIdx) {
                return m;
            }
        }
        return -1;
    }

    private editNextValCell(): void {
        const gObj: IGrid = this.parent;
        const btmIdx: number = this.getBottomIndex();
        if (this.isAdded && !gObj.isEdit) {
            for (let i: number = this.cellDetails.cellIndex; i < gObj.getColumns().length; i++) {
                if (gObj.isEdit) {
                    return;
                }
                const index: number = this.findNextEditableCell(this.cellDetails.cellIndex + 1, true, true);
                const col: Column = (gObj.getColumns()[index] as Column);
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
    }

    public escapeCellEdit(): void {
        const args: CellSaveArgs = this.generateCellArgs();
        args.value = args.previousValue;
        this.successCallBack(args, args.cell.parentElement, args.column, true)(args);
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
            cellSaveArgs.columnObject.index = isNullOrUndefined(cellSaveArgs.columnObject.index) ? 0 : cellSaveArgs.columnObject.index;
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
            let rowObj: Row<Column> = parentsUntil(cellSaveArgs.cell, literals.movableContent)
                || parentsUntil(cellSaveArgs.cell, literals.movableHeader) ? gObj.getRowObjectFromUID(tr.getAttribute('data-uid'), true)
                : gObj.getRowObjectFromUID(tr.getAttribute('data-uid'));
            if (gObj.getFrozenMode() === literals.leftRight && (parentsUntil(cellSaveArgs.cell, 'e-frozen-right-header')
                || parentsUntil(cellSaveArgs.cell, 'e-frozen-right-content'))) {
                rowObj = gObj.getRowObjectFromUID(tr.getAttribute('data-uid'), false, true);
            }
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
                gObj.trigger(events.cellSaved, cellSaveArgs);
            }
            gObj.notify(events.toolbarRefresh, {});
            this.isColored = false;
            if (this.parent.aggregates.length > 0) {
                this.parent.notify(events.refreshFooterRenderer, {});
                if (this.parent.groupSettings.columns.length > 0 && !this.isAddRow(this.cellDetails.rowIndex)) {
                    this.parent.notify(events.groupAggregates, {});
                }
            }
            this.preventSaveCell = false;
            if (this.editNext) {
                this.editNext = false;
                if (this.cellDetails.rowIndex === this.index && this.cellDetails.column.field === this.field) {
                    return;
                }
                const col: Column = gObj.getColumnByField(this.field);
                if (col && col.allowEditing) {
                    this.editCellExtend(this.index, this.field, this.isAdd);
                }
            }
            if (isEscapeCellEdit) {
                gObj.notify(events.restoreFocus, {});
            }
        };
    }

    protected getDataByIndex(index: number): Object {
        const row: Row<Column> = this.parent.getRowObjectFromUID(this.parent.getDataRows()[index].getAttribute('data-uid'));
        return row.changes ? row.changes : row.data;
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if ((e.action === 'tab' || e.action === 'shiftTab') && this.parent.isEdit) {
            const gObj: IGrid = this.parent;
            const btmIdx: number = this.getBottomIndex();
            const rowcell: Element = parentsUntil(e.target as Element, literals.rowCell);
            if (rowcell) {
                const cell: Element = rowcell.querySelector('.e-field');
                if (cell) {
                    const visibleColumns: Column[] = this.parent.getVisibleColumns();
                    const columnIndex: number = e.action === 'tab' ? visibleColumns.length - 1 : 0;
                    if (visibleColumns[columnIndex].field === cell.getAttribute('id').slice(this.parent.element.id.length)) {
                        if (this.cellDetails.rowIndex === btmIdx && e.action === 'tab') {
                            if (gObj.editSettings.newRowPosition === 'Top') {
                                gObj.editSettings.newRowPosition = 'Bottom';
                                this.addRecord();
                                gObj.editSettings.newRowPosition = 'Top';
                            } else {
                                this.addRecord();
                            }
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
            this.isColored = false;
        }
    }

    private getBottomIndex(): number {
        const changes: Object = this.getBatchChanges();
        return this.parent.getCurrentViewRecords().length + changes[literals.addedRecords].length -
            changes[literals.deletedRecords].length - 1;
    }
}
