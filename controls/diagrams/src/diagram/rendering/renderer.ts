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
import { getUserHandlePosition, canShowCorner } from '../utility/diagram-util';
import { getDiagramElement, getAdornerLayer, getGridLayer, getHTMLLayer } from '../utility/dom-util';
import { measurePath, getBackgroundLayerSvg, getBackgroundImageLayer, setAttributeSvg } from '../utility/dom-util';
import { SnapSettingsModel } from '../../diagram/diagram/grid-lines-model';
import { Gridlines } from '../../diagram/diagram/grid-lines';
import { BackgroundModel } from '../../diagram/diagram/page-settings-model';
import { PathAttributes, TextAttributes, LineAttributes, CircleAttributes } from './canvas-interface';
import { RectAttributes, ImageAttributes, BaseAttributes } from './canvas-interface';
import { Stretch, WhiteSpace, TextAlign, TextWrap, SnapConstraints } from '../enum/enum';
import { ThumbsConstraints, SelectorConstraints } from '../enum/enum';
import { TransformFactor as Transforms } from '../interaction/scroller';
import { SelectorModel } from '../interaction/selector-model';
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
            if (element.id.split('_icon_content').length > 1 || element.id.split('_nodeport').length > 1) {
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
        parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean, indexValue?: number):
        void {
        if (element instanceof Container) {
            this.renderContainer(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue);
        } else if (element instanceof ImageElement) {
            this.renderImageElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof PathElement) {
            this.renderPathElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof TextElement) {
            this.renderTextElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof DiagramNativeElement) {
            this.renderNativeElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof DiagramHtmlElement) {
            this.renderHTMLElement(element, canvas, htmlLayer, transform, parentSvg, fromPalette);
        } else {
            this.renderRect(element, canvas, transform, parentSvg);
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
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId);
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
        selectorConstraints?: SelectorConstraints, transform?: Transforms, canMask?: boolean, enableNode?: number)
        :
        void {
        let left: number = element.offsetX - element.actualSize.width * element.pivot.x;
        let top: number = element.offsetY - element.actualSize.height * element.pivot.y;
        let height: number = element.actualSize.height;
        let width: number = element.actualSize.width;
        if (constraints & ThumbsConstraints.Rotate) {
            this.renderPivotLine(element, canvas, transform, selectorConstraints, canMask);
            this.renderRotateThumb(element, canvas, transform, selectorConstraints, canMask);
        }
        this.renderBorder(element, canvas, transform, enableNode);

        let nodeWidth: number = element.actualSize.width * currentZoom;
        let nodeHeight: number = element.actualSize.height * currentZoom;

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
                    'resizeSouthEast', element, left + width, top + height, canvas, canShowCorner(selectorConstraints, 'ResizeSouthEast'),
                    constraints & ThumbsConstraints.ResizeSouthEast, transform, undefined,
                    canMask, { 'aria-label': 'Thumb to resize the selected object on bottom right side direction' },
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
            visible = (length >= 50) ? true : false;
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
        selector: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, enableNode?: number)
        :
        void {
        let wrapper: DiagramElement = selector;
        let options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
        options.x *= transform.scale;
        options.y *= transform.scale;
        options.width *= transform.scale;
        options.height *= transform.scale;
        options.fill = 'transparent'; options.stroke = '#097F7F';
        options.strokeWidth = 0.6;
        options.dashArray = '6,3';
        options.class = 'e-diagram-border';
        options.id = 'borderRect';
        if (!enableNode) {
            options.class += ' e-disabled';
        }
        (options as RectAttributes).cornerRadius = 0;
        let parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector');
        this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, this.diagramId, undefined, true, parentSvg);
    }

    /**   @private  */
    public renderUserHandler(selectorItem: SelectorModel, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms): void {
        let wrapper: DiagramElement = selectorItem.wrapper;
        for (let obj of selectorItem.userHandles) {
            let element: PathElement = new PathElement();
            let newPoint: PointModel;
            let data: string = obj.pathData;
            newPoint = getUserHandlePosition(selectorItem, obj, transform);
            newPoint.x = (newPoint.x + transform.tx) * transform.scale;
            newPoint.y = (newPoint.y + transform.ty) * transform.scale;
            if (obj.visible) {
                obj.visible = (selectorItem.constraints & SelectorConstraints.UserHandle) ? true : false;
            }
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
                y: newPoint.y - pathSize.height / 2,
                angle: 0, id: '',
                class: 'e-diagram-userhandle-path',
                fill: obj.pathColor, stroke: obj.backgroundColor, strokeWidth: 0.5, dashArray: '', data: newData,
                width: obj.size - pathPading, height: obj.size - pathPading, pivotX: 0, pivotY: 0, opacity: 1, visible: obj.visible
            };
            this.svgRenderer.drawPath(
                canvas as SVGElement, options as PathAttributes, this.diagramId, undefined,
                undefined, { 'aria-label': obj.name + 'user handle' });
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
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as PathAttributes).data = element.absolutePath;
        (options as PathAttributes).data = element.absolutePath;
        let ariaLabel: Object = element.description ? element.description : element.id;
        this.renderer.drawPath(canvas, options as PathAttributes, this.diagramId, undefined, parentSvg, ariaLabel);
    }

    /**   @private  */
    public renderSvgGridlines(
        snapSettings: SnapSettingsModel, gridSvg: SVGElement, t: Transforms,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, vRuler: RulerModel
    ): void {
        //render gridlines
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
        if (rulerSettings.showRulers && rulerSettings.dynamicGrid && hRuler && vRuler) {
            hSegmentwidth = (vRuler as Ruler).updateSegmentWidth(t.scale);
            vSegmentwidth = (hRuler as Ruler).updateSegmentWidth(t.scale);
            (snapSettings.horizontalGridlines as Gridlines).scaledIntervals = [hSegmentwidth / hRuler.interval];
            (snapSettings.verticalGridlines as Gridlines).scaledIntervals = [vSegmentwidth / vRuler.interval];
            isRulerGrid = true;
        } else {
            for (let entry of snapSettings.verticalGridlines.lineIntervals) {
                hWidth += entry;
            }

            for (let entry of snapSettings.horizontalGridlines.lineIntervals) {
                hHeight += entry;
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
        this.horizontalSvgGridlines(pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, vRuler, isRulerGrid);
        this.verticalSvgGridlines(pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, hRuler, isRulerGrid);
        defs.appendChild(pattern);
        gridSvg.appendChild(defs);
    }

    private horizontalSvgGridlines(
        pattern: SVGPatternElement, hWidth: number, hHeight: number, scale: number, snapSettings: SnapSettingsModel,
        rulerSettings: RulerSettingsModel, vRuler: RulerModel, isRulerGrid: Boolean
    ): void {
        let space: number = 0;
        let dashArray: number[] = [];
        let hLine: SVGElement;
        if (snapSettings.constraints & SnapConstraints.ShowHorizontalLines) {
            let intervals: number[] = snapSettings.horizontalGridlines.lineIntervals;
            let strokestyle: string = snapSettings.horizontalGridlines.lineColor;
            if (snapSettings.horizontalGridlines.lineDashArray) {
                dashArray = this.renderer.parseDashArray(snapSettings.horizontalGridlines.lineDashArray);
            }
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && vRuler) {
                intervals = this.updateLineIntervals(intervals, rulerSettings, vRuler, hHeight);
            }
            for (let i: number = 0; i < intervals.length; i = i + 2) {
                hLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let d: number = space + intervals[i] / 2;
                d = isRulerGrid ? d : d * scale;
                let attr: Object = {
                    'stroke-width': intervals[i], 'stroke': snapSettings.horizontalGridlines.lineColor,
                    'd': 'M0,' + (d) + ' L' + hWidth + ',' + (d) + ' Z',
                    'dashArray': dashArray.toString(),
                    'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid'
                };
                setAttributeSvg(hLine, attr);
                pattern.appendChild(hLine);
                space += intervals[i + 1] + intervals[i];
            }
        }
    }

    private verticalSvgGridlines(
        pattern: SVGPatternElement, hWidth: number, hHeight: number, scale: number, snapSettings: SnapSettingsModel,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, isRulerGrid: Boolean
    ): void {
        let space: number = 0;
        let dashArray: number[] = [];
        let vLine: SVGElement;
        if (snapSettings.constraints & SnapConstraints.ShowVerticalLines) {
            let intervals: number[] = snapSettings.verticalGridlines.lineIntervals;
            let strokestyle: string = snapSettings.verticalGridlines.lineColor;
            if (snapSettings.verticalGridlines.lineDashArray) {
                dashArray = this.renderer.parseDashArray(snapSettings.verticalGridlines.lineDashArray);
            }
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && hRuler) {
                intervals = this.updateLineIntervals(intervals, rulerSettings, hRuler, hWidth);
            }
            for (let i: number = 0; i < intervals.length; i = i + 2) {
                vLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let d: number = space + intervals[i] / 2;
                d = isRulerGrid ? d : d * scale;
                let attr: Object = {
                    'stroke-width': intervals[i], 'stroke': snapSettings.verticalGridlines.lineColor,
                    'd': 'M' + (d) + ',0 L' + (d) + ',' + hHeight + ' Z',
                    'dashArray': dashArray.toString(),
                    'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid'
                };
                setAttributeSvg(vLine, attr);
                pattern.appendChild(vLine);
                space += intervals[i + 1] + intervals[i];
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
            for (i = 0; i < snapSettings.horizontalGridlines.lineIntervals.length; i++) {
                height += snapSettings.horizontalGridlines.lineIntervals[i];
            }

            let width: number = 0;
            for (i = 0; i < snapSettings.verticalGridlines.lineIntervals.length; i++) {
                width += snapSettings.verticalGridlines.lineIntervals[i];
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
            this.horizontalSvgGridlines(pattern, width, height, scale, snapSettings, rulerSettings, vRuler, isRulerGrid);
            this.verticalSvgGridlines(pattern, width, height, scale, snapSettings, rulerSettings, hRuler, isRulerGrid);
            let defs: SVGDefsElement = svgGrid.getElementById(this.diagramId + '_grid_pattern_defn') as SVGDefsElement;
            if (defs) {
                defs.appendChild(pattern);
            }
        }
    }

    private updateLineIntervals(intervals: number[], rulerSettings: RulerSettingsModel, ruler: RulerModel, segmentWidth: number): number[] {
        let newInterval: number[] = [];
        let tickInterval: number = segmentWidth / ruler.interval;
        for (let i: number = 0; i < ruler.interval * 2; i++) {
            if (i % 2 === 0) {
                newInterval[i] = (i === 0) ? 1.25 : 0.25;
            } else {
                newInterval[i] = tickInterval - newInterval[i - 1];
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
        (options as TextAttributes).textDecoration = element.style.textDecoration;
        (options as TextAttributes).doWrap = element.doWrap;
        (options as TextAttributes).wrapBounds = element.wrapBounds;
        (options as TextAttributes).childNodes = element.childNodes;
        options.dashArray = ''; options.strokeWidth = 0; options.fill = 'transparent';
        let ariaLabel: Object = element.description ? element.description : element.content ? element.content : element.id;
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        this.renderer.drawText(canvas, options as TextAttributes, parentSvg, ariaLabel, this.diagramId);
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
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean): void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).fill = 'transparent';
        (options as RectAttributes).cornerRadius = element.cornerRadius;
        (options as RectAttributes).stroke = 'transparent';
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        if (this.svgRenderer) {
            this.svgRenderer.drawHTMLContent(
                element, htmlLayer.children[0] as HTMLElement, transform, isDiagramChild(htmlLayer));
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
        transform?: Transforms, parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean, indexValue?: number):
        void {
        let svgParent: SvgParent = { svg: parentSvg, g: canvas };
        if (this.diagramId) {
            parentSvg = this.getParentSvg(group) || parentSvg;
            if (this.isSvgMode) {
                let groupElement: HTMLCanvasElement | SVGElement;
                groupElement = this.getParentElement(group, canvas, parentSvg, indexValue).g || canvas;
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children)) || parentSvg;
                let svgNativeParent: SvgParent = this.getParentElement(this.hasNativeParent(group.children), groupElement, parentSvg);
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
        if (group.hasChildren()) {
            let parentG: HTMLCanvasElement | SVGElement;
            let svgParent: SvgParent;
            for (let child of group.children) {
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children) || child) || parentSvg;
                if (this.isSvgMode) {
                    svgParent = this.getParentElement(this.hasNativeParent(group.children) || child, canvas, parentSvg);
                    parentG = svgParent.g || canvas;
                    if (svgParent.svg) {
                        parentSvg = svgParent.svg;
                    }
                }
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette);
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
    public renderRect(element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, parentSvg?: SVGSVGElement):
        void {
        let options: RectAttributes = this.getBaseAttributes(element, transform);
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
    public getBaseAttributes(element: DiagramElement, transform?: Transforms): BaseAttributes {
        let options: BaseAttributes = {
            width: element.actualSize.width, height: element.actualSize.height,
            x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
            y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
            fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
            dashArray: element.style.strokeDashArray || '', opacity: element.style.opacity, shadow: element.shadow,
            gradient: element.style.gradient, visible: element.visible, id: element.id, description: element.description,
        };
        if (transform) {
            options.x += transform.tx;
            options.y += transform.ty;
        }
        return options;
    }

    /**   @private  */
    public static renderSvgBackGroundImage
        (background: BackgroundModel, diagramElement: HTMLElement, x: number, y: number, width: number, height: number): void {
        let container: HTMLElement = document.getElementById(diagramElement.id);
        let backgroundLayer: SVGSVGElement = getBackgroundLayerSvg(diagramElement.id);

        let target: SVGElement = backgroundLayer.getElementById(diagramElement.id + '_image') as SVGElement;
        if (!target && background.source) {
            let bgimageLayer: SVGElement = getBackgroundImageLayer(diagramElement.id);
            target = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            target.setAttribute('id', diagramElement.id + '_image');
            bgimageLayer.appendChild(target);
        }
        if (target) {
            target.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', background.source);
            let scale: string = background.scale !== 'None' ? background.scale : '';
            let imgAlign: string = background.align;
            let aspectRatio: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' '
                + scale.charAt(0).toLowerCase() + scale.slice(1);
            let container: HTMLElement = document.getElementById(diagramElement.id);
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

        if (tx !== this.transform.x || ty !== this.transform.y || (tx === 0 || ty === 0)) {
            //diagram layer
            if (svgMode) {
                let diagramLayer: SVGElement = this.diagramSvgLayer.getElementById(this.diagramId + '_diagramLayer') as SVGElement;
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
            let portsLayer: SVGElement = this.iconSvgLayer.getElementById(this.diagramId + '_diagramPorts') as SVGElement;
            portsLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //expandlayer
            let expandLayer: SVGElement = this.iconSvgLayer.getElementById(this.diagramId + '_diagramExpander') as SVGElement;
            expandLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //nativelayer
            let nativeLayer: SVGElement = this.nativeSvgLayer.getElementById(this.diagramId + '_nativeLayer') as SVGElement;
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
    public updateNode
        (element: DiagramElement, diagramElementsLayer: HTMLCanvasElement, htmlLayer: HTMLElement, transform?: Transforms): void {
        this.renderElement(element as Container, diagramElementsLayer, htmlLayer, transform, this.getParentSvg(element));
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