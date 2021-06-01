import { Spreadsheet } from '../base/index';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { spreadsheetDestroyed, beforeContentLoaded, beforeVirtualContentLoaded, virtualContentLoaded, RefreshType } from '../common/index';
import { colWidthChanged, updateTableWidth, focus } from '../common/index';
import { IScrollArgs, onVerticalScroll, onHorizontalScroll, rowHeightChanged, deInitProperties } from '../common/index';
import { SheetModel, getRowHeight, getRowsHeight, getColumnWidth, getColumnsWidth } from './../../workbook/index';
import { getCellIndexes, getRangeAddress } from '../../workbook/common/index';
import { updateUsedRange, sheetCreated, sheetsDestroyed } from '../../workbook/common/event';

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
            if (sheet.frozenRows) { height += getRowsHeight(sheet, indexes[0], startIndex - 1, true); }
            startIndex = getCellIndexes(sheet.paneTopLeftCell)[0];
        }
        height += getRowsHeight(sheet, startIndex, this.scroll[this.parent.activeSheetIndex].rowCount - 1, true);
        endIndex = this.parent.viewport.rightIndex;
        let size: number = 0;
        const frozenCol: number = this.parent.frozenColCount(sheet);
        if (args.left) {
            size = args.left;
            if (frozenCol) { size += getColumnsWidth(sheet, indexes[1], frozenCol - 1, true); }
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
        if (this.parent.allowScrolling) { this.parent.getScrollElement().appendChild(colVTrack.cloneNode(true)); }
    }

    private initScroll(): void {
        let i: number = 0;
        while (i < this.parent.sheets.length) {
            if (!this.scroll[i]) { this.scroll.push({ rowCount: 0, colCount: 0 }); } i++;
        }
    }

    private setScrollCount(count: number, layout: string): void {
        const activeSheetIdx: number = this.parent.activeSheetIndex;
        if (!this.scroll[activeSheetIdx][layout + 'Count']) { this.scroll[activeSheetIdx][layout + 'Count'] = count; }
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
        const idx: number = args.cur.idx; const height: number = args.cur.size;
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
                        this.parent.viewport.topIndex = prevIdx - (threshold - frozenRow);
                        if (!args.preventScroll) {
                            const colIndex: number = frozenCol ? getCellIndexes(sheet.topLeftCell)[1] : this.parent.viewport.leftIndex;
                            const fIndexes: number[] = frozenCol ? [frozenRow, this.parent.viewport.leftIndex + frozenCol] : [];
                            if (idxDiff < this.parent.viewport.rowCount + threshold) {
                                lastIdx = this.parent.viewport.topIndex - 1;
                                startIdx = this.parent.skipHidden(frozenRow, lastIdx)[0];
                                this.parent.viewport.topIndex = this.skipHiddenIdx(startIdx - frozenRow, true);
                                const hiddenCount: number = this.hiddenCount(startIdx, lastIdx);
                                const skippedHiddenIdx: number = this.skipHiddenIdx(
                                    (this.parent.viewport.bottomIndex - ((lastIdx - startIdx + 1) - hiddenCount)), args.increase);
                                this.parent.viewport.bottomIndex -= (((lastIdx - startIdx + 1) - hiddenCount) +
                                    (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.bottomIndex )));
                                this.parent.renderModule.refreshUI(
                                    {
                                        colIndex: colIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart',
                                        skipUpdateOnFirst: true, frozenIndexes: fIndexes
                                    },
                                    this.getRowAddress([startIdx, this.skipHiddenIdx(lastIdx, false)]));
                            } else {
                                const prevColIndex: number = this.parent.viewport.leftIndex;
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: 0, colIndex: colIndex, refresh: 'Row', skipUpdateOnFirst: true,
                                        frozenIndexes: fIndexes });
                                if (frozenCol) { this.parent.viewport.leftIndex = prevColIndex; }
                            }
                            focus(this.parent.element);
                        }
                    }
                    this.updateScrollCount(threshold, 'row');
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                prevTopIdx = this.parent.viewport.topIndex;
                this.parent.viewport.topIndex = idx - threshold;
                if (args.increase && prevTopIdx > this.parent.viewport.topIndex) { this.parent.viewport.topIndex = prevTopIdx; return; }
                const frozenRow: number = this.parent.frozenRowCount(sheet);
                this.translateY = height - this.getThresholdHeight(this.parent.viewport.topIndex + frozenRow, threshold);
                if (!args.preventScroll) {
                    const frozenCol: number = this.parent.frozenColCount(sheet);
                    const colIndex: number = frozenCol ? getCellIndexes(sheet.topLeftCell)[1] : this.parent.viewport.leftIndex;
                    let frozenIndexes: number[] = [];
                    if (sheet.frozenColumns) { frozenIndexes = [frozenRow, this.parent.viewport.leftIndex + frozenCol]; }
                    if (idxDiff < this.parent.viewport.rowCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.bottomIndex + 1;
                            lastIdx = this.parent.viewport.bottomIndex + (this.parent.viewport.topIndex - prevTopIdx);
                            lastIdx -= this.hiddenCount(prevTopIdx, this.parent.viewport.topIndex - 1);
                            this.parent.viewport.topIndex = this.skipHiddenIdx(this.parent.viewport.topIndex, args.increase);
                            if (lastIdx <= this.parent.viewport.bottomIndex) { return; }
                            const indexes: number[] = this.parent.skipHidden(startIdx, lastIdx);
                            startIdx = indexes[0]; lastIdx = this.checkLastIdx(indexes[1], 'row');
                            this.parent.viewport.bottomIndex = lastIdx;
                            this.parent.renderModule.refreshUI(
                                { colIndex: colIndex, rowIndex: startIdx, direction: 'first', refresh: 'RowPart',
                                    frozenIndexes: frozenIndexes },
                                this.getRowAddress([startIdx, lastIdx]));
                        } else {
                            startIdx = this.parent.viewport.topIndex + frozenRow;
                            lastIdx = startIdx + idxDiff - 1;
                            const hiddenCount: number = this.hiddenCount(startIdx, lastIdx);
                            const skippedHiddenIdx: number = this.skipHiddenIdx(
                                (this.parent.viewport.bottomIndex - ((lastIdx - startIdx) - hiddenCount)), args.increase);
                            this.parent.viewport.bottomIndex -= ((idxDiff - hiddenCount) +
                                (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.bottomIndex )));
                            startIdx = this.parent.skipHidden(startIdx, lastIdx)[0];
                            this.parent.viewport.topIndex = this.skipHiddenIdx(startIdx - frozenRow, true);
                            this.parent.renderModule.refreshUI(
                                { colIndex: colIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart',
                                    frozenIndexes: frozenIndexes },
                                this.getRowAddress([startIdx, lastIdx]));
                        }
                    } else {
                        prevTopIdx = this.parent.viewport.leftIndex;
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex, colIndex: colIndex, refresh: 'Row',
                            frozenIndexes: frozenIndexes
                        });
                        if (frozenCol) { this.parent.viewport.leftIndex = prevTopIdx; }
                    }
                    this.updateScrollCount(idx, 'row', threshold);
                    this.focusSheet();
                }
            }
            args.prev.idx = idx;
        }
    }

    private skipHiddenIdx(
        index: number, increase: boolean, layout: string = 'rows', sheet: SheetModel = this.parent.getActiveSheet()): number {
        if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
            index = increase ? ++index : --index;
            index = this.skipHiddenIdx(index, increase, layout, sheet);
        }
        return index;
    }

    private hiddenCount(startIdx: number, endIdx: number, layout: string = 'rows'): number {
        let index: number = 0; const sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = startIdx; i <= endIdx; i++) {
            if ((sheet[layout])[i] && (sheet[layout])[i].hidden) { index++; }
        }
        return index;
    }

    private checkLastIdx(idx: number, layout: string): number {
        if (this.parent.scrollSettings.isFinite) {
            const count: number = this.parent.getActiveSheet()[layout + 'Count'] - 1;
            if (idx > count) { idx = count; }
        }
        return idx;
    }

    private onHorizontalScroll(args: IScrollArgs): void {
        const idx: number = args.cur.idx; const width: number = args.cur.size;
        const prevIdx: number = args.prev.idx;
        let idxDiff: number = Math.abs(idx - prevIdx);
        const threshold: number = this.parent.getThreshold('col');
        if (idxDiff > Math.round(threshold / 2)) {
            let startIdx: number; let endIdx: number; let prevLeftIdx: number;
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateX && prevIdx > threshold) {
                        const frozenCol: number = this.parent.frozenColCount(sheet);
                        const frozenRow: number = this.parent.frozenRowCount(sheet);
                        this.translateX = 0; this.parent.viewport.leftIndex = prevIdx - (threshold - frozenCol);
                        if (!args.preventScroll) {
                            const rowIndex: number = frozenRow ? getCellIndexes(sheet.topLeftCell)[0] : this.parent.viewport.topIndex;
                            const fIndexes: number[] = frozenRow ? [this.parent.viewport.topIndex + frozenRow, frozenCol] : [];
                            if (idxDiff < this.parent.viewport.colCount + threshold) {
                                endIdx = this.parent.viewport.leftIndex - 1;
                                startIdx = this.parent.skipHidden(frozenCol, endIdx, 'columns')[0];
                                this.parent.viewport.leftIndex = this.skipHiddenIdx(startIdx - frozenCol, true);
                                const hiddenCount: number = this.hiddenCount(startIdx, endIdx, 'columns');
                                const skippedHiddenIdx: number = this.skipHiddenIdx(
                                    (this.parent.viewport.rightIndex - ((endIdx - startIdx + 1) - hiddenCount)), args.increase, 'columns');
                                this.parent.viewport.rightIndex -= (((endIdx - startIdx + 1) - hiddenCount) +
                                    (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.rightIndex, 'columns')));
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: rowIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart',
                                        skipUpdateOnFirst: true, frozenIndexes: fIndexes },
                                    this.getColAddress([startIdx, this.skipHiddenIdx(endIdx, false, 'columns')]));
                            } else {
                                const prevRowIndex: number = this.parent.viewport.topIndex;
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: rowIndex, colIndex: 0, refresh: 'Column', skipUpdateOnFirst: true,
                                        frozenIndexes: fIndexes });
                                if (frozenRow) { this.parent.viewport.topIndex = prevRowIndex; }
                            }
                            focus(this.parent.element);
                        }
                    }
                    this.updateScrollCount(threshold, 'col');
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                prevLeftIdx = this.parent.viewport.leftIndex;
                this.parent.viewport.leftIndex = idx - threshold;
                if (args.increase && prevLeftIdx > this.parent.viewport.leftIndex) { this.parent.viewport.leftIndex = prevLeftIdx; return; }
                const frozenCol: number = this.parent.frozenColCount(sheet);
                this.translateX = width - this.getThresholdWidth(this.parent.viewport.leftIndex + frozenCol, threshold);
                if (!args.preventScroll) {
                    const frozenRow: number = this.parent.frozenRowCount(sheet);
                    const rowIndex: number = frozenRow ? getCellIndexes(sheet.topLeftCell)[0] : this.parent.viewport.topIndex;
                    let frozenIndexes: number[] = [];
                    if (frozenRow) { frozenIndexes = [frozenRow + this.parent.viewport.topIndex, frozenCol]; }
                    if (idxDiff < this.parent.viewport.colCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.rightIndex + 1;
                            endIdx = this.parent.viewport.rightIndex + (this.parent.viewport.leftIndex - prevLeftIdx);
                            endIdx -= this.hiddenCount(prevLeftIdx, this.parent.viewport.leftIndex - 1, 'columns');
                            this.parent.viewport.leftIndex = this.skipHiddenIdx(this.parent.viewport.leftIndex, args.increase, 'columns');
                            if (endIdx <= this.parent.viewport.rightIndex) { return; }
                            const indexes: number[] = this.parent.skipHidden(startIdx, endIdx, 'columns');
                            startIdx = indexes[0]; endIdx = this.checkLastIdx(indexes[1], 'col');
                            this.parent.viewport.rightIndex = endIdx;
                            this.parent.renderModule.refreshUI(
                                { rowIndex: rowIndex, colIndex: startIdx, direction: 'first', refresh: 'ColumnPart',
                                    frozenIndexes: frozenIndexes },
                                this.getColAddress([startIdx, endIdx]));
                        } else {
                            startIdx = this.parent.viewport.leftIndex + frozenCol;
                            endIdx = startIdx + idxDiff - 1;
                            const hiddenCount: number = this.hiddenCount(startIdx, endIdx, 'columns');
                            const skippedHiddenIdx: number = this.skipHiddenIdx(
                                (this.parent.viewport.rightIndex - ((endIdx - startIdx) - hiddenCount)), args.increase, 'columns');
                            this.parent.viewport.rightIndex -= ((idxDiff - hiddenCount) +
                                (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.rightIndex, 'columns')));
                            startIdx = this.parent.skipHidden(startIdx, endIdx, 'columns')[0];
                            this.parent.viewport.leftIndex = this.skipHiddenIdx(startIdx - frozenCol, true, 'columns', sheet);
                            this.parent.renderModule.refreshUI(
                                { rowIndex: rowIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart',
                                    frozenIndexes: frozenIndexes },
                                this.getColAddress([startIdx, endIdx]));
                        }
                    } else {
                        prevLeftIdx = this.parent.viewport.topIndex;
                        this.parent.renderModule.refreshUI({
                            rowIndex: rowIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Column', frozenIndexes: frozenIndexes
                        });
                        if (frozenRow) { this.parent.viewport.topIndex = prevLeftIdx; }
                    }
                    this.updateScrollCount(idx, 'col', threshold);
                    this.focusSheet();
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

    private getThresholdHeight(idx: number, threshold: number): number {
        let height: number = 0; const sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = idx; i < idx + threshold; i++) {
            height += getRowHeight(sheet, i, true);
        }
        return height;
    }

    private getThresholdWidth(idx: number, threshold: number): number {
        let width: number = 0; const sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = idx; i < idx + threshold; i++) {
            width += getColumnWidth(sheet, i, null, true);
        }
        return width;
    }

    private translate(args: { refresh: RefreshType }): void {
        const translateX: number = this.parent.enableRtl ? -this.translateX : this.translateX;
        if (args.refresh === 'Row' || args.refresh === 'RowPart') {
            this.content.style.transform = `translate(${translateX}px, ${this.translateY}px)`;
            this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
        }
        if (args.refresh === 'Column' || args.refresh === 'ColumnPart') {
            this.content.style.transform = `translate(${translateX}px, ${this.translateY}px)`;
            this.colHeader.style.transform = `translate(${translateX}px, 0px)`;
        }
    }

    private updateColumnWidth(args: { refresh: RefreshType }): void {
        if (args.refresh === 'Column') {
            this.content.style.width = '';
            const sheet: SheetModel = this.parent.getActiveSheet();
            const width: number = getColumnsWidth(
                sheet, this.parent.viewport.leftIndex + this.parent.frozenColCount(sheet), this.parent.viewport.rightIndex, true);
            this.colHeader.style.width = width + 'px';
            this.content.style.width = width + 'px';
            if (this.parent.allowScrolling) {
                const scroll: HTMLElement = this.parent.element.querySelector('.e-scroller .e-virtualtrack') as HTMLElement;
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
        } else {
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

    private updateUsedRange(args: { index: number, update: string }): void {
        if (!this.scroll.length) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index !== this.scroll[this.parent.activeSheetIndex].rowCount - 1) {
                const height: number = this.getVTrackHeight('height'); let newHeight: number = height;
                if (args.index >= this.scroll[this.parent.activeSheetIndex].rowCount) {
                    newHeight += getRowsHeight(sheet, this.scroll[this.parent.activeSheetIndex].rowCount, args.index, true);
                } else {
                    newHeight -= getRowsHeight(sheet, args.index + 1, this.scroll[this.parent.activeSheetIndex].rowCount - 1, true);
                }
                if (newHeight < height) { return; }
                this.scroll[this.parent.activeSheetIndex].rowCount = args.index + 1;
                this.updateVTrack(this.rowHeader, height, 'height');
                if (this.scroll[this.parent.activeSheetIndex].rowCount > sheet.rowCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'rowCount', this.scroll[this.parent.activeSheetIndex].rowCount);
                }
            }
        } else {
            if (args.index > this.scroll[this.parent.activeSheetIndex].colCount) {
                let width: number = this.getVTrackHeight('width');
                width += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetIndex].colCount, args.index, true);
                this.scroll[this.parent.activeSheetIndex].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, width, 'width');
                if (this.scroll[this.parent.activeSheetIndex].colCount > sheet.colCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'colCount', this.scroll[this.parent.activeSheetIndex].colCount);
                }
            }
        }
    }

    private getVTrackHeight(str: string): number {
        let height: string = (this.content.nextElementSibling as HTMLElement).style[str];
        if (height.includes('e+')) {
            height = height.split('px')[0];
            const heightArr: string[] = height.split('e+');
            return Number(heightArr[0]) * Math.pow(10, Number(heightArr[1]));
        } else {
            return parseFloat(height);
        }
    }

    private updateVTrackHeight(args: { rowIdx: number, threshold: number }): void {
        const domCount: number = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (args.rowIdx >= domCount && args.rowIdx < this.scroll[this.parent.activeSheetIndex].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
    }

    private updateVTrackWidth(args: { colIdx: number, threshold: number }): void {
        if (args.colIdx >= this.parent.viewport.leftIndex && args.colIdx <= this.parent.viewport.rightIndex) {
            const hdrVTrack: HTMLElement =
                    this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            hdrVTrack.style.width = parseFloat(hdrVTrack.style.width) + args.threshold + 'px';
            const cntVTrack: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            cntVTrack.style.width = parseFloat(cntVTrack.style.width) + args.threshold + 'px';
            const hdrColumn: HTMLElement =
                    this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            hdrColumn.style.width = parseFloat(hdrColumn.style.width) + args.threshold + 'px';
            const cntColumn: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            cntColumn.style.width = parseFloat(cntColumn.style.width) + args.threshold + 'px';
        }
    }

    private updateVTrack(header: HTMLElement, size: number, sizeStr: string): void {
        (header.nextElementSibling as HTMLElement).style[sizeStr] = `${size}px`;
        (this.content.nextElementSibling as HTMLElement).style[sizeStr] = `${size}px`;
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

    private addEventListener(): void {
        this.parent.on(beforeContentLoaded, this.createVirtualElement, this);
        this.parent.on(beforeVirtualContentLoaded, this.translate, this);
        this.parent.on(virtualContentLoaded, this.updateColumnWidth, this);
        this.parent.on(updateTableWidth, this.updateColumnWidth, this);
        this.parent.on(onVerticalScroll, this.onVerticalScroll, this);
        this.parent.on(onHorizontalScroll, this.onHorizontalScroll, this);
        this.parent.on(updateUsedRange, this.updateUsedRange, this);
        this.parent.on(rowHeightChanged, this.updateVTrackHeight, this);
        this.parent.on(colWidthChanged, this.updateVTrackWidth, this);
        this.parent.on(deInitProperties, this.deInitProps, this);
        this.parent.on(sheetsDestroyed, this.sliceScrollProps, this);
        this.parent.on(sheetCreated, this.updateScrollProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }

    private destroy(): void {
        this.removeEventListener();
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
        this.parent.off(updateUsedRange, this.updateUsedRange);
        this.parent.off(rowHeightChanged, this.updateVTrackHeight);
        this.parent.off(colWidthChanged, this.updateVTrackWidth);
        this.parent.off(sheetsDestroyed, this.sliceScrollProps);
        this.parent.off(sheetCreated, this.updateScrollProps);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}
