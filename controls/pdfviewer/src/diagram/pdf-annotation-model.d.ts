import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { PointModel, DecoratorShapes } from '@syncfusion/ej2-drawings';import { Point } from '@syncfusion/ej2-drawings';import { Size } from '@syncfusion/ej2-drawings';import { Container } from '@syncfusion/ej2-drawings';import { PdfAnnotationType } from './enum';import { ICommentsCollection, IReviewCollection } from '../pdfviewer';

/**
 * Interface for a class PdfBounds
 */
export interface PdfBoundsModel {

    /**
     * Represents the the x value of the annotation.

     */
    x?: number;

    /**
     * Represents the the y value of the annotation.

     */
    y?: number;

    /**
     * Represents the the width value of the annotation.

     */
    width?: number;

    /**
     * Represents the the height value of the annotation.

     */
    height?: number;

    /**
     * Represents the the left value of the annotation.

     */
    left?: number;

    /**
     * Represents the the top value of the annotation.

     */
    top?: number;

    /**
     * Represents the the right value of the annotation.

     */
    right?: number;

    /**
     * Represents the the bottom value of the annotation.

     */
    bottom?: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node

     */
    location?: PointModel;

    /**
     * Sets the size of the annotation

     */
    size?: Size;

}

/**
 * Interface for a class PdfFont
 */
export interface PdfFontModel {

    /**
     * Represents the the font Bold style of annotation text content.

     */
    isBold?: boolean;

    /**
     * Represents the the font Italic style of annotation text content.

     */
    isItalic?: boolean;

    /**
     * Represents the the font Underline style of annotation text content.

     */
    isUnderline?: boolean;

    /**
     * Represents the the font Strikeout style of annotation text content.

     */
    isStrikeout?: boolean;

}

/**
 * Interface for a class PdfAnnotationBase
 */
export interface PdfAnnotationBaseModel {

    /**
     * Represents the unique id of annotation

     */
    id?: string;

    /**
     * Represents the annotation type of the pdf

     */
    shapeAnnotationType?: PdfAnnotationType;

    /**
     * Represents the measure type of the annotation

     */
    measureType?: string;

    /**
     * Represents the auther value of the annotation 

     */
    author?: string;

    /**
     * Represents the modified date of the annotation 

     */
    modifiedDate?: string;

    /**
     * Represents the subject of the annotation 

     */
    subject?: string;

    /**
     * Represents the notes of the annotation 

     */
    notes?: string;

    /**
     * Represents the stroke color of the annotation 

     */
    strokeColor?: string;

    /**
     * Represents the fill color of the annotation 

     */
    fillColor?: string;

    /**
     * Represents the fill color of the annotation 

     */
    stampFillColor?: string;

    /**
     * Represents the stroke color of the annotation 

     */
    stampStrokeColor?: string;

    /**
     * Represents the path data of the annotation 

     */
    data?: string;

    /**
     * Represents the opecity value of the annotation 

     */
    opacity?: number;

    /**
     * Represents the thickness value of annotation

     */
    thickness?: number;

    /**
     * Represents the border style of annotation

     */
    borderStyle?: string;

    /**
     * Represents the border dash array of annotation

     */
    borderDashArray?: string;

    /**
     * Represents the rotate angle of annotation

     */
    rotateAngle?: number;

    /**
     * Represents the annotation as cloud shape

     */
    isCloudShape?: boolean;

    /**
     * Represents the cloud intensity

     */
    cloudIntensity?: number;

    /**
     * Represents the height of the leader of distance shapes

     */
    leaderHeight?: number;

    /**
     * Represents the line start shape style

     */
    lineHeadStart?: string;

    /**
     * Represents the line end shape style

     */
    lineHeadEnd?: string;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    vertexPoints?: PointModel[];

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    sourcePoint?: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    sourceDecoraterShapes?: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    taregetDecoraterShapes?: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    targetPoint?: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    segments?: PointModel[];

    /**
     * Represents bounds of the annotation

     */
    bounds?: PdfBoundsModel;

    /**
     * Represents the cloud intensity

     */
    pageIndex?: number;

    /**
     * Represents the cloud intensity

     */

    zIndex?: number;

    /**
     * Represents the cloud intensity

     */
    wrapper?: Container;

    /**
     * Represents the dynamic stamp

     */
    isDynamicStamp?: boolean;

    /**
     * Represents the dynamic text.

     */
    dynamicText?: string;

    /**
     * Represents the unique annotName of the annotation 

     */
    annotName?: string;

    /**
     * Represents the review collection of the annotation 

     */
    review?: IReviewCollection;

    /**
     * Represents the comments collection of the annotation 

     */
    comments?: ICommentsCollection[];

    /**
     * Represents the comments collection of the annotation 

     */
    fontColor?: string;

    /**
     * Represents the font size of the annotation content

     */
    fontSize?: number;

    /**
     * Represents the font family of the annotation content

     */
    fontFamily?: string;

    /**
     * Represents the shape annotation label add flag

     */
    enableShapeLabel?: boolean;

    /**
     * Represents the shape annotation label content

     */
    labelContent?: string;

    /**
     * Represents the shape annotation label content fill color

     */
    labelFillColor?: string;

    /**
     * Represents the shape annotation label content max-length

     */
    labelMaxLength?: number;

    /**
     * Represents the opecity value of the annotation 

     */
    labelOpacity?: number;

    /**
     * Represents the shape annotation label content border color

     */
    labelBorderColor?: string;

    /**
     * Represents the text anlignment style of annotation

     */
    textAlign?: string;

    /**
     * Represents the text style of annotation

     */
    font?: PdfFontModel;

    /**
     * Represents the shape annotation label content bounds

     */
    labelBounds?: PdfBoundsModel;

}

/**
 * Interface for a class ZOrderPageTable
 */
export interface ZOrderPageTableModel {

}