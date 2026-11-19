import { Literal } from '../../core/literal-type';
/**
 * Length unit conversion for ink brush width/height.
 *
 * Formulas match Compression.Base `OfficeParser.GetPointValue` (unit→pt) and
 * `OfficeSerializer.ConvertPointsToUnit` (pt→unit). EMU factor: 12700 EMU/pt
 * (DrawingML).
 */

/**
 * DrawingML EMUs per point (OfficeParser / OfficeSerializer).
 *
 * @public
 */
export const EMUS_PER_POINT: Literal<12700> = 12700;

/**
 * Convert a numeric length in `units` to points.
 * Result is rounded to 2 decimal places (GetPointValue parity).
 *
 * @param {number} value - The value.
 * @param {string | undefined} units - The units.
 * @returns {number} The result.
 * @public
 */
export function unitValueToPoints(value: number, units: string | undefined): number {
    const u: string = ((units != null ? units : 'cm')).trim().toLowerCase();
    let points: number;
    switch (u) {
    case 'pt':
        points = value;
        break;
    case 'mm':
        points = (value / 25.4) * 72;
        break;
    case 'px':
        points = (value / 4) * 3;
        break;
    case 'in':
        points = value * 72;
        break;
    case 'cm':
        points = (value / 2.54) * 72;
        break;
    case 'emu':
        points = value / EMUS_PER_POINT;
        break;
    default:
        // Unknown unit: treat as EMU-less raw → cm (GetPointValue else branch uses EMU)
        points = value / EMUS_PER_POINT;
        break;
    }
    return round2(points);
}

/**
 * Convert points to the target unit (ConvertPointsToUnit).
 * Default / unknown unit → cm.
 *
 * @param {number} points - The points.
 * @param {string | undefined} units - The units.
 * @returns {number} The result.
 * @public
 */
export function pointsToUnit(points: number, units: string | undefined): number {
    const u: string = ((units != null ? units : 'cm')).trim().toLowerCase();
    switch (u) {
    case 'pt':
        return points;
    case 'mm':
        return (points * 25.4) / 72;
    case 'px':
        return (points * 96) / 72;
    case 'in':
        return points / 72;
    case 'cm':
        return (points * 2.54) / 72;
    case 'emu':
        return points * EMUS_PER_POINT;
    default:
        return (points * 2.54) / 72;
    }
}

/**
 * Format a unit magnitude with invariant 3-decimal style (`"0.###"`).
 *
 * @param {number} value - The value.
 * @returns {string} The result.
 * @public
 */
export function formatUnitValue(value: number): string {
    if (!Number.isFinite(value)) {
        return '0';
    }
    // Trim trailing zeros after up to 3 decimal places (InvariantCulture "0.###").
    const fixed: string = value.toFixed(3);
    if (!(fixed.indexOf('.') !== -1)) {
        return fixed;
    }
    return fixed.replace(/\.?0+$/, '');
}

/**
 * The round2.
 *
 * @param {number} n - The n.
 * @returns {number} The result.
 */
function round2(n: number): number {
    return Math.round(n * 100) / 100;
}
