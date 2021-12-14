import { Spreadsheet } from '../base/index';
import { spreadsheetDestroyed, IRowRenderer, HideShowEventArgs, ICellRenderer, CellRenderArgs, getUpdateUsingRaf } from '../common/index';
import { autoFit, virtualContentLoaded, completeAction, setScrollEvent, onContentScroll, skipHiddenIdx } from '../common/index';
import { beginAction, hiddenMerge, updateTableWidth, updateTranslate, ScrollEventArgs } from '../common/index';
import { SheetModel, getCellAddress, isHiddenRow, setRow, setColumn, isHiddenCol, getRangeAddress, getCell, addHighlight } from '../../workbook/index';
import { getCellIndexes, getColumnWidth, applyCellFormat, CellFormatArgs, CellModel, MergeArgs, refreshChart } from '../../workbook/index';
import { activeCellMergedRange, setMerge, ExtendedRowModel, getRowHeight, getRangeIndexes, hideShow } from '../../workbook/index';
import { detach } from '@syncfusion/ej2-base';

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
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.frozenRows || sheet.frozenColumns) { return; }
        if (args.startIndex > args.endIndex) { const temp: number = args.startIndex;
            args.startIndex = args.endIndex; args.endIndex = temp; }
        if (args.actionUpdate) {
            args.cancel = false;
            this.parent.notify(beginAction, { eventArgs: args, action: 'hideShow' });
            if (args.cancel) { return; }
        }
        if (args.isCol) {
            this.hideCol(args);
        } else {
            this.hideRow(args);
        }
        if (args.actionUpdate) { this.parent.notify(completeAction, { eventArgs: args, action: 'hideShow' }); }
    }
    private hideRow(eventArgs: HideShowEventArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet(); let cell: CellModel;
        let count: number = 0; let idx: number; let nextIdx: number; let merge: boolean;
        let model: ExtendedRowModel;
        const args: HideShowEventArgs = Object.assign({}, eventArgs);
        const isFinite: boolean = this.parent.scrollSettings.isFinite;
        let height: number;
        if (isFinite) {
            if (args.startIndex >= sheet.rowCount) { return; }
            if (args.endIndex >= sheet.rowCount) { args.endIndex = sheet.rowCount - 1; }
            height = 0;
        }
        if (args.hide) {
            let content: HTMLTableElement; let rowHdr: HTMLTableElement; let row: HTMLTableRowElement;
            const updateBtmIdx: boolean = isFinite && args.endIndex === skipHiddenIdx(sheet, sheet.rowCount - 1, false);
            for (let i: number = args.startIndex; i <= args.endIndex; i++) {
                if (isHiddenRow(sheet, i)) { continue; }
                if (idx === undefined) {
                    if (sheet.showHeaders) { rowHdr = this.parent.getRowHeaderTable(); }
                    content = this.parent.getContentTable();
                    idx = this.parent.getViewportIndex(i); count = 0;
                }
                model = { hidden: true };
                if (args.isFiltering) { model.isFiltered = true; }
                setRow(sheet, i, model);
                if (isFinite) {
                    height += getRowHeight(sheet, i, true, true);
                }
                this.refreshChart(i, 'rows');
                row = content && content.rows[idx];
                if (row) {
                    if (!merge) {
                        for (let j: number = 0; j <= sheet.usedRange.colIndex; j++) {
                            cell =  getCell(i, j, sheet) || {};
                            if ((cell.colSpan || cell.rowSpan) && (args.startIndex >= this.parent.viewport.topIndex ||
                                this.parent.scrollSettings.enableVirtualization)) { merge = true; break; }
                        }
                    }
                    if (merge) { continue; }
                    if (sheet.showHeaders) { detach(rowHdr.rows[idx]); }
                    detach(row); count++;
                    row = content.rows[idx];
                    if (row && i === args.endIndex) {
                        let cell: HTMLElement; nextIdx = skipHiddenIdx(sheet, i + 1, true);
                        const first: string = nextIdx !== skipHiddenIdx(sheet, 0, true) && nextIdx ===
                        (this.parent.viewport.topIndex >= args.startIndex ? args.endIndex + 1 : this.parent.viewport.topIndex) ? 'Row' : '';
                        for (let j: number = this.parent.viewport.leftIndex; j <= this.parent.viewport.rightIndex; j++) {
                            const borderTop: string = this.parent.getCellStyleValue(['borderTop'], [nextIdx, j]).borderTop;
                            if (borderTop !== '') {
                                cell = row.cells[j];
                                this.parent.notify(applyCellFormat, <CellFormatArgs>{ onActionUpdate: false, rowIdx: nextIdx, colIdx: j,
                                    style: { borderTop: borderTop }, row: row, pRow: <HTMLElement>row.previousElementSibling,
                                    first: first, cell: cell });
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
            if (merge && (args.startIndex >= this.parent.viewport.topIndex || !this.parent.scrollSettings.enableVirtualization)) {
                this.parent.selectRange(sheet.selectedRange);
                this.parent.renderModule.refreshUI({
                    rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                });
                return;
            }
            if (!count) { return; }
            this.parent.selectRange(sheet.selectedRange);
            const updateHideClass: Function = (): void => {
                if (sheet.showHeaders) {
                    if (idx === 0) {
                        if (rowHdr.rows[0]) { rowHdr.rows[0].classList.add('e-hide-end'); }
                    } else {
                        if (rowHdr && rowHdr.rows[idx - 1]) { rowHdr.rows[idx - 1].classList.add('e-hide-start'); }
                        if (rowHdr && rowHdr.rows[idx]) { rowHdr.rows[idx].classList.add('e-hide-end'); }
                    }
                }
            };
            if (this.parent.scrollSettings.enableVirtualization) {
                let startIndex: number = args.startIndex; const endIndex: number = args.startIndex;
                if (this.parent.viewport.topIndex >= args.startIndex) {
                    if (!args.isFiltering || this.parent.viewport.topIndex === args.startIndex) {
                        this.parent.viewport.topIndex = args.endIndex + 1;
                    } else {
                        args.aboveViewport = true;
                        return;
                    }
                }
                args.startIndex = this.parent.viewport.bottomIndex + 1; args.endIndex = args.startIndex + count - 1;
                const indexes: number[] = this.parent.skipHidden(args.startIndex, args.endIndex, 'rows', false);
                args.startIndex = indexes[0]; args.endIndex = indexes[1];
                if (isFinite) {
                    const refreshSheet: Function = (): void => {
                        const prevTop: number = this.parent.viewport.topIndex;
                        this.parent.viewport.bottomIndex = args.endIndex = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
                        startIndex = this.parent.viewport.topIndex = this.parent.renderModule.decreaseHidden(
                            args.endIndex - (this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2)), args.endIndex);
                        this.parent.notify(setScrollEvent, { set: false });
                        this.parent.notify(updateTranslate, { isHide: true, height: height, prevSize: prevTop });
                        const eventArgs: ScrollEventArgs = { skipRowVirualScroll: true };
                        eventArgs.scrollTop = this.parent.getMainContent().parentElement.scrollTop;
                        this.parent.notify(onContentScroll, eventArgs);
                        getUpdateUsingRaf((): void => this.parent.notify(setScrollEvent, { set: true }));
                        this.parent.renderModule.refreshUI(
                            { rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row',
                                skipTranslate: true });
                    };
                    if (args.startIndex >= sheet.rowCount) {
                        if (this.parent.viewport.topIndex === skipHiddenIdx(sheet, 0, true)) {
                            updateHideClass();
                            if (updateBtmIdx) {
                                this.parent.viewport.bottomIndex = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
                            }
                            return;
                        }
                        refreshSheet(); return;
                    } else if (args.endIndex >= sheet.rowCount) {
                        refreshSheet(); return;
                    } else {
                        this.parent.notify(updateTranslate, { isHide: true, height: height });
                    }
                }
                this.parent.viewport.bottomIndex = args.endIndex;
                if (count > this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2)) {
                    startIndex = startIndex < 1 ? endIndex + 1 : startIndex - 1;
                    this.parent.updateTopLeftCell(startIndex, null);
                    this.parent.renderModule.refreshSheet();
                } else {
                    this.parent.renderModule.refreshUI(
                        { colIndex: this.parent.viewport.leftIndex, direction: '', refresh: 'RowPart' },
                        `${getCellAddress(args.startIndex, this.parent.viewport.leftIndex)}:${getCellAddress(
                            args.endIndex, this.parent.viewport.rightIndex)}`);
                }
            }
            updateHideClass();
        } else {
            let hFrag: DocumentFragment; let frag: DocumentFragment; let hRow: Element; let row: Element;
            let rowRenderer: IRowRenderer; let rTBody: Element; let tBody: Element; let startRow: number;
            let endRow: number = args.startIndex - 1; let newStartRow: number; const mergeCollection: MergeArgs[] = [];
            let skipDetach: boolean; let direction: string = 'lastElementChild'; let detachedHeight: number = 0;
            if (isFinite) {
                const lastIdx: number = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
                if (this.parent.viewport.bottomIndex === lastIdx) {
                    if (this.parent.viewport.topIndex === skipHiddenIdx(sheet, 0, true)) {
                        skipDetach = true;
                    } else {
                        const topLeftCell: number = getRangeIndexes(sheet.topLeftCell)[0];
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
                        for (let j: number = 0; j <= sheet.usedRange.colIndex; j++) {
                            this.parent.notify(addHighlight, { range: getRangeAddress([args.startIndex, j]), td: undefined });
                        }
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
                if (isFinite) {
                    height += getRowHeight(sheet, i, true, true);
                }
                this.refreshChart(i, 'rows');
                if (idx === undefined) {
                    hFrag = document.createDocumentFragment(); frag = document.createDocumentFragment();
                    rowRenderer = this.parent.serviceLocator.getService<IRowRenderer>('row');
                    if (sheet.showHeaders && this.parent.getRowHeaderTable()) { rTBody = this.parent.getRowHeaderTable().tBodies[0]; }
                    tBody = this.parent.getContentTable() ? this.parent.getContentTable().tBodies[0] : this.parent.getContentTable();
                    if (i < this.parent.viewport.topIndex) { this.parent.viewport.topIndex = i; }
                    if (i === 0) {
                        idx = 0;
                    } else {
                        idx = this.parent.getViewportIndex(i);
                    }
                }
                endRow++;
                if (sheet.showHeaders) {
                    hRow = rowRenderer.refresh(i, null, null, true);
                    hFrag.appendChild(hRow);
                    if (rTBody && rTBody.childElementCount && !skipDetach) { detach(rTBody[direction]); }
                }
                row = frag.appendChild(rowRenderer.refresh(i, row, hRow));
                if (tBody && tBody.childElementCount && !skipDetach) {
                    detach(tBody[direction]);
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
                    if (cell.rowSpan !== undefined) {
                        const mergeArgs: MergeArgs = { range: [i, j, i, j], isAction: false, merge: true,
                            type: 'All', skipChecking: true };
                        this.parent.notify(activeCellMergedRange, mergeArgs);
                        if (!mergeCollection.length || mergeArgs.range[1] !== mergeCollection[mergeCollection.length - 1].range[1]) {
                            mergeCollection.push(mergeArgs);
                        }
                    }
                }
            }
            if (idx === undefined) { return; }
            this.parent.viewport.bottomIndex = this.parent.viewport.topIndex + this.parent.viewport.rowCount +
                (this.parent.getThreshold('row') * 2);
            count = this.parent.hiddenCount(this.parent.viewport.topIndex, args.startIndex) +
                this.parent.hiddenCount(args.endIndex + 1, this.parent.viewport.bottomIndex);
            this.parent.viewport.bottomIndex += count;
            if (isFinite && this.parent.viewport.bottomIndex >= sheet.rowCount) {
                this.parent.viewport.bottomIndex = skipHiddenIdx(sheet, sheet.rowCount - 1, false);
            }
            args.insertIdx = idx; args.row = frag.querySelector('.e-row'); args.mergeCollection = mergeCollection;
            if (sheet.showHeaders) {
                args.hdrRow = hFrag.querySelector('.e-row');
                if (idx !== 0 && !isHiddenRow(sheet, endRow - 1) && rTBody.children[idx - 1]) {
                    rTBody.children[idx - 1].classList.remove('e-hide-start');
                }
                if (args.startIndex !== 0 && isHiddenRow(sheet, args.startIndex - 1)) {
                    args.hdrRow.classList.add('e-hide-end');
                }
                if (isHiddenRow(sheet, endRow + 1)) {
                    hFrag.lastElementChild.classList.add('e-hide-start');
                } else {
                    if (rTBody.children[idx]) { rTBody.children[idx].classList.remove('e-hide-end'); }
                }
            }
            if (row && tBody && tBody.children[idx]) {
                nextIdx = skipHiddenIdx(sheet, endRow + 1, true);
                for (let i: number = this.parent.viewport.leftIndex; i <= this.parent.viewport.rightIndex; i++) {
                    const borderTop: string = this.parent.getCellStyleValue(['borderTop'], [nextIdx, i]).borderTop;
                    if (borderTop !== '') {
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{ onActionUpdate: false, rowIdx: nextIdx, colIdx: i,
                            style: { borderTop: borderTop }, pRow: <HTMLElement>row, cell: tBody.children[idx].children[i],
                            first: '' });
                        const prevIdx: number = skipHiddenIdx(sheet, startRow - 1, false);
                        if (prevIdx > -1) {
                            if (tBody.children[idx - 1] && !this.parent.getCellStyleValue(['borderBottom'], [prevIdx, i]).borderBottom &&
                                !this.parent.getCellStyleValue(['borderTop'], [startRow, i]).borderTop) {
                                (tBody.children[idx - 1].children[i] as HTMLElement).style.borderBottom = '';
                            }
                        } else {
                            (tBody.children[idx].children[i] as HTMLElement).style.borderTop = '';
                        }
                    }
                }
            }
            if (args.skipAppend) { return; }
            if (isFinite) {
                this.parent.notify(updateTranslate, { height: height, size: detachedHeight });
            }
            if (Math.abs(endRow - startRow) > this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2)) {
                this.parent.renderModule.refreshSheet();
            } else {
                if (sheet.showHeaders && rTBody) { rTBody.insertBefore(hFrag, rTBody.children[idx]); }
                if (tBody) { tBody.insertBefore(frag, tBody.children[idx]); }
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
        const sheet: SheetModel = this.parent.getActiveSheet();
        const hiddenIndex: number[] = []; const beforeViewportIdx: number[] = [];
        const topLeftCell: number[] = getCellIndexes(sheet.topLeftCell); let scrollable: boolean;
        for (let i: number = args.startIndex; i <= args.endIndex; i++) {
            if (args.hide ? isHiddenCol(sheet, i) : !isHiddenCol(sheet, i)) { continue; }
            setColumn(sheet, i, { hidden: args.hide });
            this.refreshChart(i, 'columns');
            if (this.parent.scrollSettings.enableVirtualization && (i < this.parent.viewport.leftIndex ||
                i > this.parent.viewport.rightIndex)) {
                if (i < this.parent.viewport.leftIndex) { beforeViewportIdx.push(i); }
                continue;
            }
            hiddenIndex.push(i);
            if (args.hide && topLeftCell[1] === i) {
                scrollable = true;
            }
        }
        if (!beforeViewportIdx.length && !hiddenIndex.length) { return; }
        if (args.hide) {
            if (!hiddenIndex.length) { return; }
            if (hiddenIndex.length <= this.parent.getThreshold('col') || !this.parent.scrollSettings.enableVirtualization) {
                this.removeCell(sheet, hiddenIndex);
            }
            if (this.parent.scrollSettings.enableVirtualization) {
                if (hiddenIndex[0] === this.parent.viewport.leftIndex) {
                    this.parent.viewport.leftIndex = skipHiddenIdx(sheet, hiddenIndex[hiddenIndex.length - 1] + 1, true, 'columns');
                }
                if (scrollable) {
                    let scrollWidth: number = 0;
                    hiddenIndex.slice(0, hiddenIndex.indexOf(topLeftCell[1])).forEach((colIdx: number): void => {
                        scrollWidth += getColumnWidth(sheet, colIdx, true);
                    });
                    if (scrollWidth) {
                        this.parent.notify(setScrollEvent, { set: false });
                        const content: Element = this.parent.getMainContent();
                        content.scrollLeft -= scrollWidth;
                        this.parent.notify(
                            onContentScroll, <ScrollEventArgs>{ scrollLeft: content.scrollLeft, preventScroll: true, skipHidden: true });
                        getUpdateUsingRaf((): void => this.parent.notify(setScrollEvent, { set: true }));
                    }
                }
                if (this.parent.scrollSettings.isFinite) {
                    const colCount: number = skipHiddenIdx(sheet, sheet.colCount - 1, false, 'columns');
                    const startIdx: number = this.parent.viewport.leftIndex; const endIndex: number = this.parent.viewport.rightIndex;
                    if (endIndex + hiddenIndex.length >= colCount) {
                        const index: number = skipHiddenIdx(
                            sheet, startIdx - ((endIndex + hiddenIndex.length) - colCount), false, 'columns');
                        if (index > -1) {
                            this.parent.viewport.leftIndex = index;
                            this.parent.viewport.leftIndex -= this.parent.hiddenCount(endIndex, colCount);
                        }
                        this.parent.viewport.rightIndex = colCount;
                        if (startIdx !== this.parent.viewport.leftIndex || endIndex !== this.parent.viewport.rightIndex) {
                            this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(
                                sheet, 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex:
                                this.parent.viewport.leftIndex, refresh: 'Column' });
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
                        { rowIndex: this.parent.viewport.topIndex, colIndex: indexes[0], direction: '', refresh: 'ColumnPart' },
                        `${getRangeAddress([this.parent.viewport.topIndex, indexes[0], this.parent.viewport.bottomIndex, indexes[1]])}`);
                } else {
                    this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(
                        sheet, 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex,
                    refresh: 'Column' });
                }
            }
            this.parent.selectRange(sheet.selectedRange);
        } else {
            if (beforeViewportIdx.length) {
                beforeViewportIdx.sort((i: number, j: number): number => { return i - j; });
                if (this.parent.scrollSettings.enableVirtualization && beforeViewportIdx[0] < this.parent.getThreshold('col')) {
                    const rowIdx: number = getCellIndexes(sheet.topLeftCell)[0] + 1;
                    this.parent.setSheetPropertyOnMute(sheet, 'topLeftCell', `A${rowIdx}`);
                    this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, rowIndex: this.parent.viewport.topIndex, colIndex: 0,
                        refresh: 'Column' });
                    this.parent.selectRange(sheet.selectedRange);
                } else {
                    this.parent.goTo(getCellAddress(this.parent.viewport.topIndex, beforeViewportIdx[0]));
                }
                return;
            }
            if (hiddenIndex.length <= this.parent.getThreshold('col') || !this.parent.scrollSettings.enableVirtualization) {
                this.appendCell(sheet, hiddenIndex);
                if (this.parent.scrollSettings.enableVirtualization) { this.parent.notify(virtualContentLoaded, { refresh: 'Column',
                    prevRowColCnt: { rowCount: sheet.rowCount, colCount: sheet.colCount } }); }
            } else {
                this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(
                    sheet, 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex,
                refresh: 'Column' });
            }
            this.parent.selectRange(sheet.selectedRange);
        }
    }
    private removeCell(sheet: SheetModel, indexes: number[]): void {
        let startIdx: number; let endIdx: number; let hRow: HTMLTableRowElement; let row: HTMLTableRowElement; let hColgrp: HTMLElement;
        let rowIdx: number = 0; const cellIdx: number = this.parent.getViewportIndex(indexes[0], true) + 1;
        let cell: CellModel;
        if (this.parent.scrollSettings.enableVirtualization) {
            startIdx = this.parent.viewport.topIndex; endIdx = this.parent.viewport.bottomIndex;
        } else {
            startIdx = 0; endIdx = sheet.rowCount - 1;
        }
        const table: HTMLTableElement = this.parent.getContentTable(); let nextIdx: number;
        const colgrp: HTMLElement = table.getElementsByTagName('colgroup')[0];
        if (sheet.showHeaders) {
            const hTable: HTMLTableElement = this.parent.getColHeaderTable();
            hColgrp = hTable.getElementsByTagName('colgroup')[0]; hRow = hTable.rows[0];
        }
        const modelLen: number = indexes.length - 1;
        while (startIdx <= endIdx) {
            if (isHiddenRow(sheet, startIdx)) { startIdx++; continue; }
            row = table.rows[rowIdx];
            indexes.forEach((idx: number, index: number): void => {
                detach(row.cells[cellIdx]);
                if (rowIdx === 0) {
                    if (sheet.showHeaders) {
                        detach(hRow.cells[cellIdx]); detach(hColgrp.children[cellIdx]);
                    }
                    detach(colgrp.children[cellIdx]);
                }
                if (index === 0) {
                    cell = getCell(startIdx, idx, sheet) || {};
                    if (cell.colSpan !== undefined && (cell.rowSpan === undefined || cell.colSpan > 1)) {
                        this.parent.notify(hiddenMerge, { rowIdx: startIdx, colIdx: idx, model: 'col',
                            start: indexes[0], end: indexes[modelLen] });
                    }
                }
                if (index === modelLen) {
                    nextIdx = skipHiddenIdx(sheet, idx + 1, true, 'columns');
                    const borderLeft: string = this.parent.getCellStyleValue(['borderLeft'], [rowIdx, nextIdx]).borderLeft;
                    if (borderLeft !== '') {
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{ onActionUpdate: false, rowIdx: rowIdx, colIdx: nextIdx,
                            style: { borderLeft: borderLeft }, row: row, first: '' });
                    }
                    cell = getCell(startIdx, idx, sheet) || {};
                    if (cell.colSpan !== undefined && (cell.rowSpan === undefined || cell.colSpan > 1)) {
                        this.parent.notify(hiddenMerge, { rowIdx: startIdx, colIdx: idx, model: 'col',
                            start: indexes[0], end: indexes[modelLen], isEnd: true });
                    }
                }
            });
            startIdx++; rowIdx++;
        }
        if (cellIdx - 1 > -1) {
            if (sheet.showHeaders && hRow.cells[cellIdx - 1]) { hRow.cells[cellIdx - 1].classList.add('e-hide-start'); }
        }
        if (sheet.showHeaders && hRow.cells[cellIdx]) { hRow.cells[cellIdx].classList.add('e-hide-end'); }
    }
    private appendCell(sheet: SheetModel, indexes: number[]): void {
        let startIdx: number; let endIdx: number; let hRow: HTMLTableRowElement; let row: HTMLTableRowElement; let hColgrp: HTMLElement;
        let rowIdx: number = 0; let prevIdx: number;
        if (this.parent.scrollSettings.enableVirtualization) {
            startIdx = this.parent.viewport.topIndex; endIdx = this.parent.viewport.bottomIndex;
        } else {
            startIdx = 0; endIdx = sheet.rowCount - 1;
        }
        const table: HTMLTableElement = this.parent.getContentTable();
        const hTable: HTMLTableElement = this.parent.getColHeaderTable();
        const colgrp: HTMLElement = table.getElementsByTagName('colgroup')[0];
        if (sheet.showHeaders) {
            hColgrp = hTable.getElementsByTagName('colgroup')[0]; hRow = hTable.rows[0];
        }
        const cellRenderer: ICellRenderer = this.parent.serviceLocator.getService<ICellRenderer>('cell');
        indexes.sort((i: number, j: number): number => { return i - j; }); let cellModel: CellModel;
        const mergeCollection: MergeArgs[] = [];
        const cellIdx: number[] = []; let cell: Element; let refCell: HTMLElement; const modelLen: number = indexes.length - 1;
        while (startIdx <= endIdx) {
            if (isHiddenRow(sheet, startIdx)) { startIdx++; continue; }
            row = table.rows[rowIdx];
            indexes.forEach((idx: number, index: number): void => {
                if (rowIdx === 0) {
                    cellIdx[index] = this.parent.getViewportIndex(idx, true);
                    if (colgrp.children[cellIdx[index]]) {
                        colgrp.insertBefore(this.parent.sheetModule.updateCol(sheet, idx), colgrp.children[cellIdx[index]]);
                        if (sheet.showHeaders) {
                            refCell = hRow.cells[cellIdx[index]];
                            if (index === 0 && indexes[index] && !isHiddenCol(sheet, indexes[index] - 1)) {
                                refCell.previousElementSibling.classList.remove('e-hide-start');
                            }
                            hRow.insertBefore(cellRenderer.renderColHeader(idx), refCell);
                            if (index === modelLen) {
                                refCell.classList.remove('e-hide-end');
                            }
                        }
                    } else {
                        colgrp.appendChild(this.parent.sheetModule.updateCol(sheet, idx));
                        if (sheet.showHeaders) { hRow.appendChild(cellRenderer.renderColHeader(idx)); }
                    }
                    detach(colgrp.lastChild); if (sheet.showHeaders) {
                        detach(hRow.lastChild);
                        if (index === modelLen) { detach(hColgrp); hTable.insertBefore(colgrp.cloneNode(true), hTable.tHead[0]); }
                    }
                }
                detach(row.lastChild);
                refCell = row.cells[cellIdx[index]];
                cell = cellRenderer.render(<CellRenderArgs>{ rowIdx: startIdx, colIdx: idx, cell: getCell(startIdx, idx, sheet),
                    address: getCellAddress(startIdx, idx), lastCell: idx === modelLen, isHeightCheckNeeded: true,
                    first: idx !== skipHiddenIdx(sheet, 0, true, 'columns') && idx === this.parent.viewport.leftIndex ? 'Column' : '',
                    checkNextBorder: index === modelLen ? 'Column' : '' });
                if (refCell) {
                    row.insertBefore(cell, refCell);
                } else {
                    row.appendChild(cell);
                }
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
                cellModel = getCell(rowIdx, idx, sheet) || {};
                if (cellModel.colSpan !== undefined && (cellModel.rowSpan === undefined || cellModel.colSpan > 1)) {
                    const mergeArgs: MergeArgs = { range: [rowIdx, idx, rowIdx, idx], isAction: false, merge: true,
                        type: 'All', skipChecking: true };
                    this.parent.notify(activeCellMergedRange, mergeArgs);
                    if (!mergeCollection.length || mergeArgs.range[1] !== mergeCollection[mergeCollection.length - 1].range[1]) {
                        mergeCollection.push(mergeArgs);
                    }
                }
            });
            startIdx++; rowIdx++;
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
