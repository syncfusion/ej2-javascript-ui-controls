/**
 * Add a new external hyperlink on a shape or text run.
 *
 * @remarks
 * Allocates the next free `rIdN` on the host part, appends a hyperlink-type
 * relationship with `TargetMode=External`, and creates the kind-specific
 * DrawingML `CT_Hyperlink` child with `r:id` (optional tooltip). Never fetches
 * the URL. Enforces `relationshipsPerPart` via {@link Error}.
 * Citation: `docs/specs/015-hyperlinks.md`; ECMA-376-4 hyperlink relationship type.
 *
 * @packageDocumentation
 */
import { allocateNextRelationshipId } from '../../core/package/allocate-relationship-id';
import { HostPartRelationshipAccess } from '../../core/package/host-part-relationship-access';
import { PackageRelationship } from '../../core/package/relationships';
import { PackageLimitError } from '../../core/security/errors';
import { asMutable, MutableOoxmlElement } from '../../core/shapes/dom-utils';
import { Shape } from '../../core/shapes/shape';
import { TextPart } from '../../core/text/text-part';
import { OoxmlElement } from '../../core/xml/index';
import { HYPERLINK_REL_TYPE } from './constants';
import { HyperlinkMutationError } from './errors';
import { appendChildElement, buildEmptyRunProperties, buildHyperlinkElement } from './hyperlink-dom';
import { RunHyperlinkKind } from './read-run-hyperlink';
import { ShapeHyperlinkKind } from './read-shape-hyperlink';
import { locateRunHyperlink, locateShapeHyperlink, runHyperlinkLocalName, shapeHyperlinkLocalName } from './resolve-hyperlink-target';
import { arrayAt } from '../../core/util/es5-compat';
import { OoxmlText } from '../../core/xml/dom';
/**
 * Options when adding an external hyperlink.
 *
 * @public
 */
export interface AddExternalHyperlinkOptions {
    /** Optional `tooltip` attribute on `CT_Hyperlink`. */
    readonly tooltip?: string;
}
/**
 * Adds an external hyperlink on a shape (`hlinkClick` or `hlinkHover`).
 *
 * @throws {HyperlinkMutationError} When `cNvPr` is missing or a hyperlink of that kind already exists.
 * @throws {Error} When `relationshipsPerPart` would be exceeded.
 * @public
 * @param {Shape} target - Shape with `cNvPr` container.
 * @param {*} kind - The target value.
 * @param {ShapeHyperlinkKind} access - `click` or `hover`.
 * @param {HostPartRelationshipAccess} url - Live host-part relationship access.
 * @param {string} options - Opaque external Target (never fetched).
 * @returns {void} Nothing.
 */
export function addExternalHyperlink(
    target: Shape | TextPart,
    kind: ShapeHyperlinkKind | RunHyperlinkKind,
    access: HostPartRelationshipAccess,
    url: string,
    options: AddExternalHyperlinkOptions = {}
): void {
    const relationshipId: string = allocateExternalHyperlinkRelationship(access, url);
    if (isShape(target)) {
        const located: { readonly parent: OoxmlElement; readonly element: OoxmlElement; } =
            locateShapeHyperlink(target, kind as ShapeHyperlinkKind);
        if (located === undefined) {
            throw new HyperlinkMutationError('Shape cNvPr missing; cannot add hyperlink', {
                partName: access.partName
            });
        }
        if (located.element !== undefined) {
            throw new HyperlinkMutationError(`Shape already has hyperlink kind "${String(kind)}"; clear or retarget instead`,
                                             { partName: access.partName });
        }
        const localName: string = shapeHyperlinkLocalName(kind as ShapeHyperlinkKind);
        const hlink: OoxmlElement = buildHyperlinkElement(localName, relationshipId, tooltipOptions(options.tooltip));
        appendChildElement(located.parent, hlink);
        return;
    }
    const located: ReturnType<typeof locateRunHyperlink> = locateRunHyperlink(target, kind as RunHyperlinkKind);
    if (located.element !== undefined) {
        throw new HyperlinkMutationError(`Run already has hyperlink kind "${String(kind)}"; clear or retarget instead`,
                                         { partName: access.partName });
    }
    let parent: OoxmlElement = located.parent;
    if (parent === undefined) {
        parent = buildEmptyRunProperties();
        // Insert rPr before a:t when possible so run property order stays conventional.
        insertRunProperties(located.runElement, parent);
    }
    const localName: string = runHyperlinkLocalName(kind as RunHyperlinkKind);
    const hlink: OoxmlElement = buildHyperlinkElement(localName, relationshipId, tooltipOptions(options.tooltip));
    appendChildElement(parent, hlink);
}
/**
 * Builds optional tooltip options for a hyperlink element.
 *
 * @param {string | undefined} tooltip - The tooltip value.
 * @returns {*} Tooltip options object, or undefined when tooltip is absent.
 */
function tooltipOptions(tooltip: string | undefined): {
    readonly tooltip?: string;
} | undefined {
    return tooltip === undefined ? undefined : { tooltip };
}
/**
 *
 * @param {HostPartRelationshipAccess} access - The access value.
 * @param {string} url - The url value.
 * @returns {string} The result.
 */
function allocateExternalHyperlinkRelationship(access: HostPartRelationshipAccess, url: string): string {
    const existing: ReadonlyArray<PackageRelationship> = access.getRelationships();
    if (existing.length + 1 > access.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName: access.partName,
            actual: existing.length + 1
        });
    }
    const relationshipId: string = allocateNextRelationshipId(existing);
    const newRel: PackageRelationship = {
        id: relationshipId,
        type: HYPERLINK_REL_TYPE,
        target: url,
        targetMode: 'External',
        targetPartName: undefined
    };
    access.replaceRelationships([...existing, newRel]);
    return relationshipId;
}
/**
 * Inserts `a:rPr` as the first element child of `a:r` (before `a:t` when present).
 *
 * @internal
 * @param {OoxmlElement} runElement - The runElement value.
 * @param {OoxmlElement} rPr - The rPr value.
 * @returns {void} Nothing.
 */
function insertRunProperties(runElement: OoxmlElement, rPr: OoxmlElement): void {
    const mutable: MutableOoxmlElement = asMutable(runElement);
    let insertAt: number = mutable.children.length;
    for (let i: number = 0; i < mutable.children.length; i += 1) {
        const child: OoxmlElement | OoxmlText = arrayAt(mutable.children, i);
        if (child !== undefined && child.kind === 'element') {
            insertAt = i;
            break;
        }
    }
    mutable.children.splice(insertAt, 0, rPr);
}
/**
 *
 * @param {Shape | TextPart} target - The target value.
 * @returns {*} The result.
 */
function isShape(target: Shape | TextPart): target is Shape {
    return 'kind' in target;
}
