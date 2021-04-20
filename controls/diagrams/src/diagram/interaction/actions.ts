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
import { Selector } from '../objects/node';
import { SelectorModel } from '../objects/node-model';
import { PointPortModel } from './../objects/port-model';
import { PointPort } from './../objects/port';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { checkParentAsContainer } from '../interaction/container-interaction';
/**
 * Finds the action to be taken for the object under mouse
 *
 */

/* tslint:disable */
/**
 * findToolToActivate method\
 *
 * @returns {Actions}    findToolToActivate method .\
 * @param {Object} obj - provide the options value.
 * @param {DiagramElement} wrapper - provide the options value.
 * @param {PointModel} position - provide the options value.
 * @param {Diagram} diagram - provide the options value.
 * @param {ITouches[] | TouchList} touchStart - provide the options value.
 * @param {ITouches[] | TouchList} touchMove - provide the options value.
 * @param {NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel} target - provide the options value.
 * @private
 */
export function findToolToActivate(
    obj: Object, wrapper: DiagramElement, position: PointModel, diagram: Diagram,
    touchStart?: ITouches[] | TouchList, touchMove?: ITouches[] | TouchList,
    target?: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions {
    //let conn: Connector = diagram.selectedItems.connectors[0] as Connector;

    if (touchMove && touchMove.length > 1 && touchStart && touchStart.length > 1) { return 'PinchZoom'; }
    if (diagram.currentSymbol) { return 'Drag'; }
    const eventHandler: string = 'eventHandler';
    if (diagram[eventHandler].action === 'PortDraw') {
        diagram.tool &= ~DiagramTools.DrawOnce;
    }
    //Drawing Tools
    if ((canDrawOnce(diagram) || canContinuousDraw(diagram)) && diagram.drawingObject) { return 'Draw'; }
    if (hasSelection(diagram)) {
        const handle: SelectorModel = diagram.selectedItems;
        if (handle.wrapper && canShowCorner(handle.constraints, 'UserHandle')) {
            for (const obj of handle.userHandles) {
                if (obj.visible) {
                    const paddedBounds: PointModel = getUserHandlePosition(handle, obj, diagram.scroller.transform);
                    if (contains(position, paddedBounds, obj.size / (2 * diagram.scroller.transform.scale))) { return obj.name as Actions; }
                }
            }
        }
    }
    if (hasSelection(diagram)) {
        const element: DiagramElement = ((diagram.selectedItems as Selector).annotation) ?
            diagram.selectedItems.wrapper.children[0] : diagram.selectedItems.wrapper;
        const selectorBnds: Rect = element.bounds; const handle: SelectorModel = diagram.selectedItems;
        const paddedBounds: Rect = new Rect(selectorBnds.x, selectorBnds.y, selectorBnds.width, selectorBnds.height);
        if (hasSingleConnection(diagram) && !(diagram.selectedItems as Selector).annotation) {
            const conn: Connector = diagram.selectedItems.connectors[0] as Connector;
            const sourcePaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
            const targetPaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
            if (canShowCorner(handle.constraints, 'ResizeAll')) {
                if ((canShowCorner(handle.constraints, 'ConnectorSourceThumb'))
                    && canDragSourceEnd(conn as Connector) && contains(position, conn.sourcePoint, sourcePaddingValue)) {
                    return 'ConnectorSourceEnd';
                }
                if ((canShowCorner(handle.constraints, 'ConnectorTargetThumb'))
                    && canDragTargetEnd(conn as Connector) && contains(position, conn.targetPoint, targetPaddingValue)) {
                    return 'ConnectorTargetEnd';
                }
                const action: Actions = checkForConnectorSegment(conn, handle, position, diagram);
                if (action !== 'OrthoThumb') {
                    if ((canShowCorner(handle.constraints, 'ConnectorSourceThumb'))
                        && canDragSourceEnd(conn as Connector)) {
                        if (action) { return action; }
                    }
                    if ((canShowCorner(handle.constraints, 'ConnectorTargetThumb'))
                        && canDragTargetEnd(conn as Connector)) {
                        if (action) { return action; }
                    }
                } else {
                    return action;
                }
            }
        } else {
            const ten: number = 10 / diagram.scroller.currentZoom;
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
            //check for resizing tool
            const x: number = element.offsetX - element.pivot.x * element.actualSize.width;
            const y: number = element.offsetY - element.pivot.y * element.actualSize.height;
            let rotateThumb: PointModel = {
                x: x + ((element.pivot.x === 0.5 ? element.pivot.x * 2 : element.pivot.x) * element.actualSize.width / 2),
                y: y - 30 / diagram.scroller.currentZoom
            };
            rotateThumb = transformPointByMatrix(matrix, rotateThumb);
            const labelSelection: boolean = (diagram.selectedItems as Selector).annotation ? true : false;
            const labelRotate: boolean = (labelSelection && (canRotate((diagram.selectedItems as Selector).annotation))) ? true : false;
            if (canShowCorner(handle.constraints, 'Rotate') && contains(position, rotateThumb, ten) &&
                ((diagram.selectedItems as Selector).thumbsConstraints & ThumbsConstraints.Rotate)) {
                if (labelSelection && labelRotate) { return 'LabelRotate'; } else if (!labelSelection) { return 'Rotate'; }
            }
            paddedBounds.Inflate(ten);
            if (paddedBounds.containsPoint(position)) {
                const action: Actions = checkResizeHandles(diagram, element, position, matrix, x, y);
                if (action) { return action; }
            }
        }
    }
    //Panning
    if (canZoomPan(diagram) && !obj) { return 'Pan'; }
    if (target instanceof PointPort && (!canZoomPan(diagram))) {
        const action: Actions = findPortToolToActivate(diagram, target);
        if (action !== 'None') { return action; }
    }
    if ((target instanceof ShapeAnnotation || target instanceof PathAnnotation) && (!canZoomPan(diagram) && (canSelect(target)))) {
        if (isSelected(diagram, target, undefined, wrapper) && canMove(target)) { return 'LabelDrag'; } return 'LabelSelect';
    }
    if (obj !== null) {
        if (obj instanceof Node || obj instanceof Connector) {
            if (wrapper && wrapper.id) {
                const id: string = wrapper.id.split(obj.id)[1];
                if (id && id.match('^_icon')) { return 'LayoutAnimation'; }
            }
            if (wrapper && wrapper.id) {
                let userid: string;
                for (let i: number = 0; i < obj.fixedUserHandles.length; i++) {
                    userid = obj.fixedUserHandles[i].id;
                    if (wrapper.id && (wrapper.id.indexOf(userid) > -1)) { return 'FixedUserHandle'; }
                }
            }
            if (wrapper instanceof TextElement && wrapper.hyperlink.link) {
                return 'Hyperlink';
            }
            if (canMove(obj) && isSelected(diagram, obj, false) && (diagram.selectedItems as Selector).annotation === undefined) {
                if ((obj instanceof Connector && !(contains(position, obj.sourcePoint, obj.hitPadding) ||
                    contains(position, obj.targetPoint, obj.hitPadding))) ||
                    !(obj instanceof Connector)) { return 'Drag'; }
            } else if (obj && canZoomPan(diagram) && !defaultTool(diagram)) {
                return 'Pan';
            } else if (diagram.selectedItems.nodes.length && (diagram.selectedItems.nodes[0] as Node).isLane &&
                diagram.selectedItems.wrapper && diagram.selectedItems.wrapper.bounds.containsPoint(position)) {
                return 'Drag';
            } else { return 'Select'; }
        } else { return 'Select'; }
    }
    return 'Select';
}
/* tslint:enable */

function checkResizeHandles(
    diagram: Diagram, element: DiagramElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
    let action: Actions;
    if ((diagram.selectedItems.nodes.length === 1 && diagram.selectedItems.connectors.length === 0)
        && diagram.selectedItems.nodes[0].container) {
        action = checkResizeHandleForContainer(diagram, element, position, x, y);
    }
    if (!action && (!diagram.selectedItems.nodes[0] || (!(diagram.selectedItems.nodes[0] as Node).isPhase &&
        !(diagram.selectedItems.nodes[0] as Node).isLane && diagram.selectedItems.nodes[0].shape.type !== 'SwimLane'))) {
        action = checkForResizeHandles(diagram, element, position, matrix, x, y);
    }
    if (action) { return action; }
    return null;
}

/**
 * checkForConnectorSegment method\
 *
 * @returns {Actions}    checkForConnectorSegment method .\
 * @param {Connector} conn - provide the options value.
 * @param {SelectorModel} handle - provide the options value.
 * @param {PointModel} position - provide the options value.
 * @param {Diagram} diagram - provide the options value.
 * @private
 */
function checkForConnectorSegment(conn: Connector, handle: SelectorModel, position: PointModel, diagram: Diagram): Actions {
    const targetPaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
    const sourcePaddingValue: number = 10 / diagram.scrollSettings.currentZoom;
    if (conn.type === 'Bezier') {
        for (let i: number = 0; i < conn.segments.length; i++) {
            const segment: BezierSegment = (conn.segments)[i] as BezierSegment;
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
                //let segment: StraightSegmentModel | BezierSegmentModel;
                const segment: StraightSegmentModel | BezierSegmentModel = (conn.segments)[i] as StraightSegmentModel | BezierSegmentModel;
                if (contains(position, segment.point, 10)) {
                    return 'SegmentEnd';
                }
            }
        } else {
            for (let i: number = 0; i < conn.segments.length; i++) {
                const segPoint: PointModel = { x: 0, y: 0 };
                const segment: ConnectorSegment = (conn.segments)[i] as ConnectorSegment;
                if (segment.allowDrag) {
                    for (let j: number = 0; j < segment.points.length - 1; j++) {
                        const length: number = Point.distancePoints(segment.points[j], segment.points[j + 1]);
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
    }
    return null;
}

/**
 * findPortToolToActivate method\
 *
 * @returns {boolean}    findPortToolToActivate method .\
 * @param {Diagram} diagram - provide the options value.
 * @param {NodeModel | PointPortModel} target - provide the options value.
 * @param {ITouches[] | TouchList} touchStart - provide the options value.
 * @param {ITouches[] | TouchList} touchMove - provide the options value.
 * @private
 */
export function findPortToolToActivate(
    diagram: Diagram, target?: NodeModel | PointPortModel,
    // eslint-disable-next-line
    touchStart?: ITouches[] | TouchList, touchMove?: ITouches[] | TouchList,
): Actions {
    if (canDrag(target, diagram) && (checkPortRestriction(target as PointPortModel, PortVisibility.Hover)
        || (checkPortRestriction(target as PointPortModel, PortVisibility.Visible)))) {
        if ((target.constraints & PortConstraints.Drag)) { return 'PortDrag'; }
    } else if (canDraw(target, diagram) && (checkPortRestriction(target as PointPortModel, PortVisibility.Hover)
        || (checkPortRestriction(target as PointPortModel, PortVisibility.Visible)))) {
        if (target.constraints & PortConstraints.Draw) {
            diagram.drawingObject = {};
            const connector: ConnectorModel = { type: 'Orthogonal', sourcePortID: target.id };
            diagram.drawingObject = connector;
            diagram.tool |= DiagramTools.DrawOnce;
            diagram.currentDrawingObject = connector as Connector;
            return 'PortDraw';
        }
    }
    return 'None';
}

/**
 * Resize handle for container and also object.
 * @private
 */

function checkResizeHandleForContainer(diagram: Diagram, element: DiagramElement, position: PointModel, x: number, y: number): Actions {
    const ten: number = 10 / diagram.scroller.currentZoom;
    const forty: number = 40 / diagram.scroller.currentZoom;
    const selectedItems: Selector = diagram.selectedItems as Selector;
    const width: number = element.actualSize.width; const height: number = element.actualSize.height;
    const left: Rect = new Rect(x, y + 20, element.style.strokeWidth, height - 40);
    const right: Rect = new Rect(x + width, y + 20, element.style.strokeWidth, height - 40);
    const top: Rect = new Rect(x + 20, y, width - 40, element.style.strokeWidth);
    const bottom: Rect = new Rect(x + 20, y + height, width - 40, element.style.strokeWidth);
    const container: NodeModel = checkParentAsContainer(diagram, diagram.selectedItems.nodes[0], true) ?
        diagram.nameTable[(diagram.selectedItems.nodes[0] as Node).parentId] : diagram.selectedItems.nodes[0];

    if (width >= forty && height >= forty) {
        if (canResizeCorner(selectedItems.constraints, 'ResizeEast', selectedItems.thumbsConstraints, selectedItems) &&
            right.containsPoint(position, ten)) {
            return 'ResizeEast';
        }

        if (canResizeCorner(selectedItems.constraints, 'ResizeSouth', selectedItems.thumbsConstraints, selectedItems) &&
            bottom.containsPoint(position, ten)) {
            return 'ResizeSouth';
        }
        if (container.container.type !== 'Grid') {
            if (canResizeCorner(selectedItems.constraints, 'ResizeWest', selectedItems.thumbsConstraints, selectedItems) &&
                left.containsPoint(position, ten)) {
                return 'ResizeWest';
            }
            if (canResizeCorner(selectedItems.constraints, 'ResizeNorth', selectedItems.thumbsConstraints, selectedItems) &&
                top.containsPoint(position, ten)) {
                return 'ResizeNorth';
            }
        }
    }
    return null;
}

function checkForResizeHandles(
    diagram: Diagram, element: DiagramElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
    const forty: number = 40 / diagram.scroller.currentZoom;
    const ten: number = 10 / diagram.scroller.currentZoom;
    const selectedItems: Selector = diagram.selectedItems as Selector;
    const labelSelection: boolean = (selectedItems.annotation) ? true : false;
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


/**
 * contains method\
 *
 * @returns {boolean}    contains method .\
 * @param {PointModel} mousePosition - provide the options value.
 * @param {PointModel} corner - provide the corner value.
 * @param {number} padding - provide the padding value.
 * @private
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
 * hasSelection method\
 *
 * @returns {boolean}    hasSelection method .\
 * @param {Diagram} diagram - provide the options value.
 * @private
 */
export function hasSelection(diagram: Diagram): boolean {
    if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
        return true;
    }
    return false;
}

/**
 * hasSingleConnection method\
 *
 * @returns {boolean}    hasSingleConnection method .\
 * @param {Diagram} diagram - provide the options value.
 * @private
 */
export function hasSingleConnection(diagram: Diagram): boolean {
    if (diagram.selectedItems.connectors.length === 1 && !diagram.selectedItems.nodes.length) {
        return true;
    }
    return false;
}

/**
 * isSelected method\
 *
 * @returns {boolean}    isSelected method .\
 * @param {Diagram} diagram - provide the options value.
 * @param {Object} element - provide the options value.
 * @param {boolean} firstLevel - provide the options value.
 * @param {DiagramElement} wrapper - provide the options value.
 * @private
 */
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
export type Actions = 'None' | 'Select' | 'Drag' | 'FixedUserHandle' | 'ResizeWest' | 'ConnectorSourceEnd' | 'ConnectorTargetEnd' |
'ResizeEast' | 'ResizeSouth' | 'ResizeNorth' | 'ResizeSouthEast' |
'ResizeSouthWest' | 'ResizeNorthEast' | 'ResizeNorthWest' | 'Rotate' | 'ConnectorEnd' | 'Custom' | 'Draw' | 'Pan' |
'BezierSourceThumb' | 'BezierTargetThumb' | 'LayoutAnimation' | 'PinchZoom' | 'Hyperlink' | 'SegmentEnd' | 'OrthoThumb' |
'PortDrag' | 'PortDraw' | 'LabelSelect' | 'LabelDrag' | 'LabelResizeSouthEast' | 'LabelResizeSouthWest' | 'LabelResizeNorthEast' |
'LabelResizeNorthWest' | 'LabelResizeSouth' | 'LabelResizeNorth' | 'LabelResizeWest' | 'LabelResizeEast' | 'LabelRotate';

/**
 * getCursor method\
 *
 * @returns {boolean}    getCursor method .\
 * @param {Actions} cursor - provide the options value.
 * @param {number} angle - provide the options value.
 * @private
 */
export function getCursor(cursor: Actions, angle: number): string {
    //to avoid angles less than 0 & angles greater than 360
    angle += 360;
    angle %= 360;

    if (cursor.indexOf('Resize') === -1) {
        return cursors[cursor];
    } else {
        const dir: string = cursors[cursor];
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

const cursors: Object = {
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
    'Pan': 'grab',
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
    'LabelResizeSouthWest': 'sw-resize'
};
