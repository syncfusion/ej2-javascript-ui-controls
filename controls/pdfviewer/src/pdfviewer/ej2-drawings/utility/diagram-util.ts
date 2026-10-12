import { PointModel } from './../primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from './../primitives/matrix';
import { Corners } from '../core/elements/drawing-element';
import { DrawingElement } from '../core/elements/drawing-element';
import { Container } from './../core/containers/container';
import { StrokeStyle } from './../core/appearance';
import { TextStyleModel } from './../core/appearance-model';
import { Point } from './../primitives/point';
import { TextElement } from '../core/elements/text-element';
import { rotatePoint } from './base-util';
import { IElement } from '../objects/interface/IElement';

// /**
//  * Implements the drawing functionalities
//  */

/**
 * @param {PointModel} reference - reference
 * @param {PointModel} start - start
 * @param {PointModel} end - end
 * @private
 * @returns {PointModel} - PointModel
 */
export function findNearestPoint(reference: PointModel, start: PointModel, end: PointModel): PointModel {
    let shortestPoint: PointModel;
    const shortest: number = Point.findLength(start, reference);
    const shortest1: number = Point.findLength(end, reference);
    if (shortest > shortest1) {
        shortestPoint = end;
    } else {
        shortestPoint = start;
    }
    const angleBWStAndEnd: number = Point.findAngle(start, end);
    const angleBWStAndRef: number = Point.findAngle(shortestPoint, reference);
    const r: number = Point.findLength(shortestPoint, reference);
    const vaAngle: number = angleBWStAndRef + ((angleBWStAndEnd - angleBWStAndRef) * 2);
    return {
        x:
            (shortestPoint.x + r * Math.cos(vaAngle * Math.PI / 180)),
        y: (shortestPoint.y + r * Math.sin(vaAngle * Math.PI / 180))
    };
}

/**
 * @param {IElement} obj - obj
 * @param {PointModel} position - position
 * @param {number} padding - padding
 * @private
 * @returns {DrawingElement} - DrawingElement
 */
export function findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DrawingElement {
    return findTargetElement(obj.wrapper, position, padding);
}

/**
 * @param {Container} container - container
 * @param {PointModel} position - position
 * @param {number} padding - padding
 * @private
 * @returns {number} - number
 */
export function findTargetElement(container: Container, position: PointModel, padding?: number): DrawingElement {
    for (let i: number = container.children.length - 1; i >= 0; i--) {
        const element: DrawingElement = container.children[parseInt(i.toString(), 10)];
        if (element && element.bounds.containsPoint(position, 0)) {
            if (element instanceof Container) {
                const target: DrawingElement = this.findTargetElement(element, position);
                if (target) {
                    return target;
                }
            }
            if (element.bounds.containsPoint(position, 0)) {
                return element;
            }
        }
    }
    if (container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
        return container;
    }
    return null;
}

/**
 * @param {Segment} lineUtil1 - lineUtil1
 * @param {Segment} lineUtil2 - lineUtil2
 * @private
 * @returns {Intersection} - Intersection
 */
export function intersect3(lineUtil1: Segment, lineUtil2: Segment): Intersection {
    const point: PointModel = { x: 0, y: 0 };
    const l1: Segment = lineUtil1;
    const l2: Segment = lineUtil2;
    const d: number = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    const na: number = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
    const nb: number = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
    if (d === 0) {
        return { enabled: false, intersectPt: point };
    }
    const ua: number = na / d;
    const ub: number = nb / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        point.x = l1.x1 + (ua * (l1.x2 - l1.x1));
        point.y = l1.y1 + (ua * (l1.y2 - l1.y1));
        return { enabled: true, intersectPt: point };
    }
    return { enabled: false, intersectPt: point };
}

/**
 * @param {PointModel} start1 - start1
 * @param {PointModel} end1 - end1
 * @param {PointModel} start2 - start2
 * @param {PointModel} end2 - end2
 * @private
 * @returns {PointModel} - PointModel
 */
export function intersect2(start1: PointModel, end1: PointModel, start2: PointModel, end2: PointModel): PointModel {
    const point: PointModel = { x: 0, y: 0 };
    const lineUtil1: Segment = getLineSegment(start1.x, start1.y, end1.x, end1.y);
    const lineUtil2: Segment = getLineSegment(start2.x, start2.y, end2.x, end2.y);
    const line3: Intersection = intersect3(lineUtil1, lineUtil2);
    if (line3.enabled) {
        return line3.intersectPt;
    } else {
        return point;
    }
}

/**
 * @param {number} x1 - x1
 * @param {number} y1 - y1
 * @param {number} x2 - x2
 * @param {number} y2 - y2
 * @private
 * @returns {Segment} - Segment
 */
export function getLineSegment(x1: number, y1: number, x2: number, y2: number): Segment {
    return { 'x1': Number(x1) || 0, 'y1': Number(y1) || 0, 'x2': Number(x2) || 0, 'y2': Number(y2) || 0 };
}

/**
 * @param {DrawingElement} element - element
 * @param {Corners} corners - corners
 * @param {number} padding - padding
 * @private
 * @returns {PointModel[]} - PointModel[]
 */
export function getPoints(element: DrawingElement, corners: Corners, padding?: number): PointModel[] {
    const line: PointModel[] = [];
    padding = padding || 0;
    const left: PointModel = { x: corners.topLeft.x - padding, y: corners.topLeft.y };
    const right: PointModel = { x: corners.topRight.x + padding, y: corners.topRight.y };
    const top: PointModel = { x: corners.bottomRight.x, y: corners.bottomRight.y - padding };
    const bottom: PointModel = { x: corners.bottomLeft.x, y: corners.bottomLeft.y + padding };
    line.push(left);
    line.push(right);
    line.push(top);
    line.push(bottom);
    return line;
}

/**
 * @param {PointModel} src - src
 * @param {PointModel} tar - tar
 * @private
 * @returns {string} - string
 */
export function getBezierDirection(src: PointModel, tar: PointModel): string {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'right' : 'left';
    } else {
        return src.y < tar.y ? 'bottom' : 'top';
    }
}

/**
 * @param {TextStyleModel} changedObject - changedObject
 * @param {DrawingElement} target - target
 * @private
 * @returns {void} - void
 */
export function updateStyle(changedObject: TextStyleModel, target: DrawingElement): void {
    //since text style model is the super set of shape style model, we used text style model
    const style: TextStyleModel = target.style as TextStyleModel;
    const textElement: TextElement = target as TextElement;
    for (const key of Object.keys(changedObject)) {
        switch (key) {
        case 'fill':
            style.fill = changedObject.fill;
            if (style instanceof StrokeStyle) {
                /* tslint:disable:no-string-literal */
                style['fill'] = 'transparent';
            }
            break;
        case 'textOverflow':
            style.textOverflow = changedObject.textOverflow;
            break;
        case 'opacity':
            style.opacity = changedObject.opacity;
            break;
        case 'strokeColor':
            style.strokeColor = changedObject.strokeColor;
            break;
        case 'strokeDashArray':
            style.strokeDashArray = changedObject.strokeDashArray;
            break;
        case 'strokeWidth':
            style.strokeWidth = changedObject.strokeWidth;
            break;
        case 'bold':
            style.bold = changedObject.bold;
            break;
        case 'color':
            style.color = changedObject.color;
            break;
        case 'textWrapping':
            style.textWrapping = changedObject.textWrapping;
            break;
        case 'fontFamily':
            style.fontFamily = changedObject.fontFamily;
            break;
        case 'fontSize':
            style.fontSize = changedObject.fontSize;
            break;
        case 'italic':
            style.italic = changedObject.italic;
            break;
        case 'textAlign':
            style.textAlign = changedObject.textAlign;
            break;
        case 'whiteSpace':
            style.whiteSpace = changedObject.whiteSpace;
            break;
        case 'textDecoration':
            style.textDecoration = changedObject.textDecoration;
            break;
        }
    }
    if (target instanceof TextElement) {
        textElement.refreshTextElement();
    }
}

/**
 * @param {DrawingElement} element - element
 * @param {number} sw - sw
 * @param {number} sh - sh
 * @param {DrawingElement} refObject - refObject
 * @private
 * @returns {void} - void
 */
export function scaleElement(element: DrawingElement, sw: number, sh: number, refObject: DrawingElement): void {
    if (element.width !== undefined && element.height !== undefined) {
        element.width *= sw;
        element.height *= sh;
    }
    if (element instanceof Container) {
        const matrix: Matrix = identityMatrix();
        const width: number = refObject.width || refObject.actualSize.width;
        const height: number = refObject.height || refObject.actualSize.height;
        if (width !== undefined && height !== undefined) {
            const x: number = refObject.offsetX - width * refObject.pivot.x;
            const y: number = refObject.offsetY - height * refObject.pivot.y;
            let refPoint: PointModel = {
                x: x + width * refObject.pivot.x,
                y: y + height * refObject.pivot.y
            };
            refPoint = rotatePoint(refObject.rotateAngle, refObject.offsetX, refObject.offsetY, refPoint);
            rotateMatrix(matrix, -refObject.rotateAngle, refPoint.x, refPoint.y);
            //    scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
            rotateMatrix(matrix, refObject.rotateAngle, refPoint.x, refPoint.y);
            for (const child of element.children) {
                if (child.width !== undefined && child.height !== undefined) {
                    const newPosition: PointModel = transformPointByMatrix(matrix, { x: child.offsetX, y: child.offsetY });
                    child.offsetX = newPosition.x;
                    child.offsetY = newPosition.y;
                    scaleElement(child, sw, sh, refObject);
                }
            }
        }
    }
}

/**
 * @param {PointModel} mousePosition - mousePosition
 * @param {PointModel} corner - corner
 * @param {number} padding - padding
 * @private
 * @returns {boolean} - boolean
 */
export function contains(mousePosition: PointModel, corner: PointModel, padding: number): boolean {
    if (mousePosition.x >= corner.x - padding && mousePosition.x <= corner.x + padding) {
        if (mousePosition.y >= corner.y - padding && mousePosition.y <= corner.y + padding) {
            return true;
        }
    }
    return false;
}

/**
 * @param {number} x - x
 * @param {number} y - y
 * @param {number} w - w
 * @param {number} h - h
 * @param {number} angle - angle
 * @param {number} offsetX - offsetX
 * @param {number} offsetY - offsetY
 * @param {PointModel} cornerPoint - cornerPoint
 * @private
 * @returns {PointModel} - PointModel
 */
export function getPoint(
    x: number, y: number, w: number, h: number, angle: number, offsetX: number, offsetY: number, cornerPoint: PointModel): PointModel {
    let pivot: PointModel = { x: 0, y: 0 };
    const trans: Matrix = identityMatrix();
    rotateMatrix(trans, angle, offsetX, offsetY);
    switch (cornerPoint.x) {
    case 0:
        switch (cornerPoint.y) {
        case 0:
            pivot = transformPointByMatrix(trans, ({ x: x, y: y }));
            break;
        case 0.5:
            pivot = transformPointByMatrix(trans, ({ x: x, y: y + h / 2 }));
            break;
        case 1:
            pivot = transformPointByMatrix(trans, ({ x: x, y: y + h }));
            break;
        }
        break;
    case 0.5:
        switch (cornerPoint.y) {
        case 0:
            pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y }));
            break;
        case 0.5:
            pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y + h / 2 }));
            break;
        case 1:
            pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y + h }));
            break;
        }
        break;
    case 1:
        switch (cornerPoint.y) {
        case 0:
            pivot = transformPointByMatrix(trans, ({ x: x + w, y: y }));
            break;
        case 0.5:
            pivot = transformPointByMatrix(trans, ({ x: x + w, y: y + h / 2 }));
            break;
        case 1:
            pivot = transformPointByMatrix(trans, ({ x: x + w, y: y + h }));
            break;
        }
        break;
    }
    return { x: pivot.x, y: pivot.y };
}

/**
 * @hidden
 * Segment interface
 */
export interface Segment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/**
 * @hidden
 * Intersection interface
 */
export interface Intersection {
    enabled: boolean;
    intersectPt: PointModel;
}

/**
 * @hidden
 * Info interface
 */
export interface Info {
    ctrlKey?: boolean;
    shiftKey?: boolean;
}
