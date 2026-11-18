import { arrayAt } from '../../core/util/es5-compat';
/**
 * Retarget existing hyperlink relationships (external / internal).
 *
 * @remarks
 * Updates the relationship row in place; keeps `r:id` on the CT_Hyperlink element
 * and does not rebuild children (`snd` / `extLst` preserved). Never fetches Targets
 * or invokes `ppaction://`. Citation: `docs/specs/015-hyperlinks.md` serializer table.
 *
 * @packageDocumentation
 */
import { HostPartRelationshipAccess } from '../../core/package/host-part-relationship-access';
import { relativeTarget, resolveInternalTarget } from '../../core/package/paths';
import { PackageRelationship } from '../../core/package/relationships';
import { Shape } from '../../core/shapes/shape';
import { TextPart } from '../../core/text/text-part';
import { OoxmlElement } from '../../core/xml/index';
import { HyperlinkMutationError } from './errors';
import { readHyperlinkRelationshipId } from './hyperlink-dom';
import { RunHyperlinkKind } from './read-run-hyperlink';
import { ShapeHyperlinkKind } from './read-shape-hyperlink';
import { locateRunHyperlink, locateShapeHyperlink } from './resolve-hyperlink-target';
/**
 * Retargets a shape-level hyperlink relationship to an external URL.
 *
 * @throws {HyperlinkMutationError} When the hyperlink element, `r:id`, or matching relationship is missing.
 * @public
 * @param {Shape} target - Shape that owns `cNvPr` hyperlink markup.
 * @param {*} kind - The target value.
 * @param {ShapeHyperlinkKind} access - `click` (`hlinkClick`) or `hover` (`hlinkHover`).
 * @param {HostPartRelationshipAccess} url - Live host-part relationship access from
 * @returns {void} Nothing.
 */
export function retargetExternal(
    target: Shape | TextPart,
    kind: ShapeHyperlinkKind | RunHyperlinkKind,
    access: HostPartRelationshipAccess,
    url: string
): void {
    const el: OoxmlElement = requireHyperlinkElement(target, kind, access.partName);
    const rId: string = requireRelationshipId(el, access.partName);
    replaceRelationship(access, rId, {
        target: url,
        targetMode: 'External',
        targetPartName: undefined
    });
}
/**
 * Retargets a shape-level hyperlink relationship to an internal package target.
 *
 * @throws {HyperlinkMutationError} When element / rId / rel missing.
 * @throws {Error} When the internal path is unsafe.
 * @public
 * @param {Shape} target - Shape that owns hyperlink markup.
 * @param {*} kind - The target value.
 * @param {ShapeHyperlinkKind} access - `click` or `hover`.
 * @param {HostPartRelationshipAccess} internalTarget - Live host-part relationship access.
 * @returns {void} Nothing.
 */
export function retargetInternal(
    target: Shape | TextPart,
    kind: ShapeHyperlinkKind | RunHyperlinkKind,
    access: HostPartRelationshipAccess,
    internalTarget: string
): void {
    const el: OoxmlElement = requireHyperlinkElement(target, kind, access.partName);
    const rId: string = requireRelationshipId(el, access.partName);
    const targetPartName: string = resolveInternalTarget(access.partName, internalTarget);
    replaceRelationship(access, rId, {
        target: relativeTarget(access.partName, targetPartName),
        targetMode: 'Internal',
        targetPartName
    });
}
/**
 *
 * @param {Shape | TextPart} target - The target value.
 * @param {ShapeHyperlinkKind | RunHyperlinkKind} kind - The kind value.
 * @param {string} partName - The partName value.
 * @returns {OoxmlElement} The result.
 */
function requireHyperlinkElement(target: Shape | TextPart, kind: ShapeHyperlinkKind | RunHyperlinkKind, partName: string): OoxmlElement {
    if (isShape(target)) {
        const located: { readonly parent: OoxmlElement; readonly element: OoxmlElement; } =
            locateShapeHyperlink(target, kind as ShapeHyperlinkKind);
        if (located === undefined || located.element === undefined) {
            throw new HyperlinkMutationError(`Shape hyperlink element missing for kind "${String(kind)}"`, { partName });
        }
        return located.element;
    }
    const located: ReturnType<typeof locateRunHyperlink> = locateRunHyperlink(target, kind as RunHyperlinkKind);
    if (located.element === undefined) {
        throw new HyperlinkMutationError(`Run hyperlink element missing for kind "${String(kind)}"`, {
            partName
        });
    }
    return located.element;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} partName - The partName value.
 * @returns {string} The result.
 */
function requireRelationshipId(el: OoxmlElement, partName: string): string {
    const rId: string = readHyperlinkRelationshipId(el);
    if (rId === undefined || rId.length === 0) {
        throw new HyperlinkMutationError('Hyperlink element is missing r:id', { partName });
    }
    return rId;
}
/**
 *
 * @param {HostPartRelationshipAccess} access - The access value.
 * @param {string} rId - The rId value.
 * @param {*} patch - The patch value.
 * @returns {void} Nothing.
 */
function replaceRelationship(access: HostPartRelationshipAccess, rId: string,
                             patch: Pick<PackageRelationship, 'target' | 'targetMode' | 'targetPartName'>): void {
    const existing: ReadonlyArray<PackageRelationship> = access.getRelationships();
    const next: PackageRelationship[] = [];
    let found: boolean = false;
    for (let i: number = 0; i < existing.length; i++) {
        const rel: PackageRelationship = arrayAt(existing, i);
        if (rel.id === rId) {
            found = true;
            next.push({
                id: rel.id,
                type: rel.type,
                target: patch.target,
                targetMode: patch.targetMode,
                targetPartName: patch.targetPartName
            });
        }
        else {
            next.push(rel);
        }

    }
    if (!found) {
        throw new HyperlinkMutationError(`No relationship with Id "${rId}" on host part`, {
            partName: access.partName
        });
    }
    access.replaceRelationships(next);
}
/**
 *
 * @param {Shape | TextPart} target - The target value.
 * @returns {*} The result.
 */
function isShape(target: Shape | TextPart): target is Shape {
    // Shape exposes public `kind`; TextPart does not.
    return 'kind' in target;
}
