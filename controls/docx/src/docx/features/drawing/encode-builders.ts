/**
 * Author encode input builders for dual-AC DrawingML hosts.
 *
 * @private
 */
import { TextWrappingType } from '../images/layout-types';
import { Emus } from '../document/length';
import { OpenXmlElement } from '../../core/xml/index';
import { TextWrappingStyle, HorizontalAlignment as HorizontalAlignmentType, HorizontalOrigin as HorizontalOriginType, TextWrappingStyle as TextWrappingStyleType, VerticalAlignment as VerticalAlignmentType, VerticalOrigin as VerticalOriginType } from '../images/layout-types';
import { DrawingHostPlacement, EncodeGroupInput, encodeAuthoredDrawingShape } from './host-codec';
import { LineCap, LineEndSize, LineEndType, LineDashing, ShapeFill, ShapeLine } from './sp-pr';
import { ANCHOR_DEFAULT_SIDE_DIST_EMU, DrawingEncoding, DrawingPlacement } from './types';
import { DrawingShape, DirtyMode, DrawingShapeInit } from './drawing-shape';

/** Encode-input fill slice (author solid/none only). */
type EncodeDrawingShapeFill = {
    readonly kind: 'solid';
    readonly srgb: string;
    readonly alpha?: number | undefined;
} | {
    readonly kind: 'none';
};

/** Encode-input line slice (author solid/none only; matches host-codec). */
type EncodeDrawingShapeLine = {
    readonly kind: 'solid';
    readonly widthEmu?: Emus | undefined;
    readonly srgb: string;
    readonly dash?: LineDashing | undefined;
    readonly cap?: LineCap | undefined;
    readonly beginArrowType?: LineEndType | undefined;
    readonly beginArrowSize?: LineEndSize | undefined;
    readonly endArrowType?: LineEndType | undefined;
    readonly endArrowSize?: LineEndSize | undefined;
} | {
    readonly kind: 'none';
    readonly widthEmu?: Emus | undefined;
    readonly cap?: LineCap | undefined;
};

/**
 * Build encode input without writing `undefined` into optional fields
 * (`exactOptionalPropertyTypes`).
 *
 * TS 3.3: nested conditional object spreads explode the checker (OOM). Assign
 * optional keys only when defined — same exactOptionalPropertyTypes semantics.
 *
 * @param {Object} parts - The parts.
 * @returns {*} The result.
 * @private
 */
export function encodeDrawingShapeInput(parts: {
    readonly placement: DrawingHostPlacement;
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly presetGeometry: string;
    readonly docPrId: number;
    readonly name: string;
    readonly title?: string | undefined;
    readonly description?: string | undefined;
    readonly rotation?: number | undefined;
    readonly flipHorizontal?: boolean | undefined;
    readonly flipVertical?: boolean | undefined;
    readonly lockAspectRatio?: boolean | undefined;
    readonly wrapping?: TextWrappingStyleType | undefined;
    readonly wrapType?: TextWrappingType | undefined;
    readonly distanceTopEmu?: Emus | undefined;
    readonly distanceBottomEmu?: Emus | undefined;
    readonly distanceLeftEmu?: Emus | undefined;
    readonly distanceRightEmu?: Emus | undefined;
    readonly behindDocument?: boolean | undefined;
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    readonly verticalOrigin?: VerticalOriginType | undefined;
    readonly horizontalPositionEmu?: Emus | undefined;
    readonly verticalPositionEmu?: Emus | undefined;
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
    readonly verticalAlignment?: VerticalAlignmentType | undefined;
    readonly lockAnchor?: boolean | undefined;
    readonly allowOverlap?: boolean | undefined;
    readonly layoutInCell?: boolean | undefined;
    readonly horizontalModeled?: boolean | undefined;
    readonly verticalModeled?: boolean | undefined;
    readonly preservedHost?: OpenXmlElement | undefined;
    readonly layoutDirty?: boolean | undefined;
    readonly txbxContent?: ReadonlyArray<OpenXmlElement> | undefined;
    readonly bodyPr?: OpenXmlElement | undefined;
    readonly fill?: EncodeDrawingShapeFill | undefined;
    readonly line?: EncodeDrawingShapeLine | undefined;
}): Parameters<typeof encodeAuthoredDrawingShape>[0] {
    // title/description are required keys on EncodeDrawingShapeInput (may be undefined).
    const out: {
        placement: DrawingHostPlacement;
        widthEmu: Emus;
        heightEmu: Emus;
        presetGeometry: string;
        docPrId: number;
        name: string;
        title: string | undefined;
        description: string | undefined;
        rotation?: number;
        flipHorizontal?: boolean;
        flipVertical?: boolean;
        lockAspectRatio?: boolean;
        wrapping?: TextWrappingStyleType;
        wrapType?: TextWrappingType;
        distanceTopEmu?: Emus;
        distanceBottomEmu?: Emus;
        distanceLeftEmu?: Emus;
        distanceRightEmu?: Emus;
        behindDocument?: boolean;
        horizontalOrigin?: HorizontalOriginType;
        verticalOrigin?: VerticalOriginType;
        horizontalPositionEmu?: Emus;
        verticalPositionEmu?: Emus;
        horizontalAlignment?: HorizontalAlignmentType;
        verticalAlignment?: VerticalAlignmentType;
        lockAnchor?: boolean;
        allowOverlap?: boolean;
        layoutInCell?: boolean;
        horizontalModeled?: boolean;
        verticalModeled?: boolean;
        preservedHost?: OpenXmlElement;
        layoutDirty?: boolean;
        txbxContent?: ReadonlyArray<OpenXmlElement>;
        bodyPr?: OpenXmlElement;
        fill?: EncodeDrawingShapeFill;
        line?: EncodeDrawingShapeLine;
    } = {
        placement: parts.placement,
        widthEmu: parts.widthEmu,
        heightEmu: parts.heightEmu,
        presetGeometry: parts.presetGeometry,
        docPrId: parts.docPrId,
        name: parts.name,
        title: parts.title,
        description: parts.description
    };
    if (parts.rotation !== undefined) {
        out.rotation = parts.rotation;
    }
    if (parts.flipHorizontal !== undefined) {
        out.flipHorizontal = parts.flipHorizontal;
    }
    if (parts.flipVertical !== undefined) {
        out.flipVertical = parts.flipVertical;
    }
    if (parts.lockAspectRatio !== undefined) {
        out.lockAspectRatio = parts.lockAspectRatio;
    }
    if (parts.wrapping !== undefined) {
        out.wrapping = parts.wrapping;
    }
    if (parts.wrapType !== undefined) {
        out.wrapType = parts.wrapType;
    }
    if (parts.distanceTopEmu !== undefined) {
        out.distanceTopEmu = parts.distanceTopEmu;
    }
    if (parts.distanceBottomEmu !== undefined) {
        out.distanceBottomEmu = parts.distanceBottomEmu;
    }
    if (parts.distanceLeftEmu !== undefined) {
        out.distanceLeftEmu = parts.distanceLeftEmu;
    }
    if (parts.distanceRightEmu !== undefined) {
        out.distanceRightEmu = parts.distanceRightEmu;
    }
    if (parts.behindDocument !== undefined) {
        out.behindDocument = parts.behindDocument;
    }
    if (parts.horizontalOrigin !== undefined) {
        out.horizontalOrigin = parts.horizontalOrigin;
    }
    if (parts.verticalOrigin !== undefined) {
        out.verticalOrigin = parts.verticalOrigin;
    }
    if (parts.horizontalPositionEmu !== undefined) {
        out.horizontalPositionEmu = parts.horizontalPositionEmu;
    }
    if (parts.verticalPositionEmu !== undefined) {
        out.verticalPositionEmu = parts.verticalPositionEmu;
    }
    if (parts.horizontalAlignment !== undefined) {
        out.horizontalAlignment = parts.horizontalAlignment;
    }
    if (parts.verticalAlignment !== undefined) {
        out.verticalAlignment = parts.verticalAlignment;
    }
    if (parts.lockAnchor !== undefined) {
        out.lockAnchor = parts.lockAnchor;
    }
    if (parts.horizontalModeled !== undefined) {
        out.horizontalModeled = parts.horizontalModeled;
    }
    if (parts.verticalModeled !== undefined) {
        out.verticalModeled = parts.verticalModeled;
    }
    if (parts.allowOverlap !== undefined) {
        out.allowOverlap = parts.allowOverlap;
    }
    if (parts.layoutInCell !== undefined) {
        out.layoutInCell = parts.layoutInCell;
    }
    if (parts.preservedHost !== undefined) {
        out.preservedHost = parts.preservedHost;
    }
    if (parts.layoutDirty !== undefined) {
        out.layoutDirty = parts.layoutDirty;
    }
    if (parts.txbxContent !== undefined) {
        out.txbxContent = parts.txbxContent;
    }
    if (parts.bodyPr !== undefined) {
        out.bodyPr = parts.bodyPr;
    }
    if (parts.fill !== undefined) {
        out.fill = parts.fill;
    }
    if (parts.line !== undefined) {
        out.line = parts.line;
    }
    return out;
}

/**
 * Build {@link EncodeGroupInput} without writing `undefined` into optional
 * fields (`exactOptionalPropertyTypes`). Nested children are required (may be []).
 *
 * TS 3.3: nested conditional object spreads explode the checker (OOM).
 *
 * @param {Object} parts - The parts.
 * @returns {EncodeGroupInput} The result.
 * @private
 */
export function encodeGroupInput(parts: {
    readonly placement: DrawingHostPlacement;
    readonly widthEmu: Emus;
    readonly heightEmu: Emus;
    readonly docPrId: number;
    readonly name: string;
    readonly title?: string | undefined;
    readonly description?: string | undefined;
    readonly rotation?: number | undefined;
    readonly flipHorizontal?: boolean | undefined;
    readonly flipVertical?: boolean | undefined;
    readonly lockAspectRatio?: boolean | undefined;
    readonly wrapping?: TextWrappingStyleType | undefined;
    readonly distanceTopEmu?: Emus | undefined;
    readonly distanceBottomEmu?: Emus | undefined;
    readonly distanceLeftEmu?: Emus | undefined;
    readonly distanceRightEmu?: Emus | undefined;
    readonly behindDocument?: boolean | undefined;
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    readonly verticalOrigin?: VerticalOriginType | undefined;
    readonly horizontalPositionEmu?: Emus | undefined;
    readonly verticalPositionEmu?: Emus | undefined;
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
    readonly verticalAlignment?: VerticalAlignmentType | undefined;
    readonly lockAnchor?: boolean | undefined;
    readonly allowOverlap?: boolean | undefined;
    readonly layoutInCell?: boolean | undefined;
    readonly horizontalModeled?: boolean | undefined;
    readonly verticalModeled?: boolean | undefined;
    readonly preservedHost?: OpenXmlElement | undefined;
    readonly layoutDirty?: boolean | undefined;
    readonly children: ReadonlyArray<OpenXmlElement>;
}): EncodeGroupInput {
    const out: {
        placement: DrawingHostPlacement;
        widthEmu: Emus;
        heightEmu: Emus;
        docPrId: number;
        name: string;
        children: ReadonlyArray<OpenXmlElement>;
        title?: string;
        description?: string;
        rotation?: number;
        flipHorizontal?: boolean;
        flipVertical?: boolean;
        lockAspectRatio?: boolean;
        wrapping?: TextWrappingStyleType;
        distanceTopEmu?: Emus;
        distanceBottomEmu?: Emus;
        distanceLeftEmu?: Emus;
        distanceRightEmu?: Emus;
        behindDocument?: boolean;
        horizontalOrigin?: HorizontalOriginType;
        verticalOrigin?: VerticalOriginType;
        horizontalPositionEmu?: Emus;
        verticalPositionEmu?: Emus;
        horizontalAlignment?: HorizontalAlignmentType;
        verticalAlignment?: VerticalAlignmentType;
        lockAnchor?: boolean;
        allowOverlap?: boolean;
        layoutInCell?: boolean;
        horizontalModeled?: boolean;
        verticalModeled?: boolean;
        preservedHost?: OpenXmlElement;
        layoutDirty?: boolean;
    } = {
        placement: parts.placement,
        widthEmu: parts.widthEmu,
        heightEmu: parts.heightEmu,
        docPrId: parts.docPrId,
        name: parts.name,
        children: parts.children
    };
    if (parts.title !== undefined) {
        out.title = parts.title;
    }
    if (parts.description !== undefined) {
        out.description = parts.description;
    }
    if (parts.rotation !== undefined) {
        out.rotation = parts.rotation;
    }
    if (parts.flipHorizontal !== undefined) {
        out.flipHorizontal = parts.flipHorizontal;
    }
    if (parts.flipVertical !== undefined) {
        out.flipVertical = parts.flipVertical;
    }
    if (parts.lockAspectRatio !== undefined) {
        out.lockAspectRatio = parts.lockAspectRatio;
    }
    if (parts.wrapping !== undefined) {
        out.wrapping = parts.wrapping;
    }
    if (parts.distanceTopEmu !== undefined) {
        out.distanceTopEmu = parts.distanceTopEmu;
    }
    if (parts.distanceBottomEmu !== undefined) {
        out.distanceBottomEmu = parts.distanceBottomEmu;
    }
    if (parts.distanceLeftEmu !== undefined) {
        out.distanceLeftEmu = parts.distanceLeftEmu;
    }
    if (parts.distanceRightEmu !== undefined) {
        out.distanceRightEmu = parts.distanceRightEmu;
    }
    if (parts.behindDocument !== undefined) {
        out.behindDocument = parts.behindDocument;
    }
    if (parts.horizontalOrigin !== undefined) {
        out.horizontalOrigin = parts.horizontalOrigin;
    }
    if (parts.verticalOrigin !== undefined) {
        out.verticalOrigin = parts.verticalOrigin;
    }
    if (parts.horizontalPositionEmu !== undefined) {
        out.horizontalPositionEmu = parts.horizontalPositionEmu;
    }
    if (parts.verticalPositionEmu !== undefined) {
        out.verticalPositionEmu = parts.verticalPositionEmu;
    }
    if (parts.horizontalAlignment !== undefined) {
        out.horizontalAlignment = parts.horizontalAlignment;
    }
    if (parts.verticalAlignment !== undefined) {
        out.verticalAlignment = parts.verticalAlignment;
    }
    if (parts.lockAnchor !== undefined) {
        out.lockAnchor = parts.lockAnchor;
    }
    if (parts.horizontalModeled !== undefined) {
        out.horizontalModeled = parts.horizontalModeled;
    }
    if (parts.verticalModeled !== undefined) {
        out.verticalModeled = parts.verticalModeled;
    }
    if (parts.allowOverlap !== undefined) {
        out.allowOverlap = parts.allowOverlap;
    }
    if (parts.layoutInCell !== undefined) {
        out.layoutInCell = parts.layoutInCell;
    }
    if (parts.preservedHost !== undefined) {
        out.preservedHost = parts.preservedHost;
    }
    if (parts.layoutDirty !== undefined) {
        out.layoutDirty = parts.layoutDirty;
    }
    return out;
}

/**
 * Build {@link DrawingShapeInit} without writing `undefined` into optional
 * fields (`exactOptionalPropertyTypes`).
 *
 * TS 3.3: nested conditional object spreads explode the checker (OOM).
 *
 * @param {Object} parts - The parts.
 * @returns {DrawingShapeInit} The result.
 * @private
 */
export function drawingShapeInit(parts: {
    readonly encoding: DrawingEncoding;
    readonly residual: OpenXmlElement;
    readonly dirty: DirtyMode;
    readonly name?: string | undefined;
    readonly title?: string | undefined;
    readonly description?: string | undefined;
    readonly docPrId?: number | undefined;
    readonly placement?: DrawingHostPlacement | undefined;
    readonly width?: number | undefined;
    readonly height?: number | undefined;
    readonly presetGeometry?: string | undefined;
    readonly rotation?: number | undefined;
    readonly lockAspectRatio?: boolean | undefined;
    readonly flipHorizontal?: boolean | undefined;
    readonly flipVertical?: boolean | undefined;
    readonly wrapping?: TextWrappingStyleType | undefined;
    readonly wrapType?: TextWrappingType | undefined;
    readonly distanceTop?: number | undefined;
    readonly distanceBottom?: number | undefined;
    readonly distanceLeft?: number | undefined;
    readonly distanceRight?: number | undefined;
    readonly behindDocument?: boolean | undefined;
    readonly horizontalOrigin?: HorizontalOriginType | undefined;
    readonly verticalOrigin?: VerticalOriginType | undefined;
    readonly horizontalPosition?: number | undefined;
    readonly verticalPosition?: number | undefined;
    readonly horizontalAlignment?: HorizontalAlignmentType | undefined;
    readonly verticalAlignment?: VerticalAlignmentType | undefined;
    readonly lockAnchor?: boolean | undefined;
    readonly allowOverlap?: boolean | undefined;
    readonly layoutInCell?: boolean | undefined;
    readonly txbxContent?: ReadonlyArray<OpenXmlElement> | undefined;
    readonly bodyPrElement?: OpenXmlElement | undefined;
    readonly fill?: ShapeFill | undefined;
    readonly line?: ShapeLine | undefined;
    readonly children?: ReadonlyArray<DrawingShape> | undefined;
}): DrawingShapeInit {
    const out: {
        encoding: DrawingEncoding;
        residual: OpenXmlElement;
        dirty: DirtyMode;
        name?: string;
        title?: string;
        description?: string;
        docPrId?: number;
        placement?: DrawingHostPlacement;
        width?: number;
        height?: number;
        presetGeometry?: string;
        rotation?: number;
        lockAspectRatio?: boolean;
        flipHorizontal?: boolean;
        flipVertical?: boolean;
        wrapping?: TextWrappingStyleType;
        wrapType?: TextWrappingType;
        distanceTop?: number;
        distanceBottom?: number;
        distanceLeft?: number;
        distanceRight?: number;
        behindDocument?: boolean;
        horizontalOrigin?: HorizontalOriginType;
        verticalOrigin?: VerticalOriginType;
        horizontalPosition?: number;
        verticalPosition?: number;
        horizontalAlignment?: HorizontalAlignmentType;
        verticalAlignment?: VerticalAlignmentType;
        lockAnchor?: boolean;
        allowOverlap?: boolean;
        layoutInCell?: boolean;
        txbxContent?: ReadonlyArray<OpenXmlElement>;
        bodyPrElement?: OpenXmlElement;
        fill?: ShapeFill;
        line?: ShapeLine;
        children?: ReadonlyArray<DrawingShape>;
    } = {
        encoding: parts.encoding,
        residual: parts.residual,
        dirty: parts.dirty
    };
    if (parts.name !== undefined) {
        out.name = parts.name;
    }
    if (parts.title !== undefined) {
        out.title = parts.title;
    }
    if (parts.description !== undefined) {
        out.description = parts.description;
    }
    if (parts.docPrId !== undefined) {
        out.docPrId = parts.docPrId;
    }
    if (parts.placement !== undefined) {
        out.placement = parts.placement;
    }
    if (parts.width !== undefined) {
        out.width = parts.width;
    }
    if (parts.height !== undefined) {
        out.height = parts.height;
    }
    if (parts.presetGeometry !== undefined) {
        out.presetGeometry = parts.presetGeometry;
    }
    if (parts.rotation !== undefined) {
        out.rotation = parts.rotation;
    }
    if (parts.lockAspectRatio !== undefined) {
        out.lockAspectRatio = parts.lockAspectRatio;
    }
    if (parts.flipHorizontal !== undefined) {
        out.flipHorizontal = parts.flipHorizontal;
    }
    if (parts.flipVertical !== undefined) {
        out.flipVertical = parts.flipVertical;
    }
    if (parts.wrapping !== undefined) {
        out.wrapping = parts.wrapping;
    }
    if (parts.wrapType !== undefined) {
        out.wrapType = parts.wrapType;
    }
    if (parts.distanceTop !== undefined) {
        out.distanceTop = parts.distanceTop;
    }
    if (parts.distanceBottom !== undefined) {
        out.distanceBottom = parts.distanceBottom;
    }
    if (parts.distanceLeft !== undefined) {
        out.distanceLeft = parts.distanceLeft;
    }
    if (parts.distanceRight !== undefined) {
        out.distanceRight = parts.distanceRight;
    }
    if (parts.behindDocument !== undefined) {
        out.behindDocument = parts.behindDocument;
    }
    if (parts.horizontalOrigin !== undefined) {
        out.horizontalOrigin = parts.horizontalOrigin;
    }
    if (parts.verticalOrigin !== undefined) {
        out.verticalOrigin = parts.verticalOrigin;
    }
    if (parts.horizontalPosition !== undefined) {
        out.horizontalPosition = parts.horizontalPosition;
    }
    if (parts.verticalPosition !== undefined) {
        out.verticalPosition = parts.verticalPosition;
    }
    if (parts.horizontalAlignment !== undefined) {
        out.horizontalAlignment = parts.horizontalAlignment;
    }
    if (parts.verticalAlignment !== undefined) {
        out.verticalAlignment = parts.verticalAlignment;
    }
    if (parts.lockAnchor !== undefined) {
        out.lockAnchor = parts.lockAnchor;
    }
    if (parts.allowOverlap !== undefined) {
        out.allowOverlap = parts.allowOverlap;
    }
    if (parts.layoutInCell !== undefined) {
        out.layoutInCell = parts.layoutInCell;
    }
    if (parts.txbxContent !== undefined) {
        out.txbxContent = parts.txbxContent;
    }
    if (parts.bodyPrElement !== undefined) {
        out.bodyPrElement = parts.bodyPrElement;
    }
    if (parts.fill !== undefined) {
        out.fill = parts.fill;
    }
    if (parts.line !== undefined) {
        out.line = parts.line;
    }
    if (parts.children !== undefined) {
        out.children = parts.children;
    }
    return out;
}

/**
 * Map modeled {@link ShapeFill} to encode input. Only solid/none are serializable;
 * other kinds throw (public setters already reject them).
 *
 * @param {ShapeFill | undefined} fill - The fill.
 * @returns {EncodeDrawingShapeFill | undefined} The result.
 * @private
 */
export function modeledFillForEncode(fill: ShapeFill | undefined): EncodeDrawingShapeFill | undefined {
    if (fill === undefined) {
        return undefined;
    }
    if (fill.kind === 'none') {
        return { kind: 'none' };
    }
    if (fill.kind === 'solid') {
        const out: { kind: 'solid'; srgb: string; alpha?: number } = {
            kind: 'solid',
            srgb: fill.srgb
        };
        if (fill.alpha !== undefined) {
            out.alpha = fill.alpha;
        }
        return out;
    }
    throw new RangeError('Fill kind "' + String(fill.kind) + '" cannot be authored; use solid or none');
}

/**
 * Map modeled {@link ShapeLine} to encode input. Only solid/none are serializable.
 *
 * TS 3.3: nested conditional object spreads explode the checker (OOM).
 *
 * @param {ShapeLine | undefined} line - The line.
 * @returns {EncodeDrawingShapeLine | undefined} The result.
 * @private
 */
export function modeledLineForEncode(line: ShapeLine | undefined): EncodeDrawingShapeLine | undefined {
    if (line === undefined) {
        return undefined;
    }
    if (line.kind === 'none') {
        const out: {
            kind: 'none';
            widthEmu?: Emus;
            cap?: LineCap;
        } = {
            kind: 'none'
        };
        if (line.widthEmu !== undefined) {
            out.widthEmu = line.widthEmu;
        }
        if (line.cap !== undefined) {
            out.cap = line.cap;
        }
        return out;
    }
    if (line.kind === 'solid') {
        if (line.srgbColor === undefined) {
            throw new RangeError('Solid line requires an sRGB color');
        }
        const out: {
            kind: 'solid';
            srgb: string;
            widthEmu?: Emus;
            dash?: LineDashing;
            cap?: LineCap;
            beginArrowType?: LineEndType;
            beginArrowSize?: LineEndSize;
            endArrowType?: LineEndType;
            endArrowSize?: LineEndSize;
            alpha?: number;
        } = {
            kind: 'solid',
            srgb: line.srgbColor
        };
        if (line.widthEmu !== undefined) {
            out.widthEmu = line.widthEmu;
        }
        if (line.dash !== undefined) {
            out.dash = line.dash;
        }
        if (line.cap !== undefined) {
            out.cap = line.cap;
        }
        if (line.beginArrowType !== undefined) {
            out.beginArrowType = line.beginArrowType;
        }
        if (line.beginArrowSize !== undefined) {
            out.beginArrowSize = line.beginArrowSize;
        }
        if (line.endArrowType !== undefined) {
            out.endArrowType = line.endArrowType;
        }
        if (line.endArrowSize !== undefined) {
            out.endArrowSize = line.endArrowSize;
        }
        if (line.alpha !== undefined) {
            out.alpha = line.alpha;
        }
        return out;
    }
    throw new RangeError('Line kind "' + String(line.kind) + '" cannot be authored; use solid or none');
}
