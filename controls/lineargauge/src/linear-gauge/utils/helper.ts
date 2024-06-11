/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
import { compile as templateComplier, remove, merge, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { FontModel, BorderModel } from '../model/base-model';
import { AxisModel } from '../axes/axis-model';
import { IVisiblePointer } from '../model/interface';
import { Axis, Pointer, Range } from '../axes/axis';
import { Orientation, MarkerType, LinearGaugeTheme } from './enum';
import { LinearGauge } from '../../linear-gauge';
import { ExportType } from '../utils/enum';

/**
 * Specifies Linear-Gauge Helper methods
 */

/** @private */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/** @private */
export function stringToNumberSize(value: string, containerSize: number): number {
    if (!isNullOrUndefined(value)) {
        return value.indexOf('%') !== -1 ? containerSize : parseInt(value, 10);
    }
    return null;
}

/**
 * Function to measure the height and width of the text.
 *
 * @param  {string} text - Specifies the text to be measured.
 * @param  {FontModel} font - Specifies the font of the text.
 * @returns {Size} Returns the size of the text.
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('gauge-measuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerText = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    const size: Size = new Size(htmlObject.clientWidth, htmlObject.clientHeight);
    //remove(htmlObject);
    return size;
}

/**
 * Trim the title text
 *
 * @private
 *
 */
export function textTrim(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        const textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth || label.length < 4) {
                if (label.length < 4) {
                    label = ' ';
                }
                return label;
            }
        }
    }
    return label;
}


/** @private */
export function withInRange(value: number, start: number, end: number, max: number, min: number, type: string): boolean {
    let withIn: boolean;
    if (type === 'pointer') {
        withIn = (((value <= max) && (value >= min)));
    } else {
        withIn = (start != null && (start <= max) && (start >= min)) && (end != null && (end <= max) && (end >= min));
    }
    return withIn;
}

export function convertPixelToValue(
    parentElement: HTMLElement, pointerElement: Element, orientation: Orientation, axis: Axis, type: string, location: GaugeLocation
): number {
    const elementRect: ClientRect = parentElement.getBoundingClientRect();
    const pointerRect: ClientRect = pointerElement.getBoundingClientRect();
    const height: number = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.height / 2) :
        (!axis.isInversed) ? 0 : pointerRect.height;
    const width: number = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.width / 2) :
        (!axis.isInversed) ? pointerRect.width : 0;
    const size: Size = new Size(axis.lineBounds.width, axis.lineBounds.height);
    const y: number = (type === 'drag') ? (location.y - axis.lineBounds.y) :
        ((pointerRect.top + height) - elementRect.top - axis.lineBounds.y);
    const extraWidth: number = getExtraWidth(parentElement);
    const x: number = (type === 'drag') ? (location.x - axis.lineBounds.x + extraWidth) :
        ((pointerRect.left + width) - elementRect.left - axis.lineBounds.x + extraWidth);
    const newSize: number = (orientation === 'Vertical') ? size.height : size.width;
    const divideVal: number = (orientation === 'Vertical') ? y : x;
    let value: number = (orientation === 'Vertical') ? (axis.isInversed) ? (divideVal / newSize) :
        (1 - (divideVal / newSize)) : (axis.isInversed) ? (1 - (divideVal / newSize)) : (divideVal / newSize);
    value = value * (axis.visibleRange.delta) + axis.visibleRange.min;
    return value;
}

export function getPathToRect(path: SVGPathElement, size: Size, parentElement: HTMLElement): Rect {
    let tempDiv: HTMLElement = <HTMLElement>document.getElementById('gauge_path');
    if (tempDiv === null) {
        tempDiv = createElement('text', { id: 'gauge_path' });
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0px';
        tempDiv.style.left = '0px';
        parentElement.appendChild(tempDiv);
    }
    const render: SvgRenderer = new SvgRenderer('id');
    const svg: SVGAElement = render.createSvg({ id: 'box_path', width: size.width, height: size.height }) as SVGAElement;
    svg.appendChild(path);
    tempDiv.appendChild(svg);
    const svgRect: Rect = path.getBBox();
    remove(tempDiv);
    return svgRect;
}

/** @private */
export function getElement(id: string): HTMLElement {
    return document.getElementById(id);
}

/** @private */
export function removeElement(id: string): void {
    const element: Element = getElement(id);
    if (element) {
        remove(element);
    }
}

/** @private */
export function isPointerDrag(axes: AxisModel[]): boolean {
    let pointerEnable: boolean = false;
    axes.map((axis: Axis) => {
        axis.pointers.map((pointer: Pointer) => {
            if (pointer.enableDrag) {
                pointerEnable = true;
            }
        });
    });
    return pointerEnable;
}

/** @private */
export function valueToCoefficient(value: number, axis: Axis, orientation: Orientation, range: VisibleRange): number {
    let result: number = (value - <number>range.min) / range.delta;
    result = (orientation === 'Vertical') ? (!axis.isInversed) ? (1 - result) : result : (!axis.isInversed) ? result : (1 - result);
    return result;
}

export function getFontStyle(font: FontModel): string {
    let style: string = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function textFormatter(format: string, data: any, gauge: LinearGauge): string {
    if (isNullOrUndefined(format)) {
        return null;
    }
    const keys: string[] = Object.keys(data);
    for (const key of keys) {
        format = format.split('{' + key + '}').join(formatValue(data[key as string], gauge).toString());
    }
    return format;
}

export function formatValue(value: number, gauge: LinearGauge): string | number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formatValue: string | number; let formatFunction: any;
    if (gauge.format && !isNaN(Number(value))) {
        formatFunction = gauge.intl.getNumberFormat(
            { format: gauge.format, useGrouping: gauge.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    } else {
        formatValue = value;
    }
    return formatValue !== null ? formatValue : '';
}


// /** @private */
// export function getLabelFormat(format: string): string {
//     const customLabelFormat: boolean = format && format.match('{value}') !== null;
//     const skeleton: string = customLabelFormat ? '' : format;
//     return skeleton;
// }

/** @private */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTemplateFunction(template: string | Function, gauge: LinearGauge): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let templateFn: any = null;
    try {
        if (typeof template === 'function') {
            templateFn = templateComplier(template);
        } else if (document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((gauge as any).isVue || (gauge as any).isVue3) {
            templateFn = templateComplier(template);
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }

    return templateFn;
}

/** @private */
export function getElementOffset(childElement: HTMLElement, parentElement: HTMLElement): Size {
    parentElement.appendChild(childElement);
    const width: number = childElement.offsetWidth;
    const height: number = childElement.offsetHeight;
    parentElement.removeChild(childElement);
    return new Size(width, height);
}

/**
 * To trigger the download element
 *
 * @param {string} fileName - Specifies the name of the exported file.
 * @param {ExportType} type - Specifies the extension type of the file to which the Linear Gauge must be exported.
 * @param {string} url - Specifies the blob URL of the exported file of Linear Gauge.
 * @param {boolean} isDownload - Specifies whether the exported file must be downloaded or not.
 * @private
 */
export function triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void {
    createElement('a', {
        attrs: {
            'download': fileName + '.' + (type as string).toLocaleLowerCase(),
            'href': url
        }
    }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
        view: window,
        bubbles: false,
        cancelable: true
    }));
}

/** @private */
export class VisibleRange {
    public min?: number;
    public max?: number;
    public interval?: number;
    public delta?: number;
    constructor(min: number, max: number, interval: number, delta: number) {
        this.min = min;
        this.max = max;
        this.interval = interval;
        this.delta = delta;
    }
}

/**
 * Specifies the location of the element in the linear gauge.
 */
export class GaugeLocation {
    /**
     * Specifies the x position of the location in pixels.
     */
    public x: number;
    /**
     * Specifies the y position of the location in pixels.
     */
    public y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Specifies the size information of an element.
 */
export class Size {
    /**
     * Specifies the height of an element.
     */
    public height: number;
    /**
     * Specifies the width of an element.
     */
    public width: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

/** @private */
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

/** @private */
export class CustomizeOption {
    public id: string;
    constructor(id?: string) {
        this.id = id;
    }
}

/** @private */
export class PathOption extends CustomizeOption {
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;
    public transform: string;
    public cx: number;
    public cy: number;
    public r: number;
    constructor(
        id: string, fill: string, width: number, color: string,
        opacity?: number, dashArray?: string, d?: string, transform: string = '') {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
        this.transform = transform;
    }
}


/** @private */
export class RectOption {
    public x: number;
    public y: number;
    public id: string;
    public height: number;
    public width: number;
    public rx: number;
    public ry: number;
    public opacity: number;
    public transform: string;
    public stroke: string;
    public fill: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    constructor(
        id: string, fill: string, border: BorderModel, opacity: number, rect: Rect) {
        this.opacity = opacity;
        this.id = id;
        this.y = rect.y;
        this.x = rect.x;
        this.fill = fill;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
        this['stroke-dasharray'] = border.dashArray;
        this.height = rect.height;
        this.width = rect.width;
    }
}

/** @private */
export class TextOption extends CustomizeOption {
    public anchor: string;
    public text: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public baseLine: string = 'auto';
    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string, transform: string = '', baseLine?: string) {
        super(id);
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
}

/** @private */
export class VisibleLabels {
    public text: string;
    public value: number;
    public size: Size;
    public x?: number;
    public y?: number;
    public angle: number;
    constructor(text: string, value: number, size: Size, x?: number, y?: number) {
        this.text = text;
        this.value = value;
        this.size = size;
        this.x = x;
        this.y = y;
    }
}

/** @private */
export class Align {
    public axisIndex: number;
    public align: string;
    constructor(axisIndex: number, align: string) {
        this.align = align;
        this.axisIndex = axisIndex;
    }
}

/** @private */
export function textElement(options: TextOption, font: FontModel, color: string, opacity: number, parent: HTMLElement | Element): Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderOptions: any = {};
    const renderer: SvgRenderer = new SvgRenderer('');
    if (!isNullOrUndefined(options.id)) {
        removeElement(options.id);
    }
    const style: string = 'fill:' + color + '; font-size:' + font.size +
        '; font-style:' + font.fontStyle + ' ; font-weight:' + font.fontWeight + '; font-family:' +
        font.fontFamily + '; text-anchor:' + options.anchor + '; transform:' + options.transform +
        '; opacity:' + (!isNullOrUndefined(opacity) ? opacity : font.opacity) + '; dominant-baseline:' + options.baseLine + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'style': style
    };
    const htmlObject: Element = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}

export function calculateNiceInterval(min: number, max: number, size: number, orientation: Orientation): number {
    const delta: number = max - min;
    let currentInterval: number;
    const intervalDivs: number[] = [10, 5, 2, 1];
    const desiredIntervalsCount: number = getActualDesiredIntervalsCount(size, orientation);
    let niceInterval: number = delta / desiredIntervalsCount;
    const minInterval: number = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
    for (const interval of intervalDivs) {
        currentInterval = minInterval * interval;
        if (desiredIntervalsCount < (delta / currentInterval)) {
            break;
        }
        niceInterval = currentInterval;
    }
    return niceInterval;
}

export function getActualDesiredIntervalsCount(size: number, orientation: Orientation): number {
    const maximumLabels: number = 5;
    let desiredIntervalsCount: number = (orientation === 'Horizontal' ? 0.533 : 1) * maximumLabels;
    desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
    return desiredIntervalsCount;
}

/** @private */
export function getPointer(target: HTMLElement, gauge: LinearGauge): IVisiblePointer {
    let split: string[] = [];
    const radix: number = 10;
    split = target.id.replace(gauge.element.id, '').split('_');
    const axisIndex: number = parseInt(split[2], radix);
    const pointIndex: number = parseInt(split[4], radix);
    const axis: Axis = <Axis>gauge.axes[axisIndex as number];
    const pointer: Pointer = <Pointer>gauge.axes[axisIndex as number].pointers[pointIndex as number];
    return { axis: axis, axisIndex: axisIndex, pointer: pointer, pointerIndex: pointIndex };
}

/** @private */
export function getRangeColor(value: number, ranges: Range[]): string {
    let rangeColor: string = null;
    ranges.forEach((range: Range) => {
        if ((value >= range.start && range.end >= value) && range.start !== range.end) {
            rangeColor = range.interior;
        }
    });
    return rangeColor;
}

/**
 * Function to get the mouse position
 *
 * @param {number} pageX - Specifies the horizontal position of the click event.
 * @param {number} pageY - Specifies the vertical position of the click event.
 * @param {number} element - Specifies the target element of the client event.
 * @private
 */
export function getMousePosition(pageX: number, pageY: number, element: Element): GaugeLocation {
    const elementRect: ClientRect = element.getBoundingClientRect();
    const pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
    const pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
    const clientTop: number = element.ownerDocument.documentElement.clientTop;
    const clientLeft: number = element.ownerDocument.documentElement.clientLeft;
    const positionX: number = elementRect.left + pageXOffset - clientLeft;
    const positionY: number = elementRect.top + pageYOffset - clientTop;
    return new GaugeLocation((pageX - positionX), (pageY - positionY));
}

/** @private */
export function getRangePalette(theme: LinearGaugeTheme): string[] {
    let palette: string[];
    switch (theme.toLowerCase()) {
    case 'tailwind':
        palette = ['#0369A1', '#14B8A6', '#15803D', '#334155', '#5A61F6',
            '#65A30D', '#8B5CF6', '#9333EA', '#F59E0B', '#F97316'];
        break;
    case 'tailwinddark':
        palette = ['#10B981', '#22D3EE', '#2DD4BF', '#4ADE80', '#8B5CF6',
            '#E879F9', '#F472B6', '#F87171', '#F97316', '#FCD34D'];
        break;
    case 'bootstrap5':
        palette = ['#262E0B', '#668E1F', '#AF6E10', '#862C0B', '#1F2D50',
            '#64680B', '#311508', '#4C4C81', '#0C7DA0', '#862C0B'];
        break;
    case 'bootstrap5dark':
        palette = ['#5ECB9B', '#A860F1', '#EBA844', '#557EF7', '#E9599B',
            '#BFC529', '#3BC6CF', '#7A68EC', '#74B706', '#EA6266'];
        break;
    case 'fluent':
        palette = ['#614570', '#4C6FB1', '#CC6952', '#3F579A', '#4EA09B',
            '#6E7A89', '#D4515C', '#E6AF5D', '#639751', '#9D4D69'];
        break;
    case 'fluentdark':
        palette = ['#8AB113', '#2A72D5', '#43B786', '#584EC6', '#E85F9C',
            '#6E7A89', '#EA6266', '#EBA844', '#26BC7A', '#BC4870'];
        break;
    case 'material3':
        palette = ['#6200EE', '#E77A16', '#82C100', '#7107DC', '#05BB3D',
            '#D21020', '#FAD200', '#0085FF', '#9204EA', '#08EE9B'];
        break;
    case 'material3dark':
        palette = ['#4EAAFF', '#FA4EAB', '#FFF500', '#17EA58', '#38FFE7',
            '#FF9E45', '#B3F32F', '#B93CE4', '#FC5664', '#9B55FF'];
        break;
    case 'fluent2':
        palette = ['#6200EE', '#09AF74', '#0076E5', '#CB3587', '#E7910F', '#0364DE', 
            '#66CD15', '#F3A93C', '#107C10', '#C19C00'];
        break;
    case 'fluent2dark':
    case 'fluent2highcontrast':
        palette = ['#9BB449', '#2A72D5', '#43B786', '#3F579A', '#584EC6', '#E85F9C', 
            '#6E7A89', '#EA6266', '#0B6A0B', '#C19C00'];
        break;
    default:
        palette = ['#ff5985', '#ffb133', '#fcde0b', '#27d5ff', '#50c917'];
        break;
    }
    return palette;
}

/** @private */
export function calculateShapes(
    location: Rect, shape: MarkerType, size: Size,
    url: string, options: PathOption, orientation: Orientation, axis: Axis, pointer: Pointer): PathOption {
    let path: string;
    const width: number = size.width;
    const height: number = size.height;
    let locX: number = location.x;
    let locY: number = location.y;
    let radius: number;
    switch (shape) {
    case 'Circle':
        radius = ((width + height) / 4);
        locX = (orientation === 'Vertical') ? (!axis.opposedPosition) ? (pointer.placement !== 'Far') ? locX - radius : locX + radius :
            pointer.placement === 'Near' ? locX - radius : locX + radius : locX;
        locY = (orientation === 'Vertical') ? locY : (!axis.opposedPosition) ? (pointer.placement === 'Far') ?
            locY + radius : locY - radius : (pointer.placement === 'Near') ? locY - radius : locY + radius;
        merge(options, { 'r': radius, 'cx': locX, 'cy': locY });
        break;
    case 'Diamond':
    case 'Rectangle':
        locX = (orientation === 'Horizontal') ? ((locX - (width / 2))) : ((!axis.opposedPosition && pointer.placement !== 'Far') ||
                (axis.opposedPosition && pointer.placement === 'Near')) ? locX - width : locX;
        locY = (orientation === 'Vertical') ? locY : (!axis.opposedPosition) ?
            (pointer.placement === 'Far') ? locY + (height / 2) : locY - (height / 2) :
            (pointer.placement === 'Near') ? locY - (height / 2) : locY + (height / 2);
        if (shape === 'Diamond') {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ' ' + (locX + width) + ' ' + locY + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + locX + ' ' + locY + ' z';
        } else {
            path = 'M' + ' ' + locX + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ' ' + (locX + width) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ' ' + (locX + width) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + locX + ' ' + (locY - (height / 2)) + ' z';
        }
        merge(options, { 'd': path });
        break;
    case 'Triangle':
        if (orientation === 'Vertical') {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX - width) + ' ' + (locY - (height / 2)) +
                    'L' + (locX - width) + ' ' + (locY + (height / 2)) + ' Z';
        } else {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + (locY - height) +
                    'L' + (locX - (width / 2)) + ' ' + (locY - height) + ' Z';
        }
        merge(options, { 'd': path });
        break;
    case 'InvertedTriangle':
        if (orientation === 'Vertical') {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX + width) + ' ' + (locY - (height / 2)) +
                    'L' + (locX + width) + ' ' + (locY + (height / 2)) + ' Z';
        } else {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + (locY + height) +
                    'L' + (locX - (width / 2)) + ' ' + (locY + height) + ' Z';
        }
        merge(options, { 'd': path });
        break;
    case 'Arrow':
        if (orientation === 'Vertical') {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + (locX - (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + (locX - (width / 2)) + ' ' + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX - width) + ' '
                    + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX - width) + ' ' + ((locY + (height / 2)) -
                        (height / 4)) + ' ' + 'L' + (locX - (width / 2)) + ' ' + ((locY + (height / 2)) - (height / 4)) + ' ' +
                    'L' + (locX - (width / 2)) + ' ' + (locY + height / 2) + 'z';
        } else {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ((locX + (width / 2)) - (width / 4)) + ' ' + (locY - (height / 2)) + ' ' + 'L' + ((locX + (width / 2)) -
                        (width / 4)) + ' ' + (locY - height) + ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY - height) +
                    ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY - (height / 2)) + ' ' + 'L' + (locX - (width / 2))
                    + ' ' + (locY - (height / 2)) + 'z';
        }
        merge(options, { 'd': path });
        break;
    case 'InvertedArrow':
        if (orientation === 'Vertical') {
            path = 'M' + ' ' + locX + ' ' + locY + 'L' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX + width) + ' '
                    + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX + width) + ' ' + ((locY + (height / 2)) - (height / 4))
                    + ' ' + 'L' + (locX + (width / 2)) + ' ' + ((locY + (height / 2)) - (height / 4)) + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + (locY + height / 2) + 'z';
        } else {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ((locX + (width / 2)) - (width / 4)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ((locX + (width / 2)) -
                        (width / 4)) + ' ' + (locY + height) + ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY + height)
                    + ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + (locX - (width / 2)) + ' ' + (locY + (height / 2)) + 'z';
        }
        merge(options, { 'd': path });
        break;
    case 'Image':
        merge(options, { 'href': url, 'height': height, 'width': width, x: locX - (width / 2), y: locY - (height / 2) });
        break;
    }
    return options;
}

/** @private */
export function calculateTextPosition(
    location: Rect, shape: MarkerType,
    options: TextOption, orientation: Orientation, axis: Axis, pointer: Pointer): TextOption {
    let width: number;
    let height: number;
    let textSize : Size;
    let locX: number = location.x;
    let locY: number = location.y;
    switch (shape) {
    case 'Text':
        textSize = measureText(pointer.text, pointer.textStyle);
        height = textSize.height;
        width = textSize.width;
        locX = (orientation === 'Horizontal') ? ((locX - (width / 2))) : ((!axis.opposedPosition && pointer.placement !== 'Far') ||
            (axis.opposedPosition && pointer.placement === 'Near')) ? (pointer.position === 'Inside' && !axis.opposedPosition) ||
            (pointer.position === 'Cross') || (axis.opposedPosition && pointer.placement === 'Near' && pointer.position === 'Outside') ? locX - (width / 2) : locX - width : (pointer.position === 'Cross' && pointer.placement === 'Far') ||
            (axis.opposedPosition && pointer.position === 'Cross' && (pointer.placement === 'None' || pointer.placement === 'Center')) ? locX + (width / 2) : locX;
        locY = (orientation === 'Vertical') ? locY + (height / 4) : (!axis.opposedPosition) ?
            (pointer.placement === 'Far') ? pointer.position === 'Cross' ? locY + (height / 2) + (height / 4) : pointer.position === 'Inside' ? locY + height : locY + (height / 2) : locY :
            (pointer.placement === 'Near') ? locY : pointer.position === 'Cross' ? locY + (height / 2) + (height / 4) : pointer.position === 'Outside' ? locY + height : locY + (height / 2);
        merge(options, { x: locX, y: locY });
        break;
    }
    return options;
}

/** @private */
export function getBox(
    location: Rect, boxName: string, orientation: Orientation,
    size: Size, type: string, containerWidth: number, axis: Axis, cornerRadius: number): string {
    let path: string = ' ';
    let radius: number = cornerRadius; let horizontalRadius: number;
    let x1: number; let y1: number; let rectWidth: number; let rectHeight: number; let verticalRadius: number;
    let bottomRadius: number; let topRadius: number; let horizontalCurve: number; let verticalCurve: number;
    switch (boxName) {
    case 'RoundedRectangle':
        x1 = location.x;
        y1 = location.y;
        rectWidth = location.width;
        rectHeight = location.height;
        if (((orientation === 'Vertical' && location.height === 0) || (orientation === 'Horizontal' && location.width === 0)) && radius > 10){
            radius = 10;
        }
        horizontalCurve = x1 + rectWidth - radius;
        verticalCurve = y1 + rectHeight - radius;
        verticalRadius = radius + y1;
        horizontalRadius = radius + x1;
        if (type === 'container' || type === 'bar' && ((orientation === 'Vertical' && location.height !== 0) || (orientation === 'Horizontal' && location.width !== 0))) {
            if (horizontalRadius > (x1 + (rectWidth / 2))){
                horizontalRadius = x1 + (rectWidth / 2);
                horizontalCurve = horizontalRadius;
            }
            if (verticalRadius > (y1 + (rectHeight / 2))) {
                verticalRadius = y1 + (rectHeight / 2);
                verticalCurve = verticalRadius;
            }
        }
        if (type === 'bar' && ((orientation === 'Vertical' && location.height === 0) || (orientation === 'Horizontal' && location.width === 0))) {
            if (location.width < radius / 2 && !axis.isInversed) {
                horizontalCurve = horizontalCurve + radius + radius / 2;
            } else if (location.width < radius / 2 && axis.isInversed) {
                horizontalRadius = x1 - Math.ceil(radius / 4);
            }
            if (location.height < radius / 2 && !axis.isInversed) {
                verticalRadius = y1 - Math.ceil(radius / 4);
            } else if (location.height < radius / 2 && axis.isInversed) {
                verticalCurve = verticalCurve + radius + radius / 2;
            }
        }
        path = 'M' + ' ' + x1 + ' ' + verticalRadius + ' Q ' + x1 + ' ' + y1 + ' ' + horizontalRadius + ' ' + y1 + ' ';
        path += 'L' + ' ' + horizontalCurve + ' ' + y1 + ' Q ' + (x1 + rectWidth) + ' ' + y1 + ' '
                + (x1 + rectWidth) + ' ' + verticalRadius + ' ';
        path += 'L ' + (x1 + rectWidth) + ' ' + verticalCurve + ' Q ' + (x1 + rectWidth) + ' ' + (y1 + rectHeight)
                + ' ' + horizontalCurve + ' ' + (y1 + rectHeight) + ' ';
        path += ' L ' + horizontalRadius + ' ' + (y1 + rectHeight) + ' Q ' + x1 + ' ' + (y1 + rectHeight)
                + ' ' + x1 + ' ' + verticalCurve + ' ';
        path += 'L' + ' ' + x1 + ' ' + verticalRadius + ' ' + 'z';
        break;
    case 'Thermometer':
        // eslint-disable-next-line no-case-declarations
        const width: number = (orientation === 'Vertical') ? location.width : location.height;
        bottomRadius = width + ((width / 2) / Math.PI);
        topRadius = width / 2;
        if (orientation === 'Vertical') {
            const addValue: number = ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius);
            const y1: number = (type === 'bar') ? location.y + addValue : location.y;
            const locY: number = (type === 'bar') ? location.y + (topRadius - (topRadius / Math.PI)) : location.y;
            const locHeight: number = location.height;
            path = 'M' + location.x + ' ' + (y1 + locHeight) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + (location.x + location.width) + ' ' + (y1 + locHeight) +
                    ' L ' + (location.x + location.width) + ' ' + locY +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' + location.x + ' ' + locY + ' z ';
        } else {
            const x1: number = (type === 'bar' && !axis.isInversed) ?
                location.x - ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius) : location.x;
            const locWidth: number = (type === 'bar') ? (location.width - (topRadius - ((topRadius / Math.PI)))) : location.width;
            path = 'M' + x1 + ' ' + (location.y) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + x1 + ' ' + (location.y + location.height) +
                    ' L ' + ((type === 'bar' ? location.x : x1) + locWidth) + ' ' + (location.y + location.height) +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' +
                    ((type === 'bar' ? location.x : x1) + locWidth) + ' ' + (location.y) + ' z ';
        }
        break;
    }
    return path;
}

/** @private */
export function getExtraWidth(gaugeElement: HTMLElement): number {
    const svgElement: HTMLElement = getElement(gaugeElement.id + '_svg');
    let extraWidth: number = 0;
    if (!isNullOrUndefined(svgElement) && !isNullOrUndefined(gaugeElement)) {
        extraWidth = gaugeElement.getBoundingClientRect().left - svgElement.getBoundingClientRect().left;
    }
    return extraWidth;
}

/**
 * @param {string} text - Specifies the text.
 * @returns {void}
 * @private */
export function showTooltip(text: string, gauge: LinearGauge): void {
    let tooltip: HTMLElement = getElement(gauge.element.id + '_EJ2_Title_Tooltip');
    if (!tooltip) {
        let titleWidth: number = measureText(text, { size: '12px', fontFamily: 'Segoe UI' }).width + 10;
        titleWidth = titleWidth < gauge.actualRect.width ? titleWidth : gauge.actualRect.width - 10;
        tooltip = createElement('div', { id: gauge.element.id + '_EJ2_Title_Tooltip', className: 'EJ2-LinearGauge-Tooltip' });
        tooltip.innerText = text;
        tooltip.style.cssText = 'top:' + (gauge.actualRect.y + 10).toString() + 'px; left:' + (gauge.actualRect.x).toString() +
        'px; background-color:rgb(255, 255, 255) !important; color:black !important; ' +
        'position:absolute; border:1px solid rgb(112, 112, 112); padding-left:3px; padding-right:2px;' +
        'padding-bottom:2px; padding-top:2px; font-size:12px; font-family:"Segoe UI";' + 'width:' + (titleWidth) + 'px;';
        document.body.style.overflow = 'hidden';
        getElement(gauge.element.id + '_Secondary_Element').appendChild(tooltip);
    } else {
        tooltip.innerText = text;
        tooltip.style.top = (gauge.actualRect.y + 10).toString() + 'px';
        tooltip.style.left = (gauge.actualRect.x).toString() + 'px';
    }
}

/** @private */
export function removeTooltip(): void {
    if (document.getElementsByClassName('EJ2-LinearGauge-Tooltip').length > 0) {
        document.getElementsByClassName('EJ2-LinearGauge-Tooltip')[0].remove();
    }
}
