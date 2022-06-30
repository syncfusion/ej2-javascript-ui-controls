/* eslint-disable jsdoc/require-returns-check */
import { Point } from './../primitives/point';
import { PointModel } from './../primitives/point-model';
import { Connector } from '../objects/connector';
import { Rect } from './../primitives/rect';
import { DiagramElement, Corners } from './../core/elements/diagram-element';
import { getPoints, intersect3 } from './diagram-util';
import { NoOfSegments, Direction, LayoutOrientation, BezierSmoothness } from '../enum/enum';
import { MarginModel } from '../core/appearance-model';
import { OrthogonalSegmentModel, StraightSegmentModel, BezierSegmentModel, VectorModel } from './../objects/connector-model';
import { StraightSegment, BezierSegment, OrthogonalSegment } from './../objects/connector';
import { PathElement } from './../core/elements/path-element';
import { cornersPointsBeforeRotation, rotatePoint } from './base-util';
import { Segment } from '../interaction/scroller';

/**
 * Connector modules are used to dock and update the connectors
 */



/**
 * intermeditatePoints method\
 *
 * @returns {  Function }    getFunction method .\
 * @param {PointModel} element - provide the angle value.
 * @param {PointModel} layoutOrientation - provide the angle value.
 * @param {PointModel} lineDistribution - provide the angle value.
 * @private
 */
export function findConnectorPoints(element: Connector, layoutOrientation?: LayoutOrientation, lineDistribution?: boolean): PointModel[] {
    //const intermeditatePoints: PointModel[];
    let sourcePoint: PointModel;
    if (element.type === 'Straight' || !element.sourceWrapper) {
        sourcePoint = getSourcePoint(element);
    } else {
        sourcePoint = element.sourceWrapper.corners.center;
    }
    // eslint-disable-next-line
    const intermeditatePoints: PointModel[] = terminateConnection(element, sourcePoint, element.targetPoint, layoutOrientation, lineDistribution);
    setLineEndPoint(element, intermeditatePoints[0], false);
    setLineEndPoint(element, intermeditatePoints[intermeditatePoints.length - 1], true);
    return intermeditatePoints;
}

/**
 * getSourcePoint method\
 *
 * @returns {  PointModel }    getFunction method .\
 * @param {PointModel} element - provide the angle value.
 * @private
 */
function getSourcePoint(element: Connector): PointModel {
    let srcPoint: PointModel;
    if (element.sourcePortWrapper) {
        const srcPort: DiagramElement = element.sourcePortWrapper;
        //const srcNode: DiagramElement = element.sourceWrapper;
        const pt: PointModel = { x: srcPort.offsetX, y: srcPort.offsetY };
        //const direction: string = getPortDirection(pt, cornersPointsBeforeRotation(srcNode), srcNode.bounds, false);
        srcPoint = pt;
    } else if (element.sourceID && element.sourceWrapper) {
        if (element.targetWrapper) {
            const sPoint: PointModel = element.sourceWrapper.corners.center;
            const tPoint: PointModel = element.targetWrapper.corners.center;
            srcPoint = getIntersection(element, element.sourceWrapper, sPoint, tPoint, false);
        } else {
            srcPoint = element.sourcePoint as Point;
        }
    } else {
        srcPoint = element.sourcePoint as Point;
    }
    return srcPoint;
}

/**
 * getDirection method \
 *
 * @returns { void }     getDirection method .\
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 * @param {LayoutOrientation} layoutOrientation - provide the layoutOrientation value.
 *
 * @private
 */
function getDirection(source: End, target: End, layoutOrientation: LayoutOrientation): void {
    if (layoutOrientation === 'LeftToRight') {
        source.direction = source.direction ? source.direction : 'Right';
        target.direction = target.direction ? target.direction : 'Left';
    } else if (layoutOrientation === 'RightToLeft') {
        source.direction = source.direction ? source.direction : 'Left';
        target.direction = target.direction ? target.direction : 'Right';
    } else if (layoutOrientation === 'TopToBottom') {
        source.direction = source.direction ? source.direction : 'Bottom';
        target.direction = target.direction ? target.direction : 'Top';
    } else if (layoutOrientation === 'BottomToTop') {
        source.direction = source.direction ? source.direction : 'Top';
        target.direction = target.direction ? target.direction : 'Bottom';
    }
}

/**
 * terminateConnection method \
 *
 * @returns { PointModel[] }     terminateConnection method .\
 * @param {Connector} element - provide the element value.
 * @param {PointModel} srcPoint - provide the srcPoint value.
 * @param {PointModel} tarPoint - provide the tarPoint value.
 * @param {LayoutOrientation} layoutOrientation - provide the layoutOrientation value.
 * @param {boolean} lineDistribution - provide the lineDistribution value.
 *
 * @private
 */
function terminateConnection(
    element: Connector, srcPoint: PointModel, tarPoint: PointModel, layoutOrientation?: LayoutOrientation, lineDistribution?: boolean)
    :
    PointModel[] {
    const sourceNode: DiagramElement = element.sourceWrapper;
    const targetNode: DiagramElement = element.targetWrapper;
    const sourcePort: DiagramElement = element.sourcePortWrapper;
    const targetPort: DiagramElement = element.targetPortWrapper;
    let srcCorner: Rect;
    let tarCorner: Rect;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let intermeditatePoints: PointModel[] = []; let segPoint: PointModel;
    let srcDir: Direction;
    let tarDir: Direction; let minSpace: number = findMargin(element);
    const sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
    const targetMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
    const source: End = { corners: srcCorner, point: srcPoint, direction: srcDir, margin: sourceMargin };
    const target: End = { corners: tarCorner, point: tarPoint, direction: tarDir, margin: targetMargin };
    let sourceCorners: Rect;
    let targetCorners: Rect;
    if (sourceNode !== undefined && targetNode !== undefined) {
        sourceCorners = cornersPointsBeforeRotation(sourceNode);
        targetCorners = cornersPointsBeforeRotation(targetNode);
        source.corners = sourceNode.corners;
        target.corners = targetNode.corners;
    }
    if (sourcePort !== undefined) {
        const port: PointModel = { x: sourcePort.offsetX, y: sourcePort.offsetY };
        source.direction = getPortDirection(port, sourceCorners, sourceNode.bounds, false);
    }
    if (targetPort !== undefined) {
        const tarPortPt: PointModel = { x: targetPort.offsetX, y: targetPort.offsetY };
        target.direction = getPortDirection(tarPortPt, targetCorners, targetNode.bounds, false);
    }

    if (element.type === 'Bezier') {
        if (!element.isBezierEditing) {
            if (element.segments.length > 0) {
                let i: number = element.segments.length - 1;
                while (i >= 0) {
                    let seg: BezierSegment = element.segments[i] as BezierSegment;
                    if (seg.isInternalSegment) {
                        element.segments.pop();
                    }
                    i--;
                }
            }
        }
        else {
            element.isBezierEditing = false;
        }
    }

    if (sourceNode !== undefined && targetNode !== undefined) {
        if (source.direction === undefined || target.direction === undefined) {
            if (layoutOrientation) {
                getDirection(source, target, layoutOrientation);
            } else {
                if (source.corners.top > target.corners.bottom &&
                    Math.abs(source.corners.top - target.corners.bottom) > minSpace ) {
                    source.direction = source.direction ? source.direction : 'Top';
                    target.direction = target.direction ? target.direction : 'Bottom';
                } else if (source.corners.bottom < target.corners.top &&
                    Math.abs(source.corners.bottom - target.corners.top) > minSpace ) {
                    source.direction = source.direction ? source.direction : 'Bottom';
                    target.direction = target.direction ? target.direction : 'Top';
                } else if ((source.corners.right < target.corners.left &&
                    Math.abs(source.corners.right - target.corners.left) > minSpace ) ||
                    ((source.corners.right + minSpace < target.corners.left) ||
                        (target.corners.right >= source.corners.left - minSpace && source.corners.left > target.corners.left))) {
                    source.direction = source.direction ? source.direction : 'Right';
                    target.direction = target.direction ? target.direction : 'Left';
                } else if ((source.corners.left > target.corners.right &&
                    Math.abs(source.corners.left - target.corners.right) > (source.margin.left + source.margin.right)) ||
                    ((target.corners.right + minSpace < source.corners.left ||
                        (source.corners.right >= target.corners.left - minSpace
                            && source.corners.left < target.corners.left)))) {
                    source.direction = source.direction ? source.direction : 'Left';
                    target.direction = target.direction ? target.direction : 'Right';
                } else {
                    if (sourceNode.id !== targetNode.id && (!sourceCorners.equals(sourceCorners, targetCorners)) &&
                        targetCorners.containsPoint(sourceCorners.topCenter, source.margin.top)) {
                        source.direction = source.direction ? source.direction : 'Bottom';
                        target.direction = target.direction ? target.direction : 'Top';
                    } else {
                        source.direction = source.direction ? source.direction : 'Top';
                        target.direction = target.direction ? target.direction : 'Bottom';
                    }
                }
            }
        }
        return defaultOrthoConnection(element, source.direction, target.direction, source.point, target.point, lineDistribution);
    }
    //It will be called only when there is only one end node
    checkLastSegmentasTerminal(element);
    if (element.sourceWrapper || element.targetWrapper) {
        connectToOneEnd(element, source, target);
    }
    if (element.type === 'Straight' || element.type === 'Bezier') {
        intermeditatePoints = intermeditatePointsForStraight(element, source, target);
    } else {
        if (element.type === 'Orthogonal' && element.segments && element.segments.length > 0 &&
            (element.segments[0] as OrthogonalSegment).length !== null &&
            (element.segments[0] as OrthogonalSegment).direction !== null) {
            intermeditatePoints = findPointToPointOrtho(element, source, target, sourceNode, targetNode, sourcePort, targetPort);
        } else {
            let extra: number;
            if (!source.direction) {
                source.direction = (target.direction) ? (
                    (element.targetPortWrapper !== undefined) ? target.direction : getOppositeDirection(target.direction) as Direction) :
                    Point.direction(source.point, target.point) as Direction;
            } else {
                extra = adjustSegmentLength(sourceNode.bounds, source, 20);
            }
            (element.segments[0] as OrthogonalSegment).points = intermeditatePoints = orthoConnection3Segment(
                element, source, target, extra);
        }
    }
    return intermeditatePoints;
}


/**
 * updateSegmentPoints method \
 *
 * @returns { PointModel[] }     updateSegmentPoints method .\
 * @param {End} source - provide the source value.
 * @param {OrthogonalSegment} segment - provide the segment value.
 *
 * @private
 */
function updateSegmentPoints(source: End, segment: OrthogonalSegment): PointModel {
    //let segPoint: PointModel; //let angle: number; //let extra: number;
    source.direction = segment.direction;
    segment.points = [];
    segment.points.push(source.point);
    const extra: number = (segment.direction === 'Left' || segment.direction === 'Top') ? -(segment.length) : segment.length;
    const angle: number = (segment.direction === 'Left' || segment.direction === 'Right') ? 0 : 90;
    const segPoint: PointModel = addLineSegment(source.point, extra, angle);
    segment.points.push(segPoint);
    return segPoint;
}

/**
 * pointToPoint method \
 *
 * @returns { void }     pointToPoint method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 *
 * @private
 */
function pointToPoint(element: Connector, source: End, target: End): PointModel[] {
    let point: PointModel[]; let direction: Direction; let portdirection: Direction;
    source.corners = (element.sourceWrapper) ? element.sourceWrapper.corners : undefined;
    if (element.sourcePortWrapper) {
        const port: PointModel = { x: element.sourcePortWrapper.offsetX, y: element.sourcePortWrapper.offsetY };
        portdirection = getPortDirection(port, cornersPointsBeforeRotation(element.sourceWrapper), element.sourceWrapper.bounds, false);
        if (source.corners && (source.direction === 'Bottom' || source.direction === 'Top')) {
            if (target.point.x > source.corners.left && target.point.x < source.corners.right) {
                direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
            }
        } else if (source.corners && (source.direction === 'Left' || source.direction === 'Right')) {
            if (target.point.y > source.corners.top && target.point.y < source.corners.bottom) {
                direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
            }
        }
    }
    if (element.sourcePortWrapper && portdirection === getOppositeDirection(direction)) {
        let length: number;
        if ((portdirection === 'Left' || portdirection === 'Right') && (source.point.y >= source.corners.top
            && source.point.y <= source.corners.center.y) &&
            (target.point.y >= source.corners.top && target.point.y <= source.corners.center.y)) {
            source.direction = 'Top';
            length = source.point.y - source.corners.top + 20;
        } else if ((portdirection === 'Left' || portdirection === 'Right') && (source.point.y > source.corners.center.y
            && source.point.y <= source.corners.bottom) &&
            (target.point.y > source.corners.center.y && target.point.y <= source.corners.bottom)) {
            source.direction = 'Bottom';
            length = source.corners.bottom - source.point.y + 20;
        } else if ((portdirection === 'Top' || portdirection === 'Bottom') && (source.point.x >= source.corners.left
            && source.point.x <= source.corners.center.x) &&
            (target.point.x >= source.corners.left && target.point.x <= source.corners.center.x)) {
            source.direction = 'Left';
            length = source.point.x - source.corners.left + 20;
        } else if ((portdirection === 'Top' || portdirection === 'Bottom') && (source.point.x <= source.corners.right
            && source.point.x > source.corners.center.x) &&
            (target.point.x <= source.corners.right && target.point.x < source.corners.center.x)) {
            source.direction = 'Right';
            length = source.corners.right - source.point.x + 20;
        }
        if (source.direction && length) {
            point = orthoConnection3Segment(element, source, target, length, true);
        }
    } else {
        source.direction = (direction) ? direction : findSourceDirection(source.direction, source.point, target.point) as Direction;
        point = orthoConnection2Segment(source, target);
    }
    return point;
}

/**
 * pointToNode method \
 *
 * @returns { void }     pointToNode method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 *
 * @private
 */
function pointToNode(element: Connector, source: End, target: End): PointModel[] {
    let point: PointModel[];
    target.corners = element.targetWrapper.corners;
    findDirection(element.targetWrapper, source, target, element);
    const direction: Direction = findSourceDirection(target.direction, source.point, target.point);
    if (source.direction === target.direction && (source.direction === 'Left' || source.direction === 'Right')) {
        source.direction = direction;
        point = orthoConnection3Segment(element, source, target, element.targetWrapper.width / 2 + 20);
        const source1: End = source; source1.point = point[1];
        findDirection(element.targetWrapper, source, target, element);
        point = orthoConnection3Segment(element, source, target);
    } else {
        source.direction = direction;
        point = orthoConnection2Segment(source, target);
    }
    return point;
}

/**
 * addPoints method \
 *
 * @returns { void }     addPoints method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 *
 * @private
 */
function addPoints(element: Connector, source: End, target: End): PointModel[] {
    target.corners = element.targetWrapper.corners;
    let direction: Direction; let length: number;
    if (source.direction !== 'Left' && source.direction !== 'Right') {
        if (target.corners.center.y === source.point.y &&
            (!(target.corners.left <= source.point.x && source.point.x <= target.corners.right))) {
            direction = 'Top';
            length = target.corners.height / 2 + 20;
        } else if ((target.corners.center.y === source.point.y &&
            (element.segments[element.segments.length - 2] as OrthogonalSegment).direction === 'Bottom') ||
            (target.corners.center.y > source.point.y && source.point.y >= target.corners.top)) {
            direction = 'Top';
            length = (source.point.y - target.corners.top) + 20;
        } else if ((target.corners.center.y === source.point.y &&
            (element.segments[element.segments.length - 2] as OrthogonalSegment).direction === 'Top') ||
            (target.corners.center.y < source.point.y && source.point.y <= target.corners.bottom)) {
            direction = 'Bottom';
            length = (target.corners.bottom - source.point.y) + 20;
        } else if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
            source.corners.top <= source.point.y && source.point.y <= source.corners.bottom) {
            direction = source.direction;
            length = (source.point.y > target.point.y) ? (source.point.y - source.corners.top + 20) :
                (source.corners.bottom - source.point.y + 20);
        }
    } else {
        if (target.corners.center.x === source.point.x &&
            (!(target.corners.top < source.point.y && source.point.y <= target.corners.bottom))) {
            direction = 'Left';
            length = target.corners.width / 2 + 20;
        } else if ((target.corners.center.x === source.point.x &&
            (element.segments[element.segments.length - 2] as OrthogonalSegment).direction === 'Right')
            || (target.corners.center.x > source.point.x && source.point.x >= target.corners.left)) {
            direction = 'Left';
            length = (source.point.x - target.corners.left) + 20;
        } else if ((target.corners.center.x === source.point.x &&
            (element.segments[element.segments.length - 2] as OrthogonalSegment).direction === 'Left') ||
            (target.corners.center.x <= source.point.x && source.point.x <= target.corners.right)) {
            direction = 'Right';
            length = (target.corners.right - source.point.x) + 20;
        } else if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
            source.corners.left <= source.point.x && source.point.x <= source.corners.right) {
            direction = source.direction;
            length = (source.point.x > target.point.x) ? (source.point.x - source.corners.left + 20) :
                (source.corners.right - source.point.x + 20);
        }
    }
    const extra: number = (direction === 'Left' || direction === 'Top') ? -(length) : length;
    const angle: number = (direction === 'Left' || direction === 'Right') ? 0 : 90;
    const refPoint: PointModel = source.point;
    source.point = addLineSegment(source.point, extra, angle);
    source.direction = Point.direction(source.point, target.point) as Direction;
    if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
        (source.corners.center.x === target.corners.center.x || source.corners.center.y === target.corners.center.y)) {
        source.direction = target.direction;
    }
    const point: PointModel[] = orthoConnection3Segment(element, source, target);
    point.splice(0, 0, refPoint);
    return point;
}

/**
 * findSegmentDirection method \
 *
 * @returns { void }     findSegmentDirection method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 * @param {Direction} portDir - provide the target value.
 *
 * @private
 */
function findSegmentDirection(element: Connector, source: End, target: End, portDir: Direction): boolean {
    let update: boolean = false;
    switch (target.direction) {
        case 'Left': if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined && (portDir === 'Right' &&
            source.point.x > target.point.x && source.point.y >= source.corners.top &&
            source.point.y <= source.corners.bottom)
            || (((portDir === 'Bottom' && source.point.y > target.point.y) ||
                (portDir === 'Top' && source.point.y < target.point.y)) &&
                source.point.x >= source.corners.left && source.point.x <= source.corners.right)) {
            source.direction = (portDir === 'Right') ? ((source.point.y > target.point.y) ? 'Top' : 'Bottom') :
                (source.point.x < target.point.x ? 'Right' : 'Left');
            update = true;
        } else
            if (source.point.x > target.point.x && (source.point.y > target.point.y || source.point.y < target.point.y)
                && (!(target.corners.top > source.point.y && target.corners.bottom < source.point.y))) {
                source.direction = 'Left';
            } else if ((source.point.x < target.point.x && source.point.y > target.point.y) ||
                (source.point.x > target.point.x && (source.point.y <= target.point.y)
                    && ((target.corners.top < source.point.y && target.corners.center.y >= source.point.y)))) {
                source.direction = 'Top';
            } else if ((source.point.x < target.point.x && source.point.y < target.point.y) ||
                (source.point.x > target.point.x && (source.point.y > target.point.y)
                    && ((target.corners.bottom < source.point.y && target.corners.center.y > source.point.y)))) {
                source.direction = 'Bottom';
            } else if (source.point.y === target.point.y && source.point.x < target.point.x) {
                source.direction = 'Right';
            } break;
        case 'Right': if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
            ((portDir === 'Bottom' && source.point.y > target.point.y) ||
                (portDir === 'Top' && source.point.y < target.point.y)) && source.point.x > target.point.x &&
            (source.point.x >= source.corners.left && source.point.x <= source.corners.right)) {
            source.direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
            update = true;
        } else if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
            portDir === 'Left' && source.point.x < target.point.x && (source.point.y >= source.corners.top &&
                source.point.y <= source.corners.bottom)) {
            source.direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
            update = true;
        } else if (source.point.x < target.point.x && target.corners.top <= source.point.y
            && target.corners.bottom >= source.point.y && source.point.y === target.point.y) {
            source.direction = 'Top';
        } else if (source.point.y > target.point.y && source.point.x > target.point.x) {
            source.direction = 'Top';
        } else if (source.point.y < target.point.y && source.point.x > target.point.x) {
            source.direction = 'Bottom';
        } else if (source.point.x < target.point.x && (source.point.y > target.point.y ||
            source.point.y < target.point.y)) {
            source.direction = 'Right';
        } else if (source.point.y === target.point.y && source.point.x > target.point.x) {
            source.direction = 'Left';
        } break;
        case 'Top': if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined && (portDir === 'Bottom' &&
            source.point.y > target.point.y && source.point.x >= source.corners.left &&
            source.point.x <= source.corners.right) || (((portDir === 'Right' && source.point.x > target.point.x) ||
                (portDir === 'Left' && target.point.y > source.point.y && target.point.x > source.point.x)) &&
                (source.point.y >= source.corners.top && source.point.y <= source.corners.bottom))) {
            source.direction = (portDir === 'Bottom') ? ((source.point.x > target.point.x) ? 'Left' : 'Right') :
                (source.point.y < target.point.y) ? 'Bottom' : 'Top';
            update = true;
        } else if (source.point.x === target.point.x && source.point.y < target.point.y) {
            source.direction = 'Bottom';
        } else if (source.point.y > target.point.y && source.point.x > target.corners.left &&
            source.point.x < target.corners.right) {
            source.direction = 'Left';
        } else if (source.point.y >= target.point.y) {
            source.direction = 'Top';
        } else if (source.point.y < target.point.y && source.point.x > target.point.x) {
            source.direction = 'Left';
        } else if (source.point.y < target.point.y && source.point.x < target.point.x) {
            source.direction = 'Right';
        } break;
        case 'Bottom': if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined && ((((portDir === 'Right') ||
            (portDir === 'Left' && target.point.x > source.point.x)) && (source.point.y > target.point.y) &&
            source.point.y >= source.corners.top && source.point.y <= source.corners.bottom) ||
            (((portDir === 'Top' && source.point.y < target.point.y)) &&
                (source.point.x >= source.corners.left && source.point.x <= source.corners.right)))) {
            if (portDir === 'Right' || portDir === 'Left') {
                source.direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
            } else {
                source.direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
            }
            update = true;
        } else if (source.point.y < target.point.y && source.point.x > target.corners.left &&
            target.corners.right > source.point.x) {
            if (source.point.y < target.point.y && source.point.x > target.corners.left &&
                target.corners.center.x >= source.point.x) {
                source.direction = 'Left';
            } else if (source.point.y < target.point.y && source.point.x < target.corners.right &&
                target.corners.center.x < source.point.x) {
                source.direction = 'Right';
            }
        } else if (source.point.y > target.point.y && source.point.x > target.point.x) {
            source.direction = 'Left';
        } else if (source.point.y > target.point.y && source.point.x < target.point.x) {
            source.direction = 'Right';
        } else if (source.point.y <= target.point.y && (source.point.x > target.point.x || target.point.x > source.point.x)) {
            source.direction = 'Bottom';
        } break;
    }
    return update;
}

/**
 * pointToPort method \
 *
 * @returns { void }     pointToPort method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 *
 * @private
 */
function pointToPort(element: Connector, source: End, target: End): PointModel[] {
    let point: PointModel[]; target.corners = element.targetWrapper.corners; let portdirection: Direction; let length: number;
    if (element.sourcePortWrapper !== undefined) {
        const port: PointModel = { x: element.sourcePortWrapper.offsetX, y: element.sourcePortWrapper.offsetY };
        portdirection = getPortDirection(port, cornersPointsBeforeRotation(element.sourceWrapper), element.sourceWrapper.bounds, false);
    }
    const update: boolean = findSegmentDirection(element, source, target, portdirection);
    if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
        target.direction === getOppositeDirection(portdirection) &&
        ((((target.direction === 'Left' && source.point.x > target.point.x) || (target.direction === 'Right' &&
            source.point.x < target.point.x)) && source.point.y >= source.corners.top &&
            source.point.y <= source.corners.bottom) || (target.direction === 'Bottom' && source.point.y < target.point.y &&
                (source.point.x >= source.corners.left && source.point.x <= source.corners.right)))) {

        point = addPoints(element, source, target);

    } else if (source.direction === target.direction) {
        point = orthoConnection3Segment(element, source, target);
    } else if ((((target.direction === 'Left' && source.point.x > target.point.x) ||
        (target.direction === 'Right' && source.point.x < target.point.x)) && (source.direction === 'Top' || source.direction === 'Bottom')
        && ((source.point.y <= target.point.y) &&
            ((target.corners.top <= source.point.y && target.corners.bottom >= source.point.y)))) ||
        ((target.direction === 'Top' && source.point.y > target.point.y) ||
            (target.direction === 'Bottom' && source.point.y < target.point.y) &&
            ((target.corners.left <= source.point.x && target.corners.right >= source.point.x)))) {
        point = addPoints(element, source, target);
    } else {
        if (element.sourceWrapper !== undefined && element.targetWrapper !== undefined && element.targetPortWrapper !== undefined &&
            ((source.direction === 'Left' || source.direction === 'Right') &&
                (source.point.y >= source.corners.top && source.point.y <= source.corners.bottom)
                && (target.direction === 'Top' || target.direction === 'Bottom') &&
                (target.corners.center.x === source.corners.center.x))) {
            source.direction = (target.direction === 'Top') ? 'Bottom' : 'Top';
            length = (target.direction === 'Top') ? (source.corners.bottom - source.point.y + 20) :
                (source.point.y - source.corners.top + 20);
            point = orthoConnection3Segment(element, source, target, length);
        } else if (element.sourceWrapper !== undefined && element.targetWrapper !== undefined && element.targetPortWrapper !== undefined &&
            ((source.direction === 'Top' || source.direction === 'Bottom') &&
                (source.point.x >= source.corners.left && source.point.x <= source.corners.right) &&
                (target.direction === 'Left' || target.direction === 'Right') && (target.corners.center.y === source.corners.center.y))) {
            source.direction = (target.direction === 'Left') ? 'Right' : 'Left';
            length = (target.direction === 'Left') ? (source.corners.right - source.point.x + 20) :
                (source.point.x - source.corners.left + 20);
            point = orthoConnection3Segment(element, source, target, length);
        } else if (update) {
            if (source.direction === 'Left' || source.direction === 'Right') {
                length = (source.direction === 'Left') ? (source.point.x - source.corners.left + 20) :
                    (source.corners.right - source.point.x + 20);
            } else {
                length = (source.direction === 'Top') ? (source.point.y - source.corners.top + 20) :
                    (source.corners.bottom - source.point.y + 20);
            }
            point = orthoConnection3Segment(element, source, target, length);
        } else {
            point = orthoConnection2Segment(source, target);
        }
    }
    return point;
}

/**
 * findPointToPointOrtho method \
 *
 * @returns { void }     findPointToPointOrtho method .\
 * @param {Connector} element - provide the element value.
 * @param {DiagramElement} source - provide the source value.
 * @param {DiagramElement} target - provide the target value.
 * @param {DiagramElement} sourceNode - provide the target value.
 * @param {DiagramElement} targetNode - provide the target value.
 * @param {DiagramElement} sourcePort - provide the sourcePort value.
 * @param {DiagramElement} targetPort - provide the targetPort value.
 *
 * @private
 */
function findPointToPointOrtho(
    element: Connector, source: End, target: End, sourceNode: DiagramElement, targetNode: DiagramElement,
    sourcePort: DiagramElement, targetPort: DiagramElement): PointModel[] {
    let j: number; let point: PointModel[]; let intermeditatePoints: PointModel[] = [];
    let direction: Direction; let port: PointModel; //let seg: OrthogonalSegment;
    checkLastSegmentasTerminal(element); let removeSegment: number;
    if (element.segments.length > 0) {
        for (let i: number = 0; i < element.segments.length; i++) {
            const seg: OrthogonalSegment = (element.segments[i] as OrthogonalSegment);
            if (i === 0 && element.sourcePortWrapper !== undefined) {
                port = { x: sourcePort.offsetX, y: sourcePort.offsetY };
                direction = getPortDirection(port, cornersPointsBeforeRotation(sourceNode), sourceNode.bounds, false) as Direction;
                if (seg.direction === getOppositeDirection(direction)) {
                    seg.direction = direction;
                }
            }
            if (i > 0 && (element.segments[i - 1] as OrthogonalSegment).direction === seg.direction) {
                i = checkConsectiveSegmentAsSame(element, i, source);
            } else {
                const lastSegment: OrthogonalSegment = element.segments[i - 1] as OrthogonalSegment;
                source.point = (seg.direction) ? updateSegmentPoints(source, seg) :
                    lastSegment.points[lastSegment.points.length - 1];
            }
            if (i === element.segments.length - 1) {
                if (!targetPort && !targetNode) {
                    point = pointToPoint(element, source, target);
                } else if (element.targetWrapper && element.targetPortWrapper === undefined) {
                    checkSourcePointInTarget(element, source);
                    point = pointToNode(element, source, target);
                } else {
                    point = pointToPort(element, source, target);
                }
                if (point) {
                    checkPreviousSegment(point, element, source);
                    seg.points = [];
                    if (point.length >= 2) {
                        for (j = 0; j < point.length; j++) {
                            seg.points.push(point[j]);
                        }
                    } else {
                        removeSegment = i;
                    }
                }
            }
            if (sourcePort && i === 0) {
                const sourcePoint: PointModel = checkPortdirection(element, sourcePort, sourceNode);
                if (sourcePoint) {
                    source.point = sourcePoint;
                }
            }
        }
        if (removeSegment !== undefined) {
            if (removeSegment === element.segments.length - 1) {
                (element.segments[removeSegment - 1] as OrthogonalSegment).direction = null;
                (element.segments[removeSegment - 1] as OrthogonalSegment).length = null;
            }
            element.segments.splice(removeSegment, 1);
        }
        intermeditatePoints = returnIntermeditatePoints(element, intermeditatePoints);
    }
    return intermeditatePoints;
}

/**
 * checkPortdirection method \
 *
 * @returns { PointModel }     checkPortdirection method .\
 * @param {Connector} element - provide the element value.
 * @param {DiagramElement} sourcePort - provide the target value.
 * @param {DiagramElement} sourceNode - provide the target value.
 *
 * @private
 */
function checkPortdirection(element: Connector, sourcePort: DiagramElement, sourceNode: DiagramElement): PointModel {
    const port: PointModel = { x: sourcePort.offsetX, y: sourcePort.offsetY };
    let point: PointModel; const bounds: Rect = cornersPointsBeforeRotation(sourceNode);
    const direction: Direction = getPortDirection(port, bounds, sourceNode.bounds, false);
    const seg: OrthogonalSegment = (element.segments[0] as OrthogonalSegment);
    if (seg.direction !== direction) {
        pointsFromNodeToPoint(seg, direction, bounds, seg.points[0], seg.points[seg.points.length - 1], false);
        point = seg.points[seg.points.length - 1];
        seg.direction = Point.direction(seg.points[seg.points.length - 2], seg.points[seg.points.length - 1]) as Direction;
    }
    return point;
}

/**
 * checkPreviousSegment method \
 *
 * @returns { PointModel }     checkPreviousSegment method .\
 * @param {Connector} tPoints - provide the element value.
 * @param {DiagramElement} connector - provide the target value.
 * @param {DiagramElement} source - provide the target value.
 *
 * @private
 */
function checkPreviousSegment(tPoints: PointModel[], connector: Connector, source: End): void {
    const actualSegment: OrthogonalSegment = connector.segments[connector.segments.length - 2] as OrthogonalSegment;
    const actualLastPoint: PointModel = actualSegment.points[actualSegment.points.length - 1]; let direction: Direction;
    if (((actualSegment.direction === 'Top' || actualSegment.direction === 'Bottom') && (actualLastPoint.x === tPoints[1].x)) ||
        ((actualSegment.direction === 'Left' || actualSegment.direction === 'Right') && (actualLastPoint.y === tPoints[1].y))) {

        actualSegment.points[actualSegment.points.length - 1] = tPoints[1];
        direction = Point.direction(
            actualSegment.points[0], actualSegment.points[actualSegment.points.length - 1]) as Direction;
        if (connector.sourceWrapper !== undefined && connector.sourcePortWrapper === undefined &&
            direction === getOppositeDirection(actualSegment.direction)) {
            if (actualSegment.direction === 'Left' || actualSegment.direction === 'Right') {
                actualSegment.points[0].x = (actualSegment.direction === 'Right') ?
                    actualSegment.points[0].x - connector.sourceWrapper.corners.width :
                    actualSegment.points[0].x + connector.sourceWrapper.corners.width;
            } else {
                actualSegment.points[0].y = (actualSegment.direction === 'Bottom') ?
                    actualSegment.points[0].y - connector.sourceWrapper.corners.height :
                    actualSegment.points[0].y + connector.sourceWrapper.corners.height;
            }
        }
        actualSegment.direction = direction;
        actualSegment.length = Point.distancePoints(actualSegment.points[0], actualSegment.points[actualSegment.points.length - 1]);
        tPoints.splice(0, 1);
    }
}

/**
 * connectToOneEnd method \
 *
 * @returns { void }     connectToOneEnd method .\
 * @param {Connector} element - provide the element value.
 * @param {DiagramElement} source - provide the target value.
 * @param {DiagramElement} target - provide the target value.
 *
 * @private
 */
function connectToOneEnd(element: Connector, source: End, target: End): void {
    const sourcePort: DiagramElement = element.sourcePortWrapper;
    const targetPort: DiagramElement = element.targetPortWrapper;
    let node: DiagramElement = element.sourceWrapper;
    let fixedPoint: PointModel = source.point;
    let nodeMargin: MarginModel = { left: 0, right: 0, top: 0, bottom: 0 };
    let nodeConnectingPoint: PointModel = { x: 0, y: 0 };
    let refPoint: PointModel;
    let nodeDirection: Direction = 'Top';

    if (!node) {
        node = element.targetWrapper;
        nodeMargin = target.margin;
    } else {
        fixedPoint = target.point;
        nodeMargin = source.margin;
    }

    if (element.type === 'Orthogonal') {
        if ((element.segments && element.segments.length > 0) && element.sourceWrapper &&
            (element.segments[0] as OrthogonalSegment).direction) {
            source.direction = (element.segments[0] as OrthogonalSegment).direction;
            nodeConnectingPoint = findPoint(node.corners, source.direction);
            refPoint = findPoint(node.corners, getOppositeDirection(source.direction));
            nodeConnectingPoint = getIntersection(element, node, nodeConnectingPoint, refPoint, false);
        } else {
            const source: End = { corners: null, direction: null, point: fixedPoint, margin: nodeMargin };
            const target: End = { corners: null, direction: null, point: null, margin: null };
            findDirection(node, source, target, element);
            nodeConnectingPoint = target.point;
            nodeDirection = target.direction;
        }
    } else {
        let segmentPoint: PointModel;

        if (element.segments && element.segments.length > 1) {
            if (node === element.sourceWrapper) {
                segmentPoint = (element.segments[0] as StraightSegmentModel | BezierSegmentModel).point;
            } else {
                segmentPoint = (element.segments[element.segments.length - 2] as StraightSegmentModel | BezierSegmentModel).point;
            }
        }
        nodeConnectingPoint = getIntersection(
            element, node, node.bounds.center,
            (element.segments && element.segments.length > 1) ? segmentPoint : fixedPoint, node === element.targetWrapper);
    }
    if (node === element.sourceWrapper) {
        source.direction = source.direction || nodeDirection;
        source.point = nodeConnectingPoint;
        if (element.sourcePortWrapper) {
            source.point = { x: sourcePort.offsetX, y: sourcePort.offsetY };
            if (element.sourcePadding) {
                source.point = addPaddingToConnector(element, source, target, false);
            }
        }
    } else {
        target.direction = target.direction || nodeDirection;
        target.point = nodeConnectingPoint;
        if (element.targetPortWrapper) {
            target.point = { x: targetPort.offsetX, y: targetPort.offsetY };
            if (element.targetPadding) {
                target.point = addPaddingToConnector(element, source, target, true);
            }
        }
    }
}

/**
 * addPaddingToConnector method \
 *
 * @returns { void }     addPaddingToConnector method .\
 * @param {Connector} element - provide the element value.
 * @param {DiagramElement} source - provide the target value.
 * @param {DiagramElement} target - provide the target value.
 * @param {DiagramElement} isTarget - provide the target value.
 *
 * @private
 */
function addPaddingToConnector(element: Connector, source: End, target: End, isTarget: boolean): PointModel {
    const sourcePort: DiagramElement = element.sourcePortWrapper;
    const targetPort: DiagramElement = element.targetPortWrapper;
    const padding: number = (isTarget) ? element.targetPadding : element.sourcePadding;
    const paddingPort: DiagramElement = (isTarget) ? targetPort : sourcePort;
    const rect: Rect = new Rect(
        paddingPort.bounds.x - padding, paddingPort.bounds.y - padding,
        paddingPort.actualSize.width + 2 * padding, paddingPort.actualSize.height + 2 * padding);
    const segmentPoints: PointModel[] = [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];
    segmentPoints[segmentPoints.length] = segmentPoints[0];
    //const length: number = segmentPoints.length;
    const thisSegment: Segment = { x1: source.point.x, y1: source.point.y, x2: target.point.x, y2: target.point.y };
    const point: PointModel = (isTarget) ? target.point : source.point;
    return getIntersectionPoints(thisSegment, segmentPoints, true, point) || point;
}
/**
 * checkSourceAndTargetIntersect method \
 *
 * @returns { void }     checkSourceAndTargetIntersect method .\
 * @param {DiagramElement} sourceWrapper - provide the sourceWrapper value.
 * @param {DiagramElement} targetWrapper - provide the targetWrapper value.
 * @param {Connector} connector - provide the Connector value.
 *
 * @private
 */
function checkSourceAndTargetIntersect(sourceWrapper: DiagramElement, targetWrapper: DiagramElement, connector?: Connector): boolean {
    const sourceSegment: Segment[] = createSegmentsCollection(sourceWrapper, connector.sourcePadding);
    const targetSegment: Segment[] = createSegmentsCollection(targetWrapper, connector.targetPadding);
    for (let i: number = 0; i < sourceSegment.length - 1; i++) {
        const srcSegment: Segment = sourceSegment[i];
        for (let j: number = 0; j < targetSegment.length - 1; j++) {
            const tarSegmet: Segment = targetSegment[j];
            if (intersect3(srcSegment, tarSegmet).enabled) {
                return true;
            }
        }
    }
    return false;
}
/**
 * createSegmentsCollection method \
 *
 * @returns { Segment[] }     createSegmentsCollection method .\
 * @param {DiagramElement} sourceWrapper - provide the sourceWrapper value.
 * @param {number} padding - provide the padding value.
 *
 * @private
 */
function createSegmentsCollection(sourceWrapper: DiagramElement, padding: number): Segment[] {
    const segments: Segment[] = [];
    const points: PointModel[] = getPoints(sourceWrapper, sourceWrapper.corners, padding);
    points.push(points[0]);
    for (let i: number = 0; i < points.length - 1; i++) {
        segments.push(createLineSegment(points[i], points[i + 1]));
    }
    return segments;
}
/**
 * createLineSegment method \
 *
 * @returns { Segment }     createLineSegment method .\
 * @param {PointModel} sPt - provide the sourceWrapper value.
 * @param {PointModel} tPt - provide the padding value.
 *
 * @private
 */
function createLineSegment(sPt: PointModel, tPt: PointModel): Segment {
    const line: Segment = { x1: sPt.x, y1: sPt.y, x2: tPt.x, y2: tPt.y };
    return line;
}

/**
 * swapBounds method \
 *
 * @returns { Corners }     swapBounds method .\
 * @param {PointModel} object - provide the sourceWrapper value.
 * @param {PointModel} bounds - provide the padding value.
 * @param {Rect} outerBounds - provide the padding value.
 *
 * @private
 */
export function swapBounds(object: DiagramElement, bounds: Corners, outerBounds: Rect): Corners {
    let rectBounds: Corners;
    const rotateAngle: number = object.rotateAngle + object.parentTransform;
    if (rotateAngle) {
        if (rotateAngle < 45) {
            return bounds;
        } else if (rotateAngle <= 135) {
            rectBounds = {
                width: bounds.width, height: bounds.height,
                topLeft: bounds.bottomLeft, topCenter: bounds.middleLeft, topRight: bounds.topLeft,
                middleLeft: bounds.bottomCenter, center: outerBounds.center, middleRight: bounds.topCenter,
                bottomLeft: bounds.bottomRight, bottomCenter: bounds.middleRight, bottomRight: bounds.topRight,
                left: outerBounds.left, right: outerBounds.right, top: outerBounds.top, bottom: outerBounds.bottom
            };
        } else if (rotateAngle <= 225) {
            rectBounds = {
                width: bounds.width, height: bounds.height,
                topLeft: bounds.bottomLeft, topCenter: bounds.bottomCenter, topRight: bounds.bottomRight,
                middleLeft: bounds.middleRight, center: outerBounds.center, middleRight: bounds.middleLeft,
                bottomLeft: bounds.topLeft, bottomCenter: bounds.topCenter, bottomRight: bounds.topRight,
                left: outerBounds.left, right: outerBounds.right, top: outerBounds.top,
                bottom: outerBounds.bottom
            };
        } else if (rotateAngle <= 315) {
            rectBounds = {
                width: bounds.width, height: bounds.height,
                topLeft: bounds.topRight, topCenter: bounds.middleRight, topRight: bounds.bottomRight,
                middleLeft: bounds.topCenter, center: outerBounds.center, middleRight: bounds.bottomCenter,
                bottomLeft: bounds.topLeft, bottomCenter: bounds.middleLeft, bottomRight: bounds.bottomLeft,
                left: outerBounds.left, right: outerBounds.right, top: outerBounds.top, bottom: outerBounds.bottom
            };
        } else {
            return bounds;
        }
        return rectBounds;
    }
    return bounds;
}
/**
 * defaultOrthoConnection method \
 *
 * @returns { PointModel[] }     defaultOrthoConnection method .\
 * @param {Connector} ele - provide the Connector value.
 * @param {Direction} srcDir - provide the srcDir value.
 * @param {Direction} tarDir - provide the srcDir value.
 * @param {PointModel} sPt - provide the sPt value.
 * @param {PointModel} tPt - provide the tPt value.
 * @param {Rect} lineDistribution - provide the padding value.
 *
 * @private
 */
/* tslint:disable */
// eslint-disable-next-line
function defaultOrthoConnection(ele: Connector, srcDir: Direction, tarDir: Direction, sPt: PointModel, tPt: PointModel, lineDistribution?: boolean): PointModel[] {
    const sourceEle: DiagramElement = ele.sourceWrapper; const targetEle: DiagramElement = ele.targetWrapper;
    const srcPort: DiagramElement = ele.sourcePortWrapper; const tarPort: DiagramElement = ele.targetPortWrapper;
    let intermeditatePoints: PointModel[] = []; let refPoint: PointModel; const srcCor: Corners = sourceEle.corners;
    // eslint-disable-next-line
    const tarCor: Corners = targetEle.corners; const point: PointModel = tarCor.center; //const i: number;
    const sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
    const targetMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
    const source: End = { corners: srcCor, point: sPt, direction: srcDir, margin: sourceMargin };
    // eslint-disable-next-line
    let target: End = { corners: tarCor, point: tPt, direction: tarDir, margin: targetMargin };
    const srcBounds: Corners = swapBounds(sourceEle, srcCor, ele.sourceWrapper.bounds);
    const tarBounds: Corners = swapBounds(targetEle, tarCor, ele.targetWrapper.bounds);
    let isInterSect: boolean = false;
    if (ele.sourceWrapper && ele.targetWrapper) {
        isInterSect = checkSourceAndTargetIntersect(ele.sourceWrapper, ele.targetWrapper, ele);
    }
    if (srcPort !== undefined) {
        source.point = { x: srcPort.offsetX, y: srcPort.offsetY };
        switch (source.direction) {
            case 'Bottom':
            case 'Top':
                // eslint-disable-next-line
                source.point.y = source.point.y;
                break;
            case 'Left':
            case 'Right':
                // eslint-disable-next-line
                source.point.x = source.point.x;
                break;
        }
        if (ele.sourcePadding && !isInterSect) {
            if (tarPort) {
                target.point = {
                    x: tarPort.offsetX,
                    y: tarPort.offsetY
                };
            }
            source.point = addPaddingToConnector(ele, source, target, false);
        }
    } else {
        if (ele.type === 'Orthogonal' || ele.type === 'Bezier') {
            if (ele.segments && ele.segments.length > 0 && (ele.segments[0] as OrthogonalSegmentModel).direction) {
                source.direction = (ele.segments[0] as OrthogonalSegmentModel).direction;
            }
            source.point = findPoint(srcBounds, source.direction);
            refPoint = findPoint(srcBounds, getOppositeDirection(source.direction));
            source.point = getIntersection(ele, sourceEle, source.point, refPoint, false);
        } else { source.point = sourceEle.corners.center; }
    }
    if (tarPort !== undefined) {
        target.point = {
            x: tarPort.offsetX,
            y: tarPort.offsetY
        };
        switch (target.direction) {
            case 'Bottom':
            case 'Top':
                // eslint-disable-next-line
                target.point.y = target.point.y;
                break;
            case 'Left':
            case 'Right':
                // eslint-disable-next-line
                target.point.x = target.point.x;
                break;
        }
        if (ele.targetPadding && !isInterSect) {
            target.point = addPaddingToConnector(ele, source, target, true);
        }
    } else {
        if (ele.type === 'Orthogonal' || ele.type === 'Bezier') {
            target.point = findPoint(tarBounds, target.direction);
            refPoint = findPoint(tarBounds, getOppositeDirection(target.direction));
            target.point = getIntersection(ele, targetEle, target.point, refPoint, true);
        } else { target.point = targetEle.corners.center; }
    }
    if (ele.type !== 'Orthogonal') {
        let segment: StraightSegmentModel | BezierSegmentModel;
        let first: StraightSegmentModel | BezierSegmentModel;
        if (ele.type === 'Bezier') {
            if ((ele.segments.length === 0 || (ele.segments.length > 0 &&
                (!Point.isEmptyPoint((ele.segments[ele.segments.length - 1] as BezierSegmentModel).point))))) {
                intermeditatePoints = findOrthoSegments(ele, source, target, undefined, lineDistribution);
                intermeditatePoints = intermeditatePointsForStraight(ele, source, target);
                return intermeditatePoints;
            }
            else {
                checkLastSegmentasTerminal(ele);
            }
        }
        else {
            checkLastSegmentasTerminal(ele);
        }

        if (ele.sourcePortWrapper === undefined) {
            source.point = source.corners.center;
            if (ele.segments && ele.segments.length > 0) {
                first = ele.segments[0] as StraightSegmentModel | BezierSegmentModel;
                segment = (!Point.isEmptyPoint(first.point)) ? first : undefined;
            }
            let tarPoint: PointModel = (segment !== undefined) ? segment.point : target.point;
            if (ele.type === 'Bezier' && ele.segments.length > 0 &&
                (ele.segments[0] as BezierSegment).vector1.angle && (ele.segments[0] as BezierSegment).vector1.distance) {
                const value: number = Math.max(source.corners.width, source.corners.height);
                tarPoint = Point.transform(source.point, (ele.segments[0] as BezierSegment).vector1.angle, value / 2);
            }
            source.point = isInterSect ? ele.sourceWrapper.bounds.center : getIntersection(ele, sourceEle, source.point, tarPoint, false);
        }
        if (ele.targetPortWrapper === undefined) {
            target.point = target.corners.center;
            if (ele.segments && ele.segments.length > 1) {
                first = ele.segments[ele.segments.length - 2] as StraightSegmentModel | BezierSegmentModel;
                segment = (!Point.isEmptyPoint(first.point)) ? first : undefined;
            }
            let srcPoint: PointModel = (segment) ? segment.point : source.point;
            if (ele.type === 'Bezier' && ele.segments.length > 0 &&
                (ele.segments[ele.segments.length - 1] as BezierSegment).vector2.angle &&
                (ele.segments[ele.segments.length - 1] as BezierSegment).vector2.distance) {
                const value: number = Math.max(source.corners.width, source.corners.height);
                srcPoint = Point.transform(target.point, (ele.segments[0] as BezierSegment).vector2.angle, value / 2);
            }
            target.point = isInterSect ? ele.targetWrapper.bounds.center : getIntersection(ele, targetEle, srcPoint, target.point, true);
        }
        intermeditatePoints = intermeditatePointsForStraight(ele, source, target);
    } else {
        if (ele.type === 'Orthogonal' && (ele.segments && ele.segments.length > 0) &&
            (ele.segments[0] as OrthogonalSegment).direction !== null) {
            intermeditatePoints = findIntermeditatePoints(ele, source, target, srcPort, tarPort, sourceEle, targetEle);
        } else {
            if (!(ele.segments[0] as OrthogonalSegment)) {
                const segment: OrthogonalSegment = new OrthogonalSegment(ele, 'segments', { type: 'Orthogonal' }, true);
                ele.segments.push(segment);
            }
            // eslint-disable-next-line
            (ele.segments[0] as OrthogonalSegment).points = intermeditatePoints = findOrthoSegments(ele, source, target, undefined, lineDistribution);
        }
    }
    return intermeditatePoints;
}
/**
 * intermeditatePointsForStraight method \
 *
 * @returns { PointModel[] }     intermeditatePointsForStraight method .\
 * @param {Connector} element - provide the Connector value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 *
 * @private
 */
function intermeditatePointsForStraight(element: Connector, source: End, target: End): PointModel[] {
    const intermeditatePoints: PointModel[] = [];
    if (element.segments && element.segments.length > 0) {
        let i: number; let segPoint: PointModel[] = []; let srcPoint: PointModel = source.point;
        for (i = 0; i < element.segments.length; i++) {
            const seg: StraightSegment | BezierSegment = (element.segments[i] as BezierSegment | StraightSegment);
            segPoint = [];
            segPoint.push(srcPoint);
            if (i !== element.segments.length - 1) {
                segPoint.push(seg.point); srcPoint = seg.point;
            } else {
                segPoint.push(target.point);
            }
            (element.segments[i] as BezierSegment | StraightSegment).points = segPoint;
            if (element.segments.length > 1 && Point.equals(seg.points[0], seg.points[1])) {
                (element.segments).splice(i, 1);
            }
            if (seg) {
                for (let j: number = 0; j < seg.points.length; j++) {
                    if (j > 0 || i === 0) {
                        intermeditatePoints.push(seg.points[j]);
                    }
                }
            }
        }
    }
    return intermeditatePoints;
}

/**
 * findSourceDirection method \
 *
 * @returns { PointModel[] }     findSourceDirection method .\
 * @param {Direction} dir - provide the dir value.
 * @param {PointModel} srcPoint - provide the srcPoint value.
 * @param {PointModel} tarPoint - provide the tarPoint value.
 *
 * @private
 */
function findSourceDirection(dir: Direction, srcPoint: PointModel, tarPoint: PointModel): Direction {
    const direction: Direction = (dir === 'Top' || dir === 'Bottom') ?
        ((tarPoint.x > srcPoint.x) ? 'Right' : 'Left') :
        ((tarPoint.y > srcPoint.y) ? 'Bottom' : 'Top');
    return direction;
}

/**
 * checkLastSegmentasTerminal method \
 *
 * @returns { void }     checkLastSegmentasTerminal method .\
 * @param {Connector} ele - provide the Connector value.
 *
 * @private
 */
function checkLastSegmentasTerminal(ele: Connector): void {

    if (ele.type === 'Straight' || ele.type === 'Bezier') {
        if ((ele.segments.length === 0 || (ele.segments.length > 0 &&
            (!Point.isEmptyPoint((ele.segments[ele.segments.length - 1] as BezierSegmentModel | StraightSegmentModel).point))))) {
            //let segment: BezierSegmentModel | StraightSegmentModel;
            if (ele.type === 'Bezier') {
                const segment: BezierSegmentModel = new BezierSegment(ele, 'segments', { type: 'Bezier', isInternalSegment: true }, true);
                (ele.segments).push(segment);
            }
            else {
                const segment: StraightSegmentModel = new StraightSegment(ele, 'segments', { type: 'Straight' }, true);
                (ele.segments).push(segment);
            }
        }
    } else {
        if (ele.segments.length === 0 || (ele.segments[ele.segments.length - 1] as OrthogonalSegmentModel).direction) {
            const segment: OrthogonalSegment = new OrthogonalSegment(ele, 'segments', { type: 'Orthogonal' }, true);
            ele.segments.push(segment);
        }
    }
}

/**
 * checkConsectiveSegmentAsSame method \
 *
 * @returns { number }     checkConsectiveSegmentAsSame method .\
 * @param {Connector} ele - provide the Connector value.
 * @param {Connector} i - provide the Connector value.
 * @param {Connector} source - provide the Connector value.
 *
 * @private
 */
function checkConsectiveSegmentAsSame(ele: Connector, i: number, source: End): number {
    const seg: OrthogonalSegment = ele.segments[i] as OrthogonalSegment;
    const extra: number = (seg.direction === 'Left' || seg.direction === 'Top') ? -(seg.length) : seg.length;
    const angle: number = (seg.direction === 'Left' || seg.direction === 'Right') ? 0 : 90;
    const segPoint: PointModel = addLineSegment(source.point, extra, angle);
    (ele.segments[i - 1] as OrthogonalSegment).length += seg.length;
    (ele.segments[i - 1] as OrthogonalSegment).points[1] = source.point = segPoint;
    ele.segments.splice(i, 1); i--;
    return i;
}

/**
 * nodeOrPortToNode method \
 *
 * @returns { PointModel[] }     nodeOrPortToNode method .\
 * @param {Connector} ele - provide the Connector value.
 * @param {End} source - provide the Connector value.
 * @param {End} target - provide the Connector value.
 *
 * @private
 */
function nodeOrPortToNode(ele: Connector, source: End, target: End): PointModel[] {
    let point: PointModel[]; let portdirection: Direction;
    if (ele.sourcePortWrapper) {
        const port: PointModel = { x: ele.sourcePortWrapper.offsetX, y: ele.sourcePortWrapper.offsetY };
        portdirection = getPortDirection(port, cornersPointsBeforeRotation(ele.sourceWrapper), ele.sourceWrapper.bounds, false);
    }
    findDirection(ele.targetWrapper, source, target, ele);
    const direction: Direction = findSourceDirection(target.direction, source.point, target.point);
    if (ele.sourcePortWrapper !== undefined && source.direction === target.direction &&
        ((source.direction === 'Top' || source.direction === 'Bottom') && (source.corners.center.x === target.corners.center.x)
            || (source.direction === 'Left' || source.direction === 'Right') && (source.corners.center.y === target.corners.center.y))) {
        source.direction = direction;
        point = (direction === 'Top' || direction === 'Bottom') ?
            orthoConnection3Segment(ele, source, target, ele.sourceWrapper.height / 2 + 20) :
            orthoConnection3Segment(ele, source, target, ele.sourceWrapper.width / 2 + 20);
        const source1: End = source; source1.point = point[1];
        if (direction === 'Left' || direction === 'Right') {
            target.direction = direction;
            target.point = (direction === 'Left') ? target.corners.middleLeft : target.corners.middleRight;
        } else {
            findDirection(ele.targetWrapper, source, target, ele);
        }
        point = orthoConnection3Segment(ele, source, target);
    } else if (target.point.x >= source.corners.left && target.point.x <= source.corners.right &&
        source.point.y >= source.corners.top && source.point.y <= source.corners.bottom) {
        source.direction = (target.point.y > source.point.y) ? 'Bottom' : 'Top';
        const length: number = (source.direction === 'Top') ? (source.point.y - source.corners.top + 20) :
            (source.corners.bottom - source.point.y + 20);
        point = orthoConnection3Segment(ele, source, target, length);
    } else if (ele.sourcePortWrapper && portdirection === getOppositeDirection(direction)) {
        let length: number;
        if ((portdirection === 'Left' || portdirection === 'Right') && (source.point.y >= source.corners.top
            && source.point.y <= source.corners.bottom)) {
            source.direction = (target.point.y > source.point.y) ? 'Bottom' : 'Top';
            length = source.corners.height / 2 + 20;
        } else if ((portdirection === 'Top' || portdirection === 'Bottom') && (source.point.x >= source.corners.left
            && source.point.x <= source.corners.right)) {
            source.direction = (target.point.x > source.point.x) ? 'Right' : 'Left';
            length = source.corners.width / 2 + 20;
        }
        if (source.direction && length) {
            point = orthoConnection3Segment(ele, source, target, length, true);
        } else {
            source.direction = direction;
            point = orthoConnection2Segment(source, target);
        }
    } else if (ele.sourcePortWrapper && portdirection === target.direction && (portdirection === 'Top' || portdirection === 'Bottom') &&
        (source.corners.center.x === target.corners.center.x)) {
        source.direction = (target.point.y > source.point.y) ? 'Bottom' : 'Top';
        const len: number = (source.direction === 'Bottom') ? (source.corners.bottom - source.point.y + 20) :
            (source.point.y - source.corners.top + 20);
        point = orthoConnection3Segment(ele, source, target, len);
    } else {
        source.direction = direction;
        point = orthoConnection2Segment(source, target);
    }
    return point;
}

/**
 * checkSourcePointInTarget method \
 *
 * @returns { void } checkSourcePointInTarget method .\
 * @param {Connector} ele - provide the Connector value.
 * @param {End} source - provide the Connector value.
 *
 * @private
 */
function checkSourcePointInTarget(ele: Connector, source: End): void {
    if (ele.targetWrapper !== undefined && ele.targetPortWrapper === undefined) {
        const padding: number = 1;
        if (cornersPointsBeforeRotation(ele.targetWrapper).containsPoint(source.point, padding)) {
            const target: DiagramElement = ele.targetWrapper;
            const segment: OrthogonalSegment = ele.segments[ele.segments.length - 2] as OrthogonalSegment;
            const lastPoint: PointModel = segment.points[segment.points.length - 1];
            const direction: Direction = getOppositeDirection(segment.direction) as Direction;
            if (direction === 'Bottom') {
                if (lastPoint.y < target.corners.bottom + padding) {
                    segment.points[segment.points.length - 1].y = target.corners.bottom + 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            } else if (direction === 'Top') {
                if (lastPoint.y > target.corners.top - padding) {
                    segment.points[segment.points.length - 1].y = target.corners.top - 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            } else if (direction === 'Left') {
                if (lastPoint.x > target.corners.left - padding) {
                    segment.points[segment.points.length - 1].x = target.corners.left - 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            } else if (direction === 'Right') {
                if (lastPoint.x < target.corners.right + padding) {
                    segment.points[segment.points.length - 1].x = target.corners.right + 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            }
            source.point = segment.points[segment.points.length - 1];
        }
    }
}

/**
 * findIntermeditatePoints method \
 *
 * @returns { void } findIntermeditatePoints method .\
 * @param {Connector} ele - provide the ele value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the source value.
 * @param {DiagramElement} srcPort - provide the srcPort value.
 * @param {DiagramElement} tarPort - provide the tarPort value.
 * @param {DiagramElement} sourceEle - provide the sourceEle value.
 * @param {DiagramElement} targetEle - provide the targetEle value.
 * @private
 */
function findIntermeditatePoints(
    ele: Connector, source: End, target: End, srcPort: DiagramElement, tarPort: DiagramElement,
    sourceEle: DiagramElement, targetEle: DiagramElement): PointModel[] {
    let point: PointModel[]; const intermeditatePoints: PointModel[] = []; let seg: OrthogonalSegment;
    let j: number; let removeSegment: number;
    checkLastSegmentasTerminal(ele);
    for (let i: number = 0; i < ele.segments.length; i++) {
        seg = (ele.segments[i] as OrthogonalSegment);
        if (srcPort && source.direction === getOppositeDirection(seg.direction)) {
            seg.direction = source.direction;
        }
        if (i > 0 && (ele.segments[i - 1] as OrthogonalSegmentModel).direction === seg.direction) {
            i = checkConsectiveSegmentAsSame(ele, i, source);
        } else {
            if (seg.direction) {
                source.point = updateSegmentPoints(source, (ele.segments[i] as OrthogonalSegment));
            } else {
                const segment: OrthogonalSegment = ele.segments[i - 1] as OrthogonalSegment;
                source.point = segment.points[segment.points.length - 1];
            }
        }
        if (i === ele.segments.length - 1) {
            checkSourcePointInTarget(ele, source);
            if (tarPort === undefined) {
                point = nodeOrPortToNode(ele, source, target);
            } else {
                point = pointToPort(ele, source, target);
            }
            checkPreviousSegment(point, ele, source);
            seg.points = [];
            if (point.length >= 2) {
                for (j = 0; j < point.length; j++) {
                    seg.points.push(point[j]);
                }
            } else { removeSegment = i; }
        }
        if (removeSegment !== undefined) {
            if (removeSegment === ele.segments.length - 1) {
                (ele.segments[removeSegment - 1] as OrthogonalSegment).direction = null;
                (ele.segments[removeSegment - 1] as OrthogonalSegment).length = null;
            }
            ele.segments.splice(removeSegment, 1);
        }
        if (srcPort && i === 0) {
            const sourcePoint: PointModel = checkPortdirection(ele, srcPort, sourceEle);
            if (sourcePoint) {
                source.point = sourcePoint;
            }
        }
    }
    return returnIntermeditatePoints(ele, intermeditatePoints);
}

/**
 * returnIntermeditatePoints method \
 *
 * @returns { PointModel[] } returnIntermeditatePoints method .\
 * @param {Connector} element - provide the ele value.
 * @param {PointModel[]} intermeditatePoints - provide the source value.
 * @private
 */
function returnIntermeditatePoints(element: Connector, intermeditatePoints: PointModel[]): PointModel[] {
    for (let i: number = 0; i < element.segments.length; i++) {
        const seg: OrthogonalSegment = element.segments[i] as OrthogonalSegment;
        for (let j: number = 0; j < seg.points.length; j++) {
            if (j > 0 || i === 0) {
                intermeditatePoints.push(seg.points[j]);
            }
        }
    }
    return intermeditatePoints;
}

/**
 * findDirection method \
 *
 * @returns { void } findDirection method .\
 * @param {DiagramElement} node - provide the ele value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the source value.
 * @param {Connector} ele - provide the source value.
 * @private
 */
function findDirection(node: DiagramElement, source: End, target: End, ele: Connector): void {
    let nodeDirection: Direction; let nodeConnectingPoint: PointModel = { x: 0, y: 0 };
    const nodeCorners: Corners = swapBounds(node, node.corners, node.bounds);
    const nodeMargin: MarginModel = source.margin;
    const fixedPoint: PointModel = source.point;
    if (nodeCorners.bottomCenter.y + nodeMargin.bottom < fixedPoint.y) {
        nodeDirection = 'Bottom';
        nodeConnectingPoint = nodeCorners.bottomCenter;
    } else if (nodeCorners.topCenter.y - nodeMargin.top > fixedPoint.y) {
        nodeDirection = 'Top';
        nodeConnectingPoint = nodeCorners.topCenter;
    } else if (nodeCorners.middleLeft.x - nodeMargin.left > fixedPoint.x) {
        nodeDirection = 'Left';
        nodeConnectingPoint = nodeCorners.middleLeft;
    } else if (nodeCorners.middleRight.x + nodeMargin.right < fixedPoint.x) {
        nodeDirection = 'Right';
        nodeConnectingPoint = nodeCorners.middleRight;
    } else {
        const top: number = Math.abs(fixedPoint.y - nodeCorners.topCenter.y);
        const right: number = Math.abs(fixedPoint.x - nodeCorners.middleRight.x);
        const bottom: number = Math.abs(fixedPoint.y - nodeCorners.bottomCenter.y);
        const left: number = Math.abs(fixedPoint.x - nodeCorners.middleLeft.x);
        let shortes: number = Number.MAX_VALUE;

        shortes = top;
        nodeDirection = 'Top';
        nodeConnectingPoint = nodeCorners.topCenter;

        if (shortes > right) {
            shortes = right;
            nodeDirection = 'Right';
            nodeConnectingPoint = nodeCorners.middleRight;
        }
        if (shortes > bottom) {
            shortes = bottom;
            nodeDirection = 'Bottom';
            nodeConnectingPoint = nodeCorners.bottomCenter;
        }
        if (shortes > left) {
            //shortes = left;
            nodeDirection = 'Left';
            nodeConnectingPoint = nodeCorners.middleLeft;
        }
    }
    target.point = nodeConnectingPoint;
    target.direction = nodeDirection;
    const refPoint: PointModel = findPoint(nodeCorners, getOppositeDirection(target.direction));
    target.point = getIntersection(ele, node, target.point, refPoint, node === ele.targetWrapper);
}

/**
 * findOrthoSegments method \
 *
 * @returns { PointModel[] } findOrthoSegments method .\
 * @param {DiagramElement} ele - provide the ele value.
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target value.
 * @param {Connector} extra - provide the extra value.
 * @param {boolean} lineDistribution - provide the lineDistribution value.
 * @private
 */
function findOrthoSegments(ele: Connector, source: End, target: End, extra?: number, lineDistribution?: boolean): PointModel[] {
    let swap: boolean = false;
    let intermeditatePoints: PointModel[] = []; let seg: NoOfSegments;
    swap = getSwapping(source.direction, target.direction);
    if (swap) { swapPoints(source, target); }
    if (source.direction === 'Right' && target.direction === 'Left') {
        seg = getRightToLeftSegmentCount(ele, source, target, swap);
    } else if (source.direction === 'Right' && target.direction === 'Right') {
        seg = getRightToRightSegmentCount(ele, source, target);
    } else if (source.direction === 'Right' && target.direction === 'Top') {
        seg = getRightToTopSegmentCount(ele, source, target, swap);
    } else if (source.direction === 'Right' && target.direction === 'Bottom') {
        seg = getRightToBottomSegmentCount(ele, source, target, swap);
    } else if (source.direction === 'Bottom' && target.direction === 'Top') {
        seg = getBottomToTopSegmentCount(ele, source, target);
    } else if (source.direction === 'Bottom' && target.direction === 'Bottom') {
        /**
         * EJ2-56920-Option to adjust the distance between source node and target node.
         */
        let margin : number = findMargin(ele);
        source.margin = { left: margin, right: margin, top: margin, bottom: margin };
        target.margin = { left: margin, right: margin, top: margin, bottom: margin };
        seg = getBottomToBottomSegmentCount(ele, source, target);
    } else if (source.direction === 'Bottom' && target.direction === 'Left') {
        seg = getBottomToLeftSegmentCount(ele, source, target, swap);
    } else if (source.direction === 'Left' && target.direction === 'Left') {
        seg = getLeftToLeftSegmentCount(ele, source, target);
    } else if (source.direction === 'Left' && target.direction === 'Top') {
        seg = getLeftToTopSegmentCount(ele, source, target, swap);
    } else if (source.direction === 'Top' && target.direction === 'Top') {
        seg = getTopToTopSegmentCount(ele, source, target);
    }
    if (swap) { swapPoints(source, target); }
    intermeditatePoints = addOrthoSegments(ele, seg, source, target, extra, lineDistribution);
    if (ele.type === 'Bezier') {
        convertPointToBezierSegment(ele, seg, intermeditatePoints);
    }
    return intermeditatePoints;
}
/**
 * Returns the margin of source node and the target node
 * 
 * @returns { number } - findMargin method .\
 * @param { Connector } element - provide the element value
 * @private 
 */

export function findMargin(element:Connector):number{
    var margin;
    if(element.connectorSpacing>=13){
        margin=13;
    }
    else if(element.connectorSpacing<=1){
        margin=1;
    }
    else{
        margin = element.connectorSpacing;
    }
    return margin;
}

/**
 * findAngle method \
 *
 * @returns { number } findAngle method .\
 * @param {DiagramElement} s - provide the s value.
 * @param {End} e - provide the e value.
 * @private
 */
export function findAngle(s: PointModel, e: PointModel): number {
    const r: PointModel = { x: e.x, y: s.y };
    //const sr: number = Point.findLength(s, r);
    const re: number = Point.findLength(r, e);
    const es: number = Point.findLength(e, s);
    let ang: number = Math.asin(re / es);
    ang = ang * 180 / Math.PI;
    if (s.x < e.x) {
        if (s.y > e.y) {
            ang = 360 - ang;
        }
    } else {
        if (s.y < e.y) {
            ang = 180 - ang;
        } else {
            ang = 180 + ang;
        }
    }
    return ang;
}

/**
 * findPoint method \
 *
 * @returns { number } findPoint method .\
 * @param {Corners} cor - provide the cor value.
 * @param {string} direction - provide the direction value.
 * @private
 */
export function findPoint(cor: Corners, direction: string): PointModel {
    let point: PointModel;
    switch (direction) {
        case 'Left':
            point = cor.middleLeft;
            break;
        case 'Top':
            point = cor.topCenter;
            break;
        case 'Right':
            point = cor.middleRight;
            break;
        case 'Bottom':
            point = cor.bottomCenter;
            break;
    }
    return point;
}

/**
 * pointsFromNodeToPoint method \
 *
 * @returns { number } pointsFromNodeToPoint method .\
 * @param {OrthogonalSegment} seg - provide the seg value.
 * @param {string} direction - provide the direction value.
 * @param {Rect} bounds - provide the bounds value.
 * @param {PointModel} point - provide the point value.
 * @param {PointModel} endPoint - provide the endPoint value.
 * @param {boolean} isTarget - provide the isTarget value.
 * @private
 */
function pointsFromNodeToPoint(
    seg: OrthogonalSegment, direction: string, bounds: Rect, point: PointModel, endPoint: PointModel, isTarget: boolean):
    void {
    const minSpace: number = 13; let x: number;
    const points: PointModel[] = []; let y: number;
    points.push(point);
    //let straight: boolean;
    const straight: boolean = (point.y === endPoint.y && (direction === 'Left' && endPoint.x < point.x ||
        direction === 'Right' && endPoint.x > point.x)) ||
        (point.x === endPoint.x && (direction === 'Top' && endPoint.y < point.y ||
            direction === 'Bottom' && endPoint.y > point.y));
    if (!straight) {
        if (direction === 'Top' || direction === 'Bottom') {
            if (direction === 'Top' && endPoint.y < point.y && endPoint.y > point.y - minSpace ||
                direction === 'Bottom' && endPoint.y > point.y && endPoint.y < point.y + minSpace) {
                y = direction === 'Top' ? bounds.top - minSpace : bounds.bottom + minSpace;
                points.push({ x: point.x, y: y });
                points.push({ x: point.x + (endPoint.x - point.x) / 2, y: y });
                points.push({ x: point.x + (endPoint.x - point.x) / 2, y: endPoint.y });
            } else if (Math.abs(point.x - endPoint.x) > minSpace &&
                (direction === 'Top' && endPoint.y < point.y || direction === 'Bottom' && endPoint.y > point.y)) {
                //twosegments
                points.push({ x: point.x, y: endPoint.y });
            } else {
                y = direction === 'Top' ? bounds.top - minSpace : bounds.bottom + minSpace;
                x = (endPoint.x < point.x) ? bounds.left - minSpace : bounds.right + minSpace;
                points.push({ x: point.x, y: y });
                points.push({ x: endPoint.x, y: y });
            }
        } else {
            if (direction === 'Left' && endPoint.x < point.x && endPoint.x > point.x - minSpace || direction === 'right' &&
                endPoint.x > point.x && endPoint.x < point.x + minSpace) {
                x = direction === 'Left' ? bounds.left - minSpace : bounds.right + minSpace;
                points.push({ x: x, y: point.y });
                points.push({ x: x, y: point.y + (endPoint.y - point.y) / 2 });
                points.push({ x: endPoint.x, y: point.y + (endPoint.y - point.y) / 2 });
            } else if (Math.abs(point.y - endPoint.y) > minSpace &&
                (direction === 'Left' && endPoint.x < point.x || direction === 'Right' && endPoint.x > point.x)) {
                points.push({ x: endPoint.x, y: point.y });
                //twosegments
            } else {
                x = direction === 'Left' ? bounds.left - minSpace : bounds.right + minSpace;
                points.push({ x: x, y: point.y });
                points.push({ x: x, y: endPoint.y });
            }
        }
        if (isTarget) {
            points.push(seg.points[0]);
            points.reverse();
        }
        seg.points = points;
    }
}

/**
 * addLineSegment method \
 *
 * @returns { PointModel } addLineSegment method .\
 * @param {PointModel} point - provide the seg value.
 * @param {number} extra - provide the direction value.
 * @param {number} angle - provide the bounds value.
 * @private
 */
function addLineSegment(point: PointModel, extra: number, angle: number): PointModel {
    const segEnd: PointModel = Point.transform(point, angle, extra);
    return segEnd;
}

/**
 * getIntersection method \
 *
 * @returns { PointModel } getIntersection method .\
 * @param {PointModel} ele - provide the ele value.
 * @param {number} bounds - provide the bounds value.
 * @param {number} sPt - provide the sPt value.
 * @param {number} tPt - provide the tPt value.
 * @param {number} isTar - provide the isTar value.
 * @private
 */
export function getIntersection(ele: Connector, bounds: DiagramElement, sPt: PointModel, tPt: PointModel, isTar: boolean): PointModel {
    sPt = { x: sPt.x, y: sPt.y };
    tPt = { x: tPt.x, y: tPt.y };
    //const angle: number = Point.findAngle(tPt, sPt); ///let child: PathElement;// let intersection: PointModel;
    const wrapper: DiagramElement = isTar ? ele.targetWrapper : ele.sourceWrapper;
    const padding: number = (isTar ? ele.targetPadding : ele.sourcePadding);
    let rect: Rect;
    let segmentPoints: PointModel[];
    const point: PointModel = isTar || (ele.type === 'Orthogonal' || ele.type === 'Bezier') ? sPt : tPt;
    //const sourcePoint: PointModel = Point.transform(sPt, angle, Math.max(wrapper.actualSize.height / 2, wrapper.actualSize.width / 2));
    const child: PathElement = wrapper as PathElement;
    const sPt1: PointModel = rotatePoint(-wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY, sPt);
    const tPt1: PointModel = rotatePoint(-wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY, tPt);
    if (ele.type === 'Orthogonal' || ele.type === 'Bezier') {
        const constValue: number = 5;
        if (sPt1.x === tPt1.x) {
            if (sPt1.y < tPt1.y) {
                sPt1.y -= constValue;
            } else {
                sPt1.y += constValue;
            }
        }
        if (sPt1.y === tPt1.y) {
            if (sPt1.x < tPt1.x) {
                sPt1.x -= constValue;
            } else {
                sPt1.x += constValue;
            }
        }
        sPt = rotatePoint(wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY, sPt1);
    } else {
        //const angle: number = isTar ? Point.findAngle(sPt, tPt) : Point.findAngle(tPt, sPt);
        if (isTar) {
            const angle: number = Point.findAngle(sPt, tPt);
            tPt = Point.transform({ x: tPt.x, y: tPt.y }, angle, Math.max(wrapper.actualSize.width, wrapper.actualSize.height));
        } else {
            const angle: number = Point.findAngle(tPt, sPt);
            sPt = Point.transform({ x: sPt.x, y: sPt.y }, angle, Math.max(wrapper.actualSize.width, wrapper.actualSize.height));
        }
    }
    if ((ele.sourcePadding || ele.targetPadding)) {
        rect = new Rect(
            wrapper.bounds.x - padding, wrapper.bounds.y - padding, wrapper.actualSize.width + 2 * padding,
            wrapper.actualSize.height + 2 * padding);
    }
    if (wrapper instanceof PathElement && (wrapper as PathElement).data) {
        segmentPoints = rect ? [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft] : child.getPoints();
        if (((child.data.split('m').length - 1) + (child.data.split('M').length - 1)) === 1) {
            segmentPoints[segmentPoints.length] = segmentPoints[0];
        }
    } else {
        segmentPoints = rect ? [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft] : getPoints(wrapper, wrapper.corners);
        segmentPoints[segmentPoints.length] = segmentPoints[0];
    }
    //const length: number = segmentPoints.length;
    const thisSegment: Segment = { x1: sPt.x, y1: sPt.y, x2: tPt.x, y2: tPt.y };
    return getIntersectionPoints(thisSegment, segmentPoints, true, point) || sPt;
}

/**
 * setLineEndPoint method \
 *
 * @returns { PointModel } setLineEndPoint method .\
 * @param {PointModel} element - provide the ele value.
 * @param {number} point - provide the bounds value.
 * @param {number} isTarget - provide the sPt value.
 * @private
 */
function setLineEndPoint(element: Connector, point: PointModel, isTarget: boolean): PointModel {
    point.x = Math.round(point.x * 100) / 100;
    point.y = Math.round(point.y * 100) / 100;
    if (isTarget) {
        element.targetPoint = point;
    } else {
        element.sourcePoint = point;
    }
    return point;
}

/**
 * getIntersectionPoints method \
 *
 * @returns { PointModel } getIntersectionPoints method .\
 * @param {Segment} thisSegment - provide the ele value.
 * @param {Object[]} pts - provide the bounds value.
 * @param {boolean} minimal - provide the sPt value.
 * @param {PointModel} point - provide the sPt value.
 * @private
 */
export function getIntersectionPoints(thisSegment: Segment, pts: Object[], minimal: boolean, point: PointModel): PointModel {
    const length: number = pts.length; let min: number;
    let segment: Segment = {
        x1: (pts[0] as PointModel).x, y1: (pts[0] as PointModel).y, x2: (pts[1] as PointModel).x,
        y2: (pts[1] as PointModel).y
    };
    let intersection: PointModel = intersectSegment(thisSegment, segment);
    if (intersection) {
        // if (!minimal) { return intersection; } //commented because minimal is always true
        min = Point.distancePoints(intersection, point);
    }
    if (isNaN(min) || min > 0) {
        for (let i: number = 1; i < length - 1; i++) {
            segment = {
                x1: (pts[i] as PointModel).x, y1: (pts[i] as PointModel).y,
                x2: (pts[i + 1] as PointModel).x, y2: (pts[i + 1] as PointModel).y
            };
            const intersect: PointModel = intersectSegment(thisSegment, segment);
            if (intersect) {
                // if (!minimal) { return intersect; }//commented because minimal is always true
                const dist: number = Point.distancePoints(intersect, point);
                if (isNaN(min) || min > dist) { min = dist; intersection = intersect; }
                if (min >= 0 && min <= 1) {
                    break;
                }
            }
        }
    }
    return intersection;
}

/**
 * intersectSegment method \
 *
 * @returns { PointModel } intersectSegment method .\
 * @param {Segment} segment1 - provide the ele value.
 * @param {Segment} segment2 - provide the bounds value.
 * @private
 */
function intersectSegment(segment1: Segment, segment2: Segment): PointModel {
    const x1: number = segment1.x1; const y1: number = segment1.y1;
    const x2: number = segment1.x2; const y2: number = segment1.y2;
    const x3: number = segment2.x1; const y3: number = segment2.y1;
    const x4: number = segment2.x2; const y4: number = segment2.y2;
    let a1: number; let a2: number; let b1: number; let b2: number; let c1: number;
    let c2: number; let x: number; let y: number; let r1: number; let r2: number; let r3: number;
    let r4: number; let offset: number; let num: number;
    // eslint-disable-next-line
    a1 = y2 - y1; b1 = x1 - x2; c1 = (x2 * y1) - (x1 * y2);
    // eslint-disable-next-line
    r3 = ((a1 * x3) + (b1 * y3) + c1); r4 = ((a1 * x4) + (b1 * y4) + c1);
    if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)) {
        return null;
    }
    // eslint-disable-next-line
    a2 = y4 - y3; b2 = x3 - x4; c2 = (x4 * y3) - (x3 * y4);
    // eslint-disable-next-line
    r1 = (a2 * x1) + (b2 * y1) + c2; r2 = (a2 * x2) + (b2 * y2) + c2;
    if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))) {
        return null;
    }
    const denom: number = (a1 * b2) - (a2 * b1);

    if (denom === 0) {
        return null;
    }
    if (denom < 0) {
        offset = -denom / 2;
    } else {
        offset = denom / 2;
    }
    offset = 0;
    num = (b1 * c2) - (b2 * c1);
    if (num < 0) {
        x = (num - offset) / denom;
    } else {
        x = (num + offset) / denom;
    }
    num = (a2 * c1) - (a1 * c2);
    if (num < 0) {
        y = (num - offset) / denom;
    } else {
        y = (num + offset) / denom;
    }
    return { x: x, y: y };
}

/**
 * sameSign method \
 *
 * @returns { boolean } sameSign method .\
 * @param {Connector} a - provide the Connector value.
 * @param {End} b - provide the source End value.
 * @private
 */
function sameSign(a: number, b: number): boolean {
    return ((a * b) >= 0);
}

/**
 * getRightToLeftSegmentCount method \
 *
 * @returns { NoOfSegments } getRightToLeftSegmentCount method .\
 * @param {Connector} element - provide the Connector value.
 * @param {End} source - provide the source End value.
 * @param {End} target - provide the target  End value.
 * @param {boolean} swap - provide the swap value.
 * @private
 */
function getRightToLeftSegmentCount(element: Connector, source: End, target: End, swap: boolean): NoOfSegments {
    const srcPort: DiagramElement = element.sourcePortWrapper;
    //let targetPort: DiagramElement = element.targetPortWrapper;
    let pts: NoOfSegments;
    const diffY: number = Math.round(Math.abs(source.point.y - target.point.y));
    //let diffX: number = Math.round(Math.abs(source.point.x - target.point.x));
    let right: PointModel = { x: Math.max(source.point.x, source.corners.right), y: source.point.y };
    let left: PointModel = { x: Math.min(target.point.x, target.corners.left), y: target.point.y };
    let margin: number = findMargin(element);
    if (swap) {
        //let point: PointModel;
        const point: PointModel = left; left = right; right = point;
    }

    if (!(source.corners.bottom + margin < target.corners.top - margin ||
        source.corners.top - margin > target.corners.bottom + margin)) {
        if (element.type !== 'Bezier') {
            margin = 0;
        } else if (target.corners.left - source.corners.right <= margin * 2 && target.corners.left - source.corners.right >= 5) {
            margin = 0;
        }
    }

    source.margin = { left: margin, right: margin, top: margin, bottom: margin };
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    if (diffY === 0 && (source.corners.right < target.corners.left
        || (swap && source.corners.right < target.corners.left))) {
        pts = NoOfSegments.One;
    } else if (source.point.x + source.margin.right < target.point.x - target.margin.left) {
        pts = NoOfSegments.Three;
    } else if (element.sourceWrapper !== element.targetWrapper &&
        (cornersPointsBeforeRotation(element.sourceWrapper).containsPoint(left) ||
            cornersPointsBeforeRotation(element.targetWrapper).containsPoint(right))) {
        pts = NoOfSegments.Three;
    } else if (source.corners.bottom <= target.corners.top) {
        pts = NoOfSegments.Five;
    } else if (source.corners.top >= target.corners.top) {
        pts = NoOfSegments.Five;
    } else if ((srcPort !== undefined && srcPort.offsetY <= target.corners.top) ||
        (srcPort === undefined && source.corners.right <= target.corners.top)) {
        pts = NoOfSegments.Five;
    } else if ((srcPort !== undefined && srcPort.offsetY >= target.corners.bottom) ||
        (srcPort === undefined && source.corners.right >= target.corners.bottom)) {
        pts = NoOfSegments.Five;
    } else {
        pts = NoOfSegments.Five;
    }
    return pts;
}

/**
 * getRightToRightSegmentCount method \
 *
 * @returns { NoOfSegments } getRightToRightSegmentCount method .\
 * @param {Connector} element - provide the Connector value.
 * @param {End} sourceObj - provide the source End value.
 * @param {End} targetObj - provide the target  End value.
 * @private
 */
function getRightToRightSegmentCount(element: Connector, sourceObj: End, targetObj: End): NoOfSegments {
    const sourcePort: DiagramElement = element.sourcePortWrapper;
    const tarPort: DiagramElement = element.targetPortWrapper;
    let pts: NoOfSegments;
    const diffX: number = sourceObj.point.x - targetObj.point.x;
    const diffY: number = sourceObj.point.y - targetObj.point.y;
    let margin: number = findMargin(element);
    targetObj.margin = { left: margin, right: margin, top: margin, bottom: margin };
    sourceObj.margin = { left: margin, right: margin, top: margin, bottom: margin };
    if (sourceObj.corners.right >= targetObj.corners.right) {
        if ((sourcePort !== undefined && (sourcePort.offsetY < targetObj.corners.top - targetObj.margin.top ||
            sourcePort.offsetY > targetObj.corners.bottom + targetObj.margin.bottom)) ||
            (sourcePort === undefined && sourceObj.corners.middleRight.y < targetObj.corners.top)) {
            pts = NoOfSegments.Three;
        } else if ((sourcePort !== undefined && sourcePort.offsetY > targetObj.corners.bottom + targetObj.margin.bottom
            && sourceObj.corners.top > targetObj.corners.bottom) ||
            (sourcePort === undefined && sourceObj.corners.middleRight.y > targetObj.corners.bottom)) {
            pts = NoOfSegments.Three;
        } else if ((sourcePort !== undefined && sourcePort.offsetY < targetObj.corners.top - targetObj.margin.top
            && sourceObj.corners.bottom > targetObj.corners.top) ||
            (sourcePort === undefined && sourceObj.corners.middleRight.y > targetObj.corners.bottom)) {
            pts = NoOfSegments.Three;
        } else if (sourceObj.corners.right < targetObj.corners.left ||
            targetObj.corners.right < sourceObj.corners.left) {
            pts = NoOfSegments.Five;
        } else if (diffX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        } else {
            pts = NoOfSegments.Three;
        }
    } else if ((tarPort !== undefined && sourceObj.corners.bottom < tarPort.offsetY - targetObj.margin.top) ||
        (tarPort === undefined && sourceObj.corners.bottom < targetObj.corners.middleRight.y)) {
        pts = NoOfSegments.Three;
    } else if ((tarPort !== undefined && sourceObj.corners.top > tarPort.offsetY + targetObj.margin.right) ||
        (tarPort === undefined && sourceObj.corners.top > targetObj.corners.middleRight.y)) {
        pts = NoOfSegments.Three;
    } else if ((tarPort !== undefined && ((sourcePort !== undefined && sourcePort.offsetX < targetObj.corners.left &&
        sourcePort.offsetX !== tarPort.offsetX && (Math.abs(sourceObj.corners.right - targetObj.corners.left) <= 20)) ||
        (sourcePort === undefined && sourceObj.corners.right < targetObj.corners.left &&
            sourceObj.corners.center.x !== targetObj.corners.center.x && sourceObj.corners.center.y !== targetObj.corners.center.y)))) {
        pts = NoOfSegments.Three;
    } else if (sourceObj.corners.right < targetObj.corners.left) {
        pts = NoOfSegments.Five;
    } else if (diffX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    } else {
        pts = NoOfSegments.Three;
    }
    return pts;
}

/**
 * getRightToTopSegmentCount method \
 *
 * @returns { NoOfSegments } getRightToTopSegmentCount method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the target  value.
 * @param {End} target - provide the target  value.
 * @param {End} swap - provide the swap value.
 * @private
 */
function getRightToTopSegmentCount(element: Connector, source: End, target: End, swap?: boolean): NoOfSegments {
    let tarPort: DiagramElement = element.targetPortWrapper;
    let srcPort: DiagramElement = element.sourcePortWrapper;
    let right: PointModel = { x: Math.max(source.point.x, source.corners.right), y: source.point.y };
    let top: PointModel = { x: target.point.x, y: Math.min(target.point.y, target.corners.top) };
    let margin: number = findMargin(element);
    let pts: NoOfSegments;
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    source.margin = { top: margin, bottom: margin, left: margin, right: margin };
    if (swap) {
        //let port: DiagramElement;
        const port: DiagramElement = srcPort; srcPort = tarPort; tarPort = port;
        const point: PointModel = right; right = top; top = point;
    }
    if ((srcPort !== undefined && srcPort.offsetY < target.corners.top - target.margin.top) ||
        (srcPort === undefined && source.corners.bottom < target.corners.top - target.margin.top)) {
        if (source.corners.bottom < target.corners.top) {
            if ((tarPort !== undefined && source.corners.right + source.margin.right < tarPort.offsetX) ||
                (tarPort === undefined && source.corners.right + source.margin.right < target.corners.topCenter.x)) {
                pts = NoOfSegments.Two;
            } else {
                pts = NoOfSegments.Four;
            }
        } else if ((tarPort !== undefined && source.corners.left > tarPort.offsetX) ||
            (tarPort === undefined && source.corners.left > target.corners.topCenter.x)) {
            pts = NoOfSegments.Four;
        } else {
            pts = NoOfSegments.Two;
        }
    } else if (srcPort !== undefined && Math.abs(source.corners.right - target.corners.left) <= 5 &&
        Math.abs(srcPort.offsetY - target.corners.top) <= 5) {
        pts = NoOfSegments.Two;
    } else if (tarPort !== undefined && source.corners.right < target.corners.left && Math.abs(tarPort.offsetX - source.corners.topCenter.x) >= 25 &&
        source.corners.middleRight.y + source.margin.right < tarPort.offsetY) {
        pts = NoOfSegments.Two;
    } else if (source.corners.right < target.corners.left) {
        pts = NoOfSegments.Four;
    } else if (element.sourceWrapper !== element.targetWrapper &&
        (cornersPointsBeforeRotation(element.sourceWrapper).containsPoint(top) ||
            cornersPointsBeforeRotation(element.targetWrapper).containsPoint(right))) {
        pts = NoOfSegments.Two;
    } else {
        pts = NoOfSegments.Four;
    }
    return pts;
}

/**
 * getRightToTopSegmentCount method \
 *
 * @returns { NoOfSegments } getRightToTopSegmentCount method .\
 * @param {Connector} element - provide the element value.
 * @param {End} source - provide the target  value.
 * @param {End} target - provide the target  value.
 * @param {End} swap - provide the swap value.
 * @private
 */
function getRightToBottomSegmentCount(element: Connector, source: End, target: End, swap?: boolean): NoOfSegments {
    let margin: number = findMargin(element);
    source.margin = { left: margin, right: margin, top: margin, bottom: margin };
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    let pts: NoOfSegments;
    let srcPort: DiagramElement = element.sourcePortWrapper;
    let tarPort: DiagramElement = element.targetPortWrapper;
    //let right: PointModel = { x: Math.max(source.point.x, source.corners.right), y: source.point.y };
    //let bottom: PointModel = { x: target.point.x, y: Math.max(target.point.y, target.corners.bottom) };
    if (swap) {
        //let port: DiagramElement;
        const port: DiagramElement = srcPort; srcPort = tarPort; tarPort = port;
    }
    if ((srcPort !== undefined && srcPort.offsetY > target.corners.bottom + target.margin.bottom) ||
        (srcPort === undefined && source.corners.middleRight.y > target.corners.bottom + target.margin.bottom)) {
        if (source.corners.top > target.corners.bottom) {
            if ((tarPort !== undefined && source.corners.right + source.margin.right < tarPort.offsetX) ||
                (tarPort === undefined && source.corners.right + source.margin.right < target.corners.bottomCenter.x)) {
                pts = NoOfSegments.Two;
            } else {
                pts = NoOfSegments.Four;
            }
        } else if ((tarPort !== undefined && source.corners.left > tarPort.offsetX) ||
            (tarPort === undefined && source.corners.left > target.corners.bottomCenter.x)) {
            pts = NoOfSegments.Four;
        } else {
            pts = NoOfSegments.Two;
        }
    } else if (srcPort !== undefined &&
        Math.abs(source.corners.right - target.corners.left) <= 25 &&
        Math.abs(srcPort.offsetY - target.corners.bottom) <= 25) {
        pts = NoOfSegments.Two;
    } else if (source.corners.right < target.corners.left) {
        pts = NoOfSegments.Four;
    } else {
        pts = NoOfSegments.Four;
    }
    return pts;
}

/**
 * getBottomToTopSegmentCount method \
 *
 * @returns { NoOfSegments } getBottomToTopSegmentCount method .\
 * @param {End} source - provide the source value.
 * @param {End} target - provide the target  value.
 * @private
 */
function getBottomToTopSegmentCount(element: Connector, source: End, target: End): NoOfSegments {
    let pts: NoOfSegments;
    const diffX: number = source.point.x - target.point.x;
    //const diffY: number = source.point.y - target.point.y;
    //let bottom: PointModel = { x: source.point.x, y: Math.max(source.point.y, source.corners.bottom) };
    //let top: PointModel = { x: target.point.x, y: Math.min(target.point.y, target.corners.top) };
    let margin:number = findMargin(element);
    if (!(source.corners.right + margin < target.corners.left - margin ||
        source.corners.left - margin > target.corners.right + margin)) {
        if (element.type !== 'Bezier') {
            margin = 0;
        } else if (target.corners.top - source.corners.bottom <= margin * 2 && target.corners.top - source.corners.bottom >= 5) {
            margin = 0
        }
    }

    source.margin = { left: margin, right: margin, top: margin, bottom: margin };
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    if (diffX === 0 && source.corners.bottom < target.corners.top) {
        pts = NoOfSegments.One;
    } else if (source.corners.bottom + source.margin.bottom < target.corners.top - target.margin.top) {
        pts = NoOfSegments.Three;
    } else if (source.corners.right + source.margin.right < target.corners.left - target.margin.left) {
        pts = NoOfSegments.Five;
    } else if (source.corners.left - source.margin.left > target.corners.right + target.margin.right) {
        pts = NoOfSegments.Five;
    } else {
        pts = NoOfSegments.Five;
    }
    return pts;
}

/**
 * getBottomToLeftSegmentCount method \
 *
 * @returns { NoOfSegments } getBottomToLeftSegmentCount method .\
 * @param {End} element - provide the element value.
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @param {End} swap - provide the swap  value.
 * @private
 */
function getBottomToLeftSegmentCount(element: Connector, source: End, target: End, swap?: boolean): NoOfSegments {
    let srcPort: DiagramElement = element.sourcePortWrapper;
    let tarPort: DiagramElement = element.targetPortWrapper;
    //let bottom: PointModel = { x: source.point.x, y: Math.max(source.point.y, source.corners.bottom) };
    //let left: PointModel = { x: Math.min(target.point.x, target.corners.left), y: target.point.y };
    let margin : number = findMargin(element);
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    source.margin = { top: margin, bottom: margin, left: margin, right: margin };
    let pts: NoOfSegments;
    if (swap) {
        //let port: DiagramElement;
        const port: DiagramElement = srcPort; srcPort = tarPort; tarPort = port;
    }
    if ((srcPort !== undefined && srcPort.offsetX < target.corners.left - target.margin.left) ||
        (srcPort === undefined && source.corners.bottomCenter.x < target.corners.bottomLeft.x - target.margin.left)) {
        if (source.corners.right < target.corners.left) {
            if ((tarPort !== undefined && source.corners.bottom + source.margin.bottom < tarPort.offsetY) ||
                (tarPort === undefined && source.corners.bottom + source.margin.bottom < target.corners.middleLeft.y)) {
                pts = NoOfSegments.Two;
            } else {
                pts = NoOfSegments.Four;
            }
        } else if ((tarPort !== undefined && source.corners.top > tarPort.offsetY) ||
            (tarPort === undefined && source.corners.top > target.corners.middleLeft.y)) {
            pts = NoOfSegments.Four;
        } else {
            pts = NoOfSegments.Two;
        }
    } else if (tarPort !== undefined &&
        Math.abs(source.corners.right - target.corners.left) <= 25 &&
        Math.abs(tarPort.offsetY - source.corners.bottom) <= 25) {
        pts = NoOfSegments.Two;
    } else {
        pts = NoOfSegments.Four;
    }
    return pts;
}

/**
 * getBottomToBottomSegmentCount method \
 *
 * @returns { NoOfSegments } getBottomToBottomSegmentCount method .\
 * @param {End} element - provide the element value.
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @private
 */
function getBottomToBottomSegmentCount(element: Connector, source: End, target: End): NoOfSegments {
    const srcPort: DiagramElement = element.sourcePortWrapper;
    const tarPort: DiagramElement = element.targetPortWrapper;
    const difX: number = Math.round(Math.abs(source.point.x - target.point.x));
    const diffY: number = Math.round(Math.abs(target.point.y - target.point.y));
    let pts: NoOfSegments;
    if (source.corners.bottom < target.corners.bottom) {
        if ((srcPort !== undefined && srcPort.offsetX < target.corners.left - target.margin.left) ||
            (srcPort === undefined && source.corners.bottomCenter.x < target.corners.left - target.margin.left)) {
            pts = NoOfSegments.Three;
        } else if ((srcPort !== undefined && srcPort.offsetX > target.corners.right + target.margin.right) ||
            (srcPort === undefined && source.corners.bottomCenter.x > target.corners.right + target.margin.right)) {
            pts = NoOfSegments.Three;
        } else if (source.corners.bottom < target.corners.top) {
            pts = NoOfSegments.Five;
        } else if (difX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        } else {
            pts = NoOfSegments.Three;
        }
    } else if ((tarPort !== undefined && source.corners.left - source.margin.left > tarPort.offsetX) ||
        (tarPort === undefined && source.corners.left > target.corners.left)) {
        pts = NoOfSegments.Three;
    } else if ((tarPort !== undefined && source.corners.right + source.margin.right < tarPort.offsetX) ||
        (tarPort === undefined &&
            source.corners.right < target.corners.right)) {
        pts = NoOfSegments.Three;
    } else if (source.corners.top > target.corners.bottom) {
        pts = NoOfSegments.Five;
    } else if (difX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    } else {
        pts = NoOfSegments.Three;
    }
    return pts;
}

/**
 * getLeftToTopSegmentCount method \
 *
 * @returns { NoOfSegments } getLeftToTopSegmentCount method .\
 * @param {End} element - provide the element value.
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @param {End} swap - provide the swap  value.
 * @private
 */
function getLeftToTopSegmentCount(element: Connector, source: End, target: End, swap?: boolean): NoOfSegments {
    let pts: NoOfSegments;
    let sourcePort: DiagramElement = element.sourcePortWrapper;
    let margin: number = findMargin(element);
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    source.margin = { top: margin, bottom: margin, left: margin, right: margin };
    let tarPort: DiagramElement = element.targetPortWrapper;
    let left: PointModel = { x: Math.min(source.point.x, source.corners.left), y: source.point.y };
    let top: PointModel = { x: target.point.x, y: Math.min(target.point.y, target.corners.top) };
    if (swap) {
        //let port: DiagramElement;
        const port: DiagramElement = sourcePort; sourcePort = tarPort; tarPort = port;
        const point: PointModel = left; left = top; top = point;
    }
    if ((sourcePort !== undefined && sourcePort.offsetY < target.corners.top - target.margin.top) ||
        (sourcePort === undefined && (source.corners.bottom < target.corners.top - target.margin.top ||
            source.corners.middleLeft.y < target.corners.top - target.margin.top))) {
        if (source.corners.bottom < target.corners.top) {
            if ((tarPort !== undefined && source.corners.left - source.margin.left > tarPort.offsetX) ||
                (tarPort === undefined && source.corners.left - source.margin.left > target.corners.topCenter.x)) {
                pts = NoOfSegments.Two;
            } else {
                pts = NoOfSegments.Four;
            }
        } else if ((tarPort !== undefined && source.corners.right < tarPort.offsetX) ||
            (tarPort === undefined && source.corners.right < target.corners.topCenter.x)) {
            pts = NoOfSegments.Four;
        } else {
            pts = NoOfSegments.Two;
        }
    } else if (sourcePort !== undefined &&
        Math.abs(source.corners.left - target.corners.right) <= 25 &&
        Math.abs(sourcePort.offsetY - target.corners.top) <= 25) {
        pts = NoOfSegments.Two;
    } else if (element.sourceWrapper !== element.targetWrapper &&
        (cornersPointsBeforeRotation(element.sourceWrapper).containsPoint(top) ||
            cornersPointsBeforeRotation(element.targetWrapper).containsPoint(left))) {
        pts = NoOfSegments.Two;
    } else if (source.corners.left > target.corners.right) {
        pts = NoOfSegments.Four;
    } else {
        pts = NoOfSegments.Four;
    }
    return pts;
}

/**
 * getLeftToLeftSegmentCount method \
 *
 * @returns { NoOfSegments } getLeftToLeftSegmentCount method .\
 * @param {End} element - provide the element value.
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @private
 */
function getLeftToLeftSegmentCount(element: Connector, source: End, target: End): NoOfSegments {
    const srcPort: DiagramElement = element.sourcePortWrapper;
    const targetPort: DiagramElement = element.targetPortWrapper;
    let margin: number = findMargin(element);
    source.margin = { left: margin, right: margin, top: margin, bottom: margin };
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    const diffX: number = Math.round(Math.abs(source.point.x - target.point.x));
    const diffY: number = Math.round(Math.abs(source.point.y - target.point.y));
    let pts: NoOfSegments;
    if (source.corners.left < target.corners.left) {
        if ((targetPort !== undefined && source.corners.bottom + source.margin.bottom < targetPort.offsetY) ||
            (targetPort === undefined && source.corners.bottom + source.margin.bottom < target.corners.middleLeft.y)) {
            pts = NoOfSegments.Three;
        } else if ((targetPort !== undefined && source.corners.top - source.margin.top > targetPort.offsetY) ||
            (targetPort === undefined && source.corners.top - source.margin.top > target.corners.middleLeft.y)) {
            pts = NoOfSegments.Three;
        } else if (source.corners.right < target.corners.left ||
            target.corners.right < source.corners.left) {
            pts = NoOfSegments.Five;
        } else if (diffX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        } else {
            pts = NoOfSegments.Three;
        }
    } else if ((srcPort !== undefined && srcPort.offsetY < target.corners.top - target.margin.top) ||
        (srcPort === undefined && source.corners.middleLeft.y < target.corners.top)) {
        pts = NoOfSegments.Three;
    } else if ((srcPort !== undefined && srcPort.offsetY > target.corners.bottom + target.margin.bottom) ||
        (srcPort === undefined && source.corners.middleLeft.y > target.corners.bottom + target.margin.bottom)) {
        pts = NoOfSegments.Three;
    } else if (source.corners.left > target.corners.right) {
        pts = NoOfSegments.Five;
    } else if (diffX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    } else {
        pts = NoOfSegments.Three;
    }
    return pts;
}

/**
 * getTopToTopSegmentCount method \
 *
 * @returns { NoOfSegments } getTopToTopSegmentCount method .\
 * @param {End} element - provide the element value.
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @private
 */
function getTopToTopSegmentCount(element: Connector, source: End, target: End): NoOfSegments {
    const srcPort: DiagramElement = element.sourcePortWrapper;
    const targetPort: DiagramElement = element.targetPortWrapper;
    const diffX: number = Math.round(Math.abs(source.point.x - target.point.x));
    const diffY: number = Math.round(Math.abs(source.point.y - target.point.y));
    let margin: number = findMargin(element);
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    source.margin = { top: margin, bottom: margin, left: margin, right: margin };
    let pts: NoOfSegments;
    if (source.corners.top < target.corners.top) {
        if ((targetPort !== undefined && source.corners.left - source.margin.left > targetPort.offsetX) ||
            (targetPort === undefined && source.corners.left > target.corners.left)) {
            pts = NoOfSegments.Three;
        } else if ((targetPort !== undefined && source.corners.right + source.margin.right < targetPort.offsetX) ||
            (targetPort === undefined && source.corners.right < target.corners.right)) {
            pts = NoOfSegments.Three;
        } else if (source.corners.bottom < target.corners.top) {
            pts = NoOfSegments.Five;
        } else if (diffX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        } else {
            pts = NoOfSegments.Three;
        }
    } else if ((srcPort !== undefined && srcPort.offsetX > target.corners.right + target.margin.right) ||
        (srcPort === undefined && source.corners.left > target.corners.right)) {
        pts = NoOfSegments.Three;
    } else if ((srcPort !== undefined && srcPort.offsetX < target.corners.left - target.margin.left) ||
        (srcPort === undefined && source.corners.bottomRight.x < target.corners.left)) {
        pts = NoOfSegments.Three;
    } else if (source.corners.top > target.corners.bottom) {
        pts = NoOfSegments.Five;
    } else if (diffX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    } else {
        pts = NoOfSegments.Three;
    }
    return pts;
}

/**
 * addOrthoSegments method \
 *
 * @returns {  PointModel[] } addOrthoSegments method .\
 * @param {Connector} element - provide the element value.
 * @param {NoOfSegments} seg - provide the seg  value.
 * @param {End} sourceEnd - provide the source  value.
 * @param {End} targetEnd - provide the target  value.
 * @param {number} segLength - provide the segLength  value.
 * @param {boolean} lineDistribution - provide the lineDistribution  value.
 * @private
 */
function addOrthoSegments(
    element: Connector, seg: NoOfSegments, sourceEnd: End, targetEnd: End, segLength?: number,
    lineDistribution?: boolean): PointModel[] {
    const src: DiagramElement = element.sourceWrapper;
    const tar: DiagramElement = element.targetWrapper;
    //let tarPort: DiagramElement = element.targetPortWrapper;
    let intermeditatePoints: PointModel[];
    const srcCorner: Corners = src.corners;
    const tarCorner: Corners = tar.corners;
    let value: number;
    let extra: number = 20;
    let source: End = { corners: sourceEnd.corners, point: sourceEnd.point, direction: sourceEnd.direction, margin: sourceEnd.margin };
    let target: End = { corners: targetEnd.corners, point: targetEnd.point, direction: targetEnd.direction, margin: targetEnd.margin };
    if (source.direction !== target.direction || seg === NoOfSegments.Five) {
        if (source.direction === getOppositeDirection(target.direction) || seg === NoOfSegments.Three) {
            switch (source.direction) {
                case 'Left':
                    if (srcCorner.middleLeft.x > tarCorner.middleRight.x) {
                        value = (srcCorner.middleLeft.x - tarCorner.middleRight.x) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
                case 'Right':
                    if (srcCorner.middleRight.x < tarCorner.middleLeft.x) {
                        value = (tarCorner.middleLeft.x - srcCorner.middleRight.x) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
                case 'Top':
                    if (srcCorner.topCenter.y > tarCorner.bottomCenter.y) {
                        value = (srcCorner.topCenter.y - tarCorner.bottomCenter.y) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
                case 'Bottom':
                    if (srcCorner.bottomCenter.y < tarCorner.topCenter.y) {
                        value = (tarCorner.topCenter.y - srcCorner.bottomCenter.y) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
            }
        }
    }

    extra = adjustSegmentLength(srcCorner, source, extra);
    let isBezier: boolean = element.type === 'Bezier';
    if (segLength) {
        extra = Math.max(extra, segLength);
    }
    if (seg === NoOfSegments.One) {
        intermeditatePoints = [source.point, target.point];
    }
    if (seg === NoOfSegments.Two) {
        intermeditatePoints = orthoConnection2Segment(source, target);
    }
    if (seg === NoOfSegments.Three) {
        intermeditatePoints = orthoConnection3Segment(element, source, target, extra, undefined, isBezier);
    }
    if (seg === NoOfSegments.Four) {
        const prevDir: string = undefined;
        intermeditatePoints = orthoConnection4Segment(source, target, prevDir, intermeditatePoints, extra, isBezier);
    }
    if (seg === NoOfSegments.Five) {
        intermeditatePoints = orthoConnection5Segment(source, target, extra, isBezier);
    }
    return intermeditatePoints;
}

/**
 * adjustSegmentLength method \
 *
 * @returns {  PointModel[] } adjustSegmentLength method .\
 * @param {Rect | Corners} bounds - provide the element value.
 * @param {End} source - provide the seg  value.
 * @param {number} extra - provide the source  value.
 * @private
 */
function adjustSegmentLength(bounds: Rect | Corners, source: End, extra: number): number {
    switch (source.direction) {
        case 'Left':
            if (source.point.x > bounds.left) {
                extra = (source.point.x - bounds.left) > extra ? ((source.point.x - bounds.left) + extra) : extra;
            }
            break;
        case 'Right':
            if (source.point.x < bounds.right) {
                extra = (bounds.right - source.point.x) > extra ? ((bounds.right - source.point.x) + extra) : extra;
            }
            break;
        case 'Top':
            if (source.point.y > bounds.top) {
                extra = (source.point.y - bounds.top) > extra ? ((source.point.y - bounds.top) + extra) : extra;
            }
            break;
        case 'Bottom':
            if (source.point.y < bounds.bottom) {
                extra = (bounds.bottom - source.point.y) > extra ? ((bounds.bottom - source.point.y) + extra) : extra;
            }
            break;
    }
    return extra;
}

/**
 * orthoConnection2Segment method \
 *
 * @returns {  PointModel[] } orthoConnection2Segment method .\
 * @param {Rect | Corners} source - provide the source value.
 * @param {End} target - provide the target  value.
 * @private
 */
export function orthoConnection2Segment(source: End, target: End): PointModel[] {
    let intermeditatePoints: PointModel[];
    switch (source.direction) {
        case 'Left':
        case 'Right':
            // eslint-disable-next-line
            let point1: PointModel = { x: target.point.x, y: source.point.y };
            intermeditatePoints = (Point.equals(source.point, point1) || Point.equals(target.point, point1)) ?
                [source.point, target.point] : [source.point, point1, target.point];
            break;
        case 'Top':
        case 'Bottom':
            // eslint-disable-next-line no-case-declarations
            const point2: PointModel = { x: source.point.x, y: target.point.y };
            intermeditatePoints = (Point.equals(source.point, point2) || Point.equals(target.point, point2)) ?
                [source.point, target.point] : [source.point, point2, target.point];
            break;
    }
    return intermeditatePoints;
}

/**
 * orthoConnection3Segment method \
 *
 * @returns {  PointModel[] } orthoConnection2Segment method .\
 * @param {Connector} element - provide the source value.
 * @param {End} source - provide the target  value.
 * @param {End} target - provide the target  value.
 * @param {number} extra - provide the target  value.
 * @param {boolean} allow - provide the target  value.
 * @private
 */
function orthoConnection3Segment(element: Connector, source: End, target: End, extra?: number, allow?: boolean, isBezier: boolean = false): PointModel[] {
    if (!extra) {
        extra = 20;
    }

    if (isBezier) {
        if (source.direction !== target.direction) {
            if (source.direction === 'Left' || source.direction === 'Right') {
                extra = Math.floor(Math.abs(source.point.x - target.point.x) * 0.5);
            }
            else {
                extra = Math.floor(Math.abs(source.point.y - target.point.y) * 0.5);
            }
        }
    }

    const srcPort: DiagramElement = element.sourcePortWrapper;
    let intermeditatePoints: PointModel[];
    let segmentValue: PointModel;
    let next: PointModel;
    const diffx: number = target.point.x - source.point.x;
    const diffy: number = target.point.y - source.point.y;
    let temp: number;
    if (!allow && (Math.abs(diffx) < 0.001 || Math.abs(diffy) < 0.001)) {
        if (target.direction === undefined) {
            intermeditatePoints = [source.point, target.point];
            return intermeditatePoints;
        }
    }
    if (element.targetWrapper === undefined && Math.abs(diffx) <= 31 && Math.abs(diffy) <= 31) {
        if ((source.direction === 'Left' || source.direction === 'Right')) {
            if (Math.abs(diffy) < 12) {
                source.direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
            }
        } else {
            if (Math.abs(diffx) < 12) {
                source.direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
            }
        }
        if (Math.abs(diffx) > 12 || Math.abs(diffy) > 12) {
            return orthoConnection2Segment(source, target);
        } else {
            extra += 5;
        }
    }
    if (source.direction === 'Left' || source.direction === 'Right') {
        if (source.direction === 'Right') {
            if (target.direction !== undefined && target.direction === 'Right') {
                extra = Math.max(source.point.x, target.point.x) - source.point.x + extra;
            }
            if (source.point.x > target.point.x && srcPort === undefined) {
                extra = -extra;
            }
        } else {
            if (target.direction !== undefined && target.direction === 'Left') {
                extra = source.point.x - Math.min(source.point.x, target.point.x) + extra;
            }
            if (source.point.x > target.point.x || srcPort !== undefined || source.direction === 'Left') {
                extra = -extra;
            }
        }
        temp = target.point.y - source.point.y;
        segmentValue = addLineSegment(source.point, extra, 0);
        temp = target.point.y - segmentValue.y;
        if (temp !== 0) {
            next = addLineSegment(segmentValue, target.point.y - segmentValue.y, 90);
        }
    } else if (source.direction === 'Top' || source.direction === 'Bottom') {
        if (source.direction === 'Bottom') {
            if (target.direction !== undefined && target.direction === 'Bottom') {
                extra = Math.max(source.point.y, target.point.y) - source.point.y + extra;
            }
        } else {
            if (target.direction !== undefined && target.direction === 'Top') {
                extra = source.point.y - Math.min(source.point.y, target.point.y) + extra;
            }
            if (source.point.y > target.point.y || (srcPort !== undefined) || source.direction === 'Top') {
                extra = -extra;
            }
        }
        temp = target.point.x - source.point.x;
        if (source.direction === 'Top') {
            segmentValue = addLineSegment(source.point, extra, 90);
        } else {
            segmentValue = addLineSegment(source.point, extra, 90);
        }
        temp = target.point.x - segmentValue.x;
        if (temp !== 0) {
            next = addLineSegment(segmentValue, target.point.x - segmentValue.x, 0);
        }
    }
    if (temp === 0) {
        return intermeditatePoints = [
            source.point,
            target.point
        ];
    }
    intermeditatePoints = [
        source.point,
        segmentValue,
        next,
        target.point
    ];
    return intermeditatePoints;
}

/**
 * orthoConnection5Segment method \
 *
 * @returns {  PointModel[] } orthoConnection5Segment method .\
 * @param {Connector} source - provide the source value.
 * @param {End} target - provide the target  value.
 * @param {End} extra - provide the extra  value.
 * @private
 */
function orthoConnection5Segment(source: End, target: End, extra: number = 20, isBezier: boolean = false): PointModel[] {
    if (isBezier) {
        extra = 20;
    }

    let intermeditatePoints: PointModel[];
    let length: number = extra;
    const sLeft: number = source.corners.left - source.margin.left;
    const sRight: number = source.corners.right + source.margin.right;
    const sBottom: number = source.corners.bottom + source.margin.bottom;
    const sTop: number = source.corners.top - source.margin.top;
    const tLeft: number = target.corners.left - target.margin.left;
    const tRight: number = target.corners.right + target.margin.right;
    const tBottom: number = target.corners.bottom + target.margin.bottom;
    const tTop: number = target.corners.top - target.margin.top;
    let segmentValue: PointModel;
    switch (source.direction) {
        case 'Left':
            if ((sTop > tTop && sTop < tBottom || sBottom < tBottom && sBottom > tTop) &&
                sLeft > tLeft && sLeft <= tRight && extra >= 20) {
                length = source.point.x - target.corners.left + length;
            }
            if (isBezier && source.direction == target.direction) {
                if (source.corners.left > target.corners.left && source.corners.left - target.corners.right >= 20) {
                    length = (source.corners.left - target.corners.right) / 2;
                }
            }
            segmentValue = addLineSegment(source.point, length, 180);
            break;
        case 'Top':
            if ((sLeft > tLeft && sLeft < tRight || sRight < tRight && sRight > tLeft) &&
                sTop > tTop && sTop <= tBottom && extra >= 20) {
                length = source.point.y - target.corners.top + length;
            }
            if (isBezier && source.direction == target.direction) {
                if (source.corners.top > target.corners.top && source.corners.top - target.corners.bottom >= 20) {
                    length = (source.corners.top - target.corners.bottom) / 2;
                }
            }
            segmentValue = addLineSegment(source.point, length, 270);
            break;
        case 'Right':
            if ((sTop > tTop && sTop < tBottom || sBottom < tBottom && sBottom > tTop) &&
                sRight < tRight && sRight >= tLeft && extra >= 20) {
                length = target.corners.right - source.point.x + length;
            }
            if (isBezier && source.direction == target.direction) {
                if (source.corners.right < target.corners.right && target.corners.left - source.corners.right >= 20) {
                    length = (target.corners.left - source.corners.right) / 2;
                }
            }
            segmentValue = addLineSegment(source.point, length, 0);
            break;
        case 'Bottom':
            if ((sLeft > tLeft && sLeft < tRight || sRight < tRight && sRight > tLeft) &&
                sBottom < tBottom && sBottom >= tTop && extra >= 20) {
                length = target.corners.bottom - source.point.y + length;
            }
            if (isBezier && source.direction == target.direction) {
                if (source.corners.bottom < target.corners.bottom && target.corners.top - source.corners.bottom >= 20) {
                    length = (target.corners.top - source.corners.bottom) / 2;
                }
            }
            segmentValue = addLineSegment(source.point, length, 90);
            break;
    }
    intermeditatePoints = [
        source.point,
        segmentValue
    ];

    let newExtra: number = undefined;
    if (source.direction === 'Top' || source.direction === 'Bottom') {
        const prevDir: string = source.direction;
        source.direction = segmentValue.x > target.point.x ? 'Left' : 'Right';
        source.point = segmentValue;
        newExtra = isBezier ? Math.abs(segmentValue.x - target.point.x) * 0.5 : newExtra;
        intermeditatePoints = orthoConnection4Segment(source, target, prevDir, intermeditatePoints, newExtra, isBezier);
    } else {
        const prevDir: string = source.direction;
        source.direction = segmentValue.y > target.point.y ? 'Top' : 'Bottom';
        source.point = segmentValue;
        newExtra = isBezier ? Math.abs(segmentValue.y - target.point.y) * 0.5 : newExtra;
        intermeditatePoints = orthoConnection4Segment(source, target, prevDir, intermeditatePoints, newExtra, isBezier);
    }
    return intermeditatePoints;
}

/**
 * orthoConnection4Segment method \
 *
 * @returns {  PointModel[] } orthoConnection4Segment method .\
 * @param {End} source - provide the target  value.
 * @param {End} target - provide the target  value.
 * @param {string} prevDir - provide the target  value.
 * @param {PointModel[]} interPt - provide the target  value.
 * @param {number} e - provide the target  value.
 * @private
 */
function orthoConnection4Segment(source: End, target: End, prevDir: string, interPt: PointModel[], e: number = 20, isBezier: boolean = false): PointModel[] {
    let segmentValue: PointModel;
    if (prevDir === undefined) {
        source.margin = { left: 2, right: 2, top: 2, bottom: 2 };
        target.margin = { left: 0, right: 5, top: 0, bottom: 5 };
        if (isBezier) {
            source.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            target.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            if (source.direction === 'Left') {
                e = getLeftLength(source, target, prevDir, e);
                if (source.corners.left - target.corners.right >= 5) {
                    e = Math.abs(source.point.x - source.corners.left) + Math.floor(source.corners.left - target.corners.right) * 0.5;
                }
            }
            else if (source.direction === 'Right') {
                e = getRightLength(source, target, e, prevDir);
                if (target.corners.left - source.corners.right >= 5) {
                    e = Math.abs(source.point.x - source.corners.right) + Math.floor(target.corners.left - source.corners.right) * 0.5;
                }
            }
            else if (source.direction === 'Top') {
                e = getTopLength(source, target, prevDir, e);
                if (source.corners.top - target.corners.bottom >= 5) {
                    e = Math.abs(source.point.y - source.corners.top) + Math.floor(source.corners.top - target.corners.bottom) * 0.5;
                }
            }
            else if (source.direction === 'Bottom') {
                e = getBottomLength(source, target, e, prevDir);
                if (target.corners.top - source.corners.bottom >= 5) {
                    e = Math.abs(source.point.y - source.corners.bottom) + Math.floor(target.corners.top - source.corners.bottom) * 0.5;
                }
            }
        }
    } else {
        if (source.direction === 'Bottom') {
            if (isBezier) {
                if (target.corners.top - source.corners.bottom < 20)
                    e = (target.corners.bottom - source.point.y) + 25;
            }
            else {
                if (target.corners.top > source.corners.bottom && target.corners.top - source.corners.bottom < 20)
                    e = (target.corners.top - source.corners.bottom) / 2;
            }
        } else if (source.direction === 'Top') {
            if (isBezier) {
                if (source.corners.top - target.corners.bottom < 20)
                    e = (source.point.y - target.corners.top) + 25;
            }
            else {
                if (target.corners.bottom < source.corners.top && source.corners.top - target.corners.bottom < 20)
                    e = (source.corners.top - target.corners.bottom) / 2;
            }
        } else if (source.direction === 'Right') {
            if (isBezier) {
                if (target.corners.left - source.corners.right < 20)
                    e = (target.corners.right - source.point.x) + 25;
            }
            else {
                if (target.corners.left > source.corners.right && target.corners.left - source.corners.right < 20)
                    e = (target.corners.left - source.corners.right) / 2;
            }
        } else if (source.direction === 'Left') {
            if (isBezier) {
                if (source.corners.left - target.corners.right < 20)
                    e = (source.point.x - target.corners.left) + 25;
            }
            else {
                if (target.corners.right < source.corners.left && source.corners.left - target.corners.right < 20)
                    e = (source.corners.left - target.corners.right) / 2;
            }
        }

        if (prevDir == target.direction && isBezier) {
            if ((target.direction == 'Bottom' && source.point.y > target.point.y) ||
                (target.direction == 'Top' && source.point.y < target.point.y)) {
                if (source.direction == 'Left') {
                    e = getLeftLength(source, target, prevDir, 20);
                }
                else if (source.direction == 'Right') {
                    e = getRightLength(source, target, 20, prevDir);
                }
            }
            else if ((target.direction == 'Right' && source.point.x > target.point.x) ||
                (target.direction == 'Left' && source.point.x < target.point.x)) {
                if (source.direction == 'Top') {
                    e = getTopLength(source, target, prevDir, 20);
                }
                else if (source.direction == 'Bottom') {
                    e = getBottomLength(source, target, 20, prevDir);
                }
            }
        }
    }
    switch (source.direction) {
        case 'Left':
            e = isBezier ? e : getLeftLength(source, target, prevDir, e);
            segmentValue = addLineSegment(source.point, e, 180);
            break;
        case 'Right':
            e = isBezier ? e : getRightLength(source, target, e, prevDir);
            segmentValue = addLineSegment(source.point, e, 0);
            break;
        case 'Top':
            e = isBezier ? e : getTopLength(source, target, prevDir, e);
            segmentValue = addLineSegment(source.point, e, 270);
            break;
        case 'Bottom':
            e = isBezier ? e : getBottomLength(source, target, e, prevDir);
            segmentValue = addLineSegment(source.point, e, 90);
    }
    if (interPt !== undefined) {
        interPt.push(segmentValue);
    } else {
        interPt = [
            source.point,
            segmentValue
        ];
    }
    if (source.direction === 'Top' || source.direction === 'Bottom') {
        getOrtho3Seg(segmentValue, 'horizontal', source, target, interPt, isBezier);
    } else if (source.direction === 'Right' || source.direction === 'Left') {
        getOrtho3Seg(segmentValue, 'vertical', source, target, interPt, isBezier);
    }
    return interPt;
}

/**
 * getOrtho3Seg method \
 *
 * @returns {  void } getOrtho3Seg method .\
 * @param {PointModel} sPt - provide the sPt  value.
 * @param {string} orientation - provide the orientation  value.
 * @param {End} src - provide the src  value.
 * @param {End} tar - provide the tar  value.
 * @param {PointModel[]} points - provide the points  value.
 * @private
 */
function getOrtho3Seg(sPt: PointModel, orientation: string, src: End, tar: End, points: PointModel[], isBezier: boolean): void {
    let point1: PointModel;
    let point2: PointModel;
    let point3: PointModel;
    if (orientation === 'horizontal') {
        src.margin = { left: 0, right: 10, top: 0, bottom: 10 };
        tar.margin = { left: 0, right: 10, top: 0, bottom: 10 };
    } else if (orientation === 'vertical') {
        src.margin = { left: 10, right: 0, top: 10, bottom: 0 };
        tar.margin = { left: 10, right: 0, top: 10, bottom: 0 };
    }
    let extra: number = 20;
    if (orientation === 'horizontal') {
        switch (tar.direction) {
            case 'Left':
                if (src.corners.right + src.margin.right < tar.corners.left - tar.margin.left &&
                    (tar.corners.left - src.margin.right - src.corners.right > extra || (src.corners.top - src.margin.top <= tar.point.y &&
                        src.corners.bottom + src.margin.bottom >= tar.point.y))) {
                    if (isBezier && (src.direction === 'Top' || src.direction === 'Bottom')) {
                        const gap: number = Math.abs(tar.corners.left - src.corners.right) / 2;
                        extra = src.corners.right - sPt.x + gap;
                    } else {
                        const gap: number = Math.min(Math.abs(tar.corners.left - src.corners.right) / 2, 20);
                        extra = src.corners.right - sPt.x + gap;
                    }
                } else {
                    if ((src.direction === 'Top' && sPt.y > tar.point.y) || (src.direction === 'Bottom' && sPt.y < tar.point.y)) {
                        extra = Math.min(tar.corners.left, sPt.x) - sPt.x - 20;
                    } else if (sPt.x >= src.corners.left - src.margin.left && sPt.x <= src.corners.right + src.margin.right) {
                        extra = Math.min(tar.corners.left, src.corners.left) - sPt.x - 20;
                    } else {
                        extra = tar.corners.left - sPt.x - 20;
                    }
                }
                break;
            case 'Right':
                if (src.corners.left - src.margin.left > tar.corners.right + tar.margin.right &&
                    (src.corners.left - src.margin.right - tar.corners.right > extra || (src.corners.top - src.margin.top <= tar.point.y &&
                        src.corners.bottom + src.margin.bottom >= tar.point.y))) {
                    if (isBezier && (src.direction === 'Top' || src.direction === 'Bottom')) {
                        const gap: number = Math.abs(src.corners.left - tar.corners.right) / 2;
                        extra = src.corners.left - sPt.x - gap;
                    } else {
                        const gap: number = Math.min(Math.abs(src.corners.left - tar.corners.right) / 2, 20);
                        extra = src.corners.left - sPt.x - gap;
                    }
                } else {
                    if ((src.direction === 'Top' && sPt.y > tar.point.y) || (src.direction === 'Bottom' && sPt.y < tar.point.y)) {
                        extra = Math.max(tar.corners.right, sPt.x) - sPt.x + 20;
                    } else if (sPt.x >= src.corners.left - src.margin.left && sPt.x <= src.corners.right + src.margin.right) {
                        extra = Math.max(tar.corners.right, src.corners.right) - sPt.x + 20;
                    } else {
                        extra = tar.corners.right - sPt.x + 20;
                    }
                }
                break;
        }
        point1 = addLineSegment(sPt, extra, 0);
        point2 = addLineSegment(point1, tar.point.y - sPt.y, 90);
        point3 = tar.point;
    } else if (orientation === 'vertical') {
        switch (tar.direction) {
            case 'Top':
                if (src.corners.bottom + src.margin.bottom < tar.corners.top - tar.margin.top &&
                    (tar.corners.top - src.margin.top - src.corners.bottom > extra || (src.corners.left - src.margin.left <= tar.point.x &&
                        src.corners.right + src.margin.right >= tar.point.x))) {
                    if (isBezier && (src.direction === 'Right' || src.direction === 'Left')) {
                        const gap: number = Math.abs(tar.corners.top - src.corners.bottom) / 2;
                        extra = src.corners.bottom - sPt.y + gap;
                    } else {
                        const gap: number = Math.min(Math.abs(tar.corners.top - src.corners.bottom) / 2, 20);
                        extra = src.corners.bottom - sPt.y + gap;
                    }
                } else {
                    if ((src.direction === 'Left' && sPt.x > tar.point.x) || (src.direction === 'Right' && sPt.x < tar.point.x)) {
                        extra = Math.min(tar.corners.top, sPt.y) - sPt.y - 20;
                    } else if (sPt.y >= src.corners.top - src.margin.top && sPt.y <= src.corners.bottom + src.margin.bottom) {
                        extra = Math.min(tar.corners.top, src.corners.top) - sPt.y - 20;
                    } else {
                        extra = tar.corners.top - sPt.y - 20;
                    }
                }
                break;
            case 'Bottom':
                if (src.corners.top - src.margin.top > tar.corners.bottom + tar.margin.bottom &&
                    (src.corners.top - src.margin.top - tar.corners.bottom > extra || (src.corners.left - src.margin.left <= tar.point.x &&
                        src.corners.right + src.margin.right >= tar.point.x))) {
                    if (isBezier && (src.direction === 'Right' || src.direction === 'Left')) {
                        const gap: number = Math.abs(src.corners.top - tar.corners.bottom) / 2;
                        extra = src.corners.top - sPt.y - gap;
                    } else {
                        const gap: number = Math.min(Math.abs(src.corners.top - tar.corners.bottom) / 2, 20);
                        extra = src.corners.top - sPt.y - gap;
                    }
                } else {
                    if ((src.direction === 'Left' && sPt.x > tar.point.x) || (src.direction === 'Right' && sPt.x < tar.point.x)) {
                        extra = Math.max(tar.corners.bottom, sPt.y) - sPt.y + 20;
                    } else if (sPt.y >= src.corners.top - src.margin.top && sPt.y <= src.corners.bottom + src.margin.bottom) {
                        extra = Math.max(tar.corners.bottom, src.corners.bottom) - sPt.y + 20;
                    } else {
                        extra = tar.corners.bottom - sPt.y + 20;
                    }
                }
                break;
        }
        point1 = addLineSegment(sPt, extra, 90);
        point2 = addLineSegment(point1, tar.point.x - sPt.x, 0);
        point3 = tar.point;
    }
    points.push(point1);
    points.push(point2);
    points.push(point3);
}

/**
 * getTopLength method \
 *
 * @returns {  number } getTopLength method .\
 * @param {End} source - provide the sPt  value.
 * @param {End} target - provide the sPt  value.
 * @param {string} preDir - provide the orientation  value.
 * @param {number} length - provide the src  value.
 * @private
 */
function getTopLength(source: End, target: End, preDir: string, length: number): number {
    if (source.corners.top - source.margin.top > target.corners.top + target.margin.top &&
        source.corners.top - source.margin.top <= target.corners.bottom + target.margin.bottom) {
        if (target.direction === 'Right' && source.point.x < target.point.x) {
            length += source.corners.top - target.corners.top;
        } else if (target.direction === 'Left' && source.point.x > target.point.x) {
            length += source.corners.top - target.corners.top;
        }
        length += source.point.y - source.corners.top;
    } else {
        if ((preDir !== undefined && preDir !== 'Left') && target.direction === 'Right' && source.point.x < target.point.x) {
            length += Math.abs(source.point.y - target.corners.bottom);
        } else if ((preDir !== undefined && preDir !== 'Right') && target.direction === 'Left'
            && target.point.x < source.point.x) {
            length += Math.abs(source.point.y - target.corners.bottom);
        } else {
            length += source.point.y - source.corners.top;
        }
    }
    return length;
}

/**
 * getLeftLength method \
 *
 * @returns {  number } getLeftLength method .\
 * @param {End} source - provide the sPt  value.
 * @param {End} target - provide the sPt  value.
 * @param {string} prevDir - provide the orientation  value.
 * @param {number} segLength - provide the src  value.
 * @private
 */
function getLeftLength(source: End, target: End, prevDir: string, segLength: number): number {
    if (source.corners.left - source.margin.left > target.corners.left - target.margin.left &&
        source.corners.left - source.margin.left <= target.corners.right + target.margin.right) {
        if (target.direction === 'Bottom' && source.point.y < target.point.y) {
            segLength += source.corners.left - target.corners.left;
        } else if (target.direction === 'Top' && source.point.y > target.point.y) {
            segLength += source.corners.left - target.corners.left;
        }
        segLength += source.point.x - source.corners.left;
    } else {
        if ((prevDir !== undefined && prevDir !== 'Top') && target.direction === 'Bottom' && source.point.y < target.point.y) {
            segLength += Math.abs(source.point.x - target.corners.right);
        } else if ((prevDir !== undefined && prevDir !== 'Bottom') &&
            target.direction === 'Top' && target.point.y < source.point.y) {
            segLength += Math.abs(source.point.x - target.corners.right);
        } else {
            segLength += source.point.x - source.corners.left;
        }
    }
    return segLength;
}


/**
 * getRightLength method \
 *
 * @returns {  number } getRightLength method .\
 * @param {End} source - provide the sPt  value.
 * @param {End} target - provide the orientation  value.
 * @param {number} length - provide the src  value.
 * @param {string} prevDir - provide the src  value.
 * @private
 */
function getRightLength(source: End, target: End, length: number, prevDir: string): number {
    if (source.corners.right + source.margin.right < target.corners.right + target.margin.right &&
        source.corners.right + source.margin.right >= target.corners.left - target.margin.left) {
        if (target.direction === 'Bottom' && source.point.y < target.point.y) {
            length += target.corners.right - source.corners.right;
        } else if (target.direction === 'Top' && source.point.y > target.point.y) {
            length += target.corners.right - source.corners.right;
        }
        length += source.corners.right - source.point.x;
    } else {
        if ((prevDir !== undefined && prevDir !== 'Top') && target.direction === 'Bottom' && source.point.y < target.point.y) {
            length += Math.abs(source.point.x - target.corners.right);
        } else if ((prevDir !== undefined && prevDir !== 'Bottom') && target.direction === 'Top' && target.point.y < source.point.y) {
            length += Math.abs(source.point.x - target.corners.right);
        } else {
            length += source.corners.right - source.point.x;
        }
    }
    return length;
}

/**
 * getBottomLength method \
 *
 * @returns {  number } getBottomLength method .\
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @param {number} segLength - provide the segLength  value.
 * @param {string} prevDir - provide the src  value.
 * @private
 */
function getBottomLength(source: End, target: End, segLength: number, prevDir: string): number {
    if (source.corners.bottom + source.margin.bottom < target.corners.bottom + target.margin.bottom &&
        source.corners.bottom + source.margin.bottom >= target.corners.top - target.margin.top) {
        if (target.direction === 'Right' && source.point.x < target.point.x) {
            segLength += target.corners.bottom - source.corners.bottom;
        } else if (target.direction === 'Left' && source.point.x > target.point.x) {
            segLength += target.corners.bottom - source.corners.bottom;
        }
        segLength += source.corners.bottom - source.point.y;
    } else {
        if ((prevDir !== undefined && prevDir !== 'Left') &&
            target.direction === 'Right' && source.point.x < target.point.x) {
            segLength += Math.abs(source.point.y - target.corners.bottom);
        } else if ((prevDir !== undefined && prevDir !== 'Right') &&
            target.direction === 'Left' && target.point.x < source.point.x) {
            segLength += Math.abs(source.point.y - target.corners.bottom);
        } else {
            segLength += source.corners.bottom - source.point.y;
        }
    }
    return segLength;
}
function convertPointToBezierSegment(element: Connector, segCount: NoOfSegments, pts: PointModel[]): void {
    if (element.type === 'Bezier') {
        let start: PointModel = pts[0];
        let end: PointModel = pts[pts.length - 1];
        if (segCount === NoOfSegments.One) {
            let distance: number = Math.min(20, Point.findLength(start, end) * 0.5);
            let vector1: VectorModel = { angle: findAngle(start, end), distance: distance };
            let vector2: VectorModel = { angle: findAngle(end, start), distance: distance };
            let dir = Point.direction(start, end) as Direction;
            let ori = dir == 'Left' || dir == 'Right' ? 'Horizontal' : 'Vertical';
            const segment: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector1, vector2: vector2, orientation: ori }, true);
            (element.segments).push(segment);
        }
        else if (segCount === NoOfSegments.Two) {
            let mid: PointModel = pts[1];
            let vector1: VectorModel = { angle: findAngle(start, mid), distance: Point.findLength(start, mid) * 0.5 };
            let vector2: VectorModel = { angle: findAngle(end, mid), distance: Point.findLength(end, mid) * 0.5 };
            let dir = Point.direction(start, mid) as Direction;
            let ori = dir == 'Left' || dir == 'Right' ? 'Horizontal' : 'Vertical';
            const segment: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector1, vector2: vector2, orientation: ori }, true);
            (element.segments).push(segment);
        }
        else if (segCount === NoOfSegments.Three) {
            let mid1: PointModel = pts[1];
            let mid2: PointModel = pts[pts.length - 2];
            let mid: PointModel = { x: (mid1.x + mid2.x) * 0.5, y: (mid1.y + mid2.y) * 0.5 };
            let vector1: VectorModel = { angle: findAngle(start, mid1), distance: Point.findLength(start, mid1) * 0.5 };
            let vector2: VectorModel = { angle: findAngle(mid, mid1), distance: Point.findLength(mid, mid1) * 0.5 };
            let dir1 = Point.direction(start, mid1) as Direction;
            let ori1 = dir1 == 'Left' || dir1 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment1: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector1, vector2: vector2, point: mid, orientation: ori1 }, true);
            (element.segments).push(segment1);

            let vector3: VectorModel = { angle: findAngle(mid, mid2), distance: Point.findLength(mid, mid2) * 0.5 };
            let vector4: VectorModel = { angle: findAngle(end, mid2), distance: Point.findLength(end, mid2) * 0.5 };
            let dir2 = Point.direction(mid, mid2) as Direction;
            let ori2 = dir2 == 'Left' || dir2 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment2: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector3, vector2: vector4, orientation: ori2 }, true);
            (element.segments).push(segment2);
        }
        else if (segCount === NoOfSegments.Four) {
            let mid1: PointModel = pts[1];
            let mid2: PointModel = pts[2];
            let mid3: PointModel = pts[3];
            let center1: PointModel = { x: (mid1.x + mid2.x) * 0.5, y: (mid1.y + mid2.y) * 0.5 };
            let center2: PointModel = { x: (mid2.x + mid3.x) * 0.5, y: (mid2.y + mid3.y) * 0.5 };
            let vector1: VectorModel = { angle: findAngle(start, mid1), distance: Point.findLength(start, mid1) * 0.5 };
            let vector2: VectorModel = { angle: findAngle(center1, mid1), distance: Point.findLength(center1, mid1) * 0.5 };
            let dir1 = Point.direction(start, mid1) as Direction;
            let ori1 = dir1 == 'Left' || dir1 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment1: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector1, vector2: vector2, point: center1, orientation: ori1 }, true);
            (element.segments).push(segment1);

            let vector3: VectorModel = { angle: findAngle(center1, mid2), distance: Point.findLength(center1, mid2) * 0.5 };
            let vector4: VectorModel = { angle: findAngle(center2, mid2), distance: Point.findLength(center2, mid2) * 0.5 };
            let dir2 = Point.direction(center1, mid2) as Direction;
            let ori2 = dir2 == 'Left' || dir2 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment2: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector3, vector2: vector4, point: center2, orientation: ori2 }, true);
            (element.segments).push(segment2);

            let vector5: VectorModel = { angle: findAngle(center2, mid3), distance: Point.findLength(center2, mid3) * 0.5 };
            let vector6: VectorModel = { angle: findAngle(end, mid3), distance: Point.findLength(end, mid3) * 0.5 };
            let dir3 = Point.direction(center2, mid3) as Direction;
            let ori3 = dir3 == 'Left' || dir3 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment3: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector5, vector2: vector6, orientation: ori3 }, true);
            (element.segments).push(segment3);
        }
        else if (segCount === NoOfSegments.Five) {
            let mid1: PointModel = pts[1];
            let mid2: PointModel = pts[2];
            let mid3: PointModel = pts[3];
            let mid4: PointModel = pts[4];
            let center1: PointModel = { x: (mid1.x + mid2.x) * 0.5, y: (mid1.y + mid2.y) * 0.5 };
            let center2: PointModel = { x: (mid2.x + mid3.x) * 0.5, y: (mid2.y + mid3.y) * 0.5 };
            let center3: PointModel = { x: (mid3.x + mid4.x) * 0.5, y: (mid3.y + mid4.y) * 0.5 };

            let vector1: VectorModel = { angle: findAngle(start, mid1), distance: Point.findLength(start, mid1) * 0.5 };
            let vector2: VectorModel = { angle: findAngle(center1, mid1), distance: Point.findLength(center1, mid1) * 0.5 };
            let dir1 = Point.direction(start, mid1) as Direction;
            let ori1 = dir1 == 'Left' || dir1 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment1: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector1, vector2: vector2, point: center1, orientation: ori1 }, true);
            (element.segments).push(segment1);

            let vector3: VectorModel = { angle: findAngle(center1, mid2), distance: Point.findLength(center1, mid2) * 0.5 };
            let vector4: VectorModel = { angle: findAngle(center2, mid2), distance: Point.findLength(center2, mid2) * 0.5 };
            let dir2 = Point.direction(center1, mid2) as Direction;
            let ori2 = dir2 == 'Left' || dir2 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment2: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector3, vector2: vector4, point: center2, orientation: ori2 }, true);
            (element.segments).push(segment2);

            let vector5: VectorModel = { angle: findAngle(center2, mid3), distance: Point.findLength(center2, mid3) * 0.5 };
            let vector6: VectorModel = { angle: findAngle(center3, mid3), distance: Point.findLength(center3, mid3) * 0.5 };
            let dir3 = Point.direction(center2, mid3) as Direction;
            let ori3 = dir3 == 'Left' || dir3 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment3: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector5, vector2: vector6, point: center3, orientation: ori3 }, true);
            (element.segments).push(segment3);

            let vector7: VectorModel = { angle: findAngle(center3, mid4), distance: Point.findLength(center3, mid4) * 0.5 };
            let vector8: VectorModel = { angle: findAngle(end, mid4), distance: Point.findLength(end, mid4) * 0.5 };
            let dir4 = Point.direction(center3, mid4) as Direction;
            let ori4 = dir4 == 'Left' || dir4 == 'Right' ? 'Horizontal' : 'Vertical';
            const segment4: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier', isInternalSegment: true, vector1: vector7, vector2: vector8, orientation: ori4 }, true);
            (element.segments).push(segment4);
        }
        else {
            const segment: BezierSegmentModel = new BezierSegment(element, 'segments', { type: 'Bezier' }, true);
            (element.segments).push(segment);
        }
    }
}
/**
 * getSwapping method \
 *
 * @returns {  boolean } getSwapping method .\
 * @param {string} srcDir - provide the source  value.
 * @param {string} tarDir - provide the target  value.
 * @private
 */
function getSwapping(srcDir: string, tarDir: string): boolean {
    let swap: boolean = false;
    switch (srcDir) {
        case 'Left':
            switch (tarDir) {
                case 'Right':
                case 'Bottom':
                    swap = true;
                    break;
            }
            break;
        case 'Top':
            switch (tarDir) {
                case 'Left':
                case 'Right':
                case 'Bottom':
                    swap = true;
                    break;
            }
            break;
        case 'Bottom':
            switch (tarDir) {
                case 'Right':
                    swap = true;
                    break;
            }
            break;
    }
    return swap;
}

/**
 * swapPoints method \
 *
 * @returns {  void } swapPoints method .\
 * @param {End} source - provide the source  value.
 * @param {End} target - provide the target  value.
 * @private
 */
function swapPoints(source: End, target: End): void {
    const direction: Direction = source.direction;
    source.direction = target.direction;
    target.direction = direction;
    const point: PointModel = source.point;
    source.point = target.point;
    target.point = point;
    const corner: Corners = source.corners;
    source.corners = target.corners;
    target.corners = corner;
}


/**
 * getPortDirection method \
 *
 * @returns {  boolean } getPortDirection method .\
 * @param {PointModel} point - provide the point  value.
 * @param {Corners} corner - provide the corner  value.
 * @param {Rect} bounds - provide the bounds  value.
 * @param {boolean} closeEdge - provide the closeEdge  value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPortDirection(point: PointModel, corner: Corners, bounds: Rect, closeEdge: boolean): Direction {
    let direction: Direction;
    const boundsValue: Rect | Corners = corner === undefined ? bounds : corner;
    const one: PointModel = boundsValue.topLeft;
    const two: PointModel = boundsValue.topRight;
    const three: PointModel = boundsValue.bottomRight;
    const four: PointModel = boundsValue.bottomLeft;
    const center: PointModel = boundsValue.center;
    const angle: number = findAngle(center, point);
    const fourty5: number = findAngle(center, three);
    const one35: number = findAngle(center, four);
    const two25: number = findAngle(center, one);
    const three15: number = findAngle(center, two);
    if (angle > two25 && angle < three15) {
        direction = 'Top';
        // if (bounds.width < bounds.height && closeEdge) {
        //     let height: number = (bounds.height - bounds.width) / 2;
        //     let width: number = bounds.width;
        //     if (Math.abs(point.x - one.x) < Math.abs(point.x - two.x)) {
        //         direction = checkCloseEdge(direction, new Rect(one.x, one.y, width, height), point, 'Left');
        //     } else {
        //         direction = checkCloseEdge(direction, new Rect(two.x - bounds.width, two.y, width, height), point, 'Right');
        //     }
        // }
    } else if (angle >= fourty5 && angle < one35) {
        direction = 'Bottom';
        // if (bounds.width < bounds.height && closeEdge) {
        //     let height: number = (bounds.height - bounds.width) / 2;
        //     let width: number = bounds.width;
        //     if (Math.abs(point.x - four.x) < Math.abs(point.x - three.x)) {
        //         direction = checkCloseEdge(direction, new Rect(four.x, four.y - height, width, height), point, 'Left');
        //     } else {
        //         let value: Rect = new Rect(three.x - bounds.width, three.y - bounds.height / 4, bounds.width, bounds.height / 4);
        //         direction = checkCloseEdge(direction, value, point, 'Right');
        //     }
        // }
    } else if (angle >= one35 && angle <= two25) {
        direction = 'Left';
        // if (bounds.width > bounds.height && closeEdge) {
        //     let width: number = (bounds.width - bounds.height) / 2;
        //     let height: number = bounds.height;
        //     if (Math.abs(point.y - one.y) < Math.abs(point.y - four.y)) {
        //         direction = checkCloseEdge(direction, new Rect(one.x, one.y, width, height), point, 'Top');
        //     } else {
        //         direction = checkCloseEdge(direction, new Rect(four.x, four.y - height, width, height), point, 'Bottom');
        //     }
        // }
    } else if (angle >= three15 || angle < fourty5) {
        direction = 'Right';
        // if (bounds.width > bounds.height && closeEdge) {
        //     let width: number = (bounds.width - bounds.height) / 2;
        //     let height: number = bounds.height;
        //     if (Math.abs(point.y - two.y) < Math.abs(point.y - three.y)) {
        //         direction = checkCloseEdge(direction, new Rect(two.x - width, two.y, width, height), point, 'Top');
        //     } else {
        //         direction = checkCloseEdge(direction,
        //new Rect(three.x - width, three.y - height, width, height), point, 'Bottom');
        //     }
        // }
    } else {
        direction = 'Right';
    }
    return direction;
}

// function checkCloseEdge(direction: string, threshold: Rect, port: PointModel, nearest: string): string {
// if (threshold) {
//     switch (direction) {
//         case 'Bottom':
//         case 'Top':
//             let left: number = Math.abs(threshold.left - port.x);
//             let right: number = Math.abs(threshold.right - port.x);
//             let ver: number = direction === 'Top' ? Math.abs(threshold.top - port.y) : Math.abs(threshold.bottom - port.y);
//             if (left < right) {
//                 if (left < ver) {
//                     return 'Left';
//                 }
//             } else {
//                 if (right < ver) {
//                     return 'Right';
//                 }
//             }
//             break;
//         case 'Left':
//         case 'Right':
//             let top: number = Math.abs(threshold.top - port.y);
//             let bottom: number = Math.abs(threshold.bottom - port.y);
//             let hor: number = direction === 'Left' ? Math.abs(threshold.left - port.x) : Math.abs(threshold.right - port.x);
//             if (top < bottom) {
//                 if (top < hor) {
//                     return 'Top';
//                 }
//             } else {
//                 if (bottom < hor) {
//                     return 'Bottom';
//                 }
//             }
//             break;
//     }
// }
//Meant for dock port
//    return direction;
//  }

/**
 * getOuterBounds method \
 *
 * @returns {  Rect } getOuterBounds method .\
 * @param {Connector} obj - provide the point  value.
 * @private
 */
export function getOuterBounds(obj: Connector): Rect {
    //let outerBounds: Rect;
    const outerBounds: Rect = obj.wrapper.children[0].bounds;
    if (obj.sourceDecorator.shape !== 'None') {
        outerBounds.uniteRect(obj.wrapper.children[1].bounds);
    }
    if (obj.targetDecorator.shape !== 'None') {
        outerBounds.uniteRect(obj.wrapper.children[2].bounds);
    }
    return outerBounds;
}

/**
 * getOppositeDirection method \
 *
 * @returns {  string } getOppositeDirection method .\
 * @param {string} direction - provide the direction  value.
 * @private
 */
export function getOppositeDirection(direction: string): string {
    switch (direction) {
        case 'Top':
            return 'Bottom';
        case 'Bottom':
            return 'Top';
        case 'Left':
            return 'Right';
        case 'Right':
            return 'Left';
    }
    return 'auto';
}


/** @private */
export interface Intersection {
    enabled: boolean;
    intersectPt: PointModel;
}

/** @private */
export interface LengthFraction {
    lengthFractionIndex: number;
    fullLength: number;
    segmentIndex: number;
    pointIndex: number;
}

/** @private */
export interface BridgeSegment {
    bridgeStartPoint: PointModel[];
    bridges: Bridge[];
    segmentIndex: number;
}

/** @private */
export interface ArcSegment {
    angle: number;
    endPoint: PointModel;
    path: string;
    segmentPointIndex: number;
    startPoint: PointModel;
    sweep: number;
    target: string;
    rendered: boolean;
}

/** @private */
export interface Bridge {
    angle: number;
    endPoint: PointModel;
    path: string;
    segmentPointIndex: number;
    startPoint: PointModel;
    sweep: number;
    target: string;
    rendered: boolean;
}

/** @private */
export interface End {
    corners: Corners;
    point: PointModel;
    direction: Direction;
    margin: MarginModel;
}
