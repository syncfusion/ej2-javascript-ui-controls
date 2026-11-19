import { OoxmlElement, OoxmlText, OoxmlAttribute, OoxmlNamespaceDeclaration } from '../xml/dom';
import { asMutable, findChild } from '../shapes/dom-utils';
import { ShapeTextError, partNameOptions } from '../shapes/errors';

/**
 * @param {OoxmlElement} element - Boundary regular run.
 * @param {string} ns - Exact owning dialect.
 * @param {string | undefined} partName - Diagnostic part.
 * @returns {void} Rejects unknown run-level metadata rather than duplicating its identity semantics.
 */
export function assertSplittable(element: OoxmlElement, ns: string, partName: string | undefined): void {
    const children: OoxmlElement[] = element.children.filter((child: OoxmlElement | OoxmlText): child is OoxmlElement =>
        child.kind === 'element');
    const text: OoxmlElement | undefined = findChild(element, ns, 't');
    if (!text || text.children.some((child: OoxmlElement | OoxmlText): boolean => child.kind !== 'text') ||
        element.localName !== 'r' || element.attributes.length !== 0 || children.some((child: OoxmlElement): boolean =>
        child.namespaceUri !== ns || (child.localName !== 'rPr' && child.localName !== 't')) ||
        children.filter((child: OoxmlElement): boolean => child.localName === 't').length !== 1 ||
        children.filter((child: OoxmlElement): boolean => child.localName === 'rPr').length > 1) {
        throw new ShapeTextError('Unsupported run metadata cannot be split safely', partNameOptions(partName));
    }
}
/**
 * @param {OoxmlElement} element - Source node; unknown QName bindings stay intact.
 * @returns {OoxmlElement} Independent detached clone, never a shared mutable fill subtree.
 */
export function cloneElement(element: OoxmlElement): OoxmlElement {
    const attributes: OoxmlAttribute[] = element.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute => ({ ...attribute }));
    const children: (OoxmlElement | OoxmlText)[] = element.children.map((child: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
        child.kind === 'text' ? { kind: 'text', text: child.text } : cloneElement(child));
    const namespaceDeclarations: OoxmlNamespaceDeclaration[] | undefined = element.namespaceDeclarations === undefined ? undefined :
        element.namespaceDeclarations.map((declaration: OoxmlNamespaceDeclaration): OoxmlNamespaceDeclaration => ({ ...declaration }));
    return { ...element, attributes, children, ...(namespaceDeclarations === undefined ? {} : { namespaceDeclarations }) };
}
/**
 * @param {OoxmlElement} run - Detached regular run.
 * @param {string} text - Exact source slice; no surrogate boundary is introduced by canonical ranges.
 * @returns {void} Updates only a:t data; xsd:string preserves edge whitespace without added attributes.
 */
export function setText(run: OoxmlElement, text: string): void {
    const value: OoxmlElement | undefined = findChild(run, run.namespaceUri, 't');
    if (!value) { throw new ShapeTextError('Regular text run has no text carrier'); }
    asMutable(value).children = [{ kind: 'text', text }];
}
