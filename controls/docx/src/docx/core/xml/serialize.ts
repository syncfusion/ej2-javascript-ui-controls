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
function serializeChild(node: OpenXmlChild): string {
    if (node.kind === 'text') {
        return escapeText(node.value);
    }
    return serializeXml(node);
}
/**
 * Serialize a preservation element. Prefixes on the node are reused; namespace
 * declarations stored on the element are emitted as xmlns attributes.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {string} The result.
 * @private
 */
export function serializeXml(element: OpenXmlElement): string {
    const name: string = element.prefix === '' ? element.localName : element.prefix + ':' + element.localName;
    const pieces: string[] = ['<', name];
    for (const decl of element.namespaceDeclarations) {
        if (decl.prefix === '') {
            pieces.push(' xmlns="', escapeAttr(decl.namespaceUri), '"');
        }
        else {
            pieces.push(' xmlns:', decl.prefix, '="', escapeAttr(decl.namespaceUri), '"');
        }
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
        pieces.push(serializeChild(child));
    }
    pieces.push('</', name, '>');
    return pieces.join('');
}
