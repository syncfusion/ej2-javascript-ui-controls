/**
 * DrawingShape leaf — residual-preserving DrawingML/VML run child.
 *
 * @private
 */
import { WordDocument } from '../document/document';
import { EntityType } from '../document/entity-type';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { Emus, pointToEmus, pointToCoordinateEmus, emuToPoint } from '../document/length';
import { Body } from '../document/body';
import { BodyItem } from '../document/body-item';
import { bodyItemToBlock, projectBlockToBodyItem } from '../document/body-item-adapters';
import { BlockContent, Paragraph } from '../document/paragraph';
import { FeatureRunParagraphItem, ParagraphItem } from '../document/text-range';
import { isWml, wmlElement } from '../document/wml';
import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { MARKUP_COMPATIBILITY_NAMESPACE } from '../../core/mc/index';
import { OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { assertEnumMember, HORIZONTAL_ALIGNMENT_SET, HORIZONTAL_ORIGIN_SET, TEXT_WRAPPING_STYLE_SET, TEXT_WRAPPING_TYPE_SET, TextWrappingStyle, TextWrappingType, VERTICAL_ALIGNMENT_SET, VERTICAL_ORIGIN_SET, HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, TextWrappingStyle as TextWrappingStyleType, TextWrappingType as TextWrappingTypeType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from '../images/layout-types';
import { Table as TableFeature } from '../tables/index';
import { isTableBlock, isTableBodyItem } from '../tables/index';
import { BlockContentControl } from '../content-controls/index';
import { isBlockContentControl } from '../content-controls/index';
import { FeatureBlock } from '../document/feature-block';
function bindFeatureBlockToDocument(value: FeatureBlock, document: WordDocument | undefined): void {
    if (document === undefined) {
        return;
    }
    if (typeof value !== 'object' || value === null || !('bindDocument' in value)) {
        return;
    }
    const bindDocument: (doc: WordDocument) => void = (value as {
        bindDocument: (doc: WordDocument) => void;
    }).bindDocument;
    bindDocument.call(value, document);
}
import { A_NS, attributeValue, buildNestedWpsShape, encodeAuthoredDrawingShape, encodeAuthoredGroup, findFirstElement, isNestedDrawingResidual, preferredDrawingElement, patchResidualCNvPr, patchResidualDocPr, patchResidualLayout, readCNvPrIdentity, readDocPrIdentity, readDrawingLayout, readDrawingPositionState, readDrawingWrapState, VML_NS, WPC_NS, WPG_NS, WP_NS, WPS_NS, parseTxbxContentBlocks, serializeTxbxContentBlocks, DrawingHostPlacement, EncodeGroupInput, DrawingDocPrIdentity, DrawingLayoutState, DrawingWrapState, DrawingPositionState } from './host-codec';
import { BodyBlockParseContext } from '../../core/registry/block-handlers';
import { readShapePropertiesState, LineCap, LineEndSize, LineEndType, LineDashing, ShapeFill, ShapeLine, ShapePropertiesState } from './sp-pr';
import { buildBodyPrElement, findTxbxContentElement, findTxbxElement, readBodyPropertiesState, BodyInsets, BodyPropertiesState, TextAnchoring, TextAutoFit, TextBodyWrap, TextHorzOverflow, TextVerticalType, TextVertOverflow } from './body-pr';
import { AutoShapeType, isPresetAutoShapeType, isStShapeType } from './shape-types';
import { defaultAuthoredShapeFill, FillFormat, FillFormatOwner } from './fill-format';
import { defaultAuthoredShapeLine, LineFormat, LineFormatOwner } from './line-format';
import { WrapFormat, WrapFormatOwner } from './wrap-format';
import { TextFrame, TextFrameOwner } from './text-frame';
import { TextDirection, TextVerticalAlignment } from './body-pr';
import { ANCHOR_DEFAULT_SIDE_DIST_EMU, DRAWING, ShapeOptions, DrawingEncoding, DrawingExtent, DrawingPlacement, DrawingVariant } from './types';
import { cloneResidualElement, collectRelationshipIds, detectDmlVariant, detectVmlVariant, elementChildren, emptyTxbxParagraphBlocks, findNestedDrawingContainer, isElement, residualHasVmlFallback } from './residual-utils';
import { drawingShapeInit, encodeDrawingShapeInput, encodeGroupInput, modeledFillForEncode, modeledLineForEncode } from './encode-builders';
import { allocateDocPrId } from './parse-register';
/**
 * Internal shape dirty-state token. Not part of the public API.
 *
 * @private
 */
export type DirtyMode = 'clean' | 'identity' | 'layout' | 'structure';
/**
 * Shape `w:txbxContent` story as a document {@link Body}.
 * Syncs the live block store back onto the parent shape on mutate.
 *
 * @private
 */
class ShapeTextBoxBody extends Body {
    private readonly hostShape: DrawingShape;
    constructor(
        hostShape: DrawingShape,
        document: WordDocument | undefined,
        items: ReadonlyArray<BlockContent>
    ) {
        super(document, items);
        this.hostShape = hostShape;
    }
    /**
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceRawBlocks(blocks: ReadonlyArray<BlockContent>): void {
        super.replaceRawBlocks(blocks);
        this.hostShape.syncTxbxBlocksFromBody(this.rawBlocks());
    }
    /**
     * @returns {WordDocument} The result.
     * @private
     * Prefer the shape anchor document when the body was constructed detached.
     */
    owningDocument(): WordDocument {
        try {
            return super.owningDocument();
        } catch (e) {
            return this.hostShape.internalOwningDocument();
        }
    }
}
/**
 * Cached `wps:spPr` MVP state read from residual (lazy).
 *
 * @private
 */
export interface ShapePropertiesStateCached {
    readonly presetGeometry: string | undefined;
    readonly useCustomGeometry: boolean;
    readonly fill: ShapeFill | undefined;
    readonly line: ShapeLine | undefined;
    readonly hasThemeStyle: boolean;
}
/**
 * Specifies the initialization options used to create a drawing shape from an existing DrawingML drawing,
 * including its encoding, placement, geometry, text wrapping, position, fill, and outline.
 *
 * @public
 */
export interface DrawingShapeInit {
    /**
     * Gets the encoding (inline or anchored) of the drawing that hosts the shape.
     */
    readonly encoding: DrawingEncoding;
    /**
     * Gets the preserved OpenXML element that holds the shape markup, which is not modeled by the library.
     */
    readonly residual: OpenXmlElement;
    /**
     * Gets the dirty state of the shape, which decides whether the markup is written back unchanged or re-serialized.
     */
    readonly dirty: DirtyMode;
    /**
     * Gets the non-visual drawing name of the shape (`wp:docPr/@name`).
     */
    readonly name?: string | undefined;
    /**
     * Gets the title of the shape (`wp:docPr/@title`).
     */
    readonly title?: string | undefined;
    /**
     * Gets the alternative text description of the shape (`wp:docPr/@descr`).
     */
    readonly description?: string | undefined;
    /**
     * Gets the drawing object identifier of the shape (`wp:docPr/@id`).
     */
    readonly docPrId?: number | undefined;
    /**
     * Gets the placement of the shape, either inline with the text or anchored.
     */
    readonly placement?: DrawingHostPlacement | undefined;
    /**
     * Gets the display width in points.
     */
    readonly width?: number | undefined;
    /**
     * Gets the display height in points.
     */
    readonly height?: number | undefined;
    /**
     * Gets the name of the preset geometry of the shape (`a:prstGeom/@prst`).
     */
    readonly presetGeometry?: string | undefined;
    /**
     * Gets the rotation angle of the shape, in degrees.
     */
    readonly rotation?: number | undefined;
    /**
     * Gets a value indicating whether the aspect ratio of the shape is locked when it is resized.
     */
    readonly lockAspectRatio?: boolean | undefined;
    /**
     * Gets a value indicating whether the shape is flipped horizontally.
     */
    readonly flipHorizontal?: boolean | undefined;
    /**
     * Gets a value indicating whether the shape is flipped vertically.
     */
    readonly flipVertical?: boolean | undefined;
    /**
     * Gets the text wrapping style of the shape.
     */
    readonly wrapping?: TextWrappingStyleType | undefined;
    /**
     * Gets the wrap type.
     */
    readonly wrapType?: TextWrappingTypeType | undefined;
    /**
     * Gets the top text distance in points.
     */
    readonly distanceTop?: number | undefined;
    /**
     * Gets the bottom text distance in points.
     */
    readonly distanceBottom?: number | undefined;
    /**
     * Gets the left text distance in points.
     */
    readonly distanceLeft?: number | undefined;
    /**
     * Gets the right text distance in points.
     */
    readonly distanceRight?: number | undefined;
    /**
     * Gets a value indicating whether the shape is placed behind the document text.
     */
    readonly behindDocument?: boolean | undefined;
    /**
     * Gets the horizontal origin that the shape position is relative to.
     */
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    /**
     * Gets the vertical origin that the shape position is relative to.
     */
    readonly verticalOrigin?: VerticalOriginType | undefined;
    /**
     * Gets the horizontal offset in points.
     */
    readonly horizontalPosition?: number | undefined;
    /**
     * Gets the vertical offset in points.
     */
    readonly verticalPosition?: number | undefined;
    /**
     * Gets the horizontal alignment of the shape relative to the horizontal origin.
     */
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
    /**
     * Gets the vertical alignment of the shape relative to the vertical origin.
     */
    readonly verticalAlignment?: VerticalAlignmentType | undefined;
    /**
     * Gets a value indicating whether the anchor of the shape is locked to its paragraph.
     */
    readonly lockAnchor?: boolean | undefined;
    /**
     * Gets a value indicating whether the shape is allowed to overlap other shapes.
     */
    readonly allowOverlap?: boolean | undefined;
    /**
     * Gets a value indicating whether the shape is laid out inside the table cell that contains its anchor.
     */
    readonly layoutInCell?: boolean | undefined;
    /**
     * Gets the fill of the shape.
     */
    readonly fill?: ShapeFill | undefined;
    /**
     * Gets the outline of the shape.
     */
    readonly line?: ShapeLine | undefined;
    /**
     * Gets the txbx content.
     */
    readonly txbxContent?: ReadonlyArray<OpenXmlElement> | undefined;
    /**
     * Gets the body pr element.
     */
    readonly bodyPrElement?: OpenXmlElement | undefined;
    /**
     * Gets the nested group/canvas children. When defined, the shape is a modeled group host even if the array is empty.
     */
    readonly children?: ReadonlyArray<DrawingShape> | undefined;
}
/**
 * Cached `wps:txbx` body state (lazy).
 *
 * @private
 */
export interface TextBoxStateCached {
    /** True when a `wps:txbx` (WML body) exists under the residual host. */
    readonly present: boolean;
    /**
     * Internal ordered store for `w:txbxContent` (paragraphs/tables/SDTs).
     * Public lists project via adapters.
     */
    readonly blocks: BlockContent[];
    /** Residual `wps:txbx` element for verbatim clone when body is untouched. */
    readonly residualTxbx: OpenXmlElement | undefined;
    /** Residual `w:txbxContent` element (may be absent in odd fixtures). */
    readonly residualTxbxContent: OpenXmlElement | undefined;
}

/**
 *  Deep membership check: direct or nested (table cell / SDT) paragraph.
 *
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @param {Paragraph} target - The target.
 * @returns {boolean} The result.
 * @private
 */
export function blockListOwnsParagraph(blocks: ReadonlyArray<BlockContent>, target: Paragraph): boolean {
    for (const block of blocks) {
        if (block.type === 'paragraph' && block.paragraph === target) {
            return true;
        }
        if (isTableBlock(block)) {
            if (tableOwnsParagraph(block.value, target)) {
                return true;
            }
        }
        if (isBlockContentControl(block)) {
            const inner: ReadonlyArray<BodyItem> = block.value.blockContentControl;
            if (inner !== undefined && bodyItemsOwnParagraph(inner, target)) {
                return true;
            }
        }
    }
    return false;
}
/**
 *  Membership over projected public body items (nested SDT children).
 *
 * @param {ReadonlyArray<BodyItem>} items - Specifies the items.
 * @param {Paragraph} target - Specifies the target.
 * @returns {boolean} Returns the result.
 */
function bodyItemsOwnParagraph(items: ReadonlyArray<BodyItem>, target: Paragraph): boolean {
    for (const item of items) {
        if (item instanceof Paragraph && item === target) {
            return true;
        }
        if (isTableBodyItem(item)) {
            if (tableOwnsParagraph(item, target)) {
                return true;
            }
        }
        if (item instanceof BlockContentControl) {
            const nested: ReadonlyArray<BodyItem> = item.blockContentControl;
            if (nested !== undefined && bodyItemsOwnParagraph(nested, target)) {
                return true;
            }
        }
    }
    return false;
}
export function tableOwnsParagraph(table: TableFeature, target: Paragraph): boolean {
    for (const row of table.rows.toArray()) {
        for (const cell of row.cells.toArray()) {
            for (const cellParagraph of cell.listParagraphs()) {
                if (cellParagraph === target) {
                    return true;
                }
            }
            for (const nested of cell.nestedTables) {
                if (tableOwnsParagraph(nested, target)) {
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * Minimum `w:txbxContent` body: one empty paragraph (`EG_BlockLevelElts`
 * minOccurs=1 â€” `CT_TxbxContent` cannot be empty; Word authors a bare `w:p`).
 */
/**
 * Shared base for DrawingML / VML run leaves: identity, placement, size,
 * rotation/flip/lock, wrap/distances, position, residual dirty plumbing, and
 * `FeatureRunLeaf` serialization.
 *
 * Concrete leaves are {@link Shape}; group/canvas hosts are {@link GroupShape}.
 * Prefer those subclasses (and {@link createDrawingShape}) at construction time.
 * `instanceof DrawingShape` remains true for both subclasses so existing leaf
 * guards keep working.
 *
 * Clean load/save is residual pass-through. Identity mutators patch `wp:docPr`
 * only. Layout mutators (size/rotation/lock/flip) patch residual extent+xfrm+locks
 * without full dual-AC rebuild. Position mutators (H/V origin, offset vs align,
 * `lockAnchor`/`allowOverlap`/`layoutInCell`) mark the shape structure dirty:
 * the dual MC shell is re-encoded with residual position preserved per-axis
 * when a mode was not modeled. Authoring (`appendShape`) emits dual MC
 * AlternateContent (Choice wps + Fallback VML stub) â€” GO Policy B.
 * Text box leaves expose `wps:bodyPr` typed state and the `w:txbxContent`
 * block body (paragraphs / tables / nested tables / block SDTs â€” GO Q6);
 * non-textBox shapes throw on body APIs.
 *
 * @private
 */
export class DrawingShape implements FeatureRunLeaf, FillFormatOwner, LineFormatOwner, WrapFormatOwner, TextFrameOwner {
    private residual: OpenXmlElement;
    private encodingValue: DrawingEncoding;
    private dirtyMode: DirtyMode;
    private nameValue: string | undefined;
    private titleValue: string | undefined;
    private descriptionValue: string | undefined;
    private docPrIdValue: number | undefined;
    private placementValue: DrawingHostPlacement | undefined;
    /** Display width in points. */
    private widthValue: number | undefined;
    /** Display height in points. */
    private heightValue: number | undefined;
    private presetGeometryValue: string | undefined;
    private rotationValue: number | undefined;
    private lockAspectRatioValue: boolean | undefined;
    private flipHorizontalValue: boolean | undefined;
    private flipVerticalValue: boolean | undefined;
    private wrappingValue: TextWrappingStyleType | undefined;
    /** Top text distance in points. */
    private distanceTopValue: number | undefined;
    /** Bottom text distance in points. */
    private distanceBottomValue: number | undefined;
    /** Left text distance in points. */
    private distanceLeftValue: number | undefined;
    /** Right text distance in points. */
    private distanceRightValue: number | undefined;
    private behindDocumentValue: boolean | undefined;
    /** Whether distance* fields were explicitly modeled (vs residual/default). */
    private distancesModeled: boolean;
    /** Whether behindDocument was explicitly modeled. */
    private behindDocumentModeled: boolean;
    private horizontalOriginValue: HorizontalOriginType | undefined;
    private verticalOriginValue: VerticalOriginType | undefined;
    /** Horizontal offset in points. */
    private horizontalPositionValue: number | undefined;
    /** Vertical offset in points. */
    private verticalPositionValue: number | undefined;
    private horizontalAlignmentValue: HorizontalAlignmentType | undefined;
    private verticalAlignmentValue: VerticalAlignmentType | undefined;
    /** Whether a horizontal position mode (offset or align) is explicitly modeled. */
    private horizontalModeled: boolean = false;
    /** Whether a vertical position mode (offset or align) is explicitly modeled. */
    private verticalModeled: boolean = false;
    private lockAnchorValue: boolean | undefined;
    private allowOverlapValue: boolean | undefined;
    private layoutInCellValue: boolean | undefined;
    /** Geometry/fill/line state. Defined after first read/mtate. */
    private spPrState: ShapePropertiesStateCached | undefined;
    private fillValue: ShapeFill | undefined;
    private fillModeled: boolean;
    private lineValue: ShapeLine | undefined;
    private lineModeled: boolean;
    /** Text box body state. Lazy; defined after first body access. */
    private txbxState: TextBoxStateCached | undefined;
    private txbxBlocksValue: BlockContent[] | undefined;
    private txbxBodyModeled: boolean;
    private bodyPrValue: BodyPropertiesState | undefined;
    private bodyPrModeled: boolean;
    /**
     * Nested DrawingML children under a group/canvas host.
     * Populated when {@link childrenModeled} is true (authored or materialised).
     */
    protected childrenValue: DrawingShape[];
    /** True when nested children are owned by the model (including empty group). */
    protected childrenModeled: boolean;
    /** Lazy residual parse cache when children are not yet modeled. */
    protected childrenCache: DrawingShape[] | undefined;
    /** Parent group/canvas when this leaf is a nested child. */
    /**
     * Parent group when nested; package-visible for GroupShape reparenting.
     *
     * @private
     */
    parentGroup: DrawingShape | undefined;
    /** Modeled wrap type (square sides). Default Both when unset. */
    private wrappingTypeValue: TextWrappingTypeType | undefined;
    private fillFormatValue: FillFormat | undefined;
    private lineFormatValue: LineFormat | undefined;
    private wrapFormatValue: WrapFormat | undefined;
    private textFrameValue: TextFrame | undefined;
    private textBodyValue: Body | undefined;
    /**
     * @private
     */
    constructor(encoding: DrawingEncoding, element: OpenXmlElement);
    /**
     * @private
     */
    constructor(init: DrawingShapeInit);
    /**
     * @param {DrawingEncoding | DrawingShapeInit} encodingOrInit - The encoding or init.
     * @param {OpenXmlElement} element - The element.
     * @private
     */
    constructor(encodingOrInit: DrawingEncoding | DrawingShapeInit, element?: OpenXmlElement) {
        if (typeof encodingOrInit === 'string') {
            if (element === undefined) {
                throw new TypeError('DrawingShape residual element is required');
            }
            this.encodingValue = encodingOrInit;
            this.residual = element;
            this.dirtyMode = 'clean';
            const identity: DrawingDocPrIdentity = isNestedDrawingResidual(element)
                ? readCNvPrIdentity(element)
                : readDocPrIdentity(element);
            this.nameValue = identity.name;
            this.titleValue = identity.title;
            this.descriptionValue = identity.description;
            this.docPrIdValue = identity.docPrId;
            this.distancesModeled = false;
            this.behindDocumentModeled = false;
            this.fillModeled = false;
            this.lineModeled = false;
            this.txbxBodyModeled = false;
            this.bodyPrModeled = false;
            this.childrenValue = [];
            this.childrenModeled = false;
            this.childrenCache = undefined;
            this.parentGroup = undefined;
            // Layout / wrap / position / spPr fields stay undefined until first
            // read/mtate so clean residual path does not force modeled defaults onto wire.
            return;
        }
        this.encodingValue = encodingOrInit.encoding;
        this.residual = encodingOrInit.residual;
        this.dirtyMode = encodingOrInit.dirty;
        this.nameValue = encodingOrInit.name;
        this.titleValue = encodingOrInit.title;
        this.descriptionValue = encodingOrInit.description;
        this.docPrIdValue = encodingOrInit.docPrId;
        this.placementValue = encodingOrInit.placement;
        this.widthValue = encodingOrInit.width;
        this.heightValue = encodingOrInit.height;
        this.presetGeometryValue = encodingOrInit.presetGeometry;
        this.rotationValue = encodingOrInit.rotation;
        this.lockAspectRatioValue = encodingOrInit.lockAspectRatio;
        this.flipHorizontalValue = encodingOrInit.flipHorizontal;
        this.flipVerticalValue = encodingOrInit.flipVertical;
        this.wrappingValue = encodingOrInit.wrapping;
        this.wrappingTypeValue = encodingOrInit.wrapType;
        this.distanceTopValue = encodingOrInit.distanceTop;
        this.distanceBottomValue = encodingOrInit.distanceBottom;
        this.distanceLeftValue = encodingOrInit.distanceLeft;
        this.distanceRightValue = encodingOrInit.distanceRight;
        this.behindDocumentValue = encodingOrInit.behindDocument;
        this.distancesModeled =
            encodingOrInit.distanceTop !== undefined ||
                encodingOrInit.distanceBottom !== undefined ||
                encodingOrInit.distanceLeft !== undefined ||
                encodingOrInit.distanceRight !== undefined;
        this.behindDocumentModeled = encodingOrInit.behindDocument !== undefined;
        this.horizontalOriginValue = encodingOrInit.horizontalOrigin;
        this.verticalOriginValue = encodingOrInit.verticalOrigin;
        this.horizontalPositionValue = encodingOrInit.horizontalPosition;
        this.verticalPositionValue = encodingOrInit.verticalPosition;
        this.horizontalAlignmentValue = encodingOrInit.horizontalAlignment;
        this.verticalAlignmentValue = encodingOrInit.verticalAlignment;
        this.horizontalModeled =
            encodingOrInit.horizontalPosition !== undefined ||
                encodingOrInit.horizontalAlignment !== undefined ||
                encodingOrInit.horizontalOrigin !== undefined;
        this.verticalModeled =
            encodingOrInit.verticalPosition !== undefined ||
                encodingOrInit.verticalAlignment !== undefined ||
                encodingOrInit.verticalOrigin !== undefined;
        this.lockAnchorValue = encodingOrInit.lockAnchor;
        this.allowOverlapValue = encodingOrInit.allowOverlap;
        this.layoutInCellValue = encodingOrInit.layoutInCell;
        this.fillValue = encodingOrInit.fill;
        this.fillModeled = encodingOrInit.fill !== undefined;
        this.lineValue = encodingOrInit.line;
        this.lineModeled = encodingOrInit.line !== undefined;
        this.txbxBodyModeled = encodingOrInit.txbxContent !== undefined;
        this.bodyPrModeled = encodingOrInit.bodyPrElement !== undefined;
        if (encodingOrInit.bodyPrElement !== undefined) {
            this.bodyPrValue = readBodyPropertiesState(encodingOrInit.bodyPrElement);
        }
        this.childrenValue =
            encodingOrInit.children !== undefined ? [...encodingOrInit.children] : [];
        this.childrenModeled = encodingOrInit.children !== undefined;
        this.childrenCache = undefined;
        this.parentGroup = undefined;
        if (this.childrenModeled) {
            for (const child of this.childrenValue) {
                child.parentGroup = this;
            }
        }
    }
    /**
     * Whether this leaf is DrawingML (`w:drawing` / MC Choice) or VML (`w:pict`).
     *
     * @returns {DrawingEncoding} The result.
     * @private
     */
    encoding(): DrawingEncoding {
        return this.encodingValue;
    }
    /**
     * Placement host for DrawingML leaves, or `unknown` for VML.
     *
     * @returns {DrawingPlacement} The result.
     * @private
     */
    placement(): DrawingPlacement {
        if (this.placementValue !== undefined) {
            return this.placementValue;
        }
        if (this.encodingValue === 'vml') {
            return 'unknown';
        }
        const drawing: OpenXmlElement = this.drawingRoot();
        if (drawing === undefined) {
            return 'unknown';
        }
        if (findFirstElement(drawing, WP_NS, 'anchor') !== undefined) {
            return 'anchor';
        }
        if (findFirstElement(drawing, WP_NS, 'inline') !== undefined) {
            return 'inline';
        }
        return 'unknown';
    }
    /**
     * Shape variant: kind of drawing object this leaf hosts.
     *
     * Detection is via `a:graphicData @uri` for DML and child element localName
     * for VML. Modeled empty groups (`childrenModeled`) read as `'group'` before
     * residual URI detection. Nested residual leaves (`wps:wsp` / `wpg:grpSp`)
     * are classified from their own element when no `w:drawing` host is present
     * Authored structure + presetGeometry still short-circuits to
     * `'shape'` / `'textBox'` after group/canvas checks so residual groups are
     * never misread as shapes.
     *
     * @returns {DrawingVariant} The result.
     * @private
     */
    variant(): DrawingVariant {
        if (this.encodingValue === 'vml') {
            return detectVmlVariant(this.residual);
        }
        // Authored empty groups (and residual materialised children lists).
        if (this.childrenModeled) {
            return DrawingVariant.Group;
        }
        // Nested residual shape/group hosts have no wp:docPr drawing root.
        if (isNestedDrawingResidual(this.residual)) {
            if (this.residual.localName === 'grpSp') {
                return DrawingVariant.Group;
            }
            if (this.txbxBodyModeled) {
                return DrawingVariant.TextBox;
            }
            if (this.presetGeometryValue !== undefined || this.dirtyMode === 'structure') {
                return DrawingVariant.Shape;
            }
            // Residual nested wsp: text box vs shape via local wps:txbx presence.
            if (findFirstElement(this.residual, WPS_NS, 'txbx') !== undefined) {
                return DrawingVariant.TextBox;
            }
            return DrawingVariant.Shape;
        }
        const drawing: OpenXmlElement = this.drawingRoot();
        if (drawing !== undefined) {
            const fromUri: DrawingVariant = detectDmlVariant(drawing);
            // Prefer residual group/canvas over structure+preset short-circuit so
            // loaded groups never flip to 'shape' when geometry is later modeled.
            if (fromUri === DrawingVariant.Group || fromUri === DrawingVariant.Canvas) {
                return fromUri;
            }
        }
        if (this.presetGeometryValue !== undefined && this.dirtyMode === 'structure') {
            return this.txbxBodyModeled ? DrawingVariant.TextBox : DrawingVariant.Shape;
        }
        if (drawing === undefined) {
            return DrawingVariant.Unknown;
        }
        return detectDmlVariant(drawing);
    }
    /**
     * Nested DrawingML children under a group or canvas host.
     *
     * Leaf shapes, VML, and unknown variants return `[]`. Residual group/canvas
     * hosts lazy-parse `wps:wsp` / `wpg:grpSp` under `wpg:wgp` or `wpc:wpc`.
     * Modeled groups (including empty authored groups) return the owned list.
     * Public consumers use {@link GroupShape.childShapes}.
     *
     * @returns {ReadonlyArray<DrawingShape>} The result.
     * @private
     */
    children(): ReadonlyArray<DrawingShape> {
        if (this.encodingValue === 'vml') {
            return [];
        }
        if (this.childrenModeled) {
            return this.childrenValue;
        }
        if (this.childrenCache !== undefined) {
            return this.childrenCache;
        }
        const nested: DrawingShape[] = this.parseNestedChildrenFromResidual();
        this.childrenCache = nested;
        return nested;
    }
    /**
     * Gets or sets the non-visual drawing name of the shape (`wp:docPr @name` or nested `cNvPr @name`).
     *
     * @public
     */
    get name(): string | undefined {
        if (this.nameValue !== undefined) {
            return this.nameValue;
        }
        return this.readResidualIdentity().name;
    }
    set name(value: string | undefined) {
        this.nameValue = value;
        this.markIdentityDirty();
    }
    /**
     * Gets or sets the title of the shape (`wp:docPr @title` or nested `cNvPr @title`).
     *
     * @public
     */
    get title(): string | undefined {
        if (this.dirtyMode !== 'clean' || this.titleValue !== undefined) {
            return this.titleValue;
        }
        return this.readResidualIdentity().title;
    }
    set title(value: string | undefined) {
        this.titleValue = value;
        this.markIdentityDirty();
    }
    /**
     * Gets or sets the alternative text of the shape (`wp:docPr @descr` or nested `cNvPr @descr`).
     *
     * @public
     */
    get alternativeText(): string | undefined {
        if (this.dirtyMode !== 'clean' || this.descriptionValue !== undefined) {
            return this.descriptionValue;
        }
        return this.readResidualIdentity().description;
    }
    set alternativeText(value: string | undefined) {
        this.descriptionValue = value;
        this.markIdentityDirty();
    }
    /**
     * Stable fill format facade (Shape.md).
     *
     * @public
     */
    get fillFormat(): FillFormat {
        if (this.fillFormatValue === undefined) {
            this.fillFormatValue = new FillFormat(this);
        }
        return this.fillFormatValue;
    }
    /**
     * Stable line format facade (Shape.md).
     *
     * @public
     */
    get lineFormat(): LineFormat {
        if (this.lineFormatValue === undefined) {
            this.lineFormatValue = new LineFormat(this);
        }
        return this.lineFormatValue;
    }
    /**
     * Stable wrap format facade (Shape.md).
     *
     * @public
     */
    get wrapFormat(): WrapFormat {
        if (this.wrapFormatValue === undefined) {
            this.wrapFormatValue = new WrapFormat(this);
        }
        return this.wrapFormatValue;
    }
    /**
     * Stable text frame facade (Shape.md).
     *
     * @public
     */
    get textFrame(): TextFrame {
        if (this.textFrameValue === undefined) {
            this.textFrameValue = new TextFrame(this);
        }
        return this.textFrameValue;
    }
    /**
     * Text-box story content as a document {@link Body} (`w:txbxContent`).
     * First access promotes the leaf to a text-box variant (`wps:txbx`).
     *
     * @public
     */
    get textBody(): Body {
        this.ensureTextBodyAccessible();
        if (this.textBodyValue === undefined) {
            const state: TextBoxStateCached = this.readTxbxState();
            let document: WordDocument | undefined;
            try {
                document = this.internalOwningDocument();
            } catch (e) {
                document = undefined;
            }
            this.textBodyValue = new ShapeTextBoxBody(this, document, state.blocks);
            // Share the Body store with the txbx cache (constructor copies once). Reading the body is
            // not an edit: the host stays clean so an untouched shape still saves byte-stable.
            (state as { blocks: BlockContent[] }).blocks = this.textBodyValue.rawBlocks();
            this.markTxbxBodyModeled();
        }
        return this.textBodyValue;
    }
    /**
     * Auto shape type from preset geometry. Returns AutoShapeType.Unknown when missing/unrecognized/VML; Custom for custGeom.
     *
     * @public
     */
    get autoShapeType(): AutoShapeType {
        if (this.encodingValue === 'vml') {
            return AutoShapeType.Unknown;
        }
        if (this.readSpPrState().useCustomGeometry) {
            return AutoShapeType.Custom;
        }
        const token: string = this.presetGeometryToken;
        if (token !== undefined && isStShapeType(token)) {
            return (token as string) as AutoShapeType;
        }
        return AutoShapeType.Unknown;
    }
    /**
     *  @private
     *
     * @returns {ShapeFill | undefined} The result.
     */
    readShapeFillState(): ShapeFill | undefined {
        if (this.fillModeled) {
            return this.fillValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return this.readSpPrState().fill;
    }
    /**
     *  @private
     *
     * @param {ShapeFill | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeShapeFillState(value: ShapeFill | undefined): void {
        if (value !== undefined && value.kind !== 'solid' && value.kind !== 'none') {
            throw new RangeError(`Fill kind "${String(value.kind)}" cannot be authored; use solid or none`);
        }
        this.fillValue = value;
        this.fillModeled = true;
        this.markStructureDirty();
    }
    /**
     *  @private
     *
     * @returns {ShapeLine | undefined} The result.
     */
    readShapeLineState(): ShapeLine | undefined {
        if (this.lineModeled) {
            return this.lineValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return this.readSpPrState().line;
    }
    /**
     *  @private
     *
     * @param {ShapeLine | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeShapeLineState(value: ShapeLine | undefined): void {
        if (value !== undefined && value.kind !== 'solid' && value.kind !== 'none') {
            throw new RangeError(`Line kind "${String(value.kind)}" cannot be authored; use solid or none`);
        }
        if (value !== undefined && value.kind === 'solid' && value.srgbColor === undefined) {
            throw new RangeError('Solid line requires an sRGB color');
        }
        this.lineValue = value;
        this.lineModeled = true;
        this.markStructureDirty();
    }
    /**
     *  @private
     *
     * @returns {TextWrappingStyleType} The result.
     */
    readWrapStyle(): TextWrappingStyleType {
        return this.wrappingStyleInternal;
    }
    /**
     *  @private
     *
     * @param {TextWrappingStyleType} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeWrapStyle(value: TextWrappingStyleType): void {
        this.wrappingStyleInternal = value;
    }
    /**
     *  @private
     *
     * @returns {TextWrappingTypeType} The result.
     */
    readWrapType(): TextWrappingTypeType {
        if (this.wrappingTypeValue !== undefined) {
            return this.wrappingTypeValue;
        }
        if (this.encodingValue === 'vml') {
            return TextWrappingType.Both;
        }
        return readDrawingWrapState(this.residual).wrapType;
    }
    /**
     *  @private
     *
     * @param {TextWrappingTypeType} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeWrapType(value: TextWrappingTypeType): void {
        if (value === TextWrappingType.Unknown) {
            throw new RangeError('WrapFormat.textWrappingType cannot be set to TextWrappingType.Unknown');
        }
        assertEnumMember('wrapType', value, TEXT_WRAPPING_TYPE_SET);
        this.wrappingTypeValue = value;
        this.markStructureDirty();
    }
    /**
     *  @private
     *
     * @returns {boolean} The result.
     */
    readAllowOverlap(): boolean {
        return this.allowOverlapInternal;
    }
    /**
     *  @private
     *
     * @param {boolean} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeAllowOverlap(value: boolean): void {
        this.allowOverlapInternal = value;
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readDistanceTop(): number {
        return this.distanceTopInternal;
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeDistanceTop(value: number): void {
        this.distanceTopInternal = value;
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readDistanceBottom(): number {
        return this.distanceBottomInternal;
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeDistanceBottom(value: number): void {
        this.distanceBottomInternal = value;
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readDistanceLeft(): number {
        return this.distanceLeftInternal;
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeDistanceLeft(value: number): void {
        this.distanceLeftInternal = value;
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readDistanceRight(): number {
        return this.distanceRightInternal;
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeDistanceRight(value: number): void {
        this.distanceRightInternal = value;
    }
    /**
     *  @private
     *
     * @returns {TextDirection | undefined} The result.
     */
    readTextFrameDirection(): TextDirection | undefined {
        return this.textDirection as TextDirection | undefined;
    }
    /**
     *  @private
     *
     * @param {TextDirection | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeTextFrameDirection(value: TextDirection | undefined): void {
        this.textDirection = value as TextVerticalType | undefined;
    }
    /**
     *  @private
     *
     * @returns {TextVerticalAlignment | undefined} The result.
     */
    readTextFrameVerticalAlignment(): TextVerticalAlignment | undefined {
        return this.verticalAnchor as TextVerticalAlignment | undefined;
    }
    /**
     *  @private
     *
     * @param {TextVerticalAlignment | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeTextFrameVerticalAlignment(value: TextVerticalAlignment | undefined): void {
        this.verticalAnchor = value as TextAnchoring | undefined;
    }

    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readInternalMarginLeft(): number {
        return this.readInsetPoints('left', 91440);
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeInternalMarginLeft(value: number): void {
        this.writeInsetPoints('left', value);
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readInternalMarginTop(): number {
        return this.readInsetPoints('top', 45720);
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeInternalMarginTop(value: number): void {
        this.writeInsetPoints('top', value);
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readInternalMarginRight(): number {
        return this.readInsetPoints('right', 91440);
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeInternalMarginRight(value: number): void {
        this.writeInsetPoints('right', value);
    }
    /**
     *  @private
     *
     * @returns {number} The result.
     */
    readInternalMarginBottom(): number {
        return this.readInsetPoints('bottom', 45720);
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    writeInternalMarginBottom(value: number): void {
        this.writeInsetPoints('bottom', value);
    }
    /**
     *  @private
     *
     * @returns {BodyInsets | undefined} The result.
     */
    private readBodyInsets(): BodyInsets | undefined {
        return this.insets;
    }
    /**
     *  @private
     *
     * @param {BodyInsets | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    private writeBodyInsets(value: BodyInsets | undefined): void {
        this.insets = value;
    }
    /**
     * BodyInsets sides are **points** (body-pr parse/build converts at the
     * wire boundary). Defaults are Word bodyPr EMU constants converted once.
     *
     * @param {string | string | string | string} side - The side.
     * @param {number} defaultEmu - The default emu.
     * @returns {number} The result.
     * @private
     */
    private readInsetPoints(side: 'left' | 'top' | 'right' | 'bottom', defaultEmu: number): number {
        const insets: BodyInsets = this.readBodyInsets();
        let points: number | undefined;
        if (insets !== undefined) {
            if (side === 'left') { points = insets.left; }
            else if (side === 'top') { points = insets.top; }
            else if (side === 'right') { points = insets.right; }
            else { points = insets.bottom; }
        }
        if (points !== undefined) {
            return points;
        }
        return emuToPoint(defaultEmu);
    }
    /**
     * Store InternalMargin sides as points on BodyInsets (same unit as
     * body-pr model). Do not convert to EMU here — buildBodyPrElement does.
     *
     * @param {string | string | string | string} side - The side.
     * @param {number} points - The points.
     * @returns {void} Nothing is returned.
     * @private
     */
    private writeInsetPoints(side: 'left' | 'top' | 'right' | 'bottom', points: number): void {
        const prev: BodyInsets = this.readBodyInsets() || {};
        const next: { left: number; top: number; right: number; bottom: number; } = {
            left: prev.left,
            top: prev.top,
            right: prev.right,
            bottom: prev.bottom
        };
        if (side === 'left') { next.left = points; }
        else if (side === 'top') { next.top = points; }
        else if (side === 'right') { next.right = points; }
        else { next.bottom = points; }
        this.writeBodyInsets(next);
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    ensureTextBodyAccessible(): void {
        // Keep the live DOM empty until the caller appends body content.
        // Wire format still requires CT_TxbxContent minOccurs=1: serialize paths
        // fall back to emptyTxbxParagraphBlocks() when blocks.length === 0.
        this.readTxbxState();
        // First textBody access promotes the leaf to a textBox variant (wps:txbx).
        this.markTxbxBodyModeled();
    }
    /**
     * @param {BlockContent[]} blocks - The blocks.
     * @returns {void} Nothing is returned.
     * @private
     * Point the txbx cache at the Body block store after Body mutations.
     */
    syncTxbxBlocksFromBody(blocks: BlockContent[]): void {
        const state: TextBoxStateCached = this.readTxbxState();
        // TextBoxStateCached.blocks is readonly on the type but the cache is live.
        (state as { blocks: BlockContent[] }).blocks = blocks;
        this.markTxbxBodyModeled();
        this.markStructureDirty();
    }
    /**
     * Append a nested preset-geometry shape under this group or canvas.
     *
     * Only valid when {@link variant} is `'group'` or `'canvas'`. Nested children
     * serialize as bare `wps:wsp` (with `wps:cNvPr`) under `wpg:wgp` / `wpc:wpc`
     * â€” not as a second `w:drawing` host. Marks this host structure-dirty.
     *
     * @throws DocxError `content/invalid-shape` when the host is not a group/canvas,
     *   or when geometry/size options are invalid.
     *
     * Public consumers call {@link GroupShape.appendShape}.
     *
     * @private
     */
    /**
     * Append a nested preset-geometry {@link Shape} under this group or canvas.
     *
     * @param {AutoShapeType} autoShapeType - Specifies the auto shape type.
     * @param {number} width - Specifies the width.
     * @param {number} height - Specifies the height.
     * @returns {Shape} Returns the result.
     * @public
     */
    appendShape(autoShapeType: AutoShapeType, width: number, height: number): Shape {
        const hostVariant: string = this.variant();
        if (hostVariant !== 'group' && hostVariant !== 'canvas') {
            throw new DocxError('content/invalid-shape', `appendShape is only valid on group or canvas hosts; variant is "${hostVariant}"`);
        }
        if (!isPresetAutoShapeType(autoShapeType)) {
            throw new DocxError('content/invalid-shape', `Invalid autoShapeType "${String(autoShapeType)}"; expected a preset AutoShapeType token`);
        }
        let widthEmu: Emus;
        let heightEmu: Emus;
        try {
            widthEmu = pointToEmus(width);
            heightEmu = pointToEmus(height);
        }
        catch (error) {
            if (error instanceof RangeError) {
                throw new DocxError('content/invalid-shape', 'Shape width and height must be positive point values', { cause: error });
            }
            throw error;
        }
        if (!(widthEmu > 0) || !(heightEmu > 0)) {
            throw new DocxError('content/invalid-shape', 'Shape width and height must be positive point values');
        }
        const rotation: number = 0;
        const name: string = 'Shape';
        const lockAspectRatio: boolean = true;
        const flipHorizontal: boolean = false;
        const flipVertical: boolean = false;
        const docPrId: number = this.allocateNestedDocPrId();
        const defaultFill: { readonly kind: 'solid'; readonly srgb: string; } = defaultAuthoredShapeFill();
        const defaultLine: ShapeLine = defaultAuthoredShapeLine();
        const nestedWsp: OpenXmlElement = buildNestedWpsShape({
            placement: 'anchor',
            widthEmu,
            heightEmu,
            presetGeometry: autoShapeType,
            docPrId,
            name,
            title: undefined,
            description: undefined,
            rotation,
            flipHorizontal,
            flipVertical,
            lockAspectRatio,
            txbxContent: undefined,
            bodyPr: undefined,
            fill: defaultFill,
            line: modeledLineForEncode(defaultLine)
        });
        this.ensureChildrenModeled();
        const child: Shape = new Shape(drawingShapeInit({
            encoding: 'drawingml',
            residual: nestedWsp,
            dirty: 'structure',
            name,
            title: undefined,
            description: undefined,
            docPrId,
            width,
            height,
            presetGeometry: autoShapeType,
            rotation,
            lockAspectRatio,
            flipHorizontal,
            flipVertical,
            fill: defaultFill,
            line: defaultLine
        }));
        child.parentGroup = this;
        this.childrenValue.push(child);
        this.childrenModeled = true;
        this.childrenCache = undefined;
        this.markStructureDirty();
        this.notifyParentOfChildDirty();
        return child;
    }

    /**
     * Extent (width Ã— height) from modeled size or `wp:extent`, as point `number`.
     *
     * Returns `undefined` when no size is modeled and no `wp:extent` / `a:ext`
     * is reachable with numeric `cx`/`cy`. VML leaves return `undefined`.
     *
     * @returns {DrawingExtent | undefined} The result.
     * @private
     */
    extent(): DrawingExtent | undefined {
        if (this.widthValue !== undefined && this.heightValue !== undefined) {
            return { width: this.widthValue, height: this.heightValue };
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        const layout: DrawingLayoutState = readDrawingLayout(this.residual);
        if (layout.widthEmu !== undefined && layout.heightEmu !== undefined) {
            return { width: emuToPoint(layout.widthEmu), height: emuToPoint(layout.heightEmu) };
        }
        return undefined;
    }
    /**
     * @returns {Object} The result.
     * @deprecated Use {@link DrawingShape.extent} instead. Returns raw EMU
     * numbers; kept for back-compat with existing feature-module tests.
     *
     * @private
     */
    extentEmu(): {
        readonly width: Emus;
        readonly height: Emus;
    } | undefined {
        const e: DrawingExtent = this.extent();
        if (e === undefined) {
            return undefined;
        }
        return { width: pointToEmus(e.width), height: pointToEmus(e.height) };
    }
    /**
     * Display width (`wp:extent/@cx` preferred; EMU-backed point `number`).
     * Setter marks layout dirty and updates both `wp:extent` and `a:xfrm/a:ext`
     * on save. Does **not** auto-adjust height when {@link lockAspectRatio} is true
     * (images parity â€” lock is a flag for consumers/Word).
     *
     * @public
     */
    get width(): number | undefined {
        if (this.widthValue !== undefined) {
            return this.widthValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        const layout: DrawingLayoutState = readDrawingLayout(this.residual);
        return layout.widthEmu !== undefined ? emuToPoint(layout.widthEmu) : undefined;
    }
    set width(value: number | undefined) {
        this.widthValue = value;
        this.markLayoutDirty();
    }
    /**
     * Display height (`wp:extent/@cy` preferred). Same lock semantics as {@link width}.
     *
     * @public
     */
    get height(): number | undefined {
        if (this.heightValue !== undefined) {
            return this.heightValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        const layout: DrawingLayoutState = readDrawingLayout(this.residual);
        return layout.heightEmu !== undefined ? emuToPoint(layout.heightEmu) : undefined;
    }
    set height(value: number | undefined) {
        this.heightValue = value;
        this.markLayoutDirty();
    }
    /**
     * Clockwise rotation in degrees (`a:xfrm/@rot`).
     * Wire uses ST_Angle = degrees Ã— 60000. Missing attribute reads as `0`.
     * `@rot` is omitted on encode when the value is `0`.
     *
     * @throws RangeError when the value is not finite.
     *
     * @public
     */
    get rotation(): number {
        if (this.rotationValue !== undefined) {
            return this.rotationValue;
        }
        if (this.encodingValue === 'vml') {
            return 0;
        }
        return readDrawingLayout(this.residual).rotation;
    }
    set rotation(value: number) {
        if (!Number.isFinite(value)) {
            throw new RangeError(`Invalid rotation value "${String(value)}"; expected a finite number`);
        }
        this.rotationValue = value;
        this.markLayoutDirty();
    }
    /**
     * Aspect-ratio lock (`a:graphicFrameLocks/@noChangeAspect`).
     * Authoring default is `true`; missing locks on load read as `false`.
     * Setting the flag does not recompute width/height (images parity).
     *
     * @public
     */
    get lockAspectRatio(): boolean {
        if (this.lockAspectRatioValue !== undefined) {
            return this.lockAspectRatioValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingLayout(this.residual).lockAspectRatio;
    }
    set lockAspectRatio(value: boolean) {
        this.lockAspectRatioValue = value;
        this.markLayoutDirty();
    }
    /**
     * Horizontal flip (`a:xfrm/@flipH`). Missing attribute reads as `false`.
     *
     * @public
     */
    get flipHorizontal(): boolean {
        if (this.flipHorizontalValue !== undefined) {
            return this.flipHorizontalValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingLayout(this.residual).flipHorizontal;
    }
    set flipHorizontal(value: boolean) {
        this.flipHorizontalValue = value;
        this.markLayoutDirty();
    }
    /**
     * Vertical flip (`a:xfrm/@flipV`). Missing attribute reads as `false`.
     *
     * @public
     */
    get flipVertical(): boolean {
        if (this.flipVerticalValue !== undefined) {
            return this.flipVerticalValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingLayout(this.residual).flipVertical;
    }
    set flipVertical(value: boolean) {
        this.flipVerticalValue = value;
        this.markLayoutDirty();
    }
    /**
     * Text wrapping style.
     *
     * - `'inline'` serializes as `wp:inline`. Collapsing an anchored shape to
     *   inline **drops** position and wrap residual by design (images parity).
     * - Other values promote to `wp:anchor` with the matching `wp:wrap*` child.
     *   Tight/through without a residual wrapPolygon fall back to `wrapNone`
     *   (library does not invent polygons).
     *
     * VML leaves report `'none'`.
     *
     * @throws RangeError when `value` is not a known {@link TextWrappingStyle}.
     *
     * @public
     */
    /**
     * @private
     */
    private get wrappingStyleInternal(): TextWrappingStyleType {
        if (this.wrappingValue !== undefined) {
            return this.wrappingValue;
        }
        if (this.encodingValue === 'vml') {
            return TextWrappingStyle.None;
        }
        return readDrawingWrapState(this.residual).wrapping;
    }
    /**
     *  @private
     *
     * @param {TextWrappingStyleType} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set wrappingStyleInternal(value: TextWrappingStyleType) {
        assertEnumMember('wrappingStyle', value, TEXT_WRAPPING_STYLE_SET);
        this.wrappingValue = value;
        if (value === TextWrappingStyle.Inline) {
            this.placementValue = 'inline';
        }
        else {
            this.placementValue = 'anchor';
        }
        this.markStructureDirty();
    }
    /**
     * Distance from text above the shape (`wp:inline|wp:anchor/@distT`).
     * Missing residual attribute reads as `emuToPoint(0)`.
     *
     * @public
     */
    /**
     * @private
     */
    private get distanceTopInternal(): number {
        return this.readDistancePoints('top');
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set distanceTopInternal(value: number) {
        this.distanceTopValue = value;
        this.distancesModeled = true;
        this.markStructureDirty();
    }
    /**
     * Distance from text below the shape (`wp:inline|wp:anchor/@distB`).
     * Missing residual attribute reads as `0` points.
     *
     * @public
     */
    /**
     * @private
     */
    private get distanceBottomInternal(): number {
        return this.readDistancePoints('bottom');
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set distanceBottomInternal(value: number) {
        this.distanceBottomValue = value;
        this.distancesModeled = true;
        this.markStructureDirty();
    }
    /**
     * Distance from text to the left of the shape (`wp:inline|wp:anchor/@distL`).
     * Missing residual on anchor reads as author default `emuToPoint(114300)`; inline `0` points.
     *
     * @public
     */
    /**
     * @private
     */
    private get distanceLeftInternal(): number {
        return this.readDistancePoints('left');
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set distanceLeftInternal(value: number) {
        this.distanceLeftValue = value;
        this.distancesModeled = true;
        this.markStructureDirty();
    }
    /**
     * Distance from text to the right of the shape (`wp:inline|wp:anchor/@distR`).
     * Missing residual on anchor reads as author default `emuToPoint(114300)`; inline `0` points.
     *
     * @public
     */
    /**
     * @private
     */
    private get distanceRightInternal(): number {
        return this.readDistancePoints('right');
    }
    /**
     *  @private
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set distanceRightInternal(value: number) {
        this.distanceRightValue = value;
        this.distancesModeled = true;
        this.markStructureDirty();
    }
    /**
     * Whether the shape is behind document text (`wp:anchor/@behindDoc`).
     * Inline hosts always report `false`. VML leaves report `false`.
     *
     * @private
     */
    /**
     * Whether the shape is drawn below text (`wp:anchor/@behindDoc`).
     *
     * @public
     */
    get isBelowText(): boolean {
        if (this.behindDocumentValue !== undefined) {
            return this.behindDocumentValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingWrapState(this.residual).behindDocument;
    }
    set isBelowText(value: boolean) {
        this.behindDocumentValue = value;
        this.behindDocumentModeled = true;
        this.markStructureDirty();
    }
    /**
     * Horizontal origin (`wp:positionH/@relativeFrom`, `ST_RelFromH`).
     * Missing residual position reads as {@link HorizontalOrigin.Column}.
     * Effective getter never returns `undefined` and does not dirty on read.
     *
     * @throws RangeError when `value` is not a known {@link HorizontalOrigin}.
     *
     * @public
     */
    get horizontalOrigin(): HorizontalOriginType {
        if (this.horizontalOriginValue !== undefined) {
            return this.horizontalOriginValue;
        }
        if (this.encodingValue === 'vml') {
            return HorizontalOriginType.Column;
        }
        const fromResidual: HorizontalOriginType = readDrawingPositionState(this.residual).horizontalOrigin;
        return fromResidual !== undefined ? fromResidual : HorizontalOriginType.Column;
    }
    set horizontalOrigin(value: HorizontalOriginType | undefined) {
        if (value !== undefined) {
            assertEnumMember('horizontalOrigin', value, HORIZONTAL_ORIGIN_SET);
        }
        this.horizontalModeled = true;
        this.horizontalOriginValue = value;
        this.markStructureDirty();
    }
    /**
     * Vertical origin (`wp:positionV/@relativeFrom`, `ST_RelFromV`).
     * Missing residual position reads as {@link VerticalOrigin.Paragraph}.
     * Effective getter never returns `undefined` and does not dirty on read.
     *
     * @throws RangeError when `value` is not a known {@link VerticalOrigin}.
     *
     * @public
     */
    get verticalOrigin(): VerticalOriginType {
        if (this.verticalOriginValue !== undefined) {
            return this.verticalOriginValue;
        }
        if (this.encodingValue === 'vml') {
            return VerticalOriginType.Paragraph;
        }
        const fromResidual: VerticalOriginType = readDrawingPositionState(this.residual).verticalOrigin;
        return fromResidual !== undefined ? fromResidual : VerticalOriginType.Paragraph;
    }
    set verticalOrigin(value: VerticalOriginType | undefined) {
        if (value !== undefined) {
            assertEnumMember('verticalOrigin', value, VERTICAL_ORIGIN_SET);
        }
        this.verticalModeled = true;
        this.verticalOriginValue = value;
        this.markStructureDirty();
    }
    /**
     * Horizontal offset (`wp:positionH/wp:posOffset`).
     * Setting a defined offset clears {@link horizontalAlignment} (align XOR
     * posOffset â€” CT_PosH schema choice). Setting `undefined` clears the modeled
     * offset (encoder then falls back to offset `0` unless align is modeled).
     *
     * @public
     */
    get horizontalPosition(): number | undefined {
        if (this.horizontalPositionValue !== undefined) {
            return this.horizontalPositionValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return readDrawingPositionState(this.residual).horizontalPosition;
    }
    set horizontalPosition(value: number | undefined) {
        this.horizontalModeled = true;
        this.horizontalPositionValue = value;
        if (value !== undefined) {
            this.horizontalAlignmentValue = undefined;
        }
        this.markStructureDirty();
    }
    /**
     * Vertical offset (`wp:positionV/wp:posOffset`).
     * Setting a defined offset clears {@link verticalAlignment} (align XOR
     * posOffset â€” CT_PosV schema choice). Setting `undefined` clears the modeled
     * offset (encoder then falls back to offset `0` unless align is modeled).
     *
     * @public
     */
    get verticalPosition(): number | undefined {
        if (this.verticalPositionValue !== undefined) {
            return this.verticalPositionValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return readDrawingPositionState(this.residual).verticalPosition;
    }
    set verticalPosition(value: number | undefined) {
        this.verticalModeled = true;
        this.verticalPositionValue = value;
        if (value !== undefined) {
            this.verticalAlignmentValue = undefined;
        }
        this.markStructureDirty();
    }
    /**
     * Horizontal alignment (`wp:positionH/wp:align`, `ST_AlignH`).
     * Setting a defined alignment clears {@link horizontalPosition} (align XOR
     * posOffset — CT_PosH schema choice). Effective value is never undefined:
     * modeled alignment, else residual align, else {@link HorizontalAlignment.None}
     * when the axis uses posOffset or the leaf is VML.
     *
     * @throws RangeError when `value` is not a known {@link HorizontalAlignment}.
     *
     * @public
     */
    get horizontalAlignment(): HorizontalAlignmentType {
        if (this.horizontalAlignmentValue !== undefined) {
            return this.horizontalAlignmentValue;
        }
        if (this.horizontalPositionValue !== undefined) {
            return HorizontalAlignmentType.None;
        }
        if (this.encodingValue === 'vml') {
            return HorizontalAlignmentType.None;
        }
        const fromResidual: HorizontalAlignmentType = readDrawingPositionState(this.residual).horizontalAlignment;
        return fromResidual !== undefined ? fromResidual : HorizontalAlignmentType.None;
    }
    set horizontalAlignment(value: HorizontalAlignmentType | undefined) {
        if (value !== undefined) {
            if (value === HorizontalAlignmentType.Unknown) {
                throw new RangeError(
                    'horizontalAlignment cannot be set to HorizontalAlignment.Unknown'
                );
            }
            assertEnumMember('horizontalAlignment', value, HORIZONTAL_ALIGNMENT_SET);
            this.horizontalPositionValue = undefined;
        }
        this.horizontalModeled = true;
        this.horizontalAlignmentValue = value;
        this.markStructureDirty();
    }
    /**
     * Vertical alignment (`wp:positionV/wp:align`, `ST_AlignV`).
     * Setting a defined alignment clears {@link verticalPosition} (align XOR
     * posOffset — CT_PosV schema choice). Effective value is never undefined:
     * modeled alignment, else residual align, else {@link VerticalAlignment.None}
     * when the axis uses posOffset or the leaf is VML.
     *
     * @throws RangeError when `value` is not a known {@link VerticalAlignment}.
     *
     * @public
     */
    get verticalAlignment(): VerticalAlignmentType {
        if (this.verticalAlignmentValue !== undefined) {
            return this.verticalAlignmentValue;
        }
        if (this.verticalPositionValue !== undefined) {
            return VerticalAlignmentType.None;
        }
        if (this.encodingValue === 'vml') {
            return VerticalAlignmentType.None;
        }
        const fromResidual: VerticalAlignmentType = readDrawingPositionState(this.residual).verticalAlignment;
        return fromResidual !== undefined ? fromResidual : VerticalAlignmentType.None;
    }
    set verticalAlignment(value: VerticalAlignmentType | undefined) {
        if (value !== undefined) {
            if (value === VerticalAlignmentType.Unknown) {
                throw new RangeError(
                    'verticalAlignment cannot be set to VerticalAlignment.Unknown'
                );
            }
            assertEnumMember('verticalAlignment', value, VERTICAL_ALIGNMENT_SET);
            this.verticalPositionValue = undefined;
        }
        this.verticalModeled = true;
        this.verticalAlignmentValue = value;
        this.markStructureDirty();
    }
    /**
     * Lock anchor (`wp:anchor/@locked`): the anchor location must not be modified
     * at runtime by an application editing the document (ECMA-376-1 Â§20.4.2.1).
     * Inline and VML leaves report `false`.
     *
     * @public
     */
    get lockAnchor(): boolean {
        if (this.lockAnchorValue !== undefined) {
            return this.lockAnchorValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingWrapState(this.residual).lockAnchor;
    }
    set lockAnchor(value: boolean) {
        this.lockAnchorValue = value;
        this.markStructureDirty();
    }
    /**
     * Allow overlap (`wp:anchor/@allowOverlap`). Inline and VML leaves report
     * `false` (inline hosts have no anchor surface).
     *
     * @public
     */
    /**
     * @private
     */
    private get allowOverlapInternal(): boolean {
        if (this.allowOverlapValue !== undefined) {
            return this.allowOverlapValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingWrapState(this.residual).allowOverlap;
    }
    /**
     *  @private
     *
     * @param {boolean} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set allowOverlapInternal(value: boolean) {
        this.allowOverlapValue = value;
        this.markStructureDirty();
    }
    /**
     * Layout in table cell (`wp:anchor/@layoutInCell`). Inline and VML leaves
     * report `false` (inline hosts have no anchor surface).
     *
     * @public
     */
    get layoutInCell(): boolean {
        if (this.layoutInCellValue !== undefined) {
            return this.layoutInCellValue;
        }
        if (this.encodingValue === 'vml') {
            return false;
        }
        return readDrawingWrapState(this.residual).layoutInCell;
    }
    set layoutInCell(value: boolean) {
        this.layoutInCellValue = value;
        this.markStructureDirty();
    }
    // -------------------------------------------------------------------------
    // Geometry, fill, line MVP
    // -------------------------------------------------------------------------
    /**
     *  Lazy spPr state read (cached per instance; invalidated on structure dirty).
     *
     * @returns {ShapePropertiesStateCached} Returns the result.
     */
    private readSpPrState(): ShapePropertiesStateCached {
        if (this.spPrState === undefined) {
            const state: ShapePropertiesState = readShapePropertiesState(this.residual);
            this.spPrState = {
                presetGeometry: state.presetGeometry,
                useCustomGeometry: state.useCustomGeometry,
                fill: state.fill,
                line: state.line,
                hasThemeStyle: state.hasThemeStyle
            };
        }
        return this.spPrState;
    }
    /**
     * Preset geometry token (`a:prstGeom/@prst`, `ST_ShapeType`).
     * `undefined` when spPr is absent, has `a:custGeom`, or the `@prst` token is
     * not in the schema set (residual passthrough). VML reads `undefined`.
     *
     * @throws RangeError when set to a value outside `ST_ShapeType`.
     *
     * @private
     */
    get presetGeometryToken(): string | undefined {
        if (this.presetGeometryValue !== undefined) {
            return this.presetGeometryValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return this.readSpPrState().presetGeometry;
    }
    set presetGeometryToken(value: string | undefined) {
        if (value !== undefined && !isStShapeType(value)) {
            throw new RangeError(`Invalid presetGeometry value "${value}"; expected an ST_ShapeType token`);
        }
        this.presetGeometryValue = value;
        this.markStructureDirty();
    }
    /**
     * Fill MVP (`CT_ShapeProperties` `EG_FillProperties`).
     *
     * Reads:
     * - `a:solidFill/a:srgbClr` â†’ `{ kind: 'solid', srgb }`
     * - `a:noFill` â†’ `{ kind: 'none' }`
     * - `a:pattFill` â†’ `{ kind: 'pattern', preset }` (residual-preserving slice)
     * - theme/absent/gradient/picture â†’ `undefined` or `{ kind: 'theme' }`
     *   (never an invented color); check {@link DrawingShape.hasThemeStyle}.
     *
     * Setting `solid`/`none` marks the shape structure dirty and replaces the
     * spPr fill child (`wps:style` theme refs stay residual per GO).
     *
     * @public
     */
    /**
     * @private
     */
    private get fillInternal(): ShapeFill | undefined {
        if (this.fillModeled) {
            return this.fillValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return this.readSpPrState().fill;
    }
    /**
     *  @private
     *
     * @param {ShapeFill | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set fillInternal(value: ShapeFill | undefined) {
        if (value !== undefined && value.kind !== 'solid' && value.kind !== 'none') {
            throw new RangeError(`Fill kind "${String(value.kind)}" cannot be authored; use solid or none`);
        }
        this.fillValue = value;
        this.fillModeled = true;
        this.markStructureDirty();
    }
    /**
     * Line MVP (`a:ln`). `kind: 'theme'` when absent/non-srgb (inherited from
     * `wps:style`); `kind: 'none'` when `a:ln/a:noFill`; `residual: true` flags a
     * line with unmodeled children (join/custDash/nknown dash) â€” mutating it
     * would drop those children, so serialization keeps the residual element
     * unless the caller models it explicitly.
     *
     * @public
     */
    /**
     * @private
     */
    private get lineInternal(): ShapeLine | undefined {
        if (this.lineModeled) {
            return this.lineValue;
        }
        if (this.encodingValue === 'vml') {
            return undefined;
        }
        return this.readSpPrState().line;
    }
    /**
     *  @private
     *
     * @param {ShapeLine | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    private set lineInternal(value: ShapeLine | undefined) {
        if (value !== undefined && value.kind !== 'solid' && value.kind !== 'none') {
            throw new RangeError(`Line kind "${String(value.kind)}" cannot be authored; use solid or none`);
        }
        this.lineValue = value;
        this.lineModeled = true;
        this.markStructureDirty();
    }
    /**
     * Whether theme formatting (`wps:style` with `lnRef`/`fillRef`/`effectRef`/
     * `fontRef`) is present on the shape. Theme-styled shapes without a solid
     *
     * @private
     * override read fill/line as `theme`/`undefined` â€” set {@link fill}/
     * {@link line} to replace.
     */
    get hasThemeStyle(): boolean {
        if (this.encodingValue === 'vml') {
            return false;
        }
        return this.readSpPrState().hasThemeStyle;
    }
    // -------------------------------------------------------------------------
    // Text box bodyPr + txbx body
    // -------------------------------------------------------------------------
    /**
     * Lazy residual txbx state read (cached per instance).
     *
     * @returns {TextBoxStateCached} The result.
     * @private
     */
    private readTxbxState(): TextBoxStateCached {
        if (this.txbxState === undefined) {
            if (this.encodingValue === 'vml') {
                this.txbxState = {
                    present: false,
                    blocks: [],
                    residualTxbx: undefined,
                    residualTxbxContent: undefined
                };
                return this.txbxState;
            }
            const residualTxbx: OpenXmlElement = findTxbxElement(this.residual);
            const residualTxbxContent: OpenXmlElement = residualTxbx !== undefined ? findTxbxContentElement(residualTxbx) : undefined;
            // Materialize lazily (spec: prefer lazy on first body access). Parse on
            // first access with a textbox-scoped paragraph owner so appended content
            // validates membership against this shape's body.
            const blocks: BlockContent[] = residualTxbxContent !== undefined
                ? parseTxbxContentBlocks(residualTxbxContent, this.textBoxOwnerForParse())
                : [];
            this.txbxState = {
                present: residualTxbx !== undefined,
                blocks,
                residualTxbx,
                residualTxbxContent
            };
        }
        return this.txbxState;
    }
    /**
     * Parse context for lazy textbox body initialization.
     * Provides BodyBlockParseContext implementation for txbx parsing.
     *
     * @returns {BodyBlockParseContext} The result.
     * @private
     */
    private textBoxOwnerForParse(): BodyBlockParseContext {
        // Object-literal methods below need the shape, not the literal, as `this`.
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const shape: DrawingShape = this;
        return {
            assertAttachedParagraph(target: Paragraph): void {
                if (!blockListOwnsParagraph(shape.internalBlocks(), target)) {
                    throw new DetachedObjectError('Paragraph is not in this text box');
                }
            },
            owningDocument(): WordDocument {
                // Text box paragraphs live inside the run leaf; the owning document is the
                // document that owns the anchoring paragraph. Resolve lazily through the
                // shape's anchor paragraph when bound; otherwise detached.
                return shape.internalOwningDocument();
            }
        };
    }
    /**
     * Whether this shape hosts a WordprocessingShape text box
     * (`wps:txbx` child). Deep residual walk only â€” does **not** materialize
     * the body block state (reads stay byte-stable). `linkedTxbx` also reports
     * true for guard purposes â€” linked text boxes are out of scope (GO) but
     * body APIs still throw the documented non-textBox error only when no txbx
     * of any kind exists.
     *
     * @returns {boolean} The result.
     * @private
     */
    isTextBox(): boolean {
        if (this.encodingValue === 'vml') {
            return false;
        }
        if (this.txbxBodyModeled) {
            return true;
        }
        return findTxbxElement(this.residual) !== undefined;
    }
    /**
     * Whether the residual root carries a Markup Compatibility Fallback branch
     * with a VML `w:pict` tree (Policy B dual AC).
     *
     * True for authored dual AC and for residual Choice+Fallback fixtures.
     * Pure DrawingML-only or pure VML leaves return false. Does not execute VML.
     *
     * @returns {boolean} The result.
     * @private
     */
    hasVmlFallback(): boolean {
        if (this.encodingValue === 'vml') {
            return false;
        }
        return residualHasVmlFallback(this.residual);
    }
    /**
     *  Guard for body APIs on non-textBox shapes.
     *
     * @returns {TextBoxStateCached} Returns the result.
     */
    private requireTextBox(): TextBoxStateCached {
        if (!this.isTextBox()) {
            throw new DocxError('content/invalid-shape', 'Text box body APIs require a textBox variant shape (wps:txbx). ' +
                'Author one with appendShape({ textBox: true }) or edit a loaded text box.');
        }
        return this.readTxbxState();
    }
    /**
     * Lazy residual bodyPr state read (cached per instance).
     *
     * @returns {BodyPropertiesState} The result.
     * @private
     */
    private readBodyPrState(): BodyPropertiesState {
        if (this.bodyPrModeled && this.bodyPrValue !== undefined) {
            return this.bodyPrValue;
        }
        if (this.bodyPrValue === undefined) {
            if (this.encodingValue === 'vml') {
                this.bodyPrValue = {
                    verticalAnchor: undefined,
                    anchorCenter: undefined,
                    textDirection: undefined,
                    textWrapInside: undefined,
                    verticalOverflow: undefined,
                    horizontalOverflow: undefined,
                    fromWordArt: undefined,
                    insets: undefined,
                    autoFit: undefined,
                    hasPresetTextWarp: false,
                    residual: false
                };
            }
            else {
                this.bodyPrValue = readBodyPropertiesState(this.residual);
            }
        }
        return this.bodyPrValue;
    }
    /**
     * Persist a modeled bodyPr slice (marks structure dirty).
     *
     * @param {BodyPropertiesState} patch - The patch.
     * @returns {void} Nothing is returned.
     * @private
     */
    private writeBodyPrField(patch: BodyPropertiesState): void {
        if (this.encodingValue === 'vml') {
            throw new DocxError('content/invalid-shape', 'VML leaves do not carry wps:bodyPr; convert to DrawingML to model text body properties');
        }
        this.bodyPrValue = patch;
        this.bodyPrModeled = true;
        this.markStructureDirty();
    }
    /**
     * Text anchor inside the shape (`wps:bodyPr/@anchor`,
     * `ST_TextAnchoringType`: `t|ctr|b|just|dist`). `undefined` = attribute
     * absent (Word default `t`).
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get verticalAnchor(): TextAnchoring | undefined {
        return this.readBodyPrState().verticalAnchor;
    }
    /**
     * Text anchor inside the shape (`wps:bodyPr/@anchor`,
     * `ST_TextAnchoringType`: `t|ctr|b|just|dist`). `undefined` = attribute
     * absent (Word default `t`).
     *
     * @param {TextAnchoring | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set verticalAnchor(value: TextAnchoring | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, verticalAnchor: value });
    }
    /**
     * Center anchoring (`wps:bodyPr/@anchorCtr`). `undefined` = attribute absent.
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get anchorCenter(): boolean | undefined {
        return this.readBodyPrState().anchorCenter;
    }
    /**
     * Center anchoring (`wps:bodyPr/@anchorCtr`). `undefined` = attribute absent.
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set anchorCenter(value: boolean | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, anchorCenter: value });
    }
    /**
     * Vertical text type (`wps:bodyPr/@vert`, `ST_TextVerticalType`).
     * `undefined` = attribute absent (horizontal).
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @public
     */
    get textDirection(): TextVerticalType | undefined {
        return this.readBodyPrState().textDirection;
    }
    set textDirection(value: TextVerticalType | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, textDirection: value });
    }
    /**
     * Text wrap inside the shape (`wps:bodyPr/@wrap`,
     * `ST_TextWrappingType`: `none|square` only per schema).
     * `undefined` = attribute absent (square).
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get textWrapInside(): TextBodyWrap | undefined {
        return this.readBodyPrState().textWrapInside;
    }
    /**
     * Text wrap inside the shape (`wps:bodyPr/@wrap`,
     * `ST_TextWrappingType`: `none|square` only per schema).
     * `undefined` = attribute absent (square).
     *
     * @param {TextBodyWrap | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set textWrapInside(value: TextBodyWrap | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, textWrapInside: value });
    }
    /**
     * Vertical text overflow (`wps:bodyPr/@vertOverflow`,
     * `ST_TextVertOverflowType`). `undefined` = attribute absent.
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get verticalOverflow(): TextVertOverflow | undefined {
        return this.readBodyPrState().verticalOverflow;
    }
    /**
     * Vertical text overflow (`wps:bodyPr/@vertOverflow`,
     * `ST_TextVertOverflowType`). `undefined` = attribute absent.
     *
     * @param {TextVertOverflow | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set verticalOverflow(value: TextVertOverflow | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, verticalOverflow: value });
    }
    /**
     * Horizontal text overflow (`wps:bodyPr/@horzOverflow`,
     * `ST_TextHorzOverflowType`). `undefined` = attribute absent.
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get horizontalOverflow(): TextHorzOverflow | undefined {
        return this.readBodyPrState().horizontalOverflow;
    }
    /**
     * Horizontal text overflow (`wps:bodyPr/@horzOverflow`,
     * `ST_TextHorzOverflowType`). `undefined` = attribute absent.
     *
     * @param {TextHorzOverflow | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set horizontalOverflow(value: TextHorzOverflow | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, horizontalOverflow: value });
    }
    /**
     * WordArt source flag (`wps:bodyPr/@fromWordArt`). `undefined` = absent.
     * Flag only â€” no WordArt pipeline (GO).
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get fromWordArt(): boolean | undefined {
        return this.readBodyPrState().fromWordArt;
    }
    /**
     * WordArt source flag (`wps:bodyPr/@fromWordArt`). `undefined` = absent.
     * Flag only â€” no WordArt pipeline (GO).
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set fromWordArt(value: boolean | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, fromWordArt: value });
    }
    /**
     * Text insets (`wps:bodyPr/@lIns|tIns|rIns|bIns`, `ST_Coordinate32` EMU).
     * Non-negative EMU `Point`; `undefined` per side = attribute absent
     * (Word default 91440/45720/91440/45720). Absent insets object = no
     * inset attribute modeled.
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get insets(): BodyInsets | undefined {
        return this.readBodyPrState().insets;
    }
    /**
     * Text insets (`wps:bodyPr/@lIns|tIns|rIns|bIns`, `ST_Coordinate32` EMU).
     * Non-negative EMU `Point`; `undefined` per side = attribute absent
     * (Word default 91440/45720/91440/45720). Absent insets object = no
     * inset attribute modeled.
     *
     * @param {BodyInsets | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set insets(value: BodyInsets | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, insets: value });
    }
    /**
     * Autofit choice (`wps:bodyPr` child: `a:noAutofit` | `a:normAutofit` |
     * `a:spAutoFit`, `EG_TextAutofit`). `undefined` = no autofit child
     * (Word default noAutofit). Residual `a:prstTxWarp` / 3D / extLst stay
     * residual â€” setting any bodyPr field rebuilds bodyPr without them
     * (residual flag on read documents what was dropped).
     *
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    get autoFit(): TextAutoFit | undefined {
        return this.readBodyPrState().autoFit;
    }
    /**
     * Text insets (`wps:bodyPr/@lIns|tIns|rIns|bIns`, `ST_Coordinate32` EMU).
     * Non-negative EMU `Point`; `undefined` per side = attribute absent
     * (Word default 91440/45720/91440/45720). Absent insets object = no
     * inset attribute modeled.
     *
     * @param {TextAutoFit | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-shape` on a VML leaf.
     *
     * @private
     */
    set autoFit(value: TextAutoFit | undefined) {
        const current: BodyPropertiesState = this.readBodyPrState();
        this.writeBodyPrField({ ...current, autoFit: value });
    }
    /**
     * Whether residual `wps:bodyPr` carries unmodeled content (`a:prstTxWarp`,
     * 3D children, `extLst`, unknown attributes). Read-only; mutating any
     * bodyPr field rebuilds `wps:bodyPr` from modeled state and drops the
     * residual children (documented in the mapping).
     *
     * @private
     */
    get bodyPrResidual(): boolean {
        if (this.encodingValue === 'vml') {
            return false;
        }
        return this.readBodyPrState().residual;
    }
    /**
     * Whether the residual bodyPr has WordArt warp (`a:prstTxWarp` child).
     * Read-only flag â€” warp is not modeled (never invented).
     *
     * @private
     */
    get hasPresetTextWarp(): boolean {
        if (this.encodingValue === 'vml') {
            return false;
        }
        return this.readBodyPrState().hasPresetTextWarp;
    }
    /**
     * Modeled blocks inside `w:txbxContent` (GO Q6). Public consumers use
     * {@link Shape.items} / {@link Shape.insertBodyItemAt}.
     * Projects internal {@link BlockContent} store via body-item adapters.
     *
     * @private
     */
    get blocks(): ReadonlyArray<BodyItem> {
        this.requireTextBox();
        return this.textBody.items.toArray();
    }
    /**
     * Insert a body item at `index` in the text box block list.
     * Public consumers use {@link Shape.insertBodyItemAt}.
     *
     * @param {number} index - The index.
     * @param {BodyItem} item - The item.
     * @returns {BodyItem} The result.
     * @private
     */
    insertBodyItemAt(index: number, item: BodyItem): BodyItem {
        this.requireTextBox();
        return this.textBody.items.insert(index, item);
    }
    /**
     * Remove the body item at `index` in the text box block list.
     * Public consumers use {@link Shape.removeBodyItemAt}.
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeBodyItemAt(index: number): void {
        this.requireTextBox();
        this.textBody.items.removeAt(index);
    }
    /**
     * Remove a body item from the text box block list by projected identity.
     * Public consumers use {@link Shape.removeBodyItem}.
     *
     * @param {BodyItem} item - The item.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeBodyItem(item: BodyItem): void {
        this.requireTextBox();
        this.textBody.items.remove(item);
    }
    /**
     * @returns {ReadonlyArray<BlockContent>} The result.
     * @private
     * Txbx block store for attach checks during lazy parsing.
     */
    internalBlocks(): ReadonlyArray<BlockContent> {
        if (this.textBodyValue !== undefined) {
            return this.textBodyValue.rawBlocks();
        }
        if (this.txbxState !== undefined) {
            return this.txbxState.blocks;
        }
        return this.readTxbxState().blocks;
    }
    /**
     * @returns {WordDocument} The result.
     * @private
     * Owning document for textbox body paragraphs. Resolves through
     * the anchoring paragraph when bound; throws detached otherwise.
     */
    internalOwningDocument(): WordDocument {
        const paragraph: Paragraph = this.anchoringParagraph;
        if (paragraph !== undefined) {
            return paragraph.owningDocument();
        }
        throw new DetachedObjectError('This drawing shape is not attached to a document paragraph');
    }
    /**
     * Anchoring paragraph (bound at append/load time).
     *
     * @private
     */
    private anchoringParagraph: Paragraph | undefined;
    /**
     *  Anchoring paragraph accessor; package-visible for GroupShape reparenting.
     *
     * @returns {Paragraph | undefined} The result.
     * @private
     */
    getAnchoringParagraph(): Paragraph | undefined {
        return this.anchoringParagraph;
    }
    /**
     * Binds the anchoring paragraph, which is used to resolve the owning document of the text box content.
     *
     * @param {Paragraph | undefined} paragraph - Specifies the paragraph that anchors the shape.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindAnchoringParagraph(paragraph: Paragraph | undefined): void {
        this.anchoringParagraph = paragraph;
    }
    /**
     * Relationship ids referenced by `r:embed` or `r:link` in the preserved subtree.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    relationshipIds(): ReadonlyArray<string> {
        return collectRelationshipIds(this.residual);
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        // Text box body serialization precedence: once the txbx block
        // state was materialized, the DOM owns `w:txbxContent` on every path â€”
        // nested table-cell/SDT mutations serialize even when the host stays
        // clean. The host shell is preserved (clone + txbxContent replacement on
        // clean/identity/layout; full dual-AC rebuild only on structure), so
        // unmodified bodies round-trip byte-stable (modeled paragraph
        // serialization is the same byte-stable path as the document body).
        if (this.txbxState !== undefined && this.encodingValue !== 'vml') {
            const state: TextBoxStateCached = this.readTxbxState();
            if (this.dirtyMode === 'clean') {
                let host: OpenXmlElement = this.replaceTxbxContentInResidual(cloneResidualElement(this.residual), state);
                if (this.hasDirtyNestedChildren()) {
                    host = this.rewriteResidualNestedChildren(host);
                }
                return host;
            }
            if (this.dirtyMode === 'identity') {
                const patchedIdentity: OpenXmlElement = isNestedDrawingResidual(this.residual)
                    ? patchResidualCNvPr(cloneResidualElement(this.residual), {
                        name: this.nameValue,
                        title: this.titleValue,
                        description: this.descriptionValue,
                        docPrId: this.docPrIdValue
                    })
                    : patchResidualDocPr(cloneResidualElement(this.residual), {
                        name: this.nameValue,
                        title: this.titleValue,
                        description: this.descriptionValue,
                        docPrId: this.docPrIdValue
                    });
                let host: OpenXmlElement = this.replaceTxbxContentInResidual(patchedIdentity, state);
                if (this.hasDirtyNestedChildren()) {
                    host = this.rewriteResidualNestedChildren(host);
                }
                return host;
            }
            if (this.dirtyMode === 'layout') {
                if (this.widthValue === undefined || this.heightValue === undefined) {
                    throw new DocxError('content/invalid-shape', 'Layout-dirty drawing shape is missing width or height');
                }
                const widthEmu: Emus = pointToEmus(this.widthValue);
                const heightEmu: Emus = pointToEmus(this.heightValue);
                let host: OpenXmlElement = patchResidualLayout(this.residual, {
                    widthEmu,
                    heightEmu,
                    rotation: this.rotationValue != null ? this.rotationValue : 0,
                    flipHorizontal: this.flipHorizontalValue != null ? this.flipHorizontalValue : false,
                    flipVertical: this.flipVerticalValue != null ? this.flipVerticalValue : false,
                    lockAspectRatio: this.lockAspectRatioValue != null ? this.lockAspectRatioValue : false,
                    name: this.nameValue,
                    title: this.titleValue,
                    description: this.descriptionValue,
                    docPrId: this.docPrIdValue
                });
                // DOM owns w:txbxContent once materialized — layout must not drop body edits.
                host = this.replaceTxbxContentInResidual(host, state);
                if (this.hasDirtyNestedChildren()) {
                    host = this.rewriteResidualNestedChildren(host);
                }
                return host;
            }
            // structure — falls through to the full rebuild below.
        }
        if (this.dirtyMode === 'clean') {
            // Parent group/canvas may stay clean while a nested child is dirty
            // (e.g. ChildA rename). Rewrite nested wsp/grpSp in-place, preserving
            // residual grpSpPr and unknown siblings.
            if (this.hasDirtyNestedChildren()) {
                return this.rewriteResidualNestedChildren(cloneResidualElement(this.residual));
            }
            return this.residual;
        }
        if (this.dirtyMode === 'identity') {
            const identity: { name: string; title: string; description: string; docPrId: number; } = {
                name: this.nameValue,
                title: this.titleValue,
                description: this.descriptionValue,
                docPrId: this.docPrIdValue
            };
            let host: OpenXmlElement = isNestedDrawingResidual(this.residual)
                ? patchResidualCNvPr(this.residual, identity)
                : patchResidualDocPr(this.residual, identity);
            if (this.hasDirtyNestedChildren()) {
                host = this.rewriteResidualNestedChildren(host === this.residual ? cloneResidualElement(this.residual) : host);
            }
            return host;
        }
        if (this.dirtyMode === 'layout') {
            if (this.widthValue === undefined || this.heightValue === undefined) {
                throw new DocxError('content/invalid-shape', 'Layout-dirty drawing shape is missing width or height');
            }
            const widthEmu: Emus = pointToEmus(this.widthValue);
            const heightEmu: Emus = pointToEmus(this.heightValue);
            let host: OpenXmlElement = patchResidualLayout(this.residual, {
                widthEmu,
                heightEmu,
                rotation: this.rotationValue != null ? this.rotationValue : 0,
                flipHorizontal: this.flipHorizontalValue != null ? this.flipHorizontalValue : false,
                flipVertical: this.flipVerticalValue != null ? this.flipVerticalValue : false,
                lockAspectRatio: this.lockAspectRatioValue != null ? this.lockAspectRatioValue : false,
                name: this.nameValue,
                title: this.titleValue,
                description: this.descriptionValue,
                docPrId: this.docPrIdValue
            });
            if (this.hasDirtyNestedChildren()) {
                host = this.rewriteResidualNestedChildren(host);
            }
            return host;
        }
        // structure — dual AC author / rebuild (host kind / wrap / geometry / group)
        const placement: DrawingHostPlacement = this.placementValue != null ? this.placementValue : 'anchor';
        const widthEmu: Emus = this.widthValue === undefined ? undefined : pointToEmus(this.widthValue);
        const heightEmu: Emus = this.heightValue === undefined ? undefined : pointToEmus(this.heightValue);
        // Coordinates/distances may be 0; do not wrap with emus() (positive-only).
        const distanceTopEmu: Emus = this.distanceTopValue === undefined ? undefined : pointToCoordinateEmus(this.distanceTopValue);
        const distanceBottomEmu: Emus =
            this.distanceBottomValue === undefined ? undefined : pointToCoordinateEmus(this.distanceBottomValue);
        const distanceLeftEmu: Emus = this.distanceLeftValue === undefined ? undefined : pointToCoordinateEmus(this.distanceLeftValue);
        const distanceRightEmu: Emus = this.distanceRightValue === undefined ? undefined : pointToCoordinateEmus(this.distanceRightValue);
        const horizontalPositionEmu: Emus =
            this.horizontalPositionValue === undefined ? undefined : pointToCoordinateEmus(this.horizontalPositionValue);
        const verticalPositionEmu: Emus =
            this.verticalPositionValue === undefined ? undefined : pointToCoordinateEmus(this.verticalPositionValue);
        const docPrId: number = this.docPrIdValue != null ? this.docPrIdValue : 1;
        const wrapping: TextWrappingStyleType = this.wrappingValue != null ? this.wrappingValue : (placement === 'inline' ? TextWrappingStyle.Inline : TextWrappingStyle.None);
        // group/canvas structure encode (empty children OK). Must run
        // before the leaf presetGeometry required check.
        const variant: string = this.variant();
        const isGroupOrCanvasHost: boolean = this.childrenModeled || variant === 'group' || variant === 'canvas';
        if (isGroupOrCanvasHost) {
            if (widthEmu === undefined || heightEmu === undefined) {
                throw new DocxError('content/invalid-shape', 'Authored drawing group is missing width or height');
            }
            this.ensureChildrenModeled();
            const childElements: OpenXmlElement[] = this.childrenValue.map((child: DrawingShape) => child.toOpenXml());
            return encodeAuthoredGroup(encodeGroupInput({
                placement,
                widthEmu,
                heightEmu,
                docPrId,
                name: this.nameValue != null ? this.nameValue : 'Group',
                title: this.titleValue,
                description: this.descriptionValue,
                rotation: this.rotationValue != null ? this.rotationValue : 0,
                flipHorizontal: this.flipHorizontalValue != null ? this.flipHorizontalValue : false,
                flipVertical: this.flipVerticalValue != null ? this.flipVerticalValue : false,
                lockAspectRatio: this.lockAspectRatioValue != null ? this.lockAspectRatioValue : true,
                wrapping,
                distanceTopEmu,
                distanceBottomEmu,
                distanceLeftEmu,
                distanceRightEmu,
                behindDocument: this.behindDocumentValue,
                horizontalOrigin: this.horizontalOriginValue,
                verticalOrigin: this.verticalOriginValue,
                horizontalPositionEmu,
                verticalPositionEmu,
                horizontalAlignment: this.horizontalAlignmentValue,
                verticalAlignment: this.verticalAlignmentValue,
                horizontalModeled: this.horizontalModeled,
                verticalModeled: this.verticalModeled,
                lockAnchor: this.lockAnchorValue,
                allowOverlap: this.allowOverlapValue,
                layoutInCell: this.layoutInCellValue,
                preservedHost: this.residual,
                layoutDirty: true,
                children: childElements
            }));
        }
        // nested bare wsp structure rebuild (no second drawing host).
        if (isNestedDrawingResidual(this.residual)) {
            if (widthEmu === undefined || heightEmu === undefined) {
                throw new DocxError('content/invalid-shape', 'Authored nested drawing shape is missing width or height');
            }
            const presetGeometryNested: string = this.presetGeometryValue;
            if (presetGeometryNested === undefined) {
                throw new DocxError('content/invalid-shape', 'Authored nested drawing shape is missing presetGeometry');
            }
            let txbxContentNested: ReadonlyArray<OpenXmlElement> | undefined;
            if (this.txbxState !== undefined || this.txbxBodyModeled) {
                const state: TextBoxStateCached = this.readTxbxState();
                txbxContentNested = serializeTxbxContentBlocks(state.blocks.length > 0 ? state.blocks : emptyTxbxParagraphBlocks());
            }
            const bodyPrNested: OpenXmlElement = this.bodyPrModeled
                ? buildBodyPrElement(this.bodyPrValue != null ? this.bodyPrValue : {})
                : undefined;
            const encodeFillNested: ReturnType<typeof modeledFillForEncode> = this.fillModeled
                ? modeledFillForEncode(this.fillValue)
                : undefined;
            const encodeLineNested: ReturnType<typeof modeledLineForEncode> = this.lineModeled
                ? modeledLineForEncode(this.lineValue)
                : undefined;
            return buildNestedWpsShape({
                placement: 'anchor',
                widthEmu,
                heightEmu,
                presetGeometry: presetGeometryNested,
                docPrId,
                name: this.nameValue != null ? this.nameValue : 'Shape',
                title: this.titleValue,
                description: this.descriptionValue,
                rotation: this.rotationValue != null ? this.rotationValue : 0,
                flipHorizontal: this.flipHorizontalValue != null ? this.flipHorizontalValue : false,
                flipVertical: this.flipVerticalValue != null ? this.flipVerticalValue : false,
                lockAspectRatio: this.lockAspectRatioValue != null ? this.lockAspectRatioValue : true,
                txbxContent: txbxContentNested,
                bodyPr: bodyPrNested,
                fill: encodeFillNested,
                line: encodeLineNested
            });
        }
        const presetGeometry: string = this.presetGeometryValue;
        if (widthEmu === undefined || heightEmu === undefined || presetGeometry === undefined) {
            throw new DocxError('content/invalid-shape', 'Authored drawing shape is missing size or presetGeometry');
        }
        // text box body + bodyPr encode. The body is rebuilt from the
        // typed block state whenever it was materialized (any body access â€”
        // top-level or nested inside a table/SDT) or explicitly modeled; nested
        // mutations serialize because the materialized blocks reference the same
        // live Paragraph/Table/SDT objects. When the body was never accessed, the
        // residual txbx is cloned verbatim (structure dirt from layout/wrap
        // mutators must not drop textbox content). bodyPr emits when modeled.
        let txbxContent: ReadonlyArray<OpenXmlElement> | undefined;
        if (this.txbxState !== undefined || this.txbxBodyModeled) {
            const state: TextBoxStateCached = this.readTxbxState();
            txbxContent = serializeTxbxContentBlocks(state.blocks.length > 0 ? state.blocks : emptyTxbxParagraphBlocks());
        }
        const bodyPrElement: OpenXmlElement = this.bodyPrModeled
            ? buildBodyPrElement(this.bodyPrValue != null ? this.bodyPrValue : {})
            : undefined;
        return encodeAuthoredDrawingShape(encodeDrawingShapeInput({
            placement,
            widthEmu,
            heightEmu,
            presetGeometry,
            docPrId,
            name: this.nameValue != null ? this.nameValue : 'Shape',
            title: this.titleValue,
            description: this.descriptionValue,
            rotation: this.rotationValue != null ? this.rotationValue : 0,
            flipHorizontal: this.flipHorizontalValue != null ? this.flipHorizontalValue : false,
            flipVertical: this.flipVerticalValue != null ? this.flipVerticalValue : false,
            lockAspectRatio: this.lockAspectRatioValue != null ? this.lockAspectRatioValue : true,
            wrapping,
            wrapType: this.readWrapType(),
            distanceTopEmu,
            distanceBottomEmu,
            distanceLeftEmu,
            distanceRightEmu,
            behindDocument: this.behindDocumentValue,
            horizontalOrigin: this.horizontalOriginValue,
            verticalOrigin: this.verticalOriginValue,
            horizontalPositionEmu,
            verticalPositionEmu,
            horizontalAlignment: this.horizontalAlignmentValue,
            verticalAlignment: this.verticalAlignmentValue,
            horizontalModeled: this.horizontalModeled,
            verticalModeled: this.verticalModeled,
            lockAnchor: this.lockAnchorValue,
            allowOverlap: this.allowOverlapValue,
            layoutInCell: this.layoutInCellValue,
            preservedHost: this.residual,
            layoutDirty: true,
            txbxContent: txbxContent,
            bodyPr: bodyPrElement,
            fill: this.fillModeled ? modeledFillForEncode(this.fillValue) : undefined,
            line: this.lineModeled ? modeledLineForEncode(this.lineValue) : undefined
        }));
    }
    /**
     * Replace the materialized `w:txbxContent` inside a cloned residual host
     * (identity / layout dirty paths keep everything else verbatim).
     *
     * @param {OpenXmlElement} host - Specifies the host.
     * @param {TextBoxStateCached} state - Specifies the state.
     * @returns {OpenXmlElement} Returns the result.
     */
    private replaceTxbxContentInResidual(host: OpenXmlElement, state: TextBoxStateCached): OpenXmlElement {
        const txbxContentHost: OpenXmlElement = findTxbxElement(host);
        if (txbxContentHost === undefined) {
            return host;
        }
        const txbxContent: OpenXmlElement[] = serializeTxbxContentBlocks(
            state.blocks.length > 0 ? state.blocks : emptyTxbxParagraphBlocks()
        );
        // Replace the w:txbxContent child of the cloned wps:txbx (attributes
        // â€” e.g. @id for linked-box pairs â€” and linkedTxbx siblings stay).
        const children: OpenXmlChild[] = txbxContentHost.children.filter((c: OpenXmlChild) => !(c.kind === 'element' && c.localName === 'txbxContent'));
        (txbxContentHost as {
            children: OpenXmlElement['children'];
        }).children = [
            ...children,
            (() => {
                const el: OpenXmlElement = wmlElement('txbxContent', { children: txbxContent });
                return el;
            })()
        ];
        return host;
    }
    private drawingRoot(): OpenXmlElement | undefined {
        let ts330: any;
        return ((ts330 = preferredDrawingElement(this.residual)), ts330 != null ? ts330 : (isWml(this.residual, 'drawing') ? this.residual : undefined));
    }
    private markIdentityDirty(): void {
        if (this.dirtyMode === 'structure' || this.dirtyMode === 'layout') {
            this.notifyParentOfChildDirty();
            return;
        }
        if (this.dirtyMode === 'clean') {
            const identity: { name: string; title: string; description: string; docPrId: number; } = this.readResidualIdentity();
            if (this.nameValue === undefined) {
                this.nameValue = identity.name;
            }
            if (this.titleValue === undefined) {
                this.titleValue = identity.title;
            }
            if (this.descriptionValue === undefined) {
                this.descriptionValue = identity.description;
            }
            if (this.docPrIdValue === undefined) {
                this.docPrIdValue = identity.docPrId;
            }
        }
        this.dirtyMode = 'identity';
        this.notifyParentOfChildDirty();
    }
    /**
     * Promote to layout dirty. Never demotes `structure`.
     * Hydrates size/transform/lock from residual when leaving `clean`/`identity`.
     *
     * @returns {void} Nothing.
     */
    private markLayoutDirty(): void {
        if (this.dirtyMode === 'structure') {
            this.notifyParentOfChildDirty();
            return;
        }
        if (this.dirtyMode === 'clean' || this.dirtyMode === 'identity') {
            this.hydrateIdentityAndLayoutFromResidual();
        }
        this.dirtyMode = 'layout';
        this.notifyParentOfChildDirty();
    }
    /**
     * Promote the leaf to a textBox variant (`wps:txbx` modeled).
     * Never demotes; idempotent once set.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private markTxbxBodyModeled(): void {
        this.txbxBodyModeled = true;
    }
    /**
     * Promote to structure dirty (host kind / wrap / distances / behindDoc).
     * Never demotes. Hydrates identity, layout, wrap, and presetGeometry from residual.
     */
    /**
     *  Promote dirty mode to structure; package-visible for GroupShape.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    markStructureDirty(): void {
        if (this.dirtyMode !== 'structure') {
            this.hydrateIdentityAndLayoutFromResidual();
            if (this.encodingValue !== 'vml') {
                const wrap: DrawingWrapState = readDrawingWrapState(this.residual);
                if (this.placementValue === undefined) {
                    this.placementValue = wrap.placement;
                }
                if (this.wrappingValue === undefined) {
                    this.wrappingValue = wrap.wrapping;
                }
                if (!this.distancesModeled) {
                    if (this.distanceTopValue === undefined && wrap.distanceTopEmu !== undefined) {
                        this.distanceTopValue = emuToPoint(wrap.distanceTopEmu);
                    }
                    if (this.distanceBottomValue === undefined && wrap.distanceBottomEmu !== undefined) {
                        this.distanceBottomValue = emuToPoint(wrap.distanceBottomEmu);
                    }
                    if (this.distanceLeftValue === undefined && wrap.distanceLeftEmu !== undefined) {
                        this.distanceLeftValue = emuToPoint(wrap.distanceLeftEmu);
                    }
                    if (this.distanceRightValue === undefined && wrap.distanceRightEmu !== undefined) {
                        this.distanceRightValue = emuToPoint(wrap.distanceRightEmu);
                    }
                }
                if (!this.behindDocumentModeled && this.behindDocumentValue === undefined) {
                    this.behindDocumentValue = wrap.behindDocument;
                }
                if (this.presetGeometryValue === undefined) {
                    this.presetGeometryValue = wrap.presetGeometry;
                }
                // Hydrate position values and anchor booleans from residual so structure
                // encode never invents tokens or silently flips residual option values.
                // Hydration fills missing fields on BOTH axes regardless of the per-axis
                // modeled flags â€” the flags only decide whether an axis is rebuilt from
                // model or preserved verbatim on the wire (host-codec).
                const position: DrawingPositionState = readDrawingPositionState(this.residual);
                if (this.horizontalOriginValue === undefined) {
                    this.horizontalOriginValue = position.horizontalOrigin;
                }
                if (this.horizontalPositionValue === undefined && position.horizontalPositionEmu !== undefined) {
                    this.horizontalPositionValue = emuToPoint(position.horizontalPositionEmu);
                }
                if (this.horizontalAlignmentValue === undefined) {
                    this.horizontalAlignmentValue = position.horizontalAlignment;
                }
                if (this.verticalOriginValue === undefined) {
                    this.verticalOriginValue = position.verticalOrigin;
                }
                if (this.verticalPositionValue === undefined && position.verticalPositionEmu !== undefined) {
                    this.verticalPositionValue = emuToPoint(position.verticalPositionEmu);
                }
                if (this.verticalAlignmentValue === undefined) {
                    this.verticalAlignmentValue = position.verticalAlignment;
                }
                if (this.lockAnchorValue === undefined) {
                    this.lockAnchorValue = wrap.lockAnchor;
                }
                if (this.allowOverlapValue === undefined) {
                    this.allowOverlapValue = wrap.allowOverlap;
                }
                if (this.layoutInCellValue === undefined) {
                    this.layoutInCellValue = wrap.layoutInCell;
                }
            }
            // Always invalidate cached residual spPr reads when structure dirtied â€”
            // including when already structure (geometry/fill/line mutators).
            this.spPrState = undefined;
        }
        // Re-reads of bodyPr residual after a modeled write must reflect the
        // modeled state, not the stale residual â€” only clear the residual-derived
        // cache when bodyPr was not modeled here.
        if (!this.bodyPrModeled) {
            this.bodyPrValue = undefined;
        }
        this.dirtyMode = 'structure';
        this.notifyParentOfChildDirty();
    }
    private hydrateIdentityAndLayoutFromResidual(): void {
        const identity: { name: string; title: string; description: string; docPrId: number; } = this.readResidualIdentity();
        if (this.nameValue === undefined) {
            this.nameValue = identity.name;
        }
        if (this.titleValue === undefined) {
            this.titleValue = identity.title;
        }
        if (this.descriptionValue === undefined) {
            this.descriptionValue = identity.description;
        }
        if (this.docPrIdValue === undefined) {
            this.docPrIdValue = identity.docPrId;
        }
        if (this.encodingValue !== 'vml') {
            const layout: DrawingLayoutState = readDrawingLayout(this.residual);
            if (this.widthValue === undefined && layout.widthEmu !== undefined) {
                this.widthValue = emuToPoint(layout.widthEmu);
            }
            if (this.heightValue === undefined && layout.heightEmu !== undefined) {
                this.heightValue = emuToPoint(layout.heightEmu);
            }
            if (this.rotationValue === undefined) {
                this.rotationValue = layout.rotation;
            }
            if (this.flipHorizontalValue === undefined) {
                this.flipHorizontalValue = layout.flipHorizontal;
            }
            if (this.flipVerticalValue === undefined) {
                this.flipVerticalValue = layout.flipVertical;
            }
            if (this.lockAspectRatioValue === undefined) {
                this.lockAspectRatioValue = layout.lockAspectRatio;
            }
        }
    }
    /**
     * Read identity from nested `wps:cNvPr` / `wpg:cNvPr` when residual is a bare
     * nested shape/group; otherwise from top-level `wp:docPr`.
     *
     * @returns {Object} Returns the result.
     */
    private readResidualIdentity(): {
        name: string | undefined;
        title: string | undefined;
        description: string | undefined;
        docPrId: number | undefined;
    } {
        if (isNestedDrawingResidual(this.residual)) {
            return readCNvPrIdentity(this.residual);
        }
        return readDocPrIdentity(this.residual);
    }
    /**
     * Parse nested `wps:wsp` / `wpg:grpSp` children under residual `wpg:wgp` or
     * `wpc:wpc`. Unknown residual siblings are not modeled as children.
     *
     * @returns {DrawingShape[]} Returns the result.
     */
    private parseNestedChildrenFromResidual(): DrawingShape[] {
        if (this.encodingValue === 'vml') {
            return [];
        }
        const container: OpenXmlElement = findNestedDrawingContainer(this.residual);
        if (container === undefined) {
            return [];
        }
        const children: DrawingShape[] = [];
        for (const childEl of elementChildren(container)) {
            if (!isNestedDrawingResidual(childEl)) {
                continue;
            }
            const child: DrawingShape = createDrawingShape('drawingml', childEl);
            child.parentGroup = this;
            children.push(child);
        }
        return children;
    }
    /**
     * Materialize residual or cached children into {@link childrenValue} so nested
     * authoring can push without dropping lazy residual siblings.
     *
     * @returns {void} Nothing.
     */
    protected ensureChildrenModeled(): void {
        if (this.childrenModeled) {
            return;
        }
        const existing: DrawingShape[] = this.childrenCache !== undefined
            ? this.childrenCache
            : this.parseNestedChildrenFromResidual();
        this.childrenValue = [...existing];
        for (const child of this.childrenValue) {
            child.parentGroup = this;
        }
        this.childrenModeled = true;
        this.childrenCache = undefined;
    }
    /**
     * Allocate a package-unique cNvPr/docPr id for a nested child using the
     * top-level host's anchoring paragraph when available.
     *
     * @returns {number} Returns the result.
     */
    private allocateNestedDocPrId(): number {
        const paragraph: Paragraph =
            this.anchoringParagraph != null
                ? this.anchoringParagraph
                : this.parentGroup == null
                    ? undefined
                    : this.parentGroup.anchoringParagraph;
        if (paragraph !== undefined) {
            return allocateDocPrId(paragraph);
        }
        // Detached authoring path: walk already-modeled descendants only.
        let max: number = this.docPrIdValue != null ? this.docPrIdValue : 0;
        for (const child of this.children()) {
            const id: number = child.docPrIdValue;
            if (id !== undefined && id > max) {
                max = id;
            }
        }
        return max + 1;
    }
    /**
     *  True when any nested child (direct) is not clean.
     *
     * @returns {boolean} Returns the result.
     */
    private hasDirtyNestedChildren(): boolean {
        if (this.encodingValue === 'vml') {
            return false;
        }
        // Avoid infinite recursion via children() cache population while still
        // detecting dirt on already-modeled children without forcing parse.
        const kids: DrawingShape[] = this.childrenModeled
            ? this.childrenValue
            : this.childrenCache !== undefined
                ? this.childrenCache
                : undefined;
        if (kids === undefined) {
            return false;
        }
        for (const child of kids) {
            if (child.dirtyMode !== 'clean' || child.hasDirtyNestedChildren()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Clone residual host and replace nested wsp/grpSp under wgp/wpc with each
     * child's {@link toOpenXml}, preserving grpSpPr and unknown residual siblings.
     *
     * @param {OpenXmlElement} host - Specifies the host.
     * @returns {OpenXmlElement} Returns the result.
     */
    private rewriteResidualNestedChildren(host: OpenXmlElement): OpenXmlElement {
        this.ensureChildrenModeled();
        const container: OpenXmlElement = findNestedDrawingContainer(host);
        if (container === undefined) {
            return host;
        }
        const modeled: DrawingShape[] = this.childrenValue;
        let modelIndex: number = 0;
        const nextChildren: OpenXmlChild[] = [];
        for (const node of container.children) {
            if (node.kind !== 'element' || !isNestedDrawingResidual(node)) {
                nextChildren.push(node);
                continue;
            }
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const child: DrawingShape = modeled[modelIndex];
            if (child !== undefined) {
                nextChildren.push(child.toOpenXml());
                modelIndex += 1;
            }
            // Extra residual nested shapes beyond modeled list are dropped only when
            // the model intentionally no longer contains them (structure author path
            // rebuilds entirely). Preserve-by-model-order for dirty-child rewrite.
        }
        // Append any additional modeled children not matched to residual slots.
        while (modelIndex < modeled.length) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const child: DrawingShape = modeled[modelIndex];
            if (child === undefined) {
                break;
            }
            nextChildren.push(child.toOpenXml());
            modelIndex += 1;
        }
        (container as {
            children: ReadonlyArray<OpenXmlChild>;
        }).children = nextChildren;
        return host;
    }
    /**
     * Nested child dirt must surface on save even when the parent residual stays
     * clean â€” notify by ensuring children are modeled (so hasDirtyNestedChildren
     * can see them). Parent dirtyMode is left alone; toOpenXml rewrites kids.
     *
     * @returns {void} Nothing.
     */
    protected notifyParentOfChildDirty(): void {
        const parent: DrawingShape = this.parentGroup;
        if (parent === undefined) {
            return;
        }
        parent.ensureChildrenModeled();
    }
    private readDistancePoints(side: 'top' | 'bottom' | 'left' | 'right'): number {
        const modeled: number = side === 'top'
            ? this.distanceTopValue
            : side === 'bottom'
                ? this.distanceBottomValue
                : side === 'left'
                    ? this.distanceLeftValue
                    : this.distanceRightValue;
        if (modeled !== undefined) {
            return modeled;
        }
        if (this.encodingValue === 'vml') {
            return 0;
        }
        const wrap: DrawingWrapState = readDrawingWrapState(this.residual);
        const residual: Emus = side === 'top'
            ? wrap.distanceTopEmu
            : side === 'bottom'
                ? wrap.distanceBottomEmu
                : side === 'left'
                    ? wrap.distanceLeftEmu
                    : wrap.distanceRightEmu;
        if (residual !== undefined) {
            return emuToPoint(residual);
        }
        const placement: DrawingPlacement = this.placement();
        if ((side === 'left' || side === 'right') && placement === 'anchor') {
            return emuToPoint(ANCHOR_DEFAULT_SIDE_DIST_EMU);
        }
        return 0;
    }

    /**
     * Create an independent copy of this drawing shape.
     *
     * All properties are cloned independently:
     * - Geometry, fill, and line properties
     * - Position, size, rotation, and flip state
     * - Wrapping and distance properties
     * - Text box body content (if present) with all nested items
     *
     * The cloned shape is detached and ready for attachment or import.
     *
     * @returns {DrawingShape} Cloned drawing shape.
     * @public
     */
    clone(): DrawingShape {
        // Re-parse the shape's own wire form: it carries the geometry, fill, line, wrap and
        // text-box body (and group children), so every nested element is rebuilt independently.
        type ShapeCtor = new (encoding: DrawingEncoding, element: OpenXmlElement) => DrawingShape;
        const Ctor: ShapeCtor = this.constructor as ShapeCtor;
        const cloned: DrawingShape = new Ctor(this.encodingValue, cloneResidualElement(this.toOpenXml()));
        // Two shapes with the same id in one document corrupt the file: drop the id so a new
        // one is assigned when the clone is attached.
        cloned.docPrIdValue = undefined;
        return cloned;
    }
}
/**
 * Leaf DrawingML / VML shape (preset geometry, fill/line, optional text box).
 *
 * Inherits identity, placement, size, wrap, and position format from
 * {@link DrawingShape}. Text-box body content uses {@link Shape.items}.
 * Group hosts use {@link GroupShape}.
 *
 * @public
 */
export class Shape extends DrawingShape {
    /**
     * Gets the entity type of the item, either {@link EntityType.Shape} or {@link EntityType.GroupShape}.
     *
     * @public
     */
    readonly type: EntityType.Shape | EntityType.GroupShape = EntityType.Shape;
    /**
     * @private
     */
    constructor(encoding: DrawingEncoding, element: OpenXmlElement);
    /**
     * @private
     */
    constructor(init: DrawingShapeInit);
    /**
     * @param {DrawingEncoding | DrawingShapeInit} encodingOrInit - The encoding or init.
     * @param {OpenXmlElement} element - The element.
     * @private
     */
    constructor(encodingOrInit: DrawingEncoding | DrawingShapeInit, element?: OpenXmlElement) {
        // Base constructor validates `element` for the string-encoding overload
        // (throws when undefined); super() must remain the first statement here
        // because this class has initialized properties (TS2376).
        super(encodingOrInit as DrawingEncoding, element as OpenXmlElement);
    }
    /**
     * Gets the collection of body items, such as paragraphs and tables, in the text box of the shape.
     *
     * @throws DocxError `content/invalid-shape` when the shape is not a text box.
     * @public
     */
    get items(): ReadonlyArray<BodyItem> {
        return this.blocks;
    }
    /**
     * Inserts a body item at `index` in {@link Shape.items}
     * (`0â€¦length` inclusive â€” insert-before / append).
     *
     * Attaches paragraphs and binds feature blocks to the owning document.
     * Returns the same `item` reference for chaining.
     *
     * @returns {BodyItem} - Returns the inserted {@link BodyItem}.
     * @param {number} index - Specifies the index.
     * @param {BodyItem} item - Specifies the item.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError `content/invalid-shape` when the shape is not a text box.
     *
     * @public
     */
    insertBodyItemAt(index: number, item: BodyItem): BodyItem {
        return super.insertBodyItemAt(index, item);
    }
    /**
     * Removes the body item at `index` in {@link Shape.items}
     * (`0â€¦length-1`). Paragraphs detach; feature blocks may release content.
     *
     * @returns {void}
     * @param {number} index - Specifies the index.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError `content/invalid-shape` when the shape is not a text box.
     *
     * @public
     */
    removeBodyItemAt(index: number): void {
        super.removeBodyItemAt(index);
    }
    /**
     * Removes a body item from {@link Shape.items}.
     *
     * Matches by collection entry identity first, then by payload identity
     * (same {@link Paragraph}, feature value, or opaque XML node).
     *
     * @returns {void}
     * @param {BodyItem} item - Specifies the item.
     * @throws DetachedObjectError if `item` is not in this text box.
     * @throws DocxError `content/invalid-shape` when the shape is not a text box.
     *
     * @public
     */
    removeBodyItem(item: BodyItem): void {
        super.removeBodyItem(item);
    }

    /**
     * Create an independent copy of this shape.
     *
     * All properties (geometry, fill, line, position, size, text box content) are cloned independently.
     * The cloned shape is detached and ready for attachment or import.
     *
     * For text-box shapes, nested body items (paragraphs, tables, content controls) are recursively cloned.
     *
     * @returns {Shape} Cloned shape.
     * @public
     */
    clone(): Shape {
        // Delegate to parent DrawingShape.clone() which handles all properties
        // Full implementation deferred to Phase B for fill/line/geometry cloning
        const cloned: DrawingShape = super.clone();
        return cloned as Shape;
    }
}
/**
 * DrawingML group or canvas host with nested {@link Shape} / {@link GroupShape}
 * children.
 *
 * Inherits identity, placement, size, wrap, and position format from
 * {@link DrawingShape}. Nested children are exposed as {@link childShapes};
 * author nested leaves with {@link appendShape}.
 *
 *
 * @private
 */
export class GroupShape extends Shape {
    /**
     * Public discriminant for {@link Paragraph.items} ({@link EntityType.GroupShape}).
     *
     * @public
     */
    readonly type: EntityType.GroupShape = EntityType.GroupShape;
    /**
     * @private
     */
    constructor(encoding: DrawingEncoding, element: OpenXmlElement);
    /**
     * @private
     */
    constructor(init: DrawingShapeInit);
    /**
     * @param {DrawingEncoding | DrawingShapeInit} encodingOrInit - The encoding or init.
     * @param {OpenXmlElement} element - The element.
     * @private
     */
    constructor(encodingOrInit: DrawingEncoding | DrawingShapeInit, element?: OpenXmlElement) {
        // Base constructor validates `element` for the string-encoding overload
        // (throws when undefined); super() must remain the first statement here
        // because this class has initialized properties (TS2376).
        super(encodingOrInit as DrawingEncoding, element as OpenXmlElement);
    }
    /**
     * Nested DrawingML children under this group or canvas, in document order.
     *
     * @public
     */
    get childShapes(): ReadonlyArray<DrawingShape> {
        return this.children();
    }
    /**
     * Nested child items (collection surface).
     *
     * @public
     */
    get childItems(): ReadonlyArray<DrawingShape> {
        return this.children();
    }
    /**
     * Nested DrawingML children under this group or canvas.
     *
     * @returns {ReadonlyArray<DrawingShape>} The result.
     * @private
     */
    children(): ReadonlyArray<DrawingShape> {
        return super.children();
    }
    /**
     * Add an existing drawing leaf as a nested child. Detaches from anchoring paragraph when needed.
     *
     * @param {DrawingShape|Object} paragraphItem - Specifies the paragraph item.
     * @returns {void} Nothing.
     * @public
     */
    add(paragraphItem: DrawingShape | { readonly type?: string; readonly value?: unknown }): void {
        let child: DrawingShape | undefined;
        if (paragraphItem instanceof DrawingShape) {
            child = paragraphItem;
        } else if (paragraphItem instanceof FeatureRunParagraphItem &&
            paragraphItem.value instanceof DrawingShape) {
            child = paragraphItem.value;
        }
        if (child === undefined) {
            throw new DocxError('content/invalid-shape', 'GroupShape.add requires a drawing shape paragraph item');
        }
        if (child === this) {
            throw new DocxError('content/invalid-shape', 'GroupShape cannot add itself');
        }
        const para: Paragraph = child.getAnchoringParagraph();
        if (para !== undefined) {
            const items: ParagraphItem[] = para.items.toArray();
            for (let i: number = items.length - 1; i >= 0; i -= 1) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const it: ParagraphItem = items[i]!;
                if (it instanceof FeatureRunParagraphItem && it.value === child) {
                    para.removeFeatureRunItem(child);
                    break;
                }
            }
        }
        child.parentGroup = this;
        this.ensureChildrenModeled();
        this.childrenValue.push(child);
        this.childrenModeled = true;
        this.childrenCache = undefined;
        this.markStructureDirty();
        this.notifyParentOfChildDirty();
    }
    /**
     * Ungroup children into an array of drawing leaves.
     *
     * @returns {ReadonlyArray<DrawingShape>} Returns the result.
     * @public
     */
    unGroup(): ReadonlyArray<DrawingShape> {
        const kids: DrawingShape[] = [...this.children()];
        this.ensureChildrenModeled();
        for (const child of kids) {
            child.parentGroup = undefined;
        }
        this.childrenValue = [];
        this.childrenModeled = true;
        this.childrenCache = undefined;
        this.markStructureDirty();
        return kids;
    }
    /**
     * Append a nested preset-geometry {@link Shape} under this group.
     *
     * @param {AutoShapeType} autoShapeType - Specifies the auto shape type.
     * @param {number} width - Specifies the width.
     * @param {number} height - Specifies the height.
     * @returns {Shape} Returns the result.
     * @public
     */
    appendShape(autoShapeType: AutoShapeType, width: number, height: number): Shape {
        return super.appendShape(autoShapeType, width, height);
    }
    /**
     *  @private
     *
     * @param {ShapeFill | undefined} _value - The  value.
     * @returns {void} Nothing is returned.
     */
    writeShapeFillState(_value: ShapeFill | undefined): void {
        throw new DocxError('content/invalid-shape', 'Fill is not supported on GroupShape');
    }
    /**
     *  @private
     *
     * @param {ShapeLine | undefined} _value - The  value.
     * @returns {void} Nothing is returned.
     */
    writeShapeLineState(_value: ShapeLine | undefined): void {
        throw new DocxError('content/invalid-shape', 'Line is not supported on GroupShape');
    }
    /**
     *  @private
     *
     * @param {TextDirection | undefined} _value - The  value.
     * @returns {void} Nothing is returned.
     */
    writeTextFrameDirection(_value: TextDirection | undefined): void {
        throw new DocxError('content/invalid-shape', 'Text frame is not supported on GroupShape');
    }
    /**
     *  @private
     *
     * @param {TextVerticalAlignment | undefined} _value - The  value.
     * @returns {void} Nothing is returned.
     */
    writeTextFrameVerticalAlignment(_value: TextVerticalAlignment | undefined): void {
        throw new DocxError('content/invalid-shape', 'Text frame is not supported on GroupShape');
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    ensureTextBodyAccessible(): void {
        throw new DocxError('content/invalid-shape', 'Text body is not supported on GroupShape');
    }
}

/**
 * Construct {@link Shape} or {@link GroupShape} from a residual host element.
 * Nested `wps:wsp` / `wpg:grpSp` residuals and top-level dual-AC trees are
 * classified by residual localName / Choice URI.
 *
 * @param {DrawingEncoding} encoding - The encoding.
 * @param {OpenXmlElement} element - The element.
 * @returns {DrawingShape} The result.
 * @private
 */
export function createDrawingShape(encoding: DrawingEncoding, element: OpenXmlElement): DrawingShape {
    let ts331: any;
    if (encoding === 'vml') {
        return new Shape(encoding, element);
    }
    if (isNestedDrawingResidual(element)) {
        if (element.localName === 'grpSp') {
            return new GroupShape(encoding, element);
        }
        return new Shape(encoding, element);
    }
    const drawing: OpenXmlElement = ((ts331 = preferredDrawingElement(element)), ts331 != null ? ts331 : (isWml(element, 'drawing') ? element : undefined));
    if (drawing !== undefined) {
        const fromUri: string = detectDmlVariant(drawing);
        if (fromUri === 'group' || fromUri === 'canvas') {
            return new GroupShape(encoding, element);
        }
    }
    // Unknown / picture-declined / bare fragments still surface as Shape leaves so
    // residual pass-through and identity APIs remain available.
    return new Shape(encoding, element);
}
/**
 * Construct {@link Shape} or {@link GroupShape} from an authored / modeled init.
 * Modeled `children` (including `[]`) always yields {@link GroupShape}.
 *
 * @param {DrawingShapeInit} init - The init.
 * @returns {DrawingShape} The result.
 * @private
 */
export function createDrawingShapeFromInit(init: DrawingShapeInit): DrawingShape {
    let ts332: any;
    if (init.children !== undefined) {
        return new GroupShape(init);
    }
    if (init.encoding === 'vml') {
        return new Shape(init);
    }
    if (isNestedDrawingResidual(init.residual)) {
        if (init.residual.localName === 'grpSp') {
            return new GroupShape(init);
        }
        return new Shape(init);
    }
    const drawing: OpenXmlElement = ((ts332 = preferredDrawingElement(init.residual)), ts332 != null ? ts332 : (isWml(init.residual, 'drawing') ? init.residual : undefined));
    if (drawing !== undefined) {
        const fromUri: string = detectDmlVariant(drawing);
        if (fromUri === 'group' || fromUri === 'canvas') {
            return new GroupShape(init);
        }
    }
    return new Shape(init);
}
/**
 * Type guard for leaf {@link Shape} instances (not group/canvas hosts).
 *
 * @param {DrawingShape} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isShape(value: DrawingShape): value is Shape {
    return value instanceof Shape;
}
/**
 * Type guard for {@link GroupShape} group/canvas hosts.
 *
 * @param {DrawingShape} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isGroupShape(value: DrawingShape): value is GroupShape {
    return value instanceof GroupShape;
}
