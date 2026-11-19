/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextStyleModel } from './tooltip-model';
import { SvgRenderer } from '../svg-render/index';
import { createElement, remove, merge, isNullOrUndefined } from '@syncfusion/ej2-base';


/**
 * Internal cache + scratch state for `measureText`.
 *
 * Encapsulated as a private (non-exported) class with static members to match the
 * codebase convention of holding mutable state on classes (see `SvgRenderer`,
 * `CanvasRenderer`, `Tooltip`) rather than as free module-level variables.
 *
 *  - `cache`            : memoized [width, height] keyed by font + text (avoids reflow).
 *  - `count` / `LIMIT`  : bounded eviction guard for long-running applications.
 *  - `lastStyle`        : last font styles written to the shared measurement node,
 *                         so identical consecutive misses skip redundant style writes.
 *
 * @private
 */
export class TextMeasureCache {
    public static cache: { [key: string]: [number, number] } = {};
    public static count: number = 0;
    public static readonly LIMIT: number = 10000;
    public static clear(): void {
        this.cache = {};
        this.count = 0;
    }
}

/**
 * Function to measure the height and width of the text.
 *
 * @private
 * @param {string} text To get a text
 * @param {TextStyleModel} font To get a font of the text
 * @param {TextStyleModel} themeFontStyle Theme defaults used when font fields are unset
 * @param {boolean} isHeader Whether the text is rendered as the tooltip header
 * @returns {Size} measureText
 */
export function measureText(text: string, font: TextStyleModel, themeFontStyle?: TextStyleModel, isHeader?: boolean): Size {
    text = text || ''; // For avoid NuLL value
    let fontSize: string = font.size || (isHeader ? themeFontStyle.headerTextSize : themeFontStyle.size);
    fontSize = !isNullOrUndefined(fontSize) && !isNaN(Number(fontSize)) ? `${fontSize}px` : fontSize;
    const fontStyle: string = font.fontStyle || themeFontStyle.fontStyle;
    const fontFamily: string = font.fontFamily || themeFontStyle.fontFamily;
    const fontWeight: string = font.fontWeight || themeFontStyle.fontWeight;

    const fonts: any = (document as any).fonts;
    const canUseCache: boolean = !fonts || fonts.status === 'loaded';
    let htmlObject: HTMLElement = document.getElementById('chartmeasuretext');
    if (!canUseCache && TextMeasureCache.count > 0) {
        TextMeasureCache.clear();
    }
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'chartmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    const previousWeight: string = htmlObject.style.fontWeight;
    const cacheKey: string = fontSize + '__' + fontStyle + '__' + fontFamily + '__' + previousWeight + '__' + fontWeight + '__' + text;
    if (canUseCache) {
        const cached: [number, number] = TextMeasureCache.cache[cacheKey as string];
        if (cached) {
            htmlObject.style.fontWeight = fontWeight;
            return new Size(cached[0], cached[1]);
        }
    }

    if (typeof text === 'string') {
        const textArray: string[] = text.split(' ');

        for (let i: number = 0; i < textArray.length; i++) {
            const textArray1: string[] = textArray[i as number].split(/<br\/?>/);
            for (let j: number = 0; j < textArray1.length; j++) {
                const value: string = textArray1[j as number];
                if ((value.indexOf('<') > -1 || value.indexOf('>') > -1)) {
                    textArray1[j as number] = value.replace(/[<>]/g, '&');
                }
            }
            textArray[i as number] = textArray1.join('<br>');
        }

        text = textArray.join(' ');
    }

    htmlObject.innerHTML = text;
    htmlObject.style.position = 'fixed';
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100px';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    htmlObject.style.lineHeight = 'normal';
    htmlObject.style.fontSize = fontSize;
    htmlObject.style.fontStyle = fontStyle;
    htmlObject.style.fontFamily = fontFamily;


    const fontWidth: number = htmlObject.clientWidth;
    const fontHeight: number = htmlObject.clientHeight;

    htmlObject.style.fontWeight = fontWeight;

    const width: number =
        htmlObject.style.fontWeight === 'bold' && previousWeight === 'normal'
            ? Math.max(fontWidth, htmlObject.clientWidth)
            : htmlObject.clientWidth;

    const height: number =
        htmlObject.style.fontWeight === 'bold' && previousWeight === 'normal'
            ? Math.max(fontHeight, htmlObject.clientHeight)
            : htmlObject.clientHeight;
    if (canUseCache && width > 0 && height > 0) {
        if (TextMeasureCache.count >= TextMeasureCache.LIMIT) {
            TextMeasureCache.clear();
        }
        TextMeasureCache.cache[cacheKey as string] = [width, height];
        TextMeasureCache.count++;
    }

    return new Size(width, height);
}

/** @private */
export function withInAreaBounds(x: number, y: number, areaBounds: Rect, width: number = 0, height: number = 0): boolean {
    return (x >= areaBounds.x - width && x <= areaBounds.x + areaBounds.width + width && y >= areaBounds.y - height
        && y <= areaBounds.y + areaBounds.height + height);
}

/** @private */
export function findDirection(
    rX: number, rY: number, rect: Rect, arrowLocation: TooltipLocation, arrowPadding: number,
    top: boolean, bottom: boolean, left: boolean, tipX: number, tipY: number, controlName: string = ''
): string {
    let direction: string = '';
    const startX: number = rect.x;
    const startY: number = rect.y;
    const width: number = rect.x + rect.width;
    const height: number = rect.y + rect.height;

    if (top) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + startY + ' ' + (startX + rX) + ' ' + startY + ' ' +
            ' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + width + ' '
            + startY + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height));
        if (arrowPadding !== 0) {
            if (controlName === 'RangeNavigator') {
                if ((arrowLocation.x - arrowPadding) > width / 2) {
                    direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding) + ' ' + (height));
                    direction = direction.concat(' L' + ' ' + (tipX + arrowPadding) + ' ' + (height + arrowPadding)
                        + ' L' + ' ' + (arrowLocation.x) + ' ' + height);
                } else {
                    direction = direction.concat(' L' + ' ' + (arrowLocation.x) + ' ' + (height));
                    direction = direction.concat(' L' + ' ' + (tipX - arrowPadding) + ' ' + (height + arrowPadding)
                        + ' L' + ' ' + (arrowLocation.x - arrowPadding) + ' ' + height);
                }
            } else {
                direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding) + ' ' + (height));
                direction = direction.concat(' L' + ' ' + (tipX) + ' ' + (height + arrowPadding)
                    + ' L' + ' ' + (arrowLocation.x - arrowPadding) + ' ' + height);
            }
        }
        if ((arrowLocation.x - arrowPadding) > startX) {
            direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
                + height + ' ' + (startX) + ' ' + (height - rY) + ' z');
        } else {
            if (arrowPadding === 0) {
                direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
                    + height + ' ' + (startX) + ' ' + (height - rY) + ' z');
            } else {
                direction = direction.concat(' L' + ' ' + (startX) + ' ' + (height + rY) + ' z');
            }
        }

    } else if (bottom) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY) + ' L' + ' ' + (arrowLocation.x - arrowPadding) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (tipX) + ' ' + (arrowLocation.y));
        direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY)
            + ' Q ' + (width) + ' ' + (startY) + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + (width) + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height) +
            ' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + (startX) + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    } else if (left) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + (width) + ' '
            + (startY) + ' ' + (width) + ' ' + ((controlName === 'RangeNavigator' ? 0 : (startY + rY)) + ' L' + ' ' + (width) + ' ' + (controlName === 'RangeNavigator' ? 0 : (arrowLocation.y - arrowPadding))));
        direction = (controlName === 'RangeNavigator') ? direction.concat(' L' + ' ' + (width + arrowPadding) + ' ' + 0) :
            direction.concat(' L' + ' ' + (width + arrowPadding) + ' ' + (tipY));
        direction = (controlName === 'RangeNavigator') ? direction.concat(' L' + ' ' + (width) + ' ' + (arrowLocation.y - rY)) :
            direction.concat(' L' + ' ' + (width) + ' ' + (arrowLocation.y + arrowPadding));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' ' + (height) + ' ' + (width - rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    } else {
        direction = direction.concat('M' + ' ' + (startX + rX) + ' ' + (startY) + ' Q ' + (startX) + ' '
            + (startY) + ' ' + (startX) + ' ' + ((controlName === 'RangeNavigator' ? 0 : (startY + rY)) + ' L' + ' ' + (startX) + ' ' + (controlName === 'RangeNavigator' ? 0 : (arrowLocation.y - arrowPadding))));
        direction = (controlName === 'RangeNavigator') ? direction.concat(' L' + ' ' + (startX - arrowPadding) + ' ' + 0) :
            direction.concat(' L' + ' ' + (startX - arrowPadding) + ' ' + (tipY));
        direction = (controlName === 'RangeNavigator') ? direction.concat(' L' + ' ' + (startX) + ' ' + (arrowLocation.y - rY)) :
            direction.concat(' L' + ' ' + (startX) + ' ' + (arrowLocation.y + arrowPadding));
        direction = direction.concat(' L' + ' ' + (startX) + ' ' + (height - rY) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX + rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (height) + ' Q ' + width + ' '
            + (height) + ' ' + (width) + ' ' + (height - rY) +
            ' L' + ' ' + (width) + ' ' + (startY + rY) + ' Q ' + width + ' '
            + (startY) + ' ' + (width - rX) + ' ' + (startY) + ' z');
    }

    return direction;
}

/** @private */
export class Size {

    public height: number;
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

export class Side {
    public isRight: boolean;
    public isBottom: boolean;
    constructor(bottom: boolean, right: boolean) {
        this.isRight = right;
        this.isBottom = bottom;
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
export class TextOption extends CustomizeOption {

    public anchor: string;
    public text: string | string[];
    public transform: string = '';
    public x: number;
    public y: number;
    public baseLine: string = 'auto';
    public labelRotation: number = 0;

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string | string[], transform: string = '',
                baseLine?: string, labelRotation?: number) {
        super(id);
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
        this.labelRotation = labelRotation;
    }
}
/** @private */
export function getElement(id: string): Element {
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
export interface IShapes {
    renderOption?: Object;
    functionName?: string;
}
/** @private */
export function drawSymbol(location: TooltipLocation, shape: string, size: Size, url: string, options: PathOption, role: string,
                           label: string): Element {
    const renderer: SvgRenderer = new SvgRenderer('');
    const temp: IShapes = calculateShapes(location, size, shape, options, url);
    const htmlObject: Element = renderer['draw' + temp.functionName](temp.renderOption);
    htmlObject.setAttribute('role', role);
    htmlObject.setAttribute('aria-label', label);
    return htmlObject;
}
/** @private */
export function calculateShapes(location: TooltipLocation, size: Size, shape: string, options: PathOption, url: string): IShapes {
    let path: string;
    let functionName: string = 'Path';
    const width: number = size.width;
    const height: number = size.height;
    const locX: number = location.x;
    const locY: number = location.y;
    const x: number = location.x + (-width / 2);
    const y: number = location.y + (-height / 2);
    switch (shape) {
    case 'Circle':
    case 'Bubble':
        functionName = 'Ellipse';
        merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
        break;
    case 'Plus':
        path = 'M' + ' ' + x + ' ' + locY + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
            'M' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + locX + ' ' +
            (locY + (-height / 2));
        merge(options, { 'd': path, stroke : options.fill });
        break;
    case 'Cross':
        path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
            'M' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' +
            (locY + (-height / 2));
        merge(options, { 'd': path, stroke : options.fill });
        break;
    case 'HorizontalLine':
        path = 'M' + ' ' + x + ' ' + locY + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + locY;
        merge(options, { 'd': path, stroke : options.fill });
        break;
    case 'VerticalLine':
        path = 'M' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + locX + ' ' + (locY + (-height / 2));
        merge(options, { 'd': path, stroke : options.fill });
        break;
    case 'Diamond':
        path = 'M' + ' ' + x + ' ' + locY + ' ' +
            'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
            'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + locY + ' z';
        merge(options, { 'd': path });
        break;
    case 'Rectangle':
        path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' z';
        merge(options, { 'd': path });
        break;
    case 'Triangle':
        path = 'M' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' z';
        merge(options, { 'd': path });
        break;
    case 'InvertedTriangle':
        path = 'M' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
            'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + (locX - (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' z';
        merge(options, { 'd': path });
        break;
    case 'Pentagon':
        const eq: number = 72;
        let xValue: number;
        let yValue: number;
        for (let i: number = 0; i <= 5; i++) {
            xValue = (width / 2) * Math.cos((Math.PI / 180) * (i * eq));
            yValue = (height / 2) * Math.sin((Math.PI / 180) * (i * eq));
            if (i === 0) {
                path = 'M' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ';
            } else {
                path = path.concat('L' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ');
            }
        }
        path = path.concat('Z');
        merge(options, { 'd': path });
        break;
    case 'Image':
        functionName = 'Image';
        merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
        break;
    case 'Star': {
        const cornerPoints: number = 5;
        const outerRadius: number = Math.min(width, height) / 2;
        const innerRadius: number = outerRadius / 2;
        const angle: number = Math.PI / cornerPoints;
        let starPath: string = '';
        for (let i: number = 0; i < 2 * cornerPoints; i++) {
            const radius: number = (i % 2 === 0) ? outerRadius : innerRadius;
            const currentX: number = locX + radius * Math.cos(i * angle - Math.PI / 2);
            const currentY: number = locY + radius * Math.sin(i * angle - Math.PI / 2);
            starPath += (i === 0 ? 'M' : 'L') + currentX + ',' + currentY;
        }
        starPath += 'Z';
        merge(options, { 'd': starPath });
        break;
    }
    }
    return { renderOption: options, functionName: functionName };
}
/** @private */
export class PathOption extends CustomizeOption {
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;

    constructor(id: string, fill: string, width: number, color: string, opacity?: number, dashArray?: string, d?: string) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}

/** @private */
export function textElement(
    options: TextOption, font: TextStyleModel, color: string,
    parent: HTMLElement | Element, themeStyle?: TextStyleModel
): Element {
    let renderOptions: Object = {};
    const renderer: SvgRenderer = new SvgRenderer('');
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'font-size': font.size || themeStyle.size,
        'font-style': font.fontStyle || themeStyle.fontStyle,
        'font-family': font.fontFamily || themeStyle.fontFamily,
        'font-weight': font.fontWeight || themeStyle.fontWeight,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine
    };
    const text: string = typeof options.text === 'string' ? options.text : options.text[0];
    const htmlObject: HTMLElement = renderer.createText(renderOptions, text) as HTMLElement;
    if (parent) {
        parent.appendChild(htmlObject);
    }
    return htmlObject;
}
export class TooltipLocation {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
