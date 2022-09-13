import { PdfViewer, LineTool } from '../index';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';
import { ZOrderPageTable, PdfAnnotationBase, PdfFormFieldBase } from './pdf-annotation';
import { Container, Rect, PointModel, Point, Matrix, identityMatrix, rotateMatrix, getDiagramElement, ThumbsConstraints, BaseAttributes, RectAttributes, CircleAttributes, IElement, scaleMatrix, cornersPointsBeforeRotation, Corners, SelectorConstraints, LineAttributes, ImageElement, TextAlign } from '@syncfusion/ej2-drawings';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { PathElement } from '@syncfusion/ej2-drawings';
import { TextStyle } from '@syncfusion/ej2-drawings';
import { createMeasureElements } from '@syncfusion/ej2-drawings';
import { randomId } from '@syncfusion/ej2-drawings';
import { Size, transformPointByMatrix, RotateTransform, TextElement } from '@syncfusion/ej2-drawings';
import { Canvas, refreshDiagramElements, DrawingRenderer } from '@syncfusion/ej2-drawings';
import { Selector } from './selector';
import { SvgRenderer } from '@syncfusion/ej2-drawings';
import { SelectorModel } from './selector-model';
import { isLineShapes, setElementStype, findPointsLength, getBaseShapeAttributes, isLeader, Leader, cloneObject } from './drawing-util';
import { getConnectorPoints, updateSegmentElement, getSegmentElement, updateDecoratorElement, getDecoratorElement, clipDecorators, initDistanceLabel, initLeaders, initLeader, getPolygonPath, initPerimeterLabel } from './connector-util';
import { isNullOrUndefined, isBlazor, Browser } from '@syncfusion/ej2-base';
import { AnnotationResizerLocation, AnnotationSelectorSettingsModel } from '../index';
import { DiagramHtmlElement } from './html-element';
import { IFormField, IFormFieldBound } from '../form-designer';
import { FormFieldModel } from '../pdfviewer-model';
import { FontStyle, FormFieldType } from '../base';
import { Visibility } from '../base/types';

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
                const annotation: PdfAnnotationBaseModel = annotations[i];
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
                if (this.pdfViewer.zIndexTable[i].pageId === pageId) {
                    notFound = false;
                    zIndexTable = this.pdfViewer.zIndexTable[i];
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
            if (obj.zIndex === -1) {
                pageTable.zIndex++;
                obj.zIndex = pageTable.zIndex;
                pageTable.objects.push(obj);
            } else {
                const index: number = obj.zIndex;
                let tabelLength: number = pageTable.objects.length;
                obj.zIndex = tabelLength++;
                pageTable.objects.push(obj);
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
            obj.wrapper.measure(new Size(undefined, undefined));
            obj.wrapper.arrange(obj.wrapper.desiredSize);
        }
        if ((obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).wrapper === null) {
            //Init default wrapper
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.pdfViewer.nameTable as any)[(obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).id] = obj;
        if (obj.formFieldAnnotationType) {
            this.nodePropertyChange(obj as PdfFormFieldBaseModel, { bounds: { width: obj.bounds.width, height: obj.bounds.height } });
        }
        //Add some methodologies to add the children of group to name table
        return obj;
    }

    private initNode(obj: PdfAnnotationBaseModel | PdfFormFieldBaseModel): void {
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
        // eslint-disable-next-line max-len
        canvas.measure(new Size((obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).wrapper.width, (obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel).wrapper.height));
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
        // eslint-disable-next-line
        let annotationSettings: any = this.pdfViewer.annotationModule ? this.pdfViewer.annotationModule.findAnnotationSettings(obj) : {};
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
            // eslint-disable-next-line max-len
            content = this.initAnnotationObject(obj, pathContent, content, canvas, isStamp, basicElement, isAnnotationSet, annotationMaxHeight, annotationMaxWidth, annotationMinWidth, annotationMinHeight);
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
            case 'InitialField':
                // eslint-disable-next-line
                const htmlContent: DiagramHtmlElement = new DiagramHtmlElement();
                content = (htmlContent as DrawingElement);
                content.id = obj.id + '_content';
                canvas.children.push(content);
                break;
        }
        return content;
    }

    // eslint-disable-next-line
    private initAnnotationObject(obj: PdfAnnotationBaseModel, pathContent: PathElement, content: DrawingElement, canvas: Container, isStamp: boolean, basicElement: DrawingElement, isAnnotationSet: boolean, annotationMaxHeight: number, annotationMaxWidth: number, annotationMinWidth: number, annotationMinHeight: number): DrawingElement {
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
            case 'Stamp':
                isStamp = true;
                this.isDynamicStamps = true;
                if (obj && obj.annotationAddMode && (obj.annotationAddMode === 'Existing Annotation' || obj.annotationAddMode === 'Imported Annotation')) {
                    obj.bounds.width = obj.bounds.width - 20;
                    obj.bounds.height = obj.bounds.height - 20;
                }
                if (obj.isDynamicStamp) {
                    canvas.horizontalAlignment = 'Left';
                    basicElement = new DrawingElement();
                    content = basicElement;
                    content.cornerRadius = 10;
                    content.style.fill = obj.stampFillColor;
                    content.style.strokeColor = obj.stampStrokeColor;
                    canvas.children.push(content);
                    let textele: TextElement = this.textElement(obj);
                    textele = new TextElement();
                    textele.style.fontFamily = 'Helvetica';
                    textele.style.fontSize = 14;
                    textele.style.italic = true;
                    textele.style.bold = true;
                    textele.style.color = obj.fillColor;
                    textele.rotateValue = undefined;
                    textele.content = obj.dynamicText;
                    textele.relativeMode = 'Point';
                    textele.margin.left = 10;
                    textele.margin.bottom = -7;
                    textele.setOffsetWithRespectToBounds(0, 0.57, null);
                    textele.relativeMode = 'Point';
                    canvas.children.push(textele);
                    // eslint-disable-next-line
                    let pathContent1: any = new PathElement();
                    pathContent1.id = randomId() + '_stamp';
                    pathContent1.data = obj.data;
                    pathContent1.width = obj.bounds.width;
                    if (isAnnotationSet && (obj.bounds.width > annotationMaxWidth)) {
                        pathContent1.width = annotationMaxWidth;
                        obj.bounds.width = annotationMaxWidth;
                    }
                    pathContent1.height = obj.bounds.height / 2;
                    if (isAnnotationSet && (obj.bounds.height > annotationMaxHeight)) {
                        pathContent1.height = annotationMaxHeight / 2;
                        obj.bounds.height = annotationMaxHeight / 2;
                    }
                    pathContent1.rotateValue = undefined;
                    pathContent1.margin.left = 10;
                    pathContent1.margin.bottom = -5;
                    pathContent1.relativeMode = 'Point';
                    pathContent1.setOffsetWithRespectToBounds(0, 0.1, null);
                    // eslint-disable-next-line
                    let content1: any = pathContent1;
                    pathContent1.style.fill = obj.fillColor;
                    pathContent1.style.strokeColor = obj.strokeColor;
                    pathContent1.style.opacity = obj.opacity;
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                    content.style.opacity = obj.opacity;
                    canvas.children.push(content1);
                } else {
                    canvas.horizontalAlignment = 'Left';
                    basicElement = new DrawingElement();
                    content = basicElement;
                    content.cornerRadius = 10;
                    content.style.fill = obj.stampFillColor;
                    content.style.strokeColor = obj.stampStrokeColor;
                    canvas.children.push(content);
                    // eslint-disable-next-line
                    let pathContent1: any = new PathElement();
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
                    // eslint-disable-next-line
                    let content1: any = pathContent1;
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
                break;
            case 'Image':
            case 'SignatureImage':
                // eslint-disable-next-line
                let pathContent11: any = new ImageElement();
                pathContent11.source = obj.data;
                content = pathContent11;
                content.style.strokeWidth = 0;
                canvas.children.push(content);
                break;
            case 'Rectangle':
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
            case 'Perimeter':
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
                // eslint-disable-next-line
                let textele: TextElement = this.textElement(obj);
                textele = new TextElement();
                textele.content = textele.content = findPointsLength([
                    { x: obj.bounds.x, y: obj.bounds.y },
                    { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }]).toString();
                textele.rotateValue = { y: -10, angle: obj.rotateAngle };
                canvas.children.push(textele);
                break;
            case 'Radius':
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
                // eslint-disable-next-line
                const radiusTextEle: any = this.textElement(obj);
                if (obj.enableShapeLabel) {
                    radiusTextEle.style.color = obj.fontColor;
                    radiusTextEle.style.strokeColor = obj.labelBorderColor;
                    radiusTextEle.style.fill = obj.labelFillColor;
                    radiusTextEle.style.fontSize = obj.fontSize;
                    radiusTextEle.style.fontFamily = obj.fontFamily;
                    radiusTextEle.style.opacity = obj.labelOpacity;
                }
                // eslint-disable-next-line
                const length: number = findPointsLength([
                    { x: obj.bounds.x, y: obj.bounds.y },
                    { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }]);
                if (!this.pdfViewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
                    radiusTextEle.content = obj.notes;
                } else {
                    // eslint-disable-next-line max-len
                    radiusTextEle.content = this.pdfViewer.annotation.measureAnnotationModule.setConversion((obj.bounds.width / 2) * this.pdfViewer.annotation.measureAnnotationModule.pixelToPointFactor, obj);
                }
                radiusTextEle.rotateValue = { y: -10, x: obj.bounds.width / 4, angle: obj.rotateAngle };
                canvas.children.push(radiusTextEle);
                break;
            case 'StickyNotes':
                // eslint-disable-next-line
                let pathContent2: any = new ImageElement();
                pathContent2.source = obj.data;
                pathContent2.width = obj.bounds.width;
                pathContent2.height = obj.bounds.height;
                pathContent2.style.strokeColor = obj.strokeColor;
                pathContent2.style.strokeWidth = 0;
                content = pathContent2;
                canvas.children.push(content);
                break;
            case 'SignatureText':
                //eslint-disable-next-line
                let rectElements: any = new DrawingElement();
                rectElements.style.strokeWidth = 0;
                content = rectElements;
                content.style.strokeWidth = 0;
                canvas.style.strokeWidth = 0;
                canvas.children.push(content);
                // eslint-disable-next-line
                let signatureText: any = this.textElement(obj);
                signatureText.style.fontFamily = obj.fontFamily;
                signatureText.style.fontSize = obj.fontSize;
                signatureText.style.textAlign = 'Left';
                signatureText.rotateValue = undefined;
                signatureText.content = obj.data;
                signatureText.style.strokeWidth = 0;
                canvas.children.push(signatureText);
                break;
            case 'FreeText':
                // eslint-disable-next-line
                let rectElement: any = new DrawingElement();
                content = rectElement;
                canvas.children.push(content);
                // eslint-disable-next-line
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
                freeTextEle.margin.left = 4;
                freeTextEle.margin.top = 5 * (obj.fontSize / 16);
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
        obj.shapeAnnotationType === 'SignatureText' ? textele.verticalAlignment = 'Center' : textele.verticalAlignment = 'Top';
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
            // eslint-disable-next-line max-len
            const trasPoint: PointModel = { x: node.bounds.x + (node.bounds.width / 2) + (node.bounds.width / 4), y: node.bounds.y + (node.bounds.height / 2) };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public initLine(obj: PdfAnnotationBaseModel): Canvas {
        if (!obj.id) {
            obj.id = randomId();
        }
        let bpmnElement: PathElement;
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
                    obj.segments.push(obj.vertexPoints[i]);
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
        const accessContent: string = 'getDescription';
        // eslint-disable-next-line max-len
        if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' || obj.shapeAnnotationType === 'Distance') {
            srcDecorator = getDecoratorElement(obj, points[0], anglePoints[1], true);
            targetDecorator = getDecoratorElement(obj, points[points.length - 1], anglePoints[anglePoints.length - 2], false);
        }
        srcDecorator.id = obj.id + '_srcDec';
        targetDecorator.id = obj.id + '_tarDec';
        /* eslint-disable @typescript-eslint/dot-notation */
        segment.style['fill'] = 'transparent';
        container.style.strokeColor = 'transparent';
        container.style.fill = 'transparent';
        container.style.strokeWidth = 0;
        container.children = [];
        setElementStype(obj, segment);
        container.children.push(segment);
        if (leaders.length > 0) {
            for (let i: number = 0; i < leaders.length; i++) {
                container.children.push(leaders[i]);
            }
        }
        if (labels.length > 0) {
            for (let i: number = 0; i < labels.length; i++) {
                container.children.push(labels[i]);
            }
        }
        container.children.push(srcDecorator);
        container.children.push(targetDecorator);
        if (obj.shapeAnnotationType === 'LineWidthArrowHead') 
        {
            container.children[1].width = 12 * obj.thickness;
            container.children[1].height = 12 * obj.thickness;
            container.children[2].width = 12 * obj.thickness;
            container.children[2].height = 12 * obj.thickness;
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
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
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
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        const index: number = obj.pageIndex;
        for (let i: number = 0; i < this.pdfViewer.annotations.length; i++) {
            const annotation: PdfAnnotationBaseModel = this.pdfViewer.annotations[i];
            if ((annotation.id && (annotation.id === obj.id || annotation.id.split('_')[0] === obj.id)) || (annotation.wrapper && annotation.wrapper.id === obj.id)) {
                this.pdfViewer.annotations.splice(i, 1);
                const objects: (PdfAnnotationBaseModel)[] = this.getPageObjects(obj.pageIndex);
                for (let j: number = 0; j < objects.length; j++) {
                    if (objects[j].id === obj.id) {
                        objects.splice(j, 1);
                        if (obj.shapeAnnotationType === 'Path' || obj.shapeAnnotationType === 'SignatureImage' || obj.shapeAnnotationType === 'SignatureText')       
                        {
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
            const element: PdfAnnotationBaseModel = this.pdfViewer.formFields[i];
            if (element.id === obj.id || element.wrapper.id === obj.id) {
                this.pdfViewer.formFields.splice(i, 1);
                if (this.pdfViewer.formDesignerModule && obj.formFieldAnnotationType) {
                    this.pdfViewer.formFieldCollection.splice(i, 1);
                }
                const objects: (PdfFormFieldBaseModel)[] = this.getPageObjects(obj.pageIndex);
                for (let j: number = 0; j < objects.length; j++) {
                    if (objects[j].id === obj.id) {
                        objects.splice(j, 1);
                        break;
                    }
                    if (objects[j] && objects[j].id && objects[j].id.indexOf(obj.id) !== -1) {
                        objects.splice(j, 1);
                    }
                }
            }
        }
        if (obj.formFieldAnnotationType === 'Textbox' || obj.formFieldAnnotationType === 'Checkbox' || obj.formFieldAnnotationType === 'RadioButton'
            || obj.formFieldAnnotationType === 'PasswordField' || obj.formFieldAnnotationType === 'DropdownList' || obj.formFieldAnnotationType === 'ListBox' || obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
            for (let i: number = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                // eslint-disable-next-line
                const element: any = this.pdfViewer.formFieldCollections[i];
                if (element.id === obj.id) {
                    this.pdfViewer.formFieldCollections.splice(i, 1);
                }
            }
        }
        if (obj.formFieldAnnotationType === 'Textbox' || obj.formFieldAnnotationType === 'Checkbox' || obj.formFieldAnnotationType === 'RadioButton'
            || obj.formFieldAnnotationType === 'PasswordField' || obj.formFieldAnnotationType === 'DropdownList' || obj.formFieldAnnotationType === 'ListBox' || obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
            // eslint-disable-next-line
            const inputField: any = document.getElementById('form_field_' + obj.id + '_content_html_element');
            if (inputField) {
                inputField.remove();
                this.pdfViewer.renderDrawing(undefined, index);
                const field: IFormField = {
                    // eslint-disable-next-line
                    name: (obj as any).name, id: (obj as any).id, value: (obj as any).value, fontFamily: obj.fontFamily, fontSize: obj.fontSize, fontStyle: (obj as any).fontStyle,
                    // eslint-disable-next-line
                    color: (obj as any).color, backgroundColor: (obj as any).backgroundColor, alignment: (obj as any).alignment, isReadonly: (obj as any).isReadonly, visibility: (obj as any).visibility,
                    // eslint-disable-next-line
                    maxLength: (obj as any).maxLength, isRequired: (obj as any).isRequired, isPrint: obj.isPrint, rotation: (obj as any).rotateAngle, tooltip: (obj as any).tooltip,
                    // eslint-disable-next-line
                    options: (obj as any).options, isChecked: (obj as any).isChecked, isSelected: (obj as any).isSelected
                };
                this.pdfViewer.fireFormFieldRemoveEvent('formFieldRemove', field, obj.pageIndex);
                this.pdfViewer.formDesignerModule.removeFieldsFromAnnotationCollections(obj.id);
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
            diagramLayer = (document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex) as HTMLCanvasElement);
        }
        if (diagramLayer) {
            const zoom: number = this.pdfViewer.viewerBase.getZoomFactor();
            const width: number = diagramLayer.width / zoom;
            const height: number = diagramLayer.height / zoom;
            const ctx: CanvasRenderingContext2D = diagramLayer.getContext('2d');
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if (zoom < 1) {
                ctx.lineWidth = ctx.lineWidth / zoom;
            }
            let devicePixelRatio: number = this.pdfViewer.viewerBase.getWindowDevicePixelRatio();
            let zoomRatio: number = zoom * devicePixelRatio;
            if (!Browser.isDevice || (Browser.isDevice && zoom <= 0.7)) {
                ctx.setTransform(zoomRatio, 0, 0, zoomRatio, 0, 0);
            } else {
                ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
            }
            ctx.clearRect(0, 0, width, height);

            const objects: (PdfAnnotationBaseModel)[] = this.getPageObjects(pageIndex);
            for (let i: number = 0; i < objects.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let renderElement: DrawingElement;
                if (diagramLayer.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex) {
                    if (objects[i].isPrint) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        renderElement = (this.pdfViewer.nameTable as any)[objects[i].id].wrapper;
                        if (!isNullOrUndefined(renderElement)) {
                            refreshDiagramElements(diagramLayer, [renderElement], this.renderer);
                        }
                    }
                } else {
                    // eslint-disable-next-line
                    renderElement = (this.pdfViewer.nameTable as any)[objects[i].id].wrapper;
                    refreshDiagramElements(diagramLayer, [renderElement], this.renderer);
                }
            }
        }
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
            adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement') as SVGElement;
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
        const diagramElement: HTMLElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
        // eslint-disable-next-line
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
    // eslint-disable-next-line max-len
    public renderSelector(select?: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel, isSelect?: boolean): void {
        if (!helper || isSelect) {
            const size: Size = new Size();
            const selectorModel: Selector = this.pdfViewer.selectedItems as Selector;
            this.clearSelectorLayer(select);
            if (selectorModel.wrapper) {
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
                const bounds: Rect = selectorModel.wrapper.bounds;
                // eslint-disable-next-line
                let selectorElement: (any);
                if (selectorModel.formFields.length) {
                    for (let i: number = 0; i < selectorModel.formFields.length; i++) {
                        const node: PdfAnnotationBaseModel = selectorModel.formFields[i];
                        selectorElement = this.getSelectorElement(this.pdfViewer.element.id, select);
                        if (selectorElement && node.pageIndex === select && this.pdfViewer.designerMode) {
                            this.renderResizeHandle(
                                node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom,
                                undefined, undefined, undefined, false, true, null, null, currentSelector);
                        }
                        if (this.pdfViewer.formDesignerModule && node.formFieldAnnotationType) {
                            // eslint-disable-next-line max-len
                            if (!this.pdfViewer.viewerBase.isFormFieldSelect && !this.pdfViewer.viewerBase.isFormFieldMouseDown && !this.pdfViewer.viewerBase.isFormFieldMouseMove) {
                                this.pdfViewer.viewerBase.isFormFieldSelect = true;
                                const field: IFormField = {
                                    // eslint-disable-next-line
                                    name: (node as any).name, id: (node as any).id, value: (node as any).value, fontFamily: node.fontFamily, fontSize: node.fontSize, fontStyle: (node as any).fontStyle, color: (node as PdfFormFieldBaseModel).color, backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: (node as any).isReadonly, visibility: (node as any).visibility,
                                    // eslint-disable-next-line
                                    maxLength: (node as any).maxLength, isRequired: (node as any).isRequired, isPrint: node.isPrint, rotation: (node as any).rotateAngle, tooltip: (node as any).tooltip,
                                    // eslint-disable-next-line
                                    options: (node as any).options, isChecked: (node as any).isChecked, isSelected: (node as any).isSelected
                                };
                                this.pdfViewer.fireFormFieldSelectEvent('formFieldSelect', field, node.pageIndex, this.pdfViewer.formDesignerModule.isProgrammaticSelection);
                            }
                        }
                    }
                }
                if (selectorModel.annotations.length) {
                    for (let j: number = 0; j < selectorModel.annotations.length; j++) {
                        const node: PdfAnnotationBaseModel = selectorModel.annotations[j];
                        selectorElement = this.getSelectorElement(this.pdfViewer.element.id, select);
                        const constraints: boolean = true;
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
                                        // eslint-disable-next-line
                                        let isSignature: any = node.shapeAnnotationType === 'Path' || node.formFieldAnnotationType === 'SignatureField' || node.formFieldAnnotationType === 'InitialField';
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
                                // eslint-disable-next-line max-len
                                if (!this.pdfViewer.viewerBase.isFormFieldSelect && !this.pdfViewer.viewerBase.isFormFieldMouseDown && !this.pdfViewer.viewerBase.isFormFieldMouseMove) {
                                    this.pdfViewer.viewerBase.isFormFieldSelect = true;
                                    const field: IFormField = {
                                        // eslint-disable-next-line
                                        value: (node as any).value, fontFamily: node.fontFamily, fontSize: node.fontSize, fontStyle: (node as any).fontStyle,
                                        // eslint-disable-next-line
                                        color: (node as PdfFormFieldBaseModel).color, backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: (node as any).isReadonly, visibility: (node as any).visibility,
                                        // eslint-disable-next-line
                                        maxLength: (node as any).maxLength, isRequired: (node as any).isRequired, isPrint: node.isPrint, rotation: (node as any).rotateAngle, tooltip: (node as any).tooltip,
                                        // eslint-disable-next-line
                                        options: (node as any).options, isChecked: (node as any).isChecked, isSelected: (node as any).isSelected
                                    };
                                    this.pdfViewer.fireFormFieldSelectEvent('formFieldSelect', field, node.pageIndex, this.pdfViewer.formDesignerModule.isProgrammaticSelection);
                                }
                            }
                            if (node.annotName !== '' && node.annotName !== 'SignatureText') {
                                if (helper && (node === helper) && !node.formFieldAnnotationType) {
                                    // eslint-disable-next-line max-len
                                    if (!this.pdfViewer.viewerBase.isAddComment && !this.pdfViewer.viewerBase.isAnnotationSelect && !this.pdfViewer.viewerBase.isAnnotationMouseDown && !this.pdfViewer.viewerBase.isAnnotationMouseMove && !this.pdfViewer.viewerBase.isInkAdded && !this.pdfViewer.viewerBase.isNewStamp) {
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
    // eslint-disable-next-line max-len
    public rotate(obj: PdfAnnotationBaseModel | SelectorModel, angle: number, pivot?: PointModel, currentSelector?: AnnotationSelectorSettingsModel): boolean {
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
    // eslint-disable-next-line
    public renderBorder(selector: DrawingElement, canvas: HTMLCanvasElement | SVGElement, currentSelector?: any, transform?: Transforms, enableNode?: number, isBorderTickness?: boolean, isSwimlane?: boolean, isSticky?: boolean): void {
        const wrapper: DrawingElement = selector;
        const options: BaseAttributes = getBaseShapeAttributes(wrapper, transform);
        transform = transform || { scale: 1, tx: 0, ty: 0 };
        if (!isSticky) {
            options.x *= transform.scale;
            options.y *= transform.scale;
            options.width *= transform.scale;
            options.height *= transform.scale;
            options.fill = 'transparent';
            // eslint-disable-next-line max-len
            const shapeType: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel;
            if (currentSelector && (typeof (currentSelector) !== 'object') && currentSelector !== '') {
                // eslint-disable-next-line
                let annotationSelector: any = JSON.parse(currentSelector);
                const borderColor: string = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
                options.stroke = borderColor;
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
                // eslint-disable-next-line max-len
                let lineDash: number[] = annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                options.dashArray = lineDash.toString();
            } else {
                if (!this.pdfViewer.designerMode) {
                    if ((shapeType === 'HandWrittenSignature' || shapeType === 'SignatureText' || shapeType === 'SignatureImage') || shapeType === 'Ink') {
                        // eslint-disable-next-line
                        let formField: any = (this.pdfViewer.nameTable as any)[selector.id.split('_')[0]];
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
            // eslint-disable-next-line max-len
            const shapeType: PdfAnnotationBaseModel | PdfFormFieldBaseModel = this.pdfViewer.selectedItems.annotations.length > 0 ? this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel
                : this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType as PdfFormFieldBaseModel;
            if (currentSelector && (typeof (currentSelector) !== 'object') && currentSelector !== '') {
                const annotationSelector: AnnotationSelectorSettingsModel = JSON.parse(currentSelector);
                const borderColor: string = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
                options.stroke = borderColor;
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
                // eslint-disable-next-line max-len
                let lineDash: number[] = annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                options.dashArray = lineDash.toString();
            } else {
                this.getBorderSelector(shapeType, options);
            }
        }
        const parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector') as SVGSVGElement;
        // eslint-disable-next-line max-len
        this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, this.pdfViewer.element.id, undefined, true, parentSvg);
    }
    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotation object.
     * @param {BaseAttributes} options - Specified the options value.
     * @param {boolean} isFormFieldSign - Specified is form field sign or not.
     * @returns {void}
     */
    public getSignBorder(type: PdfAnnotationBaseModel, options: BaseAttributes, isFormFieldSign?: boolean): void {
        if (!isFormFieldSign && (type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else {
            const annotationSelector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
            const borderColor: string = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
            options.stroke = borderColor;
            options.strokeWidth = annotationSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
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
        // eslint-disable-next-line max-len
        options.strokeWidth = isNullOrUndefined(annotationSelector.selectionBorderThickness) || annotationSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
        // eslint-disable-next-line max-len
        let lineDash: number[] = isNullOrUndefined(annotationSelector.selectorLineDashArray) || annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
        if (lineDash.length > 2) {
            lineDash = [lineDash[0], lineDash[1]];
        }
        options.dashArray = lineDash.toString();
        if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if ((type === 'Textbox' || type === 'Checkbox' || type === 'RadioButton' || type === 'SignatureField' || type === 'InitialField' || type === 'DropdownList' || type === 'ListBox' || type === 'PasswordField') && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'StickyNotes' && this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [6, 3] : this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        } else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
            const borderColor: string = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // eslint-disable-next-line max-len
            const thickness: number = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // eslint-disable-next-line max-len
            let lineDash: number[] = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray;
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
     * @param {Object} ariaLabel - Specified the aria label object.
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
    // eslint-disable-next-line
    public getShapeSize(type: PdfAnnotationBaseModel, options: CircleAttributes, currentSelector: any, t?: Transforms): void {
        if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
            // eslint-disable-next-line
            let annotationSelector: any = JSON.parse(currentSelector);
            // eslint-disable-next-line max-len
            options.radius = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) / 2;
            // eslint-disable-next-line max-len
            options.width = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
            // eslint-disable-next-line max-len
            options.height = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
        } else {
            // eslint-disable-next-line
            let annotationSelector: any = this.pdfViewer.annotationSelectorSettings
            // eslint-disable-next-line max-len
            options.radius = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) / 2;
            // eslint-disable-next-line max-len
            options.width = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
            // eslint-disable-next-line max-len
            options.height = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
            if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) * t.scale;
            } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                // eslint-disable-next-line max-len
                options.radius = (isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) / 2;
                // eslint-disable-next-line max-len
                options.width = (isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // eslint-disable-next-line max-len
                options.height = (isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
        }
    }
    /**
     * @private
     * @param {PdfAnnotationBaseModel} type - Specified the annotation object.
     * @param {any} currentSelector - Specified the current selector value.
     * @returns {AnnotationSelectorSettingsModel} - Specified the annotation selector settings model.
     */
    // eslint-disable-next-line
    public getShape(type: PdfAnnotationBaseModel, currentSelector?: any): AnnotationSelectorSettingsModel {
        // eslint-disable-next-line
        let shapeType: any;
        {
            if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
                // eslint-disable-next-line
                let annotationSelector: any = JSON.parse(currentSelector);
                shapeType = isNullOrUndefined(annotationSelector.resizerShape) || annotationSelector.resizerShape === 'Square' ? 'Square' : annotationSelector.resizerShape;
            } else {
                // eslint-disable-next-line
                let annotationSelector: any = this.pdfViewer.annotationSelectorSettings;
                shapeType = isNullOrUndefined(annotationSelector.resizerShape) || annotationSelector.resizerShape === 'Square' ? 'Square' : annotationSelector.resizerShape;
                if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape;
                } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape;
                } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                    shapeType = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape;
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
    // eslint-disable-next-line
    public getResizerColors(type: PdfAnnotationBaseModel, options: CircleAttributes, currentSelector?: any, t?: Transforms): void {
        if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
            // eslint-disable-next-line
            let annotationSelector: any = JSON.parse(currentSelector);
            options.stroke = isNullOrUndefined(annotationSelector.resizerBorderColor) || annotationSelector.resizerBorderColor === 'black' ? 'black' : annotationSelector.resizerBorderColor;
            options.fill = isNullOrUndefined(annotationSelector.resizerFillColor) || annotationSelector.resizerFillColor === '#FF4081' ? '#FF4081' : annotationSelector.resizerFillColor;
        } else {
            // eslint-disable-next-line
            let annotationSelector: any = this.pdfViewer.annotationSelectorSettings;
            options.stroke = isNullOrUndefined(annotationSelector.resizerBorderColor) || annotationSelector.resizerBorderColor === 'black' ? 'black' : annotationSelector.resizerBorderColor;
            options.fill = isNullOrUndefined(annotationSelector.resizerFillColor) || annotationSelector.resizerFillColor === '#FF4081' ? '#FF4081' : annotationSelector.resizerFillColor;
            if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor;
            } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor;
            } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                options.stroke = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor;
                options.fill = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor;
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
        const element: PathElement = new PathElement();
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
        this.svgRenderer.drawCircle(canvas as SVGElement, options, ThumbsConstraints.Rotate, { 'aria-label': 'Thumb to rotate the selected object' });
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
        // eslint-disable-next-line max-len
        const shapeType: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations.length > 0 ? this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType as PdfAnnotationBaseModel : this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType as PdfFormFieldBaseModel;
        let allowPermission: boolean = false;
        if (!this.pdfViewer.formDesignerModule) {
            // eslint-disable-next-line
            let annotation: any = this.pdfViewer.selectedItems.annotations[0];
            // eslint-disable-next-line
            let allowedInteraction: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            const isLock: boolean = this.pdfViewer.annotationModule.checkIsLockSettings(annotation);
            if ((isLock || annotation.annotationSettings.isLock) && this.getAllowedInteractions(allowedInteraction)) {
                allowPermission = true;
            }
        }
        let resizerLocation: AnnotationResizerLocation = this.getResizerLocation(shapeType, currentSelector);
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3;
        }
        let isNodeShape: boolean = false;
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink')) {
            isNodeShape = true;
        }
        if (!this.pdfViewer.viewerBase.checkSignatureFormField(element.id) && !nodeConstraints && !isSticky && !isPath && !allowPermission) {
            if (isStamp || (isNodeShape && (nodeWidth >= 40 && nodeHeight >= 40) && (resizerLocation === 1 || resizerLocation === 3))) {
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
            // eslint-disable-next-line max-len
            if ((!isStamp && !isNodeShape) || (isNodeShape && (resizerLocation === 2 || resizerLocation === 3 || (!(nodeWidth >= 40 && nodeHeight >= 40) && resizerLocation === 1)))) {
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

    // eslint-disable-next-line
    private getAllowedInteractions(allowedInteraction: any): boolean {
        if (allowedInteraction && allowedInteraction.length > 0) {
            for (let i: number = 0; i < allowedInteraction.length; i++) {
                if (allowedInteraction[0] !== 'None' && allowedInteraction[i] === 'Resize') {
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
    // eslint-disable-next-line
    public getResizerLocation(type: PdfAnnotationBaseModel, currentSelector?: any): AnnotationResizerLocation {
        // eslint-disable-next-line
        let resizerLocation: any;
        {
            if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
                // eslint-disable-next-line
                let annotationSelector: any = JSON.parse(currentSelector);
                // eslint-disable-next-line max-len
                resizerLocation = isNullOrUndefined(annotationSelector.resizerLocation) || annotationSelector.resizerLocation === 3 ? 3 : annotationSelector.resizerLocation;
            } else {
                // eslint-disable-next-line
                let annotationSelector: any = this.pdfViewer.annotationSelectorSettings;
                // eslint-disable-next-line max-len
                resizerLocation = isNullOrUndefined(annotationSelector.resizerLocation) || annotationSelector.resizerLocation === 3 ? 3 : annotationSelector.resizerLocation;
                if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Distance') {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation;
                } else if ((type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation;
                } else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                    // eslint-disable-next-line max-len
                    resizerLocation = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation;
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
        this.svgRenderer.drawLine(canvas as SVGElement, options as LineAttributes);
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
        for (i = 0; i < selector.vertexPoints.length; i++) {
            const segment: PointModel = selector.vertexPoints[i];
            this.renderCircularHandle(
                ('segementThumb_' + (i + 1)), wrapper, segment.x, segment.y, canvas, true,
                constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i, null, currentSelector);
        }
        let leaderCount: number = 0;
        if (selector.shapeAnnotationType === 'Distance') {
            for (i = 0; i < selector.wrapper.children.length; i++) {
                const segment: DrawingElement = selector.wrapper.children[i];
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
                    const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                    this.renderCircularHandle(('leaderThumb_' + (i + 1)), wrapper, rotatedPoint.x, rotatedPoint.y, canvas, true, constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i, null, currentSelector);
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
    // eslint-disable-next-line
    public select(objArray: string[], currentSelector?: any, multipleSelection?: boolean, preventUpdate?: boolean): void {
        const selectorModel: SelectorModel = this.pdfViewer.selectedItems;
        for (let i: number = 0; i < objArray.length; i++) {
            // eslint-disable-next-line
            let obj: any = (this.pdfViewer.nameTable as any)[objArray[i]];
            if (obj.formFieldAnnotationType && this.pdfViewer.designerMode) {
                selectorModel.formFields.push(obj);
                this.initSelectorWrapper();
                selectorModel.wrapper.children.push(obj.wrapper);
                this.renderSelector(obj.pageIndex, currentSelector, obj, true);
            } else if (obj && !obj.formFieldAnnotationType) {
                if (!(obj instanceof Selector) && obj.wrapper.visible && this.pdfViewer.annotationModule) {
                    // eslint-disable-next-line
                    let annotationSettings: any;
                    if (obj.annotationSettings) {
                        annotationSettings = obj.annotationSettings;
                        annotationSettings.isLock = JSON.parse(annotationSettings.isLock);
                    } else if (!obj.formFieldAnnotationType) {
                        annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(obj, true);
                        obj.annotationSettings = annotationSettings;
                    }
                    let isLock: boolean = !obj.formFieldAnnotationType ? annotationSettings.isLock : false;
                    if (annotationSettings && annotationSettings.isLock && this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                        isLock = false;
                    }
                    if (!isLock) {
                        selectorModel.annotations.push(obj);
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
    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotaion object.
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @param {number} pageIndex - Specified the page index value.
     * @param {any} currentSelector - Specified the current selector value.
     * @param {PdfAnnotationBaseModel} helper - Specified the helper object.
     * @returns {void}
     */
    // eslint-disable-next-line
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
    // eslint-disable-next-line
    public drag(obj: PdfAnnotationBaseModel | SelectorModel, tx: number, ty: number, currentSelector: any, helper: PdfAnnotationBaseModel): void {
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
        let tempNode: PdfAnnotationBaseModel;
        const elements: PdfAnnotationBaseModel[] = [];
        // eslint-disable-next-line
        let oldValues: any = { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
        //bug (EJ2-62649) : fixed an issue with difficulty on moving/ resizing free text annotation that added in edge of viewer
        let newDiff : any = this.moveInsideViewer(obj,tx,ty);
        obj.wrapper.offsetX += newDiff.tx;
        obj.wrapper.offsetY += newDiff.ty;
        if (isLineShapes(obj) || obj.shapeAnnotationType === 'Polygon') {
            if (obj.wrapper.children.length) {
                const nodes: DrawingElement[] = obj.wrapper.children;
                for (let i: number = 0; i < nodes.length; i++) {
                    nodes[i].offsetX += tx;
                    nodes[i].offsetY += ty;
                }
            }
            this.dragControlPoint(obj, tx, ty, true);
        }
        this.nodePropertyChange(obj, { bounds: { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY } } as PdfAnnotationBaseModel);
        obj.wrapper.measureChildren = false;
        // eslint-disable-next-line
        let canvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + (obj as any).pageIndex);
        // eslint-disable-next-line
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
        // eslint-disable-next-line
        let connector: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[obj.id];
        for (let i: number = 0; i < connector.vertexPoints.length; i++) {
            (connector.vertexPoints[i]).x += tx;
            (connector.vertexPoints[i]).y += ty;
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
     * @returns {void}
     */
    public nodePropertyChange(
        actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void {
        const existingBounds: Rect = actualObject.wrapper.outerBounds;
        const existingInnerBounds: Rect = actualObject.wrapper.bounds;
        let updateConnector: boolean = false;
        let i: number; let j: number; let offsetX: number; let offsetY: number; let update: boolean;
        let tx: number; let ty: number;
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
                    if (children[i].id) {
                        const names: string[] = children[i].id.split('_');
                        if (names.length && (names.indexOf('perimeter') > -1 || names.indexOf('radius') > -1)) {
                            this.setNodePosition(children[i], actualObject);
                        } else if (names.length && (names.indexOf('srcDec') > -1)) {
                            children[i].offsetX = actualObject.vertexPoints[0].x;
                            children[i].offsetY = actualObject.vertexPoints[0].y;
                        } else if (names.length && names.indexOf('tarDec') > -1) {
                            children[i].offsetX = actualObject.vertexPoints[actualObject.vertexPoints.length - 1].x;
                            children[i].offsetY = actualObject.vertexPoints[actualObject.vertexPoints.length - 1].y;
                        } else if (names.length && (names.indexOf('stamp') > -1)) {
                            // eslint-disable-next-line
                            let ratio: any = 0;
                            let heightRatio: number = 2;
                            if (actualObject.wrapper.width !== undefined && actualObject.wrapper.height !== undefined) {
                                ratio = 20;
                                heightRatio = 2.9;
                            }
                            if (actualObject.isDynamicStamp) {
                                children[i].width = actualObject.bounds.width - ratio;
                                children[i].height = (actualObject.bounds.height / 2) - ratio;
                                // eslint-disable-next-line
                                let element: any = children[1] as TextElement;
                                // eslint-disable-next-line
                                let annotationSettings: any = this.pdfViewer.stampSettings ? this.pdfViewer.stampSettings : this.pdfViewer.annotationSettings;
                                // eslint-disable-next-line max-len
                                if (annotationSettings && (annotationSettings.maxHeight || annotationSettings.maxWidth) && (actualObject.bounds.height > 60)) {
                                    if (ratio != 0) {
                                        element.style.fontSize = (actualObject.bounds.width / ratio);
                                    } else {
                                        element.style.fontSize = (actualObject.wrapper.bounds.width / 20);
                                    }
                                } else {
                                    if (ratio != 0) {
                                        element.style.fontSize = this.fontSizeCalculation(actualObject, element, (actualObject.bounds.width - 20));
                                    } else {
                                        element.style.fontSize = this.fontSizeCalculation(actualObject, element, (actualObject.wrapper.bounds.width - 20));
                                    }
                                }
                                if (ratio !== 0) {
                                    element.margin.bottom = -(children[i].height / 2);
                                }
                            } else {
                                children[i].width = actualObject.bounds.width - ratio;
                                children[i].height = actualObject.bounds.height - ratio;
                            }
                            children[i].offsetX = actualObject.wrapper.offsetX;
                            children[i].offsetY = actualObject.wrapper.offsetX;
                            children[i].isDirt = true;
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
        if (node.taregetDecoraterShapes !== undefined) {
            actualObject.taregetDecoraterShapes = node.taregetDecoraterShapes; update = true;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.fillColor !== undefined) {
            actualObject.fillColor = node.fillColor;
            actualObject.wrapper.children[0].style.fill = node.fillColor;
            if ((actualObject.enableShapeLabel || actualObject.measureType) && actualObject.wrapper && actualObject.wrapper.children) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        if (actualObject.enableShapeLabel) {
                            actualObject.labelFillColor = node.fillColor;
                            children[i].style.fill = node.fillColor;
                        }
                        if (actualObject.measureType) {
                            children[i].style.fill = node.fillColor;
                        }
                    }
                }
            }
            update = true;
        }
        if (actualObject.enableShapeLabel && node.labelFillColor !== undefined) {
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        actualObject.labelFillColor = node.labelFillColor;
                        children[i].style.fill = node.labelFillColor;
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
                    // eslint-disable-next-line
                    (this.pdfViewer.nameTable as any)[actualObject.annotName].wrapper.children[0].style.opacity = node.opacity;
                }
                actualObject.opacity = node.opacity;
            }
            actualObject.wrapper.children[0].style.opacity = node.opacity;
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        children[i].style.opacity = node.labelOpacity;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (actualObject.enableShapeLabel && node.labelOpacity !== undefined) {
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        children[i].style.opacity = node.labelOpacity;
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
            updateConnector = true;
        }
        if (node.fontColor !== undefined) {
            actualObject.fontColor = node.fontColor;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                children[1].style.color = node.fontColor;
                if (actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                } else {
                    children[1].horizontalAlignment = 'Auto';
                }
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        children[i].style.color = node.fontColor;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.fontFamily !== undefined) {
            actualObject.fontFamily = node.fontFamily;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                children[1].style.fontFamily = node.fontFamily;
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        children[i].style.fontFamily = node.fontFamily;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.fontSize !== undefined) {
            actualObject.fontSize = node.fontSize;
            if ((actualObject.shapeAnnotationType === 'FreeText' || actualObject.shapeAnnotationType === 'SignatureText') && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
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
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        children[i].style.fontSize = node.fontSize;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.font !== undefined) {
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
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
            actualObject.textAlign = node.textAlign;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                children[1].style.textAlign = node.textAlign;
                if (children[1].childNodes.length === 1) {
                    if (actualObject.textAlign === 'Justify') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    } else if (actualObject.textAlign === 'Right') {
                        children[1].horizontalAlignment = 'Right';
                        children[1].setOffsetWithRespectToBounds(0.97, 0, null);
                    } else if (actualObject.textAlign === 'Left') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    } else if (actualObject.textAlign === 'Center') {
                        children[1].horizontalAlignment = 'Center';
                        children[1].setOffsetWithRespectToBounds(0.46, 0, null);
                    }
                } else if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                }
                else {
                    children[1].horizontalAlignment = 'Auto';
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.thickness !== undefined) {
            actualObject.thickness = node.thickness;
            actualObject.wrapper.children[0].style.strokeWidth = node.thickness;
            if (actualObject.shapeAnnotationType === 'LineWidthArrowHead') {
                actualObject.wrapper.children[1].width = 12 * node.thickness;
                actualObject.wrapper.children[1].height = 12 * node.thickness;
                actualObject.wrapper.children[2].width = 12 * node.thickness;
                actualObject.wrapper.children[2].height = 12 * node.thickness;
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
            // eslint-disable-next-line
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
                // eslint-disable-next-line
                var segment: any = actualObject.wrapper.children[i];
                // eslint-disable-next-line
                const points: any = getConnectorPoints(actualObject);
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
            // eslint-disable-next-line
            let path: any = (actualObject.wrapper.children[0] as PathElement);
            path.data = actualObject.data;
            (path as PathElement).canMeasurePath = true;
        }
        if (isLineShapes(actualObject)) {
            for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                // eslint-disable-next-line
                let childElement: any = actualObject.wrapper.children[i];
                if (!childElement.textNodes) {
                    setElementStype(actualObject, actualObject.wrapper.children[i]);
                }
                if (actualObject.enableShapeLabel === true) {
                    if (actualObject.wrapper.children[i] instanceof TextElement) {
                        actualObject.wrapper.children[i].style.fill = actualObject.labelFillColor;
                    }
                    if ((actualObject.wrapper.children[i] instanceof PathElement && actualObject.measureType === 'Perimeter')) {
                        actualObject.wrapper.children[i].style.fill = 'transparent';
                    }
                } else {
                    if ((actualObject.wrapper.children[i] instanceof PathElement && actualObject.measureType === 'Perimeter') || actualObject.wrapper.children[i] instanceof TextElement) {
                        actualObject.wrapper.children[i].style.fill = 'transparent';
                    }
                }
            }
        }
        if (actualObject && (actualObject.shapeAnnotationType === 'FreeText' || actualObject.enableShapeLabel === true)) {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes) {
                        if (actualObject.shapeAnnotationType === 'FreeText') {
                            if (node.dynamicText) {
                                children[i].content = node.dynamicText;
                                actualObject.dynamicText = node.dynamicText;
                            } else {
                                children[i].content = actualObject.dynamicText;
                            }
                            children[i].width = actualObject.bounds.width;
                        } else if (actualObject.enableShapeLabel === true && actualObject.measureType) {
                            if (node.labelContent) {
                                children[i].content = node.labelContent;
                                actualObject.labelContent = node.labelContent;
                            } else {
                                children[i].content = actualObject.labelContent;
                            }
                            actualObject.notes = children[i].content;
                        } else if (actualObject.enableShapeLabel === true) {
                            if (node.labelContent) {
                                children[i].content = node.labelContent;
                                actualObject.labelContent = node.labelContent;
                            } else {
                                children[i].content = actualObject.labelContent;
                            }
                            actualObject.notes = children[i].content;
                        }
                        children[i].isDirt = true;
                    }
                    /** set text node width less than the parent */
                }
            }
        }
        if (actualObject&& actualObject.shapeAnnotationType === "SignatureText"&& actualObject.wrapper) {
            if (actualObject.wrapper.children && actualObject.wrapper.children.length > 1) {
                actualObject.wrapper.children[1].isDirt = true;
            }
        }
        actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (actualObject && actualObject.formFieldAnnotationType) {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any = actualObject.wrapper.children[0];
                children.actualSize.width = actualObject.wrapper.desiredSize.width;
                children.actualSize.height = actualObject.wrapper.desiredSize.height;
            }
        }
        if (actualObject && actualObject.shapeAnnotationType === 'FreeText' && actualObject.subject === 'Text Box') {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                } else if (children[1].childNodes.length === 1) {
                    if (actualObject.textAlign === 'Justify') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    } else if (actualObject.textAlign === 'Right') {
                        children[1].horizontalAlignment = 'Right';
                        children[1].setOffsetWithRespectToBounds(0.97, 0, null);
                    } else if (actualObject.textAlign === 'Left') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    } else if (actualObject.textAlign === 'Center') {
                        children[1].horizontalAlignment = 'Center';
                        children[1].setOffsetWithRespectToBounds(0.46, 0, null);
                    }
                }
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].textNodes && children[i].textNodes.length > 0) {
                        children[i].isDirt = true;
                        let childNodeHeight: number = children[i].textNodes.length * children[i].textNodes[0].dy;
                        const heightDiff: number = actualObject.bounds.height - childNodeHeight;
                        if (heightDiff > 0 && heightDiff < children[i].textNodes[0].dy) {
                            childNodeHeight = childNodeHeight + children[i].textNodes[0].dy;
                        }
                        if (childNodeHeight > actualObject.bounds.height) {
                            let contString: string = '';
                            for (let index: number = 0; index < children[i].textNodes.length; index++) {
                                // eslint-disable-next-line
                                var childHeight: any = children[i].textNodes[0].dy * (index + 1);
                                // eslint-disable-next-line
                                childHeight = childHeight;
                                contString = contString + children[i].textNodes[index].text;
                            }
                            children[i].content = contString;
                        }
                    }
                    /** set text node width less than the parent */
                    children[i].width = actualObject.bounds.width;
                }
            }
            actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
            actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        }
        this.pdfViewer.renderDrawing(undefined, actualObject.pageIndex);
        if (actualObject && actualObject.shapeAnnotationType === 'FreeText') {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                // eslint-disable-next-line
                let children: any[] = actualObject.wrapper.children;
                if (children[1].childNodes.length === 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Left';
                    children[1].setOffsetWithRespectToBounds(0.5, 0, null);
                } else if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                    children[1].setOffsetWithRespectToBounds(0, 0, null);
                }
            }
        }
    }

    private fontSizeCalculation(actualObject: any, element: any, boundsWidth: number): number {
        var canvas = <HTMLCanvasElement>document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + actualObject.pageIndex);
        const context = canvas.getContext("2d");
        var textwidth = 0;
        var newsize = 0;
        var fontStyle = '';
        if (element.style.italic && element.style.bold) {
            fontStyle = 'bold italic ';
        } else if (element.style.bold) {
            fontStyle = 'bold ';
        } else if (element.style.italic) {
            fontStyle = 'italic ';
        }
        while (boundsWidth > textwidth) {
            context.font = fontStyle + newsize + 'px ' + element.style.fontFamily;
            textwidth = context.measureText(actualObject.dynamicText).width;
            newsize += 0.1;
        }
        newsize -= 0.1;

        return newsize;
    }
    // eslint-disable-next-line
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
        // eslint-disable-next-line
        let node: IElement = (this.pdfViewer.nameTable as any)[obj.id];
        const tempNode: PdfAnnotationBaseModel = node as PdfAnnotationBaseModel;
        const elements: (PdfAnnotationBaseModel)[] = [];
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
        // eslint-disable-next-line max-len
        const constraints: boolean = this.checkBoundaryConstraints(undefined, undefined, (obj as PdfAnnotationBaseModel).pageIndex, obj.wrapper.bounds);
        if (!constraints) {
            this.scaleObject(1 / sw, 1 / sh, refPoint, node, element, refObject);
            //bug (EJ2-62649) : fixed an issue with difficulty on moving/ resizing free text annotation that added in edge of viewer 
            // eslint-disable-next-line
            if ((obj as any).shapeAnnotationType === 'FreeText' && ((obj as any).id.slice(0,9) === 'free_text' || (obj as any).id.slice(0,8) === 'freetext') ){
                let newDiff : any = this.moveInsideViewer(obj);
                this.nodePropertyChange(obj, {
                    bounds: { width: obj.wrapper.width, height: obj.wrapper.height, x: obj.wrapper.offsetX + newDiff.tx, y: obj.wrapper.offsetY + newDiff.ty}
                    });
            }
        }
        return constraints;
    }

    //bug (EJ2-62649) : Implemnted method for calculating optimal bound for free text annotation that outside viewer container 
    private moveInsideViewer(obj: PdfAnnotationBaseModel, tx? : number, ty? : number) : any{
        tx = tx ? tx: 0;
        ty = ty ? ty: 0;
        if ((obj as any).shapeAnnotationType === 'FreeText' && ((obj as any).id.slice(0,9) === 'free_text' || (obj as any).id.slice(0,8) === 'freetext') ){
            // eslint-disable-next-line
             let canvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + (obj as any).pageIndex);
             if(canvas){
                 let bounds : Rect = obj.wrapper.bounds;
                 let width : number = canvas.clientWidth / this.pdfViewer.viewerBase.getZoomFactor();
                 let height : number = canvas.clientHeight / this.pdfViewer.viewerBase.getZoomFactor();
                 let right : number =  bounds.right;
                 let left : number = bounds.left;
                 let top : number =  bounds.top; 
                 let bottom : number = bounds.bottom;
                 // eslint-disable-next-line
                 if (!(right + tx <= width - 3 && left + tx >= 1 && bottom + ty <= height - 3 && top + ty >= 1)) {
                    let txNew : number  = 0;
                    let tyNew : number = 0;
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
                    if(txNew !== 0){
                        tx = txNew;
                    }
                    if(tyNew !== 0){
                        ty = tyNew;
                    }
                 }
             }
         }
         return {tx : tx , ty : ty};
    }

    /**
     * @private
     * @param {number} tx - Specified the tx value.
     * @param {number} ty - Specified the ty value.
     * @param {number} pageIndex - Specified the page index value.
     * @param {Rect} nodeBounds - Specified the node bounds value.
     * @param {boolean} isStamp - Specified the annotation is stamp or not.
     * @param {boolean} isSkip - Specified the annotaion is skip or not.
     * @returns {boolean} - Returns true or false.
     */
    // eslint-disable-next-line max-len
    public checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean, isSkip?: boolean): boolean {
        const selectorBounds: Rect = !nodeBounds ? this.pdfViewer.selectedItems.wrapper.bounds : undefined;
        const bounds: Rect = nodeBounds;
        // eslint-disable-next-line
        let canvas: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        let heightDifference: number = 1;
        if (canvas) {
            const width: number = canvas.clientWidth / this.pdfViewer.viewerBase.getZoomFactor();
            const height: number = canvas.clientHeight / this.pdfViewer.viewerBase.getZoomFactor();
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
            if ((right <= width - 3 && left >= 1 && bottom <= height - 3 && top >= heightDifference) || isSkip) {
                return true;
            }
        }
        return false;
    }
    // eslint-disable-next-line
    private RestrictStamp(source: any): boolean {
        // eslint-disable-next-line max-len
        if (source && source.pageIndex !== undefined && this.pdfViewer.viewerBase.activeElements && source.pageIndex !== this.pdfViewer.viewerBase.activeElements.activePageID) {
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
    // eslint-disable-next-line
    public dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string, currentSelector?: any): boolean {
        let selectorModel: SelectorModel;
        let connector: PdfAnnotationBaseModel; let node: Node;
        let tx: number; let segmentPoint: PointModel;
        let ty: number; let index: number;
        // eslint-disable-next-line
        const checkBezierThumb: boolean = false;
        if (obj instanceof Selector) {
            selectorModel = obj as SelectorModel;
            connector = selectorModel.annotations[0];
        } else {
            connector = obj;
        }
        point = { x: point.x / this.pdfViewer.viewerBase.getZoomFactor(), y: point.y / this.pdfViewer.viewerBase.getZoomFactor() };

        if (this.checkBoundaryConstraints(undefined, undefined, connector.pageIndex, connector.wrapper.bounds)) {
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
                        connector.vertexPoints[length].x = point.x;
                        connector.vertexPoints[length].y = point.y;
                    } else {
                        tx = point.x - leader.point.x;
                        ty = point.y - leader.point.y;
                        connector.vertexPoints[length].x += tx;
                        connector.vertexPoints[length].y += ty;
                    }
                } else {
                    // eslint-disable-next-line
                    var angle: any = Point.findAngle(connector.sourcePoint, connector.targetPoint);
                    // eslint-disable-next-line
                    var center: any = obj.wrapper.children[0].bounds.center;
                    // eslint-disable-next-line
                    var matrix: Matrix = identityMatrix();
                    rotateMatrix(matrix, -angle, center.x, center.y);
                    // eslint-disable-next-line
                    var rotatedPoint: any = transformPointByMatrix(matrix, { x: point.x, y: point.y });
                    if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                        // eslint-disable-next-line
                        var matrix: Matrix = identityMatrix();
                        rotateMatrix(matrix, -angle, center.x, center.y);
                        // eslint-disable-next-line
                        var rotatedPoint1: any = transformPointByMatrix(matrix, connector.vertexPoints[0]);
                        // eslint-disable-next-line
                        var rotatedPoint2: any = transformPointByMatrix(matrix, connector.vertexPoints[connector.vertexPoints.length - 1]);
                        ty = rotatedPoint.y - rotatedPoint1.y;
                        if (connector.leaderHeight === 0 && connector.leaderHeight != null) {
                            connector.leaderHeight = this.pdfViewer.distanceSettings.leaderLength;
                        } else {
                            connector.leaderHeight += ty;
                            rotatedPoint1.y += ty;
                            rotatedPoint2.y += ty;
                            // eslint-disable-next-line
                            var matrix: Matrix = identityMatrix();
                            rotateMatrix(matrix, angle, center.x, center.y);
                            connector.vertexPoints[0] = transformPointByMatrix(matrix, rotatedPoint1);
                            connector.vertexPoints[connector.vertexPoints.length - 1] = transformPointByMatrix(matrix, rotatedPoint2);
                        }
                    }
                }

            } else if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                const i: number = Number(endPoint.split('_')[1]);
                tx = point.x - connector.vertexPoints[i].x;
                ty = point.y - connector.vertexPoints[i].y;
                connector.vertexPoints[i].x += tx;
                connector.vertexPoints[i].y += ty;
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
        // eslint-disable-next-line
        let connector: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[obj.id];
        connector.vertexPoints[i].x += tx;
        connector.vertexPoints[i].y += ty;
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
        let srcDecorator: PointModel;
        let tarDecorator: Point;
        let targetPoint: PointModel;
        connector.vertexPoints = points;
        updateSegmentElement(connector, points, connector.wrapper.children[0] as PathElement);
        const srcPoint: PointModel = connector.sourcePoint;
        const anglePoint: PointModel[] = connector.vertexPoints;
        //  points = this.clipDecorators(connector, points);
        let element: DrawingElement = connector.wrapper.children[0];
        (element as PathElement).canMeasurePath = true;
        for (let i: number = 0; i < connector.wrapper.children.length; i++) {
            element = connector.wrapper.children[i];
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
     * @returns {Object} - Returns the object.
     */
    
    public copy(): Object {
        if (((this.pdfViewer.formDesignerModule && !this.pdfViewer.formDesigner.isPropertyDialogOpen) || this.pdfViewer.annotationModule) && (this.pdfViewer.designerMode || this.pdfViewer.enableAnnotation) && (this.pdfViewer.selectedItems.formFields.length !== 0|| this.pdfViewer.selectedItems.annotations.length!==0)) {
            this.pdfViewer.clipboardData.pasteIndex = 1;
            this.pdfViewer.clipboardData.clipObject = this.copyObjects(); 
        } 
        var isSearchboxDialogOpen = document.getElementById("pdfViewer_search_box").style.display != "none";
        if(this.pdfViewer.formDesigner.isPropertyDialogOpen || isSearchboxDialogOpen){
            this.pdfViewer.clipboardData.clipObject= {};
        }         
        return this.pdfViewer.clipboardData.clipObject;
    }
    /**
     * @private
     * @returns {Object[]} - Returns the object array.
     */
    public copyObjects(): Object[] {
        let selectedItems: PdfAnnotationBaseModel[] | PdfFormFieldBaseModel[] = [];
        const obj: Object[] = [];
        this.pdfViewer.clipboardData.childTable = {};
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            selectedItems = this.pdfViewer.selectedItems.annotations;
            for (let j: number = 0; j < selectedItems.length; j++) {
                const element: Object = cloneObject((selectedItems[j]));
                obj.push(element);
            }
        }
        if (this.pdfViewer.selectedItems.formFields.length > 0) {
            selectedItems = this.pdfViewer.selectedItems.formFields;
            for (let j: number = 0; j < selectedItems.length; j++) {
                const element: Object = cloneObject((selectedItems[j]));
                obj.push(element);
            }
        }
        if (this.pdfViewer.clipboardData.pasteIndex === 0) {
            for (const item of selectedItems) {
                // eslint-disable-next-line
                if ((this.pdfViewer.nameTable as any)[item.id]) {
                    if (!item.formFieldAnnotationType) {
                        if ((item as PdfAnnotationBaseModel).annotName)
                            this.pdfViewer.annotationModule.deleteAnnotationById((item as PdfAnnotationBaseModel).annotName);
                        else
                            this.pdfViewer.annotationModule.deleteAnnotation();
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
            newObj = cloneObject(obj[i]) as PdfAnnotationBaseModel;
            newobjs.push(newObj);
        }
        return newobjs as PdfAnnotationBaseModel[];
    }
    /**
     * @private
     * @param {PdfAnnotationBaseModel[]} obj - Specified the annotation object.
     * @param {number} index - Specified the annotation index.
     * @returns {void}
     */
    public paste(obj: PdfAnnotationBaseModel[], index: number): void {
        let zoomfactor: number = this.pdfViewer.viewerBase.getZoomFactor();
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        if (obj || this.pdfViewer.clipboardData.clipObject) {
            const copiedItems: PdfAnnotationBaseModel[] = obj ? this.getNewObject(obj) :
                this.pdfViewer.clipboardData.clipObject as (PdfAnnotationBaseModel)[];
            if (copiedItems) {
                const objectTable: {} = {};
                if (this.pdfViewer.clipboardData.pasteIndex !== 0) {
                    this.pdfViewer.clearSelection(index);
                }
                for (const copy of copiedItems) {
                    copy.id += randomId();
                    let fieldName = this.splitFormFieldName(copy);
                    let maxNumber = 0;// this.pdfViewer.formFieldCollection.length;
                    if (this.pdfViewer.formDesigner) {
                        this.pdfViewer.formDesigner.setFormFieldIndex();
                        maxNumber = this.pdfViewer.formDesigner.formFieldIndex;
                        (copy as any).name = fieldName + maxNumber;

                    }
                    // eslint-disable-next-line
                    (objectTable as any)[copy.id] = copy;
                }
                for (let j: number = 0; j < copiedItems.length; j++) {
                    const copy: PdfAnnotationBaseModel = copiedItems[j];
                    const pageDiv: HTMLElement = this.pdfViewer.viewerBase.getElement('_pageDiv_' + copy.pageIndex);
                    // eslint-disable-next-line
                    let events: any = event as MouseEvent;
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
                            const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                            copy.bounds.x = (events.clientX - pageCurrentRect.left) / zoomfactor;
                            copy.bounds.y = (events.clientY - pageCurrentRect.top) / zoomfactor;
                        }
                    }
                    const newNode: PdfAnnotationBaseModel = cloneObject(copy);
                    if (this.pdfViewer.viewerBase.contextMenuModule.previousAction !== 'Cut') {
                        newNode.id += randomId();
                        if (this.pdfViewer.annotationModule && newNode.shapeAnnotationType !== 'HandWrittenSignature') {
                            newNode.annotName = newNode.id;
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationCollection(newNode, copiedItems[0], false);
                        }
                        if (newNode.shapeAnnotationType === 'SignatureText' || newNode.shapeAnnotationType === 'HandWrittenSignature' || newNode.shapeAnnotationType === 'SignatureImage') {
                            this.pdfViewer.viewerBase.signatureModule.storeSignatureData(newNode.pageIndex, newNode);
                        }
                        if (!newNode.formFieldAnnotationType) {
                            this.pdfViewer.annotation.addAction(newNode.pageIndex, null, newNode as PdfAnnotationBase, 'Addition', '', newNode as PdfAnnotationBase, newNode);
                        }
                    } else {
                        if (this.pdfViewer.annotationModule) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationCollection(newNode, copiedItems[0], true);
                        }
                        if (newNode.shapeAnnotationType === 'SignatureText' || newNode.shapeAnnotationType === 'HandWrittenSignature' || newNode.shapeAnnotationType === 'SignatureImage') {
                            this.pdfViewer.viewerBase.signatureModule.storeSignatureData(newNode.pageIndex, newNode);
                        }
                    }
                    const addedAnnot: PdfAnnotationBaseModel | PdfFormFieldBaseModel = this.add(newNode);
                    if (this.pdfViewer.formDesigner && addedAnnot.formFieldAnnotationType) {
                        this.pdfViewer.annotation.addAction(newNode.pageIndex, null, addedAnnot as PdfFormFieldBase, 'Addition', '', addedAnnot as PdfFormFieldBase, addedAnnot as PdfFormFieldBase);
                    }
                    if ((newNode.shapeAnnotationType === 'FreeText' || newNode.enableShapeLabel) && addedAnnot) {
                        this.nodePropertyChange(addedAnnot, {});
                    }
                    if (addedAnnot.formFieldAnnotationType && addedAnnot.pageIndex === index) {
                        this.pdfViewer.formFieldCollection.push(addedAnnot);
                        // eslint-disable-next-line max-len
                        const formField: FormFieldModel = {id: addedAnnot.id, name: (addedAnnot as PdfFormFieldBaseModel).name, value: (addedAnnot as PdfFormFieldBaseModel).value, type: addedAnnot.formFieldAnnotationType as FormFieldType,
                            isReadOnly: addedAnnot.isReadonly, fontFamily: addedAnnot.fontFamily,
                            // eslint-disable-next-line max-len
                            fontSize: addedAnnot.fontSize, fontStyle: addedAnnot.fontStyle as unknown as FontStyle, color: (addedAnnot as PdfFormFieldBaseModel).color, backgroundColor: (addedAnnot as PdfFormFieldBaseModel).backgroundColor,
                            // eslint-disable-next-line max-len
                            alignment: (addedAnnot as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (addedAnnot as PdfFormFieldBaseModel).visibility, maxLength: (addedAnnot as PdfFormFieldBaseModel).maxLength, isRequired: (addedAnnot as PdfFormFieldBaseModel).isRequired,
                            // eslint-disable-next-line max-len
                            isPrint: addedAnnot.isPrint, isSelected: (addedAnnot as PdfFormFieldBaseModel).isSelected, isChecked: (addedAnnot as PdfFormFieldBaseModel).isChecked, tooltip: (addedAnnot as PdfFormFieldBaseModel).tooltip, bounds: addedAnnot.bounds as IFormFieldBound, thickness: addedAnnot.thickness, borderColor: (addedAnnot as PdfFormFieldBaseModel).borderColor, signatureIndicatorSettings: (addedAnnot as PdfFormFieldBaseModel).signatureIndicatorSettings
                        };
                        if ((addedAnnot as PdfFormFieldBaseModel).options && (addedAnnot as PdfFormFieldBaseModel).options.length > 0) {
                            formField.options = (addedAnnot as PdfFormFieldBaseModel).options;
                        }
                        this.pdfViewer.formFieldCollections.push(formField);
                        // eslint-disable-next-line max-len
                        this.pdfViewer.formDesigner.drawHTMLContent(addedAnnot.formFieldAnnotationType, addedAnnot.wrapper.children[0] as DiagramHtmlElement, addedAnnot, (addedAnnot as PdfFormFieldBaseModel).pageIndex, this.pdfViewer);
                    }
                    this.pdfViewer.select([newNode.id], this.pdfViewer.annotationSelectorSettings);
                    if (!addedAnnot.formFieldAnnotationType) {
                        this.pdfViewer.annotationModule.triggerAnnotationAddEvent(newNode);
                    };
                }
            }
            this.pdfViewer.renderDrawing(undefined, index);
            this.pdfViewer.clipboardData.pasteIndex++;
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }

    private splitFormFieldName(obj: any) {
        // eslint-disable-next-line
        let field = null;
        if (obj) {
            switch (obj.formFieldAnnotationType) {
                case 'Textbox':
                    field = "Textbox";
                    break;
                case 'PasswordField':
                    field = "Password";
                    break;
                case 'Checkbox':
                    field = "Check Box";
                    break;
                case 'RadioButton':
                    field = "Radio Button";
                    break;
                case 'DropdownList':
                    field = "Dropdown";
                    break;
                case 'ListBox':
                    field = "List Box";
                    break;
                case 'SignatureField':
                    field = "Signature";
                    break;
                case 'InitialField':
                    field = "Initial";
                    break;
            }
        }
        return field;
    }

    private calculateCopyPosition(copy: PdfAnnotationBaseModel, pageDiv: HTMLElement, events: MouseEvent): void {
        let zoomfactor: number = this.pdfViewer.viewerBase.getZoomFactor();
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        for (let i: number = 0; i < copy.vertexPoints.length; i++) {
            if (pageDiv) {
                if (i === 0) {
                    const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                    x1 = copy.vertexPoints[i].x;
                    y1 = copy.vertexPoints[i].y;
                    copy.vertexPoints[i].x = (events.clientX - pageCurrentRect.left) / zoomfactor;
                    copy.vertexPoints[i].y = (events.clientY - pageCurrentRect.top) / zoomfactor;
                    x2 = copy.vertexPoints[i].x;
                    y2 = copy.vertexPoints[i].y;
                } else {
                    copy.vertexPoints[i].x += x2 - x1;
                    copy.vertexPoints[i].y += y2 - y1;
                }
            }
        }
    }
    /**
     * @private
     * @param {number} index - Specified the annotaion index.
     * @returns {void}
     */
    public cut(index: number): void {
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.removedAnnotationCollection = [];
        }
        if (((this.pdfViewer.formDesignerModule && !this.pdfViewer.formDesigner.isPropertyDialogOpen) || this.pdfViewer.selectedItems.annotations.length>0) &&  (this.pdfViewer.designerMode || this.pdfViewer.selectedItems.annotations.length>0) && (this.pdfViewer.selectedItems.formFields.length !== 0|| this.pdfViewer.selectedItems.annotations.length!==0)) {
            this.pdfViewer.clipboardData.pasteIndex = 0;
            this.pdfViewer.clipboardData.clipObject = this.copyObjects();
            this.pdfViewer.renderDrawing(undefined, index);
            this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
        }
        var isSearchboxDialogOpen = document.getElementById("pdfViewer_search_box").style.display != "none";
        if(this.pdfViewer.formDesigner.isPropertyDialogOpen || isSearchboxDialogOpen){
            this.pdfViewer.clipboardData.clipObject= {};
        }  
    }
    /**
     * @private
     * @param {Object[]} nodeArray - Specified the node array.
     * @param {string} sortID - Specified the sort id.
     * @returns {Object[]} - Returns the node array.
     */
    public sortByZIndex(nodeArray: Object[], sortID?: string): Object[] {
        const id: string = sortID ? sortID : 'zIndex';
        nodeArray = nodeArray.sort((a: Object, b: Object): number => {
            // eslint-disable-next-line
            return (a as any)[id] - (b as any)[id];
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
