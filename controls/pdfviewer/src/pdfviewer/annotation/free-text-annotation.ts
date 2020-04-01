import {
    PdfViewer, PdfViewerBase, IPageAnnotations, IPoint, AnnotationType as AnnotType, ICommentsCollection, IReviewCollection
} from '../..';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBase } from '../../diagram/pdf-annotation';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { AnnotationSelectorSettings } from '../pdfviewer';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';

/**
 * @hidden
 */
export interface IFreeTextAnnotation {
    shapeAnnotationType: string;
    author: string;
    modifiedDate: string;
    subject: string;
    note: string;
    opacity: number;
    // tslint:disable-next-line
    bounds: any;
    thickness: number;
    borderStyle: string;
    borderDashArray: number;
    rotateAngle: string;
    isLocked: boolean;
    id: string;
    annotName: string;
    position?: string;
    fillColor: string;
    strokeColor: string;
    dynamicText: string;
    fontColor: string;
    fontSize: number;
    fontFamily: string;
    textAlign: string;
    // tslint:disable-next-line
    font: any;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    // tslint:disable-next-line
    annotationSettings?: any;
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
    // tslint:disable-next-line
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
    // tslint:disable-next-line
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
        this.inputBoxElement.style.padding = '2px';
        this.inputBoxElement.style.borderRadius = '2px';
        this.inputBoxElement.style.fontFamily = this.fontFamily;
        this.inputBoxElement.style.color = this.pdfViewer.freeTextSettings.fontColor ?
            this.pdfViewer.freeTextSettings.fontColor : '#000';
        this.inputBoxElement.style.overflow = 'hidden';
        this.inputBoxElement.style.wordBreak = 'break-all';
        this.inputBoxElement.addEventListener('focusout', this.onFocusOutInputBox.bind(this));
        this.inputBoxElement.addEventListener('keydown', this.onKeyDownInputBox.bind(this));
        this.inputBoxElement.addEventListener('mouseup', this.onMouseUpInputBox.bind(this));

        this.freeTextPageNumbers = [];
    }

    /**
     * @private
     */
    public updateTextProperties(): void {
        this.defautWidth = this.pdfViewer.freeTextSettings.width ? this.pdfViewer.freeTextSettings.width : 151;
        this.defaultHeight = this.pdfViewer.freeTextSettings.height ? this.pdfViewer.freeTextSettings.height : 24.6;
        this.borderColor = this.pdfViewer.freeTextSettings.borderColor ? this.pdfViewer.freeTextSettings.borderColor : '#ffffff00';
        this.fillColor = this.pdfViewer.freeTextSettings.fillColor ? this.pdfViewer.freeTextSettings.fillColor : '#fff';
        this.borderStyle = this.pdfViewer.freeTextSettings.borderStyle ? this.pdfViewer.freeTextSettings.borderStyle : 'solid';
        this.borderWidth = this.pdfViewer.freeTextSettings.borderWidth ? this.pdfViewer.freeTextSettings.borderWidth : 1;
        this.fontSize = this.pdfViewer.freeTextSettings.fontSize ? this.pdfViewer.freeTextSettings.fontSize : 16;
        this.opacity = this.pdfViewer.freeTextSettings.opacity ? this.pdfViewer.freeTextSettings.opacity : 1;
        this.fontColor = this.pdfViewer.freeTextSettings.fontColor ? this.pdfViewer.freeTextSettings.fontColor : '#000';
        // tslint:disable-next-line:max-line-length
        this.author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.freeTextSettings.author ? this.pdfViewer.freeTextSettings.author : 'Guest';
        this.fontFamily = this.pdfViewer.freeTextSettings.fontFamily ? this.pdfViewer.freeTextSettings.fontFamily : 'Helvetica';
        this.textAlign = this.pdfViewer.freeTextSettings.textAlignment ? this.pdfViewer.freeTextSettings.textAlignment : 'Left';
        this.defaultText = this.pdfViewer.freeTextSettings.defaultText ? this.pdfViewer.freeTextSettings.defaultText : 'Type here';
        if (this.pdfViewer.freeTextSettings.fontStyle === 1) {
            this.isBold = true;
        } else if (this.pdfViewer.freeTextSettings.fontStyle === 2) {
            this.isItalic = true;
        } else if (this.pdfViewer.freeTextSettings.fontStyle === 4) {
            this.isUnderline = true;
        } else if (this.pdfViewer.freeTextSettings.fontStyle === 8) {
            this.isStrikethrough = true;
        } else if (3 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isItalic = true;
        } else if (5 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isUnderline = true;
        } else if (9 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isStrikethrough = true;
        } else if (7 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isItalic = true;
            this.isUnderline = true;
        } else if (11 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isItalic = true;
            this.isStrikethrough = true;
        } else if (14 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isUnderline = true;
            this.isStrikethrough = true;
        } else if (6 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isUnderline = true;
            this.isItalic = true;
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderFreeTextAnnotations(shapeAnnotations: any, pageNumber: number, isImportAction?: boolean): void {
        let isFreeTextAdded: boolean = false;
        if (!isImportAction) {
            for (let p: number = 0; p < this.freeTextPageNumbers.length; p++) {
                if (this.freeTextPageNumbers[p] === pageNumber) {
                    isFreeTextAdded = true;
                    break;
                }
            }
        }
        if (shapeAnnotations && !isFreeTextAdded) {
            if (shapeAnnotations.length >= 1) {
                this.freeTextPageNumbers.push(pageNumber);
                for (let i: number = 0; i < shapeAnnotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation: any = shapeAnnotations[i];
                    if (annotation.AnnotType) {
                        let vertexPoints: IPoint[] = null;
                        if (annotation.VertexPoints) {
                            vertexPoints = [];
                            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                                let point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                                vertexPoints.push(point);
                            }
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
                        let annot: PdfAnnotationBaseModel;
                        // tslint:disable-next-line
                        annot = {
                            author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext' + i,
                            rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                            thickness: annotation.Thickness, fillColor: annotation.FillColor,
                            bounds: {
                                x: annotation.Bounds.X, y: annotation.Bounds.Y, left: annotation.Bounds.X, top: annotation.Bounds.Y,
                                width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right,
                                bottom: annotation.Bounds.Bottom
                            }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                            // tslint:disable-next-line
                            pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                            fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                            // tslint:disable-next-line
                            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                            review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                            // tslint:disable-next-line:max-line-length
                            font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic, isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                            annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                            customData: this.pdfViewer.annotation.getCustomData(annotation)
                        };
                        if (isImportAction) {
                            annot.id = annotation.AnnotName;
                        }
                        let addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annot, '_annotations_freetext');
                        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                        this.pdfViewer.nodePropertyChange(addedAnnot, {});
                        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public getSettings(annotation : any) : any {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        } else if (this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.freeTextSettings.annotationSelectorSettings;
        }
        return selector;
    }
    /**
     * @private
     */
    public setAnnotationType(type: AnnotType): void {
        let date: Date = new Date();
        this.pdfViewerBase.disableTextSelectionMode();
        switch (type) {
            case 'FreeText':
                this.currentAnnotationMode = 'FreeText';
                this.updateTextProperties();
                // tslint:disable-next-line:max-line-length
                let modifiedDateRect: string = this.pdfViewer.freeTextSettings.modifiedDate ? this.pdfViewer.freeTextSettings.modifiedDate : date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: 'FreeText', strokeColor: this.borderColor,
                    fillColor: this.fillColor, opacity: this.opacity, notes: '',
                    thickness: this.borderWidth, borderDashArray: '0', modifiedDate: modifiedDateRect,
                    // tslint:disable-next-line:max-line-length
                    author: this.pdfViewer.freeTextSettings.author, subject: this.pdfViewer.freeTextSettings.subject, font: { isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough, isUnderline: this.isUnderline }, textAlign: this.textAlign
                };
                this.pdfViewer.tool = 'Select';
                break;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any): IFreeTextAnnotation {
        this.pdfViewerBase.isDocumentEdited = true;
        let currentAnnotObject: IFreeTextAnnotation = null;
        let pageAnnotations: IFreeTextAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'fill') {
                        pageAnnotations[i].fillColor = annotationBase.wrapper.children[0].style.fill;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'notes') {
                        pageAnnotations[i].note = annotationBase.notes;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    } else if (property === 'dynamicText') {
                        pageAnnotations[i].dynamicText = annotationBase.dynamicText;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'fontColor') {
                        pageAnnotations[i].fontColor = annotationBase.fontColor;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'fontSize') {
                        pageAnnotations[i].fontSize = annotationBase.fontSize;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'fontFamily') {
                        pageAnnotations[i].fontFamily = annotationBase.fontFamily;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'textPropertiesChange') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].font = { isBold: annotationBase.font.isBold, isItalic: annotationBase.font.isItalic, isStrikeout: annotationBase.font.isStrikeout, isUnderline: annotationBase.font.isUnderline };
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'textAlign') {
                        pageAnnotations[i].textAlign = annotationBase.textAlign;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }

    /**
     * @private
     */
    public addInCollection(pageNumber: number, annotationBase: IFreeTextAnnotation): void {
        if (annotationBase) {
            let pageAnnotations: IFreeTextAnnotation[] = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
    }

    /**
     * @private
     */
    public saveFreeTextAnnotations(): string {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'];
        }
        // tslint:disable-next-line
        let annotations: Array<any> = new Array();
        let colorpick: ColorPicker = new ColorPicker();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject && this.pdfViewer.annotationSettings.isDownload) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IFreeTextAnnotation[] = [];
                let pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        let strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        let fillColorString: string = pageAnnotationObject.annotations[z].fillColor;
                        pageAnnotationObject.annotations[z].fillColor = JSON.stringify(this.getRgbCode(fillColorString));
                        let fontColorString: string = pageAnnotationObject.annotations[z].fontColor;
                        pageAnnotationObject.annotations[z].fontColor = JSON.stringify(this.getRgbCode(fontColorString));
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].vertexPoints = JSON.stringify(pageAnnotationObject.annotations[z].vertexPoints);
                        if (pageAnnotationObject.annotations[z].rectangleDifference !== null) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].rectangleDifference = JSON.stringify(pageAnnotationObject.annotations[z].rectangleDifference);
                        }
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }

    private manageAnnotations(pageAnnotations: IFreeTextAnnotation[], pageNumber: number): void {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'];
        }
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_freetext');
            }
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_freetext', annotationStringified);
            }
        }
    }

    // tslint:disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'];
        }
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            } else {
                annotationCollection = shapeAnnotations;
            }
        } else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    }

    // tslint:disable-next-line
    private getRgbCode(colorString: string): any {
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            let colorpick: ColorPicker = new ColorPicker();
            colorString = colorpick.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // tslint:disable-next-line:radix
        let r: number = parseInt(stringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        let g: number = parseInt(stringArray[1]);
        // tslint:disable-next-line:radix
        let b: number = parseInt(stringArray[2]);
        // tslint:disable-next-line:radix
        let a: number = parseInt(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public onFocusOutInputBox(): void {
        if (!this.pdfViewerBase.isFreeTextContextMenu) {
            let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
            let inputEleHeight: number = parseFloat(this.inputBoxElement.style.height);
            let inputEleWidth: number = parseFloat(this.inputBoxElement.style.width);
            let inputEleLeft: number = parseFloat(this.inputBoxElement.style.left);
            let inputEleTop: number = parseFloat(this.inputBoxElement.style.top);
            let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            let inputValue: string = this.inputBoxElement.value;
            if (this.isNewFreeTextAnnot === true) {
                let currentDateString: string = new Date().toLocaleString();
                let annotationName: string = this.pdfViewer.annotation.createGUID();
                this.isNewFreeTextAnnot = false;
                let annot: PdfAnnotationBaseModel;
                let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('freeText', pageIndex + 1);
                if (commentsDivid) {
                    document.getElementById(commentsDivid).id = annotationName;
                }
                // tslint:disable-next-line
                let annotationSelectorSettings: any = this.pdfViewer.freeTextSettings.annotationSelectorSettings ? this.pdfViewer.freeTextSettings.annotationSelectorSettings: this.pdfViewer.annotationSelectorSettings;
                // tslint:disable-next-line
                let annotationSettings: any =  this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
                // tslint:disable-next-line
                annot = {
                    author: this.author, modifiedDate: currentDateString, subject: 'Text Box', id: 'free_text' + this.inputBoxCount,
                    // tslint:disable-next-line:max-line-length
                    rotateAngle: 0, dynamicText: '', strokeColor: this.borderColor, thickness: this.borderWidth, fillColor: this.fillColor,
                    bounds: {
                        left: inputEleLeft / zoomFactor, top: inputEleTop / zoomFactor, x: inputEleLeft / zoomFactor,
                        y: inputEleTop / zoomFactor, width: this.defautWidth, height: this.defaultHeight,
                    }, annotName: annotationName,
                    shapeAnnotationType: 'FreeText', pageIndex: pageIndex, fontColor: this.fontColor, fontSize: this.fontSize,
                    fontFamily: this.fontFamily, opacity: this.opacity, comments: [], textAlign: this.textAlign,
                    // tslint:disable-next-line:max-line-length
                    font: { isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough, isUnderline: this.isUnderline },
                    review: { state: 'Unmarked', stateModel: 'None', modifiedDate: currentDateString, author: this.author },
                    // tslint:disable-next-line:max-line-length
                    annotationSelectorSettings: annotationSelectorSettings, annotationSettings: annotationSettings,
                    customData: this.pdfViewer.freeTextSettings.customData
                };
                if (this.pdfViewer.enableRtl) {
                    annot.textAlign = 'Right';
                }
                let annotation: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                // tslint:disable-next-line
                let bounds: any = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
                this.pdfViewerBase.isDocumentEdited = true;
                // tslint:disable-next-line
                let settings: any = {
                    opacity: annot.opacity, borderColor: annot.strokeColor, borderWidth: annot.thickness, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                    // tslint:disable-next-line
                    fillColor: annot.fillColor, fontSize: annot.fontSize, width: annot.bounds.width, height: annot.bounds.height, fontColor: annot.fontColor, fontFamily: annot.fontFamily, defaultText: annot.dynamicText, fontStyle: annot.font, textAlignment: annot.textAlign
                };
                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'FreeText', bounds, settings);
                // tslint:disable-next-line
                this.pdfViewer.annotation.addAction(pageIndex, null, annot as PdfAnnotationBase, 'Addition', '', annot as PdfAnnotationBase, annot);
                this.pdfViewer.annotation.storeAnnotations(pageIndex, annot, '_annotations_freetext');
                this.pdfViewer.renderSelector((annot as PdfAnnotationBaseModel).pageIndex);
                this.pdfViewer.clearSelection(annot.pageIndex);
                this.selectedAnnotation = annotation;
            }
            this.isInuptBoxInFocus = false;
            // tslint:disable-next-line
            if (this.selectedAnnotation && this.pdfViewer.selectedItems.annotations) {
                inputEleWidth = ((inputEleWidth - 1) / zoomFactor);
                inputEleHeight = ((inputEleHeight - 1) / zoomFactor);
                let heightDiff: number = (inputEleHeight - this.selectedAnnotation.bounds.height);
                let y: number = undefined;
                if (heightDiff > 0) {
                    y = this.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
                    y = y > 0 ? y : undefined;
                }
                this.selectedAnnotation.bounds.width = inputEleWidth;
                this.selectedAnnotation.bounds.height = inputEleHeight;
                this.pdfViewer.annotation.modifyDynamicTextValue(inputValue, this.selectedAnnotation.annotName);
                this.selectedAnnotation.dynamicText = inputValue;
                this.modifyInCollection('dynamicText', pageIndex, this.selectedAnnotation);
                // tslint:disable-next-line
                this.pdfViewer.nodePropertyChange(this.selectedAnnotation, { bounds: { width: this.selectedAnnotation.bounds.width, height: this.selectedAnnotation.bounds.height, y: y } });
                // tslint:disable-next-line
                let commentsDiv: any = document.getElementById(this.selectedAnnotation.annotName);
                if (commentsDiv && commentsDiv.childNodes) {
                    if (commentsDiv.childNodes[0].ej2_instances) {
                        commentsDiv.childNodes[0].ej2_instances[0].value = inputValue;
                    } else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                        commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = inputValue;
                    }
                }
                this.pdfViewer.renderSelector(this.selectedAnnotation.pageIndex, this.selectedAnnotation.annotationSelectorSettings);
            }
            this.isNewFreeTextAnnot = false;
            if (this.inputBoxElement.parentElement) {
                if (pageDiv && (pageDiv.id === this.inputBoxElement.parentElement.id)) {
                    pageDiv.removeChild(this.inputBoxElement);
                } else {
                    this.inputBoxElement.parentElement.removeChild(this.inputBoxElement);
                }
            }
            let canvass: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, pageIndex);
            this.inputBoxCount += 1;
        } else {
            this.inputBoxElement.focus();
            if (!this.isTextSelected) {
                window.getSelection().removeAllRanges();
            }
        }
    }

    /**
     * @private
     */
    public onKeyDownInputBox(event: KeyboardEvent): void {
        this.selectedAnnotation = this.pdfViewer.selectedItems.annotations ? this.pdfViewer.selectedItems.annotations[0]
            : this.selectedAnnotation;
        let inuptEleObj: FreeTextAnnotation = this;
        if (event.which === 9) {
            event.preventDefault();
        }
        setTimeout(() => {
            if (inuptEleObj.defaultHeight < inuptEleObj.inputBoxElement.scrollHeight
                // tslint:disable-next-line:radix
                && parseInt(inuptEleObj.inputBoxElement.style.height) < inuptEleObj.inputBoxElement.scrollHeight) {
                inuptEleObj.updateFreeTextAnnotationSize(true);
            } else {
                inuptEleObj.updateFreeTextAnnotationSize(false);
            }
            // tslint:disable-next-line
        }, 0);
    }

    private updateFreeTextAnnotationSize(isSize : boolean): void {
        let inuptEleObj: FreeTextAnnotation = this;
        if (!isSize) {
            inuptEleObj.inputBoxElement.style.height = 'auto';
        }
        inuptEleObj.inputBoxElement.style.height = inuptEleObj.inputBoxElement.scrollHeight + 5 + 'px';
        let inputEleHeight: number = parseFloat(this.inputBoxElement.style.height);
        let inputEleWidth: number = parseFloat(this.inputBoxElement.style.width);
        inputEleHeight = ((inputEleHeight - 1) / inuptEleObj.pdfViewerBase.getZoomFactor());
        inputEleWidth = ((inputEleWidth - 1) / inuptEleObj.pdfViewerBase.getZoomFactor());
        if (this.selectedAnnotation) {
            let heightDiff: number = (inputEleHeight - inuptEleObj.selectedAnnotation.bounds.height);
            let y: number = 0;
            if (heightDiff > 0) {
                y = inuptEleObj.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
            } else {
                heightDiff = Math.abs(heightDiff);
                y = inuptEleObj.selectedAnnotation.wrapper.offsetY - (heightDiff / 2);
            }
            inuptEleObj.selectedAnnotation.bounds.width = inputEleWidth;
            inuptEleObj.selectedAnnotation.bounds.height = inputEleHeight;
            // tslint:disable-next-line
            inuptEleObj.pdfViewer.nodePropertyChange(inuptEleObj.selectedAnnotation, { bounds: { width: inuptEleObj.selectedAnnotation.bounds.width, height: inuptEleObj.selectedAnnotation.bounds.height, y: y } });
            inuptEleObj.pdfViewer.renderSelector(inuptEleObj.selectedAnnotation.pageIndex,  this.selectedAnnotation.annotationSelectorSettings);
        }
    }

    /**
     * @private
     */
    public onMouseUpInputBox(event: MouseEvent): void {
        // tslint:disable-next-line
        let target: any = event.target;
        this.selectionStart = 0;
        this.selectionEnd = 0;
        if (event.which === 3 && target) {
            this.selectionStart = target.selectionStart;
            this.selectionEnd = target.selectionEnd;
        }
        if (event.which === 3 && window.getSelection() != null && window.getSelection().toString() !== '') {
            this.isTextSelected = true;

        } else {
            this.isTextSelected = false;
        }
    }

    /**
     * @private
     */
    public addInuptElemet(currentPosition: PointModel, annotation: PdfAnnotationBaseModel = null): void {
        let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
        let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        this.inputBoxElement.value = (annotation && annotation.dynamicText) ? annotation.dynamicText : this.defaultText;
        this.inputBoxElement.style.boxSizing = 'border-box';
        this.inputBoxElement.style.left = ((currentPosition.x)) + 'px';
        this.inputBoxElement.style.top = ((currentPosition.y)) + 'px';
        this.inputBoxElement.style.height = (this.defaultHeight * zoomFactor) + 'px';
        this.inputBoxElement.style.width = (this.defautWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.borderWidth = (this.borderWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.fontSize = (this.fontSize * zoomFactor) + 'px';
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
            this.pdfViewer.clearSelection(pageIndex);
        }
        if (annotation && annotation.wrapper && annotation.wrapper.bounds) {
            if (annotation.wrapper.bounds.left) {
                this.inputBoxElement.style.left = ((annotation.wrapper.bounds.left) * zoomFactor) + 'px';
            }
            if (annotation.wrapper.bounds.top) {
                this.inputBoxElement.style.top = ((annotation.wrapper.bounds.top) * zoomFactor) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            this.inputBoxElement.style.height = annotation.wrapper.bounds.height ? (annotation.wrapper.bounds.height * zoomFactor) + 1 + 'px' : (this.defaultHeight * zoomFactor) + 'px';
            // tslint:disable-next-line:max-line-length
            this.inputBoxElement.style.width = annotation.wrapper.bounds.width ? (annotation.wrapper.bounds.width * zoomFactor) + 1 + 'px' : (this.defautWidth * zoomFactor) + 'px';
            this.selectedAnnotation = annotation;
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
            this.pdfViewer.nodePropertyChange(this.selectedAnnotation, {});
        }
        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
        pageDiv.appendChild(this.inputBoxElement);
        if (this.defaultHeight < this.inputBoxElement.scrollHeight
            // tslint:disable-next-line:radix
            && parseInt(this.inputBoxElement.style.height) < this.inputBoxElement.scrollHeight) {
            this.inputBoxElement.style.height = this.inputBoxElement.scrollHeight + 5 + 'px';
        }
        this.isInuptBoxInFocus = true;
        this.inputBoxElement.focus();
        if (this.isNewFreeTextAnnot === true || this.inputBoxElement.value === this.defaultText) {
            this.inputBoxElement.select();
        }
    }
    /**
     * @private
     */
    public copySelectedText(): void {
        if (window.getSelection() !== null) {
            this.selectedText = window.getSelection().toString();
            let textArea: HTMLElement = document.createElement('textarea');
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
     * @private
     */
    // tslint:disable-next-line
    public pasteSelectedText(target: any): void {
        if (this.selectedText !== '' && target) {
            // tslint:disable-next-line
            let text: any = target.value;
            target.value = text.slice(0, this.selectionStart) + this.selectedText + text.slice(this.selectionEnd, text.length);
        }
        // tslint:disable-next-line
        let events: any = event;
        this.onKeyDownInputBox(events);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public cutSelectedText(target: any): void {
        if (window.getSelection() !== null) {
            // tslint:disable-next-line
            let text: any = target.value;
            this.selectedText = window.getSelection().toString();
            target.value = text.slice(0, target.selectionStart) + text.slice(target.selectionEnd);
            let textArea: HTMLElement = document.createElement('textarea');
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
     * @private
     */
    // tslint:disable-next-line
    public saveImportedFreeTextAnnotations(shapeAnnotations: any, pageNumber: number): void {
        // tslint:disable-next-line
        let annotation: any = shapeAnnotations;
        if (annotation.AnnotType) {
            let vertexPoints: IPoint[] = null;
            if (annotation.VertexPoints) {
                vertexPoints = [];
                for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                    let point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                    vertexPoints.push(point);
                }
            }
            // tslint:disable-next-line:max-line-length
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
            let annot: PdfAnnotationBaseModel;
            // tslint:disable-next-line
            annot = {
                author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext',
                rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                thickness: annotation.Thickness, fillColor: annotation.FillColor,
                bounds: {
                    x: annotation.Bounds.X, y: annotation.Bounds.Y, left: annotation.Bounds.X, top: annotation.Bounds.Y,
                    width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right,
                    bottom: annotation.Bounds.Bottom
                }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                // tslint:disable-next-line
                pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                // tslint:disable-next-line
                comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic, isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                customData: this.pdfViewer.annotation.getCustomData(annotation)
            };
            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annot, '_annotations_freetext');
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateFreeTextAnnotationCollections(shapeAnnotations: any, pageNumber: number): void {
        // tslint:disable-next-line
        let annotation: any = shapeAnnotations;
        if (annotation.AnnotType) {
            let vertexPoints: IPoint[] = null;
            if (annotation.VertexPoints) {
                vertexPoints = [];
                for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                    let point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                    vertexPoints.push(point);
                }
            }
            // tslint:disable-next-line:max-line-length
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
            // tslint:disable-next-line
            let annot: any;
            annot = {
                author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext',
                rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                thickness: annotation.Thickness, fillColor: annotation.FillColor,
                bounds: {
                    x: annotation.Bounds.X, y: annotation.Bounds.Y, left: annotation.Bounds.X, top: annotation.Bounds.Y,
                    width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right,
                    bottom: annotation.Bounds.Bottom
                }, annotationId: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                // tslint:disable-next-line
                pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                fontFamily: annotation.FontFamily, notes: annotation.MarkupText,
                // tslint:disable-next-line
                comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic, isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline }, pageNumber: pageNumber, annotationSettings: annotation.AnnotationSettings
            };
            return annot;
        }
    }
}