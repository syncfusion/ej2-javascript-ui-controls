
import { Size } from './../primitives/size';
import { PointModel } from './../primitives/point-model';
import { RectAttributes, TextAttributes, LineAttributes, PathAttributes, PathSegment } from './canvas-interface';
import { StyleAttributes } from './canvas-interface';
import { BaseAttributes, CircleAttributes, SubTextElement, TextBounds } from './canvas-interface';
import { IRenderer } from './../rendering/IRenderer';
import { CanvasRenderer } from './../rendering/canvas-renderer';
import { DrawingElement } from '../core/elements/drawing-element';
import { processPathData, pathSegmentCollection } from '../utility/path-util';
/**
 * SVG Renderer
 */
/** @private */
export class SvgRenderer implements IRenderer {
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
        let id: string;
        if (options.id === svg.id) {
            id = options.id + '_container';
        } else { id = options.id; }
        let rect: SVGElement;
        if (!rect || isSelector) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            svg.appendChild(rect);
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
            // eslint-disable-next-line
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
        let pointerEvents: string = 'pointer-events';
        if (attr['aria-label'] === '') {
            // eslint-disable-next-line
            attr[pointerEvents] = 'none';
        }
        circle.style.display = options.visible ? 'block' : 'none';
        setAttributeSvg(circle, attr);
        gElement.appendChild(circle);
    }
    /**   @private  */
    public setSvgStyle(svg: SVGElement, style: StyleAttributes, diagramId?: string): void {
        if ((style as BaseAttributes).canApplyStyle || (style as BaseAttributes).canApplyStyle === undefined) {
            if (style.fill === 'none') { style.fill = 'transparent'; }
            if (style.stroke === 'none') { style.stroke = 'transparent'; }
            let dashArray: number[] = [];
            let fill: string;
            if (style.dashArray !== undefined) {
                let canvasRenderer: CanvasRenderer = new CanvasRenderer();
                dashArray = canvasRenderer.parseDashArray(style.dashArray);
            }
            fill = style.fill;
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

        let shadowElement: HTMLElement;
        if (parentSvg) {
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
            let obj: Object = segments[parseInt(i.toString(), 10)]; let segment: PathSegment = obj; let char: string = segment.command;
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

    //end region
}
/** @private */
export function setAttributeSvg(svg: SVGElement, attributes: Object): void {
    let keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        svg.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
    }
}
/** @private */
export function createSvgElement(elementType: string, attribute: Object): SVGElement {
    let element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}
/** @private */
export function createSvg(id: string, width: string | Number, height: string | Number): SVGElement {
    let svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
    return svgObj;
}

export function getParentSvg(element: DrawingElement, targetElement?: string, canvas?: HTMLCanvasElement | SVGElement): SVGElement {
    if (element && element.id) {
        if (targetElement && targetElement === 'selector') {
            return this.pdfViewer.adornerSvgLayer;
        }
    }
    return canvas as SVGSVGElement;
}