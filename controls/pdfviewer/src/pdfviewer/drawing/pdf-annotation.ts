import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { PointModel, DecoratorShapes } from '@syncfusion/ej2-drawings';
import { Point } from '@syncfusion/ej2-drawings';
import { Size } from '@syncfusion/ej2-drawings';
import { PdfBoundsModel, PdfAnnotationBaseModel, PdfFontModel } from './pdf-annotation-model';
import { Container } from '@syncfusion/ej2-drawings';
import { PdfAnnotationType, FormFieldAnnotationType } from './enum';
import { ICommentsCollection, IReviewCollection, AnnotationSelectorSettingsModel, AllowedInteraction, ItemModel, SignatureIndicatorSettingsModel } from '../index';
/**
 * The `PdfBounds` is base for annotation bounds.
 *
 * @hidden
 */
export abstract class PdfBounds extends ChildProperty<PdfBounds> {

    /**
     * Represents the the x value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Represents the the y value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public y: number;

    /**
     * Represents the the width value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public width: number;

    /**
     * Represents the the height value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public height: number;

    /**
     * Represents the the left value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public left: number;

    /**
     * Represents the the top value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public top: number;

    /**
     * Represents the the right value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public right: number;

    /**
     * Represents the the bottom value of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public bottom: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     *
     * @default new Point(0,0)
     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public location: PointModel;

    /**
     * Sets the size of the annotation
     *
     * @default new Size(0, 0)
     */
    @Complex<Size>(new Size(0, 0), Size)
    public size: Size;
}

/**
 * The `PdfFont` is base for annotation Text styles.
 *
 * @hidden
 */
export abstract class PdfFont extends ChildProperty<PdfFont> {

    /**
     * Represents the the font Bold style of annotation text content.
     *
     * @default 'false'
     */
    @Property(false)
    public isBold: boolean;

    /**
     * Represents the the font Italic style of annotation text content.
     *
     * @default 'false'
     */
    @Property(false)
    public isItalic: boolean;

    /**
     * Represents the the font Underline style of annotation text content.
     *
     * @default 'false'
     */
    @Property(false)
    public isUnderline: boolean;

    /**
     * Represents the the font Strikeout style of annotation text content.
     *
     * @default 'false'
     */
    @Property(false)
    public isStrikeout: boolean;
}

/**
 * Defines the common behavior of PdfAnnotationBase
 *
 * @hidden
 */
export class PdfAnnotationBase extends ChildProperty<PdfAnnotationBase> {

    /**
     * Represents the unique id of annotation
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Represents the annotation type of the pdf
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public shapeAnnotationType: PdfAnnotationType;

    /**
     * Represents the annotation type of the form field
     *
     * @default ''
     */
    @Property(null)
    public formFieldAnnotationType: FormFieldAnnotationType;

    /**
     * Represents the measure type of the annotation
     *
     * @default ''
     */
    @Property('')
    public measureType: string;

    /**
     * Represents the auther value of the annotation
     *
     * @default ''
     */
    @Property('')
    public author: string;

    /**
     * Represents the modified date of the annotation
     *
     * @default ''
     */
    @Property('')
    public modifiedDate: string;

    /**
     * Represents the subject of the annotation
     *
     * @default ''
     */
    @Property('')
    public subject: string;

    /**
     * Represents the notes of the annotation
     *
     * @default ''
     */
    @Property('')
    public notes: string;

    /**
     * specifies the locked action of the comment
     *
     * @default 'false'
     */
    @Property(false)
    public isCommentLock: boolean;

    /**
     * Represents the stroke color of the annotation
     *
     * @default 'black'
     */
    @Property('black')
    public strokeColor: string;

    /**
     * Represents the fill color of the annotation
     *
     * @default 'tranparent'
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * Represents the fill color of the annotation
     *
     * @default 'tranparent'
     */
    @Property('#ffffff00')
    public stampFillColor: string;

    /**
     * Represents the stroke color of the annotation
     *
     * @default 'black'
     */
    @Property('black')
    public stampStrokeColor: string;

    /**
     * Represents the path data of the annotation
     *
     * @default ''
     */
    @Property('')
    public data: string;
    /**
     * Represents the opecity value of the annotation
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Represents the thickness value of annotation
     *
     * @default 1
     */
    @Property(1)
    public thickness: number;

    /**
     * Represents the border style of annotation
     *
     * @default ''
     */
    @Property('')
    public borderStyle: string;

    /**
     * Represents the border dash array of annotation
     *
     * @default ''
     */
    @Property('')
    public borderDashArray: string;

    /**
     * Represents the rotate angle of annotation
     *
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Represents the annotation as cloud shape
     *
     * @default false
     */
    @Property(false)
    public isCloudShape: boolean;


    /**
     * Represents the cloud intensity
     *
     * @default 0
     */
    @Property(0)
    public cloudIntensity: number;

    /**
     * Represents the height of the leader of distance shapes
     *
     * @default 40
     */
    @Property(40)
    public leaderHeight: number;

    /**
     * Represents the line start shape style
     *
     * @default null
     */
    @Property(null)
    public lineHeadStart: string;

    /**
     * Represents the line end shape style
     *
     * @default null
     */
    @Property(null)
    public lineHeadEnd: string;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default []
     */
    @Property([])
    public vertexPoints: PointModel[];

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default null
     */
    @Property(null)
    public sourcePoint: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default None
     */
    @Property('None')
    public sourceDecoraterShapes: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default None
     */
    @Property('None')
    public taregetDecoraterShapes: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default null
     */
    @Property(null)
    public targetPoint: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default []
     */
    @Property([])
    public segments: PointModel[];

    /**
     * Represents bounds of the annotation
     *
     * @default new Point(0,0)
     */
    @Complex<PdfBoundsModel>({ x: 0, y: 0 }, PdfBounds)
    public bounds: PdfBoundsModel;

    /**
     * Represents the cloud intensity
     *
     * @default 0
     */
    @Property(0)
    public pageIndex: number;

    /**
     * Represents the cloud intensity
     *
     * @default -1
     */

    @Property(-1)
    public zIndex: number;

    /**
     * Represents the cloud intensity
     *
     * @default null
     */
    @Property(null)
    public wrapper: Container;

    /**
     * Represents the dynamic stamp
     *
     * @default false
     */
    @Property(false)
    public isDynamicStamp: boolean;
    /**
     * Represents the dynamic text.
     *
     * @default ''
     */
    @Property('')
    public dynamicText: string;

    /**
     * Represents the unique annotName of the annotation
     *
     * @default ''
     */
    @Property('')
    public annotName: string;

    /**
     * Represents the review collection of the annotation
     *
     * @default ''
     */
    @Property({})
    public review: IReviewCollection;

    /**
     * Represents the comments collection of the annotation
     *
     * @default []
     */
    @Property([])
    public comments: ICommentsCollection[];

    /**
     * Represents the comments collection of the annotation
     *
     * @default '#000'
     */
    @Property('#000')
    public fontColor: string;

    /**
     * Represents the font size of the annotation content
     *
     * @default '16'
     */
    @Property(16)
    public fontSize: number;

    /**
     * Represents the font family of the annotation content
     *
     * @default 'Helvetica'
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Represents the font style of the annotation content
     *
     * @default 'None'
     */
    @Property('None')
    public fontStyle: string;

    /**
     * Represents the shape annotation label add flag
     *
     * @default 'false'
     */
    @Property(false)
    public enableShapeLabel: boolean;

    /**
     * Represents the shape annotation label content
     *
     * @default 'label'
     */
    @Property('label')
    public labelContent: string;

    /**
     * Represents the shape annotation label content fill color
     *
     * @default '#ffffff00'
     */
    @Property('#ffffff00')
    public labelFillColor: string;
    /**
     * Represents the shape annotation label content max-length
     *
     * @default '15'
     */
    @Property(15)
    public labelMaxLength: number;

    /**
     * Represents the opecity value of the annotation
     *
     * @default 1
     */
    @Property(1)
    public labelOpacity: number;

    /**
     * Represents the selection settings of the annotation
     *
     * @default ''
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Represents the shape annotation label content border color
     *
     * @default '#ffffff00'
     */
    @Property('#ffffff00')
    public labelBorderColor: string;

    /**
     * Represents the text anlignment style of annotation
     *
     * @default 'left'
     */
    @Property('left')
    public textAlign: string;

    /**
     * Represents the unique Name of the annotation
     *
     * @default ''
     */
    @Property('')
    public signatureName: string;

    /**
     * specifies the minHeight of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     *
     * @default 0
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     *
     * @default 'false'
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the particular annotation mode.
     *
     * @default 'UI Drawn Annotation'
     */
    @Property('UI Drawn Annotation')
    public annotationAddMode: string;

    /**
     * specifies the default settings of the annotation.
     *
     * @default ''
     */
    @Property('')
    public annotationSettings: object;

    /**
     * specifies the previous font size  of the annotation.
     *
     * @default '16'
     */
    @Property(16)
    public previousFontSize: number;

    /**
     * Represents the text style of annotation
     *
     * @default ''
     */
    @Complex<PdfFontModel>({ isBold: false, isItalic: false, isStrikeout: false, isUnderline: false }, PdfFont)
    public font: PdfFontModel;

    /**
     * Represents the shape annotation label content bounds
     *
     * @default ''
     */
    @Complex<PdfBoundsModel>({ x: 0, y: 0 }, PdfBounds)
    public labelBounds: PdfBoundsModel;
    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;
    /**
     * specifies the allowed interactions of the locked annotation.
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction;

    /**
     * specifies whether the annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;

    /**
     * Allows to edit the free text annotation
     */
    @Property(false)
    public isReadonly: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

}

/**
 * Defines the common behavior of PdfFormFieldBase
 *
 * @hidden
 */
export class PdfFormFieldBase extends ChildProperty<PdfFormFieldBase> {

    /**
     * Represents the unique id of formField
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * specifies the type of the signature.
     */
    @Property('')
    public signatureType: string;

    /**
     * Represents the name of the formField
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Represents the value of the formField
     *
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Represents the annotation type of the form field
     *
     * @default ''
     */
    @Property(null)
    public formFieldAnnotationType: FormFieldAnnotationType;

    /**
     * Represents the fill color of the form field
     *
     * @default '#daeaf7ff'
     */
    @Property('#daeaf7ff')
    public backgroundColor: string;

    /**
     * Represents the text color of the form field
     *
     * @default 'black'
     */
    @Property('black')
    public color: string;

    /**
     * Represents the border color of the form field
     *
     * @default '#303030'
     */
    @Property('#303030')
    public borderColor: string;

    /**
     * Represents the tooltip of the form field
     *
     * @default ''
     */
    @Property('')
    public tooltip: string;

    /**
     * Represents the opecity value of the formField
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Represents the thickness value of FormField
     *
     * @default 1
     */
    @Property(1)
    public thickness: number;

    /**
     * Represents the rotate angle of formField
     *
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Represents bounds of the formField
     *
     * @default new Point(0,0)
     */
    @Complex<PdfBoundsModel>({ x: 0, y: 0 }, PdfBounds)
    public bounds: PdfBoundsModel;

    /**
     * Represents the cloud intensity
     *
     * @default 0
     */
    @Property(0)
    public pageIndex: number;

    /**
     * Represents the page number
     *
     * @default 1
     */
    @Property(1)
    public pageNumber: number;

    /**
     * Represents the cloud intensity
     *
     * @default -1
     */

    @Property(-1)
    public zIndex: number;

    /**
     * Represents the cloud intensity
     *
     * @default null
     */
    @Property(null)
    public wrapper: Container;

    /**
     * Represents the font size of the formField content
     *
     * @default 16
     */
    @Property(16)
    public fontSize: number;

    /**
     * Represents the font family of the formField content
     *
     * @default 'Helvetica'
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Represents the font style of the formField content
     *
     * @default 'None'
     */
    @Property('None')
    public fontStyle: string;

    /**
     * Represents the text anlignment style of formField
     *
     * @default 'left'
     */
    @Property('left')
    public alignment: string;

    /**
     * specifies the minHeight of the formField.
     *
     * @default 0
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the formField.
     *
     * @default 0
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the formField.
     *
     * @default 0
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the formField.
     *
     * @default 0
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the maxLength of the textbox/password.
     *
     * @default 0
     */
    @Property(0)
    public maxLength: number;

    /**
     * If it is set as Hidden, Html element will be hide in the UI. By default it is visible.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * specifies whether the form field are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;

    /**
     * Allows to edit the form Field text.
     */
    @Property(false)
    public isReadonly: boolean;

    /**
     * Enable or disable the checkbox state.
     */
    @Property(false)
    public isChecked: boolean;

    /**
     * Enable or disable the RadioButton state.
     */
    @Property(false)
    public isSelected: boolean;

    /**
     * Specified whether an form field element is mandatory.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Gets or sets the items to be displayed for drop down/ listbox.
     */
    @Property('')
    public options: ItemModel[];

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    @Property()
    public signatureIndicatorSettings: SignatureIndicatorSettingsModel;

    /**
     * Represents the text style of annotation
     *
     * @default ''
     */
    @Complex<PdfFontModel>({ isBold: false, isItalic: false, isStrikeout: false, isUnderline: false }, PdfFont)
    public font: PdfFontModel;

    /**
     * Gets or sets the items selected in the drop down/ listbox.
     */
    @Property()
    public selectedIndex: number[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
}

/**
 * @hidden
 */
export class ZOrderPageTable {

    private pageIdTemp: number = 0;

    /**
     * @private
     * @returns {number} - Returns the page Id.
     */
    public get pageId(): number {
        return this.pageIdTemp;
    }

    /**
     * @private
     * @param {number} offset - The page offset value.
     */
    public set pageId(offset: number) {
        this.pageIdTemp = offset;
    }

    private zIndexTemp: number = -1;

    /**
     * @private
     * @returns {number} - Returns the z-index value.
     */
    public get zIndex(): number {
        return this.zIndexTemp;
    }

    /**
     * @private
     * @param {number} offset - The page offset value.
     */
    public set zIndex(offset: number) {
        this.zIndexTemp = offset;
    }

    private childNodesTemp: PdfAnnotationBaseModel[] = [];

    /**
     * @private
     * @returns {PdfAnnotationBaseModel[]} - Returns the annotation childNodes.
     */
    public get objects(): PdfAnnotationBaseModel[] {
        return this.childNodesTemp;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel[]} childNodes - Specified the annotation child nodes.
     */
    public set objects(childNodes: PdfAnnotationBaseModel[]) {
        this.childNodesTemp = childNodes;

    }

    constructor() {
        this.objects = [];
        this.zIndexTemp = -1;
        this.pageIdTemp = 0;
    }
}
