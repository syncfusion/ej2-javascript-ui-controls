import { Point } from './../primitives/point';
import { Size } from './../primitives/size';
import { PointModel } from './../primitives/point-model';
import { RectAttributes, PathAttributes, TextAttributes } from './canvas-interface';
import { pathSegmentCollection, processPathData } from './../utility/path-util';
import { PathSegment, ImageAttributes, StyleAttributes } from './canvas-interface';
import { BaseAttributes, LineAttributes, CircleAttributes, SubTextElement, TextBounds } from './canvas-interface';
import { LinearGradientModel, RadialGradientModel, StopModel } from './../core/appearance-model';
import { IRenderer } from './../rendering/IRenderer';
import { setAttributeSvg } from './../utility/dom-util';
import { overFlow, wordBreakToString, cornersPointsBeforeRotation } from './../utility/base-util';
import { CanvasRenderer } from './../rendering/canvas-renderer';
import { DiagramNativeElement } from '../core/elements/native-element';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { TransformFactor as Transforms } from '../interaction/scroller';
import { createSvgElement, createHtmlElement, getBackgroundLayerSvg } from '../utility/dom-util';
/** 
 * SVG Renderer
 */

/** @private */
export class SvgRenderer implements IRenderer {
    /**   @private  */
    public renderShadow(options: BaseAttributes, canvas: SVGElement, collection: Object[] = null, parentSvg?: SVGSVGElement): void {
        let pointModel: PointModel = { x: 0, y: 0 };
        let point: PointModel = Point.transform(pointModel, options.shadow.angle, options.shadow.distance);
        let tX: number = options.x + point.x; let tY: number = options.y + point.y;
        let pivotX: number = tX + options.width * options.pivotX;
        let pivotY: number = tY + options.height * options.pivotY; let type: string;
        let shadowElement: SVGPathElement | SVGRectElement;
        if (parentSvg) {
            shadowElement = parentSvg.getElementById(canvas.id + '_shadow') as SVGPathElement;
        }
        if (!shadowElement) {
            type = collection ? 'path' : 'rect';
            shadowElement = document.createElementNS('http://www.w3.org/2000/svg', type) as SVGRectElement | SVGPathElement;
            canvas.appendChild(shadowElement);
        }
        let attr: Object = {
            'id': canvas.id + '_shadow', 'fill': options.shadow.color, 'stroke': options.shadow.color,
            'opacity': options.shadow.opacity.toString(),
            'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' +
                'translate(' + (options.x + point.x) + ',' + (options.y + point.y) + ')'

        };
        if (parentSvg) {
            let svgContainer: HTMLElement = parentSvg.getElementById(canvas.id) as HTMLElement;
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


    /**   @private  */
    public parseDashArray(dashArray: string): number[] {
        let dashes: number[] = [];

        return dashes;
    }

    /**   @private  */
    public drawRectangle(
        svg: SVGElement, options: RectAttributes, diagramId: string, onlyRect?: boolean,
        isSelector?: Boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object):
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


        let attr: Object = {
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
        let poiterEvents: string = 'pointer-events';
        if (!ariaLabel) {
            attr[poiterEvents] = 'none';
        }
        setAttributeSvg(rect, attr);
        this.setSvgStyle(rect, options as StyleAttributes, diagramId);
    }

    /**   @private  */
    public updateSelectionRegion(gElement: SVGElement, options: RectAttributes): void {
        let rect: SVGElement;
        rect = (gElement.parentNode as SVGSVGElement).getElementById(options.id) as SVGElement;
        let attr: Object;
        attr = {
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

    /**   @private  */
    public createGElement(elementType: string, attribute: Object): SVGGElement {
        let gElement: SVGGElement = createSvgElement(elementType, attribute) as SVGGElement;
        return gElement;
    }

    /** @private */
    public drawLine(gElement: SVGElement, options: LineAttributes): void {
        let line: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.setSvgStyle(line, options as StyleAttributes);
        let pivotX: number = options.x + options.width * options.pivotX;
        let pivotY: number = options.y + options.height * options.pivotY;
        let kk: string = '';
        let attr: Object = {
            'id': options.id,
            'x1': options.startPoint.x + options.x,
            'y1': options.startPoint.y + options.y,
            'x2': options.endPoint.x + options.x,
            'y2': options.endPoint.y + options.y,
            'stroke': options.stroke,
            'stroke-width': options.strokeWidth.toString(), 'opacity': options.opacity.toString(),
            'transform': 'rotate(' + options.angle + ' ' + pivotX + ' ' + pivotY + ')',
            'visibility': options.visible ? 'visible' : 'hidden',
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(line, attr);
        gElement.appendChild(line);
    }
    /** @private */
    public drawCircle(gElement: SVGElement, options: CircleAttributes, enableSelector?: number, ariaLabel?: Object): void {
        let circle: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.setSvgStyle(circle, options as StyleAttributes);
        let classval: string = options.class || '';
        if (!enableSelector) {
            classval += ' e-disabled';
        }
        let attr: Object = {
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
    /**   @private  */
    public drawPath(
        svg: SVGElement, options: PathAttributes, diagramId: string, isSelector?: Boolean,
        parentSvg?: SVGSVGElement, ariaLabel?: Object): void {
        let id: string;
        let x: number = Math.floor((Math.random() * 10) + 1);
        id = svg.id + '_shape' + x.toString();
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
        let attr: Object = {
            'id': options.id, 'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' + 'translate(' + (options.x) + ',' + (options.y) + ')',
            'visibility': options.visible ? 'visible' : 'hidden', 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(path, attr);
        this.setSvgStyle(path, options as StyleAttributes, diagramId);
    }

    /**   @private  */
    public renderPath(svg: SVGElement, options: PathAttributes, collection: Object[]): void {
        let x1: number; let y1: number;
        let x2: number; let y2: number;
        let x: number; let y: number;
        let length: number; let i: number;
        let segments: Object[] = collection;
        let d: string = '';
        for (x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
            let obj: Object = segments[i]; let segment: PathSegment = obj; let char: string = segment.command;
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

    /**   @private  */
    public drawText(canvas: SVGElement, options: TextAttributes, parentSvg?: SVGSVGElement, ariaLabel?: Object, diagramId?: string): void {
        if (options.content !== undefined) {
            let textNode: Text;
            let childNodes: SubTextElement[];
            let wrapBounds: TextBounds; let position: PointModel; let child: SubTextElement;
            let tspanElement: SVGElement; let offsetX: number = 0;
            let offsetY: number = 0;
            let i: number = 0;
            let text: SVGTextElement;
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
                canvas.appendChild(text);
            }
            let pivotX: number = options.x + options.width * options.pivotX;
            let pivotY: number = options.y + options.height * options.pivotY;
            if (options.doWrap) {
                this.setSvgStyle(text, options as StyleAttributes, diagramId);
                this.setSvgFontStyle(text, options);
                textNode = document.createTextNode(options.content);
                childNodes = options.childNodes;
                wrapBounds = options.wrapBounds;
                position = this.svgLabelAlign(options, wrapBounds, childNodes);
                if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                    childNodes[0].text = overFlow(options.content, options);
                }
                for (i = 0; i < childNodes.length; i++) {
                    tspanElement = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    textNode = document.createTextNode(childNodes[i].text);
                    child = childNodes[i];
                    offsetX = position.x + child.x - wrapBounds.x;
                    offsetY = position.y + child.dy * (i) + ((options.fontSize) * 0.8);
                    setAttributeSvg(tspanElement, { 'x': offsetX.toString(), 'y': offsetY.toString() });
                    text.setAttribute('fill', child.text);
                    tspanElement.appendChild(textNode);
                    text.appendChild(tspanElement);

                }
            }
            if (options.textDecoration && options.textDecoration === 'LineThrough') {
                options.textDecoration = wordBreakToString(options.textDecoration);
            }
            let attr: Object = {
                'id': options.id + '_text', 'fill': options.color, 'visibility': options.visible ? 'visible' : 'hidden',
                'text-decoration': options.textDecoration, 'transform': 'rotate(' + options.angle + ','
                    + (pivotX) + ',' + (pivotY) + ')'
                    + 'translate(' + (options.x) + ',' + (options.y) + ')', 'opacity': options.opacity,
                'aria-label': ariaLabel ? ariaLabel : ''
            };
            setAttributeSvg(text, attr);
        }
    }
    /**   @private  */
    public drawImage(canvas: SVGElement | HTMLCanvasElement, obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean): void {
        let id: string = obj.id + '_image';

        let image: SVGImageElement;
        if (parentSvg) {
            image = parentSvg.getElementById(obj.id + 'image') as SVGImageElement;
        }
        if (!image) {
            image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            canvas.appendChild(image);
        }
        let imageObj: HTMLImageElement = new Image();
        imageObj.src = obj.source;

        let scale: string = obj.scale !== 'None' ? obj.scale : '';
        let imgAlign: string = obj.alignment;
        let aspectRatio: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1);
        if (scale) {
            aspectRatio += ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
        }
        let attr: Object = {
            'id': obj.id + 'image', 'x': obj.x.toString(), 'y': obj.y.toString(), 'transform': 'rotate(' + obj.angle + ','
                + (obj.x + obj.width * obj.pivotX) + ',' + (obj.y + obj.height * obj.pivotY) + ')',
            'width': obj.width.toString(), 'visibility': obj.visible ? 'visible' : 'hidden',
            'height': obj.height.toString(), 'preserveAspectRatio': aspectRatio
        };
        setAttributeSvg(image, attr);
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObj.src.toString());
    }

    /** @private */
    public drawHTMLContent(element: DiagramHtmlElement, canvas: HTMLElement, transform?: Transforms, value?: boolean): void {
        let htmlElement: HTMLElement;
        if (canvas) {
            let i: number;
            for (i = 0; i < canvas.childNodes.length; i++) {
                if ((canvas.childNodes[i] as HTMLElement).id === element.id + '_html_element') {
                    htmlElement = canvas.childNodes[i] as HTMLElement;
                }
            }
        }
        if (!htmlElement) {
            let attr: Object = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            htmlElement = createHtmlElement('div', attr);
            htmlElement.appendChild(element.template.cloneNode(true));
            canvas.appendChild(htmlElement);
        }
        let point: PointModel = cornersPointsBeforeRotation(element).topLeft;
        htmlElement.setAttribute(
            'style', 'height:' + (element.actualSize.height) + 'px; width:' + (element.actualSize.width) +
            'px;left:' + point.x + 'px; top:' + point.y + 'px;' +
            'position:absolute;transform:rotate(' + element.parentTransform + 'deg);' +
            'pointer-events:' + (value ? 'all' : 'none')
            + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';'
        );
    }

    /** @private */
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
            canvas.appendChild(nativeElement);
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
        let contentWidth: number = element.contentSize.width !== 0 ? element.contentSize.width : 1;
        let contentHeight: number = element.contentSize.height !== 0 ? element.contentSize.height : 1;
        let x: number = element.templatePosition.x * width / contentWidth;
        let y: number = element.templatePosition.y * height / contentHeight;
        nativeElement.setAttribute('transform', 'rotate(' + element.parentTransform + ',' + element.offsetX + ',' + element.offsetY +
            ') translate(' + (element.offsetX - x - width * element.pivot.x) + ',' + (element.offsetY - y - height * element.pivot.y) +
            ') scale(' + (width / contentWidth) + ',' + (height / contentHeight) + ')'
        );
    }

    /**
     * used to crop the given native element into a rectangle of the given size
     * @private
     * @param node
     * @param group 
     * @param height 
     * @param width 
     * @param parentSvg 
     */
    public drawClipPath(
        node: DiagramNativeElement, group: SVGElement, height: number, width: number, parentSvg: SVGSVGElement
    ): SVGElement {
        let contentWidth: number = node.contentSize.width;
        let contentHeight: number = node.contentSize.height;
        let actualWidth: number = node.actualSize.width;
        let actualHeight: number = node.actualSize.height;
        let clipWidth: number = node.width / (width / contentWidth);
        let clipHeight: number = node.height / (height / contentHeight);
        let x: number = node.templatePosition.x + (node.width >= node.height ? 0 : (contentWidth - clipWidth) / 2);
        let y: number = node.templatePosition.y + (node.height >= node.width ? 0 : (contentHeight - clipHeight) / 2);
        let clipPath: SVGClipPathElement = parentSvg.getElementById(node.id + '_clip') as SVGClipPathElement;
        clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', node.id + '_clip');
        group.appendChild(clipPath);
        let rect: SVGRectElement = parentSvg.getElementById(node.id + '_clip_rect') as SVGRectElement;
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipPath.appendChild(rect);
        let attr: Object = {
            'id': node.id + '_clip_rect', 'width': clipWidth.toString(), 'height': clipHeight.toString(),
            'x': x.toString(), 'y': y.toString()
        };
        setAttributeSvg(rect, attr);
        group.setAttribute('clip-path', 'url(#' + node.id + '_clip)');
        return group;
    }

    /**   @private  */
    public renderGradient(options: StyleAttributes, svg: SVGElement, diagramId?: string): SVGElement {
        let max: number; let min: number; let grd: SVGElement;

        let svgContainer: SVGSVGElement = getBackgroundLayerSvg(diagramId);


        let defs: SVGElement = svgContainer.getElementById(diagramId + 'gradient_pattern') as SVGElement;
        if (!defs) {
            defs = createSvgElement('defs', { id: diagramId + 'gradient_pattern' }) as SVGGElement;
            svgContainer.insertBefore(defs, svgContainer.firstChild);
        }
        let radial: RadialGradientModel; let linear: LinearGradientModel; let stop: StopModel; let offset: number;

        if (options.gradient.type !== 'None') {
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                max = !max ? options.gradient.stops[i].offset : Math.max(max, options.gradient.stops[i].offset);
                min = !min ? options.gradient.stops[i].offset : Math.min(min, options.gradient.stops[i].offset);
            }
            if (options.gradient.type === 'Linear') {
                linear = options.gradient;
                linear.id = svg.id + '_linear';
                grd = svgContainer.getElementById(svg.id + '_linear') as SVGElement;
                if (grd) {
                    grd.parentNode.removeChild(grd);
                }
                grd = this.createLinearGradient(linear);
                defs.appendChild(grd);
            } else {
                radial = options.gradient;
                radial.id = svg.id + '_radial';
                grd = svgContainer.getElementById(svg.id + '_radial') as SVGElement;
                grd = svgContainer.getElementById(svg.id + '_linear') as SVGElement;
                if (grd) {
                    grd.parentNode.removeChild(grd);
                }
                grd = this.createRadialGradient(radial);
                defs.appendChild(grd);
            }
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                let stop: StopModel = options.gradient.stops[i];
                let offset: number = min < 0 ? (max + stop.offset) / (2 * max) : stop.offset / max;
                let stopElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                setAttributeSvg(stopElement, { 'offset': offset.toString(), 'style': 'stop-color:' + stop.color });
                grd.appendChild(stopElement);
            }
        }
        return grd;
    }

    /**   @private  */
    public createLinearGradient(linear: LinearGradientModel): SVGElement {
        let lineargradient: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        let attr: Object = {
            'id': linear.id, 'x1': linear.x1 + '%', 'y1': linear.y1 + '%', 'x2': linear.x2 + '%', 'y2': linear.y2 + '%'
        };
        setAttributeSvg(lineargradient, attr);
        return lineargradient;
    }

    /**   @private  */
    public createRadialGradient(radial: RadialGradientModel): SVGElement {
        let radialgradient: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        let attr: Object = {
            'id': radial.id, 'cx': radial.cx + '%', 'cy': radial.cy + '%', 'r': radial.r + '%', 'fx': radial.fx + '%', 'fy': radial.fy + '%'
        };
        setAttributeSvg(radialgradient, attr);
        return radialgradient;
    }
    /**   @private  */
    public setSvgStyle(svg: SVGElement, style: StyleAttributes, diagramId?: string): void {
        if (style.fill === 'none') { style.fill = 'transparent'; }
        if (style.stroke === 'none') { style.stroke = 'transparent'; }
        let dashArray: number[] = [];
        let fill: string;
        if (style.dashArray !== undefined) {
            let canvasRenderer: CanvasRenderer = new CanvasRenderer();
            dashArray = canvasRenderer.parseDashArray(style.dashArray);
        }
        if (style.gradient && style.gradient.type !== 'None') {
            let grd: SVGElement = this.renderGradient(style, svg, diagramId);
            fill = 'url(#' + grd.id + ')';
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
            svg.setAttribute('stroke-dasharray', dashArray.toString());
        }
        if (fill) {
            svg.setAttribute('fill', fill);
        }
    }

    //end region


    // text utility

    /**   @private  */
    public svgLabelAlign(text: TextAttributes, wrapBound: TextBounds, childNodes: SubTextElement[]): PointModel {
        let bounds: Size = new Size(wrapBound.width, childNodes.length * (text.fontSize * 1.2));
        let pos: PointModel = { x: 0, y: 0 }; let x: number = 0; let y: number = 1.2;
        let offsetX: number = text.width * 0.5; let offsety: number = text.height * 0.5;
        let pointX: number = offsetX; let pointY: number = offsety;
        if (text.textAlign === 'left') {
            pointX = 0;
        } else if (text.textAlign === 'center') {
            if (wrapBound.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                pointX = 0;
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


