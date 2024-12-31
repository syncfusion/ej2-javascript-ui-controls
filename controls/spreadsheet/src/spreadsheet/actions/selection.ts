import { Spreadsheet } from '../base/index';
import { contentLoaded, mouseDown, virtualContentLoaded, cellNavigate, getUpdateUsingRaf, IOffset, focusBorder, positionAutoFillElement, hideAutoFillOptions, performAutoFill, selectAutoFillRange, addDPRValue, rangeSelectionByKeydown } from '../common/index';
import { showAggregate, refreshOverlayElem, getRowIdxFromClientY, getColIdxFromClientX, hideAutoFillElement, NoteSaveEventArgs, showNote } from '../common/index';
import { SheetModel, updateSelectedRange, getColumnWidth, mergedRange, activeCellMergedRange, Workbook, getSelectedRange } from '../../workbook/index';
import { getRowHeight, isSingleCell, activeCellChanged, MergeArgs, checkIsFormula, getSheetIndex } from '../../workbook/index';
import { EventHandler, addClass, removeClass, isNullOrUndefined, Browser, closest, remove, detach } from '@syncfusion/ej2-base';
import { BeforeSelectEventArgs, getMoveEvent, getEndEvent, isTouchStart, isMouseUp, isDiscontinuousRange } from '../common/index';
import { isTouchEnd, isTouchMove, getClientX, getClientY, mouseUpAfterSelection, selectRange, rowHeightChanged, completeAction } from '../common/index';
import { colWidthChanged, protectSelection, editOperation, initiateFormulaReference, initiateCur, clearCellRef, getScrollBarWidth } from '../common/index';
import { getRangeIndexes, getCellAddress, getRangeAddress, getCellIndexes, getSwapRange } from '../../workbook/common/address';
import { addressHandle, isMouseDown, isMouseMove, selectionStatus, setPosition, removeRangeEle, removeNoteContainer, setActionData } from '../common/index';
import { isCellReference, getSheetNameFromAddress, CellModel, isLocked, getColumn, getCell, updateCell, getSheetName } from '../../workbook/index';
import { getIndexesFromAddress, selectionComplete, skipHiddenIdx, parseFormulaArgument, getChartRowIdxFromClientY, getChartColIdxFromClientX } from '../../workbook/common/index';


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
    private invalidOperators: string[] = ['%'];
    private formulaRange: string[] = [];
    private dStartCell: { rowIndex: number, colIndex: number };
    private dEndCell: { rowIndex: number, colIndex: number };
    private touchSelectionStarted: boolean;
    private isautoFillClicked: boolean;
    public dAutoFillCell: string;
    /** @hidden */
    public previousActiveCell: string;
    /** @hidden */
    public isNoteActiveElement: boolean = false;
    private isNoteTouch: boolean = false;

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
        this.parent.on(getChartRowIdxFromClientY, this.getRowIdxFromClientY, this);
        this.parent.on(getChartColIdxFromClientX, this.getColIdxFromClientX, this);
        this.parent.on(focusBorder, this.chartBorderHandler, this);
        this.parent.on(selectionStatus, this.isTouchSelectionStarted, this);
        this.parent.on(rangeSelectionByKeydown, this.selectionByKeydown, this);
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
            this.parent.off(getChartRowIdxFromClientY, this.getRowIdxFromClientY);
            this.parent.off(getChartColIdxFromClientX, this.getColIdxFromClientX);
            this.parent.off(focusBorder, this.chartBorderHandler);
            this.parent.off(selectionStatus, this.isTouchSelectionStarted);
            this.parent.off(rangeSelectionByKeydown, this.selectionByKeydown);
        }
    }

    private isTouchSelectionStarted(args: { touchSelectionStarted: boolean }): void {
        args.touchSelectionStarted = this.touchSelectionStarted;
    }

    private selectionByKeydown(args: { range: number[], e: KeyboardEvent }): void {
        this.selectRangeByIdx(args.range, args.e, false, false, false, false, undefined, false);
    }

    private rowHeightChanged(args: { threshold: number, rowIdx: number }): void {
        if (!args.threshold) {
            return;
        }
        getUpdateUsingRaf((): void => {
            if (!this.parent) {
                return;
            }
            const sheet: SheetModel = this.parent.getActiveSheet();
            let ele: HTMLElement = this.getActiveCell();
            if (ele && (sheet.frozenRows || sheet.frozenColumns || sheet.selectedRange.includes(' '))) {
                this.selectRange({ address: sheet.selectedRange });
                return;
            }
            const sRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
            const mergeArgs: MergeArgs = { range: sRange, isActiveCell: false, skipChecking: true };
            let isActiveCell: boolean;
            if (ele) {
                const rowIdx: number = getCellIndexes(sheet.activeCell)[0];
                this.parent.notify(mergedRange, mergeArgs);
                if (mergeArgs.isActiveCell) {
                    const cell: CellModel = getCell(sRange[0], sRange[1], sheet, false, true);
                    isActiveCell = cell.rowSpan > 1 && sRange[0] <= args.rowIdx && sRange[2] >= args.rowIdx;
                }
                if (rowIdx === args.rowIdx || isActiveCell) {
                    ele.style.height = `${parseFloat(ele.style.height) + args.threshold}px`;
                } else if (rowIdx > args.rowIdx) {
                    ele.style.top = `${parseFloat(ele.style.top) + args.threshold}px`;
                }
            }
            ele = this.getSelectionElement();
            if (ele) {
                if (isActiveCell || (sRange[0] === sRange[2] && sRange[1] === sRange[3])) {
                    return;
                }
                const rowStart: number = sRange[0];
                const rowEnd: number = sRange[2];
                if (rowStart <= args.rowIdx && rowEnd >= args.rowIdx && ele) {
                    ele.style.height = `${parseFloat(ele.style.height) + args.threshold}px`;
                } else if (rowStart > args.rowIdx && ele) {
                    ele.style.top = `${parseFloat(ele.style.top) + args.threshold}px`;
                }
            }
        });
    }

    private colWidthChanged(args: { threshold: number, colIdx: number }): void {
        if (!args.threshold) {
            return;
        }
        getUpdateUsingRaf((): void => {
            if (!this.parent) {
                return;
            }
            const sheet: SheetModel = this.parent.getActiveSheet();
            let ele: HTMLElement = this.getActiveCell();
            const isRtl: boolean = this.parent.enableRtl;
            if (ele && (sheet.frozenRows || sheet.frozenColumns || sheet.selectedRange.includes(' '))) {
                this.selectRange({ address: sheet.selectedRange });
                return;
            }
            const sRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
            const e: MergeArgs = { range: sRange, isActiveCell: false, skipChecking: true };
            let isActiveCell: boolean;
            if (ele) {
                this.parent.notify(mergedRange, e);
                const colIdx: number = getCellIndexes(sheet.activeCell)[1];
                if (e.isActiveCell) {
                    const cell: CellModel = getCell(sRange[0], sRange[1], sheet, false, true);
                    isActiveCell = cell.rowSpan > 1 || cell.colSpan > 1;
                }
                if (colIdx === args.colIdx || isActiveCell) {
                    ele.style.width = `${parseFloat(ele.style.width) + args.threshold}px`;
                } else if (colIdx > args.colIdx) {
                    if (isRtl) {
                        ele.style.right = `${parseFloat(ele.style.right) + args.threshold}px`;
                    } else {
                        ele.style.left = `${parseFloat(ele.style.left) + args.threshold}px`;
                    }
                }
            }
            ele = this.getSelectionElement();
            if (!ele || isActiveCell || (sRange[0] === sRange[2] && sRange[1] === sRange[3])) {
                return;
            }
            const colStart: number = sRange[1]; const colEnd: number = sRange[3];
            if (colStart <= args.colIdx && colEnd >= args.colIdx && ele) {
                ele.style.width = `${parseFloat(ele.style.width) + args.threshold}px`;
            } else if (colStart > args.colIdx && ele) {
                if (isRtl) {
                    ele.style.right = `${parseFloat(ele.style.right) + args.threshold}px`;
                } else {
                    ele.style.left = `${parseFloat(ele.style.left) + args.threshold}px`;
                }
            }
        });
    }

    private selectRange(args: { address: string, skipChecking?: boolean }): void {
        args.address = this.parent.selectionSettings.mode === 'Single' ? getRangeAddress(getCellIndexes(args.address)) : args.address;
        this.selectMultiRange(args.address, null, null, args.skipChecking);
    }

    private init(): void {
        this.createSelectionElement();
        const sheet: SheetModel = this.parent.getActiveSheet();
        const sRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        const actRange: number[] = getCellIndexes(sheet.activeCell);
        const inRange: boolean = sRange[0] <= actRange[0] && sRange[2] >= actRange[0] && sRange[1] <= actRange[1]
            && sRange[3] >= actRange[1];
        this.selectMultiRange(sheet.selectedRange, true, inRange);
    }

    private selectMultiRange(address: string, isInit?: boolean, inRange?: boolean, skipChecking?: boolean): void {
        let sheetIdx: number = this.parent.activeSheetIndex;
        if (address.indexOf('!') > -1) {
            sheetIdx = getSheetIndex(this.parent as Workbook, getSheetNameFromAddress(address));
            address = address.substring(address.lastIndexOf('!') + 1);
        }
        if (this.parent.activeSheetIndex === sheetIdx) {
            address.split(' ').forEach((rng: string, idx: number) => {
                this.selectRangeByIdx(
                    getRangeIndexes(rng), { type: 'mousedown', ctrlKey: idx !== 0 } as MouseEvent, null, inRange, isInit, skipChecking);
            });
        } else {
            updateSelectedRange(this.parent as Workbook, address, this.parent.sheets[sheetIdx as number]);
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
        this.isNoteActiveElement = !isNullOrUndefined(document) && !isNullOrUndefined(document.activeElement) &&
            typeof document.activeElement.className === 'string' && document.activeElement.className.indexOf('e-addNoteContainer') > -1;
        if (closest(e.target as Element, '.e-scrollbar') || (e.target as Element).classList.contains('e-main-panel') ||
            (e.target as Element).classList.contains('e-sheet')) { return; }
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean =  checkIsFormula(eventArgs.editedValue, true);
        const isNoteCellIndex: boolean = this.parent.enableNotes && !isNullOrUndefined(this.parent.spreadsheetNoteModule.noteCellIndexes);
        const cellIndexes: number[] = isNoteCellIndex ? this.parent.spreadsheetNoteModule.noteCellIndexes :
            getCellIndexes(this.parent.getActiveSheet().activeCell);
        const targetElement: HTMLElement = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (!isNullOrUndefined(targetElement) && targetElement.children !== null && targetElement.children.length > 0
            && this.isNoteActiveElement && targetElement.children[targetElement.children.length - 1].classList.contains('e-addNoteIndicator')) {
            const cell: CellModel = getCell(cellIndexes[0], cellIndexes[1], sheet);
            const eventAction: string = !isNullOrUndefined(cell) && cell.notes ? 'editNote' : 'addNote';
            const noteContainer: HTMLTextAreaElement  = document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement;
            const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' + getRangeAddress(cellIndexes);
            if (!isNullOrUndefined(noteContainer) && !isNullOrUndefined(noteContainer.value) && (e.target as HTMLElement).className !== 'e-addNoteContainer'
                && ((isNullOrUndefined(cell) || isNullOrUndefined(cell.notes)) || (cell.notes !== noteContainer.value))) {
                this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: address } } });
                updateCell(
                    this.parent, this.parent.getActiveSheet(), { rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true,
                        cell: { notes: noteContainer.value, isNoteEditable:  false }});
                const eventArgs : NoteSaveEventArgs =  { notes: noteContainer.value, address: address};
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: eventAction });
            } else if ((e.target as HTMLElement).className !== 'e-addNoteContainer') {
                updateCell(
                    this.parent, this.parent.getActiveSheet(), { rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true,
                        cell: { isNoteEditable: false }});
            }
            this.parent.spreadsheetNoteModule.isShowNote = null;
        }
        if (!this.isNoteTouch && (e.target as HTMLElement).className !== 'e-addNoteContainer' && document.getElementsByClassName('e-addNoteContainer') && document.getElementsByClassName('e-addNoteContainer').length > 0){
            this.parent.notify(removeNoteContainer, '');
        }
        if (this.isNoteTouch && e.type.indexOf('mouse') > -1) {
            this.isNoteTouch = false;
        }
        if (!this.parent.isEdit || isFormulaEdit) {
            const overlayElem: HTMLElement = document.getElementById(this.parent.element.id + '_overlay');
            if (typeof((e.target as HTMLElement).className) === 'string' ) {
                if ((e.target as HTMLElement).className.indexOf('e-ss-overlay') > -1) { return; }
            } else if (overlayElem) {
                overlayElem.classList.remove('e-ss-overlay-active');
            }
            if (closest(e.target as Element, '.e-datavisualization-chart')) { return; }
            if (sheet.isProtected && !sheet.protectSettings.selectCells && !sheet.protectSettings.selectUnLockedCells) {
                return;
            }
            if (!(closest(e.target as Element, '.e-findtool-dlg') || closest(e.target as Element, '.e-dragfill-ddb'))) {
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
                    if ((e.target as HTMLElement).classList.contains('e-autofill')) {
                        this.isautoFillClicked = true;
                        const autoFillDdb: Element = (e.target as HTMLElement).parentElement &&
                            (e.target as HTMLElement).parentElement.querySelector('.e-dragfill-ddb');
                        if (!autoFillDdb || autoFillDdb.classList.contains('e-hide')) {
                            this.dAutoFillCell = sheet.selectedRange;
                        }
                    }
                    const topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell);
                    let range: number[];
                    if (isRowSelected) {
                        this.isRowSelected = true;
                        if (!e.shiftKey || mode === 'Single') {
                            this.startCell = [rowIdx, 0];
                        }
                        range = [this.startCell[0], sheet.frozenColumns ? topLeftIdx[1] : 0, rowIdx, sheet.colCount - 1];
                    } else if (isColSelected) {
                        this.isColSelected = true;
                        if (!e.shiftKey || mode === 'Single') {
                            this.startCell = [0, colIdx];
                        }
                        range = [sheet.frozenRows ? topLeftIdx[0] : 0, this.startCell[1], sheet.rowCount - 1, colIdx];
                    } else if (closest(e.target as Element, '.e-select-all-cell')) {
                        this.startCell = [sheet.frozenRows ? topLeftIdx[0] : 0, sheet.frozenColumns ? topLeftIdx[1] : 0];
                        range = [].concat(this.startCell, [sheet.rowCount - 1, sheet.colCount - 1]);
                    } else if (!(e.target as Element).classList.contains('e-sheet-content')) {
                        if (!e.shiftKey || mode === 'Single') {
                            this.startCell = [rowIdx, colIdx];
                        }
                        if (!this.isautoFillClicked && !closest(e.target as Element, '.e-filloption')) {
                            range = [].concat(this.startCell ? this.startCell : getCellIndexes(sheet.activeCell), [rowIdx, colIdx]);
                        }
                    }
                    if (isTouchStart(e) && !(isRowSelected || isColSelected) && range) {
                        const colRowSelectArgs: { isRowSelected: boolean, isColSelected: boolean } = this.isRowColSelected(range);
                        this.isRowSelected = colRowSelectArgs.isRowSelected; this.isColSelected = colRowSelectArgs.isColSelected;
                    }
                    const preventEvt: boolean = e.ctrlKey && range && sheet.selectedRange.includes(getRangeAddress(range));
                    if (!preventEvt && mode === 'Multiple' && (!isTouchEnd(e) && (!isTouchStart(e) ||
                        (isTouchStart(e) && activeIdx[0] === rowIdx && activeIdx[1] === colIdx)) || isColSelected || isRowSelected)) {
                        document.addEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
                        if (!Browser.isPointer) {
                            if (Browser.isIos && isTouchStart(e) && e.target && (e.target as HTMLElement).classList.contains('e-cell')) {
                                e.preventDefault();
                            }
                            document.addEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt, { passive: false });
                        }
                        this.touchSelectionStarted = true;
                    } else {
                        this.touchSelectionStarted = false;
                    }
                    if (!isTouchEnd(e)) {
                        if (preventEvt) {
                            if (this.parent.isEdit) {
                                const updateFormulaCurPos: Function = (e: MouseEvent & TouchEvent): void => {
                                    EventHandler.remove(document, getEndEvent(), updateFormulaCurPos);
                                    this.updateFormulaCursorPosition(e);
                                };
                                EventHandler.add(document, getEndEvent(), updateFormulaCurPos, this);
                            }
                        } else {
                            EventHandler.add(document, getEndEvent(), this.mouseUpHandler, this);
                        }
                    }
                    const isNoteAvailable: boolean = ((e.target as HTMLElement).className === 'e-addNoteIndicator' ||
                        ((e.target as HTMLElement).children.length > 0 && (e.target as HTMLElement).children[(e.target as HTMLElement).childElementCount - 1].className.indexOf('e-addNoteIndicator') > -1));
                    if (isTouchStart(e) && isNoteAvailable) {
                        const cellIndexes: number[] = getCellIndexes(getRangeAddress(range).split(':')[0]);
                        this.parent.notify(showNote, { rowIndex: cellIndexes[0], columnIndex: cellIndexes[1], isNoteEditable: false });
                        this.isNoteTouch = true;
                        this.parent.spreadsheetNoteModule.isNoteVisibleOnTouch = true;
                    }
                    if (isTouchStart(e) && !(isColSelected || isRowSelected)) {
                        this.touchEvt = e;
                        return;
                    }
                    if (range) {
                        this.selectRangeByIdx(range, e);
                    }
                    if (!this.isNoteTouch && e.type.indexOf('mouse') > -1 && isNoteAvailable) {
                        const cellIndexes: number[] = getCellIndexes(getRangeAddress(range).split(':')[0]);
                        this.parent.notify(showNote, { rowIndex: cellIndexes[0], columnIndex: cellIndexes[1], isNoteEditable: false });
                        this.parent.spreadsheetNoteModule.isNoteVisible = true;
                    }
                    if (this.parent.isMobileView()) {
                        this.parent.element.classList.add('e-mobile-focused');
                        this.parent.renderModule.setSheetPanelSize();
                    }
                }
            }
        }
        if (isFormulaEdit && ((e.target as HTMLElement).classList.contains('e-cell') || (e.target as HTMLElement).classList.contains('e-wrap-content') ||
            (e.target as HTMLElement).classList.contains('e-header-cell')) && this.parent.isEdit) {
            let range: string = this.parent.getActiveSheet().selectedRange;
            const lastRange: string[] = range.split(' ');
            range = isSingleCell(getIndexesFromAddress(lastRange[lastRange.length - 1])) ? lastRange[lastRange.length - 1].split(':')[0] : lastRange[lastRange.length - 1];
            this.parent.notify(addressHandle, { range: range, isSelect: false, isMouseDown: e.ctrlKey });
        }
    }

    private mouseMoveHandler(e: MouseEvent & TouchEvent): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (isTouchMove(e)) {
            e.preventDefault();
        }
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue, true);
        const verticalContent: Element = this.parent.getMainContent().parentElement;
        const horizontalContent: Element = this.parent.element.getElementsByClassName('e-scroller')[0];
        const clientRect: ClientRect = verticalContent.getBoundingClientRect(); const frozenCol: number = this.parent.frozenColCount(sheet);
        let left: number = clientRect.left + this.parent.sheetModule.getRowHeaderWidth(sheet, false, true);
        let right: number = clientRect.right - getScrollBarWidth();
        const top: number = clientRect.top; const bottom: number = clientRect.bottom;
        const clientX: number = getClientX(e); const clientY: number = getClientY(e);
        // remove math.min or handle top and left auto scroll
        let colIdx: number = this.isRowSelected ? sheet.colCount - 1 :
            this.getColIdxFromClientX({ clientX: clientX, target: e.target as Element });
        let rowIdx: number = this.isColSelected ? sheet.rowCount - 1 :
            this.getRowIdxFromClientY({ clientY: clientY, target: e.target as Element });
        let prevIndex: number[];
        let rangeIndex: number[];
        if (e.ctrlKey) {
            const selRanges: string[] = sheet.selectedRange.split(' ');
            prevIndex = getRangeIndexes(selRanges[selRanges.length - 1]);
        } else {
            prevIndex = getRangeIndexes(sheet.selectedRange);
        }
        if (Browser.isDevice) {
            const screenWidth: number = screen.availWidth;
            if (right >= screenWidth - 40) {
                right -= (40 - (screenWidth - right));
            }
            if (!sheet.showHeaders && left < 40) {
                left += (40 - left);
            }
        }
        const mergeArgs: MergeArgs = { range: [rowIdx, colIdx, rowIdx, colIdx] };
        this.parent.notify(activeCellMergedRange, mergeArgs);
        if (mergeArgs.range[2] === prevIndex[2] && mergeArgs.range[3] === prevIndex[3] && clientY <= bottom && clientY >= top &&
            clientX <= right && clientX >= left) {
            return;
        }
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        if (!isFormulaEdit) { prevIndex = getCellIndexes(sheet.activeCell); }
        const isScrollDown: boolean = clientY > bottom && !this.isColSelected && rowIdx < sheet.rowCount;
        const isScrollUp: boolean = clientY < top && rowIdx >= 0 && !this.isColSelected &&
            !!verticalContent.scrollTop && (!frozenRow || prevIndex[0] >= frozenRow);
        const isScrollRight: boolean = clientX > right && !this.isRowSelected && colIdx < sheet.colCount;
        const isScrollLeft: boolean = clientX < left && colIdx >= 0 && !this.isRowSelected &&
            !!horizontalContent.scrollLeft && (!frozenCol || prevIndex[1] >= frozenCol);
        this.clearInterval(); let scrollUpRowIdx: number; let scrollUpColIdx: number;
        if (isScrollDown || isScrollUp || isScrollRight || isScrollLeft) {
            if (isScrollUp || isScrollLeft) { scrollUpRowIdx = rowIdx; scrollUpColIdx = colIdx; }
            const scrollSelection: Function = () => {
                if (isScrollDown || isScrollUp) {
                    rowIdx = this.getRowIdxFromClientY({ clientY: isScrollDown ? bottom : top });
                    if (rowIdx >= sheet.rowCount) { // clear interval when scroll up
                        this.clearInterval();
                        return;
                    }
                    verticalContent.scrollTop += (isScrollDown ? 1 : -1) * getRowHeight(sheet, rowIdx);
                }
                if (isScrollRight || isScrollLeft) {
                    colIdx = this.getColIdxFromClientX({ clientX: isScrollRight ? right : left, isFScroll: true });
                    if (colIdx >= sheet.colCount) { // clear interval when scroll left
                        this.clearInterval();
                        return;
                    }
                    horizontalContent.scrollLeft += (isScrollRight ? 1 : -1) * getColumnWidth(sheet, colIdx);
                }
                if ((isScrollUp && sheet.frozenRows && !verticalContent.scrollTop) ||
                    (isScrollLeft && sheet.frozenColumns && !horizontalContent.scrollLeft)) {
                    this.selectRangeByIdx([].concat(prevIndex[0], prevIndex[1], [scrollUpRowIdx, scrollUpColIdx]), e);
                    this.clearInterval(); return;
                }
                this.selectRangeByIdx([].concat(prevIndex[0], prevIndex[1], [rowIdx, colIdx]), e);
            };
            scrollSelection();
            this.scrollInterval = setInterval(() => {
                scrollSelection();
                this.clearInterval();
                this.scrollInterval = setInterval(scrollSelection, 100);
            });
        } else {
            let indexes: number[] = [].concat(prevIndex[0], prevIndex[1], [rowIdx, colIdx]);
            if (frozenRow && indexes[0] < frozenRow && indexes[2] >= frozenRow && verticalContent.scrollTop) {
                verticalContent.scrollTop = 0; indexes[2] = frozenRow;
            }
            if (frozenCol && indexes[1] < frozenCol && indexes[3] >= frozenCol && horizontalContent.scrollLeft) {
                horizontalContent.scrollLeft = 0; indexes[3] = frozenCol;
            }
            if (this.isautoFillClicked) {
                if ((e.target as HTMLElement).classList.contains('e-autofill')) {
                    this.dAutoFillCell = sheet.selectedRange;
                }
                const args: {e: MouseEvent & TouchEvent, indexes?: number[] } = { e: e, indexes: null };
                this.parent.notify(selectAutoFillRange, args);
                indexes = args.indexes;
                rangeIndex = indexes;
            }
            this.selectRangeByIdx(indexes, e);
        }
        if (isFormulaEdit && this.parent.isEdit && !closest(e.target as Element, '#' + this.parent.element.id + '_edit')) {
            let range: string;
            if (this.isautoFillClicked) {
                range = getRangeAddress(rangeIndex);
            } else {
                range = this.parent.getActiveSheet().selectedRange;
            }
            const lastRange: string[] = range.split(' ');
            this.parent.notify(addressHandle, { range: lastRange[lastRange.length - 1], isSelect: false });
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
        document.removeEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
        if (!Browser.isPointer) {
            document.removeEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt);
        }
        EventHandler.remove(document, getEndEvent(), this.mouseUpHandler);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenRows || sheet.frozenColumns) {
            removeRangeEle(this.parent.element, null, 'e-cur-selection', true, true);
        }
        this.parent.notify(mouseUpAfterSelection, e);
        if (this.isautoFillClicked) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const indexes: number[] = getRangeIndexes(sheet.selectedRange);
            if (!(this.isColSelected && indexes[1] === colIdx) && !(this.isRowSelected && indexes[0] === rowIdx)) {
                const autoFillDdb: Element = (e.target as HTMLElement).parentElement &&
                    (e.target as HTMLElement).parentElement.querySelector('.e-dragfill-ddb');
                if (!autoFillDdb || autoFillDdb.classList.contains('e-hide')) {
                    this.dAutoFillCell = sheet.selectedRange;
                }
                this.parent.notify(performAutoFill, { event: e, dAutoFillCell: this.dAutoFillCell });
            }
            this.isautoFillClicked = false;
        } else if (!e.ctrlKey && !isDiscontinuousRange(getSelectedRange(this.parent.getActiveSheet()))) {
            this.parent.notify(positionAutoFillElement, null);
        } else {
            this.parent.notify(hideAutoFillElement, null);
        }
        this.updateFormulaCursorPosition(e);
    }

    private updateFormulaCursorPosition(e: MouseEvent & TouchEvent): void {
        if (this.parent.isEdit) {
            const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
            this.parent.notify(editOperation, eventArgs);
            const isFormulaEdit: boolean = checkIsFormula(eventArgs.editedValue, true);
            if (isFormulaEdit) {
                this.parent.notify(initiateCur, { isCellEdit: (e.target as HTMLElement).classList.contains('e-spreadsheet-edit') });
            }
        }
    }

    private isSelected(rowIdx: number, colIdx: number): boolean {
        let isSelected: boolean = false; let indexes: number[];
        const ranges: string[] = this.parent.getActiveSheet().selectedRange.split(' ');
        for (let i: number = 0; i < ranges.length; i++) {
            indexes = getSwapRange(getRangeIndexes(ranges[i as number]));
            if (indexes[0] <= rowIdx && rowIdx <= indexes[2] && indexes[1] <= colIdx && colIdx <= indexes[3]) {
                isSelected = true; break;
            }
        }
        return isSelected;
    }

    private virtualContentLoadedHandler(args: { prevRowColCnt: SheetModel }): void { // do only for scroll down
        const sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[];
        let isColSelected: boolean; let isRowSelected: boolean;
        sheet.selectedRange.split(' ').forEach((rng: string, idx: number) => {
            indexes = getRangeIndexes(rng);
            isRowSelected = (indexes[1] === 0 && indexes[3] === args.prevRowColCnt.colCount - 1);
            isColSelected = (indexes[0] === 0 && indexes[2] === args.prevRowColCnt.rowCount - 1);
            if (isRowSelected || isColSelected) {
                if (isColSelected && isRowSelected) {
                    indexes = [0, 0, sheet.rowCount - 1, sheet.colCount - 1];
                } else if (isColSelected) {
                    indexes = [0, indexes[1], sheet.rowCount - 1, indexes[3]];
                } else {
                    indexes = [indexes[0], 0, indexes[2], sheet.colCount - 1];
                }
                if (sheet.frozenRows || sheet.frozenColumns) {
                    this.selectRangeByIdx(
                        indexes, <MouseEvent>{ type: 'mousedown', ctrlKey: idx !== 0 }, false, false, false, false, undefined, true);
                } else {
                    this.selectRangeByIdx(indexes, null, true, null, null, null, idx);
                }
            } else {
                indexes = getRangeIndexes(rng);
                const topIdx: number = this.parent.viewport.topIndex + this.parent.frozenRowCount(sheet);
                const leftIdx: number = this.parent.viewport.leftIndex + this.parent.frozenColCount(sheet);
                this.highlightHdr(
                    indexes, idx === 0 ? false : true,
                    indexes[0] >= topIdx || indexes[2] >= topIdx, indexes[1] >= leftIdx || indexes[3] >= leftIdx);
            }
        });
    }

    private clearInterval(): void {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }
    }

    private getScrollLeft(): number {
        return this.parent.scrollModule ? this.parent.scrollModule.prevScroll.scrollLeft : 0;
    }

    private cellNavigateHandler(args: { range?: number[], preventAnimation?: boolean, shiftKey?: boolean, type?: string }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected && !sheet.protectSettings.selectCells && !sheet.protectSettings.selectUnLockedCells) {
            return;
        }
        args.type = 'mousedown';
        this.selectRangeByIdx(args.range, <MouseEvent>args, false, false, false, false, undefined, args.preventAnimation);
    }

    private getColIdxFromClientX(e: { clientX: number, isImage?: boolean, target?: Element, size?: number, isFScroll?: boolean }): number {
        let width: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        let left: number = 0;
        if (e.isImage) {
            left = e.clientX;
        } else {
            const cliRect: ClientRect = document.getElementById(this.parent.element.id + '_sheet').getBoundingClientRect();
            if (this.parent.enableRtl) {
                left = (cliRect.right - this.parent.sheetModule.getRowHeaderWidth(sheet, true, true) - 1) - e.clientX;
            } else {
                left = e.clientX - (cliRect.left + this.parent.sheetModule.getRowHeaderWidth(sheet, true, true) + 1);
            }
            left += this.parent.viewport.beforeFreezeWidth;
            const frozenColPosition: Function = (): number => {
                const frozenCol: HTMLElement = <HTMLElement>this.parent.element.querySelector('.e-frozen-column');
                return parseInt(frozenCol.style[this.parent.enableRtl ? 'right' : 'left'], 10) / this.parent.viewport.scaleX;
            };
            if ((!e.target || (!closest(e.target, '.e-row-header') && !closest(e.target, '.e-selectall-container')) ||
                this.isScrollableArea(e.clientX, e.target, true)) && (!this.parent.frozenColCount(sheet) ||
                    left > frozenColPosition() || e.isFScroll)) {
                left += (this.getScrollLeft() / this.parent.viewport.scaleX);
            }
        }
        let size: number;
        for (let i: number = 0; ; i++) {
            size = width += getColumnWidth(sheet, i, null, !e.isImage) / this.parent.viewport.scaleX;
            if (left < (e.isImage ? Number(addDPRValue(size).toFixed(2)) : size) ||
                (this.parent.scrollSettings.isFinite && i === sheet.colCount - 1)) {
                if (!e.isImage) { e.size = left; }
                e.clientX = i;
                return i;
            }
        }
    }

    private isScrollableArea(offset: number, target: Element, isclientX?: boolean): boolean {
        if (!target.classList.contains('e-table')) { return false; }
        if (isclientX) {
            return offset > this.parent.getMainContent().getBoundingClientRect().left;
        } else {
            return offset > this.parent.getMainContent().parentElement.getBoundingClientRect().top;
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
                (sheetEle.getBoundingClientRect().top + (sheet.showHeaders ? 31 / this.parent.viewport.scaleY : 0));
            if (!args.target || !closest(args.target, '.e-header-panel') || this.isScrollableArea(args.clientY, args.target)) {
                top += (this.parent.getMainContent().parentElement.scrollTop / this.parent.viewport.scaleY);
            }
        }
        let size: number;
        for (let i: number = 0; ; i++) {
            size = height += getRowHeight(sheet, i, !args.isImage) / this.parent.viewport.scaleY;
            if (top < (args.isImage ? Number(addDPRValue(size).toFixed(2)) : size) ||
                (this.parent.scrollSettings.isFinite && i === sheet.rowCount - 1)) {
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

    private isMouseEvent(e: MouseEvent): boolean {
        return isMouseDown(e) || isMouseUp(e) || isMouseMove(e);
    }

    private selectRangeByIdx(
        range: number[], e?: MouseEvent | KeyboardEvent, isScrollRefresh?: boolean,
        isActCellChanged?: boolean, isInit?: boolean, skipChecking?: boolean, selectedRowColIdx?: number,
        preventAnimation?: boolean): void {
        const isMouseEvent: boolean = e && this.isMouseEvent(e as MouseEvent);
        if (e && e.target && isMouseEvent && closest(e.target as Element, '#' + this.parent.element.id + '_edit')) { return; }
        const eventArgs: { action: string, editedValue: string, endFormulaRef: boolean } = { action: 'getCurrentEditValue', editedValue: '',
            endFormulaRef: false };
        this.parent.notify(editOperation, eventArgs);
        const isFormulaEdit: boolean = (this.parent.isEdit ? checkIsFormula(eventArgs.editedValue, true) : false) &&
            !eventArgs.endFormulaRef;
        const isMultiRange: boolean = e && e.ctrlKey && isMouseDown(e as MouseEvent);
        let ele: HTMLElement;
        if (!isMultiRange) {
            ele = this.getSelectionElement(e as MouseEvent, selectedRowColIdx);
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell);
        const formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
        const mergeArgs: MergeArgs = { range: [].slice.call(range), isActiveCell: false, skipChecking: skipChecking };
        let isMergeRange: boolean;
        let rowColSelectArgs: { isRowSelected: boolean, isColSelected: boolean } = this.isRowColSelected(range);
        if (!rowColSelectArgs.isColSelected && !rowColSelectArgs.isRowSelected) {
            this.parent.notify(mergedRange, mergeArgs);
        }
        if (range !== mergeArgs.range) {
            isMergeRange = true;
        }
        range = mergeArgs.range as number[];
        let promise: Promise<null> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        const args: BeforeSelectEventArgs = { range: getRangeAddress(range), cancel: false };
        if (sheet.isProtected) {
            const protectCell: CellModel = getCell(range[2], range[3], sheet);
            if (sheet.protectSettings.selectUnLockedCells && !sheet.protectSettings.selectCells) {
                if (!isNullOrUndefined(protectCell)) {
                    if ((protectCell.isLocked === true || isNullOrUndefined(protectCell.isLocked))) {
                        return;
                    } else {
                        const sheetEle: Element = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
                        if (sheetEle && sheetEle.classList.contains('e-protected')) {
                            sheetEle.classList.remove('e-protected');
                        }
                    }
                } else if (!sheet.protectSettings.selectCells) {
                    return;
                }
            }
        }
        this.parent.trigger('beforeSelect', args);
        if (args.cancel) { return; }
        if (isFormulaEdit && formulaRefIndicator) {
            formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
        }
        this.parent.notify(hideAutoFillOptions, null );
        if ((isSingleCell(range) || mergeArgs.isActiveCell) && !isMultiRange) {
            if (ele) {
                if (!ele.classList.contains('e-multi-range')) {
                    ele.classList.add('e-hide');
                }
                if (sheet.frozenRows || sheet.frozenColumns) {
                    const clsName: string = isMouseMove(e as MouseEvent) ? 'e-cur-selection' : 'e-selection';
                    removeRangeEle(this.parent.getSelectAllContent(), null, clsName, true);
                    removeRangeEle(this.parent.getColumnHeaderContent(), null, clsName, true);
                    removeRangeEle(this.parent.getRowHeaderContent(), null, clsName, true);
                }
            }
            if (!sheet.frozenColumns && !sheet.frozenRows && ele) {
                setPosition(this.parent, ele, range);
            }
            if (isFormulaEdit && e && e.target && (!isMouseEvent || !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit'))
                && this.parent.isEdit) {
                const addRefArgs: { range: string, isSelect: boolean, isAlertDlgOpen?: boolean } = {
                    range: getRangeAddress(range).split(':')[0], isSelect: true
                };
                this.parent.notify(addressHandle, addRefArgs);
                if (addRefArgs.isAlertDlgOpen) {
                    return;
                }
                this.initFormulaReferenceIndicator(range);
            }
        } else {
            if (isMultiRange) {
                if (selectedRowColIdx === undefined) {
                    let selRange: string = getRangeAddress(range);
                    if (sheet.selectedRange.includes(selRange) && !isFormulaEdit) {
                        const selRanges: string[] = sheet.selectedRange.split(' ');
                        if (selRanges.length > 1) {
                            selRanges.splice(selRanges.indexOf(selRange), 1); selRange = selRanges.join(' ');
                        } else {
                            selRange = sheet.activeCell + ':' + sheet.activeCell;
                        }
                        this.selectRange({ address: selRange });
                        return;
                    } else {
                        ele = this.getSelectionElement(e as MouseEvent, selectedRowColIdx);
                    }
                } else {
                    ele = this.getSelectionElement(e as MouseEvent, selectedRowColIdx);
                }
            }
            if (isFormulaEdit && this.parent.isEdit) {
                if (e && e.target && (!isMouseEvent || !(e.target as HTMLElement).classList.contains('e-spreadsheet-edit')) && this.parent.isEdit) {
                    const addRefArgs: { range: string, isSelect: boolean, isAlertDlgOpen?: boolean } = {
                        range: getRangeAddress(range), isSelect: true
                    };
                    this.parent.notify(addressHandle, addRefArgs);
                    if (addRefArgs.isAlertDlgOpen) {
                        return;
                    }
                    this.initFormulaReferenceIndicator(range);
                }
            } else {
                let clsName: string;
                if (ele) {
                    ele.classList.remove('e-hide');
                    if (sheet.frozenRows || sheet.frozenColumns) {
                        if (e && e.target || isMultiRange) {
                            clsName = 'e-cur-selection';
                            if (isMouseMove(e as MouseEvent) && ele.classList.contains('e-cur-selection')) {
                                ele.classList.add('e-hide');
                            } else {
                                ele.classList.add(clsName);
                            }
                        }
                        if (!isMultiRange && (this.isColSelected || this.isRowSelected) && isMouseDown(e as MouseEvent)) {
                            removeRangeEle(this.parent.getSelectAllContent(), null, 'e-selection');
                            removeRangeEle(this.parent.getColumnHeaderContent(), null, 'e-selection');
                            removeRangeEle(this.parent.getRowHeaderContent(), null, 'e-selection');
                        }
                    }
                }
                const offset: { left: IOffset, top: IOffset } = (this.isColSelected && this.isRowSelected) ? undefined
                    : this.getOffset(range[2], range[3]);
                if (isMergeRange && offset) { // Need to handle half hidden merge cell in better way
                    offset.left = { idx: 0, size: 0 };
                }
                promise = setPosition(
                    this.parent, ele, range, clsName, preventAnimation, isMultiRange,  isMultiRange && !e.target) as Promise<null> ||
                    promise;
            }
        }
        const eArgs: { action: string, sheetIndex: number } = { action: 'getCurrentEditSheetIdx', sheetIndex: null };
        this.parent.notify(editOperation, eArgs);
        if (sheet.frozenColumns && range[1] > 0 && range[1] === topLeftIdx[1] && range[3] === sheet.colCount - 1) {
            range[1] = 0;
        }
        if (sheet.frozenRows && range[0] > 0 && range[0] === topLeftIdx[0] && range[2] === sheet.rowCount - 1) {
            range[0] = 0;
        }
        let selRange: string = getRangeAddress(range);
        if (e && e.ctrlKey && (isMouseMove(e as MouseEvent) || isMouseUp(e as MouseEvent)) && !isFormulaEdit) {
            selRange = sheet.selectedRange.slice(0, sheet.selectedRange.lastIndexOf(' ')) + ' ' + selRange;
        } else if (selectedRowColIdx > -1) {
            const selRanges: string[] = sheet.selectedRange.split(' ');
            selRanges[selectedRowColIdx as number] = selRange;
            selRange = selRanges.join(' ');
        }
        if (!isFormulaEdit && !this.isautoFillClicked) {
            let isSelectRangeChange: boolean = false;
            if (sheet.selectedRange !== selRange) {
                isSelectRangeChange = true;
            }
            updateSelectedRange(this.parent as Workbook, selRange, sheet, isMultiRange);
            if (isSelectRangeChange) {
                promise.then((): void => {
                    if (this.parent) {
                        this.parent.trigger('select', { range: this.parent.getActiveSheet().selectedRange });
                    }
                });
            }
        } else if (!isInit && !this.isautoFillClicked) {
            updateSelectedRange(this.parent as Workbook, selRange, sheet, isMultiRange);
        }
        rowColSelectArgs = this.isRowColSelected(range);
        this.isRowSelected = rowColSelectArgs.isRowSelected; this.isColSelected = rowColSelectArgs.isColSelected;
        this.highlightHdr(range, e && e.ctrlKey);
        if (!isScrollRefresh && !(e && (e.type === 'mousemove' || isTouchMove(e)))) {
            if (!isFormulaEdit) {
                this.updateActiveCell(isActCellChanged ? getRangeIndexes(sheet.activeCell) : range, isInit, preventAnimation);
            } else if (eArgs.sheetIndex === this.parent.getActiveSheet().id - 1 && isInit) {
                isActCellChanged = true;
                this.updateActiveCell(isActCellChanged ? getRangeIndexes(sheet.activeCell) : range, isInit, preventAnimation);
            } else if (!this.parent.isEdit) {
                this.updateActiveCell(isActCellChanged ? getRangeIndexes(sheet.activeCell) : range, isInit, preventAnimation);
            }
        }
        if (isNullOrUndefined(e)) { e = <MouseEvent>{ type: 'mousedown' }; }
        if (!isFormulaEdit) {
            this.parent.notify(selectionComplete, e);
        } else if (!isInit) {
            this.parent.notify(selectionComplete, e);
        }
        if (!isMultiRange && !isDiscontinuousRange(getSelectedRange(this.parent.getActiveSheet()))) {
            this.parent.notify(positionAutoFillElement, { preventAnimation: preventAnimation });
        } else {
            this.parent.notify(hideAutoFillElement, null);
        }
        if (this.parent.showAggregate) {
            this.parent.notify(showAggregate, {});
        }
        this.parent.notify(refreshOverlayElem, null);
    }

    private isRowColSelected(indexes: number[]): { isRowSelected: boolean, isColSelected: boolean } {
        const sheet: SheetModel = this.parent.getActiveSheet();
        return { isRowSelected: indexes[1] === 0 && indexes[3] === sheet.colCount - 1,
            isColSelected: indexes[0] === 0 && indexes[2] === sheet.rowCount - 1 };
    }

    private updateActiveCell(range: number[], isInit?: boolean, preventAnimation?: boolean): void {
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
            this.previousActiveCell = sheet.activeCell.indexOf(':') > -1 ? this.previousActiveCell : sheet.activeCell ;
            this.parent.setSheetPropertyOnMute(sheet, 'activeCell', getCellAddress(range[0], range[1]));
            if (sheet.isProtected) {
                const element: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
                const cell: CellModel = getCell(range[0], range[1], sheet);
                const isCellLocked: boolean = isLocked(cell, getColumn(sheet, range[1]));
                if (isCellLocked && element && !element.disabled) {
                    element.disabled = true;
                } else if (!isCellLocked && element && element.disabled) {
                    element.disabled = false;
                }
            }
            if (this.getActiveCell()) {
                const offset: { left: IOffset, top: IOffset } = this.getOffset(range[2], range[3]);
                if (isMergeRange) {
                    offset.left = { idx: 0, size: 0 };
                }
                setPosition(this.parent, this.getActiveCell(), range, 'e-active-cell', preventAnimation);
            }
            this.parent.notify(activeCellChanged, null);
        } else {
            setPosition(this.parent, this.getActiveCell(), range, 'e-active-cell', preventAnimation);
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
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (e && e.ctrlKey && !this.parent.isEdit) {
            if (isMouseUp(e) || isMouseMove(e)) {
                if (sheet.frozenColumns || sheet.frozenRows) {
                    let ele: HTMLElement = this.parent.getMainContent().querySelector('.e-cur-selection');
                    if (ele) {
                        return ele;
                    } else {
                        ele = this.parent.element.querySelector('.e-multi-range');
                        return ele && ele.cloneNode() as HTMLElement;
                    }
                } else {
                    return this.parent.getMainContent().querySelector('.e-selection:last-child');
                }
            } else {
                const selElem: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-selection')[0] as HTMLElement;
                const ele: HTMLElement = selElem.cloneNode() as HTMLElement;
                ele.classList.add('e-multi-range');
                if (sheet.frozenColumns || sheet.frozenRows) {
                    if (!sheet.selectedRange.includes(' ')) {
                        selElem.classList.remove('e-hide');
                        setPosition(this.parent, selElem, getSwapRange(getRangeIndexes(sheet.selectedRange)), undefined, false, true);
                    }
                    if (!this.parent.getMainContent().querySelector('.e-multi-range') && selElem.classList.contains('e-hide')) {
                        return selElem;
                    }
                    return ele;
                } else {
                    selElem.classList.remove('e-hide');
                    return this.parent.getMainContent().appendChild(ele);
                }
            }
        } else if (selectedRowColIdx > -1) {
            return ((sheet.frozenRows || sheet.frozenColumns) ?
                this.parent.element.querySelector('.e-sheet').getElementsByClassName('e-selection')[selectedRowColIdx as number] :
                this.parent.getMainContent().getElementsByClassName('e-selection')[selectedRowColIdx as number]) as HTMLElement;
        } else {
            const elems: NodeListOf<Element> = [].slice.call(this.parent.element.getElementsByClassName('e-multi-range'));
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
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.showHeaders) {
            if (!isMultiRange) {
                removeClass(this.getSheetElement().querySelectorAll('.e-highlight'), 'e-highlight');
                removeClass(this.getSheetElement().querySelectorAll('.e-prev-highlight'), 'e-prev-highlight');
            }
            const selectAllEle: Element = this.parent.element.getElementsByClassName('e-select-all-cell')[0];
            if (selectAllEle) {
                removeClass([selectAllEle], ['e-prev-highlight-right', 'e-prev-highlight-bottom']);
            }
            const rowHdr: Element[] = [];
            const colHdr: Element[] = [];
            const swapRange: number[] = getSwapRange(range);
            if (this.isRowSelected) {
                swapRange[1] = skipHiddenIdx(sheet, swapRange[1], true, 'columns');
            }
            if (this.isColSelected) {
                swapRange[0] = skipHiddenIdx(sheet, swapRange[0], true);
            }
            const frozenIdx: number[] = [0, 0, 0, 0];
            const indexes: number[] = [0, 0, 0, 0];
            const topLeftIndex: number[] = getCellIndexes(sheet.topLeftCell);
            let i: number; let j: number;
            const updateIndex: Function = (freezePane: number, layout: string, offset: string): void => {
                let idx: number; let hiddenCount: number;
                if (freezePane && swapRange[i as number] < freezePane) {
                    topLeftIndex[i as number] = skipHiddenIdx(sheet, topLeftIndex[i as number], true, layout);
                    const startIdx: number = skipHiddenIdx(sheet, swapRange[i as number], true, layout);
                    if (startIdx === topLeftIndex[i as number]) {
                        swapRange[i as number] = startIdx;
                    }
                    hiddenCount = this.parent.hiddenCount(topLeftIndex[i as number], swapRange[i as number] - 1, layout, sheet);
                    frozenIdx[i as number] = swapRange[i as number] - hiddenCount - topLeftIndex[i as number];
                    idx = swapRange[j as number] < freezePane ? swapRange[j as number] : freezePane - 1;
                    frozenIdx[j as number] = idx - this.parent.hiddenCount(swapRange[i as number], idx, layout, sheet) - hiddenCount -
                        topLeftIndex[i as number] + 1;
                    idx = this.parent.viewport[`${offset}`] + freezePane;
                    if (swapRange[j as number] >= idx) {
                        indexes[i as number] = 0;
                        indexes[i as number] -= this.parent.hiddenCount(idx, idx, layout, sheet);
                        indexes[j as number] = swapRange[j as number] - this.parent.hiddenCount(
                            idx, swapRange[j as number], layout, sheet) - idx + 1;
                    }
                } else {
                    idx = skipHiddenIdx(sheet, this.parent.viewport[`${offset}`] + freezePane, true, layout);
                    const startIdx: number = skipHiddenIdx(sheet, swapRange[i as number], true, layout);
                    if (idx === startIdx) {
                        swapRange[i as number] = idx;
                    }
                    hiddenCount = this.parent.hiddenCount(idx, swapRange[i as number] - 1, layout, sheet);
                    indexes[i as number] = swapRange[i as number] - hiddenCount - idx;
                    indexes[j as number] = swapRange[j as number] - this.parent.hiddenCount(
                        swapRange[i as number], swapRange[j as number], layout, sheet) - hiddenCount - idx + 1;
                }
            };
            const updateCell: Function = (idx: number[], parent: Element, hdrArr: Element[]): void => {
                const header: Element[] = [].slice.call(parent.getElementsByClassName('e-header-cell'));
                for (let k: number = idx[i as number]; k < idx[j as number]; k++) {
                    if (header[k as number]) {
                        hdrArr.push(header[k as number]);
                    }
                }
            };
            if (isRowRefresh) {
                i = 0; j = 2;
                updateIndex(this.parent.frozenRowCount(sheet), 'rows', 'topIndex');
                if (sheet.frozenRows) {
                    const selectAllBody: Element = this.parent.getSelectAllContent().querySelector('tbody');
                    if (selectAllBody) {
                        updateCell(frozenIdx, selectAllBody, rowHdr);
                    }
                }
                updateCell(indexes, this.parent.getRowHeaderContent(), rowHdr);
            }
            if (isColRefresh) {
                i = 1; j = 3;
                updateIndex(this.parent.frozenColCount(sheet), 'columns', 'leftIndex');
                if (sheet.frozenColumns) {
                    const selectAllHdr: Element = this.parent.getSelectAllContent().querySelector('thead');
                    if (selectAllHdr) {
                        updateCell(frozenIdx, selectAllHdr, colHdr);
                    }
                }
                updateCell(indexes, this.parent.getColumnHeaderContent(), colHdr);
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
            if (selectAllEle) {
                if (skipHiddenIdx(sheet, swapRange[0], true) === skipHiddenIdx(sheet, 0, true)) {
                    selectAllEle.classList.add('e-prev-highlight-bottom');
                }
                if (skipHiddenIdx(sheet, swapRange[1], true, 'columns') === skipHiddenIdx(sheet, 0, true, 'columns')) {
                    selectAllEle.classList.add('e-prev-highlight-right');
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

    private initiateFormulaSelection( args: { range: string, formulaSheetIdx: number }): void {
        this.processFormulaEditRange(args.range, args.formulaSheetIdx);
    }

    private processFormulaEditRange(val: string, formulaStartSheetIdx: number): void {
        let str: string;
        let formulaSheetIdx: number = formulaStartSheetIdx;
        let i: number = 0;
        const eventArgs: { formula?: string, formulaArr?: string[] } = { formula: val };
        this.parent.notify(parseFormulaArgument, eventArgs);
        const parsedVal: string[] = eventArgs.formulaArr;
        const len: number = parsedVal.length;
        let ctrlKeyCount: number = 0;
        const formulaBorder: string[][] = [['e-vborderright', 'e-vborderbottom'], ['e-pborderright', 'e-pborderbottom'],
            ['e-cborderright', 'e-cborderbottom'], ['e-gborderright', 'e-gborderbottom'], ['e-oborderright', 'e-oborderbottom'],
            ['e-bborderright', 'e-bborderbottom']];
        this.clearBorder();
        const actSheetIdx: number = this.parent.getActiveSheet().id - 1;
        while (i < len) {
            str = parsedVal[i as number];
            if (this.invalidOperators.indexOf(str) > -1) {
                break;
            }
            if (isCellReference(str.toUpperCase())) {
                str = str.replace(/\$/g, '');
                if (i > 0) {
                    if (parsedVal[i - 1].lastIndexOf('!') === parsedVal[i - 1].length - 1) {
                        const sheetName: string = parsedVal[i - 1].substring(1, parsedVal[i - 1].lastIndexOf('!') - 1);
                        formulaSheetIdx = getSheetIndex(this.parent as Workbook, sheetName);
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

    private updateFormulaEditRange(str: string, i: number, formulaBorder: string[][]): void {
        const indices: number[] = getRangeIndexes(str);
        this.formulaRange[i as number] = str;
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
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: number[] = getSwapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]);
        const topLeftIdx: number[] = getRangeIndexes(sheet.topLeftCell);
        const hiddenCol: number = this.parent.hiddenCount(topLeftIdx[1], range[3] - 1, 'columns', sheet);
        if (isChart && hiddenCol > 0) {
            range[1] -= hiddenCol;
            range[3] -= hiddenCol;
        }
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

    private getEleFromRange(range: number[]): HTMLElement[] {
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
                    const row: Element = this.parent.getRow(rowIdx, null );
                    if (row) {
                        rowCells = row.getElementsByClassName('e-cell') as HTMLCollectionOf<Element>;
                        tempCells = (endCIndex === startCIndex) ?
                            [rowCells[endCIndex as number]] : this.getRowCells(rowCells, startCIndex, endCIndex + 1);
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
            if (rowCells[startCIndex as number]) {
                tdCol.push(rowCells[startCIndex as number] as HTMLElement);
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
        for (let idx: number = borderEleColl.length - 1; idx >= 0; idx--) {
            const td: HTMLElement = borderEleColl[idx as number] as HTMLElement;
            const classArr: string[] = ['e-vborderright', 'e-vborderbottom', 'e-pborderright', 'e-pborderbottom',
                'e-cborderright', 'e-cborderbottom', 'e-gborderright', 'e-gborderbottom', 'e-oborderright',
                'e-oborderbottom', 'e-bborderright', 'e-bborderbottom', 'e-formularef-selection'];
            for (let idx: number = 0; idx < classArr.length; idx++) {
                td.classList.remove(classArr[idx as number]);
            }
        }
        // for (let idx: number = 0; idx < borderEleColl.length; idx++) {
        //     const td: HTMLElement = borderEleColl[idx] as HTMLElement;
        // }
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
