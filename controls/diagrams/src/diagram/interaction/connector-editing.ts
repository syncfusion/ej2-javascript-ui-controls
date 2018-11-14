import { PointModel } from '../primitives/point-model';
import { Connector } from '../objects/connector';
import { ConnectorModel, OrthogonalSegmentModel } from '../objects/connector-model';
import { Point } from '../primitives/point';
import { CommandHandler } from './command-manager';
import { Rect } from '../primitives/rect';
import { intersect3 } from '../utility/diagram-util';
import { cloneObject } from '../utility/base-util';
import { HistoryEntry } from '../diagram/history';
import { Direction } from './../enum/enum';
import { contains } from './actions';
import { SelectorModel } from './selector-model';
import { MouseEventArgs } from './event-handlers';
import { getOppositeDirection } from '../utility/connector';
import { StraightSegment, BezierSegment, OrthogonalSegment } from '../objects/connector';
import { ToolBase } from './tool';
import { Corners } from '../core/elements/diagram-element';
import { Segment } from './scroller';

/**
 * Multiple segments editing for Connector
 */

export class ConnectorEditing extends ToolBase {
    private endPoint: string;
    private selectedSegment: OrthogonalSegment | StraightSegment | BezierSegment;
    private segmentIndex: number;

    constructor(commandHandler: CommandHandler, endPoint: string) {
        super(commandHandler, true);
        this.endPoint = endPoint;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.undoElement = cloneObject(args.source);
        super.mouseDown(args);
        let connectors: ConnectorModel;
        if (args.source && (args.source as SelectorModel).connectors) {
            connectors = (args.source as SelectorModel).connectors[0];
        }
        // Sets the selected segment         
        for (let i: number = 0; i < connectors.segments.length; i++) {
            let segment: BezierSegment = connectors.segments[i] as BezierSegment;
            if (this.endPoint === 'OrthoThumb') {
                for (let j: number = 0; j < segment.points.length - 1; j++) {
                    let segPoint: PointModel = { x: 0, y: 0 };
                    segPoint.x = ((segment.points[j].x + segment.points[j + 1].x) / 2);
                    segPoint.y = ((segment.points[j].y + segment.points[j + 1].y) / 2);
                    if (contains(this.currentPosition, segPoint, 30)) {
                        this.selectedSegment = segment;
                        this.segmentIndex = j;
                    }
                }
            } else {
                if (contains(this.currentPosition, segment.point, 10)) {
                    this.selectedSegment = segment;
                }
            }
        }
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            let diffY: number = this.currentPosition.y - this.prevPosition.y;
            let diffX: number = this.currentPosition.x - this.prevPosition.x;
            this.currentPosition = this.commandHandler.snapConnectorEnd(this.currentPosition);
            let connector: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                connector = (args.source as SelectorModel).connectors[0];
            }
            if (this.inAction && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                if (this.endPoint === 'OrthoThumb') {
                    this.blocked = !this.dragOrthogonalSegment(
                        connector, this.selectedSegment as OrthogonalSegment, this.currentPosition, this.segmentIndex);
                } else {
                    let tx: number = this.currentPosition.x - (this.selectedSegment as StraightSegment | BezierSegment).point.x;
                    let ty: number = this.currentPosition.y - (this.selectedSegment as StraightSegment | BezierSegment).point.y;
                    let index: number = connector.segments.indexOf(this.selectedSegment);
                    this.blocked = !this.commandHandler.dragControlPoint(connector, tx, ty, false, index);
                }
                this.commandHandler.updateSelector();
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let connector: ConnectorModel;
        if (args.source && (args.source as SelectorModel).connectors) {
            connector = (args.source as SelectorModel).connectors[0];
        }
        if (args && args.source && args.info && args.info.ctrlKey && args.info.shiftKey && connector.type === 'Straight') {
            this.addOrRemoveSegment(connector as Connector, this.currentPosition);
        } else {
            if (this.endPoint === 'OrthoThumb' && this.selectedSegment) {
                let index: number = connector.segments.indexOf(this.selectedSegment);
                let prev: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
                let next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
                if (index === connector.segments.length - 2
                    && this.updateLastSegment(connector as Connector, this.selectedSegment as OrthogonalSegment)) {
                    connector.segments.splice(connector.segments.length - 2, 1);
                } else {
                    if (prev && Math.abs(prev.length) < 5) {
                        if (index !== 1) {
                            this.removePrevSegment(connector, index);
                        }
                    } else if (next) {
                        let len: number = Point.distancePoints(next.points[0], next.points[1]);
                        let length: number = ((next.length || next.length === 0) ? next.length : len);
                        if ((Math.abs(length) <= 5)) {
                            this.removeNextSegment(connector, index);
                        }
                    }
                }
                this.commandHandler.updateEndPoint(connector as Connector);
            }
        }
        if (this.undoElement) {
            let obj: SelectorModel;
            obj = cloneObject(args.source);
            let entry: HistoryEntry = {
                type: 'SegmentChanged', redoObject: obj, undoObject: this.undoElement, category: 'Internal'
            };
            this.commandHandler.addHistoryEntry(entry);
        }
        super.mouseUp(args);
    }

    private removePrevSegment(connector: ConnectorModel, index: number): void {
        let first: OrthogonalSegment = connector.segments[index - 2] as OrthogonalSegment;
        let next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
        let length: number = (next.length || next.length === 0) ? next.length : Point.distancePoints(next.points[0], next.points[1]);
        if (!(length <= 5)) {
            let last: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
            connector.segments.splice(index - 1, 2);
            let segment: OrthogonalSegment = this.selectedSegment as OrthogonalSegment;
            if (segment.direction === 'Left' || segment.direction === 'Right') {
                first.points[first.points.length - 1].x = last.points[0].x;
                last.points[0].y = first.points[first.points.length - 1].y;
            } else {
                first.points[first.points.length - 1].y = last.points[0].y;
                last.points[0].x = first.points[first.points.length - 1].x;
            }
            if (segment.length || segment.length === 0) {
                this.findSegmentDirection(first);
            }
            this.findSegmentDirection(last);
        }
    }

    private findSegmentDirection(segment: OrthogonalSegment): void {
        if (segment.direction && (segment.length || segment.length === 0)) {
            segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
            segment.direction = Point.direction(segment.points[0], segment.points[segment.points.length - 1]) as Direction;
        }
    }

    private removeNextSegment(connector: ConnectorModel, index: number): void {
        let segment: OrthogonalSegment = this.selectedSegment as OrthogonalSegment;
        let first: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
        let last: OrthogonalSegment = connector.segments[index + 2] as OrthogonalSegment;
        let next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
        if (next.length || next.length === 0) {
            connector.segments.splice(index, 2);
            if (segment.direction === 'Top' || segment.direction === 'Bottom') {
                last.points[0].y = segment.points[0].y;
                first.points[first.points.length - 1].x = last.points[0].x;
            } else {
                last.points[0].x = segment.points[0].x;
                first.points[first.points.length - 1].y = last.points[0].y;
            }
        } else {
            connector.segments.splice(index + 1, 1);
            if (segment.direction === 'Top' || segment.direction === 'Bottom') {
                first.points[first.points.length - 1].x = next.points[next.points.length - 1].x;
            } else {
                first.points[first.points.length - 1].y = next.points[next.points.length - 1].y;
            }
            this.findSegmentDirection(first);
            segment.length = segment.direction = null;
        }
        if (first && last) {
            first.length = Point.distancePoints(first.points[0], last.points[0]);
            first.direction = Point.direction(first.points[0], last.points[0]) as Direction;
            if (last.length || last.length === 0) {
                last.length = Point.distancePoints(first.points[first.points.length - 1], last.points[last.points.length - 1]);
                let point1: PointModel[] = first.points; let point2: PointModel[] = last.points;
                last.direction = Point.direction(point1[point1.length - 1], point2[point2.length - 1]) as Direction;
            }
        }
    }

    private addOrRemoveSegment(connector: ConnectorModel, point: PointModel): void {
        let updateSeg: boolean; let segmentIndex: number;
        for (let i: number = 0; i < connector.segments.length; i++) {
            let segment: StraightSegment = (connector.segments)[i] as StraightSegment;
            if (contains(point, segment.point, connector.hitPadding)) {
                segmentIndex = i;
                updateSeg = true;
            }
        }
        if (updateSeg && segmentIndex !== undefined) {
            if (connector.segments && connector.segments[segmentIndex] && connector.segments[segmentIndex].type === 'Straight') {
                let segment: StraightSegment = connector.segments[segmentIndex] as StraightSegment;
                let previous: StraightSegment = connector.segments[segmentIndex + 1] as StraightSegment;
                if (previous) {
                    connector.segments.splice(segmentIndex, 1);
                    previous.points[0] = segment.points[0];
                }
            }
        } else {
            let index: number = this.findIndex(connector as Connector, point);
            if (connector.segments && connector.segments[index] && connector.segments[index].type === 'Straight') {
                let segment: StraightSegment = connector.segments[index] as StraightSegment;
                let newseg: StraightSegment =
                    new StraightSegment(connector, 'segments', { type: 'Straight', point: point }, true);
                newseg.points[0] = segment.points[0];
                newseg.points[1] = point;
                segment.points[0] = point;
                connector.segments.splice(index, 0, newseg);
                updateSeg = true;
            }
        }
        if (updateSeg) {
            this.commandHandler.updateEndPoint(connector as Connector);
        }
    }
    private findIndex(connector: Connector, point: PointModel): number {
        let intersectingSegs: StraightSegment[] = [];
        for (let i: number = 0; i < connector.segments.length; i++) {
            let segment: StraightSegment = connector.segments[i] as StraightSegment;
            let rect: Rect = Rect.toBounds([segment.points[0], segment.points[1]]);
            rect.Inflate(connector.hitPadding);

            if (rect.containsPoint(point)) {
                intersectingSegs.push(segment as StraightSegment);
            }
        }
        if (intersectingSegs.length === 1) {
            return connector.segments.indexOf(intersectingSegs[0]);
        } else {
            let ratio: number; let min: number; let index: number;
            let seg: StraightSegment; let v: number; let h: number;
            for (let i: number = 0; i < intersectingSegs.length; i++) {
                seg = intersectingSegs[i] as StraightSegment;
                v = (point.y - seg.points[0].y) / (seg.points[1].y - point.y);
                h = (point.x - seg.points[0].x) / (seg.points[1].x - point.x);
                ratio = Math.abs(v - h);
                if (i === 0) { min = ratio; index = 0; }
                if (ratio < min) { min = ratio; index = i; }
            }
            return connector.segments.indexOf(intersectingSegs[index]);
        }
    }
    private dragOrthogonalSegment(
        obj: ConnectorModel, segment: OrthogonalSegment, point: PointModel, segmentIndex: number):
        boolean {
        let segmentPoint: PointModel = { x: 0, y: 0 };
        segmentPoint.x = ((segment.points[segmentIndex].x + segment.points[segmentIndex + 1].x) / 2);
        segmentPoint.y = ((segment.points[segmentIndex].y + segment.points[segmentIndex + 1].y) / 2);
        let ty: number = point.y - segmentPoint.y;
        let tx: number = point.x - segmentPoint.x;
        let index: number = obj.segments.indexOf(segment); let update: boolean = false;
        let orientation: string = (segment.points[0].y.toFixed(2) === segment.points[1].y.toFixed(2)) ? 'horizontal' : 'vertical';
        let prevSegment: OrthogonalSegmentModel; let nextSegment: OrthogonalSegmentModel;
        if (index !== -1) {
            if (index === 0 && obj.segments.length === 1 && segment.points.length === 2) {
                index = this.addSegments(obj as Connector, segment, tx, ty, index);
                update = true;
            } else if (index === obj.segments.length - 1 && (segment.direction === null || segment.length === null)) {
                index = this.addTerminalSegment(obj, segment, tx, ty, segmentIndex);
                update = true;
            } else if (index === 0) {
                index = this.insertFirstSegment(obj, segment, tx, ty, index);
                update = true;
            }
            if (update) {
                this.selectedSegment = segment = obj.segments[index] as OrthogonalSegment;
                this.segmentIndex = 0;
            }
            this.updateAdjacentSegments(obj as Connector, index, tx, ty);
            this.commandHandler.updateEndPoint(obj as Connector);
        }
        return true;
    }

    private addSegments(obj: ConnectorModel, segment: OrthogonalSegment, tx: number, ty: number, coll: number): number {
        let index: number; let direction: Direction; let segments: OrthogonalSegmentModel[] = []; let len: number;
        let length: number = Point.distancePoints(segment.points[0], segment.points[1]);
        let segmentDirection: Direction = Point.direction(segment.points[0], segment.points[1]) as Direction;
        segments.push(
            new OrthogonalSegment(
                obj, 'segments', { type: 'Orthogonal', direction: segmentDirection, length: length / 4 }, true));
        direction = (segment.points[0].y === segment.points[1].y) ? ((ty > 0) ? 'Bottom' : 'Top') : ((tx > 0) ? 'Right' : 'Left');
        len = (segment.points[0].x === segment.points[1].x) ? ty : tx;
        segments.push(new OrthogonalSegment(
            obj, 'segments', { type: 'Orthogonal', direction: direction, length: len }, true));
        segments.push(
            new OrthogonalSegment(
                obj, 'segments', { type: 'Orthogonal', direction: segmentDirection, length: length / 2 }, true));
        obj.segments = segments.concat(obj.segments);
        index = coll + 2;
        return index;
    }

    private insertFirstSegment(obj: ConnectorModel, segment: OrthogonalSegment, tx: number, ty: number, coll: number): number {
        let direction: Direction; let length: number; let segments: OrthogonalSegmentModel[] = [];
        let segValues: Object; let index: number; let insertseg: OrthogonalSegment;
        if (obj.sourcePortID && segment.length && (obj.segments[0] as OrthogonalSegment).points.length > 2) {
            obj.segments.splice(0, 1);
            let prev: OrthogonalSegment;
            for (let i: number = 0; i < segment.points.length - 1; i++) {
                let len: number = Point.distancePoints(segment.points[i], segment.points[i + 1]);
                let dir: Direction = Point.direction(segment.points[i], segment.points[i + 1]) as Direction;
                insertseg = new OrthogonalSegment(
                    obj, 'segments', { type: 'Orthogonal', direction: dir, length: len }, true);
                if (insertseg.length === 0) {
                    if (prev && (prev.direction === 'Top' || prev.direction === 'Bottom')) {
                        insertseg.direction = tx > 0 ? 'Right' : 'Left';
                    } else {
                        insertseg.direction = ty > 0 ? 'Bottom' : 'Top';
                    }
                }
                prev = insertseg;
                segments.push(insertseg);
            }
            obj.segments = segments.concat(obj.segments);
            index = 1;
        } else {
            segValues = { type: 'Orthogonal', direction: segment.direction, length: segment.length / 3 };
            segments.push(new OrthogonalSegment(obj, 'segments', segValues, true));
            if (segment.direction === 'Bottom' || segment.direction === 'Top') {
                length = Math.abs(tx);
                direction = tx > 0 ? 'Right' : 'Left';
            } else {
                length = Math.abs(ty);
                direction = ty > 0 ? 'Bottom' : 'Top';
            }
            insertseg = new OrthogonalSegment(
                obj, 'segments', { type: 'Orthogonal', direction: direction, length: length }, true);
            segments.push(insertseg);
            let nextseg: OrthogonalSegmentModel = obj.segments[1];
            if (nextseg && nextseg.length) {
                nextseg.length = (direction !== nextseg.direction) ? nextseg.length + length : nextseg.length - length;
            }
            index = 2;
            segment.length = 2 * segment.length / 3;
            obj.segments = segments.concat(obj.segments);
        }
        return index;
    }

    private updateAdjacentSegments(obj: Connector, index: number, tx: number, ty: number): void {
        let current: OrthogonalSegment = obj.segments[index] as OrthogonalSegment;
        let endPoint: PointModel = current.points[current.points.length - 1];
        let startPoint: PointModel = current.points[0];
        let isNextUpdate: boolean = true;
        if (current.type === 'Orthogonal') {
            current.points[0] = startPoint; current.points[current.points.length - 1] = endPoint;
            let prev: OrthogonalSegmentModel = obj.segments[index - 1] as OrthogonalSegment;
            if (prev) {
                isNextUpdate = this.updatePreviousSegment(tx, ty, obj, index);
            }
            if (obj.segments.length - 1 > index && isNextUpdate) {
                let nextSegment: OrthogonalSegment = obj.segments[index + 1] as OrthogonalSegment;
                this.updateNextSegment(obj, current, nextSegment, tx, ty);
            }
        }
    }

    private addTerminalSegment(connector: ConnectorModel, segment: OrthogonalSegment, tx: number, ty: number, segmentIndex: number)
        : number {
        let index: number = connector.segments.indexOf(segment); let first: OrthogonalSegment; let insertseg: OrthogonalSegment;
        let len: number; let dir: Direction;
        connector.segments.pop();
        let last: OrthogonalSegment = connector.segments[connector.segments.length - 1] as OrthogonalSegment;
        first = (last && last.type === 'Orthogonal') ? last : null;
        for (let i: number = 0; i < segment.points.length - 2; i++) {
            len = Point.distancePoints(segment.points[i], segment.points[i + 1]);
            dir = Point.direction(segment.points[i], segment.points[i + 1]) as Direction;
            insertseg = new OrthogonalSegment(
                connector, 'segments', { type: 'Orthogonal', length: len, direction: dir }, true);
            connector.segments.push(insertseg); first = insertseg;
        }
        let sec: number = segmentIndex;
        if (segment.points.length === 2 || sec === segment.points.length - 2) {
            if (first) {
                first.length += 5;
            }
            if (sec !== undefined) {
                let newseg: OrthogonalSegment;
                len = 2 * Point.distancePoints(segment.points[segment.points.length - 2], segment.points[segment.points.length - 1]) / 3;
                dir = Point.direction(segment.points[segment.points.length - 2], segment.points[segment.points.length - 1]) as Direction;
                newseg = new OrthogonalSegment(
                    connector, 'segments', { type: 'Orthogonal', length: len, direction: dir });
                connector.segments.push(newseg);

            }
        }
        let lastseg: OrthogonalSegment = new OrthogonalSegment(
            connector, 'segments', { type: 'Orthogonal' }, true);
        connector.segments.push(lastseg);
        this.commandHandler.updateEndPoint(connector as Connector);
        index = index + segmentIndex;
        return index;
    }

    private updatePortSegment(prev: OrthogonalSegment, connector: ConnectorModel, index: number, tx: number, ty: number): void {
        if (index === 1 && prev.points.length === 2 && prev.length < 0) {
            let source: Corners = (connector as Connector).sourceWrapper.corners;
            let current: OrthogonalSegment = connector.segments[index] as OrthogonalSegment;
            let next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
            let newseg: OrthogonalSegmentModel;
            let segment: OrthogonalSegmentModel[] = [];
            newseg = new OrthogonalSegment(
                connector, 'segments', { type: 'Orthogonal', length: 13, direction: prev.direction });
            segment.push(newseg);
            let len: number;
            if (current.direction === 'Left') {
                len = (current.points[0].x - (source.middleLeft.x - 20));
            } else if (current.direction === 'Right') {
                len = ((source.middleRight.x + 20) - current.points[0].x);
            } else if (current.direction === 'Bottom') {
                len = ((source.bottomCenter.y + 20) - current.points[0].y);
            } else {
                len = (current.points[0].y - (source.topCenter.y - 20));
            }
            let dir: Direction = current.direction;
            newseg = new OrthogonalSegment(
                connector, 'segments', { type: 'Orthogonal', length: len, direction: current.direction });
            segment.push(newseg); current.length = current.length - len;
            if (next && next.length && next.direction) {
                if (next.direction === prev.direction) {
                    next.length -= 13;
                } else if (next.direction === getOppositeDirection(prev.direction)) {
                    next.length += 13;
                }
            }
            connector.segments = segment.concat(connector.segments);
            this.selectedSegment = connector.segments[3] as OrthogonalSegment;
        }
    }

    private updatePreviousSegment(tx: number, ty: number, connector: ConnectorModel, index: number): boolean {
        let current: OrthogonalSegment = connector.segments[index] as OrthogonalSegment;
        let prev: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
        let firstSegment: boolean = (index === 1) ? true : false;
        prev.points[prev.points.length - 1] = current.points[0];
        let isSourceNode: boolean = (connector.sourceID && connector.sourcePortID === '') ? false : true;
        let isNextUpdate: boolean = true;
        if (prev.type === 'Orthogonal') {
            if (prev.direction === 'Bottom') {
                prev.length += ty;
            } else if (prev.direction === 'Top') {
                prev.length -= ty;
            } else if (prev.direction === 'Right') {
                prev.length += tx;
            } else {
                prev.length -= tx;
            }
            if (connector.sourcePortID !== '' && prev.length < 0) {
                this.updatePortSegment(prev, connector as Connector, index, tx, ty);
            } else if (connector.sourceID && connector.sourcePortID === '' && prev.length < 0 && index === 1) {
                isNextUpdate = false;
                this.updateFirstSegment(connector as Connector, current);
            }
            if (isSourceNode) {
                this.changeSegmentDirection(prev);
            }
        }
        return isNextUpdate;
    }

    private changeSegmentDirection(segment: OrthogonalSegment): void {
        if (segment.length < 0) {
            segment.direction = getOppositeDirection(segment.direction) as Direction;
            segment.length *= -1;
        }
    }

    private updateNextSegment(obj: Connector, current: OrthogonalSegment, next: OrthogonalSegment, tx: number, ty: number, ): void {
        let pt: PointModel = current.points[current.points.length - 1]; next.points[0] = current.points[current.points.length - 1];
        if (next && next.type === 'Orthogonal') {
            if (next.length || next.length === 0) {
                if (next.direction === 'Left' || next.direction === 'Right') {
                    if (tx !== 0) {
                        next.length = (next.direction === 'Right') ? next.length - tx : next.length + tx;
                        if (next.length || next.length === 0) {
                            this.changeSegmentDirection(next);
                        }
                    }
                } else {
                    if (ty !== 0) {
                        next.length = (next.direction === 'Bottom') ? next.length - ty : next.length + ty;
                        if (next.length || next.length === 0) {
                            this.changeSegmentDirection(next);
                        }
                    }
                }
            }
        }
    }

    private updateFirstSegment(connector: ConnectorModel, selectedSegment: OrthogonalSegment): void {
        let index: number = connector.segments.indexOf(selectedSegment); let insertfirst: boolean = false;
        let current: OrthogonalSegment = connector.segments[index] as OrthogonalSegment;
        let prev: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
        let con: Connector = connector as Connector; let sourcePoint: PointModel;
        if (prev.length < 0 && connector.sourceID) {
            let sourceNode: Corners = (connector as Connector).sourceWrapper.corners;
            let segments: OrthogonalSegmentModel[] = []; let segValues: Object; let removeCurrentPrev: boolean = false;
            this.changeSegmentDirection(current);
            let next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
            let nextNext: OrthogonalSegment = connector.segments[index + 2] as OrthogonalSegment;
            if (next) {
                this.changeSegmentDirection(next);
            }
            if (nextNext) {
                this.changeSegmentDirection(nextNext);
            }
            switch (prev.direction) {
                case 'Top':
                case 'Bottom':
                    sourcePoint = (current.length > 0 && current.direction === 'Left') ? sourceNode.middleLeft : sourceNode.middleRight;
                    if (current.length > sourceNode.width / 2) {
                        if (Math.abs(prev.length) < sourceNode.height / 2) {
                            prev.length = Point.distancePoints(sourceNode.center, prev.points[prev.points.length - 1]);
                            current.points[0].x = sourcePoint.x;
                            current.length = Point.distancePoints(current.points[0], current.points[current.points.length - 1]);
                            current.length -= 20;
                            insertfirst = true;
                        }
                    } else {
                        if (next && next.direction && next.length) {
                            next.points[0].y = sourcePoint.y;
                            next.points[0].x = next.points[next.points.length - 1].x = (current.direction === 'Right') ?
                                sourcePoint.x + 20 : sourcePoint.x - 20;
                        }
                        insertfirst = true;
                        removeCurrentPrev = true;
                    }
                    break;
                case 'Left':
                case 'Right':
                    sourcePoint = (current.length > 0 && current.direction === 'Top') ? sourceNode.topCenter : sourceNode.bottomCenter;
                    if (current.length > sourceNode.height / 2) {
                        if (Math.abs(prev.length) < sourceNode.width / 2) {
                            prev.length = Point.distancePoints(sourceNode.center, prev.points[prev.points.length - 1]);
                            current.points[0].y = sourcePoint.y;
                            current.length = Point.distancePoints(current.points[0], current.points[current.points.length - 1]);
                            current.length -= 20;
                            insertfirst = true;
                        }
                    } else {
                        if (next && next.direction && next.length) {
                            next.points[0].x = sourcePoint.x;
                            next.points[0].y = next.points[next.points.length - 1].y = (current.direction === 'Bottom') ?
                                sourcePoint.y + 20 : sourcePoint.y - 20;
                        }
                        insertfirst = true;
                        removeCurrentPrev = true;
                    }
                    break;
            }
            this.changeSegmentDirection(prev);
            this.changeSegmentDirection(current);
            if (insertfirst) {
                segValues = { type: 'Orthogonal', direction: current.direction, length: 20 };
                segments.push(new OrthogonalSegment(connector, 'segments', segValues, true));
                if (removeCurrentPrev) {
                    if (next && next.direction && next.length) {
                        next.length = Point.distancePoints(next.points[0], next.points[next.points.length - 1]);
                    }
                    if (nextNext && nextNext.direction && nextNext.length) {
                        nextNext.length = Point.distancePoints(
                            next.points[next.points.length - 1], nextNext.points[nextNext.points.length - 1]);
                    }
                    connector.segments.splice(index - 1, 2);
                }
                connector.segments = segments.concat(connector.segments);
            }
            this.selectedSegment = ((removeCurrentPrev) ? connector.segments[index - 1] :
                connector.segments[index + 1]) as OrthogonalSegment;
            this.commandHandler.updateEndPoint(connector as Connector);
        }
    }

    private updateLastSegment(connector: Connector, selectedSegment: OrthogonalSegment): boolean {

        if (connector.targetID && connector.targetPortID === '') {
            let line1Start: PointModel; let line1End: PointModel; let line2Start: PointModel; let line2End: PointModel;
            let corners: Corners = connector.targetWrapper.corners;
            let firstSegPoint: PointModel = selectedSegment.points[0];
            let lastSegPoint: PointModel = selectedSegment.points[selectedSegment.points.length - 1];

            if (selectedSegment.direction === 'Right' || selectedSegment.direction === 'Left') {
                line1Start = { x: firstSegPoint.x, y: firstSegPoint.y };
                line1End = {
                    x: (selectedSegment.direction === 'Left') ? lastSegPoint.x - corners.width / 2 : lastSegPoint.x + corners.width / 2,
                    y: lastSegPoint.y
                };
                line2Start = { x: corners.center.x, y: corners.center.y - corners.height };
                line2End = { x: corners.center.x, y: corners.center.y + corners.height };
            } else {
                line1Start = { x: firstSegPoint.x, y: firstSegPoint.y };
                line1End = {
                    x: lastSegPoint.x,
                    y: (selectedSegment.direction === 'Bottom') ? lastSegPoint.y + corners.height / 2 : lastSegPoint.y - corners.height / 2
                };
                line2Start = { x: corners.center.x - corners.width, y: corners.center.y };
                line2End = { x: corners.center.x + corners.width, y: corners.center.y };
            }
            let line1: Segment = { x1: line1Start.x, y1: line1Start.y, x2: line1End.x, y2: line1End.y };
            let line2: Segment = { x1: line2Start.x, y1: line2Start.y, x2: line2End.x, y2: line2End.y };
            return (intersect3(line1, line2).enabled);
        }
        return false;
    }

    /**
     * To destroy the connector editing module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the connector editing module
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'ConnectorEditingTool';
    }
}