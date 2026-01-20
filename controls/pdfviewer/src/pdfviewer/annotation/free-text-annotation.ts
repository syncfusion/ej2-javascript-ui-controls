import { FontStyle } from './../base/types';
import { FreeTextSettings } from './../pdfviewer';
import {
    PdfViewer, PdfViewerBase, IPageAnnotations, IPoint, AnnotationType as AnnotType, ICommentsCollection,
    IReviewCollection, AllowedInteraction, ISize, AnnotationsInternal, AnnotationBaseSettings,
    AnnotBoundsRect, AnnotationsBase, AnnotBoundsBase, IRect, IBounds,
    IAnnotation
} from '../index';
import { Browser, isBlazor, isNullOrUndefined, SanitizeHtmlHelper  } from '@syncfusion/ej2-base';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { PdfAnnotationBaseModel, PdfFontModel } from '../drawing/pdf-annotation-model';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';

/**
 * @hidden
 */
export interface IFreeTextAnnotation extends IAnnotation {
    bounds: any;
    thickness: number
    borderStyle?: string
    borderDashArray?: number
    rotateAngle: number
    isLocked?: boolean
    id: string
    position?: string
    dynamicText: string
    fontColor: string
    fontSize: number
    fontFamily: string
    textAlign: string
    font: any;
    isReadonly: boolean
    allowedInteractions?: AllowedInteraction[]
    pageIndex: number
    customData: object
    isPrint: boolean
    pageRotation?: number
    notes?: string
    annotationAddMode?: string
    isAddAnnotationProgrammatically?: boolean
    isTransparentSet?: boolean
    previousFontSize?: number
}

/**
 * @hidden
 */
export class FreeTextAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public currentAnnotationMode: string;
    /**
     * @private
     */
    public opacity: number;
    /**
     * @private
     */
    public borderColor: string;
    /**
     * @private
     */
    public borderWidth: number;
    /**
     * @private
     */
    public defautWidth: number;
    /**
     * @private
     */
    public defaultHeight: number;
    /**
     * @private
     */
    public inputBoxElement: any;
    /**
     * @private
     */
    public borderStyle: string;
    /**
     * @private
     */
    public author: string;
    /**
     * @private
     */
    public subject: string;
    /**
     * @private
     */
    public isNewFreeTextAnnot: boolean;
    /**
     * @private
     */
    public isNewAddedAnnot: boolean;
    /**
     * @private
     */
    public inputBoxCount: number = 0;
    /**
     * @private
     */
    public selectedAnnotation: PdfAnnotationBaseModel;
    /**
     * @private
     */
    public isFreeTextValueChange: boolean = false;
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;
    /**
     * @private
     */
    public isInuptBoxInFocus: boolean = false;
    /**
     * @private
     */
    public fontSize: number;
    /**
     * @private
     */
    public annodationIntent: string;
    /**
     * @private
     */
    public annotationFlags: string;
    /**
     * @private
     */
    public fillColor: string;
    /**
     * @private
     */
    public fontColor: string;
    /**
     * @private
     */
    public fontFamily: string;
    /**
     * @private
     */
    public freeTextPageNumbers: any = [];
    /**
     * @private
     */
    public selectedText: string = '';
    /**
     * @private
     */
    public isTextSelected: boolean = false;
    private selectionStart: number = 0;
    private selectionEnd: number = 0;
    /**
     * @private
     */
    public isBold: boolean = false;
    /**
     * @private
     */
    public isItalic: boolean = false;
    /**
     * @private
     */
    public isUnderline: boolean = false;
    /**
     * @private
     */
    public isStrikethrough: boolean = false;
    /**
     * @private
     */
    public textAlign: string;
    private defaultText: string;
    private isReadonly: boolean = false;
    private isMaximumWidthReached: boolean = false;
    private padding: string;
    private wordBreak: string;
    private freeTextPaddingLeft: number = 4;
    private freeTextPaddingTop: number = 5;
    private defaultFontSize: number = 16;
    private inputBoxValue: string;
    private freetextHeight: number = 0;
    private freetextWidth: number = 0;
    private inputBoxHeight: any = 0;
    private inputBoxWidth: any = 0;
    private wrapperOffsetX: number = 0;
    private wrapperOffsetY: number = 0;
    private prevFontsize: number = 16;
    private lineGap: number = 1.8;
    private initialStrokeWidth: number = 0;
    private initialStrokeThickness: number = 0;
    /**
     * @private
     */
    public previousText: string = 'Type Here';
    /**
     * @private
     */
    public currentPosition: any = [];

    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.updateTextProperties();
        this.inputBoxElement = document.createElement('textarea');
        this.inputBoxElement.style.position = 'absolute';
        this.inputBoxElement.style.Width = this.defautWidth;
        this.inputBoxElement.style.Height = this.defaultHeight;
        this.inputBoxElement.style.zIndex = '5';
        this.inputBoxElement.style.fontSize = this.fontSize + 'px';
        this.inputBoxElement.className = 'free-text-input';
        this.inputBoxElement.style.resize = 'none';
        this.inputBoxElement.style.borderColor = this.borderColor;
        this.inputBoxElement.style.background = this.fillColor;
        this.inputBoxElement.style.borderStyle = this.borderStyle;
        this.inputBoxElement.style.borderWidth = this.borderWidth + 'px';
        this.inputBoxElement.style.padding = this.padding;
        this.inputBoxElement.style.paddingLeft = this.freeTextPaddingLeft + 'px';
        this.inputBoxElement.style.paddingTop = this.freeTextPaddingTop * (parseFloat(this.inputBoxElement.style.fontSize) / this.defaultFontSize) + 'px';
        this.inputBoxElement.style.borderRadius = '2px';
        this.inputBoxElement.style.verticalAlign = 'middle';
        this.inputBoxElement.style.fontFamily = this.fontFamily;
        this.inputBoxElement.style.color = this.pdfViewer.freeTextSettings.fontColor ?
            this.pdfViewer.freeTextSettings.fontColor : '#000';
        this.inputBoxElement.style.overflow = 'hidden';
        this.inputBoxElement.style.wordBreak = this.wordBreak;
        this.inputBoxElement.readOnly = this.isReadonly;
        this.inputBoxElement.addEventListener('focusout', this.onFocusOutInputBox.bind(this));
        this.inputBoxElement.addEventListener('keydown', this.onKeyDownInputBox.bind(this));
        this.inputBoxElement.addEventListener('mouseup', this.onMouseUpInputBox.bind(this));
        this.freeTextPageNumbers = [];
    }

    /**
     * @private
     * @returns {void}
     */
    public updateTextProperties(): void {
        this.defautWidth = this.pdfViewer.freeTextSettings.width ? this.pdfViewer.freeTextSettings.width : 151;
        this.defaultHeight = this.pdfViewer.freeTextSettings.height ? this.pdfViewer.freeTextSettings.height : 24.6;
        this.borderColor = this.pdfViewer.freeTextSettings.borderColor ? this.pdfViewer.freeTextSettings.borderColor : '#ffffff00';
        this.fillColor = this.pdfViewer.freeTextSettings.fillColor ? this.pdfViewer.freeTextSettings.fillColor : '#fff';
        this.borderStyle = this.pdfViewer.freeTextSettings.borderStyle ? this.pdfViewer.freeTextSettings.borderStyle : 'solid';
        this.borderWidth = !isNullOrUndefined(this.pdfViewer.freeTextSettings.borderWidth) ?
            this.pdfViewer.freeTextSettings.borderWidth : 0;
        this.fontSize = this.pdfViewer.freeTextSettings.fontSize ? this.pdfViewer.freeTextSettings.fontSize : 16;
        this.opacity = this.pdfViewer.freeTextSettings.opacity ? this.pdfViewer.freeTextSettings.opacity : 1;
        this.fontColor = this.pdfViewer.freeTextSettings.fontColor ? this.pdfViewer.freeTextSettings.fontColor : '#000';
        this.author = (this.pdfViewer.freeTextSettings.author && this.pdfViewer.freeTextSettings.author !== 'Guest') ? this.pdfViewer.freeTextSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
        if (!isNullOrUndefined(this.pdfViewer.annotationModule)) {
            if (this.getRgbCode(this.borderColor).a === 0) {
                this.borderWidth = 0;
            }
        }
        if (this.pdfViewer.freeTextSettings.fontFamily) {
            const fontName: string = this.pdfViewer.freeTextSettings.fontFamily;
            if (fontName === 'Helvetica' || fontName === 'Times New Roman' || fontName === 'Courier' || fontName === 'Symbol' || fontName === 'ZapfDingbats') {
                this.fontFamily = fontName;
            }
            else {
                this.fontFamily = 'Helvetica';
            }
        } else {
            this.fontFamily = 'Helvetica';
        }
        this.textAlign = this.pdfViewer.freeTextSettings.textAlignment ? this.pdfViewer.freeTextSettings.textAlignment : 'Left';
        this.defaultText = this.pdfViewer.freeTextSettings.defaultText ? this.pdfViewer.freeTextSettings.defaultText : 'Type here';
        this.isReadonly = false;
        if (this.pdfViewer.freeTextSettings.enableAutoFit) {
            this.wordBreak = 'break-all';
            this.padding = '2px';
        } else {
            this.padding = '0px';
            this.wordBreak = 'break-word';
        }
        if (this.pdfViewer.freeTextSettings.isLock || this.pdfViewer.annotationSettings.isLock
             || this.pdfViewer.freeTextSettings.isReadonly) {
            this.isReadonly = true;
        }
        this.isBold = (this.pdfViewer.freeTextSettings.fontStyle & FontStyle.Bold) === FontStyle.Bold;
        this.isItalic = (this.pdfViewer.freeTextSettings.fontStyle & FontStyle.Italic) === FontStyle.Italic;
        this.isUnderline = (this.pdfViewer.freeTextSettings.fontStyle & FontStyle.Underline) === FontStyle.Underline;
        this.isStrikethrough = (this.pdfViewer.freeTextSettings.fontStyle & FontStyle.Strikethrough) === FontStyle.Strikethrough;
    }

    /**
     * @param {any} shapeAnnotations - It describes about the shape annotations
     * @param {number} pageNumber - It describes about the page number value
     * @param {boolean} isImportAction - It ensures whether the isImportAction is true or not
     * @param {boolean} isAnnotOrderAction - It ensures whether the isAnnotOrderAction is true or not
     * @param {boolean} isLastAnnot - It ensures whether the isLastAnnot is true or not
     * @private
     * @returns {void}
     */
    public renderFreeTextAnnotations(shapeAnnotations: any, pageNumber: number,
                                     isImportAction?: boolean, isAnnotOrderAction?: boolean, isLastAnnot?: boolean): void {
        let isFreeTextAdded: boolean = false;
        if (!isImportAction) {
            for (let p: number = 0; p < this.freeTextPageNumbers.length; p++) {
                if (this.freeTextPageNumbers[parseInt(p.toString(), 10)] === pageNumber) {
                    isFreeTextAdded = true;
                    break;
                }
            }
        }
        if  (shapeAnnotations && (!isFreeTextAdded || isAnnotOrderAction)) {
            if (shapeAnnotations.length >= 1) {
                this.freeTextPageNumbers.push(pageNumber);
                for (let i: number = 0; i < shapeAnnotations.length; i++) {
                    const annotation: any = shapeAnnotations[parseInt(i.toString(), 10)];
                    annotation.annotationAddMode = this.pdfViewer.annotationModule.
                        findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                    if (annotation.AnnotType) {
                        let vertexPoints: IPoint[] = null;
                        if (annotation.VertexPoints) {
                            vertexPoints = [];
                            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                                const point: IPoint = { x: annotation.VertexPoints[parseInt(j.toString(), 10)].X,
                                    y: annotation.VertexPoints[parseInt(j.toString(), 10)].Y };
                                vertexPoints.push(point);
                            }
                        }
                        annotation.AnnotationSettings = annotation.AnnotationSettings ?
                            annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
                        if (annotation.IsLocked) {
                            annotation.AnnotationSettings.isLock = annotation.IsLocked;
                        }
                        let paddingValue: number;
                        if (annotation.AnnotationIntent && annotation.AnnotationIntent === 'None') {
                            paddingValue = 0.5;
                        } else {
                            paddingValue = 0;
                        }
                        let annotationBoundsX: number = !isNullOrUndefined((annotation.Bounds as AnnotBoundsBase).X) ?
                            (annotation.Bounds as AnnotBoundsBase).X - paddingValue : (annotation.Bounds as IRect).x;
                        let annotationBoundsY: number = !isNullOrUndefined((annotation.Bounds as AnnotBoundsBase).Y) ?
                            (annotation.Bounds as AnnotBoundsBase).Y - paddingValue : (annotation.Bounds as IRect).y;
                        let width: number = (annotation.Bounds as AnnotBoundsBase).Width ?
                            (annotation.Bounds as AnnotBoundsBase).Width : (annotation.Bounds as IRect).width;
                        let height: number = (annotation.Bounds as AnnotBoundsBase).Height ?
                            (annotation.Bounds as AnnotBoundsBase).Height : (annotation.Bounds as IRect).height;
                        const isAddedProgramatically: boolean = annotation.isAddAnnotationProgramatically ?
                            annotation.isAddAnnotationProgramatically : false;
                        const rotateValue: number = this.getRotationValue(pageNumber, isAddedProgramatically);
                        const pageRotate:  number = annotation.PageRotation;
                        if (Math.sign(annotation.Rotate) === 1) {
                            annotation.Rotate = -annotation.Rotate + rotateValue;
                        } else {
                            annotation.Rotate = annotation.Rotate + rotateValue;
                        }
                        let rotateAngle: number = Math.abs(annotation.Rotate);
                        if (isImportAction && rotateValue !== pageRotate) {
                            if (this.pdfViewerBase.isJsonImported) {
                                const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)];
                                let boundsX: number = (annotation.Bounds as AnnotBoundsBase).X;
                                let boundsY: number = (annotation.Bounds as AnnotBoundsBase).Y;
                                let annotationWidth: number = width;
                                let annotationHeight: number = height;
                                if (pageRotate > 0) {
                                    const rotatation: number = pageRotate / 90;
                                    if (rotatation === 1) {
                                        height = width;
                                        width = (annotation.Bounds as AnnotBoundsBase).Height;
                                        annotationBoundsX = (annotation.Bounds as AnnotBoundsBase).Y;
                                        if (rotateValue !== 270) {
                                            annotationBoundsY = pageDetails.height - (annotation.Bounds as AnnotBoundsBase).X -
                                            (annotation.Bounds as AnnotBoundsBase).Width;
                                        }
                                        else {
                                            annotationBoundsY = pageDetails.width - (annotation.Bounds as AnnotBoundsBase).X -
                                            (annotation.Bounds as AnnotBoundsBase).Width;
                                        }
                                    }
                                    else if (rotatation === 2) {
                                        if (rotateValue !== 270 && rotateValue !== 90) {
                                            annotationBoundsX = pageDetails.width - (annotation.Bounds as AnnotBoundsBase).X -
                                            (annotation.Bounds as AnnotBoundsBase).Width;
                                            annotationBoundsY = pageDetails.height - (annotation.Bounds as AnnotBoundsBase).Y -
                                            (annotation.Bounds as AnnotBoundsBase).Height;
                                        }
                                        else {
                                            annotationBoundsX = pageDetails.height - (annotation.Bounds as AnnotBoundsBase).X -
                                            (annotation.Bounds as AnnotBoundsBase).Width;
                                            annotationBoundsY = pageDetails.width - (annotation.Bounds as AnnotBoundsBase).Y -
                                            (annotation.Bounds as AnnotBoundsBase).Height;
                                        }
                                    }
                                    else if (rotatation === 3) {
                                        height = width;
                                        width = (annotation.Bounds as AnnotBoundsBase).Height;
                                        if (rotateValue !== 90) {
                                            annotationBoundsX = pageDetails.width - (annotation.Bounds as AnnotBoundsBase).Y - width;
                                        }
                                        else {
                                            annotationBoundsX = pageDetails.height - (annotation.Bounds as AnnotBoundsBase).Y - width;
                                        }
                                        annotationBoundsY = (annotation.Bounds as AnnotBoundsBase).X;
                                    }
                                    boundsX = annotationBoundsX;
                                    boundsY = annotationBoundsY;
                                    annotationWidth = width;
                                    annotationHeight = height;
                                }
                                rotateAngle = (rotateValue / 90) % 4;
                                if (rotateAngle === 1) {
                                    height = width;
                                    width = annotationHeight;
                                    annotationBoundsX = pageDetails.width - boundsY - annotationHeight - paddingValue;
                                    annotationBoundsY = boundsX - paddingValue;
                                    rotateAngle = 90;
                                }
                                else if (rotateAngle === 2) {
                                    annotationBoundsX = pageDetails.width - boundsX - annotationWidth - paddingValue;
                                    annotationBoundsY = pageDetails.height - boundsY - annotationHeight - paddingValue;
                                    rotateAngle = 180;
                                }
                                else if (rotateAngle === 3) {
                                    height = width;
                                    width = annotationHeight;
                                    annotationBoundsX = boundsY - paddingValue;
                                    annotationBoundsY = pageDetails.height - boundsX - height - paddingValue;
                                    rotateAngle = 270;
                                }
                                else if (rotateAngle === 0) {
                                    annotationBoundsX = boundsX - paddingValue;
                                    annotationBoundsY = boundsY - paddingValue;
                                }
                            }
                        }
                        if (rotateAngle === 90 || rotateAngle === 270) {
                            const rotationHeight: number = height;
                            const rotationWidth: number = width;
                            height = rotationWidth;
                            width = rotationHeight;
                            annotationBoundsX = (annotationBoundsX - (width / 2)) + (height / 2);
                            annotationBoundsY = (annotationBoundsY) + (width / 2 - height / 2);
                        }
                        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions :
                            this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation) as AllowedInteraction[];
                        if (!isNullOrUndefined(annotation) && annotation.MarkupText && annotation.MarkupText.includes('\n')) {
                            const noOfLines: number = annotation.MarkupText.split('\n').length;
                            const newHeight: number = noOfLines * annotation.FontSize * this.lineGap;
                            const pageHeight: number  = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].height
                             - (annotation.Bounds as AnnotBoundsBase).Y;
                            if (height < newHeight) {
                                height = newHeight;
                            }
                            if (height > pageHeight) {
                                height = pageHeight;
                            }
                        }
                        const annot: PdfAnnotationBaseModel = {
                            author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext' + this.inputBoxCount,
                            rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                            thickness: annotation.Thickness, fillColor: annotation.FillColor,
                            bounds: {
                                x: annotationBoundsX, y: annotationBoundsY, left: annotationBoundsX, top: annotationBoundsY,
                                width: width, height: height, right: (annotation.Bounds as IBounds).Right,
                                bottom: (annotation.Bounds as IBounds).Bottom
                            }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                            pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor,
                            fontSize: annotation.FontSize, pageRotation: rotateValue,
                            fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments,
                                                                                            annotation, annotation.Author),
                            review: { state: annotation.State, stateModel: annotation.StateModel,
                                modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                            font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic,
                                isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                            annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                            customData: this.pdfViewer.annotation.getCustomData(annotation),
                            annotationAddMode: annotation.annotationAddMode, allowedInteractions: annotation.allowedInteractions,
                            isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock, isReadonly: annotation.IsReadonly,
                            isAddAnnotationProgrammatically: isAddedProgramatically, isTransparentSet: annotation.IsTransparentSet
                        };
                        const annotObject: IFreeTextAnnotation = {
                            author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext' + this.inputBoxCount,
                            rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                            thickness: annotation.Thickness, fillColor: annotation.FillColor,
                            bounds: {
                                x: annotationBoundsX, y: annotationBoundsY, left: annotationBoundsX, top: annotationBoundsY,
                                width: width, height: height, right: (annotation.Bounds as IBounds).Right,
                                bottom: (annotation.Bounds as IBounds).Bottom
                            }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                            pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor,
                            fontSize: annotation.FontSize, pageRotation: rotateValue,
                            fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments,
                                                                                            annotation, annotation.Author),
                            review: { state: annotation.State, stateModel: annotation.StateModel,
                                modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                            font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic,
                                isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                            annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                            customData: this.pdfViewer.annotation.getCustomData(annotation),
                            annotationAddMode: annotation.annotationAddMode, allowedInteractions: annotation.allowedInteractions,
                            isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock, isReadonly: annotation.IsReadonly,
                            isAddAnnotationProgrammatically: isAddedProgramatically, isTransparentSet: annotation.IsTransparentSet
                        };
                        if (isImportAction) {
                            annot.id = annotation.AnnotName;
                            annot.previousFontSize = annotation.FontSize ? annotation.FontSize : this.fontSize;
                            annotObject.id = annotation.AnnotName;
                            annotObject.previousFontSize = annotation.FontSize ? annotation.FontSize : this.fontSize;
                        }
                        const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotObject, '_annotations_freetext');
                        if (this.isAddAnnotationProgramatically) {
                            const settings: AnnotationBaseSettings = {
                                opacity: annot.opacity, borderColor: annot.strokeColor, borderWidth: annot.thickness,
                                author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                                fillColor: annot.fillColor, fontSize: annot.fontSize, width: annot.bounds.width,
                                height: annot.bounds.height, fontColor: annot.fontColor, fontFamily: annot.fontFamily,
                                defaultText: annot.dynamicText, fontStyle: annot.font, textAlignment: annot.textAlign
                            };
                            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'FreeText', annot.bounds, settings);
                        }
                        this.inputBoxCount += 1;
                        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                        const isNeedToRender: boolean = ((isImportAction && isLastAnnot) || isNullOrUndefined(isImportAction) ||
                        !isImportAction) ? true : false;
                        if (annotation.AnnotationIntent && annotation.AnnotationIntent !== 'None') {
                            let lineSpace: any = 0;
                            this.inputBoxElement.style.fontSize = (addedAnnot.fontSize * this.pdfViewerBase.getZoomFactor()) + 'px';
                            lineSpace = ((parseFloat(this.inputBoxElement.style.fontSize) / this.pdfViewerBase.getZoomFactor()) /
                                (this.defaultFontSize / 2));
                            this.inputBoxElement.style.paddingTop = ((((parseFloat(this.inputBoxElement.style.fontSize) /
                                Math.max(1, this.pdfViewerBase.getZoomFactor())) / this.defaultFontSize) / Math.max(1, this.pdfViewerBase.getZoomFactor()))) * this.freeTextPaddingTop + 'px';
                            this.inputBoxElement.style.paddingTop = parseFloat(this.inputBoxElement.style.paddingTop) - lineSpace + 'px';
                            addedAnnot.wrapper.children[1].margin.left = this.freeTextPaddingLeft + 1;
                            addedAnnot.wrapper.children[1].margin.top =
                                ((parseFloat(this.inputBoxElement.style.paddingTop) /
                                    Math.max(1, this.pdfViewerBase.getZoomFactor()))) + lineSpace - 1;
                        }
                        this.pdfViewer.nodePropertyChange(addedAnnot, {}, isNeedToRender);
                        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                    }
                }
            }
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @private
     * @returns {AnnotationSelectorSettingsModel} - AnnotationSelectorSettingsModel
     */
    public getSettings(annotation: AnnotationsBase): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = typeof(annotation.AnnotationSelectorSettings) === 'string' ? JSON.parse(annotation.AnnotationSelectorSettings) : annotation.AnnotationSelectorSettings;
        } else if (this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.freeTextSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(selector);
        }
        return selector;
    }

    /**
     * @param {AnnotType} type - Annotation type
     * @private
     * @returns {void}
     */
    public setAnnotationType(type: AnnotType): void {
        this.pdfViewerBase.disableTextSelectionMode();
        this.pdfViewer.annotationModule.isFormFieldShape = false;
        switch (type) {
        case 'FreeText': {
            this.currentAnnotationMode = 'FreeText';
            this.updateTextProperties();
            const modifiedDateRect: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'FreeText', strokeColor: this.borderColor,
                fillColor: this.fillColor, opacity: this.opacity, notes: '', isCommentLock: false,
                thickness: this.borderWidth, borderDashArray: '0', modifiedDate: modifiedDateRect,
                author: this.author, subject: this.pdfViewer.freeTextSettings.subject,
                font: {
                    isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough,
                    isUnderline: this.isUnderline
                }, textAlign: this.textAlign
            };
            this.pdfViewer.tool = 'Select';
            break;
        }
        }
    }

    /**
     * @param {string} property - It describes about the property name
     * @param {number} pageNumber - It describes about the page number value
     * @param {any} annotationBase - It describes about the annotation base
     * @param {boolean} isNewAdded - It describes about whether the isNewAdded is true or not
     * @private
     * @returns {IFreeTextAnnotation} - Ifreetextannotation
     */
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any, isNewAdded?: boolean): IFreeTextAnnotation {
        if (!isNullOrUndefined(annotationBase.formFieldAnnotationType) && annotationBase.formFieldAnnotationType !== '') {
            this.pdfViewer.annotationModule.isFormFieldShape = true;
        }
        else {
            this.pdfViewer.annotationModule.isFormFieldShape = false;
        }
        let currentAnnotObject: IFreeTextAnnotation = null;
        let isEdited: boolean = false;
        const pageAnnotations: IFreeTextAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations !== null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[parseInt(i.toString(), 10)].id) {
                    if (property === 'bounds') {
                        this.pdfViewerBase.isBounds =
                        this.pdfViewerBase.boundsCalculation(pageAnnotations[parseInt(i.toString(), 10)].bounds,
                                                             annotationBase.wrapper.bounds);
                        if (this.pdfViewerBase.isBounds) {
                            pageAnnotations[parseInt(i.toString(), 10)].bounds = {
                                left: annotationBase.bounds.x, top: annotationBase.bounds.y,
                                width: annotationBase.bounds.width, height: annotationBase.bounds.height,
                                right: annotationBase.bounds.right,
                                bottom: annotationBase.bounds.bottom
                            };
                        }
                    } else if (property === 'fill') {
                        pageAnnotations[parseInt(i.toString(), 10)].fillColor = annotationBase.wrapper.children[0].style.fill;
                    } else if (property === 'stroke') {
                        pageAnnotations[parseInt(i.toString(), 10)].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[parseInt(i.toString(), 10)].opacity = annotationBase.wrapper.children[0].style.opacity;
                    } else if (property === 'thickness') {
                        pageAnnotations[parseInt(i.toString(), 10)].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                        this.initialStrokeWidth = annotationBase.wrapper.children[0].style.strokeWidth;
                        this.initialStrokeThickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    } else if (property === 'notes') {
                        pageAnnotations[parseInt(i.toString(), 10)].note = annotationBase.notes;
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    } else if (property === 'dynamicText') {
                        if (pageAnnotations[parseInt(i.toString(), 10)].dynamicText !== annotationBase.dynamicText) {
                            isEdited = true;
                            this.pdfViewer.fireCommentEdit(pageAnnotations[parseInt(i.toString(), 10)].annotName,
                                                           annotationBase.dynamicText, pageAnnotations[parseInt(i.toString(), 10)]);
                        }
                        pageAnnotations[parseInt(i.toString(), 10)].dynamicText = annotationBase.dynamicText;
                    } else if (property === 'fontColor') {
                        pageAnnotations[parseInt(i.toString(), 10)].fontColor = annotationBase.fontColor;
                    } else if (property === 'fontSize') {
                        pageAnnotations[parseInt(i.toString(), 10)].fontSize = annotationBase.fontSize;
                    } else if (property === 'fontFamily') {
                        pageAnnotations[parseInt(i.toString(), 10)].fontFamily = annotationBase.fontFamily;
                    } else if (property === 'textPropertiesChange') {
                        pageAnnotations[parseInt(i.toString(), 10)].font = { isBold: annotationBase.font.isBold,
                            isItalic: annotationBase.font.isItalic, isStrikeout: annotationBase.font.isStrikeout,
                            isUnderline: annotationBase.font.isUnderline };
                    } else if (property === 'textAlign') {
                        pageAnnotations[parseInt(i.toString(), 10)].textAlign = annotationBase.textAlign;
                    }
                    if (this.pdfViewerBase.isBounds) {
                        pageAnnotations[parseInt(i.toString(), 10)].modifiedDate =
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    }
                    if (isEdited) {
                        pageAnnotations[parseInt(i.toString(), 10)].author = annotationBase.author;
                        pageAnnotations[parseInt(i.toString(), 10)].modifiedDate =
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)], pageNumber);
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        if (!isNewAdded && isEdited) {
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        return currentAnnotObject;
    }

    /**
     * @param {number} pageNumber - This is pageNumber
     * @param {IFreeTextAnnotation} annotationBase - This is annotationBase
     * @private
     * @returns {void}
     */
    public addInCollection(pageNumber: number, annotationBase: IFreeTextAnnotation): void {
        if (annotationBase) {
            const pageAnnotations: IFreeTextAnnotation[] = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
    }

    /**
     * @private
     * @returns {string} - string
     */
    public saveFreeTextAnnotations(): string {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_freetext');
        const annotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[parseInt(j.toString(), 10)] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(JSON.stringify(storeObject)) as IPageAnnotations[];
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IFreeTextAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[parseInt(z.toString(), 10)]);
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                         this.getBoundsBasedOnRotation(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds,
                                                       pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rotateAngle,
                                                       pageAnnotationObject.pageIndex,
                                                       pageAnnotationObject.annotations[parseInt(z.toString(), 10)]);
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                         JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.
                             annotations[parseInt(z.toString(), 10)].bounds, pageAnnotationObject.pageIndex));
                        const strokeColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor;
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor =
                         JSON.stringify(this.getRgbCode(strokeColorString));
                        let fillColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fillColor;
                        if (typeof fillColorString === 'string' && fillColorString.trim().toLowerCase() === 'transparent') {
                            fillColorString = 'rgba(0,0,0,0)';
                        }
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fillColor =
                         JSON.stringify(this.getRgbCode(fillColorString));
                        const fontColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fontColor;
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fontColor =
                         JSON.stringify(this.getRgbCode(fontColorString));
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].vertexPoints =
                         JSON.stringify(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].vertexPoints);
                        if (pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rectangleDifference !== null) {
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rectangleDifference =
                             JSON.stringify(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rectangleDifference);
                        }
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].padding = this.getPaddingValues(this.fontSize);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
            annotationCollection = null;
        }
        return JSON.stringify(annotations);
    }

    private getRotationValue(pageIndex: number, isAddedProgrammatically?: boolean): number {
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        if (!isNullOrUndefined(isAddedProgrammatically) && isAddedProgrammatically) {
            return 0;
        }
        else {
            if (pageDetails) {
                if (pageDetails.rotation === 0) {
                    return 0;
                } else if (pageDetails.rotation === 1) {
                    return 90;
                } else if (pageDetails.rotation === 2) {
                    return 180;
                } else if (pageDetails.rotation === 3) {
                    return 270;
                }
            }
            return 0;
        }
    }

    private getBoundsBasedOnRotation(bounds: AnnotBoundsRect, rotateAngle: number, pageIndex: number,
                                     annotation: AnnotationsInternal, isAddedProgrammatically?: boolean): any {
        const rotateValue: number = this.getRotationValue(pageIndex, isAddedProgrammatically);
        const paddingValue: number = 0;
        annotation.rotateAngle = rotateAngle - rotateValue;
        annotation.pageRotation = rotateValue;
        if (rotateAngle === 90 || rotateAngle === -90 || rotateAngle === 270 || rotateAngle === -270) {
            const x: number = bounds.left + (bounds.width / 2) - (bounds.height / 2);
            const y: number = bounds.top - (bounds.width / 2 - bounds.height / 2);
            return { x: x + paddingValue, y: y + paddingValue, left: x + paddingValue,
                top: y + paddingValue, width: bounds.height, height: bounds.width };
        } else {
            return { x: bounds.left + paddingValue, y: bounds.top + paddingValue,
                left: bounds.left + paddingValue, top: bounds.top + paddingValue, width: bounds.width, height: bounds.height };
        }
    }

    private manageAnnotations(pageAnnotations: IFreeTextAnnotation[], pageNumber: number): void {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (storeObject) {
            this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_freetext');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                storeObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_freetext', storeObject);
        }
    }

    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        let annotationCollection: any[];
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (storeObject) {
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageIndex);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                annotationCollection = storeObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = shapeAnnotations;
            }
        } else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    }

    private getRgbCode(colorString: string): RGBA {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        const r: number = parseFloat(stringArray[0].split('(')[1]);
        const g: number = parseFloat(stringArray[1]);
        const b: number = parseFloat(stringArray[2]);
        const a: number = parseFloat(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @private
     * @returns {void}
     */
    public onFocusOutInputBox(): void {
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        if (!this.pdfViewerBase.isFreeTextContextMenu) {
            this.pdfViewer.fireBeforeAddFreeTextAnnotation(this.inputBoxElement.value);
            if (this.pdfViewer.enableHtmlSanitizer && this.inputBoxElement){
                const sanitizedString: string = SanitizeHtmlHelper.sanitize(this.inputBoxElement.value);
                if (sanitizedString === this.inputBoxElement.value) {
                    this.inputBoxElement.value = sanitizedString;
                }
            }
            const pageIndex: number = this.inputBoxElement.id && this.inputBoxElement.id.split('_freeText_')[1] && this.inputBoxElement.id.split('_freeText_')[1].split('_')[0] ? parseFloat(this.inputBoxElement.id.split('_freeText_')[1].split('_')[0]) : this.pdfViewerBase.currentPageNumber - 1;
            const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
            let width: number = parseFloat(this.inputBoxElement.style.width);
            // Removed the line since when we click on the freetext the size gets changed. Task Id: 847135
            if (this.pdfViewer.freeTextSettings.enableAutoFit && !this.isMaximumWidthReached && this.isNewFreeTextAnnot) {
                width = parseFloat(this.inputBoxElement.style.width);
                const characterLength: number = 8;
                this.inputBoxElement.style.width = (width - characterLength) + 'px';
            }
            let inputEleHeight: number = parseFloat(this.inputBoxElement.style.height);
            let inputEleWidth: number = parseFloat(this.inputBoxElement.style.width);
            let inputEleLeft: number = parseFloat(this.inputBoxElement.style.left);
            if (this.pdfViewerBase.isMixedSizeDocument) {
                const canvas: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
                inputEleLeft = inputEleLeft - canvas.offsetLeft;
            }
            const inputEleTop: number = parseFloat(this.inputBoxElement.style.top);
            const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            if (this.pdfViewer.isValidFreeText) {
                this.inputBoxElement.value = 'Type Here';
                this.pdfViewer.isValidFreeText = false;
            }
            const inputValue: string = this.inputBoxElement.value;
            let isNewlyAdded: boolean = false;
            if (this.isNewFreeTextAnnot === true) {
                const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                const annotationName: string = this.pdfViewer.annotation.createGUID();
                this.isNewFreeTextAnnot = false;
                isNewlyAdded = true;
                const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('freeText', pageIndex + 1);
                if (commentsDivid) {
                    document.getElementById(commentsDivid).id = annotationName;
                }
                const annotationSelectorSettings: AnnotationSelectorSettingsModel =
                this.pdfViewer.freeTextSettings.annotationSelectorSettings;
                this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
                const annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
                this.author = this.author ? this.author : this.pdfViewer.freeTextSettings.author ? this.pdfViewer.freeTextSettings.author : 'Guest';
                this.subject = this.subject ? this.subject : this.pdfViewer.freeTextSettings.subject ? this.pdfViewer.freeTextSettings.subject : 'Text Box';
                const allowedInteractions: AllowedInteraction[] = this.pdfViewer.freeTextSettings.allowedInteractions ?
                    this.pdfViewer.freeTextSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
                const annot: PdfAnnotationBaseModel = {
                    author: this.author, modifiedDate: currentDateString, subject: this.subject, id: 'free_text' + this.inputBoxCount,
                    rotateAngle: 0, dynamicText: inputValue, strokeColor: this.borderColor,
                    thickness: this.borderWidth, fillColor: this.fillColor,
                    bounds: {
                        left: inputEleLeft / zoomFactor, top: inputEleTop / zoomFactor, x: inputEleLeft / zoomFactor,
                        y: inputEleTop / zoomFactor, width: inputEleWidth / zoomFactor, height: inputEleHeight / zoomFactor
                    }, annotName: annotationName,
                    shapeAnnotationType: 'FreeText', pageIndex: pageIndex, fontColor: this.fontColor, fontSize: this.fontSize,
                    fontFamily: this.fontFamily, opacity: this.opacity, comments: [], textAlign: this.textAlign,
                    font: { isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough,
                        isUnderline: this.isUnderline },
                    review: { state: 'Unmarked', stateModel: 'None', modifiedDate: currentDateString, author: this.author },
                    annotationSelectorSettings: annotationSelectorSettings, annotationSettings: annotationSettings,
                    customData: this.pdfViewer.annotationModule.getData('FreeText'), isPrint: (this.pdfViewer.freeTextSettings && !isNullOrUndefined(this.pdfViewer.freeTextSettings.isPrint)) ? this.pdfViewer.freeTextSettings.isPrint : true,
                    allowedInteractions: allowedInteractions, isReadonly: this.isReadonly
                };
                const annotObject: IFreeTextAnnotation = {
                    author: this.author, modifiedDate: currentDateString, subject: this.subject, id: 'free_text' + this.inputBoxCount,
                    rotateAngle: 0, dynamicText: inputValue, strokeColor: this.borderColor,
                    thickness: this.borderWidth, fillColor: this.fillColor,
                    bounds: {
                        left: inputEleLeft / zoomFactor, top: inputEleTop / zoomFactor, x: inputEleLeft / zoomFactor,
                        y: inputEleTop / zoomFactor, width: inputEleWidth / zoomFactor, height: inputEleHeight / zoomFactor
                    }, annotName: annotationName,
                    shapeAnnotationType: 'FreeText', pageIndex: pageIndex, fontColor: this.fontColor, fontSize: this.fontSize,
                    fontFamily: this.fontFamily, opacity: this.opacity, comments: [], textAlign: this.textAlign,
                    font: { isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough,
                        isUnderline: this.isUnderline },
                    review: { state: 'Unmarked', stateModel: 'None', modifiedDate: currentDateString, author: this.author },
                    annotationSelectorSettings: annotationSelectorSettings, annotationSettings: annotationSettings,
                    customData: this.pdfViewer.annotationModule.getData('FreeText'), isPrint: (this.pdfViewer.freeTextSettings && !isNullOrUndefined(this.pdfViewer.freeTextSettings.isPrint)) ? this.pdfViewer.freeTextSettings.isPrint : true,
                    allowedInteractions: allowedInteractions, isReadonly: this.isReadonly
                };
                if (this.pdfViewer.enableRtl) {
                    annot.textAlign = 'Right';
                    annotObject.textAlign = 'Right';
                }
                const annotation: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                const bounds: AnnotBoundsRect = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width,
                    height: annot.bounds.height };
                const settings: any = {
                    opacity: annot.opacity, borderColor: annot.strokeColor, borderWidth: annot.thickness,
                    author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                    fillColor: annot.fillColor, fontSize: annot.fontSize, width: annot.bounds.width,
                    height: annot.bounds.height, fontColor: annot.fontColor, fontFamily: annot.fontFamily,
                    defaultText: annot.dynamicText, fontStyle: annot.font, textAlignment: annot.textAlign
                };
                this.pdfViewer.annotation.storeAnnotations(pageIndex, annotObject, '_annotations_freetext');
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'FreeText', bounds, settings);
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                        this.pdfViewer.toolbarModule.annotationToolbarModule.freetextToolbarElement.style.display = 'none';
                        const editIcon: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationIcon');
                        if (editIcon && editIcon.parentElement.classList.contains('e-pv-select')) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarCreated = false;
                            this.pdfViewer.toolbarModule.annotationToolbarModule.createAnnotationToolbarForMobile();
                        }
                        if (this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarElement.children.length > 0) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.toolbarElement.style.display = 'block';
                        }
                        this.pdfViewer.toolbarModule.annotationToolbarModule.adjustMobileViewer();
                    }
                }
                this.pdfViewer.fireCommentAdd(annot.annotName, annot.dynamicText, annot);
                this.pdfViewer.annotation.addAction(pageIndex, null, annotation, 'Addition', '', annotation, annotation);
                this.pdfViewer.renderSelector((annot as PdfAnnotationBaseModel).pageIndex);
                this.pdfViewer.clearSelection(annot.pageIndex);
                this.selectedAnnotation = annotation;
            }
            this.isInuptBoxInFocus = false;
            let isFreetextValueEqual: boolean = false;
            if (inputValue === this.inputBoxValue) {
                isFreetextValueEqual = true;
            }
            let isFontSizeEqual: boolean = true;
            if (this.selectedAnnotation.fontSize !== this.prevFontsize) {
                isFontSizeEqual = false;
            }
            this.prevFontsize = this.selectedAnnotation.fontSize;
            if (this.selectedAnnotation && this.pdfViewer.selectedItems.annotations &&
                (!isFontSizeEqual || !isFreetextValueEqual || isNewlyAdded)) {
                const isRotated: boolean = (Math.abs(this.selectedAnnotation.rotateAngle) !== 0 &&
                Math.abs(this.selectedAnnotation.rotateAngle) !== 180);
                inputEleHeight = parseFloat(isRotated ? this.inputBoxElement.style.width : this.inputBoxElement.style.height) / zoomFactor;
                inputEleWidth = parseFloat(isRotated ? this.inputBoxElement.style.height : this.inputBoxElement.style.width) / zoomFactor;
                const heightDiff: number = (inputEleHeight - this.selectedAnnotation.bounds.height);
                let y: number = undefined;
                if (heightDiff > 0) {
                    y = this.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
                    y = y > 0 ? y : undefined;
                }
                let widthDiff: number = (inputEleWidth - this.selectedAnnotation.bounds.width);
                let x: number = undefined;
                if (widthDiff > 0) {
                    x = this.selectedAnnotation.wrapper.offsetX + (widthDiff / 2);
                    x = x > 0 ? x : undefined;
                } else {
                    widthDiff = Math.abs(widthDiff);
                    x = this.selectedAnnotation.wrapper.offsetX - (widthDiff / 2);
                }
                this.selectedAnnotation.bounds.width = inputEleWidth;
                this.selectedAnnotation.bounds.height = inputEleHeight;
                if (!isNullOrUndefined(this.pdfViewer.freeTextSettings.borderWidth) && this.pdfViewer.freeTextSettings.borderWidth !== 0) {
                    this.initialStrokeThickness = this.pdfViewer.freeTextSettings.borderWidth;
                }
                if (!isNullOrUndefined(this.initialStrokeThickness) && !this.selectedAnnotation.isAddAnnotationProgrammatically &&
                    this.initialStrokeThickness !== this.selectedAnnotation.wrapper.children[0].style.strokeWidth) {
                    const strokeDifference: number = this.selectedAnnotation.wrapper.children[0].style.strokeWidth -
                        this.initialStrokeThickness;
                    this.selectedAnnotation.bounds.height = parseFloat(this.inputBoxElement.style.height) + strokeDifference;
                }
                this.inputBoxElement.style.height = this.selectedAnnotation.bounds.height + 'px';
                let lineSpace: any = 0;
                lineSpace = ((parseFloat(this.inputBoxElement.style.fontSize) / zoomFactor) / (this.defaultFontSize / 2));
                this.selectedAnnotation.wrapper.children[1].margin.left = this.freeTextPaddingLeft + 1;
                this.selectedAnnotation.wrapper.children[1].margin.top =
                 ((parseFloat(this.inputBoxElement.style.paddingTop) / Math.max(1, zoomFactor))) + lineSpace - 1;
                this.pdfViewer.annotation.modifyDynamicTextValue(inputValue, this.selectedAnnotation.annotName, this.previousText);
                this.selectedAnnotation.dynamicText = inputValue;
                this.modifyInCollection('dynamicText', pageIndex, this.selectedAnnotation, isNewlyAdded);
                this.modifyInCollection('bounds', pageIndex, this.selectedAnnotation, isNewlyAdded);
                this.pdfViewer.nodePropertyChange(this.selectedAnnotation, { bounds: { width: this.selectedAnnotation.bounds.width,
                    height: this.selectedAnnotation.bounds.height, y: y, x: x } });
                const commentsDiv: any = document.getElementById(this.selectedAnnotation.annotName);
                if (commentsDiv && commentsDiv.childNodes) {
                    const sanitizedString: string = SanitizeHtmlHelper.sanitize(inputValue);
                    if (commentsDiv.childNodes[0].ej2_instances) {
                        if (sanitizedString !== inputValue) {
                            commentsDiv.childNodes[0].ej2_instances[0].enableHtmlSanitizer = false;
                            commentsDiv.childNodes[0].ej2_instances[0].enableHtmlParse = false;
                        }
                        commentsDiv.childNodes[0].ej2_instances[0].value = inputValue;
                        commentsDiv.childNodes[0].ej2_instances[0].dataBind();
                    } else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                        if (sanitizedString !== inputValue) {
                            commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].enableHtmlSanitizer = false;
                            commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].enableHtmlParse = false;
                        }
                        commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = inputValue;
                        commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].dataBind();
                    }
                }
                this.pdfViewer.renderSelector(this.selectedAnnotation.pageIndex, this.selectedAnnotation.annotationSelectorSettings);
            } else {
                const isRotated: boolean = (Math.abs(this.selectedAnnotation.rotateAngle) !== 0 &&
                Math.abs(this.selectedAnnotation.rotateAngle) !== 180);
                inputEleHeight = parseFloat(isRotated ? this.inputBoxWidth : this.inputBoxHeight) / zoomFactor;
                inputEleWidth = parseFloat(isRotated ? this.inputBoxHeight : this.inputBoxWidth) / zoomFactor;
                const heightDiff: number = (inputEleHeight - this.freetextHeight);
                let y: number = undefined;
                if (heightDiff > 0) {
                    y = this.wrapperOffsetY + (heightDiff / 2);
                    y = y > 0 ? y : undefined;
                }
                let widthDiff: number = (inputEleWidth - this.freetextWidth);
                let x: number = undefined;
                if (widthDiff > 0) {
                    x = this.wrapperOffsetX + (widthDiff / 2);
                    x = x > 0 ? x : undefined;
                } else {
                    widthDiff = Math.abs(widthDiff);
                    x = this.wrapperOffsetX - (widthDiff / 2);
                }
                this.selectedAnnotation.bounds.width = inputEleWidth;
                this.selectedAnnotation.bounds.height = inputEleHeight;
                let lineSpace: any = 0;
                lineSpace = ((parseFloat(this.inputBoxElement.style.fontSize) / zoomFactor) / (this.defaultFontSize / 2));
                this.selectedAnnotation.wrapper.children[1].margin.left = this.freeTextPaddingLeft + 1;
                this.selectedAnnotation.wrapper.children[1].margin.top =
                 ((parseFloat(this.inputBoxElement.style.paddingTop) / zoomFactor)) + lineSpace - 1;
                this.pdfViewer.annotation.modifyDynamicTextValue(inputValue, this.selectedAnnotation.annotName, this.previousText);
                this.selectedAnnotation.dynamicText = inputValue;
                this.modifyInCollection('dynamicText', pageIndex, this.selectedAnnotation, isNewlyAdded);
                this.modifyInCollection('bounds', pageIndex, this.selectedAnnotation, isNewlyAdded);
                this.selectedAnnotation.wrapper.offsetX = this.wrapperOffsetX;
                this.selectedAnnotation.wrapper.offsetY = this.wrapperOffsetY;
                this.pdfViewer.nodePropertyChange(this.selectedAnnotation, { bounds: { width: this.selectedAnnotation.bounds.width,
                    height: this.selectedAnnotation.bounds.height, y: y, x: x } });
                const commentsDiv: any = document.getElementById(this.selectedAnnotation.annotName);
                if (commentsDiv && commentsDiv.childNodes) {
                    if (commentsDiv.childNodes[0].ej2_instances) {
                        commentsDiv.childNodes[0].ej2_instances[0].value = inputValue;
                        commentsDiv.childNodes[0].ej2_instances[0].dataBind();
                    } else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                        commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = inputValue;
                        commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].dataBind();
                    }
                }
                this.pdfViewer.renderSelector(this.selectedAnnotation.pageIndex, this.selectedAnnotation.annotationSelectorSettings);
            }
            if (this.inputBoxElement.parentElement) {
                if (pageDiv && (pageDiv.id === this.inputBoxElement.parentElement.id)) {
                    pageDiv.removeChild(this.inputBoxElement);
                } else {
                    this.inputBoxElement.parentElement.removeChild(this.inputBoxElement);
                }
            }
            const canvass: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
            this.pdfViewer.renderDrawing(canvass as any, pageIndex);
            this.inputBoxCount += 1;
        } else {
            this.inputBoxElement.focus();
            if (!this.isTextSelected) {
                window.getSelection().removeAllRanges();
            }
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }

    /**
     * @param {KeyboardEvent} event - event
     * @private
     * @returns {void}
     */
    public onKeyDownInputBox(event: KeyboardEvent): void {
        // eslint-disable-next-line
        const isTab: boolean = event.key === 'Tab' || event.code === 'Tab';
        const isAlt: boolean = event.key === 'Alt' || event.code === 'AltLeft' || event.code === 'AltRight';
        if (!isAlt) {
            if (event.ctrlKey && event.key.toLowerCase() === 'a') {
                event.preventDefault();
                this.inputBoxElement.select();
            }
            // eslint-disable-next-line
            const inuptEleObj: FreeTextAnnotation = this;
            if (isTab || (isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0]) && !this.isNewFreeTextAnnot)) {
                event.preventDefault();
            }
            this.selectedAnnotation = this.pdfViewer.selectedItems.annotations &&
                this.isNewFreeTextAnnot ? this.pdfViewer.selectedItems.annotations[0]
                : this.selectedAnnotation;
            setTimeout(() => {
                if (inuptEleObj.defaultHeight < inuptEleObj.inputBoxElement.scrollHeight &&
                    Math.ceil(inuptEleObj.inputBoxElement.clientHeight) < inuptEleObj.inputBoxElement.scrollHeight) {
                    inuptEleObj.updateFreeTextAnnotationSize(true);
                } else {
                    if (!event.ctrlKey) {
                        inuptEleObj.updateFreeTextAnnotationSize(false);
                    }
                }

            }, 0);
        }
    }

    private updateFreeTextAnnotationSize(isSize: boolean): void {
        // eslint-disable-next-line
        const inuptEleObj: FreeTextAnnotation = this;
        const enableAutoFit: boolean = inuptEleObj.pdfViewer.freeTextSettings.enableAutoFit;
        if (enableAutoFit) {
            this.autoFitFreeText();
        } else {
            this.isMaximumWidthReached = true;
        }
        if (this.isMaximumWidthReached) {
            const previousHeight: number = inuptEleObj.inputBoxElement.getBoundingClientRect().height;
            if (!isSize && !inuptEleObj.inputBoxElement.readOnly) {
                inuptEleObj.inputBoxElement.style.height = inuptEleObj.defaultHeight + 'px';
            }
            const currentHeight: number = inuptEleObj.inputBoxElement.getBoundingClientRect().height;
            const difference: number = currentHeight - previousHeight;
            const fontSize: number = parseFloat(inuptEleObj.inputBoxElement.style.fontSize);
            const zoomFactor: number = inuptEleObj.pdfViewerBase.getZoomFactor();
            if (((inuptEleObj.defaultHeight * zoomFactor) < inuptEleObj.inputBoxElement.scrollHeight) &&
            (Math.ceil(inuptEleObj.inputBoxElement.clientHeight) < inuptEleObj.inputBoxElement.scrollHeight)) {
                inuptEleObj.inputBoxElement.style.height = inuptEleObj.inputBoxElement.readOnly ? inuptEleObj.inputBoxElement.style.height : inuptEleObj.inputBoxElement.scrollHeight + (fontSize / 2) + 'px';
                if (parseFloat(inuptEleObj.inputBoxElement.style.borderWidth) >= 1) {
                    inuptEleObj.inputBoxElement.style.height = parseFloat(inuptEleObj.inputBoxElement.style.height) + (parseFloat(inuptEleObj.inputBoxElement.style.borderWidth) * 2) + 'px';
                }
            }
        }
        const zoomFactor: number = inuptEleObj.pdfViewerBase.getZoomFactor();
        const isRotated: boolean = this.selectedAnnotation && (Math.abs(this.selectedAnnotation.rotateAngle) !== 0 &&
        Math.abs(this.selectedAnnotation.rotateAngle) !== 180);
        const inputEleHeight: number = parseFloat(isRotated ? this.inputBoxElement.style.width :
            this.inputBoxElement.style.height) / zoomFactor;
        const inputEleWidth: number = parseFloat(isRotated ? this.inputBoxElement.style.height :
            this.inputBoxElement.style.width) / zoomFactor;
        let x: number = 0;
        if (this.selectedAnnotation) {
            let heightDiff: number;
            if (isRotated) {
                heightDiff = (inputEleWidth - inuptEleObj.selectedAnnotation.bounds.width);
            }
            else {
                heightDiff = (inputEleHeight - inuptEleObj.selectedAnnotation.bounds.height);
            }
            let y: number = 0;
            if (heightDiff > 0) {
                y = inuptEleObj.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
            } else {
                heightDiff = Math.abs(heightDiff);
                y = inuptEleObj.selectedAnnotation.wrapper.offsetY - (heightDiff / 2);
            }
            if (enableAutoFit) {
                let widthDiff: number = (inputEleWidth - inuptEleObj.selectedAnnotation.bounds.width);
                if (widthDiff > 0) {
                    x = inuptEleObj.selectedAnnotation.wrapper.offsetX + (widthDiff / 2);
                } else {
                    widthDiff = Math.abs(widthDiff);
                    x = inuptEleObj.selectedAnnotation.wrapper.offsetX - (widthDiff / 2);
                }
            }
            inuptEleObj.selectedAnnotation.bounds.width = inputEleWidth;
            inuptEleObj.selectedAnnotation.bounds.height = inputEleHeight;
            if (enableAutoFit) {
                inuptEleObj.pdfViewer.nodePropertyChange(inuptEleObj.selectedAnnotation, { bounds: { width:
                     inuptEleObj.selectedAnnotation.bounds.width, height: inuptEleObj.selectedAnnotation.bounds.height, y: y, x: x } });
            } else {
                inuptEleObj.pdfViewer.nodePropertyChange(inuptEleObj.selectedAnnotation, { bounds: { width:
                     inuptEleObj.selectedAnnotation.bounds.width, height: inuptEleObj.selectedAnnotation.bounds.height, y: y } });
            }
            inuptEleObj.pdfViewer.renderSelector(inuptEleObj.selectedAnnotation.pageIndex,
                                                 this.selectedAnnotation.annotationSelectorSettings);
        }
    }

    /**
     * @param {number} xPosition - This is xPosition
     * @param {number} yPosition - This is yPosition
     * @private
     * @returns {void}
     */
    public autoFitFreeText(xPosition?: number, yPosition?: number): void {
        const pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        const canvas: any = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
        const context: any = canvas.getContext('2d');
        let fontSize: any = this.inputBoxElement.style.fontSize;
        if (this.pdfViewer.freeTextSettings.fontStyle === FontStyle.Bold || this.inputBoxElement.style.fontWeight === 'bold') {
            context.font = 'bold' + ' ' + fontSize + ' ' + this.inputBoxElement.style.fontFamily;
        } else {
            context.font = fontSize + ' ' + this.inputBoxElement.style.fontFamily;
        }
        let highestTextNode: string = '';
        let textNodes: any[] = [];
        const textboxValue: string = this.inputBoxElement.value;
        if (textboxValue.indexOf('\n') > -1) {
            textNodes = textboxValue.split('\n');
            for (let j: number = 0; j < textNodes.length; j++) {
                const textNodeData: any = context.measureText(textNodes[parseInt(j.toString(), 10)]);
                const highestTextNodeData: any = context.measureText(highestTextNode);
                if (textNodeData.width > highestTextNodeData.width) {
                    highestTextNode = textNodes[parseInt(j.toString(), 10)];
                }
            }
            this.isMaximumWidthReached = true;
        } else {
            highestTextNode = textboxValue;
            this.isMaximumWidthReached = false;
        }
        const textwidth: any = context.measureText(highestTextNode);
        fontSize = parseFloat(this.inputBoxElement.style.fontSize);
        let inputEleWidth: number;
        const characterLength: number = 8;
        const inputEleHeight: number = (fontSize + (fontSize / 2));
        if (this.isNewFreeTextAnnot) {
            inputEleWidth = Math.ceil(textwidth.width + ((characterLength + 1) * 2));
            this.inputBoxElement.style.height = inputEleHeight + 'px';
            this.inputBoxElement.style.top = (yPosition) - (inputEleHeight / 2) + 'px';
        } else {
            inputEleWidth = Math.ceil(textwidth.width) + fontSize + Math.ceil(characterLength / 2);
        }
        // Removed the line since when we double click on the freetext the size gets changed. Task Id: 847135
        this.inputBoxElement.style.width = inputEleWidth + 'px';
        const maxWidth: number = this.pdfViewerBase.getPageWidth(pageIndex) - parseFloat(this.inputBoxElement.style.left);
        if (parseFloat(this.inputBoxElement.style.width) > maxWidth) {
            this.isMaximumWidthReached = true;
            if (this.isNewAddedAnnot && xPosition) {
                inputEleWidth = inputEleWidth - characterLength;
                this.inputBoxElement.style.width = inputEleWidth + 'px';
                const width: number = xPosition + (inputEleWidth * this.pdfViewerBase.getZoomFactor());
                let x: number = parseFloat(this.inputBoxElement.style.left);
                if (width >= this.pdfViewerBase.getPageWidth(pageIndex)) {
                    x = this.pdfViewerBase.getPageWidth(pageIndex) - inputEleWidth;
                }
                this.inputBoxElement.style.left = x + 'px';
            } else {
                this.inputBoxElement.style.width = maxWidth + 'px';
            }
        }
    }

    /**
     * @param {MouseEvent} event - This is Mouse event
     * @private
     * @returns {void}
     */
    public onMouseUpInputBox(event: MouseEvent): void {
        const target: any = event.target;
        this.selectionStart = 0;
        this.selectionEnd = 0;
        const isRightClick: boolean = event.button === 2;
        if (isRightClick && target) {
            this.selectionStart = target.selectionStart;
            this.selectionEnd = target.selectionEnd;
        }
        if (isRightClick && window.getSelection() !== null && window.getSelection().toString() !== '') {
            this.isTextSelected = true;
        } else {
            this.isTextSelected = false;
        }
    }

    private focusInputWithoutScroll(el: any): void {
        const container: any = this.pdfViewerBase.viewerContainer || document.scrollingElement || document.documentElement;
        const prevLeft: any = container.scrollLeft;
        const prevTop: any = container.scrollTop;
        try {
            // Modern browsers: prevent automatic scroll on focus
            el.focus({ preventScroll: true });
        } catch (e) {
            // Older browsers: focus then restore scroll position
            el.focus();
            if (typeof container.scrollTo === 'function') {
                container.scrollTo(prevLeft, prevTop);
            } else {
                container.scrollLeft = prevLeft;
                container.scrollTop = prevTop;
            }
        }
    }

    /**
     * @param {PointModel} currentPosition - This is current position
     * @param {PdfAnnotationBaseModel} annotation - This is annotation
     * @param {number} pageIndex - This is pageIndex
     * @private
     * @returns {void}
     */
    public addInuptElemet(currentPosition: PointModel, annotation: PdfAnnotationBaseModel = null, pageIndex?: number): void {
        this.currentPosition = [];
        if (isNullOrUndefined(pageIndex)) {
            pageIndex = this.pdfViewerBase.currentPageNumber - 1;
        }
        if (annotation) {
            pageIndex = annotation.pageIndex;
        }
        if (isBlazor() && annotation === null && this.pdfViewer.selectedItems.annotations.length === 0) {
            this.updateTextProperties();
        }
        this.inputBoxElement.id = this.pdfViewer.element.id + '_freeText_' + pageIndex + '_' + this.inputBoxCount;
        const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
        const canvass: HTMLElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        this.inputBoxElement.value = (annotation && annotation.dynamicText) ? annotation.dynamicText : this.defaultText;
        this.inputBoxElement.style.boxSizing = 'border-box';
        this.inputBoxElement.style.left = ((currentPosition.x)) + 'px';
        this.inputBoxElement.style.top = ((currentPosition.y)) - ((this.defaultHeight * zoomFactor) / 2) + 'px';
        if (this.pdfViewer.freeTextSettings.enableAutoFit) {
            this.inputBoxElement.style.wordBreak = 'break-all';
        } else {
            this.inputBoxElement.style.wordBreak = 'break-word';
        }
        if (annotation) {
            this.applyFreetextStyles(zoomFactor, annotation.isReadonly);
        } else {
            this.applyFreetextStyles(zoomFactor);
        }
        if (this.isBold) {
            this.inputBoxElement.style.fontWeight = 'bold';
        } else {
            this.inputBoxElement.style.fontWeight = 'normal';
        }
        if (this.isItalic) {
            this.inputBoxElement.style.fontStyle = 'italic';
        } else {
            this.inputBoxElement.style.fontStyle = 'normal';
        }
        this.inputBoxElement.style.textDecoration = 'none';
        if (this.isUnderline) {
            this.inputBoxElement.style.textDecoration = 'underline';
        }
        if (this.isStrikethrough) {
            this.inputBoxElement.style.textDecoration = 'line-through';
        }
        if (this.pdfViewer.enableRtl) {
            this.inputBoxElement.style.textAlign = 'right';
            this.inputBoxElement.style.direction = 'rtl';
            this.inputBoxElement.style.left = ((currentPosition.x)) - ((this.defautWidth * zoomFactor / 2));
        } else {
            this.inputBoxElement.style.textAlign = this.textAlign.toLowerCase();
        }
        this.inputBoxElement.style.borderColor = this.borderColor;
        this.inputBoxElement.style.color = this.fontColor;
        this.inputBoxElement.style.background = this.fillColor;
        if (annotation && annotation.wrapper && annotation.wrapper.children[0]) {
            this.inputBoxElement.style.opacity = annotation.wrapper.children[0].style.opacity;
        }
        if (this.isNewFreeTextAnnot === true) {
            this.initialStrokeWidth = 0;
            this.pdfViewer.clearSelection(pageIndex);
        }
        if (annotation && annotation.wrapper && annotation.wrapper.bounds) {
            const annotationBounds: any = annotation.wrapper.bounds;
            if (annotationBounds.left) {
                this.inputBoxElement.style.left = ((annotationBounds.left) * zoomFactor) + 'px';
            }
            if (annotationBounds.top) {
                this.inputBoxElement.style.top = ((annotationBounds.top) * zoomFactor) + 'px';
            }
            this.inputBoxElement.style.height = annotationBounds.height ? (annotationBounds.height * zoomFactor) + 'px' : (this.defaultHeight * zoomFactor) + 'px';
            this.inputBoxElement.style.width = annotationBounds.width ? (annotationBounds.width * zoomFactor) + 'px' : (this.defautWidth * zoomFactor) + 'px';
            this.selectedAnnotation = annotation;
            this.previousText = this.selectedAnnotation.dynamicText;
            this.selectedAnnotation.dynamicText = '';
            this.inputBoxElement.style.borderColor = this.selectedAnnotation.strokeColor;
            this.inputBoxElement.style.color = this.selectedAnnotation.fontColor;
            this.inputBoxElement.style.background = this.selectedAnnotation.fillColor;
            if (this.selectedAnnotation.font.isBold === true) {
                this.inputBoxElement.style.fontWeight = 'bold';
            }
            if (this.selectedAnnotation.font.isItalic === true) {
                this.inputBoxElement.style.fontStyle = 'italic';
            }
            if (this.selectedAnnotation.font.isUnderline === true) {
                this.inputBoxElement.style.textDecoration = 'underline';
            }
            if (this.selectedAnnotation.font.isStrikeout === true) {
                this.inputBoxElement.style.textDecoration = 'line-through';
            }
            if (this.pdfViewer.enableRtl) {
                this.inputBoxElement.style.textAlign = 'right';
                this.inputBoxElement.style.direction = 'rtl';
            } else if (this.selectedAnnotation.textAlign) {
                this.inputBoxElement.style.textAlign = this.selectedAnnotation.textAlign;
            }
            this.inputBoxElement.style.fontSize = (this.selectedAnnotation.fontSize * zoomFactor) + 'px';
            this.inputBoxElement.style.fontFamily = this.selectedAnnotation.fontFamily;
            this.freetextHeight = this.selectedAnnotation.bounds.height;
            this.freetextWidth = this.selectedAnnotation.bounds.width;
            this.inputBoxHeight = this.inputBoxElement.style.height;
            this.inputBoxWidth = this.inputBoxElement.style.width;
            this.inputBoxValue = this.inputBoxElement.value;
            this.wrapperOffsetX = this.selectedAnnotation.wrapper.offsetX;
            this.wrapperOffsetY = this.selectedAnnotation.wrapper.offsetY;
            this.pdfViewer.nodePropertyChange(this.selectedAnnotation, {});
        }
        if (this.pdfViewerBase.isMixedSizeDocument) {
            this.inputBoxElement.style.left = (parseFloat(this.inputBoxElement.style.left)) + canvass.offsetLeft + 'px';
        }
        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
        if (this.pdfViewer.freeTextSettings.enableAutoFit) {
            this.autoFitFreeText(currentPosition.x, currentPosition.y);
        }
        this.inputBoxElement.style.paddingLeft = (this.freeTextPaddingLeft * zoomFactor) + 'px';
        this.inputBoxElement.style.paddingTop = ((((parseFloat(this.inputBoxElement.style.fontSize) / Math.max(1, zoomFactor)) / this.defaultFontSize) / Math.max(1, zoomFactor))) * this.freeTextPaddingTop + 'px';
        let lineSpace: any = 0;
        lineSpace = ((parseFloat(this.inputBoxElement.style.fontSize) / Math.max(1, zoomFactor)) / (this.defaultFontSize / 2));
        this.inputBoxElement.style.paddingTop = ((parseFloat(this.inputBoxElement.style.paddingTop)) - lineSpace) + 'px';
        if (this.selectedAnnotation && this.selectedAnnotation.wrapper.children[0].style.strokeWidth) {
            if (!this.isNewFreeTextAnnot) {
                this.inputBoxElement.style.borderWidth = this.selectedAnnotation.wrapper.children[0].style.strokeWidth / 2 + 'px';
            }
            if (!isNullOrUndefined(this.pdfViewer.freeTextSettings.borderWidth) && this.pdfViewer.freeTextSettings.borderWidth !== 0) {
                this.initialStrokeWidth = this.pdfViewer.freeTextSettings.borderWidth;
            }
            if (!isNullOrUndefined(this.initialStrokeWidth) && !isNullOrUndefined(annotation) && !annotation.isAddAnnotationProgrammatically
                && this.initialStrokeWidth !== this.selectedAnnotation.wrapper.children[0].style.strokeWidth) {
                const strokeDifference: number = this.selectedAnnotation.wrapper.children[0].style.strokeWidth - this.initialStrokeWidth;
                this.inputBoxElement.style.height = parseFloat(this.inputBoxElement.style.height) + strokeDifference + 'px';
                this.initialStrokeWidth = this.selectedAnnotation.wrapper.children[0].style.strokeWidth;
            }
        }
        pageDiv.appendChild(this.inputBoxElement);
        if (this.isNewFreeTextAnnot) {
            this.freetextHeight = this.inputBoxElement.style.height;
        }
        if (!this.pdfViewer.freeTextSettings.enableAutoFit && (this.defaultHeight * zoomFactor)
         < this.inputBoxElement.scrollHeight && parseInt(this.inputBoxElement.style.height, 10) < this.inputBoxElement.scrollHeight) {
            this.inputBoxElement.style.height = this.inputBoxElement.scrollHeight + 'px';
            if (annotation && annotation.wrapper && annotation.wrapper.children[0]) {
                this.inputBoxElement.style.height = parseFloat(this.inputBoxElement.style.height) + annotation.wrapper.children[0].style.strokeWidth + 'px';
            }
        }
        if (annotation && annotation.wrapper && annotation.wrapper.bounds) {
            let inputEleHeight: number = parseFloat(this.inputBoxElement.style.height);
            let inputEleWidth: number = parseFloat(this.inputBoxElement.style.width);
            const isRotated: boolean = this.selectedAnnotation.pageRotation === 90 || this.selectedAnnotation.pageRotation === 270;
            inputEleHeight = parseFloat(isRotated ? this.inputBoxElement.style.width : this.inputBoxElement.style.height) / zoomFactor;
            inputEleWidth = parseFloat(isRotated ? this.inputBoxElement.style.height : this.inputBoxElement.style.width) / zoomFactor;
            const heightDiff: number = (inputEleHeight - this.selectedAnnotation.bounds.height);
            let y: number = undefined;
            if (heightDiff > 0) {
                y = this.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
                y = y > 0 ? y : undefined;
            }
            let widthDiff: number = (inputEleWidth - this.selectedAnnotation.bounds.width);
            let x: number = undefined;
            if (widthDiff > 0) {
                x = this.selectedAnnotation.wrapper.offsetX + (widthDiff / 2);
                x = x > 0 ? x : undefined;
            } else {
                widthDiff = Math.abs(widthDiff);
                x = this.selectedAnnotation.wrapper.offsetX - (widthDiff / 2);
            }
            this.selectedAnnotation.bounds.width = inputEleWidth;
            this.selectedAnnotation.bounds.height = inputEleHeight;
            this.pdfViewer.nodePropertyChange(this.selectedAnnotation, {
                bounds: {
                    width: this.selectedAnnotation.bounds.width, height: this.selectedAnnotation.bounds.height, y: y, x: x
                }
            });
            this.pdfViewer.renderSelector(this.selectedAnnotation.pageIndex, this.selectedAnnotation.annotationSelectorSettings);
        }
        this.isInuptBoxInFocus = true;
        this.focusInputWithoutScroll(this.inputBoxElement);
        if (this.isNewFreeTextAnnot === true || this.inputBoxElement.value === this.defaultText) {
            this.inputBoxElement.select();
            this.pdfViewerBase.isFreeTextSelected = true;
        }
        this.currentPosition.push(parseInt(this.inputBoxElement.style.left, 10) / zoomFactor,
                                  parseInt(this.inputBoxElement.style.top, 10) / zoomFactor,
                                  parseInt(this.inputBoxElement.style.width, 10) / zoomFactor,
                                  parseInt(this.inputBoxElement.style.height, 10) / zoomFactor);
    }
    private applyFreetextStyles(zoomFactor: number, isReadonly?: boolean): void {
        this.inputBoxElement.style.height = (this.defaultHeight * zoomFactor) + 'px';
        this.inputBoxElement.style.width = (this.defautWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.borderWidth = (this.borderWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.fontSize = (this.fontSize * zoomFactor) + 'px';
        this.inputBoxElement.style.fontFamily = this.fontFamily;
        this.inputBoxElement.readOnly = isNullOrUndefined(isReadonly) ? this.isReadonly : isReadonly;
    }

    /**
     * @private
     * @returns {void}
     */
    public copySelectedText(): void {
        if (window.getSelection() !== null) {
            this.selectedText = window.getSelection().toString();
            const textArea: HTMLElement = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = this.selectedText;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            (textArea as HTMLInputElement).select();
            try {
                document.execCommand('copy');
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            } finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
        }
    }

    /**
     * @param {any} target - It describes about the target text
     * @private
     * @returns {void}
     */
    public pasteSelectedText(target: any): void {
        if (this.selectedText !== '' && target) {
            const text: any = target.value;
            target.value = text.slice(0, this.selectionStart) + this.selectedText + text.slice(this.selectionEnd, text.length);
        }
        const events: any = event;
        this.onKeyDownInputBox(events);
    }

    /**
     * @param {any} target - It describes the targeted selected text
     * @private
     * @returns {void}
     */
    public cutSelectedText(target: any): void {
        if (window.getSelection() !== null) {
            const text: any = target.value;
            this.selectedText = window.getSelection().toString();
            target.value = text.slice(0, target.selectionStart) + text.slice(target.selectionEnd);
            const textArea: HTMLElement = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = this.selectedText;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            (textArea as HTMLInputElement).select();
            try {
                document.execCommand('cut');
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            } finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
        }
    }

    /**
     * @param {any} shapeAnnotations - It describes about the shape annotations
     * @param {number} pageNumber - It describes about the page number value
     * @private
     * @returns {void}
     */
    public saveImportedFreeTextAnnotations(shapeAnnotations: any, pageNumber: number): void {
        const annotation: any = shapeAnnotations;
        if (annotation.AnnotType) {
            let vertexPoints: IPoint[] = null;
            if (annotation.VertexPoints) {
                vertexPoints = [];
                for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                    const point: IPoint = { x: annotation.VertexPoints[parseInt(j.toString(), 10)].X,
                        y: annotation.VertexPoints[parseInt(j.toString(), 10)].Y };
                    vertexPoints.push(point);
                }
            }
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings :
                this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
            annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions :
                this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            const annotationBoundsX: number = !isNullOrUndefined(annotation.Bounds.X) ? annotation.Bounds.X : annotation.Bounds.x;
            const annotationBoundsY: number = !isNullOrUndefined(annotation.Bounds.Y) ? annotation.Bounds.Y : annotation.Bounds.y;
            const annotationBoundsWidth: number = annotation.Bounds.Width ? annotation.Bounds.Width : annotation.Bounds.width;
            const annotationBoundsHeight: number = annotation.Bounds.Height ? annotation.Bounds.Height : annotation.Bounds.height;
            const annot: IFreeTextAnnotation = {
                author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext',
                rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                thickness: annotation.Thickness, fillColor: annotation.FillColor,
                bounds: {
                    x: annotationBoundsX, y: annotationBoundsY, left: annotationBoundsX, top: annotationBoundsY,
                    width: annotationBoundsWidth, height: annotationBoundsHeight, right: annotation.Bounds.Right,
                    bottom: annotation.Bounds.Bottom
                }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                comments: this.pdfViewer.annotationModule.
                    getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                review: { state: annotation.State, stateModel: annotation.StateModel,
                    modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic,
                    isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                customData: this.pdfViewer.annotation.getCustomData(annotation),
                isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock, isReadonly: annotation.IsReadonly
            };
            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annot, '_annotations_freetext');
        }
    }

    /**
     * @param {any} shapeAnnotations - It describes about the shape annotations
     * @param {number} pageNumber - It describes about the page number value
     * @private
     * @returns {void}
     */
    public updateFreeTextAnnotationCollections(shapeAnnotations: any, pageNumber: number): any {
        const annotation: any = shapeAnnotations;
        annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
        if (annotation.AnnotType) {
            let vertexPoints: IPoint[] = null;
            if (annotation.VertexPoints) {
                vertexPoints = [];
                for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                    const point: IPoint = { x: annotation.VertexPoints[parseInt(j.toString(), 10)].X,
                        y: annotation.VertexPoints[parseInt(j.toString(), 10)].Y };
                    vertexPoints.push(point);
                }
            }
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings :
                this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
            if (annotation.IsLocked) {
                annotation.AnnotationSettings.isLock = annotation.IsLocked;
            }
            annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions :
                this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            const annotationBoundsX: number = annotation.Bounds.X ? annotation.Bounds.X : annotation.Bounds.x;
            const annotationBoundsY: number = annotation.Bounds.Y ? annotation.Bounds.Y : annotation.Bounds.y;
            const width: number = annotation.Bounds.Width ? annotation.Bounds.Width : annotation.Bounds.width;
            const height: number = annotation.Bounds.Height ? annotation.Bounds.Height : annotation.Bounds.height;
            const annot: any = {
                author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext',
                rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                thickness: annotation.Thickness, fillColor: annotation.FillColor,
                bounds: {
                    x: annotationBoundsX, y: annotationBoundsY, left: annotationBoundsX, top: annotationBoundsY,
                    width: width, height: height, right: annotation.Bounds.Right,
                    bottom: annotation.Bounds.Bottom
                }, annotationId: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                fontFamily: annotation.FontFamily, notes: annotation.MarkupText,
                comments: this.pdfViewer.annotationModule.
                    getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                review: { state: annotation.State, stateModel: annotation.StateModel,
                    modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                customData: this.pdfViewer.annotation.getCustomData(annotation),
                font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic,
                    isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                pageNumber: pageNumber, annotationSettings: annotation.AnnotationSettings,
                isCommentLock: annotation.IsCommentLock, isReadonly: annotation.IsReadonly, isPrint: annotation.IsPrint
            };
            return annot;
        }
    }

    /**
     * This method used to add annotations with using program.
     *
     * @param {FreeTextSettings} annotationObject - This is annotation object
     * @param {IPoint} offset - It describes about the annotation bounds
     * @returns {object} - object
     * @private
     */
    public updateAddAnnotationDetails(annotationObject: FreeTextSettings, offset: IPoint): Object {
        //Creating new object if annotationObject is null
        if (!annotationObject) {
            annotationObject = { offset: { x: 1, y: 1 }, pageNumber: 0, width: undefined, height: undefined } as FreeTextSettings;
            offset = annotationObject.offset;
        }
        else if (!annotationObject.offset)
        {offset = { x: 1, y: 1 }; }
        else
        {offset = annotationObject.offset; }
        //Creating the CurrentDate and Annotation name
        const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        const fontStyle: FontStyle = annotationObject.fontStyle ? annotationObject.fontStyle : FontStyle.None;
        //Creating annotation settings
        const annotationSelectorSettings: any = this.pdfViewer.freeTextSettings.annotationSelectorSettings;
        this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
        const annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
        const allowedInteractions: any = this.pdfViewer.freeTextSettings.allowedInteractions ?
            this.pdfViewer.freeTextSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
        annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('freeText', annotationSettings.annotationSubType);
        annotationSettings.isLock = annotationObject.isLock ? annotationObject.isLock : annotationSettings.isLock;
        if (this.pdfViewer.freeTextSettings.isLock || this.pdfViewer.annotationSettings.isLock ||
             this.pdfViewer.freeTextSettings.isReadonly) {
            annotationObject.isReadonly = true;
        }
        annotationSettings.minHeight = annotationObject.minHeight ? annotationObject.minHeight : 0;
        annotationSettings.minWidth = annotationObject.minWidth ? annotationObject.minWidth : 0;
        annotationSettings.maxWidth = annotationObject.maxWidth ? annotationObject.maxWidth : 0;
        annotationSettings.maxHeight = annotationObject.maxHeight ? annotationObject.maxHeight : 0;
        annotationObject.width = annotationObject.width ? annotationObject.width : 150;
        annotationObject.height = annotationObject.height ? annotationObject.height : 24.6;
        //Creating Annotation objects with it's proper properties
        const freeTextAnnotation: any = [];
        const freeText: any = {
            AllowedInteractions: annotationObject.allowedInteractions ? annotationObject.allowedInteractions : allowedInteractions,
            AnnotName: annotationName,
            AnnotType: 'freeText',
            AnnotationFlags: 'Default',
            AnnotationIntent: null,
            AnnotationSelectorSettings: annotationObject.annotationSelectorSettings ?
                annotationObject.annotationSelectorSettings : annotationSelectorSettings,
            AnnotationSettings: annotationSettings,
            Author: annotationObject.author ? annotationObject.author : 'Guest',
            Border: { HorizontalRadius: 0, VerticalRadius: 0, Width: !isNullOrUndefined(annotationObject.borderWidth) ?
                annotationObject.borderWidth : 1 },
            BorderColor: { IsEmpty: true, B: 255, Blue: 1, C: 0, G: 255 },
            Bounds: { X: offset.x, Y: offset.y, Width: annotationObject.width,
                Height: annotationObject.height, Left: offset.x, Top: offset.y, Right: offset.x + annotationObject.width,
                Bottom: offset.y + annotationObject.height },
            CalloutLines: null,
            Color: { IsEmpty: false, B: 51, Blue: 0.2, C: 0, G: 255 },
            Comments: null,
            CreatedDate: currentDateString,
            CustomData: annotationObject.customData ? annotationObject.customData : null,
            ExistingCustomData: null,
            FillColor: annotationObject.fillColor ? annotationObject.fillColor : '#ffffff00',
            Flatten: false,
            FlattenPopups: false,
            Font: { Bold: (fontStyle & FontStyle.Bold) === FontStyle.Bold,
                Italic: (fontStyle & FontStyle.Italic) === FontStyle.Italic,
                Strikeout: (fontStyle & FontStyle.Strikethrough) === FontStyle.Strikethrough,
                Underline: (fontStyle & FontStyle.Underline) === FontStyle.Underline },
            FontColor: annotationObject.fontColor ? annotationObject.fontColor : '#000',
            FontFamily: annotationObject.fontFamily ? annotationObject.fontFamily : 'Helvetica',
            FontSize: annotationObject.fontSize ? annotationObject.fontSize : 16,
            FreeTextAnnotationType: 'Text Box',
            InnerColor: null,
            IsCommentLock: false,
            IsLock: annotationObject.isLock ? annotationObject.isLock : false,
            IsPrint: !isNullOrUndefined(annotationObject.isPrint) ? annotationObject.isPrint : true,
            Layer: null,
            LineEndingStyle: 'OpenArrow',
            Location: null,
            MarkupText: annotationObject.defaultText ? annotationObject.defaultText : 'Type Here',
            ModifiedDate: '',
            Name: annotationName,
            Opacity: annotationObject.opacity ? annotationObject.opacity : 1,
            Page: null,
            PageTags: null,
            ReviewHistory: null,
            Rotate: 0,
            IsReadonly: annotationObject.isReadonly ? annotationObject.isReadonly : false,
            State: 'Unmarked',
            StateModel: 'None',
            StrokeColor: annotationObject.borderColor ? annotationObject.borderColor : '#ffffff00',
            Subject: annotationObject.subject ? annotationObject.subject : 'Text Box',
            Text: annotationObject.defaultText ? annotationObject.defaultText : 'Type Here',
            TextAlign: annotationObject.textAlignment ? annotationObject.textAlignment : 'Left',
            TextMarkupColor: null,
            Thickness: !isNullOrUndefined(annotationObject.borderWidth) ? annotationObject.borderWidth : 1,
            isAddAnnotationProgramatically: true
        };
        //Adding the annotation object to an array and return it
        freeTextAnnotation[0] = freeText;
        return { freeTextAnnotation };
    }

    /**
     * This method used to get the padding.
     *
     * @param {number} fontSize - This is font size
     * @returns {any} - any
     */
    private getPaddingValues(fontSize: number): any {
        const leftPadding: number = 4; // Left padding used in the drawing.js
        let topPadding: number = 5; // Top padding used in the drawing.js
        const inputBoxpadding: number = 2; // we have set the input box padding for the free text.
        topPadding = (topPadding - inputBoxpadding) * (fontSize / 16);
        return [leftPadding, topPadding];
    }

    /**
     * @param {any} currentPosition - currentPosition
     * @private
     * @returns {void}
     */
    public addInputInZoom(currentPosition: any): void {
        const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        this.inputBoxElement.style.left = (currentPosition.x * zoomFactor) + 'px';
        this.inputBoxElement.style.top = (currentPosition.y * zoomFactor) + 'px';
        this.inputBoxElement.style.height = (currentPosition.height * zoomFactor) + 'px';
        this.inputBoxElement.style.width = (currentPosition.width * zoomFactor) + 'px';
        this.inputBoxElement.style.borderWidth = (this.borderWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.fontSize = (this.fontSize * zoomFactor) + 'px';
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.inputBoxElement) {
            this.inputBoxElement.removeEventListener('focusout', this.onFocusOutInputBox.bind(this));
            this.inputBoxElement.removeEventListener('keydown', this.onKeyDownInputBox.bind(this));
            this.inputBoxElement.removeEventListener('mouseup', this.onMouseUpInputBox.bind(this));
        }
        this.currentAnnotationMode = null;
        this.opacity = null;
        this.borderColor = null;
        this.borderWidth = null;
        this.defautWidth = null;
        this.defaultHeight = null;
        this.inputBoxElement = null;
        this.borderStyle = null;
        this.author = null;
        this.subject = null;
        this.isNewFreeTextAnnot = null;
        this.isNewAddedAnnot = null;
        this.inputBoxCount = null;
        this.selectedAnnotation = null;
        this.isFreeTextValueChange = null;
        this.isAddAnnotationProgramatically = null;
        this.isInuptBoxInFocus = null;
        this.fontSize = null;
        this.annodationIntent = null;
        this.annotationFlags = null;
        this.fillColor = null;
        this.fontColor = null;
        this.fontFamily = null;
        this.freeTextPageNumbers = null;
        this.selectedText = null;
        this.isTextSelected = null;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.isBold = null;
        this.isItalic = null;
        this.isUnderline = null;
        this.isStrikethrough = null;
        this.textAlign = null;
        this.defaultText = null;
        this.isReadonly = null;
        this.isMaximumWidthReached = null;
        this.padding = null;
        this.wordBreak = null;
        this.freeTextPaddingLeft = null;
        this.freeTextPaddingTop = null;
        this.defaultFontSize = null;
        this.lineGap = null;
        this.previousText = null;
        this.currentPosition = null;
    }
}

interface RGBA {
    r: number
    g: number
    b: number
    a: number
}
