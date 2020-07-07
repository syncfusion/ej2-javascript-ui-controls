import { SfGrid } from './sf-grid-fn';
import { EventHandler, remove, MouseEventArgs, createElement, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { parentsUntil, getPosition, addRemoveActiveClasses } from './util';
import { IPosition } from './interfaces';

export class Selection {

    private parent: SfGrid;
    private element: HTMLElement;
    private isCellDrag: boolean;
    private isDragged: boolean;
    private startDIndex: number;
    private prevStartDIndex: number = undefined;
    private prevEndIndex: number = undefined;
    private startDCellIndex: number;
    private x: number;
    private y: number;

    constructor(parent: SfGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        EventHandler.add(this.parent.getContent().parentElement, 'mousedown', this.mouseDownHandler, this);
    }

    public removeEventListener(): void {
        EventHandler.remove(this.parent.getContent().parentElement, 'mousedown', this.mouseDownHandler);
    }

    private mouseDownHandler(e: MouseEventArgs): void {
        let target: Element = e.target as Element;
        let gObj: SfGrid = this.parent;
        let isDrag: boolean;
        let gridElement: Element = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== gObj.element.id || parentsUntil(target, 'e-headercontent') && !this.parent.options.frozenRows) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (parentsUntil(target, 'e-rowcell') && !e.shiftKey && !e.ctrlKey) {
            // if (gObj.options.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
            //     this.isCellDrag = true;
            //     isDrag = true;
            // } else 
            if (gObj.options.allowRowDragAndDrop && !gObj.options.isEdit) {
                if (!this.isRowType() || this.isSingleSel() || closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                isDrag = true;
                this.element = createElement('div', { className: 'e-griddragarea' });
                gObj.getContent().appendChild(this.element);
            }
            if (isDrag) {
                this.enableDrag(e, true);
            }
        }
    }

    private mouseUpHandler(e: MouseEventArgs): void {
        document.body.classList.remove('e-disableuserselect');
        if (this.element) {
            remove(this.element);
        }
        if(!isNullOrUndefined(this.prevStartDIndex) || !isNullOrUndefined(this.prevEndIndex)) {
            this.parent.dotNetRef.invokeMethodAsync("DragSelection", this.prevStartDIndex, this.prevEndIndex, false);
        }
        // if (this.isDragged && this.selectedRowCellIndexes.length === 1 && this.selectedRowCellIndexes[0].cellIndexes.length === 1) {
        //     this.mUPTarget = parentsUntil(e.target as Element, 'e-rowcell');
        // } else {
        //     this.mUPTarget = null;
        // }
        // if (this.isDragged && !this.isAutoFillSel) {
        //     let target: Element = e.target as Element;
        //     let rowIndex: number = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
        //     let cellIndex: number =  parseInt(target.getAttribute('aria-colindex'), 10);
        //     this.isDragged = false;
        //     this.clearCellSelection();
        //     this.selectCellsByRange(
        //         { rowIndex: this.startDIndex, cellIndex: this.startDCellIndex },
        //         { rowIndex: rowIndex, cellIndex: cellIndex });
        // }
        this.isDragged = false;
        this.prevStartDIndex = undefined;
        this.prevEndIndex = undefined;
        EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        if (this.parent.options.frozenRows) {
            EventHandler.remove(this.parent.getHeaderContent(), 'mousemove', this.mouseMoveHandler);
        }
        EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
    }

    private enableDrag(e: MouseEventArgs, isUpdate?: boolean): void {
        let gObj: SfGrid = this.parent;
        if (isUpdate) {
            let tr: Element = closest(e.target as Element, 'tr');
            this.startDIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
            this.startDCellIndex = parseInt(parentsUntil(e.target as Element, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
        document.body.classList.add('e-disableuserselect');
        let gBRect: ClientRect = gObj.element.getBoundingClientRect();
        let postion: IPosition = getPosition(e);
        this.x = postion.x - gBRect.left;
        this.y = postion.y - gBRect.top;
        EventHandler.add(gObj.getContent(), 'mousemove', this.mouseMoveHandler, this);
        if (this.parent.options.frozenRows) {
            EventHandler.add(gObj.getHeaderContent(), 'mousemove', this.mouseMoveHandler, this);
        }
        EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
    }


    private mouseMoveHandler(e: MouseEventArgs): void {
        e.preventDefault();
        let gBRect: ClientRect = this.parent.element.getBoundingClientRect();
        let x1: number = this.x;
        let y1: number = this.y;
        let position: IPosition = getPosition(e);
        let x2: number = position.x - gBRect.left;
        let y2: number = position.y - gBRect.top;
        let tmp: number;
        let target: Element = closest(e.target as Element, 'tr');
        this.isDragged = true;
        if (!this.isCellDrag) {
            if (!target) {
                target = closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
            }
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.element.style.left = x1 + 'px';
            this.element.style.top = y1 - this.parent.getRowHeight() + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
        }
        if (target && !e.ctrlKey && !e.shiftKey) {
            let rowIndex: number = parseInt(target.getAttribute('aria-rowindex'), 10);
            if (!this.isCellDrag && (isNullOrUndefined(this.prevStartDIndex) ||
                this.prevStartDIndex != this.startDIndex || this.prevEndIndex != rowIndex)) {
                //Below calculation is to perform ClearSelection in server side
                let clearIndex: number = -1;
                let isInvokedFirst: boolean = false;
                let selectedIndexes: number[] = this.parent.getSelectedRowIndexes();
                if (isNullOrUndefined(this.prevStartDIndex)) {
                    clearIndex = -1;
                    isInvokedFirst = true;
                } else if (rowIndex >= this.prevStartDIndex && selectedIndexes.indexOf(rowIndex) >= 0) {
                    clearIndex = this.prevEndIndex;
                } else if (this.prevStartDIndex > rowIndex && selectedIndexes.indexOf(this.startDIndex) >= 0) {
                    clearIndex = this.prevEndIndex;
                }
                this.prevStartDIndex = this.startDIndex;
                this.prevEndIndex = rowIndex;
                if (isInvokedFirst) {
                    this.parent.dotNetRef.invokeMethodAsync("DragSelection", this.startDIndex, rowIndex, true);
                } else {
                    this.performDragSelection(this.startDIndex, rowIndex, clearIndex);
                }
            }
        }
    }

    private performDragSelection(startIndex: number, endIndex: number, clearIndex: number): void {
        let sIndex: number = startIndex;
        let eIndex: number = endIndex;
		if (startIndex > endIndex) {
            sIndex = endIndex;
            eIndex = startIndex;
        }
        if (clearIndex != -1) {
            this.clearSelectionExceptDragIndexes(sIndex, eIndex);
        }
        this.selectRangeOfRows(sIndex, eIndex);
    }

    private selectRangeOfRows(startIndex: number, endIndex: number): void {
        let rows: Element[] = this.parent.getRows();
        for (let i: number = startIndex; i <= endIndex; i++) {
            rows[i].setAttribute('aria-selected', 'true');
            let cells: Element[] = [].slice.call(rows[i].querySelectorAll('.e-rowcell'));
            addRemoveActiveClasses(cells, true, ...['e-aria-selected','e-active']);
        }
    }
    private clearSelectionByRow(row: Element): void {
        let cells: Element[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
        row.removeAttribute('aria-selected');
        addRemoveActiveClasses(cells, false, ...['e-aria-selected','e-active']);
    }

    private clearSelectionExceptDragIndexes(startIndex: number, endIndex: number): void {
        let rows: Element[] = this.parent.getRows();
        for (let i: number = 0; i < rows.length; i++) {
            if (i < startIndex || i > endIndex) {
                this.clearSelectionByRow(rows[i]);
            }            
        }
    }

    private isRowType(): boolean {
        return this.parent.options.selectionMode === 'Row' || this.parent.options.selectionMode === 'Both';
    }

    private isSingleSel(): boolean {
        return this.parent.options.selectionType === 'Single';
    }
}