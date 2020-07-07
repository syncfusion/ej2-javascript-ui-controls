import { Spreadsheet, ICellRenderer, clearViewer, beginAction } from '../../spreadsheet/index';
import { rowHeightChanged, setRowEleHeight, setMaxHgt, getTextHeight, getMaxHgt, getLines, initialLoad } from '../common/index';
import { CellFormatArgs, getRowHeight, applyCellFormat, CellStyleModel, CellStyleExtendedModel, CellModel} from '../../workbook/index';
import { SheetModel, isHiddenRow, getCell, getColumnWidth, getRangeIndexes, getSheetIndex } from '../../workbook/index';
import {  wrapEvent, getRangeAddress, ClearOptions,  clear } from '../../workbook/index';
import { removeClass } from '@syncfusion/ej2-base';
/**
 * CellFormat module allows to format the cell styles.
 */
export class CellFormat {
    private parent: Spreadsheet;
    private checkHeight: boolean = false;
    private row: HTMLElement;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.row = parent.createElement('tr', { className: 'e-row' });
        this.parent.on(initialLoad, this.addEventListener, this);
    }
    private applyCellFormat(args: CellFormatArgs): void {
        let keys: string[] = Object.keys(args.style);
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (args.lastCell && getMaxHgt(sheet, args.rowIdx) <= 20 && !keys.length) { return; }
        let cell: HTMLElement = args.cell || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cell) {
            if (args.style.border !== undefined || args.style.borderTop !== undefined || args.style.borderLeft !== undefined) {
                let curStyle: CellStyleModel = {};
                Object.keys(args.style).forEach((key: string): void => { curStyle[key] = args.style[key]; });
                if (curStyle.border !== undefined) {
                    Object.assign(cell.style, <CellStyleModel>{ borderRight: args.style.border, borderBottom: args.style.border });
                    this.setLeftBorder(args.style.border, cell, args.rowIdx, args.colIdx, args.row, args.onActionUpdate, args.first);
                    this.setTopBorder(
                        args.style.border, cell, args.rowIdx, args.colIdx, args.pRow, args.pHRow, args.onActionUpdate, args.first,
                        args.lastCell, args.manualUpdate);
                    delete curStyle.border;
                }
                if (curStyle.borderTop !== undefined) {
                    this.setTopBorder(
                        args.style.borderTop, cell, args.rowIdx, args.colIdx, args.pRow, args.pHRow, args.onActionUpdate, args.first,
                        args.lastCell, args.manualUpdate);
                    delete curStyle.borderTop;
                }
                if (curStyle.borderLeft !== undefined) {
                    this.setLeftBorder(args.style.borderLeft, cell, args.rowIdx, args.colIdx, args.row, args.onActionUpdate, args.first);
                    delete curStyle.borderLeft;
                }
                if (Object.keys(curStyle).length) {
                    if (curStyle.borderBottom !== undefined) {
                        this.setThickBorderHeight(
                            curStyle.borderBottom, args.rowIdx, args.colIdx, cell, args.row, args.hRow, args.onActionUpdate, args.lastCell,
                            args.manualUpdate);
                    }
                    Object.assign(cell.style, curStyle);
                }
            } else {
                if (args.style.borderBottom !== undefined) {
                    this.setThickBorderHeight(
                        args.style.borderBottom, args.rowIdx, args.colIdx, cell, args.row, args.hRow, args.onActionUpdate, args.lastCell,
                        args.manualUpdate);
                }
                Object.assign(cell.style, args.style);
            }
            if (args.isHeightCheckNeeded) {
                if (!sheet.rows[args.rowIdx] || !sheet.rows[args.rowIdx].customHeight) {
                    if (!args.manualUpdate) {
                        let cellModel: CellModel = getCell(args.rowIdx, args.colIdx, sheet);
                        if (!(cellModel && cellModel.wrap) && this.isHeightCheckNeeded(args.style)) {
                            setMaxHgt(sheet, args.rowIdx, args.colIdx, getTextHeight(this.parent, args.style));
                        }
                        if (args.lastCell) {
                            let height: number = getMaxHgt(sheet, args.rowIdx);
                            if (height > 20 && height > getRowHeight(sheet, args.rowIdx)) {
                                setRowEleHeight(this.parent, sheet, height, args.rowIdx, args.row, args.hRow, false);
                            }
                        }
                    } else {
                        if (!this.checkHeight) { this.checkHeight = this.isHeightCheckNeeded(args.style, args.onActionUpdate); }
                        this.updateRowHeight(args.rowIdx, args.colIdx, args.lastCell, args.onActionUpdate);
                    }
                }
            }
        } else {
            this.updateRowHeight(args.rowIdx, args.colIdx, true, args.onActionUpdate);
        }
    }
    private updateRowHeight(rowIdx: number, colIdx: number, isLastCell: boolean, onActionUpdate: boolean, borderSize: number = 0): void {
        if (this.checkHeight) {
            this.checkHeight = false;
            let hgt: number = 0;
            let maxHgt: number;
            let sheet: SheetModel = this.parent.getActiveSheet();
            let cell: CellModel = getCell(rowIdx, colIdx, sheet);
            hgt = getTextHeight(this.parent, (cell && cell.style) || this.parent.cellStyle, (cell && cell.wrap) ?
                getLines(this.parent.getDisplayText(cell), getColumnWidth(sheet, colIdx), cell.style, this.parent.cellStyle) : 1);
            setMaxHgt(sheet, rowIdx, colIdx, hgt + borderSize);
            if (isLastCell) {
                let row: HTMLElement = this.parent.getRow(rowIdx);
                if (!row) { return; }
                let prevHeight: number = getRowHeight(sheet, rowIdx);
                maxHgt = getMaxHgt(sheet, rowIdx);
                let heightChanged: boolean = onActionUpdate ? maxHgt !== prevHeight : maxHgt > prevHeight;
                if (heightChanged) {
                    setRowEleHeight(this.parent, sheet, maxHgt, rowIdx, row);
                }
            }
        }
    }

    private isHeightCheckNeeded(style: CellStyleModel, onActionUpdate?: boolean): boolean {
        let keys: string[] = Object.keys(style);
        return (onActionUpdate ? keys.indexOf('fontSize') > -1 : keys.indexOf('fontSize') > -1
            && Number(style.fontSize.split('pt')[0]) > 12) || keys.indexOf('fontFamily') > -1;
    }
    private setLeftBorder(
        border: string, cell: HTMLElement, rowIdx: number, colIdx: number, row: Element, actionUpdate: boolean, first: string): void {
        if (first.includes('Column')) { return; }
        let prevCell: HTMLElement = this.parent.getCell(rowIdx, colIdx - 1, <HTMLTableRowElement>row);
        if (prevCell) {
            if (actionUpdate && border !== '' && colIdx === this.parent.viewport.leftIndex) {
                this.parent.getMainContent().scrollLeft -= this.getBorderSize(border);
            }
            prevCell.style.borderRight = border;
        } else {
            cell.style.borderLeft = border;
        }
    }
    private setTopBorder(
        border: string, cell: HTMLElement, rowIdx: number, colIdx: number, pRow: HTMLElement, pHRow: HTMLElement, actionUpdate: boolean,
        first: string, lastCell: boolean, manualUpdate: boolean): void {
        if (first.includes('Row')) { return; }
        let prevCell: HTMLElement = this.parent.getCell(rowIdx - 1, colIdx, <HTMLTableRowElement>pRow);
        if (prevCell) {
            if (isHiddenRow(this.parent.getActiveSheet(), rowIdx - 1)) {
                let index: number[] = [Number(prevCell.parentElement.getAttribute('aria-rowindex')) - 1, colIdx];
                if ((this.parent.getCellStyleValue(['bottomPriority'], index) as CellStyleExtendedModel).bottomPriority) { return; }
            }
            if (actionUpdate && border !== '' && this.parent.getActiveSheet().topLeftCell.includes(`${rowIdx + 1}`)) {
                this.parent.getMainContent().scrollTop -= this.getBorderSize(border);
            }
            this.setThickBorderHeight(border, rowIdx - 1, colIdx, prevCell, pRow, pHRow, actionUpdate, lastCell, manualUpdate);
            prevCell.style.borderBottom = border;
        } else {
            cell.style.borderTop = border;
        }
    }
    private setThickBorderHeight(
        border: string, rowIdx: number, colIdx: number, cell: HTMLElement, row: HTMLElement, hRow: HTMLElement, actionUpdate: boolean,
        lastCell: boolean, manualUpdate: boolean): void {
        let size: number = border ? this.getBorderSize(border) : 1; let sheet: SheetModel = this.parent.getActiveSheet();
        if (size > 2 && (!sheet.rows[rowIdx] || !sheet.rows[rowIdx].customHeight)) {
            if (manualUpdate) {
                if (!this.checkHeight) { this.checkHeight = true; }
                this.updateRowHeight(rowIdx, colIdx, lastCell, actionUpdate, size);
            } else {
                let prevHeight: number = getRowHeight(sheet, rowIdx);
                let height: number = Math.ceil(this.parent.calculateHeight(
                    this.parent.getCellStyleValue(['fontFamily', 'fontSize'], [rowIdx, colIdx]), 1, 3));
                if (height > prevHeight) {
                    setRowEleHeight(this.parent, sheet, height, rowIdx, row, hRow, false);
                    this.parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - 20 });
                }
            }
        }
        if (actionUpdate && (lastCell || !this.checkHeight) && size < 3 && (!sheet.rows[rowIdx] || !sheet.rows[rowIdx].customHeight)) {
            if (!this.checkHeight) { this.checkHeight = true; }
            this.updateRowHeight(rowIdx, colIdx, lastCell, actionUpdate, size);
        }
    }
    private getBorderSize(border: string): number {
        let size: string = border.split(' ')[0];
        return size === 'thin' ? 1 : (size === 'medium' ? 2 : (size === 'thick' ? 3 :
            (parseInt(size, 10) ? parseInt(size, 10) : 1)));
    }
    private clearObj(args: { options: ClearOptions, isPublic: boolean }): void {
        let options: ClearOptions = args.options;
        let range: string = options.range ? (options.range.indexOf('!') > 0) ? options.range.split('!')[1] : options.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        let sheetIndex: number = (options.range && options.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, options.range.split('!')[0]) : this.parent.activeSheetIndex;
        let rangeIdx: number[] = getRangeIndexes(range);
        let sheet: SheetModel = this.parent.sheets[sheetIndex];
        let sRIdx: number = rangeIdx[0];
        let eRIdx: number = rangeIdx[2];
        let sCIdx: number;
        let eCIdx: number;
        let eventArgs: object = { range: range, type: options.type, requestType: 'clear', sheetIndex: sheetIndex };
        if (!args.isPublic) {
            this.parent.notify(beginAction, { action: 'beforeClear', eventArgs: eventArgs });
        }
        if (options.type === 'Clear Formats' || options.type === 'Clear All') {
            for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
                sCIdx = rangeIdx[1];
                eCIdx = rangeIdx[3];
                for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                    let cell: CellModel = getCell(sRIdx, sCIdx, sheet);
                    let cellElem: HTMLElement = this.parent.getCell(sRIdx, sCIdx);
                    if (cell) {
                        if (cell.wrap) {
                            this.parent.notify(wrapEvent, { range: [sRIdx, sCIdx, sRIdx, sCIdx], wrap: false, sheet: sheet });
                        }
                        if (cell.hyperlink) {
                            removeClass(cellElem.querySelectorAll('.e-hyperlink'), 'e-hyperlink-style');
                            if (options.type === 'Clear All') {
                                this.parent.removeHyperlink(getRangeAddress([sRIdx, sCIdx, sRIdx, sCIdx]));
                            }
                        }
                    }
                }
            }
        }
        if (options.type === 'Clear Hyperlinks') {
            this.parent.removeHyperlink(range);
        }
        this.parent.notify(clear, { range: sheet.name + '!' + range, type: options.type });
        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getRangeIndexes(range));
        if (!args.isPublic) {
            eventArgs = { range: sheet.name + '!' + range, type: options.type, sheetIndex: sheetIndex };
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'clear' });
        }
    }

    private addEventListener(): void {
        this.parent.on(applyCellFormat, this.applyCellFormat, this);
        this.parent.on(clearViewer, this.clearObj, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initialLoad, this.addEventListener);
            this.parent.off(applyCellFormat, this.applyCellFormat);
            this.parent.off(clearViewer, this.clearObj);
        }
    }
    /**
     * Destroy cell format module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null; this.row = null; this.checkHeight = null;
    }
    /**
     * Get the cell format module name.
     */
    public getModuleName(): string {
        return 'cellformat';
    }
}