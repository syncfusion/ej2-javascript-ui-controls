/**
 * Minimal element-tree reader for the pivot parts the loader adopts.
 *
 * It is deliberately small and strict: a DOCTYPE or entity declaration makes
 * the part unreadable (no entity expansion), nesting and node counts are
 * bounded, and text content is ignored (pivot definitions carry data in
 * attributes only). Unreadable input yields `undefined`; it never throws.
 *
 * @private
 */

import { unescapeXml } from '../core/xml/minimal-xml';

/** Deepest element nesting the reader accepts. */
const MAX_DEPTH: number = 64;
/** Most elements the reader accepts in one part. */
const MAX_NODES: number = 500000;

/**
 * One element: local name, attributes by qualified name, child elements.
 *
 * @private
 */
export interface PivotXmlNode {
    /** Local name (namespace prefix removed). */
    readonly name: string;
    /** Qualified name as written (`prefix:local` or `local`). */
    readonly qname: string;
    /** Attribute values keyed by qualified name, entity-decoded (not `_xHHHH_`-decoded), in source order. */
    readonly attrs: Map<string, string>;
    readonly children: PivotXmlNode[];
    /** Index of the `<` that opens the element. */
    readonly start: number;
    /** Index just past the `>` of the start tag. */
    readonly openEnd: number;
    /** Index of the `</` of the end tag; -1 for a self-closing element. */
    closeStart: number;
    /** Index just past the element. */
    end: number;
}

/**
 * Decode ST_Xstring `_xHHHH_` escapes (the inverse of the writer's escaping).
 *
 * @param {string} value - Attribute text.
 * @returns {string} Decoded text.
 * @private
 */
export function decodeXstring(value: string): string {
    return value.replace(/_x([0-9A-Fa-f]{4})_/g, (_m: string, hex: string): string => String.fromCharCode(Number.parseInt(hex, 16)));
}

function localName(qualified: string): string {
    const at: number = qualified.indexOf(':');
    return at < 0 ? qualified : qualified.slice(at + 1);
}

function parseAttributes(text: string): Map<string, string> | undefined {
    const attrs: Map<string, string> = new Map<string, string>();
    const pattern: RegExp = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let consumed: number = 0;
    for (;;) {
        const m: RegExpExecArray | null = pattern.exec(text);
        if (m === null) {
            break;
        }
        if (text.slice(consumed, m.index).trim().length > 0) {
            return undefined;
        }
        consumed = m.index + m[0].length;
        const raw: string = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : '');
        if (raw.indexOf('<') >= 0 || attrs.has(m[1])) {
            return undefined;
        }
        attrs.set(m[1], unescapeXml(raw));
    }
    return text.slice(consumed).trim().length === 0 ? attrs : undefined;
}

/**
 * Find the `>` closing a start tag, skipping quoted attribute values.
 *
 * @param {string} xml - Source text.
 * @param {number} from - Index just after `<`.
 * @returns {number} Index of `>`, or -1 when unterminated.
 */
function tagEnd(xml: string, from: number): number {
    let quote: string = '';
    for (let i: number = from; i < xml.length; i++) {
        const ch: string = xml.charAt(i);
        if (quote.length > 0) {
            if (ch === quote) {
                quote = '';
            }
        } else if (ch === '"' || ch === '\'') {
            quote = ch;
        } else if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * Parse an XML part into an element tree.
 *
 * @param {string} xml - Part text.
 * @returns {PivotXmlNode | undefined} The root element, or `undefined` when unreadable.
 * @private
 */
export function parsePivotXml(xml: string): PivotXmlNode | undefined {
    const stack: PivotXmlNode[] = [];
    let root: PivotXmlNode | undefined;
    let nodes: number = 0;
    let pos: number = 0;
    for (;;) {
        const lt: number = xml.indexOf('<', pos);
        if (lt < 0) {
            break;
        }
        if (xml.startsWith('<?', lt)) {
            const end: number = xml.indexOf('?>', lt + 2);
            if (end < 0) {
                return undefined;
            }
            pos = end + 2;
            continue;
        }
        if (xml.startsWith('<!--', lt)) {
            const end: number = xml.indexOf('-->', lt + 4);
            if (end < 0) {
                return undefined;
            }
            pos = end + 3;
            continue;
        }
        if (xml.startsWith('<![CDATA[', lt)) {
            const end: number = xml.indexOf(']]>', lt + 9);
            if (end < 0) {
                return undefined;
            }
            pos = end + 3;
            continue;
        }
        if (xml.startsWith('<!', lt)) {
            return undefined;
        }
        const gt: number = tagEnd(xml, lt + 1);
        if (gt < 0) {
            return undefined;
        }
        pos = gt + 1;
        if (xml.charAt(lt + 1) === '/') {
            const top: PivotXmlNode | undefined = stack.pop();
            // Compare the qualified name: a prefix must match the start tag.
            if (top === undefined || xml.slice(lt + 2, gt).trim() !== top.qname) {
                return undefined;
            }
            top.closeStart = lt;
            top.end = gt + 1;
            continue;
        }
        let body: string = xml.slice(lt + 1, gt);
        const selfClosing: boolean = body.endsWith('/');
        if (selfClosing) {
            body = body.slice(0, body.length - 1);
        }
        const space: number = body.search(/\s/);
        const qualified: string = space < 0 ? body : body.slice(0, space);
        if (qualified.length === 0) {
            return undefined;
        }
        const attrs: Map<string, string> | undefined = parseAttributes(space < 0 ? '' : body.slice(space));
        if (attrs === undefined) {
            return undefined;
        }
        nodes += 1;
        if (nodes > MAX_NODES) {
            return undefined;
        }
        const node: PivotXmlNode = {
            name: localName(qualified), qname: qualified, attrs, children: [], start: lt, openEnd: gt + 1, closeStart: -1, end: gt + 1,
        };
        if (stack.length > 0) {
            stack[stack.length - 1].children.push(node);
        } else if (root === undefined) {
            root = node;
        } else {
            return undefined;
        }
        if (!selfClosing) {
            if (stack.length >= MAX_DEPTH) {
                return undefined;
            }
            stack.push(node);
        }
    }
    return stack.length === 0 ? root : undefined;
}

/**
 * First child element with a local name.
 *
 * @param {PivotXmlNode} node - Parent.
 * @param {string} name - Local name.
 * @returns {PivotXmlNode | undefined} The child.
 * @private
 */
export function childOf(node: PivotXmlNode, name: string): PivotXmlNode | undefined {
    return node.children.find((c: PivotXmlNode): boolean => c.name === name);
}

/**
 * Encode text as an ST_Xstring attribute value (without entity escaping).
 *
 * @param {string} value - Logical text.
 * @returns {string} Text with `_xHHHH_` escapes.
 * @private
 */
export function encodeXstring(value: string): string {
    let text: string = value.replace(/_(x[0-9A-Fa-f]{4}_)/g, '_x005F_$1');
    // eslint-disable-next-line no-control-regex -- XML 1.0 forbids these characters
    text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, (ch: string): string => {
        const hex: string = ch.charCodeAt(0).toString(16).toUpperCase();
        return `_x${'0000'.slice(hex.length)}${hex}_`;
    });
    return text;
}

/**
 * Serialize an attribute map back to start-tag text, preserving order and
 * escaping every character an XML parser would otherwise normalize.
 *
 * @param {Map<string, string>} attrs - Entity-decoded attributes.
 * @returns {string} ` a="1" b="2"` (leading space per attribute), or an empty string.
 * @private
 */
export function serializeAttrs(attrs: Map<string, string>): string {
    let out: string = '';
    attrs.forEach((value: string, key: string): void => {
        const text: string = value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\t/g, '&#9;')
            .replace(/\n/g, '&#10;')
            .replace(/\r/g, '&#13;');
        out += ` ${key}="${text}"`;
    });
    return out;
}
