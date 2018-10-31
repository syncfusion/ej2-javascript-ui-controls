import { Connector, BezierSegment, ConnectorSegment } from '../objects/connector';
import { BezierSegmentModel, StraightSegmentModel, ConnectorModel } from '../objects/connector-model';
import { Node } from '../objects/node';
import { Diagram } from '../diagram';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { identityMatrix, transformPointByMatrix, Matrix, rotateMatrix } from '../primitives/matrix';
import { DiagramElement } from '../core/elements/diagram-element';
import { getUserHandlePosition, checkPortRestriction } from '../utility/diagram-util';
import { NodeModel } from './../objects/node-model';
import { canMove, canDragSourceEnd, canDragTargetEnd, canContinuousDraw, canDragSegmentThumb } from '../utility/constraints-util';
import { canZoomPan, defaultTool, canDrawOnce, canDrag, canDraw, canSelect, canRotate } from '../utility/constraints-util';
import { canShowCorner, canResizeCorner } from '../utility/diagram-util';
import { Point } from '../primitives/point';
import { ITouches } from '../objects/interface/interfaces';
import { TextElement } from '../core/elements/text-element';
import { PortConstraints, DiagramTools, PortVisibility, ThumbsConstraints } from '../enum/enum';
import { Selector } from './selector';
import { SelectorModel } from './selector-model';
import { PointPortModel } from './../objects/port-model';
import { PointPort } from './../objects/port';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
/**
 * Finds the action to be taken for the object under mouse
 * 
 */

/** @private */
export function findToolToActivate(
    obj: Object, wrapper: DiagramElement, position: PointModel, diagram: Diagram,
    touchStart?: ITouches[] | TouchList, touchMove?: ITouches[] | TouchList,
    target?: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions {
    let conn: Connector = diagram.selectedItems.connectors[0] as Connector;

    if (touchMove && touchMove.length > 1 && touchStart && touchStart.length > 1) { return 'PinchZoom'; }
    if (diagram.currentSymbol) { return 'Drag'; }
    let eventHandler: string = 'eventHandler';
    if (diagram[eventHandler].action === 'PortDraw') {
        diagram.tool &= ~DiagramTools.DrawOnce;
    }
    //Drawing Tools
    if ((canDrawOnce(diagram) || canContinuousDraw(diagram)) && diagram.drawingObject) { return 'Draw'; }
    if (hasSelection(diagram)) {
        let handle: SelectorModel = diagram.selectedItems;
        if (handle.wrapper && canShowCorner(handle.constraints, 'UserHandle')) {
            for (let obj of handle.userHandles) {
                if (obj.visible) {
                    let paddedBounds: PointModel = getUserHandlePosition(handle, obj, diagram.scroller.transform);
                    if (contains(position, paddedBounds, obj.size / 2)) {
                        return obj.name as Actions;
                    }
                }
            }
        }
    }
    //Panning
    if (canZoomPan(diagram) && !obj) { return 'Pan'; }
    if (hasSelection(diagram)) {
        let element: DiagramElement = ((diagram.selectedItems as Selector).annotation) ?
            diagram.selectedItems.wrapper.children[0] : diagram.selectedItems.wrapper;
        let selectorBnds: Rect = element.bounds; let handle: SelectorModel = diagram.selectedItems;
        let paddedBounds: Rect = new Rect(selectorBnds.x, selectorBnds.y, selectorBnds.width, selectorBnds.height);
        if (hasSingleConnection(diagram) && !(diagram.selectedItems as Selector).annotation) {
            let conn: Connector = diagram.selectedItems.connectors[0] as Connector;
            let sourcePaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
            let targetPaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
            if (canShowCorner(handle.constraints, 'ResizeAll')) {
                if ((canShowCorner(handle.constraints, 'ConnectorSourceThumb'))
                    && canDragSourceEnd(conn as Connector) && contains(position, conn.sourcePoint, sourcePaddingValue)) {
                    return 'ConnectorSourceEnd';
                }
                if ((canShowCorner(handle.constraints, 'ConnectorTargetThumb'))
                    && canDragTargetEnd(conn as Connector) && contains(position, conn.targetPoint, targetPaddingValue)) {
                    return 'ConnectorTargetEnd';
                }
                let action: Actions = checkForConnectorSegment(conn, handle, position, diagram);
                if (action) { return action; }
            }
        } else {
            let ten: number = 10 / diagram.scroller.currentZoom;
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
            //check for resizing tool
            let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
            let y: number = element.offsetY - element.pivot.y * element.actualSize.height;
            let rotateThumb: PointModel = {
                x: x + ((element.pivot.x === 0.5 ? element.pivot.x * 2 : element.pivot.x) * element.actualSize.width / 2),
                y: y - 30 / diagram.scroller.currentZoom
            };
            rotateThumb = transformPointByMatrix(matrix, rotateThumb);
            let labelSelection: boolean = (diagram.selectedItems as Selector).annotation ? true : false;
            let labelRotate: boolean = (labelSelection && (canRotate((diagram.selectedItems as Selector).annotation))) ? true : false;
            if (canShowCorner(handle.constraints, 'Rotate') && contains(position, rotateThumb, ten) &&
                ((diagram.selectedItems as Selector).thumbsConstraints & ThumbsConstraints.Rotate)) {
                if (labelSelection && labelRotate) { return 'LabelRotate'; } else if (!labelSelection) { return 'Rotate'; }
            }
            paddedBounds.Inflate(ten);
            if (paddedBounds.containsPoint(position)) {
                let action: Actions = checkForResizeHandles(diagram, element, position, matrix, x, y);
                if (action) { return action; }
            }
        }
    }
    if (target instanceof PointPort && (!canZoomPan(diagram))) {
        let action: Actions = findPortToolToActivate(diagram, target);
        if (action !== 'None') { return action; }
    }
    if ((target instanceof ShapeAnnotation || target instanceof PathAnnotation) && (!canZoomPan(diagram) && (canSelect(target)))) {
        if (isSelected(diagram, target, undefined, wrapper) && canMove(target)) { return 'LabelDrag'; } return 'LabelSelect';
    }
    if (obj !== null) {
        if (obj instanceof Node || obj instanceof Connector) {
            if (wrapper && wrapper.id) {
                let id: string = wrapper.id.split(obj.id)[1];
                if (id && id.match('^_icon')) {
                    return 'LayoutAnimation';
                }
            }
            if (canMove(obj) && wrapper instanceof TextElement && wrapper.hyperlink.link) {
                return 'Hyperlink';
            }
            if (canMove(obj) && isSelected(diagram, obj, false) && (diagram.selectedItems as Selector).annotation === undefined) {
                if ((obj instanceof Connector && !(contains(position, obj.sourcePoint, obj.hitPadding) ||
                    contains(position, obj.targetPoint, obj.hitPadding))) ||
                    !(obj instanceof Connector)) { return 'Drag'; }
            } else if (obj && canZoomPan(diagram) && !defaultTool(diagram)) {
                return 'Pan';
            } else { return 'Select'; }
        } else { return 'Select'; }
    }
    return 'Select';
}

function checkForConnectorSegment(conn: Connector, handle: SelectorModel, position: PointModel, diagram: Diagram): Actions {
    let targetPaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
    let sourcePaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
    if (conn.type === 'Bezier') {
        for (let i: number = 0; i < conn.segments.length; i++) {
            let segment: BezierSegment = (conn.segments)[i] as BezierSegment;
            if (contains(
                position, !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1,
                sourcePaddingValue)) {
                return 'BezierSourceThumb';
            }
            if (contains(
                position, !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2,
                targetPaddingValue)) {
                return 'BezierTargetThumb';
            }
        }
    }
    if (diagram.connectorEditingToolModule && canDragSegmentThumb(conn as Connector)) {
        if (conn.type === 'Straight' || conn.type === 'Bezier') {
            for (let i: number = 0; i < conn.segments.length; i++) {
                let segment: StraightSegmentModel | BezierSegmentModel;
                segment = (conn.segments)[i] as StraightSegmentModel | BezierSegmentModel;
                if (contains(position, segment.point, 10)) {
                    return 'SegmentEnd';
                }
            }
        } else {
            for (let i: number = 0; i < conn.segments.length; i++) {
                let segment: ConnectorSegment; let segPoint: PointModel = { x: 0, y: 0 };
                segment = (conn.segments)[i] as ConnectorSegment;
                for (let j: number = 0; j < segment.points.length - 1; j++) {
                    let length: number = Point.distancePoints(segment.points[j], segment.points[j + 1]);
                    if (length >= 50) {
                        segPoint.x = ((segment.points[j].x + segment.points[j + 1].x) / 2);
                        segPoint.y = ((segment.points[j].y + segment.points[j + 1].y) / 2);
                        if (contains(position, segPoint, 30)) {
                            return 'OrthoThumb';
                        }
                    }
                }
            }
        }
    }
    return null;
}

/** @private */
export function findPortToolToActivate(
    diagram: Diagram, target?: NodeModel | PointPortModel,
    touchStart?: ITouches[] | TouchList, touchMove?: ITouches[] | TouchList,
): Actions {
    if (canDrag(target, diagram) && (checkPortRestriction(target as PointPortModel, PortVisibility.Hover)
        || (checkPortRestriction(target as PointPortModel, PortVisibility.Visible)))) {
        if ((target.constraints & PortConstraints.Drag)) { return 'PortDrag'; }
    } else if (canDraw(target, diagram) && (checkPortRestriction(target as PointPortModel, PortVisibility.Hover)
        || (checkPortRestriction(target as PointPortModel, PortVisibility.Visible)))) {
        if (target.constraints & PortConstraints.Draw) {
            diagram.drawingObject = {};
            let connector: ConnectorModel = { type: 'Orthogonal', sourcePortID: target.id };
            diagram.drawingObject = connector;
            diagram.tool |= DiagramTools.DrawOnce;
            diagram.currentDrawingObject = connector as Connector;
            return 'PortDraw';
        }
    }
    return 'None';
}


function checkForResizeHandles(
    diagram: Diagram, element: DiagramElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
    let forty: number = 40 / diagram.scroller.currentZoom;
    let ten: number = 10 / diagram.scroller.currentZoom;
    let selectedItems: Selector = diagram.selectedItems as Selector;
    let labelSelection: boolean = (selectedItems.annotation) ? true : false;
    if (element.actualSize.width >= forty && element.actualSize.height >= forty) {
        if (canResizeCorner(selectedItems.constraints, 'ResizeSouthEast', selectedItems.thumbsConstraints, selectedItems) && contains(
            position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height }), ten)) {
            return (labelSelection) ? 'LabelResizeSouthEast' : 'ResizeSouthEast';
        }
        if (canResizeCorner(selectedItems.constraints, 'ResizeSouthWest', selectedItems.thumbsConstraints, selectedItems) &&
            contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height }), ten)) {
            return (labelSelection) ? 'LabelResizeSouthWest' : 'ResizeSouthWest';
        }
        if (canResizeCorner(selectedItems.constraints, 'ResizeNorthEast', selectedItems.thumbsConstraints, selectedItems) &&
            contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y }), ten)) {
            return (labelSelection) ? 'LabelResizeNorthEast' : 'ResizeNorthEast';
        }
        if (canResizeCorner(selectedItems.constraints, 'ResizeNorthWest', selectedItems.thumbsConstraints, selectedItems) &&
            contains(position, transformPointByMatrix(matrix, { x: x, y: y }), ten)) {
            return (labelSelection) ? 'LabelResizeNorthWest' : 'ResizeNorthWest';
        }
    }
    if (canResizeCorner(selectedItems.constraints, 'ResizeEast', selectedItems.thumbsConstraints, selectedItems) && contains(
        position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height / 2 }), ten)) {
        return (labelSelection) ? 'LabelResizeEast' : 'ResizeEast';
    }
    if (canResizeCorner(selectedItems.constraints, 'ResizeWest', selectedItems.thumbsConstraints, selectedItems) &&
        contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height / 2 }), ten)) {
        return (labelSelection) ? 'LabelResizeWest' : 'ResizeWest';
    }
    if (canResizeCorner(selectedItems.constraints, 'ResizeSouth', selectedItems.thumbsConstraints, selectedItems) && contains(
        position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y + element.actualSize.height }), ten)) {
        return (labelSelection) ? 'LabelResizeSouth' : 'ResizeSouth';
    }
    if (canResizeCorner(selectedItems.constraints, 'ResizeNorth', selectedItems.thumbsConstraints, selectedItems) &&
        contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y }), ten)) {
        return (labelSelection) ? 'LabelResizeNorth' : 'ResizeNorth';
    }
    return null;
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
export function hasSelection(diagram: Diagram): boolean {
    if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
        return true;
    }
    return false;
}

/** @private */
export function hasSingleConnection(diagram: Diagram): boolean {
    if (diagram.selectedItems.connectors.length === 1 && !diagram.selectedItems.nodes.length) {
        return true;
    }
    return false;
}

/** @private */
export function isSelected(diagram: Diagram, element: Object, firstLevel: boolean = true, wrapper?: DiagramElement): boolean {
    if (element instanceof Selector) {
        return true;
    }
    if (element instanceof Node) {
        while (element) {
            if (diagram.selectedItems.nodes.indexOf(element) !== -1 && (diagram.selectedItems as Selector).annotation === undefined) {
                return true;
            }
            if (!firstLevel) {
                element = diagram.nameTable[(element as Node).parentId];
            } else {
                break;
            }
        }

    } else if (element instanceof Connector) {
        if (diagram.selectedItems.connectors.indexOf(element) !== -1 && (diagram.selectedItems as Selector).annotation === undefined) {
            return true;
        }
    } else if (element instanceof ShapeAnnotation || element instanceof PathAnnotation) {
        if ((diagram.selectedItems as Selector).annotation && diagram.selectedItems.wrapper.children[0].id === wrapper.id) {
            return true;
        }
    }
    return false;
}

/** @private */
export type Actions = 'None' | 'Select' | 'Drag' | 'ResizeWest' | 'ConnectorSourceEnd' | 'ConnectorTargetEnd' |
    'ResizeEast' | 'ResizeSouth' | 'ResizeNorth' | 'ResizeSouthEast' |
    'ResizeSouthWest' | 'ResizeNorthEast' | 'ResizeNorthWest' | 'Rotate' | 'ConnectorEnd' | 'Custom' | 'Draw' | 'Pan' |
    'BezierSourceThumb' | 'BezierTargetThumb' | 'LayoutAnimation' | 'PinchZoom' | 'Hyperlink' | 'SegmentEnd' | 'OrthoThumb' |
    'PortDrag' | 'PortDraw' | 'LabelSelect' | 'LabelDrag' | 'LabelResizeSouthEast' | 'LabelResizeSouthWest' | 'LabelResizeNorthEast' |
    'LabelResizeNorthWest' | 'LabelResizeSouth' | 'LabelResizeNorth' | 'LabelResizeWest' | 'LabelResizeEast' | 'LabelRotate';

/** @private */
export function getCursor(cursor: Actions, angle: number): string {
    //to avoid angles less than 0 & angles greater than 360
    angle += 360;
    angle %= 360;

    if (cursor.indexOf('Resize') === -1) {
        return cursors[cursor];
    } else {
        let dir: string = cursors[cursor];
        if ((angle >= 0 && angle < 25) || (angle >= 160 && angle <= 205) || (angle >= 340 && angle <= 360)) {
            return dir;
        } else if ((angle >= 25 && angle <= 70) || (angle >= 205 && angle <= 250)) {
            if (dir === 'n-resize' || dir === 's-resize') {
                return 'ne-resize';
            } else if (dir === 'nw-resize' || dir === 'se-resize') {
                return 'n-resize';
            } else if (dir === 'e-resize' || dir === 'w-resize') {
                return 'nw-resize';
            } else {
                return 'e-resize';
            }
        } else if ((angle >= 70 && angle <= 115) || (angle >= 250 && angle <= 295)) {
            if (dir === 'n-resize' || dir === 's-resize') {
                return 'e-resize';
            } else if (dir === 'nw-resize' || dir === 'se-resize') {
                return 'ne-resize';
            } else if (dir === 'e-resize' || dir === 'w-resize') {
                return 'n-resize';
            } else {
                return 'nw-resize';
            }
        } else if ((angle >= 115 && angle <= 155) || (angle >= 295 && angle <= 340)) {
            if (dir === 'n-resize' || dir === 's-resize') {
                return 'nw-resize';
            } else if (dir === 'nw-resize' || dir === 'se-resize') {
                return 'e-resize';
            } else if (dir === 'e-resize' || dir === 'w-resize') {
                return 'ne-resize';
            }
        } else {
            return 'n-resize';
        }
    }
    return cursors[cursor];
}

let cursors: Object = {
    'None': 'default',
    'Rotate': 'crosshair',
    'Select': 'default',
    'Drag': 'move',
    'ResizeWest': 'w-resize',
    'ResizeEast': 'e-resize',
    'ResizeSouth': 's-resize',
    'ResizeNorth': 'n-resize',
    'Draw': 'crosshair',
    'PortDraw': 'crosshair',
    'ResizeNorthEast': 'ne-resize',
    'ResizeNorthWest': 'nw-resize',
    'ResizeSouthEast': 'se-resize',
    'ResizeSouthWest': 'sw-resize',
    'ConnectorSourceEnd': 'move',
    'ConnectorTargetEnd': 'move',
    'BezierSourceThumb': 'move',
    'BezierTargetThumb': 'move',
    'OrthoThumb': 'move',
    'SegmentEnd': 'move',
    'Pan': 'pointer',
    'Hyperlink': 'pointer',
    'PortDrag': 'pointer',
    'LabelSelect': 'pointer',
    'LabelDrag': 'move',
    'LabelRotate': 'crosshair',
    'LabelResizeWest': 'w-resize',
    'LabelResizeEast': 'e-resize',
    'LabelResizeSouth': 's-resize',
    'LabelResizeNorth': 'n-resize',
    'LabelResizeNorthEast': 'ne-resize',
    'LabelResizeNorthWest': 'nw-resize',
    'LabelResizeSouthEast': 'se-resize',
    'LabelResizeSouthWest': 'sw-resize',
};
