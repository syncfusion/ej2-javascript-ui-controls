import { Spreadsheet, ICellRenderer, clearViewer, getTextHeightWithBorder } from '../../spreadsheet/index';
import { getExcludedColumnWidth, selectRange, getLineHeight, getBorderHeight, getDPRValue, completeAction } from '../common/index';
import { rowHeightChanged, setRowEleHeight, setMaxHgt, getTextHeight, getMaxHgt, getLines, isImported } from '../common/index';
import { CellFormatArgs, getRowHeight, applyCellFormat, CellStyleModel, Workbook, clearFormulaDependentCells, getSwapRange } from '../../workbook/index';
import { SheetModel, isHiddenRow, getCell, getRangeIndexes, getSheetIndex, activeCellChanged, clearCFRule } from '../../workbook/index';
import { wrapEvent, getRangeAddress, ClearOptions, clear, activeCellMergedRange, addHighlight, cellValidation } from '../../workbook/index';
import { setRowHeight, CellStyleExtendedModel, CellModel, beginAction, isHeightCheckNeeded, CFArgs } from '../../workbook/index';
import { removeClass } from '@syncfusion/ej2-base';
import { deleteChart, deleteImage } from '../common/index';
/**
 * CellFormat module allows to format the cell styles.
 */
export class CellFormat {
    private parent: Spreadsheet;
    private checkHeight: boolean = false;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private applyCellFormat(args: CellFormatArgs): void {
        if (args.checkHeight) {
            if (!this.checkHeight) {
                this.checkHeight = true;
            }
            this.updateRowHeight(args.rowIdx, args.colIdx, args.lastCell, args.onActionUpdate, args.outsideViewport);
            return;
        }
        const keys: string[] = Object.keys(args.style);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (args.lastCell && getMaxHgt(sheet, args.rowIdx) <= 20 && !keys.length) {
            return;
        }
        const cell: HTMLElement = args.cell || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cell) {
            this.updateMergeBorder(args, sheet);
            if (args.style.border !== undefined || args.style.borderTop !== undefined || args.style.borderLeft !== undefined) {
                const curStyle: CellStyleModel = {};
                Object.keys(args.style).forEach((key: string): void => { curStyle[`${key}`] = args.style[`${key}`]; });
                if (curStyle.border !== undefined) {
                    Object.assign(cell.style, <CellStyleModel>{ borderRight: args.style.border, borderBottom: args.style.border });
                    this.setLeftBorder(args.style.border, cell, args.rowIdx, args.colIdx, args.row, args.onActionUpdate, args.first, sheet);
                    this.setTopBorder(
                        args.style.border, cell, args.rowIdx, args.colIdx, args.pRow, args.pHRow, args.onActionUpdate, args.first,
                        args.lastCell, args.manualUpdate, sheet);
                    delete curStyle.border;
                }
                if (curStyle.borderTop !== undefined) {
                    this.setTopBorder(
                        args.style.borderTop, cell, args.rowIdx, args.colIdx, args.pRow, args.pHRow, args.onActionUpdate, args.first,
                        args.lastCell, args.manualUpdate, sheet);
                    delete curStyle.borderTop;
                }
                if (curStyle.borderLeft !== undefined) {
                    this.setLeftBorder(
                        args.style.borderLeft, cell, args.rowIdx, args.colIdx, args.row, args.onActionUpdate, args.first, sheet);
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
            const cellModel: CellModel = getCell(args.rowIdx, args.colIdx, sheet, null, true);
            if (!sheet.rows[args.rowIdx] || !sheet.rows[args.rowIdx].customHeight) {
                if (args.isHeightCheckNeeded) {
                    if (!args.manualUpdate) {
                        if (!cellModel.wrap && isHeightCheckNeeded(args.style)) {
                            setMaxHgt(
                                sheet, args.rowIdx, args.colIdx, getTextHeightWithBorder(
                                    this.parent, args.rowIdx, args.colIdx, sheet, args.style));
                        }
                        if (args.lastCell) {
                            const height: number = getMaxHgt(sheet, args.rowIdx);
                            if (height > 20 && height > getRowHeight(sheet, args.rowIdx)) {
                                setRowEleHeight(
                                    this.parent, sheet, height, args.rowIdx, args.row, args.hRow, this.parent.scrollSettings.isFinite);
                            }
                        }
                    } else {
                        if (!this.checkHeight) {
                            this.checkHeight = isHeightCheckNeeded(args.style, args.onActionUpdate);
                        }
                        if (cell && cell.children[0] && cell.children[0].className === 'e-cf-databar' && args.style.fontSize) {
                            (cell.children[0].querySelector('.e-databar-value') as HTMLElement).style.fontSize = args.style.fontSize;
                        }
                        this.updateRowHeight(args.rowIdx, args.colIdx, args.lastCell, args.onActionUpdate);
                        if (cellModel.wrap && (args.style.fontSize || args.style.fontFamily)) {
                            cell.style.lineHeight = (parseFloat(
                                (cellModel.style && cellModel.style.fontSize) || this.parent.cellStyle.fontSize) * getLineHeight(
                                cellModel.style && cellModel.style.fontFamily ? cellModel.style : this.parent.cellStyle)) + 'pt';
                        }
                    }
                }
            } else if (!cellModel.wrap && args.style.fontSize) {
                const hgt: number = getRowHeight(sheet, args.rowIdx, true) - getBorderHeight(args.rowIdx, args.colIdx, sheet);
                if (hgt < getTextHeight(this.parent, cellModel.style)) {
                    cell.style.lineHeight = `${hgt}px`;
                } else if (cell.style.lineHeight) {
                    cell.style.lineHeight = '';
                }
            }
        } else {
            this.updateRowHeight(args.rowIdx, args.colIdx, true, args.onActionUpdate);
        }
    }
    private updateRowHeight(
        rowIdx: number, colIdx: number, isLastCell: boolean, onActionUpdate: boolean, outsideViewport?: boolean): void {
        if (this.checkHeight) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const cell: CellModel = getCell(rowIdx, colIdx, sheet, null, true);
            if (!cell.rowSpan) {
                let hgt: number = 0;
                hgt = getTextHeightWithBorder(
                    this.parent, rowIdx, colIdx, sheet, cell.style || this.parent.cellStyle,
                    cell.wrap ? getLines(
                        this.parent.getDisplayText(cell), getExcludedColumnWidth(sheet, rowIdx, colIdx), cell.style, this.parent.cellStyle)
                        : 1);
                const val: string = cell.value && cell.value.toString();
                if (val && val.indexOf('\n') > -1) {
                    let i: number;
                    const splitVal: string[] = val.split('\n');
                    let n: number = 0; const valLength: number = splitVal.length;
                    for (i = 0; i < valLength; i++) {
                        let lines: number = getLines(
                            splitVal[i as number], getExcludedColumnWidth(sheet, rowIdx, colIdx), cell.style, this.parent.cellStyle);
                        if (lines === 0) {
                            lines = 1; // for empty new line
                        }
                        n = n + lines;
                    }
                    hgt = getTextHeightWithBorder(this.parent, rowIdx, colIdx, sheet, cell.style || this.parent.cellStyle, n);
                }
                if (hgt < 20) {
                    hgt = 20; // default height
                }
                setMaxHgt(sheet, rowIdx, colIdx, hgt);
                if (!outsideViewport) {
                    const td: HTMLElement = this.parent.getCell(rowIdx, colIdx);
                    if (td && td.children[0] && td.children[0].className === 'e-cf-databar') {
                        (td.children[0] as HTMLElement).style.height = '100%';
                        (td.children[0].firstElementChild.nextElementSibling as HTMLElement).style.height = '100%';
                    }
                }
                if (isLastCell) {
                    this.checkHeight = false;
                    const maxHgt: number = getMaxHgt(sheet, rowIdx);
                    let prevHgt: number = getRowHeight(sheet, rowIdx);
                    if (onActionUpdate ? maxHgt !== prevHgt : maxHgt > prevHgt) {
                        if (outsideViewport) {
                            prevHgt = getDPRValue(prevHgt);
                            setRowHeight(sheet, rowIdx, maxHgt);
                            this.parent.setProperties({ sheets: this.parent.sheets }, true);
                            this.parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: getDPRValue(maxHgt) - prevHgt });
                        } else {
                            setRowEleHeight(this.parent, sheet, maxHgt, rowIdx, null, null, true);
                        }
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
    private setLeftBorder(
        border: string, cell: HTMLElement, rowIdx: number, colIdx: number, row: Element, actionUpdate: boolean, first: string,
        sheet: SheetModel): void {
        if (first && first.includes('Column')) { return; }
        const prevCell: HTMLElement = this.parent.getCell(rowIdx, colIdx - 1, <HTMLTableRowElement>row);
        if (prevCell) {
            let model: CellModel = getCell(rowIdx, colIdx - 1, sheet, false, true);
            if ((!!model.rowSpan && model.rowSpan !== 1) || (!!model.colSpan && model.colSpan !== 1)) {
                const mergeArgs: { range: number[] } = { range: [rowIdx, colIdx - 1, rowIdx, colIdx - 1] };
                this.parent.notify(activeCellMergedRange, mergeArgs);
                model = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet, false, true);
                if (model.style && model.style.borderRight && model.style.borderRight !== 'none') {
                    return;
                } else {
                    model = getCell(mergeArgs.range[0], mergeArgs.range[3], sheet, null, true);
                    if (model.style && model.style.borderRight && model.style.borderRight !== 'none') { return; }
                    cell.style.borderLeft = border;
                }
            } else {
                if (actionUpdate && border !== '' && colIdx === this.parent.viewport.leftIndex) {
                    this.parent.getMainContent().scrollLeft -= this.getBorderSize(border);
                }
                prevCell.style.borderRight = (border === 'none') ? prevCell.style.borderRight : border;
            }
        } else {
            cell.style.borderLeft = border;
        }
    }
    private setTopBorder(
        border: string, cell: HTMLElement, rowIdx: number, colIdx: number, pRow: HTMLElement, pHRow: HTMLElement, actionUpdate: boolean,
        first: string, lastCell: boolean, manualUpdate: boolean, sheet: SheetModel): void {
        if (first && first.includes('Row')) { return; }
        const prevCell: HTMLElement = this.parent.getCell(rowIdx - 1, colIdx, <HTMLTableRowElement>pRow);
        if (prevCell) {
            let model: CellModel = getCell(rowIdx - 1, colIdx, sheet, false, true);
            if ((!!model.rowSpan && model.rowSpan !== 1) || (!!model.colSpan && model.colSpan !== 1)) {
                const mergeArgs: { range: number[] } = { range: [rowIdx - 1, colIdx, rowIdx - 1, colIdx] };
                this.parent.notify(activeCellMergedRange, mergeArgs);
                model = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet, false, true);
                if (model.style && model.style.borderBottom && model.style.borderBottom !== 'none') {
                    return;
                } else {
                    model = getCell(mergeArgs.range[2], mergeArgs.range[1], sheet, null, true);
                    if (model.style && model.style.borderBottom && model.style.borderBottom !== 'none') { return; }
                    cell.style.borderTop = border;
                }
            } else {
                if (isHiddenRow(sheet, rowIdx - 1)) {
                    const index: number[] = [Number(prevCell.parentElement.getAttribute('aria-rowindex')) - 1, colIdx];
                    if ((this.parent.getCellStyleValue(['bottomPriority'], index) as CellStyleExtendedModel).bottomPriority) { return; }
                }
                if (actionUpdate && border !== '' && sheet.topLeftCell.includes(`${rowIdx + 1}`)) {
                    this.parent.getMainContent().parentElement.scrollTop -= this.getBorderSize(border);
                }
                this.setThickBorderHeight(border, rowIdx - 1, colIdx, prevCell, pRow, pHRow, actionUpdate, lastCell, manualUpdate);
                prevCell.style.borderBottom = (border === 'none') ? prevCell.style.borderBottom : border;
            }
        } else {
            cell.style.borderTop = border;
        }
    }
    private setThickBorderHeight(
        border: string, rowIdx: number, colIdx: number, cell: HTMLElement, row: HTMLElement, hRow: HTMLElement, actionUpdate: boolean,
        lastCell: boolean, manualUpdate: boolean): void {
        const size: number = border ? this.getBorderSize(border) : 1; const sheet: SheetModel = this.parent.getActiveSheet();
        if (size > 2 && (!sheet.rows[rowIdx as number] || !sheet.rows[rowIdx as number].customHeight)) {
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
        if (actionUpdate && (lastCell || !this.checkHeight) && size < 3 && (!sheet.rows[rowIdx as number] ||
                !sheet.rows[rowIdx as number].customHeight)) {
            if (!this.checkHeight) { this.checkHeight = true; }
            this.updateRowHeight(rowIdx, colIdx, lastCell, actionUpdate);
        }
    }
    private getBorderSize(border: string): number {
        const size: string = border.split(' ')[0];
        return size === 'thin' ? 1 : (size === 'medium' ? 2 : (size === 'thick' ? 3 :
            (parseInt(size, 10) ? parseInt(size, 10) : 1)));
    }

    private clearObj(args: { options: ClearOptions, isAction?: boolean, isFromUpdateAction?: boolean }): void {
        const options: ClearOptions = args.options;
        const range: string = options.range ? (options.range.indexOf('!') > 0) ? options.range.split('!')[1] : options.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        const sheetIndex: number = (options.range && options.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent as Workbook, options.range.split('!')[0]) : this.parent.activeSheetIndex;
        const rangeIdx: number[] = getSwapRange(getRangeIndexes(range));
        const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
        let sRIdx: number = rangeIdx[0];
        const eRIdx: number = rangeIdx[2];
        let sCIdx: number;
        let eCIdx: number;
        const overlayElements: HTMLCollection = this.parent.element.getElementsByClassName('e-ss-overlay-active');
        const isOverlay: boolean = overlayElements.length > 0;
        let clearCFArgs: CFArgs;
        let eventArgs: { [key: string]: object | string | number } = { range: range, type: options.type, requestType: 'clear',
            sheetIndex: sheetIndex };
        const actionBegin: Function = (): void => {
            if (args.isAction) {
                this.parent.notify(beginAction, { action: 'beforeClear', eventArgs: eventArgs });
            }
        };
        const actionComplete: Function = (): void => {
            if (args.isAction) {
                eventArgs = { range: sheet.name + '!' + range, type: options.type, sheetIndex: sheetIndex };
                if (clearCFArgs) {
                    eventArgs.cfClearActionArgs = clearCFArgs.cfClearActionArgs;
                }
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clear' });
            }
        };
        if (isOverlay) {
            if (overlayElements[0].classList.contains('e-datavisualization-chart')) {
                if (options.type === 'Clear Contents' || options.type === 'Clear All') {
                    actionBegin();
                    this.parent.notify(deleteChart, {
                        id: overlayElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                    });
                    actionComplete();
                }
            } else if (options.type === 'Clear All') {
                actionBegin();
                this.parent.notify(deleteImage, {
                    id: overlayElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                });
                actionComplete();
            }
        } else {
            actionBegin();
            if (options.type === 'Clear Formats' || options.type === 'Clear All') {
                clearCFArgs = { range: range, sheetIdx: sheetIndex, isClear: true };
                this.parent.notify(clearCFRule, clearCFArgs);
                (args as { cfClearActionArgs?: object }).cfClearActionArgs = clearCFArgs.cfClearActionArgs;
                if (options.type === 'Clear All') {
                    this.parent.notify(cellValidation, { range: range, isRemoveValidation: true });
                    if (sRIdx === 0 && rangeIdx[1] === 0 && eRIdx >= sheet.usedRange.rowIndex  && rangeIdx[3] >= sheet.usedRange.colIndex) {
                        this.parent.setUsedRange(sRIdx, rangeIdx[1], sheet, false, true);
                    }
                }
                for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
                    sCIdx = rangeIdx[1];
                    eCIdx = rangeIdx[3];
                    for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                        const cell: CellModel = getCell(sRIdx, sCIdx, sheet);
                        const cellElem: HTMLElement = this.parent.getCell(sRIdx, sCIdx);
                        if (cell) {
                            if (cell.formula) {
                                this.parent.notify(clearFormulaDependentCells, { cellRef: getRangeAddress([sRIdx, sCIdx, sRIdx, sCIdx]) });
                            }
                            if (cell.wrap) {
                                this.parent.notify(wrapEvent, { range: [sRIdx, sCIdx, sRIdx, sCIdx], wrap: false, sheet: sheet });
                            }
                            if (cell.hyperlink) {
                                if (cellElem) {
                                    removeClass(cellElem.querySelectorAll('.e-hyperlink'), 'e-hyperlink-style');
                                }
                                if (options.type === 'Clear All') {
                                    this.parent.removeHyperlink(sheet.name + '!' + getRangeAddress([sRIdx, sCIdx, sRIdx, sCIdx]));
                                }
                            }
                        }
                    }
                }
            }
            if (options.type === 'Clear Hyperlinks') {
                this.parent.removeHyperlink(sheet.name + '!' + range);
            }
            this.parent.notify(clear, { range: sheet.name + '!' + range, type: options.type });
            this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(
                getSwapRange(getRangeIndexes(range)), false, false, false, false, isImported(this.parent));
            this.parent.notify(addHighlight, { range: range, isclearFormat: true });
            if (!args.isFromUpdateAction) {
                this.parent.notify(selectRange, { address: range });
            }
            this.parent.notify(activeCellChanged, null);
            actionComplete();
        }
    }

    private addEventListener(): void {
        this.parent.on(applyCellFormat, this.applyCellFormat, this);
        this.parent.on(clearViewer, this.clearObj, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
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
        this.parent = null;
        this.checkHeight = null;
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
