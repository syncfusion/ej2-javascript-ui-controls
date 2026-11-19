/**
 * Map between public {@link BorderStyle} and OOXML `CT_Border` `@w:val`.
 *
 * Unknown wire values are preserved internally and do not surface as a public enum.
 */
import { ownGet } from '../../core/compat/object-compat';
import { BorderStyle } from '../document/page-setup';

const KNOWN_WIRE: { [wire: string]: BorderStyle } = {
    nil: BorderStyle.Nil,
    none: BorderStyle.None,
    single: BorderStyle.Single,
    thick: BorderStyle.Thick,
    double: BorderStyle.Double,
    dotted: BorderStyle.Dotted,
    dashed: BorderStyle.Dashed,
    dotDash: BorderStyle.DotDash,
    dotDotDash: BorderStyle.DotDotDash,
    triple: BorderStyle.Triple,
    thinThickSmallGap: BorderStyle.ThinThickSmallGap,
    thickThinSmallGap: BorderStyle.ThickThinSmallGap,
    thinThickThinSmallGap: BorderStyle.ThinThickThinSmallGap,
    thinThickMediumGap: BorderStyle.ThinThickMediumGap,
    thickThinMediumGap: BorderStyle.ThickThinMediumGap,
    thinThickThinMediumGap: BorderStyle.ThinThickThinMediumGap,
    thinThickLargeGap: BorderStyle.ThinThickLargeGap,
    thickThinLargeGap: BorderStyle.ThickThinLargeGap,
    thinThickThinLargeGap: BorderStyle.ThinThickThinLargeGap,
    wave: BorderStyle.Wave,
    doubleWave: BorderStyle.DoubleWave,
    dashSmallGap: BorderStyle.DashSmallGap,
    dashDotStroked: BorderStyle.DashDotStroked,
    threeDEmboss: BorderStyle.ThreeDEmboss,
    threeDEngrave: BorderStyle.ThreeDEngrave,
    outset: BorderStyle.Outset,
    inset: BorderStyle.Inset
};

/**
 * Parse `@w:val` to {@link BorderStyle}, or `undefined` when unknown/absent.
 *
 * @param {string | undefined} val - The val.
 * @returns {BorderStyle | undefined} The result.
 * @private
 */
export function borderStyleFromWire(val: string | undefined): BorderStyle | undefined {
    if (val === undefined) {
        return undefined;
    }
    const mapped: BorderStyle = ownGet(KNOWN_WIRE, val);
    return mapped !== undefined ? mapped : undefined;
}

const STYLE_TO_WIRE: { [style: string]: string } = (function (): { [style: string]: string } {
    const out: { [style: string]: string } = {};
    const keys: string[] = Object.keys(KNOWN_WIRE);
    for (const wire of keys) {
        const style: BorderStyle = ownGet(KNOWN_WIRE, wire)!;
        out[style as string] = wire;
    }
    return out;
})();

/**
 * Serialize {@link BorderStyle} to `@w:val`.
 *
 * @param {BorderStyle} style - The style.
 * @returns {string} The result.
 * @private
 */
export function borderStyleToWire(style: BorderStyle): string {
    const wire: string = STYLE_TO_WIRE[style as string];
    if (wire !== undefined) {
        return wire;
    }
    // Fall back only for values that already match a known wire token string.
    if (KNOWN_WIRE[style as string] !== undefined) {
        return style as string;
    }
    throw new RangeError('Unsupported BorderStyle value');
}

/**
 * True when `val` is a known public border style token.
 *
 * @param {string | undefined} val - The val.
 * @returns {boolean} The result.
 * @private
 */
export function isKnownBorderWire(val: string | undefined): boolean {
    return val !== undefined && ownGet(KNOWN_WIRE, val) !== undefined;
}
