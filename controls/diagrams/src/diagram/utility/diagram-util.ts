import { Size } from './../primitives/size';
import { PointModel } from './../primitives/point-model';
import { Rect } from './../primitives/rect';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix, scaleMatrix } from './../primitives/matrix';
import { DiagramElement, Corners } from './../core/elements/diagram-element';
import { Container } from './../core/containers/container';
import { StrokeStyle } from './../core/appearance';
import { TextStyleModel } from './../core/appearance-model';
import { Point } from './../primitives/point';
import { PortVisibility, ConnectorConstraints, NodeConstraints, Shapes } from './../enum/enum';
import { FlowShapes, SelectorConstraints, ThumbsConstraints } from './../enum/enum';
import { Alignment, SegmentInfo } from '../rendering/canvas-interface';
import { PathElement } from './../core/elements/path-element';
import { DiagramNativeElement } from './../core/elements/native-element';
import { TextElement } from '../core/elements/text-element';
import { ImageElement } from '../core/elements/image-element';
import { PathAnnotation } from './../objects/annotation';
import { PathModel, TextModel, ImageModel, FlowShapeModel, BasicShapeModel, NativeModel, HtmlModel } from './../objects/node-model';
import { Node, FlowShape, BasicShape, Native, Html } from './../objects/node';
import { NodeModel } from './../objects/node-model';
import { Connector, bezierPoints, BezierSegment } from './../objects/connector';
import { ConnectorModel } from './../objects/connector-model';
import { DecoratorModel } from './../objects/connector-model';
import { getBasicShape } from './../objects/dictionary/basic-shapes';
import { getFlowShape } from './../objects/dictionary/flow-shapes';
import { Diagram } from './../diagram';
import { Intersection } from './connector';
import { SelectorModel, UserHandleModel } from '../interaction/selector-model';
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
import { Selector } from '../interaction/selector';
import { contains } from '../interaction/actions';




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
export function getPoints(element: DiagramElement, corners: Corners): PointModel[] {
    let line: PointModel[] = [];
    line.push(corners.topLeft);
    line.push(corners.topRight);
    line.push(corners.bottomRight);
    line.push(corners.bottomLeft);
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
export function sort(objects: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
    let i: number = 0;
    let j: number = 0;
    let temp: NodeModel | ConnectorModel;
    for (i = 0; i < objects.length; i++) {
        let b: Rect = getBounds(objects[i].wrapper);
        for (j = i; j < objects.length; j++) {
            let bounds: Rect = getBounds(objects[j].wrapper);
            if (b.center.x > bounds.center.x) {
                temp = objects[i];
                objects[i] = objects[j];
                objects[j] = temp;
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
export function serialize(model: Diagram): string {
    let clonedObject: Object = cloneObject(model, model.getCustomProperty);
    (clonedObject as Diagram).selectedItems.nodes = [];
    (clonedObject as Diagram).selectedItems.connectors = [];
    (clonedObject as Diagram).selectedItems.wrapper = null;
    return JSON.stringify(clonedObject);
}

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
    diagram.contextMenuSettings = dataObj.contextMenuSettings;
    diagram.constraints = dataObj.constraints;
    diagram.tool = dataObj.tool;
    diagram.bridgeDirection = dataObj.bridgeDirection;
    diagram.pageSettings = dataObj.pageSettings;
    diagram.drawingObject = dataObj.drawingObject;
    diagram.tooltip = dataObj.tooltip;
    diagram.addInfo = dataObj.addInfo;
    diagram.getDescription = getDescription;
    diagram.scrollSettings = dataObj.scrollSettings;
    diagram.commandManager = dataObj.commandManager;
    diagram.layers = dataObj.layers;
    diagram.rulerSettings.horizontalRuler.arrangeTick = arrangeTickHorizontal;
    diagram.rulerSettings.verticalRuler.arrangeTick = arrangeTickVertical;
    for (let cmd of diagram.commandManager.commands) {
        if (commands[cmd.name]) {
            cmd.execute = commands[cmd.name].execute;
            cmd.canExecute = commands[cmd.name].canExecute;
        }
    }
    diagram.backgroundColor = dataObj.backgroundColor;
    diagram.basicElements = dataObj.basicElements;
    diagram.connectors = dataObj.connectors;
    diagram.dataSourceSettings = dataObj.dataSourceSettings;
    diagram.dataSourceSettings.doBinding = map;
    diagram.height = dataObj.height;
    diagram.setNodeTemplate = nodeTemp;
    diagram.getConnectorDefaults = connectorDefaults;
    diagram.getNodeDefaults = nodeDefaults;
    diagram.getCustomProperty = getCustomProperty;
    diagram.mode = dataObj.mode;
    diagram.nodes = dataObj.nodes;
    diagram.rulerSettings = dataObj.rulerSettings;
    diagram.snapSettings = dataObj.snapSettings;
    diagram.width = dataObj.width;
    diagram.layout = dataObj.layout;
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
    dataObj.selectedItems.nodes = [];
    dataObj.selectedItems.connectors = [];
    diagram.selectedItems = dataObj.selectedItems;
    return dataObj;
}

/** @private */
export function updateStyle(changedObject: TextStyleModel, target: DiagramElement): void {
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
            case 'gradient':
                style.gradient = changedObject.gradient;
                break;
        }
    }
    if (target instanceof TextElement) {
        textElement.refreshTextElement();
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
        removeElement(actualObject.id + '_content_html_element', elementId);
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
            let htmlContent: DiagramHtmlElement = new DiagramHtmlElement(node.id, diagram.element.id);
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
                nativeElement = getDiagramElement(actualObject.wrapper.children[0].id + '_groupElement', diagram.views[i]);
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
        } else if ((newValues.shape as BasicShapeModel).cornerRadius !== undefined) {
            (actualObject.wrapper.children[0] as BasicShapeModel).cornerRadius = (newValues.shape as BasicShapeModel).cornerRadius;
        } else if ((newValues.shape as FlowShapeModel).shape !== undefined) {
            (actualObject.shape as BasicShapeModel).shape = (newValues.shape as BasicShapeModel).shape;
            let shapes: string = (actualObject.shape as BasicShapeModel).shape;
            let basicShapeData: string = getBasicShape(shapes.toString());
            (actualObject.wrapper.children[0] as PathModel).data = basicShapeData;

        }
    }
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
    let element: DiagramElement = connector.wrapper.children[1];
    connector.updateDecoratorElement(element, points[0], anglePoint[1], srcDecorator, );
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
        point.x += (margin.left - margin.right) +
            (size / 2) * (handle.horizontalAlignment === 'Center' ? 0 : (handle.horizontalAlignment === 'Right' ? -1 : 1));
        point.y += (margin.top - margin.bottom) +
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
export function arrangeChild(obj: Node, x: number, y: number, nameTable: {}, drop: boolean, diagram: Diagram | SymbolPalette): void {
    let child: string[] = obj.children;
    let node: Node;
    for (let i: number = 0; i < child.length; i++) {
        node = nameTable[child[i]];
        if (node) {
            if (node.children) {
                this.arrangeChild(node, x, y, nameTable, drop, diagram);
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
            return nodes[i];
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
