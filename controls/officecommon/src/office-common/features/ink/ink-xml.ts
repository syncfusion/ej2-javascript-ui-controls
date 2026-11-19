/**
 * Small OpenXml element helpers scoped to InkML serialization.
 */

import { Literal } from '../../core/literal-type';
import {
    NamespaceDeclaration,
    OpenXmlAttribute,
    OpenXmlChild,
    OpenXmlElement,
    OpenXmlText
} from '../../core/xml/model';
import { XML_NAMESPACE, XMLNS_NAMESPACE } from '../../core/xml/model';
import { INKML_NAMESPACE } from './constants';

const INK_PREFIX: Literal<'inkml'> = 'inkml';

/**
 * Build an InkML-namespaced element.
 *
 * @param {string} localName - The local name.
 * @param {ReadonlyArray<OpenXmlAttribute>} attributes - The attributes.
 * @param {ReadonlyArray<OpenXmlChild>} children - The children.
 * @param {ReadonlyArray<NamespaceDeclaration>} namespaceDeclarations - The namespace declarations.
 * @returns {OpenXmlElement} The result.
 */
export function inkElement(
    localName: string,
    attributes: ReadonlyArray<OpenXmlAttribute> = [],
    children: ReadonlyArray<OpenXmlChild> = [],
    namespaceDeclarations: ReadonlyArray<NamespaceDeclaration> = []
): OpenXmlElement {
    return { kind: 'element',
        namespaceUri: INKML_NAMESPACE,
        localName,
        prefix: INK_PREFIX,
        attributes,
        namespaceDeclarations,
        children
    };
}

/**
 * Plain attribute (no namespace).
 *
 * @param {string} localName - The local name.
 * @param {string} value - The value.
 * @returns {OpenXmlAttribute} The result.
 */
export function attr(localName: string, value: string): OpenXmlAttribute {
    return { namespaceUri: '', localName, prefix: '', value };
}

/**
 * `xml:id` attribute.
 *
 * @param {string} id - The id.
 * @returns {OpenXmlAttribute} The result.
 */
export function xmlIdAttr(id: string): OpenXmlAttribute {
    return {
        namespaceUri: XML_NAMESPACE,
        localName: 'id',
        prefix: 'xml',
        value: id
    };
}

/**
 * Text node.
 *
 * @param {string} value - The value.
 * @returns {OpenXmlText} The result.
 */
export function textNode(value: string): OpenXmlText {
    return { kind: 'text', value };
}

/**
 * `xmlns:inkml` declaration for the ink root.
 *
 * @returns {NamespaceDeclaration} The result.
 */
export function inkmlNamespaceDecl(): NamespaceDeclaration {
    return { prefix: INK_PREFIX, namespaceUri: INKML_NAMESPACE };
}

/**
 * Read attribute by local name (optional namespace filter).
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @param {string | undefined} namespaceUri - The namespace uri.
 * @returns {string | undefined} The result.
 */
export function getAttr(
    el: OpenXmlElement,
    localName: string,
    namespaceUri?: string
): string | undefined {
    for (const a of el.attributes) {
        if (a.localName !== localName) {
            continue;
        }
        if (namespaceUri !== undefined && a.namespaceUri !== namespaceUri) {
            continue;
        }
        return a.value;
    }
    // xml:id may appear as prefixed without namespace resolution in hand-built trees
    if (localName === 'id') {
        for (const a of el.attributes) {
            if (a.localName === 'id' && (a.prefix === 'xml' || a.namespaceUri === XML_NAMESPACE)) {
                return a.value;
            }
        }
    }
    return undefined;
}

/**
 * Concatenate descendant text of an element.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {string} The result.
 */
export function elementText(el: OpenXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            out += child.value;
        } else {
            out += elementText(child);
        }
    }
    return out;
}

/**
 * Direct element children in document order (optional namespace filter).
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string | undefined} localName - The local name.
 * @param {string} namespaceUri - The namespace uri.
 * @returns {OpenXmlElement[]} The result.
 */
export function elementChildren(
    el: OpenXmlElement,
    localName?: string,
    namespaceUri: string = INKML_NAMESPACE
): OpenXmlElement[] {
    const result: OpenXmlElement[] = [];
    for (const child of el.children) {
        if (child.kind !== 'element') {
            continue;
        }
        if (namespaceUri !== '' && child.namespaceUri !== namespaceUri && child.namespaceUri !== '') {
            // Allow empty namespaceUri for hand-built / defaulted fixtures when local names match InkML.
            if (child.namespaceUri !== INKML_NAMESPACE && namespaceUri === INKML_NAMESPACE) {
                // still accept un-namespaced ink fixtures if localName matches
                if (localName !== undefined && child.localName !== localName) {
                    continue;
                }
                if (localName === undefined) {
                    // only accept if it looks like ink content (caller filters)
                }
            }
        }
        if (localName !== undefined && child.localName !== localName) {
            continue;
        }
        if (
            namespaceUri === INKML_NAMESPACE &&
      child.namespaceUri !== INKML_NAMESPACE &&
      child.namespaceUri !== ''
        ) {
            continue;
        }
        result.push(child);
    }
    return result;
}

/**
 * Whether an element is in the InkML namespace (or un-namespaced fixture).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {boolean} The result.
 */
export function isInkMlElement(el: OpenXmlElement): boolean {
    return el.namespaceUri === INKML_NAMESPACE || el.namespaceUri === '';
}

export { XML_NAMESPACE, XMLNS_NAMESPACE, INKML_NAMESPACE, INK_PREFIX };
