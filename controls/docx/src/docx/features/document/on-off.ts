import { OpenXmlElement } from '../../core/xml/index';
import { wValAttribute, wmlAttr, wmlElement } from './wml';
/**
 * CT_OnOff / ECMA-376-1 §17.17.4: absent is not this function's concern.
 * Present without `val` = true. `true`/`1`/`on` = true; `false`/`0`/`off` = false
 * (`ST_OnOff` in shared-commonSimpleTypes.xsd).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function parseOnOff(el: OpenXmlElement): boolean | undefined {
    const val: string = wValAttribute(el);
    if (val === undefined || val.length === 0) {
        return true;
    }
    const normalized: string = val.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return undefined;
}
/**
 *  New true properties omit `val` (§17.17.4 implied true). New false emits `w:val="false"`.
 *
 * @param {string} localName - The local name.
 * @param {boolean} value - The value.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeOnOff(localName: string, value: boolean): OpenXmlElement {
    if (value) {
        return wmlElement(localName);
    }
    return wmlElement(localName, { attributes: [wmlAttr('val', 'false')] });
}
