/**
 * Page number formats (`ST_NumberFormat` subset used for page numbers).
 *
 * Canonical enum lives in core. Wire helpers stay feature-local.
 *
 * Maps to `w:pgNumType/@w:fmt`.
 *
 * @public
 */
export { PageNumberStyle } from '../document/page-setup';
import { PageNumberStyle } from '../document/page-setup';

/** Wire tokens accepted for `w:pgNumType/@w:fmt`. */
export const PAGE_NUMBER_STYLE_WIRE: ReadonlySet<string> = new Set([
    'decimal',
    'upperRoman',
    'lowerRoman',
    'upperLetter',
    'lowerLetter',
    'ordinal',
    'cardinalText',
    'ordinalText',
    'numberInDash',
    'chicago'
]);

/**
 * @param {string} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isPageNumberStyleWire(value: string): boolean {
    return PAGE_NUMBER_STYLE_WIRE.has(value);
}

/**
 * @param {string | undefined} value - The value.
 * @returns {PageNumberStyle} The result.
 * @private
 */
export function pageNumberStyleFromWire(value: string | undefined): PageNumberStyle {
    if (value === undefined || !isPageNumberStyleWire(value)) {
        return PageNumberStyle.Arabic;
    }
    switch (value) {
    case 'decimal':
        return PageNumberStyle.Arabic;
    case 'upperRoman':
        return PageNumberStyle.UpperRoman;
    case 'lowerRoman':
        return PageNumberStyle.LowerRoman;
    case 'upperLetter':
        return PageNumberStyle.UpperLetter;
    case 'lowerLetter':
        return PageNumberStyle.LowerLetter;
    case 'ordinal':
        return PageNumberStyle.Ordinal;
    case 'cardinalText':
        return PageNumberStyle.CardinalText;
    case 'ordinalText':
        return PageNumberStyle.OrdinalText;
    case 'numberInDash':
        return PageNumberStyle.NumberInDash;
    case 'chicago':
        return PageNumberStyle.Chicago;
    default:
        return PageNumberStyle.Arabic;
    }
}
