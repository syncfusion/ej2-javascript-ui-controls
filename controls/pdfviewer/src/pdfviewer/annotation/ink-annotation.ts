/* eslint-disable */
import { InkAnnotationSettings } from './../pdfviewer';
import { IPoint, PdfViewer } from '../index';
import { PdfViewerBase, IPageAnnotations } from '../index';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
import { splitArrayCollection, processPathData, getPathString } from '@syncfusion/ej2-drawings';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

export class InkAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    // eslint-disable-next-line
    public newObject: any = [];
    /**
     * @private
     */
    public outputString: string = '';
    /**
     * @private
     */
    public mouseX: number;
    /**
     * @private
     */
    public mouseY: number;
    /**
     * @private
     */
    // eslint-disable-next-line
    public inkAnnotationindex: any = [];
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;
    /**
     * @private
     */
    public currentPageNumber: string = '';
    /**
     * @private
     */
    public inkAnnotationInitialZoom: number = 1;
    /**
     * @private
     */
    public inkPathDataCollection: IInkPathDataCollection[] = [];
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    public drawInk(): void {
        this.pdfViewerBase.disableTextSelectionMode();
        this.pdfViewer.tool = 'Ink';
    }

    public drawInkAnnotation(pageNumber?: number): void {
        if (this.pdfViewerBase.isToolbarInkClicked) {
            this.pdfViewerBase.isInkAdded = true;
            this.pdfViewer.annotationModule.isFormFieldShape = false;
            const pageIndex: number = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            if ((this.outputString && this.outputString !== '') || this.inkPathDataCollection.length > 0) {
                const currentAnnot: PdfAnnotationBaseModel = this.addInk(pageIndex);
                this.pdfViewer.renderDrawing(undefined, pageIndex);
                this.pdfViewer.clearSelection(pageIndex);
                this.pdfViewer.select([currentAnnot.id], currentAnnot.annotationSelectorSettings);
                if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                }
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.createPropertyTools("Ink");
                }
            } else {
                this.outputString = '';
                this.newObject = [];
                this.pdfViewerBase.isToolbarInkClicked = false;
                this.pdfViewer.tool = '';
                this.inkPathDataCollection = [];
            }
            this.pdfViewerBase.isInkAdded = false;
        }
    }

    /**
     * @private
     */
    public updateInkDataWithZoom(): any {
        let updatedPathData: string = '';
        if (this.outputString !== '') {
            this.inkPathDataCollection.push({ pathData: this.outputString, zoomFactor: this.inkAnnotationInitialZoom });
        }
        if (this.inkPathDataCollection.length > 0) {
            //for loop to get the path data from the collection with path zoom factor
            for (let i: number = 0; i < this.inkPathDataCollection.length; i++) {
                updatedPathData += this.updatePathDataWithZoom(this.inkPathDataCollection[i].pathData, this.inkPathDataCollection[i].zoomFactor);
            }
        } else {
            updatedPathData += this.updatePathDataWithZoom(this.outputString, this.inkAnnotationInitialZoom);
        }
        return updatedPathData;
    }
    private updatePathDataWithZoom(pathData: any, pathZoomFactor: number): any {
        let pathString: string = '';
        let zoom: any = this.pdfViewerBase.getZoomFactor();
        let collectionData: any = processPathData(pathData);
        let csData: any = splitArrayCollection(collectionData);
        for (let j: number = 0; j < csData.length; j++) {
            let pathValue: any = csData[j];
            pathString += pathValue.command + pathValue.x * (zoom / pathZoomFactor) + ',' + pathValue.y * (zoom / pathZoomFactor) + ' ';
        }
        return pathString;
    }
    /**
     * @private
     */
    public storePathData(): void {
        this.convertToPath(this.newObject);
        this.newObject = [];
    }
    /**
     * @param position
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public drawInkInCanvas(position: any, pageIndex: number): void {
        // eslint-disable-next-line
        if (this.currentPageNumber !== '' && parseInt(this.currentPageNumber) !== pageIndex) {
            // eslint-disable-next-line
            this.drawInkAnnotation(parseInt(this.currentPageNumber));
            this.pdfViewerBase.isToolbarInkClicked = true;
            this.pdfViewer.tool = 'Ink';
        }
        let zoom : any = this.pdfViewerBase.getZoomFactor();
        this.inkAnnotationInitialZoom = zoom;
        let ratio : number = this.pdfViewerBase.getWindowDevicePixelRatio();;
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        // eslint-disable-next-line
        let context: any = canvas.getContext('2d');
        const thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
        // eslint-disable-next-line max-len
        const opacity: number = this.pdfViewer.inkAnnotationSettings.opacity ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
        // eslint-disable-next-line max-len
        const strokeColor: string = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
        if (!Browser.isDevice || (Browser.isDevice && zoom <= 0.7)) {
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        context.beginPath();
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.moveTo(position.prevPosition.x, position.prevPosition.y);
        context.lineTo(position.currentPosition.x, position.currentPosition.y);
        context.lineWidth = thickness * zoom > 1 ? thickness * zoom : thickness;
        context.strokeStyle = strokeColor;
        context.globalAlpha = opacity;
        // After the addition of a TextMarkup annotation, a LineDash value was introduced. To eliminate it, the value was cleared.
        context.setLineDash([]); 
        context.stroke();
        // context.lineWidth = 2;
        context.arc(position.prevPosition.x, position.prevPosition.y, 2 / 2, 0, Math.PI * 2, true);
        context.closePath();
        this.pdfViewerBase.prevPosition = position.currentPosition;
        this.newObject.push(position.currentPosition.x, position.currentPosition.y);
        this.currentPageNumber = pageIndex.toString();
    }
    // eslint-disable-next-line
    private convertToPath(newObject: any): void {
        this.movePath(newObject[0], newObject[1]);
        this.linePath(newObject[0], newObject[1]);
        for (let n: number = 2; n < newObject.length; n = n + 2) {
            this.linePath(newObject[n], newObject[n + 1]);
        }
    }
    private linePath(x: number, y: number): void {
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            this.outputString += 'L' + x + ',' + y + ' ';
        }
    }
    private movePath(x: number, y: number): void {
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            this.outputString += 'M' + x + ',' + y + ' ';
        }
    }
    /**
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public addInk(pageNumber?:number): any {
        this.outputString = this.updateInkDataWithZoom();
        // eslint-disable-next-line
        let currentBounds: any = this.calculateInkSize();
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        // eslint-disable-next-line
        let annot: any;
        if (this.pdfViewerBase.isToolbarInkClicked) {
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            const pageIndex: number = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            const thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
            // eslint-disable-next-line max-len
            const opacity: number = this.pdfViewer.inkAnnotationSettings.opacity ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
            // eslint-disable-next-line max-len
            const strokeColor: string = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
            // eslint-disable-next-line
            let isLock: boolean = this.pdfViewer.inkAnnotationSettings.isLock ? this.pdfViewer.inkAnnotationSettings.isLock : this.pdfViewer.annotationSettings.isLock;
            const author: string = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.inkAnnotationSettings.author ? this.pdfViewer.inkAnnotationSettings.author : 'Guest';
            const subject: string = (this.pdfViewer.annotationSettings.subject !== "") ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.inkAnnotationSettings.subject ? this.pdfViewer.inkAnnotationSettings.subject : 'Ink';
            const customData: object = this.pdfViewer.inkAnnotationSettings.customData;
            const isPrint: boolean = this.pdfViewer.inkAnnotationSettings.isPrint;
            // eslint-disable-next-line
            let allowedInteractions: any = this.pdfViewer.inkAnnotationSettings.allowedInteractions ? this.pdfViewer.inkAnnotationSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            // eslint-disable-next-line
            let annotationSettings = this.pdfViewer.annotationSettings ? this.pdfViewer.annotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(this.pdfViewer.inkAnnotationSettings);
            annot = {
                // eslint-disable-next-line max-len
                id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentBounds.x, y: currentBounds.y, width: currentBounds.width, height: currentBounds.height }, pageIndex: pageIndex, data: this.outputString, customData: customData,
                shapeAnnotationType: 'Ink', opacity: opacity, strokeColor: strokeColor, thickness: thickness, annotName: annotationName, comments: [],
                author: author , subject: subject, notes: '',
                review: { state: '', stateModel: '', modifiedDate: modifiedDate, author: author },
                annotationSelectorSettings: this.getSelector('Ink', ''), modifiedDate: modifiedDate, annotationSettings: annotationSettings,
                isPrint: isPrint, allowedInteractions: allowedInteractions, isCommentLock: false, isLocked: isLock
            };
            const annotation: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
            // eslint-disable-next-line
            let bounds: any = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
            // eslint-disable-next-line
            let settings: any = {
                opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness, modifiedDate: annot.modifiedDate,
                width: annot.bounds.width, height: annot.bounds.height, data: this.outputString
            };
            this.pdfViewerBase.inkCount++;
            // eslint-disable-next-line max-len
            const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('ink', (annot.pageIndex + 1), annot.shapeAnnotationType);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
            annot.annotName = annotationName;
            // eslint-disable-next-line max-len
            this.pdfViewer.annotation.addAction(pageIndex, null, annotation, 'Addition', '', annotation, annotation);
            this.pdfViewer.annotationModule.storeAnnotations(pageIndex, annot, '_annotations_ink');
            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'Ink', bounds, settings);
            if (this.pdfViewerBase.isInkAdded) {
                this.outputString = '';
                this.newObject = [];
                this.inkPathDataCollection = [];
            }
            this.pdfViewerBase.isToolbarInkClicked = false;
            this.pdfViewer.tool = '';
        }
        return annot;
    }
    /**
     * @private
     */
    public setAnnotationMode(): void {
        if (this.pdfViewerBase.isToolbarInkClicked) {
            this.drawInkAnnotation();
        } else {
            this.pdfViewerBase.isToolbarInkClicked = true;
            this.drawInk();
        }
    }
    public saveInkSignature(): string {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_ink'];
        }
        // eslint-disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                // eslint-disable-next-line
                let newArray: any[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // eslint-disable-next-line max-len
                        const strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.pdfViewerBase.signatureModule.getRgbCode(strokeColorString));
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getInkBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        // eslint-disable-next-line
                        let collectionData: any = processPathData(pageAnnotationObject.annotations[z].data);
                        // eslint-disable-next-line
                        let csData: any = splitArrayCollection(collectionData);
                        pageAnnotationObject.annotations[z].data = JSON.stringify(csData);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }
    /**
     * @param pageNumber
     * @param annotationBase
     * @param pageNumber
     * @param annotationBase
     * @private
     */
    // eslint-disable-next-line
    public addInCollection(pageNumber: number, annotationBase: any): void {
        if (annotationBase) {
            // eslint-disable-next-line
            let pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
    }
    // eslint-disable-next-line
    private calculateInkSize(): any {
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        // eslint-disable-next-line
        let collectionData: any = processPathData(this.outputString);
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        // eslint-disable-next-line
        for (let k = 0; k < collectionData.length; k++) {
            // eslint-disable-next-line
            let val: any = collectionData[k];
            if (minimumX === -1) {
                // eslint-disable-next-line
                minimumX = (val['x']);
                // eslint-disable-next-line
                maximumX = (val['x']);
                // eslint-disable-next-line
                minimumY = (val['y']);
                // eslint-disable-next-line
                maximumY = (val['y']);
            } else {
                // eslint-disable-next-line
                let point1: any = (val['x']);
                // eslint-disable-next-line
                let point2: any = (val['y']);
                if (minimumX >= point1) {
                    minimumX = point1;
                }
                if (minimumY >= point2) {
                    minimumY = point2;
                }
                if (maximumX <= point1) {
                    maximumX = point1;
                }
                if (maximumY <= point2) {
                    maximumY = point2;
                }
            }
        }
        const newdifferenceX: number = maximumX - minimumX;
        const newdifferenceY: number = maximumY - minimumY;
        // eslint-disable-next-line max-len
        return { x: (minimumX / zoomvalue), y: (minimumY / zoomvalue), width: (newdifferenceX / zoomvalue), height: (newdifferenceY / zoomvalue) };
    }
    /**
     * @param annotationCollection
     * @param pageIndex
     * @param isImport
     * @private
     */
    // eslint-disable-next-line
    public renderExistingInkSignature(annotationCollection: any, pageIndex: number, isImport: boolean,  isAnnotOrderAction?: boolean): void {
        let annot: PdfAnnotationBaseModel;
        let isinkAnnotationAdded: boolean = false;
        if (!isImport) {
            for (let p: number = 0; p < this.inkAnnotationindex.length; p++) {
                if (this.inkAnnotationindex[p] === pageIndex) {
                    isinkAnnotationAdded = true;
                    break;
                }
            }
        }
        if (annotationCollection && (!isinkAnnotationAdded || isAnnotOrderAction)) {
            if (annotationCollection.length > 0 && this.inkAnnotationindex.indexOf(pageIndex) === -1) {
                this.inkAnnotationindex.push(pageIndex);
            }
            for (let n: number = 0; n < annotationCollection.length; n++) {
                // eslint-disable-next-line
                let currentAnnotation: any = annotationCollection[n];
                if (currentAnnotation) {
                    // eslint-disable-next-line
                    let data: any = currentAnnotation.PathData;
                    if (isImport && data) {
                        if (typeof(data) === 'object' &&  data.length > 1) {
                            data = getPathString(data);
                        } else {
                            if (currentAnnotation.IsPathData || (data.split('command').length <= 1)) {
                                data = data;
                            } else {
                                data = getPathString(JSON.parse(data));
                            }
                        }
                    }
                    this.outputString = data;
                    // eslint-disable-next-line
                    let calculateInkPosition: any = this.calculateInkSize();
                    this.outputString = '';
                    let rectDiff: number = 0;
                    let rectDifference: number = 1;
                    // eslint-disable-next-line
                    let bounds: any = currentAnnotation.Bounds;
                    if (calculateInkPosition) {
                        if (calculateInkPosition.height < 1) {
                            rectDiff = bounds.Height ? bounds.Height : bounds.height;
                            rectDifference = bounds.Height ? bounds.Height : bounds.height;
                        } else if (calculateInkPosition.width < 1) {
                            rectDiff = bounds.Width ? bounds.Width : bounds.width;
                            rectDifference = bounds.Width ? bounds.Width : bounds.width;
                        }
                    }
                    const currentLeft: number = !isNullOrUndefined(bounds.X) ? bounds.X + (rectDiff / 2) : bounds.x + (rectDiff / 2);
                    const currentTop: number = !isNullOrUndefined(bounds.Y) ? bounds.Y + (rectDiff / 2) : bounds.y + (rectDiff / 2);
                    const currentWidth: number = bounds.Width ? bounds.Width - (rectDifference - 1) : bounds.width - (rectDifference - 1);
                    const currentHeight: number = bounds.Height ? bounds.Height - (rectDifference - 1) : bounds.height - (rectDifference - 1);
                    let isLock: boolean = currentAnnotation.AnnotationSettings ? currentAnnotation.AnnotationSettings.isLock : false;
                    // eslint-disable-next-line
                    let selectorSettings: any = currentAnnotation.AnnotationSelectorSettings ? currentAnnotation.AnnotationSelectorSettings : this.getSelector(currentAnnotation, 'Ink');
                    const customData: any = this.pdfViewer.annotation.getCustomData(currentAnnotation);
                    let isPrint: boolean = true;
                    if (currentAnnotation.AnnotationSettings) {
                        isPrint = currentAnnotation.AnnotationSettings.isPrint;
                    } else {
                        isPrint = this.pdfViewer.inkAnnotationSettings.isPrint;
                    }
                    if (currentAnnotation.IsLocked) {
                        isLock = currentAnnotation.IsLocked;
                    }
                    if (currentAnnotation.Subject === 'Highlight' && currentAnnotation.Opacity === 1) {
                        currentAnnotation.Opacity = currentAnnotation.Opacity / 2;
                    }
                    // eslint-disable-next-line max-len
                    currentAnnotation.allowedInteractions = currentAnnotation.AllowedInteractions ? currentAnnotation.AllowedInteractions :  this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(currentAnnotation);
                    currentAnnotation.AnnotationSettings = currentAnnotation.AnnotationSettings ? currentAnnotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(currentAnnotation);
                    annot = {
                        // eslint-disable-next-line max-len
                        id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                        shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotName: currentAnnotation.AnnotName,
                        // eslint-disable-next-line max-len
                        comments: this.pdfViewer.annotationModule.getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author), author: currentAnnotation.Author, allowedInteractions: currentAnnotation.allowedInteractions, subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                        // eslint-disable-next-line max-len
                        review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note, annotationSettings: currentAnnotation.AnnotationSettings,
                        annotationSelectorSettings: selectorSettings, customData: customData, isPrint: isPrint, isCommentLock: currentAnnotation.IsCommentLock
                    };
                    this.pdfViewer.add(annot as PdfAnnotationBase);
                    // eslint-disable-next-line
                    let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
                    // eslint-disable-next-line
                    this.pdfViewer.renderDrawing(canvass as any, annot.pageIndex);
                    this.pdfViewer.annotationModule.storeAnnotations(annot.pageIndex, annot, '_annotations_ink');
                    if(this.isAddAnnotationProgramatically)
                    {
                        let settings: any = {
                            opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness, modifiedDate: annot.modifiedDate,
                            width: annot.bounds.width, height: annot.bounds.height, data: this.outputString
                        };
                        this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'Ink', bounds, settings);
                    }
                    this.pdfViewerBase.currentSignatureAnnot = null;
                    this.pdfViewerBase.signatureCount++;
                    this.pdfViewerBase.inkCount++;
                    // eslint-disable-next-line max-len
                    if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable) {
                        // eslint-disable-next-line max-len
                        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                        // eslint-disable-next-line max-len
                        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], true);
                    }
                }
            }
        }
    }
    // To save the imported annotations while downloading or exporting for the page above 10 without a scroll (EJ2-63924)
    /**
     * @private
     */
    public saveImportedInkAnnotation(annotation: any, pageNumber: number): any {
        let annotationObject: any = null;
        let currentBounds: any = annotation.Bounds;
        let bounds: any = { x: currentBounds.X, y: currentBounds.Y, width: currentBounds.Width, height: currentBounds.Height }
        let allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        let customData: any = this.pdfViewer.annotation.getCustomData(annotation);
        let comments: any = this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author);
        let review: any = { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author };
        let annotationSettings: any = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        let annotationSelectorSettings: any = this.getSettings(annotation);
        let data: any = annotation.PathData;
        if (typeof (data) === 'object' && data.length > 1) {
            data = getPathString(data);
        }
        else {
            if (annotation.IsPathData || (data.split('command').length <= 1)) {
                data = data;
            }
            else {
                data = getPathString(JSON.parse(data));
            }
        }
        annotationObject = {
            allowedInteractions: allowedInteractions, annotName: annotation.AnnotName, annotationSelectorSettings: annotationSelectorSettings,
            annotationSettings: annotationSettings, author: annotation.Author, bounds: bounds, customData: customData, comments: comments, data: data, 
            id: "Ink" , isCommentLock: annotation.IsCommentLock, isLocked: annotation.IsLocked, isPrint: annotation.IsPrint, modifiedDate: annotation.ModifiedDate,
            note: annotation.Note, opacity: annotation.Opacity, pageIndex: pageNumber, review: review, shapeAnnotationType: annotation.AnnotationType, 
            strokeColor: annotation.StrokeColor, subject: annotation.Subject, thickness: annotation.Thickness
        }
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_ink');
    }
    // To get the annotation selector settings 
    private getSettings(annotation: any): any{
        let selector: any = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        }
        else {
            selector = this.getSelector(annotation.ShapeAnnotationType, annotation.Subject);
        }
        return selector;
    }
    /**
     * @param pageNumber
     * @param annotations
     * @private
     */
    // eslint-disable-next-line
    public storeInkSignatureData(pageNumber: number, annotations: any): void {
        // eslint-disable-next-line max-len
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations as PdfAnnotationBase, 'Addition', '', annotations as PdfAnnotationBase, annotations);
        // eslint-disable-next-line
        let annotation: any = null;
        let left: number = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        let top: number = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            // eslint-disable-next-line max-len
            id: annotations.id, bounds: { x: left, y: top, width: annotations.bounds.width, height: annotations.bounds.height },
            // eslint-disable-next-line max-len
            shapeAnnotationType: 'Ink', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data,
            annotName: annotations.annotName,
            // eslint-disable-next-line max-len
            comments: annotations.comments, author: annotations.author, subject: annotations.subject, modifiedDate: annotations.modifiedDate,
            // eslint-disable-next-line max-len
            review: { state: '', stateModel: '', modifiedDate: annotations.modifiedDate, author: annotations.author }, notes: annotations.notes,
            annotationSelectorSettings: this.getSelector(annotations, 'Ink'), isCommentLock: annotations.isCommentLock
        };
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        let index: number = 0;
        if (!storeObject) {
            const shapeAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            const annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(shapeAnnotation);
            const annotationStringified: string = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        } else {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_ink');
            const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                (annotObject[pageIndex] as IPageAnnotations).annotations.push(annotation);
                index = (annotObject[pageIndex] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                const markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        }
    }
    public getSelector(type: string, subject: string): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings;
        }
        return selector;
    }
    // eslint-disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // eslint-disable-next-line
        let annotationCollection: any[];
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
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
    /**
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @private
     */
    // eslint-disable-next-line
    public modifySignatureInkCollection(property: string, pageNumber: number, annotationBase: any): any {
        if (!isNullOrUndefined(annotationBase.formFieldAnnotationType) && annotationBase.formFieldAnnotationType !== ""){
            this.pdfViewer.annotationModule.isFormFieldShape = true;
        }
        else{
        this.pdfViewer.annotationModule.isFormFieldShape = false;
        }
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        // eslint-disable-next-line
        let currentAnnotObject: any = null;
        // eslint-disable-next-line
        let pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // eslint-disable-next-line max-len
                        pageAnnotations[i].bounds = { x: annotationBase.wrapper.bounds.left, y: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width, height: annotationBase.bounds.height };
                    } else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                    } else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    } else if (property === 'notes') {
                        pageAnnotations[i].notes = annotationBase.notes;
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                }
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }
    // eslint-disable-next-line
    private manageInkAnnotations(pageAnnotations: any[], pageNumber: number): void {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_ink');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        }
    }

    /**
     * @param currentAnnotation
     * @param pageIndex
     * @param isImport
     * @param currentAnnotation
     * @param pageIndex
     * @param isImport
     * @private
     */
    // eslint-disable-next-line
    public updateInkCollections(currentAnnotation: any, pageIndex: number, isImport?: boolean): any {
        // eslint-disable-next-line
        let annot: any;
        // eslint-disable-next-line
        if (currentAnnotation) {
            // eslint-disable-next-line
            let bounds: any = currentAnnotation.Bounds;
            const currentLeft: number = (bounds.X);
            const currentTop: number = (bounds.Y);
            const currentWidth: number = (bounds.Width);
            const currentHeight: number = (bounds.Height);
            const customData: object = currentAnnotation.customData;
            const isPrint: boolean = currentAnnotation.isPrint;
            // eslint-disable-next-line
            currentAnnotation.AllowedInteractions = currentAnnotation.AllowedInteractions ? currentAnnotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(currentAnnotation);
            // eslint-disable-next-line
            currentAnnotation.AnnotationSettings = currentAnnotation.AnnotationSettings ? currentAnnotation.AnnotationSettings : this.pdfViewer.inkAnnotationSettings ? this.pdfViewer.inkAnnotationSettings : this.pdfViewer.annotationSettings;
            if (currentAnnotation.IsLocked) {
                currentAnnotation.AnnotationSettings.isLock = currentAnnotation.IsLocked;
            }
            // eslint-disable-next-line
            let data: any = currentAnnotation.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(currentAnnotation.PathData));
            }
            annot = {
                // eslint-disable-next-line max-len
                id: 'ink' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                // eslint-disable-next-line max-len
                shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotationId: currentAnnotation.AnnotName,
                // eslint-disable-next-line max-len
                customData: customData, comments: this.pdfViewer.annotationModule.getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author), author: currentAnnotation.Author, allowedInteractions: currentAnnotation.AllowedInteractions, subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note, isPrint: isPrint, isCommentLock: currentAnnotation.IsCommentLock, annotationSettings: currentAnnotation.AnnotationSettings, isLocked: currentAnnotation.AnnotationSettings.isLock

            };
            return annot;
        }
    }
    /**
     * This method used to add annotations with using program.
     *
     * @param annotationObject - It describes type of annotation object
     * @param offset - It describes about the annotation bounds or location
     * @param pageNumber - It describes about the annotation page number
     * @returns Object
     * @private
     */
    public updateAddAnnotationDetails(annotationObject: InkAnnotationSettings, offset: IPoint, pageNumber: number): Object 
    {
        //Creating new object if annotationObject is null
        if(!annotationObject)
        {
         annotationObject = { offset: { x: 10, y: 10},pageNumber: 0, width: undefined, height: undefined} as InkAnnotationSettings;
         offset = annotationObject.offset;
        }
        else if(!annotationObject.offset)
         offset = { x: 10, y: 10};
        else
         offset = annotationObject.offset;

        //Creating the CurrentDate and Annotation name
        let currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        let annotationName: string = this.pdfViewer.annotation.createGUID();
        
        //Creating annotation settings
        let annotationSelectorSettings: any = this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
        let annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.inkAnnotationSettings);
        annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('ink', annotationSettings.AnnotationType);
        let allowedInteractions: any = this.pdfViewer.inkAnnotationSettings.allowedInteractions ? this.pdfViewer.inkAnnotationSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
        annotationSettings.isLock = annotationObject.isLock ? annotationObject.isLock : annotationSettings.isLock;
        annotationObject.width = annotationObject.width ? annotationObject.width : 150;
        annotationObject.height = annotationObject.height ? annotationObject.height : 60;        
        let pathData: string = annotationObject.path?annotationObject.path:'';
        if (!isNullOrUndefined(pathData)) {
            // Check whether the given path of the ink annotation is starts with Move path or Line path. 
            if (pathData[0] === 'M' || pathData[0] === 'L') {
                let collectionData: any = processPathData(pathData);
                let csData: any = splitArrayCollection(collectionData);
                pathData = JSON.stringify(csData);
            }
            else {
                pathData = getPathString(JSON.parse(pathData));
            }
        }
        annotationObject.path = pathData;
        //Creating Annotation objects with it's proper properties
        let signatureInkAnnotation: any = [];
        let ink: any = 
        {
             AllowedInteractions: annotationObject.allowedInteractions?annotationObject.allowedInteractions:allowedInteractions,
             AnnotName: annotationName,
             AnnotType: 'ink',
             AnnotationFlags: null,
             AnnotationSelectorSettings: annotationObject.annotationSelectorSettings?annotationObject.annotationSelectorSettings: annotationSelectorSettings,       
             AnnotationSettings: annotationSettings,
             AnnotationType: 'Ink',
             Author: annotationObject.author ? annotationObject.author : 'Guest',
             Bounds: {X: offset.x, Y: offset.y, Width: annotationObject.width, Height: annotationObject.height, Left: offset.x, Top: offset.y, Location:{X: offset.x, Y: offset.y}, Size:{Height: annotationObject.height,IsEmpty: false, Width: annotationObject.width}},
             Comments: null,
             CreatedDate: currentDateString,
             CustomData: annotationObject.customData?annotationObject.customData:null,
             ExistingCustomData: null,
             IsCommentLock: false,
             IsLock: annotationObject.isLock?annotationObject.isLock:false,
             IsPrint: annotationObject.isPrint?annotationObject.isPrint:true,
             ModifiedDate: '',
             Note: '',
             Opacity: annotationObject.opacity?annotationObject.opacity:1,
             PathData: annotationObject.path,
             PageNumber: pageNumber,
             State: '',
             StateModel: '',
             StrokeColor: annotationObject.strokeColor?annotationObject.strokeColor:'rgba(255,0,0,1)',
             SubType: null,
             Subject: annotationObject.subject ? annotationObject.subject : 'Ink',
             Type: null,
             Thickness: annotationObject.thickness?annotationObject.thickness:1
         }      

         //Adding the annotation object to an array and return it
         signatureInkAnnotation[0] = ink;
         return {signatureInkAnnotation};  
    }
}
/**
 * Defines the FormFields Bound properties
 *
 * @hidden
 */
export interface IInkPathDataCollection {
    pathData:any;
    zoomFactor:number;
    }
