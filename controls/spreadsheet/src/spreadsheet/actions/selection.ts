import { Spreadsheet } from '../base/index';
import { contentLoaded, mouseDown, virtualContentLoaded, cellNavigate, getUpdateUsingRaf, IOffset, focusBorder } from '../common/index';
import { showAggregate, refreshImgElem, getRowIdxFromClientY, getColIdxFromClientX, clearChartBorder, IScrollArgs } from '../common/index';
import { SheetModel, getColumnsWidth, updateSelectedRange, getColumnWidth, mergedRange, activeCellMergedRange } from '../../workbook/index';
import { getRowHeight, isSingleCell, activeCellChanged, CellModel, MergeArgs, checkIsFormula, getSheetIndex } from '../../workbook/index';
import { EventHandler, addClass, removeClass, isNullOrUndefined, Browser, closest, remove, detach } from '@syncfusion/ej2-base';
import { BeforeSelectEventArgs, selectionComplete, getMoveEvent, getEndEvent, isTouchStart, isMouseUp } from '../common/index';
import { isTouchEnd, isTouchMove, getClientX, getClientY, mouseUpAfterSelection, selectRange, rowHeightChanged } from '../common/index';
import { colWidthChanged, protectSelection, editOperation, initiateFormulaReference, initiateCur, clearCellRef } from '../common/index';
import { getRangeIndexes, getCellAddress, getRangeAddress, getCellIndexes, getSwapRange } from '../../workbook/common/address';
import { addressHandle, removeDesignChart, isMouseDown, isMouseMove, selectionStatus, setPosition, removeRangeEle } from '../common/index';
import { isCellReference, getSheetNameFromAddress } from '../../workbook/index';
import { getIndexesFromAddress } from '../../workbook/common/address';


/**
 * Represents selection support for Spreadsheet.
 */
export class Selection {
    private parent: Spreadsheet;
    private startCell: number[];
    private isRowSelected: boolean;
    private isColSelected: boolean;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private scrollInterval: any;
    private touchEvt: TouchEvent & MouseEvent;
    private mouseMoveEvt: EventListener;
    private uniqueOBracket: string = String.fromCharCode(129);
    private uniqueCBracket: string = String.fromCharCode(130);
    private uniqueCSeparator: string = String.fromCharCode(131);
    private uniqueCOperator: string = String.fromCharCode(132);
    private uniquePOperator: string = String.fromCharCode(133);
    private uniqueSOperator: string = String.fromCharCode(134);
    private uniqueMOperator: string = String.fromCharCode(135);
    private uniqueDOperator: string = String.fromCharCode(136);
    private uniqueModOperator: string = String.fromCharCode(137);
    private uniqueConcateOperator: string = String.fromCharCode(138);
    private uniqueEqualOperator: string = String.fromCharCode(139);
    private uniqueExpOperator: string = String.fromCharCode(140);
    private uniqueGTOperator: string = String.fromCharCode(141);
    private uniqueLTOperator: string = String.fromCharCode(142);
    private invalidOperators: string[] = ['%'];
    private formulaRange: string[] = [];
    private tableRangesFormula: object = {};
    private dStartCell: { rowIndex: number, colIndex: number };
    private dEndCell: { rowIndex: number, colIndex: number };
    private touchSelectionStarted: boolean;

    /**
     * Constructor for the Spreadsheet selection module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet selection module.
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
        this.parent.on(initiateFormulaReference, this.initiateFormulaSelection, this);
        this.parent.on(clearCellRef, this.clearBorder, this);
        this.parent.on(getRowIdxFromClientY, this.getRowIdxFromClientY, this);
        this.parent.on(getColIdxFromClientX, this.getColIdxFromClientX, this);
        this.parent.on(focusBorder, this.chartBorderHandler, this);
        this.parent.on(selectionStatus, this.isTouchSelectionStarted, this);
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
            this.parent.off(initiateFormulaReference, this.initiateFormulaSelection);
            this.parent.off(clearCellRef, this.clearBorder);
            this.parent.off(getRowIdxFromClientY, this.getRowIdxFromClientY);
            this.parent.off(getColIdxFromClientX, this.getColIdxFromClientX);
            this.parent.off(focusBorder, this.chartBorderHandler);
            this.parent.off(selectionStatus, this.isTouchSelectionStarted);
        }
    }

    private isTouchSelectionStarted(args: { touchSelectionStarted: boolean }): void {
        args.touchSelectionStarted = this.touchSelectionStarted;
    }

    private rowHeightChanged(args: { threshold: number, rowIdx: number }): void {
        getUpdateUsingRaf((): void => {
            let ele: HTMLElement = this.getActiveCell();
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (ele) {
                const cellIndex: number[] = getCellIndexes(sheet.activeCell);
                if (sheet.frozenRows || sheet.frozenColumns) {
                    const e: MergeArgs = { range: [cellIndex[0], cellIndex[1], cellIndex[0], cellIndex[1]] };
                    this.parent.notify(activeCellMergedRange, e);
                    setPosition(this.parent, ele, e.range as number[], 'e-active-cell');
                } else {
                    if (cellIndex[0] === args.rowIdx) {
                        ele.style.height = `${parseFloat(ele.style.height) + args.threshold}px`;
                    } else if (cellIndex[0] > args.rowIdx) {
                        ele.style.top = `${parseFloat(ele.style.top) + args.threshold}px`;
                    }
                }
            }
            ele = this.getSelectionElement();
            if (ele) {
                let selectedRange: number[] = getRangeIndexes(sheet.selectedRange);
                let sRange: number[] = getSwapRange(selectedRange);
                const mergeArgs: MergeArgs = { range: sRange, isActiveCell: false, skipChecking: true };
                this.parent.notify(mergedRange, mergeArgs);
                if (mergeArgs.isActiveCell || (sRange[0] === sRange[2] && sRange[1] === sRange[3])) { return; }
                if (sheet.frozenRows || sheet.frozenColumns) {
                    setPosition(this.parent, ele, selectedRange); return;
                }
                let rowStart: number = sRange[0];
                let rowEnd: number = sRange[2];
                if (rowStart <= args.rowIdx && rowEnd >= args.rowIdx && ele) {
                    ele.style.height = `${parseFloat(ele.style.height) + args.threshold}px`;
                } else if (rowStart > args.rowIdx && ele) {
                    ele.style.top = `${parseFloat(ele.style.top) + args.threshold}px`;
                }
            }
        });
    }

    private colWidthChanged(args: { threshold: number, colIdx: number }): void {
        getUpdateUsingRaf((): void => {
            const sheet: SheetModel = this.parent.getActiveSheet();
            let ele: HTMLElement = this.getActiveCell();
            if (ele) {
                const cellIndex: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
                if (sheet.frozenRows || sheet.frozenColumns) {
                    const mergeArgs: MergeArgs = { range: [cellIndex[0], cellIndex[1], cellIndex[0], cellIndex[1]] };
                    this.parent.notify(activeCellMergedRange, mergeArgs);
                    setPosition(this.parent, ele, mergeArgs.range as number[], 'e-active-cell');
                } else {
                    if (cellIndex[1] === args.colIdx) {
                        ele.style.width = `${parseFloat(ele.style.width) + args.threshold}px`;
                    } else if (cellIndex[1] > args.colIdx) {
                        ele.style.left = `${parseFloat(ele.style.left) + args.threshold}px`;
                    }
                }
            }
            ele = this.getSelectionElement();
            const selectedRange: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            const sRange: number[] = getSwapRange(selectedRange);
            const e: MergeArgs = { range: sRange, isActiveCell: false, skipChecking: true };
            this.parent.notify(mergedRange, e);
            if (e.isActiveCell || (sRange[0] === sRange[2] && sRange[1] === sRange[3])) { return; }
            if (sheet.frozenRows || sheet.frozenColumns) { setPosition(this.parent, ele, selectedRange); return; }
            const colStart: number = sRange[1]; const colEnd: number = sRange[3];
            if (colStart <= args.colIdx && colEnd >= args.colIdx && ele) {
                ele.style.width = `${parseFloat(ele.style.width) + args.threshold}px`;
            } else if (colStart > args.colIdx && ele) {
                ele.style.left = `${parseFloat(ele.style.left) + args.threshold}px`;
            }
        });
    }

    private selectRange(args: { address: string, skipChecking?: boolean }): void {
        args.address = this.parent.selectionSettings.mode === 'Single' ? getRangeAddress(getCellIndexes(args.address)) : args.address;
        this.selectMultiRange(args.address, null, null, args.skipChecking);
    }

    private init(): void {
        this.createSelectionElement();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let sRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        let actRange: number[] = getCellIndexes(sheet.activeCell);
        let inRange: boolean = sRange[0] <= actRange[0] && sRange[2] >= actRange[0] && sRange[1] <= actRange[1]
            && sRange[3] >= actRange[1];
        this.selectMultiRange(sheet.selectedRange, true, inRange);
    }

    private selectMultiRange(address: string, isInit?: boolean, inRange?: boolean, skipChecking?: boolean): void {
        let sheetIdx: number = this.parent.activeSheetIndex;
        if (address.indexOf('!') > -1) {
            sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(address));
            address = address.split('!')[1];
        }
        if (this.parent.activeSheetIndex === sheetIdx) {
            address.split(' ').forEach((rng: string, idx: number) => {
                this.selectRangeByIdx(
                    getRangeIndexes(rng), { type: 'mousedown', ctrlKey: idx === 0 ? false : true } as MouseEvent, null, inRange, isInit,
                    skipChecking);
            });
        } else {
            updateSelectedRange(this.parent, address, this.parent.sheets[sheetIdx]);
        }
    }

    private createSelectionElement(): void {
        const content: Element = this.parent.getMainContent();
        let ele: Element = this.parent.createElement('div', { className: 'e-selection' });
        content.appendChild(ele);
        ele = this.parent.createElement('div', { className: 'e-active-cell' });
        content.appendChild(ele);
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (closest(e.target as Element, '.e-scrollbar') || (e.target as Element).classList.contains('e-main-panel') ||
            (e.target as Element).classList.contains('e-sheet')) { return; }
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean = (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0) ||
        checkIsFormula(eventArgs.editedValue);
        if (!this.parent.isEdit || isFormulaEdit) {
            const overlayElem: HTMLElement = document.getElementById(this.parent.element.id + '_overlay');
            if (typeof((e.target as HTMLElement).className) === 'string' ) {
                if ((e.target as HTMLElement).className.indexOf('e-ss-overlay') > -1) { return; }
            } else if (overlayElem) {
                overlayElem.classList.remove('e-ss-overlay-active');
            }
            if (closest(e.target as Element, '.e-datavisualization-chart')) { return; }
            if (this.parent.getActiveSheet().isProtected && !this.parent.getActiveSheet().protectSettings.selectCells) {
                return;
            }
            if (!closest(e.target as Element, '.e-findtool-dlg')) {
                if (this.getSheetElement().contains(e.target as Node) && !(e.target as HTMLElement).classList.contains('e-colresize')
                    && !(e.target as HTMLElement).classList.contains('e-rowresize')) {
                    const sheet: SheetModel = this.parent.getActiveSheet(); const mode: string = this.parent.selectionSettings.mode;
                    const rowIdx: number = this.getRowIdxFromClientY({ clientY: getClientY(e), target: e.target as Element });
                    const colIdx: number = this.getColIdxFromClientX({ clientX: getClientX(e), target: e.target as Element });
                    const activeIdx: number[] = getCellIndexes(sheet.activeCell);
                    let isRowSelected: boolean; let isColSelected: boolean;
                    if (sheet.showHeaders) {
                        const trgt: Element = e.target as Element;
                        if (sheet.frozenColumns || sheet.frozenRows) {
                            let headerEle: HTMLElement = this.parent.getSelectAllContent().querySelector('thead');
                            if (headerEle) {
                                isColSelected = (this.parent.getColumnHeaderContent().contains(trgt) || headerEle.contains(trgt)) &&
                                    trgt.classList.contains('e-header-cell');
                            } else {
                                isColSelected = this.parent.getColumnHeaderContent().contains(trgt) &&
                                    trgt.classList.contains('e-header-cell');
                            }
                            headerEle = this.parent.getSelectAllContent().querySelector('tbody');
                            if (headerEle) {
                                isRowSelected = (this.parent.getRowHeaderContent().contains(trgt) || headerEle.contains(trgt)) &&
                                    trgt.classList.contains('e-header-cell');
                            } else {
                                isRowSelected = this.parent.getRowHeaderContent().contains(trgt) &&
                                    trgt.classList.contains('e-header-cell');
                            }
                        } else {
                            isRowSelected = this.parent.getRowHeaderContent().contains(e.target as Node);
                            isColSelected = this.parent.getColumnHeaderContent().contains(e.target as Node);
                        }
                    }
                    if (e.which === 3 && this.isSelected(rowIdx, colIdx)) {
                        return;
                    }
                    if (mode === 'Multiple' && (!isTouchEnd(e) && (!isTouchStart(e) ||
                        (isTouchStart(e) && activeIdx[0] === rowIdx && activeIdx[1] === colIdx)) || isColSelected || isRowSelected)) {
                        document.addEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
                        if (!Browser.isPointer) {
                            document.addEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt, { passive: false });
                        }
                        this.touchSelectionStarted = true;
                    } else {
                        this.touchSelectionStarted = false;
                    }
                    if (!isTouchEnd(e)) {
                        EventHandler.add(document, getEndEvent(), this.mouseUpHandler, this);
                    }
                    if (isTouchStart(e) && !(isColSelected || isRowSelected)) {
                        this.touchEvt = e;
                        return;
                    }
                    const topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell);
                    if (isRowSelected) {
                        this.isRowSelected = true;
                        if (!e.shiftKey || mode === 'Single') {
                            this.startCell = [rowIdx, 0];
                        }
                        this.selectRangeByIdx([this.startCell[0], sheet.frozenColumns ? topLeftIdx[1] : 0, rowIdx, sheet.colCount - 1], e);
                    } else if (isColSelected) {
                        this.isColSelected = true;
                        if (!e.shiftKey || mode === 'Single') {
                            this.startCell = [0, colIdx];
                        }
                        this.selectRangeByIdx([sheet.frozenRows ? topLeftIdx[0] : 0, this.startCell[1], sheet.rowCount - 1, colIdx], e);
                    } else if (closest(e.target as Element, '.e-select-all-cell')) {
                        this.startCell = [sheet.frozenRows ? topLeftIdx[0] : 0, sheet.frozenColumns ? topLeftIdx[1] : 0];
                        this.selectRangeByIdx([].concat(this.startCell, [sheet.rowCount - 1, sheet.colCount - 1]), e);
                    } else if (!(e.target as Element).classList.contains('e-sheet-content')) {
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
        if (isFormulaEdit && ((e.target as HTMLElement).classList.contains('e-cell') ||
            (e.target as HTMLElement).classList.contains('e-header-cell')) && this.parent.isEdit) {
            let range: string = this.parent.getActiveSheet().selectedRange;
            range = isSingleCell(getIndexesFromAddress(range)) ? range.split(':')[0] : range;
            this.parent.notify(addressHandle, { range: range, isSelect: false });
        }
    }

    private mouseMoveHandler(e: MouseEvent & TouchEvent): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (isTouchMove(e)) {
            e.preventDefault();
        }
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue) ||
            (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0);
        const verticalContent: Element = this.parent.getMainContent().parentElement;
        const horizontalContent: Element = this.parent.element.getElementsByClassName('e-scroller')[0];
        const clientRect: ClientRect = verticalContent.getBoundingClientRect(); const frozenCol: number = this.parent.frozenColCount(sheet);
        const left: number = clientRect.left + this.parent.sheetModule.getRowHeaderWidth(sheet);
        const top: number = clientRect.top; const right: number = clientRect.right; const bottom: number = clientRect.bottom;
        const clientX: number = getClientX(e); let clientY: number = getClientY(e);
        // remove math.min or handle top and left auto scroll
        let colIdx: number = this.isRowSelected ? sheet.colCount - 1 :
            this.getColIdxFromClientX({ clientX: Math.min(clientX, right), target: e.target as Element });
        let rowIdx: number = this.isColSelected ? sheet.rowCount - 1 :
            this.getRowIdxFromClientY({ clientY: Math.min(clientY, bottom), target: e.target as Element });
        let prevIndex: number[] = getRangeIndexes(sheet.selectedRange);
        const mergeArgs: MergeArgs = { range: [rowIdx, colIdx, rowIdx, colIdx] };
        this.parent.notify(activeCellMergedRange, mergeArgs);
        if (mergeArgs.range[2] === prevIndex[2] && mergeArgs.range[3] === prevIndex[3]) { return; }
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const isScrollDown: boolean = clientY > bottom && rowIdx < sheet.rowCount;
        const isScrollUp: boolean = clientY < top && rowIdx >= 0 && !this.isColSelected && !!verticalContent.scrollTop;
        const isScrollRight: boolean = clientX > right && colIdx < sheet.colCount;
        const isScrollLeft: boolean = clientX < left && colIdx >= 0 && !this.isRowSelected && !!horizontalContent.scrollLeft;
        this.clearInterval(); let scrollUpRowIdx: number; let scrollUpColIdx: number;
        if (!isFormulaEdit && !this.isColSelected && !this.isRowSelected) { prevIndex = getCellIndexes(sheet.activeCell); }
        if (isScrollDown || isScrollUp || isScrollRight || isScrollLeft) {
            if (isScrollUp || isScrollLeft) { scrollUpRowIdx = rowIdx; scrollUpColIdx = colIdx; }
            this.scrollInterval = setInterval(() => {
                if ((isScrollDown || isScrollUp) && !this.isColSelected) {
                    rowIdx = this.getRowIdxFromClientY({ clientY: isScrollDown ? bottom : top });
                    if (rowIdx >= sheet.rowCount) { // clear interval when scroll up
                        this.clearInterval(); return;
                    }
                    verticalContent.scrollTop += (isScrollDown ? 1 : -1) * getRowHeight(sheet, rowIdx);
                }
                if ((isScrollRight || isScrollLeft) && !this.isRowSelected) {
                    colIdx = this.getColIdxFromClientX({ clientX: isScrollRight ? right : left });
                    if (colIdx >= sheet.colCount) { // clear interval when scroll left
                        this.clearInterval();
                        return;
                    }
                    horizontalContent.scrollLeft += (isScrollRight ? 1 : -1) * getColumnWidth(sheet, colIdx);
                }
                if ((isScrollUp && !verticalContent.scrollTop) || (isScrollLeft && !horizontalContent.scrollLeft)) {
                    this.selectRangeByIdx([].concat(prevIndex[0], prevIndex[1], [scrollUpRowIdx, scrollUpColIdx]), e);
                    this.clearInterval(); return;
                }
                this.selectRangeByIdx([].concat(prevIndex[0], prevIndex[1], [rowIdx, colIdx]), e);
            }, 100);
        } else {
            let indexes: number[] = [].concat(prevIndex[0], prevIndex[1], [rowIdx, colIdx]);
            if (frozenRow && indexes[0] < frozenRow && indexes[2] >= frozenRow && verticalContent.scrollTop) {
                verticalContent.scrollTop = 0; indexes[2] = frozenRow;
            }
            if (frozenCol && indexes[1] < frozenCol && indexes[3] >= frozenCol && horizontalContent.scrollLeft) {
                horizontalContent.scrollLeft = 0; indexes[3] = frozenCol;
            }
            this.selectRangeByIdx(indexes, e);
        }
        if (isFormulaEdit && this.parent.isEdit) {
            const range: string = this.parent.getActiveSheet().selectedRange;
            this.parent.notify(addressHandle, { range: range, isSelect: false });
        }
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        const rowIdx: number = this.getRowIdxFromClientY({ clientY: getClientY(e), target: e.target as Element });
        const colIdx: number = this.getColIdxFromClientX({ clientX: getClientX(e), target: e.target as Element });
        this.clearInterval();
        if (isTouchEnd(e) && !(this.isColSelected || this.isRowSelected) &&
            (this.getRowIdxFromClientY({ clientY: getClientY(this.touchEvt), target: e.target as Element }) === rowIdx &&
                this.getColIdxFromClientX({ clientX: getClientX(this.touchEvt), target: e.target as Element }) === colIdx)) {
            this.mouseDownHandler(e);
        }
        this.parent.trigger('select', { range: this.parent.getActiveSheet().selectedRange });
        document.removeEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
        if (!Browser.isPointer) {
            document.removeEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt);
        }
        EventHandler.remove(document, getEndEvent(), this.mouseUpHandler);
        this.parent.notify(mouseUpAfterSelection, e);
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue) ||
            (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0);
        if (isFormulaEdit && this.parent.isEdit && !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit')) {
            this.parent.notify(initiateCur, {});
        }
    }

    private isSelected(rowIdx: number, colIdx: number): boolean {
        const indexes: number[] = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
        return indexes[0] <= rowIdx && rowIdx <= indexes[2] && indexes[1] <= colIdx && colIdx <= indexes[3];
    }

    private virtualContentLoadedHandler(args: { prevRowColCnt: SheetModel }): void { // do only for scroll down
        const sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = getRangeIndexes(sheet.selectedRange);
        let isColSelected: boolean; let isRowSelected: boolean;
        sheet.selectedRange.split(' ').forEach((rng: string, idx: number) => {
            indexes = getRangeIndexes(rng);
            isRowSelected = (indexes[1] === 0 && indexes[3] === args.prevRowColCnt.colCount - 1);
            isColSelected = (indexes[0] === 0 && indexes[2] === args.prevRowColCnt.rowCount - 1);
            if (isColSelected && isRowSelected) {
                this.selectRangeByIdx([0, 0, sheet.rowCount - 1, sheet.colCount - 1], null, true, null, null, null, idx);
            } else if (isColSelected) {
                this.selectRangeByIdx([0, indexes[1], sheet.rowCount - 1, indexes[3]], null, true, null, null, null, idx);
            } else if (isRowSelected) {
                this.selectRangeByIdx([indexes[0], 0, indexes[2], sheet.colCount - 1], null, true, null, null, null, idx);
            } else {
                indexes = getRangeIndexes(rng);
                this.highlightHdr(
                    indexes, idx === 0 ? false : true,
                    indexes[0] >= this.parent.viewport.topIndex || indexes[2] >= this.parent.viewport.topIndex,
                    indexes[1] >= this.parent.viewport.leftIndex || indexes[3] >= this.parent.viewport.leftIndex
                );
            }
        });
    }

    private clearInterval(): void {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
    }

    private getScrollLeft(): number {
        return this.parent.scrollModule ? this.parent.scrollModule.prevScroll.scrollLeft : 0;
    }

    private cellNavigateHandler(args: { range: number[] }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected && !sheet.protectSettings.selectCells) {
            return;
        }
        this.selectRangeByIdx(args.range.concat(args.range));
    }

    private getColIdxFromClientX(e: { clientX: number, isImage?: boolean, target?: Element, size?: number }): number {
        let width: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        let left: number = 0;
        if (e.isImage) {
            left = e.clientX;
        } else {
            const cliRect: ClientRect = document.getElementById(this.parent.element.id + '_sheet').getBoundingClientRect();
            if (this.parent.enableRtl) {
                left = (cliRect.right - this.parent.sheetModule.getRowHeaderWidth(sheet, true) - 1) - e.clientX;
            } else {
                left = e.clientX - (cliRect.left + this.parent.sheetModule.getRowHeaderWidth(sheet, true) + 1);
            }
            left += this.parent.viewport.beforeFreezeWidth;
            if (!e.target || (e.target && !closest(e.target, '.e-row-header') && !closest(e.target, '.e-selectall-container'))) {
                left += this.getScrollLeft();
            }
        }
        for (let i: number = 0; ; i++) {
            width += getColumnWidth(sheet, i, null, true);
            if (left < width || (this.parent.scrollSettings.isFinite && i === sheet.colCount - 1)) {
                if (!e.isImage) { e.size = left; }
                e.clientX = i;
                return i;
            }
        }
    }

    private getRowIdxFromClientY(args: { clientY: number, isImage?: boolean, target?: Element, size?: number }): number {
        let height: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        let top: number = 0;
        if (args.isImage) {
            top = args.clientY;
        } else {
            const sheetEle: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
            top = args.clientY + this.parent.viewport.beforeFreezeHeight -
                (sheetEle.getBoundingClientRect().top + (sheet.showHeaders ? 31 : 0));
            if (!args.target || (args.target && !closest(args.target, '.e-header-panel'))) {
                top += this.parent.getMainContent().parentElement.scrollTop;
            }
        }
        for (let i: number = 0; ; i++) {
            height += getRowHeight(sheet, i, true);
            if (top < height || (this.parent.scrollSettings.isFinite && i === sheet.rowCount - 1)) {
                if (!args.isImage) { args.size = top; }
                args.clientY = i;
                return i;
            }
        }
    }

    private initFormulaReferenceIndicator( range: number[]): void {
        if (this.parent.isEdit) {
            const forRefIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-formularef-indicator' });
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            this.parent.getMainContent().appendChild(forRefIndicator);
            setPosition(this.parent, forRefIndicator, range, 'e-formularef-indicator');
        }
    }

    private selectRangeByIdx(
        range: number[], e?: MouseEvent, isScrollRefresh?: boolean,
        isActCellChanged?: boolean, isInit?: boolean, skipChecking?: boolean, selectedRowColIdx?: number): void {
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue) ||
            (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0);
        let isMultiRange: boolean = e && e.ctrlKey && isMouseDown(e);
        const ele: HTMLElement = this.getSelectionElement(e, selectedRowColIdx);
        const sheet: SheetModel = this.parent.getActiveSheet();
        const formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
        const mergeArgs: MergeArgs = { range: [].slice.call(range), isActiveCell: false, skipChecking: skipChecking };
        let isMergeRange: boolean;
        const overlayEle: HTMLElement = document.querySelector('.e-datavisualization-chart.e-ss-overlay-active') as HTMLElement;
        if (!this.isColSelected && !this.isRowSelected) { this.parent.notify(mergedRange, mergeArgs); }
        if (range !== mergeArgs.range) {
            isMergeRange = true;
        }
        range = mergeArgs.range as number[];
        const args: BeforeSelectEventArgs = { range: getRangeAddress(range), cancel: false };
        this.parent.trigger('beforeSelect', args);
        if (args.cancel) { return; }
        if (isFormulaEdit && formulaRefIndicator) {
            formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
        }
        if ((isSingleCell(range) || mergeArgs.isActiveCell) && !isMultiRange) {
            if (ele) {
                if (!ele.classList.contains('e-multi-range')) {
                    ele.classList.add('e-hide');
                }
                if (sheet.frozenRows || sheet.frozenColumns) {
                    removeRangeEle(this.parent.getSelectAllContent(), null, false);
                    removeRangeEle(this.parent.getColumnHeaderContent(), null, false);
                    removeRangeEle(this.parent.getRowHeaderContent(), null, false);
                }
            }
            if (!sheet.frozenColumns && !sheet.frozenRows && ele) { setPosition(this.parent, ele, range); }
            if (isFormulaEdit && e && e.target && !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit')
                && this.parent.isEdit) {
                this.parent.notify(addressHandle, { range: getRangeAddress(range).split(':')[0], isSelect: true });
                this.initFormulaReferenceIndicator(range);
            }
        } else {
            if (isFormulaEdit && this.parent.isEdit) {
                if (e && e.target && !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit') && this.parent.isEdit) {
                    this.parent.notify(addressHandle, { range: getRangeAddress(range), isSelect: true });
                    this.initFormulaReferenceIndicator(range);
                }
            } else {
                if (ele) {
                    ele.classList.remove('e-hide');
                }
                const offset: { left: IOffset, top: IOffset } = (this.isColSelected && this.isRowSelected) ? undefined
                    : this.getOffset(range[2], range[3]);
                if (isMergeRange && offset) { // Need to handle half hidden merge cell in better way
                    offset.left = { idx: 0, size: 0 };
                }
                setPosition(this.parent, ele, range);
            }
        }
        const eArgs: { action: string, sheetIndex: number } = { action: 'getCurrentEditSheetIdx', sheetIndex: null };
        this.parent.notify(editOperation, eArgs);
        let selRange: string = getRangeAddress(range);
        if (e && e.ctrlKey && (isMouseMove(e) || isMouseUp(e))) {
            selRange = sheet.selectedRange.slice(0, sheet.selectedRange.lastIndexOf(' ')) + ' ' + selRange;
        } else if (selectedRowColIdx > -1) {
            let selRanges: string[] = sheet.selectedRange.split(' ');
            selRanges[selectedRowColIdx] = selRange;
            selRange = selRanges.join(' ');
        }
        if (!isFormulaEdit) {
            updateSelectedRange(this.parent, selRange, sheet, isMultiRange);
        } else if (!isInit) {
            updateSelectedRange(this.parent, selRange, sheet, isMultiRange);
        }
        this.UpdateRowColSelected(range);
        this.highlightHdr(range, e && e.ctrlKey);
        if (!isScrollRefresh && !(e && (e.type === 'mousemove' || isTouchMove(e)))) {
            if (!isFormulaEdit) {
                this.updateActiveCell(isActCellChanged ? getRangeIndexes(sheet.activeCell) : range, isInit);
            } else if (eArgs.sheetIndex === this.parent.getActiveSheet().id - 1 && isInit) {
                isActCellChanged = true;
                this.updateActiveCell(isActCellChanged ? getRangeIndexes(sheet.activeCell) : range, isInit);
            } else if (!this.parent.isEdit) {
                this.updateActiveCell(isActCellChanged ? getRangeIndexes(sheet.activeCell) : range, isInit);
            }
        }
        if (isNullOrUndefined(e)) { e = <MouseEvent>{ type: 'mousedown' }; }
        if (!isFormulaEdit) {
            this.parent.notify(selectionComplete, e);
        } else if (!isInit) {
            this.parent.notify(selectionComplete, e);
        }
        this.parent.notify(showAggregate, {});
        this.parent.notify(refreshImgElem, {});
        if (overlayEle) {
            this.parent.notify(removeDesignChart, {});
        }
        this.parent.notify(clearChartBorder, {});
    }

    private UpdateRowColSelected(indexes: number[]): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.isRowSelected = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        this.isColSelected = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
    }

    private updateActiveCell(range: number[], isInit?: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell); let rowIdx: number; let colIdx: number;
        let isMergeRange: boolean;
        if (this.isColSelected) {
            rowIdx = topLeftIdx[0]; colIdx = range[1];
            if (this.isRowSelected) { colIdx = topLeftIdx[1]; }
        } else {
            rowIdx = range[0]; colIdx = range[1];
            if (this.isRowSelected) { colIdx = topLeftIdx[1]; }
        }
        const mergeArgs: MergeArgs = { range: [rowIdx, colIdx, ...[rowIdx, colIdx]] };
        this.parent.notify(activeCellMergedRange, mergeArgs);
        if (range !== mergeArgs.range) {
            isMergeRange = true;
        }
        range = mergeArgs.range as number[];
        if (sheet.activeCell !== getCellAddress(range[0], range[1]) || isInit) {
            this.parent.setSheetPropertyOnMute(sheet, 'activeCell', getCellAddress(range[0], range[1]));
            if (this.getActiveCell()) {
                const offset: { left: IOffset, top: IOffset } = this.getOffset(range[2], range[3]);
                if (isMergeRange) {
                    offset.left = { idx: 0, size: 0 };
                }
                setPosition(this.parent, this.getActiveCell(), range, 'e-active-cell');
            }
            this.parent.notify(activeCellChanged, null);
        } else {
            setPosition(this.parent, this.getActiveCell(), range, 'e-active-cell');
        }
    }

    private getOffset(rowIdx: number, colIdx: number): { left: IOffset, top: IOffset } {
        const offset: { left: IOffset, top: IOffset } = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
        if (this.parent.scrollModule) {
            if (colIdx >= this.parent.scrollModule.offset.left.idx) { offset.left = this.parent.scrollModule.offset.left; }
            if (rowIdx >= this.parent.scrollModule.offset.top.idx) { offset.top = this.parent.scrollModule.offset.top; }
        }
        return offset;
    }

    private getSelectionElement(e?: MouseEvent, selectedRowColIdx?: number): HTMLElement {
        if (e && e.ctrlKey) {
            if (isMouseUp(e) || isMouseMove(e)) {
                return this.parent.getMainContent().querySelector('.e-selection:last-child');
            } else {
                let selElem: Element = this.parent.element.getElementsByClassName('e-selection')[0];
                selElem.classList.remove('e-hide');
                let ele: HTMLElement = selElem.cloneNode() as HTMLElement;
                ele.classList.add('e-multi-range');
                return this.parent.getMainContent().appendChild(ele);
            }
        } else if (selectedRowColIdx > -1) {
            return this.parent.getMainContent().getElementsByClassName('e-selection')[selectedRowColIdx] as HTMLElement;
        } else {
            let elems: NodeListOf<Element> = [].slice.call(this.parent.element.getElementsByClassName('e-multi-range'));
            elems.forEach((ele: Element) => {
                remove(ele);
            });
            return this.parent.getMainContent().getElementsByClassName('e-selection')[0] as HTMLElement;
        }
    }

    private getActiveCell(): HTMLElement {
        return this.parent.getMainContent().getElementsByClassName('e-active-cell')[0] as HTMLElement;
    }

    private getSheetElement(): Element {
        return document.getElementById(this.parent.element.id + '_sheet');
    }

    private highlightHdr(range: number[], isMultiRange?: boolean, isRowRefresh: boolean = true, isColRefresh: boolean = true): void {
        if (this.parent.getActiveSheet().showHeaders) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const rowHdr: Element[] = []; const colHdr: Element[] = [];
            let swapRange: number[] = getSwapRange(range);
            swapRange = this.getHdrIndexes(swapRange);
            const selectAll: Element = this.parent.element.getElementsByClassName('e-select-all-cell')[0];
            if (!isMultiRange) {
                removeClass(this.getSheetElement().querySelectorAll('.e-highlight'), 'e-highlight');
                removeClass(this.getSheetElement().querySelectorAll('.e-prev-highlight'), 'e-prev-highlight');
            }
            if (selectAll) {
                removeClass([selectAll], ['e-prev-highlight-right', 'e-prev-highlight-bottom']);
            }
            if (isRowRefresh) {
                const frozenRow: number = this.parent.frozenRowCount(sheet);
                let selectAll: Element[]; let td: Element;
                const selectAllHdr: Element = this.parent.getSelectAllContent().querySelector('tbody');
                if (selectAllHdr) { selectAll = [].slice.call(selectAllHdr.querySelectorAll('.e-header-cell')); }
                const header: Element[] = [].slice.call(this.parent.getRowHeaderContent().querySelectorAll('.e-header-cell'));
                const topIndex: number = getCellIndexes(sheet.topLeftCell)[0];
                for (let i: number = swapRange[0]; i < swapRange[2] + 1; i++) {
                    if (i < frozenRow) {
                        td = selectAll[i - topIndex];
                    } else {
                        td = header[i - frozenRow];
                    }
                    if (td) { rowHdr.push(td); }
                }
            }
            if (isColRefresh) {
                const frozenCol: number = this.parent.frozenColCount(sheet);
                let selectAll: Element[]; let td: Element;
                const selectAllHdr: Element = this.parent.getSelectAllContent().querySelector('thead');
                if (selectAllHdr) { selectAll = [].slice.call(selectAllHdr.querySelectorAll('.e-header-cell')); }
                const header: Element[] = [].slice.call(this.parent.getColumnHeaderContent().querySelectorAll('th'));
                const leftIndex: number = getCellIndexes(sheet.topLeftCell)[1];
                for (let i: number = swapRange[1]; i < swapRange[3] + 1; i++) {
                    if (i < frozenCol) {
                        td = selectAll[i - leftIndex];
                    } else {
                        td = header[i - frozenCol];
                    }
                    if (td) { colHdr.push(td); }
                }
            }
            if (sheet.isProtected && !sheet.protectSettings.selectCells) {
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
            if (selectAll) {
                if (swapRange[0] === 0) {
                    selectAll.classList.add('e-prev-highlight-bottom');
                }
                if (swapRange[1] === 0) {
                    selectAll.classList.add('e-prev-highlight-right');
                }
            }
        }
    }

    private protectHandler(): void {
        const range: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        const swapRange: number[] = getSwapRange(range);
        const actRange: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        const inRange: boolean = swapRange[0] <= actRange[0] && swapRange[2] >= actRange[0] && swapRange[1] <= actRange[1]
            && swapRange[3] >= actRange[1];
        this.selectRangeByIdx(range, null, null, inRange);
    }

    private getHdrIndexes(range: number[]): number[] {
        if (this.parent.scrollSettings.enableVirtualization) {
            const indexes: number[] = [];
            const hiddenRowCount: number = this.parent.hiddenCount(this.parent.viewport.topIndex, range[0]);
            const hiddenColCount: number = this.parent.hiddenCount(this.parent.viewport.leftIndex, range[1], 'columns');
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

    private initiateFormulaSelection( args: { range: string, formulaSheetIdx: number }): void {
        this.processFormulaEditRange(args.range, args.formulaSheetIdx);
    }

    private processFormulaEditRange(val: string, formulaStartSheetIdx: number): void {
        let str: string;
        let formulaSheetIdx: number = formulaStartSheetIdx;
        let i: number = 0;
        const parsedVal: string[] = this.parseFormula(val);
        const len: number = parsedVal.length;
        let ctrlKeyCount: number = 0;
        const formulaBorder: string[][] = [['e-vborderright', 'e-vborderbottom'], ['e-pborderright', 'e-pborderbottom'],
            ['e-cborderright', 'e-cborderbottom'], ['e-gborderright', 'e-gborderbottom'], ['e-oborderright', 'e-oborderbottom'],
            ['e-bborderright', 'e-bborderbottom']];
        this.clearBorder();
        const actSheetIdx: number = this.parent.getActiveSheet().id - 1;
        while (i < len) {
            str = parsedVal[i];
            if (this.invalidOperators.indexOf(str) > -1) {
                break;
            }
            if (isCellReference(str.toUpperCase())) {
                str = str.replace(/\$/g, '');
                if (i > 0) {
                    if (parsedVal[i - 1].indexOf('!') === parsedVal[i - 1].length - 1) {
                        const splitStr: string[] = parsedVal[i - 1].split('!');
                        formulaSheetIdx = getSheetIndex(this.parent, splitStr[0].substring(1, splitStr[0].length - 1));
                    }
                }
                if (parsedVal[i + 1] === ':') {
                    i++;
                    if (parsedVal[i + 1] && isCellReference(parsedVal[i + 1].toUpperCase())) {
                        str = str + ':' + parsedVal[i + 1];
                        i++;
                    }
                }
                if (actSheetIdx === formulaSheetIdx) {
                    this.updateFormulaEditRange(str, ctrlKeyCount, formulaBorder);
                }
                formulaSheetIdx = formulaStartSheetIdx;
                ctrlKeyCount++;
            }
            i++;
        }
    }

    private updateFormulaEditRange(str: string, i: number, formulaBorder: String[][]): void {
        const indices: number[] = getRangeIndexes(str);
        this.formulaRange[i] = str;
        this.dStartCell = { rowIndex: indices[0], colIndex: indices[1] };
        this.dEndCell = { rowIndex: indices[2], colIndex: indices[3] };
        this.focusBorder(this.dStartCell, this.dEndCell, formulaBorder[i % 6] as string[]);
    }

    private chartBorderHandler(args: {
        startcell: { rowIndex: number, colIndex: number }, endcell: { rowIndex: number, colIndex: number },
        classes: string[]
    }): void {
        this.focusBorder(args.startcell, args.endcell, args.classes, true);
    }

    private focusBorder(
        startcell: { rowIndex: number, colIndex: number }, endcell: { rowIndex: number, colIndex: number },
        classes: string[], isChart?: boolean): void {
        isChart = isNullOrUndefined(isChart) ? false : isChart;
        const range: number[] = getSwapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenRows || sheet.frozenColumns) {
            const rangeReference: HTMLElement = this.parent.createElement('div', {
                className: isChart ? 'e-range-indicator e-chart-range' : 'e-range-indicator e-formuala-range' });
            rangeReference.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            rangeReference.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            rangeReference.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            rangeReference.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            setPosition(this.parent, rangeReference, range, 'e-range-indicator');
            return;
        }
        const minr: number = range[0]; const minc: number = range[1]; const maxr: number = range[2]; const maxc: number = range[3];
        if (minr) {
            (this.getEleFromRange([minr - 1, minc, minr - 1, maxc])).forEach((td: HTMLElement): void => {
                if (td) {
                    td.classList.add(classes[1]);
                    if (!isChart) {
                        td.classList.add('e-formularef-selection');
                    }
                }
            }); // top                     
        }
        (this.getEleFromRange([minr, maxc, maxr, maxc])).forEach((td: HTMLElement): void => {
            if (td) {
                td.classList.add(classes[0]);
                if (!isChart) {
                    td.classList.add('e-formularef-selection');
                }
            }
        }); // right
        this.getEleFromRange([maxr, minc, maxr, maxc]).forEach((td: HTMLElement): void => {
            if (td) {
                td.classList.add(classes[1]);
                if (!isChart) {
                    td.classList.add('e-formularef-selection');
                }
            }
        }); // bottom
        if (minc) {
            (this.getEleFromRange([minr, minc - 1, maxr, minc - 1])).forEach((td: HTMLElement): void => {
                if (td) {
                    td.classList.add(classes[0]);
                    if (!isChart) {
                        td.classList.add('e-formularef-selection');
                    }
                }
            }); // left
        }
    }

    private getEleFromRange(range: number[], sheetIdx?: number): HTMLElement[] {
        sheetIdx = this.parent.getActiveSheet().index;
        let startRIndex: number = range[0]; let startCIndex: number = range[1];
        let endRIndex: number = range[2]; let endCIndex: number = range[3];
        let i: number; let rowIdx: number;
        let temp: number;
        let tempCells: Element[] = [];
        let rowCells: HTMLCollectionOf<Element>;
        const cells: HTMLElement[] = [];
        if (startRIndex > endRIndex) {
            temp = startRIndex;
            startRIndex = endRIndex;
            endRIndex = temp;
        }
        if (startCIndex > endCIndex) {
            temp = startCIndex;
            startCIndex = endCIndex;
            endCIndex = temp;
        }
        if (this.parent.scrollSettings.enableVirtualization) {
            for (i = startRIndex; i <= endRIndex; i++) {
                rowIdx = i;
                if (rowIdx > -1) {
                    const row: Element = this.parent.getRow(rowIdx, null, );
                    if (row) {
                        rowCells = row.getElementsByClassName('e-cell') as HTMLCollectionOf<Element>;
                        tempCells = (endCIndex === startCIndex) ?
                            [rowCells[endCIndex]] : this.getRowCells(rowCells, startCIndex, endCIndex + 1);
                        this.merge(cells, tempCells);
                    }
                }
            }
        }
        return cells;
    }

    private getRowCells(rowCells: HTMLCollectionOf<Element>, startCIndex: number, endCIndex: number): HTMLElement[] {
        const tdCol: HTMLElement[] = [];
        for (startCIndex; startCIndex < endCIndex; startCIndex++) {
            if (rowCells[startCIndex]) {
                tdCol.push(rowCells[startCIndex] as HTMLElement);
            }
        }
        return tdCol;
    }

    private merge(first: HTMLElement[], second: Element[]): void {
        if (!first || !second) {
            return;
        }
        Array.prototype.push.apply(first, second);
    }


    private clearBorder(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenColumns || sheet.frozenRows) {
            const formualIndicator: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-formuala-range'));
            formualIndicator.forEach((indicator: Element): void => { detach(indicator); });
            return;
        }
        const borderEleColl: HTMLCollectionOf<Element> =
            this.parent.element.getElementsByClassName('e-formularef-selection') as HTMLCollectionOf<Element>;
        for (let idx: number = 0; idx < borderEleColl.length; idx++) {
            const td: HTMLElement = borderEleColl[idx] as HTMLElement;
            const classArr: string[] = ['e-vborderright', 'e-vborderbottom', 'e-pborderright', 'e-pborderbottom',
                'e-cborderright', 'e-cborderbottom', 'e-gborderright', 'e-gborderbottom', 'e-oborderright',
                'e-oborderbottom', 'e-bborderright', 'e-bborderbottom'];
            for (let idx: number = 0; idx < classArr.length; idx++) {
                td.classList.remove(classArr[idx]);
            }
        }
        for (let idx: number = 0; idx < borderEleColl.length; idx++) {
            const td: HTMLElement = borderEleColl[idx] as HTMLElement;
        }
    }

    private parseFormula(formulaStr: string): string[] {
        let tempStr: string;
        let str: string;
        let i: number = 0;
        const arr: string[] = [];
        formulaStr = this.markSpecialChar(formulaStr.replace('=', ''));
        const formula: string[] = formulaStr.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        const len: number = formula.length;
        while (i < len) {
            tempStr = formula[i];
            if (!tempStr) {
                i++;
                continue;
            }
            if (tempStr.length === 1) {
                arr.push(this.isUniqueChar(tempStr) ? this.getUniqueCharVal(tempStr) : tempStr);
            } else {
                str = tempStr[0];
                if (tempStr.indexOf('!') > 0) {
                    if (this.isUniqueChar(str)) {
                        arr.push(this.getUniqueCharVal(str));
                        tempStr = tempStr.substr(1);
                    }
                    const strVal: number = tempStr.indexOf('!') + 1;
                    arr.push(tempStr.substr(0, strVal));
                    arr.push(tempStr.substr(strVal));
                } else if (this.isUniqueChar(str)) {
                    arr.push(this.getUniqueCharVal(str));
                    arr.push(tempStr.substr(1));
                } else {
                    arr.push(tempStr);
                }
            }
            i++;
        }
        return arr;
    }

    private isUniqueChar(str: string): boolean {
        const code: number = str.charCodeAt(str.charAt[0]);
        return code >= 129 && code <= 142;
    }

    private getUniqueCharVal(tempStr: string): string {
        switch (tempStr) {
        case this.uniqueOBracket:
            return '(';
        case this.uniqueCBracket:
            return ')';
        case this.uniqueCOperator:
            return ':';
        case this.uniqueSOperator:
            return '-';
        case this.uniquePOperator:
            return '+';
        case this.uniqueMOperator:
            return '*';
        case this.uniqueDOperator:
            return '/';
        case this.uniqueModOperator:
            return '%';
        case this.uniqueCSeparator:
            return ',';
        case this.uniqueConcateOperator:
            return '&';
        case this.uniqueEqualOperator:
            return '=';
        case this.uniqueExpOperator:
            return '^';
        case this.uniqueLTOperator:
            return '<';
        case this.uniqueGTOperator:
            return '>';
        }
        return '';
    }

    private markSpecialChar(formulaVal: string): string {
        formulaVal = formulaVal.replace(/\(/g, '(' + this.uniqueOBracket).replace(/\)/g, ')' + this.uniqueCBracket);
        formulaVal = formulaVal.replace(/,/g, ',' + this.uniqueCSeparator).replace(/:/g, ':' + this.uniqueCOperator);
        formulaVal = formulaVal.replace(/\+/g, '+' + this.uniquePOperator).replace(/-/g, '-' + this.uniqueSOperator);
        formulaVal = formulaVal.replace(/\*/g, '*' + this.uniqueMOperator).replace(/\//g, '/' + this.uniqueDOperator);
        formulaVal = formulaVal.replace(/&/g, '&' + this.uniqueConcateOperator);
        formulaVal = formulaVal.replace(/=/g, '=' + this.uniqueEqualOperator);
        formulaVal = formulaVal.replace(/\^/g, '^' + this.uniqueExpOperator);
        formulaVal = formulaVal.replace(/>/g, '>' + this.uniqueGTOperator).replace(/</g, '<' + this.uniqueLTOperator);
        return formulaVal.replace(/%/g, '%' + this.uniqueModOperator);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Get the module name.
     */
    protected getModuleName(): string {
        return 'selection';
    }

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}
