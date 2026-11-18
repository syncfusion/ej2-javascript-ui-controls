import { ownerNamespace } from '../xml/office-dialect';
import { arrayAt } from '../util/es5-compat';
/**
 * Shared OOXML element helpers for shape and text walks.
 */
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
/**
 * Runtime-mutable view of an {@link OoxmlElement} used for in-place DOM edits.
 *
 * @remarks
 * The XML parse tree is structurally frozen at the type level; mutation paths cast to
 * this shape so `a:t` text can be updated without rebuilding the entire slide.
 *
 * @internal
 */
export interface MutableOoxmlElement {
    kind: 'element';
    namespaceUri: string;
    localName: string;
    attributes: OoxmlElement['attributes'];
    children: Array<OoxmlElement | OoxmlText>;
    prefixHint?: string;
    /** Original xmlns declarations retained for MC prefix-token attributes. */
    namespaceDeclarations?: OoxmlElement['namespaceDeclarations'];
}
/**
 * @internal
 * @param {OoxmlElement} el - The el value.
 * @returns {MutableOoxmlElement} The result.
 */
export function asMutable(el: OoxmlElement): MutableOoxmlElement {
    return el as unknown as MutableOoxmlElement;
}
/**
 * @internal
 * @param {OoxmlElement} parent - The parent value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findChild(parent: OoxmlElement, namespaceUri: string, localName: string): OoxmlElement | undefined {
    namespaceUri = ownerNamespace(parent.namespaceUri, namespaceUri);
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' &&
            child.namespaceUri === namespaceUri &&
            child.localName === localName) {
            return child;
        }

    }
    return undefined;
}
/**
 * @internal
 * @param {OoxmlElement} el - The el value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {string | undefined} The result.
 */
export function getAttr(el: OoxmlElement, namespaceUri: string, localName: string): string | undefined {
    namespaceUri = ownerNamespace(el.namespaceUri, namespaceUri);
    for (let i: number = 0; i < el.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(el.attributes, i);
        if (a.namespaceUri === namespaceUri && a.localName === localName) {
            return a.value;
        }

    }
    return undefined;
}
/**
 * Concatenates direct text-node children of an element.
 *
 * @internal
 * @param {OoxmlElement} el - The el value.
 * @returns {string} The result.
 */
export function collectDirectText(el: OoxmlElement): string {
    let out: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'text') {
            out += child.text;
        }

    }
    return out;
}
