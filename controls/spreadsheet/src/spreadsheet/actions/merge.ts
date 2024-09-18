import { Spreadsheet } from '../base/index';
import { applyMerge, activeCellMergedRange, MergeArgs, skipHiddenIdx } from '../../workbook/common/index';
import { ICellRenderer, hiddenMerge, CellRenderArgs } from '../common/index';
import { checkPrevMerge, checkMerge } from '../common/index';
import { CellModel, getCell, SheetModel, isHiddenCol, isHiddenRow, isImported } from '../../workbook/index';

/**
 * The `Merge` module is used to to merge the range of cells.
 */
export class Merge {
    private parent: Spreadsheet;
    /**
     * Constructor for the Spreadsheet merge module.
     *
     * @param {Spreadsheet} parent - Specify the spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private merge(args: { rowIdx?: number, colIdx?: number, lastCell?: boolean, element?: Element, mergeCel?: boolean }): void {
        (this.parent.serviceLocator.getService('cell') as ICellRenderer).refresh(
            args.rowIdx, args.colIdx, args.lastCell, args.element, false, false, isImported(this.parent));
    }
    private hideHandler(args: { rowIdx: number, colIdx: number, model: string, start: number, end: number, isEnd?: boolean,
        hide: boolean }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const mergeArgs: MergeArgs = { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx] };
        this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
        const cell: CellModel = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet) || {};
        const startIdx: number = args.model === 'row' ? mergeArgs.range[0] : mergeArgs.range[1];
        const endIdx: number = startIdx + ((cell[`${args.model}Span`] || 1) - 1);
        if ((!args.isEnd && (args.start === startIdx || isHiddenCol(sheet, startIdx))) || (args.isEnd && (args.start > startIdx &&
            !isHiddenCol(sheet, startIdx)))) { return; }
        if (cell[`${args.model}Span`] > 1 && endIdx >= args.start) {
            if (args.model === 'row' ? isHiddenRow(sheet, startIdx) : isHiddenCol(sheet, startIdx)) {
                if (args.colIdx <= endIdx) {
                    const colIdx: number = skipHiddenIdx(sheet, mergeArgs.range[1], true, 'columns');
                    if (colIdx <= endIdx) {
                        let rowIdx: number = mergeArgs.range[0];
                        if (cell.rowSpan > 1) {
                            rowIdx = skipHiddenIdx(sheet, mergeArgs.range[0], true);
                            rowIdx = rowIdx <= mergeArgs.range[2] ? rowIdx : mergeArgs.range[0];
                        }
                        const cellEle: HTMLTableCellElement = this.parent.getCell(rowIdx, colIdx) as HTMLTableCellElement;
                        if (cellEle) {
                            cellEle.style.display = '';
                            this.parent.serviceLocator.getService<ICellRenderer>('cell').refresh(
                                mergeArgs.range[0], mergeArgs.range[1], true, cellEle, true, true);
                        }
                    }
                }
            } else {
                const rowIdx: number = cell.rowSpan > 1 ? skipHiddenIdx(sheet, mergeArgs.range[0], true) : mergeArgs.range[0];
                this.merge(
                    { rowIdx: mergeArgs.range[0], colIdx: mergeArgs.range[1], element: this.parent.getCell(rowIdx, mergeArgs.range[1]) });
            }
        }
    }
    private checkPrevMerge(args: CellRenderArgs): void {
        let cell: CellModel; let mergeArgs: MergeArgs; let mergeCount: number; let isMergeApplied: boolean; let isRowMergeCell: boolean;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const clearMerge: Function = (): void => {
            const contTable: HTMLTableElement = this.parent.getContentTable();
            const contRow: HTMLTableRowElement = contTable && contTable.rows[0];
            if (!contRow) { return; }
            const firstRowIdx: number = parseInt(contRow.getAttribute('aria-rowindex'), 10) - 1;
            mergeArgs.range = mergeArgs.range as number[];
            if (firstRowIdx > this.parent.viewport.topIndex + this.parent.frozenRowCount(sheet) && firstRowIdx > mergeArgs.range[0] &&
                firstRowIdx <= mergeArgs.range[2]) {
                let cellEle: HTMLTableCellElement;
                const hdrTable: HTMLTableElement = this.parent.getRowHeaderTable();
                const hdrRow: HTMLTableRowElement = hdrTable && hdrTable.rows[0];
                const frozenCol: number = this.parent.frozenColCount(sheet);
                if (frozenCol && !hdrRow) { return; }
                for (let colIdx: number = args.colIdx; colIdx <= mergeArgs.range[3]; colIdx++) {
                    cellEle = this.parent.getCell(firstRowIdx, colIdx, colIdx < frozenCol ? hdrRow : contRow) as HTMLTableCellElement;
                    if (cellEle && (cellEle.colSpan > 1 || cellEle.rowSpan > 1)) {
                        cellEle.style.display = 'none';
                        cellEle.removeAttribute('colSpan');
                        cellEle.removeAttribute('rowSpan');
                    }
                }
            }
        };
        const checkRowMerge: Function = (isColMerge: boolean): void => {
            mergeArgs.range = mergeArgs.range as number[];
            if (isHiddenRow(sheet, mergeArgs.range[0]) && args.rowIdx >= mergeArgs.range[0] && args.rowIdx <= mergeArgs.range[2]) {
                isMergeApplied = false;
                for (let rowIdx: number = mergeArgs.range[0]; rowIdx < args.rowIdx; rowIdx++) {
                    if (!isHiddenRow(sheet, rowIdx)) {
                        isMergeApplied = true;
                        break;
                    }
                }
                if (cell.rowSpan > 1 && !isMergeApplied) {
                    const rowMergeCount: number = cell.rowSpan - this.parent.hiddenCount(mergeArgs.range[0], mergeArgs.range[2]);
                    if (rowMergeCount > 0) {
                        clearMerge();
                        args.td.style.display = '';
                        args.colSpan = mergeCount;
                        args.rowSpan = rowMergeCount;
                        args.cell = cell;
                        args.isMerged = false;
                    }
                }
            } else if (isColMerge) {
                for (let rowIdx: number = mergeArgs.range[0]; isRowMergeCell && rowIdx < args.rowIdx; rowIdx++) {
                    if (!isHiddenRow(sheet, rowIdx)) {
                        isMergeApplied = true;
                        break;
                    }
                }
                if (!isMergeApplied) {
                    clearMerge();
                    args.td.style.display = '';
                    args.colSpan = mergeCount;
                    args.cell = cell;
                    args.isMerged = false;
                }
            }
        };
        if (args.cell.colSpan < 0) {
            if (args.colIdx - 1 > -1 && isHiddenCol(sheet, args.colIdx - 1)) {
                cell = getCell(args.rowIdx, args.colIdx - 1, sheet, false, true);
                isRowMergeCell = args.rowIdx - 1 > -1 && isHiddenRow(sheet, args.rowIdx - 1);
                if ((cell.colSpan !== undefined || cell.rowSpan !== undefined) && (cell.rowSpan === undefined ||
                    cell.rowSpan > 1 || isRowMergeCell)) {
                    mergeArgs = { range: [args.rowIdx, args.colIdx - 1, args.rowIdx, args.colIdx - 1] };
                    this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
                    cell = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet, false, true);
                    if (isHiddenCol(sheet, mergeArgs.range[1]) && args.colIdx >= mergeArgs.range[1] && args.colIdx <= mergeArgs.range[3]) {
                        for (let colIdx: number = mergeArgs.range[1]; colIdx < args.colIdx; colIdx++) {
                            if (!isHiddenCol(sheet, colIdx)) {
                                isMergeApplied = true;
                                break;
                            }
                        }
                        if (cell.colSpan > 1 && !isMergeApplied) {
                            mergeCount = cell.colSpan - this.parent.hiddenCount(mergeArgs.range[1], mergeArgs.range[3], 'columns');
                            if (mergeCount > 0) {
                                checkRowMerge(true);
                            }
                        }
                    }
                }
            }
        } else {
            if (args.rowIdx - 1 > -1 && isHiddenRow(sheet, args.rowIdx - 1)) {
                cell = getCell(args.rowIdx - 1, args.colIdx, sheet, false, true);
                if (cell.rowSpan !== undefined) {
                    mergeArgs = { range: [args.rowIdx - 1, args.colIdx, args.rowIdx - 1, args.colIdx] };
                    this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
                    cell = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet, false, true);
                    checkRowMerge();
                }
            }
        }
    }
    private checkMerge(args: CellRenderArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet(); let mergeArgs: MergeArgs;
        let cell: CellModel = getCell(args.rowIdx, args.colIdx, sheet) || {};
        if (args.isRow) {
            if (cell.colSpan === undefined || isHiddenCol(sheet, args.colIdx - 1)) {
                mergeArgs = { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx] };
                mergeArgs.range = mergeArgs.range as number[];
                this.parent.notify(activeCellMergedRange, mergeArgs);
                if ((isHiddenCol(sheet, args.colIdx - 1) && !isHiddenCol(sheet, mergeArgs.range[1])) || (args.isFreezePane &&
                    mergeArgs.range[0] < this.parent.frozenRowCount(sheet))) {
                    args.insideFreezePane = mergeArgs.range[0] < this.parent.frozenRowCount(sheet); return;
                }
                if (args.colIdx !== this.parent.viewport.leftIndex + this.parent.frozenColCount(sheet) &&
                    isHiddenCol(sheet, args.colIdx - 1)) {
                    for (let colIdx: number = mergeArgs.range[1] as number; cell.colSpan !== undefined && colIdx < args.colIdx; colIdx++) {
                        if (!isHiddenCol(sheet, colIdx)) {
                            return;
                        }
                    }
                }
                cell = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet);
                const mergeCount: number = (mergeArgs.range[2] - args.rowIdx) + 1 -
                    this.parent.hiddenCount(args.rowIdx, mergeArgs.range[2]);
                if (mergeCount >= 1) {
                    this.merge({ rowIdx: mergeArgs.range[0], colIdx: mergeArgs.range[1], element: args.td });
                    if (mergeCount === 1) {
                        args.td.removeAttribute('rowspan');
                    } else {
                        args.td.rowSpan = mergeCount;
                    }
                    args.td.style.display = '';
                }
            }
        } else {
            if (cell.rowSpan === undefined || isHiddenRow(sheet, args.rowIdx - 1)) {
                mergeArgs = { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx] };
                mergeArgs.range = mergeArgs.range as number[];
                this.parent.notify(activeCellMergedRange, mergeArgs);
                if ((isHiddenRow(sheet, args.rowIdx - 1) && !isHiddenRow(sheet, mergeArgs.range[0])) || (args.isFreezePane &&
                    mergeArgs.range[1] < this.parent.frozenColCount(sheet))) {
                    args.insideFreezePane = mergeArgs.range[1] < this.parent.frozenColCount(sheet); return;
                }
                if (args.rowIdx !== this.parent.viewport.topIndex + this.parent.frozenRowCount(sheet) &&
                    isHiddenRow(sheet, args.rowIdx - 1)) {
                    for (let rowIdx: number = mergeArgs.range[0] as number; cell.rowSpan !== undefined && rowIdx < args.rowIdx; rowIdx++) {
                        if (!isHiddenRow(sheet, rowIdx)) {
                            return;
                        }
                    }
                }
                cell = getCell(mergeArgs.range[0], mergeArgs.range[1], sheet);
                const mergeCount: number = (mergeArgs.range[3] - args.colIdx) + 1 - this.parent.hiddenCount(
                    args.colIdx, mergeArgs.range[3], 'columns');
                if (mergeCount >= 1) {
                    this.merge({ rowIdx: mergeArgs.range[0], colIdx: mergeArgs.range[1], element: args.td });
                    if (mergeCount === 1) {
                        args.td.removeAttribute('colspan');
                    } else {
                        args.td.colSpan = mergeCount;
                    }
                    args.td.style.display = '';
                }
            }
        }
    }
    private addEventListener(): void {
        this.parent.on(applyMerge, this.merge, this);
        this.parent.on(hiddenMerge, this.hideHandler, this);
        this.parent.on(checkPrevMerge, this.checkPrevMerge, this);
        this.parent.on(checkMerge, this.checkMerge, this);
    }
    /**
     * Destroy merge module.
     *
     * @returns {void} - Destroy merge module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyMerge, this.merge);
            this.parent.off(hiddenMerge, this.hideHandler);
            this.parent.off(checkPrevMerge, this.checkPrevMerge);
            this.parent.off(checkMerge, this.checkMerge);
        }
    }
    /**
     * Get the merge module name.
     *
     * @returns {string} - Get the merge module name.
     */
    public getModuleName(): string {
        return 'merge';
    }
}
