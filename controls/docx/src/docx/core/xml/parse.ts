import { SecurityError, XmlError } from '../errors/docx-error';
import { ResourceLimits, resolveResourceLimits, ResourceLimitOverrides } from '../security/limits';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, OpenXmlText, NamespaceDeclaration, XML_NAMESPACE, XMLNS_NAMESPACE } from './model';
interface NsScope {
    readonly defaultUri: string;
    readonly prefixes: ReadonlyMap<string, string>;
}
class XmlReader {
    readonly source: string;
    pos: number = 0;
    constructor(source: string) {
        this.source = source;
    }
    eof(): boolean {
        return this.pos >= this.source.length;
    }
    peek(): string {
        return this.source.charAt(this.pos);
    }
    startsWith(value: string): boolean {
        return this.source.startsWith(value, this.pos);
    }
    advance(count: number = 1): void {
        this.pos += count;
    }
    skipWhitespace(): void {
        while (!this.eof()) {
            const ch: string = this.peek();
            if (ch !== ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r') {
                break;
            }
            this.advance();
        }
    }
}
function decodeEntity(reader: XmlReader): string {
    if (!reader.startsWith('&')) {
        throw new XmlError('xml/malformed', 'Expected entity reference');
    }
    const start: number = reader.pos;
    reader.advance();
    if (reader.startsWith('#x') || reader.startsWith('#X')) {
        reader.advance(2);
        let hex: string = '';
        while (!reader.eof() && /[0-9a-fA-F]/.test(reader.peek())) {
            hex += reader.peek();
            reader.advance();
        }
        if (!reader.startsWith(';') || hex.length === 0) {
            throw new XmlError('xml/malformed', 'Invalid numeric character reference');
        }
        reader.advance();
        const code: number = Number.parseInt(hex, 16);
        return String.fromCodePoint(code);
    }
    if (reader.startsWith('#')) {
        reader.advance();
        let dec: string = '';
        while (!reader.eof() && /[0-9]/.test(reader.peek())) {
            dec += reader.peek();
            reader.advance();
        }
        if (!reader.startsWith(';') || dec.length === 0) {
            throw new XmlError('xml/malformed', 'Invalid numeric character reference');
        }
        reader.advance();
        return String.fromCodePoint(Number.parseInt(dec, 10));
    }
    const namedStart: number = reader.pos;
    while (!reader.eof() && /[A-Za-z]/.test(reader.peek())) {
        reader.advance();
    }
    const name: string = reader.source.slice(namedStart, reader.pos);
    if (!reader.startsWith(';')) {
        throw new XmlError('xml/malformed', `Unterminated entity at ${String(start)}`);
    }
    reader.advance();
    switch (name) {
    case 'lt':
        return '<';
    case 'gt':
        return '>';
    case 'amp':
        return '&';
    case 'quot':
        return '"';
    case 'apos':
        return '\'';
    default:
        throw new XmlError('xml/dtd-forbidden', `Unknown entity &${name}; — DTD-defined entities are not resolved`);
    }
}
function readName(reader: XmlReader): string {
    const start: number = reader.pos;
    if (reader.eof() || !/[:A-Za-z_]/.test(reader.peek())) {
        throw new XmlError('xml/malformed', `Invalid XML name at ${String(start)}`);
    }
    reader.advance();
    while (!reader.eof() && /[:A-Za-z0-9._-]/.test(reader.peek())) {
        reader.advance();
    }
    return reader.source.slice(start, reader.pos);
}
function splitQName(qname: string): {
    prefix: string;
    localName: string;
} {
    const colon: number = qname.indexOf(':');
    if (colon === -1) {
        return { prefix: '', localName: qname };
    }
    return { prefix: qname.slice(0, colon), localName: qname.slice(colon + 1) };
}
function resolvePrefix(prefix: string, scope: NsScope): string {
    if (prefix === 'xml') {
        return XML_NAMESPACE;
    }
    if (prefix === 'xmlns') {
        return XMLNS_NAMESPACE;
    }
    if (prefix === '') {
        return scope.defaultUri;
    }
    const uri: string = scope.prefixes.get(prefix);
    if (uri === undefined) {
        throw new XmlError('xml/malformed', `Unbound namespace prefix ${prefix}`);
    }
    return uri;
}
function readQuoted(reader: XmlReader, limits: ResourceLimits): string {
    const quote: string = reader.peek();
    if (quote !== '"' && quote !== '\'') {
        throw new XmlError('xml/malformed', 'Attribute value must be quoted');
    }
    reader.advance();
    let value: string = '';
    while (!reader.eof() && reader.peek() !== quote) {
        if (reader.peek() === '<') {
            throw new XmlError('xml/malformed', 'Raw < in attribute value');
        }
        if (reader.peek() === '&') {
            value += decodeEntity(reader);
        }
        else {
            value += reader.peek();
            reader.advance();
        }
        if (value.length > limits.textNodeLength) {
            throw new SecurityError('security/limit-exceeded', 'Attribute value exceeds the text length limit');
        }
    }
    if (reader.peek() !== quote) {
        throw new XmlError('xml/malformed', 'Unterminated attribute value');
    }
    reader.advance();
    return value;
}
function skipCommentOrPi(reader: XmlReader): void {
    if (reader.startsWith('<!--')) {
        reader.advance(4);
        const end: number = reader.source.indexOf('-->', reader.pos);
        if (end === -1) {
            throw new XmlError('xml/malformed', 'Unterminated comment');
        }
        reader.pos = end + 3;
        return;
    }
    if (reader.startsWith('<?')) {
        reader.advance(2);
        const end: number = reader.source.indexOf('?>', reader.pos);
        if (end === -1) {
            throw new XmlError('xml/malformed', 'Unterminated processing instruction');
        }
        reader.pos = end + 2;
        return;
    }
}
function parseElement(reader: XmlReader, scope: NsScope, depth: number, limits: ResourceLimits): OpenXmlElement {
    if (depth > limits.xmlNestingDepth) {
        throw new SecurityError('security/limit-exceeded', `XML nesting depth exceeds ${String(limits.xmlNestingDepth)}`);
    }
    if (!reader.startsWith('<')) {
        throw new XmlError('xml/malformed', 'Expected < to start an element');
    }
    reader.advance();
    if (reader.startsWith('/')) {
        throw new XmlError('xml/malformed', 'Unexpected end tag');
    }
    const qname: string = readName(reader);
    const rawAttributes: {
        qname: string;
        value: string;
    }[] = [];
    reader.skipWhitespace();
    while (!reader.eof() && reader.peek() !== '>' && reader.peek() !== '/') {
        const attrName: string = readName(reader);
        reader.skipWhitespace();
        if (reader.peek() !== '=') {
            throw new XmlError('xml/malformed', `Expected = after attribute ${attrName}`);
        }
        reader.advance();
        reader.skipWhitespace();
        const value: string = readQuoted(reader, limits);
        rawAttributes.push({ qname: attrName, value });
        if (rawAttributes.length > limits.xmlAttributeCount) {
            throw new SecurityError('security/limit-exceeded', 'XML attribute count exceeds the limit');
        }
        reader.skipWhitespace();
    }
    const nsDecls: NamespaceDeclaration[] = [];
    let defaultUri: string = scope.defaultUri;
    const prefixMap: Map<string, string> = new Map(scope.prefixes);
    for (const attr of rawAttributes) {
        if (attr.qname === 'xmlns') {
            defaultUri = attr.value;
            nsDecls.push({ prefix: '', namespaceUri: attr.value });
        }
        else if (attr.qname.startsWith('xmlns:')) {
            const p: string = attr.qname.slice('xmlns:'.length);
            prefixMap.set(p, attr.value);
            nsDecls.push({ prefix: p, namespaceUri: attr.value });
        }
    }
    const childScope: NsScope = { defaultUri, prefixes: prefixMap };
    const { prefix, localName } = splitQName(qname);
    const namespaceUri: string = resolvePrefix(prefix, childScope);
    const attributes: OpenXmlAttribute[] = [];
    for (const attr of rawAttributes) {
        if (attr.qname === 'xmlns' || attr.qname.startsWith('xmlns:')) {
            continue;
        }
        const split: { prefix: string; localName: string; } = splitQName(attr.qname);
        attributes.push({
            prefix: split.prefix,
            localName: split.localName,
            namespaceUri: split.prefix === '' ? '' : resolvePrefix(split.prefix, childScope),
            value: attr.value
        });
    }
    let selfClosing: boolean = false;
    if (reader.startsWith('/>')) {
        selfClosing = true;
        reader.advance(2);
    }
    else if (reader.startsWith('>')) {
        reader.advance();
    }
    else {
        throw new XmlError('xml/malformed', `Unterminated start tag ${qname}`);
    }
    const children: OpenXmlChild[] = [];
    if (!selfClosing) {
        parseContent(reader, childScope, depth + 1, limits, qname, children);
    }
    return {
        kind: 'element',
        namespaceUri,
        localName,
        prefix,
        attributes,
        namespaceDeclarations: nsDecls,
        children
    };
}
function parseContent(
    reader: XmlReader,
    scope: NsScope,
    depth: number,
    limits: ResourceLimits,
    parentQName: string,
    children: OpenXmlChild[]
): void {
    while (!reader.eof()) {
        if (reader.startsWith('</')) {
            reader.advance(2);
            const endName: string = readName(reader);
            reader.skipWhitespace();
            if (!reader.startsWith('>')) {
                throw new XmlError('xml/malformed', 'Unterminated end tag');
            }
            reader.advance();
            if (endName !== parentQName) {
                throw new XmlError('xml/malformed', `Mismatched end tag </${endName}> for <${parentQName}>`);
            }
            return;
        }
        if (reader.startsWith('<!--') || reader.startsWith('<?')) {
            skipCommentOrPi(reader);
            continue;
        }
        if (reader.startsWith('<![CDATA[')) {
            reader.advance(9);
            const end: number = reader.source.indexOf(']]>', reader.pos);
            if (end === -1) {
                throw new XmlError('xml/malformed', 'Unterminated CDATA');
            }
            const value: string = reader.source.slice(reader.pos, end);
            if (value.length > limits.textNodeLength) {
                throw new SecurityError('security/limit-exceeded', 'CDATA exceeds the text length limit');
            }
            reader.pos = end + 3;
            children.push({ kind: 'text', value });
            continue;
        }
        if (reader.startsWith('<')) {
            children.push(parseElement(reader, scope, depth, limits));
            continue;
        }
        let text: string = '';
        while (!reader.eof() && reader.peek() !== '<') {
            if (reader.peek() === '&') {
                text += decodeEntity(reader);
            }
            else {
                text += reader.peek();
                reader.advance();
            }
            if (text.length > limits.textNodeLength) {
                throw new SecurityError('security/limit-exceeded', 'Text node exceeds the text length limit');
            }
        }
        if (text.length > 0) {
            children.push({ kind: 'text', value: text });
        }
    }
    throw new XmlError('xml/malformed', `Missing end tag for <${parentQName}>`);
}
/**
 * Decode OPC/XML part bytes. Supports UTF-8 and UTF-16 (BOM).
 * Word sometimes writes parts such as `numbering.xml` as UTF-16LE.
 *
 * @param {Uint8Array} data - The data.
 * @returns {string} The result.
 * @private
 */
export function decodeXmlBytes(data: Uint8Array): string {
    if (data.length >= 2) {
        // UTF-16LE BOM
        if (data[0] === 0xff && data[1] === 0xfe) {
            return new TextDecoder('utf-16le').decode(data);
        }
        // UTF-16BE BOM
        if (data[0] === 0xfe && data[1] === 0xff) {
            return new TextDecoder('utf-16be').decode(data);
        }
    }
    return new TextDecoder('utf-8').decode(data);
}
/**
 * Parse XML into a preservation DOM. Namespace URI + local name identify elements;
 * prefixes are stored only for stable serialization. DTD/ENTITY constructs fail closed.
 *
 * @param {string} xml - The xml.
 * @param {ResourceLimitOverrides} limitOverrides - The limit overrides.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function parseXml(xml: string, limitOverrides?: ResourceLimitOverrides): OpenXmlElement {
    const limits: ResourceLimits = resolveResourceLimits(limitOverrides);
    const withoutBom: string = xml.charCodeAt(0) === 0xfeff ? xml.slice(1) : xml;
    if (/<!DOCTYPE/i.test(withoutBom) || /<!ENTITY/i.test(withoutBom)) {
        throw new XmlError('xml/dtd-forbidden', 'DTD and ENTITY declarations are disabled');
    }
    const reader: XmlReader = new XmlReader(withoutBom);
    reader.skipWhitespace();
    while (reader.startsWith('<?') || reader.startsWith('<!--')) {
        skipCommentOrPi(reader);
        reader.skipWhitespace();
    }
    const root: OpenXmlElement = parseElement(reader, { defaultUri: '', prefixes: new Map() }, 1, limits);
    reader.skipWhitespace();
    if (!reader.eof()) {
        throw new XmlError('xml/malformed', 'Trailing content after the document element');
    }
    return root;
}
