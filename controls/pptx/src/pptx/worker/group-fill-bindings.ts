/** Exact owner bindings for explicit group references; no detached XML parsing. */
import { OoxmlElement, OoxmlText } from '../core/xml/dom';
import { findChild, getAttr } from '../core/shapes/dom-utils';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { DEFAULT_SECURITY_LIMITS } from '../core/security/limits';
import { PackageLimitError } from '../core/security/errors';
import { arrayAt } from '../core/util/es5-compat';
/** Bindable explicit reference; ancestor ids are outermost first, including spTree. @internal */
export interface GroupFillBinding {
    readonly id: string;
    readonly ancestors: ReadonlyArray<string | undefined>;
}
/**
 * Collects only actual, exact-namespace group-tree shapes. Foreign and MC branches
 * remain unbound. Duplicate identities are withheld; no RGB or fill geometry is copied.
 *
 * @param {OoxmlElement} root - Already parsed complete part.
 * @param {string} partName - Owning package part.
 * @param {number} maxDepth - Existing group nesting limit (spTree counts as zero).
 * @returns {ReadonlyArray<GroupFillBinding>} Clone-safe explicit reference identities.
 * @internal
 */
export function readGroupFillBindings(root: OoxmlElement, partName: string,
                                      maxDepth: number = DEFAULT_SECURITY_LIMITS.groupNestingDepth): ReadonlyArray<GroupFillBinding> {
    const ns: string = root.namespaceUri;
    if (ns !== 'http://schemas.openxmlformats.org/presentationml/2006/main' &&
        ns !== 'http://purl.oclc.org/ooxml/presentationml/main') { return []; }
    const common: OoxmlElement | undefined = findChild(root, ns, 'cSld');
    const tree: OoxmlElement | undefined = common === undefined ? undefined : findChild(common, ns, 'spTree');
    if (tree === undefined) { return []; }
    const drawing: string | undefined = getGradientDrawingNamespace(ns);
    if (drawing === undefined) { return []; }
    const counts: Map<string, number> = new Map();
    const result: GroupFillBinding[] = [];
    /**
     * @param {OoxmlElement} shape - Shape or root group container.
     * @returns {string | undefined} Exact non-visual id.
     */
    function identity(shape: OoxmlElement): string | undefined {
        const name: string = shape.localName === 'sp' ? 'nvSpPr' : shape.localName === 'cxnSp' ? 'nvCxnSpPr' :
            shape.localName === 'pic' ? 'nvPicPr' : shape.localName === 'graphicFrame' ? 'nvGraphicFramePr' :
                shape.localName === 'contentPart' ? 'nvContentPartPr' : 'nvGrpSpPr';
        const nv: OoxmlElement | undefined = findChild(shape, ns, name);
        const value: OoxmlElement | undefined = nv === undefined ? undefined : findChild(nv, ns, 'cNvPr');
        return value === undefined ? undefined : getAttr(value, '', 'id');
    }
    /**
     * @param {OoxmlElement} container - Root or nested group.
     * @param {ReadonlyArray<string | undefined>} ancestors - Existing parent group ids.
     * @param {number} depth - Existing group depth.
     * @returns {void} Appends only first-selected group fill choices.
     */
    function visit(container: OoxmlElement, ancestors: ReadonlyArray<string | undefined>, depth: number): void {
        const owner: ReadonlyArray<string | undefined> = ancestors.concat([identity(container)]);
        for (let i: number = 0; i < container.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(container.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== ns ||
                ['sp', 'cxnSp', 'pic', 'grpSp', 'graphicFrame', 'contentPart'].indexOf(child.localName) < 0) { continue; }
            const id: string | undefined = identity(child);
            if (id !== undefined) { counts.set(id, (counts.get(id) || 0) + 1); }
            const properties: OoxmlElement | undefined = findChild(child, ns, child.localName === 'grpSp' ? 'grpSpPr' : 'spPr');
            if (id !== undefined && properties !== undefined) {
                for (let j: number = 0; j < properties.children.length; j++) {
                    const fill: OoxmlElement | OoxmlText = arrayAt(properties.children, j);
                    if (fill.kind !== 'element' || fill.namespaceUri !== drawing ||
                        ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'].indexOf(fill.localName) < 0) { continue; }
                    if (fill.localName === 'grpFill') { result.push({ id, ancestors: owner }); }
                    break;
                }
            }
            if (child.localName === 'grpSp') {
                if (depth + 1 > maxDepth) { throw new PackageLimitError('groupNestingDepth', { partName, actual: depth + 1 }); }
                visit(child, owner, depth + 1);
            }
        }
    }
    const treeId: string | undefined = identity(tree);
    if (treeId !== undefined) { counts.set(treeId, 1); }
    visit(tree, [], 0);
    return result.filter((item: GroupFillBinding): boolean => counts.get(item.id) === 1 &&
        item.ancestors.every((id: string | undefined): boolean => id === undefined || counts.get(id) === 1));
}
