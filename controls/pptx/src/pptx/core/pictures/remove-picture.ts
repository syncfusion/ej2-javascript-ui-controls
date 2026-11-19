/**
 * Remove a picture from a slide (`ShapeCollection.removePicture`).
 *
 * @remarks
 * Algorithm (TASK-1089 / spec 039 remove, steps 1–7):
 * 1. Resolve live `p:pic` on this host; fail foreign / detached.
 * 2. Capture `r:embed` / `r:link` rIds before detach.
 * 3. Detach `p:pic` from parent (`spTree` or nested `grpSp`).
 * 4. Host-DOM refcount office-rel attrs `embed` | `link` | `id` for each rId;
 *    drop unused slide Relationships via media write.
 * 5. For Internal targets of dropped rels: package-wide part-name refcount;
 *    when unused → `deletePart` + `removeContentTypeOverride` (leave Defaults).
 * 6. Mark handle detached; notify mutate.
 * 7. Never renumber remaining `cNvPr/@id` values.
 *
 * Errors: {@link Error} only (no `PicturesError`).
 *
 * Citations: `dml-main.xsd` `AG_Blob`; image rel type; TASK-1089 GC lock.
 *
 * @packageDocumentation
 */
import { OFFICE_REL_ATTR_NS } from '../presentation/constants';
import { InvalidPackageError } from '../security/errors';
import { findParentElement, isDescendantOf, removeDirectChild, walkElements } from '../shapes/tree-detach';
import { OoxmlAttribute, OoxmlElement } from '../xml/dom';
import { PictureMediaAccess, PictureMediaWriteAccess } from './media-access';
import { Picture } from './picture';
import { readPictureBlipIds, PictureBlipIds } from './read-picture';
import { PackageRelationship } from '../package/relationships';
/**
 * Arguments for {@link removePictureFromSlide}.
 *
 * @internal
 */
import { stringIncludes, arrayAt } from '../util/es5-compat';
export interface RemovePictureFromSlideArgs {
    /** Host part document element (`p:sld` / equivalent). */
    readonly root: OoxmlElement;
    /** Absolute host part name (diagnostics). */
    readonly partName: string;
    /** Media access with write surface required for GC. */
    readonly media: PictureMediaAccess;
    /** Picture handle to remove. */
    readonly picture: Picture;
    /** Optional dirty notification after successful remove. */
    readonly onMutate?: () => void;
}
/**
 * Detaches a picture from the host shape tree and GCs unused image relationships / media.
 *
 * @throws {Error} When the handle is detached, not under this root, write access is missing,
     or the element cannot be detached.
 * @internal
 * @param {RemovePictureFromSlideArgs} args - Host root, media write, and picture handle.
 * @returns {void} Nothing.
 */
export function removePictureFromSlide(args: RemovePictureFromSlideArgs): void {
    const { root, partName, media, picture } = args;
    const write: PictureMediaWriteAccess = media.write;
    if (write === undefined) {
        throw new InvalidPackageError('Picture remove requires package write access on the slide', { partName });
    }
    if (picture.isDetached()) {
        throw new InvalidPackageError('Picture handle is already detached', { partName });
    }
    const picEl: OoxmlElement = picture.getElement();
    if (!isDescendantOf(root, picEl)) {
        throw new InvalidPackageError('Picture is not on this slide', { partName });
    }
    const blipIds: PictureBlipIds = readPictureBlipIds(picEl);
    const candidateRIds: Array<string> = uniqueIds([blipIds.embedRelationshipId, blipIds.linkRelationshipId]);
    const parent: OoxmlElement = findParentElement(root, picEl);
    if (parent === undefined) {
        throw new InvalidPackageError('Picture element has no parent under the host root', {
            partName
        });
    }
    const removed: boolean = removeDirectChild(parent, picEl);
    if (!removed) {
        throw new InvalidPackageError('Failed to detach picture from its parent', { partName });
    }
    const slideRels: ReadonlyArray<PackageRelationship> = media.getSlideRelationships();
    const droppedInternalTargets: Set<string> = new Set<string>();
    let relsChanged: boolean = false;
    let nextRels: ReadonlyArray<PackageRelationship> = slideRels;
    for (let i: number = 0; i < candidateRIds.length; i++) {
        const rId: string = arrayAt(candidateRIds, i);
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
    picture.markDetached();
    if (args.onMutate != null) {
        args.onMutate();
    }
}
/**
 * Counts office-document relationship attributes (`r:embed` / `r:link` / `r:id`)
 * equal to `rId` under `root` (post-detach host DOM).
 *
 * @internal
 * @param {OoxmlElement} root - The root value.
 * @param {string} rId - The rId value.
 * @returns {number} The result.
 */
export function countOfficeRelationshipAttributeReferences(root: OoxmlElement, rId: string): number {
    let count: number = 0;
    walkElements(root, (el: OoxmlElement) => {
        for (let i: number = 0; i < el.attributes.length; i++) {
            const a: OoxmlAttribute = arrayAt(el.attributes, i);
            if (a.namespaceUri !== OFFICE_REL_ATTR_NS || a.value !== rId) {
                continue;
            }
            if (a.localName === 'embed' || a.localName === 'link' || a.localName === 'id') {
                count += 1;
            }

        }
    });
    return count;
}
/**
 * Counts Internal relationships anywhere in the package that target `partName`.
 *
 * @internal
 * @param {PictureMediaWriteAccess} write - The write value.
 * @param {string} partName - The partName value.
 * @returns {number} The result.
 */
export function countPackageInternalTargetReferences(write: PictureMediaWriteAccess, partName: string): number {
    let count: number = 0;
    const allRelationships: any = Array.from(write.iterateAllRelationships());// eslint-disable-line
    for (let i: number = 0; i < allRelationships.length; i++) {
        const entry: any = arrayAt(allRelationships, i);// eslint-disable-line
        for (let j: number = 0; j < entry.relationships.length; j++) {
            const rel: any = arrayAt(entry.relationships, j);// eslint-disable-line
            if (rel.targetMode === 'Internal' && rel.targetPartName === partName) {
                count += 1;
            }

        }

    }
    return count;
}
/**
 *
 * @param {*} ids - The ids value.
 * @returns {string[]} The result.
 */
function uniqueIds(ids: ReadonlyArray<string | undefined>): string[] {
    const out: string[] = [];
    const seen: Set<string> = new Set<string>();
    for (let i: number = 0; i < ids.length; i++) {
        const id: string = arrayAt(ids, i);
        if (id === undefined || seen.has(id)) {
            continue;
        }
        seen.add(id);
        out.push(id);

    }
    return out;
}
