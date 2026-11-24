/**
 * Underline styles for character format.
 *
 * Numeric values match the requirement surface. Value 8 is reserved
 * and intentionally unused.
 *
 * @public
 */
export enum UnderlineStyle {
    /** Specifies the none style. */
    None = 0,
    /** Specifies the single style. */
    Single = 1,
    /** Specifies the words style. */
    Words = 2,
    /** Specifies the double style. */
    Double = 3,
    /** Specifies the dotted style. */
    Dotted = 4,
    /** Specifies the thick style. */
    Thick = 6,
    /** Specifies the dash style. */
    Dash = 7,
    /** Specifies the dot dash style. */
    DotDash = 9,
    /** Specifies the dot dot dash style. */
    DotDotDash = 10,
    /** Specifies the wavy style. */
    Wavy = 11,
    /** Specifies the dotted heavy style. */
    DottedHeavy = 20,
    /** Specifies the dash heavy style. */
    DashHeavy = 23,
    /** Specifies the dot dash heavy style. */
    DotDashHeavy = 25,
    /** Specifies the dot dot dash heavy style. */
    DotDotDashHeavy = 26,
    /** Specifies the wavy heavy style. */
    WavyHeavy = 27,
    /** Specifies the dash long style. */
    DashLong = 39,
    /** Specifies the dash long heavy style. */
    DashLongHeavy = 55,
    /** Specifies the wavy double style. */
    WavyDouble = 43,
}

/**
 * Map ST_Underline wire string to {@link UnderlineStyle}.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {UnderlineStyle} The result.
 * @private
 */
export function underlineStyleFromWire(raw: string | undefined): UnderlineStyle {
    if (raw === undefined || raw === '' || raw === 'none') {
        return UnderlineStyle.None;
    }
    switch (raw) {
    case 'single':
        return UnderlineStyle.Single;
    case 'words':
        return UnderlineStyle.Words;
    case 'double':
        return UnderlineStyle.Double;
    case 'thick':
        return UnderlineStyle.Thick;
    case 'dotted':
        return UnderlineStyle.Dotted;
    case 'dottedHeavy':
        return UnderlineStyle.DottedHeavy;
    case 'dash':
        return UnderlineStyle.Dash;
    case 'dashed':
    case 'dashedHeavy':
        return UnderlineStyle.DashHeavy;
    case 'dashLong':
        return UnderlineStyle.DashLong;
    case 'dashLongHeavy':
        return UnderlineStyle.DashLongHeavy;
    case 'dotDash':
        return UnderlineStyle.DotDash;
    case 'dashDotHeavy':
    case 'dotDashHeavy':
        return UnderlineStyle.DotDashHeavy;
    case 'dotDotDash':
        return UnderlineStyle.DotDotDash;
    case 'dashDotDotHeavy':
    case 'dotDotDashHeavy':
        return UnderlineStyle.DotDotDashHeavy;
    case 'wave':
    case 'wavy':
        return UnderlineStyle.Wavy;
    case 'wavyHeavy':
        return UnderlineStyle.WavyHeavy;
    case 'wavyDouble':
        return UnderlineStyle.WavyDouble;
    default:
        return UnderlineStyle.Single;
    }
}

/**
 * Map {@link UnderlineStyle} to the preferred ST_Underline wire string.
 *
 * @param {UnderlineStyle} style - The style.
 * @returns {string} The result.
 * @private
 */
export function underlineStyleToWire(style: UnderlineStyle): string {
    switch (style) {
    case UnderlineStyle.None:
        return 'none';
    case UnderlineStyle.Single:
        return 'single';
    case UnderlineStyle.Words:
        return 'words';
    case UnderlineStyle.Double:
        return 'double';
    case UnderlineStyle.Dotted:
        return 'dotted';
    case UnderlineStyle.Thick:
        return 'thick';
    case UnderlineStyle.Dash:
        return 'dash';
    case UnderlineStyle.DotDash:
        return 'dotDash';
    case UnderlineStyle.DotDotDash:
        return 'dotDotDash';
    case UnderlineStyle.Wavy:
        return 'wave';
    case UnderlineStyle.DottedHeavy:
        return 'dottedHeavy';
    case UnderlineStyle.DashHeavy:
        return 'dashedHeavy';
    case UnderlineStyle.DotDashHeavy:
        return 'dotDashHeavy';
    case UnderlineStyle.DotDotDashHeavy:
        return 'dashDotDotHeavy';
    case UnderlineStyle.WavyHeavy:
        return 'wavyHeavy';
    case UnderlineStyle.DashLong:
        return 'dashLong';
    case UnderlineStyle.DashLongHeavy:
        return 'dashLongHeavy';
    case UnderlineStyle.WavyDouble:
        return 'wavyDouble';
    default:
        return 'single';
    }
}
