import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { PointModel, PathElement, Rect, DrawingElement, Point, Size, RotateTransform, TextElement, randomId, Matrix, identityMatrix, rotateMatrix, transformPointByMatrix, DecoratorShapes, Intersection, Segment, intersect3 } from '@syncfusion/ej2-drawings';
import { setElementStype, findPointsLength } from './drawing-util';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MeasureAnnotation, PdfViewer } from '../index';

/**
 * @private
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel[]} points - Specified the annotation points.
 * @returns {PointModel[]} - Returns the annotation points model array.
 */
export function getConnectorPoints(obj: PdfAnnotationBaseModel, points?: PointModel[]): PointModel[] {
    points = obj.vertexPoints;
    const newPoints: PointModel[] = points.slice(0);
    if (newPoints && newPoints.length > 0) {
        obj.sourcePoint = newPoints[0];
        obj.targetPoint = newPoints[newPoints.length - 1];
    }
    return newPoints;
}
/**
 * @private
 * @param {PdfAnnotationBaseModel} connector - Specified the annotation connector model.
 * @param {PointModel[]} points - Specified the annotation points.
 * @returns {string} - Returns the annotation path value.
 */
export function getSegmentPath(connector: PdfAnnotationBaseModel, points: PointModel[]): string {
    let path: string = ''; let getPt: PointModel;
    let pts: PointModel[] = [];
    let j: number = 0;
    while (j < points.length) {
        pts.push({ x: points[j].x, y: points[j].y });
        j++;
    }
    pts = clipDecorators(connector, pts);
    for (let k: number = 0; k < pts.length; k++) {
        getPt = pts[k];
        if (k === 0) {
            path = 'M' + getPt.x + ' ' + getPt.y;
        }
        if (k > 0) {
            path += ' ' + 'L' + getPt.x + ' ' + getPt.y;
        }
    }
    return path;
}


/**
 * @private
 * @param {PdfAnnotationBaseModel} connector - Specified the annotation connector model.
 * @param {PointModel[]} points - Specified the annotation points.
 * @param {PathElement} element - Specified the annotation element.
 * @returns {PathElement} - Returns the annotation path element.
 */
export function updateSegmentElement(connector: PdfAnnotationBaseModel, points: PointModel[], element: PathElement): PathElement {
    let bounds: Rect = new Rect();
    const segmentPath: string = getSegmentPath(connector, points);
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

/**
 * @private
 * @param {PdfAnnotationBaseModel} connector - Specified the annotation connector model.
 * @param {PathElement} segmentElement - Specified the annotation segment element.
 * @returns {PathElement} - Returns the annotation path element.
 */
export function getSegmentElement(connector: PdfAnnotationBaseModel, segmentElement: PathElement): PathElement {
    let points: PointModel[] = [];
    points = getConnectorPoints(connector);
    segmentElement.staticSize = true;
    segmentElement = updateSegmentElement(connector, points, segmentElement);
    setElementStype(connector, segmentElement);
    return segmentElement;
}

/**
 * @private
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {DrawingElement} element - Specified the annotation drawing element.
 * @param {PointModel} pt - Specified the annotation point.
 * @param {PointModel} adjacentPoint - Specified the annotation adjacent point.
 * @param {boolean} isSource - Specified the is source value or not.
 * @returns {void}
 */
export function updateDecoratorElement(
    obj: PdfAnnotationBaseModel, element: DrawingElement, pt: PointModel, adjacentPoint: PointModel, isSource: boolean): void {
    element.offsetX = pt.x; element.offsetY = pt.y;
    const angle: number = Point.findAngle(pt, adjacentPoint);
    const getPath: string = getDecoratorShape(isSource ? obj.sourceDecoraterShapes : obj.taregetDecoraterShapes);
    let thickness: number = 0;
    let size: Size;
    if (obj.shapeAnnotationType === 'LineWidthArrowHead') {
        thickness = obj.thickness;
        size = new Size(thickness * 12, thickness * 12);
    } else {
        thickness = obj.thickness <= 5 ? 5 : obj.thickness;
        size = new Size(thickness * 2, thickness * 2);
    }
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

/**
 * @private
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel} offsetPoint - Specified the annotation offset point.
 * @param {PointModel} adjacentPoint - Specified the annotation adjacent point.
 * @param {boolean} isSource - Specified the is source value or not.
 * @returns {PathElement} - Returns the annotation path element.
 */
export function getDecoratorElement(
    obj: PdfAnnotationBaseModel, offsetPoint: PointModel, adjacentPoint: PointModel,
    isSource: boolean)
    :
    PathElement {
    const decEle: PathElement = new PathElement();
    updateDecoratorElement(obj, decEle, offsetPoint, adjacentPoint, isSource);
    return decEle;
}

/**
 * @private
 * @param {PdfAnnotationBaseModel} connector - Specified the annotation object.
 * @param {PointModel[]} pts - Specified the annotation point model array.
 * @returns {PointModel[]} - Returns the annotation point model array.
 */
export function clipDecorators(connector: PdfAnnotationBaseModel, pts: PointModel[]): PointModel[] {
    pts[0] = clipDecorator(connector, pts, true);
    pts[pts.length - 1] = clipDecorator(connector, pts, false);
    return pts;
}

/**
 * @private
 * @param {PdfAnnotationBaseModel} connector - Specified the annotation connector object.
 * @param {PointModel[]} points - Specified the annotation offset point.
 * @param {boolean} isSource - Specified the is source value or not.
 * @returns {PointModel} - Returns the annotation point model.
 */
export function clipDecorator(connector: PdfAnnotationBaseModel, points: PointModel[], isSource: boolean): PointModel {
    let point: PointModel = { x: 0, y: 0 };
    let start: PointModel = { x: 0, y: 0 };
    let end: PointModel = { x: 0, y: 0 };
    const length: number = points.length;
    start = !isSource ? points[length - 1] : points[0];
    end = !isSource ? points[length - 2] : points[1];
    let len: number = Point.distancePoints(start, end);
    len = (len === 0) ? 1 : len;
    const width: number = connector.thickness;
    point.x = (Math.round(start.x + width * (end.x - start.x) / len));
    point.y = (Math.round(start.y + width * (end.y - start.y) / len));
    const strokeWidth: number = 1;
    point = Point.adjustPoint(point, end, true, (strokeWidth / 2));
    return point;
}
/**
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel[]} points - Specified the annotation point model array.
 * @param {MeasureAnnotation} measure - Specified the measure annotation object.
 * @param {PdfViewer} pdfviewer - Specified the pdfviewer element.
 * @hidden
 * @returns {TextElement[]} - Returns the text element collections.
 */
// eslint-disable-next-line max-len
export function initDistanceLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation, pdfviewer: PdfViewer): TextElement[] {
    const labels: TextElement[] = [];
    const angle: number = Point.findAngle(points[0], points[1]);
    const textele: TextElement = textElement(obj, angle);
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
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel[]} points - Specified the annotation point model array.
 * @param {MeasureAnnotation} measure - Specified the measure annotation object.
 * @hidden
 * @returns {string} - Returns the distance value.
 */
export function updateDistanceLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation): string {
    let distance: string;
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        const textElement: TextElement = (obj.wrapper.children[i] as TextElement);
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
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {MeasureAnnotation} measure - Specified the measure annotation object.
 * @hidden
 * @returns {string} - Returns the radius label value.
 */
export function updateRadiusLabel(obj: PdfAnnotationBaseModel, measure: MeasureAnnotation): string {
    let radius: string;
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        const textElement: TextElement = (obj.wrapper.children[i] as TextElement);
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
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel[]} points - Specified the annotation point model array.
 * @param {MeasureAnnotation} measure - Specified the measure annotation object.
 * @param {PdfViewer} pdfviewer - Specified the pdfviewer element.
 * @hidden
 * @returns {TextElement[]} - Returns the text element collections.
 */
// eslint-disable-next-line max-len
export function initPerimeterLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation, pdfviewer: PdfViewer): TextElement[] {
    const labels: TextElement[] = [];
    const angle: number = Point.findAngle(points[0], points[1]);
    const textele: TextElement = textElement(obj, angle);
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
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel[]} points - Specified the annotation point model array.
 * @param {MeasureAnnotation} measure - Specified the measure annotation object.
 * @hidden
 * @returns {string} - Returns the perimeter label value.
 */
export function updatePerimeterLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation): string {
    let perimeter: string;
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        const textElement: TextElement = (obj.wrapper.children[i] as TextElement);
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
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @hidden
 * @returns {void}
 */
export function removePerimeterLabel(obj: PdfAnnotationBaseModel): void {
    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
        const textElement: TextElement = (obj.wrapper.children[i] as TextElement);
        if (textElement && !isNullOrUndefined(textElement.content)) {
            obj.wrapper.children.splice(i, 1);
        }
    }
}

/**
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @hidden
 * @returns {void}
 */
export function updateCalibrateLabel(obj: PdfAnnotationBaseModel): void {
    if (obj.wrapper && obj.wrapper.children) {
        for (let i: number = 0; i < obj.wrapper.children.length; i++) {
            const textElement: TextElement = (obj.wrapper.children[i] as TextElement);
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
 *
 * @param {PointModel[]} collection - Specified the polygon annotaion points collection.
 * @hidden
 * @returns {string} - Returns the polygon annotation path.
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
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {number} angle - Specified the annotaion rotation angle.
 * @hidden
 * @returns {TextElement} - Returns the annotation text element.
 */
export function textElement(obj: PdfAnnotationBaseModel, angle: number): TextElement {
    const textele: TextElement = new TextElement();
    setElementStype(obj, textele);
    textele.style.fill = 'transparent';
    textele.id = randomId();
    textele.horizontalAlignment = 'Center';
    textele.rotateValue = { y: 10, angle: angle };
    textele.verticalAlignment = 'Top';
    textele.relativeMode = 'Object';
    textele.setOffsetWithRespectToBounds(.5, .5, 'Absolute');
    // eslint-disable-next-line
    textele.offsetX;
    textele.style.textWrapping = 'NoWrap';
    return textele;
}
/**
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel[]} points - Specified the annotaion leader points.
 * @hidden
 * @returns {PathElement[]} - Returns the annotation path elements.
 */
export function initLeaders(obj: PdfAnnotationBaseModel, points: PointModel[]): PathElement[] {
    const leaders: PathElement[] = [];
    let leader: PathElement = initLeader(obj, points[0], points[1]);
    leaders.push(leader);
    leader = initLeader(obj, points[1], points[0], true);
    leaders.push(leader);
    return leaders;
}
/**
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {PointModel} point1 - Specified the annotaion leader point1.
 * @param {PointModel} point2 - Specified the annotaion leader point2.
 * @param {boolean} isSecondLeader - Specified the is second leader or not.
 * @hidden
 * @returns {PathElement} - Returns the annotation path element.
 */
export function initLeader(
    obj: PdfAnnotationBaseModel, point1: PointModel, point2: PointModel, isSecondLeader?: boolean): PathElement {
    const element: PathElement = new PathElement();
    element.offsetX = point1.x; element.offsetY = point1.y;
    const angle: number = Point.findAngle(point1, point2);
    const center: PointModel = { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 };
    let matrix: Matrix = identityMatrix();
    rotateMatrix(matrix, 0 - angle, center.x, center.y);
    let rotatedPoint: PointModel = transformPointByMatrix(matrix, point1);
    const newPoint1: PointModel = { x: rotatedPoint.x, y: rotatedPoint.y - obj.leaderHeight };
    matrix = identityMatrix();
    rotateMatrix(matrix, angle, element.offsetX, element.offsetY);
    rotatedPoint = transformPointByMatrix(matrix, newPoint1);
    const finalPoint: PointModel = { x: point1.x, y: point1.y };

    element.offsetX = finalPoint.x; element.offsetY = finalPoint.y;
    element.transform = RotateTransform.Self;
    const getPath: string = 'M' + point1.x + ',' + point1.y + ',L' + rotatedPoint.x + ',' + rotatedPoint.y + 'Z';
    const size: Size = new Size(0, obj.leaderHeight);
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
/**
 * @private
 * @param {PdfAnnotationBaseModel} connector - Specified the annotation connector object.
 * @param {PointModel} reference - Specified the pointer reference value.
 * @returns {boolean} - Returns true or false.
 */
export function isPointOverConnector(connector: PdfAnnotationBaseModel, reference: PointModel): boolean {
    const vertexPoints: PointModel[] = connector.vertexPoints;
    if (!isNullOrUndefined(vertexPoints)) {
        for (let i: number = 0; i < vertexPoints.length - 1; i++) {
            const start: PointModel = vertexPoints[i];
            const end: PointModel = vertexPoints[i + 1];
            const rect: Rect = Rect.toBounds([start, end]);
            rect.Inflate(10);
            if (rect.containsPoint(reference)) {
                const intersectinPt: PointModel = findNearestPoint(reference, start, end);
                const segment1: Segment = { x1: start.x, x2: end.x, y1: start.y, y2: end.y };
                const segment2: Segment = { x1: reference.x, x2: intersectinPt.x, y1: reference.y, y2: intersectinPt.y };
                const intersectDetails: Intersection = intersect3(segment1, segment2);
                if (intersectDetails.enabled) {
                    const distance: number = Point.findLength(reference, intersectDetails.intersectPt);
                    if (Math.abs(distance) < 10) {
                        return true;
                    }
                } else {
                    const rect: Rect = Rect.toBounds([reference, reference]);
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
    }
    return false;
}

/**
 * @param {PointModel} reference - Specified the pointer reference value.
 * @param {PointModel} start - Specified the pointer start value.
 * @param {PointModel} end - Specified the pointer end value.
 * @private
 * @returns {PointModel} - Returns annotation point model.
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
        x: (shortestPoint.x + r * Math.cos(vaAngle * Math.PI / 180)),
        y: (shortestPoint.y + r * Math.sin(vaAngle * Math.PI / 180))
    };
}

/**
 * @param {DecoratorShapes} shape - Specified the annotation decorator shapes.
 * @hidden
 * @returns {string} - Returns the annotation decorator shape value.
 */
export function getDecoratorShape(shape: DecoratorShapes ): string {
    // eslint-disable-next-line
    return (decoratorShapes as any)[shape];
}
const decoratorShapes: {} = {
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
