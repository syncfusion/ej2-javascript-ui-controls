import { Workbook, SheetModel, UsedRangeModel, RowModel, CellModel, getCell, getSheet } from '../base/index';
import { getCellIndexes, FindOptions, FindNext, FindPrevious, getCellAddress, findNext, findPrevious, count, getRangeIndexes, getSheetIndexFromAddress } from '../common/index';
import { goto, replace, replaceAll, showDialog, replaceAllDialog, ReplaceAllEventArgs, ExtendedRowModel } from '../common/index';
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { findAllValues, FindAllArgs, workBookeditAlert, BeforeReplaceEventArgs, updateCell, beginAction } from '../common/index';
/**
 * `WorkbookFindAndReplace` module is used to handle the search action in Spreadsheet.
 */

export class WorkbookFindAndReplace {
    private parent: Workbook;
    /**
     * Constructor for WorkbookFindAndReplace module.
     *
     * @param {Workbook} parent - Specifies the workbook.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the FindAndReplace module.
     *
     * @returns {void} - To destroy the FindAndReplace module.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(findNext, this.findNext, this);
        this.parent.on(findPrevious, this.findPrevious, this);
        this.parent.on(replace, this.replace, this);
        this.parent.on(replaceAll, this.replaceAll, this);
        this.parent.on(count, this.totalCount, this);
        this.parent.on(findAllValues, this.findAllValues, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(findNext, this.findNext);
            this.parent.off(findPrevious, this.findPrevious);
            this.parent.off(replace, this.replace);
            this.parent.off(replaceAll, this.replaceAll);
            this.parent.off(count, this.totalCount);
            this.parent.off(findAllValues, this.findAllValues);
        }
    }

    private findNext(args: FindOptions): void {
        const sheets: SheetModel[] = this.parent.sheets; let val: string;
        const sheetIndex: number = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = sheets[sheetIndex];
        const activecell: number[] = getCellIndexes(sheet.activeCell);
        const usedRange: UsedRangeModel = sheet.usedRange; const endColumn: number = usedRange.colIndex;
        const stringValue: string = args.value.toString(); let cidx: number; let ridx: number;
        let count: number = 0; const endRow: number = usedRange.rowIndex;
        const loopCount: number = 0; let cellFormat: string; let valueOfCell: string;
        cidx = activecell[1]; ridx = activecell[0];
        const startColumn: number = cidx; const startRow: number = ridx;
        if (sheet.rows[ridx]) {
            if (sheet.rows[ridx].cells && sheet.rows[ridx].cells[cidx]) {
                cellFormat = sheet.rows[ridx].cells[cidx].format;
                if (cellFormat) {
                    const dispTxt: string = this.parent.getDisplayText(sheet.rows[ridx].cells[cidx]);
                    valueOfCell = dispTxt.toString();
                } else {
                    if (sheet.rows[ridx].cells[cidx].value) {
                        valueOfCell = sheet.rows[ridx].cells[cidx].value.toString();
                    }
                }
            }
        }
        if (valueOfCell) {
            const lcValueOfCell: string = valueOfCell.toLowerCase();
            const ivalueOfCell: boolean = valueOfCell.indexOf(args.value) > -1;
            const lowerCaseIndex: boolean = lcValueOfCell.indexOf(args.value.toString().toLowerCase()) > -1;
            if ((stringValue === valueOfCell) || (stringValue === lcValueOfCell) || (ivalueOfCell) || (lowerCaseIndex)) {
                if (args.searchBy === 'By Column') {
                    ridx++;
                } else {
                    cidx++;
                }
                count++;
            }
        }
        if (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex) {
            if (activecell[0] > sheet.usedRange.rowIndex && activecell[1] <= sheet.usedRange.colIndex) {
                ridx = 0;
                cidx = activecell[1];
            } else if (activecell[0] <= sheet.usedRange.rowIndex && activecell[1] > sheet.usedRange.colIndex) {
                ridx = activecell[0];
                cidx = 0;
            } else {
                ridx = 0;
                cidx = 0;
            }
        }
        const findNextArgs: FindNext = {
            rowIndex: ridx, colIndex: cidx, usedRange: usedRange, endRow: endRow, endColumn: endColumn, startRow: startRow,
            mode: args.mode, loopCount: loopCount, count: count, args: args, val: val, stringValue: stringValue,
            sheetIndex: sheetIndex, startColumn: startColumn, sheets: sheets
        };
        if (args.searchBy === 'By Row') {
            this.findNxtRow(findNextArgs);
        }
        if (args.searchBy === 'By Column') {
            this.findNxtCol(findNextArgs);
        }
    }
    private findNxtRow(findNextArgs: FindNext): void {
        let usedRange: UsedRangeModel; let sheet: SheetModel = findNextArgs.sheets[findNextArgs.sheetIndex];
        const sheetsLen: number = this.parent.sheets.length; usedRange = sheet.usedRange;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        if (findNextArgs.colIndex >= findNextArgs.usedRange.colIndex + 1) {
            findNextArgs.colIndex = 0;
            findNextArgs.rowIndex++;
        }
        for (findNextArgs.rowIndex; findNextArgs.rowIndex <= findNextArgs.endRow + 1; findNextArgs.rowIndex++) {
            if (findNextArgs.rowIndex > findNextArgs.endRow) {
                if (findNextArgs.mode === 'Workbook') {
                    const noCellfound: number = this.parent.activeSheetIndex;
                    findNextArgs.sheetIndex++;
                    if (sheetsLen === findNextArgs.sheetIndex) {
                        findNextArgs.sheetIndex = 0;
                    }
                    if (noCellfound === findNextArgs.sheetIndex) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
                    usedRange = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findNextArgs.rowIndex = 0; findNextArgs.colIndex = 0; findNextArgs.endColumn = usedRange.colIndex;
                    findNextArgs.endRow = usedRange.rowIndex;
                }
                if (findNextArgs.colIndex === 0 && findNextArgs.rowIndex > findNextArgs.endRow) {
                    if ((activecell[0] === 0 && activecell[1] === 0)) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    } else if ((activecell[0] !== 0 && activecell[1] !== 0) || (activecell[0] !== 0 || activecell[1] !== 0)) {
                        findNextArgs.startColumn = 0; findNextArgs.startRow = 0; findNextArgs.endColumn = usedRange.colIndex;
                        findNextArgs.endRow = activecell[0]; findNextArgs.rowIndex = findNextArgs.startRow;
                        findNextArgs.colIndex = findNextArgs.startColumn;
                        findNextArgs.loopCount++;
                    }
                }
            }
            if (findNextArgs.count > 0) {
                if (usedRange.rowIndex < findNextArgs.rowIndex) {
                    findNextArgs.rowIndex = 0;
                    if (findNextArgs.rowIndex === 0) {
                        findNextArgs.colIndex = 0;
                    }
                }
            }
            if (sheet.rows[findNextArgs.rowIndex]) {
                const row: RowModel = sheet.rows[findNextArgs.rowIndex];
                for (findNextArgs.colIndex; findNextArgs.colIndex <= findNextArgs.endColumn; findNextArgs.colIndex++) {
                    if (row) {
                        if (row.cells && row.cells[findNextArgs.colIndex]) {
                            const checkTrue: boolean = this.nextCommon(findNextArgs);
                            if (checkTrue) {
                                return;
                            }
                        }
                    }
                }
                if (findNextArgs.colIndex > findNextArgs.endColumn) {
                    findNextArgs.colIndex = 0;
                }
                if (findNextArgs.loopCount > 0) {
                    if (activecell[0] === findNextArgs.rowIndex) {
                        this.parent.notify(showDialog, null);
                        return;
                    }
                }
            }
        }
        if (findNextArgs.count === 0) {
            this.parent.notify(showDialog, null);
            return;
        }
    }
    private findNxtCol(findNextArgs: FindNext): void {
        let sheet: SheetModel = findNextArgs.sheets[findNextArgs.sheetIndex]; let noFound: number;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        const sheetsLen: number = this.parent.sheets.length;
        if (findNextArgs.rowIndex >= findNextArgs.usedRange.rowIndex) {
            findNextArgs.rowIndex = 0;
            findNextArgs.colIndex++;
        }
        for (findNextArgs.colIndex; findNextArgs.colIndex <= findNextArgs.usedRange.colIndex + 1; findNextArgs.colIndex++) {
            if (findNextArgs.colIndex >= findNextArgs.endColumn + 1) {
                if (findNextArgs.mode === 'Workbook') {
                    noFound = this.parent.activeSheetIndex;
                    findNextArgs.sheetIndex++;
                    if (sheetsLen === findNextArgs.sheetIndex) {
                        findNextArgs.sheetIndex = 0;
                    }
                    if (noFound === findNextArgs.sheetIndex) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
                    findNextArgs.usedRange = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findNextArgs.colIndex = 0; findNextArgs.rowIndex = 0; findNextArgs.endColumn = findNextArgs.usedRange.colIndex;
                    findNextArgs.endRow = findNextArgs.usedRange.rowIndex;
                }
            }
            if (findNextArgs.colIndex >= findNextArgs.endColumn + 1) {
                findNextArgs.colIndex = 0;
            }
            if (findNextArgs.rowIndex > findNextArgs.endRow && findNextArgs.colIndex === 0) {
                if ((activecell[0] === 0 && activecell[1] === 0) ||
                    (activecell[1] > sheet.usedRange.rowIndex || activecell[0] > sheet.usedRange.colIndex)) {
                    if (findNextArgs.count === 0) {
                        this.parent.notify(showDialog, null);
                        return;
                    }
                } else if ((activecell[1] !== 0 || activecell[0] !== 0) || (activecell[1] !== 0 && activecell[0] !== 0)) {
                    findNextArgs.startRow = 0; findNextArgs.startColumn = 0;
                    findNextArgs.endRow = activecell[0]; findNextArgs.endColumn = findNextArgs.usedRange.colIndex;
                    findNextArgs.colIndex = findNextArgs.startColumn; findNextArgs.rowIndex = findNextArgs.startRow;
                    findNextArgs.loopCount++;
                }
            }
            if (findNextArgs.count > 0) {
                if (findNextArgs.usedRange.colIndex + 1 < findNextArgs.colIndex) {
                    findNextArgs.colIndex = 0;
                    findNextArgs.rowIndex = 0;
                }
            }
            if (findNextArgs.rowIndex >= findNextArgs.endRow) {
                findNextArgs.rowIndex = 0;
            }
            if (findNextArgs.colIndex <= findNextArgs.usedRange.colIndex) {
                for (findNextArgs.rowIndex; findNextArgs.rowIndex <= findNextArgs.usedRange.rowIndex; findNextArgs.rowIndex++) {
                    if (sheet.rows[findNextArgs.rowIndex]) {
                        if (sheet.rows[findNextArgs.rowIndex].cells && sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex]) {
                            const checkTrue: boolean = this.nextCommon(findNextArgs);
                            if (checkTrue) {
                                return;
                            }
                        }
                    }
                }
                if (findNextArgs.loopCount > 0) {
                    if (activecell[1] === findNextArgs.colIndex) {
                        this.parent.notify(showDialog, null);
                        return;
                    }
                }
            }
        }
        if (findNextArgs.count === 0) {
            this.parent.notify(showDialog, null);
            return;
        }
    }
    private nextCommon(findNextArgs: FindNext): boolean {
        const sheet: SheetModel = findNextArgs.sheets[findNextArgs.sheetIndex];
        const row: ExtendedRowModel = sheet.rows[findNextArgs.rowIndex];
        if (row && (!row.isFiltered || !row.hidden)) {
            const rowCol: CellModel = row.cells[findNextArgs.colIndex];
            if (rowCol && rowCol.value) {
                if (sheet.isProtected && (rowCol.isLocked || rowCol.isLocked === undefined ) && sheet.protectSettings.selectUnLockedCells) {
                    return false;
                }
                const cellType: CellModel = row.cells[findNextArgs.colIndex];
                if (cellType) {
                    let cellval: string;
                    if (cellType.format) {
                        const displayTxt: string = this.parent.getDisplayText(row.cells[findNextArgs.colIndex]);
                        cellval = displayTxt;
                    } else {
                        cellval = row.cells[findNextArgs.colIndex].value.toString();
                    }
                    if (findNextArgs.args.isCSen && findNextArgs.args.isEMatch) {
                        if (cellval === findNextArgs.stringValue) {
                            const address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    } else if (findNextArgs.args.isCSen && !findNextArgs.args.isEMatch) {
                        const index: boolean = cellval.indexOf(findNextArgs.args.value) > -1;
                        if ((cellval === findNextArgs.stringValue) || (index)) {
                            const address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    } else if (!findNextArgs.args.isCSen && findNextArgs.args.isEMatch) {
                        findNextArgs.val = cellval.toString().toLowerCase();
                        if (findNextArgs.val === findNextArgs.stringValue) {
                            const address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    } else if (!findNextArgs.args.isCSen && !findNextArgs.args.isEMatch) {
                        findNextArgs.val = cellval.toString().toLowerCase();
                        const index: boolean = findNextArgs.val.indexOf(findNextArgs.args.value.toString().toLowerCase()) > -1;
                        const lowerCaseIndex: boolean = findNextArgs.val.indexOf(findNextArgs.args.value) > -1;
                        if ((findNextArgs.val === findNextArgs.stringValue) || ((cellval === findNextArgs.stringValue) || (index)) ||
                            (cellval === findNextArgs.stringValue) || (lowerCaseIndex)) {
                            const address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private findPrevious(args: FindOptions): void {
        const sheets: SheetModel[] = this.parent.sheets; const sheetIndex: number = args.sheetIndex;
        const sheet: SheetModel = sheets[sheetIndex]; let valueOfCell: string; let cellFormat: string; let val: string;
        const activecell: number[] = getCellIndexes(sheet.activeCell); const loopCount: number = 0; let count: number = 0;
        const endRow: number = sheet.usedRange.rowIndex;
        const endColumn: number = sheet.usedRange.colIndex;
        const stringValue: string = args.value.toString(); let cidx: number = activecell[1]; let ridx: number = activecell[0];
        const startColumn: number = cidx; const startRow: number = ridx;
        if (sheet.rows[ridx]) {
            if (sheet.rows[ridx].cells[cidx]) {
                cellFormat = sheet.rows[ridx].cells[cidx].format;
                if (cellFormat) {
                    const displayTxt: string = this.parent.getDisplayText(sheet.rows[ridx].cells[cidx]);
                    valueOfCell = displayTxt.toString();
                } else {
                    if (sheet.rows[ridx].cells[cidx].value) {
                        valueOfCell = sheet.rows[ridx].cells[cidx].value.toString();
                    }
                }
            }
        }
        if (valueOfCell) {
            const lcValue: string = valueOfCell.toLowerCase();
            const ivalue: boolean = valueOfCell.indexOf(args.value) > -1;
            const lowerCaseIndex: boolean = lcValue.indexOf(args.value.toString().toLowerCase()) > -1;
            if ((stringValue === valueOfCell) || (stringValue === lcValue) || (ivalue) || (lowerCaseIndex)) {
                if (args.searchBy === 'By Row') {
                    cidx--;
                }
                if (args.searchBy === 'By Column') {
                    ridx--;
                }
                count++;
            }
        }
        if (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex) {
            if (activecell[0] > sheet.usedRange.rowIndex && activecell[1] <= sheet.usedRange.colIndex) {
                ridx = sheet.usedRange.rowIndex;
                cidx = activecell[1];
            } else if (activecell[0] <= sheet.usedRange.rowIndex && activecell[1] > sheet.usedRange.colIndex) {
                ridx = activecell[0];
                cidx = sheet.usedRange.colIndex;
            } else {
                ridx = sheet.usedRange.rowIndex;
                cidx = sheet.usedRange.colIndex;
            }
        }
        const findPrevArgs: FindPrevious = {
            rowIndex: ridx, colIndex: cidx, endRow: endRow, endColumn: endColumn, startRow: startRow,
            loopCount: loopCount, count: count, args: args, val: val, stringValue: stringValue,
            sheets: sheets, sheetIndex: sheetIndex, startColumn: startColumn
        };
        if (args.searchBy === 'By Row') {
            this.findPreRow(findPrevArgs);
        }
        if (args.searchBy === 'By Column') {
            this.findPreCol(findPrevArgs);
        }

    }
    private findPreRow(findPrevArgs: FindPrevious): void {
        let usedRan: UsedRangeModel; let sheet: SheetModel = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        const sheetsLength: number = this.parent.sheets.length; let noValueBoolean: boolean = false;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        if (findPrevArgs.colIndex === -1) {
            findPrevArgs.colIndex = findPrevArgs.endColumn;
            findPrevArgs.rowIndex--;
        }
        for (findPrevArgs.rowIndex; findPrevArgs.rowIndex >= -1; findPrevArgs.rowIndex--) {
            if (findPrevArgs.rowIndex < 0 && findPrevArgs.colIndex <= 0) {
                if (findPrevArgs.args.mode === 'Workbook') {
                    const noCellfound: number = this.parent.activeSheetIndex;
                    findPrevArgs.sheetIndex--;
                    if (findPrevArgs.sheetIndex === -1) {
                        findPrevArgs.sheetIndex = sheetsLength - 1;
                    }
                    if (noCellfound === findPrevArgs.sheetIndex) {
                        if (findPrevArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }

                    sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
                    usedRan = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findPrevArgs.rowIndex = usedRan.rowIndex; findPrevArgs.colIndex = usedRan.colIndex; findPrevArgs.endColumn = 0;
                    findPrevArgs.endRow = 0;
                }
                noValueBoolean = this.commonCondition(findPrevArgs, activecell);
            }
            if (!noValueBoolean) {
                if (findPrevArgs.args.mode !== 'Workbook') {
                    if (findPrevArgs.count > 0) {
                        if (findPrevArgs.rowIndex === -1) {
                            findPrevArgs.rowIndex = findPrevArgs.endRow;
                        }
                    }
                }
                if (findPrevArgs.rowIndex === -1) {
                    findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                    findPrevArgs.colIndex = sheet.usedRange.colIndex;
                }
                const row: RowModel = sheet.rows[findPrevArgs.rowIndex];
                if (row) {
                    if (findPrevArgs.colIndex === -1) {
                        findPrevArgs.colIndex = sheet.usedRange.colIndex;
                    }
                    for (findPrevArgs.colIndex; findPrevArgs.colIndex >= 0; findPrevArgs.colIndex--) {
                        if (row) {
                            if (row.cells && row.cells[findPrevArgs.colIndex]) {
                                const checkTrue: boolean = this.prevCommon(findPrevArgs);
                                if (checkTrue) {
                                    return;
                                }
                            }
                        }
                    }
                    if (findPrevArgs.loopCount > 0) {
                        if (activecell[0] === findPrevArgs.rowIndex) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                }
            }

        }
        if (!noValueBoolean) {
            if (findPrevArgs.count === 0) {
                this.parent.notify(showDialog, null);
                return;
            }
        }
    }
    private findPreCol(findPrevArgs: FindPrevious): void {
        let usedRange: UsedRangeModel; let sheet: SheetModel = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        const sheetsLen: number = this.parent.sheets.length; let noValueBoolean: boolean = false;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        for (findPrevArgs.colIndex; findPrevArgs.colIndex >= -1; findPrevArgs.colIndex--) {
            if (findPrevArgs.rowIndex < 0 && findPrevArgs.colIndex <= 0) {
                if (findPrevArgs.args.mode === 'Workbook') {
                    const noCellfound: number = this.parent.activeSheetIndex;
                    findPrevArgs.sheetIndex--;
                    if (findPrevArgs.sheetIndex === -1) {
                        findPrevArgs.sheetIndex = sheetsLen - 1;
                    }
                    if (noCellfound === findPrevArgs.sheetIndex) {
                        if (findPrevArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
                    usedRange = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findPrevArgs.rowIndex = usedRange.rowIndex; findPrevArgs.colIndex = usedRange.colIndex; findPrevArgs.endColumn = 0;
                    findPrevArgs.endRow = 0;
                }
                noValueBoolean = this.commonCondition(findPrevArgs, activecell);
            }
            if (!noValueBoolean) {
                if (findPrevArgs.count > 0) {
                    if (findPrevArgs.colIndex < 0) {
                        findPrevArgs.colIndex = findPrevArgs.endColumn;
                    }
                }
                if (findPrevArgs.rowIndex < 0) {
                    findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                }
                if (findPrevArgs.colIndex < -1) {
                    findPrevArgs.colIndex = sheet.usedRange.colIndex;
                    findPrevArgs.rowIndex--;
                }
                const row: RowModel = sheet.rows[findPrevArgs.rowIndex];
                if (row) {
                    if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                        if (findPrevArgs.rowIndex === -1) {
                            findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                        }
                    }
                }
                for (findPrevArgs.rowIndex; findPrevArgs.rowIndex >= 0; findPrevArgs.rowIndex--) {
                    if (row) {
                        if (row.cells && row.cells[findPrevArgs.colIndex]) {
                            const check: boolean = this.prevCommon(findPrevArgs);
                            if (check) {
                                return;
                            }
                        }
                    }
                    if (findPrevArgs.loopCount > 0) {
                        if (activecell[1] === findPrevArgs.colIndex) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                }
            }

        }
        if (!noValueBoolean) {
            if (findPrevArgs.count === 0) {
                this.parent.notify(showDialog, null);
                return;
            }
        }
    }
    private commonCondition(findPrevArgs: FindPrevious, activecell: number[]): boolean {
        const sheet: SheetModel = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        let isTrue: boolean;
        if ((activecell[0] !== findPrevArgs.endRow && activecell[1] !== findPrevArgs.endColumn) ||
            (activecell[0] !== findPrevArgs.endRow || activecell[1] !== findPrevArgs.endColumn)) {
            findPrevArgs.startColumn = sheet.usedRange.colIndex;
            findPrevArgs.startRow = sheet.usedRange.rowIndex;
            findPrevArgs.endColumn = 0; findPrevArgs.endRow = activecell[0]; findPrevArgs.rowIndex = findPrevArgs.startRow;
            findPrevArgs.colIndex = findPrevArgs.startColumn; findPrevArgs.loopCount++;
            isTrue = false;
        } else if (((activecell[0] === sheet.usedRange.rowIndex && activecell[1] === sheet.usedRange.colIndex) ||
            (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex)) &&
            (activecell[0] !== 0 && activecell[1] !== 0)) {
            this.parent.notify(showDialog, null);
            isTrue = true;
        }
        return isTrue;
    }
    private prevCommon(findPrevArgs: FindPrevious): boolean {
        const sheet: SheetModel = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        const row: ExtendedRowModel = sheet.rows[findPrevArgs.rowIndex];
        if (row && (!row.isFiltered || !row.hidden)) {
            const rowCol: CellModel = row.cells[findPrevArgs.colIndex];
            if (rowCol && rowCol.value) {
                if (sheet.isProtected && ( rowCol.isLocked || rowCol.isLocked === undefined ) && sheet.protectSettings.selectUnLockedCells) {
                    return false;
                }
                const cellType: CellModel = row.cells[findPrevArgs.colIndex];
                if (cellType) {
                    let cellvalue: string;
                    if (cellType.format) {
                        const displayTxt: string = this.parent.getDisplayText(row.cells[findPrevArgs.colIndex]);
                        cellvalue = displayTxt;
                    } else {
                        cellvalue = row.cells[findPrevArgs.colIndex].value.toString();
                    }
                    if (findPrevArgs.args.isCSen && findPrevArgs.args.isEMatch) {
                        if (cellvalue === findPrevArgs.stringValue) {
                            const address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    } else if (findPrevArgs.args.isCSen && !findPrevArgs.args.isEMatch) {
                        const index: boolean = cellvalue.indexOf(findPrevArgs.args.value) > -1;
                        if ((cellvalue === findPrevArgs.stringValue) || (index)) {
                            const address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    } else if (!findPrevArgs.args.isCSen && findPrevArgs.args.isEMatch) {
                        findPrevArgs.val = cellvalue.toString().toLowerCase();
                        if (findPrevArgs.val === findPrevArgs.stringValue) {
                            const address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    } else if (!findPrevArgs.args.isCSen && !findPrevArgs.args.isEMatch) {
                        findPrevArgs.val = cellvalue.toString().toLowerCase();
                        const index: boolean = findPrevArgs.val.indexOf(findPrevArgs.args.value.toString().toLowerCase()) > -1;
                        const lowerCaseIndex: boolean = findPrevArgs.val.indexOf(findPrevArgs.args.value) > -1;
                        if ((cellvalue === findPrevArgs.stringValue) || ((cellvalue === findPrevArgs.stringValue) ||
                            (index)) || (findPrevArgs.val === findPrevArgs.stringValue) || (lowerCaseIndex)) {
                            const address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    public replace(args: FindOptions): void {
        const sheetIndex: number = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, args.sheetIndex);
        if (sheet.isProtected) {
            this.parent.notify(workBookeditAlert, null);
            return;
        }
        const address: string = (args as unknown as { address: string }).address;
        let activeCell: number[] = getRangeIndexes(address || sheet.activeCell);
        let compareVal: string = this.parent.getDisplayText(getCell(activeCell[0], activeCell[1], sheet, false, true)).toString();
        let checkValue: string;
        args.value = args.value.toString();
        if (!args.isCSen) {
            checkValue = args.value.toLowerCase();
        }
        let replacedValue: string = this.getReplaceValue(args, compareVal, checkValue);
        if (!replacedValue) {
            args.findOpt = 'next';
            this.findNext(args);
            activeCell = getCellIndexes(sheet.activeCell);
            compareVal = this.parent.getDisplayText(getCell(activeCell[0], activeCell[1], sheet)).toString();
            replacedValue = this.getReplaceValue(args, compareVal, checkValue);
            if (!replacedValue) {
                return;
            }
        }
        const eventArgs: BeforeReplaceEventArgs & { sheetIndex: number } = { address: `${sheet.name}!${getCellAddress(activeCell[0], activeCell[1])}`, cancel: false,
            compareValue: args.value, replaceValue: args.replaceValue, sheetIndex: sheetIndex };
        if (args.isAction) {
            this.parent.notify(beginAction, { action: 'beforeReplace', eventArgs: eventArgs });
            if (eventArgs.cancel) {
                return;
            }
            delete eventArgs.cancel;
        }
        updateCell(
            this.parent, sheet, { cell: { value: replacedValue }, rowIdx: activeCell[0], colIdx: activeCell[1], uiRefresh: true,
            valChange: true });
        if (args.isAction) {
            this.parent.notify('actionComplete', { action: 'replace', eventArgs: eventArgs });
        }
    }
    public replaceAll(args: FindOptions): void {
        let startSheet: number = args.mode === 'Sheet' ? args.sheetIndex : 0;
        let sheet: SheetModel = this.parent.sheets[startSheet];
        let endRow: number = sheet.usedRange.rowIndex;
        let startRow: number = 0; let endColumn: number = sheet.usedRange.colIndex; let startColumn: number = 0;
        const addressCollection: string[] = [];
        const triggerEvent: boolean = args.isAction;
        const eventArgs: ReplaceAllEventArgs & FindOptions = { addressCollection: addressCollection, cancel: false, ...args };
        const updateAsync: (cellValue: string, index: number) => void = (cellValue: string, index: number): void => {
            if (requestAnimationFrame) {
                requestAnimationFrame(() => {
                    if (!eventArgs.cancel && eventArgs.addressCollection[index]) {
                        const indexes: number[] = getCellIndexes(eventArgs.addressCollection[index].split('!')[1]);
                        const sheetIndex = getSheetIndexFromAddress(this.parent, eventArgs.addressCollection[index]);
                        updateCell(
                            this.parent, this.parent.sheets[sheetIndex], { cell: { value: cellValue }, rowIdx: indexes[0], colIdx: indexes[1], uiRefresh: true,
                            valChange: true });
                        if (index === eventArgs.addressCollection.length - 1 && triggerEvent) {
                            this.parent.notify('actionComplete', { action: 'replaceAll', eventArgs: eventArgs });
                        }
                    }
                });
            } else {
                this.parent.updateCell({ value: cellValue }, eventArgs.addressCollection[index]);
            }
        }
        let cellval: string; let row: RowModel; let regX: RegExp;
        for (startRow; startRow <= endRow + 1; startRow++) {
            if (startColumn > endColumn && startRow > endRow) {
                if (args.mode === 'Workbook') {
                    startSheet++; sheet = this.parent.sheets[startSheet];
                    if (sheet) {
                        startColumn = 0; startRow = 0; endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex;
                    } else {
                        break;
                    }
                }
            }
            row = sheet.rows[startRow];
            if (row) {
                if (startColumn === endColumn + 1) { startColumn = 0; }
                for (startColumn; startColumn <= endColumn; startColumn++) {
                    if (row) {
                        if (row.cells && row.cells[startColumn]) {
                            cellval = this.parent.getDisplayText(sheet.rows[startRow].cells[startColumn]).toString();
                            if (cellval) {
                                if (args.isCSen) {
                                    if (args.isEMatch) {
                                        if (cellval === args.value) {
                                            updateAsync(args.replaceValue, addressCollection.length);
                                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                                        }
                                    } else {
                                        if (cellval.indexOf(args.value) > -1) {
                                            updateAsync(cellval.replace(args.value, args.replaceValue), addressCollection.length);
                                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                                        }
                                    }
                                } else {
                                    if (args.isEMatch) {
                                        if (cellval.toLowerCase() === args.value) {
                                            updateAsync(args.replaceValue, addressCollection.length);
                                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                                        }
                                    } else {
                                        const val: string = cellval.toLowerCase();
                                        if ((cellval === args.value || val.indexOf(args.value.toString().toLowerCase()) > -1) || val ===
                                            args.value || cellval === args.value || val.indexOf(args.value) > -1) {
                                            regX = new RegExp(args.value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
                                            updateAsync(cellval.replace(regX, args.replaceValue), addressCollection.length);
                                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (addressCollection.length && triggerEvent) {
            this.parent.notify('actionBegin', { action: 'beforeReplaceAll', eventArgs: eventArgs });
            if (!eventArgs.cancel) {
                this.parent.notify(replaceAllDialog, { count: eventArgs.addressCollection.length, replaceValue: eventArgs.replaceValue });
            }
        } else {
            this.parent.notify(replaceAllDialog, { count: eventArgs.addressCollection.length, replaceValue: eventArgs.replaceValue });
        }
    }
    private getReplaceValue(args: FindOptions, cellval: string, checkValue: string): string {
        if (args.isCSen) {
            if (args.isEMatch) {
                return cellval === args.value && args.replaceValue;
            } else {
                return cellval.indexOf(args.value) > -1 && cellval.replace(args.value, args.replaceValue);
            }
        } else {
            if (args.isEMatch) {
                return cellval.toLowerCase() === checkValue && args.replaceValue;
            } else {
                return (cellval.toLowerCase().includes(checkValue)) &&
                    cellval.replace(new RegExp(args.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), args.replaceValue);
            }
        }
    }
    private totalCount(args: FindOptions): void {
        const sheet: SheetModel = this.parent.sheets[args.sheetIndex];
        const activeCell: number[] = getCellIndexes(sheet.activeCell);
        let count: number = 0;
        let requiredCount: number = 0;
        let cellValue: string;
        const findValue: string = args.value.toLowerCase();
        sheet.rows.filter((row: ExtendedRowModel, rowIdx: number) => row && row.cells && (!row.isFiltered || !row.hidden) &&
            row.cells.filter((cell: CellModel, colIdx: number) => {
                if (cell && (cell.value || <unknown>cell.value === 0)) {
                    cellValue = (cell.format ? this.parent.getDisplayText(cell) : cell.value.toString()).toLowerCase();
                    if (cellValue.includes(findValue)) {
                        count++;
                        if ((rowIdx === activeCell[0] && colIdx >= activeCell[1]) || rowIdx > activeCell[0]) {
                            requiredCount++;
                        }
                    }
                }
            }));
        requiredCount -= 1;
        const totalCount: number = count;
        count = totalCount - requiredCount;
        if (count > totalCount) {
            count = totalCount;
        }
        if (count !== 0 && !this.parent.getDisplayText(getCell(activeCell[0], activeCell[1], sheet)).toLowerCase().includes(findValue)) {
            count -= 1;
        }
        args.findCount = `${count} of ${totalCount}`;
    }
    private findAllValues(findAllArguments: FindAllArgs): void {
        let startSheet: number = findAllArguments.sheetIndex; let sheet: SheetModel = this.parent.sheets[startSheet];
        let endRow: number = sheet.usedRange.rowIndex; let rowIndex: number = 0; let count: number = 0; let address: string;
        let endColumn: number = sheet.usedRange.colIndex; let columnIndex: number = 0;
        const sheetLength: number = this.parent.sheets.length; const initialSheet: number = findAllArguments.sheetIndex;
        for (rowIndex; rowIndex <= endRow + 1; rowIndex++) {
            if ((initialSheet !== 1) && (findAllArguments.sheetIndex === sheetLength)) {
                startSheet = 1;
            }
            if (rowIndex > endRow && columnIndex > endColumn) {
                if (findAllArguments.mode === 'Workbook') {
                    startSheet++;
                    if (initialSheet === startSheet) {
                        if (count === 0) {
                            return;
                        }
                        return;
                    }
                    if (startSheet > sheetLength - 1) {
                        startSheet = 0;
                    }
                    sheet = this.parent.sheets[startSheet];
                    if (sheet) {
                        rowIndex = 0; columnIndex = 0; endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex;
                    }
                }
            }
            if (!isNullOrUndefined(sheet)) {
                if (sheet.rows[rowIndex]) {
                    const row: RowModel = sheet.rows[rowIndex];
                    if (columnIndex === endColumn + 2) {
                        columnIndex = 0;
                    }
                    for (columnIndex; columnIndex <= endColumn + 1; columnIndex++) {
                        if (row) {
                            if (row.cells && row.cells[columnIndex]) {
                                const cell: CellModel = sheet.rows[rowIndex].cells[columnIndex];
                                if (cell) {
                                    const cellFormat: string = cell.format;
                                    let cellvalue: string;
                                    if (cellFormat) {
                                        const displayTxt: string = this.parent.getDisplayText(sheet.rows[rowIndex].
                                            cells[columnIndex]);
                                        cellvalue = displayTxt.toString();
                                    } else {
                                        cellvalue = cell.value.toString();
                                    }
                                    if (findAllArguments.isCSen && findAllArguments.isEMatch) {
                                        if (cellvalue === findAllArguments.value) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    } else if (findAllArguments.isCSen && !findAllArguments.isEMatch) {
                                        const index: boolean = cellvalue.indexOf(findAllArguments.value) > -1;
                                        if ((cellvalue === findAllArguments.value) || (index)) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    } else if (!findAllArguments.isCSen && findAllArguments.isEMatch) {
                                        const val: string = cellvalue.toString().toLowerCase();
                                        if (val === findAllArguments.value) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    } else if (!findAllArguments.isCSen && !findAllArguments.isEMatch) {
                                        const val: string = cellvalue.toString().toLowerCase();
                                        const index: boolean = val.indexOf(findAllArguments.value.toLowerCase()) > -1;
                                        if ((val === findAllArguments.value) || ((cellvalue === findAllArguments.value) || (index)) ||
                                            ((cellvalue === findAllArguments.value))) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (count === 0) {
            return;
        }
        return;
    }
    /**
     * Gets the module name.
     *
     * @returns {string} - Return the string
     */
    protected getModuleName(): string {
        return 'workbookfindAndReplace';
    }
}
