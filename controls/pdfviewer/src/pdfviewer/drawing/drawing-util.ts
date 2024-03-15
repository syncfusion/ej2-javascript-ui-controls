import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';
import { DrawingElement, TextElement, PointModel, Point, BaseAttributes, rotateMatrix, identityMatrix, transformPointByMatrix, Matrix } from '@syncfusion/ej2-drawings';
import { Transforms } from './drawing';
import { getValue } from '@syncfusion/ej2-base';
/**
 * @param {PdfAnnotationBaseModel} obj - Specified the shape annotation object.
 * @hidden
 * @returns {void}
 */
export function isLineShapes(obj: PdfAnnotationBaseModel): boolean {
    if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead'
        || obj.shapeAnnotationType === 'Distance' || obj.shapeAnnotationType === 'Polygon') {
        return true;
    }
    return false;
}
/**
 * @param {PdfAnnotationBaseModel | PdfFormFieldBaseModel} obj - Specified the annotation or form fields object.
 * @param {DrawingElement} element - Specified the annotation drawing element.
 * @returns {void}
 * @hidden
 */
export function setElementStype(obj: PdfAnnotationBaseModel | PdfFormFieldBaseModel, element: DrawingElement): void {
    if (obj && element) {
        if ((obj as PdfFormFieldBaseModel).formFieldAnnotationType) {
            if (obj.id.indexOf('diagram_helper') !== -1) {
                element.style.fill = 'transparent';
                element.style.strokeWidth = 1;
                element.style.strokeDashArray = (obj as PdfAnnotationBaseModel).borderDashArray;
            } else {
                element.style.fill = 'transparent';
                element.style.strokeWidth = 0;
            }
        } else {
            const fillColor: string = ((obj as PdfAnnotationBaseModel).fillColor === '#ffffff00' ? 'transparent' : (obj as PdfAnnotationBaseModel).fillColor);
            element.style.fill = fillColor ? fillColor : 'white';
            // eslint-disable-next-line max-len
            element.style.strokeColor = (obj as PdfAnnotationBaseModel).strokeColor ? (obj as PdfAnnotationBaseModel).strokeColor : (obj as PdfFormFieldBaseModel).borderColor;
            // eslint-disable-next-line max-len
            (element as TextElement).style.color = (obj as PdfAnnotationBaseModel).strokeColor ? (obj as PdfAnnotationBaseModel).strokeColor : (obj as PdfFormFieldBaseModel).borderColor;
            element.style.strokeWidth = obj.thickness;
            if ((obj as PdfAnnotationBaseModel).shapeAnnotationType === 'Image' || (obj as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureText' || (obj as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureImage' ) {
                element.style.strokeWidth = 0;
            }
            element.style.strokeDashArray = (obj as PdfAnnotationBaseModel).borderDashArray;
            element.style.opacity = obj.opacity;
        }
    }
}
/**
 * @param {PointModel[]} points - Specified the annotation points value.
 * @hidden
 * @returns {number} - Returns the points length.
 */
export function findPointsLength(points: PointModel[]): number {
    let length: number = 0;
    for (let i: number = 0; i < points.length - 1; i++) {
        length += Point.findLength(points[parseInt(i.toString(), 10)], points[i + 1]);
    }
    return length;
}

/**
 * @param {PointModel[]} points - Specified the annotation points value.
 * @hidden
 * @returns {number} - Returns the points length.
 */
export function findPerimeterLength(points: PointModel[]): number {
    const length: number = Point.getLengthFromListOfPoints(points);
    return length;
}

/**
 * @private
 * @param {DrawingElement} element - Specified the drawing element.
 * @param {Transforms} transform - Specified the transform value.
 * @returns {BaseAttributes} - Returns the base attributes value.
 */
export function getBaseShapeAttributes(element: DrawingElement, transform?: Transforms): BaseAttributes {
    const baseShapeAttributes: BaseAttributes = {
        width: element.actualSize.width, height: element.actualSize.height,
        x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
        y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
        angle: element.rotateAngle + element.parentTransform, fill: element.style.fill, stroke: element.style.strokeColor,
        pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 1,
        opacity: element.style.opacity, dashArray: element.style.strokeDashArray || '',
        visible: element.visible, id: element.id
    };
    if (transform) {
        baseShapeAttributes.x += transform.tx;
        baseShapeAttributes.y += transform.ty;
    }
    return baseShapeAttributes;
}

/**
 * Get function
 *
 * @private
 * @param {Function | string} value - Type of the function.
 * @returns {Function} - Returns the function.
 */
export function getFunction(value: Function | string): Function {
    if (value !== undefined) {
        if (typeof value === 'string') {
            value = getValue(value, window);
        }
    }
    return value as Function;
}

/**
 * @private
 * @param {any} obj - Specified the annotation object.
 * @param {Function | string} additionalProp - Specified the annotation additional properties.
 * @param {string} key - Specified the annotation key value.
 * @returns {Object} - Returns the cloned object.
 */
// eslint-disable-next-line
export function cloneObject(obj: any, additionalProp?: Function | string, key?: string): Object {
    // eslint-disable-next-line
    let newObject: any = {};
    const keys: string = 'properties';
    const prop: string = 'propName';
    if (obj) {
        key = obj[`${prop}`];
        const sourceObject: Object = obj[`${keys}`] || obj;
        let properties: string[] = [];
        properties = properties.concat(Object.keys(sourceObject));
        let customProperties: string[] = [];
        properties.push('version');
        if (key) {
            const propAdditional: Function = getFunction(additionalProp);
            if (propAdditional) {
                customProperties = propAdditional(key);
            } else {
                customProperties = [];
            }
            properties = properties.concat(customProperties);
        }
        const internalProp: string[] = getInternalProperties(key);
        properties = properties.concat(internalProp);
        for (const property of properties) {
            if (property !== 'historyManager') {
                if (property !== 'wrapper') {
                    // eslint-disable-next-line
                    const isEventEmmitter: boolean = obj[property] && (obj as any).hasOwnProperty('observers') ? true : false;
                    if (!isEventEmmitter) {
                        if (obj[`${property}`] instanceof Array) {
                            newObject[`${property}`] = cloneArray(
                                (internalProp.indexOf(property) === -1 && obj[`${key}`]) ? obj[`${key}`][`${property}`] : obj[`${property}`],
                                additionalProp, property);
                        } else if (obj[`${property}`] instanceof Array === false && obj[`${property}`] instanceof HTMLElement) {
                            newObject[`${property}`] = obj[`${property}`].cloneNode(true).innerHtml;
                        } else if (obj[`${property}`] instanceof Array === false && obj[`${property}`] instanceof Object && property !== 'template') {
                            newObject[`${property}`] = cloneObject(
                                (internalProp.indexOf(property) === -1 && obj[`${key}`]) ? obj[`${key}`][`${property}`] : obj[`${property}`]);
                        } else {
                            newObject[`${property}`] = obj[`${property}`];
                        }
                    }
                } else {
                    if (obj[`${property}`]) {
                        newObject[`${property}`] = {
                            actualSize: {
                                width: obj[`${property}`].actualSize.width, height: obj[`${property}`].actualSize.height
                            }, offsetX: obj[`${property}`].offsetX, offsetY: obj[`${property}`].offsetY
                        };
                    }
                }
            }
        }
    }
    return newObject;
}

/**
 * @private
 * @param {Object[]} sourceArray - Specified the annotation source collections.
 * @param {Function | string} additionalProp - Specified the annotation additional properties.
 * @param {string} key - Specified the annotation key value.
 * @returns {Object[]} - Returns the cloned object array.
 */
export function cloneArray(sourceArray: Object[], additionalProp?: Function | string, key?: string): Object[] {
    let clonedArray: Object[];
    if (sourceArray) {
        clonedArray = [];
        for (let i: number = 0; i < sourceArray.length; i++) {
            if (sourceArray[parseInt(i.toString(), 10)] instanceof Array) {
                clonedArray.push(sourceArray[parseInt(i.toString(), 10)]);
            } else if (sourceArray[parseInt(i.toString(), 10)] instanceof Object) {
                clonedArray.push(cloneObject(sourceArray[parseInt(i.toString(), 10)], additionalProp, key));
            } else {
                clonedArray.push(sourceArray[parseInt(i.toString(), 10)]);
            }
        }
    }
    return clonedArray;
}

/**
 * @private
 * @param {string} propName - Specified the annotation property name.
 * @returns {string[]} - Returns the internal properties.
 */
export function getInternalProperties(propName: string): string[] {
    switch (propName) {
    case 'nodes':
    case 'children':
        return ['inEdges', 'outEdges', 'parentId', 'processId', 'nodeId', 'umlIndex', 'isPhase', 'isLane'];
    case 'connectors':
        return ['parentId'];
    case 'annotation':
        return ['nodeId'];
    case 'annotations':
        return ['nodeId'];
    case 'shape':
        return ['hasHeader'];
    }
    return [];
}
/**
 * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
 * @param {string} position - Specified the annotation position.
 * @hidden
 * @returns {Leader} - Returns the leader value.
 */
export function isLeader(obj: PdfAnnotationBaseModel, position: string): Leader {
    let rotatedPoint: PointModel;
    if (obj.shapeAnnotationType === 'Distance') {
        let leaderCount: number = 0;
        let newPoint1: PointModel;
        for (let i: number = 0; i < obj.wrapper.children.length; i++) {
            const angle: number = Point.findAngle(obj.sourcePoint, obj.targetPoint);
            // eslint-disable-next-line
            let segment: any = obj.wrapper.children[i];
            if (segment.id.indexOf('leader') > -1) {
                let center: PointModel = obj.wrapper.children[0].bounds.center;
                if (leaderCount === 0) {
                    newPoint1 = { x: obj.sourcePoint.x, y: obj.sourcePoint.y - obj.leaderHeight };
                    center = obj.sourcePoint;
                } else {
                    newPoint1 = { x: obj.targetPoint.x, y: obj.targetPoint.y - obj.leaderHeight };
                    center = obj.targetPoint;
                }
                const matrix: Matrix = identityMatrix();
                rotateMatrix(matrix, angle, center.x, center.y);
                rotatedPoint = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                if (position === 'Leader' + leaderCount) {
                    return { leader: 'leader' + leaderCount, point: rotatedPoint };
                }
                leaderCount++;
            }
        }
    }
    return { leader: '', point: rotatedPoint };
}
/**
 * @hidden
 */
export interface Leader {
    leader: string
    point: PointModel
}
