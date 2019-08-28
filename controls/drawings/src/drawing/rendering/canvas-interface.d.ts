import { PointModel } from './../primitives/point-model';
import { TextOverflow, TextWrap, Scale, ImageAlignment } from '../enum/enum';
import { GradientModel } from '../core/appearance-model';
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
}
/** @private */
export interface SubTextElement {
    text: string;
    x: number;
    dy: number;
    width: number;
}
/** @private */
export interface TextBounds {
    x: number;
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
