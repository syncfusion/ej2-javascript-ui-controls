/**
 * Specifies Circular-Gauge Helper methods
 */
import { SvgRenderer, compile as templateComplier } from '@syncfusion/ej2-base';
import { CircularGauge } from '../circular-gauge';
import { FontModel, BorderModel } from '../model/base-model';
import { Range } from '../axes/axis';
import { IVisiblePointer } from '../model/interface';
import { merge } from '@syncfusion/ej2-base';
import { createElement, remove, setStyleAttribute } from '@syncfusion/ej2-base';

/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns Size
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('gauge-measuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    let style: string = 'position: absolute; visibility: hidden;' +
        ';left: 0; top: -100; white-space: nowrap;' + getFontStyle(font);
    htmlObject.innerHTML = text;
    htmlObject.setAttribute('style', style);
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}

/**
 * Function to find number from string
 * * @returns number
 * @private
 */
export function toPixel(value: string, maxDimension: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (maxDimension / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/**
 * Function to get the style from FontModel.
 * @returns string
 * @private
 */
export function getFontStyle(font: FontModel): string {
    let style: string = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}

/**
 * Function to set style to the element.
 * @private
 */
export function setStyles(element: HTMLElement, fill: string, border: BorderModel): void {
    setStyleAttribute(element, {
        'stroke': border.color, 'stroke-width': border.width,
        'fill': fill
    });
}

/**
 * Function to measure the element rect.
 * @returns ClientRect
 * @private
 */
export function measureElementRect(element: HTMLElement): ClientRect {
    let bounds: ClientRect;
    document.body.appendChild(element);
    bounds = element.getBoundingClientRect();
    removeElement(element.id);
    return bounds;
}

/**
 * Function to convert the number from string.
 * @returns number
 * @private
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/**
 * Function to create the text element.
 * @returns Element
 * @private
 */
export function textElement(options: TextOption, font: FontModel, color: string, parent: HTMLElement | Element, styles?: string): Element {
    let renderOptions: Object = {};
    let htmlObject: Element;
    let renderer: SvgRenderer = new SvgRenderer('');
    let style: string = styles + ' font-size:' + font.size + '; font-style:' + font.fontStyle +
        ' ; font-weight:' + font.fontWeight + '; font-family:' + font.fontFamily + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine,
        'style': style
    };
    htmlObject = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}

/**
 * Function to append the path to the element.
 * @returns Element
 * @private
 */
export function appendPath(options: PathOption, element: Element, gauge: CircularGauge, functionName?: string): Element {
    functionName = functionName ? functionName : 'Path';
    let htmlObject: HTMLElement = gauge.renderer['draw' + functionName](options) as HTMLElement;
    htmlObject.setAttribute('transform', options.transform);
    htmlObject.setAttribute('style', options.style);
    element.appendChild(htmlObject);
    return htmlObject;
}

/**
 * Function to calculate the sum of array values.
 * @returns number
 * @private
 */
export function calculateSum(from: number, to: number, values: number[]): number {
    let sum: number = 0;
    let length: number = values.length;
    for (; from < length; from++) {
        sum += values[from];
    }
    return sum;
}

/**
 * Function to calculate the value for linear animation effect
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */
export function linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

/**
 * Function to get the angle from value for circular gauge.
 * @returns number
 * @private
 */
export function getAngleFromValue(
    value: number, maximumValue: number, minimumValue: number, startAngle: number, endAngle: number, isClockWise: boolean
): number {
    let angle: number;
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    startAngle -= 90; endAngle -= 90;
    if (isClockWise) {
        angle = ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue))) + startAngle;
    } else {
        angle = endAngle - ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue)));
        angle = angle < 0 ? 360 + angle : angle;
    }
    angle = Math.round(angle) >= 360 ? (angle - 360) : Math.round(angle) < 0 ? (360 + angle) : angle;
    return angle;
}

/**
 * Function to get the degree for circular gauge.
 * @returns number
 * @private
 */
export function getDegree(startAngle: number, endAngle: number): number {
    let degree: number = endAngle - startAngle;
    return degree < 0 ? (degree + 360) : degree;
}

/**
 * Function to get the value from angle for circular gauge.
 * @returns number
 * @private
 */
export function getValueFromAngle(
    angle: number, maximumValue: number, minimumValue: number, startAngle: number, endAngle: number, isClockWise: boolean
): number {
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    angle = angle < startAngle ? (angle + 360) : angle;
    if (isClockWise) {
        return (((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue;
    } else {
        return maximumValue - ((((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue);
    }
}

/**
 * Function to check whether it's a complete circle for circular gauge.
 * @returns boolean
 * @private
 */
export function isCompleteAngle(startAngle: number, endAngle: number): boolean {
    let totalAngle: number = endAngle - startAngle;
    totalAngle = totalAngle <= 0 ? (totalAngle + 360) : totalAngle;
    return Math.floor(totalAngle / 360) !== 0;
}

/**
 * Function to get angle from location for circular gauge.
 * @returns number
 * @private
 */
export function getAngleFromLocation(center: GaugeLocation, point: GaugeLocation): number {
    let angle: number = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = Math.round((angle < 0 ? (6.283 + angle) : angle) * (180 / Math.PI)) - 270;
    angle += angle < 0 ? 360 : 0;
    return angle;
}

/**
 * Function to get the location from angle for circular gauge.
 * @returns GaugeLocation
 * @private
 */
export function getLocationFromAngle(degree: number, radius: number, center: GaugeLocation): GaugeLocation {
    let radian: number = (degree * Math.PI) / 180;
    return new GaugeLocation(
        Math.cos(radian) * radius + center.x,
        Math.sin(radian) * radius + center.y
    );
}

/**
 * Function to get the path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getPathArc(
    center: GaugeLocation, start: number, end: number, radius: number,
    startWidth?: number, endWidth?: number
): string {
    end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    let degree: number = getDegree(start, end);
    let startRadius: number = radius - startWidth;
    let endRadius: number = radius - endWidth;
    let arcRadius: number = radius - ((startWidth + endWidth) / 2);
    if (startWidth !== undefined && endWidth !== undefined) {
        return getRangePath(
            getLocationFromAngle(start, radius, center),
            getLocationFromAngle(end, radius, center),
            getLocationFromAngle(start, startRadius, center),
            getLocationFromAngle(end, endRadius, center),
            radius, arcRadius, arcRadius,
            (degree < 180) ? 0 : 1
        );
    } else {
        return getCirclePath(
            getLocationFromAngle(start, radius, center),
            getLocationFromAngle(end, radius, center), radius, (degree < 180) ? 0 : 1
        );
    }
}

/**
 * Function to get the range path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getRangePath(
    start: GaugeLocation, end: GaugeLocation,
    innerStart: GaugeLocation, innerEnd: GaugeLocation,
    radius: number, startRadius: number, endRadius: number, clockWise: number
): string {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' L ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
}

/**
 * Function to get the rounded path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getRoundedPathArc(
    center: GaugeLocation, actualStart: number, actualEnd: number, oldStart: number, oldEnd: number,
    radius: number, startWidth?: number, endWidth?: number
): string {
    actualEnd -= isCompleteAngle(actualStart, actualEnd) ? 0.0001 : 0;
    let degree: number = getDegree(actualStart, actualEnd);
    let startRadius: number = radius - startWidth;
    let endRadius: number = radius - endWidth;
    let arcRadius: number = radius - ((startWidth + endWidth) / 2);
    return getRoundedPath(
        getLocationFromAngle(actualStart, radius, center),
        getLocationFromAngle(actualEnd, radius, center),
        getLocationFromAngle(oldEnd, radius, center),
        getLocationFromAngle(oldEnd, endRadius, center),
        getLocationFromAngle(oldStart, radius, center),
        getLocationFromAngle(oldStart, startRadius, center),
        getLocationFromAngle(actualStart, startRadius, center),
        getLocationFromAngle(actualEnd, endRadius, center),
        radius, arcRadius, arcRadius,
        (degree < 180) ? 0 : 1
    );
}

/**
 * Function to get the rounded range path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getRoundedPath(
    start: GaugeLocation, end: GaugeLocation, outerOldEnd: GaugeLocation,
    innerOldEnd: GaugeLocation, outerOldStart: GaugeLocation, innerOldStart: GaugeLocation,
    innerStart: GaugeLocation, innerEnd: GaugeLocation,
    radius: number, startRadius: number, endRadius: number, clockWise: number
): string {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' C ' + outerOldEnd.x + ' ' + outerOldEnd.y + ' ' + innerOldEnd.x + ' ' +
        innerOldEnd.y + ' ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y +
        ' C ' + innerOldStart.x + ' ' + innerOldStart.y + ' ' + outerOldStart.x + ' ' +
        outerOldStart.y + ' ' + start.x + ' ' + start.y + ' Z';
}

/**
 * Function to calculate the complete path arc of the circular gauge.
 * @returns string
 * @private
 */
export function getCompleteArc(center: GaugeLocation, start: number, end: number, radius: number, innerRadius: number): string {
    end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    let degree: number = getDegree(start, end);
    return getCompletePath(
        center, getLocationFromAngle(start, radius, center),
        getLocationFromAngle(end, radius, center), radius,
        getLocationFromAngle(start, innerRadius, center),
        getLocationFromAngle(end, innerRadius, center), innerRadius,
        (degree < 180) ? 0 : 1
    );
}

/**
 * Function to get the circular path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getCirclePath(start: GaugeLocation, end: GaugeLocation, radius: number, clockWise: number): string {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
        radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y;
}

/**
 * Function to get the complete path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getCompletePath(
    center: GaugeLocation, start: GaugeLocation, end: GaugeLocation, radius: number,
    innerStart: GaugeLocation, innerEnd: GaugeLocation, innerRadius: number, clockWise: number
): string {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
        ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
        ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
}

/**
 * Function to get element from id.
 * @returns Element
 * @private
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}

/**
 * Function to compile the template function for circular gauge.
 * @returns Function
 * @private
 */
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

export function getElementSize(template: string, gauge: CircularGauge, parent: HTMLElement): Size {
    let elementSize: Size; let element: HTMLElement;
    let templateFn: Function = getTemplateFunction(template);
    if (templateFn && templateFn(gauge).length) {
        element = gauge.createElement('div', { id: gauge.element.id + '_Measure_Element' });
        gauge.element.appendChild(element);
        let templateElement: HTMLCollection = templateFn(gauge);
        while (templateElement.length > 0) {
            element.appendChild(templateElement[0]);
        }
        parent.appendChild(element);
        elementSize = new Size(parent.getBoundingClientRect().width, parent.getBoundingClientRect().height);
        remove(element);
    }
    return elementSize;
}

/**
 * Function to remove the element from id.
 * @private
 */
export function removeElement(id: string): void {
    let element: Element = getElement(id);
    if (element) {
        remove(element);
    }
}

/**
 * Function to get current point for circular gauge using element id.
 * @returns IVisiblePointer
 * @private
 */
export function getPointer(targetId: string, gauge: CircularGauge): IVisiblePointer {
    let tempString: string;
    tempString = targetId.split(gauge.element.id + '_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        pointerIndex: +tempString[tempString.length - 1]
    };
}


/**
 * Function to get the mouse position
 * @param pageX 
 * @param pageY 
 * @param element 
 */
export function getMousePosition(pageX: number, pageY: number, element: Element): GaugeLocation {
    let elementRect: ClientRect = element.getBoundingClientRect();
    let pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
    let pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
    let clientTop: number = element.ownerDocument.documentElement.clientTop;
    let clientLeft: number = element.ownerDocument.documentElement.clientLeft;
    let positionX: number = elementRect.left + pageXOffset - clientLeft;
    let positionY: number = elementRect.top + pageYOffset - clientTop;
    return new GaugeLocation((pageX - positionX), (pageY - positionY));
}


/**
 * Function to convert the label using formar for cirular gauge.
 * @returns string
 * @private
 */
export function getLabelFormat(format: string): string {
    let customLabelFormat: boolean = format && format.match('{value}') !== null;
    let skeleton: string = customLabelFormat ? '' : format;
    return skeleton;
}

/**
 * Function to calculate the marker shape for circular gauge.
 * @returns PathOption
 * @private
 */
export function calculateShapes(location: GaugeLocation, shape: string, size: Size, url: string, options: PathOption): PathOption {
    let path: string;
    let width: number = size.width;
    let height: number = size.height;
    let locX: number = location.x;
    let locY: number = location.y;
    let x: number = location.x + (-width / 2);
    let y: number = location.y + (-height / 2);
    switch (shape) {
        case 'Circle':
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
            break;
        case 'Diamond':
            path = 'M' + ' ' + x + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + locY + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Rectangle':
            path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Triangle':
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                'L' + ' ' + (locX - height) + ' ' + (locY - (width / 2)) +
                'L' + ' ' + (locX - height) + ' ' + (locY + (width / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'InvertedTriangle':
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                'L' + ' ' + (locX + height) + ' ' + (locY - (width / 2)) +
                'L' + ' ' + (locX + height) + ' ' + (locY + (width / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Image':
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
    }
    return options;
}

/**
 * Function to get range color from value for circular gauge.
 * @returns string
 * @private
 */
export function getRangeColor(value: number, ranges: Range[], color: string): string {
    let min: number = 0;
    let max: number = 0;
    let currentRange: Range[] = ranges.filter((range: Range) => {
        min = Math.min(range.start, range.end);
        max = Math.max(range.start, range.end);
        return (value >= min && max >= value);
    });
    return currentRange.length ? currentRange[0].rangeColor : color;
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
    public style: string;

    constructor(
        id: string, fill: string, width: number, color: string,
        opacity?: number, dashArray?: string, d?: string, transform: string = '', style: string = ''
    ) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
        this.transform = transform;
        this.style = style;
    }
}

/** @private */
export class RectOption extends CustomizeOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    constructor(
        id: string, fill: string, border: BorderModel, opacity: number, rect: Rect
    ) {
        super(id);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
    }
}

/**
 * Internal class size
 */
export class Size {

    /**
     * Specifies the height.
     */
    public height: number;
    /**
     * Specifies the width.
     */
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
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

    constructor(text: string, value: number, size?: Size) {
        this.text = text;
        this.value = value;
        this.size = size;
    }
}