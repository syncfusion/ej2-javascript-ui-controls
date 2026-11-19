import { PDF417CompactionMode, PDF417ErrorCorrectionLevel } from '../barcode/enum/enum';
import { PDF417_CODEWORD_PATTERNS } from './pdf417-tables';

/**
 * PDF417 symbology encoder (ISO/IEC 15438).
 * This module is DOM independent: it converts a value into codewords and a module matrix.
 */

/** @private */
export type PDF417ErrorKey =
    'EmptyValue' | 'InvalidTextValue' | 'InvalidNumericValue' | 'InvalidCompactionMode' |
    'InvalidErrorCorrectionLevel' | 'InvalidRows' | 'InvalidColumns' | 'InvalidSymbolSize' | 'InvalidRowHeightRatio' |
    'CapacityExceeded' | 'InsufficientSize';

/** @private */
export interface PDF417EncodeOptions {
    value: string;
    compactionMode?: PDF417CompactionMode;
    errorCorrectionLevel?: PDF417ErrorCorrectionLevel;
    /** 0 = calculate automatically, otherwise 3..90. */
    rows?: number;
    /** 0 = calculate automatically, otherwise 1..30. */
    columns?: number;
    /** Compact (truncated) PDF417: omits the right row indicator and shortens the stop pattern. */
    isCompact?: boolean;
    /** Row height as a multiple of the module width (Y/X). Defaults to 3, the ISO/IEC 15438 minimum. */
    rowHeightRatio?: number;
    /** Width available for the symbol, used to choose rows/columns automatically. */
    availableWidth?: number;
    /** Height available for the symbol, used to choose rows/columns automatically. */
    availableHeight?: number;
    /**
     * Rows and columns of the previous automatic layout. Reused when it still holds the data,
     * so a width or height change scales the symbol instead of choosing a new layout.
     */
    previousLayout?: { rows: number, columns: number };
}

/** @private */
export interface PDF417EncodeResult {
    success: boolean;
    error?: PDF417ErrorKey;
    rows?: number;
    columns?: number;
    errorCorrectionLevel?: number;
    /** Symbol length descriptor, data and pad codewords. */
    dataCodewords?: number[];
    /** dataCodewords followed by the error correction codewords. */
    codewords?: number[];
    /** One entry per symbol row; each entry holds one value per module (1 = bar). */
    matrix?: number[][];
    /** Number of modules in each row, excluding the quiet zone. */
    moduleCount?: number;
}

/** @private */
export const PDF417_MIN_ROWS: number = 3;
/** @private */
export const PDF417_MAX_ROWS: number = 90;
/** @private */
export const PDF417_MIN_COLUMNS: number = 1;
/** @private */
export const PDF417_MAX_COLUMNS: number = 30;
/** @private */
export const PDF417_MAX_CODEWORDS: number = 928;
/** Minimum row height, in modules, required by ISO/IEC 15438. @private */
export const PDF417_MIN_ROW_HEIGHT: number = 3;
/** Minimum quiet zone, in modules, on every side of the symbol. @private */
export const PDF417_QUIET_ZONE: number = 2;

const TEXT_LATCH: number = 900;
const BYTE_LATCH: number = 901;
const NUMERIC_LATCH: number = 902;
const BYTE_SHIFT: number = 913;
const BYTE_LATCH_6: number = 924;
const ECI_CHARACTER_SET: number = 927;
const ECI_UTF8: number = 26;
const PAD: number = 900;

/* Start pattern 81111113 and stop pattern 711311121, as bar/space widths. */
const START_PATTERN: number[] = [8, 1, 1, 1, 1, 1, 1, 3];
const STOP_PATTERN: number[] = [7, 1, 1, 3, 1, 1, 1, 2, 1];

const enum TextSubMode { Alpha = 0, Lower = 1, Mixed = 2, Punctuation = 3 }

/* Character tables for the Mixed and Punctuation text sub-modes (value -> index). */
const MIXED_CHARS: number[] = [
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 38, 13, 9, 44, 58,
    35, 45, 46, 36, 47, 43, 37, 42, 61, 94, -1, 32, -1, -1, -1];
const PUNCTUATION_CHARS: number[] = [
    59, 60, 62, 64, 91, 92, 93, 95, 96, 126, 33, 13, 9, 44, 58,
    10, 45, 46, 36, 47, 34, 124, 42, 40, 41, 63, 123, 125, 39, -1];

const MIXED_LOOKUP: number[] = createLookup(MIXED_CHARS);
const PUNCTUATION_LOOKUP: number[] = createLookup(PUNCTUATION_CHARS);

const generatorCache: number[][] = [];

function createLookup(chars: number[]): number[] {
    const lookup: number[] = [];
    for (let i: number = 0; i < 128; i++) {
        lookup.push(-1);
    }
    for (let i: number = 0; i < chars.length; i++) {
        if (chars[parseInt(i.toString(), 10)] >= 0) {
            lookup[chars[parseInt(i.toString(), 10)]] = i;
        }
    }
    return lookup;
}

function isDigit(ch: number): boolean {
    return ch >= 48 && ch <= 57;
}

function isAlphaUpper(ch: number): boolean {
    return ch === 32 || (ch >= 65 && ch <= 90);
}

function isAlphaLower(ch: number): boolean {
    return ch === 32 || (ch >= 97 && ch <= 122);
}

function isMixed(ch: number): boolean {
    return ch < 128 && MIXED_LOOKUP[parseInt(ch.toString(), 10)] !== -1;
}

function isPunctuation(ch: number): boolean {
    return ch < 128 && PUNCTUATION_LOOKUP[parseInt(ch.toString(), 10)] !== -1;
}

/**
 * Returns true when the character can be represented in Text compaction.
 *
 * @returns {boolean} true when the character is a text character.
 * @param {number} ch - character code
 * @private
 */
export function isPDF417TextCharacter(ch: number): boolean {
    return ch === 9 || ch === 10 || ch === 13 || (ch >= 32 && ch <= 126);
}

/**
 * Converts the value into byte-sized units. ASCII characters stay as they are; any other
 * character is written as UTF-8, and the caller emits an ECI 000026 (UTF-8) designator.
 *
 * @returns {number[]} message units
 * @param {string} value - value to convert
 * @private
 */
export function toPDF417MessageUnits(value: string): { units: number[], isUtf8: boolean } {
    const units: number[] = [];
    let isUtf8: boolean = false;
    for (let i: number = 0; i < value.length; i++) {
        let code: number = value.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < value.length) {
            const low: number = value.charCodeAt(i + 1);
            if (low >= 0xDC00 && low <= 0xDFFF) {
                code = ((code - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
                i++;
            }
        }
        if (code < 0x80) {
            units.push(code);
        } else {
            isUtf8 = true;
            if (code < 0x800) {
                units.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
            } else if (code < 0x10000) {
                units.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
            } else {
                units.push(0xF0 | (code >> 18), 0x80 | ((code >> 12) & 0x3F), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
            }
        }
    }
    return { units: units, isUtf8: isUtf8 };
}

/**
 * Encodes a run of text characters. Returns the text sub-mode that is active at the end.
 *
 * @param {number[]} msg - source character codes
 * @param {number} start - start index in msg
 * @param {number} count - number of characters to encode
 * @param {number[]} output - output codeword array
 * @param {TextSubMode} initialSubMode - starting sub-mode
 * @returns {TextSubMode} active sub-mode
 * @private
 */
function encodeText(msg: number[], start: number, count: number, output: number[], initialSubMode: TextSubMode): TextSubMode {
    const tmp: number[] = [];
    let subMode: TextSubMode = initialSubMode;
    let idx: number = 0;
    while (idx < count) {
        const ch: number = msg[start + idx];
        switch (subMode) {
        case TextSubMode.Alpha:
            if (isAlphaUpper(ch)) {
                tmp.push(ch === 32 ? 26 : ch - 65);
            } else if (isAlphaLower(ch)) {
                subMode = TextSubMode.Lower;
                tmp.push(27); // ll
                continue;
            } else if (isMixed(ch)) {
                subMode = TextSubMode.Mixed;
                tmp.push(28); // ml
                continue;
            } else {
                tmp.push(29); // ps
                tmp.push(PUNCTUATION_LOOKUP[parseInt(ch.toString(), 10)]);
            }
            break;
        case TextSubMode.Lower:
            if (isAlphaLower(ch)) {
                tmp.push(ch === 32 ? 26 : ch - 97);
            } else if (isAlphaUpper(ch)) {
                tmp.push(27); // as
                tmp.push(ch - 65);
            } else if (isMixed(ch)) {
                subMode = TextSubMode.Mixed;
                tmp.push(28); // ml
                continue;
            } else {
                tmp.push(29); // ps
                tmp.push(PUNCTUATION_LOOKUP[parseInt(ch.toString(), 10)]);
            }
            break;
        case TextSubMode.Mixed:
            if (isMixed(ch)) {
                tmp.push(MIXED_LOOKUP[parseInt(ch.toString(), 10)]);
            } else if (isAlphaUpper(ch)) {
                subMode = TextSubMode.Alpha;
                tmp.push(28); // al
                continue;
            } else if (isAlphaLower(ch)) {
                subMode = TextSubMode.Lower;
                tmp.push(27); // ll
                continue;
            } else {
                if (idx + 1 < count && isPunctuation(msg[start + idx + 1])) {
                    subMode = TextSubMode.Punctuation;
                    tmp.push(25); // pl
                    continue;
                }
                tmp.push(29); // ps
                tmp.push(PUNCTUATION_LOOKUP[parseInt(ch.toString(), 10)]);
            }
            break;
        default:
            if (isPunctuation(ch)) {
                tmp.push(PUNCTUATION_LOOKUP[parseInt(ch.toString(), 10)]);
            } else {
                subMode = TextSubMode.Alpha;
                tmp.push(29); // al
                continue;
            }
            break;
        }
        idx++;
    }
    if (tmp.length % 2 !== 0) {
        tmp.push(29); // pad with ps
    }
    for (let i: number = 0; i < tmp.length; i += 2) {
        output.push(tmp[parseInt(i.toString(), 10)] * 30 + tmp[i + 1]);
    }
    return subMode;
}

/**
 * Encodes bytes using Byte compaction (or a single byte shift when inside Text compaction).
 *
 * @param {number[]} msg - source character codes
 * @param {number} start - start index in msg
 * @param {number} count - number of bytes to encode
 * @param {number[]} output - output codeword array
 * @param {boolean} useShift - when true and count is 1, emit a single-byte shift
 * @returns {void}
 * @private
 */
function encodeBytes(msg: number[], start: number, count: number, output: number[], useShift: boolean): void {
    if (count === 1 && useShift) {
        output.push(BYTE_SHIFT, msg[parseInt(start.toString(), 10)]);
        return;
    }
    output.push(count % 6 === 0 ? BYTE_LATCH_6 : BYTE_LATCH);
    let idx: number = start;
    const end: number = start + count;
    while (end - idx >= 6) {
        // 6 bytes (48 bits) fit exactly in a double, so plain arithmetic is safe here.
        let t: number = 0;
        for (let i: number = 0; i < 6; i++) {
            t = t * 256 + msg[idx + i];
        }
        const chunk: number[] = [];
        for (let i: number = 0; i < 5; i++) {
            chunk.unshift(t % 900);
            t = Math.floor(t / 900);
        }
        for (let i: number = 0; i < 5; i++) {
            output.push(chunk[parseInt(i.toString(), 10)]);
        }
        idx += 6;
    }
    for (; idx < end; idx++) {
        output.push(msg[parseInt(idx.toString(), 10)]);
    }
}

/**
 * Encodes digits using Numeric compaction: groups of up to 44 digits, prefixed with 1, in base 900.
 *
 * @param {number[]} msg - source character codes
 * @param {number} start - start index in msg
 * @param {number} count - number of digits to encode
 * @param {number[]} output - output codeword array
 * @returns {void}
 * @private
 */
function encodeNumeric(msg: number[], start: number, count: number, output: number[]): void {
    let idx: number = 0;
    while (idx < count) {
        const len: number = Math.min(44, count - idx);
        // Decimal digits of "1" + group, most significant first.
        let digits: number[] = [1];
        for (let i: number = 0; i < len; i++) {
            digits.push(msg[start + idx + i] - 48);
        }
        const chunk: number[] = [];
        // Repeated long division by 900.
        while (digits.length > 0 && !(digits.length === 1 && digits[0] === 0)) {
            const quotient: number[] = [];
            let remainder: number = 0;
            for (let i: number = 0; i < digits.length; i++) {
                const cur: number = remainder * 10 + digits[parseInt(i.toString(), 10)];
                const q: number = Math.floor(cur / 900);
                remainder = cur % 900;
                if (quotient.length > 0 || q > 0) {
                    quotient.push(q);
                }
            }
            chunk.unshift(remainder);
            digits = quotient;
        }
        for (let i: number = 0; i < chunk.length; i++) {
            output.push(chunk[parseInt(i.toString(), 10)]);
        }
        idx += len;
    }
}

function consecutiveDigitCount(msg: number[], start: number): number {
    let idx: number = start;
    while (idx < msg.length && isDigit(msg[parseInt(idx.toString(), 10)])) {
        idx++;
    }
    return idx - start;
}

function consecutiveTextCount(msg: number[], start: number): number {
    let idx: number = start;
    while (idx < msg.length) {
        let numericCount: number = 0;
        while (numericCount < 13 && idx < msg.length && isDigit(msg[parseInt(idx.toString(), 10)])) {
            numericCount++;
            idx++;
        }
        if (numericCount >= 13) {
            return idx - start - numericCount;
        }
        if (numericCount > 0) {
            continue;
        }
        if (!isPDF417TextCharacter(msg[parseInt(idx.toString(), 10)])) {
            break;
        }
        idx++;
    }
    return idx - start;
}

function consecutiveByteCount(msg: number[], start: number): number {
    let idx: number = start;
    while (idx < msg.length) {
        let numericCount: number = 0;
        while (numericCount < 13 && idx + numericCount < msg.length && isDigit(msg[idx + numericCount])) {
            numericCount++;
        }
        if (numericCount >= 13) {
            return idx - start;
        }
        let textCount: number = 0;
        while (textCount < 5 && idx + textCount < msg.length && isPDF417TextCharacter(msg[idx + textCount])) {
            textCount++;
        }
        if (textCount >= 5) {
            return idx - start;
        }
        idx++;
    }
    return idx - start;
}

/**
 * Converts the value into data codewords (without the symbol length descriptor).
 *
 * @returns {number[] | PDF417ErrorKey} codewords or the reason why the value can not be encoded
 * @param {string} value - value to encode
 * @param {PDF417CompactionMode} mode - compaction mode
 * @private
 */
export function compactPDF417Data(value: string, mode: PDF417CompactionMode): number[] | PDF417ErrorKey {
    const converted: { units: number[], isUtf8: boolean } = toPDF417MessageUnits(value);
    const msg: number[] = converted.units;
    const output: number[] = [];
    if (converted.isUtf8) {
        output.push(ECI_CHARACTER_SET, ECI_UTF8);
    }
    const len: number = msg.length;
    switch (mode || 'Auto') {
    case 'Text':
        for (let i: number = 0; i < len; i++) {
            if (!isPDF417TextCharacter(msg[parseInt(i.toString(), 10)])) {
                return 'InvalidTextValue';
            }
        }
        // Text compaction is the default mode at the start of the symbol.
        encodeText(msg, 0, len, output, TextSubMode.Alpha);
        return output;
    case 'Numeric':
        for (let i: number = 0; i < len; i++) {
            if (!isDigit(msg[parseInt(i.toString(), 10)])) {
                return 'InvalidNumericValue';
            }
        }
        output.push(NUMERIC_LATCH);
        encodeNumeric(msg, 0, len, output);
        return output;
    case 'Byte':
        encodeBytes(msg, 0, len, output, false);
        return output;
    case 'Auto':
        break;
    default:
        return 'InvalidCompactionMode';
    }
    // Automatic compaction (ISO/IEC 15438, Annex P).
    let p: number = 0;
    let current: string = 'Text';
    let subMode: TextSubMode = TextSubMode.Alpha;
    while (p < len) {
        const n: number = consecutiveDigitCount(msg, p);
        if (n >= 13) {
            output.push(NUMERIC_LATCH);
            current = 'Numeric';
            subMode = TextSubMode.Alpha;
            encodeNumeric(msg, p, n, output);
            p += n;
            continue;
        }
        const t: number = consecutiveTextCount(msg, p);
        if (t >= 5 || n === len) {
            if (current !== 'Text') {
                output.push(TEXT_LATCH);
                current = 'Text';
                subMode = TextSubMode.Alpha;
            }
            subMode = encodeText(msg, p, t, output, subMode);
            p += t;
            continue;
        }
        let b: number = consecutiveByteCount(msg, p);
        if (b === 0) {
            b = 1;
        }
        if (b === 1 && current === 'Text') {
            encodeBytes(msg, p, 1, output, true);
        } else {
            encodeBytes(msg, p, b, output, false);
            current = 'Byte';
            subMode = TextSubMode.Alpha;
        }
        p += b;
    }
    return output;
}

/**
 * Returns the number of error correction codewords for the level.
 *
 * @returns {number} error correction codeword count
 * @param {number} level - error correction level 0..8
 * @private
 */
export function getPDF417ErrorCorrectionCount(level: number): number {
    return 1 << (level + 1);
}

/**
 * Returns the error correction level recommended by ISO/IEC 15438 for the number of data codewords.
 *
 * @returns {number} recommended level
 * @param {number} dataCount - number of data codewords
 * @private
 */
export function getPDF417RecommendedLevel(dataCount: number): number {
    if (dataCount <= 40) {
        return 2;
    } else if (dataCount <= 160) {
        return 3;
    } else if (dataCount <= 320) {
        return 4;
    }
    return 5;
}

/**
 * Coefficients a0..a(k-1) of g(x) = (x - 3)(x - 3^2)...(x - 3^k) over GF(929),
 * where g(x) = x^k + a(k-1)x^(k-1) + ... + a0.
 *
 * @returns {number[]} coefficients
 * @param {number} level - error correction level 0..8
 * @private
 */
export function getPDF417GeneratorCoefficients(level: number): number[] {
    if (generatorCache[parseInt(level.toString(), 10)]) {
        return generatorCache[parseInt(level.toString(), 10)];
    }
    const k: number = getPDF417ErrorCorrectionCount(level);
    // poly[i] = coefficient of x^i; start with g(x) = 1.
    let poly: number[] = [1];
    let root: number = 1;
    for (let i: number = 1; i <= k; i++) {
        root = (root * 3) % 929;
        const next: number[] = [];
        for (let j: number = 0; j <= poly.length; j++) {
            const shifted: number = j > 0 ? poly[j - 1] : 0;
            const scaled: number = j < poly.length ? (poly[parseInt(j.toString(), 10)] * root) % 929 : 0;
            next.push((shifted - scaled + 929) % 929);
        }
        poly = next;
    }
    const coefficients: number[] = poly.slice(0, k);
    generatorCache[parseInt(level.toString(), 10)] = coefficients;
    return coefficients;
}

/**
 * Computes the Reed-Solomon error correction codewords over GF(929).
 *
 * @returns {number[]} error correction codewords
 * @param {number[]} data - data codewords including the symbol length descriptor
 * @param {number} level - error correction level 0..8
 * @private
 */
export function computePDF417ErrorCorrection(data: number[], level: number): number[] {
    const coefficients: number[] = getPDF417GeneratorCoefficients(level);
    const k: number = coefficients.length;
    const e: number[] = [];
    for (let i: number = 0; i < k; i++) {
        e.push(0);
    }
    for (let i: number = 0; i < data.length; i++) {
        const t1: number = (data[parseInt(i.toString(), 10)] + e[k - 1]) % 929;
        for (let j: number = k - 1; j >= 1; j--) {
            const t2: number = (t1 * coefficients[parseInt(j.toString(), 10)]) % 929;
            e[parseInt(j.toString(), 10)] = (e[j - 1] + 929 - t2) % 929;
        }
        e[0] = (929 - (t1 * coefficients[0]) % 929) % 929;
    }
    const result: number[] = [];
    for (let j: number = k - 1; j >= 0; j--) {
        const v: number = e[parseInt(j.toString(), 10)];
        result.push(v !== 0 ? 929 - v : 0);
    }
    return result;
}

/**
 * Number of modules in one row.
 *
 * @returns {number} module count
 * @param {number} columns - data columns
 * @param {boolean} isCompact - compact PDF417
 * @private
 */
export function getPDF417ModuleCount(columns: number, isCompact: boolean): number {
    // start(17) + left row indicator(17) + data + [right row indicator(17) + stop(18)] | [stop(1)]
    return isCompact ? 17 * columns + 35 : 17 * columns + 69;
}

function canReuseLayout(layout: { rows: number, columns: number }, total: number): boolean {
    if (!layout) {
        return false;
    }
    const rows: number = layout.rows;
    const columns: number = layout.columns;
    return isWholeNumberInRange(rows, PDF417_MIN_ROWS, PDF417_MAX_ROWS) &&
        isWholeNumberInRange(columns, PDF417_MIN_COLUMNS, PDF417_MAX_COLUMNS) &&
        rows * columns >= total && rows * columns <= PDF417_MAX_CODEWORDS;
}

function isWholeNumberInRange(value: number, min: number, max: number): boolean {
    return typeof value === 'number' && !isNaN(value) && Math.floor(value) === value && value >= min && value <= max;
}

/**
 * Chooses the column/row combination that gives the largest module size in the available area.
 *
 * @param {number} total - total number of codewords to fit
 * @param {boolean} isCompact - compact PDF417 layout
 * @param {number} width - available width in pixels (0 if unknown)
 * @param {number} height - available height in pixels (0 if unknown)
 * @param {number} rowHeightRatio - row height as a multiple of the module width
 * @returns {{ rows: number, columns: number }} chosen layout
 * @private
 */
function chooseLayout(total: number, isCompact: boolean, width: number, height: number,
                      rowHeightRatio: number): { rows: number, columns: number } {
    // Without a target area, aim for a symbol about three times wider than it is tall.
    const w: number = width > 0 ? width : 3;
    const h: number = height > 0 ? height : 1;
    let best: { rows: number, columns: number } = null;
    let bestX: number = -1;
    let bestWaste: number = 0;
    for (let c: number = PDF417_MIN_COLUMNS; c <= PDF417_MAX_COLUMNS; c++) {
        const r: number = Math.max(PDF417_MIN_ROWS, Math.ceil(total / c));
        if (r > PDF417_MAX_ROWS || r * c > PDF417_MAX_CODEWORDS) {
            continue;
        }
        const x: number = Math.min(
            w / (getPDF417ModuleCount(c, isCompact) + 2 * PDF417_QUIET_ZONE),
            h / (r * rowHeightRatio + 2 * PDF417_QUIET_ZONE));
        const waste: number = r * c - total;
        if (x > bestX * 1.0001 || (Math.abs(x - bestX) <= bestX * 0.0001 && waste < bestWaste)) {
            best = { rows: r, columns: c };
            bestX = x;
            bestWaste = waste;
        }
    }
    return best;
}

/**
 * Encodes a value as a PDF417 symbol.
 *
 * @returns {PDF417EncodeResult} encoded symbol or the validation error
 * @param {PDF417EncodeOptions} options - encoding options
 * @private
 */
export function encodePDF417(options: PDF417EncodeOptions): PDF417EncodeResult {
    const value: string = options.value;
    if (value === undefined || value === null || value === '') {
        return { success: false, error: 'EmptyValue' };
    }
    const rowsOption: number = options.rows || 0;
    const columnsOption: number = options.columns || 0;
    const levelOption: number = (options.errorCorrectionLevel === undefined || options.errorCorrectionLevel === null) ?
        PDF417ErrorCorrectionLevel.Auto : options.errorCorrectionLevel;
    const isCompact: boolean = !!options.isCompact;
    const rowHeightRatio: number = (options.rowHeightRatio === undefined || options.rowHeightRatio === null) ?
        PDF417_MIN_ROW_HEIGHT : options.rowHeightRatio;
    if (typeof rowHeightRatio !== 'number' || !isFinite(rowHeightRatio) || rowHeightRatio < PDF417_MIN_ROW_HEIGHT) {
        return { success: false, error: 'InvalidRowHeightRatio' };
    }
    if (rowsOption !== 0 && !isWholeNumberInRange(rowsOption, PDF417_MIN_ROWS, PDF417_MAX_ROWS)) {
        return { success: false, error: 'InvalidRows' };
    }
    if (columnsOption !== 0 && !isWholeNumberInRange(columnsOption, PDF417_MIN_COLUMNS, PDF417_MAX_COLUMNS)) {
        return { success: false, error: 'InvalidColumns' };
    }
    if (!isWholeNumberInRange(levelOption, -1, 8)) {
        return { success: false, error: 'InvalidErrorCorrectionLevel' };
    }
    const compacted: number[] | PDF417ErrorKey = compactPDF417Data(String(value), options.compactionMode);
    if (typeof compacted === 'string') {
        return { success: false, error: compacted as PDF417ErrorKey };
    }
    const data: number[] = compacted as number[];
    let level: number = levelOption;
    if (level === PDF417ErrorCorrectionLevel.Auto) {
        level = getPDF417RecommendedLevel(data.length);
        // Step down (never below level 2) when the recommended level leaves no room for the data.
        while (level > 2 && 1 + data.length + getPDF417ErrorCorrectionCount(level) > PDF417_MAX_CODEWORDS) {
            level--;
        }
    }
    const ecCount: number = getPDF417ErrorCorrectionCount(level);
    const total: number = 1 + data.length + ecCount;
    if (total > PDF417_MAX_CODEWORDS) {
        return { success: false, error: 'CapacityExceeded' };
    }
    let rows: number;
    let columns: number;
    if (rowsOption && columnsOption) {
        rows = rowsOption;
        columns = columnsOption;
        if (rows * columns > PDF417_MAX_CODEWORDS) {
            // e.g. 90 x 30: each value is in range, but a symbol holds at most 928 codewords.
            return { success: false, error: 'InvalidSymbolSize' };
        }
        if (rows * columns < total) {
            return { success: false, error: 'CapacityExceeded' };
        }
    } else if (columnsOption) {
        columns = columnsOption;
        rows = Math.max(PDF417_MIN_ROWS, Math.ceil(total / columns));
        if (rows > PDF417_MAX_ROWS) {
            return { success: false, error: 'InvalidColumns' };
        }
    } else if (rowsOption) {
        rows = rowsOption;
        columns = Math.ceil(total / rows);
        if (columns > PDF417_MAX_COLUMNS) {
            return { success: false, error: 'InvalidRows' };
        }
    } else if (canReuseLayout(options.previousLayout, total)) {
        // Width/height changed, but the previous automatic layout still holds the data.
        rows = options.previousLayout.rows;
        columns = options.previousLayout.columns;
    } else {
        const layout: { rows: number, columns: number } = chooseLayout(
            total, isCompact, options.availableWidth, options.availableHeight, rowHeightRatio);
        if (!layout) {
            return { success: false, error: 'CapacityExceeded' };
        }
        rows = layout.rows;
        columns = layout.columns;
    }
    if (rows * columns > PDF417_MAX_CODEWORDS) {
        // A symbol may hold at most 928 codewords. Both axes are in range (or one was derived),
        // so this is a symbol-size limit rather than an out-of-range row or column count.
        return { success: false, error: 'InvalidSymbolSize' };
    }
    const dataCodewords: number[] = [];
    const dataCount: number = rows * columns - ecCount;
    dataCodewords.push(dataCount);
    for (let i: number = 0; i < data.length; i++) {
        dataCodewords.push(data[parseInt(i.toString(), 10)]);
    }
    while (dataCodewords.length < dataCount) {
        dataCodewords.push(PAD);
    }
    const codewords: number[] = dataCodewords.concat(computePDF417ErrorCorrection(dataCodewords, level));
    return {
        success: true,
        rows: rows,
        columns: columns,
        errorCorrectionLevel: level,
        dataCodewords: dataCodewords,
        codewords: codewords,
        matrix: buildPDF417Matrix(codewords, rows, columns, level, isCompact),
        moduleCount: getPDF417ModuleCount(columns, isCompact)
    };
}

function pushWidths(row: number[], widths: number[]): void {
    let bar: number = 1;
    for (let i: number = 0; i < widths.length; i++) {
        for (let j: number = 0; j < widths[parseInt(i.toString(), 10)]; j++) {
            row.push(bar);
        }
        bar = 1 - bar;
    }
}

function pushPattern(row: number[], pattern: number): void {
    for (let bit: number = 16; bit >= 0; bit--) {
        row.push((pattern >> bit) & 1);
    }
}

/**
 * Lays out the codewords with start/stop patterns and row indicators.
 *
 * @param {Array.<number>} codewords - data and error-correction codewords
 * @param {number} rows - number of rows in the symbol
 * @param {number} columns - number of data columns
 * @param {number} level - error correction level
 * @param {boolean} isCompact - compact PDF417 layout
 * @returns {Array.<Array.<number>>} module matrix
 * @private
 */
export function buildPDF417Matrix(codewords: number[], rows: number, columns: number, level: number, isCompact: boolean): number[][] {
    const matrix: number[][] = [];
    for (let y: number = 0; y < rows; y++) {
        const cluster: number = y % 3;
        const base: number = Math.floor(y / 3) * 30;
        let left: number;
        let right: number;
        if (cluster === 0) {
            left = base + Math.floor((rows - 1) / 3);
            right = base + (columns - 1);
        } else if (cluster === 1) {
            left = base + level * 3 + (rows - 1) % 3;
            right = base + Math.floor((rows - 1) / 3);
        } else {
            left = base + (columns - 1);
            right = base + level * 3 + (rows - 1) % 3;
        }
        const table: number[] = PDF417_CODEWORD_PATTERNS[parseInt(cluster.toString(), 10)];
        const row: number[] = [];
        pushWidths(row, START_PATTERN);
        pushPattern(row, table[parseInt(left.toString(), 10)]);
        for (let x: number = 0; x < columns; x++) {
            pushPattern(row, table[codewords[y * columns + x]]);
        }
        if (isCompact) {
            row.push(1);
        } else {
            pushPattern(row, table[parseInt(right.toString(), 10)]);
            pushWidths(row, STOP_PATTERN);
        }
        matrix.push(row);
    }
    return matrix;
}
