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
 * Implements the basic functionalities
 */
/** @private */
export function randomId(): string {
    let chars: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let id: string = '';
    let num: number;
    for (let i: number = 0; i < 5; i++) {
        if ('crypto' in window && 'getRandomValues' in crypto) {
            let count: Uint16Array = new Uint16Array(1);
            // tslint:disable-next-line:no-any
            let intCrypto: any = (window as any).msCrypto || window.crypto;
            num = intCrypto.getRandomValues(count)[0] % (chars.length - 1);
        } else {
            num = Math.floor(Math.random() * chars.length);
        }
        if (i === 0 && num < 10) { i--; continue; }
        id += chars.substring(num, num + 1);
    }
    return id;
}

/** @private */
export function cornersPointsBeforeRotation(ele: DrawingElement): Rect {
    let bounds: Rect = new Rect();
    let top: number = ele.offsetY - ele.actualSize.height * ele.pivot.y;
    let bottom: number = ele.offsetY + ele.actualSize.height * (1 - ele.pivot.y);
    let left: number = ele.offsetX - ele.actualSize.width * ele.pivot.x;
    let right: number = ele.offsetX + ele.actualSize.width * (1 - ele.pivot.x);
    let topLeft: PointModel = { x: left, y: top };
    let topCenter: PointModel = { x: (left + right) / 2, y: top };
    let topRight: PointModel = { x: right, y: top };
    let middleLeft: PointModel = { x: left, y: (top + bottom) / 2 };
    let middleRight: PointModel = { x: right, y: (top + bottom) / 2 };
    let bottomLeft: PointModel = { x: left, y: bottom };
    let bottomCenter: PointModel = { x: (left + right) / 2, y: bottom };
    let bottomRight: PointModel = { x: right, y: bottom };
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    return bounds;
}
/** @private */
export function rotateSize(size: Size, angle: number): Size {
    let matrix: Matrix = identityMatrix();
    rotateMatrix(matrix, angle, 0, 0);
    let topLeft: PointModel = transformPointByMatrix(matrix, { x: 0, y: 0 });
    let topRight: PointModel = transformPointByMatrix(matrix, { x: size.width, y: 0 });
    let bottomLeft: PointModel = transformPointByMatrix(matrix, { x: 0, y: size.height });
    let bottomRight: PointModel = transformPointByMatrix(matrix, { x: size.width, y: size.height });
    let minX: number = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    let minY: number = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    let maxX: number = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    let maxY: number = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    return new Size(maxX - minX, maxY - minY);
}

/** @private */
export function getBounds(element: DrawingElement): Rect {
    let bounds: Rect = new Rect();
    let corners: Rect;
    corners = cornersPointsBeforeRotation(element);
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
        let matrix: Matrix = identityMatrix();
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


/** @private */
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
    }
    return state;
}
/** @private */
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

export function bBoxText(textContent: string, options: TextAttributes): number {
    let measureElement: string = 'measureElement';
    // eslint-disable-next-line
    window[measureElement].style.visibility = 'visible';
    // eslint-disable-next-line
    let svg: SVGElement = window[measureElement].children[2];
    let text: SVGTextElement = getChildNode(svg)[1] as SVGTextElement;
    text.textContent = textContent;
    text.setAttribute('style', 'font-size:' + options.fontSize + 'px; font-family:'
        + options.fontFamily + ';font-weight:' + (options.bold ? 'bold' : 'normal'));
    let bBox: number = text.getBBox().width;
    // eslint-disable-next-line
    window[measureElement].style.visibility = 'hidden';
    return bBox;
}
/** @private */
export function middleElement(i: number, j: number): number {
    let m: number = 0;
    m = (i + j) / 2;
    return m;
}
/** @private */
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

/** @private */
export function rotatePoint(angle: number, pivotX: number, pivotY: number, point: PointModel): PointModel {
    if (angle !== 0) {
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivotX, pivotY);
        return transformPointByMatrix(matrix, point);
    }
    return point;
}

/** @private */
export function getOffset(topLeft: PointModel, obj: DrawingElement): PointModel {
    let offX: number = topLeft.x + obj.desiredSize.width * obj.pivot.x;
    let offY: number = topLeft.y + obj.desiredSize.height * obj.pivot.y;
    return {
        x: offX, y: offY
    };
}