import { Sparkline } from '../sparkline';
import { SvgRenderer, createElement, remove } from '@syncfusion/ej2-base';
import { SparklineBorderModel, SparklineFontModel } from '../model/base-model';
/**
 * Sparkline control helper file
 */

/**
 * sparkline internal use of `Size` type
 */
export class Size {
    /**
     * height of the size
     */
    public height: number;
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
/**
 * To find number from string
 * @private
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Method to calculate the width and height of the sparkline
 */
export function calculateSize(sparkline: Sparkline): void {
    let containerWidth: number = sparkline.element.clientWidth;
    let containerHeight: number = sparkline.element.clientHeight;
    sparkline.availableSize = new Size(
        stringToNumber(sparkline.width, containerWidth) || containerWidth || 100,
        stringToNumber(sparkline.height, containerHeight) || containerHeight || (sparkline.isDevice ?
            Math.min(window.innerWidth, window.innerHeight) : 50)
    );
}
/**
 * Method to create svg for sparkline.
 */
export function createSvg(sparkline: Sparkline): void {
    sparkline.renderer = new SvgRenderer(sparkline.element.id);
    calculateSize(sparkline);
    sparkline.svgObject = sparkline.renderer.createSvg({
        id: sparkline.element.id + '_svg',
        width: sparkline.availableSize.width,
        height: sparkline.availableSize.height
    });
}

/**
 * Internal use of type rect
 * @private
 */
export class Rect {

    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/**
 * Internal use of path options
 * @private
 */
export class PathOption {
    public opacity: number;
    public id: string;
    public stroke: string;
    public fill: string;
    public ['stroke-dasharray']: string;
    public ['stroke-width']: number;
    public d: string;
    constructor(
        id: string, fill: string, width: number, color: string, opacity?: number,
        dashArray?: string, d?: string
    ) {
        this.id = id;
        this.fill = fill;
        this.opacity = opacity;
        this['stroke-width'] = width;
        this.stroke = color;
        this.d = d;
        this['stroke-dasharray'] = dashArray;
    }
}
/**
 * Sparkline internal rendering options
 * @private
 */
export interface SparkValues {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    percent?: number;
    degree?: number;
    location?: {x: number, y: number};
    markerPosition?: number;
    xVal?: number;
    yVal?: number;
}
/**
 * Internal use of rectangle options
 * @private
 */
export class RectOption extends PathOption {

    public rect: Rect;
    public topLeft: number;
    public topRight: number;
    public bottomLeft: number;
    public bottomRight: number;
    constructor(
        id: string, fill: string, border: SparklineBorderModel, opacity: number,
        rect: Rect, tl: number = 0, tr: number = 0, bl: number = 0, br: number = 0
    ) {
        super(id, fill, border.width, border.color, opacity);
        this.rect = rect;
        this.topLeft = tl;
        this.topRight = tr;
        this.bottomLeft = bl;
        this.bottomRight = br;
    }
}
/**
 * Internal use of circle options
 * @private
 */
export class CircleOption extends PathOption {
    public cy: number;
    public cx: number;
    public r: number;
    public ['stroke-dasharray']: string;
    constructor(id: string, fill: string, border: SparklineBorderModel, opacity: number, cx: number, cy: number, r: number,
                dashArray: string) {
        super(id, fill, border.width, border.color, opacity);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
        this['stroke-dasharray'] = dashArray;
    }
}

/**
 * Internal use of append shape element
 * @private
 */
export function appendShape(shape: Element, element: Element): Element {
    if (element) { element.appendChild(shape); }
    return shape;
}
/**
 * Internal rendering of Circle
 * @private
 */
export function drawCircle(sparkline: Sparkline, options: CircleOption, element?: Element): Element {
    return appendShape(sparkline.renderer.drawCircle(options), element);
}
/**
 * To get rounded rect path direction
 */
export function calculateRoundedRectPath(
    r: Rect, topLeft: number, topRight: number,
    bottomLeft: number, bottomRight: number
): string {
    return 'M' + ' ' + r.x + ' ' + (topLeft + r.y) +
        ' Q ' + r.x + ' ' + r.y + ' ' + (r.x + topLeft) + ' ' +
        r.y + ' ' + 'L' + ' ' + (r.x + r.width - topRight) + ' ' + r.y +
        ' Q ' + (r.x + r.width) + ' ' + r.y + ' ' +
        (r.x + r.width) + ' ' + (r.y + topRight) + ' ' + 'L ' +
        (r.x + r.width) + ' ' + (r.y + r.height - bottomRight)
        + ' Q ' + (r.x + r.width) + ' ' + (r.y + r.height) + ' ' + (r.x + r.width - bottomRight) + ' ' +
        (r.y + r.height) + ' ' + 'L ' + (r.x + bottomLeft) + ' ' + (r.y + r.height) + ' Q ' + r.x + ' ' +
        (r.y + r.height) + ' ' + r.x + ' ' + (r.y + r.height - bottomLeft) + ' ' + 'L' + ' ' + r.x + ' ' +
        (topLeft + r.y) + ' ' + 'Z';
}
/**
 * Internal rendering of Rectangle
 * @private
 */
export function drawRectangle(sparkline: Sparkline, options: RectOption, element?: Element): Element {
    options.d = calculateRoundedRectPath(options.rect, options.topLeft, options.topRight, options.bottomLeft, options.bottomRight);
    return appendShape(sparkline.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Path
 * @private
 */
export function drawPath(sparkline: Sparkline, options: PathOption, element?: Element): Element {
    return appendShape(sparkline.renderer.drawPath(options), element);
}

/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {SparklineFontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
export function measureText(text: string, font: SparklineFontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('sparklinesmeasuretext');

    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'sparklinesmeasuretext' });
        document.body.appendChild(htmlObject);
    }

    htmlObject.innerHTML = text;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}

/**
 * Internal use of text options
 * @private
 */
export class TextOption {
    public id: string;
    public anchor: string;
    public text: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public baseLine: string = 'auto';

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string, baseLine?: string, transform: string = '') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
}
/**
 * Internal rendering of text
 * @private
 */
export function renderTextElement(options: TextOption, font: SparklineFontModel, color: string, parent: HTMLElement | Element): Element {
    let textOptions: Object = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'transform': options.transform,
        'opacity': font.opacity,
        'fill': color,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'text-anchor': options.anchor,
        'dominant-baseline': options.baseLine
    };
    let renderer: SvgRenderer = new SvgRenderer('');
    let htmlObject: HTMLElement = <HTMLElement>renderer.createText(textOptions, options.text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * To remove element by id
 */
export function removeElement(id: string): void {
    let element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}
/**
 * To find the element by id
 */
export function getIdElement(id: string): Element {
    return document.getElementById(id);
}
/**
 * To find point within the bounds.
 */
export function withInBounds(x: number, y: number, bounds: Rect): boolean {
    return (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height);
}