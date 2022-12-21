import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Workbook, SheetModel, getSheetIndex, getSheetNameFromAddress } from '../base/index';

/**
 * To get range indexes.
 *
 * @param {string} range - Specifies the range.
 * @returns {number[]} - To get range indexes.
 */
export function getRangeIndexes(range: string): number[] {
    let cellindexes: number[];
    const indexes: number[] = [];
    range = range.indexOf('!') > -1 ? range.split('!')[1] : range;
    range = range.indexOf(':') === -1 ? range + ':' + range : range;
    range.split(':').forEach((address: string) => {
        cellindexes = getCellIndexes(address);
        indexes.push(cellindexes[0]);
        indexes.push(cellindexes[1]);
    });
    return indexes;
}

/**
 * To get single cell indexes
 *
 * @param {string} address - Specifies the address.
 * @returns {number[]} - To get single cell indexes
 */
export function getCellIndexes(address: string): number[] {
    return [parseInt(address.match(/\d+/)[0], 10) - 1, getColIndex(address.match(/[A-Z]+/i)[0].toUpperCase())];
}

/**
 * To get column index from text.
 *
 * @hidden
 * @param {string} text - Specifies the text.
 * @returns {number} - To get column index from text.
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
 * To get cell address from given row and column index.
 *
 * @param {number} sRow - Specifies the row.
 * @param {number} sCol - Specifies the col.
 * @returns {string} - To get cell address from given row and column index.
 */
export function getCellAddress(sRow: number, sCol: number): string {
    return getColumnHeaderText(sCol + 1) + (sRow + 1);
}

/**
 * To get range address from given range indexes.
 *
 * @param {number[]} range - Specifies the range.
 * @returns {string} - To get range address from given range indexes.
 */
export function getRangeAddress(range: number[]): string {
    return getCellAddress(range[0], range[1]) + ':' + (!isNullOrUndefined(range[2]) ?
        getCellAddress(range[2], range[3]) : getCellAddress(range[0], range[1]));
}

/**
 * To get column header cell text
 *
 * @param {number} colIndex - Specifies the colIndex.
 * @returns {string} - Get Column Header Text
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
 * @hidden
 * @param {SheetModel} address - Specifies the address.
 * @returns {number[]} - Get Indexes From Address
 */
export function getIndexesFromAddress(address: string): number[] {
    return getRangeIndexes(getRangeFromAddress(address));
}

/**
 * @hidden
 * @param {SheetModel} address - Specifies the address.
 * @returns {string} - Get Range From Address.
 */
export function getRangeFromAddress(address: string): string {
    return address.split('!')[1] || address;
}

/**
 * Get complete address for selected range
 *
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @returns {string} - Get complete address for selected range
 */
export function getAddressFromSelectedRange(sheet: SheetModel): string {
    return sheet.name + '!' + sheet.selectedRange;
}

/**
 * @param {Workbook} context - Specifies the context.
 * @param {string} address - Specifies the address.
 * @returns {Object} - To get Address Info
 * @hidden
 */
export function getAddressInfo(context: Workbook, address: string): { sheetIndex: number, indices: number[] } {
    return { sheetIndex: getSheetIndexFromAddress(context, address), indices: getIndexesFromAddress(address) };
}

/**
 * @param {Workbook} context - Specifies the context.
 * @param {string} address - Specifies the address.
 * @returns {number} - return the sheet index.
 * @hidden
 */
export function getSheetIndexFromAddress(context: Workbook, address: string): number {
    let sIdx: number;
    if (address.indexOf('!') > -1) {
        sIdx = getSheetIndex(context, getSheetNameFromAddress(address));
    } else {
        sIdx = context.activeSheetIndex;
    }
    return sIdx;
}

/**
 * Given range will be swapped/arranged in increasing order.
 *
 * @hidden
 * @param {number[]} range - Specifies the range.
 * @returns {number[]} - Returns the bool value.
 */
export function getSwapRange(range: number[]): number[] {
    const clonedRange: number[] = range.slice();
    if (range[0] > range[2]) {
        swap(clonedRange, 0, 2);
    }
    if (range[1] > range[3]) {
        swap(clonedRange, 1, 3);
    }
    return clonedRange;
}

/**
 * Interchange values in an array
 *
 * @param {number[]} range - Specifies the range.
 * @param {number} x - Specifies the x.
 * @param {number} y - Specifies the y.
 * @returns {void} - Interchange values in an array.
 */
function swap(range: number[], x: number, y: number): void {
    const tmp: number = range[x as number];
    range[x as number] = range[y as number];
    range[y as number] = tmp;
}

/**
 * @hidden
 * @param {number[]} range - Specifies the range.
 * @returns {boolean} - Returns the bool value.
 */
export function isSingleCell(range: number[]): boolean {
    return range[0] === range[2] && range[1] === range[3];
}
