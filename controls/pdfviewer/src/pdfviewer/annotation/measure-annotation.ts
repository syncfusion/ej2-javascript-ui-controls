import { PdfViewer, PdfViewerBase, IRectangle, IPageAnnotations, IPoint, AnnotationType as AnnotType } from '../../index';
import { ColorPicker, NumericTextBox } from '@syncfusion/ej2-inputs';
import { PdfAnnotationBase } from '../../diagram/pdf-annotation';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { AnnotationType } from '../../diagram/enum';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { PointModel, Point } from '@syncfusion/ej2-drawings';
import { ICommentsCollection, IReviewCollection } from './sticky-notes-annotation';
import { LineHeadStyle, CalibrationUnit } from '../base';

/**
 * @hidden
 */
export interface IMeasureShapeAnnotation {
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
    caption: boolean;
    captionPosition: string;
    leaderLineExtension: number;
    leaderLength: number;
    leaderLineOffset: number;
    indent: string;
    // tslint:disable-next-line
    calibrate: any;
    id: string;
    annotName: string;
    comments: ICommentsCollection[];
    review: IReviewCollection;
}

/**
 * @hidden
 */
export interface IMeasure {
    ratio: string;
    x?: INumberFormat[];
    distance?: INumberFormat[];
    area?: INumberFormat[];
    angle?: INumberFormat[];
    volume?: INumberFormat[];
    targetUnitConversion?: number;
    depth?: number;
}

/**
 * @hidden
 */
export interface INumberFormat {
    unit: string;
    conversionFactor: number;
    fractionalType: string;
    denominator: number;
    formatDenominator: boolean;
}

/**
 * @hidden
 */
export class MeasureAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public currentAnnotationMode: string;
    /**
     * @private
     */
    public distanceOpacity: number;
    /**
     * @private
     */
    public perimeterOpacity: number;
    /**
     * @private
     */
    public areaOpacity: number;
    /**
     * @private
     */
    public radiusOpacity: number;
    /**
     * @private
     */
    public volumeOpacity: number;
    /**
     * @private
     */
    public distanceFillColor: string;
    /**
     * @private
     */
    public perimeterFillColor: string;
    /**
     * @private
     */
    public areaFillColor: string;
    /**
     * @private
     */
    public radiusFillColor: string;
    /**
     * @private
     */
    public volumeFillColor: string;
    /**
     * @private
     */
    public distanceStrokeColor: string;
    /**
     * @private
     */
    public perimeterStrokeColor: string;
    /**
     * @private
     */
    public areaStrokeColor: string;
    /**
     * @private
     */
    public radiusStrokeColor: string;
    /**
     * @private
     */
    public volumeStrokeColor: string;
    /**
     * @private
     */
    public distanceThickness: number;
    /**
     * @private
     */
    public perimeterThickness: number;
    /**
     * @private
     */
    public areaThickness: number;
    /**
     * @private
     */
    public radiusThickness: number;
    /**
     * @private
     */
    public volumeThickness: number;
    /**
     * @private
     */
    public distanceDashArray: number;
    /**
     * @private
     */
    public distanceStartHead: LineHeadStyle;
    /**
     * @private
     */
    public distanceEndHead: LineHeadStyle;
    /**
     * @private
     */
    public perimeterDashArray: number;
    /**
     * @private
     */
    public perimeterStartHead: LineHeadStyle;
    /**
     * @private
     */
    public perimeterEndHead: LineHeadStyle;
    private unit: CalibrationUnit;
    /**
     * @private
     */
    public displayUnit: CalibrationUnit;
    private ratio: number;
    private volumeDepth: number;
    private scaleRatioString: string;
    private scaleRatioDialog: Dialog;
    private sourceTextBox: NumericTextBox;
    private convertUnit: DropDownButton;
    private destTextBox: NumericTextBox;
    private dispUnit: DropDownButton;
    private depthTextBox: NumericTextBox;
    private depthUnit: DropDownButton;
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.distanceFillColor = this.pdfViewer.distanceSettings.fillColor ? this.pdfViewer.distanceSettings.fillColor : '#ff0000';
        this.distanceStrokeColor = this.pdfViewer.distanceSettings.strokeColor ? this.pdfViewer.distanceSettings.strokeColor : '#ff0000';
        this.distanceOpacity = this.pdfViewer.distanceSettings.opacity ? this.pdfViewer.distanceSettings.opacity : 1;
        this.distanceThickness = this.pdfViewer.distanceSettings.thickness ? this.pdfViewer.distanceSettings.thickness : 1;
        this.distanceDashArray = this.pdfViewer.distanceSettings.borderDashArray ? this.pdfViewer.distanceSettings.borderDashArray : 0;
        // tslint:disable-next-line:max-line-length
        this.distanceStartHead = this.pdfViewer.distanceSettings.lineHeadStartStyle ? this.pdfViewer.distanceSettings.lineHeadStartStyle : 'Closed';
        this.distanceEndHead = this.pdfViewer.distanceSettings.lineHeadEndStyle ? this.pdfViewer.distanceSettings.lineHeadEndStyle : 'Closed';
        this.perimeterFillColor = this.pdfViewer.perimeterSettings.fillColor ? this.pdfViewer.perimeterSettings.fillColor : '#ffffff00';
        this.perimeterStrokeColor = this.pdfViewer.perimeterSettings.strokeColor ? this.pdfViewer.perimeterSettings.strokeColor : '#ff0000';
        this.perimeterOpacity = this.pdfViewer.perimeterSettings.opacity ? this.pdfViewer.perimeterSettings.opacity : 1;
        this.perimeterThickness = this.pdfViewer.perimeterSettings.thickness ? this.pdfViewer.perimeterSettings.thickness : 1;
        this.perimeterDashArray = this.pdfViewer.perimeterSettings.borderDashArray ? this.pdfViewer.perimeterSettings.borderDashArray : 0;
        // tslint:disable-next-line:max-line-length
        this.perimeterStartHead = this.pdfViewer.perimeterSettings.lineHeadStartStyle ? this.pdfViewer.perimeterSettings.lineHeadStartStyle : 'Open';
        this.perimeterEndHead = this.pdfViewer.perimeterSettings.lineHeadEndStyle ? this.pdfViewer.perimeterSettings.lineHeadEndStyle : 'Open';
        this.areaFillColor = this.pdfViewer.areaSettings.fillColor ? this.pdfViewer.areaSettings.fillColor : '#ffffff00';
        this.areaStrokeColor = this.pdfViewer.areaSettings.strokeColor ? this.pdfViewer.areaSettings.strokeColor : '#ff0000';
        this.areaOpacity = this.pdfViewer.areaSettings.opacity ? this.pdfViewer.areaSettings.opacity : 1;
        this.areaThickness = this.pdfViewer.areaSettings.thickness ? this.pdfViewer.areaSettings.thickness : 1;
        this.radiusFillColor = this.pdfViewer.radiusSettings.fillColor ? this.pdfViewer.radiusSettings.fillColor : '#ffffff00';
        this.radiusStrokeColor = this.pdfViewer.radiusSettings.strokeColor ? this.pdfViewer.radiusSettings.strokeColor : '#ff0000';
        this.radiusOpacity = this.pdfViewer.radiusSettings.opacity ? this.pdfViewer.radiusSettings.opacity : 1;
        this.radiusThickness = this.pdfViewer.radiusSettings.thickness ? this.pdfViewer.radiusSettings.thickness : 1;
        this.volumeFillColor = this.pdfViewer.volumeSettings.fillColor ? this.pdfViewer.volumeSettings.fillColor : '#ffffff00';
        this.volumeStrokeColor = this.pdfViewer.volumeSettings.strokeColor ? this.pdfViewer.volumeSettings.strokeColor : '#ff0000';
        this.volumeOpacity = this.pdfViewer.volumeSettings.opacity ? this.pdfViewer.volumeSettings.opacity : 1;
        this.volumeThickness = this.pdfViewer.volumeSettings.thickness ? this.pdfViewer.volumeSettings.thickness : 1;
        this.unit = this.pdfViewer.measurementSettings.conversionUnit;
        this.displayUnit = this.pdfViewer.measurementSettings.displayUnit;
        this.ratio = this.pdfViewer.measurementSettings.scaleRatio;
        this.volumeDepth = this.pdfViewer.measurementSettings.depth;
        this.scaleRatioString = '1 ' + this.unit + ' = ' + '1 ' + this.displayUnit;
    }

    /**
     * @private
     */
    public get pixelToPointFactor(): number {
        return  (72 / 96);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public renderMeasureShapeAnnotations(shapeAnnotations: any, pageNumber: number): void {
        if (shapeAnnotations) {
            if (shapeAnnotations.length >= 1) {
                for (let i: number = 0; i < shapeAnnotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation: any = shapeAnnotations[i];
                    let annotationObject: IMeasureShapeAnnotation = null;
                    if (annotation.ShapeAnnotationType) {
                        let vertexPoints: IPoint[] = null;
                        if (annotation.VertexPoints) {
                            vertexPoints = [];
                            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                                let point: IPoint = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                                vertexPoints.push(point);
                            }
                        }
                        let measureObject: IMeasure = {
                            // tslint:disable-next-line:max-line-length
                            ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X), distance: this.getNumberFormatArray(annotation.Calibrate.Distance), area: this.getNumberFormatArray(annotation.Calibrate.Area), angle: this.getNumberFormatArray(annotation.Calibrate.Angle), volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
                            targetUnitConversion: annotation.Calibrate.TargetUnitConversion
                        };
                        if (annotation.Calibrate.Depth) {
                            measureObject.depth = annotation.Calibrate.Depth;
                        }
                        annotationObject = {
                            // tslint:disable-next-line:max-line-length
                            id: 'measure' + i, shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
                            // tslint:disable-next-line:max-line-length
                            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
                            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked,
                            // tslint:disable-next-line:max-line-length
                            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
                            caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject, leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
                            // tslint:disable-next-line:max-line-length
                            leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent, annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation),
                            review: {state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }
                        };
                        let annot: PdfAnnotationBaseModel;
                        // tslint:disable-next-line
                        let vPoints: any[] = annotationObject.vertexPoints;
                        if (vertexPoints == null) {
                            vPoints = [];
                        }
                        annot = {
                            // tslint:disable-next-line:max-line-length
                            id: 'measure' + i, shapeAnnotationType: this.getShapeType(annotationObject), author: annotationObject.author, modifiedDate: annotationObject.modifiedDate,
                            subject: annotationObject.subject, notes: annotationObject.note, fillColor: annotationObject.fillColor, strokeColor: annotationObject.strokeColor, opacity: annotationObject.opacity,
                            // tslint:disable-next-line:max-line-length
                            thickness: annotationObject.thickness, borderStyle: annotationObject.borderStyle, borderDashArray: annotationObject.borderDashArray.toString(), rotateAngle: parseFloat(annotationObject.rotateAngle.split('Angle')[1]),
                            isCloudShape: annotationObject.isCloudShape, cloudIntensity: annotationObject.cloudIntensity, taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadEnd), sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadStart),
                            // tslint:disable-next-line:max-line-length
                            vertexPoints: vPoints, bounds: { x: annotationObject.bounds.left, y: annotationObject.bounds.top, width: annotationObject.bounds.width, height: annotationObject.bounds.height }, leaderHeight: annotationObject.leaderLength,
                            pageIndex: pageNumber, annotName: annotationObject.annotName, comments: annotationObject.comments, review: annotationObject.review,
                            measureType: this.getMeasureType(annotationObject)
                        };
                        this.pdfViewer.annotation.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
                        this.pdfViewer.add(annot as PdfAnnotationBase);
                    }
                }
            } else if (shapeAnnotations.shapeAnnotationType) {
                let annotationObject: IMeasureShapeAnnotation = this.createAnnotationObject(shapeAnnotations);
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
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
            case 'Distance':
                this.currentAnnotationMode = 'Distance';
                let modifiedDateDist: string = date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.distanceStartHead),
                    taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.distanceEndHead), measureType: 'Distance',
                    fillColor: this.distanceFillColor, notes: '', strokeColor: this.distanceStrokeColor,
                    opacity: this.distanceOpacity, thickness: this.distanceThickness, borderDashArray: this.distanceDashArray.toString(),
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Distance', author: this.pdfViewer.distanceSettings.author, subject: this.pdfViewer.distanceSettings.subject
                };
                this.pdfViewer.tool = 'Distance';
                break;
            case 'Perimeter':
                this.currentAnnotationMode = 'Perimeter';
                let modifiedDatePeri: string = date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'LineWidthArrowHead', fillColor: this.perimeterFillColor, notes: '', strokeColor: this.perimeterStrokeColor, opacity: this.perimeterOpacity,
                    thickness: this.perimeterThickness, sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.perimeterStartHead),
                    // tslint:disable-next-line:max-line-length
                    taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.perimeterEndHead), measureType: 'Perimeter', borderDashArray: this.perimeterDashArray.toString(),
                    author: this.pdfViewer.perimeterSettings.author, subject: this.pdfViewer.perimeterSettings.subject
                };
                this.pdfViewer.tool = 'Perimeter';
                break;
            case 'Area':
                this.currentAnnotationMode = 'Area';
                let modifiedDateArea: string = date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Polygon', fillColor: this.areaFillColor, notes: '', strokeColor: this.areaStrokeColor,
                    thickness: this.areaThickness, opacity: this.areaOpacity, measureType: 'Area',
                    modifiedDate: modifiedDateArea, borderStyle: '', borderDashArray: '0',
                    author: this.pdfViewer.areaSettings.author, subject: this.pdfViewer.areaSettings.subject
                };
                this.pdfViewer.tool = 'Polygon';
                break;
            case 'Radius':
                this.currentAnnotationMode = 'Radius';
                let modifiedDateRad: string = date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Radius', fillColor: this.radiusFillColor, notes: '', strokeColor: this.radiusStrokeColor, opacity: this.radiusOpacity,
                    thickness: this.radiusThickness, measureType: 'Radius', modifiedDate: modifiedDateRad, borderStyle: '', borderDashArray: '0',
                    author: this.pdfViewer.radiusSettings.author, subject: this.pdfViewer.radiusSettings.subject
                };
                this.pdfViewer.tool = 'DrawTool';
                break;
            case 'Volume':
                this.currentAnnotationMode = 'Volume';
                let modifiedDateVol: string = date.toLocaleString();
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Polygon', notes: '', fillColor: this.volumeFillColor, strokeColor: this.volumeStrokeColor,
                    opacity: this.volumeOpacity, thickness: this.volumeThickness, measureType: 'Volume',
                    modifiedDate: modifiedDateVol, borderStyle: '', borderDashArray: '0',
                    author: this.pdfViewer.volumeSettings.author, subject: this.pdfViewer.volumeSettings.subject
                };
                this.pdfViewer.tool = 'Polygon';
                break;
        }
    }

    private createAnnotationObject(annotationModel: PdfAnnotationBaseModel): IMeasureShapeAnnotation {
        let bound: IRectangle;
        let annotationName: string = this.pdfViewer.annotation.createGUID();
        // tslint:disable-next-line:max-line-length
        let commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('shape_measure', (annotationModel.pageIndex + 1), annotationModel.measureType);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        annotationModel.annotName = annotationName;
        this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(annotationName, annotationModel.notes);
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
        // tslint:disable-next-line:max-line-length
        let measure: IMeasure = { ratio: this.scaleRatioString, x: [this.createNumberFormat('x')], distance: [this.createNumberFormat('d')], area: [this.createNumberFormat('a')] };
        if (annotationModel.measureType === 'Volume') {
            measure.depth = this.volumeDepth;
        }
        return {
            // tslint:disable-next-line:max-line-length
            id: annotationModel.id, shapeAnnotationType: this.getShapeAnnotType(annotationModel.measureType), author: annotationModel.author,
            subject: annotationModel.subject, note: annotationModel.notes, strokeColor: annotationModel.strokeColor,
            fillColor: annotationModel.fillColor, opacity: annotationModel.opacity, thickness: annotationModel.thickness,
            // tslint:disable-next-line:max-line-length
            borderStyle: annotationModel.borderStyle, borderDashArray: borderDashArray, bounds: bound, modifiedDate: date.toLocaleString(),
            rotateAngle: 'RotateAngle' + annotationModel.rotateAngle, isCloudShape: annotationModel.isCloudShape, cloudIntensity: annotationModel.cloudIntensity,
            // tslint:disable-next-line:max-line-length
            vertexPoints: annotationModel.vertexPoints, lineHeadStart: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.sourceDecoraterShapes),
            lineHeadEnd: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.taregetDecoraterShapes), rectangleDifference: [], isLocked: false,
            // tslint:disable-next-line:max-line-length
            leaderLength: annotationModel.leaderHeight, leaderLineExtension: 2, leaderLineOffset: 0, calibrate: measure, caption: true, captionPosition: 'Top',
            indent: this.getIndent(annotationModel.measureType), annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: date.toLocaleString(), author: annotationModel.author}
        };
    }

    private getShapeAnnotType(measureType: string): string {
        let annotationType: string;
        switch (measureType) {
            case 'Distance':
            annotationType = 'Line';
            break;
            case 'Perimeter':
            annotationType = 'Polyline';
            break;
            case 'Area':
            case 'Volume':
            annotationType = 'Polygon';
            break;
            case 'Radius':
            annotationType = 'Circle';
            break;
        }
        return annotationType;
    }

    private getShapeType(shape: IMeasureShapeAnnotation): AnnotationType {
        let shapeType: AnnotationType;
        if (shape.shapeAnnotationType === 'Line') {
            shapeType = 'Distance';
        } else if (shape.shapeAnnotationType === 'Polyline') {
            shapeType = 'LineWidthArrowHead';
        } else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonDimension') {
            shapeType = 'Polygon';
            // tslint:disable-next-line:max-line-length
        } else if ((shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonRadius') || shape.shapeAnnotationType === 'Circle') {
            shapeType = 'Radius';
        } else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonVolume') {
            shapeType = 'Polygon';
        }
        return shapeType;
    }

    private getMeasureType(shape: IMeasureShapeAnnotation): string {
        let measureType: string;
        if (shape.shapeAnnotationType === 'Line') {
            measureType = 'Distance';
        } else if (shape.shapeAnnotationType === 'Polyline') {
            measureType = 'Perimeter';
        } else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonDimension') {
            measureType = 'Area';
            // tslint:disable-next-line:max-line-length
        } else if ((shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonRadius') || shape.shapeAnnotationType === 'Circle') {
            measureType = 'Radius';
        } else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonVolume') {
            measureType = 'Volume';
        }
        return measureType;
    }

    private getIndent(measureType: string): string {
        let indent: string;
        switch (measureType) {
            case 'Distance':
            indent = 'LineDimension';
            break;
            case 'Perimeter':
            indent = 'PolyLineDimension';
            break;
            case 'Area':
            indent = 'PolygonDimension';
            break;
            case 'Radius':
            indent = 'PolygonRadius';
            break;
            case 'Volume':
            indent = 'PolygonVolume';
            break;
        }
        return indent;
    }

    // tslint:disable-next-line
    private getNumberFormatArray(list: any[]): INumberFormat[] {
        // tslint:disable-next-line
        let numberFormatArray: Array<any> = new Array();
        for (let i: number = 0; i < list.length; i++) {
            // tslint:disable-next-line:max-line-length
            numberFormatArray[i] = { unit: list[i].Unit, fractionalType: list[i].FractionalType, conversionFactor: list[i].ConversionFactor, denominator: list[i].Denominator, formatDenominator: list[i].FormatDenominator };
        }
        return numberFormatArray;
    }

    private createNumberFormat(type: string): INumberFormat {
        let cFactor: number = 1;
        let unit: string = this.displayUnit;
        if (type === 'x') {
            cFactor = this.getFactor();
        }
        if (type === 'a') {
            unit = 'sq ' + this.displayUnit;
        }
        // tslint:disable-next-line:max-line-length
        let numberFormat: INumberFormat = { unit: unit, fractionalType: 'D', conversionFactor: cFactor, denominator: 100, formatDenominator: false };
        return numberFormat;
    }

    /**
     * @private
     */
    public saveMeasureShapeAnnotations(): string {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        // tslint:disable-next-line
        let annotations: Array<any> = new Array();
        let colorpick: ColorPicker = new ColorPicker();
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IMeasureShapeAnnotation[] = [];
                let pageAnnotationObject: IPageAnnotations = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(pageAnnotationObject.annotations[z].bounds);
                        let strokeColorString: string = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        let fillColorString: string = pageAnnotationObject.annotations[z].fillColor;
                        pageAnnotationObject.annotations[z].fillColor = JSON.stringify(this.getRgbCode(fillColorString));
                        pageAnnotationObject.annotations[z].vertexPoints = JSON.stringify(pageAnnotationObject.annotations[z].vertexPoints);
                        if (pageAnnotationObject.annotations[z].rectangleDifference !== null) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].rectangleDifference = JSON.stringify(pageAnnotationObject.annotations[z].rectangleDifference);
                        }
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].calibrate = this.getStringifiedMeasure(pageAnnotationObject.annotations[z].calibrate);
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
    public createScaleRatioWindow(): void {
        let elementID: string = this.pdfViewer.element.id;
        let dialogDiv: HTMLElement = createElement('div', { id: elementID + '_scale_ratio_window', className: 'e-pv-scale-ratio-window' });
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        let contentElement: HTMLElement = this.createRatioUI();
        this.scaleRatioDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Scale Ratio'),
            target: this.pdfViewer.element, content: contentElement, close: () => {
                this.sourceTextBox.destroy();
                this.convertUnit.destroy();
                this.destTextBox.destroy();
                this.dispUnit.destroy();
                this.scaleRatioDialog.destroy();
                let dialogElement: HTMLElement = this.pdfViewerBase.getElement('_scale_ratio_window');
                dialogElement.parentElement.removeChild(dialogElement);
            }
        });
        if (!Browser.isDevice) {
            this.scaleRatioDialog.buttons = [
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
            ];
        } else {
            this.scaleRatioDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.scaleRatioDialog.enableRtl = true;
        }
        this.scaleRatioDialog.appendTo(dialogDiv);
        this.convertUnit.content = this.createContent(this.unit).outerHTML;
        this.dispUnit.content = this.createContent(this.displayUnit).outerHTML;
        this.depthUnit.content = this.createContent(this.displayUnit).outerHTML;
    }

    private createRatioUI(): HTMLElement {
        let element: HTMLElement = createElement('div');
        let elementID: string = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        let items: { [key: string]: Object }[] = [{ text: 'pt' }, { text: 'in' }, { text: 'mm' }, { text: 'cm' }, { text: 'p' }];
        let labelText: HTMLElement = createElement('div', { id: elementID + '_scale_ratio_label', className: 'e-pv-scale-ratio-text' });
        labelText.textContent = this.pdfViewer.localeObj.getConstant('Scale Ratio');
        element.appendChild(labelText);
        let sourceContainer: HTMLElement = createElement('div', { id: elementID + '_scale_src_container' });
        element.appendChild(sourceContainer);
        // tslint:disable-next-line:max-line-length
        let srcInputElement: HTMLElement = this.createInputElement('input', 'e-pv-scale-ratio-src-input', elementID + '_src_input', sourceContainer);
        this.sourceTextBox = new NumericTextBox({ value: 1, format: '##', cssClass: 'e-pv-scale-ratio-src-input', min: 1, max: 100 }, (srcInputElement as HTMLInputElement));
        // tslint:disable-next-line:max-line-length
        let srcUnitElement: HTMLElement = this.createInputElement('button', 'e-pv-scale-ratio-src-unit', elementID + '_src_unit', sourceContainer);
        this.convertUnit = new DropDownButton({ items: items, cssClass: 'e-pv-scale-ratio-src-unit' }, (srcUnitElement as HTMLButtonElement));
        this.convertUnit.select = this.convertUnitSelect.bind(this);
        let destinationContainer: HTMLElement = createElement('div', { id: elementID + '_scale_dest_container' });
        // tslint:disable-next-line:max-line-length
        let destInputElement: HTMLElement = this.createInputElement('input', 'e-pv-scale-ratio-dest-input', elementID + '_dest_input', destinationContainer);
        this.destTextBox = new NumericTextBox({ value: 1, format: '##', cssClass: 'e-pv-scale-ratio-dest-input', min: 1, max: 100 }, (destInputElement as HTMLInputElement));
        // tslint:disable-next-line:max-line-length
        let destUnitElement: HTMLElement = this.createInputElement('button', 'e-pv-scale-ratio-dest-unit', elementID + '_dest_unit', destinationContainer);
        this.dispUnit = new DropDownButton({ items: items, cssClass: 'e-pv-scale-ratio-dest-unit' }, (destUnitElement as HTMLButtonElement));
        this.dispUnit.select = this.dispUnitSelect.bind(this);
        element.appendChild(destinationContainer);
        let depthLabelText: HTMLElement = createElement('div', { id: elementID + '_depth_label', className: 'e-pv-depth-text' });
        depthLabelText.textContent = this.pdfViewer.localeObj.getConstant('Depth');
        element.appendChild(depthLabelText);
        let depthContainer: HTMLElement = createElement('div', { id: elementID + '_depth_container' });
        element.appendChild(depthContainer);
        // tslint:disable-next-line:max-line-length
        let depthInputElement: HTMLElement = this.createInputElement('input', 'e-pv-depth-input', elementID + '_depth_input', depthContainer);
        this.depthTextBox = new NumericTextBox({ value: this.volumeDepth, format: '##', cssClass: 'e-pv-depth-input', min: 1 }, (depthInputElement as HTMLInputElement));
        // tslint:disable-next-line:max-line-length
        let depthUnitElement: HTMLElement = this.createInputElement('button', 'e-pv-depth-unit', elementID + '_depth_unit', depthContainer);
        this.depthUnit = new DropDownButton({ items: items, cssClass: 'e-pv-depth-unit' }, (depthUnitElement as HTMLButtonElement));
        this.depthUnit.select = this.depthUnitSelect.bind(this);
        return element;
    }

    private convertUnitSelect(args: MenuEventArgs): void {
        this.convertUnit.content = this.createContent(args.item.text).outerHTML;
    }

    private dispUnitSelect(args: MenuEventArgs): void {
        this.dispUnit.content = this.createContent(args.item.text).outerHTML;
        this.depthUnit.content = this.createContent(args.item.text).outerHTML;
    }

    private depthUnitSelect(args: MenuEventArgs): void {
        this.depthUnit.content = this.createContent(args.item.text).outerHTML;
    }

    private createContent(text: string): HTMLElement {
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-scale-unit-content' });
        divElement.textContent = text;
        return divElement;
    }

    private createInputElement(input: string, className: string, idString: string, parentElement: HTMLElement): HTMLElement {
        let container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        let textBoxInput: HTMLElement = createElement(input, { id: idString });
        if (input === 'input') {
            (textBoxInput as HTMLInputElement).type = 'text';
        }
        container.appendChild(textBoxInput);
        parentElement.appendChild(container);
        return textBoxInput;
    }

    private onOkClicked(): void {
        this.unit = this.getContent(this.convertUnit.content) as CalibrationUnit;
        this.displayUnit = this.getContent(this.dispUnit.content) as CalibrationUnit;
        this.ratio = this.destTextBox.value / this.sourceTextBox.value;
        this.volumeDepth = this.depthTextBox.value;
        this.scaleRatioString = this.sourceTextBox.value + ' ' + this.unit + ' = ' + this.destTextBox.value + ' ' + this.dispUnit;
        this.scaleRatioDialog.hide();
    }

    private getContent(unit: string): string {
        return unit.split('</div>')[0].split('">')[1];
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public setConversion(value: number, currentAnnot: any): string {
        // tslint:disable-next-line
        let values: any;
        if (currentAnnot) {
            let pageIndex: number = currentAnnot.pageIndex;
            if (currentAnnot.id === 'diagram_helper') {
                pageIndex = currentAnnot.pageIndex ? currentAnnot.pageIndex : this.pdfViewerBase.activeElements.activePageID;
                currentAnnot = this.getCurrentObject(pageIndex, null, currentAnnot.annotName);
            }
            values = this.getCurrentValues(currentAnnot.id, pageIndex);
        } else {
            values = this.getCurrentValues();
        }
        let scaledValue: number = value * values.ratio;
        return this.convertPointToUnits(values.factor, scaledValue, values.unit);
    }

    private onCancelClicked(): void {
        this.scaleRatioDialog.hide();
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any): IMeasureShapeAnnotation {
        let currentAnnotObject: IMeasureShapeAnnotation = null;
        let pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, true);
                        if (pageAnnotations[i].shapeAnnotationType === 'Line' || pageAnnotations[i].shapeAnnotationType === 'Polyline') {
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
                    } else if (property === 'leaderLength') {
                        pageAnnotations[i].leaderLength = annotationBase.leaderHeight;
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
    public addInCollection(pageNumber: number, annotationBase: IMeasureShapeAnnotation): void {
        let pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    }

    private manageAnnotations(pageAnnotations: IMeasureShapeAnnotation[], pageNumber: number): void {
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
            let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_shape_measure', annotationStringified);
        }
    }

    // tslint:disable-next-line
    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
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

    private getCurrentObject(pageNumber: number, id: string, annotName?: string): IMeasureShapeAnnotation {
        let currentAnnotObject: IMeasureShapeAnnotation = null;
        let pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (id) {
                    if (id === pageAnnotations[i].id) {
                        currentAnnotObject = pageAnnotations[i];
                        break;
                    }
                } else if (annotName) {
                    if (annotName === pageAnnotations[i].annotName) {
                        currentAnnotObject = pageAnnotations[i];
                        break;
                    }
                }
            }
        }
        return currentAnnotObject;
    }

    // tslint:disable-next-line
    private getCurrentValues(id?: string, pageNumber?: number): any {
        let ratio: number;
        let unit: CalibrationUnit;
        let factor: number;
        let depth: number;
        if (id && !isNaN(pageNumber)) {
            let currentAnnotObject: IMeasureShapeAnnotation = this.getCurrentObject(pageNumber, id);
            if (currentAnnotObject) {
                ratio = this.getCurrentRatio(currentAnnotObject.calibrate.ratio);
                unit = currentAnnotObject.calibrate.x[0].unit;
                factor = currentAnnotObject.calibrate.x[0].conversionFactor;
                depth = currentAnnotObject.calibrate.depth;
            } else {
                ratio = this.ratio;
                unit = this.displayUnit;
                factor = this.getFactor();
                depth = this.volumeDepth;
            }
        } else {
            ratio = this.ratio;
            unit = this.displayUnit;
            factor = this.getFactor();
            depth = this.volumeDepth;
        }
        return { ratio: ratio, unit: unit, factor: factor, depth: depth };
    }

    private getCurrentRatio(ratioString: string): number {
        let stringArray: string[] = ratioString.split(' ');
        return parseFloat(stringArray[3]) / parseFloat(stringArray[0]);
    }

    /**
     * @private
     */
    public calculateArea(points: PointModel[], id?: string, pageNumber?: number): string {
        // tslint:disable-next-line
        let values: any = this.getCurrentValues(id, pageNumber);
        let area: number = this.getArea(points, values.factor) * values.ratio;
        return (Math.round(area * 100) / 100) + ' sq ' + values.unit;
    }

    private getArea(points: PointModel[], factor: number): number {
        let area: number = 0;
        let j: number = points.length - 1;
        for (let i: number = 0; i < points.length; i++) {
            // tslint:disable-next-line:max-line-length
            area += (points[j].x * this.pixelToPointFactor * factor + points[i].x * this.pixelToPointFactor * factor) * (points[j].y * this.pixelToPointFactor * factor - points[i].y * this.pixelToPointFactor * factor);
            j = i;
        }
        return (Math.abs((area) / 2.0));
    }

    /**
     * @private
     */
    public calculateVolume(points: PointModel[], id?: string, pageNumber?: number): string {
        // tslint:disable-next-line
        let values: any = this.getCurrentValues(id, pageNumber);
        let depth: number = values.depth ? values.depth : this.volumeDepth;
        let area: number = this.getArea(points, values.factor);
        let volume: number = area * ((depth * this.convertUnitToPoint(values.unit)) * values.factor) * values.ratio;
        return (Math.round(volume * 100) / 100) + ' cu ' + values.unit;
    }

    /**
     * @private
     */
    public calculatePerimeter(pdfAnnotationBase: PdfAnnotationBaseModel): string {
        let perimeter: number = Point.getLengthFromListOfPoints(pdfAnnotationBase.vertexPoints);
        return this.setConversion(perimeter * this.pixelToPointFactor, pdfAnnotationBase);
    }

    private getFactor(): number {
        let factor: number;
        switch (this.unit) {
            case 'in':
                factor = (1 / 72);
                break;
            case 'cm':
                factor = (1 / 28.346);
                break;
            case 'mm':
                factor = (1 / 2.835);
                break;
            case 'pt':
                factor = 1;
                break;
            case 'p':
                factor = 1 / 12;
                break;
        }
        return factor;
    }

    private convertPointToUnits(factor: number, value: number, unit: CalibrationUnit): string {
        let convertedValue: string = Math.round((value * factor) * 100) / 100 + ' ' + unit;
        return convertedValue;
    }

    private convertUnitToPoint(unit: string): number {
        let factor: number;
        switch (unit) {
            case 'in':
                factor = 72;
                break;
            case 'cm':
                factor = 28.346;
                break;
            case 'mm':
                factor = 2.835;
                break;
            case 'pt':
                factor = 1;
                break;
            case 'p':
                factor = 12;
                break;
        }
        return factor;
    }

    // tslint:disable-next-line
    private getStringifiedMeasure(measure: any): string {
        if (!isNullOrUndefined(measure)) {
            measure.angle = JSON.stringify(measure.angle);
            measure.area = JSON.stringify(measure.area);
            measure.distance = JSON.stringify(measure.distance);
            measure.volume = JSON.stringify(measure.volume);
        }
        return JSON.stringify(measure);
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