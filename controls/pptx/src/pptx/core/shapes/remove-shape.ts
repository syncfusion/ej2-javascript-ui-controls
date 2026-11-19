/**
 * Generic shape remove (`ShapeCollection.remove`).
 *
 * @remarks
 * Algorithm (req/spec **040**, TASK-1093 lock):
 * 1. Identity: shape element must be under this host root.
 * 2. Placeholder `p:ph` → refuse ({@link Error}).
 * 3. `contentPart` / unsupported graphicFrame (OLE/unknown/chart/diagram without
 *    inline-only path) → refuse naming kind.
 * 4. Animation: every `cNvPr/@id` in the detach set (single node or full `grpSp`
 *    subtree) is checked with {@link hasAnimationTargets}; any hit →
 *    {@link Error} with **no** tree mutation.
 * 5. Kind switch:
 *    - `pic` → {@link removePictureFromSlide} (039 GC).
 *    - `sp` / `cxnSp` → detach only (dangling connector ends OK).
 *    - `graphicFrame` + table URI → detach frame only (inline `a:tbl`, no part GC).
 *    - `grpSp` → detach whole group; then 039-style GC for nested pics using
 *      blip rIds captured **before** detach.
 * 6. Never renumber remaining `cNvPr/@id`. Never rewrite `p:timing`.
 *
 * Citations: Transitional `pml.xsd` `CT_GroupShape` child choice; req **021**
 * timing refuse; **039** picture GC; TASK-1093 Progress lock notes.
 *
 * @packageDocumentation
 */
import { AnimationTargetError } from '../errors';
import { countOfficeRelationshipAttributeReferences, countPackageInternalTargetReferences,
    removePictureFromSlide } from '../pictures/remove-picture';
import { PictureMediaAccess, PictureMediaWriteAccess } from '../pictures/media-access';
import { readPictureBlipIds, PictureBlipIds } from '../pictures/read-picture';
import { DRAWINGML_TABLE_URI, ShapeType } from '../presentation/shapetype';
import { InvalidPackageError } from '../security/errors';
import { hasAnimationTargets } from '../slideimplementation/animation-targets';
import { OoxmlElement } from '../xml/index';
import { DML_NS } from './constants';
import { findChild, getAttr } from './dom-utils';
import { Shape, ShapeElementKind } from './shape';
import { findParentElement, isDescendantOf, removeDirectChild, walkElements } from './tree-detach';
import { Picture } from '../pictures/picture';
import { OoxmlAttribute, OoxmlText } from '../xml/dom';
import { PackageRelationship } from '../package/relationships';
/**
 * Arguments for {@link removeShapeFromSlide}.
 *
 * @internal
 */
import { stringIncludes, arrayAt } from '../util/es5-compat';
export interface RemoveShapeFromSlideArgs {
    /** Host part document element (`p:sld`). */
    readonly root: OoxmlElement;
    /** Absolute host part name (diagnostics). */
    readonly partName: string;
    /** Shape handle from this slide’s collection walk. */
    readonly shape: Shape;
    /** Media access required when removing pictures or groups that contain pics. */
    readonly media?: PictureMediaAccess;
    /** Optional dirty notification after successful remove. */
    readonly onMutate?: () => void;
}
/**
 * Removes a shape from the host slide shape tree per the locked **040** matrix.
 *
 * @throws {Error} Foreign/detached, placeholder, unsupported kind, or missing write access for picture GC.
 * @throws {Error} When any id in the detach set is cited by `p:spTgt/@spid` under `p:timing`.
 * @internal
 * @param {RemoveShapeFromSlideArgs} args - Host root, shape handle, optional media write for picture GC.
 * @returns {void} Nothing.
 */
export function removeShapeFromSlide(args: RemoveShapeFromSlideArgs): void {
    const { root, partName, shape } = args;
    const el: OoxmlElement = shape.getHostElement(); 
    if (!isDescendantOf(root, el)) {
        throw new InvalidPackageError('Shape is not on this slide', { partName });
    }
    if (shape.isPlaceholder) {
        throw new InvalidPackageError('Refusing to remove placeholder shape (p:ph); placeholders are refuse-by-default', { partName });
    }
    const kind: ShapeElementKind = shape.elementKind;
    assertSupportedKind(kind, shape, partName);
    const detachIds: Array<string> = collectSubtreeDrawingIds(el, kind);
    for (let i: number = 0; i < detachIds.length; i++) {
        const idStr: string = arrayAt(detachIds, i);
        if (!/^\d+$/u.test(idStr)) {
            continue;
        }
        const n: number = Number(idStr);
        if (!Number.isSafeInteger(n) || n < 0) {
            continue;
        }
        if (hasAnimationTargets(root, n)) {
            throw new AnimationTargetError(`Refusing to remove shape id "${idStr}": targeted by p:timing p:spTgt/@spid`);
        }

    }
    if (kind === 'pic') {
        const picture: Picture = shape.asPicture();
        if (picture === undefined) {
            throw new InvalidPackageError('Picture shape could not be bound for remove', { partName });
        }
        if (args.media === undefined || args.media.write === undefined) {
            throw new InvalidPackageError('Picture remove requires package write access on the slide', {
                partName
            });
        }
        const picArgs: {
            root: OoxmlElement;
            partName: string;
            media: PictureMediaAccess;
            picture: NonNullable<ReturnType<Shape['asPicture']>>;
            onMutate?: () => void;
        } = {
            root,
            partName,
            media: args.media,
            picture
        };
        if (args.onMutate !== undefined) {
            picArgs.onMutate = args.onMutate;
        }
        removePictureFromSlide(picArgs);
        return;
    }
    if (kind === 'grpSp') {
        removeGroupShape(args, el);
        return;
    }
    // sp | cxnSp | graphicFrame (table only after assertSupportedKind)
    detachElement(root, el, partName);
    if (args.onMutate != null) {
        args.onMutate();
    }
}
/**
 *
 * @param {ShapeElementKind} kind - The kind value.
 * @param {Shape} shape - The shape value.
 * @param {string} partName - The partName value.
 * @returns {void} Nothing.
 */
function assertSupportedKind(kind: ShapeElementKind, shape: Shape, partName: string): void {
    if (kind === 'contentPart') {
        throw new InvalidPackageError('Refusing to remove contentPart shape (ink/content part preserve-only)', { partName });
    }
    if (kind === 'graphicFrame') {
        const contentKind: ShapeType = shape.kind;
        if (contentKind === 'table' || isInlineTableFrame(shape.getHostElement())) { 
            return;
        }
        throw new InvalidPackageError(`Refusing to remove graphicFrame of kind "${contentKind}" via shapes.remove; ` +
            'use the feature-typed remove API for chart/diagram package GC, or an unlocked kind', { partName });
    }
}
/**
 *
 * @param {OoxmlElement} frame - The frame value.
 * @returns {boolean} The result.
 */
function isInlineTableFrame(frame: OoxmlElement): boolean {
    const graphic: OoxmlElement = findChild(frame, DML_NS, 'graphic');
    const graphicData: OoxmlElement = graphic != null
        ? graphic.children.find((child: OoxmlElement | OoxmlText): child is OoxmlElement => child.kind === 'element' &&
            child.localName === 'graphicData')
        : undefined;
    if (graphicData == null) {
        return false;
    }
    const uriAttr: OoxmlAttribute = graphicData.attributes.find((attribute: OoxmlAttribute) => attribute.namespaceUri === '' &&
        attribute.localName === 'uri');
    const uri: string = uriAttr != null ? uriAttr.value : undefined;
    return uri === DRAWINGML_TABLE_URI;
}
/**
 *
 * @param {RemoveShapeFromSlideArgs} args - The args value.
 * @param {OoxmlElement} groupEl - The groupEl value.
 * @returns {void} Nothing.
 */
function removeGroupShape(args: RemoveShapeFromSlideArgs, groupEl: OoxmlElement): void {
    const { root, partName } = args;
    // Capture nested picture blip rIds before the whole group leaves the tree.
    const nestedPicPlans: Array<{
        embed?: string;
        link?: string;
    }> = [];
    walkElements(groupEl, (node: OoxmlElement) => {
        if (node.localName !== 'pic') {
            return;
        }
        const blipIds: PictureBlipIds = readPictureBlipIds(node);
        nestedPicPlans.push({
            ...(blipIds.embedRelationshipId !== undefined
                ? { embed: blipIds.embedRelationshipId }
                : {}),
            ...(blipIds.linkRelationshipId !== undefined ? { link: blipIds.linkRelationshipId } : {})
        });
    });
    const needsMediaGc: boolean = nestedPicPlans.some((p: { embed?: string; link?: string; }) => p.embed !== undefined ||
        p.link !== undefined);
    if (needsMediaGc && (args.media === undefined || args.media.write === undefined)) {
        throw new InvalidPackageError('Group remove with nested pictures requires package write access on the slide', { partName });
    }
    detachElement(root, groupEl, partName);
    if (needsMediaGc && args.media !== undefined && args.media.write !== undefined) {
        garbageCollectPictureRIds(root, partName, args.media, nestedPicPlans);
    }
    if (args.onMutate != null) {
        args.onMutate();
    }
}
/**
 *
 * @param {OoxmlElement} root - The root value.
 * @param {OoxmlElement} el - The el value.
 * @param {string} partName - The partName value.
 * @returns {void} Nothing.
 */
function detachElement(root: OoxmlElement, el: OoxmlElement, partName: string): void {
    const parent: OoxmlElement = findParentElement(root, el);
    if (parent === undefined) {
        throw new InvalidPackageError('Shape element has no parent under the host root', {
            partName
        });
    }
    const removed: boolean = removeDirectChild(parent, el);
    if (!removed) {
        throw new InvalidPackageError('Failed to detach shape from its parent', { partName });
    }
}
/**
 * Collects authored `cNvPr/@id` values for the node being removed.
 * For groups, includes the group root and all descendant drawing ids.
 *
 * @param {OoxmlElement} el - The el value.
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {string[]} The result.
 */
function collectSubtreeDrawingIds(el: OoxmlElement, kind: ShapeElementKind): string[] {
    if (kind !== 'grpSp') {
        const id: string = readPrimaryCnvPrId(el, kind);
        return id === undefined ? [] : [id];
    }
    const out: string[] = [];
    walkElements(el, (node: OoxmlElement) => {
        if (node.localName === 'cNvPr') {
            const id: string = getAttr(node, '', 'id');
            if (id !== undefined) {
                out.push(id);
            }
        }
    });
    return out;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {string | undefined} The result.
 */
function readPrimaryCnvPrId(el: OoxmlElement, kind: ShapeElementKind): string | undefined {
    // nv*Pr → cNvPr is kind-specific; walk first cNvPr under the element is sufficient
    // for a single drawing node (and matches collection identity).
    void kind;
    let found: string | undefined;
    walkElements(el, (node: OoxmlElement) => {
        if (found !== undefined) {
            return;
        }
        if (node.localName === 'cNvPr') {
            found = getAttr(node, '', 'id');
        }
    });
    return found;
}
/**
 *
 * @param {OoxmlElement} root - The root value.
 * @param {string} partName - The partName value.
 * @param {PictureMediaAccess} media - The media value.
 * @param {*} plans - The plans value.
 * @returns {void} Nothing.
 */
function garbageCollectPictureRIds(root: OoxmlElement, partName: string, media: PictureMediaAccess, plans: ReadonlyArray<{
    embed?: string;
    link?: string;
}>): void {
    const write: PictureMediaWriteAccess = media.write;
    if (write === undefined) {
        return;
    }
    const candidateRIds: Set<string> = new Set<string>();
    for (let i: number = 0; i < plans.length; i++) {
        const p: { embed?: string; link?: string; } = arrayAt(plans, i);
        if (p.embed !== undefined) {
            candidateRIds.add(p.embed);
        }
        if (p.link !== undefined) {
            candidateRIds.add(p.link);
        }

    }
    const slideRels: ReadonlyArray<PackageRelationship> = media.getSlideRelationships();
    const droppedInternalTargets: Set<string> = new Set<string>();
    let relsChanged: boolean = false;
    let nextRels: ReadonlyArray<PackageRelationship> = slideRels;
    const candidateRIdList: string[] = Array.from(candidateRIds);
    for (let i: number = 0; i < candidateRIdList.length; i++) {
        const rId: string = arrayAt(candidateRIdList, i);
        if (countOfficeRelationshipAttributeReferences(root, rId) > 0) {
            continue;
        }
        const rel: PackageRelationship = nextRels.find((r: PackageRelationship) => r.id === rId);
        if (rel === undefined) {
            continue;
        }
        if (rel.targetMode === 'Internal' && rel.targetPartName !== undefined) {
            if (stringIncludes(rel.targetPartName, '..')) {
                throw new InvalidPackageError(`Refusing to garbage-collect media part with path traversal: "${rel.targetPartName}"`,
                                              { partName });
            }
            droppedInternalTargets.add(rel.targetPartName);
        }
        nextRels = nextRels.filter((r: PackageRelationship) => r.id !== rId);
        relsChanged = true;

    }
    if (relsChanged) {
        write.setSlideRelationships(nextRels);
    }
    const droppedTargets: string[] = Array.from(droppedInternalTargets);
    for (let i: number = 0; i < droppedTargets.length; i++) {
        const targetPartName: string = arrayAt(droppedTargets, i);
        if (countPackageInternalTargetReferences(write, targetPartName) > 0) {
            continue;
        }
        if (stringIncludes(targetPartName, '..')) {
            throw new InvalidPackageError(`Refusing to delete media part with path traversal: "${targetPartName}"`, { partName });
        }
        write.deletePart(targetPartName);
        write.removeContentTypeOverride(targetPartName);

    }
}
