import { createElement, SvgRenderer, compile as templateComplier, remove } from '@syncfusion/ej2-base';
import { Smithchart } from '../../smithchart/smithchart';
import {SmithchartFontModel, SmithchartBorderModel} from '../../smithchart/utils/utils-model';
import { Animation, AnimationOptions, Effect} from '@syncfusion/ej2-base';
import { SmithchartSize, SmithchartRect } from '../../smithchart/utils/utils';



export function createSvg(smithchart: Smithchart): void {
    smithchart.renderer = new SvgRenderer(smithchart.element.id);
    calculateSize(smithchart);
    smithchart.svgObject = smithchart.renderer.createSvg({
        id: smithchart.element.id + '_svg',
        width: smithchart.availableSize.width,
        height: smithchart.availableSize.height
    });
}

export function getElement(id: string): Element {
    return document.getElementById(id);
}
/**
 * @private
 * Trim the title text
 */
export function textTrim(maxwidth: number, text: string, font: SmithchartFontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxwidth) {
        let textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxwidth || label.length < 4) {
                if (label.length < 4) {
                    label = ' ';
                }
                return label;
            }
        }
    }
    return label;
}
/**
 * Function     to compile the template function for maps.
 * @returns Function
 * @private
 */
export function getTemplateFunction(templateString: string): Function {
    let templateFn: Function = null;
    let e: Object;
    try {
        if (document.querySelectorAll(templateString).length) {
            templateFn = templateComplier(document.querySelector(templateString).innerHTML.trim());
        }
    } catch (e) {
        templateFn = templateComplier(templateString);
    }
    return templateFn;
}

export function convertElementFromLabel(element: Element,  labelId: string,
                                        data: object, index: number, smithchart: Smithchart): HTMLElement {
    let labelEle: Element = element[0];
    let templateHtml: string = labelEle.outerHTML;
    let properties: Object[] = Object.keys(data);
    for (let i: number = 0; i < properties.length; i++) {
        templateHtml = templateHtml.replace(new RegExp('{{:' + <String>properties[i] + '}}', 'g'), data[properties[i].toString()]);
    }
    return createElement('div', {
        id: labelId,
        innerHTML: templateHtml,
        styles: 'position: absolute'
    });
}

export function _getEpsilonValue(): number {
            let e: number = 1.0;
            while ((1.0 + 0.5 * e) !== 1.0) {
                e *= 0.5;
            }
            return e;
        }


/**
 * Method to calculate the width and height of the smithchart
 */
export function calculateSize(smithchart: Smithchart): void {
    let containerWidth: number = smithchart.element.clientWidth;
    let containerHeight: number = smithchart.element.clientHeight;

    smithchart.availableSize = new SmithchartSize(
        stringToNumber(smithchart.width, containerWidth) || containerWidth || 600,
        stringToNumber(smithchart.height, containerHeight) || containerHeight || 450

    );
}
/**
 * Animation for template
 * @private
 */

export function templateAnimate(smithchart: Smithchart, element: Element, delay: number, duration: number, name: Effect
): void {
    let opacity : number = 0;
    let delta : number;
    let value : number;
    new Animation({}).animate(<HTMLElement>element, {
        duration: duration,
        delay: delay,
        name: name,
        progress: (args: AnimationOptions): void => {
            delta = ((args.timeStamp - args.delay) / args.duration);
            value = opacity + (delta * 1);
            args.element.style.opacity = value.toString();
        },
        end: (args: AnimationOptions): void => {
            let opacity : number = 1;
            args.element.style.opacity = opacity.toString();
            smithchart.trigger('animationComplete', event);
        },
    });
}

/** @private */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}


/**
 * Internal use of path options
 * @private
 */
export class PathOption {
    public id: string;
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;
    constructor(
        id: string, fill: string, width: number, color: string, opacity?: number,
        dashArray?: string, d?: string
    ) {
        this.id = id;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}

/**
 * Internal use of rectangle options
 * @private
 */
export class RectOption extends PathOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public transform: string;
    constructor(
        id: string, fill: string, border: SmithchartBorderModel, opacity: number,
        rect: SmithchartRect
    ) {
        super(id, fill, border.width, border.color, opacity);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
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
    constructor(
        id: string, fill: string, border: SmithchartBorderModel, opacity: number, cx: number, cy: number, r: number, dashArray: string) {
        super(id, fill, border.width, border.color, opacity);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
        this['stroke-dasharray'] = dashArray;
    }
}

export function measureText(text: string, font: SmithchartFontModel): SmithchartSize {
    let htmlObject: HTMLElement = document.getElementById('smithchartmeasuretext');

    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'smithchartmeasuretext' });
        document.body.appendChild(htmlObject);
    }

    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.left = '0';
    htmlObject.style.top = '-100';
    htmlObject.style.whiteSpace = 'nowrap';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
     // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new SmithchartSize(htmlObject.clientWidth, htmlObject.clientHeight);
}

/**
 * Internal use of text options
 * @private
 */
export class TextOption {
    public id: string;
    public anchor: string;
    public text: string;
    public x: number;
    public y: number;

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
    }
}

/**
 * To remove element by id
 */
export function removeElement(id: string): void {
    let element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}

/**
 * Animation Effect Calculation Started Here
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */


export function linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

export function reverselinear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -startValue * Math.sin(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

/** @private */
export function getAnimationFunction(effect: string): Function {
    let functionName: Function;
    switch (effect) {
        case 'Linear':
            functionName = linear;
            break;
            case 'Reverse':
            functionName = reverselinear;
            break;
    }
    return functionName;
}

/**
 * Internal rendering of text
 * @private
 */
export function renderTextElement(
    options: TextOption, font: SmithchartFontModel, color: string, parent: HTMLElement | Element
): Element {
    let renderOptions: Object = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': options.anchor,
        'opacity': font.opacity
    };
    let text: string = options.text;
    let renderer: SvgRenderer = new SvgRenderer('');
    let height: number;
    let htmlObject: Element = renderer.createText(renderOptions, text);
    parent.appendChild(htmlObject);
    return htmlObject;
}