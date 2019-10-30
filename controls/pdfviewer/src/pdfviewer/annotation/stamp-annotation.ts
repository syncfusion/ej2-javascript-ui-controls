import { PdfAnnotationBase } from '../../diagram/pdf-annotation';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { PdfViewer, PdfViewerBase, IPageAnnotations, ICommentsCollection, IReviewCollection } from '../../index';
import { splitArrayCollection, processPathData } from '@syncfusion/ej2-drawings';


/**
 * @hidden
 */
export interface IStampAnnotation {
    stampAnnotationPath: string;
    author: string;
    creationDate: string;
    modifiedDate: string;
    subject: string;
    note: string;
    strokeColor: string;
    fillColor: string;
    opacity: number;
    bounds: IRectangles;
    icon: string;
    pageNumber: number;
    rotateAngle: string;
    randomId: string;
    stampAnnotationType: string;
    stampFillcolor: string;
    isDynamicStamp: boolean;
    dynamicText?: string;
    shapeAnnotationType: string;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotName: string;
    position?: string;
}
interface IRectangles {
    height: number;
    left: number;
    top: number;
    width: number;
}
/**
 * @hidden
 */
interface IstampCollection {
    iconName: string;
    pathdata: string;
    opacity: number;
    strokeColor: string;
    fillColor: string;
    width: number;
    height: number;
    stampFillColor: string;
    stampStrokeColor: string;
    modifiedDate?: string;
}
/**
 * @hidden
 */
interface IRectCollection {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * The `StampAnnotation` module is used to handle annotation actions of PDF viewer.
 * @hidden
 */
export class StampAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private author: string;
    /**
     * @private
     */
    // tslint:disable-next-line
    public currentStampAnnotation: any;
    /**
     * @private
     */
    public isStampAnnotSelected: boolean;
    /**
     * @private
     */
    public isStampAddMode: boolean = false;
    /**
     * @private
     */
    public isNewStampAnnot: boolean;
    private isExistingStamp: boolean;
    /**
     * @private
     */
    // tslint:disable-next-line
    public stampPageNumber: any = [];
    private dynamicText: string = '';
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderStampAnnotations(stampAnnotations: any, pageNumber: number, canvass?: any, isImport?: boolean): void {
        let isStampAdded: boolean = false;
        for (let p: number = 0; p < this.stampPageNumber.length; p++) {
            if (this.stampPageNumber[p] === pageNumber) {
                isStampAdded = true;
                break;
            }
        }
        if (isImport) {
            isStampAdded = false;
        }
        if (stampAnnotations && !isStampAdded) {
            this.stampPageNumber.push(pageNumber);
            for (let s: number = 0; s < stampAnnotations.length; s++) {
                // tslint:disable-next-line
                let annotation: any = stampAnnotations[s];
                // tslint:disable-next-line
                let Apperance: any = annotation['Apperarance'];
                // tslint:disable-next-line
                let position: any = annotation['Rect'];
                // tslint:disable-next-line
                let opacity: any = annotation['Opacity'];
                // tslint:disable-next-line
                let pageIndex: number = parseFloat(stampAnnotations[s]['pageNumber']);
                // tslint:disable-next-line
                let stampName: any = annotation['IsDynamic'];
                let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                // tslint:disable-next-line
                if (stampName && annotation['Subject']) {
                    // tslint:disable-next-line
                    this.retrieveDynamicStampAnnotation(annotation['Subject']);
                    this.isExistingStamp = true;
                    let currentLocation: IRectCollection;
                    if (isImport) {
                        currentLocation = this.calculateImagePosition(position, false, true);
                    } else {
                        currentLocation = this.calculateImagePosition(position, true);
                    }
                    // tslint:disable-next-line
                    let rotation: number = this.retrieveRotationAngle(annotation['RotateAngle']);
                    for (let d: number = 0; d < Apperance.length; d++) {
                        // tslint:disable-next-line
                        let stampShapes: any = Apperance[d];
                        // tslint:disable-next-line
                        let stampType: any = stampShapes['type'];
                        // tslint:disable-next-line
                        if (stampType === 'string' && stampShapes['text'] !== undefined) {
                            // tslint:disable-next-line
                            let text: any = stampShapes['text'].split('(')[1].split(')')[0];
                            // tslint:disable-next-line
                            if (text.toLowerCase() !== annotation['Subject'].toLowerCase()) {
                                this.dynamicText += text;
                            }
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                    this.renderStamp(currentLocation.left, currentLocation.top, currentLocation.width, currentLocation.height, pageIndex, opacity, rotation, canvass, annotation, true);
                }
                // tslint:disable-next-line
                else if (annotation['Subject']) {
                    // tslint:disable-next-line
                    this.retrievestampAnnotation(annotation['Subject']);
                    this.isExistingStamp = true;
                    let currentLocation: IRectCollection;
                    if (isImport) {
                        currentLocation = this.calculateImagePosition(position, false, true);
                    } else {
                        currentLocation = this.calculateImagePosition(position, true);
                    }
                    // tslint:disable-next-line
                    let rotation: number = this.retrieveRotationAngle(annotation['RotateAngle']);
                    // tslint:disable-next-line
                    if (annotation['Subject'] === 'Accepted' || annotation['Subject'] === 'Rejected') {
                        currentLocation.width = (position.Width);
                        currentLocation.height = (position.Height);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.renderStamp(currentLocation.left, currentLocation.top, currentLocation.width, currentLocation.height, pageIndex, opacity, rotation, canvass, annotation);
                    this.isExistingStamp = false;
                } else {
                    for (let j: number = 0; j < Apperance.length; j++) {
                        // tslint:disable-next-line
                        let stampShapes: any = Apperance[j];
                        // tslint:disable-next-line
                        let imageData: any = stampShapes['imagedata'];
                        // tslint:disable-next-line
                        let matrix: any = stampShapes['matrix'];
                        // tslint:disable-next-line
                        let currentDate: any = stampShapes['CreationDate'];
                        // tslint:disable-next-line
                        let modifiedDate: any = stampShapes['ModifiedDate'];
                        // tslint:disable-next-line
                        let rotationAngle: any = stampShapes['RotateAngle'];
                        if (imageData) {
                            let image: HTMLImageElement = new Image();
                            // tslint:disable-next-line
                            let proxy: any = this;
                            image.onload = (): void => {
                                let currentLocation: IRectCollection = proxy.calculateImagePosition(position);
                                // tslint:disable-next-line:max-line-length
                                proxy.renderCustomImage(currentLocation, pageIndex, image, currentDate, modifiedDate, rotationAngle, opacity, canvass, true, annotation);
                            };
                            image.src = imageData;
                        }
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    public moveStampElement(X: number, Y: number, pageIndex: number): PdfAnnotationBase {
        let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
        X = X / zoomFactor;
        Y = Y / zoomFactor;
        if (this.pdfViewerBase.isDynamicStamp) {
            // tslint:disable-next-line
            let today: any = (new Date()).toString().split(' ').splice(1, 3).join(' ');
            // tslint:disable-next-line
            let time: any = (new Date()).toLocaleTimeString();
            this.dynamicText = 'By ' + this.pdfViewer.stampSettings.author + ' at ' + time + ' , ' + today + '   ';
        }
        let annot: PdfAnnotationBaseModel;
        // tslint:disable-next-line
        let annotation: any = this.currentStampAnnotation;
        if (annotation && annotation.shapeAnnotationType === 'Image') {
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'stamp' + this.pdfViewerBase.customStampCount, bounds: { x: X, y: Y, width: annotation.bounds.width, height: annotation.bounds.height }, pageIndex: pageIndex, data: annotation.data, modifiedDate: annotation.modifiedDate,
                shapeAnnotationType: 'Image', opacity: annotation.opacity, rotateAngle: annotation.RotationAngle, annotName: annotation.annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: annotation.author }
            };
        } else if (annotation) {
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'stamp' + this.pdfViewerBase.customStampCount, bounds: { x: X, y: Y, width: annotation.width, height: annotation.height }, pageIndex: pageIndex, data: annotation.pathdata,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'Stamp', strokeColor: annotation.strokeColor, fillColor: annotation.fillColor, opacity: 0.5, stampFillColor: annotation.stampFillColor, stampStrokeColor: annotation.stampStrokeColor, rotateAngle: annotation.RotateAngle, isDynamicStamp: this.pdfViewerBase.isDynamicStamp, dynamicText: this.dynamicText, subject: annotation.iconName,
            };
        }
        if (this.pdfViewerBase.currentSignatureAnnot) {
            annotation = this.pdfViewerBase.currentSignatureAnnot;
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: X, y: Y, width: annotation.bounds.width, height: annotation.bounds.height }, pageIndex: pageIndex, data: annotation.data,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'HandWrittenSignature', thickness: annotation.thickness, strokeColor: annotation.strokeColor, opacity: annotation.opacity
            };
        }
        return (annot as PdfAnnotationBase);
    }
    // tslint:disable-next-line
    private ConvertPointToPixel(number: any): any {
        return (number * (96 / 72));
    }
    // tslint:disable-next-line
    private calculateImagePosition(position: any, flags?: boolean, isImport?: boolean): any {
        let positions: IRectCollection = { width: 0, height: 0, left: 0, top: 0 };
        if (flags) {
            let width: number = this.ConvertPointToPixel((parseFloat(position.Width)) - 20);
            let height: number = this.ConvertPointToPixel((parseFloat(position.Height)) - 20);
            let left: number = this.ConvertPointToPixel((parseFloat(position.X)) + 10);
            let top: number = this.ConvertPointToPixel((parseFloat(position.Y)) + 10);
            positions = { width: width, height: height, left: left, top: top };
        } else if (isImport) {
            positions = { width: position.Width - 20, height: position.Height - 20, left: position.X - 2, top: position.Y - 3 };
        } else {
            let width: number = this.ConvertPointToPixel((parseFloat(position.Width)));
            let height: number = this.ConvertPointToPixel((parseFloat(position.Height)));
            let left: number = this.ConvertPointToPixel((parseFloat(position.X)));
            let top: number = this.ConvertPointToPixel((parseFloat(position.Y)));
            positions = { width: width, height: height, left: left, top: top };
        }
        return positions;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public createCustomStampAnnotation(imageSource: any): void {
        let pageIndex: number = this.pdfViewerBase.currentPageNumber - 1;
        let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
        let image: HTMLImageElement = new Image();
        // tslint:disable-next-line
        let proxy: any = this;
        image.onload = (): void => {
            let zoomFactor: number = this.pdfViewerBase.getZoomFactor();
            // tslint:disable-next-line:max-line-length
            let customStampWidth: number = this.pdfViewer.customStampSettings.width > 0 ? this.pdfViewer.customStampSettings.width : 100;
            let customStampHeight: number = this.pdfViewer.customStampSettings.height > 0 ? this.pdfViewer.customStampSettings.height : 100;
            let customStampleft: number = 0;
            let customStamptop: number = 0;
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.customStampSettings.left > 0 && this.pdfViewer.customStampSettings.left < parseFloat(pageDiv.style.width)) {
                customStampleft = this.pdfViewer.customStampSettings.left;
            } else {
                customStampleft = ((parseFloat(pageDiv.style.width) / 2) - (customStampWidth / 2)) / zoomFactor;
            }
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.customStampSettings.top > 0 && this.pdfViewer.customStampSettings.top < parseFloat(pageDiv.style.height)) {
                customStamptop = this.pdfViewer.customStampSettings.top;
            } else {
                customStamptop = ((parseFloat(pageDiv.style.height) / 2) - (customStampHeight / 2)) / zoomFactor;
            }
            // tslint:disable-next-line:max-line-length
            let positions: IRectCollection = { width: customStampWidth, height: customStampHeight, left: customStampleft, top: customStamptop };
            // tslint:disable-next-line
            let currentDate: any = new Date().toLocaleDateString();
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line
            let modifiedDate: any = this.pdfViewer.stampSettings.modifiedDate !== '' ? this.pdfViewer.stampSettings.modifiedDate : new Date().toLocaleString();
            let rotationAngle: number = 0;
            proxy.renderCustomImage(positions, pageIndex, image, currentDate, modifiedDate, rotationAngle, 1, null);
        };
        image.src = imageSource;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderStamp(X: number, Y: number, width: number, height: number, pageIndex: number, opacity: number, rotation: any, canvass: any, existingAnnotation: any, isDynamic?: any): any {
        if (this.pdfViewerBase.isDynamicStamp) {
            // tslint:disable-next-line
            let today: any = (new Date()).toString().split(' ').splice(1, 3).join(' ');
            // tslint:disable-next-line
            let time: any = (new Date()).toLocaleTimeString();
            this.dynamicText = 'By ' + this.pdfViewer.stampSettings.author + ' at ' + time + ' , ' + today + ' ';
        }
        if (isDynamic) {
            this.dynamicText += ' ';
            this.pdfViewerBase.isDynamicStamp = true;
        }
        let annot: PdfAnnotationBaseModel;
        let annotationObject: IStampAnnotation = null;
        // tslint:disable-next-line
        let annotation: any = this.currentStampAnnotation;
        if (annotation) {
            if (width !== null && height !== null) {
                annotation.width = width;
                annotation.height = height;
                annotation.Opacity = opacity;
                annotation.RotateAngle = rotation;
                // tslint:disable-next-line
                let annotationName: any = existingAnnotation['AnnotName'];
                annotation.AnnotName = annotationName;
                // tslint:disable-next-line
                let annotationComments: any = existingAnnotation['Comments'];
                annotation.Comments = this.pdfViewer.annotationModule.getAnnotationComments(annotationComments, existingAnnotation, this.pdfViewer.stampSettings.author);
                // tslint:disable-next-line
                let state: any = existingAnnotation['State'];
                annotation.State = state;
                // tslint:disable-next-line
                let modifiedDate: any = existingAnnotation['ModifiedDate'];
                annotation.ModifiedDate = modifiedDate;
                // tslint:disable-next-line
                let stateModel: any = existingAnnotation['StateNodel'];
                annotation.StateModel = stateModel;
                // tslint:disable-next-line
                let text: any = existingAnnotation['Note'];
                annotation.Note = text;
                // tslint:disable-next-line
                let author: any = existingAnnotation['Author'];
                annotation.Author = author;
                if (annotation.Author === null) {
                    annotation.Author = this.pdfViewer.stampSettings.author;
                }
            } else {
                let annotationName: string = this.pdfViewer.annotation.createGUID();
                let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('stamp', pageIndex + 1);
                if (commentsDivid) {
                    document.getElementById(commentsDivid).id = annotationName;
                }
                annotation.AnnotName = annotationName;
                annotation.Comments = [];
                annotation.State = '';
                annotation.StateModel = '';
                annotation.Note = '';
                annotation.Opacity = 1;
                annotation.RotateAngle = 0;
                annotation.ModifiedDate = new Date().toLocaleString();
                annotation.Author = this.pdfViewer.stampSettings.author;
            }
            // tslint:disable-next-line
            let collectionData: any = processPathData(annotation.pathdata);
            // tslint:disable-next-line
            let csData: any = splitArrayCollection(collectionData);
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'stamp' + this.pdfViewerBase.customStampCount, bounds: { x: X, y: Y, width: annotation.width, height: annotation.height }, pageIndex: pageIndex, data: annotation.pathdata, modifiedDate: annotation.ModifiedDate,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'Stamp', strokeColor: annotation.strokeColor, fillColor: annotation.fillColor, opacity: annotation.Opacity, stampFillColor: annotation.stampFillColor, stampStrokeColor: annotation.stampStrokeColor, rotateAngle: annotation.RotateAngle, isDynamicStamp: this.pdfViewerBase.isDynamicStamp, dynamicText: this.dynamicText, annotName: annotation.AnnotName, notes: annotation.Note,
                comments: annotation.Comments, review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, subject: annotation.iconName
            };
            annotationObject = {
                // tslint:disable-next-line:max-line-length
                stampAnnotationType: 'path', author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                note: annotation.Note, strokeColor: annotation.strokeColor, fillColor: annotation.fillColor, opacity: annotation.Opacity, stampFillcolor: annotation.stampFillColor,
                // tslint:disable-next-line:max-line-length
                rotateAngle: annotation.RotateAngle, creationDate: annotation.creationDate, pageNumber: pageIndex, icon: annotation.iconName, stampAnnotationPath: csData, randomId: 'stamp' + this.pdfViewerBase.customStampCount, isDynamicStamp: this.pdfViewerBase.isDynamicStamp, dynamicText: this.dynamicText,
                bounds: { left: X, top: Y, width: annotation.width, height: annotation.height, }, annotName: annotation.AnnotName, comments: annotation.Comments, review: { state: annotation.State, stateModel: annotation.StateModel, author: annotation.Author, modifiedDate: annotation.ModifiedDate }, shapeAnnotationType: 'stamp'
            };
            this.storeStampInSession(pageIndex, annotationObject);
            this.pdfViewer.add(annot as PdfAnnotationBase);
            // tslint:disable-next-line
            if (canvass != undefined && canvass != null) {
                canvass = canvass;
            } else {
                canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            }
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass as any, pageIndex);
            if (this.pdfViewerBase.stampAdded) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(pageIndex, null, annot as PdfAnnotationBase, 'Addition', '', annot as PdfAnnotationBase, annot);
            }
            this.pdfViewerBase.stampAdded = false;
            if (!this.isExistingStamp) {
                annotation.creationDate = new Date().toLocaleDateString();
                // tslint:disable-next-line:max-line-length
                annotation.modifiedDate = this.pdfViewer.stampSettings.modifiedDate !== '' ? this.pdfViewer.stampSettings.modifiedDate : new Date().toLocaleString();
            }
        }
        this.resetAnnotation();
    }
    /**
     * @private
     */
    public resetAnnotation(): void {
        this.pdfViewerBase.isDynamicStamp = false;
        this.dynamicText = '';
        this.currentStampAnnotation = null;
        this.pdfViewerBase.customStampCount += 1;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public updateDeleteItems(pageNumber: number, annotation: any, opacity?: number): any {
        this.pdfViewerBase.isDocumentEdited = true;
        let annotationObject: IStampAnnotation = null;
        annotation.modifiedDate = new Date().toLocaleString();
        annotation.author = this.pdfViewer.stampSettings.author;
        if (opacity) {
            let annotationName: string = this.pdfViewer.annotation.createGUID();
            let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('stamp', pageNumber + 1);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
            annotation.annotName = annotationName;
            annotation.Comments = [];
            annotation.State = '';
            annotation.StateModel = '';
            annotation.Note = '';
            annotation.Opacity = 1;
            annotation.RotateAngle = 0;
        }
        if (annotation.shapeAnnotationType === 'Image') {
            annotation.author = this.pdfViewer.customStampSettings.author;
            annotationObject = {
                // tslint:disable-next-line:max-line-length
                stampAnnotationType: 'image', author: annotation.author, modifiedDate: annotation.modifiedDate, subject: '',
                note: '', strokeColor: '', fillColor: '', opacity: opacity,
                // tslint:disable-next-line:max-line-length
                rotateAngle: '0', creationDate: annotation.currentDate, pageNumber: pageNumber, icon: '', stampAnnotationPath: annotation.data, randomId: 'stamp' + this.pdfViewerBase.customStampCount,
                // tslint:disable-next-line:max-line-length
                bounds: { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width, height: annotation.bounds.height }, stampFillcolor: '', isDynamicStamp: false,
                annotName: annotation.annotName, comments: [], review: { state: '', stateModel: '', author: annotation.author, modifiedDate: annotation.modifiedDate }, shapeAnnotationType: 'stamp'
            };
        } else if (annotation.stampAnnotationType) {
            annotationObject = {
                // tslint:disable-next-line:max-line-length
                stampAnnotationType: annotation.stampAnnotationType, author: annotation.author, modifiedDate: annotation.modifiedDate, subject: annotation.Subject,
                note: annotation.Note, strokeColor: annotation.strokeColor, fillColor: annotation.fillColor, opacity: annotation.opacity, stampFillcolor: annotation.stampFillcolor,
                // tslint:disable-next-line:max-line-length
                rotateAngle: annotation.rotateAngle, creationDate: annotation.creationDate, pageNumber: annotation.pageNumber, icon: annotation.icon, stampAnnotationPath: annotation.stampAnnotationPath, randomId: annotation.randomId, isDynamicStamp: annotation.isDynamicStamp, dynamicText: annotation.dynamicText,
                bounds: { left: annotation.bounds.left, top: annotation.bounds.top, width: annotation.bounds.width, height: annotation.bounds.height }, annotName: annotation.annotName, comments: annotation.Comments, review: { state: annotation.State, stateModel: annotation.StateModel, author: annotation.author, modifiedDate: annotation.ModifiedDate }, shapeAnnotationType: 'stamp'
            };
        } else {
            annotationObject = {
                // tslint:disable-next-line:max-line-length
                stampAnnotationType: annotation.shapeAnnotationType, author: annotation.author, modifiedDate: annotation.modifiedDate, subject: annotation.subject,
                note: annotation.notes, strokeColor: annotation.strokeColor, fillColor: annotation.fillColor, opacity: annotation.opacity, stampFillcolor: annotation.stampFillColor,
                // tslint:disable-next-line:max-line-length
                rotateAngle: annotation.rotateAngle, creationDate: annotation.creationDate, pageNumber: annotation.pageIndex, icon: annotation.subject, stampAnnotationPath: annotation.data, randomId: annotation.id, isDynamicStamp: annotation.isDynamicStamp, dynamicText: annotation.dynamicText, shapeAnnotationType: 'stamp',
                bounds: { left: annotation.bounds.x, top: annotation.bounds.y, width: annotation.bounds.width, height: annotation.bounds.height, }, annotName: annotation.annotName, comments: annotation.Comments, review: { state: annotation.State, stateModel: annotation.StateModel, author: annotation.author, modifiedDate: annotation.ModifiedDate }
            };
        }
        if (opacity) {
            if (annotation.shapeAnnotationType !== 'Image') {
                // tslint:disable-next-line
                let collectionData: any = processPathData(annotation.data);
                // tslint:disable-next-line
                let csData: any = splitArrayCollection(collectionData);
                annotationObject.stampAnnotationPath = csData;
            }
            annotation.creationDate = new Date().toLocaleDateString();
            annotationObject.bounds.width = annotation.wrapper.actualSize.width;
            annotationObject.bounds.height = annotation.wrapper.actualSize.height;
            annotationObject.bounds.left = annotation.wrapper.bounds.x;
            annotationObject.bounds.top = annotation.wrapper.bounds.y;
            annotationObject.opacity = opacity;
            if (this.pdfViewerBase.stampAdded) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(pageNumber, null, annotation as PdfAnnotationBase, 'Addition', '', annotation as PdfAnnotationBase, annotationObject);
            }
        }
        this.storeStampInSession(pageNumber, annotationObject);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderCustomImage(position: any, pageIndex: any, image: any, currentDate: any, modifiedDate: any, RotationAngle: any, opacity: any, canvas?: any, isExistingStamp?: boolean, annotation?: any) {
        let annot: PdfAnnotationBaseModel;
        let annotationObject: IStampAnnotation = null;
        let annotationName: string;
        let author: string;
        if (isExistingStamp) {
            annotationName = annotation.AnnotName;
            author = annotation.Author;
            if (author === null) {
                author = this.pdfViewer.customStampSettings.author;
            }
        } else {
            annotationName = this.pdfViewer.annotation.createGUID();
            author = this.pdfViewer.customStampSettings.author;
        }
        annot = {
            // tslint:disable-next-line:max-line-length
            id: 'stamp' + this.pdfViewerBase.customStampCount, bounds: { x: position.left, y: position.top, width: position.width, height: position.height }, pageIndex: pageIndex, data: image.src, modifiedDate: modifiedDate,
            shapeAnnotationType: 'Image', opacity: opacity, rotateAngle: RotationAngle, annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: author }
        };
        this.currentStampAnnotation = annot;
        if (isExistingStamp) {
            let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('stamp', pageIndex + 1);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
            annotationObject = {
                // tslint:disable-next-line:max-line-length
                stampAnnotationType: 'image', author: author, modifiedDate: modifiedDate, subject: '',
                note: '', strokeColor: '', fillColor: '', opacity: opacity,
                // tslint:disable-next-line:max-line-length
                rotateAngle: '0', creationDate: currentDate, pageNumber: pageIndex, icon: '', stampAnnotationPath: image.src, randomId: 'stamp' + this.pdfViewerBase.customStampCount,
                // tslint:disable-next-line:max-line-length
                bounds: { left: position.left, top: position.top, width: position.width, height: position.height }, stampFillcolor: '', isDynamicStamp: false,
                annotName: annotationName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, author: author, modifiedDate: modifiedDate }, shapeAnnotationType: 'stamp'
            };
            this.storeStampInSession(pageIndex, annotationObject);
            annot.comments = this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author);
            annot.review = { state: annotation.State, stateModel: annotation.StateModel, author: author, modifiedDate: modifiedDate };
            this.pdfViewer.add(annot as PdfAnnotationBase);
            // tslint:disable-next-line
            if (canvas != undefined && canvas != null) {
                canvas = canvas;
            } else {
                canvas = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            }
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvas as any, pageIndex);
            if (this.pdfViewerBase.stampAdded) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(pageIndex, null, annot as PdfAnnotationBase, 'Addition', '', annot as PdfAnnotationBase, annot);
            }
        }
        this.pdfViewerBase.customStampCount += 1;
    }
    private retrieveRotationAngle(angleString: number): number {
        let angle: number = 0;
        switch (angleString) {
            case 0:
                angle = 0;
                break;
            case 1:
                angle = 90;
                break;
            case 2:
                angle = 180;
                break;
            case 3:
                angle = 270;
                break;
        }
        return angle;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public retrieveDynamicStampAnnotation(icontype: any): any {
        let stampCollection: IstampCollection;
        switch (icontype.trim()) {
            case 'Revised':
                {
                    stampCollection = {
                        iconName: 'Revised',
                        // tslint:disable-next-line:max-line-length
                        pathdata: 'M19.68,21.22a3.94,3.94,0,0,1-1.1-1.9L16,11.87l-.21-.64a20.77,20.77,0,0,0,2.11-.58,7.24,7.24,0,0,0,2-1.09,5.65,5.65,0,0,0,1.72-2.12,5.4,5.4,0,0,0,.52-2.2A4.15,4.15,0,0,0,19.1,1.05a14.58,14.58,0,0,0-4.72-.6H5.31v.86a7,7,0,0,1,2,.33c.3.14.45.48.45,1a6.1,6.1,0,0,1-.14,1.08l-.21.8L3.31,19.32a3.35,3.35,0,0,1-.94,1.78,3.58,3.58,0,0,1-1.74.57v.86h9.83v-.86a6.22,6.22,0,0,1-2-.35c-.29-.15-.43-.52-.43-1.11,0-.1,0-.21,0-.31a2.36,2.36,0,0,1,0-.28l.28-1.14,1.95-6.86h.93l3.56,10.91h6.25v-.88A3.05,3.05,0,0,1,19.68,21.22ZM13.29,10.31a14,14,0,0,1-2.63.23l2-7.56a2.67,2.67,0,0,1,.52-1.17,1.4,1.4,0,0,1,1-.3,2.74,2.74,0,0,1,2.33.91,3.72,3.72,0,0,1,.69,2.3,6.4,6.4,0,0,1-.49,2.52,6.72,6.72,0,0,1-1.06,1.82A4.11,4.11,0,0,1,13.29,10.31ZM26,.45H43.74l-1.4,6.27-.88-.15a6,6,0,0,0-.78-3.4c-.84-1.12-2.54-1.69-5.11-1.69a2.9,2.9,0,0,0-1.68.32A2.34,2.34,0,0,0,33.26,3l-1.95,7.33a13.55,13.55,0,0,0,4.48-.56c.68-.32,1.44-1.3,2.27-2.92l.91.11-2.44,9-.91-.16a7.27,7.27,0,0,0,.09-.82q0-.35,0-.57a2.69,2.69,0,0,0-1-2.4A7.57,7.57,0,0,0,31,11.38l-2.17,8c0,.2-.09.38-.12.57a2.62,2.62,0,0,0,0,.43.92.92,0,0,0,.35.74,2.54,2.54,0,0,0,1.49.29,13.84,13.84,0,0,0,5.11-.84A9.85,9.85,0,0,0,40.73,16l.81.14-1.95,6.42h-18v-.9a3.43,3.43,0,0,0,1.42-.53A3.42,3.42,0,0,0,24,19.32L28,4.51c.1-.37.18-.72.25-1a4.23,4.23,0,0,0,.09-.78c0-.56-.15-.91-.44-1.06a6.85,6.85,0,0,0-2-.34ZM63.4,3.37,51,23.15H49.9L47.39,6.34a17.25,17.25,0,0,0-.93-4.24c-.25-.43-.93-.7-2.05-.79V.45h9.86v.86a5.47,5.47,0,0,0-1.72.19,1.14,1.14,0,0,0-.81,1.16,3,3,0,0,0,0,.31l0,.32L53.5,16.43l6.24-9.85c.49-.79.94-1.57,1.33-2.36a4.45,4.45,0,0,0,.6-1.85.88.88,0,0,0-.61-.9,6.11,6.11,0,0,0-1.52-.16V.45h6.34v.86a3.88,3.88,0,0,0-1.16.5A5.73,5.73,0,0,0,63.4,3.37ZM70.08,20c0,.11,0,.22,0,.31,0,.56.15.91.45,1.06a6.39,6.39,0,0,0,1.95.35v.86H62.63v-.86a3.58,3.58,0,0,0,1.74-.57,3.35,3.35,0,0,0,.94-1.78l4-14.81q.18-.63.27-1a3.78,3.78,0,0,0,.09-.75c0-.56-.16-.91-.47-1.06a7,7,0,0,0-2-.34V.45h9.83v.86a3.61,3.61,0,0,0-1.75.58,3.37,3.37,0,0,0-.91,1.78L70.4,18.48l-.26,1.14Zm19.26-7.23a6.37,6.37,0,0,1,1.07,3.62,6.58,6.58,0,0,1-2.06,4.71,7.54,7.54,0,0,1-5.65,2.1A10.15,10.15,0,0,1,80.89,23a11.42,11.42,0,0,1-1.8-.49l-.83-.3-.58-.2a2,2,0,0,0-.38,0,1,1,0,0,0-.78.26,3.89,3.89,0,0,0-.52.92H75l1.19-7.4,1,.07a14.63,14.63,0,0,0,.28,2.3,5.27,5.27,0,0,0,2.79,3.44,4.73,4.73,0,0,0,2.06.44,3.85,3.85,0,0,0,3.07-1.26,4.39,4.39,0,0,0,1.09-2.94q0-2.09-4.05-5.25c-2.7-2.22-4-4.26-4-6.14a6.31,6.31,0,0,1,1.78-4.53,6.51,6.51,0,0,1,5-1.87,9.67,9.67,0,0,1,1.82.18A6.54,6.54,0,0,1,88,.45l.84.28.56.13a2.59,2.59,0,0,0,.52.06,1.4,1.4,0,0,0,.88-.24,2.2,2.2,0,0,0,.53-.6h1L91,6.69l-.85-.12L90,5.49a6,6,0,0,0-1-2.62,3.82,3.82,0,0,0-3.38-1.73A3,3,0,0,0,82.9,2.53a3.6,3.6,0,0,0-.58,2,3.44,3.44,0,0,0,.59,2,6,6,0,0,0,1,1l2.85,2.33A12.75,12.75,0,0,1,89.34,12.72ZM110.27,16l.81.14-2,6.42H90.85v-.86a3.66,3.66,0,0,0,1.74-.57,3.42,3.42,0,0,0,.93-1.78l4-14.81c.1-.37.18-.72.25-1a4.23,4.23,0,0,0,.09-.78c0-.56-.14-.91-.44-1.06a6.85,6.85,0,0,0-2-.34V.45h17.77l-1.4,6.27L111,6.57a6,6,0,0,0-.78-3.4c-.84-1.12-2.54-1.69-5.1-1.69a2.92,2.92,0,0,0-1.69.32A2.34,2.34,0,0,0,102.8,3l-2,7.33a13.55,13.55,0,0,0,4.48-.56c.69-.32,1.44-1.3,2.27-2.92l.92.11-2.45,9-.91-.16a7.27,7.27,0,0,0,.09-.82q0-.35,0-.57a2.69,2.69,0,0,0-1-2.4,7.57,7.57,0,0,0-3.79-.64l-2.17,8c0,.2-.09.38-.12.57a2.62,2.62,0,0,0,0,.43.92.92,0,0,0,.35.74,2.54,2.54,0,0,0,1.49.29,13.84,13.84,0,0,0,5.11-.84A9.81,9.81,0,0,0,110.27,16Zm22.65-13Q130.39.45,125.52.45h-9.58v.86a7,7,0,0,1,2,.34c.31.15.47.5.47,1.06a3.61,3.61,0,0,1-.09.74c-.06.29-.15.64-.26,1.06L114,19.31a3.18,3.18,0,0,1-1.15,1.91,3.57,3.57,0,0,1-1.53.45v.86h9.47a14.87,14.87,0,0,0,10.95-4.14,12,12,0,0,0,3.75-8.77A8.94,8.94,0,0,0,132.92,2.94ZM129,15.36q-2.62,6.06-8.52,6.05a2.46,2.46,0,0,1-1.42-.29,1.05,1.05,0,0,1-.4-.93,2.24,2.24,0,0,1,0-.34,2.65,2.65,0,0,1,.08-.43l4.55-16.67a2,2,0,0,1,.54-.92,2.2,2.2,0,0,1,1.44-.35,4.74,4.74,0,0,1,4.47,2.22,7.9,7.9,0,0,1,.83,3.9A19.32,19.32,0,0,1,129,15.36Z',
                        opacity: 1, strokeColor: '', fillColor: '#192760', width: 127.47, height: 55.84601, stampFillColor: '#dce3ef', stampStrokeColor: '',
                    };
                }
                break;
            case 'Reviewed':
                {
                    stampCollection = {
                        iconName: 'Reviewed',
                        // tslint:disable-next-line:max-line-length
                        pathdata: 'M17.37,18.25a3.47,3.47,0,0,1-1-1.67L14.17,10c0-.07-.1-.26-.19-.56A14.71,14.71,0,0,0,15.83,9a6.08,6.08,0,0,0,1.76-1A4.92,4.92,0,0,0,19.1,6.14a4.71,4.71,0,0,0,.46-1.93A3.65,3.65,0,0,0,16.86.52,12.83,12.83,0,0,0,12.72,0h-8V.75a6.62,6.62,0,0,1,1.72.3c.26.12.39.41.39.88a4.56,4.56,0,0,1-.13.94c0,.2-.1.44-.17.7L3,16.58a2.87,2.87,0,0,1-.82,1.56,3.15,3.15,0,0,1-1.53.51v.75H9.27v-.75a5.88,5.88,0,0,1-1.74-.31c-.25-.13-.37-.46-.37-1a2.53,2.53,0,0,1,0-.28,1.44,1.44,0,0,1,0-.24l.24-1,1.71-6H10l3.13,9.59h5.49v-.77A2.71,2.71,0,0,1,17.37,18.25ZM11.75,8.67a12.06,12.06,0,0,1-2.3.19L11.2,2.22a2.2,2.2,0,0,1,.46-1,1.19,1.19,0,0,1,.87-.27,2.41,2.41,0,0,1,2.05.8,3.29,3.29,0,0,1,.6,2A5.63,5.63,0,0,1,14.75,6a6.06,6.06,0,0,1-.93,1.59A3.65,3.65,0,0,1,11.75,8.67ZM22.9,0H38.52L37.29,5.51l-.78-.13a5.34,5.34,0,0,0-.68-3c-.74-1-2.24-1.48-4.49-1.48a2.68,2.68,0,0,0-1.49.27,2.09,2.09,0,0,0-.54,1L27.59,8.67a12.08,12.08,0,0,0,3.94-.5,5.69,5.69,0,0,0,2-2.56l.81.1-2.16,7.93-.79-.15c0-.27.06-.51.08-.71s0-.37,0-.5a2.34,2.34,0,0,0-.85-2.11A6.61,6.61,0,0,0,27.3,9.6l-1.91,7.08a4.91,4.91,0,0,0-.1.5,2,2,0,0,0,0,.38.83.83,0,0,0,.31.65,2.29,2.29,0,0,0,1.31.25,12.21,12.21,0,0,0,4.49-.73,8.69,8.69,0,0,0,4.51-4.09l.71.12L34.86,19.4H19.05v-.79a2.88,2.88,0,0,0,1.28-.47,2.94,2.94,0,0,0,.82-1.56l3.56-13q.13-.49.21-.9A3.26,3.26,0,0,0,25,2q0-.73-.39-.93A6.44,6.44,0,0,0,22.9.75ZM55.79,2.57,44.86,20h-.93L41.72,5.17a16.05,16.05,0,0,0-.81-3.73c-.22-.37-.82-.6-1.81-.69V0h8.67V.75a5,5,0,0,0-1.52.17,1,1,0,0,0-.7,1,2.53,2.53,0,0,0,0,.28l0,.27L47.09,14l5.48-8.66C53,4.69,53.4,4,53.75,3.32a4,4,0,0,0,.52-1.63.78.78,0,0,0-.54-.8A5.88,5.88,0,0,0,52.4.75V0H58V.75a3.55,3.55,0,0,0-1,.44A5.18,5.18,0,0,0,55.79,2.57ZM62,18.34a6,6,0,0,0,1.71.31v.75H55.12v-.75a3.15,3.15,0,0,0,1.53-.51,2.94,2.94,0,0,0,.82-1.56L61,3.57c.1-.37.18-.68.23-.93A2.81,2.81,0,0,0,61.34,2c0-.49-.13-.8-.41-.93a6.61,6.61,0,0,0-1.71-.3V0h8.63V.75a3.17,3.17,0,0,0-1.53.51,3,3,0,0,0-.8,1.57l-3.58,13-.22,1a2.74,2.74,0,0,0,0,.28,1.41,1.41,0,0,0,0,.28C61.64,17.9,61.78,18.21,62,18.34ZM69.13,0H84.75L83.52,5.51l-.78-.13a5.34,5.34,0,0,0-.68-3c-.74-1-2.24-1.48-4.49-1.48a2.68,2.68,0,0,0-1.49.27,2.09,2.09,0,0,0-.54,1L73.82,8.67a12.08,12.08,0,0,0,3.94-.5,5.69,5.69,0,0,0,2-2.56l.81.1L78.4,13.64l-.79-.15c0-.27.07-.51.08-.71s0-.37,0-.5a2.34,2.34,0,0,0-.85-2.11,6.61,6.61,0,0,0-3.33-.57l-1.91,7.08a4.91,4.91,0,0,0-.1.5,2,2,0,0,0,0,.38.83.83,0,0,0,.31.65,2.29,2.29,0,0,0,1.31.25,12.21,12.21,0,0,0,4.49-.73,8.69,8.69,0,0,0,4.51-4.09l.71.12L81.1,19.4H65v-.75a3.15,3.15,0,0,0,1.53-.51,2.94,2.94,0,0,0,.82-1.56l3.56-13q.14-.49.21-.9A3.26,3.26,0,0,0,71.24,2q0-.73-.39-.93a6.44,6.44,0,0,0-1.72-.3Zm39.15,2.83L100,20h-.84L97.41,5.85,90.67,20h-.84L87.58,3.13A3.83,3.83,0,0,0,87,1.23,2.84,2.84,0,0,0,85.33.71V0h8.06V.75A2.55,2.55,0,0,0,92.27,1a1.33,1.33,0,0,0-.66,1.31c0,.06,0,.13,0,.19s0,.15,0,.26l1.15,10.16,4.32-9a1,1,0,0,0,0-.27,3.33,3.33,0,0,0-.64-2.38A2.5,2.5,0,0,0,95.06.71V0h7.78V.71a2.9,2.9,0,0,0-1.4.34c-.27.19-.41.6-.41,1.24,0,.13,0,.32,0,.55,0,.4.08.88.14,1.47l1,8.47,4.51-9.42a7.12,7.12,0,0,0,.29-.74,2.48,2.48,0,0,0,.14-.79.9.9,0,0,0-.48-.93,3.25,3.25,0,0,0-1.34-.19V0h5.41V.71a2.34,2.34,0,0,0-1.1.35A4.56,4.56,0,0,0,108.28,2.83Zm16.45,10.81.71.12-1.71,5.64H107.66v-.75a3.15,3.15,0,0,0,1.53-.51,2.87,2.87,0,0,0,.82-1.56l3.57-13q.12-.49.21-.9a3.17,3.17,0,0,0,.08-.69q0-.73-.39-.93a6.44,6.44,0,0,0-1.72-.3V0h15.62l-1.23,5.51-.78-.13a5.26,5.26,0,0,0-.68-3C124,1.4,122.46.91,120.2.91a2.64,2.64,0,0,0-1.48.27,2.09,2.09,0,0,0-.55,1l-1.72,6.45a12,12,0,0,0,3.94-.5,5.62,5.62,0,0,0,2-2.56l.81.1L121,13.64l-.79-.15c0-.27.06-.51.07-.71s0-.37,0-.5a2.34,2.34,0,0,0-.86-2.11,6.57,6.57,0,0,0-3.32-.57l-1.91,7.08a5,5,0,0,0-.11.5,3.14,3.14,0,0,0,0,.38.8.8,0,0,0,.31.65,2.25,2.25,0,0,0,1.3.25,12.26,12.26,0,0,0,4.5-.73A8.67,8.67,0,0,0,124.73,13.64ZM144.64,2.19Q142.41,0,138.14,0h-8.42V.75a6.61,6.61,0,0,1,1.71.3c.28.13.41.44.41.93a2.81,2.81,0,0,1-.08.66c0,.25-.12.56-.23.93l-3.56,13a2.78,2.78,0,0,1-1,1.68,3.44,3.44,0,0,1-1.35.4v.75h8.32a13.06,13.06,0,0,0,9.63-3.64,10.49,10.49,0,0,0,3.3-7.7A7.87,7.87,0,0,0,144.64,2.19ZM141.2,13.1q-2.31,5.32-7.48,5.32a2.27,2.27,0,0,1-1.26-.25,1,1,0,0,1-.34-.82,1.62,1.62,0,0,1,0-.3,2.16,2.16,0,0,1,.08-.38l4-14.65a1.63,1.63,0,0,1,.47-.81A2,2,0,0,1,138,.91a4.16,4.16,0,0,1,3.93,1.95,7,7,0,0,1,.72,3.42A16.82,16.82,0,0,1,141.2,13.1Z',
                        opacity: 1, strokeColor: '', fillColor: '#192760', width: 127.70402, height: 55.84601, stampFillColor: '#dce3ef', stampStrokeColor: '',
                    };
                }
                break;
            case 'Received':
                {
                    stampCollection = {
                        iconName: 'Received',
                        // tslint:disable-next-line:max-line-length
                        pathdata: 'M18.17,8.76a5,5,0,0,0,1.57-1.93,5,5,0,0,0,.47-2A3.76,3.76,0,0,0,17.42,1,13,13,0,0,0,13.13.48H4.89v.78a6.49,6.49,0,0,1,1.77.31c.27.12.41.43.41.91a5.87,5.87,0,0,1-.13,1c-.05.2-.12.44-.19.72L3.06,17.64a3,3,0,0,1-.84,1.61,3.36,3.36,0,0,1-1.59.53v.77H9.57v-.77a6.17,6.17,0,0,1-1.8-.32c-.26-.14-.39-.48-.39-1a2.46,2.46,0,0,1,0-.28,1.78,1.78,0,0,1,0-.26l.25-1,1.78-6.25h.84l3.24,9.92h5.66v-.8A2.76,2.76,0,0,1,18,19.36a3.57,3.57,0,0,1-1-1.72l-2.31-6.78c0-.07-.09-.27-.19-.58.87-.2,1.51-.38,1.92-.52A6.56,6.56,0,0,0,18.17,8.76Zm-2.93-2.1a6.19,6.19,0,0,1-1,1.65,3.85,3.85,0,0,1-2.14,1.14,12.92,12.92,0,0,1-2.39.2l1.81-6.87A2.5,2.5,0,0,1,12,1.72a1.27,1.27,0,0,1,.9-.27,2.5,2.5,0,0,1,2.12.83,3.35,3.35,0,0,1,.62,2.09A5.81,5.81,0,0,1,15.24,6.66ZM30.3,2.78,28.52,9.45a12.53,12.53,0,0,0,4.08-.51,5.91,5.91,0,0,0,2-2.66l.84.11-2.23,8.2-.82-.15c0-.28.07-.53.08-.74a5.17,5.17,0,0,0,0-.52A2.43,2.43,0,0,0,31.66,11a6.87,6.87,0,0,0-3.44-.58l-2,7.32a3.61,3.61,0,0,0-.11.51,2.31,2.31,0,0,0,0,.4.83.83,0,0,0,.32.67,2.32,2.32,0,0,0,1.35.26,12.58,12.58,0,0,0,4.65-.76,9,9,0,0,0,4.67-4.23l.73.13-1.77,5.83H19.8v-.83A2.83,2.83,0,0,0,21,19.25a3.09,3.09,0,0,0,.85-1.61L25.54,4.17c.09-.34.16-.65.22-.93a3.35,3.35,0,0,0,.09-.71c0-.5-.13-.82-.4-1a6.34,6.34,0,0,0-1.78-.31V.48H39.82l-1.27,5.7-.81-.13A5.44,5.44,0,0,0,37,3Q35.9,1.42,32.4,1.42a2.69,2.69,0,0,0-1.54.29A2.08,2.08,0,0,0,30.3,2.78ZM56.56,6.1c0-.07,0-.18,0-.33a4.89,4.89,0,0,0-1.12-3.53,3.75,3.75,0,0,0-2.82-1.16c-2.33,0-4.35,1.55-6.07,4.63a17.09,17.09,0,0,0-2.31,8.43c0,2.08.47,3.5,1.43,4.27a4.89,4.89,0,0,0,3.11,1.15,6.84,6.84,0,0,0,4.14-1.45A11.51,11.51,0,0,0,55,16l.91.66A10.08,10.08,0,0,1,52.26,20a9.33,9.33,0,0,1-4.34,1.11A8.56,8.56,0,0,1,42,19a7.25,7.25,0,0,1-2.35-5.67A13.53,13.53,0,0,1,43.22,4a11.19,11.19,0,0,1,8.56-4A12.34,12.34,0,0,1,55,.44,13.17,13.17,0,0,0,56.9.88a1,1,0,0,0,.71-.24A2.94,2.94,0,0,0,58.06,0H59L57.45,7l-.94-.18C56.54,6.42,56.55,6.17,56.56,6.1Zm18,8.49.74.13-1.78,5.83H56.87v-.77a3.31,3.31,0,0,0,1.58-.53,3.09,3.09,0,0,0,.85-1.61L63,4.17c.09-.34.16-.65.22-.93a3.35,3.35,0,0,0,.09-.71c0-.5-.14-.82-.4-1a6.34,6.34,0,0,0-1.78-.31V.48H77.26L76,6.18l-.81-.13A5.44,5.44,0,0,0,74.48,3q-1.14-1.54-4.64-1.54a2.69,2.69,0,0,0-1.54.29,2.08,2.08,0,0,0-.56,1.07L66,9.45A12.53,12.53,0,0,0,70,8.94a5.91,5.91,0,0,0,2-2.66l.84.11-2.23,8.2-.82-.15c0-.28.07-.53.08-.74a5.17,5.17,0,0,0,0-.52A2.43,2.43,0,0,0,69.1,11a6.87,6.87,0,0,0-3.44-.58l-2,7.32a3.61,3.61,0,0,0-.11.51,2.31,2.31,0,0,0,0,.4.83.83,0,0,0,.32.67,2.32,2.32,0,0,0,1.35.26,12.58,12.58,0,0,0,4.65-.76A8.91,8.91,0,0,0,74.52,14.59Zm31-11.45-11.31,18h-1L91,5.83A16.56,16.56,0,0,0,90.12,2c-.2-.34-.71-.56-1.51-.67a3,3,0,0,0-1.31.48,3.08,3.08,0,0,0-.82,1.62l-3.7,13.47-.24,1c0,.1,0,.2-.05.3s0,.2,0,.28c0,.51.14.83.41,1a6.21,6.21,0,0,0,1.77.32v.77H75.72v-.77a3.31,3.31,0,0,0,1.58-.53,3.09,3.09,0,0,0,.85-1.61L81.83,4.17c.11-.38.19-.7.25-.95a3.75,3.75,0,0,0,.08-.69c0-.5-.15-.82-.43-1A6.49,6.49,0,0,0,80,1.26V.48H97.22v.78a4.92,4.92,0,0,0-1.57.18,1,1,0,0,0-.73,1.05,2.81,2.81,0,0,0,0,.29l0,.28,1.56,12,5.67-9a24.21,24.21,0,0,0,1.21-2.14,4.07,4.07,0,0,0,.54-1.68.79.79,0,0,0-.55-.82A5.69,5.69,0,0,0,102,1.26V.48h5.76v.78a3.5,3.5,0,0,0-1,.46A5.16,5.16,0,0,0,105.52,3.14Zm16.83,11.45.73.13-1.77,5.83H104.69v-.77a3.31,3.31,0,0,0,1.58-.53,3,3,0,0,0,.85-1.61l3.69-13.47c.08-.34.16-.65.22-.93a4,4,0,0,0,.08-.71c0-.5-.13-.82-.4-1a6.34,6.34,0,0,0-1.78-.31V.48h16.16l-1.28,5.7-.8-.13A5.43,5.43,0,0,0,122.3,3q-1.14-1.54-4.64-1.54a2.67,2.67,0,0,0-1.53.29,2.16,2.16,0,0,0-.57,1.07l-1.78,6.67a12.53,12.53,0,0,0,4.08-.51,5.91,5.91,0,0,0,2.06-2.66l.83.11-2.22,8.2-.82-.15c0-.28.06-.53.08-.74s0-.38,0-.52a2.45,2.45,0,0,0-.88-2.18,6.9,6.9,0,0,0-3.44-.58l-2,7.32c-.05.18-.08.35-.11.51a3.58,3.58,0,0,0,0,.4.81.81,0,0,0,.32.67,2.28,2.28,0,0,0,1.35.26,12.62,12.62,0,0,0,4.65-.76A9,9,0,0,0,122.35,14.59ZM142.94,2.75Q140.63.48,136.21.48h-8.7v.78a6.66,6.66,0,0,1,1.77.31q.42.21.42,1a2.91,2.91,0,0,1-.08.68q-.08.39-.24,1L125.7,17.62a2.93,2.93,0,0,1-1,1.75,3.54,3.54,0,0,1-1.39.41v.77h8.61a13.5,13.5,0,0,0,10-3.76,10.84,10.84,0,0,0,3.41-8A8.14,8.14,0,0,0,142.94,2.75ZM139.38,14q-2.38,5.51-7.74,5.5a2.35,2.35,0,0,1-1.29-.26,1,1,0,0,1-.36-.85,1.78,1.78,0,0,1,0-.31,2.08,2.08,0,0,1,.08-.39l4.13-15.15a1.76,1.76,0,0,1,.49-.84A2,2,0,0,1,136,1.42a4.32,4.32,0,0,1,4.07,2A7.17,7.17,0,0,1,140.83,7,17.49,17.49,0,0,1,139.38,14Z',
                        opacity: 1, strokeColor: '', fillColor: '#192760', width: 127.70402, height: 55.84601, stampFillColor: '#dce3ef', stampStrokeColor: '',
                    };
                }
                break;
            case 'Approved':
                {
                    stampCollection = {
                        iconName: 'Approved',
                        // tslint:disable-next-line:max-line-length
                        pathdata: 'M19,20.22H10.55v-.71a4.26,4.26,0,0,0,1.79-.41,1.37,1.37,0,0,0,.53-1.29c0-.22,0-.75-.16-1.58,0-.17-.11-.89-.29-2.15H6.06l-1.72,3a4,4,0,0,0-.31.66,2,2,0,0,0-.14.69c0,.41.12.67.37.78a5.42,5.42,0,0,0,1.53.3v.71H0v-.71A4,4,0,0,0,1.21,19a5.68,5.68,0,0,0,1.28-1.56L13.45.07h.76L17,17a4.35,4.35,0,0,0,.7,2.08,2.4,2.4,0,0,0,1.31.44Zm-6.83-7.31L11.13,5.73,6.76,12.91Zm7.18,6.52a3,3,0,0,0,1.33-.49,3,3,0,0,0,.84-1.59L25.19,4.11c.07-.3.14-.6.2-.9a3.14,3.14,0,0,0,.1-.72,1,1,0,0,0-.58-1,5.68,5.68,0,0,0-1.57-.23V.48h8.47a9.68,9.68,0,0,1,3.57.57,4,4,0,0,1,2.71,4,4.93,4.93,0,0,1-2.2,4.22,9.53,9.53,0,0,1-5.69,1.58l-.85,0-1.71-.11L26,16.6l-.25,1a1,1,0,0,0-.05.3,2.83,2.83,0,0,0,0,.29c0,.5.14.81.4.94a6.31,6.31,0,0,0,1.76.31v.76H19.39Zm8.52-9.66.54.06h.48a5.81,5.81,0,0,0,2.3-.36,3.47,3.47,0,0,0,1.4-1.18,6.24,6.24,0,0,0,.86-2,8.94,8.94,0,0,0,.3-2,3.29,3.29,0,0,0-.58-2,2.3,2.3,0,0,0-2-.79,1.23,1.23,0,0,0-.93.28,2.71,2.71,0,0,0-.46,1Zm8,9.69a3.19,3.19,0,0,0,1.55-.52,3,3,0,0,0,.84-1.59L42,4.11c.07-.3.14-.6.2-.9a3.14,3.14,0,0,0,.1-.72,1,1,0,0,0-.58-1,5.68,5.68,0,0,0-1.57-.23V.48h8.47a9.68,9.68,0,0,1,3.57.57,4,4,0,0,1,2.71,4,4.93,4.93,0,0,1-2.2,4.22A9.53,9.53,0,0,1,47,10.87l-.85,0-1.71-.11L42.79,16.6l-.25,1a1.45,1.45,0,0,0,0,.3,2.83,2.83,0,0,0,0,.29c0,.5.14.81.4.94a6.31,6.31,0,0,0,1.76.31v.76h-8.7Zm8.74-9.69.54.06h.48A5.81,5.81,0,0,0,48,9.48a3.41,3.41,0,0,0,1.4-1.18,6.24,6.24,0,0,0,.86-2,9,9,0,0,0,.31-2,3.29,3.29,0,0,0-.59-2,2.3,2.3,0,0,0-2-.79,1.23,1.23,0,0,0-.93.28,2.88,2.88,0,0,0-.46,1Zm7.95,9.69a3.27,3.27,0,0,0,1.56-.52A3.06,3.06,0,0,0,55,17.35L58.64,4.11l.18-.71a4.72,4.72,0,0,0,.13-1c0-.47-.13-.77-.4-.9a6.74,6.74,0,0,0-1.74-.3V.48h8.11A13,13,0,0,1,69.14,1a3.7,3.7,0,0,1,2.74,3.75,4.8,4.8,0,0,1-.46,2,5,5,0,0,1-1.54,1.9,6.55,6.55,0,0,1-1.79,1,19.35,19.35,0,0,1-1.89.52c.1.3.16.49.2.57l2.27,6.66a3.49,3.49,0,0,0,1,1.7,3.08,3.08,0,0,0,1.6.41v.76H65.33l-3.19-9.76h-.83L59.57,16.6l-.25,1a1.87,1.87,0,0,0,0,.25,2.64,2.64,0,0,0,0,.28q0,.8.39,1a5.88,5.88,0,0,0,1.76.32v.76H52.62ZM63.94,9.3a3.79,3.79,0,0,0,2.11-1.13A6,6,0,0,0,67,6.55a5.84,5.84,0,0,0,.44-2.26,3.31,3.31,0,0,0-.61-2,2.47,2.47,0,0,0-2.09-.81,1.25,1.25,0,0,0-.88.26,2.34,2.34,0,0,0-.47,1.05L61.59,9.5A13.42,13.42,0,0,0,63.94,9.3ZM76.39,4.53Q80.26,0,85,0a7.34,7.34,0,0,1,5.23,1.92,6.76,6.76,0,0,1,2,5.19,13.9,13.9,0,0,1-3.62,9.07q-3.86,4.61-8.88,4.6a7.06,7.06,0,0,1-5.13-1.92,6.86,6.86,0,0,1-2-5.14A14,14,0,0,1,76.39,4.53ZM77.3,18a2.56,2.56,0,0,0,2.57,1.78A4.62,4.62,0,0,0,83,18.47,14.42,14.42,0,0,0,86,13.54a27.18,27.18,0,0,0,1.52-4.83,20.67,20.67,0,0,0,.54-4.11,4.38,4.38,0,0,0-.73-2.55A2.62,2.62,0,0,0,85,1q-3.68,0-6.19,6.54a24.29,24.29,0,0,0-1.9,8.26A5.91,5.91,0,0,0,77.3,18ZM102.23.48v.76a5.19,5.19,0,0,0-1.55.17,1,1,0,0,0-.72,1,2.46,2.46,0,0,0,0,.28L100,3l1.52,11.76L107.11,6c.44-.71.84-1.41,1.2-2.11a4.06,4.06,0,0,0,.53-1.66.79.79,0,0,0-.55-.81,6.11,6.11,0,0,0-1.35-.14V.48h5.67v.76a3.31,3.31,0,0,0-1,.45,5.33,5.33,0,0,0-1.18,1.4L99.26,20.78h-.94l-2.25-15A15.49,15.49,0,0,0,95.24,2c-.22-.39-.84-.62-1.83-.71V.48Zm7.35,19a3.19,3.19,0,0,0,1.55-.52,3,3,0,0,0,.84-1.59l3.62-13.24c.09-.34.16-.64.22-.92a3.27,3.27,0,0,0,.09-.7c0-.5-.14-.81-.4-.94a6.13,6.13,0,0,0-1.75-.31V.48h15.89l-1.25,5.6L127.6,6a5.32,5.32,0,0,0-.7-3q-1.12-1.52-4.56-1.51a2.61,2.61,0,0,0-1.51.28,2.12,2.12,0,0,0-.56,1.06L118.52,9.3a12.1,12.1,0,0,0,4-.51,5.8,5.8,0,0,0,2-2.61l.82.1-2.19,8.07-.81-.14c0-.28.07-.52.08-.73s0-.37,0-.51a2.4,2.4,0,0,0-.87-2.15,6.76,6.76,0,0,0-3.38-.57l-1.94,7.2a3.34,3.34,0,0,0-.11.51,3.67,3.67,0,0,0,0,.39.81.81,0,0,0,.32.66,2.3,2.3,0,0,0,1.33.26,12.39,12.39,0,0,0,4.57-.75A8.84,8.84,0,0,0,127,14.35l.72.13-1.74,5.74H109.58Zm18.27,0a3.27,3.27,0,0,0,1.37-.41,2.85,2.85,0,0,0,1-1.71l3.63-13.23c.1-.38.18-.69.23-1a3,3,0,0,0,.09-.67c0-.5-.15-.81-.42-.94A6.38,6.38,0,0,0,132,1.24V.48h8.57c2.9,0,5.1.74,6.62,2.22a8,8,0,0,1,2.26,6,10.72,10.72,0,0,1-3.35,7.84,13.3,13.3,0,0,1-9.8,3.7h-8.47ZM144.4,3.39a4.23,4.23,0,0,0-4-2,2,2,0,0,0-1.29.31,1.74,1.74,0,0,0-.48.83l-4.07,14.9a3.24,3.24,0,0,0-.07.39,1.69,1.69,0,0,0,0,.3,1,1,0,0,0,.36.84,2.27,2.27,0,0,0,1.27.26q5.26,0,7.62-5.42a17.25,17.25,0,0,0,1.43-6.94A7,7,0,0,0,144.4,3.39Z',
                        opacity: 1, strokeColor: '', fillColor: '#516c30', width: 127.70402, height: 55.84601, stampFillColor: '#e6eddf', stampStrokeColor: '',
                    };
                }
                break;
            case 'Confidential':
                {
                    stampCollection = {
                        iconName: 'Confidential',
                        // tslint:disable-next-line:max-line-length
                        pathdata: 'M13.71,0,12.63,6.9,12,6.73c0-.41,0-.66,0-.73s0-.18,0-.32a6.16,6.16,0,0,0-.79-3.47,2.37,2.37,0,0,0-2-1.14c-1.64,0-3.07,1.51-4.29,4.55a22,22,0,0,0-1.64,8.29c0,2,.34,3.44,1,4.2A3,3,0,0,0,6.5,19.24a4.08,4.08,0,0,0,2.93-1.43,10.47,10.47,0,0,0,1.5-2.09l.64.65A8.84,8.84,0,0,1,9,19.72a5.24,5.24,0,0,1-3.08,1.09,5.16,5.16,0,0,1-4.21-2.08A8.68,8.68,0,0,1,0,13.16,16.5,16.5,0,0,1,2.55,3.92Q5.1,0,8.61,0a6.35,6.35,0,0,1,2.25.43,6.62,6.62,0,0,0,1.38.43.55.55,0,0,0,.5-.23A2.61,2.61,0,0,0,13.06,0ZM27.49,7.11a17.19,17.19,0,0,1-2.61,9.07q-2.77,4.61-6.39,4.6a4.42,4.42,0,0,1-3.7-1.92,8.47,8.47,0,0,1-1.43-5.14A17.31,17.31,0,0,1,16,4.53C17.88,1.51,20,0,22.25,0A4.53,4.53,0,0,1,26,1.92,8.27,8.27,0,0,1,27.49,7.11ZM24.42,4.6a5.71,5.71,0,0,0-.53-2.55A1.76,1.76,0,0,0,22.24,1q-2.65,0-4.45,6.54a31.93,31.93,0,0,0-1.37,8.26A8.15,8.15,0,0,0,16.67,18c.34,1.19,1,1.78,1.85,1.78a2.9,2.9,0,0,0,2.28-1.29,15.85,15.85,0,0,0,2.13-4.93A34.08,34.08,0,0,0,24,8.71,28.5,28.5,0,0,0,24.42,4.6ZM42.75,1.3l.3-.06V.48H38.69v.76a2.55,2.55,0,0,1,1.16.33,1.8,1.8,0,0,1,.51,1.48,10.11,10.11,0,0,1-.13,1.34c-.06.41-.14.87-.24,1.39l-1.65,8.34L33.73.48H29.45v.76a2.66,2.66,0,0,1,1,.24,1.88,1.88,0,0,1,.65,1.06l.09.3L28.81,15a20.72,20.72,0,0,1-1,3.61,1.61,1.61,0,0,1-1.19.9v.76h4.42v-.76a2.55,2.55,0,0,1-1.13-.32,1.67,1.67,0,0,1-.56-1.44,7.13,7.13,0,0,1,.05-.79c.06-.43.17-1.09.34-2L31.89,4.38l5.52,16.33h.52l3-15a22.58,22.58,0,0,1,.87-3.42A1.42,1.42,0,0,1,42.75,1.3ZM55.53.48H44.23v.76a3.63,3.63,0,0,1,1.26.3c.19.13.29.42.29.9a7.08,7.08,0,0,1-.09,1c0,.2-.08.44-.13.71L43,17.34a3.47,3.47,0,0,1-.59,1.58,1.91,1.91,0,0,1-1.13.54v.76h6.29v-.76a2.13,2.13,0,0,1-1-.19A1.23,1.23,0,0,1,46,18.1c0-.1,0-.21,0-.31s0-.23.05-.35l1.4-7.21a3.15,3.15,0,0,1,2.37.64A3.21,3.21,0,0,1,50.38,13c0,.11,0,.28,0,.49s0,.46-.06.75l.58.14,1.58-8.07-.59-.1a5.79,5.79,0,0,1-1.43,2.59,6.17,6.17,0,0,1-2.77.52l1.26-6.54a2.06,2.06,0,0,1,.42-1.08,1.39,1.39,0,0,1,1-.26c1.62,0,2.7.51,3.24,1.54a7.11,7.11,0,0,1,.49,3l.57.13Zm3.69,17.71c0-.08,0-.17,0-.27s0-.2,0-.3l.17-1L62.06,3.36a3.44,3.44,0,0,1,.59-1.6,2,2,0,0,1,1.12-.52V.48H57.44v.76a3.47,3.47,0,0,1,1.26.31c.2.13.3.44.3.94a4.25,4.25,0,0,1-.06.67c0,.26-.09.57-.17,1L56.16,17.35a3.52,3.52,0,0,1-.6,1.59,2,2,0,0,1-1.12.52v.76h6.33v-.76a3.3,3.3,0,0,1-1.26-.32C59.32,19,59.22,18.69,59.22,18.19Zm18-9.51a13,13,0,0,1-2.42,7.84,8.31,8.31,0,0,1-7,3.7H61.6v-.76a2,2,0,0,0,1-.41,3.14,3.14,0,0,0,.73-1.71L65.93,4.11c.08-.38.13-.69.17-1a4.36,4.36,0,0,0,.06-.67c0-.5-.1-.81-.3-.94a3.47,3.47,0,0,0-1.26-.31V.48h6.17A5.52,5.52,0,0,1,75.53,2.7,9.91,9.91,0,0,1,77.17,8.68ZM74,6.87a9.22,9.22,0,0,0-.53-3.48,2.91,2.91,0,0,0-2.87-2,1.12,1.12,0,0,0-.93.31,1.81,1.81,0,0,0-.35.83l-2.93,14.9a3,3,0,0,0-.05.39c0,.11,0,.21,0,.3a1.17,1.17,0,0,0,.25.84,1.3,1.3,0,0,0,.92.26q3.8,0,5.49-5.42A23.26,23.26,0,0,0,74,6.87Zm11.3,11.65a6.72,6.72,0,0,1-3.29.75,1.3,1.3,0,0,1-1-.26,1,1,0,0,1-.23-.66,3.28,3.28,0,0,1,0-.39,4.88,4.88,0,0,1,.08-.51l1.4-7.2a3.73,3.73,0,0,1,2.43.57A2.87,2.87,0,0,1,85.43,13c0,.14,0,.31,0,.51s0,.45-.06.73l.59.14,1.57-8.07-.59-.1a5.79,5.79,0,0,1-1.46,2.61,6.5,6.5,0,0,1-2.89.51l1.26-6.56a2.41,2.41,0,0,1,.41-1.06c.16-.19.52-.28,1.08-.28,1.65,0,2.75.5,3.29,1.51a7,7,0,0,1,.5,3l.57.13.9-5.6H79.14v.76a3.35,3.35,0,0,1,1.26.31c.19.13.29.44.29.94a5,5,0,0,1-.07.7c0,.28-.09.58-.15.92L77.86,17.35a3.52,3.52,0,0,1-.6,1.59,2,2,0,0,1-1.13.52v.76H87.91l1.25-5.74-.52-.13A7.69,7.69,0,0,1,85.34,18.52ZM105.8,1.24V.48h-4.37v.76a2.55,2.55,0,0,1,1.16.33,1.77,1.77,0,0,1,.52,1.48A10.58,10.58,0,0,1,103,4.39c-.06.41-.13.87-.23,1.39l-1.66,8.34L96.47.48H92.19v.76a2.61,2.61,0,0,1,1,.24,1.83,1.83,0,0,1,.65,1.06l.1.3L91.55,15a19,19,0,0,1-1,3.61,1.61,1.61,0,0,1-1.19.9v.76h4.42v-.76a2.59,2.59,0,0,1-1.13-.32,1.67,1.67,0,0,1-.56-1.44,7.13,7.13,0,0,1,0-.79c.06-.43.17-1.09.35-2L94.63,4.38l5.52,16.33h.53l2.95-15a22.93,22.93,0,0,1,.86-3.42,1.42,1.42,0,0,1,1-1Zm11.4,4.9L118,.48H106.28l-.82,5,.55.2a8,8,0,0,1,1.87-3.16,3.7,3.7,0,0,1,2.7-1.06l-3.12,15.85a2.94,2.94,0,0,1-.87,1.85,2.48,2.48,0,0,1-1.34.26v.76h7v-.76a4.24,4.24,0,0,1-1.43-.3c-.23-.13-.34-.45-.34-.95a2.26,2.26,0,0,1,0-.26c0-.09,0-.2,0-.33l.18-1,3-15.1a2.73,2.73,0,0,1,1.79.63c.75.7,1.13,2,1.17,3.94Zm3.57,12.05c0-.08,0-.17,0-.27s0-.2,0-.3l.17-1,2.62-13.24a3.44,3.44,0,0,1,.59-1.6,2,2,0,0,1,1.12-.52V.48H119v.76a3.47,3.47,0,0,1,1.26.31c.2.13.3.44.3.94a4.25,4.25,0,0,1-.06.67c0,.26-.09.57-.17,1l-2.61,13.24a3.52,3.52,0,0,1-.6,1.59,2,2,0,0,1-1.12.52v.76h6.33v-.76a3.36,3.36,0,0,1-1.26-.32C120.87,19,120.77,18.69,120.77,18.19Zm28.86-3.71-1.24,5.74H130.3v-.71a2.48,2.48,0,0,0,1.3-.41,1.64,1.64,0,0,0,.37-1.29c0-.22,0-.75-.11-1.58,0-.17-.08-.89-.21-2.15h-4.58l-1.24,3a5.1,5.1,0,0,0-.22.66,2.45,2.45,0,0,0-.1.69c0,.41.09.67.26.78a3.05,3.05,0,0,0,1.11.3v.71h-4.17v-.71a2.66,2.66,0,0,0,.87-.53,5.79,5.79,0,0,0,.92-1.56L132.39.07h.55L135,17a5.53,5.53,0,0,0,.5,2.08,1.67,1.67,0,0,0,1.14.46v0a1.93,1.93,0,0,0,1.12-.52,3.52,3.52,0,0,0,.6-1.6l2.61-13.23c.08-.38.13-.69.17-1a4.36,4.36,0,0,0,.06-.67c0-.5-.1-.81-.3-.94a3.47,3.47,0,0,0-1.26-.31V.48h6.73v.76a3.23,3.23,0,0,0-1.49.48,3.06,3.06,0,0,0-.64,1.64l-2.77,14.08c0,.16-.05.3-.07.44s0,.29,0,.47a.79.79,0,0,0,.31.71,1.55,1.55,0,0,0,.87.21,6.83,6.83,0,0,0,3.79-1,8.42,8.42,0,0,0,2.81-3.88ZM131.5,12.91l-.78-7.18-3.14,7.18Z',
                        opacity: 1, strokeColor: '', fillColor: '#192760', width: 127.70402, height: 55.84601, stampFillColor: '#dce3ef', stampStrokeColor: '',
                    };
                }
                break;
        }
        stampCollection.modifiedDate = new Date().toLocaleString();
        this.currentStampAnnotation = stampCollection;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public retrievestampAnnotation(icontype: any): any {
        let stampCollection: IstampCollection;
        switch (icontype.trim()) {
            // tslint:disable-next-line
            case 'Approved': {
                stampCollection = {
                    iconName: 'Approved',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M19,20.22H10.55v-.71a4.26,4.26,0,0,0,1.79-.41,1.37,1.37,0,0,0,.53-1.29c0-.22,0-.75-.16-1.58,0-.17-.11-.89-.29-2.15H6.06l-1.72,3a4,4,0,0,0-.31.66,2,2,0,0,0-.14.69c0,.41.12.67.37.78a5.42,5.42,0,0,0,1.53.3v.71H0v-.71A4,4,0,0,0,1.21,19a5.68,5.68,0,0,0,1.28-1.56L13.45.07h.76L17,17a4.35,4.35,0,0,0,.7,2.08,2.4,2.4,0,0,0,1.31.44Zm-6.83-7.31L11.13,5.73,6.76,12.91Zm7.18,6.52a3,3,0,0,0,1.33-.49,3,3,0,0,0,.84-1.59L25.19,4.11c.07-.3.14-.6.2-.9a3.14,3.14,0,0,0,.1-.72,1,1,0,0,0-.58-1,5.68,5.68,0,0,0-1.57-.23V.48h8.47a9.68,9.68,0,0,1,3.57.57,4,4,0,0,1,2.71,4,4.93,4.93,0,0,1-2.2,4.22,9.53,9.53,0,0,1-5.69,1.58l-.85,0-1.71-.11L26,16.6l-.25,1a1,1,0,0,0-.05.3,2.83,2.83,0,0,0,0,.29c0,.5.14.81.4.94a6.31,6.31,0,0,0,1.76.31v.76H19.39Zm8.52-9.66.54.06h.48a5.81,5.81,0,0,0,2.3-.36,3.47,3.47,0,0,0,1.4-1.18,6.24,6.24,0,0,0,.86-2,8.94,8.94,0,0,0,.3-2,3.29,3.29,0,0,0-.58-2,2.3,2.3,0,0,0-2-.79,1.23,1.23,0,0,0-.93.28,2.71,2.71,0,0,0-.46,1Zm8,9.69a3.19,3.19,0,0,0,1.55-.52,3,3,0,0,0,.84-1.59L42,4.11c.07-.3.14-.6.2-.9a3.14,3.14,0,0,0,.1-.72,1,1,0,0,0-.58-1,5.68,5.68,0,0,0-1.57-.23V.48h8.47a9.68,9.68,0,0,1,3.57.57,4,4,0,0,1,2.71,4,4.93,4.93,0,0,1-2.2,4.22A9.53,9.53,0,0,1,47,10.87l-.85,0-1.71-.11L42.79,16.6l-.25,1a1.45,1.45,0,0,0,0,.3,2.83,2.83,0,0,0,0,.29c0,.5.14.81.4.94a6.31,6.31,0,0,0,1.76.31v.76h-8.7Zm8.74-9.69.54.06h.48A5.81,5.81,0,0,0,48,9.48a3.41,3.41,0,0,0,1.4-1.18,6.24,6.24,0,0,0,.86-2,9,9,0,0,0,.31-2,3.29,3.29,0,0,0-.59-2,2.3,2.3,0,0,0-2-.79,1.23,1.23,0,0,0-.93.28,2.88,2.88,0,0,0-.46,1Zm7.95,9.69a3.27,3.27,0,0,0,1.56-.52A3.06,3.06,0,0,0,55,17.35L58.64,4.11l.18-.71a4.72,4.72,0,0,0,.13-1c0-.47-.13-.77-.4-.9a6.74,6.74,0,0,0-1.74-.3V.48h8.11A13,13,0,0,1,69.14,1a3.7,3.7,0,0,1,2.74,3.75,4.8,4.8,0,0,1-.46,2,5,5,0,0,1-1.54,1.9,6.55,6.55,0,0,1-1.79,1,19.35,19.35,0,0,1-1.89.52c.1.3.16.49.2.57l2.27,6.66a3.49,3.49,0,0,0,1,1.7,3.08,3.08,0,0,0,1.6.41v.76H65.33l-3.19-9.76h-.83L59.57,16.6l-.25,1a1.87,1.87,0,0,0,0,.25,2.64,2.64,0,0,0,0,.28q0,.8.39,1a5.88,5.88,0,0,0,1.76.32v.76H52.62ZM63.94,9.3a3.79,3.79,0,0,0,2.11-1.13A6,6,0,0,0,67,6.55a5.84,5.84,0,0,0,.44-2.26,3.31,3.31,0,0,0-.61-2,2.47,2.47,0,0,0-2.09-.81,1.25,1.25,0,0,0-.88.26,2.34,2.34,0,0,0-.47,1.05L61.59,9.5A13.42,13.42,0,0,0,63.94,9.3ZM76.39,4.53Q80.26,0,85,0a7.34,7.34,0,0,1,5.23,1.92,6.76,6.76,0,0,1,2,5.19,13.9,13.9,0,0,1-3.62,9.07q-3.86,4.61-8.88,4.6a7.06,7.06,0,0,1-5.13-1.92,6.86,6.86,0,0,1-2-5.14A14,14,0,0,1,76.39,4.53ZM77.3,18a2.56,2.56,0,0,0,2.57,1.78A4.62,4.62,0,0,0,83,18.47,14.42,14.42,0,0,0,86,13.54a27.18,27.18,0,0,0,1.52-4.83,20.67,20.67,0,0,0,.54-4.11,4.38,4.38,0,0,0-.73-2.55A2.62,2.62,0,0,0,85,1q-3.68,0-6.19,6.54a24.29,24.29,0,0,0-1.9,8.26A5.91,5.91,0,0,0,77.3,18ZM102.23.48v.76a5.19,5.19,0,0,0-1.55.17,1,1,0,0,0-.72,1,2.46,2.46,0,0,0,0,.28L100,3l1.52,11.76L107.11,6c.44-.71.84-1.41,1.2-2.11a4.06,4.06,0,0,0,.53-1.66.79.79,0,0,0-.55-.81,6.11,6.11,0,0,0-1.35-.14V.48h5.67v.76a3.31,3.31,0,0,0-1,.45,5.33,5.33,0,0,0-1.18,1.4L99.26,20.78h-.94l-2.25-15A15.49,15.49,0,0,0,95.24,2c-.22-.39-.84-.62-1.83-.71V.48Zm7.35,19a3.19,3.19,0,0,0,1.55-.52,3,3,0,0,0,.84-1.59l3.62-13.24c.09-.34.16-.64.22-.92a3.27,3.27,0,0,0,.09-.7c0-.5-.14-.81-.4-.94a6.13,6.13,0,0,0-1.75-.31V.48h15.89l-1.25,5.6L127.6,6a5.32,5.32,0,0,0-.7-3q-1.12-1.52-4.56-1.51a2.61,2.61,0,0,0-1.51.28,2.12,2.12,0,0,0-.56,1.06L118.52,9.3a12.1,12.1,0,0,0,4-.51,5.8,5.8,0,0,0,2-2.61l.82.1-2.19,8.07-.81-.14c0-.28.07-.52.08-.73s0-.37,0-.51a2.4,2.4,0,0,0-.87-2.15,6.76,6.76,0,0,0-3.38-.57l-1.94,7.2a3.34,3.34,0,0,0-.11.51,3.67,3.67,0,0,0,0,.39.81.81,0,0,0,.32.66,2.3,2.3,0,0,0,1.33.26,12.39,12.39,0,0,0,4.57-.75A8.84,8.84,0,0,0,127,14.35l.72.13-1.74,5.74H109.58Zm18.27,0a3.27,3.27,0,0,0,1.37-.41,2.85,2.85,0,0,0,1-1.71l3.63-13.23c.1-.38.18-.69.23-1a3,3,0,0,0,.09-.67c0-.5-.15-.81-.42-.94A6.38,6.38,0,0,0,132,1.24V.48h8.57c2.9,0,5.1.74,6.62,2.22a8,8,0,0,1,2.26,6,10.72,10.72,0,0,1-3.35,7.84,13.3,13.3,0,0,1-9.8,3.7h-8.47ZM144.4,3.39a4.23,4.23,0,0,0-4-2,2,2,0,0,0-1.29.31,1.74,1.74,0,0,0-.48.83l-4.07,14.9a3.24,3.24,0,0,0-.07.39,1.69,1.69,0,0,0,0,.3,1,1,0,0,0,.36.84,2.27,2.27,0,0,0,1.27.26q5.26,0,7.62-5.42a17.25,17.25,0,0,0,1.43-6.94A7,7,0,0,0,144.4,3.39Z',
                    opacity: 1, strokeColor: '', fillColor: '#516c30', width: 149.474, height: 20.783, stampFillColor: '#e6eddf', stampStrokeColor: '',
                };
            }
                break;

            case 'Confidential': {
                stampCollection = {
                    iconName: 'Confidential',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M13.71,0,12.63,6.9,12,6.73c0-.41,0-.66,0-.73s0-.18,0-.32a6.16,6.16,0,0,0-.79-3.47,2.37,2.37,0,0,0-2-1.14c-1.64,0-3.07,1.51-4.29,4.55a22,22,0,0,0-1.64,8.29c0,2,.34,3.44,1,4.2A3,3,0,0,0,6.5,19.24a4.08,4.08,0,0,0,2.93-1.43,10.47,10.47,0,0,0,1.5-2.09l.64.65A8.84,8.84,0,0,1,9,19.72a5.24,5.24,0,0,1-3.08,1.09,5.16,5.16,0,0,1-4.21-2.08A8.68,8.68,0,0,1,0,13.16,16.5,16.5,0,0,1,2.55,3.92Q5.1,0,8.61,0a6.35,6.35,0,0,1,2.25.43,6.62,6.62,0,0,0,1.38.43.55.55,0,0,0,.5-.23A2.61,2.61,0,0,0,13.06,0ZM27.49,7.11a17.19,17.19,0,0,1-2.61,9.07q-2.77,4.61-6.39,4.6a4.42,4.42,0,0,1-3.7-1.92,8.47,8.47,0,0,1-1.43-5.14A17.31,17.31,0,0,1,16,4.53C17.88,1.51,20,0,22.25,0A4.53,4.53,0,0,1,26,1.92,8.27,8.27,0,0,1,27.49,7.11ZM24.42,4.6a5.71,5.71,0,0,0-.53-2.55A1.76,1.76,0,0,0,22.24,1q-2.65,0-4.45,6.54a31.93,31.93,0,0,0-1.37,8.26A8.15,8.15,0,0,0,16.67,18c.34,1.19,1,1.78,1.85,1.78a2.9,2.9,0,0,0,2.28-1.29,15.85,15.85,0,0,0,2.13-4.93A34.08,34.08,0,0,0,24,8.71,28.5,28.5,0,0,0,24.42,4.6ZM42.75,1.3l.3-.06V.48H38.69v.76a2.55,2.55,0,0,1,1.16.33,1.8,1.8,0,0,1,.51,1.48,10.11,10.11,0,0,1-.13,1.34c-.06.41-.14.87-.24,1.39l-1.65,8.34L33.73.48H29.45v.76a2.66,2.66,0,0,1,1,.24,1.88,1.88,0,0,1,.65,1.06l.09.3L28.81,15a20.72,20.72,0,0,1-1,3.61,1.61,1.61,0,0,1-1.19.9v.76h4.42v-.76a2.55,2.55,0,0,1-1.13-.32,1.67,1.67,0,0,1-.56-1.44,7.13,7.13,0,0,1,.05-.79c.06-.43.17-1.09.34-2L31.89,4.38l5.52,16.33h.52l3-15a22.58,22.58,0,0,1,.87-3.42A1.42,1.42,0,0,1,42.75,1.3ZM55.53.48H44.23v.76a3.63,3.63,0,0,1,1.26.3c.19.13.29.42.29.9a7.08,7.08,0,0,1-.09,1c0,.2-.08.44-.13.71L43,17.34a3.47,3.47,0,0,1-.59,1.58,1.91,1.91,0,0,1-1.13.54v.76h6.29v-.76a2.13,2.13,0,0,1-1-.19A1.23,1.23,0,0,1,46,18.1c0-.1,0-.21,0-.31s0-.23.05-.35l1.4-7.21a3.15,3.15,0,0,1,2.37.64A3.21,3.21,0,0,1,50.38,13c0,.11,0,.28,0,.49s0,.46-.06.75l.58.14,1.58-8.07-.59-.1a5.79,5.79,0,0,1-1.43,2.59,6.17,6.17,0,0,1-2.77.52l1.26-6.54a2.06,2.06,0,0,1,.42-1.08,1.39,1.39,0,0,1,1-.26c1.62,0,2.7.51,3.24,1.54a7.11,7.11,0,0,1,.49,3l.57.13Zm3.69,17.71c0-.08,0-.17,0-.27s0-.2,0-.3l.17-1L62.06,3.36a3.44,3.44,0,0,1,.59-1.6,2,2,0,0,1,1.12-.52V.48H57.44v.76a3.47,3.47,0,0,1,1.26.31c.2.13.3.44.3.94a4.25,4.25,0,0,1-.06.67c0,.26-.09.57-.17,1L56.16,17.35a3.52,3.52,0,0,1-.6,1.59,2,2,0,0,1-1.12.52v.76h6.33v-.76a3.3,3.3,0,0,1-1.26-.32C59.32,19,59.22,18.69,59.22,18.19Zm18-9.51a13,13,0,0,1-2.42,7.84,8.31,8.31,0,0,1-7,3.7H61.6v-.76a2,2,0,0,0,1-.41,3.14,3.14,0,0,0,.73-1.71L65.93,4.11c.08-.38.13-.69.17-1a4.36,4.36,0,0,0,.06-.67c0-.5-.1-.81-.3-.94a3.47,3.47,0,0,0-1.26-.31V.48h6.17A5.52,5.52,0,0,1,75.53,2.7,9.91,9.91,0,0,1,77.17,8.68ZM74,6.87a9.22,9.22,0,0,0-.53-3.48,2.91,2.91,0,0,0-2.87-2,1.12,1.12,0,0,0-.93.31,1.81,1.81,0,0,0-.35.83l-2.93,14.9a3,3,0,0,0-.05.39c0,.11,0,.21,0,.3a1.17,1.17,0,0,0,.25.84,1.3,1.3,0,0,0,.92.26q3.8,0,5.49-5.42A23.26,23.26,0,0,0,74,6.87Zm11.3,11.65a6.72,6.72,0,0,1-3.29.75,1.3,1.3,0,0,1-1-.26,1,1,0,0,1-.23-.66,3.28,3.28,0,0,1,0-.39,4.88,4.88,0,0,1,.08-.51l1.4-7.2a3.73,3.73,0,0,1,2.43.57A2.87,2.87,0,0,1,85.43,13c0,.14,0,.31,0,.51s0,.45-.06.73l.59.14,1.57-8.07-.59-.1a5.79,5.79,0,0,1-1.46,2.61,6.5,6.5,0,0,1-2.89.51l1.26-6.56a2.41,2.41,0,0,1,.41-1.06c.16-.19.52-.28,1.08-.28,1.65,0,2.75.5,3.29,1.51a7,7,0,0,1,.5,3l.57.13.9-5.6H79.14v.76a3.35,3.35,0,0,1,1.26.31c.19.13.29.44.29.94a5,5,0,0,1-.07.7c0,.28-.09.58-.15.92L77.86,17.35a3.52,3.52,0,0,1-.6,1.59,2,2,0,0,1-1.13.52v.76H87.91l1.25-5.74-.52-.13A7.69,7.69,0,0,1,85.34,18.52ZM105.8,1.24V.48h-4.37v.76a2.55,2.55,0,0,1,1.16.33,1.77,1.77,0,0,1,.52,1.48A10.58,10.58,0,0,1,103,4.39c-.06.41-.13.87-.23,1.39l-1.66,8.34L96.47.48H92.19v.76a2.61,2.61,0,0,1,1,.24,1.83,1.83,0,0,1,.65,1.06l.1.3L91.55,15a19,19,0,0,1-1,3.61,1.61,1.61,0,0,1-1.19.9v.76h4.42v-.76a2.59,2.59,0,0,1-1.13-.32,1.67,1.67,0,0,1-.56-1.44,7.13,7.13,0,0,1,0-.79c.06-.43.17-1.09.35-2L94.63,4.38l5.52,16.33h.53l2.95-15a22.93,22.93,0,0,1,.86-3.42,1.42,1.42,0,0,1,1-1Zm11.4,4.9L118,.48H106.28l-.82,5,.55.2a8,8,0,0,1,1.87-3.16,3.7,3.7,0,0,1,2.7-1.06l-3.12,15.85a2.94,2.94,0,0,1-.87,1.85,2.48,2.48,0,0,1-1.34.26v.76h7v-.76a4.24,4.24,0,0,1-1.43-.3c-.23-.13-.34-.45-.34-.95a2.26,2.26,0,0,1,0-.26c0-.09,0-.2,0-.33l.18-1,3-15.1a2.73,2.73,0,0,1,1.79.63c.75.7,1.13,2,1.17,3.94Zm3.57,12.05c0-.08,0-.17,0-.27s0-.2,0-.3l.17-1,2.62-13.24a3.44,3.44,0,0,1,.59-1.6,2,2,0,0,1,1.12-.52V.48H119v.76a3.47,3.47,0,0,1,1.26.31c.2.13.3.44.3.94a4.25,4.25,0,0,1-.06.67c0,.26-.09.57-.17,1l-2.61,13.24a3.52,3.52,0,0,1-.6,1.59,2,2,0,0,1-1.12.52v.76h6.33v-.76a3.36,3.36,0,0,1-1.26-.32C120.87,19,120.77,18.69,120.77,18.19Zm28.86-3.71-1.24,5.74H130.3v-.71a2.48,2.48,0,0,0,1.3-.41,1.64,1.64,0,0,0,.37-1.29c0-.22,0-.75-.11-1.58,0-.17-.08-.89-.21-2.15h-4.58l-1.24,3a5.1,5.1,0,0,0-.22.66,2.45,2.45,0,0,0-.1.69c0,.41.09.67.26.78a3.05,3.05,0,0,0,1.11.3v.71h-4.17v-.71a2.66,2.66,0,0,0,.87-.53,5.79,5.79,0,0,0,.92-1.56L132.39.07h.55L135,17a5.53,5.53,0,0,0,.5,2.08,1.67,1.67,0,0,0,1.14.46v0a1.93,1.93,0,0,0,1.12-.52,3.52,3.52,0,0,0,.6-1.6l2.61-13.23c.08-.38.13-.69.17-1a4.36,4.36,0,0,0,.06-.67c0-.5-.1-.81-.3-.94a3.47,3.47,0,0,0-1.26-.31V.48h6.73v.76a3.23,3.23,0,0,0-1.49.48,3.06,3.06,0,0,0-.64,1.64l-2.77,14.08c0,.16-.05.3-.07.44s0,.29,0,.47a.79.79,0,0,0,.31.71,1.55,1.55,0,0,0,.87.21,6.83,6.83,0,0,0,3.79-1,8.42,8.42,0,0,0,2.81-3.88ZM131.5,12.91l-.78-7.18-3.14,7.18Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 149.633, height: 20.811, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Witness': {
                stampCollection = {
                    iconName: 'Witness',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M19.63,2.67,12.77,16.84h-.69L10.63,5.17,5.05,16.84H4.36L2.5,2.92A3.13,3.13,0,0,0,2,1.35,2.38,2.38,0,0,0,.63.91V.33H7.3V1a2.27,2.27,0,0,0-.92.17A1.11,1.11,0,0,0,5.84,2.2v.16c0,.05,0,.13,0,.22L6.81,11l3.57-7.48a.79.79,0,0,0,0-.23,2.78,2.78,0,0,0-.53-2A2.23,2.23,0,0,0,8.68.91V.33h6.45V.91A2.42,2.42,0,0,0,14,1.2c-.23.16-.34.5-.34,1,0,.11,0,.26,0,.46s.07.73.12,1.21l.8,7L18.3,3.11c.09-.19.17-.4.25-.62a2.11,2.11,0,0,0,.11-.65.73.73,0,0,0-.4-.76,2.73,2.73,0,0,0-1.1-.17V.33h4.47V.91a1.92,1.92,0,0,0-.91.3A3.66,3.66,0,0,0,19.63,2.67ZM29.76.33H22.62V1A5.07,5.07,0,0,1,24,1.2c.23.11.34.36.34.77a2.86,2.86,0,0,1-.06.54c0,.21-.11.47-.19.77L21.17,14.05a2.47,2.47,0,0,1-.68,1.29,2.62,2.62,0,0,1-1.27.42v.62h7.15v-.62A5.09,5.09,0,0,1,25,15.51c-.22-.11-.33-.37-.33-.77a2,2,0,0,1,0-.23c0-.08,0-.16,0-.24l.19-.83,3-10.77a2.5,2.5,0,0,1,.66-1.3A2.76,2.76,0,0,1,29.76,1ZM41.9,4.88l.63,0,.86-4.6H30.2l-.93,4.1.62.16A6.6,6.6,0,0,1,32,2a5.22,5.22,0,0,1,3.06-.86L31.53,14.05a2.24,2.24,0,0,1-1,1.5,3.67,3.67,0,0,1-1.51.21v.62H37v-.62a6,6,0,0,1-1.62-.24c-.26-.1-.39-.36-.39-.77,0-.07,0-.14,0-.21s0-.16.05-.27l.2-.83L38.57,1.16a3.76,3.76,0,0,1,2,.52A3.69,3.69,0,0,1,41.9,4.88ZM59.24,1,59.58,1V.33H54.65V1A3.78,3.78,0,0,1,56,1.22a1.25,1.25,0,0,1,.58,1.2,6.26,6.26,0,0,1-.15,1.09c-.07.33-.16.71-.27,1.13l-1.87,6.79L49.05.33H44.21V1a3.51,3.51,0,0,1,1.13.2,1.51,1.51,0,0,1,.74.85l.1.25L43.49,12.1A13.5,13.5,0,0,1,42.4,15a1.87,1.87,0,0,1-1.35.72v.62h5v-.62a3.62,3.62,0,0,1-1.28-.26,1.19,1.19,0,0,1-.64-1.17,3.55,3.55,0,0,1,.06-.64q.11-.53.39-1.59L47,3.5,53.2,16.78h.59L57.13,4.6a15.29,15.29,0,0,1,1-2.78A1.51,1.51,0,0,1,59.24,1Zm7.26.31a2.11,2.11,0,0,1,1.23-.23c1.87,0,3.1.41,3.71,1.23A4.39,4.39,0,0,1,72,4.78l.64.11,1-4.56H60.75V1a5,5,0,0,1,1.42.25c.22.11.32.36.32.77a2.73,2.73,0,0,1-.07.57c0,.22-.1.47-.17.74l-3,10.77a2.47,2.47,0,0,1-.68,1.29,2.62,2.62,0,0,1-1.27.42v.62h13.3l1.42-4.66-.59-.11A7.1,7.1,0,0,1,67.75,15a10,10,0,0,1-3.72.61A1.86,1.86,0,0,1,63,15.4a.67.67,0,0,1-.26-.54,2.36,2.36,0,0,1,0-.32,3.38,3.38,0,0,1,.09-.41l1.58-5.86a5.48,5.48,0,0,1,2.75.47,2,2,0,0,1,.71,1.75c0,.11,0,.25,0,.41s0,.37-.06.6l.65.11L70.2,5.05,69.54,5a4.69,4.69,0,0,1-1.65,2.12,10.06,10.06,0,0,1-3.26.41l1.42-5.33A1.75,1.75,0,0,1,66.5,1.31ZM80.88.83a2.77,2.77,0,0,1,2.46,1.26A4.36,4.36,0,0,1,84,4l.08.78.62.08,1-4.8H85a1.77,1.77,0,0,1-.38.43A1,1,0,0,1,84,.67a2.76,2.76,0,0,1-.37,0l-.41-.1-.61-.2a4.78,4.78,0,0,0-.79-.2A6.71,6.71,0,0,0,80.46,0a4.76,4.76,0,0,0-3.62,1.36,4.61,4.61,0,0,0-1.29,3.29q0,2.05,2.94,4.47t2.94,3.82a3.19,3.19,0,0,1-.79,2.14,2.8,2.8,0,0,1-2.23.92,3.43,3.43,0,0,1-1.5-.33,3.82,3.82,0,0,1-2-2.5,10.33,10.33,0,0,1-.2-1.67L74,11.45l-.87,5.38h.73a2.85,2.85,0,0,1,.38-.67A.75.75,0,0,1,74.8,16a1.12,1.12,0,0,1,.27,0l.42.15.61.22a8.62,8.62,0,0,0,1.3.35,7.53,7.53,0,0,0,1.32.12,5.48,5.48,0,0,0,4.11-1.53,4.77,4.77,0,0,0,1.49-3.43,4.59,4.59,0,0,0-.77-2.63,9.31,9.31,0,0,0-1.87-2L79.61,5.5a4.31,4.31,0,0,1-.74-.77,2.55,2.55,0,0,1-.43-1.45,2.68,2.68,0,0,1,.42-1.44A2.23,2.23,0,0,1,80.88.83Zm12.31,0a2.8,2.8,0,0,1,2.47,1.26A4.49,4.49,0,0,1,96.35,4l.08.78.62.08,1-4.8h-.71a1.62,1.62,0,0,1-.39.43,1,1,0,0,1-.64.18,2.9,2.9,0,0,1-.38,0l-.41-.1-.61-.2a4.65,4.65,0,0,0-.78-.2A6.88,6.88,0,0,0,92.77,0a4.73,4.73,0,0,0-3.61,1.36,4.57,4.57,0,0,0-1.3,3.29q0,2.05,2.94,4.47c2,1.54,3,2.81,3,3.82a3.2,3.2,0,0,1-.8,2.14,2.78,2.78,0,0,1-2.23.92,3.36,3.36,0,0,1-1.49-.33A3.68,3.68,0,0,1,88,14.73a3.76,3.76,0,0,1-.81-1.56A10.6,10.6,0,0,1,87,11.5l-.7-.05-.86,5.38h.72a2.85,2.85,0,0,1,.38-.67.78.78,0,0,1,.57-.19,1.12,1.12,0,0,1,.27,0l.42.15.61.22a8.74,8.74,0,0,0,1.31.35,7.37,7.37,0,0,0,1.32.12,5.49,5.49,0,0,0,4.11-1.53,4.81,4.81,0,0,0,1.49-3.43,4.67,4.67,0,0,0-.77-2.63A9.57,9.57,0,0,0,94,7.2L91.93,5.5a4,4,0,0,1-.74-.77,2.48,2.48,0,0,1-.43-1.45,2.68,2.68,0,0,1,.42-1.44A2.2,2.2,0,0,1,93.19.83Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 97.39, height: 16.84, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Initial Here': {
                stampCollection = {
                    iconName: 'Initial Here',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M6.36,15.51a5.09,5.09,0,0,0,1.42.25v.62H.63v-.62a2.62,2.62,0,0,0,1.27-.42,2.47,2.47,0,0,0,.68-1.29l3-10.77c.08-.3.15-.56.19-.77A2.86,2.86,0,0,0,5.78,2c0-.41-.11-.66-.34-.77A5.07,5.07,0,0,0,4,1V.33h7.14V1a2.76,2.76,0,0,0-1.27.42,2.5,2.5,0,0,0-.66,1.3l-3,10.77-.19.83c0,.08,0,.16,0,.24a2,2,0,0,0,0,.23C6,15.14,6.14,15.4,6.36,15.51ZM27,1,27.36,1V.33H22.43V1a3.78,3.78,0,0,1,1.31.27,1.25,1.25,0,0,1,.58,1.2,6.26,6.26,0,0,1-.15,1.09c-.07.33-.16.71-.27,1.13L22,11.43,16.83.33H12V1a3.49,3.49,0,0,1,1.12.2,1.51,1.51,0,0,1,.74.85l.11.25-2.7,9.85A13,13,0,0,1,10.18,15a1.85,1.85,0,0,1-1.35.72v.62h5v-.62a3.62,3.62,0,0,1-1.28-.26,1.19,1.19,0,0,1-.63-1.17,4.72,4.72,0,0,1,.05-.64q.1-.53.39-1.59l2.39-8.6L21,16.78h.6L24.91,4.6a15.29,15.29,0,0,1,1-2.78A1.51,1.51,0,0,1,27,1ZM35.78.33H28.64V1a5.16,5.16,0,0,1,1.41.25c.23.11.34.36.34.77a2.86,2.86,0,0,1-.06.54c0,.21-.11.47-.19.77L27.19,14.05a2.47,2.47,0,0,1-.68,1.29,2.66,2.66,0,0,1-1.27.42v.62h7.15v-.62A5.09,5.09,0,0,1,31,15.51c-.22-.11-.33-.37-.33-.77a2,2,0,0,1,0-.23,2,2,0,0,1,0-.24l.19-.83,3-10.77a2.5,2.5,0,0,1,.66-1.3A2.76,2.76,0,0,1,35.78,1Zm12.76,4.6.87-4.6H36.22l-.93,4.1.62.16A6.52,6.52,0,0,1,38,2a5.21,5.21,0,0,1,3-.86L37.55,14.05a2.24,2.24,0,0,1-1,1.5,3.7,3.7,0,0,1-1.51.21v.62H43v-.62a5.79,5.79,0,0,1-1.61-.24c-.26-.1-.39-.36-.39-.77a1.48,1.48,0,0,1,0-.21,2,2,0,0,1,0-.27l.2-.83L44.58,1.16a3.77,3.77,0,0,1,2,.52,3.74,3.74,0,0,1,1.31,3.2Zm4,9.81a.93.93,0,0,1,0-.23,2,2,0,0,1,0-.24l.18-.83,3-10.77a2.42,2.42,0,0,1,.67-1.3A2.72,2.72,0,0,1,57.72,1V.33H50.57V1A5.26,5.26,0,0,1,52,1.2c.23.11.34.36.34.77a2.28,2.28,0,0,1-.07.54,7.71,7.71,0,0,1-.19.77l-3,10.77a2.4,2.4,0,0,1-.68,1.29,2.58,2.58,0,0,1-1.26.42v.62h7.14v-.62a5.07,5.07,0,0,1-1.41-.25C52.69,15.4,52.58,15.14,52.58,14.74Zm32-3.13.57.11-1.4,4.66H63.34v-.57a3.65,3.65,0,0,0,1.46-.34c.29-.16.43-.51.43-1,0-.18,0-.61-.13-1.29,0-.14-.09-.73-.23-1.75H59.69l-1.4,2.44a3.38,3.38,0,0,0-.25.54,1.64,1.64,0,0,0-.11.56q0,.5.3.63a4.41,4.41,0,0,0,1.25.25v.57H54.76v-.57a3.36,3.36,0,0,0,1-.43,4.58,4.58,0,0,0,1-1.27L65.7,0h.62l2.3,13.72a3.49,3.49,0,0,0,.56,1.7,2.34,2.34,0,0,0,1.29.37v0a2.58,2.58,0,0,0,1.26-.42,2.46,2.46,0,0,0,.68-1.3L75.35,3.28c.09-.3.16-.56.2-.77A2.86,2.86,0,0,0,75.61,2c0-.41-.11-.66-.34-.77A5.17,5.17,0,0,0,73.85,1V.33h7.61V1a4.77,4.77,0,0,0-1.69.39A2.27,2.27,0,0,0,79,2.67L75.92,14.12c0,.13,0,.25-.07.36a2.21,2.21,0,0,0,0,.39.59.59,0,0,0,.35.57,2.33,2.33,0,0,0,1,.17,10.06,10.06,0,0,0,4.28-.84A7.67,7.67,0,0,0,84.6,11.61ZM64.7,10.44,63.81,4.6l-3.55,5.84Zm38,4.32a.71.71,0,0,1,0-.16s0-.16.07-.34l.2-.83L106,2.67a2.43,2.43,0,0,1,.79-1.39A2.78,2.78,0,0,1,107.9,1V.33h-7.15V1a4.45,4.45,0,0,1,1.27.19.81.81,0,0,1,.47.83,2.73,2.73,0,0,1-.07.57c0,.22-.1.47-.17.74l-1.14,4.16h-5.7L96.7,2.67a2.27,2.27,0,0,1,.73-1.33A4.77,4.77,0,0,1,99.12,1V.33H91.51V1a5.09,5.09,0,0,1,1.42.25c.22.11.33.36.33.77a2.93,2.93,0,0,1-.08.58c-.05.24-.1.48-.17.73L90.07,14a2.73,2.73,0,0,1-.65,1.29,2.47,2.47,0,0,1-1.3.43v.62h7.15v-.62a5.13,5.13,0,0,1-1.42-.24c-.21-.1-.31-.34-.31-.72a3.11,3.11,0,0,1,0-.57c0-.16.1-.43.19-.8L95.12,8.5h5.7L99.31,14a2.21,2.21,0,0,1-.74,1.33,4.36,4.36,0,0,1-1.69.39v.62h7.63v-.62a4.72,4.72,0,0,1-1.25-.17A.8.8,0,0,1,102.73,14.76Zm13.38.24a10.07,10.07,0,0,1-3.72.61,1.86,1.86,0,0,1-1.08-.21.67.67,0,0,1-.26-.54,2.36,2.36,0,0,1,0-.32,3.38,3.38,0,0,1,.09-.41l1.58-5.86a5.51,5.51,0,0,1,2.75.47,2,2,0,0,1,.7,1.75c0,.11,0,.25,0,.41s0,.37-.07.6l.66.11,1.78-6.56L117.89,5a4.63,4.63,0,0,1-1.65,2.12A10,10,0,0,1,113,7.5l1.43-5.33a1.6,1.6,0,0,1,.45-.86,2.07,2.07,0,0,1,1.23-.23c1.86,0,3.1.41,3.71,1.23a4.32,4.32,0,0,1,.56,2.47l.65.11,1-4.56H109.1V1a5.1,5.1,0,0,1,1.43.25c.21.11.32.36.32.77a3.63,3.63,0,0,1-.07.57c0,.22-.11.47-.18.74l-2.95,10.77a2.4,2.4,0,0,1-.68,1.29,2.58,2.58,0,0,1-1.26.42v.62H119l1.42-4.66-.58-.11A7.17,7.17,0,0,1,116.11,15ZM144.36,2.17,142.93,7.5a10.13,10.13,0,0,0,3.27-.41A4.69,4.69,0,0,0,147.84,5l.67.08-1.78,6.56-.66-.11c0-.23.06-.43.07-.6s0-.3,0-.41a2,2,0,0,0-.7-1.75,5.51,5.51,0,0,0-2.75-.47l-1.58,5.86a3.38,3.38,0,0,0-.09.41,2.36,2.36,0,0,0,0,.32.67.67,0,0,0,.26.54,1.86,1.86,0,0,0,1.08.21,10.07,10.07,0,0,0,3.72-.61,7.14,7.14,0,0,0,3.73-3.39l.58.11L149,16.38H131l-2.59-7.93h-.68l-1.42,5-.2.83,0,.2a1.77,1.77,0,0,0,0,.23c0,.43.1.7.31.81a4.87,4.87,0,0,0,1.43.25v.62h-7.14v-.62a2.58,2.58,0,0,0,1.26-.42,2.4,2.4,0,0,0,.68-1.29l3-10.77.15-.57a4.09,4.09,0,0,0,.1-.79c0-.38-.11-.62-.32-.72A4.8,4.8,0,0,0,124,1V.33h6.6a10.58,10.58,0,0,1,3.42.43,3,3,0,0,1,2.24,3.05,4,4,0,0,1-.38,1.6A4,4,0,0,1,134.66,7a5.47,5.47,0,0,1-1.45.8c-.33.11-.85.25-1.54.42a4.73,4.73,0,0,0,.16.46l1.85,5.42a2.81,2.81,0,0,0,.8,1.38,2.42,2.42,0,0,0,1.23.32,2.53,2.53,0,0,0,1.22-.41,2.47,2.47,0,0,0,.68-1.29l2.94-10.77c.07-.27.13-.52.18-.74A2.73,2.73,0,0,0,140.8,2c0-.41-.11-.66-.32-.77A5.1,5.1,0,0,0,139.05,1V.33H152l-1,4.56-.65-.11a4.32,4.32,0,0,0-.56-2.47c-.61-.82-1.85-1.23-3.71-1.23a2.07,2.07,0,0,0-1.23.23A1.67,1.67,0,0,0,144.36,2.17ZM131.54,6.59a5,5,0,0,0,.77-1.32,4.68,4.68,0,0,0,.36-1.84,2.74,2.74,0,0,0-.5-1.67,2,2,0,0,0-1.7-.66,1,1,0,0,0-.72.22,2,2,0,0,0-.38.85l-1.45,5.49a10.33,10.33,0,0,0,1.91-.16A3.07,3.07,0,0,0,131.54,6.59Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 151.345, height: 16.781, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Sign Here': {
                stampCollection = {
                    iconName: 'Sign Here',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M6.38,1.9A2.56,2.56,0,0,0,6,3.34a2.49,2.49,0,0,0,.44,1.45,3.9,3.9,0,0,0,.73.76l2.07,1.7a9.34,9.34,0,0,1,1.87,2.06,4.6,4.6,0,0,1,.78,2.63,4.78,4.78,0,0,1-1.5,3.43A5.46,5.46,0,0,1,6.23,16.9a7.34,7.34,0,0,1-1.31-.12,7.48,7.48,0,0,1-1.31-.36L3,16.2l-.42-.14a1.12,1.12,0,0,0-.27,0,.71.71,0,0,0-.57.19,2.85,2.85,0,0,0-.38.67H.63l.87-5.38.69,0a10.34,10.34,0,0,0,.2,1.68,3.82,3.82,0,0,0,2,2.5,3.42,3.42,0,0,0,1.5.32,2.76,2.76,0,0,0,2.23-.92A3.14,3.14,0,0,0,8.94,13c0-1-1-2.29-2.94-3.82S3.06,6.08,3.06,4.71A4.59,4.59,0,0,1,4.35,1.42,4.76,4.76,0,0,1,8,.06,6.71,6.71,0,0,1,9.29.19a4.78,4.78,0,0,1,.79.2l.61.2.41.1a2.76,2.76,0,0,0,.37,0,1,1,0,0,0,.65-.18A1.75,1.75,0,0,0,12.5.12h.72l-1,4.8-.62-.08-.09-.79a4.45,4.45,0,0,0-.69-1.91A2.78,2.78,0,0,0,8.39.89,2.2,2.2,0,0,0,6.38,1.9ZM22.8.39H15.66V1a4.71,4.71,0,0,1,1.41.25c.23.11.34.36.34.77a2.86,2.86,0,0,1-.06.54c0,.21-.11.47-.19.77L14.21,14.11a2.47,2.47,0,0,1-.68,1.29,2.62,2.62,0,0,1-1.27.42v.62h7.15v-.62A4.63,4.63,0,0,1,18,15.56c-.22-.1-.33-.36-.33-.77a1.8,1.8,0,0,1,0-.22c0-.08,0-.16,0-.24l.19-.83,3-10.77a2.5,2.5,0,0,1,.66-1.3A2.76,2.76,0,0,1,22.8,1ZM38.09,9.14V8.52H31.18v.62a5.05,5.05,0,0,1,1.44.28c.22.1.32.35.32.75a13.35,13.35,0,0,1-.54,2.54,19.13,19.13,0,0,1-.54,1.87A1.85,1.85,0,0,1,31,15.66a3.77,3.77,0,0,1-1.78.35A3.71,3.71,0,0,1,27,15.38c-1.09-.77-1.64-2.13-1.64-4.08a13.74,13.74,0,0,1,1.78-6.69q2.05-3.72,5-3.72a2.93,2.93,0,0,1,3,1.86,6.09,6.09,0,0,1,.4,2.48l.69.08L37.44,0h-.71a2.44,2.44,0,0,1-.41.53.82.82,0,0,1-.58.2A9.14,9.14,0,0,1,34.33.36,9.23,9.23,0,0,0,31.73,0a9.4,9.4,0,0,0-7.46,3.42,10.46,10.46,0,0,0-2.65,7,5.88,5.88,0,0,0,2.2,4.83,7.77,7.77,0,0,0,5,1.64A13.06,13.06,0,0,0,32,16.52a14.26,14.26,0,0,0,2.33-.75l.67-.3,1.2-4.36a4.15,4.15,0,0,1,.62-1.59A2.28,2.28,0,0,1,38.09,9.14ZM50.36,1a3.36,3.36,0,0,1,1.31.27,1.25,1.25,0,0,1,.58,1.2,6.26,6.26,0,0,1-.15,1.09c-.07.33-.16.7-.27,1.13L50,11.48,44.76.39H39.93V1a3.49,3.49,0,0,1,1.12.2,1.51,1.51,0,0,1,.74.85l.1.25L39.2,12.16a12.62,12.62,0,0,1-1.09,2.93,1.86,1.86,0,0,1-1.35.73v.62h5v-.62a3.62,3.62,0,0,1-1.28-.26,1.21,1.21,0,0,1-.63-1.17,4.72,4.72,0,0,1,0-.64q.1-.52.39-1.59l2.39-8.6,6.23,13.28h.6L52.84,4.66a15.29,15.29,0,0,1,1-2.78A1.52,1.52,0,0,1,55,1.05l.34,0V.39H50.36Zm22.33,13.8a.66.66,0,0,1,0-.15c0-.05,0-.16.07-.34l.2-.83L75.91,2.73a2.43,2.43,0,0,1,.79-1.39A2.78,2.78,0,0,1,77.86,1V.39H70.71V1A4.45,4.45,0,0,1,72,1.2a.81.81,0,0,1,.47.83,2.73,2.73,0,0,1-.07.57c0,.22-.1.47-.17.74L71.07,7.5h-5.7l1.29-4.77a2.27,2.27,0,0,1,.73-1.33A4.36,4.36,0,0,1,69.08,1V.39H61.47V1a4.73,4.73,0,0,1,1.42.25c.22.11.33.36.33.77a2.93,2.93,0,0,1-.08.58c0,.24-.1.48-.17.73L60,14.1a2.73,2.73,0,0,1-.65,1.29,2.47,2.47,0,0,1-1.3.43v.62h7.15v-.62a5.13,5.13,0,0,1-1.42-.24c-.21-.1-.31-.34-.31-.72a3,3,0,0,1,0-.57c0-.16.1-.43.19-.8l1.35-4.94h5.7L69.27,14.1a2.21,2.21,0,0,1-.74,1.33,4.77,4.77,0,0,1-1.69.39v.62h7.63v-.62a4.72,4.72,0,0,1-1.25-.17A.82.82,0,0,1,72.69,14.81Zm13.38.25a10.28,10.28,0,0,1-3.72.61,1.86,1.86,0,0,1-1.08-.21.67.67,0,0,1-.26-.54,2.23,2.23,0,0,1,0-.32,3.38,3.38,0,0,1,.09-.41l1.58-5.86a5.51,5.51,0,0,1,2.75.47,2,2,0,0,1,.7,1.75c0,.11,0,.24,0,.41s0,.37-.07.59l.66.12,1.78-6.56L87.85,5a4.75,4.75,0,0,1-1.64,2.12,10.13,10.13,0,0,1-3.27.41l1.43-5.33a1.56,1.56,0,0,1,.45-.86,2.07,2.07,0,0,1,1.23-.23c1.86,0,3.1.41,3.71,1.23a4.32,4.32,0,0,1,.56,2.47L91,5,92,.39H79.06V1a4.75,4.75,0,0,1,1.43.25c.21.11.32.36.32.77a2.73,2.73,0,0,1-.07.57c0,.22-.11.47-.18.74l-3,10.77a2.4,2.4,0,0,1-.68,1.29,2.58,2.58,0,0,1-1.26.42v.62H89l1.41-4.66-.58-.11A7.22,7.22,0,0,1,86.07,15.06ZM114.32,2.23l-1.43,5.33a10.13,10.13,0,0,0,3.27-.41A4.75,4.75,0,0,0,117.8,5l.67.08-1.78,6.56-.66-.12c0-.22.06-.42.07-.59s0-.3,0-.41a2,2,0,0,0-.71-1.75,5.51,5.51,0,0,0-2.75-.47l-1.58,5.86a3.38,3.38,0,0,0-.09.41,2.23,2.23,0,0,0,0,.32.67.67,0,0,0,.26.54,1.86,1.86,0,0,0,1.08.21,10.28,10.28,0,0,0,3.72-.61,7.22,7.22,0,0,0,3.73-3.39l.58.11-1.41,4.66h-18L98.33,8.51h-.68l-1.42,5-.2.83,0,.2a1.77,1.77,0,0,0,0,.23c0,.43.1.7.31.8a4.51,4.51,0,0,0,1.43.26v.62H90.59v-.62a2.58,2.58,0,0,0,1.26-.42,2.4,2.4,0,0,0,.68-1.29l3-10.77.15-.57a4.09,4.09,0,0,0,.1-.79c0-.38-.11-.62-.32-.73A5.3,5.3,0,0,0,94,1V.39h6.6A10.58,10.58,0,0,1,104,.82a3,3,0,0,1,2.24,3.05,4,4,0,0,1-.38,1.6A4.06,4.06,0,0,1,104.62,7a5.32,5.32,0,0,1-1.45.8c-.33.11-.84.25-1.54.42.08.24.13.4.16.46l1.85,5.42a2.81,2.81,0,0,0,.8,1.38,2.42,2.42,0,0,0,1.23.32,2.64,2.64,0,0,0,1.22-.41,2.47,2.47,0,0,0,.68-1.29l2.94-10.77c.07-.27.13-.52.18-.74a2.73,2.73,0,0,0,.07-.57c0-.41-.11-.66-.32-.77A4.75,4.75,0,0,0,109,1V.39h12.93l-1,4.56-.64-.11a4.39,4.39,0,0,0-.57-2.47c-.61-.82-1.85-1.23-3.71-1.23a2.07,2.07,0,0,0-1.23.23A1.7,1.7,0,0,0,114.32,2.23ZM101.5,6.64a4.76,4.76,0,0,0,.77-1.31,4.68,4.68,0,0,0,.36-1.84,2.72,2.72,0,0,0-.5-1.67,2,2,0,0,0-1.7-.66.94.94,0,0,0-.71.22,1.81,1.81,0,0,0-.39.85L97.88,7.72a10.33,10.33,0,0,0,1.91-.16A3,3,0,0,0,101.5,6.64Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 121.306, height: 16.899, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Accepted': {
                stampCollection = {
                    iconName: 'Accepted',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M22.409294,0.00021190348 C22.64747,0.0056831966 22.875833,0.11701412 23.023336,0.32638185 23.631345,1.1873664 25.36437,2.8183636 27.4584,4.1123583 28.000408,4.4483535 28.015407,5.227338 27.477398,5.5713293 23.803344,7.9272954 12.881201,15.464245 9.4751583,23.800168 9.2091556,24.452168 8.3321453,24.542164 7.9521352,23.95016 6.0691143,21.014182 1.8990528,14.526234 0.095028103,11.832258 -0.13796928,11.485277 0.081027784,11.023275 0.49603404,10.97927 1.9670546,10.824272 4.8490969,10.421291,6.5811144,9.5293013 6.9811216,9.3233086 7.4691268,9.5782811 7.5601316,10.019287 7.847138,11.400286 8.4021459,13.83224 8.952148,14.781236 8.952148,14.781236 16.385246,3.2303471 21.985326,0.10638282 22.119951,0.031756414 22.266389,-0.003070501 22.409294,0.00021190348 z',
                    opacity: 1, strokeColor: '', fillColor: '#516c30', width: 27.873, height: 24.346, stampFillColor: '#e6eddf', stampStrokeColor: '',
                };
            }
                break;
            case 'Rejected': {
                stampCollection = {
                    iconName: 'Rejected',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M3.8779989,0 L11.294,7.4140023 18.710001,0 22.588001,3.8779911 15.172998,11.293032 22.588001,18.707033 18.710001,22.586 11.294,15.169985 3.8779989,22.586 0,18.707033 7.4150017,11.293032 0,3.8779911 z',
                    opacity: 1, strokeColor: '', fillColor: '#8a251a', width: 22.588, height: 22.586, stampFillColor: '#f6dedd', stampStrokeColor: '',
                };
            }
                break;
            case 'Rejected_with_border': {
                stampCollection = {
                    iconName: 'Rejected_with_border',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M3.8779989,0 L11.294,7.4140023 18.710001,0 22.588001,3.8779911 15.172998,11.293032 22.588001,18.707033 18.710001,22.586 11.294,15.169985 3.8779989,22.586 0,18.707033 7.4150017,11.293032 0,3.8779911 z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 22.588, height: 24.346, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Not Approved': {
                stampCollection = {
                    iconName: 'Not Approved',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M0,19.46a1.56,1.56,0,0,0,1.16-.9A19.84,19.84,0,0,0,2.1,15L4.42,2.84l-.09-.3a1.82,1.82,0,0,0-.64-1.06,2.41,2.41,0,0,0-1-.24V.48H6.88l4.49,13.64L13,5.78c.09-.52.17-1,.22-1.39a10.11,10.11,0,0,0,.13-1.34,1.83,1.83,0,0,0-.49-1.48,2.49,2.49,0,0,0-1.13-.33V.48H16v.76l-.29.06a1.42,1.42,0,0,0-1,1,23.7,23.7,0,0,0-.84,3.42L11,20.71h-.51L5.1,4.38,3,15c-.17.87-.28,1.53-.33,2a5.32,5.32,0,0,0,0,.79,1.69,1.69,0,0,0,.54,1.44,2.48,2.48,0,0,0,1.1.32v.76H0ZM17.73,4.53C19.54,1.51,21.55,0,23.79,0a4.4,4.4,0,0,1,3.66,1.92,8.52,8.52,0,0,1,1.43,5.19,17.56,17.56,0,0,1-2.53,9.07q-2.7,4.61-6.21,4.6a4.24,4.24,0,0,1-3.6-1.92,8.6,8.6,0,0,1-1.39-5.14A17.68,17.68,0,0,1,17.73,4.53ZM18.37,18c.33,1.19.93,1.78,1.8,1.78a2.83,2.83,0,0,0,2.22-1.29,16.41,16.41,0,0,0,2.06-4.93,35.53,35.53,0,0,0,1.06-4.83A28.26,28.26,0,0,0,25.9,4.6a5.86,5.86,0,0,0-.52-2.55A1.7,1.7,0,0,0,23.78,1Q21.2,1,19.45,7.53a33,33,0,0,0-1.33,8.26A8.15,8.15,0,0,0,18.37,18Zm11.08,1.48a2.34,2.34,0,0,0,1.3-.26,3,3,0,0,0,.85-1.85l3-15.85A3.54,3.54,0,0,0,32,2.56a8,8,0,0,0-1.82,3.16l-.53-.2.8-5H41.81l-.74,5.66-.54-.07c0-1.92-.41-3.24-1.13-3.94a2.6,2.6,0,0,0-1.74-.63L34.79,16.6l-.17,1a2.43,2.43,0,0,0,0,.33,2.26,2.26,0,0,0,0,.26c0,.5.11.82.33.95a3.94,3.94,0,0,0,1.39.3v.76H29.45Zm26.65.76H50.18v-.71a2.28,2.28,0,0,0,1.25-.41,1.64,1.64,0,0,0,.37-1.29c0-.22,0-.75-.11-1.58,0-.17-.08-.89-.2-2.15H47l-1.2,3c-.08.2-.15.42-.22.66a2.84,2.84,0,0,0-.09.69c0,.41.08.67.25.78a2.91,2.91,0,0,0,1.08.3v.71H42.79v-.71a2.44,2.44,0,0,0,.85-.53,5.59,5.59,0,0,0,.9-1.56L52.21.07h.53l2,16.88A5.46,5.46,0,0,0,55.2,19a1.36,1.36,0,0,0,.9.43Zm-4.76-7.31-.76-7.18-3,7.18Zm4.95,6.53a1.82,1.82,0,0,0,1-.5,3.56,3.56,0,0,0,.58-1.59L60.42,4.11c.06-.3.1-.6.15-.9a5.46,5.46,0,0,0,.06-.72c0-.52-.13-.86-.4-1a2.88,2.88,0,0,0-1.1-.23V.48h5.93a5,5,0,0,1,2.5.57c1.26.73,1.9,2.07,1.9,4a5.81,5.81,0,0,1-1.54,4.22,5.32,5.32,0,0,1-4,1.58l-.59,0-1.2-.11L61,16.6l-.17,1a2.72,2.72,0,0,0,0,.3,2.81,2.81,0,0,0,0,.29c0,.5.09.81.28.94a3.26,3.26,0,0,0,1.23.31v.76h-6Zm6-9.67.38.06H63a3,3,0,0,0,1.62-.36,2.87,2.87,0,0,0,1-1.18,7.28,7.28,0,0,0,.6-2,11.67,11.67,0,0,0,.22-2,4.4,4.4,0,0,0-.41-2,1.44,1.44,0,0,0-1.39-.79.71.71,0,0,0-.65.28,3.7,3.7,0,0,0-.32,1Zm5.61,9.69A1.86,1.86,0,0,0,69,18.94a3.54,3.54,0,0,0,.59-1.59L72.15,4.11q.09-.45.15-.9a5.73,5.73,0,0,0,.07-.72,1.1,1.1,0,0,0-.41-1,2.88,2.88,0,0,0-1.1-.23V.48h5.93a5,5,0,0,1,2.5.57c1.27.73,1.9,2.07,1.9,4a5.77,5.77,0,0,1-1.54,4.22,5.31,5.31,0,0,1-4,1.58l-.6,0-1.2-.11L72.74,16.6l-.17,1a2.72,2.72,0,0,0,0,.3c0,.1,0,.19,0,.29,0,.5.1.81.29.94a3.15,3.15,0,0,0,1.23.31v.76h-6.1Zm6.12-9.69.38.06h.33a3,3,0,0,0,1.62-.36,3,3,0,0,0,1-1.18,7.67,7.67,0,0,0,.59-2,11.67,11.67,0,0,0,.22-2,4.4,4.4,0,0,0-.41-2,1.43,1.43,0,0,0-1.38-.79.73.73,0,0,0-.66.28,3.7,3.7,0,0,0-.32,1Zm5.57,9.69a1.9,1.9,0,0,0,1.09-.52,3.56,3.56,0,0,0,.58-1.59L83.84,4.11c0-.27.09-.51.13-.71a7.08,7.08,0,0,0,.09-1c0-.47-.1-.77-.28-.9a3.53,3.53,0,0,0-1.22-.3V.48h5.68a6.57,6.57,0,0,1,3,.53q1.92,1,1.92,3.75a6.79,6.79,0,0,1-.32,2,5.23,5.23,0,0,1-1.08,1.9,4.56,4.56,0,0,1-1.25,1,11.62,11.62,0,0,1-1.33.52c.07.3.12.49.14.57l1.59,6.66a4.07,4.07,0,0,0,.69,1.7,1.72,1.72,0,0,0,1.13.41v.76H88.52l-2.23-9.76h-.58L84.49,16.6l-.17,1a1,1,0,0,0,0,.25,2.62,2.62,0,0,0,0,.28c0,.53.09.86.26,1a3.11,3.11,0,0,0,1.24.32v.76H79.63ZM87.55,9.3A2.59,2.59,0,0,0,89,8.17a7.24,7.24,0,0,0,.66-1.62A8.18,8.18,0,0,0,90,4.29a4.32,4.32,0,0,0-.43-2,1.5,1.5,0,0,0-1.45-.81.71.71,0,0,0-.62.26,2.78,2.78,0,0,0-.33,1.05L85.91,9.5A6.63,6.63,0,0,0,87.55,9.3Zm8.72-4.77Q99,0,102.32,0A4.37,4.37,0,0,1,106,1.92a8.46,8.46,0,0,1,1.44,5.19,17.58,17.58,0,0,1-2.54,9.07q-2.7,4.61-6.21,4.6a4.27,4.27,0,0,1-3.6-1.92,8.67,8.67,0,0,1-1.38-5.14A17.68,17.68,0,0,1,96.27,4.53ZM96.9,18c.33,1.19.93,1.78,1.8,1.78a2.83,2.83,0,0,0,2.22-1.29A16.63,16.63,0,0,0,103,13.54a37.1,37.1,0,0,0,1.06-4.83,29.49,29.49,0,0,0,.38-4.11,5.86,5.86,0,0,0-.51-2.55A1.71,1.71,0,0,0,102.31,1C100.6,1,99.15,3.17,98,7.53a33.42,33.42,0,0,0-1.33,8.26A8.57,8.57,0,0,0,96.9,18ZM114.35.48v.76a2.57,2.57,0,0,0-1.08.17,1.07,1.07,0,0,0-.5,1,2.53,2.53,0,0,0,0,.28,2.64,2.64,0,0,0,0,.28l1.07,11.76L117.77,6c.31-.71.59-1.41.84-2.11A5.25,5.25,0,0,0,119,2.19a.85.85,0,0,0-.38-.81,3.09,3.09,0,0,0-.95-.14V.48h4v.76a2.08,2.08,0,0,0-.73.45,5.35,5.35,0,0,0-.82,1.4l-7.79,17.69h-.66L110,5.74A22,22,0,0,0,109.46,2c-.16-.39-.58-.62-1.28-.71V.48Zm5.15,19a1.83,1.83,0,0,0,1.08-.52,3.42,3.42,0,0,0,.59-1.59l2.54-13.24c.06-.34.11-.64.15-.92a4.83,4.83,0,0,0,.06-.7c0-.5-.09-.81-.28-.94a3.14,3.14,0,0,0-1.22-.31V.48h11.12l-.87,5.6L132.11,6a7,7,0,0,0-.49-3c-.52-1-1.59-1.51-3.19-1.51-.55,0-.9.09-1.06.28A2.44,2.44,0,0,0,127,2.74L125.76,9.3a6.21,6.21,0,0,0,2.81-.51A6,6,0,0,0,130,6.18l.58.1L129,14.35l-.56-.14c0-.28,0-.52,0-.73s0-.37,0-.51a2.92,2.92,0,0,0-.61-2.15,3.55,3.55,0,0,0-2.37-.57l-1.36,7.2a4.79,4.79,0,0,0-.07.51,3.28,3.28,0,0,0,0,.39,1,1,0,0,0,.22.66,1.24,1.24,0,0,0,.93.26,6.43,6.43,0,0,0,3.21-.75,7.67,7.67,0,0,0,3.21-4.17l.5.13-1.22,5.74H119.5Zm12.79,0a1.87,1.87,0,0,0,1-.41,3.23,3.23,0,0,0,.71-1.71L136.5,4.11c.07-.38.13-.69.17-1a5.89,5.89,0,0,0,.05-.67c0-.5-.1-.81-.29-.94a3.32,3.32,0,0,0-1.22-.31V.48h6a5.35,5.35,0,0,1,4.63,2.22,10.11,10.11,0,0,1,1.58,6,13.3,13.3,0,0,1-2.34,7.84,8,8,0,0,1-6.86,3.7h-5.93ZM143.87,3.39a2.84,2.84,0,0,0-2.79-2,1.08,1.08,0,0,0-.91.31,1.93,1.93,0,0,0-.34.83L137,17.44a3.1,3.1,0,0,0-.06.39c0,.11,0,.21,0,.3a1.22,1.22,0,0,0,.24.84,1.26,1.26,0,0,0,.9.26q3.67,0,5.33-5.42a23.91,23.91,0,0,0,1-6.94A9.45,9.45,0,0,0,143.87,3.39Z',
                    opacity: 1, strokeColor: '', fillColor: '#8a251a', width: 147.425, height: 20.783, stampFillColor: '#f6dedd', stampStrokeColor: ''
                };
            }
                break;
            case 'Draft': {
                stampCollection = {
                    iconName: 'Draft',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M24.92,3Q22,.46,16.4.46h-11v.87a9.38,9.38,0,0,1,2.24.35q.54.23.54,1.08a3.24,3.24,0,0,1-.1.76c-.07.29-.17.65-.31,1.08L3.08,19.69a3.26,3.26,0,0,1-1.32,1.95A4.67,4.67,0,0,1,0,22.1V23H10.91q7.8,0,12.61-4.22a11.56,11.56,0,0,0,4.32-8.94A8.58,8.58,0,0,0,24.92,3ZM20.41,15.66a10.18,10.18,0,0,1-9.8,6.18A3.18,3.18,0,0,1,9,21.54a1,1,0,0,1-.46-.95,2.47,2.47,0,0,1,0-.35,3,3,0,0,1,.1-.44l5.24-17a1.91,1.91,0,0,1,.62-.95,2.81,2.81,0,0,1,1.66-.35c2.44,0,4.15.76,5.15,2.27a7.29,7.29,0,0,1,.94,4A17.63,17.63,0,0,1,20.41,15.66ZM49.75,9.74a5.84,5.84,0,0,0,2-2.16,5.1,5.1,0,0,0,.59-2.24c0-2.1-1.18-3.53-3.54-4.27A18.67,18.67,0,0,0,43.36.46H32.92v.87a8.79,8.79,0,0,1,2.24.35c.35.14.52.48.52,1a5.36,5.36,0,0,1-.17,1.11c-.06.23-.14.5-.23.8L30.61,19.7a3.26,3.26,0,0,1-1.08,1.81,4.44,4.44,0,0,1-2,.59V23H38.85V22.1a8.54,8.54,0,0,1-2.28-.36c-.32-.15-.49-.53-.49-1.13,0-.11,0-.21,0-.32a1.15,1.15,0,0,1,.06-.28l.31-1.16,2.25-7h1.07L43.89,23h7.64V22.1a4.27,4.27,0,0,1-2.07-.47,3.91,3.91,0,0,1-1.27-1.93l-2.92-7.6a4.67,4.67,0,0,1-.25-.65c1.1-.23,1.91-.42,2.43-.59A8.49,8.49,0,0,0,49.75,9.74ZM46,7.39a6.73,6.73,0,0,1-1.21,1.84,5,5,0,0,1-2.72,1.29,19.56,19.56,0,0,1-3,.23L41.38,3A2.54,2.54,0,0,1,42,1.85a1.76,1.76,0,0,1,1.14-.31,3.38,3.38,0,0,1,2.69.93,3.52,3.52,0,0,1,.79,2.34A5.94,5.94,0,0,1,46,7.39Zm27.9,11.85L70.29,0h-1L55.21,19.78a6.61,6.61,0,0,1-1.66,1.78,5.3,5.3,0,0,1-1.55.6V23h7.45v-.81a8,8,0,0,1-2-.34.85.85,0,0,1-.47-.89,2,2,0,0,1,.17-.79,5.32,5.32,0,0,1,.4-.75L59.8,16H68c.22,1.44.35,2.25.37,2.45a16,16,0,0,1,.2,1.81,1.51,1.51,0,0,1-.67,1.47,6.38,6.38,0,0,1-2.31.46V23H77.1v-.81a4.28,4.28,0,0,1-2.28-.55A4.47,4.47,0,0,1,73.93,19.24ZM60.7,14.64l5.62-8.19,1.4,8.19ZM84,.46h20.2l-1.61,6.39-1-.15a5.61,5.61,0,0,0-.88-3.43Q99.2,1.52,94.86,1.51a3.56,3.56,0,0,0-1.76.3A2.05,2.05,0,0,0,92.34,3L90.1,10.5A16.53,16.53,0,0,0,95,9.91c.77-.33,1.62-1.32,2.56-3l1.06.12-2.82,9.2-1-.17c0-.33.08-.61.1-.85s0-.43,0-.56a2.76,2.76,0,0,0-1-2.38c-.66-.49-2.07-.73-4.23-.73l-2.5,8.22a3.56,3.56,0,0,0-.09.39,1.55,1.55,0,0,0,0,.37,1.32,1.32,0,0,0,1,1.33,5.52,5.52,0,0,0,1.78.21V23H78.58V22.1a4.35,4.35,0,0,0,2-.61,3.33,3.33,0,0,0,1.06-1.8L86.32,4.6c.09-.31.16-.58.23-.81a5.05,5.05,0,0,0,.16-1.1c0-.53-.17-.87-.52-1A8.7,8.7,0,0,0,84,1.33Zm24.1,0h20.89l-1.37,6.46-1-.08c-.07-2.2-.76-3.69-2.09-4.49a6.61,6.61,0,0,0-3.2-.72L116,18.84,115.7,20a2.63,2.63,0,0,0-.07.38,1.51,1.51,0,0,0,0,.3c0,.57.2.94.61,1.08a11.19,11.19,0,0,0,2.56.34V23H106.2V22.1a6.49,6.49,0,0,0,2.4-.3,3.19,3.19,0,0,0,1.56-2.1l5.58-18.07a9.07,9.07,0,0,0-4.83,1.2,9.52,9.52,0,0,0-3.34,3.61l-1-.23Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 128.941, height: 22.97, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Final': {
                stampCollection = {
                    iconName: 'Final',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M24.94,6l-1.06-.13a4.37,4.37,0,0,0-.91-3q-1.51-1.54-6-1.54a4.28,4.28,0,0,0-1.83.26,1.8,1.8,0,0,0-.78,1.08L12,9.21a20.26,20.26,0,0,0,5.15-.52A6.49,6.49,0,0,0,19.8,6.1l1.1.1L18,14.27l-1.09-.15a6.34,6.34,0,0,0,.11-.74c0-.22,0-.38,0-.5a2.26,2.26,0,0,0-1-2.09c-.68-.42-2.15-.63-4.39-.63L9,17.37a3.09,3.09,0,0,0-.1.34,1.22,1.22,0,0,0,0,.32,1.18,1.18,0,0,0,1,1.17,7,7,0,0,0,1.86.18v.77H0v-.77a5.14,5.14,0,0,0,2.11-.53,3,3,0,0,0,1.1-1.58L8.06,4c.09-.27.17-.5.23-.7a3.74,3.74,0,0,0,.18-1,.83.83,0,0,0-.55-.89,10.94,10.94,0,0,0-2.33-.3V.4h21Zm8.54,12.11a1.49,1.49,0,0,1,0-.28,2.46,2.46,0,0,1,.07-.29l.3-1L38.76,3.29a2.93,2.93,0,0,1,1.09-1.6A5.42,5.42,0,0,1,42,1.17V.4H30.17v.77a10.52,10.52,0,0,1,2.34.31.88.88,0,0,1,.56.94,2.58,2.58,0,0,1-.11.67c-.07.26-.18.57-.32,1L27.79,17.28a2.94,2.94,0,0,1-1.12,1.59,5.28,5.28,0,0,1-2.09.51v.77H36.36v-.77A10.22,10.22,0,0,1,34,19.07.89.89,0,0,1,33.48,18.12ZM66.19,2.24a2.53,2.53,0,0,1,1.87-1l.56-.06V.4H60.5v.77a8,8,0,0,1,2.16.33,1.47,1.47,0,0,1,1,1.48,5.61,5.61,0,0,1-.25,1.34c-.11.4-.25.87-.43,1.38l-3.08,8.35L51.26.4h-8v.77a8.44,8.44,0,0,1,1.86.24,2.26,2.26,0,0,1,1.22,1.05l.17.31L42.11,14.88a13.74,13.74,0,0,1-1.8,3.61,3.36,3.36,0,0,1-2.22.89v.77h8.23v-.77a7.75,7.75,0,0,1-2.1-.31,1.45,1.45,0,0,1-1-1.44,3.56,3.56,0,0,1,.1-.79,16.15,16.15,0,0,1,.64-2L47.85,4.31,58.11,20.64h1l5.5-15A15.48,15.48,0,0,1,66.19,2.24Zm23,17.13v.78H78.08v-.71A7.47,7.47,0,0,0,80.49,19a1.25,1.25,0,0,0,.7-1.29A13.26,13.26,0,0,0,81,16.16c0-.18-.16-.89-.39-2.15H72.06l-2.3,3a3.7,3.7,0,0,0-.42.66,1.54,1.54,0,0,0-.18.69.74.74,0,0,0,.49.78,10.28,10.28,0,0,0,2.06.3v.71H63.94v-.71a6.43,6.43,0,0,0,1.63-.53,6.63,6.63,0,0,0,1.72-1.56L82,0h1l3.78,16.88A3.69,3.69,0,0,0,87.7,19,3.53,3.53,0,0,0,89.24,19.37Zm-8.93-6.53L78.86,5.65,73,12.84Zm32.8,1.44a11.51,11.51,0,0,1-5.23,3.88,21.36,21.36,0,0,1-7,1A4.88,4.88,0,0,1,99.22,19a.74.74,0,0,1-.58-.71,2.33,2.33,0,0,1,0-.48c0-.13.08-.28.13-.43L104,3.29a2.72,2.72,0,0,1,1.19-1.64,9.4,9.4,0,0,1,2.79-.48V.4H95.4v.77a10.42,10.42,0,0,1,2.34.31.88.88,0,0,1,.56.94,2.58,2.58,0,0,1-.11.67c-.07.25-.17.57-.31.94L93,17.27a2.92,2.92,0,0,1-1.12,1.6,4.59,4.59,0,0,1-1.71.47v.81h21.55l2.32-5.74Z',
                    opacity: 1, strokeColor: '', fillColor: '#516c30', width: 114.058, height: 20.639, stampFillColor: '#e6eddf', stampStrokeColor: '',
                };
            }
                break;
            case 'Completed': {
                stampCollection = {
                    iconName: 'Completed',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M16.37,0,15.08,6.9l-.79-.17c0-.41,0-.66,0-.73a2.73,2.73,0,0,0,0-.32,5.33,5.33,0,0,0-.94-3.47A3,3,0,0,0,11,1.07c-2,0-3.68,1.51-5.13,4.55a18.84,18.84,0,0,0-2,8.29q0,3.06,1.2,4.2a3.82,3.82,0,0,0,2.64,1.13,5.3,5.3,0,0,0,3.51-1.43,10.75,10.75,0,0,0,1.78-2.09l.77.65a9.32,9.32,0,0,1-3.12,3.35A7,7,0,0,1,7,20.81a6.66,6.66,0,0,1-5-2.08,7.72,7.72,0,0,1-2-5.57A14.57,14.57,0,0,1,3.05,3.92Q6.1,0,10.29,0A8.92,8.92,0,0,1,13,.43a9.09,9.09,0,0,0,1.65.43.72.72,0,0,0,.6-.23A2.55,2.55,0,0,0,15.6,0ZM32.83,7.11a15.24,15.24,0,0,1-3.11,9.07q-3.31,4.61-7.63,4.6a5.63,5.63,0,0,1-4.42-1.92A7.47,7.47,0,0,1,16,13.72a15.27,15.27,0,0,1,3.18-9.19Q22.46,0,26.57,0a5.82,5.82,0,0,1,4.5,1.92A7.35,7.35,0,0,1,32.83,7.11ZM29.16,4.6a4.92,4.92,0,0,0-.63-2.55,2.14,2.14,0,0,0-2-1.06Q23.4,1,21.24,7.53a27.45,27.45,0,0,0-1.63,8.26A6.68,6.68,0,0,0,19.92,18a2.24,2.24,0,0,0,2.2,1.78,3.71,3.71,0,0,0,2.73-1.29,15,15,0,0,0,2.54-4.93,30.56,30.56,0,0,0,1.3-4.83A23,23,0,0,0,29.16,4.6Zm21.2,13.62a3.83,3.83,0,0,1,.08-.75,8.6,8.6,0,0,1,.19-.88L53.75,3.31a3,3,0,0,1,.85-1.67,2.72,2.72,0,0,1,1.21-.4V.48H50.42L42.66,14.39,41.21.48h-5.8v.76a4.65,4.65,0,0,1,1.45.21c.26.11.38.37.38.78a4.57,4.57,0,0,1-.08.75c-.06.28-.13.61-.23,1L34.34,15a16.85,16.85,0,0,1-1.16,3.65,1.9,1.9,0,0,1-1.42.86v.76h5.3v-.76a3.22,3.22,0,0,1-1.32-.29A1.48,1.48,0,0,1,35,17.74a8.32,8.32,0,0,1,.17-1.42c.07-.37.17-.82.3-1.37L38.06,4.23l1.71,16.38h.71L50,3.76l-3.2,13.58A2.84,2.84,0,0,1,46,19a4.06,4.06,0,0,1-1.76.49v.76h7.93v-.76a4.79,4.79,0,0,1-1.49-.31Q50.36,19,50.36,18.22ZM67.69,9.29a7.39,7.39,0,0,1-4.89,1.58l-.73,0-1.48-.11L59.21,16.6l-.21,1a1,1,0,0,0,0,.3,2.83,2.83,0,0,0,0,.29c0,.5.12.81.35.94a4.74,4.74,0,0,0,1.51.31v.76H53.31v-.76a2.52,2.52,0,0,0,1.33-.52,3.18,3.18,0,0,0,.72-1.59L58.48,4.11q.1-.45.18-.9a4.48,4.48,0,0,0,.08-.72,1,1,0,0,0-.49-1,4.36,4.36,0,0,0-1.36-.23V.48h7.29a7.29,7.29,0,0,1,3.07.57,4,4,0,0,1,2.33,4A5.22,5.22,0,0,1,67.69,9.29Zm-1.8-5a3.65,3.65,0,0,0-.51-2,1.85,1.85,0,0,0-1.7-.79,1,1,0,0,0-.8.28,3.27,3.27,0,0,0-.4,1l-1.66,7,.47.06h.41a4.37,4.37,0,0,0,2-.36,3.14,3.14,0,0,0,1.2-1.18,6.51,6.51,0,0,0,.74-2A9.87,9.87,0,0,0,65.89,4.25Zm16.9,10.1a8.71,8.71,0,0,1-3.35,3.88,9.36,9.36,0,0,1-4.53,1,2.15,2.15,0,0,1-1-.21.75.75,0,0,1-.37-.71,3.18,3.18,0,0,1,0-.47c0-.14,0-.28.08-.44l3.3-14.08a2.94,2.94,0,0,1,.77-1.64,4.47,4.47,0,0,1,1.79-.48V.48h-8v.76a4.8,4.8,0,0,1,1.5.31c.23.13.35.44.35.94a4.36,4.36,0,0,1-.06.67c0,.26-.12.57-.21,1L69.9,17.34a3.18,3.18,0,0,1-.72,1.6,2.53,2.53,0,0,1-1.34.52v.76H81.91l1.49-5.74ZM85.73,1.24a4.59,4.59,0,0,1,1.5.31c.23.13.34.44.34.94a3.84,3.84,0,0,1-.07.7c0,.28-.11.58-.19.92L84.2,17.35a3.18,3.18,0,0,1-.72,1.59,2.27,2.27,0,0,1-1.06.47h-.07v.8H96.2l1.5-5.74-.62-.13a8.14,8.14,0,0,1-3.94,4.17,9.39,9.39,0,0,1-3.94.75A1.75,1.75,0,0,1,88.06,19a.87.87,0,0,1-.27-.66,3.28,3.28,0,0,1,0-.39,5,5,0,0,1,.09-.51l1.67-7.2a5.16,5.16,0,0,1,2.91.57A2.58,2.58,0,0,1,93.24,13c0,.14,0,.31,0,.51s0,.45-.07.73l.7.14,1.88-8.07L95,6.18a5.62,5.62,0,0,1-1.74,2.61,9.05,9.05,0,0,1-3.45.51l1.51-6.56a2.23,2.23,0,0,1,.47-1.06,2,2,0,0,1,1.3-.28c2,0,3.29.5,3.93,1.51a6.13,6.13,0,0,1,.6,3l.68.13L99.4.48H85.73ZM114,6.14l.92-5.66h-14l-1,5,.66.2a7.81,7.81,0,0,1,2.23-3.16,4.91,4.91,0,0,1,3.23-1.06l-3.73,15.85a2.84,2.84,0,0,1-1,1.85,3.48,3.48,0,0,1-1.6.26v.76h8.4v-.76a5.82,5.82,0,0,1-1.71-.3c-.27-.13-.41-.45-.41-.95a2.26,2.26,0,0,1,0-.26c0-.09,0-.2,0-.33l.21-1,3.53-15.1a3.65,3.65,0,0,1,2.14.63c.89.7,1.35,2,1.39,3.94Zm9.44,12.38a9.39,9.39,0,0,1-3.94.75,1.77,1.77,0,0,1-1.14-.26.87.87,0,0,1-.27-.66,3.28,3.28,0,0,1,0-.39,5,5,0,0,1,.09-.51l1.67-7.2a5.12,5.12,0,0,1,2.91.57,2.58,2.58,0,0,1,.75,2.15c0,.14,0,.31,0,.51s0,.45-.07.73l.7.14L126,6.28l-.7-.1a5.78,5.78,0,0,1-1.74,2.61,9.16,9.16,0,0,1-3.46.51l1.51-6.56a2.14,2.14,0,0,1,.48-1.06,2,2,0,0,1,1.3-.28c2,0,3.28.5,3.92,1.51a6,6,0,0,1,.6,3l.68.13,1.08-5.6H116v.76a4.67,4.67,0,0,1,1.51.31c.22.13.34.44.34.94a4,4,0,0,1-.08.7c0,.28-.11.58-.18.92l-3.12,13.24a3.18,3.18,0,0,1-.72,1.59,2.56,2.56,0,0,1-1.34.52v.76h14.06l1.5-5.74-.62-.13A8.14,8.14,0,0,1,123.39,18.52Zm23.32-9.84a11.62,11.62,0,0,1-2.89,7.84,10.6,10.6,0,0,1-8.42,3.7h-7.29v-.76a2.58,2.58,0,0,0,1.18-.41,2.94,2.94,0,0,0,.88-1.71l3.11-13.23c.09-.38.16-.69.21-1a4.49,4.49,0,0,0,.07-.67c0-.5-.12-.81-.36-.94a4.8,4.8,0,0,0-1.5-.31V.48h7.36a7.16,7.16,0,0,1,5.69,2.22A8.72,8.72,0,0,1,146.71,8.68ZM143,6.87a8,8,0,0,0-.64-3.48,3.52,3.52,0,0,0-3.44-2,1.52,1.52,0,0,0-1.11.31,1.75,1.75,0,0,0-.41.83l-3.5,14.9c0,.14,0,.27-.07.39s0,.21,0,.3a1.06,1.06,0,0,0,.3.84,1.75,1.75,0,0,0,1.1.26q4.53,0,6.55-5.42A19.84,19.84,0,0,0,143,6.87Z',
                    opacity: 1, strokeColor: '', fillColor: '#516c30', width: 146.706, height: 20.811, stampFillColor: '#e6eddf', stampStrokeColor: '',
                };
            }
                break;
            case 'For Public Release': {
                stampCollection = {
                    iconName: 'For Public Release',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M10.33.48l-.65,5.6L9.27,6a9.74,9.74,0,0,0-.36-3A2.27,2.27,0,0,0,6.57,1.4a.85.85,0,0,0-.71.26,2.67,2.67,0,0,0-.3,1.08L4.65,9.28a3.45,3.45,0,0,0,2-.52,6.65,6.65,0,0,0,1-2.59l.43.1L7,14.34l-.42-.14c0-.29,0-.54,0-.75s0-.38,0-.49a4.17,4.17,0,0,0-.39-2.09,1.91,1.91,0,0,0-1.71-.64l-1,7.21c0,.13,0,.24,0,.35s0,.21,0,.31a1.45,1.45,0,0,0,.38,1.17,1.17,1.17,0,0,0,.72.19v.76H0v-.76a1.31,1.31,0,0,0,.82-.54,4.39,4.39,0,0,0,.42-1.58L3.13,4.11c0-.27.06-.51.09-.71,0-.41.07-.73.07-1a1.34,1.34,0,0,0-.21-.9,2.13,2.13,0,0,0-.91-.3V.48ZM20.5,7.11a22.43,22.43,0,0,1-1.88,9.07q-2,4.61-4.62,4.6a3,3,0,0,1-2.67-1.92,10.91,10.91,0,0,1-1-5.14,22.46,22.46,0,0,1,1.92-9.19Q14.23,0,16.71,0a3.11,3.11,0,0,1,2.72,1.92A10.72,10.72,0,0,1,20.5,7.11ZM18.28,4.6a7.7,7.7,0,0,0-.38-2.55c-.26-.7-.65-1-1.19-1-1.28,0-2.35,2.17-3.22,6.53a43.69,43.69,0,0,0-1,8.26,10.72,10.72,0,0,0,.19,2.2c.24,1.18.69,1.77,1.33,1.77s1.16-.43,1.65-1.29a19.35,19.35,0,0,0,1.54-4.93A48.7,48.7,0,0,0,18,8.71,38.21,38.21,0,0,0,18.28,4.6Zm11.59.16a8.73,8.73,0,0,1-.24,2,5.64,5.64,0,0,1-.8,1.9,3.49,3.49,0,0,1-.93,1,7.31,7.31,0,0,1-1,.52c0,.3.08.49.1.57l1.18,6.66a4.54,4.54,0,0,0,.52,1.7,1.1,1.1,0,0,0,.83.41v.76H26.46l-1.65-9.76h-.43l-.91,6.14-.13,1a2,2,0,0,0,0,.25,2.62,2.62,0,0,0,0,.28,1.57,1.57,0,0,0,.2,1,1.77,1.77,0,0,0,.92.32v.76H19.86v-.76a1.33,1.33,0,0,0,.81-.52,4.35,4.35,0,0,0,.43-1.59L23,4.11c0-.27.07-.51.09-.71a8.23,8.23,0,0,0,.07-1,1.3,1.3,0,0,0-.21-.9,2.08,2.08,0,0,0-.91-.3V.48h4.22A3.79,3.79,0,0,1,28.44,1C29.4,1.66,29.87,2.91,29.87,4.76Zm-2.31-.47a5.77,5.77,0,0,0-.32-2,1.12,1.12,0,0,0-1.09-.81.5.5,0,0,0-.46.26,3.87,3.87,0,0,0-.24,1.05L24.52,9.5a3.73,3.73,0,0,0,1.22-.2,2.1,2.1,0,0,0,1.1-1.13,8.41,8.41,0,0,0,.49-1.62A10.75,10.75,0,0,0,27.56,4.29Zm14.92.78a7.06,7.06,0,0,1-1.14,4.22,3.5,3.5,0,0,1-3,1.58l-.44,0-.89-.11-.84,5.86-.12,1a1.45,1.45,0,0,0,0,.3,2.81,2.81,0,0,0,0,.29,1.38,1.38,0,0,0,.21.94,1.93,1.93,0,0,0,.91.31v.76H32.65v-.76a1.28,1.28,0,0,0,.8-.52,4.3,4.3,0,0,0,.44-1.59L35.77,4.11c0-.3.08-.6.11-.9a5.21,5.21,0,0,0,0-.72,1.29,1.29,0,0,0-.3-1,1.82,1.82,0,0,0-.81-.23V.48h4.4a3,3,0,0,1,1.86.57C42,1.78,42.48,3.12,42.48,5.07Zm-2.23-.82a5.74,5.74,0,0,0-.3-2,1.07,1.07,0,0,0-1-.79.5.5,0,0,0-.49.28,5.11,5.11,0,0,0-.24,1l-1,7,.28.06h.25a1.79,1.79,0,0,0,1.2-.36,2.88,2.88,0,0,0,.73-1.18,10.56,10.56,0,0,0,.44-2A15.74,15.74,0,0,0,40.25,4.25Zm12.91-3V.48H50v.76a1.46,1.46,0,0,1,.82.32A2,2,0,0,1,51.24,3a15,15,0,0,1-.14,1.57q0-.17-.15,1.17l-.89,6.16a29.63,29.63,0,0,1-1,4.77c-.55,1.63-1.31,2.44-2.28,2.44a1.59,1.59,0,0,1-1.38-.77,4.16,4.16,0,0,1-.5-2.23q0-.63.15-2c.06-.5.15-1.14.27-1.93l1.26-8.84a4.13,4.13,0,0,1,.46-1.66,1.66,1.66,0,0,1,1-.46V.48H43.34v.76a2,2,0,0,1,.9.3,1.3,1.3,0,0,1,.21.9,7.27,7.27,0,0,1,0,.75c0,.29-.07.59-.11.92l-1,7.24c-.16,1.14-.27,1.93-.32,2.38a19.16,19.16,0,0,0-.12,2,6.13,6.13,0,0,0,1,3.71,2.93,2.93,0,0,0,2.43,1.33c1.39,0,2.45-.9,3.17-2.69a29.58,29.58,0,0,0,1.23-5.61l1-6.74A24.45,24.45,0,0,1,52.3,2.1,1.22,1.22,0,0,1,53.16,1.24Zm7.14,9.82a5.87,5.87,0,0,1,.68,3,8.55,8.55,0,0,1-1,4.27,3.68,3.68,0,0,1-3.48,1.84H51.82v-.76a1.3,1.3,0,0,0,.72-.4,3.94,3.94,0,0,0,.52-1.71L55,4.1c0-.39.09-.72.12-1s0-.46,0-.6c0-.53-.07-.86-.23-1A1.64,1.64,0,0,0,54,1.24V.48h4.17a3.4,3.4,0,0,1,2.67,1,4.91,4.91,0,0,1,1,3.38,5.33,5.33,0,0,1-1.17,3.61,4.8,4.8,0,0,1-1.68,1.22A4.84,4.84,0,0,1,60.3,11.06Zm-1.66,2.45a3.81,3.81,0,0,0-.73-2.74,2.63,2.63,0,0,0-1.58-.52l-1,7.2a4,4,0,0,0-.05.4c0,.15,0,.32,0,.51a.9.9,0,0,0,.33.82,1.13,1.13,0,0,0,.59.12c1,0,1.67-.87,2.1-2.59A13.54,13.54,0,0,0,58.64,13.51Zm.12-5.29A5.92,5.92,0,0,0,59.4,6.1a12.74,12.74,0,0,0,.13-1.74,6.54,6.54,0,0,0-.29-2.11,1.11,1.11,0,0,0-1.13-.81.49.49,0,0,0-.49.32,3.52,3.52,0,0,0-.23,1l-.94,6.62A7.45,7.45,0,0,0,58,9,1.8,1.8,0,0,0,58.76,8.22Zm11.71,6.14a8.78,8.78,0,0,1-2,3.87,4,4,0,0,1-2.74,1,.89.89,0,0,1-.63-.21.93.93,0,0,1-.22-.7,3.4,3.4,0,0,1,0-.48c0-.14,0-.28,0-.44l2-14.08a3.8,3.8,0,0,1,.47-1.64,1.94,1.94,0,0,1,1.08-.48V.48H63.6v.76a2,2,0,0,1,.91.31,1.36,1.36,0,0,1,.22.94c0,.2,0,.42,0,.67s-.07.57-.13,1L62.68,17.34a4.31,4.31,0,0,1-.44,1.6,1.28,1.28,0,0,1-.8.52v.76h8.5l.9-5.74ZM76.89.48H72.32v.76a1.92,1.92,0,0,1,.9.31c.15.13.22.44.22.94a5.56,5.56,0,0,1,0,.67c0,.26-.07.57-.12,1L71.39,17.35A4.35,4.35,0,0,1,71,18.94a1.33,1.33,0,0,1-.81.52v.76h4.57v-.76a1.81,1.81,0,0,1-.91-.32,1.39,1.39,0,0,1-.21-.94c0-.09,0-.18,0-.28l0-.3.12-1L75.65,3.36a4.43,4.43,0,0,1,.43-1.6,1.3,1.3,0,0,1,.81-.52Zm8.46.15A.38.38,0,0,1,85,.87a4.12,4.12,0,0,1-1-.44A3.51,3.51,0,0,0,82.37,0Q79.84,0,78,3.92a21.42,21.42,0,0,0-1.84,9.24,11.15,11.15,0,0,0,1.2,5.57,3.51,3.51,0,0,0,3.05,2.08,3.15,3.15,0,0,0,2.21-1.09,8.92,8.92,0,0,0,1.89-3.35L84,15.72A11.08,11.08,0,0,1,83,17.81a2.71,2.71,0,0,1-2.12,1.43,2,2,0,0,1-1.59-1.13,8.33,8.33,0,0,1-.74-4.2A29.46,29.46,0,0,1,79.7,5.62Q81,1.08,82.8,1.07c.59,0,1.07.38,1.45,1.14a8,8,0,0,1,.57,3.47,2.73,2.73,0,0,1,0,.32c0,.08,0,.32,0,.73l.48.17L86.05,0h-.47A2.93,2.93,0,0,1,85.35.63Zm21.41,13.73.37.12-.9,5.74H94.72l-1.66-9.76h-.43l-.91,6.14-.13,1c0,.08,0,.16,0,.25s0,.19,0,.28a1.57,1.57,0,0,0,.2,1,1.81,1.81,0,0,0,.92.32v.76H88.11v-.76a1.3,1.3,0,0,0,.81-.52,4.35,4.35,0,0,0,.43-1.59L91.24,4.11c0-.27.07-.51.09-.71a8.23,8.23,0,0,0,.07-1,1.3,1.3,0,0,0-.21-.9,2.08,2.08,0,0,0-.91-.3V.48h4.23A3.81,3.81,0,0,1,96.7,1c1,.65,1.43,1.9,1.43,3.75a8.73,8.73,0,0,1-.24,2,5.66,5.66,0,0,1-.81,1.9,3.49,3.49,0,0,1-.93,1,6.73,6.73,0,0,1-1,.52c0,.3.09.49.1.57l1.18,6.66a4.74,4.74,0,0,0,.52,1.7,1,1,0,0,0,.78.39,1.23,1.23,0,0,0,.78-.5A4.3,4.3,0,0,0,99,17.35l1.88-13.24c.05-.34.09-.64.12-.92a6.28,6.28,0,0,0,0-.7,1.45,1.45,0,0,0-.2-.94,2,2,0,0,0-.91-.31V.48h8.26l-.65,5.6L107.1,6a9.57,9.57,0,0,0-.36-3,2.3,2.3,0,0,0-2.38-1.51c-.41,0-.67.09-.78.28a2.87,2.87,0,0,0-.29,1.06l-.91,6.56a3.57,3.57,0,0,0,2.08-.51,6.59,6.59,0,0,0,1.06-2.61l.42.1-1.14,8.08-.42-.15c0-.28,0-.52.05-.73s0-.37,0-.51a3.6,3.6,0,0,0-.46-2.15,2.14,2.14,0,0,0-1.75-.57l-1,7.2a4.7,4.7,0,0,0-.06.51c0,.16,0,.29,0,.39a1.12,1.12,0,0,0,.17.66.77.77,0,0,0,.69.26,3.77,3.77,0,0,0,2.37-.75A7.71,7.71,0,0,0,106.76,14.36ZM95.09,8.17a7.75,7.75,0,0,0,.49-1.62,10.75,10.75,0,0,0,.23-2.26,5.77,5.77,0,0,0-.32-2,1.11,1.11,0,0,0-1.08-.81.48.48,0,0,0-.46.26,3.44,3.44,0,0,0-.25,1.05L92.78,9.5A3.78,3.78,0,0,0,94,9.3,2.08,2.08,0,0,0,95.09,8.17Zm21.32,6.19a8.67,8.67,0,0,1-2,3.87,4,4,0,0,1-2.73,1,.89.89,0,0,1-.63-.21.93.93,0,0,1-.23-.7c0-.19,0-.35,0-.48s0-.28,0-.44l2-14.08a3.84,3.84,0,0,1,.46-1.64,2,2,0,0,1,1.08-.48V.48h-4.86v.76a2,2,0,0,1,.91.31,1.38,1.38,0,0,1,.21.94,5.56,5.56,0,0,1,0,.67c0,.26-.07.57-.12,1l-1.89,13.23a4.16,4.16,0,0,1-.43,1.6,1.27,1.27,0,0,1-.81.52v.76h8.51l.9-5.74Zm8.64,0a7.71,7.71,0,0,1-2.38,4.16,3.82,3.82,0,0,1-2.38.75.77.77,0,0,1-.69-.26,1.2,1.2,0,0,1-.17-.66c0-.1,0-.23,0-.39a4.7,4.7,0,0,1,.06-.51l1-7.2a2.17,2.17,0,0,1,1.76.57,3.69,3.69,0,0,1,.45,2.15c0,.14,0,.31,0,.51s0,.45,0,.73l.42.15,1.13-8.08-.42-.1a6.79,6.79,0,0,1-1,2.61,3.63,3.63,0,0,1-2.09.51l.91-6.56a2.87,2.87,0,0,1,.29-1.06c.12-.19.38-.28.78-.28A2.3,2.3,0,0,1,125,2.91a9.57,9.57,0,0,1,.36,3l.41.13.65-5.6h-8.26v.76a1.93,1.93,0,0,1,.91.31,1.45,1.45,0,0,1,.2.94,6.28,6.28,0,0,1,0,.7c0,.28-.07.58-.11.92l-1.89,13.24a4.35,4.35,0,0,1-.43,1.59,1.33,1.33,0,0,1-.81.52v.76h8.5l.91-5.74Zm10.29,5.15v.71h-4.65v-.71a1.44,1.44,0,0,0,.93-.41,2.08,2.08,0,0,0,.27-1.29c0-.22,0-.75-.08-1.58,0-.17-.06-.89-.15-2.15h-3.31l-.89,3a5.32,5.32,0,0,0-.16.66,3.4,3.4,0,0,0-.08.69,1.06,1.06,0,0,0,.2.78,1.68,1.68,0,0,0,.79.3v.71h-3v-.71a1.8,1.8,0,0,0,.63-.53,6.45,6.45,0,0,0,.67-1.56L132.19.07h.4L134.06,17a7.15,7.15,0,0,0,.36,2.08A1.13,1.13,0,0,0,135.34,19.51Zm-3.79-6.6L131,5.73l-2.27,7.18Zm9.6-4-1.32-2.09a4.57,4.57,0,0,1-.47-.94,5.12,5.12,0,0,1-.28-1.78,5.57,5.57,0,0,1,.27-1.77c.27-.83.7-1.24,1.29-1.24s1.21.51,1.57,1.54A8.78,8.78,0,0,1,142.65,5l.06,1,.39.1.63-5.91h-.46a2.09,2.09,0,0,1-.25.54.46.46,0,0,1-.41.21.57.57,0,0,1-.24-.05,1.23,1.23,0,0,1-.26-.12l-.39-.24a2.34,2.34,0,0,0-.5-.25,2.41,2.41,0,0,0-.85-.16,2.55,2.55,0,0,0-2.31,1.67,9.11,9.11,0,0,0-.83,4.05,10.47,10.47,0,0,0,1.88,5.5A9.21,9.21,0,0,1,141,16a6.49,6.49,0,0,1-.5,2.63,1.59,1.59,0,0,1-1.43,1.14,1.42,1.42,0,0,1-1-.4,3.55,3.55,0,0,1-.78-1.16,7.09,7.09,0,0,1-.52-1.92c-.05-.43-.1-1.12-.13-2.06l-.44-.06-.55,6.62h.46a4.11,4.11,0,0,1,.25-.82.36.36,0,0,1,.36-.23.47.47,0,0,1,.17,0,2.38,2.38,0,0,1,.27.18l.39.27a3.52,3.52,0,0,0,.84.43,2.48,2.48,0,0,0,.84.15,2.91,2.91,0,0,0,2.63-1.88,9.24,9.24,0,0,0,1-4.21,9.85,9.85,0,0,0-.49-3.24A12.1,12.1,0,0,0,141.15,8.92Zm7.75-7.24c.12-.19.38-.28.78-.28a2.3,2.3,0,0,1,2.38,1.51,9.57,9.57,0,0,1,.36,3l.41.13.65-5.6h-8.26v.76a1.93,1.93,0,0,1,.91.31c.14.13.2.44.2.94a6.28,6.28,0,0,1,0,.7c0,.28-.07.58-.11.92l-1.89,13.24a4.35,4.35,0,0,1-.43,1.59,1.33,1.33,0,0,1-.81.52v.76h8.5l.91-5.74-.38-.12a7.71,7.71,0,0,1-2.38,4.16,3.82,3.82,0,0,1-2.38.75.77.77,0,0,1-.69-.26,1.2,1.2,0,0,1-.17-.66c0-.1,0-.23,0-.39a4.7,4.7,0,0,1,.06-.51l1-7.2a2.17,2.17,0,0,1,1.76.57,3.69,3.69,0,0,1,.45,2.15c0,.14,0,.31,0,.51s0,.45,0,.73l.42.15,1.14-8.08-.43-.1a6.79,6.79,0,0,1-1.05,2.61,3.63,3.63,0,0,1-2.09.51l.91-6.56A2.87,2.87,0,0,1,148.9,1.68Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 153.485, height: 20.812, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Not For Public Release': {
                stampCollection = {
                    iconName: 'Not For Public Release',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M9,2.35q-.21.9-.51,3.48L6.69,21.05H6.38L3.11,4.45,1.85,15.19c-.1.89-.17,1.56-.2,2s0,.55,0,.81A2.39,2.39,0,0,0,2,19.45a1.09,1.09,0,0,0,.67.33v.77H0v-.77a1.22,1.22,0,0,0,.71-.91,33.91,33.91,0,0,0,.57-3.68L2.7,2.88l-.06-.3a2.09,2.09,0,0,0-.39-1.07,1,1,0,0,0-.59-.25V.48H4.2L6.93,14.36l1-8.49c.06-.53.11-1,.14-1.4.06-.63.08-1.08.08-1.37a2.67,2.67,0,0,0-.3-1.5,1.07,1.07,0,0,0-.69-.34V.48H9.73v.78l-.18.06C9.29,1.41,9.09,1.75,9,2.35ZM16.74,2a13.19,13.19,0,0,1,.87,5.28,27.45,27.45,0,0,1-1.54,9.22q-1.65,4.66-3.79,4.67-1.35,0-2.19-1.95a13.31,13.31,0,0,1-.85-5.23A27.59,27.59,0,0,1,10.82,4.6C11.91,1.53,13.15,0,14.51,0,15.41,0,16.16.65,16.74,2Zm-.95,2.73a9.33,9.33,0,0,0-.31-2.59c-.21-.72-.54-1.08-1-1.08-1.05,0-1.92,2.21-2.64,6.64a54.69,54.69,0,0,0-.81,8.4,14.21,14.21,0,0,0,.15,2.23c.2,1.2.57,1.8,1.1,1.8s.95-.43,1.35-1.31a22.84,22.84,0,0,0,1.26-5c.28-1.55.49-3.19.65-4.91S15.79,5.74,15.79,4.68Zm2.3.93.32.21A10.7,10.7,0,0,1,19.52,2.6a1.87,1.87,0,0,1,1.6-1.08L19.27,17.63a4,4,0,0,1-.52,1.88,1,1,0,0,1-.79.27v.77h4.17v-.77a1.72,1.72,0,0,1-.85-.3,1.56,1.56,0,0,1-.2-1,2.44,2.44,0,0,1,0-.27c0-.08,0-.2,0-.33l.11-1L23,1.52A1.31,1.31,0,0,1,24,2.17a8.49,8.49,0,0,1,.69,4l.33.07L25.5.48H18.57ZM28.75.48v.78a1.39,1.39,0,0,1,.74.31,1.44,1.44,0,0,1,.18.9q0,.36-.06,1c0,.2-.05.44-.07.71L28,17.62a5.34,5.34,0,0,1-.35,1.61,1.05,1.05,0,0,1-.67.55v.77H30.7v-.77a.82.82,0,0,1-.6-.2,1.69,1.69,0,0,1-.31-1.18c0-.11,0-.22,0-.32l0-.35.83-7.33a1.42,1.42,0,0,1,1.4.64,5,5,0,0,1,.33,2.13c0,.12,0,.28,0,.5s0,.47,0,.76l.34.15.94-8.21-.35-.1a8.12,8.12,0,0,1-.85,2.64,2.42,2.42,0,0,1-1.64.52l.74-6.65a3.34,3.34,0,0,1,.25-1.1.64.64,0,0,1,.59-.26A1.91,1.91,0,0,1,34.28,3a11.32,11.32,0,0,1,.29,3.06l.34.13.54-5.7Zm15,6.75a27.46,27.46,0,0,1-1.55,9.22q-1.65,4.66-3.79,4.67-1.35,0-2.19-1.95a13.49,13.49,0,0,1-.85-5.23A27.59,27.59,0,0,1,37,4.6Q38.65,0,40.69,0c.91,0,1.65.65,2.23,2A13.17,13.17,0,0,1,43.8,7.23ZM42,4.68a9.3,9.3,0,0,0-.32-2.59c-.21-.72-.53-1.08-1-1.08Q39.12,1,38,7.65a54.69,54.69,0,0,0-.81,8.4,13,13,0,0,0,.16,2.23c.2,1.2.56,1.8,1.09,1.8s1-.43,1.35-1.31a23.28,23.28,0,0,0,1.27-5c.27-1.55.49-3.19.64-4.91S42,5.74,42,4.68ZM50.32,1c.78.66,1.17,1.93,1.17,3.8a11,11,0,0,1-.19,2,7.2,7.2,0,0,1-.66,1.93,3.45,3.45,0,0,1-.77,1,5.58,5.58,0,0,1-.8.52c0,.31.07.51.08.58l1,6.78a5.63,5.63,0,0,0,.42,1.72.85.85,0,0,0,.69.42v.77H48.69l-1.36-9.92H47l-.75,6.25-.1,1c0,.08,0,.16,0,.26v.28a1.94,1.94,0,0,0,.16,1,1.39,1.39,0,0,0,.75.32v.77H43.27v-.77a1.07,1.07,0,0,0,.66-.53,4.83,4.83,0,0,0,.36-1.61L45.84,4.18c0-.28.06-.52.08-.72,0-.42,0-.75,0-1a1.48,1.48,0,0,0-.17-.91,1.39,1.39,0,0,0-.74-.31V.48h3.46A2.67,2.67,0,0,1,50.32,1Zm-.73,3.34a7.2,7.2,0,0,0-.26-2.09c-.18-.55-.47-.83-.89-.83a.4.4,0,0,0-.38.27,4.46,4.46,0,0,0-.2,1.06L47.1,9.65a2.39,2.39,0,0,0,1-.2A2,2,0,0,0,49,8.31a10,10,0,0,0,.4-1.65A12.71,12.71,0,0,0,49.59,4.37Zm11.1-3.3c.77.74,1.16,2.1,1.16,4.09a8.51,8.51,0,0,1-.94,4.28A2.78,2.78,0,0,1,58.48,11h-.36l-.73-.12-.69,6-.11,1c0,.1,0,.2,0,.3s0,.2,0,.3a1.7,1.7,0,0,0,.17.95,1.47,1.47,0,0,0,.75.32v.77H53.77v-.77a1.07,1.07,0,0,0,.66-.53,4.83,4.83,0,0,0,.36-1.61L56.34,4.17l.09-.9c0-.31,0-.55,0-.74a1.58,1.58,0,0,0-.25-1,1.33,1.33,0,0,0-.67-.23V.48h3.62A2.11,2.11,0,0,1,60.69,1.07ZM60,4.32a7,7,0,0,0-.25-2.06c-.17-.53-.45-.8-.84-.8a.4.4,0,0,0-.4.29,6.14,6.14,0,0,0-.2,1L57.5,9.93l.23.06h.21a1.3,1.3,0,0,0,1-.36,3.17,3.17,0,0,0,.6-1.2,12.69,12.69,0,0,0,.36-2A19.64,19.64,0,0,0,60,4.32Zm10.6-3.06V.48H68v.78a1.17,1.17,0,0,1,.68.32A2.43,2.43,0,0,1,69,3.05c0,.32,0,.85-.11,1.6,0-.12,0,.27-.12,1.18l-.73,6.26a36.28,36.28,0,0,1-.8,4.86c-.45,1.65-1.07,2.47-1.87,2.47a1.27,1.27,0,0,1-1.13-.78,5.05,5.05,0,0,1-.41-2.27c0-.43,0-1.1.13-2,.05-.51.12-1.17.21-2l1-9a4.69,4.69,0,0,1,.38-1.69,1.24,1.24,0,0,1,.8-.47V.48H62.55v.78a1.39,1.39,0,0,1,.74.31,1.56,1.56,0,0,1,.17.91c0,.21,0,.47,0,.76s-.06.6-.1.94l-.85,7.36c-.14,1.15-.23,2-.27,2.42-.06.76-.1,1.44-.1,2a7.4,7.4,0,0,0,.81,3.78,2.35,2.35,0,0,0,2,1.35c1.14,0,2-.91,2.6-2.74a35.69,35.69,0,0,0,1-5.7l.79-6.85a30.83,30.83,0,0,1,.58-3.7A1.15,1.15,0,0,1,70.61,1.26Zm5.86,10a7.16,7.16,0,0,1,.56,3.1,10.31,10.31,0,0,1-.86,4.34,2.93,2.93,0,0,1-2.86,1.87h-3.8v-.77a1.07,1.07,0,0,0,.59-.41,4.64,4.64,0,0,0,.43-1.73L72.08,4.17c0-.4.08-.73.1-1s0-.46,0-.61a1.83,1.83,0,0,0-.19-1,1.22,1.22,0,0,0-.73-.28V.48h3.43a2.58,2.58,0,0,1,2.19,1.06A5.92,5.92,0,0,1,77.69,5a6.3,6.3,0,0,1-1,3.67,4.18,4.18,0,0,1-1.39,1.24A4.36,4.36,0,0,1,76.47,11.24Zm-1.36,2.49a4.59,4.59,0,0,0-.6-2.79,2,2,0,0,0-1.3-.52l-.84,7.32c0,.12,0,.25,0,.4s0,.33,0,.52a1.06,1.06,0,0,0,.27.84.77.77,0,0,0,.48.11c.8,0,1.38-.87,1.73-2.63A17.3,17.3,0,0,0,75.11,13.73Zm.1-5.38a7.33,7.33,0,0,0,.52-2.15,15,15,0,0,0,.11-1.77,7.89,7.89,0,0,0-.24-2.14c-.16-.55-.46-.83-.93-.83a.42.42,0,0,0-.4.33,4.42,4.42,0,0,0-.19,1l-.77,6.73a5.23,5.23,0,0,0,1.27-.36A1.77,1.77,0,0,0,75.21,8.35Zm9.61,6.24a9.73,9.73,0,0,1-1.66,3.94,2.93,2.93,0,0,1-2.25,1,.64.64,0,0,1-.51-.21,1,1,0,0,1-.19-.71c0-.19,0-.35,0-.49s0-.29,0-.44L81.91,3.41a4.53,4.53,0,0,1,.38-1.66,1.47,1.47,0,0,1,.88-.49V.48h-4v.78a1.39,1.39,0,0,1,.75.32,1.59,1.59,0,0,1,.18.95c0,.2,0,.43,0,.68s0,.58-.1,1L78.42,17.62a5.28,5.28,0,0,1-.35,1.63,1.12,1.12,0,0,1-.67.53v.77h7l.73-5.83ZM90.09,1.26V.48H86.34v.78a1.38,1.38,0,0,1,.74.32,1.59,1.59,0,0,1,.18.95q0,.3,0,.69c0,.25-.06.57-.11.95L85.58,17.64a5.41,5.41,0,0,1-.36,1.61,1.07,1.07,0,0,1-.66.53v.77h3.75v-.77a1.47,1.47,0,0,1-.75-.32,1.78,1.78,0,0,1-.17-1c0-.08,0-.18,0-.28s0-.2,0-.3l.1-1L89.07,3.41a5.68,5.68,0,0,1,.35-1.62A1.1,1.1,0,0,1,90.09,1.26Zm7-.62a.33.33,0,0,1-.3.24,3.1,3.1,0,0,1-.82-.44A2.5,2.5,0,0,0,94.59,0Q92.51,0,91,4a26.57,26.57,0,0,0-1.51,9.39,13.57,13.57,0,0,0,1,5.67c.66,1.41,1.49,2.11,2.5,2.11A2.46,2.46,0,0,0,94.79,20a9.66,9.66,0,0,0,1.55-3.4L96,16a12.68,12.68,0,0,1-.89,2.13c-.54,1-1.12,1.45-1.74,1.45-.47,0-.91-.39-1.31-1.15a10.33,10.33,0,0,1-.6-4.27,36.59,36.59,0,0,1,1-8.43c.72-3.08,1.57-4.63,2.54-4.63.48,0,.88.39,1.19,1.16a10,10,0,0,1,.47,3.53V6.1c0,.07,0,.32,0,.74L97,7l.64-7h-.38A4.28,4.28,0,0,1,97,.64Zm17.57,14,.31.13-.75,5.83h-9.45l-1.35-9.92H103l-.74,6.25-.11,1c0,.08,0,.16,0,.26v.28a1.94,1.94,0,0,0,.16,1,1.39,1.39,0,0,0,.75.32v.77H99.3v-.77a1.12,1.12,0,0,0,.67-.53,5.18,5.18,0,0,0,.35-1.61l1.55-13.46c0-.28.06-.52.08-.72,0-.42,0-.75,0-1a1.48,1.48,0,0,0-.17-.91,1.39,1.39,0,0,0-.74-.31V.48h3.46a2.64,2.64,0,0,1,1.8.55c.78.66,1.17,1.93,1.17,3.8a11,11,0,0,1-.19,2,6.57,6.57,0,0,1-.66,1.93,3.61,3.61,0,0,1-.76,1,6.48,6.48,0,0,1-.81.52c0,.31.07.51.08.58l1,6.78a5.63,5.63,0,0,0,.42,1.72.84.84,0,0,0,.65.4,1.06,1.06,0,0,0,.64-.51,5.41,5.41,0,0,0,.36-1.61l1.54-13.47c0-.34.07-.65.1-.92s0-.52,0-.72a1.61,1.61,0,0,0-.17-.95,1.31,1.31,0,0,0-.74-.32V.48h6.78l-.53,5.7-.34-.13a11.8,11.8,0,0,0-.3-3.09,1.92,1.92,0,0,0-2-1.54c-.33,0-.55.1-.64.29a3.46,3.46,0,0,0-.24,1.07L111,9.45a2.6,2.6,0,0,0,1.72-.51,7.79,7.79,0,0,0,.86-2.66l.35.11-.93,8.2-.35-.15c0-.28,0-.53,0-.74v-.52a4.42,4.42,0,0,0-.37-2.18,1.56,1.56,0,0,0-1.44-.58l-.83,7.32c0,.18,0,.35,0,.51s0,.3,0,.4a1.45,1.45,0,0,0,.13.67c.09.18.28.26.57.26a2.72,2.72,0,0,0,2-.76A8.33,8.33,0,0,0,114.61,14.59ZM105,8.31a9.81,9.81,0,0,0,.41-1.65,13.72,13.72,0,0,0,.18-2.29,6.87,6.87,0,0,0-.26-2.09c-.17-.55-.47-.83-.89-.83a.4.4,0,0,0-.38.27,5.05,5.05,0,0,0-.2,1.06l-.76,6.87a2.39,2.39,0,0,0,1-.2A2,2,0,0,0,105,8.31Zm17.51,6.28a9.86,9.86,0,0,1-1.67,3.94,2.93,2.93,0,0,1-2.25,1,.64.64,0,0,1-.51-.21,1.1,1.1,0,0,1-.19-.71c0-.19,0-.35,0-.49s0-.29,0-.44l1.64-14.32A4.53,4.53,0,0,1,120,1.75a1.47,1.47,0,0,1,.89-.49V.48h-4v.78a1.39,1.39,0,0,1,.75.32,1.59,1.59,0,0,1,.18.95c0,.2,0,.43,0,.68s0,.58-.1,1l-1.55,13.45a5.28,5.28,0,0,1-.35,1.63,1.1,1.1,0,0,1-.66.53v.77h7l.74-5.83Zm7.09,0a8.33,8.33,0,0,1-2,4.23,2.73,2.73,0,0,1-2,.76c-.29,0-.48-.08-.57-.26a1.45,1.45,0,0,1-.13-.67c0-.1,0-.23,0-.4s0-.33,0-.51l.83-7.32a1.58,1.58,0,0,1,1.44.58,4.42,4.42,0,0,1,.37,2.18c0,.14,0,.31,0,.52s0,.46,0,.74l.34.15.94-8.2-.35-.11a7.71,7.71,0,0,1-.87,2.66,2.56,2.56,0,0,1-1.71.51l.75-6.67A3.46,3.46,0,0,1,127,1.71c.09-.19.31-.29.64-.29a1.92,1.92,0,0,1,2,1.54,11.8,11.8,0,0,1,.3,3.09l.33.13.54-5.7H124v.78a1.31,1.31,0,0,1,.75.32,1.7,1.7,0,0,1,.17.95,6.75,6.75,0,0,1,0,.72c0,.27-.05.58-.09.92l-1.55,13.47a5.18,5.18,0,0,1-.35,1.61,1.12,1.12,0,0,1-.67.53v.77h7l.75-5.83Zm8.45,5.24v.72h-3.83v-.72a1.11,1.11,0,0,0,.77-.41,2.52,2.52,0,0,0,.23-1.31c0-.23,0-.77-.07-1.62,0-.17-.05-.9-.13-2.18h-2.71l-.74,3c0,.2-.09.43-.13.67a4.44,4.44,0,0,0-.06.71,1.27,1.27,0,0,0,.16.79,1.35,1.35,0,0,0,.65.3v.72h-2.47v-.72a1.66,1.66,0,0,0,.52-.54,7.25,7.25,0,0,0,.55-1.58L135.49.07h.33L137,17.23a8.87,8.87,0,0,0,.3,2.11A.9.9,0,0,0,138.08,19.83ZM135,13.12l-.47-7.3-1.86,7.3Zm7.88-4-1.09-2.13a6.38,6.38,0,0,1-.39-1,6.65,6.65,0,0,1-.23-1.82,6.93,6.93,0,0,1,.23-1.8q.33-1.26,1-1.26c.57,0,1,.53,1.3,1.57a10.87,10.87,0,0,1,.36,2.39l0,1,.33.1.51-6h-.38a2.26,2.26,0,0,1-.2.54.38.38,0,0,1-.34.22.54.54,0,0,1-.19-.05l-.22-.13-.32-.25a2.36,2.36,0,0,0-.41-.25,1.82,1.82,0,0,0-.7-.16c-.81,0-1.44.57-1.9,1.7a11.21,11.21,0,0,0-.68,4.12,12.36,12.36,0,0,0,1.55,5.58,10.74,10.74,0,0,1,1.54,4.78,7.8,7.8,0,0,1-.41,2.67c-.28.76-.67,1.15-1.17,1.15a1.07,1.07,0,0,1-.79-.4,3.78,3.78,0,0,1-.64-1.18,7.79,7.79,0,0,1-.42-1.95c-.05-.44-.08-1.14-.11-2.1l-.36-.06-.46,6.73h.38a6.32,6.32,0,0,1,.2-.83.31.31,0,0,1,.3-.24.21.21,0,0,1,.14,0,1.06,1.06,0,0,1,.22.18l.32.27a3,3,0,0,0,.69.44,1.72,1.72,0,0,0,.69.15c.92,0,1.64-.63,2.16-1.91a11.22,11.22,0,0,0,.78-4.28,12.2,12.2,0,0,0-.4-3.29A14.21,14.21,0,0,0,142.85,9.07Zm6.36-7.36c.09-.19.31-.29.64-.29a1.92,1.92,0,0,1,2,1.54,11.8,11.8,0,0,1,.3,3.09l.33.13L153,.48h-6.79v.78a1.31,1.31,0,0,1,.75.32,1.7,1.7,0,0,1,.17.95,6.75,6.75,0,0,1,0,.72c0,.27-.05.58-.09.92l-1.55,13.47a5.18,5.18,0,0,1-.35,1.61,1.12,1.12,0,0,1-.67.53v.77h7l.75-5.83-.31-.13a8.33,8.33,0,0,1-2,4.23,2.73,2.73,0,0,1-2,.76c-.29,0-.48-.08-.57-.26a1.45,1.45,0,0,1-.13-.67c0-.1,0-.23,0-.4s0-.33.05-.51l.83-7.32a1.58,1.58,0,0,1,1.44.58,4.42,4.42,0,0,1,.37,2.18c0,.14,0,.31,0,.52s0,.46,0,.74l.34.15.94-8.2-.35-.11a7.71,7.71,0,0,1-.87,2.66,2.56,2.56,0,0,1-1.71.51L149,2.78A3.46,3.46,0,0,1,149.21,1.71Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 152.969, height: 21.152, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'For Comment': {
                stampCollection = {
                    iconName: 'For Comment',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M14.1.48l-.89,5.6L12.65,6a7.14,7.14,0,0,0-.48-3c-.54-1-1.6-1.54-3.19-1.54a1.37,1.37,0,0,0-1,.26,2.06,2.06,0,0,0-.42,1.08L6.35,9.28a6,6,0,0,0,2.73-.52,5.92,5.92,0,0,0,1.41-2.59l.58.1L9.52,14.34,9,14.2c0-.29,0-.54.05-.75s0-.38,0-.49a3.15,3.15,0,0,0-.55-2.09,3.07,3.07,0,0,0-2.32-.64L4.77,17.44c0,.13,0,.24-.06.35s0,.21,0,.31a1.23,1.23,0,0,0,.53,1.17,2,2,0,0,0,1,.19v.76H0v-.76a1.91,1.91,0,0,0,1.12-.54,3.56,3.56,0,0,0,.58-1.58L4.27,4.11c.05-.27.09-.51.12-.71a7.42,7.42,0,0,0,.1-1c0-.48-.1-.77-.29-.9A3.54,3.54,0,0,0,3,1.24V.48ZM28,7.11a17.42,17.42,0,0,1-2.57,9.07q-2.75,4.61-6.3,4.6a4.33,4.33,0,0,1-3.65-1.92,8.53,8.53,0,0,1-1.41-5.14,17.56,17.56,0,0,1,2.62-9.19Q19.43,0,22.82,0a4.48,4.48,0,0,1,3.72,1.92A8.46,8.46,0,0,1,28,7.11ZM25,4.6a5.72,5.72,0,0,0-.52-2.55,1.72,1.72,0,0,0-1.63-1c-1.74,0-3.2,2.17-4.39,6.53a32.66,32.66,0,0,0-1.35,8.26,8.24,8.24,0,0,0,.26,2.2c.33,1.18.94,1.77,1.82,1.77a2.88,2.88,0,0,0,2.25-1.29,16.48,16.48,0,0,0,2.1-4.93,37.09,37.09,0,0,0,1.07-4.83A28.26,28.26,0,0,0,25,4.6Zm15.83.16a6.49,6.49,0,0,1-.33,2,5.12,5.12,0,0,1-1.09,1.9,4.65,4.65,0,0,1-1.27,1,11.5,11.5,0,0,1-1.35.52c.07.3.12.49.14.57l1.62,6.66a3.79,3.79,0,0,0,.7,1.7,1.75,1.75,0,0,0,1.14.41v.76H36.13l-2.26-9.76h-.59L32,16.6l-.17,1,0,.25a2.62,2.62,0,0,0,0,.28q0,.8.27,1a3,3,0,0,0,1.25.32v.76H27.11v-.76a1.93,1.93,0,0,0,1.11-.52,3.54,3.54,0,0,0,.59-1.59L31.38,4.11c.06-.27.1-.51.13-.71a6,6,0,0,0,.1-1c0-.47-.1-.77-.29-.9a3.54,3.54,0,0,0-1.24-.3V.48h5.76a6.77,6.77,0,0,1,3,.53Q40.79,2,40.79,4.76Zm-3.16-.47a4.35,4.35,0,0,0-.44-2,1.54,1.54,0,0,0-1.48-.81.75.75,0,0,0-.63.26,2.78,2.78,0,0,0-.33,1.05L33.48,9.5a6.85,6.85,0,0,0,1.67-.2,2.55,2.55,0,0,0,1.49-1.13,6.37,6.37,0,0,0,.67-1.62A7.81,7.81,0,0,0,37.63,4.29ZM58.49,0a2.61,2.61,0,0,1-.32.63.55.55,0,0,1-.49.24A7,7,0,0,1,56.31.43,6.15,6.15,0,0,0,54.1,0q-3.47,0-6,3.92a16.73,16.73,0,0,0-2.51,9.24,8.73,8.73,0,0,0,1.64,5.57,5,5,0,0,0,7.19,1A8.89,8.89,0,0,0,57,16.37l-.64-.65a10.47,10.47,0,0,1-1.47,2.09A4,4,0,0,1,52,19.24a2.89,2.89,0,0,1-2.17-1.13c-.67-.75-1-2.15-1-4.2a22.2,22.2,0,0,1,1.62-8.29q1.8-4.54,4.23-4.55a2.33,2.33,0,0,1,2,1.14,6.16,6.16,0,0,1,.78,3.47c0,.14,0,.25,0,.32s0,.32,0,.73l.66.17L59.12,0ZM72.71,7.11a17.33,17.33,0,0,1-2.57,9.07c-1.82,3.07-3.93,4.6-6.3,4.6a4.34,4.34,0,0,1-3.65-1.92,8.53,8.53,0,0,1-1.4-5.14A17.55,17.55,0,0,1,61.4,4.53Q64.15,0,67.54,0a4.48,4.48,0,0,1,3.72,1.92A8.39,8.39,0,0,1,72.71,7.11Zm-3-2.51a5.72,5.72,0,0,0-.52-2.55,1.72,1.72,0,0,0-1.63-1c-1.74,0-3.2,2.17-4.39,6.53a32.66,32.66,0,0,0-1.35,8.26,8.24,8.24,0,0,0,.26,2.2c.33,1.18.94,1.77,1.82,1.77a2.85,2.85,0,0,0,2.25-1.29,16,16,0,0,0,2.1-4.93,34.08,34.08,0,0,0,1.07-4.83A28.26,28.26,0,0,0,69.68,4.6Zm17.5,13.62a4.63,4.63,0,0,1,.07-.75c0-.3.09-.59.15-.88L90,3.31a3.32,3.32,0,0,1,.7-1.67,2,2,0,0,1,1-.4V.48H87.23l-6.4,13.91L79.63.48H74.84v.76a3.29,3.29,0,0,1,1.2.21c.21.11.31.37.31.78a4.35,4.35,0,0,1-.07.75c0,.28-.11.61-.18,1L74,15a19.63,19.63,0,0,1-1,3.65,1.54,1.54,0,0,1-1.17.86v.76H76.2v-.76a2.31,2.31,0,0,1-1.09-.29,1.6,1.6,0,0,1-.58-1.43,8.8,8.8,0,0,1,.14-1.42c0-.37.14-.82.24-1.37L77,4.24l1.41,16.37H79L86.89,3.76,84.25,17.34A2.94,2.94,0,0,1,83.61,19a2.87,2.87,0,0,1-1.44.49v.76h6.54v-.76a3.39,3.39,0,0,1-1.23-.31Q87.18,19,87.18,18.22Zm17.73,0a4.63,4.63,0,0,1,.07-.75c0-.3.1-.59.16-.88l2.58-13.28a3.24,3.24,0,0,1,.69-1.67,2,2,0,0,1,1-.4V.48H105l-6.4,13.91L97.36.48H92.57v.76a3.29,3.29,0,0,1,1.2.21c.21.11.32.37.32.78A5.65,5.65,0,0,1,94,3c0,.28-.11.61-.19,1L91.69,15a19.63,19.63,0,0,1-1,3.65,1.54,1.54,0,0,1-1.17.86v.76h4.38v-.76a2.33,2.33,0,0,1-1.1-.29,1.6,1.6,0,0,1-.58-1.43,10.12,10.12,0,0,1,.14-1.42c.06-.37.14-.82.25-1.37L94.76,4.24l1.41,16.37h.59l7.86-16.85L102,17.34a3.1,3.1,0,0,1-.64,1.63,3,3,0,0,1-1.45.49v.76h6.55v-.76a3.46,3.46,0,0,1-1.24-.31Q104.91,19,104.91,18.22Zm11.52.3a6.56,6.56,0,0,1-3.25.75,1.27,1.27,0,0,1-.94-.26,1,1,0,0,1-.22-.66,3,3,0,0,1,0-.39,4.88,4.88,0,0,1,.08-.51l1.38-7.2a3.65,3.65,0,0,1,2.4.57,2.92,2.92,0,0,1,.62,2.15c0,.14,0,.31,0,.51s0,.45-.06.73l.58.15,1.55-8.08-.58-.1a5.92,5.92,0,0,1-1.44,2.61,6.32,6.32,0,0,1-2.85.51L115,2.74a2.44,2.44,0,0,1,.39-1.06,1.43,1.43,0,0,1,1.07-.28c1.63,0,2.71.5,3.25,1.51a7.37,7.37,0,0,1,.49,3l.56.13.89-5.6H110.31v.76a3.28,3.28,0,0,1,1.25.31c.19.13.28.44.28.94a4.83,4.83,0,0,1-.06.7c0,.28-.09.58-.16.92l-2.57,13.24a3.54,3.54,0,0,1-.59,1.59,1.93,1.93,0,0,1-1.11.52v.76H119l1.24-5.74-.51-.12A7.7,7.7,0,0,1,116.43,18.52ZM136.6,1.24V.48h-4.3v.76a2.5,2.5,0,0,1,1.14.33A1.8,1.8,0,0,1,134,3.05a10.58,10.58,0,0,1-.14,1.34c-.05.41-.13.87-.22,1.39L132,14.12,127.41.48h-4.22v.76a2.53,2.53,0,0,1,1,.24,1.82,1.82,0,0,1,.64,1.06l.1.3L122.55,15a19.54,19.54,0,0,1-1,3.61,1.59,1.59,0,0,1-1.18.9v.76h4.37v-.76a2.5,2.5,0,0,1-1.12-.32,1.67,1.67,0,0,1-.55-1.44,5.32,5.32,0,0,1,0-.79c0-.43.17-1.09.34-2l2.08-10.57L131,20.71h.52l2.91-15a24.72,24.72,0,0,1,.85-3.42,1.42,1.42,0,0,1,1-1Zm.48-.76-.81,5,.54.2a8.1,8.1,0,0,1,1.85-3.16,3.63,3.63,0,0,1,2.66-1.06l-3.08,15.85a3,3,0,0,1-.86,1.85,2.42,2.42,0,0,1-1.32.26v.76H143v-.76a4,4,0,0,1-1.41-.3c-.23-.13-.34-.45-.34-.95a2.26,2.26,0,0,1,0-.26c0-.09,0-.2,0-.33l.17-1,2.92-15.1a2.64,2.64,0,0,1,1.76.63c.74.7,1.12,2,1.15,3.94l.55.07L148.6.48Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 148.603, height: 20.812, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Void': {
                stampCollection = {
                    iconName: 'Void',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M27.88,1.72a6.53,6.53,0,0,0-1.81,1.42L9,21.12H7.54L4.09,5.83A11.83,11.83,0,0,0,2.82,2Q2.3,1.4,0,1.26V.48H13.54v.78a11,11,0,0,0-2.37.18q-1.11.27-1.11,1.05a1.43,1.43,0,0,0,0,.29c0,.09,0,.19,0,.28l2.35,12,8.56-9a25.11,25.11,0,0,0,1.83-2.14,3.15,3.15,0,0,0,.82-1.68c0-.41-.28-.69-.84-.82a12.57,12.57,0,0,0-2.08-.15V.48h8.7v.78A7.11,7.11,0,0,0,27.88,1.72ZM57.37,7.23q0,4.85-5.56,9.22a21.41,21.41,0,0,1-13.62,4.67,14.41,14.41,0,0,1-7.89-1.95,6,6,0,0,1-3-5.23q0-4.92,5.66-9.34A21.12,21.12,0,0,1,46.2,0a15,15,0,0,1,8,2A6,6,0,0,1,57.37,7.23ZM50.82,4.68a3.46,3.46,0,0,0-1.13-2.59A4.93,4.93,0,0,0,46.17,1q-5.64,0-9.49,6.64c-1.94,3.36-2.92,6.16-2.92,8.4a4.27,4.27,0,0,0,.56,2.23q1.08,1.8,3.93,1.8a9.24,9.24,0,0,0,4.87-1.31,15.24,15.24,0,0,0,4.54-5A21.81,21.81,0,0,0,50,8.85,14.23,14.23,0,0,0,50.82,4.68ZM66,18.49a1.49,1.49,0,0,1,0-.28c0-.1,0-.2.08-.3l.35-1L72,3.41a2.94,2.94,0,0,1,1.25-1.62,6.79,6.79,0,0,1,2.4-.53V.48H62.19v.78a13.27,13.27,0,0,1,2.67.32.88.88,0,0,1,.64.95,2.38,2.38,0,0,1-.12.69c-.08.25-.2.57-.36.95L59.45,17.64a3,3,0,0,1-1.28,1.61,6.84,6.84,0,0,1-2.39.53v.77H69.27v-.77a13.72,13.72,0,0,1-2.67-.32A.9.9,0,0,1,66,18.49Zm38.25-9.67q0,4.59-5.15,8-5.73,3.77-15,3.76h-13v-.77a7.4,7.4,0,0,0,2.1-.41,3.08,3.08,0,0,0,1.57-1.75L80.28,4.17c.16-.38.28-.7.37-1a2.27,2.27,0,0,0,.12-.68.89.89,0,0,0-.64-.95,13.41,13.41,0,0,0-2.68-.32V.48H90.6q6.68,0,10.15,2.27A6.92,6.92,0,0,1,104.23,8.82ZM97.58,7a5.28,5.28,0,0,0-1.13-3.54q-1.77-2-6.14-2a4.24,4.24,0,0,0-2,.32,1.77,1.77,0,0,0-.74.84L81.35,17.73a1.72,1.72,0,0,0-.12.39,1.89,1.89,0,0,0,0,.31.89.89,0,0,0,.54.85,5.1,5.1,0,0,0,2,.26q8.07,0,11.68-5.5A12.61,12.61,0,0,0,97.58,7Z',
                    opacity: 1, strokeColor: '', fillColor: '#8a251a', width: 104.233, height: 21.123, stampFillColor: '#f6dedd', stampStrokeColor: '',
                };
            }
                break;
            case 'Preliminary Results': {
                stampCollection = {
                    iconName: 'Preliminary Results',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M9.23,5.08q0-3-1.32-4.08A2.6,2.6,0,0,0,6.17.41H2v.78a1.5,1.5,0,0,1,.76.23,1.39,1.39,0,0,1,.28,1c0,.19,0,.43,0,.73s-.07.61-.1.91L1.17,17.56a4.76,4.76,0,0,1-.41,1.62A1.18,1.18,0,0,1,0,19.7v.78H4.25V19.7a1.77,1.77,0,0,1-.86-.31,1.5,1.5,0,0,1-.2-1c0-.09,0-.19,0-.3a1.36,1.36,0,0,1,0-.29l.12-1,.78-6L5,11h.41a3.21,3.21,0,0,0,2.78-1.6A7.57,7.57,0,0,0,9.23,5.08ZM7,6.32a10,10,0,0,1-.42,2,3,3,0,0,1-.68,1.21,1.63,1.63,0,0,1-1.13.36H4.53l-.27-.06,1-7.15a4.75,4.75,0,0,1,.22-1,.45.45,0,0,1,.46-.29,1,1,0,0,1,1,.8,6.22,6.22,0,0,1,.29,2.06A18,18,0,0,1,7,6.32ZM23.4,18.75a3.35,3.35,0,0,1-2.23.76.68.68,0,0,1-.64-.26,1.27,1.27,0,0,1-.16-.68c0-.09,0-.23,0-.39s0-.34.05-.51l.95-7.33a1.92,1.92,0,0,1,1.65.59,4,4,0,0,1,.42,2.18c0,.14,0,.31,0,.52s0,.46,0,.74l.4.15,1.07-8.21-.4-.1a7,7,0,0,1-1,2.65,3.15,3.15,0,0,1-2,.52l.85-6.67a3,3,0,0,1,.28-1.08c.11-.19.35-.28.73-.28a2.16,2.16,0,0,1,2.23,1.54A10.27,10.27,0,0,1,26,6l.39.13L27,.41H19.2v.78a1.67,1.67,0,0,1,.86.31,1.52,1.52,0,0,1,.19,1,6.58,6.58,0,0,1,0,.71c0,.28-.07.59-.11.93L18.33,17.56a4.59,4.59,0,0,1-.4,1.62,1.22,1.22,0,0,1-.74.51,1,1,0,0,1-.73-.4A5.08,5.08,0,0,1,16,17.56l-1.1-6.77c0-.08,0-.27-.1-.58a5.14,5.14,0,0,0,.92-.53,3.23,3.23,0,0,0,.87-1,6,6,0,0,0,.76-1.93,9.63,9.63,0,0,0,.22-2c0-1.87-.44-3.14-1.34-3.81a3.4,3.4,0,0,0-2-.54h-4v.78a1.78,1.78,0,0,1,.85.3,1.4,1.4,0,0,1,.19.91c0,.24,0,.56-.06,1,0,.21-.05.45-.09.73L9.31,17.56a4.53,4.53,0,0,1-.41,1.62,1.15,1.15,0,0,1-.75.52v.78h4.28V19.7a1.62,1.62,0,0,1-.86-.32,1.72,1.72,0,0,1-.18-1v-.29c0-.09,0-.18,0-.25l.12-1,.86-6.24h.4l1.55,9.92h10.8L26,14.65l-.35-.13A7.9,7.9,0,0,1,23.4,18.75ZM13.67,9.38a3.35,3.35,0,0,1-1.15.2l.87-6.87a4,4,0,0,1,.23-1.06.45.45,0,0,1,.43-.27,1.05,1.05,0,0,1,1,.83,6.14,6.14,0,0,1,.3,2.08,11.74,11.74,0,0,1-.21,2.29,9,9,0,0,1-.47,1.65A2,2,0,0,1,13.67,9.38ZM35,14.65l-.84,5.83h-8V19.7a1.24,1.24,0,0,0,.76-.52,4.73,4.73,0,0,0,.4-1.63L29.15,4.1q.08-.57.12-1c0-.26,0-.48,0-.68a1.42,1.42,0,0,0-.21-1,1.67,1.67,0,0,0-.85-.31V.41h4.56v.78a1.67,1.67,0,0,0-1,.49,4.17,4.17,0,0,0-.44,1.66L29.49,17.65c0,.16,0,.31,0,.45a3.47,3.47,0,0,0,0,.48,1,1,0,0,0,.21.72.8.8,0,0,0,.59.21,3.54,3.54,0,0,0,2.56-1.05,9.24,9.24,0,0,0,1.91-3.94Zm2.79,4.73a1.61,1.61,0,0,0,.85.32v.78H34.39V19.7a1.18,1.18,0,0,0,.76-.52,4.76,4.76,0,0,0,.41-1.62L37.33,4.1c.05-.38.09-.7.11-1a5.83,5.83,0,0,0,0-.68,1.5,1.5,0,0,0-.2-1,1.71,1.71,0,0,0-.85-.31V.41h4.29v.78a1.22,1.22,0,0,0-.77.52,4.9,4.9,0,0,0-.39,1.63L37.78,16.8l-.11,1,0,.29c0,.11,0,.2,0,.29A1.52,1.52,0,0,0,37.83,19.38Zm12.2,0a1.81,1.81,0,0,0,.85.31v.78h-4.5V19.7a1.64,1.64,0,0,0,1-.49,4,4,0,0,0,.44-1.66l1.81-13.8-5.4,17.12h-.4l-1-16.64L41.39,15.12c-.07.56-.13,1-.17,1.39-.06.61-.09,1.09-.09,1.45a2,2,0,0,0,.4,1.45,1.19,1.19,0,0,0,.75.29v.78h-3V19.7a1.21,1.21,0,0,0,.81-.87,29.47,29.47,0,0,0,.66-3.71L42.21,4c0-.38.09-.71.12-1a5.41,5.41,0,0,0,.05-.75c0-.42-.07-.69-.21-.8a1.69,1.69,0,0,0-.83-.21V.41h3.29l.83,14.14L49.85.41h3.07v.78a1.12,1.12,0,0,0-.69.41,4.08,4.08,0,0,0-.48,1.69L50,16.79c0,.29-.08.59-.11.89s0,.56,0,.76A1.41,1.41,0,0,0,50,19.39Zm5,0a1.61,1.61,0,0,0,.85.32v.78H51.56V19.7a1.18,1.18,0,0,0,.76-.52,4.76,4.76,0,0,0,.41-1.62L54.5,4.1c0-.38.09-.7.11-1a5.83,5.83,0,0,0,0-.68,1.5,1.5,0,0,0-.2-1,1.71,1.71,0,0,0-.85-.31V.41h4.29v.78a1.22,1.22,0,0,0-.77.52,4.9,4.9,0,0,0-.39,1.63L55,16.8l-.11,1,0,.29c0,.11,0,.2,0,.29A1.52,1.52,0,0,0,55,19.38ZM66.13,5.75,64.13,21h-.36L60,4.38,58.6,15.12c-.12.89-.2,1.55-.23,2a7.32,7.32,0,0,0,0,.81,2.17,2.17,0,0,0,.38,1.46,1.32,1.32,0,0,0,.77.32v.78h-3V19.7a1.26,1.26,0,0,0,.81-.91,29,29,0,0,0,.65-3.67L59.56,2.81,59.5,2.5a2,2,0,0,0-.45-1.06,1.21,1.21,0,0,0-.67-.25V.41h2.9L64.4,14.28,65.52,5.8c.07-.53.12-1,.16-1.41.06-.62.09-1.08.09-1.36a2.45,2.45,0,0,0-.34-1.51,1.39,1.39,0,0,0-.79-.33V.41h3v.78l-.21.06c-.29.08-.52.43-.68,1A34.22,34.22,0,0,0,66.13,5.75ZM83.27,1A3.41,3.41,0,0,0,81.21.41h-4v.78a1.74,1.74,0,0,1,.85.3c.14.13.2.43.2.91,0,.24,0,.56-.06,1,0,.21-.06.45-.09.73L76.38,17.56A4.53,4.53,0,0,1,76,19.18a1.18,1.18,0,0,1-.76.52v0a1,1,0,0,1-.67-.45,8.11,8.11,0,0,1-.34-2.12L72.83,0h-.38L67.11,17.64a6.42,6.42,0,0,1-.63,1.58,1.84,1.84,0,0,1-.59.54v.72h2.83v-.72a1.68,1.68,0,0,1-.75-.31,1.16,1.16,0,0,1-.18-.79,3.46,3.46,0,0,1,.07-.7,5.16,5.16,0,0,1,.15-.67l.84-3H72c.08,1.28.13,2,.13,2.18.06.85.08,1.39.08,1.61a2.26,2.26,0,0,1-.25,1.31,1.43,1.43,0,0,1-.88.42v.72H79.5V19.7a1.58,1.58,0,0,1-.86-.32,1.7,1.7,0,0,1-.19-1c0-.1,0-.2,0-.29a1.81,1.81,0,0,1,0-.25l.12-1,.85-6.24h.41l1.55,9.92h2.9V19.7a1,1,0,0,1-.79-.41A5.15,5.15,0,0,1,83,17.56l-1.11-6.77c0-.08,0-.27-.09-.58a5.53,5.53,0,0,0,.92-.53,3.52,3.52,0,0,0,.87-1,6.16,6.16,0,0,0,.75-1.93,9.67,9.67,0,0,0,.23-2C84.61,2.89,84.16,1.62,83.27,1ZM69.19,13.05l2.13-7.3.53,7.3Zm13-6.47a8.39,8.39,0,0,1-.46,1.65,2,2,0,0,1-1,1.15,3.29,3.29,0,0,1-1.14.2l.87-6.87a3.61,3.61,0,0,1,.23-1.06.45.45,0,0,1,.43-.27,1.05,1.05,0,0,1,1,.83,6.14,6.14,0,0,1,.3,2.08A11,11,0,0,1,82.22,6.58ZM90.48.41h3v.78a1.07,1.07,0,0,0-.55.41,6.13,6.13,0,0,0-.77,1.62l-2.72,8-.72,5.55c0,.22-.07.51-.1.86a7.29,7.29,0,0,0-.06.73,1.46,1.46,0,0,0,.29,1.07,1.61,1.61,0,0,0,.83.25v.78H85V19.7a1.56,1.56,0,0,0,.93-.39,3.7,3.7,0,0,0,.53-1.76l.85-6.45-1.26-8a6.07,6.07,0,0,0-.36-1.47.81.81,0,0,0-.7-.4V.41h4v.78a1.32,1.32,0,0,0-.76.23c-.15.12-.23.4-.23.84a4.46,4.46,0,0,0,0,.48c0,.19,0,.39.07.6l1,6.54,1.88-5.55c.1-.29.18-.55.24-.79a4.68,4.68,0,0,0,.14-1.11,1.35,1.35,0,0,0-.31-1,1.14,1.14,0,0,0-.66-.2Zm18.61,1.22c.1-.19.35-.28.73-.28a2.16,2.16,0,0,1,2.23,1.54A10.27,10.27,0,0,1,112.39,6l.38.13.62-5.7h-7.76v.78a1.67,1.67,0,0,1,.86.31,1.59,1.59,0,0,1,.19,1,6.58,6.58,0,0,1,0,.71c0,.28-.07.59-.11.93l-1.77,13.46a4.53,4.53,0,0,1-.41,1.62,1.17,1.17,0,0,1-.73.51,1,1,0,0,1-.73-.4,5.08,5.08,0,0,1-.49-1.73l-1.1-6.77c0-.08,0-.27-.1-.58a5.14,5.14,0,0,0,.92-.53,3.4,3.4,0,0,0,.88-1,6.16,6.16,0,0,0,.75-1.93,9.63,9.63,0,0,0,.22-2c0-1.87-.44-3.14-1.34-3.81a3.38,3.38,0,0,0-2-.54h-4v.78a1.78,1.78,0,0,1,.85.3,1.4,1.4,0,0,1,.19.91c0,.24,0,.56-.06,1,0,.21,0,.45-.09.73L95.74,17.56a4.53,4.53,0,0,1-.41,1.62,1.15,1.15,0,0,1-.75.52v.78h4.28V19.7a1.62,1.62,0,0,1-.86-.32,1.72,1.72,0,0,1-.18-1v-.29c0-.09,0-.18,0-.25l.12-1,.86-6.24h.4l1.55,9.92h10.8l.85-5.83-.35-.13a7.9,7.9,0,0,1-2.24,4.23,3.35,3.35,0,0,1-2.23.76.71.71,0,0,1-.65-.26,1.37,1.37,0,0,1-.15-.68c0-.09,0-.23,0-.39s0-.34.05-.51l.95-7.33a1.92,1.92,0,0,1,1.65.59,4,4,0,0,1,.42,2.18c0,.14,0,.31,0,.52s0,.46,0,.74l.4.15,1.07-8.21-.41-.1a7,7,0,0,1-1,2.65,3.15,3.15,0,0,1-2,.52l.85-6.67A3,3,0,0,1,109.09,1.63Zm-9,7.75a3.35,3.35,0,0,1-1.15.2l.87-6.87a4,4,0,0,1,.23-1.06.45.45,0,0,1,.43-.27,1.05,1.05,0,0,1,1,.83,6.14,6.14,0,0,1,.3,2.08,11.74,11.74,0,0,1-.21,2.29,9,9,0,0,1-.47,1.65A2,2,0,0,1,100.1,9.38ZM120.18.07h.43l-.59,6-.37-.1-.05-1a10.11,10.11,0,0,0-.41-2.39c-.34-1-.83-1.57-1.48-1.57s-.95.42-1.21,1.26a6.17,6.17,0,0,0-.25,1.8,5.92,5.92,0,0,0,.26,1.82,5.23,5.23,0,0,0,.44,1L118.19,9a12.6,12.6,0,0,1,1.12,2.57,10.75,10.75,0,0,1,.47,3.29,10,10,0,0,1-.9,4.29,2.76,2.76,0,0,1-2.46,1.91,2.17,2.17,0,0,1-.79-.15,3.28,3.28,0,0,1-.79-.44l-.36-.28-.26-.18a.38.38,0,0,0-.16,0,.34.34,0,0,0-.34.23,5.5,5.5,0,0,0-.23.84h-.43l.52-6.73.41.06c0,1,.07,1.66.12,2.09a7.13,7.13,0,0,0,.49,1.95,3.52,3.52,0,0,0,.73,1.18,1.25,1.25,0,0,0,.9.41c.57,0,1-.39,1.34-1.15a7.13,7.13,0,0,0,.47-2.68,9.86,9.86,0,0,0-1.76-4.77,11.23,11.23,0,0,1-1.77-5.58,9.8,9.8,0,0,1,.78-4.12A2.41,2.41,0,0,1,117.46,0a2.06,2.06,0,0,1,.79.16,1.9,1.9,0,0,1,.47.25l.37.25a1.15,1.15,0,0,0,.25.12.47.47,0,0,0,.22,0A.44.44,0,0,0,120,.62,2.6,2.6,0,0,0,120.18.07Zm10,2a26.67,26.67,0,0,0-.66,3.7l-.9,6.85a32.12,32.12,0,0,1-1.16,5.7c-.68,1.83-1.67,2.74-3,2.74a2.7,2.7,0,0,1-2.28-1.36,6.67,6.67,0,0,1-.92-3.77,19.46,19.46,0,0,1,.11-2c0-.46.15-1.26.3-2.42l1-7.36c0-.33.08-.64.11-.93s0-.55,0-.77a1.38,1.38,0,0,0-.2-.91,1.74,1.74,0,0,0-.85-.3V.41h4.43v.78a1.39,1.39,0,0,0-.91.47,4.25,4.25,0,0,0-.44,1.68l-1.18,9c-.11.8-.19,1.46-.25,2q-.15,1.37-.15,2a4.41,4.41,0,0,0,.48,2.27,1.44,1.44,0,0,0,1.29.78c.91,0,1.62-.82,2.13-2.48a30.62,30.62,0,0,0,.91-4.85L129,5.76c.1-.91.14-1.3.13-1.19a14.64,14.64,0,0,0,.13-1.6,2.12,2.12,0,0,0-.38-1.46,1.35,1.35,0,0,0-.77-.32V.41H131v.78A1.18,1.18,0,0,0,130.23,2.06Zm8.41,12.59-.84,5.83h-8V19.7a1.24,1.24,0,0,0,.76-.52,4.73,4.73,0,0,0,.4-1.63L132.75,4.1q.08-.57.12-1c0-.26,0-.48,0-.68,0-.51-.06-.83-.2-1a1.67,1.67,0,0,0-.85-.31V.41h4.56v.78a1.67,1.67,0,0,0-1,.49A4.17,4.17,0,0,0,135,3.34l-1.87,14.31c0,.16,0,.31-.05.45s0,.3,0,.48a1,1,0,0,0,.21.72.8.8,0,0,0,.59.21,3.54,3.54,0,0,0,2.56-1.05,9.24,9.24,0,0,0,1.91-3.94Zm7.72-8.56a7.63,7.63,0,0,0-.79-4,1.53,1.53,0,0,0-1.21-.64l-2,15.35-.12,1a2.47,2.47,0,0,0,0,.34,2.35,2.35,0,0,0,0,.26c0,.52.08.84.23,1a2,2,0,0,0,1,.3v.78h-4.76V19.7a1.18,1.18,0,0,0,.9-.26,3.75,3.75,0,0,0,.6-1.88l2.11-16.11a2.17,2.17,0,0,0-1.83,1.08,9.57,9.57,0,0,0-1.27,3.21l-.37-.2.56-5.13h7.91l-.52,5.76Zm3.41-3.79a6.17,6.17,0,0,0-.25,1.8,5.63,5.63,0,0,0,.26,1.82,5.23,5.23,0,0,0,.44,1L151.46,9a13.19,13.19,0,0,1,1.13,2.57,11.08,11.08,0,0,1,.46,3.29,10,10,0,0,1-.9,4.29,2.76,2.76,0,0,1-2.46,1.91,2.21,2.21,0,0,1-.79-.15,3.28,3.28,0,0,1-.79-.44l-.36-.28-.26-.18a.38.38,0,0,0-.16,0,.34.34,0,0,0-.34.23,5.5,5.5,0,0,0-.23.84h-.43l.52-6.73.41.06c0,1,.07,1.66.12,2.09a7.13,7.13,0,0,0,.49,1.95,3.52,3.52,0,0,0,.73,1.18,1.25,1.25,0,0,0,.9.41c.57,0,1-.39,1.34-1.15a7.13,7.13,0,0,0,.47-2.68,9.86,9.86,0,0,0-1.76-4.77,11.23,11.23,0,0,1-1.77-5.58,9.8,9.8,0,0,1,.78-4.12A2.41,2.41,0,0,1,150.73,0a2.06,2.06,0,0,1,.79.16,1.9,1.9,0,0,1,.47.25l.37.25a1.34,1.34,0,0,0,.24.12.56.56,0,0,0,.23,0,.44.44,0,0,0,.39-.21,2.6,2.6,0,0,0,.23-.55h.43l-.59,6-.37-.1,0-1a10.11,10.11,0,0,0-.41-2.39c-.34-1-.83-1.57-1.48-1.57S150,1.46,149.77,2.3Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 153.879, height: 21.051, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
            case 'Information Only': {
                stampCollection = {
                    iconName: 'Information Only',
                    // tslint:disable-next-line:max-line-length
                    pathdata: 'M4,19.14a2,2,0,0,0,1,.32v.76H0v-.76a1.42,1.42,0,0,0,.87-.52,4,4,0,0,0,.47-1.59l2-13.24c.06-.38.1-.69.13-1a5.73,5.73,0,0,0,0-.67c0-.5-.08-.81-.24-.94a2.2,2.2,0,0,0-1-.31V.48H7.26v.76a1.48,1.48,0,0,0-.88.52,4.14,4.14,0,0,0-.45,1.6l-2,13.24-.13,1c0,.1,0,.19,0,.3a2.72,2.72,0,0,0,0,.28A1.32,1.32,0,0,0,4,19.14ZM18.17,1.3l.24-.06V.48H15v.76a1.66,1.66,0,0,1,.9.33,2.08,2.08,0,0,1,.4,1.48,12.85,12.85,0,0,1-.1,1.34c-.05.41-.11.87-.18,1.39l-1.29,8.34L11.15.48H7.83v.76a1.69,1.69,0,0,1,.77.24,1.9,1.9,0,0,1,.51,1.06l.07.3L7.33,15a24.86,24.86,0,0,1-.76,3.61,1.32,1.32,0,0,1-.92.9v.76H9.09v-.76a1.67,1.67,0,0,1-.88-.32,1.92,1.92,0,0,1-.44-1.44,7.09,7.09,0,0,1,0-.79c0-.43.13-1.09.27-2L9.72,4.38,14,20.71h.41l2.3-15a28.78,28.78,0,0,1,.67-3.42C17.57,1.72,17.83,1.38,18.17,1.3ZM19.33.48v.76a2.32,2.32,0,0,1,1,.3c.15.13.23.42.23.9,0,.23,0,.55-.07,1,0,.2-.06.44-.1.71l-2,13.23a4,4,0,0,1-.46,1.58,1.39,1.39,0,0,1-.88.54v.76h4.89v-.76a1.36,1.36,0,0,1-.78-.19,1.39,1.39,0,0,1-.41-1.17c0-.1,0-.21,0-.31s0-.22,0-.35l1.09-7.21a2.09,2.09,0,0,1,1.83.64A3.81,3.81,0,0,1,24.1,13c0,.11,0,.28,0,.49s0,.46,0,.75l.45.14,1.22-8.07-.46-.1a6.19,6.19,0,0,1-1.11,2.59A3.89,3.89,0,0,1,22,9.28l1-6.54a2.43,2.43,0,0,1,.33-1.08.93.93,0,0,1,.76-.26,2.45,2.45,0,0,1,2.52,1.54A9,9,0,0,1,27,6l.44.13.7-5.6ZM39.06,7.11a21,21,0,0,1-2,9.07q-2.16,4.61-5,4.6a3.28,3.28,0,0,1-2.88-1.92,10.29,10.29,0,0,1-1.11-5.14,21.08,21.08,0,0,1,2.07-9.19Q32.31,0,35,0a3.37,3.37,0,0,1,2.93,1.92A10.14,10.14,0,0,1,39.06,7.11ZM36.68,4.6a7,7,0,0,0-.42-2.55A1.37,1.37,0,0,0,35,1c-1.37,0-2.52,2.17-3.46,6.53a40.81,40.81,0,0,0-1.07,8.26,10,10,0,0,0,.21,2.2c.26,1.18.74,1.77,1.43,1.77s1.24-.43,1.78-1.29a18.75,18.75,0,0,0,1.65-4.93,43.28,43.28,0,0,0,.85-4.83A36.93,36.93,0,0,0,36.68,4.6ZM61,19.15a2.25,2.25,0,0,0,1,.31v.76H56.84v-.76A2,2,0,0,0,58,19a3.6,3.6,0,0,0,.5-1.63L60.56,3.76l-6.2,16.85H53.9L52.78,4.24,51.12,15c-.09.55-.15,1-.2,1.37a13,13,0,0,0-.11,1.42,1.8,1.8,0,0,0,.46,1.43,1.54,1.54,0,0,0,.86.29v.76H45.49l-1.78-9.76h-.47l-1,6.14-.13,1,0,.25c0,.09,0,.19,0,.28a1.47,1.47,0,0,0,.22,1,2,2,0,0,0,1,.32v.76H38.37v-.76a1.42,1.42,0,0,0,.88-.52,4.21,4.21,0,0,0,.46-1.59l2-13.24c0-.27.08-.51.11-.71a8.23,8.23,0,0,0,.07-1,1.23,1.23,0,0,0-.23-.9,2.32,2.32,0,0,0-1-.3V.48h4.54A4.34,4.34,0,0,1,47.62,1c1,.65,1.54,1.9,1.54,3.75a7.78,7.78,0,0,1-.26,2A5.56,5.56,0,0,1,48,8.62a3.87,3.87,0,0,1-1,1,8.06,8.06,0,0,1-1.06.52c.05.3.09.49.11.57l1.27,6.66a4.58,4.58,0,0,0,.55,1.7,1.23,1.23,0,0,0,.83.39,1.31,1.31,0,0,0,.86-.84A23,23,0,0,0,50.36,15L52.05,4c.06-.37.11-.7.15-1a7.42,7.42,0,0,0,0-.75c0-.41-.08-.67-.25-.78a2.09,2.09,0,0,0-.94-.21V.48h3.77l1,13.91,5-13.91h3.51v.76a1.46,1.46,0,0,0-.79.4A3.71,3.71,0,0,0,63,3.31L61,16.59c0,.29-.09.58-.13.88s-.05.55-.05.75Q60.79,19,61,19.15Zm-15.14-11a7.46,7.46,0,0,0,.53-1.62,9.54,9.54,0,0,0,.25-2.26,5.31,5.31,0,0,0-.35-2,1.18,1.18,0,0,0-1.16-.81.54.54,0,0,0-.5.26,3.37,3.37,0,0,0-.26,1.05l-1,6.76a4.28,4.28,0,0,0,1.31-.2A2.17,2.17,0,0,0,45.89,8.17ZM73.21,19.51v.71h-5v-.71a1.61,1.61,0,0,0,1-.41,1.92,1.92,0,0,0,.3-1.29c0-.22,0-.75-.09-1.58,0-.17-.06-.89-.16-2.15H65.68l-1,3c-.06.2-.12.42-.17.66a3.4,3.4,0,0,0-.08.69q0,.62.21.78a1.9,1.9,0,0,0,.86.3v.71H62.29v-.71A2,2,0,0,0,63,19a6.47,6.47,0,0,0,.72-1.56L69.82.07h.43L71.83,17A6.77,6.77,0,0,0,72.22,19,1.23,1.23,0,0,0,73.21,19.51Zm-4.08-6.6-.61-7.18-2.44,7.18ZM82.52,6.14l.6-5.66H74l-.63,5,.42.2a8.71,8.71,0,0,1,1.46-3.16,2.57,2.57,0,0,1,2.1-1.06L75,17.35a3.36,3.36,0,0,1-.68,1.85,1.57,1.57,0,0,1-1,.26v.76H78.7v-.76a2.69,2.69,0,0,1-1.11-.3c-.18-.13-.27-.45-.27-.95a2.26,2.26,0,0,1,0-.26c0-.09,0-.2,0-.33l.14-1L79.8,1.5a1.87,1.87,0,0,1,1.39.63c.58.7.88,2,.91,3.94ZM88.84.48H83.92v.76a2.31,2.31,0,0,1,1,.31c.15.13.23.44.23.94a5.56,5.56,0,0,1,0,.67c0,.26-.08.57-.14,1l-2,13.24a4,4,0,0,1-.47,1.59,1.36,1.36,0,0,1-.87.52v.76H86.5v-.76a2,2,0,0,1-1-.32,1.32,1.32,0,0,1-.23-.94c0-.09,0-.18,0-.28s0-.2,0-.3l.13-1,2-13.24A4.09,4.09,0,0,1,88,1.76a1.45,1.45,0,0,1,.87-.52ZM99.11,7.11a21,21,0,0,1-2,9.07q-2.16,4.61-5,4.6a3.28,3.28,0,0,1-2.88-1.92,10.29,10.29,0,0,1-1.11-5.14,21.08,21.08,0,0,1,2.07-9.19C91.63,1.51,93.25,0,95,0A3.36,3.36,0,0,1,98,1.92,10,10,0,0,1,99.11,7.11ZM96.72,4.6a7.18,7.18,0,0,0-.41-2.55c-.28-.7-.7-1-1.29-1-1.37,0-2.52,2.17-3.46,6.53a40.7,40.7,0,0,0-1.06,8.26,10,10,0,0,0,.2,2.2c.26,1.18.74,1.77,1.43,1.77a2.2,2.2,0,0,0,1.78-1.29,18.75,18.75,0,0,0,1.65-4.93,41.1,41.1,0,0,0,.85-4.83A34.65,34.65,0,0,0,96.72,4.6Zm11.1-3.36a1.66,1.66,0,0,1,.9.33,2.08,2.08,0,0,1,.4,1.48,12.85,12.85,0,0,1-.1,1.34c0,.41-.11.87-.18,1.39l-1.29,8.34L104,.48h-3.33v.76a1.7,1.7,0,0,1,.78.24,2,2,0,0,1,.51,1.06l.07.3L100.13,15a24,24,0,0,1-.75,3.61,1.35,1.35,0,0,1-.93.9v.76h3.45v-.76a1.67,1.67,0,0,1-.88-.32,1.88,1.88,0,0,1-.44-1.44,7.09,7.09,0,0,1,0-.79c0-.43.13-1.09.27-2l1.64-10.57,4.29,16.33h.41l2.3-15a28.78,28.78,0,0,1,.67-3.42c.18-.59.44-.93.78-1l.23-.06V.48h-3.39ZM125,7.11a21,21,0,0,1-2,9.07c-1.45,3.07-3.1,4.6-5,4.6a3.28,3.28,0,0,1-2.87-1.92A10.29,10.29,0,0,1,114,13.72a21.22,21.22,0,0,1,2.06-9.19Q118.22,0,120.91,0a3.36,3.36,0,0,1,2.92,1.92A10,10,0,0,1,125,7.11ZM122.59,4.6a7,7,0,0,0-.41-2.55,1.37,1.37,0,0,0-1.28-1c-1.37,0-2.53,2.17-3.46,6.53a40.11,40.11,0,0,0-1.07,8.26,10.65,10.65,0,0,0,.2,2.2q.39,1.77,1.44,1.77a2.2,2.2,0,0,0,1.77-1.29,18.29,18.29,0,0,0,1.66-4.93,45.71,45.71,0,0,0,.85-4.83A36.53,36.53,0,0,0,122.59,4.6Zm14.26-3.3.24-.06V.48h-3.4v.76a1.74,1.74,0,0,1,.91.33,2.13,2.13,0,0,1,.4,1.48c0,.28,0,.73-.11,1.34,0,.41-.11.87-.18,1.39l-1.29,8.34L129.83.48h-3.32v.76a1.69,1.69,0,0,1,.77.24,1.9,1.9,0,0,1,.51,1.06l.07.3L126,15a27,27,0,0,1-.75,3.61,1.35,1.35,0,0,1-.93.9v.76h3.44v-.76a1.67,1.67,0,0,1-.88-.32,1.92,1.92,0,0,1-.44-1.44c0-.26,0-.52,0-.79.05-.43.13-1.09.27-2l1.65-10.57,4.29,16.33h.41l2.29-15a31.07,31.07,0,0,1,.67-3.42C136.25,1.72,136.52,1.38,136.85,1.3Zm8.52,13.06a8.55,8.55,0,0,1-2.19,3.87,4.44,4.44,0,0,1-2.94,1,1,1,0,0,1-.68-.21.9.9,0,0,1-.24-.7,3.4,3.4,0,0,1,0-.48c0-.14,0-.28,0-.44l2.15-14.08a3.69,3.69,0,0,1,.5-1.64,2.22,2.22,0,0,1,1.16-.48V.48H138v.76a2.2,2.2,0,0,1,1,.31c.16.13.24.44.24.94a5.73,5.73,0,0,1-.05.67c0,.26-.07.57-.13,1l-2,13.23a4,4,0,0,1-.47,1.6,1.36,1.36,0,0,1-.87.52v.76h9.16l1-5.74ZM151.79.48v.76a1.52,1.52,0,0,1,.76.2,1.21,1.21,0,0,1,.37,1,4.09,4.09,0,0,1-.17,1.09c-.07.24-.16.5-.27.79L150.32,9.8l-1.18-6.44a4.51,4.51,0,0,1-.08-.6,4.37,4.37,0,0,1,0-.46c0-.43.09-.71.27-.83a1.75,1.75,0,0,1,.87-.23V.48h-4.63v.76a.94.94,0,0,1,.8.4,5.08,5.08,0,0,1,.42,1.44L148.2,11l-1,6.35a3.35,3.35,0,0,1-.61,1.73,1.91,1.91,0,0,1-1.06.39v.76h5.32v-.76a2,2,0,0,1-.95-.25,1.29,1.29,0,0,1-.33-1.05,7.29,7.29,0,0,1,.06-.73q.06-.51.12-.84l.82-5.46,3.12-7.89a5.54,5.54,0,0,1,.89-1.59,1.28,1.28,0,0,1,.63-.41V.48Z',
                    opacity: 1, strokeColor: '', fillColor: '#192760', width: 155.237, height: 20.783, stampFillColor: '#dce3ef', stampStrokeColor: '',
                };
            }
                break;
        }
        if (stampCollection) {
            stampCollection.modifiedDate = new Date().toLocaleString();
            this.currentStampAnnotation = stampCollection;
            return stampCollection;
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public saveStampAnnotations(): any {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        // tslint:disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IStampAnnotation[] = [];
                let pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(pageAnnotationObject.annotations[z].bounds);
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
    // tslint:disable-next-line
    public storeStampInSession(pageNumber: number, annotation: IStampAnnotation): any {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        let index: number = 0;
        if (!storeObject) {
            let shapeAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            let annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(shapeAnnotation);
            let annotationStringified: string = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_stamp', annotationStringified);
        } else {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_stamp');
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
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_stamp', annotationStringified);
        }
        return index;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public updateSessionStorage(annotation: any, id: any, type: String): any {
        if (id != null) {
            for (let p: number = 0; p < annotation.annotations.length; p++) {
                if (annotation.annotations[p].id === id) {
                    annotation = annotation.annotations[p];
                    break;
                }
            }
        }
        if (type === 'Rotate') {
            annotation = annotation.annotations[0];
        }
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        if (storeObject) {
            // tslint:disable-next-line
            let bounds: any = annotation.bounds;
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            for (let k: number = 0; k < annotObject.length; k++) {
                // tslint:disable-next-line
                let currentAnnot: any = annotObject[k];
                for (let j: number = 0; j < currentAnnot.annotations.length; j++) {
                    if (annotObject[k].annotations[j] != null && annotObject[k].annotations[j].randomId === annotation.id) {
                        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_stamp');
                        // tslint:disable-next-line:max-line-length
                        let pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, annotObject[k].annotations[j].pageNumber);
                        if (type !== 'delete') {
                            if (annotObject[pageIndex]) {
                                // tslint:disable-next-line:max-line-length
                                //annotObject[k].annotations[j].modifiedDate = new Date().toLocaleString();
                                if (annotation.wrapper.children[1]) {
                                    annotObject[k].annotations[j].opacity = annotation.wrapper.children[1].style.opacity;
                                } else {
                                    annotObject[k].annotations[j].opacity = annotation.wrapper.children[0].style.opacity;
                                }
                                annotObject[k].annotations[j].rotateAngle = annotation.rotateAngle;
                                // tslint:disable-next-line:max-line-length
                                annotObject[k].annotations[j].bounds = { left: bounds.x, top: bounds.y, width: annotation.wrapper.actualSize.width, height: annotation.wrapper.actualSize.height, right: bounds.right, bottom: bounds.bottom };
                            }
                        } else {
                            annotObject[k].annotations.splice(j, 1);
                        }
                        let annotationStringified: string = JSON.stringify(annotObject);
                        window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_stamp', annotationStringified);
                        break;
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public saveImportedStampAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: IStampAnnotation = null;
        // tslint:disable-next-line
        let stampAnnotation: any = this.retrievestampAnnotation(annotation.Subject);
        annotation.Author = this.pdfViewer.stampSettings.author;
        if (stampAnnotation) {
            annotationObject = {
                // tslint:disable-next-line:max-line-length
                stampAnnotationType: annotation.StampAnnotationType, author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, stampFillcolor: annotation.StampFillColor,
                // tslint:disable-next-line:max-line-length
                rotateAngle: annotation.RotateAngle, creationDate: annotation.creationDate, pageNumber: pageNumber, icon: annotation.iconName, stampAnnotationPath: stampAnnotation.pathdata, randomId: 'stamp', isDynamicStamp: this.pdfViewerBase.isDynamicStamp, dynamicText: this.dynamicText,
                bounds: { left: annotation.Rect.X, top: annotation.Rect.Y, width: annotation.Rect.Width, height: annotation.Rect.Height, }, annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, author: annotation.Author, modifiedDate: annotation.ModifiedDate }, shapeAnnotationType: 'stamp'
            };
            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_stamp');
        }
    }
}