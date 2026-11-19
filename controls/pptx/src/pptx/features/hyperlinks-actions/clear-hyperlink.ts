import { arrayAt } from '../../core/util/es5-compat';
/**
 * Clear hyperlink elements with relationship refcount deletion.
 *
 * @remarks
 * Removes the kind-specific `hlink*` child. Deletes the host-part relationship
 * only when no remaining `r:id` attribute on the host document root equals that
 * Id (shared-rId safe). Never fetches Targets. Citation:
 * `docs/specs/015-hyperlinks.md` clear + relationship lifetime.
 *
 * @packageDocumentation
 */
import { HostPartRelationshipAccess } from '../../core/package/host-part-relationship-access';
import { PackageRelationship } from '../../core/package/relationships';
import { Shape } from '../../core/shapes/shape';
import { TextPart } from '../../core/text/text-part';
import { OoxmlElement } from '../../core/xml/index';
import { HyperlinkMutationError } from './errors';
import { readHyperlinkRelationshipId, removeChildElement } from './hyperlink-dom';
import { RunHyperlinkKind } from './read-run-hyperlink';
import { ShapeHyperlinkKind } from './read-shape-hyperlink';
import { countRelationshipIdReferences } from './refcount-r-id';
import { locateRunHyperlink, locateShapeHyperlink } from './resolve-hyperlink-target';
/**
 * Clears a shape-level hyperlink and refcount-deletes its relationship when unused.
 *
 * @throws {HyperlinkMutationError} When the hyperlink element is missing.
 * @public
 * @param {Shape} target - Shape that owns the hyperlink markup.
 * @param {*} kind - The target value.
 * @param {ShapeHyperlinkKind} access - `click` or `hover`.
 * @param {HostPartRelationshipAccess} hostRoot - Live host-part relationship access.
 * @returns {void} Nothing.
 */
export function clearHyperlink(
    target: Shape | TextPart,
    kind: ShapeHyperlinkKind | RunHyperlinkKind,
    access: HostPartRelationshipAccess,
    hostRoot: OoxmlElement
): void {
    let parent: OoxmlElement | undefined;
    let element: OoxmlElement | undefined;
    if (isShape(target)) {
        const located: { readonly parent: OoxmlElement; readonly element: OoxmlElement; } =
            locateShapeHyperlink(target, kind as ShapeHyperlinkKind);
        if (located === undefined) {
            throw new HyperlinkMutationError('Shape cNvPr missing; cannot clear hyperlink', {
                partName: access.partName
            });
        }
        parent = located.parent;
        element = located.element;
    }
    else {
        const located: ReturnType<typeof locateRunHyperlink> = locateRunHyperlink(target, kind as RunHyperlinkKind);
        parent = located.parent;
        element = located.element;
    }
    if (parent === undefined || element === undefined) {
        throw new HyperlinkMutationError(`Hyperlink element missing for kind "${String(kind)}"; nothing to clear`,
                                         { partName: access.partName });
    }
    const rId: string = readHyperlinkRelationshipId(element);
    if (!removeChildElement(parent, element)) {
        throw new HyperlinkMutationError('Failed to remove hyperlink element from parent', {
            partName: access.partName
        });
    }
    if (rId === undefined || rId.length === 0) {
        // Element had no r:id — markup-only clear, no relationship work.
        return;
    }
    const remaining: number = countRelationshipIdReferences(hostRoot, rId);
    if (remaining > 0) {
        return;
    }
    const next: PackageRelationship[] = [];
    const relationships: ReadonlyArray<PackageRelationship> = access.getRelationships();
    for (let i: number = 0; i < relationships.length; i++) {
        const rel: PackageRelationship = arrayAt(relationships, i);
        if (rel.id !== rId) {
            next.push(rel);
        }

    }
    access.replaceRelationships(next);
}
/**
 *
 * @param {Shape | TextPart} target - The target value.
 * @returns {*} The result.
 */
function isShape(target: Shape | TextPart): target is Shape {
    return 'kind' in target;
}
