import { MouseEventArgs, Draggable, isNullOrUndefined } from '@syncfusion/ej2-base';
import { removeClass, updateCSSText } from '@syncfusion/ej2-base';
import { remove, closest as closestElement, classList, BlazorDragEventArgs, extend } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EJ2Intance, IPosition, RowDragEventArgs } from '../base/interface';
import { parentsUntil, removeElement, getPosition, addRemoveActiveClasses, isActionPrevent } from '../base/util';
import { resetRowIndex, resetCachedRowIndex, groupReorderRowObject } from '../base/util';
import { Column } from '../models/column';
import { Row } from '../models/row';
import * as events from '../base/constant';
import { Scroll } from '../actions/scroll';
import { RowDropEventArgs } from '../base/interface';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../base';
import * as literals from '../base/string-literals';

// eslint-disable-next-line valid-jsdoc, jsdoc/require-param, jsdoc/require-returns
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
        let target: Element = this.draggable.currentStateTarget as Element;
        if (!isNullOrUndefined(target) && gObj.rowDropSettings.targetID && !isNullOrUndefined(target.classList) && !target.classList.contains('e-rowcell')) {
            target = parentsUntil(target as Element, 'e-rowcell');
        }
        const visualElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-cloneproperties e-draganddrop e-grid e-dragclone'
        });
        visualElement.style.height = 'auto';
        const table: Element = this.parent.createElement('table', { attrs: { role: 'grid' } });
        const tbody: Element = this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });

        if (document.getElementsByClassName('e-griddragarea').length ||
            (gObj.rowDropSettings.targetID && ((!isNullOrUndefined(target) && !(target as Element).classList.contains('e-selectionbackground')
                && gObj.selectionSettings.type !== 'Single') || !parentsUntil(target as Element, 'e-rowcell'))) ||
            (!gObj.rowDropSettings.targetID && !parentsUntil(target as Element, 'e-rowdragdrop'))) {
            return false;
        }
        if (gObj.rowDropSettings.targetID &&
            gObj.selectionSettings.mode === 'Row' && gObj.selectionSettings.type === 'Single') {
            gObj.selectRow(parseInt((this.draggable.currentStateTarget as Element).parentElement
                .getAttribute(literals.ariaRowIndex), 10) - 1);
        }
        this.startedRow = closestElement(target as Element, 'tr').cloneNode(true) as HTMLTableRowElement;
        if (this.parent.isFrozenGrid()) {
            const nodes: Element[] = [].slice.call(this.startedRow.querySelectorAll('.e-rowcell'));
            for (let i: number = 0; i < nodes.length; i++) {
                removeClass([nodes[parseInt(i.toString(), 10)]],
                            ['e-leftfreeze', 'e-freezeleftborder', 'e-fixedfreeze', 'e-freezerightborder', 'e-rightfreeze', 'e-unfreeze']);
                nodes[parseInt(i.toString(), 10)].removeAttribute('style');
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
        if (args[`${cancel}`]) {
            return false;
        }
        removeElement(this.startedRow, '.e-indentcell');
        removeElement(this.startedRow, '.e-detailrowcollapse');
        removeElement(this.startedRow, '.e-detailrowexpand');
        if (!(gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache)) {
            this.removeCell(this.startedRow, literals.gridChkBox);
        }
        const activeCells: NodeListOf<Element> = this.startedRow.querySelectorAll('.e-active');
        activeCells.forEach((cell: Element) => cell.classList.remove('e-active'));
        tbody.appendChild(this.startedRow);
        if (gObj.getSelectedRowIndexes().length > 1 && this.startedRow.hasAttribute('aria-selected')) {
            const dropCountEle: HTMLElement = this.parent.createElement('span', {
                className: 'e-dropitemscount', innerHTML: '' + selectedRows.length
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
        if ((gObj.enableVirtualization || gObj.infiniteScrollSettings.enableCache) && gObj.allowGrouping &&
            gObj.groupSettings.columns.length && !isNullOrUndefined(e.target.closest('tr'))) {
            const dragTrs: NodeListOf<Element> = e.dragElement.querySelectorAll('tr');
            const indentCells: NodeListOf<Element> = e.target.closest('tr').querySelectorAll('.e-indentcell');
            for (let i: number = 0; i < dragTrs.length; i++) {
                for (let j: number = 0; j < indentCells.length; j++) {
                    const cloneIndentCell: Node = indentCells[parseInt(j.toString(), 10)].cloneNode(true);
                    dragTrs[parseInt(i.toString(), 10)].insertBefore(cloneIndentCell,
                                                                     dragTrs[parseInt(i.toString(), 10)].firstElementChild);
                }
            }
        }
        if (gObj.element.classList.contains('e-childgrid')) {
            const parentGrid: Element = this.getParentGrid(gObj.element);
            parentGrid.appendChild(e.dragElement);
            gObj.element.appendChild(gObj.createElement('div', { className: 'e-drag-ref'}));
        }
        document.body.classList.add('e-prevent-select');
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
            draggableType: 'rows', fromIndex: parseInt(this.rows[0].getAttribute(literals.ariaRowIndex), 10) - 1,
            data: (this.rowData[0] && Object.keys(this.rowData[0]).length > 0) ? this.rowData as Object[] : this.currentViewData()
        });
        this.dragStartData = this.rowData;
        const dropElem: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances &&
            (<{getModuleName?: Function}>dropElem.ej2_instances[0]).getModuleName() === 'grid') {
            dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
        }
    }

    private getParentGrid(childGrid: Element): Element {
        let parentGrid: Element = childGrid;
        let parentGridObtained: boolean = false;
        while (!parentGridObtained) {
            if ((<EJ2Intance>parentGrid).ej2_instances[0].parentDetails) {
                parentGrid = document.getElementById((<EJ2Intance>parentGrid).ej2_instances[0].parentDetails.parentID);
            }
            if (!parentGrid.classList.contains('e-childgrid')) {
                parentGridObtained = true;
            }
        }
        return parentGrid;
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
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        if (gObj.element.classList.contains('e-childgrid')) {
            const parentGrid: Element = this.getParentGrid(gObj.element);
            cloneElement = parentGrid.querySelector('.e-cloneproperties') as HTMLElement;
        }
        const target: Element = this.getElementFromPosition(cloneElement, e.event);
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur', 'e-movecur', 'e-grabcur']);

        this.isOverflowBorder = true;
        this.hoverState = gObj.enableHover;
        const trElement: HTMLTableRowElement = parentsUntil(target, 'e-grid') ? closestElement(e.target, 'tr') as HTMLTableRowElement : null;
        if (!e.target) { return; }

        this.processArgs(target);
        if (gObj.enableVirtualization && isNullOrUndefined(this.rows[0])) {
            classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
        }
        const args: RowDragEventArgs = {
            rows: this.rows, target: target, draggableType: 'rows',
            data: this.rowData as Object[], originalEvent: e, cancel: false
        };
        gObj.trigger(events.rowDrag, args );
        this.stopTimer();
        if (args.cancel) { return; }
        gObj.element.classList.add('e-rowdrag');
        if (trElement && (parentsUntil(target, 'e-grid').id === cloneElement.parentElement.id || parentsUntil(target, 'e-grid').id)) {
            if (this.isDropGrid.element.querySelector('.e-emptyrow')) {
                this.dragTarget = 0;
            } else {
                this.dragTarget = parseInt(trElement.getAttribute('aria-rowindex'), 10) - 1;
            }
        } else {
            this.dragTarget = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10) - 1;
        }

        if (gObj.rowDropSettings.targetID) {
            const dragParentElement: Element = document.querySelector('.e-drag-ref');
            if (!parentsUntil(target, 'e-grid') || (dragParentElement
                && parentsUntil(dragParentElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) ||
                parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-grabcur'], ['e-notallowedcur']);
            }
        } else {
            const element: Element = parentsUntil(target, 'e-grid');
            if (element && element.id === cloneElement.parentElement.id && parentsUntil(target, 'e-row') &&
                !parentsUntil(target, 'e-addedrow')) {
                classList(cloneElement, ['e-movecur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
            }
        }

        if (parentsUntil(this.isDropGrid.element, 'e-grid')) {
            if ((!this.isDropGrid.groupSettings.columns.length || this.isDropGrid.groupSettings.columns.length)
            && !this.isDropGrid.element.querySelector('.e-emptyrow')) {
                if (parentsUntil(target, 'e-grid') && parentsUntil(target, 'e-grid').id === this.isDropGrid.element.id) {
                    this.updateScrollPostion(e.event);
                }
                if (((this.isOverflowBorder || this.parent.frozenRows > this.dragTarget) &&
                    (parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10) - 1 !== this.dragTarget || this.istargetGrid))
                    || (this.istargetGrid && trElement && this.isDropGrid.getRowByIndex(this.isDropGrid.getCurrentViewRecords().length - 1).
                        getAttribute('data-uid') === trElement.getAttribute('data-uid'))) {
                    this.moveDragRows(e, this.startedRow, trElement);
                } else {
                    let islastRowIndex: boolean;
                    if (this.parent.enableVirtualization) {
                        islastRowIndex = trElement && parseInt(trElement.getAttribute(literals.ariaRowIndex), 10) - 1 ===
                            this.parent.renderModule.data.dataManager.dataSource.json.length - 1;
                    } else {
                        const rowIndex: number = this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache &&
                            !this.parent.groupSettings.enableLazyLoading ?
                            this.parent.pageSettings.currentPage * this.parent.pageSettings.pageSize - 1 :
                            this.parent.getCurrentViewRecords().length - 1;
                        const lastRow: Element = this.parent.getRowByIndex(rowIndex);
                        islastRowIndex = trElement && lastRow && lastRow.getAttribute('data-uid') === trElement.getAttribute('data-uid') &&
                            lastRow.getAttribute('data-uid') !== this.startedRow.getAttribute('data-uid');
                        if (this.isNewRowAdded() && this.parent.editSettings.newRowPosition === 'Bottom') {
                            islastRowIndex = false;
                        }
                    }
                    if (islastRowIndex && !this.parent.rowDropSettings.targetID) {
                        const bottomborder: HTMLElement = this.parent.createElement('div', { className: 'e-lastrow-dragborder' });
                        const gridcontentEle: Element = this.parent.getContent();
                        bottomborder.style.width = (this.parent.element as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
                        if (this.parent.enableVirtualization) {
                            bottomborder.style.zIndex = '1';
                        }
                        if (!gridcontentEle.getElementsByClassName('e-lastrow-dragborder').length &&
                            (!(gObj.allowGrouping && gObj.groupSettings.columns.length) || isNullOrUndefined(trElement.nextSibling))) {
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
                const groupSelector: string = '.e-rowcell:not(.e-hide),.e-rowdragdrop:not(.e-hide),.e-detailrowcollapse:not(.e-hide)';
                let rowElement: HTMLElement[] = [];
                if (this.parent.allowGrouping && this.parent.groupSettings.columns && this.parent.groupSettings.columns.length) {
                    rowElement = [].slice.call(this.isDropGrid.getRowByIndex(rowIndex).querySelectorAll(groupSelector));
                } else {
                    rowElement = [].slice.call(this.isDropGrid.getRowByIndex(rowIndex).querySelectorAll(selector));
                }
                if (rowElement.length > 0) {
                    if (this.parent.allowGrouping && this.parent.groupSettings.columns && this.parent.groupSettings.columns.length) {
                        this.groupRowDDIndicator(rowElement, true);
                    } else {
                        addRemoveActiveClasses(rowElement, true, 'e-dragborder');
                    }
                }
            }
        }
    }

    private isNewRowAdded(): boolean {
        return this.parent.editSettings && this.parent.editSettings.showAddNewRow &&
            !(this.parent.enableInfiniteScrolling || this.parent.enableVirtualization);
    }

    private groupRowDDIndicator(rowElement: HTMLElement[], isAdd: boolean): void {
        addRemoveActiveClasses([rowElement[0]], isAdd, 'e-dragleft');
        addRemoveActiveClasses(rowElement, isAdd, 'e-dragtop', 'e-dragbottom');
        addRemoveActiveClasses([rowElement[rowElement.length - 1]], isAdd, 'e-dragright');
    }

    private dragStop: Function = (e: { target: HTMLTableRowElement, event: MouseEventArgs, helper: Element }) => {
        if (this.parent.isCheckBoxSelection && this.parent.enableInfiniteScrolling) {
            window.getSelection().removeAllRanges();
        }
        document.body.classList.remove('e-prevent-select');
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
        if (gObj.enableVirtualization && isNullOrUndefined(this.rows[0])) {
            return;
        }
        const args: RowDropEventArgs = {
            target: target, draggableType: 'rows',
            cancel: false,
            fromIndex: parseInt(this.rows[0].getAttribute(literals.ariaRowIndex), 10) - 1,
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
                    this.reorderRows([parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10) - 1], this.dragTarget);
                }
                this.dragTarget = null;
                if (!gObj.rowDropSettings.targetID) {
                    if (e.helper.classList.contains('e-cloneproperties') && document.querySelector('.' + e.helper.classList[0])) {
                        remove(e.helper);
                    }
                    if (gObj.enableVirtualization && !gObj.sortSettings.columns.length && !gObj.filterSettings.columns.length &&
                        (!this.parent.allowGrouping || !gObj.groupSettings.columns.length)) {
                        gObj.refresh();
                        (<{ startIndex?: number }>(<{ vgenerator?: Function }>gObj.contentModule).vgenerator).startIndex = null;
                    } else {
                        this.rowOrder(args);
                    }
                }
                if (this.parent.getContentTable().scrollHeight < this.parent.getContent().clientHeight) {
                    this.parent.scrollModule.setLastRowCell();
                }
            }
            this.isRefresh = true;
        });
    }
    private refreshRow(args: RowDropEventArgs, tbody: Element, target: Element): void {
        const gObj: IGrid = this.parent;
        const tbodyContent: Element = gObj.getContentTable().querySelector( literals.tbody);
        const tbodyHeader: Element = gObj.getHeaderTable().querySelector( literals.tbody);
        for (let i: number = 0, len: number = args.rows.length; i < len; i++) {
            const row: Element = args.rows[parseInt(i.toString(), 10)];
            if (((gObj.enableVirtualization && gObj.allowGrouping && gObj.groupSettings.columns.length) ||
                (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache)) &&
                args.rows.length === 1) {
                const removeElem: Element = gObj.getRowElementByUID(row.getAttribute('data-uid'));
                if (!isNullOrUndefined(removeElem)) {
                    remove(removeElem);
                }
            }
            const dragstartrow: HTMLElement = row.querySelector('.e-dragstartrow');
            if (dragstartrow) {
                dragstartrow.classList.remove('e-dragstartrow');
            }
            tbody.insertBefore(row, target);
            if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
                const dragRowUid: string = row.getAttribute('data-uid');
                const dropRowUid: string = args.target.parentElement.getAttribute('data-uid');
                const dragRowObject: Row<Column> = gObj.getRowObjectFromUID(dragRowUid);
                const dropRowObject: Row<Column> = gObj.getRowObjectFromUID(dropRowUid);
                if (dragRowObject.parentUid !== dropRowObject.parentUid) {
                    gObj['groupModule'].groupReorderHandler(dragRowObject, dropRowObject);
                }
            }
        }
        const tr: HTMLTableRowElement[] = [].slice.call(gObj.editSettings.showAddNewRow ?
            tbody.querySelectorAll('.e-row:not(.e-addedrow)') : tbody.getElementsByClassName(literals.row));
        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            if (gObj.groupSettings.enableLazyLoading || (gObj.enableInfiniteScrolling &&
                gObj.infiniteScrollSettings.enableCache && tr.length > gObj.pageSettings.pageSize * 3)) {
                gObj.refresh();
            } else {
                groupReorderRowObject(this.parent, args, tr);
                if (gObj.enableVirtualization || (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache)) {
                    resetCachedRowIndex(gObj);
                } else {
                    resetRowIndex(this.parent, gObj.getRowsObject().filter((data: Row<Column>) => data.isDataRow), tr);
                }
                this.parent.notify(events.refreshExpandandCollapse, {
                    rows: gObj.enableVirtualization ? this.parent.vRows : this.parent.getRowsObject()
                });
            }
        } else if (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache &&
            !gObj.groupSettings.columns.length) {
            if (tr.length > gObj.pageSettings.pageSize * 3) {
                gObj.refresh();
            } else {
                groupReorderRowObject(this.parent, args, tr);
                resetCachedRowIndex(gObj);
            }
        }
        else {
            this.refreshData(tr);
        }
        if (this.parent.frozenRows) {
            for (let i: number = 0, len: number = tr.length; i < len; i++) {
                if (i < this.parent.frozenRows) {
                    tbodyHeader.appendChild(tr[parseInt(i.toString(), 10)]);
                } else {
                    tbodyContent.appendChild(tr[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    private updateFrozenRowreOrder(args: RowDropEventArgs): void {
        const gObj: IGrid = this.parent;
        const tbodyC: Element = gObj.getContentTable().querySelector( literals.tbody);
        const tbodyH: Element = gObj.getHeaderTable().querySelector( literals.tbody);
        const tr: HTMLTableRowElement[] = [].slice.call(tbodyH.getElementsByClassName(literals.row)).concat(
            [].slice.call(tbodyC.getElementsByClassName(literals.row)));
        const tbody: Element = gObj.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });
        if (!gObj.selectionSettings.persistSelection && Object.keys(gObj.selectionModule.selectedRowState).length === 0) {
            this.parent.clearSelection();
        } else {
            this.parent.clearRowSelection();
        }
        const targetRow: Element = this.refreshRowTarget(args);
        for (let i: number = 0, len: number = tr.length; i < len; i++) {
            tbody.appendChild(tr[parseInt(i.toString(), 10)]);
        }
        this.refreshRow(args, tbody, targetRow);
    }

    private refreshRowTarget( args: RowDropEventArgs): Element {
        const gObj: IGrid = this.parent;
        let targetIdx: number = parseInt(args.target.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
        if (gObj.enableVirtualization && gObj.allowGrouping && gObj.groupSettings.columns.length) {
            targetIdx = this.parent.getDataRows().indexOf(args.target.parentElement);
        }
        if ((args.fromIndex < args.dropIndex || args.fromIndex === args.dropIndex) && (!gObj.allowGrouping ||
            !gObj.groupSettings.columns.length)) {
            targetIdx = targetIdx + 1;
        }
        let targetTR: Element = gObj.getRowByIndex(targetIdx);
        if (targetIdx === gObj.getRows().length && this.isNewRowAdded() && this.parent.editSettings.newRowPosition === 'Bottom') {
            targetTR = this.parent.element.querySelector('.e-row.e-addedrow');
        }
        const tr: Element = gObj.allowGrouping && gObj.groupSettings.columns.length && targetIdx !== -1 &&
            args.fromIndex < args.dropIndex && targetTR ? (targetTR.nextSibling as Element) : targetTR;
        return tr;
    }

    private updateFrozenColumnreOrder(args: RowDropEventArgs): void {
        const gObj: IGrid = this.parent;
        const tbody: Element = gObj.getContentTable().querySelector( literals.tbody);
        if (!gObj.selectionSettings.persistSelection && Object.keys(gObj.selectionModule.selectedRowState).length === 0) {
            this.parent.clearSelection();
        } else {
            this.parent.clearRowSelection();
        }
        const targetRow: Element = this.refreshRowTarget(args);
        this.refreshRow(args, tbody, targetRow);
    }

    private refreshData(tr: HTMLTableRowElement[]): void {
        const rowObj: object = {};
        const recordobj: object = {};
        const rowObjects: Row<Column>[] = this.parent.getRowsObject();
        const currentViewData: Object[] = this.parent.getCurrentViewRecords();
        for (let i: number = 0, len: number = tr.length; i < len; i++) {
            const index: number = parseInt(tr[parseInt(i.toString(), 10)].getAttribute(literals.ariaRowIndex), 10) - 1;
            rowObj[parseInt(i.toString(), 10)] = rowObjects[parseInt(index.toString(), 10)];
            recordobj[parseInt(i.toString(), 10)] = currentViewData[parseInt(index.toString(), 10)];
        }
        const rows: Element[] = this.parent.getRows();
        for (let i: number = 0, len: number = tr.length; i < len; i++) {
            rows[parseInt(i.toString(), 10)] = tr[parseInt(i.toString(), 10)];
            rowObjects[parseInt(i.toString(), 10)] = rowObj[parseInt(i.toString(), 10)];
            currentViewData[parseInt(i.toString(), 10)] = recordobj[parseInt(i.toString(), 10)];
        }
        resetRowIndex(this.parent, rowObjects, tr);
    }

    private rowOrder(args: RowDropEventArgs): void {
        if (args.dropIndex === args.fromIndex || isNaN(args.dropIndex) || parentsUntil(args.target, 'e-groupcaption')) {
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
                if (!rowObjects[parseInt(i.toString(), 10)]) {
                    break;
                }
                if (rowObjects[parseInt(i.toString(), 10)].isDetailRow) {
                    this.parent.getRowsObject().splice(i, 1);
                    i--;
                }
            }
        }
        if (args.target.classList.contains('e-rowcelldrag') || args.target.classList.contains('e-dtdiagonalright')
            || args.target.classList.contains('e-dtdiagonaldown') ) {
            args.target = args.target.parentElement;
        }
        if (!args.target.classList.contains('e-rowcell') && parentsUntil(args.target, 'e-rowcell')) {
            args.target = parentsUntil(args.target, 'e-rowcell');
        }
        if (this.parent.frozenRows) {
            this.updateFrozenRowreOrder(args);
        } else {
            this.updateFrozenColumnreOrder(args);
        }
        if ((!this.parent.allowGrouping || !this.parent.groupSettings.columns.length) && this.selectedRowColls.length > 0) {
            this.parent.selectRows(this.selectedRowColls);
            const indexes: number[] = [];
            if (this.parent.filterSettings.columns.length || this.parent.sortSettings.columns.length) {
                for (let i: number = 0, len: number = args.rows.length; i < len; i++) {
                    indexes.push(parseInt(args.rows[parseInt(i.toString(), 10)].getAttribute(literals.ariaRowIndex), 10) - 1);
                }
                this.selectedRowColls = indexes;
            }
            this.selectedRowColls = [];
        } else {
            this.selectedRowColls = [];
        }
    }

    private currentViewData(): object[] {
        const selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
        const currentVdata: object[] = [];
        const fromIdx: number = parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10) - 1;
        for (let i: number = 0, n: number = selectedIndexes.length; i < n; i++) {
            const currentV: string = 'currentViewData';
            currentVdata[parseInt(i.toString(), 10)] = this.parent[`${currentV}`][selectedIndexes[parseInt(i.toString(), 10)]];
        }
        if (!this.parent.rowDropSettings.targetID && selectedIndexes.length === 0) {
            currentVdata[0] = this.parent.currentViewData[parseInt(fromIdx.toString(), 10)];
        }
        return currentVdata;
    }

    // private saveChange(changeRecords: object, query: Query): void {
    //     this.parent.getDataModule().saveChanges(changeRecords, this.parent.getPrimaryKeyFieldNames()[0], {}, query)
    //         .then(() => {
    //             this.parent.notify(events.modelChanged, {
    //                 type: events.actionBegin, requestType: 'rowdraganddrop'
    //             });
    //         }).catch((e: Error) => {
    //             const error: string = 'error';
    //             const message: string = 'message';
    //             if (!isNullOrUndefined(e[`${error}`]) && !isNullOrUndefined(e[`${error}`][`${message}`])) {
    //                 e[`${error}`] = e[`${error}`][`${message}`];
    //             }
    //             this.parent.trigger(events.actionFailure, e);
    //         });
    // }

    public reorderRows(fromIndexes: number[], toIndex: number): void {
        const selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
        const selectedRecords: object[] = [];
        const draggedRecords: object[] = [];
        const currentViewData: Object[] = this.parent.getDataModule().isRemote() ? this.parent.getCurrentViewRecords() :
            this.parent.renderModule.data.dataManager.dataSource.json;
        const skip: number = this.parent.allowPaging ?
            (this.parent.pageSettings.currentPage * this.parent.pageSettings.pageSize) - this.parent.pageSettings.pageSize : 0;
        let dropIdx: number = toIndex + skip;
        let actualIdx: number = fromIndexes[0] + skip;
        for (let i: number = 0, len: number = fromIndexes.length; i < len; i++) {
            draggedRecords[parseInt(i.toString(), 10)] = currentViewData[fromIndexes[parseInt(i.toString(), 10)] + skip];
        }
        for (let i: number = 0, len: number = selectedIndexes.length; i < len; i++) {
            selectedRecords[parseInt(i.toString(), 10)] = currentViewData[selectedIndexes[parseInt(i.toString(), 10)] + skip];
        }
        for (let i: number = 0, len: number = draggedRecords.length; i < len; i++) {
            if (i !== 0) {
                for (let j: number = 0, len1: number = currentViewData.length; j < len1; j++) {
                    if (JSON.stringify(currentViewData[parseInt(j.toString(), 10)]) ===
                        JSON.stringify(draggedRecords[parseInt(i.toString(), 10)])) {
                        actualIdx = j;
                        break;
                    }
                }
                for (let j: number = 0, len1: number = currentViewData.length; j < len1; j++) {
                    if (JSON.stringify(
                        currentViewData[parseInt(j.toString(), 10)]) === JSON
                        .stringify(draggedRecords[i - 1])) {
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
                    currentViewData[parseInt(j.toString(), 10)]) === JSON
                    .stringify(selectedRecords[parseInt(i.toString(), 10)])) {
                    selectedIndexes[parseInt(i.toString(), 10)] = j - skip;
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
        this.parent.on(events.rowDragAndDropComplete, this.onActionComplete, this);
        this.onDataBoundFn = this.onDataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.onDataBoundFn);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    /**
     * To trigger action complete event.
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete, requestType: 'rowdraganddrop' }));
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
            isReplaceDragEle: this.isReplaceDragEle,
            isPreventSelect: false,
            isPreventScroll: true
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
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        if (this.parent.element.classList.contains('e-childgrid')) {
            const parentGrid: Element = this.getParentGrid(this.parent.element);
            cloneElement = parentGrid.querySelector('.e-cloneproperties') as HTMLElement;
        }
        const element: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        if (parentsUntil(element, 'e-grid') &&
            ((!this.parent.rowDropSettings.targetID &&
            parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(element, 'e-grid').id) || this.istargetGrid)) {
            let targetElement: HTMLTableRowElement = element;
            if (!element) {
                targetElement = startedRow;
            }
            this.setBorder(targetElement, e.event, startedRow, targetRow);
        }
    }

    private setBorder(element: Element, event: MouseEventArgs, startedRow: HTMLTableRowElement, targetRow: HTMLTableRowElement): void {
        let node: Element = this.parent.element as Element;
        if (this.istargetGrid) {
            node = this.isDropGrid.element as Element;
        }
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            this.removeBorder(element);
        }
        else {
            this.removeFirstRowBorder(element);
            this.removeLastRowBorder(element);
        }
        if (parentsUntil(element, 'e-grid') && element.classList.contains(literals.row) && ((!this.parent.rowDropSettings.targetID &&
            parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(element, 'e-grid').id) || this.istargetGrid)) {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns && this.parent.groupSettings.columns.length) {
                removeClass(node.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'), ['e-dragtop', 'e-dragright',
                    'e-dragbottom', 'e-dragleft']);
            } else {
                removeClass(node.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'), ['e-dragborder']);
            }
            let rowElement: HTMLElement[] = [];
            let targetRowIndex: number = parseInt(targetRow.getAttribute(literals.ariaRowIndex), 10) - 1;
            if (targetRow && targetRowIndex === 0 &&
                !(this.isNewRowAdded() && this.parent.editSettings.newRowPosition === 'Top')) {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    element = targetRow;
                    rowElement = [].slice.call(element
                        .querySelectorAll('.e-groupcaption,.e-summarycell,.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
                }
                else {
                    const div: HTMLElement = this.parent.createElement('div', { className: 'e-firstrow-dragborder' });
                    const gridheaderEle: Element = this.isDropGrid.getHeaderContent();
                    gridheaderEle.classList.add('e-grid-relative');

                    div.style.width = (node as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
                    if (!gridheaderEle.getElementsByClassName('e-firstrow-dragborder').length) {
                        if (this.parent.frozenRows) {
                            if (this.parent.isFrozenGrid()) {
                                div.style.width = (this.parent.getContent().firstElementChild as HTMLElement).scrollWidth + 'px';
                            }
                            gridheaderEle.querySelector('thead').appendChild(div);
                            div.style.position = 'relative';
                        } else {
                            gridheaderEle.appendChild(div);
                        }
                    }
                }
            } else if (this.parent.rowDropSettings.targetID && targetRow) {
                element = this.isDropGrid.getRowByIndex(targetRowIndex - 1);
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            } else if (targetRow && parseInt(startedRow.getAttribute(literals.ariaRowIndex), 10) - 1 > targetRowIndex) {
                if (this.parent.enableVirtualization && this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    targetRowIndex = this.parent.getDataRows().indexOf(targetRow);
                }
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    element = targetRow;
                    rowElement = [].slice.call(element
                        .querySelectorAll(`.e-groupcaption,.e-summarycell,.e-rowcell:not(.e-hide),.e-rowdragdrop:not(.e-hide),
                        .e-detailrowcollapse:not(.e-hide)`));
                }
                else {
                    if (targetRowIndex === 0 && this.isNewRowAdded() && this.parent.editSettings.newRowPosition === 'Top') {
                        element = this.parent.element.querySelector('.e-row.e-addedrow tr');
                    } else {
                        element = this.parent.getRowByIndex(targetRowIndex - 1);
                    }
                    rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse,.e-dragindentcell'));
                }
            } else { rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')); }

            if (rowElement.length > 0) {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns && this.parent.groupSettings.columns.length) {
                    this.groupRowDDIndicator(rowElement, true);
                } else {
                    addRemoveActiveClasses(rowElement, true, 'e-dragborder');
                }
            }
        }
    }

    private getScrollWidth(): number {
        const scrollElem: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }

    private removeFirstRowBorder(element: Element): void {
        if (this.isDropGrid.element.getElementsByClassName('e-firstrow-dragborder').length > 0 && element &&
            ((element as HTMLTableRowElement).rowIndex !== 0 || element.classList.contains('e-columnheader'))) {
            remove(this.isDropGrid.element.getElementsByClassName('e-firstrow-dragborder')[0]);
        } else {
            const addNewRow: HTMLElement = this.parent.element.querySelector('.e-row.e-addedrow tr');
            if (addNewRow && addNewRow.querySelector('.e-dragborder')) {
                const rowElement: HTMLElement[] = [].slice.call(addNewRow.
                    querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse,.e-dragindentcell'));
                addRemoveActiveClasses(rowElement, false, 'e-dragborder');
            }
        }
    }

    private removeLastRowBorder(element: Element): void {
        let islastRowIndex: boolean;
        if (this.parent.enableVirtualization) {
            islastRowIndex = element && parseInt(element.getAttribute(literals.ariaRowIndex), 10) - 1 !==
                this.parent.renderModule.data.dataManager.dataSource.json.length - 1;
        } else {
            const rowIndex: number = this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache &&
                !this.parent.groupSettings.enableLazyLoading ?
                this.parent.pageSettings.currentPage * this.parent.pageSettings.pageSize - 1 :
                this.parent.getCurrentViewRecords().length - 1;
            const lastRow: Element = this.parent.getRowByIndex(rowIndex);
            islastRowIndex = element && lastRow && lastRow.getAttribute('data-uid') !== element.getAttribute('data-uid');
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
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            element = ([].slice.call(this.isDropGrid.getContentTable().querySelectorAll('tr'))).filter((row: Element) =>
                row.querySelector('td.e-dragtop.e-dragbottom'))[0];
        }
        else {
            element = (this.isDropGrid.getRows()).filter((row: Element) => row.querySelector('td.e-dragborder'))[0];
        }
        if (element) {
            const rowElement: HTMLElement[] = this.parent.allowGrouping && this.parent.groupSettings.columns.length ? [].slice.call(element
                .querySelectorAll('.e-dragtop.e-dragbottom')) : [].slice.call(element.getElementsByClassName('e-dragborder'));
            if (this.parent.allowGrouping && this.parent.groupSettings.columns && this.parent.groupSettings.columns.length) {
                this.groupRowDDIndicator(rowElement, false);
            } else {
                addRemoveActiveClasses(rowElement, false, 'e-dragborder');
            }
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
        if (this.selectedRowColls.length > 0 && (this.parent.enableVirtualization || this.parent.allowRowDragAndDrop)) {
            this.parent.selectRows(this.selectedRowColls);
            this.selectedRowColls = [];
        }
    }

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute(literals.ariaRowIndex), 10) - 1 : 0;
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
            const dragParentElement: Element = document.querySelector('.e-drag-ref');
            if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
                (e.droppedElement.parentElement.id === gObj.element.id || (dragParentElement
                && dragParentElement.parentElement.id === gObj.element.id)))
                || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                    e.droppedElement.parentElement.id !== gObj.element.id)) {
                return;
            }
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                if (dragParentElement) {
                    srcControl = (<EJ2Intance>dragParentElement.parentElement).ej2_instances[0];
                    remove(dragParentElement);
                } else {
                    srcControl = (<EJ2Intance>e.droppedElement.parentElement).ej2_instances[0];
                }
            } else if (this.isSingleRowDragDrop || e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true') {
                this.singleRowDrop(e);
                return;
            }
            if (srcControl.element.id !== gObj.element.id && srcControl.rowDropSettings.targetID !== gObj.element.id) {
                return;
            }
            const records: Object[] = srcControl.getSelectedRecords();
            let targetIndex: number = currentIndex = this.getTargetIdx(targetRow);
            if (e.target && e.target.classList.contains('e-content') && gObj.getCurrentViewRecords().length) {
                const lastrow: Element = gObj.getContentTable().querySelector('tr:last-child');
                if (lastrow) {
                    targetIndex = currentIndex = parseInt(lastrow.getAttribute(literals.ariaRowIndex), 10);
                }
            }
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
                this.selectedRows.push(skip + selectedRows[parseInt(i.toString(), 10)]);
            }
            srcControl.notify(events.rowsRemoved, { indexes: this.selectedRows, records: records });
            if (srcControl.dataSource instanceof DataManager && srcControl.dataSource.dataSource.offline) {
                srcControl.notify(events.modelChanged, {
                    type: events.actionBegin, requestType: 'rowdraganddrop'
                });
            }
        }
    }

    private reorderRow(fromIndexes: number, toIndex: number): void {
        const gObj: IGrid = this.parent;
        if (!gObj.groupSettings.columns.length) {
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
        this.parent.off(events.rowDragAndDropComplete, this.onActionComplete);
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
        const dragIdx: number = parseInt(this.startedRow.getAttribute(literals.ariaRowIndex), 10) - 1;
        if ((gObj.getSelectedRecords().length > 0 && this.startedRow.cells[0].classList.contains('e-selectionbackground') === false)
            || gObj.getSelectedRecords().length === 0) {
            if (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache) {
                this.rows = [this.startedRow];
            } else {
                this.rows = [gObj.getRowByIndex(dragIdx)];
            }
            this.rowData = [gObj.getRowInfo((this.startedRow).querySelector('.' + literals.rowCell)).rowData];
            if ((gObj.enableVirtualization || (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache))
                && gObj.allowGrouping && gObj.groupSettings.columns.length && gObj.getSelectedRows().length) {
                this.rows = gObj.getSelectedRows();
                this.rowData = Array.from(this.rows, (row: Element) => gObj.getRowObjectFromUID(row.getAttribute('data-uid')).data);
            }
        } else {
            this.rows = gObj.getSelectedRows();
            this.rowData = Array.from(this.rows, (row: Element) => gObj.getRowObjectFromUID(row.getAttribute('data-uid')).data);
        }
    }
}
