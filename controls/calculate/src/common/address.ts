import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Sheet bounds used when expanding whole-row / whole-column references.
 *
 * @hidden
 */
export interface SheetBounds {
    rowCount?: number;
    colCount?: number;
}

/**
 * Returns the 0-based column index for Excel column letters (for example `"A"` → `0`).
 *
 * @hidden
 * @param {string} text - Specifies the text.
 * @returns {number} - Column index (0-based).
 */
export function getColIndex(text: string): number {
    let colIdx: number = 0;
    text = text.split('').reverse().join('');
    for (let i: number = text.length - 1; i >= 0; i--) {
        colIdx += (text[i as number].charCodeAt(0) - 64) * (Math.pow(26, i));
    }
    return colIdx - 1;
}

/**
 * Returns Excel column letters for a 1-based column index (for example `1` → `"A"`).
 *
 * @hidden
 * @param {number} colIndex - 1-based column index.
 * @returns {string} - Column header text.
 */
export function getColumnHeaderText(colIndex: number): string {
    const alphabet: string = 'Z';
    if (colIndex / 26 > 1) {
        return getColumnHeaderText((colIndex % 26 === 0) ? (colIndex / 26 - 1) : Math.floor(colIndex / 26))
            + String.fromCharCode((colIndex % 26) === 0 ? alphabet.charCodeAt(0) : 64 + (colIndex % 26));
    } else {
        return String.fromCharCode(64 + (colIndex));
    }
}

/**
 * Parses a cell address into 0-based `[rowIndex, colIndex]`.
 *
 * @hidden
 * @param {string} address - Specifies the address.
 * @returns {number[]} - [rowIndex, colIndex] (0-based).
 */
export function getCellIndexes(address: string): number[] {
    return [parseInt(address.match(/\d+/)[0], 10) - 1, getColIndex(address.match(/[A-Z]+/i)[0].toUpperCase())];
}

/**
 * Builds an `A1`-style cell address from 0-based row and column indexes.
 *
 * @hidden
 * @param {number} sRow - Row index (0-based).
 * @param {number} sCol - Column index (0-based).
 * @returns {string} - Cell address.
 */
export function getCellAddress(sRow: number, sCol: number): string {
    return getColumnHeaderText(sCol + 1) + (sRow + 1);
}

/**
 * Builds an `A1:B2`-style range address from range indexes.
 *
 * @hidden
 * @param {number[]} range - Range indexes.
 * @returns {string} - Range address.
 */
export function getRangeAddress(range: number[]): string {
    return getCellAddress(range[0], range[1]) + ':' + (!isNullOrUndefined(range[2]) ?
        getCellAddress(range[2], range[3]) : getCellAddress(range[0], range[1]));
}

/**
 * Parses a range string into `[startRow, startCol, endRow, endCol]` (0-based).
 *
 * @hidden
 * @param {string} range - Range string (optional sheet prefix allowed).
 * @param {SheetBounds} [sheetBounds] - Optional sheet bounds for whole-row/column expansion.
 * @returns {number[]} - Range indexes [startRow, startCol, endRow, endCol].
 */
export function getRangeIndexes(range: string, sheetBounds?: SheetBounds): number[] {
    let cellindexes: number[];
    const indexes: number[] = [];
    if (range) {
        range = range.lastIndexOf('!') > -1 ? range.substring(range.lastIndexOf('!') + 1) : range;
        range = range.indexOf(':') === -1 ? range + ':' + range : range;
        const containsAlphabetsAndDigits: RegExp = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)/g);
        if (!containsAlphabetsAndDigits.test(range)) {
            const refArr: string[] = range.split(':');
            const rowCount: number = sheetBounds && sheetBounds.rowCount ? sheetBounds.rowCount - 1 : 1;
            const colHeader: string = sheetBounds && sheetBounds.colCount ?
                getColumnHeaderText(sheetBounds.colCount) : 'A';
            range = isNullOrUndefined(range.match(/[0-9]/)) ? (refArr[0] + '1:' + refArr[1] + rowCount) :
                ('A' + refArr[0] + ':' + colHeader + refArr[1]);
        }
        range.split(':').forEach((address: string) => {
            cellindexes = getCellIndexes(address);
            indexes.push(cellindexes[0]);
            indexes.push(cellindexes[1]);
        });
    }
    return indexes;
}
