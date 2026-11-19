/**
 * Public cell value types for M1.1 worksheet cells.
 *
 * Citations: `ST_CellType` in transitional sml.xsd; docs/specs/worksheet-cells.md.
 */

/**
 * The error codes a cell can contain, such as `#DIV/0!` or `#N/A`.
 * Not part of the shipped package surface (`stripInternal`); public
 * {@link CellError.code} remains a plain `string`.
 *
 * @private
 */
export type CellErrorCode =
    | '#NULL!'
    | '#DIV/0!'
    | '#VALUE!'
    | '#REF!'
    | '#NAME?'
    | '#NUM!'
    | '#N/A'
    | '#GETTING_DATA'
    | '#SPILL!'
    | '#CALC!'
    | '#FIELD!'
    | '#CONNECT!'
    | '#BLOCKED!'
    | '#UNKNOWN!'
    | '#FIELD'
    | '#CALC'
    | '#SPILL'
    | '#UNKNOWN'
    | '#BLOCKED'
    | '#CONNECT'
    | '#GETTING_DATA!';

/**
 * Represents an error value stored in a cell, such as `#DIV/0!` or `#N/A`,
 * letting you detect and inspect formula errors in worksheet data.
 */
export interface CellError {
    /** Always `'error'`; marks the cell value as an error. */
    readonly type: 'error';
    /** The error code, such as `#DIV/0!` or `#N/A`. */
    readonly code: string;
}

/**
 * The possible contents of a cell: nothing, a number, text, a boolean, or
 * an error value.
 */
export type CellValue = null | number | string | boolean | CellError;

/**
 * The set of error codes the library accepts when writing an error value to
 * a cell.
 */
export const KNOWN_CELL_ERROR_CODES: ReadonlySet<string> = new Set([
    '#NULL!',
    '#DIV/0!',
    '#VALUE!',
    '#REF!',
    '#NAME?',
    '#NUM!',
    '#N/A',
    '#GETTING_DATA',
    '#SPILL!',
    '#CALC!',
    '#FIELD!',
    '#CONNECT!',
    '#BLOCKED!',
    '#UNKNOWN!'
]);

/**
 * Checks whether a value is a {@link CellError} object, letting you distinguish error cells from other cell contents.
 *
 * @param {*} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
export function isCellError(value: unknown): value is CellError {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as CellError).type === 'error' &&
        typeof (value as CellError).code === 'string'
    );
}
