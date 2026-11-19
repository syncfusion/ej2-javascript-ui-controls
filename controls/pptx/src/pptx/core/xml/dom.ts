/**
 * Namespace-aware OOXML XML parse/serialize with Markup Compatibility preservation.
 *
 * @remarks
 * Identity is URI + localName (never prefix-as-identity). Unsupported elements and
 * `mc:AlternateContent` trees are retained intact. DOCTYPE / DTD / external entities
 * are refused. Depth, attribute count, and text-node length are enforced during parse
 * via {@link SecurityLimits}.
 *
 * `mc:MustUnderstand` is evaluated during parse while namespace bindings are live
 * (ECMA-376 Part 3 §7.4). Unknown or unbound MustUnderstand namespaces fail closed
 * with {@link MarkupCompatibilityError}. Original `xmlns` declarations are retained
 * on elements so MC prefix-token attribute values round-trip.
 */
import { XmlLimitError } from '../security/errors';
import { resolveLimits, SecurityLimits } from '../security/limits';
import { MC_NS, MC_UNDERSTOOD_NAMESPACE_URIS, MarkupCompatibilityError, splitMcPrefixTokens } from './markup-compatibility';
import { stringIncludes, arrayAt } from '../util/es5-compat';
export { MC_NS, MC_UNDERSTOOD_NAMESPACE_URIS, MarkupCompatibilityError, splitMcPrefixTokens,
    MarkupCompatibilityErrorCode } from './markup-compatibility';
/** XML attribute identified by namespace URI and local name. */
export interface OoxmlAttribute {
    readonly namespaceUri: string;
    readonly localName: string;
    readonly value: string;
    /** Original prefix when known (empty string for default / unprefixed). */
    readonly prefix?: string;
}
/**
 * Namespace declaration authored on an element (`xmlns` / `xmlns:prefix`).
 *
 * @remarks
 * Retained so Markup Compatibility prefix-token attributes (Ignorable,
 * MustUnderstand, ProcessContent, PreserveElements, PreserveAttributes) keep
 * stable prefix strings across serialize/reparse.
 */
export interface OoxmlNamespaceDeclaration {
    /** Empty string for default `xmlns="..."`; otherwise the bound prefix. */
    readonly prefix: string;
    readonly uri: string;
}
/** Character data child node. */
export interface OoxmlText {
    readonly kind: 'text';
    readonly text: string;
}
/** Element node. Child order is significant and preserved. */
export interface OoxmlElement {
    readonly kind: 'element';
    readonly namespaceUri: string;
    readonly localName: string;
    readonly attributes: ReadonlyArray<OoxmlAttribute>;
    readonly children: ReadonlyArray<OoxmlElement | OoxmlText>;
    /**
     * Preferred prefix for serialization when known.
     * Empty string means unprefixed / default namespace.
     */
    readonly prefixHint?: string;
    /**
     * Original namespace declarations on this element, in document order.
     * When present, serialize emits these before synthesizing additional binds.
     */
    readonly namespaceDeclarations?: ReadonlyArray<OoxmlNamespaceDeclaration>;
}
/** Options for {@link parseXml}. */
export interface ParseXmlOptions {
    /** Effective or partial security limits; defaults come from {@link resolveLimits}. */
    readonly limits?: Partial<SecurityLimits>;
    /** Package part name for diagnostics when known. */
    readonly partName?: string;
}
/**
 * Raised when XML is malformed or uses forbidden constructs (DOCTYPE, DTD, entities).
 */
export class XmlParseError extends Error {
    /** Offending part name when applicable. */
    readonly partName: string | undefined;
    /**
     * @param {string} message - Human-readable description.
     * @param {object} options - Optional part name.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(message: string, options: {
        readonly partName?: string;
    } = {}) {
        super(message);
        this.name = 'XmlParseError';
        this.partName = options.partName;
    }
}
const XMLNS_NS: string = 'http://www.w3.org/2000/xmlns/';
const XML_NS: string = 'http://www.w3.org/XML/1998/namespace';
interface NsBinding {
    readonly prefix: string;
    readonly uri: string;
}
/**
 * Resolves an in-scope prefix to a namespace URI for MustUnderstand (Part 3 §7.4).
 * Empty result means unbound (including default-namespace lookup when prefix is empty —
 * MustUnderstand tokens are prefixes and shall not be empty per Part 3 token list of
 * namespace prefixes; empty tokens are ignored by {@link splitMcPrefixTokens}).
 *
 * @param {string} prefix - The prefix value.
 * @param {*} stack - The stack value.
 * @returns {string | undefined} The result.
 */
function resolveInScopePrefix(prefix: string, stack: ReadonlyArray<NsBinding>[]): string | undefined {
    if (prefix === 'xmlns') {
        return XMLNS_NS;
    }
    if (prefix === 'xml') {
        return XML_NS;
    }
    for (let i: number = stack.length - 1; i >= 0; i -= 1) {
        const frame: ReadonlyArray<NsBinding> = arrayAt(stack, i);
        if (frame === undefined) {
            continue;
        }
        for (let j: number = frame.length - 1; j >= 0; j -= 1) {
            const b: NsBinding = arrayAt(frame, j);
            if (b !== undefined && b.prefix === prefix) {
                return b.uri;
            }
        }
    }
    return undefined;
}
/**
 * Evaluates `mc:MustUnderstand` on an element while `nsStack` is still live.
 *
 * @remarks Part 3 §7.4: value is whitespace-delimited namespace prefixes; each must bind to an in-scope namespace that is not the MC
 * namespace. Library policy (spec 027): the bound URI must be in {@link MC_UNDERSTOOD_NAMESPACE_URIS} or parse fails closed.
 * @param {*} attributes - The attributes value.
 * @param {*} nsStack - The nsStack value.
 * @param {string | undefined} partName - The partName value.
 * @returns {void} Nothing.
 */
function enforceMustUnderstand(attributes: ReadonlyArray<OoxmlAttribute>, nsStack: ReadonlyArray<NsBinding>[],
                               partName: string | undefined): void {
    for (let i: number = 0; i < attributes.length; i++) {
        const attr: OoxmlAttribute = arrayAt(attributes, i);
        if (attr.namespaceUri !== MC_NS || attr.localName !== 'MustUnderstand') {
            continue;
        }
        const tokens: Array<string> = splitMcPrefixTokens(attr.value);
        for (let j: number = 0; j < tokens.length; j++) {
            const token: string = arrayAt(tokens, j);
            // Part 3 tokens are namespace prefixes (not QNames). Reject `prefix:local`.
            if (stringIncludes(token, ':')) {
                throw new MarkupCompatibilityError(`mc:MustUnderstand token "${token}" is not a bare namespace prefix`, {
                    code: 'invalidMustUnderstand',
                    ...partNameOptions(partName),
                    prefix: token
                });
            }
            const uri: string = resolveInScopePrefix(token, nsStack);
            if (uri === undefined) {
                throw new MarkupCompatibilityError(`mc:MustUnderstand prefix "${token}" is not bound in scope`, {
                    code: 'unboundPrefix',
                    ...partNameOptions(partName),
                    prefix: token
                });
            }
            if (uri === MC_NS) {
                throw new MarkupCompatibilityError('mc:MustUnderstand must not target the Markup Compatibility namespace', {
                    code: 'invalidMustUnderstand',
                    ...partNameOptions(partName),
                    namespaceUri: uri,
                    prefix: token
                });
            }
            if (!MC_UNDERSTOOD_NAMESPACE_URIS.has(uri)) {
                throw new MarkupCompatibilityError(`mc:MustUnderstand namespace is not implemented by this library: ${uri}`, {
                    code: 'mustUnderstand',
                    ...partNameOptions(partName),
                    namespaceUri: uri,
                    prefix: token
                });
            }

        }

    }
}
interface ParserState {
    readonly source: string;
    index: number;
    readonly limits: SecurityLimits;
    readonly partName: string | undefined;
    depth: number;
}
/**
 *
 * @param {string} text - The text value.
 * @returns {number} The result.
 */
function textByteLength(text: string): number {
    // UTF-8 byte length without Node `Buffer` (gulp scripts-gen only compiles src/**/*.ts).
    let bytes: number = 0;
    for (let i: number = 0; i < text.length; i++) {
        const code: number = text.charCodeAt(i);
        if (code < 0x80) {
            bytes += 1;
        }
        else if (code < 0x800) {
            bytes += 2;
        }
        else if (code >= 0xd800 && code <= 0xdbff) {
            // Surrogate pair → one code point → 4 UTF-8 bytes
            bytes += 4;
            i += 1;
        }
        else {
            bytes += 3;
        }
    }
    return bytes;
}
/**
 *
 * @param {string} ch - The ch value.
 * @returns {boolean} The result.
 */
function isNameStart(ch: string): boolean {
    const c: number = ch.charCodeAt(0);
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95 || c === 58 || c > 127;
}
/**
 *
 * @param {string} ch - The ch value.
 * @returns {boolean} The result.
 */
function isNameChar(ch: string): boolean {
    const c: number = ch.charCodeAt(0);
    return isNameStart(ch) || (c >= 48 && c <= 57) || c === 45 || c === 46;
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {string} The result.
 */
function peek(state: ParserState): string {
    return (state.source[state.index] !== null && state.source[state.index] !== undefined ? state.source[state.index] : '');
}
/**
 *
 * @param {ParserState} state - The state value.
 * @param {number} n - The n value.
 * @returns {void} Nothing.
 */
function advance(state: ParserState, n: number = 1): void {
    state.index += n;
}
/**
 *
 * @param {ParserState} state - The state value.
 * @param {string} s - The s value.
 * @returns {boolean} The result.
 */
function startsWith(state: ParserState, s: string): boolean {
    return state.source.startsWith(s, state.index);
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {void} Nothing.
 */
function skipWs(state: ParserState): void {
    while (state.index < state.source.length) {
        const ch: string = peek(state);
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            advance(state);
        }
        else {
            break;
        }
    }
}
/**
 *
 * @param {string | undefined} partName - The partName value.
 * @returns {object} The result.
 */
function partNameOptions(partName: string | undefined): {
    readonly partName?: string;
} {
    return partName === undefined ? {} : { partName };
}
/**
 *
 * @param {ParserState} state - The state value.
 * @param {string} message - The message value.
 * @returns {void} Never returns; always throws.
 */
function failParse(state: ParserState, message: string): never {
    throw new XmlParseError(message, partNameOptions(state.partName));
}
/**
 *
 * @param {ParserState} state - The state value.
 * @param {*} limit - The limit value.
 * @param {number} actual - The actual value.
 * @returns {void} Never returns; always throws.
 */
function failLimit(state: ParserState, limit: keyof SecurityLimits, actual: number): never {
    throw new XmlLimitError(limit, {
        ...partNameOptions(state.partName),
        actual
    });
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {string} The result.
 */
function readName(state: ParserState): string {
    if (!isNameStart(peek(state))) {
        failParse(state, `Expected name at index ${String(state.index)}`);
    }
    const start: number = state.index;
    advance(state);
    while (state.index < state.source.length && isNameChar(peek(state))) {
        advance(state);
    }
    return state.source.slice(start, state.index);
}
/**
 *
 * @param {string} qname - The qname value.
 * @returns {object} The result.
 */
function splitQName(qname: string): {
    prefix: string;
    localName: string;
} {
    const i: number = qname.indexOf(':');
    if (i <= 0) {
        return { prefix: '', localName: qname };
    }
    return { prefix: qname.slice(0, i), localName: qname.slice(i + 1) };
}
/**
 *
 * @param {string} raw - The raw value.
 * @param {ParserState} state - The state value.
 * @returns {string} The result.
 */
function decodeEntities(raw: string, state: ParserState): string {
    let out: string = '';
    let i: number = 0;
    while (i < raw.length) {
        const amp: number = raw.indexOf('&', i);
        if (amp === -1) {
            out += raw.slice(i);
            break;
        }
        out += raw.slice(i, amp);
        const semi: number = raw.indexOf(';', amp + 1);
        if (semi === -1) {
            failParse(state, 'Unterminated character entity');
        }
        const body: string = raw.slice(amp + 1, semi);
        if (body === 'lt') {
            out += '<';
        }
        else if (body === 'gt') {
            out += '>';
        }
        else if (body === 'amp') {
            out += '&';
        }
        else if (body === 'apos') {
            out += '\'';
        }
        else if (body === 'quot') {
            out += '"';
        }
        else if (body.startsWith('#x') || body.startsWith('#X')) {
            const cp: number = Number.parseInt(body.slice(2), 16);
            if (!Number.isFinite(cp) || cp < 0) {
                failParse(state, `Invalid numeric character reference &${body};`);
            }
            out += String.fromCodePoint(cp);
        }
        else if (body.startsWith('#')) {
            const cp: number = Number.parseInt(body.slice(1), 10);
            if (!Number.isFinite(cp) || cp < 0) {
                failParse(state, `Invalid numeric character reference &${body};`);
            }
            out += String.fromCodePoint(cp);
        }
        else {
            failParse(state, `General entity references are not allowed: &${body};`);
        }
        i = semi + 1;
    }
    return out;
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {string} The result.
 */
function readQuoted(state: ParserState): string {
    const q: string = peek(state);
    if (q !== '"' && q !== '\'') {
        failParse(state, 'Expected quoted attribute value');
    }
    advance(state);
    const start: number = state.index;
    while (state.index < state.source.length && peek(state) !== q) {
        if (peek(state) === '<') {
            failParse(state, 'Raw < in attribute value');
        }
        advance(state);
    }
    if (peek(state) !== q) {
        failParse(state, 'Unterminated attribute value');
    }
    const raw: string = state.source.slice(start, state.index);
    advance(state);
    return decodeEntities(raw, state);
}
/**
 *
 * @param {string} prefix - The prefix value.
 * @param {*} stack - The stack value.
 * @param {boolean} isAttribute - The isAttribute value.
 * @returns {string} The result.
 */
function resolvePrefix(prefix: string, stack: ReadonlyArray<NsBinding>[], isAttribute: boolean): string {
    if (prefix === 'xmlns') {
        return XMLNS_NS;
    }
    if (prefix === 'xml') {
        return XML_NS;
    }
    // XML Namespaces 1.0 §6.2: default namespace does not apply to attributes.
    // Unprefixed attributes are always in no namespace.
    if (prefix === '' && isAttribute) {
        return '';
    }
    for (let i: number = stack.length - 1; i >= 0; i -= 1) {
        const frame: ReadonlyArray<NsBinding> = arrayAt(stack, i);
        if (frame === undefined) {
            continue;
        }
        for (let j: number = frame.length - 1; j >= 0; j -= 1) {
            const b: NsBinding = arrayAt(frame, j);
            if (b === undefined) {
                continue;
            }
            if (b.prefix === prefix) {
                return b.uri;
            }
        }
    }
    // Unprefixed element with no default xmlns, or unknown prefix → no namespace.
    return '';
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {void} Nothing.
 */
function skipProcessingInstruction(state: ParserState): void {
    // starts at '<?'
    advance(state, 2);
    const end: number = state.source.indexOf('?>', state.index);
    if (end === -1) {
        failParse(state, 'Unterminated processing instruction');
    }
    state.index = end + 2;
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {void} Nothing.
 */
function skipComment(state: ParserState): void {
    // starts at '<!--'
    advance(state, 4);
    const end: number = state.source.indexOf('-->', state.index);
    if (end === -1) {
        failParse(state, 'Unterminated comment');
    }
    if (stringIncludes(state.source.slice(state.index, end), '--')) {
        failParse(state, 'Invalid comment content');
    }
    state.index = end + 3;
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {string} The result.
 */
function skipCData(state: ParserState): string {
    // starts at '<![CDATA['
    advance(state, 9);
    const end: number = state.source.indexOf(']]>', state.index);
    if (end === -1) {
        failParse(state, 'Unterminated CDATA section');
    }
    const text: string = state.source.slice(state.index, end);
    state.index = end + 3;
    return text;
}
/**
 *
 * @param {ParserState} state - The state value.
 * @returns {void} Never returns; always throws.
 */
function rejectDoctype(state: ParserState): never {
    return failParse(state, 'DOCTYPE / DTD declarations are not allowed (external entities disabled)');
}
/**
 * Parses one element starting at the current '<'.
 *
 * @param {ParserState} state - The state value.
 * @param {Array} nsStack - Namespace binding stack (array of binding arrays).
 * @returns {OoxmlElement} The result.
 */
function parseElement(state: ParserState, nsStack: NsBinding[][]): OoxmlElement {
    // current char is '<'
    advance(state);
    if (peek(state) === '/') {
        failParse(state, 'Unexpected end tag');
    }
    const qname: string = readName(state);
    const { prefix: elPrefix, localName: elLocal } = splitQName(qname);
    interface RawAttr {
        readonly qname: string;
        readonly value: string;
        readonly prefix: string;
        readonly localName: string;
    }
    const rawAttrs: RawAttr[] = [];
    skipWs(state);
    while (state.index < state.source.length && peek(state) !== '/' && peek(state) !== '>') {
        const attrName: string = readName(state);
        skipWs(state);
        if (peek(state) !== '=') {
            failParse(state, `Expected = after attribute ${attrName}`);
        }
        advance(state);
        skipWs(state);
        const value: string = readQuoted(state);
        const parts: { prefix: string; localName: string; } = splitQName(attrName);
        rawAttrs.push({ qname: attrName, value, prefix: parts.prefix, localName: parts.localName });
        skipWs(state);
    }
    if (rawAttrs.length > state.limits.xmlAttributesPerElement) {
        failLimit(state, 'xmlAttributesPerElement', rawAttrs.length);
    }
    const frame: NsBinding[] = [];
    const namespaceDeclarations: OoxmlNamespaceDeclaration[] = [];
    for (let i: number = 0; i < rawAttrs.length; i++) {
        const ra: RawAttr = arrayAt(rawAttrs, i);
        const { prefix, localName } = ra;
        if (ra.qname === 'xmlns') {
            frame.push({ prefix: '', uri: ra.value });
            namespaceDeclarations.push({ prefix: '', uri: ra.value });
        }
        else if (prefix === 'xmlns') {
            frame.push({ prefix: localName, uri: ra.value });
            namespaceDeclarations.push({ prefix: localName, uri: ra.value });
        }

    }
    // Empty declaration frames do not change scope; avoid walking them for every QName.
    if (frame.length > 0) { nsStack.push(frame); }
    const elNs: string = resolvePrefix(elPrefix, nsStack, false);
    const attributes: OoxmlAttribute[] = [];
    for (let i: number = 0; i < rawAttrs.length; i++) {
        const ra: RawAttr = arrayAt(rawAttrs, i);
        const { prefix, localName } = ra;
        if (ra.qname === 'xmlns' || prefix === 'xmlns') {
            // Namespace declarations are retained on the element and re-emitted on serialize
            // so MC prefix-token attributes keep stable prefixes (spec 027).
            continue;
        }
        const nsUri: string = resolvePrefix(prefix, nsStack, true);
        if (prefix === '') {
            attributes.push({ namespaceUri: nsUri, localName, value: ra.value });
        }
        else {
            attributes.push({
                namespaceUri: nsUri,
                localName,
                value: ra.value,
                prefix
            });
        }

    }
    // Part 3 §7.4 / §9.4: MustUnderstand uses in-scope prefix bindings — evaluate
    // before children and before popping this element's frame.
    enforceMustUnderstand(attributes, nsStack, state.partName);
    state.depth += 1;
    if (state.depth > state.limits.xmlNestingDepth) {
        failLimit(state, 'xmlNestingDepth', state.depth);
    }
    let selfClosing: boolean = false;
    if (peek(state) === '/') {
        advance(state);
        selfClosing = true;
    }
    if (peek(state) !== '>') {
        failParse(state, 'Expected > to close start tag');
    }
    advance(state);
    const children: (OoxmlElement | OoxmlText)[] = [];
    if (!selfClosing) {
        while (state.index < state.source.length) {
            if (startsWith(state, '</')) {
                advance(state, 2);
                const endName: string = readName(state);
                skipWs(state);
                if (peek(state) !== '>') {
                    failParse(state, 'Expected > on end tag');
                }
                advance(state);
                if (endName !== qname) {
                    failParse(state, `Mismatched end tag </${endName}> for <${qname}>`);
                }
                break;
            }
            if (startsWith(state, '<!--')) {
                skipComment(state);
                continue;
            }
            if (startsWith(state, '<?')) {
                skipProcessingInstruction(state);
                continue;
            }
            if (startsWith(state, '<![CDATA[')) {
                const cdata: string = skipCData(state);
                if (textByteLength(cdata) > state.limits.textNodeLengthBytes) {
                    failLimit(state, 'textNodeLengthBytes', textByteLength(cdata));
                }
                if (cdata.length > 0) {
                    children.push({ kind: 'text' as 'text', text: cdata });
                }
                continue;
            }
            if (startsWith(state, '<!DOCTYPE') || startsWith(state, '<!doctype')) {
                rejectDoctype(state);
            }
            if (peek(state) === '<') {
                children.push(parseElement(state, nsStack));
                continue;
            }
            // text
            const textStart: number = state.index;
            while (state.index < state.source.length && peek(state) !== '<') {
                advance(state);
            }
            const rawText: string = state.source.slice(textStart, state.index);
            const text: string = decodeEntities(rawText, state);
            if (textByteLength(text) > state.limits.textNodeLengthBytes) {
                failLimit(state, 'textNodeLengthBytes', textByteLength(text));
            }
            if (text.length > 0) {
                children.push({ kind: 'text', text });
            }
        }
    }
    state.depth -= 1;
    if (frame.length > 0) { nsStack.pop(); }
    const base: {
        kind: 'element';
        namespaceUri: string;
        localName: string;
        attributes: OoxmlAttribute[];
        children: (OoxmlElement | OoxmlText)[];
        prefixHint?: string;
        namespaceDeclarations?: OoxmlNamespaceDeclaration[];
    } = {
        kind: 'element' as 'element',
        namespaceUri: elNs,
        localName: elLocal,
        attributes,
        children
    };
    if (elPrefix !== '') {
        base.prefixHint = elPrefix;
    }
    if (namespaceDeclarations.length > 0) {
        base.namespaceDeclarations = namespaceDeclarations;
    }
    return base;
}
/**
 * Parses XML into an {@link OoxmlElement} tree.
 *
 * @throws {Error} On malformed XML, DOCTYPE, or disallowed entities.
 * @throws {Error} When depth, attribute, or text limits are exceeded.
 * @throws {MarkupCompatibilityError} When `mc:MustUnderstand` names an unbound, MC, or unimplemented namespace (fail-closed; no partial
 * tree).
 * @param {string} xml - Well-formed XML document or fragment with a single root element.
 * @param {ParseXmlOptions} options - Optional limits and part name for diagnostics.
 * @returns {OoxmlElement} The document element.
 */
export function parseXml(xml: string, options: ParseXmlOptions = {}): OoxmlElement {
    const limits: SecurityLimits = resolveLimits(options.limits);
    const state: ParserState = {
        source: xml,
        index: 0,
        limits,
        partName: options.partName,
        depth: 0
    };
    // UTF-8 BOM (U+FEFF) is common on Windows-authored fixtures.
    if (peek(state) === '\uFEFF') {
        advance(state);
    }
    // Fast reject for DOCTYPE anywhere (security fail-closed before deep parse).
    if (/<!DOCTYPE/i.test(xml)) {
        throw new XmlParseError('DOCTYPE / DTD declarations are not allowed (external entities disabled)',
                                partNameOptions(options.partName));
    }
    skipWs(state);
    while (state.index < state.source.length) {
        if (startsWith(state, '<?')) {
            skipProcessingInstruction(state);
            skipWs(state);
            continue;
        }
        if (startsWith(state, '<!--')) {
            skipComment(state);
            skipWs(state);
            continue;
        }
        if (startsWith(state, '<!DOCTYPE') || startsWith(state, '<!doctype')) {
            rejectDoctype(state);
        }
        if (peek(state) === '<') {
            const root: OoxmlElement = parseElement(state, []);
            skipWs(state);
            if (state.index < state.source.length) {
                // Trailing misc only: comments / PI
                while (state.index < state.source.length) {
                    skipWs(state);
                    if (state.index >= state.source.length) {
                        break;
                    }
                    if (startsWith(state, '<!--')) {
                        skipComment(state);
                        continue;
                    }
                    if (startsWith(state, '<?')) {
                        skipProcessingInstruction(state);
                        continue;
                    }
                    failParse(state, 'Unexpected content after document element');
                }
            }
            return root;
        }
        return failParse(state, 'Expected document element');
    }
    return failParse(state, 'Empty XML document');
}
/**
 *
 * @param {string} text - The text value.
 * @returns {string} The result.
 */
function escapeText(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/**
 *
 * @param {string} text - The text value.
 * @returns {string} The result.
 */
function escapeAttr(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
interface SerializeCtx {
    /** prefix -> uri bindings currently in scope */
    readonly bindings: Map<string, string>;
    nextNs: number;
}
/**
 *
 * @param {SerializeCtx} ctx - The ctx value.
 * @param {string} uri - The uri value.
 * @param {string} prefer - The prefer value.
 * @returns {string | undefined} The result.
 */
function findPrefixForUri(ctx: SerializeCtx, uri: string, prefer?: string): string | undefined {
    if (prefer !== undefined && ctx.bindings.get(prefer) === uri) {
        return prefer;
    }
    const bindingEntries: Array<[string, string]> = Array.from(ctx.bindings.entries());
    for (let i: number = 0; i < bindingEntries.length; i++) {
        const p: string = arrayAt(bindingEntries, i)[0];
        const u: string = arrayAt(bindingEntries, i)[1];
        if (u === uri) {
            return p;
        }

    }
    return undefined;
}
/**
 *
 * @param {string} prefix - The prefix value.
 * @param {string} localName - The localName value.
 * @returns {string} The result.
 */
function qName(prefix: string, localName: string): string {
    return prefix === '' ? localName : `${prefix}:${localName}`;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {SerializeCtx} ctx - The ctx value.
 * @returns {string} The result.
 */
function serializeElement(el: OoxmlElement, ctx: SerializeCtx): string {
    const saved: Map<string, string> = new Map(ctx.bindings);
    const localDecls: {
        prefix: string;
        uri: string;
    }[] = [];
    // Prefer original xmlns declarations so MC prefix-token attributes stay valid.
    // Always re-emit declarations that were present on this element, even when the
    // same binding is already in scope from an ancestor — otherwise mid-tree
    // xmlns:ext / xmlns:mc used by Ignorable / ProcessContent / Preserve* tokens
    // disappear on round-trip (spec 027 / TASK-1039).
    if (el.namespaceDeclarations !== undefined) {
        for (let i: number = 0; i < el.namespaceDeclarations.length; i++) {
            const decl: { prefix: string; uri: string } = arrayAt(el.namespaceDeclarations, i);
            ctx.bindings.set(decl.prefix, decl.uri);
            const alreadyQueued: boolean = localDecls.some((d: { prefix: string; uri: string; }) => d.prefix === decl.prefix &&
                d.uri === decl.uri);
            if (!alreadyQueued) {
                localDecls.push({ prefix: decl.prefix, uri: decl.uri });
            }

        }
    }
    const bind: (uri: string, prefer?: string) => string = (uri: string, prefer?: string): string => {
        if (uri === XML_NS) {
            return 'xml';
        }
        if (uri === '') {
            return '';
        }
        const hit: string = findPrefixForUri(ctx, uri, prefer);
        if (hit !== undefined) {
            return hit;
        }
        let prefix: string | undefined;
        if (prefer !== undefined && prefer !== '' && !ctx.bindings.has(prefer)) {
            // Caller asked for a specific prefix. But if that prefix already has a
            // *different* URI bound (covered by `prefer !== undefined && …` check
            // above when `!ctx.bindings.has(prefer)` is false we fall through), we
            // must not overwrite it; fall through to synthesis.
            prefix = prefer;
        }
        else if (prefer === '') {
            // Caller wants the default namespace (unprefixed). Bind the URI to the
            // empty prefix unless the default namespace is already bound to a
            // *different* URI — in which case we must synthesize a prefix.
            if (!ctx.bindings.has('')) {
                prefix = '';
            }
        }
        if (prefix === undefined) {
            while (prefix === undefined) {
                const candidate: string = `ns${String(ctx.nextNs)}`;
                ctx.nextNs += 1;
                if (!ctx.bindings.has(candidate)) {
                    prefix = candidate;
                }
            }
        }
        ctx.bindings.set(prefix, uri);
        localDecls.push({ prefix, uri });
        return prefix;
    };
    const elementPrefix: string = bind(el.namespaceUri, el.prefixHint);
    const attrSerial: string[] = [];
    for (let i: number = 0; i < el.attributes.length; i++) {
        const attr: OoxmlAttribute = arrayAt(el.attributes, i);
        const ap: string = attr.namespaceUri === '' ? '' : bind(attr.namespaceUri, attr.prefix);
        attrSerial.push(`${qName(ap, attr.localName)}="${escapeAttr(attr.value)}"`);

    }
    const nsSerial: Array<string> = localDecls.map((d: { prefix: string; uri: string; }) => d.prefix === ''
        ? `xmlns="${escapeAttr(d.uri)}"` : `xmlns:${d.prefix}="${escapeAttr(d.uri)}"`);
    const openBits: Array<string> = [qName(elementPrefix, el.localName), ...nsSerial, ...attrSerial];
    const openHead: string = (openBits[0] !== null && openBits[0] !== undefined ? openBits[0] : '');
    const open: string = openBits.length === 1 ? `<${openHead}` : `<${openHead} ${openBits.slice(1).join(' ')}`;
    if (el.children.length === 0) {
        ctx.bindings.clear();
        const savedEntries: Array<[string, string]> = Array.from(saved.entries());
        for (let i: number = 0; i < savedEntries.length; i++) {
            const k: string = arrayAt(savedEntries, i)[0];
            const v: string = arrayAt(savedEntries, i)[1];
            ctx.bindings.set(k, v);

        }
        return `${open}/>`;
    }
    let body: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'text') {
            body += escapeText(child.text);
        }
        else {
            body += serializeElement(child, ctx);
        }

    }
    ctx.bindings.clear();
    const savedEntries: Array<[string, string]> = Array.from(saved.entries());
    for (let i: number = 0; i < savedEntries.length; i++) {
        const k: string = arrayAt(savedEntries, i)[0];
        const v: string = arrayAt(savedEntries, i)[1];
        ctx.bindings.set(k, v);

    }
    return `${open}>${body}</${qName(elementPrefix, el.localName)}>`;
}
/**
 * XML declaration required at the start of every OPC part that is an XML
 * document (ECMA-376 Part 2 §7.4; PowerPoint rejects packages whose `.rels`
 * and `[Content_Types].xml` parts omit the declaration, surfacing a repair
 * prompt). `standalone="yes"` matches MS-Office authoring output.
 */
export const XML_DECLARATION: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
/**
 * Serializes an {@link OoxmlElement} tree to UTF-8 XML (no XML declaration).
 *
 * Use {@link serializeXml} for ad-hoc fragment serialization and round-trip
 * probes. Use {@link serializeXmlDocument} when writing a top-level OPC part
 * (e.g. `[Content_Types].xml`, any `.rels` part, a slide/master/theme part)
 * so the resulting document carries the required XML declaration.
 *
 * @param {OoxmlElement} root - Document element to emit.
 * @returns {string} Well-formed XML string with xmlns declarations as needed.
 */
export function serializeXml(root: OoxmlElement): string {
    const ctx: SerializeCtx = {
        bindings: new Map(),
        nextNs: 0
    };
    return serializeElement(root, ctx);
}
/**
 * Serializes an {@link OoxmlElement} tree to a standalone UTF-8 XML document
 * with the required `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
 * declaration prepended.
 *
 * @param {OoxmlElement} root - Document element to emit.
 * @returns {string} Well-formed XML document string suitable for an OPC part.
 */
export function serializeXmlDocument(root: OoxmlElement): string {
    return `${XML_DECLARATION}${serializeXml(root)}`;
}
/**
 *
 * @param {OoxmlAttribute} a - The a value.
 * @returns {string} The result.
 */
function attrKey(a: OoxmlAttribute): string {
    return `${a.namespaceUri}\0${a.localName}`;
}
/**
 *
 * @param {*} a - The a value.
 * @param {*} b - The b value.
 * @returns {boolean} The result.
 */
function attrsEqual(a: ReadonlyArray<OoxmlAttribute>, b: ReadonlyArray<OoxmlAttribute>): boolean {
    if (a.length !== b.length) {
        return false;
    }
    const map: Map<string, string> = new Map<string, string>();
    for (let i: number = 0; i < a.length; i++) {
        const attr: OoxmlAttribute = arrayAt(a, i);
        map.set(attrKey(attr), attr.value);

    }
    for (let i: number = 0; i < b.length; i++) {
        const attrB: OoxmlAttribute = arrayAt(b, i);
        const keyB: string = attrKey(attrB);
        if (!map.has(keyB) || map.get(keyB) !== attrB.value) {
            return false;
        }
        map.delete(keyB);

    }
    return map.size === 0;
}
/**
 *
 * @param {*} children - The children value.
 * @returns {*} The result.
 */
function normalizeTextAdjacent(children: ReadonlyArray<OoxmlElement | OoxmlText>): (OoxmlElement | OoxmlText)[] {
    const out: (OoxmlElement | OoxmlText)[] = [];
    for (let i: number = 0; i < children.length; i++) {
        const c: OoxmlElement | OoxmlText = arrayAt(children, i);
        if (c.kind === 'text') {
            const last: OoxmlElement | OoxmlText = out[out.length - 1];
            if (last !== undefined && last.kind === 'text') {
                out[out.length - 1] = { kind: 'text' as 'text', text: last.text + c.text };
            }
            else if (c.text.length > 0) {
                out.push(c);
            }
        }
        else {
            out.push(c);
        }

    }
    return out;
}
/**
 * Semantic equality: namespace URI, local name, attribute bag, ordered children, text.
 *
 * @param {OoxmlElement} a - First tree.
 * @param {OoxmlElement} b - Second tree.
 * @returns {boolean} True when trees match for round-trip probes.
 */
export function equalOoxmlTree(a: OoxmlElement, b: OoxmlElement): boolean {
    if (a.namespaceUri !== b.namespaceUri || a.localName !== b.localName) {
        return false;
    }
    if (!attrsEqual(a.attributes, b.attributes)) {
        return false;
    }
    const ac: Array<OoxmlElement | OoxmlText> = normalizeTextAdjacent(a.children);
    const bc: Array<OoxmlElement | OoxmlText> = normalizeTextAdjacent(b.children);
    if (ac.length !== bc.length) {
        return false;
    }
    for (let i: number = 0; i < ac.length; i += 1) {
        const x: OoxmlElement | OoxmlText = arrayAt(ac, i);
        const y: OoxmlElement | OoxmlText = arrayAt(bc, i);
        if (x === undefined || y === undefined) {
            return false;
        }
        if (x.kind !== y.kind) {
            return false;
        }
        if (x.kind === 'text' && y.kind === 'text') {
            if (x.text !== y.text) {
                return false;
            }
        }
        else if (x.kind === 'element' && y.kind === 'element') {
            if (!equalOoxmlTree(x, y)) {
                return false;
            }
        }
    }
    return true;
}
