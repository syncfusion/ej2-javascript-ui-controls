import { StickyNotesSettings } from './../pdfviewer';
import { PdfViewerBase, PdfViewer, IPageAnnotations, AjaxHandler, AllowedInteraction, IPoint } from '../index';
import { createElement, Browser, Internationalization, isBlazor, isNullOrUndefined, SanitizeHtmlHelper} from '@syncfusion/ej2-base';
import { Accordion, BeforeOpenCloseMenuEventArgs, ContextMenu as Context, MenuItemModel } from '@syncfusion/ej2-navigations';
import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { cloneObject } from '../drawing/drawing-util';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';

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
    bounds: any;
    color: any;
    opacity: number
    state: string;
    stateModel: string
    comments: ICommentsCollection[]
    review: IReviewCollection
    annotName: string
    pageNumber: number
    annotationSelectorSettings: AnnotationSelectorSettingsModel
    customData: object
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
    private moreButtonId : string = '';
    private commentsCount: number = 0;
    private commentsreplyCount: number = 0;
    private commentContextMenu: MenuItemModel[] = [];
    private isAccordionContainer: boolean = true;
    private isSetAnnotationType: boolean;
    private isNewcommentAdded: boolean;
    private isCreateContextMenu: boolean = false;
    private commentsRequestHandler: AjaxHandler;
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
     * @private
     */
    public textFromCommentPanel: boolean = false;

    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdfviewer
     * @param {PdfViewerBase} pdfViewerBase - It describes about the pdfviewer base
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.opacity = this.pdfViewer.stickyNotesSettings.opacity ? this.pdfViewer.stickyNotesSettings.opacity : 1;
    }

    /**
     * @param {any} stickyAnnotations - It describes about the sticky annotations
     * @param {number} pageNumber - It describes about the page number
     * @param {any} canvas - It describes about the canvas
     * @private
     * @returns {void}
     */
    public renderStickyNotesAnnotations(stickyAnnotations: any, pageNumber: number, canvas?: any): void {
        if (stickyAnnotations) {
            if (stickyAnnotations.length > 0) {
                for (let i: number = 0; i < stickyAnnotations.length; i++) {
                    const annotation: any = stickyAnnotations[parseInt(i.toString(), 10)];
                    let isAdded: boolean = false;
                    const pageAnnotations: any = this.getAnnotations(pageNumber, null, 'sticky');
                    if (pageAnnotations !== null) {
                        for (let k: number = 0; k < pageAnnotations.length; k++) {
                            const annotationName: string = annotation.annotName ? annotation.annotName : annotation.AnnotName;
                            const pageAnnotationName: string = pageAnnotations[parseInt(k.toString(), 10)].annotName ?
                                pageAnnotations[parseInt(k.toString(), 10)].annotName :
                                pageAnnotations[parseInt(k.toString(), 10)].AnnotName;
                            if (pageAnnotationName && annotationName && pageAnnotationName === annotationName) {
                                isAdded = true;
                                break;
                            }
                        }
                    }
                    if (!isAdded) {
                        annotation.annotationAddMode =
                         this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        let annotationObject: IPopupAnnotation = null;
                        const position: any = annotation.Bounds;
                        const author: string = annotation.Author;
                        annotation.AnnotationSettings = annotation.AnnotationSettings ?
                            annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                        annotation.allowedInteractions = annotation.AllowedInteraction ?
                            annotation.AllowedInteraction : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                        let isPrint: boolean = true;
                        if (annotation.annotationAddMode === 'Imported Annotation') {
                            isPrint = annotation.IsPrint;
                        } else {
                            isPrint = annotation.AnnotationSettings.isPrint;
                        }
                        if (annotation.IsLock || annotation.IsLocked) {
                            annotation.AnnotationSettings.isLock = annotation.IsLock ? annotation.IsLock : annotation.IsLocked;
                        }
                        annotationObject = {
                            shapeAnnotationType: 'sticky', author: author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, note: annotation.Note, opacity: annotation.Opacity, state: annotation.State, stateModel: annotation.StateModel,
                            pathData: '', comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: author }, pageNumber: pageNumber,
                            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
                            annotName: annotation.AnnotName, color: annotation.color,
                            annotationSelectorSettings: this.getSettings(annotation),
                            customData: this.pdfViewer.annotation.getCustomData(annotation),
                            annotationSettings: annotation.AnnotationSettings, allowedInteractions: annotation.allowedInteractions,
                            isPrint: isPrint, isCommentLock: annotation.IsCommentLock
                        };
                        annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ?
                            annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                        const annot: PdfAnnotationBaseModel = {
                            author: author, modifiedDate: annotationObject.modifiedDate, annotName: annotationObject.annotName, pageIndex: pageNumber, bounds: { x: position.Left, y: position.Top, width: position.Width, height: position.Height }, strokeColor: 'transparent', stampStrokeColor: '', data: this.setImageSource(), shapeAnnotationType: 'StickyNotes',
                            subject: annotationObject.subject, notes: annotationObject.note, opacity: annotationObject.opacity,
                            id: annotationObject.annotName, fillColor: annotationObject.color,
                            annotationSelectorSettings: annotation.AnnotationSelectorSettings,
                            annotationSettings: annotationObject.annotationSettings,
                            annotationAddMode: annotation.annotationAddMode, isPrint: isPrint, isCommentLock: annotationObject.isCommentLock
                        };
                        if (canvas) {
                            this.drawStickyNotes(position.Left, position.Top, position.Width, position.Height, pageNumber, annot, canvas);
                        } else {
                            this.pdfViewer.add(annot as PdfAnnotationBase);
                            this.drawStickyNotes(position.Left, position.Top, position.Width, position.Height, pageNumber, annot);
                            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_sticky');
                        }
                        if (this.isAddAnnotationProgramatically)
                        {
                            const settings: any = {
                                opacity: annot.opacity, borderColor: annot.strokeColor, borderWidth: annot.thickness,
                                author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                                fillColor: annot.fillColor, fontSize: annot.fontSize, width: annot.bounds.width,
                                height: annot.bounds.height, fontColor: annot.fontColor, fontFamily: annot.fontFamily,
                                defaultText: annot.dynamicText, fontStyle: annot.font, textAlignment: annot.textAlign
                            };
                            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'StickyNotes', annot.bounds, settings);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @private
     * @returns {any} - any
     */
    public getSettings(annotation: any): any {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = typeof(annotation.AnnotationSelectorSettings) === 'string' ? JSON.parse(annotation.AnnotationSelectorSettings) : annotation.AnnotationSelectorSettings;
        } else if (this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.stickyNotesSettings.annotationSelectorSettings;
        }
        return selector;
    }

    /**
     * @param {number} X - It describes about the X
     * @param {number} Y - It describes about the Y
     * @param {number} width - It describes about the width
     * @param {number} height - It describes about the height
     * @param {number} pageIndex - It describes about the page index
     * @param {any} annotation - It describes about the annotation
     * @param {any} canvas - It describes about the canvas
     * @private
     * @returns {void}
     */
    public drawStickyNotes(X: number, Y: number, width: number, height: number, pageIndex: number, annotation: any, canvas?: any): void {
        let annot: PdfAnnotationBaseModel;
        let annotationObject: IPopupAnnotation = null;
        const image: HTMLImageElement = new Image();
        // eslint-disable-next-line
        const proxy: any = this;
        image.onload = (): void => {
            let commentsDivid: string;
            let annotationName: string;
            const author: string = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author;
            const subject: string = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.stickyNotesSettings.subject ? this.pdfViewer.stickyNotesSettings.subject : 'Sticky Note';
            const annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.stickyNotesSettings);
            if (annotation) {
                annot = {
                    author: annotation.author, modifiedDate: annotation.modifiedDate, annotName: annotation.annotName, annotationSettings: annotation.annotationSettings && annotation.annotationSettings !== '' ? annotation.annotationSettings : annotationSettings,
                    data: image.src, bounds: { x: X, y: Y, width: width, height: height }, subject: annotation.subject,
                    notes: annotation.notes, opacity: annotation.opacity, id: annotation.annotName, shapeAnnotationType: 'StickyNotes', strokeColor: 'transparent', stampStrokeColor: '', pageIndex: annotation.pageIndex, isPrint: annotation.isPrint
                };
            } else {
                annotationName = this.pdfViewer.annotation.createGUID();
                commentsDivid = proxy.addComments('sticky', pageIndex + 1);
                if (commentsDivid) {
                    document.getElementById(commentsDivid).id = annotationName;
                }
                const annotationSelectorSettings: any = this.pdfViewer.stickyNotesSettings.annotationSelectorSettings ?
                    this.pdfViewer.stickyNotesSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                const isPrint: boolean = this.pdfViewer.stickyNotesSettings.isPrint;
                annot = {
                    bounds: { x: X, y: Y, width: width, height: height }, pageIndex: pageIndex, data: image.src,
                    modifiedDate: this.getDateAndTime(), annotationSettings: annotationSettings,
                    shapeAnnotationType: 'StickyNotes', strokeColor: 'transparent', stampStrokeColor: '', annotName: annotationName, id: annotationName, opacity: this.opacity, isPrint: isPrint
                };
                const isLock: boolean = this.pdfViewer.stickyNotesSettings.isLock ?
                    this.pdfViewer.stickyNotesSettings.isLock : this.pdfViewer.annotationSettings.isLock;
                const allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                annotationObject = {
                    author: author, allowedInteractions: allowedInteractions, modifiedDate: this.getDateAndTime(), subject: subject, shapeAnnotationType: 'sticky', pageNumber: pageIndex,
                    note: '', opacity: this.opacity, pathData: '', state: '', stateModel: '', color: 'rgba(255,255,0)', comments: [], annotName: annotationName,
                    bounds: { left: X, top: Y, width: width, height: height }, review: { state: '', stateModel: '', modifiedDate: '', author: author },
                    annotationSelectorSettings: annotationSelectorSettings,
                    customData: this.pdfViewer.annotationModule.getData('sticky'), annotationSettings: { isLock: isLock }, isPrint: isPrint, isCommentLock: false
                };
            }
            if (!annotation) {
                proxy.pdfViewer.annotation.addAction(pageIndex, null, annot as PdfAnnotationBase, 'Addition', '', annot as PdfAnnotationBase, annot);
                proxy.pdfViewer.add(annot as PdfAnnotationBase);
                proxy.pdfViewer.annotationModule.storeAnnotations(pageIndex, annotationObject, '_annotations_sticky');
            }
            if (proxy.pdfViewerBase.isAddComment) {
                const bounds: any = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                const settings: any = { opacity: annot.opacity, author: author, modifiedDate: annot.modifiedDate, subject: subject };
                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'StickyNotes', bounds, settings);
            }
            if (canvas) {
                proxy.pdfViewer.renderDrawing(canvas as any, pageIndex);
            } else {
                const canvass: any = document.getElementById(proxy.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
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
        const imageSource: string = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgd2lkdGg9IjE2IgogICBoZWlnaHQ9IjE1IgogICB2aWV3Qm94PSIwIDAgNC4yMzMzMzMxIDMuOTY4NzQ5NyIKICAgdmVyc2lvbj0iMS4xIj4KICA8ZyBpZD0ibGF5ZXIxIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDMuODM4OSwwLjk0MTY3IEMgMy42NTM5LDAuNzAzNjcgMy40MTU5LDAuNTE3NjcgMy4xMjQ5LDAuMzg1NjcgMi44MDc5LDAuMjUzNjcgMi40ODk5LDAuMTczNjcgMi4xMTk5LDAuMTczNjcgMS43NDg5LDAuMTczNjcgMS40MzE5LDAuMjUzNjcgMS4xMTQyLDAuMzg1NjcgMC44MjMxNiwwLjUxNzY3IDAuNTg1MTYsMC43MDM2NyAwLjQwMDE2LDAuOTQxNjcgMC4yMTUxNiwxLjE3OTcgMC4xMzUxNiwxLjQxNzcgMC4xMzUxNiwxLjcwODcgMC4xMzUxNiwxLjk0NjcgMC4xODgxNiwyLjE1ODcgMC4zMjAxNiwyLjM0MzcgMC40NTMxNiwyLjU1NTcgMC42MTExNiwyLjcxMzcgMC44MjMxNiwyLjg0NjcgMC43OTIxNiwzLjE1NDcgMC42NTAxNiwzLjM4MjcgMC40NzkxNiwzLjU4NzcgMC40MjgxNiwzLjY2NzcgMC41MTcxNiwzLjc0MTcgMC42OTExNiwzLjcxOTcgMS4wODgyLDMuNjM5NyAxLjQwNDksMy40NTQ3IDEuNjQyOSwzLjE2MzcgMS44MDE5LDMuMTkwNyAxLjk2MDksMy4yMTY3IDIuMTE5OSwzLjIxNjcgMi40ODk5LDMuMjE2NyAyLjgwNzksMy4xMzc3IDMuMTI0OSwzLjAwNTcgMy40MTU5LDIuODcyNyAzLjY4MDksMi42ODc3IDMuODM4OSwyLjQ0OTcgNC4wMjQ5LDIuMjExNyA0LjEwMzksMS45NzM3IDQuMTAzOSwxLjY4MjcgNC4xMDM5LDEuNDE3NyA0LjAyNDksMS4xNTI3IDMuODM4OSwwLjk0MTY3IFoiCiAgICAgICBpZD0icGF0aDE1MjQiCiAgICAgICBzdHlsZT0iZmlsbDojZmZmNzAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDowLjI2NDU4MztzdHJva2Utb3BhY2l0eToxIiAvPgogICAgPHBhdGgKICAgICAgIGQ9Ik0gMy4wNDI5LDEuNDE2NyBIIDEuMTkxMiBDIDEuMTExMiwxLjQxNjcgMS4wNTkyLDEuMzYzNyAxLjA1OTIsMS4yODM3IDEuMDU5MiwxLjIwNDcgMS4xMTEyLDEuMTUxNyAxLjE5MTIsMS4xNTE3IEggMy4wNDI5IEMgMy4xMjE5LDEuMTUxNyAzLjE3NDksMS4yMDQ3IDMuMTc0OSwxLjI4MzcgMy4xNzQ5LDEuMzYzNyAzLjEyMTksMS40MTY3IDMuMDQyOSwxLjQxNjcgWiIKICAgICAgIGlkPSJwYXRoMTUzNiIKICAgICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MC4yNjQ1ODMiIC8+CiAgICA8cGF0aAogICAgICAgZD0iTSAzLjA0MjksMS45NDU3IEggMS4xOTEyIEMgMS4xMTEyLDEuOTQ1NyAxLjA1OTIsMS44OTI3IDEuMDU5MiwxLjgxMjcgMS4wNTkyLDEuNzMzNyAxLjExMTIsMS42ODA3IDEuMTkxMiwxLjY4MDcgSCAzLjA0MjkgQyAzLjEyMTksMS42ODA3IDMuMTc0OSwxLjczMzcgMy4xNzQ5LDEuODEyNyAzLjE3NDksMS44OTI3IDMuMTIxOSwxLjk0NTcgMy4wNDI5LDEuOTQ1NyBaIgogICAgICAgaWQ9InBhdGgxNTQwIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjI2NDU4MyIgLz4KICA8L2c+Cjwvc3ZnPgo=';
        return imageSource;
    }

    /**
     * @private
     * @returns {void}
     */
    public createRequestForComments(): void {
        let jsonObject: object;
        // eslint-disable-next-line
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
            jsonObject = { pageStartIndex: startIndex.toString(), pageEndIndex: pageCount.toString(), hashId: this.pdfViewerBase.hashId, action: 'RenderAnnotationComments', elementId: this.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
            proxy.isCommentsRendered = true;
        } else {
            jsonObject = { pageStartIndex: pageLimit.toString(), pageEndIndex: pageCount.toString(), hashId: this.pdfViewerBase.hashId, action: 'RenderAnnotationComments', elementId: this.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        }
        if (this.pdfViewerBase.jsonDocumentId) {
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        const url: string = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderComments;
        proxy.commentsRequestHandler = new AjaxHandler(proxy.pdfViewer);
        proxy.commentsRequestHandler.url = url;
        proxy.commentsRequestHandler.mode = true;
        proxy.commentsRequestHandler.responseType = 'text';
        if (this.pdfViewerBase.clientSideRendering){
            const data : any = this.pdfViewer.pdfRendererModule.getAnnotationComments(jsonObject);
            this.renderCommentsOnSuccess(data, proxy);
        }
        else{
            this.pdfViewerBase.requestCollection.push(this.commentsRequestHandler);
            proxy.commentsRequestHandler.send(jsonObject);
            proxy.commentsRequestHandler.onSuccess = function (result: any): void {
                let data: any = result.data;
                const redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
                if (!redirect) {
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
                        proxy.renderCommentsOnSuccess(data, proxy);
                    }
                }
            };
            proxy.commentsRequestHandler.onFailure = function (result: any): void {
                this.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
            };
            proxy.commentsRequestHandler.onError = function (result: any): void {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                      proxy.pdfViewer.serverActionSettings.renderComments);
            };
        }
    }

    private renderCommentsOnSuccess(data: any, proxy: StickyNotesAnnotation): void {
        if (data) {
            let isInitialRender: boolean = false;
            if (proxy.pdfViewerBase.annotationComments) {
                proxy.pdfViewerBase.annotationComments = data.annotationDetails;
            } else {
                proxy.pdfViewerBase.annotationComments = data.annotationDetails;
                isInitialRender = true;
            }
            if (data.annotationDetails && data.uniqueId === proxy.pdfViewerBase.documentId) {
                proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderComments, data);
                proxy.isAnnotationRendered = true;
                let annotationCollections: any;
                if (proxy.pdfViewerBase.documentAnnotationCollections) {
                    annotationCollections = proxy.updateAnnotationsInDocumentCollections(proxy.pdfViewerBase.annotationComments,
                                                                                         proxy.pdfViewerBase.documentAnnotationCollections);
                } else {
                    const newCollection: any = proxy.pdfViewerBase.createAnnotationsCollection();
                    annotationCollections = proxy.updateAnnotationsInDocumentCollections(proxy.pdfViewerBase.annotationComments,
                                                                                         newCollection);
                }
                proxy.pdfViewerBase.annotationComments = annotationCollections;
                proxy.pdfViewerBase.documentAnnotationCollections = annotationCollections;
                for (let i: number = data.startPageIndex; i < data.endPageIndex; i++) {
                    const newData: any = data.annotationDetails[parseInt(i.toString(), 10)];
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'annotationOrder');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'freeTextAnnotation');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'measureShapeAnnotation');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'shapeAnnotation');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'signatureAnnotation');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'signatureInkAnnotation');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'stampAnnotations');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'stickyNotesAnnotation');
                    proxy.pdfViewerBase.updateModifiedDateToLocalDate(newData, 'textMarkupAnnotation');
                }
                for (let j: number = data.startPageIndex; j < data.endPageIndex; j++) {
                    if (data.annotationDetails[parseInt(j.toString(), 10)]) {
                        proxy.renderAnnotationCollections(data.annotationDetails[parseInt(j.toString(), 10)], j, isInitialRender);
                    }
                }
                if (!proxy.isPageCommentsRendered) {
                    proxy.isPageCommentsRendered = true;
                    proxy.createRequestForComments();
                }
            }
        }
    }

    /**
     * @param {any} excistingAnnotation - It describes about the existing annotation
     * @param {any} newAnnotation - It describes about the new annotation
     * @private
     * @returns {any} - any
     */
    public updateAnnotationsInDocumentCollections(excistingAnnotation: any, newAnnotation: any): any {
        for (let i: number = 0; i < this.pdfViewerBase.pageCount; i++) {
            if (excistingAnnotation[parseInt(i.toString(), 10)] && newAnnotation[parseInt(i.toString(), 10)]) {
                if (excistingAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            textMarkupAnnotation[parseInt(j.toString(), 10)],
                                                                 newAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].shapeAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].shapeAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].shapeAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].shapeAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            shapeAnnotation[parseInt(j.toString(), 10)],
                                                                 newAnnotation[parseInt(i.toString(), 10)].shapeAnnotation);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            measureShapeAnnotation[parseInt(j.toString(), 10)], newAnnotation[parseInt(i.toString(), 10)].
                            measureShapeAnnotation);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].stampAnnotations &&
                 excistingAnnotation[parseInt(i.toString(), 10)].stampAnnotations.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].stampAnnotations) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].stampAnnotations.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            stampAnnotations[parseInt(j.toString(), 10)],
                                                                 newAnnotation[parseInt(i.toString(), 10)].stampAnnotations);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            stickyNotesAnnotation[parseInt(j.toString(), 10)], newAnnotation[parseInt(i.toString(), 10)].
                            stickyNotesAnnotation);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            freeTextAnnotation[parseInt(j.toString(), 10)], newAnnotation[parseInt(i.toString(), 10)].
                            freeTextAnnotation);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].signatureAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].signatureAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].signatureAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].signatureAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            signatureAnnotation[parseInt(j.toString(), 10)], newAnnotation[parseInt(i.toString(), 10)].
                            signatureAnnotation);
                    }
                }
                if (excistingAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation &&
                 excistingAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation.length !== 0 &&
                  newAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation) {
                    for (let j: number = 0; j < excistingAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation.length; j++) {
                        this.updateDocumentAnnotationCollections(excistingAnnotation[parseInt(i.toString(), 10)].
                            signatureInkAnnotation[parseInt(j.toString(), 10)],
                                                                 newAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation);
                    }
                }
            }
        }
        return newAnnotation;
    }

    private updateDocumentAnnotationCollections(excistingAnnotation: any, newAnnotation: any): void {
        if (newAnnotation.length === 0) {
            newAnnotation.push(excistingAnnotation);
        } else {
            let isAdded: boolean = false;
            for (let i: number = 0; i < newAnnotation.length; i++) {
                if ((excistingAnnotation.AnnotName && newAnnotation[parseInt(i.toString(), 10)].AnnotName) &&
                 (excistingAnnotation.AnnotName === newAnnotation[parseInt(i.toString(), 10)].AnnotName)) {
                    isAdded = true;
                    break;
                }
            }
            if (!isAdded) {
                newAnnotation.push(excistingAnnotation);
            }
        }
    }

    private renderAnnotationCollections(pageAnnotations: any, pageNumber: any, isInitialRender: boolean): void {
        const pageCollections: any = [];
        const collection: any = pageAnnotations.annotationOrder;
        if (!isNullOrUndefined(collection)) {
            for (let l: number = 0; l < collection.length; l++) {
                const annotation: any = collection[parseInt(l.toString(), 10)];
                const type: any = annotation.AnnotType ? annotation.AnnotType : annotation.AnnotationType;
                if (this.pdfViewer.dateTimeFormat) {
                    annotation.ModifiedDate =
                     this.pdfViewer.annotationModule.stickyNotesAnnotationModule.getDateAndTime(annotation.ModifiedDate);
                }
                pageCollections.push(annotation);
                switch (type) {
                case 'textMarkup':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                     (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule))) {
                        this.updateCollections(this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                            updateTextMarkupAnnotationCollections(annotation, pageNumber));
                    }
                    break;
                case 'shape_measure':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                     (!isNullOrUndefined(this.pdfViewer.annotationModule.measureAnnotationModule))) {
                        this.updateCollections(this.pdfViewer.annotationModule.measureAnnotationModule.
                            updateMeasureAnnotationCollections(annotation, pageNumber));
                    }
                    break;
                case 'shape':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                     (!isNullOrUndefined(this.pdfViewer.annotationModule.shapeAnnotationModule))) {
                        this.updateCollections(this.pdfViewer.annotationModule.shapeAnnotationModule.
                            updateShapeAnnotationCollections(annotation, pageNumber));
                    }
                    break;
                case 'sticky':
                    this.updateCollections(this.updateStickyNotesAnnotationCollections(annotation, pageNumber));
                    break;
                case 'stamp':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                     (!isNullOrUndefined(this.pdfViewer.annotationModule.stampAnnotationModule))) {
                        this.updateCollections(this.pdfViewer.annotationModule.stampAnnotationModule.
                            updateStampAnnotationCollections(annotation, pageNumber));
                    }
                    break;
                case 'Ink':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                     (!isNullOrUndefined(this.pdfViewer.annotationModule.inkAnnotationModule))) {
                        this.updateCollections(this.pdfViewer.annotationModule.inkAnnotationModule.
                            updateInkCollections(annotation, pageNumber));
                    }
                    break;
                case 'Text Box':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                     (!isNullOrUndefined(this.pdfViewer.annotationModule.freeTextAnnotationModule))) {
                        this.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.
                            updateFreeTextAnnotationCollections(annotation, pageNumber));
                    }
                    break;
                default:
                    break;
                }
            }
        }
        if (pageAnnotations.signatureAnnotation && pageAnnotations.signatureAnnotation.length !== 0) {
            for (let i: number = 0; i < pageAnnotations.signatureAnnotation.length; i++) {
                if (this.pdfViewer.dateTimeFormat) {
                    pageAnnotations.signatureAnnotation[parseInt(i.toString(), 10)].ModifiedDate =
                     this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                         getDateAndTime(pageAnnotations.signatureAnnotation[parseInt(i.toString(), 10)].ModifiedDate);
                }
                this.updateCollections(this.pdfViewerBase.signatureModule.
                    updateSignatureCollections(pageAnnotations.signatureAnnotation[parseInt(i.toString(), 10)], pageNumber), true);
            }
        }
        if (this.pdfViewer.toolbarModule) {
            this.renderAnnotationComments(pageCollections, pageNumber);
        }
        if (isInitialRender) {
            for (let i: number = 0; i < this.pdfViewerBase.renderedPagesList.length; i++) {
                if (this.pdfViewerBase.renderedPagesList[parseInt(i.toString(), 10)] === pageNumber) {
                    this.pdfViewerBase.renderAnnotations(pageNumber, pageAnnotations, false);
                }
            }
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {boolean} isSignature - It describes about the issignature
     * @private
     * @returns {void}
     */
    public updateCollections(annotation: any, isSignature?: boolean): void {
        let isAdded: boolean = false;
        let collections: any;
        if (isSignature) {
            collections = this.pdfViewer.signatureCollection;
        } else {
            collections = this.pdfViewer.annotationCollection;
        }
        if (collections && annotation) {
            for (let i: number = 0; i < collections.length; i++) {
                if (isSignature) {
                    if (collections[parseInt(i.toString(), 10)].signatureName === annotation.signatureName) {
                        isAdded = true;
                        break;
                    }
                } else {
                    if (collections[parseInt(i.toString(), 10)].annotationId === annotation.annotationId) {
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
     * @param {any} data - It describes about the data
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    public renderAnnotationComments(data: any, pageIndex: number): void {
        pageIndex = pageIndex + 1;
        if (data) {
            if (data.length !== 0) {
                if (!(data.length === 1 && (data[0].AnnotationType === 'Signature' || data[0].AnnotationType === 'signature'))) {
                    this.createPageAccordion(pageIndex);
                }
                for (let i: number = 0; i < data.length; i++) {
                    if (data[parseInt(i.toString(), 10)].AnnotName && (data[parseInt(i.toString(), 10)].AnnotName.split('freeText').length === 1)) {
                        this.createCommentControlPanel(data[parseInt(i.toString(), 10)], pageIndex);
                    }
                }
                const newCommentsDiv: any = document.querySelectorAll('.e-pv-new-comments-div');
                if (newCommentsDiv) {
                    for (let j: number = 0; j < newCommentsDiv.length; j++) {
                        newCommentsDiv[parseInt(j.toString(), 10)].style.display = 'none';
                    }
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public initializeAcccordionContainer(): void {
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
        this.accordionContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_accordionContentContainer', className: 'e-pv-accordion-content-container' });
        this.pdfViewerBase.navigationPane.commentsContentContainer.appendChild(this.accordionContentContainer);
        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], false);
    }

    /**
     * @private
     * @returns {void}
     */
    public updateCommentPanelTextTop(): void {
        const commentPanelText: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commentsPanelText');
        if (this.pdfViewerBase.navigationPane.commentPanelContainer && this.pdfViewerBase.navigationPane.commentPanelContainer.clientHeight && commentPanelText.style.display !== 'none') {
            commentPanelText.style.paddingTop = (this.pdfViewerBase.navigationPane.commentPanelContainer.clientHeight / 2) - 47 + 'px';
            commentPanelText.style.paddingLeft = (this.pdfViewerBase.navigationPane.commentPanelContainer.clientWidth) / 3 + 'px';
        }
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {any} - any
     */
    public createPageAccordion(pageIndex: number): any {
        const pageAccordionContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageIndex);
        if (pageAccordionContainer === null) {
            this.accordionContent = createElement('div', { id: this.pdfViewer.element.id + '_accordioncontent' + pageIndex });
            this.accordionContent.style.zIndex = '1000';
            this.accordionPageContainer = createElement('div', { id: this.pdfViewer.element.id + '_accordionPageContainer' + pageIndex, className: 'e-pv-accordion-page-container' });
            this.accordionPageContainer.appendChild(this.accordionContent);
            this.pdfViewerBase.viewerMainContainer.appendChild(this.accordionPageContainer);
            this.accordionContainer = createElement('div', { id: this.pdfViewer.element.id + '_accordionContainer' + pageIndex, className: 'e-pv-accordion-container' });
            const pageAccordion: Accordion = new Accordion({
                items: [
                    { header: this.pdfViewer.localeObj.getConstant('Page') + ' ' + (pageIndex), expanded: true, content: '#' + this.pdfViewer.element.id + '_accordioncontent' + pageIndex + '' }
                ]
            });
            pageAccordion.appendTo(this.accordionContainer);
            this.accordionContainer.style.order = 'pageIndex';
            this.alignAccordionContainer(this.accordionContainer, pageIndex);
            if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
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
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public updateCommentPanelScrollTop(pageNumber: number): void {
        const accordionDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordionDiv) {
            const scrollValue: number = accordionDiv.offsetTop + accordionDiv.clientTop - 35;
            this.pdfViewerBase.navigationPane.commentsContentContainer.scrollTop = scrollValue;
        }
    }
    private getButtonState(editObj: any, commentTextBox: any): void{
        commentTextBox.addEventListener('keyup', function (event: any): void {
            if (editObj.element.querySelector('.e-btn-save')) {
                if ((event.srcElement.value !== '' || event.srcElement.defaultValue !== '') && event.srcElement.defaultValue !== event.srcElement.value) {
                    editObj.element.querySelector('.e-btn-save').ej2_instances[0].disabled = false;
                }
            }
        });
    }

    /**
     * @param {any} data - It describes about the data
     * @param {number} pageIndex - It describes about the page index
     * @param {string} type - It describes about the type
     * @param {string} annotationSubType - It describes about the annotation sub type
     * @param {boolean} isReRender - It describes about the isRenderer
     * @private
     * @returns {string} - string
     */
    public createCommentControlPanel(data: any, pageIndex: number, type?: string, annotationSubType?: string,
                                     isReRender?: boolean): string {
        const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordioncontent' + pageIndex);
        if (accordionContent) {
            const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageIndex);
            if (accordionExpand) {
                accordionExpand.ej2_instances[0].expandItem(true);
            }
            this.commentsContainer = createElement('div', { id: this.pdfViewer.element.id + 'commentscontainer_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-container' });
            this.commentsContainer.accessKey = pageIndex.toString() + '_' + this.commentsCount;
            let isCommentsAdded: boolean = false;
            if (data) {
                this.commentsContainer.id = data.AnnotName;
                if (data.AnnotName) {
                    for (let j: number = 0; j < accordionContent.childElementCount; j++) {
                        if (accordionContent.children[parseInt(j.toString(), 10)].id === data.AnnotName) {
                            isCommentsAdded = true;
                            if (isReRender){
                                // To remove the existing div element in the comment panel while importing the annotation with the same name. (EJ2-62092)
                                const id: any = document.getElementById(accordionContent.children[parseInt(j.toString(), 10)].id);
                                id.remove();
                                isCommentsAdded = false;
                            }
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
            const commentDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentdiv_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-div' });
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
                this.createTitleContainer(commentDiv, title, pageIndex, data.Subject, data.ModifiedDate, data.Author);
            } else {
                title = this.commentsContainer.getAttribute('name');
                this.createTitleContainer(commentDiv, title, pageIndex, annotationSubType);
            }
            const commentTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commenttextbox_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comment-textbox', attrs: { 'role': 'textbox', 'aria-label': 'comment textbox' } });
            const enableAutoComplete: string = this.pdfViewer.enableAutoComplete ? 'on' : 'off';
            const editObj: any = new InPlaceEditor({
                mode: 'Inline',
                type: 'Text',
                model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a comment') + '..' , htmlAttributes: { autocomplete: enableAutoComplete}},
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
            if (data && (!isNullOrUndefined(data.Note) || !isNullOrUndefined(data.Text))) {
                editObj.created = function (): void {
                    setTimeout(() => {
                        editObj.element.querySelector('.e-editable-value').innerText = !isNullOrUndefined(data.Note) ? data.Note : !isNullOrUndefined(data.Text) ? data.Text : '' ;
                    });
                };
                editObj.beginEdit = function (): void {
                    editObj.value = editObj.valueEle.innerText;
                };
            }
            editObj.appendTo(commentTextBox);
            const textBox: any = document.querySelectorAll('.e-editable-inline');
            for (let j: number = 0; j < textBox.length; j++) {
                textBox[parseInt(j.toString(), 10)].style.display = 'none';
            }
            if (!data && type !== 'freeText') {
                editObj.enableEditMode = true;
            }
            this.getButtonState(editObj, commentTextBox);
            editObj.actionSuccess = this.createCommentDiv.bind(this, editObj);
            commentDiv.appendChild(commentTextBox);
            if (data) {
                editObj.value = !isNullOrUndefined(data.Note) ? data.Note : !isNullOrUndefined(data.Text) ? data.Text : '' ;
                const isCommentLocked: boolean = this.checkIslockProperty(data);
                if (isCommentLocked && data.Comments == null) {
                    this.createCommentDiv(this.commentsContainer);
                }
                if (data.Name === 'freeText') {
                    editObj.value = data.MarkupText;
                }
                if (data.State) {
                    const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
                    statusDiv.appendChild(statusSpan);
                    statusContainer.appendChild(statusDiv);
                    commentDiv.appendChild(statusContainer);
                    this.updateStatusContainer(data.State, statusSpan, statusDiv, statusContainer);
                }
                if (data.Comments) {
                    for (let j: number = 0; j < data.Comments.length; j++) {
                        this.renderComments(data.Comments[parseInt(j.toString(), 10)], this.commentsContainer);
                    }
                    if (data.Note !== ' ' && data.Note !== '' && data.Note !== null) {
                        this.createCommentDiv(this.commentsContainer);
                    }
                    if (data.AnnotType === 'Text Box' && data.Text !== ' ' && data.Text !== '' && data.Text !== null) {
                        this.createCommentDiv(this.commentsContainer);
                    }
                }
                //Task Id: 874405. If a comment is added programmatically, create a reply div container.
                if (data.Note !== ' ' && data.Note !== '' && data.Note !== null) {
                    this.createCommentDiv(this.commentsContainer);
                }
                if (data.AnnotType === 'Text Box' && data.Text !== ' ' && data.Text !== '' && data.Text !== null) {
                    this.createCommentDiv(this.commentsContainer);
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
        return '';
    }

    private commentDivFocus(args: any): void {
        if (isNullOrUndefined(this.pdfViewer.freeTextSettings.defaultText)) {
            this.pdfViewer.freeTextSettings.defaultText = 'Type here';
        }
        if (!isNullOrUndefined(args.target) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.defaultText) && this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText' && args.target.value === this.pdfViewer.freeTextSettings.defaultText) {
            args.target.select();
        }
        if (!this.isNewcommentAdded) {
            if (args.relatedTarget !== null && args.relatedTarget.id === this.pdfViewer.element.id + '_viewerContainer') {
                args.preventDefault();
                args.target.blur();
            }
        }
        else {
            // eslint-disable-next-line
            const proxy: any = this;
            const pageNumber: number = this.pdfViewerBase.currentPageNumber;
            setTimeout(
                () => {
                    proxy.updateScrollPosition(pageNumber);
                }, 500);
        }
    }

    private updateScrollPosition(pageNumber: number): void {
        const accordionDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordionDiv && this.isNewcommentAdded) {
            let commentHeight: number = 0;
            const textBox: any = document.querySelectorAll('.e-editable-inline');
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
        const accordionDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewerBase.currentPageNumber);
        const commentsContainer: any = document.querySelector('.e-pv-comments-border');
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
     * @param {any} args - It describes about the args
     * @private
     * @returns {void}
     */
    public createCommentDiv(args: any): void {
        let commentsContainer: HTMLElement;
        let titleContainer: HTMLElement;
        const newCommentDiv: any = createElement('div', { id: this.pdfViewer.element.id + '_newcommentdiv_' + this.commentsCount + '_' + this.commentsreplyCount, className: 'e-pv-new-comments-div' });
        if (args.localName) {
            commentsContainer = args;
        } else {
            commentsContainer = args.valueEle.parentElement.parentElement.parentElement.parentElement;
            titleContainer = args.valueEle.parentElement.parentElement.previousSibling.childNodes[1];
        }
        const enableAutoComplete: string = this.pdfViewer.enableAutoComplete ? 'on' : 'off';
        const commentObj: InPlaceEditor = new InPlaceEditor({
            mode: 'Inline',
            type: 'Text',
            value: '',
            editableOn: 'Click',
            model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a reply') + '..' , htmlAttributes: { autocomplete: enableAutoComplete}},
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
        this.getButtonState(commentObj, newCommentDiv);
        if (args.valueEle) {
            if (this.pdfViewer.enableHtmlSanitizer && args.value){
                args.value = SanitizeHtmlHelper.sanitize(args.value);
            }
            if ((args.value !== null && args.value !== '' && args.value !== ' ') || (args.value === '' && args.prevValue !== '')) {
                if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    this.modifyTextProperty(args.value, args.prevValue, args.valueEle.parentNode.parentNode.parentNode.parentNode.id);
                } else {
                    try {
                        this.modifyTextProperty(args.value, args.prevValue, args.valueEle.parentNode.parentNode.parentNode.parentNode.id);
                    } catch (error) {
                        this.modifyTextProperty(args.value, args.prevValue);
                    }
                }
                // eslint-disable-next-line
                if (args.prevValue != args.value) {
                    this.updateModifiedDate(titleContainer);
                }
            }
            if (args.valueEle.parentElement.parentElement.parentElement.parentElement.childElementCount === 1) {
                if (args.value != null && args.value !== '') {
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
     * @param {any} args - It describes about the args
     * @param {any} comment - It describes about the comment
     * @private
     * @returns {void}
     */
    public saveCommentDiv(args: any, comment: any): void {
        let commentsContainer: HTMLElement;
        let annotationAuthor: string;
        let lastElement: any;
        let commentValue: string;
        if (this.pdfViewer.enableHtmlSanitizer && args.value){
            args.value = SanitizeHtmlHelper.sanitize(args.value);
        }
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
            const replyTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replytextbox_'  + this.commentsCount + '_' + this.commentsreplyCount });
            this.commentsreplyCount = this.commentsreplyCount + 1;
            const replyCommentDiv: any = createElement('div', { id: this.pdfViewer.element.id + 'replyDiv_' + this.commentsCount + '_' + this.commentsreplyCount, className: 'e-pv-reply-div' });
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
            const enableAutoComplete: any = this.pdfViewer.enableAutoComplete ? 'on' : 'off';
            const saveObj: any = new InPlaceEditor({
                mode: 'Inline',
                type: 'Text',
                emptyText: '',
                editableOn: 'EditIconClick',
                model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a reply') + '..' , htmlAttributes: { autocomplete: enableAutoComplete}},
                value: commentValue,
                saveButton: {
                    content: this.pdfViewer.localeObj.getConstant('Post'),
                    cssClass: 'e-outline',
                    disabled: true
                },
                cancelButton: {
                    content: this.pdfViewer.localeObj.getConstant('Cancel'),
                    cssClass: 'e-outline'
                }
            });
            saveObj.created = function (): void {
                setTimeout(() => {
                    saveObj.element.querySelector('.e-editable-value').innerText = commentValue;
                });
            };
            saveObj.beginEdit = function (): void {
                saveObj.value = saveObj.valueEle.innerText;
            };
            saveObj.appendTo(replyTextBox);
            saveObj.actionSuccess = this.modifyProperty.bind(this, saveObj);
            replyCommentDiv.appendChild(replyTextBox);
            replyCommentDiv.style.paddingLeft = 24 + 'px';
            commentsContainer.appendChild(replyCommentDiv);
            this.getButtonState(saveObj, replyTextBox);
            replyCommentDiv.addEventListener('click', this.commentsDivClickEvent.bind(this));
            replyCommentDiv.addEventListener('dblclick', this.commentsDivDoubleClickEvent.bind(this));
            this.createCommentDiv(replyCommentDiv.parentElement);
            this.modifyCommentsProperty(commentValue, replyCommentDiv.id, commentsContainer.id);
        }
    }

    private renderComments(data: any, commentDiv: any, undoRedoAction?: boolean, id?: string, isCommentAction?: boolean): void {
        let annotationAuthor: string;
        const replyTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replytextbox_' + this.commentsCount + '_' + this.commentsreplyCount });
        this.commentsreplyCount = this.commentsreplyCount + 1;
        const replyDiv: HTMLElement = createElement('div', { id: 'replyDiv_' + this.commentsCount + '_' + this.commentsreplyCount, className: 'e-pv-reply-div' });
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
        const enableAutoComplete: string = this.pdfViewer.enableAutoComplete ? 'on' : 'off';
        const saveObj: any = new InPlaceEditor({
            mode: 'Inline',
            type: 'Text',
            emptyText: '',
            editableOn: 'EditIconClick',
            model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a reply') + '..' , htmlAttributes: { autocomplete: enableAutoComplete}},
            value: '',
            saveButton: {
                content: this.pdfViewer.localeObj.getConstant('Post'),
                cssClass: 'e-outline',
                disabled: true
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
        saveObj.created = function(): void {
            setTimeout(() => {
                saveObj.element.querySelector('.e-editable-value').innerText = undoRedoAction ? data ? data.note : '' : data ? data.Note : '';
            });
        };
        saveObj.beginEdit = function(): void {
            saveObj.value = saveObj.valueEle.innerText;
        };
        saveObj.appendTo(replyTextBox);
        replyDiv.appendChild(replyTextBox);
        if (undoRedoAction) {
            data.State = data.state;
        }
        if (data.State) {
            const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
            const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
            const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
            statusDiv.appendChild(statusSpan);
            statusContainer.appendChild(statusDiv);
            replyDiv.appendChild(statusContainer);
            this.updateStatusContainer(data.State, statusSpan, statusDiv, statusContainer);
        }
        replyDiv.style.paddingLeft = 24 + 'px';
        this.getButtonState(saveObj, replyTextBox);
        if (undoRedoAction) {
            if (isCommentAction) {
                commentDiv.appendChild(replyDiv);
            } else {
                const commentsDiv: any = document.getElementById(id);
                if (data.position) {
                    commentsDiv.insertBefore(replyDiv, commentsDiv.childNodes[data.position]);
                } else {
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
     * @param {any} data - It describes about the data
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isCopy - It describes about the isCopy
     * @private
     * @returns {string} - string
     */
    public createCommentsContainer(data: any, pageIndex: number, isCopy?: boolean): string {
        let accordionContentContainer: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageIndex);
        if (!accordionContentContainer) {
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
        this.commentsContainer = createElement('div', { id: this.pdfViewer.element.id + 'commentscontainer_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-container' });
        this.commentsContainer.accessKey = pageIndex.toString() + '_' + this.commentsCount;
        if (data) {
            this.commentsContainer.id = data.annotName ? data.annotName : data.annotationId;
        }
        this.commentsContainer.addEventListener('mousedown', this.commentsAnnotationSelect.bind(this));
        const commentDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentdiv_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comments-div' });
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
                this.createTitleContainer(commentDiv, 'shape_measure', pageIndex, data.subject, data.modifiedDate, data.author);
            } else if (data.shapeAnnotationType === 'sticky' || data.shapeAnnotationType === 'stamp') {
                const annotType: string = this.createTitleContainer(commentDiv, data.shapeAnnotationType, pageIndex, null,
                                                                    data.modifiedDate, data.author);
                this.commentsContainer.setAttribute('name', annotType);
                if (annotType === 'sticky') {
                    if (!isCopy) {
                        this.addStickyNotesAnnotations((pageIndex - 1), data);
                    }
                }
            } else if (data.shapeAnnotationType === 'textMarkup') {
                this.commentsContainer.setAttribute('name', 'textMarkup');
                this.createTitleContainer(commentDiv, 'textMarkup', pageIndex, data.subject, data.modifiedDate, data.author);
            } else if (data.shapeAnnotationType === 'FreeText') {
                data.note = data.dynamicText;
                this.commentsContainer.setAttribute('name', 'freetext');
                this.createTitleContainer(commentDiv, 'freeText', pageIndex, data.subject, data.modifiedDate);
            } else if (data.shapeAnnotationType === 'Ink') {
                data.note = data.dynamicText;
                this.commentsContainer.setAttribute('name', 'ink');
                this.createTitleContainer(commentDiv, 'ink', pageIndex, data.subject, data.modifiedDate);
            } else {
                this.commentsContainer.setAttribute('name', 'shape');
                if (data.shapeAnnotationType === 'Line') {
                    this.createTitleContainer(commentDiv, 'shape', pageIndex, data.subject, data.modifiedDate, data.author);
                } else {
                    this.createTitleContainer(commentDiv, 'shape', pageIndex, data.shapeAnnotationType, data.modifiedDate, data.author);
                }
            }
        }
        const commentTextBox: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commenttextbox_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comment-textbox', attrs: { 'role': 'textbox', 'aria-label': 'comment textbox' } });
        const enableAutoComplete: string = this.pdfViewer.enableAutoComplete ? 'on' : 'off';
        const editObj: any = new InPlaceEditor({
            mode: 'Inline',
            type: 'Text',
            model: { placeholder: this.pdfViewer.localeObj.getConstant('Add a comment') + '..' , htmlAttributes: { autocomplete: enableAutoComplete}},
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
        const textBox: any = document.querySelectorAll('.e-editable-inline');
        for (let j: number = 0; j < textBox.length; j++) {
            textBox[parseInt(j.toString(), 10)].style.display = 'none';
        }
        commentTextBox.addEventListener('keydown', function (event: any): void {
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
                const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
                statusDiv.appendChild(statusSpan);
                statusContainer.appendChild(statusDiv);
                commentDiv.appendChild(statusContainer);
                this.updateStatusContainer(data.state, statusSpan, statusDiv, statusContainer);
            }
            if (data.comments) {
                for (let j: number = 0; j < data.comments.length; j++) {
                    this.renderComments(data.comments[parseInt(j.toString(), 10)], this.commentsContainer, true, null, true);
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

    private modifyProperty(args: any): void {
        const commentElement: string = args.element.parentElement.id;
        const parentElement: string = args.element.parentElement.parentElement.id;
        const titleElement: HTMLElement = args.element.previousSibling.firstChild;
        this.updateModifiedDate(titleElement);
        this.modifyCommentsProperty(args.value, commentElement, parentElement, args.prevValue);
    }

    private createTitleContainer(commentsDivElement: HTMLElement, type: string, pageIndex: number, subType?: string,
                                 modifiedDate?: string, author?: string, note?: string): string {
        const annotationType: string = this.getAnnotationType(type);
        const commentTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentTitleConatiner_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comment-title-container' });
        const commentTypeSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_commenttype' + '_icon' + pageIndex + '_' + this.commentsCount });
        commentTypeSpan.style.opacity = '0.6';
        this.updateCommentIcon(commentTypeSpan, annotationType, subType);
        let annotationAuthor: string;
        if (!author) {
            annotationAuthor = this.pdfViewer.annotationModule.updateAnnotationAuthor(annotationType, subType);
        } else {
            annotationAuthor = author;
        }
        annotationAuthor = annotationAuthor.replace(/(\r\n|\n|\r)/gm, '');
        commentTypeSpan.style.padding = 8 + 'px';
        commentTypeSpan.style.cssFloat = 'left';
        commentTitleContainer.appendChild(commentTypeSpan);
        const commentsTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentTitle_' + pageIndex + '_' + this.commentsCount, className: 'e-pv-comment-title' });
        if (!modifiedDate) {
            commentsTitle.textContent = annotationAuthor + ' - ' + this.setModifiedDate();
        } else {
            commentsTitle.textContent = annotationAuthor + ' - ' + this.convertUTCDateToLocalDate(modifiedDate);
        }
        commentTitleContainer.appendChild(commentsTitle);
        this.moreButtonId = this.pdfViewer.element.id + '_more-options_'  + this.commentsCount + '_' + this.commentsreplyCount;
        const moreOptionsButton: HTMLElement = createElement('button', { id: this.moreButtonId, className: 'e-pv-more-options-button e-btn', attrs: { 'tabindex': '-1' } });
        moreOptionsButton.style.visibility = 'hidden';
        moreOptionsButton.style.zIndex = '1001';
        moreOptionsButton.setAttribute('type', 'button');
        moreOptionsButton.setAttribute('aria-label', 'more button');
        const moreOptionsButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_more-options_icon', className: 'e-pv-more-icon e-pv-icon' });
        moreOptionsButton.appendChild(moreOptionsButtonSpan);
        moreOptionsButtonSpan.style.opacity = '0.87';
        commentTitleContainer.appendChild(moreOptionsButton);
        commentsDivElement.appendChild(commentTitleContainer);
        const commentsContainer: any = commentsDivElement.parentElement;
        if (commentsContainer) {
            const author: string = this.pdfViewer.annotationModule.updateAnnotationAuthor(annotationType, subType);
            commentsContainer.setAttribute('author', author);
        }
        if (!this.isCreateContextMenu) {
            this.createCommentContextMenu();
        }
        this.isCreateContextMenu = true;
        if (commentsTitle.parentElement && commentsTitle.parentElement.clientWidth !== 0) {
            commentsTitle.style.maxWidth = (commentsTitle.parentElement.clientWidth - moreOptionsButton.clientWidth) + 'px';
        }
        else {
            commentsTitle.style.maxWidth = '237px';
        }
        commentTitleContainer.addEventListener('dblclick', this.openTextEditor.bind(this));
        moreOptionsButton.addEventListener('mouseup', this.moreOptionsClick.bind(this));
        return annotationType;
    }

    private createReplyDivTitleContainer(commentsDivElement: HTMLElement, modifiedDate?: string, annotationAuthor?: string): void {
        const replyTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replyTitleConatiner_' + this.commentsCount + '_' + this.commentsreplyCount, className: 'e-pv-reply-title-container' });
        const replyTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_replyTitle_' + this.commentsCount + '_' + this.commentsreplyCount, className: 'e-pv-reply-title' });
        annotationAuthor = annotationAuthor.replace(/(\r\n|\n|\r)/gm, '');
        if (!modifiedDate) {
            replyTitle.textContent = annotationAuthor + ' - ' + this.setModifiedDate();
        } else {
            replyTitle.textContent = annotationAuthor + ' - ' + this.setExistingAnnotationModifiedDate(modifiedDate);
        }
        replyTitleContainer.appendChild(replyTitle);
        this.moreButtonId = this.pdfViewer.element.id + '_more-options_'  + this.commentsCount + '_' + this.commentsreplyCount;
        const moreButton: HTMLElement = createElement('button', { id: this.moreButtonId, className: 'e-pv-more-options-button e-btn', attrs: { 'tabindex': '-1' } });
        moreButton.style.visibility = 'hidden';
        moreButton.style.zIndex = '1001';
        moreButton.setAttribute('type', 'button');
        moreButton.setAttribute('aria-label', 'more button');
        const moreButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_more-options_icon', className: 'e-pv-more-icon e-pv-icon' });
        moreButton.appendChild(moreButtonSpan);
        moreButtonSpan.style.opacity = '0.87';
        replyTitleContainer.appendChild(moreButton);
        commentsDivElement.appendChild(replyTitleContainer);
        const parentCommentDiv: NodeListOf<Element> = document.querySelectorAll('[class="e-pv-comment-title"]');
        const moreactionIcon: NodeListOf<Element> = document.querySelectorAll('[class="e-pv-more-options-button e-btn"]');
        if (parentCommentDiv[0] && moreactionIcon[0] && parentCommentDiv[0].parentElement &&
             parentCommentDiv[0].parentElement.clientWidth !== 0) {
            replyTitle.style.maxWidth = (parentCommentDiv[0].parentElement.clientWidth - (moreactionIcon[0] as HTMLElement).clientWidth) + 'px';
        } else {
            replyTitle.style.maxWidth = '237px';
        }
        replyTitleContainer.addEventListener('dblclick', this.openTextEditor.bind(this));
        moreButton.addEventListener('mouseup', this.moreOptionsClick.bind(this));
    }

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

    private updateStatusContainer(state: string, statusSpan: HTMLElement, statusDiv: HTMLElement, statusContainer: HTMLElement): void {
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
     * @param {HTMLElement} removeDiv -  It describes about the removeDiv
     * @private
     * @returns {void}
     */
    public updateAccordionContainer(removeDiv: HTMLElement): void {
        const pageNumber: number = parseInt(removeDiv.accessKey.split('_')[0], 10);
        const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordionContent) {
            accordionContent.parentElement.removeChild(accordionContent);
        }
        const accordionContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
        if (accordionContentContainer) {
            if (accordionContentContainer.childElementCount === 0) {
                accordionContentContainer.style.display = 'none';
                if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], false);
                    document.getElementById(this.pdfViewer.element.id + '_commentsPanelText').style.display = 'block';
                    this.updateCommentPanelTextTop();
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public createCommentContextMenu(): void {
        this.commentContextMenu = [
            { text: this.pdfViewer.localeObj.getConstant('Edit') },
            { text: this.pdfViewer.localeObj.getConstant('Delete Context') },
            {
                text: this.pdfViewer.localeObj.getConstant('Set Status'), items: [{ text: this.pdfViewer.localeObj.getConstant('None') }, { text: this.pdfViewer.localeObj.getConstant('Accepted') }, { text: this.pdfViewer.localeObj.getConstant('Cancelled') }, { text: this.pdfViewer.localeObj.getConstant('Completed') }, { text: this.pdfViewer.localeObj.getConstant('Rejected') }]
            }];
        const commentMenuElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + '_comment_context_menu' });
        this.pdfViewer.element.appendChild(commentMenuElement);
        this.commentMenuObj = new Context({
            target: '#' + this.moreButtonId, items: this.commentContextMenu,
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
        let contextActiveDiv: any;
        const contextDiv: any = document.querySelectorAll('.e-pv-more-options-button');
        if (contextDiv) {
            for (let i: number = 0; i < contextDiv.length; i++) {
                if (contextDiv[parseInt(i.toString(), 10)].style.visibility === 'visible') {
                    contextActiveDiv = contextDiv[parseInt(i.toString(), 10)].parentElement.nextSibling;
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

    private commentMenuItemSelect(args: any): void {
        let contextActiveDiv: any;
        const contextDiv: any = document.querySelectorAll('.e-pv-more-options-button');
        if (contextDiv) {
            for (let i: number = 0; i < contextDiv.length; i++) {
                if (contextDiv[parseInt(i.toString(), 10)].style.visibility === 'visible') {
                    contextActiveDiv = contextDiv[parseInt(i.toString(), 10)].parentElement.nextSibling;
                }
            }
            if (args.item) {
                switch (args.item.text) {
                case this.pdfViewer.localeObj.getConstant('Edit'): {
                    const commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
                    for (let i: number = 0; i < commentShow.length; i++) {
                        commentShow[parseInt(i.toString(), 10)].style.display = 'none';
                    }
                    contextActiveDiv.ej2_instances[0].enableEditMode = true;
                    break;
                }
                case this.pdfViewer.localeObj.getConstant('Delete Context'):
                    if (contextActiveDiv.parentElement.parentElement.firstChild === contextActiveDiv.parentElement) {
                        const annotationData : any = this.getAnnotationById(contextActiveDiv.parentElement.parentElement);
                        if (annotationData) {
                            const { annotation, pageIndex } = annotationData;
                            if (annotation) {
                                this.handleCommentDeletion(annotation);
                            }
                        }
                    } else {
                        this.modifyCommentDeleteProperty(contextActiveDiv.parentElement.parentElement, contextActiveDiv.parentElement);
                    }
                    break;
                case this.pdfViewer.localeObj.getConstant('Set Status'):
                    break;
                case this.pdfViewer.localeObj.getConstant('Accepted'): {
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    const acceptedStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-accepted-icon' });
                    statusDiv.style.backgroundColor = 'rgb(24,169,85)';
                    statusDiv.appendChild(statusSpan);
                    acceptedStatusDiv.appendChild(statusDiv);
                    contextActiveDiv.parentElement.appendChild(acceptedStatusDiv);
                    this.modifyStatusProperty('Accepted', contextActiveDiv.parentElement);
                    break;
                }
                case this.pdfViewer.localeObj.getConstant('Completed'): {
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    const completedStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    const statusElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const statusOptionSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-completed-icon' });
                    statusElement.style.backgroundColor = 'rgb(0,122,255)';
                    statusElement.appendChild(statusOptionSpan);
                    completedStatusDiv.appendChild(statusElement);
                    contextActiveDiv.parentElement.appendChild(completedStatusDiv);
                    this.modifyStatusProperty('Completed', contextActiveDiv.parentElement);
                    break;
                }
                case this.pdfViewer.localeObj.getConstant('Cancelled'): {
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    const cancelStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    const cancelStatusElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const cancelStatusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-cancelled-icon' });
                    cancelStatusElement.style.backgroundColor = 'rgb(245,103,0)';
                    cancelStatusElement.appendChild(cancelStatusSpan);
                    cancelStatusDiv.appendChild(cancelStatusElement);
                    contextActiveDiv.parentElement.appendChild(cancelStatusDiv);
                    this.modifyStatusProperty('Cancelled', contextActiveDiv.parentElement);
                    break;
                }
                case this.pdfViewer.localeObj.getConstant('Rejected'): {
                    if (contextActiveDiv.parentElement.lastChild.id === this.pdfViewer.element.id + 'status_container') {
                        contextActiveDiv.parentElement.lastChild.remove();
                    }
                    const rejectedStatusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                    const rejectedStatusElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                    const rejectedStatusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon', className: 'e-pv-rejected-icon' });
                    rejectedStatusElement.style.backgroundColor = 'rgb(255,59,48)';
                    rejectedStatusElement.appendChild(rejectedStatusSpan);
                    rejectedStatusDiv.appendChild(rejectedStatusElement);
                    contextActiveDiv.parentElement.appendChild(rejectedStatusDiv);
                    this.modifyStatusProperty('Rejected', contextActiveDiv.parentElement);
                    break;
                }
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

    private handleCommentDeletion(annotation: any): void {
        if (!isNullOrUndefined(annotation.note) && annotation.note !== '') {
            this.pdfViewer.fireCommentDelete(annotation.annotName, annotation.note, annotation);
        }
        this.pdfViewer.annotationModule.deleteAnnotation();
    }

    private getAnnotationById(element: any): { annotation: any; pageIndex: number } | null {
        const pageNumber: number = parseInt(element.accessKey.split('_')[0], 10);
        const pageIndex: number = pageNumber - 1;
        const annotType: string = element.getAttribute('name');
        const pageAnnotations: any = this.getAnnotations(pageIndex, null, annotType);
        if (pageAnnotations) {
            const annotation: any = pageAnnotations.find((annotation: any) => annotation.annotName === element.id) || null;
            return { annotation, pageIndex };
        }
        return null;
    }

    private moreOptionsClick(event: any, isMoreOptionClick?: boolean): void {
        if (document.getElementById(this.pdfViewer.element.id + '_comment_context_menu').style.display !== 'block') {
            this.pdfViewer.annotationModule.checkContextMenuDeleteItem(this.commentMenuObj);
            this.commentMenuObj.open(event.clientY, event.clientX, event.currentTarget);
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    }

    private openTextEditor(event: any): void {
        const commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let i: number = 0; i < commentShow.length; i++) {
            commentShow[parseInt(i.toString(), 10)].style.display = 'none';
        }
        const isCommentLocked: boolean = this.checkIslockProperty(event.currentTarget.nextSibling);
        if (isCommentLocked) {
            event.currentTarget.nextSibling.ej2_instances[0].enableEditMode = false;
        } else if (event.currentTarget && event.target) {
            const isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.id);
            if (!isLocked) {
                event.currentTarget.nextSibling.ej2_instances[0].enableEditMode = true;
            }
        } else {
            event.currentTarget.nextSibling.ej2_instances[0].enableEditMode = true;
        }
    }

    private checkIslockProperty(commentEvent: any): boolean {
        const annotCollection: any = this.pdfViewer.annotationCollection;
        let annotation: any;
        if (commentEvent.IsCommentLock) {
            return true;
        }
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule &&
             this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            annotation =  this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else if (this.pdfViewer.selectedItems.annotations[0]) {
            annotation =  this.pdfViewer.selectedItems.annotations[0];
        }
        for (let i: number = 0; i < annotCollection.length; i++) {
            annotCollection[parseInt(i.toString(), 10)].annotationSettings =
             !isNullOrUndefined(annotCollection[parseInt(i.toString(), 10)].annotationSettings) ?
                 annotCollection[parseInt(i.toString(), 10)].annotationSettings : {};
            const note: string = !isNullOrUndefined(annotCollection[parseInt(i.toString(), 10)].note) ?
                annotCollection[parseInt(i.toString(), 10)].note : annotCollection[parseInt(i.toString(), 10)].notes;
            if (annotCollection[parseInt(i.toString(), 10)].annotationSettings.isLock &&
             (commentEvent.textContent === note || annotCollection[parseInt(i.toString(), 10)].dynamicText === commentEvent.textContent)) {
                return true;
            }
            else if (annotCollection[parseInt(i.toString(), 10)].isCommentLock &&
             ((this.pdfViewer.selectedItems.annotations[parseInt(i.toString(), 10)] &&
              this.pdfViewer.selectedItems.annotations[parseInt(i.toString(), 10)].isCommentLock) ||
               (this.pdfViewer.annotationModule.textMarkupAnnotationModule &&
                 this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation &&
                  this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.isCommentLock))) {
                return true;
            }
            for (let j: number = 0; j < annotCollection[parseInt(i.toString(), 10)].comments.length; j++) {
                if (annotation && annotCollection[parseInt(i.toString(), 10)].annotationId === annotation.annotName) {
                    if (annotCollection[parseInt(i.toString(), 10)].comments[parseInt(j.toString(), 10)].isLock ===
                     true && commentEvent.textContent === annotCollection[parseInt(i.toString(), 10)].
                        comments[parseInt(j.toString(), 10)].note) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private openEditorElement(event: any): void {
        const commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let i: number = 0; i < commentShow.length; i++) {
            commentShow[parseInt(i.toString(), 10)].style.display = 'none';
        }
        const isCommentLocked: boolean = this.checkIslockProperty(event.currentTarget);
        if (isCommentLocked) {
            event.currentTarget.ej2_instances[0].enableEditMode = false;
        } else if (event.currentTarget && event.target) {
            const isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.id);
            if (!isLocked) {
                if (!isNullOrUndefined(this.pdfViewer.selectedItems) &&
                 this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].isReadonly) {
                    event.currentTarget.ej2_instances[0].enableEditMode = false;
                } else {
                    event.currentTarget.ej2_instances[0].enableEditMode = true;
                }
            }
        } else {
            event.currentTarget.ej2_instances[0].enableEditMode = true;
        }
    }

    private commentsDivClickEvent(event: any): void {
        const annotation: any = this.findAnnotationObject(event.currentTarget.parentElement.id);
        const isLocked: boolean = !isNullOrUndefined(annotation) ? (annotation.annotationSettings.isLock || annotation.isLock) : false;
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
            const x: any = document.querySelectorAll('.e-pv-more-options-button');
            for (let i: number = 0; i < x.length; i++) {
                x[parseInt(i.toString(), 10)].style.visibility = 'hidden';
            }
            if (document.getElementById(this.pdfViewer.element.id + '_commantPanel').style.display === 'none') {
                this.pdfViewer.annotationModule.showCommentsPanel();
            }
            if (event.currentTarget.parentElement.classList.contains('e-pv-comments-border')) {
                isCommentsSelect = true;
            }
            event.currentTarget.firstChild.lastChild.style.visibility = 'visible';
            const commentsContainer: any = document.querySelectorAll('.e-pv-comments-border');
            if (commentsContainer) {
                for (let j: number = 0; j < commentsContainer.length; j++) {
                    commentsContainer[parseInt(j.toString(), 10)].classList.remove('e-pv-comments-border');
                }
            }
            event.currentTarget.parentElement.classList.add('e-pv-comments-border');
            const commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
            for (let i: number = 0; i < commentShow.length; i++) {
                commentShow[parseInt(i.toString(), 10)].style.display = 'none';
            }
            const editElement: any = event.currentTarget.parentElement.lastChild;
            const commentsElement: any = event.currentTarget.parentElement;
            if (editElement) {
                editElement.style.display = 'block';
                if (editElement.querySelector('.e-editable-inline')) {
                    if (!this.isEditableElement) {
                        editElement.querySelector('.e-editable-inline').style.display = 'block';
                    }
                    for (let i: number = 0; i < commentsElement.childElementCount; i++) {
                        const activeElement: any = commentsElement.childNodes[parseInt(i.toString(), 10)];
                        const textElement: any = activeElement.querySelector('.e-editable-inline');
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
            if (event && event.currentTarget && event.currentTarget.childNodes[1])
            {
                editModule = event.currentTarget.childNodes[1].ej2_instances[0];
            }
            if (event.currentTarget && event.currentTarget.id && editModule) {
                if (annotation && annotation.isCommentLock)
                {
                    editModule.enableEditMode = false;
                    this.createCommentDiv(event.currentTarget);
                }
                this.pdfViewer.fireCommentSelect(event.currentTarget.id, event.currentTarget.childNodes[1].ej2_instances[0].value,
                                                 annotation);
            }
            this.commentDivOnSelect(event);
            event.preventDefault();
        }
    }

    private commentsDivDoubleClickEvent(event: any): void {
        const commentShow: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let i: number = 0; i < commentShow.length; i++) {
            commentShow[parseInt(i.toString(), 10)].style.display = 'none';
        }
        const isCommentLocked: boolean = this.checkIslockProperty(event.currentTarget.children[1]);
        if (isCommentLocked) {
            if (event.currentTarget.childElementCount === 2) {
                event.currentTarget.lastChild.ej2_instances[0].enableEditMode = false;
            } else {
                event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = false;
            }
        } else if (event.currentTarget && event.target) {
            const isLocked : boolean = this.checkAnnotationSettings(event.currentTarget.id);
            if (!isLocked) {
                if (event.currentTarget.childElementCount === 2) {
                    event.currentTarget.lastChild.ej2_instances[0].enableEditMode = true;
                } else {
                    event.currentTarget.childNodes[1].ej2_instances[0].enableEditMode = true;
                }
            }
        }
    }

    private commentDivOnSelect(event: any): void {
        const commentSelect: any = document.querySelectorAll('.e-pv-comments-select');
        for (let z: number = 0; z < commentSelect.length; z++) {
            commentSelect[parseInt(z.toString(), 10)].classList.remove('e-pv-comments-select');
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

    private commentDivMouseOver(event: any): void {
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

    private commentDivMouseLeave(event: any): void {
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
     * @param {any} event -  It describes about the event
     * @private
     * @returns {void}
     */
    public drawIcons(event: any): void {
        if (this.pdfViewerBase.isCommentIconAdded) {
            const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            const pageCurrentRect: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex).getBoundingClientRect();
            const zoomValue: number = this.pdfViewerBase.getZoomFactor();
            this.pdfViewer.annotationModule.isFormFieldShape = false;
            this.pdfViewer.annotation.stickyNotesAnnotationModule.
                drawStickyNotes((event.clientX - pageCurrentRect.left) / zoomValue,
                                (event.clientY - pageCurrentRect.top) / zoomValue, 30, 30, pageIndex, null);
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
                    if (this.pdfViewer.enableRtl) {
                        commentsIcon.className = 'e-pv-comment-icon e-pv-icon e-icon-left e-right';
                    } else {
                        commentsIcon.className = 'e-pv-comment-icon e-pv-icon e-icon-left';
                    }
                }
            }
        }
    }

    /**
     * @param {string} annotationType - It describes about the annotation type
     * @param {number} pageNumber - It describes about the page number
     * @param {string} annotationSubType - It describes about the annotation sub type
     * @private
     * @returns {string} - string
     */
    public addComments(annotationType: string, pageNumber: number, annotationSubType?: string): string {
        let commentsDivid: string;
        const accordion: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + pageNumber);
        if (accordion) {
            commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.
                createCommentControlPanel(null, pageNumber, annotationType, annotationSubType);
        } else {
            this.pdfViewer.annotation.stickyNotesAnnotationModule.createPageAccordion(pageNumber);
            commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.
                createCommentControlPanel(null, pageNumber, annotationType, annotationSubType);
        }
        return commentsDivid;
    }

    private commentsAnnotationSelect(event: any): void {
        const element: HTMLElement = event.currentTarget;
        const isLocked: boolean = this.checkAnnotationSettings(element.id);
        // When the isLock is set to true, it comes and checks whether the allowedInteractions is select and set the isLock to false, In that case if enters the condition and makes the comment panel to editable mode. So, have removed the condition in openEditorElement, commentsDivClickEvent, openTextEditor,commentAnnotationSelect methods. (Task id: 835410)
        if (!isLocked) {
            if (element.classList.contains('e-pv-comments-border')) {
                const commentsDiv: any = document.querySelectorAll('.e-pv-comments-div');
                for (let j: number = 0; j < commentsDiv.length; j++) {
                    commentsDiv[parseInt(j.toString(), 10)].style.minHeight = 60 + 'px';
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
            const pageNumber: number = parseInt(element.accessKey.split('_')[0], 10);
            if (!element.classList.contains('e-pv-comments-border')) {
                const commentsContainer: any = document.querySelectorAll('.e-pv-comments-border');
                if (commentsContainer) {
                    for (let j: number = 0; j < commentsContainer.length; j++) {
                        commentsContainer[parseInt(j.toString(), 10)].classList.remove('e-pv-comments-border');
                    }
                }
                const commentsDiv: HTMLElement = document.getElementById(element.id);
                if (commentsDiv) {
                    document.querySelectorAll('.e-pv-more-options-button[style*="visibility: visible"]').forEach((moreButton: any) => moreButton.style.visibility = 'hidden');
                    if (event.target.className === 'e-editable-value-wrapper') {
                        event.target.parentElement.parentElement.firstChild.lastChild.style.visibility = 'visible';
                    } else if (event.target.className === 'e-pv-reply-title' || event.target.className === 'e-pv-comment-title') {
                        event.target.parentElement.lastChild.style.visibility = 'visible';
                    } else if (event.target.className === 'e-editable-value') {
                        event.target.parentElement.parentElement.parentElement.firstChild.lastChild.style.visibility = 'visible';
                    }
                    commentsDiv.classList.add('e-pv-comments-border');
                }
                const commentTextBox: any = document.querySelectorAll('.e-pv-new-comments-div');
                for (let j: number = 0; j < commentTextBox.length; j++) {
                    commentTextBox[parseInt(j.toString(), 10)].style.display = 'none';
                }
                if (commentsDiv) {
                    const currentTextBox: any = commentsDiv.querySelector('.e-pv-new-comments-div');
                    if (currentTextBox) {
                        currentTextBox.style.display = 'block';
                    }
                }
                const textDiv: any = element.lastChild;
                this.isEditableElement = false;
                if (textDiv.querySelector('.e-editable-inline')) {
                    textDiv.style.display = 'block';
                    textDiv.querySelector('.e-editable-inline').style.display = 'block';
                    for (let i: number = 0; i < element.childElementCount; i++) {
                        const activeElement: any = element.childNodes[parseInt(i.toString(), 10)];
                        const textElement: any = activeElement.querySelector('.e-editable-inline');
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
                let annotType: string = element.getAttribute('name');
                if (annotType === 'null' || annotType === 'Ink') {
                    annotType = 'ink';
                }
                this.isCommentsSelected = false;
                this.setAnnotationType(element.id, annotType, pageNumber);
                if (!this.isCommentsSelected) {
                    this.selectAnnotationObj = { id: element.id, annotType: annotType, pageNumber: pageNumber };
                }
                if (this.pdfViewer.navigation) {
                    this.pdfViewer.navigationModule.goToPage(pageNumber);
                }
            }
        }
        else{
            const pageNumber: number = parseInt(element.accessKey.split('_')[0], 10);
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
        this.isSetAnnotationType = false;
    }

    private findAnnotationObject(id: string): any {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule &&
             this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else if (this.pdfViewer.selectedItems.annotations[0]) {
            return this.pdfViewer.selectedItems.annotations[0];
        }
        let annotationCollection: any = this.pdfViewer.annotationCollection;
        if (annotationCollection) {
            for (let i: number = 0; i < annotationCollection.length; i++) {
                if (annotationCollection[parseInt(i.toString(), 10)].annotationId &&
                 (annotationCollection[parseInt(i.toString(), 10)].annotationId === id)) {
                    if (annotationCollection[parseInt(i.toString(), 10)].shapeAnnotationType === 'textMarkup') {
                        return annotationCollection[parseInt(i.toString(), 10)];
                    } else {
                        annotationCollection = this.pdfViewer.annotations;
                        for (let j: number = 0; j < annotationCollection.length; j++) {
                            if (annotationCollection[parseInt(j.toString(), 10)].annotName &&
                             (annotationCollection[parseInt(j.toString(), 10)].annotName === id)) {
                                return annotationCollection[parseInt(j.toString(), 10)];
                            }
                        }
                    }
                }
            }
        }
    }

    private checkAnnotationSettings(annotId: any): boolean {
        const annotationCollection: any = this.pdfViewer.annotationCollection;
        if (annotationCollection) {
            const annot: any = annotationCollection.find((annotation: { annotationId: any; }) => annotation.annotationId === annotId);
            if (annot && annot.annotationSettings && annot.annotationSettings.isLock) {
                if (!annot.isCommentLock && annot.comments.length === 0 && (isNullOrUndefined(annot.note) || annot.note === '') && annot.shapeAnnotationType !== 'FreeText')
                {return true; }
                else if ((!isNullOrUndefined(annot.comments) && annot.comments.length > 0 &&
                 annot.comments[0].isLock) || annot.isCommentLock) {
                    return true;
                }
                else {
                    return false;
                }
            } else {
                return false;
            }
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
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    public selectCommentsAnnotation(pageIndex: number): void {
        if (this.selectAnnotationObj && !this.isCommentsSelected) {
            if ((this.selectAnnotationObj.pageNumber - 1) === pageIndex) {
                this.setAnnotationType(this.selectAnnotationObj.id, this.selectAnnotationObj.annotType,
                                       this.selectAnnotationObj.pageNumber);
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
        let storeCommentObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_' + typeString);
        if (this.pdfViewerBase.isStorageExceed) {
            storeCommentObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + typeString];
        }
        if (storeCommentObject) {
            const annotationCommentObject: IPageAnnotations[] = JSON.parse(storeCommentObject);
            const annotation: any = this.pdfViewer.selectedItems.annotations[0];
            const index: number = this.pdfViewer.annotationModule.
                getPageCollection(annotationCommentObject, (pageNumber - 1));
            if (index != null && annotationCommentObject[parseInt(index.toString(), 10)]) {
                const pageCollections: any = annotationCommentObject[parseInt(index.toString(), 10)].annotations;
                for (let i: number = 0; i < pageCollections.length; i++) {
                    const currentSelector: AnnotationSelectorSettingsModel =
                     pageCollections[parseInt(i.toString(), 10)].annotationSelectorSettings;
                    if (pageCollections[parseInt(i.toString(), 10)].annotName === id) {
                        if (annotation) {
                            this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
                            this.pdfViewer.annotation.triggerSignatureUnselectEvent();
                        }
                        this.pdfViewer.clearSelection(pageNumber - 1);
                        if (type === 'textMarkup') {
                            this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                clearCurrentAnnotationSelection(pageNumber - 1, true);
                            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + (pageNumber - 1));
                            this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                selectAnnotation(pageCollections[parseInt(i.toString(), 10)], canvas, (pageNumber - 1));
                            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation =
                             pageCollections[parseInt(i.toString(), 10)];
                            this.pdfViewer.annotation.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageNumber - 1;
                            this.pdfViewer.annotation.textMarkupAnnotationModule.enableAnnotationPropertiesTool(true);
                            if (this.pdfViewer.toolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                                this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                                this.pdfViewer.toolbarModule.annotationToolbarModule.
                                    showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                            }
                        } else if (type === 'stamp') {
                            this.pdfViewer.select([pageCollections[parseInt(i.toString(), 10)].randomId], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        } else if (type === 'sticky') {
                            this.pdfViewer.select([pageCollections[parseInt(i.toString(), 10)].annotName], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        } else if (type === 'ink') {
                            this.pdfViewer.select([pageCollections[parseInt(i.toString(), 10)].id], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        } else {
                            this.pdfViewer.select([pageCollections[parseInt(i.toString(), 10)].id], currentSelector);
                            this.pdfViewer.annotation.onAnnotationMouseDown();
                        }
                        if (type === 'textMarkup') {
                            if (pageCollections[parseInt(i.toString(), 10)].rect || pageCollections[parseInt(i.toString(), 10)].bounds) {
                                const scrollValue: number = this.pdfViewerBase.pageSize[pageNumber - 1].top *
                                 this.pdfViewerBase.getZoomFactor() + (this.pdfViewer.annotationModule.
                                    getAnnotationTop(pageCollections[parseInt(i.toString(), 10)]) * this.pdfViewerBase.getZoomFactor());
                                if (scrollValue) {
                                    const scroll: string = (scrollValue - 20).toString();
                                    this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll, 10);
                                }
                            }
                        } else {
                            let top: number = pageCollections[parseInt(i.toString(), 10)].bounds.top;
                            if (type === 'ink') {
                                top = pageCollections[parseInt(i.toString(), 10)].bounds.y;
                            }
                            const scrollValue: number = this.pdfViewerBase.pageSize[pageNumber - 1].top *
                             this.pdfViewerBase.getZoomFactor() + ((top) * this.pdfViewerBase.getZoomFactor());

                            const scroll: string = (scrollValue - 20).toString();
                            this.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll, 10);
                        }
                        this.isCommentsSelected = true;
                    }
                }
            }
        }
    }

    private modifyTextProperty(text: string, previousValue: any, annotationName?: any): void {
        let currentAnnotation: any;
        const module: any = this.pdfViewer.annotationModule.textMarkupAnnotationModule;
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
        if (isNullOrUndefined(currentAnnotation) && annotationName || (!isNullOrUndefined(currentAnnotation) &&
         currentAnnotation.annotName !== annotationName)) {
            currentAnnotation = this.pdfViewer.annotationCollection.filter(function (annot: any): boolean
            { return annot.annotationId === annotationName; })[0];
        }
        if (annotationName && (currentAnnotation.annotName !== annotationName)) {
            for (let i: number = 0; i < this.pdfViewer.annotations.length; i++) {
                if (annotationName === this.pdfViewer.annotations[parseInt(i.toString(), 10)].annotName) {
                    currentAnnotation = this.pdfViewer.annotations[parseInt(i.toString(), 10)];
                    break;
                }
            }
        }
        if (currentAnnotation) {
            currentAnnotation.annotName = !isNullOrUndefined(currentAnnotation.annotName) ?
                currentAnnotation.annotName : currentAnnotation.annotationId;
            const commentsDiv: any = document.getElementById(currentAnnotation.annotName);
            if (commentsDiv) {
                let pageNumber: any;
                if (commentsDiv.accessKey.split('_')[0]) {
                    pageNumber = parseInt(commentsDiv.accessKey.split('_')[0], 10);
                } else {
                    pageNumber = this.pdfViewerBase.currentPageNumber;
                }
                const type: string = commentsDiv.getAttribute('name');
                const pageIndex: number = pageNumber - 1;
                let pageAnnotations: any;
                let isMeasure: boolean = false;
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
                                this.textFromCommentPanel = true;
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
                        if (pageAnnotations[parseInt(i.toString(), 10)].annotName === currentAnnotation.annotName) {
                            const clonedObject: Object = cloneObject(pageAnnotations[parseInt(i.toString(), 10)]);
                            if (!isNullOrUndefined(text) && text !== '' || (!isNullOrUndefined(text) && text === '' &&
                                previousValue !== '')) {
                                if (pageAnnotations[parseInt(i.toString(), 10)].note !== text) {
                                    this.pdfViewer.annotation.addAction(pageIndex, i, pageAnnotations[parseInt(i.toString(), 10)], 'Text Property Added', '', clonedObject, pageAnnotations[parseInt(i.toString(), 10)]);
                                    currentAnnotation = pageAnnotations[parseInt(i.toString(), 10)];
                                    currentAnnotation.note = text;
                                    if (currentAnnotation.enableShapeLabel) {
                                        currentAnnotation.labelContent = text;
                                    }
                                    currentAnnotation.modifiedDate = this.getDateAndTime();
                                    if (!isMeasure) {
                                        this.updateUndoRedoCollections(currentAnnotation, pageIndex);
                                    } else {
                                        this.updateUndoRedoCollections(currentAnnotation, pageIndex, 'shape_measure');
                                    }
                                    if (!previousValue || previousValue === '') {
                                        this.pdfViewer.fireCommentAdd(currentAnnotation.annotName, currentAnnotation.note,
                                                                      currentAnnotation);
                                    } else {
                                        this.pdfViewer.fireCommentEdit(currentAnnotation.annotName, currentAnnotation.note,
                                                                       currentAnnotation);
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
     * @param {any} date - It describes about the date
     * @private
     * @returns {string} - string
     */
    public getDateAndTime(date?: any): string {
        if (!date) {
            date = new Date();
        }
        this.globalize = new Internationalization();
        const dateOptions: object = { format: 'M/d/yyyy h:mm:ss a', type: 'dateTime'};
        const dateTime: string = this.globalize.formatDate(new Date(date), dateOptions);
        return dateTime;
    }

    public getDateAndTimeFormat(date?: any): string {
        if (!date) {
            date = new Date();
        }
        this.globalize = new Internationalization();
        const dateOptions: object = { format: this.pdfViewer.dateTimeFormat, type: 'dateTime'};
        const dateTime: string = this.globalize.formatDate(new Date(date), dateOptions);
        return dateTime;
    }

    private modifyCommentsProperty(text: string, annotName: string, parentElement: string, previousValue?: any): void {
        let currentAnnotation: any;
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        if (!currentAnnotation) {
            const annotationKeys: string[] = Object.keys(this.pdfViewer.nameTable);
            for (let i: number = 0; i < annotationKeys.length; i++) {
                const annotObject: any = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                if (parentElement === annotObject.annotName){
                    currentAnnotation = annotObject;
                    break;
                }
            }
        }
        if (currentAnnotation) {
            const commentsDiv: HTMLElement = document.getElementById(currentAnnotation.annotName);
            const pageNumber: number = parseInt(commentsDiv.accessKey.split('_')[0], 10);
            const pageIndex: number = pageNumber - 1;
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
                    if (pageAnnotations[parseInt(i.toString(), 10)].annotName === currentAnnotation.annotName) {
                        currentAnnotation = pageAnnotations[parseInt(i.toString(), 10)];
                    }
                }
            }
            const clonedObject: Object = cloneObject(currentAnnotation);
            if (currentAnnotation.comments.length > 0) {
                let isComment: boolean = false;
                for (let j: number = 0; j < currentAnnotation.comments.length; j++) {
                    if (currentAnnotation.comments[parseInt(j.toString(), 10)].annotName === annotName) {
                        isComment = true;
                        currentAnnotation.comments[parseInt(j.toString(), 10)].note = text;
                        currentAnnotation.comments[parseInt(j.toString(), 10)].modifiedDate = this.getDateAndTime();
                    }
                }
                if (currentAnnotation.annotName === parentElement) {
                    const newArray: ICommentsCollection = { annotName: annotName, parentId: parentElement, subject: currentAnnotation.subject, comments: [], author: author, note: text, shapeAnnotationType: '', state: '', stateModel: '', modifiedDate: this.getDateAndTime(), review: { state: '', stateModel: '', modifiedDate: this.getDateAndTime(), author: author }, isLock: false };
                    if (!isComment) {
                        currentAnnotation.comments[currentAnnotation.comments.length] = newArray;
                    }
                }
            } else if (currentAnnotation.annotName === parentElement) {
                const newArray: ICommentsCollection = { annotName: annotName, parentId: parentElement, subject: currentAnnotation.subject, comments: [], author: author, note: text, shapeAnnotationType: '', state: '', stateModel: '', modifiedDate: this.getDateAndTime(), review: { state: '', stateModel: '', modifiedDate: this.getDateAndTime(), author: author }, isLock: false };
                currentAnnotation.comments[currentAnnotation.comments.length] = newArray;
            }
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

    private modifyStatusProperty(text: string, statusElement: any): void {
        let currentAnnotation: any;
        if (this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            currentAnnotation = this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation;
        } else {
            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
        }
        if (currentAnnotation) {
            const commentsDiv: HTMLElement = document.getElementById(currentAnnotation.annotName);
            const pageNumber: number = parseInt(commentsDiv.accessKey.split('_')[0], 10);
            const pageIndex: number = pageNumber - 1;
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
                    if (pageAnnotations[parseInt(i.toString(), 10)].annotName === currentAnnotation.annotName) {
                        currentAnnotation = pageAnnotations[parseInt(i.toString(), 10)];
                    }
                }
            }
            const clonedObject: Object = cloneObject(currentAnnotation);
            if (statusElement.parentElement.firstChild.id === statusElement.id) {
                currentAnnotation.review = { state: text, stateModel: 'Review', author: author, modifiedDate: this.getDateAndTime(), annotId: statusElement.id };
                currentAnnotation.state = text;
                currentAnnotation.stateModel = 'Review';
                this.pdfViewer.annotation.addAction(pageIndex, null, currentAnnotation, 'Status Property Added', '', clonedObject, currentAnnotation);
                this.pdfViewer.fireCommentStatusChanged(statusElement.id, currentAnnotation.note, currentAnnotation,
                                                        currentAnnotation.state);
            } else {
                for (let j: number = 0; j < currentAnnotation.comments.length; j++) {
                    if (currentAnnotation.comments[parseInt(j.toString(), 10)].annotName === statusElement.id) {
                        const clonedObj: Object = cloneObject(currentAnnotation.comments[parseInt(j.toString(), 10)]);
                        currentAnnotation.comments[parseInt(j.toString(), 10)].state = text;
                        currentAnnotation.comments[parseInt(j.toString(), 10)].stateModel = 'Review';
                        currentAnnotation.comments[parseInt(j.toString(), 10)].review = { state: text, stateModel: 'Review', author: author, modifiedDate: this.getDateAndTime(), annotId: statusElement.id };
                        this.pdfViewer.annotation.addAction(pageIndex, null, currentAnnotation, 'Status Property Added', '', clonedObj, currentAnnotation.comments[parseInt(j.toString(), 10)]);
                        this.pdfViewer.fireCommentStatusChanged(currentAnnotation.comments[parseInt(j.toString(), 10)].annotName,
                                                                currentAnnotation.comments[parseInt(j.toString(), 10)].note,
                                                                currentAnnotation,
                                                                currentAnnotation.comments[parseInt(j.toString(), 10)].state);
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
     * @param {any} commentsElement - It describes about the comments element
     * @param {any} replyElement - It describes about the reply element
     * @private
     * @returns {void}
     */
    public modifyCommentDeleteProperty(commentsElement: any, replyElement: any): void {
        const commentsParentElement: any = document.getElementById(commentsElement.id);
        const annotationData: any = this.getAnnotationById(commentsElement);
        if (commentsParentElement && annotationData) {
            const { annotation: currentAnnotation, pageIndex } = annotationData;
            let clonedAnnotation : any;
            let clonedObject : any;
            for (let i: number = 1; i < commentsParentElement.childElementCount; i++) {
                if (commentsParentElement.childNodes[parseInt(i.toString(), 10)].id === replyElement.id) {
                    const positionValue: number = i - 1;
                    const comment: any = currentAnnotation.comments[positionValue as number];
                    clonedAnnotation = cloneObject(currentAnnotation);
                    clonedObject = cloneObject(comment);
                    comment.position = i;
                    this.pdfViewer.fireCommentDelete(comment.annotName, comment.note, currentAnnotation);
                    currentAnnotation.comments.splice(parseInt(positionValue.toString(), 10), 1);
                    replyElement.remove();
                }
            }
            this.pdfViewer.annotation.addAction(
                pageIndex,
                null,
                clonedAnnotation,
                'Comments Reply Deleted',
                '',
                clonedObject,
                currentAnnotation
            );
            this.updateUndoRedoCollections(currentAnnotation, pageIndex);
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @private
     * @returns {void}
     */
    public updateOpacityValue(annotation: any): void {
        const pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null, annotation.shapeAnnotationType);
        this.pdfViewer.annotationModule.isFormFieldShape = false;
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (pageAnnotations[parseInt(i.toString(), 10)].annotName === annotation.annotName) {
                    pageAnnotations[parseInt(i.toString(), 10)].opacity = annotation.opacity;
                    this.updateUndoRedoCollections(pageAnnotations[parseInt(i.toString(), 10)], annotation.pageIndex);
                }
            }
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {string} isAction - It describes about the isAction
     * @param {any} undoAnnotation - It describes about the undo annotation
     * @private
     * @returns {any} - any
     */
    public undoAction(annotation: any, isAction: string, undoAnnotation?: any): any {
        if (isAction === 'Text Property Added') {
            if (annotation) {
                const commentsMainDiv: any = document.getElementById(annotation.annotName);
                if (commentsMainDiv) {
                    const pageNumber: any = parseInt(commentsMainDiv.accessKey.split('_')[0], 10);
                    const pageIndex: number = pageNumber - 1;
                    const clonedAnnotationObject: any = cloneObject(annotation);
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
                const commentsDiv: any = document.getElementById(annotation.annotName);
                let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
                if (commentsDiv) {
                    const pageNumber: number = parseInt(commentsDiv.accessKey.split('_')[0], 10);
                    pageIndex = pageNumber - 1;
                }
                const clonedAnnotationObject: any = cloneObject(annotation);
                const comment: any = annotation.comments[annotation.comments.length - 1];
                const removeDiv: HTMLElement = document.getElementById(comment.annotName);
                if (removeDiv) {
                    removeDiv.remove();
                }
                annotation = undoAnnotation;
                this.updateUndoRedoCollections(annotation, pageIndex);
                return clonedAnnotationObject;
            }
        } else if (isAction === 'Status Property Added') {
            if (annotation) {
                const commentsDiv: HTMLElement = document.getElementById(annotation.annotName);
                let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
                if (commentsDiv) {
                    const pageNumber: number = parseInt(commentsDiv.accessKey.split('_')[0], 10);
                    pageIndex = pageNumber - 1;
                }
                const clonedAnnotationObject: Object = cloneObject(annotation);
                if (annotation.annotName === undoAnnotation.annotName) {
                    annotation.review = undoAnnotation.review;
                    annotation.state = undoAnnotation.state;
                    annotation.stateModel = undoAnnotation.stateModel;
                    this.pdfViewer.annotation.redoCommentsElement.push(annotation);
                } else {
                    for (let j: number = 0; j < annotation.comments.length; j++) {
                        if (annotation.comments[parseInt(j.toString(), 10)].annotName === undoAnnotation.annotName) {
                            annotation.comments[parseInt(j.toString(), 10)].state = undoAnnotation.state;
                            annotation.comments[parseInt(j.toString(), 10)].stateModel = undoAnnotation.stateModel;
                            annotation.comments[parseInt(j.toString(), 10)].review = undoAnnotation.review;
                            this.pdfViewer.annotation.redoCommentsElement.push(annotation.comments[parseInt(j.toString(), 10)]);
                            break;
                        }
                    }
                }
                const activeDiv: any = document.getElementById(undoAnnotation.annotName);
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
            const commentsDiv: HTMLElement = document.getElementById(annotation.annotName);
            if (commentsDiv) {
                const pageNumber: number = parseInt(commentsDiv.accessKey.split('_')[0], 10);
                const pageIndex: number = pageNumber - 1;
                this.renderComments(undoAnnotation, commentsDiv, true, annotation.annotName);
                this.pdfViewer.annotation.redoCommentsElement.push(undoAnnotation);
                this.updateUndoRedoCollections(annotation, pageIndex);
                return annotation;
            }
        } else if (isAction === 'dynamicText Change') {
            if (annotation) {
                const commentsMainDiv: any = document.getElementById(annotation.annotName);
                if (commentsMainDiv) {
                    commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = undoAnnotation.dynamicText;
                    return annotation;
                }
            }
        }

    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {string} isAction - It describes about the isAction
     * @param {any} undoAnnotation - It describes about the undo annotation
     * @private
     * @returns {any} - any
     */
    public redoAction(annotation: any, isAction: string, undoAnnotation?: any): any {
        if (isAction === 'Text Property Added') {
            const commentsMainDiv: any = document.getElementById(annotation.annotName);
            if (commentsMainDiv) {
                const pageNumber: any = parseInt(commentsMainDiv.accessKey.split('_')[0], 10);
                const pageIndex: number = pageNumber - 1;
                commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = annotation.note;
                commentsMainDiv.lastChild.style.display = 'block';
                this.updateUndoRedoCollections(annotation, pageIndex);
                return annotation;
            }
        } else if (isAction === 'Comments Property Added') {
            const comment: any = annotation.comments[annotation.comments.length - 1];
            const commentsDiv: HTMLElement = document.getElementById(annotation.annotName);
            if (commentsDiv) {
                const pageNumber: any = parseInt(commentsDiv.accessKey.split('_')[0], 10);
                const pageIndex: number = pageNumber - 1;
                this.renderComments(comment, commentsDiv, true, annotation.annotName);
                this.updateUndoRedoCollections(annotation, pageIndex);
                return annotation;
            }
        } else if (isAction === 'Status Property Added') {
            const poppedItem: IPopupAnnotation = this.pdfViewer.annotation.redoCommentsElement.pop();
            let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
            if (poppedItem) {
                const statusContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_container', className: 'e-pv-status-container' });
                const statusDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + 'status' + '_div', className: 'e-pv-status-div' });
                const statusSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + 'status' + '_icon' });
                statusDiv.appendChild(statusSpan);
                statusContainer.appendChild(statusDiv);
                const activeDiv: any = document.getElementById(annotation.annotName);
                if (activeDiv) {
                    const pageNumber: number = parseInt(activeDiv.accessKey.split('_')[0], 10);
                    pageIndex = pageNumber - 1;
                }
                if (annotation.annotName === poppedItem.annotName) {
                    this.updateStatusContainer(annotation.state, statusSpan, statusDiv, statusContainer);
                    for (let i: number = 0; i < activeDiv.firstChild.children.length; i++) {
                        if (activeDiv.firstChild.children[parseInt(i.toString(), 10)].id === this.pdfViewer.element.id + 'status_container') {
                            activeDiv.firstChild.children[parseInt(i.toString(), 10)].parentElement.
                                removeChild(activeDiv.firstChild.children[parseInt(i.toString(), 10)]);
                        }
                    }
                    activeDiv.firstChild.appendChild(statusContainer);
                } else {
                    for (let i: number = 0; i < annotation.comments.length; i++) {
                        if (annotation.comments[parseInt(i.toString(), 10)].annotName === poppedItem.annotName) {
                            this.updateStatusContainer(annotation.comments[parseInt(i.toString(), 10)].state,
                                                       statusSpan, statusDiv, statusContainer);
                            const statusElement: HTMLElement = document.getElementById(poppedItem.annotName);
                            for (let i: number = 0; i < statusElement.children.length; i++) {
                                if (statusElement.children[parseInt(i.toString(), 10)].id === this.pdfViewer.element.id + 'status_container') {
                                    statusElement.children[parseInt(i.toString(), 10)].
                                        parentElement.removeChild(statusElement.children[parseInt(i.toString(), 10)]);
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
            const activeDiv: any = document.getElementById(annotation.annotName);
            if (activeDiv) {
                const pageNumber: number = parseInt(activeDiv.accessKey.split('_')[0], 10);
                pageIndex = pageNumber - 1;
            }
            const poppedItem: IPopupAnnotation = this.pdfViewer.annotation.redoCommentsElement.pop();
            const clonedAnnotationObject: Object = cloneObject(annotation);
            for (let i: number = 0; i < annotation.comments.length; i++) {
                if (annotation.comments[parseInt(i.toString(), 10)].annotName === poppedItem.annotName) {
                    const replyElement: HTMLElement = document.getElementById(poppedItem.annotName);
                    annotation.comments.splice(i, 1);
                    replyElement.remove();
                }
            }
            this.updateUndoRedoCollections(annotation, pageIndex);
            return clonedAnnotationObject;
        } else if (isAction === 'dynamicText Change') {
            if (annotation) {
                const commentsMainDiv: any = document.getElementById(annotation.annotName);
                if (commentsMainDiv) {
                    commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = annotation.dynamicText;
                    return annotation;
                }
            }
        }
    }

    private updateUndoRedoCollections(annotationBase: any, pageNumber: number, shapeType?: string, action?: string): void {
        let annotationType: string = (!shapeType) ? annotationBase.shapeAnnotationType : shapeType;
        if (annotationBase.indent && annotationBase.indent !== '') {
            annotationType = 'shape_measure';
        }
        const pageAnnotations: any = this.getAnnotations(pageNumber, null, annotationType);
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.annotName === pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                    pageAnnotations[parseInt(i.toString(), 10)] = annotationBase;
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)], pageNumber);
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
     * @param {any} pageIndex - It describes about the page index
     * @param {string} type - It describes about the type
     * @param {boolean} action - It describes about the action
     * @private
     * @returns {void}
     */
    public addAnnotationComments(pageIndex: any, type: string, action?: boolean): void {
        const pageNumber: number = pageIndex + 1;
        let poppedItem: IPopupAnnotation;
        if (!action){
            poppedItem = this.pdfViewer.annotation.redoCommentsElement.pop();
        }
        else if (action){
            poppedItem = this.pdfViewer.annotation.undoCommentsElement.pop();
        }
        if (poppedItem) {
            this.createCommentsContainer(poppedItem, pageNumber);
            this.updateUndoRedoCollections(poppedItem, pageIndex, type);
            this.pdfViewer.annotationModule.storeAnnotationCollections(poppedItem, pageNumber - 1);
        }
    }
    /**
     * @param {any} annotation - It describes about the annotation
     * @param {string} type - It describes about the type
     * @param {string} action - It describes about the action
     * @param {boolean} isUndoAction - Ensures whether undo action is true or not
     * @private
     * @returns {void}
     */
    public findPosition(annotation: any, type: string, action?: string, isUndoAction?: boolean): any {
        let index: number;
        const commentsDiv: HTMLElement = document.getElementById(annotation.annotName);
        if (commentsDiv) {
            const pageNumber: number = parseInt(commentsDiv.accessKey.split('_')[0], 10);
            const pageIndex: number = pageNumber - 1;
            const parentDiv: any = commentsDiv.parentElement;
            for (let i: number = 0; i < parentDiv.childElementCount; i++) {
                if (parentDiv.childNodes[parseInt(i.toString(), 10)].id === annotation.annotName) {
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
            const pageAnnotations: any = this.getAnnotations(pageIndex, null, type);
            if (pageAnnotations !== null) {
                for (let i: number = 0; i < pageAnnotations.length; i++) {
                    if (pageAnnotations[parseInt(i.toString(), 10)].annotName === annotation.annotName) {
                        const clonedObject: Object = cloneObject(pageAnnotations[parseInt(i.toString(), 10)]);
                        pageAnnotations[parseInt(i.toString(), 10)].position = index;
                        if (!isUndoAction) {
                            this.pdfViewer.annotation.undoCommentsElement.push(pageAnnotations[parseInt(i.toString(), 10)]);
                        }
                        else{
                            this.pdfViewer.annotation.redoCommentsElement.push(pageAnnotations[parseInt(i.toString(), 10)]);
                        }
                        if (type === 'sticky') {
                            this.updateUndoRedoCollections(clonedObject, pageIndex, null, action);
                        }
                    }
                }
            }
        }
    }

    private getAnnotations(pageIndex: number, shapeAnnotations: any[], type: string): any[] {
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
        let storeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_' + type);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + type];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotationCollection = annotObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = shapeAnnotations;
            }
        } else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    }

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
        let storeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_' + type);
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + type];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                PdfViewerBase.sessionStorageManager.removeItem(this.pdfViewerBase.documentId + '_annotations_' + type);
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_' + type] = annotationStringified;
            } else {
                PdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_annotations_' + type, annotationStringified);
            }
        }
    }

    public updateStickyNotes(annotation: any, id: any): void {
        let storeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'];
        }
        if (storeObject) {
            const bounds: any = annotation.bounds;
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            for (let k: number = 0; k < annotObject.length; k++) {
                const currentAnnot: any = annotObject[parseInt(k.toString(), 10)];
                for (let j: number = 0; j < currentAnnot.annotations.length; j++) {
                    if (annotObject[parseInt(k.toString(), 10)].annotations[parseInt(j.toString(), 10)].annotName ===
                     annotation.annotName) {
                        if (!this.pdfViewerBase.isStorageExceed) {
                            PdfViewerBase.sessionStorageManager.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
                        }
                        const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, 0);
                        if (annotObject[parseInt(k.toString(), 10)]) {
                            annotObject[parseInt(k.toString(), 10)].annotations[parseInt(j.toString(), 10)].bounds =
                             { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height,
                                 right: bounds.right, bottom: bounds.bottom };
                        }
                        const annotationStringified: string = JSON.stringify(annotObject);
                        if (this.pdfViewerBase.isStorageExceed) {
                            this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'] = annotationStringified;
                        } else {
                            PdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_annotations_sticky', annotationStringified);
                        }
                        break;
                    }
                }
            }
        }
    }

    public saveStickyAnnotations(): string {
        let storeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'];
        }
        const annotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[parseInt(j.toString(), 10)] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IPopupAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[parseInt(z.toString(), 10)]);
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                         JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.
                             annotations[parseInt(z.toString(), 10)].bounds, pageAnnotationObject.pageIndex));
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }

    private deleteStickyNotesAnnotations(pageAnnotations: any, pageNumber: number): void {
        let storeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_sticky');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                PdfViewerBase.sessionStorageManager.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_sticky'] = annotationStringified;
            } else {
                PdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_annotations_sticky', annotationStringified);
            }
        }
    }

    public addStickyNotesAnnotations(pageNumber: number, annotationBase: any): void {
        const pageAnnotations: IPopupAnnotation[] = this.getAnnotations(pageNumber, null, 'sticky');
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber, 'sticky');
    }

    /**
     * @param {string} annotName - It describes about the annotName
     * @param {string} text - It describes about the text
     * @private
     * @returns {void}
     */
    public addTextToComments(annotName: string, text: string): void {
        const commentsMainDiv: any = document.getElementById(annotName);
        if (commentsMainDiv) {
            commentsMainDiv.firstChild.firstChild.nextSibling.ej2_instances[0].value = text;
        }
    }

    /**
     * @param {any} newAnnotation - It describes about the new annotation
     * @param {any} annotation - It describes about the annotation
     * @param {boolean} isCut - It describes about the isCut
     * @private
     * @returns {void}
     */
    public updateAnnotationCollection(newAnnotation: any, annotation: any, isCut: boolean): void {
        const type: string = this.findAnnotationType(annotation);
        let pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null, type);
        if (isCut) {
            pageAnnotations = this.pdfViewer.annotationModule.removedAnnotationCollection;
        }
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (isCut && !pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                    pageAnnotations[parseInt(i.toString(), 10)].annotName = pageAnnotations[parseInt(i.toString(), 10)].annotationId;
                }
                if (pageAnnotations[parseInt(i.toString(), 10)].annotName === annotation.annotName) {
                    const updateAnnotation: any = cloneObject(pageAnnotations[parseInt(i.toString(), 10)]);
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
                        updateAnnotation.bounds.x = newAnnotation.bounds.x;
                        updateAnnotation.bounds.y = newAnnotation.bounds.y;
                        updateAnnotation.vertexPoints = newAnnotation.vertexPoints;
                    }
                    updateAnnotation.note = updateAnnotation.note ? updateAnnotation.note : '';
                    updateAnnotation.comments = [];
                    updateAnnotation.review = { state: '', stateModel: '', modifiedDate: updateAnnotation.ModifiedDate, author: updateAnnotation.author };
                    updateAnnotation.state = '';
                    updateAnnotation.stateModel = '';
                    updateAnnotation.pageNumber = annotation.pageIndex;
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
            dateTime = this.getDateAndTimeFormat(data);
        } else {
            dateTime = this.getDateAndTimeFormat();
        }
        const date: Date = new Date(dateTime);
        let modifiedTime: string;
        const modifiedDate: string = dateTime.toString().split(' ').splice(0, 4).join(' ');
        if (date.toLocaleTimeString().split(' ').length === 2) {
            modifiedTime = date.toLocaleTimeString().split(' ')[0].split(':').splice(0, 2).join(':') + ' ' + date.toLocaleTimeString().split(' ')[1];
        }
        else {
            const time: number = parseInt(date.toLocaleTimeString().split(':')[0], 10);
            const minutes: string = date.toLocaleTimeString().split(':')[1];
            modifiedTime = this.updateModifiedTime(time, minutes);
        }
        const modifiedDateTime: string = modifiedDate ;
        return modifiedDateTime;
    }

    private convertUTCDateToLocalDate(date: any): string{
        this.globalize = new Internationalization();
        const dateOptions: object = { format: this.pdfViewer.dateTimeFormat, type: 'dateTime'};
        const dateTime: string = this.globalize.formatDate(new Date(date), dateOptions);
        return dateTime;
    }

    private updateModifiedDate(titleContainer: any): void {
        if (titleContainer.id === this.pdfViewer.element.id + '_commenttype_icon') {
            titleContainer = titleContainer.nextSibling;
        }
        const author: string = titleContainer.textContent.split('-')[0];
        titleContainer.textContent = author + ' - ' + this.setModifiedDate();
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {boolean} isBounds - It describes about the isBoolean
     * @param {boolean} isUndoRedoAction - It describes about the isUndoRedoAction
     * @private
     * @returns {void}
     */
    public updateAnnotationModifiedDate(annotation: any, isBounds?: boolean, isUndoRedoAction?: boolean): void {
        let titleContainer: any;
        if (annotation) {
            const commentsContainer: HTMLElement = document.getElementById(annotation.annotName);
            if (commentsContainer) {
                if (!isBounds) {
                    titleContainer = commentsContainer.firstChild.firstChild.childNodes[1];
                    const author: string = titleContainer.textContent.split('-')[0];
                    titleContainer.textContent = author + ' - ' + this.setModifiedDate();
                } else {
                    const type: string = this.findAnnotationType(annotation);
                    const pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null, type);
                    if (pageAnnotations !== null && annotation) {
                        for (let i: number = 0; i < pageAnnotations.length; i++) {
                            if (annotation.annotName === pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                                if (annotation.bounds.x !== pageAnnotations[parseInt(i.toString(), 10)].bounds.left ||
                                 annotation.bounds.y !== pageAnnotations[parseInt(i.toString(), 10)].bounds.top ||
                                  annotation.bounds.height !== pageAnnotations[parseInt(i.toString(), 10)].bounds.height ||
                                   annotation.bounds.width !== pageAnnotations[parseInt(i.toString(), 10)].bounds.width) {
                                    titleContainer = commentsContainer.firstChild.firstChild.childNodes[1];
                                    const author: string = titleContainer.textContent.split('-')[0];
                                    titleContainer.textContent = author + ' - ' + this.setModifiedDate();
                                }
                            }
                            if (pageAnnotations[parseInt(i.toString(), 10)].shapeAnnotationType === 'sticky') {
                                this.pdfViewer.annotationModule.
                                    storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)], annotation.pageIndex);
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
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public saveImportedStickyNotesAnnotations(annotation: any, pageNumber: number): void {
        let annotationObject: IPopupAnnotation = null;
        if (!annotation.Author) {
            annotation.Author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author;
        }
        const isLock: boolean = this.pdfViewer.stickyNotesSettings.isLock ?
            this.pdfViewer.stickyNotesSettings.isLock : this.pdfViewer.annotationSettings.isLock;
        const allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotationObject = {
            shapeAnnotationType: 'sticky', author: annotation.Author, allowedInteractions: allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, note: annotation.Note, opacity: annotation.Opacity, state: annotation.State, stateModel: annotation.StateModel,
            pathData: '', comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, pageNumber: pageNumber,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            annotName: annotation.AnnotName, color: annotation.color,
            annotationSelectorSettings: this.getSettings(annotation),
            customData: this.pdfViewer.annotation.getCustomData(annotation),
            annotationSettings: { isLock: isLock }, isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_sticky');
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {any} - any
     */
    public updateStickyNotesAnnotationCollections(annotation: any, pageNumber: number): any {
        let annotationObject: any = null;
        if (!annotation.Author) {
            annotation.Author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.stickyNotesSettings.author;
        }
        let isLock: boolean = this.pdfViewer.stickyNotesSettings.isLock ?
            this.pdfViewer.stickyNotesSettings.isLock : this.pdfViewer.annotationSettings.isLock;
        const allowedInteractions: any = annotation.AllowedInteraction ?
            annotation.AllowedInteraction : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        if (annotation.IsLock) {
            isLock = annotation.isLock;
        }
        annotationObject = {
            shapeAnnotationType: 'sticky', author: annotation.Author, allowedInteractions: allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, note: annotation.Note, opacity: annotation.Opacity, state: annotation.State, stateModel: annotation.StateModel,
            pathData: '', comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            annotationId: annotation.AnnotName, color: annotation.color, pageNumber: pageNumber,
            customData: this.pdfViewer.annotation.getCustomData(annotation),
            annotationSettings: { isLock: isLock }, isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
        };
        return annotationObject;
    }

    /**
     * @private
     * @returns {void}
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
        const accordionPages: any = document.querySelectorAll('.e-pv-accordion-page-container');
        if (accordionPages) {
            for (let j: number = 0; j < accordionPages.length; j++) {
                (accordionPages[parseInt(j.toString(), 10)] as any).remove();
            }
        }
        if (this.commentsRequestHandler) {
            this.commentsRequestHandler.clear();
        }
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'StickyNotesAnnotation';
    }

    /**
     * This method used to add annotations with using program.
     *
     * @param {StickyNotesSettings} annotationObject - It describes type of annotation object
     * @param {IPoint} offset - It describes about the annotation bounds or location
     * @returns {object} - object
     * @private
     */
    public updateAddAnnotationDetails(annotationObject: StickyNotesSettings, offset: IPoint): Object
    {
        //Creating new object if annotationObject is null
        if (!annotationObject)
        {
            annotationObject = { offset: { x: 1, y: 1}, pageNumber: 0} as StickyNotesSettings;
            offset = annotationObject.offset;
        }
        else if (!annotationObject.offset)
        {offset = { x: 1, y: 1}; }
        else
        {offset = annotationObject.offset; }
        //Creating the CurrentDate and Annotation name
        const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        //Creating annotation settings
        const annotationSelectorSettings: any = this.pdfViewer.stickyNotesSettings.annotationSelectorSettings;
        this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
        const annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.stickyNotesSettings);
        annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('sticky', annotationSettings.annotationSubType);
        const allowedInteractions: any = this.pdfViewer.stickyNotesSettings.allowedInteractions ?
            this.pdfViewer.stickyNotesSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
        annotationSettings.isLock = annotationObject.isLock ? annotationObject.isLock : annotationSettings.isLock;
        //Creating Annotation objects with it's proper properties
        const stickyNotesAnnotation: any = [];
        const stickyNotes : any =
        {
            AllowedInteractions: annotationObject.allowedInteractions ? annotationObject.allowedInteractions : allowedInteractions,
            AnnotName: annotationName,
            AnnotType: 'sticky',
            AnnotationFlags: null,
            AnnotationSelectorSettings: annotationObject.annotationSelectorSettings ?
                annotationObject.annotationSelectorSettings : annotationSelectorSettings,
            AnnotationSettings: annotationSettings,
            Author: annotationObject.author ? annotationObject.author : 'Guest',
            Bounds: {X: offset.x, Y: offset.y, Width: 30, Height: 30, Left: offset.x, Top: offset.y,
                Location: {X: offset.x, Y: offset.y}, Size: {Height: 30, IsEmpty: false, Width: 30}},
            Color: {IsEmpty: false, B: 51, Blue: 0.2, C: 0, G: 255},
            Comments: null,
            CreatedDate: currentDateString,
            CustomData: annotationObject.customData ? annotationObject.customData : null,
            ExistingCustomData: null,
            Icon: 'Comment',
            IsCommentLock: false,
            IsLock: annotationObject.isLock ? annotationObject.isLock : false,
            IsPrint: annotationObject.isPrint ? annotationObject.isPrint : true,
            ModifiedDate: '',
            Note: '',
            Opacity: annotationObject.opacity ? annotationObject.opacity : 1,
            Reference: null,
            Size: {IsEmpty: true, Width: 0, Height: 0},
            State: '',
            StateModel: '',
            StrokeColor: null,
            SubType: null,
            Subject: annotationObject.subject ? annotationObject.subject : 'Sticky Note',
            Type: null
        };
        //Adding the annotation object to an array and return it
        stickyNotesAnnotation[0] = stickyNotes;
        return {stickyNotesAnnotation};
    }

    /**
     * @param {any} type - It describes about the type
     * @private
     * @returns {any} - any
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
        else if (type === 'freeText' || type === 'FreeText') {
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
     * @param {any} annotation - It describes about the annotation
     * @param {any} commonDiv - It describes about the commonDiv
     * @private
     * @returns {string} - string
     */
    private getAuthorName(annotation: any, commonDiv: any): string {
        let author: string;
        if (annotation){
            const type: any = annotation.shapeAnnotationType;
            const annotationType : any = this.getAnnotationType(type);
            author = this.pdfViewer.annotationModule.updateAnnotationAuthor(annotationType, type);
        }
        else{
            author =  commonDiv.getAttribute('author');
        }
        return author;
    }
}
