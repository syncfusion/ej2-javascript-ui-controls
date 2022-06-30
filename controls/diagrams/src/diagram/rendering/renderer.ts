/* eslint-disable @typescript-eslint/ban-types */
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
import { wordBreakToString, whiteSpaceToString, textAlignToString, randomId } from '../utility/base-util';
import { getUserHandlePosition, canShowCorner, getInterval, getSpaceValue, canShowControlPoints } from '../utility/diagram-util';
import { getDiagramElement, getAdornerLayer, getGridLayer, getHTMLLayer, updatePath } from '../utility/dom-util';
import { measurePath, getBackgroundLayerSvg, getBackgroundImageLayer, setAttributeSvg } from '../utility/dom-util';
import { SnapSettingsModel } from '../../diagram/diagram/grid-lines-model';
import { Gridlines } from '../../diagram/diagram/grid-lines';
import { BackgroundModel } from '../../diagram/diagram/page-settings-model';
import { PathAttributes, TextAttributes, LineAttributes, CircleAttributes } from './canvas-interface';
import { RectAttributes, ImageAttributes, BaseAttributes } from './canvas-interface';
import { WhiteSpace, TextAlign, TextWrap, SnapConstraints, RendererAction, FlipDirection, ControlPointsVisibility } from '../enum/enum';
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
import { AnnotationConstraints} from '../enum/enum';
import { Diagram } from '../diagram';
import { getSegmentThumbShapeHorizontal, getSegmentThumbShapeVertical } from '../objects/dictionary/common';

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
    constructor(name: string, svgRender: IRenderer, isSvgMode: boolean) {
        this.diagramId = name;
        this.element = getDiagramElement(this.diagramId);
        this.svgRenderer = svgRender as SvgRenderer;
        this.isSvgMode = isSvgMode;
        this.renderer = isSvgMode ? new SvgRenderer() : new CanvasRenderer();
    }

    /**
     * Method used to set the cur \
     *
     *  @param {HTMLElement} canvas - Provide the canvas .
     *  @param {string} cursor - Provide the element .
     * @returns {void }   Method used to set the layer  .\
     * @private
     */
    public setCursor(canvas: HTMLElement, cursor: string): void {
        canvas.style.cursor = cursor;
    }


    /**
     * Method used to set the layer \
     *
     * @returns {void }   Method used to set the layer  .\
     *
     * @private
     */
    public setLayers(): void {
        this.iconSvgLayer = this.element.getElementsByClassName('e-ports-expand-layer')[0] as SVGSVGElement;
        this.adornerSvgLayer = this.element.getElementsByClassName('e-adorner-layer')[0] as SVGSVGElement;
        this.nativeSvgLayer = this.element.getElementsByClassName('e-native-layer')[0] as SVGSVGElement;
        this.diagramSvgLayer = this.element.getElementsByClassName('e-diagram-layer')[0] as SVGSVGElement;
    }

    private getAdornerLayer(): SVGElement {
        const adornerLayer: SVGElement = getAdornerLayer(this.diagramId);
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
            const groupElement: SvgParent = this.getGroupElement(element, defaultParent || layerGElement, indexValue);
            layerGElement = groupElement.g;
            if (groupElement.svg) {
                svgElement = groupElement.svg;
            }
        }
        return { g: layerGElement, svg: svgElement };
    }

    private getGroupElement(element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, indexValue?: number): SvgParent {
        let gElement: SVGGElement;
        const parentSvg: SVGSVGElement = this.getParentSvg(element);
        let svgElement: SVGSVGElement;
        if (canvas && parentSvg) {
            if (parentSvg) {
                gElement = parentSvg.getElementById(element.id + '_groupElement') as SVGGElement;
                if (!gElement && parentSvg !== this.nativeSvgLayer) {//code added
                    const nativeSvg: SVGSVGElement = this.nativeSvgLayer;
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

    /**
     * Method used to render the diagram element \
     *
     * @returns {void }   Method used to render the diagram element  .\
     *
     * @param {DiagramElement} element - Provide the DiagramElement value.
     * @param {HTMLCanvasElement | SVGElement } canvas - Provide the canvas value.
     * @param {HTMLElement } htmlLayer - Provide the HTMLElement value.
     * @param {Transforms } transform - Provide the Transforms value.
     * @param {SVGSVGElement} parentSvg - Provide the SVGSVGElement value.
     * @param {boolean } createParent - Provide the boolean value.
     * @param {boolean } fromPalette - Provide the boolean value.
     * @param {number } indexValue - Provide the indexValue value.
     * @param {boolean } isPreviewNode - Provide the isPreviewNode value.
     * @private
     */
    public renderElement(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement, transform?: Transforms,
        parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean, indexValue?: number, isPreviewNode?: boolean, centerPoint?: object):
        void {
        let isElement: boolean = true;
        if (element instanceof Container) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isElement = false;
            element.id = element.id ? element.id : randomId();
            this.renderContainer(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue, isPreviewNode,centerPoint);
        } else if (element instanceof ImageElement) {
            this.renderImageElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof PathElement) {
            this.renderPathElement(element, canvas, transform, parentSvg, fromPalette, isPreviewNode);
        } else if (element instanceof TextElement) {
            this.renderTextElement(element, canvas, transform, parentSvg, fromPalette, centerPoint);
        } else if (element instanceof DiagramNativeElement) {
            this.renderNativeElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof DiagramHtmlElement) {
            this.renderHTMLElement(element, canvas, htmlLayer, transform, parentSvg, fromPalette, indexValue);
        } else {
            this.renderRect(element, canvas, transform, parentSvg, isPreviewNode);
        }
    }

    /**
     * Method used to draw the selection rectangle for the node \
     *
     * @returns {void }  Method used to draw the selection rectangle for the node  .\
     *
     * @param {number} x - Provide the DiagramElement value.
     * @param {number } y - Provide the SVGElement value.
     * @param {number } w - Provide the Transforms value.
     * @param {number } h - Provide the Transforms value.
     * @param {HTMLCanvasElement | SVGElement } canvas - Provide the Transforms value.
     * @param {number } t - Provide the Transforms value.
     * @private
     */
    public drawSelectionRectangle(x: number, y: number, w: number, h: number, canvas: HTMLCanvasElement | SVGElement, t: Transforms):
        void {
        x = (x + t.tx) * t.scale;
        y = (y + t.ty) * t.scale;
        const options: BaseAttributes = {
            width: w * t.scale, height: h * t.scale,
            x: x + 0.5, y: y + 0.5, fill: 'transparent', stroke: 'gray', angle: 0,
            pivotX: 0.5, pivotY: 0.5, strokeWidth: 1,
            dashArray: '6 3', opacity: 1,
            visible: true, id: canvas.id + '_selected_region'
        };
        const adornerLayer: SVGElement = this.getAdornerLayer();
        this.svgRenderer.updateSelectionRegion(adornerLayer as SVGElement, options);
    }

    /**
     * Method used to render the highlighter \
     *
     * @returns {void }  Method used to render the highlighter  .\
     *
     * @param {DiagramElement} element - Provide the DiagramElement value.
     * @param {SVGElement } canvas - Provide the SVGElement value.
     * @param {Transforms } transform - Provide the Transforms value.
     * @private
     */
    public renderHighlighter(element: DiagramElement, canvas: SVGElement, transform: Transforms): void {
        const width: number = element.actualSize.width || 2;
        const height: number = element.actualSize.height || 2;
        let x: number = element.offsetX - width * element.pivot.x;
        let y: number = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        y = (y + transform.ty) * transform.scale;
        const options: RectAttributes = {
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#8CC63F', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 4,
            dashArray: '', opacity: 1, cornerRadius: 0,
            visible: true, id: canvas.id + '_highlighter', class: 'e-diagram-highlighter'
        };
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, canvas as SVGSVGElement);
    }

    /**
     * Method used to render the node selection rectangle \
     *
     * @returns {void }  Method used to render the node selection rectangle  .\
     *
     * @param {DiagramElement} element - Provide the DiagramElement value.
     * @param {SVGElement } canvas - Provide the SVGElement value.
     * @param {Transforms } transform - Provide the Transforms value.
     * @param {number } isFirst - Provide the boolean value.
     * @private
     */
     public renderSelectionRectangle(element: DiagramElement, canvas: SVGElement, transform: Transforms, isFirst: boolean): void {
        const width: number = element.actualSize.width || 2;
        const height: number = element.actualSize.height || 2;
        let x: number = element.offsetX - width * element.pivot.x;
        let y: number = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        y = (y + transform.ty) * transform.scale;
        const options: RectAttributes = {
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#00cc00', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: isFirst? 2 : 1,
            dashArray: '', opacity: 1, cornerRadius: 0,
            visible: true, id: element.id + '_highlighter', class: 'e-diagram-selection-rect'
        };
        const parentSvg: SVGSVGElement = this.getParentSvg(element, 'selector');
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg);
    }

    /**
     * Method used to render the selection line for connector  \
     *
     * @returns {void } Method used to render the selection line for connector .\
     *
     * @param {PathElement} element - Provide the path element of the diagram .
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element value.
     * @param { Transforms } transform - Provide the transform value.
     * @param { boolean } isFirst - Provide the boolean value.
     * @private
     */
    public renderSelectionLine(
        element: PathElement, canvas: HTMLCanvasElement | SVGElement, transform: Transforms, isFirst: boolean): void {
        const options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as PathAttributes).data = element.absolutePath;
        options.id = options.id + '_highlighter';
        const ariaLabel: Object = element.description ? element.description : element.id;
        if (!this.isSvgMode) {
            options.x = element.flipOffset.x ? element.flipOffset.x : options.x;
            options.y = element.flipOffset.y ? element.flipOffset.y : options.y;
        }
        if(transform) {
            options.x = options.x * transform.scale;
            options.y = options.y * transform.scale;
        }
        options.stroke = "#00cc00";
        options.strokeWidth = isFirst ? 2 : 1;
        options.class = "e-diagram-selection-line";
        const parentSvg: SVGSVGElement = this.getParentSvg(element, 'selector');
        this.svgRenderer.drawPath(canvas as SVGElement, options as PathAttributes, this.diagramId, undefined, parentSvg, ariaLabel, transform.scale);
    }

    /**
     * Method used to render the stack highlighter \
     *
     * @returns {void }  Method used to render the stack highlighter  .\
     *
     * @param {DiagramElement} element - Provide the DiagramElement value.
     * @param {SVGElement } canvas - Provide the SVGElement value.
     * @param {Transforms } transform - Provide the Transforms value.
     * @param {boolean} isVertical - Provide the Boolean value.
     * @param {PointModel } position - Provide the PointModel value.
     * @param {boolean } isUml - Provide the boolean value.
     * @param {boolean } isSwimlane - Provide the boolean value.
     * @private
     */
    public renderStackHighlighter(
        element: DiagramElement, canvas: SVGElement, transform: Transforms, isVertical: boolean, position: PointModel, isUml?: boolean,
        isSwimlane?: boolean): void {
        const width: number = element.actualSize.width || 2;
        let x: number = element.offsetX - width * element.pivot.x;
        const height: number = element.actualSize.height || 2;
        let y: number = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        let data: string;
        const bounds: Rect = element.bounds;
        let newPathString: string = '';

        y = (y + transform.ty) * transform.scale;
        if (!isVertical) {
            const d: number = height * transform.scale;
            data = 'M 10 -10 L 0 0 Z M -10 -10 L 0 0 Z M 0 0 L 0 ' + (d) + ' Z M 0  ' + (d) +
                ' L -10  ' + (d + 10) + ' Z L 10  ' + (d + 10) + ' Z';
            if (position.x >= element.offsetX) {
                x += width;
            }
        } else {
            if (isUml) {
                const d: number = width * transform.scale;
                data = 'M 0 0 L ' + (d + 2) + ' 0 Z';
                let scaleX: number = - bounds.x;
                let scaleY: number = - bounds.y;
                let arrayCollection: Object[] = [];
                scaleX = element.actualSize.width / Number(bounds.width ? bounds.width : 1) * transform.scale;
                scaleY = element.actualSize.height / Number(bounds.height ? bounds.height : 1) * transform.scale;
                const umlData: string = 'M7,4 L8,4 8,7 11,7 11,8 8,8 8,11 7,11 7,8 4,8 4,7 7,7 z M7.5,0.99999994' +
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
                const d: number = width * transform.scale;
                data = 'M -10 -10 L 0 0 Z M -10 10 L 0 0 Z M 0 0 L ' + (d) + ' 0 Z M ' + (d) + ' 0 L ' +
                    (d + 10) + ' 10 Z L ' + (d + 10) + ' -10 Z';

            }
        }


        const options: PathAttributes = {
            data: data + newPathString,
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#8CC63F', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 1,
            dashArray: '', opacity: 1,
            visible: true, id: canvas.id + '_stack_highlighter', class: 'e-diagram-highlighter'
        };
        (this.svgRenderer as SvgRenderer).drawPath(canvas, options, this.diagramId);
    }
    /**
     * Method used to draw the line \
     *
     * @returns {void }  Method used to draw the line  .\
     *
     * @param {SVGElement} canvas - Provide the SVGElement value.
     * @param {LineAttributes } options - Provide the LineAttributes value.
     * @private
     */
    public drawLine(canvas: SVGElement, options: LineAttributes): void {
        (this.svgRenderer as SvgRenderer).drawLine(canvas, options);
    }

    /**
     * Method used to draw the path \
     *
     * @returns {void }  Method used to draw the path  .\
     *
     * @param {SVGElement} canvas - Provide the canvas value.
     * @param {PathAttributes } options - Provide the PathAttributes value.
     * @private
     */
    public drawPath(canvas: SVGElement, options: PathAttributes): void {
        (this.svgRenderer as SvgRenderer).drawPath(canvas, options, this.diagramId);
    }

    /**
     * Method used to render the resize handle \
     *
     * @returns {void }  Method used to render the resize handle  .\
     *
     * @param {DiagramElement} element - Provide the DiagramElement value.
     * @param {HTMLCanvasElement | SVGElement } canvas - Provide the canvas element.
     * @param {  ThumbsConstraints } constraints - Provide the constraints value  .
     * @param { number} currentZoom - Provide the currentZoom value.
     * @param { SelectorConstraints } selectorConstraints - Provide the selectorConstraints value .
     * @param { Transforms } transform - Provide the transform  value.
     * @param { boolean } canMask - Provide the canMask boolean value.
     * @param { number } enableNode - Provide the enableNode value.
     * @param { boolean } nodeConstraints - Provide the nodeConstraints  value.
     * @param { boolean } isSwimlane - Provide the isSwimlane boolean value.
     * @private
     */
    public renderResizeHandle(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints, currentZoom: number,
        selectorConstraints?: SelectorConstraints, transform?: Transforms, canMask?: boolean, enableNode?: number,
        nodeConstraints?: boolean, isSwimlane?: boolean)
        :
        void {
        const left: number = element.offsetX - element.actualSize.width * element.pivot.x;
        const top: number = element.offsetY - element.actualSize.height * element.pivot.y;
        const height: number = element.actualSize.height;
        const width: number = element.actualSize.width;
        if (!isSwimlane &&
            (constraints & ThumbsConstraints.Rotate && canDrawThumbs(this.rendererActions) && (!avoidDrawSelector(this.rendererActions)))) {
            this.renderPivotLine(element, canvas, transform, selectorConstraints, canMask);
            this.renderRotateThumb(element, canvas, transform, selectorConstraints, canMask);
        }
        this.renderBorder(
            element, canvas, transform, enableNode, nodeConstraints, isSwimlane);
        const nodeWidth: number = element.actualSize.width * currentZoom;
        const nodeHeight: number = element.actualSize.height * currentZoom;
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


    /**
     * Method used to render the end point of the handle \
     *
     * @returns {void }  Method used to render the end point of the handle  .\
     *
     * @param {ConnectorModel} selector - Provide the ConnectorModel.
     * @param {HTMLCanvasElement | SVGElement } canvas - Provide the element.
     * @param {  ThumbsConstraints } constraints - Provide the constraints value  .
     * @param { SelectorConstraints} selectorConstraints - Provide the selectorConstraints value.
     * @param { Transforms } transform - Provide the transform value .
     * @param { boolean } connectedSource - Provide the connectedSource boolean value.
     * @param { boolean } connectedTarget - Provide the connectedTarget boolean value.
     * @param { boolean } isSegmentEditing - Provide the isSegmentEditing boolean value.
     * @private
     */
    public renderEndPointHandle(
        selector: ConnectorModel, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints,
        selectorConstraints: SelectorConstraints, transform: Transforms, connectedSource: boolean,
        connectedTarget?: boolean, isSegmentEditing?: boolean, canShowBezierPoints?: boolean): void {
        const sourcePoint: PointModel = selector.sourcePoint;
        const targetPoint: PointModel = selector.targetPoint;
        const wrapper: DiagramElement = selector.wrapper; let i: number; let segment: StraightSegment;
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
                // (EJ2-57115) - Added below code to check if maxSegmentThumb is zero or not
                if (!selector.maxSegmentThumb) {
                    for (i = 0; i < selector.segments.length; i++) {
                        const seg: OrthogonalSegment = (selector.segments[i] as OrthogonalSegment);
                        this.renderOrthogonalThumbs(
                            'orthoThumb_' + (i + 1), wrapper, seg, canvas,
                            canShowCorner(selectorConstraints, 'ConnectorSourceThumb'), transform, selector);
                    }
                } else {
                    // (EJ2-57115) - Added below code to check if maxSegmentThumb is non zero then we have ignore the rendering of
                    // first and last segment thumb
                    let start: number = selector.segments.length <= selector.maxSegmentThumb ? 0 : 1;
                    let end: number = selector.segments.length <= selector.maxSegmentThumb ? selector.segments.length : selector.segments.length - 1;
                    // (EJ2-57115) - If maxSegmentThumb is greater than or equal to 3 means then set start as second segment(1) and end as last before segment
                    if (selector.maxSegmentThumb >= 3 && selector.segments.length === 3) {
                        start = 1;
                        end = selector.segments.length - 1;
                    }
                    // (EJ2-57115) - If segments length is greater than maxSegmentThumb + 2 means then set start as 2 
                    start = selector.segments.length > selector.maxSegmentThumb + 2 ? 2 : start;
                    // (EJ2-57115) - If segments length is greater than maxSegmentThumb + 2 means then set end as last before segment 
                    end = selector.segments.length > selector.maxSegmentThumb + 2 ? selector.segments.length - 2 : end;
                    for (i = start; i < end; i++) {
                        const seg: OrthogonalSegment = (selector.segments[i] as OrthogonalSegment);
                        this.renderOrthogonalThumbs(
                            'orthoThumb_' + (i + 1), wrapper, seg, canvas,
                            canShowCorner(selectorConstraints, 'ConnectorSourceThumb'), transform, selector);
                    }
                }
            }
        }

        if (selector.type === 'Bezier' && canShowBezierPoints) {
            const segmentCount: number = selector.segments.length - 1;
            const controlPointsVisibility: ControlPointsVisibility = selector.bezierSettings != null ? selector.bezierSettings.controlPointsVisibility : null;
            for (i = 0; i <= segmentCount; i++) {
                const segment: BezierSegment = (selector.segments[i] as BezierSegment);

                let bezierPoint: PointModel = !Point.isEmptyPoint(segment.point1) ? segment.point1
                    : segment.bezierPoint1;
                if (controlPointsVisibility != null && (i == 0 && canShowControlPoints(controlPointsVisibility, 'Source'))
                    || (i != 0 && canShowControlPoints(controlPointsVisibility, 'Intermediate'))) {
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
                }

                bezierPoint = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
                if (controlPointsVisibility != null && (i == segmentCount && canShowControlPoints(controlPointsVisibility, 'Target'))
                    || (i != segmentCount && canShowControlPoints(controlPointsVisibility, 'Intermediate'))) {
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
    }

    /**
     * Method used to render the orthogonal thumb \
     *
     * @returns {void }  Method used to render the orthogonal thumb  .\
     *
     * @param {string} id - Provide the id for the element.
     * @param {DiagramElement } selector - Provide the selector element.
     * @param {  OrthogonalSegment } segment - Provide the segment value  .
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element value.
     * @param { boolean } visibility - Provide the visibility value .
     * @param { Transforms } t - Provide the Transforms value.
     * @private
     */
     public renderOrthogonalThumbs(
        id: string, selector: DiagramElement, segment: OrthogonalSegment, canvas: HTMLCanvasElement | SVGElement,
        visibility: boolean, t: Transforms, connector: ConnectorModel): void {
        let orientation: string; let visible: boolean; let length: number; let j: number = 0;
        // (EJ2-57115) - Added below code to check if maxSegmentThumb is zero or not
        if (!connector.maxSegmentThumb) {
            for (j = 0; j < segment.points.length - 1; j++) {
                length = Point.distancePoints(segment.points[j], segment.points[j + 1]);
                orientation = (segment.points[j].y.toFixed(2) === segment.points[j + 1].y.toFixed(2)) ? 'horizontal' : 'vertical';
                visible = (length >= 50 && segment.allowDrag) ? true : false;
                this.renderOrthogonalThumb(
                    (id + '_' + (j + 1)), selector, (((segment.points[j].x + segment.points[j + 1].x) / 2)),
                    (((segment.points[j].y + segment.points[j + 1].y) / 2)), canvas, visible, orientation, t);
            }
        } else {
            // (EJ2-57115) - Added below code to check if maxSegmentThumb greater then 3 means then we have ignore the rendering of
            // first and last segment thumb
            // Set the start value as 1 if segment points is greater than 3
            let start = segment.points.length < 3 ? 0 : 1;
            // set the end value as segment.points.length - 2 if segment points is greater then 3
            let end = segment.points.length < 3 ? segment.points.length-1 : segment.points.length - 2;
            start = connector.segments.length === 1 ? start: 0;
            end = connector.segments.length === 1 ? end: segment.points.length-1;
            for (j = start; j < end; j++) {
                length = Point.distancePoints(segment.points[j], segment.points[j + 1]);
                orientation = (segment.points[j].y.toFixed(2) === segment.points[j + 1].y.toFixed(2)) ? 'horizontal' : 'vertical';
                visible = (length >= 50 && segment.allowDrag) ? true : false;
                this.renderOrthogonalThumb(
                    (id + '_' + (j + 1)), selector, (((segment.points[j].x + segment.points[j + 1].x) / 2)),
                    (((segment.points[j].y + segment.points[j + 1].y) / 2)), canvas, visible, orientation, t);
            }
        }
    }

    /**
     * Method used to render the orthogonal thumb \
     *
     * @returns {void }  Method used to render the orthogonal thumb  .\
     *
     * @param {string} id - Provide the id for the element.
     * @param {DiagramElement } selector - Provide the selector element.
     * @param {  Transforms } x - Provide the x value  .
     * @param { Transforms } y - Provide the y value.
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element.
     * @param { boolean } visible - Provide the visible boolean value.
     * @param { string } orientation - Provide the orientation value.
     * @param { Transforms } t - Provide the Transforms value.
     * @private
     */
    public renderOrthogonalThumb(
        id: string, selector: DiagramElement, x: number, y: number, canvas: HTMLCanvasElement | SVGElement,
        visible: boolean, orientation: string, t: Transforms): void {
        let path: string; let h: number; let v: number;
        let diagramElement = document.getElementById(this.diagramId);
        let instance = 'ej2_instances';
        let diagram;
        if (diagramElement) {
            diagram = diagramElement[instance][0];
        }
        if (orientation === 'horizontal') {
            path = getSegmentThumbShapeHorizontal(diagram.segmentThumbShape);
            switch(diagram.segmentThumbShape)
            {
                case 'Arrow':
                case 'OpenArrow':
                case 'DoubleArrow':
                    h = -15;
                    v = -15;
                    break;
                case 'Square':
                case 'Rectangle':
                case 'Ellipse':
                    h = -5;
                    v = -5;
                    break;
                case 'Rhombus':
                case 'Circle':
                case 'Diamond':
                    h = -10;
                    v = -5;
                    break;
                case 'IndentedArrow':
                case 'OutdentedArrow':
                    h = -5;
                    v = -4;
                    break;
                case 'Fletch':
                case 'OpenFetch':
                    h = -5;
                    v = -4.5;
                    break;
            }
        }
        else {
            path = getSegmentThumbShapeVertical(diagram.segmentThumbShape);
            switch(diagram.segmentThumbShape)
            {
                case 'Arrow':
                case 'OpenArrow':
                case  'DoubleArrow':
                    h = -15;
                    v = -15;
                    break;
                case 'Square':
                case 'IndentedArrow':
                case 'OutdentedArrow':
                case 'Fletch':
                case 'OpenFetch':
                    h = -5;
                    v = -5;
                    break;
                case 'Rhombus':
                case 'Diamond':
                    h = -5;
                    v = -15;
                    break;
                case 'Rectangle':
                    h = -7;
                    v = -5;
                    break;
                case 'Circle':
                    h = -5;
                    v = -7;
                   break;
                case 'Ellipse':
                    h = -7;
                    v = -7;
                    break;
            }
         }
        const options: PathAttributes = {
            x: ((x + t.tx) * t.scale) + h, y: ((y + t.ty) * t.scale) + v, angle: 0,
            fill: '#e2e2e2', stroke: 'black', strokeWidth: 1, dashArray: '', data: path,
            width: 20, height: 20, pivotX: 0, pivotY: 0, opacity: 1, visible: visible, id: id,
            class:'e-orthogonal-thumb'
        };
        this.svgRenderer.drawPath(canvas as SVGElement, options, this.diagramId);
    }

    /**
     * Method used to render the pivot line line\
     *
     * @returns {void } Method used to render the pivot line line .\
     *
     * @param {DiagramElement} element - Provide the diagram element value.
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element.
     * @param {  Transforms } transform - Provide the transform value  .
     * @param { SelectorConstraints } selectorConstraints - Provide the selector constraints value.
     * @param { boolean } canMask - Provide the canMask boolean value.
     * @private
     */

    public renderPivotLine(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        const wrapper: DiagramElement = element;
        const dashArray: string = '2,3';
        let visible: boolean = (selectorConstraints & SelectorConstraints.Rotate) ? true : false;
        if (canMask) {
            visible = false;
        }
        const options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
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
     * Method used to render the bezier line for the connector  \
     *
     * @returns {void } Method used to render the bezier line for the connector .\
     *
     * @param {string} id - Provide the id value for the bezier line.
     * @param { DiagramElement } wrapper - Provide the wrapper for the element.
     * @param {  HTMLCanvasElement | SVGElement } canvas - Provide the canvas element  .
     * @param { PointModel } start - Provide the pointmodel value.
     * @param { PointModel } end - Provide the pointmodel value.
     * @param { Transforms } transform - Provide the itransform value .
     * @private
     */
    public renderBezierLine(
        id: string, wrapper: DiagramElement, canvas: HTMLCanvasElement | SVGElement,
        start: PointModel, end: PointModel, transform?: Transforms): void {
        const dashArray: string = '3,3';
        const options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
        options.id = id;
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.dashArray = dashArray;
        options.fill = 'None';
        options.class = 'e-diagram-bezier-line';
        options.x = 0;
        options.y = 0;
        const scale: number = transform.scale;
        const x1: number = (start.x + transform.tx) * scale;
        const y1: number = (start.y + transform.ty) * scale;
        const x2: number = (end.x + transform.tx) * scale;
        const y2: number = (end.y + transform.ty) * scale;
        const startPoint: PointModel = { x: x1, y: y1 };
        const endPoint: PointModel = { x: x2, y: y2 };
        (options as LineAttributes).startPoint = startPoint;
        (options as LineAttributes).endPoint = endPoint;
        this.svgRenderer.drawLine(canvas as SVGElement, options as LineAttributes);
    }

    /**
     * Method used to render the circular handle for the node element  \
     *
     * @returns {void } Method used to render the circular handle for the node element .\
     *
     * @param {string} id - Provide the id value.
     * @param { DiagramElement } selector - Provide the selector element value.
     * @param { number } cx - Provide cx value  .
     * @param { number } cy - Provide cx value.
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element.
     * @param { boolean } visible - Provide the visible property for the handle .
     * @param { number } enableSelector - Provide the value for the enableSelector .
     * @param { Transforms } t - Provide the transform value .
     * @param { boolean } connected - Provide the connected boolean value .
     * @param { boolean } canMask - Provide the canMask boolean value .
     * @param { Object } ariaLabel - Provide the label properties .
     * @param { number } count - Provide the count value  .
     * @param { string } className - Provide the class name for this element .
     * @private
     */
    public renderCircularHandle(
        id: string, selector: DiagramElement, cx: number, cy: number, canvas: HTMLCanvasElement | SVGElement,
        visible: boolean, enableSelector?: number, t?: Transforms, connected?: boolean, canMask?: boolean,
        ariaLabel?: Object, count?: number, className?: string)
        :
        void {
        const wrapper: DiagramElement = selector;
        let radius: number = 7;
        let newPoint: PointModel = { x: cx, y: cy };

        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }

        const options: CircleAttributes = this.getBaseAttributes(wrapper) as CircleAttributes;
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

    /**
     * Method used to render border for the node element  \
     *
     * @returns {void } Method used to render border for the node element .\
     *
     * @param {SelectorModel} selector - Provide the selector model instance.
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element value.
     * @param { Transforms } transform - Provide the transform value  .
     * @param { number } enableNode - Provide enableNode boolean value.
     * @param { boolean } isBorderTickness - Provide the thickness value for the node.
     * @param { boolean } isSwimlane - Provide the isSwimlane boolean value .
     * @private
     */
    public renderBorder(
        selector: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, enableNode?: number,
        isBorderTickness?: boolean, isSwimlane?: boolean)
        :
        void {
        const wrapper: DiagramElement = selector;
        const options: BaseAttributes = this.getBaseAttributes(wrapper, transform);
        options.x *= transform.scale;
        options.y *= transform.scale;
        options.width *= transform.scale;
        options.height *= transform.scale;
        options.fill = 'transparent'; options.stroke = '#097F7F';
        options.strokeWidth = 1.2; options.gradient = null;
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
        const parentSvg: SVGSVGElement = this.getParentSvg(selector, 'selector');
        this.svgRenderer.drawRectangle(canvas as SVGElement, options as RectAttributes, this.diagramId, undefined, true, parentSvg);
    }

    /**
     * Method used to render user handle for the node element  \
     *
     * @returns {void } Method used to render user handle for the node element .\
     *
     * @param {SelectorModel} selectorItem - Provide the selector model instance.
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element value.
     * @param { Transforms } transform - Provide the transform value  .
     * @param { HTMLElement } diagramUserHandlelayer - Provide the HTMLElement value.
     * @private
     */
    public renderUserHandler(
        selectorItem: SelectorModel, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        diagramUserHandlelayer?: HTMLElement): void {
        const wrapper: DiagramElement = selectorItem.wrapper; let canDraw: boolean;
        for (const obj of selectorItem.userHandles) {
            canDraw = true;
            if ((obj.disableConnectors && selectorItem.connectors.length > 0) ||
                (obj.disableNodes && selectorItem.nodes.length > 0)) {
                canDraw = false;
            }
            const div: HTMLElement = document.getElementById(obj.name + '_template_hiddenUserHandle');
            if (div) {
                obj.template = (div.childNodes[0]).cloneNode(true) as HTMLElement;
            }
            //const newPoint: PointModel;
            const newPoint: PointModel = getUserHandlePosition(selectorItem, obj, transform);
            newPoint.x = (newPoint.x + transform.tx) * transform.scale;
            newPoint.y = (newPoint.y + transform.ty) * transform.scale;
            if (obj.visible) {
                obj.visible = (selectorItem.constraints & SelectorConstraints.UserHandle) ? true : false;
            }
            if (canDraw) {
                if (obj.pathData) {
                    const data: string = obj.pathData ? obj.pathData : obj.content;
                    const option: CircleAttributes = this.getBaseAttributes(wrapper) as CircleAttributes;
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
                    const pathPading: number = 5;
                    let arrayCollection: Object[] = [];
                    arrayCollection = processPathData(data);
                    arrayCollection = splitArrayCollection(arrayCollection);
                    let pathSize: Rect = measurePath(data);
                    //requiredSize/contentSize
                    const scaleX: number = (obj.size - 0.45 * obj.size) / pathSize.width;
                    const scaleY: number = (obj.size - 0.45 * obj.size) / pathSize.height;
                    const newData: string = transformPath(arrayCollection, scaleX, scaleY, true, pathSize.x, pathSize.y, 0, 0);
                    pathSize = measurePath(newData);
                    const options: PathAttributes = {
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
                    //const handleContent: DiagramNativeElement;
                    const handleContent: DiagramNativeElement = new DiagramNativeElement(obj.name, this.diagramId);
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
                    const element: ImageElement = new ImageElement();
                    const options: BaseAttributes = this.getBaseAttributes(element, transform);
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
                    //const templateContent: DiagramHtmlElement;
                    const templateContent: DiagramHtmlElement = new DiagramHtmlElement(obj.name, this.diagramId);
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

    /**
     * Method used to render rotate thumb of the diagramnode element  \
     *
     * @returns {void } Method used to render rotate thumb of the diagramnode element .\
     *
     * @param {DiagramElement} wrapper - Provide the wrapper  element value.
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element value.
     * @param { Transforms } transform - Provide the transform value  .
     * @param { SelectorConstraints } selectorConstraints - Provide the selectorConstraints value.
     * @param { boolean } canMask - Provide the boolean value .
     * @private
     */
    public renderRotateThumb(
        wrapper: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        selectorConstraints?: SelectorConstraints, canMask?: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const element: PathElement = new PathElement();
        let newPoint: PointModel;
        const size: Size = new Size();
        size.width = 18;
        size.height = 16;
        const top: number = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
        const left: number = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
        let visible: boolean = (selectorConstraints & SelectorConstraints.Rotate) ? true : false;
        if (canMask) {
            visible = false;
        }
        const data: string = 'M 16.856144362449648 10.238890446662904 L 18.000144362449646 3.437890446662903' +
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
            const matrix: Matrix = identityMatrix();
            rotateMatrix(
                matrix, wrapper.rotateAngle + wrapper.parentTransform,
                (transform.tx + wrapper.offsetX) * transform.scale, (transform.ty + wrapper.offsetY) * transform.scale);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        const options: PathAttributes = {
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

    /**
     * Method used to render the path element for the diagram  \
     *
     * @returns {void } Method used to render the path element for the diagram .\
     *
     * @param {PathElement} element - Provide the path element of the diagram .
     * @param { HTMLCanvasElement | SVGElement } canvas - Provide the canvas element value.
     * @param { Transforms } transform - Provide the transform value  .
     * @param { SVGSVGElement } parentSvg - Provide the parent SVG element .
     * @param { boolean } fromPalette - Provide the boolean value .
     * @param { boolean } isPreviewNode - Provide the boolean value .
     * @private
     */
    public renderPathElement(
        element: PathElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean, isPreviewNode?: boolean):
        void {
        const options: BaseAttributes = this.getBaseAttributes(element, transform, isPreviewNode);
        (options as PathAttributes).data = element.absolutePath;
        (options as PathAttributes).data = element.absolutePath;
        const ariaLabel: Object = element.description ? element.description : element.id;
        if (!this.isSvgMode) {
            options.x = element.flipOffset.x ? element.flipOffset.x : options.x;
            options.y = element.flipOffset.y ? element.flipOffset.y : options.y;
        }
        if (element.isExport) {
            const pathBounds: Rect = element.absoluteBounds;
            (options as PathAttributes).data = updatePath(element, pathBounds, undefined, options);
        }
        this.renderer.drawPath(canvas, options as PathAttributes, this.diagramId, undefined, parentSvg, ariaLabel);
    }

    /**
     * Method used to update the grid line for the diagram  \
     *
     * @returns {void } Method used to update the grid line for the diagram .\
     *
     * @param {SnapSettingsModel} snapSettings - Provide the snapsetting value of the diagram .
     * @param { SVGSVGElement } gridSvg - Provide the SVG grid  element value.
     * @param { Transforms } t - Provide the transform value  .
     * @param { RulerSettingsModel } rulerSettings - Provide the ruler setting property .
     * @param { RulerModel } hRuler - Provide the horizontal ruler property value .
     * @param { RulerModel } vRuler - Provide the vertical ruler property value .
     * @private
     */
    public renderSvgGridlines(
        snapSettings: SnapSettingsModel, gridSvg: SVGElement, t: Transforms,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, vRuler: RulerModel
    ): void {
        const pattern: SVGPatternElement = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        const defs: SVGDefsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.setAttribute('id', this.diagramId + '_grid_pattern_defn');
        if (snapSettings.constraints & SnapConstraints.ShowHorizontalLines ||
            snapSettings.constraints & SnapConstraints.ShowVerticalLines) {
            pattern.setAttribute('id', this.diagramId + '_pattern');
        }
        let hWidth: number = 0; let hHeight: number = 0;
        let hSegmentwidth: number = 0; let vSegmentwidth: number = 0;
        let scale: number = 1;
        let isRulerGrid: boolean = false;
        const isLine: boolean = snapSettings.gridType === 'Lines';
        const verticalLineIntervals: number[] = isLine ?
            snapSettings.verticalGridlines.lineIntervals : snapSettings.verticalGridlines.dotIntervals;
        const horizontalLineIntervals: number[] = isLine ?
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
        const attr: Object = {
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
        rulerSettings: RulerSettingsModel, vRuler: RulerModel, isRulerGrid: boolean, isLine: boolean, intervals: number[]
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
                const spaceY: number = 0;
                hLine = document.createElementNS('http://www.w3.org/2000/svg', isLine ? 'path' : 'circle');
                let attr: Object;
                let d: number = isLine ? space + intervals[i] / 2 : space;
                d = isRulerGrid ? d : d * scale;
                if (isLine) {
                    if(dashArray.toString() === '') {
                    attr = {
                        'stroke-width': intervals[i], 
                        'd': 'M0,' + (d) + ' L' + hWidth + ',' + (d) + ' Z',
                        'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid',
                        'stroke': snapSettings.horizontalGridlines.lineColor
                    };
                } else {
                    attr = {
                        'stroke-width': intervals[i], 'stroke': snapSettings.horizontalGridlines.lineColor,
                        'd': 'M0,' + (d) + ' L' + hWidth + ',' + (d) + ' Z',
                        'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid',
                        'dashArray': dashArray.toString()
                    };
                }
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
        //const doubleRadius: boolean;
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
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, isRulerGrid: boolean, isLine: boolean, intervals: number[]
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
            const spaceY: number = 0;
            intervals = getInterval(intervals, isLine);
            for (let i: number = 0; i < intervals.length; i = i + 2) {
                space = getSpaceValue(intervals, isLine, i, space);
                let d: number = isLine ? space + intervals[i] / 2 : space;
                d = isRulerGrid ? d : d * scale;
                vLine = document.createElementNS('http://www.w3.org/2000/svg', isLine ? 'path' : 'circle');
                let attr: Object;
                if (isLine) {
                    if (dashArray.toString() === '') {
                        attr = {
                            'stroke-width': intervals[i],
                            'd': 'M' + (d) + ',0 L' + (d) + ',' + hHeight + ' Z',
                            'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid',
                            'stroke': snapSettings.verticalGridlines.lineColor,
                        };
                    } else {
                        attr = {
                            'stroke-width': intervals[i],
                            'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid',
                            'stroke': snapSettings.verticalGridlines.lineColor,
                            'd': 'M' + (d) + ',0 L' + (d) + ',' + hHeight + ' Z',
                            'dashArray': dashArray.toString(),
                            
                        };
                    }
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

    /**
     * Method used to update the grid line for the diagram  \
     *
     * @returns {void } Method used to update the grid line for the diagram .\
     *
     * @param {SnapSettingsModel} snapSettings - Provide the snapsetting value of the diagram .
     * @param { SVGSVGElement } svgGrid - Provide the SVG grid  element value.
     * @param { Transforms } transform - Provide the transform value  .
     * @param { RulerSettingsModel } rulerSettings - Provide the ruler setting property .
     * @param { RulerModel } hRuler - Provide the horizontal ruler property value .
     * @param { RulerModel } vRuler - Provide the vertical ruler property value .
     * @private
     */
    public updateGrid(
        snapSettings: SnapSettingsModel, svgGrid: SVGSVGElement, transform: Transforms,
        rulerSettings: RulerSettingsModel, hRuler: RulerModel, vRuler: RulerModel
    ): void {
        const grid: SVGRectElement = svgGrid.getElementById(this.diagramId + '_grid_rect') as SVGRectElement;
        //let i: number;
        let isRulerGrid: boolean = false;
        if (grid) {
            let pattern: SVGPatternElement = svgGrid.getElementById(this.diagramId + '_pattern') as SVGPatternElement;
            if (pattern) {
                pattern.parentNode.removeChild(pattern);
            }
            let hSegmentwidth: number = 0;
            let vSegmentwidth: number = 0;
            let scale: number = 1;
            const isLine: boolean = snapSettings.gridType === 'Lines';
            const verticalLineIntervals: number[] = isLine ?
                snapSettings.verticalGridlines.lineIntervals : snapSettings.verticalGridlines.dotIntervals;
            const horizontalLineIntervals: number[] = isLine ?
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
            const defs: SVGDefsElement = svgGrid.getElementById(this.diagramId + '_grid_pattern_defn') as SVGDefsElement;
            if (defs) {
                defs.appendChild(pattern);
            }
        }
    }

    private updateLineIntervals(
        intervals: number[],
        rulerSettings: RulerSettingsModel, ruler: RulerModel, segmentWidth: number, isLine: boolean)
        : number[] {
        const newInterval: number[] = [];
        const tickInterval: number = segmentWidth / ruler.interval;
        const interval: number = isLine ? ruler.interval : ruler.interval + 1;
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

    /**
     * Method used to render the text element  \
     *
     * @returns {void }Method used to render the text element  .\
     *
     * @param {TextElement} element - Provide the text element .
     * @param { HTMLCanvasElement | SVGElement} canvas - Provide the canvas element .
     * @param { Transforms } transform - Provide the transform value  .
     * @param { SVGSVGElement } parentSvg - Provide the SVG layer element .
     * @param { boolean } fromPalette - Provide the boolean value .
     * @private
     */
    public renderTextElement(
        element: TextElement, canvas: HTMLCanvasElement | SVGElement,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean, centerPoint?: object):
        void {

        const options: BaseAttributes = this.getBaseAttributes(element, transform);
        if (centerPoint) {
            options.x = (centerPoint as any).cx - 2;
            options.y = (centerPoint as any).cy - 2;
            // (EJ2-56874) - Set the calculated x and y position to the bezier connector annotation's(text element) bounds x,y position
            element.bounds.x = options.x;
            element.bounds.y = options.y;
            // (EJ2-58802) - Calculate the center point x and y with the element export scale value if element is in export mode
            if (element.isExport) {
                options.x = options.x * Math.min(element.exportScaleValue.x || element.exportScaleValue.y);
                options.y = options.y * Math.min(element.exportScaleValue.x || element.exportScaleValue.y);
            }
        }
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
        (options as TextAttributes).id = element.id ? element.id : randomId();
        if (element.isLaneOrientation) {
            (options as TextAttributes).parentOffsetX = this.groupElement.offsetX;
            (options as TextAttributes).parentOffsetY = this.groupElement.offsetY;
            (options as TextAttributes).parentWidth = this.groupElement.actualSize.width;
            (options as TextAttributes).parentHeight = this.groupElement.actualSize.height;
        }
        options.dashArray = ''; options.strokeWidth = 0; options.fill = element.style.fill;
        const ariaLabel: Object = element.description ? element.description : element.content ? element.content : element.id;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean): void {
        let templateWidth: number; let templateHeight: number;
        const nativeSvg: SVGSVGElement = this.getParentSvg(element, undefined, canvas) || parentSvg;
        const nativeLayer: HTMLCanvasElement | SVGElement = this.getParentElement(element, canvas, nativeSvg).g || canvas;
        const options: BaseAttributes = this.getBaseAttributes(element, transform);
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
        const options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).fill = 'transparent';
        (options as RectAttributes).cornerRadius = element.cornerRadius;
        (options as RectAttributes).stroke = 'transparent';
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        if (this.svgRenderer) {
            this.svgRenderer.drawHTMLContent(
                element, htmlLayer.children[0] as HTMLElement, transform, isDiagramChild(htmlLayer), indexValue);
        }
    }


    /**
     * Method used to render the image element  \
     *
     * @returns {void }Method used to render the image element  .\
     *
     * @param {ImageElement} element - Provide the image element .
     * @param { HTMLCanvasElement | SVGElement} canvas - Provide the canvas element .
     * @param { Transforms } transform - Provide the transform value  .
     * @param { SVGSVGElement } parentSvg - Provide the SVG layer element .
     * @param { boolean } fromPalette - Provide the boolean value .
     * @private
     */
    public renderImageElement(
        element: ImageElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {
        const options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).cornerRadius = 0;
        this.renderer.drawRectangle(canvas, options as RectAttributes, this.diagramId, undefined, undefined, parentSvg);
        // let sx: number; let sy: number;
        let imageWidth: number; let imageHeight: number;
        let sourceWidth: number; let sourceHeight: number;

        if (element.stretch === 'Stretch') {
            imageWidth = element.actualSize.width;
            imageHeight = element.actualSize.height;
        } else {
            const contentWidth: number = element.contentSize.width;
            const contentHeight: number = element.contentSize.height;

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

    /**
     * Method used to render the container  \
     *
     * @returns {void} Method used to render the container .\
     *
     * @param {Container} group - Provide the container .
     * @param { HTMLCanvasElement | SVGElement} canvas - Provide the canvas element .
     * @param { HTMLElement } htmlLayer - Provide the html layer element  .
     * @param { Transforms } transform - Provide the transform value .
     * @param { SVGSVGElement } parentSvg - Provide the SVG layer element .
     * @param { boolean } createParent - Provide the boolean value .
     * @param { boolean } fromPalette - Provide the boolean value  .
     * @param { number } indexValue - Provide the indexValue value .
     * @param { boolean } isPreviewNode - Provide the boolean value .
     * @private
     */
    public renderContainer(
        group: Container, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean,
        indexValue?: number, isPreviewNode?: boolean, centerPoint?: object):
        void {
        const svgParent: SvgParent = { svg: parentSvg, g: canvas };
        const diagramElement: Object = document.getElementById(this.diagramId);
        const instance: string = 'ej2_instances'; let diagram: any;
        if (diagramElement) {
            diagram = diagramElement[instance][0];
        }
        if (this.diagramId) {
            parentSvg = this.getParentSvg(group) || parentSvg;
            if (this.isSvgMode) {
                //const groupElement: HTMLCanvasElement | SVGElement;
                // eslint-disable-next-line max-len
                const groupElement: HTMLCanvasElement | SVGElement = this.getParentElement(group, canvas, parentSvg, indexValue).g || canvas;
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children)) || parentSvg;
                const svgNativeParent: SvgParent =
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
            for (const child of group.children) {
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
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette, indexValue, isPreviewNode, centerPoint);
                if (child instanceof TextElement && parentG && !(group.elementActions & ElementAction.ElementIsGroup)) {
                    this.renderFlipElement(child, parentG, child.flip);
                }
                if ((child.elementActions & ElementAction.ElementIsPort) && parentG) {
                    this.renderFlipElement(group, parentG, child.flip);
                }
                if (!(child instanceof TextElement) && group.flip !== 'None' &&
                    (group.elementActions & ElementAction.ElementIsGroup)) {
                    this.renderFlipElement(child, parentG || canvas, group.flip);
                }
            }
            let selectedNode: any;
            if (diagram && (diagram as Diagram).selectedItems && (diagram as Diagram).selectedItems.nodes && (diagram as Diagram).selectedItems.nodes.length > 0) {
                selectedNode = (diagram as Diagram).selectedItems.nodes[0];
            }
            let innerNodeContent: any;
            let innerLabelContent: any;
            let isNodeSelected: boolean = false;
            let Node;
            if ((diagram as Diagram) && (diagram as Diagram).selectedItems) {
                Node = diagram.getObject(group.id);
            }
            if (group.flip !== 'None') {
                selectedNode = Node;
            }
            if (selectedNode && selectedNode.flipMode) { isNodeSelected = true; }
            if (group.flip !== 'None' && selectedNode && selectedNode.flipMode !== 'Label' && selectedNode.flipMode !== 'All' && selectedNode.flipMode !== 'None') {
                group.flip = 'None';
                for (let k = 0; k < group.children.length; k++) {
                    group.children[k].flip = 'None';
                }
            }
            if (!(group.elementActions & ElementAction.ElementIsGroup) && diagram instanceof Diagram && (diagram as Diagram).nameTable[group.id] && (diagram as Diagram).nameTable[group.id].propName !== 'connectors') {
                if (isNodeSelected && selectedNode) {
                    if (group.children && group.children[0] instanceof DiagramNativeElement) {
                        innerNodeContent = document.getElementById(selectedNode.id + '_content_inner_native_element');
                    } else {
                        innerNodeContent = document.getElementById(selectedNode.id + '_content_groupElement');
                    }
                    //Below code to check and flip the node.
                    if (!(group.children[0] instanceof DiagramNativeElement) && selectedNode.shape.type !== 'Text' && selectedNode.flipMode !== 'None' && selectedNode.flipMode !== 'Label' && selectedNode.flipMode !== 'All' || (group.children[0] instanceof DiagramNativeElement && selectedNode.flipMode === 'Port')) {
                        this.renderFlipElement(group, innerNodeContent, selectedNode.flip);
                        return;
                    } else if (group.children[0] instanceof DiagramNativeElement && (selectedNode.flipMode === 'All' || selectedNode.flipMode === 'Label') || (selectedNode.shape.type === 'Basic' && selectedNode.flipMode === 'Label') || (selectedNode.shape.type === 'Image' && selectedNode.flipMode === 'Label')) {
                        this.renderFlipElement(group, innerNodeContent, group.flip);
                    }
                    if (group.flip !== 'None' && selectedNode.flipMode === 'None') {
                        if (selectedNode.shape.type === 'Text') { } else {
                            this.renderFlipElement(group, innerNodeContent, group.flip);
                        }
                    }
                    //Below code to check and flip the text element in the node.
                    else if (group.flip !== 'None' && selectedNode.flipMode === 'Label' || (group.children[0] instanceof DiagramNativeElement && selectedNode && (selectedNode.flipMode === 'None' || selectedNode.flipMode === 'All'))) {
                        for (let i = 0; i < selectedNode.wrapper.children.length; i++) {
                            if (selectedNode.wrapper.children[i] instanceof TextElement) {
                                innerLabelContent = document.getElementById(selectedNode.wrapper.children[i].id + '_groupElement');
                                this.renderFlipElement(group, innerLabelContent, group.flip);
                                return;
                            }
                        }
                    }
                    else {
                        this.renderFlipElement(group, canvas, group.flip);
                    }
                }
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
                const id: string[] = canvas.id.split('_preview');
                const layer: HTMLElement = document.getElementById(id[0] + '_html_div') ||
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

    /**
     * Method used to check the native parent  \
     *
     * @returns {void} Method used to check the native parent .\
     *
     * @param { DiagramElement[]} children - Provide the diagram element .
     * @param { number} count - Provide the count value .
     * @private
     */
    public hasNativeParent(children: DiagramElement[], count?: number): DiagramElement {
        if (children && children.length > 0 && (count || 0 < 3)) {
            const child: DiagramElement = children[0];
            if (child instanceof DiagramNativeElement) {
                return child;
            } else if ((child as Container).children && (child as Container).children.length) {
                this.hasNativeParent((child as Container).children, count++ || 0);
            }
        }
        return undefined;
    }

    /**
     * Method used the draw the reactangle for the diagram  \
     *
     * @returns {void} Method used the draw the reactangle for the diagram .\
     *
     * @param { SVGElement} element - Provide the SVG elements .
     * @param { RectAttributes} canvas - Provide the Canvas element  .
     * @param { RectAttributes} transform - Provide transform value for the node  .
     * @param { RectAttributes} parentSvg -provide the parent SVG  .
     * @param { RectAttributes} isPreviewNode - Provide the preview boolean value  .
     * @private
     */
    public renderRect(
        element: DiagramElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms,
        parentSvg?: SVGSVGElement, isPreviewNode?: boolean):
        void {
        const options: RectAttributes = this.getBaseAttributes(element, transform, isPreviewNode);
        options.cornerRadius = element.cornerRadius || 0;
        if (element.isExport) {
            options.cornerRadius *= element.exportScaleValue.x;
        }
        const ariaLabel: Object = element.description ? element.description : element.id;
        this.renderer.drawRectangle(canvas, options, this.diagramId, element.isExport, undefined, parentSvg, ariaLabel);
    }

    /**
     * Method used the draw the reactangle for the diagram  \
     *
     * @returns {void} Method used the draw the reactangle for the diagram .\
     *
     * @param { SVGElement} canvas - Provide the SVG elements .
     * @param { RectAttributes} options - Provide the attributes to draw the rectangle  .
     * @private
     */
    public drawRect(canvas: SVGElement, options: RectAttributes): void {
        options.cornerRadius = 0;
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId);
    }

    /**
     * Will get the base attributes for all the elements  \
     *
     * @returns {BaseAttributes} Will get the base attributes for all the elements .\
     *
     * @param { DiagramElement} element - Provide the diagram elements .
     * @param { Transforms} transform - Provide the transform value for the  elements .
     * @param { boolean} isPreviewNode - Provide the preview boolean value.
     * @private
     */
    public getBaseAttributes(element: DiagramElement, transform?: Transforms, isPreviewNode?: boolean): BaseAttributes {
        const options: BaseAttributes = {
            width: element.actualSize.width, height: element.actualSize.height,
            x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
            y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
            fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
            dashArray: element.style.strokeDashArray || '', opacity: element.style.opacity, shadow: element.shadow,
            gradient: element.style.gradient, visible: element.visible, id: element.id, description: element.description,
            canApplyStyle: element.canApplyStyle, shapeType: element.shapeType
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

    /**
     * Will render the SVG background image  \
     *
     * @returns {void} Will render the SVG background image  .\
     *
     * @param { Transforms} background - Provide the transforms values .
     * @param { boolean} diagramElement - Provide element for the daigram.
     * @param { boolean} x - Provide the rendering mode of the daigram.
     * @param { boolean} y - Provide the rendering mode of the daigram.
     * @param { boolean} width - Provide the rendering mode of the daigram.
     * @param { boolean} height - Provide the rendering mode of the daigram.
     * @private
     */
    public static renderSvgBackGroundImage(
        background: BackgroundModel, diagramElement: HTMLElement, x: number, y: number, width: number, height: number
    ): void {
        if (background.source) {
            const backgroundLayer: SVGSVGElement = getBackgroundLayerSvg(diagramElement.id);
            let target: SVGElement = backgroundLayer.getElementById(diagramElement.id + '_image') as SVGElement;
            if (!target) {
                const bgimageLayer: SVGElement = getBackgroundImageLayer(diagramElement.id);
                target = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                target.setAttribute('id', diagramElement.id + '_image');
                bgimageLayer.appendChild(target);
            }
            const imageObj: HTMLImageElement = new Image();
            imageObj.src = background.source;
            target.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObj.src.toString());
            const scale: string = background.scale !== 'None' ? background.scale : '';
            const imgAlign: string = background.align;
            let aspectRatio: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1);
            if (scale) {
                aspectRatio += ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            }
            const attr: Object = {
                'id': diagramElement.id + '_image', 'x': x, 'y': y,
                'width': width, 'height': height,
                'preserveAspectRatio': aspectRatio
            };
            setAttributeSvg(target as SVGElement, attr);
        }
    }

    /**
     * Method used to transform the layer  \
     *
     *  @returns {boolean} Method used to transform the layer  .\
     *  @param { Transforms} transform - Provide the transforms values .
     *  @param { boolean} svgMode - Provide the rendering mode of the daigram.
     *  @private
     */
    public transformLayers(transform: Transforms, svgMode: boolean): boolean {

        const tx: number = transform.tx * transform.scale;
        const ty: number = transform.ty * transform.scale;
        const domTable: string = 'domTable';
        if (tx !== this.transform.x || ty !== this.transform.y || (tx === 0 || ty === 0)) {
            //diagram layer
            if (svgMode) {
                if (!window[domTable][this.diagramId + '_diagramLayer']) {
                    window[domTable][this.diagramId + '_diagramLayer'] =
                        this.diagramSvgLayer.getElementById(this.diagramId + '_diagramLayer');
                }
                const diagramLayer: SVGElement = window[domTable][this.diagramId + '_diagramLayer'] as SVGElement;
                diagramLayer.setAttribute('transform', 'translate('
                    + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                    + transform.scale + ')');
            }
            //background
            //gridline
            const gridLayer: SVGElement = getGridLayer(this.diagramId);
            gridLayer.setAttribute('transform', 'translate(' + (transform.tx * transform.scale) + ','
                + (transform.ty * transform.scale) + ')');

            //portslayer
            if (!window[domTable][this.diagramId + '_diagramPorts']) {
                window[domTable][this.diagramId + '_diagramPorts'] = this.iconSvgLayer.getElementById(this.diagramId + '_diagramPorts');
            }
            const portsLayer: SVGElement = window[domTable][this.diagramId + '_diagramPorts'] as SVGElement;
            portsLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //expandlayer
            if (!window[domTable][this.diagramId + '_diagramExpander']) {
                window[domTable][this.diagramId + '_diagramExpander'] =
                    this.iconSvgLayer.getElementById(this.diagramId + '_diagramExpander');
            }
            const expandLayer: SVGElement = window[domTable][this.diagramId + '_diagramExpander'] as SVGElement;
            expandLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //nativelayer
            if (!window[domTable][this.diagramId + '_nativeLayer']) {
                window[domTable][this.diagramId + '_nativeLayer'] = this.nativeSvgLayer.getElementById(this.diagramId + '_nativeLayer');
            }
            const nativeLayer: SVGElement = window[domTable][this.diagramId + '_nativeLayer'] as SVGElement;
            nativeLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');

            //htmlLayer
            const htmlLayer: HTMLElement = getHTMLLayer(this.diagramId).children[0] as HTMLElement;
            htmlLayer.style.transform = 'translate('
                + (transform.tx * transform.scale) + 'px,' + (transform.ty * transform.scale) + 'px)scale('
                + transform.scale + ')';
            this.transform = { x: transform.tx * transform.scale, y: transform.ty * transform.scale };
            return true;
        }
        return false;
    }



    /**
     * Method used to update the nodes in the diagram  \
     *
     *  @returns {void} Method used to update the nodes in the diagram  .\
     *  @param { HTMLCanvasElement} element - Provide the diagram element .
     *  @param { HTMLCanvasElement} diagramElementsLayer - Provide the diagram layer element .
     *  @param { HTMLCanvasElement} htmlLayer -Provide the html element .
     *  @param { HTMLCanvasElement} transform - Provide the transform value .
     *  @param { HTMLCanvasElement} insertIndex - Provide the index value.
     *  @private
     */
    public updateNode(
        element: DiagramElement, diagramElementsLayer: HTMLCanvasElement, htmlLayer: HTMLElement,
        transform?: Transforms, insertIndex?: number, centerPoint?: object): void {
        this.renderElement(
            element as Container, diagramElementsLayer, htmlLayer, transform,
            this.getParentSvg(element), undefined, undefined, insertIndex, null, centerPoint);
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
