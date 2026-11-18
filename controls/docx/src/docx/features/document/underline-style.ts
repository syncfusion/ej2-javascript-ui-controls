/**
 * Underline styles for character format (`w:u` / ST_Underline).
 *
 * Numeric values match the DocIO / requirement surface. Value 8 is reserved
 * and intentionally unused.
 *
 * @public
 */
export enum UnderlineStyle {
    None = 0,
    Single = 1,
    Words = 2,
    Double = 3,
    Dotted = 4,
    Thick = 6,
    Dash = 7,
    DotDash = 9,
    DotDotDash = 10,
    Wavy = 11,
    DottedHeavy = 20,
    DashHeavy = 23,
    DotDashHeavy = 25,
    DotDotDashHeavy = 26,
    WavyHeavy = 27,
    DashLong = 39,
    DashLongHeavy = 55,
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
