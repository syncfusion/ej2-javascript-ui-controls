import { ShadowModel, GradientModel } from '../core/appearance-model';
import { PointModel } from './../primitives/point-model';
import { TextOverflow, Scale, ImageAlignment, Stretch, TextWrap, FlipDirection } from '../enum/enum';
/**
 * canvas interface
 */
/** @private */
export interface StyleAttributes {
    fill: string;
    stroke: string;
    strokeWidth: number;
    dashArray: string;
    opacity: number;
    shadow?: ShadowModel;
    gradient?: GradientModel;
    class?: string;
}
/** @private */
export interface BaseAttributes extends StyleAttributes {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    pivotX: number;
    pivotY: number;
    visible: boolean;
    description?: string;
    canApplyStyle?: boolean;
    flip?: FlipDirection;
}
/** @private */
export interface LineAttributes extends BaseAttributes {
    startPoint: PointModel;
    endPoint: PointModel;
}
/** @private */
export interface CircleAttributes extends BaseAttributes {
    centerX: number;
    centerY: number;
    radius: number;
    id: string;
}
/** @private */
export interface Alignment {
    vAlign?: string;
    hAlign?: string;
}
/** @private */
export interface SegmentInfo {
    point?: PointModel;
    index?: number;
    angle?: number;
}
/** @private */
export interface RectAttributes extends BaseAttributes {
    cornerRadius?: number;
}
/** @private */
export interface PathAttributes extends BaseAttributes {
    data: string;
}
/** @private */
export interface ImageAttributes extends BaseAttributes {
    source: string;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
    scale: Scale;
    alignment: ImageAlignment;
}
/** @private */
export interface NativeAttributes extends BaseAttributes {
    content: SVGElement;
    scale: Stretch;
}
/** @private */
export interface TextAttributes extends BaseAttributes {
    whiteSpace: string;
    content: string;
    breakWord: string;
    fontSize: number;
    textWrapping: TextWrap;
    fontFamily: string;
    bold: boolean;
    italic: boolean;
    textAlign: string;
    color: string;
    textOverflow: TextOverflow;
    textDecoration: string;
    doWrap: boolean;
    wrapBounds: TextBounds;
    childNodes: SubTextElement[];
    isHorizontalLane: boolean;
    parentOffsetX: number;
    parentOffsetY: number;
    parentWidth: number;
    parentHeight: number;
}
/**
 * Defines the properties of sub text element
 */
export interface SubTextElement {
    /** returns the text from sub text element */
    text: string;
    /** returns the start position, where the text element to be rendered */
    x: number;
    /** returns the left position, where text to be rendered  */
    dy: number;
    /** returns the width of the sub text element  */
    width: number;
}
/**
 * Defines the properties of text bounds
 */
export interface TextBounds {
    /** returns the start position, where the text element is rendered  */
    x: number;
    /** returns the width of the sub text element  */
    width: number;
}
/** @private */
export interface PathSegment {
    command?: string;
    angle?: number;
    largeArc?: boolean;
    x2?: number;
    sweep?: boolean;
    x1?: number;
    y1?: number;
    y2?: number;
    x0?: number;
    y0?: number;
    x?: number;
    y?: number;
    r1?: number;
    r2?: number;
    centp?: {
        x?: number;
        y?: number;
    };
    xAxisRotation?: number;
    rx?: number;
    ry?: number;
    a1?: number;
    ad?: number;
}
