/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { DiagramElement, Corners } from '../core/elements/diagram-element';
import { compile as baseTemplateComplier } from '@syncfusion/ej2-base';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { PointModel } from '../primitives/point-model';
import { Matrix, identityMatrix, transformPointByMatrix, rotateMatrix } from '../primitives/matrix';
import { TextAlign, TextWrap, WhiteSpace, TextDecoration } from '../enum/enum';
import { getValue } from '@syncfusion/ej2-base';
import { TextAttributes } from '../rendering/canvas-interface';
import { getChildNode, applyStyleAgainstCsp } from './dom-util';
import { Diagram } from '../diagram';
import { Node, BasicShape, Shape, Native, BpmnShape, BpmnActivity, BpmnTask, BpmnSubProcess } from '../objects/node';
import { IconShape } from '../objects/icon';
import { TextStyle, ShapeStyle, Margin } from '../core/appearance';
import { Port } from '../objects/port';
import { Annotation } from '../objects/annotation';
import { Connector, Decorator } from '../objects/connector';

/**
 * Implements the basic functionalities
 */

/**
 * Used to generate the random id \
 *
 * @returns { boolean }    Used to generate the random id .\
 *
 * @private
 */
export function randomId(): string {
    const chars: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let id: string = '';
    let num: number;
    for (let i: number = 0; i < 5; i++) {
        if ('crypto' in window && 'getRandomValues' in crypto) {
            const count: Uint16Array = new Uint16Array(1);
            // tslint:disable-next-line:no-any
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
 * Used to get the index value \
 *
 * @returns { boolean }    Used to get the index value .\
 * @param {Diagram} comp - provide the Diagram value.
 * @param {string} id - provide the id value.
 *
 * @private
 */
export function getIndex(comp: Diagram, id: string): number {
    if (comp.nodes && comp.nodes.length > 0) {
        for (let i: number = 0; i < comp.nodes.length; i++) {
            if (comp.nodes[i].id === id) {
                return i;
            }
        }
    }
    if (comp.connectors && comp.connectors.length > 0) {
        for (let i: number = 0; i < comp.connectors.length; i++) {
            if (comp.connectors[i].id === id) {
                return i;
            }
        }
    }
    return null;
}

/**
 * templateCompiler method\
 *
 * @returns { Function }    templateCompiler method .\
 * @param {string} template - provide the template value.
 *
 * @private
 */
export function templateCompiler(template: string): Function {
    if (template) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let e: Object;
        try {
            if (document.querySelectorAll(template).length) {
                return baseTemplateComplier(document.querySelector(template).innerHTML.trim());
            }
        } catch (e) {
            return baseTemplateComplier(template);
        }
    }
    return undefined;
}


/**
 * cornersPointsBeforeRotation method\
 *
 * @returns { Rect }    templateCompiler method .\
 * @param {DiagramElement} ele - provide the template value.
 *
 * @private
 */
export function cornersPointsBeforeRotation(ele: DiagramElement): Rect {
    let bounds: Rect = new Rect();
    const top: number = ele.offsetY - ele.actualSize.height * ele.pivot.y;
    const bottom: number = ele.offsetY + ele.actualSize.height * (1 - ele.pivot.y);
    const left: number = ele.offsetX - ele.actualSize.width * ele.pivot.x;
    const right: number = ele.offsetX + ele.actualSize.width * (1 - ele.pivot.x);
    const topLeft: PointModel = { x: left, y: top };
    //const topCenter: PointModel = { x: (left + right) / 2, y: top };
    const topRight: PointModel = { x: right, y: top };
    //const middleLeft: PointModel = { x: left, y: (top + bottom) / 2 };
    //const middleRight: PointModel = { x: right, y: (top + bottom) / 2 };
    const bottomLeft: PointModel = { x: left, y: bottom };
    //const bottomCenter: PointModel = { x: (left + right) / 2, y: bottom };
    const bottomRight: PointModel = { x: right, y: bottom };
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    return bounds;
}


/**
 * getBounds method\
 *
 * @returns { Rect }    getBounds method .\
 * @param {DiagramElement} element - provide the template value.
 *
 * @private
 */
export function getBounds(element: DiagramElement): Rect {
    let bounds: Rect = new Rect();
    //let corners: Rect;
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
 * updateCloneProp method\
 *
 * @returns { Rect }    updateCloneProp method .\
 * @param {DiagramElement} properties - provide the template value.
 * @param {DiagramElement} obj - provide the template value.
 *
 * @private
 */
function updateCloneProp(properties: string[], obj: Object): string[] {
    let prop: string[] = [];
    if (obj instanceof Node) {
        prop = ['width', 'height', 'offsetX', 'offsetY', 'container', 'visible', 'horizontalAlignment', 'verticalAlignment',
            'backgroundColor', 'borderColor', 'borderWidth', 'rotateAngle', 'minHeight', 'minWidth', 'maxHeight',
            'maxWidth', 'pivot', 'margin', 'flip', 'wrapper', 'constraints', 'style', 'annotations', 'ports', 'isExpanded', 'expandIcon'];
    } else if (obj instanceof Connector) {
        prop = ['constraints', 'sourcePadding', 'targetPadding', 'cornerRadius', 'flip', 'type', 'targetDecorator', 'sourceDecorator',
            'sourceID', 'shape', 'bridgeSpace', 'annotations', 'segments', 'hitPadding', 'tooltip', 'previewSize', 'dragSize', 'style',
            'sourcePortID', 'targetID', 'targetPortID', 'visible'];
    } else if (obj instanceof Decorator) {
        prop = ['height', 'width', 'shape', 'style', 'pivot', 'pathData'];
    } else if (obj instanceof Shape || obj instanceof IconShape) {
        prop.push('shape');
        if (obj instanceof BasicShape) {
            prop.push('cornerRadius');
        } else if (obj instanceof Text) {
            prop.push('margin');
        } else if (obj instanceof Image) {
            prop.push('align');
            prop.push('scale');
        } else if (obj instanceof Native) {
            prop.push('scale');
        } else if (obj instanceof BpmnShape) {
            prop.push('activity');
            prop.push('annotations');
        } else if (obj instanceof IconShape) {
            prop.push('borderColor');
            prop.push('borderWidth');
            prop.push('cornerRadius');
            prop.push('fill');
        }
    } else if (obj instanceof BpmnActivity) {
        prop.push('subProcess');
    } else if (obj instanceof BpmnTask) {
        prop.push('call');
        prop.push('compensation'); prop.push('loop');
    } else if (obj instanceof BpmnSubProcess) {
        prop.push('adhoc');
        prop.push('boundary');
        prop.push('compensation');
        prop.push('loop');
        prop.push('processes');
    } else if (obj instanceof Port) {
        prop.push('height');
        prop.push('width');
        prop.push('visibility');
        prop.push('horizontalAlignment');
        prop.push('verticalAlignment');
        prop.push('shape');
    } else if (obj instanceof Annotation) {
        prop.push('constraints');
        prop.push('height');
        prop.push('horizontalAlignment');
        prop.push('rotateAngle');
        prop.push('template');
        prop.push('verticalAlignment');
        prop.push('visibility');
        prop.push('width');
        prop.push('margin');
    } else if (obj instanceof Margin) {
        prop.push('left'); prop.push('right'); prop.push('top'); prop.push('bottom');
    } else if (obj instanceof TextStyle) {
        prop = ['strokeWidth', 'strokeDashArray', 'opacity', 'gradient', 'fontSize', 'fontFamily', 'textOverflow',
            'textDecoration', 'whiteSpace', 'textWrapping', 'textAlign', 'italic', 'bold'];
    }
    if (obj instanceof ShapeStyle) {
        prop.push('strokeColor'); prop.push('color');
    }
    properties = properties.concat(prop);
    return properties;
}

/**
 * cloneObject method\
 *
 * @returns { Rect }    cloneObject method .\
 * @param {DiagramElement} obj - provide the obj value.
 * @param {DiagramElement} additionalProp - provide the additionalProp value.
 * @param {DiagramElement} key - provide the key value.
 * @param {DiagramElement} cloneBlazorProp - provide the cloneBlazorProp value.
 *
 * @private
 */
export function cloneObject(obj: Object, additionalProp?: Function | string, key?: string, cloneBlazorProp?: boolean): Object {
    const newObject: Object = {};
    const keys: string = 'properties';
    const prop: string = 'propName';
    if (obj) {
        key = obj[prop];
        const sourceObject: Object = obj[keys] || obj;
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
        if (cloneBlazorProp) {
            properties = updateCloneProp(properties, obj);
        }
        for (const property of properties) {
            if (property !== 'historyManager') {
                if (property !== 'wrapper') {
                    //const constructorId: string = 'constructor';
                    //const name: string = 'name';
                    // eslint-disable-next-line no-prototype-builtins
                    const isEventEmmitter: boolean = obj[property] && obj.hasOwnProperty('observers') ? true : false;
                    if (!isEventEmmitter) {
                        if (obj[property] instanceof Array) {
                            newObject[property] = cloneArray(
                                (internalProp.indexOf(property) === -1 && obj[keys]) ? obj[keys][property] : obj[property],
                                additionalProp, property, cloneBlazorProp);
                        } else if (obj[property] instanceof Array === false && obj[property] instanceof HTMLElement) {
                            newObject[property] = obj[property].cloneNode(true).innerHtml;
                        } else if (obj[property] instanceof Array === false && obj[property] instanceof Object) {
                            newObject[property] = cloneObject(
                                (internalProp.indexOf(property) === -1 && obj[keys]) ? obj[keys][property] : obj[property],
                                undefined, undefined, cloneBlazorProp);
                        } else {
                            newObject[property] = obj[property];
                        }
                    }
                } else {
                    if (obj[property]) {
                        newObject[property] = {
                            actualSize: {
                                width: obj[property].actualSize.width, height: obj[property].actualSize.height
                            }, offsetX: obj[property].offsetX, offsetY: obj[property].offsetY
                        };
                    }
                }
            }
        }
    }
    return newObject;
}
/**
 * getInternalProperties method\
 *
 * @returns { string[] }    getInternalProperties method .\
 * @param {string} propName - provide the propName value.
 *
 * @private
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
    case 'layers':
        return ['objectZIndex'];
    }
    return [];
}
/**
 * cloneArray method\
 *
 * @returns {  Object[] }    getInternalProperties method .\
 * @param {string} sourceArray - provide the sourceArray value.
 * @param {string} additionalProp - provide the additionalProp value.
 * @param {string} key - provide the key value.
 * @param {string} cloneBlazorProp - provide the cloneBlazorProp value.
 *
 * @private
 */
export function cloneArray(sourceArray: Object[], additionalProp?: Function | string, key?: string, cloneBlazorProp?: boolean): Object[] {
    let clonedArray: Object[];
    if (sourceArray) {
        clonedArray = [];
        for (let i: number = 0; i < sourceArray.length; i++) {
            if (sourceArray[i] instanceof Array) {
                clonedArray.push(sourceArray[i]);
            } else if (sourceArray[i] instanceof Object) {
                clonedArray.push(cloneObject(sourceArray[i], additionalProp, key, cloneBlazorProp));
            } else {
                clonedArray.push(sourceArray[i]);
            }
        }
    }
    return clonedArray;
}

/**
 * extendObject method\
 *
 * @returns {  Object}    getInternalProperties method .\
 * @param {string} options - provide the options value.
 * @param {string} childObject - provide the childObject value.
 *
 * @private
 */
export function extendObject(options: Object, childObject: Object): Object {
    const properties: string = 'properties';

    if (options) {
        if (!childObject) {
            childObject = { properties: {} };
        }
        //const target: Object = childObject;
        for (const property of Object.keys(options)) {
            if (options[property] instanceof Array) {
                const extendeArray: Object[] = extendArray(options[property], childObject[properties][property]);
                if (!childObject[properties][property] || !childObject[properties][property].length) {
                    childObject[property] = extendeArray;
                }
            } else if (options[property] instanceof Array === false && options[property] instanceof HTMLElement) {
                childObject[property] = options[property].cloneNode(true).innerHtml;
            } else if (options[property] instanceof Array === false && options[property] instanceof Object) {
                const extendedObject: Object = extendObject(options[property], childObject[properties][property]);
                if (extendedObject[properties] && !Object.keys(extendedObject[properties]).length) {
                    delete extendedObject[properties];
                }
                childObject[property] = extendedObject;
            } else {
                childObject[property] = childObject[properties][property] !== undefined ?
                    childObject[property] : options[property];
            }
        }
    }
    return childObject;
}

/**
 * extendObject method\
 *
 * @returns {  Object}    getInternalProperties method .\
 * @param {string} sourceArray - provide the sourceArray value.
 * @param {string} childArray - provide the childArray value.
 *
 * @private
 */
export function extendArray(sourceArray: Object[], childArray: Object[]): Object[] {
    const clonedArray: Object[] = [];
    let reset: boolean = false;
    if (!childArray) { childArray = []; }
    if (!childArray.length) {
        reset = true;
    }
    for (let i: number = 0; i < sourceArray.length; i++) {
        if (sourceArray[i] instanceof Array) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const extendedArray: Object[] = extendArray(sourceArray[i] as Object[], childArray[i] as Object[]);
            if (reset) {
                clonedArray.push(extendArray);
            }
        } else if (sourceArray[i] instanceof Object) {
            const extendedObject: Object = extendObject(sourceArray[i], childArray[i]);
            if (reset) {
                clonedArray.push(extendedObject);
            }
        } else {
            clonedArray.push(sourceArray[i]);
        }
    }
    return clonedArray;
}

/**
 * textAlignToString method\
 *
 * @returns {  Object}    textAlignToString method .\
 * @param {string} value - provide the sourceArray value.
 *
 * @private
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
    }
    return state;
}
/**
 * wordBreakToString method\
 *
 * @returns {  string }    wordBreakToString method .\
 * @param {TextWrap | TextDecoration} value - provide the value value.
 *
 * @private
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
 * bBoxText method\
 *
 * @returns { number }    bBoxText method .\
 * @param {string} textContent - provide the textContent value.
 * @param {string} options - provide the options value.
 *
 * @private
 */
export function bBoxText(textContent: string, options: TextAttributes): number {
    const measureWindowElement: string = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    const svg: SVGElement = window[measureWindowElement].children[2];
    const text: SVGTextElement = getChildNode(svg)[1] as SVGTextElement;
    text.textContent = textContent;
    applyStyleAgainstCsp(text, 'font-size:' + options.fontSize + 'px; font-family:'
        + options.fontFamily + ';font-weight:' + (options.bold ? 'bold' : 'normal'));
    const bBox: number = text.getBBox().width;
    window[measureWindowElement].style.visibility = 'hidden';
    return bBox;
}
/**
 * middleElement method\
 *
 * @returns {  number}    middleElement method .\
 * @param {number} i - provide the textContent value.
 * @param {number} j - provide the options value.
 *
 * @private
 */
export function middleElement(i: number, j: number): number {
    let m: number = 0;
    m = (i + j) / 2;
    return m;
}
/**
 * overFlow method\
 *
 * @returns {  number}    overFlow method .\
 * @param {number} text - provide the text value.
 * @param {number} options - provide the options value.
 *
 * @private
 */
export function overFlow(text: string, options: TextAttributes): string {
    let i: number = 0;
    let j: number = 0;
    let middle: number = 0;
    let bounds: number = 0;
    let temp: string = '';
    j = text.length;
    let t: number = 0;
    do {
        if (bounds > 0) {
            i = middle;
        }
        middle = Math.floor(middleElement(i, j));
        temp += text.substr(i, middle);
        bounds = bBoxText(temp, options);
    } while (bounds <= options.width);
    temp = temp.substr(0, i);
    for (t = i; t < j; t++) {
        temp += text[t];
        bounds = bBoxText(temp, options);
        if (bounds >= options.width) {
            text = text.substr(0, temp.length - 1);
            break;
        }
    }
    if (options.textOverflow === 'Ellipsis') {
        text = text.substr(0, text.length - 3);
        text += '...';
    } else {
        text = text.substr(0, text.length);
    }
    return text;
}

/**
 * whiteSpaceToString method\
 *
 * @returns {  number}    whiteSpaceToString method .\
 * @param {number} value - provide the value value.
 * @param {number} wrap - provide the wrap value.
 *
 * @private
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
 * rotateSize method\
 *
 * @returns {  number}    rotateSize method .\
 * @param {number} size - provide the size value.
 * @param {number} angle - provide the angle value.
 *
 * @private
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
 * rotatePoint method\
 *
 * @returns {  number}    rotateSize method .\
 * @param {number} angle - provide the angle value.
 * @param {number} pivotX - provide the pivotX value.
 * @param {number} pivotY - provide the pivotY value.
 * @param {PointModel} point - provide the point value.
 * @private
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
 * getOffset method\
 *
 * @returns {  number}    getOffset method .\
 * @param {PointModel} topLeft - provide the angle value.
 * @param {DiagramElement} obj - provide the pivotX value.
 * @private
 */
export function getOffset(topLeft: PointModel, obj: DiagramElement): PointModel {
    const offX: number = topLeft.x + obj.desiredSize.width * obj.pivot.x;
    const offY: number = topLeft.y + obj.desiredSize.height * obj.pivot.y;
    return {
        x: offX, y: offY
    };
}


/**
 * getFunction method\
 *
 * @returns {  Function }    getFunction method .\
 * @param {PointModel} value - provide the angle value.
 * @private
 */
export function getFunction(value: Function | string): Function {
    if (value !== undefined) {
        if (typeof value === 'string') {
            value = getValue(value, window);
        }

    }
    return value as Function;
}
