/**
 * Simple typed wrappers for `w:defaultTabStop` and `w:characterSpacingControl`
 * (`CT_TwipsMeasure` and `ST_CharacterSpacing`, Transitional `wml.xsd`).
 *
 * @private
 */
import { WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { pointToTwips, twipsToPoint } from '../document/length';
import { wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlAttribute } from '../../core/xml/model';
/**
 * `ST_CharacterSpacing` values from Transitional `wml.xsd`.
 *
 * - `doNotCompress` — no compression
 * - `compressPunctuation` — compress punctuation
 * - `compressPunctuationAndJapaneseKana` — compress both
 *
 * @public
 */
export type CharacterSpacingControl = 'doNotCompress' | 'compressPunctuation' | 'compressPunctuationAndJapaneseKana';
const VALID_CSC: Set<string> = new Set<string>([
    'doNotCompress',
    'compressPunctuation',
    'compressPunctuationAndJapaneseKana'
]);
function wValStr(element: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((a: OpenXmlAttribute) => a.localName === 'val' &&
        (a.namespaceUri === WML_TRANSITIONAL_NAMESPACE || a.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
/**
 * Parse `w:defaultTabStop/@w:val` (`ST_TwipsMeasure` on the wire) into plain points.
 * Returns `undefined` when missing or non-numeric.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {number | undefined} The result.
 * @private
 */
export function parseDefaultTabStop(element: OpenXmlElement): number | undefined {
    const val: string = wValStr(element);
    if (val === undefined)
    { return undefined; }
    const n: number = Number(val);
    return Number.isNaN(n) ? undefined : twipsToPoint(n);
}
/**
 * Serialize `w:defaultTabStop` from a plain points value (writes twips on the wire).
 *
 * @param {number} value - The value.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeDefaultTabStop(value: number): OpenXmlElement {
    return wmlElement('defaultTabStop', { attributes: [wmlAttr('val', String(pointToTwips(value)))] });
}
/**
 * Parse `w:characterSpacingControl/@w:val`.
 * Returns `undefined` when missing or not a recognised value.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {CharacterSpacingControl | undefined} The result.
 * @private
 */
export function parseCharacterSpacingControl(element: OpenXmlElement): CharacterSpacingControl | undefined {
    const val: string = wValStr(element);
    if (val === undefined || !VALID_CSC.has(val))
    { return undefined; }
    return val as CharacterSpacingControl;
}
/**
 * Serialize `w:characterSpacingControl` from a value.
 *
 * @param {CharacterSpacingControl} value - The value.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeCharacterSpacingControl(value: CharacterSpacingControl): OpenXmlElement {
    return wmlElement('characterSpacingControl', { attributes: [wmlAttr('val', value)] });
}
