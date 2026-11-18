/**
 * Parse / serialize SpreadsheetML shared string table (`CT_Sst` / `CT_Rst`).
 *
 * Citations:
 * - ECMA-376-1 §12.3.15 Shared String Table Part; §18.4.8 `si`, §18.4.9 `sst`, §18.4.12 `t`
 * - `CT_Sst`, `CT_Rst` in transitional `sml.xsd`
 * - [MS-OI29500] 2.1.676–678
 *
 * @private
 */

import { InvalidSharedStringsError, PackageLimitError } from '../core/errors';
import { SPREADSHEETML_NS_TRANSITIONAL } from '../core/package/constants';
import { attrsToXmlExcluding, decodeUtf8, encodeUtf8, escapeXml, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';

/** Default security ceiling for SST entry count (`.agent/policies/security.md`). */
export const DEFAULT_MAX_SHARED_STRING_ENTRIES: 5000000 = 5_000_000;

/**
 * One SST entry after parse.
 */
export type SstEntryXml =
    | {
        readonly kind: 'plain';
        readonly text: string;
        /** Full `<si>...</si>` when original had extra attrs / phonetic / etc. */
        readonly xmlPreserve: string | undefined;
    }
    | {
        readonly kind: 'rich';
        readonly plainFallback: string;
        /** Full original `<si>...</si>` element XML for round-trip. */
        readonly xmlPreserve: string;
    };

/**
 * Parsed `sst` model.
 */
export interface SstXmlModel {
    readonly entries: ReadonlyArray<SstEntryXml>;
    /** `sst/@count` when present; otherwise `undefined`. */
    readonly count: number | undefined;
    /** `sst/@uniqueCount` when present; otherwise `undefined`. */
    readonly uniqueCount: number | undefined;
    /** Ordered non-`si` children under `sst` (e.g. `extLst`), full element strings. */
    readonly preserveChildrenXml: ReadonlyArray<string>;
    /** Extra root attribute text excluding count/uniqueCount and xmlns. */
    readonly rootExtraAttrsXml: string;
}

const SML_NS: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main' = SPREADSHEETML_NS_TRANSITIONAL;

/**
 * Parse sharedStrings part bytes.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @param {string} partName - The partName parameter.
 * @param {Object} options - The options parameter.
 * @param {*} [options.maxEntries] - Optional maxEntries field.
 * @returns {SstXmlModel} - Returns the result.
 */
export function parseSstXml(bytes: Uint8Array, partName: string, options?: { readonly maxEntries?: number }): SstXmlModel {
    const maxEntries: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_SHARED_STRING_ENTRIES))(
        options == null ? undefined : options.maxEntries
    );
    const xml: string = decodeUtf8(bytes);
    const trimmed: string = stripPrologAndComments(xml);
    const root: { inner: string; openAttrs: string } = matchRoot(trimmed, partName);
    const attrs: Map<string, string> = parseAttrMap(root.openAttrs);
    const count: number = parseOptionalNonNegInt(attrs.get('count'));
    const uniqueCount: number = parseOptionalNonNegInt(attrs.get('uniqueCount'));
    const rootExtraAttrsXml: string = attrsToXmlExcluding(attrs, new Set(['count', 'uniqueCount', 'xmlns']));

    const children: string[] = splitTopLevelElements(root.inner);
    const entries: SstEntryXml[] = [];
    const preserveChildrenXml: string[] = [];

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 'si') {
            if (entries.length >= maxEntries) {
                throw new PackageLimitError(`Shared string table in "${partName}" exceeds maximum of ${maxEntries} entries`, { partName });
            }
            entries.push(parseSiElement(child));
            continue;
        }
        preserveChildrenXml.push(child);
    }

    return {
        entries,
        count,
        uniqueCount,
        preserveChildrenXml,
        rootExtraAttrsXml
    };
}

/**
 * Serialize SST model to Transitional SpreadsheetML bytes.
 *
 * @param {*} model - model value.
 * @param {*} [options] - options value.
 * @returns {Uint8Array} Function result.
 */
export function serializeSstXml(
    model: {
        readonly entries: ReadonlyArray<SstEntryXml>;
        readonly count: number;
        readonly uniqueCount: number;
        readonly preserveChildrenXml?: ReadonlyArray<string>;
        readonly rootExtraAttrsXml?: string;
    },
    options?: { readonly maxEntries?: number }
): Uint8Array {
    const maxEntries: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_SHARED_STRING_ENTRIES))(
        options == null ? undefined : options.maxEntries
    );
    if (model.entries.length > maxEntries) {
        throw new PackageLimitError(`Shared string table exceeds maximum of ${maxEntries} entries`);
    }

    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    const extra: string =
        model.rootExtraAttrsXml !== undefined && model.rootExtraAttrsXml.trim().length > 0 ? ` ${model.rootExtraAttrsXml.trim()}` : '';
    lines.push(`<sst xmlns="${SML_NS}" count="${model.count}" uniqueCount="${model.uniqueCount}"${extra}>`);

    for (const entry of model.entries) {
        lines.push(serializeSi(entry));
    }

    for (const child of model.preserveChildrenXml != null ? model.preserveChildrenXml : []) {
        lines.push(child);
    }

    lines.push('</sst>');
    return encodeUtf8(lines.join(''));
}

/**
 * serializeSi function.
 *
 * @param {SstEntryXml} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
function serializeSi(entry: SstEntryXml): string {
    if (entry.kind === 'rich') {
        return entry.xmlPreserve;
    }
    if (entry.xmlPreserve !== undefined) {
        return entry.xmlPreserve;
    }
    return `<si>${serializeT(entry.text)}</si>`;
}

/**
 * serializeT function.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function serializeT(text: string): string {
    const space: '' | ' xml:space="preserve"' =
        text.length > 0 && (/^\s|\s$/.test(text) || text.includes('\n') || text.includes('\t')) ? ' xml:space="preserve"' : '';
    return `<t${space}>${escapeXml(text)}</t>`;
}

/**
 * parseSiElement function.
 *
 * @param {string} siXml - The siXml parameter.
 * @returns {SstEntryXml} - Returns the result.
 */
function parseSiElement(siXml: string): SstEntryXml {
    const inner: string = elementInner(siXml);
    const children: string[] = splitTopLevelElements(inner);
    const tNodes: string[] = [];
    let hasRun: boolean = false;
    let hasOther: boolean = false;

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 't') {
            tNodes.push(parseTElement(child));
            continue;
        }
        if (local === 'r') {
            hasRun = true;
            tNodes.push(...collectTTexts(child));
            continue;
        }
        // rPh, phoneticPr, extLst, unknown
        hasOther = true;
    }

    const plain: string = tNodes.join('');

    if (!hasRun && !hasOther && tNodes.length <= 1) {
        // Pure plain single-t (or empty si).
        const text: string = tNodes[0] != null ? tNodes[0] : '';
        // Preserve full si only when it carries extra structure we did not model
        // (multiple t without r is unusual — treat as preserve).
        if (tNodes.length > 1) {
            return { kind: 'plain', text: plain, xmlPreserve: siXml.trim() };
        }
        return { kind: 'plain', text, xmlPreserve: undefined };
    }

    if (hasRun || hasOther || tNodes.length > 1) {
        return {
            kind: 'rich',
            plainFallback: plain,
            xmlPreserve: siXml.trim()
        };
    }

    return { kind: 'plain', text: plain, xmlPreserve: undefined };
}

/**
 * collectTTexts function.
 *
 * @param {string} el - The el parameter.
 * @returns {string[]} - Returns the result.
 */
function collectTTexts(el: string): string[] {
    const out: string[] = [];
    const inner: string = elementInner(el);
    for (const child of splitTopLevelElements(inner)) {
        const local: string = elementLocalName(child);
        if (local === 't') {
            out.push(parseTElement(child));
        } else if (local === 'r' || local === 'rPh') {
            out.push(...collectTTexts(child));
        }
    }
    return out;
}

/**
 * parseTElement function.
 *
 * @param {string} tXml - The tXml parameter.
 * @returns {string} - Returns the result.
 */
function parseTElement(tXml: string): string {
    return unescapeXml(elementInner(tXml));
}

/**
 * parseOptionalNonNegInt function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalNonNegInt(raw: string | undefined): number | undefined {
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return n;
}

/**
 * matchRoot function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} partName - The partName parameter.
 * @returns {Object} - Returns the result.
 */
function matchRoot(xml: string, partName: string): { inner: string; openAttrs: string } {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?sst\b([^>]*)>/i.exec(xml);
    if (m == null) {
        throw new InvalidSharedStringsError(`Shared strings part "${partName}" is missing root element sst`, { partName });
    }

    const openAttrs: string = (m[2] != null ? m[2] : '').replace(/\/\s*$/, '');
    const openEnd: number = findTagEnd(xml, 0);
    if (openEnd < 0) {
        throw new InvalidSharedStringsError(`Shared strings part "${partName}" has malformed sst open tag`, { partName });
    }
    const openTag: string = xml.slice(0, openEnd + 1);
    if (/\/\s*>$/.test(openTag)) {
        return { inner: '', openAttrs };
    }
    const close: number = findClosing(xml, 'sst', openEnd + 1);
    if (close < 0) {
        throw new InvalidSharedStringsError(`Shared strings part "${partName}" has unclosed sst element`, { partName });
    }
    const closeStart: number = xml.lastIndexOf('</', close);
    const inner: string = xml.slice(openEnd + 1, closeStart);
    return { inner, openAttrs };
}

/**
 * stripPrologAndComments function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripPrologAndComments(xml: string): string {
    return xml
        .replace(/^\uFEFF/, '')
        .replace(/<\?xml[\s\S]*?\?>/i, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^\s+/, '');
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(s: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        if (s.startsWith('</', lt)) {
            break;
        }
        if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
            const endPi: number = s.indexOf('>', lt);
            i = endPi < 0 ? s.length : endPi + 1;
            continue;
        }
        const openEnd: number = findTagEnd(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalName(openTag);
        const close: number = findClosing(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string): string => x.trim()).filter((x: string): boolean => x.length > 0);
}

/**
 * findTagEnd function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findTagEnd(s: string, from: number): number {
    let inQuote: '"' | '\'' | null = null;
    for (let i: number = from; i < s.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = s[i];
        if (inQuote !== null) {
            if (ch === inQuote) {
                inQuote = null;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            inQuote = ch;
            continue;
        }
        if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * findClosing function.
 *
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosing(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}\\s*>`, 'g');
    let depth: number = 1;
    let i: number = from;
    while (i < s.length && depth > 0) {
        openPat.lastIndex = i;
        closePat.lastIndex = i;
        const om: RegExpExecArray = openPat.exec(s);
        const cm: RegExpExecArray = closePat.exec(s);
        if (cm === null) {
            return -1;
        }
        if (om !== null && om.index < cm.index) {
            const tagEnd: number = findTagEnd(s, om.index);
            if (tagEnd >= 0) {
                const tag: string = s.slice(om.index, tagEnd + 1);
                if (!/\/\s*>$/.test(tag)) {
                    depth += 1;
                }
                i = tagEnd + 1;
                continue;
            }
        }
        depth -= 1;
        if (depth === 0) {
            return cm.index + cm[0].length;
        }
        i = cm.index + cm[0].length;
    }
    return -1;
}

/**
 * elementLocalName function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalName(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementInner function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInner(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEnd(trimmed, 0);
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
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
