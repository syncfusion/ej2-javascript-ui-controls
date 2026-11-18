/**
 * Structural equality of preserved XML trees.
 */

import { OpenXmlElement, OpenXmlChild, OpenXmlAttribute } from '../openxml';

/**
 * Compares two XML nodes structurally (names, attributes, children, text).
 *
 * @param {OpenXmlChild} a First node.
 * @param {OpenXmlChild} b Second node.
 * @returns {boolean} True when both nodes are structurally identical.
 * @private
 */
export function xmlEqual(a: OpenXmlChild, b: OpenXmlChild): boolean {
    if (a.kind === 'text' || b.kind === 'text') {
        return a.kind === b.kind && (a as { value: string }).value === (b as { value: string }).value;
    }
    const x: OpenXmlElement = a;
    const y: OpenXmlElement = b;
    return x.namespaceUri === y.namespaceUri && x.localName === y.localName
        && x.attributes.length === y.attributes.length
        && x.attributes.every((at: OpenXmlAttribute, i: number) => at.localName === y.attributes[i as number].localName
            && at.namespaceUri === y.attributes[i as number].namespaceUri && at.value === y.attributes[i as number].value)
        && x.children.length === y.children.length
        && x.children.every((c: OpenXmlChild, i: number) => xmlEqual(c, y.children[i as number]));
}
