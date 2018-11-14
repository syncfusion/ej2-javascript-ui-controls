import { SvgRenderer, compile as templateComplier, remove, merge, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { FontModel, BorderModel } from '../model/base-model';
import { AxisModel } from '../axes/axis-model';
import { IVisiblePointer } from '../model/interface';
import { Axis, Pointer, Range } from '../axes/axis';
import { Orientation, MarkerType } from './enum';
import { LinearGauge } from '../../linear-gauge';

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

/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('gauge-measuretext');
    let size: Size;
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    size = new Size(htmlObject.clientWidth, htmlObject.clientHeight);
    //remove(htmlObject);
    return size;
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
    let elementRect: ClientRect = parentElement.getBoundingClientRect();
    let pointerRect: ClientRect = pointerElement.getBoundingClientRect();
    let height: number = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.height / 2) :
        (!axis.isInversed) ? 0 : pointerRect.height;
    let width: number = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.width / 2) :
        (!axis.isInversed) ? pointerRect.width : 0;
    let size: Size = new Size(axis.lineBounds.width, axis.lineBounds.height);
    let y: number = (type === 'drag') ? (location.y - axis.lineBounds.y) :
        ((pointerRect.top + height) - elementRect.top - axis.lineBounds.y);
    let x: number = (type === 'drag') ? (location.x - axis.lineBounds.x) :
        ((pointerRect.left + width) - elementRect.left - axis.lineBounds.x);
    let newSize: number = (orientation === 'Vertical') ? size.height : size.width;
    let divideVal: number = (orientation === 'Vertical') ? y : x;
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
    let render: SvgRenderer = new SvgRenderer('id');
    let svg: SVGAElement = render.createSvg({ id: 'box_path', width: size.width, height: size.height }) as SVGAElement;
    svg.appendChild(path);
    tempDiv.appendChild(svg);
    let svgRect: Rect = path.getBBox();
    remove(tempDiv);
    return svgRect;
}

/** @private */
export function getElement(id: string): HTMLElement {
    return document.getElementById(id);
}

/** @private */
export function removeElement(id: string): void {
    let element: Element = getElement(id);
    if (element) {
        remove(element);
    }
}

/** @private */
export function isPointerDrag(axes: AxisModel[]): boolean {
    let pointerEnable: boolean = false;
    axes.map((axis: Axis, index: number) => {
        axis.pointers.map((pointer: Pointer, index: number) => {
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

export function textFormatter(format: string, data: object, gauge: LinearGauge): string {
    if (isNullOrUndefined(format)) {
        return null;
    }
    let keys: string[] = Object.keys(data);
    for (let key of keys) {
        format = format.split('${' + key + '}').join(formatValue(data[key], gauge).toString());
    }
    return format;
}

export function formatValue(value: number, gauge: LinearGauge): string | number {
    let formatValue: string | number; let formatFunction: Function;
    if (gauge.format && !isNaN(Number(value))) {
        formatFunction = gauge.intl.getNumberFormat(
            { format: gauge.format, useGrouping: gauge.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    } else {
        formatValue = value;
    }
    return formatValue ? formatValue : '';
}


/** @private */
export function getLabelFormat(format: string): string {
    let customLabelFormat: boolean = format && format.match('{value}') !== null;
    let skeleton: string = customLabelFormat ? '' : format;
    return skeleton;
}

/** @private */
export function getTemplateFunction(template: string): Function {
    let templateFn: Function = null;
    let e: Object;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }

    return templateFn;
}

/** @private */
export function getElementOffset(childElement: HTMLElement, parentElement: HTMLElement): Size {
    let width: number; let height: number;
    parentElement.appendChild(childElement);
    width = childElement.offsetWidth;
    height = childElement.offsetHeight;
    parentElement.removeChild(childElement);
    return new Size(width, height);
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

/** @private */
export class GaugeLocation {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Internal class size for height and width
 */
export class Size {
    /**
     * height of the size
     */
    public height: number;
    /**
     * width of the size
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
    constructor(
        id: string, fill: string, border: BorderModel, opacity: number, rect: Rect, transform?: string,
        dashArray?: string) {
        this.opacity = opacity;
        this.id = id;
        this.y = rect.y;
        this.x = rect.x;
        this.fill = fill;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
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
    public angle: number;
    constructor(text: string, value: number, size: Size) {
        this.text = text;
        this.value = value;
        this.size = size;
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
export function textElement(options: TextOption, font: FontModel, color: string, parent: HTMLElement | Element): Element {
    let renderOptions: Object = {};
    let htmlObject: Element;
    let renderer: SvgRenderer = new SvgRenderer('');
    let style: string = 'fill:' + color + '; font-size:' + font.size +
        '; font-style:' + font.fontStyle + ' ; font-weight:' + font.fontWeight + '; font-family:' +
        font.fontFamily + '; text-anchor:' + options.anchor + '; transform:' + options.transform +
        '; opacity:' + font.opacity + '; dominant-baseline:' + options.baseLine + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'style': style
    };
    htmlObject = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}

export function calculateNiceInterval(min: number, max: number, size: number, orientation: Orientation): number {
    let delta: number = max - min;
    let currentInterval: number;
    let intervalDivs: number[] = [10, 5, 2, 1];
    let desiredIntervalsCount: number = getActualDesiredIntervalsCount(size, orientation);
    let niceInterval: number = delta / desiredIntervalsCount;
    let minInterval: number = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
    for (let interval of intervalDivs) {
        currentInterval = minInterval * interval;
        if (desiredIntervalsCount < (delta / currentInterval)) {
            break;
        }
        niceInterval = currentInterval;
    }
    return niceInterval;
}

export function getActualDesiredIntervalsCount(size: number, orientation: Orientation): number {
    let maximumLabels: number = 5;
    let desiredIntervalsCount: number = (orientation === 'Horizontal' ? 0.533 : 1) * maximumLabels;
    desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
    return desiredIntervalsCount;
}

/** @private */
export function getPointer(target: HTMLElement, gauge: LinearGauge): IVisiblePointer {
    let split: string[] = [];
    let axisIndex: number; let radix: number = 10;
    let pointIndex: number;
    let axis: Axis;
    let pointer: Pointer;
    split = target.id.split('_');
    axisIndex = parseInt(split[2], radix);
    pointIndex = parseInt(split[4], radix);
    axis = <Axis>gauge.axes[axisIndex];
    pointer = <Pointer>gauge.axes[axisIndex].pointers[pointIndex];
    return { axis: axis, axisIndex: axisIndex, pointer: pointer, pointerIndex: pointIndex };
}

/** @private */
export function getRangeColor(value: number, ranges: Range[]): string {
    let rangeColor: string = null;
    ranges.forEach((range: Range, index: number) => {
        if (value >= range.start && range.end >= value) {
            rangeColor = range.interior;
        }
    });
    return rangeColor;
}

/** @private */
export function getRangePalette(): string[] {
    let palette: string[] = ['#ff5985', '#ffb133', '#fcde0b', '#27d5ff', '#50c917'];
    return palette;
}

/** @private */
export function calculateShapes(
    location: Rect, shape: MarkerType, size: Size,
    url: string, options: PathOption, orientation: Orientation, axis: Axis, pointer: Pointer): PathOption {
    let path: string;
    let width: number = size.width;
    let height: number = size.height;
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
export function getBox(
    location: Rect, boxName: string, orientation: Orientation,
    size: Size, type: string, containerWidth: number, axis: Axis, cornerRadius: number): string {
    let path: string = ' ';
    let radius: number = cornerRadius;
    let x1: number; let y1: number; let rectWidth: number; let rectHeight: number;
    let bottomRadius: number; let topRadius: number;
    switch (boxName) {
        case 'RoundedRectangle':
            x1 = location.x;
            y1 = location.y;
            rectWidth = location.width;
            rectHeight = location.height;
            path = 'M' + ' ' + x1 + ' ' + (radius + y1) + ' Q ' + x1 + ' ' + y1 + ' ' + (x1 + radius) + ' ' + y1 + ' ';
            path += 'L' + ' ' + (x1 + rectWidth - radius) + ' ' + y1 + ' Q ' + (x1 + rectWidth) + ' ' + y1 + ' '
                + (x1 + rectWidth) + ' ' + (y1 + radius) + ' ';
            path += 'L ' + (x1 + rectWidth) + ' ' + (y1 + rectHeight - radius) + ' Q ' + (x1 + rectWidth) + ' ' + (y1 + rectHeight)
                + ' ' + (x1 + rectWidth - radius) + ' ' + (y1 + rectHeight) + ' ';
            path += ' L ' + (x1 + radius) + ' ' + (y1 + rectHeight) + ' Q ' + x1 + ' ' + (y1 + rectHeight)
                + ' ' + x1 + ' ' + (y1 + rectHeight - radius) + ' ';
            path += 'L' + ' ' + x1 + ' ' + (radius + y1) + ' ' + 'z';
            break;
        case 'Thermometer':
            let width: number = (orientation === 'Vertical') ? location.width : location.height;
            bottomRadius = width + ((width / 2) / Math.PI);
            topRadius = width / 2;
            if (orientation === 'Vertical') {
                let addValue: number = ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius);
                let y1: number = (type === 'bar') ? location.y + addValue : location.y;
                let locY: number = (type === 'bar') ? location.y + (topRadius - (topRadius / Math.PI)) : location.y;
                let locHeight: number = location.height;
                path = 'M' + location.x + ' ' + (y1 + locHeight) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + (location.x + location.width) + ' ' + (y1 + locHeight) +
                    ' L ' + (location.x + location.width) + ' ' + locY +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' + location.x + ' ' + locY + ' z ';
            } else {
                let x1: number = (type === 'bar' && !axis.isInversed) ?
                    location.x - ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius) : location.x;
                let locWidth: number = (type === 'bar') ? (location.width - (topRadius - ((topRadius / Math.PI)))) : location.width;
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
