/**
 * Check whether the value is character or not.
 *
 * @hidden
 * @param {string} value - Specify the value to check.
 * @returns {boolean} - Returns boolean value.
 */
export function isChar(value: string): boolean {
    if ((value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) || (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122)) {
        return true;
    }
    return false;
}

/**
 * Resolve column index from cell text (1-based Excel style).
 *
 * @hidden
 * @param {string} cell - Cell text.
 * @returns {number} - Column index.
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
 * Check whether the value is a valid single cell reference.
 *
 * @hidden
 * @param {string} value - Specify the value to check.
 * @returns {boolean} - Returns boolean value.
 */
export function isValidCellReference(value: string): boolean {
    const text: string = value;
    let endNum: number = 0;
    const textLength: number = text.length;
    for (let i: number = 0; i < textLength; i++) {
        if (isChar(text[i as number])) {
            endNum++;
        }
    }
    const cellText: string = text.substring(0, endNum);
    const cellTextLength: number = cellText.length;
    if (cellTextLength !== textLength) {
        if (cellTextLength < 4) {
            if (textLength !== 1 && (isNaN(parseInt(text, 10)))) {
                const cellColIndex: number = columnIndex(cellText);
                // XFD is the last column, 16384 - Maximum number of columns in excel.
                if (cellColIndex < 1 || cellColIndex > 16384) {
                    return false;
                }
                const rowText: string = text.substring(endNum, textLength);
                if (rowText.length > 0) {
                    let isNumeric: boolean = true;
                    for (let j: number = 0; j < rowText.length; j++) {
                        const charCode: number = rowText.charCodeAt(j as number);
                        if (charCode < 48 || charCode > 57) {
                            isNumeric = false;
                            break;
                        }
                    }
                    if (isNumeric) {
                        const cellNumber: number = parseFloat(rowText);
                        if (cellNumber > 0 && cellNumber < 1048577) { // 1048576 - Maximum number of rows in excel.
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

/**
 * Check whether the value is cell reference or not.
 *
 * @hidden
 * @param {string} value - Specify the value to check.
 * @returns {boolean} - Returns boolean value.
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
