import { Corners } from '../core/elements/drawing-element';
import { DrawingElement } from '../core/elements/drawing-element';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { Matrix, identityMatrix, transformPointByMatrix, rotateMatrix } from '../primitives/matrix';
import { TextAlign, TextWrap, WhiteSpace, TextDecoration } from '../enum/enum';
import { TextAttributes } from '../rendering/canvas-interface';
import { getChildNode } from './dom-util';
import { Size } from '../primitives/size';

/**
 * @private
 * @returns {string} - string
 */
export function randomId(): string {
    const chars: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let id: string = '';
    let num: number;
    for (let i: number = 0; i < 5; i++) {
        if ('crypto' in window && 'getRandomValues' in crypto) {
            const count: Uint16Array = new Uint16Array(1);
            const intCrypto: any = (window as any).msCrypto || window.crypto;
            num = intCrypto.getRandomValues(count)[0] % (chars.length - 1);
        } else {
            num = Math.floor(Math.random() * chars.length);
        }
        if (i === 0 && num < 10) { i--; continue; }
        id += chars.substring(num, num + 1);
    }
    return id;
}

/**
 * @hidden
 * expandTabSpace interface
 */
interface expandTabSpace {
    expandedString: string;
    width: number;
}

/**
 * @param {DrawingElement} ele - ele
 * @private
 * @returns {Rect} - Rect
 */
export function cornersPointsBeforeRotation(ele: DrawingElement): Rect {
    let bounds: Rect = new Rect();
    const top: number = ele.offsetY - ele.actualSize.height * ele.pivot.y;
    const bottom: number = ele.offsetY + ele.actualSize.height * (1 - ele.pivot.y);
    const left: number = ele.offsetX - ele.actualSize.width * ele.pivot.x;
    const right: number = ele.offsetX + ele.actualSize.width * (1 - ele.pivot.x);
    const topLeft: PointModel = { x: left, y: top };
    const topCenter: PointModel = { x: (left + right) / 2, y: top };
    const topRight: PointModel = { x: right, y: top };
    const middleLeft: PointModel = { x: left, y: (top + bottom) / 2 };
    const middleRight: PointModel = { x: right, y: (top + bottom) / 2 };
    const bottomLeft: PointModel = { x: left, y: bottom };
    const bottomCenter: PointModel = { x: (left + right) / 2, y: bottom };
    const bottomRight: PointModel = { x: right, y: bottom };
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    return bounds;
}
/**
 * @param {Size} size - size
 * @param {number} angle - angle
 * @private
 * @returns {Size} - Size
 */
export function rotateSize(size: Size, angle: number): Size {
    const matrix: Matrix = identityMatrix();
    rotateMatrix(matrix, angle, 0, 0);
    const topLeft: PointModel = transformPointByMatrix(matrix, { x: 0, y: 0 });
    const topRight: PointModel = transformPointByMatrix(matrix, { x: size.width, y: 0 });
    const bottomLeft: PointModel = transformPointByMatrix(matrix, { x: 0, y: size.height });
    const bottomRight: PointModel = transformPointByMatrix(matrix, { x: size.width, y: size.height });
    const minX: number = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const minY: number = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    const maxX: number = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const maxY: number = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    return new Size(maxX - minX, maxY - minY);
}

/**
 * @param {DrawingElement} element - element
 * @private
 * @returns {Rect} - Rect
 */
export function getBounds(element: DrawingElement): Rect {
    let bounds: Rect = new Rect();
    const corners: Rect = cornersPointsBeforeRotation(element);
    let middleLeft: PointModel = corners.middleLeft;
    let topCenter: PointModel = corners.topCenter;
    let bottomCenter: PointModel = corners.bottomCenter;
    let middleRight: PointModel = corners.middleRight;
    let topLeft: PointModel = corners.topLeft;
    let topRight: PointModel = corners.topRight;
    let bottomLeft: PointModel = corners.bottomLeft;
    let bottomRight: PointModel = corners.bottomRight;
    element.corners = {
        topLeft: topLeft, topCenter: topCenter, topRight: topRight, middleLeft: middleLeft,
        middleRight: middleRight, bottomLeft: bottomLeft, bottomCenter: bottomCenter, bottomRight: bottomRight
    } as Corners;

    if (element.rotateAngle !== 0 || element.parentTransform !== 0) {
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
        element.corners.topLeft = topLeft = transformPointByMatrix(matrix, topLeft);
        element.corners.topCenter = topCenter = transformPointByMatrix(matrix, topCenter);
        element.corners.topRight = topRight = transformPointByMatrix(matrix, topRight);
        element.corners.middleLeft = middleLeft = transformPointByMatrix(matrix, middleLeft);
        element.corners.middleRight = middleRight = transformPointByMatrix(matrix, middleRight);
        element.corners.bottomLeft = bottomLeft = transformPointByMatrix(matrix, bottomLeft);
        element.corners.bottomCenter = bottomCenter = transformPointByMatrix(matrix, bottomCenter);
        element.corners.bottomRight = bottomRight = transformPointByMatrix(matrix, bottomRight);
        //Set corners based on rotate angle
    }
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    element.corners.left = bounds.left;
    element.corners.right = bounds.right;
    element.corners.top = bounds.top;
    element.corners.bottom = bounds.bottom;
    element.corners.center = bounds.center;
    element.corners.width = bounds.width;
    element.corners.height = bounds.height;
    return bounds;
}

/**
 * @param {TextAlign} value - value
 * @private
 * @returns {string} - string
 */
export function textAlignToString(value: TextAlign): string {
    let state: string = '';
    switch (value) {
    case 'Center':
        state = 'center';
        break;
    case 'Left':
        state = 'left';
        break;
    case 'Right':
        state = 'right';
        break;
    case 'Justify':
        state = 'justify';
        break;
    }
    return state;
}
/**
 * @param {TextWrap | TextDecoration} value - value
 * @private
 * @returns {string} - string
 */
export function wordBreakToString(value: TextWrap | TextDecoration): string {
    let state: string = '';
    switch (value) {
    case 'Wrap':
        state = 'breakall';
        break;
    case 'NoWrap':
        state = 'keepall';
        break;
    case 'WrapWithOverflow':
        state = 'normal';
        break;
    case 'LineThrough':
        state = 'line-through';
        break;

    }
    return state;
}

/**
 * @param {string} textContent - textContent
 * @param {TextAttributes} options - options
 * @private
 * @returns {number} - number
 */
export function bBoxText(textContent: string, options: TextAttributes): number {
    const measureElement: string = 'measureElement';
    (window as any)[measureElement as string].style.visibility = 'visible';
    const svg: SVGElement = (window as any)[measureElement as string].children[2];
    const text: SVGTextElement = getChildNode(svg)[1] as SVGTextElement;
    text.textContent = textContent;
    text.style.cssText = `font-size: ${options.fontSize}px; font-family: ${options.fontFamily};
    font-weight: ${options.bold ? 'bold' : 'normal'}`;
    const bBox: number = text.getBBox().width;
    (window as any)[measureElement as string].style.visibility = 'hidden';
    return bBox;
}

/**
 * @param {string} text - text
 * @param {number} tabSize - tabSize
 * @private
 * @returns {string} - Rect
 */
export function expandTabsAsSpaces(text: string, tabSize: number = 7): string {
    const spaces: string = ' '.repeat(tabSize);
    return text.replace(/\t/g, spaces);
}

/**
 * @param {string} textContent - textContent
 * @param {TextAttributes} options - options
 * @private
 * @returns {number} - number
 */
export function bBoxTextBlazor(textContent: string, options: TextAttributes): number {
    const measureElement: string = 'measureElement';
    (window as any)[measureElement as string].style.visibility = 'visible';
    const svg: SVGElement = (window as any)[measureElement as string].children[2];
    const text: SVGTextElement = getChildNode(svg)[1] as SVGTextElement;
    const expanded: string = expandTabsAsSpaces(textContent, 7);
    text.textContent = expanded;
    text.style.cssText = `font-size:${options.fontSize}px; font-family:${options.fontFamily}; 
    font-weight:${options.bold ? 'bold' : 'normal'}`;
    const bBox: number = text.getBBox().width;
    (window as any)[measureElement as string].style.visibility = 'hidden';
    return bBox;
}

/**
 * @param {SVGTextElement} textEl - textEl
 * @param {string} input - input
 * @param {any} startX - startX
 * @private
 * @returns {expandTabSpace} - expandTabSpace
 */
export function expandTabsForSvg(textEl: SVGTextElement, input: string,
                                 { startX = 0, tabSizeSpaces = (7) }: any  = {}): expandTabSpace {
    // Measure the width of a single space in the current font.
    const original: string = textEl.textContent;
    textEl.textContent = ' ';
    const spaceW: number = textEl.getBBox().width || 0;
    textEl.textContent = original;
    const tabW: number = spaceW * tabSizeSpaces;
    let x: number = startX;
    let out: string = '';
    for (const ch of input) {
        if (ch === '\t') {
            // compute next tab stop in pixels
            const offset: number = x - startX;
            const nextOffset: number = Math.ceil(offset / tabW) * tabW;
            const padPx: number = nextOffset - offset;
            // convert pixel gap to a number of spaces (round up)
            const padSpaces: number = Math.max(1, Math.ceil(padPx / spaceW));
            out += ' '.repeat(padSpaces);
            x += padSpaces * spaceW;
        }
        else {
            // measure this glyph's width to advance cursor
            textEl.textContent = ch;
            const w: number = textEl.getBBox().width;
            out += ch;
            x += w;
        }
    }
    textEl.textContent = original;
    return { expandedString: out, width: x };
}

/**
 * @param {string} textContent - textContent
 * @param {TextAttributes} options - options
 * @private
 * @returns {number} - number
 */
export function bBoxTextHeight(textContent: string, options: TextAttributes): number {
    const measureElement: string = 'measureElement';
    (window as any)[measureElement as string].style.visibility = 'visible';
    const svg: SVGElement = (window as any)[measureElement as string].children[2];
    const text: SVGTextElement = getChildNode(svg)[1] as SVGTextElement;
    text.textContent = textContent;
    text.style.cssText = `font-size: ${options.fontSize}px; font-family: ${options.fontFamily};
    font-weight: ${options.bold ? 'bold' : 'normal'}`;
    const bBox: number = text.getBBox().height;
    (window as any)[measureElement as string].style.visibility = 'hidden';
    return bBox;
}

/**
 * @param {number} i - i
 * @param {number} j - j
 * @private
 * @returns {number} - number
 */
export function middleElement(i: number, j: number): number {
    let m: number = 0;
    m = (i + j) / 2;
    return m;
}

/**
 * @param {WhiteSpace} value - value
 * @param {TextWrap} wrap - wrap
 * @private
 * @returns {string} - string
 */
export function whiteSpaceToString(value: WhiteSpace, wrap: TextWrap): string {
    if (wrap === 'NoWrap' && value === 'PreserveAll') {
        return 'pre';
    }
    let state: string = '';
    switch (value) {
    case 'CollapseAll':
        state = 'nowrap';
        break;
    case 'CollapseSpace':
        state = 'pre-line';
        break;
    case 'PreserveAll':
        state = 'pre-wrap';
        break;
    }
    return state;
}

/**
 * @param {number} angle - angle
 * @param {number} pivotX - pivotX
 * @param {number} pivotY - pivotY
 * @param {PointModel} point - point
 * @private
 * @returns {PointModel} - PointModel
 */
export function rotatePoint(angle: number, pivotX: number, pivotY: number, point: PointModel): PointModel {
    if (angle !== 0) {
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivotX, pivotY);
        return transformPointByMatrix(matrix, point);
    }
    return point;
}

/**
 * @param {PointModel} topLeft - topLeft
 * @param {DrawingElement} obj - obj
 * @private
 * @returns {PointModel} - PointModel
 */
export function getOffset(topLeft: PointModel, obj: DrawingElement): PointModel {
    const offX: number = topLeft.x + obj.desiredSize.width * obj.pivot.x;
    const offY: number = topLeft.y + obj.desiredSize.height * obj.pivot.y;
    return {
        x: offX, y: offY
    };
}
