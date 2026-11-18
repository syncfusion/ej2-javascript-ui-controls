import { arrayAt } from '../../core/util/es5-compat';
/**
 * Count `r:id` attribute references under a host-part document root.
 *
 * @remarks
 * Clear deletes a relationship only when no remaining `r:id` on the part equals
 * the cleared hyperlink's Id. Walk is host-root scoped (slide), not package-global.
 * Citation: `docs/specs/015-hyperlinks.md` clear + relationship lifetime.
 *
 * @internal
 */
import { OFFICE_REL_ATTR_NS } from '../../core/presentation/constants';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../../core/xml/dom';
/**
 * Counts attributes with office relationship NS local name `id` equal to `rId`.
 *
 * @internal
 * @param {OoxmlElement} root - Host part document element (e.g. `slide.getRoot()`).
 * @param {string} rId - Relationship Id string to count.
 * @returns {number} Non-negative reference count.
 */
export function countRelationshipIdReferences(root: OoxmlElement, rId: string): number {
    let count: number = 0;
    walk(root, (el: OoxmlElement) => {
        for (let i: number = 0; i < el.attributes.length; i++) {
            const a: OoxmlAttribute = arrayAt(el.attributes, i);
            if (a.namespaceUri === OFFICE_REL_ATTR_NS && a.localName === 'id' && a.value === rId) {
                count += 1;
            }

        }
    });
    return count;
}
/**
 *
 * @param {OoxmlElement | OoxmlText} node - The node value.
 * @param {*} visit - The visit value.
 * @returns {void} Nothing.
 */
function walk(node: OoxmlElement | OoxmlText, visit: (el: OoxmlElement) => void): void {
    if (node.kind !== 'element') {
        return;
    }
    visit(node);
    for (let i: number = 0; i < node.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(node.children, i);
        walk(child, visit);

    }
}
