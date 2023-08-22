import { Spreadsheet } from '../base/index';
import { spreadsheetDestroyed, IRowRenderer, HideShowEventArgs, ICellRenderer, CellRenderArgs } from '../common/index';
import { autoFit, virtualContentLoaded, completeAction, focus } from '../common/index';
import { hiddenMerge, updateTableWidth, updateTranslate } from '../common/index';
import { SheetModel, getCellAddress, isHiddenRow, setRow, setColumn, isHiddenCol, getRangeAddress, getCell, getSheet, ColumnModel, RowModel, getColumn, getRow } from '../../workbook/index';
import { beginAction, getCellIndexes, applyCellFormat, CellFormatArgs, CellModel, MergeArgs, refreshChart } from '../../workbook/index';
import { activeCellMergedRange, setMerge, ExtendedRowModel, getRowHeight, getRangeIndexes, hideShow } from '../../workbook/index';
import { ActionEventArgs, skipHiddenIdx } from '../../workbook/index';
import { detach, isUndefined } from '@syncfusion/ej2-base';

/**
 * The `ShowHide` module is used to perform hide/show the rows and columns.
 *
 * @hidden
 */
export class ShowHide {
    private parent: Spreadsheet;
    /**
     * Constructor for the Spreadsheet show hide module.
     *
     * @param {Spreadsheet} parent - Specify the spreadsheet instance.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private hideShow(args: HideShowEventArgs): void {
        const sheetIndex: number = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (args.startIndex > args.endIndex) {
            const temp: number = args.startIndex;
            args.startIndex = args.endIndex; args.endIndex = temp;
        }
        let actionArgs: ActionEventArgs;
        if (args.actionUpdate) {
            args.sheetIndex = sheetIndex;
            actionArgs = { eventArgs: args, action: 'hideShow' };
            this.parent.notify(beginAction, actionArgs);
            if (args.cancel) {
                return;
            }
            delete args.cancel;
        }
        const performHideShow: Function = (updateViewport?: boolean): void => {
            if (args.isCol) {
                this.hideCol(args);
                if (updateViewport) { this.parent.sheetModule.colWidthChanged({ colIdx: args.startIndex, isHideShow: true }); }
            } else {
                this.hideRow(args);
                if (updateViewport) { this.parent.sheetModule.rowHeightChanged({ rowIdx: args.startIndex, isHideShow: true }); }
            }
        };
        const freezePane: number = args.isCol ? this.parent.frozenColCount(sheet) : this.parent.frozenRowCount(sheet);
        if (freezePane && args.startIndex < freezePane) {
            let endIndex: number;
            args.freezePane = true;
            if (args.endIndex >= freezePane) {
                endIndex = args.endIndex;
                args.endIndex = freezePane - 1;
            }
            performHideShow(true);
            delete args.freezePane;
            if (endIndex !== undefined) {
                const startIndex: number = args.startIndex;
                args.endIndex = endIndex; args.startIndex = freezePane;
                performHideShow();
                args.startIndex = startIndex;
            }
        } else {
            performHideShow();
        }
        if (args.actionUpdate) {
            this.updateIndexOnlyForHiddenColumnsAndRows(args, sheet);
            this.parent.notify(completeAction, actionArgs);
            focus(this.parent.element);
        }
    }
    private updateIndexOnlyForHiddenColumnsAndRows(args: HideShowEventArgs, sheet: SheetModel): void {
        const startIndex: number = args.startIndex;
        const endIndex: number = args.endIndex;
        let model: ColumnModel | RowModel;
        for (let sIdx: number = args.startIndex; sIdx <= endIndex; sIdx++) {
            model = args.isCol ? getColumn(sheet, sIdx) : getRow(sheet, sIdx) || {};
            if (model.hidden === false) {
                args.startIndex = sIdx;
                break;
            }
        }
        for (let eIdx: number = args.endIndex; eIdx >= startIndex; eIdx--) {
            model = args.isCol ? getColumn(sheet, eIdx) : getRow(sheet, eIdx) || {};
            if (model.hidden === false) {
                args.endIndex = eIdx;
                break;
            }
        }
    }
    private hideRow(eventArgs: HideShowEventArgs): void {
        const sheetIndex: number = isUndefined(eventArgs.sheetIndex) ? this.parent.activeSheetIndex : eventArgs.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        let cell: CellModel; let count: number = 0; let idx: number; let nextIdx: number; let merge: boolean;
        let model: ExtendedRowModel;
        const args: HideShowEventArgs = Object.assign({}, eventArgs);
        const isFinite: boolean = this.parent.scrollSettings.isFinite && !args.freezePane;
        let height: number;
        if (isFinite) {
            if (args.startIndex >= sheet.rowCount) { return; }
            if (args.endIndex >= sheet.rowCount) { args.endIndex = sheet.rowCount - 1; }
            height = 0;
        }
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        if (args.hide) {
            let content: HTMLTableElement; let rowHdr: HTMLTableElement; let row: HTMLTableRowElement;
            const updateBtmIdx: boolean = isFinite && args.endIndex === skipHiddenIdx(sheet, sheet.rowCount - 1, false);
            for (let i: number = args.startIndex; i <= args.endIndex; i++) {
                if (isHiddenRow(sheet, i)) { continue; }
                if (idx === undefined) {
                    if (args.freezePane) {
                        rowHdr = this.parent.sheetModule.getSelectAllTable();
                        content = this.parent.getColHeaderTable();
                    } else {
                        rowHdr = this.parent.getRowHeaderTable();
                        content = this.parent.getContentTable();
                    }
                    idx = this.parent.getViewportIndex(i); count = 0;
                }
                model = { hidden: true };
                if (args.isFiltering) { model.isFiltered = true; }
                setRow(sheet, i, model);
                if (sheetIndex !== this.parent.activeSheetIndex) {
                    continue;
                }
                if (isFinite) {
                    height += getRowHeight(sheet, i, true, true);
                }
                this.refreshChart(i, 'rows');
                row = content && content.rows[idx as number];
                if (row) {
                    if (!merge) {
                        for (let j: number = 0; j <= sheet.usedRange.colIndex; j++) {
                            cell = getCell(i, j, sheet) || {};
                            if ((cell.colSpan || cell.rowSpan) && (args.startIndex >= this.parent.viewport.topIndex ||
                                this.parent.scrollSettings.enableVirtualization)) { merge = true; break; }
                        }
                    }
                    if (merge) { continue; }
                    if (rowHdr.rows[idx as number]) {
                        detach(rowHdr.rows[idx as number]);
                    }
                    detach(row);
                    count++;
                    row = content.rows[idx as number];
                    if (row && i === args.endIndex) {
                        let cell: HTMLElement; nextIdx = skipHiddenIdx(sheet, i + 1, true);
                        const first: string = nextIdx !== skipHiddenIdx(sheet, 0, true) && nextIdx ===
                            (this.parent.viewport.topIndex >= args.startIndex ? args.endIndex + 1 : this.parent.viewport.topIndex) ? 'Row' : '';
                        for (let j: number = this.parent.viewport.leftIndex; j <= this.parent.viewport.rightIndex; j++) {
                            const borderTop: string = this.parent.getCellStyleValue(['borderTop'], [nextIdx, j]).borderTop;
                            if (borderTop !== '') {
                                cell = row.cells[j as number];
                                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                                    onActionUpdate: false, rowIdx: nextIdx, colIdx: j,
                                    style: { borderTop: borderTop }, row: row, pRow: <HTMLElement>row.previousElementSibling,
                                    first: first, cell: cell
                                });
                            }
                        }
                    }
                } else {
                    if (i <= this.parent.viewport.bottomIndex) {
                        count++;
                    } else {
                        count--;
                    }
                }
            }
            if (args.refreshUI) {
                return;
            }
            if (merge && (args.startIndex >= this.parent.viewport.topIndex || !this.parent.scrollSettings.enableVirtualization)) {
                if (args.isFiltering) {
                    eventArgs.refreshUI = true;
                } else {
                    this.parent.selectRange(sheet.selectedRange);
                    if (sheet.frozenRows || sheet.frozenColumns) {
                        this.parent.renderModule.refreshSheet(false, false, true);
                        eventArgs.refreshUI = true;
                    } else {
                        this.parent.renderModule.refreshUI(
                            { rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row' });
                    }
                }
                return;
            }
            if (!count) { return; }
            this.parent.selectRange(sheet.selectedRange);
            const updateHideClass: Function = (): void => {
                if (sheet.showHeaders) {
                    const firstIdx: number = args.freezePane ? 1 : 0;
                    if (idx === firstIdx) {
                        if (rowHdr.rows[firstIdx as number]) {
                            rowHdr.rows[firstIdx as number].classList.add('e-hide-end');
                        }
                    } else {
                        if (rowHdr && rowHdr.rows[idx - 1]) {
                            rowHdr.rows[idx - 1].classList.add('e-hide-start');
                        }
                        if (rowHdr && rowHdr.rows[idx as number]) {
                            rowHdr.rows[idx as number].classList.add('e-hide-end');
                        }
                    }
                }
            };
            if (!args.freezePane && this.parent.scrollSettings.enableVirtualization) {
                let startIndex: number = args.startIndex;
                let endIndex: number = args.startIndex;
                if (args.startIndex < getCellIndexes(sheet.paneTopLeftCell)[0] || count > this.parent.viewport.rowCount) {
                    if (args.isFiltering) {
                        eventArgs.refreshUI = true;
                        return;
                    }
                    this.parent.updateTopLeftCell(
                        skipHiddenIdx(sheet, args.startIndex - 1 < frozenRow ? frozenRow : args.startIndex - 1, true) - frozenRow, null,
                        'col');
                    this.parent.renderModule.refreshSheet(false, false, true);
                } else {
                    startIndex = this.parent.viewport.bottomIndex + 1;
                    endIndex = startIndex + count - 1;
                    const indexes: number[] = this.parent.skipHidden(startIndex, endIndex, 'rows', false);
                    startIndex = indexes[0];
                    endIndex = indexes[1];
                    if (isFinite) {
                        if (startIndex >= sheet.rowCount) {
                            if (this.parent.viewport.topIndex + frozenRow === skipHiddenIdx(sheet,  frozenRow, true)) {
                                updateHideClass();
                                this.parent.notify(updateTranslate, { isHide: true, height: height });
                                if (updateBtmIdx) {
                                    this.parent.viewport.bottomIndex = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
                                }
                            } else {
                                this.parent.renderModule.refreshSheet(false, false, true);
                            }
                            return;
                        } else if (endIndex >= sheet.rowCount) {
                            this.parent.renderModule.refreshSheet(false, false, true);
                            return;
                        } else {
                            this.parent.notify(updateTranslate, { isHide: true, height: height });
                        }
                    }
                    this.parent.viewport.bottomIndex = endIndex;
                    let colIndex: number;
                    const frozenCol: number = this.parent.frozenColCount(sheet);
                    const frozenIdxes: number[] = [];
                    if (frozenCol) {
                        frozenIdxes.push(frozenRow); frozenIdxes.push(this.parent.viewport.leftIndex + frozenCol);
                        colIndex = getCellIndexes(sheet.topLeftCell)[1];
                    } else {
                        colIndex = this.parent.viewport.leftIndex;
                    }
                    this.parent.renderModule.refreshUI(
                        { colIndex: colIndex, rowIndex: startIndex, direction: '', refresh: 'RowPart', frozenIndexes: frozenIdxes },
                        `${getCellAddress(startIndex, colIndex)}:${getCellAddress(endIndex, this.parent.viewport.rightIndex)}`);
                }
            }
            updateHideClass();
        } else {
            let hFrag: DocumentFragment; let frag: DocumentFragment; let hRow: Element; let row: Element; let newStartRow: number;
            let rowRenderer: IRowRenderer; let content: HTMLTableElement; let rowHdr: HTMLTableElement; let startRow: number;
            let endRow: number = args.startIndex - 1;
            const mergeCollection: MergeArgs[] = [];
            let skipDetach: boolean = args.freezePane;
            let direction: string = 'lastElementChild';
            let detachedHeight: number = 0;
            if (isFinite) {
                const lastIdx: number = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
                if (this.parent.viewport.bottomIndex === lastIdx) {
                    if (this.parent.viewport.topIndex + frozenRow === skipHiddenIdx(sheet, frozenRow, true)) {
                        skipDetach = true;
                    } else {
                        const topLeftCell: number = getRangeIndexes(sheet.paneTopLeftCell)[0];
                        const count: number = (((sheet.rowCount - 1) - topLeftCell) + 1) -
                            this.parent.hiddenCount(topLeftCell, sheet.rowCount - 1);
                        if (count < this.parent.viewport.rowCount + Math.round(this.parent.getThreshold('row') / 2)) {
                            direction = 'firstElementChild';
                        }
                    }
                }
            }
            for (let i: number = args.startIndex, len: number = args.endIndex; i <= len; i++) {
                if (!isHiddenRow(sheet, i)) {
                    if (args.startIndex === args.endIndex) {
                        return;
                    }
                    if (idx === undefined) {
                        endRow++;
                    } else {
                        newStartRow = i;
                    }
                    continue;
                }
                if (newStartRow !== undefined) { len = i; continue; }
                model = { hidden: false };
                if (args.isFiltering) { model.isFiltered = false; }
                if (!skipDetach && i > this.parent.viewport.bottomIndex) {
                    setRow(sheet, i, model);
                    if (startRow === undefined) { return; }
                    continue;
                }
                if (startRow === undefined) { startRow = i; }
                setRow(sheet, i, model);
                if (sheetIndex !== this.parent.activeSheetIndex) {
                    continue;
                }
                if (isFinite) { height += getRowHeight(sheet, i, true, true); }
                this.refreshChart(i, 'rows');
                if (idx === undefined) {
                    hFrag = document.createDocumentFragment();
                    frag = document.createDocumentFragment();
                    rowRenderer = this.parent.serviceLocator.getService<IRowRenderer>('row');
                    if (args.freezePane) {
                        rowHdr = this.parent.sheetModule.getSelectAllTable();
                        content = this.parent.getColHeaderTable();
                    } else {
                        rowHdr = this.parent.getRowHeaderTable();
                        content = this.parent.getContentTable();
                        if (i < this.parent.viewport.topIndex + frozenRow) {
                            this.parent.viewport.topIndex = i - frozenRow;
                        }
                    }
                    idx = this.parent.getViewportIndex(i);
                }
                endRow++;
                hRow = rowRenderer.refresh(i, null, null, true, true);
                hFrag.appendChild(hRow);
                if (rowHdr && rowHdr.rows.length && !skipDetach) {
                    detach(rowHdr.tBodies[0][`${direction}`]);
                }
                row = frag.appendChild(rowRenderer.refresh(i, row, hRow));
                if (content && content.rows.length && !skipDetach) {
                    detach(content.tBodies[0][`${direction}`]);
                    if (direction === 'firstElementChild') {
                        if (idx !== undefined && idx - 1 > -1) {
                            idx -= 1;
                        }
                        detachedHeight += getRowHeight(sheet, this.parent.viewport.topIndex, true);
                        this.parent.viewport.topIndex = skipHiddenIdx(sheet, this.parent.viewport.topIndex + 1, true);
                    }
                }
                for (let j: number = this.parent.viewport.leftIndex; j <= this.parent.viewport.rightIndex; j++) {
                    cell = getCell(i, j, sheet) || {};
                    if (cell.rowSpan !== undefined || cell.colSpan !== undefined) {
                        const mergeArgs: MergeArgs = {
                            range: [i, j, i, j], isAction: false, merge: true,
                            type: 'All', skipChecking: true
                        };
                        this.parent.notify(activeCellMergedRange, mergeArgs);
                        if (!mergeCollection.length || mergeArgs.range[1] !== mergeCollection[mergeCollection.length - 1].range[1] ||
                            mergeArgs.range[0] !== mergeCollection[mergeCollection.length - 1].range[0]) {
                            mergeCollection.push(mergeArgs);
                        }
                    }
                }
            }
            if (idx === undefined) {
                return;
            }
            if (!args.freezePane) {
                if (args.isFiltering && args.startIndex < getCellIndexes(sheet.paneTopLeftCell)[0]) {
                    eventArgs.refreshUI = true;
                    if (newStartRow === undefined || newStartRow === args.endIndex) {
                        return;
                    }
                }
                this.parent.viewport.bottomIndex = this.parent.viewport.topIndex + frozenRow + this.parent.viewport.rowCount +
                    (this.parent.getThreshold('row') * 2);
                count = this.parent.hiddenCount(this.parent.viewport.topIndex + frozenRow, args.startIndex) +
                    this.parent.hiddenCount(args.endIndex + 1, this.parent.viewport.bottomIndex);
                this.parent.viewport.bottomIndex += count;
                if (isFinite && this.parent.viewport.bottomIndex >= sheet.rowCount) {
                    this.parent.viewport.bottomIndex = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
                }
            }
            args.insertIdx = eventArgs.insertIdx = idx; args.row = eventArgs.row = frag.querySelector('.e-row');
            args.mergeCollection = eventArgs.mergeCollection = mergeCollection;
            if (sheet.showHeaders) {
                eventArgs.hdrRow = args.hdrRow = hFrag.querySelector('.e-row');
                if (idx !== 0 && !isHiddenRow(sheet, endRow - 1) && rowHdr.rows[idx - 1]) {
                    rowHdr.rows[idx - 1].classList.remove('e-hide-start');
                }
                if (args.startIndex !== 0 && isHiddenRow(sheet, args.startIndex - 1)) {
                    args.hdrRow.classList.add('e-hide-end');
                }
                if (isHiddenRow(sheet, endRow + 1)) {
                    hFrag.lastElementChild.classList.add('e-hide-start');
                } else {
                    if (rowHdr.rows[idx as number]) { rowHdr.rows[idx as number].classList.remove('e-hide-end'); }
                }
            }
            if (row && content && content.rows[idx as number]) {
                nextIdx = skipHiddenIdx(sheet, endRow + 1, true);
                for (let i: number = this.parent.viewport.leftIndex; i <= this.parent.viewport.rightIndex; i++) {
                    const borderTop: string = this.parent.getCellStyleValue(['borderTop'], [nextIdx, i]).borderTop;
                    if (borderTop !== '') {
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{
                            onActionUpdate: false, rowIdx: nextIdx, colIdx: i, style: { borderTop: borderTop }, pRow: <HTMLElement>row,
                            cell: content.rows[idx as number].cells[i as number], first: ''
                        });
                        const prevIdx: number = skipHiddenIdx(sheet, startRow - 1, false);
                        if (prevIdx > -1) {
                            if (content.rows[idx - 1] && !this.parent.getCellStyleValue(['borderBottom'], [prevIdx, i]).borderBottom &&
                                !this.parent.getCellStyleValue(['borderTop'], [startRow, i]).borderTop) {
                                (content.rows[idx - 1].cells[i as number] as HTMLElement).style.borderBottom = '';
                            }
                        } else {
                            (content.rows[idx as number].cells[i as number] as HTMLElement).style.borderTop = '';
                        }
                    }
                }
            }
            if (args.skipAppend) { return; }
            if (isFinite) {
                this.parent.notify(updateTranslate, { height: height, size: detachedHeight });
            }
            if (Math.abs(endRow - startRow) > this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2)) {
                this.parent.renderModule.refreshSheet(false, false, true);
            } else {
                if (rowHdr) {
                    if (rowHdr.tBodies[0].rows.length) {
                        rowHdr.tBodies[0].insertBefore(hFrag, rowHdr.rows[idx as number]);
                    } else {
                        rowHdr.tBodies[0].appendChild(hFrag);
                    }
                }
                if (content && content.tBodies[0]) {
                    if (content.tBodies[0].rows.length) {
                        content.tBodies[0].insertBefore(frag, content.rows[idx as number]);
                    } else {
                        content.tBodies[0].appendChild(frag);
                    }
                }
                this.parent.selectRange(sheet.selectedRange);
                if (args.autoFit && sheet.showHeaders) {
                    this.parent.notify(autoFit, { startIndex: args.startIndex, endIndex: args.endIndex, isRow: true });
                }
                mergeCollection.forEach((mergeArgs: MergeArgs): void => { this.parent.notify(setMerge, mergeArgs); });
                if (newStartRow !== undefined && newStartRow !== args.endIndex) {
                    args.startIndex = newStartRow;
                    this.hideRow(args);
                }
            }
        }
    }
    private hideCol(args: HideShowEventArgs): void {
        const sheetIndex: number = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        const hiddenIndex: number[] = [];
        const beforeViewportIdx: number[] = [];
        const paneTopLeftIdx: number[] = getCellIndexes(sheet.paneTopLeftCell);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const viewportLeftIdx: number = this.parent.viewport.leftIndex + frozenCol;
        let scrollable: boolean;
        for (let i: number = args.startIndex; i <= args.endIndex; i++) {
            if (args.hide ? isHiddenCol(sheet, i) : !isHiddenCol(sheet, i)) { continue; }
            setColumn(sheet, i, { hidden: args.hide });
            this.refreshChart(i, 'columns');
            if (this.parent.scrollSettings.enableVirtualization && !args.freezePane && (i < viewportLeftIdx ||
                i > this.parent.viewport.rightIndex)) {
                if (i < viewportLeftIdx) {
                    beforeViewportIdx.push(i);
                }
                continue;
            }
            hiddenIndex.push(i);
            if (args.hide && i <= paneTopLeftIdx[1]) {
                scrollable = true;
            }
        }
        if (!beforeViewportIdx.length && !hiddenIndex.length) {
            return;
        }
        if (sheetIndex !== this.parent.activeSheetIndex) {
            return;
        }
        const topLeftIdx: number[] = getCellIndexes(sheet.topLeftCell);
        let table: HTMLTableElement; let hTable: HTMLTableElement;
        const getRowIndexes: Function = (): number[] => {
            let idx: number[];
            if (this.parent.scrollSettings.enableVirtualization) {
                idx = [frozenRow ? topLeftIdx[0] : this.parent.viewport.topIndex, this.parent.viewport.bottomIndex];
            } else {
                idx = [0, sheet.rowCount - 1];
            }
            if (args.freezePane) {
                table = this.parent.getRowHeaderTable();
                hTable = this.parent.sheetModule.getSelectAllTable();
            } else {
                table = this.parent.getContentTable();
                hTable = this.parent.getColHeaderTable();
            }
            return idx;
        };
        if (args.hide) {
            if (!hiddenIndex.length) {
                return;
            }
            if (hiddenIndex.length <= this.parent.getThreshold('col') || !this.parent.scrollSettings.enableVirtualization ||
                args.freezePane) {
                this.removeCell(sheet, hiddenIndex, getRowIndexes(), table, hTable);
            }
            if (!args.freezePane && this.parent.scrollSettings.enableVirtualization) {
                if (scrollable) {
                    this.parent.updateTopLeftCell(
                        null, skipHiddenIdx(sheet, hiddenIndex[0] - 1 < frozenCol ? frozenCol : hiddenIndex[0] - 1, true, 'columns') -
                        frozenCol, 'row');
                    this.parent.renderModule.refreshSheet(false, false, true);
                    return;
                }
                let fIndexes: number[] = [];
                const viewportRowIdx: number = this.parent.viewport.topIndex;
                const rowIdx: number = frozenRow ? topLeftIdx[0] : viewportRowIdx;
                if (frozenRow) {
                    fIndexes = [frozenRow + viewportRowIdx, frozenCol];
                }
                if (this.parent.scrollSettings.isFinite) {
                    const colCount: number = skipHiddenIdx(sheet, sheet.colCount - 1, false, 'columns');
                    const startIdx: number = this.parent.viewport.leftIndex + frozenCol;
                    const endIndex: number = this.parent.viewport.rightIndex;
                    if (endIndex + hiddenIndex.length >= colCount) {
                        const index: number = skipHiddenIdx(
                            sheet, startIdx - ((endIndex + hiddenIndex.length) - colCount), false, 'columns');
                        if (index >= frozenCol) {
                            this.parent.viewport.leftIndex = index;
                            this.parent.viewport.leftIndex -= this.parent.hiddenCount(endIndex, colCount);
                        }
                        this.parent.viewport.rightIndex = colCount;
                        if (startIdx !== (this.parent.viewport.leftIndex + frozenCol) || endIndex !== this.parent.viewport.rightIndex) {
                            this.parent.renderModule.refreshUI(
                                { colIndex: this.parent.viewport.leftIndex, refresh: 'Column', frozenIndexes: fIndexes, rowIndex: rowIdx,
                                    skipUpdateOnFirst: this.parent.viewport.leftIndex + frozenCol === skipHiddenIdx(
                                        sheet, frozenCol, true, 'columns') });
                            if (frozenRow) {
                                this.parent.viewport.topIndex = viewportRowIdx;
                            }
                        } else {
                            this.parent.notify(updateTableWidth, { refresh: 'Column', isUpdate: true });
                        }
                        this.parent.selectRange(sheet.selectedRange);
                        return;
                    }
                }
                if (hiddenIndex.length <= this.parent.getThreshold('col')) {
                    const indexes: number[] = this.parent.skipHidden(
                        this.parent.viewport.rightIndex + 1, this.parent.viewport.rightIndex + hiddenIndex.length, 'columns');
                    this.parent.viewport.rightIndex = indexes[1];
                    this.parent.renderModule.refreshUI(
                        { rowIndex: rowIdx, colIndex: indexes[0], direction: '', refresh: 'ColumnPart', frozenIndexes: fIndexes },
                        `${getRangeAddress([rowIdx, indexes[0], this.parent.viewport.bottomIndex, indexes[1]])}`);
                } else {
                    this.parent.renderModule.refreshUI({
                        skipUpdateOnFirst: this.parent.viewport.leftIndex + frozenCol === skipHiddenIdx(
                            sheet, frozenCol, true, 'columns'), rowIndex: rowIdx, colIndex: this.parent.viewport.leftIndex,
                        refresh: 'Column', frozenIndexes: fIndexes
                    });
                    if (frozenRow) {
                        this.parent.viewport.topIndex = viewportRowIdx;
                    }
                }
            }
            this.parent.selectRange(sheet.selectedRange);
        } else {
            if (beforeViewportIdx.length && this.parent.scrollSettings.enableVirtualization) {
                beforeViewportIdx.sort((i: number, j: number): number => { return i - j; });
                const leftIdx: number = beforeViewportIdx[0] - 1 < frozenCol ? frozenCol : beforeViewportIdx[0] - 1;
                this.parent.updateTopLeftCell(null, skipHiddenIdx(sheet, leftIdx, true, 'columns') - frozenCol, 'row');
                this.parent.renderModule.refreshSheet(false, false, true);
                if (args.autoFit) {
                    args.autoFit = false;
                }
                return;
            }
            if (hiddenIndex.length <= this.parent.getThreshold('col') || !this.parent.scrollSettings.enableVirtualization ||
                args.freezePane) {
                this.appendCell(sheet, hiddenIndex, getRowIndexes(), table, hTable, args.freezePane);
                if (this.parent.scrollSettings.enableVirtualization && !args.freezePane) {
                    this.parent.notify(
                        virtualContentLoaded, { refresh: 'Column', prevRowColCnt: { rowCount: sheet.rowCount, colCount: sheet.colCount } });
                }
            } else {
                const viewportRowIdx: number = this.parent.viewport.topIndex;
                const rowIdx: number = frozenRow ? topLeftIdx[0] : viewportRowIdx;
                this.parent.renderModule.refreshUI({
                    skipUpdateOnFirst: this.parent.viewport.leftIndex + frozenCol === skipHiddenIdx(
                        sheet, frozenCol, true, 'columns'), rowIndex: rowIdx, colIndex: this.parent.viewport.leftIndex,
                    refresh: 'Column', frozenIndexes: frozenRow ? [frozenRow + viewportRowIdx, frozenCol] : []
                });
                if (frozenRow) {
                    this.parent.viewport.topIndex = viewportRowIdx;
                }
                if (args.autoFit) {
                    args.autoFit = false;
                }
            }
            this.parent.selectRange(sheet.selectedRange);
        }
    }
    private removeCell(sheet: SheetModel, indexes: number[], rowIdxs: number[], table: HTMLTableElement, hTable: HTMLTableElement): void {
        let startIdx: number = rowIdxs[0];
        const endIdx: number = rowIdxs[1];
        let rowIdx: number = 0;
        const len: number = indexes.length - 1;
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const colgrp: HTMLElement = table.getElementsByTagName('colgroup')[0];
        const cellIdx: number = this.parent.getViewportIndex(indexes[0], true) + 1;
        const lastFreezeRow: number = skipHiddenIdx(sheet, frozenRow - 1, false);
        let hRow: HTMLTableRowElement; let row: HTMLTableRowElement; let hColgrp: HTMLElement; let cell: CellModel; let nextIdx: number;
        if (sheet.showHeaders) {
            hColgrp = hTable.getElementsByTagName('colgroup')[0];
            hRow = hTable.rows[0];
        }
        while (startIdx <= endIdx) {
            if (isHiddenRow(sheet, startIdx)) {
                startIdx++;
                continue;
            }
            row = frozenRow && startIdx < frozenRow ? hTable.rows[rowIdx + 1] : table.rows[rowIdx as number];
            indexes.forEach((idx: number, index: number): void => {
                if (rowIdx === 0 && startIdx >= frozenRow) {
                    if (sheet.showHeaders) {
                        detach(hColgrp.children[cellIdx as number]);
                        detach(hRow.cells[cellIdx as number]);
                    }
                    detach(colgrp.children[cellIdx as number]);
                }
                detach(row.cells[cellIdx as number]);
                if (index === 0) {
                    cell = getCell(startIdx, idx, sheet, false, true);
                    if ((cell.colSpan !== undefined && (cell.rowSpan === undefined || cell.colSpan > 1)) || (cell.rowSpan < 0 &&
                        startIdx - 1 > -1 && isHiddenRow(sheet, startIdx - 1) && Math.abs(cell.rowSpan) ===
                        this.parent.hiddenCount(startIdx + cell.rowSpan, startIdx, 'rows', sheet))) {
                        this.parent.notify(
                            hiddenMerge, { rowIdx: startIdx, colIdx: idx, model: 'col', start: indexes[0], end: indexes[len as number] });
                    }
                }
                if (index === len) {
                    nextIdx = skipHiddenIdx(sheet, idx + 1, true, 'columns');
                    const borderLeft: string = this.parent.getCellStyleValue(['borderLeft'], [rowIdx, nextIdx]).borderLeft;
                    if (borderLeft !== '') {
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{
                            onActionUpdate: false, rowIdx: rowIdx, colIdx: nextIdx,
                            style: { borderLeft: borderLeft }, row: row, first: ''
                        });
                    }
                    cell = getCell(startIdx, idx, sheet) || {};
                    if ((cell.colSpan !== undefined && (cell.rowSpan === undefined || cell.colSpan > 1)) || (cell.rowSpan < 0 &&
                        startIdx - 1 > -1 && isHiddenRow(sheet, startIdx - 1) && Math.abs(cell.rowSpan) ===
                        this.parent.hiddenCount(startIdx + cell.rowSpan, startIdx, 'rows', sheet))) {
                        this.parent.notify(hiddenMerge, {
                            rowIdx: startIdx, colIdx: idx, model: 'col',
                            start: indexes[0], end: indexes[len as number], isEnd: true
                        });
                    }
                }
            });
            if (frozenRow && startIdx === lastFreezeRow) {
                rowIdx = 0;
                startIdx = this.parent.viewport.topIndex + frozenRow;
            } else {
                rowIdx++;
                startIdx++;
            }
        }
        if (cellIdx - 1 > -1 && sheet.showHeaders && hRow.cells[cellIdx - 1]) { hRow.cells[cellIdx - 1].classList.add('e-hide-start'); }
        if (sheet.showHeaders && hRow.cells[cellIdx as number]) { hRow.cells[cellIdx as number].classList.add('e-hide-end'); }
    }
    private appendCell(
        sheet: SheetModel, indexes: number[], rowIdxs: number[], table: HTMLTableElement, hTable: HTMLTableElement, skip: boolean): void {
        let startIdx: number = rowIdxs[0];
        const endIdx: number = rowIdxs[1];
        let rowIdx: number = 0;
        const len: number = indexes.length - 1;
        let hRow: HTMLTableRowElement; let row: HTMLTableRowElement; let hColgrp: HTMLElement; let prevIdx: number;
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const colgrp: HTMLElement = table.getElementsByTagName('colgroup')[0];
        if (sheet.showHeaders) {
            hColgrp = hTable.getElementsByTagName('colgroup')[0]; hRow = hTable.rows[0];
        }
        const cellRenderer: ICellRenderer = this.parent.serviceLocator.getService<ICellRenderer>('cell');
        indexes.sort((i: number, j: number): number => { return i - j; });
        const mergeCollection: MergeArgs[] = [];
        const cellIdx: number[] = [];
        let cell: Element; let refCell: HTMLElement; let cellModel: CellModel;
        const firstFrozenRow: number = skipHiddenIdx(sheet, frozenRow - 1, false);
        let cellArgs: CellRenderArgs;
        while (startIdx <= endIdx) {
            if (isHiddenRow(sheet, startIdx)) {
                startIdx++; continue;
            }
            row = frozenRow && startIdx < frozenRow ? hTable.rows[rowIdx + 1] : table.rows[rowIdx as number];
            indexes.forEach((idx: number, index: number): void => {
                if (rowIdx === 0) {
                    cellIdx[index as number] = this.parent.getViewportIndex(idx, true);
                    if (sheet.showHeaders) {
                        refCell = hRow.cells[cellIdx[index as number]];
                        if (refCell) {
                            if (index === 0 && indexes[index as number] && !isHiddenCol(sheet, indexes[index as number] - 1) &&
                                refCell.previousSibling) {
                                refCell.previousElementSibling.classList.remove('e-hide-start');
                            }
                            if (index === len) { refCell.classList.remove('e-hide-end'); }
                        }
                    }
                    if (startIdx >= frozenRow) {
                        if (colgrp.children[cellIdx[index as number]]) {
                            colgrp.insertBefore(this.parent.sheetModule.updateCol(sheet, idx), colgrp.children[cellIdx[index as number]]);
                            if (sheet.showHeaders) { cellRenderer.renderColHeader(idx, hRow, refCell); }
                        } else {
                            colgrp.appendChild(this.parent.sheetModule.updateCol(sheet, idx));
                            if (sheet.showHeaders) { cellRenderer.renderColHeader(idx, hRow); }
                        }
                        if (!skip) {
                            detach(colgrp.lastChild);
                            if (sheet.showHeaders) { detach(hRow.lastChild); }
                        }
                        if (sheet.showHeaders && index === len) {
                            detach(hColgrp); hTable.insertBefore(colgrp.cloneNode(true), hTable.tHead);
                        }
                    }
                }
                if (!skip) {
                    detach(row.lastChild);
                }
                refCell = row.cells[cellIdx[index as number]];
                cellArgs = {
                    rowIdx: startIdx, colIdx: idx, cell: getCell(startIdx, idx, sheet), row: row,
                    address: getCellAddress(startIdx, idx), lastCell: idx === len, isHeightCheckNeeded: true,
                    first: idx !== skipHiddenIdx(sheet, 0, true, 'columns') && idx === this.parent.viewport.leftIndex ? 'Column' : '',
                    checkNextBorder: index === len ? 'Column' : '', checkCF: true
                };
                if (refCell) {
                    cellArgs.refChild = refCell;
                }
                cell = cellRenderer.render(cellArgs);
                if (index === 0 && cell.previousSibling) {
                    const borderLeft: string = this.parent.getCellStyleValue(
                        ['borderLeft'], [rowIdx, skipHiddenIdx(sheet, indexes[indexes.length - 1] + 1, true, 'columns')]).borderLeft;
                    if (borderLeft !== '') {
                        prevIdx = skipHiddenIdx(sheet, indexes[0] - 1, false, 'columns');
                        if (prevIdx > -1 && !this.parent.getCellStyleValue(['borderRight'], [rowIdx, prevIdx]).borderRight &&
                            !this.parent.getCellStyleValue(['borderLeft'], [rowIdx, indexes[0]]).borderLeft) {
                            (cell.previousSibling as HTMLElement).style.borderRight = '';
                        }
                    }
                }
                cellModel = getCell(startIdx, idx, sheet) || {};
                if ((cellModel.colSpan !== undefined && (cellModel.rowSpan === undefined || cellModel.colSpan > 1)) || (cellModel.rowSpan < 0
                    && startIdx - 1 > -1 && isHiddenRow(sheet, startIdx - 1) && Math.abs(cellModel.rowSpan) ===
                    this.parent.hiddenCount(startIdx + cellModel.rowSpan, startIdx, 'rows', sheet))) {
                    const mergeArgs: MergeArgs = {
                        range: [startIdx, idx, startIdx, idx], isAction: false, merge: true,
                        type: 'All', skipChecking: true
                    };
                    this.parent.notify(activeCellMergedRange, mergeArgs);
                    if (!mergeCollection.length || mergeArgs.range[1] !== mergeCollection[mergeCollection.length - 1].range[1] ||
                        mergeArgs.range[0] !== mergeCollection[mergeCollection.length - 1].range[0]) {
                        mergeCollection.push(mergeArgs);
                    }
                }
            });
            if (frozenRow && startIdx === firstFrozenRow) {
                startIdx = this.parent.viewport.topIndex + frozenRow;
                rowIdx = 0;
            } else {
                startIdx++;
                rowIdx++;
            }
        }
        mergeCollection.forEach((mergeArgs: MergeArgs): void => { this.parent.notify(setMerge, mergeArgs); });
        this.parent.viewport.rightIndex = skipHiddenIdx(sheet, this.parent.viewport.rightIndex - indexes.length, false, 'columns');
    }
    private refreshChart(index: number, showHide: string): void {
        this.parent.notify(refreshChart, { rIdx: index, showHide: showHide });
    }
    private addEventListener(): void {
        this.parent.on(hideShow, this.hideShow, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        this.parent.off(hideShow, this.hideShow);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}
