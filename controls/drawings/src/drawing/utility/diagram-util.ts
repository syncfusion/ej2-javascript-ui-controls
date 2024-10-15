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

/**
 * Implements the drawing functionalities
 */

/** @private */
export function findNearestPoint(reference: PointModel, start: PointModel, end: PointModel): PointModel {
    let shortestPoint: PointModel;
    let shortest: number = Point.findLength(start, reference);
    let shortest1: number = Point.findLength(end, reference);
    if (shortest > shortest1) {
        shortestPoint = end;
    } else {
        shortestPoint = start;
    }
    let angleBWStAndEnd: number = Point.findAngle(start, end);
    let angleBWStAndRef: number = Point.findAngle(shortestPoint, reference);
    let r: number = Point.findLength(shortestPoint, reference);
    let vaAngle: number = angleBWStAndRef + ((angleBWStAndEnd - angleBWStAndRef) * 2);
    return {
        x:
            (shortestPoint.x + r * Math.cos(vaAngle * Math.PI / 180)),
        y: (shortestPoint.y + r * Math.sin(vaAngle * Math.PI / 180))
    };
}
/** @private */
export function findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DrawingElement {
    return findTargetElement(obj.wrapper, position, padding);
}

/** @private */
export function findTargetElement(container: Container, position: PointModel, padding?: number): DrawingElement {
    for (let i: number = container.children.length - 1; i >= 0; i--) {
        let element: DrawingElement = container.children[parseInt(i.toString(), 10)];
        if (element && element.bounds.containsPoint(position, 0)) {
            if (element instanceof Container) {
                let target: DrawingElement = this.findTargetElement(element, position);
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



/** @private */
export function intersect3(lineUtil1: Segment, lineUtil2: Segment): Intersection {
    let point: PointModel = { x: 0, y: 0 };
    let l1: Segment = lineUtil1;
    let l2: Segment = lineUtil2;
    let d: number = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    let na: number = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
    let nb: number = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
    if (d === 0) {
        return { enabled: false, intersectPt: point };
    }
    let ua: number = na / d;
    let ub: number = nb / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        point.x = l1.x1 + (ua * (l1.x2 - l1.x1));
        point.y = l1.y1 + (ua * (l1.y2 - l1.y1));
        return { enabled: true, intersectPt: point };
    }
    return { enabled: false, intersectPt: point };
}

/** @private */
export function intersect2(start1: PointModel, end1: PointModel, start2: PointModel, end2: PointModel): PointModel {
    let point: PointModel = { x: 0, y: 0 };
    let lineUtil1: Segment = getLineSegment(start1.x, start1.y, end1.x, end1.y);
    let lineUtil2: Segment = getLineSegment(start2.x, start2.y, end2.x, end2.y);
    let line3: Intersection = intersect3(lineUtil1, lineUtil2);
    if (line3.enabled) {
        return line3.intersectPt;
    } else {
        return point;
    }
}

/** @private */
export function getLineSegment(x1: number, y1: number, x2: number, y2: number): Segment {
    return { 'x1': Number(x1) || 0, 'y1': Number(y1) || 0, 'x2': Number(x2) || 0, 'y2': Number(y2) || 0 };
}

/** @private */
export function getPoints(element: DrawingElement, corners: Corners, padding?: number): PointModel[] {
    let line: PointModel[] = [];
    padding = padding || 0;
    let left: PointModel = { x: corners.topLeft.x - padding, y: corners.topLeft.y };
    let right: PointModel = { x: corners.topRight.x + padding, y: corners.topRight.y };
    let top: PointModel = { x: corners.bottomRight.x, y: corners.bottomRight.y - padding };
    let bottom: PointModel = { x: corners.bottomLeft.x, y: corners.bottomLeft.y + padding };

    line.push(left);
    line.push(right);
    line.push(top);
    line.push(bottom);
    return line;
}

/** @private */
export function getBezierDirection(src: PointModel, tar: PointModel): string {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'right' : 'left';
    } else {
        return src.y < tar.y ? 'bottom' : 'top';
    }
}

/** @private */
export function updateStyle(changedObject: TextStyleModel, target: DrawingElement): void {
    //since text style model is the super set of shape style model, we used text style model
    let style: TextStyleModel = target.style as TextStyleModel;
    let textElement: TextElement = target as TextElement;
    for (let key of Object.keys(changedObject)) {
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

/** @private */
export function scaleElement(element: DrawingElement, sw: number, sh: number, refObject: DrawingElement): void {
    if (element.width !== undefined && element.height !== undefined) {
        element.width *= sw;
        element.height *= sh;
    }
    if (element instanceof Container) {
        let matrix: Matrix = identityMatrix();
        let width: number = refObject.width || refObject.actualSize.width;
        let height: number = refObject.height || refObject.actualSize.height;
        if (width !== undefined && height !== undefined) {
            let x: number = refObject.offsetX - width * refObject.pivot.x;
            let y: number = refObject.offsetY - height * refObject.pivot.y;
            let refPoint: PointModel = {
                x: x + width * refObject.pivot.x,
                y: y + height * refObject.pivot.y
            };
            refPoint = rotatePoint(refObject.rotateAngle, refObject.offsetX, refObject.offsetY, refPoint);
            rotateMatrix(matrix, -refObject.rotateAngle, refPoint.x, refPoint.y);
            //    scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
            rotateMatrix(matrix, refObject.rotateAngle, refPoint.x, refPoint.y);
            for (let child of element.children) {
                if (child.width !== undefined && child.height !== undefined) {
                    let newPosition: PointModel = transformPointByMatrix(matrix, { x: child.offsetX, y: child.offsetY });
                    child.offsetX = newPosition.x;
                    child.offsetY = newPosition.y;
                    scaleElement(child, sw, sh, refObject);
                }
            }
        }
    }
}

/** @private */
export function contains(mousePosition: PointModel, corner: PointModel, padding: number): boolean {
    if (mousePosition.x >= corner.x - padding && mousePosition.x <= corner.x + padding) {
        if (mousePosition.y >= corner.y - padding && mousePosition.y <= corner.y + padding) {
            return true;
        }
    }
    return false;
}

/** @private */
export function getPoint(
    x: number, y: number, w: number, h: number, angle: number, offsetX: number, offsetY: number, cornerPoint: PointModel): PointModel {
    let pivot: PointModel = { x: 0, y: 0 };
    let trans: Matrix = identityMatrix();
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

export interface Segment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/** @private */
export interface Intersection {
    enabled: boolean;
    intersectPt: PointModel;
}
/** @private */
export interface Info {
    ctrlKey?: boolean;
    shiftKey?: boolean;
}