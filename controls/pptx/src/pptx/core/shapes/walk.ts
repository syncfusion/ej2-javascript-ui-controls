import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { arrayAt } from '../util/es5-compat';
/**
 * Walk `p:spTree` / nested `p:grpSp` collecting shape handles with security limits.
 *
 * @remarks
 * **Depth rule (normative, locked):** `p:spTree` is entered at `groupDepth = 0` and
 * does **not** consume a nesting level. Each nested `p:grpSp` uses
 * `nextDepth = groupDepth + 1` and throws {@link Error} when
 * `nextDepth > limits.groupNestingDepth`. A single `grpSp` under `spTree` is depth **1**;
 * default `groupNestingDepth` is **64**.
 *
 * Cycle detection: a visited set on the current recursive path fails closed with
 * {@link Error} if the same element is re-entered.
 *
 * Citation: `docs/specs/017-group-navigate-depth.md`; Transitional `pml.xsd`
 * `CT_GroupShape`; `src/pptx/core/security/limits.ts` defaults.
 */
import { PictureMediaAccess } from '../pictures/media-access';
import { PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { PML_NS } from '../presentation/constants';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { DML_NS } from './constants';
import { findChild, getAttr } from './dom-utils';
import { partNameOptions, ShapeTreeCycleError } from './errors';
import { Shape, ShapeElementKind } from './shape';
/** Local names counted toward `shapesPerSlide` and identity. */
const SHAPE_KINDS: ReadonlySet<string> = new Set([
    'sp',
    'grpSp',
    'pic',
    'cxnSp',
    'graphicFrame',
    'contentPart'
]);
/**
 * Context for materializing shapes under a group-like parent.
 *
 * @internal
 */
export interface ShapeWalkContext {
    /** Existing enclosing group containers, outermost first; shared by siblings. */
    readonly groupAncestors?: ReadonlyArray<OoxmlElement>;
    readonly limits: SecurityLimits;
    readonly partName?: string;
    readonly media?: PictureMediaAccess;
    /** Optional mutation hook forwarded to materialised {@link Shape} handles. */
    readonly onMutate?: () => void;
    /**
     * Host part document element (`p:sld` / layout / master root) for picture
     * retarget DOM refcount and foreign-handle checks.
     */
    readonly hostRoot?: OoxmlElement;
}
/**
 * Loads shapes from a slide root element (`p:sld`).
 *
 * @throws {Error} When shape count or group depth is exceeded.
 * @throws {Error} When a cyclic group graph is detected.
 * @remarks `p:spTree` is required on a normal slide `cSld` per schema; if absent the walk returns an empty list (caller may treat as no
 * shapes). Nested `grpSp` depth is counted from 1 at the first group under `spTree` (spTree itself is not a group nesting level for the
 * limit — only nested `p:grpSp` elements). Spec: pml group-shape content; `cNvPr` → `CT_NonVisualDrawingProps` (`@id`, `@name`).
 * @internal
 * @param {OoxmlElement} slideRoot - Parsed slide document element.
 * @param {SecurityLimits} limits - Security limits (`shapesPerSlide`, `groupNestingDepth`).
 * @param {string} partName - Slide part name for diagnostics.
 * @param {PictureMediaAccess} media - Optional package access for picture blip resolve.
 * @param {*} onMutate - Optional mutation hook forwarded to shape/text handles.
 * @returns {Shape[]} Shapes in document (z-order) walk order, depth-first.
 */
export function walkSlideShapeTree(slideRoot: OoxmlElement, limits: SecurityLimits, partName?: string, media?: PictureMediaAccess,
                                   onMutate?: () => void): Shape[] {
    if (slideRoot.namespaceUri !== PML_NS &&
        slideRoot.namespaceUri !== 'http://purl.oclc.org/ooxml/presentationml/main') { return []; }
    const cSld: OoxmlElement = findChild(slideRoot, slideRoot.namespaceUri, 'cSld');
    if (cSld === undefined) {
        return [];
    }
    const spTree: OoxmlElement = findChild(cSld, slideRoot.namespaceUri, 'spTree');
    if (spTree === undefined) {
        return [];
    }
    const shapes: Shape[] = [];
    const ctx: ShapeWalkContext = {
        limits,
        ...partNameOptions(partName),
        ...(media === undefined ? {} : { media }),
        ...(onMutate === undefined ? {} : { onMutate }),
        groupAncestors: [spTree],
        hostRoot: slideRoot
    };
    // spTree is CT_GroupShape-like; children may nest groups. Depth 0 at spTree body.
    walkGroupChildren(spTree, 0, ctx, shapes, new Set());
    return shapes;
}
/**
 * Direct identifiable shape children of a group-like parent, document order.
 *
 * @throws {Error} When a direct child `grpSp` would exceed depth, or when materializing children would exceed `shapesPerSlide`
 * for this local list.
 * @throws {Error} When a cycle is detected on the path.
 * @remarks Child `grpSp` nodes are checked at `groupDepth + 1`. Nested descendants are **not** walked here — callers use {@link
 * Shape.children} recursively or the flat slide walk.
 * @internal
 * @param {OoxmlElement} parent - `p:spTree` or `p:grpSp` element.
 * @param {number} groupDepth - Walk depth of `parent` (`0` for `spTree`; group’s own depth for `grpSp`).
 * @param {ShapeWalkContext} ctx - Limits, part name, media.
 * @returns {Shape[]} Direct child {@link Shape} handles (not flattened descendants).
 */
export function listDirectShapeChildren(parent: OoxmlElement, groupDepth: number, ctx: ShapeWalkContext): Shape[] {
    const shapes: Shape[] = [];
    const path: Set<OoxmlElement> = new Set<OoxmlElement>();
    path.add(parent);
    collectDirectShapeChildren(parent, groupDepth, ctx, shapes, path, /* recurseGroups */ false);
    return shapes;
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {number} groupDepth - The groupDepth value.
 * @param {ShapeWalkContext} ctx - The ctx value.
 * @param {Shape[]} shapes - The shapes value.
 * @param {Set<OoxmlElement>} path - The path value.
 * @returns {void} Nothing.
 */
function walkGroupChildren(parent: OoxmlElement, groupDepth: number, ctx: ShapeWalkContext, shapes: Shape[],
                           path: Set<OoxmlElement>): void {
    if (path.has(parent)) {
        throw new ShapeTreeCycleError('Shape tree contains a cyclic group structure', partNameOptions(ctx.partName));
    }
    path.add(parent);
    try {
        collectDirectShapeChildren(parent, groupDepth, ctx, shapes, path, /* recurseGroups */ true);
    }
    finally {
        path.delete(parent);
    }
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {number} groupDepth - The groupDepth value.
 * @param {ShapeWalkContext} ctx - The ctx value.
 * @param {Shape[]} shapes - The shapes value.
 * @param {Set<OoxmlElement>} path - The path value.
 * @param {boolean} recurseGroups - The recurseGroups value.
 * @returns {void} Nothing.
 */
function collectDirectShapeChildren(parent: OoxmlElement, groupDepth: number, ctx: ShapeWalkContext, shapes: Shape[],
                                    path: Set<OoxmlElement>, recurseGroups: boolean): void {
    if (parent.namespaceUri !== PML_NS && parent.namespaceUri !== 'http://purl.oclc.org/ooxml/presentationml/main') { return; }
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind !== 'element') {
            continue;
        }
        if (child.namespaceUri !== parent.namespaceUri) {
            // Preserve foreign children; do not count toward shape limits.
            continue;
        }
        if (!SHAPE_KINDS.has(child.localName)) {
            // nvGrpSpPr, grpSpPr, extLst, etc.
            continue;
        }
        if (path.has(child)) {
            throw new ShapeTreeCycleError('Shape tree contains a cyclic group structure', partNameOptions(ctx.partName));
        }
        const kind: ShapeElementKind = child.localName as ShapeElementKind;
        if (kind === 'grpSp') {
            const nextDepth: number = groupDepth + 1;
            if (nextDepth > ctx.limits.groupNestingDepth) {
                throw new PackageLimitError('groupNestingDepth', ctx.partName === undefined
                    ? { actual: nextDepth }
                    : { partName: ctx.partName, actual: nextDepth });
            }
            pushShapeIfIdentifiable(child, kind, nextDepth, ctx, shapes);
            if (recurseGroups) {
                walkGroupChildren(child, nextDepth, { ...ctx,
                    groupAncestors: (ctx.groupAncestors || []).concat([child]) }, shapes, path);
            }
            continue;
        }
        pushShapeIfIdentifiable(child, kind, groupDepth, ctx, shapes);

    }
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {ShapeElementKind} kind - The kind value.
 * @param {number} groupDepth - The groupDepth value.
 * @param {ShapeWalkContext} ctx - The ctx value.
 * @param {Shape[]} shapes - The shapes value.
 * @returns {void} Nothing.
 */
function pushShapeIfIdentifiable(el: OoxmlElement, kind: ShapeElementKind, groupDepth: number, ctx: ShapeWalkContext,
                                 shapes: Shape[]): void {
    const identity: { readonly id: string; readonly name: string; } = readCNvPrIdentity(el, kind);
    if (identity === undefined) {
        // Malformed or incomplete non-visual props — skip listing without counting.
        return;
    }
    // Count only identifiable shape-like nodes toward shapesPerSlide.
    if (shapes.length >= ctx.limits.shapesPerSlide) {
        const actual: number = shapes.length + 1;
        throw new PackageLimitError('shapesPerSlide', ctx.partName === undefined ? { actual } : { partName: ctx.partName, actual });
    }
    shapes.push(Shape.create(el, kind, identity.id, identity.name, ctx.limits, ctx.partName, ctx.media, groupDepth,
                             ctx.onMutate, ctx.hostRoot, ctx.groupAncestors)); 
}
/**
 * Resolves cNvPr under the kind-specific non-visual container.
 *
 * Paths (Transitional PML):
 * - sp: nvSpPr/cNvPr
 * - grpSp: nvGrpSpPr/cNvPr
 * - pic: nvPicPr/cNvPr
 * - cxnSp: nvCxnSpPr/cNvPr
 * - graphicFrame: nvGraphicFramePr/cNvPr
 *
 * @param {OoxmlElement} el - The el value.
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {*} Identity id/name, or undefined when cNvPr is missing.
 */
function readCNvPrIdentity(el: OoxmlElement, kind: ShapeElementKind): {
    readonly id: string;
    readonly name: string;
} | undefined {
    const nvLocal: string = nvContainerLocalName(kind);
    const nv: OoxmlElement = findChild(el, el.namespaceUri, nvLocal);
    if (nv === undefined) {
        return undefined;
    }
    // cNvPr is DrawingML in schema; in instance markup it is typically in PML default
    // xmlns on transitional slides (p:cNvPr) or a:cNvPr depending on prefix. Accept both.
    let cNvPr: OoxmlElement | undefined = findChild(nv, el.namespaceUri, 'cNvPr');
    if (cNvPr === undefined) {
        cNvPr = findChild(nv, getGradientDrawingNamespace(el.namespaceUri) || DML_NS, 'cNvPr');
    }
    if (cNvPr === undefined) {
        cNvPr = findChild(nv, '', 'cNvPr');
    }
    if (cNvPr === undefined) {
        return undefined;
    }
    const id: string = getAttr(cNvPr, '', 'id');
    const name: string = getAttr(cNvPr, '', 'name');
    if (id === undefined || name === undefined) {
        return undefined;
    }
    return { id, name };
}
/**
 *
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {string} The result.
 */
function nvContainerLocalName(kind: ShapeElementKind): string {
    switch (kind) {
    case 'sp':
        return 'nvSpPr';
    case 'grpSp':
        return 'nvGrpSpPr';
    case 'pic':
        return 'nvPicPr';
    case 'cxnSp':
        return 'nvCxnSpPr';
    case 'graphicFrame':
        return 'nvGraphicFramePr';
    case 'contentPart':
        return 'nvContentPartPr';
    default: {
        const _exhaustive: never = kind;
        return _exhaustive;
    }
    }
}
