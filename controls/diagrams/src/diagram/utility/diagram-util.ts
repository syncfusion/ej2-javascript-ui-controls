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
    PortVisibility, ConnectorConstraints, NodeConstraints, Shapes,
    UmlActivityShapes, PortConstraints, DiagramConstraints, DiagramTools, Transform, EventState, ChangeType
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
    NativeModel, HtmlModel, UmlActivityShapeModel, SwimLaneModel, ShapeModel
} from './../objects/node-model';
import {
    Node, FlowShape, BasicShape, Native, Html, UmlActivityShape, BpmnGateway, BpmnDataObject, BpmnEvent, BpmnSubEvent, BpmnActivity,
    BpmnAnnotation, MethodArguments, UmlClassAttribute, UmlClassMethod, UmlClass, UmlInterface, UmlEnumerationMember, UmlEnumeration,
    Lane, Shape, Phase, ChildContainer, SwimLane, Path, Image, Text, BpmnShape, UmlClassifierShape, Header
} from './../objects/node';
import { NodeModel } from './../objects/node-model';
import { BpmnFlow, RelationShip } from './../objects/connector';
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
import { isBlazor, Browser } from '@syncfusion/ej2-base';
import { TreeInfo, INode } from '../layout/layout-base';
import { MouseEventArgs } from '../interaction/event-handlers';
import { IBlazorDropEventArgs, IBlazorCollectionChangeEventArgs } from '../objects/interface/IElement';



/** @private */
export function completeRegion(region: Rect, selectedObjects: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
    let collection: (NodeModel | ConnectorModel)[] = [];
    for (let i: number = 0; i < selectedObjects.length; i++) {
        let obj: (NodeModel | ConnectorModel) = selectedObjects[i];
        if (region.containsRect(obj.wrapper.bounds)) {
            collection.push(obj);
        }
    }
    return collection;
}

/** @private */
export function findNodeByName(nodes: (NodeModel | ConnectorModel)[], name: string): boolean {
    for (let i: number = 0; i < nodes.length; i++) {
        if (nodes[i].id === name) {
            return true;
        }
    }
    return false;
}

/**
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
 * @private
 */
export function setUMLActivityDefaults(child: NodeModel | ConnectorModel, node: NodeModel | ConnectorModel): void {
    if (node instanceof Node) {
        switch ((child.shape as UmlActivityShape).shape) {
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
        switch ((child.shape as ActivityFlow).flow) {
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

/**
 * @private
 */
export function setConnectorDefaults(child: ConnectorModel, node: ConnectorModel): void {
    switch ((child.shape).type) {
        case 'Bpmn':
            switch ((child.shape as BpmnFlow).flow) {
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
            switch ((child.shape as ActivityFlow).flow) {
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
            } else if ((child.shape as RelationShip).relationship === 'Aggregation') {
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

function pointsForBezier(connector: ConnectorModel): PointModel[] {
    let points: PointModel[] = [];
    if (connector.type === 'Bezier') {
        let k: number = 0;
        for (let i: number = 0; i < connector.segments.length; i++) {
            let tolerance: number = 1.5; let segment: BezierSegment = (connector.segments[i] as BezierSegment);
            let pt: PointModel = { x: 0, y: 0 };
            let point1: PointModel = !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1;
            let point2: PointModel = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
            let max: number = Number(((connector as Connector).distance(point1, segment.points[0]) +
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

/** @private */
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

/** @private */
export function groupHasType(node: NodeModel, type: Shapes, nameTable: {}): boolean {
    let contains: boolean = false;
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

/** @private */
export function updateDefaultValues(
    actualNode: NodeModel | ConnectorModel, plainValue: NodeModel | ConnectorModel,
    defaultValue: object, property?: NodeModel | ConnectorModel, oldKey?: string):
    void {
    if (defaultValue && ((actualNode instanceof Connector) || actualNode
        && ((actualNode.shape && actualNode.shape.type !== 'SwimLane') || actualNode.shape === undefined))) {
        let keyObj: object;
        for (let key of Object.keys(defaultValue)) {
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
                                property.ports.push(createObject);
                            }
                        }

                    }
                }
            }
        }
    }
}
/* tslint:disable:no-string-literal */
/** @private */
export function updateLayoutValue(actualNode: TreeInfo, defaultValue: object, nodes?: INode[], node?: INode): void {
    let keyObj: object;
    if (defaultValue) {
        for (let key of Object.keys(defaultValue)) {
            keyObj = defaultValue[key];
            if (key === 'getAssistantDetails') {
                if (node.data['Role'] === defaultValue[key]['root']) {
                    let assitants: string[] = defaultValue[key]['assistants'];
                    for (let i: number = 0; i < assitants.length; i++) {
                        for (let j: number = 0; j < nodes.length; j++) {
                            if (nodes[j].data['Role'] === assitants[i]) {
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
}
/* tslint:enable:no-string-literal */

/** @private */
export function isPointOverConnector(connector: ConnectorModel, reference: PointModel): boolean {
    let intermediatePoints: PointModel[];
    intermediatePoints = connector.type === 'Bezier' ? pointsForBezier(connector) :
        (connector as Connector).intermediatePoints;
    for (let i: number = 0; i < intermediatePoints.length - 1; i++) {
        let start: PointModel = intermediatePoints[i];
        let end: PointModel = intermediatePoints[i + 1];
        let rect: Rect = Rect.toBounds([start, end]);
        rect.Inflate(connector.hitPadding);

        if (rect.containsPoint(reference)) {
            let intersectinPt: PointModel = findNearestPoint(reference, start, end);
            let segment1: Segment = { x1: start.x, x2: end.x, y1: start.y, y2: end.y };
            let segment2: Segment = { x1: reference.x, x2: intersectinPt.x, y1: reference.y, y2: intersectinPt.y };
            let intersectDetails: Intersection = intersect3(segment1, segment2);
            if (intersectDetails.enabled) {
                let distance: number = Point.findLength(reference, intersectDetails.intersectPt);
                if (Math.abs(distance) < connector.hitPadding) {
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
    if (connector.annotations.length > 0) {
        let container: DiagramElement[] = connector.wrapper.children;
        for (let i: number = 3; i < container.length; i++) {
            let textElement: DiagramElement = container[i];
            if (textElement.bounds.containsPoint(reference)) {
                return true;
            }
        }
    }
    return false;
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
export function getPoints(element: DiagramElement, corners: Corners, padding?: number): PointModel[] {
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


/**
 * @private
 * sets the offset of the tooltip.
 * @param diagram
 * @param mousePosition 
 * @param node 
 */
export function getTooltipOffset(diagram: Diagram, mousePosition: PointModel, node: NodeModel | ConnectorModel): PointModel {
    let offset: PointModel;
    let inheritTooltip: number = (node instanceof Node) ? ((node as NodeModel).constraints & NodeConstraints.InheritTooltip)
        : (node.constraints & ConnectorConstraints.InheritTooltip);
    let objectTooltip: number = (node instanceof Node) ? ((node as NodeModel).constraints & NodeConstraints.Tooltip)
        : (node.constraints & ConnectorConstraints.Tooltip);
    let isMouseBased: Boolean = ((!inheritTooltip && objectTooltip ? node.tooltip.relativeMode
        : diagram.tooltip.relativeMode) === 'Mouse') ? true : false;
    offset = tooltipOffset(node, mousePosition, diagram, isMouseBased);
    let rulerSize: Size = getRulerSize(diagram);
    return { x: offset.x + rulerSize.width, y: offset.y + rulerSize.height };
}

function tooltipOffset(node: NodeModel | ConnectorModel, mousePosition: PointModel, diagram: Diagram, isMouseBased: Boolean): PointModel {
    let point: PointModel = {};
    let scale: number = diagram.scroller.transform.scale;
    let element: HTMLElement = document.getElementById(diagram.element.id);
    let bounds: Rect = node.wrapper.bounds;
    let rect: Rect = element.getBoundingClientRect() as Rect;
    let horizontalOffset: number = diagram.scroller.horizontalOffset;
    let verticalOffset: number = diagram.scroller.verticalOffset;
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
function offsetPoint(
    mousePosition: PointModel, bound: PointModel, diagram: Diagram, isMouseBased: Boolean, x: number, y: number): PointModel {
    let point: PointModel = {};
    let scale: number = diagram.scroller.transform.scale;
    let horizontalOffset: number = diagram.scroller.horizontalOffset;
    let verticalOffset: number = diagram.scroller.verticalOffset;
    point.x = (isMouseBased ? mousePosition.x : bound.x) * scale + horizontalOffset - x;
    point.y = (isMouseBased ? mousePosition.y : bound.y) * scale + verticalOffset - y;
    return point;
}


/** @private */
export function sort(objects: (NodeModel | ConnectorModel)[], option: DistributeOptions): (NodeModel | ConnectorModel)[] {
    let i: number = 0;
    let j: number = 0;
    let temp: NodeModel | ConnectorModel;
    for (i = 0; i < objects.length; i++) {
        let b: Rect = getBounds(objects[i].wrapper);
        for (j = 0; j < objects.length; j++) {
            let bounds: Rect = getBounds(objects[j].wrapper);
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

/** @private */
export function getAnnotationPosition(pts: PointModel[], annotation: PathAnnotation, bound: Rect): SegmentInfo {
    let angle: number;
    let getloop: SegmentInfo; let point: PointModel;
    getloop = getOffsetOfConnector(pts, annotation, bound);
    angle = Point.findAngle(pts[getloop.index], pts[getloop.index + 1]);
    let alignednumber: number = getAlignedPosition(annotation);
    point = Point.transform(getloop.point, angle + 45, alignednumber);
    getloop.point = point; getloop.angle = angle;
    return getloop;
}
/** @private */
export function getOffsetOfConnector(points: PointModel[], annotation: PathAnnotation, bounds: Rect): SegmentInfo {
    let length: number = 0; let offset: number = annotation.offset; let point: PointModel; let angle: number;
    let offsetLength: number; let lengths: number[] = []; let prevLength: number; let kCount: number;
    for (let j: number = 0; j < points.length - 1; j++) {
        length += Point.distancePoints(points[j], points[j + 1]);
        lengths.push(length);
    }
    offsetLength = offset * length;
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
/** @private */
export function getAlignedPosition(annotation: PathAnnotation): number {
    let cnst: number = annotation.content === undefined ? 10 : 0;
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
/** @private */
export function alignLabelOnSegments(obj: PathAnnotation, ang: number, pts: PointModel[]): Alignment {
    let angle: number = ang % 360;
    ang %= 360;
    let fourty5: number = 45; let one35: number = 135; let two25: number = 225; let three15: number = 315;
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
            hAlign = 'center';
            vAlign = 'center';
            break;
    }
    if (obj.offset === 0 || obj.offset === 1) {
        let direction: string;
        direction = getBezierDirection(pts[0], pts[1]);
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
/** @private */
export function getBezierDirection(src: PointModel, tar: PointModel): string {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'right' : 'left';
    } else {
        return src.y < tar.y ? 'bottom' : 'top';
    }
}

/** @private */
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

function getChild(child: Canvas, children: string[]): string[] {
    if (child && child.children && child.children.length > 0) {
        for (let j: number = 0; j < child.children.length; j++) {
            let subChild: DiagramElement = child.children[j];
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

function getSwimLaneChildren(nodes: NodeModel[]): string[] {
    let children: string[] = []; let node: Node; let grid: GridPanel; let childTable: DiagramElement[];
    let child: Canvas; let gridChild: string = 'childTable';
    for (let i: number = 0; i < nodes.length; i++) {
        node = nodes[i] as Node;
        if (node.shape.type === 'SwimLane') {
            grid = node.wrapper.children[0] as GridPanel;
            childTable = grid[gridChild];
            for (let key of Object.keys(childTable)) {
                child = childTable[key];
                children = getChild(child as Canvas, children);
            }
        }
    }
    return children;
}

function removeUnnecessaryNodes(children: string[], diagram: Diagram): void {
    let nodes: NodeModel[] = diagram.nodes;
    if (nodes) {
        for (let i: number = 0; i < nodes.length; i++) {
            if (children.indexOf(nodes[i].id) !== -1) {
                nodes.splice(i, 1);
                i--;
            }
        }
    }
}

/** @private */
export function serialize(model: Diagram): string {
    let removeNodes: string[] = getSwimLaneChildren(model.nodes);
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

function preventDefaults(clonedObject: Object, model: object, defaultObject?: object, isNodeShape?: boolean): object {
    defaultObject = getConstructor(model, defaultObject);
    let properties: string[] = [];
    properties = properties.concat(Object.keys(clonedObject));
    for (let property of properties) {
        if (model instanceof Node) {
            isNodeShape = (property === 'shape') ? true : false;
        }
        if (clonedObject[property] instanceof Array) {
            preventArrayDefaults(clonedObject, defaultObject, model, property);
        } else if (clonedObject[property] instanceof Object) {
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
    return clonedObject;
}

function preventArrayDefaults(clonedObject: object, defaultObject: object, model: object, property: string): void {
    if (clonedObject[property].length === 0) {
        delete clonedObject[property];
        // tslint:disable-next-line:no-any
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
                        (defaultObject[property] !== undefined ? defaultObject[property][i] : undefined)
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
}

/* tslint:disable */
function getConstructor(model: object, defaultObject: object): object {
    let obj: object = []; let constructor: object;
    let parent: object = new Diagram();
    let getClassName: string = 'getClassName';
    if (model[getClassName]) {
        switch (model[getClassName]()) {
            case 'Diagram':
                constructor = new Diagram(); break;
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
    return constructor;
}

/* tslint:enable */
/** @private */
export function deserialize(model: string, diagram: Diagram): Object {
    diagram.clear();
    diagram.protectPropertyChange(true);
    let map: Function | string = diagram.dataSourceSettings.doBinding;
    let nodeTemp: Function | string = diagram.setNodeTemplate;
    let getDescription: Function | string = diagram.getDescription;
    let getCustomProperty: Function | string = diagram.getCustomProperty;


    let commands: {} = {};
    for (let command of diagram.commandManager.commands) {
        commands[command.name] = { execute: command.execute, canExecute: command.canExecute };
    }
    let arrangeTickHorizontal: Function | string = diagram.rulerSettings.horizontalRuler.arrangeTick;
    let arrangeTickVertical: Function | string = diagram.rulerSettings.verticalRuler.arrangeTick;
    let getLayoutInfo: Function | string = diagram.layout.getLayoutInfo;
    let getBranch: Function | string = diagram.layout.getBranch;

    let nodeDefaults: Function | string = diagram.getNodeDefaults;
    let connectorDefaults: Function | string = diagram.getConnectorDefaults;

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
    for (let cmd of diagram.commandManager.commands) {
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
    if (dataObj.nodes.length) {
        for (let i: number = 0; i < dataObj.nodes.length; i++) {
            if (dataObj.nodes[i].shape && dataObj.nodes[i].shape.type === 'SwimLane') {
                pasteSwimLane(dataObj.nodes[i] as NodeModel, undefined, undefined, undefined, undefined, true);
            }
        }
    }
    diagram.nodes = dataObj.nodes || [];
    diagram.rulerSettings = dataObj.rulerSettings || {};
    diagram.snapSettings = dataObj.snapSettings || {};
    diagram.width = dataObj.width || '100%';
    diagram.layout = dataObj.layout || {};
    diagram.layout.getLayoutInfo = getFunction(getLayoutInfo);
    diagram.layout.getBranch = getFunction(getBranch);
    diagram.diagramActions = 0;
    diagram.isLoading = true;
    diagram.protectPropertyChange(false);
    let key: string = 'refresh';

    let component: View | Diagram;
    for (let i: number = 0; i < diagram.views.length; i++) {
        component = diagram.views[diagram.views[i]] as Diagram;
        component.refresh();
        if (component instanceof Diagram) {
            diagram.element.classList.add('e-diagram');
        }
    }
    if (dataObj.selectedItems) {
        dataObj.selectedItems.nodes = [];
        dataObj.selectedItems.connectors = [];
    }
    diagram.selectedItems = dataObj.selectedItems;
    return dataObj;
}

/** @private */
export function upgrade(dataObj: Diagram): Diagram {
    if (dataObj && (dataObj.version === undefined || (dataObj.version < 17.1))) {
        let nodes: NodeModel[] = dataObj.nodes;
        for (let node of nodes) {
            if (node && node.ports.length > 0) {
                for (let port of node.ports) {
                    if (port && port.constraints && port.constraints === PortConstraints.None) {
                        port.constraints = PortConstraints.Default;
                    }
                }
            }
        }
    }
    return dataObj;
}

/** @private */
export function updateStyle(changedObject: TextStyleModel, target: DiagramElement): void {
    //since text style model is the super set of shape style model, we used text style model
    let style: TextStyleModel = target.style as TextStyleModel;
    let textElement: TextElement = target as TextElement;
    target.canApplyStyle = true;
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
            case 'gradient':
                updateGradient(changedObject.gradient, style.gradient);
                break;
        }
    }
    if (target instanceof TextElement) {
        textElement.refreshTextElement();
    }
}

function updateGradient(
    changedGradient: GradientModel | LinearGradientModel | RadialGradientModel,
    targetGradient: GradientModel | LinearGradientModel | RadialGradientModel
): void {
    for (let key of Object.keys(changedGradient)) {
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

/** @private */
export function updateHyperlink(changedObject: HyperlinkModel, target: DiagramElement, actualAnnotation: AnnotationModel): void {
    let textElement: TextElement = target as TextElement;
    let hyperlink: HyperlinkModel = textElement.hyperlink;
    for (let key of Object.keys(changedObject)) {
        switch (key) {
            case 'color':
                textElement.style.color = hyperlink.color = changedObject.color;
                break;
            case 'content':
                textElement.content = hyperlink.content = changedObject.content || hyperlink.link;
                break;
            case 'link':
                let labelStyle: TextStyleModel = actualAnnotation.style;
                textElement.style.color = changedObject.link ? hyperlink.color : labelStyle.color;
                textElement.style.textDecoration = changedObject.link ? hyperlink.textDecoration : actualAnnotation.style.textDecoration;
                textElement.content = changedObject.link ? hyperlink.content || changedObject.link : actualAnnotation.content;
                hyperlink.link = changedObject.link;
                break;
            case 'textDecoration':
                textElement.style.textDecoration = hyperlink.textDecoration = changedObject.textDecoration;
                break;
        }
    }
}

/** @private */
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
    let view: View;
    for (let elementId of diagram.views) {
        removeElement(actualObject.id + '_groupElement', elementId);
        removeElement(actualObject.id + '_content_groupElement', elementId);
        removeElement(actualObject.id + '_html_element', elementId);
    }
    actualObject.wrapper.children.splice(0, 1);
    actualObject.wrapper.children.splice(0, 0, content);
}

/** @private */
export function updateShape(node: Node, actualObject: Node, oldObject: Node, diagram: Diagram): void {
    let content: DiagramElement = new DiagramElement(); let i: number;
    let textStyle: TextStyleModel; let nodeStyle: TextStyleModel;
    switch (node.shape.type) {
        case 'Path':
            let pathContent: PathElement = new PathElement();
            pathContent.data = (actualObject.shape as PathModel).data;
            content = pathContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Image':
            let imageContent: ImageElement = new ImageElement();
            imageContent.source = (actualObject.shape as ImageModel).source;
            imageContent.imageAlign = (actualObject.shape as ImageModel).align;
            imageContent.imageScale = (actualObject.shape as ImageModel).scale;
            content = imageContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Text':
            //issue
            let textContent: DiagramElement = new TextElement();
            //  (textContent as TextElement).content = (node.shape as TextModel).content;
            content = textContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Basic':
            let element: DiagramElement;

            element = (actualObject.shape as BasicShape).shape === 'Rectangle' ? new DiagramElement() : new PathElement();
            if ((actualObject.shape as BasicShape).shape === 'Polygon') {
                (element as PathElement).data = getPolygonPath((actualObject.shape as BasicShape).points) as string;
            } else {
                (element as PathElement).data = getBasicShape((actualObject.shape as BasicShape).shape);
            }
            updateShapeContent(content, actualObject, diagram);
            if ((actualObject.shape as BasicShape).shape === 'Rectangle') {
                element.cornerRadius = (actualObject.shape as BasicShape).cornerRadius;
            }
            content = element;
            break;
        case 'Flow':
            let flowShapeElement: PathElement = new PathElement();
            flowShapeElement.data = getFlowShape((actualObject.shape as FlowShape).shape);
            content = flowShapeElement;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Native':
            let nativeContent: DiagramNativeElement = new DiagramNativeElement(node.id, diagram.element.id);
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
    if (node.shape.type === undefined || node.shape.type === oldObject.shape.type) {
        updateContent(node, actualObject, diagram);
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
/** @private */
export function updateContent(newValues: Node, actualObject: Node, diagram: Diagram): void {
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
        } else if (actualObject.shape.type === 'Flow' && (newValues.shape as FlowShapeModel).shape !== undefined) {
            (actualObject.shape as FlowShapeModel).shape = (newValues.shape as FlowShapeModel).shape;
            let shapes: FlowShapes = (actualObject.shape as FlowShapeModel).shape;
            let flowshapedata: string = getFlowShape(shapes.toString());
            (actualObject.wrapper.children[0] as PathModel).data = flowshapedata;
        } else if (actualObject.shape.type === 'UmlActivity' && (newValues.shape as UmlActivityShapeModel).shape !== undefined) {
            updateUmlActivityNode(actualObject, newValues);
        } else if ((newValues.shape as BasicShapeModel).cornerRadius !== undefined) {
            (actualObject.wrapper.children[0] as BasicShapeModel).cornerRadius = (newValues.shape as BasicShapeModel).cornerRadius;
        } else if ((newValues.shape as FlowShapeModel).shape !== undefined) {
            (actualObject.shape as BasicShapeModel).shape = (newValues.shape as BasicShapeModel).shape;
            let shapes: string = (actualObject.shape as BasicShapeModel).shape;
            let basicShapeData: string = getBasicShape(shapes.toString());
            (actualObject.wrapper.children[0] as PathModel).data = basicShapeData;
        }
    }
    (actualObject.wrapper.children[0] as PathElement).canMeasurePath = true;
}
/** @private */
export function updateUmlActivityNode(actualObject: Node, newValues: Node): void {
    (actualObject.shape as UmlActivityShapeModel).shape = (newValues.shape as UmlActivityShapeModel).shape;
    let shapes: UmlActivityShapes = (actualObject.shape as UmlActivityShapeModel).shape;
    let umlActivityShapeData: string = getUMLActivityShape(shapes.toString());
    if ((actualObject.shape as UmlActivityShapeModel).shape === 'InitialNode') {
        actualObject.wrapper.children[0].style.fill = 'black';
    } else if ((actualObject.shape as UmlActivityShapeModel).shape === 'ForkNode' ||
        (actualObject.shape as UmlActivityShapeModel).shape === 'JoinNode') {
        actualObject.wrapper.children[0].style.fill = 'black';
    } else if ((actualObject.shape as UmlActivityShapeModel).shape === 'FinalNode') {
        if (actualObject instanceof Node) {
            actualObject.wrapper = getUMLFinalNode(actualObject);
        }
        (actualObject.wrapper.children[0] as PathModel).data = umlActivityShapeData;
    }
}

/** @private */
export function getUMLFinalNode(node: Node): Canvas {
    let finalNodeShape: Canvas = new Canvas();
    finalNodeShape.style.fill = 'transparent';
    //childNode0
    let pathData: string = 'M 25 50 C 11.21 50 0 38.79 0 25 C 0 11.21 11.21 0 25 0 C 38.78 0 50 11.21 50 25' +
        ' C 50 38.79 38.78 50 25 50';
    let innerFinalNode: PathElement = new PathElement();
    innerFinalNode.data = pathData;
    innerFinalNode.id = node.id + '_0_finalNode';
    innerFinalNode.horizontalAlignment = 'Center';
    innerFinalNode.verticalAlignment = 'Center';
    innerFinalNode.relativeMode = 'Object';
    innerFinalNode.style.strokeColor = node.style.strokeColor;
    innerFinalNode.style.strokeWidth = node.style.strokeWidth;
    //childNode1
    let outerFinalNode: PathElement = new PathElement();
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

/** @private */
export function getUMLActivityShapes(umlActivityShape: PathElement, content: DiagramElement, node: Node): DiagramElement {
    let umlActivityShapeData: string = getUMLActivityShape((node.shape as UmlActivityShape).shape);
    umlActivityShape.data = umlActivityShapeData;
    content = umlActivityShape;
    switch ((node.shape as UmlActivityShape).shape) {
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

/**   @private  */
export function removeGradient(svgId: string): void {
    removeElement(svgId + '_linear');
    removeElement(svgId + '_radial');
}

/** @private */
export function removeItem(array: String[], item: string): void {
    let index: number = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
}
/** @private */
export function updateConnector(connector: Connector, points: PointModel[]): void {
    let srcPoint: PointModel; let anglePoint: PointModel[]; let srcDecorator: DecoratorModel;
    let tarDecorator: DecoratorModel; let targetPoint: PointModel;
    connector.intermediatePoints = points;
    connector.updateSegmentElement(connector, points, connector.wrapper.children[0] as PathElement);
    srcPoint = connector.sourcePoint; srcDecorator = connector.sourceDecorator;
    if (connector.type === 'Bezier') {
        let firstSegment: BezierSegment = (connector.segments[0] as BezierSegment);
        let lastSegment: BezierSegment = (connector.segments[connector.segments.length - 1] as BezierSegment);
        anglePoint = [!Point.isEmptyPoint(lastSegment.point2) ? lastSegment.point2 : lastSegment.bezierPoint2,
        !Point.isEmptyPoint(firstSegment.point1) ? firstSegment.point1 : firstSegment.bezierPoint1];
    } else {
        anglePoint = connector.intermediatePoints;
    }
    points = connector.clipDecorators(connector, points);
    let element: DiagramElement = connector.wrapper.children[0];
    (element as PathElement).canMeasurePath = true;
    element = connector.wrapper.children[1];
    connector.updateDecoratorElement(element, points[0], anglePoint[1], srcDecorator);
    targetPoint = connector.targetPoint; tarDecorator = connector.targetDecorator;
    element = connector.wrapper.children[2];
    connector.updateDecoratorElement(element, points[points.length - 1], anglePoint[anglePoint.length - 2], tarDecorator);
    connector.updateShapeElement(connector);
}
/** @private */
export function getUserHandlePosition(selectorItem: SelectorModel, handle: UserHandleModel, transform?: Transforms): PointModel {
    let wrapper: DiagramElement = selectorItem.wrapper;
    let positionPoints: PointModel;
    let bounds: Rect = wrapper.bounds;
    let offset: number = handle.offset;
    let size: number = handle.size / transform.scale;
    let margin: MarginModel = handle.margin;
    let point: PointModel;
    let left: number = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
    let top: number = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
    point = { x: 0, y: 0 };

    if (selectorItem.nodes.length > 0) {
        switch (handle.side) {
            case 'Top':
                point.x += left + bounds.width * offset;
                point.y += top - size;
                break;
            case 'Bottom':
                point.x += left + offset * bounds.width;
                point.y += top + wrapper.actualSize.height + size;
                break;
            case 'Left':
                point.x += left - size;
                point.y += top + offset * bounds.height;
                break;
            case 'Right':
                point.x += left + wrapper.actualSize.width + size;
                point.y += top + offset * bounds.height;
                break;
        }
        point.x += ((margin.left - margin.right) / transform.scale) +
            (size / 2) * (handle.horizontalAlignment === 'Center' ? 0 : (handle.horizontalAlignment === 'Right' ? -1 : 1));
        point.y += ((margin.top - margin.bottom) / transform.scale) +
            (size / 2) * (handle.verticalAlignment === 'Center' ? 0 : (handle.verticalAlignment === 'Top' ? -1 : 1));


    } else if (selectorItem.connectors.length > 0) {
        let connector: Connector = selectorItem.connectors[0] as Connector;
        let annotation: PathAnnotation = { offset: offset } as PathAnnotation;
        let connectorOffset: SegmentInfo = getOffsetOfConnector(connector.intermediatePoints, annotation, bounds as Rect);
        let index: number = connectorOffset.index;
        point = connectorOffset.point;
        let getPointloop: SegmentInfo = getAnnotationPosition(connector.intermediatePoints, annotation, bounds);
        let points: PointModel[] = connector.intermediatePoints;
        let offsetLength: number;
        let angle: number = getPointloop.angle;
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
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
        point = transformPointByMatrix(matrix, point);
    }
    return point;
}

/** @private */
export function canResizeCorner(
    selectorConstraints: SelectorConstraints, action: string, thumbsConstraints: ThumbsConstraints, selectedItems: Selector): boolean {
    if (selectedItems.annotation) {
        if (canResize(selectedItems.annotation)) { return true; }
    } else if ((SelectorConstraints[action] & selectorConstraints) && (ThumbsConstraints[action] & thumbsConstraints)) {
        return true;
    }
    return false;
}


/** @private */
export function canShowCorner(selectorConstraints: SelectorConstraints, action: string): boolean {
    if (SelectorConstraints[action] & selectorConstraints) {
        return true;
    }
    return false;
}

/** @private */
export function checkPortRestriction(port: PointPortModel, portVisibility: PortVisibility): number {
    return port.visibility & portVisibility;
}

/** @private */
export function findAnnotation(node: NodeModel | ConnectorModel, id: string): ShapeAnnotationModel | PathAnnotationModel | TextModel {
    let annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel;
    if (node.shape.type === 'Text') {
        annotation = (node.shape) as TextModel;
    } else {
        let annotationId: string[] = id.split('_');
        id = annotationId[annotationId.length - 1];
        for (let i: number = 0; i < node.annotations.length; i++) {
            if (id === node.annotations[i].id) {
                annotation = node.annotations[i];
            }
        }
    }
    return annotation;
}

/** @private */
export function findPort(node: NodeModel | ConnectorModel, id: string): PointPortModel {
    let port: PointPortModel;
    let portId: string[] = id.split('_');
    id = portId[portId.length - 1];
    for (let i: number = 0; i < node.ports.length; i++) {
        if (id === node.ports[i].id) {
            return node.ports[i];
        }
    }
    return port;
}

/** @private */
export function getInOutConnectPorts(node: NodeModel, isInConnect: boolean): PointPortModel {
    let port: PointPortModel = {};
    let i: number = 0;
    if (node.ports) {
        let ports: PointPortModel[] = node.ports;
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


/** @private */
export function findObjectIndex(node: NodeModel | ConnectorModel, id: string, annotation?: boolean): string {
    let index: number;
    let collection: (PointPortModel | ShapeAnnotationModel | PathAnnotationModel)[] = (annotation) ? node.annotations : node.ports;
    for (let i: number = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
            return (i).toString();
        }
    }
    return null;
}

/** @private */
export function getObjectFromCollection(obj: (NodeModel | ConnectorModel)[], id: string): boolean {
    let i: number;
    for (i = 0; i < obj.length; i++) {
        if (id === obj[i].id) {
            return true;
        }
    }
    return false;
}

/** @private */
export function scaleElement(element: DiagramElement, sw: number, sh: number, refObject: DiagramElement): void {
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
            scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
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
export function arrangeChild(obj: Node, x: number, y: number, nameTable: {}, drop: boolean, diagram: Diagram | SymbolPalette): void {
    let child: string[] = obj.children;
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
                    let content: DiagramElement;
                    let container: Container;
                    nameTable[node.id] = node;
                    container = node.initContainer();
                    if (!container.children) {
                        container.children = [];
                    }
                    content = node.init(diagram);
                    container.children.push(content);
                    container.measure(new Size(node.width, node.height));
                    container.arrange(container.desiredSize);
                }
            }
        }
    }
}

/** @private */
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

/** @private */
export function getElement(element: DiagramHtmlElement | DiagramNativeElement): Object {
    let diagramElement: Object = document.getElementById(element.diagramId);
    let instance: string = 'ej2_instances';
    let node: {} = {};
    let nodes: Object = diagramElement[instance][0].nodes;
    if (nodes === undefined) {
        nodes = getPaletteSymbols(diagramElement[instance][0]);
    }
    let length: string = 'length';
    for (let i: number = 0; nodes && i < nodes[length]; i++) {
        if (nodes[i].id === element.nodeId) {
            return getAnnotation(nodes[i], element);
        }
    }
    let connectors: Object = diagramElement[instance][0].connectors;
    for (let i: number = 0; connectors && i < connectors[length]; i++) {
        if (connectors[i].id === element.nodeId) {
            return getAnnotation(connectors[i], element);
        }
    }
    let enterObject: {} = diagramElement[instance][0].enterObject;
    if (enterObject && (enterObject['id'] === element.nodeId || enterObject['children'])) {
        if (enterObject['children'] && groupHasType(enterObject as Node, 'HTML', diagramElement[instance][0].enterTable)) {
            return diagramElement[instance][0].enterTable[element.nodeId];
        } else {
            return enterObject;
        }
    }
    return null;
}

function getAnnotation(obj: Object, element: DiagramHtmlElement | DiagramNativeElement): Object {
    let annotations: Object = (obj as NodeModel | ConnectorModel).annotations;
    let length: string = 'length';
    let j: number;
    for (j = 0; annotations && j < annotations[length]; j++) {
        if ((element as DiagramHtmlElement).annotationId && annotations[j].id === (element as DiagramHtmlElement).annotationId) {
            return annotations[j];
        }
    }
    return obj;
}

/** @private */
function getPaletteSymbols(symbolPalette: SymbolPalette): NodeModel[] {
    let nodes: NodeModel[] = [];
    for (let i: number = 0; i < symbolPalette.palettes.length; i++) {
        let symbols: (NodeModel | ConnectorModel)[] = symbolPalette.palettes[i].symbols;
        for (let j: number = 0; j < symbols.length; j++) {
            if (symbols[j] instanceof Node) {
                nodes.push(symbols[j] as NodeModel);
            }
        }
    }
    return nodes;
}
/** @private */
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
/** @private */
export function getDropEventArguements(args: MouseEventArgs, arg: IBlazorDropEventArgs): IBlazorDropEventArgs {
    if (isBlazor()) {
        let connector: boolean = (getObjectType(args.source) === Connector);
        let object: NodeModel | ConnectorModel = cloneBlazorObject(args.source);
        let target: NodeModel | ConnectorModel = cloneBlazorObject(this.currentTarget);
        arg = {
            element: connector ? { connector: object as ConnectorModel } : { node: object as NodeModel },
            target: connector ? { connector: target } : { node: target }, position: this.currentPosition, cancel: false
        } as IBlazorDropEventArgs;
    }
    return arg;
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


/**
 * Get the object as Node | Connector
 * @param obj  
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
export let findDistance: Function = (point1: PointModel, point2: PointModel): number => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

/** @private */
export function cloneBlazorObject(args: object): Object {
    if (isBlazor()) {
        args = cloneObject(args);
    }
    return args;
}

/** @private */
export function checkBrowserInfo(): boolean {
    if (navigator.platform.indexOf('Mac') && Browser.info.name === 'Safari') {
        return true;
    }
    return false;
}
