import { Spreadsheet } from '../base/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { spreadsheetDestroyed, beforeContentLoaded, beforeVirtualContentLoaded, virtualContentLoaded, RefreshType } from '../common/index';
import { colWidthChanged } from '../common/index';
import { IScrollArgs, onVerticalScroll, onHorizontalScroll, rowHeightChanged, beforeHeaderLoaded, deInitProperties } from '../common/index';
import { SheetModel, getRowHeight, getRowsHeight, getColumnWidth, getColumnsWidth } from './../../workbook/index';
import { getCellAddress } from '../../workbook/common/index';
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

    public getModuleName(): string {
        return 'virtualscroll';
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
        if (sheet.rowCount > domCount || sheet.usedRange.rowIndex > domCount) {
            if (sheet.rowCount < sheet.usedRange.rowIndex) {
                sheet.rowCount = sheet.usedRange.rowIndex;
            }
            this.setScrollCount(sheet.rowCount, 'row');
            height = getRowsHeight(sheet, domCount, this.scroll[this.parent.activeSheetTab - 1].rowCount - 1);
        } else {
            this.scroll[this.parent.activeSheetTab - 1].rowCount = sheet.rowCount = domCount; height = 1;
        }
        domCount = this.parent.viewport.colCount + 1 + (this.parent.getThreshold('col') * 2);
        let size: number = getColumnsWidth(sheet, 0, domCount - 1);
        if (sheet.colCount > domCount) {
            if (sheet.colCount < sheet.usedRange.colIndex) {
                sheet.colCount = sheet.usedRange.colIndex;
            }
            this.setScrollCount(sheet.colCount, 'col');
            width = size + getColumnsWidth(sheet, domCount, this.scroll[this.parent.activeSheetTab - 1].colCount - 1);
        } else {
            sheet.colCount = domCount; width = size;
        }
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        if (args.startColIdx) { size = getColumnsWidth(sheet, args.startColIdx, args.startColIdx + domCount - 1); }
        if (isNullOrUndefined(this.translateX)) { this.parent.viewport.leftIndex = 0; this.translateX = 0; }
        if (isNullOrUndefined(this.translateY)) { this.parent.viewport.topIndex = 0; this.translateY = 0; }
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
        let activeSheetIdx: number = this.parent.activeSheetTab - 1;
        if (!this.scroll[activeSheetIdx][layout + 'Count']) { this.scroll[activeSheetIdx][layout + 'Count'] = count; }
    }

    private getAddress(topIdx: number[]): string {
        return `${getCellAddress(topIdx[0], this.parent.viewport.leftIndex)}:${getCellAddress(
            topIdx[1], this.parent.viewport.leftIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2))}`;
    }

    private getColAddress(leftIdx: number[]): string {
        return `${getCellAddress(this.parent.viewport.topIndex, leftIdx[0])}:${getCellAddress(
            this.parent.viewport.topIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2), leftIdx[1])}`;
    }

    private updateScrollCount(idx: number, layout: string, threshold: number = idx): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let rowCount: number = idx + this.parent.viewport[layout + 'Count'] + 1 + threshold;
        let usedRangeCount: number = this.scroll[this.parent.activeSheetTab - 1][layout + 'Count'];
        if (rowCount < usedRangeCount) {
            if (sheet[layout + 'Count'] === usedRangeCount) { return; }
            rowCount = usedRangeCount;
        }
        if (!this.parent.scrollSettings.isFinite) {
            sheet[layout + 'Count'] = rowCount; this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    }

    private onVerticalScroll(args: IScrollArgs): void {
        let idx: number = args.cur.idx; let height: number = args.cur.size;
        let prevIdx: number = args.prev.idx;
        let idxDiff: number = Math.abs(idx - prevIdx);
        let threshold: number = this.parent.getThreshold('row');
        if (idxDiff > Math.round(threshold / 2)) {
            if (idx <= threshold) {
                if (!args.increase) {
                    this.updateScrollCount(threshold, 'row');
                    if (this.translateY && prevIdx > threshold) {
                        this.translateY = 0;
                        this.parent.viewport.topIndex = prevIdx - threshold;
                        if (!args.preventScroll) {
                            if (idxDiff < this.parent.viewport.rowCount + threshold) {
                                this.parent.renderModule.refreshUI(
                                    { colIndex: this.parent.viewport.leftIndex, direction: 'last', refresh: 'RowPart' },
                                    this.getAddress([0, this.parent.viewport.topIndex - 1]));
                            } else {
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: 0, colIndex: this.parent.viewport.leftIndex, refresh: 'Row' });
                            }
                        }
                        this.parent.viewport.topIndex = 0;
                    }
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                this.updateScrollCount(args.cur.idx, 'row', threshold);
                this.parent.viewport.topIndex = idx - threshold;
                this.translateY = height - this.getThresholdHeight(this.parent.viewport.topIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.rowCount + threshold) {
                        if (args.increase) {
                            let lastIdx: number = this.parent.viewport.topIndex + this.parent.viewport.rowCount + (threshold * 2);
                            this.parent.renderModule.refreshUI(
                                { colIndex: this.parent.viewport.leftIndex, direction: 'first', refresh: 'RowPart' },
                                this.getAddress([lastIdx - idxDiff + 1, this.checkLastIdx(lastIdx, 'row')]));
                        } else {
                            this.parent.renderModule.refreshUI(
                                { colIndex: this.parent.viewport.leftIndex, direction: 'last', refresh: 'RowPart' },
                                this.getAddress([this.parent.viewport.topIndex, this.parent.viewport.topIndex + idxDiff - 1]));
                        }
                    } else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex,
                            colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                        });
                    }
                }
            }
            args.prev.idx = idx;
        }
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
            if (idx <= threshold) {
                if (!args.increase) {
                    this.updateScrollCount(threshold, 'col');
                    if (this.translateX && prevIdx > threshold) {
                        this.translateX = 0;
                        this.parent.viewport.leftIndex = prevIdx - threshold;
                        if (idxDiff < this.parent.viewport.rowCount + threshold) {
                            this.parent.renderModule.refreshUI(
                                { rowIndex: this.parent.viewport.topIndex, colIndex: 0, direction: 'last', refresh: 'ColumnPart' },
                                this.getColAddress([0, this.parent.viewport.leftIndex - 1]));
                        } else {
                            this.parent.renderModule.refreshUI(
                                { rowIndex: this.parent.viewport.topIndex, colIndex: 0, refresh: 'Column' });
                        }
                        this.parent.viewport.leftIndex = 0;
                    }
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                this.updateScrollCount(args.cur.idx, 'col', threshold);
                this.parent.viewport.leftIndex = idx - threshold;
                this.translateX = width - this.getThresholdWidth(this.parent.viewport.leftIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.colCount + threshold) {
                        if (args.increase) {
                            let lastIdx: number = this.parent.viewport.leftIndex + this.parent.viewport.colCount + (threshold * 2);
                            this.parent.renderModule.refreshUI(
                                {
                                    rowIndex: this.parent.viewport.topIndex, colIndex: lastIdx - idxDiff + 1,
                                    direction: 'first', refresh: 'ColumnPart'
                                },
                                this.getColAddress([lastIdx - idxDiff + 1, this.checkLastIdx(lastIdx, 'col')]));
                        } else {
                            this.parent.renderModule.refreshUI(
                                {
                                    rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex,
                                    direction: 'last', refresh: 'ColumnPart'
                                },
                                this.getColAddress([this.parent.viewport.leftIndex, this.parent.viewport.leftIndex + idxDiff - 1]));
                        }
                    } else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex,
                            colIndex: this.parent.viewport.leftIndex, refresh: 'Column'
                        });
                    }
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
            let width: number = this.content.querySelector('tr').getBoundingClientRect().width;
            if (this.parent.getActiveSheet().showHeaders) { this.colHeader.style.width = width + 'px'; }
            this.content.style.width = width + 'px';
        }
    }

    private updateUsedRange(args: { index: number, update: string }): void {
        if (!this.scroll.length) { return; }
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index > this.scroll[this.parent.activeSheetTab - 1].rowCount) {
                let height: number = this.getVTrackHeight('height');
                height += getRowsHeight(sheet, this.scroll[this.parent.activeSheetTab - 1].rowCount, args.index);
                this.scroll[this.parent.activeSheetTab - 1].rowCount = args.index + 1;
                this.updateVTrack(this.rowHeader, height, 'height');
                if (this.scroll[this.parent.activeSheetTab - 1].rowCount > sheet.rowCount) {
                    sheet.rowCount = this.scroll[this.parent.activeSheetTab - 1].rowCount;
                }
            }
        } else {
            if (args.index > this.scroll[this.parent.activeSheetTab - 1].colCount) {
                let width: number = this.getVTrackHeight('width');
                width += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetTab - 1].colCount, args.index);
                this.scroll[this.parent.activeSheetTab - 1].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, width, 'width');
                if (this.scroll[this.parent.activeSheetTab - 1].colCount > sheet.colCount) {
                    sheet.colCount = this.scroll[this.parent.activeSheetTab - 1].colCount;
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
        return parseInt((this.content.nextElementSibling as HTMLElement).style[str], 10);
    }

    private updateVTrackHeight(args: { rowIdx: number, threshold: number }): void {
        let domCount: number = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (args.rowIdx >= domCount && args.rowIdx < this.scroll[this.parent.activeSheetTab - 1].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
    }

    private updateVTrackWidth(args: { colIdx: number, threshold: number }): void {
        if (args.colIdx < this.parent.getActiveSheet().colCount) {
            let hdrVTrack: HTMLElement = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            hdrVTrack.style.width = parseInt(hdrVTrack.style.width, 10) + args.threshold + 'px';
            let cntVTrack: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0] as HTMLElement;
            cntVTrack.style.width = parseInt(cntVTrack.style.width, 10) + args.threshold + 'px';
            let hdrColumn: HTMLElement = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            hdrColumn.style.width = parseInt(hdrColumn.style.width, 10) + args.threshold + 'px';
            let cntColumn: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0] as HTMLElement;
            cntColumn.style.width = parseInt(cntColumn.style.width, 10) + args.threshold + 'px';
        }
    }

    private updateVTrack(header: HTMLElement, size: number, sizeStr: string): void {
        if (this.parent.getActiveSheet().showHeaders) { (header.nextElementSibling as HTMLElement).style[sizeStr] = `${size}px`; }
        (this.content.nextElementSibling as HTMLElement).style[sizeStr] = `${size}px`;
    }

    private deInitProps(): void {
        this.parent.viewport.leftIndex = null; this.parent.viewport.topIndex = null; this.translateX = null; this.translateY = null;
    }

    private updateScrollProps(args: { sheetIndex: number } = { sheetIndex: 0 }): void {
        if (this.scroll.length === 0) {
            this.initScroll();
        } else {
            this.scroll.splice(args.sheetIndex, 0, { rowCount: 0, colCount: 0 });
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

    public destroy(): void {
        this.removeEventListener();
        this.rowHeader = null; this.colHeader = null; this.content = null; this.parent = null;
        this.scroll.length = 0; this.translateX = null; this.translateY = null;
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
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
}