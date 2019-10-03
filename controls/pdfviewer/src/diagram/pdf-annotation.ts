import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { PointModel, DecoratorShapes } from '@syncfusion/ej2-drawings';
import { Point } from '@syncfusion/ej2-drawings';
import { Size } from '@syncfusion/ej2-drawings';
import { PdfBoundsModel, PdfAnnotationBaseModel, PdfFontModel } from './pdf-annotation-model';
import { Container } from '@syncfusion/ej2-drawings';
import { PdfAnnotationType } from './enum';
import { ICommentsCollection, IReviewCollection } from '../pdfviewer';
/**
 * The `PdfBounds` is base for annotation bounds.

 */
export abstract class PdfBounds extends ChildProperty<PdfBounds> {

    /**
     * Represents the the x value of the annotation.

     */
    @Property(0)
    public x: number;

    /**
     * Represents the the y value of the annotation.

     */
    @Property(0)
    public y: number;

    /**
     * Represents the the width value of the annotation.

     */
    @Property(0)
    public width: number;

    /**
     * Represents the the height value of the annotation.

     */
    @Property(0)
    public height: number;

    /**
     * Represents the the left value of the annotation.

     */
    @Property(0)
    public left: number;

    /**
     * Represents the the top value of the annotation.

     */
    @Property(0)
    public top: number;

    /**
     * Represents the the right value of the annotation.

     */
    @Property(0)
    public right: number;

    /**
     * Represents the the bottom value of the annotation.

     */
    @Property(0)
    public bottom: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node

     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public location: PointModel;

    /**
     * Sets the size of the annotation

     */
    @Complex<Size>(new Size(0, 0), Size)
    public size: Size;
}

/**
 * The `PdfFont` is base for annotation Text styles.

 */
export abstract class PdfFont extends ChildProperty<PdfFont> {

    /**
     * Represents the the font Bold style of annotation text content.

     */
    @Property(false)
    public isBold: boolean;

    /**
     * Represents the the font Italic style of annotation text content.

     */
    @Property(false)
    public isItalic: boolean;

    /**
     * Represents the the font Underline style of annotation text content.

     */
    @Property(false)
    public isUnderline: boolean;

    /**
     * Represents the the font Strikeout style of annotation text content.

     */
    @Property(false)
    public isStrikeout: boolean;
}

/**
 * Defines the common behavior of PdfAnnotationBase

 */
export class PdfAnnotationBase extends ChildProperty<PdfAnnotationBase> {

    /**
     * Represents the unique id of annotation

     */
    @Property('')
    public id: string;

    /**
     * Represents the annotation type of the pdf

     */
    @Property('Rectangle')
    public shapeAnnotationType: PdfAnnotationType;

    /**
     * Represents the measure type of the annotation

     */
    @Property('')
    public measureType: string;

    /**
     * Represents the auther value of the annotation 

     */
    @Property('')
    public author: string;

    /**
     * Represents the modified date of the annotation 

     */
    @Property('')
    public modifiedDate: string;

    /**
     * Represents the subject of the annotation 

     */
    @Property('')
    public subject: string;

    /**
     * Represents the notes of the annotation 

     */
    @Property('')
    public notes: string;

    /**
     * Represents the stroke color of the annotation 

     */
    @Property('black')
    public strokeColor: string;

    /**
     * Represents the fill color of the annotation 

     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * Represents the fill color of the annotation 

     */
    @Property('#ffffff00')
    public stampFillColor: string;

    /**
     * Represents the stroke color of the annotation 

     */
    @Property('black')
    public stampStrokeColor: string;

    /**
     * Represents the path data of the annotation 

     */
    @Property('')
    public data: string;
    /**
     * Represents the opecity value of the annotation 

     */
    @Property(1)
    public opacity: number;

    /**
     * Represents the thickness value of annotation

     */
    @Property(1)
    public thickness: number;

    /**
     * Represents the border style of annotation

     */
    @Property('')
    public borderStyle: string;

    /**
     * Represents the border dash array of annotation

     */
    @Property('')
    public borderDashArray: string;

    /**
     * Represents the rotate angle of annotation

     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Represents the annotation as cloud shape

     */
    @Property(false)
    public isCloudShape: boolean;


    /**
     * Represents the cloud intensity

     */
    @Property(0)
    public cloudIntensity: number;

    /**
     * Represents the height of the leader of distance shapes

     */
    @Property(40)
    public leaderHeight: number;

    /**
     * Represents the line start shape style

     */
    @Property(null)
    public lineHeadStart: string;

    /**
     * Represents the line end shape style

     */
    @Property(null)
    public lineHeadEnd: string;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    @Property([])
    public vertexPoints: PointModel[];

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    @Property(null)
    public sourcePoint: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    @Property('None')
    public sourceDecoraterShapes: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    @Property('None')
    public taregetDecoraterShapes: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    @Property(null)
    public targetPoint: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.

     */
    @Property([])
    public segments: PointModel[];

    /**
     * Represents bounds of the annotation

     */
    @Complex<PdfBoundsModel>({ x: 0, y: 0 }, PdfBounds)
    public bounds: PdfBoundsModel;

    /**
     * Represents the cloud intensity

     */
    @Property(0)
    public pageIndex: number;

    /**
     * Represents the cloud intensity

     */

    @Property(-1)
    public zIndex: number;

    /**
     * Represents the cloud intensity

     */
    @Property(null)
    public wrapper: Container;

    /**
     * Represents the dynamic stamp

     */
    @Property(false)
    public isDynamicStamp: boolean;
    /**
     * Represents the dynamic text.

     */
    @Property('')
    public dynamicText: string;

    /**
     * Represents the unique annotName of the annotation 

     */
    @Property('')
    public annotName: string;

    /**
     * Represents the review collection of the annotation 

     */
    @Property({})
    public review: IReviewCollection;

    /**
     * Represents the comments collection of the annotation 

     */
    @Property([])
    public comments: ICommentsCollection[];

    /**
     * Represents the comments collection of the annotation 

     */
    @Property('#000')
    public fontColor: string;

    /**
     * Represents the font size of the annotation content

     */
    @Property(16)
    public fontSize: number;

    /**
     * Represents the font family of the annotation content

     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Represents the shape annotation label add flag

     */
    @Property(false)
    public enableShapeLabel: boolean;

    /**
     * Represents the shape annotation label content

     */
    @Property('label')
    public labelContent: string;

    /**
     * Represents the shape annotation label content fill color

     */
    @Property('#ffffff00')
    public labelFillColor: string;
    /**
     * Represents the shape annotation label content max-length

     */
    @Property(15)
    public labelMaxLength: number;

    /**
     * Represents the opecity value of the annotation 

     */
    @Property(1)
    public labelOpacity: number;

    /**
     * Represents the shape annotation label content border color

     */
    @Property('#ffffff00')
    public labelBorderColor: string;

    /**
     * Represents the text anlignment style of annotation

     */
    @Property('left')
    public textAlign: string;

    /**
     * Represents the text style of annotation

     */
    @Complex<PdfFontModel>({ isBold: false, isItalic: false, isStrikeout: false, isUnderline: false }, PdfFont)
    public font: PdfFontModel;

    /**
     * Represents the shape annotation label content bounds

     */
    @Complex<PdfBoundsModel>({ x: 0, y: 0 }, PdfBounds)
    public labelBounds: PdfBoundsModel;

    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

}
/**

 */
export class ZOrderPageTable {

    private pageIdTemp: number = 0;

    /** @private */
    public get pageId(): number {
        return this.pageIdTemp;
    }

    /** @private */
    public set pageId(offset: number) {
        this.pageIdTemp = offset;

    }

    private zIndexTemp: number = -1;

    /** @private */
    public get zIndex(): number {
        return this.zIndexTemp;
    }

    /** @private */
    public set zIndex(offset: number) {
        this.zIndexTemp = offset;

    }

    private childNodesTemp: PdfAnnotationBaseModel[] = [];

    /** @private */
    public get objects(): PdfAnnotationBaseModel[] {
        return this.childNodesTemp;
    }

    /** @private */
    public set objects(childNodes: PdfAnnotationBaseModel[]) {
        this.childNodesTemp = childNodes;

    }

    constructor() {
        this.objects = [];
        this.zIndexTemp = -1;
        this.pageIdTemp = 0;
    }
}
