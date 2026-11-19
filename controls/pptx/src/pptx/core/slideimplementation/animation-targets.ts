/**
 * Animation-target predicate for shape delete refuse policy.
 *
 * @remarks
 * Citation: Transitional `pml.xsd` `CT_TLShapeTargetElement` §19.5.72 —
 * `p:spTgt/@spid` references drawing element ids under `p:timing`.
 *
 * @packageDocumentation
 */
import { PML_NS } from '../presentation/constants';
import { OoxmlElement } from '../xml/index';
import { OoxmlAttribute, OoxmlText } from '../xml/dom';
/**
 * Returns whether any `p:spTgt/@spid` under the host root cites `shapeId`.
 *
 * @internal
 * @param {OoxmlElement} slideRoot - Host part document element (`p:sld`, master, or layout).
 * @param {number} shapeId - Drawing element id as a non-negative integer.
 * @returns {boolean} The result.
 */
export function hasAnimationTargets(slideRoot: OoxmlElement, shapeId: number): boolean {
    const timing: OoxmlElement = slideRoot.children.find((child: OoxmlElement | OoxmlText): child is OoxmlElement => child.kind === 'element' && child.namespaceUri === PML_NS && child.localName === 'timing');
    return timing === undefined ? false : hasAnimationTargetInTree(timing, String(shapeId));
}
/**
 *
 * @param {OoxmlElement} node - The node value.
 * @param {string} shapeId - The shapeId value.
 * @returns {boolean} The result.
 */
function hasAnimationTargetInTree(node: OoxmlElement, shapeId: string): boolean {
    if (node.namespaceUri === PML_NS && node.localName === 'spTgt') {
        const spidAttr: OoxmlAttribute = node.attributes.find((attribute: OoxmlAttribute) => attribute.namespaceUri === '' &&
            attribute.localName === 'spid');
        const spid: string = spidAttr != null ? spidAttr.value : undefined;
        if (spid === shapeId) {
            return true;
        }
    }
    return node.children.some((child: OoxmlElement | OoxmlText): child is OoxmlElement => child.kind === 'element' &&
        hasAnimationTargetInTree(child, shapeId));
}
