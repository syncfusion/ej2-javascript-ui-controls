import { Size } from './../primitives/size';
import { PointModel } from './../primitives/point-model';
import { Rect } from './../primitives/rect';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix, scaleMatrix } from './../primitives/matrix';
import { DiagramElement, Corners } from './../core/elements/diagram-element';
import { Container } from './../core/containers/container';
import { StrokeStyle, LinearGradient, RadialGradient, Stop } from './../core/appearance';
import { TextStyleModel, GradientModel, LinearGradientModel, RadialGradientModel } from './../core/appearance-model';
import { Point } from './../primitives/point';
import {
    PortVisibility, ConnectorConstraints, NodeConstraints, Shapes, UmlActivityFlows, BpmnFlows, DiagramAction,
    UmlActivityShapes, PortConstraints, DiagramConstraints, DiagramTools, Transform, EventState, ChangeType, BlazorAction, ControlPointsVisibility
} from './../enum/enum';
import { FlowShapes, SelectorConstraints, ThumbsConstraints, FlipDirection, DistributeOptions } from './../enum/enum';
import { Alignment, SegmentInfo } from '../rendering/canvas-interface';
import { PathElement } from './../core/elements/path-element';
import { DiagramNativeElement } from './../core/elements/native-element';
import { TextElement } from '../core/elements/text-element';
import { ImageElement } from '../core/elements/image-element';
import { PathAnnotation, ShapeAnnotation } from './../objects/annotation';
import {
    PathModel, TextModel, ImageModel, FlowShapeModel, BasicShapeModel,
    NativeModel, HtmlModel, UmlActivityShapeModel, SwimLaneModel, ShapeModel, DiagramShapeModel
} from './../objects/node-model';
import {
    Node, FlowShape, BasicShape, Native, Html, UmlActivityShape, BpmnGateway, BpmnDataObject, BpmnEvent, BpmnSubEvent, BpmnActivity,
    BpmnAnnotation, MethodArguments, UmlClassAttribute, UmlClassMethod, UmlClass, UmlInterface, UmlEnumerationMember, UmlEnumeration,
    Lane, Shape, Phase, ChildContainer, SwimLane, Path, Image, Text, BpmnShape, UmlClassifierShape, Header, DiagramShape
} from './../objects/node';
import { NodeModel } from './../objects/node-model';
import { BpmnFlow, RelationShip, DiagramConnectorShape } from './../objects/connector';
import { Connector, bezierPoints, BezierSegment, ActivityFlow, StraightSegment, OrthogonalSegment } from './../objects/connector';
import { ConnectorModel } from './../objects/connector-model';
import { DecoratorModel } from './../objects/connector-model';
import { getBasicShape } from './../objects/dictionary/basic-shapes';
import { getFlowShape } from './../objects/dictionary/flow-shapes';
import { Diagram } from './../diagram';
import { Intersection, findAngle } from './connector';
import { SelectorModel } from '../objects/node-model';
import { UserHandleModel } from '../interaction/selector-model';
import { MarginModel } from '../core/appearance-model';
import { PointPortModel } from './../objects/port-model';
import { ShapeAnnotationModel, PathAnnotationModel, HyperlinkModel, AnnotationModel } from './../objects/annotation-model';
import { getContent, removeElement, hasClass, getDiagramElement } from './dom-util';
import { getBounds, cloneObject, rotatePoint, getFunction } from './base-util';
import { getPolygonPath } from './../utility/path-util';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { getRulerSize } from '../ruler/ruler';
import { View } from '../objects/interface/interfaces';
import { TransformFactor as Transforms, Segment } from '../interaction/scroller';
import { SymbolPalette } from '../../symbol-palette/symbol-palette';
import { canResize } from './constraints-util';
import { UserHandle } from '../interaction/selector';
import { Selector } from '../objects/node';
import { getUMLActivityShape } from '../objects/dictionary/umlactivity-shapes';
import { Canvas } from '../core/containers/canvas';
import { PointPort } from '../objects/port';
import { Command } from '../diagram/keyboard-commands';
import { pasteSwimLane } from './swim-lane-util';
import { GridPanel } from '../core/containers/grid';
import { isBlazor, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeInfo, INode } from '../layout/layout-base';
import { MouseEventArgs } from '../interaction/event-handlers';
import { IBlazorDropEventArgs, IBlazorCollectionChangeEventArgs } from '../objects/interface/IElement';
import { ConnectorFixedUserHandleModel, NodeFixedUserHandleModel } from '../objects/fixed-user-handle-model';
import { ConnectorFixedUserHandle } from '../objects/fixed-user-handle';
import { SymbolPaletteModel } from '../../symbol-palette';




/**
 * completeRegion method\
 *
 * @returns {  void }    completeRegion method .\
 * @param {Rect} region - provide the region value.
 * @param {(NodeModel | ConnectorModel)[]} selectedObjects - provide the selectedObjects value.
 * @private
 */
export function completeRegion(region: Rect, selectedObjects: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
    const collection: (NodeModel | ConnectorModel)[] = [];
    for (let i: number = 0; i < selectedObjects.length; i++) {
        const obj: (NodeModel | ConnectorModel) = selectedObjects[i];
        if (region.containsRect(obj.wrapper.bounds)) {
            collection.push(obj);
        }
    }
    return collection;
}

/**
 * findNodeByName method \
 *
 * @returns {  boolean } findNodeByName method .\
 * @param {(NodeModel | ConnectorModel)[]} nodes - provide the nodes  value.
 * @param {string} name - provide the orientation  value.
 * @private
 */
export function findNodeByName(nodes: (NodeModel | ConnectorModel)[], name: string): boolean {
    for (let i: number = 0; i < nodes.length; i++) {
        if (nodes[i].id === name) {
            return true;
        }
    }
    return false;
}

/**
 * findNodeByName method \
 *
 * @returns {  string } findNodeByName method .\
 * @param {(NodeModel | ConnectorModel)[]} drawingObject - provide the drawingObject  value.
 * @private
 */
export function findObjectType(drawingObject: NodeModel | ConnectorModel): string {
    let type: string;
    if (drawingObject) {
        if ((drawingObject as Connector).type) {
            type = 'Connector';
        } else if ((drawingObject as Node).shape && !(drawingObject as Connector).type) {
            type = 'Node';
        }
    }
    return type;
}

/**
 * setSwimLaneDefaults method \
 *
 * @returns {  void } setSwimLaneDefaults method .\
 * @param {NodeModel | ConnectorModel} child - provide the child  value.
 * @param {NodeModel | ConnectorModel} node - provide the node  value.
 * @private
 */
export function setSwimLaneDefaults(child: NodeModel | ConnectorModel, node: NodeModel | ConnectorModel): void {
    if (node instanceof Node) {
        if (!((child as NodeModel).shape as SwimLaneModel).header) {
            ((node as NodeModel).shape as SwimLane).hasHeader = false;
        }
    }
}

/**
 * getSpaceValue method \
 *
 * @returns {  number } getSpaceValue method .\
 * @param {number[]} intervals - provide the intervals  value.
 * @param {boolean} isLine - provide the isLine  value.
 * @param {number} i - provide the i  value.
 * @param {number} space - provide the space  value.
 * @private
 */
export function getSpaceValue(intervals: number[], isLine: boolean, i: number, space: number): number {
    space = !isLine ? ((intervals[i - 1] !== undefined) ? intervals[i - 1] + space : 0) : space;
    return space;
}

/**
 * getInterval method \
 *
 * @returns {  number[] } getInterval method .\
 * @param {number[]} intervals - provide the intervals  value.
 * @param {boolean} isLine - provide the isLine  value.
 * @private
 */
export function getInterval(intervals: number[], isLine: boolean): number[] {
    let newInterval: number[] = [];
    if (!isLine) {
        for (let k: number = 0; k < intervals.length; k++) {
            newInterval.push(intervals[k]);
        }
        newInterval.push(intervals[newInterval.length - 2]);
        newInterval.push(intervals[newInterval.length - 2]);
    } else {
        newInterval = intervals;
    }
    return newInterval;
}

/**
 * setPortsEdges method \
 *
 * @returns {  Node } setPortsEdges method .\
 * @param {Node} node - provide the node  value.
 * @private
 */
export function setPortsEdges(node: Node): Node {
    for (let k: number = 0; k < node.ports.length; k++) {
        node.ports[k].inEdges = [];
        node.ports[k].outEdges = [];
    }
    return node;
}
/**
 * setUMLActivityDefaults method \
 *
 * @returns {  void } setUMLActivityDefaults method .\
 * @param {NodeModel | ConnectorModel} child - provide the child  value.
 * @param {NodeModel | ConnectorModel} node - provide the node  value.
 * @private
 */
export function setUMLActivityDefaults(child: NodeModel | ConnectorModel, node: NodeModel | ConnectorModel): void {
    if (node instanceof Node) {
        const shape: UmlActivityShapes = (isBlazor() ? (child.shape as DiagramShape).umlActivityShape :
            (child.shape as UmlActivityShape).shape);
        switch (shape) {
            case 'JoinNode':
                if (!(child as NodeModel).width) {
                    node.width = 20;
                }
                if (!(child as NodeModel).height) {
                    node.height = 90;
                }
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
            case 'ForkNode':
                if (!(child as NodeModel).width) {
                    node.width = 90;
                }
                if (!(child as NodeModel).height) {
                    node.height = 20;
                }
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
            case 'InitialNode':
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
            case 'FinalNode':
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
        }
    } else {
        const flow: UmlActivityFlows = (isBlazor() ?
            (child.shape as DiagramConnectorShape).umlActivityFlow : (child.shape as ActivityFlow).flow);
        switch (flow) {
            case 'Object':
                if (!child.style || !child.style.strokeDashArray) {
                    node.style.strokeDashArray = '8 4';
                }
                if (!child.style || !child.style.strokeWidth) {
                    node.style.strokeWidth = 2;
                }
                if (!(child as ConnectorModel).targetDecorator || !(child as ConnectorModel).targetDecorator.shape) {
                    (node as ConnectorModel).targetDecorator.shape = 'OpenArrow';
                }
                break;
            case 'Control':
                if (!child.style || !child.style.strokeWidth) {
                    node.style.strokeWidth = 2;
                }
                if (!(child as ConnectorModel).targetDecorator || !(child as ConnectorModel).targetDecorator.shape) {
                    (node as ConnectorModel).targetDecorator.shape = 'OpenArrow';
                }
                if (!(child as ConnectorModel).sourceDecorator || !(child as ConnectorModel).sourceDecorator.shape) {
                    (node as ConnectorModel).sourceDecorator.shape = 'None';
                }
                break;
        }
    }
}
/* eslint-disable */
/**
 * setConnectorDefaults method \
 *
 * @returns {  void } setConnectorDefaults method .\
 * @param {ConnectorModel} child - provide the child  value.
 * @param {ConnectorModel} node - provide the node  value.
 * @private
 */
export function setConnectorDefaults(child: ConnectorModel, node: ConnectorModel): void {
    switch ((child.shape).type) {
        case 'Bpmn':
            const bpmnFlow: BpmnFlows = (isBlazor() ? (child.shape as DiagramConnectorShape).bpmnFlow : (child.shape as BpmnFlow).flow);
            switch (bpmnFlow) {
                case 'Sequence':
                    if (((((child.shape as BpmnFlow).sequence) === 'Normal' && child.type !== 'Bezier')) ||
                        (((child.shape as BpmnFlow).sequence) === 'Default') || (((child.shape as BpmnFlow).sequence) === 'Conditional')) {
                        if (node.targetDecorator && node.targetDecorator.style) {
                            node.targetDecorator.style.fill = (child.targetDecorator && child.targetDecorator.style
                                && child.targetDecorator.style.fill) || 'black';
                        }
                        if (((child.shape as BpmnFlow).sequence) === 'Conditional' && node.sourceDecorator) {
                            if (node.sourceDecorator.style) {
                                node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                                    child.sourceDecorator.style.fill) || 'white';
                            }
                            node.sourceDecorator.width = (child.sourceDecorator && child.sourceDecorator.width) || 20;
                            node.sourceDecorator.height = (child.sourceDecorator && child.sourceDecorator.width) || 10;
                        }
                    }
                    break;
                case 'Association':
                    if ((((child.shape as BpmnFlow).association) === 'Default') ||
                        (((child.shape as BpmnFlow).association) === 'Directional') ||
                        (((child.shape as BpmnFlow).association) === 'BiDirectional')) {
                        if (node.targetDecorator && node.targetDecorator.style) {
                            node.targetDecorator.style.fill = (child.targetDecorator && child.targetDecorator.style &&
                                child.targetDecorator.style.fill) || 'black';
                        }
                        if (((child.shape as BpmnFlow).association) === 'BiDirectional') {
                            if (node.sourceDecorator && node.sourceDecorator.style) {
                                node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                                    child.sourceDecorator.style.fill) || 'white';
                                node.sourceDecorator.width = (child.sourceDecorator && child.sourceDecorator.width) || 5;
                                node.sourceDecorator.height = (child.sourceDecorator && child.sourceDecorator.height) || 10;
                            }
                        }
                    }
                    break;
                case 'Message':
                    if (node.style && !node.style.strokeDashArray) {
                        node.style.strokeDashArray = (child.style && child.style.strokeDashArray) || '4 4';
                    }
                    break;
            }
            break;
        case 'UmlActivity':
            let flow: UmlActivityFlows = (isBlazor() ?
                (child.shape as DiagramConnectorShape).umlActivityFlow : (child.shape as ActivityFlow).flow);
            switch (flow) {
                case 'Exception':
                    if ((((child.shape as BpmnFlow).association) === 'Directional') ||
                        (((child.shape as BpmnFlow).association) === 'BiDirectional')) {
                        node.style.strokeDashArray = (child.style && child.style.strokeDashArray) || '2 2';
                    }
                    break;
            }
            break;
        case 'UmlClassifier':
            let hasRelation: boolean = false;
            if ((child.shape as RelationShip).relationship === 'Association') {
                hasRelation = true;
            } else if ((child.shape as RelationShip).relationship === 'Inheritance') {
                if (node.targetDecorator && node.targetDecorator.style) {
                    node.targetDecorator.style.fill = (child.targetDecorator && child.targetDecorator.style &&
                        child.targetDecorator.style.fill) || 'white';
                }
                if (node.style) {
                    hasRelation = true;
                    node.style.strokeDashArray = (child.style && child.style.strokeDashArray) || '4 4';
                }
            } else if ((child.shape as RelationShip).relationship === 'Composition') {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'black';
                }
                hasRelation = true;
            } else if ((child.shape as RelationShip).relationship === 'Aggregation' ||
                (child.shape as RelationShip).relationship === undefined) {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'white';
                }
                hasRelation = true;
            } else if ((child.shape as RelationShip).relationship === 'Dependency') {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'white';
                }
                hasRelation = true; node.style.strokeDashArray = '4 4';
            } else if ((child.shape as RelationShip).relationship === 'Realization') {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'white';
                }
                hasRelation = true;
            }
            if (hasRelation) { node.style.strokeWidth = (child.style && child.style.strokeWidth) || 2; }
            break;
    }
}
/* eslint-enable */
/**
 * findNearestPoint method \
 *
 * @returns {  PointModel } findNearestPoint method .\
 * @param {PointModel} reference - provide the reference  value.
 * @param {PointModel} start - provide the start  value.
 * @param {PointModel} end - provide the end  value.
 * @private
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
 * pointsForBezier method \
 *
 * @returns {   PointModel[] } pointsForBezier method .\
 * @param {ConnectorModel} connector - provide the connector  value.
 * @private
 */
function pointsForBezier(connector: ConnectorModel): PointModel[] {
    const points: PointModel[] = [];
    if (connector.type === 'Bezier') {
        let k: number = 0;
        for (let i: number = 0; i < connector.segments.length; i++) {
            const tolerance: number = 1.5; const segment: BezierSegment = (connector.segments[i] as BezierSegment);
            //const pt: PointModel = { x: 0, y: 0 };
            const point1: PointModel = !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1;
            const point2: PointModel = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
            const max: number = Number(((connector as Connector).distance(point1, segment.points[0]) +
                (connector as Connector).distance(point2, point1) +
                (connector as Connector).distance(segment.points[1], point2)) / tolerance);
            for (let j: number = 0; j < max - 1; j = j + 10) {
                points[k] =
                    bezierPoints(
                        connector, segment.points[0], !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1,
                        !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2, segment.points[1], j, max);
                k++;
            }
        }
    }
    return points;
}

/**
 * isDiagramChild method \
 *
 * @returns {  boolean } isDiagramChild method .\
 * @param {HTMLElement} htmlLayer - provide the htmlLayer  value.
 * @private
 */
export function isDiagramChild(htmlLayer: HTMLElement): boolean {
    let element: HTMLElement = htmlLayer.parentElement;
    do {
        if (hasClass(element, 'e-diagram')) {
            return true;
        }
        element = element.parentElement;
    }
    while (element);
    return false;
}

/**
 * groupHasType method \
 *
 * @returns {  boolean } groupHasType method .\
 * @param {NodeModel} node - provide the node  value.
 * @param {Shapes} type - provide the type  value.
 * @param {{}} nameTable - provide the nameTable  value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function groupHasType(node: NodeModel, type: Shapes, nameTable: {}): boolean {
    const contains: boolean = false;
    if (node && node.children && node.children.length > 0) {
        let child: Node;
        let i: number = 0;
        for (; i < node.children.length; i++) {
            child = nameTable[node.children[i]];
            if (child.shape.type === type) {
                return true;
            }
            return groupHasType(child, type, nameTable);
        }
    }
    return contains;
}


/**
 * groupHasType method \
 *
 * @returns {  void } groupHasType method .\
 * @param {NodeModel | ConnectorModel} actualNode - provide the actualNode  value.
 * @param { NodeModel | ConnectorModel} plainValue - provide the plainValue  value.
 * @param {object} defaultValue - provide the defaultValue  value.
 * @param {NodeModel | ConnectorModel} property - provide the property  value.
 * @param {string} oldKey - provide the oldKey  value.
 * @private
 */
export function updateDefaultValues(
    actualNode: NodeModel | ConnectorModel, plainValue: NodeModel | ConnectorModel,
    // eslint-disable-next-line @typescript-eslint/ban-types
    defaultValue: object, property?: NodeModel | ConnectorModel, oldKey?: string):
    void {
    if (defaultValue && ((actualNode instanceof Connector) || actualNode
        && ((actualNode.shape && actualNode.shape.type !== 'SwimLane') || actualNode.shape === undefined))) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        let keyObj: object;
        for (const key of Object.keys(defaultValue)) {
            keyObj = defaultValue[key];
            if (key === 'shape' && (keyObj as ShapeModel).type) {
                actualNode.shape = { type: (keyObj as ShapeModel).type };
            }
            if (keyObj) {
                if (Array.isArray(keyObj) && keyObj.length && keyObj.length > 0 && (oldKey !== 'annotations' && oldKey !== 'ports')) {
                    if (actualNode[key].length > 0) {
                        for (let i: number = 0; i <= actualNode[key].length; i++) {
                            updateDefaultValues(
                                actualNode[key], plainValue ? plainValue[key] : undefined,
                                defaultValue[key], (key === 'annotations' || key === 'ports') ? actualNode : undefined, key);
                        }
                    } else {
                        updateDefaultValues(
                            actualNode[key], plainValue ? plainValue[key] : undefined,
                            defaultValue[key], (key === 'annotations' || key === 'ports') ? actualNode : undefined, key);
                    }
                } else if (keyObj instanceof Object && plainValue && (oldKey !== 'annotations' && oldKey !== 'ports')) {
                    updateDefaultValues(actualNode[key], plainValue[key], defaultValue[key]);
                } else if ((oldKey !== 'annotations' && oldKey !== 'ports')
                    && (plainValue && !plainValue[key]) || (!plainValue && actualNode
                        && (actualNode[key] || actualNode[key] !== undefined))) {
                    actualNode[key] = defaultValue[key];
                } else {
                    let createObject: ShapeAnnotation | PathAnnotation | PointPort;
                    if (oldKey === 'annotations' || oldKey === 'ports') {
                        if (oldKey === 'annotations') {
                            if (actualNode[key]) {
                                updateDefaultValues(actualNode[key], plainValue[key], defaultValue[key]);
                            }
                            if (!actualNode[key]) {
                                if (getObjectType(property) === Connector) {
                                    createObject = new PathAnnotation(property, 'annotations', defaultValue[key]);
                                    (property as Connector).annotations.push(createObject);
                                } else {
                                    createObject = new ShapeAnnotation(property, 'annotations', defaultValue[key]);
                                    (property as Node).annotations.push(createObject);
                                }
                            }
                        } else {
                            if (actualNode[key]) {
                                updateDefaultValues(actualNode[key], plainValue[key], defaultValue[key]);
                            } else {
                                createObject = new PointPort(property, 'ports', defaultValue[key]);
                                (property as NodeModel).ports.push(createObject);
                            }
                        }

                    }
                }
            }
        }
    }
}
/* tslint:disable:no-string-literal */
/**
 * updateLayoutValue method \
 *
 * @returns {  void } updateLayoutValue method .\
 * @param {TreeInfo} actualNode - provide the actualNode  value.
 * @param { object} defaultValue - provide the defaultValue  value.
 * @param {INode[]} nodes - provide the nodes  value.
 * @param {INode} node - provide the node  value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function updateLayoutValue(actualNode: TreeInfo, defaultValue: object, nodes?: INode[], node?: INode): void {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let keyObj: object;
    let assistantKey: string = "Role";
    if (defaultValue) {
        for (const key of Object.keys(defaultValue)) {
            keyObj = defaultValue[key];
            if (key === 'getAssistantDetails') {
                if (isBlazor()) {
                    // Iterate the node data and get the assistant.
                    for (const dataValue of Object.keys(node.data)) {
                        assistantKey = dataValue;
                        if(node.data[assistantKey] === defaultValue[key]['root']) {
                            break;
                        }
                    }
                }
                if (node.data[assistantKey] === defaultValue[key]['root']) {
                    const assitants: string[] = defaultValue[key]['assistants'];
                    for (let i: number = 0; i < assitants.length; i++) {
                        for (let j: number = 0; j < nodes.length; j++) {
                            if (nodes[j].data[assistantKey] === assitants[i]) {
                                actualNode.assistants.push(nodes[j].id);
                                actualNode.children.splice(0, 1);
                            }
                        }
                    }
                }
            } else if (keyObj) {
                actualNode[key] = defaultValue[key];
            }
        }
    }
    if (!actualNode.hasSubTree && (defaultValue as TreeInfo).canEnableSubTree) {
        actualNode.orientation = (node as Node).layoutInfo.orientation;
        actualNode.type = (node as Node).layoutInfo.type;
        if ((node as Node).layoutInfo.offset !== actualNode.offset && ((node as Node).layoutInfo.offset) !== undefined) {
            actualNode.offset = (node as Node).layoutInfo.offset;
        }
    }
    (node as Node).layoutInfo.hasSubTree = actualNode.hasSubTree;

}
/* tslint:enable:no-string-literal */

/**
 * isPointOverConnector method \
 *
 * @returns {  boolean } isPointOverConnector method .\
 * @param {ConnectorModel} connector - provide the connector  value.
 * @param { PointModel} reference - provide the reference  value.
 * @private
 */
export function isPointOverConnector(connector: ConnectorModel, reference: PointModel): boolean {
    //let intermediatePoints: PointModel[];
    const intermediatePoints: PointModel[] = connector.type === 'Bezier' ? pointsForBezier(connector) :
        (connector as Connector).intermediatePoints;
    for (let i: number = 0; i < intermediatePoints.length - 1; i++) {
        const start: PointModel = intermediatePoints[i];
        const end: PointModel = intermediatePoints[i + 1];
        const rect: Rect = Rect.toBounds([start, end]);
        rect.Inflate(connector.hitPadding);

        if (rect.containsPoint(reference)) {
            const intersectinPt: PointModel = findNearestPoint(reference, start, end);
            const segment1: Segment = { x1: start.x, x2: end.x, y1: start.y, y2: end.y };
            const segment2: Segment = { x1: reference.x, x2: intersectinPt.x, y1: reference.y, y2: intersectinPt.y };
            const intersectDetails: Intersection = intersect3(segment1, segment2);
            if (intersectDetails.enabled) {
                const distance: number = Point.findLength(reference, intersectDetails.intersectPt);
                if (Math.abs(distance) < connector.hitPadding) {
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
    if (connector.annotations.length > 0) {
        const container: DiagramElement[] = connector.wrapper.children;
        for (let i: number = 3; i < container.length; i++) {
            const textElement: DiagramElement = container[i];
            if (textElement.bounds.containsPoint(reference)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * intersect3 method \
 *
 * @returns {  Intersection } intersect3 method .\
 * @param {ConnectorModel} lineUtil1 - provide the lineUtil1  value.
 * @param { PointModel} lineUtil2 - provide the lineUtil2  value.
 * @private
 */
export function intersect3(lineUtil1: Segment, lineUtil2: Segment): Intersection {
    const point: PointModel = { x: 0, y: 0 };
    const l1: Segment = lineUtil1;
    const l2: Segment = lineUtil2;
    const d: number = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    const na: number = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
    const nb: number = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
    /*( EJ2-42102 - Connector segments not update properly ) by sivakumar sekar - condition added to avoid bridging for
     overlapping segments in the connectors and to validate whether the connector is intersecting over the other */
    if (d === 0 || ((lineUtil1.x1 === lineUtil2.x1 || lineUtil1.y1 === lineUtil2.y1) &&
        (lineUtil1.x2 === lineUtil2.x2 || lineUtil1.y2 === lineUtil2.y2) && ((na === 0 || nb === 0) && d > 0))) {
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
 * intersect2 method \
 *
 * @returns {  PointModel } intersect2 method .\
 * @param {PointModel} start1 - provide the start1  value.
 * @param { PointModel} end1 - provide the end1  value.
 * @param { PointModel} start2 - provide the start2  value.
 * @param { PointModel} end2 - provide the end2  value.
 * @private
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
 * getLineSegment method \
 *
 * @returns {  Segment } getLineSegment method .\
 * @param {number} x1 - provide the x1  value.
 * @param { number} y1 - provide the y1  value.
 * @param { number} x2 - provide the x2  value.
 * @param { number} y2 - provide the y2  value.
 * @private
 */
export function getLineSegment(x1: number, y1: number, x2: number, y2: number): Segment {
    return { 'x1': Number(x1) || 0, 'y1': Number(y1) || 0, 'x2': Number(x2) || 0, 'y2': Number(y2) || 0 };
}
/**
 * getPoints method \
 *
 * @returns {  PointModel[] } getPoints method .\
 * @param {number} element - provide the element  value.
 * @param { number} corners - provide the corners  value.
 * @param { number} padding - provide the padding  value.
 * @private
 */
export function getPoints(element: DiagramElement, corners: Corners, padding?: number): PointModel[] {
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
 * getTooltipOffset method \
 *
 * @returns {  PointModel[] } getTooltipOffset method .\
 * @param {number} diagram - provide the diagram  value.
 * @param { number} mousePosition - provide the mousePosition  value.
 * @param { NodeModel | ConnectorModel} node - provide the node  value.
 * @param { string} type - provide the type  value.
 * @private
 */
export function getTooltipOffset(diagram: Diagram, mousePosition: PointModel, node: NodeModel | ConnectorModel, type?: string): PointModel {
    //let offset: PointModel;
    const inheritTooltip: number = (node instanceof Node) ? ((node as NodeModel).constraints & NodeConstraints.InheritTooltip)
        : (node.constraints & ConnectorConstraints.InheritTooltip);
    const objectTooltip: number = (node instanceof Node) ? ((node as NodeModel).constraints & NodeConstraints.Tooltip)
        : (node.constraints & ConnectorConstraints.Tooltip);
    let isMouseBased: boolean = ((!inheritTooltip && objectTooltip ? node.tooltip.relativeMode
        : diagram.tooltip.relativeMode) === 'Mouse') ? true : false;
    if (type === 'Mouse') {
        isMouseBased = true;
    } else if (type === 'Object') {
        isMouseBased = false;
    }
    const offset: PointModel = tooltipOffset(node, mousePosition, diagram, isMouseBased);
    const rulerSize: Size = getRulerSize(diagram);
    return { x: offset.x + rulerSize.width, y: offset.y + rulerSize.height };
}
/**
 * tooltipOffset method \
 *
 * @returns { PointModel } tooltipOffset method .\
 * @param {NodeModel | ConnectorModel} node - provide the node  value.
 * @param { PointModel} mousePosition - provide the mousePosition  value.
 * @param { Diagram } diagram - provide the diagram  value.
 * @param { boolean} isMouseBased - provide the isMouseBased  value.
 * @private
 */
function tooltipOffset(node: NodeModel | ConnectorModel, mousePosition: PointModel, diagram: Diagram, isMouseBased: boolean): PointModel {
    let point: PointModel = {};
    //let scale: number = diagram.scroller.transform.scale;
    const element: HTMLElement = document.getElementById(diagram.element.id);
    const bounds: Rect = node.wrapper.bounds;

    const rect: Rect = element.getBoundingClientRect() as Rect;
    /* eslint-enable */
    //let horizontalOffset: number = diagram.scroller.horizontalOffset;
    //let verticalOffset: number = diagram.scroller.verticalOffset;
    switch (diagram.tooltipObject.position) {
        case 'BottomCenter':
            point = offsetPoint(mousePosition, bounds.bottomCenter, diagram, isMouseBased, (rect.width / 2), rect.height);
            break;
        case 'BottomLeft':
        case 'LeftBottom':
            point = offsetPoint(mousePosition, bounds.bottomLeft, diagram, isMouseBased, 0, rect.height);
            break;
        case 'BottomRight':
        case 'RightBottom':
            point = offsetPoint(mousePosition, bounds.bottomRight, diagram, isMouseBased, rect.width, rect.height);
            break;
        case 'LeftCenter':
            point = offsetPoint(mousePosition, bounds.middleLeft, diagram, isMouseBased, 0, (rect.height / 2));
            break;
        case 'LeftTop':
        case 'TopLeft':
            point = offsetPoint(mousePosition, bounds.topLeft, diagram, isMouseBased, 0, 0);
            break;
        case 'RightCenter':
            point = offsetPoint(mousePosition, bounds.middleRight, diagram, isMouseBased, rect.width, (rect.height / 2));
            break;
        case 'RightTop':
        case 'TopRight':
            point = offsetPoint(mousePosition, bounds.topRight, diagram, isMouseBased, rect.width, 0);
            break;
        case 'TopCenter':
            point = offsetPoint(mousePosition, bounds.topCenter, diagram, isMouseBased, (rect.width / 2), 0);
            break;
    }
    return point;
}

/**
 * offsetPoint method \
 *
 * @returns { PointModel } offsetPoint method .\
 * @param { PointModel} mousePosition - provide the mousePosition  value.
 * @param { PointModel } bound - provide the diagram  value.
 * @param { Diagram} diagram - provide the isMouseBased  value.
 * @param { boolean} isMouseBased - provide the isMouseBased  value.
 * @param { number} x - provide the isMouseBased  value.
 * @param { number} y - provide the isMouseBased  value.
 * @private
 */
function offsetPoint(
    mousePosition: PointModel, bound: PointModel, diagram: Diagram, isMouseBased: boolean, x: number, y: number): PointModel {
    const point: PointModel = {};
    const scale: number = diagram.scroller.transform.scale;
    const horizontalOffset: number = diagram.scroller.horizontalOffset;
    const verticalOffset: number = diagram.scroller.verticalOffset;
    point.x = (isMouseBased ? mousePosition.x : bound.x) * scale + horizontalOffset - x;
    point.y = (isMouseBased ? mousePosition.y : bound.y) * scale + verticalOffset - y;
    return point;
}


/**
 * Gets the fixed user handles symbol \
 *
 * @returns { DiagramElement } Gets the fixed user handles symbol .\
 * @param {ConnectorFixedUserHandleModel | NodeFixedUserHandleModel} options - provide the options  value.
 * @param { Canvas} fixedUserHandleContainer - provide the fixedUserHandleContainer  value.
 * @private
 */
export function initfixedUserHandlesSymbol(
    options: ConnectorFixedUserHandleModel | NodeFixedUserHandleModel, fixedUserHandleContainer: Canvas): DiagramElement {
    //let fixedUserHandleContent: PathElement | DiagramNativeElement;
    const fixedUserHandleContent: PathElement | DiagramNativeElement = new PathElement();
    fixedUserHandleContent.data = options.pathData;
    fixedUserHandleContent.height =
        options.height > 10 ? options.height - (options.padding.bottom + options.padding.top) : options.height;
    fixedUserHandleContent.width =
        options.width > 10 ? options.width - (options.padding.left + options.padding.right) : options.width;
    fixedUserHandleContent.visible = fixedUserHandleContainer.visible;
    fixedUserHandleContent.id = fixedUserHandleContainer.id + '_shape';
    fixedUserHandleContent.inversedAlignment = false;
    fixedUserHandleContent.horizontalAlignment = 'Center';
    fixedUserHandleContent.verticalAlignment = 'Center';
    fixedUserHandleContent.style = {
        fill: options.iconStrokeColor, strokeColor: options.iconStrokeColor,
        strokeWidth: options.iconStrokeWidth
    };
    fixedUserHandleContent.setOffsetWithRespectToBounds(0.5, 0.5, 'Fraction');
    fixedUserHandleContent.relativeMode = 'Object';
    fixedUserHandleContent.description = fixedUserHandleContainer.description || '';
    return fixedUserHandleContent;

}

/**
 * sort method \
 *
 * @returns { (NodeModel | ConnectorModel)[] } sort method .\
 * @param {(NodeModel | ConnectorModel)[]} objects - provide the options  value.
 * @param { DistributeOptions} option - provide the fixedUserHandleContainer  value.
 * @private
 */
export function sort(objects: (NodeModel | ConnectorModel)[], option: DistributeOptions): (NodeModel | ConnectorModel)[] {
    let i: number = 0;
    let j: number = 0;
    let temp: NodeModel | ConnectorModel;
    for (i = 0; i < objects.length; i++) {
        const b: Rect = getBounds(objects[i].wrapper);
        for (j = i + 1; j < objects.length; j++) {
            const bounds: Rect = getBounds(objects[j].wrapper);
            if (option === 'Top' || option === 'Bottom' || option === 'BottomToTop' || option === 'Middle') {
                if (b.center.y > bounds.center.y) {
                    temp = objects[i];
                    objects[i] = objects[j];
                    objects[j] = temp;
                }
            } else {
                if (b.center.x > bounds.center.x) {
                    temp = objects[i];
                    objects[i] = objects[j];
                    objects[j] = temp;
                }
            }
        }
    }
    return objects;
}

/**
 * getAnnotationPosition method \
 *
 * @returns {SegmentInfo } getAnnotationPosition method .\
 * @param {PointModel[]} pts - provide the pts  value.
 * @param { PathAnnotation | ConnectorFixedUserHandle} annotation - provide the annotation  value.
 * @param { Rect } bound - provide the bound  value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAnnotationPosition(pts: PointModel[], annotation: PathAnnotation | ConnectorFixedUserHandle, bound: Rect): SegmentInfo {
    //let angle: number;
    //let getloop: SegmentInfo;
    //let point: PointModel;
    const getloop: SegmentInfo = getOffsetOfConnector(pts, annotation);
    const angle: number = Point.findAngle(pts[getloop.index], pts[getloop.index + 1]);
    const alignednumber: number = getAlignedPosition(annotation);
    const point: PointModel = Point.transform(getloop.point, angle + 45, alignednumber);
    getloop.point = point; getloop.angle = angle;
    return getloop;
}
/**
 * getOffsetOfConnector method \
 *
 * @returns {SegmentInfo } getOffsetOfConnector method .\
 * @param {PointModel[]} points - provide the pts  value.
 * @param { PathAnnotation | ConnectorFixedUserHandle} annotation - provide the annotation  value.
 * @private
 */
export function getOffsetOfConnector(points: PointModel[], annotation: PathAnnotation | ConnectorFixedUserHandle): SegmentInfo {
    // eslint-disable-next-line
    let length: number = 0; let offset: number = annotation.offset; let point: PointModel; let angle: number;
    const lengths: number[] = []; let prevLength: number; let kCount: number;
    for (let j: number = 0; j < points.length - 1; j++) {
        length += Point.distancePoints(points[j], points[j + 1]);
        lengths.push(length);
    }
    const offsetLength: number = offset * length;
    for (let k: number = 0; k < lengths.length; k++) {
        if (lengths[k] >= offsetLength) {
            angle = Point.findAngle(points[k], points[k + 1]);
            point = Point.transform(points[k], angle, offsetLength - (prevLength || 0));
            kCount = k;
            return { point: point, index: kCount };
        }
        prevLength = lengths[k];
    }
    return { point: point, index: kCount };
}
/**
 * getAlignedPosition method \
 *
 * @returns {number } getAlignedPosition method .\
 * @param {PointModel[]} annotation - provide the annotation  value.
 * @private
 */
export function getAlignedPosition(annotation: PathAnnotation | ConnectorFixedUserHandle): number {
    let cnst: number;
    if ((annotation instanceof ConnectorFixedUserHandle)) {
        cnst = 0;
    } else { cnst = annotation.content === undefined ? 10 : 0; }

    let state: number = 0;
    switch (annotation.alignment) {
        case 'Center':
            state = 0;
            break;
        case 'Before':
            state = -((0) / 2 + cnst);
            break;
        case 'After':
            state = ((0) / 2 + cnst);
            break;
    }
    return state;
}
/**
 * alignLabelOnSegments method \
 *
 * @returns {Alignment } alignLabelOnSegments method .\
 * @param {PathAnnotation | ConnectorFixedUserHandle} obj - provide the obj  value.
 * @param { number } ang - provide the ang  value.
 * @param { PointModel[] } pts - provide the pts  value.
 * @private
 */
export function alignLabelOnSegments(obj: PathAnnotation | ConnectorFixedUserHandle, ang: number, pts: PointModel[]): Alignment {
    //let angle: number = ang % 360;
    ang %= 360;
    const fourty5: number = 45; const one35: number = 135; const two25: number = 225; const three15: number = 315;
    let vAlign: string; let hAlign: string;
    switch (obj.alignment) {
        case 'Before':
            if (ang >= fourty5 && ang <= one35) {
                hAlign = 'right'; vAlign = obj.offset === 0.5 ? 'center' : 'top';
            } else if (ang >= two25 && ang <= three15) {
                hAlign = 'left'; vAlign = obj.offset === 0.5 ? 'center' : 'bottom';
            } else if (ang > fourty5 && ang < two25) {
                vAlign = 'top'; hAlign = obj.offset === 0.5 ? 'center' : 'right';
            } else { vAlign = 'bottom'; hAlign = (obj.offset === 0.5) ? 'center' : 'left'; }
            break;
        case 'After':
            if (ang >= fourty5 && ang <= one35) {
                hAlign = 'left'; vAlign = obj.offset === 0.5 ? 'center' : 'top';
            } else if (
                ang >= two25 && ang <= three15) {
                hAlign = 'right'; vAlign = obj.offset === 0.5 ? 'center' : 'bottom';
            } else if (
                ang > fourty5 && ang < two25) {
                vAlign = 'bottom'; hAlign = obj.offset === 0.5 ? 'center' : 'right';
            } else { vAlign = 'top'; hAlign = obj.offset === 0.5 ? 'center' : 'left'; }
            break;
        case 'Center':
            hAlign = !isNullOrUndefined((obj as PathAnnotation).horizontalAlignment) ? ((obj as PathAnnotation).horizontalAlignment as string).toLowerCase() : "center";;
            vAlign = !isNullOrUndefined((obj as PathAnnotation).verticalAlignment) ? ((obj as PathAnnotation).verticalAlignment as string).toLowerCase() : "center";
            break;
    }
    if (obj.offset === 0 || obj.offset === 1) {
        //let direction: string;
        const direction: string = getBezierDirection(pts[0], pts[1]);
        switch (direction) {
            case 'left':
                hAlign = obj.offset === 0 ? 'right' : 'left';
                break;
            case 'right':
                hAlign = obj.offset === 0 ? 'left' : 'right';
                break;
            case 'bottom':
                vAlign = obj.offset === 0 ? 'top' : 'bottom';
                break;
            case 'top':
                vAlign = obj.offset === 0 ? 'bottom' : 'top';
                break;
        }
    }
    return { hAlign: hAlign, vAlign: vAlign };
}
/**
 * getBezierDirection method \
 *
 * @returns {string } getBezierDirection method .\
 * @param {PointModel} src - provide the src  value.
 * @param { PointModel } tar - provide the tar  value.
 * @private
 */
export function getBezierDirection(src: PointModel, tar: PointModel): string {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'right' : 'left';
    } else {
        return src.y < tar.y ? 'bottom' : 'top';
    }
}

/**
 * removeChildNodes method \
 *
 * @returns {void } removeChildNodes method .\
 * @param {NodeModel} node - provide the node  value.
 * @param { Diagram } diagram - provide the diagram  value.
 * @private
 */
export function removeChildNodes(node: NodeModel, diagram: Diagram): void {
    if (node instanceof Node && node.children) {
        for (let i: number = 0; i < node.children.length; i++) {
            if (diagram.nameTable[node.children[i]].children) {
                removeChildNodes(node, diagram);
            }
            diagram.removeFromAQuad(diagram.nameTable[node.children[i]]);
            diagram.removeObjectsFromLayer(diagram.nameTable[node.children[i]]);
            delete diagram.nameTable[node.children[i]];
        }
    }
}
/**
 * getChild method \
 *
 * @returns {string[] } getChild method .\
 * @param {Canvas} child - provide the child  value.
 * @param { string[] } children - provide the children  value.
 * @private
 */
export function getChild(child: Canvas, children: string[]): string[] {
    if (child && child.children && child.children.length > 0) {
        for (let j: number = 0; j < child.children.length; j++) {
            const subChild: DiagramElement = child.children[j];
            if (subChild instanceof Canvas) {
                getChild(subChild, children);
            }
        }
    }
    if (children.indexOf(child.id) === -1) {
        children.push(child.id);
    }
    return children;
}

/**
 * getSwimLaneChildren method \
 *
 * @returns {string[] } getSwimLaneChildren method .\
 * @param {NodeModel[]} nodes - provide the nodes  value.
 * @private
 */
function getSwimLaneChildren(nodes: NodeModel[]): string[] {
    let children: string[] = []; let node: Node; let grid: GridPanel; let childTable: DiagramElement[];
    let child: Canvas; const gridChild: string = 'childTable';
    for (let i: number = 0; i < nodes.length; i++) {
        node = nodes[i] as Node;
        if (node.shape.type === 'SwimLane') {
            grid = node.wrapper.children[0] as GridPanel;
            childTable = grid[gridChild];
            for (const key of Object.keys(childTable)) {
                child = childTable[key];
                children = getChild(child as Canvas, children);
            }
        }
    }
    return children;
}

/**
 * removeUnnecessaryNodes method \
 *
 * @returns {void } removeUnnecessaryNodes method .\
 * @param {string[]} children - provide the children  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @private
 */
function removeUnnecessaryNodes(children: string[], diagram: Diagram): void {
    const nodes: NodeModel[] = diagram.nodes;
    if (nodes) {
        for (let i: number = 0; i < nodes.length; i++) {
            if (children.indexOf(nodes[i].id) !== -1) {
                nodes.splice(i, 1);
                i--;
            }
        }
    }
}

/**
 * serialize method \
 *
 * @returns {string } serialize method .\
 * @param {Diagram} model - provide the model  value.
 * @private
 */
export function serialize(model: Diagram): string {
    const removeNodes: string[] = getSwimLaneChildren(model.nodes);
    let clonedObject: Object = cloneObject(model, model.getCustomProperty);
    (clonedObject as Diagram).selectedItems.nodes = [];
    (clonedObject as Diagram).selectedItems.connectors = [];
    (clonedObject as Diagram).selectedItems.wrapper = null;
    if (model.serializationSettings.preventDefaults) {
        clonedObject = preventDefaults(clonedObject, model);
    }
    removeUnnecessaryNodes(removeNodes, clonedObject as Diagram);
    return JSON.stringify(clonedObject);
}

/**
 * preventDefaults method \
 *
 * @returns {string } preventDefaults method .\
 * @param {Object} clonedObject - provide the clonedObject  value.
 * @param {object} model - provide the model  value.
 * @param {object} defaultObject - provide the defaultObject  value.
 * @param {boolean} isNodeShape - provide the isNodeShape  value.
 * @private
 */
// eslint-disable-next-line
function preventDefaults(clonedObject: Object, model: object, defaultObject?: object, isNodeShape?: boolean): object {
    defaultObject = getConstructor(model, defaultObject);
    let properties: string[] = [];
    properties = properties.concat(Object.keys(clonedObject));
    for (const property of properties) {
        if (model instanceof Node) {
            isNodeShape = (property === 'shape') ? true : false;
        }
        if (clonedObject[property] instanceof Array) {
            preventArrayDefaults(clonedObject, defaultObject, model, property);
        } else if ((clonedObject[property] instanceof Object) && defaultObject && defaultObject[property]) {
            if (property !== 'wrapper') {
                clonedObject[property] = preventDefaults(clonedObject[property], model[property], defaultObject[property], isNodeShape);
            }
        } else if ((defaultObject && clonedObject[property] === defaultObject[property]) || clonedObject[property] === undefined) {
            if (!(isNodeShape && property === 'type') && !(model instanceof SwimLane && property === 'orientation')) {
                delete clonedObject[property];
            }
        }
        if (
            JSON.stringify(clonedObject[property]) === '[]' ||
            JSON.stringify(clonedObject[property]) === '{}' ||
            clonedObject[property] === undefined
        ) {
            delete clonedObject[property];
        }
    }
    defaultObject = undefined;
    properties = undefined;
    return clonedObject;
}

/**
 * preventArrayDefaults method \
 *
 * @returns {void } preventArrayDefaults method .\
 * @param {object} clonedObject - provide the clonedObject  value.
 * @param {object} defaultObject - provide the defaultObject  value.
 * @param {object} model - provide the model  value.
 * @param {string} property - provide the property  value.
 * @private
 */
// eslint-disable-next-line
function preventArrayDefaults(clonedObject: object, defaultObject: object, model: object, property: string): void {
    if (clonedObject[property].length === 0) {
        delete clonedObject[property];
        // eslint-disable-next-line
    } else if (clonedObject[property].every((element: any): boolean => { return typeof element === 'number'; })) {
        let i: number; let isSameArray: boolean = true;
        for (i = 0; i < clonedObject[property].length; i++) {
            if (isSameArray && clonedObject[property][i] === defaultObject[property][i]) {
                isSameArray = true;
            } else {
                isSameArray = false;
            }
        }
        if (isSameArray) {
            delete clonedObject[property];
        }
    } else {
        let i: number;
        if (property === 'layers') {
            clonedObject[property].splice(0, 1);
            if (clonedObject[property].length === 0) {
                delete clonedObject[property];
            }
        }
        if (clonedObject[property]) {
            for (i = clonedObject[property].length - 1; i >= 0; i--) {
                if (property === 'nodes' || property === 'connectors') {
                    clonedObject[property][i].wrapper = null;
                }
                if (property !== 'dataManager') {
                    clonedObject[property][i] = preventDefaults(
                        clonedObject[property][i], model[property][i],
                        (defaultObject[property] !== undefined ? defaultObject[property][i] : [])
                    );
                    if (JSON.stringify(clonedObject[property][i]) === '[]' ||
                        JSON.stringify(clonedObject[property][i]) === '{}' ||
                        clonedObject[property][i] === undefined
                    ) {
                        clonedObject[property].splice(i, 1);
                    }
                }
            }
        }
    }
    clonedObject = undefined;
}
/* eslint-disable */
/**
 * getConstructor method \
 *
 * @returns {object } getConstructor method .\
 * @param {object} model - provide the model  value.
 * @param {object} defaultObject - provide the defaultObject  value.
 * @private
 */
/* tslint:disable */
function getConstructor(model: object, defaultObject: object): object {
    const obj: object = []; let constructor: object; 
    const getClassName: string = 'getClassName';
    if (model[getClassName]) {
        //EJ2-59327 - Memory leak occurs in saveDiagram method 
        const parent: object = new Diagram();
        switch (model[getClassName]()) {
            case 'Diagram':
                constructor = parent; break;
            case 'Node':
                constructor = new Node(parent, '', obj); break;
            case 'Path':
                constructor = new Path(parent as Shape, '', obj); break;
            case 'Native':
                constructor = new Native(parent as Shape, '', obj); break;
            case 'Html':
                constructor = new Html(parent as Shape, '', obj); break;
            case 'Image':
                constructor = new Image(parent as Shape, '', obj); break;
            case 'Text':
                constructor = new Text(parent as Shape, '', obj); break;
            case 'BasicShape':
                constructor = new BasicShape(parent as Shape, '', obj); break;
            case 'FlowShape':
                constructor = new FlowShape(parent as Shape, '', obj); break;
            case 'BpmnShape':
                constructor = new BpmnShape(parent as Shape, '', obj); break;
            case 'UmlActivityShape':
                constructor = new UmlActivityShape(parent as Shape, '', obj); break;
            case 'UmlClassifierShape':
                constructor = new UmlClassifierShape(parent as Shape, '', obj); break;
            case 'SwimLane':
                constructor = new SwimLane(parent as Shape, '', obj);
                if ((model as SwimLane).header) {
                    (constructor as SwimLane).header = new Header(parent as Shape, '', obj);
                    (constructor as SwimLane).header.style.fill = '';
                }
                break;
            case 'ShapeAnnotation':
                constructor = new ShapeAnnotation(parent, '', obj); break;
            case 'PointPort':
                constructor = new PointPort(parent, '', obj); break;
            case 'BpmnGateway':
                constructor = new BpmnGateway(parent as BpmnGateway, '', obj); break;
            case 'BpmnDataObject':
                constructor = new BpmnDataObject(parent as BpmnDataObject, '', obj); break;
            case 'BpmnEvent':
                constructor = new BpmnEvent(parent as BpmnEvent, '', obj); break;
            case 'BpmnSubEvent':
                constructor = new BpmnSubEvent(parent as BpmnSubEvent, '', obj); break;
            case 'BpmnActivity':
                constructor = new BpmnActivity(parent as BpmnActivity, '', obj); break;
            case 'BpmnAnnotation':
                constructor = new BpmnAnnotation(parent, '', obj); break;
            case 'MethodArguments':
                constructor = new MethodArguments(parent as MethodArguments, '', obj); break;
            case 'UmlClassAttribute':
                constructor = new UmlClassAttribute(parent as MethodArguments, '', obj); break;
            case 'UmlClassMethod':
                constructor = new UmlClassMethod(parent as MethodArguments, '', obj); break;
            case 'UmlClass':
                constructor = new UmlClass(parent as UmlClass, '', obj); break;
            case 'UmlInterface':
                constructor = new UmlInterface(parent as UmlClass, '', obj); break;
            case 'UmlEnumerationMember':
                constructor = new UmlEnumerationMember(parent as UmlEnumerationMember, '', obj); break;
            case 'UmlEnumeration':
                constructor = new UmlEnumeration(parent as UmlEnumeration, '', obj); break;
            case 'Lane':
                constructor = new Lane(parent as Shape, '', obj); break;
            case 'Phase':
                constructor = new Phase(parent as Shape, '', obj); break;
            case 'ChildContainer':
                constructor = new ChildContainer(); break;
            case 'Connector':
                constructor = new Connector(parent, '', obj); break;
            case 'StraightSegment':
                constructor = new StraightSegment(parent, '', obj); break;
            case 'BezierSegment':
                constructor = new BezierSegment(parent, '', obj); break;
            case 'OrthogonalSegment':
                constructor = new OrthogonalSegment(parent, '', obj); break;
            case 'PathAnnotation':
                constructor = new PathAnnotation(parent, '', obj); break;
            case 'Stop':
                constructor = new Stop(parent as Stop, '', obj); break;
            case 'Point':
                if (!defaultObject) {
                    constructor = new Point(parent as Point, '', obj);
                } else {
                    constructor = defaultObject;
                }
                break;
            case 'UserHandle':
                constructor = new UserHandle(parent as UserHandle, '', obj); break;
            case 'Command':
                constructor = new Command(parent as Command, '', obj); break;
        }
    } else {
        constructor = defaultObject;
    } 
    parent = undefined;
    defaultObject = undefined;
    return constructor;
}
/* eslint-enable */
/* eslint-disable */
/** @private */
export function deserialize(model: string, diagram: Diagram): Object {
    diagram.enableServerDataBinding(false);
    const blazorAction: BlazorAction = diagram.blazorActions;
    diagram.blazorActions = diagram.addConstraints(blazorAction, BlazorAction.ClearObject);
    diagram.clear();
    diagram.blazorActions = diagram.removeConstraints(blazorAction, BlazorAction.ClearObject);
    diagram.protectPropertyChange(true);
    const map: Function | string = diagram.dataSourceSettings.doBinding;
    const nodeTemp: Function | string = diagram.setNodeTemplate;
    const getDescription: Function | string = diagram.getDescription;
    const getCustomProperty: Function | string = diagram.getCustomProperty;
    const commands: {} = {};
    for (let command of diagram.commandManager.commands) {
        commands[command.name] = { execute: command.execute, canExecute: command.canExecute };
    }
    const arrangeTickHorizontal: Function | string = diagram.rulerSettings.horizontalRuler.arrangeTick;
    const arrangeTickVertical: Function | string = diagram.rulerSettings.verticalRuler.arrangeTick;
    const getLayoutInfo: Function | string = diagram.layout.getLayoutInfo;
    const getBranch: Function | string = diagram.layout.getBranch;

    const nodeDefaults: Function | string = diagram.getNodeDefaults;
    const connectorDefaults: Function | string = diagram.getConnectorDefaults;

    let dataObj: Diagram = JSON.parse(model);
    dataObj = upgrade(dataObj);
    diagram.contextMenuSettings = dataObj.contextMenuSettings || {};
    diagram.constraints = dataObj.constraints || DiagramConstraints.Default;
    diagram.tool = dataObj.tool || DiagramTools.Default;
    diagram.bridgeDirection = dataObj.bridgeDirection || 'Top';
    diagram.pageSettings = dataObj.pageSettings || {};
    diagram.drawingObject = dataObj.drawingObject || undefined;
    diagram.tooltip = dataObj.tooltip || {};
    diagram.addInfo = dataObj.addInfo || undefined;
    diagram.getDescription = getDescription;
    diagram.scrollSettings = dataObj.scrollSettings || {};
    diagram.commandManager = dataObj.commandManager || {};
    diagram.layers = dataObj.layers || [];
    diagram.rulerSettings.horizontalRuler.arrangeTick = arrangeTickHorizontal;
    diagram.rulerSettings.verticalRuler.arrangeTick = arrangeTickVertical;
    for (const cmd of diagram.commandManager.commands) {
        if (commands[cmd.name]) {
            cmd.execute = commands[cmd.name].execute;
            cmd.canExecute = commands[cmd.name].canExecute;
        }
    }
    diagram.backgroundColor = dataObj.backgroundColor || 'transparent';
    diagram.basicElements = dataObj.basicElements || [];
    diagram.connectors = dataObj.connectors || [];
    diagram.dataSourceSettings = dataObj.dataSourceSettings || {};
    diagram.dataSourceSettings.doBinding = map;
    diagram.height = dataObj.height || '100%';
    diagram.setNodeTemplate = nodeTemp;
    diagram.getConnectorDefaults = connectorDefaults;
    diagram.getNodeDefaults = nodeDefaults;
    diagram.getCustomProperty = getCustomProperty;
    diagram.mode = dataObj.mode || 'SVG';
    if (dataObj.nodes) {
        for (let i: number = 0; i < dataObj.nodes.length; i++) {
            if (dataObj.nodes[i].shape && dataObj.nodes[i].shape.type === 'SwimLane') {
                if (dataObj.nodes[i].wrapper == null) {
                    {
                        dataObj.nodes[i].wrapper = {
                            actualSize: { width: dataObj.nodes[i].width, height: dataObj.nodes[i].height },
                            offsetX: dataObj.nodes[i].offsetX, offsetY: dataObj.nodes[i].offsetY
                        } as Container;
                    }
                }
                pasteSwimLane(dataObj.nodes[i] as NodeModel, undefined, undefined, undefined, undefined, true);
            }
        }
    }
    diagram.nodes = dataObj.nodes || [];
    diagram.rulerSettings = dataObj.rulerSettings || {};
    diagram.snapSettings = dataObj.snapSettings || {};
    diagram.width = dataObj.width || '100%';
    diagram.layout = dataObj.layout || {};
    if (dataObj.layout && dataObj.layout.type !== "None") {
        diagram.canLayout = false;
    }
    diagram.layout.getLayoutInfo = getFunction(getLayoutInfo);
    diagram.layout.getBranch = getFunction(getBranch);
    diagram.diagramActions = 0;
    diagram.isLoading = true;
    diagram.protectPropertyChange(false);
    let key: string = 'refresh'; let component: View | Diagram;
    for (let i: number = 0; i < diagram.views.length; i++) {
        component = diagram.views[diagram.views[i]] as Diagram;
        diagram.blazorActions = diagram.addConstraints(blazorAction, BlazorAction.ClearObject);
        component.refresh();
        diagram.blazorActions = diagram.removeConstraints(blazorAction, BlazorAction.ClearObject);
        if (component instanceof Diagram) {
            diagram.element.classList.add('e-diagram');
        }
    }
    if (dataObj.selectedItems) {
        dataObj.selectedItems.nodes = [];
        dataObj.selectedItems.connectors = [];
    }
    diagram.selectedItems = dataObj.selectedItems;
    diagram.enableServerDataBinding(true);
    diagram.canLayout = true;
    diagram.swimlaneChildTable = {};
    diagram.swimlaneZIndexTable = {};
    return dataObj;
}
/* eslint-enable */

/**
 * upgrade method \
 *
 * @returns {Diagram } upgrade method .\
 * @param {Diagram} dataObj - provide the model  value.
 * @private
 */
export function upgrade(dataObj: Diagram): Diagram {
    if (dataObj && (dataObj.version === undefined || (dataObj.version < 17.1)) && dataObj.nodes) {
        const nodes: NodeModel[] = dataObj.nodes;
        for (const node of nodes) {
            if (node && node.ports && node.ports.length > 0) {
                for (const port of node.ports) {
                    if (port && port.constraints && port.constraints === PortConstraints.None) {
                        port.constraints = PortConstraints.Default;
                    }
                }
            }
        }

    }
    return dataObj;
}

/**
 * updateStyle method \
 *
 * @returns {void } updateStyle method .\
 * @param {TextStyleModel} changedObject - provide the changedObject  value.
 * @param {DiagramElement} target - provide the target  value.
 * @private
 */
export function updateStyle(changedObject: TextStyleModel, target: DiagramElement): void {
    //since text style model is the super set of shape style model, we used text style model
    const style: TextStyleModel = target.style as TextStyleModel;
    const textElement: TextElement = target as TextElement;
    target.canApplyStyle = true;
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
            case 'gradient':
                if (style.gradient) {
                    updateGradient(changedObject.gradient, style.gradient);
                    break;
                }
        }
    }
    if (target instanceof TextElement) {
        textElement.refreshTextElement();
    }
}
/**
 * updateGradient method \
 *
 * @returns {void } updateGradient method .\
 * @param {GradientModel | LinearGradientModel | RadialGradientModel} changedGradient - provide the changedGradient  value.
 * @param {GradientModel | LinearGradientModel | RadialGradientModel} targetGradient - provide the targetGradient  value.
 * @private
 */
function updateGradient(
    changedGradient: GradientModel | LinearGradientModel | RadialGradientModel,
    targetGradient: GradientModel | LinearGradientModel | RadialGradientModel
): void {
    for (const key of Object.keys(changedGradient)) {
        switch (key) {
            case 'type':
                targetGradient.type = changedGradient.type;
                break;
            case 'x1':
                (targetGradient as LinearGradient).x1 = (changedGradient as LinearGradient).x1;
                break;
            case 'x2':
                (targetGradient as LinearGradient).x2 = (changedGradient as LinearGradient).x2;
                break;
            case 'y1':
                (targetGradient as LinearGradient).y1 = (changedGradient as LinearGradient).y1;
                break;
            case 'y2':
                (targetGradient as LinearGradient).y2 = (changedGradient as LinearGradient).y2;
                break;
            case 'cx':
                (targetGradient as RadialGradient).cx = (changedGradient as RadialGradient).cx;
                break;
            case 'cy':
                (targetGradient as RadialGradient).cy = (changedGradient as RadialGradient).cy;
                break;
            case 'fx':
                (targetGradient as RadialGradient).fx = (changedGradient as RadialGradient).fx;
                break;
            case 'fy':
                (targetGradient as RadialGradient).fy = (changedGradient as RadialGradient).fy;
                break;
            case 'r':
                (targetGradient as RadialGradient).r = (changedGradient as RadialGradient).r;
                break;
            case 'stops':
                targetGradient.stops = changedGradient.stops;
                break;
        }
    }
}

/* eslint-disable */
/**
 * updateHyperlink method \
 *
 * @returns {void } updateHyperlink method .\
 * @param {HyperlinkModel} changedObject - provide the changedObject  value.
 * @param {DiagramElement} target - provide the target  value.
 * @param {AnnotationModel} actualAnnotation - provide the actualAnnotation  value.
 * @private
 */
export function updateHyperlink(changedObject: HyperlinkModel, target: DiagramElement, actualAnnotation: AnnotationModel): void {
    const textElement: TextElement = target as TextElement;
    const hyperlink: HyperlinkModel = textElement.hyperlink;
    for (const key of Object.keys(changedObject)) {
        switch (key) {
            case 'color':
                textElement.style.color = hyperlink.color = changedObject.color;
                break;
            case 'content':
                textElement.content = hyperlink.content = changedObject.content || hyperlink.link;
                break;
            case 'link':
                const labelStyle: TextStyleModel = actualAnnotation.style;
                textElement.style.color = changedObject.link ? hyperlink.color : labelStyle.color;
                textElement.style.textDecoration = changedObject.link ? hyperlink.textDecoration : actualAnnotation.style.textDecoration;
                textElement.content = changedObject.link ? hyperlink.content || changedObject.link : actualAnnotation.content;
                hyperlink.link = changedObject.link;
                break;
            case 'textDecoration':
                textElement.style.textDecoration = hyperlink.textDecoration = changedObject.textDecoration;
                break;
            case 'hyperlinkOpenState':
                hyperlink.hyperlinkOpenState = changedObject.hyperlinkOpenState;
                break;    
        }
    }
}
/* eslint-enable */

/**
 * updateShapeContent method \
 *
 * @returns {void } updateShapeContent method .\
 * @param {DiagramElement} content - provide the content  value.
 * @param {Node} actualObject - provide the actualObject  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @private
 */
export function updateShapeContent(content: DiagramElement, actualObject: Node, diagram: Diagram): void {
    content.width = actualObject.width;
    content.height = actualObject.height;
    content.minHeight = actualObject.minHeight;
    content.maxHeight = actualObject.maxHeight;
    content.minWidth = actualObject.minWidth;
    content.maxWidth = actualObject.maxWidth;

    content.horizontalAlignment = actualObject.wrapper.children[0].horizontalAlignment;
    content.verticalAlignment = actualObject.wrapper.children[0].verticalAlignment;
    content.relativeMode = actualObject.wrapper.children[0].relativeMode;
    content.visible = actualObject.wrapper.children[0].visible;

    if (actualObject.shape instanceof Text) {
        content.margin = (actualObject.shape as TextModel).margin;
    }
    content.id = actualObject.wrapper.children[0].id;
    content.style = actualObject.style;
    //let view: View;
    for (const elementId of diagram.views) {
        removeElement(actualObject.id + '_groupElement', elementId);
        removeElement(actualObject.id + '_content_groupElement', elementId);
        removeElement(actualObject.id + '_html_element', elementId);
    }
    actualObject.wrapper.children.splice(0, 1);
    actualObject.wrapper.children.splice(0, 0, content);
}

/* eslint-disable */
/**
 * updateShape method \
 *
 * @returns {void } updateShape method .\
 * @param {Node} node - provide the node  value.
 * @param {Node} actualObject - provide the actualObject  value.
 * @param {Node} oldObject - provide the oldObject  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @private
 */
export function updateShape(node: Node, actualObject: Node, oldObject: Node, diagram: Diagram): void {
    let content: DiagramElement = new DiagramElement(); let i: number;
    //let textStyle: TextStyleModel; let nodeStyle: TextStyleModel;
    switch (node.shape.type) {
        case 'Path':
            const pathContent: PathElement = new PathElement();
            pathContent.data = (actualObject.shape as PathModel).data;
            content = pathContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Image':
            const imageContent: ImageElement = new ImageElement();
            imageContent.source = (actualObject.shape as ImageModel).source;
            imageContent.imageAlign = (actualObject.shape as ImageModel).align;
            imageContent.imageScale = (actualObject.shape as ImageModel).scale;
            content = imageContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Text':
            //issue
            const textContent: DiagramElement = new TextElement();
            //  (textContent as TextElement).content = (node.shape as TextModel).content;
            content = textContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Basic':


            const element: DiagramElement = ((isBlazor() ? (actualObject.shape as DiagramShape).basicShape === 'Rectangle' :
                (actualObject.shape as BasicShape).shape === 'Rectangle')) ? new DiagramElement() : new PathElement();
            if ((!isBlazor() && (actualObject.shape as BasicShape).shape === 'Polygon') ||
                (isBlazor() && (actualObject.shape as DiagramShape).basicShape === 'Polygon')) {
                (element as PathElement).data = getPolygonPath((actualObject.shape as BasicShape).points) as string;
            } else {
                (element as PathElement).data = getBasicShape((isBlazor() ? (actualObject.shape as DiagramShape).basicShape :
                    (actualObject.shape as BasicShape).shape));
            }
            updateShapeContent(content, actualObject, diagram);
            if ((!isBlazor() && (actualObject.shape as BasicShape).shape === 'Rectangle') ||
                (isBlazor() && (actualObject.shape as DiagramShape).basicShape === 'Rectangle')) {
                element.cornerRadius = (actualObject.shape as BasicShape).cornerRadius;
            }
            content = element;
            break;
        case 'Flow':
            /* eslint-disable */
            const flowShapeElement: PathElement = new PathElement();
            const shape: string = (isBlazor()) ? (actualObject.shape as DiagramShape).flowShape : (actualObject.shape as FlowShape).shape;
            flowShapeElement.data = getFlowShape(shape);
            content = flowShapeElement;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Native':
            const nativeContent: DiagramNativeElement = new DiagramNativeElement(node.id, diagram.element.id);
            nativeContent.content = (actualObject.shape as Native).content;
            nativeContent.scale = (actualObject.shape as Native).scale;
            content = nativeContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'HTML':
            let htmlContent: DiagramHtmlElement = new DiagramHtmlElement(actualObject.id, diagram.element.id);
            htmlContent.content = (actualObject.shape as Html).content;
            content = htmlContent;
            updateShapeContent(content, actualObject, diagram);
    }
    if (node.shape.type === undefined || node.shape.type === oldObject.shape.type || (isBlazor() && node.shape.type === 'UmlActivity')) {
        updateContent(node, actualObject, diagram, oldObject);
    } else {
        content.width = actualObject.wrapper.children[0].width;
        content.height = actualObject.wrapper.children[0].height;
        if (actualObject.shape instanceof Text) {
            content.margin = (actualObject.shape as TextModel).margin;
        }
        content.style = actualObject.style;
        actualObject.wrapper.children[0] = content;
    }
}
/* eslint-enable */
/**
 * updateContent method \
 *
 * @returns {void } updateContent method .\
 * @param {Node} newValues - provide the newValues  value.
 * @param {Node} actualObject - provide the actualObject  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {Node} oldObject - provide the oldObject  value.
 * @private
 */
export function updateContent(newValues: Node, actualObject: Node, diagram: Diagram, oldObject: Node): void {
    if (Object.keys(newValues.shape).length > 0) {
        if (actualObject.shape.type === 'Path' && (newValues.shape as PathModel).data !== undefined) {
            (actualObject.wrapper.children[0] as PathModel).data = (newValues.shape as PathModel).data;
        } else if (actualObject.shape.type === 'Text' && (newValues.shape as TextModel).content !== undefined) {
            (actualObject.wrapper.children[0] as TextModel).content = (newValues.shape as TextModel).content;
        } else if (actualObject.shape.type === 'Image' && (newValues.shape as ImageModel).source !== undefined) {
            (actualObject.wrapper.children[0] as ImageModel).source = (newValues.shape as ImageModel).source;
        } else if (actualObject.shape.type === 'Native') {
            let nativeElement: HTMLElement;
            for (let i: number = 0; i < diagram.views.length; i++) {
                nativeElement = getDiagramElement(actualObject.wrapper.children[0].id + '_native_element', diagram.views[i]);
                if ((newValues.shape as NativeModel).content !== undefined && nativeElement) {
                    nativeElement.removeChild(nativeElement.children[0]);
                    (actualObject.wrapper.children[0] as DiagramNativeElement).content = (newValues.shape as NativeModel).content;
                    nativeElement.appendChild(getContent(actualObject.wrapper.children[0] as DiagramNativeElement, false));
                }
            }
            (actualObject.wrapper.children[0] as NativeModel).scale = (newValues.shape as NativeModel).scale ?
                (newValues.shape as NativeModel).scale : (actualObject.wrapper.children[0] as NativeModel).scale;
        } else if (actualObject.shape.type === 'HTML') {
            let htmlElement: HTMLElement;
            for (let i: number = 0; i < diagram.views.length; i++) {
                htmlElement = getDiagramElement(actualObject.wrapper.children[0].id + '_html_element', diagram.views[i]);
                if (htmlElement) {
                    htmlElement.removeChild(htmlElement.children[0]);
                    (actualObject.wrapper.children[0] as DiagramHtmlElement).content = (newValues.shape as HtmlModel).content;
                    htmlElement.appendChild(getContent(actualObject.wrapper.children[0] as DiagramHtmlElement, true));
                }
            }
        } else if (actualObject.shape.type === 'Flow' && ((isBlazor() && (newValues.shape as DiagramShapeModel).flowShape !== undefined) ||
            (newValues.shape as FlowShapeModel).shape !== undefined)) {
            (actualObject.shape as FlowShapeModel).shape = isBlazor() ? (newValues.shape as DiagramShapeModel).flowShape :
                (newValues.shape as FlowShapeModel).shape;
            const shapes: FlowShapes = (actualObject.shape as FlowShapeModel).shape;
            const flowshapedata: string = getFlowShape(shapes.toString());
            (actualObject.wrapper.children[0] as PathModel).data = flowshapedata;
        } else if (actualObject.shape.type === 'UmlActivity' &&
            ((isBlazor() && (newValues.shape as DiagramShape).umlActivityShape !== undefined) ||
                (!isBlazor() && (newValues.shape as UmlActivityShapeModel).shape !== undefined))) {
            updateUmlActivityNode(actualObject, newValues);
        } else if ((newValues.shape as BasicShapeModel).cornerRadius !== undefined) {
            (actualObject.wrapper.children[0] as BasicShapeModel).cornerRadius = (newValues.shape as BasicShapeModel).cornerRadius;
        } else if (actualObject.shape.type === 'Basic' && (oldObject && (oldObject.shape as BasicShape).shape === 'Rectangle')) {
            const basicshape: PathElement = new PathElement();
            const basicshapedata: string = getBasicShape((isBlazor()) ? (actualObject.shape as DiagramShape).basicShape :
                (actualObject.shape as BasicShape).shape);
            basicshape.data = basicshapedata;
            const content: DiagramElement = basicshape;
            updateShapeContent(content, actualObject, diagram);
        } else if (((isBlazor() && (newValues.shape as DiagramShapeModel).basicShape !== undefined) ||
            (newValues.shape as FlowShapeModel).shape !== undefined)) {
            (actualObject.shape as BasicShapeModel).shape = isBlazor() ? (newValues.shape as DiagramShapeModel).basicShape :
                (newValues.shape as BasicShapeModel).shape;
            const shapes: string = (actualObject.shape as BasicShapeModel).shape;
            const basicShapeData: string = getBasicShape(shapes.toString());
            (actualObject.wrapper.children[0] as PathModel).data = basicShapeData;
        }
    }
    (actualObject.wrapper.children[0] as PathElement).canMeasurePath = true;
}
/**
 * updateUmlActivityNode method \
 *
 * @returns {void } updateUmlActivityNode method .\
 * @param {Node} actualObject - provide the newValues  value.
 * @param {Node} newValues - provide the actualObject  value.
 * @private
 */
export function updateUmlActivityNode(actualObject: Node, newValues: Node): void {
    if (!isBlazor()) {
        (actualObject.shape as UmlActivityShapeModel).shape = (newValues.shape as UmlActivityShapeModel).shape;
    } else {
        (actualObject.shape as DiagramShape).umlActivityShape = (newValues.shape as DiagramShape).umlActivityShape;
    }
    const shapes: UmlActivityShapes = !isBlazor() ? (actualObject.shape as UmlActivityShapeModel).shape :
        (actualObject.shape as DiagramShape).umlActivityShape;
    const umlActivityShapeData: string = getUMLActivityShape(shapes.toString());
    if ((isBlazor() && (actualObject.shape as DiagramShape).umlActivityShape === 'InitialNode') ||
        (!isBlazor() && (actualObject.shape as UmlActivityShapeModel).shape === 'InitialNode')) {
        actualObject.wrapper.children[0].style.fill = 'black';
    } else if ((!isBlazor() && ((actualObject.shape as UmlActivityShapeModel).shape === 'ForkNode' ||
        (actualObject.shape as UmlActivityShapeModel).shape === 'JoinNode')) ||
        ((isBlazor() && ((actualObject.shape as DiagramShape).umlActivityShape === 'ForkNode' ||
            (actualObject.shape as DiagramShape).umlActivityShape === 'JoinNode')))) {
        actualObject.wrapper.children[0].style.fill = 'black';
    } else if ((!isBlazor() && (actualObject.shape as UmlActivityShapeModel).shape === 'FinalNode') ||
        (isBlazor() && (actualObject.shape as DiagramShape).umlActivityShape === 'FinalNode')) {
        if (actualObject instanceof Node) {
            actualObject.wrapper = getUMLFinalNode(actualObject);
        }
    }
    if (umlActivityShapeData) {
        (actualObject.wrapper.children[0] as PathModel).data = umlActivityShapeData;
    }
}

/**
 * getUMLFinalNode method \
 *
 * @returns {Canvas } getUMLFinalNode method .\
 * @param {Node} node - provide the newValues  value.
 * @private
 */
export function getUMLFinalNode(node: Node): Canvas {
    const finalNodeShape: Canvas = new Canvas();
    finalNodeShape.style.fill = 'transparent';
    //childNode0
    const pathData: string = 'M 25 50 C 11.21 50 0 38.79 0 25 C 0 11.21 11.21 0 25 0 C 38.78 0 50 11.21 50 25' +
        ' C 50 38.79 38.78 50 25 50';
    const innerFinalNode: PathElement = new PathElement();
    innerFinalNode.data = pathData;
    innerFinalNode.id = node.id + '_0_finalNode';
    innerFinalNode.horizontalAlignment = 'Center';
    innerFinalNode.verticalAlignment = 'Center';
    innerFinalNode.relativeMode = 'Object';
    innerFinalNode.style.strokeColor = node.style.strokeColor;
    innerFinalNode.style.strokeWidth = node.style.strokeWidth;
    //childNode1
    const outerFinalNode: PathElement = new PathElement();
    outerFinalNode.data = pathData;
    outerFinalNode.id = node.id + '_1_finalNode';
    outerFinalNode.horizontalAlignment = 'Center';
    outerFinalNode.verticalAlignment = 'Center';
    outerFinalNode.relativeMode = 'Object';
    outerFinalNode.style.fill = node.style.fill;
    outerFinalNode.style.strokeColor = node.style.strokeColor;
    outerFinalNode.style.strokeWidth = node.style.strokeWidth;
    //append child and set style
    finalNodeShape.children = [innerFinalNode, outerFinalNode];
    finalNodeShape.children[0].width = node.width;
    finalNodeShape.children[0].height = node.height;
    finalNodeShape.children[1].height = node.height / 1.5;
    finalNodeShape.children[1].width = node.width / 1.5;
    finalNodeShape.style.strokeWidth = 0;
    finalNodeShape.style.strokeColor = 'transparent';
    return finalNodeShape;
}

/**
 * getUMLActivityShapes method \
 *
 * @returns {DiagramElement } getUMLActivityShapes method .\
 * @param {PathElement} umlActivityShape - provide the umlActivityShape  value.
 * @param {DiagramElement} content - provide the content  value.
 * @param {Node} node - provide the node  value.
 * @private
 */
export function getUMLActivityShapes(umlActivityShape: PathElement, content: DiagramElement, node: Node): DiagramElement {
    const shape: UmlActivityShapes = (isBlazor() ? (node.shape as DiagramShape).umlActivityShape : (node.shape as UmlActivityShape).shape);
    const umlActivityShapeData: string = getUMLActivityShape(shape);
    umlActivityShape.data = umlActivityShapeData;
    content = umlActivityShape;
    switch (shape) {
        case 'StructuredNode':
            if (node.annotations) {
                for (let i: number = 0; i < node.annotations.length; i++) {
                    node.annotations[i].content = '<<' + node.annotations[i].content + '>>';
                }
            }
            content = umlActivityShape;
            break;
        case 'FinalNode':
            content = getUMLFinalNode(node);
            break;
    }
    return content;
}

/**
 * removeGradient method \
 *
 * @returns {void } removeGradient method .\
 * @param {string} svgId - provide the umlActivityShape  value.
 * @private
 */
export function removeGradient(svgId: string): void {
    removeElement(svgId + '_linear');
    removeElement(svgId + '_radial');
}

/**
 * removeItem method \
 *
 * @returns {void } removeItem method .\
 * @param {string[]} array - provide the umlActivityShape  value.
 * @param {string} item - provide the umlActivityShape  value.
 * @private
 */
export function removeItem(array: string[], item: string): void {
    const index: number = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
}
/**
 * updateConnector method \
 *
 * @returns {void } updateConnector method .\
 * @param {Connector} connector - provide the connector  value.
 * @param {PointModel[]} points - provide the points  value.
 * @param {DiagramAction} diagramActions - provide the diagramActions  value.
 * @private
 */
export function updateConnector(connector: Connector, points: PointModel[], diagramActions?: DiagramAction): void {
    let anglePoint: PointModel[]; //let srcDecorator: DecoratorModel;
    //let targetPoint: PointModel;
    connector.intermediatePoints = points;
    connector.updateSegmentElement(connector, points, connector.wrapper.children[0] as PathElement, diagramActions);
    const srcDecorator: DecoratorModel = connector.sourceDecorator;
    if (connector.type === 'Bezier') {
        const firstSegment: BezierSegment = (connector.segments[0] as BezierSegment);
        const lastSegment: BezierSegment = (connector.segments[connector.segments.length - 1] as BezierSegment);
        anglePoint = [!Point.isEmptyPoint(lastSegment.point2) ? lastSegment.point2 : lastSegment.bezierPoint2,
        !Point.isEmptyPoint(firstSegment.point1) ? firstSegment.point1 : firstSegment.bezierPoint1];
    } else {
        anglePoint = connector.intermediatePoints;
    }
    points = connector.clipDecorators(connector, points, diagramActions);
    let element: DiagramElement = connector.wrapper.children[0];
    (element as PathElement).canMeasurePath = true;
    element = connector.wrapper.children[1];
    connector.updateDecoratorElement(element, points[0], anglePoint[1], srcDecorator);
    //const targetPoint: PointModel = connector.targetPoint;
    const tarDecorator: DecoratorModel = connector.targetDecorator;
    element = connector.wrapper.children[2];
    connector.updateDecoratorElement(element, points[points.length - 1], anglePoint[anglePoint.length - 2], tarDecorator);
    connector.updateShapeElement(connector);
}
/**
 * getUserHandlePosition method \
 *
 * @returns {PointModel } getUserHandlePosition method .\
 * @param {SelectorModel} selectorItem - provide the connector  value.
 * @param {UserHandleModel} handle - provide the handle  value.
 * @param {Transforms} transform - provide the transform  value.
 * @private
 */
export function getUserHandlePosition(selectorItem: SelectorModel, handle: UserHandleModel, transform?: Transforms): PointModel {
    const wrapper: DiagramElement = selectorItem.wrapper;
    //let positionPoints: PointModel;
    const bounds: Rect = wrapper.bounds;
    const offset: number = handle.offset;
    const size: number = handle.size / transform.scale;
    const margin: MarginModel = handle.margin;
    let point: PointModel;
    const left: number = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
    const top: number = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
    point = { x: 0, y: 0 };

    if (selectorItem.nodes.length > 0) {
        switch (handle.side) {
            case 'Top':
                point.x += left + bounds.width * offset;
                point.y += top - (size / 2 + 12.5);
                break;
            case 'Bottom':
                point.x += left + offset * bounds.width;
                point.y += top + wrapper.actualSize.height + (size / 2 + 12.5);
                break;
            case 'Left':
                point.x += left - (size / 2 + 12.5);
                point.y += top + offset * bounds.height;
                break;
            case 'Right':
                point.x += left + wrapper.actualSize.width + (size / 2 + 12.5);
                point.y += top + offset * bounds.height;
                break;
        }
        point.x += ((margin.left - margin.right) / transform.scale) +
            (size / 2) * (handle.horizontalAlignment === 'Center' ? 0 : (handle.horizontalAlignment === 'Right' ? -1 : 1));
        point.y += ((margin.top - margin.bottom) / transform.scale) +
            (size / 2) * (handle.verticalAlignment === 'Center' ? 0 : (handle.verticalAlignment === 'Top' ? -1 : 1));


    } else if (selectorItem.connectors.length > 0) {
        const connector: Connector = selectorItem.connectors[0] as Connector;
        const annotation: PathAnnotation = { offset: offset } as PathAnnotation;
        const connectorOffset: SegmentInfo = getOffsetOfConnector(connector.intermediatePoints, annotation);
        const index: number = connectorOffset.index;
        point = connectorOffset.point;
        const getPointloop: SegmentInfo = getAnnotationPosition(connector.intermediatePoints, annotation, bounds);
        //const points: PointModel[] = connector.intermediatePoints;
        //const offsetLength: number;
        const angle: number = getPointloop.angle;
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, -angle, connector.intermediatePoints[index].x, connector.intermediatePoints[index].y);
        point = transformPointByMatrix(matrix, point);
        point.x += (margin.left - margin.right) +
            (size / 2) * (handle.horizontalAlignment === 'Center' ? 0 : (handle.horizontalAlignment === 'Right' ? -1 : 1));
        point.y += (margin.top - margin.bottom) +
            (size / 2) * (handle.verticalAlignment === 'Center' ? 0 : (handle.verticalAlignment === 'Top' ? -1 : 1));
        matrix = identityMatrix();
        rotateMatrix(matrix, angle, connector.intermediatePoints[index].x, connector.intermediatePoints[index].y);
        point = transformPointByMatrix(matrix, point);
    }
    if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
        point = transformPointByMatrix(matrix, point);
    }
    return point;
}

/**
 * canResizeCorner method \
 *
 * @returns {SelectorConstraints } canResizeCorner method .\
 * @param {string} selectorConstraints - provide the selectorConstraints  value.
 * @param {string} action - provide the selectorConstraints  value.
 * @param {ThumbsConstraints} thumbsConstraints - provide the thumbsConstraints  value.
 * @param {Selector} selectedItems - provide the selectedItems  value.
 * @private
 */
export function canResizeCorner(
    selectorConstraints: SelectorConstraints, action: string, thumbsConstraints: ThumbsConstraints, selectedItems: Selector): boolean {
    if (selectedItems.annotation) {
        if (canResize(selectedItems.annotation)) { return true; }
    } else if ((SelectorConstraints[action] & selectorConstraints) && (ThumbsConstraints[action] & thumbsConstraints)) {
        return true;
    }
    return false;
}

/**
 * canShowCorner method \
 *
 * @returns {boolean } canShowCorner method .\
 * @param {SelectorConstraints} selectorConstraints - provide the selectorConstraints  value.
 * @param {string} action - provide the thumbsConstraints  value.
 * @private
 */
export function canShowCorner(selectorConstraints: SelectorConstraints, action: string): boolean {
    if (SelectorConstraints[action] & selectorConstraints) {
        return true;
    }
    return false;
}

/**
 * canShowControlPoints method \
 *
 * @returns {boolean } canShowControlPoints method .\
 * @param {ControlPointsVisibility} bezierControlPoints - provide the bezierControlPoints value.
 * @param {string} action - provide the value.
 * @private
 */
export function canShowControlPoints(bezierControlPoints: ControlPointsVisibility, action: string): boolean {
    if (ControlPointsVisibility[action] & bezierControlPoints) {
        return true;
    }
    return false;
}

/**
 * checkPortRestriction method \
 *
 * @returns {number } checkPortRestriction method .\
 * @param {PointPortModel} port - provide the port  value.
 * @param {PortVisibility} portVisibility - provide the portVisibility  value.
 * @private
 */
export function checkPortRestriction(port: PointPortModel, portVisibility: PortVisibility): number {
    return port.visibility & portVisibility;
}

/**
 * findAnnotation method \
 *
 * @returns {ShapeAnnotationModel | PathAnnotationModel | TextModel } findAnnotation method .\
 * @param { NodeModel | ConnectorModel} node - provide the port  value.
 * @param {string} id - provide the portVisibility  value.
 * @private
 */
export function findAnnotation(node: NodeModel | ConnectorModel, id: string): ShapeAnnotationModel | PathAnnotationModel | TextModel {
    let annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel;
    if (node.shape.type === 'Text') {
        annotation = (node.shape) as TextModel;
    } else {
        const annotationId: string[] = id.split('_');
        id = annotationId[annotationId.length - 1];
        for (let i: number = 0; i < node.annotations.length; i++) {
            if (id === node.annotations[i].id) {
                annotation = node.annotations[i];
            }
        }
    }
    return annotation;
}

/**
 * findPort method \
 *
 * @returns {PointPortModel} findPort method .\
 * @param { NodeModel | ConnectorModel} node - provide the port  value.
 * @param {string} id - provide the portVisibility  value.
 * @private
 */
export function findPort(node: NodeModel | ConnectorModel, id: string): PointPortModel {
    let port: PointPortModel;
    const portId: string[] = id.split('_');
    id = portId[portId.length - 1];
    if (node as NodeModel) {
        node = node as NodeModel;
        for (let i: number = 0; i < node.ports.length; i++) {
            if (id === node.ports[i].id) {
                return node.ports[i];
            }
        }
    }
    return port;
}

/**
 * getInOutConnectPorts method \
 *
 * @returns {PointPortModel} getInOutConnectPorts method .\
 * @param { NodeModel} node - provide the port  value.
 * @param {boolean} isInConnect - provide the portVisibility  value.
 * @private
 */
export function getInOutConnectPorts(node: NodeModel, isInConnect: boolean): PointPortModel {
    let port: PointPortModel = {};
    let i: number = 0;
    if (node.ports) {
        const ports: PointPortModel[] = node.ports;
        for (i = 0; i < ports.length; i++) {
            if (isInConnect) {
                if ((ports[i].constraints & PortConstraints.InConnect)) {
                    port = ports[i];
                }
            } else {
                if ((ports[i].constraints & PortConstraints.OutConnect)) {
                    port = ports[i];
                }
            }
        }
    }
    return port;
}


/**
 * findObjectIndex method \
 *
 * @returns {PointPortModel} findObjectIndex method .\
 * @param { NodeModel | ConnectorModel} node - provide the node  value.
 * @param {string} id - provide the string  value.
 * @param {boolean} annotation - provide the boolean  value.
 * @private
 */
export function findObjectIndex(node: NodeModel | ConnectorModel, id: string, annotation?: boolean): string {
    //let index: number;
    const collection: (PointPortModel | ShapeAnnotationModel | PathAnnotationModel)[]
        = (annotation) ? node.annotations : (node as NodeModel).ports;
    for (let i: number = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
            return (i).toString();
        }
    }
    return '-1';
}

/**
 * getObjectFromCollection method \
 *
 * @returns {boolean} getObjectFromCollection method .\
 * @param { (NodeModel | ConnectorModel)[] } obj - provide the node  value.
 * @param {string} id - provide the string  value.
 * @private
 */
export function getObjectFromCollection(obj: (NodeModel | ConnectorModel)[], id: string): boolean {
    let i: number;
    for (i = 0; i < obj.length; i++) {
        if (id === obj[i].id) {
            return true;
        }
    }
    return false;
}

/**
 * scaleElement method \
 *
 * @returns {void} scaleElement method .\
 * @param { DiagramElement } element - provide the element  value.
 * @param {number} sw - provide the string  value.
 * @param {number} sh - provide the string  value.
 * @param {DiagramElement} refObject - provide the refObject  value.
 * @private
 */
export function scaleElement(element: DiagramElement, sw: number, sh: number, refObject: DiagramElement): void {
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
            scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
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
 * scaleElement method \
 *
 * @returns {void} scaleElement method .\
 * @param { Node } obj - provide the obj  value.
 * @param {number} x - provide the x  value.
 * @param {number} y - provide the y  value.
 * @param {DiagramElement} nameTable - provide the refObject  value.
 * @param {DiagramElement} drop - provide the drop  value.
 * @param {DiagramElement} diagram - provide the diagram  value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function arrangeChild(obj: Node, x: number, y: number, nameTable: {}, drop: boolean, diagram: Diagram | SymbolPalette): void {
    const child: string[] = obj.children;
    let node: Node;
    for (let i: number = 0; i < child.length; i++) {
        node = nameTable[child[i]];
        if (node) {
            if (node.children) {
                arrangeChild(node, x, y, nameTable, drop, diagram);
            } else {
                node.offsetX -= x;
                node.offsetY -= y;
                if (!drop) {
                    //let content: DiagramElement;
                    //let container: Container;
                    nameTable[node.id] = node;
                    const container: Container = node.initContainer();
                    if (!container.children) {
                        container.children = [];
                    }
                    const content: DiagramElement = node.init(diagram);
                    container.children.push(content);
                    container.measure(new Size(node.width, node.height));
                    container.arrange(container.desiredSize);
                }
            }
        }
    }
}

/**
 * insertObject method \
 *
 * @returns {void} insertObject method .\
 * @param { NodeModel | ConnectorModel } obj - provide the obj  value.
 * @param { string } key - provide the obj  value.
 * @param { Object[]} collection - provide the x  value.
 * @private
 */
export function insertObject(obj: NodeModel | ConnectorModel, key: string, collection: Object[]): void {
    if (collection.length === 0) {
        collection.push(obj);
    } else if (collection.length === 1) {
        if (collection[0][key] > obj[key]) {
            collection.splice(0, 0, obj);
        } else {
            collection.push(obj);
        }
    } else if (collection.length > 1) {
        let low: number = 0;
        let high: number = collection.length - 1;
        let mid: number = Math.floor((low + high) / 2);
        while (mid !== low) {
            if (collection[mid][key] < obj[key]) {
                low = mid;
                mid = Math.floor((low + high) / 2);
            } else if (collection[mid][key] > obj[key]) {
                high = mid;
                mid = Math.floor((low + high) / 2);
            } else {
                break;
            }
        }
        if (collection[high][key] < obj[key]) {
            collection.push(obj);
        } else if (collection[low][key] > obj[key]) {
            collection.splice(low, 0, obj);
        } else if ((collection[low][key] < obj[key]) && collection[high][key] > obj[key]) {
            collection.splice(high, 0, obj);
        }
    }
}

/**
 * getElement method \
 *
 * @returns {Object} getElement method .\
 * @param { DiagramHtmlElement | DiagramNativeElement } element - provide the obj  value.
 * @private
 */
export function getElement(element: DiagramHtmlElement | DiagramNativeElement): Object {
    const diagramElement: Object = document.getElementById(element.diagramId);
    const instance: string = 'ej2_instances';
    // eslint-disable-next-line
    let node: {} = {};
    let nodes: Object = diagramElement[instance][0].nodes;
    if (nodes === undefined) {
        nodes = getPaletteSymbols(diagramElement[instance][0]);
    }
    const length: string = 'length';
    for (let i: number = 0; nodes && i < nodes[length]; i++) {
        if (nodes[i].id === element.nodeId) {
            return getAnnotation(nodes[i], element);
        }
    }
    const connectors: Object = diagramElement[instance][0].connectors;
    for (let i: number = 0; connectors && i < connectors[length]; i++) {
        if (connectors[i].id === element.nodeId) {
            return getAnnotation(connectors[i], element);
        }
    }
    // eslint-disable-next-line
    const enterObject: {} = diagramElement[instance][0].enterObject;
    if (enterObject && (enterObject['id'] === element.nodeId || enterObject['children'])) {
        if (enterObject['children'] && groupHasType(enterObject as Node, 'HTML', diagramElement[instance][0].enterTable)) {
            return diagramElement[instance][0].enterTable[element.nodeId];
        } else {
            return enterObject;
        }
    }
    return null;
}
/**
 * getAnnotation method \
 *
 * @returns {Object} getAnnotation method .\
 * @param { Object } obj - provide the obj  value.
 * @param {  DiagramHtmlElement | DiagramNativeElement } element - provide the obj  value.
 * @private
 */
function getAnnotation(obj: Object, element: DiagramHtmlElement | DiagramNativeElement): Object {
    const annotations: Object = (obj as NodeModel | ConnectorModel).annotations;
    const length: string = 'length';
    let j: number;
    for (j = 0; annotations && j < annotations[length]; j++) {
        if ((element as DiagramHtmlElement).annotationId && annotations[j].id === (element as DiagramHtmlElement).annotationId) {
            return annotations[j];
        }
    }
    return obj;
}

/**
 * getPaletteSymbols method \
 *
 * @returns {NodeModel[]} getPaletteSymbols method .\
 * @param { Object } symbolPalette - provide the symbolPalette  value.
 * @private
 */
function getPaletteSymbols(symbolPalette: SymbolPalette): NodeModel[] {
    const nodes: NodeModel[] = [];
    for (let i: number = 0; i < symbolPalette.palettes.length; i++) {
        const symbols: (NodeModel | ConnectorModel)[] = symbolPalette.palettes[i].symbols;
        for (let j: number = 0; j < symbols.length; j++) {
            if (symbols[j] instanceof Node) {
                nodes.push(symbols[j] as NodeModel);
            }
        }
    }
    return nodes;
}
/**
 * getCollectionChangeEventArguements method \
 *
 * @returns {IBlazorCollectionChangeEventArgs} getCollectionChangeEventArguements method .\
 * @param { IBlazorCollectionChangeEventArgs } args1 - provide the args1  value.
 * @param { NodeModel | ConnectorModel } obj - provide the obj  value.
 * @param { EventState } state - provide the state  value.
 * @param { ChangeType } type - provide the type  value.
 * @private
 */
export function getCollectionChangeEventArguements(
    args1: IBlazorCollectionChangeEventArgs,
    obj: NodeModel | ConnectorModel, state: EventState, type: ChangeType):
    IBlazorCollectionChangeEventArgs {
    if (isBlazor()) {
        args1 = {
            cause: args1.cause, state: state, type: type, cancel: false,
            element: getObjectType(obj) === Connector ?
                { connector: cloneBlazorObject(obj) as ConnectorModel } : { node: cloneBlazorObject(obj) as NodeModel }
        };
    }
    return args1;
}
/**
 * getDropEventArguements method \
 *
 * @returns {IBlazorDropEventArgs} getDropEventArguements method .\
 * @param { MouseEventArgs } args - provide the args1  value.
 * @param { IBlazorDropEventArgs } arg - provide the obj  value.
 * @private
 */
 export function getDropEventArguements(args: MouseEventArgs, arg: IBlazorDropEventArgs): IBlazorDropEventArgs {
    if (isBlazor()) {
        const isConnector: boolean = (getObjectType(args.source) === Connector);
        const object: Object = cloneBlazorObject(args.source);
        const target: Object = cloneBlazorObject(args.target);
        // BLAZ-20491 - Added the below code to check whether selector has nodes or connectors in it.
        // If it does not have means then we can directly access node.
        let connector: ConnectorModel;
        let node: NodeModel;
        if ((object as Selector).connectors && (object as Selector).connectors.length > 0) {
            connector = (object as Selector).connectors[0] as ConnectorModel;
        } else {
            connector = object;
        }
        if ((object as Selector).nodes && (object as Selector).nodes.length > 0) {
            node = (object as Selector).nodes[0] as NodeModel;
        } else {
            node = object;
        }
        arg = {
            element: isConnector ? {
                connector: connector,
                connectorId: connector.id
            }
                : { node: node, nodeId: node.id },
            target: isConnector ? { connector: target } : { node: target },
            position: arg.position, cancel: arg.cancel
        } as IBlazorDropEventArgs;
    }
    return arg;
}
/**
 * getPoint method \
 *
 * @returns {PointModel} getPoint method .\
 * @param { number } x - provide the x  value.
 * @param { number } y - provide the y  value.
 * @param { number } w - provide the w  value.
 * @param { number } h - provide the y  value.
 * @param { number } angle - provide the y  value.
 * @param { number } offsetX - provide the y  value.
 * @param { number } offsetY - provide the y  value.
 * @param { PointModel } cornerPoint - provide the y  value.
 * @private
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


/* eslint-disable */

/**
 * Get the object as Node | Connector \
 *
 * @returns {Object} Get the object as Node | Connector .\
 * @param { number } obj - provide the x  value.
 * @private
 */

export let getObjectType: Function = (obj: Object): Object => {
    if (obj) {
        if ((obj as Connector).sourceID !== undefined || (obj as Connector).sourcePoint !== undefined ||
            (obj as Connector).targetID !== undefined || (obj as Connector).targetPoint !== undefined ||
            (obj as Connector).type !== undefined) {
            obj = Connector;
        } else {
            obj = Node;
        }
    }
    return obj;
};


/** @private */
export let flipConnector: Function = (connector: Connector): void => {
    if (!connector.sourceID && !connector.targetID) {
        let source: PointModel = { x: connector.sourcePoint.x, y: connector.sourcePoint.y };
        let target: PointModel = { x: connector.targetPoint.x, y: connector.targetPoint.y };
        if (connector.flip === 'Horizontal') {
            connector.sourcePoint.x = target.x;
            connector.targetPoint.x = source.x;
        } else if (connector.flip === 'Vertical') {
            connector.sourcePoint.y = target.y;
            connector.targetPoint.y = source.y;
        } else if (connector.flip === 'Both') {
            connector.sourcePoint = target;
            connector.targetPoint = source;
        }
    }
};

/** @private */
export let updatePortEdges: Function = (portContent: DiagramElement, flip: FlipDirection, port: PointPortModel): DiagramElement => {
    let offsetX: number = port.offset.x;
    let offsetY: number = port.offset.y;
    if (flip === 'Horizontal') {
        offsetX = 1 - port.offset.x;
        offsetY = port.offset.y;
    } else if (flip === 'Vertical') {
        offsetX = port.offset.x;
        offsetY = 1 - port.offset.y;
    } else if (flip === 'Both') {
        offsetX = 1 - port.offset.x;
        offsetY = 1 - port.offset.y;
    }
    portContent.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
    return portContent;
};

/** @private */
export let alignElement: Function = (element: Container, offsetX: number, offsetY: number, diagram: Diagram, flip: FlipDirection): void => {
    if (element.hasChildren()) {
        for (let child of element.children) {
            let childX: number = ((offsetX - child.offsetX) + offsetX);
            let childY: number = ((offsetY - child.offsetY) + offsetY);
            if (flip === 'Horizontal' || flip === 'Both') {
                child.offsetX = childX;
                child.flipOffset.x = childX - child.desiredSize.width / 2;
            }
            if (flip === 'Vertical' || flip === 'Both') {
                child.offsetY = childY;
                child.flipOffset.y = childY - child.desiredSize.height / 2;
            }
            if (child instanceof Canvas || child instanceof Container) {
                alignElement(child, offsetX, offsetY, diagram, flip);
            }
            child.measure(new Size(child.bounds.width, child.bounds.height));
            child.arrange(child.desiredSize);
            let node: Node = diagram.nameTable[child.id];
            if (node) {
                diagram.updateConnectorEdges(node);
            }
        }
    }
};

/** @private */
export let cloneSelectedObjects: Function = (diagram: Diagram): object => {
    let nodes: NodeModel[] = diagram.selectedItems.nodes;
    let connectors: ConnectorModel[] = diagram.selectedItems.connectors;
    let isProtectedOnChange: string = 'isProtectedOnChange';
    let isEnableServerDatabind: boolean = diagram.allowServerDataBinding;
    let isProtectedOnChangeValue: boolean = diagram[isProtectedOnChange];
    diagram.protectPropertyChange(true);
    diagram.allowServerDataBinding = false;
    diagram.selectedItems.nodes = [];
    diagram.selectedItems.connectors = [];
    diagram.allowServerDataBinding = isEnableServerDatabind;
    diagram.protectPropertyChange(isProtectedOnChangeValue);
    let clonedSelectedItems: object = cloneObject(diagram.selectedItems);
    for (let i: number = 0; i < nodes.length; i++) {
        diagram.selectedItems.nodes.push(diagram.nameTable[nodes[i].id]);
    }
    for (let i: number = 0; i < connectors.length; i++) {
        diagram.selectedItems.connectors.push(diagram.nameTable[connectors[i].id]);
    }
    return clonedSelectedItems as object;
};

/** @private */
export let updatePathElement: Function = (anglePoints: PointModel[], connector: ConnectorModel): PathElement => {
    let pathElement: PathElement = new PathElement();
    let pathseqData: object;
    for (let j: number = 0; j < anglePoints.length - 1; j++) {
        pathseqData = findPath(anglePoints[j], anglePoints[j + 1]);
        pathElement.data = pathseqData[0];
        pathElement.id = connector.id + '_' + ((connector.shape as BpmnFlow).sequence);
        pathElement.offsetX = pathseqData[1].x;
        pathElement.offsetY = pathseqData[1].y;
        pathElement.rotateAngle = 45;
        pathElement.transform = Transform.Self;
    }
    return pathElement;
};
/** @private */
export let checkPort: Function = (node: Node, element: DiagramElement): boolean => {
    if (node instanceof Node) {
        for (let i: number = 0; i < node.ports.length; i++) {
            if (node.ports[i].id === element.id.split('_')[1]) {
                return true;
            }
        }
    }
    return false;
};
/** @private */
export let findPath: Function = (sourcePoint: PointModel, targetPoint: PointModel): Object => {
    let beginningpoint: PointModel = { x: sourcePoint.x, y: sourcePoint.y };
    let distance: number = findDistance(sourcePoint, targetPoint);
    distance = Math.min(30, distance / 2);
    let angle: number = findAngle(sourcePoint, targetPoint);
    let transferpt: PointModel = Point.transform({ x: beginningpoint.x, y: beginningpoint.y }, angle, distance);
    let startpoint: PointModel = Point.transform({ x: transferpt.x, y: transferpt.y }, angle, -12);
    let endpoint: PointModel = Point.transform({ x: startpoint.x, y: startpoint.y }, angle, 12 * 2);
    let path: string = 'M' + startpoint.x + ' ' + startpoint.y + ' L' + endpoint.x + ' ' + endpoint.y;
    return [path, transferpt];
};
/** @private */
export let getConnectorDirection: Function = (src: PointModel, tar: PointModel): string => {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'Right' : 'Left';
    } else {
        return src.y < tar.y ? 'Bottom' : 'Top';
    }
};


/** @private */
export let findDistance: Function = (point1: PointModel, point2: PointModel): number => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};
/* eslint-enable */



/**
 * cloneBlazorObject method \
 *
 * @returns {Object} cloneBlazorObject method .\
 * @param { object } args - provide the args  value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function cloneBlazorObject(args: object): Object {
    if (isBlazor()) {
        args = cloneObject(args);
    }
    return args;
}

/**
 * checkBrowserInfo method \
 *
 * @returns {Object} checkBrowserInfo method .\
 * @private
 */
export function checkBrowserInfo(): boolean {
    if ((navigator.platform.indexOf('Mac') >= 0 || navigator.platform.indexOf('iPad') >= 0
        || navigator.platform.indexOf('iPhone') >= 0 || navigator.platform.indexOf('MacIntel') >= 0)
        && (Browser.info.name === 'safari' || Browser.info.name === 'webkit')) {
        return true;
    }
    return false;
}

/**
 * canMeasureDecoratorPath method \
 *
 * @returns {boolean} canMeasureDecoratorPath method .\
 * @param { string[] } objects - provide the args  value.
 * @private
 */
export function canMeasureDecoratorPath(objects: string[]): boolean {
    if (objects.indexOf('shape') !== -1 || objects.indexOf('pathData') !== -1 ||
        objects.indexOf('width') !== -1 || objects.indexOf('height') !== -1) {
        return true;
    }
    return false;
}

/**
 * getPreviewSize method \
 *
 * @returns {Size} getPreviewSize method .\
 * @param { SymbolPaletteModel } sourceElement - provide the args  value.
 * @param { Node } clonedObject - provide the args  value.
 * @param { DiagramElement } wrapper - provide the args  value.
 * @private
 */
export function getPreviewSize(sourceElement: SymbolPaletteModel, clonedObject: Node, wrapper: DiagramElement): Size {
    //let previewWidth: number;
    //let previewHeight: number;
    const previewWidth: number = getSymbolSize(sourceElement as SymbolPaletteModel, clonedObject as Node, wrapper, 'width');
    const previewHeight: number = getSymbolSize(sourceElement as SymbolPaletteModel, clonedObject as Node, wrapper, 'height');
    return new Size(previewWidth, previewHeight);
}

/**
 * getSymbolSize method \
 *
 * @returns {number} getSymbolSize method .\
 * @param { SymbolPaletteModel } sourceElement - provide the sourceElement  value.
 * @param { Node } clonedObject - provide the clonedObject  value.
 * @param { DiagramElement } wrapper - provide the wrapper  value.
 * @param { string } size - provide the size  value.
 * @private
 */
export function getSymbolSize(sourceElement: SymbolPaletteModel, clonedObject: Node, wrapper: DiagramElement, size: string): number {
    let previewSize: number = 0;
    if ((clonedObject as Node).previewSize[size] !== undefined) {
        previewSize = (clonedObject as Node).previewSize[size];
    } else if ((sourceElement as SymbolPaletteModel).symbolPreview[size] !== undefined) {
        previewSize = (sourceElement as SymbolPaletteModel).symbolPreview[size];
    } else {
        previewSize = (clonedObject as Node)[size] || wrapper.actualSize[size];
    }
    return previewSize;
}

/**
 * findParent method \
 *
 * @returns {string} findParent method .\
 * @param { Node } clonedObject - provide the clonedObject  value.
 * @param { Diagram } wrapper - provide the diagram  element.
 * @param { string } size - provide the parent id.
 * @private
 */
export function findParentInSwimlane(node: Node, diagram: Diagram, parent: string): string {
    if (node && node.parentId) {
        node = diagram.nameTable[node.parentId];
        if (node.parentId) {
            parent = findParentInSwimlane(node, diagram, parent);
        }
        else {
            parent = node.id;
        }
    }
    return parent;
}

/**
 * selectionHasConnector method \
 *
 * @returns {boolean} selectionHasConnector method .\
 * @param { Diagram } wrapper - provide the diagram  element.
 * @param { selector } size - provide the selector element.
 * @private
 */
 export function selectionHasConnector(diagram: Diagram, selector: Selector): boolean {
    if (diagram.selectedItems.connectors.length > 1 && diagram.selectedItems.nodes.length === 0 && selector.rotateAngle !== 0) {
        return true;
    }
    return false; 
}
