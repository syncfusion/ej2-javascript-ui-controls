import { MouseEventArgs, Draggable, isNullOrUndefined } from '@syncfusion/ej2-base';
import { removeClass } from '@syncfusion/ej2-base';
import { remove, closest as closestElement, classList, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EJ2Intance, IPosition, RowDragEventArgs } from '../base/interface';
import { parentsUntil, removeElement, getPosition, addRemoveActiveClasses, isActionPrevent } from '../base/util';
import { setRowsInTbody, resetRowIndex } from '../base/util';
import { Column } from '../models/column';
import { Row } from '../models/row';
import * as events from '../base/constant';
import { Scroll } from '../actions/scroll';
import { RowDropEventArgs } from '../base/interface';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../base';
import * as literals from '../base/string-literals';

// eslint-disable-next-line valid-jsdoc
/**
 *
 * Reorder module is used to handle row reordering.
 *
 * @hidden
 */
export class RowDD {
    //Internal variables
    private isSingleRowDragDrop: boolean;
    private hoverState: boolean;
    private startedRow: HTMLTableRowElement;
    private startedRowIndex: number;
    private dragTarget: number;
    private onDataBoundFn: Function;
    private timer: number;
    private selectedRows: number[] = [];
    private isOverflowBorder: boolean = true;
    private selectedRowColls: number[] = [];
    private isRefresh: boolean = true;
    private rows: Element[];
    private rowData: Object;
    private dragStartData: Object;
    private draggable: Draggable;
    private isReplaceDragEle: boolean = true;
    private isDropGrid: IGrid;
    private istargetGrid: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private helper: Function = (e: { sender: MouseEventArgs }) => {
        const gObj: IGrid = this.parent;
        const target: Element = this.draggable.currentStateTarget as Element;
        const visualElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
            styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
        });
        const table: Element = this.parent.createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
        const tbody: Element = this.parent.createElement( literals.tbody);

        if (document.getElementsByClassName('e-griddragarea').length ||
            (gObj.rowDropSettings.targetID && ((!(target as Element).classList.contains('e-selectionbackground')
                && gObj.selectionSettings.type !== 'Single') || !parentsUntil(target as Element, 'e-rowcell'))) ||
            (!gObj.rowDropSettings.targetID && !parentsUntil(target as Element, 'e-rowdragdrop'))) {
            return false;
        }
        if (gObj.rowDropSettings.targetID &&
            gObj.selectionSettings.mode === 'Row' && gObj.selectionSettings.type === 'Single') {
            gObj.selectRow(parseInt((this.draggable.currentStateTarget as Element).parentElement.getAttribute(literals.ariaRowIndex), 10));
        }
        this.startedRow = closestElement(target as Element, 'tr').cloneNode(true) as HTMLTableRowElement;
        const frzCols: boolean = this.parent.isFrozenGrid();
        if (frzCols) {
            const rowIndex: number = parseInt(closestElement(target, 'tr').getAttribute(literals.ariaRowIndex), 10);
            this.startedRow.innerHTML = '';
            this.startedRow.innerHTML += gObj.getRowByIndex(rowIndex).innerHTML;
            this.startedRow.innerHTML += gObj.getMovableRowByIndex(rowIndex).innerHTML;
            if (gObj.getFrozenMode() === literals.leftRight) {
                this.startedRow.innerHTML += gObj.getFrozenRightRowByIndex(rowIndex).innerHTML;
            }
        }
        this.processArgs(target);
        const args: Object = {
            selectedRow: this.rows, dragelement: target,
            cloneElement: visualElement, cancel: false, data: this.rowData
        };
        const selectedRows: Element[] = gObj.getSelectedRows();
        gObj.trigger(events.rowDragStartHelper, args);
        const cancel: string = 'cancel';
        if (args[cancel]) {
            return false;
        }
        removeElement(this.startedRow, '.e-indentcell');
        removeElement(this.startedRow, '.e-detailrowcollapse');
        removeElement(this.startedRow, '.e-detailrowexpand');
        this.removeCell(this.startedRow, literals.gridChkBox);
        const exp: RegExp = new RegExp('e-active', 'g'); //high contrast issue
        this.startedRow.innerHTML = this.startedRow.innerHTML.replace(exp, '');
        tbody.appendChild(this.startedRow);
        if (gObj.getSelectedRowIndexes().length > 1 && this.startedRow.hasAttribute('aria-selected')) {
            const index: number = gObj.getFrozenMode() === literals.leftRight ? 3 : 2;
            const dropCountEle: HTMLElement = this.parent.createElement('span', {
                className: 'e-dropitemscount', innerHTML: frzCols ? '' + selectedRows.length / index : '' + selectedRows.length
            });
            visualElement.appendChild(dropCountEle);
        }
        const ele: Element = closestElement(target as Element, 'tr').querySelector('.e-icon-rowdragicon');
        if (ele) {
            ele.classList.add('e-dragstartrow');
        }
        table.appendChild(tbody);
        visualElement.appendChild(table);
        gObj.element.appendChild(visualElement);
        return visualElement;
    }

    private dragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs } & BlazorDragEventArgs) => {
        const gObj: IGrid = this.parent;
        if (document.getElementsByClassName('e-griddragarea').length) {
            return;
        }
        const target: Element = e.target;
        const spanCssEle: HTMLSpanElement = this.parent.element.querySelector('.e-dropitemscount') as HTMLSpanElement;
        if (this.parent.getSelectedRecords().length > 1 && spanCssEle) {
            spanCssEle.style.left = (this.parent.element.querySelector('.e-cloneproperties table') as HTMLTableRowElement)
                .offsetWidth - 5 + 'px';
        }
        this.processArgs(target);
        gObj.trigger(events.rowDragStart, {
            rows: this.rows, target: e.target,
            draggableType: 'rows', fromIndex: parseInt(this.rows[0].getAttribute(literals.ariaRowIndex), 10),
            data: (Object.keys(this.rowData[0]).length > 0) ? this.rowData as Object[] : this.currentViewData()
        });
        this.dragStartData = this.rowData;
        const dropElem: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances &&
            (<{getModuleName?: Function}>dropElem.ej2_instances[0]).getModuleName() === 'grid') {
            dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
        }
    }

    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        const gObj: IGrid = this.parent;
        this.isDropGrid = this.parent;
        this.istargetGrid = false;
        if (this.parent.rowDropSettings.targetID) {
            const dropElement: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
            this.isDropGrid = dropElement.ej2_instances[0];
            if (parentsUntil(e.target, 'e-grid')) {
                this.istargetGrid = this.parent.rowDropSettings.targetID === parentsUntil(e.target, 'e-grid').id;
            }
        }
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        const target: Element = this.getElementFromPosition(cloneElement, e.event);
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur', 'e-movecur', 'e-grabcur']);

        this.isOverflowBorder = true;
        this.hoverState = gObj.enableHover;
        const trElement: HTMLTableRowElement = parentsUntil(target, 'e-grid') ? closestElement(e.target, 'tr') as HTMLTableRowElement : null;
        gObj.enableHover = false;
        if (!e.target) { return; }

        this.processArgs(target);
        const args: RowDragEventArgs = {
            rows: this.rows, target: target, draggableType: 'rows',
            data: this.rowData as Object[], originalEvent: e, cancel: false
        };
        gObj.trigger(events.rowDrag, args );
        this.stopTimer();
        if (args.cancel) { return; }
        gObj.element.classList.add('e-rowdrag');
        this.dragTarget = trElement && parentsUntil(target, 'e-grid').id === cloneElement.parentElement.id ?
            parseInt(trElement.getAttribute(literals.ariaRowIndex), 10) : parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10);

        if (gObj.rowDropSettings.targetID) {
            if (!parentsUntil(target, 'e-grid') ||
                parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-grabcur'], ['e-notallowedcur']);
            }
        } else {
            const elem: Element = parentsUntil(target, 'e-grid');
            if (elem && elem.id === cloneElement.parentElement.id) {
                classList(cloneElement, ['e-movecur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
            }
        }

        if (parentsUntil(this.isDropGrid.element, 'e-grid')) {
            if ((!this.isDropGrid.groupSettings.columns.length || e.target.classList.contains('e-selectionbackground')) &&
                !this.isDropGrid.element.querySelector('.e-emptyrow')) {
                if (parentsUntil(target, 'e-grid') && parentsUntil(target, 'e-grid').id === this.isDropGrid.element.id) {
                    this.updateScrollPostion(e.event);
                }
                if (((this.isOverflowBorder || this.parent.frozenRows > this.dragTarget) &&
                    (parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10) !== this.dragTarget || this.istargetGrid))
                    || (this.istargetGrid && trElement && this.isDropGrid.getRowByIndex(this.isDropGrid.getCurrentViewRecords().length - 1).
                        getAttribute('data-uid') === trElement.getAttribute('data-uid'))) {
                    this.moveDragRows(e, this.startedRow, trElement);
                } else {
                    let islastRowIndex: boolean;
                    if (this.parent.enableVirtualization) {
                        islastRowIndex = trElement && parseInt(trElement.getAttribute(literals.ariaRowIndex), 10) ===
                            this.parent.renderModule.data.dataManager.dataSource.json.length - 1;
                    } else {
                        const lastRowUid: string = this.parent.getRowByIndex(this.parent.getCurrentViewRecords().length - 1).
                            getAttribute('data-uid');
                        islastRowIndex = trElement && lastRowUid === trElement.getAttribute('data-uid') && lastRowUid !==
                            this.startedRow.getAttribute('data-uid');
                    }
                    if (islastRowIndex && !this.parent.rowDropSettings.targetID) {
                        const bottomborder: HTMLElement = this.parent.createElement('div', { className: 'e-lastrow-dragborder' });
                        const gridcontentEle: Element = this.parent.getContent();
                        bottomborder.style.width = (this.parent.element as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
                        if (this.parent.enableVirtualization) {
                            bottomborder.style.zIndex = '1';
                        }
                        if (!gridcontentEle.getElementsByClassName('e-lastrow-dragborder').length) {
                            gridcontentEle.classList.add('e-grid-relative');
                            gridcontentEle.appendChild(bottomborder);
                            bottomborder.style.bottom = this.getScrollWidth() + 'px';
                        }
                    }
                    this.removeBorder(trElement);
                }
            }
            if (target && target.classList.contains(literals.content)
                && !this.isDropGrid.element.querySelector('.e-emptyrow') && this.istargetGrid) {
                this.removeBorder(trElement);
                const rowIndex: number = this.isDropGrid.getCurrentViewRecords().length - 1;
                const selector: string = '.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse';
                let rowElement: HTMLElement[] = [];
                rowElement = [].slice.call(this.isDropGrid.getRowByIndex(rowIndex).querySelectorAll(selector));
                if (this.isDropGrid.isFrozenGrid()) {
                    rowElement = this.borderRowElement(rowIndex, selector);
                }
                if (rowElement.length > 0) {
                    addRemoveActiveClasses(rowElement, true, 'e-dragborder');
                }
            }
        }
    }

    private dragStop: Function = (e: { target: HTMLTableRowElement, event: MouseEventArgs, helper: Element }) => {
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, {
                instance: this, handler: this.processDragStop, arg1: e
            });
        } else {
            this.processDragStop(e);
        }
    }

    private processDragStop: Function = (e: { target: HTMLTableRowElement, event: MouseEventArgs, helper: Element }) => {
        const gObj: IGrid = this.parent; if (this.parent.isDestroyed) { return; }
        const targetEle: Element = this.getElementFromPosition(e.helper as HTMLElement, e.event);
        const target: Element = targetEle && !targetEle.classList.contains('e-dlg-overlay') ?
            targetEle : e.target;
        gObj.element.classList.remove('e-rowdrag');
        const dropElement: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElement && dropElement.ej2_instances &&
            (<{getModuleName?: Function}>dropElement.ej2_instances[0]).getModuleName() === 'grid') {
            dropElement.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
        }
        if (parentsUntil(this.isDropGrid.element, 'e-grid')) {
            this.stopTimer();
            this.isDropGrid.enableHover = this.hoverState;
            this.isDropGrid.getContent().classList.remove('e-grid-relative');
            this.removeBorder(targetEle);
            const stRow: Element = this.isDropGrid.element.querySelector('.e-dragstartrow');
            if (stRow) {
                stRow.classList.remove('e-dragstartrow');
            }
        }
        this.processArgs(target);
        const args: RowDropEventArgs = {
            target: target, draggableType: 'rows',
            cancel: false,
            fromIndex: parseInt(this.rows[0].getAttribute(literals.ariaRowIndex), 10),
            dropIndex: this.dragTarget, rows: this.rows,
            data: (Object.keys(this.dragStartData[0]).length > 0) ? this.dragStartData as Object[] : this.currentViewData()
        };
        gObj.trigger(events.rowDrop, args, () => {
            if (!(parentsUntil(target, literals.row) || parentsUntil(target, 'e-emptyrow')
                || parentsUntil(target,  literals.gridContent)) || args.cancel) {
                this.dragTarget = null;
                remove(e.helper);
                return;
            }
            this.isRefresh = false;
            const selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
            if (gObj.isRowDragable()) {
                if (!this.parent.rowDropSettings.targetID &&
                    this.startedRow.querySelector('td.e-selectionbackground') && selectedIndexes.length > 1 &&
                    selectedIndexes.length !== this.parent.getCurrentViewRecords().length) {
                    this.reorderRows(selectedIndexes, args.dropIndex);
                } else {
                    this.reorderRows([parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10)], this.dragTarget);
                }
                this.dragTarget = null;
                if (!gObj.rowDropSettings.targetID) {
                    remove(e.helper);
                    if (gObj.enableVirtualization) {
                        gObj.refresh();
                    } else {
                        this.rowOrder(args);
                    }
                }
            }
            this.isRefresh = true;
        });
    }
    private refreshRow(
        args: RowDropEventArgs, tbody: Element, mtbody: Element, frTbody: Element, target: Element,
        mTarget: Element, frTarget: Element): void {
        const gObj: IGrid = this.parent;
        const frzCols: boolean = gObj.isFrozenGrid();
        const isLeftRight: boolean = gObj.getFrozenMode() === literals.leftRight;
        let tbodyMovableHeader: Element;
        let tbodyMovableContent: Element;
        let frHdr: Element; let frCnt: Element;
        const tbodyContent: Element = gObj.getContentTable().querySelector( literals.tbody);
        const tbodyHeader: Element = gObj.getHeaderTable().querySelector( literals.tbody);
        if (frzCols) {
            tbodyMovableHeader = gObj.getMovableHeaderTbody();
            tbodyMovableContent = gObj.getMovableContentTbody();
            if (isLeftRight) {
                frHdr = gObj.getFrozenRightHeaderTbody();
                frCnt = gObj.getFrozenRightContentTbody();
            }
        }
        const index: number = gObj.getFrozenMode() === literals.leftRight ? 3 : 2;
        for (let i: number = 0, len: number = args.rows.length; i < len; i++) {
            if (frzCols) {
                if (i % index === 0) {
                    tbody.insertBefore(args.rows[i], target);
                } else if (i % index === 1) {
                    mtbody.insertBefore(args.rows[i], mTarget);
                } else {
                    frTbody.insertBefore(args.rows[i], frTarget);
                }
            } else {
                tbody.insertBefore(args.rows[i], target);
            }
        }
        const tr: HTMLTableRowElement[] = [].slice.call(tbody.getElementsByClassName(literals.row));
        let mtr: HTMLTableRowElement[]; let frTr: HTMLTableRowElement[];
        if (frzCols) {
            mtr = [].slice.call(mtbody.getElementsByClassName(literals.row));
            if (isLeftRight) {
                frTr = [].slice.call(frTbody.getElementsByClassName(literals.row));
            }
        }
        this.refreshData(tr, mtr, frTr);
        if (this.parent.frozenRows) {
            for (let i: number = 0, len: number = tr.length; i < len; i++) {
                if (i < this.parent.frozenRows) {
                    setRowsInTbody(
                        tbodyHeader, tbodyMovableHeader, frHdr, tr, mtr, frTr, (tbody: Element, rows: Element[]) => {
                            tbody.appendChild(rows[i]);
                        }
                    );
                } else {
                    setRowsInTbody(
                        tbodyContent, tbodyMovableContent, frCnt, tr, mtr, frTr, (tbody: Element, rows: Element[]) => {
                            tbody.appendChild(rows[i]);
                        }
                    );
                }
            }
        }
    }
    private updateFrozenRowreOrder(args: RowDropEventArgs): void {
        const gObj: IGrid = this.parent;
        let tbodyMovH: Element;
        let tbodyMovC: Element;
        let tbodyFrH: Element; let tbodyFrC: Element;
        const frzCols: boolean = this.parent.isFrozenGrid();
        const isLeftRight: boolean = gObj.getFrozenMode() === literals.leftRight;
        const tbodyC: Element = gObj.getContentTable().querySelector( literals.tbody);
        const tbodyH: Element = gObj.getHeaderTable().querySelector( literals.tbody);
        if (frzCols) {
            tbodyMovH = gObj.getMovableHeaderTbody();
            tbodyMovC = gObj.getMovableContentTbody();
            if (isLeftRight) {
                tbodyFrH = gObj.getFrozenRightHeaderTbody();
                tbodyFrC = gObj.getFrozenRightContentTbody();
            }
        }
        const tr: HTMLTableRowElement[] = [].slice.call(tbodyH.getElementsByClassName(literals.row)).concat(
            [].slice.call(tbodyC.getElementsByClassName(literals.row)));
        let mtr: HTMLTableRowElement[]; let frTr: HTMLTableRowElement[];
        if (frzCols) {
            mtr = [].slice.call(tbodyMovH.getElementsByClassName(literals.row))
                .concat([].slice.call(tbodyMovC.getElementsByClassName(literals.row)));
            if (isLeftRight) {
                frTr = [].slice.call(tbodyFrH.getElementsByClassName(literals.row))
                    .concat([].slice.call(tbodyFrC.getElementsByClassName(literals.row)));
            }
        }
        const tbody: Element = gObj.createElement( literals.tbody);
        const mtbody: Element = gObj.createElement( literals.tbody);
        const frTbody: Element = gObj.createElement( literals.tbody);
        this.parent.clearSelection();
        const targetRows: {target: Element, mTarget: Element, frTarget: Element} = this.refreshRowTarget(args);
        for (let i: number = 0, len: number = tr.length; i < len; i++) {
            tbody.appendChild(tr[i]);
            if (frzCols) {
                mtbody.appendChild(mtr[i]);
                if (isLeftRight) {
                    frTbody.appendChild(frTr[i]);
                }
            }
        }
        this.refreshRow(args, tbody, mtbody, frTbody, targetRows.target, targetRows.mTarget, targetRows.frTarget);
    }

    private refreshRowTarget( args: RowDropEventArgs): {target: Element, mTarget: Element, frTarget: Element} {
        const gObj: IGrid = this.parent;
        let mTr: Element; let frTr: Element;
        let targetIdx: number = parseInt(args.target.parentElement.getAttribute(literals.ariaRowIndex), 10);
        if (args.fromIndex < args.dropIndex || args.fromIndex === args.dropIndex) {
            targetIdx = targetIdx + 1;
        }
        const tr: Element = gObj.getRowByIndex(targetIdx);
        if (gObj.isFrozenGrid()) {
            mTr = gObj.getMovableRowByIndex(targetIdx);
            if (gObj.getFrozenMode() === literals.leftRight) {
                frTr = gObj.getFrozenRightRowByIndex(targetIdx);
            }
        }
        const rows: {target: Element, mTarget: Element, frTarget: Element} = {
            target: tr, mTarget: mTr, frTarget: frTr
        };
        return rows;
    }

    private updateFrozenColumnreOrder(args: RowDropEventArgs): void {
        const gObj: IGrid = this.parent;
        let mtbody: Element; let frTbody: Element;
        const frzCols: boolean = this.parent.isFrozenGrid();
        const tbody: Element = gObj.getContentTable().querySelector( literals.tbody);
        if (frzCols) {
            mtbody = gObj.getMovableContentTbody();
            if (gObj.getFrozenMode() === literals.leftRight) {
                frTbody = gObj.getFrozenRightContentTbody();
            }
        }
        this.parent.clearSelection();
        const targetRows: {target: Element, mTarget: Element, frTarget: Element} = this.refreshRowTarget(args);
        this.refreshRow(args, tbody, mtbody, frTbody,  targetRows.target, targetRows.mTarget, targetRows.frTarget);
    }

    private refreshData(tr: HTMLTableRowElement[], mtr: HTMLTableRowElement[], frTr: HTMLTableRowElement[]): void {
        const rowObj: object = {};
        const movobj: object = {}; const frObj: object = {};
        const recordobj: object = {};
        const rowObjects: Row<Column>[] = this.parent.getRowsObject();
        const movbObject: Row<Column>[] = this.parent.getMovableRowsObject();
        const frRightObject: Row<Column>[] = this.parent.getFrozenRightRowsObject();
        const currentViewData: Object[] = this.parent.getCurrentViewRecords();
        for (let i: number = 0, len: number = tr.length; i < len; i++) {
            const index: number = parseInt(tr[i].getAttribute(literals.ariaRowIndex), 10);
            rowObj[i] = rowObjects[index];
            recordobj[i] = currentViewData[index];
            if (this.parent.isFrozenGrid()) {
                movobj[i] = movbObject[index];
                if (frTr) {
                    frObj[i] = frRightObject[index];
                }
            }
        }
        const rows: Element[] = this.parent.getRows();
        let movbRows: Element[]; let frRightRows: Element[];
        if (this.parent.isFrozenGrid()) {
            movbRows = this.parent.getMovableRows();
            if (frTr) {
                frRightRows = this.parent.getFrozenRightRows();
            }
        }
        for (let i: number = 0, len: number = tr.length; i < len; i++) {
            rows[i] = tr[i];
            rowObjects[i] = rowObj[i];
            currentViewData[i] = recordobj[i];
            if (this.parent.isFrozenGrid()) {
                movbRows[i] = mtr[i];
                movbObject[i] = movobj[i];
                if (frTr) {
                    frRightRows[i] = frTr[i];
                    frRightObject[i] = frObj[i];
                }
            }
        }
        resetRowIndex(this.parent, rowObjects, tr);
        if (this.parent.isFrozenGrid()) {
            resetRowIndex(this.parent, movbObject, mtr);
            if (frTr) {
                resetRowIndex(this.parent, frRightObject, frTr);
            }
        }
    }

    private rowOrder(args: RowDropEventArgs): void {
        if (args.dropIndex === args.fromIndex || isNaN(args.dropIndex)) {
            return;
        }
        if (this.parent.isDetail()) {
            (<Grid>this.parent).detailCollapseAll();
            const rows: HTMLTableRowElement[] = [].slice.call(this.parent.getContentTable().querySelector( literals.tbody).children);
            const rowObjects: Row<Column>[] = this.parent.getRowsObject();
            rows.filter((row: HTMLTableRowElement) => {
                if (row.classList.contains('e-detailrow')) {
                    row.remove();
                }
            });
            for (let i: number = 0, len: number = rowObjects.length; i < len; i++) {
                if (!rowObjects[i]) {
                    break;
                }
                if (rowObjects[i].isDetailRow) {
                    this.parent.getRowsObject().splice(i, 1);
                    i--;
                }
            }
        }
        if (args.target.classList.contains('e-rowcelldrag')) {
            args.target = args.target.parentElement;
        }
        if (this.parent.frozenRows) {
            this.updateFrozenRowreOrder(args);
        } else {
            this.updateFrozenColumnreOrder(args);
        }
        if (this.selectedRowColls.length > 0) {
            this.parent.selectRows(this.selectedRowColls);
            const indexes: number[] = [];
            if (this.parent.filterSettings.columns.length || this.parent.sortSettings.columns.length) {
                for (let i: number = 0, len: number = args.rows.length; i < len; i++) {
                    indexes.push(parseInt(args.rows[i].getAttribute(literals.ariaRowIndex), 10));
                }
                this.selectedRowColls = indexes;
            }
            this.selectedRowColls = [];
        }
    }

    private currentViewData(): object[] {
        const selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
        const currentVdata: object[] = [];
        const fromIdx: number = parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10);
        for (let i: number = 0, n: number = selectedIndexes.length; i < n; i++) {
            const currentV: string = 'currentViewData';
            currentVdata[i] = this.parent[currentV][selectedIndexes[i]];
        }
        if (!this.parent.rowDropSettings.targetID && selectedIndexes.length === 0) {
            currentVdata[0] = this.parent.currentViewData[fromIdx];
        }
        return currentVdata;
    }

    private saveChange(changeRecords: object, query: Query): void {
        this.parent.getDataModule().saveChanges(changeRecords, this.parent.getPrimaryKeyFieldNames()[0], {}, query)
            .then(() => {
                this.parent.notify(events.modelChanged, {
                    type: events.actionBegin, requestType: 'rowdraganddrop'
                });
            }).catch((e: Error) => {
                const error: string = 'error';
                const message: string = 'message';
                if (!isNullOrUndefined(e[error]) && !isNullOrUndefined(e[error][message])) {
                    e[error] = e[error][message];
                }
                this.parent.trigger(events.actionFailure, e);
            });
    }

    public reorderRows(fromIndexes: number[], toIndex: number): void {
        const selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
        const selectedRecords: object[] = [];
        const draggedRecords: object[] = [];
        const currentViewData: Object[] = this.parent.renderModule.data.dataManager.dataSource.json;
        const skip: number = this.parent.allowPaging ?
            (this.parent.pageSettings.currentPage * this.parent.pageSettings.pageSize) - this.parent.pageSettings.pageSize : 0;
        let dropIdx: number = toIndex + skip;
        let actualIdx: number = fromIndexes[0] + skip;
        for (let i: number = 0, len: number = fromIndexes.length; i < len; i++) {
            draggedRecords[i] = currentViewData[fromIndexes[i] + skip];
        }
        for (let i: number = 0, len: number = selectedIndexes.length; i < len; i++) {
            selectedRecords[i] = currentViewData[selectedIndexes[i] + skip];
        }
        for (let i: number = 0, len: number = draggedRecords.length; i < len; i++) {
            if (i !== 0) {
                for (let j: number = 0, len1: number = currentViewData.length; j < len1; j++) {
                    if (JSON.stringify(this.parent.renderModule.data.dataManager.dataSource.json[j]) ===
                        JSON.stringify(draggedRecords[i])) {
                        actualIdx = j;
                        break;
                    }
                }
                for (let j: number = 0, len1: number = currentViewData.length; j < len1; j++) {
                    if (JSON.stringify(
                        this.parent.renderModule.data.dataManager.dataSource.json[j]) === JSON.stringify(draggedRecords[i - 1])) {
                        if (actualIdx > j) {
                            dropIdx = j + 1;
                        }
                        break;
                    }
                }
            }
            this.reorderRow(actualIdx - skip, dropIdx - skip);
        }
        if (this.isRefresh) {
            this.parent.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
        }
        for (let i: number = 0, len: number = selectedRecords.length; i < len; i++) {
            for (let j: number = 0, len1: number = currentViewData.length; j < len1; j++) {
                if (JSON.stringify(
                    this.parent.renderModule.data.dataManager.dataSource.json[j]) === JSON.stringify(selectedRecords[i])) {
                    selectedIndexes[i] = j - skip;
                    break;
                }
            }
        }
        this.selectedRowColls = selectedIndexes;
    }

    private removeCell: Function = (targetRow: HTMLTableRowElement, className: string) => {
        return [].slice.call(targetRow.querySelectorAll('td')).filter((cell: HTMLTableCellElement) => {
            if (cell.classList.contains(className)) { (targetRow as HTMLTableRowElement).deleteCell(cell.cellIndex); }
        });
    }

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid print module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.initializeDrag, this);
        this.parent.on(events.columnDrop, this.columnDrop, this);
        this.onDataBoundFn = this.onDataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.onDataBoundFn);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private initializeDrag(): void {
        const gObj: IGrid = this.parent;
        this.draggable = new Draggable(gObj.element as HTMLElement, {
            dragTarget: '.e-rowcelldrag, .e-rowdragdrop, .e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop,
            isReplaceDragEle: this.isReplaceDragEle
        });
    }

    private updateScrollPostion(e: MouseEvent | TouchEvent): void {
        const y: number = getPosition(e).y;
        const cliRect: ClientRect = this.isDropGrid.getContent().getBoundingClientRect();
        const rowHeight: number = this.isDropGrid.getRowHeight() - 15;
        const scrollElem: Element = this.isDropGrid.getContent().firstElementChild;
        const virtualScrollbtm: number = this.parent.enableVirtualization ? 20 : 0;
        if (cliRect.top >= y) {
            const scrollPixel: number = -(this.isDropGrid.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(
                () => { this.setScrollDown(scrollElem, scrollPixel); }, 200);
        } else if (cliRect.top + this.isDropGrid.getContent().clientHeight - rowHeight - 33 - virtualScrollbtm <= y) {
            const scrollPixel: number = (this.isDropGrid.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(
                () => { this.setScrollDown(scrollElem, scrollPixel); }, 200);
        }
    }

    private setScrollDown(scrollElem: Element, scrollPixel: number): void {
        scrollElem.scrollTop = scrollElem.scrollTop + scrollPixel;
    }

    private moveDragRows(e: { target: HTMLElement, event: MouseEventArgs }, startedRow: HTMLTableRowElement, targetRow: HTMLTableRowElement)
        : void {
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        const element: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        if (parentsUntil(element, 'e-grid') &&
            (parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(element, 'e-grid').id || this.istargetGrid)) {
            const targetElement: HTMLTableRowElement = element ?
                element : this.startedRow;
            this.setBorder(targetElement, e.event, startedRow, targetRow);
        }
    }

    private setBorder(element: Element, event: MouseEventArgs, startedRow: HTMLTableRowElement, targetRow: HTMLTableRowElement): void {
        let node: Element = this.parent.element as Element;
        if (this.istargetGrid) {
            node = this.isDropGrid.element as Element;
        }
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        if (parentsUntil(element, 'e-grid') && element.classList.contains(literals.row) && ((!this.parent.rowDropSettings.targetID &&
            parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(element, 'e-grid').id) || this.istargetGrid)) {
            removeClass(node.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'), ['e-dragborder']);
            let rowElement: HTMLElement[] = [];
            const targetRowIndex: number = parseInt(targetRow.getAttribute(literals.ariaRowIndex), 10);
            if (targetRow && targetRowIndex === 0) {
                const div: HTMLElement = this.parent.createElement('div', { className: 'e-firstrow-dragborder' });
                const gridheaderEle: Element = this.isDropGrid.getHeaderContent();
                gridheaderEle.classList.add('e-grid-relative');

                div.style.width = (node as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
                if (!gridheaderEle.getElementsByClassName('e-firstrow-dragborder').length) {
                    gridheaderEle.appendChild(div);
                }
            } else if (this.parent.rowDropSettings.targetID && targetRow) {
                element = this.isDropGrid.getRowByIndex(targetRowIndex - 1);
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            } else if (targetRow && parseInt(startedRow.getAttribute(literals.ariaRowIndex), 10) > targetRowIndex) {
                element = this.parent.getRowByIndex(targetRowIndex - 1);
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            } else { rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')); }
            const frzCols: boolean = this.parent.isFrozenGrid();
            if (targetRow && targetRowIndex !== 0 && frzCols) {
                const rowIndex: number = parseInt(element.getAttribute(literals.ariaRowIndex), 10);
                const selector: string = '.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse';
                rowElement = this.borderRowElement(rowIndex, selector);
            }
            if (rowElement.length > 0) {
                addRemoveActiveClasses(rowElement, true, 'e-dragborder');
            }
        }
    }

    private borderRowElement(rowIndex: number, selector: string): HTMLElement[] {
        let lastRow: HTMLElement[] = [];
        lastRow = [].slice.call(this.isDropGrid.getRowByIndex(rowIndex).querySelectorAll(selector)).
            concat([].slice.call(this.isDropGrid.getMovableRowByIndex(rowIndex).querySelectorAll(selector)));
        if (this.isDropGrid.getFrozenMode() === literals.leftRight) {
            lastRow = lastRow.concat([].slice.call(
                this.isDropGrid.getFrozenRightRowByIndex(rowIndex).querySelectorAll(selector)));
        }
        return lastRow;
    }

    private getScrollWidth(): number {
        const scrollElem: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }

    private removeFirstRowBorder(element: Element): void {
        if (this.isDropGrid.element.getElementsByClassName('e-firstrow-dragborder').length > 0 && element &&
            (element as HTMLTableRowElement).rowIndex !== 0) {
            remove(this.isDropGrid.element.getElementsByClassName('e-firstrow-dragborder')[0]);
        }
    }

    private removeLastRowBorder(element: Element): void {
        let islastRowIndex: boolean;
        if (this.parent.enableVirtualization) {
            islastRowIndex = element && parseInt(element.getAttribute(literals.ariaRowIndex), 10) !==
                this.parent.renderModule.data.dataManager.dataSource.json.length - 1;
        } else {
            islastRowIndex = element &&
                this.parent.getRowByIndex(this.parent.getCurrentViewRecords().length - 1).getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        }
        if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0 && element && islastRowIndex) {
            remove(this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0]);
        }
    }

    private removeBorder(element: Element): void {
        this.removeFirstRowBorder(element);
        if (!this.parent.rowDropSettings.targetID) {
            this.removeLastRowBorder(element);
        }
        element = (this.isDropGrid.isFrozenGrid() ? this.isDropGrid.getMovableRows() : this.isDropGrid.getRows()).filter((row: Element) =>
            row.querySelector('td.e-dragborder'))[0];
        if (element) {
            let rowElement: HTMLElement[] = [].slice.call(element.getElementsByClassName('e-dragborder'));
            if (this.parent.isFrozenGrid()) {
                const rowIndex: number = parseInt(element.getAttribute(literals.ariaRowIndex), 10);
                const selector: string = '.e-dragborder';
                rowElement = this.borderRowElement(rowIndex, selector);
            }
            addRemoveActiveClasses(rowElement, false, 'e-dragborder');
        }
    }

    private getElementFromPosition(element: HTMLElement, event: MouseEventArgs): Element {
        const position: IPosition = getPosition(event);
        element.style.display = 'none';
        const target: Element = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    }

    private onDataBound(): void {
        if (this.selectedRowColls.length > 0 && this.parent.enableVirtualization) {
            this.parent.selectRows(this.selectedRowColls);
            this.selectedRowColls = [];
        }
    }

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute(literals.ariaRowIndex), 10) : 0;
    }

    private singleRowDrop(e: { target: HTMLTableRowElement, droppedElement: HTMLElement }): void {
        const targetRow: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        const srcControl: IGrid = (<EJ2Intance>e.droppedElement.parentElement).ej2_instances[0];
        const currentIndex: number = targetRow ? targetRow.rowIndex : srcControl.currentViewData.length - 1;
        this.reorderRow(this.startedRowIndex, currentIndex);
    }

    private columnDrop(e: { target: HTMLTableRowElement, droppedElement: HTMLElement }): void {
        const gObj: IGrid = this.parent;
        if (e.droppedElement.getAttribute('action') !== 'grouping' &&
            (parentsUntil(e.target, literals.row) || parentsUntil(e.target, 'e-emptyrow') || parentsUntil(e.target,  literals.gridContent))) {
            const targetRow: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
            let srcControl: IGrid;
            let currentIndex: number;
            if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
                e.droppedElement.parentElement.id === gObj.element.id)
                || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                    e.droppedElement.parentElement.id !== gObj.element.id)) {
                return;
            }
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                srcControl = (<EJ2Intance>e.droppedElement.parentElement).ej2_instances[0];
            } else if (this.isSingleRowDragDrop || e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true') {
                this.singleRowDrop(e);
                return;
            }
            if (srcControl.element.id !== gObj.element.id && srcControl.rowDropSettings.targetID !== gObj.element.id) {
                return;
            }
            const records: Object[] = srcControl.getSelectedRecords();
            let targetIndex: number = currentIndex = this.getTargetIdx(targetRow);
            if (isNaN(targetIndex)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                targetIndex = currentIndex = 0;
            }
            if (gObj.allowPaging) {
                targetIndex = targetIndex + (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize;
            }
            //Todo: drag and drop mapper & BatchChanges
            gObj.notify(events.rowsAdded, { toIndex: targetIndex, records: records });
            gObj.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
            const selectedRows: number[] = srcControl.getSelectedRowIndexes();
            const skip: number = srcControl.allowPaging ?
                (srcControl.pageSettings.currentPage * srcControl.pageSettings.pageSize) - srcControl.pageSettings.pageSize : 0;
            this.selectedRows = [];
            for (let i: number = 0, len: number = records.length; i < len; i++) {
                this.selectedRows.push(skip + selectedRows[i]);
            }
            srcControl.notify(events.rowsRemoved, { indexes: this.selectedRows, records: records });
            srcControl.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
        }
    }

    private reorderRow(fromIndexes: number, toIndex: number): void {
        const gObj: IGrid = this.parent;
        if (!gObj.sortSettings.columns.length && !gObj.groupSettings.columns.length && !gObj.filterSettings.columns.length) {
            //Todo: drag and drop mapper & BatchChanges
            const skip: number = gObj.allowPaging ?
                (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize : 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const fromIndex: number = fromIndexes;
            toIndex = toIndex + skip;
            this.selectedRows = gObj.getSelectedRowIndexes();
            gObj.notify(events.rowPositionChanged, {
                fromIndex: fromIndexes + skip,
                toIndex: toIndex
            });
        }
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.initializeDrag();
        }
    }

    /**
     * To destroy the print
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.' + literals.gridHeader) &&
            !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.draggable.destroy();
        this.parent.off(events.initialEnd, this.initializeDrag);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.removeEventListener(events.dataBound, this.onDataBoundFn);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.destroy, this.destroy);
        //destory ejdrag and drop
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'rowDragAndDrop';
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private processArgs(target: Element): void {
        const gObj: IGrid = this.parent;
        const dragIdx: number = parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10);
        if ((gObj.getSelectedRecords().length > 0 && this.startedRow.cells[0].classList.contains('e-selectionbackground') === false)
            || gObj.getSelectedRecords().length === 0) {
            if (this.parent.enableVirtualization) {
                this.rows = [this.startedRow];
            } else {
                this.rows = [this.parent.getRowByIndex(dragIdx)];
                if (gObj.isFrozenGrid()) {
                    this.rows = [gObj.getRowByIndex(dragIdx), gObj.getMovableRowByIndex(dragIdx)];
                    if (gObj.getFrozenMode() === literals.leftRight) {
                        this.rows = [
                            gObj.getRowByIndex(dragIdx), gObj.getMovableRowByIndex(dragIdx), gObj.getFrozenRightRowByIndex(dragIdx)
                        ];
                    }
                }
            }
            this.rowData = [this.parent.getRowInfo((this.startedRow).querySelector('.' + literals.rowCell)).rowData];
        } else {
            this.rows = gObj.getSelectedRows();
            this.rowData = gObj.getSelectedRecords();
        }
    }
}
