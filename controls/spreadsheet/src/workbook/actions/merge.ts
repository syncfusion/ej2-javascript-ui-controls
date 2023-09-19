import { Workbook, CellModel, getCell, SheetModel, setCell, getSheet } from '../base/index';
import { setMerge, MergeArgs, getSwapRange, getRangeIndexes, mergedRange, applyMerge, activeCellMergedRange } from './../common/index';
import { insertMerge, activeCellChanged, checkIsFormula, applyCF, ApplyCFArgs } from './../common/index';
import { getCellAddress, workbookFormulaOperation, refreshChart } from './../common/index';
import { extend, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';

/**
 * The `WorkbookMerge` module is used to merge the range of cells.
 */
export class WorkbookMerge {
    private parent: Workbook;
    /**
     * Constructor for the workbook merge module.
     *
     * @param {Workbook} parent - Specifies the workbook.
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    private merge(args: MergeArgs): void {
        args.sheetIndex = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        if (args.isAction) {
            this.parent.notify('actionBegin', { eventArgs: args, action: 'merge' });
            if (!args.model) { args.model = []; }
        }
        if (typeof(args.range) === 'string') { args.range = getRangeIndexes(args.range); }
        args.range = getSwapRange(args.range);
        if (!args.skipChecking) { this.mergedRange(args); }
        if (!args.merge || args.type === 'All') {
            this.mergeAll(args); if (args.refreshRibbon) { this.parent.notify(activeCellChanged, null); }
        } else if (args.type === 'Horizontally') {
            this.mergeHorizontally(args);
        } else if (args.type === 'Vertically') {
            this.mergeVertically(args);
        }
        this.parent.setUsedRange(args.range[2], args.range[3]);
        if (args.isAction) { this.parent.notify('actionComplete', { eventArgs: args, action: 'merge' }); }
        if (args.sheetIndex === this.parent.activeSheetIndex) {
            this.parent.notify('selectRange', { address: getSheet(this.parent, args.sheetIndex).selectedRange, skipChecking: true });
            if (this.parent.chartColl && this.parent.chartColl.length) {
                this.parent.notify(refreshChart, { range: args.range });
            }
        }
    }
    private mergeAll(args: MergeArgs): void {
        let rowSpan: number = 0; let cell: CellModel; args.range = args.range as number[]; let colSpan: number;
        let value: string; let curCell: CellModel;
        const sheet: SheetModel = isUndefined(args.sheetIndex) ? this.parent.getActiveSheet() : getSheet(this.parent, args.sheetIndex);
        let refreshAllCF: boolean;
        for (let i: number = args.range[0]; i <= args.range[2]; i++) {
            colSpan = 0; if (args.isAction) { args.model.push({ cells: [] }); }
            for (let j: number = args.range[1]; j <= args.range[3]; j++) {
                cell = getCell(i, j, sheet);
                if (cell && (cell.value || cell.formula) && !value) { value = cell.formula || cell.value; }
                if (args.isAction && args.merge) {
                    args.model[i - args.range[0]].cells[j - args.range[1]] = {};
                    extend(args.model[i - args.range[0]].cells[j - args.range[1]], cell, null, true);
                }
                if (sheet.rows[i as number] && sheet.rows[i as number].cells && sheet.rows[i as number].cells[j as number]) {
                    delete sheet.rows[i as number].cells[j as number].rowSpan; delete sheet.rows[i as number].cells[j as number].colSpan;
                    if (!args.merge && !args.isAction && args.model && args.model[i - args.range[0]] && args.model[i - args.range[0]].
                        cells[j - args.range[1]] && args.model[i - args.range[0]].cells[j - args.range[1]] !== {}) {
                        setCell(i, j, sheet, args.model[i - args.range[0]].cells[j - args.range[1]]);
                    }
                }
                if (args.merge) {
                    cell = new Object();
                    if (i === args.range[0] && j === args.range[1]) {
                        if (args.range[3] - args.range[1] > 0) { cell.colSpan = (args.range[3] - args.range[1]) + 1; }
                        if (args.range[2] - args.range[0] > 0) { cell.rowSpan = (args.range[2] - args.range[0]) + 1; }
                        setCell(args.range[0], args.range[1], sheet, cell, true);
                        continue;
                    } else {
                        if (i !== args.range[0]) { cell.rowSpan = -rowSpan; }
                        if (j !== args.range[1]) { colSpan++; cell.colSpan = -colSpan; }
                        if (sheet.rows[i as number] && sheet.rows[i as number].cells && sheet.rows[i as number].cells[j as number]) {
                            delete sheet.rows[i as number].cells[j as number].value;
                            delete sheet.rows[i as number].cells[j as number].formula;
                        }
                        curCell = getCell(i, j, sheet) || {};
                        setCell(i, j, sheet, Object.assign(cell, curCell));
                    }
                }
                if (!args.preventRefresh) {
                    this.parent.notify(applyMerge, { rowIdx: i, colIdx: j });
                    refreshAllCF = this.isFormulaDependent(sheet, i, j, refreshAllCF);
                }
            }
            rowSpan++;
        }
        if (args.merge) {
            cell = this.getCellValue(args.range[0], args.range[1], value, sheet);
            setCell(args.range[0], args.range[1], sheet, cell, true);
            if (!args.preventRefresh) {
                this.parent.notify(applyMerge, { rowIdx: args.range[0], colIdx: args.range[1] });
                this.refreshCF(sheet, args.range[0], args.range[1], refreshAllCF);
            }
        }
    }
    private isFormulaDependent(sheet: SheetModel, rowIdx: number, colIdx: number, refreshAll: boolean): boolean {
        if (!refreshAll) {
            const eventArgs: { [key: string]: string | number | boolean } = { action: 'dependentCellsAvailable', sheetId: sheet.id.toString(),
                address: getCellAddress(rowIdx, colIdx) };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            return <boolean>eventArgs.isAvailable;
        }
        return refreshAll;
    }
    private refreshCF(sheet: SheetModel, rowIdx: number, colIdx: number, refreshAll: boolean): void {
        if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: [rowIdx, colIdx], refreshAll: refreshAll, isAction: true });
        }
    }
    private mergeHorizontally(args: MergeArgs): void {
        let mergeCount: number; args.range = args.range as number[]; let cell: CellModel;
        const sheet: SheetModel = getSheet(this.parent, args.sheetIndex);
        let newValue: string; let rowIdx: number; let curCell: CellModel; let refreshAllCF: boolean;
        for (let i: number = args.range[0]; i <= args.range[2]; i++) {
            mergeCount = 0;
            if (args.isAction) { args.model.push({ cells: [] }); }
            for (let j: number = args.range[1]; j <= args.range[3]; j++) {
                curCell = getCell(i, j, sheet);
                cell = new Object();
                if (args.isAction) {
                    args.model[i - args.range[0]].cells[j - args.range[1]] = {};
                    Object.assign(args.model[i - args.range[0]].cells[j - args.range[1]], curCell);
                }
                if (j === args.range[1]) {
                    if (i === args.range[0]) { continue; }
                    rowIdx = i - 1;
                    if (sheet.rows[rowIdx as number] && sheet.rows[rowIdx as number].cells &&
                        sheet.rows[rowIdx as number].cells[j as number]) {
                        delete sheet.rows[rowIdx as number].cells[j as number].rowSpan;
                    }
                    cell = this.getCellValue(rowIdx, j, newValue, sheet);
                    if (args.range[3] - args.range[1] > 0) { cell.colSpan = (args.range[3] - args.range[1]) + 1; }
                    newValue = null;
                    setCell(rowIdx, j, sheet, cell, true);
                } else {
                    if (curCell && (curCell.value || curCell.formula) && !newValue) { newValue = curCell.formula || curCell.value; }
                    rowIdx = i;
                    if (sheet.rows[rowIdx as number] && sheet.rows[rowIdx as number].cells &&
                        sheet.rows[rowIdx as number].cells[j as number]) {
                        delete sheet.rows[rowIdx as number].cells[j as number].rowSpan;
                        delete sheet.rows[rowIdx as number].cells[j as number].value;
                        delete sheet.rows[rowIdx as number].cells[j as number].formula;
                    }
                    mergeCount++; cell.colSpan = -mergeCount;
                    setCell(rowIdx, j, sheet, cell, true);
                }
                this.parent.notify(applyMerge, { rowIdx: rowIdx, colIdx: j });
                refreshAllCF = this.isFormulaDependent(sheet, rowIdx, j, refreshAllCF);
            }
        }
        if (sheet.rows[args.range[2]] && sheet.rows[args.range[2]].cells && sheet.rows[args.range[2]].cells[args.range[1]]) {
            delete sheet.rows[args.range[2]].cells[args.range[1]].rowSpan;
        }
        cell = this.getCellValue(args.range[2], args.range[1], newValue, sheet);
        if (args.range[3] - args.range[1] > 0) { cell.colSpan = (args.range[3] - args.range[1]) + 1; }
        setCell(args.range[2], args.range[1], sheet, cell, true);
        this.parent.notify(applyMerge, { rowIdx: args.range[2], colIdx: args.range[1] });
        this.refreshCF(sheet, args.range[2], args.range[1], refreshAllCF);
    }
    private getCellValue(rowIdx: number, colIdx: number, value: string, sheet: SheetModel): CellModel {
        const cell: CellModel = new Object(); const curCell: CellModel = getCell(rowIdx, colIdx, sheet);
        if (value && (!curCell || (!curCell.value && !curCell.formula))) {
            if (checkIsFormula(value)) {
                cell.formula = value;
            } else {
                cell.value = value;
            }
        }
        return cell;
    }
    private mergeVertically(args: MergeArgs): void {
        let rowSpan: number = 0; args.range = args.range as number[];
        const sheet: SheetModel = getSheet(this.parent, args.sheetIndex);
        let cell: CellModel; let newValue: string; let colIdx: number; let curCell: CellModel; let refreshAllCF: boolean;
        for (let i: number = args.range[1]; i <= args.range[3]; i++) {
            for (let j: number = args.range[0]; j <= args.range[2]; j++) {
                curCell = getCell(j, i, sheet);
                if (args.isAction) {
                    if (args.model[j - args.range[0]] === undefined) { args.model[j - args.range[0]] = { cells: [] }; }
                    args.model[j - args.range[0]].cells[i - args.range[1]] = {};
                    Object.assign(args.model[j - args.range[0]].cells[i - args.range[1]], curCell);
                }
                if (j === args.range[0]) {
                    rowSpan = 0;
                    if (i === args.range[1]) { continue; } colIdx = i - 1;
                    if (sheet.rows[j as number] && sheet.rows[j as number].cells && sheet.rows[j as number].cells[colIdx as number]) {
                        delete sheet.rows[j as number].cells[colIdx as number].colSpan;
                    }
                    cell = this.getCellValue(j, colIdx, newValue, sheet);
                    if (args.range[2] - args.range[0] > 0) { cell.rowSpan = (args.range[2] - args.range[0]) + 1; }
                    newValue = null;
                    setCell(j, colIdx, sheet, cell, true);
                } else {
                    cell = new Object();
                    if (curCell && (curCell.value || curCell.formula) && !newValue) { newValue = curCell.formula || curCell.value; }
                    rowSpan++; colIdx = i;
                    if (sheet.rows[j as number] && sheet.rows[j as number].cells && sheet.rows[j as number].cells[colIdx as number]) {
                        delete sheet.rows[j as number].cells[colIdx as number].colSpan;
                        delete sheet.rows[j as number].cells[colIdx as number].value;
                        delete sheet.rows[j as number].cells[colIdx as number].formula;
                    }
                    cell.rowSpan = -rowSpan;
                    setCell(j, colIdx, sheet, cell, true);
                }
                this.parent.notify(applyMerge, { rowIdx: j, colIdx: colIdx });
                refreshAllCF = this.isFormulaDependent(sheet, i, colIdx, refreshAllCF);
            }
        }
        if (sheet.rows[args.range[0]] && sheet.rows[args.range[0]].cells && sheet.rows[args.range[0]].cells[args.range[3]]) {
            delete sheet.rows[args.range[0]].cells[args.range[3]].colSpan;
        }
        cell = this.getCellValue(args.range[0], args.range[1], newValue, sheet);
        if (args.range[2] - args.range[0] > 0) { cell.rowSpan = (args.range[2] - args.range[0]) + 1; }
        setCell(args.range[0], args.range[3], sheet, cell, true);
        this.parent.notify(applyMerge, { rowIdx: args.range[0], colIdx: args.range[3] });
        this.refreshCF(sheet, args.range[0], args.range[3], refreshAllCF);
    }
    private activeCellRange(args: MergeArgs): void {
        args.range = args.range as number[];
        const sheet: SheetModel = this.parent.getActiveSheet();
        let cell: CellModel = getCell(args.range[0], args.range[1], sheet);
        if (cell) {
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                args.range[0] += cell.rowSpan;
                if (args.insertCount) {  args.range[0] -= args.insertCount; }
            }
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                args.range[1] += cell.colSpan;
                if (args.insertCount) {  args.range[1] -= args.insertCount; }
            }
            cell = getCell(args.range[0], args.range[1], sheet);
            if (cell) {
                if (cell.rowSpan > 1 && (args.range[0] + (cell.rowSpan - 1) >= args.range[2] || args.insertCount)) {
                    args.range[2] = args.range[0] + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && (args.range[1] + (cell.colSpan - 1) >= args.range[3] || args.insertCount)) {
                    args.range[3] = args.range[1] + (cell.colSpan - 1);
                }
            }
        }
    }
    private mergedRange(args: MergeArgs): void {
        if (typeof(args.range) === 'string') { args.range = getRangeIndexes(args.range); }
        if (args.range[0] <= args.range[2] && args.range[1] <= args.range[3]) {
            this.forward(args);
        } else if (args.range[0] >= args.range[2] && args.range[1] >= args.range[3]) {
            this.reverse(args);
        } else if (args.range[0] < args.range[2] && args.range[1] > args.range[3]) {
            this.forwardReverse(args);
        } else if (args.range[0] > args.range[2] && args.range[1] < args.range[3]) {
            this.reverseForward(args);
        }
    }
    private forward(args: MergeArgs): void {
        args.range = args.range as number[];
        const sheet: SheetModel = isUndefined(args.sheetIndex) ? this.parent.getActiveSheet() : getSheet(this.parent, args.sheetIndex);
        let cell: CellModel = getCell(args.range[0], args.range[1], sheet); let endRowIdx: number; let endColIdx: number;
        let rowIdx: number = endRowIdx = args.range[0]; let colIdx: number = endColIdx = args.range[1];
        if (cell) {
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rowIdx = endRowIdx = args.range[0] + cell.rowSpan;
            }
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                colIdx = endColIdx = args.range[1] + cell.colSpan;
            }
            cell = getCell(rowIdx, colIdx, sheet);
            if (cell) {
                if (cell.rowSpan > 1) {
                    endRowIdx += (cell.rowSpan - 1);
                    if (rowIdx + (cell.rowSpan - 1) >= args.range[2]) {
                        args.range[2] = args.range[0]; args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                }
                if (cell.colSpan > 1) {
                    endColIdx += (cell.colSpan - 1);
                    if (colIdx + (cell.colSpan - 1) >= args.range[3]) {
                        args.range[3] = args.range[1]; args.range[3] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        args.range[0] = rowIdx; args.range[1] = colIdx;
        if (args.range[0] === rowIdx && args.range[1] === colIdx && args.range[2] === endRowIdx && args.range[3] === endColIdx) {
            args.isActiveCell = true;
        }
        if (args.skipChecking) { return; }
        for (let i: number = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                rowIdx = args.range[2]; colIdx = i;
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[1]) { args.range[1] = colIdx; }
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[0]) { args.range[0] = rowIdx; }
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[3]) {
                        args.range[3] = colIdx; args.range[3] = colIdx + (cell.colSpan - 1);
                    }
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = rowIdx; args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                }
            }
        }
        let startRowIdx: number; let startColIdx: number;
        for (let i: number = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                startColIdx = i; startRowIdx = args.range[0];
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    startColIdx += cell.colSpan; if (startColIdx < args.range[1]) { args.range[1] = startColIdx; }
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    startRowIdx += cell.rowSpan; if (startRowIdx < args.range[0]) { args.range[0] = startRowIdx; }
                }
            }
        }
        for (let i: number = args.range[0]; i <= args.range[2]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                rowIdx = i; colIdx = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[0]) { args.range[0] = rowIdx; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[1]) { args.range[1] = colIdx; }
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = rowIdx; args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[3]) {
                        args.range[3] = colIdx; args.range[3] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
    }
    private forwardReverse(args: MergeArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        args.range = args.range as number[];
        let colIndex: number = args.range[1];
        let cell: CellModel = getCell(args.range[0], args.range[1], sheet);
        let rowIndex: number = args.range[0];
        if (cell) {
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                colIndex += cell.colSpan; if (args.range[3] >= colIndex) { args.range[3] = colIndex; }
            }
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rowIndex += cell.rowSpan; if (rowIndex < args.range[0]) { args.range[0] = rowIndex; }
            }
            cell = getCell(rowIndex, colIndex, sheet);
            if (cell) {
                if (cell.rowSpan > 1 && rowIndex + (cell.rowSpan - 1) >= args.range[2]) {
                    args.range[2] = rowIndex + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && colIndex + (cell.colSpan - 1) >= args.range[1]) {
                    args.range[1] = colIndex + (cell.colSpan - 1);
                }
            }
        }
        args.range[0] = rowIndex;
        if (args.skipChecking) { return; }
        let rowIdx: number; let cellIdx: number;
        for (let i: number = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                cellIdx = i; rowIdx = args.range[2];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[0]) { args.range[0] = rowIdx; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIdx += cell.colSpan;
                    if (cellIdx < args.range[3]) { args.range[3] = cellIdx; }
                }
                cell = getCell(rowIdx, cellIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && cellIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = cellIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        let startRowIndex: number;
        for (let i: number = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                cellIdx = i; startRowIndex = args.range[0];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    startRowIndex += cell.rowSpan;
                    if (startRowIndex < args.range[0]) { args.range[0] = startRowIndex; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) { cellIdx += cell.colSpan; }
                cell = getCell(startRowIndex, cellIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && startRowIndex + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = startRowIndex + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && cellIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = cellIdx; args.range[1] = cellIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        let colIdx: number;
        for (let i: number = args.range[0]; i <= args.range[2]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                startRowIndex = i; colIdx = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    startRowIndex += cell.rowSpan;
                    if (startRowIndex < args.range[0]) { args.range[0] = startRowIndex; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[3]) { args.range[3] = colIdx; }
                }
                cell = getCell(startRowIndex, colIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && startRowIndex + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = startRowIndex; args.range[2] = startRowIndex + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = colIdx; args.range[1] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
    }
    private reverse(args: MergeArgs): void {
        args.range = args.range as number[];
        let colnIdx: number = args.range[1];
        const sheet: SheetModel = isUndefined(args.sheetIndex) ? this.parent.getActiveSheet() : getSheet(this.parent, args.sheetIndex);
        let cell: CellModel = getCell(args.range[0], args.range[1], sheet);
        let rowIdx: number = args.range[0];
        if (cell) {
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) { colnIdx += cell.colSpan; }
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rowIdx += cell.rowSpan;
            }
            if (args.range[2] >= rowIdx) {
                args.range[2] = rowIdx;
                args.isActiveCell = true;
            }
            if (args.range[3] >= colnIdx) {
                args.range[3] = colnIdx;
                if (args.range[2] === rowIdx) { args.isActiveCell = true; }
            } else if (args.isActiveCell) {
                args.isActiveCell = false;
            }
            cell = getCell(rowIdx, colnIdx, sheet);
            if (cell) {
                if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) >= args.range[0]) {
                    args.range[0] = rowIdx; args.range[0] = rowIdx + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && colnIdx + (cell.colSpan - 1) >= args.range[1]) {
                    args.range[1] = colnIdx; args.range[1] = colnIdx + (cell.colSpan - 1);
                }
            }
        }
        let colIdx: number = args.range[3];
        if (args.skipChecking) { return; }
        for (let i: number = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                colIdx = i; rowIdx = args.range[2];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[2]) { args.range[2] = rowIdx; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[3]) { args.range[3] = colIdx; }
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = rowIdx; args.range[0] = rowIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = colIdx; args.range[1] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        colIdx = args.range[3];
        for (let i: number = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                colIdx = i; rowIdx = args.range[0];
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) { colIdx += cell.colSpan; }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) { rowIdx += cell.rowSpan; }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = colIdx; args.range[1] = colIdx + (cell.colSpan - 1);
                    }
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = rowIdx; args.range[0] = rowIdx + (cell.rowSpan - 1);
                    }
                }
            }
        }
        let cellIndex: number; let rIdx: number;
        for (let i: number = args.range[2]; i <= args.range[0]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                rIdx = i; cellIndex = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rIdx += cell.rowSpan;
                    if (rIdx < args.range[2]) { args.range[2] = rIdx; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIndex += cell.colSpan;
                    if (cellIndex < args.range[3]) { args.range[3] = cellIndex; }
                }
                cell = getCell(rIdx, cellIndex, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = rIdx; args.range[0] = rIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && cellIndex + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = cellIndex; args.range[1] = cellIndex + (cell.colSpan - 1);
                    }
                }
            }
        }
    }
    private reverseForward(args: MergeArgs): void {
        args.range = args.range as number[];
        const sheet: SheetModel = isUndefined(args.sheetIndex) ? this.parent.getActiveSheet() : getSheet(this.parent, args.sheetIndex);
        let rIdx: number = args.range[0]; let cIdx: number = args.range[1];
        let cell: CellModel = getCell(args.range[0], args.range[1], sheet);
        if (cell) {
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rIdx += cell.rowSpan;
                if (args.range[2] >= rIdx) { args.range[2] = rIdx; }
            }
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                cIdx += cell.colSpan;
            }
            cell = getCell(rIdx, cIdx, sheet);
            if (cell) {
                if (cell.rowSpan > 1 && rIdx + (cell.rowSpan - 1) >= args.range[0]) {
                    args.range[0] = rIdx; args.range[0] = rIdx + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && cIdx + (cell.colSpan - 1) >= args.range[3]) {
                    args.range[3] = args.range[1]; args.range[3] = cIdx + (cell.colSpan - 1);
                }
            }
        }
        if (args.skipChecking) { return; }
        let cIndex: number = args.range[3]; let rIndex: number;
        for (let i: number = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                rIndex = args.range[2]; cIndex = i;
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rIndex += cell.rowSpan;
                    if (rIndex < args.range[2]) { args.range[2] = rIndex; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cIndex += cell.colSpan;
                    if (cIndex < args.range[1]) { args.range[1] = cIndex; }
                }
                cell = getCell(rIndex, cIndex, sheet);
                if (cell) {
                    if (cell.colSpan > 1 && cIndex + (cell.colSpan - 1) > args.range[3]) {
                        args.range[3] = cIndex + (cell.colSpan - 1);
                    }
                    if (cell.rowSpan > 1 && (cell.rowSpan - 1) + rIndex > args.range[0]) { args.range[0] = (cell.rowSpan - 1) + rIndex; }
                }
            }
        }
        let sRowIdx: number; let sColIdx: number;
        for (let i: number = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                sColIdx = i; sRowIdx = args.range[0];
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    sColIdx += cell.colSpan; if (sColIdx < args.range[1]) { args.range[1] = sColIdx; }
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) { sRowIdx += cell.rowSpan; }
                cell = getCell(sRowIdx, sColIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && sRowIdx + (cell.rowSpan - 1) > args.range[0]) { args.range[0] = sRowIdx + (cell.rowSpan - 1); }
                }
            }
        }
        let cellIndex: number;
        for (let i: number = args.range[2]; i <= args.range[0]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                rIndex = i; cellIndex = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rIndex += cell.rowSpan;
                    if (rIndex < args.range[2]) { args.range[2] = rIndex; }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIndex += cell.colSpan; if (cellIndex < args.range[1]) { args.range[1] = cellIndex; }
                }
                cell = getCell(rIndex, cellIndex, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && (cell.rowSpan - 1) + rIndex > args.range[0]) {
                        args.range[0] = (cell.rowSpan - 1) + rIndex;
                    }
                    if (cell.colSpan > 1 && (cell.colSpan - 1) + cellIndex > args.range[3]) {
                        args.range[3] = cellIndex; args.range[3] = (cell.colSpan - 1) + cellIndex;
                    }
                }
            }
        }
    }
    private insertHandler(args: MergeArgs): void {
        this.activeCellRange(args);
        args.range = args.range as number[];
        if (args.insertModel === 'Row') {
            args.range[2] += args.insertCount;
        } else {
            args.range[3] += args.insertCount;
        }
        args.preventRefresh = true; args.merge = true;
        this.mergeAll(args);
    }
    private addEventListener(): void {
        this.parent.on(setMerge, this.merge, this);
        this.parent.on(mergedRange, this.mergedRange, this);
        this.parent.on(activeCellMergedRange, this.activeCellRange, this);
        this.parent.on(insertMerge, this.insertHandler, this);
    }
    /**
     * Destroy workbook merge module.
     *
     * @returns {void} - destroy the workbook merge module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setMerge, this.merge);
            this.parent.off(mergedRange, this.mergedRange);
            this.parent.off(activeCellMergedRange, this.activeCellRange);
            this.parent.off(insertMerge, this.insertHandler);
        }
    }
    /**
     * Get the workbook merge module name.
     *
     * @returns {string} - Return the string.
     */
    public getModuleName(): string {
        return 'workbookmerge';
    }
}
