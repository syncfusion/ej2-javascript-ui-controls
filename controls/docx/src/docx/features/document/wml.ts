import { WML_STRICT_NAMESPACE, WML_TRANSITIONAL_NAMESPACE, XML_NAMESPACE, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
export const WML: string = WML_TRANSITIONAL_NAMESPACE;
/**
 *  True when the URI is Transitional or Strict WordprocessingML.
 *
 * @param {string} namespaceUri - The namespace uri.
 * @returns {boolean} The result.
 * @private
 */
export function isWmlNamespace(namespaceUri: string): boolean {
    return namespaceUri === WML_TRANSITIONAL_NAMESPACE || namespaceUri === WML_STRICT_NAMESPACE;
}
export function isWml(el: OpenXmlElement, localName: string): boolean {
    return isWmlNamespace(el.namespaceUri) && el.localName === localName;
}
export function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
export function textContent(el: OpenXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            out += child.value;
        }
    }
    return out;
}
export function wmlAttr(localName: string, value: string): OpenXmlAttribute {
    return { namespaceUri: WML, localName, prefix: 'w', value };
}
export function xmlSpacePreserve(): OpenXmlAttribute {
    return { namespaceUri: XML_NAMESPACE, localName: 'space', prefix: 'xml', value: 'preserve' };
}
export function wmlElement(localName: string, options?: {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly children?: ReadonlyArray<OpenXmlChild>;
    readonly namespaceDeclarations?: OpenXmlElement['namespaceDeclarations'];
}): OpenXmlElement {
    let ts330: any; let ts331: any; let ts332: any;
    return {
        kind: 'element',
        namespaceUri: WML,
        localName,
        prefix: 'w',
        attributes: ((ts330 = options == null ? undefined : options.attributes), ts330 != null ? ts330 : []),
        namespaceDeclarations: ((ts331 = options == null ? undefined : options.namespaceDeclarations), ts331 != null ? ts331 : []),
        children: ((ts332 = options == null ? undefined : options.children), ts332 != null ? ts332 : [])
    };
}
export function wValAttribute(el: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find((a: OpenXmlAttribute) => a.localName === 'val' && (isWmlNamespace(a.namespaceUri) || a.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
export function xmlSpaceIsPreserve(el: OpenXmlElement): boolean {
    return el.attributes.some((a: OpenXmlAttribute) => a.localName === 'space' && a.namespaceUri === XML_NAMESPACE && a.value === 'preserve');
}
