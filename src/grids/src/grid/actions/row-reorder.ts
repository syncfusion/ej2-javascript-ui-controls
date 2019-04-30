import { MouseEventArgs, Draggable } from '@syncfusion/ej2-base';
import { removeClass } from '@syncfusion/ej2-base';
import { remove, closest as closestElement, classList } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EJ2Intance, IPosition, RowDragEventArgs } from '../base/interface';
import { parentsUntil, removeElement, getPosition, addRemoveActiveClasses } from '../base/util';
import * as events from '../base/constant';
import { Column } from '../models/column';
import { Scroll } from '../actions/scroll';
import { RowDropEventArgs } from '../base/interface';

/**
 * 
 * Reorder module is used to handle row reordering.
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

    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    private helper: Function = (e: { sender: MouseEventArgs }) => {
        let gObj: IGrid = this.parent;
        let target: Element = e.sender.target as Element;
        let visualElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
            styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
        });
        let table: Element = this.parent.createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
        let tbody: Element = this.parent.createElement('tbody');

        if (document.getElementsByClassName('e-griddragarea').length ||
            (gObj.rowDropSettings.targetID && (!(e.sender.target as Element).classList.contains('e-selectionbackground')
                && gObj.selectionSettings.type !== 'Single')) ||
            (!gObj.rowDropSettings.targetID && !parentsUntil(e.sender.target as Element, 'e-rowdragdrop'))) {
            return false;
        }
        if (gObj.rowDropSettings.targetID &&
            gObj.selectionSettings.mode === 'Row' && gObj.selectionSettings.type === 'Single') {
            gObj.selectRow(parseInt((e.sender.target as Element).parentElement.getAttribute('aria-rowindex'), 10));
        }
        this.startedRow = closestElement(target as Element, 'tr').cloneNode(true) as HTMLTableRowElement;
        this.processArgs(target);
        let args: Object = {
            selectedRow: this.rows, dragelement: target,
            cloneElement: visualElement, cancel: false, data: this.rowData
        };
        let selectedRows: Element[] = gObj.getSelectedRows();
        gObj.trigger(events.rowDragStartHelper, args);
        let cancel: string = 'cancel';
        let cloneElement: string = 'cloneElement';
        if (args[cancel]) {
            visualElement = args[cloneElement];
            return visualElement;
        }

        removeElement(this.startedRow, '.e-indentcell');
        removeElement(this.startedRow, '.e-detailrowcollapse');
        removeElement(this.startedRow, '.e-detailrowexpand');
        this.removeCell(this.startedRow, 'e-gridchkbox');
        let exp: RegExp = new RegExp('e-active', 'g'); //high contrast issue
        this.startedRow.innerHTML = this.startedRow.innerHTML.replace(exp, '');
        tbody.appendChild(this.startedRow);

        if (gObj.getSelectedRows().length > 1) {
            let dropCountEle: HTMLElement = this.parent.createElement('span', {
                className: 'e-dropitemscount', innerHTML: '' + selectedRows.length,
            });
            visualElement.appendChild(dropCountEle);
        }
        let ele: Element = closestElement(target as Element, 'tr').querySelector('.e-icon-rowdragicon');
        if (ele) {
            ele.classList.add('e-dragstartrow');
        }
        table.appendChild(tbody);
        visualElement.appendChild(table);
        gObj.element.appendChild(visualElement);
        return visualElement;
    }

    private dragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        let gObj: IGrid = this.parent;
        if (document.getElementsByClassName('e-griddragarea').length) {
            return;
        }

        let target: Element = e.target;
        const spanCssEle: HTMLSpanElement = this.parent.element.querySelector('.e-dropitemscount') as HTMLSpanElement;
        if (this.parent.getSelectedRecords().length > 1 && spanCssEle) {
            spanCssEle.style.left = (this.parent.element.querySelector('.e-cloneproperties table') as HTMLTableRowElement)
                .offsetWidth - 5 + 'px';
        }

        this.processArgs(target);
        gObj.trigger(events.rowDragStart, {
            rows: this.rows,
            target: e.target, draggableType: 'rows', fromIndex: parseInt(this.rows[0].getAttribute('aria-rowindex'), 10),
            data: this.rowData
        });
        this.dragStartData = this.rowData;
        let dropElem: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances &&
            (<{getModuleName?: Function}>dropElem.ej2_instances[0]).getModuleName() === 'grid') {
             dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
         }
    }

    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        let gObj: IGrid = this.parent;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        let target: Element = this.getElementFromPosition(cloneElement, e.event);
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur', 'e-movecur']);

        this.isOverflowBorder = true;
        this.hoverState = gObj.enableHover;
        let trElement: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        gObj.enableHover = false;
        if (!e.target) { return; }

        this.processArgs(target);
        let args: RowDragEventArgs = {
            rows: this.rows, target: target, draggableType: 'rows',
            data: this.rowData as Object[], originalEvent: e, cancel: false
        };
        gObj.trigger(events.rowDrag, args );
        this.stopTimer();
        if (args.cancel) { return; }
        gObj.element.classList.add('e-rowdrag');
        this.dragTarget = trElement && parentsUntil(target, 'e-grid').id === cloneElement.parentElement.id ?
            trElement.rowIndex : parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);

        if (gObj.rowDropSettings.targetID) {
            if (!parentsUntil(target, 'e-gridcontent') ||
                parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            }
        } else {
            let elem: Element = parentsUntil(target, 'e-grid');
            if (elem && elem.id === cloneElement.parentElement.id) {
                classList(cloneElement, ['e-movecur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
            }
        }

        if (!gObj.rowDropSettings.targetID &&
            (!gObj.groupSettings.columns.length || e.target.classList.contains('e-selectionbackground'))) {
            if (parentsUntil(target, 'e-grid')) {
                this.updateScrollPostion(e.event, target);
            }
            if (this.isOverflowBorder && parseInt(this.startedRow.getAttribute('aria-rowindex'), 10) !== this.dragTarget) {
                this.moveDragRows(e, this.startedRow, trElement);
            } else {
                if (trElement && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') ===
                    trElement.getAttribute('data-uid')) {
                    let bottomborder: HTMLElement = this.parent.createElement('div', { className: 'e-lastrow-dragborder' });
                    let gridcontentEle: Element = this.parent.getContent();
                    bottomborder.style.width = (this.parent.element as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
                    if (!gridcontentEle.querySelectorAll('.e-lastrow-dragborder').length) {
                        gridcontentEle.classList.add('e-grid-relative');
                        gridcontentEle.appendChild(bottomborder);
                        bottomborder.style.bottom = this.getScrollWidth() + 'px';
                    }
                }
                this.removeBorder(trElement);
            }
        }
    }

    private dragStop: Function = (e: { target: HTMLTableRowElement, event: MouseEventArgs, helper: Element }) => {
        let gObj: IGrid = this.parent; if (this.parent.isDestroyed) { return; }
        let targetEle: Element = this.getElementFromPosition(e.helper as HTMLElement, e.event);
        let target: Element = targetEle ? targetEle : e.target;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        gObj.element.classList.remove('e-rowdrag');
        let dropElement: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElement && dropElement.ej2_instances &&
            (<{getModuleName?: Function}>dropElement.ej2_instances[0]).getModuleName() === 'grid') {
                dropElement.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
        }

        if (gObj.isRowDragable()) {
            this.stopTimer();
            gObj.enableHover = this.hoverState;
            this.parent.getContent().classList.remove('e-grid-relative');
            this.removeBorder(targetEle);
            let stRow: Element = gObj.element.querySelector('.e-dragstartrow');
            if (stRow) {
                stRow.classList.remove('e-dragstartrow');
            }
        }
        this.processArgs(target);
        let args: RowDropEventArgs = {
            target: target, draggableType: 'rows',
            cancel: false,
            fromIndex: parseInt(this.rows[0].getAttribute('aria-rowindex'), 10),
            dropIndex: this.dragTarget,
            rows: this.rows, data: this.dragStartData as Object[]
        };
        gObj.trigger(events.rowDrop, args);

        if (!parentsUntil(target, 'e-gridcontent') || args.cancel) {
            this.dragTarget = null;
            remove(e.helper);
            return;
        }
        this.isRefresh = false;
        let selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
        if (gObj.isRowDragable()) {
            if (!this.parent.rowDropSettings.targetID &&
                this.startedRow.querySelector('td.e-selectionbackground') && selectedIndexes.length > 1 &&
                selectedIndexes.length !== this.parent.getCurrentViewRecords().length) {
                this.reorderRows(selectedIndexes, args.dropIndex);
            } else {
                this.reorderRows([parseInt(this.startedRow.getAttribute('aria-rowindex'), 10)], this.dragTarget);
            }
            this.dragTarget = null;
            if (!gObj.rowDropSettings.targetID) {
                remove(e.helper);
                gObj.refresh();
            }
        }
        this.isRefresh = true;
    }

    public reorderRows(fromIndexes: number[], toIndex: number): void {
        let selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
        let selectedRecords: object[] = [];
        let draggedRecords: object[] = [];
        let currentViewData: Object[] = this.parent.renderModule.data.dataManager.dataSource.json;
        let dropIdx: number = toIndex;
        let actualIdx: number = fromIndexes[0];
        for (let i: number = 0, len: number = fromIndexes.length; i < len; i++) {
            draggedRecords[i] = currentViewData[fromIndexes[i]];
        }
        for (let i: number = 0, len: number = selectedIndexes.length; i < len; i++) {
            selectedRecords[i] = currentViewData[selectedIndexes[i]];
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
            this.reorderRow(actualIdx, dropIdx);
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
                    selectedIndexes[i] = j;
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
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private initializeDrag(): void {
        let gObj: IGrid = this.parent;
        let column: Column;
        let drag: Draggable;
        drag = new Draggable(gObj.getContent() as HTMLElement, {
            dragTarget: '.e-rowcelldrag, .e-rowdragdrop, .e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });
    }

    private updateScrollPostion(e: MouseEvent | TouchEvent, target: Element): void {
        let frzCols: number = this.parent.getFrozenColumns();
        let y: number = getPosition(e).y;
        let cliRect: ClientRect = this.parent.getContent().getBoundingClientRect();
        let rowHeight: number = this.parent.getRowHeight() - 15;
        let scrollElem: Element = frzCols ? this.parent.getContent().querySelector('.e-movablecontent')
            : this.parent.getContent().firstElementChild;
        if (cliRect.top + rowHeight >= y) {
            let scrollPixel: number = -(this.parent.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(
                () => { this.setScrollDown(scrollElem, scrollPixel, true); }, 200);
        } else if (cliRect.top + this.parent.getContent().clientHeight - rowHeight - 33 <= y) {
            let scrollPixel: number = (this.parent.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(
                () => { this.setScrollDown(scrollElem, scrollPixel, true); }, 200);
        }
    }

    private setScrollDown(scrollElem: Element, scrollPixel: number, isLeft: boolean): void {
        scrollElem.scrollTop = scrollElem.scrollTop + scrollPixel;
    }

    private moveDragRows(e: { target: HTMLElement, event: MouseEventArgs }, startedRow: HTMLTableRowElement, targetRow: HTMLTableRowElement)
        : void {
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        let element: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        if (parentsUntil(element, 'e-gridcontent') && parentsUntil(cloneElement.parentElement, 'e-grid').id ===
            parentsUntil(element, 'e-grid').id) {
            let targetElement: HTMLTableRowElement = element ?
                element : this.startedRow;
            this.setBorder(targetElement, e.event, startedRow, targetRow);
        }
    }

    private setBorder(element: Element, event: MouseEventArgs, startedRow: HTMLTableRowElement, targetRow: HTMLTableRowElement): void {
        let node: Element = this.parent.element as Element;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        if (parentsUntil(element, 'e-gridcontent') && parentsUntil(cloneElement.parentElement, 'e-grid').id ===
            parentsUntil(element, 'e-grid').id) {
            removeClass(node.querySelectorAll('.e-rowcell,.e-rowdragdrop'), ['e-dragborder']);
            let rowElement: HTMLElement[] = [];
            if (targetRow && targetRow.rowIndex === 0) {
                let div: HTMLElement = this.parent.createElement('div', { className: 'e-firstrow-dragborder' });
                let gridheaderEle: Element = this.parent.getHeaderContent();
                gridheaderEle.classList.add('e-grid-relative');

                div.style.width = (node as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
                if (!gridheaderEle.querySelectorAll('.e-firstrow-dragborder').length) {
                    gridheaderEle.appendChild(div);
                }
            } else if (targetRow && parseInt(startedRow.getAttribute('aria-rowindex'), 10) > targetRow.rowIndex) {
                element = this.parent.getRowByIndex(targetRow.rowIndex - 1);
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            } else { rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')); }
            if (rowElement.length > 0) {
                addRemoveActiveClasses(rowElement, true, 'e-dragborder');
            }
        }
    }

    private getScrollWidth(): number {
        let scrollElem: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }

    private removeFirstRowBorder(element: Element): void {
        if (this.parent.element.getElementsByClassName('e-firstrow-dragborder').length > 0 && element &&
            (element as HTMLTableRowElement).rowIndex !== 0) {
            this.parent.element.getElementsByClassName('e-firstrow-dragborder')[0].remove();
        }
    }

    private removeLastRowBorder(element: Element): void {
        let islastRowIndex: boolean = element && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
            element.getAttribute('data-uid');
        if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0 && element && islastRowIndex) {
            this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
        }
    }

    private removeBorder(element: Element): void {
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        element = this.parent.getRows().filter((row: Element) =>
            row.querySelector('td.e-dragborder'))[0];
        if (element) {
            let rowElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-dragborder'));
            addRemoveActiveClasses(rowElement, false, 'e-dragborder');
        }
    }

    private getElementFromPosition(element: HTMLElement, event: MouseEventArgs): Element {
        let target: Element;
        let position: IPosition = getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    }

    private onDataBound(e: NotifyArgs): void {
        if (this.selectedRowColls.length > 0) {
            this.parent.selectRows(this.selectedRowColls);
            this.selectedRowColls = [];
        }
    }

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }

    private singleRowDrop(e: { target: HTMLTableRowElement, droppedElement: HTMLElement }): void {
        let targetRow: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        let currentIndex: number;
        let srcControl: IGrid;
        srcControl = (<EJ2Intance>e.droppedElement.parentElement).ej2_instances[0];
        currentIndex = targetRow ? targetRow.rowIndex : srcControl.currentViewData.length - 1;
        this.reorderRow(this.startedRowIndex, currentIndex);
    }

    private columnDrop(e: { target: HTMLTableRowElement, droppedElement: HTMLElement }): void {
        let gObj: IGrid = this.parent;
        let draggObj: IGrid = (<EJ2Intance>e.droppedElement.parentElement).ej2_instances[0];
        if (e.droppedElement.getAttribute('action') !== 'grouping') {
            let targetRow: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
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
            let records: Object[] = srcControl.getSelectedRecords();
            let targetIndex: number = currentIndex = this.getTargetIdx(targetRow);
            let count: number = 0;
            if (isNaN(targetIndex)) {
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
            let selectedRows: number[] = srcControl.getSelectedRowIndexes();
            let skip: number = srcControl.allowPaging ?
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
        let gObj: IGrid = this.parent;
        if (!gObj.sortSettings.columns.length && !gObj.groupSettings.columns.length && !gObj.filterSettings.columns.length) {
            //Todo: drag and drop mapper & BatchChanges                 
            let skip: number = gObj.allowPaging ?
                (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize : 0;
            let fromIndex: number = fromIndexes;
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
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.parent.off(events.initialEnd, this.initializeDrag);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.removeEventListener(events.dataBound, this.onDataBoundFn);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        //destory ejdrag and drop
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'rowDragAndDrop';
    }
    private processArgs(target: Element): void {
        let gObj: IGrid = this.parent;
        if ((gObj.getSelectedRecords().length > 0 && this.startedRow.cells[0].classList.contains('e-selectionbackground') === false)
         || gObj.getSelectedRecords().length === 0) {
            this.rows = [this.startedRow];
            this.rowData = this.parent.getRowInfo((this.startedRow).querySelector('.e-rowcell')).rowData;
        } else {
            this.rows = gObj.getSelectedRows();
            this.rowData = gObj.getSelectedRecords();
        }

    }
}