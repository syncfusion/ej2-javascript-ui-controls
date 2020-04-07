import { PathOption } from '@syncfusion/ej2-svg-base';
import { remove } from '@syncfusion/ej2-base';
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
export function degreeToLocation(centerX: number, centerY: number, radius: number, angleInDegrees: number): object {
    let angleInRadians: number = (angleInDegrees - 90) * (Math.PI / 180);

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
    // tslint:disable-next-line
    let start: any = degreeToLocation(x, y, radius, startAngle);
    // tslint:disable-next-line
    let end: any = degreeToLocation(x, y, radius, endAngle);
    let largeArcFlag: string = '0';
    let sweepFlag: string = (enableRtl) ? '0' : '1';
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
/**
 * Animation Effect Calculation 
 * @private
 */
export function effect(currentTime: number, startValue: number, endValue: number, duration: number, enableRtl: boolean): number {
    let start: number = (enableRtl) ? endValue : -endValue;
    let end: number = startValue + ((enableRtl) ? -endValue : endValue);
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
    let element: Element = typeof id === 'string' ? getElement(id) : id;
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


















