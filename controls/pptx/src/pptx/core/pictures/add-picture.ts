/**
 * Append an embedded picture (`p:pic` + media part + image rel) under a slide.
 *
 * Citations (Transitional XSD / fixtures — no invented vocabulary):
 * - `pml.xsd` `CT_Picture` ~1304–1314: `nvPicPr`, `blipFill`, `spPr` required
 * - `pml.xsd` `CT_PictureNonVisual` ~1295–1302: `cNvPr`, `cNvPicPr`, `nvPr`
 * - `dml-main.xsd` `AG_Blob` ~724–727: `r:embed` / `r:link`
 * - `dml-main.xsd` `CT_Blip` / `CT_BlipFillProperties`; stretch/fillRect from fixtures
 * - Image relationship type: `…/relationships/image` (`IMAGE_REL_TYPE`)
 * - `ST_ShapeType` includes `rect`; fixtures use `a:prstGeom prst="rect"` + empty `a:avLst`
 *
 * Policy: **new media part per insert** (no hash dedupe). Never writes `r:link`.
 * Never fetches network targets.
 */
import { _decode } from '../errors';
import { IMAGE_GIF_CONTENT_TYPE, IMAGE_JPEG_CONTENT_TYPE, IMAGE_PNG_CONTENT_TYPE, IMAGE_REL_TYPE } from '../package/constants';
import { allocateNextRelationshipId } from '../package/allocate-relationship-id';
import { PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { relativeTarget } from '../package/paths';
import { OFFICE_REL_ATTR_NS, PML_NS } from '../presentation/constants';
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { DML_NS } from '../shapes/constants';
import { asMutable } from '../shapes/dom-utils';
import { allocateNextDrawingElementId } from '../shapes/drawing-element-id';
import { buildCreationIdExtLst, creationIdGuid } from '../shapes/creation-id';
import { findSpTree, ShapeBounds } from '../shapes/add-text-box';
import { Shape } from '../shapes/shape';
import { walkSlideShapeTree } from '../shapes/walk';
import { coordinateToEmuString } from '../util/length-units';
import { OoxmlAttribute, OoxmlElement } from '../xml/index';
import { PictureMediaAccess, PictureMediaWriteAccess } from './media-access';
import { Picture } from './picture';
/**
 * Allowed image MIME types for {@link ShapeCollection.addPicture}.
 *
 * Citation: `docs/specs/012-pictures.md` content-type allowlist.
 */
import { arrayIncludes, arrayAt } from '../util/es5-compat';
export const PICTURE_INSERT_CONTENT_TYPES: ReadonlyArray<string> = Object.freeze([
    IMAGE_PNG_CONTENT_TYPE,
    IMAGE_JPEG_CONTENT_TYPE,
    IMAGE_GIF_CONTENT_TYPE
]);
/**
 * Image octets accepted by {@link ShapeCollection.addPicture} and
 * {@link Picture.replaceImageData}.
 *
 * @remarks
 * `string` is base64 of the image payload only (no data-URL prefix strip).
 * The library does not decode image codecs.
 */
export type PictureDataInput = Uint8Array | number[] | string;
/**
 * Position and size for a new picture, in **points**.
 *
 * @remarks
 * Alias of {@link ShapeBounds}. Public `width` / `height` map to wire
 * `a:ext/@cx` / `@cy` after points→EMU conversion. Citation: `dml-main.xsd`
 * `CT_Point2D` / `CT_PositiveSize2D`.
 */
export type PictureBounds = ShapeBounds;
/**
 * Options for {@link ShapeCollection.addPicture}.
 */
export interface AddPictureOptions {
    /**
     * Image octets stored as a new media part (copied into the package), or a
     * base64 `string` of those octets.
     *
     * @remarks
     * Content type is inferred from payload magic bytes (PNG / JPEG / GIF only).
     * The library does not decode image codecs beyond signature detection.
     */
    readonly data: PictureDataInput;
    /**
     * `cNvPr/@name` for the new picture.
     *
     * @defaultValue `"Picture 1"`
     */
    readonly name?: string;
    /**
     * Picture position and size in **points**.
     *
     * @defaultValue `{ x: 0, y: 0, width: 72, height: 72 }` (1" × 1")
     */
    readonly bounds?: PictureBounds;
}
/** Default name when {@link AddPictureOptions.name} is omitted. */
export const DEFAULT_PICTURE_NAME: string = 'Picture 1';
/**
 * Default bounds: origin, 1" × 1" (72 pt × 72 pt).
 *
 * @remarks
 * Wire EMUs are `914400` × `914400`. Element/attribute **names** match fixture
 * `a:off` / `a:ext` usage (`tests/helpers/picture-fixture.ts`).
 */
export const DEFAULT_PICTURE_BOUNDS: Readonly<PictureBounds> = Object.freeze({
    x: 0,
    y: 0,
    width: 72,
    height: 72
});
/**
 * Arguments for {@link addPictureToSlide}.
 *
 * @internal
 */
export interface AddPictureToSlideArgs {
    readonly root: OoxmlElement;
    readonly limits: SecurityLimits;
    readonly partName: string;
    readonly media: PictureMediaAccess;
    readonly options: AddPictureOptions;
    /** Optional mutation hook (e.g. digital-signature warning). */
    readonly onMutate?: () => void;
}
/**
 * Appends an embedded picture under the slide `p:spTree` and returns a {@link Picture}.
 *
 * @throws {Error} When shapes/media/part/rel limits would be exceeded.
 * @throws {Error} When image bytes are unrecognized, write access is missing, or `p:spTree` is absent.
 * @throws {RangeError} When drawing element id space is exhausted.
 * @remarks - New `cNvPr/@id` = {@link allocateNextDrawingElementId} (includes grp tree id=1). - Existing shape ids and unknown `spTree`
 * siblings are left untouched. - Always creates a **new** media part under `/ppt/media/` (no dedupe). - Emits Internal image relationship
 * only (`r:embed`); never `r:link` / fetch.
 * @internal
 * @param {AddPictureToSlideArgs} args - Live slide root, limits, media write access, and options.
 * @returns {Picture} The new {@link Picture} bound to the inserted `p:pic`.
 */
export function addPictureToSlide(args: AddPictureToSlideArgs): Picture {
    const write: PictureMediaWriteAccess = args.media.write;
    if (write === undefined) {
        throw new InvalidPackageError('Picture insert requires package write access on the slide', {
            partName: args.partName
        });
    }
    const data: Uint8Array = copyBytes(args.options.data);
    const contentType: string = detectPictureContentType(data, args.partName);
    enforceInsertLimits({
        limits: args.limits,
        write,
        slidePartName: args.partName,
        dataByteLength: data.byteLength
    });
    const spTree: OoxmlElement = findSpTree(args.root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot add a picture', {
            partName: args.partName
        });
    }
    // Enforce shapesPerSlide consistently with walk (identifiable shape-like nodes).
    const existing: Array<Shape> = walkSlideShapeTree(args.root, args.limits, args.partName, args.media, args.onMutate);
    if (existing.length >= args.limits.shapesPerSlide) {
        throw new PackageLimitError('shapesPerSlide', {
            partName: args.partName,
            actual: existing.length + 1
        });
    }
    const ext: string = extensionForContentType(contentType);
    const mediaPartName: string = allocateNextMediaPartName(write, ext);
    const existingRels: ReadonlyArray<PackageRelationship> = args.media.getSlideRelationships();
    if (existingRels.length + 1 > args.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName: args.partName,
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
    // Override covers the absolute part when Default would not match (save also ensures).
    write.ensureContentTypeOverride(mediaPartName, contentType);
    const newRel: PackageRelationship = {
        id: relationshipId,
        type: IMAGE_REL_TYPE,
        target: relativeTarget(args.partName, mediaPartName),
        targetMode: 'Internal',
        targetPartName: mediaPartName
    };
    write.setSlideRelationships([...existingRels, newRel]);
    const id: string = allocateNextDrawingElementId(args.root);
    const name: string = (args.options.name !== null && args.options.name !== undefined ? args.options.name : DEFAULT_PICTURE_NAME);
    const bounds: ShapeBounds = (args.options.bounds !== null &&
        args.options.bounds !== undefined ? args.options.bounds : DEFAULT_PICTURE_BOUNDS);
    const pic: OoxmlElement = buildPictureElement({ id, name, bounds, embedRId: relationshipId });
    asMutable(spTree).children.push(pic);
    if (args.onMutate != null) {
        args.onMutate();
    }
    const shape: Shape = Shape.create(pic, 'pic', id, name, args.limits, args.partName, args.media, 0, args.onMutate, args.root, [spTree]);
    const picture: Picture = shape.asPicture();
    if (picture === undefined) {
        return new Picture(pic, args.media, {
            hostRoot: args.root,
            partName: args.partName,
            limits: args.limits,
            onMutate: args.onMutate
        });
    }
    return picture;
}
/**
 * Whether `contentType` is on the picture insert allowlist (case-insensitive).
 *
 * @internal
 * @param {string} contentType - The contentType value.
 * @returns {boolean} The result.
 */
export function isAllowedPictureContentType(contentType: string): boolean {
    const normalized: string = normalizeContentType(contentType);
    return arrayIncludes(PICTURE_INSERT_CONTENT_TYPES as ReadonlyArray<string>, normalized);
}
/**
 * Normalizes a content-type string for allowlist comparison.
 *
 * @internal
 * @param {string} contentType - The contentType value.
 * @returns {string} The result.
 */
export function normalizePictureContentType(contentType: string): string {
    return normalizeContentType(contentType);
}
/**
 * File extension for an allowed picture content type.
 *
 * @internal
 * @param {string} contentType - The contentType value.
 * @returns {string} The result.
 */
export function extensionForPictureContentType(contentType: string): string {
    return extensionForContentType(contentType);
}
/**
 * Infers an allowed picture MIME type from image payload magic bytes.
 *
 * @remarks Recognizes PNG (`89 50 4E 47`), JPEG (`FF D8 FF`), and GIF87a/GIF89a only. Does not decode image codecs beyond the signature.
 * @throws {Error} When the signature is missing or unsupported.
 * @internal
 * @param {Uint8Array} data - The data value.
 * @param {string} partName - The partName value.
 * @returns {string} The result.
 */
export function detectPictureContentType(data: Uint8Array, partName?: string): string {
    const detected: string = tryDetectPictureContentType(data);
    if (detected === undefined) {
        throw new InvalidPackageError(`Unrecognized or unsupported image data; allowed signatures: PNG, JPEG,
            GIF (${PICTURE_INSERT_CONTENT_TYPES.join(', ')})`, {
            partName: partName !== undefined ? partName : ''
        });
    }
    return detected;
}
/**
 * Allocates the next free `/ppt/media/imageN.{ext}` part name.
 *
 * @internal
 * @param {PictureMediaWriteAccess} write - The write value.
 * @param {string} extension - The extension value.
 * @returns {string} The result.
 */
export function allocateNextMediaPartName(write: PictureMediaWriteAccess, extension: string): string {
    let n: number = 1;
    for (;;) {
        const name: string = `/ppt/media/image${String(n)}.${extension}`;
        if (write.getPart(name) === undefined) {
            return name;
        }
        n += 1;
        if (n > 1000000) {
            throw new InvalidPackageError('Cannot allocate media part name: exhausted search', {});
        }
    }
}
/**
 * Enforces package size/count limits before adding a new media part (+1 entry).
 *
 * @remarks Shared by insert and retarget. Does **not** enforce `shapesPerSlide` (retarget does not add a shape). Callers still enforce
 * `relationshipsPerPart` when appending a relationship.
 * @param {*} args - The args value.
 * @param {*} args.limits - Security limits.
 * @param {*} args.write - Package write access.
 * @param {string} args.slidePartName - Slide part name for errors.
 * @param {number} args.dataByteLength - Media byte length.
 * @internal
 * @returns {void} Nothing.
 */
export function enforcePictureMediaInsertLimits(args: {
    readonly limits: SecurityLimits;
    readonly write: PictureMediaWriteAccess;
    readonly slidePartName: string;
    readonly dataByteLength: number;
}): void {
    enforceInsertLimits(args);
}
/**
 * Copies image octets into a fresh {@link Uint8Array}.
 *
 * @remarks Base64 `string` is decoded via {@link _decode} first.
 * @internal
 * @param {PictureDataInput} data - The data value.
 * @returns {Uint8Array} The result.
 */
export function copyPictureBytes(data: PictureDataInput): Uint8Array {
    return copyBytes(data);
}
/**
 * PNG / JPEG / GIF signatures only (no codec decode).
 *
 * @param {Uint8Array} data - The data value.
 * @returns {string | undefined} The result.
 */
function tryDetectPictureContentType(data: Uint8Array): string | undefined {
    if (data.byteLength >= 8 &&
        data[0] === 0x89 &&
        data[1] === 0x50 &&
        data[2] === 0x4e &&
        data[3] === 0x47 &&
        data[4] === 0x0d &&
        data[5] === 0x0a &&
        data[6] === 0x1a &&
        data[7] === 0x0a) {
        return IMAGE_PNG_CONTENT_TYPE;
    }
    // JPEG SOI + marker start (JFIF/Exif/raw).
    if (data.byteLength >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
        return IMAGE_JPEG_CONTENT_TYPE;
    }
    // GIF87a / GIF89a
    if (data.byteLength >= 6 &&
        data[0] === 0x47 &&
        data[1] === 0x49 &&
        data[2] === 0x46 &&
        data[3] === 0x38 &&
        (data[4] === 0x37 || data[4] === 0x39) &&
        data[5] === 0x61) {
        return IMAGE_GIF_CONTENT_TYPE;
    }
    return undefined;
}
/**
 *
 * @param {string} contentType - The contentType value.
 * @returns {string} The result.
 */
function normalizeContentType(contentType: string): string {
    return contentType.trim().toLowerCase();
}
/**
 *
 * @param {string} contentType - The contentType value.
 * @returns {string} The result.
 */
function extensionForContentType(contentType: string): string {
    switch (normalizeContentType(contentType)) {
    case IMAGE_PNG_CONTENT_TYPE:
        return 'png';
    case IMAGE_JPEG_CONTENT_TYPE:
        return 'jpeg';
    case IMAGE_GIF_CONTENT_TYPE:
        return 'gif';
    default:
        throw new InvalidPackageError(`No extension mapping for content type "${contentType}"`, {});
    }
}
/**
 * @param {*} args - The args value.
 * @param {*} args.limits - Security limits.
 * @param {*} args.write - Package write access.
 * @param {string} args.slidePartName - Slide part name for errors.
 * @param {number} args.dataByteLength - Media byte length.
 * @returns {void} Nothing.
 */
function enforceInsertLimits(args: {
    readonly limits: SecurityLimits;
    readonly write: PictureMediaWriteAccess;
    readonly slidePartName: string;
    readonly dataByteLength: number;
}): void {
    const { limits, write, slidePartName, dataByteLength } = args;
    if (dataByteLength > limits.singlePartUncompressedBytes) {
        throw new PackageLimitError('singlePartUncompressedBytes', {
            partName: slidePartName,
            actual: dataByteLength
        });
    }
    const nextEntryCount: number = write.partCount() + 1;
    if (nextEntryCount > limits.entryCount) {
        throw new PackageLimitError('entryCount', {
            partName: slidePartName,
            actual: nextEntryCount
        });
    }
    let totalUncompressed: number = dataByteLength;
    let totalEmbeddedMedia: number = dataByteLength;
    const parts: Array<{ name: string; contentType: string; data: Uint8Array }> = Array.from(write.iterateParts());
    for (let i: number = 0; i < parts.length; i++) {
        const part: PackagePart = arrayAt(parts, i);
        totalUncompressed += part.data.byteLength;
        if (isEmbeddedMediaPart(part)) {
            totalEmbeddedMedia += part.data.byteLength;
        }

    }
    if (totalUncompressed > limits.totalUncompressedBytes) {
        throw new PackageLimitError('totalUncompressedBytes', {
            partName: slidePartName,
            actual: totalUncompressed
        });
    }
    if (totalEmbeddedMedia > limits.totalEmbeddedMediaBytes) {
        throw new PackageLimitError('totalEmbeddedMediaBytes', {
            partName: slidePartName,
            actual: totalEmbeddedMedia
        });
    }
}
/**
 * Media parts counted toward `totalEmbeddedMediaBytes` on insert.
 *
 * @remarks Includes `image/*` content types and any part under `/ppt/media/`.
 * @param {PackagePart} part - The part value.
 * @returns {boolean} The result.
 */
function isEmbeddedMediaPart(part: PackagePart): boolean {
    if (part.name.startsWith('/ppt/media/')) {
        return true;
    }
    return part.contentType.toLowerCase().startsWith('image/');
}
/**
 *
 * @param {PictureDataInput} data - The data value.
 * @returns {Uint8Array} The result.
 */
function copyBytes(data: PictureDataInput): Uint8Array {
    if (typeof data === 'string') {
        const decoded: Uint8Array | Array<number> = _decode(data, false);
        return decoded instanceof Uint8Array ? decoded.slice() : new Uint8Array(decoded);
    }
    return data instanceof Uint8Array ? data.slice() : Uint8Array.from(data);
}
/**
 * @param {*} args - The args value.
 * @param {string} args.id - Shape id.
 * @param {string} args.name - Shape name.
 * @param {*} args.bounds - Picture bounds.
 * @param {string} args.embedRId - Embed relationship id.
 * @returns {OoxmlElement} The result.
 */
function buildPictureElement(args: {
    readonly id: string;
    readonly name: string;
    readonly bounds: PictureBounds;
    readonly embedRId: string;
}): OoxmlElement {
    // Per-shape a16:creationId on cNvPr — PowerPoint repair heuristic flags
    // shapes/pictures missing this extension. Citation: inspected
    // `temp/simple-create-output-ms_office.pptx` slide1.xml.
    const seed: number = Number(args.id) || 1;
    const cNvPr: OoxmlElement = el(PML_NS, 'cNvPr', 'p', [attr('', 'id', args.id), attr('', 'name', args.name)],
                                   [buildCreationIdExtLst(creationIdGuid(seed))]);
    const cNvPicPr: OoxmlElement = el(PML_NS, 'cNvPicPr', 'p', [], []);
    const nvPr: OoxmlElement = el(PML_NS, 'nvPr', 'p', [], []);
    const nvPicPr: OoxmlElement = el(PML_NS, 'nvPicPr', 'p', [], [cNvPr, cNvPicPr, nvPr]);
    const blip: OoxmlElement = el(DML_NS, 'blip', 'a',
    // Prefer conventional `r:` prefix (Office / fixtures); identity is still URI+localName.
                                  [attr(OFFICE_REL_ATTR_NS, 'embed', args.embedRId, 'r')], []);
    // Minimal stretch from picture-fixture / PowerPoint-style CT_BlipFillProperties.
    const fillRect: OoxmlElement = el(DML_NS, 'fillRect', 'a', [], []);
    const stretch: OoxmlElement = el(DML_NS, 'stretch', 'a', [], [fillRect]);
    const blipFill: OoxmlElement = el(PML_NS, 'blipFill', 'p', [], [blip, stretch]);
    const off: OoxmlElement = el(DML_NS, 'off', 'a', [
        attr('', 'x', coordinateToEmuString(args.bounds.x, 'bounds.x')),
        attr('', 'y', coordinateToEmuString(args.bounds.y, 'bounds.y'))
    ], []);
    const ext: OoxmlElement = el(DML_NS, 'ext', 'a', [
        attr('', 'cx', coordinateToEmuString(args.bounds.width, 'bounds.width')),
        attr('', 'cy', coordinateToEmuString(args.bounds.height, 'bounds.height'))
    ], []);
    const xfrmEl: OoxmlElement = el(DML_NS, 'xfrm', 'a', [], [off, ext]);
    const avLst: OoxmlElement = el(DML_NS, 'avLst', 'a', [], []);
    const prstGeom: OoxmlElement = el(DML_NS, 'prstGeom', 'a', [attr('', 'prst', 'rect')], [avLst]);
    const spPr: OoxmlElement = el(PML_NS, 'spPr', 'p', [], [xfrmEl, prstGeom]);
    return el(PML_NS, 'pic', 'p', [], [nvPicPr, blipFill, spPr]);
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @param {string} prefix - The prefix value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(namespaceUri: string, localName: string, value: string, prefix?: string): OoxmlAttribute {
    if (prefix === undefined) {
        return { namespaceUri, localName, value };
    }
    return { namespaceUri, localName, value, prefix };
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} prefixHint - The prefixHint value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @returns {OoxmlElement} The result.
 */
function el(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
            children: ReadonlyArray<OoxmlElement | {
                readonly kind: 'text';
                readonly text: string;
            }>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName,
        attributes,
        children,
        prefixHint
    };
}
