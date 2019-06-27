import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { PointModel, DecoratorShapes } from '@syncfusion/ej2-drawings';
import { Point } from '@syncfusion/ej2-drawings';
import { Size } from '@syncfusion/ej2-drawings';
import { PdfBoundsModel, PdfAnnotationBaseModel } from './pdf-annotation-model';
import { Container } from '@syncfusion/ej2-drawings';
import { AnnotationType } from './enum';
import { ICommentsCollection, IReviewCollection } from '../pdfviewer';
/**
 * The `PdfBounds` is base for annotation bounds.
 * @hidden
 */
export abstract class PdfBounds extends ChildProperty<PdfBounds> {

    /**
     * Represents the the x value of the annotation.
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Represents the the y value of the annotation.
     * @default 0
     */
    @Property(0)
    public y: number;

    /**
     * Represents the the width value of the annotation.
     * @default 0
     */
    @Property(0)
    public width: number;

    /**
     * Represents the the height value of the annotation.
     * @default 0
     */
    @Property(0)
    public height: number;

    /**
     * Represents the the left value of the annotation.
     * @default 0
     */
    @Property(0)
    public left: number;

    /**
     * Represents the the top value of the annotation.
     * @default 0
     */
    @Property(0)
    public top: number;

    /**
     * Represents the the right value of the annotation.
     * @default 0
     */
    @Property(0)
    public right: number;

    /**
     * Represents the the bottom value of the annotation.
     * @default 0
     */
    @Property(0)
    public bottom: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     * @default new Point(0,0)
     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public location: PointModel;

    /**
     * Sets the size of the annotation
     * @default new Size(0, 0)
     */
    @Complex<Size>(new Size(0, 0), Size)
    public size: Size;
}

/**
 * Defines the common behavior of PdfAnnotationBase
 * @hidden
 */
export class PdfAnnotationBase extends ChildProperty<PdfAnnotationBase> {

    /**
     * Represents the unique id of annotation
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Represents the annotation type of the pdf
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public shapeAnnotationType: AnnotationType;

    /**
     * Represents the measure type of the annotation
     * @default ''
     */
    @Property('')
    public measureType: string;

    /**
     * Represents the auther value of the annotation 
     * @default ''
     */
    @Property('')
    public author: string;

    /**
     * Represents the modified date of the annotation 
     * @default ''
     */
    @Property('')
    public modifiedDate: string;

    /**
     * Represents the subject of the annotation 
     * @default ''
     */
    @Property('')
    public subject: string;

    /**
     * Represents the notes of the annotation 
     * @default ''
     */
    @Property('')
    public notes: string;

    /**
     * Represents the stroke color of the annotation 
     * @default 'black'
     */
    @Property('black')
    public strokeColor: string;

    /**
     * Represents the fill color of the annotation 
     * @default 'tranparent'
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * Represents the fill color of the annotation 
     * @default 'tranparent'
     */
    @Property('#ffffff00')
    public stampFillColor: string;

    /**
     * Represents the stroke color of the annotation 
     * @default 'black'
     */
    @Property('black')
    public stampStrokeColor: string;

    /**
     * Represents the path data of the annotation 
     * @default 'string'
     */
    @Property('')
    public data: string;
    /**
     * Represents the opecity value of the annotation 
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Represents the thickness value of annotation
     * @default 1
     */
    @Property(1)
    public thickness: number;

    /**
     * Represents the border style of annotation
     * @default ''
     */
    @Property('')
    public borderStyle: string;

    /**
     * Represents the border dash array of annotation
     * @default ''
     */
    @Property('')
    public borderDashArray: string;

    /**
     * Represents the rotate angle of annotation
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Represents the annotation as cloud shape
     * @default false
     */
    @Property(false)
    public isCloudShape: boolean;


    /**
     * Represents the cloud intensity
     * @default 0
     */
    @Property(0)
    public cloudIntensity: number;

    /**
     * Represents the height of the leader of distance shapes
     * @default 0
     */
    @Property(40)
    public leaderHeight: number;

    /**
     * Represents the line start shape style
     * @default null
     */
    @Property(null)
    public lineHeadStart: string;

    /**
     * Represents the line end shape style
     * @default null
     */
    @Property(null)
    public lineHeadEnd: string;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    @Property([])
    public vertexPoints: PointModel[];

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    @Property(null)
    public sourcePoint: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    @Property('None')
    public sourceDecoraterShapes: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    @Property('None')
    public taregetDecoraterShapes: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    @Property(null)
    public targetPoint: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     * @default []
     */
    @Property([])
    public segments: PointModel[];

    /**
     * Represents bounds of the annotation
     * @default ''
     */
    @Complex<PdfBoundsModel>({ x: 0, y: 0 }, PdfBounds)
    public bounds: PdfBoundsModel;

    /**
     * Represents the cloud intensity
     * @default 0
     */
    @Property(0)
    public pageIndex: number;

    /**
     * Represents the cloud intensity
     * @default -1
     */

    @Property(-1)
    public zIndex: number;

    /**
     * Represents the cloud intensity
     * @default -1
     */
    @Property(null)
    public wrapper: Container;

    /**
     * Represents the dynamic stamp
     * @default -1
     */
    @Property(false)
    public isDynamicStamp: boolean;
    /**
     * Represents the dynamic text.
     * @default -1
     */
    @Property('')
    public dynamicText: string;

    /**
     * Represents the unique annotName of the annotation 
     * @default ''
     */
    @Property('')
    public annotName: string;

    /**
     * Represents the review collection of the annotation 
     * @default ''
     */
    @Property({})
    public review: IReviewCollection;

    /**
     * Represents the comments collection of the annotation 
     * @default []
     */
    @Property([])
    public comments: ICommentsCollection[];

    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

}
/**
 * @hidden
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
