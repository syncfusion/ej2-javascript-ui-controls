import { CellModel, ColumnModel, getCell, SheetModel } from './../base/index';
import { getCellAddress, getRangeIndexes } from './address';

/**
 * Check whether the text is formula or not.
 *
 * @param {string} text - Specify the text.
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
 * @param {number[]} range - Specify the range
 * @param {number} rowIdx - Specify the row index
 * @param {number} colIdx - Specify the col index
 * @returns {boolean} - Returns boolean value
 */
export function inRange(range: number[], rowIdx: number, colIdx: number) : boolean {
    return range && (rowIdx >= range[0] && rowIdx <= range[2] && colIdx >= range[1] && colIdx <= range[3]);
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
