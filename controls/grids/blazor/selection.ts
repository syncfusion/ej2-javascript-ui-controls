import { SfGrid } from './sf-grid-fn';
import { EventHandler, remove, MouseEventArgs, createElement, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { parentsUntil, getPosition, addRemoveActiveClasses } from './util';
import { IPosition, Column } from './interfaces';

export class Selection {

    private parent: SfGrid;
    private element: HTMLElement;
    private isCellDrag: boolean;
    private isDragged: boolean;
    private isAutoFillSel: boolean;
    private startDIndex: number;
    private startCell: Element;
    private endCells: Element;
    private endCell: Element;
    private startAFCell: Element;
    private startIndex: number;
    private startCellIndex: number;
    private endAFCell: Element;
    private startRowIndex: number;
    private endRowIndex: number;
    private startColIndex: number;
    private endColIndex: number;
    private prevStartDIndex: number;
    private prevEndIndex: number;
    private isInitialSelect: boolean;
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
            if (gObj.options.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
                this.isCellDrag = true;
                isDrag = true;
            }
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
                this.isAutoFillSel = false;
                this.enableDrag(e, true);
            }
        }
            this.updateStartEndCells();
            if (target.classList.contains('e-autofill') || target.classList.contains('e-xlsel')) {
                this.isCellDrag = true;
                this.isAutoFillSel = true;
                this.enableDrag(e);
            }
    }

    private mouseUpHandler(e: MouseEventArgs): void {
        document.body.classList.remove('e-disableuserselect');
        if (this.element) {
            remove(this.element);
        }
        if (!isNullOrUndefined(this.prevStartDIndex) || !isNullOrUndefined(this.prevEndIndex)) {
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
        if (this.parent.options.editMode == "Batch" && this.parent.options.enableAutoFill && this.parent.options.frozenColumns === 0 && this.parent.options.frozenRows === 0) {
            if (!isNullOrUndefined(this.endRowIndex) && !isNullOrUndefined(this.endColIndex) && !this.isAutoFillSel && this.isInitialSelect) {
                this.parent.dotNetRef.invokeMethodAsync("ClearSelection");
                var updateAFPos = this.updateAutofillPosition(this.endColIndex, this.endRowIndex, true);
                this.parent.dotNetRef.invokeMethodAsync("UpdateAutofillPositions", updateAFPos, "UpdateAutofillBox");
                this.assignCells();
                this.selectCellByRow();
                this.isInitialSelect = false;
            }
            if (this.isAutoFillSel) {
                let _this: Selection = this;
                this.assignCells();
                setTimeout(() => {
                    _this.selectCellByRow();
                }, 10);
                this.expandAFBorder(e, true);
                var updateAFBor = this.createBorder(this.startRowIndex, this.startColIndex, this.endRowIndex, this.endColIndex, true);
                this.parent.dotNetRef.invokeMethodAsync("UpdateAutofillPositions", updateAFBor, "UpdateAutofillBorder");
                var updateAFPos = this.updateAutofillPosition(this.endColIndex, this.endRowIndex, true);
                this.parent.dotNetRef.invokeMethodAsync("UpdateAutofillPositions", updateAFPos, "UpdateAutofillBox");
            }
        }
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
            else if (this.parent.options.editMode == "Batch" && this.parent.options.enableAutoFill) {
                if (this.startCell) {
                    let td: Element = parentsUntil(e.target as HTMLElement, 'e-rowcell');
                    if (td && !td.classList.contains("e-editedbatchcell")) {
                        this.startAFCell = this.startCell;
                        this.endAFCell = td;
                        this.endCell = td;
                        if (this.isAutoFillSel) {
                            this.expandAFBorder(e, false);
                        }
                        else {
                            this.assignCells();
                            var updateAFBor = this.createBorder(this.startRowIndex, this.startColIndex, this.endRowIndex, this.endColIndex, true);
                            this.parent.dotNetRef.invokeMethodAsync("UpdateAutofillPositions", updateAFBor, "UpdateAutofillBorder");
                            this.isInitialSelect = true;
                        }
                    }
                }
            }
        }
    }
    /**
     * @hidden
     */
    public updateAutofillPosition(cellindex: number, index: number, newSelect: boolean = false): object {
        let row: Element = this.parent.getRowByIndex(index);
        let cell: HTMLElement = row.querySelector('[aria-colindex="' + cellindex + '"]');
        let selectedCells: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
        let autoFillBoxLeft: string = '';
        let autoFillBoxRight: string = '';
        let autoFillBoxTop: string = '';
        if (selectedCells && !newSelect) {
            cell = selectedCells[selectedCells.length - 1] as HTMLElement;
        }
        if (cell && cell.offsetParent) {
            let clientRect: ClientRect = cell.getBoundingClientRect();
            let parentOff: ClientRect = cell.offsetParent.getBoundingClientRect();
            let colWidth: number = this.isLastCell(cell) ? 4 : 0;
            var rowHeight = this.isLastRow(cell) ? 3 : 0;
            if (!this.parent.options.enableRtl) {
                autoFillBoxLeft = clientRect.left - parentOff.left + clientRect.width - 4 - colWidth + 'px';
            }
            else {
                autoFillBoxRight = parentOff.right - clientRect.right + clientRect.width - 4 - colWidth + 'px';
            }
            autoFillBoxTop = clientRect.top - parentOff.top + clientRect.height - 5 - rowHeight + 'px';
        }
        return {
            Left: autoFillBoxLeft,
            Right: autoFillBoxRight,
            Top: autoFillBoxTop
        };
    }
    /**
     * @hidden
     */
    public createBorder(startRowIndex: number, startColIndex: number, endRowIndex: number = null, endColIndex: number = null, newSelect: boolean = false): object {
        let selectedCells: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
        let rowstart: Element = this.parent.getRowByIndex(startRowIndex);
        let cellStart: Element = rowstart.querySelector('[aria-colindex="' + startColIndex + '"]');
        let cellsStart: HTMLElement[] = [].slice.call(cellStart.parentElement.querySelectorAll('[aria-colindex="' + startColIndex + '"]'));
        let rowEnd: Element;
        let cellEnd: Element;
        let cellsEnd: HTMLElement[];
        let autoFillBorderRight: string = '';
        let autoFillBorderLeft: string = '';
        let autoFillBordersWidth: string = '';
        let autoFillBorderWidth: string = '';
        let autoFillBorderHeight: string = '';
        let autoFillBorderTop: string = '';
        if (endRowIndex != null && endColIndex != null) {
            rowEnd = this.parent.getRowByIndex(endRowIndex);
            cellEnd = rowEnd.querySelector('[aria-colindex="' + endColIndex + '"]');
            cellsEnd = [].slice.call(cellEnd.parentElement.querySelectorAll('[aria-colindex="' + endColIndex + '"]'));
        }
        else {
            rowEnd = rowstart;
            cellEnd = cellStart;
            cellsEnd = cellsStart;
        }
        if (selectedCells && !newSelect) {
            cellsStart = [].slice.call(selectedCells[0].parentElement.querySelectorAll('[aria-colindex="' + (selectedCells[0] as HTMLTableCellElement).cellIndex + '"]'));
            cellsEnd = [].slice.call(selectedCells[selectedCells.length - 1].parentElement.querySelectorAll('[aria-colindex="' + (selectedCells[selectedCells.length - 1] as HTMLTableCellElement).cellIndex + '"]'));
        }
        if (!this.startCell) {
            this.startCell = cellsStart[0];
        }

        this.endCells = cellsEnd[0];
        let start: HTMLElement = cellsStart[0] as HTMLElement;
        let end: HTMLElement = cellsEnd[0] as HTMLElement;
        let stOff: ClientRect = start.getBoundingClientRect();
        let endOff: ClientRect = end.getBoundingClientRect();
        let parentOff: ClientRect = start.offsetParent.getBoundingClientRect();
        let rowHeight: number = this.isLastRow(end) ? 2 : 0;
        let topOffSet: number = this.parent.options.frozenRows && this.isFirstRow(start) ? 1.5 : 0;
        let leftOffset: number = this.parent.options.frozenColumns && this.isFirstCell(start) ? 1 : 0;
        if (this.parent.options.enableRtl) {
            autoFillBorderRight = parentOff.right - stOff.right - leftOffset + 'px';
            autoFillBorderWidth = stOff.right - endOff.left + leftOffset + 1 + 'px';
        } else {
            autoFillBorderLeft = stOff.left - parentOff.left - leftOffset + 'px';
            autoFillBorderWidth = endOff.right - stOff.left + leftOffset + 1 + 'px';
        }
        autoFillBorderTop = stOff.top - parentOff.top - topOffSet + 'px';
        autoFillBorderHeight = endOff.top - stOff.top > 0 ?
            (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) - rowHeight + topOffSet + 'px' :
            endOff.height + topOffSet - rowHeight + 1 + 'px';
        autoFillBordersWidth = '2px';
        return {
            Right: autoFillBorderRight,
            Width: autoFillBorderWidth,
            BorderWidth: autoFillBordersWidth,
            Left: autoFillBorderLeft,
            Height: autoFillBorderHeight,
            Top: autoFillBorderTop
        };
    }
    private expandAFBorder(e: MouseEvent, isApply: boolean): void {
        let selectedCells: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
        let startrowIdx: number = parseInt(parentsUntil(this.startCell, 'e-row').getAttribute('aria-rowindex'), 10);
        let startCellIdx: number = parseInt(this.startCell.getAttribute('aria-colindex'), 10);
        let endrowIdx: number = parseInt(parentsUntil(this.endCell, 'e-row').getAttribute('aria-rowindex'), 10);
        let endCellIdx: number = parseInt(this.endCell.getAttribute('aria-colindex'), 10);
        let rowLen: number = parseInt(parentsUntil(selectedCells[selectedCells.length - 1], 'e-row').getAttribute('aria-rowindex'), 10) - parseInt(parentsUntil(selectedCells[0], 'e-row').getAttribute('aria-rowindex'), 10);
        let rowIdx: number = parseInt(parentsUntil(selectedCells[0], 'e-row').getAttribute('aria-rowindex'), 10);
        let row: HTMLTableRowElement = <HTMLTableRowElement>(this.parent.getRowByIndex(rowIdx));
        let colLen: number = 0;
        for (let i: number = 0, cellLen: number = row.cells.length; i < cellLen; i++) {
            if (row.cells[i].classList.contains('e-cellselectionbackground')) {
                colLen++;
            }
        }
        colLen = colLen - 1;
        colLen = colLen >= 0 ? colLen : 0;
        switch (true) {
            case !isApply && this.endAFCell.classList.contains('e-cellselectionbackground') &&
                !!parentsUntil(e.target as Element, 'e-rowcell'):
                this.startAFCell = this.parent.getCellFromIndex(startrowIdx, startCellIdx);
                this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, startCellIdx + colLen);
                this.drawAFBorders();
                break;
            case startCellIdx + colLen < endCellIdx &&
                endCellIdx - startCellIdx - colLen + 1 > endrowIdx - startrowIdx - rowLen
                && endCellIdx - startCellIdx - colLen + 1 > startrowIdx - endrowIdx:
                this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, endCellIdx);
                endrowIdx = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
                endCellIdx = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    let cellIdx: number = parseInt(this.endCells.getAttribute('aria-colindex'), 10);
                    for (let i: number = startrowIdx; i <= endrowIdx; i++) {
                        let cells: HTMLElement[] = this.getAutoFillCells(i, startCellIdx);
                        let c: number = 0;
                        for (let j: number = cellIdx + 1; j <= endCellIdx; j++) {
                            if (c > colLen) {
                                c = 0;
                            }
                            this.updateValue(i, j, cells[c] as HTMLTableCellElement);
                            c++;
                        }
                    }
                }
                break;
            case startCellIdx > endCellIdx &&
                startCellIdx - endCellIdx + 1 > endrowIdx - startrowIdx - rowLen &&
                startCellIdx - endCellIdx + 1 > startrowIdx - endrowIdx:
                this.startAFCell = this.parent.getCellFromIndex(startrowIdx, endCellIdx);
                this.endAFCell = this.endCells;
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    for (let i: number = startrowIdx; i <= startrowIdx + rowLen; i++) {
                        let cells: HTMLElement[] = this.getAutoFillCells(i, startCellIdx);
                        cells.reverse();
                        let c: number = 0;
                        for (let j: number = this.startCellIndex - 1; j >= endCellIdx; j--) {
                            if (c > colLen) {
                                c = 0;
                            }
                            this.updateValue(i, j, cells[c] as HTMLTableCellElement);
                            c++;
                        }
                    }
                }
                break;
            case startrowIdx > endrowIdx:
                this.startAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx);
                this.endAFCell = this.endCells;
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    let trIdx: number = parseInt(this.endCells.parentElement.getAttribute('aria-rowindex'), 10);
                    let r: number = trIdx;
                    for (let i: number = startrowIdx - 1; i >= endrowIdx; i--) {
                        if (r === this.startIndex - 1) {
                            r = trIdx;
                        }
                        let cells: HTMLElement[] = this.getAutoFillCells(r, startCellIdx);
                        let c: number = 0;
                        r--;
                        for (let j: number = this.startCellIndex; j <= this.startCellIndex + colLen; j++) {
                            this.updateValue(i, j, cells[c] as HTMLTableCellElement);
                            c++;
                        }
                    }
                }
                break;
            default:
                this.endAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx + colLen);
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    let trIdx: number = parseInt(this.endCells.parentElement.getAttribute('aria-rowindex'), 10);
                    let r: number = this.startIndex;
                    for (let i: number = trIdx + 1; i <= endrowIdx; i++) {
                        if (r === trIdx + 1) {
                            r = this.startIndex;
                        }
                        let cells: HTMLElement[] = this.getAutoFillCells(r, startCellIdx);
                        r++;
                        let c: number = 0;
                        for (let m: number = this.startCellIndex; m <= this.startCellIndex + colLen; m++) {
                            this.updateValue(i, m, cells[c] as HTMLTableCellElement);
                            c++;
                        }
                    }
                }
                break;
        }
    }
    private drawAFBorders(): void {
        if (!this.startCell) {
            return;
        }
        let stOff: ClientRect = this.startAFCell.getBoundingClientRect();
        let endOff: ClientRect = this.endAFCell.getBoundingClientRect();
        let top: number = endOff.top - stOff.top > 0 ? 1 : 0;
        let firstCellTop: number = endOff.top - stOff.top >= 0 && (parentsUntil(this.startAFCell, 'e-movablecontent') ||
            parentsUntil(this.startAFCell, 'e-frozencontent')) && this.isFirstRow(this.startAFCell) ? 1.5 : 0;
        let firstCellLeft: number = (parentsUntil(this.startAFCell, 'e-movablecontent') ||
            parentsUntil(this.startAFCell, 'e-movableheader')) && this.isFirstCell(this.startAFCell) ? 1 : 0;
        let rowHeight: number = this.isLastRow(this.endAFCell) && (parentsUntil(this.endAFCell, 'e-movablecontent') ||
            parentsUntil(this.endAFCell, 'e-frozencontent')) ? 2 : 0;
        let parentOff: ClientRect = (this.startAFCell as HTMLElement).offsetParent.getBoundingClientRect();
        let parentRect: ClientRect = this.parent.element.getBoundingClientRect();
        let sTop: number = (this.startAFCell as HTMLElement).offsetParent.parentElement.scrollTop;
        let sLeft: number = (this.startAFCell as HTMLElement).offsetParent.parentElement.scrollLeft;

        let scrollTop: number = sTop - (this.startAFCell as HTMLElement).offsetTop;
        let scrollLeft: number = sLeft - (this.startAFCell as HTMLElement).offsetLeft;
        scrollTop = scrollTop > 0 ? Math.floor(scrollTop) - 1 : 0;
        scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
        let left: number = stOff.left - parentRect.left;

        let bdrAFLeftLeft: string = '';
        let bdrAFLeftHeight: string = '';
        let bdrAFLeftTop: string = '';
        let bdrAFLeftRight: string = '';
        let bdrAFRightLeft: string = '';
        let bdrAFRightHeight: string = '';
        let bdrAFRightRight: string = '';
        let bdrAFRightTop: string = '';
        let bdrAFTopLeft: string = '';
        let bdrAFTopTop: string = '';
        let bdrAFTopWidth: string = '';
        let bdrAFBottomLeft: string = '';
        let bdrAFBottomTop: string = '';
        let bdrAFBottomWidth: string = '';

        if (!this.parent.options.enableRtl) {
            bdrAFLeftLeft = left - firstCellLeft + scrollLeft - 1 + 'px';
            bdrAFRightLeft = endOff.left - parentRect.left - 2 + endOff.width + 'px';
            bdrAFTopLeft = left + scrollLeft - 0.5 + 'px';
            bdrAFTopWidth = parseInt(bdrAFRightLeft, 10) - parseInt(bdrAFLeftLeft, 10)
                - firstCellLeft + 1 + 'px';
        }
        else {
            var scrolloffSet = (parentsUntil(this.startAFCell, 'e-movablecontent') ||
                parentsUntil(this.startAFCell, 'e-movableheader')) ? stOff.right -
                (this.startAFCell as HTMLElement).offsetParent.parentElement.getBoundingClientRect().width -
                parentRect.left : 0;
            bdrAFLeftRight = parentRect.right - endOff.right - 2 + endOff.width + 'px';
            bdrAFRightRight = parentRect.right - stOff.right - firstCellLeft + scrolloffSet - 1 + 'px';
            bdrAFTopLeft = endOff.left - parentRect.left - 0.5 + 'px';
            bdrAFTopWidth = parseInt(bdrAFLeftRight, 10) - parseInt(bdrAFRightRight, 10)
                - firstCellLeft + 1 + 'px';
        }
        bdrAFLeftTop = stOff.top - parentRect.top - firstCellTop + scrollTop - 78 + 'px';
        bdrAFLeftHeight = endOff.top - stOff.top > 0 ?
            (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) + firstCellTop - rowHeight - scrollTop + 'px' :
            endOff.height + firstCellTop - rowHeight - scrollTop + 'px';
        bdrAFRightTop = bdrAFLeftTop;
        bdrAFRightHeight = parseInt(bdrAFLeftHeight, 10) + 'px';
        bdrAFTopTop = bdrAFRightTop;
        bdrAFBottomLeft = bdrAFTopLeft;
        bdrAFBottomTop = parseFloat(bdrAFLeftTop) + parseFloat(bdrAFLeftHeight) - top - 1 + 'px';
        bdrAFBottomWidth = bdrAFTopWidth;
        var positionAF: object = {
            BorderLeftAutofillLeft: bdrAFLeftLeft,
            BorderLeftAutofillTop: bdrAFLeftTop,
            BorderLeftAutofillHeight: bdrAFLeftHeight,
            BorderLeftAutofillRight: bdrAFLeftRight,
            BorderRightAutofillLeft: bdrAFRightLeft,
            BorderRightAutofillHeight: bdrAFRightHeight,
            BorderRightAutofillRight: bdrAFRightRight,
            BorderRightAutofillTop: bdrAFRightTop,
            BorderTopAutofillLeft: bdrAFTopLeft,
            BorderTopAutofillTop: bdrAFTopTop,
            BorderTopAutofillWidth: bdrAFTopWidth,
            BorderBottomAutofillLeft: bdrAFBottomLeft,
            BorderBottomAutofillTop: bdrAFBottomTop,
            BorderBottomAutofillWidth: bdrAFBottomWidth
        };

        this.parent.dotNetRef.invokeMethodAsync("UpdateAutofillPositions", positionAF, "UpdateAutofillPosition");
    }
    private updateValue(rowIndex: number, colIndex: number, cell: HTMLTableCellElement): void {
        let col: Column = this.parent.getColumnByIndex(colIndex);
        var valueIndex = parseInt(parentsUntil(cell, 'e-row').getAttribute('aria-rowindex'), 10);
        let column: Column = this.parent.getColumnByIndex(cell.cellIndex);
        let value: string = cell.innerText;
        this.parent.dotNetRef.invokeMethodAsync("UpdateAutofillCell", rowIndex, col.field, column.field, valueIndex, value);
    }
    private getAutoFillCells(rowIndex: number, startCellIdx: number): HTMLElement[] {
        let cells: HTMLElement[] = [].slice.call(this.parent.getDataRows()[rowIndex].querySelectorAll('.e-cellselectionbackground'));
        return cells;
    }
    private updateStartEndCells(): void {
        let cells: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
        this.startCell = cells[0];
        this.endCell = cells[cells.length - 1];
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
            this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
    }
    private assignCells(): void {
        this.startRowIndex = parseInt(this.startAFCell.parentElement.getAttribute('aria-rowindex'), 10);
        this.endRowIndex = parseInt(this.endAFCell.parentElement.getAttribute('aria-rowindex'), 10);
        this.startColIndex = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10);
        this.endColIndex = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
        if (this.startRowIndex > this.endRowIndex) {
            this.startRowIndex = this.endRowIndex;
            this.endRowIndex = parseInt(this.startAFCell.parentElement.getAttribute('aria-rowindex'), 10);
        }
        if (this.endColIndex < this.startColIndex) {
            this.startColIndex = this.endColIndex;
            this.endColIndex = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10);
        }
    }
    private selectCellByRow(): void{
        for (var i = this.startRowIndex; i <= this.endRowIndex; i++) {
            for (var j = this.startColIndex; j <= this.endColIndex; j++) {
                this.parent.dotNetRef.invokeMethodAsync("SelectCellByRow", i, j);
            }
        }
    }
    private isLastCell(cell: Element): boolean {
        let LastCell: Element[] = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return LastCell[LastCell.length - 1] == cell;
    }

    private isLastRow(cell: Element): boolean {
        let LastRow: Element[] = [].slice.call(closest(cell, 'tbody').querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return LastRow[LastRow.length - 1] == cell.parentElement;
    }

    private isFirstRow(cell: Element): boolean {
        let rows: Element[] = [].slice.call(closest(cell, 'tbody').querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[0];
    }

    private isFirstCell(cell: Element): boolean {
        let cells: Element[] = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[0] === cell;
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
            if (!isNullOrUndefined(rows[i])) {
            rows[i].setAttribute('aria-selected', 'true');
            let cells: Element[] = [].slice.call(rows[i].querySelectorAll('.e-rowcell'));
            addRemoveActiveClasses(cells, true, ...['e-aria-selected', 'e-active']);
            }
        }
    }
    private clearSelectionByRow(row: Element): void {
        let cells: Element[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
        row.removeAttribute('aria-selected');
        addRemoveActiveClasses(cells, false, ...['e-aria-selected', 'e-active']);
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