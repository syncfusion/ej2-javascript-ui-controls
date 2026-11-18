/**
 * A1-style cell reference encode/decode (sheet-local).
 *
 * Excel grid limits: columns A–XFD (1–16384), rows 1–1048576.
 * Absolute markers (`$`) are accepted on parse and stripped for storage keys;
 * {@link formatA1} always emits relative form.
 *
 * Citations: ECMA-376-1 cell reference conventions; `ST_CellRef` / `ST_Ref`
 * in transitional sml.xsd.
 */

import { InvalidAddressError, InvalidMergeRefError } from '../core/errors';

/** Maximum 1-based column index (XFD). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const MAX_COLUMN: 16384 = 16384;

/** Maximum 1-based row index. */
export const MAX_ROW: 1048576 = 1_048_576;

/**
 * Zero-cost coordinate pair (1-based row and column).
 *
 * @private
 */
export interface CellCoord {
    readonly row: number;
    readonly col: number;
}

/**
 * Inclusive rectangular range in 1-based row/column coordinates.
 * Used for `ST_Ref` merge ranges and similar sheet-local refs.
 *
 * @private
 */
export interface CellRange {
    readonly startRow: number;
    readonly startCol: number;
    readonly endRow: number;
    readonly endCol: number;
}

const A1_RE: RegExp = /^(\$?)([A-Za-z]{1,3})(\$?)([1-9][0-9]{0,6})$/;

/**
 * parseA1 function.
 *
 * @param {string} address - The address parameter.
 * @returns {CellCoord} - Returns the result.
 */
export function parseA1(address: string): CellCoord {
    const trimmed: string = address.trim();
    const m: RegExpExecArray = A1_RE.exec(trimmed);
    if (m === null) {
        throw new InvalidAddressError(`Invalid cell address "${address}"`);
    }
    const colLetters: string = m[2];
    const rowRaw: string = m[4];
    if (colLetters === undefined || rowRaw === undefined) {
        throw new InvalidAddressError(`Invalid cell address "${address}"`);
    }
    const col: number = columnLettersToIndex(colLetters);
    const row: number = Number.parseInt(rowRaw, 10);
    if (!Number.isInteger(row) || row < 1 || row > MAX_ROW) {
        throw new InvalidAddressError(`Invalid cell address "${address}" (row out of range)`);
    }
    if (col < 1 || col > MAX_COLUMN) {
        throw new InvalidAddressError(`Invalid cell address "${address}" (column out of range)`);
    }
    return { row, col };
}

/**
 * formatA1 function.
 *
 * @param {number} row - The row parameter.
 * @param {number} col - The col parameter.
 * @returns {string} - Returns the result.
 */
export function formatA1(row: number, col: number): string {
    if (!Number.isInteger(row) || row < 1 || row > MAX_ROW) {
        throw new InvalidAddressError(`Invalid row ${row}`);
    }
    if (!Number.isInteger(col) || col < 1 || col > MAX_COLUMN) {
        throw new InvalidAddressError(`Invalid column ${col}`);
    }
    return `${columnIndexToLetters(col)}${row}`;
}

/**
 * parseA1Range function.
 *
 * @param {string} ref - The ref parameter.
 * @returns {CellRange} - Returns the result.
 */
export function parseA1Range(ref: string): CellRange {
    const trimmed: string = ref.trim();
    if (trimmed.length === 0) {
        throw new InvalidMergeRefError(`Invalid merge ref "${ref}"`);
    }
    const colon: number = trimmed.indexOf(':');
    if (colon < 0) {
        let coord: CellCoord;
        try {
            coord = parseA1(trimmed);
        } catch (err) {
            throw new InvalidMergeRefError(`Invalid merge ref "${ref}"`, { cause: err });
        }
        return {
            startRow: coord.row,
            startCol: coord.col,
            endRow: coord.row,
            endCol: coord.col
        };
    }
    const left: string = trimmed.slice(0, colon);
    const right: string = trimmed.slice(colon + 1);
    if (left.length === 0 || right.length === 0 || right.includes(':')) {
        throw new InvalidMergeRefError(`Invalid merge ref "${ref}"`);
    }
    let start: CellCoord;
    let end: CellCoord;
    try {
        start = parseA1(left);
        end = parseA1(right);
    } catch (err) {
        throw new InvalidMergeRefError(`Invalid merge ref "${ref}"`, { cause: err });
    }
    if (end.row < start.row || end.col < start.col) {
        throw new InvalidMergeRefError(`Invalid merge ref "${ref}" (inverted range)`);
    }
    return {
        startRow: start.row,
        startCol: start.col,
        endRow: end.row,
        endCol: end.col
    };
}

/**
 * formatA1Range function.
 *
 * @param {CellRange} range - The range parameter.
 * @returns {string} - Returns the result.
 */
export function formatA1Range(range: CellRange): string {
    const a: string = formatA1(range.startRow, range.startCol);
    if (range.startRow === range.endRow && range.startCol === range.endCol) {
        return a;
    }
    const b: string = formatA1(range.endRow, range.endCol);
    return `${a}:${b}`;
}

/**
 * Convert 1-based column index to letters (`1` → `A`, `16384` → `XFD`).
 *
 * @param {number} col - The col parameter.
 * @returns {string} - Returns the result.
 */
export function columnIndexToLetters(col: number): string {
    if (!Number.isInteger(col) || col < 1 || col > MAX_COLUMN) {
        throw new InvalidAddressError(`Invalid column ${col}`);
    }
    let n: number = col;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}

/**
 * Convert column letters to 1-based index (`A` → `1`, `XFD` → `16384`).
 *
 * @param {string} letters - The letters parameter.
 * @returns {number} - Returns the result.
 */
export function columnLettersToIndex(letters: string): number {
    const upper: string = letters.toUpperCase();
    if (!/^[A-Z]{1,3}$/.test(upper)) {
        throw new InvalidAddressError(`Invalid column letters "${letters}"`);
    }
    let n: number = 0;
    for (let i: number = 0; i < upper.length; i += 1) {
        const code: number = upper.charCodeAt(i) - 64; // A=1
        n = n * 26 + code;
    }
    if (n < 1 || n > MAX_COLUMN) {
        throw new InvalidAddressError(`Invalid column letters "${letters}"`);
    }
    return n;
}
