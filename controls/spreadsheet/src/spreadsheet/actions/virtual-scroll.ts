import { Spreadsheet } from '../base/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { spreadsheetDestroyed, beforeContentLoaded, beforeVirtualContentLoaded, virtualContentLoaded, RefreshType } from '../common/index';
import { colWidthChanged } from '../common/index';
import { IScrollArgs, onVerticalScroll, onHorizontalScroll, rowHeightChanged, beforeHeaderLoaded, deInitProperties } from '../common/index';
import { SheetModel, getRowHeight, getRowsHeight, getColumnWidth, getColumnsWidth } from './../../workbook/index';
import { getRangeAddress } from '../../workbook/common/index';
import { updateUsedRange, sheetCreated, sheetsDestroyed } from '../../workbook/common/event';

/**
 * VirtualScroll module
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

    private createVirtualElement(args: { startColIdx?: number }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let container: Element = this.parent.getMainContent();
        this.content = this.parent.createElement('div', { className: 'e-virtualable' });
        this.content.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.content);
        let vTrack: HTMLElement = container.appendChild(this.parent.createElement('div', { className: 'e-virtualtrack' }));
        let colVTrack: HTMLElement; let rowVTrack: HTMLElement; let height: number; let width: number;
        if (this.parent.sheets.length > this.scroll.length) { this.initScroll(); }
        let domCount: number = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (sheet.rowCount > domCount || sheet.usedRange.rowIndex > domCount - 1) {
            if (!this.parent.scrollSettings.isFinite && sheet.rowCount <= sheet.usedRange.rowIndex) {
                this.parent.setSheetPropertyOnMute(sheet, 'rowCount', sheet.usedRange.rowIndex + 1);
            }
            this.setScrollCount(sheet.rowCount, 'row');
            height = getRowsHeight(sheet, 0, this.scroll[this.parent.activeSheetIndex].rowCount - 1);
        } else {
            if (!this.parent.scrollSettings.isFinite) { this.parent.setSheetPropertyOnMute(sheet, 'rowCount', domCount); }
            this.scroll[this.parent.activeSheetIndex].rowCount = sheet.rowCount;
            height = 1;
        }
        domCount = this.parent.viewport.colCount + 1 + (this.parent.getThreshold('col') * 2);
        let size: number;
        if (sheet.colCount > domCount || sheet.usedRange.colIndex > domCount - 1) {
            if (!this.parent.scrollSettings.isFinite && sheet.colCount <= sheet.usedRange.colIndex) {
                this.parent.setSheetPropertyOnMute(sheet, 'colCount', sheet.usedRange.colIndex + 1);
            }
            size = getColumnsWidth(sheet, 0, domCount - 1);
            this.setScrollCount(sheet.colCount, 'col');
            width = size + getColumnsWidth(sheet, domCount, this.scroll[this.parent.activeSheetIndex].colCount - 1);
        } else {
            if (!this.parent.scrollSettings.isFinite) { this.parent.setSheetPropertyOnMute(sheet, 'colCount', domCount); }
            size = getColumnsWidth(sheet, 0, sheet.colCount - 1);
            this.scroll[this.parent.activeSheetIndex].colCount = sheet.colCount; width = size;
        }
        if (args.startColIdx) { size = getColumnsWidth(sheet, args.startColIdx, args.startColIdx + domCount - 1); }
        if (isNullOrUndefined(this.parent.viewport.leftIndex)) { this.parent.viewport.leftIndex = 0; }
        if (isNullOrUndefined(this.parent.viewport.topIndex)) { this.parent.viewport.topIndex = 0; }
        if (isNullOrUndefined(this.translateX)) { this.translateX = 0; } if (isNullOrUndefined(this.translateY)) { this.translateY = 0; }
        if (sheet.showHeaders) {
            container = this.parent.getRowHeaderContent();
            this.rowHeader = this.content.cloneNode() as HTMLElement;
            this.rowHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.rowHeader);
            rowVTrack = container.appendChild(vTrack.cloneNode() as HTMLElement);
            this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
            container = this.parent.getColumnHeaderContent();
            this.colHeader = this.content.cloneNode() as HTMLElement;
            this.colHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.colHeader);
            colVTrack = container.appendChild(vTrack.cloneNode() as HTMLElement);
            this.colHeader.style.width = `${size}px`;
            rowVTrack.style.height = `${height}px`;
            colVTrack.style.width = `${width}px`;
            this.colHeader.style.transform = `translate(${this.translateX}px, 0px)`;
        }
        this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
        this.content.style.width = `${size}px`;
        vTrack.style.height = `${height}px`;
        vTrack.style.width = `${width}px`;
    }

    private initScroll(): void {
        let i: number = 0;
        while (i < this.parent.sheets.length) {
            if (!this.scroll[i]) { this.scroll.push({ rowCount: 0, colCount: 0 }); } i++;
        }
    }

    private setScrollCount(count: number, layout: string): void {
        let activeSheetIdx: number = this.parent.activeSheetIndex;
        if (!this.scroll[activeSheetIdx][layout + 'Count']) { this.scroll[activeSheetIdx][layout + 'Count'] = count; }
    }

    private getRowAddress(indexes: number[]): string {
        return getRangeAddress([indexes[0], this.parent.viewport.leftIndex, indexes[1], this.parent.viewport.rightIndex]);
    }

    private getColAddress(indexes: number[]): string {
        return getRangeAddress([this.parent.viewport.topIndex, indexes[0], this.parent.viewport.bottomIndex, indexes[1]]);
    }

    private updateScrollCount(idx: number, layout: string, threshold: number = idx): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let rowCount: number = idx + this.parent.viewport[layout + 'Count'] + 1 + threshold;
        let usedRangeCount: number = this.scroll[this.parent.activeSheetIndex][layout + 'Count'];
        if (rowCount < usedRangeCount) {
            if (sheet[layout + 'Count'] === usedRangeCount) { return; }
            rowCount = usedRangeCount;
        }
        if (!this.parent.scrollSettings.isFinite) {
            this.parent.setSheetPropertyOnMute(sheet, layout + 'Count', rowCount);
        }
    }

    private onVerticalScroll(args: IScrollArgs): void {
        let idx: number = args.cur.idx; let height: number = args.cur.size;
        let prevIdx: number = args.prev.idx;
        let idxDiff: number = Math.abs(idx - prevIdx);
        let threshold: number = this.parent.getThreshold('row');
        if (idxDiff > Math.round(threshold / 2)) {
            let startIdx: number; let lastIdx: number; let prevTopIdx: number;
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateY && prevIdx > threshold) {
                        this.translateY = 0;
                        this.parent.viewport.topIndex = prevIdx - threshold;
                        if (!args.preventScroll) {
                            if (idxDiff < this.parent.viewport.rowCount + threshold) {
                                lastIdx = this.parent.viewport.topIndex - 1;
                                startIdx = this.parent.skipHidden(0, lastIdx)[0];
                                this.parent.viewport.topIndex = startIdx;
                                let hiddenCount: number = this.hiddenCount(startIdx, lastIdx);
                                let skippedHiddenIdx: number = this.skipHiddenIdx(
                                    (this.parent.viewport.bottomIndex - ((lastIdx - startIdx + 1) - hiddenCount)), args.increase);
                                this.parent.viewport.bottomIndex -= (((lastIdx - startIdx + 1) - hiddenCount) +
                                    (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.bottomIndex )));
                                this.parent.renderModule.refreshUI(
                                    {
                                        colIndex: this.parent.viewport.leftIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart',
                                        skipUpdateOnFirst: true },
                                    this.getRowAddress([0, this.skipHiddenIdx(lastIdx, false)]));
                            } else {
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: 0, colIndex: this.parent.viewport.leftIndex, refresh: 'Row', skipUpdateOnFirst: true });
                            }
                            this.parent.element.focus();
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
                this.translateY = height - this.getThresholdHeight(this.parent.viewport.topIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.rowCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.bottomIndex + 1;
                            lastIdx = this.parent.viewport.bottomIndex + (this.parent.viewport.topIndex - prevTopIdx);
                            lastIdx -= this.hiddenCount(prevTopIdx, this.parent.viewport.topIndex - 1);
                            this.parent.viewport.topIndex = this.skipHiddenIdx(this.parent.viewport.topIndex, args.increase);
                            if (lastIdx <= this.parent.viewport.bottomIndex) { return; }
                            let indexes: number[] = this.parent.skipHidden(startIdx, lastIdx);
                            startIdx = indexes[0]; lastIdx = this.checkLastIdx(indexes[1], 'row');
                            this.parent.viewport.bottomIndex = lastIdx;
                            this.parent.renderModule.refreshUI(
                                { colIndex: this.parent.viewport.leftIndex, rowIndex: startIdx, direction: 'first', refresh: 'RowPart' },
                                this.getRowAddress([startIdx, lastIdx]));
                        } else {
                            startIdx = this.parent.viewport.topIndex;
                            lastIdx = startIdx + idxDiff - 1;
                            let hiddenCount: number = this.hiddenCount(startIdx, lastIdx);
                            let skippedHiddenIdx: number = this.skipHiddenIdx(
                                (this.parent.viewport.bottomIndex - ((lastIdx - startIdx) - hiddenCount)), args.increase);
                            this.parent.viewport.bottomIndex -= ((idxDiff - hiddenCount) +
                                (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.bottomIndex )));
                            startIdx = this.parent.skipHidden(startIdx, lastIdx)[0];
                            this.parent.viewport.topIndex = startIdx;
                            this.parent.renderModule.refreshUI(
                                { colIndex: this.parent.viewport.leftIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart' },
                                this.getRowAddress([startIdx, lastIdx]));
                        }
                    } else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                        });
                    }
                    this.updateScrollCount(idx, 'row', threshold);
                    this.parent.element.focus();
                }
            }
            args.prev.idx = idx;
        }
    }

    private skipHiddenIdx(
        index: number, increase: boolean, layout: string = 'rows', sheet: SheetModel = this.parent.getActiveSheet()): number {
        if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
            increase ? index++ : index--;
            index = this.skipHiddenIdx(index, increase, layout, sheet);
        }
        return index;
    }

    private hiddenCount(startIdx: number, endIdx: number, layout: string = 'rows'): number {
        let index: number = 0; let sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = startIdx; i <= endIdx; i++) {
            if ((sheet[layout])[i] && (sheet[layout])[i].hidden) { index++; }
        }
        return index;
    }

    private checkLastIdx(idx: number, layout: string): number {
        if (this.parent.scrollSettings.isFinite) {
            let count: number = this.parent.getActiveSheet()[layout + 'Count'] - 1;
            if (idx > count) { idx = count; }
        }
        return idx;
    }

    private onHorizontalScroll(args: IScrollArgs): void {
        let idx: number = args.cur.idx; let width: number = args.cur.size;
        let prevIdx: number = args.prev.idx;
        let idxDiff: number = Math.abs(idx - prevIdx);
        let threshold: number = this.parent.getThreshold('col');
        if (idxDiff > Math.round(threshold / 2)) {
            let startIdx: number; let endIdx: number; let prevLeftIdx: number;
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateX && prevIdx > threshold) {
                        this.translateX = 0; this.parent.viewport.leftIndex = prevIdx - threshold;
                        if (!args.preventScroll) {
                            if (idxDiff < this.parent.viewport.colCount + threshold) {
                                endIdx = this.parent.viewport.leftIndex - 1;
                                startIdx = this.parent.skipHidden(0, endIdx, 'columns')[0];
                                this.parent.viewport.leftIndex = startIdx;
                                let hiddenCount: number = this.hiddenCount(startIdx, endIdx, 'columns');
                                let skippedHiddenIdx: number = this.skipHiddenIdx(
                                    (this.parent.viewport.rightIndex - ((endIdx - startIdx + 1) - hiddenCount)), args.increase, 'columns');
                                this.parent.viewport.rightIndex -= (((endIdx - startIdx + 1) - hiddenCount) +
                                    (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.rightIndex, 'columns')));
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: this.parent.viewport.topIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart',
                                        skipUpdateOnFirst: true },
                                    this.getColAddress([0, this.skipHiddenIdx(endIdx, false, 'columns')]));
                            } else {
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: this.parent.viewport.topIndex, colIndex: 0, refresh: 'Column', skipUpdateOnFirst: true });
                            }
                            this.parent.element.focus();
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
                this.translateX = width - this.getThresholdWidth(this.parent.viewport.leftIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.colCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.rightIndex + 1;
                            endIdx = this.parent.viewport.rightIndex + (this.parent.viewport.leftIndex - prevLeftIdx);
                            endIdx -= this.hiddenCount(prevLeftIdx, this.parent.viewport.leftIndex - 1, 'columns');
                            this.parent.viewport.leftIndex = this.skipHiddenIdx(this.parent.viewport.leftIndex, args.increase, 'columns');
                            if (endIdx <= this.parent.viewport.rightIndex) { return; }
                            let indexes: number[] = this.parent.skipHidden(startIdx, endIdx, 'columns');
                            startIdx = indexes[0]; endIdx = this.checkLastIdx(indexes[1], 'col');
                            this.parent.viewport.rightIndex = endIdx;
                            this.parent.renderModule.refreshUI(
                                { rowIndex: this.parent.viewport.topIndex, colIndex: startIdx, direction: 'first', refresh: 'ColumnPart' },
                                this.getColAddress([startIdx, endIdx]));
                        } else {
                            startIdx = this.parent.viewport.leftIndex;
                            endIdx = startIdx + idxDiff - 1;
                            let hiddenCount: number = this.hiddenCount(startIdx, endIdx, 'columns');
                            let skippedHiddenIdx: number = this.skipHiddenIdx(
                                (this.parent.viewport.rightIndex - ((endIdx - startIdx) - hiddenCount)), args.increase, 'columns');
                            this.parent.viewport.rightIndex -= ((idxDiff - hiddenCount) +
                                (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.rightIndex, 'columns')));
                            startIdx = this.parent.skipHidden(startIdx, endIdx, 'columns')[0];
                            this.parent.viewport.leftIndex = startIdx;
                            this.parent.renderModule.refreshUI(
                                { rowIndex: this.parent.viewport.topIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart' },
                                this.getColAddress([startIdx, endIdx]));
                        }
                    } else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Column'
                        });
                    }
                    this.updateScrollCount(idx, 'col', threshold);
                    this.parent.element.focus();
                }
            }
            args.prev.idx = idx;
        }
    }

    private getThresholdHeight(idx: number, threshold: number): number {
        let height: number = 0; let sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = idx; i < idx + threshold; i++) {
            height += getRowHeight(sheet, i);
        }
        return height;
    }

    private getThresholdWidth(idx: number, threshold: number): number {
        let width: number = 0; let sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = idx; i < idx + threshold; i++) {
            width += getColumnWidth(sheet, i);
        }
        return width;
    }

    private translate(args: { refresh: RefreshType }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (args.refresh === 'Row' || args.refresh === 'RowPart') {
            this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
            if (sheet.showHeaders) { this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`; }
        }
        if (args.refresh === 'Column' || args.refresh === 'ColumnPart') {
            let translateX: number = this.parent.enableRtl ? -this.translateX : this.translateX;
            this.content.style.transform = `translate(${translateX}px, ${this.translateY}px)`;
            if (sheet.showHeaders) { this.colHeader.style.transform = `translate(${translateX}px, 0px)`; }
        }
    }

    private updateColumnWidth(args: { refresh: RefreshType }): void {
        if (args.refresh === 'Column') {
            this.content.style.width = '';
            let width: number = getColumnsWidth(
                this.parent.getActiveSheet(), this.parent.viewport.leftIndex, this.parent.viewport.rightIndex);
            if (this.parent.getActiveSheet().showHeaders) { this.colHeader.style.width = width + 'px'; }
            this.content.style.width = width + 'px';
        }
    }

    private updateUsedRange(args: { index: number, update: string }): void {
        if (!this.scroll.length) { return; }
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index !== this.scroll[this.parent.activeSheetIndex].rowCount - 1) {
                let height: number = this.getVTrackHeight('height');
                if (args.index >= this.scroll[this.parent.activeSheetIndex].rowCount) {
                    height += getRowsHeight(sheet, this.scroll[this.parent.activeSheetIndex].rowCount, args.index);
                } else {
                    height -= getRowsHeight(sheet, args.index + 1, this.scroll[this.parent.activeSheetIndex].rowCount - 1);
                }
                this.scroll[this.parent.activeSheetIndex].rowCount = args.index + 1;
                this.updateVTrack(this.rowHeader, height, 'height');
                if (this.scroll[this.parent.activeSheetIndex].rowCount > sheet.rowCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'rowCount', this.scroll[this.parent.activeSheetIndex].rowCount);
                }
            }
        } else {
            if (args.index > this.scroll[this.parent.activeSheetIndex].colCount) {
                let width: number = this.getVTrackHeight('width');
                width += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetIndex].colCount, args.index);
                this.scroll[this.parent.activeSheetIndex].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, width, 'width');
                if (this.scroll[this.parent.activeSheetIndex].colCount > sheet.colCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'colCount', this.scroll[this.parent.activeSheetIndex].colCount);
                }
            }
        }
    }

    private createHeaderElement(args: { element: Element }): void {
        this.rowHeader = this.content.cloneNode() as HTMLElement; this.colHeader = this.rowHeader.cloneNode() as HTMLElement;
        this.rowHeader.style.width = '';
        this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
        this.colHeader.style.transform = `translate(${this.parent.enableRtl ? -this.translateX : this.translateX}px, 0px)`;
        this.rowHeader.appendChild(args.element.querySelector('table'));
        args.element.appendChild(this.rowHeader);
        let container: Element = this.parent.getColumnHeaderContent();
        this.colHeader.appendChild(container.querySelector('table'));
        container.appendChild(this.colHeader);
        let rowVTrack: HTMLElement = this.content.nextElementSibling.cloneNode() as HTMLElement;
        let colVTrack: HTMLElement = rowVTrack.cloneNode() as HTMLElement;
        rowVTrack.style.width = ''; colVTrack.style.height = '';
        args.element.appendChild(rowVTrack); container.appendChild(colVTrack);
    }

    private getVTrackHeight(str: string): number {
        let height: string = (this.content.nextElementSibling as HTMLElement).style[str];
        if (height.includes('e+')) {
            height = height.split('px')[0];
            let heightArr: string[] = height.split('e+');
            return Number(heightArr[0]) * Math.pow(10, Number(heightArr[1]));
        } else {
            return parseInt(height, 10);
        }
    }

    private updateVTrackHeight(args: { rowIdx: number, threshold: number }): void {
        let domCount: number = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (args.rowIdx >= domCount && args.rowIdx < this.scroll[this.parent.activeSheetIndex].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
    }

    private updateVTrackWidth(args: { colIdx: number, threshold: number }): void {
        if (args.colIdx >= this.parent.viewport.leftIndex && args.colIdx <= this.parent.viewport.rightIndex) {
            if (this.parent.getActiveSheet().showHeaders) {
                let hdrVTrack: HTMLElement =
                    this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
                hdrVTrack.style.width = parseInt(hdrVTrack.style.width, 10) + args.threshold + 'px';
            }
            let cntVTrack: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            cntVTrack.style.width = parseInt(cntVTrack.style.width, 10) + args.threshold + 'px';
            if (this.parent.getActiveSheet().showHeaders) {
                let hdrColumn: HTMLElement =
                    this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
                hdrColumn.style.width = parseInt(hdrColumn.style.width, 10) + args.threshold + 'px';
            }
            let cntColumn: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            cntColumn.style.width = parseInt(cntColumn.style.width, 10) + args.threshold + 'px';
        }
    }

    private updateVTrack(header: HTMLElement, size: number, sizeStr: string): void {
        if (this.parent.getActiveSheet().showHeaders) { (header.nextElementSibling as HTMLElement).style[sizeStr] = `${size}px`; }
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
        this.parent.on(onVerticalScroll, this.onVerticalScroll, this);
        this.parent.on(onHorizontalScroll, this.onHorizontalScroll, this);
        this.parent.on(updateUsedRange, this.updateUsedRange, this);
        this.parent.on(rowHeightChanged, this.updateVTrackHeight, this);
        this.parent.on(colWidthChanged, this.updateVTrackWidth, this);
        this.parent.on(beforeHeaderLoaded, this.createHeaderElement, this);
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
        this.parent.off(onVerticalScroll, this.onVerticalScroll);
        this.parent.off(onHorizontalScroll, this.onHorizontalScroll);
        this.parent.off(updateUsedRange, this.updateUsedRange);
        this.parent.off(rowHeightChanged, this.updateVTrackHeight);
        this.parent.off(colWidthChanged, this.updateVTrackWidth);
        this.parent.off(beforeHeaderLoaded, this.createHeaderElement);
        this.parent.off(sheetsDestroyed, this.sliceScrollProps);
        this.parent.off(sheetCreated, this.updateScrollProps);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}