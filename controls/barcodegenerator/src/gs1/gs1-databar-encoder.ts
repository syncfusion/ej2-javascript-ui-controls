import { Gs1Success } from './gs1-parser';

/**
 * Internal GS1 DataBar encoder, per ISO/IEC 24724. Pure computation: the
 * functions below build the element-width patterns of the DataBar symbols
 * from already validated GS1 data. No rendering, no DOM, no component API;
 * the DataBar barcode-type stories consume these results to draw.
 */

/**
 * The result of encoding a GTIN-only DataBar (Omnidirectional, Truncated,
 * Stacked, Stacked Omnidirectional): one row of 96 modules as bar/space
 * element widths, alternating and starting with a bar.
 */
export interface Gs1DataBarEncoded {
    /** The validated 14-digit GTIN. */
    gtin: string;
    /** Element widths of the full 96-module pattern, starting with a bar. */
    widths: number[];
    /** Total modules (96). */
    moduleCount: number;
}

/**
 * The result of encoding a GS1 DataBar Limited: one row of 74 modules.
 */
export interface Gs1DataBarLimitedEncoded {
    /** The validated 14-digit GTIN. */
    gtin: string;
    /** Element widths of the pattern, starting with a space. */
    widths: number[];
    /** Total modules, including the quiet zones (80). */
    moduleCount: number;
}

/**
 * One character of an Expanded symbol: the data-character element widths
 * and, for even positions, the finder-pattern element widths that follow it.
 */
export interface Gs1DataBarSegment {
    /** Element widths of the data character (17 modules). */
    dataWidths: number[];
    /** Element widths of the finder pattern that follows this character
     * (15 modules), or null when no finder follows. */
    finderWidths: number[];
    /** The finder pattern index (0..11) when a finder follows, else -1. */
    finder: number;
}

/**
 * The result of encoding a GS1 DataBar Expanded value.
 */
export interface Gs1DataBarExpandedEncoded {
    /** The human-readable text with the AIs in brackets. */
    humanReadableText: string;
    /** The characters, in order: check character first, then the data characters. */
    segments: Gs1DataBarSegment[];
    /** The number of characters. */
    characterCount: number;
}

/**
 * Error returned by the encoders when the input cannot be encoded. The
 * barcode-type stories map the kind to a localized message.
 */
export type Gs1DataBarError =
    'DataBarLimitedInvalidGtin'
    | 'DataBarDataTooLong';

/**
 * Combination counts: C(n, r).
 *
 * @param {number} n - The size of the set.
 * @param {number} r - The size of the selected subset.
 * @returns {number} The number of combinations.
 */
function combins(n: number, r: number): number {
    let maxDenom: number;
    let minDenom: number;
    if (n - r > r) {
        minDenom = r;
        maxDenom = n - r;
    } else {
        minDenom = n - r;
        maxDenom = r;
    }
    let val: number = 1;
    let j: number = 1;
    let i: number;
    for (i = n; i > maxDenom; i--) {
        val *= i;
        if (j <= minDenom) {
            val /= j;
            j++;
        }
    }
    while (j <= minDenom) {
        val /= j;
        j++;
    }
    return val;
}

/**
 * The element widths of `elements` elements summing to `modules` modules that
 * encode `value`, the inverse of the RSS value algorithm from ISO/IEC 24724.
 *
 * @param {number} value - The RSS value to encode.
 * @param {number} elements - The number of elements.
 * @param {number} modules - The total number of modules the widths sum to.
 * @param {number} maxWidth - The maximum width of the widest element.
 * @param {boolean} noNarrow - Whether a narrow element must be present.
 * @returns {number[]} The element widths.
 */
function getRssWidths(value: number, elements: number, modules: number, maxWidth: number, noNarrow: boolean): number[] {
    const out: number[] = new Array(elements);
    let mask: number = 0;
    let val: number = value;
    let nm: number = modules;
    let bar: number;
    for (bar = 0; bar < elements - 1; bar++) {
        let ew: number = 1;
        let sval: number = 0;
        let widthFound: boolean = false;
        mask |= 1 << bar;
        while (!widthFound) {
            sval = combins(nm - ew - 1, elements - bar - 2);
            // A subset that still has no narrow element is excluded while the
            // narrow-element constraint is in force, per ISO/IEC 24724.
            if (noNarrow && mask === 0 && nm - ew - (elements - bar) * 2 >= -2) {
                sval -= combins(nm - ew - (elements - bar), elements - bar - 2);
            }
            if (elements - bar > 2) {
                let lessVal: number = 0;
                let mxwElement: number;
                for (mxwElement = nm - ew - (elements - bar) + 2; mxwElement > maxWidth; mxwElement--) {
                    lessVal += combins(nm - mxwElement - ew - 1, elements - bar - 3);
                }
                sval -= lessVal * (elements - bar - 1);
            } else if (nm - ew > maxWidth) {
                sval--;
            }
            val -= sval;
            if (val < 0) {
                widthFound = true;
            } else {
                ew++;
                mask &= ~(1 << bar);
            }
        }
        val += sval;
        nm -= ew;
        out[parseInt(bar.toString(), 10)] = ew;
    }
    out[elements - 1] = nm;
    return out;
}

/**
 * GS1 modulo 10 check digit: weights 3 and 1 alternate from the right of
 * the supplied digits.
 *
 * @param {string} digits - The digits before the check digit.
 * @returns {number} The check digit.
 */
export function calculateCheckDigit(digits: string): number {
    let sum: number = 0;
    let weight: number = 3;
    let index: number;
    for (index = digits.length - 1; index >= 0; index--) {
        sum += (digits.charCodeAt(index) - 48) * weight;
        weight = weight === 3 ? 1 : 3;
    }
    return (10 - (sum % 10)) % 10;
}

/**
 * Data-character group tables of the GTIN DataBar, from ISO/IEC 24724:
 * [valueMax, gsum, oddModules, evenModules, maxOddWidth, maxEvenWidth,
 *  totalOdd, totalEven]. The outside character value = gsum + odd*totalEven
 * + even; the inside character value = gsum + even*totalOdd + odd.
 */
// Groups of the outside data characters (odd + even = 16 modules).
const GTIN_OUTSIDE_GROUPS: number[][] = [
    [160, 0, 12, 4, 8, 1, 161, 1],
    [960, 161, 10, 6, 6, 3, 80, 10],
    [2014, 961, 8, 8, 4, 5, 31, 34],
    [2714, 2015, 6, 10, 3, 6, 10, 70],
    [2840, 2715, 4, 12, 1, 8, 1, 126]
];
// Groups of the inside data characters (odd + even = 15 modules).
const GTIN_INSIDE_GROUPS: number[][] = [
    [335, 0, 5, 10, 2, 7, 4, 84],
    [1035, 336, 7, 8, 4, 5, 20, 35],
    [1515, 1036, 9, 6, 6, 3, 48, 10],
    [1596, 1516, 11, 4, 8, 1, 81, 1]
];

/**
 * Check-character weights of the GTIN DataBar (module 79), applied to the
 * 32 element widths of the four data characters in symbol order.
 */
const GTIN_CHECK_WEIGHTS: number[] = [
    1, 3, 9, 27, 2, 6, 18, 54,
    58, 72, 24, 8, 29, 36, 12, 4,
    74, 51, 17, 32, 37, 65, 48, 16,
    64, 34, 23, 69, 49, 68, 46, 59
];

/**
 * Check-character element widths, indexed by check value div 9 (left) and
 * mod 9 (right, mirrored).
 */
const GTIN_CHECK_WIDTHS: number[][] = [
    [3, 8, 2, 1, 1], [3, 5, 5, 1, 1], [3, 3, 7, 1, 1],
    [3, 1, 9, 1, 1], [2, 7, 4, 1, 1], [2, 5, 6, 1, 1],
    [2, 3, 8, 1, 1], [1, 5, 7, 1, 1], [1, 3, 9, 1, 1]
];

/**
 * Find the group of a data-character value in one of the group tables.
 *
 * @param {number} value - The data-character value.
 * @param {Array.<Array.<number>>} groups - The groups ordered by maximum value.
 * @returns {Array.<number>} The matching group.
 */
function findGroup(value: number, groups: number[][]): number[] {
    let index: number;
    for (index = 0; index < groups.length; index++) {
        if (value <= groups[parseInt(index.toString(), 10)][0]) {
            return groups[parseInt(index.toString(), 10)];
        }
    }
    return groups[groups.length - 1];
}

/**
 * Encode a left pair outside data character (16 modules, 4 odd and 4 even
 * elements): value = gsum + odd * totalEven + even, with the odd elements
 * first in the element sequence, per ISO/IEC 24724.
 *
 * @param {number} value - The data-character value.
 * @returns {number[]} The encoded element widths.
 */
function encodeOutsideCharacterForward(value: number): number[] {
    const group: number[] = findGroup(value, GTIN_OUTSIDE_GROUPS);
    const odd: number[] = getRssWidths(
        Math.floor((value - group[1]) / group[7]), 4, group[2], group[4], false);
    const even: number[] = getRssWidths(
        (value - group[1]) % group[7], 4, group[3], group[5], true);
    return interleave(odd, even);
}

/**
 * Encode a right pair outside data character: like the outside character
 * but with the element sequence reversed, per ISO/IEC 24724.
 *
 * @param {number} value - The data-character value.
 * @returns {number[]} The encoded element widths.
 */
function encodeOutsideCharacterReversed(value: number): number[] {
    const group: number[] = findGroup(value, GTIN_OUTSIDE_GROUPS);
    const odd: number[] = getRssWidths(
        Math.floor((value - group[1]) / group[7]), 4, group[2], group[4], false);
    const even: number[] = getRssWidths(
        (value - group[1]) % group[7], 4, group[3], group[5], true);
    return interleaveReverse(odd, even);
}

/**
 * Encode a right pair inside data character (15 modules, 4 odd and 4 even
 * elements): value = gsum + even * totalOdd + odd, with the element
 * sequence forward, per ISO/IEC 24724.
 *
 * @param {number} value - The data-character value.
 * @returns {number[]} The encoded element widths.
 */
function encodeInsideCharacterForward(value: number): number[] {
    const group: number[] = findGroup(value, GTIN_INSIDE_GROUPS);
    const odd: number[] = getRssWidths(
        (value - group[1]) % group[6], 4, group[2], group[4], true);
    const even: number[] = getRssWidths(
        Math.floor((value - group[1]) / group[6]), 4, group[3], group[5], false);
    return interleave(odd, even);
}

/**
 * Encode a left pair inside data character: like the inside character but
 * with the element sequence reversed, per ISO/IEC 24724.
 *
 * @param {number} value - The data-character value.
 * @returns {number[]} The encoded element widths.
 */
function encodeInsideCharacterReversed(value: number): number[] {
    const group: number[] = findGroup(value, GTIN_INSIDE_GROUPS);
    const odd: number[] = getRssWidths(
        (value - group[1]) % group[6], 4, group[2], group[4], true);
    const even: number[] = getRssWidths(
        Math.floor((value - group[1]) / group[6]), 4, group[3], group[5], false);
    return interleaveReverse(odd, even);
}

/**
 * Interleave the odd (bar) and even (space) element widths.
 *
 * @param {number[]} odd - The odd element widths.
 * @param {number[]} even - The even element widths.
 * @returns {number[]} The interleaved widths.
 */
function interleave(odd: number[], even: number[]): number[] {
    const result: number[] = [];
    let index: number;
    for (index = 0; index < odd.length; index++) {
        result.push(odd[parseInt(index.toString(), 10)]);
        result.push(even[parseInt(index.toString(), 10)]);
    }
    return result;
}

/**
 * Interleave the odd and even element widths in reverse order: even and odd
 * fill the sequence from the right, used by the inside data characters.
 *
 * @param {number[]} odd - The odd element widths.
 * @param {number[]} even - The even element widths.
 * @returns {number[]} The reversed interleaved widths.
 */
function interleaveReverse(odd: number[], even: number[]): number[] {
    const result: number[] = new Array(odd.length * 2);
    let index: number;
    for (index = 0; index < odd.length; index++) {
        result[odd.length * 2 - 1 - index * 2] = odd[parseInt(index.toString(), 10)];
        result[odd.length * 2 - 2 - index * 2] = even[parseInt(index.toString(), 10)];
    }
    return result;
}

/**
 * Split the 13 data digits of a GTIN into the four data-character values of
 * the GTIN DataBar, using the carry recurrence of ISO/IEC 24724: the digits
 * flow through a base-4537077 accumulator, and the high parts collect into
 * the left value, which with the final remainder gives the four characters
 * through division and remainder by 1597.
 *
 * @param {string} digits - The 13 data digits of the GTIN.
 * @returns {{d1: number, d2: number, d3: number, d4: number}} The four character values.
 */
function splitGtinValue(digits: string): { d1: number; d2: number; d3: number; d4: number } {
    let accumulator: number = digits.charCodeAt(0) - 48;
    const carry: number[] = [accumulator];
    let index: number;
    for (index = 1; index < 13; index++) {
        accumulator = (accumulator % 4537077) * 10 + (digits.charCodeAt(index) - 48);
        carry.push(accumulator);
    }
    // The right pair value is the final accumulator modulo 4537077; each
    // carry position then holds the high part of the accumulator.
    const right: number = accumulator % 4537077;
    // The left value collects the high parts, skipping leading zeros.
    let left: number = 0;
    let started: boolean = false;
    for (const carryValue of carry) {
        const part: number = Math.floor(carryValue / 4537077);
        if (part === 0 && !started) {
            continue;
        }
        started = true;
        left = left * 10 + part;
    }
    const d1: number = Math.floor(left / 1597);
    const d2: number = left % 1597;
    const d3: number = Math.floor(right / 1597);
    const d4: number = right % 1597;
    return { d1: d1, d2: d2, d3: d3, d4: d4 };
}

/**
 * Encode a validated 14-digit GTIN as the shared 96-module GTIN DataBar
 * element-width pattern used by the Omnidirectional, Truncated, Stacked and
 * Stacked Omnidirectional variants.
 *
 * @param {string} gtin - The validated 14-digit GTIN.
 * @returns {Gs1DataBarEncoded} The encoded pattern.
 */
export function encodeGtinDataBar(gtin: string): Gs1DataBarEncoded {
    // The check digit is not encoded; the value is the first 13 digits.
    const split: { d1: number; d2: number; d3: number; d4: number } = splitGtinValue(gtin.substring(0, 13));
    // d1: left pair outside character (16 modules); d2: left pair inside
    // character (15 modules); d3: right pair outside character (16 modules);
    // d4: right pair inside character (15 modules).
    const leftOutside: number[] = encodeOutsideCharacterForward(split.d1);
    const leftInside: number[] = encodeInsideCharacterReversed(split.d2);
    const rightOutside: number[] = encodeOutsideCharacterReversed(split.d3);
    const rightInside: number[] = encodeInsideCharacterForward(split.d4);
    // Module-79 check character over the 32 element widths in the order
    // d1, d2, d3, d4, per ISO/IEC 24724.
    const allWidths: number[] = leftOutside.concat(leftInside, rightOutside, rightInside);
    let checksum: number = 0;
    let index: number;
    for (index = 0; index < allWidths.length; index++) {
        checksum += allWidths[parseInt(index.toString(), 10)] * GTIN_CHECK_WEIGHTS[parseInt(index.toString(), 10)];
    }
    checksum = checksum % 79;
    if (checksum >= 8) {
        checksum++;
    }
    if (checksum >= 72) {
        checksum++;
    }
    const checkLeft: number[] = GTIN_CHECK_WIDTHS[parseInt(Math.floor(checksum / 9).toString(), 10)];
    const checkRight: number[] = GTIN_CHECK_WIDTHS[parseInt((checksum % 9).toString(), 10)].slice().reverse();
    // Symbol order: the left guard (bar, space), d1, left check, d2, d4,
    // right check, d3, and the right guard (space, bar). Quiet zones are
    // outside the encoded module pattern.
    const pattern: number[] = [1, 1]
        .concat(leftOutside, checkLeft, leftInside)
        .concat(rightInside, checkRight, rightOutside)
        .concat([1, 1]);
    return { gtin: gtin, widths: pattern, moduleCount: 96 };
}

/**
 * Data-character group table of GS1 DataBar Limited, from ISO/IEC 24724:
 * [valueMax, gsum, oddModules, evenModules, maxOddWidth, maxEvenWidth,
 *  totalOdd, totalEven]. The data characters have 7 odd and 7 even elements;
 * value = gsum + odd * totalEven + even.
 */
const LIMITED_GROUPS: number[][] = [
    [183063, 0, 17, 9, 6, 3, 6538, 28],
    [820063, 183064, 13, 13, 5, 4, 875, 728],
    [1000775, 820064, 9, 17, 3, 6, 28, 6454],
    [1491020, 1000776, 15, 11, 5, 4, 2415, 203],
    [1979844, 1491021, 11, 15, 4, 5, 203, 2408],
    [1996938, 1979845, 19, 7, 8, 1, 17094, 1],
    [2013570, 1996939, 7, 19, 1, 8, 1, 16632]
];

/**
 * Check weights of the Limited internal check character (module 89).
 */
const LIMITED_CHECK_WEIGHTS: number[] = [
    1, 3, 9, 27, 81, 65, 17, 51, 64, 14, 42, 37, 22, 66,
    20, 60, 2, 6, 18, 54, 73, 41, 34, 13, 39, 28, 84, 74
];

/**
 * The valid internal check values of DataBar Limited, from ISO/IEC 24724:
 * the module-89 result indexes this sequence to the actual check value.
 */
const LIMITED_CHECK_SEQUENCE: number[] = ((): number[] => {
    const values: number[] = [];
    const addRange: (from: number, to: number) => void = (from: number, to: number): void => {
        let i: number;
        for (i = from; i <= to; i++) {
            values.push(i);
        }
    };
    addRange(0, 43);
    values.push(45, 52, 57);
    addRange(63, 66);
    addRange(73, 79);
    values.push(82);
    addRange(126, 130);
    values.push(132);
    addRange(141, 146);
    addRange(210, 217);
    values.push(220);
    addRange(316, 320);
    values.push(322, 323);
    values.push(326, 337);
    return values;
})();

/**
 * Encode a validated 14-digit GTIN as a GS1 DataBar Limited symbol.
 * The GTIN must start with 0 or 1.
 *
 * @param {string} gtin - The validated 14-digit GTIN.
 * @returns {Gs1DataBarLimitedEncoded | Gs1DataBarError} The encoded pattern, or the error.
 */
export function encodeGtinDataBarLimited(gtin: string): Gs1DataBarLimitedEncoded | Gs1DataBarError {
    if (gtin.charCodeAt(0) !== 48 && gtin.charCodeAt(0) !== 49) {
        return 'DataBarLimitedInvalidGtin';
    }
    // The check digit is not encoded; the value is the first 13 digits,
    // split with the 2013571 carry recurrence into the two data characters.
    const digits: string = gtin.substring(0, 13);
    let accumulator: number = digits.charCodeAt(0) - 48;
    const carry: number[] = [accumulator];
    let index: number;
    for (index = 1; index < 13; index++) {
        accumulator = (accumulator % 2013571) * 10 + (digits.charCodeAt(index) - 48);
        carry.push(accumulator);
    }
    const d2: number = accumulator % 2013571;
    let d1: number = 0;
    let started: boolean = false;
    for (const carryValue of carry) {
        const part: number = Math.floor(carryValue / 2013571);
        if (part === 0 && !started) {
            continue;
        }
        started = true;
        d1 = d1 * 10 + part;
    }
    const buildCharacter: (charValue: number) => number[] = (charValue: number): number[] => {
        const group: number[] = findGroup(charValue, LIMITED_GROUPS);
        // Odd = (value - gsum) div totalEven with narrow not required;
        // even = remainder with narrow required; both 7 elements.
        const odd: number[] = getRssWidths(
            Math.floor((charValue - group[1]) / group[7]),
            7, group[2], group[4], false);
        const even: number[] = getRssWidths(
            (charValue - group[1]) % group[7],
            7, group[3], group[5], true);
        return interleave(odd, even);
    };
    const d1w: number[] = buildCharacter(d1);
    const d2w: number[] = buildCharacter(d2);
    // Internal check character (module 89) over the 28 element widths.
    const allWidths: number[] = d1w.concat(d2w);
    let checksum: number = 0;
    for (index = 0; index < allWidths.length; index++) {
        checksum += allWidths[parseInt(index.toString(), 10)] * LIMITED_CHECK_WEIGHTS[parseInt(index.toString(), 10)];
    }
    checksum = checksum % 89;
    const checkValue: number = LIMITED_CHECK_SEQUENCE[parseInt(checksum.toString(), 10)];
    const swidths: number[] = getRssWidths(Math.floor(checkValue / 21), 6, 8, 3, false);
    const bwidths: number[] = getRssWidths(checkValue % 21, 6, 8, 3, false);
    const checkwidths: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1];
    for (index = 0; index < 6; index++) {
        checkwidths[index * 2] = swidths[parseInt(index.toString(), 10)];
        checkwidths[index * 2 + 1] = bwidths[parseInt(index.toString(), 10)];
    }
    // Symbol order: left guard (bar, space), d1, check, d2, right guard
    // (space, bar). Quiet zones are outside the encoded module pattern.
    const pattern: number[] = [1, 1].concat(d1w, checkwidths, d2w, [1, 1]);
    return { gtin: gtin, widths: pattern, moduleCount: 74 };
}

/**
 * Data-character group table of the Expanded characters, from ISO/IEC 24724:
 * [valueMax, gsum, oddModules, evenModules, maxOddWidth, maxEvenWidth,
 *  totalOdd, totalEven]. Data characters are 17 modules: odd + even; the
 * character value = gsum + odd * totalEven + even.
 */
const EXPANDED_GROUPS: number[][] = [
    [347, 0, 12, 5, 7, 2, 87, 4],
    [1387, 348, 10, 7, 5, 4, 52, 20],
    [2947, 1388, 8, 9, 4, 5, 30, 52],
    [3987, 2948, 6, 11, 3, 6, 10, 104],
    [4191, 3988, 4, 13, 1, 8, 1, 204]
];

/**
 * Finder pattern element widths: twelve patterns of five modules each, flat
 * per ISO/IEC 24724. A finder follows every even-positioned character; the
 * sequence of pattern indexes is defined by EXPANDED_FINDER_SEQUENCES.
 */
const EXPANDED_FINDER_WIDTHS: number[][] = [
    [1, 8, 4, 1, 1],
    [1, 1, 4, 8, 1],
    [3, 6, 4, 1, 1],
    [1, 1, 4, 6, 3],
    [3, 4, 6, 1, 1],
    [1, 1, 6, 4, 3],
    [3, 2, 8, 1, 1],
    [1, 1, 8, 2, 3],
    [2, 6, 5, 1, 1],
    [1, 1, 5, 6, 2],
    [2, 2, 9, 1, 1],
    [1, 1, 9, 2, 2]
];

/**
 * Finder pattern sequences by the number of data characters: finder values
 * as indexes into the pattern pairs (A..F of the standard as 0, 1, 2, 3, 5,
 * 7, 8, 9, 10, 11 like the widths table above).
 */
const EXPANDED_FINDER_SEQUENCES: number[][] = [
    [0, 1],
    [0, 3, 2],
    [0, 5, 2, 7],
    [0, 9, 2, 7, 4],
    [0, 9, 2, 7, 6, 11],
    [0, 9, 2, 7, 8, 11, 10],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 9, 8],
    [0, 1, 2, 3, 4, 5, 6, 9, 10, 11],
    [0, 1, 2, 3, 4, 7, 6, 9, 8, 11, 10]
];

/**
 * Check weights of the Expanded check character (module 211): 8 weights per
 * data character, in symbol order, from ISO/IEC 24724.
 */
const EXPANDED_CHECK_WEIGHTS: number[][] = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [77, 96, 32, 81, 27, 9, 3, 1],
    [20, 60, 180, 118, 143, 7, 21, 63],
    [205, 209, 140, 117, 39, 13, 145, 189],
    [193, 157, 49, 147, 19, 57, 171, 91],
    [132, 44, 85, 169, 197, 136, 186, 62],
    [185, 133, 188, 142, 4, 12, 36, 108],
    [50, 87, 29, 80, 97, 173, 128, 113],
    [150, 28, 84, 41, 123, 158, 52, 156],
    [166, 196, 206, 139, 187, 203, 138, 46],
    [76, 17, 51, 153, 37, 111, 122, 155],
    [146, 119, 110, 107, 106, 176, 129, 43],
    [16, 48, 144, 10, 30, 90, 59, 177],
    [164, 125, 112, 178, 200, 137, 116, 109],
    [70, 210, 208, 202, 184, 130, 179, 115],
    [190, 204, 68, 93, 31, 151, 191, 134],
    [148, 22, 66, 198, 172, 94, 71, 2],
    [40, 154, 192, 64, 162, 54, 18, 6],
    [120, 149, 25, 75, 14, 42, 126, 167],
    [175, 199, 207, 69, 23, 78, 26, 79],
    [103, 98, 83, 38, 114, 131, 182, 124],
    [159, 53, 88, 170, 127, 183, 61, 161],
    [55, 165, 73, 8, 24, 72, 5, 15],
    [89, 100, 174, 58, 160, 194, 135, 45]
];

/**
 * The FNC1 marker in the general-purpose field.
 */
const GPF_FNC1: number = -1;

/**
 * Convert a value to a fixed-width bit array, most significant bit first.
 *
 * @param {number} value - The value to convert.
 * @param {number} width - The number of bits to produce.
 * @returns {number[]} The value represented as bits.
 */
function toBits(value: number, width: number): number[] {
    const bits: number[] = [];
    let remaining: number = value;
    let index: number;
    for (index = width - 1; index >= 0; index--) {
        bits[parseInt(index.toString(), 10)] = remaining & 1;
        remaining = remaining >> 1;
    }
    return bits;
}

/**
 * Encode a two-symbol group with the numeric scheme of the Expanded
 * general-purpose field: 7 bits, value 8 + 11*d1 + d2, where each symbol is
 * a digit 0 to 9 or 10 for FNC1 (the pair FNC1-FNC1 is never encoded).
 *
 * @param {number} symbol1 - The first numeric or FNC1 symbol.
 * @param {number} symbol2 - The second numeric or FNC1 symbol.
 * @returns {number[]} The encoded 7-bit pair.
 */
function encodeNumericPair(symbol1: number, symbol2: number): number[] {
    return toBits(8 + 11 * symbol1 + symbol2, 7);
}

/**
 * Encode one character with the alphanumeric scheme. Returns null when the
 * character is not encodable.
 *
 * @param {number} charCode - The character code to encode.
 * @returns {number[] | null} The encoded bits, or null if unsupported.
 */
function encodeAlphanumericChar(charCode: number): number[] {
    if (charCode >= 48 && charCode <= 57) {
        return toBits(charCode - 43, 5);
    }
    if (charCode === 15 || charCode === GPF_FNC1) {
        return [0, 1, 1, 1, 1];
    }
    if (charCode >= 65 && charCode <= 90) {
        return toBits(charCode - 33, 6);
    }
    if (charCode === 42) {
        return [1, 1, 1, 0, 1, 0];
    }
    if (charCode >= 44 && charCode <= 47) {
        return toBits(charCode + 15, 6);
    }
    return null;
}

/**
 * Whether a character can be encoded in the numeric scheme.
 *
 * @param {number} charCode - The character code to check.
 * @returns {boolean} Whether the character is a digit.
 */
function isNumericChar(charCode: number): boolean {
    return charCode >= 48 && charCode <= 57;
}

/**
 * Whether a character can be encoded in the alphanumeric scheme.
 *
 * @param {number} charCode - The character code to check.
 * @returns {boolean} Whether the character is supported.
 */
function isAlphanumericChar(charCode: number): boolean {
    return encodeAlphanumericChar(charCode) !== null;
}

/**
 * Encode one character with the ISO 646 scheme. Returns null when the
 * character is not encodable.
 *
 * @param {number} charCode - The character code to encode.
 * @returns {number[] | null} The encoded bits, or null if unsupported.
 */
function encodeIso646Char(charCode: number): number[] {
    if (charCode >= 48 && charCode <= 57) {
        return toBits(charCode - 43, 5);
    }
    if (charCode === 15 || charCode === GPF_FNC1) {
        return [0, 1, 1, 1, 1];
    }
    if (charCode >= 65 && charCode <= 90) {
        return toBits(charCode - 1, 7);
    }
    if (charCode >= 97 && charCode <= 122) {
        return toBits(charCode - 7, 7);
    }
    if (charCode === 33) {
        return [1, 1, 1, 0, 1, 0, 0, 0];
    }
    if (charCode === 34) {
        return [1, 1, 1, 0, 1, 0, 0, 1];
    }
    if (charCode >= 37 && charCode <= 47) {
        return toBits(charCode + 197, 8);
    }
    if (charCode >= 58 && charCode <= 63) {
        return toBits(charCode + 187, 8);
    }
    if (charCode === 95) {
        return [1, 1, 1, 1, 1, 0, 1, 1];
    }
    if (charCode === 32) {
        return [1, 1, 1, 1, 1, 1, 0, 0];
    }
    return null;
}

/**
 * Whether a character can be encoded in the ISO 646 scheme.
 *
 * @param {number} charCode - The character code to check.
 * @returns {boolean} Whether the character is supported.
 */
function isIso646Char(charCode: number): boolean {
    return encodeIso646Char(charCode) !== null;
}

/**
 * Build the general-purpose field of the Expanded general method: the
 * characters of the AI values after the (01), with the FNC1 separators the
 * parser marked, latching between the numeric, alphanumeric and ISO 646
 * encodings to keep the bit stream compact, per ISO/IEC 24724.
 *
 * @param {number[]} gpf - The field characters, FNC1 as -1.
 * @returns {number[]} The encoded bits.
 */
function encodeGeneralPurposeField(gpf: number[]): number[] {
    let bits: number[] = [];
    let mode: string = 'numeric';
    let index: number = 0;
    // The latch patterns of ISO/IEC 24724: 0000 from numeric to
    // alphanumeric, and 00100 to ISO 646.
    const LATCH_ALNUM_FROM_NUM: number[] = [0, 0, 0, 0];
    const LATCH_ISO_FROM_ALNUM: number[] = [0, 0, 1, 0, 0];
    while (index < gpf.length) {
        const charCode: number = gpf[parseInt(index.toString(), 10)];
        if (mode === 'numeric') {
            // The numeric symbol of a character: a digit 0 to 9, or 10 for FNC1.
            const symbolOf: (c: number) => number = (c: number): number => c === GPF_FNC1 ? 10 : c - 48;
            const isNumSymbol: (c: number) => boolean =
                (c: number): boolean => isNumericChar(c) || c === GPF_FNC1;
            if (index + 1 <= gpf.length - 1 && isNumSymbol(charCode) && isNumSymbol(gpf[index + 1])
                && !(charCode === GPF_FNC1 && gpf[index + 1] === GPF_FNC1)) {
                // A pair of numeric symbols that is not FNC1-FNC1.
                bits = bits.concat(encodeNumericPair(symbolOf(charCode), symbolOf(gpf[index + 1])));
                index += 2;
                continue;
            }
            if (index === gpf.length - 1 && isNumericChar(charCode)) {
                // A single digit at the end: digit + 1 into 4 to 6 bits.
                bits = bits.concat(toBits(charCode - 47, 4));
                index++;
                continue;
            }
            if (index === gpf.length - 1 && charCode === GPF_FNC1) {
                // A lone FNC1 at the end: the 0000 symbol.
                bits = bits.concat(toBits(0, 4));
                index++;
                continue;
            }
            bits = bits.concat(LATCH_ALNUM_FROM_NUM);
            mode = 'alphanumeric';
            continue;
        }
        if (mode === 'alphanumeric') {
            if (charCode === GPF_FNC1) {
                bits = bits.concat([0, 1, 1, 1, 1]);
                mode = 'numeric';
                index++;
                continue;
            }
            if (isIso646Char(charCode) && !isAlphanumericChar(charCode)) {
                bits = bits.concat(LATCH_ISO_FROM_ALNUM);
                mode = 'iso646';
                continue;
            }
            bits = bits.concat(encodeAlphanumericChar(charCode));
            index++;
            continue;
        }
        // iso646 mode
        if (charCode === GPF_FNC1) {
            bits = bits.concat([0, 1, 1, 1, 1]);
            mode = 'numeric';
            index++;
            continue;
        }
        bits = bits.concat(encodeIso646Char(charCode));
        index++;
    }
    return bits;
}

/**
 * Encode a validated GS1 element string as a GS1 DataBar Expanded. When the
 * data is a (01) GTIN starting with 9 followed by one weight or price AI that
 * the standard defines a compressed method for, ISO/IEC 24724 encoding
 * method 3 ((01) plus (3103), at most 32.767 kilograms) or method 5 ((01)
 * plus (392n) with n from 0 to 3) encodes the AI into the compressed data
 * field; every other data uses the general encoding method.
 *
 * @param {Gs1Success} gs1 - The parsed and validated GS1 data.
 * @param {number} [segmentsPerRow] - The stacked symbol's segments per row.
 * @returns {Gs1DataBarExpandedEncoded | Gs1DataBarError} The encoded characters, or the error.
 */
export function encodeExpandedDataBar(
    gs1: Gs1Success, segmentsPerRow?: number): Gs1DataBarExpandedEncoded | Gs1DataBarError {
    const elements: { ai: string; value: string; variableLength: boolean }[] = gs1.elements;
    if (!elements.length || elements[0].ai !== '01') {
        return 'DataBarDataTooLong';
    }
    const gtin: string = elements[0].value;
    // The compressed (01): the 12 digits after the leading digit, excluding
    // the check digit, as four 10-bit groups.
    const gtinGroups: number[] = [
        parseInt(gtin.substring(1, 4), 10),
        parseInt(gtin.substring(4, 7), 10),
        parseInt(gtin.substring(7, 10), 10),
        parseInt(gtin.substring(10, 13), 10)];
    // The compressed methods need the GTIN to start with 9 and one further
    // element: (3103) for method 3, or (392n) with n from 0 to 3 for method 5.
    let encodingMethod: number = 1;
    if (gtin.charCodeAt(0) === 57 && elements.length >= 2) {
        const second: { ai: string; value: string; variableLength: boolean } = elements[1];
        const priceDigit: number = second.ai.length === 4 && second.ai.indexOf('392') === 0
            ? second.ai.charCodeAt(3) - 48 : -1;
        if (second.ai === '3103' && second.value.length === 6 && elements.length === 2
            && parseInt(second.value, 10) <= 32767) {
            encodingMethod = 3;
        } else if (priceDigit >= 0 && priceDigit <= 3) {
            encodingMethod = 5;
        }
    }
    let bits: number[] = [];
    let vlfOffset: number = -1;
    // For the general method include each AI and value. Compressed methods
    // encode their AI in the method field and include only the values here.
    const gpf: number[] = [];
    if (encodingMethod === 5) {
        // The price value starts the general-purpose field.
        let charIndex: number;
        for (charIndex = 0; charIndex < elements[1].value.length; charIndex++) {
            gpf.push(elements[1].value.charCodeAt(charIndex));
        }
        // The variable-length price value ends with FNC1 when other elements
        // follow it, as the parser marked.
        if (elements.length > 2 && gs1.separatingFnc1After.indexOf(1) !== -1) {
            gpf.push(GPF_FNC1);
        }
    }
    const firstFieldElement: number = encodingMethod === 1 ? 1 : 2;
    let elementIndex: number;
    for (elementIndex = firstFieldElement; elementIndex < elements.length; elementIndex++) {
        const element: { ai: string; value: string; variableLength: boolean } =
            elements[parseInt(elementIndex.toString(), 10)];
        let charIndex: number;
        if (encodingMethod === 1 || encodingMethod === 5) {
            for (charIndex = 0; charIndex < element.ai.length; charIndex++) {
                gpf.push(element.ai.charCodeAt(charIndex));
            }
        }
        for (charIndex = 0; charIndex < element.value.length; charIndex++) {
            gpf.push(element.value.charCodeAt(charIndex));
        }
        if (elementIndex !== elements.length - 1 && gs1.separatingFnc1After.indexOf(elementIndex) !== -1) {
            gpf.push(GPF_FNC1);
        }
    }
    if (encodingMethod === 3) {
        // Linkage bit 0, then method field 0100, the GTIN groups and the weight
        // in 15 bits, per ISO/IEC 24724 Table 10 and 7.2.5.4.
        bits = bits.concat([0, 0, 1, 0, 0]);
        let groupIndex: number;
        for (groupIndex = 0; groupIndex < gtinGroups.length; groupIndex++) {
            bits = bits.concat(toBits(gtinGroups[parseInt(groupIndex.toString(), 10)], 10));
        }
        bits = bits.concat(toBits(parseInt(elements[1].value, 10), 15));
    } else if (encodingMethod === 5) {
        // Linkage bit 0, five-bit method field 01100, then the two-bit
        // variable-length field indicator before the compressed GTIN.
        bits = bits.concat([0, 0, 1, 1, 0, 0]);
        vlfOffset = bits.length;
        bits = bits.concat([0, 0]);
        let groupIndex: number;
        for (groupIndex = 0; groupIndex < gtinGroups.length; groupIndex++) {
            bits = bits.concat(toBits(gtinGroups[parseInt(groupIndex.toString(), 10)], 10));
        }
        bits = bits.concat(toBits(elements[1].ai.charCodeAt(3) - 48, 2));
    } else {
        // Linkage bit 0, general method field 1, then the two-bit variable-
        // length field indicator and compressed (01) GTIN.
        bits = bits.concat([0, 1]);
        vlfOffset = bits.length;
        bits = bits.concat([0, 0]);
        bits = bits.concat(toBits(parseInt(gtin.substring(0, 1), 10), 4));
        bits = bits.concat(toBits(parseInt(gtin.substring(1, 4), 10), 10));
        bits = bits.concat(toBits(parseInt(gtin.substring(4, 7), 10), 10));
        bits = bits.concat(toBits(parseInt(gtin.substring(7, 10), 10), 10));
        bits = bits.concat(toBits(parseInt(gtin.substring(10, 13), 10), 10));
    }
    bits = bits.concat(encodeGeneralPurposeField(gpf));
    // Pad the bit stream to the next valid symbol size: a multiple of 12
    // bits (the data-character size) and at least 4 data characters. A size
    // that would leave one character in the last row is extended by one
    // character. The pad pattern is 00100, prefixed by 0000 when the field
    // ends in numeric mode so the reader latches back.
    let padded: number[] = bits;
    const numericEnd: boolean = gpf.length > 0 && isNumericChar(gpf[gpf.length - 1]);
    const nextSize: (candidate: number) => number = (candidate: number): number => {
        let value: number = Math.ceil(candidate / 12) * 12;
        if (value < 48) {
            value = 48;
        }
        // The VLF count is the number of data characters; avoid a one-
        // character final row in stacked symbols.
        const rowSegments: number = segmentsPerRow === undefined ? 22 : segmentsPerRow;
        if (rowSegments < 2 || rowSegments > 22 || rowSegments % 2 !== 0) {
            return -1;
        }
        if ((value / 12) % rowSegments === 1) {
            value += 12;
        }
        return value;
    };
    const target: number = nextSize(padded.length);
    if (target < 0) {
        return 'DataBarDataTooLong';
    }
    if (vlfOffset >= 0) {
        const vlfLength: number = target / 12;
        padded.splice(vlfOffset, 2, vlfLength % 2, vlfLength > 14 ? 1 : 0);
    }
    let padBits: number = target - padded.length;
    if (numericEnd && padBits >= 4) {
        padded = padded.concat([0, 0, 0, 0]);
        padBits -= 4;
    }
    while (padBits >= 5) {
        padded = padded.concat([0, 0, 1, 0, 0]);
        padBits -= 5;
    }
    // Any remainder shorter than the pad pattern is zeros.
    while (padBits > 0) {
        padded = padded.concat([0]);
        padBits--;
    }
    // At most 21 data characters of 12 bits.
    const dataCount: number = padded.length / 12;
    if (dataCount > 21) {
        return 'DataBarDataTooLong';
    }
    const dataValues: number[] = [];
    let dataIndex: number;
    for (dataIndex = 0; dataIndex < dataCount; dataIndex++) {
        let charValue: number = 0;
        let bitIndex: number;
        for (bitIndex = 0; bitIndex < 12; bitIndex++) {
            charValue = charValue * 2 + padded[dataIndex * 12 + bitIndex];
        }
        dataValues.push(charValue);
    }
    // The data-character element widths in symbol order. Even-positioned
    // characters are filled from the right, so the checksum sees the widths in
    // the order they are printed, per ISO/IEC 24724.
    const encodeCharWidths: (value: number, fromRight: boolean) => number[] =
        (value: number, fromRight: boolean): number[] => {
            const group: number[] = findGroup(value, EXPANDED_GROUPS);
            // Odd = (value - gsum) div totalEven with narrow required;
            // even = remainder with narrow not required, per ISO/IEC 24724.
            const odd: number[] = getRssWidths(
                Math.floor((value - group[1]) / group[7]), 4, group[2], group[4], true);
            const even: number[] = getRssWidths(
                (value - group[1]) % group[7], 4, group[3], group[5], false);
            return fromRight ? interleaveReverse(odd, even) : interleave(odd, even);
        };
    // Check character: module 211 over the weighted element widths of the
    // data characters. The check character occupies the first finder-weight
    // slot, so data characters consume the remaining slots in sequence.
    const finderSequence: number[] = EXPANDED_FINDER_SEQUENCES[
        Math.floor((dataCount - 2) / 2)];
    let checksum: number = 0;
    let charIndex: number;
    for (charIndex = 0; charIndex < dataCount; charIndex++) {
        // Even-positioned data characters are weighted in reverse element order,
        // matching the order in which they are printed, per ISO/IEC 24724.
        const widths: number[] = encodeCharWidths(dataValues[parseInt(charIndex.toString(), 10)], false).slice();
        if (charIndex % 2 === 0) {
            widths.reverse();
        }
        const sequenceIndex: number = Math.floor((charIndex + 1) / 2);
        const finderIndex: number | undefined = finderSequence.find(
            (value: number, index: number) => index === sequenceIndex);
        if (finderIndex === undefined) {
            return 'DataBarDataTooLong';
        }
        const weightPairIndex: number = finderIndex * 2;
        const weightRowIndex: number = weightPairIndex + (charIndex % 2 === 0 ? 1 : 0);
        const weights: number[] | undefined = EXPANDED_CHECK_WEIGHTS.find(
            (value: number[], index: number) => index === weightRowIndex);
        if (weights === undefined) {
            return 'DataBarDataTooLong';
        }
        let weightIndex: number;
        for (weightIndex = 0; weightIndex < 8; weightIndex++) {
            checksum += widths[parseInt(weightIndex.toString(), 10)]
                * weights[parseInt(weightIndex.toString(), 10)];
        }
    }
    checksum = checksum % 211 + (dataCount - 3) * 211;
    if (checksum < 0 || checksum > 4191) {
        return 'DataBarDataTooLong';
    }
    // Build the characters: the check character first, then the data
    // characters. Even-positioned characters are filled from the right and are
    // followed by a finder pattern, per ISO/IEC 24724.
    const allValues: number[] = [checksum].concat(dataValues);
    const segments: Gs1DataBarSegment[] = [];
    for (charIndex = 0; charIndex < allValues.length; charIndex++) {
        const value: number = allValues[parseInt(charIndex.toString(), 10)];
        const dataWidths: number[] = encodeCharWidths(value, charIndex % 2 === 0);
        let finderWidths: number[] = null;
        let finder: number = -1;
        if (charIndex % 2 === 0) {
            finder = finderSequence[parseInt((charIndex / 2).toString(), 10)];
            finderWidths = EXPANDED_FINDER_WIDTHS[parseInt(finder.toString(), 10)].slice();
        }
        segments.push({
            dataWidths: dataWidths,
            finderWidths: finderWidths,
            finder: finder
        });
    }
    return {
        humanReadableText: gs1.humanReadableText,
        segments: segments,
        characterCount: segments.length
    };
}
