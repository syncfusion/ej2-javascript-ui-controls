import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { PointModel, DecoratorShapes } from '@syncfusion/ej2-drawings';import { Point } from '@syncfusion/ej2-drawings';import { Size } from '@syncfusion/ej2-drawings';import { Container } from '@syncfusion/ej2-drawings';import { PdfAnnotationType } from './enum';import { ICommentsCollection, IReviewCollection } from '../pdfviewer';

/**
 * Interface for a class PdfBounds
 */
export interface PdfBoundsModel {

    /**
     * Represents the the x value of the annotation.
     * @default 0
     */
    x?: number;

    /**
     * Represents the the y value of the annotation.
     * @default 0
     */
    y?: number;

    /**
     * Represents the the width value of the annotation.
     * @default 0
     */
    width?: number;

    /**
     * Represents the the height value of the annotation.
     * @default 0
     */
    height?: number;

    /**
     * Represents the the left value of the annotation.
     * @default 0
     */
    left?: number;

    /**
     * Represents the the top value of the annotation.
     * @default 0
     */
    top?: number;

    /**
     * Represents the the right value of the annotation.
     * @default 0
     */
    right?: number;

    /**
     * Represents the the bottom value of the annotation.
     * @default 0
     */
    bottom?: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     * @default new Point(0,0)
     */
    location?: PointModel;

    /**
     * Sets the size of the annotation
     * @default new Size(0, 0)
     */
    size?: Size;

}

/**
 * Interface for a class PdfAnnotationBase
 */
export interface PdfAnnotationBaseModel {

    /**
     * Represents the unique id of annotation
     * @default ''
     */
    id?: string;

    /**
     * Represents the annotation type of the pdf
     * @default 'Rectangle'
     */
    shapeAnnotationType?: PdfAnnotationType;

    /**
     * Represents the measure type of the annotation
     * @default ''
     */
    measureType?: string;

    /**
     * Represents the auther value of the annotation 
     * @default ''
     */
    author?: string;

    /**
     * Represents the modified date of the annotation 
     * @default ''
     */
    modifiedDate?: string;

    /**
     * Represents the subject of the annotation 
     * @default ''
     */
    subject?: string;

    /**
     * Represents the notes of the annotation 
     * @default ''
     */
    notes?: string;

    /**
     * Represents the stroke color of the annotation 
     * @default 'black'
     */
    strokeColor?: string;

    /**
     * Represents the fill color of the annotation 
     * @default 'tranparent'
     */
    fillColor?: string;

    /**
     * Represents the fill color of the annotation 
     * @default 'tranparent'
     */
    stampFillColor?: string;

    /**
     * Represents the stroke color of the annotation 
     * @default 'black'
     */
    stampStrokeColor?: string;

    /**
     * Represents the path data of the annotation 
     * @default ''
     */
    data?: string;

    /**
     * Represents the opecity value of the annotation 
     * @default 1
     */
    opacity?: number;

    /**
     * Represents the thickness value of annotation
     * @default 1
     */
    thickness?: number;

    /**
     * Represents the border style of annotation
     * @default ''
     */
    borderStyle?: string;

    /**
     * Represents the border dash array of annotation
     * @default ''
     */
    borderDashArray?: string;

    /**
     * Represents the rotate angle of annotation
     * @default 0
     */
    rotateAngle?: number;

    /**
     * Represents the annotation as cloud shape
     * @default false
     */
    isCloudShape?: boolean;

    /**
     * Represents the cloud intensity
     * @default 0
     */
    cloudIntensity?: number;

    /**
     * Represents the height of the leader of distance shapes
     * @default 40
     */
    leaderHeight?: number;

    /**
     * Represents the line start shape style
     * @default null
     */
    lineHeadStart?: string;

    /**
     * Represents the line end shape style
     * @default null
     */
    lineHeadEnd?: string;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    vertexPoints?: PointModel[];

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default null
     */
    sourcePoint?: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default None
     */
    sourceDecoraterShapes?: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default None
     */
    taregetDecoraterShapes?: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default null
     */
    targetPoint?: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    segments?: PointModel[];

    /**
     * Represents bounds of the annotation
     * @default new Point(0,0)
     */
    bounds?: PdfBoundsModel;

    /**
     * Represents the cloud intensity
     * @default 0
     */
    pageIndex?: number;

    /**
     * Represents the cloud intensity
     * @default -1
     */

    zIndex?: number;

    /**
     * Represents the cloud intensity
     * @default null
     */
    wrapper?: Container;

    /**
     * Represents the dynamic stamp
     * @default false
     */
    isDynamicStamp?: boolean;

    /**
     * Represents the dynamic text.
     * @default ''
     */
    dynamicText?: string;

    /**
     * Represents the unique annotName of the annotation 
     * @default ''
     */
    annotName?: string;

    /**
     * Represents the review collection of the annotation 
     * @default ''
     */
    review?: IReviewCollection;

    /**
     * Represents the comments collection of the annotation 
     * @default []
     */
    comments?: ICommentsCollection[];

}

/**
 * Interface for a class ZOrderPageTable
 */
export interface ZOrderPageTableModel {

}