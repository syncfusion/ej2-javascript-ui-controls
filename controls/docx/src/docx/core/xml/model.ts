/**
 * Attribute on an {@link OpenXmlElement}. Advanced hatch; unstable.
 *
 * @private
 */
export interface OpenXmlAttribute {
    readonly namespaceUri: string;
    readonly localName: string;
    readonly prefix: string;
    readonly value: string;
}

/**
 * `xmlns` declaration on an {@link OpenXmlElement}. Advanced hatch; unstable.
 *
 * @private
 */
export interface NamespaceDeclaration {
    readonly prefix: string;
    readonly namespaceUri: string;
}

/**
 * Child of an {@link OpenXmlElement}. Advanced hatch; unstable.
 *
 * @private
 */
export type OpenXmlChild = OpenXmlElement | OpenXmlText;

/**
 * Text node in the XML tree. Advanced hatch; unstable.
 *
 * @private
 */
export interface OpenXmlText {
    readonly kind: 'text';
    readonly value: string;
}

/**
 * Element in the preserved XML tree. Advanced hatch; unstable.
 *
 * @private
 */
export interface OpenXmlElement {
    readonly kind: 'element';
    readonly namespaceUri: string;
    readonly localName: string;
    readonly prefix: string;
    readonly attributes: ReadonlyArray<OpenXmlAttribute>;
    readonly namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    readonly children: ReadonlyArray<OpenXmlChild>;
}
/**
 * @private
 */
export const XML_NAMESPACE: string = 'http://www.w3.org/XML/1998/namespace';
/**
 * @private
 */
export const XMLNS_NAMESPACE: string = 'http://www.w3.org/2000/xmlns/';
/**
 * @private
 */
export const WML_TRANSITIONAL_NAMESPACE: string =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
/**
 * @private
 * Strict ISO/IEC 29500 WordprocessingML namespace (ECMA-376-1).
 */
export const WML_STRICT_NAMESPACE: string = 'http://purl.oclc.org/ooxml/wordprocessingml/main';
