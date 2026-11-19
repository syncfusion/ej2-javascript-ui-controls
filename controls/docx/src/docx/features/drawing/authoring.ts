/**
 * Drawing authoring APIs (`appendShape` / `appendGroup`).
 *
 * @private
 */
import { Emus, pointToEmus, pointToCoordinateEmus, emuToPoint } from '../document/length';
import { Paragraph } from '../document/paragraph';
import { DocxError } from '../../core/errors/docx-error';
import { assertEnumMember, HORIZONTAL_ALIGNMENT_SET, HORIZONTAL_ORIGIN_SET, TEXT_WRAPPING_STYLE_SET, TextWrappingStyle, VERTICAL_ALIGNMENT_SET, VERTICAL_ORIGIN_SET, HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, TextWrappingStyle as TextWrappingStyleType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from '../images/layout-types';
import { encodeAuthoredDrawingShape, encodeAuthoredGroup, DrawingHostPlacement } from './host-codec';
import { isPresetAutoShapeType, AutoShapeType } from './shape-types';
import { ANCHOR_DEFAULT_SIDE_DIST_EMU, DRAWING, GroupOptions } from './types';
import { GroupShape, Shape } from './drawing-shape';
import { drawingShapeInit, encodeDrawingShapeInput, encodeGroupInput, modeledFillForEncode, modeledLineForEncode } from './encode-builders';
import { defaultAuthoredShapeFill } from './fill-format';
import { defaultAuthoredShapeLine } from './line-format';
import { allocateDocPrId } from './parse-register';
import { ShapeLine } from './sp-pr';
import { OpenXmlElement } from '../../core/xml/model';

const ANCHOR_DEFAULT_SIDE_DIST_POINTS: number = emuToPoint(ANCHOR_DEFAULT_SIDE_DIST_EMU);

/**
 * Append a preset-geometry drawing shape as a dual MC run leaf (Policy B).
 *
 * Defaults follow Shape.md section 2 (anchor, wrap none, side distances =
 * package anchor default, default solid fill White, default solid black 1 pt
 * outline, no modeled text box until text body is accessed).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {AutoShapeType} autoShapeType - The auto shape type.
 * @param {number} width - The width.
 * @param {number} height - The height.
 * @returns {Shape} The result.
 * @throws DocxError `content/invalid-shape` when geometry or size is invalid.
 *
 * @private
 */
export function appendShapeToParagraph(
    paragraph: Paragraph,
    autoShapeType: AutoShapeType,
    width: number,
    height: number
): Shape {
    if (!isPresetAutoShapeType(autoShapeType)) {
        throw new DocxError(
            'content/invalid-shape',
            `Invalid autoShapeType "${String(autoShapeType)}"; expected a preset AutoShapeType token`
        );
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

    const placement: DrawingHostPlacement = 'anchor';
    const wrapping: TextWrappingStyleType = TextWrappingStyle.None;
    const docPrId: number = allocateDocPrId(paragraph);
    const name: string = 'Shape';
    const rotation: number = 0;
    const lockAspectRatio: boolean = true;
    const flipHorizontal: boolean = false;
    const flipVertical: boolean = false;
    const distanceTop: number = 0;
    const distanceBottom: number = 0;
    const distanceLeft: number = ANCHOR_DEFAULT_SIDE_DIST_POINTS;
    const distanceRight: number = ANCHOR_DEFAULT_SIDE_DIST_POINTS;
    const behindDocument: boolean = false;
    const lockAnchor: boolean = false;
    const allowOverlap: boolean = true;
    const layoutInCell: boolean = true;

    const defaultFill: { readonly kind: 'solid'; readonly srgb: string; } = defaultAuthoredShapeFill();
    const defaultLine: ShapeLine = defaultAuthoredShapeLine();
    const encodeFill: ReturnType<typeof modeledFillForEncode> = modeledFillForEncode(defaultFill);
    const encodeLine: ReturnType<typeof modeledLineForEncode> = modeledLineForEncode(defaultLine);

    const residual: OpenXmlElement = encodeAuthoredDrawingShape(encodeDrawingShapeInput({
        placement,
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
        wrapping,
        distanceTopEmu: pointToCoordinateEmus(distanceTop),
        distanceBottomEmu: pointToCoordinateEmus(distanceBottom),
        distanceLeftEmu: ANCHOR_DEFAULT_SIDE_DIST_EMU,
        distanceRightEmu: ANCHOR_DEFAULT_SIDE_DIST_EMU,
        behindDocument,
        lockAnchor,
        allowOverlap,
        layoutInCell,
        layoutDirty: true,
        txbxContent: undefined,
        bodyPr: undefined,
        fill: encodeFill,
        line: encodeLine
    }));

    const shape: Shape = new Shape(drawingShapeInit({
        encoding: 'drawingml',
        residual,
        dirty: 'structure',
        name,
        title: undefined,
        description: undefined,
        docPrId,
        placement,
        width,
        height,
        presetGeometry: autoShapeType,
        rotation,
        lockAspectRatio,
        flipHorizontal,
        flipVertical,
        wrapping,
        distanceTop,
        distanceBottom,
        distanceLeft,
        distanceRight,
        behindDocument,
        lockAnchor,
        allowOverlap,
        layoutInCell,
        txbxContent: undefined,
        bodyPrElement: undefined,
        fill: defaultFill,
        line: defaultLine
    }));
    paragraph.appendFeatureRunItem(DRAWING, shape);
    shape.bindAnchoringParagraph(paragraph);
    return shape;
}

/**
 * Append an empty wordprocessing group as dual MC run leaf (Choice `wpg` +
 * Fallback VML). Nested children are authored via {@link GroupShape.appendShape}
 * on the returned group. Default placement is `wp:anchor`.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {GroupOptions} options - The options.
 * @returns {GroupShape} The result.
 * @throws DocxError `content/invalid-shape` when size is invalid.
 * @throws RangeError when wrap/position enums are not known schema tokens.
 *
 * @private
 */
export function appendGroupToParagraph(paragraph: Paragraph, options: GroupOptions): GroupShape {
    let widthEmu: Emus;
    let heightEmu: Emus;
    try {
        widthEmu = pointToEmus(options.width);
        heightEmu = pointToEmus(options.height);
    }
    catch (error) {
        if (error instanceof RangeError) {
            throw new DocxError('content/invalid-shape', 'Group width and height must be positive point values', { cause: error });
        }
        throw error;
    }
    if (!(widthEmu > 0) || !(heightEmu > 0)) {
        throw new DocxError('content/invalid-shape', 'Group width and height must be positive point values');
    }
    const placementRaw: string = options.placement != null ? options.placement : 'anchor';
    if (placementRaw !== 'inline' && placementRaw !== 'anchor') {
        throw new DocxError('content/invalid-shape', `Invalid placement "${placementRaw}"; expected 'inline' or 'anchor'`);
    }
    let placement: DrawingHostPlacement = placementRaw;
    let wrapping: TextWrappingStyleType | undefined = options.wrappingStyle;
    if (wrapping !== undefined) {
        assertEnumMember('wrappingStyle', wrapping, TEXT_WRAPPING_STYLE_SET);
        placement = wrapping === TextWrappingStyle.Inline ? 'inline' : 'anchor';
    }
    else {
        wrapping = placement === 'inline' ? TextWrappingStyle.Inline : TextWrappingStyle.None;
    }
    const docPrId: number = allocateDocPrId(paragraph);
    const name: string = options.name != null ? options.name : 'Group';
    const rotation: number = options.rotation != null ? options.rotation : 0;
    if (!Number.isFinite(rotation)) {
        throw new DocxError('content/invalid-shape', 'Group rotation must be a finite number of degrees');
    }
    const lockAspectRatio: boolean = options.lockAspectRatio != null ? options.lockAspectRatio : true;
    const flipHorizontal: boolean = options.flipHorizontal != null ? options.flipHorizontal : false;
    const flipVertical: boolean = options.flipVertical != null ? options.flipVertical : false;
    const distanceTopEmu: Emus = options.distanceTop !== undefined ? pointToCoordinateEmus(options.distanceTop) : undefined;
    const distanceBottomEmu: Emus = options.distanceBottom !== undefined ? pointToCoordinateEmus(options.distanceBottom) : undefined;
    const distanceLeftEmu: Emus = options.distanceLeft !== undefined ? pointToCoordinateEmus(options.distanceLeft) : undefined;
    const distanceRightEmu: Emus = options.distanceRight !== undefined ? pointToCoordinateEmus(options.distanceRight) : undefined;
    const behindDocument: boolean = options.behindDocument;
    const horizontalOrigin: HorizontalOriginType = options.horizontalOrigin;
    const verticalOrigin: VerticalOriginType = options.verticalOrigin;
    const horizontalPositionEmu: Emus =
        options.horizontalPosition !== undefined ? pointToCoordinateEmus(options.horizontalPosition) : undefined;
    const verticalPositionEmu: Emus = options.verticalPosition !== undefined ? pointToCoordinateEmus(options.verticalPosition) : undefined;
    const horizontalAlignment: HorizontalAlignmentType = options.horizontalAlignment;
    const verticalAlignment: VerticalAlignmentType = options.verticalAlignment;
    if (horizontalAlignment !== undefined) {
        assertEnumMember('horizontalAlignment', horizontalAlignment, HORIZONTAL_ALIGNMENT_SET);
    }
    if (verticalAlignment !== undefined) {
        assertEnumMember('verticalAlignment', verticalAlignment, VERTICAL_ALIGNMENT_SET);
    }
    if (horizontalOrigin !== undefined) {
        assertEnumMember('horizontalOrigin', horizontalOrigin, HORIZONTAL_ORIGIN_SET);
    }
    if (verticalOrigin !== undefined) {
        assertEnumMember('verticalOrigin', verticalOrigin, VERTICAL_ORIGIN_SET);
    }
    const horizontalAlignmentFinal: HorizontalAlignmentType = options.horizontalPosition !== undefined ? undefined : horizontalAlignment;
    const verticalAlignmentFinal: VerticalAlignmentType = options.verticalPosition !== undefined ? undefined : verticalAlignment;
    const lockAnchor: boolean = options.lockAnchor;
    const allowOverlap: boolean = options.allowOverlap;
    const layoutInCell: boolean = options.layoutInCell;
    const residual: OpenXmlElement = encodeAuthoredGroup(encodeGroupInput({
        placement,
        widthEmu,
        heightEmu,
        docPrId,
        name,
        title: options.title,
        description: options.description,
        rotation,
        flipHorizontal,
        flipVertical,
        lockAspectRatio,
        wrapping,
        distanceTopEmu,
        distanceBottomEmu,
        distanceLeftEmu,
        distanceRightEmu,
        behindDocument,
        horizontalOrigin,
        verticalOrigin,
        horizontalPositionEmu,
        verticalPositionEmu,
        horizontalAlignment: horizontalAlignmentFinal,
        verticalAlignment: verticalAlignmentFinal,
        lockAnchor,
        allowOverlap,
        layoutInCell,
        layoutDirty: true,
        children: []
    }));
    const shape: GroupShape = new GroupShape(drawingShapeInit({
        encoding: 'drawingml',
        residual,
        dirty: 'structure',
        name,
        title: options.title,
        description: options.description,
        docPrId,
        placement,
        width: options.width,
        height: options.height,
        rotation,
        lockAspectRatio,
        flipHorizontal,
        flipVertical,
        wrapping,
        distanceTop: options.distanceTop,
        distanceBottom: options.distanceBottom,
        distanceLeft: options.distanceLeft,
        distanceRight: options.distanceRight,
        behindDocument,
        horizontalOrigin,
        verticalOrigin,
        horizontalPosition: options.horizontalPosition,
        verticalPosition: options.verticalPosition,
        horizontalAlignment: horizontalAlignmentFinal,
        verticalAlignment: verticalAlignmentFinal,
        lockAnchor,
        allowOverlap,
        layoutInCell,
        children: []
    }));
    paragraph.appendFeatureRunItem(DRAWING, shape);
    shape.bindAnchoringParagraph(paragraph);
    return shape;
}
