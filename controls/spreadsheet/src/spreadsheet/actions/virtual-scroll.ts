import { Spreadsheet } from '../base/index';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { spreadsheetDestroyed, beforeContentLoaded, beforeVirtualContentLoaded, virtualContentLoaded, RefreshType, removeAllChildren } from '../common/index';
import { colWidthChanged, updateTableWidth, focus, updateTranslate } from '../common/index';
import { IScrollArgs, onVerticalScroll, onHorizontalScroll, rowHeightChanged, deInitProperties } from '../common/index';
import { SheetModel, getRowsHeight, getColumnsWidth, getRangeIndexes, skipHiddenIdx, isHiddenCol } from './../../workbook/index';
import { getCellIndexes, getRangeAddress, updateRowColCount, sheetCreated, sheetsDestroyed } from '../../workbook/common/index';

/**
 * VirtualScroll module
 *
 * @hidden
 */
export class VirtualScroll {
    private parent: Spreadsheet;
    private rowHeader: HTMLElement;
    private colHeader: HTMLElement;
    private content: HTMLElement;
    private translateX: number;
    private translateY: number;
    private scroll: { rowCount: number, colCount: number }[] = [];

    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private createVirtualElement(args: { top: number, left: number }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let container: Element = this.parent.getMainContent();
        this.content = this.parent.createElement('div', { className: 'e-virtualable' });
        this.content.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.content);
        const vTrack: HTMLElement = container.appendChild(this.parent.createElement('div', { className: 'e-virtualtrack' }));
        let height: number = 0; let width: number;
        if (this.parent.sheets.length > this.scroll.length) { this.initScroll(); }
        let endIndex: number = this.parent.viewport.bottomIndex;
        if (sheet.rowCount > endIndex + 1 || sheet.usedRange.rowIndex > endIndex) {
            if (!this.parent.scrollSettings.isFinite && sheet.rowCount <= sheet.usedRange.rowIndex) {
                this.parent.setSheetPropertyOnMute(sheet, 'rowCount', sheet.usedRange.rowIndex + 1);
            }
            this.setScrollCount(sheet.rowCount, 'row');
        } else {
            if (!this.parent.scrollSettings.isFinite) { this.parent.setSheetPropertyOnMute(sheet, 'rowCount', endIndex + 1); }
            this.scroll[this.parent.activeSheetIndex].rowCount = sheet.rowCount;
        }
        let startIndex: number = this.parent.frozenRowCount(sheet); const indexes: number[] = getCellIndexes(sheet.topLeftCell);
        if (args.top) {
            height = args.top;
            if (sheet.frozenRows && !this.parent.scrollSettings.isFinite) {
                height += getRowsHeight(sheet, indexes[0], startIndex - 1, true);
            }
            startIndex = getCellIndexes(sheet.paneTopLeftCell)[0];
        }
        height += getRowsHeight(sheet, startIndex, this.scroll[this.parent.activeSheetIndex].rowCount - 1, true);
        endIndex = this.parent.viewport.rightIndex;
        let size: number = 0;
        const frozenCol: number = this.parent.frozenColCount(sheet);
        if (args.left) {
            size = args.left;
            if (frozenCol && !this.parent.scrollSettings.isFinite) { size += getColumnsWidth(sheet, indexes[1], frozenCol - 1, true); }
            startIndex = getCellIndexes(sheet.paneTopLeftCell)[1];
        } else {
            startIndex = frozenCol;
        }
        if (sheet.colCount > endIndex + 1 || sheet.usedRange.colIndex > endIndex) {
            if (!this.parent.scrollSettings.isFinite && sheet.colCount <= sheet.usedRange.colIndex) {
                this.parent.setSheetPropertyOnMute(sheet, 'colCount', sheet.usedRange.colIndex + 1);
            }
            size += getColumnsWidth(sheet, startIndex, endIndex, true);
            this.setScrollCount(sheet.colCount, 'col');
            width = size + getColumnsWidth(sheet, endIndex + 1, this.scroll[this.parent.activeSheetIndex].colCount - 1, true);
        } else {
            if (!this.parent.scrollSettings.isFinite) { this.parent.setSheetPropertyOnMute(sheet, 'colCount', endIndex + 1); }
            size += getColumnsWidth(sheet, startIndex, sheet.colCount - 1, true);
            this.scroll[this.parent.activeSheetIndex].colCount = sheet.colCount; width = size;
        }
        if (isNullOrUndefined(this.parent.viewport.leftIndex)) { this.parent.viewport.leftIndex = 0; }
        if (isNullOrUndefined(this.parent.viewport.topIndex)) { this.parent.viewport.topIndex = 0; }
        if (args.left) {
            size = getColumnsWidth(sheet, this.parent.viewport.leftIndex + frozenCol, endIndex, true);
        }
        if (isNullOrUndefined(this.translateX)) { this.translateX = 0; } if (isNullOrUndefined(this.translateY)) { this.translateY = 0; }
        container = this.parent.getRowHeaderContent();
        this.rowHeader = this.content.cloneNode() as HTMLElement;
        this.rowHeader.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.rowHeader);
        const rowVTrack: HTMLElement = container.appendChild(vTrack.cloneNode() as HTMLElement);
        this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
        container = this.parent.getColumnHeaderContent();
        this.colHeader = this.content.cloneNode() as HTMLElement;
        this.colHeader.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.colHeader);
        const colVTrack: HTMLElement = container.appendChild(vTrack.cloneNode() as HTMLElement);
        this.colHeader.style.width = `${size}px`;
        rowVTrack.style.height = `${height}px`;
        colVTrack.style.width = `${width}px`;
        this.colHeader.style.transform = `translate(${this.translateX}px, 0px)`;
        this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
        this.content.style.width = `${size}px`;
        vTrack.style.height = `${height}px`;
        vTrack.style.width = `${width}px`;
        if (this.parent.allowScrolling) {
            const scrollVTrack: HTMLElement = colVTrack.cloneNode(true) as HTMLElement;
            scrollVTrack.style.width = `${width + (this.parent.scrollSettings.isFinite ? this.parent.sheetModule.getScrollSize() : 0)}px`;
            this.parent.getScrollElement().appendChild(scrollVTrack);
        }
    }

    private initScroll(): void {
        let i: number = 0;
        while (i < this.parent.sheets.length) {
            if (!this.scroll[i as number]) { this.scroll.push({ rowCount: 0, colCount: 0 }); } i++;
        }
    }

    private setScrollCount(count: number, layout: string): void {
        const activeSheetIdx: number = this.parent.activeSheetIndex;
        if (!this.scroll[activeSheetIdx as number][layout + 'Count'] || this.scroll[activeSheetIdx as number][layout + 'Count'] !== count) {
            this.scroll[activeSheetIdx as number][layout + 'Count'] = count;
        }
    }

    private getRowAddress(indexes: number[]): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        return getRangeAddress(
            [indexes[0], sheet.frozenColumns ? getCellIndexes(sheet.topLeftCell)[1] : this.parent.viewport.leftIndex,
                indexes[1], this.parent.viewport.rightIndex]);
    }

    private getColAddress(indexes: number[]): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        return getRangeAddress(
            [sheet.frozenRows ? getCellIndexes(sheet.topLeftCell)[0] : this.parent.viewport.topIndex, indexes[0],
                this.parent.viewport.bottomIndex, indexes[1]]);
    }

    private updateScrollCount(idx: number, layout: string, threshold: number = idx): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let rowCount: number = idx + this.parent.viewport[layout + 'Count'] + 1 + threshold;
        const usedRangeCount: number = this.scroll[this.parent.activeSheetIndex][layout + 'Count'];
        if (rowCount < usedRangeCount) {
            if (sheet[layout + 'Count'] === usedRangeCount) { return; }
            rowCount = usedRangeCount;
        }
        if (!this.parent.scrollSettings.isFinite) {
            this.parent.setSheetPropertyOnMute(sheet, layout + 'Count', rowCount);
        }
    }

    private onVerticalScroll(args: IScrollArgs): void {
        let idx: number = args.cur.idx; const height: number = args.cur.size;
        const prevIdx: number = args.prev.idx;
        let idxDiff: number = Math.abs(idx - prevIdx);
        const threshold: number = this.parent.getThreshold('row');
        if (idxDiff > Math.round(threshold / 2)) {
            let startIdx: number; let lastIdx: number; let prevTopIdx: number;
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateY && prevIdx > threshold) {
                        this.translateY = 0;
                        const frozenCol: number = this.parent.frozenColCount(sheet);
                        const frozenRow: number = this.parent.frozenRowCount(sheet);
                        if (!args.preventScroll) {
                            const colIndex: number = frozenCol ? getCellIndexes(sheet.topLeftCell)[1] : this.parent.viewport.leftIndex;
                            const fIndexes: number[] = frozenCol ? [frozenRow, this.parent.viewport.leftIndex + frozenCol] : [];
                            if (idxDiff < this.parent.viewport.rowCount + threshold) {
                                startIdx = skipHiddenIdx(sheet, frozenRow, true);
                                lastIdx = skipHiddenIdx(sheet, (this.parent.viewport.topIndex + frozenRow) - 1, false);
                                this.parent.viewport.topIndex = startIdx - frozenRow;
                                const btmIdx: number = this.skipHiddenLastIdx(
                                    this.parent.viewport.bottomIndex - (((lastIdx - startIdx) + 1) - this.hiddenCount(startIdx, lastIdx)),
                                    this.parent.viewport.bottomIndex);
                                this.parent.viewport.bottomIndex = skipHiddenIdx(sheet, btmIdx, false);
                                this.parent.renderModule.refreshUI(
                                    {
                                        colIndex: colIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart',
                                        skipUpdateOnFirst: true, frozenIndexes: fIndexes
                                    },
                                    this.getRowAddress([startIdx, skipHiddenIdx(sheet, lastIdx, false)]));
                            } else {
                                const prevColIndex: number = this.parent.viewport.leftIndex;
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: 0, colIndex: colIndex, refresh: 'Row', skipUpdateOnFirst: true,
                                        frozenIndexes: fIndexes, skipTranslate: true });
                                if (frozenCol) { this.parent.viewport.leftIndex = prevColIndex; }
                                this.translate({ refresh: 'Row' });
                            }
                            focus(this.parent.element);
                            idx = 0;
                        } else {
                            this.parent.viewport.topIndex = prevIdx - (threshold - frozenRow);
                        }
                    }
                    this.updateScrollCount(threshold, 'row');
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (!args.increase && this.parent.scrollSettings.isFinite && this.parent.viewport.bottomIndex ===
                skipHiddenIdx(sheet, sheet.rowCount - 1, false)) {
                const frozenRow: number = this.parent.frozenRowCount(sheet);
                const thresholdIdx: number = this.parent.viewport.topIndex + frozenRow + getRangeIndexes(sheet.paneTopLeftCell)[0] - 1;
                if (idx + frozenRow > thresholdIdx) {
                    args.prev.idx = idx;
                    return;
                }
                idxDiff = thresholdIdx - (idx + frozenRow);
            }
            if (idx > threshold) {
                prevTopIdx = this.parent.viewport.topIndex;
                this.parent.viewport.topIndex = idx - threshold;
                if (args.increase && prevTopIdx > this.parent.viewport.topIndex) { this.parent.viewport.topIndex = prevTopIdx; return; }
                const frozenRow: number = this.parent.frozenRowCount(sheet);
                if (!args.preventScroll) {
                    const frozenCol: number = this.parent.frozenColCount(sheet);
                    let colIndex: number; const frozenIndexes: number[] = [];
                    if (frozenCol) {
                        colIndex = getCellIndexes(sheet.topLeftCell)[1];
                        frozenIndexes.push(frozenRow);
                        frozenIndexes.push(this.parent.viewport.leftIndex + frozenCol);
                    } else {
                        colIndex = this.parent.viewport.leftIndex;
                    }
                    if (idxDiff < this.parent.viewport.rowCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.bottomIndex + 1;
                            lastIdx = this.parent.viewport.bottomIndex + (this.parent.viewport.topIndex - prevTopIdx);
                            lastIdx -= this.hiddenCount(prevTopIdx + frozenRow, this.parent.viewport.topIndex - 1 + frozenRow);
                            if (lastIdx <= this.parent.viewport.bottomIndex || (this.parent.scrollSettings.isFinite &&
                                startIdx > skipHiddenIdx(sheet, sheet.rowCount - 1, false, 'rows'))) {
                                this.parent.viewport.topIndex = prevTopIdx;
                                return;
                            }
                            const indexes: number[] = this.parent.skipHidden(startIdx, lastIdx, 'rows', false);
                            const finiteProps: { index: number, diff: number } = this.checkLastIdx(indexes[1], 'row');
                            startIdx = indexes[0]; lastIdx = finiteProps.index;
                            let topIdx: number = this.parent.viewport.topIndex + frozenRow;
                            if (finiteProps.diff) {
                                const diffCount: number = ((lastIdx - startIdx) + 1) - this.hiddenCount(startIdx, lastIdx);
                                topIdx = skipHiddenIdx(sheet, prevTopIdx, true, 'rows', diffCount) + frozenRow;
                            }
                            this.parent.viewport.topIndex = skipHiddenIdx(sheet, topIdx, !finiteProps.diff) - frozenRow;
                            this.setThresholdHeight(
                                height, idx - this.parent.viewport.topIndex, frozenRow, !!finiteProps.diff,
                                prevTopIdx === skipHiddenIdx(sheet, frozenRow, true));
                            this.parent.viewport.bottomIndex = lastIdx;
                            this.parent.renderModule.refreshUI(
                                { colIndex: colIndex, rowIndex: startIdx, direction: 'first', refresh: 'RowPart',
                                    frozenIndexes: frozenIndexes },
                                this.getRowAddress([startIdx, lastIdx]));
                        } else {
                            startIdx = skipHiddenIdx(sheet, this.parent.viewport.topIndex + frozenRow, false);
                            if (startIdx < frozenRow) {
                                startIdx = frozenRow;
                                startIdx = skipHiddenIdx(sheet, startIdx, true);
                            }
                            this.parent.viewport.topIndex = startIdx - frozenRow;
                            lastIdx = skipHiddenIdx(sheet, (prevTopIdx + frozenRow) - 1, false);
                            if (lastIdx < frozenRow || lastIdx < startIdx) {
                                this.parent.viewport.topIndex = prevTopIdx;
                                return;
                            }
                            const btmIdx: number = this.skipHiddenLastIdx(
                                this.parent.viewport.bottomIndex - (((lastIdx - startIdx) + 1) - this.hiddenCount(startIdx, lastIdx)),
                                this.parent.viewport.bottomIndex);
                            this.parent.viewport.bottomIndex = skipHiddenIdx(sheet, btmIdx, false);
                            this.setThresholdHeight(height, idx - this.parent.viewport.topIndex, frozenRow);
                            this.parent.renderModule.refreshUI(
                                { colIndex: colIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart',
                                    frozenIndexes: frozenIndexes },
                                this.getRowAddress([startIdx, lastIdx]));
                        }
                    } else {
                        prevTopIdx = this.parent.viewport.leftIndex;
                        this.parent.viewport.topIndex = skipHiddenIdx(sheet, this.parent.viewport.topIndex + frozenRow, false) - frozenRow;
                        if (this.parent.viewport.topIndex < 0) {
                            this.parent.viewport.topIndex = skipHiddenIdx(sheet, frozenRow, true) - frozenRow;
                        }
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex, colIndex: colIndex, refresh: 'Row',
                            frozenIndexes: frozenIndexes, skipTranslate: true
                        });
                        if (frozenCol) { this.parent.viewport.leftIndex = prevTopIdx; }
                        this.setThresholdHeight(
                            height, idx - this.parent.viewport.topIndex, frozenRow,
                            this.parent.scrollSettings.isFinite && this.parent.viewport.bottomIndex ===
                            skipHiddenIdx(sheet, sheet.rowCount - 1, false));
                        this.translate({ refresh: 'Row' });
                    }
                    this.updateScrollCount(idx, 'row', threshold);
                    this.focusSheet();
                } else {
                    this.setThresholdHeight(height, threshold, frozenRow);
                    this.translate({ refresh: 'Row' });
                }
            }
            args.prev.idx = idx;
        }
    }

    private skipHiddenLastIdx(idx: number, prevIdx: number, layout: string = 'rows'): number {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let count: number = 0;
        for (let i: number = idx; i <= prevIdx; i++) {
            if ((sheet[`${layout}`])[i as number] && (sheet[`${layout}`])[i as number].hidden) {
                count++;
            }
        }
        if (count) {
            idx = this.skipHiddenLastIdx(idx - count, idx - 1, layout);
        }
        return idx;
    }

    private hiddenCount(startIdx: number, endIdx: number, layout: string = 'rows'): number {
        let index: number = 0; const sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = startIdx; i <= endIdx; i++) {
            if ((sheet[`${layout}`])[i as number] && (sheet[`${layout}`])[i as number].hidden) { index++; }
        }
        return index;
    }

    private checkLastIdx(idx: number, layout: string): { index: number, diff: number } {
        let diff: number = 0;
        if (this.parent.scrollSettings.isFinite) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const count: number = skipHiddenIdx(sheet, (sheet[layout + 'Count'] - 1), false, layout === 'col' ? 'columns' : 'rows');
            if (idx > count) {
                diff = idx - count; idx = count;
            }
        }
        return { index: idx, diff: diff };
    }

    private onHorizontalScroll(args: IScrollArgs): void {
        let idx: number = args.cur.idx; const width: number = args.cur.size;
        const prevIdx: number = args.prev.idx;
        let idxDiff: number = Math.abs(idx - prevIdx);
        const threshold: number = this.parent.getThreshold('col');
        if (idxDiff > Math.round(threshold / 2)) {
            let startIdx: number; let endIdx: number; let prevLeftIdx: number;
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateX && prevIdx > threshold) {
                        this.translateX = 0;
                        const frozenCol: number = this.parent.frozenColCount(sheet);
                        const frozenRow: number = this.parent.frozenRowCount(sheet);
                        if (!args.preventScroll) {
                            const rowIndex: number = frozenRow ? getCellIndexes(sheet.topLeftCell)[0] : this.parent.viewport.topIndex;
                            const fIndexes: number[] = frozenRow ? [this.parent.viewport.topIndex + frozenRow, frozenCol] : [];
                            if (idxDiff < this.parent.viewport.colCount + threshold) {
                                startIdx = skipHiddenIdx(sheet, frozenCol, true, 'columns');
                                endIdx = skipHiddenIdx(sheet, (this.parent.viewport.leftIndex + frozenCol) - 1, false, 'columns');
                                this.parent.viewport.leftIndex = startIdx - frozenCol;
                                const rightIdx: number = this.skipHiddenLastIdx(
                                    this.parent.viewport.rightIndex - (((endIdx - startIdx) + 1) -
                                    this.hiddenCount(startIdx, endIdx, 'columns')), this.parent.viewport.rightIndex, 'columns');
                                this.parent.viewport.rightIndex = skipHiddenIdx(sheet, rightIdx, false, 'columns');
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: rowIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart',
                                        skipUpdateOnFirst: true, frozenIndexes: fIndexes },
                                    this.getColAddress([startIdx, skipHiddenIdx(sheet, endIdx, false, 'columns')]));
                            } else {
                                const prevRowIndex: number = this.parent.viewport.topIndex;
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: rowIndex, colIndex: 0, refresh: 'Column', skipUpdateOnFirst: true,
                                        frozenIndexes: fIndexes, skipTranslate: true });
                                if (frozenRow) { this.parent.viewport.topIndex = prevRowIndex; }
                                this.translate({ refresh: 'Column' });
                            }
                            focus(this.parent.element);
                            idx = 0;
                        } else {
                            this.parent.viewport.leftIndex = prevIdx - (threshold - frozenCol);
                        }
                    }
                    this.updateScrollCount(threshold, 'col');
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (!args.increase && this.parent.scrollSettings.isFinite && this.parent.viewport.rightIndex ===
                skipHiddenIdx(sheet, sheet.colCount - 1, false, 'columns')) {
                const frozenCol: number = this.parent.frozenColCount(sheet);
                let thresholdIdx: number = this.parent.viewport.leftIndex + frozenCol + getRangeIndexes(sheet.paneTopLeftCell)[1] - 1;
                thresholdIdx += this.hiddenCount(this.parent.viewport.leftIndex + frozenCol, thresholdIdx);
                if (idx + frozenCol > thresholdIdx) {
                    args.prev.idx = idx;
                    return;
                }
                idxDiff = thresholdIdx - (idx + frozenCol);
            }
            if (idx > threshold) {
                prevLeftIdx = this.parent.viewport.leftIndex;
                this.parent.viewport.leftIndex = idx - threshold;
                if (args.increase && prevLeftIdx > this.parent.viewport.leftIndex) { this.parent.viewport.leftIndex = prevLeftIdx; return; }
                const frozenCol: number = this.parent.frozenColCount(sheet);
                if (!args.preventScroll) {
                    const frozenRow: number = this.parent.frozenRowCount(sheet);
                    const rowIndex: number = frozenRow ? getCellIndexes(sheet.topLeftCell)[0] : this.parent.viewport.topIndex;
                    let frozenIndexes: number[] = [];
                    if (frozenRow) {
                        frozenIndexes = [frozenRow + this.parent.viewport.topIndex, frozenCol];
                    }
                    if (idxDiff < this.parent.viewport.colCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.rightIndex + 1;
                            endIdx = this.parent.viewport.rightIndex + (this.parent.viewport.leftIndex - prevLeftIdx);
                            endIdx -= this.hiddenCount(prevLeftIdx + frozenCol, this.parent.viewport.leftIndex - 1 + frozenCol, 'columns');
                            if (endIdx <= this.parent.viewport.rightIndex || (this.parent.scrollSettings.isFinite &&
                                startIdx > skipHiddenIdx(sheet, sheet.colCount - 1, false, 'columns'))) {
                                this.parent.viewport.leftIndex = prevLeftIdx;
                                return;
                            }
                            const indexes: number[] = this.parent.skipHidden(startIdx, endIdx, 'columns', false);
                            const finiteOffset: { index: number, diff: number } = this.checkLastIdx(indexes[1], 'col');
                            startIdx = indexes[0]; endIdx = finiteOffset.index;
                            this.parent.viewport.leftIndex = skipHiddenIdx(
                                sheet, (this.parent.viewport.leftIndex - finiteOffset.diff) + frozenCol,
                                !finiteOffset.diff, 'columns') - frozenCol;
                            this.setThresholdWidth(
                                width, idx - this.parent.viewport.leftIndex, frozenCol, !!finiteOffset.diff,
                                prevLeftIdx === skipHiddenIdx(sheet, frozenCol, true, 'columns'));
                            this.parent.viewport.rightIndex = endIdx;
                            this.parent.renderModule.refreshUI(
                                { rowIndex: rowIndex, colIndex: startIdx, direction: 'first', refresh: 'ColumnPart',
                                    frozenIndexes: frozenIndexes },
                                this.getColAddress([startIdx, endIdx]));
                        } else {
                            startIdx = skipHiddenIdx(sheet, this.parent.viewport.leftIndex + frozenCol, false, 'columns');
                            if (startIdx < frozenCol) {
                                startIdx = frozenCol;
                                startIdx = skipHiddenIdx(sheet, startIdx, true, 'columns');
                            }
                            this.parent.viewport.leftIndex = startIdx - frozenCol;
                            endIdx = skipHiddenIdx(sheet, (prevLeftIdx + frozenCol) - 1, false, 'columns');
                            if (endIdx < frozenCol || endIdx < startIdx) {
                                this.parent.viewport.leftIndex = prevLeftIdx;
                                return;
                            }
                            const rightIdx: number = this.skipHiddenLastIdx(
                                this.parent.viewport.rightIndex - (((endIdx - startIdx) + 1) -
                                this.hiddenCount(startIdx, endIdx, 'columns')), this.parent.viewport.rightIndex, 'columns');
                            this.parent.viewport.rightIndex = skipHiddenIdx(sheet, rightIdx, false, 'columns');
                            this.setThresholdWidth(width, idx - this.parent.viewport.leftIndex, frozenCol);
                            this.parent.renderModule.refreshUI(
                                { rowIndex: rowIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart',
                                    frozenIndexes: frozenIndexes },
                                this.getColAddress([startIdx, endIdx]));
                        }
                    } else {
                        prevLeftIdx = this.parent.viewport.topIndex;
                        this.parent.viewport.leftIndex = skipHiddenIdx(sheet, this.parent.viewport.leftIndex + frozenCol, false, 'columns')
                            - frozenCol;
                        if (this.parent.viewport.leftIndex < 0) {
                            this.parent.viewport.leftIndex = skipHiddenIdx(sheet, frozenCol, true, 'columns') - frozenCol;
                        }
                        this.parent.renderModule.refreshUI({
                            rowIndex: rowIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Column', frozenIndexes: frozenIndexes,
                            skipTranslate: true
                        });
                        if (frozenRow) {
                            this.parent.viewport.topIndex = prevLeftIdx;
                        }
                        this.setThresholdWidth(
                            width, idx - this.parent.viewport.leftIndex, frozenCol,
                            this.parent.scrollSettings.isFinite && this.parent.viewport.rightIndex ===
                            skipHiddenIdx(sheet, sheet.colCount - 1, false, 'columns'));
                        this.translate({ refresh: 'Column' });
                    }
                    this.updateScrollCount(idx, 'col', threshold);
                    this.focusSheet();
                } else {
                    this.setThresholdWidth(width, threshold, frozenCol);
                    this.translate({ refresh: 'Column' });
                }
            }
            args.prev.idx = idx;
        }
    }

    private focusSheet(): void {
        if (!document.activeElement.classList.contains('e-text-findNext-short') || !closest(
            document.activeElement, '#' + this.parent.element.id)) {
            focus(this.parent.element);
        }
    }

    private setThresholdHeight(scrollHeight: number, threshold: number, frozenRow: number, endReached?: boolean, isInit?: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const start: number = this.parent.viewport.topIndex + frozenRow;
        const end: number = (start + threshold) - 1;
        if (endReached || isInit || end < start) {
            this.translateY = start <= frozenRow ? 0 : getRowsHeight(sheet, frozenRow, start - 1, true);
        } else {
            this.translateY = scrollHeight - getRowsHeight(sheet, start, end, true);
        }
    }

    private setThresholdWidth(scrollWidth: number, threshold: number, frozenCol: number, endReached?: boolean, isInit?: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const start: number = this.parent.viewport.leftIndex + frozenCol;
        const end: number = (start + threshold) - 1;
        if (endReached || isInit || end < start) {
            this.translateX = start <= frozenCol ? 0 : getColumnsWidth(sheet, frozenCol, start - 1, true);
        } else {
            this.translateX = scrollWidth - getColumnsWidth(sheet, start, end, true);
        }
    }

    private translate(args: { refresh: RefreshType, skipTranslate?: boolean }): void {
        if (args.skipTranslate || !this.content) { return; }
        let translateX: number = this.translateX || 0;
        translateX = this.parent.enableRtl ? -translateX : translateX;
        if (args.refresh === 'Row' || args.refresh === 'RowPart') {
            this.content.style.transform = `translate(${translateX}px, ${this.translateY}px)`;
            this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
        }
        if (args.refresh === 'Column' || args.refresh === 'ColumnPart') {
            this.content.style.transform = `translate(${translateX}px, ${this.translateY}px)`;
            this.colHeader.style.transform = `translate(${translateX}px, 0px)`;
        }
    }

    private updateColumnWidth(args: { refresh: RefreshType, isUpdate?: boolean }): void {
        if (args.refresh === 'Column') {
            this.content.style.width = '';
            const sheet: SheetModel = this.parent.getActiveSheet();
            const width: number = getColumnsWidth(
                sheet, this.parent.viewport.leftIndex + this.parent.frozenColCount(sheet), this.parent.viewport.rightIndex, true);
            this.colHeader.style.width = width + 'px';
            this.content.style.width = width + 'px';
            if (!this.parent.scrollSettings.isFinite || args.isUpdate) {
                const scroll: HTMLElement = this.parent.element.querySelector('.e-scroller .e-virtualtrack') as HTMLElement;
                if (!scroll) { return; }
                const scrollWidth: number = parseInt(scroll.style.width, 10);
                const newWidth: number = width + this.translateX + this.parent.viewport.beforeFreezeWidth;
                if (newWidth > scrollWidth) {
                    const diff: number = newWidth - scrollWidth; scroll.style.width = scrollWidth + diff + 'px';
                } else {
                    const diff: number = scrollWidth - newWidth;
                    const vTrack: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
                    if (scrollWidth - diff < parseInt(vTrack.style.width, 10)) { scroll.style.width = vTrack.style.width; }
                }
            }
        } else if (!this.parent.scrollSettings.isFinite) {
            const vTrack: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            const vTrackHeight: number =
                parseInt(vTrack.style.height, 10); const height: number = this.content.getBoundingClientRect().height;
            const newHeight: number = height + this.translateY + this.parent.viewport.beforeFreezeHeight;
            if (newHeight > vTrackHeight) {
                const diff: number = newHeight - vTrackHeight; vTrack.style.height = vTrackHeight + diff + 'px';
            } else {
                const diff: number = vTrackHeight - newHeight;
                const hVTrack: HTMLElement = this.parent.getRowHeaderContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
                if (vTrackHeight - diff < parseInt(hVTrack.style.height, 10)) { vTrack.style.height = hVTrack.style.height; }
            }
        }
    }

    private updateRowColCount(args: { index: number, update: string, start?: number, end?: number, isDelete?: boolean }): void {
        if (!this.scroll.length) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index !== this.scroll[this.parent.activeSheetIndex].rowCount - 1) {
                const height: number = this.getVTrackHeight('height'); let newHeight: number = height;
                if (args.index >= this.scroll[this.parent.activeSheetIndex].rowCount) {
                    if (args.start === undefined) {
                        newHeight += getRowsHeight(sheet, this.scroll[this.parent.activeSheetIndex].rowCount, args.index, true);
                    } else {
                        newHeight += getRowsHeight(sheet, args.start, args.end, true);
                    }
                } else {
                    if (args.start === undefined) {
                        newHeight -= getRowsHeight(sheet, args.index + 1, this.scroll[this.parent.activeSheetIndex].rowCount - 1, true);
                    } else {
                        newHeight -= getRowsHeight(sheet, args.start, args.end, true);
                    }
                }
                if (!args.isDelete && newHeight < height) { return; }
                this.scroll[this.parent.activeSheetIndex].rowCount = args.index + 1;
                this.updateVTrack(this.rowHeader, newHeight, 'height');
                if (this.scroll[this.parent.activeSheetIndex].rowCount > sheet.rowCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'rowCount', this.scroll[this.parent.activeSheetIndex].rowCount);
                }
            }
        } else {
            if (args.index !== this.scroll[this.parent.activeSheetIndex].colCount - 1) {
                const width: number = this.getVTrackHeight('width'); let newWidth: number = width;
                if (args.index >= this.scroll[this.parent.activeSheetIndex].colCount) {
                    if (args.start === undefined) {
                        newWidth += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetIndex].colCount, args.index, true);
                    } else {
                        newWidth += getColumnsWidth(sheet, args.start, args.end, true);
                    }
                } else {
                    if (args.start === undefined) {
                        newWidth -= getColumnsWidth(sheet, args.index + 1, this.scroll[this.parent.activeSheetIndex].colCount - 1, true);
                    } else {
                        newWidth -= getColumnsWidth(sheet, args.start, args.end, true);
                    }
                }
                if (!args.isDelete && newWidth < width) { return; }
                this.scroll[this.parent.activeSheetIndex].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, newWidth, 'width');
                if (this.scroll[this.parent.activeSheetIndex].colCount > sheet.colCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'colCount', this.scroll[this.parent.activeSheetIndex].colCount);
                }
            }
        }
    }

    private getVTrackHeight(str: string): number {
        let height: string = (this.content.nextElementSibling as HTMLElement).style[`${str}`];
        if (height.includes('e+')) {
            height = height.split('px')[0];
            const heightArr: string[] = height.split('e+');
            return Number(heightArr[0]) * Math.pow(10, Number(heightArr[1]));
        } else {
            return parseFloat(height);
        }
    }

    private updateVTrackHeight(args: { rowIdx: number, threshold: number }): void {
        if (!this.parent.allowScrolling) {
            return;
        }
        const frozenRow: number = this.parent.frozenRowCount(this.parent.getActiveSheet());
        if (args.rowIdx < this.scroll[this.parent.activeSheetIndex].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
        if (args.rowIdx >= frozenRow && args.rowIdx < this.parent.scrollModule.offset.top.idx + frozenRow) {
            const mainPanel: Element = this.parent.element.getElementsByClassName('e-main-panel')[0];
            if (mainPanel) {
                this.parent.scrollModule.prevScroll.scrollTop = mainPanel.scrollTop + args.threshold;
                mainPanel.scrollTop += args.threshold;
            }
            this.parent.scrollModule.offset.top.size += args.threshold;
            if (args.rowIdx < this.parent.viewport.topIndex + frozenRow) {
                this.translateY += args.threshold;
                this.translate({ refresh: 'Row' });
            }
        }
    }

    private updateVTrackWidth(args: { colIdx: number, threshold: number }): void {
        if (isHiddenCol(this.parent.getActiveSheet(), args.colIdx) || !this.parent.allowScrolling) {
            return;
        }
        const frozenCol: number = this.parent.frozenColCount(this.parent.getActiveSheet());
        if (args.colIdx >= this.parent.viewport.leftIndex + frozenCol && args.colIdx <= this.parent.viewport.rightIndex) {
            const hdrVTrack: HTMLElement = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            hdrVTrack.style.width = parseFloat(hdrVTrack.style.width) + args.threshold + 'px';
            const cntVTrack: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            cntVTrack.style.width = parseFloat(cntVTrack.style.width) + args.threshold + 'px';
            const scrollVTrack: HTMLElement = this.parent.getScrollElement().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            scrollVTrack.style.width = parseFloat(scrollVTrack.style.width) + args.threshold + 'px';
            const hdrColumn: HTMLElement = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            hdrColumn.style.width = parseFloat(hdrColumn.style.width) + args.threshold + 'px';
            const cntColumn: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            cntColumn.style.width = parseFloat(cntColumn.style.width) + args.threshold + 'px';
        } else if (args.colIdx >= frozenCol && args.colIdx < this.parent.viewport.leftIndex + frozenCol) {
            this.parent.scrollModule.offset.left.size += args.threshold;
            this.translateX += args.threshold;
            this.translate({ refresh: 'Column' });
        }
    }

    private updateVTrack(header: HTMLElement, size: number, sizeStr: string): void {
        (header.nextElementSibling as HTMLElement).style[`${sizeStr}`] = `${size}px`;
        (this.content.nextElementSibling as HTMLElement).style[`${sizeStr}`] = `${size}px`;
        if (sizeStr === 'width' && this.parent.allowScrolling) {
            (this.parent.getScrollElement().firstElementChild as HTMLElement).style.width = `${size}px`;
        }
    }

    private deInitProps(): void {
        this.parent.viewport.leftIndex = null; this.parent.viewport.topIndex = null; this.parent.viewport.bottomIndex = null;
        this.translateX = null; this.translateY = null;
    }

    private updateScrollProps(args: { sheetIndex: number, sheets: SheetModel[] } = { sheetIndex: 0, sheets: this.parent.sheets }): void {
        if (this.scroll.length === 0) {
            this.initScroll();
        } else {
            args.sheets.forEach((): void => { this.scroll.splice(args.sheetIndex, 0, { rowCount: 0, colCount: 0 }); });
        }
    }

    private sliceScrollProps(args: { sheetIndex?: number }): void {
        if (isNullOrUndefined(args.sheetIndex)) {
            this.scroll.length = 0;
        } else {
            this.scroll.splice(args.sheetIndex, 1);
        }
    }

    private updateTranslate(
        args: { height?: number, width?: number, isHide?: boolean, isRender?: boolean, prevSize?: number, size?: number }): void {
        if (args.height) {
            if (args.isRender) {
                this.translateY -= args.height;
            } else {
                const height: number = parseInt(
                    (this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement).style.height, 10);
                if (args.isHide) {
                    this.updateVTrack(this.rowHeader, height - args.height, 'height');
                    this.setThresholdHeight(
                        this.translateY, ((args.prevSize - 1) - this.parent.viewport.topIndex) + 1,
                        this.parent.frozenRowCount(this.parent.getActiveSheet()));
                } else {
                    this.updateVTrack(this.rowHeader, height + args.height, 'height');
                    this.translateY = this.translateY + args.size;
                }
            }
            this.translate({ refresh: 'Row' });
        }
        if (args.width) {
            this.translateX -= args.width;
            this.translate({ refresh: 'Column' });
        }
    }

    private addEventListener(): void {
        this.parent.on(beforeContentLoaded, this.createVirtualElement, this);
        this.parent.on(beforeVirtualContentLoaded, this.translate, this);
        this.parent.on(virtualContentLoaded, this.updateColumnWidth, this);
        this.parent.on(updateTableWidth, this.updateColumnWidth, this);
        this.parent.on(onVerticalScroll, this.onVerticalScroll, this);
        this.parent.on(onHorizontalScroll, this.onHorizontalScroll, this);
        this.parent.on(updateRowColCount, this.updateRowColCount, this);
        this.parent.on(rowHeightChanged, this.updateVTrackHeight, this);
        this.parent.on(colWidthChanged, this.updateVTrackWidth, this);
        this.parent.on(deInitProperties, this.deInitProps, this);
        this.parent.on(sheetsDestroyed, this.sliceScrollProps, this);
        this.parent.on(sheetCreated, this.updateScrollProps, this);
        this.parent.on(updateTranslate, this.updateTranslate, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }

    private destroy(): void {
        this.removeEventListener();
        const noteIndicatorElement: NodeListOf<Element> = document.querySelectorAll('.e-addNoteIndicator');
        if (noteIndicatorElement) {
            noteIndicatorElement.forEach((element: Element): void => {
                element.remove();
            });
        }
        if (this.rowHeader) { removeAllChildren(this.rowHeader); this.rowHeader.remove(); }
        if (this.colHeader) { removeAllChildren(this.colHeader); this.colHeader.remove(); }
        if (this.content) { removeAllChildren(this.content); this.content.remove(); }
        this.rowHeader = null; this.colHeader = null; this.content = null; this.parent = null;
        this.scroll.length = 0; this.translateX = null; this.translateY = null;
    }

    private removeEventListener(): void {
        this.parent.off(beforeContentLoaded, this.createVirtualElement);
        this.parent.off(beforeVirtualContentLoaded, this.translate);
        this.parent.off(virtualContentLoaded, this.updateColumnWidth);
        this.parent.off(updateTableWidth, this.updateColumnWidth);
        this.parent.off(onVerticalScroll, this.onVerticalScroll);
        this.parent.off(onHorizontalScroll, this.onHorizontalScroll);
        this.parent.off(updateRowColCount, this.updateRowColCount);
        this.parent.off(rowHeightChanged, this.updateVTrackHeight);
        this.parent.off(colWidthChanged, this.updateVTrackWidth);
        this.parent.off(sheetsDestroyed, this.sliceScrollProps);
        this.parent.off(sheetCreated, this.updateScrollProps);
        this.parent.off(updateTranslate, this.updateTranslate);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}
