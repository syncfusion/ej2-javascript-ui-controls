import { Spreadsheet } from '../base/index';
import { contentLoaded, mouseDown, virtualContentLoaded, cellNavigate, getUpdateUsingRaf, IOffset, focusBorder } from '../common/index';
import { showAggregate, refreshImgElem, getRowIdxFromClientY, getColIdxFromClientX, clearChartBorder } from '../common/index';
import { SheetModel, getColumnsWidth, updateSelectedRange, getColumnWidth, mergedRange, activeCellMergedRange } from '../../workbook/index';
import { getRowHeight, isSingleCell, activeCellChanged, CellModel, MergeArgs, checkIsFormula, getSheetIndex } from '../../workbook/index';
import { EventHandler, addClass, removeClass, isNullOrUndefined, Browser, closest } from '@syncfusion/ej2-base';
import { BeforeSelectEventArgs, selectionComplete, getMoveEvent, getEndEvent, isTouchStart, locateElem } from '../common/index';
import { isTouchEnd, isTouchMove, getClientX, getClientY, mouseUpAfterSelection, selectRange, rowHeightChanged } from '../common/index';
import { colWidthChanged, protectSelection, editOperation, initiateFormulaReference, initiateCur, clearCellRef } from '../common/index';
import { getRangeIndexes, getCellAddress, getRangeAddress, getCellIndexes, getSwapRange } from '../../workbook/common/address';
import { addressHandle } from '../common/index';
import { isCellReference } from '../../workbook/index';
import { getIndexesFromAddress } from '../../workbook/common/address';


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
        this.parent.on(initiateFormulaReference, this.initiateFormulaSelection, this);
        this.parent.on(clearCellRef, this.clearBorder, this);
        this.parent.on(getRowIdxFromClientY, this.getRowIdxFromClientY, this);
        this.parent.on(getColIdxFromClientX, this.getColIdxFromClientX, this);
        this.parent.on(focusBorder, this.chartBorderHandler, this);
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

    private selectRange(args: { indexes: number[], skipChecking?: boolean }): void {
        this.selectRangeByIdx(
            this.parent.selectionSettings.mode === 'Single' ? args.indexes.slice(0, 2).concat(args.indexes.slice(0, 2)) : args.indexes,
            null, null, null, null, args.skipChecking);
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
        let eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        let isFormulaEdit: boolean = (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0) ||
        checkIsFormula(eventArgs.editedValue);
        if (!this.parent.isEdit || isFormulaEdit) {
            let overlayElem: HTMLElement = document.getElementById(this.parent.element.id + '_overlay');
            if (typeof((e.target as HTMLElement).className) === 'string' ) {
            if ((e.target as HTMLElement).className.indexOf('e-ss-overlay') > -1) {
                return;
            }
            } else if (overlayElem) {
                overlayElem.classList.remove('e-ss-overlay-active');
            }
            if (closest(e.target as Element, '.e-datavisualization-chart')) {
                return;
            } else {
                this.parent.notify(clearChartBorder, {});
            }
            if (this.parent.getActiveSheet().isProtected && !this.parent.getActiveSheet().protectSettings.selectCells) {
                return;
            }
            if (!closest(e.target as Element, '.e-findtool-dlg')) {
                if (this.getSheetElement().contains(e.target as Node) && !(e.target as HTMLElement).classList.contains('e-colresize')
                    && !(e.target as HTMLElement).classList.contains('e-rowresize')) {
                    let sheet: SheetModel = this.parent.getActiveSheet();
                    let mode: string = this.parent.selectionSettings.mode;
                    let rowIdx: number = this.getRowIdxFromClientY({ clientY: getClientY(e) });
                    let colIdx: number = this.getColIdxFromClientX({ clientX: getClientX(e) });
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
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (isTouchMove(e)) {
            e.preventDefault();
        }
        let eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        let isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue) ||
            (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0);
        let cont: Element = this.getScrollContent();
        let clientRect: ClientRect = cont.getBoundingClientRect();
        let clientX: number = getClientX(e); let clientY: number = getClientY(e);
        // remove math.min or handle top and left auto scroll
        let colIdx: number = this.isRowSelected ? sheet.colCount - 1 :
            this.getColIdxFromClientX({ clientX: Math.min(clientX, clientRect.right) });
        let rowIdx: number = this.isColSelected ? sheet.rowCount - 1 :
            this.getRowIdxFromClientY({ clientY: Math.min(clientY, clientRect.bottom) });
        let prevIndex: number[] = getRangeIndexes(sheet.selectedRange);
        let mergeArgs: MergeArgs = { range: [rowIdx, colIdx, rowIdx, colIdx] };
        this.parent.notify(activeCellMergedRange, mergeArgs);
        if (mergeArgs.range[2] === prevIndex[2] && mergeArgs.range[3] === prevIndex[3]) { return; }
        let isScrollDown: boolean = clientY > clientRect.bottom && rowIdx < sheet.rowCount;
        let isScrollUp: boolean = clientY < clientRect.top && rowIdx >= 0 && !this.isColSelected;
        let isScrollRight: boolean = clientX > clientRect.right && colIdx < sheet.colCount;
        let isScrollLeft: boolean = clientX < clientRect.left && colIdx >= 0 && !this.isRowSelected;
        this.clearInterval();
        if (!isFormulaEdit && !this.isColSelected && !this.isRowSelected) { prevIndex = getCellIndexes(sheet.activeCell); }
        if (isScrollDown || isScrollUp || isScrollRight || isScrollLeft) {
            this.scrollInterval = setInterval(() => {
                if ((isScrollDown || isScrollUp) && !this.isColSelected) {
                    rowIdx = this.getRowIdxFromClientY({ clientY: isScrollDown ? clientRect.bottom : clientRect.top });
                    if (rowIdx >= sheet.rowCount) { // clear interval when scroll up
                        this.clearInterval();
                        return;
                    }
                    cont.scrollTop += (isScrollDown ? 1 : -1) * getRowHeight(sheet, rowIdx);
                }
                if ((isScrollRight || isScrollLeft) && !this.isRowSelected) {
                    colIdx = this.getColIdxFromClientX({ clientX: isScrollRight ? clientRect.right : clientRect.left });
                    if (colIdx >= sheet.colCount) { // clear interval when scroll left
                        this.clearInterval();
                        return;
                    }
                    cont.scrollLeft += (isScrollRight ? 1 : -1) * getColumnWidth(sheet, colIdx);
                }
                this.selectRangeByIdx([].concat(prevIndex[0], prevIndex[1], [rowIdx, colIdx]), e);
                // tslint:disable-next-line
            }, 100);
        } else {
            this.selectRangeByIdx([].concat(prevIndex[0], prevIndex[1], [rowIdx, colIdx]), e);
        }
        if (isFormulaEdit && this.parent.isEdit) {
            let range: string = this.parent.getActiveSheet().selectedRange;
            this.parent.notify(addressHandle, { range: range, isSelect: false });
        }
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        let rowIdx: number = this.getRowIdxFromClientY({ clientY: getClientY(e) });
        let colIdx: number = this.getColIdxFromClientX({ clientX: getClientX(e) });
        this.clearInterval();
        if (isTouchEnd(e) && !(this.isColSelected || this.isRowSelected) &&
            (this.getRowIdxFromClientY({ clientY: getClientY(this.touchEvt) }) === rowIdx &&
                this.getColIdxFromClientX({ clientX: getClientX(this.touchEvt) }) === colIdx)) {
            this.mouseDownHandler(e);
        }
        this.parent.trigger('select', { range: this.parent.getActiveSheet().selectedRange });
        document.removeEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
        if (!Browser.isPointer) {
            document.removeEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt);
        }
        EventHandler.remove(document, getEndEvent(), this.mouseUpHandler);
        this.parent.notify(mouseUpAfterSelection, e);
        let eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        let isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue) ||
            (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0);
        if (isFormulaEdit && this.parent.isEdit && !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit')) {
            this.parent.notify(initiateCur, {});
        }
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

    private getColIdxFromClientX(args: { clientX: number, isImage?: boolean }): number {
        let width: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cliRect: ClientRect = this.parent.getMainContent().getBoundingClientRect();
        let left: number = 0;
        left = (args.isImage) ? args.clientX : (this.parent.enableRtl ? (cliRect.right - args.clientX) :
            (args.clientX - cliRect.left)) + this.getScrollLeft();
        for (let i: number = 0; ; i++) {
            width += getColumnsWidth(sheet, i);
            if (left < width) {
                args.clientX = i;
                return i;
            }
        }
    }

    private getRowIdxFromClientY(args: { clientY: number, isImage?: boolean }): number {
        let height: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let top: number = 0;
        top = args.isImage ? args.clientY : (args.clientY - this.parent.getMainContent().getBoundingClientRect().top)
            + this.parent.getMainContent().scrollTop;
        for (let i: number = 0; ; i++) {
            height += getRowHeight(sheet, i);
            if (top < height) {
                args.clientY = i;
                return i;
            }
        }
    }

    private initFormulaReferenceIndicator( range: number[]): void {
        if (this.parent.isEdit) {
            let forRefIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-formularef-indicator' });
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            forRefIndicator.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            locateElem(forRefIndicator, range, this.parent.getActiveSheet(), false);
            this.parent.getMainContent().appendChild(forRefIndicator);
        }
    }

    private selectRangeByIdx(
        range: number[], e?: MouseEvent, isScrollRefresh?: boolean,
        isActCellChanged?: boolean, isInit?: boolean, skipChecking?: boolean): void {
        let eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        let isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue) ||
            (eventArgs.editedValue && eventArgs.editedValue.toString().indexOf('=') === 0);
        let ele: HTMLElement = this.getSelectionElement();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
        let mergeArgs: MergeArgs = { range: [].slice.call(range), isActiveCell: false, skipChecking: skipChecking };
        let isMergeRange: boolean;
        if (!this.isColSelected && !this.isRowSelected) { this.parent.notify(mergedRange, mergeArgs); }
        if (range !== mergeArgs.range) {
            isMergeRange = true;
        }
        range = mergeArgs.range as number[];
        let args: BeforeSelectEventArgs = { range: getRangeAddress(range), cancel: false };
        this.parent.trigger('beforeSelect', args);
        if (args.cancel === true) {
            return;
        }
        if (isFormulaEdit && formulaRefIndicator) {
            formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
        }
        if (isSingleCell(range) || mergeArgs.isActiveCell) {
            if (ele) {
                ele.classList.add('e-hide');
            }
            if (isFormulaEdit && e && !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit') && this.parent.isEdit) {
                this.parent.notify(addressHandle, { range: getRangeAddress(range).split(':')[0], isSelect: true });
                this.initFormulaReferenceIndicator(range);
            }
        } else {
            if (isFormulaEdit && this.parent.isEdit) {
                if (e && !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit') && this.parent.isEdit) {
                    this.parent.notify(addressHandle, { range: getRangeAddress(range), isSelect: true });
                    this.initFormulaReferenceIndicator(range);
                }
            } else {
                if (ele) {
                    ele.classList.remove('e-hide');
                }
                let offset: { left: IOffset, top: IOffset } = (this.isColSelected && this.isRowSelected) ? undefined
                    : this.getOffset(range[2], range[3]);
                if (isMergeRange && offset) { // Need to handle half hidden merge cell in better way
                    offset.left = { idx: 0, size: 0 };
                }
                locateElem(ele, range, sheet, this.parent.enableRtl, offset);
            }
        }
        let eArgs: { action: string, sheetIndex: number } = { action: 'getCurrentEditSheetIdx', sheetIndex: null };
        this.parent.notify(editOperation, eArgs);
        if (!isFormulaEdit) {
            updateSelectedRange(this.parent, getRangeAddress(range), sheet);
        } else if (!isInit) {
            updateSelectedRange(this.parent, getRangeAddress(range), sheet);
        }
        this.UpdateRowColSelected(range);
        this.highlightHdr(range);
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
    }

    private UpdateRowColSelected(indexes: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        this.isRowSelected = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        this.isColSelected = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
    }

    private updateActiveCell(range: number[], isInit?: boolean): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell); let rowIdx: number; let colIdx: number; let cell: CellModel;
        let isMergeRange: boolean;
        if (this.isColSelected) {
            rowIdx = topLeftIdx[0]; colIdx = range[1];
            if (this.isRowSelected) { colIdx = topLeftIdx[1]; }
        } else {
            rowIdx = range[0]; colIdx = range[1];
            if (this.isRowSelected) { colIdx = topLeftIdx[1]; }
        }
        let mergeArgs: MergeArgs = { range: [rowIdx, colIdx, ...[rowIdx, colIdx]] };
        this.parent.notify(activeCellMergedRange, mergeArgs);
        if (range !== mergeArgs.range) {
            isMergeRange = true;
        }
        range = mergeArgs.range as number[];
        if (sheet.activeCell !== getCellAddress(range[0], range[1]) || isInit) {
            this.parent.setSheetPropertyOnMute(sheet, 'activeCell', getCellAddress(range[0], range[1]));
            if (this.getActiveCell()) {
                let offset: { left: IOffset, top: IOffset } = this.getOffset(range[2], range[3]);
                if (isMergeRange) {
                    offset.left = { idx: 0, size: 0 };
                }
                locateElem(this.getActiveCell(), range, sheet, this.parent.enableRtl, offset);
            }
            this.parent.notify(activeCellChanged, null);
        } else {
            locateElem(this.getActiveCell(), range, sheet, this.parent.enableRtl, this.getOffset(range[2], range[3]));
        }
    }

    private getOffset(rowIdx: number, colIdx: number): { left: IOffset, top: IOffset } {
        let offset: { left: IOffset, top: IOffset } = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
        if (this.parent.scrollModule) {
            if (colIdx >= this.parent.scrollModule.offset.left.idx) { offset.left = this.parent.scrollModule.offset.left; }
            if (rowIdx >= this.parent.scrollModule.offset.top.idx) { offset.top = this.parent.scrollModule.offset.top; }
        }
        return offset;
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
            if (selectAll) {
            removeClass([selectAll], ['e-prev-highlight-right', 'e-prev-highlight-bottom']);
            }
            if (isRowRefresh) {
                rowHdr = [].slice.call(this.parent.getRowHeaderContent().querySelectorAll('td')).slice(swapRange[0], swapRange[2] + 1);
            }
            if (isColRefresh) {
                colHdr = [].slice.call(this.parent.getColumnHeaderContent().querySelectorAll('th')).slice(swapRange[1], swapRange[3] + 1);
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

    private initiateFormulaSelection( args: { range: string, formulaSheetIdx: number }): void {
        this.processFormulaEditRange(args.range, args.formulaSheetIdx);
    }

    private processFormulaEditRange(val: string, formulaStartSheetIdx: number): void {
        let str: string;
        let actSheetIdx: number;
        let formulaSheetIdx: number = formulaStartSheetIdx;
        let lastChar: string;
        let i: number = 0;
        let parsedVal: string[] = this.parseFormula(val);
        let len: number = parsedVal.length;
        let ctrlKeyCount: number = 0;
        let formulaBorder: string[][] = [['e-vborderright', 'e-vborderbottom'], ['e-pborderright', 'e-pborderbottom'],
        ['e-cborderright', 'e-cborderbottom'], ['e-gborderright', 'e-gborderbottom'], ['e-oborderright', 'e-oborderbottom'],
        ['e-bborderright', 'e-bborderbottom']];
        this.clearBorder();
        actSheetIdx = this.parent.getActiveSheet().id - 1;
        while (i < len) {
            str = parsedVal[i];
            if (this.invalidOperators.indexOf(str) > -1) {
                break;
            }
            if (isCellReference(str.toUpperCase())) {
                str = str.replace(/\$/g, '');
                if (i > 0) {
                    if (parsedVal[i - 1].indexOf('!') === parsedVal[i - 1].length - 1) {
                        let splitStr: string[] = parsedVal[i - 1].split('!');
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
        let indices: number[] = getRangeIndexes(str);
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
        let range: number[] = getSwapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]);
        let minr: number = range[0]; let minc: number = range[1]; let maxr: number = range[2]; let maxc: number = range[3];
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
        let sheet: SheetModel = this.parent.getActiveSheet();
        let startRIndex: number = range[0]; let startCIndex: number = range[1];
        let endRIndex: number = range[2]; let endCIndex: number = range[3];
        let i: number; let rowIdx: number;
        let temp: number; let len: number;
        let tempCells: Element[] = [];
        let rowCells: HTMLCollectionOf<Element>;
        let cells: HTMLElement[] = [];
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
                    let row: Element = this.parent.getRow(rowIdx);
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
        let tdCol: HTMLElement[] = [];
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
    };


    private clearBorder(): void {
        let borderEleColl: HTMLCollectionOf<Element> =
            this.parent.element.getElementsByClassName('e-formularef-selection') as HTMLCollectionOf<Element>;
        for (let idx: number = 0; idx < borderEleColl.length; idx++) {
            let td: HTMLElement = borderEleColl[idx] as HTMLElement;
            let classArr: string[] = ['e-vborderright', 'e-vborderbottom', 'e-pborderright', 'e-pborderbottom',
                'e-cborderright', 'e-cborderbottom', 'e-gborderright', 'e-gborderbottom', 'e-oborderright',
                'e-oborderbottom', 'e-bborderright', 'e-bborderbottom'];
            for (let idx: number = 0; idx < classArr.length; idx++) {
                td.classList.remove(classArr[idx]);
            }
        }
        for (let idx: number = 0; idx < borderEleColl.length; idx++) {
            let td: HTMLElement = borderEleColl[idx] as HTMLElement;
        }
    }

    private parseFormula(formulaStr: string): string[] {
        let tempStr: string;
        let str: string;
        let len: number;
        let i: number = 0;
        let arr: string[] = [];
        formulaStr = this.markSpecialChar(formulaStr.replace('=', ''));
        let formula: string[] = formulaStr.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        len = formula.length;
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
                    let strVal: number = tempStr.indexOf('!') + 1;
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
        let code: number = str.charCodeAt(str.charAt[0]);
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