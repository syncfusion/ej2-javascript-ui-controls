/**
 * Retarget an embedded picture blip to a new media part (`Picture.replaceImageData`).
 *
 * @remarks
 * Algorithm (TASK-1089 / TASK-1091 lock):
 * 1. Detect content type from magic bytes + package media limits **before** mutate.
 * 2. Live non-detached `p:pic` under host root with `a:blip` and **required** `r:embed`
 *    (link-only → {@link Error}; never fetch / never upgrade link-only).
 * 3. Always allocate a **new** media part + Internal image relationship (insert parity;
 *    no in-place rewrite, no hash dedupe).
 * 4. Set `a:blip/@r:embed` to the new rId; remove `r:link` on that blip if present;
 *    preserve blip children (effects) and blipFill siblings (`srcRect`, stretch, …).
 * 5. GC previous embed / link rIds via host DOM refcount + package Internal target
 *    refcount (same rules as remove): drop unused Relationships; deletePart +
 *    removeContentTypeOverride when unused (leave image Defaults).
 * 6. Same {@link Picture} instance; preserve `cNvPr/@id`, name, and `spPr`.
 *
 * Errors: {@link Error} | {@link Error} only.
 *
 * Citations: `dml-main.xsd` `AG_Blob` / `CT_Blip`; `IMAGE_REL_TYPE`; insert allowlist.
 *
 * @packageDocumentation
 */
import { IMAGE_REL_TYPE } from '../package/constants';
import { allocateNextRelationshipId } from '../package/allocate-relationship-id';
import { PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { relativeTarget } from '../package/paths';
import { OFFICE_REL_ATTR_NS } from '../presentation/constants';
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { asMutable, MutableOoxmlElement } from '../shapes/dom-utils';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { allocateNextMediaPartName, copyPictureBytes, detectPictureContentType, enforcePictureMediaInsertLimits,
    extensionForPictureContentType, PictureDataInput } from './add-picture';
import { PictureMediaAccess, PictureMediaWriteAccess } from './media-access';
import { Picture } from './picture';
import { findBlip, findPictureBlipFill, readPictureBlipIds, PictureBlipIds } from './read-picture';
import { countOfficeRelationshipAttributeReferences, countPackageInternalTargetReferences } from './remove-picture';
/**
 * Options for {@link Picture.replaceImageData}.
 *
 * @remarks
 * Only `data` — content type is inferred from magic bytes. No name/bounds
 * (identity and geometry stay put).
 */
import { stringIncludes, arraySet, arrayAt } from '../util/es5-compat';
export interface ReplaceImageDataOptions {
    /**
     * Image octets stored as a **new** media part (copied into the package), or a
     * base64 `string` of those octets.
     *
     * @remarks
     * Content type is inferred from payload magic bytes (PNG / JPEG / GIF only).
     */
    readonly data: PictureDataInput;
}
/**
 * Host context required to retarget a picture safely.
 *
 * @internal
 */
export interface PictureRetargetContext {
    /** Host part document element (`p:sld` / layout / master root). */
    readonly hostRoot: OoxmlElement | undefined;
    /** Absolute host part name (diagnostics + relative Targets). */
    readonly partName: string | undefined;
    /** Package security limits. */
    readonly limits: SecurityLimits | undefined;
    /** Optional dirty notification after successful retarget. */
    readonly onMutate?: () => void;
}
/**
 * Arguments for {@link replaceImageDataInternal}.
 *
 * @internal
 */
export interface ReplaceImageDataArgs {
    readonly picture: Picture;
    readonly media: PictureMediaAccess;
    readonly context: PictureRetargetContext;
    readonly options: ReplaceImageDataOptions;
}
/**
 * Replaces the embedded media for a live picture with a new part (void).
 *
 * @throws {Error} Detached / foreign / missing write / no embed / unrecognized image bytes / path traversal.
 * @throws {Error} When adding the new media part or relationship would exceed package limits.
 * @internal
 * @param {ReplaceImageDataArgs} args - Picture handle, media write, host context, and options.
 * @returns {void} Nothing.
 */
export function replaceImageDataInternal(args: ReplaceImageDataArgs): void {
    const { picture, media, context, options } = args;
    const write: PictureMediaWriteAccess = media.write;
    const partName: string = (context.partName !== null && context.partName !== undefined ? context.partName : '');
    if (write === undefined) {
        throw new InvalidPackageError('Picture retarget requires package write access on the slide', { partName });
    }
    if (picture.isDetached()) {
        throw new InvalidPackageError('Picture handle is already detached', { partName });
    }
    const hostRoot: OoxmlElement = context.hostRoot;
    if (hostRoot === undefined) {
        throw new InvalidPackageError('Picture retarget requires a host slide root on the shape handle', { partName });
    }
    if (context.limits === undefined) {
        throw new InvalidPackageError('Picture retarget requires security limits on the shape handle', { partName });
    }
    const picEl: OoxmlElement = picture.getElement();
    if (!isDescendantOf(hostRoot, picEl)) {
        throw new InvalidPackageError('Picture is not on this slide', { partName });
    }
    const blipFill: OoxmlElement = findPictureBlipFill(picEl);
    if (blipFill === undefined) {
        throw new InvalidPackageError('Picture has no blipFill; cannot retarget', { partName });
    }
    const blip: OoxmlElement = findBlip(blipFill);
    if (blip === undefined) {
        throw new InvalidPackageError('Picture has no a:blip; cannot retarget', { partName });
    }
    const priorIds: PictureBlipIds = readPictureBlipIds(picEl);
    if (priorIds.embedRelationshipId === undefined) {
        throw new InvalidPackageError('Picture retarget requires r:embed; link-only pictures cannot be retargeted', { partName });
    }
    const data: Uint8Array = copyPictureBytes(options.data);
    const contentType: string = detectPictureContentType(data, partName);
    enforcePictureMediaInsertLimits({
        limits: context.limits,
        write,
        slidePartName: partName,
        dataByteLength: data.byteLength
    });
    const ext: string = extensionForPictureContentType(contentType);
    const mediaPartName: string = allocateNextMediaPartName(write, ext);
    const existingRels: ReadonlyArray<PackageRelationship> = media.getSlideRelationships();
    if (existingRels.length + 1 > context.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName,
            actual: existingRels.length + 1
        });
    }
    const relationshipId: string = allocateNextRelationshipId(existingRels);
    const mediaPart: PackagePart = {
        name: mediaPartName,
        contentType,
        data
    };
    write.setPart(mediaPart);
    write.ensureContentTypeDefault(ext, contentType);
    write.ensureContentTypeOverride(mediaPartName, contentType);
    const newRel: PackageRelationship = {
        id: relationshipId,
        type: IMAGE_REL_TYPE,
        target: relativeTarget(partName, mediaPartName),
        targetMode: 'Internal',
        targetPartName: mediaPartName
    };
    write.setSlideRelationships([...existingRels, newRel]);
    // Mutate blip AG_Blob: set embed, drop link; leave children intact.
    setOfficeRelAttr(blip, 'embed', relationshipId);
    removeOfficeRelAttr(blip, 'link');
    // GC prior embed / link rIds when unused on host DOM after the blip update.
    garbageCollectUnusedImageRelationships({
        root: hostRoot,
        media,
        write,
        partName,
        candidateRIds: uniqueIds([priorIds.embedRelationshipId, priorIds.linkRelationshipId])
    });
    if (context.onMutate != null) {
        context.onMutate();
    }
}
/**
 * @param {*} args - The args value.
 * @param {*} args.root - The args.root value.
 * @param {*} args.media - The args.media value.
 * @param {*} args.write - The args.write value.
 * @param {*} args.partName - The args.partName value.
 * @param {*} args.candidateRIds - The args.candidateRIds value.
 * @returns {void} Nothing.
 */
function garbageCollectUnusedImageRelationships(args: {
    readonly root: OoxmlElement;
    readonly media: PictureMediaAccess;
    readonly write: PictureMediaWriteAccess;
    readonly partName: string;
    readonly candidateRIds: ReadonlyArray<string>;
}): void {
    const { root, media, write, partName, candidateRIds } = args;
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
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @returns {void} Nothing.
 */
function setOfficeRelAttr(el: OoxmlElement, localName: string, value: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const attrs: Array<OoxmlAttribute> = mutable.attributes.slice();
    const idx: number = attrs.findIndex((a: OoxmlAttribute) => a.namespaceUri === OFFICE_REL_ATTR_NS && a.localName === localName);
    const next: OoxmlAttribute = {
        namespaceUri: OFFICE_REL_ATTR_NS,
        localName,
        value,
        prefix: 'r'
    };
    if (idx === -1) {
        attrs.push(next);
    }
    else {
        arraySet(attrs, idx, next);
    }
    mutable.attributes = attrs;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {void} Nothing.
 */
function removeOfficeRelAttr(el: OoxmlElement, localName: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const next: Array<OoxmlAttribute> = mutable.attributes.filter((a: OoxmlAttribute) => !(a.namespaceUri === OFFICE_REL_ATTR_NS &&
        a.localName === localName));
    if (next.length !== mutable.attributes.length) {
        mutable.attributes = next;
    }
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
/**
 *
 * @param {OoxmlElement} root - The root value.
 * @param {OoxmlElement} target - The target value.
 * @returns {boolean} The result.
 */
function isDescendantOf(root: OoxmlElement, target: OoxmlElement): boolean {
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
 *
 * @param {OoxmlElement} root - The root value.
 * @param {*} visit - The visit value.
 * @returns {void} Nothing.
 */
function walkElements(root: OoxmlElement, visit: (el: OoxmlElement) => void): void {
    visit(root);
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind === 'element') {
            walkElements(child, visit);
        }

    }
}
