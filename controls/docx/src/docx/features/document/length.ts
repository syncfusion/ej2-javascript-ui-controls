/**
 * Measurement helpers for the document API.
 *
 * Public authoring values are plain `number` values in **typographic points**
 * (1 pt = 1/72 in). Conversion to OOXML storage units (twips, half-points, EMU)
 * happens only at the parse/serialize boundary.
 *
 * Factors:
 * - 1 pt = 20 twips
 * - 1 pt = 2 half-points (`w:sz`)
 * - 1 pt = 12_700 EMU (DrawingML)
 * - 1 in = 72 pt = 914_400 EMU
 *
 * @packageDocumentation
 */

/** @internal EMU per inch (DrawingML). */
const EMU_PER_INCH: number = 914400;
/** @internal EMU per point. */
const EMU_PER_PT: number = 12700;
/** @internal EMU per twip. */
const EMU_PER_TWIP: number = 635;
/** @internal EMU per half-point. */
const EMU_PER_HALF_POINT: number = 6350;
/** @internal EMU per centimeter. */
const EMU_PER_CM: number = 360000;
/** @internal EMU per millimeter. */
const EMU_PER_MM: number = 36000;
/** @internal EMU per CSS px at 96 DPI. */
const EMU_PER_PX_96DPI: number = 9525;

/** @internal Twips per point. */
const TWIPS_PER_PT: number = 20;
/** @internal Half-points per point. */
const HALF_POINTS_PER_PT: number = 2;
/** @internal Points per inch. */
const PT_PER_INCH: number = 72;

/**
 * Storage EMU brand for DrawingML extents (`wp:extent/@cx|cy`, etc.).
 *
 * Prefer plain point `number` on public authoring APIs. Package-private
 * codecs brand raw EMU integers at the wire boundary only.
 *
 * @internal
 */
export type Emus = number & { readonly __brand: 'Emus' };

/**
 * Half-points brand for `w:sz` / position wire values.
 * Package-private; public authoring uses plain point `number`.
 *
 * @internal
 */
export type HalfPoints = number & { readonly __brand: 'HalfPoints' };

function assertFinite(name: string, value: number): void {
    if (!Number.isFinite(value)) {
        throw new RangeError(`${name} must be finite, got ${String(value)}`);
    }
}

/**
 * @param {number} points - The points.
 * @returns {Emus} The result.
 * @internal Convert points → integer EMUs for DrawingML extents.
 */
export function pointToEmus(points: number): Emus {
    assertFinite('points', points);
    const rounded: number = Math.round(points * EMU_PER_PT);
    if (rounded <= 0) {
        throw new RangeError(`Image dimensions must be positive, got ${String(rounded)} EMU`);
    }
    return rounded as Emus;
}

/**
 * @param {number} points - The points.
 * @returns {Emus} The result.
 * @internal Points → integer EMUs for DrawingML coordinates that allow 0 / negative
 * (`dist*`, `wp:posOffset`, `wp:simplePos`). Prefer {@link pointToEmus} for extents.
 *
 * Brands as {@link Emus} without the positive-only guard in {@link emus}.
 */
export function pointToCoordinateEmus(points: number): Emus {
    assertFinite('points', points);
    return Math.round(points * EMU_PER_PT) as Emus;
}

/**
 * @param {number} points - The points.
 * @returns {HalfPoints} The result.
 * @internal Convert points → half-points for `w:sz`, clamped to Word range.
 */
export function pointToHalfPoints(points: number): HalfPoints {
    assertFinite('points', points);
    const halfPointsValue: number = Math.round(points * HALF_POINTS_PER_PT);
    const clamped: number = Math.min(Math.max(halfPointsValue, 0), 3276);
    if (clamped <= 0) {
        throw new RangeError(`Font size must be positive, got ${String(clamped)} half-points`);
    }
    return clamped as HalfPoints;
}

/**
 * @param {number} points - The points.
 * @returns {number} The result.
 * @internal Points → signed half-points (no clamp; allows negative `w:position` / `w:kern`).
 */
export function pointToSignedHalfPoints(points: number): number {
    assertFinite('points', points);
    return Math.round(points * HALF_POINTS_PER_PT);
}

/**
 * @param {number} points - The points.
 * @returns {number} The result.
 * @internal Convert points → integer twips (half-away-from-zero).
 */
export function pointToTwips(points: number): number {
    assertFinite('points', points);
    return Math.round(points * TWIPS_PER_PT);
}

/**
 * @param {number} twips - The twips.
 * @returns {number} The result.
 * @internal Twips → points (signed values allowed).
 */
export function twipsToPoint(twips: number): number {
    assertFinite('twips', twips);
    return twips / TWIPS_PER_PT;
}

/**
 * @param {number} emu - The emu.
 * @returns {number} The result.
 * @internal Raw EMU integer → points.
 */
export function emuToPoint(emu: number): number {
    assertFinite('emu', emu);
    return emu / EMU_PER_PT;
}

/**
 * @param {number} halfPointsValue - The half points value.
 * @returns {number} The result.
 * @internal Half-points → points (signed values allowed for position).
 */
export function halfPointsToPoint(halfPointsValue: number): number {
    assertFinite('halfPoints', halfPointsValue);
    return halfPointsValue / HALF_POINTS_PER_PT;
}

/**
 * @param {number} a - The a.
 * @param {number} b - The b.
 * @returns {number} The result.
 * @internal Add two point measures.
 */
export function addPoints(a: number, b: number): number {
    assertFinite('a', a);
    assertFinite('b', b);
    return a + b;
}

/**
 * @param {number} points - The points.
 * @param {number} factor - The factor.
 * @returns {number} The result.
 * @internal Scale a point measure by a finite factor.
 */
export function scalePoint(points: number, factor: number): number {
    assertFinite('points', points);
    assertFinite('Scale factor', factor);
    return points * factor;
}

/**
 * @param {number} value - The value.
 * @returns {number} The result.
 * @internal Inches → points (package-private authoring helper).
 */
export function inchesToPoint(value: number): number {
    assertFinite('inches', value);
    return value * PT_PER_INCH;
}

/**
 * @param {number} value - The value.
 * @returns {number} The result.
 * @internal Centimeters → points.
 */
export function cmToPoint(value: number): number {
    assertFinite('cm', value);
    return (value * EMU_PER_CM) / EMU_PER_PT;
}

/**
 * @param {number} value - The value.
 * @returns {number} The result.
 * @internal Millimeters → points.
 */
export function mmToPoint(value: number): number {
    assertFinite('mm', value);
    return (value * EMU_PER_MM) / EMU_PER_PT;
}

/**
 * @param {number} value - The value.
 * @returns {number} The result.
 * @internal CSS pixels at 96 DPI → points.
 */
export function pxToPoint(value: number): number {
    assertFinite('px', value);
    return (value * EMU_PER_PX_96DPI) / EMU_PER_PT;
}

/**
 * @param {number} value - The value.
 * @returns {HalfPoints} The result.
 * @internal Half-points brand for run storage.
 */
export function halfPoints(value: number): HalfPoints {
    if (!Number.isInteger(value) || value < 0) {
        throw new RangeError(`Half-points must be a non-negative integer, got ${String(value)}`);
    }
    return value as HalfPoints;
}

/**
 * @param {number} value - The value.
 * @returns {Emus} The result.
 * @internal Positive EMU brand for DrawingML storage.
 */
export function emus(value: number): Emus {
    if (!Number.isInteger(value) || value <= 0) {
        throw new RangeError(`EMUs must be a positive integer, got ${String(value)}`);
    }
    return value as Emus;
}

/**
 * @param {number} points - The points.
 * @returns {Emus} The result.
 * @internal @deprecated Prefer {@link pointToEmus}.
 * Residual alias — do not use in new code.
 */
export function lengthToEmus(points: number): Emus {
    return pointToEmus(points);
}

/**
 * @param {number} points - The points.
 * @returns {HalfPoints} The result.
 * @internal @deprecated Prefer {@link pointToHalfPoints}.
 * Residual alias — do not use in new code.
 */
export function lengthToHalfPoints(points: number): HalfPoints {
    return pointToHalfPoints(points);
}

/** @internal Conversion constants for tests and bridges. */
export const LengthUnits: {
    EMU_PER_INCH: number;
    EMU_PER_PT: number;
    EMU_PER_TWIP: number;
    EMU_PER_HALF_POINT: number;
    EMU_PER_CM: number;
    EMU_PER_MM: number;
    EMU_PER_PX_96DPI: number;
    TWIPS_PER_PT: number;
    HALF_POINTS_PER_PT: number;
    PT_PER_INCH: number;
} = {
    EMU_PER_INCH,
    EMU_PER_PT,
    EMU_PER_TWIP,
    EMU_PER_HALF_POINT,
    EMU_PER_CM,
    EMU_PER_MM,
    EMU_PER_PX_96DPI,
    TWIPS_PER_PT,
    HALF_POINTS_PER_PT,
    PT_PER_INCH
};

// ---------------------------------------------------------------------------
// Package-private aliases (not public barrel). Prefer plain point numbers.
// ---------------------------------------------------------------------------

/** @internal @deprecated Use plain point `number`. */
export type Length = number;

/** @internal @deprecated Use plain point `number`. */
export type PointValue = number;

/**
 *  @internal @deprecated Pass point numbers directly.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Pt(value: number): number {
    assertFinite('Pt', value);
    return value;
}

/**
 *  @internal @deprecated Use {@link inchesToPoint}.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Inches(value: number): number {
    return inchesToPoint(value);
}

/**
 *  @internal @deprecated Use {@link cmToPoint}.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Cm(value: number): number {
    return cmToPoint(value);
}

/**
 *  @internal @deprecated Use {@link mmToPoint}.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Mm(value: number): number {
    return mmToPoint(value);
}

/**
 *  @internal @deprecated Use {@link pxToPoint}.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Px(value: number): number {
    return pxToPoint(value);
}

/**
 *  @internal @deprecated Use {@link twipsToPoint}.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Twips(value: number): number {
    return twipsToPoint(value);
}

/**
 *  @internal @deprecated Use {@link emuToPoint}.
 *
 * @param {number} value - The value.
 * @returns {number} The result.
 */
export function Emu(value: number): number {
    if (!Number.isInteger(value)) {
        throw new RangeError(`Emu must be an integer, got ${String(value)}`);
    }
    return emuToPoint(value);
}

/**
 *  @internal @deprecated Use {@link addPoints}.
 *
 * @param {number} a - The a.
 * @param {number} b - The b.
 * @returns {number} The result.
 */
export function add(a: number, b: number): number {
    return addPoints(a, b);
}

/**
 *  @internal @deprecated Use {@link scalePoint}.
 *
 * @param {number} points - The points.
 * @param {number} factor - The factor.
 * @returns {number} The result.
 */
export function scale(points: number, factor: number): number {
    return scalePoint(points, factor);
}

/**
 * @param {number} value - The value.
 * @returns {number} The result.
 * @internal @deprecated Public API uses plain point numbers — do not call.
 * Identity helper retained only so residual dual-gap call sites compile during migration.
 */
export function Point(value: number): number {
    assertFinite('points', value);
    return value;
}
