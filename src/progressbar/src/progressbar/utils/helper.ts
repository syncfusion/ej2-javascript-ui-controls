/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { PathOption } from '@syncfusion/ej2-svg-base';
import { remove, createElement } from '@syncfusion/ej2-base';
/**
 * helper for progress bar
 */
/** @private */
export class Rect {
    public x: number;
    public y: number;
    public height: number;
    public width: number;
    constructor(x: number, y: number, height: number, width: number) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

    }
}
/** @private */
export class Size {
    public height: number;
    public width: number;
    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;
    }
}
/** @private */
export class Pos {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
/** @private */
export class RectOption extends PathOption {
    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public rx: number;
    public ry: number;
    public transform: string;
    constructor(
        id: string, fill: string, width: number, color: string, opacity: number,
        rect: Rect, rx?: number, ry?: number, transform?: string, dashArray?: string
    ) {
        super(id, fill, width, color, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
        this.stroke = (width !== 0 && this.stroke !== '') ? color : 'transparent';
    }
}

/** @private */
export class ColorValue {
    public r: number;
    public g: number;
    public b: number;

    constructor(r?: number, g?: number, b?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

/** @private */
export function convertToHexCode(value: ColorValue): string {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}

/** @private */
export function componentToHex(value: number): string {
    const hex: string = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/** @private */
export function convertHexToColor(hex: string): ColorValue {
    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}

/** @private */
export function colorNameToHex(color: string): string {
    color = color === 'transparent' ? 'white' : color;
    document.body.appendChild(createElement('text', { id: 'chartmeasuretext' }));
    const element: HTMLElement = document.getElementById('chartmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    remove(element);
    const exp: RegExp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    const isRGBValue: RegExpExecArray = exp.exec(color);
    return convertToHexCode(
        new ColorValue(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10))
    );
}

/** @private */
export class TextOption {
    public id: string;
    public ['font-size']: string;
    public ['font-style']: string;
    public ['font-family']: string;
    public ['font-weight']: string;
    public ['text-anchor']: string;
    public fill: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    constructor(
        id: string, fontSize: string, fontStyle: string, fontFamily: string, fontWeight: string,
        textAnchor: string, fill: string, x: number, y: number, width?: number, height?: number
    ) {
        this.id = id;
        this['font-size'] = fontSize;
        this['font-style'] = fontStyle;
        this['font-family'] = fontFamily;
        this['font-weight'] = fontWeight;
        this['text-anchor'] = textAnchor;
        this.fill = fill;
        this.x = x;
        this.y = y;
        this.width = width ? width : 0;
        this.height = height ? height : 0;
    }
}
/** calculate the start and end point of circle */
export function degreeToLocation(centerX: number, centerY: number, radius: number, angleInDegrees: number): Pos {
    const angleInRadians: number = (angleInDegrees - 90) * (Math.PI / 180);

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
/** calculate the path of the circle */
export function getPathArc(
    x: number, y: number, radius: number, startAngle: number, endAngle: number,
    enableRtl: boolean, pieView?: boolean
): string {
    const start: Pos = degreeToLocation(x, y, radius, startAngle);
    const end: Pos = degreeToLocation(x, y, radius, endAngle);
    let largeArcFlag: string = '0';
    const sweepFlag: string = (enableRtl) ? '0' : '1';
    if (!enableRtl) {
        largeArcFlag = ((endAngle >= startAngle) ? endAngle : endAngle + 360) - startAngle <= 180 ? '0' : '1';
    } else {
        largeArcFlag = ((startAngle >= endAngle) ? startAngle : startAngle + 360) - endAngle <= 180 ? '0' : '1';
    }
    let d: string;
    if (pieView) {
        d = 'M ' + x + ' ' + y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' ' + ' 0 ' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y + ' ' + 'Z';
    } else {
        d = 'M' + start.x + ' ' + start.y +
            'A' + radius + ' ' + radius + ' ' + '0' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y;
    }
    return d;
}
/** @private */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/** @private */
export function setAttributes(options: any, element: Element): Element {
    const keys: string[] = Object.keys(options);
    for (let i: number = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], options[keys[i]]);
    }
    return element;
}
/**
 * Animation Effect Calculation
 *
 * @private
 */
export function effect(currentTime: number, startValue: number, endValue: number, duration: number, enableRtl: boolean): number {
    const start: number = (enableRtl) ? endValue : -endValue;
    const end: number = startValue + ((enableRtl) ? -endValue : endValue);
    return start * Math.cos(currentTime / duration * (Math.PI / 2)) + end;
}
/**
 * @private
 */
export const annotationRender: string = 'annotationRender';
/**
 * @private
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}
/**
 * @private
 */
export function removeElement(id: string | Element): void {
    if (!id) {
        return null;
    }
    const element: Element = typeof id === 'string' ? getElement(id) : id;
    if (element) {
        remove(element);
    }
}
/**
 * @private
 */
export class ProgressLocation {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

















