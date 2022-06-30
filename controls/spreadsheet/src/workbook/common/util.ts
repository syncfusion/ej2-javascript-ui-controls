import { CellModel, ColumnModel, getCell, SheetModel, setCell, Workbook, getSheetIndex, CellStyleModel } from './../index';
import { getCellAddress, getRangeIndexes, BeforeCellUpdateArgs, beforeCellUpdate, workbookEditOperation, CellUpdateArgs } from './index';
import { InsertDeleteModelArgs, getColumnHeaderText, ConditionalFormat, ConditionalFormatModel } from './index';
import { isUndefined } from '@syncfusion/ej2-base';

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
        range = getRangeIndexes(splitedAddress[i]);
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
    let j: number = 0;
    const numArr: number[] = [89, 71, 69];
    // XFD is the last column, for that we are using ascii values of Z, G, E (89, 71, 69) to restrict the flow.
    let cellText: string = '';
    const textLength: number = text.length;
    for (let i: number = 0; i < textLength; i++) {
        if (isChar(text[i])) {
            endNum++;
        }
    }
    cellText = text.substring(startNum, endNum);
    const cellTextLength: number = cellText.length;
    if (cellTextLength !== textLength) {
        if (cellTextLength < 4) {
            if (textLength !== 1 && (isNaN(parseInt(text, 10)))) {
                while (j < cellTextLength) {
                    if ((cellText[j]) && cellText[j].charCodeAt(0) < numArr[j]) {
                        j++;
                        continue;
                    } else if (!(cellText[j]) && j > 0) {
                        break;
                    } else {
                        return false;
                    }
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
 * @hidden
 * @param {SheetModel} sheet - Specify the sheet
 * @param {number} index - specify the index
 * @param {boolean} increase - specify the boolean value.
 * @param {string} layout - specify the string
 * @returns {number} - To skip the hidden index
 *
 */
 export function skipHiddenIdx(sheet: SheetModel, index: number, increase: boolean, layout: string = 'rows'): number {
    if (increase) {
        for (let i: number = index; i < Infinity; i++) {
            if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
                index++;
            } else {
                break;
            }
        }
    } else {
        for (let i: number = index; i > -1; i--) {
            if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
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
 * @param {CellModel} prevCell - copied or prev cell
 * @returns {string} - retruns updated formula
 * @hidden
 */
export function getUpdatedFormula(currIndexes: number[], prevIndexes: number[], sheet: SheetModel, prevCell?: CellModel): string {
    let cIdxValue: string; let cell: CellModel;
    if (prevIndexes) {
        cell = prevCell || getCell(prevIndexes[0], prevIndexes[1], sheet, false, true);
        cIdxValue = cell.formula ? cell.formula.toUpperCase() : '';
    }
    if (cIdxValue) {
        if (cIdxValue.indexOf('=') === 0) {
            cIdxValue = cIdxValue.slice(1);
        }
        cIdxValue = cIdxValue.split('(').join(',').split(')').join(',');
        const formulaOperators: string[] = ['+', '-', '*', '/', '>=', '<=', '<>', '>', '<', '=', '%']; let splitArray: string[];
        let value: string = cIdxValue;
        for (let i: number = 0; i < formulaOperators.length; i++) {
            splitArray = value.split(formulaOperators[i]);
            value = splitArray.join(',');
        }
        splitArray = value.split(',');
        const newAddress: { [key: string]: string }[] = []; let newRef: string; let refObj: { [key: string]: string };
        for (let j: number = 0; j < splitArray.length; j++) {
            if (isCellReference(splitArray[j])) {
                const range: number[] = getRangeIndexes(splitArray[j]);
                const newRange: number[] = [currIndexes[0] - (prevIndexes[0] - range[0]), currIndexes[1] - (prevIndexes[1] - range[1]),
                    currIndexes[0] - (prevIndexes[0] - range[2]), currIndexes[1] - (prevIndexes[1] - range[3])];
                if (newRange[0] < 0 || newRange[1] < 0 || newRange[2] < 0 || newRange[3] < 0) {
                    newRef = '#REF!';
                } else {
                    newRef = getCellAddress(newRange[0], newRange[1]);
                    if (splitArray[j].includes(':')) {
                        newRef += (':' + getCellAddress(newRange[2], newRange[3]));
                    }
                    newRef = isCellReference(newRef) ? newRef : '#REF!';
                }
                refObj = {}; refObj[splitArray[j]] = newRef;
                if (splitArray[j].includes(':')) {
                    newAddress.splice(0, 0, refObj);
                } else {
                    newAddress.push(refObj);
                }
            }
        }
        let objKey: string; cIdxValue = cell.formula;
        for (let j: number = 0; j < newAddress.length; j++) {
            objKey = Object.keys(newAddress[j])[0];
            cIdxValue = cIdxValue.replace(new RegExp(objKey, 'gi'), newAddress[j][objKey].toUpperCase());
        }
        return cIdxValue;
    } else {
        return null;
    }
}

/**@hidden */
export function updateCell(context: Workbook, sheet: SheetModel, prop: CellUpdateArgs): boolean {
    const args: BeforeCellUpdateArgs = { cell: prop.cell, rowIndex: prop.rowIdx, colIndex: prop.colIdx, cancel: false, sheet: sheet.name };
    if (!prop.preventEvt) { // Prevent event triggering for public method cell update.
        context.trigger(beforeCellUpdate, args);
    }
    if (!prop.eventOnly && !args.cancel) { // `eventOnly` - To trigger event event and return without cell model update.
        if (prop.valChange) {
            const prevCell: CellModel = getCell(args.rowIndex, args.colIndex, sheet);
            const prevCellVal: string = !prop.preventEvt && context.getDisplayText(prevCell);
            const isFormulaCell: boolean = !!(prevCell && prevCell.formula);
            setCell(args.rowIndex, args.colIndex, sheet, args.cell, !prop.pvtExtend);
            const cell: CellModel = getCell(args.rowIndex, args.colIndex, sheet, false, true);
            context.notify(
                workbookEditOperation, { action: 'updateCellValue', address: [args.rowIndex, args.colIndex], sheetIndex:
                getSheetIndex(context, sheet.name), value: isFormulaCell && !cell.formula ? (cell.value ||
                    (<unknown>cell.value === 0 ? '0' : '')) : (cell.formula || cell.value ||
                        (<unknown>cell.value === 0 ? '0' : '')) });
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
                    args.rowIndex, args.colIndex, prop.lastCell, prop.td, prop.checkCF, prop.checkWrap);
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
    }
    const isEmptyColumn: Function = (idx: number): boolean => {
        for (let i: number = sRowIdx; i <= eRowIdx; i++) {
            if (!isUndefined(getCell(i, idx, sheet, null, true).value)) {
                return false;
            }
        }
        return true;
    }
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
 * @returns {number[]} - retruns updated range
 * @hidden
 */
export function insertFormatRange(args: InsertDeleteModelArgs, formatRange: number[], isAction: boolean): number[] {
    let sltRangeIndex: number[] = getRangeIndexes(args.model.selectedRange); let insertStartIndex: number = 0; let insertEndIndex: number = 0;
    if (args.modelType === 'Column') {
        if (isAction) {
            sltRangeIndex = [0,args.start as number,0,args.end];
        }
        if (args.insertType === "before") {
            if ((formatRange[1] <= sltRangeIndex[1] && formatRange[3] >= sltRangeIndex[1])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            } else if (sltRangeIndex[1] < formatRange[1]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            }
        } else {
            if ((formatRange[1] <= sltRangeIndex[3] && formatRange[3] >= sltRangeIndex[3])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            } else if (sltRangeIndex[3] < formatRange[3]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[3] - sltRangeIndex[1]) + 1;
            }
        }
        return [formatRange[0], formatRange[1] + insertStartIndex, formatRange[2], formatRange[3] + insertEndIndex];
    } else {
        if (isAction) {
            sltRangeIndex = [args.start as number,0,args.end,0];
        }
        if (args.insertType === "above") {
            if ((formatRange[0] <= sltRangeIndex[0] && formatRange[2] >= sltRangeIndex[0])) {
                insertStartIndex = 0;
                insertEndIndex = (sltRangeIndex[2] - sltRangeIndex[0]) + 1;
            } else if (sltRangeIndex[0] < formatRange[0]) {
                insertStartIndex = insertEndIndex = (sltRangeIndex[2] - sltRangeIndex[0]) + 1;
            }
        } else {
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

/** @hidden */
export function updateCFModel(curCF: ConditionalFormat[], cfRule: ConditionalFormatModel[], rowIdx: number, colIdx: number): void {
    let cfRange: string[]; let indexes: number[];
    for (let i: number = curCF.length - 1; i >= 0; i--) {
        cfRange = curCF[i].range.trim().split(',');
        for (let j: number = 0; j < cfRange.length; j++) {
            indexes = getRangeIndexes(cfRange[j].includes(':') ? cfRange[j] : `${cfRange[j]}:${cfRange[j]}`);
            if (rowIdx >= indexes[0] && colIdx >= indexes[1] && rowIdx <= indexes[2] && colIdx <= indexes[3]) {
                cfRule.push(curCF[i]);
                curCF.splice(i, 1);
                break;
            }
        }
    }
}
