/**
 * Physical length measurements for drawings, page margins, and related
 * internal authoring paths (API-RULES R4.1–R4.3).
 *
 * **Not part of the package root API.** Import only from this module inside
 * the library (or tests that exercise it). Callers must not rely on
 * `Cm` / `Emu` / `Inches` / `Mm` / `Pt` / `Px` / `isLength` / `Length` as
 * public exports from `@syncfusion/ej2-xlsx`.
 *
 * Internal base unit is EMU (English Metric Unit).
 * 1 inch = 914400 EMU, 1 pt = 12700 EMU — both exact.
 *
 * Citations:
 * - docs/api/API-RULES.md R4.1–R4.3
 * - ECMA-376 drawing EMU; SpreadsheetML page margins in inches
 *
 * @private
 */

import { InvalidArgumentError } from './errors';

declare const lengthBrand: unique symbol;

/**
 * A physical length used for drawing sizes and page margins, created with
 * unit helpers such as `Inches` or `Pt`.
 */
export type Length = number & { readonly [lengthBrand]: void };

/** EMU per inch (exact). */
export const EMU_PER_INCH: 914400 = 914_400;

/** EMU per centimeter (exact). */
export const EMU_PER_CM: 360000 = 360_000;

/** EMU per millimeter (exact). */
export const EMU_PER_MM: 36000 = 36_000;

/** EMU per point (exact; 72 pt = 1 in). */
export const EMU_PER_PT: 12700 = 12_700;

/** EMU per CSS pixel at 96 DPI (914400 / 96). */
export const EMU_PER_PX_96DPI: 9525 = 9_525;

/**
 * brand function.
 *
 * @param {number} emu - The emu parameter.
 * @returns {Length} - Returns the result.
 */
function brand(emu: number): Length {
    return emu as Length;
}

/**
 * requireFiniteNonNegative function.
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {number} - Returns the result.
 */
function requireFiniteNonNegative(value: number, label: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new InvalidArgumentError(`${label} must be a finite number`);
    }
    if (value < 0) {
        throw new InvalidArgumentError(`${label} must be >= 0`);
    }
    return value;
}

/**
 * Inches function.
 *
 * @param {number} value - The value parameter.
 * @returns {Length} - Returns the result.
 */
export function Inches(value: number): Length {
    return brand(requireFiniteNonNegative(value, 'Inches') * EMU_PER_INCH);
}

/**
 * Cm function.
 *
 * @param {number} value - The value parameter.
 * @returns {Length} - Returns the result.
 */
export function Cm(value: number): Length {
    return brand(requireFiniteNonNegative(value, 'Cm') * EMU_PER_CM);
}

/**
 * Mm function.
 *
 * @param {number} value - The value parameter.
 * @returns {Length} - Returns the result.
 */
export function Mm(value: number): Length {
    return brand(requireFiniteNonNegative(value, 'Mm') * EMU_PER_MM);
}

/**
 * Pt function.
 *
 * @param {number} value - The value parameter.
 * @returns {Length} - Returns the result.
 */
export function Pt(value: number): Length {
    return brand(requireFiniteNonNegative(value, 'Pt') * EMU_PER_PT);
}

/**
 * Px function.
 *
 * @param {number} value - The value parameter.
 * @returns {Length} - Returns the result.
 */
export function Px(value: number): Length {
    return brand(requireFiniteNonNegative(value, 'Px') * EMU_PER_PX_96DPI);
}

/**
 * Emu function.
 *
 * @param {number} value - The value parameter.
 * @returns {Length} - Returns the result.
 */
export function Emu(value: number): Length {
    return brand(requireFiniteNonNegative(value, 'Emu'));
}

/**
 * isLength function.
 *
 * @param {*} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
export function isLength(value: unknown): value is Length {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Raw EMU for a {@link Length}. @private
 *
 * @param {Length} length - The length parameter.
 * @returns {number} - Returns the result.
 */
export function lengthToEmu(length: Length): number {
    return length;
}

/**
 * Convert length to inches (SpreadsheetML page-margin unit). Half-away-from-zero rounding is applied by callers when serializing.
 *
 * @param {Length} length - The length parameter.
 * @returns {number} - Returns the result.
 */
export function lengthToInches(length: Length): number {
    return (length as number) / EMU_PER_INCH;
}

/**
 * Build a Length from an inches double (load path).
 *
 * @param {number} inches - The inches parameter.
 * @returns {Length} - Returns the result.
 */
export function inchesToLength(inches: number): Length {
    return Inches(inches);
}

/**
 * Format an inches double for OOXML attributes (trim trailing zeros).
 *
 * @param {number} inches - The inches parameter.
 * @returns {string} - Returns the result.
 */
export function formatInchesAttr(inches: number): string {
    if (!Number.isFinite(inches)) {
        return '0';
    }
    // Keep enough precision for common margin values without scientific notation.
    const rounded: number = Math.round(inches * 1_000_000) / 1_000_000;
    let s: string = String(rounded);
    if (s.includes('e') || s.includes('E')) {
        s = rounded.toFixed(6);
    }
    if (s.includes('.')) {
        s = s.replace(/\.?0+$/, '');
    }
    return s.length === 0 ? '0' : s;
}
