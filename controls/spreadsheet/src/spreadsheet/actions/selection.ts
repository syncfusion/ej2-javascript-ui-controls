import { Spreadsheet } from '../base/index';
import { contentLoaded, mouseDown, virtualContentLoaded, cellNavigate, getUpdateUsingRaf } from '../common/index';
import { SheetModel, getColumnsWidth, updateSelectedRange, getColumnWidth } from '../../workbook/index';
import { getRowHeight, isSingleCell, activeCellChanged } from '../../workbook/index';
import { EventHandler, addClass, removeClass, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { BeforeSelectEventArgs, selectionComplete, getMoveEvent, getEndEvent, isTouchStart, locateElem } from '../common/index';
import { isTouchEnd, isTouchMove, getClientX, getClientY, mouseUpAfterSelection, selectRange, rowHeightChanged } from '../common/index';
import { getRangeIndexes, getCellAddress, getRangeAddress, getCellIndexes, getSwapRange } from '../../workbook/common/address';


/**
 * Represents selection support for Spreadsheet.
 */
export class Selection {
    private parent: Spreadsheet;
    private startCell: number[];
    private isRowSelected: boolean;
    private isColSelected: boolean;
    private scrollInterval: number;
    private touchEvt: TouchEvent & MouseEvent;
    private mouseMoveEvt: EventListener;

    /**
     * Constructor for the Spreadsheet selection module.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.mouseMoveEvt = this.mouseMoveHandler.bind(this);
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.init, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(virtualContentLoaded, this.virtualContentLoadedHandler, this);
        this.parent.on(cellNavigate, this.cellNavigateHandler, this);
        this.parent.on(selectRange, this.selectRange, this);
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.init);
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(virtualContentLoaded, this.virtualContentLoadedHandler);
            this.parent.off(cellNavigate, this.cellNavigateHandler);
            this.parent.off(selectRange, this.selectRange);
            this.parent.off(rowHeightChanged, this.rowHeightChanged);
        }
    }

    private rowHeightChanged(args: { threshold: number, rowIdx: number }): void {
        getUpdateUsingRaf((): void => {
            let ele: HTMLElement = this.getActiveCell();
            if (getCellIndexes(this.parent.getActiveSheet().activeCell)[0] === args.rowIdx && ele) {
                ele.style.height = `${parseInt(ele.style.height, 10) + args.threshold}px`;
            }
            ele = this.getSelectionElement();
            if (ele) {
                ele.style.height = `${parseInt(ele.style.height, 10) + args.threshold}px`;
            }
        });
    }

    private selectRange(indexes: number[]): void {
        this.selectRangeByIdx(this.parent.selectionSettings.mode === 'Single' ? indexes.slice(0, 2).concat(indexes.slice(0, 2)) : indexes);
    }

    private init(): void {
        let range: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        let sRange: number[] = getSwapRange(range);
        let actRange: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let inRange: boolean = sRange[0] <= actRange[0] && sRange[2] >= actRange[0] && sRange[1] <= actRange[1]
            && sRange[3] >= actRange[1];
        this.createSelectionElement();
        this.selectRangeByIdx(range, null, null, inRange);
    }

    private createSelectionElement(): void {
        let cont: Element = this.parent.getMainContent();
        let ele: Element = this.parent.createElement('div', { className: 'e-selection' });
        let activeCell: Element = this.parent.createElement('div', { className: 'e-active-cell' });
        cont.appendChild(ele);
        cont.appendChild(activeCell);
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (!this.parent.isEdit) {
            if (this.getSheetElement().contains(e.target as Node)) {
                let sheet: SheetModel = this.parent.getActiveSheet();
                let mode: string = this.parent.selectionSettings.mode;
                let rowIdx: number = this.getRowIdxFromClientY(getClientY(e));
                let colIdx: number = this.getColIdxFromClientX(getClientX(e));
                let activeIdx: number[] = getCellIndexes(sheet.activeCell);
                let isRowSelected: boolean = sheet.showHeaders && this.parent.getRowHeaderContent().contains(e.target as Node);
                let isColSelected: boolean = sheet.showHeaders && this.parent.getColumnHeaderContent().contains(e.target as Node);
                if (e.which === 3 && this.isSelected(rowIdx, colIdx)) {
                    return;
                }
                if (mode === 'Multiple' && (!isTouchEnd(e) && (!isTouchStart(e) ||
                    (isTouchStart(e) && activeIdx[0] === rowIdx && activeIdx[1] === colIdx)) || isColSelected || isRowSelected)) {
                    document.addEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
                    if (!Browser.isPointer) {
                        document.addEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt, { passive: false });
                    }
                }
                if (!isTouchEnd(e)) {
                    EventHandler.add(document, getEndEvent(), this.mouseUpHandler, this);
                }
                if (isTouchStart(e) && !(isColSelected || isRowSelected)) {
                    this.touchEvt = e;
                    return;
                }
                if (isRowSelected) {
                    this.isRowSelected = true;
                    if (!e.shiftKey || mode === 'Single') {
                        this.startCell = [rowIdx, 0];
                    }
                    this.selectRangeByIdx([this.startCell[0], 0, rowIdx, sheet.colCount - 1], e);
                } else if (isColSelected) {
                    this.isColSelected = true;
                    if (!e.shiftKey || mode === 'Single') {
                        this.startCell = [0, colIdx];
                    }
                    this.selectRangeByIdx([0, this.startCell[1], sheet.rowCount - 1, colIdx], e);
                } else if ((e.target as Element).classList.contains('e-selectall')) {
                    this.startCell = [0, 0];
                    this.selectRangeByIdx([].concat(this.startCell, [sheet.rowCount - 1, sheet.colCount - 1]), e);
                } else if (!(e.target as Element).classList.contains('e-main-content')) {
                    if (!e.shiftKey || mode === 'Single') {
                        this.startCell = [rowIdx, colIdx];
                    }
                    this.selectRangeByIdx(
                        [].concat(this.startCell ? this.startCell : getCellIndexes(sheet.activeCell), [rowIdx, colIdx]), e);
                }
                if (this.parent.isMobileView()) {
                    this.parent.element.classList.add('e-mobile-focused');
                    this.parent.renderModule.setSheetPanelSize();
                }
            }
        }
    }

    private mouseMoveHandler(e: MouseEvent & TouchEvent): void {
        if (isTouchMove(e)) {
            e.preventDefault();
        }
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cont: Element = this.getScrollContent();
        let clientRect: ClientRect = cont.getBoundingClientRect();
        let clientX: number = getClientX(e); let clientY: number = getClientY(e);
        // remove math.min or handle top and left auto scroll
        let colIdx: number = this.isRowSelected ? sheet.colCount - 1 : this.getColIdxFromClientX(Math.min(clientX, clientRect.right));
        let rowIdx: number = this.isColSelected ? sheet.rowCount - 1 : this.getRowIdxFromClientY(Math.min(clientY, clientRect.bottom));
        let isScrollDown: boolean = clientY > clientRect.bottom && rowIdx < sheet.rowCount;
        let isScrollUp: boolean = clientY < clientRect.top && rowIdx >= 0 && !this.isColSelected;
        let isScrollRight: boolean = clientX > clientRect.right && colIdx < sheet.colCount;
        let isScrollLeft: boolean = clientX < clientRect.left && colIdx >= 0 && !this.isRowSelected;
        this.clearInterval();
        if (isScrollDown || isScrollUp || isScrollRight || isScrollLeft) {
            this.scrollInterval = setInterval(() => {
                if ((isScrollDown || isScrollUp) && !this.isColSelected) {
                    rowIdx = this.getRowIdxFromClientY(isScrollDown ? clientRect.bottom : clientRect.top);
                    if (rowIdx >= sheet.rowCount) { // clear interval when scroll up
                        this.clearInterval();
                        return;
                    }
                    cont.scrollTop += (isScrollDown ? 1 : -1) * getRowHeight(sheet, rowIdx);
                }
                if ((isScrollRight || isScrollLeft) && !this.isRowSelected) {
                    colIdx = this.getColIdxFromClientX(isScrollRight ? clientRect.right : clientRect.left);
                    if (colIdx >= sheet.colCount) { // clear interval when scroll left
                        this.clearInterval();
                        return;
                    }
                    cont.scrollLeft += (isScrollRight ? 1 : -1) * getColumnWidth(sheet, colIdx);
                }
                this.selectRangeByIdx([].concat(this.startCell, [rowIdx, colIdx]), e);
                // tslint:disable-next-line
            }, 100);
        } else {
            this.selectRangeByIdx([].concat(this.startCell ? this.startCell : getCellIndexes(sheet.activeCell), [rowIdx, colIdx]), e);
        }
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        let rowIdx: number = this.getRowIdxFromClientY(getClientY(e));
        let colIdx: number = this.getColIdxFromClientX(getClientX(e));
        this.clearInterval();
        if (isTouchEnd(e) && !(this.isColSelected || this.isRowSelected) &&
            (this.getRowIdxFromClientY(getClientY(this.touchEvt)) === rowIdx &&
                this.getColIdxFromClientX(getClientX(this.touchEvt)) === colIdx)) {
            this.mouseDownHandler(e);
        }
        this.parent.trigger('select', { range: this.parent.getActiveSheet().selectedRange });
        document.removeEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
        if (!Browser.isPointer) {
            document.removeEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt);
        }
        EventHandler.remove(document, getEndEvent(), this.mouseUpHandler);
        this.parent.notify(mouseUpAfterSelection, e);
    }

    private isSelected(rowIdx: number, colIdx: number): boolean {
        let indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        return indexes[0] <= rowIdx && rowIdx <= indexes[2] && indexes[1] <= colIdx && colIdx <= indexes[3];
    }

    private virtualContentLoadedHandler(): void { // do only for scroll down
        let sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = getRangeIndexes(sheet.selectedRange);
        if (this.isColSelected && this.isRowSelected) {
            this.selectRangeByIdx([0, 0, sheet.rowCount - 1, sheet.colCount - 1], null, true);
        } else if (this.isColSelected) {
            this.selectRangeByIdx([0, indexes[1], sheet.rowCount - 1, indexes[3]], null, true);
        } else if (this.isRowSelected) {
            this.selectRangeByIdx([indexes[0], 0, indexes[2], sheet.colCount - 1], null, true);
        } else {
            this.highlightHdr(
                indexes, indexes[0] >= this.parent.viewport.topIndex || indexes[2] >= this.parent.viewport.topIndex,
                indexes[1] >= this.parent.viewport.leftIndex || indexes[3] >= this.parent.viewport.leftIndex);
        }
    }

    private clearInterval(): void {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
    }

    private getScrollContent(): Element {
        return this.parent.getMainContent();
    }

    private cellNavigateHandler(args: { range: number[] }): void {
        this.selectRangeByIdx(args.range.concat(args.range));
    }

    private getColIdxFromClientX(clientX: number): number {
        let width: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let left: number = (clientX - this.parent.getMainContent().getBoundingClientRect().left)
            + this.parent.getMainContent().scrollLeft;
        for (let i: number = 0; ; i++) {
            width += getColumnsWidth(sheet, i);
            if (left < width) {
                return i;
            }
        }
    }

    private getRowIdxFromClientY(clientY: number): number {
        let height: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let top: number = (clientY - this.parent.getMainContent().getBoundingClientRect().top)
            + this.parent.getMainContent().scrollTop;
        for (let i: number = 0; ; i++) {
            height += getRowHeight(sheet, i);
            if (top < height) {
                return i;
            }
        }
    }

    private selectRangeByIdx(range: number[], e?: MouseEvent, isScrollRefresh?: boolean, isActCellChanged?: boolean): void {
        let ele: Element = this.getSelectionElement();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let args: BeforeSelectEventArgs = { range: getRangeAddress(range), cancel: false };
        this.parent.trigger('beforeSelect', args);
        if (args.cancel === true) {
            return;
        }
        if (isSingleCell(range)) {
            ele.classList.add('e-hide');
        } else {
            ele.classList.remove('e-hide');
            locateElem(ele, range, sheet);
        }
        updateSelectedRange(this.parent, getRangeAddress(range), sheet);
        this.UpdateRowColSelected(range);
        this.highlightHdr(range);
        if (!isScrollRefresh && !(e && (e.type === 'mousemove' || isTouchMove(e)))) {
            this.updateActiveCell(isActCellChanged ? getCellIndexes(sheet.activeCell) : range);
        }
        if (isNullOrUndefined(e)) { e = <MouseEvent>{ type: 'mousedown' }; }
        this.parent.notify(selectionComplete, e);
    }

    private UpdateRowColSelected(indexes: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        this.isRowSelected = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        this.isColSelected = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
    }

    private updateActiveCell(range: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell);
        let rowIdx: number = this.isColSelected ? topLeftIdx[0] : range[0];
        let colIdx: number = this.isRowSelected ? topLeftIdx[1] : range[1];
        sheet.activeCell = getCellAddress(rowIdx, colIdx);
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        locateElem(this.getActiveCell(), getRangeIndexes(sheet.activeCell), sheet);
        this.parent.notify(activeCellChanged, [rowIdx, colIdx]);
    }

    private getSelectionElement(): HTMLElement {
        return this.parent.element.getElementsByClassName('e-selection')[0] as HTMLElement;
    }

    private getActiveCell(): HTMLElement {
        return this.parent.getMainContent().getElementsByClassName('e-active-cell')[0] as HTMLElement;
    }

    private getSheetElement(): Element {
        return document.getElementById(this.parent.element.id + '_sheet');
    }

    private highlightHdr(range: number[], isRowRefresh: boolean = true, isColRefresh: boolean = true): void {
        if (this.parent.getActiveSheet().showHeaders) {
            let rowHdr: Element[] = []; let colHdr: Element[] = [];
            let swapRange: number[] = getSwapRange(range);
            swapRange = this.getHdrIndexes(swapRange);
            let selectAll: Element = this.parent.element.getElementsByClassName('e-select-all-cell')[0];
            removeClass(this.getSheetElement().querySelectorAll('.e-highlight'), 'e-highlight');
            removeClass(this.getSheetElement().querySelectorAll('.e-prev-highlight'), 'e-prev-highlight');
            removeClass([selectAll], ['e-prev-highlight-right', 'e-prev-highlight-bottom']);
            if (isRowRefresh) {
                rowHdr = [].slice.call(this.parent.getRowHeaderContent().querySelectorAll('td')).slice(swapRange[0], swapRange[2] + 1);
            }
            if (isColRefresh) {
                colHdr = [].slice.call(this.parent.getColumnHeaderContent().querySelectorAll('th')).slice(swapRange[1], swapRange[3] + 1);
            }
            addClass([].concat(rowHdr, colHdr), 'e-highlight');
            if (rowHdr.length && rowHdr[0].parentElement.previousElementSibling) {
                rowHdr[0].parentElement.previousElementSibling.classList.add('e-prev-highlight');
            }
            if (colHdr.length && colHdr[0].previousElementSibling) {
                colHdr[0].previousElementSibling.classList.add('e-prev-highlight');
            }
            if (this.isRowSelected && this.isColSelected) {
                document.getElementById(`${this.parent.element.id}_select_all`).classList.add('e-highlight');
            }
            if (swapRange[0] === 0) {
                selectAll.classList.add('e-prev-highlight-bottom');
            }
            if (swapRange[1] === 0) {
                selectAll.classList.add('e-prev-highlight-right');
            }
        }
    }

    private getHdrIndexes(range: number[]): number[] {
        if (this.parent.scrollSettings.enableVirtualization) {
            let indexes: number[] = [];
            indexes[0] = this.isColSelected ? range[0] : (range[0] - this.parent.viewport.topIndex) < 0
                ? 0 : (range[0] - this.parent.viewport.topIndex);
            indexes[1] = this.isRowSelected ? range[1] : (range[1] - this.parent.viewport.leftIndex) < 0
                ? 0 : (range[1] - this.parent.viewport.leftIndex);
            indexes[2] = this.isColSelected ? this.parent.viewport.rowCount + this.parent.getThreshold('row') * 2 : indexes[0] === 0
                ? range[2] - this.parent.viewport.topIndex : range[2] - range[0] + indexes[0];
            indexes[3] = this.isRowSelected ? this.parent.viewport.colCount + this.parent.getThreshold('col') * 2 : indexes[1] === 0
                ? range[3] - this.parent.viewport.leftIndex : range[3] - range[1] + indexes[1];
            return indexes;
        }
        return range;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'selection';
    }

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}