import { PdfViewer } from '../index';
import { PdfViewerBase, IPageAnnotations } from '../index';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
import { splitArrayCollection, processPathData, getPathString } from '@syncfusion/ej2-drawings';

export class InkAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    // tslint:disable-next-line
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
    // tslint:disable-next-line
    public inkAnnotationindex: any = [];
    /**
     * @private
     */
    public currentPageNumber: string = '';
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
            let pageIndex: number = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            if (this.outputString && this.outputString !== '') {
                let currentAnnot: PdfAnnotationBaseModel = this.addInk(pageIndex);
                this.pdfViewer.renderDrawing(undefined, pageIndex);
                this.pdfViewer.clearSelection(pageIndex);
                this.pdfViewer.select([currentAnnot.id], currentAnnot.annotationSelectorSettings);
                if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                }
            } else {
                this.outputString = '';
                this.newObject = [];
                this.pdfViewerBase.isToolbarInkClicked = false;
                this.pdfViewer.tool = '';
            }
            this.pdfViewerBase.isInkAdded = false;
        }
    }

    /**
     * @private
     */
    public storePathData(): void {
        this.convertToPath(this.newObject);
        this.newObject = [];
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public drawInkInCanvas(position: any, pageIndex: number): void {
        // tslint:disable-next-line
        if (this.currentPageNumber !== '' && parseInt(this.currentPageNumber) !== pageIndex) {
            // tslint:disable-next-line
            this.drawInkAnnotation(parseInt(this.currentPageNumber));
            this.pdfViewerBase.isToolbarInkClicked = true;
            this.pdfViewer.tool = 'Ink';
        }
        // tslint:disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        // tslint:disable-next-line
        let context: any = canvas.getContext('2d');
        let thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
        // tslint:disable-next-line:max-line-length
        let opacity: number = this.pdfViewer.inkAnnotationSettings.opacity ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
        // tslint:disable-next-line:max-line-length
        let strokeColor: string = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
        context.beginPath();
        context.moveTo(position.prevPosition.x, position.prevPosition.y);
        context.lineTo(position.currentPosition.x, position.currentPosition.y);
        context.lineWidth = thickness;
        context.strokeStyle = strokeColor;
        context.globalAlpha = opacity;
        context.stroke();
        // context.lineWidth = 2;
        context.arc(position.prevPosition.x, position.prevPosition.y, 2 / 2, 0, Math.PI * 2, true);
        context.closePath();
        this.pdfViewerBase.prevPosition = position.currentPosition;
        this.newObject.push(position.currentPosition.x, position.currentPosition.y);
        this.currentPageNumber = pageIndex.toString();
    }
    // tslint:disable-next-line
    private convertToPath(newObject: any): void {
        this.movePath(newObject[0], newObject[1]);
        this.linePath(newObject[0], newObject[1]);
        for (let n: number = 2; n < newObject.length; n = n + 2) {
            this.linePath(newObject[n], newObject[n + 1]);
        }
    }
    private linePath(x: number, y: number): void {
        this.outputString += 'L' + x + ',' + y + ' ';
    }
    private movePath(x: number, y: number): void {
        this.outputString += 'M' + x + ',' + y + ' ';
    }
    /**
     * @private
     */
    //tslint:disable-next-line
    public addInk(pageNumber?:number): any {
        //tslint:disable-next-line
        let currentBounds: any = this.calculateInkSize();
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        // tslint:disable-next-line
        let annot: any;
        if (this.pdfViewerBase.isToolbarInkClicked) {
            let annotationName: string = this.pdfViewer.annotation.createGUID();
            let modifiedDate: string = new Date().toLocaleString();
            let pageIndex: number = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            let thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
            // tslint:disable-next-line:max-line-length
            let opacity: number = this.pdfViewer.inkAnnotationSettings.opacity ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
            // tslint:disable-next-line:max-line-length
            let strokeColor: string = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
            // tslint:disable-next-line
            let isLock: boolean = this.pdfViewer.inkAnnotationSettings.isLock ? this.pdfViewer.inkAnnotationSettings.isLock : this.pdfViewer.annotationSettings.isLock;
            let author: string = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.inkAnnotationSettings.author ? this.pdfViewer.inkAnnotationSettings.author : 'Guest';
            let customData: object = this.pdfViewer.inkAnnotationSettings.customData;
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentBounds.x, y: currentBounds.y, width: currentBounds.width, height: currentBounds.height }, pageIndex: pageIndex, data: this.outputString, customData: customData,
                shapeAnnotationType: 'Ink', opacity: opacity, strokeColor: strokeColor, thickness: thickness, annotName: annotationName, comments: [],
                author: author , subject: 'Ink', notes: '',
                review: { state: '', stateModel: '', modifiedDate: modifiedDate, author: author },
                annotationSelectorSettings: this.getSelector('Ink', ''), modifiedDate: modifiedDate, annotationSettings: { isLock: isLock }
            };
            let annotation: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
            // tslint:disable-next-line
            let bounds: any = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
            // tslint:disable-next-line
            let settings: any = {
                opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness, modifiedDate: annot.modifiedDate,
                width: annot.bounds.width, height: annot.bounds.height, data: this.outputString
            };
            this.pdfViewerBase.inkCount++;
            //tslint:disable-next-line:max-line-length
            let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('ink', (annot.pageIndex + 1), annot.shapeAnnotationType);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
            annot.annotName = annotationName;
            this.pdfViewer.annotationModule.storeAnnotations(pageIndex, annot, '_annotations_ink');
            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'Ink', bounds, settings);
           //tslint:disable-next-line:max-line-length
            this.pdfViewer.annotation.addAction(pageIndex, null, annotation, 'Addition', '', annotation, annotation);
            if (this.pdfViewerBase.isInkAdded) {
                this.outputString = '';
                this.newObject = [];
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
        this.pdfViewerBase.isToolbarInkClicked = true;
        this.drawInk();
    }
    public saveInkSignature(): string {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        // tslint:disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                // tslint:disable-next-line
                let newArray: any[] = [];
                let pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // tslint:disable-next-line:max-line-length
                        let strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.pdfViewerBase.signatureModule.getRgbCode(strokeColorString));
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(pageAnnotationObject.annotations[z].bounds);
                        // tslint:disable-next-line
                        let collectionData: any = processPathData(pageAnnotationObject.annotations[z].data);
                        // tslint:disable-next-line
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
     * @private
     */
    //tslint:disable-next-line
    public addInCollection(pageNumber: number, annotationBase: any): void {
        if (annotationBase) {
            //tslint:disable-next-line
            let pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
    }
    //tslint:disable-next-line
    private calculateInkSize(): any {
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        //tslint:disable-next-line
        let collectionData: any = processPathData(this.outputString);
        let zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        // tslint:disable-next-line
        for (let k = 0; k < collectionData.length; k++) {
            //tslint:disable-next-line
            let val: any = collectionData[k];
            if (minimumX === -1) {
                // tslint:disable-next-line
                minimumX = (val['x']);
                // tslint:disable-next-line
                maximumX = (val['x']);
                // tslint:disable-next-line
                minimumY = (val['y']);
                // tslint:disable-next-line
                maximumY = (val['y']);
            } else {
                // tslint:disable-next-line
                let point1: any = (val['x']);
                // tslint:disable-next-line
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
        let newdifferenceX: number = maximumX - minimumX;
        let newdifferenceY: number = maximumY - minimumY;
        // tslint:disable-next-line:max-line-length
        return { x: (minimumX / zoomvalue), y: (minimumY / zoomvalue), width: (newdifferenceX / zoomvalue), height: (newdifferenceY / zoomvalue) };
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderExistingInkSignature(annotationCollection: any, pageIndex: number, isImport: boolean): void {
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
        if (annotationCollection && !isinkAnnotationAdded) {
            if (annotationCollection.length > 0 && this.inkAnnotationindex.indexOf(pageIndex) === -1) {
                this.inkAnnotationindex.push(pageIndex);
            }
            for (let n: number = 0; n < annotationCollection.length; n++) {
                // tslint:disable-next-line
                let currentAnnotation: any = annotationCollection[n];
                //tslint:disable-next-line
                if (currentAnnotation) {
                    // tslint:disable-next-line
                    let bounds: any = currentAnnotation.Bounds;
                    let currentLeft: number = (bounds.X);
                    let currentTop: number = (bounds.Y);
                    let currentWidth: number = (bounds.Width);
                    let currentHeight: number = (bounds.Height);
                    // tslint:disable-next-line
                    let data: any = currentAnnotation.PathData;
                    if (isImport) {
                        if (currentAnnotation.IsPathData || currentAnnotation.PathData.split('command').length <= 1) {
                            data = currentAnnotation.PathData;
                        } else {
                            data = getPathString(JSON.parse(currentAnnotation.PathData));
                        }
                    }
                    let isLock: boolean = currentAnnotation.AnnotationSettings ? currentAnnotation.AnnotationSettings.isLock : false;
                    // tslint:disable-next-line
                    let selectorSettings: any = currentAnnotation.AnnotationSelectorSettings ? currentAnnotation.AnnotationSelectorSettings : this.getSelector(currentAnnotation, 'Ink');
                    let customData: object = currentAnnotation.customData ? currentAnnotation.customData : this.pdfViewer.inkAnnotationSettings.customData;
                    // tslint:disable-next-line:max-line-length
                    currentAnnotation.allowedInteractions = currentAnnotation.AllowedInteractions ? currentAnnotation.AllowedInteractions :  this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(currentAnnotation);
                    annot = {
                        // tslint:disable-next-line:max-line-length
                        id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                        shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotName: currentAnnotation.AnnotName,
                        // tslint:disable-next-line:max-line-length
                        comments: this.pdfViewer.annotationModule.getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author), author: currentAnnotation.Author, allowedInteractions: currentAnnotation.allowedInteractions, subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                        // tslint:disable-next-line:max-line-length
                        review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note, annotationSettings: { isLock: isLock },
                        annotationSelectorSettings: selectorSettings, customData: customData
                    };
                    this.pdfViewer.add(annot as PdfAnnotationBase);
                    // tslint:disable-next-line
                    let canvass: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
                    // tslint:disable-next-line
                    this.pdfViewer.renderDrawing(canvass as any, annot.pageIndex);
                    this.pdfViewer.annotationModule.storeAnnotations(annot.pageIndex, annot, '_annotations_ink');
                    this.pdfViewerBase.currentSignatureAnnot = null;
                    this.pdfViewerBase.signatureCount++;
                    this.pdfViewerBase.inkCount++;
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public storeInkSignatureData(pageNumber: number, annotations: any): void {
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations as PdfAnnotationBase, 'Addition', '', annotations as PdfAnnotationBase, annotations);
        // tslint:disable-next-line
        let annotation: any = null;
        let left: number = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        let top: number = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            // tslint:disable-next-line:max-line-length
            id: annotations.id, bounds: { x: left, y: top, width: annotations.bounds.width, height: annotations.bounds.height },
            // tslint:disable-next-line:max-line-length
            shapeAnnotationType: 'Ink', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data,
            annotName: annotations.annotName,
            // tslint:disable-next-line:max-line-length
            comments: annotations.comments, author: annotations.author, subject: annotations.subject, modifiedDate: annotations.modifiedDate,
            // tslint:disable-next-line:max-line-length
            review: { state: '', stateModel: '', modifiedDate: annotations.modifiedDate, author: annotations.author }, notes: annotations.notes,
            annotationSelectorSettings: this.getSelector(annotations, 'Ink')
        };
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        let index: number = 0;
        if (!storeObject) {
            let shapeAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            let annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(shapeAnnotation);
            let annotationStringified: string = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        } else {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_ink');
            let pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                (annotObject[pageIndex] as IPageAnnotations).annotations.push(annotation);
                index = (annotObject[pageIndex] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                let markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            let annotationStringified: string = JSON.stringify(annotObject);
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
    // tslint:disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
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
    /**
     * @private
     */
    // tslint:disable-next-line
    public modifySignatureInkCollection(property: string, pageNumber: number, annotationBase: any): any {
        this.pdfViewer.isDocumentEdited = true;
        // tslint:disable-next-line
        let currentAnnotObject: any = null;
        // tslint:disable-next-line
        let pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].bounds = { x: annotationBase.wrapper.bounds.left, y: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width, height: annotationBase.bounds.height };
                    } else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                        let date: Date = new Date();
                    } else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                        let date: Date = new Date();
                    } else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                        let date: Date = new Date();
                    } else if (property === 'notes') {
                        pageAnnotations[i].notes = annotationBase.notes;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                }
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }
    // tslint:disable-next-line
    private manageInkAnnotations(pageAnnotations: any[], pageNumber: number): void {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_ink');
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public updateInkCollections(currentAnnotation: any, pageIndex: number, isImport?: boolean): any {
        //tslint:disable-next-line
        let annot: any;
        //tslint:disable-next-line
        if (currentAnnotation) {
            // tslint:disable-next-line
            let bounds: any = currentAnnotation.Bounds;
            let currentLeft: number = (bounds.X);
            let currentTop: number = (bounds.Y);
            let currentWidth: number = (bounds.Width);
            let currentHeight: number = (bounds.Height);
            let customData: object = currentAnnotation.customData;
            // tslint:disable-next-line
            let allowedInteractions: any = currentAnnotation.AllowedInteractions ? currentAnnotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(currentAnnotation);
            // tslint:disable-next-line
            let data: any = currentAnnotation.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(currentAnnotation.PathData));
            }
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'ink' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotationId: currentAnnotation.AnnotName,
                // tslint:disable-next-line:max-line-length
                customData: customData, comments: this.pdfViewer.annotationModule.getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author), author: currentAnnotation.Author, allowedInteractions: allowedInteractions, subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note,

            };
            return annot;
        }
    }
}