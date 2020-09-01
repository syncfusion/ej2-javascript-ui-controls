import { PdfAnnotationBaseModel } from './pdf-annotation-model';
// tslint:disable-next-line:max-line-length
import { PointModel, PathElement, Rect, DrawingElement, Point, Size, RotateTransform, TextElement, randomId, Matrix, identityMatrix, rotateMatrix, transformPointByMatrix, DecoratorShapes, Intersection, Segment, intersect3 } from '@syncfusion/ej2-drawings';
import { setElementStype, findPointsLength } from './drawing-util';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MeasureAnnotation, PdfViewer } from '../index';

/** @private */
export function getConnectorPoints(obj: PdfAnnotationBaseModel, points?: PointModel[]): PointModel[] {
    let width: number = Math.abs(obj.sourcePoint.x - obj.targetPoint.x);
    let height: number = Math.abs(obj.sourcePoint.y - obj.targetPoint.y);
    points = obj.vertexPoints;
    let newPoints: PointModel[] = points.slice(0);
    if (newPoints && newPoints.length > 0) {
        obj.sourcePoint = newPoints[0];
        obj.targetPoint = newPoints[newPoints.length - 1];
    }
    return newPoints;
}
/** @private */
export function getSegmentPath(connector: PdfAnnotationBaseModel, points: PointModel[]): string {
    let path: string = ''; let getPt: PointModel;
    let end: PointModel; let st: PointModel;
    let pts: PointModel[] = [];
    let j: number = 0;
    while (j < points.length) {
        pts.push({ x: points[j].x, y: points[j].y });
        j++;
    }
    pts = clipDecorators(connector, pts);
    for (let k: number = 0; k < pts.length; k++) {
        getPt = pts[k];
        if (k === 0) { path = 'M' + getPt.x + ' ' + getPt.y; }
        if (k > 0) {
            path += ' ' + 'L' + getPt.x + ' ' + getPt.y;
        }
    }
    return path;
}


/** @private */
export function updateSegmentElement(connector: PdfAnnotationBaseModel, points: PointModel[], element: PathElement): PathElement {
    let segmentPath: string; let bounds: Rect = new Rect();
    let point: PointModel[];
    segmentPath = getSegmentPath(connector, points);
    bounds = Rect.toBounds(points);
    element.width = bounds.width;
    element.height = bounds.height;
    element.offsetX = bounds.x + element.width / 2;
    element.offsetY = bounds.y + element.height / 2;
    element.data = segmentPath;
    if (connector.wrapper) {
        connector.wrapper.offsetX = element.offsetX;
        connector.wrapper.offsetY = element.offsetY;
        connector.wrapper.width = bounds.width;
        connector.wrapper.height = bounds.height;
    }
    return element;
}

/** @private */
export function getSegmentElement(connector: PdfAnnotationBaseModel, segmentElement: PathElement): PathElement {
    let bounds: Rect; let segmentPath: string;
    let points: PointModel[] = [];
    points = getConnectorPoints(connector);
    segmentElement.staticSize = true;
    segmentElement = updateSegmentElement(connector, points, segmentElement);
    setElementStype(connector, segmentElement);
    return segmentElement;
}

/** @private */
export function updateDecoratorElement(
    obj: PdfAnnotationBaseModel, element: DrawingElement, pt: PointModel, adjacentPoint: PointModel, isSource: Boolean): void {
    let getPath: string; let angle: number;
    element.offsetX = pt.x; element.offsetY = pt.y;
    angle = Point.findAngle(pt, adjacentPoint);
    let thickness: number = obj.thickness <= 5 ? 5 : obj.thickness;
    getPath = getDecoratorShape(isSource ? obj.sourceDecoraterShapes : obj.taregetDecoraterShapes);
    let size: Size = new Size(thickness * 2, thickness * 2);
    element.transform = RotateTransform.Self;
    setElementStype(obj, element);
    element.style.fill = (obj.fillColor !== 'tranparent') ? obj.fillColor : 'white';
    element.rotateAngle = angle;
    (element as PathElement).data = getPath;
    (element as PathElement).canMeasurePath = true;
    element.width = size.width;
    element.height = size.height;
    if (obj.sourceDecoraterShapes === 'Butt') {
        element.width = size.width - 10;
        element.height = size.height + 10;
    }

}

/** @private */
export function getDecoratorElement(
    obj: PdfAnnotationBaseModel, offsetPoint: PointModel, adjacentPoint: PointModel,
    isSource: Boolean)
    :
    PathElement {
    let decEle: PathElement = new PathElement();
    let getPath: string; let angle: number;
    updateDecoratorElement(obj, decEle, offsetPoint, adjacentPoint, isSource);
    return decEle;
}

/** @private */
export function clipDecorators(connector: PdfAnnotationBaseModel, pts: PointModel[]): PointModel[] {
    pts[0] = clipDecorator(connector, pts, true);
    pts[pts.length - 1] = clipDecorator(connector, pts, false);
    return pts;
}

/** @private */
export function clipDecorator(connector: PdfAnnotationBaseModel, points: PointModel[], isSource: boolean): PointModel {
    let point: PointModel = { x: 0, y: 0 };
    let start: PointModel = { x: 0, y: 0 };
    let end: PointModel = { x: 0, y: 0 };
    let length: number = points.length;
    start = !isSource ? points[length - 1] : points[0];
    end = !isSource ? points[length - 2] : points[1];
    let len: number = Point.distancePoints(start, end);
    len = (len === 0) ? 1 : len;
    let width: number = connector.thickness;
    point.x = (Math.round(start.x + width * (end.x - start.x) / len));
    point.y = (Math.round(start.y + width * (end.y - start.y) / len));
    let strokeWidth: number = 1;
    point = Point.adjustPoint(point, end, true, (strokeWidth / 2));
    return point;
}
/**
 * @hidden
 */
// tslint:disable-next-line:max-line-length
export function initDistanceLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation, pdfviewer: PdfViewer): TextElement[] {
    let labels: TextElement[] = [];
    let textele: TextElement;
    let angle: number = Point.findAngle(points[0], points[1]);
    textele = textElement(obj, angle);
    if (!pdfviewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
        textele.content = obj.notes;
    } else {
        textele.content = measure.setConversion(findPointsLength([points[0], points[1]]) * measure.pixelToPointFactor, obj);
    }
    textele.rotateValue = { y: -10, angle: angle };
    if (obj.enableShapeLabel === true) {
        textele.style.strokeColor = obj.labelBorderColor;
        textele.style.fill = obj.labelFillColor;
        textele.style.fontSize = obj.fontSize;
        textele.style.color = obj.fontColor;
        textele.style.fontFamily = obj.fontFamily;
    }
    labels.push(textele);
    return labels;
}

/**
 * @hidden
 */
export function updateDistanceLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation): string {
    let distance: string;
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        let textElement: TextElement = (obj.wrapper.children[i] as TextElement);
        if (textElement && !isNullOrUndefined(textElement.content)) {
            distance = measure.setConversion(findPointsLength([points[0], points[1]]) * measure.pixelToPointFactor, obj);
            textElement.content = distance;
            textElement.childNodes[0].text = textElement.content;
            textElement.refreshTextElement();
        }
    }
    return distance;
}

/**
 * @hidden
 */
export function updateRadiusLabel(obj: PdfAnnotationBaseModel, measure: MeasureAnnotation): string {
    let radius: string;
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        let textElement: TextElement = (obj.wrapper.children[i] as TextElement);
        if (textElement && !isNullOrUndefined(textElement.content)) {
            radius = measure.setConversion((obj.bounds.width / 2) * measure.pixelToPointFactor, obj);
            textElement.content = radius;
            if (textElement.childNodes.length === 2) {
                textElement.childNodes[0].text = radius;
                textElement.childNodes.splice(textElement.childNodes.length - 1, 1);
            } else {
                textElement.childNodes[0].text = radius;
            }
            textElement.refreshTextElement();
        }
    }
    return radius;
}

/**
 * @hidden
 */
// tslint:disable-next-line:max-line-length
export function initPerimeterLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation, pdfviewer: PdfViewer): TextElement[] {
    let labels: TextElement[] = [];
    let textele: TextElement;
    let angle: number = Point.findAngle(points[0], points[1]);
    textele = textElement(obj, angle);
    if (!pdfviewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
        textele.content = obj.notes;
    } else {
        textele.content = measure.calculatePerimeter(obj);
    }
    if (obj.enableShapeLabel === true) {
        textele.style.strokeColor = obj.labelBorderColor;
        textele.style.fill = obj.labelFillColor;
        textele.style.fontSize = obj.fontSize;
        textele.style.color = obj.fontColor;
        textele.style.fontFamily = obj.fontFamily;
    }
    textele.rotateValue = { y: -10, angle: angle };
    labels.push(textele);
    return labels;
}

/**
 * @hidden
 */
export function updatePerimeterLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation): string {
    let perimeter: string;
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        let textElement: TextElement = (obj.wrapper.children[i] as TextElement);
        if (textElement && !isNullOrUndefined(textElement.content)) {
            perimeter = measure.calculatePerimeter(obj);
            textElement.content = perimeter;
            textElement.childNodes[0].text = textElement.content;
            textElement.refreshTextElement();
        }
    }
    return perimeter;
}

/**
 * @hidden
 */
export function removePerimeterLabel(obj: PdfAnnotationBaseModel): void {
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        let textElement: TextElement = (obj.wrapper.children[i] as TextElement);
        if (textElement && !isNullOrUndefined(textElement.content)) {
            obj.wrapper.children.splice(i, 1);
        }
    }
}

/**
 * @hidden
 */
export function updateCalibrateLabel(obj: PdfAnnotationBaseModel): void {
    if (obj.wrapper && obj.wrapper.children) {
        for (let i: number = 0; i < obj.wrapper.children.length; i++) {
            let textElement: TextElement = (obj.wrapper.children[i] as TextElement);
            if (textElement && !isNullOrUndefined(textElement.content)) {
                textElement.content = obj.notes;
                textElement.childNodes[0].text = textElement.content;
                textElement.refreshTextElement();
            }
        }
    }
}

/**
 * Used to find the path for polygon shapes
 * @hidden
 */
export function getPolygonPath(collection: PointModel[]): string {
    let path: string = '';
    let seg: PointModel;
    path = 'M' + collection[0].x + ' ' + collection[0].y;
    let i: number;
    for (i = 1; i < collection.length; i++) {
        seg = collection[i];
        path += 'L' + seg.x + ' ' + seg.y;
    }
    path += 'Z';
    return path;
}
/**
 * @hidden
 */
export function textElement(obj: PdfAnnotationBaseModel, angle: number): TextElement {
    let textele: TextElement = new TextElement();
    setElementStype(obj, textele);
    textele.style.fill = 'transparent';
    textele.id = randomId();
    textele.horizontalAlignment = 'Center';
    textele.rotateValue = { y: 10, angle: angle };
    textele.verticalAlignment = 'Top';
    textele.relativeMode = 'Object';
    textele.setOffsetWithRespectToBounds(.5, .5, 'Absolute');
    // tslint:disable-next-line
    textele.offsetX;
    textele.style.textWrapping = 'NoWrap';
    return textele;
}
/**
 * @hidden
 */
export function initLeaders(obj: PdfAnnotationBaseModel, points: PointModel[]): PathElement[] {
    let leaders: PathElement[] = [];
    let leader: PathElement = initLeader(obj, points[0], points[1]);
    leaders.push(leader);
    leader = initLeader(obj, points[1], points[0], true);
    leaders.push(leader);
    return leaders;
}
/**
 * @hidden
 */
export function initLeader(
    obj: PdfAnnotationBaseModel, point1: PointModel, point2: PointModel, isSecondLeader?: boolean): PathElement {
    let element: PathElement = new PathElement();
    element.offsetX = point1.x; element.offsetY = point1.y;
    let angle: number = Point.findAngle(point1, point2);
    let center: PointModel = { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 };
    let getPath: string;
    let matrix: Matrix = identityMatrix();
    rotateMatrix(matrix, 0 - angle, center.x, center.y);
    let rotatedPoint: PointModel = transformPointByMatrix(matrix, point1);
    let newPoint1: PointModel = { x: rotatedPoint.x, y: rotatedPoint.y - obj.leaderHeight };
    matrix = identityMatrix();
    rotateMatrix(matrix, angle, element.offsetX, element.offsetY);
    rotatedPoint = transformPointByMatrix(matrix, newPoint1);
    let finalPoint: PointModel = { x: point1.x, y: point1.y };

    element.offsetX = finalPoint.x; element.offsetY = finalPoint.y;
    element.transform = RotateTransform.Self;
    getPath = 'M' + point1.x + ',' + point1.y + ',L' + rotatedPoint.x + ',' + rotatedPoint.y + 'Z';
    let size: Size = new Size(0, obj.leaderHeight);
    element.pivot.x = .5;
    if (isSecondLeader) {
        element.id = 'leader2_' + randomId();

        element.pivot.y = 0;
    } else {
        element.id = 'leader1_' + randomId();

        element.pivot.y = 1;
    }
    setElementStype(obj, element);
    element.rotateAngle = angle;
    (element as PathElement).data = getPath;
    (element as PathElement).canMeasurePath = true;
    element.width = size.width;
    element.height = size.height;
    return element;
}
/** @private */
export function isPointOverConnector(connector: PdfAnnotationBaseModel, reference: PointModel): boolean {
    let vertexPoints: PointModel[] = connector.vertexPoints;
    for (let i: number = 0; i < vertexPoints.length - 1; i++) {
        let start: PointModel = vertexPoints[i];
        let end: PointModel = vertexPoints[i + 1];
        let rect: Rect = Rect.toBounds([start, end]);
        rect.Inflate(10);
        if (rect.containsPoint(reference)) {
            let intersectinPt: PointModel = findNearestPoint(reference, start, end);
            let segment1: Segment = { x1: start.x, x2: end.x, y1: start.y, y2: end.y };
            let segment2: Segment = { x1: reference.x, x2: intersectinPt.x, y1: reference.y, y2: intersectinPt.y };
            let intersectDetails: Intersection = intersect3(segment1, segment2);
            if (intersectDetails.enabled) {
                let distance: number = Point.findLength(reference, intersectDetails.intersectPt);
                if (Math.abs(distance) < 10) {
                    return true;
                }
            } else {
                let rect: Rect = Rect.toBounds([reference, reference]);
                rect.Inflate(3);
                if (rect.containsPoint(start) || rect.containsPoint(end)) {
                    return true;
                }
            }
            if (Point.equals(reference, intersectinPt)) {
                return true;
            }
        }
    }
    return false;
}

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
        x: (shortestPoint.x + r * Math.cos(vaAngle * Math.PI / 180)),
        y: (shortestPoint.y + r * Math.sin(vaAngle * Math.PI / 180))
    };
}

/**
 * @hidden
 */
export function getDecoratorShape(shape: DecoratorShapes, ): string {
    // tslint:disable-next-line
    return (decoratorShapes as any)[shape];
}
let decoratorShapes: {} = {
    'OpenArrow': 'M15.9,23 L5,16 L15.9,9 L17,10.7 L8.7,16 L17,21.3Z',
    'Square': 'M0,0 L10,0 L10,10 L0,10 z',
    'Fletch': 'M14.8,10c0,0-3.5,6,0.2,12c0,0-2.5-6-10.9-6C4.1,16,11.3,16,14.8,10z',
    'OpenFetch': 'M6,17c-0.6,0-1-0.4-1-1s0.4-1,1-1c10.9,0,11-5,11-5' +
        'c0-0.6,0.4-1,1-1s1,0.4,1,1C19,10.3,18.9,17,6,17C6,17,6,17,6,17z ' +
        'M18,23c-0.5,0-1-0.4-1-1c0-0.2-0.3-5-11-5c-0.6,0-1-0.5-1-1s0.4-1,1-1c0,0,0,0,0,0' +
        'c12.9,0,13,6.7,13,7    C19,22.6,18.6,23,18,23z',
    'IndentedArrow': 'M17,10c0,0-4.5,5.5,0,12L5,16L17,10z',
    'OutdentedArrow': 'M14.6,10c0,0,5.4,6,0,12L5,16L14.6,10z',
    'DoubleArrow': 'M19,10 L19,22 L13,16Z M12,10 L12,22 L6,16Z',
    'Arrow': 'M15,10 L15,22 L5,16Z',
    'Diamond': 'M12,23l-7-7l7-7l6.9,7L12,23z',
    'Circle': 'M0,50 A50,50,0 1 1 100,50 A50,50,0 1 1 0,50 Z',
    'Butt': 'M0,0 L0,90'
};
