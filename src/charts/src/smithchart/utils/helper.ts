import { createElement, compile as templateComplier, remove } from '@syncfusion/ej2-base';
import { Smithchart } from '../../smithchart/smithchart';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { SmithchartFontModel, SmithchartBorderModel } from '../../smithchart/utils/utils-model';
import { Animation, AnimationOptions, Effect } from '@syncfusion/ej2-base';
import { SmithchartSize, SmithchartRect } from '../../smithchart/utils/utils';


/**
 * To create the svg element.
 *
 * @param {Smithchart} smithchart smithchart instance
 * @returns {void}
 */
export function createSvg(smithchart: Smithchart): void {
    smithchart.renderer = new SvgRenderer(smithchart.element.id);
    calculateSize(smithchart);
    smithchart.svgObject = smithchart.renderer.createSvg({
        id: smithchart.element.id + '_svg',
        width: smithchart.availableSize.width,
        height: smithchart.availableSize.height
    });
}

/**
 * To get the html element from DOM.
 *
 * @param {string} id id of the html element
 * @returns {Element} html element.
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}
/**
 * To trim the text by given width.
 *
 * @param {number} maximumWidth - max width of the text
 * @param {string} text - text
 * @param {SmithchartFontModel} font - text style
 * @param {SmithchartFontModel} themeFontStyle - theme font style
 * @returns {string} - It returns trimmed text
 */
export function textTrim(maximumWidth: number, text: string, font: SmithchartFontModel, themeFontStyle: SmithchartFontModel): string {
    let label: string = text;
    let size: number = measureText(text, font, themeFontStyle).width;
    if (size > maximumWidth) {
        const textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font, themeFontStyle).width;
            if (size <= maximumWidth || label.length < 4) {
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
 * Function to compile the template function for maps.
 *
 * @param {string | Function} templateString - template with string format.
 * @returns {Function} - return template function.
 * @private
 */
export function getTemplateFunction(templateString: string | Function): Function {
    let templateFn: Function = null;
    try {
        if (typeof templateString !== 'function' && document.querySelectorAll(templateString).length) {
            templateFn = templateComplier(document.querySelector(templateString).innerHTML.trim());
        } else {
            templateFn = templateComplier(templateString);
        }
    } catch (e) {
        templateFn = templateComplier(templateString);
    }
    return templateFn;
}

/**
 * Get element from label.
 *
 * @param {Element} element - element
 * @param {string} labelId - label id
 * @param {object} data - chart data
 * @returns {HTMLElement} - html element
 */
export function convertElementFromLabel(
    element: Element, labelId: string, data: object): HTMLElement {
    const labelEle: Element = element[0];
    let templateHtml: string = labelEle.outerHTML;
    const properties: Object[] = Object.keys(data);
    const regExp: RegExpConstructor = RegExp;
    for (let i: number = 0; i < properties.length; i++) {
        templateHtml = templateHtml.replace(new regExp('{{:' + <string>properties[i as number] + '}}', 'g'), data[properties[i as number].toString()]);
    }
    const templateElement : HTMLElement = createElement('div', {
        id: labelId,
        styles: 'position: absolute'
    });
    templateElement.innerText = templateHtml;
    return templateElement;
}

/**
 * Get epsilon value.
 *
 * @returns {number} - return epsilon value.
 * @private
 */
export function _getEpsilonValue(): number {
    let e: number = 1.0;
    while ((1.0 + 0.5 * e) !== 1.0) {
        e *= 0.5;
    }
    return e;
}


/**
 * Method to calculate the width and height of the smithchart.
 *
 * @param {Smithchart} smithchart - smithchart instance.
 * @returns {void}
 */
export function calculateSize(smithchart: Smithchart): void {
    const containerWidth: number = smithchart.element.clientWidth;
    const containerHeight: number = smithchart.element.clientHeight;

    smithchart.availableSize = new SmithchartSize(
        stringToNumber(smithchart.width, containerWidth) || containerWidth || 600,
        stringToNumber(smithchart.height, containerHeight) || containerHeight || 450

    );
}

/**
 * Method for template animation.
 *
 * @param {Smithchart} smithchart - smithchart
 * @param {Element} element - html element
 * @param {number} delay - animation delay
 * @param {number} duration - animation duration
 * @param {Effect} name - animation name
 * @returns {void}
 */
export function templateAnimate(smithchart: Smithchart, element: Element, delay: number, duration: number, name: Effect
): void {
    const opacity: number = 0;
    let delta: number;
    let value: number;
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
            const opacity: number = 1;
            args.element.style.opacity = opacity.toString();
            smithchart.trigger('animationComplete', event);
        }
    });
}

/**
 * Convert string to number.
 *
 * @param {string} value - string type value.
 * @param {number} containerSize - size of the container.
 * @returns {number} - returns converted number.
 * @private
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}


/**
 * Internal use of path options.
 *
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
 * Internal use of rectangle options.
 *
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
 * Internal use of circle options.
 *
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

/**
 * Method for calculate width and height of given string.
 *
 * @param {string} text - text value
 * @param {SmithchartFontModel} font - text font style
 * @param {SmithchartFontModel} themeFontStyle - theme font style
 * @returns {SmithchartSize} - size of the text
 */
export function measureText(text: string, font: SmithchartFontModel, themeFontStyle?: SmithchartFontModel): SmithchartSize {
    let htmlObject: HTMLElement = document.getElementById('smithchartmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'smithchartmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerText = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.left = '0';
    htmlObject.style.top = '-100';
    htmlObject.style.whiteSpace = 'nowrap';
    htmlObject.style.fontSize = font.size || themeFontStyle.size;
    htmlObject.style.fontWeight = font.fontWeight || themeFontStyle.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle || themeFontStyle.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily || themeFontStyle.fontFamily;
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new SmithchartSize(htmlObject.clientWidth, htmlObject.clientHeight);
}

/**
 * Internal use of text options
 *
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
 * Remove html element from DOM.
 *
 * @param {string} id - element id
 * @returns {void}
 */
export function removeElement(id: string): void {
    const element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}

/**
 * Animation Effect Calculation Started Here.
 *
 * @param {number} currentTime - current time
 * @param {number} startValue - start value of the animation
 * @param {number} endValue - end value of the animation
 * @param {number} duration - animation duration
 * @returns {number} - number
 * @private
 */
export function linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

/**
 * Reverse linear calculation.
 *
 * @param {number} currentTime - current time
 * @param {number} startValue - start value of the animation
 * @param {number} endValue - end value of the animation
 * @param {number} duration - animation duration
 * @returns {number} - number
 */
export function reverselinear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -startValue * Math.sin(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

/**
 * Get animation function name.
 *
 * @param {string} effect - animation effect name
 * @returns {Function} - animation function
 * @private
 */
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
 * Internal rendering of text.
 *
 * @param {TextOption} options - text element options.
 * @param {SmithchartFontModel} font - text font style.
 * @param {string} color - color of the text.
 * @param {HTMLElement | Element} parent - parent element of the text.
 * @param {SmithchartFontModel} themeFontStyle - theme font style.
 * @returns {Element} - text element.
 * @private
 */
export function renderTextElement(
    options: TextOption, font: SmithchartFontModel, color: string, parent: HTMLElement | Element, themeFontStyle?: SmithchartFontModel
): Element {
    const renderOptions: Object = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'font-size': font.size || themeFontStyle.size,
        'font-style': font.fontStyle || themeFontStyle.fontStyle,
        'font-family': font.fontFamily || themeFontStyle.fontFamily,
        'font-weight': font.fontWeight || themeFontStyle.fontWeight,
        'text-anchor': options.anchor,
        'opacity': font.opacity
    };
    const text: string = options.text;
    const renderer: SvgRenderer = new SvgRenderer('');
    const htmlObject: Element = renderer.createText(renderOptions, text);
    parent.appendChild(htmlObject);
    return htmlObject;
}
