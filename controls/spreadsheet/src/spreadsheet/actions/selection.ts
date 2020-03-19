import { Spreadsheet } from '../base/index';
import { contentLoaded, mouseDown, virtualContentLoaded, cellNavigate, getUpdateUsingRaf } from '../common/index';
import { SheetModel, getColumnsWidth, updateSelectedRange, getColumnWidth } from '../../workbook/index';
import { getRowHeight, isSingleCell, activeCellChanged } from '../../workbook/index';
import { EventHandler, addClass, removeClass, isNullOrUndefined, Browser, closest } from '@syncfusion/ej2-base';
import { BeforeSelectEventArgs, selectionComplete, getMoveEvent, getEndEvent, isTouchStart, locateElem } from '../common/index';
import { isTouchEnd, isTouchMove, getClientX, getClientY, mouseUpAfterSelection, selectRange, rowHeightChanged } from '../common/index';
import { colWidthChanged, protectSelection } from '../common/index';
import { getRangeIndexes, getCellAddress, getRangeAddress, getCellIndexes, getSwapRange } from '../../workbook/common/address';


/**
 * Represents selection support for Spreadsheet.
 */

export class Selection {
    private parent: Spreadsheet;
    private startCell: number[];
    private isRowSelected: boolean;
    private isColSelected: boolean;
    /* tslint:disable-next-line:no-any */
    private scrollInterval: any;
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
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
        this.parent.on(protectSelection, this.protectHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.init);
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(virtualContentLoaded, this.virtualContentLoadedHandler);
            this.parent.off(cellNavigate, this.cellNavigateHandler);
            this.parent.off(selectRange, this.selectRange);
            this.parent.off(rowHeightChanged, this.rowHeightChanged);
            this.parent.off(colWidthChanged, this.colWidthChanged);
            this.parent.off(protectSelection, this.protectHandler);
        }
    }

    private rowHeightChanged(args: { threshold: number, rowIdx: number }): void {
        getUpdateUsingRaf((): void => {
            let ele: HTMLElement = this.getActiveCell();
            let cellIndex: number = getCellIndexes(this.parent.getActiveSheet().activeCell)[0];
            if (cellIndex === args.rowIdx && ele) {
                ele.style.height = `${parseInt(ele.style.height, 10) + args.threshold}px`;
            } else if (cellIndex > args.rowIdx && ele) {
                ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
            }
            ele = this.getSelectionElement();
            if (ele) {
                let selectedRange: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                let sRange: number[] = getSwapRange(selectedRange);
                let rowStart: number = sRange[0];
                let rowEnd: number = sRange[2];
                if (rowStart <= args.rowIdx && rowEnd >= args.rowIdx && ele) {
                    ele.style.height = `${parseInt(ele.style.height, 10) + args.threshold}px`;
                } else if (rowStart > args.rowIdx && ele) {
                    ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
                }
            }
        });
    }

    private colWidthChanged(args: { threshold: number, colIdx: number }): void {
        getUpdateUsingRaf((): void => {
            let ele: HTMLElement = this.getActiveCell();
            let cellIndex: number = getCellIndexes(this.parent.getActiveSheet().activeCell)[1];
            if (cellIndex === args.colIdx && ele) {
                ele.style.width = `${parseInt(ele.style.width, 10) + args.threshold}px`;
            } else if (cellIndex > args.colIdx && ele) {
                ele.style.left = `${parseInt(ele.style.left, 10) + args.threshold}px`;
            }
            ele = this.getSelectionElement();
            let selectedRange: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            let sRange: number[] = getSwapRange(selectedRange);
            let colStart: number = sRange[1];
            let colEnd: number = sRange[3];
            if (colStart <= args.colIdx && colEnd >= args.colIdx && ele) {
                ele.style.width = `${parseInt(ele.style.width, 10) + args.threshold}px`;
            } else if (colStart > args.colIdx && ele) {
                ele.style.left = `${parseInt(ele.style.left, 10) + args.threshold}px`;
            }
        });
    }

    private selectRange(indexes: number[]): void {
        this.selectRangeByIdx(this.parent.selectionSettings.mode === 'Single' ? indexes.slice(0, 2).concat(indexes.slice(0, 2)) : indexes);
    }

    private init(): void {
        let isInit: boolean = true;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        let sRange: number[] = getSwapRange(range);
        let actRange: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let inRange: boolean = sRange[0] <= actRange[0] && sRange[2] >= actRange[0] && sRange[1] <= actRange[1]
            && sRange[3] >= actRange[1];
        this.createSelectionElement();
        this.selectRangeByIdx(range, null, null, inRange);
        this.selectRangeByIdx(range, null, null, inRange, isInit);
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
            if (this.parent.getActiveSheet().isProtected && !this.parent.getActiveSheet().protectSettings.selectCells) {
                return;
            }
            if (!closest(e.target as Element, '.e-findtool-dlg')) {
                if (this.getSheetElement().contains(e.target as Node) && !(e.target as HTMLElement).classList.contains('e-colresize')
                    && !(e.target as HTMLElement).classList.contains('e-rowresize')) {
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
    }
    private mouseMoveHandler(e: MouseEvent & TouchEvent): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (isTouchMove(e)) {
            e.preventDefault();
        }
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
        let indexes: number[] = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
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

    private getScrollLeft(): number {
        return this.parent.scrollModule ? this.parent.scrollModule.prevScroll.scrollLeft : 0;
    }

    private cellNavigateHandler(args: { range: number[] }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected && !sheet.protectSettings.selectCells) {
            return;
        }
        this.selectRangeByIdx(args.range.concat(args.range));
    }

    private getColIdxFromClientX(clientX: number): number {
        let width: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cliRect: ClientRect = this.parent.getMainContent().getBoundingClientRect();
        let left: number = (this.parent.enableRtl ? (cliRect.right - clientX) : (clientX - cliRect.left)) + this.getScrollLeft();
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

    private selectRangeByIdx(
        range: number[], e?: MouseEvent, isScrollRefresh?: boolean,
        isActCellChanged?: boolean, isInit?: boolean): void {
        let ele: HTMLElement = this.getSelectionElement();
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
            locateElem(ele, range, sheet, this.parent.enableRtl);
        }
        updateSelectedRange(this.parent, getRangeAddress(range), sheet);
        this.UpdateRowColSelected(range);
        this.highlightHdr(range);
        if (!isScrollRefresh && !(e && (e.type === 'mousemove' || isTouchMove(e)))) {
            this.updateActiveCell(isActCellChanged ? getCellIndexes(sheet.activeCell) : range, isInit);
        }
        if (isNullOrUndefined(e)) { e = <MouseEvent>{ type: 'mousedown' }; }
        this.parent.notify(selectionComplete, e);
    }

    private UpdateRowColSelected(indexes: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        this.isRowSelected = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        this.isColSelected = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
    }

    private updateActiveCell(range: number[], isInit?: boolean): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell);
        let rowIdx: number = this.isColSelected ? topLeftIdx[0] : range[0];
        let colIdx: number = this.isRowSelected ? topLeftIdx[1] : range[1];
        if (sheet.activeCell !== getCellAddress(rowIdx, colIdx) || isInit) {
            sheet.activeCell = getCellAddress(rowIdx, colIdx);
            locateElem(this.getActiveCell(), getRangeIndexes(sheet.activeCell), sheet, this.parent.enableRtl);
            this.parent.notify(activeCellChanged, null);
        } else {
            locateElem(this.getActiveCell(), getRangeIndexes(sheet.activeCell), sheet, this.parent.enableRtl);
        }
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
            let sheet: SheetModel = this.parent.getActiveSheet();
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
            if (sheet.isProtected && !sheet.protectSettings.selectCells)  {
                removeClass([].concat(rowHdr, colHdr), 'e-highlight');
            } else {
                addClass([].concat(rowHdr, colHdr), 'e-highlight');
            }
            if (rowHdr.length && rowHdr[0].parentElement.previousElementSibling) {
                rowHdr[0].parentElement.previousElementSibling.classList.add('e-prev-highlight');
            }
            if (colHdr.length && colHdr[0].previousElementSibling) {
                colHdr[0].previousElementSibling.classList.add('e-prev-highlight');
            }
            if (this.isRowSelected && this.isColSelected) {
                if (sheet.isProtected && !sheet.protectSettings.selectCells) {
                    document.getElementById(`${this.parent.element.id}_select_all`).classList.remove('e-highlight');
                } else {
                    document.getElementById(`${this.parent.element.id}_select_all`).classList.add('e-highlight');
                }
            }
            if (swapRange[0] === 0) {
                selectAll.classList.add('e-prev-highlight-bottom');
            }
            if (swapRange[1] === 0) {
                selectAll.classList.add('e-prev-highlight-right');
            }
        }
    }

    private protectHandler(): void {
        let range: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        let swapRange: number[] = getSwapRange(range);
        let actRange: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let inRange: boolean = swapRange[0] <= actRange[0] && swapRange[2] >= actRange[0] && swapRange[1] <= actRange[1]
            && swapRange[3] >= actRange[1];
        this.selectRangeByIdx(range, null, null, inRange);
    }

    private getHdrIndexes(range: number[]): number[] {
        if (this.parent.scrollSettings.enableVirtualization) {
            let indexes: number[] = [];
            let hiddenRowCount: number = this.parent.hiddenCount(this.parent.viewport.topIndex, range[0]);
            let hiddenColCount: number = this.parent.hiddenCount(this.parent.viewport.leftIndex, range[1], 'columns');
            indexes[0] = this.isColSelected ? range[0] : (range[0] - this.parent.viewport.topIndex) < 0
                ? 0 : ((range[0] - hiddenRowCount) - this.parent.viewport.topIndex);
            indexes[1] = this.isRowSelected ? range[1] : (range[1] - this.parent.viewport.leftIndex) < 0
                ? 0 : ((range[1] - hiddenColCount) - this.parent.viewport.leftIndex);
            indexes[2] = this.isColSelected ? this.parent.viewport.rowCount + this.parent.getThreshold('row') * 2 : range[2] -
                this.parent.hiddenCount(range[0], range[2]) - hiddenRowCount - this.parent.viewport.topIndex;
            indexes[3] = this.isRowSelected ? this.parent.viewport.colCount + this.parent.getThreshold('col') * 2 :
                range[3] - this.parent.hiddenCount(range[1], range[3], 'columns') - hiddenColCount - this.parent.viewport.leftIndex;
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