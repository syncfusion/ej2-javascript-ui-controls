/* eslint-disable */
import {
    PdfViewer, PdfViewerBase, IRectangle, ISelection, AnnotationType, IPageAnnotations, ICommentsCollection,
    IReviewCollection,
    ISize,
    AllowedInteraction
} from '../index';
import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { AnnotationSelectorSettings } from '../pdfviewer';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
/**
 * @hidden
 */
export interface ITextMarkupAnnotation {
    textMarkupAnnotationType: string
    author: string
    subject: string
    modifiedDate: string
    note: string
    // eslint-disable-next-line
    bounds: any;
    // eslint-disable-next-line
    color: any;
    opacity: number
    // eslint-disable-next-line
    rect: any;
    comments: ICommentsCollection[]
    review: IReviewCollection
    annotName: string
    shapeAnnotationType: string
    position?: string
    pageNumber: number
    textMarkupContent: string
    textMarkupStartIndex: number
    textMarkupEndIndex: number
    annotationSelectorSettings: AnnotationSelectorSettingsModel
    customData: object
    isMultiSelect?: boolean
    // eslint-disable-next-line
    annotNameCollection?: any[];
    // eslint-disable-next-line
    annotpageNumbers?: any[];
    annotationAddMode: string
    // eslint-disable-next-line
    annotationSettings?: any;
    allowedInteractions?: AllowedInteraction
    isPrint: boolean
    isCommentLock: boolean
}

/**
 * @hidden
 */
export interface IPageAnnotationBounds {
    pageIndex: number
    bounds: IRectangle[]
    // eslint-disable-next-line
    rect: any;
    startIndex?: number
    endIndex?: number
    textContent?: string
}

/**
 * The `TextMarkupAnnotation` module is used to handle text markup annotation actions of PDF viewer.
 *
 * @hidden
 */
export class TextMarkupAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public isTextMarkupAnnotationMode: boolean;
    /**
     * @private
     */
    public currentTextMarkupAddMode: string = '';
    /**
     * @private
     */
    public highlightColor: string;
    /**
     * @private
     */
    public underlineColor: string;
    /**
     * @private
     */
    public strikethroughColor: string;
    /**
     * @private
     */
    public highlightOpacity: number;
    /**
     * @private
     */
    public underlineOpacity: number;
    /**
     * @private
     */
    public annotationAddMode: string;
    /**
     * @private
     */
    public strikethroughOpacity: number;
    /**
     * @private
     */
    public selectTextMarkupCurrentPage: number = null;
    /**
     * @private
     */
    public currentTextMarkupAnnotation: ITextMarkupAnnotation = null;
    private currentAnnotationIndex: number = null;
    private isAnnotationSelect: boolean = false;
    // eslint-disable-next-line
    private dropDivAnnotationLeft: any;
    // eslint-disable-next-line
    private dropDivAnnotationRight: any;
    // eslint-disable-next-line
    private dropElementLeft: any;
    // eslint-disable-next-line
    private dropElementRight: any;
    /**
     * @private
     */
    public isDropletClicked: boolean = false;
    /**
     * @private
     */
    public isRightDropletClicked: boolean = false;
    /**
     * @private
     */
    public isLeftDropletClicked: boolean = false;
    /**
     * @private
     */
    public isSelectionMaintained: boolean = false;
    private isExtended: boolean = false;
    private isNewAnnotation: boolean = false;
    private selectedTextMarkup: ITextMarkupAnnotation = null;
    private multiPageCollection: ITextMarkupAnnotation[] = [];
    private triggerAddEvent: boolean = false;
    /**
     * @private
     */
    public isSelectedAnnotation: boolean = false;
    private dropletHeight: number = 20;
    /**
     * @private
     */
    public annotationClickPosition: object = {};
    /**
     * @param pdfViewer
     * @param viewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * @private
     */
    public createAnnotationSelectElement(): void {
        // eslint-disable-next-line max-len
        this.dropDivAnnotationLeft = createElement('div', { id: this.pdfViewer.element.id + '_droplet_left', className: 'e-pv-drop' });
        this.dropDivAnnotationLeft.style.borderRight = '2px solid';
        // eslint-disable-next-line max-len
        this.dropDivAnnotationRight = createElement('div', { id: this.pdfViewer.element.id + '_droplet_right', className: 'e-pv-drop' });
        this.dropDivAnnotationRight.style.borderLeft = '2px solid';
        this.dropElementLeft = createElement('div', { className: 'e-pv-droplet', id: this.pdfViewer.element.id + '_dropletspan_left' });
        this.dropElementLeft.style.transform = 'rotate(0deg)';
        this.dropDivAnnotationLeft.appendChild(this.dropElementLeft);
        this.dropElementRight = createElement('div', { className: 'e-pv-droplet', id: this.pdfViewer.element.id + '_dropletspan_right' });
        this.dropElementRight.style.transform = 'rotate(-90deg)';
        this.dropDivAnnotationRight.appendChild(this.dropElementRight);
        this.pdfViewerBase.pageContainer.appendChild(this.dropDivAnnotationLeft);
        this.pdfViewerBase.pageContainer.appendChild(this.dropDivAnnotationRight);
        this.dropElementLeft.style.top = '20px';
        this.dropElementRight.style.top = '20px';
        this.dropElementRight.style.left = '-8px';
        this.dropElementLeft.style.left = '-8px';
        this.dropDivAnnotationLeft.style.display = 'none';
        this.dropDivAnnotationRight.style.display = 'none';
        this.dropDivAnnotationLeft.addEventListener('mousedown', this.maintainSelection);
        this.dropDivAnnotationLeft.addEventListener('mousemove', this.annotationLeftMove);
        this.dropDivAnnotationLeft.addEventListener('mouseup', this.selectionEnd);
        this.dropDivAnnotationRight.addEventListener('mousedown', this.maintainSelection);
        this.dropDivAnnotationRight.addEventListener('mousemove', this.annotationRightMove);
        this.dropDivAnnotationRight.addEventListener('mouseup', this.selectionEnd);
    }
    // eslint-disable-next-line
    private maintainSelection = (event: any): void => {
        this.isDropletClicked = true;
        this.pdfViewer.textSelectionModule.initiateSelectionByTouch();
        this.isExtended = true;
        this.pdfViewer.textSelectionModule.selectionRangeArray = [];
    };
    // eslint-disable-next-line
    private selectionEnd = (event: any): void => {
        if (this.isDropletClicked) {
            this.isDropletClicked = false;
        }
    };
    // eslint-disable-next-line
    private annotationLeftMove = (event: any): void => {
        if (this.isDropletClicked) {
            this.isLeftDropletClicked = true;
        }
    };

    // eslint-disable-next-line
    private annotationRightMove = (event: any): void => {
        if (this.isDropletClicked) {
            this.isRightDropletClicked = true;
        }
    };
    /**
     * @param target
     * @param x
     * @param y
     * @param target
     * @param x
     * @param y
     * @param target
     * @param x
     * @param y
     * @private
     */
    // eslint-disable-next-line
    public textSelect(target: any, x: any, y: any) {
        if (this.isLeftDropletClicked) {
            const leftElement: ClientRect = this.dropDivAnnotationRight.getBoundingClientRect();
            const rightElement: ClientRect = this.dropDivAnnotationLeft.getBoundingClientRect();
            const clientX: number = x;
            const clientY: number = y;
            if (target.classList.contains('e-pv-text')) {
                if ((rightElement.top - 25) > leftElement.top) {
                    this.pdfViewer.textSelectionModule.textSelectionOnDrag(target, clientX, clientY, true);
                } else {
                    this.pdfViewer.textSelectionModule.textSelectionOnDrag(target, clientX, clientY, false);
                }
                this.updateLeftposition(clientX, clientY);
            }
        } else if (this.isRightDropletClicked) {
            const leftElement: ClientRect = this.dropDivAnnotationLeft.getBoundingClientRect();
            const clientX: number = x;
            const clientY: number = y;
            if (target.classList.contains('e-pv-text')) {
                if ((clientY) >= leftElement.top) {
                    this.pdfViewer.textSelectionModule.textSelectionOnDrag(target, clientX, clientY, true);
                } else {
                    this.pdfViewer.textSelectionModule.textSelectionOnDrag(target, clientX, clientY, false);
                }
                this.updatePosition(clientX, clientY);
            }
        }
    }
    /**
     * @param hide
     * @private
     */
    public showHideDropletDiv(hide: boolean): void {
        const type: string =  this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode;
        const isEnableResizer: boolean = this.isEnableTextMarkupResizer(type);
        if (isEnableResizer && this.dropDivAnnotationLeft && this.dropDivAnnotationRight) {
            if (hide) {
                this.dropDivAnnotationLeft.style.display = 'none';
                this.dropDivAnnotationRight.style.display = 'none';
            } else {
                this.dropDivAnnotationLeft.style.display = '';
                this.dropDivAnnotationRight.style.display = '';
                this.updateDropletStyles(type);
            }
        }
    }

    /**
     * @param type
     * @private
     */
    public isEnableTextMarkupResizer(type: string) : boolean {
        let isEnableResizer: boolean = false;
        if (type) {
            if (type === 'Highlight' && this.pdfViewer.highlightSettings.enableTextMarkupResizer) {
                isEnableResizer = true;
            } else if (type === 'Underline' && this.pdfViewer.underlineSettings.enableTextMarkupResizer) {
                isEnableResizer = true;
            } else if (type === 'Strikethrough' && this.pdfViewer.strikethroughSettings.enableTextMarkupResizer) {
                isEnableResizer = true;
            } else if (this.pdfViewer.enableTextMarkupResizer) {
                isEnableResizer = true;
            }
        } else {
            if (this.pdfViewer.enableTextMarkupResizer) {
                isEnableResizer = true;
            } else if (this.pdfViewer.highlightSettings.enableTextMarkupResizer) {
                isEnableResizer = true;
            } else if ( this.pdfViewer.underlineSettings.enableTextMarkupResizer) {
                isEnableResizer = true;
            } else if ( this.pdfViewer.strikethroughSettings.enableTextMarkupResizer) {
                isEnableResizer = true;
            }
        }
        return isEnableResizer;
    }
    private updateDropletStyles(type: string): void {
        if (this.isEnableTextMarkupResizer(type) && this.dropDivAnnotationLeft && this.dropDivAnnotationLeft.offsetWidth > 0) {
            this.dropDivAnnotationLeft.style.width = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivAnnotationRight.style.width = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropElementLeft.style.width = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropElementRight.style.width = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivAnnotationLeft.style.height = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivAnnotationRight.style.height = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropElementLeft.style.height = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropElementRight.style.height = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropElementLeft.style.top = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropElementRight.style.top = this.dropletHeight * this.pdfViewerBase.getZoomFactor() + 'px';
        }
    }
    private updateAnnotationBounds(): void {
        this.isSelectionMaintained = false;
        // eslint-disable-next-line
        let annotation: any = this.currentTextMarkupAnnotation;
        if (annotation && annotation.isMultiSelect) {
            this.showHideDropletDiv(true);
            this.updateMultiAnnotBounds(annotation);
        } else if (annotation && annotation.bounds) {
            this.retreieveSelection(annotation, null);
            this.pdfViewer.textSelectionModule.maintainSelection(this.selectTextMarkupCurrentPage, false);
            this.isSelectionMaintained = true;
            window.getSelection().removeAllRanges();
        }
    }
    // eslint-disable-next-line
    private updateMultiAnnotBounds(annotation: any): void {
        if (!annotation.annotpageNumbers) {
            const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(annotation.pageNumber, null);
            if (annotationList) {
                for (let z: number = 0; z < annotationList.length; z++) {
                    if (annotationList[z].annotName === annotation.annotName) {
                        annotation = annotationList[z];
                        break;
                    }
                }
            }
        }
        let lowestNumber: number = annotation.annotpageNumbers[0];
        let highestNumber: number = annotation.annotpageNumbers[0];
        for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
            const currentPage: number = annotation.annotpageNumbers[p];
            if (currentPage >= highestNumber) {
                highestNumber = currentPage;
            }
            if (currentPage <= lowestNumber) {
                lowestNumber = currentPage;
            }
        }
        for (let k: number = lowestNumber; k <= highestNumber; k++) {
            const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(k, null);
            if (annotationList) {
                for (let j: number = 0; j < annotation.annotNameCollection.length; j++) {
                    // eslint-disable-next-line
                    let currentAnnot: any = annotation.annotNameCollection[j];
                    for (let z: number = 0; z < annotationList.length; z++) {
                        if (annotationList[z].annotName === currentAnnot) {
                            // eslint-disable-next-line
                            let newAnnotation: any = annotationList[z];
                            this.retreieveSelection(newAnnotation, null);
                            this.pdfViewer.textSelectionModule.maintainSelection(newAnnotation.pageNumber, false);
                        }
                    }
                }
            }
        }
        this.isSelectionMaintained = true;
        window.getSelection().removeAllRanges();
    }

    // eslint-disable-next-line
    private retreieveSelection(annotation: any, element: any): any {
        for (let k: number = 0; k < annotation.bounds.length; k++) {
            // eslint-disable-next-line
            let bound: any = annotation.bounds[k];
            const x: number = (bound.left ? bound.left : bound.Left) * this.pdfViewerBase.getZoomFactor();
            const y: number = (bound.top ? bound.top : bound.Top) * this.pdfViewerBase.getZoomFactor();
            const width: number = (bound.width ? bound.width : bound.Width) * this.pdfViewerBase.getZoomFactor();
            const height: number = bound.height ? bound.height : bound.Height;
            // eslint-disable-next-line
            let textLayer: any = this.pdfViewerBase.getElement('_textLayer_' + annotation.pageNumber);
            if (textLayer) {
                // eslint-disable-next-line
                let textDivs: any = textLayer.childNodes;
                for (let n: number = 0; n < textDivs.length; n++) {
                    if (textDivs[n]) {
                        // eslint-disable-next-line
                        let rangebounds: any = textDivs[n].getBoundingClientRect();
                        const top: number = this.getClientValueTop(rangebounds.top, annotation.pageNumber);
                        // eslint-disable-next-line max-len
                        const currentLeft: number = rangebounds.left - this.pdfViewerBase.getElement('_pageDiv_' + annotation.pageNumber).getBoundingClientRect().left;
                        const totalLeft: number = currentLeft + rangebounds.width;
                        // eslint-disable-next-line
                        let textDiVLeft: number = parseInt(textDivs[n].style.left);
                        // eslint-disable-next-line
                        let currentTop: number = parseInt(textDivs[n].style.top);
                        const isLeftBounds: boolean = this.pdfViewer.textSelectionModule.checkLeftBounds(currentLeft, textDiVLeft, totalLeft, x);
                        const isTopBounds: boolean = this.pdfViewer.textSelectionModule.checkTopBounds(top, currentTop, y);
                        if (isLeftBounds && isTopBounds) {
                            element = textDivs[n];
                            break;
                        }
                    }
                }
                if (element != null) {
                    // eslint-disable-next-line
                    let boundingRect: any = this.pdfViewerBase.getElement('_textLayer_' + annotation.pageNumber).getBoundingClientRect();
                    this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(element, x + boundingRect.left, y + boundingRect.top, false);
                    if ((annotation.bounds.length - 1) === k) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(element, x + boundingRect.left + width, y + boundingRect.top, false);
                    }
                }
            }
        }
    }
    /**
     * @param x
     * @param y
     * @param isSelected
     * @private
     */
    public updatePosition(x: number, y: number, isSelected?: boolean): void {
        this.showHideDropletDiv(false);
        const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
        const topClientValue: number = this.getClientValueTop(y, this.pdfViewerBase.currentPageNumber - 1);
        // eslint-disable-next-line
        let rightDivElement: any = document.getElementById(this.pdfViewer.element.id + '_droplet_right');
        if (isSelected) {
            // eslint-disable-next-line max-len
            rightDivElement.style.top = topClientValue * this.pdfViewerBase.getZoomFactor() + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        } else {
            // eslint-disable-next-line max-len
            rightDivElement.style.top = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        }
        // eslint-disable-next-line max-len
        rightDivElement.style.left = x + this.pdfViewerBase.viewerContainer.scrollLeft - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left + 'px';
    }
    /**
     * @param x
     * @param y
     * @param isSelected
     * @param x
     * @param y
     * @param isSelected
     * @private
     */
    public updateLeftposition(x: number, y: number, isSelected?: boolean): void {
        this.showHideDropletDiv(false);
        const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
        const topClientValue: number = this.getClientValueTop(y, this.pdfViewerBase.currentPageNumber - 1);
        // eslint-disable-next-line
        let leftDivElement: any = document.getElementById(this.pdfViewer.element.id + '_droplet_left');
        leftDivElement.style.display = '';
        if (isSelected) {
            // eslint-disable-next-line max-len
            leftDivElement.style.top = topClientValue * this.pdfViewerBase.getZoomFactor() + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        } else {
            // eslint-disable-next-line max-len
            leftDivElement.style.top = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        }
        // eslint-disable-next-line max-len
        leftDivElement.style.left = x + this.pdfViewerBase.viewerContainer.scrollLeft - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (this.dropletHeight * this.pdfViewerBase.getZoomFactor()) + 'px';
    }


    private getClientValueTop(clientValue: number, pageNumber: number): number {
        if (this.pdfViewerBase.getElement('_pageDiv_' + pageNumber)) {
            // eslint-disable-next-line max-len
            return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
        } else {
            return clientValue;
        }
    }
    /**
     * @param textMarkupAnnotations
     * @param pageNumber
     * @param isImportTextMarkup
     * @param textMarkupAnnotations
     * @param pageNumber
     * @param isImportTextMarkup
     * @param textMarkupAnnotations
     * @param pageNumber
     * @param isImportTextMarkup
     * @private
     */
    // eslint-disable-next-line
    public renderTextMarkupAnnotationsInPage(textMarkupAnnotations: any, pageNumber: number, isImportTextMarkup?: boolean): void {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (isImportTextMarkup) {
            this.renderTextMarkupAnnotations(null, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor(), true);
        } else {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
        }
    }

    // eslint-disable-next-line
    private renderTextMarkupAnnotations(textMarkupAnnotations: any, pageNumber: number, canvas: HTMLElement, factor: number, isImportAction?: boolean): void {
        if (canvas) {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.setLineDash([]);
            // eslint-disable-next-line
            let annotations: any[];
            if (!isImportAction) {
                annotations = this.getAnnotations(pageNumber, textMarkupAnnotations);
            } else {
                annotations = textMarkupAnnotations;
            }
            if (annotations) {
                for (let i: number = 0; i < annotations.length; i++) {
                    // eslint-disable-next-line
                    let annotation: any = annotations[i];
                    let annotationObject: ITextMarkupAnnotation = null;
                    if (annotation.TextMarkupAnnotationType) {
                        // eslint-disable-next-line max-len
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        if (!annotation.Author) {
                            // eslint-disable-next-line max-len
                            annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotation.TextMarkupAnnotationType);
                        }
                        if (!annotation.Subject) {
                            annotation.Subject = annotation.TextMarkupAnnotationType;
                        }
                        if (annotation.AnnotationSettings && annotation.AnnotationSettings.isLock) {
                            annotation.AnnotationSettings = { isLock: annotation.AnnotationSettings.isLock };
                        } else {
                            annotation.AnnotationSettings = this.getAnnotationSettings(annotation.TextMarkupAnnotationType);
                        }
                        let isPrint: boolean = true;
                        if (annotation.annotationAddMode === 'Imported Annotation') {
                            isPrint = annotation.IsPrint;
                        } else {
                            isPrint = this.getIsPrintValue(annotation.TextMarkupAnnotationType);
                        }
                        // eslint-disable-next-line max-len
                        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                        // eslint-disable-next-line max-len
                        annotationObject = {
                            textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, allowedInteractions: annotation.allowedInteractions, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
                            // eslint-disable-next-line max-len
                            annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, shapeAnnotationType: 'textMarkup', pageNumber: pageNumber,
                            textMarkupContent: '', textMarkupStartIndex: 0, textMarkupEndIndex: 0, annotationSelectorSettings: this.getSettings(annotation),
                            // eslint-disable-next-line max-len
                            customData: this.pdfViewer.annotation.getCustomData(annotation), annotationAddMode: annotation.annotationAddMode, annotationSettings: annotation.AnnotationSettings, isPrint: isPrint, isCommentLock: annotation.IsCommentLock
                        };
                        if (annotation.IsMultiSelect) {
                            annotationObject.annotNameCollection = annotation.AnnotNameCollection;
                            annotationObject.annotpageNumbers = annotation.AnnotpageNumbers;
                            annotationObject.isMultiSelect = annotation.IsMultiSelect;
                        }
                        if (annotation.textMarkupContent && annotation.textMarkupContent !== '') {
                            annotationObject.textMarkupContent = annotation.textMarkupContent;
                            annotationObject.textMarkupStartIndex = annotation.textMarkupStartIndex;
                            annotationObject.textMarkupEndIndex = annotation.textMarkupEndIndex;
                        }
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_textMarkup');
                    }
                    // eslint-disable-next-line max-len
                    const type: string = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.textMarkupAnnotationType;
                    // eslint-disable-next-line
                    let annotBounds: any = annotation.Bounds ? annotation.Bounds : annotation.bounds;
                    const opacity: number = annotation.Opacity ? annotation.Opacity : annotation.opacity;
                    const color: string = annotation.Color ? annotation.Color : annotation.color;
                    let isPrint: boolean = true;
                    if (annotation.TextMarkupAnnotationType) {
                        isPrint = annotation.IsPrint;
                    }
                    if (annotation.textMarkupAnnotationType) {
                        isPrint = annotation.isPrint;
                    }
                    switch (type) {
                    case 'Highlight':
                        this.renderHighlightAnnotation(annotBounds, opacity, color, context, factor, isPrint, pageNumber);
                        break;
                    case 'Strikethrough':
                        this.renderStrikeoutAnnotation(annotBounds, opacity, color, context, factor, pageNumber, isPrint);
                        break;
                    case 'Underline':
                        this.renderUnderlineAnnotation(annotBounds, opacity, color, context, factor, pageNumber, isPrint);
                        break;
                    }
                }
            }
            let isMaintainedSelector: boolean = false;
            if (this.currentTextMarkupAnnotation && this.currentTextMarkupAnnotation.annotpageNumbers) {
                for (let m: number = 0; m < this.currentTextMarkupAnnotation.annotpageNumbers.length; m++) {
                    if (pageNumber === this.currentTextMarkupAnnotation.annotpageNumbers[m]) {
                        isMaintainedSelector = true;
                        this.isAnnotationSelect = false;
                        break;
                    }
                }
            }
            if ((pageNumber === this.selectTextMarkupCurrentPage) || isMaintainedSelector) {
                if (!this.isAnnotationSelect) {
                    this.maintainAnnotationSelection();
                } else {
                    this.isAnnotationSelect = false;
                }
            }
        }
    }
    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public getSettings(annotation: any): any {
        let selector: AnnotationSelectorSettingsModel;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        } else {
            selector = this.getSelector(annotation.TextMarkupAnnotationType);
        }
        return selector;
    }
    /**
     * @param type
     * @private
     */
    public drawTextMarkupAnnotations(type: string): void {
        this.isTextMarkupAnnotationMode = true;
        this.currentTextMarkupAddMode = type;
        let isCleared: boolean = true;
        this.multiPageCollection = [];
        const selectionObject: ISelection[] = this.pdfViewer.textSelectionModule.selectionRangeArray;
        if (selectionObject.length > 0 && !this.isSelectionMaintained) {
            this.convertSelectionToTextMarkup(type, selectionObject, this.pdfViewerBase.getZoomFactor());
        }
        if (this.isEnableTextMarkupResizer(type) && this.isExtended && window.getSelection().toString()) {
            const pageBounds: IPageAnnotationBounds[] = this.getDrawnBounds();
            if (pageBounds[0] && pageBounds[0].bounds) {
                // eslint-disable-next-line
                let currentAnnot: any = this.currentTextMarkupAnnotation;
                for (let k: number = 0; k < pageBounds.length; k++) {
                    if (currentAnnot && currentAnnot.pageNumber === pageBounds[k].pageIndex) {
                        this.currentTextMarkupAnnotation = currentAnnot;
                        this.selectTextMarkupCurrentPage = pageBounds[k].pageIndex;
                        this.updateTextMarkupAnnotationBounds(pageBounds, k);
                    } else {
                        if (currentAnnot) {
                            if (type === '') {
                                type = currentAnnot.textMarkupAnnotationType;
                            }
                        }
                        if (!currentAnnot.isMultiSelect) {
                            let isMultiSelect: boolean = false;
                            if (this.isMultiAnnotation(type)) {
                                this.multiPageCollection.push(currentAnnot);
                                isMultiSelect = true;
                            }
                            // eslint-disable-next-line max-len
                            this.drawTextMarkups(type, pageBounds[k].bounds, pageBounds[k].pageIndex, pageBounds[k].rect, this.pdfViewerBase.getZoomFactor(), pageBounds[k].textContent, pageBounds[k].startIndex, pageBounds[k].endIndex, isMultiSelect);
                        } else {
                            if (currentAnnot.isMultiSelect && currentAnnot.annotNameCollection) {
                                this.modifyCurrentAnnotation(currentAnnot, pageBounds, k);
                            }
                        }
                    }
                }
            }
        } else if (window.getSelection().toString()) {
            const pageBounds: IPageAnnotationBounds[] = this.getDrawnBounds();
            const isMultiSelect: boolean = this.isMultiPageAnnotations(pageBounds, type);
            if (pageBounds.length > 0) {
                for (let i: number = 0; i < pageBounds.length; i++) {
                    if (type === '') {
                        isCleared = false;
                    }
                    // eslint-disable-next-line max-len
                    this.drawTextMarkups(type, pageBounds[i].bounds, pageBounds[i].pageIndex, pageBounds[i].rect, this.pdfViewerBase.getZoomFactor(), pageBounds[i].textContent, pageBounds[i].startIndex, pageBounds[i].endIndex, isMultiSelect);
                }
            }
        }
        if (this.multiPageCollection) {
            for (let j: number = 0; j < this.multiPageCollection.length; j++) {
                this.updateAnnotationNames(this.multiPageCollection[j], this.multiPageCollection[j].pageNumber);
            }
        }
        this.isExtended = false;
        this.isSelectionMaintained = false;
        // this.pdfViewerBase.annotationHelper.redoCollection = [];
        if (isCleared) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.isEnableTextMarkupResizer(type)) {
            this.updateAnnotationBounds();
        }
    }
    // eslint-disable-next-line
    private isMultiPageAnnotations(pageBounds: any, type: string): boolean {
        let isMultiSelect: boolean = false;
        for (let n: number = 0; n < pageBounds.length; n++) {
            if (pageBounds[n].pageIndex !== pageBounds[0].pageIndex && this.isMultiAnnotation(type)) {
                isMultiSelect = true;
                break;
            }
        }
        return isMultiSelect;
    }
    private isMultiAnnotation(type: string) : boolean {
        let isSelection: boolean = false;
        if (type === 'Highlight' && this.pdfViewer.highlightSettings.enableMultiPageAnnotation) {
            isSelection = true;
        } else if (type === 'Underline' && this.pdfViewer.underlineSettings.enableMultiPageAnnotation) {
            isSelection = true;
        } else if (type === 'Strikethrough' && this.pdfViewer.strikethroughSettings.enableMultiPageAnnotation) {
            isSelection = true;
        } else if (this.pdfViewer.enableMultiPageAnnotation) {
            isSelection = true;
        }
        return isSelection;
    }
    // eslint-disable-next-line
    private modifyCurrentAnnotation(currentAnnot: any, pageBounds: any, index: number): void {
        for (let c: number = 0; c < currentAnnot.annotNameCollection.length; c++) {
            // eslint-disable-next-line
            let currentAnnots: any = currentAnnot.annotNameCollection[c];
            const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(pageBounds[index].pageIndex, null);
            if (annotationList) {
                for (let z: number = 0; z < annotationList.length; z++) {
                    if (annotationList[z].annotName === currentAnnots) {
                        this.currentTextMarkupAnnotation = annotationList[z];
                        this.selectTextMarkupCurrentPage = pageBounds[index].pageIndex;
                        this.updateTextMarkupAnnotationBounds(pageBounds, index);
                        break;
                    }
                }
            }
        }
    }
    // eslint-disable-next-line
    private drawAnnotationSelector(newAnnotation: any, annotation: any, newcanvas?: any): void {
        for (let i: number = 0; i < newAnnotation.bounds.length; i++) {
            // eslint-disable-next-line
            let bound: any = newAnnotation.bounds[i];
            const x: number = bound.left ? bound.left : bound.Left;
            const y: number = bound.top ? bound.top : bound.Top;
            const width: number = bound.width ? bound.width : bound.Width;
            const height: number = bound.height ? bound.height : bound.Height;
            if (!newcanvas) {
                newcanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + newAnnotation.pageNumber);
            }
            // eslint-disable-next-line max-len
            this.drawAnnotationSelectRect(newcanvas, this.getMagnifiedValue(x - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(y - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(width + 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(height + 0.5, this.pdfViewerBase.getZoomFactor()), annotation);
        }
    }
    // eslint-disable-next-line
    private selectMultiPageAnnotations(annotation: any): void {
        for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
            // eslint-disable-next-line
            let currentAnnot: any = annotation.annotNameCollection[k];
            if (currentAnnot !== annotation.annotName) {
                for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                    const currentPage: number = annotation.annotpageNumbers[p];
                    const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                    if (annotationList) {
                        for (let z: number = 0; z < annotationList.length; z++) {
                            if (annotationList[z].annotName === currentAnnot) {
                                // eslint-disable-next-line
                                let newAnnotation: any = annotationList[z];
                                this.drawAnnotationSelector(newAnnotation, annotation);
                            }
                        }
                    }
                }
            }
        }
    }
    // eslint-disable-next-line
    private deletMultiPageAnnotation(annotation: any): any {
        for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
            // eslint-disable-next-line
            let currentAnnot: any = annotation.annotNameCollection[k];
            if (currentAnnot !== annotation.annotName) {
                for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                    const currentPage: number = annotation.annotpageNumbers[p];
                    const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                    if (annotationList) {
                        for (let z: number = 0; z < annotationList.length; z++) {
                            if (annotationList[z].annotName === currentAnnot) {
                                // eslint-disable-next-line
                                let newAnnotation: any = annotationList[z];
                                let deletedAnnotation: ITextMarkupAnnotation = null;
                                deletedAnnotation = annotationList.splice(z, 1)[0];
                                this.pdfViewer.annotationModule.addAction(currentPage, z, deletedAnnotation, 'Text Markup Deleted', null);
                                this.currentAnnotationIndex = z;
                                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(deletedAnnotation, 'textMarkup');
                                const removeDiv: HTMLElement = document.getElementById(deletedAnnotation.annotName);
                                if (removeDiv) {
                                    if (removeDiv.parentElement.childElementCount === 1) {
                                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                                    } else {
                                        removeDiv.remove();
                                    }
                                }
                                this.pdfViewer.annotationModule.updateAnnotationCollection(newAnnotation);
                                this.manageAnnotations(annotationList, currentPage);
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.updateImportAnnotationCollection(newAnnotation, newAnnotation.pageNumber, 'textMarkupAnnotation');
                                const annotationId: string = newAnnotation.annotName;
                                // eslint-disable-next-line
                                let annotationBounds: any = newAnnotation.bounds;
                                this.pdfViewer.annotationModule.renderAnnotations(currentPage, null, null, null);
                            }
                        }
                    }
                }
            }
        }
    }
    // eslint-disable-next-line
    private modifyMultiPageAnnotations(annotation: any, property: string, value: any): void {
        for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
            // eslint-disable-next-line
            let currentAnnot: any = annotation.annotNameCollection[k];
            if (currentAnnot !== annotation.annotName) {
                for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                    const currentPage: number = annotation.annotpageNumbers[p];
                    const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                    if (annotationList) {
                        for (let z: number = 0; z < annotationList.length; z++) {
                            if (annotationList[z].annotName === currentAnnot) {
                                if (property === 'Color') {
                                    annotationList[z].color = value;
                                } else {
                                    annotationList[z].opacity = value;
                                }
                                annotationList[z].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                                this.currentAnnotationIndex = z;
                                if (status === null || status === 'changed') {
                                    // eslint-disable-next-line max-len
                                    this.pdfViewer.annotationModule.addAction(annotationList[z].pageNumber, z, annotationList[z], 'Text Markup Property modified', property);
                                }
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationList[z]);
                                this.manageAnnotations(annotationList, currentPage);
                                this.pdfViewer.annotationModule.renderAnnotations(currentPage, null, null, null);
                            }
                        }
                    }
                }
            }
        }
    }
    private convertSelectionToTextMarkup(type: string, selectionObject: ISelection[], factor: number): void {
        let isMultiSelect: boolean = false;
        this.triggerAddEvent = false;
        this.multiPageCollection = [];
        for (let i: number = 0; i < selectionObject.length; i++) {
            const textValue: string = selectionObject[i].textContent;
            // eslint-disable-next-line
            let indexes: any;
            if (selectionObject[i].startNode === selectionObject[i].endNode) {
                const parentText: string = document.getElementById(selectionObject[i].startNode).textContent;
                indexes = this.getIndexNumbers(selectionObject[i].pageNumber, textValue, parentText);
            } else {
                indexes = this.getIndexNumbers(selectionObject[i].pageNumber, textValue);
            }
            if (!isMultiSelect) {
                for (let n: number = 1; n < selectionObject.length; n++) {
                    if (selectionObject[n].pageNumber !== selectionObject[0].pageNumber && this.isMultiAnnotation(type)) {
                        isMultiSelect = true;
                        break;
                    }
                }
            }
            if (this.isMultiAnnotation(type) && (selectionObject.length - 1) === i) {
                this.triggerAddEvent = true;
            }
            // eslint-disable-next-line max-len
            this.drawTextMarkups(type, selectionObject[i].rectangleBounds, selectionObject[i].pageNumber, selectionObject[i].bound, factor, textValue, indexes.startIndex, indexes.endIndex, isMultiSelect);
        }
    }

    // eslint-disable-next-line
    private updateTextMarkupAnnotationBounds(pageBounds: IPageAnnotationBounds[], currentIndex: number): void {
        if (this.currentTextMarkupAnnotation) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageBounds[currentIndex].pageIndex, null);
            let annotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                        pageAnnotations[i].bounds = pageBounds[currentIndex].bounds;
                        pageAnnotations[i].textMarkupContent = pageBounds[currentIndex].textContent;
                        pageAnnotations[i].textMarkupStartIndex = pageBounds[currentIndex].startIndex;
                        pageAnnotations[i].textMarkupEndIndex = pageBounds[currentIndex].endIndex;
                        pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                        annotation = pageAnnotations[i];
                    }
                }
                this.manageAnnotations(pageAnnotations, pageBounds[currentIndex].pageIndex);
                this.currentTextMarkupAnnotation = null;
                this.pdfViewer.annotationModule.renderAnnotations(pageBounds[currentIndex].pageIndex, null, null, null);
                this.pdfViewer.isDocumentEdited = true;
                if (annotation) {
                    // eslint-disable-next-line
                    let settings: any = { opacity: annotation.opacity, color: annotation.color, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate };
                    // eslint-disable-next-line max-len
                    const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
                    if (multiPageCollection.length > 0) {
                        if ((pageBounds.length - 1) === currentIndex) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.fireAnnotationResize(pageBounds[currentIndex].pageIndex, annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType, annotation.bounds, settings, annotation.textMarkupContent, annotation.textMarkupStartIndex, annotation.textMarkupEndIndex, null, multiPageCollection);
                        }
                    } else {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationResize(pageBounds[currentIndex].pageIndex, annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType, annotation.bounds, settings, annotation.textMarkupContent, annotation.textMarkupStartIndex, annotation.textMarkupEndIndex, null);
                    }
                }
                // eslint-disable-next-line max-len
                this.currentAnnotationIndex = null;
                this.selectTextMarkupCurrentPage = null;
            }
        }
    }
    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public multiPageCollectionList(annotation: any): any {
        const multiPageCollectionList: ITextMarkupAnnotation[] = [];
        if (annotation.isMultiSelect && annotation.annotNameCollection) {
            multiPageCollectionList.push(annotation);
            for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
                // eslint-disable-next-line
                let currentAnnot: any = annotation.annotNameCollection[k];
                if (currentAnnot !== annotation.annotName) {
                    for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                        const currentPage: number = annotation.annotpageNumbers[p];
                        const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                        if (annotationList) {
                            for (let z: number = 0; z < annotationList.length; z++) {
                                if (annotationList[z].annotName === currentAnnot) {
                                    multiPageCollectionList.push(annotationList[z]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return multiPageCollectionList;
    }
    // eslint-disable-next-line
    private updateAnnotationNames(annotations: any, pageNumber: number): any {
        if (annotations) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
            let annotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (annotations.annotName === pageAnnotations[i].annotName) {
                        // eslint-disable-next-line
                        let annotNamesCollections: any[] = [];
                        // eslint-disable-next-line
                        let annotpageNumbers: any[] = [];
                        for (let p: number = 0; p < this.multiPageCollection.length; p++) {
                            annotNamesCollections.push(this.multiPageCollection[p].annotName);
                            annotpageNumbers.push(this.multiPageCollection[p].pageNumber);
                        }
                        pageAnnotations[i].isMultiSelect = true;
                        pageAnnotations[i].annotNameCollection = annotNamesCollections;
                        pageAnnotations[i].annotpageNumbers = annotpageNumbers;
                        annotation = pageAnnotations[i];
                    }
                }
                this.manageAnnotations(pageAnnotations, pageNumber);
            }
        }
    }
    // eslint-disable-next-line
    private updateAnnotationContent(annotation: any, pageBound: any): any {
        if (annotation) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
            let annotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                        pageAnnotations[i].textMarkupContent = pageBound.textContent;
                        pageAnnotations[i].textMarkupStartIndex = pageBound.startIndex;
                        pageAnnotations[i].textMarkupEndIndex = pageBound.endIndex;
                        annotation = pageAnnotations[i];
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], this.selectTextMarkupCurrentPage);
                }
                this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            }
        }
    }
    // eslint-disable-next-line
    private drawTextMarkups(type: string, bounds: IRectangle[], pageNumber: number, rect: any, factor: number, textContent: string, startIndex: number, endIndex: number, isMultiSelect?: boolean): void {
        let annotation: ITextMarkupAnnotation = null;
        this.isNewAnnotation = false;
        let author: string = 'Guest';
        let subject: string;
        const context: CanvasRenderingContext2D = this.getPageContext(pageNumber);
        const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        this.highlightColor = this.pdfViewer.highlightSettings.color;
        this.underlineColor = this.pdfViewer.underlineSettings.color;
        this.strikethroughColor = this.pdfViewer.strikethroughSettings.color;
        this.highlightOpacity = this.pdfViewer.highlightSettings.opacity;
        this.underlineOpacity = this.pdfViewer.underlineSettings.opacity;
        this.strikethroughOpacity = this.pdfViewer.strikethroughSettings.opacity;
        this.annotationAddMode = 'UI Drawn Annotation';
        // eslint-disable-next-line
        let allowedInteractions: any;
        if (context) {
            context.setLineDash([]);
            switch (type) {
            case 'Highlight':
                this.isNewAnnotation = true;
                subject = 'Highlight';
                // eslint-disable-next-line max-len
                author = (this.pdfViewer.highlightSettings.author !== 'Guest' && this.pdfViewer.highlightSettings.author) ? this.pdfViewer.highlightSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                allowedInteractions = this.pdfViewer.highlightSettings.allowedInteractions ? this.pdfViewer.highlightSettings.allowedInteractions : 'None';
                // eslint-disable-next-line max-len
                annotation = this.getAddedAnnotation(type, this.highlightColor, this.highlightOpacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions);
                if (annotation) {
                    // eslint-disable-next-line max-len
                    this.renderHighlightAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor, annotation.isPrint, pageNumber);
                }
                break;
            case 'Strikethrough':
                this.isNewAnnotation = true;
                subject = 'Strikethrough';
                // eslint-disable-next-line max-len
                author = (this.pdfViewer.strikethroughSettings.author !== 'Guest' &&  this.pdfViewer.strikethroughSettings.author) ? this.pdfViewer.strikethroughSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                allowedInteractions = this.pdfViewer.strikethroughSettings.allowedInteractions ? this.pdfViewer.strikethroughSettings.allowedInteractions : 'None';
                // eslint-disable-next-line max-len
                annotation = this.getAddedAnnotation(type, this.strikethroughColor, this.strikethroughOpacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions);
                if (annotation) {
                    // eslint-disable-next-line max-len
                    this.renderStrikeoutAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor, pageNumber, annotation.isPrint);
                }
                break;
            case 'Underline':
                this.isNewAnnotation = true;
                subject = 'Underline';
                // eslint-disable-next-line max-len
                author = (this.pdfViewer.underlineSettings.author !== 'Guest' && this.pdfViewer.underlineSettings.author) ? this.pdfViewer.underlineSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                allowedInteractions = this.pdfViewer.underlineSettings.allowedInteractions ? this.pdfViewer.underlineSettings.allowedInteractions : 'None';
                // eslint-disable-next-line max-len
                annotation = this.getAddedAnnotation(type, this.underlineColor, this.underlineOpacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions);
                if (annotation) {
                    // eslint-disable-next-line max-len
                    this.renderUnderlineAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor, pageNumber, annotation.isPrint);
                }
                break;
            }
            this.isNewAnnotation = false;
            if (annotation) {
                this.pdfViewer.isDocumentEdited = true;
                // eslint-disable-next-line
                let settings: any = { opacity: annotation.opacity, color: annotation.color, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate };
                const index: number = this.pdfViewer.annotationModule.actionCollection[this.pdfViewer.annotationModule.actionCollection.length - 1].index;
                // eslint-disable-next-line max-len
                if (this.isMultiAnnotation(type)) {
                    if (this.triggerAddEvent) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationAdd(pageNumber, annotation.annotName, (type as AnnotationType), annotation.bounds, settings, textContent, startIndex, endIndex, null, this.multiPageCollection);
                    }
                } else {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.fireAnnotationAdd(pageNumber, annotation.annotName, (type as AnnotationType), annotation.bounds, settings, textContent, startIndex, endIndex);
                }
            }
        }
    }
    // eslint-disable-next-line
    private retreiveTextIndex(annotation: any): any {
        if (annotation.textMarkupContent === '') {
            this.retreieveSelection(annotation, null);
            const pageBounds: IPageAnnotationBounds[] = this.getDrawnBounds();
            window.getSelection().removeAllRanges();
            if (pageBounds[0] && pageBounds[0].bounds) {
                this.updateAnnotationContent(annotation, pageBounds[0]);
                annotation.textMarkupContent = pageBounds[0].textContent;
                annotation.textMarkupStartIndex = pageBounds[0].startIndex;
                annotation.textMarkupEndIndex = pageBounds[0].endIndex;
            }
        }
        return annotation;
    }

    // eslint-disable-next-line
    private renderHighlightAnnotation(bounds: any[], opacity: number, color: string, context: any, factor: number, isPrint: boolean, pageIndex: number): void {
        for (let i: number = 0; i < bounds.length; i++) {
            // eslint-disable-next-line
            let bound: any = bounds[i];
            context.beginPath();
            const x: number = bound.X ? bound.X : bound.left;
            const y: number = bound.Y ? bound.Y : bound.top;
            const width: number = bound.Width ? bound.Width : bound.width;
            const height: number = bound.Height ? bound.Height : bound.height;
            if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex) {
                if (isPrint) {
                    // eslint-disable-next-line max-len
                    context.rect((x * factor), (y * factor), (width * factor), (height * factor));
                    context.globalAlpha = opacity * 0.5;
                    context.closePath();
                    context.fillStyle = color;
                    context.msFillRule = 'nonzero';
                    context.fill();
                }
            } else {
                // eslint-disable-next-line max-len
                context.rect((x * factor), (y * factor), (width * factor), (height * factor));
                context.globalAlpha = opacity * 0.5;
                context.closePath();
                context.fillStyle = color;
                context.msFillRule = 'nonzero';
                context.fill();
            }
        }
        context.save();
    }

    // eslint-disable-next-line
    private renderStrikeoutAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D, factor: number, pageNumber: number, isPrint: boolean): void {
        for (let i: number = 0; i < bounds.length; i++) {
            // eslint-disable-next-line
            let bound: any = this.getProperBounds(bounds[i]);
            const pageDetails: ISize = this.pdfViewerBase.pageSize[pageNumber];
            if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageNumber) {
                if (isPrint) {
                    if (pageDetails.rotation === 1) {
                        // eslint-disable-next-line max-len
                        this.drawLine(opacity, (bound.x + (bound.width / 2)), bound.y, bound.width, bound.height, color, factor, context, pageNumber);
                    } else if (pageDetails.rotation === 2) {
                        // eslint-disable-next-line max-len
                        this.drawLine(opacity, bound.x, (bound.y + (bound.height / 2)), bound.width, bound.height, color, factor, context, pageNumber);
                    } else if (pageDetails.rotation === 3) {
                        this.drawLine(opacity, bound.x, bound.y, (bound.width / 2), bound.height, color, factor, context, pageNumber);
                    } else {
                        this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factor, context, pageNumber);
                    }
                }
            } else {
                if (pageDetails.rotation === 1) {
                    // eslint-disable-next-line max-len
                    this.drawLine(opacity, (bound.x + (bound.width / 2)), bound.y, bound.width, bound.height, color, factor, context, pageNumber);
                } else if (pageDetails.rotation === 2) {
                    // eslint-disable-next-line max-len
                    this.drawLine(opacity, bound.x, (bound.y + (bound.height / 2)), bound.width, bound.height, color, factor, context, pageNumber);
                } else if (pageDetails.rotation === 3) {
                    this.drawLine(opacity, bound.x, bound.y, (bound.width / 2), bound.height, color, factor, context, pageNumber);
                } else {
                    this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factor, context, pageNumber);
                }
            }
        }
    }

    // eslint-disable-next-line
    private renderUnderlineAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D, factor: number, pageNumber: number, isPrint: boolean): void {
        for (let i: number = 0; i < bounds.length; i++) {
            // eslint-disable-next-line
            let boundValues: any = this.getProperBounds(bounds[i]);
            if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageNumber) {
                if (isPrint) {
                    // eslint-disable-next-line max-len
                    this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factor, context, pageNumber);
                }
            } else {
                // eslint-disable-next-line max-len
                this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factor, context, pageNumber);
            }
        }
    }

    // eslint-disable-next-line
    private getProperBounds(bound: any): any {
        const x: number = bound.X ? bound.X : bound.left;
        const y: number = bound.Y ? bound.Y : bound.top;
        const width: number = bound.Width ? bound.Width : bound.width;
        const height: number = bound.Height ? bound.Height : bound.height;
        return { x: x, y: y, width: width, height: height };
    }

    // eslint-disable-next-line max-len
    private drawLine(opacity: number, x: number, y: number, width: number, height: number, color: string, factor: number, context: any, pageNumber: number): void {
        context.globalAlpha = opacity;
        context.beginPath();
        const pageDetails: ISize = this.pdfViewerBase.pageSize[pageNumber];
        if (pageDetails.rotation === 1) {
            context.moveTo(( x * factor), (y * factor));
            context.lineTo((x * factor), (y + height) * factor);
        } else if (pageDetails.rotation === 2) {
            context.moveTo(( x * factor), (y * factor));
            context.lineTo((width + x) * factor, (y * factor));
        } else if (pageDetails.rotation === 3) {
            context.moveTo((width + x) * factor, (y * factor));
            context.lineTo((width + x) * factor, (y + height) * factor);
        } else {
            context.moveTo((x * factor), (y + height) * factor);
            context.lineTo((width + x) * factor, (y + height) * factor);
        }
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.closePath();
        context.msFillRule = 'nonzero';
        context.stroke();
    }

    /**
     * @param textMarkupAnnotations
     * @param pageIndex
     * @param stampData
     * @param shapeData
     * @param measureShapeData
     * @param stickyData
     * @param textMarkupAnnotations
     * @param pageIndex
     * @param stampData
     * @param shapeData
     * @param measureShapeData
     * @param stickyData
     * @private
     */
    // eslint-disable-next-line
    public printTextMarkupAnnotations(textMarkupAnnotations: any, pageIndex: number, stampData: any, shapeData: any, measureShapeData: any, stickyData: any): string {
        const canvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex }) as HTMLCanvasElement;
        canvas.style.width = 816 + 'px';
        canvas.style.height = 1056 + 'px';
        const pageWidth: number = this.pdfViewerBase.pageSize[pageIndex].width;
        const pageHeight: number = this.pdfViewerBase.pageSize[pageIndex].height;
        canvas.height = pageHeight * this.pdfViewerBase.getZoomFactor();
        canvas.width = pageWidth * this.pdfViewerBase.getZoomFactor();
        // eslint-disable-next-line
        let textMarkupannotations: any = this.getAnnotations(pageIndex, null, '_annotations_textMarkup');
        // eslint-disable-next-line
        let shapeAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_shape');
        // eslint-disable-next-line
        let measureShapeAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_shape_measure');
        // eslint-disable-next-line
        let stampAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_stamp');
        // eslint-disable-next-line
        let stickyNoteAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_sticky');
        if (stampAnnotation || shapeAnnotation || stickyNoteAnnotation || measureShapeAnnotation) {
            this.pdfViewer.renderDrawing(canvas, pageIndex);
        } else {
            this.pdfViewer.annotation.renderAnnotations(pageIndex, shapeData, measureShapeData, null, canvas);
            this.pdfViewer.annotation.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex, canvas);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.renderStickyNotesAnnotations(stickyData, pageIndex, canvas);
        }
        if (textMarkupannotations) {
            this.renderTextMarkupAnnotations(null, pageIndex, canvas, 1);
        } else {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageIndex, canvas, 1);
        }
        const imageSource: string = (canvas as HTMLCanvasElement).toDataURL();
        return imageSource;
    }

    /**
     * @private
     */
    public saveTextMarkupAnnotations(): string {
        // eslint-disable-next-line
        let storeTextMarkupObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (this.pdfViewerBase.isStorageExceed) {
            storeTextMarkupObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'];
        }
        // eslint-disable-next-line
        let textMarkupAnnotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            textMarkupAnnotations[j] = [];
        }
        if (storeTextMarkupObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const textMarkupAnnotationCollection: IPageAnnotations[] = JSON.parse(storeTextMarkupObject);
            for (let i: number = 0; i < textMarkupAnnotationCollection.length; i++) {
                let newArray: ITextMarkupAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = textMarkupAnnotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // eslint-disable-next-line max-len
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.getBoundsForSave(pageAnnotationObject.annotations[z].bounds, i));
                        const colorString: string = pageAnnotationObject.annotations[z].color;
                        pageAnnotationObject.annotations[z].color = JSON.stringify(this.getRgbCode(colorString));
                        pageAnnotationObject.annotations[z].rect = JSON.stringify(pageAnnotationObject.annotations[z].rect);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                textMarkupAnnotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(textMarkupAnnotations);
    }

    /**
     * @private
     */
    public deleteTextMarkupAnnotation(): void {
        if (this.currentTextMarkupAnnotation) {
            let isLock: boolean = false;
            if (this.currentTextMarkupAnnotation.annotationSettings) {
                // eslint-disable-next-line
                isLock = this.currentTextMarkupAnnotation.annotationSettings.isLock;
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', this.currentTextMarkupAnnotation)) {
                    isLock = false;
                }
            }
            if (!isLock) {
                let deletedAnnotation: ITextMarkupAnnotation = null;
                this.showHideDropletDiv(true);
                // eslint-disable-next-line
                let annotation: any = this.currentTextMarkupAnnotation;
                if (this.currentTextMarkupAnnotation.isMultiSelect && annotation.annotNameCollection) {
                    this.deletMultiPageAnnotation(annotation);
                }
                const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
                if (pageAnnotations) {
                    for (let i: number = 0; i < pageAnnotations.length; i++) {
                        if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                            deletedAnnotation = pageAnnotations.splice(i, 1)[0];
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.addAction(this.selectTextMarkupCurrentPage, i, deletedAnnotation, 'Text Markup Deleted', null);
                            this.currentAnnotationIndex = i;
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(deletedAnnotation, 'textMarkup');
                            const removeDiv: HTMLElement = document.getElementById(deletedAnnotation.annotName);
                            if (removeDiv) {
                                if (removeDiv.parentElement.childElementCount === 1) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                                } else {
                                    removeDiv.remove();
                                }
                            }
                        }
                    }
                    this.pdfViewer.annotationModule.updateAnnotationCollection(this.currentTextMarkupAnnotation);
                    this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.updateImportAnnotationCollection(this.currentTextMarkupAnnotation, this.currentTextMarkupAnnotation.pageNumber, 'textMarkupAnnotation');
                    const annotationId: string = this.currentTextMarkupAnnotation.annotName;
                    // eslint-disable-next-line
                    let annotationBounds: any = this.currentTextMarkupAnnotation.bounds;
                    this.currentTextMarkupAnnotation = null;
                    this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
                    this.pdfViewer.isDocumentEdited = true;
                    // eslint-disable-next-line max-len
                    const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
                    if (multiPageCollection.length > 0) {
                        multiPageCollection.push(deletedAnnotation);
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationRemove(this.selectTextMarkupCurrentPage, annotationId, deletedAnnotation.textMarkupAnnotationType as AnnotationType, annotationBounds, deletedAnnotation.textMarkupContent, deletedAnnotation.textMarkupStartIndex, deletedAnnotation.textMarkupEndIndex, multiPageCollection);
                    } else {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationRemove(this.selectTextMarkupCurrentPage, annotationId, deletedAnnotation.textMarkupAnnotationType as AnnotationType, annotationBounds, deletedAnnotation.textMarkupContent, deletedAnnotation.textMarkupStartIndex, deletedAnnotation.textMarkupEndIndex);
                    }
                    this.currentAnnotationIndex = null;
                    this.selectTextMarkupCurrentPage = null;
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
                        this.pdfViewer.toolbarModule.showToolbar(true);
                    }
                }
            }
        }
    }
    /**
     * @param color
     * @private
     */
    public modifyColorProperty(color: string): void {
        if (this.currentTextMarkupAnnotation) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.modifyAnnotationProperty('Color', color, null);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
            this.pdfViewer.isDocumentEdited = true;
            // eslint-disable-next-line
            let annotation: any = this.currentTextMarkupAnnotation;
            // eslint-disable-next-line max-len
            const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
            if (multiPageCollection.length > 0) {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType, true, false, false, false, annotation.textMarkupContent, annotation.textMarkupStartIndex, annotation.textMarkupEndIndex, multiPageCollection); this.currentAnnotationIndex = null;
            } else {
                // eslint-disable-next-line max-len
                this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType, true, false, false, false, annotation.textMarkupContent, annotation.textMarkupStartIndex, annotation.textMarkupEndIndex); this.currentAnnotationIndex = null;
            }
        }
    }

    /**
     * @param args
     * @param isOpacity
     * @private
     */
    public modifyOpacityProperty(args: ChangeEventArgs, isOpacity?: number): void {
        if (this.currentTextMarkupAnnotation) {
            let pageAnnotations: ITextMarkupAnnotation[];
            if (isOpacity) {
                pageAnnotations = this.modifyAnnotationProperty('Opacity', isOpacity, 'changed');
            } else {
                pageAnnotations = this.modifyAnnotationProperty('Opacity', args.value / 100, args.name);
            }
            if (pageAnnotations) {
                this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
                this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
                if (isOpacity || args.name === 'changed') {
                    this.pdfViewer.isDocumentEdited = true;
                    // eslint-disable-next-line
                    let annotation: any = this.currentTextMarkupAnnotation;
                    // eslint-disable-next-line max-len
                    const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
                    if (multiPageCollection.length > 0) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType, false, true, false, false, annotation.textMarkupContent, annotation.textMarkupStartIndex, annotation.textMarkupEndIndex, multiPageCollection); this.currentAnnotationIndex = null;
                    } else {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType, false, true, false, false, annotation.textMarkupContent, annotation.textMarkupStartIndex, annotation.textMarkupEndIndex); this.currentAnnotationIndex = null;
                    }
                }
            }
        }
    }

    /**
     * @param property
     * @param value
     * @param status
     * @param annotName
     * @private
     */
    // eslint-disable-next-line
    public modifyAnnotationProperty(property: string, value: any, status: string, annotName?: string): ITextMarkupAnnotation[] {
        // eslint-disable-next-line
        let annotation: any = this.currentTextMarkupAnnotation;
        if (annotation.isMultiSelect && annotation.annotNameCollection) {
            this.modifyMultiPageAnnotations(annotation, property, value);
        }
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    if (property === 'Color') {
                        pageAnnotations[i].color = value;
                    } else if (property === 'Opacity') {
                        pageAnnotations[i].opacity = value;
                    } else if (property === 'AnnotationSettings') {
                        pageAnnotations[i].annotationSettings = { isLock: value };
                    }
                    pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    this.currentAnnotationIndex = i;
                    if (status === null || status === 'changed') {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.addAction(this.selectTextMarkupCurrentPage, i, this.currentTextMarkupAnnotation, 'Text Markup Property modified', property);
                    }
                    this.currentTextMarkupAnnotation = pageAnnotations[i];
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(pageAnnotations[i]);
                }
            }
        }
        return pageAnnotations;
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param index
     * @param action
     * @private
     */
    public undoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(pageAnnotations[index], 'textMarkup');
                // eslint-disable-next-line
                let removeDiv: any = document.getElementById(pageAnnotations[index].annotName);
                if (removeDiv) {
                    if (removeDiv.parentElement.childElementCount === 1) {
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                    } else {
                        removeDiv.remove();
                    }
                }
                pageAnnotations.splice(index, 1);
            } else if (action === 'Text Markup Deleted') {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(pageNumber, annotation.shapeAnnotationType);
                pageAnnotations.splice(index, 0, annotation);
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewer.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param index
     * @param property
     * @param isUndoAction
     * @param annotation
     * @param pageNumber
     * @param index
     * @param property
     * @param isUndoAction
     * @param annotation
     * @param pageNumber
     * @param index
     * @param property
     * @param isUndoAction
     * @param annotation
     * @param pageNumber
     * @param index
     * @param property
     * @param isUndoAction
     * @private
     */
    // eslint-disable-next-line max-len
    public undoRedoPropertyChange(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, property: string, isUndoAction?: boolean): ITextMarkupAnnotation {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (property === 'Color') {
                const tempColor: string = pageAnnotations[index].color;
                pageAnnotations[index].color = annotation.color;
                annotation.color = tempColor;
            } else {
                const tempOpacity: number = pageAnnotations[index].opacity;
                pageAnnotations[index].opacity = annotation.opacity;
                annotation.opacity = tempOpacity;
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotation, null, true);
            if (isUndoAction) {
                annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewer.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
        return annotation;
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param index
     * @param action
     * @private
     */
    public redoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(pageNumber, annotation.shapeAnnotationType);
                pageAnnotations.push(annotation);
            } else if (action === 'Text Markup Deleted') {
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(pageAnnotations[index], 'textMarkup');
                // eslint-disable-next-line
                let removeDiv: any = document.getElementById(pageAnnotations[index].annotName);
                if (removeDiv) {
                    if (removeDiv.parentElement.childElementCount === 1) {
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                    } else {
                        removeDiv.remove();
                    }
                }
                pageAnnotations.splice(index, 1);
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewer.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
    }

    /**
     * @param pageNumber
     * @param note
     * @param pageNumber
     * @param note
     * @private
     */
    public saveNoteContent(pageNumber: number, note: string): void {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    pageAnnotations[i].note = note;
                }
            }
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.isDocumentEdited = true;
    }

    private clearCurrentAnnotation(): void {
        if (!this.isExtended) {
            if (this.pdfViewer.isMaintainSelection && !this.pdfViewer.textSelectionModule.isTextSelection) {
                this.selectTextMarkupCurrentPage = this.selectTextMarkupCurrentPage;
                this.currentTextMarkupAnnotation = this.currentTextMarkupAnnotation;
            } else {
                this.selectTextMarkupCurrentPage = null;
                this.currentTextMarkupAnnotation = null;
            }
            let isSkip: boolean = false;
            // eslint-disable-next-line max-len
            if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.isInuptBoxInFocus) {
                isSkip = true;
            }
            if (!isSkip) {
                this.enableAnnotationPropertiesTool(false);
            }
        }
    }

    /**
     * @param pageNumber
     * @param isSelect
     * @param pageNumber
     * @param isSelect
     * @private
     */
    public clearCurrentAnnotationSelection(pageNumber: number, isSelect?: boolean): void {
        if (isSelect) {
            this.isAnnotationSelect = true;
        } else {
            this.isAnnotationSelect = false;
        }
        const lowerPageIndex: number = (pageNumber - 2) >= 0 ? (pageNumber - 2) : 0;
        // eslint-disable-next-line max-len
        const higherPageIndex: number = (pageNumber + 2) < this.pdfViewerBase.pageCount ? (pageNumber + 2) : this.pdfViewerBase.pageCount - 1;
        for (let k: number = lowerPageIndex; k <= higherPageIndex; k++) {
            this.clearAnnotationSelection(k);
        }
    }

    // eslint-disable-next-line
    private getBoundsForSave(bounds: any, pageIndex: number): any {
        // eslint-disable-next-line
        let newArray: any[] = [];
        for (let i: number = 0; i < bounds.length; i++) {
            // eslint-disable-next-line
            let bound: any = this.getAnnotationBounds(bounds[i], pageIndex);
            newArray.push(bound);
        }
        return newArray;
    }

    // eslint-disable-next-line
    private getAnnotationBounds(bounds: any, pageIndex: number): any {
        const left: number = bounds.left ? bounds.left : bounds.Left;
        const top: number = bounds.top ? bounds.top : bounds.Top;
        const height: number = bounds.height ? bounds.height : bounds.Height;
        const width: number = bounds.width ? bounds.width : bounds.Width;
        const pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { left: top, top: pageDetails.width - (left + width), width: height, height: width };
            } else if (pageDetails.rotation === 2) {
                // eslint-disable-next-line max-len
                return { left: pageDetails.width - left - width, top: pageDetails.height - top - height, width: width, height: height };
            } else if (pageDetails.rotation === 3) {
                return { left: pageDetails.height - top - height, top: left, width: height, height: width };
            } else {
                return { left: left, top: top, width: width, height: height };
            }
        } else {
            return { left: left, top: top, width: width, height: height };
        }
    }

    // eslint-disable-next-line
    private getRgbCode(colorString: string): any {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let markupStringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(markupStringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            markupStringArray = colorString.split(',');
        }
        // eslint-disable-next-line radix
        const textMarkupR: number = parseInt(markupStringArray[0].split('(')[1]);
        // eslint-disable-next-line radix
        const textMarkupG: number = parseInt(markupStringArray[1]);
        // eslint-disable-next-line radix
        const textMarkupB: number = parseInt(markupStringArray[2]);
        // eslint-disable-next-line radix
        const textMarkupA: number = parseInt(markupStringArray[3]);
        return { a: textMarkupA, r: textMarkupR, g: textMarkupG, b: textMarkupB };
    }

    private getDrawnBounds(): IPageAnnotationBounds[] {
        const pageBounds: IPageAnnotationBounds[] = [];
        const selection: Selection = window.getSelection();
        if (selection.anchorNode !== null) {
            const range: Range = document.createRange();
            const isBackWardSelection: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode === selection.focusNode) {
                const pageId: number = this.pdfViewerBase.textLayer.getPageIndex(selection.anchorNode);
                let startIndex: number = 0;
                let endIndex: number = 0;
                if (!isNaN(pageId)) {
                    let pageRect: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + pageId).getBoundingClientRect();
                    if (this.pdfViewerBase.isMixedSizeDocument) {
                        pageRect = this.pdfViewerBase.getElement('_textLayer_' + pageId).getBoundingClientRect();
                    }
                    if (isBackWardSelection) {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    } else {
                        if (selection.anchorOffset < selection.focusOffset) {
                            startIndex = selection.anchorOffset;
                            endIndex = selection.focusOffset;
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        } else {
                            startIndex = selection.focusOffset;
                            endIndex = selection.anchorOffset;
                            range.setStart(selection.focusNode, selection.focusOffset);
                            range.setEnd(selection.anchorNode, selection.anchorOffset);
                        }
                    }
                    const boundingRect: ClientRect = range.getBoundingClientRect();
                    // eslint-disable-next-line
                    let indexes: any = this.getIndexNumbers(pageId, range.toString(), range.commonAncestorContainer.textContent.toString());
                    // eslint-disable-next-line max-len
                    const rectangle: IRectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                    const rectangleArray: IRectangle[] = [];
                    rectangleArray.push(rectangle);
                    // eslint-disable-next-line
                    let rect: any = { left: rectangle.left, top: rectangle.top, right: rectangle.right, bottom: rectangle.bottom };
                    pageBounds.push({ pageIndex: pageId, bounds: rectangleArray, rect: rect, startIndex: indexes.startIndex, endIndex: indexes.endIndex, textContent: range.toString() });
                }
            } else {
                let startNode: Node; let endNode: Node;
                let selectionStartOffset: number; let selectionEndOffset: number;
                if (isBackWardSelection) {
                    startNode = selection.focusNode;
                    selectionStartOffset = selection.focusOffset;
                    endNode = selection.anchorNode;
                    selectionEndOffset = selection.anchorOffset;
                } else {
                    startNode = selection.anchorNode;
                    selectionStartOffset = selection.anchorOffset;
                    endNode = selection.focusNode;
                    selectionEndOffset = selection.focusOffset;
                }
                const anchorPageId: number = this.pdfViewerBase.textLayer.getPageIndex(startNode);
                const anchorTextId: number = this.pdfViewerBase.textLayer.getTextIndex(startNode, anchorPageId);
                const focusPageId: number = this.pdfViewerBase.textLayer.getPageIndex(endNode);
                const focusTextId: number = this.pdfViewerBase.textLayer.getTextIndex(endNode, focusPageId);
                let startOffset: number = 0; let endOffset: number = 0; let currentId: number = 0;
                for (let i: number = anchorPageId; i <= focusPageId; i++) {
                    const selectionRects: IRectangle[] = [];
                    let pageStartId: number; let pageEndId: number; let pageStartOffset: number; let pageEndOffset: number;
                    const textDivs: NodeList = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                    let pageRect: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + i).getBoundingClientRect();
                    if (this.pdfViewerBase.isMixedSizeDocument) {
                        pageRect = this.pdfViewerBase.getElement('_textLayer_' + i).getBoundingClientRect();
                    }
                    if (i === anchorPageId) {
                        currentId = anchorTextId;
                    } else {
                        currentId = 0;
                    }
                    for (let j: number = currentId; j < textDivs.length; j++) {
                        const textElement: HTMLElement = textDivs[j] as HTMLElement;
                        if (j === currentId) {
                            pageStartId = currentId;
                            pageStartOffset = (i === anchorPageId) ? selectionStartOffset : 0;
                        } else {
                            pageEndId = j;
                            pageEndOffset = (i === focusPageId) ? selectionEndOffset : textElement.textContent.length;
                        }
                        if (j === anchorTextId && i === anchorPageId) {
                            startOffset = selectionStartOffset;
                        } else {
                            startOffset = 0;
                        }
                        if (j === focusTextId && i === focusPageId) {
                            endOffset = selectionEndOffset;
                        } else {
                            endOffset = textElement.textContent.length;
                        }
                        for (let k: number = 0; k < textElement.childNodes.length; k++) {
                            const node: Node = textElement.childNodes[k];
                            range.setStart(node, startOffset);
                            range.setEnd(node, endOffset);
                        }
                        const boundingRect: ClientRect = range.getBoundingClientRect();
                        // eslint-disable-next-line max-len
                        const rectangle: IRectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                        selectionRects.push(rectangle);
                        range.detach();
                        if (i === focusPageId && j === focusTextId) {
                            break;
                        }
                    }
                    if (!pageEndId) {
                        pageEndId = pageStartId;
                    }
                    if (!pageEndOffset) {
                        pageEndOffset = endOffset;
                    }
                    const startElementNode: Node = this.pdfViewerBase.getElement('_text_' + i + '_' + pageStartId).childNodes[0];
                    const endElementNode: Node = this.pdfViewerBase.getElement('_text_' + i + '_' + pageEndId).childNodes[0];
                    const pageRange: Range = document.createRange();
                    pageRange.setStart(startElementNode, pageStartOffset);
                    pageRange.setEnd(endElementNode, pageEndOffset);
                    const pageRectBounds: ClientRect = pageRange.getBoundingClientRect();
                    const textValue: string = pageRange.toString();
                    // eslint-disable-next-line
                    let indexes: any = this.getIndexNumbers(i, textValue);
                    // eslint-disable-next-line max-len
                    const pageRectangle: IRectangle = { left: this.getDefaultValue(pageRectBounds.left - pageRect.left), top: this.getDefaultValue(pageRectBounds.top - pageRect.top), width: this.getDefaultValue(pageRectBounds.width), height: this.getDefaultValue(pageRectBounds.height), right: this.getDefaultValue(pageRectBounds.right - pageRect.left), bottom: this.getDefaultValue(pageRectBounds.bottom - pageRect.top) };
                    // eslint-disable-next-line
                    let rect: any = { left: pageRectangle.left, top: pageRectangle.top, right: pageRectangle.right, bottom: pageRectangle.bottom };
                    pageBounds.push({ pageIndex: i, bounds: selectionRects, rect: rect, startIndex: indexes.startIndex, endIndex: indexes.endIndex, textContent: textValue });
                }
            }
        }
        selection.removeAllRanges();
        return pageBounds;
    }

    // eslint-disable-next-line
    private getIndexNumbers(pageNumber: number, content: string, parentText?: string): any {
        // eslint-disable-next-line
        let storedData: any = this.pdfViewerBase.getStoredData(pageNumber);
        let startIndex: number;
        let endIndex: number;
        if (storedData) {
            let previousIndex: number = 0;
            const pageText: string = storedData.pageText;
            for (let p: number = 0; p < pageNumber; p++) {
                if (this.pdfViewer.isExtractText) {
                    // eslint-disable-next-line
                    let documentIndex: any = this.pdfViewer.textSearchModule.documentTextCollection[p][p];
                    const pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.textSearchModule && this.pdfViewer.textSearchModule.documentTextCollection && this.pdfViewer.textSearchModule.isTextRetrieved) {
                        if (this.pdfViewer.textSearchModule.documentTextCollection[p]) {
                            previousIndex = previousIndex + pageTextData.length;
                        }
                    } else {
                        // eslint-disable-next-line max-len
                        if (this.pdfViewer.textSearchModule && this.pdfViewer.textSearchModule.documentTextCollection) {
                            if (pageNumber <= this.pdfViewer.textSearchModule.documentTextCollection.length) {
                                if (this.pdfViewer.textSearchModule.documentTextCollection[p]) {
                                    // eslint-disable-next-line max-len
                                    previousIndex = previousIndex + pageTextData.length;
                                }
                            } else {
                                previousIndex = 0;
                                break;
                            }
                        }
                    }
                }
            }
            if (!isNullOrUndefined(parentText)) {
                const parentIndex: number = pageText.indexOf(parentText);
                const initialIndex: number = parentText.indexOf(content);
                startIndex = (parentIndex + initialIndex) + previousIndex;
            } else {
                startIndex = (pageText.indexOf(content)) + previousIndex;
            }
            endIndex = startIndex + (content.length - 1);
        }
        return { startIndex: startIndex, endIndex: endIndex };
    }

    /**
     * @param pageNumber
     * @private
     */
    public rerenderAnnotationsPinch(pageNumber: number): void {
        let annotCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (annotCanvas) {
            const oldAnnotCanvas: HTMLElement = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
            if (oldAnnotCanvas) {
                if (annotCanvas) {
                    oldAnnotCanvas.id = annotCanvas.id;
                    annotCanvas.parentElement.removeChild(annotCanvas);
                } else {
                    oldAnnotCanvas.id = this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber;
                }
                annotCanvas = oldAnnotCanvas;
            }
            annotCanvas.style.width = '';
            annotCanvas.style.height = '';
            if (this.pdfViewer.restrictZoomRequest) {
                // eslint-disable-next-line max-len
                (annotCanvas as HTMLCanvasElement).style.width = this.pdfViewerBase.pageSize[pageNumber].width * this.pdfViewerBase.getZoomFactor() + 'px';
                // eslint-disable-next-line max-len
                (annotCanvas as HTMLCanvasElement).style.height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor() + 'px';
            } else {
                // eslint-disable-next-line max-len
                (annotCanvas as HTMLCanvasElement).width = this.pdfViewerBase.pageSize[pageNumber].width * this.pdfViewerBase.getZoomFactor();
                (annotCanvas as HTMLCanvasElement).height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
            }

            this.renderTextMarkupAnnotations(null, pageNumber, annotCanvas, this.pdfViewerBase.getZoomFactor());
        }
    }

    /**
     * @param pageNumber
     * @private
     */
    public rerenderAnnotations(pageNumber: number): void {
        // eslint-disable-next-line
        let oldCanvasCollection: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_old_annotationCanvas_' + pageNumber);
        for (let i: number = 0; i < oldCanvasCollection.length; i++) {
            if (oldCanvasCollection[i]) {
                oldCanvasCollection[i].parentElement.removeChild(oldCanvasCollection[i]);
            }
        }
        const newCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (newCanvas) {
            newCanvas.style.display = 'block';
        }
    }

    /**
     * @param event
     * @private
     */
    public onTextMarkupAnnotationMouseUp(event: MouseEvent): void {
        const pageNumber: number = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            if (this.currentTextMarkupAnnotation) {
                this.selectedTextMarkup = this.currentTextMarkupAnnotation;
            } else {
                this.selectedTextMarkup = null;
            }
            this.clearCurrentSelectedAnnotation();
            const currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageNumber, canvas);
            if (currentAnnot && !window.getSelection().toString()) {
                let isLock: boolean = false;
                let isSelection: boolean = false;
                if (currentAnnot.annotationSettings && currentAnnot.annotationSettings.isLock) {
                    isLock = currentAnnot.annotationSettings.isLock;
                    if (isLock && this.pdfViewer.annotationModule.checkAllowedInteractions('Select', currentAnnot)) {
                        isLock = false;
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('PropertyChange', currentAnnot)) {
                            isSelection = false;
                        } else {
                            isSelection = true;
                        }
                    }
                }
                if (!isLock) {
                    const canvasParentPosition: ClientRect = canvas.parentElement.getBoundingClientRect();
                    const leftClickPosition: number = event.clientX - canvasParentPosition.left;
                    const topClickPosition: number = event.clientY - canvasParentPosition.top;
                    this.annotationClickPosition = { x: leftClickPosition, y: topClickPosition };
                    this.selectAnnotation(currentAnnot, canvas, pageNumber, event);
                    this.currentTextMarkupAnnotation = currentAnnot;
                    this.selectTextMarkupCurrentPage = pageNumber;
                    if (!isSelection) {
                        this.enableAnnotationPropertiesTool(true);
                    }
                    const commentPanelDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentPanelDiv && commentPanelDiv.style.display === 'block') {
                        // eslint-disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // eslint-disable-next-line
                        let comments: any = document.getElementById(currentAnnot.annotName);
                        if (comments) {
                            comments.firstChild.click();
                        }
                    }
                    if (!isBlazor()) {
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                            // eslint-disable-next-line max-len
                            this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                        }
                    }
                }
            } else {
                this.clearCurrentAnnotation();
            }
            if (this.pdfViewer.isMaintainSelection && !this.pdfViewer.textSelectionModule.isTextSelection) {
                if (currentAnnot) {
                    this.clearCurrentAnnotationSelection(pageNumber);
                }
            } else {
                this.clearCurrentAnnotationSelection(pageNumber);
            }
        } else {
            if (!this.pdfViewerBase.isClickedOnScrollBar(event, true)) {
                this.clearCurrentAnnotation();
                this.clearCurrentAnnotationSelection(pageNumber);
            }
        }
    }

    /**
     * @param event
     * @private
     */
    public onTextMarkupAnnotationTouchEnd(event: TouchEvent): void {
        const pageNumber: number = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            if (this.currentTextMarkupAnnotation) {
                this.selectedTextMarkup = this.currentTextMarkupAnnotation;
            } else {
                this.selectedTextMarkup = null;
            }
            this.clearCurrentAnnotationSelection(pageNumber);
            const touchCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            this.clearCurrentSelectedAnnotation();
            // eslint-disable-next-line max-len
            const currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.touches[0].clientX, event.touches[0].clientY, pageNumber, touchCanvas);
            if (currentAnnot) {
                let isLock: boolean = false;
                if (currentAnnot.annotationSettings && currentAnnot.annotationSettings.isLock) {
                    isLock = currentAnnot.annotationSettings.isLock;
                }
                if (!isLock) {
                    const canvasParentPosition: ClientRect = touchCanvas.parentElement.getBoundingClientRect();
                    const leftClickPosition: number = event.touches[0].clientX - canvasParentPosition.left;
                    const topClickPosition: number = event.touches[0].clientY - canvasParentPosition.top;
                    this.annotationClickPosition = { x: leftClickPosition, y: topClickPosition };
                    this.selectAnnotation(currentAnnot, touchCanvas, pageNumber, event);
                    this.currentTextMarkupAnnotation = currentAnnot;
                    this.selectTextMarkupCurrentPage = pageNumber;
                    this.enableAnnotationPropertiesTool(true);
                    // eslint-disable-next-line
                    let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                    if (accordionExpand) {
                        accordionExpand.ej2_instances[0].expandItem(true);
                    }
                    // eslint-disable-next-line
                    let comments: any = document.getElementById(currentAnnot.annotName);
                    if (comments) {
                        comments.firstChild.click();
                    }
                }
            } else {
                this.clearCurrentAnnotation();
            }
            this.clearCurrentAnnotationSelection(pageNumber);
        } else if (this.selectTextMarkupCurrentPage != null && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            const number: number = this.selectTextMarkupCurrentPage;
            this.selectTextMarkupCurrentPage = null;
            this.clearAnnotationSelection(number);
        } else {
            this.clearCurrentAnnotation();
            this.clearCurrentAnnotationSelection(pageNumber);
        }
    }

    /**
     * @private
     */
    public clearCurrentSelectedAnnotation(): void {
        if (this.currentTextMarkupAnnotation) {
            this.clearAnnotationSelection(this.selectTextMarkupCurrentPage);
            // eslint-disable-next-line
            let currentAnnot: any = this.currentTextMarkupAnnotation;
            this.pdfViewer.fireAnnotationUnSelect(currentAnnot.annotName, currentAnnot.pageNumber, currentAnnot);
            this.clearCurrentAnnotation();
        }
    }

    /**
     * @param event
     * @private
     */
    public onTextMarkupAnnotationMouseMove(event: MouseEvent): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        // eslint-disable-next-line
        let pageIndex: number = parseInt(eventTarget.id.split('_text_')[1]) || parseInt(eventTarget.id.split('_textLayer_')[1]) || parseInt(eventTarget.id.split('_annotationCanvas_')[1]);
        if (event.target && (eventTarget.id.indexOf('_text') > -1 || eventTarget.id.indexOf('_annotationCanvas') > -1 || eventTarget.classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
            pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
            const currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageIndex, canvas);
            if (currentAnnot) {
                eventTarget.style.cursor = 'pointer';
                // eslint-disable-next-line
                let currentPosition: any = this.pdfViewerBase.getMousePosition(event);
                // eslint-disable-next-line
                let relativePosition: any = this.pdfViewerBase.relativePosition(event);
                // eslint-disable-next-line
                let viewerPositions: any = { left: relativePosition.x, top: relativePosition.y };
                // eslint-disable-next-line
                let mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                // eslint-disable-next-line
                let annotationSettings: any = { opacity: currentAnnot.opacity, color: currentAnnot.color, author: currentAnnot.author, subject: currentAnnot.subject, modifiedDate: currentAnnot.modifiedDate };
                // eslint-disable-next-line max-len
                this.pdfViewerBase.isMousedOver = true;
                this.pdfViewer.fireAnnotationMouseover(currentAnnot.annotName, currentAnnot.pageNumber, currentAnnot.textMarkupAnnotationType as AnnotationType, currentAnnot.bounds, annotationSettings, mousePositions, viewerPositions);
                // this.showPopupNote(event, currentAnnot);
            } else {
                this.pdfViewer.annotationModule.hidePopupNote();
                if (this.pdfViewerBase.isPanMode && !this.pdfViewerBase.getAnnotationToolStatus()) {
                    eventTarget.style.cursor = 'grab';
                } else {
                    eventTarget.style.cursor = 'auto';
                }
                if (this.pdfViewerBase.isMousedOver) {
                    this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                    this.pdfViewerBase.isMousedOver = false;
                }
            }
        }
    }

    // eslint-disable-next-line
    private showPopupNote(event: any, annotation: ITextMarkupAnnotation): void {
        if (annotation.note) {
            // eslint-disable-next-line max-len
            this.pdfViewer.annotationModule.showPopupNote(event, annotation.color, annotation.author, annotation.note, annotation.textMarkupAnnotationType);
        }
    }

    private getCurrentMarkupAnnotation(clientX: number, clientY: number, pageNumber: number, canvas: HTMLElement): ITextMarkupAnnotation {
        const currentTextMarkupAnnotations: ITextMarkupAnnotation[] = [];
        if (canvas) {
            let canvasParentPosition: ClientRect = canvas.parentElement.getBoundingClientRect();
            if (canvas.clientWidth !== canvas.parentElement.clientWidth) {
                canvasParentPosition = canvas.getBoundingClientRect();
            }
            const leftClickPosition: number = clientX - canvasParentPosition.left;
            const topClickPosition: number = clientY - canvasParentPosition.top;
            const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
            let isAnnotationGot: boolean = false;
            if (annotationList) {
                for (let i: number = 0; i < annotationList.length; i++) {
                    const annotation: ITextMarkupAnnotation = annotationList[i];
                    for (let j: number = 0; j < annotation.bounds.length; j++) {
                        // eslint-disable-next-line
                        let bound: any = annotation.bounds[j];
                        const left: number = bound.left ? bound.left : bound.Left;
                        const top: number = bound.top ? bound.top : bound.Top;
                        const width: number = bound.width ? bound.width : bound.Width;
                        const height: number = bound.height ? bound.height : bound.Height;
                        // eslint-disable-next-line max-len
                        if (leftClickPosition >= this.getMagnifiedValue(left, this.pdfViewerBase.getZoomFactor()) && leftClickPosition <= this.getMagnifiedValue(left + width, this.pdfViewerBase.getZoomFactor()) && topClickPosition >= this.getMagnifiedValue(top, this.pdfViewerBase.getZoomFactor()) && topClickPosition <= this.getMagnifiedValue(top + height, this.pdfViewerBase.getZoomFactor())) {
                            currentTextMarkupAnnotations.push(annotation);
                            isAnnotationGot = true;
                        } else {
                            if (isAnnotationGot) {
                                isAnnotationGot = false;
                                break;
                            }
                        }
                    }
                }
            }
            let currentAnnot: ITextMarkupAnnotation = null;
            if (currentTextMarkupAnnotations.length > 1) {
                currentAnnot = this.compareCurrentAnnotations(currentTextMarkupAnnotations);
            } else if (currentTextMarkupAnnotations.length === 1) {
                currentAnnot = currentTextMarkupAnnotations[0];
            }
            return currentAnnot;
        } else {
            return null;
        }
    }

    private compareCurrentAnnotations(annotations: ITextMarkupAnnotation[]): ITextMarkupAnnotation {
        let previousX: number;
        let currentAnnotation: ITextMarkupAnnotation = null;
        for (let i: number = 0; i < annotations.length; i++) {
            if (i === annotations.length - 1) {
                break;
            }
            // eslint-disable-next-line
            let firstAnnotBounds: any = annotations[i].bounds;
            const firstXposition: number = firstAnnotBounds[0].left ? firstAnnotBounds[0].left : firstAnnotBounds[0].Left;
            const firstYposition: number = firstAnnotBounds[0].top ? firstAnnotBounds[0].top : firstAnnotBounds[0].Top;
            // eslint-disable-next-line
            let secondAnnotBounds: any = annotations[i + 1].bounds;
            const secondXposition: number = secondAnnotBounds[0].left ? secondAnnotBounds[0].left : secondAnnotBounds[0].Left;
            const secondYposition: number = secondAnnotBounds[0].top ? secondAnnotBounds[0].top : secondAnnotBounds[0].Top;
            if ((firstXposition < secondXposition) || (firstYposition < secondYposition)) {
                previousX = secondXposition;
                currentAnnotation = annotations[i + 1];
            } else {
                previousX = firstXposition;
                currentAnnotation = annotations[i];
            }
            if (previousX && (i === (annotations.length - 2))) {
                if ((previousX === firstXposition) && (previousX === secondXposition)) {
                    previousX = secondXposition;
                    currentAnnotation = annotations[i + 1];
                }
            }
        }
        return currentAnnotation;
    }
    /**
     * @param pageNumber
     * @private
     */
    public clearAnnotationSelection(pageNumber: number): void {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setLineDash([]);
            this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
        }
    }

    /**
     * @param annotation
     * @param canvas
     * @param pageNumber
     * @param event
     * @param isProgrammaticSelection
     * @param annotation
     * @param canvas
     * @param pageNumber
     * @param event
     * @param isProgrammaticSelection
     * @private
     */
    // eslint-disable-next-line max-len
    public selectAnnotation(annotation: ITextMarkupAnnotation, canvas: HTMLElement, pageNumber?: number, event?: MouseEvent | TouchEvent, isProgrammaticSelection?: boolean): void {
        if (this.pdfViewer.selectedItems.annotations[0]) {
            this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
            this.pdfViewer.clearSelection(this.selectTextMarkupCurrentPage);
        }
        let isLock: boolean = false;
        if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
            isLock = annotation.annotationSettings.isLock;
            if (isLock && this.pdfViewer.annotationModule.checkAllowedInteractions('Select', annotation)) {
                isLock = false;
            }
        }
        if (!isLock) {
            let isCurrentTextMarkup: boolean = false;
            if (!this.currentTextMarkupAnnotation) {
                isCurrentTextMarkup = true;
            }
            if (this.selectedTextMarkup && annotation && !isProgrammaticSelection) {
                if (this.selectedTextMarkup.annotName === annotation.annotName) {
                    isCurrentTextMarkup = false;
                } else {
                    isCurrentTextMarkup = true;
                }
            }
            if (!isNaN(pageNumber)) {
                this.selectTextMarkupCurrentPage = pageNumber;
                this.currentTextMarkupAnnotation = annotation;
                annotation = this.retreiveTextIndex(annotation);
                this.currentTextMarkupAnnotation = annotation;
            }
            if (this.isSelectedAnnotation) {
                this.pdfViewerBase.isSelection = true;
                this.updateAnnotationBounds();
            }
            // eslint-disable-next-line
            let currentEvent: any = event;
            if (this.isEnableTextMarkupResizer(annotation.textMarkupAnnotationType) && annotation && currentEvent && !currentEvent.touches) {
                this.updateCurrentResizerPosition(annotation);
            }
            this.drawAnnotationSelector(annotation, this.currentTextMarkupAnnotation, canvas);
            if (annotation.isMultiSelect && annotation.annotNameCollection) {
                this.selectMultiPageAnnotations(annotation);
            }
            if (annotation.annotName !== '' && !this.isNewAnnotation) {
                if (isCurrentTextMarkup) {
                    let isSelected: boolean = false;
                    if (!currentEvent) {
                        isSelected = true;
                    }
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.annotationSelect(annotation.annotName, this.selectTextMarkupCurrentPage, annotation, null, false, isSelected);
                    this.selectedTextMarkup = null;
                }
            }
            if (annotation && this.isEnableTextMarkupResizer(annotation.textMarkupAnnotationType)) {
                this.isTextMarkupAnnotationMode = true;
            }
        }
    }
    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public updateCurrentResizerPosition(annotation?: any): void {
        if (!annotation) {
            annotation = this.currentTextMarkupAnnotation;
        }
        if (annotation) {
            if (this.isEnableTextMarkupResizer(annotation.textMarkupAnnotationType) && annotation) {
                // eslint-disable-next-line
                let textElement: any = this.pdfViewerBase.getElement('_textLayer_' + this.selectTextMarkupCurrentPage)
                if (textElement) {
                    // eslint-disable-next-line
                    let boundingRect: any = textElement.getBoundingClientRect();
                    const left: number = annotation.bounds[0].left ? annotation.bounds[0].left : annotation.bounds[0].Left;
                    const top: number = annotation.bounds[0].top ? annotation.bounds[0].top : annotation.bounds[0].Top;
                    this.updateLeftposition(left * this.pdfViewerBase.getZoomFactor() + boundingRect.left, (boundingRect.top + top), true);
                    // eslint-disable-next-line
                    let endPosition: any = annotation.bounds[annotation.bounds.length - 1];
                    const endLeft: number = endPosition.left ? endPosition.left : endPosition.Left;
                    const endTop: number = endPosition.top ? endPosition.top : endPosition.Top;
                    const endWidth: number = endPosition.width ? endPosition.width : endPosition.Width;
                    // eslint-disable-next-line max-len
                    this.updatePosition((endLeft + endWidth) * this.pdfViewerBase.getZoomFactor() + boundingRect.left, (endTop + boundingRect.top), true);
                }
            }
        }
    }
    // eslint-disable-next-line
    private drawAnnotationSelectRect(canvas: HTMLElement, x: number, y: number, width: number, height: number, annotation: any): void {
        if (canvas) {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.beginPath();
            if (typeof (annotation).annotationSelectorSettings === 'string') {
                // eslint-disable-next-line max-len
                let lineDash: number[] = JSON.parse(annotation.annotationSelectorSettings).selectorLineDashArray.length === 0 ? [4] : JSON.parse(annotation.annotationSelectorSettings).selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                context.setLineDash(lineDash);
                context.globalAlpha = 1;
                context.rect(x, y, width, height);
                context.closePath();
                // eslint-disable-next-line max-len
                const borderColor: string = JSON.parse(annotation.annotationSelectorSettings).selectionBorderColor === '' ? '#0000ff' : JSON.parse(annotation.annotationSelectorSettings).selectionBorderColor;
                context.strokeStyle = borderColor;
                // eslint-disable-next-line max-len
                context.lineWidth = JSON.parse(annotation.annotationSelectorSettings).selectionBorderThickness === 1 ? 1 : (annotation.annotationSelectorSettings).selectionBorderThickness;
                context.stroke();
                context.save();
            } else {
                // eslint-disable-next-line max-len
                let lineDash: number[] = (annotation.annotationSelectorSettings).selectorLineDashArray.length === 0 ? [4] : (annotation.annotationSelectorSettings).selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                context.setLineDash(lineDash);
                context.globalAlpha = 1;
                context.rect(x, y, width, height);
                context.closePath();
                // eslint-disable-next-line max-len
                const borderColor: string = (annotation.annotationSelectorSettings).selectionBorderColor === '' ? '#0000ff' : (annotation.annotationSelectorSettings).selectionBorderColor;
                context.strokeStyle = borderColor;
                // eslint-disable-next-line max-len
                context.lineWidth = (annotation.annotationSelectorSettings).selectionBorderThickness ? 1 : (annotation.annotationSelectorSettings).selectionBorderThickness;
                context.stroke();
                context.save();
            }
        }
    }

    /**
     * @param isEnable
     * @private
     */
    public enableAnnotationPropertiesTool(isEnable: boolean): void {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            // eslint-disable-next-line max-len
            this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-color-container');
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(isEnable);
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule.isMobileAnnotEnabled && this.pdfViewer.selectedItems.annotations.length === 0) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(isEnable);
                let enable: boolean = isEnable;
                if (this.isTextMarkupAnnotationMode) {
                    enable = true;
                }
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(enable);
                if (this.currentTextMarkupAnnotation) {
                    if (!isBlazor()) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, this.currentTextMarkupAnnotation.color);
                    } else {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElementInBlazor, this.currentTextMarkupAnnotation.color);
                    }
                } else {
                    if (!this.isTextMarkupAnnotationMode) {
                        if (!isBlazor()) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, '#000000');
                        } else {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElementInBlazor, '#000000');
                        }
                    } else {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    public maintainAnnotationSelection(): void {
        if (this.currentTextMarkupAnnotation) {
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + this.selectTextMarkupCurrentPage);
            if (canvas) {
                this.selectAnnotation(this.currentTextMarkupAnnotation, canvas, this.selectTextMarkupCurrentPage);
            }
        }
    }

    // private storeAnnotations(pageNumber: number, annotation: ITextMarkupAnnotation): number {
    // eslint-disable-next-line
    //     let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
    //     let index: number = 0;
    //     if (!storeObject) {
    //         let markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
    //         markupAnnotation.annotations.push(annotation);
    //         index = markupAnnotation.annotations.indexOf(annotation);
    //         let annotationCollection: IPageAnnotations[] = [];
    //         annotationCollection.push(markupAnnotation);
    //         let annotationStringified: string = JSON.stringify(annotationCollection);
    //         window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
    //     } else {
    //         let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
    //         window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
    //         let pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
    //         if (annotObject[pageIndex]) {
    //             (annotObject[pageIndex] as IPageAnnotations).annotations.push(annotation);
    //             index = (annotObject[pageIndex] as IPageAnnotations).annotations.indexOf(annotation);
    //         } else {
    //             let markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
    //             markupAnnotation.annotations.push(annotation);
    //             index = markupAnnotation.annotations.indexOf(annotation);
    //             annotObject.push(markupAnnotation);
    //         }
    //         let annotationStringified: string = JSON.stringify(annotObject);
    //         window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
    //     }
    //     return index;
    // }

    /**
     * @param pageAnnotations
     * @param pageNumber
     * @private
     */
    public manageAnnotations(pageAnnotations: ITextMarkupAnnotation[], pageNumber: number): void {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
            }
        }
    }
    /**
     * @param pageIndex
     * @param textMarkupAnnotations
     * @param id
     * @param pageIndex
     * @param textMarkupAnnotations
     * @param id
     * @private
     */
    // eslint-disable-next-line
    public getAnnotations(pageIndex: number, textMarkupAnnotations: any[], id?: string): any[] {
        // eslint-disable-next-line
        let annotationCollection: any[];
        // eslint-disable-next-line
        if (id == null || id == undefined) {
            id = '_annotations_textMarkup';
        }
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + id);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + id];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            } else {
                annotationCollection = textMarkupAnnotations;
            }
        } else {
            annotationCollection = textMarkupAnnotations;
        }
        return annotationCollection;
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line
    private getAddedAnnotation(type: string, color: string, opacity: number, bounds: any, author: string, subject: string, predefinedDate: string, note: string, isCommentLock: boolean, rect: any, pageNumber: number, textContent: string, startIndex: number, endIndex: number, isMultiSelect?: boolean, allowedInteractions?:any): ITextMarkupAnnotation {
        // eslint-disable-next-line max-len
        const modifiedDate: string = predefinedDate ? predefinedDate : this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('textMarkup', pageNumber + 1, type);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        // eslint-disable-next-line
        let annotationSettings: object =  this.getAnnotationSettings(type);
        const isPrint: boolean = this.getIsPrintValue(type);
        const annotation: ITextMarkupAnnotation = {
            // eslint-disable-next-line max-len
            textMarkupAnnotationType: type, color: color, opacity: opacity, bounds: bounds, author: author, allowedInteractions: allowedInteractions, subject: subject, modifiedDate: modifiedDate, note: note, rect: rect,
            annotName: annotationName, comments: [], review: { state: '', stateModel: '', author: author, modifiedDate: modifiedDate }, shapeAnnotationType: 'textMarkup', pageNumber: pageNumber,
            // eslint-disable-next-line max-len
            textMarkupContent: textContent, textMarkupStartIndex: startIndex, textMarkupEndIndex: endIndex, isMultiSelect: isMultiSelect, annotationSelectorSettings: this.getSelector(type),
            customData: this.pdfViewer.annotation.getTextMarkupData(subject), annotationAddMode: this.annotationAddMode, annotationSettings: annotationSettings, isPrint: isPrint, isCommentLock: isCommentLock
        };
        if (isMultiSelect) {
            this.multiPageCollection.push(annotation);
        }
        let isSkip: boolean = false;
        if (isMultiSelect && this.isExtended) {
            isSkip = true;
        }
        if (document.getElementById(annotationName) && !isSkip) {
            document.getElementById(annotationName).addEventListener('mouseup', this.annotationDivSelect(annotation, pageNumber));
        }
        const storedIndex: number = this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotation, '_annotations_textMarkup');
        this.pdfViewer.annotationModule.addAction(pageNumber, storedIndex, annotation, 'Text Markup Added', null);
        return annotation;
    }

    private getSelector(type: string): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (type === 'Highlight' && this.pdfViewer.highlightSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.highlightSettings.annotationSelectorSettings;
        } else if (type === 'Underline' && this.pdfViewer.underlineSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.underlineSettings.annotationSelectorSettings;
        } else if (type === 'Strikethrough' && this.pdfViewer.strikethroughSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.strikethroughSettings.annotationSelectorSettings;
        }
        return selector;
    }
    private getAnnotationSettings(type: string): object {
        let annotationSettings: object = { isLock: false };
        if (type === 'Highlight' && this.pdfViewer.highlightSettings.isLock) {
            annotationSettings = { isLock : true };
        } else if (type === 'Underline' && this.pdfViewer.underlineSettings.isLock) {
            annotationSettings = { isLock : true };
        } else if (type === 'Strikethrough' && this.pdfViewer.strikethroughSettings.isLock) {
            annotationSettings = { isLock : true };
        } else if (this.pdfViewer.annotationSettings.isLock) {
            annotationSettings = { isLock : true };
        }
        return annotationSettings;
    }
    private getIsPrintValue(type: string): boolean {
        let isPrint: boolean = true;
        if (type === 'Highlight') {
            isPrint = this.pdfViewer.highlightSettings.isPrint;
        }
        if (type === 'Underline') {
            isPrint = this.pdfViewer.underlineSettings.isPrint;
        }
        if (type === 'Strikethrough') {
            isPrint = this.pdfViewer.strikethroughSettings.isPrint;
        }
        return isPrint;
    }
    // eslint-disable-next-line
    private annotationDivSelect(annotation: any, pageNumber: number): any {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        this.selectAnnotation(annotation, canvas, pageNumber);
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.clearShapeMode();
                this.pdfViewer.toolbarModule.annotationToolbarModule.clearMeasureMode();
                let isLock: boolean = false;
                if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                    isLock = annotation.annotationSettings.isLock;
                }
                if (isLock) {
                    if (this.pdfViewer.annotationModule.checkAllowedInteractions('PropertyChange', annotation)) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(true);
                        this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                    }
                    if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                    }
                } else {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(true);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                }
                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                if (!isBlazor()) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                }
            }
        }
    }

    private getPageContext(pageNumber: number): CanvasRenderingContext2D {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        let context: CanvasRenderingContext2D = null;
        if (canvas) {
            context = (canvas as HTMLCanvasElement).getContext('2d');
        }
        return context;
    }

    private getDefaultValue(value: number): number {
        return value / this.pdfViewerBase.getZoomFactor();
    }

    private getMagnifiedValue(value: number, factor: number): number {
        return value * factor;
    }

    /**
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public saveImportedTextMarkupAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: ITextMarkupAnnotation = null;
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotation.Subject);
        if (annotation.AnnotationSettings && annotation.AnnotationSettings.isLock) {
            annotation.AnnotationSettings = { isLock: annotation.AnnotationSettings.isLock };
        } else {
            annotation.AnnotationSettings = this.getAnnotationSettings(annotation.TextMarkupAnnotationType);
        }
        // eslint-disable-next-line max-len
        annotation.allowedInteractions = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        // eslint-disable-next-line max-len
        annotationObject = {
            // eslint-disable-next-line max-len
            textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, opacity: annotation.Opacity, allowedInteractions: annotation.allowedInteractions, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
            annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            shapeAnnotationType: 'textMarkup',
            pageNumber: pageNumber, textMarkupContent: '', textMarkupStartIndex: 0,
            // eslint-disable-next-line max-len
            textMarkupEndIndex: 0, annotationSelectorSettings: this.getSettings(annotation), customData: this.pdfViewer.annotation.getCustomData(annotation),
            isMultiSelect: annotation.IsMultiSelect, annotNameCollection: annotation.AnnotNameCollection, annotpageNumbers: annotation.AnnotpageNumbers,
            // eslint-disable-next-line max-len
            annotationAddMode: this.annotationAddMode, annotationSettings : annotation.AnnotationSettings, isPrint: annotation.isPrint, isCommentLock: annotation.IsCommentLock
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_textMarkup');
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public updateTextMarkupAnnotationCollections(annotation: any, pageNumber: number): any {
        // eslint-disable-next-line
        let annotationObject: any = null;
        // eslint-disable-next-line max-len
        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotationObject = {
            // eslint-disable-next-line max-len
            textMarkupAnnotationType: annotation.TextMarkupAnnotationType, allowedInteractions: annotation.allowedInteractions, color: annotation.Color, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
            annotationId: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, shapeAnnotationType: 'textMarkup', pageNumber: pageNumber, isMultiSelect: annotation.IsMultiSelect, annotNameCollection: annotation.AnnotNameCollection, annotpageNumbers: annotation.AnnotpageNumbers, customData: this.pdfViewer.annotation.getCustomData(annotation),
            isPrint: annotation.isPrint, isCommentLock: annotation.IsCommentLock
        };
        return annotationObject;
    }
    /**
     * @param textMarkUpSettings
     * @private
     */
    // eslint-disable-next-line
    public updateTextMarkupSettings(textMarkUpSettings: string): any {
        if (textMarkUpSettings === 'highlightSettings') {
            // eslint-disable-next-line max-len
            this.highlightColor = this.pdfViewer.highlightSettings.color ? this.pdfViewer.highlightSettings.color : this.highlightColor;
            // eslint-disable-next-line max-len
            this.highlightOpacity = this.pdfViewer.highlightSettings.opacity ? this.pdfViewer.highlightSettings.opacity : this.highlightOpacity;
        }
        if (textMarkUpSettings === 'underlineSettings') {
            // eslint-disable-next-line max-len
            this.underlineColor = this.pdfViewer.underlineSettings.color ? this.pdfViewer.underlineSettings.color : this.underlineColor;
            // eslint-disable-next-line max-len
            this.underlineOpacity = this.pdfViewer.underlineSettings.opacity ? this.pdfViewer.underlineSettings.opacity : this.underlineOpacity;
        }
        if (textMarkUpSettings === 'strikethroughSettings') {
            // eslint-disable-next-line max-len
            this.strikethroughColor = this.pdfViewer.strikethroughSettings.color ? this.pdfViewer.strikethroughSettings.color : this.strikethroughColor;
            // eslint-disable-next-line max-len
            this.strikethroughOpacity = this.pdfViewer.strikethroughSettings.opacity ? this.pdfViewer.strikethroughSettings.opacity : this.strikethroughOpacity;
        }
    }

    /**
     * @private
     */
    public clear(): void {
        this.selectTextMarkupCurrentPage = null;
        this.currentTextMarkupAnnotation = null;
        this.annotationClickPosition = null;
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
    }
}
