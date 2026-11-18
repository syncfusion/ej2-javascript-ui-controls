import {
    DOTCODE_DOT_PATTERNS, DOTCODE_GALOIS_FIELD, DOTCODE_MASK_STEPS, DOTCODE_RS_GENERATOR_COEFFICIENTS
} from './dotcode-tables';

/**
 * DotCode symbology encoder (AIM ISS DotCode Symbology Specification).
 * This module is DOM independent: it converts a value into codewords and a dot matrix.
 * Rendering, sizing to pixels, export and GS1 validation live outside this module.
 */

/** @private */
export type DotCodeErrorKey =
    'EmptyValue' | 'InvalidColumns' | 'CapacityExceeded' | 'InsufficientSize';

/** @private */
export interface DotCodeEncodeOptions {
    value: string;
    /** Number of columns: 0 to choose automatically, otherwise 5 to 200. */
    columns?: number;
    /** Treat GS characters as FNC1 separators between GS1 fields. */
    isGs1?: boolean;
}

/** @private */
export interface DotCodeEncodeResult {
    success: boolean;
    error?: DotCodeErrorKey;
    rows?: number;
    columns?: number;
    /** Selected data mask, 0 to 3. */
    mask?: number;
    /** Whether the readability rules forced the six corner dots to be lit. */
    forcedCorners?: boolean;
    /** Data codewords, including padding, before masking. */
    dataCodewords?: number[];
    /** Data codewords prefixed with the mask codeword and followed by the error correction codewords. */
    codewords?: number[];
    /** One entry per symbol row; each entry holds one value per column (1 = dot). */
    matrix?: number[][];
}

/** Minimum and maximum symbol dimensions, and the quiet zone, in dot positions. @private */
export const DOTCODE_MIN_ROWS: number = 5;
/** @private */
export const DOTCODE_MIN_COLUMNS: number = 5;
/** @private */
export const DOTCODE_MAX_COLUMNS: number = 200;
/** @private */
export const DOTCODE_MAX_ROWS: number = 200;
/** Quiet zone of 3 dot spacings, required on every side by the standard. @private */
export const DOTCODE_QUIET_ZONE: number = 3;

const enum EncodingMode { CodeA = 0, CodeB = 1, CodeC = 2, Binary = 3 }

const LATCH_A: number = 101;
const LATCH_B: number = 102;
const LATCH_C: number = 106;
const FNC1: number = 107;
const FNC2: number = 108;
const FNC3: number = 109;
const UPPER_SHIFT_A: number = 110;
const UPPER_SHIFT_B: number = 111;
const BIN_LATCH: number = 112;
const PAD: number = 106;
const CR_LF: number = 96;

/* HT, FS, GS and RS encoded as code set B values 97 to 100. */
const HT_B: number = 97;
const FS_B: number = 98;
const GS_B: number = 99;
const RS_B: number = 100;

const GS: number = 0x1D;
const SCORE_UNLIT_EDGE: number = -99999;

/* Placeholder values used while folding the dot stream. */
const enum DotValue { Empty = 0, Dot = 1, Corner = 2 }

/**
 * Converts the value into byte-sized units. ASCII characters stay as they are; any other
 * character is written as UTF-8, so non-ASCII text is encoded as bytes.
 *
 * @returns {number[]} message units
 * @param {string} value - value to convert
 * @private
 */
export function toDotCodeMessageUnits(value: string): number[] {
    const units: number[] = [];
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
            if (code < 0x800) {
                units.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
            } else if (code < 0x10000) {
                units.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
            } else {
                units.push(
                    0xF0 | (code >> 18), 0x80 | ((code >> 12) & 0x3F),
                    0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
            }
        }
    }
    return units;
}

function isDigitAt(source: number[], position: number): boolean {
    return source[parseInt(position.toString(), 10)] >= 48 && source[parseInt(position.toString(), 10)] <= 57;
}

function isTwoDigits(source: number[], length: number, position: number): boolean {
    return position + 1 < length && isDigitAt(source, position) && isDigitAt(source, position + 1);
}

function twoDigitsValue(source: number[], position: number): number {
    return (source[parseInt(position.toString(), 10)] - 48) * 10 + (source[parseInt((position + 1).toString(), 10)] - 48);
}

/* Code set A covers every character up to ASCII 95 (Annex F.II.D). */
function isDatumA(source: number[], length: number, position: number): boolean {
    return position < length && source[parseInt(position.toString(), 10)] <= 95;
}

/* Code set B covers ASCII 32 to 127 plus HT, FS, GS, RS and CR/LF (Annex F.II.D).
   Returns 2 for CR/LF, which consumes two characters. */
function isDatumB(source: number[], length: number, position: number): number {
    if (position < length) {
        if (source[parseInt(position.toString(), 10)] >= 32 && source[parseInt(position.toString(), 10)] <= 127) {
            return 1;
        }
        const ch: number = source[parseInt(position.toString(), 10)];
        if (ch === 9 || ch === 28 || ch === 29 || ch === 30) {
            return 1;
        }
        if (position + 1 < length && ch === 13 && source[parseInt((position + 1).toString(), 10)] === 10) {
            return 2;
        }
    }
    return 0;
}

function isBinary(source: number[], length: number, position: number): boolean {
    return position < length && source[parseInt(position.toString(), 10)] >= 128;
}

/* Checks ahead for 10 or more digits starting "17xxxxxx10..." (Annex F.II.B). */
function isSeventeenTen(source: number[], length: number, position: number): boolean {
    if (position + 9 >= length) {
        return false;
    }
    if (source[parseInt(position.toString(), 10)] !== 49 || source[parseInt((position + 1).toString(), 10)] !== 55 ||
        source[parseInt((position + 8).toString(), 10)] !== 49 || source[parseInt((position + 9).toString(), 10)] !== 48) {
        return false;
    }
    for (let i: number = position + 2; i < position + 8; i++) {
        if (!isDigitAt(source, i)) {
            return false;
        }
    }
    return true;
}

/* Number of code set C codewords reachable from a position (Annex F.II.E). */
function aheadC(source: number[], length: number, position: number): number {
    let count: number = 0;
    for (let i: number = position; i < length && isTwoDigits(source, length, i); i += 2) {
        count++;
    }
    return count;
}

/* Number of code set C codewords worth switching for (Annex F.II.F). */
function tryC(source: number[], length: number, position: number): number {
    if (position < length && isDigitAt(source, position)) {
        const ahead: number = aheadC(source, length, position);
        if (ahead > aheadC(source, length, position + 1)) {
            return ahead;
        }
    }
    return 0;
}

/* Number of code set A characters reachable from a position (Annex F.II.G). */
function aheadA(source: number[], length: number, position: number): number {
    let count: number = 0;
    for (let i: number = position; i < length && isDatumA(source, length, i) && tryC(source, length, i) < 2; i++) {
        count++;
    }
    return count;
}

/* Number of code set B characters reachable from a position (Annex F.II.H).
   pNx receives the matching number of code set B codewords. */
function aheadB(source: number[], length: number, position: number, pNx: number[]): number {
    let count: number = 0;
    let i: number = position;
    while (i < length) {
        const increment: number = isDatumB(source, length, i);
        if (increment === 0 || tryC(source, length, i) >= 2) {
            break;
        }
        count++;
        i += increment;
    }
    pNx[0] = count;
    return i - position;
}

/**
 * Encodes the message into data codewords using the algorithm from Annex F.
 * Mode switches follow the standard's rules; no ECI or structured append is emitted.
 *
 * @returns {number[]} data codewords
 * @param {number[]} source - message units, with GS characters as GS1 separators when isGs1 is set
 * @param {boolean} isGs1 - whether GS characters separate GS1 fields
 * @private
 */
export function encodeDotCodeMessage(source: number[], isGs1: boolean): { codewords: number[], binaryFinish: boolean } {
    const codewords: number[] = [];
    const length: number = source.length;
    const nx: number[] = [0];
    let position: number = 0;
    let encodingMode: EncodingMode = EncodingMode.CodeC;
    let insideMacro: number = 0;
    let binBuffer: number = 0;
    let binBufferSize: number = 0;
    let binaryFinish: boolean = false;

    /* Empties the binary buffer as base 259 values converted from base 103 (Annex F, step F). */
    const emptyBinBuffer: () => void = (): void => {
        if (binBufferSize !== 0) {
            const reversed: number[] = [];
            let buffer: number = binBuffer;
            for (let i: number = 0; i <= binBufferSize; i++) {
                reversed.push(buffer % 103);
                buffer = Math.floor(buffer / 103);
            }
            for (let i: number = binBufferSize; i >= 0; i--) {
                codewords.push(reversed[parseInt(i.toString(), 10)]);
            }
            binBuffer = 0;
            binBufferSize = 0;
        }
    };

    const appendToBinBuffer: (value: number) => void = (value: number): void => {
        binBuffer = binBuffer * 259 + value;
        binBufferSize++;
        if (binBufferSize === 5) {
            emptyBinBuffer();
        }
    };

    /* First position handling (Annex F, step C1 region). */
    if (length > 0) {
        if (source[0] === 9 || source[0] === 28 || source[0] === 29 || source[0] === 30) {
            /* A control character in the first position would read as a macro header. */
            codewords.push(LATCH_A);
            codewords.push(source[0] + 64);
            encodingMode = EncodingMode.CodeA;
            position = 1;
        } else if (!isGs1 && length >= 2 && isTwoDigits(source, length, 0)) {
            codewords.push(FNC1);
        } else if (length > 5 && source[0] === 91 && source[1] === 41 && source[2] === 62 && source[3] === 30) {
            /* Macro header "[)>" RS ... */
            const isFormat050612: boolean =
                (source[4] === 48 && (source[5] === 53 || source[5] === 54)) ||
                (source[4] === 49 && source[5] === 50);
            if (isFormat050612 && length > 6 && source[6] === 29) {
                insideMacro = source[5] === 53 ? 97 : (source[5] === 54 ? 98 : 99);
                /* From the initial code set C, 106 is the latch to code set B. */
                codewords.push(106);
                encodingMode = EncodingMode.CodeB;
                codewords.push(insideMacro);
                position = 7;
            } else if (!isFormat050612 && isTwoDigits(source, length, 4)) {
                insideMacro = 100;
                codewords.push(106);
                encodingMode = EncodingMode.CodeB;
                codewords.push(insideMacro);
                codewords.push((source[4] - 48) + 16);
                codewords.push((source[5] - 48) + 16);
                position = 6;
            }
        }
    }

    while (position < length) {
        /* Macro trailers: RS EOT for macros 97 to 99, EOT for macro 100. */
        if (insideMacro !== 0 && insideMacro !== 100 && position === length - 2 &&
            source[parseInt(position.toString(), 10)] === 30 && source[parseInt((position + 1).toString(), 10)] === 4) {
            position += 2;
            continue;
        }
        if (insideMacro === 100 && position === length - 1 && source[parseInt(position.toString(), 10)] === 4) {
            position++;
            continue;
        }

        if (encodingMode === EncodingMode.CodeC) {
            /* Step C2: the (17) date and (10) batch shortcut. */
            if (isSeventeenTen(source, length, position)) {
                codewords.push(100);
                codewords.push(twoDigitsValue(source, position + 2));
                codewords.push(twoDigitsValue(source, position + 4));
                codewords.push(twoDigitsValue(source, position + 6));
                position += 10;
                continue;
            }
            if (isTwoDigits(source, length, position) || (isGs1 && source[parseInt(position.toString(), 10)] === GS)) {
                if (source[parseInt(position.toString(), 10)] === GS) {
                    codewords.push(FNC1);
                    position++;
                } else {
                    codewords.push(twoDigitsValue(source, position));
                    position += 2;
                }
                continue;
            }
            /* Step C3: a high value byte. */
            if (isBinary(source, length, position)) {
                if (position + 1 < length && isDigitAt(source, position + 1)) {
                    if (source[parseInt(position.toString(), 10)] - 128 < 32) {
                        codewords.push(UPPER_SHIFT_A);
                        codewords.push(source[parseInt(position.toString(), 10)] - 128 + 64);
                    } else {
                        codewords.push(UPPER_SHIFT_B);
                        codewords.push(source[parseInt(position.toString(), 10)] - 128 - 32);
                    }
                    position++;
                } else {
                    codewords.push(BIN_LATCH);
                    encodingMode = EncodingMode.Binary;
                }
                continue;
            }
            /* Step C4: choose between code sets A and B. */
            const m: number = aheadA(source, length, position);
            const n: number = aheadB(source, length, position, nx);
            if (m > n) {
                codewords.push(LATCH_A);
                encodingMode = EncodingMode.CodeA;
            } else if (nx[0] >= 1 && nx[0] <= 4) {
                codewords.push(101 + nx[0]);
                pushShiftedBChars(codewords, source, position, nx[0]);
                position += countShiftedBChars(source, position, nx[0]);
            } else {
                /* From code set C, 106 is the latch to code set B. */
                codewords.push(106);
                encodingMode = EncodingMode.CodeB;
            }
            continue;
        }

        if (encodingMode === EncodingMode.CodeB) {
            /* Step D1. */
            const n: number = tryC(source, length, position);
            if (n >= 2) {
                if (n <= 4) {
                    codewords.push(103 + (n - 2));
                    for (let i: number = 0; i < n; i++) {
                        codewords.push(twoDigitsValue(source, position));
                        position += 2;
                    }
                } else {
                    codewords.push(LATCH_C);
                    encodingMode = EncodingMode.CodeC;
                }
                continue;
            }
            /* Step D2. */
            if (isGs1 && source[parseInt(position.toString(), 10)] === GS) {
                codewords.push(FNC1);
                position++;
                continue;
            }
            if (isDatumB(source, length, position) !== 0) {
                let done: boolean = false;
                if (source[parseInt(position.toString(), 10)] >= 32 && source[parseInt(position.toString(), 10)] <= 127) {
                    codewords.push(source[parseInt(position.toString(), 10)] - 32);
                    done = true;
                } else if (source[parseInt(position.toString(), 10)] === 13) {
                    codewords.push(CR_LF);
                    position++;
                    done = true;
                } else if (position !== 0) {
                    pushSpecialBChar(codewords, source[parseInt(position.toString(), 10)]);
                    done = true;
                }
                if (done) {
                    position++;
                    continue;
                }
            }
            /* Step D3: a high value byte. */
            if (isBinary(source, length, position)) {
                if (isDatumB(source, length, position + 1) !== 0) {
                    if (source[parseInt(position.toString(), 10)] - 128 < 32) {
                        codewords.push(UPPER_SHIFT_A);
                        codewords.push(source[parseInt(position.toString(), 10)] - 128 + 64);
                    } else {
                        codewords.push(UPPER_SHIFT_B);
                        codewords.push(source[parseInt(position.toString(), 10)] - 128 - 32);
                    }
                    position++;
                } else {
                    codewords.push(BIN_LATCH);
                    encodingMode = EncodingMode.Binary;
                }
                continue;
            }
            /* Step D4. */
            if (aheadA(source, length, position) === 1) {
                codewords.push(101);
                if (source[parseInt(position.toString(), 10)] < 32) {
                    codewords.push(source[parseInt(position.toString(), 10)] + 64);
                } else {
                    codewords.push(source[parseInt(position.toString(), 10)] - 32);
                }
                position++;
            } else {
                /* From code set B, 102 is the latch to code set A. */
                codewords.push(102);
                encodingMode = EncodingMode.CodeA;
            }
            continue;
        }

        if (encodingMode === EncodingMode.CodeA) {
            /* Step E1. */
            const n: number = tryC(source, length, position);
            if (n >= 2) {
                if (n <= 4) {
                    codewords.push(103 + (n - 2));
                    for (let i: number = 0; i < n; i++) {
                        codewords.push(twoDigitsValue(source, position));
                        position += 2;
                    }
                } else {
                    codewords.push(LATCH_C);
                    encodingMode = EncodingMode.CodeC;
                }
                continue;
            }
            /* Step E2. */
            if (isGs1 && source[parseInt(position.toString(), 10)] === GS) {
                codewords.push(FNC1);
                position++;
                continue;
            }
            if (isDatumA(source, length, position)) {
                if (source[parseInt(position.toString(), 10)] < 32) {
                    codewords.push(source[parseInt(position.toString(), 10)] + 64);
                } else {
                    codewords.push(source[parseInt(position.toString(), 10)] - 32);
                }
                position++;
                continue;
            }
            /* Step E3: a high value byte. */
            if (isBinary(source, length, position)) {
                if (isDatumA(source, length, position + 1)) {
                    if (source[parseInt(position.toString(), 10)] - 128 < 32) {
                        codewords.push(UPPER_SHIFT_A);
                        codewords.push(source[parseInt(position.toString(), 10)] - 128 + 64);
                    } else {
                        codewords.push(UPPER_SHIFT_B);
                        codewords.push(source[parseInt(position.toString(), 10)] - 128 - 32);
                    }
                    position++;
                } else {
                    codewords.push(BIN_LATCH);
                    encodingMode = EncodingMode.Binary;
                }
                continue;
            }
            /* Step E4. */
            aheadB(source, length, position, nx);
            if (nx[0] >= 1 && nx[0] <= 6) {
                codewords.push(95 + nx[0]);
                pushShiftedBChars(codewords, source, position, nx[0]);
                position += countShiftedBChars(source, position, nx[0]);
            } else {
                codewords.push(LATCH_B);
                encodingMode = EncodingMode.CodeB;
            }
            continue;
        }

        /* Step F1: numeric runs interrupt binary mode. */
        const n: number = tryC(source, length, position);
        if (n >= 2) {
            emptyBinBuffer();
            if (n <= 7) {
                codewords.push(101 + n);
                for (let i: number = 0; i < n; i++) {
                    codewords.push(twoDigitsValue(source, position));
                    position += 2;
                }
            } else {
                codewords.push(111);
                encodingMode = EncodingMode.CodeC;
            }
            continue;
        }
        /* Step F2: buffer bytes while high value bytes are near. */
        if (isBinary(source, length, position) || isBinary(source, length, position + 1) ||
            isBinary(source, length, position + 2) || isBinary(source, length, position + 3)) {
            appendToBinBuffer(source[parseInt(position.toString(), 10)]);
            position++;
            continue;
        }
        /* Step F3: terminate binary mode. */
        emptyBinBuffer();
        if (aheadA(source, length, position) > aheadB(source, length, position, [0])) {
            codewords.push(109);
            encodingMode = EncodingMode.CodeA;
        } else {
            codewords.push(110);
            encodingMode = EncodingMode.CodeB;
        }
    }

    if (encodingMode === EncodingMode.Binary && binBufferSize !== 0) {
        emptyBinBuffer();
    }
    binaryFinish = encodingMode === EncodingMode.Binary;

    return { codewords: codewords, binaryFinish: binaryFinish };
}

function pushSpecialBChar(codewords: number[], ch: number): void {
    if (ch === 9) {
        codewords.push(HT_B);
    } else if (ch === 28) {
        codewords.push(FS_B);
    } else if (ch === 29) {
        codewords.push(GS_B);
    } else if (ch === 30) {
        codewords.push(RS_B);
    }
}

/* Writes count code set B values starting at position; CR/LF consumes two characters. */
function pushShiftedBChars(codewords: number[], source: number[], position: number, count: number): void {
    let index: number = position;
    for (let i: number = 0; i < count; i++) {
        if (source[parseInt(index.toString(), 10)] >= 32) {
            codewords.push(source[parseInt(index.toString(), 10)] - 32);
        } else if (source[parseInt(index.toString(), 10)] === 13) {
            codewords.push(CR_LF);
            index++;
        } else {
            pushSpecialBChar(codewords, source[parseInt(index.toString(), 10)]);
        }
        index++;
    }
}

/* Counts the characters consumed by pushShiftedBChars, including the CR of a CR/LF pair. */
function countShiftedBChars(source: number[], position: number, count: number): number {
    let consumed: number = 0;
    let index: number = position;
    for (let i: number = 0; i < count; i++) {
        const code: number = source[parseInt(index.toString(), 10)];
        if (code === 13 && index + 1 < source.length && source[parseInt((index + 1).toString(), 10)] === 10) {
            consumed += 2;
            index += 2;
        } else {
            consumed++;
            index++;
        }
    }
    return consumed;
}

/**
 * Index in the interleaved Reed-Solomon layout of check codeword i for the block
 * that starts at start and holds ndBlock data codewords, stepping by step.
 *
 * @param {number} start - block start index
 * @param {number} ndBlock - data codewords in the block
 * @param {number} step - interleave step
 * @param {number} i - check codeword offset within the block
 * @returns {number} index into the codeword array
 * @private
 */
function blockIndex(start: number, ndBlock: number, step: number, i: number): number {
    return start + (ndBlock + i) * step;
}

/**
 * Adds nc Reed-Solomon check codewords to nd data codewords in wd, in GF(113),
 * interleaving in blocks as the standard requires for large symbols (Annex B).
 *
 * @param {number} nd - number of data codewords
 * @param {number} nc - number of check codewords
 * @param {number[]} wd - data codewords, updated in place with the check codewords
 * @returns {void}
 * @private
 */
export function computeDotCodeErrorCorrection(nd: number, nc: number, wd: number[]): void {
    const field: number = DOTCODE_GALOIS_FIELD;
    const nw: number = nd + nc;
    const step: number = Math.ceil(nw / (field - 1));

    for (let start: number = 0; start < step; start++) {
        const ndBlock: number = Math.ceil((nd - start) / step);
        const nwBlock: number = Math.ceil((nw - start) / step);
        const ncBlock: number = nwBlock - ndBlock;
        const coefficients: number[] = DOTCODE_RS_GENERATOR_COEFFICIENTS[ncBlock - 3];

        for (let i: number = 0; i < ncBlock; i++) {
            wd[parseInt(blockIndex(start, ndBlock, step, i).toString(), 10)] = 0;
        }
        for (let i: number = 0; i < ndBlock; i++) {
            const data: number = wd[parseInt((start + i * step).toString(), 10)];
            const firstCheck: number = wd[parseInt(blockIndex(start, ndBlock, step, 0).toString(), 10)];
            const k: number = (data + firstCheck) % field;
            for (let j: number = 0; j < ncBlock - 1; j++) {
                const current: number = parseInt(blockIndex(start, ndBlock, step, j).toString(), 10);
                const next: number = parseInt(blockIndex(start, ndBlock, step, j + 1).toString(), 10);
                const coef: number = coefficients[parseInt((j + 1).toString(), 10)];
                const nextValue: number = wd[parseInt(next.toString(), 10)];
                wd[parseInt(current.toString(), 10)] = (field - ((coef * k) % field) + nextValue) % field;
            }
            const lastCheck: number = parseInt(blockIndex(start, ndBlock, step, ncBlock - 1).toString(), 10);
            const lastCoef: number = coefficients[parseInt(ncBlock.toString(), 10)];
            wd[parseInt(lastCheck.toString(), 10)] = (field - ((lastCoef * k) % field)) % field;
        }
        for (let i: number = 0; i < ncBlock; i++) {
            const index: number = blockIndex(start, ndBlock, step, i);
            if (wd[parseInt(index.toString(), 10)] !== 0) {
                wd[parseInt(index.toString(), 10)] = field - wd[parseInt(index.toString(), 10)];
            }
        }
    }
}

/**
 * Prefixes the mask codeword, applies the mask to the data codewords and appends
 * the error correction codewords, all in one array.
 *
 * @param {number} mask - data mask, 0 to 3
 * @param {number[]} dataCodewords - data codewords including padding
 * @param {number} eccLength - number of error correction codewords
 * @returns {number[]} masked codewords, ready for the dot stream
 * @private
 */
export function applyDotCodeMask(mask: number, dataCodewords: number[], eccLength: number): number[] {
    const masked: number[] = [mask % 4];
    let weight: number = 0;
    const step: number = DOTCODE_MASK_STEPS[mask % 4];
    for (let j: number = 0; j < dataCodewords.length; j++) {
        if (step === 0) {
            masked.push(dataCodewords[parseInt(j.toString(), 10)]);
        } else {
            masked.push((weight + dataCodewords[parseInt(j.toString(), 10)]) % DOTCODE_GALOIS_FIELD);
            weight += step;
        }
    }
    const nd: number = dataCodewords.length + 1;
    while (masked.length < nd + eccLength) {
        masked.push(0);
    }
    computeDotCodeErrorCorrection(nd, eccLength, masked);
    return masked;
}

/**
 * Chooses the symbol size. With columns 0, follows the automatic sizing rules
 * (Section 5.2.2, rule 3) with a 3:2 width to height ratio; with fixed columns,
 * the rows are calculated so the area holds every dot.
 *
 * @returns {number[]} rows and columns
 * @param {number} minArea - smallest area, in dot positions, that holds the symbol
 * @param {number} columns - requested columns, or 0 for automatic
 * @private
 */
export function selectDotCodeSymbolSize(minArea: number, columns: number): number[] {
    let height: number;
    let width: number;
    if (columns === 0) {
        const h: number = Math.sqrt(minArea * 0.666);
        const w: number = Math.sqrt(minArea * 1.5);
        height = Math.floor(h);
        width = Math.floor(w);
        if (((width + height) & 1) === 1) {
            if (width * height < minArea) {
                width++;
                height++;
            }
        } else {
            if (h * width < w * height) {
                width++;
                if (width * height < minArea) {
                    width--;
                    height++;
                    if (width * height < minArea) {
                        width += 2;
                    }
                }
            } else {
                height++;
                if (width * height < minArea) {
                    width++;
                    height--;
                    if (width * height < minArea) {
                        height += 2;
                    }
                }
            }
        }
    } else {
        width = columns;
        height = Math.ceil(minArea / width);
        if (height < DOTCODE_MIN_ROWS) {
            height = DOTCODE_MIN_ROWS;
        }
        if (((width + height) & 1) === 0) {
            height++;
        }
    }
    return [height, width];
}

/* Converts the masked codewords into the raw dot stream (Section 5.4). */
function makeDotStream(codewords: number[]): number[] {
    const stream: number[] = [];
    stream.push((codewords[0] >> 1) & 1);
    stream.push(codewords[0] & 1);
    for (let i: number = 1; i < codewords.length; i++) {
        const pattern: number = DOTCODE_DOT_PATTERNS[codewords[parseInt(i.toString(), 10)]];
        for (let bit: number = 8; bit >= 0; bit--) {
            stream.push((pattern >> bit) & 1);
        }
    }
    return stream;
}

/* Whether a position is a reserved corner used by the last six dots (Annex D). */
function isCorner(column: number, row: number, width: number, height: number): boolean {
    if (column === 0 && row === 0) {
        return true;
    }
    if ((height & 1) === 1) {
        if ((column === width - 2 && row === 0) || (column === width - 1 && row === 1)) {
            return true;
        }
        if (column === 0 && row === height - 1) {
            return true;
        }
    } else {
        if (column === width - 1 && row === 0) {
            return true;
        }
        if ((column === 0 && row === height - 2) || (column === 1 && row === height - 1)) {
            return true;
        }
    }
    return (column === width - 2 && row === height - 1) || (column === width - 1 && row === height - 2);
}

/**
 * Places the dot stream onto the checkerboard grid, spiralling through the data
 * positions and reserving the corner positions for the last six dots (Annex D).
 *
 * @param {number[]} dotStream - dot stream, padded to the number of data positions
 * @param {number} width - symbol width in dot positions
 * @param {number} height - symbol height in dot positions
 * @returns {number[]} dot values, row major
 * @private
 */
export function foldDotStream(dotStream: number[], width: number, height: number): number[] {
    const dots: number[] = new Array(width * height);
    for (let i: number = 0; i < dots.length; i++) {
        dots[parseInt(i.toString(), 10)] = DotValue.Empty;
    }
    let position: number = 0;
    if ((height & 1) === 1) {
        /* Horizontal folding. */
        for (let row: number = 0; row < height; row++) {
            for (let column: number = 0; column < width; column++) {
                if (((column + row) & 1) === 0) {
                    if (isCorner(column, row, width, height)) {
                        dots[(row * width) + column] = DotValue.Corner;
                    } else {
                        dots[((height - row - 1) * width) + column] = dotStream[position++];
                    }
                } else {
                    dots[((height - row - 1) * width) + column] = DotValue.Empty;
                }
            }
        }
        dots[width - 2] = dotStream[position++];
        dots[(height * width) - 2] = dotStream[position++];
        dots[(width * 2) - 1] = dotStream[position++];
        dots[((height - 1) * width) - 1] = dotStream[position++];
        dots[0] = dotStream[position++];
        dots[(height - 1) * width] = dotStream[parseInt(position.toString(), 10)];
    } else {
        /* Vertical folding. */
        for (let column: number = 0; column < width; column++) {
            for (let row: number = 0; row < height; row++) {
                if (((column + row) & 1) === 0) {
                    if (isCorner(column, row, width, height)) {
                        dots[(row * width) + column] = DotValue.Corner;
                    } else {
                        dots[(row * width) + column] = dotStream[position++];
                    }
                } else {
                    dots[(row * width) + column] = DotValue.Empty;
                }
            }
        }
        dots[((height - 1) * width) - 1] = dotStream[position++];
        dots[(height - 2) * width] = dotStream[position++];
        dots[(height * width) - 2] = dotStream[position++];
        dots[((height - 1) * width) + 1] = dotStream[position++];
        dots[width - 1] = dotStream[position++];
        dots[0] = dotStream[parseInt(position.toString(), 10)];
    }
    return dots;
}

/* Ensures the six corner dots are lit (Section 5.5). */
function forceCorners(dots: number[], width: number, height: number): void {
    if ((width & 1) === 1) {
        /* Vertical symbol. */
        dots[0] = DotValue.Dot;
        dots[width - 1] = DotValue.Dot;
        dots[(height - 2) * width] = DotValue.Dot;
        dots[((height - 1) * width) - 1] = DotValue.Dot;
        dots[((height - 1) * width) + 1] = DotValue.Dot;
        dots[(height * width) - 2] = DotValue.Dot;
    } else {
        /* Horizontal symbol. */
        dots[0] = DotValue.Dot;
        dots[width - 2] = DotValue.Dot;
        dots[(2 * width) - 1] = DotValue.Dot;
        dots[((height - 1) * width) - 1] = DotValue.Dot;
        dots[(height - 1) * width] = DotValue.Dot;
        dots[(height * width) - 2] = DotValue.Dot;
    }
}

function getDot(dots: number[], height: number, width: number, x: number, y: number): boolean {
    return x >= 0 && x < width && y >= 0 && y < height &&
        dots[(y * width) + x] === DotValue.Dot;
}

/* Column penalty: consecutive empty interior columns, Sum(N ^ n) (Annex A). */
function columnPenalty(dots: number[], height: number, width: number): number {
    let penalty: number = 0;
    let penaltyLocal: number = 0;
    for (let x: number = 1; x < width - 1; x++) {
        let clear: boolean = true;
        for (let y: number = x & 1; y < height; y += 2) {
            if (getDot(dots, height, width, x, y)) {
                clear = false;
                break;
            }
        }
        if (clear) {
            penaltyLocal = penaltyLocal === 0 ? height : penaltyLocal * height;
        } else if (penaltyLocal !== 0) {
            penalty += penaltyLocal;
            penaltyLocal = 0;
        }
    }
    return penalty + penaltyLocal;
}

/* Row penalty: consecutive empty interior rows, Sum(N ^ n) (Annex A). */
function rowPenalty(dots: number[], height: number, width: number): number {
    let penalty: number = 0;
    let penaltyLocal: number = 0;
    for (let y: number = 1; y < height - 1; y++) {
        let clear: boolean = true;
        for (let x: number = y & 1; x < width; x += 2) {
            if (getDot(dots, height, width, x, y)) {
                clear = false;
                break;
            }
        }
        if (clear) {
            penaltyLocal = penaltyLocal === 0 ? width : penaltyLocal * width;
        } else if (penaltyLocal !== 0) {
            penalty += penaltyLocal;
            penaltyLocal = 0;
        }
    }
    return penalty + penaltyLocal;
}

/**
 * Scores a candidate dot pattern: the worst edge run minus cross-pattern penalties
 * and empty row and column penalties (Annex A). Higher scores are more readable.
 *
 * @returns {number} mask score
 * @param {number[]} dots - dot values, row major
 * @param {number} height - symbol height in dot positions
 * @param {number} width - symbol width in dot positions
 * @private
 */
export function scoreDotCodeArray(dots: number[], height: number, width: number): number {
    let sum: number = 0;
    let first: number = -1;
    let last: number = -1;

    /* Top edge. */
    for (let x: number = 0; x < width; x += 2) {
        if (getDot(dots, height, width, x, 0)) {
            if (first < 0) {
                first = x;
            }
            last = x;
            sum++;
        }
    }
    if (sum === 0) {
        return SCORE_UNLIT_EDGE;
    }
    let worstEdge: number = (sum + last - first) * height;

    /* Bottom edge. */
    sum = 0;
    first = -1;
    last = -1;
    for (let x: number = width & 1; x < width; x += 2) {
        if (getDot(dots, height, width, x, height - 1)) {
            if (first < 0) {
                first = x;
            }
            last = x;
            sum++;
        }
    }
    if (sum === 0) {
        return SCORE_UNLIT_EDGE;
    }
    sum = (sum + last - first) * height;
    if (sum < worstEdge) {
        worstEdge = sum;
    }

    /* Left edge. */
    sum = 0;
    first = -1;
    last = -1;
    for (let y: number = 0; y < height; y += 2) {
        if (getDot(dots, height, width, 0, y)) {
            if (first < 0) {
                first = y;
            }
            last = y;
            sum++;
        }
    }
    if (sum === 0) {
        return SCORE_UNLIT_EDGE;
    }
    sum = (sum + last - first) * width;
    if (sum < worstEdge) {
        worstEdge = sum;
    }

    /* Right edge. */
    sum = 0;
    first = -1;
    last = -1;
    for (let y: number = height & 1; y < height; y += 2) {
        if (getDot(dots, height, width, width - 1, y)) {
            if (first < 0) {
                first = y;
            }
            last = y;
            sum++;
        }
    }
    if (sum === 0) {
        return SCORE_UNLIT_EDGE;
    }
    sum = (sum + last - first) * width;
    if (sum < worstEdge) {
        worstEdge = sum;
    }

    /* Cross patterns: unprinted five-somes plus isolated printed dots. */
    sum = 0;
    for (let y: number = 0; y < height; y++) {
        for (let x: number = y & 1; x < width; x += 2) {
            if (!getDot(dots, height, width, x - 1, y - 1) && !getDot(dots, height, width, x + 1, y - 1) &&
                !getDot(dots, height, width, x - 1, y + 1) && !getDot(dots, height, width, x + 1, y + 1) &&
                (!getDot(dots, height, width, x, y) ||
                    (!getDot(dots, height, width, x - 2, y) && !getDot(dots, height, width, x, y - 2) &&
                        !getDot(dots, height, width, x + 2, y) && !getDot(dots, height, width, x, y + 2)))) {
                sum++;
            }
        }
    }

    return worstEdge - sum * sum - rowPenalty(dots, height, width) - columnPenalty(dots, height, width);
}

/**
 * Encodes a value as a DotCode symbol: message encoding, symbol sizing, padding,
 * Reed-Solomon error correction, mask selection and dot placement.
 *
 * @returns {DotCodeEncodeResult} the dot matrix, or one error key
 * @param {DotCodeEncodeOptions} options - value and symbol settings
 * @private
 */
export function encodeDotCode(options: DotCodeEncodeOptions): DotCodeEncodeResult {
    const value: string = options.value;
    const columns: number = options.columns === undefined ? 0 : options.columns;
    const isGs1: boolean = options.isGs1 === true;
    if (!value || value.length === 0) {
        return { success: false, error: 'EmptyValue' };
    }
    if (columns !== 0 && (columns < DOTCODE_MIN_COLUMNS || columns > DOTCODE_MAX_COLUMNS)) {
        return { success: false, error: 'InvalidColumns' };
    }

    const source: number[] = toDotCodeMessageUnits(value);
    const message: { codewords: number[], binaryFinish: boolean } = encodeDotCodeMessage(source, isGs1);
    const codewords: number[] = message.codewords.slice(0);
    let dataLength: number = codewords.length;
    let eccLength: number = 3 + Math.floor(dataLength / 2);

    const minDots: number = 9 * (dataLength + 3 + Math.floor(dataLength / 2)) + 2;
    const minArea: number = minDots * 2;

    const size: number[] = selectDotCodeSymbolSize(minArea, columns);
    const height: number = size[0];
    const width: number = size[1];

    if (height > DOTCODE_MAX_ROWS || width > DOTCODE_MAX_COLUMNS) {
        return { success: false, error: 'CapacityExceeded' };
    }

    const nDots: number = Math.floor((height * width) / 2);

    /* Padding codewords fill the free dots. */
    let paddingDots: number = nDots - minDots;
    if (paddingDots >= 9) {
        let isFirst: boolean = true;
        while (paddingDots >= 9) {
            if (paddingDots < 18 && (dataLength & 1) === 0) {
                paddingDots -= 9;
            } else if (paddingDots >= 18) {
                paddingDots -= (dataLength & 1) === 0 ? 9 : 18;
            } else {
                break;
            }
            codewords.push(isFirst && message.binaryFinish ? FNC3 : PAD);
            dataLength++;
            isFirst = false;
        }
    }
    eccLength = 3 + Math.floor(dataLength / 2);

    /* Evaluate every mask and keep the most readable dot pattern. */
    const maskScore: number[] = new Array(8);
    let bestMask: number = 0;
    let highScore: number;
    let forcedCorners: boolean = false;
    const evaluateMask: (mask: number, force: boolean) => number = (mask: number, force: boolean): number => {
        const masked: number[] = applyDotCodeMask(mask, codewords, eccLength);
        const dotStream: number[] = makeDotStream(masked);
        while (dotStream.length < nDots) {
            dotStream.push(1);
        }
        const dots: number[] = foldDotStream(dotStream, width, height);
        if (force) {
            forceCorners(dots, width, height);
        }
        return scoreDotCodeArray(dots, height, width);
    };
    for (let mask: number = 0; mask < 4; mask++) {
        maskScore[parseInt(mask.toString(), 10)] = evaluateMask(mask, false);
    }
    highScore = maskScore[0];
    for (let mask: number = 1; mask < 4; mask++) {
        const score: number = maskScore[parseInt(mask.toString(), 10)];
        if (score >= highScore) {
            highScore = score;
            bestMask = mask;
        }
    }
    if (highScore <= (height * width) / 2) {
        for (let mask: number = 0; mask < 4; mask++) {
            maskScore[parseInt((mask + 4).toString(), 10)] = evaluateMask(mask, true);
        }
        for (let mask: number = 4; mask < 8; mask++) {
            const score: number = maskScore[parseInt(mask.toString(), 10)];
            if (score >= highScore) {
                highScore = score;
                bestMask = mask;
            }
        }
    }
    if (bestMask >= 4) {
        forcedCorners = true;
    }

    const maskedCodewords: number[] = applyDotCodeMask(bestMask % 4, codewords, eccLength);
    const dotStream: number[] = makeDotStream(maskedCodewords);
    while (dotStream.length < nDots) {
        dotStream.push(1);
    }
    const dots: number[] = foldDotStream(dotStream, width, height);
    if (forcedCorners) {
        forceCorners(dots, width, height);
    }

    const matrix: number[][] = [];
    for (let row: number = 0; row < height; row++) {
        const matrixRow: number[] = [];
        for (let column: number = 0; column < width; column++) {
            matrixRow.push(dots[(row * width) + column] === DotValue.Dot ? 1 : 0);
        }
        matrix.push(matrixRow);
    }

    return {
        success: true,
        rows: height,
        columns: width,
        mask: bestMask % 4,
        forcedCorners: forcedCorners,
        dataCodewords: codewords,
        codewords: maskedCodewords,
        matrix: matrix
    };
}
