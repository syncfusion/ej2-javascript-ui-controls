import {
    PdfViewer, PdfViewerBase, IRectangle, IPageAnnotations, IPoint, ICommentsCollection, IReviewCollection,
    AnnotationType as AnnotType, LineHeadStyle
} from '../../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBase } from '../../diagram/pdf-annotation';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { AnnotationType } from '../../diagram/enum';

/**
 * @hidden
 */
export interface IShapeAnnotation {
    shapeAnnotationType: string;
    author: string;
    modifiedDate: string;
    subject: string;
    note: string;
    strokeColor: string;
    fillColor: string;
    opacity: number;
    bounds: IRectangle;
    thickness: number;
    borderStyle: string;
    borderDashArray: number;
    rotateAngle: string;
    isCloudShape: boolean;
    cloudIntensity: number;
    vertexPoints: PointModel[];
    lineHeadStart: string;
    lineHeadEnd: string;
    rectangleDifference: string[];
    isLocked: boolean;
    id: string;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotName: string;
    position?: string;
}

/**
 * @hidden
 */
export class ShapeAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public currentAnnotationMode: string;
    /**
     * @private
     */
    public lineOpacity: number;
    /**
     * @private
     */
    public arrowOpacity: number;
    /**
     * @private
     */
    public rectangleOpacity: number;
    /**
     * @private
     */
    public circleOpacity: number;
    /**
     * @private
     */
    public polygonOpacity: number;
    /**
     * @private
     */
    public lineFillColor: string;
    /**
     * @private
     */
    public arrowFillColor: string;
    /**
     * @private
     */
    public rectangleFillColor: string;
    /**
     * @private
     */
    public circleFillColor: string;
    /**
     * @private
     */
    public polygonFillColor: string;
    /**
     * @private
     */
    public lineStrokeColor: string;
    /**
     * @private
     */
    public arrowStrokeColor: string;
    /**
     * @private
     */
    public rectangleStrokeColor: string;
    /**
     * @private
     */
    public circleStrokeColor: string;
    /**
     * @private
     */
    public polygonStrokeColor: string;
    /**
     * @private
     */
    public lineThickness: number;
    /**
     * @private
     */
    public arrowThickness: number;
    /**
     * @private
     */
    public rectangleThickness: number;
    /**
     * @private
     */
    public circleThickness: number;
    /**
     * @private
     */
    public polygonThickness: number;
    /**
     * @private
     */
    public lineDashArray: number;
    /**
     * @private
     */
    public lineStartHead: LineHeadStyle;
    /**
     * @private
     */
    public lineEndHead: LineHeadStyle;
    /**
     * @private
     */
    public arrowDashArray: number;
    /**
     * @private
     */
    public arrowStartHead: LineHeadStyle;
    /**
     * @private
     */
    public arrowEndHead: LineHeadStyle;
    private author: string;

    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.lineFillColor = this.pdfViewer.lineSettings.fillColor ? this.pdfViewer.lineSettings.fillColor : '#ffffff00';
        this.lineStrokeColor = this.pdfViewer.lineSettings.strokeColor ? this.pdfViewer.lineSettings.strokeColor : '#ff0000';
        this.lineThickness = this.pdfViewer.lineSettings.thickness ? this.pdfViewer.lineSettings.thickness : 1;
        this.lineOpacity = this.pdfViewer.lineSettings.opacity ? this.pdfViewer.lineSettings.opacity : 1;
        this.lineDashArray = this.pdfViewer.lineSettings.borderDashArray ? this.pdfViewer.lineSettings.borderDashArray : 0;
        this.lineStartHead = this.pdfViewer.lineSettings.lineHeadStartStyle ? this.pdfViewer.lineSettings.lineHeadStartStyle : 'None';
        this.lineEndHead = this.pdfViewer.lineSettings.lineHeadEndStyle ? this.pdfViewer.lineSettings.lineHeadEndStyle : 'None';
        this.arrowFillColor = this.pdfViewer.arrowSettings.fillColor ? this.pdfViewer.arrowSettings.fillColor : '#ffffff00';
        this.arrowStrokeColor = this.pdfViewer.arrowSettings.strokeColor ? this.pdfViewer.arrowSettings.strokeColor : '#ff0000';
        this.arrowThickness = this.pdfViewer.arrowSettings.thickness ? this.pdfViewer.arrowSettings.thickness : 1;
        this.arrowOpacity = this.pdfViewer.arrowSettings.opacity ? this.pdfViewer.arrowSettings.opacity : 1;
        this.arrowDashArray = this.pdfViewer.arrowSettings.borderDashArray ? this.pdfViewer.arrowSettings.borderDashArray : 0;
        this.arrowStartHead = this.pdfViewer.arrowSettings.lineHeadStartStyle ? this.pdfViewer.arrowSettings.lineHeadStartStyle : 'Closed';
        this.arrowEndHead = this.pdfViewer.arrowSettings.lineHeadEndStyle ? this.pdfViewer.arrowSettings.lineHeadEndStyle : 'Closed';
        this.rectangleFillColor = this.pdfViewer.rectangleSettings.fillColor ? this.pdfViewer.rectangleSettings.fillColor : '#ffffff00';
        this.rectangleStrokeColor = this.pdfViewer.rectangleSettings.strokeColor ? this.pdfViewer.rectangleSettings.strokeColor : '#ff0000';
        this.rectangleThickness = this.pdfViewer.rectangleSettings.thickness ? this.pdfViewer.rectangleSettings.thickness : 1;
        this.rectangleOpacity = this.pdfViewer.rectangleSettings.opacity ? this.pdfViewer.rectangleSettings.opacity : 1;
        this.circleFillColor = this.pdfViewer.circleSettings.fillColor ? this.pdfViewer.circleSettings.fillColor : '#ffffff00';
        this.circleStrokeColor = this.pdfViewer.circleSettings.strokeColor ? this.pdfViewer.circleSettings.strokeColor : '#ff0000';
        this.circleThickness = this.pdfViewer.circleSettings.thickness ? this.pdfViewer.circleSettings.thickness : 1;
        this.circleOpacity = this.pdfViewer.circleSettings.opacity ? this.pdfViewer.circleSettings.opacity : 1;
        this.polygonFillColor = this.pdfViewer.polygonSettings.fillColor ? this.pdfViewer.polygonSettings.fillColor : '#ffffff00';
        this.polygonStrokeColor = this.pdfViewer.polygonSettings.strokeColor ? this.pdfViewer.polygonSettings.strokeColor : '#ff0000';
        this.polygonThickness = this.pdfViewer.polygonSettings.thickness ? this.pdfViewer.polygonSettings.thickness : 1;
        this.polygonOpacity = this.pdfViewer.polygonSettings.opacity ? this.pdfViewer.polygonSettings.opacity : 1;
        this.author = this.pdfViewer.lineSettings.author;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public renderShapeAnnotations(shapeAnnotations: any, pageNumber: number): void {
        if (shapeAnnotations) {
            if (shapeAnnotations.length >= 1) {
                for (let i: number = 0; i < shapeAnnotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation: any = shapeAnnotations[i];
                    let annotationObject: IShapeAnnotation = null;
                    if (annotation.ShapeAnnotationType) {
                        let vertexPoints: IPoint[] = null;
                        if (annotation.VertexPoints) {
                            vertexPoints = [];
                            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                                let point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                                vertexPoints.push(point);
                            }
                        }
                        // tslint:disable-next-line:max-line-length
                        annotationObject = {
                            id: 'shape' + i, shapeAnnotationType: annotation.ShapeAnnotationType, author: this.author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                            // tslint:disable-next-line:max-line-length
                            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
                            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
                            // tslint:disable-next-line:max-line-length
                            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation), review: {state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: this.author }, annotName: annotation.AnnotName,
                            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom }
                        };
                        let annot: PdfAnnotationBaseModel;
                        // tslint:disable-next-line
                        let vPoints: any[] = annotationObject.vertexPoints;
                        if (vertexPoints == null) {
                            vPoints = [];
                        }
                        annot = {
                            // tslint:disable-next-line:max-line-length
                            id: 'shape' + i, shapeAnnotationType: this.getShapeType(annotationObject), author: this.author, modifiedDate: annotationObject.modifiedDate, annotName: annotationObject.annotName,
                            subject: annotationObject.subject, notes: annotationObject.note, fillColor: annotationObject.fillColor, strokeColor: annotationObject.strokeColor, opacity: annotationObject.opacity,
                            // tslint:disable-next-line:max-line-length
                            thickness: annotationObject.thickness, borderStyle: annotationObject.borderStyle, borderDashArray: annotationObject.borderDashArray.toString(), rotateAngle: parseFloat(annotationObject.rotateAngle.split('Angle')[1]), comments: annotationObject.comments, review: annotationObject.review,
                            isCloudShape: annotationObject.isCloudShape, cloudIntensity: annotationObject.cloudIntensity, taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadEnd),
                            // tslint:disable-next-line:max-line-length
                            sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadStart), vertexPoints: vPoints, bounds: { x: annotationObject.bounds.left, y: annotationObject.bounds.top, width: annotationObject.bounds.width, height: annotationObject.bounds.height },
                            pageIndex: pageNumber
                        };
                        let addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                        if (addedAnnot.shapeAnnotationType === 'Polygon') {
                            this.pdfViewer.nodePropertyChange(addedAnnot, { fillColor: annot.fillColor });
                        }
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
                    }
                }
            } else if (shapeAnnotations.shapeAnnotationType) {
                let annotationObject: IShapeAnnotation = this.createAnnotationObject(shapeAnnotations);
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
            }
        }
    }

    /**
     * @private
     */
    public setAnnotationType(type: AnnotType): void {
        let date: Date = new Date();
        this.pdfViewerBase.disableTextSelectionMode();
        switch (type) {
            case 'Line':
                this.currentAnnotationMode = 'Line';
                // tslint:disable-next-line:max-line-length
                let modifiedDateLine: string = this.pdfViewer.lineSettings.modifiedDate ? this.pdfViewer.lineSettings.modifiedDate : date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: this.setShapeType('Line'), fillColor: this.lineFillColor, notes: '', strokeColor: this.lineStrokeColor, opacity: this.lineOpacity,
                    thickness: this.lineThickness, modifiedDate: modifiedDateLine, borderDashArray: this.lineDashArray.toString(),
                    // tslint:disable-next-line:max-line-length
                    sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.lineStartHead.toString()), taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.lineEndHead.toString()),
                    author: this.pdfViewer.lineSettings.author, subject: this.pdfViewer.lineSettings.subject, lineHeadStart: this.lineStartHead, lineHeadEnd: this.lineEndHead
                };
                this.pdfViewer.tool = 'Line';
                break;
            case 'Arrow':
                this.currentAnnotationMode = 'Arrow';
                // tslint:disable-next-line:max-line-length
                let modifiedDateArrow: string = this.pdfViewer.arrowSettings.modifiedDate ? this.pdfViewer.arrowSettings.modifiedDate : date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: this.setShapeType('Arrow'), opacity: this.arrowOpacity,
                    // tslint:disable-next-line:max-line-length
                    sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.arrowStartHead.toString()),
                    taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.arrowEndHead.toString()),
                    // tslint:disable-next-line:max-line-length
                    fillColor: this.arrowFillColor, strokeColor: this.arrowStrokeColor, notes: '', thickness: this.arrowThickness,
                    borderDashArray: this.arrowDashArray.toString(), author: this.pdfViewer.lineSettings.author, subject: this.pdfViewer.arrowSettings.subject,
                    // tslint:disable-next-line:max-line-length
                    modifiedDate: modifiedDateArrow, lineHeadStart: this.arrowStartHead, lineHeadEnd: this.arrowEndHead
                };
                this.pdfViewer.tool = 'Line';
                break;
            case 'Rectangle':
                this.currentAnnotationMode = 'Rectangle';
                // tslint:disable-next-line:max-line-length
                let modifiedDateRect: string = this.pdfViewer.rectangleSettings.modifiedDate ? this.pdfViewer.rectangleSettings.modifiedDate : date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: this.setShapeType('Rectangle'), strokeColor: this.rectangleStrokeColor,
                    fillColor: this.rectangleFillColor, opacity: this.rectangleOpacity, notes: '',
                    thickness: this.rectangleThickness, borderDashArray: '0', modifiedDate: modifiedDateRect,
                    author: this.pdfViewer.lineSettings.author, subject: this.pdfViewer.rectangleSettings.subject
                };
                this.pdfViewer.tool = 'DrawTool';
                break;
            case 'Circle':
                this.currentAnnotationMode = 'Circle';
                // tslint:disable-next-line:max-line-length
                let modifiedDateCir: string = this.pdfViewer.circleSettings.modifiedDate ? this.pdfViewer.circleSettings.modifiedDate : date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: this.setShapeType('Circle'), strokeColor: this.circleStrokeColor,
                    fillColor: this.circleFillColor, opacity: this.circleOpacity, notes: '',
                    thickness: this.circleThickness, borderDashArray: '0', modifiedDate: modifiedDateCir,
                    author: this.pdfViewer.lineSettings.author, subject: this.pdfViewer.circleSettings.subject
                };
                this.pdfViewer.tool = 'DrawTool';
                break;
            case 'Polygon':
                this.currentAnnotationMode = 'Polygon';
                // tslint:disable-next-line:max-line-length
                let modifiedDatePolygon: string = this.pdfViewer.polygonSettings.modifiedDate ? this.pdfViewer.polygonSettings.modifiedDate : date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    strokeColor: this.polygonStrokeColor, fillColor: this.polygonFillColor,
                    opacity: this.polygonOpacity, thickness: this.polygonThickness, borderDashArray: '0',
                    notes: '', author: this.pdfViewer.lineSettings.author, subject: this.pdfViewer.lineSettings.subject,
                    modifiedDate: modifiedDatePolygon, borderStyle: ''
                };
                this.pdfViewer.tool = 'Polygon';
                break;
        }
    }

    private setShapeType(shape: string): AnnotationType {
        let shapeType: AnnotationType;
        switch (shape) {
            case 'Line':
                shapeType = 'Line';
                break;
            case 'Circle':
                shapeType = 'Ellipse';
                break;
            case 'Square':
                shapeType = 'Rectangle';
                break;
            case 'Polyline':
                shapeType = 'Line';
                break;
            case 'Arrow':
                shapeType = 'LineWidthArrowHead';
                break;
        }
        return shapeType;
    }

    private getShapeType(shape: IShapeAnnotation): AnnotationType {
        let shapeType: AnnotationType;
        switch (shape.shapeAnnotationType) {
            case 'Line':
                shapeType = 'Line';
                break;
            case 'Circle':
                shapeType = 'Ellipse';
                break;
            case 'Square':
                shapeType = 'Rectangle';
                break;
            case 'Polyline':
                shapeType = 'Line';
                break;
            case 'Polygon':
                shapeType = 'Polygon';
                break;
        }
        // tslint:disable-next-line:max-line-length
        if ((shape.shapeAnnotationType === 'Line' || shape.shapeAnnotationType === 'Polyline') && (shape.lineHeadStart !== 'None' || shape.lineHeadEnd !== 'None')) {
            shapeType = 'LineWidthArrowHead';
        }
        return shapeType;
    }

    private getShapeAnnotType(shape: AnnotationType): string {
        let shapeType: string;
        switch (shape) {
            case 'Line':
            case 'LineWidthArrowHead':
                shapeType = 'Line';
                break;
            case 'Rectangle':
                shapeType = 'Square';
                break;
            case 'Ellipse':
                shapeType = 'Circle';
                break;
            case 'Polygon':
                shapeType = 'Polygon';
                break;
        }
        return shapeType;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any): IShapeAnnotation {
        let currentAnnotObject: IShapeAnnotation = null;
        let pageAnnotations: IShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        if (pageAnnotations[i].shapeAnnotationType === 'Line') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                        } else if (pageAnnotations[i].shapeAnnotationType === 'Polygon') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        } else {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        }
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
                    } else if (property === 'dashArray') {
                        pageAnnotations[i].borderDashArray = annotationBase.wrapper.children[0].style.strokeDashArray;
                        pageAnnotations[i].borderStyle = annotationBase.borderStyle;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'startArrow') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].lineHeadStart = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.sourceDecoraterShapes);
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'endArrow') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].lineHeadEnd = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.taregetDecoraterShapes);
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'notes') {
                        pageAnnotations[i].note = annotationBase.notes;
                        let date: Date = new Date();
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
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
    public addInCollection(pageNumber: number, annotationBase: IShapeAnnotation): void {
        let pageAnnotations: IShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    }

    /**
     * @private
     */
    public saveShapeAnnotations(): string {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        // tslint:disable-next-line
        let annotations: Array<any> = new Array();
        let colorpick: ColorPicker = new ColorPicker();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IShapeAnnotation[] = [];
                let pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(pageAnnotationObject.annotations[z].bounds);
                        let strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        let fillColorString: string = pageAnnotationObject.annotations[z].fillColor;
                        pageAnnotationObject.annotations[z].fillColor = JSON.stringify(this.getRgbCode(fillColorString));
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

    private manageAnnotations(pageAnnotations: IShapeAnnotation[], pageNumber: number): void {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape');
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_shape', annotationStringified);
        }
    }

    private createAnnotationObject(annotationModel: PdfAnnotationBaseModel): IShapeAnnotation {
        let bound: IRectangle;
        let annotationName: string = this.pdfViewer.annotation.createGUID();
        // tslint:disable-next-line:max-line-length
        let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('shape', (annotationModel.pageIndex + 1), annotationModel.shapeAnnotationType);
        document.getElementById(commentsDivid).id = annotationName;
        annotationModel.annotName = annotationName;
        if (annotationModel.wrapper.bounds) {
            bound = {
                // tslint:disable-next-line:max-line-length
                left: annotationModel.wrapper.bounds.x, top: annotationModel.wrapper.bounds.y, height: annotationModel.wrapper.bounds.height, width: annotationModel.wrapper.bounds.width,
                right: annotationModel.wrapper.bounds.right, bottom: annotationModel.wrapper.bounds.bottom
            };
        } else {
            bound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
        }
        // tslint:disable-next-line:radix
        let borderDashArray: number = parseInt(annotationModel.borderDashArray);
        borderDashArray = isNaN(borderDashArray) ? 0 : borderDashArray;
        let date: Date = new Date();
        return {
            // tslint:disable-next-line:max-line-length
            id: annotationModel.id, shapeAnnotationType: this.getShapeAnnotType(annotationModel.shapeAnnotationType), author: this.author, subject: annotationModel.subject, note: annotationModel.notes,
            strokeColor: annotationModel.strokeColor, annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: date.toLocaleString(), author: this.author},
            fillColor: annotationModel.fillColor, opacity: annotationModel.opacity, thickness: annotationModel.thickness,
            // tslint:disable-next-line:max-line-length
            borderStyle: annotationModel.borderStyle, borderDashArray: borderDashArray, bounds: bound, modifiedDate: date.toLocaleString(),
            rotateAngle: 'RotateAngle' + annotationModel.rotateAngle, isCloudShape: annotationModel.isCloudShape, cloudIntensity: annotationModel.cloudIntensity,
            // tslint:disable-next-line:max-line-length
            vertexPoints: annotationModel.vertexPoints, lineHeadStart: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.sourceDecoraterShapes),
            lineHeadEnd: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.taregetDecoraterShapes), rectangleDifference: [], isLocked: false
        };
    }

    // tslint:disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
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
}