import { MouseEventArgs, Droppable, removeClass, Draggable, DropEventArgs, createElement } from '@syncfusion/ej2-base';
import { remove, closest as closestElement, classList, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { parentsUntil, isActionPrevent, getPosition, getScrollBarWidth, removeElement, addRemoveActiveClasses } from './util';
import { SfGrid } from './sf-grid-fn';
import { IPosition } from './interfaces';

/**
 * 
 * Reorder module is used to handle row reordering.
 * @hidden
 */
export class RowDD {
    //Internal variables    
    private startedRow: HTMLTableRowElement;
    private dragTarget: number;
    private timer: number;
    private isOverflowBorder: boolean = true;
    private rowData: Object;
    private dragStartData: Object;
    private draggable: Draggable;
    private droppable: Droppable;

    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    private helper: Function = (e: { sender: MouseEventArgs }) => {
        let gObj: SfGrid = this.parent;
        let target: Element = this.draggable.currentStateTarget as Element;
        (e.sender.target as HTMLElement).blur(); //https://github.com/dotnet/aspnetcore/issues/17926
        let visualElement: HTMLElement = createElement('div', {
            className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
            styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
        });
        let table: Element = createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
        let tbody: Element = createElement('tbody');

        if (document.getElementsByClassName('e-griddragarea').length ||
            (gObj.options.rowDropTarget && (!(e.sender.target as Element).classList.contains('e-selectionbackground')
                && gObj.options.selectionType !== 'Single')) ||
            (!gObj.options.rowDropTarget && !parentsUntil(e.sender.target as Element, 'e-rowdragdrop'))) {
            return false;
        }
        if (gObj.options.rowDropTarget &&
            gObj.options.selectionMode === 'Row' && gObj.options.selectionType === 'Single') {
            gObj.dotNetRef.invokeMethodAsync("SelectRow", parseInt((this.draggable.currentStateTarget as Element).parentElement.getAttribute('aria-rowindex'), 10));
        }
        this.startedRow = closestElement(target as Element, 'tr').cloneNode(true) as HTMLTableRowElement;
        let selectedRows: Element[] = gObj.getSelectedRows();

        removeElement(this.startedRow, '.e-indentcell');
        removeElement(this.startedRow, '.e-detailrowcollapse');
        removeElement(this.startedRow, '.e-detailrowexpand');
        this.removeCell(this.startedRow, 'e-gridchkbox');
        let exp: RegExp = new RegExp('e-active', 'g'); //high contrast issue
        this.startedRow.innerHTML = this.startedRow.innerHTML.replace(exp, '');
        tbody.appendChild(this.startedRow);

        if (gObj.getSelectedRows().length > 1 && this.startedRow.hasAttribute('aria-selected')) {
            let dropCountEle: HTMLElement = createElement('span', {
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

    private dragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs } & BlazorDragEventArgs) => {
        let gObj: SfGrid = this.parent;
        if (document.getElementsByClassName('e-griddragarea').length) {
            return;
        }
        const spanCssEle: HTMLSpanElement = this.parent.element.querySelector('.e-dropitemscount') as HTMLSpanElement;
        if (this.parent.getSelectedRows().length > 1 && spanCssEle) {
            spanCssEle.style.left = (this.parent.element.querySelector('.e-cloneproperties table') as HTMLTableRowElement)
                .offsetWidth - 5 + 'px';
        }
        let fromIdx: number = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
        this.parent.dotNetRef.invokeMethodAsync("RowDragStartEvent", fromIdx);
        e.bindEvents(e.dragElement);
        this.dragStartData = this.rowData;
        let dropElem: any = document.getElementById(gObj.options.rowDropTarget);
        if (gObj.options.rowDropTarget && dropElem && dropElem.blazor__instance &&
            (<{ getModuleName?: Function }>dropElem.blazor__instance).getModuleName() === 'grid') {
            dropElem.blazor__instance.getContent().classList.add('e-allowRowDrop');
        }
    }

    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        let gObj: SfGrid = this.parent;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        let target: Element = this.getElementFromPosition(cloneElement, e.event);
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur', 'e-movecur']);
        this.isOverflowBorder = true;
        let trElement: HTMLTableRowElement = parentsUntil(target, 'e-grid') ? closestElement(e.target, 'tr') as HTMLTableRowElement : null;
        if (!e.target) { return; }
        this.stopTimer();
        gObj.element.classList.add('e-rowdrag');
        this.dragTarget = trElement && parentsUntil(target, 'e-grid').id === cloneElement.parentElement.id ?
            trElement.rowIndex : parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
        if (gObj.options.rowDropTarget) {
            if (parentsUntil(target, 'e-gridcontent')) {
                if (parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                    classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                } else {
                    classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                }
            } else if (parentsUntil(target, 'e-droppable')) {
                classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            }
            else {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        } else {
            let elem: Element = parentsUntil(target, 'e-grid');
            if (elem && elem.id === cloneElement.parentElement.id) {
                classList(cloneElement, ['e-movecur'], ['e-defaultcur']);
            } else {
                classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
            }
        }
        if (!gObj.options.rowDropTarget &&
            (!gObj.options.groupCount || e.target.classList.contains('e-selectionbackground'))) {
            if (parentsUntil(target, 'e-grid')) {
                this.updateScrollPostion(e.event, target);
            }
            if (this.isOverflowBorder && parseInt(this.startedRow.getAttribute('aria-rowindex'), 10) !== this.dragTarget) {
                this.moveDragRows(e, this.startedRow, trElement);
            } else {
                if (trElement && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') ===
                    trElement.getAttribute('data-uid')) {
                    let bottomborder: HTMLElement = createElement('div', { className: 'e-lastrow-dragborder' });
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
        if (isActionPrevent(this.parent.element)) {
            return;
        } else {
            this.processDragStop(e);
        }
    }

    private processDragStop: Function = (e: { target: HTMLTableRowElement, event: MouseEventArgs, helper: Element }) => {
        let gObj: SfGrid = this.parent;
        let targetEle: Element = this.getElementFromPosition(e.helper as HTMLElement, e.event);
        let target: Element = targetEle && !targetEle.classList.contains('e-dlg-overlay') ?
            targetEle : e.target;
        gObj.element.classList.remove('e-rowdrag');
        let dropElement: any = document.getElementById(gObj.options.rowDropTarget);
        if (this.parent.options.allowRowDragAndDrop && this.parent.options.rowDropTarget && !parentsUntil(target, 'e-grid')) {
            let toIdx: number = 0;
            let targetClass: string = (target.classList as any).value;
            let targetID: string = target.id;
            let fromIdx: number = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
            gObj.dotNetRef.invokeMethodAsync("ReorderRows", fromIdx, toIdx, 'add', false, targetClass, targetID, null, true);
        }
        if (gObj.options.rowDropTarget && dropElement && dropElement.blazor__instance &&
            (<{ getModuleName?: Function }>dropElement.blazor__instance).getModuleName() === 'grid') {
            dropElement.blazor__instance.getContent().classList.remove('e-allowRowDrop');
        }
        if (!parentsUntil(target, 'e-gridcontent')) {
            this.dragTarget = null;
            remove(e.helper);
            return;
        }
        if (this.parent.options.allowRowDragAndDrop && !this.parent.options.rowDropTarget) {
            this.stopTimer();
            this.parent.getContent().classList.remove('e-grid-relative');
            this.removeBorder(targetEle);
            let stRow: Element = gObj.element.querySelector('.e-dragstartrow');
            if (stRow) {
                stRow.classList.remove('e-dragstartrow');
            }
            let toIdx: number = this.dragTarget;
            let targetClass: string = (target.classList as any).value;
            let targetID: string = target.id;
            let fromIdx: number = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
            setTimeout(() => {
                gObj.dotNetRef.invokeMethodAsync("ReorderRows", fromIdx, toIdx, 'delete', true, targetClass, targetID, null, false);
            }, 10);
            this.dragTarget = null;
        }
    }

    private removeCell: Function = (targetRow: HTMLTableRowElement, className: string) => {
        return [].slice.call(targetRow.querySelectorAll('td')).filter((cell: HTMLTableCellElement) => {
            if (cell.classList.contains(className)) { (targetRow as HTMLTableRowElement).deleteCell(cell.cellIndex); }
        });
    }

    //Module declarations
    private parent: SfGrid;

    /**
     * Constructor for the Grid print module
     * @hidden
     */
    constructor(parent?: SfGrid) {
        this.parent = parent;
        if (this.parent.options.allowRowDragAndDrop) {
            this.initializeDrag();
        }
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    public initializeDrag(): void {
        let gObj: SfGrid = this.parent;
        this.draggable = new Draggable(gObj.getContent() as HTMLElement, {
            dragTarget: '.e-rowcelldrag, .e-rowdragdrop, .e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });
        this.droppable = new Droppable(gObj.getContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }

    private updateScrollPostion(e: MouseEvent | TouchEvent, target: Element): void {
        let frzCols: number = this.parent.options.frozenColumns;
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
        } else if (cliRect.top + this.parent.getContent().clientHeight - rowHeight - 20 <= y) {
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
                let div: HTMLElement = createElement('div', { className: 'e-firstrow-dragborder' });
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
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? getScrollBarWidth() : 0;
    }

    private removeFirstRowBorder(element: Element): void {
        if (this.parent.element.getElementsByClassName('e-firstrow-dragborder').length > 0 && element &&
            (element as HTMLTableRowElement).rowIndex !== 0) {
            this.parent.element.getElementsByClassName('e-firstrow-dragborder')[0].remove();
        }
    }

    private removeLastRowBorder(element: Element): void {
        let islastRowIndex: boolean = element &&
            this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
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

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }

    private drop: Function = (e: DropEventArgs) => {
        this.columnDrop({ target: e.target as HTMLTableRowElement, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }

    private columnDrop(e: { target: HTMLTableRowElement, droppedElement: HTMLElement }): void {
        let gObj: SfGrid = this.parent;
        if (e.droppedElement.getAttribute('action') !== 'grouping') {
            let targetRow: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
            let srcControl: SfGrid;
            let currentIndex: number;
            if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
                e.droppedElement.parentElement.id === gObj.element.id)
                || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                    e.droppedElement.parentElement.id !== gObj.element.id)) {
                return;
            }
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                srcControl = (<any>e.droppedElement.parentElement).blazor__instance;
            }
            if (srcControl.element.id !== gObj.element.id && srcControl.options.rowDropTarget !== gObj.element.id) {
                return;
            }
            let targetIndex: number = currentIndex = this.getTargetIdx(targetRow);
            if (isNaN(targetIndex)) {
                targetIndex = currentIndex = 0;
            }
            if (gObj.options.allowPaging) {
                targetIndex = targetIndex + (gObj.options.currentPage * gObj.options.pageSize) - gObj.options.pageSize;
            }
            let targetClass: string = (e.target.classList as any).value;
            let targetID: string = e.target.id;
            gObj.dotNetRef.invokeMethodAsync("ReorderRows", 0, targetIndex, 'add', false, targetClass, targetID, srcControl.dotNetRef, false);
            srcControl.dotNetRef.invokeMethodAsync("ReorderRows", 0, targetIndex, 'delete', false, targetClass, targetID, null, false);
        }
    }

    /**
     * To destroy the print 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.draggable.destroy();
    }

}