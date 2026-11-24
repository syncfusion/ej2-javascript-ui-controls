/**
 * Minimal UTF-8 and attribute helpers for the OFFCRYPTO EncryptionInfo XML.
 *
 * @private
 */

/** Attributes of one element found by {@link findElementsWithAttrs}. */
export interface XmlElementAttrs {
    readonly localName: string;
    readonly attrs: ReadonlyMap<string, string>;
}

/**
 * Decodes UTF-8 bytes, stripping a leading BOM.
 *
 * @param {Uint8Array} bytes - Encoded text.
 * @returns {string} Decoded text.
 */
export function decodeUtf8(bytes: Uint8Array): string {
    let start: number = 0;
    if (bytes.byteLength >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        start = 3;
    }
    return new TextDecoder('utf-8').decode(bytes.subarray(start));
}

/**
 * Encodes text as UTF-8 bytes.
 *
 * @param {string} text - Text to encode.
 * @returns {Uint8Array} UTF-8 bytes.
 */
export function encodeUtf8(text: string): Uint8Array {
    return new TextEncoder().encode(text);
}

function unescapeXml(value: string): string {
    return value
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, '\'')
        .replace(/&#x([0-9a-fA-F]+);/g, (_: string, hex: string): string => String.fromCodePoint(Number.parseInt(hex, 16)))
        .replace(/&#([0-9]+);/g, (_: string, dec: string): string => String.fromCodePoint(Number.parseInt(dec, 10)))
        .replace(/&amp;/g, '&');
}

function parseAttrMap(attrText: string): Map<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    const re: RegExp = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    for (;;) {
        const m: RegExpExecArray | null = re.exec(attrText);
        if (m === null) {
            break;
        }
        const name: string = m[1];
        const value: string = unescapeXml(m[2] != null ? m[2] : (m[3] != null ? m[3] : ''));
        map.set(name, value);
        const local: string = name.indexOf(':') >= 0 ? name.slice(name.indexOf(':') + 1) : name;
        if (!map.has(local)) {
            map.set(local, value);
        }
    }
    return map;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds elements by local name (default or prefixed tag) and returns their attributes.
 *
 * @param {string} xml - XML text.
 * @param {string} localName - Element local name.
 * @returns {XmlElementAttrs[]} Matches in document order.
 */
export function findElementsWithAttrs(xml: string, localName: string): XmlElementAttrs[] {
    const results: XmlElementAttrs[] = [];
    const pattern: RegExp = new RegExp('<([A-Za-z_][\\w.-]*:)?' + escapeRegExp(localName) + '(?=[\\s>/])([^>]*)>', 'g');
    for (;;) {
        const match: RegExpExecArray | null = pattern.exec(xml);
        if (match === null) {
            break;
        }
        results.push({ localName, attrs: parseAttrMap(match[2] != null ? match[2] : '') });
    }
    return results;
}
