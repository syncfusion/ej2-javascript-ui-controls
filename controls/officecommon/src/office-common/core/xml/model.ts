import { Literal } from '../literal-type';
/**
 * Minimal Open XML element tree model shared by office-common codecs.
 *
 * Shape matches the application-repo OpenXml tree (`ej2-docx` `src/core/xml/model.ts`)
 * so ink parse/serialize can accept host-supplied trees without a second DOM type.
 *
 * This module does **not** parse raw bytes — callers supply an element tree.
 */

/**
 * Attribute on an {@link OpenXmlElement}.
 *
 * @public
 */
export interface OpenXmlAttribute {
    readonly namespaceUri: string;
    readonly localName: string;
    readonly prefix: string;
    readonly value: string;
}

/**
 * `xmlns` declaration on an {@link OpenXmlElement}.
 *
 * @public
 */
export interface NamespaceDeclaration {
    readonly prefix: string;
    readonly namespaceUri: string;
}

/**
 * Child of an {@link OpenXmlElement}.
 *
 * @public
 */
export type OpenXmlChild = OpenElement | OpenXmlText;

/**
 * Text node in the XML tree.
 *
 * @public
 */
export interface OpenXmlText {
    readonly kind: 'text';
    readonly value: string;
}

/**
 * Element in the preserved XML tree.
 *
 * @public
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

/** Alias kept for internal clarity when building trees. */
export type OpenElement = OpenXmlElement;

/**
 * XML namespace URI (`xml:`).
 *
 * @public
 */
export const XML_NAMESPACE: Literal<'http://www.w3.org/XML/1998/namespace'> = 'http://www.w3.org/XML/1998/namespace';

/**
 * XMLNS namespace URI (`xmlns:`).
 *
 * @public
 */
export const XMLNS_NAMESPACE: Literal<'http://www.w3.org/2000/xmlns/'> = 'http://www.w3.org/2000/xmlns/';
