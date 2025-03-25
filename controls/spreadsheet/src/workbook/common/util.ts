import { CellModel, ColumnModel, getCell, SheetModel, setCell, Workbook, getSheetIndex, CellStyleModel, getCellIndexes, RowModel, getRow, getColumn } from './../index';
import { getCellAddress, getRangeIndexes, BeforeCellUpdateArgs, beforeCellUpdate, workbookEditOperation, CellUpdateArgs, getRangeAddress, getSwapRange } from './index';
import { InsertDeleteModelArgs, getColumnHeaderText, ConditionalFormat, ConditionalFormatModel, clearFormulaDependentCells } from './index';
import { isHiddenCol, isHiddenRow, VisibleMergeIndexArgs, checkDateFormat, checkNumberFormat, DateFormatCheckArgs } from './../index';
import { isUndefined, getNumberDependable, getNumericObject, Internationalization, defaultCurrencyCode, isNullOrUndefined } from '@syncfusion/ej2-base';
import { parseThousandSeparator } from './internalization';
import { AutoDetectGeneralFormatArgs, isNumber, NumberFormatArgs, getFormattedCellObject, LocaleNumericSettings } from './../index';
import { ExtendedWorkbook } from './index';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { BeforeActionData } from '../../spreadsheet';

/**
 * Check whether the text is formula or not.
 *
 * @param {string} text - Specify the text.
 * @param {boolean} isEditing - Specify the isEditing.
 * @returns {boolean} - Check whether the text is formula or not.
 */
export function checkIsFormula(text: string, isEditing?: boolean): boolean {
    return text && text[0] === '=' && (text.length > 1 || isEditing);
}
/**
 * Check whether the value is cell reference or not.
 *
 * @param {string} value - Specify the value to check.
 * @returns {boolean} - Returns boolean value
 */
export function isCellReference(value: string): boolean {
    let range: string = value;
    range = range.split('$').join('');
    if (range.indexOf(':') > -1) {
        const rangeSplit: string[] = range.split(':');
        if (isValidCellReference(rangeSplit[0]) && isValidCellReference(rangeSplit[1])) {
            return true;
        }
    } else if (range.indexOf(':') < 0) {
        if (isValidCellReference(range)) {
            return true;
        }
    }
    return false;
}
/**
 * Check whether the value is character or not.
 *
 * @param {string} value - Specify the value to check.
 * @returns {boolean} - Returns boolean value
 */
export function isChar(value: string): boolean {
    if ((value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) || (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122)) {
        return true;
    }
    return false;
}

/**
 * Check whether the range selection is on complete row.
 *
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {number[]} range - Specify the range index.
 * @returns {boolean} - Returns boolean value
 * @hidden
 */
export function isRowSelected(sheet: SheetModel, range: number[]): boolean {
    return range[1] === 0 && range[3] === sheet.colCount - 1;
}

/**
 * Check whether the range selection is on complete column.
 *
 * @param {SheetModel} sheet - Specify the sheet.
 * @param {number[]} range - Specify the range index.
 * @returns {boolean} - Returns boolean value
 * @hidden
 */
export function isColumnSelected(sheet: SheetModel, range: number[]): boolean {
    return range[0] === 0 && range[2] === sheet.rowCount - 1;
}

/**
 * @param {number[]} range - Specify the range
 * @param {number} rowIdx - Specify the row index
 * @param {number} colIdx - Specify the col index
 * @returns {boolean} - Returns boolean value
 */
export function inRange(range: number[], rowIdx: number, colIdx: number) : boolean {
    return range && (rowIdx >= range[0] && rowIdx <= range[2] && colIdx >= range[1] && colIdx <= range[3]);
}

/**
 * @param {number[]} address - Specify the address
 * @param {number} rowIdx - Specify the row index
 * @param {number} colIdx - Specify the col index
 * @returns {boolean} - Returns boolean value
 */
export function isInMultipleRange(address: string, rowIdx: number, colIdx: number): boolean {
    let range: number[];
    let isInRange: boolean;
    const splitedAddress: string[] = address.split(' ');
    for (let i: number = 0, len: number = splitedAddress.length; i < len; i++) {
        range = getRangeIndexes(splitedAddress[i as number]);
        isInRange = inRange(range, rowIdx, colIdx);
        if (isInRange) {
            break;
        }
    }
    return isInRange;
}

/** @hidden
 * @param {number[]} range - Specify the range
 * @param {number[]} testRange - Specify the test range
 * @param {boolean} isModify - Specify the boolean value
 * @returns {boolean} - Returns boolean value
 */
export function isInRange(range: number[], testRange: number[], isModify?: boolean) : boolean {
    let inRange: boolean = range[0] <= testRange[0] && range[2] >= testRange[2] && range[1] <= testRange[1] && range[3] >= testRange[3];
    if (inRange) { return true; }
    if (isModify) {
        if (testRange[0] < range[0] && testRange[2] < range[0] || testRange[0] > range[2] && testRange[2] > range[2]) {
            return false;
        } else {
            if (testRange[0] < range[0] && testRange[2] > range[0]) {
                testRange[0] = range[0];
                inRange = true;
            }
            if (testRange[2] > range[2]) {
                testRange[2] = range[2];
                inRange = true;
            }
        }
        if (testRange[1] < range[1] && testRange[3] < range[1] || testRange[1] > range[3] && testRange[3] > range[3]) {
            return false;
        } else {
            if (testRange[1] < range[1] && testRange[3] > range[1]) {
                testRange[1] = range[1];
                inRange = true;
            }
            if (testRange[3] > range[3]) {
                testRange[3] = range[3];
                inRange = true;
            }
        }
    }
    return inRange;
}

/**
 * @hidden
 * @param {string} address - Specifies the address for whole column.
 * @param {number[]} testRange - Specifies range used to split the address.
 * @param {number} colIdx - Specifies the column index.
 * @returns {string} - returns the modified address.
 */
export function getSplittedAddressForColumn(address: string, testRange: number[], colIdx: number): string {
    const colName: string = getColumnHeaderText(colIdx + 1);
    if (address) {
        address.split(' ').forEach((addrs: string) => {
            const range: number[] = getRangeIndexes(addrs);
            if (isInRange(range, testRange)) {
                address = address.split(addrs).join(colName + (range[0] + 1) +
                    ':' + colName + testRange[0] + ' ' + colName + (testRange[2] + 2) +
                    ':' + colName + (range[2] + 1));
            } else if (isInRange(range, testRange, true)) {
                let modifiedAddress: string;
                if (testRange[0] > range[0]) {
                    modifiedAddress = colName + (range[0] + 1) + ':' + colName + testRange[0];
                } else {
                    modifiedAddress = colName + (testRange[2] + 2) + ':' + colName + (range[2] + 1);
                }
                address = address.split(addrs).join(modifiedAddress);
            }
        });
    } else {
        address = colName + '1:' + colName + testRange[0] + ' ' + colName + (testRange[2] + 2) + ':' + colName + '1048576';
    }
    return address;
}

/**
 * Check whether the cell is locked or not
 *
 * @param {CellModel} cell - Specify the cell.
 * @param {ColumnModel} column - Specify the column.
 * @returns {boolean} - Returns boolean value
 * @hidden
 */
export function isLocked(cell: CellModel, column: ColumnModel): boolean {
    if (!cell) {
        cell = {};
    }
    if (cell.isLocked) {
        return true;
    } else if (cell.isLocked === false) {
        return false;
    } else if (column && column.isLocked) {
        return true;
    } else if (!cell.isLocked && (column && column.isLocked !== false)) {
        return true;
    }
    return false;
}

/**
 * Check whether the value is cell reference or not.
 *
 * @param {string} value - Specify the value to check.
 * @returns {boolean} - Returns boolean value
 * @hidden
 */
export function isValidCellReference(value: string): boolean {
    const text: string = value;
    const startNum: number = 0;
    let endNum: number = 0;
    let cellText: string = '';
    const textLength: number = text.length;
    for (let i: number = 0; i < textLength; i++) {
        if (isChar(text[i as number])) {
            endNum++;
        }
    }
    cellText = text.substring(startNum, endNum);
    const cellTextLength: number = cellText.length;
    if (cellTextLength !== textLength) {
        if (cellTextLength < 4) {
            if (textLength !== 1 && (isNaN(parseInt(text, 10)))) {
                const cellColIndex: number = columnIndex(cellText);
                // XFD is the last column, 16384 - Maximum number of columns in excel.
                if (cellColIndex > 16384) {
                    return false;
                }
                const cellNumber: number = parseFloat(text.substring(endNum, textLength));
                if (cellNumber > 0 && cellNumber < 1048577) { // 1048576 - Maximum number of rows in excel.
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * To get the column index of the given cell.
 *
 * @param {string} cell - Cell address for getting column index.
 * @returns {number} - To get the column index of the given cell.
 * @hidden
 */
export function columnIndex(cell: string): number {
    let j: number = 0;
    let k: number = 0;
    cell = cell.toUpperCase();
    if (j < cell.length && cell[j as number] === '!') {
        j++;
        while (j < cell.length && cell[j as number] !== '!') {
            j++;
        }
        j++;
    }
    while (j < cell.length && isChar(cell[j as number])) {
        const charCode: number = cell[j as number].charCodeAt(0);
        k = k * 26 + charCode - 64;
        j++;
    }
    if (k === 0) {
        return -1;
    }
    return k;
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specify the sheet
 * @param {number} index - specify the index
 * @param {boolean} increase - specify the boolean value.
 * @param {string} layout - specify the string
 * @param {number} count - specify the count.
 * @returns {number} - To skip the hidden index
 *
 */
export function skipHiddenIdx(sheet: SheetModel, index: number, increase: boolean, layout: string = 'rows', count?: number): number {
    let rowColObj: object;
    if (increase) {
        for (let i: number = index; i < Infinity; i++) {
            rowColObj = sheet[`${layout}`];
            if (rowColObj[index as number] && rowColObj[index as number].hidden) {
                index++;
            } else {
                if (count) {
                    count--;
                    index++;
                } else {
                    break;
                }
            }
        }
    } else {
        for (let i: number = index; i > -1; i--) {
            rowColObj = sheet[`${layout}`];
            if (rowColObj[index as number] && rowColObj[index as number].hidden) {
                index--;
            } else {
                break;
            }
        }
    }
    return index;
}

/**
 * @param {CellStyleModel} style - Cell style.
 * @param {boolean} onActionUpdate - Specifies the action.
 * @returns {boolean} - retruns `true` is height needs to be checked.
 * @hidden
 */
export function isHeightCheckNeeded(style: CellStyleModel, onActionUpdate?: boolean): boolean {
    const keys: string[] = Object.keys(style);
    return (onActionUpdate ? keys.indexOf('fontSize') > -1 : keys.indexOf('fontSize') > -1
        && Number(style.fontSize.split('pt')[0]) > 12) || keys.indexOf('fontFamily') > -1 || keys.indexOf('borderTop') > -1
        || keys.indexOf('borderBottom') > -1;
}

/**
 * @param {number[]} currIndexes - current indexes in which formula get updated
 * @param {number[]} prevIndexes - copied indexes
 * @param {SheetModel} sheet - sheet model
 * @param {Workbook} context - Represents workbook instance
 * @param {CellModel} prevCell - Copied or previous cell model
 * @param {boolean} isSort - Represents sort action
 * @returns {string} - retruns updated formula
 * @hidden
 */
export function getUpdatedFormula(
    currIndexes: number[], prevIndexes: number[], sheet: SheetModel, context: Workbook, prevCell?: CellModel, isSort?: boolean): string {
    let cIdxValue: string; let cell: CellModel;
    if (prevIndexes) {
        cell = prevCell || getCell(prevIndexes[0], prevIndexes[1], sheet, false, true);
        cIdxValue = cell.formula || '';
    }
    if (cIdxValue) {
        if (isSort) {
            context.notify(clearFormulaDependentCells, { cellRef: getCellAddress(prevIndexes[0], prevIndexes[1]) });
        }
        if (cIdxValue.indexOf('=') === 0) {
            cIdxValue = cIdxValue.slice(1);
        }
        cIdxValue = cIdxValue.split('(').join(context.listSeparator).split(')').join(context.listSeparator);
        const formulaOperators: string[] = ['+', '-', '*', '/', '>=', '<=', '<>', '>', '<', '=', '%', '&']; let splitArray: string[];
        let value: string = cIdxValue;
        for (let i: number = 0; i < formulaOperators.length; i++) {
            splitArray = value.split(formulaOperators[i as number]);
            value = splitArray.join(context.listSeparator);
        }
        splitArray = value.split(context.listSeparator);
        const newAddress: { [key: string]: string }[] = []; let newRef: string; let refObj: { [key: string]: string };
        let isSheetRef: boolean; let cellRefSheet: string; let cellRef: string;
        for (let j: number = 0; j < splitArray.length; j++) {
            isSheetRef = splitArray[j as number].includes('!');
            if (isSheetRef) {
                const lastIndex: number = splitArray[j as number].lastIndexOf('!');
                cellRefSheet = splitArray[j as number].substring(0, lastIndex);
                cellRef = splitArray[j as number].substring(lastIndex + 1).toUpperCase();
            } else {
                cellRef = splitArray[j as number].toUpperCase();
            }
            if (isCellReference(cellRef.trim()) && !cellRef.includes('$')) {
                const leadingSpaces: string = getLeadingSpaces(cellRef);
                const trailingSpaces: string = getTrailingSpaces(cellRef);
                const range: number[] = getRangeIndexes(cellRef);
                const newRange: number[] = [currIndexes[0] - (prevIndexes[0] - range[0]), currIndexes[1] - (prevIndexes[1] - range[1]),
                    currIndexes[0] - (prevIndexes[0] - range[2]), currIndexes[1] - (prevIndexes[1] - range[3])];
                if (newRange[1] < 0 || newRange[2] < 0 || newRange[3] < 0 || (!isSort && newRange[0] < 0)) {
                    newRef = '#REF!';
                } else {
                    if (isSort && newRange[0] < 0) {
                        newRange[0] = newRange[2];
                    }
                    newRef = getCellAddress(newRange[0], newRange[1]);
                    if (cellRef.includes(':')) {
                        newRef += (':' + getCellAddress(newRange[2], newRange[3]));
                    }
                    newRef = isCellReference(newRef) ? newRef : '#REF!';
                }
                refObj = {};
                if (isSheetRef) {
                    newRef = `${cellRefSheet}!${newRef}`;
                }
                refObj[splitArray[j as number]] = `${leadingSpaces}${newRef}${trailingSpaces}`;
                if (splitArray[j as number].includes(':')) {
                    newAddress.splice(0, 0, refObj);
                } else {
                    newAddress.push(refObj);
                }
            }
        }
        let objKey: string; let objValue: string; cIdxValue = cell.formula;
        let newCIdxValue: string = cIdxValue;
        for (let j: number = 0; j < newAddress.length; j++) {
            objKey = Object.keys(newAddress[j as number])[0];
            objValue = newAddress[j as number][`${objKey}`];
            const objKeyLen: number = objKey.length;
            const positionIdx: number = newCIdxValue.indexOf(objKey);
            let emptyString: string = '';
            for (let idx: number = 0; idx < objValue.length; idx++) {
                emptyString += ' ';
            }
            cIdxValue = cIdxValue.slice(0, positionIdx) + objValue + cIdxValue.slice(positionIdx + objKeyLen);
            newCIdxValue = newCIdxValue.slice(0, positionIdx) + emptyString + newCIdxValue.slice(positionIdx + objKeyLen);
        }
        return cIdxValue;
    } else {
        return null;
    }
}

/**
 * Retrieves the leading spaces from a given string.
 *
 * @param {string} string - The input string from which to retrieve leading spaces.
 * @returns {string} - A string containing all leading spaces from the input string.
 * @hidden
 */
export function getLeadingSpaces(string: string): string {
    let leadingSpaces: string = '';
    for (let i: number = 0; i < string.length; i++) {
        if (string[i as number] === ' ') {
            leadingSpaces += ' ';
        } else {
            break;
        }
    }
    return leadingSpaces;
}

/**
 * Retrieves the trailing spaces from a given string.
 *
 * @param {string} string - The input string from which to retrieve trailing spaces.
 * @returns {string} - A string containing all trailing spaces from the input string.
 * @hidden
 */
export function getTrailingSpaces(string: string): string {
    let trailingSpaces: string = '';
    for (let i: number = string.length - 1; i >= 0; i--) {
        if (string[i as number] === ' ') {
            trailingSpaces = ' ' + trailingSpaces;
        } else {
            break;
        }
    }
    return trailingSpaces;
}

/**
 * @param {Workbook} context - Specifies the context.
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {CellUpdateArgs} prop - Specifies the props.
 * @param {BeforeActionData} actionData - It holds the undoRedoCollection cell details.
 * @param {boolean} isUndo - It holds the undo information.
 * @returns {boolean} - returns args cancel value.
 * @hidden */
export function updateCell(context: Workbook, sheet: SheetModel, prop: CellUpdateArgs, actionData?: BeforeActionData,
                           isUndo?: boolean): boolean {
    const args: BeforeCellUpdateArgs = { cell: prop.cell, rowIndex: prop.rowIdx, colIndex: prop.colIdx, cancel: false, sheet: sheet.name };
    if (!prop.preventEvt) { // Prevent event triggering for public method cell update.
        context.trigger(beforeCellUpdate, args);
    }
    if (!prop.eventOnly && !args.cancel) { // `eventOnly` - To trigger event and return without cell model update.
        if (prop.valChange) {
            const prevCell: CellModel = getCell(args.rowIndex, args.colIndex, sheet);
            const prevCellVal: string = !prop.preventEvt && context.getDisplayText(prevCell);
            const isFormulaCell: boolean = !!(prevCell && prevCell.formula);
            setCell(args.rowIndex, args.colIndex, sheet, args.cell, !prop.pvtExtend);
            const cell: CellModel = getCell(args.rowIndex, args.colIndex, sheet, false, true);
            if (prop.mergedCells) {
                delete cell.value;
                delete cell.formula;
            }
            if (cell.formattedText) {
                delete cell.formattedText;
            }
            const evtArgs: { [key: string]: string | boolean | number[] | number | BeforeActionData } = {
                action: 'updateCellValue',
                address: [args.rowIndex, args.colIndex], sheetIndex: getSheetIndex(context, sheet.name), value:
                    isFormulaCell && !cell.formula ? (cell.value || (<unknown>cell.value === 0 ? '0' : '')) :
                        (cell.formula || cell.value || (<unknown>cell.value === 0 ? '0' : '')),
                skipFormatCheck: prop.skipFormatCheck, isRandomFormula: prop.isRandomFormula,
                isDelete: prop.isDelete, deletedRange: prop.deletedRange, fillType: prop.fillType,
                cellInformation: actionData, isRedo: !isUndo, actionName: prop.fillType,
                isPaste: prop.requestType === 'paste'
            };
            context.notify(workbookEditOperation, evtArgs);
            prop.isFormulaDependent = <boolean>evtArgs.isFormulaDependent;
            if (prop.requestType && args.cell === null) {
                setCell(args.rowIndex, args.colIndex, sheet, args.cell, !prop.pvtExtend);
            }
            if (prop.cellDelete) {
                delete cell.value;
                delete cell.formula;
                delete cell.hyperlink;
            }
            if (prop.uiRefresh) {
                context.serviceLocator.getService<{ refresh: Function }>('cell').refresh(
                    args.rowIndex, args.colIndex, prop.lastCell, prop.td, prop.checkCF, prop.checkWrap, prop.skipFormatCheck,
                    prop.isRandomFormula, prop.fillType);
            }
            if (!prop.preventEvt) {
                const cellDisplayText: string = context.getDisplayText(cell);
                if (cellDisplayText !== prevCellVal) {
                    let cellValue: string = getCell(args.rowIndex, args.colIndex, sheet, false, true).value;
                    cellValue = cellValue || (<unknown>cellValue === 0 ? '0' : '');
                    const evtArgs: { [key: string]: Object } = { value: cellValue, oldValue: prevCellVal, formula: cell.formula || '',
                        address: `${sheet.name}!${getCellAddress(args.rowIndex, args.colIndex)}`, displayText: cellDisplayText };
                    if (prop.requestType) {
                        evtArgs.requestType = prop.requestType;
                    }
                    context.trigger('cellSave', evtArgs);
                }
            }
        } else {
            setCell(args.rowIndex, args.colIndex, sheet, args.cell, !prop.pvtExtend);
        }
    }
    return args.cancel;
}

/**
 * @param {number} rowIdx - row index
 * @param {number} colIdx - column index
 * @param {SheetModel} sheet - sheet model
 * @returns {number[]} - retruns data range
 * @hidden
 */
export function getDataRange(rowIdx: number, colIdx: number, sheet: SheetModel): number[] {
    let sRowIdx: number = rowIdx;
    let eRowIdx: number = rowIdx;
    let sColIdx: number = colIdx;
    let eColIdx: number = colIdx;
    const usedRowIdx: number = sheet.usedRange.rowIndex;
    const usedColIdx: number = sheet.usedRange.colIndex;
    const isEmptyRow: Function = (idx: number): boolean => {
        for (let i: number = 0; i <= usedColIdx; i++) {
            if (!isUndefined(getCell(idx, i, sheet, null, true).value)) {
                return false;
            }
        }
        return true;
    };
    const isEmptyColumn: Function = (idx: number): boolean => {
        for (let i: number = sRowIdx; i <= eRowIdx; i++) {
            if (!isUndefined(getCell(i, idx, sheet, null, true).value)) {
                return false;
            }
        }
        return true;
    };
    for (let i: number = sRowIdx; i <= usedRowIdx; i++) { // To find end row index
        if (isUndefined(getCell(i, colIdx, sheet, null, true).value) && isEmptyRow(i)) {
            break;
        } else {
            eRowIdx = i;
        }
    }
    for (let i: number = sRowIdx; i >= 0; i--) { // To find start row index
        if (isUndefined(getCell(i, colIdx, sheet, null, true).value) && isEmptyRow(i)) {
            break;
        } else {
            sRowIdx = i;
        }
    }
    for (let i: number = sColIdx; i <= usedColIdx; i++) { // To find end column index
        if (isUndefined(getCell(rowIdx, i, sheet, null, true).value) && isEmptyColumn(i)) {
            break;
        } else {
            eColIdx = i;
        }
    }
    for (let i: number = sColIdx; i >= 0; i--) { // To find start column index
        if (isUndefined(getCell(rowIdx, i, sheet, null, true).value) && isEmptyColumn(i)) {
            break;
        } else {
            sColIdx = i;
        }
    }
    return [sRowIdx, sColIdx, eRowIdx, eColIdx];
}
/**
 * @param {InsertDeleteModelArgs} args - row index
 * @param {number[]} formatRange - format range index
 * @param {boolean} isAction - specifies isAction.
 * @returns {number[]} - retruns updated range
 * @hidden
 */
export function insertFormatRange(args: InsertDeleteModelArgs, formatRange: number[], isAction: boolean): number[] {
    let sltRangeIndex: number[] = getRangeIndexes(args.model.selectedRange); let insertStartIndex: number = 0;
    let insertEndIndex: number = 0;
    if (args.modelType === 'Column') {
        if (isAction || (args.insertType === 'before' && args.isUndoRedo)) {
            sltRangeIndex = [0, args.start as number, 0, args.end];
        }
        if (args.insertType === 'before') {
            if ((formatRange[1] <= sltRangeIndex[1] && formatRange[3] >= sltRangeIndex[1])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            } else if (sltRangeIndex[1] < formatRange[1]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            }
        } else {
            if (args.isUndoRedo) {
                const diffValue: number = (args.end - (args.start as number)) + 1;
                sltRangeIndex = [0, (args.start as number) - diffValue, 0, args.end - diffValue];
            }
            if ((formatRange[1] <= sltRangeIndex[3] && formatRange[3] >= sltRangeIndex[3])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            } else if (sltRangeIndex[3] < formatRange[3]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            }
        }
        return [formatRange[0], formatRange[1] + insertStartIndex, formatRange[2], formatRange[3] + insertEndIndex];
    } else {
        if (isAction || (args.insertType === 'above' && args.isUndoRedo)) {
            sltRangeIndex = [args.start as number, 0, args.end, 0];
        }
        if (args.insertType === 'above') {
            if ((formatRange[0] <= sltRangeIndex[0] && formatRange[2] >= sltRangeIndex[0])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[2] - sltRangeIndex[0]) + 1;
            } else if (sltRangeIndex[0] < formatRange[0]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[2] - sltRangeIndex[0]) + 1;
            }
        } else {
            if (args.isUndoRedo) {
                const diffValue: number = (args.end - (args.start as number)) + 1;
                sltRangeIndex = [(args.start as number) - diffValue, 0, args.end - diffValue, 0];
            }
            if ((formatRange[0] <= sltRangeIndex[2] && formatRange[2] >= sltRangeIndex[2])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[2] - sltRangeIndex[0]) + 1;
            } else if (sltRangeIndex[2] < formatRange[2]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[2] - sltRangeIndex[0]) + 1;
            }
        }
        return [formatRange[0] + insertStartIndex, formatRange[1], formatRange[2] + insertEndIndex, formatRange[3]];
    }
}
/**
 * @param {InsertDeleteModelArgs} args - row index
 * @param {number[]} formatRange - cell range index
 * @returns {number[]} - retruns data range
 * @hidden
 */
export function deleteFormatRange(args: InsertDeleteModelArgs, formatRange: number[]): number[] {
    let cellRange: number[]; let deleteStartIndex: number = 0; let deleteEndIndex: number = 0;
    if (args.modelType === 'Column') {
        cellRange = [0, args.start as number, args.model.usedRange.rowIndex, args.end];
        if (cellRange[3] < formatRange[1]) {
            deleteStartIndex = deleteEndIndex = cellRange[3] - cellRange[1] + 1;
        }
        else if (cellRange[1] >= formatRange[1] && cellRange[3] <= formatRange[3]) {
            deleteEndIndex = cellRange[3] - cellRange[1] + 1;
        } else if (cellRange[1] >= formatRange[1] && cellRange[1] <= formatRange[3]) {
            deleteEndIndex = formatRange[3] - cellRange[1] + 1;
        }
        else if (cellRange[1] < formatRange[1] && cellRange[3] >= formatRange[1]) {
            deleteStartIndex = formatRange[1] - cellRange[1];
            deleteEndIndex = cellRange[3] - cellRange[1] + 1;
        }
        else if (cellRange[1] < formatRange[1] && cellRange[3] < formatRange[3]) {
            deleteStartIndex = (cellRange[3] - formatRange[1]) + (cellRange[3] - cellRange[1]) + 1;
            deleteEndIndex = cellRange[3] - cellRange[1] + 1;
        }
        return [formatRange[0], formatRange[1] - deleteStartIndex, formatRange[2], formatRange[3] - deleteEndIndex];
    } else {
        cellRange = [args.start as number, 0, args.end, args.model.usedRange.colIndex];
        if (cellRange[2] < formatRange[0]) {
            deleteStartIndex = deleteEndIndex = cellRange[2] - cellRange[0] + 1;
        }
        else if (cellRange[0] >= formatRange[0] && cellRange[2] <= formatRange[2]) {
            deleteEndIndex = cellRange[2] - cellRange[0] + 1;
        } else if (cellRange[0] >= formatRange[0] && cellRange[0] <= formatRange[2]) {
            deleteEndIndex = formatRange[2] - cellRange[0] + 1;
        }
        else if (cellRange[0] < formatRange[0] && cellRange[2] >= formatRange[0]) {
            deleteStartIndex = formatRange[0] - cellRange[0];
            deleteEndIndex = cellRange[2] - cellRange[0] + 1;
        }
        else if (cellRange[0] < formatRange[0] && cellRange[2] < formatRange[2]) {
            deleteStartIndex = (cellRange[2] - formatRange[0]) + (cellRange[2] - cellRange[0]) + 1;
            deleteEndIndex = cellRange[2] - cellRange[0] + 1;
        }
        return [formatRange[0] - deleteStartIndex, formatRange[1], formatRange[2] - deleteEndIndex, formatRange[3]];
    }
}

/**
 * @param {ConditionalFormat[]} curCF - Specifies current Conditional formatting.
 * @param {ConditionalFormatModel[]} cfRule - Specifies conditional formatting rules.
 * @param {number} rowIdx - Specifies the row index.
 * @param {number} colIdx -Specifies the col index.
 * @param {number[]} startRanges - Specifies conditional formatting origin index.
 * @param {number[]} fillRanges - Specifies the conditional formatting fill ranges.
 * @param {SheetModel} sheet -Specifies the conditional formatted sheet.
 * @returns {void} - Updates Conditional formatting model.
 * @hidden
 */
export function updateCFModel(curCF: ConditionalFormat[], cfRule: ConditionalFormatModel[], rowIdx: number, colIdx: number,
                              startRanges?: number[], fillRanges?: number[], sheet?: SheetModel): void {
    let cfRange: string[]; let indexes: number[];
    for (let i: number = curCF.length - 1; i >= 0; i--) {
        cfRange = curCF[i as number].range.trim().split(',');
        for (let j: number = 0; j < cfRange.length; j++) {
            indexes = getRangeIndexes(cfRange[j as number].includes(':') ? cfRange[j as number] :
                `${cfRange[j as number]}:${cfRange[j as number]}`);
            if (rowIdx >= indexes[0] && colIdx >= indexes[1] && rowIdx <= indexes[2] && colIdx <= indexes[3]) {
                cfRule.push(curCF[i as number]);
                curCF.splice(i, 1);
                break;
            } else if (startRanges && startRanges[0] >= indexes[0] && startRanges[1] >= indexes[1] &&
                startRanges[0] <= indexes[2] && startRanges[1] <= indexes[3]) {
                const newCondiFormat: ConditionalFormatModel = {
                    action: 'autofillWithCF',
                    cFColor: curCF[i as number].cFColor,
                    range: getRangeAddress(fillRanges),
                    type: curCF[i as number].type,
                    value: curCF[i as number].value
                };
                curCF.splice(i, 1);
                for (let i: number = 0, cfMembers: ConditionalFormatModel[] = sheet.conditionalFormats; i < cfMembers.length; i++) {
                    if (cfMembers[i as number].action === 'autofillWithCF' && cfMembers[i as number].range === newCondiFormat.range) {
                        break;
                    } else if (i === cfMembers.length - 1) {
                        cfRule.push(newCondiFormat);
                        sheet.conditionalFormats.push(newCondiFormat);
                    }
                }
                break;
            }
        }
    }
}

/**
 * @param {number} indexes - Specifies the indexes.
 * @param {string} range - Specifies the range.
 * @returns {boolean} - Return is range or not.
 * @hidden
 */
export function checkRange(indexes: number[][], range: string): boolean {
    const ranges: string[] = range.trim().split(',');
    let left: boolean; let right: boolean; let top: boolean; let bottom: boolean; let cfIdx: number[];
    const checkRange: (idx: number[]) => boolean = (idx: number[]): boolean => {
        for (let i: number = 0; i < ranges.length; i++) {
            cfIdx = getRangeIndexes(
                ranges[i as number].includes(':') ? ranges[i as number] : `${ranges[i as number]}:${ranges[i as number]}`);
            if (idx[0] <= cfIdx[0] && idx[1] <= cfIdx[1] && idx[2] >= cfIdx[2] && idx[3] >= cfIdx[3]) {
                return true;
            } else {
                top = idx[0] >= cfIdx[0] && idx[0] <= cfIdx[2];
                bottom = idx[2] >= cfIdx[0] && idx[2] <= cfIdx[2];
                left = idx[1] >= cfIdx[1] && idx[1] <= cfIdx[3];
                right = idx[3] >= cfIdx[1] && idx[3] <= cfIdx[3];
                if (top && bottom) {
                    if (left || right || (idx[1] < cfIdx[1] && idx[3] > cfIdx[3])) {
                        if (idx[0] - cfIdx[0] > 0) {
                            return true;
                        }
                        if (cfIdx[2] - idx[2] > 0) {
                            return true;
                        }
                    }
                    if (left && idx[1] !== cfIdx[1]) {
                        return true;
                    }
                    if (right && idx[3] !== cfIdx[3]) {
                        return true;
                    }
                } else if (left && right) {
                    if (top || bottom || (idx[0] < cfIdx[0] && idx[2] > cfIdx[2])) {
                        if (idx[1] - cfIdx[1] > 0) {
                            return true;
                        }
                        if (cfIdx[3] - idx[3] > 0) {
                            return true;
                        }
                    }
                    if (top) {
                        if (idx[0] !== cfIdx[0]) {
                            return true;
                        }
                    } else if (bottom && idx[2] !== cfIdx[2]) {
                        return true;
                    }
                } else if (top || bottom) {
                    if (left) {
                        if (idx[1] !== cfIdx[1]) {
                            return true;
                        }
                        if (idx[0] - cfIdx[0] > 0) {
                            return true;
                        } else if (cfIdx[2] - idx[2] > 0) {
                            return true;
                        }
                    } else if (right) {
                        if (idx[3] !== cfIdx[3]) {
                            return true;
                        }
                        if (idx[0] - cfIdx[0] > 0) {
                            return true;
                        } else if (cfIdx[2] - idx[2] > 0) {
                            return true;
                        }
                    } else if (idx[1] < cfIdx[1] && idx[3] > cfIdx[3]) {
                        return true;
                    }
                } else if ((left || right) && idx[0] < cfIdx[0] && idx[2] > cfIdx[2]) {
                    return true;
                }
            }
        }
        return false;
    };
    for (let j: number = 0; j < indexes.length; j++) {
        if (checkRange(indexes[j as number])) {
            return true;
        }
    }
    return false;
}

/**
 * Parse the formatted text to get the actual cell value.
 *
 * @param {string[]} valArr - Specifies the value array.
 * @param {string} context - Specifies the workbook instance.
 * @param {LocaleNumericSettings} numObj - Specifies the locale numeric options like decimal and group separators.
 * @returns {string[]} - Returns the parsed number collection.
 * @hidden
 */
export function parseLocaleNumber(valArr: string[], context: Workbook, numObj?: LocaleNumericSettings): string[] {
    let formatArgs: NumberFormatArgs;
    if (!numObj) {
        numObj = <LocaleNumericSettings>getNumericObject(context.locale);
    }
    for (let idx: number = 0; idx < valArr.length; idx++) {
        if (isNumber(valArr[idx as number])) {
            if (numObj.group === '.') {
                valArr[idx as number] = valArr[idx as number].toString();
                if (valArr[idx as number].indexOf('.') &&
                    parseThousandSeparator(valArr[idx as number], context.locale, numObj.group, numObj.decimal)) {
                    valArr[idx as number] = valArr[idx as number].split(numObj.group).join('');
                }
            }
        } else {
            formatArgs = { formattedText: valArr[idx as number], value: valArr[idx as number], format: 'General',
                cell: { value: valArr[idx as number], format: 'General' }, isEdit: true };
            context.notify(getFormattedCellObject, formatArgs);
            if (isNumber(formatArgs.value)) {
                valArr[idx as number] = formatArgs.value.toString();
            }
        }
    }
    return valArr;
}

/**
 * Returns the overall viewport indexes by including the freeze and movable part.
 *
 * @param {Workbook} parent - Specify the Workbook object.
 * @param {number} viewport - Specifies the top, bottom, left, and right index of the current viewport.
 * @param {number} viewport.topIndex - Specifies the top index of the current viewport.
 * @param {number} viewport.leftIndex - Specifies the left index of the current viewport.
 * @param {number} viewport.bottomIndex - Specifies the bottom index of the current viewport.
 * @param {number} viewport.rightIndex - Specifies the right index of the current viewport.
 * @returns {number} - Returns the viewport indexes.
 * @hidden
 */
export function getViewportIndexes(
    parent: Workbook, viewport: { topIndex?: number, leftIndex?: number, bottomIndex?: number, rightIndex?: number }): number[][] {
    const sheet: SheetModel = parent.getActiveSheet();
    const indexes: number[][] = [[viewport.topIndex + parent.frozenRowCount(sheet), viewport.leftIndex + parent.frozenColCount(sheet),
        viewport.bottomIndex, viewport.rightIndex]];
    if (sheet.frozenRows || sheet.frozenColumns) {
        const froezenRow: number = parent.frozenRowCount(sheet);
        const froezenCol: number = parent.frozenColCount(sheet);
        const topLeftCell: number[] = getCellIndexes(sheet.topLeftCell);
        if (froezenRow && froezenCol) {
            indexes.push([topLeftCell[0], topLeftCell[1], froezenRow - 1, froezenCol - 1]);
            const paneTopLeftCell: number[] = getCellIndexes(sheet.paneTopLeftCell);
            indexes.push([paneTopLeftCell[0], topLeftCell[1], viewport.bottomIndex, froezenCol - 1]);
        }
        if (froezenRow) {
            indexes.push([topLeftCell[0], viewport.leftIndex + froezenCol, froezenRow - 1, viewport.rightIndex]);
        }
        if (froezenCol) {
            indexes.push([viewport.topIndex + froezenRow, topLeftCell[1], viewport.bottomIndex,
                froezenCol - 1]);
        }
    }
    return indexes;
}

/**
 * If the primary cell in the merged range row/column is hidden, then this method will update
 * the next visible row/column index within the merged range.
 *
 * @param {VisibleMergeIndexArgs} args - Specifies the args.
 * @returns {void} - Update the next visible row/column index within the merged range.
 */
export function setVisibleMergeIndex(args: VisibleMergeIndexArgs): void {
    if (isHiddenRow(args.sheet, args.rowIdx)) {
        const idx: number = skipHiddenIdx(args.sheet, args.rowIdx, true);
        if (idx < args.rowIdx + args.cell.rowSpan) {
            args.rowIdx = idx;
            args.isMergedHiddenCell = true;
        }
    }
    if (isHiddenCol(args.sheet, args.colIdx)) {
        const idx: number = skipHiddenIdx(args.sheet, args.colIdx, true, 'columns');
        if (idx < args.colIdx + args.cell.colSpan) {
            args.colIdx = idx;
            args.isMergedHiddenCell = true;
        }
    }
}

/**
 * Check whether the sheets are imported.
 *
 * @param {Workbook} context - Specifies the spreadsheet instance.
 * @returns {boolean} - It returns true if the sheets are imported otherwise false.
 * @hidden
 */
export function isImported(context: Workbook): boolean {
    return (context as ExtendedWorkbook).workbookOpenModule && (context as ExtendedWorkbook).workbookOpenModule.preventFormatCheck;
}

/**
 * Return a function that will auto-detect the number format of the formatted cell value.
 *
 * @param {Workbook} context - Specifies the Workbook instance.
 * @returns {void} - Defines the common variables and returns the auto-detect number format function.
 * @hidden
 */
export function getAutoDetectFormatParser(context: Workbook): (cell: CellModel) => void {
    const intl: Internationalization = new Internationalization();
    const eventArgs: DateFormatCheckArgs = { intl: intl, updateValue: true, value: '',
        curSymbol: getNumberDependable(context.locale, defaultCurrencyCode) };
    const options: AutoDetectGeneralFormatArgs = { args: eventArgs, intl: intl };
    const localeNumObj: LocaleNumericSettings = <LocaleNumericSettings>getNumericObject(context.locale);
    return (cell: CellModel): void => {
        if (!cell.format && cell.value && !isNumber(cell.value)) {
            eventArgs.cell = cell;
            eventArgs.value = cell.value;
            context.notify(checkDateFormat, eventArgs);
            if (!cell.format) {
                let cellVal: string = cell.value.toString();
                if (cellVal.includes(options.args.curSymbol) || cellVal.includes(localeNumObj.group) || cellVal.includes('%')) {
                    options.fResult = cellVal;
                    context.notify(checkNumberFormat, options);
                } else if (localeNumObj.decimal !== '.' && !isNumber(cellVal)) {
                    if (cellVal.includes(localeNumObj.decimal)) {
                        cellVal = cellVal.replace(localeNumObj.decimal, '.');
                        if (isNumber(cellVal)) {
                            cell.value = cellVal;
                        }
                    }
                }
            }
        }
    };
}

/**
 *
 * @param {DataManager} dataManager - Specifies the Datamanager.
 * @param {Predicate[]} predicates - Specifies the predicates.
 * @param {Predicate[]} equalOrPredicates - Specifies the equal or predicates.
 * @returns {Object[]} - Returns apply predicates object.
 * @hidden
 */
export function applyPredicates(dataManager: DataManager, predicates: Predicate[], equalOrPredicates?: Predicate[][]): Object[] {
    let query: Query = new Query();
    if (predicates.length) {
        query.where(Predicate.and(predicates));
    }
    let result: Object[] = dataManager.executeLocal(query);
    if (equalOrPredicates) {
        for (let idx: number = 0, predicateCollLen: number = equalOrPredicates.length; idx < predicateCollLen; idx++) {
            if (!result.length) { break; }
            query = new Query();
            if (equalOrPredicates[idx as number].length) {
                query.where(Predicate.or(equalOrPredicates[idx as number]));
            }
            result = new DataManager(result).executeLocal(query) as { [key: string]: CellModel }[];
        }
    }
    return result;
}

/**
 * Checks whether the cell is read-only or not.
 *
 * @param {CellModel} cell - The cell to check.
 * @param {ColumnModel} column - The column associated with the cell.
 * @param {RowModel} row - The row associated with the cell.
 * @returns {boolean} - Returns true if the cell is read-only, otherwise false.
 * @hidden
 */
export function isReadOnly(cell: CellModel, column: ColumnModel, row: RowModel): boolean {
    return (cell && cell.isReadOnly) || (row && row.isReadOnly) || (column && column.isReadOnly);
}

/**
 * Checks whether a specific range of cells is read-only or not.
 *
 * @param {Workbook} parent - The spreadsheet instance.
 * @param {number[]} rangeIndexes - The range indexes to check.
 * @returns {boolean} - Returns true if any of the cells is read-only, otherwise false.
 * @hidden
 */
export function isReadOnlyCells(parent: Workbook, rangeIndexes?: number[]): boolean {
    const sheet: SheetModel = parent.getActiveSheet(); let hasReadOnlyCell: boolean;
    const address: number[] = !isNullOrUndefined(rangeIndexes) ? rangeIndexes : getSwapRange(getRangeIndexes(sheet.selectedRange));
    for (let row: number = address[0]; row <= address[2]; row++) {
        for (let col: number = address[1]; col <= address[3]; col++) {
            const cell: CellModel = getCell(row, col, sheet);
            if (isReadOnly(cell, getColumn(sheet, col), getRow(sheet, row))) {
                hasReadOnlyCell = true;
                break;
            }
        }
    }
    return hasReadOnlyCell;
}

/**
 * Checks whether the selected range in the sheet is an entire row or column and returns the updated range accordingly.
 *
 * @param {SheetModel} sheet -Specifies the sheet.
 * @param {string} range - Specify the range that need to be updated.
 * @returns {string} - Retruns updated range
 * @hidden
 */
export function getUpdatedRange(sheet: SheetModel, range?: string): string {
    let updateRange: string = range || sheet.selectedRange;
    const indexes: number[] = getRangeIndexes(updateRange);
    const maxColCount: number = sheet.colCount;
    const maxRowCount: number = sheet.rowCount;
    if (indexes[2] === maxRowCount - 1 && indexes[0] === 0) {
        updateRange = updateRange.replace(/[0-9]/g, '');
    } else if (indexes[3] === maxColCount - 1 && indexes[2] === 0) {
        updateRange = updateRange.replace(/\D/g, '');
    }
    return updateRange;
}

/**
 * Updated the top border of the adjacent merged cells
 *
 * @param {Workbook} context - The spreadsheet instance.
 * @param {number[]} rowIndexes - An array of row indexes that top border need to be updated.
 * @param {number[]} colIndexes - An array of col indexes that top border need to be updated.
 * @returns {void}
 * @hidden
 */
export function updateMergeBorder(context: Workbook, rowIndexes: number[], colIndexes?: number[]): void {
    if (!rowIndexes.length) {
        return;
    }
    const sheet: SheetModel = context.getActiveSheet(); let style: CellStyleModel;
    const parent: ExtendedWorkbook = context as ExtendedWorkbook; const frozenCol: number = context.frozenColCount(sheet);
    const startCol: number = (colIndexes && colIndexes[0]) ||
        (frozenCol ? getCellIndexes(sheet.topLeftCell)[1] : parent.viewport.leftIndex);
    const endCol: number = (colIndexes && colIndexes[1]) || parent.viewport.rightIndex;
    rowIndexes.forEach((rowIdx: number) => {
        for (let col: number = startCol; col <= endCol; col++) {
            if (col === frozenCol) {
                col += parent.viewport.leftIndex;
            }
            const prevModel: CellModel = getCell(rowIdx - 1, col, sheet, false, true);
            if (((!prevModel.rowSpan || prevModel.rowSpan === 1)
                || (!prevModel.colSpan || prevModel.colSpan === 1)) &&
                (!prevModel.style || !prevModel.style.borderBottom || prevModel.style.borderBottom === 'none')) {
                style = getCell(rowIdx, col, sheet, false, true).style;
                if (style && style.borderTop) {
                    const prevCell: HTMLElement = context.getCell(rowIdx - 1, col);
                    if (prevCell && prevCell.style.borderBottom) {
                        const curCell: HTMLElement = context.getCell(rowIdx, col);
                        if (curCell) {
                            prevCell.style.borderBottom = '';
                            curCell.style.borderTop = style.borderTop;
                        }
                    }
                }
            }
        }
    });
}
