import { Workbook, SheetModel, RowModel, CellModel, getCell, getSheet, isHiddenRow, isHiddenCol, getColumn, getRow } from '../base/index';
import { getCellIndexes, FindOptions, getCellAddress, find, count, getRangeIndexes, getSheetIndexFromAddress, isReadOnly, workbookReadonlyAlert } from '../common/index';
import { goto, replace, replaceAll, showFindAlert, replaceAllDialog, ReplaceAllEventArgs, ExtendedRowModel, FindArgs } from '../common/index';
import { isNullOrUndefined, isUndefined, getNumericObject } from '@syncfusion/ej2-base';
import { findAllValues, FindAllArgs, workBookeditAlert, BeforeReplaceEventArgs, updateCell, beginAction } from '../common/index';
import { isLocked, findToolDlg, getFormattedCellObject, FindOptionsArgs, NumberFormatArgs, LocaleNumericSettings } from '../common/index';
import { isNumber, isCustomDateTime } from '../index';
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
    private find(args: FindOptionsArgs): void {
        args.sheetIndex = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
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
        let headerHgt: number;
        const hdrPanel: HTMLElement = args.showDialog && this.parent.element && this.parent.element.querySelector('.e-header-panel');
        if (hdrPanel) {
            headerHgt = (hdrPanel.offsetHeight || (sheet.showHeaders ? 30 : 0)) + 1;
        }
        args.localeObj = <LocaleNumericSettings>getNumericObject(this.parent.locale);
        if (args.findOpt === 'next') {
            this.findNext(args, findArgs);
        } else {
            this.findPrevious(args, findArgs);
        }
        if (args.showDialog) {
            this.parent.notify(findToolDlg, { findValue: args.value, isPublic: true, headerHgt: headerHgt });
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
        let cellAddr: string = findOnSheet(findArgs.sheetIdx, findArgs.sheets.length - 1, true);
        if (!cellAddr) {
            cellAddr = findOnSheet(0, findArgs.sheetIdx);
        }
        if (cellAddr) {
            this.parent.notify(goto, { address: cellAddr });
        } else {
            this.parent.notify(showFindAlert, null);
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
            this.parent.notify(showFindAlert, null);
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
    private checkMatch(
        args: FindOptionsArgs, findVal: string, rowIdx: number, colIdx: number, sheet: SheetModel, curCell?: number[]): string {
        if (curCell && rowIdx === curCell[0] && colIdx === curCell[1]) {
            return null;
        }
        let cell: CellModel = getCell(rowIdx, colIdx, sheet, false, true);
        if (sheet.isProtected && !sheet.protectSettings.selectCells && sheet.protectSettings.selectUnLockedCells &&
            isLocked(cell, getColumn(sheet, colIdx))) {
            return null;
        }
        const checkValues: (cellVal: string) => string = (cellVal: string): string => {
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
        };
        const displayText: string = this.getDisplayText(cell, rowIdx, colIdx, args.localeObj);
        let cellAddr: string = checkValues(displayText);
        if (!cellAddr) {
            cell = getCell(rowIdx, colIdx, sheet, false, true);
            if (cell.format && !isCustomDateTime(cell.format, true) && !displayText.includes('%')) {
                cellAddr = checkValues(this.getCellVal(cell, args.localeObj));
            }
        }
        return cellAddr;
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
        let activeCellModel: CellModel = getCell(activeCell[0], activeCell[1], sheet, false, true);
        let compareVal: string = this.parent.getDisplayText(activeCellModel).toString();
        let checkValue: string;
        args.value = args.value.toString();
        if (!args.isCSen) {
            checkValue = args.value.toLowerCase();
        }
        const localeObj: LocaleNumericSettings = <LocaleNumericSettings>getNumericObject(this.parent.locale);
        const getReplaceValue: (isRecursive?: boolean) => string = (isRecursive?: boolean): string => {
            let replaceVal: string;
            if (args.isCSen) {
                if (args.isEMatch) {
                    replaceVal = compareVal === args.value && args.replaceValue;
                } else {
                    replaceVal = compareVal.indexOf(args.value) > -1 && compareVal.replace(args.value, args.replaceValue);
                }
            } else {
                if (args.isEMatch) {
                    replaceVal = compareVal.toLowerCase() === checkValue && args.replaceValue;
                } else {
                    const regExp: RegExpConstructor = RegExp;
                    replaceVal = (compareVal.toLowerCase().includes(checkValue)) &&
                        compareVal.replace(new regExp(args.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), args.replaceValue);
                }
            }
            if (!isRecursive && !replacedValue && activeCellModel.format && !isCustomDateTime(activeCellModel.format, true) &&
                !compareVal.includes('%')) {
                compareVal = this.getCellVal(activeCellModel, localeObj);
                if (compareVal) {
                    replaceVal = getReplaceValue(true);
                }
            }
            return replaceVal;
        };
        let replacedValue: string = getReplaceValue();
        if (!replacedValue) {
            args.findOpt = 'next';
            this.find(args);
            activeCell = getCellIndexes(sheet.activeCell);
            activeCellModel = getCell(activeCell[0], activeCell[1], sheet, false, true);
            compareVal = this.parent.getDisplayText(activeCellModel).toString();
            replacedValue = getReplaceValue();
            if (!replacedValue) {
                return;
            }
        }
        if (isReadOnly(getCell(activeCell[0], activeCell[1], sheet), getColumn(sheet, activeCell[1]), getRow(sheet, activeCell[0]))) {
            this.parent.notify(workbookReadonlyAlert, null);
            return;
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
                checkCF: true, valChange: true });
        if (args.isAction) {
            this.parent.notify('actionComplete', { action: 'replace', eventArgs: eventArgs });
        }
    }
    public replaceAll(args: FindOptions): void {
        let startSheet: number = args.mode === 'Sheet' ? args.sheetIndex : 0;
        let sheet: SheetModel = this.parent.sheets[startSheet as number];
        let endRow: number = sheet.usedRange.rowIndex;
        let startRow: number = 0; let endColumn: number = sheet.usedRange.colIndex; let startColumn: number = 0;
        const addressCollection: string[] = [];
        const triggerEvent: boolean = args.isAction;
        const activeCellIdx: number[] = getCellIndexes(sheet.activeCell);
        const eventArgs: ReplaceAllEventArgs & FindOptions = { addressCollection: addressCollection, cancel: false, ...args };
        let replaceCount: number = 0;
        const updateAsync: (val: string, index: number, cell: CellModel) => void = (val: string, index: number, cell: CellModel): void => {
            if (requestAnimationFrame) {
                requestAnimationFrame(() => {
                    if (!eventArgs.cancel && eventArgs.addressCollection[index as number]) {
                        const indexes: number[] = getCellIndexes(eventArgs.addressCollection[index as number].substring(
                            eventArgs.addressCollection[index as number].lastIndexOf('!') + 1));
                        const sheetIndex: number = getSheetIndexFromAddress(this.parent, eventArgs.addressCollection[index as number]);
                        updateCell(
                            this.parent, this.parent.sheets[sheetIndex as number], { cell: { value: val }, rowIdx: indexes[0],
                                uiRefresh: true, checkCF: true, colIdx: indexes[1], valChange: true,
                                skipFormatCheck: (<{ skipFormatCheck?: boolean }>args).skipFormatCheck });
                        if (activeCellIdx[0] === indexes[0] && activeCellIdx[1] === indexes[1]) {
                            this.parent.notify(
                                'formulaBarOperation', { action: 'refreshFormulabar',
                                    cell: getCell(indexes[0], indexes[1], this.parent.sheets[sheetIndex as number], false, true) });
                        }
                        if (index === eventArgs.addressCollection.length - 1 && triggerEvent) {
                            this.parent.notify('actionComplete', { action: 'replaceAll', eventArgs: eventArgs });
                        }
                    }
                });
            } else {
                this.parent.updateCellDetails(
                    { value: val }, eventArgs.addressCollection[index as number], undefined, undefined, true);
            }
            if (!cell.formula) {
                replaceCount++;
            }
        };
        const checkMatch: (cellval: string, cell: CellModel) => boolean = (cellval: string, cell: CellModel): boolean => {
            let matchFound: boolean;
            if (cellval) {
                if (args.isCSen) {
                    if (args.isEMatch) {
                        if (cellval === args.value) {
                            updateAsync(args.replaceValue, addressCollection.length, cell);
                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                            matchFound = true;
                        }
                    } else {
                        if (cellval.indexOf(args.value) > -1) {
                            updateAsync(cellval.replace(args.value, args.replaceValue), addressCollection.length, cell);
                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                            matchFound = true;
                        }
                    }
                } else {
                    if (args.isEMatch) {
                        if (cellval.toLowerCase() === args.value) {
                            updateAsync(args.replaceValue, addressCollection.length, cell);
                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                            matchFound = true;
                        }
                    } else {
                        const val: string = cellval.toLowerCase();
                        if ((cellval === args.value || val.indexOf(args.value.toString().toLowerCase()) > -1) || val ===
                            args.value || cellval === args.value || val.indexOf(args.value) > -1) {
                            const regExp: RegExpConstructor = RegExp;
                            regX = new regExp(args.value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
                            updateAsync(cellval.replace(regX, args.replaceValue), addressCollection.length, cell);
                            addressCollection.push(sheet.name + '!' + getCellAddress(startRow, startColumn));
                            matchFound = true;
                        }
                    }
                }
            }
            return matchFound;
        };
        let displayText: string; let row: RowModel; let regX: RegExp;
        const localeObj: LocaleNumericSettings = <LocaleNumericSettings>getNumericObject(this.parent.locale);
        let cell: CellModel;
        for (startRow; startRow <= endRow + 1; startRow++) {
            if (startColumn > endColumn && startRow > endRow) {
                if (args.mode === 'Workbook') {
                    startSheet++; sheet = this.parent.sheets[startSheet as number];
                    if (sheet) {
                        startColumn = 0; startRow = 0; endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex;
                    } else {
                        break;
                    }
                }
            }
            row = sheet.rows[startRow as number];
            if (row) {
                if (startColumn === endColumn + 1) { startColumn = 0; }
                for (startColumn; startColumn <= endColumn; startColumn++) {
                    if (row) {
                        cell = row.cells && row.cells[startColumn as number];
                        if (cell) {
                            if (isReadOnly(cell, getColumn(sheet, startColumn), row)) {
                                continue;
                            }
                            displayText = this.getDisplayText(
                                cell, startRow, startColumn, localeObj).toString();
                            if (!checkMatch(displayText, cell) && cell.format && !isCustomDateTime(cell.format, true) &&
                                !displayText.includes('%')) {
                                checkMatch(this.getCellVal(row.cells[startColumn as number], localeObj), cell);
                            }
                        }
                    }
                }
            }
        }
        if (addressCollection.length && triggerEvent) {
            this.parent.notify('actionBegin', { action: 'beforeReplaceAll', eventArgs: eventArgs });
            if (!eventArgs.cancel) {
                this.parent.notify(replaceAllDialog, { count: replaceCount, replaceValue: eventArgs.replaceValue });
            }
        } else {
            this.parent.notify(replaceAllDialog, { count: replaceCount, replaceValue: eventArgs.replaceValue });
        }
    }
    private getDisplayText(cell: CellModel, rowIdx: number, colIdx: number, localeObj: LocaleNumericSettings): string {
        if (!cell) {
            return '';
        }
        if (!cell.value && <unknown>cell.value !== 0) {
            if (cell.hyperlink) {
                return typeof cell.hyperlink === 'string' ? cell.hyperlink : cell.hyperlink.address || '';
            }
            return '';
        }
        const cellValue: string = cell.value.toString();
        if (cell.format || cellValue.includes(localeObj.dateSeparator)) {
            const eventArgs: NumberFormatArgs = { value: cell.value, format: cell.format, formattedText: cell.value, cell: cell,
                rowIndex: rowIdx, colIndex: colIdx };
            this.parent.notify(getFormattedCellObject, eventArgs);
            return eventArgs.formattedText;
        } else {
            return cellValue;
        }
    }
    private getCellVal(cell: CellModel, localeObj: LocaleNumericSettings): string {
        if (isNumber(cell.value)) {
            if (localeObj.decimal !== '.') {
                return cell.value.toString().split('.').join(localeObj.decimal);
            }
            return cell.value.toString();
        }
        return cell.value ? cell.value.toString().toLowerCase() : '';
    }
    private totalCount(args: FindOptions): void {
        const sheet: SheetModel = this.parent.sheets[args.sheetIndex];
        const activeCell: number[] = getCellIndexes(sheet.activeCell);
        let count: number = 0;
        let requiredCount: number = 0;
        const findValue: string = args.value.toLowerCase();
        const localeObj: LocaleNumericSettings = <LocaleNumericSettings>getNumericObject(this.parent.locale);
        let displayText: string;
        sheet.rows.filter((row: ExtendedRowModel, rowIdx: number) => row && row.cells && (!row.isFiltered && !row.hidden) &&
            row.cells.filter((cell: CellModel, colIdx: number) => {
                if (cell && (cell.value || <unknown>cell.value === 0 || cell.hyperlink) && !isHiddenCol(sheet, colIdx) &&
                    (!sheet.isProtected || sheet.protectSettings.selectCells || !isLocked(cell, getColumn(sheet, colIdx)))) {
                    displayText = (cell.format || cell.hyperlink) ? this.parent.getDisplayText(cell) : cell.value.toString().toLowerCase();
                    if (displayText.includes(findValue) || (cell.format && !isCustomDateTime(cell.format, true) &&
                        !displayText.includes('%') && this.getCellVal(cell, localeObj).includes(findValue))) {
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
        let startSheet: number = findAllArguments.sheetIndex; let sheet: SheetModel = this.parent.sheets[startSheet as number];
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
                    if (startSheet > sheetLength - 1) {
                        startSheet = 0;
                    }
                    if (initialSheet === startSheet) {
                        if (count === 0) {
                            return;
                        }
                        return;
                    }
                    sheet = this.parent.sheets[startSheet as number];
                    if (sheet) {
                        rowIndex = 0; columnIndex = 0; endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex;
                    }
                }
            }
            if (!isNullOrUndefined(sheet)) {
                if (sheet.rows[rowIndex as number]) {
                    const row: RowModel = sheet.rows[rowIndex as number];
                    if (columnIndex === endColumn + 2) {
                        columnIndex = 0;
                    }
                    for (columnIndex; columnIndex <= endColumn + 1; columnIndex++) {
                        if (row) {
                            if (row.cells && row.cells[columnIndex as number]) {
                                const cell: CellModel = sheet.rows[rowIndex as number].cells[columnIndex as number];
                                if (cell && !isNullOrUndefined(cell.value) && cell.value !== '' && (!sheet.isProtected ||
                                    sheet.protectSettings.selectCells || (sheet.protectSettings.selectUnLockedCells &&
                                        !isLocked(cell, getColumn(sheet, columnIndex))))) {
                                    const cellFormat: string = cell.format;
                                    let cellvalue: string;
                                    if (cellFormat) {
                                        const displayTxt: string = this.parent.getDisplayText(
                                            sheet.rows[rowIndex as number].cells[columnIndex as number]);
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
                                        if (val === findAllArguments.value.toLowerCase()) {
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
