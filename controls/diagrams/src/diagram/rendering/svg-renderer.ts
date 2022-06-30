import { Point } from './../primitives/point';
import { Size } from './../primitives/size';
import { PointModel } from './../primitives/point-model';
import { RectAttributes, PathAttributes, TextAttributes } from './canvas-interface';
import { pathSegmentCollection, processPathData } from './../utility/path-util';
import { PathSegment, ImageAttributes, StyleAttributes } from './canvas-interface';
import { BaseAttributes, LineAttributes, CircleAttributes, SubTextElement, TextBounds } from './canvas-interface';
import { LinearGradientModel, RadialGradientModel, StopModel } from './../core/appearance-model';
import { IRenderer } from './../rendering/IRenderer';
import { setAttributeSvg, setChildPosition } from './../utility/dom-util';
import { overFlow, wordBreakToString, cornersPointsBeforeRotation } from './../utility/base-util';
import { CanvasRenderer } from './../rendering/canvas-renderer';
import { DiagramNativeElement } from '../core/elements/native-element';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { TransformFactor as Transforms } from '../interaction/scroller';
import { createSvgElement, createHtmlElement, getBackgroundLayerSvg } from '../utility/dom-util';
import { removeGradient, checkBrowserInfo } from '../utility/diagram-util';
import { Container } from '../core/containers/container';
import { isBlazor } from '@syncfusion/ej2-base';

/**
 * SVG Renderer
 */

/** @private */
export class SvgRenderer implements IRenderer {

    /**
     * Draw the shawdow  for the rectangle shape in diagram \
     *
     *  @returns {void}  Draw the shawdow  for the rectangle shape in diagram .\
     *
     *  @param { SVGElement} options - Provide the base attributes .
     *  @param { RectAttributes} canvas - Provide the canvas values .
     *  @param { string} collection - Provide the collection value.
     *  @param { boolean} parentSvg - Provide the parent SVG values .
     *  @private
     */
    public renderShadow(options: BaseAttributes, canvas: SVGElement, collection: Object[] = null, parentSvg?: SVGSVGElement): void {
        const pointModel: PointModel = { x: 0, y: 0 };
        const point: PointModel = Point.transform(pointModel, options.shadow.angle, options.shadow.distance);
        //const tX: number = options.x + point.x; const tY: number = options.y + point.y;
        //let pivotX: number = tX + options.width * options.pivotX;
        //let pivotY: number = tY + options.height * options.pivotY;
        let type: string;
        let shadowElement: SVGPathElement | SVGRectElement;
        if (parentSvg) {
            shadowElement = parentSvg.getElementById(canvas.id + '_shadow') as SVGPathElement;
        }
        if (!shadowElement) {
            type = collection ? 'path' : 'rect';
            shadowElement = document.createElementNS('http://www.w3.org/2000/svg', type) as SVGRectElement | SVGPathElement;
            canvas.appendChild(shadowElement);
        }
        const attr: Object = {
            'id': canvas.id + '_shadow', 'fill': options.shadow.color, 'stroke': options.shadow.color,
            'opacity': options.shadow.opacity.toString(),
            'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' +
                'translate(' + (options.x + point.x) + ',' + (options.y + point.y) + ')'

        };
        if (parentSvg) {
            const svgContainer: HTMLElement = parentSvg.getElementById(canvas.id) as HTMLElement;
            if (svgContainer) {
                svgContainer.insertBefore(shadowElement, svgContainer.firstChild);
            }
        }
        setAttributeSvg(shadowElement, attr);
        if (!collection) {
            setAttributeSvg(shadowElement, { 'width': options.width, 'height': options.height });
        } else if (collection) {
            this.renderPath(shadowElement, options as PathAttributes, collection);
        }
    }



    /**
     * Return the dashed array values \
     *
     *  @returns {number[]}  Return the dashed array values .\
     *  @param { SVGElement} dashArray - Return the dashed array values .
     *  @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public parseDashArray(dashArray: string): number[] {
        const dashes: number[] = [];

        return dashes;
    }


    /**
     * Draw the Rectangle for the diagram \
     *
     *  @returns {void}  Draw the Rectangle for the diagram .\
     *
     *  @param { SVGElement} svg - Provide the SVG .
     *  @param { RectAttributes} options - Provide the Rect attributes .
     *  @param { string} diagramId - Provide the diagram id .
     *  @param { boolean} onlyRect - Provide the boolean attribute for the shawdow rendering  .
     *  @param { boolean} isSelector - Provide the selector possobilities .
     *  @param { SVGSVGElement} parentSvg - Provide the parent svg element .
     *  @param { Object} ariaLabel - Provide the Arial label attributes .
     *  @private
     */
    public drawRectangle(
        svg: SVGElement, options: RectAttributes, diagramId: string, onlyRect?: boolean,
        isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object):
        void {
        if (options.shadow && !onlyRect) {
            this.renderShadow(options, svg, undefined, parentSvg);
        }
        let id: string;
        if (options.id === svg.id) {
            id = options.id + '_container';
        } else { id = options.id; }
        let rect: SVGElement;
        if (parentSvg) {
            rect = (parentSvg as SVGSVGElement).getElementById(id) as SVGElement;
        }
        if (!rect || isSelector) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            svg.appendChild(rect);
        }
        let shadowElement: HTMLElement;
        if (parentSvg && !options.shadow) {
            shadowElement = parentSvg.getElementById(options.id + '_groupElement_shadow') as HTMLElement;
            if (shadowElement) {
                shadowElement.parentNode.removeChild(shadowElement);
            }
        }


        const attr: Object = {
            'id': id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'visibility': options.visible ? 'visible' : 'hidden',
            'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            'rx': options.cornerRadius || 0, 'ry': options.cornerRadius || 0, 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        const poiterEvents: string = 'pointer-events';
        if (!ariaLabel) {
            attr[poiterEvents] = 'none';
        }
        setAttributeSvg(rect, attr);
        this.setSvgStyle(rect, options as StyleAttributes, diagramId);
    }

    /**
     * Update the diagram selection region \
     *
     *  @returns {void}  Update the diagram selection region .\
     *
     *  @param { SVGElement} gElement - Provide the element type.
     *  @param { RectAttributes} options - Provide the Rect attributes .
     *  @private
     */
    public updateSelectionRegion(gElement: SVGElement, options: RectAttributes): void {
        let rect: SVGElement;
        rect = (gElement.parentNode as SVGSVGElement).getElementById(options.id) as SVGElement;
        const attr: Object = {
            'id': options.id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            class: 'e-diagram-selected-region'
        };
        if (!rect) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            gElement.appendChild(rect);
        }
        this.setSvgStyle(rect, options as StyleAttributes);
        setAttributeSvg(rect, attr);
    }


    /**
     * Create the g element for the diagram \
     *
     *  @returns {SVGGElement}   Create the g element for the diagram .\
     *
     *  @param { SVGElement} elementType - Provide the element type.
     *  @param { Object} attribute - Provide the attributes for the g element.
     *  @private
     */
    public createGElement(elementType: string, attribute: Object): SVGGElement {
        const gElement: SVGGElement = createSvgElement(elementType, attribute) as SVGGElement;
        return gElement;
    }


    /**
     * Draw the line for the diagram\
     *
     *  @returns {void}  Draw the line for the diagram .\
     *
     *  @param { SVGElement} gElement - Provide the g element .
     *  @param { LineAttributes} options - Provide the line element attributes .
     *  @private
     */
    public drawLine(gElement: SVGElement, options: LineAttributes): void {
        const line: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.setSvgStyle(line, options as StyleAttributes);
        const pivotX: number = options.x + options.width * options.pivotX;
        const pivotY: number = options.y + options.height * options.pivotY;
        //const kk: string = '';
        const attr: Object = {
            'id': options.id,
            'x1': options.startPoint.x + options.x,
            'y1': options.startPoint.y + options.y,
            'x2': options.endPoint.x + options.x,
            'y2': options.endPoint.y + options.y,
            'stroke': options.stroke,
            'stroke-width': options.strokeWidth.toString(), 'opacity': options.opacity.toString(),
            'transform': 'rotate(' + options.angle + ' ' + pivotX + ' ' + pivotY + ')',
            'visibility': options.visible ? 'visible' : 'hidden'
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(line, attr);
        gElement.appendChild(line);
    }

    /**
     * Draw the circle for the diagram\
     *
     *  @returns {void}  Draw the circle for the diagram .\
     *
     *  @param { SVGElement} gElement - Provide the g element .
     *  @param { CircleAttributes} options - Provide the circle element attributes .
     *  @param {string} enableSelector - Provide the selector constraints string .
     *  @param {Object} ariaLabel - Provide arial label value .
     *  @private
     */
    public drawCircle(gElement: SVGElement, options: CircleAttributes, enableSelector?: number, ariaLabel?: Object): void {
        const circle: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.setSvgStyle(circle, options as StyleAttributes);
        let classval: string = options.class || '';
        if (!enableSelector) {
            classval += ' e-disabled';
        }
        const attr: Object = {
            'id': options.id,
            'cx': options.centerX,
            'cy': options.centerY,
            'r': options.radius,
            'visibility': options.visible ? 'visible' : 'hidden',
            'class': classval,
            'aria-label': ariaLabel ? ariaLabel['aria-label'] : ''
        };
        circle.style.display = options.visible ? 'block' : 'none';
        setAttributeSvg(circle, attr);
        gElement.appendChild(circle);
    }

    /**
     * Draw the path element for the diagram\
     *
     *  @returns {void}  Draw the path element for the diagram .\
     *
     *  @param { SVGElement} svg - Provide the SVG element .
     *  @param { PathAttributes} options - Provide the path element attributes .
     *  @param {string} diagramId - Provide the diagram id .
     *  @param {boolean} isSelector - Provide selector boolean value .
     *  @param {SVGSVGElement} parentSvg - Provide the parent SVG element .
     *  @param {Object} ariaLabel - Provide arial label value .
     *  @private
     */
    public drawPath(
        svg: SVGElement, options: PathAttributes, diagramId: string, isSelector?: boolean,
        parentSvg?: SVGSVGElement, ariaLabel?: Object, scale?: number): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const x: number = Math.floor((Math.random() * 10) + 1);
        //const id: string = svg.id + '_shape' + x.toString();
        let collection: Object[] = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        if (options.shadow) {
            this.renderShadow(options, svg, collection, parentSvg);
        }
        let shadowElement: HTMLElement;
        if (parentSvg && !options.shadow) {
            shadowElement = parentSvg.getElementById(options.id + '_groupElement_shadow') as HTMLElement;
            if (shadowElement) {
                shadowElement.parentNode.removeChild(shadowElement);
            }
        }
        let path: SVGPathElement;
        if (parentSvg) {
            path = (parentSvg as SVGSVGElement).getElementById(options.id) as SVGPathElement;
        }
        if (!path || isSelector) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svg.appendChild(path);
        }
        this.renderPath(path, options, collection);
        let attr: object = {};
        if (scale) {
            attr = {
                'id': options.id, 'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                    + (options.y + options.height * options.pivotY) + ')' + 'translate(' + (options.x) + ',' + (options.y) + '),scale(' + scale + ')',
                'visibility': options.visible ? 'visible' : 'hidden', 'opacity': options.opacity,
                'aria-label': ariaLabel ? ariaLabel : ''
            };
        } else {
            attr = {
                'id': options.id, 'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                    + (options.y + options.height * options.pivotY) + ')' + 'translate(' + (options.x) + ',' + (options.y) + ')',
                'visibility': options.visible ? 'visible' : 'hidden', 'opacity': options.opacity,
                'aria-label': ariaLabel ? ariaLabel : ''
            };
        }
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(path, attr);
        this.setSvgStyle(path, options as StyleAttributes, diagramId);
    }


    /**
     * Draw the path element for the diagram\
     *
     *  @returns {void}  Draw the path element for the diagram .\
     *
     *  @param { SVGElement} svg - Provide the SVG element .
     *  @param {PathAttributes} options - Provide the path element attributes .
     *  @param {Object[]} collection - Provide the parent SVG element .
     *  @private
     */
    public renderPath(svg: SVGElement, options: PathAttributes, collection: Object[]): void {
        let x1: number; let y1: number;
        let x2: number; let y2: number;
        let x: number; let y: number;
        let length: number; let i: number;
        const segments: Object[] = collection;
        let d: string = '';
        for (x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
            const obj: Object = segments[i]; const segment: PathSegment = obj; const char: string = segment.command;
            if ('x1' in segment) { x1 = segment.x1; }
            if ('x2' in segment) { x2 = segment.x2; }
            if ('y1' in segment) { y1 = segment.y1; }
            if ('y2' in segment) { y2 = segment.y2; }
            if ('x' in segment) { x = segment.x; }
            if ('y' in segment) { y = segment.y; }
            switch (char) {
            case 'M':
                d = d + 'M' + x.toString() + ',' + y.toString() + ' ';
                break;
            case 'L':
                d = d + 'L' + x.toString() + ',' + y.toString() + ' ';
                break;
            case 'C':
                d = d + 'C' + x1.toString() + ',' + y1.toString() + ',' + x2.toString() + ',' + y2.toString() + ',';
                d += x.toString() + ',' + y.toString() + ' ';
                break;
            case 'Q':
                d = d + 'Q' + x1.toString() + ',' + y1.toString() + ',' + x.toString() + ',' + y.toString() + ' ';
                break;
            case 'A':
                d = d + 'A' + segment.r1.toString() + ',' + segment.r2.toString() + ',' + segment.angle.toString() + ',';
                d += segment.largeArc.toString() + ',' + segment.sweep + ',' + x.toString() + ',' + y.toString() + ' ';
                break;
            case 'Z':
            case 'z':
                d = d + 'Z' + ' ';
                break;
            }
        }
        svg.setAttribute('d', d);
    }

    private setSvgFontStyle(text: SVGTextElement, options: TextAttributes): void {
        text.style.fontStyle = options.italic ? 'italic' : 'normal';
        text.style.fontWeight = options.bold ? 'bold' : 'normal';
        text.style.fontSize = options.fontSize.toString() + 'px';
        text.style.fontFamily = options.fontFamily;
    }


    /**
     * Draw the text element for the diagram\
     *
     *  @returns {void}  Draw the text element for the diagram .\
     *
     *  @param { SVGElement} canvas - Provide the SVG element .
     *  @param {TextAttributes} options - Provide the text element attributes .
     *  @param {SVGSVGElement} parentSvg - Provide the parent SVG element .
     *  @param {Object} ariaLabel - Provide the label properties .
     *  @param {string} diagramId - Provide the diagram id .
     *  @param {number} scaleValue - Provide the scale value .
     *  @param {Container} parentNode - Provide the parent node .
     *  @private
     */
    public drawText(
        canvas: SVGElement, options: TextAttributes, parentSvg?: SVGSVGElement,
        ariaLabel?: Object, diagramId?: string, scaleValue?: number, parentNode?: Container): void {
        if (options.content !== undefined) {
            let textNode: Text;
            let childNodes: SubTextElement[];
            let wrapBounds: TextBounds; let position: PointModel; let child: SubTextElement;
            let tspanElement: SVGElement; let offsetX: number = 0;
            let offsetY: number = 0;
            let i: number = 0;
            let text: SVGTextElement;
            let nodeContent: HTMLElement;
            if (parentSvg) {
                text = parentSvg.getElementById(options.id + '_text') as SVGTextElement;
            }
            if (text) {
                if (options.doWrap) {
                    while (text.firstChild) {
                        text.removeChild(text.firstChild);
                    }
                }
            } else {
                options.doWrap = true;
                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                if (options.whiteSpace === 'pre-wrap') {
                    text.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
                }
                if (parentNode) { nodeContent = document.getElementById(parentNode.id + '_content_groupElement'); }
                if (nodeContent && parentNode && parentNode.children && parentNode.children[0] instanceof DiagramNativeElement) {
                    let textTag: SVGGElement = this.createGElement('g', { id: ariaLabel + '_groupElement' });
                    nodeContent.appendChild(textTag);
                    textTag.appendChild(text);
                } else {
                    canvas.appendChild(text);
                }
            }
            let pivotX: number = options.x + options.width * options.pivotX;
            let pivotY: number = options.y + options.height * options.pivotY;
            let childNodesHeight: number = 0;
            if (options.doWrap || options.textOverflow !== 'Wrap') {
                const innerHtmlTextElement: HTMLElement = document.getElementById(options.id + '_text');
                if (innerHtmlTextElement) {
                    innerHtmlTextElement.innerHTML = '';
                }
                this.setSvgStyle(text, options as StyleAttributes, diagramId);
                this.setSvgFontStyle(text, options);
                textNode = document.createTextNode(options.content);
                childNodes = options.childNodes;
                wrapBounds = options.wrapBounds;
                position = this.svgLabelAlign(options, wrapBounds, childNodes);
                if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap' && options.textWrapping === 'NoWrap') {
                    childNodes[0].text = overFlow(options.content, options);
                }
                for (i = 0; i < childNodes.length; i++) {
                    tspanElement = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    textNode = document.createTextNode(childNodes[i].text);
                    child = childNodes[i];
                    child.x = setChildPosition(child, childNodes, i, options);
                    offsetX = position.x + child.x - wrapBounds.x;
                    offsetY = position.y + child.dy * (i) + ((options.fontSize) * 0.8);
                    if ((options.textOverflow === 'Clip' || options.textOverflow === 'Ellipsis') &&
                        (options.textWrapping === 'WrapWithOverflow' || options.textWrapping === 'Wrap') && parentNode) {
                        const size: number = (options.isHorizontalLane) ? parentNode.actualSize.width : parentNode.actualSize.height;
                        if (offsetY < size) {
                            if (options.textOverflow === 'Ellipsis' && childNodes[i + 1]) {
                                const temp: SubTextElement = childNodes[i + 1];
                                const y: number = position.y + temp.dy * (i + 1) + ((options.fontSize) * 0.8);
                                if (y > size) {
                                    child.text = child.text.slice(0, child.text.length - 3);
                                    child.text = child.text.concat('...');
                                    textNode.data = child.text;
                                }
                            }
                            this.setText(text, tspanElement, child, textNode, offsetX, offsetY);
                            childNodesHeight += child.dy;
                        } else {
                            break;
                        }
                    } else {
                        this.setText(text, tspanElement, child, textNode, offsetX, offsetY);
                    }

                }
            }
            if (childNodesHeight && options.isHorizontalLane) {
                pivotX = options.parentOffsetX + options.pivotX;
                pivotY = options.parentOffsetY + options.pivotY;
                options.y = options.parentOffsetY - childNodesHeight * options.pivotY + 0.5;
            }
            if (options.textDecoration && options.textDecoration === 'LineThrough') {
                options.textDecoration = wordBreakToString(options.textDecoration);
            }
            const attr: Object = {
                'id': options.id + '_text', 'fill': options.color, 'visibility': options.visible ? 'visible' : 'hidden',
                'text-decoration': options.textDecoration, 'transform': 'rotate(' + options.angle + ','
                    + (pivotX) + ',' + (pivotY) + ')'
                    + 'translate(' + (options.x) + ',' + (options.y) + ')', 'opacity': options.opacity,
                'aria-label': ariaLabel ? ariaLabel : ''
            };
            setAttributeSvg(text, attr);
        }
    }

    private setText(
        text: SVGTextElement, tspanElement: SVGElement, child: SubTextElement,
        textNode: Text, offsetX: number, offsetY: number): void {
        setAttributeSvg(tspanElement, { 'x': offsetX.toString(), 'y': offsetY.toString() });
        text.setAttribute('fill', child.text);
        tspanElement.appendChild(textNode);
        text.appendChild(tspanElement);
    }


    /**
     * Draw the image element for the diagram\
     *
     *  @returns {void} Draw the image element for the diagram .
     *  @param { SVGElement | HTMLCanvasElement} canvas - Provide the SVG element .
     *  @param {ImageAttributes} obj - Provide the image attributes .
     *  @param {SVGSVGElement} parentSvg - Provide the parent SVG element .
     *  @param {boolean} fromPalette - Provide the pointer event value .
     *  @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public drawImage(canvas: SVGElement | HTMLCanvasElement, obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean): void {
        ///const id: string = obj.id + '_image';

        let image: SVGImageElement;
        if (parentSvg) {
            image = parentSvg.getElementById(obj.id + 'image') as SVGImageElement;
        }
        if (!image) {
            image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            canvas.appendChild(image);
        }
        const imageObj: HTMLImageElement = new Image();
        imageObj.src = obj.source;
        let scale: string = obj.scale !== 'None' ? obj.scale : '';
        if (isBlazor() && obj.alignment === 'None' && scale === 'Stretch') {
            scale = '';
        }
        const imgAlign: string = obj.alignment;
        let aspectRatio: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1);
        if (scale !== 'Stretch') {
            aspectRatio += ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
        }
        const attr: Object = {
            'id': obj.id + 'image', 'x': obj.x.toString(), 'y': obj.y.toString(), 'transform': 'rotate(' + obj.angle + ','
                + (obj.x + obj.width * obj.pivotX) + ',' + (obj.y + obj.height * obj.pivotY) + ')',
            'width': obj.width.toString(), 'visibility': obj.visible ? 'visible' : 'hidden',
            'height': obj.height.toString(), 'preserveAspectRatio': aspectRatio, 'opacity': (obj.opacity || 1).toString()
        };
        setAttributeSvg(image, attr);
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObj.src.toString());
    }

    /**
     * Draw the HTML element for the diagram\
     *
     *  @returns {void} Draw the native element for the diagram.
     *  @param {DiagramHtmlElement} element - Provide the element .
     *  @param {HTMLElement} canvas - Provide the canvas element  .
     *  @param {Transforms} transform - Provide the transform value .
     *  @param {boolean} value - Provide the pointer event value .
     *  @param {number} indexValue - Provide the index value .
     *  @private
     */
    public drawHTMLContent(
        element: DiagramHtmlElement, canvas: HTMLElement, transform?: Transforms, value?: boolean, indexValue?: number): void {
        let htmlElement: HTMLElement; let parentHtmlElement: HTMLElement;
        if (canvas) {
            let i: number; let j: number; let parentElement: HTMLElement;
            for (i = 0; i < canvas.childNodes.length; i++) {
                parentElement = canvas.childNodes[i] as HTMLElement;
                for (j = 0; j < parentElement.childNodes.length; j++) {
                    if ((parentElement.childNodes[j] as HTMLElement).id === element.id + '_html_element') {
                        htmlElement = parentElement.childNodes[j] as HTMLElement;
                        break;
                    }
                }
            }
        }
        if (!htmlElement) {
            parentHtmlElement = canvas.querySelector(('#' + element.id + '_html_element')) ||
                canvas.querySelector(('#' + element.nodeId + '_html_element'));
            if (!parentHtmlElement) {
                const attr: Object = {
                    'id': element.nodeId + '_html_element',
                    'class': 'foreign-object'
                };
                parentHtmlElement = createHtmlElement('div', attr);
            }
            const attr: Object = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            htmlElement = createHtmlElement('div', attr);
            let isOverviewLayer: boolean = false;
            if (canvas.parentNode && canvas.parentNode.parentNode && canvas.parentNode.parentNode.parentNode && (canvas.parentNode.parentNode.parentNode as any).classList.contains('e-overview')) {
                isOverviewLayer = true;
            }
            if (isOverviewLayer) {
                htmlElement.appendChild(element.template.cloneNode(true));
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                element.isTemplate ? htmlElement.appendChild(element.template) : htmlElement.appendChild(element.template.cloneNode(true));
            }
            if (indexValue !== undefined && canvas.childNodes.length > indexValue) {
                canvas.insertBefore(htmlElement, canvas.childNodes[indexValue]);

            }
            parentHtmlElement.appendChild(htmlElement);
            canvas.appendChild(parentHtmlElement);

        }
        const point: PointModel = cornersPointsBeforeRotation(element).topLeft;
        htmlElement.setAttribute(
            'style', 'height:' + (element.actualSize.height) + 'px; width:' + (element.actualSize.width) +
            'px;left:' + point.x + 'px; top:' + point.y + 'px;' +
            'position:absolute;transform:rotate(' + (element.rotateAngle + element.parentTransform) + 'deg);' +
            'pointer-events:' + (value ? 'all' : 'none')
            + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';'
        );
    }


    /**
     * Draw the native element for the diagram\
     *
     *  @returns {void} Draw the native element for the diagram.
     *  @param {DiagramNativeElement} element - Provide the node element .
     *  @param {HTMLCanvasElement} canvas - Provide the SVG element  .
     *  @param {number} height - Provide the height for the shape .
     *  @param {number} width - Provide the width for the shape .
     *  @param {SVGSVGElement} parentSvg - Provide the parent svg for  the shape .
     *  @private
     */
    public drawNativeContent(
        element: DiagramNativeElement, canvas: HTMLCanvasElement | SVGElement,
        height: number, width: number, parentSvg: SVGSVGElement): void {
        let nativeElement: SVGElement;
        let clipPath: SVGClipPathElement;
        if (parentSvg) {
            nativeElement = parentSvg.getElementById(element.id + '_native_element') as SVGPathElement;
            clipPath = parentSvg.getElementById(element.id + '_clip') as SVGClipPathElement;
        }
        if (!nativeElement) {
            nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nativeElement.setAttribute('id', element.id + '_native_element');
            nativeElement.appendChild(element.template.cloneNode(true));
            let svgContentTag: SVGGElement = this.createGElement('g', { id: element.id + '_inner_native_element' });
            svgContentTag.appendChild(nativeElement);
            canvas.appendChild(svgContentTag);
        }
        if (clipPath) {
            nativeElement.removeChild(clipPath);
        }
        nativeElement.setAttribute('style', 'visibility:' +
            ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';');
        this.setNativTransform(element, nativeElement, height, width);
        if (element.scale === 'Slice') {
            this.drawClipPath(element, nativeElement, height, width, parentSvg);
        }
        setAttributeSvg(nativeElement, element.description ? { 'aria-label': element.description } : {});
    }

    private setNativTransform(element: DiagramNativeElement, nativeElement: SVGElement, height: number, width: number): void {
        //let angle: number;
        const contentWidth: number = element.contentSize.width !== 0 ? element.contentSize.width : 1;
        const contentHeight: number = element.contentSize.height !== 0 ? element.contentSize.height : 1;
        const x: number = element.templatePosition.x * width / contentWidth;
        const y: number = element.templatePosition.y * height / contentHeight;
        nativeElement.setAttribute('transform', 'rotate(' + element.parentTransform + ',' + element.offsetX + ',' + element.offsetY +
            ') translate(' + (element.offsetX - x - width * element.pivot.x) + ',' + (element.offsetY - y - height * element.pivot.y) +
            ') scale(' + (width / contentWidth) + ',' + (height / contentHeight) + ')'
        );
    }


    /**
     *used to crop the given native element into a rectangle of the given size .\
     *
     *  @returns {SVGElement} used to crop the given native element into a rectangle of the given size.
     *  @param {DiagramNativeElement} node - Provide the node element .
     *  @param {SVGElement} group - Provide the SVG element  .
     *  @param {number} height - Provide the height for the shape .
     *  @param {number} width - Provide the width for the shape .
     *  @param {SVGSVGElement} parentSvg - Provide the parent svg for  the shape .
     *  @private
     */
    public drawClipPath(
        node: DiagramNativeElement, group: SVGElement, height: number, width: number, parentSvg: SVGSVGElement
    ): SVGElement {
        const contentWidth: number = node.contentSize.width;
        const contentHeight: number = node.contentSize.height;
        //let actualWidth: number = node.actualSize.width;
        //let actualHeight: number = node.actualSize.height;
        const clipWidth: number = node.width / (width / contentWidth);
        const clipHeight: number = node.height / (height / contentHeight);
        const x: number = node.templatePosition.x + (node.width >= node.height ? 0 : (contentWidth - clipWidth) / 2);
        const y: number = node.templatePosition.y + (node.height >= node.width ? 0 : (contentHeight - clipHeight) / 2);
        let clipPath: SVGClipPathElement = parentSvg.getElementById(node.id + '_clip') as SVGClipPathElement;
        clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', node.id + '_clip');
        group.appendChild(clipPath);
        let rect: SVGRectElement = parentSvg.getElementById(node.id + '_clip_rect') as SVGRectElement;
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipPath.appendChild(rect);
        const attr: Object = {
            'id': node.id + '_clip_rect', 'width': clipWidth.toString(), 'height': clipHeight.toString(),
            'x': x.toString(), 'y': y.toString()
        };
        setAttributeSvg(rect, attr);
        if (checkBrowserInfo()) {
            group.setAttribute('clip-path', 'url(' + location.protocol + '//' + location.host + location.pathname +
            '#' + node.id + '_clip)');
        } else {
            group.setAttribute('clip-path', 'url(#' + node.id + '_clip)');
        }
        return group;
    }


    /**
     * Draw the gradient for the diagram shapes .\
     *
     *  @returns {SVGElement} Draw the gradient for the diagram shapes.
     *  @param {StyleAttributes} options - Provide the options  for the gradient  element .
     *  @param {SVGElement} svg - Provide the SVG element  .
     *  @param {string} diagramId - Provide the diagram id .
     *  @private
     */
    public renderGradient(options: StyleAttributes, svg: SVGElement, diagramId?: string): SVGElement {
        let max: number; let min: number; let grd: SVGElement;

        const svgContainer: SVGSVGElement = getBackgroundLayerSvg(diagramId);


        let defs: SVGElement = svgContainer.getElementById(diagramId + 'gradient_pattern') as SVGElement;
        if (!defs) {
            defs = createSvgElement('defs', { id: diagramId + 'gradient_pattern' }) as SVGGElement;
            svgContainer.insertBefore(defs, svgContainer.firstChild);
        }
        let radial: RadialGradientModel; let linear: LinearGradientModel; //let stop: StopModel; let offset: number;
        removeGradient(svg.id);
        if (options.gradient.type !== 'None') {
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                max = !max ? options.gradient.stops[i].offset : Math.max(max, options.gradient.stops[i].offset);
                min = !min ? options.gradient.stops[i].offset : Math.min(min, options.gradient.stops[i].offset);
            }
            if (options.gradient.type === 'Linear') {
                linear = options.gradient;
                linear.id = svg.id + '_linear';
                grd = this.createLinearGradient(linear);
                defs.appendChild(grd);
            } else {
                radial = options.gradient;
                radial.id = svg.id + '_radial';
                grd = this.createRadialGradient(radial);
                defs.appendChild(grd);
            }
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                const stop: StopModel = options.gradient.stops[i];
                const offset: number = min < 0 ? (max + stop.offset) / (2 * max) : stop.offset / max;
                const stopElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                setAttributeSvg(stopElement, { 'offset': offset.toString(), 'style': 'stop-color:' + stop.color });
                grd.appendChild(stopElement);
            }
        }
        return grd;
    }

    /**
     * Draw the Linear gradient for the diagram .\
     *
     *  @returns {SVGElement} Draw the Linear gradient for the diagram.
     *  @param {LinearGradientModel} linear - Provide the objects for the gradient  element .
     *  @private
     */
    public createLinearGradient(linear: LinearGradientModel): SVGElement {
        const lineargradient: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        const attr: Object = {
            'id': linear.id, 'x1': linear.x1 + '%', 'y1': linear.y1 + '%', 'x2': linear.x2 + '%', 'y2': linear.y2 + '%'
        };
        setAttributeSvg(lineargradient, attr);
        return lineargradient;
    }


    /**
     * Draw the radial gradient for the diagram .\
     *
     *  @returns {SVGElement} Draw the radial gradient for the diagram.
     *  @param {RadialGradientModel} radial - Provide the objects for the gradient  element .
     *  @private
     */
    public createRadialGradient(radial: RadialGradientModel): SVGElement {
        const radialgradient: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        const attr: Object = {
            'id': radial.id, 'cx': radial.cx + '%', 'cy': radial.cy + '%', 'r': radial.r + '%', 'fx': radial.fx + '%', 'fy': radial.fy + '%'
        };
        setAttributeSvg(radialgradient, attr);
        return radialgradient;
    }

    /**
     * Set the SVG style for the SVG elements in the diagram.\
     *
     *  @returns {void}
     *  @param {SVGElement} svg - Provide the canvas element .
     *  @param {StyleAttributes} style - Provide the canvas element .
     *  @param {string} diagramId - Provide the canvas element .
     *  @private
     */
    public setSvgStyle(svg: SVGElement, style: StyleAttributes, diagramId?: string): void {
        if ((style as BaseAttributes).canApplyStyle || (style as BaseAttributes).canApplyStyle === undefined) {
            if (style.fill === 'none') { style.fill = 'transparent'; }
            if (style.stroke === 'none') { style.stroke = 'transparent'; }
            let dashArray: number[] = [];
            let fill: string;
            if (style.dashArray) {
                const canvasRenderer: CanvasRenderer = new CanvasRenderer();
                dashArray = canvasRenderer.parseDashArray(style.dashArray);
            }
            if (style.gradient && style.gradient.type !== 'None' && diagramId) {
                const grd: SVGElement = this.renderGradient(style, svg, diagramId);
                if (checkBrowserInfo()) {
                    fill = 'url(' + location.protocol + '//' + location.host + location.pathname + '#' + grd.id + ')';
                } else {
                    fill = 'url(#' + grd.id + ')';
                }
            } else {
                fill = style.fill;
            }
            if (style.stroke) {
                svg.setAttribute('stroke', style.stroke);
            }
            if (style.strokeWidth !== undefined && style.strokeWidth !== null) {
                svg.setAttribute('stroke-width', style.strokeWidth.toString());
            }
            if (dashArray) {
                svg.setAttribute('stroke-dasharray', dashArray.toString() || 'none');
            }
            if (fill) {
                svg.setAttribute('fill', fill);
            }
        }
    }

    //end region


    // text utility

    /**
     * Draw the SVG label.\
     *
     * @returns {PointModel} Draw the SVG label .
     *  @param {TextAttributes} text - Provide the canvas element .
     *  @param {Object} wrapBound - Provide the canvas element .
     *  @param {SubTextElement []} childNodes - Provide the canvas element .
     * @private
     */
    public svgLabelAlign(text: TextAttributes, wrapBound: TextBounds, childNodes: SubTextElement[]): PointModel {
        const bounds: Size = new Size(wrapBound.width, childNodes.length * (text.fontSize * 1.2));
        const pos: PointModel = { x: 0, y: 0 }; const x: number = 0; const y: number = 1.2;
        const offsetX: number = text.width * 0.5; const offsety: number = text.height * 0.5;
        let pointX: number = offsetX; const pointY: number = offsety;
        if (text.textAlign === 'left') {
            pointX = 0;
        } else if (text.textAlign === 'center') {
            if (wrapBound.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                if (text.textWrapping === 'NoWrap') {
                    pointX = 0;
                } else {
                    pointX = text.width * 0.5;
                }
            } else {
                pointX = text.width * 0.5;
            }
        } else if (text.textAlign === 'right') {
            pointX = (text.width * 1);
        }
        pos.x = x + pointX + (wrapBound ? wrapBound.x : 0);
        pos.y = y + pointY - bounds.height / 2;
        return pos;
    }
    //end region
}


