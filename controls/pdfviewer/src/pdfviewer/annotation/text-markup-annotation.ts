import {
    PdfViewer, PdfViewerBase, IRectangle, ISelection, AnnotationType, IPageAnnotations, ICommentsCollection,
    IReviewCollection,
    ISize,
    AllowedInteraction,
    AnnotationsInternal
} from '../index';
import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
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
    bounds: any;
    color: any;
    opacity: number
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
    annotNameCollection?: any[];
    annotpageNumbers?: any[];
    annotationAddMode: string
    annotationSettings?: any;
    allowedInteractions?: AllowedInteraction
    isLocked: boolean
    isPrint: boolean
    isCommentLock: boolean
    isAnnotationRotated: boolean
    annotationRotation?: number
}

/**
 * @hidden
 */
export interface IPageAnnotationBounds {
    pageIndex: number
    bounds: IRectangle[]
    rect: any;
    startIndex?: number
    endIndex?: number
    textContent?: string
}

/**
 * The `TextMarkupAnnotation` module is used to handle text markup annotation actions of PDF viewer.
 *
 * @hidden
 * @param {Event} event - It describes about the event
 * @returns {void}
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
    public currentTextMarkupAnnotation: AnnotationsInternal = null;
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;
    private currentAnnotationIndex: number = null;
    private isAnnotationSelect: boolean = false;
    private dropDivAnnotationLeft: any;
    private dropDivAnnotationRight: any;
    private dropElementLeft: any;
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
    private selectedTextMarkup: AnnotationsInternal = null;
    private multiPageCollection: ITextMarkupAnnotation[] = [];
    private triggerAddEvent: boolean = false;
    /**
     * @private
     */
    public isSelectedAnnotation: boolean = false;
    private dropletHeight: number = 20;
    // To update the height value of strikethrough and underline annotations for Chinese language (Task ID: 861029).
    private strikeoutDifference: number = -3;
    private underlineDifference: number = 2;
    /**
     * @private
     */
    public annotationClickPosition: object = {};
    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdfViewer
     * @param {PdfViewerBase} viewerBase - It describes about the viewerBase
     * @private
     * @returns {void}
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * @private
     * @returns {void}
     */
    public createAnnotationSelectElement(): void {
        this.dropDivAnnotationLeft = createElement('div', { id: this.pdfViewer.element.id + '_droplet_left', className: 'e-pv-drop' });
        this.dropDivAnnotationLeft.style.borderRight = '2px solid';
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

    private maintainSelection = (): void => {
        this.isDropletClicked = true;
        this.pdfViewer.textSelectionModule.initiateSelectionByTouch();
        this.isExtended = true;
        this.pdfViewer.textSelectionModule.selectionRangeArray = [];
    };

    private selectionEnd = (): void => {
        if (this.isDropletClicked) {
            this.isDropletClicked = false;
        }
    };

    private annotationLeftMove = (): void => {
        if (this.isDropletClicked) {
            this.isLeftDropletClicked = true;
        }
    };

    private annotationRightMove = (): void => {
        if (this.isDropletClicked) {
            this.isRightDropletClicked = true;
        }
    };

    /**
     * @param {any} target - It describes about the target
     * @param {any} x - It describes about the X
     * @param {any} y - It describes about the Y
     * @private
     * @returns {void}
     */
    public textSelect(target: any, x: any, y: any): void {
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
     * @param {boolean} hide - It describes about the hide
     * @private
     * @returns {void}
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
     * @param {string} type - It describes about the type
     * @private
     * @returns {boolean} - boolean
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
        const annotation: AnnotationsInternal = this.currentTextMarkupAnnotation;
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

    private updateMultiAnnotBounds(annotation: any): void {
        if (!annotation.annotpageNumbers) {
            const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(annotation.pageNumber, null);
            if (annotationList) {
                for (let z: number = 0; z < annotationList.length; z++) {
                    if (annotationList[parseInt(z.toString(), 10)].annotName === annotation.annotName) {
                        annotation = annotationList[parseInt(z.toString(), 10)];
                        break;
                    }
                }
            }
        }
        let lowestNumber: number = annotation.annotpageNumbers[0];
        let highestNumber: number = annotation.annotpageNumbers[0];
        for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
            const currentPage: number = annotation.annotpageNumbers[parseInt(p.toString(), 10)];
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
                    const currentAnnot: any = annotation.annotNameCollection[parseInt(j.toString(), 10)];
                    for (let z: number = 0; z < annotationList.length; z++) {
                        if (annotationList[parseInt(z.toString(), 10)].annotName === currentAnnot) {
                            const newAnnotation: any = annotationList[parseInt(z.toString(), 10)];
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

    private retreieveSelection(annotation: any, element: any): void {
        for (let k: number = 0; k < annotation.bounds.length; k++) {
            const bound: any = annotation.bounds[parseInt(k.toString(), 10)];
            const x: number = (bound.left ? bound.left : bound.Left) * this.pdfViewerBase.getZoomFactor();
            const y: number = (bound.top ? bound.top : bound.Top) * this.pdfViewerBase.getZoomFactor();
            const width: number = (bound.width ? bound.width : bound.Width) * this.pdfViewerBase.getZoomFactor();
            const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + annotation.pageNumber);
            if (textLayer) {
                const textDivs: any = textLayer.childNodes;
                for (let n: number = 0; n < textDivs.length; n++) {
                    if (textDivs[parseInt(n.toString(), 10)]) {
                        const rangebounds: any = textDivs[parseInt(n.toString(), 10)].getBoundingClientRect();
                        const top: number = this.getClientValueTop(rangebounds.top, annotation.pageNumber);
                        const currentLeft: number = rangebounds.left - this.pdfViewerBase.getElement('_pageDiv_' + annotation.pageNumber).getBoundingClientRect().left;
                        const totalLeft: number = currentLeft + rangebounds.width;
                        const textDiVLeft: number = parseInt(textDivs[parseInt(n.toString(), 10)].style.left, 10);
                        const currentTop: number = parseInt(textDivs[parseInt(n.toString(), 10)].style.top, 10);
                        const isLeftBounds: boolean = this.pdfViewer.textSelectionModule.
                            checkLeftBounds(currentLeft, textDiVLeft, totalLeft, x);
                        const isTopBounds: boolean = this.pdfViewer.textSelectionModule.checkTopBounds(top, currentTop, y);
                        if (isLeftBounds && isTopBounds) {
                            element = textDivs[parseInt(n.toString(), 10)];
                            break;
                        }
                    }
                }
                if (element != null) {
                    const boundingRect: any = this.pdfViewerBase.getElement('_textLayer_' + annotation.pageNumber).getBoundingClientRect();
                    this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(element, x + boundingRect.left, y + boundingRect.top,
                                                                                false);
                    if ((annotation.bounds.length - 1) === k) {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(element, x + boundingRect.left + width,
                                                                                    y + boundingRect.top, false);
                    }
                }
            }
        }
    }

    /**
     * @param {number} x - It describes about the X
     * @param {number} y - It describes about the Y
     * @param {boolean} isSelected - It describes about the isSelected
     * @private
     * @returns {void}
     */
    public updatePosition(x: number, y: number, isSelected?: boolean): void {
        this.showHideDropletDiv(false);
        const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
        const topClientValue: number = this.getClientValueTop(y, this.pdfViewerBase.currentPageNumber - 1);
        const rightDivElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_droplet_right');
        if (isSelected) {
            rightDivElement.style.top = topClientValue * this.pdfViewerBase.getZoomFactor() + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        } else {
            rightDivElement.style.top = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        }
        rightDivElement.style.left = x + this.pdfViewerBase.viewerContainer.scrollLeft - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left + 'px';
    }

    /**
     * @param {number} x - It describes about the X
     * @param {number} y - It describes about the Y
     * @param {boolean} isSelected - It describes about the isSelected
     * @private
     * @returns {void}
     */
    public updateLeftposition(x: number, y: number, isSelected?: boolean): void {
        this.showHideDropletDiv(false);
        const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
        const topClientValue: number = this.getClientValueTop(y, this.pdfViewerBase.currentPageNumber - 1);
        const leftDivElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_droplet_left');
        leftDivElement.style.display = '';
        if (isSelected) {

            leftDivElement.style.top = topClientValue * this.pdfViewerBase.getZoomFactor() + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        } else {
            leftDivElement.style.top = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + 'px';
        }
        leftDivElement.style.left = x + this.pdfViewerBase.viewerContainer.scrollLeft - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (this.dropletHeight * this.pdfViewerBase.getZoomFactor()) + 'px';
    }

    private getClientValueTop(clientValue: number, pageNumber: number): number {
        if (this.pdfViewerBase.getElement('_pageDiv_' + pageNumber)) {
            return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
        } else {
            return clientValue;
        }
    }

    /**
     * @param {any} textMarkupAnnotations - It describes about the text markup annotations
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isImportTextMarkup - It describes about the isImportTextMarkup
     * @param {boolean} isAnnotOrderAction - It describes about the isAnnotOrderAction
     * @private
     * @returns {void}
     */
    public renderTextMarkupAnnotationsInPage(textMarkupAnnotations: any, pageNumber: number, isImportTextMarkup?: boolean,
                                             isAnnotOrderAction?: boolean): void {
        const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (isImportTextMarkup) {
            this.renderTextMarkupAnnotations(null, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor(), true);
        } else {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor(),
                                             null, isAnnotOrderAction);
        }
    }

    private renderTextMarkupAnnotations(textMarkupAnnotations: any, pageNumber: number, canvas: HTMLElement, factor: number,
                                        isImportAction?: boolean, isAnnotOrderAction?: boolean): void {
        if (canvas) {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.setLineDash([]);
            let annotations: any[];
            if (!isImportAction && !isAnnotOrderAction) {
                annotations = this.getAnnotations(pageNumber, textMarkupAnnotations);
            } else {
                annotations = textMarkupAnnotations;
            }
            if (textMarkupAnnotations) {
                textMarkupAnnotations.forEach(function (textMarkupAnnotation: { AnnotName: any; }): void {
                    const exists: boolean = annotations.some(function (existingAnnotation: { annotName: any; }): boolean {
                        return existingAnnotation.annotName === textMarkupAnnotation.AnnotName;
                    });
                    if (!exists) {
                        annotations.push(textMarkupAnnotation);
                    }
                });
            }
            if (annotations) {
                const distinctAnnotations: any = [];
                for (let i: number = 0; i < annotations.length; i++) {
                    let duplicateFound: boolean = false;
                    for (let j: number = 0; j < distinctAnnotations.length; j++) {
                        if (
                            annotations[parseInt(i.toString(), 10)].AnnotName ===
                             distinctAnnotations[parseInt(j.toString(), 10)].AnnotName &&
                            annotations[parseInt(i.toString(), 10)].annotName === distinctAnnotations[parseInt(j.toString(), 10)].annotName
                        ) {
                            duplicateFound = true;
                            break;
                        }
                    }
                    if (!duplicateFound) {
                        distinctAnnotations.push(annotations[parseInt(i.toString(), 10)]);
                    }
                }
                annotations = distinctAnnotations;
            }
            if (annotations) {
                for (let i: number = 0; i < annotations.length; i++) {
                    const annotation: any = annotations[parseInt(i.toString(), 10)];
                    let annotationObject: ITextMarkupAnnotation = null;
                    let isAnnotationRotated: boolean;
                    if (annotation.TextMarkupAnnotationType) {
                        if (isImportAction) {
                            if (this.pdfViewerBase.isJsonImported) {
                                const newArray: any[] = [];
                                for (let i: number = 0; i < annotation.Bounds.length; i++) {
                                    annotation.Bounds[parseInt(i.toString(), 10)] =  this.pdfViewerBase.
                                        importJsonForRotatedDocuments(annotation.Rotate, pageNumber,
                                                                      annotation.Bounds[parseInt(i.toString(), 10)],
                                                                      annotation.AnnotationRotation);
                                    annotation.Bounds[parseInt(i.toString(), 10)].left = annotation.Bounds[parseInt(i.toString(), 10)].X;
                                    annotation.Bounds[parseInt(i.toString(), 10)].top = annotation.Bounds[parseInt(i.toString(), 10)].Y;
                                    newArray.push(annotation.Bounds[parseInt(i.toString(), 10)]);
                                }
                                annotation.Bounds = newArray;
                                isAnnotationRotated = this.pdfViewerBase.isPageRotated;
                            }
                        }
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.
                            findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions :
                            this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings :
                            this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                        if (annotation.IsLocked) {
                            annotation.AnnotationSettings.isLock = annotation.IsLocked;
                        }
                        annotationObject = {
                            textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color,
                            allowedInteractions: annotation.allowedInteractions, opacity: annotation.Opacity,
                            bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject,
                            modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
                            annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, shapeAnnotationType: 'textMarkup', pageNumber: pageNumber,
                            textMarkupContent: annotation.TextMarkupContent, textMarkupStartIndex: 0, textMarkupEndIndex: 0,
                            annotationSelectorSettings: this.getSettings(annotation),
                            customData: this.pdfViewer.annotation.getCustomData(annotation), annotationAddMode:
                             annotation.annotationAddMode, annotationSettings: annotation.AnnotationSettings,
                            isLocked: annotation.IsLocked, isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock,
                            isAnnotationRotated: isAnnotationRotated, annotationRotation: annotation.AnnotationRotation
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
                        if (isNullOrUndefined(annotation.TextMarkupContent) && isNullOrUndefined(annotation.textMarkupContent)) {
                            const markedBounds: any = annotation.Bounds;
                            const storedData: any = this.pdfViewerBase.getStoredData(pageNumber, true);
                            if (isNullOrUndefined(storedData)) {
                                this.pdfViewerBase.requestForTextExtraction(pageNumber, annotationObject);
                            }
                            else {
                                const pageCharText: any = storedData.pageText.split('');
                                const characterBounds: any = this.pdfViewerBase.textLayer.
                                    characterBound[parseInt(pageNumber.toString(), 10)];
                                const textMarkupContent: string = this.pdfViewerBase.
                                    textMarkUpContent(markedBounds, pageCharText, characterBounds);
                                annotationObject.textMarkupContent = textMarkupContent;
                            }
                        }
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_textMarkup');
                        if (this.isAddAnnotationProgramatically)
                        {
                            const settings: any = {
                                opacity: annotationObject.opacity, author: annotation.author, subject: annotation.subject,
                                modifiedDate: annotation.modifiedDate,
                                width: annotationObject.bounds.width, height: annotationObject.bounds.height
                            };
                            this.pdfViewer.fireAnnotationAdd(annotationObject.pageNumber, annotationObject.annotName,
                                                             annotation.TextMarkupAnnotationType, annotationObject.bounds, settings);
                        }
                    }
                    const type: string = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType :
                        annotation.textMarkupAnnotationType;
                    const annotBounds: any = annotation.Bounds ? annotation.Bounds : annotation.bounds;
                    const opacity: number = annotation.Opacity ? annotation.Opacity : annotation.opacity;
                    const color: string = annotation.Color ? annotation.Color : annotation.color;
                    const annotationRotation: number = annotation.AnnotationRotation ? annotation.AnnotationRotation :
                        annotation.annotationRotation;
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
                        this.renderStrikeoutAnnotation(annotBounds, opacity, color, context, factor, pageNumber, isPrint,
                                                       annotationRotation, annotation.textMarkupContent);
                        break;
                    case 'Underline':
                        this.renderUnderlineAnnotation(annotBounds, opacity, color, context, factor, pageNumber, isPrint,
                                                       annotationRotation);
                        break;
                    }
                }
            }
            let isMaintainedSelector: boolean = false;
            if (this.currentTextMarkupAnnotation && this.currentTextMarkupAnnotation.annotpageNumbers) {
                for (let m: number = 0; m < this.currentTextMarkupAnnotation.annotpageNumbers.length; m++) {
                    if (pageNumber === this.currentTextMarkupAnnotation.annotpageNumbers[parseInt(m.toString(), 10)]) {
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
     * @param {any} annotation - It describes about the annotation
     * @private
     * @returns {any} - any
     */
    public getSettings(annotation: any): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel;
        if (annotation.AnnotationSelectorSettings) {
            selector = typeof(annotation.AnnotationSelectorSettings) === 'string' ? JSON.parse(annotation.AnnotationSelectorSettings) : annotation.AnnotationSelectorSettings;
        } else {
            selector = this.getSelector(annotation.TextMarkupAnnotationType);
        }
        return selector;
    }

    /**
     * @param {string} type - It describes about the type
     * @private
     * @returns {void}
     */
    public drawTextMarkupAnnotations(type: string): void {
        let isDrawn: boolean = false;
        this.isTextMarkupAnnotationMode = true;
        this.pdfViewer.annotationModule.isFormFieldShape = false;
        this.currentTextMarkupAddMode = type;
        let isCleared: boolean = true;
        this.multiPageCollection = [];
        const selectionObject: ISelection[] = this.pdfViewer.textSelectionModule ?
            this.pdfViewer.textSelectionModule.selectionRangeArray : [];
        if (selectionObject.length > 0 && !this.isSelectionMaintained) {
            isDrawn = true;
            this.convertSelectionToTextMarkup(type, selectionObject, this.pdfViewerBase.getZoomFactor());
        }
        const selection: Selection = window.getSelection();
        let targetElement: any;
        if (selection && selection.anchorNode) {
            targetElement = selection.anchorNode.parentElement;
        }
        if (this.isEnableTextMarkupResizer(type) && this.isExtended && window.getSelection().toString()) {
            const pageBounds: IPageAnnotationBounds[] = this.getDrawnBounds();
            if (pageBounds[0] && pageBounds[0].bounds) {
                const currentAnnot: any = this.currentTextMarkupAnnotation;
                for (let k: number = 0; k < pageBounds.length; k++) {
                    if (currentAnnot && currentAnnot.pageNumber === pageBounds[parseInt(k.toString(), 10)].pageIndex) {
                        this.currentTextMarkupAnnotation = currentAnnot;
                        this.selectTextMarkupCurrentPage = pageBounds[parseInt(k.toString(), 10)].pageIndex;
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
                            this.drawTextMarkups(type, pageBounds[parseInt(k.toString(), 10)].bounds,
                                                 pageBounds[parseInt(k.toString(), 10)].pageIndex,
                                                 pageBounds[parseInt(k.toString(), 10)].rect,
                                                 this.pdfViewerBase.getZoomFactor(), pageBounds[parseInt(k.toString(), 10)].textContent,
                                                 pageBounds[parseInt(k.toString(), 10)].startIndex,
                                                 pageBounds[parseInt(k.toString(), 10)].endIndex,
                                                 isMultiSelect, targetElement);
                        } else {
                            if (currentAnnot.isMultiSelect && currentAnnot.annotNameCollection) {
                                this.modifyCurrentAnnotation(currentAnnot, pageBounds, k);
                            }
                        }
                    }
                }
            }
        } else if (window.getSelection().toString()  && !isDrawn) {
            const pageBounds: IPageAnnotationBounds[] = this.getDrawnBounds();
            const isMultiSelect: boolean = this.isMultiPageAnnotations(pageBounds, type);
            if (pageBounds.length > 0) {
                for (let i: number = 0; i < pageBounds.length; i++) {
                    if (type === '') {
                        isCleared = false;
                    }
                    this.drawTextMarkups(type, pageBounds[parseInt(i.toString(), 10)].bounds,
                                         pageBounds[parseInt(i.toString(), 10)].pageIndex, pageBounds[parseInt(i.toString(), 10)].rect,
                                         this.pdfViewerBase.getZoomFactor(), pageBounds[parseInt(i.toString(), 10)].textContent,
                                         pageBounds[parseInt(i.toString(), 10)].startIndex, pageBounds[parseInt(i.toString(), 10)].endIndex,
                                         isMultiSelect, targetElement);
                }
            }
        }
        if (this.multiPageCollection) {
            for (let j: number = 0; j < this.multiPageCollection.length; j++) {
                this.updateAnnotationNames(this.multiPageCollection[parseInt(j.toString(), 10)],
                                           this.multiPageCollection[parseInt(j.toString(), 10)].pageNumber);
            }
        }
        this.isExtended = false;
        this.isSelectionMaintained = false;
        // this.pdfViewerBase.annotationHelper.redoCollection = [];
        if (isCleared && this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.isEnableTextMarkupResizer(type)) {
            this.updateAnnotationBounds();
        }
    }

    private isMultiPageAnnotations(pageBounds: any, type: string): boolean {
        let isMultiSelect: boolean = false;
        for (let n: number = 0; n < pageBounds.length; n++) {
            if (pageBounds[parseInt(n.toString(), 10)].pageIndex !== pageBounds[0].pageIndex && this.isMultiAnnotation(type)) {
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

    private modifyCurrentAnnotation(currentAnnot: any, pageBounds: any, index: number): void {
        for (let c: number = 0; c < currentAnnot.annotNameCollection.length; c++) {
            const currentAnnots: any = currentAnnot.annotNameCollection[parseInt(c.toString(), 10)];
            const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(pageBounds[parseInt(index.toString(), 10)].pageIndex, null);
            if (annotationList) {
                for (let z: number = 0; z < annotationList.length; z++) {
                    if (annotationList[parseInt(z.toString(), 10)].annotName === currentAnnots) {
                        this.currentTextMarkupAnnotation = annotationList[parseInt(z.toString(), 10)];
                        this.selectTextMarkupCurrentPage = pageBounds[parseInt(index.toString(), 10)].pageIndex;
                        this.updateTextMarkupAnnotationBounds(pageBounds, index);
                        break;
                    }
                }
            }
        }
    }

    private drawAnnotationSelector(newAnnotation: any, annotation: any, newcanvas?: any): void {
        let newBounds: any = [];
        let x: number = 0;
        let y: number = 0;
        let width: number = 0;
        let height: number = 0;
        let currentTop: number = 0;
        let nextTop: number = 0;
        let currentLeft: number = 0;
        let nextLeft: number = 0;
        let currentRotation: number = 0;
        let nextRotation: number = 0;
        for (let i: number = 0; i < newAnnotation.bounds.length; i++) {
            currentTop = newAnnotation.bounds[parseInt(i.toString(), 10)].top ?
                newAnnotation.bounds[parseInt(i.toString(), 10)].top : newAnnotation.bounds[parseInt(i.toString(), 10)].Top;
            nextTop = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].top ?
                newAnnotation.bounds[i + 1].top : newAnnotation.bounds[i + 1].Top : 0;
            let rotation180Exists: boolean;
            if (this.pdfViewerBase.clientSideRendering) {
                currentLeft = newAnnotation.bounds[parseInt(i.toString(), 10)].left ?
                    newAnnotation.bounds[parseInt(i.toString(), 10)].left : newAnnotation.bounds[parseInt(i.toString(), 10)].Left;
                nextLeft = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].left ?
                    newAnnotation.bounds[i + 1].left : newAnnotation.bounds[i + 1].Left : 0;
                currentRotation = newAnnotation.bounds[parseInt(i.toString(), 10)].rotation;
                nextRotation = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].rotation : 0;
                rotation180Exists = (currentRotation === 0) || (currentRotation === 180);
            }
            if (newAnnotation.bounds.length > 1 && i < newAnnotation.bounds.length - 1 && currentTop === nextTop) {
                newBounds.push(newAnnotation.bounds[parseInt(i.toString(), 10)]);
            } else {
                if (i === newAnnotation.bounds.length - 1 || newAnnotation.bounds.length >= 1) {
                    newBounds.push(newAnnotation.bounds[parseInt(i.toString(), 10)]);
                }
                if (newBounds.length >= 1) {
                    if (this.pdfViewerBase.clientSideRendering) {
                        const boundsLength: number = newBounds.length - 1;
                        x = newBounds.reduce((min: number, rect: any) => (rect.left ? rect.left : rect.Left || 0) < min ?
                            (rect.left ? rect.left : rect.Left || 0) : min, Infinity);
                        y = newBounds.reduce((min: number, rect: any) => (rect.top ? rect.top : rect.Top || 0) < min ?
                            (rect.top ? rect.top : rect.Top || 0) : min, Infinity);
                        if (rotation180Exists) {
                            height = newBounds[0].height ? newBounds[0].height : newBounds[0].Height;
                            width = newBounds.reduce((sum: number, rect: any) => sum + (rect.width ? rect.width : rect.Width || 0), 0);
                        } else {
                            width += newBounds[0].width ? newBounds[0].width : newBounds[0].Width;
                            height = newBounds.reduce((sum: number, rect: any) => sum + (rect.height ? rect.height : rect.Height || 0), 0);
                        }
                    } else {
                        x = newBounds[0].left ? newBounds[0].left : newBounds[0].Left;
                        y = newBounds[0].top ? newBounds[0].top : newBounds[0].Top;
                        height = newBounds[0].height ? newBounds[0].height : newBounds[0].Height;
                        for (let j: number = 0; j < newBounds.length; j++) {
                            if ((!isNaN(newBounds[parseInt(j.toString(), 10)].width) &&
                             newBounds[parseInt(j.toString(), 10)].width > 0) || (!isNaN(newBounds[parseInt(j.toString(), 10)].Width) &&
                              newBounds[parseInt(j.toString(), 10)].Width > 0)) {
                                width += newBounds[parseInt(j.toString(), 10)].width ?
                                    newBounds[parseInt(j.toString(), 10)].width : newBounds[parseInt(j.toString(), 10)].Width;
                            }
                        }
                        if (!newcanvas) {
                            newcanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + newAnnotation.pageNumber);
                        }
                        this.drawAnnotationSelectRect(newcanvas, this.getMagnifiedValue(x - 0.5, this.pdfViewerBase.getZoomFactor()),
                                                      this.getMagnifiedValue(y - 0.5, this.pdfViewerBase.getZoomFactor()),
                                                      this.getMagnifiedValue(width + 0.5, this.pdfViewerBase.getZoomFactor()),
                                                      this.getMagnifiedValue(height + 0.5, this.pdfViewerBase.getZoomFactor()), annotation);
                        newBounds = [];
                        width = 0;
                    }
                }
                if (this.pdfViewerBase.clientSideRendering) {
                    if (!newcanvas) {
                        newcanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + newAnnotation.pageNumber);
                    }
                    this.drawAnnotationSelectRect(newcanvas, this.getMagnifiedValue(x - 0.5, this.pdfViewerBase.getZoomFactor()),
                                                  this.getMagnifiedValue(y - 0.5, this.pdfViewerBase.getZoomFactor()),
                                                  this.getMagnifiedValue(width + 0.5, this.pdfViewerBase.getZoomFactor()),
                                                  this.getMagnifiedValue(height + 0.5, this.pdfViewerBase.getZoomFactor()), annotation);
                    newBounds = [];
                    width = 0;
                    height = 0;
                }
            }
        }
    }

    private selectMultiPageAnnotations(annotation: any): void {
        for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
            const currentAnnot: any = annotation.annotNameCollection[parseInt(k.toString(), 10)];
            if (currentAnnot !== annotation.annotName) {
                for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                    const currentPage: number = annotation.annotpageNumbers[parseInt(p.toString(), 10)];
                    const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                    if (annotationList) {
                        for (let z: number = 0; z < annotationList.length; z++) {
                            if (annotationList[parseInt(z.toString(), 10)].annotName === currentAnnot) {
                                const newAnnotation: any = annotationList[parseInt(z.toString(), 10)];
                                this.drawAnnotationSelector(newAnnotation, annotation);
                            }
                        }
                    }
                }
            }
        }
    }

    private deletMultiPageAnnotation(annotation: any): any {
        for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
            const currentAnnot: any = annotation.annotNameCollection[parseInt(k.toString(), 10)];
            if (currentAnnot !== annotation.annotName) {
                for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                    const currentPage: number = annotation.annotpageNumbers[parseInt(p.toString(), 10)];
                    const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                    if (annotationList) {
                        for (let z: number = 0; z < annotationList.length; z++) {
                            if (annotationList[parseInt(z.toString(), 10)].annotName === currentAnnot) {
                                const newAnnotation: any = annotationList[parseInt(z.toString(), 10)];
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
                                this.pdfViewer.annotationModule.updateImportAnnotationCollection(newAnnotation, newAnnotation.pageNumber, 'textMarkupAnnotation');
                                this.pdfViewer.annotationModule.renderAnnotations(currentPage, null, null, null);
                            }
                        }
                    }
                }
            }
        }
    }

    private modifyMultiPageAnnotations(annotation: any, property: string, value: any): void {
        for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
            const currentAnnot: any = annotation.annotNameCollection[parseInt(k.toString(), 10)];
            if (currentAnnot !== annotation.annotName) {
                for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                    const currentPage: number = annotation.annotpageNumbers[parseInt(p.toString(), 10)];
                    const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                    if (annotationList) {
                        for (let z: number = 0; z < annotationList.length; z++) {
                            if (annotationList[parseInt(z.toString(), 10)].annotName === currentAnnot) {
                                if (property === 'Color') {
                                    annotationList[parseInt(z.toString(), 10)].color = value;
                                } else {
                                    annotationList[parseInt(z.toString(), 10)].opacity = value;
                                }
                                annotationList[parseInt(z.toString(), 10)].modifiedDate =
                                 this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                                this.currentAnnotationIndex = z;
                                if (status === null || status === 'changed') {
                                    this.pdfViewer.annotationModule.addAction(annotationList[parseInt(z.toString(), 10)].pageNumber, z, annotationList[parseInt(z.toString(), 10)], 'Text Markup Property modified', property);
                                }
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                                    updateAnnotationModifiedDate(annotationList[parseInt(z.toString(), 10)]);
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
            const textValue: string = selectionObject[parseInt(i.toString(), 10)].textContent;
            let indexes: any;
            if (selectionObject[parseInt(i.toString(), 10)].startNode === selectionObject[parseInt(i.toString(), 10)].endNode) {
                const parentText: string = document.getElementById(selectionObject[parseInt(i.toString(), 10)].startNode).textContent;
                indexes = this.getIndexNumbers(selectionObject[parseInt(i.toString(), 10)].pageNumber, textValue, parentText);
            } else {
                indexes = this.getIndexNumbers(selectionObject[parseInt(i.toString(), 10)].pageNumber, textValue);
            }
            if (!isMultiSelect) {
                for (let n: number = 1; n < selectionObject.length; n++) {
                    if (selectionObject[parseInt(n.toString(), 10)].pageNumber !== selectionObject[0].pageNumber &&
                     this.isMultiAnnotation(type)) {
                        isMultiSelect = true;
                        break;
                    }
                }
            }
            if (this.isMultiAnnotation(type) && (selectionObject.length - 1) === i) {
                this.triggerAddEvent = true;
            }
            this.drawTextMarkups(type, selectionObject[parseInt(i.toString(), 10)].rectangleBounds,
                                 selectionObject[parseInt(i.toString(), 10)].pageNumber, selectionObject[parseInt(i.toString(), 10)].bound,
                                 factor, textValue, indexes.startIndex, indexes.endIndex, isMultiSelect,
                                 document.getElementById(selectionObject[parseInt(i.toString(), 10)].startNode));
        }
    }

    private updateTextMarkupAnnotationBounds(pageBounds: IPageAnnotationBounds[], currentIndex: number): void {
        if (this.currentTextMarkupAnnotation) {
            const pageAnnotations: ITextMarkupAnnotation[] =
             this.getAnnotations(pageBounds[parseInt(currentIndex.toString(), 10)].pageIndex, null);
            let annotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[parseInt(i.toString(), 10)])) {
                        pageAnnotations[parseInt(i.toString(), 10)].bounds = pageBounds[parseInt(currentIndex.toString(), 10)].bounds;
                        pageAnnotations[parseInt(i.toString(), 10)].textMarkupContent =
                         pageBounds[parseInt(currentIndex.toString(), 10)].textContent;
                        pageAnnotations[parseInt(i.toString(), 10)].textMarkupStartIndex =
                         pageBounds[parseInt(currentIndex.toString(), 10)].startIndex;
                        pageAnnotations[parseInt(i.toString(), 10)].textMarkupEndIndex =
                         pageBounds[parseInt(currentIndex.toString(), 10)].endIndex;
                        pageAnnotations[parseInt(i.toString(), 10)].modifiedDate =
                         this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                        annotation = pageAnnotations[parseInt(i.toString(), 10)];
                    }
                }
                this.manageAnnotations(pageAnnotations, pageBounds[parseInt(currentIndex.toString(), 10)].pageIndex);
                this.currentTextMarkupAnnotation = null;
                this.pdfViewer.annotationModule.renderAnnotations(pageBounds[parseInt(currentIndex.toString(), 10)].pageIndex,
                                                                  null, null, null);
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                if (annotation) {
                    const settings: any = { opacity: annotation.opacity, color: annotation.color, author: annotation.author,
                        subject: annotation.subject, modifiedDate: annotation.modifiedDate };
                    const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
                    if (multiPageCollection.length > 0) {
                        if ((pageBounds.length - 1) === currentIndex) {
                            this.pdfViewer.fireAnnotationResize(pageBounds[parseInt(currentIndex.toString(), 10)].pageIndex,
                                                                annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType,
                                                                annotation.bounds, settings, annotation.textMarkupContent,
                                                                annotation.textMarkupStartIndex, annotation.textMarkupEndIndex,
                                                                null, multiPageCollection);
                        }
                    } else {
                        this.pdfViewer.fireAnnotationResize(pageBounds[parseInt(currentIndex.toString(), 10)].pageIndex,
                                                            annotation.annotName, annotation.textMarkupAnnotationType as AnnotationType,
                                                            annotation.bounds, settings, annotation.textMarkupContent,
                                                            annotation.textMarkupStartIndex, annotation.textMarkupEndIndex, null);
                    }
                }
                this.currentAnnotationIndex = null;
                this.selectTextMarkupCurrentPage = null;
            }
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @private
     * @returns {any} - any
     */
    public multiPageCollectionList(annotation: any): ITextMarkupAnnotation[] {
        const multiPageCollectionList: ITextMarkupAnnotation[] = [];
        if (annotation.isMultiSelect && annotation.annotNameCollection) {
            multiPageCollectionList.push(annotation);
            for (let k: number = 0; k < annotation.annotNameCollection.length; k++) {
                const currentAnnot: any = annotation.annotNameCollection[parseInt(k.toString(), 10)];
                if (currentAnnot !== annotation.annotName) {
                    for (let p: number = 0; p < annotation.annotpageNumbers.length; p++) {
                        const currentPage: number = annotation.annotpageNumbers[parseInt(p.toString(), 10)];
                        const annotationList: ITextMarkupAnnotation[] = this.getAnnotations(currentPage, null);
                        if (annotationList) {
                            for (let z: number = 0; z < annotationList.length; z++) {
                                if (annotationList[parseInt(z.toString(), 10)].annotName === currentAnnot) {
                                    multiPageCollectionList.push(annotationList[parseInt(z.toString(), 10)]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return multiPageCollectionList;
    }

    private updateAnnotationNames(annotations: any, pageNumber: number): void {
        if (annotations) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
            let annotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (annotations.annotName === pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                        const annotNamesCollections: any[] = [];
                        const annotpageNumbers: any[] = [];
                        for (let p: number = 0; p < this.multiPageCollection.length; p++) {
                            annotNamesCollections.push(this.multiPageCollection[parseInt(p.toString(), 10)].annotName);
                            annotpageNumbers.push(this.multiPageCollection[parseInt(p.toString(), 10)].pageNumber);
                        }
                        pageAnnotations[parseInt(i.toString(), 10)].isMultiSelect = true;
                        pageAnnotations[parseInt(i.toString(), 10)].annotNameCollection = annotNamesCollections;
                        pageAnnotations[parseInt(i.toString(), 10)].annotpageNumbers = annotpageNumbers;
                        annotation = pageAnnotations[parseInt(i.toString(), 10)];
                    }
                }
                this.manageAnnotations(pageAnnotations, pageNumber);
            }
        }
    }

    private updateAnnotationContent(annotation: any, pageBound: any): void {
        if (annotation) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
            let annotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[parseInt(i.toString(), 10)])) {
                        pageAnnotations[parseInt(i.toString(), 10)].textMarkupContent = pageBound.textContent;
                        pageAnnotations[parseInt(i.toString(), 10)].textMarkupStartIndex = pageBound.startIndex;
                        pageAnnotations[parseInt(i.toString(), 10)].textMarkupEndIndex = pageBound.endIndex;
                        annotation = pageAnnotations[parseInt(i.toString(), 10)];
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)],
                                                                               this.selectTextMarkupCurrentPage);
                }
                this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            }
        }
    }

    private drawTextMarkups(type: string, bounds: IRectangle[], pageNumber: number, rect: any, factor: number,
                            textContent: string, startIndex: number, endIndex: number, isMultiSelect?: boolean, targetElement?: any): void {
        let annotation: ITextMarkupAnnotation = null;
        this.isNewAnnotation = false;
        let author: string = 'Guest';
        let subject: string;
        const context: CanvasRenderingContext2D = this.getPageContext(pageNumber);
        const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        this.highlightColor = this.highlightColor ? this.highlightColor : this.pdfViewer.highlightSettings.color ? this.pdfViewer.highlightSettings.color : '#FFDF56';
        this.underlineColor = this.underlineColor ? this.underlineColor : this.pdfViewer.underlineSettings.color ? this.pdfViewer.underlineSettings.color : '#00ff00';
        this.strikethroughColor = this.strikethroughColor ? this.strikethroughColor : this.pdfViewer.strikethroughSettings.color ? this.pdfViewer.strikethroughSettings.color : '#ff0000';
        this.highlightOpacity = this.pdfViewer.highlightSettings.opacity;
        this.underlineOpacity = this.pdfViewer.underlineSettings.opacity;
        this.strikethroughOpacity = this.pdfViewer.strikethroughSettings.opacity;
        this.annotationAddMode = 'UI Drawn Annotation';
        let allowedInteractions: any[];
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)];
        let annotationRotate: number = 0;
        const pageRotation: number = this.pdfViewerBase.getAngle(pageDetails.rotation);
        if (context) {
            context.setLineDash([]);
            switch (type) {
            case 'Highlight':
                this.isNewAnnotation = true;
                subject = (this.pdfViewer.highlightSettings.subject !== '' && this.pdfViewer.highlightSettings.subject) ? this.pdfViewer.highlightSettings.subject : this.pdfViewer.annotationSettings.subject ? this.pdfViewer.annotationSettings.subject : 'Highlight';
                author = (this.pdfViewer.highlightSettings.author !== 'Guest' && this.pdfViewer.highlightSettings.author) ? this.pdfViewer.highlightSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                allowedInteractions = this.pdfViewer.highlightSettings.allowedInteractions ? this.pdfViewer.highlightSettings.allowedInteractions : ['None'];
                if (isNullOrUndefined(this.highlightOpacity)) {
                    this.highlightOpacity = 1;
                }
                annotation = this.getAddedAnnotation(type, this.highlightColor, this.highlightOpacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions, annotationRotate);
                if (annotation) {
                    this.renderHighlightAnnotation(annotation.bounds, annotation.opacity, annotation.color, context,
                                                   factor, annotation.isPrint, pageNumber);
                }
                break;
            case 'Strikethrough':
                this.isNewAnnotation = true;
                subject = (this.pdfViewer.strikethroughSettings.subject !== '' &&  this.pdfViewer.strikethroughSettings.subject) ? this.pdfViewer.strikethroughSettings.subject : this.pdfViewer.annotationSettings.subject ? this.pdfViewer.annotationSettings.subject : 'Strikethrough';
                author = (this.pdfViewer.strikethroughSettings.author !== 'Guest' &&  this.pdfViewer.strikethroughSettings.author) ? this.pdfViewer.strikethroughSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                allowedInteractions = this.pdfViewer.strikethroughSettings.allowedInteractions ? this.pdfViewer.strikethroughSettings.allowedInteractions : ['None'];
                if (targetElement && targetElement.style.transform !== '') {
                    if (targetElement.style.transform.startsWith('rotate(90deg)')) {
                        annotationRotate = Math.abs(pageRotation - 90);
                    }
                    else if (targetElement.style.transform.startsWith('rotate(180deg)')) {
                        annotationRotate = Math.abs(pageRotation - 180);
                    }
                    else if (targetElement.style.transform.startsWith('rotate(-90deg)')) {
                        annotationRotate = Math.abs(pageRotation - 270);
                    }
                    else {
                        annotationRotate = pageRotation;
                    }
                }
                if (isNullOrUndefined(this.strikethroughOpacity)) {
                    this.strikethroughOpacity = 1;
                }
                annotation = this.getAddedAnnotation(type, this.strikethroughColor, this.strikethroughOpacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions, annotationRotate);
                if (annotation) {
                    this.renderStrikeoutAnnotation(annotation.bounds, annotation.opacity, annotation.color, context,
                                                   factor, pageNumber, annotation.isPrint, annotation.annotationRotation,
                                                   annotation.textMarkupContent);
                }
                break;
            case 'Underline':
                this.isNewAnnotation = true;
                subject = (this.pdfViewer.underlineSettings.subject !== '' && this.pdfViewer.underlineSettings.subject) ? this.pdfViewer.underlineSettings.subject : this.pdfViewer.annotationSettings.subject ? this.pdfViewer.annotationSettings.subject : 'Underline';
                author = (this.pdfViewer.underlineSettings.author !== 'Guest' && this.pdfViewer.underlineSettings.author) ? this.pdfViewer.underlineSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
                allowedInteractions = this.pdfViewer.underlineSettings.allowedInteractions ? this.pdfViewer.underlineSettings.allowedInteractions : ['None'];
                if (targetElement && targetElement.style.transform !== '') {
                    if (targetElement.style.transform.startsWith('rotate(90deg)')) {
                        annotationRotate = Math.abs(pageRotation - 90);
                    }
                    else if (targetElement.style.transform.startsWith('rotate(180deg)')) {
                        annotationRotate = Math.abs(pageRotation - 180);
                    }
                    else if (targetElement.style.transform.startsWith('rotate(-90deg)')) {
                        annotationRotate = Math.abs(pageRotation - 270);
                    }
                    else {
                        annotationRotate = pageRotation;
                    }
                }
                if (isNullOrUndefined(this.underlineOpacity)) {
                    this.underlineOpacity = 1;
                }
                annotation = this.getAddedAnnotation(type, this.underlineColor, this.underlineOpacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions, annotationRotate);
                if (annotation) {
                    this.renderUnderlineAnnotation(annotation.bounds, annotation.opacity, annotation.color, context,
                                                   factor, pageNumber, annotation.isPrint, annotation.annotationRotation);
                }
                break;
            }
            this.isNewAnnotation = false;
            if (annotation) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                const settings: any = { opacity: annotation.opacity, color: annotation.color, author: annotation.author,
                    subject: annotation.subject, modifiedDate: annotation.modifiedDate };
                if (this.isMultiAnnotation(type)) {
                    if (this.triggerAddEvent) {
                        this.pdfViewer.fireAnnotationAdd(pageNumber, annotation.annotName, (type as AnnotationType),
                                                         annotation.bounds, settings, textContent, startIndex, endIndex,
                                                         null, this.multiPageCollection);
                    }
                } else {
                    this.pdfViewer.fireAnnotationAdd(pageNumber, annotation.annotName, (type as AnnotationType),
                                                     annotation.bounds, settings, textContent, startIndex, endIndex);
                }
            }
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && this.pdfViewer.enableToolbar &&
                 this.pdfViewer.enableAnnotationToolbar) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.createPropertyTools(type);
            }
        }
    }

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

    private renderHighlightAnnotation(bounds: any[], opacity: number, color: string, context: any, factor: number,
                                      isPrint: boolean, pageIndex: number): void {
        const zoomRatio: number = this.pdfViewerBase.getZoomRatio(factor);
        for (let i: number = 0; i < bounds.length; i++) {
            const bound: any = bounds[parseInt(i.toString(), 10)];
            context.beginPath();
            let x: number = bound.X ? bound.X : bound.left;
            let y: number = bound.Y ? bound.Y : bound.top;
            let width: number = bound.Width ? bound.Width : bound.width;
            let height: number = bound.Height ? bound.Height : bound.height;
            let rotation: number = bound.Rotation ? bound.Rotation : bound.rotation;
            x = x ? x : bound.x;
            y = y ? y : bound.y;
            // The highlighted position is slightly increased. So Subtract -1 from the height.
            if (this.pdfViewerBase.clientSideRendering) {
                if (rotation >= 0) {
                    rotation = Math.abs(rotation) / 90;
                }
                if (rotation === 0 || rotation === 2) {
                    height = height - 1;
                } else if (rotation === 1 || rotation === 3) {
                    width = width - 1;
                }
            } else {
                height = height - 1;
            }
            if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex) {
                if (isPrint) {
                    context.rect((x * zoomRatio), (y * zoomRatio), (width * zoomRatio), (height * zoomRatio));
                    context.globalAlpha = opacity * 0.5;
                    context.closePath();
                    context.fillStyle = color;
                    context.msFillRule = 'nonzero';
                    context.fill();
                }
            } else {
                context.rect((x * zoomRatio), (y * zoomRatio), (width * zoomRatio), (height * zoomRatio));
                context.globalAlpha = opacity * 0.5;
                context.closePath();
                context.fillStyle = color;
                context.msFillRule = 'nonzero';
                context.fill();
            }
        }
        context.save();
    }

    private renderStrikeoutAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D,
                                      factor: number, pageNumber: number, isPrint: boolean, annotationRotation: number,
                                      textContent: any): void {
        for (let i: number = 0; i < bounds.length; i++) {
            const bound: any = this.getProperBounds(bounds[parseInt(i.toString(), 10)]);
            const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)];
            const factorRatio : number = this.pdfViewerBase.getZoomRatio(factor);
            let rotation: number = pageDetails.rotation;
            if (annotationRotation || (this.pdfViewerBase.clientSideRendering && bounds[parseInt(i.toString(), 10)].rotation)) {
                const pageRotation: number = this.pdfViewerBase.getAngle(rotation);
                rotation = this.pdfViewerBase.clientSideRendering ? Math.abs(bounds[parseInt(i.toString(), 10)].rotation) / 90 :
                    Math.abs(annotationRotation - pageRotation) / 90;
            }
            if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageNumber) {
                if (isPrint) {
                    if (rotation === 1) {
                        this.drawLine(opacity, (bound.x + (bound.width / 2)), bound.y, bound.width, bound.height, color,
                                      factorRatio, context, pageNumber, this.pdfViewerBase.clientSideRendering ?
                                          bounds[parseInt(i.toString(), 10)].rotation : annotationRotation, textContent);
                    } else if (rotation === 2) {
                        this.drawLine(opacity, bound.x, (bound.y + (bound.height / 2)), bound.width, bound.height, color,
                                      factorRatio, context, pageNumber, this.pdfViewerBase.clientSideRendering ?
                                          bounds[parseInt(i.toString(), 10)].rotation : annotationRotation, textContent);
                    } else if (rotation === 3) {
                        this.drawLine(opacity, bound.x, bound.y, (bound.width / 2), bound.height, color, factorRatio, context,
                                      pageNumber, this.pdfViewerBase.clientSideRendering ? bounds[parseInt(i.toString(), 10)].rotation :
                                          annotationRotation, textContent);
                    } else {
                        this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factorRatio, context,
                                      pageNumber, this.pdfViewerBase.clientSideRendering ? bounds[parseInt(i.toString(), 10)].rotation :
                                          annotationRotation, textContent);
                    }
                }
            } else {
                if (rotation === 1) {
                    this.drawLine(opacity, (bound.x + (bound.width / 2)), bound.y, bound.width, bound.height, color, factorRatio,
                                  context, pageNumber, this.pdfViewerBase.clientSideRendering ?
                                      bounds[parseInt(i.toString(), 10)].rotation :
                                      annotationRotation, textContent);
                } else if (rotation === 2) {
                    this.drawLine(opacity, bound.x, (bound.y + (bound.height / 2)), bound.width, bound.height, color, factorRatio,
                                  context, pageNumber, this.pdfViewerBase.clientSideRendering ?
                                      bounds[parseInt(i.toString(), 10)].rotation :
                                      annotationRotation, textContent);
                } else if (rotation === 3) {
                    this.drawLine(opacity, bound.x, bound.y, (bound.width / 2), bound.height, color, factorRatio, context,
                                  pageNumber, this.pdfViewerBase.clientSideRendering ? bounds[parseInt(i.toString(), 10)].rotation :
                                      annotationRotation, textContent);
                } else {
                    this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factorRatio, context,
                                  pageNumber, this.pdfViewerBase.clientSideRendering ? bounds[parseInt(i.toString(), 10)].rotation :
                                      annotationRotation, textContent);
                }
            }
        }
    }

    private renderUnderlineAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D,
                                      factor: number, pageNumber: number, isPrint: boolean, annotationRotation: number): void {
        for (let i: number = 0; i < bounds.length; i++) {
            const boundValues: any = this.getProperBounds(bounds[parseInt(i.toString(), 10)]);
            const factorRatio : number = this.pdfViewerBase.getZoomRatio(factor);
            if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageNumber) {
                if (isPrint) {
                    this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factorRatio,
                                  context, pageNumber, this.pdfViewerBase.clientSideRendering ? bounds[parseInt(i.toString(), 10)].rotation
                                      : annotationRotation);
                }
            } else {
                this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factorRatio,
                              context, pageNumber, this.pdfViewerBase.clientSideRendering ? bounds[parseInt(i.toString(), 10)].rotation :
                                  annotationRotation);
            }
        }
    }

    private getProperBounds(bound: any): any {
        let x: number = bound.X ? bound.X : bound.left;
        let y: number = bound.Y ? bound.Y : bound.top;
        const width: number = bound.Width ? bound.Width : bound.width;
        const height: number = bound.Height ? bound.Height : bound.height;
        x = x ? x : bound.x;
        y = y ? y : bound.y;
        return { x: x, y: y, width: width, height: height };
    }

    private isChineseLanguage(textContent: any): boolean {
        const chineseRegex: any = /[\u4e00-\u9fff]/;
        // Check if the text contains Chinese characters
        const isChinese: boolean = chineseRegex.test(textContent);
        if (isChinese) {
            return true;
        }
        else {
            return false;
        }
    }

    private drawLine(opacity: number, x: number, y: number, width: number, height: number, color: string, factor: number,
                     context: any, pageNumber: number, annotationRotation?: number, textContent?: any): void {
        context.globalAlpha = opacity;
        if (isBlazor()) {
            y = y - 1;
        }
        if (this.isChineseLanguage(textContent)) {
            height = height - 1.5;
        }
        if (!this.pdfViewerBase.clientSideRendering && !this.isChineseLanguage(textContent)) {
            height = height - 1;
        }
        context.beginPath();
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)];
        let rotation: number = pageDetails.rotation;
        if (annotationRotation || (this.pdfViewerBase.clientSideRendering && annotationRotation >= 0)) {
            const pageRotation: number = this.pdfViewerBase.getAngle(rotation);
            rotation = this.pdfViewerBase.clientSideRendering ? Math.abs(annotationRotation) / 90 :
                Math.abs(annotationRotation - pageRotation) / 90;
        }
        if (this.pdfViewerBase.clientSideRendering) {
            if (rotation === 0 || rotation === 2) {
                height = height - 1;
            } else if (rotation === 1 || rotation === 3) {
                width = width - 1;
            }
        }
        if (rotation === 1) {
            context.moveTo(( x * factor), (y * factor));
            context.lineTo((x * factor), (y + height) * factor);
        } else if (rotation === 2) {
            context.moveTo(( x * factor), (y * factor));
            context.lineTo((width + x) * factor, (y * factor));
        } else if (rotation === 3) {
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
     * @param {any} textMarkupAnnotations - It describes about the text markup annotations
     * @param {number} pageIndex - It describes about the page number
     * @param {any} stampData - It describes about the stamp data
     * @param {any} shapeData - It describes about the shape data
     * @param {any} measureShapeData - It describes about the measure shape data
     * @param {any} stickyData - It describes about the sticky data
     * @param {any} freeTextData - It describes about the free text data
     * @private
     * @returns {string} - string
     */
    public printTextMarkupAnnotations(textMarkupAnnotations: any, pageIndex: number, stampData: any, shapeData: any,
                                      measureShapeData: any, stickyData: any, freeTextData: any): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            const canvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex }) as HTMLCanvasElement;
            canvas.style.width = 816 + 'px';
            canvas.style.height = 1056 + 'px';
            const pageWidth: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width;
            const pageHeight: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height;
            const zoom : number = this.pdfViewerBase.getZoomFactor();
            const zoomRatio : number = this.pdfViewerBase.getZoomRatio(zoom);
            canvas.height = pageHeight * zoomRatio;
            canvas.width = pageWidth * zoomRatio;
            const textMarkupannotations: any = this.getAnnotations(pageIndex, null, '_annotations_textMarkup');
            const shapeAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_shape');
            const measureShapeAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_shape_measure');
            const stampAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_stamp');
            const stickyNoteAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_sticky');
            if (stampAnnotation || shapeAnnotation || stickyNoteAnnotation || measureShapeAnnotation) {
                this.pdfViewer.renderDrawing(canvas, pageIndex);
            } else {
                this.pdfViewer.annotation.renderAnnotations(pageIndex, shapeData, measureShapeData, null, canvas, null, null, freeTextData);
                this.pdfViewer.annotation.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex, canvas);
                this.pdfViewer.annotation.stickyNotesAnnotationModule.renderStickyNotesAnnotations(stickyData, pageIndex, canvas);
            }
            const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            if (textMarkupannotations) {
                this.renderTextMarkupAnnotations(null, pageIndex, canvas, zoomFactor);
            } else {
                this.renderTextMarkupAnnotations(textMarkupAnnotations, pageIndex, canvas, zoomFactor);
            }
            setTimeout(() => {
                const imageSource: string = (canvas as HTMLCanvasElement).toDataURL();
                resolve(imageSource);
            }, 100);
        });
    }

    /**
     * @private
     * @returns {string} - string
     */
    public saveTextMarkupAnnotations(): string {
        let storeTextMarkupObject: string = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (this.pdfViewerBase.isStorageExceed) {
            storeTextMarkupObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'];
        }
        const textMarkupAnnotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            textMarkupAnnotations[parseInt(j.toString(), 10)] = [];
        }
        if (storeTextMarkupObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const textMarkupAnnotationCollection: IPageAnnotations[] = JSON.parse(storeTextMarkupObject);
            for (let i: number = 0; i < textMarkupAnnotationCollection.length; i++) {
                let newArray: ITextMarkupAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = textMarkupAnnotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[parseInt(z.toString(), 10)]);
                        if (this.pdfViewerBase.isJsonExported) {
                            if (pageAnnotationObject.annotations[parseInt(z.toString(), 10)].isAnnotationRotated) {
                                pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                                 this.getBoundsForSave(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds, i);
                            } else {
                                const pageDetails: any = this.pdfViewerBase.pageSize[pageAnnotationObject.pageIndex];
                                if (pageDetails) {
                                    pageAnnotationObject.annotations[parseInt(z.toString(), 10)].annotationRotation = pageDetails.rotation;
                                }
                            }
                        }
                        if (this.isChineseLanguage(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].textMarkupContent)) {
                            if (pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds.length > 0) {
                                const heightDifference: number = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].textMarkupAnnotationType === 'Strikethrough' ? this.strikeoutDifference : pageAnnotationObject.annotations[parseInt(z.toString(), 10)].textMarkupAnnotationType === 'Underline' ? this.underlineDifference : 0;
                                pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds.forEach((bound: any) => {
                                    bound.height = bound.height ? bound.height : bound.Height;
                                    if (bound.height > 0) {
                                        // Update height value
                                        bound.height += heightDifference;
                                    }
                                });
                            }
                        }
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                         JSON.stringify(this.getBoundsForSave(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds,
                                                              pageAnnotationObject.annotations[parseInt(z.toString(), 10)].pageNumber));
                        const colorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].color;
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].color = JSON.stringify(this.getRgbCode(colorString));
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rect =
                         JSON.stringify(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rect);
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
     * @returns {void}
     */
    public deleteTextMarkupAnnotation(): void {
        if (this.currentTextMarkupAnnotation) {
            let isLock: boolean = false;
            if (this.currentTextMarkupAnnotation.annotationSettings) {
                isLock = this.currentTextMarkupAnnotation.annotationSettings.isLock;
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', this.currentTextMarkupAnnotation)) {
                    isLock = false;
                }
            }
            if (!isLock) {
                let deletedAnnotation: ITextMarkupAnnotation = null;
                this.showHideDropletDiv(true);
                const annotation: any = this.currentTextMarkupAnnotation;
                if (this.currentTextMarkupAnnotation.isMultiSelect && annotation.annotNameCollection) {
                    this.deletMultiPageAnnotation(annotation);
                }
                const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
                if (pageAnnotations) {
                    for (let i: number = 0; i < pageAnnotations.length; i++) {
                        if (this.currentTextMarkupAnnotation.annotName === pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                            deletedAnnotation = pageAnnotations.splice(i, 1)[0];
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
                    this.pdfViewer.annotationModule.updateImportAnnotationCollection(this.currentTextMarkupAnnotation, this.currentTextMarkupAnnotation.pageNumber, 'textMarkupAnnotation');
                    const annotationId: string = this.currentTextMarkupAnnotation.annotName;
                    const annotationBounds: any = this.currentTextMarkupAnnotation.bounds;
                    this.currentTextMarkupAnnotation = null;
                    this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                    const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
                    if (multiPageCollection.length > 0) {
                        multiPageCollection.push(deletedAnnotation);
                        this.pdfViewer.fireAnnotationRemove(this.selectTextMarkupCurrentPage, annotationId,
                                                            deletedAnnotation.textMarkupAnnotationType as AnnotationType, annotationBounds,
                                                            deletedAnnotation.textMarkupContent, deletedAnnotation.textMarkupStartIndex,
                                                            deletedAnnotation.textMarkupEndIndex, multiPageCollection);
                    } else if (!isNullOrUndefined(deletedAnnotation)) {
                        this.pdfViewer.fireAnnotationRemove(this.selectTextMarkupCurrentPage, annotationId,
                                                            deletedAnnotation.textMarkupAnnotationType as AnnotationType, annotationBounds,
                                                            deletedAnnotation.textMarkupContent, deletedAnnotation.textMarkupStartIndex,
                                                            deletedAnnotation.textMarkupEndIndex);
                    }
                    this.currentAnnotationIndex = null;
                    this.selectTextMarkupCurrentPage = null;
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
                        this.pdfViewer.toolbarModule.showToolbar(true);
                    }
                }
            }
        }
    }

    /**
     * @param {string} color - It describes about the color
     * @private
     * @returns {void}
     */
    public modifyColorProperty(color: string): void {
        if (this.currentTextMarkupAnnotation) {
            const pageAnnotations: ITextMarkupAnnotation[] = this.modifyAnnotationProperty('Color', color, null);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
            this.pdfViewerBase.updateDocumentEditedProperty(true);
            const annotation: any = this.currentTextMarkupAnnotation;
            const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
            if (multiPageCollection.length > 0) {
                this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName,
                                                              annotation.textMarkupAnnotationType as AnnotationType, true, false,
                                                              false, false, annotation.textMarkupContent,
                                                              annotation.textMarkupStartIndex, annotation.textMarkupEndIndex,
                                                              multiPageCollection); this.currentAnnotationIndex = null;
            } else {
                this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName,
                                                              annotation.textMarkupAnnotationType as AnnotationType, true,
                                                              false, false, false,
                                                              annotation.textMarkupContent, annotation.textMarkupStartIndex,
                                                              annotation.textMarkupEndIndex); this.currentAnnotationIndex = null;
            }
        }
    }

    /**
     * @param {ChangeEventArgs} args - It describes about the args
     * @param {number} isOpacity - It describes about the isOpacity
     * @private
     * @returns {void}
     */
    public modifyOpacityProperty(args: ChangeEventArgs, isOpacity?: number): void {
        if (this.currentTextMarkupAnnotation) {
            let pageAnnotations: ITextMarkupAnnotation[];
            if (!(isNullOrUndefined(isOpacity))) {
                pageAnnotations = this.modifyAnnotationProperty('Opacity', isOpacity, 'changed');
            } else {
                pageAnnotations = this.modifyAnnotationProperty('Opacity', args.value / 100, args.name);
            }
            if (pageAnnotations) {
                this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
                this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
                if (!(isNullOrUndefined(isOpacity)) || args.name === 'changed') {
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                    const annotation: any = this.currentTextMarkupAnnotation;
                    const multiPageCollection: ITextMarkupAnnotation[] = this.multiPageCollectionList(annotation);
                    if (multiPageCollection.length > 0) {
                        this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName,
                                                                      annotation.textMarkupAnnotationType as AnnotationType, false,
                                                                      true, false, false,
                                                                      annotation.textMarkupContent, annotation.textMarkupStartIndex,
                                                                      annotation.textMarkupEndIndex,
                                                                      multiPageCollection); this.currentAnnotationIndex = null;
                    } else {
                        this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, annotation.annotName,
                                                                      annotation.textMarkupAnnotationType as AnnotationType,
                                                                      false, true, false, false,
                                                                      annotation.textMarkupContent, annotation.textMarkupStartIndex,
                                                                      annotation.textMarkupEndIndex); this.currentAnnotationIndex = null;
                    }
                }
            }
        }
    }

    /**
     * @param {string} property -It describes about the property
     * @param {any} value - It describes about the value
     * @param {string} status - It describes about the status
     * @param {string} annotName - It describes about the annotation name
     * @private
     * @returns {ITextMarkupAnnotation} - ITextMarkuoAnnotation
     */
    public modifyAnnotationProperty(property: string, value: any, status: string, annotName?: string): ITextMarkupAnnotation[] {
        const annotation: any = this.currentTextMarkupAnnotation;
        this.pdfViewer.annotationModule.isFormFieldShape = false;
        if (annotation.isMultiSelect && annotation.annotNameCollection) {
            this.modifyMultiPageAnnotations(annotation, property, value);
        }
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[parseInt(i.toString(), 10)])) {
                    if (property === 'Color') {
                        pageAnnotations[parseInt(i.toString(), 10)].color = value;
                    } else if (property === 'Opacity') {
                        pageAnnotations[parseInt(i.toString(), 10)].opacity = value;
                    } else if (property === 'AnnotationSettings') {
                        pageAnnotations[parseInt(i.toString(), 10)].annotationSettings = { isLock: value };
                    } else if (property === 'AnnotationSelectorSettings') {
                        pageAnnotations[parseInt(i.toString(), 10)].annotationSelectorSettings = value;
                    }
                    pageAnnotations[parseInt(i.toString(), 10)].modifiedDate =
                     this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    this.currentAnnotationIndex = i;
                    if (status === null || status === 'changed') {
                        this.pdfViewer.annotationModule.addAction(this.selectTextMarkupCurrentPage, i, this.currentTextMarkupAnnotation, 'Text Markup Property modified', property);
                    }
                    this.currentTextMarkupAnnotation = pageAnnotations[parseInt(i.toString(), 10)];
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                        updateAnnotationModifiedDate(pageAnnotations[parseInt(i.toString(), 10)]);
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)],
                                                                               this.selectTextMarkupCurrentPage);
                }
            }
        }
        return pageAnnotations;
    }

    /**
     * @param {ITextMarkupAnnotation} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @param {number} index - It describes about the index
     * @param {string} action - It describes about the action
     * @private
     * @returns {void}
     */
    public undoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(pageAnnotations[parseInt(index.toString(), 10)], 'textMarkup', null, true);
                const removeDiv: any = document.getElementById(pageAnnotations[parseInt(index.toString(), 10)].annotName);
                if (removeDiv) {
                    if (removeDiv.parentElement.childElementCount === 1) {
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                    } else {
                        removeDiv.parentElement.removeChild(removeDiv);
                    }
                }
                pageAnnotations.splice(index, 1);
                this.pdfViewer.annotationCollection.splice(index, 1);
            } else if (action === 'Text Markup Deleted') {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(pageNumber,
                                                                                                  annotation.shapeAnnotationType, true);
                pageAnnotations.splice(index, 0, annotation);
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
    }

    /**
     * @param {ITextMarkupAnnotation} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @param {number} index - It describes about the index
     * @param {string} property - It describes about the proeperty
     * @param {boolean} isUndoAction - It describes about the isUndoAction
     * @private
     * @returns {ITextMarkupAnnotation} - Itextmarkupannotation
     */
    public undoRedoPropertyChange(annotation: ITextMarkupAnnotation, pageNumber: number, index: number,
                                  property: string, isUndoAction?: boolean): ITextMarkupAnnotation {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (property === 'Color') {
                const tempColor: string = pageAnnotations[parseInt(index.toString(), 10)].color;
                pageAnnotations[parseInt(index.toString(), 10)].color = annotation.color;
                annotation.color = tempColor;
            } else {
                const tempOpacity: number = pageAnnotations[parseInt(index.toString(), 10)].opacity;
                pageAnnotations[parseInt(index.toString(), 10)].opacity = annotation.opacity;
                annotation.opacity = tempOpacity;
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotation, null, true);
            if (isUndoAction) {
                annotation.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
        return annotation;
    }

    /**
     * @param {ITextMarkupAnnotation} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @param {number} index - It describes about the index
     * @param {string} action - It describes about the action
     * @private
     * @returns {void}
     */
    public redoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(pageNumber,
                                                                                                  annotation.shapeAnnotationType, false);
                pageAnnotations.push(annotation);
            } else if (action === 'Text Markup Deleted') {
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(pageAnnotations[parseInt(index.toString(), 10)], 'textMarkup');
                const removeDiv: HTMLElement = document.getElementById(pageAnnotations[parseInt(index.toString(), 10)].annotName);
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
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {string} note -  It describes about the note
     * @private
     * @returns {void}
     */
    public saveNoteContent(pageNumber: number, note: string): void {
        const pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[parseInt(i.toString(), 10)])) {
                    pageAnnotations[parseInt(i.toString(), 10)].note = note;
                }
            }
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewerBase.updateDocumentEditedProperty(true);
    }

    private clearCurrentAnnotation(): void {
        if (!this.isExtended) {
            if (!(this.pdfViewer.isMaintainSelection && !this.pdfViewer.textSelectionModule.isTextSelection)) {
                this.selectTextMarkupCurrentPage = null;
                this.currentTextMarkupAnnotation = null;
            }
            let isSkip: boolean = false;
            if (this.pdfViewer.annotation.freeTextAnnotationModule &&
                 this.pdfViewer.annotation.freeTextAnnotationModule.isInuptBoxInFocus) {
                isSkip = true;
            }
            if (!isSkip) {
                this.enableAnnotationPropertiesTool(false);
            }
        }
    }

    /**
     * @param {number} pageNumber - It describes about the pageNumber
     * @param {boolean} isSelect - It describes about the isSelect
     * @private
     * @returns {void}
     */
    public clearCurrentAnnotationSelection(pageNumber: number, isSelect?: boolean): void {
        if (isSelect) {
            this.isAnnotationSelect = true;
        } else {
            this.isAnnotationSelect = false;
        }
        const lowerPageIndex: number = (pageNumber - 2) >= 0 ? (pageNumber - 2) : 0;
        const higherPageIndex: number = (pageNumber + 2) < this.pdfViewerBase.pageCount ? (pageNumber + 2) :
            this.pdfViewerBase.pageCount - 1;
        for (let k: number = lowerPageIndex; k <= higherPageIndex; k++) {
            this.clearAnnotationSelection(k);
        }
    }

    private getBoundsForSave(bounds: any, pageIndex: number): any {
        const newArray: any[] = [];
        for (let i: number = 0; i < bounds.length; i++) {
            const bound: any = this.getAnnotationBounds(bounds[parseInt(i.toString(), 10)], pageIndex);
            newArray.push(bound);
        }
        return newArray;
    }

    private getAnnotationBounds(bounds: any, pageIndex: number): any {
        let left: number = !isNullOrUndefined(bounds.left) ? bounds.left : bounds.Left;
        let top: number = !isNullOrUndefined(bounds.top) ? bounds.top : bounds.Top;
        const height: number = !isNullOrUndefined(bounds.height) ? bounds.height : bounds.Height;
        const width: number = !isNullOrUndefined(bounds.width) ? bounds.width : bounds.Width;
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        left = left ? left : bounds.x;
        top = top ? top : bounds.y;
        if (pageDetails) {
            if (pageDetails.rotation === 1) {
                return { left: top, top: pageDetails.width - (left + width), width: height, height: width };
            } else if (pageDetails.rotation === 2) {
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

    private getRgbCode(colorString: string): any {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let markupStringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(markupStringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            markupStringArray = colorString.split(',');
        }
        const textMarkupR: number = parseInt(markupStringArray[0].split('(')[1], 10);
        const textMarkupG: number = parseInt(markupStringArray[1], 10);
        const textMarkupB: number = parseInt(markupStringArray[2], 10);
        const textMarkupA: number = parseInt(markupStringArray[3], 10);
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
                    let annotationRotate: number = 0;
                    if (this.pdfViewerBase.clientSideRendering) {
                        const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageId.toString(), 10)];
                        const pageRotation: number = this.pdfViewerBase.getAngle(pageDetails.rotation);
                        let textElement: any;
                        if (range.startContainer.parentElement) {
                            textElement = range.startContainer.parentElement;
                        } else {
                            textElement = range.startContainer.parentNode;
                        }
                        if (textElement && textElement.style.transform !== '') {
                            if (textElement.style.transform.startsWith('rotate(90deg)')) {
                                annotationRotate = 90;
                            } else if (textElement.style.transform.startsWith('rotate(180deg)')) {
                                annotationRotate = 180;
                            } else if (textElement.style.transform.startsWith('rotate(-90deg)') || textElement.style.transform.startsWith('rotate(270deg)')) {
                                annotationRotate = 270;
                            } else {
                                annotationRotate = 0;
                            }
                        }
                    }
                    const indexes: any = this.getIndexNumbers(pageId, range.toString(),
                                                              range.commonAncestorContainer.textContent.toString());
                    const rectangle: IRectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left),
                        top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width),
                        height: this.getDefaultValue(boundingRect.height), right:
                           this.getDefaultValue(boundingRect.right - pageRect.left),
                        bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top), rotation: annotationRotate };
                    const rectangleArray: IRectangle[] = [];
                    rectangleArray.push(rectangle);
                    const rect: any = { left: rectangle.left, top: rectangle.top, right: rectangle.right,
                        bottom: rectangle.bottom, rotation: annotationRotate };
                    pageBounds.push({ pageIndex: pageId, bounds: rectangleArray, rect: rect, startIndex: indexes.startIndex,
                        endIndex: indexes.endIndex, textContent: range.toString() });
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
                        const textElement: HTMLElement = textDivs[parseInt(j.toString(), 10)] as HTMLElement;
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
                            const node: Node = textElement.childNodes[parseInt(k.toString(), 10)];
                            range.setStart(node, startOffset);
                            range.setEnd(node, endOffset);
                        }
                        const boundingRect: ClientRect = range.getBoundingClientRect();
                        let annotationRotate: number = 0;
                        if (this.pdfViewerBase.clientSideRendering) {
                            const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)];
                            const pageRotation: number = this.pdfViewerBase.getAngle(pageDetails.rotation);
                            if (textElement && textElement.style.transform !== '') {
                                if (textElement.style.transform.startsWith('rotate(90deg)')) {
                                    annotationRotate = 90;
                                } else if (textElement.style.transform.startsWith('rotate(180deg)')) {
                                    annotationRotate = 180;
                                } else if (textElement.style.transform.startsWith('rotate(-90deg)') || textElement.style.transform.startsWith('rotate(270deg)')) {
                                    annotationRotate = 270;
                                } else {
                                    annotationRotate = 0;
                                }
                            }
                        }
                        const rectangle: IRectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left),
                            top: this.getDefaultValue(boundingRect.top - pageRect.top),
                            width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height),
                            right: this.getDefaultValue(boundingRect.right - pageRect.left),
                            bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top), rotation: annotationRotate };
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
                    const indexes: any = this.getIndexNumbers(i, textValue);
                    const pageRectangle: IRectangle = { left: this.getDefaultValue(pageRectBounds.left - pageRect.left),
                        top: this.getDefaultValue(pageRectBounds.top - pageRect.top),
                        width: this.getDefaultValue(pageRectBounds.width), height: this.getDefaultValue(pageRectBounds.height),
                        right: this.getDefaultValue(pageRectBounds.right - pageRect.left),
                        bottom: this.getDefaultValue(pageRectBounds.bottom - pageRect.top) };
                    const rect: any = { left: pageRectangle.left, top: pageRectangle.top, right: pageRectangle.right,
                        bottom: pageRectangle.bottom };
                    pageBounds.push({ pageIndex: i, bounds: selectionRects, rect: rect, startIndex: indexes.startIndex,
                        endIndex: indexes.endIndex, textContent: textValue });
                }
            }
        }
        selection.removeAllRanges();
        return pageBounds;
    }

    private getIndexNumbers(pageNumber: number, content: string, parentText?: string): any {
        const storedData: any = this.pdfViewerBase.clientSideRendering ?
            this.pdfViewerBase.getLinkInformation(pageNumber) : this.pdfViewerBase.getStoredData(pageNumber);
        let startIndex: number;
        let endIndex: number;
        if (storedData) {
            let previousIndex: number = 0;
            const pageText: string = storedData.pageText;
            for (let p: number = 0; p < pageNumber; p++) {
                if (this.pdfViewer.isExtractText) {
                    const documentIndex: any = this.pdfViewer.textSearchModule.
                        documentTextCollection[parseInt(p.toString(), 10)][parseInt(p.toString(), 10)];
                    const pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                    if (this.pdfViewer.textSearchModule && this.pdfViewer.
                        textSearchModule.documentTextCollection && this.pdfViewer.textSearchModule.isTextRetrieved) {
                        if (this.pdfViewer.textSearchModule.documentTextCollection[parseInt(p.toString(), 10)]) {
                            previousIndex = previousIndex + pageTextData.length;
                        }
                    } else {
                        if (this.pdfViewer.textSearchModule && this.pdfViewer.textSearchModule.documentTextCollection) {
                            if (pageNumber <= this.pdfViewer.textSearchModule.documentTextCollection.length) {
                                if (this.pdfViewer.textSearchModule.documentTextCollection[parseInt(p.toString(), 10)]) {
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
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
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
                (annotCanvas as HTMLCanvasElement).style.width = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].width * this.pdfViewerBase.getZoomFactor() + 'px';
                (annotCanvas as HTMLCanvasElement).style.height = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].height * this.pdfViewerBase.getZoomFactor() + 'px';
            } else {
                (annotCanvas as HTMLCanvasElement).width =
                 this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].width * this.pdfViewerBase.getZoomFactor();
                (annotCanvas as HTMLCanvasElement).height =
                 this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)].height * this.pdfViewerBase.getZoomFactor();
            }
            this.renderTextMarkupAnnotations(null, pageNumber, annotCanvas, this.pdfViewerBase.getZoomFactor());
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public rerenderAnnotations(pageNumber: number): void {
        const oldCanvasCollection: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_old_annotationCanvas_' + pageNumber);
        for (let i: number = 0; i < oldCanvasCollection.length; i++) {
            if (oldCanvasCollection[parseInt(i.toString(), 10)]) {
                oldCanvasCollection[parseInt(i.toString(), 10)].parentElement.removeChild(oldCanvasCollection[parseInt(i.toString(), 10)]);
            }
        }
        const newCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (newCanvas) {
            newCanvas.style.display = 'block';
        }
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
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
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && this.pdfViewer.enableToolbar &&
                         this.pdfViewer.enableAnnotationToolbar) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.
                            createPropertyTools(this.currentTextMarkupAnnotation.textMarkupAnnotationType);
                    }
                    this.currentTextMarkupAnnotation = currentAnnot;
                    this.selectTextMarkupCurrentPage = pageNumber;
                    if (!isSelection) {
                        this.enableAnnotationPropertiesTool(true);
                    }
                    const commentPanelDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                    if (commentPanelDiv && commentPanelDiv.style.display === 'block') {
                        const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        const comments: any = document.getElementById(currentAnnot.annotName);
                        if (comments) {
                            comments.firstChild.click();
                        }
                    }
                    if (!isBlazor()) {
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                            this.pdfViewer.toolbarModule.annotationToolbarModule.
                                showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
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
     * @param {TouchEvent} event - It describes about the event
     * @private
     * @returns {void}
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
            const currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.touches[0].clientX,
                                                                                        event.touches[0].clientY, pageNumber, touchCanvas);
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
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && this.pdfViewer.enableToolbar &&
                         this.pdfViewer.enableAnnotationToolbar) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.
                            createPropertyTools(this.currentTextMarkupAnnotation.textMarkupAnnotationType);
                    }
                    this.currentTextMarkupAnnotation = currentAnnot;
                    this.selectTextMarkupCurrentPage = pageNumber;
                    this.enableAnnotationPropertiesTool(true);
                    const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                    if (accordionExpand) {
                        accordionExpand.ej2_instances[0].expandItem(true);
                    }
                    const comments: any = document.getElementById(currentAnnot.annotName);
                    if (comments) {
                        if (!Browser.isDevice) {
                            comments.firstChild.click();
                        }
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
     * @returns {void}
     */
    public clearCurrentSelectedAnnotation(): void {
        if (this.currentTextMarkupAnnotation) {
            this.clearAnnotationSelection(this.selectTextMarkupCurrentPage);
            const currentAnnot: any = this.currentTextMarkupAnnotation;
            this.pdfViewer.fireAnnotationUnSelect(currentAnnot.annotName, currentAnnot.pageNumber, currentAnnot);
            this.currentTextMarkupAnnotation = null;
            this.clearCurrentAnnotation();
        }
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public onTextMarkupAnnotationMouseMove(event: MouseEvent): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        let pageIndex: number = parseInt(eventTarget.id.split('_text_')[1], 10) || parseInt(eventTarget.id.split('_textLayer_')[1], 10) || parseInt(eventTarget.id.split('_annotationCanvas_')[1], 10);
        if (event.target && (eventTarget.id.indexOf('_text') > -1 || eventTarget.id.indexOf('_annotationCanvas') > -1 || eventTarget.classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
            pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
            const currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageIndex, canvas);
            if (currentAnnot) {
                eventTarget.style.cursor = 'pointer';
                const currentPosition: any = this.pdfViewerBase.getMousePosition(event);
                const relativePosition: any = this.pdfViewerBase.relativePosition(event);
                const viewerPositions: any = { left: relativePosition.x, top: relativePosition.y };
                const mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                const annotationSettings: any = { opacity: currentAnnot.opacity, color: currentAnnot.color,
                    author: currentAnnot.author, subject: currentAnnot.subject, modifiedDate: currentAnnot.modifiedDate };
                this.pdfViewerBase.isMousedOver = true;
                this.pdfViewer.fireAnnotationMouseover(currentAnnot.annotName, currentAnnot.pageNumber,
                                                       currentAnnot.textMarkupAnnotationType as AnnotationType, currentAnnot.bounds,
                                                       annotationSettings, mousePositions, viewerPositions);
                // this.showPopupNote(event, currentAnnot);
            } else {
                this.pdfViewer.annotationModule.hidePopupNote();
                if (this.pdfViewerBase.isPanMode && !this.pdfViewerBase.getAnnotationToolStatus()) {
                    eventTarget.style.cursor = 'grab';
                }
                if (this.pdfViewerBase.isMousedOver && !this.pdfViewerBase.isFormFieldMousedOver) {
                    this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                    this.pdfViewerBase.isMousedOver = false;
                }
            }
        }
    }

    private showPopupNote(event: any, annotation: ITextMarkupAnnotation): void {
        if (annotation.note) {
            this.pdfViewer.annotationModule.showPopupNote(event, annotation.color, annotation.author, annotation.note,
                                                          annotation.textMarkupAnnotationType);
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
                    const annotation: ITextMarkupAnnotation = annotationList[parseInt(i.toString(), 10)];
                    for (let j: number = 0; j < annotation.bounds.length; j++) {
                        const bound: any = annotation.bounds[parseInt(j.toString(), 10)];
                        const left: number = bound.left ? bound.left : bound.Left;
                        const top: number = bound.top ? bound.top : bound.Top;
                        const width: number = bound.width ? bound.width : bound.Width;
                        const height: number = bound.height ? bound.height : bound.Height;
                        if (leftClickPosition >= this.getMagnifiedValue(left, this.pdfViewerBase.getZoomFactor()) &&
                         leftClickPosition <= this.getMagnifiedValue(left + width, this.pdfViewerBase.getZoomFactor()) &&
                          topClickPosition >= this.getMagnifiedValue(top, this.pdfViewerBase.getZoomFactor()) &&
                           topClickPosition <= this.getMagnifiedValue(top + height, this.pdfViewerBase.getZoomFactor())) {
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
            const firstAnnotBounds: any = annotations[parseInt(i.toString(), 10)].bounds;
            const firstXposition: number = firstAnnotBounds[0].left ? firstAnnotBounds[0].left : firstAnnotBounds[0].Left;
            const firstYposition: number = firstAnnotBounds[0].top ? firstAnnotBounds[0].top : firstAnnotBounds[0].Top;
            const secondAnnotBounds: any = annotations[i + 1].bounds;
            const secondXposition: number = secondAnnotBounds[0].left ? secondAnnotBounds[0].left : secondAnnotBounds[0].Left;
            const secondYposition: number = secondAnnotBounds[0].top ? secondAnnotBounds[0].top : secondAnnotBounds[0].Top;
            if ((firstXposition < secondXposition) || (firstYposition < secondYposition)) {
                previousX = secondXposition;
                currentAnnotation = annotations[i + 1];
            } else {
                previousX = firstXposition;
                currentAnnotation = annotations[parseInt(i.toString(), 10)];
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
     * @param {number} pageNumber - It describes about the pageNumber
     * @private
     * @returns {void}
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
     * @param {ITextMarkupAnnotation} annotation - It describes about the annotation
     * @param {HTMLElement} canvas - It describes about the canvas
     * @param {number} pageNumber - It describes about the page number
     * @param {MouseEvent} event - It describes about the event
     * @param {boolean} isProgrammaticSelection - It describes about the programmactic selection
     * @private
     * @returns {void}
     */
    public selectAnnotation(annotation: ITextMarkupAnnotation, canvas: HTMLElement, pageNumber?: number,
                            event?: MouseEvent | TouchEvent, isProgrammaticSelection?: boolean): void {
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
            if (this.isSelectedAnnotation && this.pdfViewer.textSelectionModule) {
                this.pdfViewerBase.isSelection = true;
                this.updateAnnotationBounds();
            }
            const currentEvent: any = event;
            if (this.isEnableTextMarkupResizer(annotation.textMarkupAnnotationType) && annotation && currentEvent &&
             !currentEvent.touches) {
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
                    this.pdfViewer.annotationModule.annotationSelect(annotation.annotName, this.selectTextMarkupCurrentPage,
                                                                     annotation, null, false, isSelected);
                    this.selectedTextMarkup = null;
                }
            }
            if (annotation && this.isEnableTextMarkupResizer(annotation.textMarkupAnnotationType)) {
                this.isTextMarkupAnnotationMode = true;
            }
        }
    }

    /**
     * @param {any} annotation - annotation
     * @private
     * @returns {void}
     */
    public updateCurrentResizerPosition(annotation?: any): void {
        if (!annotation) {
            annotation = this.currentTextMarkupAnnotation;
        }
        if (annotation) {
            if (this.isEnableTextMarkupResizer(annotation.textMarkupAnnotationType) && annotation) {
                const textElement: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + this.selectTextMarkupCurrentPage);
                if (textElement) {
                    const boundingRect: any = textElement.getBoundingClientRect();
                    const left: number = annotation.bounds[0].left ? annotation.bounds[0].left : annotation.bounds[0].Left;
                    const top: number = annotation.bounds[0].top ? annotation.bounds[0].top : annotation.bounds[0].Top;
                    this.updateLeftposition(left * this.pdfViewerBase.getZoomFactor() + boundingRect.left, (boundingRect.top + top), true);
                    const endPosition: any = annotation.bounds[annotation.bounds.length - 1];
                    const endLeft: number = endPosition.left ? endPosition.left : endPosition.Left;
                    const endTop: number = endPosition.top ? endPosition.top : endPosition.Top;
                    const endWidth: number = endPosition.width ? endPosition.width : endPosition.Width;
                    this.updatePosition((endLeft + endWidth) * this.pdfViewerBase.getZoomFactor() + boundingRect.left,
                                        (endTop + boundingRect.top), true);
                }
            }
        }
    }

    private drawAnnotationSelectRect(canvas: HTMLElement, x: number, y: number, width: number, height: number, annotation: any): void {
        const ratio : number = this.pdfViewerBase.getZoomRatio();
        if (canvas) {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.beginPath();
            if (typeof (annotation).annotationSelectorSettings === 'string') {
                let lineDash: number[] = JSON.parse(annotation.annotationSelectorSettings).selectorLineDashArray.length === 0 ?
                    [4] : JSON.parse(annotation.annotationSelectorSettings).selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                context.setLineDash(lineDash);
                context.globalAlpha = 1;
                context.rect(x * ratio, y * ratio, width * ratio, height * ratio);
                context.closePath();
                const borderColor: string = JSON.parse(annotation.annotationSelectorSettings).selectionBorderColor === '' ? '#0000ff' : JSON.parse(annotation.annotationSelectorSettings).selectionBorderColor;
                context.strokeStyle = borderColor;
                context.lineWidth = JSON.parse(annotation.annotationSelectorSettings).selectionBorderThickness === 1 ?
                    1 : (annotation.annotationSelectorSettings).selectionBorderThickness;
                context.stroke();
                context.save();
            } else {
                let lineDash: number[] = (annotation.annotationSelectorSettings).selectorLineDashArray.length === 0 ? [4] :
                    (annotation.annotationSelectorSettings).selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                context.setLineDash(lineDash);
                context.globalAlpha = 1;
                context.rect(x * ratio, y * ratio, width * ratio, height * ratio);
                context.closePath();
                const borderColor: string = (annotation.annotationSelectorSettings).selectionBorderColor === '' ? '#0000ff' : (annotation.annotationSelectorSettings).selectionBorderColor;
                context.strokeStyle = borderColor;
                context.lineWidth = (annotation.annotationSelectorSettings).selectionBorderThickness ? 1 :
                    (annotation.annotationSelectorSettings).selectionBorderThickness;
                context.stroke();
                context.save();
            }
        }
    }

    /**
     * @param {boolean} isEnable - It describes about the isEnable
     * @private
     * @returns {void}
     */
    public enableAnnotationPropertiesTool(isEnable: boolean): void {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-color-container');
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            if (!Browser.isDevice) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(isEnable);
            }
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule &&
             this.pdfViewer.toolbarModule.annotationToolbarModule.isMobileAnnotEnabled &&
              this.pdfViewer.selectedItems.annotations.length === 0) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(isEnable);
                let enable: boolean = isEnable;
                if (this.isTextMarkupAnnotationMode) {
                    enable = true;
                }
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(enable);
                if (this.currentTextMarkupAnnotation) {
                    if (!isBlazor()) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.
                            updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement,
                                              this.currentTextMarkupAnnotation.color);
                    } else {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.
                            updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElementInBlazor,
                                              this.currentTextMarkupAnnotation.color);
                    }
                } else {
                    if (!isNullOrUndefined(this.isTextMarkupAnnotationMode) && !this.isTextMarkupAnnotationMode) {
                        if (!isBlazor()) {
                            this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, '#000000');
                        } else {
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
     * @returns {void}
     */
    public maintainAnnotationSelection(): void {
        if (this.currentTextMarkupAnnotation) {
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + this.selectTextMarkupCurrentPage);
            if (canvas) {
                this.selectAnnotation(this.currentTextMarkupAnnotation as ITextMarkupAnnotation, canvas, this.selectTextMarkupCurrentPage);
            }
        }
    }

    // private storeAnnotations(pageNumber: number, annotation: ITextMarkupAnnotation): number {
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
     * @param {ITextMarkupAnnotation} pageAnnotations - It describes about the page annotations
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public manageAnnotations(pageAnnotations: ITextMarkupAnnotation[], pageNumber: number): void {
        let storeObject: string = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_textMarkup'];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
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
     * @param {number} pageIndex - It describes about the pageIndex
     * @param {any} textMarkupAnnotations - It describes about the text markup annotations
     * @param {string} id -It describes about the id
     * @private
     * @returns {any} - any
     */
    public getAnnotations(pageIndex: number, textMarkupAnnotations: any[], id?: string): any[] {
        let annotationCollection: any[];
        if (id == null || id === undefined) {
            id = '_annotations_textMarkup';
        }
        let storeObject: string = window.sessionStorage.getItem(this.pdfViewerBase.documentId + id);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + id];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotationCollection = annotObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = textMarkupAnnotations;
            }
        } else {
            annotationCollection = textMarkupAnnotations;
        }
        return annotationCollection;
    }

    private getAddedAnnotation(type: string, color: string, opacity: number, bounds: any, author: string, subject: string,
                               predefinedDate: string, note: string, isCommentLock: boolean, rect: any, pageNumber: number,
                               textContent: string,
                               startIndex: number, endIndex: number, isMultiSelect?: boolean, allowedInteractions?: any,
                               annotationRotate?: number): ITextMarkupAnnotation {
        const modifiedDate: string = predefinedDate ? predefinedDate : this.pdfViewer.annotation.
            stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('textMarkup', pageNumber + 1, type);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        const annotationSettings: object =   this.pdfViewer.annotationSettings ?
            this.pdfViewer.annotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(this.pdfViewer.annotation);
        const isPrint: boolean = this.getIsPrintValue(type);
        const annotation: ITextMarkupAnnotation = {
            textMarkupAnnotationType: type, color: color, opacity: opacity, bounds: bounds, author: author,
            allowedInteractions: allowedInteractions, subject: subject, modifiedDate: modifiedDate, note: note, rect: rect,
            annotName: annotationName, comments: [], review: { state: '', stateModel: '', author: author, modifiedDate: modifiedDate }, shapeAnnotationType: 'textMarkup', pageNumber: pageNumber,
            textMarkupContent: textContent, textMarkupStartIndex: startIndex, textMarkupEndIndex: endIndex,
            isMultiSelect: isMultiSelect, annotationSelectorSettings: this.getSelector(type),
            customData: this.pdfViewer.annotation.getTextMarkupData(subject), annotationAddMode: this.annotationAddMode,
            annotationSettings: annotationSettings, isPrint: isPrint, isCommentLock: isCommentLock, isAnnotationRotated: false,
            annotationRotation: annotationRotate,
            isLocked: false
        };
        if (isMultiSelect) {
            this.multiPageCollection.push(annotation as ITextMarkupAnnotation);
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
        if (isNullOrUndefined(isPrint)) {
            isPrint = true;
        }
        return isPrint;
    }

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
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public saveImportedTextMarkupAnnotations(annotation: any, pageNumber: number): void {
        let annotationObject: ITextMarkupAnnotation = null;
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotation.Subject);
        annotation.allowedInteractions = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotation.AnnotationSettings = annotation.AnnotationSettings ?
            annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.customStampSettings);
        annotationObject = {
            textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, opacity: annotation.Opacity,
            allowedInteractions: annotation.allowedInteractions, bounds: annotation.Bounds, author: annotation.Author,
            subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
            annotName: annotation.AnnotName, isLocked: annotation.IsLocked,
            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation,
                                                                            annotation.Author), review: { state: annotation.State,
                stateModel: annotation.StateModel,
                modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            shapeAnnotationType: 'textMarkup',
            pageNumber: pageNumber, textMarkupContent: '', textMarkupStartIndex: 0,
            textMarkupEndIndex: 0, annotationSelectorSettings: this.getSettings(annotation),
            customData: this.pdfViewer.annotation.getCustomData(annotation),
            isMultiSelect: annotation.IsMultiSelect, annotNameCollection: annotation.AnnotNameCollection,
            annotpageNumbers: annotation.AnnotpageNumbers,
            annotationAddMode: this.annotationAddMode, annotationSettings : annotation.AnnotationSettings,
            isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock, isAnnotationRotated: false
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_textMarkup');
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {any} - any
     */
    public updateTextMarkupAnnotationCollections(annotation: any, pageNumber: number): any {
        let annotationObject: any = null;
        annotation.allowedInteractions = annotation.AllowedInteractions ?
            annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotation.AnnotationSettings = annotation.AnnotationSettings ?
            annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.customStampSettings);
        if (annotation.IsLocked) {
            annotation.AnnotationSettings.isLock = annotation.IsLocked;
        }
        annotationObject = {
            textMarkupAnnotationType: annotation.TextMarkupAnnotationType, allowedInteractions: annotation.allowedInteractions,
            color: annotation.Color, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author,
            subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
            annotationId: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, shapeAnnotationType: 'textMarkup', pageNumber: pageNumber, isMultiSelect: annotation.IsMultiSelect, annotNameCollection: annotation.AnnotNameCollection, annotpageNumbers: annotation.AnnotpageNumbers, customData: this.pdfViewer.annotation.getCustomData(annotation),
            annotationSettings : annotation.AnnotationSettings, isLocked: annotation.IsLocked, isPrint: annotation.IsPrint,
            isCommentLock: annotation.IsCommentLock
        };
        return annotationObject;
    }

    /**
     * @param {string} textMarkUpSettings - It describes about the textmarkup settings
     * @private
     * @returns {void}
     */
    public updateTextMarkupSettings(textMarkUpSettings: string): void {
        if (textMarkUpSettings === 'highlightSettings') {
            this.highlightColor = this.pdfViewer.highlightSettings.color ? this.pdfViewer.highlightSettings.color : this.highlightColor;
            this.highlightOpacity = this.pdfViewer.highlightSettings.opacity ?
                this.pdfViewer.highlightSettings.opacity : this.highlightOpacity;
        }
        if (textMarkUpSettings === 'underlineSettings') {
            this.underlineColor = this.pdfViewer.underlineSettings.color ? this.pdfViewer.underlineSettings.color : this.underlineColor;
            this.underlineOpacity = this.pdfViewer.underlineSettings.opacity ?
                this.pdfViewer.underlineSettings.opacity : this.underlineOpacity;
        }
        if (textMarkUpSettings === 'strikethroughSettings') {
            this.strikethroughColor = this.pdfViewer.strikethroughSettings.color ?
                this.pdfViewer.strikethroughSettings.color : this.strikethroughColor;
            this.strikethroughOpacity = this.pdfViewer.strikethroughSettings.opacity ?
                this.pdfViewer.strikethroughSettings.opacity : this.strikethroughOpacity;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        this.selectTextMarkupCurrentPage = null;
        this.currentTextMarkupAnnotation = null;
        this.annotationClickPosition = null;
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
    }

    /**
     * Get vertex points properties
     *
     * @param {any} points - It describes about the points
     * @private
     * @returns {any} - any
     */
    private getOffsetPoints(points: any): any {
        const offsetPoints: any = [];
        //Converting points model into vertex property
        for (let j: number = 0; j < points.length; j++) {
            offsetPoints[parseInt(j.toString(), 10)] = {X: points[parseInt(j.toString(), 10)].x,
                Y: points[parseInt(j.toString(), 10)].y, Width: points[parseInt(j.toString(), 10)].width,
                Height: points[parseInt(j.toString(), 10)].height, Left: points[parseInt(j.toString(), 10)].x,
                Top: points[parseInt(j.toString(), 10)].y};
        }
        return offsetPoints;
    }

    /**
     * This method used to add annotations with using program.
     *
     * @param {AnnotationType} annotationType - It describes the annotation type
     * @param {any} annotationObject - It describes type of annotation object
     * @returns {object} - object
     * @private
     */
    public updateAddAnnotationDetails(annotationType: AnnotationType, annotationObject: any): Object
    {
        //Creating new object if annotationObject is null
        if (!annotationObject)
        {
            annotationObject = {pageNumber: 0};
        }
        //Initialize the annotation settings
        let annotSelectorSettings: any = null;
        let annotallowedInteractions: any = null;
        let textMarkupAnnotationType: string = '';
        let annotSettings: any = null;
        let color: string = '';
        let bounds : any[] = [];
        //Creating the CurrentDate and Annotation name
        const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        if (annotationType === 'Highlight')
        {
            //Creating annotation settings
            annotSelectorSettings = this.pdfViewer.highlightSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotSelectorSettings);
            annotSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.highlightSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotationType);
            annotallowedInteractions = this.pdfViewer.highlightSettings.allowedInteractions ?
                this.pdfViewer.highlightSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            textMarkupAnnotationType = 'Highlight';
            color = annotationObject.color ? annotationObject.color : '#ffff00';
        }
        else if (annotationType === 'Underline')
        {
            //Creating annotation settings
            annotSelectorSettings = this.pdfViewer.underlineSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotSelectorSettings);
            annotSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.underlineSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotationType);
            annotallowedInteractions = this.pdfViewer.underlineSettings.allowedInteractions ?
                this.pdfViewer.underlineSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            textMarkupAnnotationType = 'Underline';
            color = annotationObject.color ? annotationObject.color : '#00ff00';
        }
        else if (annotationType === 'Strikethrough')
        {
            //Creating annotation settings
            annotSelectorSettings = this.pdfViewer.strikethroughSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotSelectorSettings);
            annotSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.strikethroughSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotationType);
            annotallowedInteractions = this.pdfViewer.strikethroughSettings.allowedInteractions ?
                this.pdfViewer.strikethroughSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            textMarkupAnnotationType = 'Strikethrough';
            color = annotationObject.color ? annotationObject.color : '#ff0000';
        }
        annotSettings.isLock = annotationObject.isLock ? annotationObject.isLock : annotSettings.isLock;
        //Creating the offset points
        if (annotationObject.bounds)
        {
            bounds = this.getOffsetPoints(annotationObject.bounds);
        }
        else
        {bounds = [{X: 1, Y: 1, Width: 100, Height: 14, Left: 1, Top: 1, Location: {X: 1, Y: 1},
            Size: {Height: 14, IsEmpty: false, Width: 100}}]; }
        //Creating Annotation objects with it's proper properties
        const textMarkupAnnotation: any = [];
        const textmarkup: any = {
            AllowedInteractions: annotationObject.allowedInteractions ? annotationObject.allowedInteractions : annotallowedInteractions,
            AnnotName: annotationName,
            AnnotNameCollection: null,
            AnnotType: 'textMarkup',
            AnnotationSelectorSettings: annotationObject.annotationSelectorSettings ?
                annotationObject.annotationSelectorSettings : annotSelectorSettings,
            AnnotationSettings: annotSettings,
            Author: annotationObject.author ? annotationObject.author : 'Guest',
            Bounds: bounds,
            Color: annotationObject.color ? annotationObject.color : color,
            Comments: null,
            CreatedDate: currentDateString,
            CustomData: annotationObject.customData ? annotationObject.customData : null,
            ExistingCustomData: null,
            EnableMultiPageAnnotation : annotationObject.enableMultiPageAnnotation ? annotationObject.enableMultiPageAnnotation : false,
            EnableTextMarkupResizer : annotationObject.enableTextMarkupResizer ? annotationObject.enableTextMarkupResizer : false,
            IsCommentLock: false,
            IsMultiSelect: false,
            IsLocked : annotationObject.isLock ? annotationObject.isLock : false,
            IsLock: annotationObject.isLock ? annotationObject.isLock : false,
            IsPrint: annotationObject.isPrint ? annotationObject.isPrint : true,
            ModifiedDate: '',
            Note: '',
            Opacity: annotationObject.opacity ? annotationObject.opacity : 1,
            Rect: {},
            State: '',
            StateModel: '',
            Subject: annotationObject.subject ? annotationObject.subject : textMarkupAnnotationType,
            TextMarkupAnnotationType: textMarkupAnnotationType
        };
        //Adding the annotation object to an array and return it
        textMarkupAnnotation[0] = textmarkup;
        return {textMarkupAnnotation};
    }
}
