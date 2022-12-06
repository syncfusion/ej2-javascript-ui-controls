import { Workbook, SheetModel, RowModel, CellModel, getCell, getSheet, isHiddenRow, isHiddenCol } from '../base/index';
import { getCellIndexes, FindOptions, getCellAddress, find, count, getRangeIndexes, getSheetIndexFromAddress, FindArgs } from '../common/index';
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
        this.parent.on(find, this.find, this);
        this.parent.on(replace, this.replace, this);
        this.parent.on(replaceAll, this.replaceAll, this);
        this.parent.on(count, this.totalCount, this);
        this.parent.on(findAllValues, this.findAllValues, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(find, this.find);
            this.parent.off(replace, this.replace);
            this.parent.off(replaceAll, this.replaceAll);
            this.parent.off(count, this.totalCount);
            this.parent.off(findAllValues, this.findAllValues);
        }
    }
    private find(args: FindOptions): void {
        const sheet: SheetModel = this.parent.sheets[args.sheetIndex];
        const activeCell: number[] = getRangeIndexes(sheet.activeCell);
        const findArgs: FindArgs = { startRow: activeCell[0], startCol: activeCell[1],
            findVal: args.isCSen ? args.value : args.value.toLowerCase(), activeCell: activeCell };
        if (args.searchBy === 'By Row' ? findArgs.startRow > sheet.usedRange.rowIndex : findArgs.startCol > sheet.usedRange.colIndex) {
            if (args.findOpt === 'next') {
                findArgs.startRow = findArgs.startCol = 0;
            } else {
                findArgs.startRow = sheet.usedRange.rowIndex;
                findArgs.startCol = sheet.usedRange.colIndex;
            }
        } else {
            if (args.searchBy === 'By Row') {
                if (findArgs.startCol > sheet.usedRange.colIndex) {
                    if (args.findOpt === 'next') {
                        findArgs.startRow++;
                        if (findArgs.startRow > sheet.usedRange.rowIndex) {
                            findArgs.startRow = 0;
                        }
                        findArgs.startCol = 0;
                    } else {
                        findArgs.startRow--;
                        if (findArgs.startRow < 0) {
                            findArgs.startRow = sheet.usedRange.rowIndex;
                        }
                        findArgs.startCol = sheet.usedRange.colIndex;
                    }
                }
            } else {
                if (findArgs.startRow > sheet.usedRange.rowIndex) {
                    if (args.findOpt === 'next') {
                        findArgs.startCol++;
                        if (findArgs.startCol > sheet.usedRange.colIndex) {
                            findArgs.startRow = 0;
                        }
                        findArgs.startRow = 0;
                    } else {
                        findArgs.startCol--;
                        if (findArgs.startCol < 0) {
                            findArgs.startCol = sheet.usedRange.colIndex;
                        }
                        findArgs.startRow = sheet.usedRange.colIndex;
                    }
                }
            }
        }
        if (args.mode === 'Workbook') {
            findArgs.sheets = this.parent.sheets;
            findArgs.sheetIdx = args.sheetIndex;
        } else {
            findArgs.sheets = [sheet];
            findArgs.sheetIdx = 0;
        }
        if (args.findOpt === 'next') {
            this.findNext(args, findArgs);
        } else {
            this.findPrevious(args, findArgs);
        }
    }
    private findNext(args: FindOptions, findArgs: FindArgs): void {
        const findOnSheet: Function = (startIdx: number, endIdx: number, initIteration?: boolean): string => {
            let sheet: SheetModel; let cellAddr: string;
            for (let sheetIdx: number = startIdx; sheetIdx <= endIdx; sheetIdx++) {
                sheet = findArgs.sheets[sheetIdx as number];
                if (sheetIdx === findArgs.sheetIdx) {
                    if (initIteration) {
                        cellAddr = this.findNextOnSheet(
                            args, findArgs.startRow, findArgs.startCol, findArgs.findVal, sheet, undefined, findArgs.activeCell);
                    } else {
                        cellAddr = this.findNextOnSheet(
                            args, 0, 0, findArgs.findVal, sheet, args.searchBy === 'By Row' ? findArgs.startRow : findArgs.startCol);
                    }
                } else {
                    cellAddr = this.findNextOnSheet(args, 0, 0, findArgs.findVal, sheet);
                }
                if (cellAddr) {
                    break;
                }
            }
            return cellAddr;
        };
        let cellAddr: string;
        cellAddr = findOnSheet(findArgs.sheetIdx, findArgs.sheets.length - 1, true);
        if (!cellAddr) {
            cellAddr = findOnSheet(0, findArgs.sheetIdx);
        }
        if (cellAddr) {
            this.parent.notify(goto, { address: cellAddr });
        } else {
            this.parent.notify(showDialog, null);
        }
    }
    private findNextOnSheet(
        args: FindOptions, startRow: number, startCol: number, findVal: string, sheet: SheetModel, endIdx?: number,
        activeCell?: number[]): string {
        let cellAddr: string; let rowIdx: number; let colIdx: number;
        if (args.searchBy === 'By Row') {
            if (endIdx === undefined) {
                endIdx = sheet.rows.length - 1;
            }
            let colLen: number;
            for (rowIdx = startRow; rowIdx <= endIdx; rowIdx++) {
                if (isHiddenRow(sheet, rowIdx)) {
                    continue;
                }
                colIdx = activeCell && rowIdx === startRow ? startCol : 0;
                colLen = sheet.rows[rowIdx as number] && sheet.rows[rowIdx as number].cells && sheet.rows[rowIdx as number].cells.length;
                for (colIdx; colIdx < colLen; colIdx++) {
                    if (!isHiddenCol(sheet, colIdx)) {
                        cellAddr = this.checkMatch(args, findVal, rowIdx, colIdx, sheet, activeCell);
                        if (cellAddr) {
                            return cellAddr;
                        }
                    }
                }
            }
        } else {
            if (endIdx === undefined) {
                endIdx = sheet.usedRange.colIndex;
            }
            const endRow: number = sheet.rows && sheet.rows.length - 1;
            for (colIdx = startCol; colIdx <= endIdx; colIdx++) {
                if (isHiddenCol(sheet, colIdx)) {
                    continue;
                }
                rowIdx = activeCell && colIdx === startCol ? startRow : 0;
                for (rowIdx; rowIdx <= endRow; rowIdx++) {
                    if (!isHiddenRow(sheet, rowIdx)) {
                        cellAddr = this.checkMatch(args, findVal, rowIdx, colIdx, sheet, activeCell);
                        if (cellAddr) {
                            return cellAddr;
                        }
                    }
                }
            }
        }
        return cellAddr;
    }
    private findPrevious(args: FindOptions, findArgs: FindArgs): void {
        const findOnSheet: Function = (startIdx: number, endIdx: number, initIteration?: boolean): string => {
            let sheet: SheetModel; let cellAddr: string;
            for (let sheetIdx: number = startIdx; sheetIdx >= endIdx; sheetIdx--) {
                sheet = findArgs.sheets[sheetIdx as number];
                if (sheetIdx === findArgs.sheetIdx) {
                    if (initIteration) {
                        cellAddr = this.findPrevOnSheet(
                            args, findArgs.startRow, findArgs.startCol, 0, 0, findArgs.findVal, sheet, findArgs.activeCell);
                    } else {
                        if (args.searchBy === 'By Row') {
                            cellAddr = this.findPrevOnSheet(
                                args, sheet.usedRange.rowIndex, sheet.usedRange.colIndex, findArgs.startRow, 0, findArgs.findVal, sheet);
                        } else {
                            cellAddr = this.findPrevOnSheet(
                                args, sheet.usedRange.rowIndex, sheet.usedRange.colIndex, 0, findArgs.startCol, findArgs.findVal, sheet);
                        }
                    }
                } else {
                    cellAddr = this.findPrevOnSheet(
                        args, sheet.usedRange.rowIndex, sheet.usedRange.colIndex, 0, 0, findArgs.findVal, sheet);
                }
                if (cellAddr) {
                    break;
                }
            }
            return cellAddr;
        };
        let cellAddr: string;
        cellAddr = findOnSheet(findArgs.sheetIdx, 0, true);
        if (!cellAddr) {
            cellAddr = findOnSheet(findArgs.sheets.length - 1, findArgs.sheetIdx);
        }
        if (cellAddr) {
            this.parent.notify(goto, { address: cellAddr });
        } else {
            this.parent.notify(showDialog, null);
        }
    }
    private findPrevOnSheet(
        args: FindOptions, startRow: number, startCol: number, endRow: number, endCol: number, findVal: string, sheet: SheetModel,
        activeCell?: number[]): string {
        let cellAddr: string; let colIdx: number; let rowIdx: number;
        if (args.searchBy === 'By Row') {
            for (rowIdx = startRow; rowIdx >= endRow; rowIdx--) {
                if (isHiddenRow(sheet, rowIdx)) {
                    continue;
                }
                colIdx = activeCell && rowIdx === startRow ? startCol : sheet.rows[rowIdx as number] &&
                    sheet.rows[rowIdx as number].cells && sheet.rows[rowIdx as number].cells.length - 1;
                for (colIdx; colIdx >= endCol; colIdx--) {
                    if (!isHiddenCol(sheet, colIdx)) {
                        cellAddr = this.checkMatch(args, findVal, rowIdx, colIdx, sheet, activeCell);
                        if (cellAddr) {
                            return cellAddr;
                        }
                    }
                }
            }
        } else {
            for (colIdx = startCol; colIdx >= endCol; colIdx--) {
                if (isHiddenCol(sheet, colIdx)) {
                    continue;
                }
                rowIdx = activeCell && colIdx === startCol ? startRow : sheet.rows && sheet.rows.length - 1;
                for (rowIdx; rowIdx >= endRow; rowIdx--) {
                    if (!isHiddenRow(sheet, rowIdx)) {
                        cellAddr = this.checkMatch(args, findVal, rowIdx, colIdx, sheet, activeCell);
                        if (cellAddr) {
                            return cellAddr;
                        }
                    }
                }
            }
        }
        return cellAddr;
    }
    private checkMatch(args: FindOptions, findVal: string, rowIdx: number, colIdx: number, sheet: SheetModel, curCell?: number[]): string {
        if (curCell && rowIdx === curCell[0] && colIdx === curCell[1]) {
            return null;
        }
        const cell: CellModel = getCell(rowIdx, colIdx, sheet, false, true);
        let cellVal: string = this.parent.getDisplayText(cell);
        if (cellVal) {
            if (!args.isCSen) {
                cellVal = cellVal.toLowerCase();
            }
            if (args.isEMatch) {
                if (cellVal === findVal) {
                    return `${sheet.name}!${getCellAddress(rowIdx, colIdx)}`;
                }
            } else if (cellVal.includes(findVal)) {
                return `${sheet.name}!${getCellAddress(rowIdx, colIdx)}`;
            }
        }
        return null;
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
            this.find(args);
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
