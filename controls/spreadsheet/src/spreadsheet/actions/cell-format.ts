import { Spreadsheet, ICellRenderer, clearViewer, beginAction, getTextHeightWithBorder } from '../../spreadsheet/index';
import { getExcludedColumnWidth, selectRange } from '../common/index';
import { rowHeightChanged, setRowEleHeight, setMaxHgt, getTextHeight, getMaxHgt, getLines, initialLoad } from '../common/index';
import { CellFormatArgs, getRowHeight, applyCellFormat, CellStyleModel, CellStyleExtendedModel, CellModel, Workbook} from '../../workbook/index';
import { SheetModel, isHiddenRow, getCell, getRangeIndexes, getSheetIndex, clearCFRule } from '../../workbook/index';
import { wrapEvent, getRangeAddress, ClearOptions, clear, activeCellMergedRange } from '../../workbook/index';
import { removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
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
        const keys: string[] = Object.keys(args.style);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (args.lastCell && getMaxHgt(sheet, args.rowIdx) <= 20 && !keys.length) { return; }
        const cell: HTMLElement = args.cell || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cell) {
            this.updateMergeBorder(args, sheet);
            if (args.style.border !== undefined || args.style.borderTop !== undefined || args.style.borderLeft !== undefined) {
                const curStyle: CellStyleModel = {};
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
                const CellElem: CellModel = getCell(args.rowIdx, args.colIdx, sheet); // Need to remove after adding span support to merge
                if (CellElem && (CellElem.rowSpan || CellElem.colSpan) && cell.offsetHeight > 0) {
                    const height: number = getTextHeight(this.parent as Workbook, CellElem.style || this.parent.cellStyle);
                    if (height > cell.offsetHeight) { setRowEleHeight(this.parent, sheet, cell.offsetHeight, args.rowIdx); }
                }
            }
            if (args.isHeightCheckNeeded) {
                if (!sheet.rows[args.rowIdx] || !sheet.rows[args.rowIdx].customHeight) {
                    if (!args.manualUpdate) {
                        const cellModel: CellModel = getCell(args.rowIdx, args.colIdx, sheet);
                        if (!(cellModel && cellModel.wrap) && this.isHeightCheckNeeded(args.style)) {
                            setMaxHgt(sheet, args.rowIdx, args.colIdx,
                                      getTextHeightWithBorder(this.parent as Workbook, args.rowIdx, args.colIdx, sheet, args.style));
                        }
                        if (args.lastCell) {
                            const height: number = getMaxHgt(sheet, args.rowIdx);
                            if (height > 20 && height > getRowHeight(sheet, args.rowIdx)) {
                                setRowEleHeight(this.parent, sheet, height, args.rowIdx, args.row, args.hRow, false);
                            }
                        }
                    } else {
                        if (!this.checkHeight) { this.checkHeight = this.isHeightCheckNeeded(args.style, args.onActionUpdate); }
                        if (cell && cell.children[0] && cell.children[0].className === 'e-cf-databar' && args.style.fontSize) {
                            (cell.children[0].querySelector('.e-databar-value') as HTMLElement).style.fontSize = args.style.fontSize;
                        }
                        this.updateRowHeight(args.rowIdx, args.colIdx, args.lastCell, args.onActionUpdate);
                    }
                }
            }
        } else {
            this.updateRowHeight(args.rowIdx, args.colIdx, true, args.onActionUpdate);
        }
    }
    private updateRowHeight(
        rowIdx: number, colIdx: number, isLastCell: boolean, onActionUpdate: boolean): void {
        if (this.checkHeight) {
            let hgt: number = 0;
            let maxHgt: number;
            const sheet: SheetModel = this.parent.getActiveSheet();
            const cell: CellModel = getCell(rowIdx, colIdx, sheet, null, true);
            const td: HTMLElement = this.parent.getCell(rowIdx, colIdx);
            if (cell && (!cell.rowSpan && !cell.colSpan)) {
                hgt = getTextHeightWithBorder(this.parent as Workbook, rowIdx, colIdx, sheet, cell.style ||
                    this.parent.cellStyle, cell.wrap ? getLines(this.parent.getDisplayText(cell),
                                                                getExcludedColumnWidth(sheet, rowIdx, colIdx),
                                                                cell.style, this.parent.cellStyle) : 1);
                if (!isNullOrUndefined(cell.value)) {
                    const val: string = cell.value.toString();
                    if (val.indexOf('\n') > -1) {
                        let i: number;
                        const splitVal: string[] = cell.value.split('\n');
                        let n: number = 0; const valLength: number = splitVal.length;
                        for (i = 0; i < valLength; i++) {
                            let lines: number =
                                getLines(splitVal[i], getExcludedColumnWidth(sheet, rowIdx, colIdx), cell.style, this.parent.cellStyle);
                            if (lines === 0) {
                                lines = 1; // for empty new line
                            }
                            n = n + lines;
                        }
                        hgt =
                         getTextHeightWithBorder(this.parent as Workbook, rowIdx, colIdx, sheet, cell.style || this.parent.cellStyle, n);
                    }
                }
                if (hgt < 20) {
                    hgt = 20; // default height
                }
                if (td && td.children[0] && td.children[0].className === 'e-cf-databar') {
                    (td.children[0] as HTMLElement).style.height = '100%';
                    (td.children[0].firstElementChild.nextElementSibling as HTMLElement).style.height = '100%';
                }
                setMaxHgt(sheet, rowIdx, colIdx, hgt);
                if (isLastCell) {
                    this.checkHeight = false;
                    const row: HTMLElement = sheet.frozenRows ? this.parent.getRow(rowIdx, null, sheet.frozenColumns) :
                        this.parent.getRow(rowIdx);
                    if (!row) { return; }
                    const prevHeight: number = getRowHeight(sheet, rowIdx);
                    maxHgt = getMaxHgt(sheet, rowIdx);
                    const heightChanged: boolean = onActionUpdate ? maxHgt !== prevHeight : maxHgt > prevHeight;
                    if (heightChanged) {
                        setRowEleHeight(this.parent, sheet, maxHgt, rowIdx, row);
                    }
                }
            }
        }
    }

    private updateMergeBorder(args: CellFormatArgs, sheet: SheetModel): void {
        const cellModel: CellModel = getCell(args.rowIdx, args.colIdx, sheet, null, true);
        const mergeArgs: { range: number[] } = { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx] };
        this.parent.notify(activeCellMergedRange, mergeArgs);
        if (cellModel.rowSpan > 1 && !args.style.borderBottom) {
            const bottomCell: CellModel = getCell(mergeArgs.range[2], mergeArgs.range[1], sheet, null, true);
            if (bottomCell.style && bottomCell.style.borderBottom) {
                args.style.borderBottom = bottomCell.style.borderBottom;
            }
        }
        if (cellModel.colSpan > 1 && !args.style.borderRight) {
            const rightCell: CellModel = getCell(mergeArgs.range[0], mergeArgs.range[3], sheet, null, true);
            if (rightCell.style && rightCell.style.borderRight) {
                args.style.borderRight = rightCell.style.borderRight;
            }
        }
    }

    private isHeightCheckNeeded(style: CellStyleModel, onActionUpdate?: boolean): boolean {
        const keys: string[] = Object.keys(style);
        return (onActionUpdate ? keys.indexOf('fontSize') > -1 : keys.indexOf('fontSize') > -1
            && Number(style.fontSize.split('pt')[0]) > 12) || keys.indexOf('fontFamily') > -1 || keys.indexOf('borderTop') > -1
            || keys.indexOf('borderBottom') > -1;
    }
    private setLeftBorder(
        border: string, cell: HTMLElement, rowIdx: number, colIdx: number, row: Element, actionUpdate: boolean, first: string): void {
        if (first && first.includes('Column')) { return; }
        for (let j: number = 0; j < (cell as CellModel).rowSpan; j++) {
            let prevCell: HTMLElement = this.parent.getCell(rowIdx + j, colIdx - 1, <HTMLTableRowElement>row);
            let i: number = 1;
            while (prevCell && prevCell.style.display === 'none') {
                prevCell = this.parent.getCell(rowIdx + j, colIdx - 1 - i, <HTMLTableRowElement>row);
                i++;
            }
            if (prevCell) {
                if (actionUpdate && border !== '' && colIdx === this.parent.viewport.leftIndex) {
                    this.parent.getMainContent().scrollLeft -= this.getBorderSize(border);
                }
                prevCell.style.borderRight = (border === 'none') ? prevCell.style.borderRight : border;
            } else {
                cell.style.borderLeft = border;
            }
        }
    }
    private setTopBorder(
        border: string, cell: HTMLElement, rowIdx: number, colIdx: number, pRow: HTMLElement, pHRow: HTMLElement, actionUpdate: boolean,
        first: string, lastCell: boolean, manualUpdate: boolean): void {
        if (first && first.includes('Row')) { return; }
        for (let j: number = 0; j < (cell as CellModel).colSpan; j++) {
            const prevCell: HTMLElement = this.parent.getCell(rowIdx - 1, colIdx + j, <HTMLTableRowElement>pRow);
            if (prevCell) {
                if (isHiddenRow(this.parent.getActiveSheet(), rowIdx - 1)) {
                    const index: number[] = [Number(prevCell.parentElement.getAttribute('aria-rowindex')) - 1, colIdx];
                    if ((this.parent.getCellStyleValue(['bottomPriority'], index) as CellStyleExtendedModel).bottomPriority) { return; }
                }
                if (actionUpdate && border !== '' && this.parent.getActiveSheet().topLeftCell.includes(`${rowIdx + 1}`)) {
                    this.parent.getMainContent().parentElement.scrollTop -= this.getBorderSize(border);
                }
                this.setThickBorderHeight(border, rowIdx - 1, colIdx + j, prevCell, pRow, pHRow, actionUpdate, lastCell, manualUpdate);
                prevCell.style.borderBottom = (border === 'none') ? prevCell.style.borderBottom : border;
            } else {
                cell.style.borderTop = border;
            }
        }
    }
    private setThickBorderHeight(
        border: string, rowIdx: number, colIdx: number, cell: HTMLElement, row: HTMLElement, hRow: HTMLElement, actionUpdate: boolean,
        lastCell: boolean, manualUpdate: boolean): void {
        const size: number = border ? this.getBorderSize(border) : 1; const sheet: SheetModel = this.parent.getActiveSheet();
        if (size > 2 && (!sheet.rows[rowIdx] || !sheet.rows[rowIdx].customHeight)) {
            if (manualUpdate) {
                if (!this.checkHeight) { this.checkHeight = true; }
                this.updateRowHeight(rowIdx, colIdx, lastCell, actionUpdate);
            } else {
                const prevHeight: number = getRowHeight(sheet, rowIdx);
                const height: number = Math.ceil(this.parent.calculateHeight(
                    this.parent.getCellStyleValue(['fontFamily', 'fontSize'], [rowIdx, colIdx]), 1, 3));
                if (height > prevHeight) {
                    setRowEleHeight(this.parent, sheet, height, rowIdx, row, hRow, false);
                    this.parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - 20 });
                }
            }
        }
        if (actionUpdate && (lastCell || !this.checkHeight) && size < 3 && (!sheet.rows[rowIdx] || !sheet.rows[rowIdx].customHeight)) {
            if (!this.checkHeight) { this.checkHeight = true; }
            this.updateRowHeight(rowIdx, colIdx, lastCell, actionUpdate);
        }
    }
    private getBorderSize(border: string): number {
        const size: string = border.split(' ')[0];
        return size === 'thin' ? 1 : (size === 'medium' ? 2 : (size === 'thick' ? 3 :
            (parseInt(size, 10) ? parseInt(size, 10) : 1)));
    }
    private clearObj(args: { options: ClearOptions, isPublic: boolean }): void {
        const options: ClearOptions = args.options;
        const range: string = options.range ? (options.range.indexOf('!') > 0) ? options.range.split('!')[1] : options.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        const sheetIndex: number = (options.range && options.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent as Workbook, options.range.split('!')[0]) : this.parent.activeSheetIndex;
        const rangeIdx: number[] = getRangeIndexes(range);
        const sheet: SheetModel = this.parent.sheets[sheetIndex];
        let sRIdx: number = rangeIdx[0];
        const eRIdx: number = rangeIdx[2];
        let sCIdx: number;
        let eCIdx: number;
        let eventArgs: object = { range: range, type: options.type, requestType: 'clear', sheetIndex: sheetIndex };
        if (!args.isPublic) {
            this.parent.notify(beginAction, { action: 'beforeClear', eventArgs: eventArgs });
        }
        if (options.type === 'Clear Formats' || options.type === 'Clear All') {
            this.parent.notify(clearCFRule, { range: range, isPublic: false });
            for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
                sCIdx = rangeIdx[1];
                eCIdx = rangeIdx[3];
                for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                    const cell: CellModel = getCell(sRIdx, sCIdx, sheet);
                    const cellElem: HTMLElement = this.parent.getCell(sRIdx, sCIdx);
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
            return;
        }
        this.parent.notify(clear, { range: sheet.name + '!' + range, type: options.type });
        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getRangeIndexes(range));
        if (!args.isPublic) {
            eventArgs = { range: sheet.name + '!' + range, type: options.type, sheetIndex: sheetIndex };
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'clear' });
        }
        this.parent.notify(selectRange, {address: range});
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
     *
     * @returns {void} - Destroy cell format module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null; this.row = null; this.checkHeight = null;
    }
    /**
     * Get the cell format module name.
     *
     * @returns {string} - Get the cell format module name.
     */
    public getModuleName(): string {
        return 'cellformat';
    }
}
