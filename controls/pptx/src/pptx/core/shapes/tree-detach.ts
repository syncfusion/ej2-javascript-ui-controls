import { arrayAt } from '../util/es5-compat';
/**
 * Shared shape-tree parent lookup and direct-child detach.
 *
 * @remarks
 * Used by picture remove, generic {@link removeShapeFromSlide}, and keeps
 * splice logic out of optional feature modules. Never renumbers `cNvPr/@id`.
 *
 * @packageDocumentation
 */
import { OoxmlElement, OoxmlText } from '../xml/index';
import { asMutable, MutableOoxmlElement } from './dom-utils';
/**
 * True when `target` is `root` or appears under `root` in document order.
 *
 * @internal
 * @param {OoxmlElement} root - The root value.
 * @param {OoxmlElement} target - The target value.
 * @returns {boolean} The result.
 */
export function isDescendantOf(root: OoxmlElement, target: OoxmlElement): boolean {
    if (root === target) {
        return true;
    }
    let found: boolean = false;
    walkElements(root, (el: OoxmlElement) => {
        if (el === target) {
            found = true;
        }
    });
    return found;
}
/**
 * Returns the parent element of `child` under `root`, if any.
 *
 * @internal
 * @param {OoxmlElement} root - The root value.
 * @param {OoxmlElement} child - The child value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findParentElement(root: OoxmlElement, child: OoxmlElement): OoxmlElement | undefined {
    let parent: OoxmlElement | undefined;
    walkElements(root, (el: OoxmlElement) => {
        for (let i: number = 0; i < el.children.length; i++) {
            const c: OoxmlElement | OoxmlText = arrayAt(el.children, i);
            if (c === child) {
                parent = el;
            }

        }
    });
    return parent;
}
/**
 * Splices `child` out of `parent.children` when present.
 *
 * @internal
 * @param {OoxmlElement} parent - The parent value.
 * @param {OoxmlElement} child - The child value.
 * @returns {boolean} `true` when removed.
 */
export function removeDirectChild(parent: OoxmlElement, child: OoxmlElement): boolean {
    const mutable: MutableOoxmlElement = asMutable(parent);
    const idx: number = mutable.children.indexOf(child);
    if (idx < 0) {
        return false;
    }
    mutable.children.splice(idx, 1);
    return true;
}
/**
 * Depth-first walk of element nodes under `node` (including `node` when element).
 *
 * @internal
 * @param {OoxmlElement | OoxmlText} node - The node value.
 * @param {*} visit - The visit value.
 * @returns {void} Nothing.
 */
export function walkElements(node: OoxmlElement | OoxmlText, visit: (el: OoxmlElement) => void): void {
    if (node.kind !== 'element') {
        return;
    }
    visit(node);
    for (let i: number = 0; i < node.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(node.children, i);
        walkElements(child, visit);

    }
}
