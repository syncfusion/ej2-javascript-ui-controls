import { DiagramElement } from '../core/elements/diagram-element';
import { PathElement } from '../core/elements/path-element';
import { ImageElement } from '../core/elements/image-element';
import { TextElement } from '../core/elements/text-element';
import { Container } from '../core/containers/container';
import { rotateMatrix, identityMatrix, transformPointByMatrix, Matrix } from '../primitives/matrix';
import { Size } from '../primitives/size';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { ConnectorModel } from '../objects/connector-model';
import { wordBreakToString, whiteSpaceToString, textAlignToString } from '../utility/base-util';
import { getUserHandlePosition, canShowCorner, getInterval, getSpaceValue } from '../utility/diagram-util';
import { getDiagramElement, getAdornerLayer, getGridLayer, getHTMLLayer, updatePath } from '../utility/dom-util';
import { measurePath, getBackgroundLayerSvg, getBackgroundImageLayer, setAttributeSvg } from '../utility/dom-util';
import { SnapSettingsModel } from '../../diagram/diagram/grid-lines-model';
import { Gridlines } from '../../diagram/diagram/grid-lines';
import { BackgroundModel } from '../../diagram/diagram/page-settings-model';
import { PathAttributes, TextAttributes, LineAttributes, CircleAttributes } from './canvas-interface';
import { RectAttributes, ImageAttributes, BaseAttributes } from './canvas-interface';
import { Stretch, WhiteSpace, TextAlign, TextWrap, SnapConstraints, RendererAction, FlipDirection } from '../enum/enum';
import { ThumbsConstraints, SelectorConstraints, ElementAction } from '../enum/enum';
import { TransformFactor as Transforms } from '../interaction/scroller';
import { SelectorModel } from '../objects/node-model';
import { IRenderer } from './../rendering/IRenderer';
import { SvgRenderer } from './svg-renderer';
import { CanvasRenderer } from './canvas-renderer';
import { processPathData, splitArrayCollection, transformPath } from '../utility/path-util';
import { isDiagramChild } from '../utility/diagram-util';
import { DiagramNativeElement } from '../core/elements/native-element';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { BezierSegment, StraightSegment, OrthogonalSegment } from '../objects/connector';
import { Point } from '../primitives/point';
import { RulerSettingsModel } from '../diagram/ruler-settings-model';
import { RulerModel, Ruler } from '../../ruler';
import { canDrawThumbs, avoidDrawSelector } from '../utility/constraints-util';

/**
 * Renderer module is used to render basic diagram elements
 */
/** @private */
export class DiagramRenderer {
    /**   @private  */
    public renderer: IRenderer = null;
    private diagramId: string;
    /** @private */
    public isSvgMode: Boolean = true;
    private svgRenderer: SvgRenderer;
    private nativeSvgLayer: SVGSVGElement;
    private diagramSvgLayer: SVGSVGElement;
    private iconSvgLayer: SVGSVGElement;
    /** @private */
    public adornerSvgLayer: SVGSVGElement;
    /** @private */
    public rendererActions: RendererAction;
    private groupElement: Container;
    private element: HTMLElement;
    private transform: PointModel = { x: 0, y: 0 };
    constructor(name: string, svgRender: IRenderer, isSvgMode: Boolean) {
        this.diagramId = name;
        this.element = getDiagramElement(this.diagramId);
        this.svgRenderer = svgRender as SvgRenderer;
        this.isSvgMode = isSvgMode;
        this.renderer = isSvgMode ? new SvgRenderer() : new CanvasRenderer();
    }

    /**   @private  */
    public setCursor(canvas: HTMLElement, cursor: string): void {
        canvas.style.cursor = cursor;
    }

    /** @private */
    public setLayers(): void {
        this.iconSvgLayer = this.element.getElementsByClassName('e-ports-expand-layer')[0] as SVGSVGElement;
        this.adornerSvgLayer = this.element.getElementsByClassName('e-adorner-layer')[0] as SVGSVGElement;
        this.nativeSvgLayer = this.element.getElementsByClassName('e-native-layer')[0] as SVGSVGElement;
        this.diagramSvgLayer = this.element.getElementsByClassName('e-diagram-layer')[0] as SVGSVGElement;
    }

    private getAdornerLayer(): SVGElement {
        let adornerLayer: SVGElement = getAdornerLayer(this.diagramId);
        return adornerLayer;
    }

    private getParentSvg(element: DiagramElement, targetElement?: string, canvas?: HTMLCanvasElement | SVGElement): SVGSVGElement {
        if (this.diagramId && element && element.id) {
            if (element.id.split('_icon_content').length > 1 || element.id.split('_nodeport').length > 1 ||
                (element.elementActions & ElementAction.ElementIsPort)) {
                return this.iconSvgLayer;
            }
            if (targetElement && targetElement === 'selector') {
                return this.adornerSvgLayer;
            } else if (element instanceof DiagramNativeElement) {
                return this.nativeSvgLayer;
            } else {
                return this.diagramSvgLayer;
            }
        }
        return canvas as SVGSVGElement;
    }

    private getParentElement(
        element: DiagramElement, defaultParent: HTMLCanvasElement | SVGElement, svgElement: SVGSVGElement, indexValue?: number):
        SvgParent {
        let layerGElement: HTMLCanvasElement | SVGElement = defaultParent;
        if (svgElement && this.diagramId && element && element.id) {
            if (element.id.split('_icon_content').length > 1) {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramExpander') as SVGElement;
                defaultParent = null;
            } else if (element.id.split('_nodeport').length > 1) {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramPorts') as SVGElement;
            } else if (element instanceof DiagramNativeElement) {
                layerGElement = svgElement.getElementById(this.diagramId + '_nativeLayer') as SVGElement;
                defaultParent = null;
            } else if (element.elementActions & ElementAction.ElementIsPort) {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramPorts') as SVGElement;
                defaultParent = null;
            } else {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramLayer') as SVGElement;
            }
            let groupElement: SvgParent = this.getGroupElement(element, defaultParent || layerGElement, indexValue);
            layerGElement = groupElement.g;
            if (groupElement.svg) {
                svgElement = groupElement.svg;
            }
        }
        return { g: layerGElement, svg: svgElement };
    }

    private getGroupElement(element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, indexValue?: number): SvgParent {
        let gElement: SVGGElement;
        let parentSvg: SVGSVGElement = this.getParentSvg(element);
        let svgElement: SVGSVGElement;
        if (canvas && parentSvg) {
            if (parentSvg) {
                gElement = parentSvg.getElementById(element.id + '_groupElement') as SVGGElement;
                if (!gElement && parentSvg !== this.nativeSvgLayer) {//code added
                    let nativeSvg: SVGSVGElement = this.nativeSvgLayer;
                    gElement = nativeSvg.getElementById(element.id + '_groupElement') as SVGGElement;
                    svgElement = nativeSvg;

                }
            }
            if (!gElement) {
                gElement = this.svgRenderer.createGElement('g', { id: element.id + '_groupElement' });
                if (indexValue !== undefined && canvas.childNodes.length > indexValue) {
                    canvas.insertBefore(gElement, canvas.childNodes[indexValue]);

                } else {
                    canvas.appendChild(gElement);
                }
            }
        }
        return { g: gElement, svg: svgElement };
    }

    /**   @private  */
    public renderElement(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement, transform?: Transforms,
        parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean, indexValue?: number, isPreviewNode?: boolean):
        void {
        let isElement: boolean = true;
        if (element instanceof Container) {
            isElement = false;
            this.renderContainer(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue, isPreviewNode);
        } else if (element instanceof ImageElement) {
            this.renderImageElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof PathElement) {
            this.renderPathElement(element, canvas, transform, parentSvg, fromPalette, isPreviewNode);
        } else if (element instanceof TextElement) {
            this.renderTextElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof DiagramNativeElement) {
            this.renderNativeElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof DiagramHtmlElement) {
            this.renderHTMLElement(element, canvas, htmlLayer, transform, parentSvg, fromPalette, indexValue);
        } else {
            this.renderRect(element, canvas, transform, parentSvg, isPreviewNode);
        }
    }

    /**   @private  */
    public drawSelectionRectangle(x: number, y: number, w: number, h: number, canvas: HTMLCanvasElement | SVGElement, t: Transforms):
        void {
        x = (x + t.tx) * t.scale;
        y = (y + t.ty) * t.scale;
        let options: BaseAttributes = {
            width: w * t.scale, height: h * t.scale,
            x: x + 0.5, y: y + 0.5, fill: 'transparent', stroke: 'gray', angle: 0,
            pivotX: 0.5, pivotY: 0.5, strokeWidth: 1,
            dashArray: '6 3', opacity: 1,
            visible: true, id: canvas.id + '_selected_region'
        };
        let adornerLayer: SVGElement = this.getAdornerLayer();
        this.svgRenderer.updateSelectionRegion(adornerLayer as SVGElement, options);
    }

    /**
     * @private
     */
    public renderHighlighter(element: DiagramElement, canvas: SVGElement, transform: Transforms): void {
        let width: number = element.actualSize.width || 2;
        let height: number = element.actualSize.height || 2;
        let x: number = element.offsetX - width * element.pivot.x;
        let y: number = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        y = (y + transform.ty) * transform.scale;
        let options: RectAttributes = {
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#8CC63F', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 4,
            dashArray: '', opacity: 1, cornerRadius: 0,
            visible: true, id: canvas.id + '_highlighter', class: 'e-diagram-highlighter'
        };
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, canvas as SVGSVGElement);
    }

    /**
     * @private
     */
    public renderStackHighlighter(
        element: DiagramElement, canvas: SVGElement, transform: Transforms, isVertical: Boolean, position: PointModel, isUml?: boolean,
        isSwimlane?: boolean): void {
        let width: number = element.actualSize.width || 2;
        let x: number = element.offsetX - width * element.pivot.x;
        let height: number = element.actualSize.height || 2;
        let y: number = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        let data: string;
        let bounds: Rect = element.bounds;
        let newPathString: string = '';

        y = (y + transform.ty) * transform.scale;
        if (!isVertical) {
            let d: number = height * transform.scale;
            data = 'M 10 -10 L 0 0 Z M -10 -10 L 0 0 Z M 0 0 L 0 ' + (d) + ' Z M 0  ' + (d) +
                ' L -10  ' + (d + 10) + ' Z L 10  ' + (d + 10) + ' Z';
            if (position.x >= element.offsetX) {
                x += width;
            }
        } else {
            if (isUml) {
                let d: number = width * transform.scale;
                data = 'M 0 0 L ' + (d + 2) + ' 0 Z';
                let scaleX: number = - bounds.x;
                let scaleY: number = - bounds.y;
                let arrayCollection: Object[] = [];
                scaleX = element.actualSize.width / Number(bounds.width ? bounds.width : 1) * transform.scale;
                scaleY = element.actualSize.height / Number(bounds.height ? bounds.height : 1) * transform.scale;
                let umlData: string = 'M7,4 L8,4 8,7 11,7 11,8 8,8 8,11 7,11 7,8 4,8 4,7 7,7 z M7.5,0.99999994' +
                    'C3.9160004,1 1,3.9160004 0.99999994,7.5 1,11.084 3.9160004,14 7.5,14 11.084,14 14,11.084 14,7.5 14,' +
                    '3.9160004 11.084,1 7.5,0.99999994 z M7.5,0 C11.636002,0 15,3.3639984 15,7.5 15,11.636002 11.636002,15 7.5,' +
                    '15 3.3640003,15 0,11.636002 0,7.5 0,3.3639984 3.3640003,0 7.5,0 z';
                arrayCollection = processPathData(umlData);
                arrayCollection = splitArrayCollection(arrayCollection);
                newPathString = transformPath(arrayCollection, scaleX + d + 2, scaleY - 8, false, bounds.x, bounds.y, 0, 0);
                if (position.y >= element.offsetY) {
                    y += height;
                }
            } else {
                if (isSwimlane) {
                    if (position.y >= element.offsetY) {
                        y += height;
                    }
                }
                let d: number = width * transform.scale;
                data = 'M -10 -10 L 0 0 Z M -10 10 L 0 0 Z M 0 0 L ' + (d) + ' 0 Z M ' + (d) + ' 0 L ' +
                    (d + 10) + ' 10 Z L ' + (d + 10) + ' -10 Z';

            }
        }


        let options: PathAttributes = {
            data: data + newPathString,
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#8CC63F', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 1,
            dashArray: '', opacity: 1,
            visible: true, id: canvas.id + '_stack_highlighter', class: 'e-diagram-highlighter',
        };
        (this.svgRenderer as SvgRenderer).drawPath(canvas, options, this.diagramId);
    }
    /**   @private  */
    public drawLine(canvas: SVGElement, options: LineAttributes): void {
        (this.svgRenderer as SvgRenderer).drawLine(canvas, options);
    }

    /**   @private  */
    public drawPath(canvas: SVGElement, options: PathAttributes): void {
        (this.svgRenderer as SvgRenderer).drawPath(canvas, options, this.diagramId);
    }

    /**   @private  */
    public renderResizeHandle(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints, currentZoom: number,
        selectorConstraints?: SelectorConstraints, transform?: Transforms, canMask?: boolean, enableNode?: number,
        nodeConstraints?: boolean, isSwimlane?: boolean)
        :
        void {
        let left: number = element.offsetX - element.actualSize.width * element.pivot.x;
        let top: number = element.offsetY - element.actualSize.height * element.pivot.y;
        let height: number = element.actualSize.height;
        let width: number = element.actualSize.width;
        if (!isSwimlane &&
            (constraints & ThumbsConstraints.Rotate && canDrawThumbs(this.rendererActions) && (!avoidDrawSelector(this.rendererActions)))) {
            this.renderPivotLine(element, canvas, transform, selectorConstraints, canMask);
            this.renderRotateThumb(element, canvas, transform, selectorConstraints, canMask);
        }
        this.renderBorder(
            element, canvas, transform, enableNode, nodeConstraints, isSwimlane);
        let nodeWidth: number = element.actualSize.width * currentZoom;
        let nodeHeight: number = element.actualSize.height * currentZoom;
        if (!nodeConstraints && canDrawThumbs(this.rendererActions) && (!avoidDrawSelector(this.rendererActions))) {
            if (nodeWidth >= 40 && nodeHeight >= 40) {
                //Hide corners when the size is less than 40
                if (selectorConstraints & SelectorConstraints.ResizeNorthWest) {
                    this.renderCircularHandle(
                        'resizeNorthWest', element, left, top, canvas, canShowCorner(selectorConstraints, 'ResizeNorthWest'),
                        constraints & ThumbsConstraints.ResizeNorthWest, transform, undefined,
                        canMask, { 'aria-label': 'Thumb to resize the selected object on top left side direction' },
                        undefined, 'e-diagram-resize-handle e-northwest');
                }
                if (selectorConstraints & SelectorConstraints.ResizeNorthEast) {
                    this.renderCircularHandle(
                        'resizeNorthEast', element, left + width, top, canvas, canShowCorner(selectorConstraints, 'ResizeNorthEast'),
                        constraints & ThumbsConstraints.ResizeNorthEast, transform, undefined,
                        canMask, { 'aria-label': 'Thumb to resize the selected object on top right side direction' },
                        undefined, 'e-diagram-resize-handle e-northeast');
                }
                if (selectorConstraints & SelectorConstraints.ResizeSouthWest) {
                    this.renderCircularHandle(
                        'resizeSouthWest', element, left, top + height, canvas, canShowCorner(selectorConstraints, 'ResizeSouthWest'),
                        constraints & ThumbsConstraints.ResizeSouthWest, transform, undefined,
                        canMask, { 'aria-label': 'Thumb to resize the selected object on bottom left side direction' },
                        undefined,
                        'e-diagram-resize-handle e-southwest');
                }
                if (selectorConstraints & SelectorConstraints.ResizeSouthEast) {
                    this.renderCircularHandle(
                        'resizeSouthEast', element, left + width, top + height, canvas,
                        canShowCorner(selectorConstraints, 'ResizeSouthEast'), constraints & ThumbsConstraints.ResizeSouthEast, transform,
                        undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom right side direction' },
                        undefined, 'e-diagram-resize-handle e-southeast');
                }
            }
            if (selectorConstraints & SelectorConstraints.ResizeNorth) {
                this.renderCircularHandle(
                    'resizeNorth', element, left + width / 2, top, canvas,
                    canShowCorner(selectorConstraints, 'ResizeNorth'), constraints & ThumbsConstraints.ResizeNorth, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on top side direction' }, undefined,
                    'e-diagram-resize-handle e-north');
            }
            if (selectorConstraints & SelectorConstraints.ResizeSouth) {
                this.renderCircularHandle(
                    'resizeSouth', element, left + width / 2, top + height, canvas,
                    canShowCorner(selectorConstraints, 'ResizeSouth'), constraints & ThumbsConstraints.ResizeSouth, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on bottom side direction' }, undefined,
                    'e-diagram-resize-handle e-south');
            }
            if (selectorConstraints & SelectorConstraints.ResizeWest) {
                this.renderCircularHandle(
                    'resizeWest', element, left, top + height / 2, canvas, canShowCorner(selectorConstraints, 'ResizeWest'),
                    constraints & ThumbsConstraints.ResizeWest, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on left side direction' }, undefined,
                    'e-diagram-resize-handle e-west');
            }
            if (selectorConstraints & SelectorConstraints.ResizeEast) {
                this.renderCircularHandle(
                    'resizeEast', element, left + width, top + height / 2, canvas, canShowCorner(selectorConstraints, 'ResizeEast'),
                    constraints & ThumbsConstraints.ResizeEast, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on right side direction' }, undefined,
                    'e-diagram-resize-handle e-east');
            }
        }
    }


    /**   @private  */
    public renderEndPointHandle(
        selector: ConnectorModel, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints,
        selectorConstraints: SelectorConstraints, transform: Transforms, connectedSource: boolean,
        connectedTarget?: boolean, isSegmentEditing?: boolean): void {
        let sourcePoint: PointModel = selector.sourcePoint;
        let targetPoint: PointModel = selector.targetPoint;
        let wrapper: DiagramElement = selector.wrapper; let i: number; let segment: StraightSegment;
        this.renderCircularHandle(
            'connectorSourceThumb', wrapper, sourcePoint.x, sourcePoint.y, canvas,
            canShowCorner(selectorConstraints, 'ConnectorSourceThumb'),
            constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource,
            undefined, { 'aria-label': 'Thumb to move the source point of the connector' }, undefined,
            'e-diagram-endpoint-handle e-targetend');
        this.renderCircularHandle(
            'connectorTargetThumb', wrapper, targetPoint.x, targetPoint.y, canvas,
            canShowCorner(selectorConstraints, 'ConnectorTargetThumb'),
            constraints & ThumbsConstraints.ConnectorTarget, transform, connectedTarget,
            undefined, { 'aria-label': 'Thumb to move the target point of the connector' }, undefined,
            'e-diagram-endpoint-handle e-targetend');
        if (isSegmentEditing) {
            if ((selector.type === 'Straight' || selector.type === 'Bezier') && selector.segments.length > 0) {
                for (i = 0; i < selector.segments.length - 1; i++) {
                    segment = selector.segments[i] as StraightSegment | BezierSegment;
                    this.renderCircularHandle(
                        ('segementThumb_' + (i + 1)), wrapper, segment.point.x, segment.point.y, canvas, true,
                        constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i);
                }
            } else {
                for (i = 0; i < selector.segments.length; i++) {
                    let seg: OrthogonalSegment = (selector.segments[i] as OrthogonalSegment);
                    this.renderOrthogonalThumbs(
                        'orthoThumb_' + (i + 1), wrapper, seg, canvas,
                        canShowCorner(selectorConstraints, 'ConnectorSourceThumb'), transform);
                }
            }
        }
        if (selector.type === 'Bezier') {
            for (i = 0; i < selector.segments.length; i++) {
                let segment: BezierSegment = (selector.segments[i] as BezierSegment);
                let bezierPoint: PointModel = !Point.isEmptyPoint(segment.point1) ? segment.point1
                    : segment.bezierPoint1;
                this.renderCircularHandle(
                    'bezierPoint_' + (i + 1) + '_1', wrapper, bezierPoint.x, bezierPoint.y, canvas,
                    canShowCorner(selectorConstraints, 'ConnectorSourceThumb'),
                    constraints & ThumbsConstraints.ConnectorSource, transform, undefined, undefined,
                    { 'aria-label': 'Thumb to move the source point of the connector' }, undefined,
                    'e-diagram-bezier-handle e-source');
                if (canShowCorner(selectorConstraints, 'ConnectorSourceThumb')) {
                    this.renderBezierLine(
                        'bezierLine_' + (i + 1) + '_1', wrapper, canvas, segment.points[0],
                        !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1,
                        transform);
                }
                bezierPoint = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
                this.renderCircularHandle(
                    'bezierPoint_' + (i + 1) + '_2', wrapper, bezierPoint.x, bezierPoint.y,
                    canvas, canShowCorner(selectorConstraints, 'ConnectorTargetThumb'),
                    constraints & ThumbsConstraints.ConnectorTarget, transform, undefined,
                    undefined, { 'aria-label': 'Thumb to move the target point of the connector' }, undefined,
                    'e-diagram-bezier-handle e-target');
                if (canShowCorner(selectorConstraints, 'ConnectorTargetThumb')) {
                    this.renderBezierLine(
                        'bezierLine_' + (i + 1) + '_2', wrapper, canvas, segment.points[1],
                        !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2,
                        transform);
                }
            }
        }
    }

    /**   @private  */
    public renderOrthogonalThumbs(
        id: string, selector: DiagramElement, segment: OrthogonalSegment, canvas: HTMLCanvasElement | SVGElement,
        visibility: boolean, t: Transforms): void {
        let orientation: string; let visible: boolean; let length: number; let j: number = 0;
        for (j = 0; j < segment.points.length - 1; j++) {
            length = Point.distancePoints(segment.points[j], segment.points[j + 1]);
            orientation = (segment.points[j].y.toFixed(2) === segment.points[j + 1].y.toFixed(2)) ? 'horizontal' : 'vertical';
            visible = (length >= 50 && segment.allowDrag) ? true : false;
            this.renderOrthogonalThumb(
                (id + '_' + (j + 1)), selector, (((segment.points[j].x + segment.points[j + 1].x) / 2)),
                (((segment.points[j].y + segment.points[j + 1].y) / 2)), canvas, visible, orientation, t);
        }
    }

    /**   @private  */
    public renderOrthogonalThumb(
        id: string, selector: DiagramElement, x: number, y: number, canvas: HTMLCanvasElement | SVGElement,
        visible: boolean, orientation: string, t: Transforms): void {
        let path: string; let h: number; let v: number;
        if (orientation === 'horizontal') {
            path = 'M0,7 L15,0 L30,7 L15,14 z'; h = -15; v = -7;
        } else { path = 'M7,0 L0,15 L7,30 L14,15 z'; h = -7; v = -15; }
        let options: PathAttributes = {
            x: ((x + t.tx) * t.scale) + h, y: ((y + t.ty) * t.scale) + v, angle: 0,
            fill: '#e2e2e2', stroke: 'black', strokeWidth: 1, dashArray: '', data: path,
            width: 20, height: 20, pivotX: 0, pivotY: 0, opacity: 1, visible: visible, id: id
        };
        this.svgRenderer.drawPath(canvas as SVGElement, options, this.diagramId);
    }

    /**   @private  */
    public renderPivotLine(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        let wrapper: DiagramElement = element;
        let dashArray: string = '2,3';
        let visible: boolean = (selectorConstraints & SelectorConstraints.Rotate) ? true : false;
        if (canMask) {
            visible = false;
        }
        let options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
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

    /**   @private  */
    public renderBezierLine(
        id: string, wrapper: DiagramElement, canvas: HTMLCanvasElement | SVGElement,
        start: PointModel, end: PointModel, transform?: Transforms): void {
        let dashArray: string = '3,3';
        let options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
        options.id = id;
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.dashArray = dashArray;
        options.fill = 'None';
        options.class = 'e-diagram-bezier-line';
        options.x = 0;
        options.y = 0;
        let scale: number = transform.scale;
        let x1: number = (start.x + transform.tx) * scale;
        let y1: number = (start.y + transform.ty) * scale;
        let x2: number = (end.x + transform.tx) * scale;
        let y2: number = (end.y + transform.ty) * scale;
        let startPoint: PointModel = { x: x1, y: y1 };
        let endPoint: PointModel = { x: x2, y: y2 };
        (options as LineAttributes).startPoint = startPoint;
        (options as LineAttributes).endPoint = endPoint;
        this.svgRenderer.drawLine(canvas as SVGElement, options as LineAttributes);
    }

    /**   @private  */
    public renderCircularHandle(
        id: string, selector: DiagramElement, cx: number, cy: number, canvas: HTMLCanvasElement | SVGElement,
        visible: boolean, enableSelector?: number, t?: Transforms, connected?: boolean, canMask?: boolean,
        ariaLabel?: Object, count?: number, className?: string)
        :
        void {
        let wrapper: DiagramElement = selector;
        let radius: number = 7;
        let newPoint: PointModel = { x: cx, y: cy };

        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }

        let options: CircleAttributes = this.getBaseAttributes(wrapper) as CircleAttributes;
        options.stroke = 'black';
        options.strokeWidth = 1;
        if (count !== undefined) {
            radius = 5;
            options.id = 'segmentEnd_' + count;
            options.fill = '#e2e2e2';
        } else {
            radius = 7;
            options.fill = connected ? '#8CC63F' : 'white';
        }
        options.centerX = (newPoint.x + t.tx) * t.scale;
        options.centerY = (newPoint.y + t.ty) * t.scale;
        options.radius = radius;
        options.angle = 0;
        options.id = id;
        options.visible = visible;
        options.class = className;
        if (connected) {
            options.class += ' e-connected';
        }
        if (canMask) {
            options.visible = false;
        }
        this.svgRenderer.drawCircle(canvas as SVGElement, options, enableSelector, ariaLabel);
    }

    /**   @private  */
    public renderBorder(
        selector: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, enableNode?: number,
        isBorderTickness?: boolean, isSwimlane?: boolean)
        :
        void {
        let wrapper: DiagramElement = selector;
        let options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
        options.x *= transform.scale;
        options.y *= transform.scale;
        options.width *= transform.scale;
        options.height *= transform.scale;
        options.fill = 'transparent'; options.stroke = '#097F7F';
        options.strokeWidth = 1.2;
        options.dashArray = '6,3';
        options.class = 'e-diagram-border';
        if (isSwimlane) { options.class += ' e-diagram-lane'; }
        options.id = 'borderRect';
        options.id = (this.rendererActions & RendererAction.DrawSelectorBorder) ? 'borderRect_symbol' : 'borderRect';
        if (!enableNode) {
            options.class += ' e-disabled';
        }
        if (isBorderTickness) {
            options.class += ' e-thick-border';
        }
        (options as RectAttributes).cornerRadius = 0;
        let parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector');
        this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, this.diagramId, undefined, true, parentSvg);
    }

    /**   @private  */
    public renderUserHandler(
        selectorItem: SelectorModel, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        diagramUserHandlelayer?: HTMLElement): void {
        let wrapper: DiagramElement = selectorItem.wrapper; let canDraw: boolean;
        for (let obj of selectorItem.userHandles) {
            canDraw = true;
            if ((obj.disableConnectors && selectorItem.connectors.length > 0) ||
                (obj.disableNodes && selectorItem.nodes.length > 0)) {
                canDraw = false;
            }
            let div: HTMLElement = document.getElementById(obj.name + '_template_hiddenUserHandle');
            if (div) {
                obj.template = (div.childNodes[0]).cloneNode(true) as HTMLElement;
            }
            let newPoint: PointModel;
            newPoint = getUserHandlePosition(selectorItem, obj, transform);
            newPoint.x = (newPoint.x + transform.tx) * transform.scale;
            newPoint.y = (newPoint.y + transform.ty) * transform.scale;
            if (obj.visible) {
                obj.visible = (selectorItem.constraints & SelectorConstraints.UserHandle) ? true : false;
            }
            if (canDraw) {
                if (obj.pathData) {
                    let data: string = obj.pathData ? obj.pathData : obj.content;
                    let option: CircleAttributes = this.getBaseAttributes(wrapper) as CircleAttributes;
                    option.id = obj.name + '_userhandle';
                    option.fill = obj.backgroundColor; option.stroke = obj.borderColor; option.strokeWidth = obj.borderWidth;
                    option.centerX = newPoint.x;
                    option.centerY = newPoint.y;
                    option.radius = obj.size * 0.5;
                    option.class = 'e-diagram-userhandle-circle';
                    option.angle = 0;
                    option.visible = obj.visible;
                    option.opacity = 1;
                    this.svgRenderer.drawCircle(canvas as SVGElement, option, 1, { 'aria-label': obj.name + 'user handle' });
                    let pathPading: number = 5;
                    let arrayCollection: Object[] = [];
                    arrayCollection = processPathData(data);
                    arrayCollection = splitArrayCollection(arrayCollection);
                    let pathSize: Rect = measurePath(data);
                    //requiredSize/contentSize
                    let scaleX: number = (obj.size - 0.45 * obj.size) / pathSize.width;
                    let scaleY: number = (obj.size - 0.45 * obj.size) / pathSize.height;
                    let newData: string = transformPath(arrayCollection, scaleX, scaleY, true, pathSize.x, pathSize.y, 0, 0);
                    pathSize = measurePath(newData);
                    let options: PathAttributes = {
                        x: newPoint.x - pathSize.width / 2,
                        y: newPoint.y - pathSize.height / 2, angle: 0, id: '',
                        class: 'e-diagram-userhandle-path', fill: obj.pathColor,
                        stroke: obj.backgroundColor, strokeWidth: 0.5, dashArray: '', data: newData,
                        width: obj.size - pathPading, height: obj.size - pathPading, pivotX: 0, pivotY: 0, opacity: 1, visible: obj.visible
                    };
                    this.svgRenderer.drawPath(
                        canvas as SVGElement, options as PathAttributes, this.diagramId, undefined,
                        undefined, { 'aria-label': obj.name + 'user handle' });
                } else if (obj.content) {
                    let handleContent: DiagramNativeElement;
                    handleContent = new DiagramNativeElement(obj.name, this.diagramId);
                    handleContent.content = obj.content;
                    handleContent.offsetX = newPoint.x;
                    handleContent.offsetY = newPoint.y;
                    handleContent.id = obj.name + '_shape';
                    handleContent.horizontalAlignment = 'Center';
                    handleContent.verticalAlignment = 'Center';
                    handleContent.visible = obj.visible;
                    handleContent.setOffsetWithRespectToBounds(newPoint.x, newPoint.y, 'Fraction');
                    handleContent.relativeMode = 'Object';
                    handleContent.description = obj.name || 'User handle';
                    handleContent.measure(new Size(obj.size, obj.size));
                    handleContent.arrange(handleContent.desiredSize);
                    this.svgRenderer.drawNativeContent(handleContent, canvas, obj.size, obj.size, this.adornerSvgLayer);
                } else if (obj.source) {
                    let element: ImageElement = new ImageElement();
                    let options: BaseAttributes = this.getBaseAttributes(element, transform);
                    options.width = obj.size;
                    options.height = obj.size;
                    (options as ImageAttributes).x = newPoint.x - (obj.size / 2);
                    (options as ImageAttributes).y = newPoint.y - (obj.size / 2);
                    (options as ImageAttributes).sourceWidth = obj.size;
                    (options as ImageAttributes).sourceHeight = obj.size;
                    (options as ImageAttributes).alignment = element.imageAlign;
                    (options as ImageAttributes).source = obj.source;
                    (options as ImageAttributes).scale = element.imageScale;
                    (options as ImageAttributes).visible = obj.visible;
                    (options as ImageAttributes).description = obj.name || 'User handle';
                    (options as ImageAttributes).id = obj.name + '_';
                    this.renderer.drawImage(canvas, options as ImageAttributes, this.adornerSvgLayer, false);
                } else {
                    let templateContent: DiagramHtmlElement;
                    templateContent = new DiagramHtmlElement(obj.name, this.diagramId);
                    templateContent.offsetX = newPoint.x;
                    templateContent.offsetY = newPoint.y;
                    templateContent.id = obj.name + '_shape';
                    templateContent.visible = obj.visible;
                    templateContent.relativeMode = 'Object';
                    templateContent.template = obj.template as HTMLElement;
                    templateContent.measure(new Size(obj.size, obj.size));
                    templateContent.arrange(templateContent.desiredSize);
                    this.svgRenderer.drawHTMLContent(templateContent, diagramUserHandlelayer as HTMLElement, undefined, true, undefined);
                }
            }
        }
    }

    /**   @private  */
    public renderRotateThumb(
        wrapper: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        let element: PathElement = new PathElement();
        let newPoint: PointModel;
        let size: Size = new Size();
        size.width = 18;
        size.height = 16;
        let top: number = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
        let left: number = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
        let visible: boolean = (selectorConstraints & SelectorConstraints.Rotate) ? true : false;
        if (canMask) {
            visible = false;
        }
        let data: string = 'M 16.856144362449648 10.238890446662904 L 18.000144362449646 3.437890446662903' +
            'L 15.811144362449646 4.254890446662903 C 14.837144362449646 2.5608904466629028 13.329144362449647 ' +
            ' 1.2598904466629026 11.485144362449645 0.5588904466629026 C 9.375144362449646 - 0.24510955333709716 7.071144362449646 ' +
            ' - 0.18010955333709716 5.010144362449646 0.7438904466629028 C 2.942144362449646 1.6678904466629028 1.365144362449646' +
            ' 3.341890446662903 0.558144362449646 5.452890446662903 C - 0.244855637550354 7.567890446662903 - 0.17985563755035394' +
            ' 9.866890446662904 0.7431443624496461 11.930890446662904 C 1.6681443624496461 13.994890446662904 3.343144362449646' +
            ' 15.575890446662903 5.457144362449647 16.380890446662903 C 6.426144362449647 16.7518904466629 7.450144362449647' +
            ' 16.9348904466629 8.470144362449647 16.9348904466629 C 9.815144362449647 16.9348904466629 11.155144362449647 ' +
            '16.6178904466629 12.367144362449647 15.986890446662901 L 11.351144362449647 14.024890446662901 C 9.767144362449647' +
            ' 14.8468904466629 7.906144362449647 14.953890446662902 6.237144362449647 14.3178904466629 C 4.677144362449647' +
            ' 13.7218904466629 3.444144362449647 12.5558904466629 2.758144362449647 11.028890446662901 C 2.078144362449646 ' +
            '9.501890446662903 2.031144362449646 7.802890446662903 2.622144362449646 6.243890446662903 C 3.216144362449646' +
            ' 4.6798904466629025 4.387144362449646 3.442890446662903 5.914144362449646 2.760890446662903 C 7.437144362449646 ' +
            '2.078890446662903 9.137144362449646 2.0298904466629026 10.700144362449645 2.6258904466629027 C 11.946144362449646 ' +
            '3.100890446662903 12.971144362449646 3.9538904466629026 13.686144362449646 5.049890446662903 L 11.540144362449645 ' +
            '5.850890446662903 L 16.856144362449648 10.238890446662904 Z';
        let pivotX: number = left + wrapper.pivot.x * wrapper.actualSize.width;
        let pivotY: number = top;
        pivotX = (pivotX + transform.tx) * transform.scale;
        pivotY = (pivotY + transform.ty) * transform.scale;
        newPoint = { x: pivotX - size.width * 0.5, y: pivotY - 30 - size.height * 0.5 };

        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            let matrix: Matrix = identityMatrix();
            rotateMatrix(
                matrix, wrapper.rotateAngle + wrapper.parentTransform,
                (transform.tx + wrapper.offsetX) * transform.scale, (transform.ty + wrapper.offsetY) * transform.scale);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        let options: PathAttributes = {
            x: newPoint.x,
            y: newPoint.y,
            angle: wrapper.rotateAngle + wrapper.parentTransform,
            fill: '#231f20', stroke: 'black', strokeWidth: 0.5, dashArray: '', data: data,
            width: 20, height: 20, pivotX: 0, pivotY: 0, opacity: 1, visible: visible, id: wrapper.id, class: 'e-diagram-rotate-handle'
        };
        options.id = 'rotateThumb';
        this.svgRenderer.drawPath(
            canvas as SVGElement, options as PathAttributes, this.diagramId, true,
            undefined, { 'aria-label': 'Thumb to rotate the selected object' });
    }

    /**   @private  */
    public renderPathElement(
        element: PathElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean, isPreviewNode?: boolean):
        void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform, isPreviewNode);
        (options as PathAttributes).data = element.absolutePath;
        (options as PathAttributes).data = element.absolutePath;
        let ariaLabel: Object = element.description ? element.description : element.id;
        if (!this.isSvgMode) {
            options.x = element.flipOffset.x ? element.flipOffset.x : options.x;
            options.y = element.flipOffset.y ? element.flipOffset.y : options.y;
        }
        if (element.isExport) {
            let pathBounds: Rect = element.absoluteBounds;
            (options as PathAttributes).data = updatePath(element, pathBounds, undefined, options);
        }
        this.renderer.drawPath(canvas, options as PathAttributes, this.diagramId, undefined, parentSvg, ariaLabel);
    }

    /**   @private  */
    public renderSvgGridlines(
        snapSettings: SnapSettingsModel, gridSvg: SVGElement, t: Transforms,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, vRuler: RulerModel
    ): void {
        let pattern: SVGPatternElement = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        let defs: SVGDefsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.setAttribute('id', this.diagramId + '_grid_pattern_defn');
        if (snapSettings.constraints & SnapConstraints.ShowHorizontalLines ||
            snapSettings.constraints & SnapConstraints.ShowVerticalLines) {
            pattern.setAttribute('id', this.diagramId + '_pattern');
        }
        let hWidth: number = 0; let hHeight: number = 0;
        let hSegmentwidth: number = 0; let vSegmentwidth: number = 0;
        let scale: number = 1;
        let isRulerGrid: Boolean = false;
        let isLine: boolean = snapSettings.gridType === 'Lines';
        let verticalLineIntervals: number[] = isLine ?
            snapSettings.verticalGridlines.lineIntervals : snapSettings.verticalGridlines.dotIntervals;
        let horizontalLineIntervals: number[] = isLine ?
            snapSettings.horizontalGridlines.lineIntervals : snapSettings.horizontalGridlines.dotIntervals;
        if (rulerSettings.showRulers && rulerSettings.dynamicGrid && hRuler && vRuler) {
            hSegmentwidth = (vRuler as Ruler).updateSegmentWidth(t.scale);
            vSegmentwidth = (hRuler as Ruler).updateSegmentWidth(t.scale);
            (snapSettings.horizontalGridlines as Gridlines).scaledIntervals = [hSegmentwidth / hRuler.interval];
            (snapSettings.verticalGridlines as Gridlines).scaledIntervals = [vSegmentwidth / vRuler.interval];
            isRulerGrid = true;
        } else {
            for (let i: number = 0; i < verticalLineIntervals.length; i = i + 1) {
                hWidth += verticalLineIntervals[i];
            }
            for (let i: number = 0; i < horizontalLineIntervals.length; i = i + 1) {
                hHeight += horizontalLineIntervals[i];
            }
            scale = this.scaleSnapInterval(snapSettings, t.scale);
        }
        hWidth = isRulerGrid ? vSegmentwidth : hWidth * scale;
        hHeight = isRulerGrid ? hSegmentwidth : hHeight * scale;
        let attr: Object = {
            id: this.diagramId + '_pattern', x: 0, y: 0, width: hWidth,
            height: hHeight, patternUnits: 'userSpaceOnUse'
        };
        setAttributeSvg(pattern, attr);
        this.horizontalSvgGridlines(
            pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, vRuler, isRulerGrid, isLine, horizontalLineIntervals);
        this.verticalSvgGridlines(
            pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, hRuler, isRulerGrid, isLine, verticalLineIntervals);
        defs.appendChild(pattern);
        gridSvg.appendChild(defs);
    }

    private horizontalSvgGridlines(
        pattern: SVGPatternElement, hWidth: number, hHeight: number, scale: number, snapSettings: SnapSettingsModel,
        rulerSettings: RulerSettingsModel, vRuler: RulerModel, isRulerGrid: Boolean, isLine: boolean, intervals: number[]
    ): void {
        let space: number = 0;
        let dashArray: number[] = [];
        let hLine: SVGElement;
        if (snapSettings.constraints & SnapConstraints.ShowHorizontalLines) {
            if (snapSettings.horizontalGridlines.lineDashArray) {
                dashArray = this.renderer.parseDashArray(snapSettings.horizontalGridlines.lineDashArray);
            }
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && vRuler) {
                intervals = this.updateLineIntervals(intervals, rulerSettings, vRuler, hHeight, isLine);
            }
            intervals = getInterval(intervals, isLine);
            for (let i: number = 0; i < intervals.length; i = i + 2) {
                space = getSpaceValue(intervals, isLine, i, space);
                let spaceY: number = 0;
                hLine = document.createElementNS('http://www.w3.org/2000/svg', isLine ? 'path' : 'circle');
                let d: number = isLine ? space + intervals[i] / 2 : space;
                d = isRulerGrid ? d : d * scale;
                let attr: Object;
                if (isLine) {
                    attr = {
                        'stroke-width': intervals[i], 'stroke': snapSettings.horizontalGridlines.lineColor,
                        'd': 'M0,' + (d) + ' L' + hWidth + ',' + (d) + ' Z',
                        'dashArray': dashArray.toString(),
                        'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid'
                    };
                    setAttributeSvg(hLine, attr);
                    pattern.appendChild(hLine);
                    space += intervals[i + 1] + intervals[i];
                } else {
                    this.renderDotGrid(i, pattern, snapSettings, spaceY, d, scale, true);
                    space += intervals[i];
                }

            }
        }
    }
    private renderDotGrid(
        i: number, pattern: SVGPatternElement, snapSettings: SnapSettingsModel,
        spacey: number, d: number, scale: number, isHorizontal: boolean)
        : void {
        let intervals: number[] = !isHorizontal ?
            snapSettings.horizontalGridlines.dotIntervals : snapSettings.verticalGridlines.dotIntervals;
        intervals = getInterval(intervals, false);
        let r: number;
        let hLine: SVGElement;
        let doubleRadius: boolean;
        let dy: number;
        let attr: Object;
        for (let j: number = 1; j < intervals.length; j = j + 2) {
            r = j === intervals.length - 1 ? intervals[0] : intervals[j - 1];
            hLine = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dy = spacey;
            dy = dy * scale;
            attr = {
                'cx': isHorizontal ? dy : d, 'cy': isHorizontal ? d : dy, 'fill': snapSettings.horizontalGridlines.lineColor, 'r': r
            };
            setAttributeSvg(hLine, attr);
            pattern.appendChild(hLine);
            spacey += intervals[j] + intervals[j - 1];
        }
    }

    private verticalSvgGridlines(
        pattern: SVGPatternElement, hWidth: number, hHeight: number, scale: number, snapSettings: SnapSettingsModel,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, isRulerGrid: Boolean, isLine: boolean, intervals: number[]
    ): void {
        let space: number = 0;
        let dashArray: number[] = [];
        let vLine: SVGElement;
        if (snapSettings.constraints & SnapConstraints.ShowVerticalLines) {
            if (snapSettings.verticalGridlines.lineDashArray) {
                dashArray = this.renderer.parseDashArray(snapSettings.verticalGridlines.lineDashArray);
            }
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && hRuler) {
                intervals = this.updateLineIntervals(intervals, rulerSettings, hRuler, hWidth, isLine);
            }
            let spaceY: number = 0;
            intervals = getInterval(intervals, isLine);
            for (let i: number = 0; i < intervals.length; i = i + 2) {
                space = getSpaceValue(intervals, isLine, i, space);
                vLine = document.createElementNS('http://www.w3.org/2000/svg', isLine ? 'path' : 'circle');
                let d: number = isLine ? space + intervals[i] / 2 : space;
                d = isRulerGrid ? d : d * scale;
                let attr: Object;
                if (isLine) {
                    attr = {
                        'stroke-width': intervals[i], 'stroke': snapSettings.verticalGridlines.lineColor,
                        'd': 'M' + (d) + ',0 L' + (d) + ',' + hHeight + ' Z',
                        'dashArray': dashArray.toString(),
                        'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid'
                    };
                    setAttributeSvg(vLine, attr);
                    pattern.appendChild(vLine);
                    space += intervals[i + 1] + intervals[i];
                } else {
                    this.renderDotGrid(i, pattern, snapSettings, spaceY, d, scale, false);
                    space += intervals[i];
                }
            }
        }
    }

    /**   @private  */
    public updateGrid(
        snapSettings: SnapSettingsModel, svgGrid: SVGSVGElement, transform: Transforms,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, vRuler: RulerModel
    ): void {
        let grid: SVGRectElement = svgGrid.getElementById(this.diagramId + '_grid_rect') as SVGRectElement;
        let i: number;
        let isRulerGrid: Boolean = false;
        if (grid) {
            let pattern: SVGPatternElement = svgGrid.getElementById(this.diagramId + '_pattern') as SVGPatternElement;
            if (pattern) {
                pattern.parentNode.removeChild(pattern);
            }
            let hSegmentwidth: number = 0;
            let vSegmentwidth: number = 0;
            let scale: number = 1;
            let isLine: boolean = snapSettings.gridType === 'Lines';
            let verticalLineIntervals: number[] = isLine ?
                snapSettings.verticalGridlines.lineIntervals : snapSettings.verticalGridlines.dotIntervals;
            let horizontalLineIntervals: number[] = isLine ?
                snapSettings.horizontalGridlines.lineIntervals : snapSettings.horizontalGridlines.dotIntervals;
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && vRuler && hRuler) {
                hSegmentwidth = (vRuler as Ruler).updateSegmentWidth(transform.scale);
                vSegmentwidth = (hRuler as Ruler).updateSegmentWidth(transform.scale);
                isRulerGrid = true;
                (snapSettings.horizontalGridlines as Gridlines).scaledIntervals = [hSegmentwidth / hRuler.interval];
                (snapSettings.verticalGridlines as Gridlines).scaledIntervals = [vSegmentwidth / vRuler.interval];
            } else {
                scale = this.scaleSnapInterval(snapSettings, transform.scale);
            }
            let height: number = 0;
            for (let j: number = 0; j < horizontalLineIntervals.length; j = j + 1) {
                height += horizontalLineIntervals[j];
            }

            let width: number = 0;
            for (let j: number = 0; j < verticalLineIntervals.length; j = j + 1) {
                width += verticalLineIntervals[j];
            }

            let attr: Object = {
                x: -transform.tx * transform.scale,
                y: -transform.ty * transform.scale
            };
            setAttributeSvg(grid, attr);
            width = isRulerGrid ? vSegmentwidth : width * scale;
            height = isRulerGrid ? hSegmentwidth : height * scale;
            attr = {
                id: this.diagramId + '_pattern', x: 0, y: 0, width: width,
                height: height, patternUnits: 'userSpaceOnUse'
            };
            pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            setAttributeSvg(pattern, attr);
            this.horizontalSvgGridlines(
                pattern, width, height, scale, snapSettings, rulerSettings, vRuler, isRulerGrid, isLine, horizontalLineIntervals);
            this.verticalSvgGridlines(
                pattern, width, height, scale, snapSettings, rulerSettings, hRuler, isRulerGrid, isLine, verticalLineIntervals);
            let defs: SVGDefsElement = svgGrid.getElementById(this.diagramId + '_grid_pattern_defn') as SVGDefsElement;
            if (defs) {
                defs.appendChild(pattern);
            }
        }
    }

    private updateLineIntervals(
        intervals: number[],
        rulerSettings: RulerSettingsModel, ruler: RulerModel, segmentWidth: number, isLine: boolean)
        : number[] {
        let newInterval: number[] = [];
        let tickInterval: number = segmentWidth / ruler.interval;
        let interval: number = isLine ? ruler.interval : ruler.interval + 1;
        for (let i: number = 0; i < interval * 2; i++) {
            if (i % 2 === 0) {
                newInterval[i] = isLine ? ((i === 0) ? 1.25 : 0.25) : 0;
            } else {
                newInterval[i] = isLine ? (tickInterval - newInterval[i - 1]) : tickInterval;
            }
        }
        return newInterval;
    }

    private scaleSnapInterval(snapSettings: SnapSettingsModel, scale: number): number {
        if (scale >= 2) {
            while (scale >= 2) {
                scale /= 2;
            }
        } else if (scale <= 0.5) {
            while (scale <= 0.5) {
                scale *= 2;
            }
        }
        let i: number;
        (snapSettings.horizontalGridlines as Gridlines).scaledIntervals = snapSettings.horizontalGridlines.snapIntervals;
        (snapSettings.verticalGridlines as Gridlines).scaledIntervals = snapSettings.verticalGridlines.snapIntervals;
        if (scale !== 1) {
            let gridlines: Gridlines = snapSettings.horizontalGridlines as Gridlines;
            gridlines.scaledIntervals = [];
            for (i = 0; i < gridlines.snapIntervals.length; i++) {
                gridlines.scaledIntervals[i] = gridlines.snapIntervals[i] * scale;
            }
            gridlines = snapSettings.verticalGridlines as Gridlines;
            gridlines.scaledIntervals = [];
            for (i = 0; i < gridlines.snapIntervals.length; i++) {
                gridlines.scaledIntervals[i] = gridlines.snapIntervals[i] * scale;
            }
        }
        return scale;
    }

    /**   @private  */
    public renderTextElement(
        element: TextElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {

        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).cornerRadius = 0;
        (options as TextAttributes).whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
        (options as TextAttributes).content = element.content;
        (options as TextAttributes).breakWord = wordBreakToString(element.style.textWrapping);
        (options as TextAttributes).textAlign = textAlignToString(element.style.textAlign);
        (options as TextAttributes).color = element.style.color;
        (options as TextAttributes).italic = element.style.italic;
        (options as TextAttributes).bold = element.style.bold;
        (options as TextAttributes).fontSize = element.style.fontSize;
        (options as TextAttributes).fontFamily = element.style.fontFamily;
        (options as TextAttributes).textOverflow = element.style.textOverflow;
        (options as TextAttributes).textWrapping = element.style.textWrapping;
        (options as TextAttributes).textDecoration = element.style.textDecoration;
        (options as TextAttributes).doWrap = element.doWrap;
        (options as TextAttributes).wrapBounds = element.wrapBounds;
        (options as TextAttributes).childNodes = element.childNodes;
        (options as TextAttributes).isHorizontalLane = element.isLaneOrientation;
        if (element.isLaneOrientation) {
            (options as TextAttributes).parentOffsetX = this.groupElement.offsetX;
            (options as TextAttributes).parentOffsetY = this.groupElement.offsetY;
            (options as TextAttributes).parentWidth = this.groupElement.actualSize.width;
            (options as TextAttributes).parentHeight = this.groupElement.actualSize.height;
        }
        options.dashArray = ''; options.strokeWidth = 0; options.fill = element.style.fill;
        let ariaLabel: Object = element.description ? element.description : element.content ? element.content : element.id;
        if ((element.style.textWrapping === 'Wrap' || element.style.textWrapping === 'WrapWithOverflow') &&
            this.groupElement && options.height > this.groupElement.actualSize.height &&
            (element.style.textOverflow === 'Clip' || element.style.textOverflow === 'Ellipsis')) {
            options.y = options.y + (options.height - this.groupElement.actualSize.height) / 2;
        }
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        this.renderer.drawText(
            canvas, options as TextAttributes, parentSvg, ariaLabel, this.diagramId,
            (element.isExport && Math.min(element.exportScaleValue.x || element.exportScaleValue.y)), this.groupElement);
        if (this.isSvgMode) {
            element.doWrap = false;
        }
    }

    private renderNativeElement(
        element: DiagramNativeElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean): void {
        let templateWidth: number; let templateHeight: number;
        let nativeSvg: SVGSVGElement = this.getParentSvg(element, undefined, canvas) || parentSvg;
        let nativeLayer: HTMLCanvasElement | SVGElement = this.getParentElement(element, canvas, nativeSvg).g || canvas;
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).fill = 'transparent';
        (options as RectAttributes).cornerRadius = element.cornerRadius;
        (options as RectAttributes).stroke = 'transparent';
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        switch (element.scale) {
            case 'None':
                templateWidth = element.contentSize.width;
                templateHeight = element.contentSize.height;
                break;
            case 'Stretch':
                templateWidth = element.actualSize.width;
                templateHeight = element.actualSize.height;
                break;
            case 'Meet':
                if (element.actualSize.width <= element.actualSize.height) {
                    templateWidth = templateHeight = element.actualSize.width;
                } else {
                    templateWidth = templateHeight = element.actualSize.height;
                }
                break;
            case 'Slice':
                if (element.actualSize.width >= element.actualSize.height) {
                    templateWidth = templateHeight = element.actualSize.width;
                } else {
                    templateWidth = templateHeight = element.actualSize.height;
                }
                break;
        }
        if (this.svgRenderer) {
            this.svgRenderer.drawNativeContent(element, nativeLayer, templateHeight, templateWidth, nativeSvg);
        }
    }

    private renderHTMLElement(
        element: DiagramHtmlElement, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean, indexValue?: number): void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).fill = 'transparent';
        (options as RectAttributes).cornerRadius = element.cornerRadius;
        (options as RectAttributes).stroke = 'transparent';
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        if (this.svgRenderer) {
            this.svgRenderer.drawHTMLContent(
                element, htmlLayer.children[0] as HTMLElement, transform, isDiagramChild(htmlLayer), indexValue);
        }
    }

    /**   @private  */
    public renderImageElement(
        element: ImageElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).cornerRadius = 0;
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        // let sx: number; let sy: number;
        let imageWidth: number; let imageHeight: number;
        let sourceWidth: number; let sourceHeight: number;

        if (element.stretch === 'Stretch') {
            imageWidth = element.actualSize.width;
            imageHeight = element.actualSize.height;
        } else {
            let contentWidth: number = element.contentSize.width;
            let contentHeight: number = element.contentSize.height;

            let widthRatio: number = options.width / contentWidth;
            let heightRatio: number = options.height / contentHeight;

            let ratio: number;
            switch (element.stretch) {
                case 'Meet':
                    ratio = Math.min(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    options.x += Math.abs(options.width - imageWidth) / 2;
                    options.y += Math.abs(options.height - imageHeight) / 2;
                    break;
                case 'Slice':
                    widthRatio = options.width / contentWidth;
                    heightRatio = options.height / contentHeight;
                    ratio = Math.max(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    sourceWidth = options.width / imageWidth * contentWidth;
                    sourceHeight = options.height / imageHeight * contentHeight;
                    break;
                case 'None':
                    imageWidth = contentWidth;
                    imageHeight = contentHeight;
                    break;
            }
        }
        options.width = imageWidth;
        options.height = imageHeight;

        //Commented for code coverage
        //(options as ImageAttributes).sourceX = sx;
        //(options as ImageAttributes).sourceY = sy;
        (options as ImageAttributes).sourceWidth = sourceWidth;
        (options as ImageAttributes).sourceHeight = sourceHeight;
        (options as ImageAttributes).source = element.source;
        (options as ImageAttributes).alignment = element.imageAlign;
        (options as ImageAttributes).scale = element.imageScale;
        (options as ImageAttributes).description = element.description ? element.description : element.id;
        this.renderer.drawImage(canvas, options as ImageAttributes, parentSvg, fromPalette);
    }

    /**   @private  */
    public renderContainer(
        group: Container, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean,
        indexValue?: number, isPreviewNode?: boolean):
        void {
        let svgParent: SvgParent = { svg: parentSvg, g: canvas };
        if (this.diagramId) {
            parentSvg = this.getParentSvg(group) || parentSvg;
            if (this.isSvgMode) {
                let groupElement: HTMLCanvasElement | SVGElement;
                groupElement = this.getParentElement(group, canvas, parentSvg, indexValue).g || canvas;
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children)) || parentSvg;
                let svgNativeParent: SvgParent =
                    this.getParentElement(this.hasNativeParent(group.children), groupElement, parentSvg, indexValue);
                svgParent.svg = svgNativeParent.svg || parentSvg;
                svgParent.g = svgNativeParent.g || groupElement;
                if (createParent) {
                    if (parentSvg) {
                        if (!parentSvg.getElementById(svgParent.g.id)) {
                            canvas.appendChild(svgParent.g);
                        }
                    }
                    canvas = svgParent.g;
                } else {
                    canvas = svgParent.g;
                }
            }
        }
        this.renderRect(group, canvas, transform, parentSvg);
        this.groupElement = group;
        if (group.hasChildren()) {
            let parentG: HTMLCanvasElement | SVGElement;
            let svgParent: SvgParent;
            let flip: FlipDirection;
            for (let child of group.children) {
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children) || child) || parentSvg;
                if (this.isSvgMode) {
                    svgParent = this.getParentElement(this.hasNativeParent(group.children) || child, canvas, parentSvg);
                    parentG = svgParent.g || canvas;
                    if (svgParent.svg) {
                        parentSvg = svgParent.svg;
                    }
                }
                if (!this.isSvgMode) {
                    child.flip = group.flip;
                }
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette, indexValue, isPreviewNode);
                if (child instanceof TextElement && parentG && !(group.elementActions & ElementAction.ElementIsGroup)) {
                    flip = (child.flip && child.flip !== 'None') ? child.flip : group.flip;
                    this.renderFlipElement(child, parentG, flip);
                }
                if ((child.elementActions & ElementAction.ElementIsPort) && parentG) {
                    flip = (child.flip && child.flip !== 'None') ? child.flip : group.flip;
                    this.renderFlipElement(group, parentG, flip);
                }
                if (!(child instanceof TextElement) && group.flip !== 'None' &&
                    (group.elementActions & ElementAction.ElementIsGroup)) {
                    this.renderFlipElement(child, parentG || canvas, group.flip);
                }
            }
            if (!(group.elementActions & ElementAction.ElementIsGroup)) {
                this.renderFlipElement(group, canvas, group.flip);
            }
        }
    }

    public renderFlipElement(element: DiagramElement, canvas: SVGElement | HTMLCanvasElement, flip: FlipDirection): void {
        let attr: object = {};
        let scaleX: number = 1;
        let scaleY: number = 1;
        let posX: number = 0; let posY: number = 0; let offsetX: number = 0;
        let offsetY: number = 0;
        if (flip !== 'None') {
            if (flip === 'Horizontal' || flip === 'Both') {
                posX = element.bounds.center.x;
                offsetX = -element.bounds.center.x;
                scaleX = -1;
            }
            if (flip === 'Vertical' || flip === 'Both') {
                posY = element.bounds.center.y;
                offsetY = -element.bounds.center.y;
                scaleY = -1;
            }
            attr = {
                'transform': 'translate(' + posX + ',' + posY + ') scale(' + scaleX + ','
                    + scaleY + ') translate(' + offsetX + ',' + offsetY + ')'
            };
        } else {
            attr = {
                'transform': 'translate(' + 0 + ',' + 0 + ')'

            };
        }

        if (attr) {
            if (element && (element as Container).children &&
                (element as Container).children.length && ((element as Container).children[0] instanceof DiagramHtmlElement)) {
                let id: string[] = canvas.id.split('_preview');
                let layer: HTMLElement = document.getElementById(id[0] + '_html_div') ||
                    (getHTMLLayer(this.diagramId).children[0]) as HTMLElement;
                canvas = layer.querySelector(('#' + element.id + '_content_html_element'));
                if (canvas) {
                    canvas.style.transform =
                     'scale(' + scaleX + ',' + scaleY + ')' + 'rotate(' + (element.rotateAngle + element.parentTransform) + 'deg)';
                }
            } else {
                setAttributeSvg(canvas as SVGElement, attr);
            }
        }
    }

    /**   @private  */
    public hasNativeParent(children: DiagramElement[], count?: number): DiagramElement {
        if (children && children.length > 0 && (count || 0 < 3)) {
            let child: DiagramElement = children[0];
            if (child instanceof DiagramNativeElement) {
                return child;
            } else if ((child as Container).children && (child as Container).children.length) {
                this.hasNativeParent((child as Container).children, count++ || 0);
            }
        }
        return undefined;
    }

    /**   @private  */
    public renderRect(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        parentSvg?: SVGSVGElement, isPreviewNode?: boolean):
        void {
        let options: RectAttributes = this.getBaseAttributes(element, transform, isPreviewNode);
        options.cornerRadius = element.cornerRadius || 0;
        let ariaLabel: Object = element.description ? element.description : element.id;
        this.renderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg, ariaLabel);
    }

    /**   @private  */
    public drawRect(canvas: SVGElement, options: RectAttributes): void {
        options.cornerRadius = 0;
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId);
    }

    /**   @private  */
    public getBaseAttributes(element: DiagramElement, transform?: Transforms, isPreviewNode?: boolean): BaseAttributes {
        let options: BaseAttributes = {
            width: element.actualSize.width, height: element.actualSize.height,
            x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
            y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
            fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
            dashArray: element.style.strokeDashArray || '', opacity: element.style.opacity, shadow: element.shadow,
            gradient: element.style.gradient, visible: element.visible, id: element.id, description: element.description,
            canApplyStyle: element.canApplyStyle
        };
        if (isPreviewNode) {
            options.x = options.x - .5;
            options.y = options.y - .5;
        }
        if (element.isExport) {
            options.width *= element.exportScaleValue.x;
            options.height *= element.exportScaleValue.y;
            options.x *= element.exportScaleValue.x;
            options.y *= element.exportScaleValue.y;
            options.strokeWidth *= element.exportScaleValue.x;
        }
        if (element.flip) {
            options.flip = element.flip;
        }
        if (transform) {
            options.x += transform.tx;
            options.y += transform.ty;
        }
        return options;
    }

    /**   @private  */
    public static renderSvgBackGroundImage(
        background: BackgroundModel, diagramElement: HTMLElement, x: number, y: number, width: number, height: number
    ): void {
        if (background.source) {
            let backgroundLayer: SVGSVGElement = getBackgroundLayerSvg(diagramElement.id);
            let target: SVGElement = backgroundLayer.getElementById(diagramElement.id + '_image') as SVGElement;
            if (!target) {
                let bgimageLayer: SVGElement = getBackgroundImageLayer(diagramElement.id);
                target = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                target.setAttribute('id', diagramElement.id + '_image');
                bgimageLayer.appendChild(target);
            }
            let imageObj: HTMLImageElement = new Image();
            imageObj.src = background.source;
            target.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObj.src.toString());
            let scale: string = background.scale !== 'None' ? background.scale : '';
            let imgAlign: string = background.align;
            let aspectRatio: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1);
            if (scale) {
                aspectRatio += ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            }
            let attr: Object = {
                'id': diagramElement.id + '_image', 'x': x, 'y': y,
                'width': width, 'height': height,
                'preserveAspectRatio': aspectRatio
            };
            setAttributeSvg(target as SVGElement, attr);
        }
    }

    /**   @private  */
    public transformLayers(transform: Transforms, svgMode: boolean): boolean {

        let tx: number = transform.tx * transform.scale;
        let ty: number = transform.ty * transform.scale;
        let domTable: string = 'domTable';
        if (tx !== this.transform.x || ty !== this.transform.y || (tx === 0 || ty === 0)) {
            //diagram layer
            if (svgMode) {
                if (!window[domTable][this.diagramId + '_diagramLayer']) {
                    window[domTable][this.diagramId + '_diagramLayer'] =
                        this.diagramSvgLayer.getElementById(this.diagramId + '_diagramLayer');
                }
                let diagramLayer: SVGElement = window[domTable][this.diagramId + '_diagramLayer'] as SVGElement;
                diagramLayer.setAttribute('transform', 'translate('
                    + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                    + transform.scale + ')');
            }
            //background
            //gridline
            let gridLayer: SVGElement = getGridLayer(this.diagramId);
            gridLayer.setAttribute('transform', 'translate(' + (transform.tx * transform.scale) + ','
                + (transform.ty * transform.scale) + ')');

            //portslayer    
            if (!window[domTable][this.diagramId + '_diagramPorts']) {
                window[domTable][this.diagramId + '_diagramPorts'] = this.iconSvgLayer.getElementById(this.diagramId + '_diagramPorts');
            }
            let portsLayer: SVGElement = window[domTable][this.diagramId + '_diagramPorts'] as SVGElement;
            portsLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //expandlayer
            if (!window[domTable][this.diagramId + '_diagramExpander']) {
                window[domTable][this.diagramId + '_diagramExpander'] =
                    this.iconSvgLayer.getElementById(this.diagramId + '_diagramExpander');
            }
            let expandLayer: SVGElement = window[domTable][this.diagramId + '_diagramExpander'] as SVGElement;
            expandLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //nativelayer
            if (!window[domTable][this.diagramId + '_nativeLayer']) {
                window[domTable][this.diagramId + '_nativeLayer'] = this.nativeSvgLayer.getElementById(this.diagramId + '_nativeLayer');
            }
            let nativeLayer: SVGElement = window[domTable][this.diagramId + '_nativeLayer'] as SVGElement;
            nativeLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');

            //htmlLayer
            let htmlLayer: HTMLElement = getHTMLLayer(this.diagramId).children[0] as HTMLElement;
            htmlLayer.style.transform = 'translate('
                + (transform.tx * transform.scale) + 'px,' + (transform.ty * transform.scale) + 'px)scale('
                + transform.scale + ')';
            this.transform = { x: transform.tx * transform.scale, y: transform.ty * transform.scale };
            return true;
        }
        return false;
    }


    /** @private */
    public updateNode(
        element: DiagramElement, diagramElementsLayer: HTMLCanvasElement, htmlLayer: HTMLElement,
        transform?: Transforms, insertIndex?: number): void {
        this.renderElement(
            element as Container, diagramElementsLayer, htmlLayer, transform,
            this.getParentSvg(element), undefined, undefined, insertIndex);
    }


    // public empty(node: HTMLElement | string): void {
    //     if (typeof node === 'string') {
    //         switch (node) {
    //             case 'e-ports-expand-layer':
    //                 node = this.iconSvgLayer.getElementById(this.diagramId + '_diagramExpander') as HTMLElement;
    //                 break;
    //             case 'e-diagram-layer':
    //                 node = this.diagramSvgLayer.getElementById(this.diagramId + '_diagramLayer') as HTMLElement;
    //                 break;
    //             case 'e-native-layer':
    //                 node = this.nativeSvgLayer.getElementById(this.diagramId + '_nativeLayer') as HTMLElement;
    //                 break;
    //         }
    //     }
    //     if (node instanceof Element) {
    //         while (node.hasChildNodes()) {
    //             node.removeChild(node.lastChild);
    //         }
    //     }
    // }
}

interface SvgParent {
    g: HTMLCanvasElement | SVGElement;
    svg: SVGSVGElement;
}

interface TextStyle {
    width: number;
    height: number;
    whiteSpace: WhiteSpace;
    content: string;
    breakWord: TextWrap;
    fontSize: number;
    fontFamily: string;
    offsetX: number;
    offsetY: number;
    bold: boolean;
    italic: boolean;
    textAlign: TextAlign;
    color: string;
    pivotX: number;
    pivotY: number;
    fill: string;
}