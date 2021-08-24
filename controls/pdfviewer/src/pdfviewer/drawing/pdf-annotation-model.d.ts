import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { PointModel, DecoratorShapes } from '@syncfusion/ej2-drawings';import { Point } from '@syncfusion/ej2-drawings';import { Size } from '@syncfusion/ej2-drawings';import { Container } from '@syncfusion/ej2-drawings';import { PdfAnnotationType, FormFieldAnnotationType } from './enum';import { ICommentsCollection, IReviewCollection, AnnotationSelectorSettingsModel, AllowedInteraction, ItemModel, SignatureIndicatorSettingsModel } from '../index';

/**
 * Interface for a class PdfBounds
 */
export interface PdfBoundsModel {

    /**
     * Represents the the x value of the annotation.
     *
     * @default 0
     */
    x?: number;

    /**
     * Represents the the y value of the annotation.
     *
     * @default 0
     */
    y?: number;

    /**
     * Represents the the width value of the annotation.
     *
     * @default 0
     */
    width?: number;

    /**
     * Represents the the height value of the annotation.
     *
     * @default 0
     */
    height?: number;

    /**
     * Represents the the left value of the annotation.
     *
     * @default 0
     */
    left?: number;

    /**
     * Represents the the top value of the annotation.
     *
     * @default 0
     */
    top?: number;

    /**
     * Represents the the right value of the annotation.
     *
     * @default 0
     */
    right?: number;

    /**
     * Represents the the bottom value of the annotation.
     *
     * @default 0
     */
    bottom?: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     *
     * @default new Point(0,0)
     */
    location?: PointModel;

    /**
     * Sets the size of the annotation
     *
     * @default new Size(0, 0)
     */
    size?: Size;

}

/**
 * Interface for a class PdfFont
 */
export interface PdfFontModel {

    /**
     * Represents the the font Bold style of annotation text content.
     *
     * @default 'false'
     */
    isBold?: boolean;

    /**
     * Represents the the font Italic style of annotation text content.
     *
     * @default 'false'
     */
    isItalic?: boolean;

    /**
     * Represents the the font Underline style of annotation text content.
     *
     * @default 'false'
     */
    isUnderline?: boolean;

    /**
     * Represents the the font Strikeout style of annotation text content.
     *
     * @default 'false'
     */
    isStrikeout?: boolean;

}

/**
 * Interface for a class PdfAnnotationBase
 */
export interface PdfAnnotationBaseModel {

    /**
     * Represents the unique id of annotation
     *
     * @default ''
     */
    id?: string;

    /**
     * Represents the annotation type of the pdf
     *
     * @default 'Rectangle'
     */
    shapeAnnotationType?: PdfAnnotationType;

    /**
     * Represents the annotation type of the form field
     *
     * @default ''
     */
    formFieldAnnotationType?: FormFieldAnnotationType;

    /**
     * Represents the measure type of the annotation
     *
     * @default ''
     */
    measureType?: string;

    /**
     * Represents the auther value of the annotation
     *
     * @default ''
     */
    author?: string;

    /**
     * Represents the modified date of the annotation
     *
     * @default ''
     */
    modifiedDate?: string;

    /**
     * Represents the subject of the annotation
     *
     * @default ''
     */
    subject?: string;

    /**
     * Represents the notes of the annotation
     *
     * @default ''
     */
    notes?: string;

    /**
     * specifies the locked action of the comment
     *
     * @default 'false'
     */
    isCommentLock?: boolean;

    /**
     * Represents the stroke color of the annotation
     *
     * @default 'black'
     */
    strokeColor?: string;

    /**
     * Represents the fill color of the annotation
     *
     * @default 'tranparent'
     */
    fillColor?: string;

    /**
     * Represents the fill color of the annotation
     *
     * @default 'tranparent'
     */
    stampFillColor?: string;

    /**
     * Represents the stroke color of the annotation
     *
     * @default 'black'
     */
    stampStrokeColor?: string;

    /**
     * Represents the path data of the annotation
     *
     * @default ''
     */
    data?: string;

    /**
     * Represents the opecity value of the annotation
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Represents the thickness value of annotation
     *
     * @default 1
     */
    thickness?: number;

    /**
     * Represents the border style of annotation
     *
     * @default ''
     */
    borderStyle?: string;

    /**
     * Represents the border dash array of annotation
     *
     * @default ''
     */
    borderDashArray?: string;

    /**
     * Represents the rotate angle of annotation
     *
     * @default 0
     */
    rotateAngle?: number;

    /**
     * Represents the annotation as cloud shape
     *
     * @default false
     */
    isCloudShape?: boolean;

    /**
     * Represents the cloud intensity
     *
     * @default 0
     */
    cloudIntensity?: number;

    /**
     * Represents the height of the leader of distance shapes
     *
     * @default 40
     */
    leaderHeight?: number;

    /**
     * Represents the line start shape style
     *
     * @default null
     */
    lineHeadStart?: string;

    /**
     * Represents the line end shape style
     *
     * @default null
     */
    lineHeadEnd?: string;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default []
     */
    vertexPoints?: PointModel[];

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default null
     */
    sourcePoint?: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default None
     */
    sourceDecoraterShapes?: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default None
     */
    taregetDecoraterShapes?: DecoratorShapes;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default null
     */
    targetPoint?: PointModel;

    /**
     * Represents vertex points in the line annotation or shape annotation.
     *
     * @default []
     */
    segments?: PointModel[];

    /**
     * Represents bounds of the annotation
     *
     * @default new Point(0,0)
     */
    bounds?: PdfBoundsModel;

    /**
     * Represents the cloud intensity
     *
     * @default 0
     */
    pageIndex?: number;

    /**
     * Represents the cloud intensity
     *
     * @default -1
     */

    zIndex?: number;

    /**
     * Represents the cloud intensity
     *
     * @default null
     */
    wrapper?: Container;

    /**
     * Represents the dynamic stamp
     *
     * @default false
     */
    isDynamicStamp?: boolean;

    /**
     * Represents the dynamic text.
     *
     * @default ''
     */
    dynamicText?: string;

    /**
     * Represents the unique annotName of the annotation
     *
     * @default ''
     */
    annotName?: string;

    /**
     * Represents the review collection of the annotation
     *
     * @default ''
     */
    review?: IReviewCollection;

    /**
     * Represents the comments collection of the annotation
     *
     * @default []
     */
    comments?: ICommentsCollection[];

    /**
     * Represents the comments collection of the annotation
     *
     * @default '#000'
     */
    fontColor?: string;

    /**
     * Represents the font size of the annotation content
     *
     * @default '16'
     */
    fontSize?: number;

    /**
     * Represents the font family of the annotation content
     *
     * @default 'Helvetica'
     */
    fontFamily?: string;

    /**
     * Represents the font style of the annotation content
     *
     * @default 'None'
     */
    fontStyle?: string;

    /**
     * Represents the shape annotation label add flag
     *
     * @default 'false'
     */
    enableShapeLabel?: boolean;

    /**
     * Represents the shape annotation label content
     *
     * @default 'label'
     */
    labelContent?: string;

    /**
     * Represents the shape annotation label content fill color
     *
     * @default '#ffffff00'
     */
    labelFillColor?: string;

    /**
     * Represents the shape annotation label content max-length
     *
     * @default '15'
     */
    labelMaxLength?: number;

    /**
     * Represents the opecity value of the annotation
     *
     * @default 1
     */
    labelOpacity?: number;

    /**
     * Represents the selection settings of the annotation
     *
     * @default ''
     */
    annotationSelectorSettings?: AnnotationSelectorSettingsModel;

    /**
     * Represents the shape annotation label content border color
     *
     * @default '#ffffff00'
     */
    labelBorderColor?: string;

    /**
     * Represents the text anlignment style of annotation
     *
     * @default 'left'
     */
    textAlign?: string;

    /**
     * Represents the unique Name of the annotation
     *
     * @default ''
     */
    signatureName?: string;

    /**
     * specifies the minHeight of the annotation.
     *
     * @default 0
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the annotation.
     *
     * @default 0
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the annotation.
     *
     * @default 0
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the annotation.
     *
     * @default 0
     */
    maxWidth?: number;

    /**
     * specifies the locked action of the annotation.
     *
     * @default 'false'
     */
    isLock?: boolean;

    /**
     * specifies the particular annotation mode.
     *
     * @default 'UI Drawn Annotation'
     */
    annotationAddMode?: string;

    /**
     * specifies the default settings of the annotation.
     *
     * @default ''
     */
    annotationSettings?: object;

    /**
     * specifies the previous font size  of the annotation.
     *
     * @default '16'
     */
    previousFontSize?: number;

    /**
     * Represents the text style of annotation
     *
     * @default ''
     */
    font?: PdfFontModel;

    /**
     * Represents the shape annotation label content bounds
     *
     * @default ''
     */
    labelBounds?: PdfBoundsModel;

    /**
     * specifies the custom data of the annotation.
     */
    customData?: object;

    /**
     * specifies the allowed interactions of the locked annotation.
     */
    allowedInteractions?: AllowedInteraction;

    /**
     * specifies whether the annotations are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * Allows to edit the free text annotation
     */
    isReadonly?: boolean;

}

/**
 * Interface for a class PdfFormFieldBase
 */
export interface PdfFormFieldBaseModel {

    /**
     * Represents the unique id of formField
     *
     * @default ''
     */
    id?: string;

    /**
     * specifies the type of the signature.
     */
    signatureType?: string;

    /**
     * Represents the name of the formField
     *
     * @default ''
     */
    name?: string;

    /**
     * Represents the value of the formField
     *
     * @default ''
     */
    value?: string;

    /**
     * Represents the annotation type of the form field
     *
     * @default ''
     */
    formFieldAnnotationType?: FormFieldAnnotationType;

    /**
     * Represents the fill color of the form field
     *
     * @default '#daeaf7ff'
     */
    backgroundColor?: string;

    /**
     * Represents the text color of the form field
     *
     * @default 'black'
     */
    color?: string;

    /**
     * Represents the border color of the form field
     *
     * @default '#303030'
     */
    borderColor?: string;

    /**
     * Represents the tooltip of the form field
     *
     * @default ''
     */
    tooltip?: string;

    /**
     * Represents the opecity value of the formField
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Represents the thickness value of FormField
     *
     * @default 1
     */
    thickness?: number;

    /**
     * Represents the rotate angle of formField
     *
     * @default 0
     */
    rotateAngle?: number;

    /**
     * Represents bounds of the formField
     *
     * @default new Point(0,0)
     */
    bounds?: PdfBoundsModel;

    /**
     * Represents the cloud intensity
     *
     * @default 0
     */
    pageIndex?: number;

    /**
     * Represents the page number
     *
     * @default 1
     */
    pageNumber?: number;

    /**
     * Represents the cloud intensity
     *
     * @default -1
     */

    zIndex?: number;

    /**
     * Represents the cloud intensity
     *
     * @default null
     */
    wrapper?: Container;

    /**
     * Represents the font size of the formField content
     *
     * @default 16
     */
    fontSize?: number;

    /**
     * Represents the font family of the formField content
     *
     * @default 'Helvetica'
     */
    fontFamily?: string;

    /**
     * Represents the font style of the formField content
     *
     * @default 'None'
     */
    fontStyle?: string;

    /**
     * Represents the text anlignment style of formField
     *
     * @default 'left'
     */
    alignment?: string;

    /**
     * specifies the minHeight of the formField.
     *
     * @default 0
     */
    minHeight?: number;

    /**
     * specifies the minWidth of the formField.
     *
     * @default 0
     */
    minWidth?: number;

    /**
     * specifies the minHeight of the formField.
     *
     * @default 0
     */
    maxHeight?: number;

    /**
     * specifies the maxWidth of the formField.
     *
     * @default 0
     */
    maxWidth?: number;

    /**
     * specifies the maxLength of the textbox/password.
     *
     * @default 0
     */
    maxLength?: number;

    /**
     * If it is set as Hidden, Html element will be hide in the UI. By default it is visible.
     */
    visibility?: VisibilityState;

    /**
     * specifies whether the form field are included or not in print actions.
     */
    isPrint?: boolean;

    /**
     * Allows to edit the form Field text.
     */
    isReadonly?: boolean;

    /**
     * Enable or disable the checkbox state.
     */
    isChecked?: boolean;

    /**
     * Enable or disable the RadioButton state.
     */
    isSelected?: boolean;

    /**
     * Specified whether an form field element is mandatory.
     */
    isRequired?: boolean;

    /**
     * Enable or disable the Multiline Textbox.
     */
    isMultiline?: boolean;

    /**
     * Gets or sets the items to be displayed for drop down/ listbox.
     */
    options?: ItemModel[];

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    signatureIndicatorSettings?: SignatureIndicatorSettingsModel;

    /**
     * Represents the text style of annotation
     *
     * @default ''
     */
    font?: PdfFontModel;

    /**
     * Gets or sets the items selected in the drop down/ listbox.
     */
    selectedIndex?: number[];

}

/**
 * Interface for a class ZOrderPageTable
 */
export interface ZOrderPageTableModel {

}