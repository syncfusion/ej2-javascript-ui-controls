import { PdfViewer, PdfViewerBase, IRectangle, IPageAnnotations, IPoint, AnnotationType as AnnotType,
    ShapeLabelSettingsModel,
    AnnotationType,
    IPointBase} from '../../index';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationType } from '../drawing/enum';
import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { PointModel, Point } from '@syncfusion/ej2-drawings';
import { ICommentsCollection, IReviewCollection } from './sticky-notes-annotation';
import { LineHeadStyle, CalibrationUnit, AllowedInteraction } from '../base';
import { AnnotationSelectorSettingsModel, MeasurementSettingsModel } from '../pdfviewer-model';
import { ItemModel } from '@syncfusion/ej2-navigations';

/**
 * @hidden
 */
export interface IMeasureShapeAnnotation {
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
    caption: boolean
    captionPosition: string
    leaderLineExtension: number
    leaderLength: number
    leaderLineOffset: number
    indent: string
    calibrate: any;
    id: string
    annotName: string
    comments: ICommentsCollection[]
    review: IReviewCollection
    enableShapeLabel: boolean
    labelContent: string
    labelFillColor: string
    labelBorderColor: string
    fontColor: string
    fontSize: number
    labelBounds: IRectangle
    annotationSelectorSettings: AnnotationSelectorSettingsModel
    labelSettings?: ShapeLabelSettingsModel
    annotationSettings?: any;
    customData: object
    allowedInteractions?: AllowedInteraction
    isPrint: boolean
    isCommentLock: boolean
    isAnnotationRotated: boolean
    pageNumber?: number
}

/**
 * @hidden
 */
export interface IMeasure {
    ratio: string
    x?: INumberFormat[]
    distance?: INumberFormat[]
    area?: INumberFormat[]
    angle?: INumberFormat[]
    volume?: INumberFormat[]
    targetUnitConversion?: number
    depth?: number
}

/**
 * @hidden
 */
export class MeasurementScaleRatio {
    id?: string
    annotName?: string
    displayUnit: CalibrationUnit
    unit: CalibrationUnit
    ratio: number
    destValue: number
    srcValue: number
    volumeDepth: number
    depthValue: number
    ratioString?: string
}

/**
 * @hidden
 */
export interface INumberFormat {
    unit: string
    conversionFactor: number
    fractionalType: string
    denominator: number
    formatDenominator: boolean
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
    public leaderLength: number;
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
    /**
     * @private
     */
    public measureShapeCount: number = 0;
    /**
     * @private
     */
    public volumeDepth: number;
    private measureRatioObject: MeasurementScaleRatio;
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;
    private ratio: number;
    private srcValue: number;
    private destValue: number;
    private depthValue: number;
    private currentScaleRatio: any;
    private scaleRatioString: string;
    private scaleRatioDialog: Dialog;
    private sourceTextBox: NumericTextBox;
    private convertUnit: DropDownButton;
    private destTextBox: NumericTextBox;
    private dispUnit: DropDownButton;
    private depthTextBox: NumericTextBox;
    private depthUnit: DropDownButton;
    /**
     * @private
     */
    public scaleRatioCollection: any = [];
    private scaleRatioAddCollection: any = [];
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     * @returns {number} - number
     */
    public get pixelToPointFactor(): number {
        return  (72 / 96);
    }

    /**
     * @param {any} shapeAnnotations - It describes about the shape annotations
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isImportAction - It describes about whether the isImportAction is true or not
     * @param {boolean} isAnnotOrderAction - It describes about whether the isAnnotOrderAction is true or not
     * @private
     * @returns {void}
     */
    public renderMeasureShapeAnnotations(shapeAnnotations: any, pageNumber: number,
                                         isImportAction?: boolean,  isAnnotOrderAction?: boolean): void {
        if (shapeAnnotations) {
            if (shapeAnnotations.length >= 1) {
                const measureAnnots: any[] = this.pdfViewer.annotation.getStoredAnnotations(pageNumber, shapeAnnotations, '_annotations_shape_measure');
                if (!measureAnnots || isImportAction || isAnnotOrderAction) {
                    for (let i: number = 0; i < shapeAnnotations.length; i++) {
                        const annotation: any = shapeAnnotations[parseInt(i.toString(), 10)];
                        let annotationObject: IMeasureShapeAnnotation = null;
                        this.measureShapeCount = this.measureShapeCount + 1;
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.
                            findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        let isAnnotationRotated: boolean;
                        if (annotation.ShapeAnnotationType) {
                            if (isImportAction) {
                                if (this.pdfViewerBase.isJsonImported) {
                                    annotation.Bounds =  this.pdfViewerBase.
                                        importJsonForRotatedDocuments(annotation.Rotate, pageNumber, annotation.Bounds,
                                                                      annotation.AnnotationRotation);
                                    isAnnotationRotated = this.pdfViewerBase.isPageRotated;
                                }
                            }
                            let vertexPoints: IPoint[] = null;
                            if (annotation.VertexPoints) {
                                vertexPoints = [];
                                if (isImportAction && this.pdfViewerBase.isJsonImported) {
                                    vertexPoints = this.pdfViewerBase.
                                        calculateVertexPoints(annotation.Rotate, pageNumber, annotation.VertexPoints,
                                                              annotation.AnnotationRotation);
                                } else {
                                    for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                                        const x: number = annotation.VertexPoints[parseInt(j.toString(), 10)].X ?
                                            annotation.VertexPoints[parseInt(j.toString(), 10)].X :
                                            annotation.VertexPoints[parseInt(j.toString(), 10)].x;
                                        const y: number = annotation.VertexPoints[parseInt(j.toString(), 10)].Y ?
                                            annotation.VertexPoints[parseInt(j.toString(), 10)].Y :
                                            annotation.VertexPoints[parseInt(j.toString(), 10)].y;
                                        const point: IPoint = { x: x, y: y };
                                        vertexPoints.push(point);
                                    }
                                }
                            }
                            if (annotation.Bounds && annotation.EnableShapeLabel === true) {
                                annotation.LabelBounds = this.pdfViewer.annotationModule.
                                    inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
                                annotation.LabelBorderColor = annotation.LabelBorderColor ?
                                    annotation.LabelBorderColor : annotation.StrokeColor;
                                annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
                                annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
                                annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
                                annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings :
                                    this.pdfViewer.shapeLabelSettings;
                            }
                            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings :
                                this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                            if (annotation.IsLocked) {
                                annotation.AnnotationSettings.isLock = annotation.IsLocked;
                            }
                            annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions :
                                this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                            const isPrint: boolean = annotation.IsPrint;
                            const measureObject: IMeasure = {
                                ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X),
                                distance: this.getNumberFormatArray(annotation.Calibrate.Distance),
                                area: this.getNumberFormatArray(annotation.Calibrate.Area),
                                angle: this.getNumberFormatArray(annotation.Calibrate.Angle),
                                volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
                                targetUnitConversion: annotation.Calibrate.TargetUnitConversion
                            };
                            if (annotation.Calibrate.Depth) {
                                measureObject.depth = annotation.Calibrate.Depth;
                            }
                            const left: number = annotation.Bounds.X ? annotation.Bounds.X : annotation.Bounds.x;
                            const top: number = annotation.Bounds.Y ? annotation.Bounds.Y : annotation.Bounds.y;
                            const width: number = annotation.Bounds.Width ? annotation.Bounds.Width : annotation.Bounds.width;
                            const height: number = annotation.Bounds.Height ? annotation.Bounds.Height : annotation.Bounds.height;
                            annotationObject = {
                                id: 'measure' + this.measureShapeCount, shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                                note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor,
                                opacity: annotation.Opacity, thickness: annotation.Thickness,
                                rectangleDifference: annotation.RectangleDifference,
                                borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray,
                                rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
                                cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints,
                                lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd,
                                isLocked: annotation.IsLocked, pageNumber: pageNumber,
                                bounds: { left: left, top: top, width: width, height: height, right: annotation.Bounds.Right,
                                    bottom: annotation.Bounds.Bottom },
                                caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject,
                                leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
                                leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent,
                                annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.
                                    getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                                review: {state: annotation.State, stateModel: annotation.StateModel,
                                    modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel,
                                labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor,
                                fontSize: annotation.FontSize,
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation),
                                labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
                                customData: this.pdfViewer.annotation.getCustomData(annotation),
                                isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock,
                                isAnnotationRotated: isAnnotationRotated
                            };
                            let vPoints: PointModel[] = annotationObject.vertexPoints;
                            if (vertexPoints == null) {
                                vPoints = [];
                            }
                            const annotationSelectorSettings: any = typeof (annotation.AnnotationSelectorSettings) === 'string' ? JSON.parse(annotation.AnnotationSelectorSettings) : annotation.AnnotationSelectorSettings;
                            if (isNullOrUndefined(annotation.AnnotationSelectorSettings)) {
                                this.pdfViewerBase.annotationSelectorSettingLoad(annotation);
                            }
                            else {
                                annotation.AnnotationSelectorSettings = annotationSelectorSettings;
                            }
                            annotation.allowedInteractions = annotation.AllowedInteractions ?
                                annotation.AllowedInteractions : this.pdfViewer.annotationModule.
                                    updateAnnotationAllowedInteractions(annotation);
                            const annot: PdfAnnotationBaseModel = {
                                id: 'measure' + this.measureShapeCount, shapeAnnotationType: this.getShapeType(annotationObject), author: annotationObject.author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotationObject.modifiedDate,
                                subject: annotationObject.subject, notes: annotationObject.note, fillColor: annotationObject.fillColor,
                                strokeColor: annotationObject.strokeColor, opacity: annotationObject.opacity,
                                thickness: annotationObject.thickness, borderStyle: annotationObject.borderStyle, borderDashArray: annotationObject.borderDashArray.toString(), rotateAngle: parseFloat(annotationObject.rotateAngle.split('Angle')[1]),
                                isCloudShape: annotationObject.isCloudShape, cloudIntensity: annotationObject.cloudIntensity,
                                taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadEnd),
                                sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadStart),
                                vertexPoints: vPoints, bounds: { x: annotationObject.bounds.left, y: annotationObject.bounds.top,
                                    width: annotationObject.bounds.width, height: annotationObject.bounds.height },
                                leaderHeight: annotationObject.leaderLength, pageIndex: pageNumber,
                                annotName: annotationObject.annotName, comments: annotationObject.comments,
                                review: annotationObject.review,
                                measureType: this.getMeasureType(annotationObject),
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel,
                                labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor,
                                fontSize: annotation.FontSize,
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: annotation.AnnotationSelectorSettings,
                                annotationSettings: annotationObject.annotationSettings, annotationAddMode: annotation.annotationAddMode,
                                isPrint: isPrint, isCommentLock: annotationObject.isCommentLock, customData: annotationObject.customData
                            };
                            if (this.scaleRatioCollection) {
                                const matchedScaleRatio: any = this.scaleRatioCollection.find(
                                    (item: any) => item.annotName === annot.annotName
                                );
                                if (matchedScaleRatio && matchedScaleRatio.id === undefined) {
                                    matchedScaleRatio.id = annot.id;
                                }
                            }
                            this.pdfViewer.annotation.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
                            this.pdfViewer.add(annot as PdfAnnotationBase);
                            if (this.isAddAnnotationProgramatically) {
                                const settings: any = {
                                    opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness,
                                    modifiedDate: annot.modifiedDate,
                                    width: annot.bounds.width, height: annot.bounds.height
                                };
                                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, annotation.ShapeAnnotationType,
                                                                 annot.bounds, settings);
                            }
                        }
                    }
                }
            } else if (shapeAnnotations.shapeAnnotationType) {
                const annotationObject: IMeasureShapeAnnotation = this.createAnnotationObject(shapeAnnotations);
                this.updateScaleRatioCollection();
                const measureSettings: MeasurementSettingsModel = this.pdfViewer.measurementSettings;
                if (measureSettings.conversionUnit !== 'in' || measureSettings.displayUnit !== 'in' || measureSettings.scaleRatio !== 1) {
                    const ratioString: any = annotationObject.calibrate.ratio.split('=').map((ratioString: any) => ratioString.trim());
                    const [srcValueStr, unit] = ratioString[0].split(' ');
                    const [destValueStr, displayUnit] = ratioString[1].split(' ');
                    const destValue: number = parseFloat(destValueStr);
                    const depthValue: number = measureSettings.depth ? measureSettings.depth : 96;
                    const srcValue: number = parseFloat(srcValueStr);
                    const scaleRatio: MeasurementScaleRatio = {
                        annotName: annotationObject.annotName,
                        displayUnit: displayUnit,
                        unit: unit,
                        ratio: destValue / srcValue,
                        destValue: destValue,
                        srcValue: srcValue,
                        volumeDepth: depthValue,
                        depthValue: depthValue,
                        ratioString: ratioString
                    };
                    this.scaleRatioCollection.push(scaleRatio);
                } else if (!isNullOrUndefined(this.measureRatioObject)) {
                    this.measureRatioObject['id'] = annotationObject.id;
                    this.measureRatioObject['annotName'] = annotationObject.annotName;
                    this.scaleRatioCollection.push({ ...this.measureRatioObject });
                } else {
                    const srcValue: number = (this.sourceTextBox && this.sourceTextBox.value) ? this.sourceTextBox.value : 1;
                    const destValue: number = (this.destTextBox && this.destTextBox.value) ? this.destTextBox.value : 1;
                    this.measureRatioObject = {
                        id: annotationObject.id,
                        annotName: annotationObject.annotName,
                        displayUnit: this.displayUnit,
                        unit: this.unit,
                        depthValue: this.volumeDepth,
                        volumeDepth: this.volumeDepth,
                        ratioString: srcValue + ' ' + this.unit + ' = ' + destValue + ' ' + this.displayUnit,
                        ratio: destValue / srcValue
                    } as MeasurementScaleRatio;
                    this.scaleRatioCollection.push({ ...this.measureRatioObject });
                    this.scaleRatioAddCollection.push({ ...this.measureRatioObject });
                }
                this.pdfViewer.annotationModule.isFormFieldShape = false;
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
                if (shapeAnnotations)
                {
                    shapeAnnotations.customData = annotationObject.customData;
                }
                this.pdfViewer.annotationModule.triggerAnnotationAdd(shapeAnnotations);
            }
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @private
     * @returns {any} - any
     */
    public getSettings(annotation : any) : any {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {

            selector = typeof(annotation.AnnotationSelectorSettings) === 'string' ? JSON.parse(annotation.AnnotationSelectorSettings) : annotation.AnnotationSelectorSettings;
        } else {
            selector = this.getSelector(annotation.Subject);
        }
        return selector;
    }

    /**
     * @param {AnnotType} type - It describes about the annotation type
     * @private
     * @returns {void}
     */
    public setAnnotationType(type: AnnotType): void {
        let author: string = 'Guest';
        let subject: string = '';
        let customData: object;
        this.updateMeasureproperties();
        this.pdfViewerBase.disableTextSelectionMode();
        switch (type) {
        case 'Distance': {
            this.currentAnnotationMode = 'Distance';
            const modifiedDateDist: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.distanceSettings.author ? this.pdfViewer.distanceSettings.author : 'Guest';
            subject = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.distanceSettings.subject ? this.pdfViewer.distanceSettings.subject : 'Distance calculation';
            customData = !isNullOrUndefined(this.pdfViewer.annotationSettings.customData) ?
                this.pdfViewer.annotationSettings.customData : this.pdfViewer.distanceSettings.customData ?
                    this.pdfViewer.distanceSettings.customData : null;
            this.pdfViewer.drawingObject = {
                sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.distanceStartHead),
                taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.distanceEndHead), measureType: 'Distance',
                fillColor: this.distanceFillColor, notes: '', strokeColor: this.distanceStrokeColor, leaderHeight: this.leaderLength,
                opacity: this.distanceOpacity, thickness: this.distanceThickness, borderDashArray: this.distanceDashArray.toString(),
                shapeAnnotationType: 'Distance', author: author, subject: subject, isCommentLock: false, customData: customData
            };
            this.pdfViewer.tool = 'Distance';
            break;
        }
        case 'Perimeter': {
            this.currentAnnotationMode = 'Perimeter';
            const modifiedDatePeri: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.perimeterSettings.author ? this.pdfViewer.perimeterSettings.author : 'Guest';
            subject = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.perimeterSettings.subject ? this.pdfViewer.perimeterSettings.subject : 'Perimeter calculation';
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'LineWidthArrowHead', fillColor: this.perimeterFillColor, notes: '', strokeColor: this.perimeterStrokeColor, opacity: this.perimeterOpacity,
                thickness: this.perimeterThickness, sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.perimeterStartHead),
                taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.perimeterEndHead), measureType: 'Perimeter', borderDashArray: this.perimeterDashArray.toString(),
                author: author, subject: subject, isCommentLock: false, customData: customData
            };
            this.pdfViewer.tool = 'Perimeter';
            break;
        }
        case 'Area': {
            this.currentAnnotationMode = 'Area';
            const modifiedDateArea: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.areaSettings.author ? this.pdfViewer.areaSettings.author : 'Guest';
            subject = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.areaSettings.subject ? this.pdfViewer.areaSettings.subject : 'Area calculation';
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'Polygon', fillColor: this.areaFillColor, notes: '', strokeColor: this.areaStrokeColor,
                thickness: this.areaThickness, opacity: this.areaOpacity, measureType: 'Area',
                modifiedDate: modifiedDateArea, borderStyle: '', borderDashArray: '0',
                author: author, subject: subject, isCommentLock: false, customData: customData
            };
            this.pdfViewer.tool = 'Polygon';
            break;
        }
        case 'Radius': {
            this.currentAnnotationMode = 'Radius';
            const modifiedDateRad: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.radiusSettings.author ? this.pdfViewer.radiusSettings.author : 'Guest';
            subject = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.radiusSettings.subject ? this.pdfViewer.radiusSettings.subject : 'Radius calculation';
            customData = !isNullOrUndefined(this.pdfViewer.annotationSettings.customData) ?
                this.pdfViewer.annotationSettings.customData : this.pdfViewer.radiusSettings.customData ?
                    this.pdfViewer.radiusSettings.customData : null;
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'Radius', fillColor: this.radiusFillColor, notes: '', strokeColor: this.radiusStrokeColor, opacity: this.radiusOpacity,
                thickness: this.radiusThickness, measureType: 'Radius', modifiedDate: modifiedDateRad, borderStyle: '', borderDashArray: '0',
                author: author, subject: subject, isCommentLock: false, customData: customData
            };
            this.pdfViewer.tool = 'DrawTool';
            break;
        }
        case 'Volume': {
            this.currentAnnotationMode = 'Volume';
            const modifiedDateVol: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.volumeSettings.author ? this.pdfViewer.volumeSettings.author : 'Guest';
            subject = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject : this.pdfViewer.volumeSettings.subject ? this.pdfViewer.volumeSettings.subject : 'Volume calculation';
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'Polygon', notes: '', fillColor: this.volumeFillColor, strokeColor: this.volumeStrokeColor,
                opacity: this.volumeOpacity, thickness: this.volumeThickness, measureType: 'Volume',
                modifiedDate: modifiedDateVol, borderStyle: '', borderDashArray: '0',
                author: author, subject: subject, isCommentLock: false, customData: customData
            };
            this.pdfViewer.tool = 'Polygon';
            break;
        }
        }
    }

    private updateMeasureproperties(): void {
        this.distanceFillColor = this.pdfViewer.distanceSettings.fillColor ? this.pdfViewer.distanceSettings.fillColor : '#ff0000';
        this.distanceStrokeColor = this.pdfViewer.distanceSettings.strokeColor ? this.pdfViewer.distanceSettings.strokeColor : '#ff0000';
        this.distanceOpacity = this.pdfViewer.distanceSettings.opacity ? this.pdfViewer.distanceSettings.opacity : 1;
        this.distanceThickness = this.pdfViewer.distanceSettings.thickness ? this.pdfViewer.distanceSettings.thickness : 1;
        this.distanceDashArray = this.pdfViewer.distanceSettings.borderDashArray ? this.pdfViewer.distanceSettings.borderDashArray : 0;
        this.leaderLength = this.pdfViewer.distanceSettings.leaderLength != null ? this.pdfViewer.distanceSettings.leaderLength : 40;
        this.distanceStartHead = this.pdfViewer.distanceSettings.lineHeadStartStyle ? this.pdfViewer.distanceSettings.lineHeadStartStyle : 'Closed';
        this.distanceEndHead = this.pdfViewer.distanceSettings.lineHeadEndStyle ? this.pdfViewer.distanceSettings.lineHeadEndStyle : 'Closed';
        this.perimeterFillColor = this.pdfViewer.perimeterSettings.fillColor ? this.pdfViewer.perimeterSettings.fillColor : '#ffffff00';
        this.perimeterStrokeColor = this.pdfViewer.perimeterSettings.strokeColor ? this.pdfViewer.perimeterSettings.strokeColor : '#ff0000';
        this.perimeterOpacity = this.pdfViewer.perimeterSettings.opacity ? this.pdfViewer.perimeterSettings.opacity : 1;
        this.perimeterThickness = this.pdfViewer.perimeterSettings.thickness ? this.pdfViewer.perimeterSettings.thickness : 1;
        this.perimeterDashArray = this.pdfViewer.perimeterSettings.borderDashArray ? this.pdfViewer.perimeterSettings.borderDashArray : 0;
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
        const scaleRatioObject: any = this.scaleRatioAddCollection[this.scaleRatioAddCollection.length - 1];
        if (this.currentScaleRatio && this.currentScaleRatio.unit !== this.pdfViewer.measurementSettings.conversionUnit.toLowerCase()) {
            this.unit = this.currentScaleRatio.unit;
        } else if (this.pdfViewer.measurementSettings.conversionUnit.toLowerCase() !== 'in') {
            this.unit = this.pdfViewer.measurementSettings.conversionUnit.toLowerCase() as CalibrationUnit;
        } else if (scaleRatioObject){
            this.unit = scaleRatioObject.unit;
        } else {
            this.unit = this.pdfViewer.measurementSettings.conversionUnit.toLowerCase() as CalibrationUnit;
        }
        if (this.currentScaleRatio && this.currentScaleRatio.displayUnit !==
            this.pdfViewer.measurementSettings.conversionUnit.toLowerCase()) {
            this.displayUnit = this.currentScaleRatio.displayUnit;
        } else if (this.pdfViewer.measurementSettings.displayUnit.toLowerCase() !== 'in') {
            this.displayUnit = this.pdfViewer.measurementSettings.displayUnit.toLowerCase() as CalibrationUnit;
        } else if (scaleRatioObject){
            this.displayUnit = scaleRatioObject.displayUnit;
        } else {
            this.displayUnit = this.pdfViewer.measurementSettings.displayUnit.toLowerCase() as CalibrationUnit;
        }
        if (this.currentScaleRatio && this.currentScaleRatio.ratio !==  this.pdfViewer.measurementSettings.scaleRatio) {
            this.ratio = this.currentScaleRatio.ratio;
        } else if ( this.pdfViewer.measurementSettings.scaleRatio !== 1) {
            this.ratio = this.pdfViewer.measurementSettings.scaleRatio;
        } else if (scaleRatioObject) {
            this.ratio = scaleRatioObject.ratio;
        } else if (isNullOrUndefined(this.ratio) || this.ratio === this.pdfViewer.measurementSettings.scaleRatio) {
            this.ratio = this.pdfViewer.measurementSettings.scaleRatio;
        }
        if (this.currentScaleRatio && this.currentScaleRatio.volumeDepth !== this.pdfViewer.measurementSettings.depth) {
            this.volumeDepth = this.currentScaleRatio.volumeDepth;
        } else if (this.pdfViewer.measurementSettings.scaleRatio !== 1) {
            this.volumeDepth = this.pdfViewer.measurementSettings.depth;
        } else if (scaleRatioObject) {
            this.volumeDepth = scaleRatioObject.volumeDepth;
        } else {
            this.volumeDepth = this.pdfViewer.measurementSettings.depth ? this.pdfViewer.measurementSettings.depth : 96;
        }
        this.scaleRatioString = '1 ' + this.unit + ' = ' + this.ratio.toString() + ' ' + this.displayUnit;
        this.currentScaleRatio = null;
    }

    private createAnnotationObject(annotationModel: PdfAnnotationBaseModel): IMeasureShapeAnnotation {
        let bound: IRectangle;
        let labelBound: IRectangle;
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('shape_measure', (annotationModel.pageIndex + 1), annotationModel.measureType);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        annotationModel.annotName = annotationName;
        // eslint-disable-next-line
        annotationModel.author = annotationModel && annotationModel.author != 'Guest' ? annotationModel.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationModel.subject);
        this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(annotationName, annotationModel.notes);
        if (annotationModel.wrapper.bounds) {
            bound = {
                left: annotationModel.wrapper.bounds.x, top: annotationModel.wrapper.bounds.y,
                height: annotationModel.wrapper.bounds.height, width: annotationModel.wrapper.bounds.width,
                right: annotationModel.wrapper.bounds.right, bottom: annotationModel.wrapper.bounds.bottom
            };
            labelBound = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(annotationModel.wrapper.bounds);
        } else {
            bound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
            labelBound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
        }
        let borderDashArray: number = parseInt(annotationModel.borderDashArray, 10);
        borderDashArray = isNaN(borderDashArray) ? 0 : borderDashArray;
        const measure: IMeasure = { ratio: this.scaleRatioString, x: [this.createNumberFormat('x')], distance: [this.createNumberFormat('d')], area: [this.createNumberFormat('a')] };
        if (annotationModel.measureType === 'Volume') {
            measure.depth = this.volumeDepth;
        }
        const annotationSettings: any = this.pdfViewer.annotationModule.findAnnotationSettings(annotationModel, true);
        const allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotationModel);
        annotationModel.isPrint = annotationSettings.isPrint;
        const setting: any = this.pdfViewer.shapeLabelSettings;
        const labelSettings: any = { borderColor: annotationModel.strokeColor, fillColor: annotationModel.fillColor,
            fontColor: annotationModel.fontColor, fontSize: annotationModel.fontSize, labelContent: annotationModel.labelContent,
            labelHeight: setting.labelHeight, labelWidth: setting.labelMaxWidth, opacity: annotationModel.opacity
        };
        return {
            id: annotationModel.id, shapeAnnotationType: this.getShapeAnnotType(annotationModel.measureType),
            author: annotationModel.author, allowedInteractions: allowedInteractions,
            subject: annotationModel.subject, note: annotationModel.notes, strokeColor: annotationModel.strokeColor,
            fillColor: annotationModel.fillColor, opacity: annotationModel.opacity, thickness: annotationModel.thickness,
            borderStyle: annotationModel.borderStyle, borderDashArray: borderDashArray, bounds: bound,
            modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(),
            rotateAngle: 'RotateAngle' + annotationModel.rotateAngle, isCloudShape: annotationModel.isCloudShape, cloudIntensity: annotationModel.cloudIntensity,
            vertexPoints: annotationModel.vertexPoints, lineHeadStart: this.pdfViewer.annotation.
                getArrowTypeForCollection(annotationModel.sourceDecoraterShapes),
            lineHeadEnd: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.taregetDecoraterShapes),
            rectangleDifference: [], isLocked: annotationSettings.isLock,
            leaderLength: annotationModel.leaderHeight, leaderLineExtension: 2, leaderLineOffset: 0, calibrate: measure, caption: true, captionPosition: 'Top',
            indent: this.getIndent(annotationModel.measureType), annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(), author: annotationModel.author},
            labelContent: annotationModel.labelContent, enableShapeLabel: annotationModel.enableShapeLabel,
            labelFillColor: annotationModel.labelFillColor,
            labelBorderColor: annotationModel.labelBorderColor, fontColor: annotationModel.fontColor, fontSize: annotationModel.fontSize,
            labelBounds: labelBound,  annotationSelectorSettings: this.getSelector(annotationModel.subject),
            labelSettings: labelSettings, annotationSettings: annotationSettings,
            customData: this.pdfViewer.annotation.getMeasureData(annotationModel.subject), isPrint: annotationModel.isPrint,
            isCommentLock: annotationModel.isCommentLock, isAnnotationRotated: false,
            pageNumber: annotationModel.pageIndex
        };
    }

    private getSelector( type: string) : AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if ((type === 'Distance calculation') && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.distanceSettings.annotationSelectorSettings;
        } else if ((type === 'Perimeter calculation') && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.perimeterSettings.annotationSelectorSettings;
        } else if ((type === 'Area calculation') && this.pdfViewer.areaSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.areaSettings.annotationSelectorSettings;
        } else if ((type === 'Radius calculation') && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.radiusSettings.annotationSelectorSettings;
        } else if ((type === 'Volume calculation') && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.volumeSettings.annotationSelectorSettings;
        }
        return selector;
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

    private getShapeType(shape: IMeasureShapeAnnotation): PdfAnnotationType {
        let shapeType: PdfAnnotationType;
        if (shape.shapeAnnotationType === 'Line') {
            shapeType = 'Distance';
        } else if (shape.shapeAnnotationType === 'Polyline') {
            shapeType = 'LineWidthArrowHead';
        } else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonDimension') {
            shapeType = 'Polygon';
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


    private getNumberFormatArray(list: any[]): INumberFormat[] {
        const numberFormatArray: Array<any> = [];
        if (list) {
            for (let i: number = 0; i < list.length; i++) {
                numberFormatArray[parseInt(i.toString(), 10)] = { unit: list[parseInt(i.toString(), 10)].Unit,
                    fractionalType: list[parseInt(i.toString(), 10)].FractionalType,
                    conversionFactor: list[parseInt(i.toString(), 10)].ConversionFactor,
                    denominator: list[parseInt(i.toString(), 10)].Denominator,
                    formatDenominator: list[parseInt(i.toString(), 10)].FormatDenominator };
            }
        }
        return numberFormatArray;
    }

    private createNumberFormat(type: string): INumberFormat {
        let cFactor: number = 1;
        let unit: string = this.displayUnit;
        if (type === 'x') {
            cFactor = this.getFactor(this.unit);
        }
        if (type === 'a') {
            unit = 'sq ' + this.displayUnit;
        }
        const numberFormat: INumberFormat = { unit: unit, fractionalType: 'D', conversionFactor: cFactor, denominator: 100, formatDenominator: false };
        return numberFormat;
    }

    /**
     * @private
     * @returns {string} - string
     */
    public saveMeasureShapeAnnotations(): string {
        let storeObject: string = this.pdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'];
        }
        const annotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[parseInt(j.toString(), 10)] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(storeObject);
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IMeasureShapeAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[parseInt(z.toString(), 10)]);
                        if (this.pdfViewerBase.isJsonExported) {
                            if (pageAnnotationObject.annotations[parseInt(z.toString(), 10)].isAnnotationRotated) {
                                pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                                 this.pdfViewer.annotation.getBounds(pageAnnotationObject.
                                     annotations[parseInt(z.toString(), 10)].bounds, pageAnnotationObject.pageIndex);
                                pageAnnotationObject.annotations[parseInt(z.toString(), 10)].vertexPoints =
                                 this.pdfViewer.annotation.getVertexPoints(pageAnnotationObject.
                                     annotations[parseInt(z.toString(), 10)].vertexPoints, pageAnnotationObject.pageIndex);
                            } else {
                                const pageDetails: any = this.pdfViewerBase.pageSize[pageAnnotationObject.pageIndex];
                                if (pageDetails) {
                                    pageAnnotationObject.annotations[parseInt(z.toString(), 10)].annotationRotation = pageDetails.rotation;
                                }
                            }
                        }
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                         JSON.stringify(this.pdfViewer.annotation.
                             getBounds(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds,
                                       pageAnnotationObject.pageIndex));
                        const strokeColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor;
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor =
                         JSON.stringify(this.getRgbCode(strokeColorString));
                        const fillColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fillColor;
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fillColor =
                         JSON.stringify(this.getRgbCode(fillColorString));

                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].vertexPoints =
                         JSON.stringify(this.pdfViewer.annotation.
                             getVertexPoints(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].vertexPoints,
                                             pageAnnotationObject.pageIndex));
                        if (pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rectangleDifference !== null) {

                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rectangleDifference =
                             JSON.stringify(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].rectangleDifference);
                        }
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].calibrate =
                         this.getStringifiedMeasure(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].calibrate);
                        if (pageAnnotationObject.annotations[parseInt(z.toString(), 10)].enableShapeLabel === true) {
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelBounds =
                             JSON.stringify(this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(JSON.parse(
                                 pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds), pageAnnotationObject.pageIndex));
                            const labelFillColorString: string =
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelFillColor;
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelFillColor =
                             JSON.stringify(this.getRgbCode(labelFillColorString));
                            const labelBorderColorString: string =
                             pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelBorderColor;
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelBorderColor =
                             JSON.stringify(this.getRgbCode(labelBorderColorString));
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelSettings.fillColor = labelFillColorString;
                            const fontColorString: string =
                             pageAnnotationObject.annotations[parseInt(z.toString(), 10)].labelSettings.fontColor;
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].fontColor =
                             JSON.stringify(this.getRgbCode(fontColorString));
                        }
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
     * @returns {void}
     */
    public createScaleRatioWindow(): void {
        if (!isBlazor()) {
            const elementID: string = this.pdfViewer.element.id;
            const dialogDiv: HTMLElement = createElement('div', { id: elementID + '_scale_ratio_window', className: 'e-pv-scale-ratio-window' });
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            const contentElement: HTMLElement = this.createRatioUI();
            this.scaleRatioDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Scale Ratio'),
                target: this.pdfViewer.element, content: contentElement, close: () => {
                    this.sourceTextBox.destroy();
                    this.convertUnit.destroy();
                    this.destTextBox.destroy();
                    this.dispUnit.destroy();
                    this.scaleRatioDialog.destroy();
                    const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_scale_ratio_window');
                    dialogElement.parentElement.removeChild(dialogElement);
                }
            });
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.scaleRatioDialog.buttons = [
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
                ];
            } else {
                this.scaleRatioDialog.buttons = [
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                    { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
                ];
            }
            if (this.pdfViewer.enableRtl) {
                this.scaleRatioDialog.enableRtl = true;
            }
            this.scaleRatioDialog.appendTo(dialogDiv);
            this.updateScaleRatioCollection();
            if (this.scaleRatioCollection.length === 1) {
                const existing: any = this.scaleRatioCollection[0];
                if (
                    Object.keys(existing).length === 2 &&
                    Object.prototype.hasOwnProperty.call(existing, 'id') &&
                    Object.prototype.hasOwnProperty.call(existing, 'annotName')
                ) {
                    Object.assign(existing, {
                        ratio: this.destTextBox.value / this.sourceTextBox.value,
                        unit: this.getContent(this.convertUnit.content),
                        displayUnit: this.getContent(this.dispUnit.content),
                        destValue: this.destTextBox.value,
                        srcValue: this.sourceTextBox.value,
                        volumeDepth: this.depthTextBox.value,
                        depthValue: this.depthTextBox.value,
                        ratioString: this.sourceTextBox.value + ' ' + this.unit + ' = ' + this.destTextBox.value + ' ' + this.displayUnit
                    });
                }
            }
            if (this.pdfViewer.selectedItems.annotations[0] && this.scaleRatioAddCollection.length === 1 &&
                this.scaleRatioAddCollection[0].displayUnit === 'in' && this.scaleRatioAddCollection[0].unit === 'in'
                && this.scaleRatioAddCollection[0].destValue === 1 && this.scaleRatioAddCollection[0].srcValue === 1
                && this.scaleRatioAddCollection[0].depthValue === 96) {
                this.convertUnit.content = 'in';
                this.dispUnit.content = 'in';
                this.depthUnit.content = 'in';
                this.destTextBox.value = 1;
                this.depthTextBox.value = 96;
                this.sourceTextBox.value = 1;
            } else if (this.pdfViewer.selectedItems.annotations[0]) {
                let unit: any;
                let displayUnit: any;
                if (this.scaleRatioCollection.length > 0) {
                    for (let i: number = 0; i < this.scaleRatioCollection.length; i++) {
                        if (this.scaleRatioCollection[parseInt(i.toString(), 10)].annotName ===
                            this.pdfViewer.selectedItems.annotations[0].annotName) {
                            const measureRatioObject: any = this.scaleRatioCollection[parseInt(i.toString(), 10)];
                            unit = measureRatioObject.unit;
                            displayUnit = measureRatioObject.displayUnit;
                            this.convertUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(unit)).outerHTML;
                            this.dispUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(displayUnit)).outerHTML;
                            this.depthUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(displayUnit)).outerHTML;
                            this.destTextBox.value = measureRatioObject.destValue ? measureRatioObject.destValue : 1;
                            this.depthTextBox.value = measureRatioObject.depthValue;
                            this.sourceTextBox.value = measureRatioObject.srcValue ? measureRatioObject.srcValue : 1;
                            break;
                        }
                    }
                }
            } else {
                if (!isNullOrUndefined(this.measureRatioObject)) {
                    this.convertUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(this.measureRatioObject.unit ?
                        this.measureRatioObject.unit : this.unit)).outerHTML;
                    this.dispUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(this.measureRatioObject.displayUnit ?
                        this.measureRatioObject.displayUnit : this.displayUnit)).outerHTML;
                    this.depthUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(this.measureRatioObject.displayUnit ?
                        this.measureRatioObject.displayUnit : this.displayUnit)).outerHTML;
                    this.destTextBox.value = this.measureRatioObject.destValue ? this.measureRatioObject.destValue : 1;
                    this.depthTextBox.value = this.measureRatioObject.depthValue;
                    this.sourceTextBox.value = this.measureRatioObject.srcValue ? this.measureRatioObject.srcValue : 1;
                } else {
                    this.convertUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(this.unit)).outerHTML;
                    this.dispUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(this.displayUnit)).outerHTML;
                    this.depthUnit.content = this.createContent(this.pdfViewer.localeObj.getConstant(this.displayUnit)).outerHTML;
                }
            }
        } else {
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenScaleRatioDialog');
        }
    }

    private updateScaleRatioCollection(): void {
        if (this.scaleRatioCollection.length === 0) {
            for (let i: number = 0; i < this.pdfViewer.annotationCollection.length; i++) {
                const annotation: any = this.pdfViewer.annotationCollection[parseInt(i.toString(), 10)];
                if (annotation.subject === 'Distance calculation' || annotation.subject  === 'Perimeter calculation' || annotation.subject === 'Area calculation' || annotation.subject === 'Radius calculation' || annotation.subject === 'Volume calculation') {
                    const ratioString: any = annotation.calibrate.ratio.split('=').map((ratioString: any) => ratioString.trim());
                    const [srcValueStr, unit] = ratioString[0].split(' ');
                    const [destValueStr, displayUnit] = ratioString[1].split(' ');
                    const destValue: number = parseFloat(destValueStr);
                    let depthValue: number;
                    const srcValue: number = parseFloat(srcValueStr);
                    if (this.pdfViewer.annotationCollection[parseInt(i.toString(), 10)].subject === 'Volume calculation') {
                        depthValue =
                            this.pdfViewer.annotationCollection[parseInt(i.toString(), 10)].calibrate.depth;
                    } else {
                        depthValue = 96;
                    }
                    this.sourceTextBox.value = parseFloat(srcValueStr);
                    const scaleRatio: MeasurementScaleRatio = {
                        id: annotation.uniqueKey,
                        annotName: annotation.annotationId,
                        displayUnit: displayUnit,
                        unit: unit,
                        ratio: destValue / srcValue,
                        destValue: destValue,
                        srcValue: srcValue,
                        volumeDepth: depthValue,
                        depthValue: depthValue,
                        ratioString: ratioString
                    };
                    this.scaleRatioCollection.push(scaleRatio);
                }
            }
        }
    }


    private createRatioUI(): HTMLElement {
        const element: HTMLElement = createElement('div');
        const elementID: string = this.pdfViewer.element.id;
        const items: { [key: string]: Object }[] = [{ text: this.pdfViewer.localeObj.getConstant('pt'), label: 'pt' }, { text: this.pdfViewer.localeObj.getConstant('in'), label: 'in' }, { text: this.pdfViewer.localeObj.getConstant('mm'), label: 'mm' }, { text: this.pdfViewer.localeObj.getConstant('cm'), label: 'cm' }, { text: this.pdfViewer.localeObj.getConstant('p'), label: 'p' }, { text: this.pdfViewer.localeObj.getConstant('ft'), label: 'ft' }, { text: this.pdfViewer.localeObj.getConstant('ft_in'), label: 'ft_in' }, { text: this.pdfViewer.localeObj.getConstant('m'), label: 'm' }];
        const labelText: HTMLElement = createElement('div', { id: elementID + '_scale_ratio_label', className: 'e-pv-scale-ratio-text' });
        labelText.textContent = this.pdfViewer.localeObj.getConstant('Scale Ratio');
        element.appendChild(labelText);
        const sourceContainer: HTMLElement = createElement('div', { id: elementID + '_scale_src_container' });
        element.appendChild(sourceContainer);
        const srcInputElement: HTMLElement = this.createInputElement('input', 'e-pv-scale-ratio-src-input', elementID + '_src_input', sourceContainer);
        this.sourceTextBox = new NumericTextBox({ value: 1, format: '##', cssClass: 'e-pv-scale-ratio-src-input', min: 1, max: 100000 }, (srcInputElement as HTMLInputElement));
        const srcUnitElement: HTMLElement = this.createInputElement('button', 'e-pv-scale-ratio-src-unit', elementID + '_src_unit', sourceContainer);
        this.convertUnit = new DropDownButton({ items: items, cssClass: 'e-pv-scale-ratio-src-unit' }, (srcUnitElement as HTMLButtonElement));
        this.convertUnit.select = this.convertUnitSelect.bind(this);
        const destinationContainer: HTMLElement = createElement('div', { id: elementID + '_scale_dest_container' });
        const destInputElement: HTMLElement = this.createInputElement('input', 'e-pv-scale-ratio-dest-input', elementID + '_dest_input', destinationContainer);
        this.destTextBox = new NumericTextBox({ value: 1, format: '##', cssClass: 'e-pv-scale-ratio-dest-input', min: 1, max: 100000 }, (destInputElement as HTMLInputElement));
        const destUnitElement: HTMLElement = this.createInputElement('button', 'e-pv-scale-ratio-dest-unit', elementID + '_dest_unit', destinationContainer);
        this.dispUnit = new DropDownButton({ items: items, cssClass: 'e-pv-scale-ratio-dest-unit' }, (destUnitElement as HTMLButtonElement));
        this.dispUnit.select = this.dispUnitSelect.bind(this);
        element.appendChild(destinationContainer);
        const depthLabelText: HTMLElement = createElement('div', { id: elementID + '_depth_label', className: 'e-pv-depth-text' });
        depthLabelText.textContent = this.pdfViewer.localeObj.getConstant('Depth');
        element.appendChild(depthLabelText);
        const depthContainer: HTMLElement = createElement('div', { id: elementID + '_depth_container' });
        element.appendChild(depthContainer);
        const depthInputElement: HTMLElement = this.createInputElement('input', 'e-pv-depth-input', elementID + '_depth_input', depthContainer);
        this.depthTextBox = new NumericTextBox({ value: this.volumeDepth, format: '##', cssClass: 'e-pv-depth-input', min: 1 }, (depthInputElement as HTMLInputElement));
        const depthUnitElement: HTMLElement = this.createInputElement('button', 'e-pv-depth-unit', elementID + '_depth_unit', depthContainer);
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
        const divElement: HTMLElement = createElement('div', { className: 'e-pv-scale-unit-content' });
        divElement.textContent = text;
        return divElement;
    }

    private createInputElement(input: string, className: string, idString: string, parentElement: HTMLElement): HTMLElement {
        const container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        const textBoxInput: HTMLElement = createElement(input, { id: idString });
        if (input === 'input') {
            (textBoxInput as HTMLInputElement).type = 'text';
        }
        container.appendChild(textBoxInput);
        parentElement.appendChild(container);
        return textBoxInput;
    }

    /**
     * @private
     * @returns {void}
     */
    public onOkClicked(): void {
        const unit: CalibrationUnit =  this.getContent(this.convertUnit.content) as CalibrationUnit;
        const displayUnit: CalibrationUnit = this.getContent(this.dispUnit.content) as CalibrationUnit;
        if (isBlazor()) {
            const unitElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_src_unit');
            const displayElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_dest_unit');
            const sourceTextBox: any = document.querySelector('#' + this.pdfViewer.element.id + '_ratio_input');
            const destTextBox: any = document.querySelector('#' + this.pdfViewer.element.id + '_dest_input');
            const depthTextBox: any = document.querySelector('#' + this.pdfViewer.element.id + '_depth_input');
            if (unitElement && displayElement && sourceTextBox && destTextBox && depthTextBox) {
                this.unit = unitElement.value;
                this.displayUnit = displayElement.value;
                this.ratio = parseInt(destTextBox.value, 10) / parseInt(sourceTextBox.value, 10);
                this.volumeDepth = parseInt(depthTextBox.value, 10);
            }
            this.scaleRatioString = parseInt(sourceTextBox.value, 10) + ' ' + this.unit + ' = ' + parseInt(destTextBox.value, 10) + ' ' + this.displayUnit;
            this.updateMeasureValues(this.scaleRatioString, this.displayUnit, this.unit, this.volumeDepth);
        } else if (this.pdfViewer.selectedItems.annotations[0]) {
            for (let i: number = 0; i < this.scaleRatioCollection.length; i++) {
                if (this.scaleRatioCollection[parseInt(i.toString(), 10)].annotName ===
                this.pdfViewer.selectedItems.annotations[0].annotName
                    && this.scaleRatioCollection[parseInt(i.toString(), 10)].displayUnit === this.getContent(this.dispUnit.content) &&
                    this.scaleRatioCollection[parseInt(i.toString(), 10)].unit === this.getContent(this.convertUnit.content) &&
                    this.scaleRatioCollection[parseInt(i.toString(), 10)].destValue === this.destTextBox.value &&
                    this.scaleRatioCollection[parseInt(i.toString(), 10)].srcValue === this.sourceTextBox.value &&
                    this.scaleRatioCollection[parseInt(i.toString(), 10)].volumeDepth === this.depthTextBox.value) {
                    const measureRatioObject: any = this.scaleRatioCollection[parseInt(i.toString(), 10)];
                    this.updateRatioValues(measureRatioObject.unit, measureRatioObject.displayUnit, measureRatioObject.ratio,
                                           measureRatioObject.volumeDepth, measureRatioObject.srcValue, measureRatioObject.destValue);
                } else if (this.scaleRatioCollection[parseInt(i.toString(), 10)].annotName ===
                this.pdfViewer.selectedItems.annotations[0].annotName) {
                    const measureRatioObject: any = this.scaleRatioCollection[parseInt(i.toString(), 10)];
                    measureRatioObject.ratio = this.destTextBox.value / this.sourceTextBox.value;
                    measureRatioObject.unit = this.getContent(this.convertUnit.content);
                    measureRatioObject.displayUnit = this.getContent(this.dispUnit.content);
                    measureRatioObject.destValue = this.destTextBox.value;
                    measureRatioObject.srcValue = this.sourceTextBox.value;
                    measureRatioObject.volumeDepth = this.depthTextBox.value;
                    measureRatioObject.depthValue = this.depthTextBox.value;
                    measureRatioObject.ratioString = this.sourceTextBox.value + ' ' + measureRatioObject.unit + ' = ' + this.destTextBox.value + ' ' + measureRatioObject.displayUnit;
                    const volumeDepth: number = this.depthTextBox.value;
                    const scaleRatioString: string = this.sourceTextBox.value + ' ' + unit + ' = ' + this.destTextBox.value + ' ' + displayUnit;
                    this.scaleRatioDialog.hide();
                    const originalUnit: CalibrationUnit = this.restoreUnit(this.convertUnit, unit);
                    const originalDisplayUnit: CalibrationUnit = this.restoreUnit(this.dispUnit, displayUnit);
                    this.updateMeasureValues(scaleRatioString, originalDisplayUnit, originalUnit, volumeDepth);
                }
            }
        } else {
            this.measureRatioObject = {
                ratio: this.destTextBox.value / this.sourceTextBox.value,
                unit: unit,
                displayUnit: displayUnit,
                destValue: this.destTextBox.value,
                srcValue: this.sourceTextBox.value,
                volumeDepth: this.depthTextBox.value,
                depthValue: this.depthTextBox.value,
                ratioString: this.sourceTextBox.value + ' ' + unit + ' = ' + this.destTextBox.value + ' ' + displayUnit
            };
            this.scaleRatioAddCollection.push(this.measureRatioObject);
            this.currentScaleRatio = this.measureRatioObject;
            this.updateRatioValues(this.measureRatioObject.unit, this.measureRatioObject.displayUnit, this.measureRatioObject.ratio,
                                   this.measureRatioObject.volumeDepth, this.measureRatioObject.srcValue,
                                   this.measureRatioObject.destValue);
        }
    }

    private updateRatioValues(unit: CalibrationUnit, displayUnit: CalibrationUnit, ratio: number, volumeDepth: number,
                              srcValue: number, destValue: number): void {
        this.unit = unit;
        this.displayUnit = displayUnit;
        this.ratio = destValue / srcValue;
        this.destValue = destValue;
        this.srcValue = srcValue;
        this.volumeDepth = volumeDepth;
        this.depthValue = volumeDepth;
        this.scaleRatioString = srcValue + ' ' + unit + ' = ' + destValue + ' ' + displayUnit;
        this.scaleRatioDialog.hide();
        const originalUnit: CalibrationUnit = this.restoreUnit(this.convertUnit, this.unit);
        const originalDisplayUnit: CalibrationUnit = this.restoreUnit(this.dispUnit, this.displayUnit);
        this.updateMeasureValues(this.scaleRatioString, originalDisplayUnit, originalUnit, this.volumeDepth);
    }

    private restoreUnit(dropdownObject: DropDownButton, currentUnit: CalibrationUnit): CalibrationUnit {
        let calibUnit: CalibrationUnit;
        for (let i: number = 0; i < dropdownObject.items.length; i++) {
            const convertUnitItem: ItemModel = dropdownObject.items[parseInt(i.toString(), 10)];
            if (currentUnit === convertUnitItem.text) {
                calibUnit = (convertUnitItem as any).label;
            }
        }
        return calibUnit;
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.currentAnnotationMode = null;
        this.distanceOpacity = null;
        this.perimeterOpacity = null;
        this.areaOpacity = null;
        this.radiusOpacity = null;
        this.volumeOpacity = null;
        this.distanceFillColor = null;
        this.perimeterFillColor = null;
        this.areaFillColor = null;
        this.radiusFillColor = null;
        this.volumeFillColor = null;
        this.distanceStrokeColor = null;
        this.perimeterStrokeColor = null;
        this.areaStrokeColor = null;
        this.radiusStrokeColor = null;
        this.volumeStrokeColor = null;
        this.distanceThickness = null;
        this.leaderLength = null;
        this.perimeterThickness = null;
        this.areaThickness = null;
        this.radiusThickness = null;
        this.volumeThickness = null;
        this.distanceDashArray = null;
        this.distanceStartHead = null;
        this.distanceEndHead = null;
        this.perimeterDashArray = null;
        this.perimeterStartHead = null;
        this.perimeterEndHead = null;
        this.unit = null;
        this.displayUnit = null;
        this.measureShapeCount = null;
        this.volumeDepth = null;
        this.isAddAnnotationProgramatically = null;
        this.ratio = null;
        this.srcValue = null;
        this.destValue = null;
        this.scaleRatioString = null;
        this.scaleRatioDialog = null;
        this.sourceTextBox = null;
        this.convertUnit = null;
        this.destTextBox = null;
        this.dispUnit = null;
        this.depthTextBox = null;
        this.depthUnit = null;
        this.scaleRatioCollection = null;
        this.scaleRatioAddCollection = null;
    }

    /**
     * @param {string} ratio - It describes about the ratio
     * @param {CalibrationUnit} displayUnit - It describes about the display unit
     * @param {CalibrationUnit} conversionUnit - It describes about the conversion unit
     * @param {number} depth - It describes about the depth
     * @private
     * @returns {void}
     */
    public updateMeasureValues(ratio: string, displayUnit: CalibrationUnit, conversionUnit: CalibrationUnit, depth: number): void {
        this.scaleRatioString = ratio;
        this.displayUnit = displayUnit;
        this.unit = conversionUnit;
        this.volumeDepth = depth;
        for (let i: number = 0; i < this.pdfViewerBase.pageCount; i++) {
            let pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(i, null);
            if (pageAnnotations) {
                for (let j: number = 0; j < pageAnnotations.length; j++) {
                    pageAnnotations = this.getAnnotations(i, null);
                    if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].id) {
                        const measureObject: IMeasureShapeAnnotation = pageAnnotations[parseInt(j.toString(), 10)];
                        const matchedRatio: any = this.scaleRatioCollection.find((item: any) => item.annotName === measureObject.annotName);
                        if (pageAnnotations[parseInt(j.toString(), 10)].annotName ===
                            this.pdfViewer.selectedItems.annotations[0].annotName) {
                            if (!measureObject.annotationSettings.isLock && matchedRatio) {
                                measureObject.calibrate.ratio = matchedRatio.ratioString;
                                measureObject.calibrate.x[0].unit = matchedRatio.displayUnit;
                                measureObject.calibrate.distance[0].unit = matchedRatio.displayUnit;
                                measureObject.calibrate.area[0].unit = matchedRatio.displayUnit;
                                measureObject.calibrate.x[0].conversionFactor = this.getFactor(conversionUnit);
                                if (measureObject.indent === 'PolygonVolume') {
                                    measureObject.calibrate.depth = matchedRatio.volumeDepth;
                                }
                                pageAnnotations[parseInt(j.toString(), 10)] = measureObject;
                                this.manageAnnotations(pageAnnotations, i);

                                this.pdfViewer.annotation.updateCalibrateValues(this.getAnnotationBaseModel(measureObject.id));
                            }
                        }
                    }
                }
            }
            this.pdfViewer.annotation.renderAnnotations(i, null, null, null, null, false);
        }
    }

    private getAnnotationBaseModel(id: string): PdfAnnotationBaseModel {
        let annotationBase: PdfAnnotationBaseModel = null;
        for (let i: number = 0; i < this.pdfViewer.annotations.length; i++) {
            if (id === this.pdfViewer.annotations[parseInt(i.toString(), 10)].id) {
                annotationBase = this.pdfViewer.annotations[parseInt(i.toString(), 10)];
                break;
            }
        }
        return annotationBase;
    }

    private getContent(unit: string): string {
        return unit.split('</div>')[0].split('">')[1];
    }

    /**
     * @param value
     * @param currentAnnot
     * @private
     */

    public setConversion(value: number, currentAnnot: any): string {
        let values: any;
        if (currentAnnot) {
            let pageIndex: number = currentAnnot.pageIndex;
            if (currentAnnot.id === 'diagram_helper') {
                pageIndex = currentAnnot.pageIndex ? currentAnnot.pageIndex : this.pdfViewerBase.activeElements.activePageID;
                currentAnnot = this.getCurrentObject(pageIndex, null, currentAnnot.annotName);
            }
            if (currentAnnot) {
                values = this.getCurrentValues(currentAnnot.id, pageIndex);
            } else {
                values = this.getCurrentValues();
            }
        } else {
            values = this.getCurrentValues();
        }
        const scaledValue: number = value * values.ratio;
        return this.convertPointToUnits(values.factor, scaledValue, values.unit);
    }

    private onCancelClicked(): void {
        this.scaleRatioDialog.hide();
    }

    /**
     * @param {string} property - It describes about the property
     * @param {number} pageNumber - It describes about the page number
     * @param {any} annotationBase - It describes about the annotation base
     * @param {boolean} isNewlyAdded - It describes about whether the isNewlyAdded is true or not
     * @private
     * @returns {IMeasureShapeAnnotation} - IMeasureShapeAnnotation
     */
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any, isNewlyAdded?: boolean): IMeasureShapeAnnotation {
        if (!isNullOrUndefined(annotationBase.formFieldAnnotationType) && annotationBase.formFieldAnnotationType !== ''){
            this.pdfViewer.annotationModule.isFormFieldShape = true;
        }
        else{
            this.pdfViewer.annotationModule.isFormFieldShape = false;
        }
        let currentAnnotObject: IMeasureShapeAnnotation = null;
        let isEdited: boolean = false;
        const pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[parseInt(i.toString(), 10)].id) {
                    if (property === 'bounds') {
                        this.pdfViewerBase.isBounds =
                        this.pdfViewerBase.boundsCalculation(pageAnnotations[parseInt(i.toString(), 10)].bounds,
                                                             annotationBase.wrapper.bounds);
                        if (this.pdfViewerBase.isBounds) {
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, true);
                            if (pageAnnotations[parseInt(i.toString(), 10)].shapeAnnotationType === 'Line' || pageAnnotations[parseInt(i.toString(), 10)].shapeAnnotationType === 'Polyline') {
                                pageAnnotations[parseInt(i.toString(), 10)].vertexPoints = annotationBase.vertexPoints;
                                pageAnnotations[parseInt(i.toString(), 10)].bounds =
                                {
                                    left: annotationBase.bounds.x, top: annotationBase.bounds.y,
                                    width: annotationBase.bounds.width, height: annotationBase.bounds.height,
                                    right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom
                                };
                            } else if (pageAnnotations[parseInt(i.toString(), 10)].shapeAnnotationType === 'Polygon') {
                                pageAnnotations[parseInt(i.toString(), 10)].vertexPoints = annotationBase.vertexPoints;
                                pageAnnotations[parseInt(i.toString(), 10)].bounds =
                                {
                                    left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width,
                                    height: annotationBase.bounds.height, right: annotationBase.bounds.right,
                                    bottom: annotationBase.bounds.bottom
                                };
                            } else {
                                pageAnnotations[parseInt(i.toString(), 10)].bounds =
                                {
                                    left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width,
                                    height: annotationBase.bounds.height, right: annotationBase.bounds.right,
                                    bottom: annotationBase.bounds.bottom
                                };
                            }
                        }
                        if (pageAnnotations[parseInt(i.toString(), 10)].enableShapeLabel === true && annotationBase.wrapper) {
                            pageAnnotations[parseInt(i.toString(), 10)].labelBounds =
                             this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(annotationBase.wrapper.bounds);
                        }
                    } else if (property === 'fill') {
                        pageAnnotations[parseInt(i.toString(), 10)].fillColor = annotationBase.wrapper.children[0].style.fill;
                        if (this.pdfViewer.enableShapeLabel) {
                            pageAnnotations[parseInt(i.toString(), 10)].labelFillColor = annotationBase.wrapper.children[0].style.fill;
                        }
                    } else if (property === 'stroke') {
                        pageAnnotations[parseInt(i.toString(), 10)].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[parseInt(i.toString(), 10)].opacity = annotationBase.wrapper.children[0].style.opacity;
                    } else if (property === 'thickness') {
                        pageAnnotations[parseInt(i.toString(), 10)].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    } else if (property === 'dashArray') {
                        pageAnnotations[parseInt(i.toString(), 10)].borderDashArray =
                         annotationBase.wrapper.children[0].style.strokeDashArray;
                        pageAnnotations[parseInt(i.toString(), 10)].borderStyle = annotationBase.borderStyle;
                    } else if (property === 'startArrow') {
                        pageAnnotations[parseInt(i.toString(), 10)].lineHeadStart =
                         this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.sourceDecoraterShapes);
                    } else if (property === 'endArrow') {
                        pageAnnotations[parseInt(i.toString(), 10)].lineHeadEnd =
                         this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.taregetDecoraterShapes);
                    } else if (property === 'leaderLength') {
                        pageAnnotations[parseInt(i.toString(), 10)].leaderLength = annotationBase.leaderHeight;
                    } else if (property === 'notes') {
                        pageAnnotations[parseInt(i.toString(), 10)].note = annotationBase.notes;
                        if (pageAnnotations[parseInt(i.toString(), 10)].enableShapeLabel === true) {
                            isEdited = true;
                            pageAnnotations[parseInt(i.toString(), 10)].labelContent = annotationBase.notes;
                        }
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    } else if (property === 'labelContent') {
                        pageAnnotations[parseInt(i.toString(), 10)].note = annotationBase.labelContent;
                        pageAnnotations[parseInt(i.toString(), 10)].labelContent = annotationBase.labelContent;
                        break;
                    } else if (property === 'fontColor') {
                        pageAnnotations[parseInt(i.toString(), 10)].fontColor = annotationBase.fontColor;
                    } else if (property === 'fontSize') {
                        pageAnnotations[parseInt(i.toString(), 10)].fontSize = annotationBase.fontSize;
                    }
                    if (this.pdfViewerBase.isBounds) {
                        pageAnnotations[parseInt(i.toString(), 10)].modifiedDate =
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)], pageNumber);
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        if (!isNewlyAdded && isEdited) {
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        return currentAnnotObject;
    }

    /**
     * @param {number} pageNumber -It describes about the page number
     * @param {IMeasureShapeAnnotation} annotationBase - It describes about the annotation base
     * @private
     * @returns {void}
     */
    public addInCollection(pageNumber: number, annotationBase: IMeasureShapeAnnotation): void {
        const pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    }

    private manageAnnotations(pageAnnotations: IMeasureShapeAnnotation[], pageNumber: number): void {
        let storeObject: string = this.pdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'];
        }
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.sessionStorageManager.removeItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
            }
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            const annotationStringified: string = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'] = annotationStringified;
            } else {
                this.pdfViewerBase.sessionStorageManager.setItem(this.pdfViewerBase.documentId + '_annotations_shape_measure', annotationStringified);
            }
        }
    }

    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        let annotationCollection: any[];
        let storeObject: string = this.pdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'];
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

    private getCurrentObject(pageNumber: number, id: string, annotName?: string): IMeasureShapeAnnotation {
        let currentAnnotObject: IMeasureShapeAnnotation = null;
        const pageAnnotations: IMeasureShapeAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (id) {
                    if (id === pageAnnotations[parseInt(i.toString(), 10)].id) {
                        currentAnnotObject = pageAnnotations[parseInt(i.toString(), 10)];
                        break;
                    }
                } else if (annotName) {
                    if (annotName === pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                        currentAnnotObject = pageAnnotations[parseInt(i.toString(), 10)];
                        break;
                    }
                }
            }
        }
        return currentAnnotObject;
    }

    private getCurrentValues(id?: string, pageNumber?: number): any {
        let ratio: number;
        let unit: CalibrationUnit;
        let factor: number;
        let depth: number;
        if (id && !isNaN(pageNumber)) {
            const currentAnnotObject: IMeasureShapeAnnotation = this.getCurrentObject(pageNumber, id);
            if (currentAnnotObject) {
                ratio = this.getCurrentRatio(currentAnnotObject.calibrate.ratio);
                unit = currentAnnotObject.calibrate.x[0].unit;
                factor = currentAnnotObject.calibrate.x[0].conversionFactor;
                depth = currentAnnotObject.calibrate.depth;
            } else {
                ratio = this.ratio;
                unit = this.displayUnit;
                factor = this.getFactor(this.unit);
                depth = this.volumeDepth;
            }
        } else {
            ratio = this.ratio;
            unit = this.displayUnit;
            factor = this.getFactor(this.unit);
            depth = this.volumeDepth;
        }
        return { ratio: ratio, unit: unit, factor: factor, depth: depth };
    }

    private getCurrentRatio(ratioString: string): number {
        const stringArray: string[] = ratioString.split(' ');
        if (stringArray[3] === '=') {
            return parseFloat(stringArray[4]) / parseFloat(stringArray[0]);
        } else {
            return parseFloat(stringArray[3]) / parseFloat(stringArray[0]);
        }
    }

    /**
     * @param {PointModel} points - It describes about the points
     * @param {string} id - It describes about the id
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {string} - string
     */
    public calculateArea(points: PointModel[], id?: string, pageNumber?: number): string {
        const values: any = this.getCurrentValues(id, pageNumber);
        const area: number = this.getArea(points, values.factor, values.unit) * values.ratio;
        if (values.unit === 'ft_in') {
            let calculateValue: any = Math.round(area * 100) / 100;
            if (calculateValue >= 12) {
                calculateValue = (Math.round(calculateValue / 12 * 100) / 100).toString();
                calculateValue =  calculateValue.split('.');
                if (calculateValue[1]) {
                    let inchValue: any = 0;
                    if (calculateValue[1].charAt(1)) {
                        inchValue = parseInt(calculateValue[1].charAt(0), 10) + '.' + parseInt(calculateValue[1].charAt(1), 10);
                        inchValue = Math.round(inchValue);
                    } else {
                        inchValue = calculateValue[1];
                    }
                    if (!inchValue) {
                        return (calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant('ft'));
                    } else {
                        return (calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant('ft') + ' ' + inchValue + ' ' + this.pdfViewer.localeObj.getConstant('in'));
                    }
                } else {
                    return(calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant('ft'));
                }
            } else {
                return (Math.round(area * 100) / 100) + ' ' + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant('in');
            }
        }
        if (values.unit === 'm') {
            return ((area * 100) / 100) + ' ' + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant(values.unit);
        }
        return (Math.round(area * 100) / 100) + ' ' + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant(values.unit);
    }

    private getArea(points: PointModel[], factor: number, unit: string): number {
        let area: number = 0;
        let j: number = points.length - 1;
        for (let i: number = 0; i < points.length; i++) {
            area += (points[parseInt(j.toString(), 10)].x * this.pixelToPointFactor *
             factor + points[parseInt(i.toString(), 10)].x * this.pixelToPointFactor * factor) *
              (points[parseInt(j.toString(), 10)].y * this.pixelToPointFactor * factor - points[parseInt(i.toString(), 10)].y *
               this.pixelToPointFactor * factor);
            j = i;
        }
        if (unit === 'ft_in') {
            return (Math.abs((area) * 2.0));
        } else {
            return (Math.abs((area) / 2.0));
        }
    }

    /**
     * @param {PointModel} points - It describes about the points
     * @param {string} id - It describes about the id
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {string} - string
     */
    public calculateVolume(points: PointModel[], id?: string, pageNumber?: number): string {
        const values: any = this.getCurrentValues(id, pageNumber);
        const depth: number = values.depth ? values.depth : this.volumeDepth;
        const area: number = this.getArea(points, values.factor, values.unit);
        const volume: number = area * ((depth * this.convertUnitToPoint(values.unit)) * values.factor) * values.ratio;
        if (values.unit === 'ft_in') {
            let calculateValue: any = Math.round(volume * 100) / 100;
            if (calculateValue >= 12) {
                calculateValue = (Math.round(calculateValue / 12 * 100) / 100).toString();
                calculateValue = calculateValue.split('.');
                if (calculateValue[1]) {
                    let inchValue: any = 0;
                    if (calculateValue[1].charAt(1)) {
                        inchValue = parseInt(calculateValue[1].charAt(0), 10) + '.' + parseInt(calculateValue[1].charAt(1), 10);
                        inchValue = Math.round(inchValue);
                    } else {
                        inchValue = calculateValue[1];
                    }
                    if (!inchValue) {
                        return (calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('cu') + ' ' + this.pdfViewer.localeObj.getConstant('ft'));
                    } else {
                        return (calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('cu') + ' ' + this.pdfViewer.localeObj.getConstant('ft') + ' ' + inchValue + ' ' + this.pdfViewer.localeObj.getConstant('in'));
                    }
                } else {
                    return(calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('cu') + ' ' + this.pdfViewer.localeObj.getConstant('ft'));
                }
            } else {
                return (Math.round(volume * 100) / 100) + ' ' + this.pdfViewer.localeObj.getConstant('cu') + ' ' + this.pdfViewer.localeObj.getConstant('in');
            }
        }
        return (Math.round(volume * 100) / 100) + ' ' + this.pdfViewer.localeObj.getConstant('cu') + ' ' + this.pdfViewer.localeObj.getConstant(values.unit);
    }

    /**
     * @param {PdfAnnotationBaseModel} pdfAnnotationBase - It describes about the pdf annotation base
     * @private
     * @returns {string} - string
     */
    public calculatePerimeter(pdfAnnotationBase: PdfAnnotationBaseModel): string {
        const perimeter: number = Point.getLengthFromListOfPoints(pdfAnnotationBase.vertexPoints);
        return this.setConversion(perimeter * this.pixelToPointFactor, pdfAnnotationBase);
    }

    private getFactor(unit: CalibrationUnit): number {
        let factor: number;
        switch (unit) {
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
        case 'ft':
            factor = 1 / 864;
            break;
        case 'ft_in':
            factor = 1 / 72;
            break;
        case 'm':
            factor = (1 / 2834.64567);
            break;
        }
        return factor;
    }

    private convertPointToUnits(factor: number, value: number, unit: CalibrationUnit): string {
        let convertedValue: string;
        if (unit === 'ft_in') {
            let calculateValue: any = Math.round((value * factor) * 100) / 100;
            if (calculateValue >= 12) {
                calculateValue = (Math.round(calculateValue / 12 * 100) / 100).toString();
                calculateValue = calculateValue.split('.');
                if (calculateValue[1]) {
                    let inchValue: any = 0;
                    if (calculateValue[1].charAt(1)) {
                        inchValue = parseInt(calculateValue[1].charAt(0), 10) + '.' + parseInt(calculateValue[1].charAt(1), 10);
                        inchValue = Math.round(inchValue);
                    } else {
                        inchValue = calculateValue[1];
                    }
                    if (!inchValue) {
                        convertedValue = calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('ft');
                    } else {
                        convertedValue = calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('ft') + ' ' + inchValue + ' ' + this.pdfViewer.localeObj.getConstant('in');
                    }
                } else {
                    convertedValue = calculateValue[0] + ' ' + this.pdfViewer.localeObj.getConstant('ft');
                }
            } else {
                convertedValue = Math.round((value * factor) * 100) / 100 + ' ' + this.pdfViewer.localeObj.getConstant('in');
            }
        } else {
            convertedValue = Math.round((value * factor) * 100) / 100 + ' ' + this.pdfViewer.localeObj.getConstant(unit);
        }
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
        case 'ft':
            factor = 864;
            break;
        case 'ft_in':
            factor = 72;
            break;
        case 'm':
            factor = 2834.64567;
            break;
        }
        return factor;
    }

    private getStringifiedMeasure(measure: any): string {
        if (!isNullOrUndefined(measure)) {
            measure.angle = JSON.stringify(measure.angle);
            measure.area = JSON.stringify(measure.area);
            measure.distance = JSON.stringify(measure.distance);
            measure.volume = JSON.stringify(measure.volume);
        }
        return JSON.stringify(measure);
    }

    private getRgbCode(colorString: string): any {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        const r: number = parseInt(stringArray[0].split('(')[1], 10);
        const g: number = parseInt(stringArray[1], 10);
        const b: number = parseInt(stringArray[2], 10);
        const a: number = parseInt(stringArray[3], 10);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {any} - any
     */
    public saveImportedMeasureAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: IMeasureShapeAnnotation = null;
        let vertexPoints: IPoint[] = null;
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                const point: IPoint = { x: annotation.VertexPoints[parseInt(j.toString(), 10)].X,
                    y: annotation.VertexPoints[parseInt(j.toString(), 10)].Y };
                vertexPoints.push(point);
            }
        }
        const measureObject: IMeasure = {
            ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X),
            distance: this.getNumberFormatArray(annotation.Calibrate.Distance),
            area: this.getNumberFormatArray(annotation.Calibrate.Area),
            angle: this.getNumberFormatArray(annotation.Calibrate.Angle),
            volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
            targetUnitConversion: annotation.Calibrate.TargetUnitConversion
        };
        if (annotation.Calibrate.Depth) {
            measureObject.depth = annotation.Calibrate.Depth;
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            annotation.LabelBounds =
             this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
        }
        annotation.allowedInteractions = annotation.AllowedInteractions ?
            annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotation.AnnotationSettings = annotation.AnnotationSettings ?
            annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotation.Subject);
        annotationObject = {
            id: 'measure', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor,
            opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray,
            rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints,
            lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject,
            leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
            leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent, annotName: annotation.AnnotName,
            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
            review: {state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate,
                author: annotation.Author},
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation),
            labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint,
            isCommentLock: annotation.IsCommentLock, isAnnotationRotated: false
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number value
     * @private
     * @returns {any} - any
     */
    public updateMeasureAnnotationCollections(annotation: any, pageNumber: number): any {
        let annotationObject: any = null;
        let vertexPoints: IPoint[] = null;
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (let j: number = 0; j < annotation.VertexPoints.length; j++) {
                const point: IPoint = { x: annotation.VertexPoints[parseInt(j.toString(), 10)].X,
                    y: annotation.VertexPoints[parseInt(j.toString(), 10)].Y };
                vertexPoints.push(point);
            }
        }
        const measureObject: IMeasure = {
            ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X),
            distance: this.getNumberFormatArray(annotation.Calibrate.Distance),
            area: this.getNumberFormatArray(annotation.Calibrate.Area),
            angle: this.getNumberFormatArray(annotation.Calibrate.Angle), volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
            targetUnitConversion: annotation.Calibrate.TargetUnitConversion
        };
        if (annotation.Calibrate.Depth) {
            measureObject.depth = annotation.Calibrate.Depth;
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            annotation.LabelBounds =
             this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            const settings: any = this.pdfViewer.shapeLabelSettings;
            const labelSettings: any =
             { borderColor: annotation.StrokeColor, fillColor: annotation.FillColor, fontColor: annotation.FontColor,
                 fontSize: annotation.FontSize, labelContent: annotation.LabelContent, labelHeight: settings.labelHeight,
                 labelWidth: settings.labelWidth, opacity: annotation.Opacity
             };
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : labelSettings;
        }
        annotation.allowedInteractions = annotation.AllowedInteractions ?
            annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        annotation.AnnotationSelectorSettings =
        annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings :
            this.pdfViewerBase.annotationSelectorSettingLoad(annotation);
        annotation.AnnotationSettings = annotation.AnnotationSettings ?
            annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        if (annotation.IsLocked) {
            annotation.AnnotationSettings.isLock = annotation.IsLocked;
        }
        annotationObject = {
            id: 'measure', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor,
            opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray,
            rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart,
            lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject,
            leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
            leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent, annotationId: annotation.AnnotName,
            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
            review: {state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate,
                author: annotation.Author},
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            labelBounds: annotation.LabelBounds, pageNumber: pageNumber, annotationSelectorSettings: annotation.AnnotationSelectorSettings,
            labelSettings: annotation.labelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint,
            isCommentLock: annotation.IsCommentLock
        };
        return annotationObject;
    }

    /**
     * This method used to add annotations with using program.
     *
     * @param {AnnotationType} annotationType - It describes the annotation type
     * @param {any} annotationObject - It describes type of annotation object
     * @param {IPoint} offset - It describes about the annotation bounds or location
     * @returns {object} - object
     * @private
     */
    public updateAddAnnotationDetails(annotationType: AnnotationType, annotationObject: any, offset: IPoint): Object
    {
        //Creating new object if annotationObject is null
        if (!annotationObject)
        {
            annotationObject = { offset: { x: 10, y: 10}, pageNumber: 0, width: undefined, height: undefined};
            offset = annotationObject.offset;
        }
        else if (!annotationObject.offset)
        {offset = { x: 10, y: 10}; }
        else
        {offset = annotationObject.offset; }
        //Initialize the annotation settings
        let annotationSelectorSettings: any = null;
        let allowedInteractions: any = null;
        let annotationSettings: any = null;
        let measureAnnotationType: string = '';
        let shapeAnnotationType: string = '';
        let subject: string = '';
        let isArrow: boolean = false;
        let vertexPoints: any = [];
        //Creating the CurrentDate and Annotation name
        const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        if (annotationType === 'Distance')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.lineSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.lineSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationType);
            allowedInteractions = this.pdfViewer.lineSettings.allowedInteractions ?
                this.pdfViewer.lineSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            measureAnnotationType = 'LineDimension';
            shapeAnnotationType = 'Line';
            subject = this.pdfViewer.lineSettings.subject !== '' ? this.pdfViewer.lineSettings.subject : this.pdfViewer.annotationSettings.subject !== '' ? this.pdfViewer.annotationSettings.subject : 'Distance calculation' ;
            isArrow = true;
            if (annotationObject.vertexPoints)
            {vertexPoints = annotationObject.vertexPoints; }
            else
            {vertexPoints = [{x: offset.x, y: offset.y}, {x: offset.x + 100, y: offset.y}]; }
            annotationObject.width = annotationObject.width ? annotationObject.width : 1;
            annotationObject.height = annotationObject.height ? annotationObject.height : 1;
        }
        else if (annotationType === 'Perimeter')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.arrowSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.arrowSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationType);
            allowedInteractions = this.pdfViewer.arrowSettings.allowedInteractions ?
                this.pdfViewer.arrowSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            measureAnnotationType = 'PolyLineDimension';
            shapeAnnotationType = 'Polyline';
            subject = this.pdfViewer.arrowSettings.subject !== '' ? this.pdfViewer.arrowSettings.subject : this.pdfViewer.annotationSettings.subject !== '' ? this.pdfViewer.annotationSettings.subject : 'Perimeter calculation';
            isArrow = true;
            if (annotationObject.vertexPoints)
            {vertexPoints = annotationObject.vertexPoints; }
            else
            {vertexPoints = [{ x: offset.x, y: offset.y},
                { x: offset.x + 85, y: offset.y},
                { x: offset.x + 86, y: offset.y + 62}]; }
            annotationObject.width = annotationObject.width ? annotationObject.width : 1;
            annotationObject.height = annotationObject.height ? annotationObject.height : 1;
        }
        else if (annotationType === 'Area')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.rectangleSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.rectangleSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationType);
            allowedInteractions = this.pdfViewer.rectangleSettings.allowedInteractions ?
                this.pdfViewer.rectangleSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            measureAnnotationType = 'PolygonDimension';
            shapeAnnotationType = 'Polygon';
            subject = this.pdfViewer.rectangleSettings.subject !== '' ? this.pdfViewer.rectangleSettings.subject : this.pdfViewer.annotationSettings.subject !== '' ? this.pdfViewer.annotationSettings.subject : 'Area calculation';
            if (annotationObject.vertexPoints)
            {vertexPoints = annotationObject.vertexPoints; }
            else
            {vertexPoints = [{x: offset.x, y: offset.y},
                { x: offset.x + 88, y: offset.y - 1},
                { x: offset.x + 89, y: offset.y + 53},
                { x: offset.x, y: offset.y}]; }
            annotationObject.width = annotationObject.width ? annotationObject.width : 1;
            annotationObject.height = annotationObject.height ? annotationObject.height : 1;
        }
        else if (annotationType === 'Radius')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.circleSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.circleSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationType);
            allowedInteractions = this.pdfViewer.circleSettings.allowedInteractions ?
                this.pdfViewer.circleSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            measureAnnotationType = 'PolygonRadius';
            shapeAnnotationType = 'Circle';
            subject = this.pdfViewer.circleSettings.subject !== '' ? this.pdfViewer.circleSettings.subject : this.pdfViewer.annotationSettings.subject !== '' ? this.pdfViewer.annotationSettings.subject : 'Radius calculation';
            annotationObject.width = annotationObject.width ? annotationObject.width : 100;
            annotationObject.height = annotationObject.height ? annotationObject.height : 100;
            vertexPoints = null;
        }
        else if (annotationType === 'Volume')
        {
            //Creating annotation settings
            annotationSelectorSettings = this.pdfViewer.polygonSettings.annotationSelectorSettings;
            this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
            annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.polygonSettings);
            annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationType);
            allowedInteractions = this.pdfViewer.polygonSettings.allowedInteractions ?
                this.pdfViewer.polygonSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            measureAnnotationType = 'PolygonVolume';
            shapeAnnotationType = 'Polygon';
            subject =  this.pdfViewer.polygonSettings.subject !== '' ? this.pdfViewer.polygonSettings.subject : this.pdfViewer.annotationSettings.subject !== '' ? this.pdfViewer.annotationSettings.subject : 'Volume calculation';
            if (annotationObject.vertexPoints)
            {vertexPoints = annotationObject.vertexPoints; }
            else
            {vertexPoints = [
                { x: offset.x, y: offset.y},
                { x: offset.x, y: offset.y + 109},
                { x: offset.x + 120, y: offset.y + 109},
                { x: offset.x + 120, y: offset.y - 1},
                { x: offset.x, y: offset.y}]; }
            annotationObject.width = annotationObject.width ? annotationObject.width : 1;
            annotationObject.height = annotationObject.height ? annotationObject.height : 1;
        }
        annotationSettings.isLock = annotationObject.isLock ? annotationObject.isLock : annotationSettings.isLock;
        annotationSettings.minHeight = annotationObject.minHeight ? annotationObject.minHeight : annotationSettings.minHeight;
        annotationSettings.minWidth = annotationObject.minWidth ? annotationObject.minWidth : annotationSettings.minWidth;
        annotationSettings.maxWidth = annotationObject.maxWidth ? annotationObject.maxWidth : annotationSettings.maxWidth;
        annotationSettings.maxHeight = annotationObject.maxHeight ? annotationObject.maxHeight : annotationSettings.maxHeight;
        //Calculating area for all the measurements
        const values: any = {depth: 96,
            factor: 0.013888888888888888,
            ratio: 1,
            unit: 'in'};
        let notes: string = '';
        if (vertexPoints || annotationType === 'Radius' || annotationType === 'Volume')
        {
            if (annotationType === 'Distance' || annotationType === 'Perimeter' || annotationType === 'Radius')
            {
                let length: number = 0;
                if (annotationType === 'Radius')
                {
                    length = (annotationObject.width / 2) * this.pixelToPointFactor;
                }
                else
                {
                    for (let i: number = 0; i < vertexPoints.length - 1; i++) {
                        length += Math.sqrt(Math.pow((vertexPoints[parseInt(i.toString(), 10)].x - vertexPoints[i + 1].x), 2)
                         + Math.pow((vertexPoints[parseInt(i.toString(), 10)].y - vertexPoints[i + 1].y), 2));
                    }
                    length = length * this.pixelToPointFactor;
                }
                const scaledValue: number = length * values.ratio;
                notes = this.convertPointToUnits(values.factor, scaledValue, values.unit);
            }
            else if (annotationType === 'Area' || annotationType === 'Volume' )
            {
                let area: number = 0;
                let j: number = vertexPoints.length - 1;
                for (let i: number = 0; i < vertexPoints.length; i++) {
                    area += (vertexPoints[parseInt(j.toString(), 10)].x * this.pixelToPointFactor *
                     values.factor + vertexPoints[parseInt(i.toString(), 10)].x * this.pixelToPointFactor *
                      values.factor) * (vertexPoints[parseInt(j.toString(), 10)].y * this.pixelToPointFactor *
                       values.factor - vertexPoints[parseInt(i.toString(), 10)].y * this.pixelToPointFactor * values.factor);
                    j = i;
                }
                area = (Math.abs((area) / 2.0));
                if (annotationType === 'Volume')
                {
                    area = area * ((values.depth * this.convertUnitToPoint(values.unit)) * values.factor) * values.ratio;
                    notes = Math.round(area * 100) / 100 + this.pdfViewer.localeObj.getConstant('cu') + ' ' + this.pdfViewer.localeObj.getConstant(values.unit);
                }
                else
                {notes = Math.round(area * 100) / 100 + this.pdfViewer.localeObj.getConstant('sq') + ' ' + this.pdfViewer.localeObj.getConstant(values.unit); }
            }
        }
        //Converting points model into vertex property
        if (vertexPoints)
        {vertexPoints = this.pdfViewer.annotation.getVertexPointsXY(vertexPoints); }
        //Creating Annotation objects with it's proper properties
        const measureShapeAnnotation: any = [];
        const shape: any = {
            AllowedInteractions: annotationObject.allowedInteractions ? annotationObject.allowedInteractions : allowedInteractions,
            AnnotName: annotationName,
            AnnotType: 'shape_measure',
            AnnotationSelectorSettings: annotationObject.annotationSelectorSettings ?
                annotationObject.annotationSelectorSettings : annotationSelectorSettings,
            AnnotationSettings: annotationSettings,
            Author: annotationObject.author ? annotationObject.author : 'Guest',
            BorderDashArray: annotationObject.borderDashArray ? annotationObject.borderDashArray : 0,
            BorderStyle: 'Solid',
            Bounds: {X: offset.x, Y: offset.y, Width: annotationObject.width, Height: annotationObject.height,
                Left: offset.x, Top: offset.y, Location: {X: offset.x, Y: offset.y},
                Size: {Height: annotationObject.height, IsEmpty: false, Width: annotationObject.width}},
            Calibrate: {
                Area: [{ConversionFactor: 1, Denominator: 100, FormatDenominator: false, FractionalType: 'D', Unit: 'sq in'}],
                Depth: annotationObject.depth ? annotationObject.depth : 96,
                Distance: [{ConversionFactor: 1, Denominator: 100, FormatDenominator: false, FractionalType: 'D', Unit: 'in'}],
                Ratio: '1 in = 1 in',
                TargetUnitConversion: 0,
                Volume: null,
                X : [{ConversionFactor: 0.013888889, Denominator: 100, FormatDenominator: false, FractionalType: 'D', Unit: 'in'}]
            },
            Caption: true,
            CaptionPosition: 'Top',
            CloudIntensity: 0,
            Comments: null,
            CustomData: annotationObject.customData ? annotationObject.customData : null,
            CreatedDate: currentDateString,
            EnableShapeLabel: false,
            ExistingCustomData: null,
            FillColor: annotationObject.fillColor ? annotationObject.fillColor : '#ffffff00',
            FontColor: null,
            FontSize: 0,
            Indent: measureAnnotationType,
            IsCloudShape: false,
            IsCommentLock: false,
            IsLocked : annotationObject.isLock ? annotationObject.isLock : false,
            IsPrint: !isNullOrUndefined(annotationObject.isPrint) ? annotationObject.isPrint : true,
            LabelBorderColor: null,
            LabelBounds: {X: 0, Y: 0, Width: 0, Height: 0},
            LabelContent: null,
            LabelFillColor: null,
            LabelSettings: null,
            LeaderLength: !isNullOrUndefined(annotationObject.leaderLength) ? annotationObject.leaderLength : 40,
            LeaderLineExtension: 0,
            LeaderLineOffset : 0,
            LineHeadStart: annotationObject.lineHeadStartStyle ? annotationObject.lineHeadStartStyle : isArrow ? 'ClosedArrow' : 'None',
            LineHeadEnd: annotationObject.lineHeadEndStyle ? annotationObject.lineHeadEndStyle : isArrow ? 'ClosedArrow' : 'None',
            ModifiedDate: '',
            Note: notes,
            Opacity: annotationObject.opacity ? annotationObject.opacity : 1,
            RectangleDifference: [],
            RotateAngle: 'RotateAngle0',
            ShapeAnnotationType: shapeAnnotationType,
            State: '',
            StateModel: '',
            StrokeColor: annotationObject.strokeColor ? annotationObject.strokeColor : '#ff0000',
            Subject: annotationObject.subject ? annotationObject.subject : subject,
            Thickness: annotationObject.thickness ? annotationObject.thickness : 1,
            VertexPoints : vertexPoints
        };
        //Adding the annotation object to an array and return it
        const ratioString: any = shape.Calibrate.Ratio.split('=').map((ratioString: any) => ratioString.trim());
        const [srcValueStr, unit] = ratioString[0].split(' ');
        const [destValueStr, displayUnit] = ratioString[1].split(' ');
        const destValue: number = parseFloat(destValueStr);
        const depthValue: number = 96;
        const srcValue: number = parseFloat(srcValueStr);
        const scaleRatio: MeasurementScaleRatio = {
            annotName: shape.AnnotName,
            displayUnit: displayUnit,
            unit: unit,
            ratio: destValue / srcValue,
            destValue: destValue,
            srcValue: srcValue,
            volumeDepth: depthValue,
            depthValue: depthValue,
            ratioString: ratioString
        };
        this.scaleRatioCollection.push(scaleRatio);
        measureShapeAnnotation[0] = shape;
        return {measureShapeAnnotation};
    }
}
