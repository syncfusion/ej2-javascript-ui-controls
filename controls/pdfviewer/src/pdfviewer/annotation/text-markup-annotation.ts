import {
    PdfViewer, PdfViewerBase, IRectangle, ISelection, AnnotationType, IPageAnnotations, ICommentsCollection,
    IReviewCollection
} from '../index';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorPicker, ChangeEventArgs } from '@syncfusion/ej2-inputs';

/**
 * @hidden
 */
export interface ITextMarkupAnnotation {
    textMarkupAnnotationType: string;
    author: string;
    subject: string;
    modifiedDate: string;
    note: string;
    // tslint:disable-next-line
    bounds: any;
    // tslint:disable-next-line
    color: any;
    opacity: number;
    // tslint:disable-next-line
    rect: any;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotName: string;
    shapeAnnotationType: string;
    position?: string;
}

/**
 * @hidden
 */
export interface IPageAnnotationBounds {
    pageIndex: number;
    bounds: IRectangle[];
    // tslint:disable-next-line
    rect: any;
}

/**
 * The `TextMarkupAnnotation` module is used to handle text markup annotation actions of PDF viewer.
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

    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.highlightColor = pdfViewer.highlightSettings.color;
        this.underlineColor = pdfViewer.underlineSettings.color;
        this.strikethroughColor = pdfViewer.strikethroughSettings.color;
        this.highlightOpacity = pdfViewer.highlightSettings.opacity;
        this.underlineOpacity = pdfViewer.underlineSettings.opacity;
        this.strikethroughOpacity = pdfViewer.strikethroughSettings.opacity;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public renderTextMarkupAnnotationsInPage(textMarkupAnnotations: any, pageNumber: number, isImportTextMarkup?: boolean): void {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (isImportTextMarkup) {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor(), true);
        } else {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
        }
    }

    // tslint:disable-next-line
    private renderTextMarkupAnnotations(textMarkupAnnotations: any, pageNumber: number, canvas: HTMLElement, factor: number, isImportAction?: boolean): void {
        if (canvas) {
            let context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.setLineDash([]);
            // tslint:disable-next-line
            let annotations: any[];
            if (!isImportAction) {
                annotations = this.getAnnotations(pageNumber, textMarkupAnnotations);
            } else {
                annotations = textMarkupAnnotations;
            }
            if (annotations) {
                for (let i: number = 0; i < annotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation: any = annotations[i];
                    let annotationObject: ITextMarkupAnnotation = null;
                    if (annotation.TextMarkupAnnotationType) {
                        // tslint:disable-next-line:max-line-length
                        annotationObject = { textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
                            annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, shapeAnnotationType: 'textMarkup'
                        };
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_textMarkup');
                    }
                    // tslint:disable-next-line:max-line-length
                    let type: string = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.textMarkupAnnotationType;
                    // tslint:disable-next-line
                    let annotBounds: any = annotation.Bounds ? annotation.Bounds : annotation.bounds;
                    let opacity: number = annotation.Opacity ? annotation.Opacity : annotation.opacity;
                    let color: string = annotation.Color ? annotation.Color : annotation.color;
                    switch (type) {
                        case 'Highlight':
                            this.renderHighlightAnnotation(annotBounds, opacity, color, context, factor);
                            break;
                        case 'Strikethrough':
                            this.renderStrikeoutAnnotation(annotBounds, opacity, color, context, factor);
                            break;
                        case 'Underline':
                            this.renderUnderlineAnnotation(annotBounds, opacity, color, context, factor);
                            break;
                    }
                }
            }
            if (pageNumber === this.selectTextMarkupCurrentPage) {
                if (!this.isAnnotationSelect) {
                    this.maintainAnnotationSelection();
                } else {
                    this.isAnnotationSelect = false;
                }
            }
        }
    }

    /**
     * @private
     */
    public drawTextMarkupAnnotations(type: string): void {
        this.isTextMarkupAnnotationMode = true;
        this.currentTextMarkupAddMode = type;
        let selectionObject: ISelection[] = this.pdfViewer.textSelectionModule.selectionRangeArray;
        if (selectionObject.length > 0) {
            this.convertSelectionToTextMarkup(type, selectionObject, this.pdfViewerBase.getZoomFactor());
        }
        if (window.getSelection().toString()) {
            let pageBounds: IPageAnnotationBounds[] = this.getDrawnBounds();
            if (pageBounds.length > 0) {
                for (let i: number = 0; i < pageBounds.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    this.drawTextMarkups(type, pageBounds[i].bounds, pageBounds[i].pageIndex, pageBounds[i].rect, this.pdfViewerBase.getZoomFactor());
                }
            }
        }
        // this.pdfViewerBase.annotationHelper.redoCollection = [];
        this.pdfViewer.textSelectionModule.clearTextSelection();
    }

    private convertSelectionToTextMarkup(type: string, selectionObject: ISelection[], factor: number): void {
        for (let i: number = 0; i < selectionObject.length; i++) {
            this.drawTextMarkups(type, selectionObject[i].rectangleBounds, selectionObject[i].pageNumber, selectionObject[i].bound, factor);
        }
    }

    // tslint:disable-next-line
    private drawTextMarkups(type: string, bounds: IRectangle[], pageNumber: number, rect: any, factor: number): void {
        let annotation: ITextMarkupAnnotation = null;
        let context: CanvasRenderingContext2D = this.getPageContext(pageNumber);
        if (context) {
            context.setLineDash([]);
            switch (type) {
                case 'Highlight':
                    // tslint:disable-next-line:max-line-length
                    annotation = this.getAddedAnnotation(type, this.highlightColor, this.highlightOpacity, bounds, this.pdfViewer.highlightSettings.author, this.pdfViewer.highlightSettings.subject, this.pdfViewer.highlightSettings.modifiedDate, '', rect, pageNumber);
                    if (annotation) {
                        this.renderHighlightAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor);
                    }
                    break;
                case 'Strikethrough':
                    // tslint:disable-next-line:max-line-length
                    annotation = this.getAddedAnnotation(type, this.strikethroughColor, this.strikethroughOpacity, bounds, this.pdfViewer.strikethroughSettings.author, this.pdfViewer.strikethroughSettings.subject, this.pdfViewer.strikethroughSettings.modifiedDate, '', rect, pageNumber);
                    if (annotation) {
                        this.renderStrikeoutAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor);
                    }
                    break;
                case 'Underline':
                    // tslint:disable-next-line:max-line-length
                    annotation = this.getAddedAnnotation(type, this.underlineColor, this.underlineOpacity, bounds, this.pdfViewer.underlineSettings.author, this.pdfViewer.underlineSettings.subject, this.pdfViewer.underlineSettings.modifiedDate, '', rect, pageNumber);
                    if (annotation) {
                        this.renderUnderlineAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor);
                    }
                    break;
            }
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line
            let settings: any = { opacity: annotation.opacity, color: annotation.color, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate };
            let index: number = this.pdfViewer.annotationModule.actionCollection[this.pdfViewer.annotationModule.actionCollection.length - 1].index;
            this.pdfViewer.fireAnnotationAdd(pageNumber, index, (type as AnnotationType), annotation.rect, settings);
        }
    }

    // tslint:disable-next-line
    private renderHighlightAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D, factor: number): void {
        for (let i: number = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            let bound: any = bounds[i];
            context.beginPath();
            let x: number = bound.X ? bound.X : bound.left;
            let y: number = bound.Y ? bound.Y : bound.top;
            let width: number = bound.Width ? bound.Width : bound.width;
            let height: number = bound.Height ? bound.Height : bound.height;
            // tslint:disable-next-line:max-line-length
            context.rect((x * factor), (y * factor), (width * factor), (height * factor));
            context.globalAlpha = opacity * 0.5;
            context.closePath();
            context.fillStyle = color;
            context.msFillRule = 'nonzero';
            context.fill();
        }
        context.save();
    }

    // tslint:disable-next-line
    private renderStrikeoutAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D, factor: number): void {
        for (let i: number = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            let bound: any = this.getProperBounds(bounds[i]);
            this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factor, context);
        }
    }

    // tslint:disable-next-line
    private renderUnderlineAnnotation(bounds: any[], opacity: number, color: string, context: CanvasRenderingContext2D, factor: number): void {
        for (let i: number = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            let boundValues: any = this.getProperBounds(bounds[i]);
            this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factor, context);
        }
    }

    // tslint:disable-next-line
    private getProperBounds(bound: any): any {
        let x: number = bound.X ? bound.X : bound.left;
        let y: number = bound.Y ? bound.Y : bound.top;
        let width: number = bound.Width ? bound.Width : bound.width;
        let height: number = bound.Height ? bound.Height : bound.height;
        return { x: x, y: y, width: width, height: height };
    }

    // tslint:disable-next-line:max-line-length
    private drawLine(opacity: number, x: number, y: number, width: number, height: number, color: string, factor: number, context: CanvasRenderingContext2D): void {
        context.globalAlpha = opacity;
        context.beginPath();
        context.moveTo((x * factor), (y + height) * factor);
        context.lineTo((width + x) * factor, (y + height) * factor);
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.closePath();
        context.msFillRule = 'nonzero';
        context.stroke();
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public printTextMarkupAnnotations(textMarkupAnnotations: any, pageIndex: number, stampData: any, shapeData: any, measureShapeData: any, stickyData: any): string {
        let canvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex }) as HTMLCanvasElement;
        canvas.style.width = 816 + 'px';
        canvas.style.height = 1056 + 'px';
        let pageWidth: number = this.pdfViewerBase.pageSize[pageIndex].width;
        let pageHeight: number = this.pdfViewerBase.pageSize[pageIndex].height;
        canvas.height = pageHeight * this.pdfViewer.magnification.zoomFactor;
        canvas.width = pageWidth * this.pdfViewer.magnification.zoomFactor;
        // tslint:disable-next-line
        let textMarkupannotations: any = this.getAnnotations(pageIndex, null, '_annotations_textMarkup');
        // tslint:disable-next-line
        let shapeAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_shape');
        // tslint:disable-next-line
        let measureShapeAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_shape_measure');
        // tslint:disable-next-line
        let stampAnnotation: any = this.getAnnotations(pageIndex, null, '_annotations_stamp');
        // tslint:disable-next-line
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
        let imageSource: string = (canvas as HTMLCanvasElement).toDataURL();
        return imageSource;
    }

    /**
     * @private
     */
    public saveTextMarkupAnnotations(): string {
        // tslint:disable-next-line
        let storeTextMarkupObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        let textMarkupAnnotations: Array<any> = new Array();
        let textMarkupColorpick: ColorPicker = new ColorPicker();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            textMarkupAnnotations[j] = [];
        }
        if (storeTextMarkupObject) {
            let textMarkupAnnotationCollection: IPageAnnotations[] = JSON.parse(storeTextMarkupObject);
            for (let i: number = 0; i < textMarkupAnnotationCollection.length; i++) {
                let newArray: ITextMarkupAnnotation[] = [];
                let pageAnnotationObject: IPageAnnotations = textMarkupAnnotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.getBoundsForSave(pageAnnotationObject.annotations[z].bounds));
                        let colorString: string = textMarkupColorpick.getValue(pageAnnotationObject.annotations[z].color, 'rgba');
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
            let pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
            let deletedAnnotation: ITextMarkupAnnotation = null;
            if (pageAnnotations) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                        deletedAnnotation = pageAnnotations.splice(i, 1)[0];
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotationModule.addAction(this.selectTextMarkupCurrentPage, i, deletedAnnotation, 'Text Markup Deleted', null);
                        this.currentAnnotationIndex = i;
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(deletedAnnotation, 'textMarkup');
                        let removeDiv: HTMLElement = document.getElementById(deletedAnnotation.annotName);
                        if (removeDiv) {
                            if (removeDiv.parentElement.childElementCount === 1) {
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                            } else {
                                removeDiv.remove();
                            }
                        }
                    }
                }
                this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
                this.currentTextMarkupAnnotation = null;
                this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
                this.pdfViewerBase.isDocumentEdited = true;
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireAnnotationRemove(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, deletedAnnotation.textMarkupAnnotationType as AnnotationType);
                this.currentAnnotationIndex = null;
                this.selectTextMarkupCurrentPage = null;
                if (Browser.isDevice) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
                    this.pdfViewer.toolbarModule.showToolbar(true);
                }
            }
        }
    }

    /**
     * @private
     */
    public modifyColorProperty(color: string): void {
        if (this.currentTextMarkupAnnotation) {
            let pageAnnotations: ITextMarkupAnnotation[] = this.modifyAnnotationProperty('Color', color, null);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.pdfViewer.annotationModule.renderAnnotations(this.selectTextMarkupCurrentPage, null, null, null);
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, this.currentTextMarkupAnnotation.textMarkupAnnotationType as AnnotationType, true, false, false, false);
            this.currentAnnotationIndex = null;
        }
    }

    /**
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
                    this.pdfViewerBase.isDocumentEdited = true;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, this.currentTextMarkupAnnotation.textMarkupAnnotationType as AnnotationType, false, true, false, false);
                    this.currentAnnotationIndex = null;
                }
            }
        }
    }


    // tslint:disable-next-line
    private modifyAnnotationProperty(property: string, value: any, status: string, annotName?: string): ITextMarkupAnnotation[] {
        let pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    let date: Date = new Date();
                    if (property === 'Color') {
                        pageAnnotations[i].color = value;
                    } else {
                        pageAnnotations[i].opacity = value;
                    }
                    pageAnnotations[i].modifiedDate = date.toLocaleString();
                    this.currentAnnotationIndex = i;
                    if (status === null || status === 'changed') {
                        // tslint:disable-next-line:max-line-length
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
     * @private
     */
    public undoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void {
        let pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(pageAnnotations[index], 'textMarkup');
                // tslint:disable-next-line
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
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(pageNumber, annotation.shapeAnnotationType);
                pageAnnotations.splice(index, 0, annotation);
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
    }

    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public undoRedoPropertyChange(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, property: string, isUndoAction?: boolean): ITextMarkupAnnotation {
        let pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (property === 'Color') {
                let tempColor: string = pageAnnotations[index].color;
                pageAnnotations[index].color = annotation.color;
                annotation.color = tempColor;
            } else {
                let tempOpacity: number = pageAnnotations[index].opacity;
                pageAnnotations[index].opacity = annotation.opacity;
                annotation.opacity = tempOpacity;
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotation, null, true);
            if (isUndoAction) {
                annotation.modifiedDate = new Date().toLocaleString();
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
        return annotation;
    }

    /**
     * @private
     */
    public redoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void {
        let pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(pageNumber, annotation.shapeAnnotationType);
                pageAnnotations.push(annotation);
            } else if (action === 'Text Markup Deleted') {
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(pageAnnotations[index], 'textMarkup');
                // tslint:disable-next-line
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
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
    }

    /**
     * @private
     */
    public saveNoteContent(pageNumber: number, note: string): void {
        let pageAnnotations: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    pageAnnotations[i].note = note;
                }
            }
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewerBase.isDocumentEdited = true;
    }

    private clearCurrentAnnotation(): void {
        this.selectTextMarkupCurrentPage = null;
        this.currentTextMarkupAnnotation = null;
        let isSkip: boolean = false;
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.isInuptBoxInFocus) {
            isSkip = true;
        }
        if (!isSkip) {
            this.enableAnnotationPropertiesTool(false);
        }
    }

    /**
     * @private
     */
    public clearCurrentAnnotationSelection(pageNumber: number, isSelect?: boolean): void {
        if (isSelect) {
            this.isAnnotationSelect = true;
        } else {
            this.isAnnotationSelect = false;
        }
        let lowerPageIndex: number = (pageNumber - 2) >= 0 ? (pageNumber - 2) : 0;
        // tslint:disable-next-line:max-line-length
        let higherPageIndex: number = (pageNumber + 2) < this.pdfViewerBase.pageCount ? (pageNumber + 2) : this.pdfViewerBase.pageCount - 1;
        for (let k: number = lowerPageIndex; k <= higherPageIndex; k++) {
            this.clearAnnotationSelection(k);
        }
    }

    // tslint:disable-next-line
    private getBoundsForSave(bounds: any): any {
        // tslint:disable-next-line
        let newArray: any[] = [];
        for (let i: number = 0; i < bounds.length; i++) {
            let left: number = bounds[i].left ? bounds[i].left : bounds[i].Left;
            let top: number = bounds[i].top ? bounds[i].top : bounds[i].Top;
            let height: number = bounds[i].height ? bounds[i].height : bounds[i].Height;
            let width: number = bounds[i].width ? bounds[i].width : bounds[i].Width;
            newArray.push({ left: left, top: top, width: width, height: height });
        }
        return newArray;
    }

    // tslint:disable-next-line
    private getRgbCode(colorString: string): any {
        let markupStringArray: string[] = colorString.split(',');
        // tslint:disable-next-line:radix
        let textMarkupR: number = parseInt(markupStringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        let textMarkupG: number = parseInt(markupStringArray[1]);
        // tslint:disable-next-line:radix
        let textMarkupB: number = parseInt(markupStringArray[2]);
        // tslint:disable-next-line:radix
        let textMarkupA: number = parseInt(markupStringArray[3]);
        return { a: textMarkupA * 255, r: textMarkupR, g: textMarkupG, b: textMarkupB };
    }

    private getDrawnBounds(): IPageAnnotationBounds[] {
        let pageBounds: IPageAnnotationBounds[] = [];
        let selection: Selection = window.getSelection();
        if (selection.anchorNode !== null) {
            let range: Range = document.createRange();
            let isBackWardSelection: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode === selection.focusNode) {
                let pageId: number = this.pdfViewerBase.textLayer.getPageIndex(selection.anchorNode);
                if (!isNaN(pageId)) {
                    let pageRect: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + pageId).getBoundingClientRect();
                    if (isBackWardSelection) {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    } else {
                        if (selection.anchorOffset < selection.focusOffset) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        } else {
                            range.setStart(selection.focusNode, selection.focusOffset);
                            range.setEnd(selection.anchorNode, selection.anchorOffset);
                        }
                    }
                    let boundingRect: ClientRect = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let rectangle: IRectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                    let rectangleArray: IRectangle[] = [];
                    rectangleArray.push(rectangle);
                    // tslint:disable-next-line
                    let rect: any = { left: rectangle.left, top: rectangle.top, right: rectangle.right, bottom: rectangle.bottom };
                    pageBounds.push({ pageIndex: pageId, bounds: rectangleArray, rect: rect });
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
                let anchorPageId: number = this.pdfViewerBase.textLayer.getPageIndex(startNode);
                let anchorTextId: number = this.pdfViewerBase.textLayer.getTextIndex(startNode, anchorPageId);
                let focusPageId: number = this.pdfViewerBase.textLayer.getPageIndex(endNode);
                let focusTextId: number = this.pdfViewerBase.textLayer.getTextIndex(endNode, focusPageId);
                let startOffset: number = 0; let endOffset: number = 0; let currentId: number = 0;
                for (let i: number = anchorPageId; i <= focusPageId; i++) {
                    let selectionRects: IRectangle[] = [];
                    let pageStartId: number; let pageEndId: number; let pageStartOffset: number; let pageEndOffset: number;
                    let textDivs: NodeList = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                    let pageRect: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + i).getBoundingClientRect();
                    if (i === anchorPageId) {
                        currentId = anchorTextId;
                    } else {
                        currentId = 0;
                    }
                    for (let j: number = currentId; j < textDivs.length; j++) {
                        let textElement: HTMLElement = textDivs[j] as HTMLElement;
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
                            let node: Node = textElement.childNodes[k];
                            range.setStart(node, startOffset);
                            range.setEnd(node, endOffset);
                        }
                        let boundingRect: ClientRect = range.getBoundingClientRect();
                        // tslint:disable-next-line:max-line-length
                        let rectangle: IRectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                        selectionRects.push(rectangle);
                        range.detach();
                        if (i === focusPageId && j === focusTextId) {
                            break;
                        }
                    }
                    let startElementNode: Node = this.pdfViewerBase.getElement('_text_' + i + '_' + pageStartId).childNodes[0];
                    let endElementNode: Node = this.pdfViewerBase.getElement('_text_' + i + '_' + pageEndId).childNodes[0];
                    let pageRange: Range = document.createRange();
                    pageRange.setStart(startElementNode, pageStartOffset);
                    pageRange.setEnd(endElementNode, pageEndOffset);
                    let pageRectBounds: ClientRect = pageRange.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let pageRectangle: IRectangle = { left: this.getDefaultValue(pageRectBounds.left - pageRect.left), top: this.getDefaultValue(pageRectBounds.top - pageRect.top), width: this.getDefaultValue(pageRectBounds.width), height: this.getDefaultValue(pageRectBounds.height), right: this.getDefaultValue(pageRectBounds.right - pageRect.left), bottom: this.getDefaultValue(pageRectBounds.bottom - pageRect.top) };
                    // tslint:disable-next-line
                    let rect: any = { left: pageRectangle.left, top: pageRectangle.top, right: pageRectangle.right, bottom: pageRectangle.bottom };
                    pageBounds.push({ pageIndex: i, bounds: selectionRects, rect: rect });
                }
            }
        }
        selection.removeAllRanges();
        return pageBounds;
    }

    /**
     * @private
     */
    public rerenderAnnotationsPinch(pageNumber: number): void {
        let annotCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (annotCanvas) {
            let oldAnnotCanvas: HTMLElement = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
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
            (annotCanvas as HTMLCanvasElement).width = this.pdfViewerBase.pageSize[pageNumber].width * this.pdfViewerBase.getZoomFactor();
            (annotCanvas as HTMLCanvasElement).height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
            this.renderTextMarkupAnnotations(null, pageNumber, annotCanvas, this.pdfViewerBase.getZoomFactor());
        }
    }

    /**
     * @private
     */
    public rerenderAnnotations(pageNumber: number): void {
        let oldCanvas: HTMLElement = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
        if (oldCanvas) {
            oldCanvas.parentElement.removeChild(oldCanvas);
        }
        let newCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (newCanvas) {
            newCanvas.style.display = 'block';
        }
    }

    /**
     * @private
     */
    public onTextMarkupAnnotationMouseUp(event: MouseEvent): void {
        let pageNumber: number = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            let currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageNumber, canvas);
            if (currentAnnot) {
                this.selectAnnotation(currentAnnot, canvas, pageNumber);
                this.currentTextMarkupAnnotation = currentAnnot;
                this.selectTextMarkupCurrentPage = pageNumber;
                this.enableAnnotationPropertiesTool(true);
                let commentPanelDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (commentPanelDiv && commentPanelDiv.style.display === 'block') {
                    // tslint:disable-next-line
                    let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                    if (accordionExpand) {
                        accordionExpand.ej2_instances[0].expandItem(true);
                    }
                    // tslint:disable-next-line
                    let comments: any = document.getElementById(currentAnnot.annotName);
                    if (comments) {
                        comments.firstChild.click();
                    }
                }
                if (this.pdfViewer.toolbarModule) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                    this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                }
            } else {
                this.clearCurrentAnnotation();
            }
            this.clearCurrentAnnotationSelection(pageNumber);
        } else {
            if (!this.pdfViewerBase.isClickedOnScrollBar(event, true)) {
                this.clearCurrentAnnotation();
                this.clearCurrentAnnotationSelection(pageNumber);
            }
        }
    }

    /**
     * @private
     */
    public onTextMarkupAnnotationTouchEnd(event: TouchEvent): void {
        let pageNumber: number = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            this.clearCurrentAnnotationSelection(pageNumber);
            let touchCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            // tslint:disable-next-line:max-line-length
            let currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.touches[0].clientX, event.touches[0].clientY, pageNumber, touchCanvas);
            if (currentAnnot) {
                this.selectAnnotation(currentAnnot, touchCanvas, pageNumber);
                this.currentTextMarkupAnnotation = currentAnnot;
                this.selectTextMarkupCurrentPage = pageNumber;
                this.enableAnnotationPropertiesTool(true);
                // tslint:disable-next-line
                let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                if (accordionExpand) {
                    accordionExpand.ej2_instances[0].expandItem(true);
                }
                // tslint:disable-next-line
                let comments: any = document.getElementById(currentAnnot.annotName);
                if (comments) {
                    comments.firstChild.click();
                }
            } else {
                this.clearCurrentAnnotation();
            }
            this.clearCurrentAnnotationSelection(pageNumber);
        } else if (this.selectTextMarkupCurrentPage != null && Browser.isDevice) {
            let number: number = this.selectTextMarkupCurrentPage;
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
    public onTextMarkupAnnotationMouseMove(event: MouseEvent): void {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        // tslint:disable-next-line
        let pageIndex: number = parseInt(eventTarget.id.split('_text_')[1]) || parseInt(eventTarget.id.split('_textLayer_')[1]) || parseInt(eventTarget.id.split('_annotationCanvas_')[1]);
        if (pageIndex) {
            let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
            let currentAnnot: ITextMarkupAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageIndex, canvas);
            if (currentAnnot) {
                eventTarget.style.cursor = 'pointer';
                // this.showPopupNote(event, currentAnnot);
            } else {
                this.pdfViewer.annotationModule.hidePopupNote();
                if (this.pdfViewerBase.isPanMode && !this.pdfViewerBase.getAnnotationToolStatus()) {
                    eventTarget.style.cursor = 'grab';
                } else {
                    eventTarget.style.cursor = 'auto';
                }
            }
        }
    }

    // tslint:disable-next-line
    private showPopupNote(event: any, annotation: ITextMarkupAnnotation): void {
        if (annotation.note) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.showPopupNote(event, annotation.color, annotation.author, annotation.note, annotation.textMarkupAnnotationType);
        }
    }

    private getCurrentMarkupAnnotation(clientX: number, clientY: number, pageNumber: number, canvas: HTMLElement): ITextMarkupAnnotation {
        let currentTextMarkupAnnotations: ITextMarkupAnnotation[] = [];
        let canvasParentPosition: ClientRect = canvas.parentElement.getBoundingClientRect();
        let leftClickPosition: number = clientX - canvasParentPosition.left;
        let topClickPosition: number = clientY - canvasParentPosition.top;
        let annotationList: ITextMarkupAnnotation[] = this.getAnnotations(pageNumber, null);
        let isAnnotationGot: boolean = false;
        if (annotationList) {
            for (let i: number = 0; i < annotationList.length; i++) {
                let annotation: ITextMarkupAnnotation = annotationList[i];
                for (let j: number = 0; j < annotation.bounds.length; j++) {
                    // tslint:disable-next-line
                    let bound: any = annotation.bounds[j];
                    let left: number = bound.left ? bound.left : bound.Left;
                    let top: number = bound.top ? bound.top : bound.Top;
                    let width: number = bound.width ? bound.width : bound.Width;
                    let height: number = bound.height ? bound.height : bound.Height;
                    // tslint:disable-next-line:max-line-length
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
    }

    private compareCurrentAnnotations(annotations: ITextMarkupAnnotation[]): ITextMarkupAnnotation {
        let previousX: number;
        let currentAnnotation: ITextMarkupAnnotation = null;
        for (let i: number = 0; i < annotations.length; i++) {
            if (i === annotations.length - 1) {
                break;
            }
            // tslint:disable-next-line
            let firstAnnotBounds: any = annotations[i].bounds;
            let firstXposition: number = firstAnnotBounds[0].left ? firstAnnotBounds[0].left : firstAnnotBounds[0].Left;
            let firstYposition: number = firstAnnotBounds[0].top ? firstAnnotBounds[0].top : firstAnnotBounds[0].Top;
            // tslint:disable-next-line
            let secondAnnotBounds: any = annotations[i + 1].bounds;
            let secondXposition: number = secondAnnotBounds[0].left ? secondAnnotBounds[0].left : secondAnnotBounds[0].Left;
            let secondYposition: number = secondAnnotBounds[0].top ? secondAnnotBounds[0].top : secondAnnotBounds[0].Top;
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
     * @private
     */
    public clearAnnotationSelection(pageNumber: number): void {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            let context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setLineDash([]);
            this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
        }
    }

    /**
     * @private
     */
    public selectAnnotation(annotation: ITextMarkupAnnotation, canvas: HTMLElement, pageNumber?: number): void {
        if (this.pdfViewer.selectedItems.annotations[0]) {
            this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
            this.pdfViewer.clearSelection(this.selectTextMarkupCurrentPage);
        }
        let isCurrentTextMarkup: boolean = false;
        if (!this.currentTextMarkupAnnotation) {
            isCurrentTextMarkup = true;
        }
        if (!isNaN(pageNumber)) {
            this.currentTextMarkupAnnotation = annotation;
            this.selectTextMarkupCurrentPage = pageNumber;
        }
        for (let i: number = 0; i < annotation.bounds.length; i++) {
            // tslint:disable-next-line
            let bound: any = annotation.bounds[i];
            let x: number = bound.left ? bound.left : bound.Left;
            let y: number = bound.top ? bound.top : bound.Top;
            let width: number = bound.width ? bound.width : bound.Width;
            let height: number = bound.height ? bound.height : bound.Height;
            // tslint:disable-next-line:max-line-length
            this.drawAnnotationSelectRect(canvas, this.getMagnifiedValue(x - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(y - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(width + 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(height + 0.5, this.pdfViewerBase.getZoomFactor()));
        }
        if (annotation.annotName !== '') {
            if (isCurrentTextMarkup) {
                this.pdfViewer.annotationModule.selectAnnotation(annotation.annotName, this.selectTextMarkupCurrentPage, annotation);
            }
        }
    }

    private drawAnnotationSelectRect(canvas: HTMLElement, x: number, y: number, width: number, height: number): void {
        let context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.beginPath();
        context.setLineDash([4 * this.pdfViewerBase.getZoomFactor()]);
        context.globalAlpha = 1;
        context.rect(x, y, width, height);
        context.closePath();
        context.strokeStyle = '#0000ff';
        context.stroke();
        context.save();
    }

    /**
     * @private
     */
    public enableAnnotationPropertiesTool(isEnable: boolean): void {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(isEnable);
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule.isMobileAnnotEnabled && this.pdfViewer.selectedItems.annotations.length === 0) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(isEnable);
                let enable: boolean = isEnable;
                if (this.isTextMarkupAnnotationMode) {
                    enable = true;
                }
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(enable);
                if (this.currentTextMarkupAnnotation) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, this.currentTextMarkupAnnotation.color);
                } else {
                    if (!this.isTextMarkupAnnotationMode) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, '#000000');
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
            let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + this.selectTextMarkupCurrentPage);
            if (canvas) {
                this.selectAnnotation(this.currentTextMarkupAnnotation, canvas, this.selectTextMarkupCurrentPage);
            }
        }
    }

    // private storeAnnotations(pageNumber: number, annotation: ITextMarkupAnnotation): number {
    //     // tslint:disable-next-line
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

    private manageAnnotations(pageAnnotations: ITextMarkupAnnotation[], pageNumber: number): void {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
    }

    // tslint:disable-next-line
    private getAnnotations(pageIndex: number, textMarkupAnnotations: any[], id?: string): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        if (id == null || id == undefined) {
            id = '_annotations_textMarkup';
        }
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + id);
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
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

    // tslint:disable-next-line
    private getAddedAnnotation(type: string, color: string, opacity: number, bounds: any, author: string, subject: string, predefinedDate: string, note: string, rect: any, pageNumber: number): ITextMarkupAnnotation {
        let date: Date = new Date();
        // tslint:disable-next-line:max-line-length
        let modifiedDate: string = predefinedDate ? predefinedDate : date.toLocaleString();
        let annotationName: string = this.pdfViewer.annotation.createGUID();
        let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('textMarkup', pageNumber + 1, type);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        let annotation: ITextMarkupAnnotation = {
            // tslint:disable-next-line:max-line-length
            textMarkupAnnotationType: type, color: color, opacity: opacity, bounds: bounds, author: author, subject: subject, modifiedDate: modifiedDate, note: note, rect: rect,
            annotName: annotationName, comments: [], review: { state: '', stateModel: '', author: author, modifiedDate: modifiedDate }, shapeAnnotationType: 'textMarkup'
        };
        if (document.getElementById(annotationName)) {
            document.getElementById(annotationName).addEventListener('mouseup', this.annotationDivSelect(annotation, pageNumber));
        }
        let storedIndex: number = this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotation, '_annotations_textMarkup');
        this.pdfViewer.annotationModule.addAction(pageNumber, storedIndex, annotation, 'Text Markup Added', null);
        return annotation;
    }

    // tslint:disable-next-line
    private annotationDivSelect(annotation: any, pageNumber: number): any {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        this.selectAnnotation(annotation, canvas, pageNumber);
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.clearShapeMode();
                this.pdfViewer.toolbarModule.annotationToolbarModule.clearMeasureMode();
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(true);
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
            }
        }
    }

    private getPageContext(pageNumber: number): CanvasRenderingContext2D {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
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
     * @private
     */
    // tslint:disable-next-line
    public saveImportedTextMarkupAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: ITextMarkupAnnotation = null;
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('textMarkup', annotation.Subject);
        // tslint:disable-next-line:max-line-length
        annotationObject = { textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect,
            annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, shapeAnnotationType: 'textMarkup'
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_textMarkup');
    }

    /**
     * @private
     */
    public clear(): void {
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
    }
}