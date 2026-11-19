/**
 * Minimal XML helpers for OPC content types and relationships.
 *
 * Intentionally small: attribute-oriented element extraction without a full DOM.
 * Not a general-purpose OOXML parser — higher layers will own SpreadsheetML.
 *
 * @private
 */

import { InvalidPackageError } from '../errors';

/**
 * Decode UTF-8 (with BOM strip) package part text.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @returns {string} - Returns the result.
 */
export function decodeUtf8(bytes: Uint8Array): string {
    let start: number = 0;
    if (bytes.byteLength >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        start = 3;
    }
    return new TextDecoder('utf-8').decode(bytes.subarray(start));
}

/**
 * Encode text as UTF-8 bytes.
 *
 * @param {string} text - The text parameter.
 * @returns {Uint8Array} - Returns the result.
 */
export function encodeUtf8(text: string): Uint8Array {
    return new TextEncoder().encode(text);
}

/**
 * Escape attribute values for XML 1.0 (double-quoted attributes).
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
export function escapeXml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Escape character data (element text). Does not escape quotes — Excel formula text (`f`) and similar keep literal `"` as in the original package.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
export function escapeXmlText(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Unescape common XML attribute / text entities.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
export function unescapeXml(value: string): string {
    return value
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, '\'')
        .replace(/&#x([0-9a-fA-F]+);/g, (_: string, hex: string): string => String.fromCodePoint(Number.parseInt(hex, 16)))
        .replace(/&#([0-9]+);/g, (_: string, dec: string): string => String.fromCodePoint(Number.parseInt(dec, 10)))
        .replace(/&amp;/g, '&');
}

/**
 * Parse attribute text into a map. Prefixed names are stored under the full name and also under the local name when that slot is free so callers can look up either form. Local aliases must not be re-emitted on serialize (see {@link attrsToXmlExcluding}).
 *
 * @param {string} attrText - The attrText parameter.
 * @returns {string} - Returns the result.
 */
export function parseAttrMap(attrText: string): Map<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    const re: RegExp = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    for (;;) {
        const m: RegExpExecArray = re.exec(attrText);
        if (m === null) {
            break;
        }
        const name: string = m[1];
        if (name === undefined) {
            continue;
        }
        const raw: string = ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[3]);
        const value: string = unescapeXml(raw);
        map.set(name, value);
        const local: string = name.includes(':') ? name.slice(name.indexOf(':') + 1) : name;
        if (!map.has(local)) {
            map.set(local, value);
        }
    }
    return map;
}

/**
 * Serialize attributes, skipping exclude keys and parseAttrMap local aliases. - Keeps `xmlns:*` declarations (only the exact exclude set drops them). - Drops unprefixed aliases synthesized for `prefix:local` / `xmlns:prefix`. - Exclusion matches exact key, or local name for non-namespace attrs (so `exclude {'id'}` drops both `id` and `r:id`).
 *
 * @param {string} attrs - The attrs parameter.
 * @param {string} exclude - The exclude parameter.
 * @returns {string} - Returns the result.
 */
export function attrsToXmlExcluding(attrs: Map<string, string>, exclude: Set<string>): string {
    const parts: string[] = [];
    const keys: string[] = [...attrs.keys()];

    for (const k of keys) {
        if (isParseAttrAlias(k, attrs)) {
            continue;
        }
        if (exclude.has(k)) {
            continue;
        }
        const isNsDecl: boolean = k === 'xmlns' || k.startsWith('xmlns:');
        if (!isNsDecl) {
            const local: string = k.includes(':') ? k.slice(k.indexOf(':') + 1) : k;
            if (exclude.has(local)) {
                continue;
            }
        }
        const v: string = attrs.get(k);
        if (v === undefined) {
            continue;
        }
        parts.push(`${k}="${escapeXml(v)}"`);
    }
    return parts.join(' ');
}

/**
 * True when `k` is an unprefixed lookup alias created by {@link parseAttrMap} for a prefixed attribute with the same value.
 *
 * @param {string} k - The k parameter.
 * @param {string} attrs - The attrs parameter.
 * @returns {boolean} - Returns the result.
 */
function isParseAttrAlias(k: string, attrs: Map<string, string>): boolean {
    if (k.includes(':')) {
        return false;
    }
    const value: string = attrs.get(k);
    if (value === undefined) {
        return false;
    }
    for (const other of attrs.keys()) {
        if (other === k) {
            continue;
        }
        if (other.endsWith(`:${k}`) && attrs.get(other) === value) {
            return true;
        }
    }
    return false;
}

/**
 * One empty-or-simple XML element with attributes (body ignored for OPC CT/rels).
 */
export interface XmlElementAttrs {
    readonly localName: string;
    readonly attrs: ReadonlyMap<string, string>;
}

/**
 * Extract elements by local name with their attributes. Handles default and prefixed tags; ignores comments and processing instructions.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} localName - The localName parameter.
 * @returns {XmlElementAttrs[]} - Returns the result.
 */
export function findElementsWithAttrs(xml: string, localName: string): XmlElementAttrs[] {
    const results: XmlElementAttrs[] = [];
    // Match <prefix:localName ...> or <localName ...> including self-closing.
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const pattern: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])([^>]*)>`, 'g');
    for (;;) {
        const match: RegExpExecArray = pattern.exec(xml);
        if (match === null) {
            break;
        }
        const attrText: string = match[2] != null ? match[2] : '';
        results.push({
            localName,
            attrs: parseAttributes(attrText)
        });
    }
    return results;
}

/**
 * Require a root local name to appear (namespace prefix optional).
 *
 * @param {string} xml - The xml parameter.
 * @param {string} localName - The localName parameter.
 * @param {string} partName - The partName parameter.
 * @returns {void} - Returns the result.
 */
export function assertRootLocalName(xml: string, localName: string, partName: string): void {
    const trimmed: string = stripProlog(xml);
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const rootMatch: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(trimmed);
    if (rootMatch === null || rootMatch[2] !== localName) {
        throw new InvalidPackageError(`Expected root element "${localName}" in part "${partName}"`, { partName });
    }
}

/**
 * stripProlog function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripProlog(xml: string): string {
    return xml
        .replace(/^\uFEFF/, '')
        .replace(/<\?xml[\s\S]*?\?>/i, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^\s+/, '');
}

/**
 * parseAttributes function.
 *
 * @param {string} attrText - The attrText parameter.
 * @returns {string} - Returns the result.
 */
function parseAttributes(attrText: string): Map<string, string> {
    return parseAttrMap(attrText);
}

/**
 * escapeRegExp function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
