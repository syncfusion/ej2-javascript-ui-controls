export * from './caption-authoring-api';
export * from './caption-enums';
export * from './caption-host';
export * from './captions';
export * from './host-codec';
export * from './image-sniff';
export * from './layout-types';
import { sha256Hex } from '../../core/compat/sha256';
import { DocxError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { EntityType } from '../document/entity-type';
import { pointToEmus, emuToPoint, scalePoint, pxToPoint } from '../document/length';
import { Paragraph } from '../document/paragraph';
import { FeatureInlineParagraphItem, FeatureRunParagraphItem, ParagraphItem } from '../document/text-range';
import { allocateRelationshipId, relationshipsWith, TargetMode, OpcRelationship, RelationshipId, Relationships } from '../../core/opc/relationships';
import { partByName, relationshipsForPart, withPartRelationships, OpcPackage, PackagePart } from '../../core/opc/package';
import { partName, partNameKey, resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { BlockContent } from '../document/paragraph';
import { featureId, registerFeature, registerFeatureMaterializeHandler, registerFeatureMultiPartHandler, registerFeatureRunLeafHandler, replaceOrAddPackagePart, usedMainDocumentRelationshipIds, visitBlocksInDocumentOrder, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { sniffImageContentType, sniffImagePixelDimensions } from './image-sniff';
import { requirePictureCaptionAuthoring } from './caption-authoring-api';
import { CaptionNumberingFormat, CaptionPosition, CaptionNumberingFormat as CaptionNumberingFormatValue, CaptionPosition as CaptionPositionValue } from './caption-enums';
import { bindCaptionHostDocument, hostDocumentOf } from './caption-host';
import { decodePictureHost, encodePictureHost, EncodePictureHostInput, PictureHostState } from './host-codec';
import { assertEnumMember, HORIZONTAL_ALIGNMENT_SET, HORIZONTAL_ORIGIN_SET, HorizontalOrigin, PicturePlacement, PICTURE_PLACEMENT_SET, TEXT_WRAPPING_STYLE_SET, TextWrappingStyle, VERTICAL_ALIGNMENT_SET, VERTICAL_ORIGIN_SET, VerticalOrigin, HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, PicturePlacement as PicturePlacementType, TextWrappingStyle as TextWrappingStyleType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from './layout-types';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { ContentTypeRecord } from '../../core/opc/content-types';
const IMAGES: FeatureId = featureId('images');
/**
 *  Transitional image relationship (ECMA-376-4 Â§9.2.10).
 *
 * @private
 */
export const IMAGE_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
/**
 *  Strict image relationship (ECMA-376-1 Â§11.3.10).
 *
 * @private
 */
export const STRICT_IMAGE_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/image';
const IMAGE_RELATIONSHIP_TYPES: string[] = [IMAGE_RELATIONSHIP_TYPE, STRICT_IMAGE_RELATIONSHIP_TYPE];
/**
 *  PNG media type (ECMA-376-1 Â§15.2.14).
 *
 * @private
 */
const PNG_CONTENT_TYPE: string = 'image/png';
/**
 *  JPEG media type (ECMA-376-1 Â§15.2.14).
 *
 * @private
 */
const JPEG_CONTENT_TYPE: string = 'image/jpeg';
/** Supported image content types for create/replace.
 *
 * @public
 */
type ImageType = typeof PNG_CONTENT_TYPE | typeof JPEG_CONTENT_TYPE;
/** Default display size (points) when intrinsic pixels cannot be sniffed. */
const DEFAULT_IMAGE_WIDTH_PT: number = 100;
const DEFAULT_IMAGE_HEIGHT_PT: number = 100;

/**
 * Options for {@link Paragraph.appendImage}.
 */
export interface ImageOptions {
    /**
     * Gets the display width in points.
     */
    readonly width?: number;
    /**
     * Gets the display height in points.
     */
    readonly height?: number;
    /**
     * Gets the image type.
     */
    readonly imageType?: ImageType;
    /**
     * Gets the name of the image.
     *
     * @defaultValue `'Picture'`
     */
    readonly name?: string;
    /**
     * Gets the title of the image.
     */
    readonly title?: string;
    /**
     * Gets the alternative text description of the image.
     */
    readonly description?: string;
    /**
     * Gets a value indicating whether the lock aspect ratio option is enabled.
     *
     * @defaultValue `true`
     */
    readonly lockAspectRatio?: boolean;
    /**
     * Gets the rotation angle of the image, in degrees.
     */
    readonly rotation?: number;
    /**
     * Gets a value indicating whether the flip horizontal option is enabled.
     */
    readonly flipHorizontal?: boolean;
    /**
     * Gets a value indicating whether the flip vertical option is enabled.
     */
    readonly flipVertical?: boolean;
    /**
     * Gets the host placement.
     */
    readonly placement?: PicturePlacementType;
    /**
     * Gets the text wrapping.
     *
     * @defaultValue `'inline'`
     */
    readonly textWrappingStyle?: TextWrappingStyleType;
    /**
     * Gets the wrapping.
     *
     * @deprecated Use {@link textWrappingStyle} instead.
     */
    readonly wrapping?: TextWrappingStyleType;
    /**
     * Gets the horizontal origin.
     */
    readonly horizontalOrigin?: HorizontalOriginType;
    /**
     * Gets the vertical origin.
     */
    readonly verticalOrigin?: VerticalOriginType;
    /**
     * Gets the horizontal position.
     */
    readonly horizontalPosition?: number;
    /**
     * Gets the vertical position.
     */
    readonly verticalPosition?: number;
    /**
     * Gets the horizontal alignment.
     */
    readonly horizontalAlignment?: HorizontalAlignmentType;
    /**
     * Gets the vertical alignment.
     */
    readonly verticalAlignment?: VerticalAlignmentType;
}
/** @deprecated Use {@link ImageOptions}. */
export type InsertImageOptions = ImageOptions;
function resolveImageLayout(bytes: Uint8Array, options: ImageOptions | undefined): {
    width: number;
    height: number;
    contentType: ImageType;
} {
    const opts: ImageOptions = options != null ? options : {};
    const pixels: { width: number; height: number; } = sniffImagePixelDimensions(bytes);
    const hasW: boolean = opts.width !== undefined;
    const hasH: boolean = opts.height !== undefined;
    let width: number;
    let height: number;
    if (hasW && hasH) {
        width = opts.width as number;
        height = opts.height as number;
    }
    else if (hasW && !hasH) {
        width = opts.width as number;
        if (pixels !== undefined && pixels.width > 0) {
            height = scalePoint(width, pixels.height / pixels.width);
        }
        else {
            height = DEFAULT_IMAGE_HEIGHT_PT;
        }
    }
    else if (!hasW && hasH) {
        height = opts.height as number;
        if (pixels !== undefined && pixels.height > 0) {
            width = scalePoint(height, pixels.width / pixels.height);
        }
        else {
            width = DEFAULT_IMAGE_WIDTH_PT;
        }
    }
    else if (pixels !== undefined && pixels.width > 0 && pixels.height > 0) {
        width = pxToPoint(pixels.width);
        height = pxToPoint(pixels.height);
    }
    else {
        width = DEFAULT_IMAGE_WIDTH_PT;
        height = DEFAULT_IMAGE_HEIGHT_PT;
    }
    const sniffed: ImageType = sniffImageContentType(bytes);
    const contentType: ImageType = opts.imageType != null ? opts.imageType : sniffed;
    if (contentType === undefined) {
        throw new DocxError('content/invalid-image', 'Image contentType is required when bytes are not PNG or JPEG');
    }
    return { width, height, contentType };
}
interface ImagePartEntry {
    readonly partName: PartName;
    readonly relationshipId: RelationshipId;
    readonly relationshipType: string;
    /** Package content type (PNG/JPEG for authoring; other image/* on open). */
    contentType: string;
    data: Uint8Array;
    dirty: boolean;
    pendingRelationship: OpcRelationship | undefined;
}
interface ImageInit {
    readonly relationshipId: string;
    /** Display width in points (`wp:extent/@cx` EMU at host boundary). */
    readonly width: number;
    /** Display height in points (`wp:extent/@cy` EMU at host boundary). */
    readonly height: number;
    readonly name?: string;
    readonly title?: string;
    readonly description?: string;
    readonly lockAspectRatio?: boolean;
    readonly rotation?: number;
    readonly flipHorizontal?: boolean;
    readonly flipVertical?: boolean;
    readonly placement?: PicturePlacementType;
    readonly wrapping?: TextWrappingStyleType;
    readonly horizontalOrigin?: HorizontalOriginType;
    readonly verticalOrigin?: VerticalOriginType;
    readonly horizontalPosition?: number;
    readonly verticalPosition?: number;
    readonly horizontalAlignment?: HorizontalAlignmentType;
    readonly verticalAlignment?: VerticalAlignmentType;
    readonly docPrId?: number;
    readonly preservedHost?: OpenXmlElement;
    readonly layoutDirty?: boolean;
    /** DrawingML picture hyperlink relationship id (`a:hlinkClick/@r:id`). */
    readonly hyperlinkRelationshipId?: string;
    /** Runtime target URI for picture-backed hyperlinks (not serialized on the picture part). */
    readonly hyperlinkTarget?: string;
}
/**
 * Build {@link ImageInit} without writing `undefined` into optional
 * fields (`exactOptionalPropertyTypes`).
 *
 * @param {Object} parts - Specifies the parts.
 * @returns {ImageInit} Returns the result.
 */
function imageInit(parts: {
    readonly relationshipId: string;
    readonly width: number;
    readonly height: number;
    readonly name?: string | undefined;
    readonly title?: string | undefined;
    readonly description?: string | undefined;
    readonly lockAspectRatio?: boolean | undefined;
    readonly rotation?: number | undefined;
    readonly flipHorizontal?: boolean | undefined;
    readonly flipVertical?: boolean | undefined;
    readonly placement?: PicturePlacementType | undefined;
    readonly wrapping?: TextWrappingStyleType | undefined;
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    readonly verticalOrigin?: VerticalOriginType | undefined;
    readonly horizontalPosition?: number | undefined;
    readonly verticalPosition?: number | undefined;
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
    readonly verticalAlignment?: VerticalAlignmentType | undefined;
    readonly docPrId?: number | undefined;
    readonly preservedHost?: OpenXmlElement | undefined;
    readonly layoutDirty?: boolean | undefined;
    readonly hyperlinkRelationshipId?: string | undefined;
    readonly hyperlinkTarget?: string | undefined;
}): ImageInit {
    return {
        relationshipId: parts.relationshipId,
        width: parts.width,
        height: parts.height,
        ...(parts.name !== undefined ? { name: parts.name } : {}),
        ...(parts.title !== undefined ? { title: parts.title } : {}),
        ...(parts.description !== undefined ? { description: parts.description } : {}),
        ...(parts.lockAspectRatio !== undefined
            ? { lockAspectRatio: parts.lockAspectRatio }
            : {}),
        ...(parts.rotation !== undefined ? { rotation: parts.rotation } : {}),
        ...(parts.flipHorizontal !== undefined
            ? { flipHorizontal: parts.flipHorizontal }
            : {}),
        ...(parts.flipVertical !== undefined ? { flipVertical: parts.flipVertical } : {}),
        ...(parts.placement !== undefined ? { placement: parts.placement } : {}),
        ...(parts.wrapping !== undefined ? { wrapping: parts.wrapping } : {}),
        ...(parts.horizontalOrigin !== undefined
            ? { horizontalOrigin: parts.horizontalOrigin }
            : {}),
        ...(parts.verticalOrigin !== undefined
            ? { verticalOrigin: parts.verticalOrigin }
            : {}),
        ...(parts.horizontalPosition !== undefined
            ? { horizontalPosition: parts.horizontalPosition }
            : {}),
        ...(parts.verticalPosition !== undefined
            ? { verticalPosition: parts.verticalPosition }
            : {}),
        ...(parts.horizontalAlignment !== undefined
            ? { horizontalAlignment: parts.horizontalAlignment }
            : {}),
        ...(parts.verticalAlignment !== undefined
            ? { verticalAlignment: parts.verticalAlignment }
            : {}),
        ...(parts.docPrId !== undefined ? { docPrId: parts.docPrId } : {}),
        ...(parts.preservedHost !== undefined ? { preservedHost: parts.preservedHost } : {}),
        ...(parts.layoutDirty !== undefined ? { layoutDirty: parts.layoutDirty } : {}),
        ...(parts.hyperlinkRelationshipId !== undefined
            ? { hyperlinkRelationshipId: parts.hyperlinkRelationshipId }
            : {}),
        ...(parts.hyperlinkTarget !== undefined ? { hyperlinkTarget: parts.hyperlinkTarget } : {})
    };
}
function resolvePlacementAndWrapping(placement: PicturePlacementType | undefined, wrapping: TextWrappingStyleType | undefined): {
    placement: PicturePlacementType;
    wrapping: TextWrappingStyleType;
} {
    const wrap: TextWrappingStyleType = wrapping != null ? wrapping : TextWrappingStyle.Inline;
    if (wrap !== TextWrappingStyle.Inline) {
        return { placement: PicturePlacement.Anchored, wrapping: wrap };
    }
    if (placement === PicturePlacement.Anchored) {
        return { placement: PicturePlacement.Anchored, wrapping: TextWrappingStyle.None };
    }
    return { placement: PicturePlacement.Inline, wrapping: TextWrappingStyle.Inline };
}
/**
 * Represents a picture in a paragraph.
 *
 * Setting {@link Image.textWrappingStyle} to a value other than inline positions the picture relative to the text. Setting it back to inline discards the position and wrapping settings.
 *
 * @public
 */
export class Picture implements FeatureRunLeaf {
    /**
     * Gets the entity type of the item. Always {@link EntityType.Picture}.
     *
     * @public
     */
    readonly type: EntityType.Picture = EntityType.Picture;
    private relationshipIdValue: string;
    /** Display width in points. */
    private widthValue: number;
    /** Display height in points. */
    private heightValue: number;
    private nameValue: string;
    private titleValue: string | undefined;
    private descriptionValue: string | undefined;
    private lockAspectRatioValue: boolean;
    private rotationValue: number;
    private flipHorizontalValue: boolean;
    private flipVerticalValue: boolean;
    private placementValue: PicturePlacementType;
    private wrappingValue: TextWrappingStyleType;
    private horizontalOriginValue: HorizontalOriginType | undefined;
    private verticalOriginValue: VerticalOriginType | undefined;
    private horizontalPositionValue: number | undefined;
    private verticalPositionValue: number | undefined;
    private horizontalAlignmentValue: HorizontalAlignmentType | undefined;
    private verticalAlignmentValue: VerticalAlignmentType | undefined;
    private docPrIdValue: number;
    private preservedHostValue: OpenXmlElement | undefined;
    private layoutDirtyValue: boolean;
    private hyperlinkRelationshipIdValue: string | undefined;
    private hyperlinkTargetValue: string | undefined;
    private cloneSourceBytes: Uint8Array | undefined;
    /**
     * Initializes a new instance of the Picture class.
     *
     * Call {@link loadImage} to supply the image bytes before the document is saved.
     *
     * @example
     * ```typescript
     * const picture = new Picture(document);
     * picture.loadImage(imageBytes);
     * ```
     *
     * @param {WordDocument} document - Specifies the owning {@link WordDocument}.
     * @public
     */
    constructor(document: WordDocument);
    /**
     * @private
     */
    constructor(relationshipId: string, width: number, height: number);
    /**
     * @private
     */
    constructor(init: ImageInit);
    /**
     * Initializes a new instance of the Picture class.
     *
     * @param {WordDocument | string | ImageInit} documentOrRelationshipIdOrInit - Specifies the document or relationship id or init.
     * @param {number} width - Specifies the width.
     * @param {number} height - Specifies the height.
     */
    constructor(documentOrRelationshipIdOrInit: WordDocument | string | ImageInit, width?: number, height?: number) {
        if (documentOrRelationshipIdOrInit instanceof WordDocument) {
            this.relationshipIdValue = '';
            this.widthValue = DEFAULT_IMAGE_WIDTH_PT;
            this.heightValue = DEFAULT_IMAGE_HEIGHT_PT;
            this.nameValue = 'Picture';
            this.titleValue = undefined;
            this.descriptionValue = undefined;
            this.lockAspectRatioValue = true;
            this.rotationValue = 0;
            this.flipHorizontalValue = false;
            this.flipVerticalValue = false;
            this.placementValue = PicturePlacement.Inline;
            this.wrappingValue = TextWrappingStyle.Inline;
            this.horizontalOriginValue = undefined;
            this.verticalOriginValue = undefined;
            this.horizontalPositionValue = undefined;
            this.verticalPositionValue = undefined;
            this.horizontalAlignmentValue = undefined;
            this.verticalAlignmentValue = undefined;
            this.docPrIdValue = 1;
            this.preservedHostValue = undefined;
            this.layoutDirtyValue = true;
            this.hyperlinkRelationshipIdValue = undefined;
            this.hyperlinkTargetValue = undefined;
            bindCaptionHostDocument(this, documentOrRelationshipIdOrInit);
            return;
        }
        const init: ImageInit = typeof documentOrRelationshipIdOrInit === 'string'
            ? {
                relationshipId: documentOrRelationshipIdOrInit,
                width: width as number,
                height: height as number
            }
            : documentOrRelationshipIdOrInit;
        const resolved: { placement: PicturePlacementType; wrapping: TextWrappingStyleType; } =
            resolvePlacementAndWrapping(init.placement, init.wrapping);
        this.relationshipIdValue = init.relationshipId;
        this.widthValue = init.width;
        this.heightValue = init.height;
        this.nameValue = init.name != null ? init.name : 'Picture';
        this.titleValue = init.title;
        this.descriptionValue = init.description;
        this.lockAspectRatioValue = init.lockAspectRatio != null ? init.lockAspectRatio : true;
        this.rotationValue = init.rotation != null ? init.rotation : 0;
        this.flipHorizontalValue = init.flipHorizontal != null ? init.flipHorizontal : false;
        this.flipVerticalValue = init.flipVertical != null ? init.flipVertical : false;
        this.placementValue = resolved.placement;
        this.wrappingValue = resolved.wrapping;
        this.horizontalOriginValue = init.horizontalOrigin;
        this.verticalOriginValue = init.verticalOrigin;
        this.horizontalPositionValue = init.horizontalPosition;
        this.verticalPositionValue = init.verticalPosition;
        this.horizontalAlignmentValue = init.horizontalAlignment;
        this.verticalAlignmentValue = init.verticalAlignment;
        this.docPrIdValue = init.docPrId != null ? init.docPrId : 1;
        this.preservedHostValue = init.preservedHost;
        this.layoutDirtyValue = init.layoutDirty != null ? init.layoutDirty : init.preservedHost === undefined;
        this.hyperlinkRelationshipIdValue = init.hyperlinkRelationshipId;
        this.hyperlinkTargetValue = init.hyperlinkTarget;
    }
    /**
     *   Build from decoded host state.
     *
     * @param {PictureHostState} state - The state.
     * @returns {Picture} The result.
     * @private
     */
    static fromHostState(state: PictureHostState): Picture {
        return new Picture(imageInit({
            relationshipId: state.relationshipId,
            width: emuToPoint(state.widthEmu),
            height: emuToPoint(state.heightEmu),
            name: state.name,
            title: state.title,
            description: state.description,
            lockAspectRatio: state.lockAspectRatio,
            rotation: state.rotation,
            flipHorizontal: state.flipHorizontal,
            flipVertical: state.flipVertical,
            placement: state.placement,
            wrapping: state.wrapping,
            horizontalOrigin: state.horizontalOrigin,
            verticalOrigin: state.verticalOrigin,
            horizontalPosition: state.horizontalPosition,
            verticalPosition: state.verticalPosition,
            horizontalAlignment: state.horizontalAlignment,
            verticalAlignment: state.verticalAlignment,
            docPrId: state.docPrId,
            preservedHost: state.preservedHost,
            layoutDirty: false,
            hyperlinkRelationshipId: state.hyperlinkRelationshipId
        }));
    }
    /**
     * Gets or sets the display width in points.
     */
    get width(): number {
        return this.widthValue;
    }
    set width(value: number) {
        this.widthValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the display height in points.
     */
    get height(): number {
        return this.heightValue;
    }
    set height(value: number) {
        this.heightValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * @private
     * DrawingML picture hyperlink relationship id (`a:hlinkClick/@r:id`).
     */
    get hyperlinkRelationshipId(): string | undefined {
        return this.hyperlinkRelationshipIdValue;
    }
    set hyperlinkRelationshipId(value: string | undefined) {
        this.hyperlinkRelationshipIdValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * @private
     * Runtime target URI for a picture-backed hyperlink. Not written to the
     * picture DrawingML tree; the package relationship carries the target.
     */
    get hyperlinkTarget(): string | undefined {
        return this.hyperlinkTargetValue;
    }
    set hyperlinkTarget(value: string | undefined) {
        this.hyperlinkTargetValue = value;
    }
    /**
     * @private
     * Relationship id for the image media part; empty until materialized at save. */
    get relationshipId(): string {
        return this.relationshipIdValue;
    }
    /**
     * Gets or sets the non-visual picture name.
     *
     * @defaultValue `'Picture'` on authoring.
     */
    get name(): string {
        return this.nameValue;
    }
    set name(value: string) {
        this.nameValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the caption / accessibility title.
     */
    get title(): string | undefined {
        return this.titleValue;
    }
    set title(value: string | undefined) {
        this.titleValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the alternative text.
     */
    get description(): string | undefined {
        return this.descriptionValue;
    }
    set description(value: string | undefined) {
        this.descriptionValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the aspect-ratio lock.
     */
    get lockAspectRatio(): boolean {
        return this.lockAspectRatioValue;
    }
    set lockAspectRatio(value: boolean) {
        this.lockAspectRatioValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the clockwise rotation of the picture, in degrees.
     */
    get rotation(): number {
        return this.rotationValue;
    }
    set rotation(value: number) {
        if (!Number.isFinite(value)) {
            throw new RangeError(`Invalid rotation value "${String(value)}"; expected a finite number`);
        }
        this.rotationValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the horizontal flip.
     */
    get flipHorizontal(): boolean {
        return this.flipHorizontalValue;
    }
    set flipHorizontal(value: boolean) {
        this.flipHorizontalValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the vertical flip.
     */
    get flipVertical(): boolean {
        return this.flipVerticalValue;
    }
    set flipVertical(value: boolean) {
        this.flipVerticalValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the host placement.
     */
    get placement(): PicturePlacementType {
        return this.placementValue;
    }
    set placement(value: PicturePlacementType) {
        assertEnumMember('placement', value, PICTURE_PLACEMENT_SET);
        this.placementValue = value;
        if (value === PicturePlacement.Inline) {
            this.wrappingValue = TextWrappingStyle.Inline;
        }
        else if (this.wrappingValue === TextWrappingStyle.Inline) {
            this.wrappingValue = TextWrappingStyle.None;
        }
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets how text wraps around the picture.
     *
     * Setting the value back to inline discards the position and wrapping settings of the picture.
     *
     * @throws RangeError when `value` is not a known {@link TextWrappingStyle}.
     */
    get textWrappingStyle(): TextWrappingStyleType {
        return this.wrappingValue;
    }
    set textWrappingStyle(value: TextWrappingStyleType) {
        assertEnumMember('textWrappingStyle', value, TEXT_WRAPPING_STYLE_SET);
        this.wrappingValue = value;
        if (value === TextWrappingStyle.Inline) {
            this.placementValue = PicturePlacement.Inline;
        }
        else {
            this.placementValue = PicturePlacement.Anchored;
        }
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets how text wraps around the picture.
     *
     * @deprecated Use {@link textWrappingStyle} instead.
     */
    get wrapping(): TextWrappingStyleType {
        return this.textWrappingStyle;
    }
    /**
     * @param {TextWrappingStyleType} value - Specifies the value.
     * @returns {void} Nothing.
     * @deprecated Use {@link textWrappingStyle} instead.
     */
    set wrapping(value: TextWrappingStyleType) {
        this.textWrappingStyle = value;
    }
    /**
     * Gets or sets the horizontal origin.
     */
    get horizontalOrigin(): HorizontalOriginType | undefined {
        return this.horizontalOriginValue;
    }
    set horizontalOrigin(value: HorizontalOriginType | undefined) {
        if (value !== undefined) {
            assertEnumMember('horizontalOrigin', value, HORIZONTAL_ORIGIN_SET);
        }
        this.horizontalOriginValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the vertical origin.
     */
    get verticalOrigin(): VerticalOriginType | undefined {
        return this.verticalOriginValue;
    }
    set verticalOrigin(value: VerticalOriginType | undefined) {
        if (value !== undefined) {
            assertEnumMember('verticalOrigin', value, VERTICAL_ORIGIN_SET);
        }
        this.verticalOriginValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the horizontal offset.
     */
    get horizontalPosition(): number | undefined {
        return this.horizontalPositionValue;
    }
    set horizontalPosition(value: number | undefined) {
        this.horizontalPositionValue = value;
        if (value !== undefined) {
            this.horizontalAlignmentValue = undefined;
        }
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the vertical offset.
     */
    get verticalPosition(): number | undefined {
        return this.verticalPositionValue;
    }
    set verticalPosition(value: number | undefined) {
        this.verticalPositionValue = value;
        if (value !== undefined) {
            this.verticalAlignmentValue = undefined;
        }
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the horizontal alignment.
     *
     * @throws RangeError when `value` is not a known {@link HorizontalAlignment}.
     */
    get horizontalAlignment(): HorizontalAlignmentType | undefined {
        return this.horizontalAlignmentValue;
    }
    set horizontalAlignment(value: HorizontalAlignmentType | undefined) {
        if (value !== undefined) {
            assertEnumMember('horizontalAlignment', value, HORIZONTAL_ALIGNMENT_SET);
            this.horizontalPositionValue = undefined;
        }
        this.horizontalAlignmentValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     * Gets or sets the vertical alignment.
     *
     * @throws RangeError when `value` is not a known {@link VerticalAlignment}.
     */
    get verticalAlignment(): VerticalAlignmentType | undefined {
        return this.verticalAlignmentValue;
    }
    set verticalAlignment(value: VerticalAlignmentType | undefined) {
        if (value !== undefined) {
            assertEnumMember('verticalAlignment', value, VERTICAL_ALIGNMENT_SET);
            this.verticalPositionValue = undefined;
        }
        this.verticalAlignmentValue = value;
        this.layoutDirtyValue = true;
    }
    /**
     *  @private
     *
     * @returns {boolean} The result.
     */
    isPendingRelationship(): boolean {
        return this.relationshipIdValue.length === 0;
    }
    /**
     *  @private
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     */
    resolveRelationshipId(relationshipId: string): void {
        this.relationshipIdValue = relationshipId;
    }
    /**
     *   Apply optional authoring fields from {@link ImageOptions}.
     *
     * @param {ImageOptions} options - The options.
     * @returns {void} Nothing is returned.
     * @private
     */
    applyAppendOptions(options: ImageOptions): void {
        if (options.name !== undefined) {
            this.name = options.name;
        }
        if (options.title !== undefined) {
            this.title = options.title;
        }
        if (options.description !== undefined) {
            this.description = options.description;
        }
        if (options.lockAspectRatio !== undefined) {
            this.lockAspectRatio = options.lockAspectRatio;
        }
        if (options.rotation !== undefined) {
            this.rotation = options.rotation;
        }
        if (options.flipHorizontal !== undefined) {
            this.flipHorizontal = options.flipHorizontal;
        }
        if (options.flipVertical !== undefined) {
            this.flipVertical = options.flipVertical;
        }
        const wrap: TextWrappingStyleType = options.textWrappingStyle !== undefined
            ? options.textWrappingStyle
            : options.wrapping;
        if (wrap !== undefined) {
            this.textWrappingStyle = wrap;
        }
        else if (options.placement !== undefined) {
            this.placement = options.placement;
        }
        if (options.horizontalOrigin !== undefined) {
            this.horizontalOrigin = options.horizontalOrigin;
        }
        if (options.verticalOrigin !== undefined) {
            this.verticalOrigin = options.verticalOrigin;
        }
        // Apply align before position so a simultaneous position wins XOR clear.
        if (options.horizontalAlignment !== undefined) {
            this.horizontalAlignment = options.horizontalAlignment;
        }
        if (options.verticalAlignment !== undefined) {
            this.verticalAlignment = options.verticalAlignment;
        }
        if (options.horizontalPosition !== undefined) {
            this.horizontalPosition = options.horizontalPosition;
        }
        if (options.verticalPosition !== undefined) {
            this.verticalPosition = options.verticalPosition;
        }
    }
    /**
     * Add a Word-style caption paragraph next to this picture.
     *
     * Creates a separate caption paragraph (built-in `Caption` style, centered,
     * spacing 30/240 twips) containing a `SEQ <captionName> \* <switch>` complex
     * field, inserted immediately before
     * ({@link CaptionPosition.Above}) or after ({@link CaptionPosition.Below})
     * the paragraph containing this picture. The picture and its paragraph are not
     * moved or modified. The initial field result is the next number in the
     * caption-name sequence; Microsoft Word remains authoritative on refresh.
     *
     * @returns {Paragraph} - Returns the new caption {@link Paragraph}; append additional caption text.
     * or adjust its formatting on the returned object.
     * @param {string} captionName - Specifies the caption name.
     * @param {CaptionNumberingFormat} numberingFormat - Specifies the numbering format.
     * @param {CaptionPosition} position - Specifies the position.
     * @throws DocxError `content/invalid-caption-name` when the name is empty or
     * whitespace-only.
     * @throws DocxError `content/invalid-caption-format` /
     * `content/invalid-caption-position` for unknown enum values.
     * @throws DetachedObjectError when this picture is not attached to a paragraph
     * in a main document body.
     */
    addCaption(captionName: string, numberingFormat: CaptionNumberingFormat, position: CaptionPosition): Paragraph {
        // Caption authoring reuses fields + styles. Those modules must not enter the
        // always-on core graph; load `./captions.js` (via `@syncfusion/ej2-docx/images` public
        // entry or a direct import) so the provider is installed first.
        return requirePictureCaptionAuthoring()(this, captionName, numberingFormat, position);
    }
    /**
     * Load image bytes into this picture instance.
     *
     * Loads image content into the current `Picture` instance, supporting:
     * - Newly created pictures
     * - Pictures loaded from existing documents
     *
     * If the picture already contains image data, calling `loadImage()` replaces
     * the existing image with the newly supplied image bytes. The replacement
     * occurs within the same `Picture` instance — no remove-and-add operation
     * is required.
     *
     * The Picture instance remains attached to its parent container after image
     * replacement. Parent references, collection indexes, and existing object
     * references remain unchanged. Only the underlying image data is replaced.
     *
     * @returns {void}
     * @param {Uint8Array} imageBytes - Specifies the image bytes.
     * @example
     * ```typescript
     * // Load image into a newly created picture
     * const picture = new Picture(document);
     * picture.loadImage(imageBytes);
     *
     * // Replace existing picture content (same instance / collection index)
     * const picture = paragraph.items[0] as Picture;
     * picture.loadImage(newImageBytes);
     * ```
     *
     * @throws DocxError when the picture is not attached to a document
     * @public
     */
    loadImage(imageBytes: Uint8Array): void {
        const document: WordDocument = hostDocumentOf(this);
        if (document === undefined) {
            throw new DocxError('model/detached-object', 'Picture is not attached to a document; cannot load image bytes');
        }
        const catalog: ImagesCatalog = imagesFor(document);
        const sniffed: ImageType = sniffImageContentType(imageBytes);
        const contentType: ImageType = sniffed != null ? sniffed : PNG_CONTENT_TYPE;
        if (this.isPendingRelationship()) {
            if (catalog.pendingBytesFor(this) !== undefined) {
                catalog.updatePendingBytes(this, imageBytes);
            }
            else {
                catalog.registerPendingImage(this, imageBytes, contentType);
            }
            return;
        }
        // Materialized relationship: replace media bytes in place (layout / rId unchanged).
        catalog.replaceBytes(this.relationshipId, imageBytes);
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        // If relationship is still pending, try to materialize it on-demand
        if (this.relationshipIdValue.length === 0) {
            const document: WordDocument = hostDocumentOf(this);
            if (document !== undefined) {
                const catalog: ImagesCatalog = imagesFor(document);
                const pending: Uint8Array = catalog.pendingBytesFor(this);
                if (pending !== undefined) {
                    // Materialize the relationship by allocating a part for this picture
                    const usedKeys: Set<string> = usedPartNameKeys(document, catalog);
                    const allocated: { entry: ImagePartEntry; relationshipId: string; } = catalog.allocatePart(
                        pending,
                        (sniffImageContentType(pending) || PNG_CONTENT_TYPE),
                        usedMainDocumentRelationshipIds(document),
                        usedKeys
                    );
                    this.resolveRelationshipId(allocated.relationshipId);
                    catalog.discardPendingImage(this);
                }
            }
        }

        if (this.relationshipIdValue.length === 0) {
            throw new DocxError('model/detached-object', 'Inline image relationship id is not materialized; save the document first');
        }
        const input: EncodePictureHostInput = {
            placement: this.placementValue,
            wrapping: this.wrappingValue,
            widthEmu: pointToEmus(this.widthValue),
            heightEmu: pointToEmus(this.heightValue),
            relationshipId: this.relationshipIdValue,
            name: this.nameValue,
            title: this.titleValue,
            description: this.descriptionValue,
            lockAspectRatio: this.lockAspectRatioValue,
            rotation: this.rotationValue,
            flipHorizontal: this.flipHorizontalValue,
            flipVertical: this.flipVerticalValue,
            horizontalOrigin: this.horizontalOriginValue != null ? this.horizontalOriginValue : HorizontalOrigin.Column,
            verticalOrigin: this.verticalOriginValue != null ? this.verticalOriginValue : VerticalOrigin.Paragraph,
            horizontalPosition: this.horizontalPositionValue,
            verticalPosition: this.verticalPositionValue,
            horizontalAlignment: this.horizontalAlignmentValue,
            verticalAlignment: this.verticalAlignmentValue,
            docPrId: this.docPrIdValue,
            preservedHost: this.preservedHostValue,
            layoutDirty: this.layoutDirtyValue,
            hyperlinkRelationshipId: this.hyperlinkRelationshipIdValue
        };
        return encodePictureHost(input);
    }

    /**
     * Create an independent copy of this picture.
     * All properties are cloned; image data is referenced (shared relationship ID).
     *
     * Note: The cloned picture is detached from any document. The image relationship
     * will be resolved during import or attachment to a target document.
     *
     * @returns {Picture} Cloned picture.
     * @public
     */
    clone(): Picture {
        const init: ImageInit = {
            relationshipId: this.relationshipIdValue,
            width: this.widthValue,
            height: this.heightValue,
            name: this.nameValue,
            title: this.titleValue,
            description: this.descriptionValue,
            lockAspectRatio: this.lockAspectRatioValue,
            rotation: this.rotationValue,
            flipHorizontal: this.flipHorizontalValue,
            flipVertical: this.flipVerticalValue,
            placement: this.placementValue,
            wrapping: this.wrappingValue,
            horizontalOrigin: this.horizontalOriginValue,
            verticalOrigin: this.verticalOriginValue,
            horizontalPosition: this.horizontalPositionValue,
            verticalPosition: this.verticalPositionValue,
            horizontalAlignment: this.horizontalAlignmentValue,
            verticalAlignment: this.verticalAlignmentValue,
            docPrId: this.docPrIdValue,
            preservedHost: this.preservedHostValue,
            layoutDirty: this.layoutDirtyValue,
            hyperlinkRelationshipId: this.hyperlinkRelationshipIdValue,
            hyperlinkTarget: this.hyperlinkTargetValue
        };
        const copy: Picture = new Picture(init);
        const host: WordDocument | undefined = hostDocumentOf(this);
        if (host !== undefined) {
            copy.cloneSourceBytes = inlinePictureBytes(host, this);
        }
        return copy;
    }
    /**
     * Registers explicit image `bytes` with `document` for this picture (header/footer imports,
     * where the source media lives under the part's own relationships).
     *
     * @param {WordDocument} document - The document that now owns this picture.
     * @param {Uint8Array} bytes - The image bytes.
     * @returns {void} Nothing is returned.
     * @private
     */
    adoptBytes(document: WordDocument, bytes: Uint8Array): void {
        this.cloneSourceBytes = bytes;
        this.adoptCloneBytes(document);
    }
    /**
     * Re-registers the image bytes captured by {@link clone} with `document`, giving this picture
     * its own media part there. Used when content is imported into another document.
     *
     * @param {WordDocument} document - The document that now owns this picture.
     * @returns {void} Nothing is returned.
     * @private
     */
    adoptCloneBytes(document: WordDocument): void {
        const bytes: Uint8Array | undefined = this.cloneSourceBytes;
        if (bytes === undefined) {
            return;
        }
        this.cloneSourceBytes = undefined;
        this.relationshipIdValue = '';
        bindCaptionHostDocument(this, document);
        this.loadImage(bytes);
    }
}
/**
 * Image media parts linked from the Main Document.
 *
 * @private
 */
export class ImagesCatalog implements FeatureMultiPackagePart {
    private readonly entries: Map<PartName, ImagePartEntry>;
    private readonly byRelationshipId: Map<string, ImagePartEntry>;
    private readonly pendingRemovals: ImagePartEntry[];
    /** Media parts referenced from non-main parts (headers/footers), applied on save. */
    private readonly scopedMedia: Array<{
        readonly source: PartName;
        readonly relationship: OpcRelationship;
        readonly media: ImagePartEntry;
    }> = [];
    private readonly pendingImages: Map<Picture, {
        readonly bytes: Uint8Array;
        readonly contentType: ImageType;
    }>;
    /**
     *  @private
     *
     * @param {Map<PartName, ImagePartEntry>} entries - The entries.
     */
    constructor(entries: Map<PartName, ImagePartEntry>) {
        this.entries = entries;
        this.byRelationshipId = new Map<string, ImagePartEntry>(
            [...entries.values()].map((entry: ImagePartEntry): [string, ImagePartEntry] => [entry.relationshipId, entry])
        );
        this.pendingRemovals = [];
        this.pendingImages = new Map();
    }
    /**
     *  @private
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     */
    removeEntry(relationshipId: string): void {
        const entry: ImagePartEntry = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            return;
        }
        this.entries.delete(entry.partName);
        this.byRelationshipId.delete(relationshipId);
        this.pendingRemovals.push(entry);
    }
    /**
     *  @private
     *
     * @returns {boolean} The result.
     */
    isDirty(): boolean {
        if (this.pendingRemovals.length > 0 || this.pendingImages.size > 0 || this.scopedMedia.length > 0) {
            return true;
        }
        for (const entry of this.entries.values()) {
            if (entry.dirty || entry.pendingRelationship !== undefined) {
                return true;
            }
        }
        return false;
    }
    /**
     *  @private
     *
     * @param {OpcPackage} pkg - The pkg.
     * @param {PartName} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage {
        let next: OpcPackage = pkg;
        for (const entry of this.entries.values()) {
            if (!entry.dirty && entry.pendingRelationship === undefined) {
                continue;
            }
            const rel: OpcRelationship =
                entry.pendingRelationship != null
                    ? entry.pendingRelationship
                    : relationshipsForPart(next, mainPartName).items.find((item: OpcRelationship) => item.id === entry.relationshipId);
            next = replaceOrAddPackagePart(next, mainPartName, entry.partName, entry.contentType, entry.data, rel);
            entry.dirty = false;
            entry.pendingRelationship = undefined;
        }
        for (const entry of this.pendingRemovals) {
            next = removeImagePartFromPackage(next, mainPartName, entry);
        }
        this.pendingRemovals.length = 0;
        const written: Set<string> = new Set<string>();
        const bySource: Map<PartName, OpcRelationship[]> = new Map<PartName, OpcRelationship[]>();
        for (const item of this.scopedMedia) {
            if (!written.has(partNameKey(item.media.partName))) {
                written.add(partNameKey(item.media.partName));
                next = replaceOrAddPackagePart(next, item.source, item.media.partName, item.media.contentType, item.media.data, undefined);
            }
            const list: OpcRelationship[] = bySource.get(item.source);
            if (list === undefined) {
                bySource.set(item.source, [item.relationship]);
            }
            else {
                list.push(item.relationship);
            }
        }
        for (const [source, added] of bySource) {
            const existing: Relationships = relationshipsForPart(next, source);
            next = withPartRelationships(next, source, relationshipsWith([...existing.items, ...added], existing.opaque));
        }
        this.scopedMedia.length = 0;
        return next;
    }
    /**
     *  Image bytes for a loaded relationship id.
     *
     * @param {string} relationshipId - Specifies the relationship id.
     * @returns {Uint8Array | undefined} Returns the result.
     */
    bytesForRelationship(relationshipId: string): Uint8Array | undefined {
        let ts330: any;
        return ((ts330 = this.byRelationshipId.get(relationshipId)), ts330 == null ? undefined : ts330.data);
    }
    /**
     *   Pending picture bytes before save-time materialization.
     *
     * @param {Picture} picture - The picture.
     * @returns {Uint8Array | undefined} The result.
     * @private
     */
    pendingBytesFor(picture: Picture): Uint8Array | undefined {
        let ts331: any;
        return ((ts331 = this.pendingImages.get(picture)), ts331 == null ? undefined : ts331.bytes);
    }
    /**
     *   Record picture intent without allocating package ids.
     *
     * @param {Picture} picture - The picture.
     * @param {Uint8Array} bytes - The bytes.
     * @param {ImageType} contentType - The content type.
     * @returns {void} Nothing is returned.
     * @private
     */
    registerPendingImage(picture: Picture, bytes: Uint8Array, contentType: ImageType): void {
        this.pendingImages.set(picture, { bytes, contentType });
    }
    /**
     *   Drop a pending picture that was removed before save.
     *
     * @param {Picture} picture - The picture.
     * @returns {void} Nothing is returned.
     * @private
     */
    discardPendingImage(picture: Picture): void {
        this.pendingImages.delete(picture);
    }
    /**
     *   Replace bytes on a not-yet-materialized picture.
     *
     * @param {Picture} picture - The picture.
     * @param {Uint8Array} bytes - The bytes.
     * @returns {void} Nothing is returned.
     * @private
     */
    updatePendingBytes(picture: Picture, bytes: Uint8Array): void {
        const pending: { readonly bytes: Uint8Array; readonly contentType: ImageType; } = this.pendingImages.get(picture);
        if (pending === undefined) {
            throw new DocxError('content/unknown-image', 'Pending inline image was not found');
        }
        this.pendingImages.set(picture, { ...pending, bytes });
    }
    /**
     *  @private
     *
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     */
    materializePending(document: WordDocument): void {
        if (this.pendingImages.size === 0) {
            return;
        }
        this.materializeHeaderFooterPending(document);
        if (this.pendingImages.size === 0) {
            return;
        }
        const hashToRelationshipId: Map<string, string> = new Map<string, string>();
        visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
            for (const picture of picturesInParagraph(paragraph)) {
                if (!picture.isPendingRelationship()) {
                    continue;
                }
                const pending: { readonly bytes: Uint8Array; readonly contentType: ImageType; } = this.pendingImages.get(picture);
                if (pending === undefined) {
                    continue;
                }
                const hash: string = sha256(pending.bytes);
                let relationshipId: string = hashToRelationshipId.get(hash);
                if (relationshipId === undefined) {
                    const allocated: { entry: ImagePartEntry; relationshipId: string } = this.allocatePart(
                        pending.bytes,
                        pending.contentType,
                        usedRelationshipIds(document, this),
                        usedPartNameKeys(document, this)
                    );
                    relationshipId = allocated.relationshipId;
                    hashToRelationshipId.set(hash, relationshipId);
                }
                picture.resolveRelationshipId(relationshipId);
                this.pendingImages.delete(picture);
            }
        });
    }
    /**
     *  Resolve pending pictures that live in header/footer parts (relationships are part-scoped).
     *
     * @param {WordDocument} document - Specifies the document.
     * @returns {void} Nothing.
     */
    private materializeHeaderFooterPending(document: WordDocument): void {
        const catalog: { partBlocks?: () => ReadonlyArray<{ partName: PartName; blocks: ReadonlyArray<BlockContent>; }>; } = document.featurePart(featureId('headers-footers')) as {
            partBlocks?: () => ReadonlyArray<{
                partName: PartName;
                blocks: ReadonlyArray<BlockContent>;
            }>;
        } | undefined;
        if (catalog === undefined || catalog === null || typeof catalog.partBlocks !== 'function') {
            return;
        }
        const hashToMedia: Map<string, ImagePartEntry> = new Map<string, ImagePartEntry>();
        const usedNames: Set<string> = usedPartNameKeys(document, this);
        for (const item of this.scopedMedia) {
            usedNames.add(partNameKey(item.media.partName));
        }
        for (const part of catalog.partBlocks()) {
            const usedIds: Set<string> = new Set<string>(
                relationshipsForPart(document.opcPackage(), part.partName).items.map((rel: OpcRelationship) => rel.id)
            );
            for (const item of this.scopedMedia) {
                if (item.source === part.partName) {
                    usedIds.add(item.relationship.id);
                }
            }
            visitBlocksInDocumentOrder(part.blocks, (paragraph: Paragraph) => {
                for (const picture of picturesInParagraph(paragraph)) {
                    const pending: { readonly bytes: Uint8Array; readonly contentType: ImageType } = picture.isPendingRelationship()
                        ? this.pendingImages.get(picture)
                        : undefined;
                    if (pending === undefined) {
                        continue;
                    }
                    const hash: string = sha256(pending.bytes);
                    let media: ImagePartEntry = hashToMedia.get(hash);
                    if (media === undefined) {
                        const name: PartName = allocateImagePartName(pending.contentType, usedNames);
                        usedNames.add(partNameKey(name));
                        media = {
                            partName: name,
                            relationshipId: allocateRelationshipId(new Set()),
                            relationshipType: IMAGE_RELATIONSHIP_TYPE,
                            contentType: pending.contentType,
                            data: pending.bytes,
                            dirty: true,
                            pendingRelationship: undefined
                        };
                        hashToMedia.set(hash, media);
                    }
                    const relId: RelationshipId = allocateRelationshipId(usedIds);
                    usedIds.add(relId);
                    this.scopedMedia.push({
                        source: part.partName,
                        media,
                        relationship: {
                            id: relId,
                            type: IMAGE_RELATIONSHIP_TYPE,
                            target: relativeTarget(media.partName),
                            extraAttributes: [],
                            children: []
                        }
                    });
                    picture.resolveRelationshipId(relId);
                    this.pendingImages.delete(picture);
                }
            });
        }
    }
    /**
     *  @private
     *
     * @returns {ReadonlyArray<string>} The result.
     */
    pendingRelationshipIds(): ReadonlyArray<string> {
        return [...this.byRelationshipId.keys()];
    }
    /**
     *  @private
     *
     * @returns {ReadonlyArray<PartName>} The result.
     */
    pendingPartNames(): ReadonlyArray<PartName> {
        return [...this.entries.keys()];
    }
    /**
     *  @private
     *
     * @param {Uint8Array} data - The data.
     * @param {ImageType} contentType - The content type.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {Object} The result.
     */
    allocatePart(data: Uint8Array, contentType: ImageType, usedRelIds: ReadonlySet<string>, usedPartNames: ReadonlySet<string>): {
        entry: ImagePartEntry;
        relationshipId: string;
    } {
        const partNameValue: PartName = allocateImagePartName(contentType, usedPartNames);
        let relId: RelationshipId = allocateRelationshipId(usedRelIds);
        while (this.byRelationshipId.has(relId)) {
            relId = allocateRelationshipId(new Set([...usedRelIds, relId]));
        }
        const entry: ImagePartEntry = {
            partName: partNameValue,
            relationshipId: relId,
            relationshipType: IMAGE_RELATIONSHIP_TYPE,
            contentType,
            data,
            dirty: true,
            pendingRelationship: {
                id: relId,
                type: IMAGE_RELATIONSHIP_TYPE,
                target: relativeTarget(partNameValue),
                extraAttributes: [],
                children: []
            }
        };
        this.entries.set(partNameValue, entry);
        this.byRelationshipId.set(relId, entry);
        return { entry, relationshipId: relId };
    }
    /**
     *  @private
     *
     * @param {string} relationshipId - The relationship id.
     * @param {Uint8Array} data - The data.
     * @returns {void} Nothing is returned.
     */
    replaceBytes(relationshipId: string, data: Uint8Array): void {
        const entry: ImagePartEntry = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            throw new DocxError('content/unknown-image', `Image relationship ${relationshipId} is not loaded`);
        }
        entry.data = data;
        const sniffed: ImageType = sniffImageContentType(data);
        if (sniffed !== undefined) {
            entry.contentType = sniffed;
        }
        entry.dirty = true;
    }
    /**
     * Bind every inline picture in the main story to this document after body parse
     * so {@link Picture.loadImage} works when pictures are taken from
     * {@link Paragraph.items} without a prior {@link picturesInParagraph} walk.
     *
     * Invoked from {@link WordDocument.fromPackage} via duck-typed
     * `afterMainDocumentLoad` (same pattern as comments).
     *
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    afterMainDocumentLoad(document: WordDocument): void {
        visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
            // Side effect: picturesInParagraph binds hostDocumentOf for each leaf.
            picturesInParagraph(paragraph);
        });
    }
}
function extensionForContentType(contentType: ImageType): string {
    return contentType === JPEG_CONTENT_TYPE ? 'jpeg' : 'png';
}
function sha256(data: Uint8Array): string {
    return sha256Hex(data);
}
function relativeTarget(partNameValue: PartName): string {
    return partNameValue.slice('/word/'.length);
}
function allocateImagePartName(contentType: ImageType, used: ReadonlySet<string>): PartName {
    const ext: string = extensionForContentType(contentType);
    let index: number = 1;
    while (used.has(partNameKey(partName(`/word/media/image${String(index)}.${ext}`)))) {
        index += 1;
    }
    return partName(`/word/media/image${String(index)}.${ext}`);
}
/**
 * Resolve media content type for an image relationship target.
 * Keep non-PNG/JPEG types (e.g. GIF) so {@link ImagesCatalog.replaceBytes} can
 * find the relationship when replacing an existing picture.
 *
 * @param {PackagePart} part - Specifies the part.
 * @returns {string} Returns the result.
 */
function contentTypeForPart(part: PackagePart): string {
    if (part.contentType === PNG_CONTENT_TYPE || part.contentType === JPEG_CONTENT_TYPE) {
        return part.contentType;
    }
    if (part.contentType.startsWith('image/')) {
        return part.contentType;
    }
    const lower: string = part.name.toLowerCase();
    if (lower.endsWith('.png')) {
        return PNG_CONTENT_TYPE;
    }
    if (lower.endsWith('.jpeg') || lower.endsWith('.jpg')) {
        return JPEG_CONTENT_TYPE;
    }
    if (lower.endsWith('.gif')) {
        return 'image/gif';
    }
    if (part.contentType.length > 0) {
        return part.contentType;
    }
    return 'application/octet-stream';
}
function loadCatalog(pkg: OpcPackage, mainPartName: PartName): ImagesCatalog {
    const rels: Relationships = relationshipsForPart(pkg, mainPartName);
    const entries: Map<PartName, ImagePartEntry> = new Map<PartName, ImagePartEntry>();
    for (const rel of rels.items) {
        if (IMAGE_RELATIONSHIP_TYPES.indexOf(rel.type as (typeof IMAGE_RELATIONSHIP_TYPES)[number]) === -1) {
            continue;
        }
        // External image links are valid OPC; keep the relationship as-is and skip part load.
        if (rel.targetMode === TargetMode.External || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(rel.target.trim())) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, mainPartName);
        const part: PackagePart = partByName(pkg, target);
        if (part === undefined) {
            continue;
        }
        const contentType: string = contentTypeForPart(part);
        entries.set(part.name, {
            partName: part.name,
            relationshipId: rel.id,
            relationshipType: rel.type,
            contentType,
            data: part.data,
            dirty: false,
            pendingRelationship: undefined
        });
    }
    return new ImagesCatalog(entries);
}
function removeImagePartFromPackage(pkg: OpcPackage, mainPartName: PartName, entry: ImagePartEntry): OpcPackage {
    let next: OpcPackage = withRemovedPartLocal(pkg, entry.partName);
    next = withRemovedContentTypeOverrideLocal(next, entry.partName);
    next = withFilteredPartRelationshipsLocal(next, mainPartName, (rel: OpcRelationship) => rel.id !== entry.relationshipId);
    return next;
}
function withRemovedPartLocal(pkg: OpcPackage, name: PartName): OpcPackage {
    const key: string = partNameKey(name);
    const parts: PackagePart[] = pkg.parts.filter((part: PackagePart) => partNameKey(part.name) !== key);
    if (parts.length === pkg.parts.length) {
        return pkg;
    }
    return { ...pkg, parts };
}
function withRemovedContentTypeOverrideLocal(pkg: OpcPackage, logicalPartName: PartName): OpcPackage {
    return {
        ...pkg,
        contentTypes: {
            records: pkg.contentTypes.records.filter((record: ContentTypeRecord) => !(record.kind === 'override' && record.partName === logicalPartName))
        }
    };
}
function withFilteredPartRelationshipsLocal(pkg: OpcPackage, source: PartName, keep: (rel: OpcRelationship) => boolean): OpcPackage {
    const existing: Relationships = relationshipsForPart(pkg, source);
    const kept: OpcRelationship[] = existing.items.filter(keep);
    if (kept.length === existing.items.length) {
        return pkg;
    }
    return withPartRelationships(pkg, source, relationshipsWith(kept, existing.opaque));
}
function usedRelationshipIds(document: WordDocument, _catalog: ImagesCatalog): Set<string> {
    // Shared across multi-part features so concurrent pending allocations cannot
    // emit the same main-document rId (ink + images materialize independently).
    return usedMainDocumentRelationshipIds(document);
}
function usedPartNameKeys(document: WordDocument, catalog: ImagesCatalog): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const part of document.opcPackage().parts) {
        used.add(partNameKey(part.name));
    }
    for (const name of catalog.pendingPartNames()) {
        used.add(partNameKey(name));
    }
    return used;
}
let registered: boolean = false;
/**
 *   Test hook
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetImagesFeatureForTests(): void {
    registered = false;
}
/**
 *   Register the images multi-part and inline drawing handlers. Idempotent.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerImagesFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: IMAGES });
    registerFeatureMultiPartHandler({
        featureId: IMAGES,
        relationshipTypes: IMAGE_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): ImagesCatalog {
            return loadCatalog(pkg, ctx.mainPartName);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: IMAGES,
        materialize(document: WordDocument): void {
            const part: FeaturePartState = document.featurePart(IMAGES);
            if (part instanceof ImagesCatalog) {
                part.materializePending(document);
            }
        }
    });
    registerFeatureRunLeafHandler({
        featureId: IMAGES,
        wmlLocalName: 'drawing',
        tryParse(element: OpenXmlElement): Picture | undefined {
            const state: PictureHostState = decodePictureHost(element);
            if (state === undefined) {
                return undefined;
            }
            return Picture.fromHostState(state);
        }
    });
}
/**
 * Image media catalog for a document.
 *
 * @param {WordDocument} document - The document.
 * @returns {ImagesCatalog} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the module was not registered before load.
 * @private
 */
export function imagesFor(document: WordDocument): ImagesCatalog {
    const part: FeaturePartState = document.featurePart(IMAGES);
    if (part === undefined || !(part instanceof ImagesCatalog)) {
        throw new DocxError('feature/not-registered', 'Images catalog was not loaded; call registerImagesFeature() before WordDocument.open');
    }
    return part;
}
/**
 * Inline pictures in a paragraph, in document order (including nested inline content controls).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<Picture>} The result.
 * @private
 */
export function picturesInParagraph(paragraph: Paragraph): ReadonlyArray<Picture> {
    const found: Picture[] = [];
    let host: WordDocument | undefined;
    collectPicturesFromParagraphItems(paragraph.items.snapshot(), found, () => {
        if (host === undefined) {
            host = tryParagraphDocument(paragraph);
        }
        return host;
    });
    return found;
}
/**
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<Picture>} The result.
 * @deprecated Use {@link picturesInParagraph} instead.
 * @private
 */
export function imagesInParagraph(paragraph: Paragraph): ReadonlyArray<Picture> {
    return picturesInParagraph(paragraph);
}
function collectPicturesFromParagraphItems(
    items: ReadonlyArray<ParagraphItem>,
    found: Picture[],
    hostOf: () => WordDocument | undefined
): void {
    for (const item of items) {
        if (item instanceof Picture) {
            const resolvedHost: WordDocument = hostDocumentOf(item);
            const host: WordDocument = resolvedHost !== undefined ? resolvedHost : hostOf();
            if (host !== undefined) {
                bindCaptionHostDocument(item, host);
            }
            found.push(item);
            continue;
        }
        if (item instanceof FeatureRunParagraphItem && isPictureLeaf(item)) {
            const leaf: Picture = item.value as Picture;
            const resolvedLeafHost: WordDocument = hostDocumentOf(leaf);
            const host: WordDocument = resolvedLeafHost !== undefined ? resolvedLeafHost : hostOf();
            if (host !== undefined) {
                bindCaptionHostDocument(leaf, host);
            }
            found.push(leaf);
            continue;
        }
        const nested: ReadonlyArray<ParagraphItem> = nestedParagraphItemsOf(item);
        if (nested !== undefined) {
            collectPicturesFromParagraphItems(nested, found, hostOf);
        }
    }
}
/**
 *  Nested run-level items under an inline content control (public or wrapper).
 *
 * @param {ParagraphItem} item - Specifies the item.
 * @returns {ReadonlyArray<ParagraphItem> | undefined} Returns the result.
 */
function nestedParagraphItemsOf(item: ParagraphItem): ReadonlyArray<ParagraphItem> | undefined {
    if (item instanceof FeatureInlineParagraphItem) {
        return nestedParagraphItemsOfValue(item.value);
    }
    return nestedParagraphItemsOfValue(item);
}
function nestedParagraphItemsOfValue(value: unknown): ReadonlyArray<ParagraphItem> | undefined {
    if (value === null || typeof value !== 'object') {
        return undefined;
    }
    const candidate: {
        entityType?: EntityType;
        paragraphItems?: { snapshot?: () => ReadonlyArray<ParagraphItem> } | Iterable<ParagraphItem>;
    } = value as {
        entityType?: EntityType;
        paragraphItems?: { snapshot?: () => ReadonlyArray<ParagraphItem> } | Iterable<ParagraphItem>;
    };
    if (candidate.entityType !== EntityType.InlineContentControl) {
        return undefined;
    }
    const collection: { snapshot?: () => ReadonlyArray<ParagraphItem>; } | Iterable<ParagraphItem> = candidate.paragraphItems;
    if (collection === undefined) {
        return undefined;
    }
    if (typeof (collection as { snapshot?: unknown }).snapshot === 'function') {
        return (collection as { snapshot: () => ReadonlyArray<ParagraphItem> }).snapshot();
    }
    return [...(collection as Iterable<ParagraphItem>)];
}
function tryParagraphDocument(paragraph: Paragraph): WordDocument | undefined {
    try {
        return paragraph.owningDocument();
    }
    catch {
        return undefined;
    }
}
/**
 * Inline picture bytes for a picture relationship.
 *
 * @param {WordDocument} document - The document.
 * @param {Picture} picture - The picture.
 * @returns {Uint8Array | undefined} The result.
 * @private
 */
export function inlinePictureBytes(document: WordDocument, picture: Picture): Uint8Array | undefined {
    const catalog: ImagesCatalog = imagesFor(document);
    const pending: Uint8Array = catalog.pendingBytesFor(picture);
    if (pending !== undefined) {
        return pending;
    }
    if (picture.relationshipId.length === 0) {
        return undefined;
    }
    return catalog.bytesForRelationship(picture.relationshipId);
}
/**
 * @param {WordDocument} document - The document.
 * @param {Picture} image - The image.
 * @returns {Uint8Array | undefined} The result.
 * @deprecated Use {@link inlinePictureBytes} instead.
 * @private
 */
export function inlineImageBytes(document: WordDocument, image: Picture): Uint8Array | undefined {
    return inlinePictureBytes(document, image);
}
/**
 * Replace picture media bytes without changing layout markup.
 *
 * @param {WordDocument} document - The document.
 * @param {Picture} picture - The picture.
 * @param {Uint8Array} bytes - The bytes.
 * @returns {void} Nothing is returned.
 * @private
 */
export function replaceInlinePictureBytes(document: WordDocument, picture: Picture, bytes: Uint8Array): void {
    const catalog: ImagesCatalog = imagesFor(document);
    if (picture.isPendingRelationship()) {
        catalog.updatePendingBytes(picture, bytes);
        return;
    }
    catalog.replaceBytes(picture.relationshipId, bytes);
}
/**
 * @param {WordDocument} document - The document.
 * @param {Picture} image - The image.
 * @param {Uint8Array} bytes - The bytes.
 * @returns {void} Nothing is returned.
 * @deprecated Use {@link replaceInlinePictureBytes} instead.
 * @private
 */
export function replaceInlineImageBytes(document: WordDocument, image: Picture, bytes: Uint8Array): void {
    replaceInlinePictureBytes(document, image, bytes);
}
/**
 * Remove an inline picture run from its paragraph and drop its media on the next save.
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {Picture} picture - The picture.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeInlinePicture(document: WordDocument, paragraph: Paragraph, picture: Picture): void {
    for (const item of paragraph.items.snapshot()) {
        if (item instanceof Picture && item === picture) {
            paragraph.removeFeatureRunItem(picture);
            if (!picture.isPendingRelationship()) {
                imagesFor(document).removeEntry(picture.relationshipId);
            }
            else {
                imagesFor(document).discardPendingImage(picture);
            }
            return;
        }
        if (item instanceof FeatureRunParagraphItem && isPictureLeaf(item) && (item.value as Picture) === picture) {
            paragraph.removeFeatureRunItem(picture);
            if (!picture.isPendingRelationship()) {
                imagesFor(document).removeEntry(picture.relationshipId);
            }
            else {
                imagesFor(document).discardPendingImage(picture);
            }
            return;
        }
    }
    throw new DocxError('content/unknown-image', 'Inline picture is not in this paragraph');
}
/**
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {Picture} image - The image.
 * @returns {void} Nothing is returned.
 * @deprecated Use {@link removeInlinePicture} instead.
 * @private
 */
export function removeInlineImage(document: WordDocument, paragraph: Paragraph, image: Picture): void {
    removeInlinePicture(document, paragraph, image);
}
/**
 * Whether a paragraph item is a modeled inline picture from this module.
 *
 * @param {ParagraphItem | Picture} item - The item.
 * @returns {Object} The result.
 * @private
 */
export function isPictureLeaf(item: ParagraphItem | Picture): item is (FeatureRunParagraphItem & { value: Picture }) | Picture {
    if (item instanceof Picture) {
        return true;
    }
    return item instanceof FeatureRunParagraphItem && item.featureId === IMAGES && item.value instanceof Picture;
}
/**
 * @param {ParagraphItem | Picture} item - The item.
 * @returns {Object} The result.
 * @deprecated Use {@link isPictureLeaf} instead.
 * @private
 */
export function isImageLeaf(item: ParagraphItem | Picture): item is (FeatureRunParagraphItem & { value: Picture }) | Picture {
    return isPictureLeaf(item);
}
Paragraph.prototype.appendImage = function (this: Paragraph, bytes: Uint8Array, options?: ImageOptions): Picture {
    const opts: ImageOptions = options != null ? options : {};
    const catalog: ImagesCatalog = imagesFor(this.owningDocument());
    const layout: { width: number; height: number; contentType: ImageType; } = resolveImageLayout(bytes, opts);
    const wrap: TextWrappingStyleType = opts.textWrappingStyle !== undefined ? opts.textWrappingStyle : opts.wrapping;
    const picture: Picture = new Picture(imageInit({
        relationshipId: '',
        width: layout.width,
        height: layout.height,
        name: opts.name != null ? opts.name : 'Picture',
        title: opts.title,
        description: opts.description,
        lockAspectRatio: opts.lockAspectRatio != null ? opts.lockAspectRatio : true,
        rotation: opts.rotation != null ? opts.rotation : 0,
        flipHorizontal: opts.flipHorizontal != null ? opts.flipHorizontal : false,
        flipVertical: opts.flipVertical != null ? opts.flipVertical : false,
        placement: opts.placement,
        wrapping: wrap,
        horizontalOrigin: opts.horizontalOrigin,
        verticalOrigin: opts.verticalOrigin,
        horizontalPosition: opts.horizontalPosition,
        verticalPosition: opts.verticalPosition,
        horizontalAlignment: opts.horizontalAlignment,
        verticalAlignment: opts.verticalAlignment,
        layoutDirty: true
    }));
    catalog.registerPendingImage(picture, bytes, layout.contentType);
    bindCaptionHostDocument(picture, this.owningDocument());
    this.appendFeatureRunItem(IMAGES, picture);
    return picture;
};
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerImagesFeature();
});
registerImagesFeature();
/**
 * @deprecated Use {@link Picture} instead.
 * @public
 */
export type Image = Picture;
