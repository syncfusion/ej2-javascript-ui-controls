
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
 * @hidden
 * SVG Renderer
 */
export class SvgRenderer implements IRenderer {
    /**
     * @param {string} dashArray - dashArray
     * @private
     * @returns {number[]} - number[]
     */
    public parseDashArray(dashArray: string): number[] {
        const dashes: number[] = [];
        return dashes;
    }
    /**
     * @param {SVGElement} svg - svg
     * @param {RectAttributes} options - options
     * @param {string} diagramId - diagramId
     * @param {boolean} onlyRect - onlyRect
     * @param {boolean} isSelector - isSelector
     * @param {SVGSVGElement} parentSvg - parentSvg
     * @param {Object} ariaLabel - ariaLabel
     * @private
     * @returns {void} - void
     */
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
        const attr: Object = {
            'id': id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'visibility': options.visible ? 'visible' : 'hidden',
            'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            'rx': options.cornerRadius || 0, 'ry': options.cornerRadius || 0, 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            (attr as any)['class'] = options.class;
        }
        const poiterEvents: string = 'pointer-events';
        if (!ariaLabel) {
            (attr as any)[poiterEvents as string] = 'none';
        }
        setAttributeSvg(rect, attr);
        this.setSvgStyle(rect, options as StyleAttributes, diagramId);
    }
    /**
     * @param {SVGElement} gElement - gElement
     * @param {RectAttributes} options - options
     * @private
     * @returns {void} - void
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
     * @param {string} elementType - elementType
     * @param {Object} attribute - attribute
     * @private
     * @returns {SVGGElement} - SVGGElement
     */
    public createGElement(elementType: string, attribute: Object): SVGGElement {
        const gElement: SVGGElement = createSvgElement(elementType, attribute) as SVGGElement;
        return gElement;
    }
    /**
     * @param {SVGElement} gElement - gElement
     * @param {CircleAttributes} options - options
     * @param {number} enableSelector - enableSelector
     * @param {Object} ariaLabel - ariaLabel
     * @private
     * @returns {void} - void
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
            'aria-label': ariaLabel ? (ariaLabel as any)['aria-label'] : ''
        };
        const pointerEvents: string = 'pointer-events';
        if ((attr as any)['aria-label'] === '') {
            (attr as any)[pointerEvents as string] = 'none';
        }
        circle.style.display = options.visible ? 'block' : 'none';
        setAttributeSvg(circle, attr);
        gElement.appendChild(circle);
    }
    /**
     * @param {SVGElement} svg - svg
     * @param {StyleAttributes} style - style
     * @param {string} diagramId - diagramId
     * @private
     * @returns {void} - void
     */
    public setSvgStyle(svg: SVGElement, style: StyleAttributes, diagramId?: string): void {
        if ((style as BaseAttributes).canApplyStyle || (style as BaseAttributes).canApplyStyle === undefined) {
            if (style.fill === 'none') { style.fill = 'transparent'; }
            if (style.stroke === 'none') { style.stroke = 'transparent'; }
            let dashArray: number[] = [];
            if (style.dashArray !== undefined) {
                const canvasRenderer: CanvasRenderer = new CanvasRenderer();
                dashArray = canvasRenderer.parseDashArray(style.dashArray);
            }
            const fill: string = style.fill;
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

    /**
     * text utility
     *
     * @param {TextAttributes} text - text
     * @param {TextBounds} wrapBound - wrapBound
     * @param {SubTextElement[]} childNodes - childNodes
     * @private
     * @returns {PointModel} - PointModel
     */
    public svgLabelAlign(text: TextAttributes, wrapBound: TextBounds, childNodes: SubTextElement[]): PointModel {
        const bounds: Size = new Size(wrapBound.width, childNodes.length * (text.fontSize * 1.2));
        const pos: PointModel = { x: 0, y: 0 };
        const x: number = 0;
        const y: number = 1.2;
        const offsetX: number = text.width * 0.5;
        const offsety: number = text.height * 0.5;
        let pointX: number = offsetX;
        const pointY: number = offsety;
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


    /**
     * @param {SVGElement} gElement - gElement
     * @param {LineAttributes} options - options
     * @private
     * @returns {void} - void
     */
    public drawLine(gElement: SVGElement, options: LineAttributes): void {
        const line: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.setSvgStyle(line, options as StyleAttributes);
        const pivotX: number = options.x + options.width * options.pivotX;
        const pivotY: number = options.y + options.height * options.pivotY;
        const kk: string = '';
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
            (attr as any)['class'] = options.class;
        }
        setAttributeSvg(line, attr);
        gElement.appendChild(line);
    }
    /**
     * @param {SVGElement} svg - svg
     * @param {PathAttributes} options - options
     * @param {string} diagramId - diagramId
     * @param {boolean} isSelector - isSelector
     * @param {SVGSVGElement} parentSvg - parentSvg
     * @param {Object} ariaLabel - ariaLabel
     * @private
     * @returns {void} - void
     */
    public drawPath(
        svg: SVGElement, options: PathAttributes, diagramId: string, isSelector?: Boolean,
        parentSvg?: SVGSVGElement, ariaLabel?: Object): void {
        const x: number = Math.floor((Math.random() * 10) + 1);
        const id: string = svg.id + '_shape' + x.toString();
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
        const attr: Object = {
            'id': options.id, 'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' + 'translate(' + (options.x) + ',' + (options.y) + ')',
            'visibility': options.visible ? 'visible' : 'hidden', 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            (attr as any)['class'] = options.class;
        }
        setAttributeSvg(path, attr);
        this.setSvgStyle(path, options as StyleAttributes, diagramId);
    }

    /**
     * @param {SVGElement} svg - svg
     * @param {PathAttributes} options - options
     * @param {Object[]} collection - collection
     * @private
     * @returns {void} - void
     */
    public renderPath(svg: SVGElement, options: PathAttributes, collection: Object[]): void {
        let x1: number; let y1: number;
        let x2: number; let y2: number;
        let x: number; let y: number;
        let length: number; let i: number;
        const segments: Object[] = collection;
        let d: string = '';
        for (x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
            const obj: Object = segments[parseInt(i.toString(), 10)];
            const segment: PathSegment = obj;
            const char: string = segment.command;
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
/**
 * @param {SVGElement} svg - svg
 * @param {Object} attributes - attributes
 * @private
 * @returns {void} - void
 */
export function setAttributeSvg(svg: SVGElement, attributes: Object): void {
    const keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        if (keys[parseInt(i.toString(), 10)] === 'style') {
            svg.style.cssText = (attributes as any)[keys[parseInt(i.toString(), 10)]];
        }
        else {
            svg.setAttribute(keys[parseInt(i.toString(), 10)], (attributes as any)[keys[parseInt(i.toString(), 10)]]);
        }
    }
}
/**
 * @param {SVGElement} elementType - elementType
 * @param {PathAttributes} attribute - attribute
 * @private
 * @returns {SVGElement} - SVGElement
 */
export function createSvgElement(elementType: string, attribute: Object): SVGElement {
    const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}
/**
 * @param {string} id - id
 * @param {string | Number} width - width
 * @param {string | Number} height - height
 * @private
 * @returns {SVGElement} - SVGElement
 */
export function createSvg(id: string, width: string | Number, height: string | Number): SVGElement {
    const svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
    return svgObj;
}
/**
 * @param {DrawingElement} element - element
 * @param {string} targetElement - targetElement
 * @param {HTMLCanvasElement | SVGElement} canvas - canvas
 * @private
 * @returns {SVGElement} - SVGElement
 */
export function getParentSvg(element: DrawingElement, targetElement?: string, canvas?: HTMLCanvasElement | SVGElement): SVGElement {
    if (element && element.id) {
        if (targetElement && targetElement === 'selector') {
            return this.pdfViewer.adornerSvgLayer;
        }
    }
    return canvas as SVGSVGElement;
}
