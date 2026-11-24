import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, XML_NAMESPACE } from './model';
function replaceAllLiteral(value: string, search: string, replacement: string): string {
    // String.replaceAll is ES2021 and is not rewritten by target ES5.
    return value.split(search).join(replacement);
}
function escapeText(value: string): string {
    return replaceAllLiteral(replaceAllLiteral(replaceAllLiteral(value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;');
}
function escapeAttr(value: string): string {
    return replaceAllLiteral(escapeText(value), '"', '&quot;');
}
function attributeName(attr: OpenXmlAttribute): string {
    return attr.prefix === '' ? attr.localName : attr.prefix + ':' + attr.localName;
}
/**
 * Namespaces Word roots always bind; their prefixes are assumed declared by the part root, so a
 * detached element never re-declares them. Only foreign (custom) prefixes are closed on write.
 */
const ROOT_BOUND_NAMESPACE_PREFIXES: ReadonlyArray<string> = [
    'http://schemas.openxmlformats.org/',
    'http://schemas.microsoft.com/',
    'http://purl.oclc.org/ooxml/',
    'urn:schemas-microsoft-com:'
];
function isRootBoundNamespace(uri: string): boolean {
    return ROOT_BOUND_NAMESPACE_PREFIXES.some((prefix: string) => uri.indexOf(prefix) === 0);
}
function serializeChild(node: OpenXmlChild, scope: Map<string, string>): string {
    if (node.kind === 'text') {
        return escapeText(node.value);
    }
    return serializeElement(node, scope);
}
function serializeElement(element: OpenXmlElement, parentScope: Map<string, string>): string {
    const name: string = element.prefix === '' ? element.localName : element.prefix + ':' + element.localName;
    const pieces: string[] = ['<', name];
    const scope: Map<string, string> = new Map<string, string>();
    parentScope.forEach((uri: string, prefix: string) => scope.set(prefix, uri));
    for (const decl of element.namespaceDeclarations) {
        scope.set(decl.prefix, decl.namespaceUri);
        if (decl.prefix === '') {
            pieces.push(' xmlns="', escapeAttr(decl.namespaceUri), '"');
        }
        else {
            pieces.push(' xmlns:', decl.prefix, '="', escapeAttr(decl.namespaceUri), '"');
        }
    }
    const close: (prefix: string, uri: string) => void = (prefix: string, uri: string): void => {
        if (prefix === '' || uri === '' || uri === XML_NAMESPACE || scope.has(prefix) || isRootBoundNamespace(uri)) {
            return;
        }
        scope.set(prefix, uri);
        pieces.push(' xmlns:', prefix, '="', escapeAttr(uri), '"');
    };
    close(element.prefix, element.namespaceUri);
    for (const attr of element.attributes) {
        close(attr.prefix, attr.namespaceUri);
    }
    for (const attr of element.attributes) {
        const qname: string = attr.namespaceUri === XML_NAMESPACE && attr.prefix === ''
            ? 'xml:' + attr.localName
            : attributeName(attr);
        pieces.push(' ', qname, '="', escapeAttr(attr.value), '"');
    }
    if (element.children.length === 0) {
        pieces.push('/>');
        return pieces.join('');
    }
    pieces.push('>');
    for (const child of element.children) {
        pieces.push(serializeChild(child, scope));
    }
    pieces.push('</', name, '>');
    return pieces.join('');
}
/**
 * Serialize a preservation element. Prefixes on the node are reused; namespace
 * declarations stored on the element are emitted as xmlns attributes. A foreign
 * (non-Office) prefix that is used but not declared in scope is declared on the element.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {string} The result.
 * @private
 */
export function serializeXml(element: OpenXmlElement): string {
    return serializeElement(element, new Map<string, string>());
}
