import { OoxmlAttribute, OoxmlElement, OoxmlNamespaceDeclaration, OoxmlText } from './dom';
import { MC_NS, MC_PREFIX_TOKEN_ATTRIBUTES, splitMcPrefixTokens } from './markup-compatibility';
import { SecurityLimits, resolveLimits } from '../security/limits';
import { XmlLimitError } from '../security/errors';
/** Source identity and full part context are required; a detached leaf loses inherited bindings. @internal */
export interface ScopedElementSource {
    readonly root: OoxmlElement; readonly node: OoxmlElement; readonly partName?: string;
}
/** Destination profile; relationship remapping is deliberately a separate package operation. @internal */
export interface ScopedCloneTarget {
    readonly partName?: string; readonly limits: SecurityLimits; readonly depth?: number;
}
/** A source context cannot be transferred safely without an explicit higher-level policy. @internal */
export class ScopedCloneError extends Error {
    readonly reason: string;
    readonly partName: string | undefined;
    /** @param {string} reason - Stable unsupported-copy context.
     * @param {string | undefined} partName - Destination part, when bound. */
    constructor(reason: string, partName?: string) {
        super('Unsupported scoped XML copy: ' + reason); this.name = 'ScopedCloneError';
        this.reason = reason; this.partName = partName; Object.setPrototypeOf(this, ScopedCloneError.prototype);
    }
}
const XML_NS: string = 'http://www.w3.org/XML/1998/namespace';
const RELATIONSHIPS: ReadonlySet<string> = new Set([
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'http://purl.oclc.org/ooxml/officeDocument/relationships'
]);
/**
 * Copies a whole element independently with its inherited namespace/MC context.
 *
 * Conditional fragments, conflicting directives, prefix rebinding used by inherited
 * directives, inherited XML text/base context, and unremapped cross-part relationship
 * attributes are explicit failures. No source node or package part is changed here.
 *
 * @param {ScopedElementSource} source - Actual node identity under its owning part root.
 * @param {ScopedCloneTarget} target - Destination ownership, depth and existing security limits.
 * @returns {OoxmlElement} Detached clone preserving authored/foreign XML rather than effective values.
 */
export function cloneScopedElement(source: ScopedElementSource, target: ScopedCloneTarget): OoxmlElement {
    const limits: SecurityLimits = resolveLimits(target.limits);
    const depth: number = target.depth === undefined ? 1 : target.depth;
    if (!Number.isSafeInteger(depth) || depth < 1) { throw new RangeError('Invalid scoped clone depth'); }
    const path: OoxmlElement[] = scopedElementPath(source, limits, target.partName);
    const scope: Map<string, string> = new Map(); scope.set('xml', XML_NS);
    const directives: Map<string, OoxmlAttribute> = new Map(); const bindings: Map<string, string> = new Map();
    for (const frame of path) {
        if (frame !== source.node && frame.namespaceUri === MC_NS &&
            ['AlternateContent', 'Choice', 'Fallback'].indexOf(frame.localName) >= 0) { fail('conditional-context', target.partName); }
        const local: Set<string> = new Set();
        for (const declaration of frame.namespaceDeclarations || []) {
            if (local.has(declaration.prefix)) { fail('duplicate-namespace', target.partName); }
            local.add(declaration.prefix); scope.set(declaration.prefix, declaration.uri);
        }
        for (const attribute of frame.attributes) {
            if (frame !== source.node && attribute.namespaceUri === XML_NS &&
                ['space', 'lang', 'base'].indexOf(attribute.localName) >= 0) { fail('inherited-xml-context', target.partName); }
            if (attribute.namespaceUri !== MC_NS) { continue; }
            if (!MC_PREFIX_TOKEN_ATTRIBUTES.has(attribute.localName)) {
                if (frame !== source.node) { fail('unknown-mc-context', target.partName); } continue;
            }
            const previous: OoxmlAttribute | undefined = directives.get(attribute.localName);
            if (previous && previous.value !== attribute.value) { fail('conflicting-mc-context', target.partName); }
            directives.set(attribute.localName, attribute);
            for (const token of splitMcPrefixTokens(attribute.value)) {
                const colon: number = token.indexOf(':');
                const prefix: string = colon >= 0 ? token.slice(0, colon) :
                    attribute.localName === 'Ignorable' || attribute.localName === 'MustUnderstand' ? token : '';
                const uri: string | undefined = scope.get(prefix); const old: string | undefined = bindings.get(prefix);
                if (!uri) { fail('unbound-mc-prefix', target.partName); }
                if (old !== undefined && old !== uri) { fail('rebound-mc-prefix', target.partName); }
                bindings.set(prefix, uri);
            }
        }
    }
    bindings.forEach((uri: string, prefix: string): void => {
        if (scope.get(prefix) !== uri) { fail('rebound-mc-prefix', target.partName); }
    });
    const samePart: boolean = source.partName !== undefined && source.partName === target.partName;
    const copy: OoxmlElement = cloneTree(source.node, depth, limits, target.partName, samePart);
    const attributes: OoxmlAttribute[] = copy.attributes.slice();
    directives.forEach((attribute: OoxmlAttribute): void => {
        if (!attributes.some((value: OoxmlAttribute): boolean =>
            value.namespaceUri === attribute.namespaceUri && value.localName === attribute.localName)) {
            attributes.push(copyAttribute(attribute));
        }
    });
    const declarations: OoxmlNamespaceDeclaration[] = [];
    scope.forEach((uri: string, prefix: string): void => { if (prefix !== 'xml') { declarations.push({ prefix, uri }); } });
    checkAttributes(attributes.length + declarations.length, limits, target.partName);
    return { ...copy, attributes, namespaceDeclarations: declarations };
}
/** @param {ScopedElementSource} source - Owning tree and exact source node.
 * @param {SecurityLimits} limits - Existing parse/walk limits.
 * @param {string | undefined} partName - Destination diagnostic part.
 * @returns {OoxmlElement[]} Unique path; malformed aliases/cycles are never guessed. */
export function scopedElementPath(source: ScopedElementSource, limits: SecurityLimits, partName: string | undefined): OoxmlElement[] {
    let result: OoxmlElement[] | undefined; const path: OoxmlElement[] = []; const seen: Set<OoxmlElement> = new Set();
    const walk: (node: OoxmlElement) => void = (node: OoxmlElement): void => {
        if (seen.has(node)) { fail('non-tree-source', partName); } seen.add(node); path.push(node);
        checkDepth(path.length, limits, partName);
        checkAttributes(node.attributes.length + (node.namespaceDeclarations || []).length, limits, partName);
        if (node === source.node) { result = path.slice(); }
        for (const child of node.children) { if (child.kind === 'element') { walk(child); } }
        path.pop();
    };
    walk(source.root); if (result === undefined) { fail('source-node-not-found', partName); } return result;
}
/** @param {OoxmlElement} node - Existing complete subtree.
 * @param {number} depth - Actual destination depth of this element.
 * @param {SecurityLimits} limits - Existing limits, never relaxed.
 * @param {string | undefined} partName - Destination part.
 * @param {boolean} samePart - Relationship IDs retain ownership only within the same part.
 * @returns {OoxmlElement} Independent known DOM fields, retaining every XML attribute/child. */
function cloneTree(node: OoxmlElement, depth: number, limits: SecurityLimits, partName: string | undefined,
                   samePart: boolean): OoxmlElement {
    checkDepth(depth, limits, partName);
    for (const attribute of node.attributes) {
        if (!samePart && RELATIONSHIPS.has(attribute.namespaceUri)) { fail('cross-part-relationship', partName); }
    }
    const namespaceDeclarations: OoxmlNamespaceDeclaration[] | undefined = node.namespaceDeclarations === undefined ? undefined :
        node.namespaceDeclarations.map((value: OoxmlNamespaceDeclaration): OoxmlNamespaceDeclaration =>
            ({ prefix: value.prefix, uri: value.uri }));
    checkAttributes(node.attributes.length + (namespaceDeclarations || []).length, limits, partName);
    const children: Array<OoxmlElement | OoxmlText> = node.children.map((child: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText => {
        if (child.kind === 'element') { return cloneTree(child, depth + 1, limits, partName, samePart); }
        if (child.text.length > limits.textNodeLengthBytes) { throw new XmlLimitError('textNodeLengthBytes', { partName, actual: child.text.length }); }
        const bytes: number = new TextEncoder().encode(child.text).length;
        if (bytes > limits.textNodeLengthBytes) { throw new XmlLimitError('textNodeLengthBytes', { partName, actual: bytes }); }
        return { kind: 'text', text: child.text };
    });
    return { kind: 'element', namespaceUri: node.namespaceUri, localName: node.localName,
        attributes: node.attributes.map(copyAttribute), children,
        ...(node.prefixHint === undefined ? {} : { prefixHint: node.prefixHint }),
        ...(namespaceDeclarations === undefined ? {} : { namespaceDeclarations }) };
}
/** @param {OoxmlAttribute} attribute - Source XML attribute.
 * @returns {OoxmlAttribute} Plain independent fields without additional caller-owned properties. */
function copyAttribute(attribute: OoxmlAttribute): OoxmlAttribute {
    return { namespaceUri: attribute.namespaceUri, localName: attribute.localName, value: attribute.value,
        ...(attribute.prefix === undefined ? {} : { prefix: attribute.prefix }) };
}
/** @param {number} count - Combined attributes and namespace declarations.
 * @param {SecurityLimits} limits - Existing parser limits.
 * @param {string | undefined} partName - Destination part.
 * @returns {void} Raises the same typed attribute-limit error as the parser. */
function checkAttributes(count: number, limits: SecurityLimits, partName: string | undefined): void {
    if (count > limits.xmlAttributesPerElement) { throw new XmlLimitError('xmlAttributesPerElement', { partName, actual: count }); }
}
/** @param {number} depth - Element depth, root is one.
 * @param {SecurityLimits} limits - Existing parser limits.
 * @param {string | undefined} partName - Destination part.
 * @returns {void} Raises a typed nesting-limit error before publication. */
function checkDepth(depth: number, limits: SecurityLimits, partName: string | undefined): void {
    if (depth > limits.xmlNestingDepth) { throw new XmlLimitError('xmlNestingDepth', { partName, actual: depth }); }
}
/** @param {string} reason - Unsafe transfer context.
 * @param {string | undefined} partName - Destination part.
 * @returns {void} Always throws; callers must choose a supported explicit authoring action. */
function fail(reason: string, partName: string | undefined): never { throw new ScopedCloneError(reason, partName); }
