/* eslint-disable */
import { StickyNotesSettings } from './../pdfviewer';
import { PdfViewerBase, PdfViewer, IPageAnnotations, AjaxHandler, AllowedInteraction, IPoint } from '../index';
import { createElement, Browser, Internationalization, isBlazor } from '@syncfusion/ej2-base';
import { Accordion, BeforeOpenCloseMenuEventArgs, ContextMenu as Context, MenuItemModel } from '@syncfusion/ej2-navigations';
import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { cloneObject } from '../drawing/drawing-util';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
import { BeginEditEventArgs } from '@syncfusion/ej2-inplace-editor';
/**
 * @hidden
 */
export interface IPopupAnnotation {
    shapeAnnotationType: string
    pathData: string
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
    state: string;
    stateModel: string
    comments: ICommentsCollection[]
    review: IReviewCollection
    annotName: string
    annotationSelectorSettings: AnnotationSelectorSettingsModel
    customData: object
    // eslint-disable-next-line
    annotationSettings: any;
    allowedInteractions: AllowedInteraction
    isPrint: boolean
    isCommentLock: boolean
}

/**
 * @hidden
 */
export interface ICommentsCollection {
    author: string
    modifiedDate: string
    annotName: string
    subject: string
    parentId: string
    note: string
    state: string
    stateModel: string
    comments: ICommentsCollection[]
    review: IReviewCollection
    shapeAnnotationType: string
    position?: number
    isLock: boolean
}

/**
 * @hidden
 */
export interface IReviewCollection {
    author: string
    state: string
    stateModel: string
    modifiedDate: string
    annotId?: string
}

/**
 * StickyNotes module
 */
export class StickyNotesAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private accordionContent: HTMLElement;
    private accordionPageContainer: HTMLElement;
    private accordionContentContainer: HTMLElement;
    private commentsContainer: HTMLElement;
    private commentMenuObj: Context;
    private commentsCount: number = 0;
    private commentsreplyCount: number = 0;
    private commentContextMenu: MenuItemModel[] = [];
    private isAccordionContainer: boolean = true;
    private isSetAnnotationType: boolean;
    private isNewcommentAdded: boolean;
    private isCreateContextMenu: boolean = false;
    private commentsRequestHandler: AjaxHandler;
    // eslint-disable-next-line
    private selectAnnotationObj: any;
    private isCommentsSelected: boolean = false;
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;
    /**
     * @private
     */
    public isEditableElement: boolean = false;
    /**
     * @private
     */
    public accordionContainer: HTMLElement;
    /**
     * @private
     */
    public mainContainer: HTMLElement;
    /**
     * @private
     */
    public opacity: number;
    private isPageCommentsRendered: boolean = false;
    private isCommentsRendered: boolean = false;
    /**
     * @private
     */
    public isAnnotationRendered: boolean = false;
    private globalize: Internationalization;

    /**
     * @param pdfViewer
     * @param pdfViewerBase
     * @param pdfViewer
     * @param pdfViewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.opacity = this.pdfViewer.stickyNotesSettings.opacity ? this.pdfViewer.stickyNotesSettings.opacity : 1;
    }

    /**
     * @param stickyAnnotations
     * @param pageNumber
     * @param canvas
     * @private
     */
    // eslint-disable-next-line
    public renderStickyNotesAnnotations(stickyAnnotations: any, pageNumber: number, canvas?: any): void {
        if (stickyAnnotations) {
            if (stickyAnnotations.length > 0) {
                for (let i: number = 0; i < stickyAnnotations.length; i++) {
                    // eslint-disable-next-line
                    let annotation: any = stickyAnnotations[i];
                    let isAdded: boolean= false;
                    // eslint-disable-next-line
                    let pageAnnotations: any = this.getAnnotations(pageNumber, null, 'sticky');
                    if (pageAnnotations !== null) {
                        for (let k: number = 0; k < pageAnnotations.length; k++) {
                            let annotationName: string = annotation.annotName ? annotation.annotName : annotation.AnnotName;
                            let pageAnnotationName: string = pageAnnotations[k].annotName ? pageAnnotations[k].annotName : pageAnnotations[k].AnnotName;
                            if (pageAnnotationName && annotationName && pageAnnotationName === annotationName) {
                                isAdded = true;
                                break;
                            }
                        }
                    }
                    if (!isAdded) {
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        let annotationObject: IPopupAnnotation = null;
                        // eslint-disable-next-line
                        let position: any = annotation.Bounds;
                        const author: string = annotation.Author;
                        // eslint-disable-next-line max-len
                        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                        annotation.allowedInteractions = annotation.AllowedInteraction ? annotation.AllowedInteraction : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                        let isPrint: boolean = true;
                        if (annotation.annotationAddMode === 'Imported Annotation') {
                            isPrint = annotation.IsPrint;
                        } else {
                            isPrint = annotation.AnnotationSettings.isPrint;
                        }
                        if (annotation.IsLock) {
                            annotation.AnnotationSettings.isLock = annotation.IsLock;
                        }
                        annotationObject = {
                            // eslint-disable-next-line max-len
                            shapeAnnotationType: 'sticky', author: author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, note: annotation.Note, opacity: annotation.Opacity, state: annotation.State, stateModel: annotation.StateModel,
                            pathData: '', comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: author },
                            // eslint-disable-next-line max-len
                            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
                            annotName: annotation.AnnotName, color: annotation.color,
                            annotationSelectorSettings: this.getSettings(annotation),
                            customData: this.pdfViewer.annotation.getCustomData(annotation),
                            annotationSettings: annotation.AnnotationSettings, allowedInteractions: annotation.allowedInteractions,
                            isPrint: isPrint, isCommentLock: annotation.IsCommentLock
                        };
                        let annot: PdfAnnotationBaseModel;
                        // eslint-disable-next-line max-len
                        annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                        annot = {
                            // eslint-disable-next-line max-len
                            author: author, modifiedDate: annotationObject.modifiedDate, annotName: annotationObject.annotName, pageIndex: pageNumber, bounds: { x: position.Left, y: position.Top, width: position.Width, height: position.Height }, strokeColor: 'transparent', stampStrokeColor: '', data: this.setImageSource(), shapeAnnotationType: 'StickyNotes',
                            subject: annotationObject.subject, notes: annotationObject.note, opacity: annotationObject.opacity, id: annotationObject.annotName, fillColor: annotationObject.color,
                            annotationSelectorSettings: annotation.AnnotationSelectorSettings,
                            annotationSettings: annotationObject.annotationSettings,
                            // eslint-disable-next-line max-len
                            annotationAddMode: annotation.annotationAddMode, isPrint: isPrint, isCommentLock: annotationObject.isCommentLock
                        };
                        if (canvas) {
                            this.drawStickyNotes(position.Left, position.Top, position.Width, position.Height, pageNumber, annot, canvas);
                        } else {
                            this.pdfViewer.add(annot as PdfAnnotationBase);
                            this.drawStickyNotes(position.Left, position.Top, position.Width, position.Height, pageNumber, annot);
                            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_sticky');
                        }
                        if(this.isAddAnnotationProgramatically)
                        {
                            // eslint-disable-next-line
                            let settings: any = {
                                opacity: annot.opacity, borderColor: annot.strokeColor, borderWidth: annot.thickness, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                                // eslint-disable-next-line
                                fillColor: annot.fillColor, fontSize: annot.fontSize, width: annot.bounds.width, height: annot.bounds.height, fontColor: annot.fontColor, fontFamily: annot.fontFamily, defaultText: annot.dynamicText, fontStyle: annot.font, textAlignment: annot.textAlign
                            };
                            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'StickyNotes', annot.bounds, settings);
                        }
                    }
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
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        } else if (this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.stickyNotesSettings.annotationSelectorSettings;
        }
        return selector;
    }
    /**
     * @param X
     * @param Y
     * @param width
     * @param height
     * @param pageIndex
     * @param annotation
     * @param canvas
     * @param X
     * @param Y
     * @param width
     * @param height
     * @param pageIndex
     * @param annotation
     * @param canvas
     * @param X
     * @param Y
     * @param width
     * @param height
     * @param pageIndex
     * @param annotation
     * @param canvas
     * @private
     */
    // eslint-disable-next-line
    public drawStickyNotes(X: number, Y: number, width: number, height: number, pageIndex: number, annotation: any, canvas?: any): any {
        let annot: PdfAnnotationBaseModel;
        let annotationObject: IPopupAnnotation = null;
        const image: HTMLImageElement = new Image();
        // eslint-disable-next-line
        let proxy: any = this;
        image.onload = (): void => {
            let commentsDivid: string;
            let annotationName: string;
            // eslint-disable-next-line max-len
            const author: string = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author;
            if (annotation) {
                annot = {
                    // eslint-disable-next-line max-len
                    author: annotation.author, modifiedDate: annotation.modifiedDate, annotName: annotation.annotName, data: image.src, bounds: { x: X, y: Y, width: width, height: height }, subject: annotation.subject,
                    notes: annotation.notes, opacity: annotation.opacity, id: annotation.annotName, shapeAnnotationType: 'StickyNotes', strokeColor: 'transparent', stampStrokeColor: '', pageIndex: annotation.pageIndex, isPrint: annotation.isPrint
                };
            } else {
                annotationName = this.pdfViewer.annotation.createGUID();
                commentsDivid = proxy.addComments('sticky', pageIndex + 1);
                if (commentsDivid) {
                    document.getElementById(commentsDivid).id = annotationName;
                }
                // eslint-disable-next-line
                let annotationSelectorSettings: any = this.pdfViewer.stickyNotesSettings.annotationSelectorSettings ? this.pdfViewer.stickyNotesSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                const isPrint: boolean = this.pdfViewer.stickyNotesSettings.isPrint;
                annot = {
                    // eslint-disable-next-line max-len
                    bounds: { x: X, y: Y, width: width, height: height }, pageIndex: pageIndex, data: image.src, modifiedDate: this.getDateAndTime(),
                    shapeAnnotationType: 'StickyNotes', strokeColor: 'transparent', stampStrokeColor: '', annotName: annotationName, id: annotationName, opacity: this.opacity, isPrint: isPrint
                };
                // eslint-disable-next-line max-len
                const isLock: boolean = this.pdfViewer.stickyNotesSettings.isLock ? this.pdfViewer.stickyNotesSettings.isLock : this.pdfViewer.annotationSettings.isLock;
                // eslint-disable-next-line
                let allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                annotationObject = {
                    // eslint-disable-next-line max-len
                    author: author, allowedInteractions: allowedInteractions, modifiedDate: this.getDateAndTime(), subject: 'Sticky Note', shapeAnnotationType: 'sticky',
                    // eslint-disable-next-line max-len
                    note: '', opacity: this.opacity, pathData: '', state: '', stateModel: '', color: 'rgba(255,255,0)', comments: [], annotName: annotationName,
                    // eslint-disable-next-line max-len
                    bounds: { left: X, top: Y, width: width, height: height }, review: { state: '', stateModel: '', modifiedDate: '', author: author },
                    annotationSelectorSettings: annotationSelectorSettings,
                    // eslint-disable-next-line max-len
                    customData: this.pdfViewer.annotationModule.getData('sticky'), annotationSettings: { isLock: isLock }, isPrint: isPrint, isCommentLock: false
                };
            }
            if (!annotation) {
                 // eslint-disable-next-line max-len
                 proxy.pdfViewer.annotation.addAction(pageIndex, null, annot as PdfAnnotationBase, 'Addition', '', annot as PdfAnnotationBase, annot);
                proxy.pdfViewer.add(annot as PdfAnnotationBase);
                proxy.pdfViewer.annotationModule.storeAnnotations(pageIndex, annotationObject, '_annotations_sticky');
            }
            if (proxy.pdfViewerBase.isAddComment) {
                // eslint-disable-next-line max-len
                // eslint-disable-next-line
                let bounds: any = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                // eslint-disable-next-line
                let settings: any = { opacity: annot.opacity, author: author, modifiedDate: annot.modifiedDate, subject: annot.shapeAnnotationType };
                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'StickyNotes', bounds, settings);
            }
            if (canvas) {
                // eslint-disable-next-line
                proxy.pdfViewer.renderDrawing(canvas as any, pageIndex);
            } else {
                // eslint-disable-next-line
                let canvass: any = document.getElementById(proxy.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                // eslint-disable-next-line
                proxy.pdfViewer.renderDrawing(canvass as any, pageIndex);
            }
            if (Browser.isDevice) {
                proxy.pdfViewer.select([annot.id], annot.annotationSelectorSettings);
            }
            proxy.pdfViewerBase.isAddComment = false;
        };
        image.src = this.setImageSource();
    }

    private setImageSource(): string {
        // eslint-disable-next-line max-len
        const imageSource: string = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgd2lkdGg9IjE2IgogICBoZWlnaHQ9IjE1IgogICB2aWV3Qm94PSIwIDAgNC4yMzMzMzMxIDMuOTY4NzQ5NyIKICAgdmVyc2lvbj0iMS4xIj4KICA8ZyBpZD0ibGF5ZXIxIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDMuODM4OSwwLjk0MTY3IEMgMy42NTM5LDAuNzAzNjcgMy40MTU5LDAuNTE3NjcgMy4xMjQ5LDAuMzg1NjcgMi44MDc5LDAuMjUzNjcgMi40ODk5LDAuMTczNjcgMi4xMTk5LDAuMTczNjcgMS43NDg5LDAuMTczNjcgMS40MzE5LDAuMjUzNjcgMS4xMTQyLDAuMzg1NjcgMC44MjMxNiwwLjUxNzY3IDAuNTg1MTYsMC43MDM2NyAwLjQwMDE2LDAuOTQxNjcgMC4yMTUxNiwxLjE3OTcgMC4xMzUxNiwxLjQxNzcgMC4xMzUxNiwxLjcwODcgMC4xMzUxNiwxLjk0NjcgMC4xODgxNiwyLjE1ODcgMC4zMjAxNiwyLjM0MzcgMC40NTMxNiwyLjU1NTcgMC42MTExNiwyLjcxMzcgMC44MjMxNiwyLjg0NjcgMC43OTIxNiwzLjE1NDcgMC42NTAxNiwzLjM4MjcgMC40NzkxNiwzLjU4NzcgMC40MjgxNiwzLjY2NzcgMC41MTcxNiwzLjc0MTcgMC42OTExNiwzLjcxOTcgMS4wODgyLDMuNjM5NyAxLjQwNDksMy40NTQ3IDEuNjQyOSwzLjE2MzcgMS44MDE5LDMuMTkwNyAxLjk2MDksMy4yMTY3IDIuMTE5OSwzLjIxNjcgMi40ODk5LDMuMjE2NyAyLjgwNzksMy4xMzc3IDMuMTI0OSwzLjAwNTcgMy40MTU5LDIuODcyNyAzLjY4MDksMi42ODc3IDMuODM4OSwyLjQ0OTcgNC4wMjQ5LDIuMjExNyA0LjEwMzksMS45NzM3IDQuMTAzOSwxLjY4MjcgNC4xMDM5LDEuNDE3NyA0LjAyNDksMS4xNTI3IDMuODM4OSwwLjk0MTY3IFoiCiAgICAgICBpZD0icGF0aDE1MjQiCiAgICAgICBzdHlsZT0iZmlsbDojZmZmNzAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDowLjI2NDU4MztzdHJva2Utb3BhY2l0eToxIiAvPgogICAgPHBhdGgKICAgICAgIGQ9Ik0gMy4wNDI5LDEuNDE2NyBIIDEuMTkxMiBDIDEuMTExMiwxLjQxNjcgMS4wNTkyLDEuMzYzNyAxLjA1OTIsMS4yODM3IDEuMDU5MiwxLjIwNDcgMS4xMTEyLDEuMTUxNyAxLjE5MTIsMS4xNTE3IEggMy4wNDI5IEMgMy4xMjE5LDEuMTUxNyAzLjE3NDksMS4yMDQ3IDMuMTc0OSwxLjI4MzcgMy4xNzQ5LDEuMzYzNyAzLjEyMTksMS40MTY3IDMuMDQyOSwxLjQxNjcgWiIKICAgICAgIGlkPSJwYXRoMTUzNiIKICAgICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MC4yNjQ1ODMiIC8+CiAgICA8cGF0aAogICAgICAgZD0iTSAzLjA0MjksMS45NDU3IEggMS4xOTEyIEMgMS4xMTEyLDEuOTQ1NyAxLjA1OTIsMS44OTI3IDEuMDU5MiwxLjgxMjcgMS4wNTkyLDEuNzMzNyAxLjExMTIsMS42ODA3IDEuMTkxMiwxLjY4MDcgSCAzLjA0MjkgQyAzLjEyMTksMS42ODA3IDMuMTc0OSwxLjczMzcgMy4xNzQ5LDEuODEyNyAzLjE3NDksMS44OTI3IDMuMTIxOSwxLjk0NTcgMy4wNDI5LDEuOTQ1NyBaIgogICAgICAgaWQ9InBhdGgxNTQwIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjI2NDU4MyIgLz4KICA8L2c+Cjwvc3ZnPgo=';
        return imageSource;
    }

    /**
     * @private
     */
    public createRequestForComments(): void {
        let jsonObject: object;
        const proxy: StickyNotesAnnotation = this;
        const startIndex: number = 0;
        const pageLimit: number = 20;
        let pageCount: number = proxy.pdfViewerBase.pageCount;
        if (!proxy.isCommentsRendered) {
            if (pageLimit < pageCount) {
                pageCount = pageLimit;
            } else {
                proxy.isPageCommentsRendered = true;
            }
        }
        if (!this.isCommentsRendered) {
            // eslint-disable-next-line max-len
            jsonObject = { pageStartIndex: startIndex, pageEndIndex: pageCount, hashId: this.pdfViewerBase.hashId, action: 'RenderAnnotationComments', elementId: this.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
            proxy.isCommentsRendered = true;
        } else {
            // eslint-disable-next-line max-len
            jsonObject = { pageStartIndex: pageLimit, pageEndIndex: pageCount, hashId: this.pdfViewerBase.hashId, action: 'RenderAnnotationComments', elementId: this.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        }
        if (this.pdfViewerBase.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        const url: string = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderComments;
        proxy.commentsRequestHandler = new AjaxHandler(proxy.pdfViewer);
        proxy.commentsRequestHandler.url = url;
        proxy.commentsRequestHandler.mode = true;
        proxy.commentsRequestHandler.responseType = 'text';
        proxy.commentsRequestHandler.send(jsonObject);
        // eslint-disable-next-line
        proxy.commentsRequestHandler.onSuccess = function (result: any) {
            // eslint-disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                        if (typeof data !== 'object') {
                            data = JSON.parse(data);
                        }
                        if (typeof data !== 'object') {
                            proxy.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.renderComments);
                            data = null;
                        }
                    } catch (error) {
                        proxy.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.renderComments);
                        data = null;
                    }
                }
                if (data) {
                    let isInitialRender: boolean = false;
                    if (proxy.pdfViewerBase.annotationComments) {
                        // eslint-disable-next-line
                        proxy.pdfViewerBase.annotationComments = data.annotationDetails;
                    } else {
                        proxy.pdfViewerBase.annotationComments = data.annotationDetails;
                        isInitialRender = true;
                    }
                    if (data.annotationDetails && data.uniqueId === proxy.pdfViewerBase.documentId) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderComments, data);
                        proxy.isAnnotationRendered = true;
                        // eslint-disable-next-line
                        let annotationCollections: any;
                        if (proxy.pdfViewerBase.documentAnnotationCollections) {
                            // eslint-disable-next-line max-len
                            annotationCollections = proxy.updateAnnotationsInDocumentCollections(proxy.pdfViewerBase.annotationComments, proxy.pdfViewerBase.documentAnnotationCollections);
                        } else {
                            // eslint-disable-next-line
                            let newCollection: any = proxy.pdfViewerBase.createAnnotationsCollection();
                            // eslint-disable-next-line max-len
                            annotationCollections = proxy.updateAnnotationsInDocumentCollections(proxy.pdfViewerBase.annotationComments, newCollection);
                        }
                        proxy.pdfViewerBase.annotationComments = annotationCollections;
                        proxy.pdfViewerBase.documentAnnotationCollections = annotationCollections;
                        for (let j: number = data.startPageIndex; j < data.endPageIndex; j++) {
                            if (data.annotationDetails[j]) {
                                proxy.renderAnnotationCollections(data.annotationDetails[j], j, isInitialRender);
                            }
                        }
                        if (!proxy.isPageCommentsRendered) {
                            proxy.isPageCommentsRendered = true;
                            proxy.createRequestForComments();
                        }
                    }
                }
            }
        };
        // eslint-disable-next-line
        proxy.commentsRequestHandler.onFailure = function (result: any) {
            this.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // eslint-disable-next-line
        proxy.commentsRequestHandler.onError = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderComments);
        };
    }

    /**
     * @param excistingAnnotation
     * @param newAnnotation
     * @private
     */
    // eslint-disable-next-line
    public updateAnnotationsInDocumentCollections(excistingAnnotation: any, newAnnotation: any): any {
        for (let i: number = 0; i < this.pdfViewerBase.pageCount; i++) {
            if (excistingAnnotation[i] && newAnnotation[i]) {
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].textMarkupAnnotation && excistingAnnotation[i].textMarkupAnnotation.length !== 0 && newAnnotation[i].textMarkupAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].textMarkupAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].textMarkupAnnotation[j], newAnnotation[i].textMarkupAnnotation);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].shapeAnnotation && excistingAnnotation[i].shapeAnnotation.length !== 0 && newAnnotation[i].shapeAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].shapeAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].shapeAnnotation[j], newAnnotation[i].shapeAnnotation);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].measureShapeAnnotation && excistingAnnotation[i].measureShapeAnnotation.length !== 0 && newAnnotation[i].measureShapeAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].measureShapeAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].measureShapeAnnotation[j], newAnnotation[i].measureShapeAnnotation);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].stampAnnotations && excistingAnnotation[i].stampAnnotations.length !== 0 && newAnnotation[i].stampAnnotations) {
                    for (let j: number = 0; j < excistingAnnotation[i].stampAnnotations.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].stampAnnotations[j], newAnnotation[i].stampAnnotations);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].stickyNotesAnnotation && excistingAnnotation[i].stickyNotesAnnotation.length !== 0 && newAnnotation[i].stickyNotesAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].stickyNotesAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].stickyNotesAnnotation[j], newAnnotation[i].stickyNotesAnnotation);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].freeTextAnnotation && excistingAnnotation[i].freeTextAnnotation.length !== 0 && newAnnotation[i].freeTextAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].freeTextAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].freeTextAnnotation[j], newAnnotation[i].freeTextAnnotation);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].signatureAnnotation && excistingAnnotation[i].signatureAnnotation.length !== 0 && newAnnotation[i].signatureAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].signatureAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].signatureAnnotation[j], newAnnotation[i].signatureAnnotation);
                    }
                }
                // eslint-disable-next-line max-len
                if (excistingAnnotation[i].signatureInkAnnotation && excistingAnnotation[i].signatureInkAnnotation.length !== 0 && newAnnotation[i].signatureInkAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[i].signatureInkAnnotation.length; j++) {
                        // eslint-disable-next-line max-len
                        this.updateDocumentAnnotationCollections(excistingAnnotation[i].signatureInkAnnotation[j], newAnnotation[i].signatureInkAnnotation);
                    }
                }
            }
        }
        return newAnnotation;
    }

    // eslint-disable-next-line
    private updateDocumentAnnotationCollections(excistingAnnotation: any, newAnnotation: any) {
        if (newAnnotation.length === 0) {
            newAnnotation.push(excistingAnnotation);
        } else {
            let isAdded: boolean = false;
            for (let i: number = 0; i < newAnnotation.length; i++) {
                // eslint-disable-next-line max-len
                if ((excistingAnnotation.AnnotName && newAnnotation[i].AnnotName) && (excistingAnnotation.AnnotName === newAnnotation[i].AnnotName)) {
                    isAdded = true;
                    break;
                }
            }
            if (!isAdded) {
                newAnnotation.push(excistingAnnotation);
            }
        }
    }

    // eslint-disable-next-line
    private renderAnnotationCollections(pageAnnotations: any, pageNumber: any, isInitialRender: boolean): void {
        // eslint-disable-next-line
        let pageCollections: any = [];
        if (pageAnnotations.textMarkupAnnotation && pageAnnotations.textMarkupAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.textMarkupAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.textMarkupAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.textMarkupAnnotation[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.textMarkupAnnotation[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewer.annotationModule.textMarkupAnnotationModule.updateTextMarkupAnnotationCollections(pageAnnotations.textMarkupAnnotation[i], pageNumber));
            }
        }
        if (pageAnnotations.shapeAnnotation && pageAnnotations.shapeAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.shapeAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.shapeAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.shapeAnnotation[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.shapeAnnotation[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewer.annotationModule.shapeAnnotationModule.updateShapeAnnotationCollections(pageAnnotations.shapeAnnotation[i], pageNumber));
            }
        }
        if (pageAnnotations.measureShapeAnnotation && pageAnnotations.measureShapeAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.measureShapeAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.measureShapeAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.measureShapeAnnotation[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.measureShapeAnnotation[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewer.annotationModule.measureAnnotationModule.updateMeasureAnnotationCollections(pageAnnotations.measureShapeAnnotation[i], pageNumber));
            }
        }
        if (pageAnnotations.stampAnnotations && pageAnnotations.stampAnnotations.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.stampAnnotations.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.stampAnnotations[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.stampAnnotations[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.stampAnnotations[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewer.annotationModule.stampAnnotationModule.updateStampAnnotationCollections(pageAnnotations.stampAnnotations[i], pageNumber));
            }
        }
        if (pageAnnotations.stickyNotesAnnotation && pageAnnotations.stickyNotesAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.stickyNotesAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.stickyNotesAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.stickyNotesAnnotation[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.stickyNotesAnnotation[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.updateStickyNotesAnnotationCollections(pageAnnotations.stickyNotesAnnotation[i], pageNumber));
            }
        }
        if (pageAnnotations.freeTextAnnotation && pageAnnotations.freeTextAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.freeTextAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.freeTextAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.freeTextAnnotation[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.freeTextAnnotation[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(pageAnnotations.freeTextAnnotation[i], pageNumber));
            }
        }
        if (pageAnnotations.signatureAnnotation && pageAnnotations.signatureAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.signatureAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.signatureAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.signatureAnnotation[i].ModifiedDate);
                }
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewerBase.signatureModule.updateSignatureCollections(pageAnnotations.signatureAnnotation[i], pageNumber), true);
            }
        }
        if (pageAnnotations.signatureInkAnnotation && pageAnnotations.signatureInkAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.signatureInkAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    // eslint-disable-next-line max-len
                    pageAnnotations.signatureInkAnnotation[i].ModifiedDate = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(pageAnnotations.signatureInkAnnotation[i].ModifiedDate);
                }
                pageCollections.push(pageAnnotations.signatureInkAnnotation[i]);
                // eslint-disable-next-line max-len
                this.updateCollections(this.pdfViewer.annotationModule.inkAnnotationModule.updateInkCollections(pageAnnotations.signatureInkAnnotation[i], pageNumber));
            }
        }
        if (this.pdfViewer.toolbarModule) {
            this.renderAnnotationComments(pageCollections, pageNumber);
        }
        if (isInitialRender) {
            for (let i: number = 0; i < this.pdfViewerBase.renderedPagesList.length; i++) {
                this.pdfViewerBase.renderAnnotations(this.pdfViewerBase.renderedPagesList[i],false);
            }
        }
    }

    /**
     * @param annotation
     * @param isSignature
     * @param annotation
     * @param isSignature
     * @private
     */
    // eslint-disable-next-line
    public updateCollections(annotation: any, isSignature?: boolean): void {
        let isAdded: boolean = false;
        // eslint-disable-next-line
        let collections: any;
        if (isSignature) {
            collections = this.pdfViewer.signatureCollection;
        } else {
            collections = this.pdfViewer.annotationCollection;
        }
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (isSignature) {
                    if (collections[i].signatureName === annotation.signatureName) {
                        isAdded = true;
                        break;
                    }
                } else {
                    if (collections[i].annotationId === annotation.annotationId) {
                        isAdded = true;
                        break;
                    }
                }
            }
        }
        if (!isAdded && annotation) {
            if (isSignature) {
                this.pdfViewer.signatureCollection.push(annotation);
            } else {
                this.pdfViewer.annotationCollection.push(annotation);
            }
        }

    }

    /**
     * @param data
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public renderAnnotationComments(data: any, pageIndex: number): void {
        pageIndex = pageIndex + 1;
        if (data) {
            if (data.length !== 0) {
                this.createPageAccordion(pageIndex);
                for (let i: number = 0; i < data.length; i++) {
                    if (data[i].AnnotName && (data[i].AnnotName.split('freeText').length === 1)) {
                        this.createCommentControlPanel(data[i], pageIndex);
                    }
                }
                // eslint-disable-next-line
                let newCommentsDiv: any = document.querySelectorAll('.e-pv-new-comments-div');
                if (newCommentsDiv) {
                    for (let j: number = 0; j < newCommentsDiv.length; j++) {
                        newCommentsDiv[j].style.display = 'none';
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    public initializeAcccordionContainer(): void {
        // eslint-disable-next-line max-len
        const commentPanelText: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentsPanelText', className: 'e-pv-comments-panel-text' });
        if (isBlazor()) {
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_NoCommentsYet');
            promise.then((value: string) => {
                commentPanelText.textContent = value;
            });
        } else {
            commentPanelText.textContent = this.pdfViewer.localeObj.getConstant('No Comments Yet');
        }
        this.updateCommentPanelTextTop();
        this.pdfViewerBase.navigationPane.commentsContentContainer.appendChild(commentPanelText);
        // eslint-disable-next-line max-len
        this.accordionContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_accordionContentContainer', className: 'e-pv-accordion-content-container' });
        this.pdfViewerBase.navigationPane.commentsContentContainer.appendChild(this.accordionContentContainer);
        // eslint-disable-next-line max-len
        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
        // eslint-disable-next-line max-len
        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], false);
    }

    /**
     * @private
     */
    public updateCommentPanelTextTop(): void {
        const commentPanelText: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commentsPanelText');
        // eslint-disable-next-line max-len
        if (this.pdfViewerBase.navigationPane.commentPanelContainer && this.pdfViewerBase.navigationPane.commentPanelContainer.clientHeight && commentPanelText.style.display !== 'none') {
            commentPanelText.style.paddingTop = (this.pdfViewerBase.navigationPane.commentPanelContainer.clientHeight / 2) - 47 + 'px';
            commentPanelText.style.paddingLeft = (this.pdfViewerBase.navigationPane.commentPanelContainer.clientWidth) / 3 + 'px';
        }
    }

    /**
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public createPageAccordion(pageIndex: number): any {
        const pageAccordionContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageIndex);
        if (pageAccordionContainer === null && this.pdfViewer.enableCommentPanel) {
            this.accordionContent = createElement('div', { id: this.pdfViewer.element.id + '_accordioncontent' + pageIndex });
            this.accordionContent.style.zIndex = '1000';
            // eslint-disable-next-line max-len
            this.accordionPageContainer = createElement('div', { id: this.pdfViewer.element.id + '_accordionPageContainer' + pageIndex, className: 'e-pv-accordion-page-container' });
            this.accordionPageContainer.appendChild(this.accordionContent);
            this.pdfViewerBase.viewerMainContainer.appendChild(this.accordionPageContainer);
            // eslint-disable-next-line max-len
            this.accordionContainer = createElement('div', { id: this.pdfViewer.element.id + '_accordionContainer' + pageIndex, className: 'e-pv-accordion-container' });
            const pageAccordion: Accordion = new Accordion({
                items: [
                    // eslint-disable-next-line max-len
                    { header: this.pdfViewer.localeObj.getConstant('Page') + ' ' + (pageIndex), expanded: true, content: '#' + this.pdfViewer.element.id + '_accordioncontent' + pageIndex + '' }
                ]
            });
            pageAccordion.appendTo(this.accordionContainer);
            this.accordionContainer.style.order = 'pageIndex';
            this.alignAccordionContainer(this.accordionContainer, pageIndex);
            if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                // eslint-disable-next-line max-len
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                // eslint-disable-next-line max-len
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], true);
                document.getElementById(this.pdfViewer.element.id + '_commentsPanelText').style.display = 'none';
            }
            if (document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer')) {
                document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer').style.display = 'block';
            }
            return this.accordionContainer;
        }
    }

    private alignAccordionContainer(accordionDiv: HTMLElement, pageIndex: number): void {
        let isAdded: boolean = true;
        if (this.accordionContentContainer) {
            if (this.isAccordionContainer) {
                this.accordionContentContainer.appendChild(accordionDiv);
                isAdded = false;
            } else {
                for (let i: number = 1; i <= this.pdfViewerBase.pageCount; i++) {
                    const nextElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + i);
                    if (nextElement) {
                        if (pageIndex < i) {
                            this.accordionContentContainer.insertBefore(accordionDiv, nextElement);
                            isAdded = false;
                            break;
                        }
                    }
                }
            }
            if (isAdded) {
                this.accordionContentContainer.appendChild(accordionDiv);
                isAdded = false;
            }
            this.isAccordionContainer = false;
        }
    }

    /**
     * @param pageNumber
     * @private
     */
    public updateCommentPanelScrollTop(pageNumber: number): void {
        const accordionDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordionDiv) {
            const scrollValue: number = accordionDiv.offsetTop + accordionDiv.clientTop - 35;
            this.pdfViewerBase.navigationPane.commentsContentContainer.scrollTop = scrollValue;
        }
    }

    /**
     * @param data
     * @param pageIndex
     * @param type
     * @param annotationSubType
     * @param data
     * @param pageIndex
     * @param type
     * @param annotationSubType
     * @param data
     * @param pageIndex
     * @param type
     * @param annotationSubType
     * @private
     */
    // eslint-disable-next-line
    public createCommentControlPanel(data: any, pageIndex: number, type?: string, annotationSubType?: string): string {
        const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordioncontent' + pageIndex);
        if (accordionContent) {
            // eslint-disable-next-line
            let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageIndex);
            if (accordionExpand) {
                accordionExpand.ej2_instances[0].expandItem(true);
            }
            // eslint-disable-next-line max-len
            this.commentsContainer = createElement('div', { id: this.pdfViewer.element.id + 'commentscontainer' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-container' });
            this.commentsContainer.accessKey = pageIndex.toString();
            let isCommentsAdded: boolean = false;
            if (data) {
                this.commentsContainer.id = data.AnnotName;
                if (data.AnnotName) {
                    for (let j: number = 0; j < accordionContent.childElementCount; j++) {
                        if (accordionContent.children[j].id === data.AnnotName) {
                            isCommentsAdded = true;
                            break;
                        }
                    }
                }
                if (data.Name && data.Name === 'freeText') {
                    this.commentsContainer.setAttribute('name', 'freeText');
                } else {
                    this.commentsContainer.setAttribute('name', data.AnnotType);
                }
            }
            if (type) {
                this.commentsContainer.setAttribute('name', type);
            }
            this.commentsContainer.addEventListener('mousedown', this.commentsAnnotationSelect.bind(this));
            // eslint-disable-next-line max-len
            const commentDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentdiv' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-div' });
            this.commentsCount = this.commentsCount + 1;
            this.commentsContainer.appendChild(commentDiv);
            this.updateCommentPanelScrollTop(pageIndex);
            if (!isCommentsAdded) {
                accordionContent.appendChild(this.commentsContainer);
            }
            let title: string;
            if (data) {
                title = this.commentsContainer.getAttribute('name');
                if (title === 'null') {
                    title = data.AnnotationType;
                }
                this.createTitleContainer(commentDiv, title, data.Subject, data.ModifiedDate, data.Author);
            } else {
                title = this.commentsContainer.getAttribute('name');
                this.createTitleContainer(commentDiv, title, annotationSubType);
            }
            // eslint-disable-next-line max-len
            const commentTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commenttextbox', className: 'e-pv-comment-textbox' });
            // eslint-disable-next-line
            let editObj: any = new InPlaceEditor({
                created: created,
                beginEdit: beginEdit,
                mode: 'Inline',
                type: 'Text',
                model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a comment') + '..' },
                emptyText: '',
                editableOn: 'EditIconClick',
                saveButton: {
                    content: this.pdfViewer.localeObj.getConstant('Post'),
                    cssClass: 'e-outline',
                    disabled: true
                },
                cancelButton: {
                    content: this.pdfViewer.localeObj.getConstant('Cancel'),
                    cssClass: 'e-outline'
                },
                submitOnEnter: true
            });
            editObj.appendTo(commentTextBox);
            // eslint-disable-next-line
            let textBox: any = document.querySelectorAll('.e-editable-inline');
            for (let j: number = 0; j < textBox.length; j++) {
                textBox[j].style.display = 'none';
            }
            if (!data) {
                editObj.enableEditMode = true;
            }
            // eslint-disable-next-line
            commentTextBox.addEventListener('keydown', function (event: any) {
                if (editObj.element.querySelector('.e-btn-save')) {
                    if (event.srcElement.value !== '') {
                        editObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = false;
                    } else {
                        editObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = true;
                    }
                }
            });
            editObj.actionSuccess = this.createCommentDiv.bind(this, editObj);
            commentDiv.appendChild(commentTextBox);
            if (data) {
                editObj.value = data.Note;
                const isCommentLocked: boolean = this.checkIslockProperty(data);
                if (isCommentLocked && data.Comments == null) {
                    this.createCommentDiv(this.commentsContainer);
                }
                if (data.Name === 'freeText') {
                    editObj.value = data.MarkupText;
                }
                if (data.State) {
                    // eslint-disable-next-line max-len
                    const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    // eslint-disable-next-line max-len
                    const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
                    statusDiv.appendChild(statusSpan);
                    statusContainer.appendChild(statusDiv);
                    commentDiv.appendChild(statusContainer);
                    this.updateStatusContainer(data.State, statusSpan, statusDiv, statusContainer);
                }
                if (data.Comments) {
                    for (let j: number = 0; j < data.Comments.length; j++) {
                        this.renderComments(data.Comments[j], this.commentsContainer);
                    }
                    if (data.Note !== ' ' && data.Note !== '' && data.Note !== null) {
                        this.createCommentDiv(this.commentsContainer);
                    }
                }
            }
            this.isNewcommentAdded = true;
            commentDiv.addEventListener('click', this.commentsDivClickEvent.bind(this));
            commentDiv.addEventListener('mouseover', this.commentDivMouseOver.bind(this));
            commentDiv.addEventListener('mouseleave', this.commentDivMouseLeave.bind(this));
            commentDiv.addEventListener('mouseout', this.commentDivMouseLeave.bind(this));
            commentDiv.addEventListener('focusout', this.commentDivMouseLeave.bind(this));
            commentTextBox.addEventListener('dblclick', this.openEditorElement.bind(this));
            commentTextBox.addEventListener('focusin', this.commentDivFocus.bind(this));
            return (this.commentsContainer.id);
        }
        function created(): void {
            setTimeout(() => {
            this.element.querySelector('.e-editable-value').innerText = data ? data.Note : '';
            }); 
        }    
        function beginEdit(e: BeginEditEventArgs): void {   
            this.value = this.valueEle.innerText;   
        }
        return '';
    }
    // eslint-disable-next-line
    private commentDivFocus(args: any): void {
        // eslint-disable-next-line
        let proxy: any = this;
        const pageNumber: number = this.pdfViewerBase.currentPageNumber;
        setTimeout(
            () => {
                proxy.updateScrollPosition(pageNumber);
            }, 500);
    }
    private updateScrollPosition(pageNumber: number): void {
        const accordionDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordionDiv && this.isNewcommentAdded) {
            let commentHeight: number = 0;
            // eslint-disable-next-line
            let textBox: any = document.querySelectorAll('.e-editable-inline');
            if (textBox[0]) {
                commentHeight = textBox[0].getBoundingClientRect().height;
            }
            const scrollValue: number = accordionDiv.offsetTop + accordionDiv.clientTop + commentHeight;
            if (this.pdfViewerBase.navigationPane.commentsContentContainer.scrollTop < scrollValue) {
                this.pdfViewerBase.navigationPane.commentsContentContainer.scrollTop = scrollValue;
            }
            this.isNewcommentAdded = false;
        }
    }

    private updateCommentsScrollTop(isCommentsAdded?: boolean): void {
        // eslint-disable-next-line max-len
        const accordionDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewerBase.currentPageNumber);
        // eslint-disable-next-line
        let commentsContainer: any = document.querySelector('.e-pv-comments-border');
        let commentsHeight: number = 0;
        if (accordionDiv && commentsContainer) {
            commentsHeight = commentsContainer.getBoundingClientRect().height;
            let scrollValue: number;
            if (isCommentsAdded) {
                scrollValue = accordionDiv.offsetTop + commentsContainer.offsetTop + (commentsHeight / 4);
            } else {
                scrollValue = accordionDiv.offsetTop + commentsContainer.offsetTop - 70;
            }
            this.pdfViewerBase.navigationPane.commentsContentContainer.scrollTop = scrollValue;
        }
    }

    /**
     * @param args
     * @private
     */
    // eslint-disable-next-line
    public createCommentDiv(args: any): void {    
        let commentsContainer: HTMLElement;
        let titleContainer: HTMLElement;
        // eslint-disable-next-line
        let newCommentDiv: any = createElement('div', { id: this.pdfViewer.element.id + '_newcommentdiv' + this.commentsCount, className: 'e-pv-new-comments-div' });
        if (args.localName) {
            commentsContainer = args;
        } else {
            commentsContainer = args.valueEle.parentElement.parentElement.parentElement.parentElement;
            titleContainer = args.valueEle.parentElement.parentElement.previousSibling.childNodes[1];
        }
        // eslint-disable-next-line
        let commentObj: any = new InPlaceEditor({
            mode: 'Inline',
            type: 'Text',
            value: '',
            editableOn: 'Click',
            model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a reply') + '..' },
            emptyText: this.pdfViewer.localeObj.getConstant('Add a reply'),
            saveButton: {
                content: this.pdfViewer.localeObj.getConstant('Post'),
                cssClass: 'e-outline',
                disabled: true
            },
            cancelButton: {
                content: this.pdfViewer.localeObj.getConstant('Cancel'),
                cssClass: 'e-outline'
            },
            submitOnEnter: true
        });
        commentObj.appendTo(newCommentDiv);
        newCommentDiv.lastChild.firstChild.click();
        // eslint-disable-next-line
        newCommentDiv.addEventListener('keydown', function (event: any) {
            if (commentObj.element.querySelector('.e-btn-save')) {
                if (event.srcElement.value !== '') {
                    commentObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = false;
                } else {
                    commentObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = true;
                    commentObj.enableEditMode = true;
                }
            }
        });
        if (args.valueEle) {
            if (args.value != null && args.value !== '' && args.value !== ' ') {
                // eslint-disable-next-line max-len
                if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    this.modifyTextProperty(args.value, args.prevValue, args.valueEle.parentNode.parentNode.parentNode.parentNode.id);
                } else {
                    try {
                        this.modifyTextProperty(args.value, args.prevValue, args.valueEle.parentNode.parentNode.parentNode.parentNode.id);
                    } catch (error) {
                        this.modifyTextProperty(args.value, args.prevValue);
                    }
                }
                this.updateModifiedDate(titleContainer);
            }
            if (args.valueEle.parentElement.parentElement.parentElement.parentElement.childElementCount === 1) {
                if (args.value != null && args.value !== '' && args.value !== ' ') {
                    commentsContainer.appendChild(newCommentDiv);
                    setTimeout(
                        () => {
                            this.updateCommentsScrollTop(true);
                        }, 50);
                }
            }
        } else {
            commentsContainer.appendChild(newCommentDiv);
            setTimeout(
                () => {
                    this.updateCommentsScrollTop(true);
                }, 50);
        }
        commentObj.actionSuccess = this.saveCommentDiv.bind(this, commentObj);
    }

    /**
     * @param args
     * @param comment
     * @private
     */
    // eslint-disable-next-line
    public saveCommentDiv(args: any, comment: any): void {    
        let commentsContainer: HTMLElement;
        let annotationAuthor: string;
        // eslint-disable-next-line
        let lastElement: any;
        let commentValue: string;
        if (comment.name && args.value !== '') {
            commentsContainer = args.valueEle.parentElement.parentElement.parentElement;
            lastElement = args.valueEle.parentElement.parentElement;
            commentValue = args.value;
        } else {
            commentsContainer = args;
            lastElement = commentsContainer.lastChild;
            commentValue = comment;
        }
        if (commentsContainer  && lastElement) {
            commentsContainer.removeChild(lastElement);
            const replyTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replytextbox' });
            this.commentsreplyCount = this.commentsreplyCount + 1;
            // eslint-disable-next-line
            let replyCommentDiv: any = createElement('div', { id: this.pdfViewer.element.id + 'replyDiv' + this.commentsreplyCount, className: 'e-pv-reply-div' });
            replyCommentDiv.id = this.pdfViewer.annotation.createGUID();
            annotationAuthor = this.getAuthorName(this.pdfViewer.selectedItems.annotations[0], commentsContainer);
            this.createReplyDivTitleContainer(replyCommentDiv, null, annotationAuthor);
            replyCommentDiv.addEventListener('mouseover', this.commentDivMouseOver.bind(this));
            replyCommentDiv.addEventListener('mouseleave', this.commentDivMouseLeave.bind(this));
            replyCommentDiv.addEventListener('click', this.commentDivOnSelect.bind(this));
            replyTextBox.addEventListener('dblclick', this.openEditorElement.bind(this));
            replyCommentDiv.style.border = 1 + 'px';
            replyCommentDiv.style.borderColor = 'black';
            replyCommentDiv.style.zIndex = 1002;
            // eslint-disable-next-line
            let saveObj: any = new InPlaceEditor({
                created: created,
                beginEdit: beginEdit,
                mode: 'Inline',
                type: 'Text',
                emptyText: '',
                editableOn: 'EditIconClick',
                model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a reply') + '..' },
                value: commentValue,
                saveButton: {
                    content: this.pdfViewer.localeObj.getConstant('Post'),
                    cssClass: 'e-outline'
                },
                cancelButton: {
                    content: this.pdfViewer.localeObj.getConstant('Cancel'),
                    cssClass: 'e-outline'
                }
            });
            saveObj.appendTo(replyTextBox);
            saveObj.actionSuccess = this.modifyProperty.bind(this, saveObj);
            replyCommentDiv.appendChild(replyTextBox);
            replyCommentDiv.style.paddingLeft = 24 + 'px';
            commentsContainer.appendChild(replyCommentDiv);
            // eslint-disable-next-line
            replyTextBox.addEventListener('keydown', function (event: any) {
                if (saveObj.element.querySelector('.e-btn-save')) {
                    if (event.srcElement.value !== '') {
                        saveObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = false;
                    } else {
                        saveObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = true;
                    }
                }
            });
            replyCommentDiv.addEventListener('click', this.commentsDivClickEvent.bind(this));
            replyCommentDiv.addEventListener('dblclick', this.commentsDivDoubleClickEvent.bind(this));
            this.createCommentDiv(replyCommentDiv.parentElement);
            this.modifyCommentsProperty(commentValue, replyCommentDiv.id, commentsContainer.id);
        }
        function created(): void {
            setTimeout(() => {
            this.element.querySelector('.e-editable-value').innerText = commentValue;
            });
            }
        function beginEdit(e: BeginEditEventArgs): void {
            this.value = this.valueEle.innerText;
            }
    }

    // eslint-disable-next-line
    private renderComments(data: any, commentDiv: any, undoRedoAction?: boolean, id?: string, isCommentAction?: boolean): void {
        let annotationAuthor: string;
        const replyTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replytextbox' });
        this.commentsreplyCount = this.commentsreplyCount + 1;
        const replyDiv: HTMLElement = createElement('div', { id: 'replyDiv' + this.commentsreplyCount, className: 'e-pv-reply-div' });
        if (undoRedoAction) {
            replyDiv.id = data.annotName;
            annotationAuthor = data.author;
        } else {
            replyDiv.id = data.AnnotName;
            annotationAuthor = data.Author;
        }
        replyDiv.style.border = 1 + 'px';
        replyDiv.style.borderColor = 'black';
        if (!annotationAuthor) {
            annotationAuthor = commentDiv.getAttribute('author');
        }
        if (undoRedoAction) {
            if (data.modifiedDate !== undefined) {
                this.createReplyDivTitleContainer(replyDiv, data.modifiedDate, annotationAuthor);
            } else {
                this.createReplyDivTitleContainer(replyDiv, null, annotationAuthor);
            }
        } else {
            this.createReplyDivTitleContainer(replyDiv, data.ModifiedDate, annotationAuthor);
        }
        replyDiv.addEventListener('mouseover', this.commentDivMouseOver.bind(this));
        replyDiv.addEventListener('mouseleave', this.commentDivMouseLeave.bind(this));
        replyDiv.addEventListener('click', this.commentDivOnSelect.bind(this));
        replyTextBox.addEventListener('dblclick', this.openEditorElement.bind(this));
        // eslint-disable-next-line
        let saveObj: any = new InPlaceEditor({
            created: created,
            beginEdit: beginEdit,
            mode: 'Inline',
            type: 'Text',
            emptyText: '',
            editableOn: 'EditIconClick',
            model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a reply') + '..' },
            value: '',
            saveButton: {
                content: this.pdfViewer.localeObj.getConstant('Post'),
                cssClass: 'e-outline'
            },
            cancelButton: {
                content: this.pdfViewer.localeObj.getConstant('Cancel'),
                cssClass: 'e-outline'
            }
        });
        if (undoRedoAction) {
            saveObj.value = data.note;
        } else {
            saveObj.value = data.Note;
        }
        saveObj.appendTo(replyTextBox);
        replyDiv.appendChild(replyTextBox);
        function created(): void {
            setTimeout(() => {
            this.element.querySelector('.e-editable-value').innerText = data ? data.Note : '';
            });
            }
        function beginEdit(e: BeginEditEventArgs): void { 
            this.value = this.valueEle.innerText; 
            }
        if (undoRedoAction) {
            data.State = data.state;
        }
        if (data.State) {
            // eslint-disable-next-line max-len
            const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
            // eslint-disable-next-line max-len
            const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
            const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
            statusDiv.appendChild(statusSpan);
            statusContainer.appendChild(statusDiv);
            replyDiv.appendChild(statusContainer);
            this.updateStatusContainer(data.State, statusSpan, statusDiv, statusContainer);
        }
        replyDiv.style.paddingLeft = 24 + 'px';
        // eslint-disable-next-line
        replyTextBox.addEventListener('keydown', function (event: any) {
            if (saveObj.element.querySelector('.e-btn-save')) {
                if (event.srcElement.value !== '') {
                    saveObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = false;
                } else {
                    saveObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = true;
                }
            }
        });
        if (undoRedoAction) {
            if (isCommentAction) {
                commentDiv.appendChild(replyDiv);
            } else {
                // eslint-disable-next-line
                let commentsDiv: any = document.getElementById(id);
                if (data.position) {
                    commentsDiv.insertBefore(replyDiv, commentsDiv.childNodes[data.position]);
                } else {
                    // eslint-disable-next-line
                    if (commentsDiv) {
                        if (commentsDiv.childElementCount > 1) {
                            commentsDiv.insertBefore(replyDiv, commentsDiv.childNodes[commentsDiv.childElementCount - 1]);
                        } else {
                            commentDiv.appendChild(replyDiv);
                        }
                    }
                }
            }
        } else {
            commentDiv.appendChild(replyDiv);
        }
        replyDiv.addEventListener('click', this.commentsDivClickEvent.bind(this));
        replyDiv.addEventListener('dblclick', this.commentsDivDoubleClickEvent.bind(this));
        saveObj.actionSuccess = this.modifyProperty.bind(this, saveObj);
    }

    /**
     * @param data
     * @param pageIndex
     * @param isCopy
     * @param data
     * @param pageIndex
     * @param isCopy
     * @private
     */
    // eslint-disable-next-line
    public createCommentsContainer(data: any, pageIndex: number, isCopy?: boolean): string {
        // eslint-disable-next-line
        let accordionContentContainer: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageIndex);
        if (!accordionContentContainer) {
            // eslint-disable-next-line max-len
            const accordionPageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionPageContainer' + pageIndex);
            if (accordionPageContainer) {
                accordionPageContainer.parentElement.removeChild(accordionPageContainer);
            }
            accordionContentContainer = this.createPageAccordion(pageIndex);
            if (accordionContentContainer) {
                accordionContentContainer.ej2_instances[0].expandItem(true);
            }
        }
        const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordioncontent' + pageIndex);
        // eslint-disable-next-line max-len
        this.commentsContainer = createElement('div', { id: this.pdfViewer.element.id + 'commentscontainer' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-container' });
        this.commentsContainer.accessKey = pageIndex.toString();
        if (data) {
            this.commentsContainer.id = data.annotName;
        }
        this.commentsContainer.addEventListener('mousedown', this.commentsAnnotationSelect.bind(this));
        // eslint-disable-next-line max-len
        const commentDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentdiv' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-div' });
        this.commentsCount = this.commentsCount + 1;
        this.commentsContainer.appendChild(commentDiv);
        this.updateCommentPanelScrollTop(pageIndex);
        if (data && accordionContent) {
            if (data.position || data.position === 0) {
                accordionContent.insertBefore(this.commentsContainer, accordionContent.children[data.position]);
            } else {
                accordionContent.appendChild(this.commentsContainer);
            }
        }
        if (data && accordionContent) {
            if (data.indent) {
                this.commentsContainer.setAttribute('name', 'shape_measure');
                this.createTitleContainer(commentDiv, 'shape_measure', data.subject, data.modifiedDate, data.author);
            } else if (data.shapeAnnotationType === 'sticky' || data.shapeAnnotationType === 'stamp') {
                // eslint-disable-next-line max-len
                const annotType: string = this.createTitleContainer(commentDiv, data.shapeAnnotationType, null, data.modifiedDate, data.author);
                this.commentsContainer.setAttribute('name', annotType);
                if (annotType === 'sticky') {
                    if (!isCopy) {
                        this.addStickyNotesAnnotations((pageIndex - 1), data);
                    }
                }
            } else if (data.shapeAnnotationType === 'textMarkup') {
                this.commentsContainer.setAttribute('name', 'textMarkup');
                this.createTitleContainer(commentDiv, 'textMarkup', data.subject, data.modifiedDate, data.author);
            } else if (data.shapeAnnotationType === 'FreeText') {
                data.note = data.dynamicText;
                this.commentsContainer.setAttribute('name', 'freetext');
                this.createTitleContainer(commentDiv, 'freeText', data.subject, data.modifiedDate);
            } else if (data.shapeAnnotationType === 'Ink') {
                data.note = data.dynamicText;
                this.commentsContainer.setAttribute('name', 'ink');
                this.createTitleContainer(commentDiv, 'ink', data.subject, data.modifiedDate);
            } else {
                this.commentsContainer.setAttribute('name', 'shape');
                if (data.shapeAnnotationType === 'Line') {
                    this.createTitleContainer(commentDiv, 'shape', data.subject, data.modifiedDate, data.author);
                } else {
                    this.createTitleContainer(commentDiv, 'shape', data.shapeAnnotationType, data.modifiedDate, data.author);
                }
            }
        }
        // eslint-disable-next-line max-len
        const commentTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commenttextbox', className: 'e-pv-comment-textbox' });
        // eslint-disable-next-line
        let editObj: any = new InPlaceEditor({
            mode: 'Inline',
            type: 'Text',
            model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a comment') + '..' },
            emptyText: '',
            editableOn: 'EditIconClick',
            saveButton: {
                content: this.pdfViewer.localeObj.getConstant('Post'),
                cssClass: 'e-outline',
                disabled: true
            },
            cancelButton: {
                content: this.pdfViewer.localeObj.getConstant('Cancel'),
                cssClass: 'e-outline'
            },
            submitOnEnter: true
        });
        editObj.appendTo(commentTextBox);
        // eslint-disable-next-line
        let textBox: any = document.querySelectorAll('.e-editable-inline');
        for (let j: number = 0; j < textBox.length; j++) {
            textBox[j].style.display = 'none';
        }
        // eslint-disable-next-line
        commentTextBox.addEventListener('keydown', function (event: any) {
            if (editObj.element.querySelector('.e-btn-save')) {
                if (event.srcElement.value !== '') {
                    editObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = false;
                } else {
                    editObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = true;
                }
            }
        });
        editObj.actionSuccess = this.createCommentDiv.bind(this, editObj);
        commentDiv.appendChild(commentTextBox);
        if (data) {
            editObj.value = data.note;
            if (data.state) {
                // eslint-disable-next-line max-len
                const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                // eslint-disable-next-line max-len
                const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
                statusDiv.appendChild(statusSpan);
                statusContainer.appendChild(statusDiv);
                commentDiv.appendChild(statusContainer);
                this.updateStatusContainer(data.state, statusSpan, statusDiv, statusContainer);
            }
            if (data.comments) {
                for (let j: number = 0; j < data.comments.length; j++) {
                    this.renderComments(data.comments[j], this.commentsContainer, true, null, true);
                }
                if (data.comments.length > 0) {
                    this.createCommentDiv(this.commentsContainer);
                }
            }
        }
        commentDiv.addEventListener('click', this.commentsDivClickEvent.bind(this));
        commentDiv.addEventListener('mouseover', this.commentDivMouseOver.bind(this));
        commentDiv.addEventListener('mouseleave', this.commentDivMouseLeave.bind(this));
        commentDiv.addEventListener('mouseout', this.commentDivMouseLeave.bind(this));
        commentDiv.addEventListener('focusout', this.commentDivMouseLeave.bind(this));
        commentTextBox.addEventListener('dblclick', this.openEditorElement.bind(this));
        return (this.commentsContainer.id);
    }

    // eslint-disable-next-line
    private modifyProperty(args: any): any {
        const commentElement: string = args.element.parentElement.id;
        const parentElement: string = args.element.parentElement.parentElement.id;
        const titleElement: HTMLElement = args.element.previousSibling.firstChild;
        this.updateModifiedDate(titleElement);
        this.modifyCommentsProperty(args.value, commentElement, parentElement, args.prevValue);
    }

    // eslint-disable-next-line
    private createTitleContainer(commentsDivElement: HTMLElement, type: string, subType?: string, modifiedDate?: string, author?: string, note?: string): any {
        let annotationType: string = this.getAnnotationType(type);
        // eslint-disable-next-line max-len
        const commentTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentTitleConatiner', className: 'e-pv-comment-title-container' });
        // eslint-disable-next-line max-len
        const commentTypeSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_commenttype' + '_icon' });
        commentTypeSpan.style.opacity = '0.6';
        this.updateCommentIcon(commentTypeSpan, annotationType, subType);
        let annotationAuthor: string;
        if (!author) {
            annotationAuthor = this.pdfViewer.annotationModule.updateAnnotationAuthor(annotationType, subType);
        } else {
            annotationAuthor = author;
        }
        commentTypeSpan.style.padding = 8 + 'px';
        commentTypeSpan.style.cssFloat = 'left';
        commentTitleContainer.appendChild(commentTypeSpan);
        // eslint-disable-next-line max-len
        const commentsTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentTitle', className: 'e-pv-comment-title' });
        if (!modifiedDate) {
            commentsTitle.textContent = annotationAuthor + ' - ' + this.setModifiedDate();
        } else {
            commentsTitle.textContent = annotationAuthor + ' - ' + this.setExistingAnnotationModifiedDate(modifiedDate);
        }
        commentTitleContainer.appendChild(commentsTitle);
        // eslint-disable-next-line max-len
        const moreOptionsButton: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_more-options', className: 'e-pv-more-options-button e-btn', attrs: { 'tabindex': '-1' } });
        moreOptionsButton.style.visibility = 'hidden';
        moreOptionsButton.style.zIndex = '1001';
        moreOptionsButton.setAttribute('type', 'button');
        // eslint-disable-next-line max-len
        const moreOptionsButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_more-options_icon', className: 'e-pv-more-icon e-pv-icon' });
        moreOptionsButton.appendChild(moreOptionsButtonSpan);
        moreOptionsButtonSpan.style.opacity = '0.87';
        commentTitleContainer.appendChild(moreOptionsButton);
        commentsDivElement.appendChild(commentTitleContainer);
        // eslint-disable-next-line
        let commentsContainer: any = commentsDivElement.parentElement;
        if (commentsContainer) {
            const author: string = this.pdfViewer.annotationModule.updateAnnotationAuthor(annotationType, subType);
            commentsContainer.setAttribute('author', author);
        }
        if (!this.isCreateContextMenu) {
            this.createCommentContextMenu();
        }
        this.isCreateContextMenu = true;
        commentTitleContainer.addEventListener('dblclick', this.openTextEditor.bind(this));
        moreOptionsButton.addEventListener('mouseup', this.moreOptionsClick.bind(this));
        return annotationType;
    }

    // eslint-disable-next-line
    private createReplyDivTitleContainer(commentsDivElement: HTMLElement, modifiedDate?: string, annotationAuthor?: string): void {
        // eslint-disable-next-line max-len
        const replyTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replyTitleConatiner', className: 'e-pv-reply-title-container' });
        // eslint-disable-next-line max-len
        const replyTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replyTitle', className: 'e-pv-reply-title' });
        if (!modifiedDate) {
            replyTitle.textContent = annotationAuthor + ' - ' + this.setModifiedDate();
        } else {
            replyTitle.textContent = annotationAuthor + ' - ' + this.setExistingAnnotationModifiedDate(modifiedDate);
        }
        replyTitleContainer.appendChild(replyTitle);
        // eslint-disable-next-line max-len
        const moreButton: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_more-options', className: 'e-pv-more-options-button e-btn', attrs: { 'tabindex': '-1' } });
        moreButton.style.visibility = 'hidden';
        moreButton.style.zIndex = '1001';
        moreButton.setAttribute('type', 'button');
        // eslint-disable-next-line max-len
        const moreButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_more-options_icon', className: 'e-pv-more-icon e-pv-icon' });
        moreButton.appendChild(moreButtonSpan);
        moreButtonSpan.style.opacity = '0.87';
        replyTitleContainer.appendChild(moreButton);
        commentsDivElement.appendChild(replyTitleContainer);
        replyTitleContainer.addEventListener('dblclick', this.openTextEditor.bind(this));
        moreButton.addEventListener('mouseup', this.moreOptionsClick.bind(this));
    }

    // eslint-disable-next-line
    private updateCommentIcon(commentSpan: HTMLElement, annotationType: string, annotationSubType?: string): void {
        if (annotationType === 'sticky') {
            commentSpan.className = 'e-pv-comment-icon e-pv-icon';
        } else if (annotationType === 'stamp') {
            commentSpan.className = 'e-pv-stamp-icon e-pv-icon';
        } else if (annotationType === 'shape') {
            if (annotationSubType === 'Line') {
                commentSpan.className = 'e-pv-shape-line-icon e-pv-icon';
            } else if (annotationSubType === 'LineWidthArrowHead' || annotationSubType === 'Arrow') {
                commentSpan.className = 'e-pv-shape-arrow-icon e-pv-icon';
            } else if (annotationSubType === 'Circle' || annotationSubType === 'Ellipse' || annotationSubType === 'Oval') {
                commentSpan.className = 'e-pv-shape-circle-icon e-pv-icon';
            } else if (annotationSubType === 'Rectangle' || annotationSubType === 'Square') {
                commentSpan.className = 'e-pv-shape-rectangle-icon e-pv-icon';
            } else if (annotationSubType === 'Polygon') {
                commentSpan.className = 'e-pv-shape-pentagon-icon e-pv-icon';
            } else {
                commentSpan.className = 'e-pv-annotation-shape-icon e-pv-icon';
            }
        } else if (annotationType === 'measure') {
            if (annotationSubType === 'Distance' || annotationSubType === 'Distance calculation') {
                commentSpan.className = 'e-pv-calibrate-distance-icon e-pv-icon';
            } else if (annotationSubType === 'Perimeter' || annotationSubType === 'Perimeter calculation') {
                commentSpan.className = 'e-pv-calibrate-perimeter-icon e-pv-icon';
            } else if (annotationSubType === 'Radius' || annotationSubType === 'Radius calculation') {
                commentSpan.className = 'e-pv-calibrate-radius-icon e-pv-icon';
            } else if (annotationSubType === 'Area' || annotationSubType === 'Area calculation') {
                commentSpan.className = 'e-pv-calibrate-area-icon e-pv-icon';
            } else if (annotationSubType === 'Volume' || annotationSubType === 'Volume calculation') {
                commentSpan.className = 'e-pv-calibrate-volume-icon e-pv-icon';
            } else {
                commentSpan.className = 'e-pv-annotation-calibrate-icon e-pv-icon';
            }
        } else if (annotationType === 'textMarkup') {
            if (annotationSubType === 'Highlight') {
                commentSpan.className = 'e-pv-highlight-icon e-pv-icon';
            } else if (annotationSubType === 'Underline') {
                commentSpan.className = 'e-pv-underline-icon e-pv-icon';
            } else if (annotationSubType === 'Strikethrough') {
                commentSpan.className = 'e-pv-strikethrough-icon e-pv-icon';
            } else {
                commentSpan.className = 'e-pv-annotation-icon e-pv-icon';
            }
        } else if (annotationType === 'freeText') {
            commentSpan.className = 'e-pv-freetext-icon e-pv-icon';
        } else if (annotationType === 'ink' || annotationSubType === 'Ink') {
            commentSpan.className = 'e-pv-inkannotation-icon e-pv-icon';
        }
    }

    // eslint-disable-next-line
    private updateStatusContainer(state: String, statusSpan: HTMLElement, statusDiv: HTMLElement, statusContainer: HTMLElement): void {
        if (state === 'Accepted') {
            statusDiv.style.backgroundColor = 'rgb(24,169,85)';
            statusSpan.className = 'e-pv-accepted-icon';
        } else if (state === 'Completed') {
            statusDiv.style.backgroundColor = 'rgb(0,122,255)';
            statusSpan.className = 'e-pv-completed-icon';
        } else if (state === 'Cancelled') {
            statusDiv.style.backgroundColor = 'rgb(245,103,0)';
            statusSpan.className = 'e-pv-cancelled-icon';
        } else if (state === 'Rejected') {
            statusDiv.style.backgroundColor = 'rgb(255,59,48)';
            statusSpan.className = 'e-pv-rejected-icon';
        } else {
            statusSpan.className = '';
             statusContainer.parentElement.removeChild(statusContainer);
        }
    }

    /**
     * @param removeDiv
     * @private
     */
    public updateAccordionContainer(removeDiv: HTMLElement): void {
        // eslint-disable-next-line
        let pageNumber: any = parseInt(removeDiv.accessKey);
        const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordionContent) {
            accordionContent.parentElement.removeChild(accordionContent);
        }
        const accordionContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
        if (accordionContentContainer) {
            if (accordionContentContainer.childElementCount === 0) {
                accordionContentContainer.style.display = 'none';
                if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                    // eslint-disable-next-line max-len
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
                    // eslint-disable-next-line max-len
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], false);
                    document.getElementById(this.pdfViewer.element.id + '_commentsPanelText').style.display = 'block';
                    this.updateCommentPanelTextTop();
                }
            }
        }
    }

    /**
     * @private
     */
    public createCommentContextMenu(): void {
        // eslint-disable-next-line max-len
        this.commentContextMenu = [
            { text: this.pdfViewer.localeObj.getConstant('Edit') },
            { text: this.pdfViewer.localeObj.getConstant('Delete Context') },
            {
                // eslint-disable-next-line max-len
                text: this.pdfViewer.localeObj.getConstant('Set Status'), items: [{ text: this.pdfViewer.localeObj.getConstant('None') }, { text: this.pdfViewer.localeObj.getConstant('Accepted') }, { text: this.pdfViewer.localeObj.getConstant('Cancelled') }, { text: this.pdfViewer.localeObj.getConstant('Completed') }, { text: this.pdfViewer.localeObj.getConstant('Rejected') }]
            }];
        const commentMenuElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + '_comment_context_menu' });
        this.pdfViewer.element.appendChild(commentMenuElement);
        this.commentMenuObj = new Context({
            target: '#' + this.pdfViewer.element.id + '_more-options', items: this.commentContextMenu,
            beforeOpen: this.contextMenuBeforeOpen.bind(this),
            select: this.commentMenuItemSelect.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.commentMenuObj.enableRtl = true;
        }
        this.commentMenuObj.appendTo(commentMenuElement);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.commentMenuObj.animationSettings.effect = 'ZoomIn';
        } else {
            this.commentMenuObj.animationSettings.effect = 'SlideDown';
        }
    }

    private contextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        // eslint-disable-next-line
        let contextActiveDiv: any;
        // eslint-disable-next-line
        let contextDiv: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_more-options');
        if (contextDiv) {
            for (let i: number = 0; i < contextDiv.length; i++) {
                if (contextDiv[i].style.visibility === 'visible') {
                    contextActiveDiv = contextDiv[i].parentElement.nextSibling;
                }
            }
        }
        const isCommentLocked: boolean = this.checkIslockProperty(contextActiveDiv);
        if (isCommentLocked) {
            this.commentMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Edit')], false);
            this.commentMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Delete Context')], false);
        } else {
            this.commentMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Edit')], true);
            this.commentMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Delete Context')], true);
        }
    }

    // eslint-disable-next-line
    private commentMenuItemSelect(args: any): void {
        // eslint-disable-next-line
        let contextActiveDiv: any;
        // eslint-disable-next-line
        let contextDiv: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_more-options');
        if (contextDiv) {
            for (let i: number = 0; i < contextDiv.length; i++) {
                if (contextDiv[i].style.visibility === 'visible') {
                    contextActiveDiv = contextDiv[i].parentElement.nextSibling;
                }
            }
            if (args.item) {
                switch (args.item.text) {
                case this.pdfViewer.localeObj.getConstant('Edit'):
                    // eslint-disable-next-line
                        let commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
                    for (let i: number = 0; i < commentShow.length; i++) {
                        commentShow[i].style.display = 'none';
                    }
                    contextActiveDiv.ej2_instances[0].enableEditMode = true;
                    break;
                case this.pdfViewer.localeObj.getConstant('Delete Context'):
                    if (contextActiveDiv.parentElement.parentElement.firstChild === contextActiveDiv.parentElement) {
                        this.pdfViewer.annotationModule.deleteAnnotation();
                    } else {
                        // eslint-disable-next-line max-len
                        this.modifyCommentDeleteProperty(contextActiveDiv.parentElement.parentElement, contextActiveDiv.parentElement);
                    }
                    break;
                case this.pdfViewer.localeObj.getConstant('Set Status'):
                    break;
                case this.pdfViewer.localeObj.getConstant('Accepted'):
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    // eslint-disable-next-line max-len
                    const acceptedStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    // eslint-disable-next-line max-len
                    const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-accepted-icon' });
                    statusDiv.style.backgroundColor = 'rgb(24,169,85)';
                    statusDiv.appendChild(statusSpan);
                    acceptedStatusDiv.appendChild(statusDiv);
                    contextActiveDiv.parentElement.appendChild(acceptedStatusDiv);
                    this.modifyStatusProperty('Accepted', contextActiveDiv.parentElement);
                    break;
                case this.pdfViewer.localeObj.getConstant('Completed'):
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    // eslint-disable-next-line max-len
                    const completedStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    // eslint-disable-next-line max-len
                    const statusElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    // eslint-disable-next-line max-len
                    const statusOptionSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-completed-icon' });
                    statusElement.style.backgroundColor = 'rgb(0,122,255)';
                    statusElement.appendChild(statusOptionSpan);
                    completedStatusDiv.appendChild(statusElement);
                    contextActiveDiv.parentElement.appendChild(completedStatusDiv);
                    this.modifyStatusProperty('Completed', contextActiveDiv.parentElement);
                    break;
                case this.pdfViewer.localeObj.getConstant('Cancelled'):
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    // eslint-disable-next-line max-len
                    const cancelStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    // eslint-disable-next-line max-len
                    const cancelStatusElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    // eslint-disable-next-line max-len
                    const cancelStatusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-cancelled-icon' });
                    cancelStatusElement.style.backgroundColor = 'rgb(245,103,0)';
                    cancelStatusElement.appendChild(cancelStatusSpan);
                    cancelStatusDiv.appendChild(cancelStatusElement);
                    contextActiveDiv.parentElement.appendChild(cancelStatusDiv);
                    this.modifyStatusProperty('Cancelled', contextActiveDiv.parentElement);
                    break;
                case this.pdfViewer.localeObj.getConstant('Rejected'):
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    // eslint-disable-next-line max-len
                    const rejectedStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    // eslint-disable-next-line max-len
                    const rejectedStatusElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    // eslint-disable-next-line max-len
                    const rejectedStatusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-rejected-icon' });
                    rejectedStatusElement.style.backgroundColor = 'rgb(255,59,48)';
                    rejectedStatusElement.appendChild(rejectedStatusSpan);
                    rejectedStatusDiv.appendChild(rejectedStatusElement);
                    contextActiveDiv.parentElement.appendChild(rejectedStatusDiv);
                    this.modifyStatusProperty('Rejected', contextActiveDiv.parentElement);
                    break;
                case this.pdfViewer.localeObj.getConstant('None'):
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    this.modifyStatusProperty('None', contextActiveDiv.parentElement);
                    break;
                default:
                    break;
                }
            }
        }
    }

    // eslint-disable-next-line
    private moreOptionsClick(event: any, isMoreOptionClick?: boolean) {
        if (document.getElementById(this.pdfViewer.element.id + '_comment_context_menu').style.display !== 'block') {
            if (event.currentTarget.className === 'e-pv-more-options-button e-btn') {
                event.currentTarget.parentElement.nextSibling.lastChild.firstChild.click();
            }
            this.pdfViewer.annotationModule.checkContextMenuDeleteItem(this.commentMenuObj);
            this.commentMenuObj.open(event.clientY, event.clientX, event.currentTarget);
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    }

    // eslint-disable-next-line
    private openTextEditor(event: any): void {
        // eslint-disable-next-line
        let commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let i: number = 0; i < commentShow.length; i++) {
            commentShow[i].style.display = 'none';
        }
        const isCommentLocked: boolean = this.checkIslockProperty(event.currentTarget.nextSibling);
        if (isCommentLocked) {
            event.currentTarget.nextSibling.ej2_instances[0].enableEditMode = false;
        } else if (event.currentTarget.parentElement.parentElement) {
            let isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.parentElement.parentElement.id);
            if (isLocked) {
                // eslint-disable-next-line
                let annotation: any = this.findAnnotationObject(event.currentTarget.parentElement.parentElement.id);
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', annotation)) {
                    isLocked = false;
                }
            }
            if (!isLocked) {
                event.currentTarget.nextSibling.ej2_instances[0].enableEditMode = true;
            }
        } else {
            event.currentTarget.nextSibling.ej2_instances[0].enableEditMode = true;
        }
    }

    // eslint-disable-next-line
    private checkIslockProperty(commentEvent: any): boolean {
        // eslint-disable-next-line
        let annotCollection: any = this.pdfViewer.annotationCollection;
        // eslint-disable-next-line
        let annotation: any;
        if (commentEvent.IsCommentLock) {
            return true;
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            annotation =  this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else if (this.pdfViewer.selectedItems.annotations[0]) {
            annotation =  this.pdfViewer.selectedItems.annotations[0];
        }
        for (let i: number = 0; i < annotCollection.length; i++) {
            // eslint-disable-next-line max-len
            const note: string = annotCollection[i].note ?  annotCollection[i].note : annotCollection[i].notes;
            if (annotCollection[i].isCommentLock === true && (commentEvent.textContent === note || annotCollection[i].dynamicText === commentEvent.textContent)) {
                return true;
            }
            for (let j: number = 0; j < annotCollection[i].comments.length; j++) {
                if (annotation && annotCollection[i].annotationId === annotation.annotName) {
                // eslint-disable-next-line max-len
                    if (annotCollection[i].comments[j].isLock === true && commentEvent.textContent === annotCollection[i].comments[j].note) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // eslint-disable-next-line
    private openEditorElement(event: any): void {
        // eslint-disable-next-line
        let commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let i: number = 0; i < commentShow.length; i++) {
            commentShow[i].style.display = 'none';
        }
        const isCommentLocked: boolean = this.checkIslockProperty(event.currentTarget);
        if (isCommentLocked) {
            event.currentTarget.ej2_instances[0].enableEditMode = false;
        } else if (event.currentTarget.parentElement.parentElement) {
            let isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.parentElement.parentElement.id);
            if (isLocked) {
                // eslint-disable-next-line
                let annotation: any = this.findAnnotationObject(event.currentTarget.parentElement.parentElement.id);
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', annotation)) {
                    isLocked = false;
                }
            }
            if (!isLocked) {
                if (this.pdfViewer.selectedItems.annotations[0].isReadonly) {
                    event.currentTarget.ej2_instances[0].enableEditMode = false;
                } else {
                    event.currentTarget.ej2_instances[0].enableEditMode = true;
                }
            }
        } else {
            event.currentTarget.ej2_instances[0].enableEditMode = true;
        }
    }

    // eslint-disable-next-line
    private commentsDivClickEvent(event: any): void {
        // eslint-disable-next-line
        let annotation: any = this.findAnnotationObject(event.currentTarget.parentElement.id);
        let isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.parentElement.id);
        if (isLocked) {
            if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', annotation)) {
                isLocked = false;
            }
        }
        if (!isLocked) {
            let isCommentsSelect: boolean = false;
            if (event.clientX === 0 && event.clientY === 0) {
                this.isSetAnnotationType = true;
            } else {
                this.isSetAnnotationType = false;
            }
            if (event.target.className === 'e-pv-more-icon e-pv-icon') {
                return null;
            }
            // eslint-disable-next-line
            let x: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_more-options');
            for (let i: number = 0; i < x.length; i++) {
                x[i].style.visibility = 'hidden';
            }
            if (document.getElementById(this.pdfViewer.element.id + '_commantPanel').style.display === 'none') {
                this.pdfViewer.annotationModule.showCommentsPanel();
            }
            if (event.currentTarget.parentElement.classList.contains('e-pv-comments-border')) {
                isCommentsSelect = true;
            }
            event.currentTarget.firstChild.lastChild.style.visibility = 'visible';
            // eslint-disable-next-line
            let commentsContainer: any = document.querySelectorAll('.e-pv-comments-border');
            if (commentsContainer) {
                for (let j: number = 0; j < commentsContainer.length; j++) {
                    commentsContainer[j].classList.remove('e-pv-comments-border');
                }
            }
            event.currentTarget.parentElement.classList.add('e-pv-comments-border');
            // eslint-disable-next-line
            let commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
            for (let i: number = 0; i < commentShow.length; i++) {
                commentShow[i].style.display = 'none';
            }
            // eslint-disable-next-line
            let editElement: any = event.currentTarget.parentElement.lastChild;
            // eslint-disable-next-line
            let commentsElement: any = event.currentTarget.parentElement;
            if (editElement) {
                editElement.style.display = 'block';
                if (editElement.querySelector('.e-editable-inline')) {
                    if (!this.isEditableElement) {
                        editElement.querySelector('.e-editable-inline').style.display = 'block';
                    }
                    for (let i: number = 0; i < commentsElement.childElementCount; i++) {
                        // eslint-disable-next-line
                        let activeElement: any = commentsElement.childNodes[i];
                        // eslint-disable-next-line
                        let textElement: any = activeElement.querySelector('.e-editable-inline');
                        if (textElement) {
                            if (textElement.style.display === '') {
                                editElement.style.display = 'none';
                                editElement.querySelector('.e-editable-inline').style.display = 'none';
                            }
                        }
                    }
                }
                if (this.isSetAnnotationType) {
                    if (!isCommentsSelect) {
                        this.updateCommentsScrollTop();
                    }
                }
            }
            if (event.currentTarget.parentElement.childElementCount === 1) {
                if (!this.pdfViewer.enableShapeLabel) {
                    event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = true;
                } else {
                    const type: string = event.currentTarget.parentElement.getAttribute('name');
                    if (this.isSetAnnotationType && type === 'shape') {
                        event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = false;
                    } else {
                        event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = true;
                    }
                }
            }
            let editModule : any;
            if(event && event.currentTarget && event.currentTarget.childNodes[1])
               {
                editModule = event.currentTarget.childNodes[1].ej2_instances[0];
               }
            if (event.currentTarget && event.currentTarget.id && editModule) {
                // eslint-disable-next-line
                if(annotation && annotation.isCommentLock)
                {
                     editModule.enableEditMode = false;
                     this.createCommentDiv(event.currentTarget);
                }
                this.pdfViewer.fireCommentSelect(event.currentTarget.id, event.currentTarget.childNodes[1].ej2_instances[0].value, annotation);
            }
            this.commentDivOnSelect(event);
            event.preventDefault();
        }
    }

    // eslint-disable-next-line
    private commentsDivDoubleClickEvent(event: any) {
        // eslint-disable-next-line
        let commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let i: number = 0; i < commentShow.length; i++) {
            commentShow[i].style.display = 'none';
        }
        const isCommentLocked: boolean = this.checkIslockProperty(event.currentTarget.children[1]);
        if (isCommentLocked) {
            if (event.currentTarget.childElementCount === 2) {
                event.currentTarget.lastChild.ej2_instances[0].enableEditMode = false;
            } else {
                event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = false;
            }
        } else if (event.currentTarget) {
            const isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.parentElement.id);
            if (!isLocked) {
                if (event.currentTarget.childElementCount === 2) {
                    event.currentTarget.lastChild.ej2_instances[0].enableEditMode = true;
                } else {
                    event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = true;
                }
            }
        }
    }

    // eslint-disable-next-line
    private commentDivOnSelect(event: any) {
        // eslint-disable-next-line
        let commentSelect: any = document.querySelectorAll('.e-pv-comments-select');
        for (let z: number = 0; z < commentSelect.length; z++) {
            commentSelect[z].classList.remove('e-pv-comments-select');
        }
        const activeElement: HTMLElement = document.getElementById(event.currentTarget.id);
        if (activeElement) {
            activeElement.classList.remove('e-pv-comments-hover');
            activeElement.classList.remove('e-pv-comments-leave');
            activeElement.classList.add('e-pv-comments-select');
            if (event.currentTarget.nextSibling) {
                if (event.currentTarget.nextSibling.classList.contains('e-pv-new-comments-div')) {
                    const activeSiblingElement: HTMLElement = document.getElementById(event.currentTarget.nextSibling.id);
                    activeSiblingElement.classList.remove('e-pv-comments-hover');
                    activeSiblingElement.classList.remove('e-pv-comments-leave');
                    activeSiblingElement.classList.add('e-pv-comments-select');
                }
            }
        }
    }

    // eslint-disable-next-line
    private commentDivMouseOver(event: any) {
        const activeElement: HTMLElement = document.getElementById(event.currentTarget.id);
        if (activeElement) {
            activeElement.classList.remove('e-pv-comments-select');
            activeElement.classList.remove('e-pv-comments-leave');
            activeElement.classList.add('e-pv-comments-hover');
            if (event.currentTarget.nextSibling) {
                if (event.currentTarget.nextSibling.classList.contains('e-pv-new-comments-div')) {
                    const activeSiblingElement: HTMLElement = document.getElementById(event.currentTarget.nextSibling.id);
                    activeSiblingElement.classList.remove('e-pv-comments-select');
                    activeSiblingElement.classList.remove('e-pv-comments-leave');
                    activeSiblingElement.classList.add('e-pv-comments-hover');
                }
            }
        }
    }

    // eslint-disable-next-line
    private commentDivMouseLeave(event: any) {
        const activeElement: HTMLElement = document.getElementById(event.currentTarget.id);
        if (activeElement) {
            activeElement.classList.remove('e-pv-comments-hover');
            activeElement.classList.remove('e-pv-comments-select');
            activeElement.classList.add('e-pv-comments-leave');
            if (event.currentTarget.nextSibling) {
                if (event.currentTarget.nextSibling.classList.contains('e-pv-new-comments-div')) {
                    const activeSiblingElement: HTMLElement = document.getElementById(event.currentTarget.nextSibling.id);
                    activeSiblingElement.classList.remove('e-pv-comments-hover');
                    activeSiblingElement.classList.remove('e-pv-comments-select');
                    activeSiblingElement.classList.add('e-pv-comments-leave');
                }
            }
        }
    }

    /**
     * @param event
     * @private
     */
    // eslint-disable-next-line
    public drawIcons(event: any): void {
        // eslint-disable-next-line
        if (this.pdfViewerBase.isCommentIconAdded) {
            const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            const pageCurrentRect: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex).getBoundingClientRect();
            const zoomValue: number = this.pdfViewerBase.getZoomFactor();
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.stickyNotesAnnotationModule.drawStickyNotes((event.clientX - pageCurrentRect.left) / zoomValue, (event.clientY - pageCurrentRect.top) / zoomValue, 30, 30, pageIndex, null);
            this.pdfViewerBase.isCommentIconAdded = false;
            let commentsButton: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_comment');
            if (isBlazor()) {
                commentsButton = commentsButton.children[0] as HTMLElement;
            }
            if (commentsButton && commentsButton.classList.contains('e-pv-select')) {
                commentsButton.classList.remove('e-pv-select');
            } else {
                const commentsIcon: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commentIcon');
                if (commentsIcon) {
                    this.pdfViewer.enableRtl ? commentsIcon.className = 'e-pv-comment-icon e-pv-icon e-icon-left e-right' : commentsIcon.className = 'e-pv-comment-icon e-pv-icon e-icon-left';
                }
            }
        }
    }

    /**
     * @param annotationType
     * @param pageNumber
     * @param annotationSubType
     * @param annotationType
     * @param pageNumber
     * @param annotationSubType
     * @param annotationType
     * @param pageNumber
     * @param annotationSubType
     * @private
     */
    public addComments(annotationType: string, pageNumber: number, annotationSubType?: string): string {
        let commentsDivid: string;
        // eslint-disable-next-line max-len
        const accordion: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordion) {
            // eslint-disable-next-line max-len
            commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.createCommentControlPanel(null, pageNumber, annotationType, annotationSubType);
        } else {
            this.pdfViewer.annotation.stickyNotesAnnotationModule.createPageAccordion(pageNumber);
            // eslint-disable-next-line max-len
            commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.createCommentControlPanel(null, pageNumber, annotationType, annotationSubType);
        }
        return commentsDivid;
    }

    // eslint-disable-next-line
    private commentsAnnotationSelect(event: any): void {
        const element: HTMLElement = event.currentTarget;
        let isLocked: boolean = this.checkAnnotationSettings(element.id);
        if (isLocked) {
            // eslint-disable-next-line
            let annotation: any = this.findAnnotationObject(element.id);
            if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', annotation)) {
                isLocked = false;
            }
        }
        if (!isLocked) {
            if (element.classList.contains('e-pv-comments-border')) {
                // eslint-disable-next-line
                let commentsDiv: any = document.querySelectorAll('.e-pv-comments-div');
                for (let j: number = 0; j < commentsDiv.length; j++) {
                    commentsDiv[j].style.minHeight = 60 + 'px';
                }
                if (event.currentTarget.childElementCount === 1) {
                    if (event.currentTarget.childNodes[0].querySelector('.e-editable-inline')) {
                        event.currentTarget.childNodes[0].style.minHeight = event.currentTarget.childNodes[0].clientHeight;
                    }
                }
            }
            if (event.target.className === 'e-pv-more-icon e-pv-icon' || event.target.className === 'e-pv-more-options-button e-btn') {
                event.preventDefault();
                return null;
            }
            // eslint-disable-next-line
            let pageNumber: any = parseInt(element.accessKey);
            if (!element.classList.contains('e-pv-comments-border')) {
                // eslint-disable-next-line
                let commentsContainer: any = document.querySelectorAll('.e-pv-comments-border');
                if (commentsContainer) {
                    for (let j: number = 0; j < commentsContainer.length; j++) {
                        commentsContainer[j].classList.remove('e-pv-comments-border');
                    }
                }
                const commentsDiv: HTMLElement = document.getElementById(element.id);
                if (commentsDiv) {
                    commentsDiv.classList.add('e-pv-comments-border');
                }
                // eslint-disable-next-line
                let commentTextBox: any = document.querySelectorAll('.e-pv-new-comments-div');
                for (let j: number = 0; j < commentTextBox.length; j++) {
                    commentTextBox[j].style.display = 'none';
                }
                if (commentsDiv) {
                    // eslint-disable-next-line
                    let currentTextBox: any = commentsDiv.querySelector('.e-pv-new-comments-div');
                    if (currentTextBox) {
                        currentTextBox.style.display = 'block';
                    }
                }
                // eslint-disable-next-line
                let textDiv: any = element.lastChild;
                this.isEditableElement = false;
                if (textDiv.querySelector('.e-editable-inline')) {
                    textDiv.style.display = 'block';
                    textDiv.querySelector('.e-editable-inline').style.display = 'block';
                    for (let i: number = 0; i < element.childElementCount; i++) {
                        // eslint-disable-next-line
                        let activeElement: any = element.childNodes[i];
                        // eslint-disable-next-line
                        let textElement: any = activeElement.querySelector('.e-editable-inline');
                        if (textElement) {
                            if (textElement.style.display === '') {
                                if (textDiv.classList.contains('e-pv-new-comments-div')) {
                                    this.isEditableElement = true;
                                    textDiv.style.display = 'none';
                                    textDiv.querySelector('.e-editable-inline').style.display = 'none';
                                }
                            }
                        }
                    }
                }
                this.isSetAnnotationType = false;
                if (event.currentTarget.childElementCount === 1) {
                    event.currentTarget.childNodes[0].childNodes[1].ej2_instances[0].enableEditMode = true;
                }
            } else {
                this.isSetAnnotationType = true;
            }
            if (!this.isSetAnnotationType) {
                if (this.pdfViewer.navigation) {
                    this.pdfViewer.navigationModule.goToPage(pageNumber);
                }
                let annotType: string = element.getAttribute('name');
                if (annotType === 'null' || annotType === 'Ink') {
                    annotType = 'ink';
                }
                this.isCommentsSelected = false;
                this.setAnnotationType(element.id, annotType, pageNumber);
                if (!this.isCommentsSelected) {
                    this.selectAnnotationObj = { id: element.id, annotType: annotType, pageNumber: pageNumber };
                }
            }
        }
        this.isSetAnnotationType = false;
    }

    // eslint-disable-next-line
    private findAnnotationObject(id: string): any {
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else if (this.pdfViewer.selectedItems.annotations[0]) {
            return this.pdfViewer.selectedItems.annotations[0];
        }
        // eslint-disable-next-line
        let annotationCollection: any = this.pdfViewer.annotationCollection;
        if (annotationCollection) {
            for (let i: number = 0; i < annotationCollection.length; i++) {
                if (annotationCollection[i].annotationId && (annotationCollection[i].annotationId === id)) {
                    if (annotationCollection[i].shapeAnnotationType === 'textMarkup') {
                        return annotationCollection[i];
                    } else {
                        annotationCollection = this.pdfViewer.annotations;
                        for (let j: number = 0; j < annotationCollection.length; j++) {
                            if (annotationCollection[j].annotName && (annotationCollection[j].annotName === id)) {
                                return annotationCollection[j];
                            }
                        }
                    }
                }
            }
        }
    }

    private checkAnnotationSettings(id: string): boolean {
        // eslint-disable-next-line
        let annotationCollection: any = this.pdfViewer.annotationCollection;
        if (annotationCollection) {
            for (let i: number = 0; i < annotationCollection.length; i++) {
                if (annotationCollection[i].annotationId && (annotationCollection[i].annotationId === id)) {
                    if (annotationCollection[i].annotationSettings && annotationCollection[i].annotationSettings.isLock) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    }

    private updateCommentsContainerWidth(): void {
        const accordionContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
        const commentsContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commentscontentcontainer');
        accordionContainer.style.width = commentsContentContainer.clientWidth + 'px';
    }

    /**
     * @param pageIndex
     * @private
     */
    public selectCommentsAnnotation(pageIndex: number): void {
        if (this.selectAnnotationObj && !this.isCommentsSelected) {
            if ((this.selectAnnotationObj.pageNumber - 1) === pageIndex) {
                // eslint-disable-next-line max-len
                this.setAnnotationType(this.selectAnnotationObj.id, this.selectAnnotationObj.annotType, this.selectAnnotationObj.pageNumber);
                this.selectAnnotationObj = null;
                this.isCommentsSelected = true;
            }
        }
    }

    private setAnnotationType(id: string, type: string, pageNumber: number): void {
        let typeString: string = (type === 'measure') ? 'shape_measure' : type;
        if (typeString === 'freeText') {
            typeString = 'freetext';
        }
        // eslint-disable-next-line
        let storeCommentObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_' + typeString);
        if (this.pdfViewerBase.isStorageExceed) {
            storeCommentObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + typeString];
        }
        if (storeCommentObject) {
            const annotationCommentObject: IPageAnnotations[] = JSON.parse(storeCommentObject);
            // eslint-disable-next-line
            let annotation: any = this.pdfViewer.selectedItems.annotations[0];
            // eslint-disable-next-line max-len
            const index: number = this.pdfViewer.annotationModule.
                getPageCollection(annotationCommentObject, (pageNumber - 1));
            if (annotationCommentObject[index]) {
                // eslint-disable-next-line
                let pageCollections: any = annotationCommentObject[index].annotations;
                for (let i: number = 0; i < pageCollections.length; i++) {
                    const currentSelector: AnnotationSelectorSettingsModel = pageCollections[i].annotationSelectorSettings;
                    if (pageCollections[i].annotName === id) {
                        if (annotation) {
                            this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                        }
                        this.pdfViewer.clearSelection(pageNumber - 1);
                        if (type === 'textMarkup') {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageNumber - 1, true);
                            // eslint-disable-next-line max-len
                            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + (pageNumber - 1));
                            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectAnnotation(pageCollections[i], canvas, (pageNumber - 1));
                            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation = pageCollections[i];
                            this.pdfViewer.annotation.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageNumber - 1;
                            this.pdfViewer.annotation.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                            if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                                // eslint-disable-next-line max-len
                                this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                            }
                        } else if (type === 'stamp') {
                            this.pdfViewer.select([pageCollections[i].randomId], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        } else if (type === 'sticky') {
                            this.pdfViewer.select([pageCollections[i].annotName], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        } else if (type === 'ink') {
                            this.pdfViewer.select([pageCollections[i].id], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        } else {
                            this.pdfViewer.select([pageCollections[i].id], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        }
                        if (type === 'textMarkup') {
                            if (pageCollections[i].rect || pageCollections[i].bounds) {
                                // eslint-disable-next-line max-len
                                const scrollValue: number = this.pdfViewerBase.pageSize[pageNumber - 1].top * this.pdfViewerBase.getZoomFactor() + (this.pdfViewer.annotationModule.getAnnotationTop(pageCollections[i]) * this.pdfViewerBase.getZoomFactor());
                                if (scrollValue) {
                                    const scroll: string = (scrollValue - 20).toString();
                                    // eslint-disable-next-line radix
                                    this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
                                }
                            }
                        } else {
                            let top: number = pageCollections[i].bounds.top;
                            if (type === 'ink') {
                                top = pageCollections[i].bounds.y;
                            }
                            // eslint-disable-next-line max-len
                            const scrollValue: number = this.pdfViewerBase.pageSize[pageNumber - 1].top * this.pdfViewerBase.getZoomFactor() + ((top) * this.pdfViewerBase.getZoomFactor());

                            const scroll: string = (scrollValue - 20).toString();
                            // eslint-disable-next-line radix
                            this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
                        }
                        this.isCommentsSelected = true;
                    }
                }
            }
        }
    }

    // eslint-disable-next-line
    private modifyTextProperty(text: string, previousValue: any, annotationName?: any): void {
        // eslint-disable-next-line
        let currentAnnotation: any;
        let module: any = this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        if (module && module.currentTextMarkupAnnotation) {
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        }
        if (currentAnnotation) {
            if (currentAnnotation.annotName !== annotationName) {
                currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
            }
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        if (annotationName && (currentAnnotation.annotName !== annotationName)) {
            for (let i: number = 0; i < this.pdfViewer.annotations.length; i++) {
                if (annotationName === this.pdfViewer.annotations[i].annotName) {
                    currentAnnotation = this.pdfViewer.annotations[i];
                    break;
                }
            }
        }
        if (currentAnnotation) {
            // eslint-disable-next-line
            let commentsDiv: HTMLElement = document.getElementById(currentAnnotation.annotName);
            if (commentsDiv) {
                // eslint-disable-next-line
                let pageNumber: any;
                if (commentsDiv.accessKey) {
                    // eslint-disable-next-line
                    pageNumber = parseInt(commentsDiv.accessKey);
                } else {
                    pageNumber = this.pdfViewerBase.currentPageNumber;
                }
                const type: string = commentsDiv.getAttribute('name');
                const pageIndex: number = pageNumber - 1;
                // eslint-disable-next-line
                let pageAnnotations: any;
                let isMeasure: boolean = false;
                // eslint-disable-next-line max-len
                if (currentAnnotation.shapeAnnotationType === 'FreeText' || (this.pdfViewer.enableShapeLabel && (type === 'shape' || type === 'shape_measure'))) {
                    let isTextAdded: boolean = false;
                    if (annotationName) {
                        if (currentAnnotation.annotName !== annotationName) {
                            this.pdfViewer.annotation.modifyDynamicTextValue(text, annotationName);
                            isTextAdded = true;
                        }
                    }
                    if (!isTextAdded) {
                        if (currentAnnotation.shapeAnnotationType === 'FreeText') {
                            if (currentAnnotation.dynamicText !== text) {
                                this.pdfViewer.annotation.modifyDynamicTextValue(text, currentAnnotation.annotName);
                            }
                            currentAnnotation.dynamicText = text;
                        } else {
                            this.pdfViewer.annotation.modifyDynamicTextValue(text, currentAnnotation.annotName);
                            currentAnnotation.labelContent = text;
                            currentAnnotation.notes = text;
                        }
                        this.pdfViewer.nodePropertyChange(currentAnnotation, {});
                    }
                }
                if (currentAnnotation.measureType && currentAnnotation.measureType !== '') {
                    pageAnnotations = this.getAnnotations(pageIndex, null, 'shape_measure');
                    isMeasure = true;
                } else {
                    pageAnnotations = this.getAnnotations(pageIndex, null, currentAnnotation.shapeAnnotationType);
                }
                if (pageAnnotations !== null && currentAnnotation.shapeAnnotationType !== 'FreeText') {
                    for (let i: number = 0; i < pageAnnotations.length; i++) {
                        if (pageAnnotations[i].annotName === currentAnnotation.annotName) {
                            // eslint-disable-next-line
                            let clonedObject: any = cloneObject(pageAnnotations[i]);
                            if (text !== null) {
                                if (pageAnnotations[i].note !== text) {
                                    // eslint-disable-next-line max-len
                                    this.pdfViewer.annotation.addAction(pageIndex, i, pageAnnotations[i], 'Text Property Added', '', clonedObject, pageAnnotations[i]);
                                    currentAnnotation = pageAnnotations[i];
                                    currentAnnotation.note = text;
                                    if (currentAnnotation.enableShapeLabel) {
                                        currentAnnotation.labelContent = text;
                                    }
                                    // eslint-disable-next-line max-len
                                    currentAnnotation.modifiedDate = this.getDateAndTime();
                                    if (!isMeasure) {
                                        this.updateUndoRedoCollections(currentAnnotation, pageIndex);
                                    } else {
                                        this.updateUndoRedoCollections(currentAnnotation, pageIndex, 'shape_measure');
                                    }
                                    if (!previousValue || previousValue === '') {
                                        // eslint-disable-next-line max-len
                                        this.pdfViewer.fireCommentAdd(currentAnnotation.annotName, currentAnnotation.note, currentAnnotation);
                                    } else {
                                        // eslint-disable-next-line max-len
                                        this.pdfViewer.fireCommentEdit(currentAnnotation.annotName, currentAnnotation.note, currentAnnotation);
                                    }
                                    return currentAnnotation;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param date
     * @private
     */
    // eslint-disable-next-line
    public getDateAndTime(date?: any): string {
        if (!date) {
            date = new Date();
        }
        this.globalize = new Internationalization();
        const dateOptions: object = { format: this.pdfViewer.dateTimeFormat, type: 'dateTime' };
        // eslint-disable-next-line
        let dateTime: string = this.globalize.formatDate(new Date(date), dateOptions);
        return dateTime;
    }

    // eslint-disable-next-line
    private modifyCommentsProperty(text: string, annotName: string, parentElement: string, previousValue?: any): any {
        // eslint-disable-next-line
        let currentAnnotation: any;
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        if (currentAnnotation) {
            // eslint-disable-next-line
            let commentsDiv: HTMLElement = document.getElementById(currentAnnotation.annotName);
            // eslint-disable-next-line
            let pageNumber: any = parseInt(commentsDiv.accessKey);
            const pageIndex: number = pageNumber - 1;
            // eslint-disable-next-line
            let pageAnnotations: any;
            let isMeasure: boolean = false;
            const author: string = this.getAuthorName(currentAnnotation, commentsDiv);
            if (currentAnnotation.measureType && currentAnnotation.measureType !== '') {
                pageAnnotations = this.getAnnotations(pageIndex, null, 'shape_measure');
                isMeasure = true;
            } else {
                pageAnnotations = this.getAnnotations(pageIndex, null, currentAnnotation.shapeAnnotationType);
            }
            if (pageAnnotations !== null) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (pageAnnotations[i].annotName === currentAnnotation.annotName) {
                        currentAnnotation = pageAnnotations[i];
                    }
                }
            }
            // eslint-disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            if (currentAnnotation.comments.length > 0) {
                let isComment: boolean = false;
                for (let j: number = 0; j < currentAnnotation.comments.length; j++) {
                    if (currentAnnotation.comments[j].annotName === annotName) {
                        isComment = true;
                        currentAnnotation.comments[j].note = text;
                        // eslint-disable-next-line max-len
                        currentAnnotation.comments[j].modifiedDate = this.getDateAndTime();
                    }
                }
                // eslint-disable-next-line max-len
                const newArray: ICommentsCollection = { annotName: annotName, parentId: parentElement, subject: 'Comments', comments: [], author: author, note: text, shapeAnnotationType: '', state: '', stateModel: '', modifiedDate: this.getDateAndTime(), review: { state: '', stateModel: '', modifiedDate: this.getDateAndTime(), author: author }, isLock: false };
                if (!isComment) {
                    currentAnnotation.comments[currentAnnotation.comments.length] = newArray;
                }
            } else {
                // eslint-disable-next-line max-len
                const newArray: ICommentsCollection = { annotName: annotName, parentId: parentElement, subject: 'Comments', comments: [], author: author, note: text, shapeAnnotationType: '', state: '', stateModel: '', modifiedDate: this.getDateAndTime(), review: { state: '', stateModel: '', modifiedDate: this.getDateAndTime(), author: author }, isLock: false };
                currentAnnotation.comments[currentAnnotation.comments.length] = newArray;
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(pageIndex, null, currentAnnotation, 'Comments Property Added', '', clonedObject, currentAnnotation);
            if (!isMeasure) {
                this.updateUndoRedoCollections(currentAnnotation, pageIndex);
            } else {
                this.updateUndoRedoCollections(currentAnnotation, pageIndex, 'shape_measure');
            }
        }
        if (previousValue !== undefined) {
            this.pdfViewer.fireCommentEdit(annotName, text, currentAnnotation);
        } else {
            this.pdfViewer.fireCommentAdd(annotName, text, currentAnnotation);
        }
    }

    // eslint-disable-next-line
    private modifyStatusProperty(text: string, statusElement: any): void {
        // eslint-disable-next-line
        let currentAnnotation: any;
        if (this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            currentAnnotation = this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        if (currentAnnotation) {
            // eslint-disable-next-line
            let commentsDiv: HTMLElement = document.getElementById(currentAnnotation.annotName);
            // eslint-disable-next-line
            let pageNumber: any = parseInt(commentsDiv.accessKey);
            const pageIndex: number = pageNumber - 1;
            // eslint-disable-next-line
            let pageAnnotations: any;
            let isMeasure: boolean = false;
            const author: string = commentsDiv.getAttribute('author');
            if (currentAnnotation.measureType && currentAnnotation.measureType !== '') {
                pageAnnotations = this.getAnnotations(pageIndex, null, 'shape_measure');
                isMeasure = true;
            } else {
                pageAnnotations = this.getAnnotations(pageIndex, null, currentAnnotation.shapeAnnotationType);
            }
            if (pageAnnotations !== null) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (pageAnnotations[i].annotName === currentAnnotation.annotName) {
                        currentAnnotation = pageAnnotations[i];
                    }
                }
            }
            // eslint-disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            if (statusElement.parentElement.firstChild.id === statusElement.id) {
                // eslint-disable-next-line max-len
                currentAnnotation.review = { state: text, stateModel: 'Review', author: author, modifiedDate: this.getDateAndTime(), annotId: statusElement.id };
                currentAnnotation.state = text;
                currentAnnotation.stateModel = 'Review';
                // eslint-disable-next-line max-len
                this.pdfViewer.annotation.addAction(pageIndex, null, currentAnnotation, 'Status Property Added', '', clonedObject, currentAnnotation);
                this.pdfViewer.fireCommentStatusChanged(statusElement.id, currentAnnotation.note, currentAnnotation, currentAnnotation.state);
            } else {
                for (let j: number = 0; j < currentAnnotation.comments.length; j++) {
                    if (currentAnnotation.comments[j].annotName === statusElement.id) {
                        // eslint-disable-next-line
                        let clonedObj: any = cloneObject(currentAnnotation.comments[j]);
                        currentAnnotation.comments[j].state = text;
                        currentAnnotation.comments[j].stateModel = 'Review';
                        // eslint-disable-next-line max-len
                        currentAnnotation.comments[j].review = { state: text, stateModel: 'Review', author: author, modifiedDate: this.getDateAndTime(), annotId: statusElement.id };
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotation.addAction(pageIndex, null, currentAnnotation, 'Status Property Added', '', clonedObj, currentAnnotation.comments[j]);
                        this.pdfViewer.fireCommentStatusChanged(currentAnnotation.comments[j].annotName, currentAnnotation.comments[j].note, currentAnnotation, currentAnnotation.comments[j].state);
                    }
                }
            }
            if (!isMeasure) {
                this.updateUndoRedoCollections(currentAnnotation, pageIndex);
            } else {
                this.updateUndoRedoCollections(currentAnnotation, pageIndex, 'shape_measure');
            }
        }
    }

    /**
     * @param commentsElement
     * @param replyElement
     * @private
     */
    // eslint-disable-next-line
    public modifyCommentDeleteProperty(commentsElement: any, replyElement: any): any {  
        // eslint-disable-next-line
        let clonedObject: any;
        // eslint-disable-next-line
        let clonedAnnotation: any;
        // eslint-disable-next-line
        let currentAnnotation: any;
        // eslint-disable-next-line
        let commentsParentElement: any = document.getElementById(commentsElement.id);
        if (commentsParentElement) {
            // eslint-disable-next-line
            let pageNumber: any = parseInt(commentsParentElement.accessKey);
            const pageIndex: number = pageNumber - 1;
            const annotType: string = commentsElement.getAttribute('name');
            // eslint-disable-next-line
            let pageAnnotations: any = this.getAnnotations(pageIndex, null, annotType);
            if (pageAnnotations !== null) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (pageAnnotations[i].annotName === commentsElement.id) {
                        currentAnnotation = pageAnnotations[i];
                    }
                }
            }
            for (let i: number = 1; i < commentsParentElement.childElementCount; i++) {
                if (commentsParentElement.childNodes[i].id === replyElement.id) {
                    clonedAnnotation = cloneObject(currentAnnotation);
                    const positionValue: number = (i - 1);
                    currentAnnotation.comments[positionValue].position = i;
                    clonedObject = cloneObject(currentAnnotation.comments[positionValue]);
                    // eslint-disable-next-line max-len
                    this.pdfViewer.fireCommentDelete(currentAnnotation.comments[positionValue].annotName, currentAnnotation.comments[positionValue].note, currentAnnotation);
                    currentAnnotation.comments.splice(positionValue, 1);
                    replyElement.remove();
                }
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(pageIndex, null, clonedAnnotation, 'Comments Reply Deleted', '', clonedObject, currentAnnotation);
            this.updateUndoRedoCollections(currentAnnotation, pageIndex);
        }
    }

    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public updateOpacityValue(annotation: any): void {
        // eslint-disable-next-line
        let pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null, annotation.shapeAnnotationType);
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (pageAnnotations[i].annotName === annotation.annotName) {
                    pageAnnotations[i].opacity = annotation.opacity;
                    this.updateUndoRedoCollections(pageAnnotations[i], annotation.pageIndex);
                }
            }
        }
    }

    /**
     * @param annotation
     * @param isAction
     * @param undoAnnotation
     * @param annotation
     * @param isAction
     * @param undoAnnotation
     * @param annotation
     * @param isAction
     * @param undoAnnotation
     * @private
     */
    // eslint-disable-next-line
    public undoAction(annotation: any, isAction: string, undoAnnotation?: any): any {
        if (isAction === 'Text Property Added') {
            if (annotation) {
                // eslint-disable-next-line
                let commentsMainDiv: any = document.getElementById(annotation.annotName);
                if (commentsMainDiv) {
                    // eslint-disable-next-line
                    let pageNumber: any = parseInt(commentsMainDiv.accessKey);
                    const pageIndex: number = pageNumber - 1;
                    // eslint-disable-next-line
                    let clonedAnnotationObject: any = cloneObject(annotation);
                    commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = undoAnnotation.note;
                    const value: string = undoAnnotation.note;
                    annotation.note = value;
                    if (commentsMainDiv.childElementCount === 2) {
                        commentsMainDiv.lastChild.style.display = 'block';
                    }
                    this.updateUndoRedoCollections(annotation, pageIndex);
                    return clonedAnnotationObject;
                }
            }
        } else if (isAction === 'Comments Property Added') {
            if (annotation.comments.length > 0) {
                // eslint-disable-next-line
                let commentsDiv: any = document.getElementById(annotation.annotName);
                let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
                if (commentsDiv) {
                    // eslint-disable-next-line
                    let pageNumber: any = parseInt(commentsDiv.accessKey);
                    pageIndex = pageNumber - 1;
                }
                // eslint-disable-next-line
                let clonedAnnotationObject: any = cloneObject(annotation);
                // eslint-disable-next-line
                let comment: any = annotation.comments[annotation.comments.length - 1];
                // eslint-disable-next-line
                let removeDiv: any = document.getElementById(comment.annotName);
                if (removeDiv) {
                    removeDiv.remove();
                }
                annotation = undoAnnotation;
                this.updateUndoRedoCollections(annotation, pageIndex);
                return clonedAnnotationObject;
            }
        } else if (isAction === 'Status Property Added') {
            if (annotation) {
                // eslint-disable-next-line
                let commentsDiv: any = document.getElementById(annotation.annotName);
                let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
                if (commentsDiv) {
                    // eslint-disable-next-line
                    let pageNumber: any = parseInt(commentsDiv.accessKey);
                    pageIndex = pageNumber - 1;
                }
                // eslint-disable-next-line
                let clonedAnnotationObject: any = cloneObject(annotation);
                if (annotation.annotName === undoAnnotation.annotName) {
                    annotation.review = undoAnnotation.review;
                    annotation.state = undoAnnotation.state;
                    annotation.stateModel = undoAnnotation.stateModel;
                    this.pdfViewer.annotation.redoCommentsElement.push(annotation);
                } else {
                    for (let j: number = 0; j < annotation.comments.length; j++) {
                        if (annotation.comments[j].annotName === undoAnnotation.annotName) {
                            annotation.comments[j].state = undoAnnotation.state;
                            annotation.comments[j].stateModel = undoAnnotation.stateModel;
                            annotation.comments[j].review = undoAnnotation.review;
                            this.pdfViewer.annotation.redoCommentsElement.push(annotation.comments[j]);
                            break;
                        }
                    }
                }
                // eslint-disable-next-line
                let activeDiv: any = document.getElementById(undoAnnotation.annotName);
                if (activeDiv.lastChild.id === this.pdfViewer.element.id + 'status' + '_container') {
                    activeDiv.lastChild.remove();
                } else {
                    if (activeDiv.firstChild.lastChild.id === this.pdfViewer.element.id + 'status' + '_container') {
                        activeDiv.firstChild.lastChild.remove();
                    }
                }
                this.updateUndoRedoCollections(annotation, pageIndex);
                return clonedAnnotationObject;
            }
        } else if (isAction === 'Comments Reply Deleted') {
            // eslint-disable-next-line
            let commentsDiv: any = document.getElementById(annotation.annotName);
            if (commentsDiv) {
                // eslint-disable-next-line
                let pageNumber: any = parseInt(commentsDiv.accessKey);
                const pageIndex: number = pageNumber - 1;
                this.renderComments(undoAnnotation, commentsDiv, true, annotation.annotName);
                this.pdfViewer.annotation.redoCommentsElement.push(undoAnnotation);
                this.updateUndoRedoCollections(annotation, pageIndex);
                return annotation;
            }
        } else if (isAction === 'dynamicText Change') {
            if (annotation) {
                // eslint-disable-next-line
                let commentsMainDiv: any = document.getElementById(annotation.annotName);
                if (commentsMainDiv) {
                    // eslint-disable-next-line
                    commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = undoAnnotation.dynamicText;
                    return annotation;
                }
            }
        }

    }

    /**
     * @param annotation
     * @param isAction
     * @param undoAnnotation
     * @param annotation
     * @param isAction
     * @param undoAnnotation
     * @private
     */
    // eslint-disable-next-line
    public redoAction(annotation: any, isAction: string, undoAnnotation?: any): any {
        if (isAction === 'Text Property Added') {
            // eslint-disable-next-line
            let commentsMainDiv: any = document.getElementById(annotation.annotName);
            if (commentsMainDiv) {
                // eslint-disable-next-line
                let pageNumber: any = parseInt(commentsMainDiv.accessKey);
                const pageIndex: number = pageNumber - 1;
                commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = annotation.note;
                commentsMainDiv.lastChild.style.display = 'block';
                this.updateUndoRedoCollections(annotation, pageIndex);
                return annotation;
            }
        } else if (isAction === 'Comments Property Added') {
            // eslint-disable-next-line
            let comment: any = annotation.comments[annotation.comments.length - 1];
            const commentsDiv: HTMLElement = document.getElementById(annotation.annotName);
            if (commentsDiv) {
                // eslint-disable-next-line
                let pageNumber: any = parseInt(commentsDiv.accessKey);
                const pageIndex: number = pageNumber - 1;
                this.renderComments(comment, commentsDiv, true, annotation.annotName);
                this.updateUndoRedoCollections(annotation, pageIndex);
                return annotation;
            }
        } else if (isAction === 'Status Property Added') {
            // eslint-disable-next-line
            let poppedItem: any = this.pdfViewer.annotation.redoCommentsElement.pop();
            let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            if (poppedItem) {
                // eslint-disable-next-line max-len
                const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                // eslint-disable-next-line max-len
                const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
                statusDiv.appendChild(statusSpan);
                statusContainer.appendChild(statusDiv);
                // eslint-disable-next-line
                let activeDiv: any = document.getElementById(annotation.annotName);
                if (activeDiv) {
                    // eslint-disable-next-line
                    let pageNumber: any = parseInt(activeDiv.accessKey);
                    pageIndex = pageNumber - 1;
                }
                // eslint-disable-next-line
                if (annotation.annotName === poppedItem.annotName) {
                    this.updateStatusContainer(annotation.state, statusSpan, statusDiv, statusContainer);
                    for (let i: number = 0; i < activeDiv.firstChild.children.length; i++) {
                        if (activeDiv.firstChild.children[i].id === this.pdfViewer.element.id + 'status_container') {
                            activeDiv.firstChild.children[i].parentElement.removeChild(activeDiv.firstChild.children[i]);
                        }
                    }
                    activeDiv.firstChild.appendChild(statusContainer);
                } else {
                    for (let i: number = 0; i < annotation.comments.length; i++) {
                        if (annotation.comments[i].annotName === poppedItem.annotName) {
                            this.updateStatusContainer(annotation.comments[i].state, statusSpan, statusDiv, statusContainer);
                            const statusElement: HTMLElement = document.getElementById(poppedItem.annotName);
                            for (let i: number = 0; i < statusElement.children.length; i++) {
                                if (statusElement.children[i].id === this.pdfViewer.element.id + 'status_container') {
                                    statusElement.children[i].parentElement.removeChild(statusElement.children[i]);
                                }
                            }
                            if (statusElement) {
                                statusElement.appendChild(statusContainer);
                            }
                        }
                    }
                }
            }
            this.updateUndoRedoCollections(annotation, pageIndex);
            return annotation;
        } else if (isAction === 'Comments Reply Deleted') {
            let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            // eslint-disable-next-line
            let activeDiv: any = document.getElementById(annotation.annotName);
            if (activeDiv) {
                // eslint-disable-next-line
                let pageNumber: any = parseInt(activeDiv.accessKey);
                pageIndex = pageNumber - 1;
            }
            // eslint-disable-next-line
            let poppedItem: any = this.pdfViewer.annotation.redoCommentsElement.pop();
            // eslint-disable-next-line
            let clonedAnnotationObject: any = cloneObject(annotation);
            for (let i: number = 0; i < annotation.comments.length; i++) {
                if (annotation.comments[i].annotName === poppedItem.annotName) {
                    // eslint-disable-next-line
                    let replyElement: any = document.getElementById(poppedItem.annotName);
                    annotation.comments.splice(i, 1);
                    replyElement.remove();
                }
            }
            this.updateUndoRedoCollections(annotation, pageIndex);
            return clonedAnnotationObject;
        } else if (isAction === 'dynamicText Change') {
            if (annotation) {
                // eslint-disable-next-line
                let commentsMainDiv: any = document.getElementById(annotation.annotName);
                if (commentsMainDiv) {
                    // eslint-disable-next-line
                    commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = annotation.dynamicText;
                    return annotation;
                }
            }
        }
    }

    // eslint-disable-next-line
    private updateUndoRedoCollections(annotationBase: any, pageNumber: number, shapeType?: string, action?: string): void {
        let annotationType: string = (!shapeType) ? annotationBase.shapeAnnotationType : shapeType;
        if (annotationBase.indent && annotationBase.indent !== '') {
            annotationType = 'shape_measure';
        }
        // eslint-disable-next-line
        let pageAnnotations: any = this.getAnnotations(pageNumber, null, annotationType);
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.annotName === pageAnnotations[i].annotName) {
                    pageAnnotations[i] = annotationBase;
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                    if (action) {
                        pageAnnotations.splice(i, 1);
                        this.deleteStickyNotesAnnotations(pageAnnotations, pageNumber);
                    }
                }
            }
            if (annotationType === 'shape_measure') {
                this.manageAnnotations(pageAnnotations, pageNumber, 'shape_measure');
            } else {
                this.manageAnnotations(pageAnnotations, pageNumber, annotationBase.shapeAnnotationType);
            }
        }
    }

    /**
     * @param pageIndex
     * @param type
     * @private
     */
    // eslint-disable-next-line
    public addAnnotationComments(pageIndex: any, type: string): void {
        const pageNumber: number = pageIndex + 1;
        // eslint-disable-next-line
        let poppedItem: any = this.pdfViewer.annotation.undoCommentsElement.pop();
        if (poppedItem) {
            this.createCommentsContainer(poppedItem, pageNumber);
            this.updateUndoRedoCollections(poppedItem, pageIndex, type);
        }
    }

    /**
     * @param annotation
     * @param type
     * @param action
     * @private
     */
    // eslint-disable-next-line
    public findPosition(annotation: any, type: string, action?: string): any {
        let index: number;
        // eslint-disable-next-line
        let commentsDiv: any = document.getElementById(annotation.annotName);
        if (commentsDiv) {
            // eslint-disable-next-line
            let pageNumber: any = parseInt(commentsDiv.accessKey);
            const pageIndex: number = pageNumber - 1;
            // eslint-disable-next-line
            let parentDiv: any = commentsDiv.parentElement;
            for (let i: number = 0; i < parentDiv.childElementCount; i++) {
                if (parentDiv.childNodes[i].id === annotation.annotName) {
                    index = i;
                }
            }
            if (type === 'Stamp' || type === 'Image') {
                type = 'stamp';
            } else if (type === 'FreeText') {
                type = 'freetext';
            } else if (type === 'StickyNotes' || type === 'sticky') {
                type = 'sticky';
            } else if (type === 'Ink') {
                type = 'ink';
            }
            // eslint-disable-next-line
            let pageAnnotations: any = this.getAnnotations(pageIndex, null, type);
            if (pageAnnotations !== null) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (pageAnnotations[i].annotName === annotation.annotName) {
                        // eslint-disable-next-line
                        let clonedObject: any = cloneObject(pageAnnotations[i]);
                        pageAnnotations[i].position = index;
                        this.pdfViewer.annotation.undoCommentsElement.push(pageAnnotations[i]);
                        if (type === 'sticky') {
                            this.updateUndoRedoCollections(clonedObject, pageIndex, null, action);
                        }
                    }
                }
            }
        }
    }

    // eslint-disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[], type: string): any[] {
        // eslint-disable-next-line
        let annotationCollection: any[];
        if (type === 'Stamp' || type === 'stamp' || type === 'Image') {
            type = 'stamp';
        } else if (type === 'StickyNotes' || type === 'sticky') {
            type = 'sticky';
        } else if (type === 'textMarkup') {
            type = 'textMarkup';
        } else if (type === 'shape' || type === 'Line' || type === 'Radius' || type === 'Rectangle' || type === 'Ellipse'
            || type === 'Polygon' || type === 'LineWidthArrowHead' || type === 'Square' || type === 'Circle') {
            type = 'shape';
        } else if (type === 'FreeText' || type === 'freetext' || type === 'freeText') {
            type = 'freetext';
        } else if (type === 'ink' || type === 'Ink') {
            type = 'ink';
        } else {
            type = 'shape_measure';
        }
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_' + type);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + type];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
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

    // eslint-disable-next-line
    private manageAnnotations(pageAnnotations: any, pageNumber: number, type: string): void {
        if (type === 'Stamp' || type === 'stamp') {
            type = 'stamp';
        } else if (type === 'Sticky' || type === 'sticky') {
            type = 'sticky';
        } else if (type === 'textMarkup') {
            type = 'textMarkup';
        } else if (type === 'shape' || type === 'Line' || type === 'Radius' || type === 'Rectangle' || type === 'Ellipse'
            || type === 'Polygon' || type === 'LineWidthArrowHead' || type === 'Square' || type === 'Circle') {
            type = 'shape';
        } else if (type === 'FreeText') {
            type = 'freetext';
        } else if (type === 'ink' || type === 'Ink') {
            type = 'ink';
        } else {
            type = 'shape_measure';
        }
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_' + type);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + type];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_' + type);
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + type] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_' + type, annotationStringified);
            }
        }
    }

    // eslint-disable-next-line
    public updateStickyNotes(annotation: any, id: any): any {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'];
        }
        if (storeObject) {
            // eslint-disable-next-line
            let bounds: any = annotation.bounds;
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            for (let k: number = 0; k < annotObject.length; k++) {
                // eslint-disable-next-line
                let currentAnnot: any = annotObject[k];
                for (let j: number = 0; j < currentAnnot.annotations.length; j++) {
                    if (annotObject[k].annotations[j].annotName === annotation.annotName) {
                        if (!this.pdfViewerBase.isStorageExceed) {
                            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
                        }
                        const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, 0);
                        if (annotObject[pageIndex]) {
                            // eslint-disable-next-line max-len
                            annotObject[k].annotations[j].bounds = { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height, right: bounds.right, bottom: bounds.bottom };
                        }
                        const annotationStringified: string = JSON.stringify(annotObject);
                        if (this.pdfViewerBase.isStorageExceed) {
                            // eslint-disable-next-line max-len
                            this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'] = annotationStringified;
                        } else {
                            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sticky', annotationStringified);
                        }
                        break;
                    }
                }
            }
        }
    }

    // eslint-disable-next-line
    public saveStickyAnnotations(): any {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'];
        }
        // eslint-disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IPopupAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // eslint-disable-next-line max-len
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }

    // eslint-disable-next-line
    private deleteStickyNotesAnnotations(pageAnnotations: any, pageNumber: number): void {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sticky', annotationStringified);
            }
        }
    }

    // eslint-disable-next-line
    public addStickyNotesAnnotations(pageNumber: number, annotationBase: any): void {
        const pageAnnotations: IPopupAnnotation[] = this.getAnnotations(pageNumber, null, 'sticky');
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber, 'sticky');
    }

    /**
     * @param annotName
     * @param text
     * @private
     */
    public addTextToComments(annotName: string, text: string): void {
        // eslint-disable-next-line
        let commentsMainDiv: any = document.getElementById(annotName);
        if (commentsMainDiv) {
            commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = text;
        }
    }

    /**
     * @param newAnnotation
     * @param annotation
     * @param isCut
     * @param newAnnotation
     * @param annotation
     * @param isCut
     * @param newAnnotation
     * @param annotation
     * @param isCut
     * @private
     */
    // eslint-disable-next-line
    public updateAnnotationCollection(newAnnotation: any, annotation: any, isCut: boolean): void {
        const type: string = this.findAnnotationType(annotation);
        // eslint-disable-next-line
        let pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null, type);
        if (isCut) {
            pageAnnotations = this.pdfViewer.annotationModule.removedAnnotationCollection;
        }
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (isCut && !pageAnnotations[i].annotName) {
                    pageAnnotations[i].annotName = pageAnnotations[i].annotationId;
                }
                if (pageAnnotations[i].annotName === annotation.annotName) {
                    // eslint-disable-next-line
                    let updateAnnotation: any = cloneObject(pageAnnotations[i]);
                    updateAnnotation.annotName = newAnnotation.annotName;
                    if (type === 'shape' || type === 'shape_measure' || type === 'freetext' || type === 'ink') {
                        updateAnnotation.id = newAnnotation.id;
                    }
                    if (type === 'stamp') {
                        updateAnnotation.randomId = newAnnotation.id;
                    }
                    if (type === 'ink') {
                        updateAnnotation.bounds.x = newAnnotation.bounds.x;
                        updateAnnotation.bounds.y = newAnnotation.bounds.y;
                    } else {
                        updateAnnotation.bounds.left = newAnnotation.bounds.x;
                        updateAnnotation.bounds.top = newAnnotation.bounds.y;
                        updateAnnotation.vertexPoints = newAnnotation.vertexPoints;
                    }
                    updateAnnotation.note = updateAnnotation.note ? updateAnnotation.note : '';
                    updateAnnotation.comments = [];
                    // eslint-disable-next-line max-len
                    updateAnnotation.review = { state: '', stateModel: '', modifiedDate: updateAnnotation.ModifiedDate, author: updateAnnotation.author };
                    updateAnnotation.state = '';
                    updateAnnotation.stateModel = '';
                    this.pdfViewer.annotationModule.storeAnnotations(annotation.pageIndex, updateAnnotation, '_annotations_' + type);
                    this.createCommentsContainer(updateAnnotation, annotation.pageIndex + 1, true);
                    if (isCut) {
                        this.pdfViewer.annotationModule.removedAnnotationCollection = [];
                    }
                    break;
                }
            }
        }
    }

    private findAnnotationType(annotation: PdfAnnotationBaseModel): string {
        let annotType: string;
        if (annotation.measureType !== '') {
            annotType = 'shape_measure';
        } else {
            if (annotation.shapeAnnotationType === 'StickyNotes') {
                annotType = 'sticky';
            } else if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
                annotType = 'stamp';
            } else if (annotation.shapeAnnotationType === 'FreeText') {
                annotType = 'freetext';
            } else if (annotation.shapeAnnotationType === 'Ink') {
                annotType = 'ink';
            } else {
                annotType = 'shape';
            }
        }
        return annotType;
    }

    private setExistingAnnotationModifiedDate(date: string): string {
        let modifiedDateTime: string;
        if (date !== '') {
            modifiedDateTime = this.setModifiedDate(date);
        } else {
            modifiedDateTime = this.setModifiedDate();
        }
        return modifiedDateTime;
    }

    private updateModifiedTime(time: number, minutes: string): string {
        let modifiedTime: string;
        if (time >= 12) {
            if (time === 12) {
                modifiedTime = time + ':' + minutes + ' PM';
            } else {
                modifiedTime = (time - 12) + ':' + minutes + ' PM';
            }
        } else {
            modifiedTime = time + ':' + minutes + ' AM';
        }
        return modifiedTime;
    }

    private setModifiedDate(data?: string): string {
        let dateTime: string;
        if (data) {
            dateTime = this.getDateAndTime(data);
        } else {
            dateTime = this.getDateAndTime();
        }
        const date: Date = new Date(dateTime);
        let modifiedTime: string;
        const modifiedDate: string = date.toString().split(' ').splice(1, 2).join(' ');
        if (date.toLocaleTimeString().split(' ').length === 2) {
            // eslint-disable-next-line max-len
            modifiedTime = date.toLocaleTimeString().split(' ')[0].split(':').splice(0, 2).join(':') + ' ' + date.toLocaleTimeString().split(' ')[1];
        } else {
            // eslint-disable-next-line
            let time: number = parseInt(date.toLocaleTimeString().split(':')[0]);
            const minutes: string = date.toLocaleTimeString().split(':')[1];
            modifiedTime = this.updateModifiedTime(time, minutes);
        }
        const modifiedDateTime: string = modifiedDate + ', ' + modifiedTime;
        return modifiedDateTime;
    }

    // eslint-disable-next-line
    private updateModifiedDate(titleContainer: any): void {
        if (titleContainer.id === this.pdfViewer.element.id + '_commenttype_icon') {
            titleContainer = titleContainer.nextSibling;
        }
        const author: string = titleContainer.textContent.split('-')[0];
        titleContainer.textContent = author + ' - ' + this.setModifiedDate();
    }

    /**
     * @param annotation
     * @param isBounds
     * @param isUndoRedoAction
     * @private
     */
    // eslint-disable-next-line
    public updateAnnotationModifiedDate(annotation: any, isBounds?: boolean, isUndoRedoAction?: boolean): void {
        // eslint-disable-next-line
        let titleContainer: any;
        if (annotation) {
            // eslint-disable-next-line
            let commentsContainer: any = document.getElementById(annotation.annotName);
            if (commentsContainer) {
                if (!isBounds) {
                    titleContainer = commentsContainer.firstChild.firstChild.childNodes[1];
                    const author: string = titleContainer.textContent.split('-')[0];
                    titleContainer.textContent = author + ' - ' + this.setModifiedDate();
                } else {
                    const type: string = this.findAnnotationType(annotation);
                    // eslint-disable-next-line
                    let pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null, type);
                    if (pageAnnotations != null && annotation) {
                        for (let i: number = 0; i < pageAnnotations.length; i++) {
                            if (annotation.annotName === pageAnnotations[i].annotName) {
                                // eslint-disable-next-line max-len
                                if (annotation.bounds.x !== pageAnnotations[i].bounds.left || annotation.bounds.y !== pageAnnotations[i].bounds.top || annotation.bounds.height !== pageAnnotations[i].bounds.height || annotation.bounds.width !== pageAnnotations[i].bounds.width) {
                                    titleContainer = commentsContainer.firstChild.firstChild.childNodes[1];
                                    const author: string = titleContainer.textContent.split('-')[0];
                                    titleContainer.textContent = author + ' - ' + this.setModifiedDate();
                                }
                            }
                            if (pageAnnotations[i].shapeAnnotationType === 'sticky') { 
                                this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], annotation.pageIndex); 
                            }
                        }
                    }
                }
                if (isUndoRedoAction) {
                    titleContainer = commentsContainer.firstChild.firstChild.childNodes[1];
                    if (annotation.modifiedDate !== undefined) {
                        const author: string = titleContainer.textContent.split('-')[0];
                        titleContainer.textContent = author + ' - ' + this.setExistingAnnotationModifiedDate(annotation.modifiedDate);
                    }
                }
            }
        }
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public saveImportedStickyNotesAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: IPopupAnnotation = null;
        if (!annotation.Author) {
            // eslint-disable-next-line max-len
            annotation.Author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author;
        }
        // eslint-disable-next-line max-len
        const isLock: boolean = this.pdfViewer.stickyNotesSettings.isLock ? this.pdfViewer.stickyNotesSettings.isLock : this.pdfViewer.annotationSettings.isLock;
        // eslint-disable-next-line
        let allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotationObject = {
            // eslint-disable-next-line max-len
            shapeAnnotationType: 'sticky', author: annotation.Author, allowedInteractions: allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, note: annotation.Note, opacity: annotation.Opacity, state: annotation.State, stateModel: annotation.StateModel,
            pathData: '', comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            // eslint-disable-next-line max-len
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            annotName: annotation.AnnotName, color: annotation.color,
            annotationSelectorSettings: this.getSettings(annotation),
            customData: this.pdfViewer.annotation.getCustomData(annotation),
            annotationSettings: { isLock: isLock }, isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_sticky');
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public updateStickyNotesAnnotationCollections(annotation: any, pageNumber: number): any {
        // eslint-disable-next-line
        let annotationObject: any = null;
        if (!annotation.Author) {
            // eslint-disable-next-line max-len
            annotation.Author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author;
        }
        // eslint-disable-next-line max-len
        let isLock: boolean = this.pdfViewer.stickyNotesSettings.isLock ? this.pdfViewer.stickyNotesSettings.isLock : this.pdfViewer.annotationSettings.isLock;
        // eslint-disable-next-line
        let allowedInteractions: any = annotation.AllowedInteraction ? annotation.AllowedInteraction : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        if (annotation.IsLock) {
            isLock = annotation.isLock;
        }
        annotationObject = {
            // eslint-disable-next-line max-len
            shapeAnnotationType: 'sticky', author: annotation.Author, allowedInteractions: allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, note: annotation.Note, opacity: annotation.Opacity, state: annotation.State, stateModel: annotation.StateModel,
            pathData: '', comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            // eslint-disable-next-line max-len
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            annotationId: annotation.AnnotName, color: annotation.color, pageNumber: pageNumber,
            customData: this.pdfViewer.annotation.getCustomData(annotation),
            annotationSettings: { isLock: isLock }, isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
        };
        return annotationObject;
    }

    /**
     * @private
     */
    public clear(): void {
        this.commentsCount = 0;
        this.commentsreplyCount = 0;
        this.isAccordionContainer = true;
        this.isEditableElement = false;
        this.isCreateContextMenu = false;
        this.isPageCommentsRendered = false;
        this.isCommentsRendered = false;
        this.isAnnotationRendered = false;
        if (this.commentMenuObj) {
            this.commentMenuObj.destroy();
        }
        // eslint-disable-next-line
        let accordionPages: any = document.querySelectorAll('.e-pv-accordion-page-container');
        if (accordionPages) {
            for (let j: number = 0; j < accordionPages.length; j++) {
                // eslint-disable-next-line
                (accordionPages[j] as any).remove();
            }
        }
        if (this.commentsRequestHandler) {
            this.commentsRequestHandler.clear();
        } 
    }

    /**
     * @private
     */
    public getModuleName(): string {
        return 'StickyNotesAnnotation';
    }

    /** 
     * This method used to add annotations with using program.
     * 
     * @param annotationObject - It describes type of annotation object
     * @param offset - It describes about the annotation bounds or location
     * @returns Object
     * @private
     */
    public updateAddAnnotationDetails(annotationObject: StickyNotesSettings, offset: IPoint): Object 
    {
        //Creating new object if annotationObject is null
        if(!annotationObject)
        {
         annotationObject = { offset: { x: 1, y: 1}, pageNumber: 0} as StickyNotesSettings;
         offset = annotationObject.offset;
        }
        else if(!annotationObject.offset)
         offset = { x: 1, y: 1};
        else
         offset = annotationObject.offset;

        //Creating the CurrentDate and Annotation name
        let currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        let annotationName: string = this.pdfViewer.annotation.createGUID();

        //Creating annotation settings
        let annotationSelectorSettings: any = this.pdfViewer.stickyNotesSettings.annotationSelectorSettings ? this.pdfViewer.stickyNotesSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
        let annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.stickyNotesSettings);
        let allowedInteractions: any = this.pdfViewer.stickyNotesSettings.allowedInteractions ? this.pdfViewer.stickyNotesSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
        annotationSettings.isLock = annotationObject.isLock?annotationObject.isLock:false;

        //Creating Annotation objects with it's proper properties
        let stickyNotesAnnotation: any = [];
        let stickyNotes :any = 
        {
             AllowedInteractions: annotationObject.allowedInteractions?annotationObject.allowedInteractions:allowedInteractions,
             AnnotName: annotationName,
             AnnotType: 'sticky',
             AnnotationFlags: null,
             AnnotationSelectorSettings: annotationObject.annotationSelectorSettings?annotationObject.annotationSelectorSettings: annotationSelectorSettings,       
             AnnotationSettings: annotationSettings,
             Author: annotationObject.author ? annotationObject.author : 'Guest',
             Bounds: {X: offset.x, Y: offset.y, Width: 30, Height: 30, Left: offset.x, Top: offset.y, Location:{X: offset.x,Y: offset.y}, Size:{Height: 30,IsEmpty: false,Width: 30}},
             Color: {IsEmpty: false, B: 51, Blue: 0.2, C: 0, G: 255},
             Comments: null,
             CreatedDate: currentDateString,
             CustomData: annotationObject.customData?annotationObject.customData:null,
             ExistingCustomData: null,
             Icon: 'Comment',
             IsCommentLock: false,
             IsLock: annotationObject.isLock?annotationObject.isLock:false,
             IsPrint: annotationObject.isPrint?annotationObject.isPrint:true,
             ModifiedDate: currentDateString,
             Note: "",
             Opacity: annotationObject.opacity?annotationObject.opacity:1,
             Reference: null,
             Size: {IsEmpty: true, Width: 0, Height: 0},
             State: "",
             StateModel: "",
             StrokeColor: null,
             SubType: null,
             Subject: 'Sticky Note',
             Type: null
         }     

         //Adding the annotation object to an array and return it
         stickyNotesAnnotation[0] = stickyNotes;
         return {stickyNotesAnnotation};  
    }

    /**
     * @private
    */
    private getAnnotationType(type: any): any {
        let annotationType : any;
        if (type === 'stamp' || type === 'Stamp') {
            annotationType = 'stamp';
        }
        else if (type === 'shape' || type === 'Line' || type === 'Radius' || type === 'Rectangle' || type === 'Ellipse'
            || type === 'Polygon' || type === 'LineWidthArrowHead' || type === 'Square' || type === 'Circle') {
            annotationType = 'shape';
        }
        else if (type === 'textMarkup') {
            annotationType = 'textMarkup';
        }
        else if (type === 'freeText' || type ==='FreeText') {
            annotationType = 'freeText';
        }
        else if (type === 'sticky' || type === 'StickyNotes') {
            annotationType = 'sticky';
        }
        else if (type === 'measure' || type === 'shape_measure') {
            annotationType = 'measure';
        }
        else if (type === 'ink' || type === 'Ink') {
            annotationType = 'ink';
        }
        return annotationType;
    }

    /**
     * @private
    */
    private getAuthorName(annotation: any, commonDiv: any): string {
        let author: string;
        if(annotation){
            let type: any = annotation.shapeAnnotationType;
            let annotationType : any = this.getAnnotationType(type);
            author = this.pdfViewer.annotationModule.updateAnnotationAuthor(annotationType, type);
        }
        else{
            author =  commonDiv.getAttribute('author');
        }
        return author;
    }
}
