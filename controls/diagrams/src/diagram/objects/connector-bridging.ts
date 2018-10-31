import { Point } from '../primitives/point';
import { PointModel } from '../primitives/point-model';
import { BridgeDirection } from '../enum/enum';
import { ConnectorModel } from './connector-model';
import { Rect } from '../primitives/rect';
import { Diagram } from '../diagram';
import { findAngle, Intersection, LengthFraction, BridgeSegment, Bridge } from '../utility/connector';
import { intersect3 } from '../utility/diagram-util';
import { ArcSegment } from '../utility/connector';
import { Connector } from './connector';
import { canBridge } from '../utility/constraints-util';
import { Segment } from '../interaction/scroller';

/**
 * ConnectorBridging defines the bridging behavior
 */
/** @private */
export class ConnectorBridging {
    /** @private */
    public updateBridging(conn: Connector, diagram: Diagram): void {
        let lastBridge: BridgeSegment[] = []; let bounds: Rect;
        conn.bridges = [];
        if (canBridge(conn, diagram)) {
            // if (this.canBridge(conn, diagram)) {
            let points1: PointModel[] = this.getPoints(conn);
            bounds = Rect.toBounds(points1);
            let bridgeSpacing: number = conn.bridgeSpace; let bgedir: BridgeDirection = diagram.bridgeDirection;
            let count: number = -1; let quads: ConnectorModel[] = diagram.connectors;
            for (let q: number = 0; q < quads.length; q++) {
                let connector1: ConnectorModel = quads[q];
                if (conn && connector1 && conn.id !== connector1.id) {
                    let points2: PointModel[] = this.getPoints(connector1 as Connector); let bounds1: Rect = Rect.toBounds(points2);
                    if (this.intersectsRect(bounds, bounds1)) {
                        let intersectPts: PointModel[] = this.intersect(points1, points2, false, bgedir, true);
                        if (intersectPts.length > 0) {
                            for (let i: number = 0; i < intersectPts.length; i++) {
                                let fullLength: number = 0; let length: number = 0; let segmentIndex: number = 0;
                                let pointIndex: number = 0;
                                let obj: LengthFraction = this.getLengthAtFractionPoint(conn, intersectPts[i]);
                                if (obj.pointIndex !== -1) {
                                    length = obj.lengthFractionIndex; fullLength = obj.fullLength;
                                    segmentIndex = obj.segmentIndex;
                                    pointIndex = obj.pointIndex;
                                    let stBridge: PointModel = this.getPointAtLength((length - (bridgeSpacing / 2)), points1);
                                    let enBridge: PointModel = this.getPointAtLength((length + (bridgeSpacing / 2)), points1);
                                    let fractLength: number = (length - (bridgeSpacing / 2)) / fullLength;
                                    fractLength = (length + (bridgeSpacing / 2)) / fullLength;
                                    if (this.isEmptyPoint(enBridge)) {
                                        enBridge = stBridge;
                                    }
                                    let start: PointModel; let end: PointModel; start = conn.sourcePoint;
                                    if (conn.type === 'Straight') {
                                        end = conn.targetPoint;
                                    } else {
                                        end = conn.intermediatePoints[pointIndex];
                                    }
                                    let angle: number = this.angleCalculation(start, end);
                                    if (lastBridge.length) {
                                        let fixedPoint: PointModel; fixedPoint = conn.sourcePoint;
                                        let fix: number = Math.abs(this.lengthCalculation(fixedPoint, enBridge)); let var1: number = 0;
                                        let insertAt: number = -1; count = -1;
                                        for (let k: number = 0; k < lastBridge[segmentIndex].bridges.length; k++) {
                                            count++;
                                            let arcSeg: Bridge = lastBridge[segmentIndex].bridges[k];
                                            var1 = Math.abs(this.lengthCalculation(fixedPoint, arcSeg.endPoint));
                                            if (fix < var1) {
                                                insertAt = count; break;
                                            }
                                        }
                                        if (insertAt >= 0) {
                                            let paths: ArcSegment;
                                            paths = this.createSegment(stBridge, enBridge, angle, bgedir, pointIndex, conn, diagram);
                                            paths.target = connector1.id; lastBridge[segmentIndex].bridges.splice(insertAt, 0, paths);
                                            lastBridge[segmentIndex].bridges.join();
                                            lastBridge[segmentIndex].bridgeStartPoint.splice(insertAt, 0, stBridge);
                                            lastBridge[segmentIndex].bridgeStartPoint.join();
                                            lastBridge[segmentIndex].segmentIndex = segmentIndex;
                                        } else {
                                            let paths: ArcSegment;
                                            paths = this.createSegment(stBridge, enBridge, angle, bgedir, pointIndex, conn, diagram);
                                            paths.target = connector1.id; lastBridge[segmentIndex].bridges.push(paths);
                                            lastBridge[segmentIndex].bridgeStartPoint.push(stBridge);
                                            lastBridge[segmentIndex].segmentIndex = segmentIndex;
                                        }
                                    } else {
                                        if (!isNaN(stBridge.x) && !isNaN(stBridge.y) && !this.isEmptyPoint(enBridge)) {
                                            let arcs: ArcSegment;
                                            let bges: Bridge[] = []; let bgept: PointModel[] = [];
                                            arcs = this.createSegment(stBridge, enBridge, angle, bgedir, pointIndex, conn, diagram);
                                            let bgseg: BridgeSegment = {
                                                bridges: bges, bridgeStartPoint: bgept, segmentIndex: segmentIndex
                                            };
                                            arcs.target = connector1.id;
                                            let stPoints: PointModel[] = []; let edPoints: PointModel[] = [];
                                            stPoints.push(stBridge); edPoints.push(enBridge);
                                            lastBridge[segmentIndex] = bgseg; lastBridge[segmentIndex].bridges.push(arcs);
                                            lastBridge[segmentIndex].bridgeStartPoint = stPoints;
                                            lastBridge[segmentIndex].segmentIndex = segmentIndex;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (lastBridge.length !== 0) {
                this.firstBridge(lastBridge, conn, bridgeSpacing);
            }
        }

    }
    /** @private */
    public firstBridge(bridgeList: BridgeSegment[], connector: Connector, bridgeSpacing: number): void {
        for (let i: number = 0; i < bridgeList.length; i++) {
            let bridge: BridgeSegment = bridgeList[i];
            for (let k: number = 1; k < bridge.bridges.length; k++) {
                if (Point.findLength(bridge.bridges[k].endPoint, bridge.bridges[k - 1].endPoint) < bridgeSpacing) {
                    bridge.bridges[k - 1].endPoint = bridge.bridges[k].endPoint;
                    let subBridge: Bridge = bridge.bridges[k - 1];
                    let arc: string = this.createBridgeSegment(
                        subBridge.startPoint,
                        subBridge.endPoint, subBridge.angle, bridgeSpacing, subBridge.sweep);
                    bridge.bridges[k - 1].path = arc; bridge.bridges.splice(k, 1); bridge.bridgeStartPoint.splice(k, 1); k--;
                }
            }
            let pre: PointModel = connector.sourcePoint;
            for (let j: number = 0; j < bridge.bridges.length; j++) {
                let subBridge: Bridge = bridge.bridges[j]; let preventChecking: boolean = true;
                pre = subBridge.endPoint; connector.bridges.push(subBridge);
            }
        }
    }
    /** @private */
    public createSegment(
        st: PointModel, end: PointModel, angle: number, direction: BridgeDirection, index: number, conn: Connector,
        diagram: Diagram): ArcSegment {
        let arc: string;
        let sweep: number;
        let path: ArcSegment = {
            angle: 0, endPoint: { x: 0, y: 0 }, target: '', path: '',
            segmentPointIndex: -1, startPoint: { x: 0, y: 0 }, sweep: 1, rendered: false
        };
        sweep = this.sweepDirection(angle, direction, conn, diagram);
        arc = this.createBridgeSegment(st, end, angle, conn.bridgeSpace, sweep);
        path.path = arc;
        path.startPoint = st;
        path.endPoint = end;
        path.angle = angle;
        path.segmentPointIndex = index;
        path.sweep = sweep;
        return path;
    }

    /** @private */
    public createBridgeSegment(startPt: PointModel, endPt: PointModel, angle: number, bridgeSpace: number, sweep: number): string {
        let path: string = 'A ' + bridgeSpace / 2 + ' ' + bridgeSpace / 2 + ' ' + angle + ' , 1 ' + sweep + ' ' + endPt.x + ',' + endPt.y;
        return path;
    }
    /** @private */
    public sweepDirection(angle: number, bridgeDirection: BridgeDirection, connector: Connector, diagram: Diagram): number {
        let angle1: number = Math.abs(angle);
        let sweep: number;
        switch (bridgeDirection) {
            case 'Top':
            case 'Bottom':
                sweep = 1;
                if (angle1 >= 0 && angle1 <= 90) {
                    sweep = 0;
                }
                break;
            case 'Left':
            case 'Right':
                sweep = 1;
                if (angle < 0 && angle >= -180) {
                    sweep = 0;
                }
                break;
        }
        if (bridgeDirection === 'Right' || bridgeDirection === 'Bottom') {
            if (sweep === 0) {
                sweep = 1;
            } else {
                sweep = 0;
            }
        }
        return sweep;
    }

    /** @private */
    public getPointAtLength(length: number, pts: PointModel[]): PointModel {
        let run: number = 0;
        let pre: PointModel;
        let found: PointModel = { x: 0, y: 0 };
        for (let i: number = 0; i < pts.length; i++) {
            let pt: PointModel = pts[i];
            if (!pre) {
                pre = pt;
                continue;
            } else {
                let l: number = this.lengthCalculation(pre, pt);
                if (run + l > length) {
                    let r: number = length - run;
                    let deg: number = Point.findAngle(pre, pt);
                    let x: number = r * Math.cos(deg * Math.PI / 180);
                    let y: number = r * Math.sin(deg * Math.PI / 180);
                    found = { x: pre.x + x, y: pre.y + y };
                    break;
                } else {
                    run += l;
                }
            }
            pre = pt;
        }
        return found;
    }
    /** @private */
    protected getPoints(connector: Connector): PointModel[] {
        let points: PointModel[] = [];
        if (connector.intermediatePoints && (connector.type === 'Straight' || connector.type === 'Orthogonal')) {
            for (let j: number = 0; j < connector.intermediatePoints.length; j++) {
                points.push(connector.intermediatePoints[j]);
            }
        }
        return points;
    }

    private intersectsRect(rect1: Rect, rect2: Rect): boolean {
        return ((((rect2.x < (rect1.x + rect1.width)) && (rect1.x < (rect2.x + rect2.width)))
            && (rect2.y < (rect1.y + rect1.height))) && (rect1.y < (rect2.y + rect2.height)));
    }
    /** @private */
    public intersect(
        points1: PointModel[], points2: PointModel[], self: boolean,
        bridgeDirection: BridgeDirection, zOrder: boolean): PointModel[] {
        if (self && points2.length >= 2) {
            points2.splice(0, 1);
            points2.splice(0, 1);
        }
        let points: PointModel[] = [];
        for (let i: number = 0; i < points1.length - 1; i++) {
            let pt: PointModel[] = this.inter1(points1[i], points1[i + 1], points2, zOrder, bridgeDirection);
            if (pt.length > 0) {
                for (let k: number = 0; k < pt.length; k++) {
                    points.push(pt[k]);
                }
            }
            if (self && points2.length >= 1) {
                points2.splice(0, 1);
            }
        }
        return points;
    }

    /** @private */
    public inter1(
        startPt: PointModel, endPt: PointModel, pts: PointModel[], zOrder: boolean,
        bridgeDirection: BridgeDirection): PointModel[] {
        let points1: PointModel[] = [];
        for (let i: number = 0; i < pts.length - 1; i++) {
            let point: PointModel = this.intersect2(startPt, endPt, pts[i], pts[i + 1]);
            if (!this.isEmptyPoint(point)) {
                let angle: number = this.angleCalculation(startPt, endPt);
                let angle1: number = this.angleCalculation(pts[i], pts[i + 1]);
                angle = this.checkForHorizontalLine(angle);
                angle1 = this.checkForHorizontalLine(angle1);
                switch (bridgeDirection) {
                    case 'Left':
                    case 'Right':
                        if (angle > angle1) {
                            points1.push(point);
                        }
                        break;
                    case 'Top':
                    case 'Bottom':
                        if (angle < angle1) {
                            points1.push(point);
                        }
                        break;
                }
                if (angle === angle1 && zOrder) {
                    points1.push(point);
                }
            }
        }
        return points1;
    }

    private checkForHorizontalLine(angle: number): number {
        let temp: number = 0;
        let roundedAngle: number = Math.abs(angle);
        if (roundedAngle > 90) {
            temp = 180 - roundedAngle;
        } else {
            temp = roundedAngle;
        }
        return temp;
    }

    private intersect2(start1: PointModel, end1: PointModel, start2: PointModel, end2: PointModel): PointModel {
        let point: PointModel = { x: 0, y: 0 };
        let lineUtil1: Segment = this.getLineSegment(start1.x, start1.y, end1.x, end1.y);
        let lineUtil2: Segment = this.getLineSegment(start2.x, start2.y, end2.x, end2.y);
        let line3: Intersection = intersect3(lineUtil1, lineUtil2);
        if (line3.enabled) {
            return line3.intersectPt;
        } else {
            return point;
        }

    }
    /** @private */
    public getLineSegment(x1: number, y1: number, x2: number, y2: number): Segment {
        return { 'x1': Number(x1) || 0, 'y1': Number(y1) || 0, 'x2': Number(x2) || 0, 'y2': Number(y2) || 0 };
    }

    private isEmptyPoint(point: PointModel): boolean {
        return point.x === 0 && point.y === 0;
    }

    private getLengthAtFractionPoint(connector: Connector, pointAt: PointModel): LengthFraction {
        let lengthFraction: LengthFraction;
        let confirm: number = 100; let pointIndex: number = -1;
        let fullLength: number = 0; let segmentIndex: number = -1;
        let count: number = 0; let lengthAtFractionPt: number = 0;
        let pt1: PointModel = connector.sourcePoint;
        let previouspt2: PointModel = pt1;
        let points: PointModel[] = [];
        for (let i: number = 0; i < connector.intermediatePoints.length; i++) {
            let point2: PointModel = connector.intermediatePoints[i];
            points.push(point2);
        }
        for (let j: number = 0; j < points.length; j++) {
            let pt2: PointModel = points[j];
            let suspect: number = this.getSlope(pt2, pt1, pointAt, connector);
            if (suspect < confirm) {
                confirm = suspect;
                lengthAtFractionPt = fullLength + this.lengthCalculation(pointAt, previouspt2);
                segmentIndex = count;
                pointIndex = j;
            }
            fullLength += Point.findLength(pt2, pt1);
            pt1 = pt2;
            previouspt2 = pt2;
        }
        count++;
        lengthFraction = {
            lengthFractionIndex: lengthAtFractionPt, fullLength: fullLength,
            segmentIndex: segmentIndex, pointIndex: pointIndex
        };
        return lengthFraction;
    }

    private getSlope(startPt: PointModel, endPt: PointModel, point: PointModel, connector: Connector): number {
        let three: number = 3.0;
        let delX: number = Math.abs(startPt.x - endPt.x);
        let delY: number = Math.abs(startPt.y - endPt.y);
        let lhs: number = ((point.y - startPt.y) / (endPt.y - startPt.y));
        let rhs: number = ((point.x - startPt.x) / (endPt.x - startPt.x));
        if (!isFinite(lhs) || !isFinite(rhs) || isNaN(lhs) || isNaN(rhs)) {
            if (startPt.x === endPt.x) {
                if (startPt.y === endPt.y) {
                    return 10000;
                } else if (((startPt.y > point.y) && (point.y > endPt.y)) || ((startPt.y < point.y) && (point.y < endPt.y))) {
                    return Math.abs(startPt.x - point.x);
                }
            } else if (startPt.y === endPt.y) {
                if (((startPt.x > point.x) && (point.x > endPt.x)) || ((startPt.x < point.x) && (point.x < endPt.x))) {
                    return Math.abs(startPt.y - point.y);
                }
            }
        } else {
            if ((startPt.x >= point.x && point.x >= endPt.x) || (startPt.x <= point.x && point.x <= endPt.x) || delX < three) {
                if ((startPt.y >= point.y && point.y >= endPt.y) || (startPt.y <= point.y && point.y <= endPt.y) || delY < three) {
                    return Math.abs(lhs - rhs);
                }
            }
        }
        return 10000;
    }

    /** @private */
    public angleCalculation(startPt: PointModel, endPt: PointModel): number {
        let xDiff: number = startPt.x - endPt.x;
        let yDiff: number = startPt.y - endPt.y;
        return Math.atan2(yDiff, xDiff) * (180 / Math.PI);
    }

    private lengthCalculation(startPt: PointModel, endPt: PointModel): number {
        //removed a try catch from here
        let len: number = Math.sqrt(((startPt.x - endPt.x) * (startPt.x - endPt.x)) + ((startPt.y - endPt.y) * (startPt.y - endPt.y)));
        return len;
    }

    /**
     * Constructor for the bridging module
     * @private
     */

    constructor() {
        //constructs the bridging module
    }

    /**
     * To destroy the bridging module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the bridging module
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Bridging';
    }
}