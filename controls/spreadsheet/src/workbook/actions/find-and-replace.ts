import { Workbook, SheetModel, UsedRangeModel, RowModel, CellModel } from '../base/index';
import { getCellIndexes, FindOptions, FindNext, FindPrevious, getCellAddress, findNext, findPrevious, count,  } from '../common/index';
import { goto, replaceHandler, replaceAllHandler, showDialog, findUndoRedo, replaceAllDialog, ReplaceAllArgs } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { findAllValues, FindAllArgs, workBookeditAlert } from '../common/index';
/**
 * `WorkbookFindAndReplace` module is used to handle the search action in Spreadsheet.
 */

export class WorkbookFindAndReplace {
    private parent: Workbook;
    /**
     * Constructor for WorkbookFindAndReplace module.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the FindAndReplace module. 
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(findNext, this.findNext, this);
        this.parent.on(findPrevious, this.findPrevious, this);
        this.parent.on(replaceHandler, this.replace, this);
        this.parent.on(replaceAllHandler, this.replaceAll, this);
        this.parent.on(count, this.totalCount, this);
        this.parent.on(findAllValues, this.findAllValues, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(findNext, this.findNext);
            this.parent.off(findPrevious, this.findPrevious);
            this.parent.off(replaceHandler, this.replace);
            this.parent.off(replaceAllHandler, this.replaceAll);
            this.parent.off(count, this.totalCount);
            this.parent.off(findAllValues, this.findAllValues);
        }
    }

    private findNext(args: FindOptions): void {
        let sheets: SheetModel[] = this.parent.sheets; let val: string; let sheetIndex: number = args.sheetIndex;
        let sheet: SheetModel = sheets[this.parent.activeSheetIndex];
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        let usedRange: UsedRangeModel = sheet.usedRange; let endColumn: number = usedRange.colIndex;
        let stringValue: string = args.value.toString(); let cidx: number; let ridx: number;
        let count: number = 0; let endRow: number = usedRange.rowIndex;
        let loopCount: number = 0; let cellFormat: string; let valueOfCell: string;
        cidx = activecell[1]; ridx = activecell[0];
        let startColumn: number = cidx; let startRow: number = ridx;
        if (sheet.rows[ridx]) {
            if (sheet.rows[ridx].cells[cidx]) {
                cellFormat = sheet.rows[ridx].cells[cidx].format;
                if (cellFormat) {
                    let dispTxt: string = this.parent.getDisplayText(sheet.rows[ridx].cells[cidx]);
                    valueOfCell = dispTxt.toString();
                } else {
                    valueOfCell = sheet.rows[ridx].cells[cidx].value.toString();
                }
            }
        }
        if (valueOfCell) {
            let lcValueOfCell: string = valueOfCell.toLowerCase();
            let ivalueOfCell: boolean = valueOfCell.indexOf(args.value) > -1;
            let lowerCaseIndex: boolean = lcValueOfCell.indexOf(args.value) > -1;
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
        let findNextArgs: FindNext = {
            rowIndex: ridx, colIndex: cidx, usedRange: usedRange, endRow: endRow, endColumn: endColumn, startRow: startRow,
            mode: args.mode, loopCount: loopCount, count: count, args: args, val: val, stringValue: stringValue,
            sheetIndex: this.parent.activeSheetIndex, startColumn: startColumn, sheets: sheets
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
        let sheetsLen: number = this.parent.sheets.length;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        if (findNextArgs.colIndex >= findNextArgs.usedRange.colIndex + 1) {
            findNextArgs.colIndex = 0;
            findNextArgs.rowIndex++;
        }
        for (findNextArgs.rowIndex; findNextArgs.rowIndex <= findNextArgs.endRow + 1; findNextArgs.rowIndex++) {
            if (findNextArgs.rowIndex > findNextArgs.endRow) {
                if (findNextArgs.mode === 'Workbook') {
                    let noCellfound: number = this.parent.activeSheetIndex;
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
                    if ((activecell[0] === 0 && activecell[1] === 0) ||
                        (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex)) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    } else if ((activecell[0] !== 0 && activecell[1] !== 0) || (activecell[0] !== 0 || activecell[1] !== 0)) {
                        findNextArgs.startColumn = 0; findNextArgs.startRow = 0; findNextArgs.endColumn = findNextArgs.usedRange.colIndex;
                        findNextArgs.endRow = activecell[0]; findNextArgs.rowIndex = findNextArgs.startRow;
                        findNextArgs.colIndex = findNextArgs.startColumn;
                        findNextArgs.loopCount++;
                    }
                }
            }
            if (findNextArgs.count > 0) {
                if (findNextArgs.usedRange.rowIndex < findNextArgs.rowIndex) {
                    findNextArgs.rowIndex = 0;
                    if (findNextArgs.rowIndex === 0) {
                        findNextArgs.colIndex = 0;
                    }
                }
            }
            if (sheet.rows[findNextArgs.rowIndex]) {
                let row: RowModel = sheet.rows[findNextArgs.rowIndex];
                for (findNextArgs.colIndex; findNextArgs.colIndex <= findNextArgs.endColumn; findNextArgs.colIndex++) {
                    if (row) {
                        if (row.cells[findNextArgs.colIndex]) {
                            let checkTrue: boolean = this.nextCommon(findNextArgs);
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
        let sheetsLen: number = this.parent.sheets.length;
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
                        if (sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex]) {
                            let checkTrue: boolean = this.nextCommon(findNextArgs);
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
        let sheet: SheetModel = findNextArgs.sheets[findNextArgs.sheetIndex];
        if (sheet.rows[findNextArgs.rowIndex]) {
            if (sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex]) {
                let cellType: CellModel = sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex];
                if (cellType) {
                    let cellval: string;
                    if (cellType.format) {
                        let displayTxt: string = this.parent.getDisplayText(sheet.rows[findNextArgs.rowIndex].
                            cells[findNextArgs.colIndex]);
                        cellval = displayTxt;
                    } else {
                        if (cellType.value) {
                        cellval = sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex].value.toString();
                        }
                    }
                    if (cellval) {
                    if (findNextArgs.args.isCSen && findNextArgs.args.isEMatch) {
                        if (cellval === findNextArgs.stringValue) {
                            let address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    } else if (findNextArgs.args.isCSen && !findNextArgs.args.isEMatch) {
                        let index: boolean = cellval.indexOf(findNextArgs.args.value) > -1;
                        if ((cellval === findNextArgs.stringValue) || (index)) {
                            let address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    } else if (!findNextArgs.args.isCSen && findNextArgs.args.isEMatch) {
                        findNextArgs.val = cellval.toString().toLowerCase();
                        if (findNextArgs.val === findNextArgs.stringValue) {
                            let address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    } else if (!findNextArgs.args.isCSen && !findNextArgs.args.isEMatch) {
                        findNextArgs.val = cellval.toString().toLowerCase();
                        let index: boolean = cellval.indexOf(findNextArgs.args.value) > -1;
                        let lowerCaseIndex: boolean = findNextArgs.val.indexOf(findNextArgs.args.value) > -1;
                        if ((findNextArgs.val === findNextArgs.stringValue) || ((cellval === findNextArgs.stringValue) || (index)) ||
                            (cellval === findNextArgs.stringValue) || (lowerCaseIndex)) {
                            let address: string = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    }
                }
                }
            }
        }
        return false;
    }

    private findPrevious(args: FindOptions): void {
        let sheets: SheetModel[] = this.parent.sheets; let sheetIndex: number = args.sheetIndex;
        let sheet: SheetModel = sheets[sheetIndex]; let valueOfCell: string; let cellFormat: string; let val: string;
        let activecell: number[] = getCellIndexes(sheet.activeCell); let loopCount: number = 0; let count: number = 0;
        let endRow: number = sheet.usedRange.rowIndex;
        let endColumn: number = sheet.usedRange.colIndex;
        let stringValue: string = args.value.toString(); let cidx: number = activecell[1]; let ridx: number = activecell[0];
        let startColumn: number = cidx; let startRow: number = ridx;
        if (sheet.rows[ridx]) {
            if (sheet.rows[ridx].cells[cidx]) {
                cellFormat = sheet.rows[ridx].cells[cidx].format;
                if (cellFormat) {
                    let displayTxt: string = this.parent.getDisplayText(sheet.rows[ridx].cells[cidx]);
                    valueOfCell = displayTxt.toString();
                } else {
                    valueOfCell = sheet.rows[ridx].cells[cidx].value.toString();
                }
            }
        }
        if (valueOfCell) {
            let lcValue: string = valueOfCell.toLowerCase();
            let ivalue: boolean = valueOfCell.indexOf(args.value) > -1;
            let lowerCaseIndex: boolean = lcValue.indexOf(args.value) > -1;
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
        let findPrevArgs: FindPrevious = {
            rowIndex: ridx, colIndex: cidx, endRow: endRow, endColumn: endColumn, startRow: startRow,
            loopCount: loopCount, count: count, args: args, val: val, stringValue: stringValue,
            sheets: sheets, sheetIndex: sheetIndex, startColumn: startColumn,
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
        let sheetsLength: number = this.parent.sheets.length; let noValueBoolean: boolean = false;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        if (findPrevArgs.colIndex === -1) {
            findPrevArgs.colIndex = findPrevArgs.endColumn;
            findPrevArgs.rowIndex--;
        }
        for (findPrevArgs.rowIndex; findPrevArgs.rowIndex >= -1; findPrevArgs.rowIndex--) {
            if (findPrevArgs.rowIndex < 0 && findPrevArgs.colIndex < 0) {
                if (findPrevArgs.args.mode === 'Workbook') {
                    let noCellfound: number = this.parent.activeSheetIndex;
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
                if (sheet.rows[findPrevArgs.rowIndex]) {
                    if (findPrevArgs.colIndex === -1) {
                        findPrevArgs.colIndex = sheet.usedRange.colIndex;
                    }
                    for (findPrevArgs.colIndex; findPrevArgs.colIndex >= 0; findPrevArgs.colIndex--) {
                        if (sheet.rows[findPrevArgs.rowIndex]) {
                            if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                                let checkTrue: boolean = this.prevCommon(findPrevArgs);
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
        let sheetsLen: number = this.parent.sheets.length; let noValueBoolean: boolean = false;
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        for (findPrevArgs.colIndex; findPrevArgs.colIndex >= -1; findPrevArgs.colIndex--) {
            if (findPrevArgs.rowIndex < 0 && findPrevArgs.colIndex < 0) {
                if (findPrevArgs.args.mode === 'Workbook') {
                    let noCellfound: number = this.parent.activeSheetIndex;
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
                if (sheet.rows[findPrevArgs.rowIndex]) {
                    if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                        if (findPrevArgs.rowIndex === -1) {
                            findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                        }
                    }
                }
                for (findPrevArgs.rowIndex; findPrevArgs.rowIndex >= 0; findPrevArgs.rowIndex--) {
                    if (sheet.rows[findPrevArgs.rowIndex]) {
                        if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                            let check: boolean = this.prevCommon(findPrevArgs);
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
        let sheet: SheetModel = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        let isTrue: boolean;
        if ((activecell[0] !== findPrevArgs.endRow && activecell[1] !== findPrevArgs.endColumn) ||
            (activecell[0] !== findPrevArgs.endRow || activecell[1] !== findPrevArgs.endColumn)) {
            findPrevArgs.startColumn = sheet.usedRange.colIndex;
            findPrevArgs.startRow = sheet.usedRange.rowIndex;
            findPrevArgs.endColumn = 0; findPrevArgs.endRow = activecell[0]; findPrevArgs.rowIndex = findPrevArgs.startRow;
            findPrevArgs.colIndex = findPrevArgs.startColumn; findPrevArgs.loopCount++;
            isTrue = false;
        } else if ((activecell[0] === sheet.usedRange.rowIndex && activecell[1] === sheet.usedRange.colIndex) ||
            (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex)) {
            this.parent.notify(showDialog, null);
            isTrue = true;
        }
        return isTrue;
    }
    private prevCommon(findPrevArgs: FindPrevious): boolean {
        let sheet: SheetModel = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        if (sheet.rows[findPrevArgs.rowIndex]) {
            if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                let cellType: CellModel = sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex];
                if (cellType) {
                    let cellvalue: string;
                    if (cellType.format) {
                        let displayTxt: string = this.parent.getDisplayText(sheet.rows[findPrevArgs.rowIndex]
                            .cells[findPrevArgs.colIndex]);
                        cellvalue = displayTxt;
                    } else {
                        if (cellType.value) {
                        cellvalue = sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex].value.toString();
                        }
                    }
                    if (cellvalue) {
                    if (findPrevArgs.args.isCSen && findPrevArgs.args.isEMatch) {
                        if (cellvalue === findPrevArgs.stringValue) {
                            let address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    } else if (findPrevArgs.args.isCSen && !findPrevArgs.args.isEMatch) {
                        let index: boolean = cellvalue.indexOf(findPrevArgs.args.value) > -1;
                        if ((cellvalue === findPrevArgs.stringValue) || (index)) {
                            let address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    } else if (!findPrevArgs.args.isCSen && findPrevArgs.args.isEMatch) {
                        findPrevArgs.val = cellvalue.toString().toLowerCase();
                        if (findPrevArgs.val === findPrevArgs.stringValue) {
                            let address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    } else if (!findPrevArgs.args.isCSen && !findPrevArgs.args.isEMatch) {
                        findPrevArgs.val = cellvalue.toString().toLowerCase();
                        let index: boolean = cellvalue.indexOf(findPrevArgs.args.value) > -1;
                        let lowerCaseIndex: boolean = findPrevArgs.val.indexOf(findPrevArgs.args.value) > -1;
                        if ((cellvalue === findPrevArgs.stringValue) || ((cellvalue === findPrevArgs.stringValue) ||
                            (index)) || (findPrevArgs.val === findPrevArgs.stringValue) || (lowerCaseIndex)) {
                            let address: string = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    }
                }
                }
            }
        }
        return false;
    }
    public replace(args: FindOptions): void {
        if (this.parent.getActiveSheet().isProtected) {
            this.parent.notify(workBookeditAlert, null);
            return;
        }
        let sheet: SheetModel = this.parent.getActiveSheet();
        let activecell: number[] = getCellIndexes(sheet.activeCell);
        let cellType: CellModel = sheet.rows[activecell[0]].cells[activecell[1]];
        let currentCell: string;
        let index: boolean;
        let lowerCaseIndex: boolean;
        let val: string;
        if (cellType && cellType.value) {
        currentCell = sheet.rows[activecell[0]].cells[activecell[1]].value.toString();
        index = currentCell.indexOf(args.value) > -1;
        lowerCaseIndex = currentCell.toLowerCase().indexOf(args.value) > -1;
        val = currentCell.toString().toLowerCase();
        }
        if ((currentCell !== args.value) && (!index) && (val !== args.value) && (!lowerCaseIndex)) {
            args.findOpt = 'next';
            this.findNext(args);
        }
        this.parent.getActiveSheet();
        let activecel: number[] = getCellIndexes(sheet.activeCell);
        let address: string = sheet.activeCell;
        let cell: CellModel = sheet.rows[activecel[0]].cells[activecel[1]];
        let cellFormat: string;
        if (cell) {
            cellFormat = cell.format;
        }
        let compareVal: string;
        let replaceAddress: string = sheet.name + '!' + getCellAddress(activecel[0], activecel[1]);
        if (cellFormat) {
            let dispTxt: string = this.parent.getDisplayText(sheet.rows[activecel[0]].cells[activecel[1]]);
            compareVal = dispTxt.toString();

        } else {
            if (cell && cell.value) {
            compareVal = cell.value.toString();
            }
        }
        if (compareVal) {
        let replaceAllCollection: ReplaceAllArgs = { undoRedoOpt: 'before', address: replaceAddress, compareVal: compareVal };
        this.parent.notify(findUndoRedo, replaceAllCollection);
        let lcValueOfCell: string = compareVal.toLowerCase();
        let ivalueOfCell: boolean = compareVal.indexOf(args.value) > -1;
        let caseInSensitive: boolean = lcValueOfCell.indexOf(args.value) > -1;
        if ((args.value === compareVal) || (args.value === lcValueOfCell)) {
            sheet.rows[activecel[0]].cells[activecel[1]].value = args.replaceValue;
            this.parent.updateCell(cell, address);
            let replaceAllCollection: ReplaceAllArgs = { address: replaceAddress, compareVal: args.replaceValue, undoRedoOpt: 'after' };
            this.parent.notify(findUndoRedo, replaceAllCollection);
        } else if (ivalueOfCell) {
            let newValue: string = compareVal.replace(args.value, args.replaceValue);
            sheet.rows[activecel[0]].cells[activecel[1]].value = newValue;
            this.parent.updateCell(cell, address);
            let replaceAllCollection: ReplaceAllArgs = { address: replaceAddress, compareVal: args.replaceValue, undoRedoOpt: 'after' };
            this.parent.notify(findUndoRedo, replaceAllCollection);
        } else if (caseInSensitive) {
            let regx: RegExp = new RegExp(
                args.value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
            let updateValue: string = compareVal.replace(regx, args.replaceValue);
            sheet.rows[activecel[0]].cells[activecel[1]].value = updateValue;
            this.parent.updateCell(cell, address);
            let replaceAllCollection: ReplaceAllArgs = { address: replaceAddress, compareVal: args.replaceValue, undoRedoOpt: 'after' };
            this.parent.notify(findUndoRedo, replaceAllCollection);
        }
    }
}
    public replaceAll(args: FindOptions): void {
        let startSheet: number = 0; let sheet: SheetModel = this.parent.sheets[startSheet];
        let endRow: number = sheet.usedRange.rowIndex; let count: number = 0; let undoRedoOpt: string = 'beforeReplaceAll';
        let startRow: number = 0; let endColumn: number = sheet.usedRange.colIndex; let startColumn: number = 0;
        let addressCollection: string[] = [];
        let address: string ;
        for (startRow; startRow <= endRow; startRow++) {
            if (startColumn > endColumn && startRow === endRow) {
                if (args.mode === 'Workbook') {
                    startSheet++; sheet = this.parent.sheets[startSheet];
                    if (sheet) {
                        startColumn = 0; startRow = 0; endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex; sheet = sheet;
                    }
                }
            }
            if (sheet) {
                if (sheet.rows[startRow]) {
                    let row: RowModel = sheet.rows[startRow];
                    if (startColumn === endColumn + 1) {
                        startColumn = 0;
                    }
                    for (startColumn; startColumn <= endColumn; startColumn++) {
                        let cell: CellModel = sheet.rows[startRow].cells[startColumn];
                        if (row) {
                            if (row.cells[startColumn]) {
                                let cellType: CellModel = sheet.rows[startRow].cells[startColumn];
                                if (cellType) {
                                    let cellTypeVal: string = cellType.format; let cellval: string;
                                    if (cellTypeVal) {
                                        let displayTxt: string = this.parent.getDisplayText(sheet.rows[startRow].
                                            cells[startColumn]);
                                        cellval = displayTxt.toString();
                                    } else {
                                        if (cellType.value) {
                                        cellval = cellType.value.toString();
                                        }
                                    }
                                    if (cellval) {
                                    if (args.isCSen && args.isEMatch) {
                                        if (cellval === args.value) {
                                            cellType.value = args.replaceValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    } else if (args.isCSen && !args.isEMatch) {
                                        let index: boolean = cellval.indexOf(args.value) > -1;
                                        if ((cellval === args.value) || (index)) {
                                            let newValue: string = cellval.replace(args.value, args.replaceValue);
                                            cellType.value = newValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    } else if (!args.isCSen && args.isEMatch) {
                                        let val: string = cellval.toString().toLowerCase();
                                        if (val === args.value) {
                                            cellType.value = args.replaceValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    } else if (!args.isCSen && !args.isEMatch) {
                                        let val: string = cellval.toString().toLowerCase();
                                        let index: boolean = cellval.indexOf(args.value) > -1;
                                        let lowerCaseValue: boolean = val.indexOf(args.value) > -1;
                                        if (((cellval === args.value) || (index)) || (val === args.value) || (cellval === args.value) ||
                                            (lowerCaseValue)) {
                                            let regExepression: RegExp = new RegExp(
                                                args.value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
                                            let newValue: string = cellval.replace(regExepression, args.replaceValue);
                                            cellType.value = newValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
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
        }
        let countNumber: number = count;
        this.parent.notify(replaceAllDialog, { count: countNumber, replaceValue: args.replaceValue });
    }
    private totalCount(args: FindOptions): void {
        let startSheet: number = 0; let sheet: SheetModel = this.parent.sheets[startSheet];
        let endRow: number = sheet.usedRange.rowIndex; let count: number = 0;
        let rowIndex: number = 0; let endColumn: number = sheet.usedRange.colIndex; let columnIndex: number = 0;
        for (rowIndex; rowIndex <= endRow; rowIndex++) {
            if (sheet.rows[rowIndex]) {
                let row: RowModel = sheet.rows[rowIndex];
                if (columnIndex === endColumn + 1) {
                    columnIndex = 0;
                }
                for (columnIndex; columnIndex <= endColumn; columnIndex++) {
                    if (row) {
                        if (row.cells[columnIndex]) {
                            let cellType: CellModel = sheet.rows[rowIndex].cells[columnIndex];
                            if (cellType) {
                                let cellFormat: string = cellType.format;
                                let cellvalue: string;
                                if (cellFormat) {
                                    let displayTxt: string = this.parent.getDisplayText(sheet.rows[rowIndex].
                                        cells[columnIndex]);
                                    cellvalue = displayTxt.toString();
                                } else {
                                    if (cellType.value) {
                                        cellvalue = cellType.value.toString();
                                    }
                                }
                                if (cellvalue) {
                                if (args.isCSen && args.isEMatch) {
                                    if (cellvalue === args.value) {
                                        count++;
                                    }
                                } else if (args.isCSen && !args.isEMatch) {
                                    let index: boolean = cellvalue.indexOf(args.value) > -1;
                                    if ((cellvalue === args.value) || (index)) {
                                        count++;
                                    }
                                } else if (!args.isCSen && args.isEMatch) {
                                    let val: string = cellvalue.toString().toLowerCase();
                                    if (val === args.value) {
                                        count++;
                                    }
                                } else if (!args.isCSen && !args.isEMatch) {
                                    let val: string = cellvalue.toString().toLowerCase();
                                    let index: boolean = cellvalue.indexOf(args.value) > -1;
                                    let lowerCaseValue: boolean = val.indexOf(args.value) > -1;
                                    if ((val === args.value) || ((cellvalue === args.value) || (index)) || (cellvalue === args.value) ||
                                        (lowerCaseValue)) {
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
        let totalCount: number = count;
        let requiredCount: number = this.requiredCount(args) - 1;
        count = totalCount - requiredCount;
        args.findCount = count + ' ' + 'of' + ' ' + totalCount;
        return;
    }
    private requiredCount(args: FindOptions): number {
        let sheetIndex: number = this.parent.activeSheetIndex;
        let sheet: SheetModel = this.parent.sheets[sheetIndex]; let activecel: number[] = getCellIndexes(sheet.activeCell);
        let endRow: number = sheet.usedRange.rowIndex; let requiredCount: number = 0;
        let startRow: number = activecel[0]; let endColumn: number = sheet.usedRange.colIndex;
        let startColumn: number = activecel[1];
        for (startRow; startRow <= endRow; startRow++) {
            if (sheet.rows[startRow]) {
                let row: RowModel = sheet.rows[startRow];
                if (startColumn === endColumn + 1) {
                    startColumn = 0;
                }
                for (startColumn; startColumn <= endColumn; startColumn++) {
                    if (row) {
                        if (row.cells[startColumn]) {
                            let cell: CellModel = sheet.rows[startRow].cells[startColumn];
                            if (cell) {
                                let cellval: string;
                                if (cell.format) {
                                    let displayTxt: string = this.parent.getDisplayText(sheet.rows[startRow].
                                        cells[startColumn]);
                                    cellval = displayTxt.toString();
                                } else {
                                    if (cell.value) {
                                    cellval = cell.value.toString();
                                    }
                                }
                                if (cellval) {
                                if (args.isCSen && !args.isEMatch) {
                                    let index: boolean = cellval.indexOf(args.value) > -1;
                                    if ((cellval === args.value) || (index)) {
                                        requiredCount++;
                                    }
                                } else if (args.isCSen && args.isEMatch) {
                                    if (cellval === args.value) {
                                        requiredCount++;
                                    }
                                } else if (!args.isCSen && args.isEMatch) {
                                    let val: string = cellval.toString().toLowerCase();
                                    if (val === args.value) {
                                        requiredCount++;
                                    }
                                } else if (!args.isCSen && !args.isEMatch) {
                                    let val: string = cellval.toString().toLowerCase();
                                    let index: boolean = cellval.indexOf(args.value) > -1;
                                    let lowerCaseVal: boolean = val.indexOf(args.value) > -1;
                                    if ((cellval === args.value) || ((cellval === args.value) || (index)) || (val === args.value) ||
                                        (lowerCaseVal)) {
                                        requiredCount++;
                                    }
                                }
                            }
                            }
                        }
                    }
                }
            }
        }
        return requiredCount;
    }
    private findAllValues(findAllArguments: FindAllArgs): void {
        let startSheet: number = findAllArguments.sheetIndex; let sheet: SheetModel = this.parent.sheets[startSheet];
        let endRow: number = sheet.usedRange.rowIndex; let rowIndex: number = 0; let count: number = 0; let address: string;
        let endColumn: number = sheet.usedRange.colIndex; let columnIndex: number = 0; let sheetName: string;
        let sheetLength: number = this.parent.sheets.length; let initialSheet: number = findAllArguments.sheetIndex;
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
                        endRow = sheet.usedRange.rowIndex; sheet = sheet;
                    }
                }
            }
            if (!isNullOrUndefined(sheet)) {
                if (sheet.rows[rowIndex]) {
                    let row: RowModel = sheet.rows[rowIndex];
                    if (columnIndex === endColumn + 2) {
                        columnIndex = 0;
                    }
                    for (columnIndex; columnIndex <= endColumn + 1; columnIndex++) {
                        if (row) {
                            if (row.cells[columnIndex]) {
                                let cell: CellModel = sheet.rows[rowIndex].cells[columnIndex];
                                if (cell) {
                                    let cellFormat: string = cell.format;
                                    let cellvalue: string;
                                    if (cellFormat) {
                                        let displayTxt: string = this.parent.getDisplayText(sheet.rows[rowIndex].
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
                                        let index: boolean = cellvalue.indexOf(findAllArguments.value) > -1;
                                        if ((cellvalue === findAllArguments.value) || (index)) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    } else if (!findAllArguments.isCSen && findAllArguments.isEMatch) {
                                        let val: string = cellvalue.toString().toLowerCase();
                                        if (val === findAllArguments.value) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    } else if (!findAllArguments.isCSen && !findAllArguments.isEMatch) {
                                        let val: string = cellvalue.toString().toLowerCase();
                                        let index: boolean = cellvalue.indexOf(findAllArguments.value) > -1;
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
     * @returns string
     */
    protected getModuleName(): string {
        return 'workbookfindAndReplace';
    }
}