import { CellModel, ColumnModel } from './../base/index';

/**
 * Check whether the text is formula or not.
 *
 * @param {string} text - Specify the text.
 * @returns {boolean} - Check whether the text is formula or not.
 */
export function checkIsFormula(text: string): boolean {
    return text && text[0] === '=' && text.length > 1;
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

export function inRange(range: number[], rowIdx: number, colIdx: number) : boolean {
    return range && (rowIdx >= range[0] && rowIdx <= range[2] && colIdx >= range[1] && colIdx <= range[3]);
}


/** @hidden */
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
