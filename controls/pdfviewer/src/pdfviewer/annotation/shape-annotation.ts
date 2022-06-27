/* eslint-disable */
import {
    PdfViewer, PdfViewerBase, IRectangle, IPageAnnotations, IPoint, ICommentsCollection, IReviewCollection,
    AnnotationType as AnnotType, LineHeadStyle, ShapeLabelSettingsModel, AllowedInteraction, AnnotationType
} from '../../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationType } from '../drawing/enum';
import {AnnotationSelectorSettingsModel } from '../pdfviewer-model';
import { AnnotationSelectorSettings } from '../pdfviewer';
import { ISize } from '..';

/**
 * @hidden
 */
export interface IShapeAnnotation {
    shapeAnnotationType: string
    author: string
    modifiedDate: string
    subject: string
    note: string
    strokeColor: string
    fillColor: string
    opacity: number
    bounds: IRectangle
    thickness: number
    borderStyle: string
    borderDashArray: number
    rotateAngle: string
    isCloudShape: boolean
    cloudIntensity: number
    vertexPoints: PointModel[]
    lineHeadStart: string
    lineHeadEnd: string
    rectangleDifference: string[]
    isLocked: boolean
    id: string
    comments: ICommentsCollection[]
    review: IReviewCollection
    annotName: string
    position?: string
    enableShapeLabel: boolean
    labelContent: string
    labelFillColor: string
    labelBorderColor: string
    fontColor: string
    fontSize: number
    labelBounds: IRectangle
    annotationSelectorSettings: AnnotationSelectorSettingsModel
    labelSettings?: ShapeLabelSettingsModel
    // eslint-disable-next-line
    annotationSettings?: any;
    customData: object
    allowedInteractions?: AllowedInteraction
    isPrint: boolean
    isCommentLock: boolean
    isAnnotationRotated: boolean
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
    /**
     * @private
     */
    public shapeCount: number = 0;
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;

    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @param shapeAnnotations
     * @param pageNumber
     * @param isImportAcion
     * @private
     */
    // eslint-disable-next-line
    public renderShapeAnnotations(shapeAnnotations: any, pageNumber: number, isImportAcion?: boolean): void {
        if (shapeAnnotations) {
            if (shapeAnnotations.length >= 1) {
                // eslint-disable-next-line
                let shapeAnnots: any[] = this.pdfViewer.annotation.getStoredAnnotations(pageNumber, shapeAnnotations, '_annotations_shape');
                if (!shapeAnnots || isImportAcion) {
                    for (let i: number = 0; i < shapeAnnotations.length; i++) {
                    // eslint-disable-next-line
                    let annotation: any = shapeAnnotations[i];
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        let annotationObject: IShapeAnnotation = null;
                        this.shapeCount = this.shapeCount + 1;
                        let isAnnotationRotated: boolean;
                        if (annotation.ShapeAnnotationType) {
                            if (isImportAcion) {
                                if (this.pdfViewerBase.isJsonImported) {
                                    annotation.Bounds =  this.pdfViewerBase.importJsonForRotatedDocuments(annotation.Rotate, pageNumber, annotation.Bounds, annotation.AnnotationRotation);
                                    isAnnotationRotated = this.pdfViewerBase.isPageRotated;
                                }
                            }
                            let vertexPoints: IPoint[] = null;
                            if (annotation.VertexPoints) {
                                vertexPoints = [];
                                if (isImportAcion && this.pdfViewerBase.isJsonImported) {
                                    vertexPoints = this.pdfViewerBase.calculateVertexPoints(annotation.Rotate, pageNumber, annotation.VertexPoints, annotation.AnnotationRotation);
                                } else {
                                    for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                                        let x: number = annotation.VertexPoints[j].X ? annotation.VertexPoints[j].X : annotation.VertexPoints[j].x;
                                        let y: number = annotation.VertexPoints[j].Y ? annotation.VertexPoints[j].Y : annotation.VertexPoints[j].y;
                                        const point: IPoint = { x: x, y: y };
                                        vertexPoints.push(point);
                                    }
                                }
                            }
                            // eslint-disable-next-line
                            if (annotation.Bounds && annotation.EnableShapeLabel === true) {
                            // eslint-disable-next-line max-len
                                annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
                                // eslint-disable-next-line max-len
                                annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
                                annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
                                annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
                                annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
                                // eslint-disable-next-line max-len
                                annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
                            }
                            // eslint-disable-next-line max-len
                            annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                            // eslint-disable-next-line max-len
                            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                            // eslint-disable-next-line max-len
                            annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                            let isPrint: boolean = true;
                            if (annotation.annotationAddMode === 'Imported Annotation') {
                                isPrint = annotation.IsPrint;
                            } else {
                                isPrint = annotation.AnnotationSettings.isPrint;
                            }
                            let left: number = annotation.Bounds.X ? annotation.Bounds.X : annotation.Bounds.x;
                            let top: number = annotation.Bounds.Y ? annotation.Bounds.Y : annotation.Bounds.y;
                            let width: number = annotation.Bounds.Width ? annotation.Bounds.Width : annotation.Bounds.width;
                            let height: number = annotation.Bounds.Height ? annotation.Bounds.Height : annotation.Bounds.height;                            // eslint-disable-next-line max-len
                            annotationObject = {
                                id: 'shape' + this.shapeCount, shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                                // eslint-disable-next-line max-len
                                note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
                                borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
                                // eslint-disable-next-line max-len
                                cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: {state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, annotName: annotation.AnnotName,
                                bounds: { left: left, top: top, width: width, height: height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
                                // eslint-disable-next-line max-len
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor, fontSize: annotation.FontSize,
                                // eslint-disable-next-line max-len
                                labelBounds: annotation.LabelBounds,  annotationSelectorSettings: this.getSettings(annotation), labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
                                customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: isPrint, isCommentLock: annotation.IsCommentLock, isAnnotationRotated: isAnnotationRotated
                            };
                            let annot: PdfAnnotationBaseModel;
                            // eslint-disable-next-line
                        let vPoints: any[] = annotationObject.vertexPoints;
                            if (vertexPoints == null) {
                                vPoints = [];
                            }
                            // eslint-disable-next-line max-len
                            annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                            annot = {
                            // eslint-disable-next-line max-len
                                id: 'shape' + this.shapeCount, shapeAnnotationType: this.getShapeType(annotationObject), author: annotationObject.author, allowedInteractions: annotationObject.allowedInteractions, modifiedDate: annotationObject.modifiedDate, annotName: annotationObject.annotName,
                                subject: annotationObject.subject, notes: annotationObject.note, fillColor: annotationObject.fillColor, strokeColor: annotationObject.strokeColor, opacity: annotationObject.opacity,
                                // eslint-disable-next-line max-len
                                thickness: annotationObject.thickness, borderStyle: annotationObject.borderStyle, borderDashArray: annotationObject.borderDashArray ? annotationObject.borderDashArray.toString(): '0', rotateAngle: parseFloat(annotationObject.rotateAngle.split('Angle')[1]), comments: annotationObject.comments, review: annotationObject.review,                            isCloudShape: annotationObject.isCloudShape, cloudIntensity: annotationObject.cloudIntensity, taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadEnd),
                                // eslint-disable-next-line max-len
                                sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadStart), vertexPoints: vPoints, bounds: { x: annotationObject.bounds.left, y: annotationObject.bounds.top, width: annotationObject.bounds.width, height: annotationObject.bounds.height },
                                pageIndex: pageNumber,
                                // eslint-disable-next-line max-len
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor, fontSize: annotation.FontSize,
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: annotation.AnnotationSelectorSettings,
                                annotationSettings: annotationObject.annotationSettings, annotationAddMode: annotation.annotationAddMode,
                                isPrint: isPrint, isCommentLock: annotationObject.isCommentLock
                            };
                            const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
                            if(this.isAddAnnotationProgramatically)
                            {
                                let settings: any = {
                                    opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness, modifiedDate: annot.modifiedDate,
                                    width: annot.bounds.width, height: annot.bounds.height
                                };
                                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, annotation.ShapeAnnotationType, annot.bounds, settings);
                            }
                        }
                    }
                }
            } else if (shapeAnnotations.shapeAnnotationType) {
                const annotationObject: IShapeAnnotation = this.createAnnotationObject(shapeAnnotations);
                if (!isNullOrUndefined(shapeAnnotations.formFieldAnnotationType) && shapeAnnotations.formFieldAnnotationType !== "")
                    this.pdfViewer.annotationModule.isFormFieldShape = true;
                else
                    this.pdfViewer.annotationModule.isFormFieldShape = false;
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
                this.pdfViewer.annotationModule.triggerAnnotationAdd(shapeAnnotations);
            }
        }
    }
    /**
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public getSettings(annotation : any) : any {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        } else {
            selector = this.getSelector(annotation.ShapeAnnotationType, annotation.Subject);
        }
        return selector;
    }
    /**
     * @param type
     * @private
     */
    public setAnnotationType(type: AnnotType): void {
        this.updateShapeProperties();
        this.pdfViewerBase.disableTextSelectionMode();
        let author: string = 'Guest';
        switch (type) {
        case 'Line':
            this.currentAnnotationMode = 'Line';
            // eslint-disable-next-line max-len
            const modifiedDateLine: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            // eslint-disable-next-line max-len
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.lineSettings.author ? this.pdfViewer.lineSettings.author : 'Guest';
            this.pdfViewer.drawingObject = {
                // eslint-disable-next-line max-len
                shapeAnnotationType: this.setShapeType('Line'), fillColor: this.lineFillColor, notes: '', strokeColor: this.lineStrokeColor, opacity: this.lineOpacity,
                thickness: this.lineThickness, modifiedDate: modifiedDateLine, borderDashArray: this.lineDashArray.toString(),
                // eslint-disable-next-line max-len
                sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.lineStartHead.toString()), taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.lineEndHead.toString()),
                author: author, subject: 'Line', lineHeadStart: this.lineStartHead, lineHeadEnd: this.lineEndHead, isCommentLock: false
            };
            this.pdfViewer.tool = 'Line';
            break;
        case 'Arrow':
            this.currentAnnotationMode = 'Arrow';
            // eslint-disable-next-line max-len
            const modifiedDateArrow: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.arrowSettings.author ? this.pdfViewer.arrowSettings.author : 'Guest';
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: this.setShapeType('Arrow'), opacity: this.arrowOpacity,
                // eslint-disable-next-line max-len
                sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.arrowStartHead.toString()),
                taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.arrowEndHead.toString()),
                // eslint-disable-next-line max-len
                fillColor: this.arrowFillColor, strokeColor: this.arrowStrokeColor, notes: '', thickness: this.arrowThickness,
                borderDashArray: this.arrowDashArray.toString(), author: author, subject: 'Arrow',
                // eslint-disable-next-line max-len
                modifiedDate: modifiedDateArrow, lineHeadStart: this.arrowStartHead, lineHeadEnd: this.arrowEndHead, isCommentLock: false
            };
            this.pdfViewer.tool = 'Line';
            break;
        case 'Rectangle':
            this.currentAnnotationMode = 'Rectangle';
            // eslint-disable-next-line max-len
            const modifiedDateRect: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            // eslint-disable-next-line max-len
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.rectangleSettings.author ? this.pdfViewer.rectangleSettings.author : 'Guest';
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: this.setShapeType('Rectangle'), strokeColor: this.rectangleStrokeColor,
                fillColor: this.rectangleFillColor, opacity: this.rectangleOpacity, notes: '',
                thickness: this.rectangleThickness, borderDashArray: '0', modifiedDate: modifiedDateRect,
                author: author, subject: 'Rectangle', isCommentLock: false
            };
            this.pdfViewer.tool = 'DrawTool';
            break;
        case 'Circle':
            this.currentAnnotationMode = 'Circle';
            // eslint-disable-next-line max-len
            const modifiedDateCir: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            // eslint-disable-next-line max-len
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.circleSettings.author ? this.pdfViewer.circleSettings.author : 'Guest';
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: this.setShapeType('Circle'), strokeColor: this.circleStrokeColor,
                fillColor: this.circleFillColor, opacity: this.circleOpacity, notes: '',
                thickness: this.circleThickness, borderDashArray: '0', modifiedDate: modifiedDateCir,
                author: author, subject: 'Circle', isCommentLock: false
            };
            this.pdfViewer.tool = 'DrawTool';
            break;
        case 'Polygon':
            this.currentAnnotationMode = 'Polygon';
            // eslint-disable-next-line max-len
            const modifiedDatePolygon: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            // eslint-disable-next-line max-len
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.polygonSettings.author ? this.pdfViewer.polygonSettings.author : 'Guest';
            this.pdfViewer.drawingObject = {
                strokeColor: this.polygonStrokeColor, fillColor: this.polygonFillColor,
                opacity: this.polygonOpacity, thickness: this.polygonThickness, borderDashArray: '0',
                notes: '', author: author, subject: 'Polygon',
                modifiedDate: modifiedDatePolygon, borderStyle: '', isCommentLock: false
            };
            this.pdfViewer.tool = 'Polygon';
            break;
        }
    }
    private updateShapeProperties(): void {
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
    }

    private setShapeType(shape: string): PdfAnnotationType {
        let shapeType: PdfAnnotationType;
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

    private getShapeType(shape: IShapeAnnotation): PdfAnnotationType {
        let shapeType: PdfAnnotationType;
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
        // eslint-disable-next-line max-len
        if ((shape.shapeAnnotationType === 'Line' || shape.shapeAnnotationType === 'Polyline') && (shape.lineHeadStart !== 'None' || shape.lineHeadEnd !== 'None')) {
            shapeType = 'LineWidthArrowHead';
        }
        return shapeType;
    }

    private getShapeAnnotType(shape: PdfAnnotationType): string {
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
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @param property
     * @param pageNumber
     * @param annotationBase
     * @private
     */
    // eslint-disable-next-line
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any): IShapeAnnotation {
        if (!isNullOrUndefined(annotationBase.formFieldAnnotationType) && annotationBase.formFieldAnnotationType !== "")
            this.pdfViewer.annotationModule.isFormFieldShape = true;
        else
            this.pdfViewer.annotationModule.isFormFieldShape = false;
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        let currentAnnotObject: IShapeAnnotation = null;
        if (annotationBase) {
            if (property === 'bounds') {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, true);
            }
        }
        const pageAnnotations: IShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        if (pageAnnotations[i].shapeAnnotationType === 'Line') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                            // eslint-disable-next-line max-len
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        } else if (pageAnnotations[i].shapeAnnotationType === 'Polygon') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                            // eslint-disable-next-line max-len
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        } else {
                            // eslint-disable-next-line max-len
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        }
                        if (pageAnnotations[i].enableShapeLabel === true && annotationBase.wrapper) {
                            let labelTop: number = 0;
                            let labelLeft: number = 0;
                            let labelWidth: number = 0;
                            const labelHeight: number = 24.6;
                            const labelMaxWidth: number = 151;
                            if (annotationBase.wrapper.bounds.width) {
                                // eslint-disable-next-line max-len
                                labelWidth = (annotationBase.wrapper.bounds.width / 2);
                                labelWidth = (labelWidth > 0 && labelWidth < labelMaxWidth) ? labelWidth : labelMaxWidth;
                            }
                            if (annotationBase.wrapper.bounds.left) {
                                // eslint-disable-next-line max-len
                                labelLeft = ( annotationBase.wrapper.bounds.left + (annotationBase.wrapper.bounds.width / 2) - (labelWidth / 2) );
                            }
                            if (annotationBase.wrapper.bounds.top) {
                                // eslint-disable-next-line max-len
                                labelTop = (annotationBase.wrapper.bounds.top + (annotationBase.wrapper.bounds.height / 2) - 12.3 );
                            }
                            // eslint-disable-next-line max-len
                            pageAnnotations[i].labelBounds = { left: labelLeft, top: labelTop, width: labelWidth, height: labelHeight, right: 0, bottom: 0 };
                        }
                    } else if (property === 'fill') {
                        pageAnnotations[i].fillColor = annotationBase.wrapper.children[0].style.fill;
                    } else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                    } else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    } else if (property === 'dashArray') {
                        pageAnnotations[i].borderDashArray = annotationBase.wrapper.children[0].style.strokeDashArray;
                        pageAnnotations[i].borderStyle = annotationBase.borderStyle;
                    } else if (property === 'startArrow') {
                        // eslint-disable-next-line max-len
                        pageAnnotations[i].lineHeadStart = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.sourceDecoraterShapes);
                    } else if (property === 'endArrow') {
                        // eslint-disable-next-line max-len
                        pageAnnotations[i].lineHeadEnd = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.taregetDecoraterShapes);
                    } else if (property === 'notes') {
                        pageAnnotations[i].note = annotationBase.notes;
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    } else if (property === 'labelContent') {
                        pageAnnotations[i].note = annotationBase.labelContent;
                        pageAnnotations[i].labelContent = annotationBase.labelContent;
                        break;
                    } else if (property === 'fontColor') {
                        pageAnnotations[i].fontColor = annotationBase.fontColor;
                    } else if (property === 'fontSize') {
                        pageAnnotations[i].fontSize = annotationBase.fontSize;
                    }
                    pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }

    /**
     * @param pageNumber
     * @param annotationBase
     * @param pageNumber
     * @param annotationBase
     * @private
     */
    public addInCollection(pageNumber: number, annotationBase: IShapeAnnotation): void {
        const pageAnnotations: IShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    }

    /**
     * @private
     */
    public saveShapeAnnotations(): string {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'];
        }
        // eslint-disable-next-line
        let annotations: Array<any> = new Array();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IShapeAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        if(!this.pdfViewerBase.checkFormFieldCollection(pageAnnotationObject.annotations[z].id)) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                            if (this.pdfViewerBase.isJsonExported) {
                                if (pageAnnotationObject.annotations[z].isAnnotationRotated) {
                                    pageAnnotationObject.annotations[z].bounds = this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex);
                                    pageAnnotationObject.annotations[z].vertexPoints = this.pdfViewer.annotation.getVertexPoints(pageAnnotationObject.annotations[z].vertexPoints, pageAnnotationObject.pageIndex);
                                } else {
                                    const pageDetails: any = this.pdfViewerBase.pageSize[pageAnnotationObject.pageIndex];
                                    if (pageDetails) {
                                        pageAnnotationObject.annotations[z].annotationRotation = pageDetails.rotation;;
                                    }
                                }
                            }
                        // eslint-disable-next-line max-len
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        const strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        const fillColorString: string = pageAnnotationObject.annotations[z].fillColor;
                        pageAnnotationObject.annotations[z].fillColor = JSON.stringify(this.getRgbCode(fillColorString));
                        // eslint-disable-next-line max-len
                        pageAnnotationObject.annotations[z].vertexPoints = JSON.stringify(this.pdfViewer.annotation.getVertexPoints(pageAnnotationObject.annotations[z].vertexPoints, pageAnnotationObject.pageIndex));
                        if (pageAnnotationObject.annotations[z].rectangleDifference !== null) {
                            // eslint-disable-next-line max-len
                            pageAnnotationObject.annotations[z].rectangleDifference = JSON.stringify(pageAnnotationObject.annotations[z].rectangleDifference);
                        }
                        if (pageAnnotationObject.annotations[z].enableShapeLabel === true) {
                            // eslint-disable-next-line max-len
                            pageAnnotationObject.annotations[z].labelBounds = JSON.stringify(this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(JSON.parse(pageAnnotationObject.annotations[z].bounds)));
                            const labelFillColorString: string = pageAnnotationObject.annotations[z].labelFillColor;
                            pageAnnotationObject.annotations[z].labelFillColor = JSON.stringify(this.getRgbCode(labelFillColorString));
                            const labelBorderColorString: string = pageAnnotationObject.annotations[z].labelBorderColor;
                            pageAnnotationObject.annotations[z].labelBorderColor = JSON.stringify(this.getRgbCode(labelBorderColorString));
                            pageAnnotationObject.annotations[z].labelSettings.fillColor = labelFillColorString;
                            const fontColorString: string = pageAnnotationObject.annotations[z].labelSettings.fontColor;
                            pageAnnotationObject.annotations[z].fontColor = JSON.stringify(this.getRgbCode(fontColorString));
                        }
                    } else{
                        pageAnnotationObject.annotations[z]="";
                    }
                    }
                    pageAnnotationObject.annotations=pageAnnotationObject.annotations.filter(item => item);
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }

    private manageAnnotations(pageAnnotations: IShapeAnnotation[], pageNumber: number): void {
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape');
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'] = annotationStringified;
            } else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_shape', annotationStringified);
            }
        }
    }

    private createAnnotationObject(annotationModel: PdfAnnotationBaseModel): IShapeAnnotation {
        let bound: IRectangle;
        let labelBound: IRectangle;
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        if(!annotationModel.formFieldAnnotationType) {
            // eslint-disable-next-line max-len
            const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('shape', (annotationModel.pageIndex + 1), annotationModel.shapeAnnotationType);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
        }  
        annotationModel.annotName = annotationName;
        if (annotationModel.wrapper.bounds) {
            bound = {
                // eslint-disable-next-line max-len
                left: annotationModel.wrapper.bounds.x, top: annotationModel.wrapper.bounds.y, height: annotationModel.wrapper.bounds.height, width: annotationModel.wrapper.bounds.width,
                right: annotationModel.wrapper.bounds.right, bottom: annotationModel.wrapper.bounds.bottom
            };
            labelBound = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(annotationModel.wrapper.bounds);
        } else {
            bound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
            labelBound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
        }
        if (annotationModel.subject === 'Line' && annotationModel.shapeAnnotationType === 'Polygon') {
            annotationModel.author = this.pdfViewer.annotationModule.updateAnnotationAuthor('shape', 'Polygon');
        } else {
            annotationModel.author = this.pdfViewer.annotationModule.updateAnnotationAuthor('shape', annotationModel.subject);
        }
        this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(annotationName, annotationModel.notes);
        // eslint-disable-next-line radix
        let borderDashArray: number = parseInt(annotationModel.borderDashArray);
        borderDashArray = isNaN(borderDashArray) ? 0 : borderDashArray;
        // eslint-disable-next-line
        let annotationSettings: any = this.pdfViewer.annotationModule.findAnnotationSettings(annotationModel, true);
        annotationModel.isPrint = annotationSettings.isPrint;
        let setting: any = this.pdfViewer.shapeLabelSettings; 
        let labelSettings: any = { borderColor: annotationModel.strokeColor, fillColor: annotationModel.fillColor, fontColor: annotationModel.fontColor,
            fontSize: annotationModel.fontSize, labelContent: annotationModel.labelContent, labelHeight: setting.labelHeight, labelWidth: setting.labelMaxWidth, opacity: annotationModel.opacity
        };
        return {
            // eslint-disable-next-line max-len
            id: annotationModel.id, shapeAnnotationType: this.getShapeAnnotType(annotationModel.shapeAnnotationType), author: annotationModel.author, allowedInteractions: this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotationModel),  subject: annotationModel.subject, note: annotationModel.notes,
            strokeColor: annotationModel.strokeColor, annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(), author: annotationModel.author},
            fillColor: annotationModel.fillColor, opacity: annotationModel.opacity, thickness: annotationModel.thickness,
            // eslint-disable-next-line max-len
            borderStyle: annotationModel.borderStyle, borderDashArray: borderDashArray, bounds: bound, modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(),
            rotateAngle: 'RotateAngle' + annotationModel.rotateAngle, isCloudShape: annotationModel.isCloudShape, cloudIntensity: annotationModel.cloudIntensity,
            // eslint-disable-next-line max-len
            vertexPoints: annotationModel.vertexPoints, lineHeadStart: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.sourceDecoraterShapes),
            lineHeadEnd: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.taregetDecoraterShapes), rectangleDifference: [], isLocked: annotationSettings.isLock,
            // eslint-disable-next-line max-len
            labelContent: annotationModel.labelContent, enableShapeLabel: annotationModel.enableShapeLabel, labelFillColor: annotationModel.labelFillColor,
            fontColor: annotationModel.fontColor, labelBorderColor: annotationModel.labelBorderColor, fontSize: annotationModel.fontSize,
            // eslint-disable-next-line max-len
            labelBounds: labelBound, annotationSelectorSettings: this.getSelector(annotationModel.shapeAnnotationType, annotationModel.subject ), labelSettings: labelSettings, annotationSettings: annotationSettings,
            customData: this.pdfViewer.annotation.getShapeData(annotationModel.shapeAnnotationType, annotationModel.subject), isPrint: annotationModel.isPrint, isCommentLock: annotationModel.isCommentLock, isAnnotationRotated: false
        };
    }

    private getSelector(type: string, subject: string): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (type === 'Line' && subject !== 'Arrow' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.lineSettings.annotationSelectorSettings;
        } else if ((type === 'LineWidthArrowHead' || subject === 'Arrow') && this.pdfViewer.lineSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.arrowSettings.annotationSelectorSettings;
        } else if ((type === 'Rectangle' || type === 'Square') && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.rectangleSettings.annotationSelectorSettings;
        } else if ((type === 'Ellipse' || type === 'Circle') && this.pdfViewer.circleSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.circleSettings.annotationSelectorSettings;
        } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.polygonSettings.annotationSelectorSettings;
        }
        return selector;
    }

    // eslint-disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // eslint-disable-next-line
        let annotationCollection: any[];
        // eslint-disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'];
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
    private getRgbCode(colorString: string): any {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // eslint-disable-next-line radix
        const r: number = parseInt(stringArray[0].split('(')[1]);
        // eslint-disable-next-line radix
        const g: number = parseInt(stringArray[1]);
        // eslint-disable-next-line radix
        const b: number = parseInt(stringArray[2]);
        // eslint-disable-next-line radix
        const a: number = parseFloat(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public saveImportedShapeAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: IShapeAnnotation = null;
        let vertexPoints: IPoint[] = null;
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('shape', annotation.Subject);
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                const point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                vertexPoints.push(point);
            }
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            // eslint-disable-next-line max-len
            annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            // eslint-disable-next-line max-len
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
        }
        // eslint-disable-next-line max-len
        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        // eslint-disable-next-line max-len
        annotation.allowedInteractions =  this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        // eslint-disable-next-line max-len
        annotationObject = {
            id: 'shape', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            // eslint-disable-next-line max-len
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            // eslint-disable-next-line max-len
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, annotName: annotation.AnnotName,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            // eslint-disable-next-line max-len
            labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation), labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock, isAnnotationRotated: false
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
    }

    /**
     * @param annotation
     * @param pageNumber
     * @param annotation
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public updateShapeAnnotationCollections(annotation: any, pageNumber: number): any {
        // eslint-disable-next-line
        let annotationObject: any = null;
        let vertexPoints: IPoint[] = null;
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                const point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                vertexPoints.push(point);
            }
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            // eslint-disable-next-line max-len
            annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            // eslint-disable-next-line max-len
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            let settings: any = this.pdfViewer.shapeLabelSettings;
            let labelSettings: any = { borderColor: annotation.StrokeColor, fillColor: annotation.FillColor, fontColor: annotation.FontColor,
                fontSize: annotation.FontSize, labelContent: annotation.LabelContent, labelHeight: settings.labelHeight, labelWidth: settings.labelWidth, opacity: annotation.Opacity
            };
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : labelSettings;
        }
        // eslint-disable-next-line max-len
        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        if (annotation.IsLocked) {
            annotation.AnnotationSettings.isLock = annotation.IsLocked;
        }
        // eslint-disable-next-line max-len
        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        // eslint-disable-next-line max-len
        annotationObject = {
            id: 'shape', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            // eslint-disable-next-line max-len
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            // eslint-disable-next-line max-len
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, annotationId: annotation.AnnotName,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            // eslint-disable-next-line max-len
            labelBounds: annotation.LabelBounds, pageNumber: pageNumber, labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint
        };
        return annotationObject;
    }

    /** 
     * This method used to add annotations with using program.
     * 
     * @param annotationType - It describes the annotation type 
     * @param annotationObject - It describes type of annotation object
     * @param offset - It describes about the annotation bounds or location
     * @returns Object
     * @private
     */
    public updateAddAnnotationDetails(annotationType: AnnotationType, annotationObject: any, offset: IPoint): Object 
    {
        //Creating new object if annotationObject is null
        if(!annotationObject)
        {
         annotationObject = { offset: { x: 10, y: 10}, pageNumber: 0, width: undefined, height: undefined};
         offset = annotationObject.offset;
        }
        else if(!annotationObject.offset)
         offset = { x: 10, y: 10};
        else
        offset = annotationObject.offset;

        //Initialize the annotation settings
        let annotationSelectorSettings: any = null;
        let allowedInteractions: any = null;
        let annotationSettings: any = null;
        let shapeAnnotationType: string =''; 
        let isArrow: boolean = false;
        let vertexPoints: any = null;

        //Creating the CurrentDate and Annotation name
        let currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        let annotationName: string = this.pdfViewer.annotation.createGUID();
        if(annotationType == 'Line')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.lineSettings.annotationSelectorSettings ? this.pdfViewer.lineSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;          
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.lineSettings);
            allowedInteractions = this.pdfViewer.lineSettings.allowedInteractions ? this.pdfViewer.lineSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            shapeAnnotationType = 'Line';
            if(annotationObject.vertexPoints)
                vertexPoints = annotationObject.vertexPoints;
            else    
                vertexPoints =[{x: offset.x, y: offset.y},{x: offset.x + 100, y: offset.y}]
            annotationObject.width = annotationObject.width?annotationObject.width : 1;
            annotationObject.height = annotationObject.height?annotationObject.height : 1;
        }
        else if(annotationType == 'Arrow')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.arrowSettings.annotationSelectorSettings ? this.pdfViewer.arrowSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;          
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.arrowSettings);
            allowedInteractions = this.pdfViewer.arrowSettings.allowedInteractions ? this.pdfViewer.arrowSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            shapeAnnotationType = 'Line';
            isArrow=true;
            if(annotationObject.vertexPoints)
                vertexPoints = annotationObject.vertexPoints;
            else    
                vertexPoints =[{x: offset.x, y: offset.y},{x: offset.x + 100, y: offset.y}]
            annotationObject.width = annotationObject.width?annotationObject.width : 1;
            annotationObject.height = annotationObject.height?annotationObject.height : 1;                
        }
        else if(annotationType == 'Rectangle')
        {              
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.rectangleSettings.annotationSelectorSettings ? this.pdfViewer.rectangleSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;          
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.rectangleSettings);
            allowedInteractions = this.pdfViewer.rectangleSettings.allowedInteractions ? this.pdfViewer.rectangleSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;               
            shapeAnnotationType = 'Square';
            annotationObject.width = annotationObject.width?annotationObject.width : 150;
            annotationObject.height = annotationObject.height?annotationObject.height : 75;
        }
        else if(annotationType == 'Circle')
        {              
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.circleSettings.annotationSelectorSettings ? this.pdfViewer.circleSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;          
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.circleSettings);
            allowedInteractions = this.pdfViewer.circleSettings.allowedInteractions ? this.pdfViewer.circleSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;               
            shapeAnnotationType = 'Circle';
            annotationObject.width = annotationObject.width?annotationObject.width : 100;
            annotationObject.height = annotationObject.height?annotationObject.height : 90;
        }
        else if(annotationType == 'Polygon')
        {              
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.polygonSettings.annotationSelectorSettings ? this.pdfViewer.polygonSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;          
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.polygonSettings);
            allowedInteractions = this.pdfViewer.polygonSettings.allowedInteractions ? this.pdfViewer.polygonSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;               
            shapeAnnotationType = 'Polygon';
            if(annotationObject.vertexPoints)
                vertexPoints = annotationObject.vertexPoints;
            else    
                vertexPoints =[ {x:offset.x, y:offset.y}, {x:offset.x+42, y:offset.y -29}, {x:offset.x+89, y:offset.y - 1}, {x:offset.x+78, y:offset.y +42}, {x:offset.x+11, y:offset.y +42}, {x:offset.x, y:offset.y}];
            annotationObject.width = annotationObject.width?annotationObject.width : 1;
            annotationObject.height = annotationObject.height?annotationObject.height : 1;
        }
        annotationSettings.isLock = annotationObject.isLock?annotationObject.isLock:false;
        annotationSettings.minHeight = annotationObject.minHeight?annotationObject.minHeight: 0;
        annotationSettings.minWidth = annotationObject.minWidth?annotationObject.minWidth: 0;
        annotationSettings.maxWidth = annotationObject.maxWidth?annotationObject.maxWidth: 0;
        annotationSettings.maxHeight = annotationObject.maxHeight?annotationObject.maxHeight: 0;

        //Converting points model into vertex property
        if(vertexPoints)
            vertexPoints = this.pdfViewer.annotation.getVertexPointsXY(vertexPoints);

        //Creating Annotation objects with it's proper properties
        let shapeAnnotation: any = [];
        let shape: any = {
            AllowedInteractions: annotationObject.allowedInteractions?annotationObject.allowedInteractions : allowedInteractions,
            AnnotName: annotationName,
            AnnotType: 'shape',
            AnnotationSelectorSettings: annotationObject.annotationSelectorSettings?annotationObject.annotationSelectorSettings: annotationSelectorSettings,       
            AnnotationSettings: annotationSettings,
            Author: annotationObject.author ? annotationObject.author : 'Guest',
            BorderDashArray: annotationObject.borderDashArray? annotationObject.borderDashArray:0,
            BorderStyle: 'Solid',
            Bounds: {X: offset.x, Y: offset.y, Width: annotationObject.width, Height: annotationObject.height, Left: offset.x, Top: offset.y, Location:{X: offset.x,Y: offset.y}, Size:{Height: annotationObject.height,IsEmpty: false,Width: annotationObject.width}},
            CloudIntensity: 0,
            Comments: null,
            CustomData: annotationObject.customData?annotationObject.customData:null,
            CreatedDate: currentDateString,
            EnableShapeLabel: false,
            ExistingCustomData: null,
            FillColor: annotationObject.fillColor?annotationObject.fillColor:'#ffffff00',
            FontColor: null,
            FontSize: 0,
            IsCloudShape: false,
            IsCommentLock: false,
            IsLocked : annotationObject.isLock?annotationObject.isLock:false,
            IsPrint: annotationObject.isPrint?annotationObject.isPrint:true,
            LabelBorderColor: null,
            LabelBounds: {X: 0, Y: 0, Width: 0, Height: 0},
            LabelContent: null,
            LabelFillColor: null,
            LabelSettings: null,
            LineHeadEnd: annotationObject.lineHeadStartStyle?annotationObject.lineHeadStartStyle:isArrow?'ClosedArrow':'None',
            LineHeadStart: annotationObject.lineHeadEndStyle?annotationObject.lineHeadEndStyle:isArrow?'ClosedArrow':'None',
            ModifiedDate: '',
            Note: '',
            Opacity: annotationObject.opacity?annotationObject.opacity:1,
            RectangleDifference: null,
            RotateAngle: 'RotateAngle0',
            ShapeAnnotationType: shapeAnnotationType,
            State: '',
            StateModel: '',
            StrokeColor: annotationObject.strokeColor?annotationObject.strokeColor:'#ff0000',
            Subject: annotationType.toString(),
            Thickness: annotationObject.thickness?annotationObject.thickness:1,
            VertexPoints : vertexPoints
        }

        //Adding the annotation object to an array and return it
        shapeAnnotation[0] = shape;
        return {shapeAnnotation};
    }
}
