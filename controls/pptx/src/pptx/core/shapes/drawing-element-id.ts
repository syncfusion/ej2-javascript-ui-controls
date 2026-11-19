import { arrayAt } from '../util/es5-compat';
/**
 * Drawing element id (`cNvPr/@id` / `ST_DrawingElementId`) allocation.
 *
 * @remarks
 * Policy: next id = max(existing numeric ids on the slide) + 1.
 * Empty slide whose `spTree` group already uses `id="1"` therefore yields `"2"`.
 * Existing ids are **never** renumbered (animation, hyperlinks, comments).
 *
 * Citation: Transitional `dml-main.xsd` `ST_DrawingElementId` = `xsd:unsignedInt`
 * (~746); `CT_NonVisualDrawingProps` `@id` required (~816);
 * `docs/specs/013-create-skeleton.md` ID allocators.
 */
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { getAttr } from './dom-utils';
/**
 * Maximum value for `ST_DrawingElementId` (`xsd:unsignedInt`).
 *
 * Citation: XML Schema unsignedInt maxInclusive 4294967295.
 */
export const ST_DRAWING_ELEMENT_ID_MAX: number = 4294967295;
/**
 * Collects every authored drawing id and animation target id under a slide (or
 * any) element tree.
 *
 * @remarks Includes the `spTree` group root `nvGrpSpPr/cNvPr` (often `id="1"`) and ids nested under groups,
     MC fallbacks, or unknown containers. Animation timing `p:spTgt/@spid` values are included because they reserve the referenced shape id even when the corresponding shape is not present in the current tree. Walk identity for {@link walkSlideShapeTree} alone is **not** sufficient — the group tree id is not listed as a shape.
 * @internal
 * @param {OoxmlElement} root - Typically the slide document element (`p:sld`).
 * @returns {string[]} Authored id strings in document walk order (may include duplicates).
 */
export function collectDrawingElementIds(root: OoxmlElement): string[] {
    const out: string[] = [];
    walkCollect(root, out);
    return out;
}
/**
 * Next unique `cNvPr/@id` for a shape added to this slide.
 *
 * @throws {RangeError} When the next id would exceed `ST_DrawingElementId` max.
 * @remarks Non-decimal id strings are skipped when computing max (same spirit as slide id allocation). Callers must not rewrite existing
 * `cNvPr` nodes.
 * @param {OoxmlElement} slideRoot - Parsed slide root (`p:sld`) or any subtree root that owns ids.
 * @returns {string} Decimal string of max(existing numeric ids) + 1, or `"1"` when none.
 */
export function allocateNextDrawingElementId(slideRoot: OoxmlElement): string {
    const ids: Array<string> = collectDrawingElementIds(slideRoot);
    let maxId: number = 0;
    let foundNumeric: boolean = false;
    for (let i: number = 0; i < ids.length; i++) {
        const id: string = arrayAt(ids, i);
        if (!/^\d+$/u.test(id)) {
            continue;
        }
        const n: number = Number(id);
        if (!Number.isSafeInteger(n) || n < 0) {
            continue;
        }
        // unsignedInt may exceed Number.MAX_SAFE_INTEGER only above 2^53-1; still
        // compare safely within JS safe integers up to 2^32-1 for this type.
        if (n > ST_DRAWING_ELEMENT_ID_MAX) {
            continue;
        }
        foundNumeric = true;
        if (n > maxId) {
            maxId = n;
        }

    }
    const next: number = foundNumeric ? maxId + 1 : 1;
    if (next > ST_DRAWING_ELEMENT_ID_MAX) {
        throw new RangeError(`Cannot allocate ST_DrawingElementId: next value ${String(next)} exceeds ${String(ST_DRAWING_ELEMENT_ID_MAX)}`);
    }
    return String(next);
}
/**
 *
 * @param {OoxmlElement} node - The node value.
 * @param {string[]} out - The out value.
 * @returns {void} Nothing.
 */
function walkCollect(node: OoxmlElement, out: string[]): void {
    if (node.localName === 'cNvPr') {
        const id: string = getAttr(node, '', 'id');
        if (id !== undefined) {
            out.push(id);
        }
    }
    if (node.localName === 'spTgt') {
        const spid: string = getAttr(node, '', 'spid');
        if (spid !== undefined) {
            out.push(spid);
        }
    }
    for (let i: number = 0; i < node.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(node.children, i);
        if (child.kind === 'element') {
            walkCollect(child, out);
        }

    }
}
