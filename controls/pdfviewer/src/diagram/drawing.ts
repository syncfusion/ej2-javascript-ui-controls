import { PdfViewer } from '../pdfviewer/pdfviewer';
import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { ZOrderPageTable, PdfAnnotationBase } from './pdf-annotation';
// tslint:disable-next-line:max-line-length
import { Container, Rect, PointModel, Point, Matrix, identityMatrix, rotateMatrix, getDiagramElement, ThumbsConstraints, BaseAttributes, RectAttributes, CircleAttributes, IElement, scaleMatrix, cornersPointsBeforeRotation, Corners, SelectorConstraints, LineAttributes, ImageElement } from '@syncfusion/ej2-drawings';
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
// tslint:disable-next-line:max-line-length
import { getConnectorPoints, updateSegmentElement, getSegmentElement, updateDecoratorElement, getDecoratorElement, clipDecorators, initDistanceLabel, initLeaders, initLeader, getPolygonPath, initPerimeterLabel } from './connector-util';

/**
 * Renderer module is used to render basic diagram elements
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
     */
    public renderLabels(viewer: PdfViewer): void {
        let annotations: PdfAnnotationBaseModel[] = viewer.annotations;
        for (let i: number = 0; i < annotations.length; i++) {
            let annotation: PdfAnnotationBaseModel = annotations[i];
            this.initObject(annotation);
        }
    }

    private createNewZindexTable(pageId: number): ZOrderPageTable {
        let zIndexTable: ZOrderPageTable = new ZOrderPageTable();
        this.pdfViewer.zIndex++;
        zIndexTable.pageId = this.pdfViewer.zIndex;
        this.pdfViewer.zIndexTable.push(zIndexTable);
        return zIndexTable;
    }
    /**
     * @private
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
     */
    public setZIndex(index: number, obj: PdfAnnotationBaseModel): void {
        if (obj.pageIndex !== undefined) {
            let pageTable: ZOrderPageTable = this.getPageTable(obj.pageIndex);
            if (obj.zIndex === -1) {
                pageTable.zIndex++;
                obj.zIndex = pageTable.zIndex;
                pageTable.objects.push(obj);
            } else {
                let index: number = obj.zIndex;
                let tabelLength: number = pageTable.objects.length;
                obj.zIndex = tabelLength++;
                pageTable.objects.push(obj);
            }
        }
    }

    /**
     * @private
     */
    public initObject(obj: PdfAnnotationBaseModel): PdfAnnotationBaseModel {
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
        if ((obj as PdfAnnotationBaseModel).wrapper === null) {
            //Init default wrapper
        }
        // tslint:disable-next-line:no-any
        (this.pdfViewer.nameTable as any)[(obj as PdfAnnotationBaseModel).id] = obj;
        //Add some methodologies to add the children of group to name table
        return obj;
    }

    private initNode(obj: PdfAnnotationBaseModel): void {
        let canvas: Container = this.initContainer(obj);
        let content: DrawingElement;
        if (!canvas.children) { canvas.children = []; }
        if (!content) {
            content = this.init(obj, canvas);
        }
        //canvas.children.push(content);
        canvas.rotateAngle = obj.rotateAngle;
        canvas.measure(new Size((obj as PdfAnnotationBaseModel).wrapper.width, (obj as PdfAnnotationBaseModel).wrapper.height));
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
     */
    /* tslint:disable */
    public init(obj: PdfAnnotationBaseModel, canvas: Container): DrawingElement {
        let content: DrawingElement;
        content = new DrawingElement();
        let textStyle: TextStyle;
        // let changedProperties: string = 'changedProperties';
        let changedProperties: string = 'cangedProperties';
        let oldProperties: string = 'oldProperties';
        let pathContent: PathElement;
        let basicElement: DrawingElement;
        let isStamp: boolean = false;
        switch (obj.shapeAnnotationType) {
            case 'Ellipse':
                pathContent = new PathElement();
                pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
                content = pathContent;
                canvas.children.push(content);
                break;
            case 'Path':
                pathContent = new PathElement();
                pathContent.data = obj.data;
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
                if (obj.isDynamicStamp) {
                    canvas.horizontalAlignment = 'Left';
                    basicElement = new DrawingElement();
                    content = basicElement;
                    content.cornerRadius = 10;
                    content.style.fill = obj.stampFillColor;
                    content.style.strokeColor = obj.stampStrokeColor;
                    canvas.children.push(content);
                    let textele: TextElement = this.textElement(obj);;
                    textele = new TextElement();
                    textele.style.fontFamily = "Helvetica";
                    textele.style.fontSize = 14;
                    textele.style.italic = true;
                    textele.style.bold = true;
                    textele.style.color = obj.fillColor;
                    textele.rotateValue = undefined;
                    textele.content = obj.dynamicText;
                    textele.relativeMode = 'Point';
                    textele.margin.left = 10;
                    textele.margin.bottom = -7;
                    textele.setOffsetWithRespectToBounds(0, 0.57, null)
                    textele.relativeMode = 'Point';
                    canvas.children.push(textele);
                    var pathContent1 = new PathElement();
                    pathContent1.id = randomId() + '_stamp'
                    pathContent1.data = obj.data;
                    pathContent1.width = obj.bounds.width;
                    pathContent1.height = obj.bounds.height / 2;
                    pathContent1.rotateValue = undefined;

                    pathContent1.margin.left = 10;

                    pathContent1.margin.bottom = -5;
                    pathContent1.relativeMode = 'Point';

                    pathContent1.setOffsetWithRespectToBounds(0, 0.1, null);
                    var content1 = pathContent1;
                    pathContent1.style.fill = obj.fillColor;
                    pathContent1.style.strokeColor = obj.strokeColor;
                    pathContent1.style.opacity = obj.opacity;
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                    content.style.opacity = obj.opacity;
                    content.rotateAngle = obj.rotateAngle;
                    canvas.children.push(content1);
                }
                else {
                    canvas.horizontalAlignment = 'Left';
                    basicElement = new DrawingElement();
                    content = basicElement;
                    content.cornerRadius = 10;
                    content.style.fill = obj.stampFillColor;
                    content.style.strokeColor = obj.stampStrokeColor;
                    canvas.children.push(content);
                    var pathContent1 = new PathElement();
                    pathContent1.id = randomId() + '_stamp'
                    pathContent1.data = obj.data;
                    pathContent1.width = obj.bounds.width;
                    pathContent1.height = obj.bounds.height;
                    pathContent1.minWidth = pathContent1.width / 2;
                    pathContent1.minHeight = pathContent1.height / 2;
                    var content1 = pathContent1;
                    pathContent1.style.fill = obj.fillColor;
                    pathContent1.style.strokeColor = obj.strokeColor;
                    pathContent1.style.opacity = obj.opacity;
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                    content.minWidth = pathContent1.width / 2;
                    content.minHeight = pathContent1.height / 2;
                    content.style.opacity = obj.opacity;
                    content.rotateAngle = obj.rotateAngle;
                    canvas.children.push(content1);
                    canvas.minHeight = content.minHeight + 20;
                    canvas.minWidth = content.minWidth + 20;
                }
                break;
            case 'Image':
                let pathContent11 = new ImageElement();
                pathContent11.source = obj.data;
                content = pathContent11;
                canvas.children.push(content);
                break;
            case 'Rectangle':
                basicElement = new DrawingElement();
                content = basicElement;
                canvas.children.push(content);
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
                this.setNodePosition(basicElement, obj)
                basicElement.rotateAngle = obj.rotateAngle;
                setElementStype(obj, basicElement);
                canvas.children.push(basicElement);
                let textele: TextElement = this.textElement(obj);;
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
                this.setNodePosition(basicElement, obj)
                basicElement.rotateAngle = obj.rotateAngle;
                setElementStype(obj, basicElement);
                canvas.children.push(basicElement);
                textele = this.textElement(obj);
                let length: number = findPointsLength([
                    { x: obj.bounds.x, y: obj.bounds.y },
                    { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }]);
                textele.content = this.pdfViewer.annotation.measureAnnotationModule.setConversion((length / 2) * this.pdfViewer.annotation.measureAnnotationModule.pixelToPointFactor, obj);
                textele.rotateValue = { y: -10, x: obj.bounds.width / 4, angle: obj.rotateAngle };
                canvas.children.push(textele);
                break;
            case 'StickyNotes':
                let pathContent2 = new ImageElement();
                pathContent2.source = obj.data;
                pathContent2.width = obj.bounds.width;
                pathContent2.height = obj.bounds.height;
                pathContent2.style.strokeColor = obj.strokeColor;
                pathContent2.style.strokeWidth = 0;
                content = pathContent2;
                canvas.children.push(content);
                break;
        }
        content.id = obj.id + '_content'; content.relativeMode = 'Object';
        if (!isStamp) {
            if (obj.bounds.width !== undefined) {
                content.width = obj.bounds.width;
            }
            content.horizontalAlignment = 'Stretch';
            if (obj.bounds.height !== undefined) {
                content.height = obj.bounds.height;
            }
            setElementStype(obj, content);
        }
        content.isRectElement = true;
        content.verticalAlignment = 'Stretch';
        return content;
    }
    private textElement(obj: PdfAnnotationBaseModel): TextElement {
        let textele: TextElement = new TextElement();
        setElementStype(obj, textele);
        textele.horizontalAlignment = 'Center';
        textele.verticalAlignment = 'Top';
        textele.relativeMode = 'Object';
        textele.setOffsetWithRespectToBounds(.5, .5, 'Absolute');
        return textele;
    }
    /**
     * @private
     */
    public setNodePosition(obj: DrawingElement, node: PdfAnnotationBaseModel) {
        if (node.shapeAnnotationType === 'Perimeter') {
            obj.offsetX = node.bounds.x + node.bounds.width / 2;
            obj.offsetY = node.bounds.y + node.bounds.height / 2;
        } else if (node.shapeAnnotationType === 'Radius') {
            let trasPoint: PointModel = { x: node.bounds.x + (node.bounds.width / 2) + (node.bounds.width / 4), y: node.bounds.y + (node.bounds.height / 2) }
            let center: PointModel = { x: (node.bounds.x + (node.bounds.width / 2)), y: (node.bounds.y + (node.bounds.height / 2)) };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, node.rotateAngle, center.x, center.y);
            let rotatedPoint: PointModel = transformPointByMatrix(matrix, trasPoint);
            let newPoint1: PointModel = { x: rotatedPoint.x, y: rotatedPoint.y };
            obj.offsetX = newPoint1.x;
            obj.offsetY = newPoint1.y;
            obj.width = node.bounds.width / 2;
        }
    }
    /* tslint:enable */
    /**
     * @private
     */
    public initContainer(obj: PdfAnnotationBaseModel): Container {
        if (!obj.id) {
            obj.id = randomId();
        }
        // Creates canvas element
        let canvas: Container;
        canvas = new Canvas();
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
     */
    // tslint:disable-next-line:no-any
    public initLine(obj: PdfAnnotationBaseModel): Canvas {
        if (!obj.id) {
            obj.id = randomId();
        }
        let bpmnElement: PathElement;
        let container: Canvas = new Canvas();
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
        let bounds: Rect;
        let points: PointModel[] = [];
        points = getConnectorPoints(obj);
        //  points = this.clipDecorators(this, points);
        let leaders: PathElement[] = [];
        let labels: TextElement[] = [];
        if (obj.shapeAnnotationType === 'Distance') {
            leaders = initLeaders(obj, points);
            labels = initDistanceLabel(obj, points, this.pdfViewer.annotation.measureAnnotationModule);
        }

        if ((obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead') && obj.measureType === 'Perimeter') {
            labels = initPerimeterLabel(obj, points);
        }

        points = clipDecorators(obj, points);
        bounds = Rect.toBounds(points);
        container.width = bounds.width;
        container.height = bounds.height;
        container.offsetX = bounds.x + container.pivot.x * bounds.width;
        container.offsetY = bounds.y + container.pivot.y * bounds.height;
        let anglePoints: PointModel[] = obj.vertexPoints as PointModel[];

        let accessContent: string = 'getDescription';
        // tslint:disable-next-line:max-line-length
        if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' || obj.shapeAnnotationType === 'Distance') {
            srcDecorator = getDecoratorElement(
                obj, points[0], anglePoints[1], true);
            targetDecorator = getDecoratorElement(
                obj, points[points.length - 1], anglePoints[anglePoints.length - 2], false);
        }
        srcDecorator.id = obj.id + '_srcDec';
        targetDecorator.id = obj.id + '_tarDec';

        /* tslint:disable:no-string-literal */
        segment.style['fill'] = 'transparent';
        container.style.strokeColor = 'transparent';
        container.style.fill = 'transparent';
        container.style.strokeWidth = 0;
        container.children = [];
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
     */
    public add(obj: PdfAnnotationBaseModel): PdfAnnotationBaseModel {
        obj = new PdfAnnotationBase(this.pdfViewer, 'annotations', obj as PdfAnnotationBase, true);
        obj = this.initObject(obj) as PdfAnnotationBaseModel;
        this.pdfViewer.annotations.push(obj);
        return obj;
    }
    /**
     * @private
     */
    public remove(obj: PdfAnnotationBaseModel): void {
        let index: number = obj.pageIndex;
        for (let i: number = 0; i < this.pdfViewer.annotations.length; i++) {
            let annotation: PdfAnnotationBaseModel = this.pdfViewer.annotations[i];
            if (annotation.id === obj.id) {
                this.pdfViewer.annotations.splice(i, 1);
                let objects: (PdfAnnotationBaseModel)[] = this.getPageObjects(obj.pageIndex);
                for (let j: number = 0; j < objects.length; j++) {
                    if (objects[j].id === obj.id) {
                        objects.splice(j, 1);
                    }
                }
                // need to add code snippet to remove from z index table
            }
        }
        this.pdfViewer.renderDrawing(undefined, index);
    }
    /**
     * @private
     */
    public getPageObjects(pageIndex: number): (PdfAnnotationBaseModel)[] {
        let pageTable: ZOrderPageTable = this.getPageTable(pageIndex);
        return pageTable.objects;
    }
    /**
     * @private
     */
    public refreshCanvasDiagramLayer(diagramLayer?: HTMLCanvasElement, pageIndex?: number): void {
        if (!diagramLayer) {
            diagramLayer = (document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex) as HTMLCanvasElement);
        }
        if (diagramLayer) {
            let width: number = diagramLayer.width / this.pdfViewer.viewerBase.getZoomFactor();
            let height: number = diagramLayer.height / this.pdfViewer.viewerBase.getZoomFactor();
            let zoom: number = this.pdfViewer.viewerBase.getZoomFactor();
            let ctx: CanvasRenderingContext2D = diagramLayer.getContext('2d');
            ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
            ctx.clearRect(0, 0, width, height);

            let objects: (PdfAnnotationBaseModel)[] = this.getPageObjects(pageIndex);
            for (let i: number = 0; i < objects.length; i++) {
                // tslint:disable-next-line:no-any
                let renderElement: DrawingElement = (this.pdfViewer.nameTable as any)[objects[i].id].wrapper;
                refreshDiagramElements(diagramLayer, [renderElement], this.renderer);
            }
        }
    }

    /**
     * @private
     */
    public clearHighlighter(index?: number): void {
        let adornerSvg: SVGElement = this.getAdornerLayerSvg(this.pdfViewer.element.id + index + '_diagramAdornerLayer', index);
        if (adornerSvg) {
            let highlighter: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_highlighter') as SVGElement;
            if (highlighter) {
                highlighter.parentNode.removeChild(highlighter);
            }
        }
    }
    /**
     * @private
     */
    public getSelectorElement(diagramId: string, index?: number): SVGElement {
        let adornerLayer: SVGElement = null;
        let adornerSvg: SVGSVGElement = this.getAdornerLayerSvg(diagramId, index);
        if (adornerSvg) {
            adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement') as SVGElement;
        }
        return adornerLayer;
    }


    /**
     * @private
     */
    public getAdornerLayerSvg(diagramId: string, index?: number): SVGSVGElement {
        let adornerLayerSvg: SVGSVGElement = null;
        let diagramElement: HTMLElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
        let elementcoll: NodeList;
        if (diagramElement) {
            elementcoll = diagramElement.getElementsByClassName('e-adorner-layer' + index);
            adornerLayerSvg = elementcoll[0] as SVGSVGElement;
        }
        return adornerLayerSvg;
    }
    /**
     * @private
     */
    public clearSelectorLayer(index?: number): void {
        let adornerSvg: SVGElement = this.getAdornerLayerSvg(this.pdfViewer.element.id, index);
        if (adornerSvg) {
            let selectionRect: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(this.pdfViewer.adornerSvgLayer.id + '_selected_region') as SVGElement;
            if (selectionRect) {
                selectionRect.parentNode.removeChild(selectionRect);
            }
            this.clearHighlighter(index);
            let childNodes: NodeList = this.getSelectorElement(this.pdfViewer.element.id, index).childNodes;
            let child: SVGElement;
            for (let i: number = childNodes.length; i > 0; i--) {
                child = childNodes[i - 1] as SVGElement;
                child.parentNode.removeChild(child);
            }
        }
    }

    /**
     * @private
     */
    public renderSelector(select?: number, helper?: PdfAnnotationBaseModel): void {
        if (!helper) {
            let size: Size = new Size();
            let selectorModel: Selector = this.pdfViewer.selectedItems as Selector;
            this.clearSelectorLayer(select);
            if (selectorModel.wrapper) {
                selectorModel.wrapper.measure(size);
                let zoom: number = this.pdfViewer.viewerBase.getZoomFactor();
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
                let bounds: Rect = selectorModel.wrapper.bounds;
                // tslint:disable-next-line
                let selectorElement: (any);
                if (selectorModel.annotations.length) {
                    for (let j: number = 0; j < selectorModel.annotations.length; j++) {
                        let node: PdfAnnotationBaseModel = selectorModel.annotations[j];
                        selectorElement = this.getSelectorElement(this.pdfViewer.element.id, select);
                        let constraints: boolean = true;
                        if (selectorElement && node.pageIndex === select) {
                            if (node.shapeAnnotationType === 'Distance' || node.shapeAnnotationType === 'Line' ||
                                node.shapeAnnotationType === 'LineWidthArrowHead' || node.shapeAnnotationType === 'Polygon') {
                                this.renderEndPointHandle(
                                    node, selectorElement, selectorModel.thumbsConstraints,
                                    { scale: zoom, tx: 0, ty: 0 }, undefined,
                                    undefined,
                                    true);
                            } else {
                                if (node.shapeAnnotationType === 'StickyNotes') {
                                    this.renderResizeHandle(
                                        node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom,
                                        undefined, undefined, undefined, false, true);
                                } else {
                                    if (this.pdfViewer.tool !== 'Stamp') {
                                        this.renderResizeHandle(
                                            node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom,
                                            undefined, undefined, undefined, node.shapeAnnotationType === 'Stamp');
                                    }
                                }
                            }
                            if (node.annotName !== '') {
                                this.pdfViewer.annotationModule.selectAnnotation(node.annotName, node.pageIndex, node);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Rotates the given nodes/connectors by the given angle
     * @param obj Defines the objects to be rotated
     * @param angle Defines the angle by which the objects have to be rotated
     * @param pivot Defines the reference point with reference to which the objects have to be rotated
     */
    /**
     * @private
     */
    public rotate(obj: PdfAnnotationBaseModel | SelectorModel, angle: number, pivot?: PointModel): boolean {
        let checkBoundaryConstraints: boolean;
        if (obj) {
            pivot = pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
            if (obj instanceof Selector) {
                obj.rotateAngle += angle;
                obj.wrapper.rotateAngle += angle;
                let objects: PdfAnnotationBaseModel[] = [];
                objects = objects.concat(obj.annotations);
                this.rotateObjects(obj, objects, angle, pivot);
            } else {
                this.rotateObjects(obj as PdfAnnotationBaseModel, [obj] as (PdfAnnotationBaseModel)[], angle, pivot);
            }
        }
        return checkBoundaryConstraints;
    }


    /**
     * @private
     */
    public rotateObjects(
        parent: PdfAnnotationBaseModel | SelectorModel, objects: PdfAnnotationBaseModel[], angle: number, pivot?: PointModel,
        includeParent?: boolean): void {
        pivot = pivot || {};
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivot.x, pivot.y);
        for (let obj of objects) {
            if (obj instanceof PdfAnnotationBase) {
                if (includeParent !== false || parent !== obj) {
                    obj.rotateAngle += angle;
                    obj.rotateAngle = (obj.rotateAngle + 360) % 360;
                    let newOffset: PointModel = transformPointByMatrix(matrix, { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY });
                    obj.wrapper.offsetX = newOffset.x;
                    obj.wrapper.offsetY = newOffset.y;
                    this.nodePropertyChange(obj, { rotateAngle: obj.rotateAngle });
                }
                this.renderSelector(obj.pageIndex);

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
     */
    public renderBorder(
        selector: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, enableNode?: number,
        isBorderTickness?: boolean, isSwimlane?: boolean, isSticky?: boolean)
        :
        void {
        let wrapper: DrawingElement = selector;
        let options: BaseAttributes = getBaseShapeAttributes(wrapper, transform);
        transform = transform || { scale: 1, tx: 0, ty: 0 };
        if (!isSticky) {
            options.x *= transform.scale;
            options.y *= transform.scale;
            options.width *= transform.scale;
            options.height *= transform.scale;
            options.fill = 'transparent'; options.stroke = 'black';
            options.strokeWidth = 2;
            options.dashArray = '6,3';
            options.class = 'e-diagram-border';
            if (isSwimlane) { options.class += ' e-diagram-lane'; }
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
            options.stroke = 'black';
            options.strokeWidth = 1;
            options.dashArray = '6,3';
        }
        let parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector') as SVGSVGElement;
        // tslint:disable-next-line:max-line-length
        this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, this.pdfViewer.element.id, undefined, true, parentSvg);
    }

    /**
     * @private
     */
    public renderCircularHandle(
        id: string, selector: DrawingElement, cx: number, cy: number, canvas: HTMLCanvasElement | SVGElement,
        visible: boolean, enableSelector?: number, t?: Transforms, connected?: boolean, canMask?: boolean,
        ariaLabel?: Object, count?: number, className?: string)
        :
        void {
        let wrapper: DrawingElement = selector;
        let radius: number = 7;
        let newPoint: PointModel = { x: cx, y: cy };

        t = t || { scale: 1, tx: 0, ty: 0 };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }

        let options: CircleAttributes = getBaseShapeAttributes(wrapper) as CircleAttributes;
        options.stroke = 'black';
        options.strokeWidth = 1;
        if (count !== undefined) {
            radius = 5;
            options.id = 'segmentEnd_' + count;
        }
        options.fill = '#FF4081';
        options.centerX = (newPoint.x + t.tx) * t.scale;
        options.centerY = (newPoint.y + t.ty) * t.scale;
        options.radius = radius;
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
        options.width = 8 * t.scale;
        options.height = 8 * t.scale;
        options.x = (newPoint.x * t.scale) - (options.width / 2);
        options.y = (newPoint.y * t.scale) - (options.height / 2);
        let parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector') as SVGSVGElement;
        // tslint:disable-next-line:max-line-length
        this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, id, undefined, true, parentSvg);
    }

    /**
     * @private
     */
    public renderRotateThumb(
        wrapper: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        let element: PathElement = new PathElement();
        let newPoint: PointModel;
        let top: number = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
        let left: number = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
        let pivotX: number = left + wrapper.pivot.x * wrapper.actualSize.width;
        let pivotY: number = top;
        pivotX = (pivotX + transform.tx) * transform.scale;
        pivotY = (pivotY + transform.ty) * transform.scale;
        newPoint = { x: pivotX, y: pivotY - 25 };

        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            let matrix: Matrix = identityMatrix();
            rotateMatrix(
                matrix, wrapper.rotateAngle + wrapper.parentTransform,
                (transform.tx + wrapper.offsetX) * transform.scale, (transform.ty + wrapper.offsetY) * transform.scale);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        let options: CircleAttributes = getBaseShapeAttributes(wrapper) as CircleAttributes;
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
        // tslint:disable-next-line:max-line-length
        this.svgRenderer.drawCircle(canvas as SVGElement, options, ThumbsConstraints.Rotate, { 'aria-label': 'Thumb to rotate the selected object' });
    }
    /**
     * @private
     */
    public renderResizeHandle(
        element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints, currentZoom: number,
        canMask?: boolean, enableNode?: number,
        nodeConstraints?: boolean, isStamp?: boolean, isSticky?: boolean)
        :
        void {
        let left: number = element.offsetX - element.actualSize.width * element.pivot.x;
        let top: number = element.offsetY - element.actualSize.height * element.pivot.y;
        let height: number = element.actualSize.height;
        let width: number = element.actualSize.width;
        let transform: Transforms = { scale: currentZoom, tx: 0, ty: 0 } as Transforms;
        if (isStamp) {
            this.renderPivotLine(element, canvas, transform);
            this.renderRotateThumb(element, canvas, transform);
        }
        this.renderBorder(
            element, canvas, transform, enableNode, nodeConstraints, true, isSticky);
        let nodeWidth: number = element.actualSize.width * currentZoom;
        let nodeHeight: number = element.actualSize.height * currentZoom;

        if (!nodeConstraints && !isSticky) {
            if ((nodeWidth >= 40 && nodeHeight >= 40) || isStamp) {
                //Hide corners when the size is less than 40
                this.renderCircularHandle(
                    'resizeNorthWest', element, left, top, canvas, true,
                    constraints & ThumbsConstraints.ResizeNorthWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top left side direction' },
                    undefined, 'e-diagram-resize-handle e-northwest');

                this.renderCircularHandle(
                    'resizeNorthEast', element, left + width, top, canvas, true,
                    constraints & ThumbsConstraints.ResizeNorthEast, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top right side direction' },
                    undefined, 'e-diagram-resize-handle e-northeast');

                this.renderCircularHandle(
                    'resizeSouthWest', element, left, top + height, canvas, true,
                    constraints & ThumbsConstraints.ResizeSouthWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on bottom left side direction' },
                    undefined,
                    'e-diagram-resize-handle e-southwest');

                this.renderCircularHandle(
                    'resizeSouthEast', element, left + width, top + height, canvas,
                    true, constraints & ThumbsConstraints.ResizeSouthEast, transform,
                    undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom right side direction' },
                    undefined,
                    'e-diagram-resize-handle e-southeast');

            }
            if (!isStamp) {
                this.renderCircularHandle(
                    'resizeNorth', element, left + width / 2, top, canvas,
                    true, constraints & ThumbsConstraints.ResizeNorth, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top side direction' }, undefined,
                    'e-diagram-resize-handle e-north');

                this.renderCircularHandle(
                    'resizeSouth', element, left + width / 2, top + height, canvas,
                    true, constraints & ThumbsConstraints.ResizeSouth, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on bottom side direction' }, undefined,
                    'e-diagram-resize-handle e-south');

                this.renderCircularHandle(
                    'resizeWest', element, left, top + height / 2, canvas, true,
                    constraints & ThumbsConstraints.ResizeWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on left side direction' }, undefined,
                    'e-diagram-resize-handle e-west');

                this.renderCircularHandle(
                    'resizeEast', element, left + width, top + height / 2, canvas, true,
                    constraints & ThumbsConstraints.ResizeEast, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on right side direction' }, undefined,
                    'e-diagram-resize-handle e-east');
            }
        }
    }

    /**
     * @private
     */
    public renderPivotLine(
        element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        let wrapper: DrawingElement = element;
        let dashArray: string = '2,3';
        let visible: boolean = true;
        if (canMask) {
            visible = false;
        }
        let options: BaseAttributes = getBaseShapeAttributes(wrapper, transform);
        options.fill = 'None'; options.stroke = 'black'; options.strokeWidth = 1;
        options.dashArray = dashArray; options.visible = visible;
        let scale: number = transform.scale;
        options.x *= scale;
        options.y *= scale;
        options.width *= scale;
        options.height *= scale;
        options.id = 'pivotLine';
        options.class = 'e-diagram-pivot-line';
        let startPoint: PointModel = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: -20 };
        let endPoint: PointModel = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: 0 };
        (options as LineAttributes).startPoint = startPoint;
        (options as LineAttributes).endPoint = endPoint;
        this.svgRenderer.drawLine(canvas as SVGElement, options as LineAttributes);
    }

    /**
     * @private
     */
    public renderEndPointHandle(
        selector: PdfAnnotationBaseModel, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints,
        transform: Transforms, connectedSource: boolean,
        connectedTarget?: boolean, isSegmentEditing?: boolean): void {
        transform = transform || { tx: 0, ty: 0, scale: 1 };
        let sourcePoint: PointModel = selector.sourcePoint;
        let targetPoint: PointModel = selector.targetPoint;
        let wrapper: DrawingElement = selector.wrapper; let i: number;
        for (i = 0; i < selector.vertexPoints.length; i++) {
            let segment: PointModel = selector.vertexPoints[i];
            this.renderCircularHandle(
                ('segementThumb_' + (i + 1)), wrapper, segment.x, segment.y, canvas, true,
                constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i);
        }
        let leaderCount: number = 0;
        if (selector.shapeAnnotationType === 'Distance') {
            for (i = 0; i < selector.wrapper.children.length; i++) {
                let segment: DrawingElement = selector.wrapper.children[i];
                let newPoint1: PointModel;
                let angle: number = Point.findAngle(selector.sourcePoint, selector.targetPoint);
                if (segment.id.indexOf('leader') > -1) {
                    let center: PointModel = selector.wrapper.children[0].bounds.center;
                    if (leaderCount === 0) {
                        newPoint1 = { x: selector.sourcePoint.x, y: selector.sourcePoint.y - selector.leaderHeight };
                        center = sourcePoint;
                    } else {
                        newPoint1 = { x: selector.targetPoint.x, y: selector.targetPoint.y - selector.leaderHeight };
                        center = targetPoint;

                    }
                    let matrix: Matrix = identityMatrix();
                    rotateMatrix(matrix, angle, center.x, center.y);
                    let rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                    // tslint:disable-next-line:max-line-length
                    this.renderCircularHandle(('leaderThumb_' + (i + 1)), wrapper, rotatedPoint.x, rotatedPoint.y, canvas, true, constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i);
                    leaderCount++;
                }
            }
        }
    }
    /**
     * @private
     */
    public initSelectorWrapper(): void {
        let selectorModel: SelectorModel = this.pdfViewer.selectedItems;
        (selectorModel as Selector).init(this);
    }

    /**
     * @private
     */
    public select(objArray: string[], multipleSelection?: boolean, preventUpdate?: boolean): void {
        let selectorModel: SelectorModel = this.pdfViewer.selectedItems;
        for (let i: number = 0; i < objArray.length; i++) {
            // tslint:disable-next-line
            let obj: any = (this.pdfViewer.nameTable as any)[objArray[i]]
            if (!(obj instanceof Selector) && obj.wrapper.visible) {
                selectorModel.annotations.push(obj);
                this.initSelectorWrapper();
                selectorModel.wrapper.rotateAngle = selectorModel.rotateAngle = 0;
                selectorModel.wrapper.children.push(obj.wrapper);
                if (!preventUpdate) {
                    this.renderSelector(obj.pageIndex);
                }
            }
        }
    }
    /**
     * @private
     */
    public dragSelectedObjects(tx: number, ty: number, pageIndex: number, helper: PdfAnnotationBaseModel): boolean {
        let obj: SelectorModel | PdfAnnotationBaseModel = this.pdfViewer.selectedItems;

        this.drag(obj, tx, ty, helper);
        return true;
    }
    /**
     * @private
     */
    public drag(obj: PdfAnnotationBaseModel | SelectorModel, tx: number, ty: number, helper: PdfAnnotationBaseModel): void {
        if (obj instanceof Selector) {
            if (obj.annotations.length) {
                for (let node of obj.annotations) {
                    this.drag(node, tx, ty, helper);
                    this.renderSelector(node.pageIndex, helper);
                }
            }
        } else {

            this.dragAnnotation(obj as PdfAnnotationBaseModel, tx, ty);
        }
    }

    /**
     * @private
     */
    public dragAnnotation(obj: PdfAnnotationBaseModel, tx: number, ty: number): void {
        let tempNode: PdfAnnotationBaseModel;
        let elements: PdfAnnotationBaseModel[] = [];
        // tslint:disable-next-line
        let oldValues: any = { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
        obj.wrapper.offsetX += tx;
        obj.wrapper.offsetY += ty;
        if (isLineShapes(obj) || obj.shapeAnnotationType === 'Polygon') {
            if (obj.wrapper.children.length) {
                let nodes: DrawingElement[] = obj.wrapper.children;
                for (let i: number = 0; i < nodes.length; i++) {
                    nodes[i].offsetX += tx;
                    nodes[i].offsetY += ty;
                }
            }
            this.dragControlPoint(obj, tx, ty, true);
        }

        this.nodePropertyChange(obj, { bounds: { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY } } as PdfAnnotationBaseModel);
        obj.wrapper.measureChildren = false;
        // tslint:disable-next-line
        let canvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + (obj as any).pageIndex);
        // tslint:disable-next-line
        this.pdfViewer.renderDrawing(canvas as HTMLCanvasElement, (obj as any).pageIndex);

    }
    /**
     * @private
     */
    public dragControlPoint(obj: PdfAnnotationBaseModel, tx: number, ty: number, preventUpdate?: boolean, segmentNumber?: number): boolean {
        // tslint:disable-next-line
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
     */
    public updateEndPoint(connector: PdfAnnotationBaseModel): void {
        this.nodePropertyChange(connector, { vertexPoints: connector.vertexPoints } as PdfAnnotationBaseModel);
        this.renderSelector(connector.pageIndex);
    }
    /**
     * @private
     */
    /* tslint:disable */
    public nodePropertyChange(
        actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void {
        let existingBounds: Rect = actualObject.wrapper.outerBounds;
        let existingInnerBounds: Rect = actualObject.wrapper.bounds;
        let updateConnector = false;
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
                let children: DrawingElement[] = actualObject.wrapper.children;
                for (let i: number = 0; i < children.length; i++) {
                    if (children[i].id) {
                        let names: string[] = children[i].id.split('_');
                        if (names.length && (names.indexOf('perimeter') > -1 || names.indexOf('radius') > -1)) {
                            this.setNodePosition(children[i], actualObject);
                        } else if (names.length && (names.indexOf('srcDec') > -1)) {
                            children[i].offsetX = actualObject.vertexPoints[0].x;
                            children[i].offsetY = actualObject.vertexPoints[0].y;
                        } else if (names.length && names.indexOf('tarDec') > -1) {
                            children[i].offsetX = actualObject.vertexPoints[actualObject.vertexPoints.length - 1].x;
                            children[i].offsetY = actualObject.vertexPoints[actualObject.vertexPoints.length - 1].y;
                        } else if (names.length && (names.indexOf('stamp') > -1)) {
                            let ratio: any = 0;
                            let heightRatio: number = 2;
                            if (actualObject.wrapper.width != undefined && actualObject.wrapper.height != undefined) {
                                ratio = 20;
                                heightRatio = 2.9;
                            }
                            if (actualObject.isDynamicStamp) {
                                children[i].width = actualObject.bounds.width - ratio;
                                children[i].height = (actualObject.bounds.height / 2) - ratio;
                                let element: any = children[1] as TextElement;
                                element.style.fontSize = ((actualObject.bounds.height / 2) / heightRatio);
                                if (ratio != 0) {
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
        if (node.taregetDecoraterShapes !== undefined) {
            actualObject.taregetDecoraterShapes = node.taregetDecoraterShapes; update = true;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.fillColor !== undefined) {
            actualObject.fillColor = node.fillColor;
            actualObject.wrapper.children[0].style.fill = node.fillColor; update = true;
        }
        if (node.opacity !== undefined) {
            if (actualObject.shapeAnnotationType == "Stamp") {
                actualObject.wrapper.children[1].style.opacity = node.opacity;
                if (actualObject.wrapper.children[2]) {
                    actualObject.wrapper.children[2].style.opacity = node.opacity;
                }
            } else {
                actualObject.opacity = node.opacity;
            }
            actualObject.wrapper.children[0].style.opacity = node.opacity; update = true;
            updateConnector = true;
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
        if (node.thickness !== undefined) {
            actualObject.thickness = node.thickness;
            actualObject.wrapper.children[0].style.strokeWidth = node.thickness; update = true;
            updateConnector = true;
        }
        if (node.borderDashArray !== undefined) {
            actualObject.borderDashArray = node.borderDashArray;
            actualObject.wrapper.children[0].style.strokeDashArray = node.borderDashArray;
        }
        if (node.borderStyle !== undefined) {
            actualObject.borderStyle = node.borderStyle;
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
                var segment = actualObject.wrapper.children[i];
                let points = getConnectorPoints(actualObject);

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
            let path = (actualObject.wrapper.children[0] as PathElement);
            path.data = actualObject.data;
            (path as PathElement).canMeasurePath = true;
        }
        if (isLineShapes(actualObject)) {
            for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                setElementStype(actualObject, actualObject.wrapper.children[i]);
                if ((actualObject.wrapper.children[i] instanceof PathElement && actualObject.measureType === 'Perimeter') || actualObject.wrapper.children[i] instanceof TextElement) {
                    actualObject.wrapper.children[i].style.fill = 'transparent';
                }
            }
        }
        actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        this.pdfViewer.renderDrawing(undefined, actualObject.pageIndex);
    }
    /* tslint:disable */
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
     */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        let obj: SelectorModel | PdfAnnotationBaseModel = this.pdfViewer.selectedItems;
        return this.scale(obj, sx, sy, pivot);
    }
    /**
     * @private
     */
    public scale(obj: PdfAnnotationBaseModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean {
        let checkBoundaryConstraints: boolean = true;
        if (obj instanceof Selector) {
            if (obj.annotations && obj.annotations.length) {
                for (let node of obj.annotations) {
                    checkBoundaryConstraints = this.scaleAnnotation(node, sx, sy, pivot, obj);
                }
            }
        } else {
            checkBoundaryConstraints = this.scaleAnnotation(
                obj as PdfAnnotationBaseModel, sx, sy, pivot, undefined);
        }
        return checkBoundaryConstraints;
    }

    /**
     * @private
     */
    public scaleObject(sw: number, sh: number, pivot: PointModel, obj: IElement, element: DrawingElement, refObject: IElement): void {
        sw = sw < 0 ? 1 : sw; sh = sh < 0 ? 1 : sh; let process: string[];
        if (sw !== 1 || sh !== 1) {
            let width: number; let height: number;
            if (!isLineShapes(obj)) {

                let node: PdfAnnotationBaseModel = obj; let isResize: boolean; let bound: Rect;
                width = node.wrapper.actualSize.width * sw; height = node.wrapper.actualSize.height * sh;
                if (isResize) {
                    width = Math.max(width, (bound.right - node.wrapper.bounds.x));
                    height = Math.max(height, (bound.bottom - node.wrapper.bounds.y));
                }
                sw = width / node.wrapper.actualSize.width; sh = height / node.wrapper.actualSize.height;
            }
            let matrix: Matrix = identityMatrix();
            let refWrapper: DrawingElement;
            if (!refObject) { refObject = obj; }
            refWrapper = refObject.wrapper;
            rotateMatrix(matrix, -refWrapper.rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, sw, sh, pivot.x, pivot.y);
            rotateMatrix(matrix, refWrapper.rotateAngle, pivot.x, pivot.y);
            if (!isLineShapes(obj)) {
                let node: PdfAnnotationBaseModel = obj; let left: number; let top: number;
                let newPosition: PointModel = transformPointByMatrix(matrix, { x: node.wrapper.offsetX, y: node.wrapper.offsetY });
                let oldleft: number = node.wrapper.offsetX - node.wrapper.actualSize.width;
                let oldtop: number = node.wrapper.offsetY - node.wrapper.actualSize.height;
                if (width > 0) {
                    node.wrapper.width = width; node.wrapper.offsetX = newPosition.x;
                }
                if (height > 0) {
                    node.wrapper.height = height; node.wrapper.offsetY = newPosition.y;
                }
                left = node.wrapper.offsetX - node.wrapper.actualSize.width;// * node.pivot.x;
                top = node.wrapper.offsetY - node.wrapper.actualSize.height;// * node.pivot.y;
                this.nodePropertyChange(obj as PdfAnnotationBaseModel, {
                    bounds: { width: node.wrapper.width, height: node.wrapper.height, x: node.wrapper.offsetX, y: node.wrapper.offsetY, }
                } as PdfAnnotationBaseModel);

            }
        }
    }
    /**
     * @private
     */
    public scaleAnnotation(obj: PdfAnnotationBaseModel, sw: number, sh: number, pivot: PointModel, refObject?: IElement): boolean {
        let node: IElement = (this.pdfViewer.nameTable as any)[obj.id];
        let tempNode: PdfAnnotationBaseModel = node as PdfAnnotationBaseModel;
        let elements: (PdfAnnotationBaseModel)[] = [];
        let element: DrawingElement = node.wrapper;
        if (!refObject) { refObject = obj as IElement; }
        let refWrapper: Container = refObject.wrapper;
        let x: number = refWrapper.offsetX - refWrapper.actualSize.width * refWrapper.pivot.x;
        let y: number = refWrapper.offsetY - refWrapper.actualSize.height * refWrapper.pivot.y;
        let refPoint: PointModel = this.getShapePoint(
            x, y, refWrapper.actualSize.width, refWrapper.actualSize.height,
            refWrapper.rotateAngle, refWrapper.offsetX, refWrapper.offsetY, pivot);
        if (element.actualSize.width !== undefined && element.actualSize.height !== undefined) {
            this.scaleObject(sw, sh, refPoint, node, element, refObject);
            let bounds: Rect = this.getShapeBounds(obj.wrapper);
        }
        let constraints: boolean = this.checkBoundaryConstraints(undefined, undefined, (obj as PdfAnnotationBaseModel).pageIndex, obj.wrapper.bounds);
        if (!constraints) {
            this.scaleObject(1 / sw, 1 / sh, refPoint, node, element, refObject);
        }

        return constraints;
    }
    /**
     * @private
     */
    public checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean): boolean {
        let selectorBounds: Rect = !nodeBounds ? this.pdfViewer.selectedItems.wrapper.bounds : undefined;
        let bounds: Rect = nodeBounds;
        let canvas = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        let heightDifference: number = 10;
        if (canvas) {
            let width: number = canvas.clientWidth / this.pdfViewer.viewerBase.getZoomFactor();
            let height: number = canvas.clientHeight / this.pdfViewer.viewerBase.getZoomFactor();
            let right: number = (nodeBounds ? bounds.right : selectorBounds.right) + (tx || 0);
            let left: number = (nodeBounds ? bounds.left : selectorBounds.left) + (tx || 0);
            let top: number = (nodeBounds ? bounds.top : selectorBounds.top) + (ty || 0);
            let bottom: number = (nodeBounds ? bounds.bottom : selectorBounds.bottom) + (ty || 0);
            if (isStamp) {
                heightDifference = 50;
                if (this.pdfViewer.viewerBase.eventArgs && this.pdfViewer.viewerBase.eventArgs.source) {
                    if (this.RestrictStamp(this.pdfViewer.viewerBase.eventArgs.source)) {
                        return false;
                    }
                }
            }
            if (right <= width - 10 && left >= 10
                && bottom <= height - 10 && top >= heightDifference) {
                return true;
            }
        }
        return false;
    }
    private RestrictStamp(source: any): boolean {
        // tslint:disable-next-line:max-line-length
        if (source && source.pageIndex !== undefined && this.pdfViewer.viewerBase.activeElements && source.pageIndex !== this.pdfViewer.viewerBase.activeElements.activePageID) {
            return true;
        }
        return false;
    }

    /**
     * @private
     */
    public getShapeBounds(shapeElement: DrawingElement): Rect {
        let shapeBounds: Rect = new Rect();
        let shapeCorners: Rect;
        shapeCorners = cornersPointsBeforeRotation(shapeElement);
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
            let matrix: Matrix = identityMatrix();
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
     */
    public getShapePoint(
        x: number, y: number, w: number, h: number, angle: number, offsetX: number, offsetY: number, cornerPoint: PointModel): PointModel {
        let pivotPoint: PointModel = { x: 0, y: 0 };
        let transformMatrix: Matrix = identityMatrix();
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
     */
    public dragConnectorEnds(
        endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string):
        boolean {
        let selectorModel: SelectorModel;
        let connector: PdfAnnotationBaseModel; let node: Node;
        let tx: number; let segmentPoint: PointModel;
        let ty: number; let index: number;
        let checkBezierThumb: boolean = false;
        if (obj instanceof Selector) {
            selectorModel = obj as SelectorModel;
            connector = selectorModel.annotations[0];
        } else {
            connector = obj;
        }
        point = { x: point.x / this.pdfViewer.viewerBase.getZoomFactor(), y: point.y / this.pdfViewer.viewerBase.getZoomFactor() };

        if (this.checkBoundaryConstraints(undefined, undefined, connector.pageIndex, connector.wrapper.bounds)) {
            if (connector.shapeAnnotationType === 'Distance') {
                let leader: Leader = isLeader(connector, endPoint);
                if (endPoint === 'Leader0') {
                    tx = point.x - leader.point.x;
                    ty = point.y - leader.point.y;
                    connector.vertexPoints[0].x += tx;
                    connector.vertexPoints[0].y += ty;
                } else if (endPoint === 'Leader1') {
                    let length: number = connector.vertexPoints.length - 1;
                    tx = point.x - leader.point.x;
                    ty = point.y - leader.point.y;
                    connector.vertexPoints[length].x += tx;
                    connector.vertexPoints[length].y += ty;
                } else {
                    var angle = Point.findAngle(connector.sourcePoint, connector.targetPoint);
                    var center = obj.wrapper.children[0].bounds.center;
                    var matrix = identityMatrix();
                    rotateMatrix(matrix, -angle, center.x, center.y);
                    var rotatedPoint = transformPointByMatrix(matrix, { x: point.x, y: point.y });
                    if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                        var matrix = identityMatrix();
                        rotateMatrix(matrix, -angle, center.x, center.y);
                        var rotatedPoint1 = transformPointByMatrix(matrix, connector.vertexPoints[0]);
                        var rotatedPoint2 = transformPointByMatrix(matrix, connector.vertexPoints[connector.vertexPoints.length - 1]);
                        ty = rotatedPoint.y - rotatedPoint1.y;
                        connector.leaderHeight += ty;
                        rotatedPoint1.y += ty;
                        rotatedPoint2.y += ty;
                        var matrix = identityMatrix();
                        rotateMatrix(matrix, angle, center.x, center.y);
                        connector.vertexPoints[0] = transformPointByMatrix(matrix, rotatedPoint1);
                        connector.vertexPoints[connector.vertexPoints.length - 1] = transformPointByMatrix(matrix, rotatedPoint2);
                    }
                }

            } else if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                let i: number = Number(endPoint.split('_')[1]);
                tx = point.x - connector.vertexPoints[i].x;
                ty = point.y - connector.vertexPoints[i].y;
                connector.vertexPoints[i].x += tx;
                connector.vertexPoints[i].y += ty;
            }
            this.nodePropertyChange(connector, { vertexPoints: connector.vertexPoints } as PdfAnnotationBaseModel);
            this.renderSelector(connector.pageIndex);
        }
        this.pdfViewer.renderDrawing();
        return true;
    }
    /**
     * @private
     */
    public dragSourceEnd(
        obj: PdfAnnotationBaseModel, tx: number, ty: number, i: number):
        boolean {
        let connector: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[obj.id];
        connector.vertexPoints[i].x += tx;
        connector.vertexPoints[i].y += ty;

        this.pdfViewer.renderDrawing();
        return true;
    }

    /**
     * @private
     */
    public updateConnector(connector: PdfAnnotationBaseModel, points: PointModel[]): void {
        let srcPoint: PointModel; let anglePoint: PointModel[]; let srcDecorator: PointModel;
        let tarDecorator: Point; let targetPoint: PointModel;
        connector.vertexPoints = points;
        updateSegmentElement(connector, points, connector.wrapper.children[0] as PathElement);
        srcPoint = connector.sourcePoint;
        anglePoint = connector.vertexPoints;
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
     */
    public copy(): Object {
        this.pdfViewer.clipboardData.pasteIndex = 1;
        this.pdfViewer.clipboardData.clipObject = this.copyObjects();
        return this.pdfViewer.clipboardData.clipObject;
    }
    /**
     * @private
     */
    public copyObjects(): Object[] {
        let selectedItems: PdfAnnotationBaseModel[] = [];
        let obj: Object[] = [];
        this.pdfViewer.clipboardData.childTable = {};
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            selectedItems = this.pdfViewer.selectedItems.annotations;
            for (let j: number = 0; j < selectedItems.length; j++) {
                let element: Object;
                element = cloneObject((selectedItems[j]));
                obj.push(element)

            }
        }

        if (this.pdfViewer.clipboardData.pasteIndex === 0) {
            //  this.startGroupAction();
            for (let item of selectedItems) {
                if ((this.pdfViewer.nameTable as any)[item.id]) {

                    this.pdfViewer.remove(item);
                }
            }
            //this.endGroupAction();
        }
        this.sortByZIndex(obj, 'zIndex');
        return obj;
    }
    private getNewObject(obj: PdfAnnotationBaseModel[]): PdfAnnotationBaseModel[] {
        let newObj: PdfAnnotationBaseModel;
        let newobjs: PdfAnnotationBaseModel[] = [];
        this.pdfViewer.clipboardData.pasteIndex = 1;
        for (let i: number = 0; i < obj.length; i++) {
            newObj = cloneObject(obj[i]) as PdfAnnotationBaseModel;
            newobjs.push(newObj);
        }
        return newobjs as PdfAnnotationBaseModel[];
    }
    /**
     * @private
     */
    public paste(obj: PdfAnnotationBaseModel[], index: number): void {
        if (obj || this.pdfViewer.clipboardData.clipObject) {
            let copiedItems: PdfAnnotationBaseModel[] = obj ? this.getNewObject(obj) :
                this.pdfViewer.clipboardData.clipObject as (PdfAnnotationBaseModel)[];
            if (copiedItems) {
                let multiSelect: boolean = copiedItems.length !== 1;
                let groupAction: boolean = false;
                let objectTable: {} = {};
                let keyTable: {} = {};

                if (this.pdfViewer.clipboardData.pasteIndex !== 0) {
                    this.pdfViewer.clearSelection(index);
                }
                for (let copy of copiedItems) {
                    (objectTable as any)[copy.id] = copy;
                }
                for (let j: number = 0; j < copiedItems.length; j++) {
                    let copy: PdfAnnotationBaseModel = copiedItems[j];
                    if (isLineShapes(copy)) {
                        for (let i: number = 0; i < copy.vertexPoints.length; i++) {
                            copy.vertexPoints[i].x += 10;
                            copy.vertexPoints[i].y += 10;
                        }
                    } else {
                        copy.bounds.x += 10;
                        copy.bounds.y += 10;
                    }
                    let newNode: PdfAnnotationBaseModel = cloneObject(copy);
                    if (this.pdfViewer.viewerBase.contextMenuModule.previousAction !== 'Cut') {
                        newNode.id += randomId();
                        if (this.pdfViewer.annotationModule) {
                            newNode.annotName = newNode.id;
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationCollection(newNode, copiedItems[0]);
                        }
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.addAction(newNode.pageIndex, null, newNode as PdfAnnotationBase, 'Addition', '', newNode as PdfAnnotationBase, newNode);
                    }
                    this.add(newNode);
                    this.pdfViewer.select([newNode.id]);

                }
            }
            this.pdfViewer.renderDrawing(undefined, index);
            this.pdfViewer.clipboardData.pasteIndex++;
        }
    }


    /**
     * @private
     */
    public cut(index: number): void {
        this.pdfViewer.clipboardData.pasteIndex = 0;
        this.pdfViewer.clipboardData.clipObject = this.copyObjects();
        this.pdfViewer.renderDrawing(undefined, index);
    }
    /**
     * @private
     */
    public sortByZIndex(nodeArray: Object[], sortID?: string): Object[] {
        let id: string = sortID ? sortID : 'zIndex';
        nodeArray = nodeArray.sort((a: Object, b: Object): number => {
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