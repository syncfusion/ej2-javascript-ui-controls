/**
 * Conservative watermark shape detectors (TASK-8061).
 *
 * Prefer false negatives over false positives. Same predicates feed parse,
 * replace, and remove. Normative rules:
 * `docs/requirements/watermark-basic.md` (Detection).
 *
 * @packageDocumentation
 */
import { elementChildren } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { OpenXmlAttribute } from '../../core/xml/model';
/** VML main namespace (ECMA-376-4 VML). */
export const VML_NS: string = 'urn:schemas-microsoft-com:vml';
/** Exact text watermark shapetype token (parse + dirty emit). */
export const TEXT_WATERMARK_TYPE: string = '#_x0000_t136';
/** Canonical picture watermark shapetype token (dirty emit). */
export const PICTURE_WATERMARK_TYPE: string = '#_x0000_t75';
/** Malformed but tolerated picture type (parse only; dirty normalizes to single `#`). */
export const PICTURE_WATERMARK_TYPE_DOUBLE_HASH: string = '##_x0000_t75';
/** Word DocIO / UI text watermark id prefix. */
export const TEXT_WATERMARK_ID_PREFIX: string = 'PowerPlusWaterMarkObject';
/** Word DocIO / UI picture watermark id prefix. */
export const PICTURE_WATERMARK_ID_PREFIX: string = 'WordPictureWatermark';
/**
 * Parsed `v:shape/@style` declaration map (lower-cased keys, trimmed values).
 *
 * @param {string | undefined} style - The style.
 * @returns {Map<string, string>} The result.
 * @private
 */
export function parseVmlStyle(style: string | undefined): Map<string, string> {
    const out: Map<string, string> = new Map<string, string>();
    if (style === undefined || style.length === 0) {
        return out;
    }
    for (const part of style.split(';')) {
        const trimmed: string = part.trim();
        if (trimmed.length === 0) {
            continue;
        }
        const colon: number = trimmed.indexOf(':');
        if (colon <= 0) {
            continue;
        }
        const key: string = trimmed.slice(0, colon).trim().toLowerCase();
        const value: string = trimmed.slice(colon + 1).trim();
        if (key.length === 0) {
            continue;
        }
        out.set(key, value);
    }
    return out;
}
/**
 * Read an attribute from an element, accepting empty-namespace or a specific URI.
 *
 * VML attributes are commonly un-namespaced on the attribute node even when the
 * element carries the VML namespace.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 * @private
 */
export function vmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName &&
        (a.namespaceUri === '' || a.namespaceUri === VML_NS));
    return found == null ? undefined : found.value;
}
/**
 * True when `el` is a VML element with the given local name.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {boolean} The result.
 * @private
 */
export function isVml(el: OpenXmlElement, localName: string): boolean {
    return el.namespaceUri === VML_NS && el.localName === localName;
}
function hasChildLocal(el: OpenXmlElement, localName: string): boolean {
    for (const child of elementChildren(el)) {
        if (isVml(child, localName)) {
            return true;
        }
    }
    return false;
}
/**
 * Watermark positioning pattern shared by text (optional id) and picture
 * (with negative z-index when z-index is present):
 * absolute + horizontal/vertical center + both relatives margin.
 *
 * @param {ReadonlyMap<string, string>} style - The style.
 * @param {Object} options - The options.
 * @returns {boolean} The result.
 * @private
 */
export function hasWatermarkPositionPattern(style: ReadonlyMap<string, string>, options?: {
    readonly requireNegativeZIndexWhenPresent?: boolean;
}): boolean {
    const ts330Value: string = style.get('position');
    if ((ts330Value != null ? ts330Value : '').toLowerCase() !== 'absolute') {
        return false;
    }
    const ts331Value: string = style.get('mso-position-horizontal');
    if ((ts331Value != null ? ts331Value : '').toLowerCase() !== 'center') {
        return false;
    }
    const ts332Value: string = style.get('mso-position-vertical');
    if ((ts332Value != null ? ts332Value : '').toLowerCase() !== 'center') {
        return false;
    }
    const ts333Value: string = style.get('mso-position-horizontal-relative');
    if ((ts333Value != null ? ts333Value : '').toLowerCase() !== 'margin') {
        return false;
    }
    const ts334Value: string = style.get('mso-position-vertical-relative');
    if ((ts334Value != null ? ts334Value : '').toLowerCase() !== 'margin') {
        return false;
    }
    if ((options == null ? undefined : options.requireNegativeZIndexWhenPresent) === true) {
        const zRaw: string = style.get('z-index');
        if (zRaw !== undefined) {
            const z: number = Number.parseFloat(zRaw);
            if (!Number.isFinite(z) || z >= 0) {
                return false;
            }
        }
    }
    return true;
}
/**
 * True when `type` is an accepted picture watermark shapetype token.
 * Allows `#_x0000_t75` and `##_x0000_t75` only (not three or more leading `#`).
 *
 * @param {string | undefined} type - The type.
 * @returns {boolean} The result.
 * @private
 */
export function isAcceptedPictureWatermarkType(type: string | undefined): boolean {
    if (type === undefined) {
        return false;
    }
    return type === PICTURE_WATERMARK_TYPE || type === PICTURE_WATERMARK_TYPE_DOUBLE_HASH;
}
/**
 * Conservative text-watermark detector for a `v:shape` element.
 *
 * Requires `v:textpath`, type exactly `#_x0000_t136`, and either a
 * `PowerPlusWaterMarkObject*` id or the watermark positioning pattern.
 * Does **not** require `z-index:-1` (verified text fixtures omit a -1 token
 * or use a large negative Word z-index).
 *
 * Host / `w:pict` checks are the caller's responsibility (header walk).
 *
 * @param {OpenXmlElement} shape - The shape.
 * @returns {boolean} The result.
 * @private
 */
export function isTextWatermarkShape(shape: OpenXmlElement): boolean {
    let ts335: any;
    if (!isVml(shape, 'shape')) {
        return false;
    }
    if (!hasChildLocal(shape, 'textpath')) {
        return false;
    }
    const type: string = vmlAttribute(shape, 'type');
    if (type !== TEXT_WATERMARK_TYPE) {
        return false;
    }
    const id: string = ((ts335 = vmlAttribute(shape, 'id')), ts335 != null ? ts335 : '');
    if (id.startsWith(TEXT_WATERMARK_ID_PREFIX)) {
        return true;
    }
    const style: Map<string, string> = parseVmlStyle(vmlAttribute(shape, 'style'));
    return hasWatermarkPositionPattern(style);
}
/**
 * Conservative picture-watermark detector for a `v:shape` element.
 *
 * Requires `v:imagedata`, type `#_x0000_t75` or `##_x0000_t75`, and either a
 * `WordPictureWatermark*` id or the positioning pattern (negative z-index
 * enforced when z-index is present). Type alone is insufficient (WordArt /
 * ordinary pictures must not match).
 *
 * Host / `w:pict` checks are the caller's responsibility (header walk).
 *
 * @param {OpenXmlElement} shape - The shape.
 * @returns {boolean} The result.
 * @private
 */
export function isPictureWatermarkShape(shape: OpenXmlElement): boolean {
    let ts336: any;
    if (!isVml(shape, 'shape')) {
        return false;
    }
    if (!hasChildLocal(shape, 'imagedata')) {
        return false;
    }
    const type: string = vmlAttribute(shape, 'type');
    if (!isAcceptedPictureWatermarkType(type)) {
        return false;
    }
    const id: string = ((ts336 = vmlAttribute(shape, 'id')), ts336 != null ? ts336 : '');
    if (id.startsWith(PICTURE_WATERMARK_ID_PREFIX)) {
        return true;
    }
    const style: Map<string, string> = parseVmlStyle(vmlAttribute(shape, 'style'));
    return hasWatermarkPositionPattern(style, { requireNegativeZIndexWhenPresent: true });
}
