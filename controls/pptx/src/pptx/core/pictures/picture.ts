/**
 * Picture handle for a `p:pic` shape-tree node (read / preserve / retarget).
 *
 * @remarks
 * Citation: Transitional `pml.xsd` `CT_Picture`, `CT_PictureNonVisual`;
 * `dml-main.xsd` `CT_Blip`, `AG_Blob`, `CT_BlipFillProperties`; image relationship
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/image`.
 *
 * **Security:** {@link Picture.linkTarget} and blip `r:link` must never trigger a
 * network fetch. {@link Picture.readEmbeddedBytes} returns package part octets only
 * — no image decode. Insert via {@link ShapeCollection.addPicture}. Retarget via
 * {@link Picture.replaceImageData} always writes a **new** media part.
 */
import { InvalidPackageError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { OoxmlElement } from '../xml/index';
import { PictureMediaAccess } from './media-access';
import { readEmbeddedPartBytes, readExternalLinkTarget } from './media-access';
import { readPictureBlipIds } from './read-picture';
import { replaceImageDataInternal, ReplaceImageDataOptions } from './retarget-embedded';
import { HyperlinkView } from '../slideimplementation/slide';
import { readPictureHyperlinkView, removePictureHyperlink, setPictureHyperlink } from '../../features/hyperlinks-actions/facade';
/**
 * Optional host binding for picture mutation (retarget).
 *
 * @internal
 */
export interface PictureMutationContext {
    readonly hostRoot?: OoxmlElement;
    readonly partName?: string;
    readonly limits?: SecurityLimits;
    readonly onMutate?: () => void;
}
/**
 * Read/write view of an embedded or linked picture blip on a `p:pic` shape.
 *
 * @remarks
 * Obtained from `slide.shapes[n]` when the node is `p:pic`, and from
 * {@link Shape.asPicture}. Relationship resolution uses media access attached at load.
 *
 * The walk returns this class for `p:pic` after copying shape identity, so
 * `slide.shapes[n] as Picture` and `instanceof Picture` work the same way as
 * `as Table`. A non-picture shape fails `instanceof Picture`.
 */
export class Picture {
    /** @internal Live `p:pic`. Subclasses that are also a {@link Shape} leave this unset and use the shape element. */
    protected blipElement: OoxmlElement | undefined;
    /** @internal Package media. Shape pictures leave this unset and use the shape media. */
    protected blipMedia: PictureMediaAccess | undefined;
    private readonly mutation: PictureMutationContext | undefined;
    private detached: boolean = false;
    /**
     * @internal
     * @param {OoxmlElement} element - Live `p:pic` element.
     * @param {PictureMediaAccess | undefined} media - Optional package access for embed bytes / external link Target.
     * @param {PictureMutationContext} mutation - Optional host root / limits / onMutate for retarget.
     */
    constructor(element: OoxmlElement, media: PictureMediaAccess | undefined, mutation?: PictureMutationContext) {
        this.blipElement = element;
        this.blipMedia = media;
        this.mutation = mutation;
    }
    /**
     * Live `p:pic` element for this handle.
     *
     * @internal
     * @returns {OoxmlElement} The result.
     */
    getElement(): OoxmlElement {
        return this.pictureElement();
    }
    /**
     * `p:pic` this handle mutates. Shape-list pictures use the shape host element.
     *
     * @internal
     */
    protected pictureElement(): OoxmlElement {
        if (this.blipElement !== undefined) {
            return this.blipElement;
        }
        const host: { getHostElement?: () => OoxmlElement } = this as { getHostElement?: () => OoxmlElement };
        if (host.getHostElement !== undefined) {
            return host.getHostElement();
        }
        throw new InvalidPackageError('Picture has no element');
    }
    /**
     * Media access for embed bytes and retarget.
     *
     * @internal
     */
    protected pictureMedia(): PictureMediaAccess | undefined {
        if (this.blipMedia !== undefined) {
            return this.blipMedia;
        }
        const host: { getMediaAccess?: () => PictureMediaAccess | undefined } = this as {
            getMediaAccess?: () => PictureMediaAccess | undefined;
        };
        if (host.getMediaAccess !== undefined) {
            return host.getMediaAccess();
        }
        return undefined;
    }
    /**
     * Host root bound at insert or load, when present.
     *
     * @internal
     * @returns {OoxmlElement | undefined} The result.
     */
    getHostRoot(): OoxmlElement | undefined {
        return this.mutation === undefined ? undefined : this.mutation.hostRoot;
    }
    /**
     * Slide part name bound at insert or load, when present.
     *
     * @internal
     * @returns {string | undefined} The result.
     */
    getMutationPartName(): string | undefined {
        return this.mutation === undefined ? undefined : this.mutation.partName;
    }
    /**
     * Package media access attached at slide load/create, if any.
     *
     * @internal
     * @returns {PictureMediaAccess | undefined} The result.
     */
    getMediaAccess(): PictureMediaAccess | undefined {
        return this.pictureMedia();
    }
    /**
     * Whether {@link ShapeCollection.removePicture} already detached this handle.
     *
     * @internal
     * @returns {boolean} The result.
     */
    isDetached(): boolean {
        return this.detached;
    }
    /**
     * Marks the handle detached after successful remove (fail-closed double-remove).
     *
     * @internal
     * @returns {void} Nothing.
     */
    markDetached(): void {
        this.detached = true;
    }
    /**
     * `a:blip/@r:embed` relationship Id when present.
     *
     * @remarks Citation: `dml-main.xsd` `AG_Blob` / `CT_Blip`. Empty XSD default is treated as absent. Resolve to part bytes with {@link
     * Picture.readEmbeddedBytes}.
     * @returns {string | undefined} The result.
     */
    get embedRelationshipId(): string | undefined {
        if (this.detached) {
            return undefined;
        }
        return readPictureBlipIds(this.pictureElement()).embedRelationshipId;
    }
    /**
     * External relationship **Target** string when `r:link` points at TargetMode External.
     *
     * @remarks **Never fetched.** Returns the authored Target from the slide relationships part only. When `r:link` is absent,
         the relationship is missing, or the target is Internal,
             returns `undefined`. Citation: `AG_Blob` `r:link`; OPC External relationships. /
     * @returns {string | undefined} The result.
     */
    get linkTarget(): string | undefined {
        if (this.detached) {
            return undefined;
        }
        const linkId: string = readPictureBlipIds(this.pictureElement()).linkRelationshipId;
        if (linkId === undefined || this.pictureMedia() === undefined) {
            return undefined;
        }
        return readExternalLinkTarget(this.pictureMedia(), linkId);
    }
    /**
     * `a:blip/@r:link` relationship Id when present (not the Target URI).
     *
     * @remarks Prefer {@link Picture.linkTarget} for the External URI string. This id is useful for preserve diagnostics without resolving
     * the relationship.
     * @returns {string | undefined} The result.
     */
    get linkRelationshipId(): string | undefined {
        if (this.detached) {
            return undefined;
        }
        return readPictureBlipIds(this.pictureElement()).linkRelationshipId;
    }
    /**
     * Package part bytes for the Internal `r:embed` target, when present.
     *
     * @remarks Does **not** decode PNG/JPEG or open `r:link`. Callers must not assume a particular image codec beyond content-type on the
     * part.
     * @returns {Uint8Array | undefined} A copy of the media part octets, or `undefined` when embed is
     */
    readEmbeddedBytes(): Uint8Array | undefined {
        if (this.detached) {
            return undefined;
        }
        const embedId: string = this.embedRelationshipId;
        if (embedId === undefined || this.pictureMedia() === undefined) {
            return undefined;
        }
        return readEmbeddedPartBytes(this.pictureMedia(), embedId);
    }
    /**
     * Replaces the embedded image with a **new** media part and Internal relationship.
     *
     * @throws {Error} When the handle is detached, missing host binding / write access,
         link-only (no `r:embed`), MIME is disallowed, or the picture is not under the bound host root.
     * @throws {Error} When package size/count/relationship limits would be exceeded by the new part.
     * @remarks - Always creates a new `/ppt/media/imageN.{ext}` part (no in-place rewrite, no hash dedupe). - Sets `a:blip/@r:embed` and
     * removes `r:link` on that blip when present. - Preserves blip effect children, `srcRect` / stretch siblings, `cNvPr/@id`, name, and
     * `spPr`. - GCs the previous embed (and unused link) relationship/media when refcounts drop to zero — same rules as {@link
     * ShapeCollection.removePicture}. - Link-only pictures **reject**; never fetches External Targets.
     * @param {ReplaceImageDataOptions} options - New image octets and allowlisted content type.
     * @returns {void} Nothing.
     */
    /**
     * Sets or replaces the picture click hyperlink (`p:cNvPr/a:hlinkClick`).
     *
     * @remarks Same target rules as {@link Shape.setHyperlink}, including file names such as `WordDocument.docx` (`TargetMode=External`).
     * @param target - URL, mailto, file name, or 1-based slide index.
     * @returns {HyperlinkView} The click hyperlink just written.
     */
    setHyperlink(target: string): HyperlinkView {
        return setPictureHyperlink(this, target);
    }
    /**
     * Click hyperlink view, or `undefined` when the picture has no `a:hlinkClick`.
     *
     * @returns {HyperlinkView | undefined} The result.
     */
    get hyperlink(): HyperlinkView | undefined {
        return readPictureHyperlinkView(this);
    }
    /**
     * Removes the picture click hyperlink. No-op when absent. Does not renumber `cNvPr/@id`.
     *
     * @returns {void} Nothing.
     */
    removeHyperlink(): void {
        removePictureHyperlink(this);
    }
    /**
     * Replaces the embedded image with a **new** media part and Internal relationship.
     *
     * @throws {Error} When the handle is detached, missing host binding / write access,
         link-only (no `r:embed`), MIME is disallowed, or the picture is not under the bound host root.
     * @throws {Error} When package size/count/relationship limits would be exceeded by the new part.
     * @remarks - Always creates a new `/ppt/media/imageN.{ext}` part (no in-place rewrite, no hash dedupe). - Sets `a:blip/@r:embed` and
     * removes `r:link` on that blip when present. - Preserves blip effect children, `srcRect` / stretch siblings, `cNvPr/@id`, name, and
     * `spPr`. - GCs the previous embed (and unused link) relationship/media when refcounts drop to zero — same rules as {@link
     * ShapeCollection.removePicture}. - Link-only pictures **reject**; never fetches External Targets.
     * @param {ReplaceImageDataOptions} options - New image octets and allowlisted content type.
     * @returns {void} Nothing.
     */
    replaceImageData(options: ReplaceImageDataOptions): void {
        const media: PictureMediaAccess | undefined = this.pictureMedia();
        if (media === undefined) {
            const diagPart: string = (this.mutation == null ? undefined : this.mutation.partName);
            throw new InvalidPackageError('Picture retarget requires package media access on the slide',
                                          diagPart === undefined ? {} : { partName: diagPart });
        }
        const shapeHost: {
            getHostRoot?: () => OoxmlElement | undefined;
            getMutationPartName?: () => string | undefined;
            boundLimits?: SecurityLimits;
            boundPartName?: string | undefined;
        } = this as {
            getHostRoot?: () => OoxmlElement | undefined;
            getMutationPartName?: () => string | undefined;
            boundLimits?: SecurityLimits;
            boundPartName?: string | undefined;
        };
        const hostRoot: OoxmlElement | undefined = this.mutation === undefined || this.mutation.hostRoot === undefined
            ? (shapeHost.getHostRoot === undefined ? undefined : shapeHost.getHostRoot())
            : this.mutation.hostRoot;
        const partName: string | undefined = this.mutation === undefined || this.mutation.partName === undefined
            ? (shapeHost.boundPartName !== undefined
                ? shapeHost.boundPartName
                : (shapeHost.getMutationPartName === undefined ? undefined : shapeHost.getMutationPartName()))
            : this.mutation.partName;
        const limits: SecurityLimits | undefined = this.mutation === undefined || this.mutation.limits === undefined
            ? shapeHost.boundLimits
            : this.mutation.limits;
        const context: {
            hostRoot: OoxmlElement | undefined;
            partName: string | undefined;
            limits: SecurityLimits | undefined;
            onMutate?: () => void;
        } = {
            hostRoot,
            partName,
            limits
        };
        const onMutate: (() => void) | undefined = this.mutation === undefined ? undefined : this.mutation.onMutate;
        if (onMutate !== undefined) {
            context.onMutate = onMutate;
        }
        replaceImageDataInternal({
            picture: this,
            media,
            context,
            options
        });
    }
}
