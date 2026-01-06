import { PdfViewer, LineTool } from '../index';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';
import { ZOrderPageTable, PdfAnnotationBase, PdfFormFieldBase } from './pdf-annotation';
import { Container, Rect, PointModel, Point, Matrix, identityMatrix, rotateMatrix, getDiagramElement, ThumbsConstraints, BaseAttributes, RectAttributes, CircleAttributes, IElement, scaleMatrix, cornersPointsBeforeRotation, Corners, SelectorConstraints, LineAttributes, ImageElement, TextAlign } from '@syncfusion/ej2-drawings';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { PathElement } from '@syncfusion/ej2-drawings';
import { createMeasureElements } from '@syncfusion/ej2-drawings';
import { randomId } from '@syncfusion/ej2-drawings';
import { Size, transformPointByMatrix, RotateTransform, TextElement } from '@syncfusion/ej2-drawings';
import { Canvas, refreshDiagramElements, DrawingRenderer } from '@syncfusion/ej2-drawings';
import { Selector } from './selector';
import { SvgRenderer } from '@syncfusion/ej2-drawings';
import { SelectorModel } from './selector-model';
import { isLineShapes, setElementStype, findPointsLength, getBaseShapeAttributes, isLeader, Leader, cloneObject, updateColorWithOpacity } from './drawing-util';
import { getConnectorPoints, updateSegmentElement, getSegmentElement, updateDecoratorElement, getDecoratorElement, clipDecorators, initDistanceLabel, initLeaders, initLeader, getPolygonPath, initPerimeterLabel } from './connector-util';
import { isNullOrUndefined, isBlazor, Browser } from '@syncfusion/ej2-base';
import { AnnotationResizerLocation, AnnotationSelectorSettingsModel } from '../index';
import { DiagramHtmlElement } from './html-element';
import { IFormField, IFormFieldBound } from '../form-designer';
import { FormFieldModel } from '../pdfviewer-model';
import { FontStyle, FormFieldType, ISize } from '../base';

/**
 * Renderer module is used to render basic diagram elements
 *
 * @hidden
 */
export class Drawing {
    private pdfViewer: PdfViewer;
    private renderer: DrawingRenderer;
    private svgRenderer: SvgRenderer;
    private isDynamicStamps: boolean = false;
    private stampPreviousSize: DrawingElement[];
    private stampOriginalWidth: number;
    private stampOriginalHeight: number;
    private stampPreviousWidth: number;
    private stampPerviousHeight: number;
    /**
     * @private
     */
    public copiedElementID: string = '';
    /**
     * @private
     */
    public isPasted: boolean = false;
    /**
     * @private
     */
    public isLineInHorizontalBounds: boolean = true;
    /**
     * @private
     */
    public isLineInVerticalBounds: boolean = true;
    constructor(viewer: PdfViewer) {
        this.pdfViewer = viewer;
        this.renderer = new DrawingRenderer('this.pdfViewer.element.id', false);
        this.svgRenderer = new SvgRenderer();
    }

    /**
     * @private
     * @param {PdfViewer} viewer - Specified the pdfViewer element.
     * @returns {void}
     */
    public renderLabels(viewer: PdfViewer): void {
        const annotations: PdfAnnotationBaseModel[] = viewer.annotations;
        if (annotations) {
            for (let i: number = 0; i < annotations.length; i++) {
                const annotation: PdfAnnotationBaseModel = annotations[parseInt(i.toString(), 10)];
                this.initObject(annotation);
            }
        }
    }

    private createNewZindexTable(pageId: number): ZOrderPageTable {
        const zIndexTable: ZOrderPageTable = new ZOrderPageTable();
        this.pdfViewer.zIndex++;
        zIndexTable.pageId = this.pdfViewer.zIndex;
        this.pdfViewer.zIndexTable.push(zIndexTable);
        return zIndexTable;
    }

    /**
     * @private
     * @param {number} pageId - Specified the page Id.
     * @returns {ZOrderPageTable} - Returns the ZOrder page table.
     */
    public getPageTable(pageId: number): ZOrderPageTable {
        let zIndexTable: ZOrderPageTable;
        if (this.pdfViewer.zIndexTable.length !== undefined) {
            let notFound: boolean = true;
            for (let i: number = 0; i < this.pdfViewer.zIndexTable.length; i++) {
                if (this.pdfViewer.zIndexTable[parseInt(i.toString(), 10)].pageId === pageId) {
                    notFound = false;
                    zIndexTable = this.pdfViewer.zIndexTable[parseInt(i.toString(), 10)];
                    break;
                }
            }
            if (notFound) {
                zIndexTable = this.createNewZindexTable(pageId);
                zIndexTable.pageId = pageId;
            }
        } else {
            zIndexTable = this.createNewZindexTable(pageId);
        }
        return zIndexTable;
    }

    /**
     * @private
     * @param {number} index - Specified the page index value.
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @returns {void}
     */
    public setZIndex(index: number, obj: PdfAnnotationBaseModel): void {
        if (obj.pageIndex !== undefined) {
            const pageTable: ZOrderPageTable = this.getPageTable(obj.pageIndex);
            let ispageobject: boolean = false;
            if (obj.shapeAnnotationType !== 'Polygon') {
                for (let i: number = 0; i < pageTable.objects.length; i++) {
                    if (obj.id === pageTable.objects[parseInt(i.toString(), 10)].id) {
                        pageTable.objects.splice(parseInt(i.toString(), 10), 1);
                        pageTable.objects.splice(parseInt(i.toString(), 10), 0, obj);
                        ispageobject = true;
                        break;
                    }
                }
            }
            if (!ispageobject) {
                if (obj.zIndex === -1) {
                    pageTable.zIndex++;
                    obj.zIndex = pageTable.zIndex;
                    pageTable.objects.push(obj);
                } else {
                    let tabelLength: number = pageTable.objects.length;
                    obj.zIndex = tabelLength++;
                    pageTable.objects.push(obj);
                }
            }
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel | PdfFormFieldBaseModel} obj - Specified the annotation object.
     * @returns {PdfAnnotationBaseModel | PdfFormFieldBaseModel} - Returns the annotaion or form fields model.
     */
    public initObject(obj: PdfAnnotationBaseModel | PdfFormFieldBaseModel): PdfAnnotationBaseModel | PdfFormFieldBaseModel {
        //Move the common properties like zindex and id to an abstract class
        this.setZIndex(this.pdfViewer.zIndex, obj);
        createMeasureElements();
        if (!isLineShapes(obj)) {
            this.initNode(obj);
        } else {
            this.initLine(obj);
            if (obj.wrapper.children[1] instanceof TextElement) {
                obj.wrapper.children[1].isEJ2 = true;
                if ((obj as PdfAnnotationBaseModel).shapeAnnotationType === 'FreeText') {
                    obj.wrapper.children[1].isFreeText = true;
                }
            }
            obj.wrapper.measure(new Size(undefined, undefined));
            obj.wrapper.arrange(obj.wrapper.desiredSize);
        }
        if ((obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).wrapper === null) {
            //Init default wrapper
        }
        (this.pdfViewer.nameTable as any)[(obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).id] = obj;
        //Add some methodologies to add the children of group to name table
        return obj;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @returns {void}
     */
    public initNode(obj: PdfAnnotationBaseModel | PdfFormFieldBaseModel): void {
        if (this.pdfViewer.annotationModule.isUndoRedoAction && (obj as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp') {
            const id: string = obj.id;
            const stampObject: any = (this.pdfViewer.nameTable as any)[`${id}`].wrapper.children;
            this.stampPreviousSize = JSON.parse(JSON.stringify(stampObject));
            this.stampPreviousWidth = obj.wrapper.actualSize.width;
            this.stampPerviousHeight = obj.wrapper.actualSize.height;
        }
        if (this.isPasted && (obj as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp') {
            this.stampOriginalWidth = obj.wrapper.actualSize.width;
            this.stampOriginalHeight = obj.wrapper.actualSize.height;
        }
        const canvas: Container = this.initContainer(obj);
        let content: DrawingElement;
        if (!canvas.children) {
            canvas.children = [];
        }
        if (!content) {
            content = this.init(obj, canvas);
        }
        //canvas.children.push(content);
        canvas.rotateAngle = obj.rotateAngle;
        if (obj.wrapper.children[1] instanceof TextElement) {
            obj.wrapper.children[1].isEJ2 = true;
            if ((obj as PdfAnnotationBaseModel).shapeAnnotationType === 'FreeText') {
                obj.wrapper.children[1].isFreeText = true;
            }
        }

        canvas.measure(new Size((obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).wrapper.width,
                                (obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).wrapper.height));
        canvas.arrange(canvas.desiredSize);
        if (this.isDynamicStamps) {
            this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(obj, null, 'dynamicStamp');
            this.isDynamicStamps = false;
        }
    }

    /**
     * Allows to initialize the UI of a node
     */
    /**
     * @private
     * @param {PdfAnnotationBaseModel | PdfFormFieldBaseModel} obj - Specified the annotation object.
     * @param {Container} canvas - Specified the canvas element.
     * @returns {DrawingElement} - Returns the drawing element.
     */
    public init(obj: PdfAnnotationBaseModel | PdfFormFieldBaseModel, canvas: Container): DrawingElement {
        let content: DrawingElement;
        content = new DrawingElement();
        let pathContent: PathElement;
        let basicElement: DrawingElement;
        const isStamp: boolean = false;
        const annotationSettings: any = this.pdfViewer.annotationModule ? this.pdfViewer.annotationModule.findAnnotationSettings(obj) : {};
        let annotationMaxHeight: number = 0;
        let annotationMaxWidth: number = 0;
        let annotationMinHeight: number = 0;
        let annotationMinWidth: number = 0;
        if (annotationSettings.minWidth || annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        let isAnnotationSet: boolean = false;
        if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
            isAnnotationSet = true;
        }
        if (obj.formFieldAnnotationType) {
            content = this.initFormFields(obj, content, canvas);
        } else {
            content = this.initAnnotationObject(obj, pathContent, content, canvas, isStamp, basicElement, isAnnotationSet,
                                                annotationMaxHeight, annotationMaxWidth, annotationMinWidth, annotationMinHeight);
        }
        content.id = obj.id + '_content'; content.relativeMode = 'Object';
        if ((obj as PdfAnnotationBaseModel).shapeAnnotationType !== 'Stamp') {
            if (obj.bounds.width !== undefined) {
                content.width = obj.bounds.width;
                if (isAnnotationSet) {
                    if ((content.width < annotationMinWidth) || (content.width > annotationMaxWidth)) {
                        if (content.width < annotationMinWidth) {
                            content.width = annotationMinWidth;
                        }
                        if (content.width > annotationMaxWidth) {
                            content.width = annotationMaxWidth;
                        }
                    }
                }
            }
            content.horizontalAlignment = 'Stretch';
            if (obj.bounds.height !== undefined) {
                content.height = obj.bounds.height;
                if (isAnnotationSet) {
                    if ((content.height < annotationMinHeight) || (content.width > annotationMaxHeight)) {
                        if (content.height < annotationMinHeight) {
                            content.height = annotationMinHeight;
                        }
                        if (content.height > annotationMaxHeight) {
                            content.height = annotationMaxHeight;
                        }
                    }
                }
            }
            setElementStype(obj, content);
            if (this.pdfViewer.viewerBase.drawSignatureWithTool && (obj as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureText') {
                content.style.strokeWidth = 0;
            }
        }
        content.isRectElement = true;
        content.verticalAlignment = 'Stretch';
        return content;
    }

    private initFormFields(obj: PdfFormFieldBaseModel, content: DrawingElement, canvas: Container): DrawingElement {
        switch (obj.formFieldAnnotationType) {
        case 'Textbox':
        case 'PasswordField':
        case 'Checkbox':
        case 'RadioButton':
        case 'DropdownList':
        case 'ListBox':
        case 'SignatureField':
        case 'InitialField': {
            const htmlContent: DiagramHtmlElement = new DiagramHtmlElement();
            content = (htmlContent as DrawingElement);
            content.id = obj.id + '_content';
            canvas.children.push(content);
            break;
        }
        }
        return content;
    }

    private initAnnotationObject(obj: PdfAnnotationBaseModel, pathContent: PathElement, content: DrawingElement,
                                 canvas: Container, isStamp: boolean, basicElement: DrawingElement, isAnnotationSet: boolean,
                                 annotationMaxHeight: number, annotationMaxWidth: number, annotationMinWidth: number,
                                 annotationMinHeight: number): DrawingElement {
        switch (obj.shapeAnnotationType) {
        case 'Ellipse':
            pathContent = new PathElement();
            pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
            content = pathContent;
            canvas.children.push(content);
            if (obj.enableShapeLabel) {
                const textLabel: TextElement = this.textElement(obj);
                textLabel.content = obj.labelContent;
                textLabel.style.color = obj.fontColor;
                textLabel.style.strokeColor = obj.labelBorderColor;
                textLabel.style.fill = obj.labelFillColor;
                textLabel.style.fontSize = obj.fontSize;
                textLabel.style.fontFamily = obj.fontFamily;
                textLabel.style.opacity = obj.labelOpacity;
                canvas.children.push(textLabel);
            }
            break;
        case 'Path':
            pathContent = new PathElement();
            pathContent.data = obj.data;
            content = pathContent;
            canvas.children.push(content);
            break;
        case 'HandWrittenSignature':
        case 'Ink':
            pathContent = new PathElement();
            pathContent.data = obj.data;
            pathContent.style.strokeColor = obj.strokeColor;
            pathContent.style.strokeWidth = obj.thickness;
            pathContent.style.opacity = obj.opacity;
            content = pathContent;
            canvas.children.push(content);
            break;
        case 'Polygon':
            pathContent = new PathElement();
            pathContent.data = getPolygonPath(obj.vertexPoints);
            content = pathContent;
            canvas.children.push(content);
            break;
        case 'Stamp': {
            isStamp = true;
            this.isDynamicStamps = true;
            let copiedObject: any;
            if (this.isPasted) {
                const id: string = (this.pdfViewer.clipboardData.clipObject as any)[0].id;
                copiedObject = (this.pdfViewer.nameTable as any)[`${id}`];
            }
            if (obj.isDynamicStamp) {
                canvas.horizontalAlignment = 'Left';
                basicElement = new DrawingElement();
                content = basicElement;
                content.cornerRadius = 10;
                content.style.fill = obj.stampFillColor;
                content.style.strokeColor = obj.stampStrokeColor;
                canvas.children.push(content);
                const textele: TextElement = new TextElement();
                textele.style.fontFamily = 'Helvetica';
                textele.style.fontSize = 14;
                textele.style.italic = true;
                textele.style.bold = true;
                textele.style.color = obj.fillColor;
                textele.rotateValue = undefined;
                textele.content = obj.dynamicText;
                textele.style.textAlign = 'Left';
                textele.relativeMode = 'Point';
                textele.margin.left = 5;
                textele.margin.bottom = 3;
                textele.setOffsetWithRespectToBounds(0, 0.75, null);
                if (obj.annotationAddMode === 'Existing Annotation' || obj.annotationAddMode === 'Imported Annotation') {
                    const targetWidth: number = obj.bounds.width + 20;
                    const targetHeight: number = obj.bounds.height + 20;
                    const iconPadding: number = targetWidth * 0.02;
                    const iconInnerWidth: number = Math.max(0, targetWidth - 2 * iconPadding);
                    textele.style.fontSize = this.fontSizeCalculation(obj, textele, iconInnerWidth, textele.content);
                    const metrics: {
                        width: number;
                        height: number;
                        ascent: number;
                        descent: number;
                    } = this.measureTextMetrics(obj, textele.content,
                                                textele.style.fontSize, textele.style.fontFamily);
                    const bottomOffset: number = (targetHeight * 0.25 - metrics.height) / 8;
                    textele.margin.bottom = Math.max(0, bottomOffset);
                    if (textele.margin.bottom < 1) {
                        textele.margin.bottom = 5;
                    }
                    textele.margin.left = (targetWidth - metrics.width) / 2;
                }
                if (this.isPasted)
                {
                    textele.style.fontSize = copiedObject.wrapper.children[1].style.fontSize;
                    textele.margin.left = copiedObject.wrapper.children[1].margin.left;
                }
                if (this.pdfViewer.annotationModule.isUndoRedoAction) {
                    textele.style.fontSize = (this.stampPreviousSize[1].style as any).fontSize;
                }
                canvas.children.push(textele);
                if (isAnnotationSet && (obj.bounds.width > annotationMaxWidth)) {
                    obj.bounds.width = annotationMaxWidth;
                }
                if (isAnnotationSet && (obj.bounds.height > annotationMaxHeight)) {
                    obj.bounds.height = annotationMaxHeight / 2;
                }
                const textele1: TextElement = new TextElement();
                textele1.style.fontFamily = 'Helvetica';
                textele1.style.fontSize = obj.fontSize;
                textele1.style.italic = true;
                textele1.style.bold = true;
                textele1.style.color = obj.fillColor;
                textele1.rotateValue = undefined;
                textele1.content = obj.icon.toUpperCase();
                textele1.style.textAlign = 'Left';
                textele1.relativeMode = 'Point';
                textele1.margin.left = 5;
                textele1.margin.top = 4;
                textele1.setOffsetWithRespectToBounds(0, 0.1, null);
                if (obj.annotationAddMode === 'Existing Annotation' || obj.annotationAddMode === 'Imported Annotation') {
                    const targetWidth: number = obj.bounds.width + 20;
                    const targetHeight: number = obj.bounds.height + 20;
                    let iconWidth: number = targetWidth;
                    if (textele1.content === 'REVISED' || textele1.content === 'REVIEWED' ||
                        textele1.content === 'RECEIVED' || textele1.content === 'APPROVED') {
                        iconWidth = iconWidth / 2;
                    }
                    else if (textele1.content === 'CONFIDENTIAL' || textele1.content === 'NOT APPROVED') {
                        iconWidth = iconWidth * (3 / 4);
                    }
                    const iconPadding: number = iconWidth * 0.02;
                    const iconInnerWidth: number = Math.max(0, iconWidth - 2 * iconPadding);
                    textele1.style.fontSize = this.fontSizeCalculation(obj, textele1, iconInnerWidth, textele1.content);
                    const metrics: {
                        width: number;
                        height: number;
                        ascent: number;
                        descent: number;
                    } = this.measureTextMetrics(obj, textele1.content,
                                                textele1.style.fontSize, textele1.style.fontFamily);
                    const topOffset: number = (targetHeight * 0.75 - metrics.height) / 10;
                    textele1.margin.top = Math.max(0, topOffset);
                    if (textele1.content === 'CONFIDENTIAL' || textele1.content === 'NOT APPROVED') {
                        textele1.margin.left = (targetWidth - (metrics.width * (4 / 3))) / 2;
                    }
                    else {
                        textele1.margin.left = (targetWidth - (metrics.width * 2)) / 2;
                    }
                }
                if (this.isPasted) {
                    textele1.style.fontSize = copiedObject.wrapper.children[2].style.fontSize;
                    textele1.margin.left = copiedObject.wrapper.children[2].margin.left;
                    textele1.margin.top = copiedObject.wrapper.children[2].margin.top -
                        (copiedObject.wrapper.children[2].margin.top * 0.5);
                    content.width = this.stampOriginalWidth;
                    content.height = this.stampOriginalHeight;
                }
                else if (this.pdfViewer.annotationModule.isUndoRedoAction) {
                    textele1.style.fontSize = (this.stampPreviousSize[2].style as any).fontSize;
                    content.width = this.stampPreviousWidth;
                    content.height = this.stampPerviousHeight;
                }
                else {
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                }
                content.style.opacity = obj.opacity;
                textele1.id = randomId() + '_stamp';
                canvas.children.push(textele1);
            } else {
                canvas.horizontalAlignment = 'Left';
                basicElement = new DrawingElement();
                content = basicElement;
                content.cornerRadius = 10;
                content.style.fill = obj.stampFillColor;
                content.style.strokeColor = obj.stampStrokeColor;
                canvas.children.push(content);
                if (obj.icon === 'Accepted' || obj.icon === 'Rejected') {
                    if (obj && obj.annotationAddMode && (obj.annotationAddMode === 'Existing Annotation' || obj.annotationAddMode === 'Imported Annotation')) {
                        obj.bounds.width = obj.bounds.width - 20;
                        obj.bounds.height = obj.bounds.height - 20;
                    }
                    const pathContent1: PathElement = new PathElement();
                    pathContent1.id = randomId() + '_stamp';
                    pathContent1.data = obj.data;
                    pathContent1.width = obj.bounds.width;
                    if (isAnnotationSet && (obj.bounds.width > annotationMaxWidth)) {
                        pathContent1.width = annotationMaxWidth;
                        obj.bounds.width = annotationMaxWidth;
                    }
                    pathContent1.height = obj.bounds.height;
                    if (isAnnotationSet && (obj.bounds.height > annotationMaxHeight)) {
                        pathContent1.height = annotationMaxHeight;
                        obj.bounds.height = annotationMaxHeight;
                    }
                    pathContent1.minWidth = pathContent1.width / 2;
                    pathContent1.minHeight = pathContent1.height / 2;
                    const content1: any = pathContent1;
                    pathContent1.style.fill = obj.fillColor;
                    pathContent1.style.strokeColor = obj.strokeColor;
                    pathContent1.style.opacity = obj.opacity;
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                    content.minWidth = pathContent1.width / 2;
                    content.minHeight = pathContent1.height / 2;
                    content.style.opacity = obj.opacity;
                    canvas.children.push(content1);
                    canvas.minHeight = content.minHeight + 20;
                    canvas.minWidth = content.minWidth + 20;
                }
                else{
                    if (isAnnotationSet && (obj.bounds.width > annotationMaxWidth)) {
                        obj.bounds.width = annotationMaxWidth;
                    }
                    if (isAnnotationSet && (obj.bounds.height > annotationMaxHeight)) {
                        obj.bounds.height = annotationMaxHeight / 2;
                    }
                    const textele1: TextElement = new TextElement();
                    textele1.style.fontFamily = 'Helvetica';
                    textele1.style.fontSize = obj.fontSize;
                    textele1.style.italic = true;
                    textele1.style.bold = true;
                    textele1.style.color = obj.fillColor;
                    textele1.rotateValue = undefined;
                    textele1.style.textAlign = 'Left';
                    textele1.content = obj.icon.toUpperCase();
                    textele1.relativeMode = 'Point';
                    textele1.setOffsetWithRespectToBounds(0, 0.1, null);
                    const metrics: {
                        width: number;
                        height: number;
                        ascent: number;
                        descent: number;
                    } = this.measureTextMetrics(obj, textele1.content,
                                                textele1.style.fontSize, textele1.style.fontFamily);
                    textele1.margin.top = 5;
                    textele1.margin.left = ((obj.bounds.width + 20) - metrics.width) / 2;
                    if (obj.annotationAddMode === 'Existing Annotation' || obj.annotationAddMode === 'Imported Annotation') {
                        const targetWidth: number = obj.bounds.width + 20;
                        const targetHeight: number = obj.bounds.height + 20;
                        const paddingX: number = targetWidth * 0.05;
                        const innerWidth: number = Math.max(0, targetWidth - 2 * paddingX);
                        textele1.style.fontSize = this.fontSizeCalculation(obj, textele1, innerWidth, textele1.content);
                        const metrics: {
                            width: number;
                            height: number;
                            ascent: number;
                            descent: number;
                        } = this.measureTextMetrics(obj, textele1.content,
                                                    textele1.style.fontSize, textele1.style.fontFamily);
                        const leftOffset: number = (targetWidth - metrics.width) / 2;
                        textele1.margin.left = Math.max(0, leftOffset);
                    }
                    if (this.isPasted) {
                        textele1.style.fontSize = copiedObject.wrapper.children[1].style.fontSize;
                        textele1.margin.left = copiedObject.wrapper.children[1].margin.left;
                        textele1.margin.top = copiedObject.wrapper.children[1].margin.top -
                        (copiedObject.wrapper.children[1].margin.top * 0.5);
                        content.width = this.stampOriginalWidth;
                        content.height = this.stampOriginalHeight;
                    }
                    else if (this.pdfViewer.annotationModule.isUndoRedoAction) {
                        textele1.style.fontSize = (this.stampPreviousSize[1].style as any).fontSize;
                        textele1.margin.left = (this.stampPreviousWidth - metrics.width) / 2;
                        content.width = this.stampPreviousWidth;
                        content.height = this.stampPerviousHeight;
                    }
                    else {
                        content.width = obj.bounds.width + 20;
                        content.height = obj.bounds.height + 20;
                    }
                    content.style.opacity = obj.opacity;
                    textele1.id = randomId() + '_stamp';
                    canvas.children.push(textele1);
                }
            }
            break;
        }
        case 'Image':
        case 'SignatureImage': {
            const pathContent11: ImageElement = new ImageElement();
            pathContent11.source = obj.data;
            content = pathContent11;
            content.style.strokeWidth = 0;
            canvas.children.push(content);
            break;
        }
        case 'Rectangle':
        case 'Redaction':
            basicElement = new DrawingElement();
            content = basicElement;
            canvas.children.push(content);
            if (obj.enableShapeLabel) {
                const textLabel: TextElement = this.textElement(obj);
                textLabel.content = obj.labelContent;
                textLabel.style.color = obj.fontColor;
                textLabel.style.strokeColor = obj.labelBorderColor;
                textLabel.style.fill = obj.labelFillColor;
                textLabel.style.fontSize = obj.fontSize;
                textLabel.style.fontFamily = obj.fontFamily;
                textLabel.style.opacity = obj.labelOpacity;
                canvas.children.push(textLabel);
            }
            break;
        case 'Perimeter': {
            pathContent = new PathElement();
            pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
            content = pathContent;
            setElementStype(obj, pathContent);
            canvas.children.push(content);
            basicElement = new DrawingElement();
            basicElement.id = 'perimeter_' + randomId();
            basicElement.height = .2;
            basicElement.width = .2;
            basicElement.transform = RotateTransform.Self;
            basicElement.horizontalAlignment = 'Stretch';
            this.setNodePosition(basicElement, obj);
            basicElement.rotateAngle = obj.rotateAngle;
            setElementStype(obj, basicElement);
            canvas.children.push(basicElement);
            let textele: TextElement = this.textElement(obj);
            textele = new TextElement();
            textele.content = textele.content = findPointsLength([
                { x: obj.bounds.x, y: obj.bounds.y },
                { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }]).toString();
            textele.rotateValue = { y: -10, angle: obj.rotateAngle };
            canvas.children.push(textele);
            break;
        }
        case 'Radius': {
            pathContent = new PathElement();
            pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
            content = pathContent;
            setElementStype(obj, pathContent);
            canvas.children.push(content);
            basicElement = new DrawingElement();
            basicElement.id = 'radius_' + randomId();
            basicElement.height = .2;
            basicElement.width = obj.bounds.width / 2;
            basicElement.transform = RotateTransform.Self;
            this.setNodePosition(basicElement, obj);
            basicElement.rotateAngle = obj.rotateAngle;
            setElementStype(obj, basicElement);
            canvas.children.push(basicElement);
            const radiusTextEle: TextElement = this.textElement(obj);
            if (obj.enableShapeLabel) {
                radiusTextEle.style.color = obj.fontColor;
                radiusTextEle.style.strokeColor = obj.labelBorderColor;
                radiusTextEle.style.fill = obj.labelFillColor;
                radiusTextEle.style.fontSize = obj.fontSize;
                radiusTextEle.style.fontFamily = obj.fontFamily;
                radiusTextEle.style.opacity = obj.labelOpacity;
            }
            const length: number = findPointsLength([
                { x: obj.bounds.x, y: obj.bounds.y },
                { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }]);
            if (!this.pdfViewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
                radiusTextEle.content = obj.notes;
            } else {
                radiusTextEle.content = this.pdfViewer.annotation.measureAnnotationModule.setConversion((obj.bounds.width / 2) *
                 this.pdfViewer.annotation.measureAnnotationModule.pixelToPointFactor, obj);
            }
            radiusTextEle.rotateValue = { y: -10, x: obj.bounds.width / 4, angle: obj.rotateAngle };
            canvas.children.push(radiusTextEle);
            break;
        }
        case 'StickyNotes': {
            const pathContent2: ImageElement = new ImageElement();
            pathContent2.source = obj.data;
            pathContent2.width = obj.bounds.width;
            pathContent2.height = obj.bounds.height;
            pathContent2.style.strokeColor = obj.strokeColor;
            pathContent2.style.strokeWidth = 0;
            content = pathContent2;
            canvas.children.push(content);
            break;
        }
        case 'SignatureText': {
            const rectElements: DrawingElement = new DrawingElement();
            rectElements.style.strokeWidth = 0;
            content = rectElements;
            content.style.strokeWidth = 0;
            canvas.style.strokeWidth = 0;
            canvas.children.push(content);
            const signatureText: TextElement = this.textElement(obj);
            signatureText.style.fontFamily = obj.fontFamily;
            signatureText.style.fontSize = obj.fontSize;
            signatureText.style.textAlign = 'Left';
            signatureText.rotateValue = undefined;
            signatureText.content = obj.data;
            signatureText.style.strokeWidth = 0;
            canvas.children.push(signatureText);
            break;
        }
        case 'FreeText': {
            const rectElement: DrawingElement = new DrawingElement();
            content = rectElement;
            canvas.children.push(content);
            let freeTextEle: TextElement = this.textElement(obj);
            freeTextEle = new TextElement();
            freeTextEle.style.fontFamily = obj.fontFamily;
            freeTextEle.style.fontSize = obj.fontSize;
            freeTextEle.style.textAlign = 'Left';
            if (obj.textAlign.toLowerCase() === 'center') {
                freeTextEle.style.textAlign = 'Center';
            } else if (obj.textAlign.toLowerCase() === 'right') {
                freeTextEle.style.textAlign = 'Right';
            } else if (obj.textAlign.toLowerCase() === 'justify') {
                freeTextEle.style.textAlign = 'Justify';
            }
            freeTextEle.style.color = obj.fontColor;
            freeTextEle.style.bold = obj.font.isBold;
            freeTextEle.style.italic = obj.font.isItalic;
            if (obj.font.isUnderline === true) {
                freeTextEle.style.textDecoration = 'Underline';
            } else if (obj.font.isStrikeout === true) {
                freeTextEle.style.textDecoration = 'LineThrough';
            }
            freeTextEle.rotateValue = undefined;
            freeTextEle.content = obj.dynamicText;
            freeTextEle.style.opacity = obj.opacity;
            freeTextEle.style.strokeWidth = obj.thickness;
            freeTextEle.margin.left = 4;
            freeTextEle.margin.right = 5;
            freeTextEle.margin.top = 5 * (obj.fontSize / 16);
            if (this.isPasted || this.pdfViewer.viewerBase.isImportAction || this.pdfViewer.viewerBase.isInitialLoad) {
                const halfStroke: number = (obj.thickness || 0) / 2;
                freeTextEle.margin.left = halfStroke >= freeTextEle.margin.left ? halfStroke : freeTextEle.margin.left;
                freeTextEle.margin.right = halfStroke >= freeTextEle.margin.left ? halfStroke : freeTextEle.margin.right;
            }
            this.isPasted = false;
            if (this.pdfViewer.freeTextSettings.enableAutoFit) {
                freeTextEle.style.textWrapping = 'Wrap';
            } else {
                freeTextEle.style.textWrapping = 'WrapWithOverflow';
            }
            freeTextEle.relativeMode = 'Point';
            freeTextEle.setOffsetWithRespectToBounds(0, 0, null);
            freeTextEle.relativeMode = 'Point';
            canvas.children.push(freeTextEle);
            break;
        }
        }
        content.id = obj.id + '_content'; content.relativeMode = 'Object';
        if (!isStamp) {
            if (obj.bounds.width !== undefined) {
                content.width = obj.bounds.width;
                if (isAnnotationSet) {
                    if ((content.width < annotationMinWidth) || (content.width > annotationMaxWidth)) {
                        if (content.width < annotationMinWidth) {
                            content.width = annotationMinWidth;
                        }
                        if (content.width > annotationMaxWidth) {
                            content.width = annotationMaxWidth;
                        }
                    }
                }
            }
            content.horizontalAlignment = 'Stretch';
            if (obj.bounds.height !== undefined) {
                content.height = obj.bounds.height;
                if (isAnnotationSet) {
                    if ((content.height < annotationMinHeight) || (content.width > annotationMaxHeight)) {
                        if (content.height < annotationMinHeight) {
                            content.height = annotationMinHeight;
                        }
                        if (content.height > annotationMaxHeight) {
                            content.height = annotationMaxHeight;
                        }
                    }
                }
            }
            setElementStype(obj, content);
        }
        content.isRectElement = true;
        content.verticalAlignment = 'Stretch';
        return content;
    }

    private textElement(obj: PdfAnnotationBaseModel): TextElement {
        const textele: TextElement = new TextElement();
        setElementStype(obj, textele);
        textele.horizontalAlignment = 'Center';
        textele.verticalAlignment = obj.shapeAnnotationType === 'SignatureText' ? 'Center' : 'Top';
        textele.relativeMode = 'Object';
        textele.setOffsetWithRespectToBounds(.5, .5, 'Absolute');
        return textele;
    }

    /**
     * @private
     * @param {DrawingElement} obj - Specified the drawing element.
     * @param {PdfAnnotationBaseModel} node - Specified the node element.
     * @returns {void}
     */
    public setNodePosition(obj: DrawingElement, node: PdfAnnotationBaseModel): void {
        if (node.shapeAnnotationType === 'Perimeter') {
            obj.offsetX = node.bounds.x + node.bounds.width / 2;
            obj.offsetY = node.bounds.y + node.bounds.height / 2;
        } else if (node.shapeAnnotationType === 'Radius') {
            const trasPoint: PointModel = { x: node.bounds.x + (node.bounds.width / 2) +
             (node.bounds.width / 4), y: node.bounds.y + (node.bounds.height / 2) };
            const center: PointModel = { x: (node.bounds.x + (node.bounds.width / 2)), y: (node.bounds.y + (node.bounds.height / 2)) };
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, node.rotateAngle, center.x, center.y);
            const rotatedPoint: PointModel = transformPointByMatrix(matrix, trasPoint);
            const newPoint1: PointModel = { x: rotatedPoint.x, y: rotatedPoint.y };
            obj.offsetX = newPoint1.x;
            obj.offsetY = newPoint1.y;
            obj.width = node.bounds.width / 2;
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @returns {Container} - Returns the container element.
     */
    public initContainer(obj: PdfAnnotationBaseModel): Container {
        if (!obj.id) {
            obj.id = randomId();
        }
        // Creates canvas element
        const canvas: Container = new Canvas();
        canvas.id = obj.id;
        canvas.offsetX = obj.bounds.x + (obj.bounds.width * 0.5);
        canvas.offsetY = obj.bounds.y + (obj.bounds.height * 0.5);
        canvas.style.fill = 'transparent';
        canvas.style.strokeColor = 'transparent';
        canvas.rotateAngle = obj.rotateAngle;
        obj.wrapper = canvas;
        return canvas;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @returns {Canvas} - Returns the canvas element.
     */
    public initLine(obj: PdfAnnotationBaseModel): Canvas {
        if (!obj.id) {
            obj.id = randomId();
        }
        const container: Canvas = new Canvas();
        let segment: PathElement = new PathElement();
        segment.id = obj.id + '_path';
        let srcDecorator: PathElement = new PathElement();
        let targetDecorator: PathElement = new PathElement();
        if (obj.vertexPoints.length) {
            obj.sourcePoint = obj.vertexPoints[0];
            obj.targetPoint = obj.vertexPoints[obj.vertexPoints.length - 1];
            for (let i: number = 0; i < obj.vertexPoints.length; i++) {
                if (i !== 0 && i !== obj.vertexPoints.length - 1) {
                    obj.segments.push(obj.vertexPoints[parseInt(i.toString(), 10)]);
                }
            }
        }
        segment = getSegmentElement(obj, segment);
        let points: PointModel[] = [];
        points = getConnectorPoints(obj);
        //  points = this.clipDecorators(this, points);
        let leaders: PathElement[] = [];
        let labels: TextElement[] = [];
        if (obj.shapeAnnotationType === 'Distance') {
            leaders = initLeaders(obj, points);
            labels = initDistanceLabel(obj, points, this.pdfViewer.annotation.measureAnnotationModule, this.pdfViewer);
        }
        if ((obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead') && obj.measureType === 'Perimeter') {
            labels = initPerimeterLabel(obj, points, this.pdfViewer.annotation.measureAnnotationModule, this.pdfViewer);
        }
        if (obj.enableShapeLabel === true && !(obj.shapeAnnotationType === 'Distance') && !(obj.measureType === 'Perimeter')) {
            const angle: number = Point.findAngle(points[0], points[1]);
            const textele: TextElement = this.textElement(obj);
            textele.id = randomId();
            if (!this.pdfViewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
                textele.content = obj.notes;
            } else {
                textele.content = obj.labelContent;
            }
            textele.style.strokeColor = obj.labelBorderColor;
            textele.style.fill = obj.labelFillColor;
            textele.style.fontSize = obj.fontSize;
            textele.style.color = obj.fontColor;
            textele.style.fontFamily = obj.fontFamily;
            textele.style.opacity = obj.labelOpacity;
            textele.rotateValue = { y: -10, angle: angle };
            labels.push(textele);
        }
        points = clipDecorators(obj, points);
        const bounds: Rect = Rect.toBounds(points);
        container.width = bounds.width;
        container.height = bounds.height;
        container.offsetX = bounds.x + container.pivot.x * bounds.width;
        container.offsetY = bounds.y + container.pivot.y * bounds.height;
        const anglePoints: PointModel[] = obj.vertexPoints as PointModel[];
        if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' || obj.shapeAnnotationType === 'Distance') {
            srcDecorator = getDecoratorElement(obj, points[0], anglePoints[1], true);
            targetDecorator = getDecoratorElement(obj, points[points.length - 1], anglePoints[anglePoints.length - 2], false);
        }
        srcDecorator.id = obj.id + '_srcDec';
        targetDecorator.id = obj.id + '_tarDec';
        segment.style['fill'] = 'transparent';
        container.style.strokeColor = 'transparent';
        container.style.fill = 'transparent';
        container.style.strokeWidth = 0;
        container.children = [];
        setElementStype(obj, segment);
        container.children.push(segment);
        if (leaders.length > 0) {
            for (let i: number = 0; i < leaders.length; i++) {
                container.children.push(leaders[parseInt(i.toString(), 10)]);
            }
        }
        if (labels.length > 0) {
            for (let i: number = 0; i < labels.length; i++) {
                container.children.push(labels[parseInt(i.toString(), 10)]);
            }
        }
        container.children.push(srcDecorator);
        container.children.push(targetDecorator);
        if (obj.shapeAnnotationType === 'LineWidthArrowHead') {
            for (let i: number = 0; i < container.children.length; i++) {
                const child: any = container.children[parseInt(i.toString(), 10)];
                if (child.id.includes('srcDec') || child.id.includes('tarDec')) {
                    if (!(obj.sourceDecoraterShapes === 'Butt' || obj.taregetDecoraterShapes === 'Butt')) {
                        child.width = 12 * obj.thickness;
                    }
                    child.height = 12 * obj.thickness;
                }
            }
        }
        container.id = obj.id;
        container.offsetX = segment.offsetX;
        container.offsetY = segment.offsetY;
        container.width = segment.width;
        container.height = segment.height;
        points = getConnectorPoints(obj);
        obj.wrapper = container;
        return container;
    }
    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @returns {PdfAnnotationBaseModel} - Returns the added annotaion object.
     */
    public add(obj: PdfAnnotationBaseModel): PdfAnnotationBaseModel {
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        if (obj.formFieldAnnotationType && this.pdfViewer.formDesignerModule) {
            obj = new PdfFormFieldBase(this.pdfViewer, 'formFields', obj as PdfFormFieldBase, true);
            obj = this.initObject(obj) as PdfFormFieldBaseModel;
            this.pdfViewer.formFields.push(obj);
        } else {
            obj = new PdfAnnotationBase(this.pdfViewer, 'annotations', obj as PdfAnnotationBase, true);
            obj = this.initObject(obj) as PdfAnnotationBaseModel;
            this.pdfViewer.annotations.push(obj);
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
        return obj;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @returns {void}
     */
    public remove(obj: PdfAnnotationBaseModel): void {
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        const index: number = obj.pageIndex;
        for (let i: number = 0; i < this.pdfViewer.annotations.length; i++) {
            const annotation: PdfAnnotationBaseModel = this.pdfViewer.annotations[parseInt(i.toString(), 10)];
            if ((annotation.id && (annotation.id === obj.id || annotation.id.split('_')[0] === obj.id)) || (annotation.wrapper && annotation.wrapper.id === obj.id)) {
                this.pdfViewer.annotations.splice(i, 1);
                const objects: (PdfAnnotationBaseModel)[] = this.getPageObjects(obj.pageIndex);
                for (let j: number = 0; j < objects.length; j++) {
                    if (objects[parseInt(j.toString(), 10)].id === obj.id) {
                        objects.splice(j, 1);
                        if (obj.shapeAnnotationType === 'Path' || obj.shapeAnnotationType === 'SignatureImage' || obj.shapeAnnotationType === 'SignatureText') {
                            this.refreshCanvasDiagramLayer(undefined, index, obj.id);
                        }
                        else {
                            this.pdfViewer.renderDrawing(undefined, index);
                        }
                    }
                }
                // need to add code snippet to remove from z index table
            }
        }
        for (let i: number = 0; i < this.pdfViewer.formFields.length; i++) {
            const element: PdfAnnotationBaseModel = this.pdfViewer.formFields[parseInt(i.toString(), 10)];
            if (element.id === obj.id || element.wrapper.id === obj.id) {
                this.pdfViewer.formFields.splice(i, 1);
                if (this.pdfViewer.formDesignerModule && obj.formFieldAnnotationType) {
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                }
                const objects: (PdfFormFieldBaseModel)[] = this.getPageObjects(obj.pageIndex);
                for (let j: number = 0; j < objects.length; j++) {
                    if (objects[parseInt(j.toString(), 10)].id === obj.id) {
                        objects.splice(j, 1);
                        break;
                    }
                    if (objects[parseInt(j.toString(), 10)] && objects[parseInt(j.toString(), 10)].id &&
                     objects[parseInt(j.toString(), 10)].id.indexOf(obj.id) !== -1) {
                        objects.splice(j, 1);
                    }
                }
            }
        }
        if (obj.formFieldAnnotationType === 'Textbox' || obj.formFieldAnnotationType === 'Checkbox' || obj.formFieldAnnotationType === 'RadioButton'
            || obj.formFieldAnnotationType === 'PasswordField' || obj.formFieldAnnotationType === 'DropdownList' || obj.formFieldAnnotationType === 'ListBox' || obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
            const inputField: HTMLElement = document.getElementById('form_field_' + obj.id + '_content_html_element');
            if (inputField) {
                inputField.remove();
                this.pdfViewer.renderDrawing(undefined, index);
            }
            for (let i: number = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                const element: FormFieldModel = this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)];
                if (element.id === obj.id) {
                    this.pdfViewer.formFieldCollections.splice(i, 1);
                }
            }
            for (let i: number = 0; i < this.pdfViewer.viewerBase.formFieldCollection.length; i++) {
                // eslint-disable-next-line
                if (obj.id == this.pdfViewer.viewerBase.formFieldCollection[parseInt(i.toString(), 10)]) {
                    this.pdfViewer.viewerBase.formFieldCollection.splice(i, 1);
                }
            }
            const field: IFormField = {
                // eslint-disable-next-line
                name: (obj as any).name, id: (obj as any).id, value: (obj as any).value, fontFamily: obj.fontFamily, fontSize: obj.fontSize, fontStyle: (obj as any).fontStyle,
                // eslint-disable-next-line
                color: (obj as any).color, backgroundColor: (obj as any).backgroundColor, alignment: (obj as any).alignment, isReadonly: (obj as any).isReadonly, visibility: (obj as any).visibility,
                // eslint-disable-next-line
                maxLength: (obj as any).maxLength, isRequired: (obj as any).isRequired, isPrint: obj.isPrint, rotation: (obj as any).rotateAngle, tooltip: (obj as any).tooltip,
                // eslint-disable-next-line
                options: (obj as any).options, isChecked: (obj as any).isChecked, isSelected: (obj as any).isSelected,
                // eslint-disable-next-line
                customData: (obj as any).customData, lineBound: (obj as any).bounds,
                // eslint-disable-next-line
                pageNumber: (obj as any).pageIndex, insertSpaces: (obj as any).insertSpaces,
                // eslint-disable-next-line
                formFieldAnnotationType: (obj as any).formFieldAnnotationType,
                // eslint-disable-next-line
                borderColor: (obj as any).borderColor, thickness: (obj as any).thickness, isTransparent: (obj as any).isTransparent
            };
            if (!isNullOrUndefined(field) && field.id !== 'diagram_helper') {
                this.pdfViewer.fireFormFieldRemoveEvent('formFieldRemove', field, obj.pageIndex);
                this.pdfViewer.formDesignerModule.removeFieldsFromAnnotationCollections(obj.id, field.name);
            }
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }

    /**
     * @private
     * @param {number} pageIndex - Specified the page index.
     * @returns {PdfAnnotationBaseModel[]} - Returns the annotation base model collections.
     */
    public getPageObjects(pageIndex: number): (PdfAnnotationBaseModel)[] {
        const pageTable: ZOrderPageTable = this.getPageTable(pageIndex);
        return pageTable.objects;
    }

    /**
     * @private
     * @param {HTMLCanvasElement} diagramLayer - Specified the diagram layer element.
     * @param {number} pageIndex - Specified the page index.
     * @param {string} objectId - Specified the object id.
     * @returns {void}
     */
    public refreshCanvasDiagramLayer(diagramLayer?: HTMLCanvasElement, pageIndex?: number, objectId?: string): void {
        if (!diagramLayer) {
            diagramLayer = (this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex) as HTMLCanvasElement);
        }
        if (diagramLayer) {
            let zoom: number;
            if (diagramLayer.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex) {
                zoom = 1;
            } else {
                zoom = this.pdfViewer.viewerBase.getZoomFactor();
            }
            const width: number = diagramLayer.width / zoom;
            const height: number = diagramLayer.height / zoom;
            const ctx: CanvasRenderingContext2D = diagramLayer.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (zoom < 1) {
                ctx.lineWidth = ctx.lineWidth / zoom;
            }
            const devicePixelRatio: number = this.pdfViewer.viewerBase.getWindowDevicePixelRatio();
            const zoomRatio: number = zoom * devicePixelRatio;
            if (!Browser.isDevice || (Browser.isDevice && zoom <= 0.7)) {
                ctx.setTransform(zoomRatio, 0, 0, zoomRatio, 0, 0);
            } else {
                ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
            }
            ctx.clearRect(0, 0, width, height);
            const objects: (PdfAnnotationBaseModel)[] = this.getPageObjects(pageIndex);
            const uniqueObjects: any = objects.filter((obj: any, index: number, self: any) => {
                if (obj.id.split('_')[0] === 'free') {
                    return true;
                }
                else if (!isNullOrUndefined(this.pdfViewer.formDesignerModule)) {
                    return index === self.findIndex((t: any) => t.id.split('_')[0] === obj.id.split('_')[0]);
                }
                return index === self.findIndex((t: any) => t.id === obj.id);
            });
            for (let i: number = 0; i < uniqueObjects.length; i++) {
                let renderElement: DrawingElement;
                if (diagramLayer.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex) {
                    if (uniqueObjects[parseInt(i.toString(), 10)].isPrint) {
                        renderElement = (this.pdfViewer.nameTable as any)[uniqueObjects[parseInt(i.toString(), 10)].id].wrapper;
                        if (!isNullOrUndefined(renderElement)) {
                            refreshDiagramElements(diagramLayer, [renderElement], this.renderer);
                        }
                    }
                } else {
                    renderElement = (this.pdfViewer.nameTable as any)[uniqueObjects[parseInt(i.toString(), 10)].id].wrapper;
                    const uniqueObjectId: string = uniqueObjects[parseInt(i.toString(), 10)].id;
                    const uniqueObject: any = (this.pdfViewer.nameTable as any)[`${uniqueObjectId}`];
                    if ((renderElement && this.shouldRefreshElement(uniqueObject)) ||
                    isNullOrUndefined(this.pdfViewer.formDesignerModule)) {
                        if (!isNullOrUndefined(uniqueObject.properties.data) && uniqueObject.properties.data.includes('base64')) {
                            const image: HTMLImageElement = new Image();
                            image.src = uniqueObject.properties.data;
                            if ((<any>window).customStampCollection == null && (<any>window).customStampCollection === undefined) {
                                (<any>window).customStampCollection = new Map();
                            }
                            if ((<any>window).customStampCollection && !(<any>window).customStampCollection.get(renderElement.id)) {
                                (<any>window).customStampCollection.set(renderElement.id, image);
                            }
                        }
                        else if (!isNullOrUndefined(uniqueObject.properties.value) && uniqueObject.properties.value.includes('base64')) {
                            const image: HTMLImageElement = new Image();
                            image.src = uniqueObject.properties.value;
                            if ((<any>window).signatureCollection == null && (<any>window).signatureCollection === undefined) {
                                (<any>window).signatureCollection = new Map();
                            }
                            if ((<any>window).signatureCollection && !(<any>window).signatureCollection.get(renderElement.id)) {
                                (<any>window).signatureCollection.set(renderElement.id, image);
                            }
                        }
                        if ((renderElement as any).children[1] instanceof TextElement) {
                            (renderElement as any).children[1].isEJ2 = true;
                        }
                        refreshDiagramElements(diagramLayer, [renderElement], this.renderer);
                    }
                }
            }
        }
    }

    private shouldRefreshElement(uniqueObject: any): boolean {
        const parentObject: any = (this.pdfViewer.nameTable as any)[uniqueObject.id.split('_')[0]];

        return (
            (!isNullOrUndefined(parentObject) && uniqueObject.visibility === 'visible') ||
            (!isNullOrUndefined(uniqueObject.subject) && uniqueObject.annotName !== 'SignatureField' && isNullOrUndefined(uniqueObject.visibility)) ||
            (uniqueObject.propName === 'annotations' &&
                uniqueObject.shapeAnnotationType !== 'Path' &&
                uniqueObject.shapeAnnotationType !== 'SignatureText' &&
                uniqueObject.shapeAnnotationType !== 'SignatureImage') ||
            (uniqueObject.shapeAnnotationType === 'SignatureImage' &&
                uniqueObject.propName !== 'formFields') ||
            (uniqueObject.shapeAnnotationType === 'SignatureText' &&
                uniqueObject.propName !== 'formFields') || (isNullOrUndefined(parentObject) && uniqueObject.id === 'diagram_helper')
        );
    }

    /**
     * @private
     * @param {number} index - Specified the page index.
     * @returns {void}
     */
    public clearHighlighter(index?: number): void {
        const adornerSvg: SVGElement = this.getAdornerLayerSvg(this.pdfViewer.element.id + index + '_diagramAdornerLayer', index);
        if (adornerSvg) {
            const highlighter: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_highlighter') as SVGElement;
            if (highlighter) {
                highlighter.parentNode.removeChild(highlighter);
            }
        }
    }

    /**
     * @private
     * @param {string} diagramId - Specified the diagram id.
     * @param {number} index - Specified the page index.
     * @returns {SVGSVGElement} Return the svg element.
     */
    public getSelectorElement(diagramId: string, index?: number): SVGElement {
        let adornerLayer: SVGElement = null;
        const adornerSvg: SVGSVGElement = this.getAdornerLayerSvg(diagramId, index);
        if (adornerSvg) {
            adornerLayer = adornerSvg.getElementById(diagramId + index + '_SelectorElement') as SVGElement;
        }
        return adornerLayer;
    }

    /**
     * @private
     * @param {string} diagramId - Specified the diagram id.
     * @param {number} index - Specified the page index.
     * @returns {SVGSVGElement} Return the svg element.
     */
    public getAdornerLayerSvg(diagramId: string, index?: number): SVGSVGElement {
        let adornerLayerSvg: SVGSVGElement = null;
        let diagramElement: HTMLElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
        if (isNullOrUndefined(diagramElement)) {
            this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', index);
            diagramElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
        }
        let elementcoll: any;
        if (diagramElement) {
            elementcoll = diagramElement.getElementsByClassName('e-adorner-layer' + index);
            adornerLayerSvg = elementcoll[0] as SVGSVGElement;
        }
        return adornerLayerSvg;
    }

    /**
     * @private
     * @param {number} index - Specified the page index.
     * @returns {void}
     */
    public clearSelectorLayer(index?: number): void {
        const adornerSvg: SVGElement = this.getAdornerLayerSvg(this.pdfViewer.element.id, index);
        if (adornerSvg) {
            const selectionRect: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(this.pdfViewer.adornerSvgLayer.id + '_selected_region') as SVGElement;
            if (selectionRect) {
                selectionRect.parentNode.removeChild(selectionRect);
            }
            this.clearHighlighter(index);
            const childNodes: NodeList = this.getSelectorElement(this.pdfViewer.element.id, index).childNodes;
            let child: SVGElement;
            for (let i: number = childNodes.length; i > 0; i--) {
                child = childNodes[i - 1] as SVGElement;
                child.parentNode.removeChild(child);
            }
        }
    }

    /**
     * @private
     * @param {number} select - Specified the select value.
     * @param {AnnotationSelectorSettingsModel} currentSelector - Specified the annotation selector element.
     * @param {PdfAnnotationBaseModel} helper - Specified the annotation helper element.
     * @param {boolean} isSelect - Specified the is select or not.
     * @returns {void}
     */
    public renderSelector(select?: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel,
                          isSelect?: boolean): void {
        if (!helper || isSelect) {
            const size: Size = new Size();
            const selectorModel: Selector = this.pdfViewer.selectedItems as Selector;
            this.clearSelectorLayer(select);
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.isRedactAnnotSelected = false;
            }
            if (selectorModel.wrapper) {
                if (selectorModel.wrapper.children[1] instanceof TextElement) {
                    selectorModel.wrapper.children[1].isEJ2 = true;
                    if (selectorModel.annotations[0].shapeAnnotationType === 'FreeText') {
                        selectorModel.wrapper.children[1].isFreeText = true;
                    }
                }
                selectorModel.wrapper.measure(size);
                const zoom: number = this.pdfViewer.viewerBase.getZoomFactor();
                selectorModel.wrapper.arrange(selectorModel.wrapper.desiredSize);
                selectorModel.width = selectorModel.wrapper.actualSize.width;
                selectorModel.height = selectorModel.wrapper.actualSize.height;
                selectorModel.offsetX = selectorModel.wrapper.offsetX;
                selectorModel.offsetY = selectorModel.wrapper.offsetY;
                if (selectorModel.annotations.length === 1) {
                    selectorModel.rotateAngle = selectorModel.annotations[0].rotateAngle;
                    selectorModel.wrapper.rotateAngle = selectorModel.annotations[0].rotateAngle;
                    //selectorModel.pivot = selectorModel.annotations[0].pivot;
                }
                let selectorElement: (any);
                if (selectorModel.formFields.length) {
                    for (let i: number = 0; i < selectorModel.formFields.length; i++) {
                        const node: PdfAnnotationBaseModel = selectorModel.formFields[parseInt(i.toString(), 10)];
                        selectorElement = this.getSelectorElement(this.pdfViewer.element.id, select);
                        if (selectorElement && node.pageIndex === select && this.pdfViewer.designerMode) {
                            this.renderResizeHandle(
                                node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom,
                                undefined, undefined, undefined, false, true, null, null, currentSelector);
                        }
                        if (this.pdfViewer.formDesignerModule && node.formFieldAnnotationType) {
                            if (!this.pdfViewer.viewerBase.isFormFieldSelect && !this.pdfViewer.viewerBase.isFormFieldMouseDown &&
                                 !this.pdfViewer.viewerBase.isFormFieldMouseMove) {
                                this.pdfViewer.viewerBase.isFormFieldSelect = true;
                                const field: any = {
                                    name: (node as any).name, id: (node as any).id, value: (node as any).value,
                                    fontFamily: node.fontFamily, fontSize: node.fontSize, fontStyle: (node as any).fontStyle,
                                    color: (node as PdfFormFieldBaseModel).color,
                                    backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor,
                                    alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: (node as any).isReadonly,
                                    visibility: (node as any).visibility,
                                    maxLength: (node as any).maxLength, isRequired: (node as any).isRequired,
                                    isPrint: node.isPrint, rotation: (node as any).rotateAngle, tooltip: (node as any).tooltip,
                                    options: (node as any).options, isChecked: (node as any).isChecked,
                                    isSelected: (node as any).isSelected, bounds: (node as any).bounds,
                                    pageNumber: (node as any).pageIndex, insertSpaces: (node as any).insertSpaces,
                                    formFieldAnnotationType: (node as any).formFieldAnnotationType,
                                    customData : (node as any).customData, borderColor: (node as any).borderColor,
                                    thickness: (node as any).thickness, isTransparent: (node as any).isTransparent
                                };
                                if (!this.pdfViewer.formDesignerModule.isFormFieldSizeUpdated) {
                                    this.pdfViewer.fireFormFieldSelectEvent('formFieldSelect', field as IFormField, node.pageIndex, this.pdfViewer.formDesignerModule.isProgrammaticSelection);
                                }
                                this.pdfViewer.formDesignerModule.isFormFieldSizeUpdated = false;
                            }
                        }
                    }
                }
                if (selectorModel.annotations.length) {
                    for (let j: number = 0; j < selectorModel.annotations.length; j++) {
                        const node: PdfAnnotationBaseModel = selectorModel.annotations[parseInt(j.toString(), 10)];
                        selectorElement = this.getSelectorElement(this.pdfViewer.element.id, select);
                        if (selectorElement && node.pageIndex === select) {
                            if (node.shapeAnnotationType === 'Distance' || node.shapeAnnotationType === 'Line' ||
                                node.shapeAnnotationType === 'LineWidthArrowHead' || node.shapeAnnotationType === 'Polygon') {
                                this.renderEndPointHandle(
                                    node, selectorElement, selectorModel.thumbsConstraints,
                                    { scale: zoom, tx: 0, ty: 0 }, undefined,
                                    undefined,
                                    true, currentSelector);
                            } else {
                                if (node.shapeAnnotationType === 'StickyNotes') {
                                    this.renderResizeHandle(
                                        node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom,
                                        undefined, undefined, undefined, false, true, null, null, currentSelector);
                                } else {
                                    if (this.pdfViewer.tool !== 'Stamp') {
                                        const isSignature: any = node.shapeAnnotationType === 'Path' || node.formFieldAnnotationType === 'SignatureField' || node.formFieldAnnotationType === 'InitialField';
                                        this.renderResizeHandle(
                                            node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom,
                                            undefined, undefined, undefined, node.shapeAnnotationType === 'Stamp', false, isSignature, (node.shapeAnnotationType === 'FreeText' || node.shapeAnnotationType === 'HandWrittenSignature' || node.shapeAnnotationType === 'SignatureImage' || node.shapeAnnotationType === 'Image' || node.shapeAnnotationType === 'SignatureText'), currentSelector);
                                    }
                                }
                            }
                            if (!this.pdfViewer.viewerBase.isNewSignatureAdded && (node.shapeAnnotationType === 'HandWrittenSignature' || node.shapeAnnotationType === 'SignatureText' || node.shapeAnnotationType === 'SignatureImage')) {
                                this.pdfViewer.annotationModule.selectSignature(node.signatureName, node.pageIndex, node);
                            }
                            if (this.pdfViewer.formDesignerModule && node.formFieldAnnotationType) {
                                if (!this.pdfViewer.viewerBase.isFormFieldSelect && !this.pdfViewer.viewerBase.isFormFieldMouseDown &&
                                     !this.pdfViewer.viewerBase.isFormFieldMouseMove) {
                                    this.pdfViewer.viewerBase.isFormFieldSelect = true;
                                    const field: any = {
                                        value: (node as any).value, fontFamily: node.fontFamily, fontSize: node.fontSize,
                                        fontStyle: (node as any).fontStyle,
                                        color: (node as PdfFormFieldBaseModel).color,
                                        backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor,
                                        alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: (node as any).isReadonly,
                                        visibility: (node as any).visibility,
                                        maxLength: (node as any).maxLength, isRequired: (node as any).isRequired,
                                        isPrint: node.isPrint, rotation: (node as any).rotateAngle, tooltip: (node as any).tooltip,
                                        options: (node as any).options, isChecked: (node as any).isChecked,
                                        isSelected: (node as any).isSelected, bounds: (node as any).bounds
                                    };
                                    if (!this.pdfViewer.formDesignerModule.isFormFieldSizeUpdated) {
                                        this.pdfViewer.fireFormFieldSelectEvent('formFieldSelect', field as IFormField, node.pageIndex, this.pdfViewer.formDesignerModule.isProgrammaticSelection);
                                    }
                                    this.pdfViewer.formDesignerModule.isFormFieldSizeUpdated = false;
                                }
                            }
                            if ((node.annotName !== '' || node.signatureName === 'ink') && node.annotName !== 'SignatureText') {
                                if (helper && (node === helper) && !node.formFieldAnnotationType) {
                                    if (!this.pdfViewer.viewerBase.isAddComment && !this.pdfViewer.viewerBase.isAnnotationSelect &&
                                         !this.pdfViewer.viewerBase.isAnnotationMouseDown &&
                                          !this.pdfViewer.viewerBase.isAnnotationMouseMove && !this.pdfViewer.viewerBase.isInkAdded &&
                                           !this.pdfViewer.viewerBase.isNewStamp) {
                                        this.pdfViewer.viewerBase.isAnnotationSelect = true;
                                        this.pdfViewer.annotationModule.annotationSelect(node.annotName, node.pageIndex, node);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Rotates the given nodes/connectors by the given angle
     *
     * @private
     * @param {PdfAnnotationBaseModel | SelectorModel} obj - Specified the objects to be rotated.
     * @param {number} angle - Specified the angle by which the objects have to be rotated.
     * @param {PointModel} pivot - Specified the reference point with reference to which the objects have to be rotated.
     * @param {AnnotationSelectorSettingsModel} currentSelector - Specified the current selector value.
     * @returns {void}
     */
    public rotate(obj: PdfAnnotationBaseModel | SelectorModel, angle: number, pivot?: PointModel,
                  currentSelector?: AnnotationSelectorSettingsModel): boolean {
        let checkBoundaryConstraints: boolean;
        if (obj) {
            pivot = pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
            if (obj instanceof Selector) {
                obj.rotateAngle += angle;
                obj.wrapper.rotateAngle += angle;
                let objects: PdfAnnotationBaseModel[] = [];
                objects = objects.concat(obj.annotations);
                this.rotateObjects(obj, objects, angle, pivot, null, currentSelector);
            } else {
                this.rotateObjects(obj as PdfAnnotationBaseModel, [obj] as (PdfAnnotationBaseModel)[], angle, pivot);
            }
        }
        return checkBoundaryConstraints;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel | SelectorModel} parent - Specified the annotation object.
     * @param {PdfAnnotationBaseModel[]} objects - Specified the annotation objects.
     * @param {number} angle - Specified the annotation angle.
     * @param {PointModel} pivot - Specified the pivot value.
     * @param {boolean} includeParent - Specified the include parent value.
     * @param {AnnotationSelectorSettingsModel} currentSelector - Specified the current selector value.
     * @returns {void}
     */
    public rotateObjects(
        parent: PdfAnnotationBaseModel | SelectorModel, objects: PdfAnnotationBaseModel[], angle: number, pivot?: PointModel,
        includeParent?: boolean, currentSelector?: AnnotationSelectorSettingsModel): void {
        pivot = pivot || {};
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivot.x, pivot.y);
        for (const obj of objects) {
            if (obj instanceof PdfAnnotationBase) {
                if (includeParent !== false || parent !== obj) {
                    obj.rotateAngle += angle;
                    obj.rotateAngle = (obj.rotateAngle + 360) % 360;
                    const newOffset: PointModel = transformPointByMatrix(matrix, { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY });
                    obj.wrapper.offsetX = newOffset.x;
                    obj.wrapper.offsetY = newOffset.y;
                    this.nodePropertyChange(obj, { rotateAngle: obj.rotateAngle });
                }
                this.renderSelector(obj.pageIndex, currentSelector);

            }
        }
    }

    private getParentSvg(element: DrawingElement, targetElement?: string, canvas?: HTMLCanvasElement | SVGElement): SVGElement {
        if (element && element.id) {
            if (targetElement && targetElement === 'selector') {
                return this.pdfViewer.adornerSvgLayer;
            }
        }
        return canvas as SVGSVGElement;
    }

    private shownBorder(): boolean {
        let isSelectInAllowed: boolean = false;
        if (this.pdfViewer.annotationModule) {
            const annotation: any = this.pdfViewer.selectedItems.annotations[0];
            const allowedInteraction: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            const isLock: boolean = this.pdfViewer.annotationModule.checkIsLockSettings(annotation);
            isSelectInAllowed = !isNullOrUndefined(allowedInteraction) && (allowedInteraction.includes('Select') || !isLock);
        }
        return isSelectInAllowed;
    }

    /**
     * @private
     * @param {DrawingElement} selector - Specified the annotation selector object.
     * @param {HTMLCanvasElement | SVGElement} canvas - Specified the canvas element.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {Transforms} transform - Specfied the transform value.
     * @param {number} enableNode - Specified the node number.
     * @param {boolean} isBorderTickness - Specified is thickness or not.
     * @param {boolean} isSwimlane - Specified is swimlane annotation or not.
     * @param {boolean} isSticky - Specified is sticky annotation or not.
     * @returns {void}
     */
    public renderBorder(selector: DrawingElement, canvas: HTMLCanvasElement | SVGElement, currentSelector?: any,
                        transform?: Transforms, enableNode?: number, isBorderTickness?: boolean,
                        isSwimlane?: boolean, isSticky?: boolean): void {
        const wrapper: DrawingElement = selector;
        const options: BaseAttributes = getBaseShapeAttributes(wrapper, transform);
        transform = transform || { scale: 1, tx: 0, ty: 0 };
        if (!isSticky) {
            options.x *= transform.scale;
            options.y *= transform.scale;
            options.width *= transform.scale;
            options.height *= transform.scale;
            options.fill = 'transparent';
            const shapeType: PdfAnnotationBaseModel =
             this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel;
            if (currentSelector && (typeof (currentSelector) !== 'object') && currentSelector !== '') {
                const annotationSelector: any = JSON.parse(currentSelector);
                const borderColor: string = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
                options.stroke = borderColor;
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
                let lineDash: number[] = annotationSelector.selectorLineDashArray.length === 0 ?
                    [6, 3] : annotationSelector.selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                options.dashArray = lineDash.toString();
            } else if (currentSelector && currentSelector !== '') {
                const borderColor: string = currentSelector.selectionBorderColor === '' ? 'black' : currentSelector.selectionBorderColor;
                options.stroke = borderColor;
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : currentSelector.selectionBorderThickness;
                let lineDash: number[] = (!isNullOrUndefined(currentSelector.selectorLineDashArray) &&
                (currentSelector.selectorLineDashArray.length === 0)) ? [6, 3] : currentSelector.selectorLineDashArray;
                if (!isNullOrUndefined(lineDash) && lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                if (!isNullOrUndefined(lineDash)) {
                    options.dashArray = lineDash.toString();
                }
            } else {
                if (!this.pdfViewer.designerMode) {
                    if ((shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') || shapeType === 'Ink') {
                        const formField: any = (this.pdfViewer.nameTable as any)[selector.id.split('_')[0]];
                        const isFormFieldSign: boolean = this.pdfViewer.viewerBase.checkSignatureFormField(selector.id);
                        // if (isFormFieldSign && options.width + 21 !== formField.bounds.width && options.height + 21 !== formField.bounds.height) {
                        //     if (this.pdfViewer.signatureFitMode === 'Default') {
                        //         let selectorBounds: any = this.pdfViewer.formFieldsModule.getDefaultBoundsforSign(formField.bounds);
                        //         options.x = selectorBounds.x; options.y = selectorBounds.y; options.width = selectorBounds.width; options.height = selectorBounds.height;
                        //     } else {
                        //         options.x = formField.bounds.x; options.y = formField.bounds.y; options.width = formField.bounds.width; options.height = formField.bounds.height;
                        //     }
                        // }
                        this.getSignBorder(shapeType, options, isFormFieldSign);
                    } else {
                        this.getBorderSelector(shapeType, options);
                    }
                }
            }
            options.class = 'e-pv-diagram-border';
            if (isSwimlane) {
                options.class += ' e-diagram-lane';
            }
            options.id = 'borderRect';
            options.id = 'borderRect';
            if (!enableNode) {
                options.class += ' e-disabled';
            }
            if (isBorderTickness) {
                options.class += ' e-thick-border';
            }
            (options as RectAttributes).cornerRadius = 0;
        } else {
            options.x *= transform.scale;
            options.y *= transform.scale;
            options.width *= transform.scale;
            options.height *= transform.scale;
            const shapeType: PdfAnnotationBaseModel | PdfFormFieldBaseModel =
             this.pdfViewer.selectedItems.annotations.length > 0 ?
                 this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel
                 : this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType as PdfFormFieldBaseModel;
            if (currentSelector && (typeof (currentSelector) !== 'object') && currentSelector !== '') {
                const annotationSelector: AnnotationSelectorSettingsModel = JSON.parse(currentSelector);
                const borderColor: string = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
                options.stroke = borderColor;
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
                let lineDash: number[] = annotationSelector.selectorLineDashArray.length === 0 ?
                    [6, 3] : annotationSelector.selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                options.dashArray = lineDash.toString();
            } else if (currentSelector && currentSelector !== '') {
                const borderColor: string = currentSelector.selectionBorderColor === '' ? 'black' : currentSelector.selectionBorderColor;
                options.stroke = borderColor;
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : currentSelector.selectionBorderThickness;
                let lineDash: number[] = (!isNullOrUndefined(currentSelector.selectorLineDashArray) &&
                (currentSelector.selectorLineDashArray.length === 0)) ? [6, 3] : currentSelector.selectorLineDashArray;
                if (!isNullOrUndefined(lineDash) && lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                if (!isNullOrUndefined(lineDash)) {
                    options.dashArray = lineDash.toString();
                }
            } else {
                this.getBorderSelector(shapeType, options);
            }
        }
        const checkBorder: boolean = this.shownBorder();
        if (checkBorder){
            const parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector') as SVGSVGElement;

            this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes,
                                           this.pdfViewer.element.id, undefined, true, parentSvg);
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotation object.
     * @param {BaseAttributes} options - Specified the options value.
     * @param {boolean} isFormFieldSign - Specified is form field sign or not.
     * @returns {void}
     */
    public getSignBorder(type: any, options: BaseAttributes, isFormFieldSign?: boolean): void {
        if (!isFormFieldSign && (type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            const thickness: number = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.
                annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.handWrittenSignatureSettings.
                    annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.
                annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.handWrittenSignatureSettings.
                annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.handWrittenSignatureSettings.
                    annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            const thickness: number = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.
                selectionBorderThickness) ? 1 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.
                selectorLineDashArray) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.
                selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.
                    selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else {
            const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            const borderColor: string = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
            options.stroke = borderColor;
            options.strokeWidth = annotationSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
            let lineDash: number[] = annotationSelector.selectorLineDashArray.length === 0 ?
                [6, 3] : annotationSelector.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotation object.
     * @param {BaseAttributes} options - Specified the base attributes.
     * @returns {void}
     */
    public getBorderSelector(type: PdfAnnotationBaseModel, options: BaseAttributes): void {
        const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        const borderColor: string = isNullOrUndefined(annotationSelector.selectionBorderColor) || annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
        options.stroke = borderColor;
        options.strokeWidth = isNullOrUndefined(annotationSelector.selectionBorderThickness) ||
         annotationSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
        let lineDash: number[] = isNullOrUndefined(annotationSelector.selectorLineDashArray) ||
         annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
        if (lineDash.length > 2) {
            lineDash = [lineDash[0], lineDash[1]];
        }
        options.dashArray = lineDash.toString();
        if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ?  'black' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray  ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray :  this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if ((type === 'Textbox' || type === 'Checkbox' || type === 'RadioButton' || type === 'SignatureField' || type === 'InitialField' || type === 'DropdownList' || type === 'ListBox' || type === 'PasswordField') && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor)) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor : 'black';
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness)) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness : 1;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray)) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray : [4];
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor)) ? this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor : 'black';
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderThickness)) ? this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderThickness : 1;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray)) ? this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray : [4];
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor)) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor : 'black';
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderThickness)) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderThickness : 1;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray)) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray : [4];
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor)) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor : 'black';
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderThickness)) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderThickness : 1;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray)) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray : [4];
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'StickyNotes' && this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : (!isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor)) ? this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor : 'black';
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : (!isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderThickness)) ? this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderThickness : 1;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [6, 3] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray : (!isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray)) ? this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray : [4];
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if ((type === 'Stamp' || type === 'Image') && this.pdfViewer.stampSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.annotationSelectorSettings.selectionBorderColor ? this.pdfViewer.annotationSelectorSettings.selectionBorderColor : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor)) ? this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor : '#0000ff';
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.annotationSelectorSettings.selectionBorderThickness ? this.pdfViewer.annotationSelectorSettings.selectionBorderThickness : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderThickness)) ? this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderThickness : 1;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.annotationSelectorSettings.selectorLineDashArray ? this.pdfViewer.annotationSelectorSettings.selectorLineDashArray : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray)) ? this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray : [4];
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        }
    }

    /**
     * @private
     * @param {string} id - Specified the annotaion id.
     * @param {DrawingElement} selector - Specified the drawing element.
     * @param {number} cx - Specified the cx number.
     * @param {number} cy - Specified the cy number.
     * @param {HTMLCanvasElement | SVGElement} canvas - Specified the html canvas element.
     * @param {boolean} visible - Specified the annotation visible or not.
     * @param {number} enableSelector - Specified the enable selector value.
     * @param {Transforms} t - Specified the transforms value.
     * @param {boolean} connected - Specified is connected or not.
     * @param {boolean} canMask - Specified is mask or not.
     * @param {object} ariaLabel - Specified the aria label object.
     * @param {number} count - Specified the count value.
     * @param {string} className - Specified the class name.
     * @param {AnnotationSelectorSettingsModel} currentSelector - Specified the annotation selector settings.
     * @returns {void}
     */
    public renderCircularHandle(
        id: string, selector: DrawingElement, cx: number, cy: number, canvas: HTMLCanvasElement | SVGElement,
        visible: boolean, enableSelector?: number, t?: Transforms, connected?: boolean, canMask?: boolean,
        ariaLabel?: Object, count?: number, className?: string, currentSelector?: AnnotationSelectorSettingsModel)
        :
        void {
        const wrapper: DrawingElement = selector;
        let radius: number = 7;
        let newPoint: PointModel = { x: cx, y: cy };
        t = t || { scale: 1, tx: 0, ty: 0 };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        const options: CircleAttributes = getBaseShapeAttributes(wrapper) as CircleAttributes;
        let shapeType: PdfAnnotationBaseModel;
        if (this.pdfViewer.selectedItems.annotations.length > 0 && this.pdfViewer.selectedItems.annotations[0].measureType) {
            shapeType = this.pdfViewer.selectedItems.annotations[0].measureType as PdfAnnotationBaseModel;
        } else if (this.pdfViewer.selectedItems.formFields.length > 0) {
            shapeType = this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType as PdfFormFieldBaseModel;
        } else {
            shapeType = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel;
        }
        this.getResizerColors(shapeType, options, currentSelector, t);
        this.getShapeSize(shapeType, options, currentSelector, t);
        options.strokeWidth = 1;
        if (count !== undefined) {
            radius = 5;
            options.id = 'segmentEnd_' + count;
        }
        options.centerX = (newPoint.x + t.tx) * t.scale;
        options.centerY = (newPoint.y + t.ty) * t.scale;
        options.angle = 0;
        options.id = id;
        options.visible = visible;
        options.class = className;
        options.opacity = 1;
        if (connected) {
            options.class += ' e-connected';
        }
        if (canMask) {
            options.visible = false;
        }
        options.x = (newPoint.x * t.scale) - (options.width / 2);
        options.y = (newPoint.y * t.scale) - (options.height / 2);
        const parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector') as SVGSVGElement;
        if (this.getShape(shapeType, currentSelector) === 'Square') {
            this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, id, undefined, true, parentSvg);
        } else if (this.getShape(shapeType, currentSelector) === 'Circle') {
            this.svgRenderer.drawCircle(canvas as SVGElement, options as CircleAttributes, 1);
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotaion object.
     * @param {CircleAttributes} options - Specified the circle attributes value.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {Transforms} t - Specified the transforms value.
     * @returns {void}
     */
    public getShapeSize(type: PdfAnnotationBaseModel, options: CircleAttributes, currentSelector: any, t?: Transforms): void {
        if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
            const annotationSelector: any = JSON.parse(currentSelector);
            options.radius = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize ===
             8 ? 8 : annotationSelector.resizerSize) / 2;
            options.width = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize ===
             8 ? 8 : annotationSelector.resizerSize) * t.scale;
            options.height = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize ===
             8 ? 8 : annotationSelector.resizerSize) * t.scale;
        }  else if (currentSelector && currentSelector !== '') {
            options.radius = (isNullOrUndefined(currentSelector.resizerSize) || currentSelector.resizerSize ===
             8 ? 8 : currentSelector.resizerSize) / 2;
            options.width = (isNullOrUndefined(currentSelector.resizerSize) || currentSelector.resizerSize ===
             8 ? 8 : currentSelector.resizerSize) * t.scale;
            options.height = (isNullOrUndefined(currentSelector.resizerSize) || currentSelector.resizerSize ===
             8 ? 8 : currentSelector.resizerSize) * t.scale;
        } else {
            const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            options.radius = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize ===
             8 ? 8 : annotationSelector.resizerSize) / 2;
            options.width = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize ===
             8 ? 8 : annotationSelector.resizerSize) * t.scale;
            options.height = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize ===
             8 ? 8 : annotationSelector.resizerSize) * t.scale;
            const currentType : string = typeof(type) === 'string' ? type : type.shapeAnnotationType;
            const settingsMap : any = {
                'Line': this.pdfViewer.lineSettings,
                'LineWidthArrowHead': this.pdfViewer.arrowSettings,
                'Rectangle': this.pdfViewer.rectangleSettings,
                'Ellipse': this.pdfViewer.circleSettings,
                'Distance': this.pdfViewer.distanceSettings,
                'Polygon': this.pdfViewer.polygonSettings,
                'Radius': this.pdfViewer.radiusSettings,
                'Area': this.pdfViewer.areaSettings,
                'Volume': this.pdfViewer.volumeSettings,
                'Ink': this.pdfViewer.inkAnnotationSettings,
                'Stamp': this.pdfViewer.stampSettings,
                'Image': this.pdfViewer.stampSettings,
                'FreeText': this.pdfViewer.freeTextSettings,
                'HandWrittenSignature': this.pdfViewer.handWrittenSignatureSettings,
                'SignatureText': this.pdfViewer.handWrittenSignatureSettings,
                'SignatureImage': this.pdfViewer.handWrittenSignatureSettings,
                'Perimeter': this.pdfViewer.perimeterSettings
            };
            const settings: any = settingsMap[`${currentType}`];
            if (settings && settings.annotationSelectorSettings) {
                const resizerSize: number = this.pdfViewer.annotationSelectorSettings.resizerSize || 8;
                const annotationResizerSize: number = settings.annotationSelectorSettings.resizerSize;
                options.radius = (annotationResizerSize && annotationResizerSize !== 8)
                    ? annotationResizerSize / 2 : resizerSize / 2;
                const resizerValue: number = (annotationResizerSize && annotationResizerSize !== 8)
                    ? annotationResizerSize * t.scale : resizerSize * t.scale;
                options.width = resizerValue;
                options.height = resizerValue;
            }
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotation object.
     * @param {any} currentSelector - Specified the current selector value.
     * @returns {AnnotationSelectorSettingsModel} - Specified the annotation selector settings model.
     */
    public getShape(type: PdfAnnotationBaseModel, currentSelector?: any): AnnotationSelectorSettingsModel {
        let shapeType: any;
        {
            if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
                const annotationSelector: any = JSON.parse(currentSelector);
                shapeType = isNullOrUndefined(annotationSelector.resizerShape) || annotationSelector.resizerShape === 'Square' ? 'Square' : annotationSelector.resizerShape;
            }  else if (currentSelector && currentSelector !== '') {
                shapeType = isNullOrUndefined(currentSelector.resizerShape) || currentSelector.resizerShape === 'Square' ? 'Square' : currentSelector.resizerShape;
            } else {
                const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
                shapeType = isNullOrUndefined(annotationSelector.resizerShape) || annotationSelector.resizerShape === 'Square' ? 'Square' : annotationSelector.resizerShape;
                if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if ((type === 'Stamp' || type === 'Image') && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape : 'Square';
                } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerShape) || this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square' ? this.pdfViewer.annotationSelectorSettings.resizerShape : (!isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape)) ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape : 'Square';
                }
            }
            return shapeType;
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotaion object.
     * @param {CircleAttributes} options - Specified the circle attributes value.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {Transforms} t - Specified the transforms value.
     * @returns {void}
     */
    public getResizerColors(type: PdfAnnotationBaseModel, options: CircleAttributes, currentSelector?: any, t?: Transforms): void {
        if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
            const annotationSelector: any = JSON.parse(currentSelector);
            options.stroke = isNullOrUndefined(annotationSelector.resizerBorderColor) || annotationSelector.resizerBorderColor === 'black' ? 'black' : annotationSelector.resizerBorderColor;
            options.fill = isNullOrUndefined(annotationSelector.resizerFillColor) || annotationSelector.resizerFillColor === '#FF4081' ? '#FF4081' : annotationSelector.resizerFillColor;
        } else if (currentSelector && currentSelector !== '') {
            options.stroke = !isNullOrUndefined(currentSelector.resizerBorderColor) ? currentSelector.resizerBorderColor : 'black';
            options.fill = !isNullOrUndefined(currentSelector.resizerFillColor) ? currentSelector.resizerFillColor : '#FF4081';
        } else {
            const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            options.stroke = isNullOrUndefined(annotationSelector.resizerBorderColor) || annotationSelector.resizerBorderColor === 'black' ? 'black' : annotationSelector.resizerBorderColor;
            options.fill = isNullOrUndefined(annotationSelector.resizerFillColor) || annotationSelector.resizerFillColor === '#FF4081' ? '#FF4081' : annotationSelector.resizerFillColor;
            if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ?  this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ?  this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if ((type === 'Stamp' || type === 'Image') && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black' ? this.pdfViewer.annotationSelectorSettings.resizerBorderColor : (!isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor)) ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor : 'black';
                options.fill = isNullOrUndefined(this.pdfViewer.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081' ? this.pdfViewer.annotationSelectorSettings.resizerFillColor : (!isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) && !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor)) ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor : 'FF4081';
            }
        }
    }

    /**
     * @private
     * @param {DrawingElement} wrapper - Specified the drawing element.
     * @param {HTMLCanvasElement | SVGElement} canvas - Specified the canvas element.
     * @param {Transforms} transform - Specified the transform value.
     * @param {SelectorConstraints} selectorConstraints - Specified the selector constraints value.
     * @param {boolean} canMask - Specified the is mask or not.
     * @returns {void}
     */
    public renderRotateThumb(
        wrapper: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        let newPoint: PointModel;
        const top: number = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
        const left: number = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
        let pivotX: number = left + wrapper.pivot.x * wrapper.actualSize.width;
        let pivotY: number = top;
        pivotX = (pivotX + transform.tx) * transform.scale;
        pivotY = (pivotY + transform.ty) * transform.scale;
        newPoint = { x: pivotX, y: pivotY - 25 };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(
                matrix, wrapper.rotateAngle + wrapper.parentTransform,
                (transform.tx + wrapper.offsetX) * transform.scale, (transform.ty + wrapper.offsetY) * transform.scale);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        const options: CircleAttributes = getBaseShapeAttributes(wrapper) as CircleAttributes;
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.opacity = 1;
        options.fill = '#FF4081';
        options.centerX = newPoint.x;
        options.centerY = newPoint.y;
        options.radius = 4;
        options.angle = 0;
        options.visible = true;
        options.class = 'e-diagram-rotate-handle';
        options.id = 'rotateThumb';
        const checkBorder: boolean = this.shownBorder();
        if (checkBorder)
        {this.svgRenderer.drawCircle(canvas as SVGElement, options, ThumbsConstraints.Rotate, { 'aria-label': 'Thumb to rotate the selected object' }); }
        const circleHandle: Element = canvas.querySelector('#' + options.id);
        if (circleHandle) {
            circleHandle.setAttribute('role', 'separator');
        }
    }

    /**
     * @private
     * @param {DrawingElement} element - Specified the drawing element.
     * @param {HTMLCanvasElement | SVGElement} canvas - Specified the canvas element.
     * @param {ThumbsConstraints} constraints - Specified the thumbs constraints element.
     * @param {number} currentZoom - Specified the current zoom value.
     * @param {boolean} canMask - Specified the is mask or not.
     * @param {number} enableNode - Specified the node number.
     * @param {boolean} nodeConstraints - Specified the node constraints or not.
     * @param {boolean} isStamp - Specified is stamp or not.
     * @param {boolean} isSticky - Specified is sticky or not.
     * @param {boolean} isPath - Specified is path or not.
     * @param {boolean} isFreeText - Specified is free text or not.
     * @param {AnnotationSelectorSettingsModel} currentSelector - Specified the current selector settings value.
     * @returns {void}
     */
    public renderResizeHandle(
        element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints, currentZoom: number,
        canMask?: boolean, enableNode?: number,
        nodeConstraints?: boolean, isStamp?: boolean, isSticky?: boolean, isPath?: boolean, isFreeText?: boolean,
        currentSelector?: AnnotationSelectorSettingsModel)
        :
        void {
        const left: number = element.offsetX - element.actualSize.width * element.pivot.x;
        const top: number = element.offsetY - element.actualSize.height * element.pivot.y;
        const height: number = element.actualSize.height;
        const width: number = element.actualSize.width;
        const transform: Transforms = { scale: currentZoom, tx: 0, ty: 0 } as Transforms;
        if (isStamp) {
            this.renderPivotLine(element, canvas, transform);
            this.renderRotateThumb(element, canvas, transform);
        }
        if (isFreeText) {
            isStamp = true;
        }
        this.renderBorder(
            element, canvas, currentSelector, transform, enableNode, nodeConstraints, true, isSticky);
        const nodeWidth: number = element.actualSize.width * currentZoom;
        const nodeHeight: number = element.actualSize.height * currentZoom;
        const shapeType: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations.length > 0 ?
            this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel :
            this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType as PdfFormFieldBaseModel;
        let allowPermission: boolean = false;
        if (!this.pdfViewer.formDesignerModule) {
            const annotation: any = this.pdfViewer.selectedItems.annotations[0];
            const allowedInteraction: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            const isLock: boolean = this.pdfViewer.annotationModule.checkIsLockSettings(annotation);
            if ((isLock || annotation.annotationSettings.isLock) && this.getAllowedInteractions(allowedInteraction)) {
                allowPermission = true;
            }
            if (allowedInteraction[0] === 'Select'){
                allowPermission = false;
            }
        }
        let resizerLocation: AnnotationResizerLocation = this.getResizerLocation(shapeType, currentSelector);
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3 as AnnotationResizerLocation;
        }
        let isNodeShape: boolean = false;
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Redaction' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink')) {
            isNodeShape = true;
        }
        if (!this.pdfViewer.viewerBase.checkSignatureFormField(element.id) && !nodeConstraints && !isSticky &&
         !isPath && !allowPermission) {
            if (isStamp || (isNodeShape && (nodeWidth >= 40 && nodeHeight >= 40) &&
            (resizerLocation === 1 || resizerLocation === 3 as AnnotationResizerLocation))) {
                //Hide corners when the size is less than 40
                this.renderCircularHandle(
                    'resizeNorthWest', element, left, top, canvas, true,
                    constraints & ThumbsConstraints.ResizeNorthWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top left side direction' },
                    undefined, 'e-pv-diagram-resize-handle e-northwest', currentSelector);
                this.renderCircularHandle(
                    'resizeNorthEast', element, left + width, top, canvas, true,
                    constraints & ThumbsConstraints.ResizeNorthEast, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top right side direction' },
                    undefined, 'e-pv-diagram-resize-handle e-northeast', currentSelector);
                this.renderCircularHandle(
                    'resizeSouthWest', element, left, top + height, canvas, true,
                    constraints & ThumbsConstraints.ResizeSouthWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on bottom left side direction' },
                    undefined,
                    'e-pv-diagram-resize-handle e-southwest', currentSelector);
                this.renderCircularHandle(
                    'resizeSouthEast', element, left + width, top + height, canvas,
                    true, constraints & ThumbsConstraints.ResizeSouthEast, transform,
                    undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom right side direction' },
                    undefined,
                    'e-pv-diagram-resize-handle e-southeast', currentSelector);
            }
            if ((!isStamp && !isNodeShape) || (isNodeShape && (resizerLocation === 2 ||
                resizerLocation === 3 as AnnotationResizerLocation ||
                 (!(nodeWidth >= 40 && nodeHeight >= 40) && resizerLocation === 1)))) {
                this.renderCircularHandle(
                    'resizeNorth', element, left + width / 2, top, canvas,
                    true, constraints & ThumbsConstraints.ResizeNorth, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top side direction' }, undefined,
                    'e-pv-diagram-resize-handle e-north', currentSelector);
                this.renderCircularHandle(
                    'resizeSouth', element, left + width / 2, top + height, canvas,
                    true, constraints & ThumbsConstraints.ResizeSouth, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on bottom side direction' }, undefined,
                    'e-pv-diagram-resize-handle e-south', currentSelector);
                this.renderCircularHandle(
                    'resizeWest', element, left, top + height / 2, canvas, true,
                    constraints & ThumbsConstraints.ResizeWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on left side direction' }, undefined,
                    'e-pv-diagram-resize-handle e-west', currentSelector);
                this.renderCircularHandle(
                    'resizeEast', element, left + width, top + height / 2, canvas, true,
                    constraints & ThumbsConstraints.ResizeEast, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on right side direction' }, undefined,
                    'e-pv-diagram-resize-handle e-east', currentSelector);
            }
        }
        if ((shapeType === 'Textbox' || shapeType === 'Checkbox' || shapeType === 'RadioButton' || shapeType === 'SignatureField' || shapeType === 'InitialField' || shapeType === 'DropdownList' ||
            shapeType === 'ListBox' || shapeType === 'PasswordField')) {
            this.renderCircularHandle(
                'resizeNorth', element, left + width / 2, top, canvas,
                true, constraints & ThumbsConstraints.ResizeNorth, transform, undefined,
                canMask, { 'aria-label': 'Thumb to resize the selected object on top side direction' }, undefined,
                'e-pv-diagram-resize-handle e-north', currentSelector);
            this.renderCircularHandle(
                'resizeSouth', element, left + width / 2, top + height, canvas,
                true, constraints & ThumbsConstraints.ResizeSouth, transform, undefined,
                canMask, { 'aria-label': 'Thumb to resize the selected object on bottom side direction' }, undefined,
                'e-pv-diagram-resize-handle e-south', currentSelector);
            this.renderCircularHandle(
                'resizeWest', element, left, top + height / 2, canvas, true,
                constraints & ThumbsConstraints.ResizeWest, transform, undefined,
                canMask, { 'aria-label': 'Thumb to resize the selected object on left side direction' }, undefined,
                'e-pv-diagram-resize-handle e-west', currentSelector);
            this.renderCircularHandle(
                'resizeEast', element, left + width, top + height / 2, canvas, true,
                constraints & ThumbsConstraints.ResizeEast, transform, undefined,
                canMask, { 'aria-label': 'Thumb to resize the selected object on right side direction' }, undefined,
                'e-pv-diagram-resize-handle e-east', currentSelector);
        }
    }

    private getAllowedInteractions(allowedInteraction: any): boolean {
        if (allowedInteraction && allowedInteraction.length > 0) {
            for (let i: number = 0; i < allowedInteraction.length; i++) {
                if (allowedInteraction[0] !== 'None' && allowedInteraction[parseInt(i.toString(), 10)] === 'Resize') {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotation base model.
     * @param {any} currentSelector - Specified the current selector value
     * @returns {AnnotationResizerLocation} - Returns the annotation resizer location value.
     */
    public getResizerLocation(type: PdfAnnotationBaseModel, currentSelector?: any): AnnotationResizerLocation {
        let resizerLocation: any;
        {
            if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
                const annotationSelector: any = JSON.parse(currentSelector);
                resizerLocation = isNullOrUndefined(annotationSelector.resizerLocation) ||
                 annotationSelector.resizerLocation === 3 ? 3 : annotationSelector.resizerLocation;
            }  else if (currentSelector && currentSelector !== '') {
                resizerLocation = isNullOrUndefined(currentSelector.resizerLocation) ||
                 currentSelector.resizerLocation === 3 ? 3 : currentSelector.resizerLocation;
            } else {
                const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
                resizerLocation = isNullOrUndefined(annotationSelector.resizerLocation) ||
                 annotationSelector.resizerLocation === 3 ? 3 : annotationSelector.resizerLocation;
                if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation ===
                        3 ? 3 : (!isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings)
                        && !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Redaction' && this.pdfViewer.redactionSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.redactionSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.redactionSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.redactionSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.redactionSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.redactionSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Distance') {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation) ||
                     this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation ===
                      3 ? 3 : (!isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings)
                      && !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation) ||
                    this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation ===
                     3 ? 3 : (!isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings)
                     && !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.
                        annotationSelectorSettings.resizerLocation) || this.pdfViewer.handWrittenSignatureSettings.
                        annotationSelectorSettings.resizerLocation === 3 ? 3 : (!isNullOrUndefined(this.
                            pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings)
                            && !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.
                                annotationSelectorSettings.resizerLocation)) ? this.pdfViewer.
                                handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation : 3;
                } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                    resizerLocation = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation)
                    || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation ===
                     3 ? 3 : (!isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings)
                     && !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation))
                            ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation : 3;
                }
            }
            return resizerLocation;
        }
    }

    /**
     * @private
     * @param {DrawingElement} element - Specified the drawing element.
     * @param {HTMLCanvasElement | SVGAElement} canvas - Specified the canvas element.
     * @param {Transforms} transform - Specified the transform values.
     * @param {SelectorConstraints} selectorConstraints - Specified the selector constraints value.
     * @param {boolean} canMask - Specified is mask value or not.
     * @returns {void}
     */
    public renderPivotLine(
        element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        const wrapper: DrawingElement = element;
        const dashArray: string = '2,3';
        let visible: boolean = true;
        if (canMask) {
            visible = false;
        }
        const options: BaseAttributes = getBaseShapeAttributes(wrapper, transform);
        options.fill = 'None'; options.stroke = 'black'; options.strokeWidth = 1;
        options.dashArray = dashArray; options.visible = visible;
        const scale: number = transform.scale;
        options.x *= scale;
        options.y *= scale;
        options.width *= scale;
        options.height *= scale;
        options.id = 'pivotLine';
        options.class = 'e-diagram-pivot-line';
        const startPoint: PointModel = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: -20 };
        const endPoint: PointModel = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: 0 };
        (options as LineAttributes).startPoint = startPoint;
        (options as LineAttributes).endPoint = endPoint;
        const checkBorder: boolean = this.shownBorder();
        if (checkBorder)
        {this.svgRenderer.drawLine(canvas as SVGElement, options as LineAttributes); }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} selector - Specified the annotation element.
     * @param {HTMLCanvasElement | SVGAElement} canvas - Specified the canvas element.
     * @param {SelectorConstraints} constraints - Specified the selector constraints value.
     * @param {Transforms} transform - Specified the transform values.
     * @param {boolean} connectedSource - Specified is connected source or not.
     * @param {boolean} connectedTarget - Specified is connected target or not.
     * @param {boolean} isSegmentEditing - Specified is segment editing or not.
     * @param {AnnotationSelectorSettingsModel} currentSelector - Specified the current selector value.
     * @returns {void}
     */
    public renderEndPointHandle(
        selector: PdfAnnotationBaseModel, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints,
        transform: Transforms, connectedSource: boolean,
        connectedTarget?: boolean, isSegmentEditing?: boolean, currentSelector?: AnnotationSelectorSettingsModel): void {
        transform = transform || { tx: 0, ty: 0, scale: 1 };
        const sourcePoint: PointModel = selector.sourcePoint;
        const targetPoint: PointModel = selector.targetPoint;
        const wrapper: DrawingElement = selector.wrapper; let i: number;
        const checkBorder: boolean = this.shownBorder();
        if (checkBorder) {
            for (i = 0; i < selector.vertexPoints.length; i++) {
                const segment: PointModel = selector.vertexPoints[parseInt(i.toString(), 10)];
                this.renderCircularHandle(
                    ('segementThumb_' + (i + 1)), wrapper, segment.x, segment.y, canvas, true,
                    constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i, 'e-pv-diagram-resize-handle', currentSelector);
            }
        }
        let leaderCount: number = 0;
        if (selector.shapeAnnotationType === 'Distance') {
            for (i = 0; i < selector.wrapper.children.length; i++) {
                const segment: DrawingElement = selector.wrapper.children[parseInt(i.toString(), 10)];
                let newPoint1: PointModel;
                const angle: number = Point.findAngle(selector.sourcePoint, selector.targetPoint);
                if (segment.id.indexOf('leader') > -1) {
                    let center: PointModel = selector.wrapper.children[0].bounds.center;
                    if (leaderCount === 0) {
                        newPoint1 = { x: selector.sourcePoint.x, y: selector.sourcePoint.y - selector.leaderHeight };
                        center = sourcePoint;
                    } else {
                        newPoint1 = { x: selector.targetPoint.x, y: selector.targetPoint.y - selector.leaderHeight };
                        center = targetPoint;
                    }
                    const matrix: Matrix = identityMatrix();
                    rotateMatrix(matrix, angle, center.x, center.y);
                    if (checkBorder) {
                        const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                        this.renderCircularHandle(('leaderThumb_' + (i + 1)), wrapper, rotatedPoint.x, rotatedPoint.y, canvas, true, constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i, 'e-pv-diagram-resize-handle', currentSelector);
                    }
                    leaderCount++;
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public initSelectorWrapper(): void {
        const selectorModel: SelectorModel = this.pdfViewer.selectedItems;
        (selectorModel as Selector).init(this);
    }

    /**
     * @private
     * @param {string[]} objArray - Specified the annotation object array.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {boolean} multipleSelection - Specified the multiple selection or not.
     * @param {boolean} preventUpdate - Specified the prevent update or not.
     * @returns {void}
     */
    public select(objArray: string[], currentSelector?: any, multipleSelection?: boolean, preventUpdate?: boolean): void {
        const selectorModel: SelectorModel = this.pdfViewer.selectedItems;
        for (let i: number = 0; i < objArray.length; i++) {
            const obj: any = (this.pdfViewer.nameTable as any)[objArray[parseInt(i.toString(), 10)]];
            if (obj.formFieldAnnotationType && this.pdfViewer.designerMode) {
                selectorModel.formFields.push(obj);
                this.initSelectorWrapper();
                selectorModel.wrapper.children.push(obj.wrapper);
                this.renderSelector(obj.pageIndex, currentSelector, obj, true);
            } else if (obj && !obj.formFieldAnnotationType) {
                if (!(obj instanceof Selector) && obj.wrapper.visible && this.pdfViewer.annotationModule) {
                    let annotationSettings: any;
                    if (obj.annotationSettings) {
                        annotationSettings = obj.annotationSettings;
                        if (!isNullOrUndefined(annotationSettings) && !isNullOrUndefined(annotationSettings.isLock)) {
                            annotationSettings.isLock = JSON.parse(annotationSettings.isLock);
                        }
                    } else if (!obj.formFieldAnnotationType) {
                        annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(obj, true);
                        obj.annotationSettings = annotationSettings;
                    }
                    let isLock: boolean = !obj.formFieldAnnotationType ? (annotationSettings ? annotationSettings.isLock : false) : false;
                    if (annotationSettings && annotationSettings.isLock && this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                        isLock = false;
                    }
                    const isSign: boolean = obj.shapeAnnotationType === 'Path' || obj.shapeAnnotationType === 'SignatureText'
                        || obj.shapeAnnotationType === 'SignatureImage';
                    let isReadOnly: boolean = false;
                    this.pdfViewer.formFieldCollection.filter((field: any) => field.id === obj.id.split('_')[0])
                        .forEach((field: any) => isReadOnly = field.isReadonly);
                    if (!(isReadOnly && isSign)) {
                        selectorModel.annotations.push(obj);
                        const checkBorder: boolean = this.shownBorder();
                        if (checkBorder) {
                            this.initSelectorWrapper();
                            selectorModel.wrapper.rotateAngle = selectorModel.rotateAngle = 0;
                            selectorModel.wrapper.children.push(obj.wrapper);
                            if (!preventUpdate) {
                                this.renderSelector(obj.pageIndex, currentSelector, obj, true);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @private
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @param {number} pageIndex - Specified the page index value.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {PdfAnnotationBaseModel} helper - Specified the helper object.
     * @returns {boolean} - boolean value
     */
    public dragSelectedObjects(tx: number, ty: number, pageIndex: number, currentSelector: any, helper: PdfAnnotationBaseModel): boolean {
        const obj: SelectorModel | PdfAnnotationBaseModel = this.pdfViewer.selectedItems;
        this.drag(obj, tx, ty, currentSelector, helper);
        return true;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotaion object.
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {PdfAnnotationBaseModel} helper - Specified the helper object.
     * @returns {void}
     */
    public drag(obj: PdfAnnotationBaseModel | SelectorModel, tx: number, ty: number, currentSelector: any,
                helper: PdfAnnotationBaseModel): void {
        if (obj instanceof Selector) {
            if (obj.annotations.length) {
                for (const node of obj.annotations) {
                    this.drag(node, tx, ty, currentSelector, helper);
                    this.renderSelector(node.pageIndex, currentSelector, helper);
                }
            } else if (obj.formFields.length) {
                for (const node of obj.formFields) {
                    this.drag(node, tx, ty, currentSelector, helper);
                    this.renderSelector(node.pageIndex, currentSelector, helper);
                }
            }
        } else {
            this.dragAnnotation(obj as PdfAnnotationBaseModel, tx, ty);
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotaion object.
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @returns {void}
     */
    public dragAnnotation(obj: PdfAnnotationBaseModel, tx: number, ty: number): void {
        //bug (EJ2-62649) : fixed an issue with difficulty on moving/ resizing free text annotation that added in edge of viewer
        const newDiff: any = this.moveInsideViewer(obj, tx, ty);
        obj.wrapper.offsetX += newDiff.tx;
        obj.wrapper.offsetY += newDiff.ty;
        if (isLineShapes(obj) || obj.shapeAnnotationType === 'Polygon') {
            if (obj.wrapper.children.length) {
                const nodes: DrawingElement[] = obj.wrapper.children;
                for (let i: number = 0; i < nodes.length; i++) {
                    nodes[parseInt(i.toString(), 10)].offsetX += tx;
                    nodes[parseInt(i.toString(), 10)].offsetY += ty;
                }
            }
            this.dragControlPoint(obj, tx, ty, true);
        }
        this.nodePropertyChange(obj, { bounds: { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY } } as PdfAnnotationBaseModel);
        obj.wrapper.measureChildren = false;
        const canvas: HTMLElement = this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', (obj as any).pageIndex);
        this.pdfViewer.renderDrawing(canvas as HTMLCanvasElement, (obj as any).pageIndex);
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotaion object.
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @param {boolean} preventUpdate - Specified the prevent update or not.
     * @param {number} segmentNumber - Specified the segment value.
     * @returns {boolean} - Returns true or false.
     */
    public dragControlPoint(obj: PdfAnnotationBaseModel, tx: number, ty: number, preventUpdate?: boolean, segmentNumber?: number): boolean {
        const connector: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[obj.id];
        for (let i: number = 0; i < connector.vertexPoints.length; i++) {
            (connector.vertexPoints[parseInt(i.toString(), 10)]).x += tx;
            (connector.vertexPoints[parseInt(i.toString(), 10)]).y += ty;
        }
        if (!preventUpdate) {
            this.updateEndPoint(connector);
        }
        return true;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} connector - Specified the connector object.
     * @returns {void}
     */
    public updateEndPoint(connector: PdfAnnotationBaseModel): void {
        this.nodePropertyChange(connector, { vertexPoints: connector.vertexPoints } as PdfAnnotationBaseModel);
        this.renderSelector(connector.pageIndex);
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} actualObject - Specified the actual annotaion object.
     * @param {PdfAnnotationBaseModel} node - Specified the node annotation object.
     * @param {boolean} isNeedToRender - Specified to render drawing.
     * @returns {void}
     */
    public nodePropertyChange(
        actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel, isNeedToRender?: boolean): void {
        let updateConnector: boolean = false;
        let i: number; let update: boolean;
        if (node.bounds) {
            if (node.bounds.width !== undefined) {
                actualObject.bounds.width = actualObject.wrapper.width = node.bounds.width;
            }
            if (node.bounds.height !== undefined) {
                actualObject.bounds.height = actualObject.wrapper.height = node.bounds.height;
            }
            if (node.bounds.x !== undefined) {
                actualObject.bounds.x = node.bounds.x - (actualObject.bounds.width * 0.5);
                actualObject.wrapper.offsetX = node.bounds.x;
                update = true;
                updateConnector = true;
            }
            if (node.bounds.y !== undefined) {
                actualObject.bounds.y = node.bounds.y - (actualObject.bounds.height * 0.5);
                actualObject.wrapper.offsetY = node.bounds.y;
                update = true;
                updateConnector = true;
            }
            if (node.leaderHeight !== undefined) {
                actualObject.leaderHeight = node.leaderHeight;
                this.updateConnector(actualObject, actualObject.vertexPoints);
            }
            if (actualObject.wrapper.children.length) {
                const children: DrawingElement[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].id) {
                        const names: string[] = children[parseInt(i.toString(), 10)].id.split('_');
                        if (names.length && (names.indexOf('perimeter') > -1 || names.indexOf('radius') > -1)) {
                            this.setNodePosition(children[parseInt(i.toString(), 10)], actualObject);
                        } else if (names.length && (names.indexOf('srcDec') > -1)) {
                            children[parseInt(i.toString(), 10)].offsetX = actualObject.vertexPoints[0].x;
                            children[parseInt(i.toString(), 10)].offsetY = actualObject.vertexPoints[0].y;
                        } else if (names.length && names.indexOf('tarDec') > -1) {
                            children[parseInt(i.toString(), 10)].offsetX =
                             actualObject.vertexPoints[actualObject.vertexPoints.length - 1].x;
                            children[parseInt(i.toString(), 10)].offsetY =
                             actualObject.vertexPoints[actualObject.vertexPoints.length - 1].y;
                        } else if (names.length && (names.indexOf('stamp') > -1)) {
                            let ratio: number = 0;
                            let heightRatio: number = 2;
                            if (actualObject.wrapper.width !== undefined && actualObject.wrapper.height !== undefined) {
                                ratio = 20;
                                heightRatio = 2.9;
                            }
                            if (actualObject.isDynamicStamp) {
                                const element: any = children[1] as TextElement;
                                const iconElement: any = children[parseInt(i.toString(), 10)] as TextElement;
                                const annotationSettings: any = this.pdfViewer.stampSettings ?
                                    this.pdfViewer.stampSettings : this.pdfViewer.annotationSettings;
                                if (annotationSettings && (annotationSettings.maxHeight ||
                                     annotationSettings.maxWidth) && (actualObject.bounds.height > 60)) {
                                    if (ratio !== 0) {
                                        element.style.fontSize = (actualObject.bounds.width / ratio);
                                        iconElement.style.fontSize = (actualObject.bounds.width / ratio);
                                    } else {
                                        element.style.fontSize = (actualObject.wrapper.bounds.width / 20);
                                        iconElement.style.fontSize = (actualObject.wrapper.bounds.width / 20);
                                    }
                                } else {
                                    let targetWidth: number;
                                    let targetHeight: number;
                                    if (ratio !== 0) {
                                        targetWidth = actualObject.bounds.width;
                                        targetHeight = actualObject.bounds.height;
                                    }
                                    else {
                                        targetWidth = actualObject.wrapper.bounds.width;
                                        targetHeight = actualObject.wrapper.bounds.height;
                                    }
                                    let iconWidth: number = targetWidth;
                                    if (iconElement.content === 'REVISED' || iconElement.content === 'REVIEWED' || iconElement.content === 'RECEIVED' || iconElement.content === 'APPROVED') {
                                        iconWidth = iconWidth / 2;
                                    }
                                    else if (iconElement.content === 'CONFIDENTIAL' || iconElement.content === 'NOT APPROVED') {
                                        iconWidth = iconWidth * (3 / 4);
                                    }
                                    const elementPpadding: number = targetWidth * 0.02;
                                    const elementInnerWidth: number = Math.max(0, targetWidth - 2 * elementPpadding);
                                    const iconPadding: number = iconWidth * 0.02;
                                    const iconInnerWidth: number = Math.max(0, iconWidth - 2 * iconPadding);
                                    element.style.fontSize = this.
                                        fontSizeCalculation(actualObject, element, elementInnerWidth, element.content);
                                    iconElement.style.fontSize = this.
                                        fontSizeCalculation(actualObject, iconElement, iconInnerWidth, iconElement.content);
                                    const metrics: {
                                        width: number;
                                        height: number;
                                        ascent: number;
                                        descent: number;
                                    } = this.measureTextMetrics(actualObject, iconElement.content,
                                                                iconElement.style.fontSize, iconElement.style.fontFamily);
                                    const topOffset: number = (targetHeight * 0.75 - metrics.height) / 4;
                                    iconElement.margin.top = Math.max(0, topOffset);
                                    if (iconElement.content === 'CONFIDENTIAL' || iconElement.content === 'NOT APPROVED') {
                                        iconElement.margin.left = (targetWidth - (metrics.width * (4 / 3))) / 2;
                                    }
                                    else {
                                        iconElement.margin.left = (targetWidth - (metrics.width * 2)) / 2;
                                    }
                                    iconElement.desiredSize.width = metrics.width;
                                    iconElement.desiredSize.height = metrics.height;
                                    const elementMetrics: {
                                        width: number;
                                        height: number;
                                        ascent: number;
                                        descent: number;
                                    } = this.measureTextMetrics(actualObject, element.content,
                                                                element.style.fontSize, element.style.fontFamily);
                                    const bottomOffset: number = (targetHeight * 0.25 - elementMetrics.height) / 8;
                                    element.margin.bottom = Math.max(0, bottomOffset);
                                    if (element.margin.bottom < 1) {
                                        element.margin.bottom = 4;
                                    }
                                    element.margin.left = (targetWidth - elementMetrics.width) / 2;
                                    element.desiredSize.height = elementMetrics.height;
                                }
                            } else {
                                const element: any = children[parseInt(i.toString(), 10)] as TextElement;
                                const annotationSettings: any = this.pdfViewer.stampSettings ?
                                    this.pdfViewer.stampSettings : this.pdfViewer.annotationSettings;
                                if (annotationSettings && (annotationSettings.maxHeight ||
                                     annotationSettings.maxWidth) && (actualObject.bounds.height > 60)) {
                                    if (ratio !== 0) {
                                        element.style.fontSize = (actualObject.bounds.width / ratio);
                                    } else {
                                        element.style.fontSize = (actualObject.wrapper.bounds.width / 20);
                                    }
                                } else {
                                    let targetWidth: number;
                                    let targetHeight: number;
                                    if (ratio !== 0) {
                                        targetWidth = actualObject.bounds.width;
                                        targetHeight = actualObject.bounds.height;
                                    }
                                    else {
                                        targetWidth = actualObject.wrapper.bounds.width;
                                        targetHeight = actualObject.wrapper.bounds.height;
                                    }
                                    let paddingX: number = targetWidth * 0.04;
                                    if (element.content === 'DRAFT') {
                                        paddingX = targetWidth * 0.06;
                                    }
                                    const innerWidth: number = Math.max(0, targetWidth - 2 * paddingX);
                                    element.style.fontSize = this.
                                        fontSizeCalculation(actualObject, element, innerWidth, element.content);
                                    const metrics: {
                                        width: number;
                                        height: number;
                                        ascent: number;
                                        descent: number;
                                    } = this.measureTextMetrics(actualObject, element.content,
                                                                element.style.fontSize, element.style.fontFamily);
                                    const topOffset: number = (targetHeight - metrics.height) / 2;
                                    element.margin.top = Math.max(0, topOffset);
                                    const leftOffset: number = (targetWidth - metrics.width) / 2;
                                    element.margin.left = Math.max(0, leftOffset);
                                    element.desiredSize.width = metrics.width;
                                    element.desiredSize.height = metrics.height;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (node.sourceDecoraterShapes !== undefined) {
            actualObject.sourceDecoraterShapes = node.sourceDecoraterShapes;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.isReadonly !== undefined && actualObject.shapeAnnotationType === 'FreeText') {
            actualObject.isReadonly = node.isReadonly;
        }
        if (node.annotationSelectorSettings !== undefined) {
            actualObject.annotationSelectorSettings = node.annotationSelectorSettings;
        }
        if (node.taregetDecoraterShapes !== undefined) {
            actualObject.taregetDecoraterShapes = node.taregetDecoraterShapes; update = true;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.fillColor !== undefined) {
            actualObject.fillColor = node.fillColor;
            actualObject.wrapper.children[0].style.fill = node.fillColor;
            if ((actualObject.enableShapeLabel || actualObject.measureType) && actualObject.wrapper && actualObject.wrapper.children) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        if (actualObject.enableShapeLabel) {
                            actualObject.labelFillColor = node.fillColor;
                            children[parseInt(i.toString(), 10)].style.fill = node.fillColor;
                        }
                        if (actualObject.measureType) {
                            children[parseInt(i.toString(), 10)].style.fill = node.fillColor;
                        }
                    }
                }
            }
            update = true;
        }
        if (node.markerFillColor !== undefined) {
            actualObject.markerFillColor = node.markerFillColor;
            const fillColor: string = updateColorWithOpacity(node.markerFillColor, actualObject.markerOpacity as number);
            actualObject.wrapper.children[0].style.fill = fillColor;
        }
        if (node.markerBorderColor !== undefined) {
            actualObject.markerBorderColor = node.markerBorderColor;
            actualObject.wrapper.children[0].style.strokeColor = actualObject.markerBorderColor;
        }
        if (node.markerOpacity !== undefined) {
            actualObject.markerOpacity = node.markerOpacity;
            const fillColor: string = updateColorWithOpacity(actualObject.markerFillColor, actualObject.markerOpacity as number);
            actualObject.wrapper.children[0].style.fill = fillColor;
        }
        if (node.overlayText !== undefined) {
            actualObject.overlayText = node.overlayText;
        }
        if (actualObject.enableShapeLabel && node.labelFillColor !== undefined) {
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        actualObject.labelFillColor = node.labelFillColor;
                        children[parseInt(i.toString(), 10)].style.fill = node.labelFillColor;
                    }
                }
            }
        }
        if (node.opacity !== undefined) {
            if (actualObject.shapeAnnotationType === 'Stamp' || actualObject.shapeAnnotationType === 'FreeText') {
                actualObject.wrapper.children[1].style.opacity = node.opacity;
                if (actualObject.wrapper.children[2]) {
                    actualObject.wrapper.children[2].style.opacity = node.opacity;
                }
            } else {
                if (actualObject.shapeAnnotationType === 'StickyNotes') {
                    (this.pdfViewer.nameTable as any)[actualObject.annotName].wrapper.children[0].style.opacity = node.opacity;
                }
            }
            actualObject.opacity = node.opacity;
            actualObject.wrapper.children[0].style.opacity = node.opacity;
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        children[parseInt(i.toString(), 10)].style.opacity = node.labelOpacity;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (actualObject.enableShapeLabel && node.labelOpacity !== undefined) {
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        children[parseInt(i.toString(), 10)].style.opacity = node.labelOpacity;
                    }
                }
            }
        }
        if (node.rotateAngle !== undefined) {
            actualObject.rotateAngle = node.rotateAngle;
            actualObject.wrapper.rotateAngle = node.rotateAngle; update = true;
            updateConnector = true;
        }
        if (node.strokeColor !== undefined) {
            actualObject.strokeColor = node.strokeColor;
            actualObject.wrapper.children[0].style.strokeColor = node.strokeColor; update = true;
            if (actualObject.shapeAnnotationType === 'Radius' && actualObject.wrapper.children[1]) {
                actualObject.wrapper.children[1].style.strokeColor = node.strokeColor;
            }
            updateConnector = true;
        }
        if (node.fontColor !== undefined) {
            actualObject.fontColor = node.fontColor;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any[] = actualObject.wrapper.children;
                children[1].style.color = node.fontColor;
                if (actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                } else {
                    children[1].horizontalAlignment = 'Auto';
                }
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {

                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        children[parseInt(i.toString(), 10)].style.color = node.fontColor;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.fontFamily !== undefined) {
            actualObject.fontFamily = node.fontFamily;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any[] = actualObject.wrapper.children;
                children[1].style.fontFamily = node.fontFamily;
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        children[parseInt(i.toString(), 10)].style.fontFamily = node.fontFamily;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.fontSize !== undefined) {
            if ((actualObject.shapeAnnotationType === 'FreeText' || actualObject.shapeAnnotationType === 'SignatureText') && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any[] = actualObject.wrapper.children;
                children[1].style.fontSize = node.fontSize;
                if (actualObject.shapeAnnotationType === 'SignatureText') {
                    actualObject.wrapper.children[1].bounds.width = actualObject.bounds.width;
                    actualObject.wrapper.children[1].desiredSize.width = actualObject.bounds.width;
                    actualObject.wrapper.children[1].actualSize.width = actualObject.bounds.width;
                    children[1].horizontalAlignment = 'Center';
                    children[1].verticalAlignment = 'Center';
                    children[1].setOffsetWithRespectToBounds(0, 0, 'Absolute');
                }
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        children[parseInt(i.toString(), 10)].style.fontSize = node.fontSize;
                    }
                }
            }
            if (this.pdfViewer.enableToolbar && this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.updateFontSizeInIcon(node.fontSize);
            }
            else if (this.pdfViewer.annotationModule && actualObject.fontSize !== node.fontSize){
                this.pdfViewer.annotationModule.handleFontSizeUpdate(node.fontSize);
            }
            update = true;
            updateConnector = true;
        }
        if (node.font !== undefined) {
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any[] = actualObject.wrapper.children;
                if (node.font.isBold !== undefined) {
                    children[1].style.bold = node.font.isBold;
                    actualObject.font.isBold = node.font.isBold;
                }
                if (node.font.isItalic !== undefined) {
                    children[1].style.italic = node.font.isItalic;
                    actualObject.font.isItalic = node.font.isItalic;
                }
                if (node.font.isUnderline !== undefined) {
                    if (node.font.isUnderline) {
                        actualObject.font.isStrikeout = false;
                    }
                    if (node.font.isUnderline === true) {
                        children[1].style.textDecoration = 'Underline';
                    }
                    else {
                        if (!node.font.isStrikeout) {
                            children[1].style.textDecoration = 'None';
                        }
                    }
                    actualObject.font.isUnderline = node.font.isUnderline;
                }
                if (node.font.isStrikeout !== undefined) {
                    if (node.font.isStrikeout) {
                        actualObject.font.isUnderline = false;
                    }
                    if (node.font.isStrikeout === true) {
                        children[1].style.textDecoration = 'LineThrough';
                    }
                    else {
                        if (!node.font.isUnderline) {
                            children[1].style.textDecoration = 'None';
                        }
                    }
                    actualObject.font.isStrikeout = node.font.isStrikeout;
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.textAlign !== undefined) {
            const currentAnnotation: PdfAnnotationBaseModel =
            (!isNullOrUndefined(this.pdfViewer.selectedItems.annotations) && this.pdfViewer.selectedItems.annotations.length > 0) ?
                this.pdfViewer.selectedItems.annotations[0] : actualObject;
            const clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
            if (actualObject.textAlign !== node.textAlign) {
                actualObject.textAlign = node.textAlign;
                redoClonedObject.textAlign = node.textAlign;
                if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                    const children: any = actualObject.wrapper.children;
                    children[1].style.textAlign = node.textAlign;
                    if (children[1].childNodes.length >= 1) {
                        if (actualObject.textAlign === 'Justify') {
                            children[1].horizontalAlignment = 'Left';
                            children[1].setOffsetWithRespectToBounds(0, 0, null);
                        } else if (actualObject.textAlign === 'Right') {
                            children[1].horizontalAlignment = 'Right';
                            children[1].setOffsetWithRespectToBounds(1, 0, null);
                        } else if (actualObject.textAlign === 'Left') {
                            children[1].horizontalAlignment = 'Left';
                            children[1].setOffsetWithRespectToBounds(0, 0, null);
                        } else if (actualObject.textAlign === 'Center') {
                            children[1].horizontalAlignment = 'Center';
                            children[1].setOffsetWithRespectToBounds(0.51, 0, null);
                        }
                    } else {
                        children[1].horizontalAlignment = 'Auto';
                    }
                    if (!this.pdfViewer.annotation.isUndoRedoAction) {
                        this.pdfViewer.annotation.addAction(this.pdfViewer.viewerBase.getActivePage(false), null, currentAnnotation, 'textAlign', '', clonedObject, redoClonedObject);
                    }
                }
                update = true;
                updateConnector = true;
            }
        }
        if (node.thickness !== undefined) {
            actualObject.thickness = node.thickness;
            actualObject.wrapper.children[0].style.strokeWidth = node.thickness;
            if (actualObject.wrapper.children[1] && actualObject.wrapper.children[0].style.strokeColor !== '#ffffff00'
                && actualObject.wrapper.children[0].style.strokeColor !== 'transparent') {
                actualObject.wrapper.children[1].style.strokeWidth = node.thickness;
            }
            if (actualObject.shapeAnnotationType === 'Line' || actualObject.shapeAnnotationType === 'LineWidthArrowHead') {
                for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                    const child: any = actualObject.wrapper.children[parseInt(i.toString(), 10)];
                    if (child.id.includes('srcDec') || child.id.includes('tarDec')) {
                        child.width = 12 * node.thickness;
                        child.height = 12 * node.thickness;
                    }
                }
            }
            if (actualObject.shapeAnnotationType === 'Radius' && actualObject.wrapper.children[1]) {
                actualObject.wrapper.children[1].style.strokeWidth = node.thickness;
            }
            update = true;
            updateConnector = true;
        }
        if (node.borderDashArray !== undefined) {
            actualObject.borderDashArray = node.borderDashArray;
            actualObject.wrapper.children[0].style.strokeDashArray = node.borderDashArray;
        }
        if (node.borderStyle !== undefined) {
            actualObject.borderStyle = node.borderStyle;
        }
        if (node.author !== undefined) {
            actualObject.author = node.author;
        }
        if (node.modifiedDate !== undefined) {
            actualObject.modifiedDate = node.modifiedDate;
        }
        if (node.subject !== undefined) {
            actualObject.subject = node.subject;
        }
        if (node.vertexPoints !== undefined) {
            actualObject.vertexPoints = node.vertexPoints;
            (this.pdfViewer.nameTable as any)[actualObject.id].vertexPoints = node.vertexPoints;
            this.updateConnector(actualObject, node.vertexPoints);
        }
        if (node.leaderHeight !== undefined && actualObject.shapeAnnotationType !== 'Polygon') {
            actualObject.leaderHeight = node.leaderHeight;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.notes !== undefined) {
            actualObject.notes = node.notes;
        }
        if (node.annotName !== undefined) {
            actualObject.annotName = node.annotName;
        }
        if (actualObject.shapeAnnotationType === 'Distance') {
            for (i = 0; i < actualObject.wrapper.children.length; i++) {
                const segment: any = actualObject.wrapper.children[parseInt(i.toString(), 10)];
                const points: PointModel[] = getConnectorPoints(actualObject);
                if (segment.id.indexOf('leader1') > -1) {
                    this.setLineDistance(actualObject, points, segment, false);
                }
                if (segment.id.indexOf('leader2') > -1) {
                    this.setLineDistance(actualObject, points, segment, true);
                }
            }
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (actualObject.shapeAnnotationType === 'Polygon' && node.vertexPoints) {
            actualObject.data = getPolygonPath(actualObject.vertexPoints);
            const path: any = (actualObject.wrapper.children[0] as PathElement);
            path.data = actualObject.data;
            (path as PathElement).canMeasurePath = true;
        }
        if (isLineShapes(actualObject)) {
            for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                const childElement: any = actualObject.wrapper.children[parseInt(i.toString(), 10)];
                if (!childElement.textNodes) {
                    setElementStype(actualObject, actualObject.wrapper.children[parseInt(i.toString(), 10)]);
                }
                if (actualObject.enableShapeLabel === true) {
                    if (actualObject.wrapper.children[parseInt(i.toString(), 10)] instanceof TextElement) {
                        actualObject.wrapper.children[parseInt(i.toString(), 10)].style.fill = actualObject.labelFillColor;
                    }
                    if ((actualObject.wrapper.children[parseInt(i.toString(), 10)] instanceof PathElement && actualObject.measureType === 'Perimeter')) {
                        actualObject.wrapper.children[parseInt(i.toString(), 10)].style.fill = 'transparent';
                    }
                } else {
                    if ((actualObject.wrapper.children[parseInt(i.toString(), 10)] instanceof PathElement && actualObject.measureType === 'Perimeter') || actualObject.wrapper.children[parseInt(i.toString(), 10)] instanceof TextElement) {
                        actualObject.wrapper.children[parseInt(i.toString(), 10)].style.fill = 'transparent';
                    }
                }
            }
        }
        if (actualObject && (actualObject.shapeAnnotationType === 'FreeText' || actualObject.enableShapeLabel === true)) {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)].textNodes) {
                        if (actualObject.shapeAnnotationType === 'FreeText') {
                            if (node.dynamicText) {
                                children[parseInt(i.toString(), 10)].content = node.dynamicText;
                                actualObject.dynamicText = node.dynamicText;
                            } else {
                                children[parseInt(i.toString(), 10)].content = actualObject.dynamicText;
                            }
                            children[parseInt(i.toString(), 10)].width = actualObject.bounds.width;
                        } else if (actualObject.enableShapeLabel === true && actualObject.measureType) {
                            if (node.labelContent) {
                                children[parseInt(i.toString(), 10)].content = node.labelContent;
                                actualObject.labelContent = node.labelContent;
                            } else {
                                children[parseInt(i.toString(), 10)].content = actualObject.labelContent;
                            }
                            actualObject.notes = children[parseInt(i.toString(), 10)].content;
                        } else if (actualObject.enableShapeLabel === true) {
                            if (node.labelContent) {
                                children[parseInt(i.toString(), 10)].content = node.labelContent;
                                actualObject.labelContent = node.labelContent;
                            } else {
                                children[parseInt(i.toString(), 10)].content = actualObject.labelContent;
                            }
                            actualObject.notes = children[parseInt(i.toString(), 10)].content;
                        }
                        children[parseInt(i.toString(), 10)].isDirt = true;
                    }
                    /** set text node width less than the parent */
                }
            }
        }
        if (actualObject && actualObject.shapeAnnotationType === 'SignatureText' && actualObject.wrapper) {
            if (actualObject.wrapper.children && actualObject.wrapper.children.length > 1) {
                actualObject.wrapper.children[1].isDirt = true;
            }
        }
        if (actualObject.wrapper.children[1] instanceof TextElement) {
            actualObject.wrapper.children[1].isEJ2 = true;
            if (actualObject.shapeAnnotationType === 'FreeText') {
                actualObject.wrapper.children[1].isFreeText = true;
            }
        }
        if (actualObject && actualObject.shapeAnnotationType === 'FreeText' && this.pdfViewer.annotationModule.stickyNotesAnnotationModule.textFromCommentPanel) {
            actualObject.wrapper.width = undefined;
            actualObject.wrapper.height = undefined;
            actualObject.wrapper.measure(new Size(actualObject.bounds.width, actualObject.bounds.height));
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.textFromCommentPanel = false;
        }
        else {
            actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
        }
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (actualObject && actualObject.formFieldAnnotationType) {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any = actualObject.wrapper.children[0];
                children.actualSize.width = actualObject.wrapper.desiredSize.width;
                children.actualSize.height = actualObject.wrapper.desiredSize.height;
            }
        }
        if (actualObject && actualObject.shapeAnnotationType === 'FreeText' && actualObject.subject === 'Text Box') {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any = actualObject.wrapper.children;
                if (children[1].childNodes.length >= 1) {
                    if (actualObject.textAlign === 'Justify') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    } else if (actualObject.textAlign === 'Right') {
                        children[1].horizontalAlignment = 'Right';
                        children[1].setOffsetWithRespectToBounds(1, 0, null);
                    } else if (actualObject.textAlign === 'Left') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    } else if (actualObject.textAlign === 'Center') {
                        children[1].horizontalAlignment = 'Center';
                        children[1].setOffsetWithRespectToBounds(0.51, 0, null);
                    }
                } else {
                    children[1].horizontalAlignment = 'Auto';
                }
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i as number].textNodes && children[i as number].textNodes.length > 0) {
                        children[i as number].isDirt = true;
                        let childNodeHeight: number = children[i as number].textNodes.length * children[i as number].textNodes[0].dy;
                        const heightDiff: number = actualObject.bounds.height - childNodeHeight;
                        if (heightDiff > 0 && heightDiff < children[i as number].textNodes[0].dy) {
                            childNodeHeight = childNodeHeight + children[i as number].textNodes[0].dy;
                        }
                        if (childNodeHeight > actualObject.bounds.height) {
                            let contString: string = '';
                            for (let index: number = 0; index < children[i as number].textNodes.length; index++) {
                                const childHeight: number = children[i as number].textNodes[0].dy * (index + 1);
                                contString = contString + children[i as number].textNodes[index as number].text;
                            }
                            if (heightDiff < 0) {
                                children[i as number].content = contString;
                            }
                        }
                    } /** set text node width less than the parent */
                    children[i as number].width = actualObject.bounds.width;
                }
            }
            actualObject.wrapper.measure(new Size(actualObject.bounds.width, actualObject.bounds.height));
            actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        }
        if (isNeedToRender || isNullOrUndefined(isNeedToRender)) {
            this.pdfViewer.renderDrawing(undefined, actualObject.pageIndex);
        }
        if (actualObject && actualObject.shapeAnnotationType === 'FreeText') {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                const children: any[] = actualObject.wrapper.children;
                if (children[1].childNodes.length === 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                    children[1].setOffsetWithRespectToBounds(0.5, 0, null);
                }
                else if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Left';
                    children[1].setOffsetWithRespectToBounds(0, 0, null);
                }
            }
        }
    }

    private measureTextMetrics(actualObject: any, text: string, fontSize: number, fontFamily: string):
    { width: number; height: number; ascent: number; descent: number }{
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', actualObject.pageIndex);
        if (isNullOrUndefined(canvas)) {
            canvas = <HTMLCanvasElement>document.createElement('canvas');
        }
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.font = `${'bold'} ${fontSize}px ${fontFamily}`;

        const metrics: TextMetrics = ctx.measureText(text);
        const width: number = metrics.width;
        // Height from font metrics if available, fallback to line-height ~1.2 * fontSize
        const ascent: number =
            (metrics.actualBoundingBoxAscent !== null && metrics.actualBoundingBoxAscent !== undefined)
                ? metrics.actualBoundingBoxAscent
                : fontSize * 0.8;
        const descent: number =
            (metrics.actualBoundingBoxDescent !== null && metrics.actualBoundingBoxDescent !== undefined)
                ? metrics.actualBoundingBoxDescent
                : fontSize * 0.2;
        const height: number = ascent + descent;
        canvas = null;
        return { width, height, ascent, descent };
    }

    private fontSizeCalculation(actualObject: any, element: any, boundsWidth: number, text: string): number {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', actualObject.pageIndex);
        if (isNullOrUndefined(canvas)) {
            canvas = <HTMLCanvasElement>document.createElement('canvas');
        }
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        let textwidth: number = 0;
        let newsize: number = 0;
        let fontStyle: string = '';
        if (element.style.italic && element.style.bold) {
            fontStyle = 'bold italic ';
        } else if (element.style.bold) {
            fontStyle = 'bold ';
        } else if (element.style.italic) {
            fontStyle = 'italic ';
        }
        while (boundsWidth > textwidth) {
            context.font = fontStyle + newsize + 'px ' + element.style.fontFamily;
            textwidth = context.measureText(text).width;
            newsize += 0.1;
        }
        newsize -= 0.1;
        canvas = null;
        return newsize;
    }

    private setLineDistance(actualObject: any, points: any, segment: any, leader: boolean): void {
        let node1: PathElement;
        if (leader) {
            node1 = initLeader(actualObject, points[1], points[0], leader);
        } else {
            node1 = initLeader(actualObject, points[0], points[1], leader);
        }
        (segment as PathElement).data = node1.data;
        segment.offsetX = node1.offsetX;
        segment.offsetY = node1.offsetY;
        segment.rotateAngle = node1.rotateAngle;
        segment.width = node1.width;
        segment.height = node1.height;
        segment.pivot = node1.pivot;
        (segment as PathElement).canMeasurePath = true;
        segment.isDirt = true;
    }

    /**
     * @private
     * @param {number} sx - Specified the sx value.
     * @param {number} sy - Specified the sy value.
     * @param {PointModel} pivot - Specified the pivot value.
     * @returns {boolean} - Returns true or false.
     */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        const obj: SelectorModel | PdfAnnotationBaseModel = this.pdfViewer.selectedItems;
        return this.scale(obj, sx, sy, pivot);
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel | SelectorModel} obj - Specified the annotaion object.
     * @param {number} sx - Specified the sx value.
     * @param {number} sy - Specified the sy value.
     * @param {PointModel} pivot - Specified the pivot value.
     * @returns {boolean} - Returns true or false.
     */
    public scale(obj: PdfAnnotationBaseModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean {
        let checkBoundaryConstraints: boolean = true;
        if (obj instanceof Selector) {
            if (obj.annotations && obj.annotations.length) {
                for (const node of obj.annotations) {
                    checkBoundaryConstraints = this.scaleAnnotation(node, sx, sy, pivot, obj);
                }
            } else if (obj.formFields && obj.formFields.length) {
                for (const node of obj.formFields) {
                    checkBoundaryConstraints = this.scaleAnnotation(node, sx, sy, pivot, obj);
                }
            }
        } else {
            checkBoundaryConstraints = this.scaleAnnotation(obj as PdfAnnotationBaseModel, sx, sy, pivot, undefined);
        }
        return checkBoundaryConstraints;
    }

    /**
     * @private
     * @param {number} sw - Specified the sw value.
     * @param {number} sh - Specified the sh value.
     * @param {PointModel} pivot - Specified the pivot value.
     * @param {IElement} obj - Specified the annotation object.
     * @param {DrawingElement} element - Specified the annotation element.
     * @param {IElement} refObject - Specified the annotation reference object.
     * @returns {void}
     */
    public scaleObject(sw: number, sh: number, pivot: PointModel, obj: IElement, element: DrawingElement, refObject: IElement): void {
        sw = sw < 0 ? 1 : sw; sh = sh < 0 ? 1 : sh;
        if (sw !== 1 || sh !== 1) {
            let width: number; let height: number;
            if (!isLineShapes(obj)) {
                const node: PdfAnnotationBaseModel = obj; let isResize: boolean; let bound: Rect;
                width = node.wrapper.actualSize.width * sw; height = node.wrapper.actualSize.height * sh;
                if (isResize) {
                    width = Math.max(width, (bound.right - node.wrapper.bounds.x));
                    height = Math.max(height, (bound.bottom - node.wrapper.bounds.y));
                }
                sw = width / node.wrapper.actualSize.width; sh = height / node.wrapper.actualSize.height;
            }
            const matrix: Matrix = identityMatrix();
            if (!refObject) {
                refObject = obj;
            }
            const refWrapper: DrawingElement = refObject.wrapper;
            rotateMatrix(matrix, -refWrapper.rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, sw, sh, pivot.x, pivot.y);
            rotateMatrix(matrix, refWrapper.rotateAngle, pivot.x, pivot.y);
            if (!isLineShapes(obj)) {
                const node: PdfAnnotationBaseModel = obj;
                const newPosition: PointModel = transformPointByMatrix(matrix, { x: node.wrapper.offsetX, y: node.wrapper.offsetY });
                if (width > 0) {
                    node.wrapper.width = width; node.wrapper.offsetX = newPosition.x;
                }
                if (height > 0) {
                    node.wrapper.height = height; node.wrapper.offsetY = newPosition.y;
                }
                this.nodePropertyChange(obj as PdfAnnotationBaseModel, {
                    bounds: { width: node.wrapper.width, height: node.wrapper.height, x: node.wrapper.offsetX, y: node.wrapper.offsetY }
                } as PdfAnnotationBaseModel);
            }
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotaion object.
     * @param {number} sw - Specified the sw value.
     * @param {number} sh - Specified the sh value.
     * @param {PointModel} pivot - Specified the pivot value.
     * @param {IElement} refObject - Specified the reference object.
     * @returns {boolean} - Returns true or false.
     */
    public scaleAnnotation(obj: PdfAnnotationBaseModel, sw: number, sh: number, pivot: PointModel, refObject?: IElement): boolean {
        const node: IElement = (this.pdfViewer.nameTable as any)[obj.id];
        const element: DrawingElement = node.wrapper;
        if (!refObject) { refObject = obj as IElement; }
        const refWrapper: Container = refObject.wrapper;
        const x: number = refWrapper.offsetX - refWrapper.actualSize.width * refWrapper.pivot.x;
        const y: number = refWrapper.offsetY - refWrapper.actualSize.height * refWrapper.pivot.y;
        const refPoint: PointModel = this.getShapePoint(
            x, y, refWrapper.actualSize.width, refWrapper.actualSize.height,
            refWrapper.rotateAngle, refWrapper.offsetX, refWrapper.offsetY, pivot);
        if (element.actualSize.width !== undefined && element.actualSize.height !== undefined) {
            this.scaleObject(sw, sh, refPoint, node, element, refObject);
        }
        const constraints: boolean = this.checkBoundaryConstraints(undefined, undefined,
                                                                   (obj as PdfAnnotationBaseModel).pageIndex, obj.wrapper.bounds);
        if (!constraints) {
            this.scaleObject(1 / sw, 1 / sh, refPoint, node, element, refObject);
            //bug (EJ2-62649) : fixed an issue with difficulty on moving/ resizing free text annotation that added in edge of viewer
            if ((obj as any).shapeAnnotationType === 'FreeText' && ((obj as any).id.slice(0, 9) === 'free_text' || (obj as any).id.slice(0, 8) === 'freetext')) {
                const newDiff: any = this.moveInsideViewer(obj);
                this.nodePropertyChange(obj, {
                    bounds: { width: obj.wrapper.width, height: obj.wrapper.height, x: obj.wrapper.offsetX + newDiff.tx,
                        y: obj.wrapper.offsetY + newDiff.ty }
                });
            }
        }
        return constraints;
    }

    //bug (EJ2-62649) : Implemnted method for calculating optimal bound for free text annotation that outside viewer container
    private moveInsideViewer(obj: PdfAnnotationBaseModel, tx?: number, ty?: number): any {
        tx = tx ? tx : 0;
        ty = ty ? ty : 0;
        if ((obj as any).shapeAnnotationType === 'FreeText' && ((obj as any).id.slice(0, 9) === 'free_text' || (obj as any).id.slice(0, 8) === 'freetext')) {
            const canvas: HTMLElement = this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', (obj as any).pageIndex);
            if (canvas) {
                const bounds: Rect = obj.wrapper.bounds;
                const width: number = canvas.clientWidth / this.pdfViewer.viewerBase.getZoomFactor();
                const height: number = canvas.clientHeight / this.pdfViewer.viewerBase.getZoomFactor();
                const right: number = bounds.right;
                const left: number = bounds.left;
                const top: number = bounds.top;
                const bottom: number = bounds.bottom;
                if (!(right + tx <= width - 3 && left + tx >= 1 && bottom + ty <= height - 3 && top + ty >= 1)) {
                    let txNew: number = 0;
                    let tyNew: number = 0;
                    if (!(right <= width - 3)) {
                        txNew = width - right - 3;
                    }
                    if (!(left >= 1)) {
                        txNew = txNew - left + 1;
                    }
                    if (!(bottom <= height - 3)) {
                        tyNew = height - bottom - 3;
                    }
                    if (!(top >= 1)) {
                        tyNew = tyNew - top + 1;
                    }
                    if (txNew !== 0) {
                        tx = txNew;
                    }
                    if (tyNew !== 0) {
                        ty = tyNew;
                    }
                }
            }
        }
        return { tx: tx, ty: ty };
    }

    /**
     * @private
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @param {number} pageIndex - Specified the page index value.
     * @param {Rect} nodeBounds - Specified the node bounds value.
     * @param {boolean} isStamp - Specified the annotation is stamp or not.
     * @param {boolean} isSkip - Specified the annotaion is skip or not.
     * @param {IElement} obj - Specified the annotation object.
     * @returns {boolean} - Returns true or false.
     */
    public checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect,
                                    isStamp?: boolean, isSkip?: boolean, obj?: IElement): boolean {
        const selectorBounds: Rect = !nodeBounds ? this.pdfViewer.selectedItems.wrapper.bounds : undefined;
        const bounds: Rect = nodeBounds;
        const canvas: any = this.pdfViewer.viewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
        let heightDifference: number = 1;
        if (canvas) {
            const width: number = canvas.clientWidth / this.pdfViewer.viewerBase.getZoomFactor();
            const height: number = canvas.clientHeight / this.pdfViewer.viewerBase.getZoomFactor();
            const lineAnnotation: any = obj;
            if (lineAnnotation && (lineAnnotation.shapeAnnotationType === 'Line' || lineAnnotation.shapeAnnotationType === 'Distance' ||
                lineAnnotation.shapeAnnotationType === 'Polygon' || lineAnnotation.measureType === 'Perimeter' ||
                lineAnnotation.shapeAnnotationType === 'LineWidthArrowHead')) {
                if (lineAnnotation.vertexPoints) {
                    for (let i: number = 0; i < lineAnnotation.vertexPoints.length; i++) {
                        const point: any = lineAnnotation.vertexPoints[i as number];
                        const x: number = point.x + (tx || 0);
                        const y: number = point.y + (ty || 0);
                        if (x > width - 3 || x < 1 || y > height - 3 || y < 1) {
                            return false;
                        }
                    }
                }
                return true;
            }
            const right: number = (nodeBounds ? bounds.right : selectorBounds.right) + (tx || 0);
            const left: number = (nodeBounds ? bounds.left : selectorBounds.left) + (tx || 0);
            const top: number = (nodeBounds ? bounds.top : selectorBounds.top) + (ty || 0);
            const bottom: number = (nodeBounds ? bounds.bottom : selectorBounds.bottom) + (ty || 0);
            if (isStamp) {
                heightDifference = 50;
                if (this.pdfViewer.viewerBase.eventArgs && this.pdfViewer.viewerBase.eventArgs.source) {
                    if (this.RestrictStamp(this.pdfViewer.viewerBase.eventArgs.source)) {
                        return false;
                    }
                }
            }
            if (right <= width - 3 && left >= 1 && bottom <= height - 3 && top >= heightDifference) {
                this.isLineInHorizontalBounds = true;
                this.isLineInVerticalBounds = true;
                return true;
            }
            if (isSkip) {
                heightDifference = 10;
                if (right <= width - 10 && left >= 10 && bottom <= height - 10 && top >= heightDifference) {
                    this.isLineInHorizontalBounds = true;
                    this.isLineInVerticalBounds = true;
                    return true;
                }
            }
            if (isSkip) {
                if (!(right <= width - 10 && left >= 10)) {
                    this.isLineInHorizontalBounds = false;
                }
                if (!(bottom <= height - 10 && top >= heightDifference)) {
                    this.isLineInVerticalBounds = false;
                }
            }
            else {
                if (!(right <= width - 3 && left >= 1)) {
                    this.isLineInHorizontalBounds = false;
                }
                if (!(bottom <= height - 3 && top >= heightDifference)) {
                    this.isLineInVerticalBounds = false;
                }
            }
        }
        return false;
    }

    private RestrictStamp(source: any): boolean {
        if (source && source.pageIndex !== undefined && this.pdfViewer.viewerBase.activeElements &&
             source.pageIndex !== this.pdfViewer.viewerBase.activeElements.activePageID) {
            return true;
        }
        return false;
    }

    /**
     * @private
     * @param {DrawingElement} shapeElement - Specified the shape element.
     * @returns {Rect} - Returns the rectangle object.
     */
    public getShapeBounds(shapeElement: DrawingElement): Rect {
        let shapeBounds: Rect = new Rect();
        const shapeCorners: Rect = cornersPointsBeforeRotation(shapeElement);
        let shapeMiddleLeft: PointModel = shapeCorners.middleLeft;
        let shapeTopCenter: PointModel = shapeCorners.topCenter;
        let shapeBottomCenter: PointModel = shapeCorners.bottomCenter;
        let shapeMiddleRight: PointModel = shapeCorners.middleRight;
        let shapeTopLeft: PointModel = shapeCorners.topLeft;
        let shapeTopRight: PointModel = shapeCorners.topRight;
        let shapeBottomLeft: PointModel = shapeCorners.bottomLeft;
        let shapeBottomRight: PointModel = shapeCorners.bottomRight;
        shapeElement.corners = {
            topLeft: shapeTopLeft, topCenter: shapeTopCenter, topRight: shapeTopRight, middleLeft: shapeMiddleLeft,
            middleRight: shapeMiddleRight, bottomLeft: shapeBottomLeft, bottomCenter: shapeBottomCenter, bottomRight: shapeBottomRight
        } as Corners;
        if (shapeElement.rotateAngle !== 0 || shapeElement.parentTransform !== 0) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, shapeElement.rotateAngle + shapeElement.parentTransform, shapeElement.offsetX, shapeElement.offsetY);
            shapeElement.corners.topLeft = shapeTopLeft = transformPointByMatrix(matrix, shapeTopLeft);
            shapeElement.corners.topCenter = shapeTopCenter = transformPointByMatrix(matrix, shapeTopCenter);
            shapeElement.corners.topRight = shapeTopRight = transformPointByMatrix(matrix, shapeTopRight);
            shapeElement.corners.middleLeft = shapeMiddleLeft = transformPointByMatrix(matrix, shapeMiddleLeft);
            shapeElement.corners.middleRight = shapeMiddleRight = transformPointByMatrix(matrix, shapeMiddleRight);
            shapeElement.corners.bottomLeft = shapeBottomLeft = transformPointByMatrix(matrix, shapeBottomLeft);
            shapeElement.corners.bottomCenter = shapeBottomCenter = transformPointByMatrix(matrix, shapeBottomCenter);
            shapeElement.corners.bottomRight = shapeBottomRight = transformPointByMatrix(matrix, shapeBottomRight);
            //Set corners based on rotate angle
        }
        shapeBounds = Rect.toBounds([shapeTopLeft, shapeTopRight, shapeBottomLeft, shapeBottomRight]);
        shapeElement.corners.left = shapeBounds.left;
        shapeElement.corners.right = shapeBounds.right;
        shapeElement.corners.top = shapeBounds.top;
        shapeElement.corners.bottom = shapeBounds.bottom;
        shapeElement.corners.center = shapeBounds.center;
        shapeElement.corners.width = shapeBounds.width;
        shapeElement.corners.height = shapeBounds.height;
        return shapeBounds;
    }

    /**
     * @private
     * @param {number} x - Specified the x value.
     * @param {number} y - Specified the y value.
     * @param {number} w - Specified the w value.
     * @param {number} h - Specified the h value.
     * @param {number} angle - Specified the angle value.
     * @param {number} offsetX - Specified the offset x value.
     * @param {number} offsetY - Specified the offset y value.
     * @param {PointModel} cornerPoint - Specified the corner point value.
     * @returns {PointModel} - Returns the point model.
     */
    public getShapePoint(
        x: number, y: number, w: number, h: number, angle: number, offsetX: number, offsetY: number, cornerPoint: PointModel): PointModel {
        let pivotPoint: PointModel = { x: 0, y: 0 };
        const transformMatrix: Matrix = identityMatrix();
        rotateMatrix(transformMatrix, angle, offsetX, offsetY);
        switch (cornerPoint.x) {
        case 1:
            switch (cornerPoint.y) {
            case 1:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w, y: y + h }));
                break;
            case 0:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w, y: y }));
                break;
            case 0.5:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w, y: y + h / 2 }));
                break;
            }
            break;
        case 0:
            switch (cornerPoint.y) {
            case 0.5:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x, y: y + h / 2 }));
                break;
            case 1:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x, y: y + h }));
                break;
            case 0:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x, y: y }));
                break;
            }
            break;
        case 0.5:
            switch (cornerPoint.y) {
            case 0:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w / 2, y: y }));
                break;
            case 0.5:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w / 2, y: y + h / 2 }));
                break;
            case 1:
                pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w / 2, y: y + h }));
                break;
            }
            break;
        }
        return { x: pivotPoint.x, y: pivotPoint.y };
    }

    /**
     * @private
     * @param {string} endPoint - Specified the end point value.
     * @param {IElement} obj - Specified the annotaion object.
     * @param {PointModel} point - Specified the annotation points.
     * @param {PointModel} segment - Specified the annotaion segment.
     * @param {IElement} target - Specified the target element.
     * @param {string} targetPortId - Specified the target port id.
     * @param {any} currentSelector - Specified the current selector value.
     * @returns {boolean} - Returns true or false.
     */
    public dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel,
                             target?: IElement, targetPortId?: string, currentSelector?: any): boolean {
        let selectorModel: SelectorModel;
        let connector: PdfAnnotationBaseModel;
        let tx: number;
        let ty: number;
        if (obj instanceof Selector) {
            selectorModel = obj as SelectorModel;
            connector = selectorModel.annotations[0];
        } else {
            connector = obj;
        }
        point = { x: point.x / this.pdfViewer.viewerBase.getZoomFactor(), y: point.y / this.pdfViewer.viewerBase.getZoomFactor() };
        if (this.checkBoundaryConstraints(undefined, undefined, connector.pageIndex, connector.wrapper.bounds, null, null, obj)) {
            if (connector.shapeAnnotationType === 'Distance') {
                const leader: Leader = isLeader(connector, endPoint);
                if (endPoint === 'Leader0') {
                    if (this.pdfViewer.viewerBase.tool instanceof LineTool) {
                        connector.vertexPoints[0].x = point.x;
                        connector.vertexPoints[0].y = point.y;
                    } else {
                        tx = point.x - leader.point.x;
                        ty = point.y - leader.point.y;
                        connector.vertexPoints[0].x += tx;
                        connector.vertexPoints[0].y += ty;
                    }
                } else if (endPoint === 'Leader1') {
                    const length: number = connector.vertexPoints.length - 1;
                    if (this.pdfViewer.viewerBase.tool instanceof LineTool) {
                        connector.vertexPoints[parseInt(length.toString(), 10)].x = point.x;
                        connector.vertexPoints[parseInt(length.toString(), 10)].y = point.y;
                    } else {
                        tx = point.x - leader.point.x;
                        ty = point.y - leader.point.y;
                        connector.vertexPoints[parseInt(length.toString(), 10)].x += tx;
                        connector.vertexPoints[parseInt(length.toString(), 10)].y += ty;
                    }
                } else {
                    const angle: number = Point.findAngle(connector.sourcePoint, connector.targetPoint);
                    const center: PointModel = obj.wrapper.children[0].bounds.center;
                    const matrix: Matrix = identityMatrix();
                    rotateMatrix(matrix, -angle, center.x, center.y);
                    const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: point.x, y: point.y });
                    if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                        const matrix: Matrix = identityMatrix();
                        rotateMatrix(matrix, -angle, center.x, center.y);
                        const rotatedPoint1: PointModel = transformPointByMatrix(matrix, connector.vertexPoints[0]);
                        const rotatedPoint2: PointModel =
                         transformPointByMatrix(matrix, connector.vertexPoints[connector.vertexPoints.length - 1]);
                        ty = rotatedPoint.y - rotatedPoint1.y;
                        if (connector.leaderHeight === 0 && connector.leaderHeight != null) {
                            connector.leaderHeight = this.pdfViewer.distanceSettings.leaderLength;
                        } else {
                            connector.leaderHeight += ty;
                            rotatedPoint1.y += ty;
                            rotatedPoint2.y += ty;
                            const matrix: Matrix = identityMatrix();
                            rotateMatrix(matrix, angle, center.x, center.y);
                            connector.vertexPoints[0] = transformPointByMatrix(matrix, rotatedPoint1);
                            connector.vertexPoints[connector.vertexPoints.length - 1] = transformPointByMatrix(matrix, rotatedPoint2);
                        }
                    }
                }
            } else if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                const i: number = Number(endPoint.split('_')[1]);
                tx = point.x - connector.vertexPoints[parseInt(i.toString(), 10)].x;
                ty = point.y - connector.vertexPoints[parseInt(i.toString(), 10)].y;
                connector.vertexPoints[parseInt(i.toString(), 10)].x += tx;
                connector.vertexPoints[parseInt(i.toString(), 10)].y += ty;
                if (connector.vertexPoints.length > 2 && (obj as PdfAnnotationBaseModel).measureType !== 'Perimeter') {
                    if (parseFloat(endPoint.split('_')[1]) === 0) {
                        connector.vertexPoints[connector.vertexPoints.length - 1].x += tx;
                        connector.vertexPoints[connector.vertexPoints.length - 1].y += ty;
                    } else if (parseFloat(endPoint.split('_')[1]) === connector.vertexPoints.length - 1) {
                        connector.vertexPoints[0].x += tx;
                        connector.vertexPoints[0].y += ty;
                    }
                }
            }
            this.nodePropertyChange(connector, { vertexPoints: connector.vertexPoints } as PdfAnnotationBaseModel);
            this.renderSelector(connector.pageIndex, currentSelector);
        }
        this.pdfViewer.renderDrawing();
        return true;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the y value.
     * @param {number} i - Specified the index value.
     * @returns {boolean} - Returns true or false.
     */
    public dragSourceEnd(obj: PdfAnnotationBaseModel, tx: number, ty: number, i: number): boolean {
        const connector: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[obj.id];
        connector.vertexPoints[parseInt(i.toString(), 10)].x += tx;
        connector.vertexPoints[parseInt(i.toString(), 10)].y += ty;
        this.pdfViewer.renderDrawing();
        return true;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} connector - Specified the connector object.
     * @param {PointModel[]} points - Specified the points value.
     * @returns {void}
     */
    public updateConnector(connector: PdfAnnotationBaseModel, points: PointModel[]): void {
        let targetPoint: PointModel;
        connector.vertexPoints = points;
        updateSegmentElement(connector, points, connector.wrapper.children[0] as PathElement);
        const anglePoint: PointModel[] = connector.vertexPoints;
        //  points = this.clipDecorators(connector, points);
        let element: DrawingElement = connector.wrapper.children[0];
        (element as PathElement).canMeasurePath = true;
        for (let i: number = 0; i < connector.wrapper.children.length; i++) {
            element = connector.wrapper.children[parseInt(i.toString(), 10)];
            if (connector.shapeAnnotationType !== 'Polygon') {
                if (element.id.indexOf('srcDec') > -1) {
                    updateDecoratorElement(connector, element, points[0], anglePoint[1], true);
                }
                targetPoint = connector.targetPoint;
                if (element.id.indexOf('tarDec') > -1) {
                    updateDecoratorElement(connector, element, points[points.length - 1], anglePoint[anglePoint.length - 2], false);
                }
            }
        }
    }

    /**
     * @private
     * @returns {object} - Returns the object.
     */
    public copy(): Object {
        let annotationSettings: any;
        if (!isNullOrUndefined(this.pdfViewer.annotationModule)) {
            annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(this.pdfViewer.selectedItems.annotations[0]);
        }
        if (((this.pdfViewer.formDesignerModule && !this.pdfViewer.formDesigner.isPropertyDialogOpen) ||
         this.pdfViewer.annotationModule) && (this.pdfViewer.designerMode || this.pdfViewer.enableAnnotation) &&
          (this.pdfViewer.selectedItems.formFields.length !== 0 || (this.pdfViewer.selectedItems.annotations.length !== 0 &&
             !isNullOrUndefined(annotationSettings) && !annotationSettings.isLock))) {
            this.pdfViewer.clipboardData.pasteIndex = 1;
            this.pdfViewer.clipboardData.clipObject = this.copyObjects();
            this.copiedElementID = (this.pdfViewer.clipboardData.clipObject as any[])[0].id;
        }
        let isSearchboxDialogOpen: boolean;
        const searchBoxId: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_search_box');
        if (searchBoxId) {
            isSearchboxDialogOpen = searchBoxId.style.display !== 'none';
        }
        if (this.pdfViewer.formDesigner && this.pdfViewer.formDesigner.isPropertyDialogOpen || isSearchboxDialogOpen) {
            this.pdfViewer.clipboardData.clipObject = {};
        }
        return this.pdfViewer.clipboardData.clipObject;
    }

    /**
     * @private
     * @returns {object[]} - Returns the object array.
     */
    public copyObjects(): Object[] {
        let selectedItems: PdfAnnotationBaseModel[] | PdfFormFieldBaseModel[] = [];
        const obj: Object[] = [];
        this.pdfViewer.clipboardData.childTable = {};
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            selectedItems = this.pdfViewer.selectedItems.annotations;
            for (let j: number = 0; j < selectedItems.length; j++) {
                const element: Object = cloneObject((selectedItems[parseInt(j.toString(), 10)]));
                obj.push(element);
            }
        }
        if (this.pdfViewer.selectedItems.formFields.length > 0) {
            selectedItems = this.pdfViewer.selectedItems.formFields;
            for (let j: number = 0; j < selectedItems.length; j++) {
                const element: Object = cloneObject((selectedItems[parseInt(j.toString(), 10)]));
                obj.push(element);
            }
        }
        if (this.pdfViewer.clipboardData.pasteIndex === 0) {
            for (const item of selectedItems) {
                if ((this.pdfViewer.nameTable as any)[item.id]) {
                    if (!item.formFieldAnnotationType) {
                        if ((item as PdfAnnotationBaseModel).annotName)
                        {this.pdfViewer.annotationModule.deleteAnnotationById((item as PdfAnnotationBaseModel).annotName); }
                        else
                        {this.pdfViewer.annotationModule.deleteAnnotation(); }
                    } else {
                        this.pdfViewer.clearSelection(item.pageIndex);
                        this.pdfViewer.formDesignerModule.deleteFormField((item as PdfFormFieldBaseModel).id);
                    }
                }
            }
            //this.endGroupAction();
        }
        this.sortByZIndex(obj, 'zIndex');
        return obj;
    }

    private getNewObject(obj: PdfAnnotationBaseModel[]): PdfAnnotationBaseModel[] {
        let newObj: PdfAnnotationBaseModel;
        const newobjs: PdfAnnotationBaseModel[] = [];
        this.pdfViewer.clipboardData.pasteIndex = 1;
        for (let i: number = 0; i < obj.length; i++) {
            newObj = cloneObject(obj[parseInt(i.toString(), 10)]) as PdfAnnotationBaseModel;
            newobjs.push(newObj);
        }
        return newobjs as PdfAnnotationBaseModel[];
    }

    private isWithinBounds(pageCurrentRect: DOMRect, events: any): boolean {
        const { clientX, clientY } = events;
        const { left, right, top, bottom } = pageCurrentRect;
        return left < clientX && clientX < right && top < clientY && clientY < bottom;
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel[]} obj - Specified the annotation object.
     * @param {number} index - Specified the annotation index.
     * @returns {void}
     */
    public paste(obj: PdfAnnotationBaseModel[], index: number): void {
        const zoomfactor: number = this.pdfViewer.viewerBase.getZoomFactor();
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        let fieldId: string;
        this.isPasted = true;
        if (obj || this.pdfViewer.clipboardData.clipObject) {
            const clippedData: PdfAnnotationBaseModel[] = this.pdfViewer.clipboardData.clipObject as (PdfAnnotationBaseModel)[];
            const copiedItems: PdfAnnotationBaseModel[] = obj ? this.getNewObject(obj) :
                this.getNewObject(clippedData);
            if (copiedItems) {
                const objectTable: {} = {};
                if (this.pdfViewer.clipboardData.pasteIndex !== 0) {
                    this.pdfViewer.clearSelection(index);
                }
                if (!isNullOrUndefined(copiedItems[0])) {
                    if (this.pdfViewer.currentPageNumber === copiedItems[0].pageIndex + 1) {
                        for (const copy of copiedItems) {
                            fieldId = copy.id;
                            copy.id += randomId();
                            const fieldName: string = this.splitFormFieldName(copy);
                            let maxNumber: number = 0; // this.pdfViewer.formFieldCollection.length;
                            if (this.pdfViewer.formDesigner) {
                                this.pdfViewer.formDesigner.setFormFieldIndex();
                                maxNumber = this.pdfViewer.formDesigner.formFieldIndex;
                                (copy as any).name = fieldName + maxNumber;
                            }
                            (objectTable as any)[copy.id] = copy;
                        }
                        for (let j: number = 0; j < copiedItems.length; j++) {
                            const copy: PdfAnnotationBaseModel = copiedItems[parseInt(j.toString(), 10)];
                            const pageDiv: HTMLElement = this.pdfViewer.viewerBase.getElement('_pageDiv_' + copy.pageIndex);
                            let events: any = (window as any).event as MouseEvent;
                            const pageCurrentRect: DOMRect = pageDiv.getBoundingClientRect() as DOMRect;
                            if (events && !events.clientX && !events.clientY) {
                                events = { clientX: this.pdfViewer.viewerBase.mouseLeft, clientY: this.pdfViewer.viewerBase.mouseTop };
                            }
                            if (isBlazor()) {
                                events = this.pdfViewer.viewerBase.mouseDownEvent as MouseEvent;
                            }
                            if (isLineShapes(copy)) {
                                this.calculateCopyPosition(copy, pageDiv, events);
                            } else {
                                if (pageDiv) {
                                    if ((pageCurrentRect.right - events.clientX) < copy.bounds.width * zoomfactor) {
                                        copy.bounds.x = (pageDiv.clientWidth - copy.bounds.width * zoomfactor) / zoomfactor;
                                    }
                                    else {
                                        copy.bounds.x = (events.clientX - pageCurrentRect.left) / zoomfactor;
                                    }
                                    if ((pageCurrentRect.bottom - events.clientY) > copy.bounds.height * zoomfactor) {
                                        copy.bounds.y = (events.clientY - pageCurrentRect.top) / zoomfactor;
                                    }
                                    else {
                                        copy.bounds.y = (pageDiv.clientHeight - copy.bounds.height * zoomfactor) / zoomfactor;
                                    }
                                }
                            }
                            if (this.isWithinBounds(pageCurrentRect, events)) {
                                const newNode: PdfAnnotationBaseModel = cloneObject(copy);
                                if (this.pdfViewer.viewerBase.contextMenuModule.previousAction !== 'Cut') {
                                    newNode.id += randomId();
                                    if (this.pdfViewer.annotationModule && newNode.shapeAnnotationType !== 'HandWrittenSignature' &&
                                        newNode.shapeAnnotationType !== 'SignatureText' && newNode.shapeAnnotationType !== 'SignatureImage') {
                                        newNode.annotName = newNode.id;
                                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                                            updateAnnotationCollection(newNode, copiedItems[0], false);
                                    }
                                    if (newNode.shapeAnnotationType === 'SignatureText' || newNode.shapeAnnotationType === 'HandWrittenSignature' || newNode.shapeAnnotationType === 'SignatureImage') {
                                        newNode.signatureName = newNode.id;
                                        this.pdfViewer.viewerBase.signatureModule.storeSignatureData(newNode.pageIndex, newNode);
                                    }
                                    if (!newNode.formFieldAnnotationType && newNode.shapeAnnotationType !== 'SignatureText' && newNode.shapeAnnotationType !== 'HandWrittenSignature' && newNode.shapeAnnotationType !== 'SignatureImage') {
                                        this.pdfViewer.annotation.addAction(this.pdfViewer.viewerBase.getActivePage(false), null, newNode as PdfAnnotationBase, 'Addition', '', newNode as PdfAnnotationBase, newNode);
                                        if (newNode.measureType === 'Distance' || newNode.measureType === 'Perimeter' || newNode.measureType === 'Area' ||
                                            newNode.measureType === 'Radius' || newNode.measureType === 'Volume') {
                                            const matchedRatioObject: any = this.pdfViewer.annotationModule.measureAnnotationModule.
                                                scaleRatioCollection.find((item: any) => newNode.id.startsWith(item.id));
                                            if (matchedRatioObject) {
                                                const clonedItem: any = JSON.parse(JSON.stringify(matchedRatioObject));
                                                clonedItem.annotName = newNode.id;
                                                this.pdfViewer.annotationModule.measureAnnotationModule.
                                                    scaleRatioCollection.push(clonedItem);
                                            }
                                        }
                                    }
                                } else {
                                    if (this.pdfViewer.annotationModule) {
                                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                                            updateAnnotationCollection(newNode, copiedItems[0], true);
                                    }
                                    if (newNode.shapeAnnotationType === 'SignatureText' || newNode.shapeAnnotationType === 'HandWrittenSignature' || newNode.shapeAnnotationType === 'SignatureImage') {
                                        this.pdfViewer.viewerBase.signatureModule.storeSignatureData(newNode.pageIndex, newNode);
                                    }
                                    if (!newNode.formFieldAnnotationType && newNode.shapeAnnotationType !== 'SignatureText' && newNode.shapeAnnotationType !== 'HandWrittenSignature' && newNode.shapeAnnotationType !== 'SignatureImage') {
                                        this.pdfViewer.annotation.addAction(this.pdfViewer.viewerBase.getActivePage(false), null, newNode as PdfAnnotationBase, 'Addition', '', newNode as PdfAnnotationBase, newNode);
                                    }
                                }
                                const addedAnnot: PdfAnnotationBaseModel | PdfFormFieldBaseModel = this.add(newNode);
                                if (this.pdfViewer.formDesigner && addedAnnot.formFieldAnnotationType && this.pdfViewer.annotation) {
                                    this.pdfViewer.annotation.addAction(this.pdfViewer.viewerBase.getActivePage(true), null, addedAnnot as PdfFormFieldBase, 'Addition', '', addedAnnot as PdfFormFieldBase, addedAnnot as PdfFormFieldBase);
                                }
                                if ((newNode.shapeAnnotationType === 'FreeText' || newNode.enableShapeLabel) && addedAnnot) {
                                    this.nodePropertyChange(addedAnnot, {});
                                }
                                if (addedAnnot.formFieldAnnotationType && addedAnnot.pageIndex === index) {
                                    this.pdfViewer.formFieldCollection.push(addedAnnot);
                                    // eslint-disable-next-line max-len
                                    const formField: FormFieldModel = {
                                        id: addedAnnot.id, name: (addedAnnot as PdfFormFieldBaseModel).name,
                                        value: (addedAnnot as PdfFormFieldBaseModel).value,
                                        type: addedAnnot.formFieldAnnotationType as FormFieldType,
                                        isReadOnly: addedAnnot.isReadonly, fontFamily: addedAnnot.fontFamily,
                                        fontSize: addedAnnot.fontSize, fontStyle: addedAnnot.fontStyle as unknown as FontStyle,
                                        color: (addedAnnot as PdfFormFieldBaseModel).color,
                                        backgroundColor: (addedAnnot as PdfFormFieldBaseModel).backgroundColor,
                                        alignment: (addedAnnot as PdfFormFieldBaseModel).alignment as TextAlign,
                                        visibility: (addedAnnot as PdfFormFieldBaseModel).visibility,
                                        maxLength: (addedAnnot as PdfFormFieldBaseModel).maxLength,
                                        isRequired: (addedAnnot as PdfFormFieldBaseModel).isRequired,
                                        isPrint: addedAnnot.isPrint, isSelected: (addedAnnot as PdfFormFieldBaseModel).isSelected,
                                        isChecked: (addedAnnot as PdfFormFieldBaseModel).isChecked,
                                        tooltip: (addedAnnot as PdfFormFieldBaseModel).tooltip,
                                        bounds: addedAnnot.bounds as IFormFieldBound,
                                        thickness: addedAnnot.thickness, borderColor: (addedAnnot as PdfFormFieldBaseModel).borderColor,
                                        signatureIndicatorSettings: (addedAnnot as PdfFormFieldBaseModel).signatureIndicatorSettings,
                                        insertSpaces: (addedAnnot as PdfFormFieldBaseModel).insertSpaces,
                                        isMultiline: (addedAnnot as PdfFormFieldBaseModel).isMultiline,
                                        isTransparent: (addedAnnot as PdfFormFieldBaseModel).isTransparent,
                                        options: (addedAnnot as PdfFormFieldBaseModel).options, pageIndex: addedAnnot.pageIndex,
                                        pageNumber: (addedAnnot as PdfFormFieldBaseModel).pageNumber,
                                        rotateAngle: (addedAnnot as PdfFormFieldBaseModel).rotateAngle,
                                        signatureType: (addedAnnot as any).signatureType,
                                        zIndex: (addedAnnot as PdfFormFieldBaseModel).zIndex,
                                        selectedIndex: (addedAnnot as PdfFormFieldBaseModel).selectedIndex
                                    };
                                    if ((addedAnnot as PdfFormFieldBaseModel).options &&
                                        (addedAnnot as PdfFormFieldBaseModel).options.length > 0) {
                                        formField.options = (addedAnnot as PdfFormFieldBaseModel).options;
                                    }
                                    this.pdfViewer.formFieldCollections.push(formField);
                                    this.pdfViewer.formDesigner.drawHTMLContent(addedAnnot.formFieldAnnotationType,
                                                                                addedAnnot.wrapper.children[0] as DiagramHtmlElement,
                                                                                addedAnnot,
                                                                                (addedAnnot as PdfFormFieldBaseModel).pageIndex,
                                                                                this.pdfViewer, fieldId);
                                }
                                this.pdfViewer.select([newNode.id], this.pdfViewer.annotationSelectorSettings);
                                if (!addedAnnot.formFieldAnnotationType) {
                                    this.pdfViewer.annotationModule.triggerAnnotationAddEvent(newNode);
                                }
                            }
                        }
                    }
                }
            }
            this.pdfViewer.renderDrawing(undefined, index);
            this.pdfViewer.viewerBase.showAnnotationPropertiesToolbar(true);
            this.pdfViewer.clipboardData.pasteIndex++;
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
        this.isPasted = false;
    }

    private splitFormFieldName(obj: any): string {
        let field: any = null;
        if (obj) {
            switch (obj.formFieldAnnotationType) {
            case 'Textbox':
                field = 'Textbox';
                break;
            case 'PasswordField':
                field = 'Password';
                break;
            case 'Checkbox':
                field = 'Check Box';
                break;
            case 'RadioButton':
                field = 'Radio Button';
                break;
            case 'DropdownList':
                field = 'Dropdown';
                break;
            case 'ListBox':
                field = 'List Box';
                break;
            case 'SignatureField':
                field = 'Signature';
                break;
            case 'InitialField':
                field = 'Initial';
                break;
            }
        }
        return field;
    }

    private calculateCopyPosition(copy: PdfAnnotationBaseModel, pageDiv: HTMLElement, events: MouseEvent): void {
        const zoomfactor: number = this.pdfViewer.viewerBase.getZoomFactor();
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        for (let i: number = 0; i < copy.vertexPoints.length; i++) {
            if (pageDiv) {
                if (i === 0) {
                    const pageCurrentRect: DOMRect = pageDiv.getBoundingClientRect() as DOMRect;
                    x1 = copy.vertexPoints[parseInt(i.toString(), 10)].x;
                    y1 = copy.vertexPoints[parseInt(i.toString(), 10)].y;
                    copy.vertexPoints[parseInt(i.toString(), 10)].x = (events.clientX - pageCurrentRect.left) / zoomfactor;
                    copy.vertexPoints[parseInt(i.toString(), 10)].y = (events.clientY - pageCurrentRect.top) / zoomfactor;
                    x2 = copy.vertexPoints[parseInt(i.toString(), 10)].x;
                    y2 = copy.vertexPoints[parseInt(i.toString(), 10)].y;
                } else {
                    copy.vertexPoints[parseInt(i.toString(), 10)].x += x2 - x1;
                    copy.vertexPoints[parseInt(i.toString(), 10)].y += y2 - y1;
                }
            }
        }
        if (pageDiv) {
            const pageWidth: number = pageDiv.offsetWidth / zoomfactor;
            const pageHeight: number = pageDiv.offsetHeight / zoomfactor;

            const modifiedPoints: PointModel[] = [...copy.vertexPoints];

            if (copy.shapeAnnotationType === 'Distance' && !isNullOrUndefined(copy.leaderHeight)) {
                this.calculateLeaderEndPoint(modifiedPoints, copy.leaderHeight);
            }

            let minLeft: number = Infinity;
            let minTop: number = Infinity;
            let maxRight: number = -Infinity;
            let maxBottom: number = -Infinity;

            modifiedPoints.forEach((point: any) => {
                minLeft = Math.min(minLeft, point.x);
                minTop = Math.min(minTop, point.y);
                maxRight = Math.max(maxRight, point.x);
                maxBottom = Math.max(maxBottom, point.y);
            });

            let shiftX: number = 0;
            let shiftY: number = 0;

            // Check horizontal boundaries
            if (minLeft < 0) {
                shiftX = -minLeft; // Shift right
            } else if (maxRight > pageWidth) {
                shiftX = pageWidth - maxRight; // Shift left
            }

            // Check vertical boundaries
            if (minTop < 0) {
                shiftY = -minTop; // Shift down
            } else if (maxBottom > pageHeight) {
                shiftY = pageHeight - maxBottom; // Shift up
            }

            // Apply calculated shifts to all vertex points
            if (shiftX !== 0 || shiftY !== 0) {
                copy.vertexPoints.forEach((point: any) => {
                    point.x = Math.floor(point.x + shiftX);
                    point.y = Math.floor(point.y + shiftY);
                });
            }
        }
    }

    private calculateLeaderEndPoint(vertexPoints: PointModel[], leaderHeight: number): void {
        const angle: number = Point.findAngle(vertexPoints[0], vertexPoints[1]);
        for (let i: number = 0; i < 2; i++) {
            const point: PointModel = vertexPoints[parseInt(i.toString(), 10)];
            const newPoint: PointModel = { x: point.x, y: point.y - leaderHeight };
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, angle, point.x, point.y);
            const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint.x, y: newPoint.y });
            vertexPoints.push(rotatedPoint);
        }
    }

    /**
     * @private
     * @param {number} index - Specified the annotaion index.
     * @returns {void}
     */
    public cut(index: number): void {
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.removedAnnotationCollection = [];
        }
        if (((this.pdfViewer.formDesignerModule && !this.pdfViewer.formDesigner.isPropertyDialogOpen) ||
         this.pdfViewer.selectedItems.annotations.length > 0) && (this.pdfViewer.designerMode ||
             this.pdfViewer.selectedItems.annotations.length > 0) && (this.pdfViewer.selectedItems.formFields.length !== 0 ||
                 this.pdfViewer.selectedItems.annotations.length !== 0)) {
            this.pdfViewer.clipboardData.pasteIndex = 0;
            this.pdfViewer.clipboardData.clipObject = this.copyObjects();
            this.pdfViewer.renderDrawing(undefined, index);
            this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
            this.copiedElementID = (this.pdfViewer.clipboardData.clipObject as any[])[0].id;
        }
        let isSearchboxDialogOpen: boolean;
        const searchBoxId: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_search_box');
        if (searchBoxId) {
            isSearchboxDialogOpen = searchBoxId.style.display !== 'none';
        }
        if (this.pdfViewer.formDesigner && this.pdfViewer.formDesigner.isPropertyDialogOpen || isSearchboxDialogOpen) {
            this.pdfViewer.clipboardData.clipObject = {};
        }
    }

    /**
     * @private
     * @param {object[]} nodeArray - Specified the node array.
     * @param {string} sortID - Specified the sort id.
     * @returns {object[]} - Returns the node array.
     */
    public sortByZIndex(nodeArray: Object[], sortID?: string): Object[] {
        const id: string = sortID ? sortID : 'zIndex';
        nodeArray = nodeArray.sort((a: Object, b: Object): number => {
            return (a as any)[`${id}`] - (b as any)[`${id}`];
        });
        return nodeArray;
    }
}

/**
 * @hidden
 */
export interface Transforms {
    tx: number;
    ty: number;
    scale: number;
}

/**
 * @hidden
 */
export interface ClipBoardObject {
    pasteIndex?: number;
    clipObject?: Object;
    childTable?: {};
}
