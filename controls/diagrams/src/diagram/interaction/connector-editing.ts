import { PointModel } from '../primitives/point-model';
import { Connector } from '../objects/connector';
import { ConnectorModel, OrthogonalSegmentModel } from '../objects/connector-model';
import { Point } from '../primitives/point';
import { CommandHandler } from './command-manager';
import { Rect } from '../primitives/rect';
import { intersect3, cloneBlazorObject } from '../utility/diagram-util';
import { cloneObject } from '../utility/base-util';
import { HistoryEntry } from '../diagram/history';
import { Direction, DiagramEvent } from './../enum/enum';
import { contains } from './actions';
import { SelectorModel } from '../objects/node-model';
import { MouseEventArgs } from './event-handlers';
import { getOppositeDirection } from '../utility/connector';
import { StraightSegment, BezierSegment, OrthogonalSegment } from '../objects/connector';
import { ToolBase } from './tool';
import { Corners } from '../core/elements/diagram-element';
import { Segment } from './scroller';
import { ISegmentCollectionChangeEventArgs, IBlazorSegmentCollectionChangeEventArgs } from '../objects/interface/IElement';
import { isBlazor } from '@syncfusion/ej2-base';

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

    /**
     * mouseDown method\
     *
     * @returns {  void }    mouseDown method .\
     * @param {MouseEventArgs} args - provide the args value.
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        let connectors: ConnectorModel;
        let edit: boolean = true;
        if (args.source && (args.source as SelectorModel).connectors) {
            connectors = (args.source as SelectorModel).connectors[0];
        }
        if (args.info && args.actualObject) {
            edit = args.info.ctrlKey && (args.actualObject as ConnectorModel).type !== 'Orthogonal';
        }
        if (connectors && edit) {
            this.inAction = true;
            this.undoElement = cloneObject(args.source);
            super.mouseDown(args);
            // Sets the selected segment
            for (let i: number = 0; i < connectors.segments.length; i++) {
                const segment: BezierSegment = connectors.segments[i] as BezierSegment;
                if (this.endPoint === 'OrthoThumb') {
                    for (let j: number = 0; j < segment.points.length - 1; j++) {
                        const segPoint: PointModel = { x: 0, y: 0 };
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
    }
    /**
     * mouseMove method\
     *
     * @returns {  void }    mouseMove method .\
     * @param {MouseEventArgs} args - provide the args value.
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            const diffY: number = this.currentPosition.y - this.prevPosition.y;
            const diffX: number = this.currentPosition.x - this.prevPosition.x;
            this.currentPosition = this.commandHandler.snapConnectorEnd(this.currentPosition);
            let connector: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                connector = (args.source as SelectorModel).connectors[0];
            }
            if ((this.inAction && this.selectedSegment !== undefined && this.endPoint !== undefined) && (diffX !== 0 || diffY !== 0)) {
                if (this.endPoint === 'OrthoThumb') {
                    this.blocked = !this.dragOrthogonalSegment(
                        connector, this.selectedSegment as OrthogonalSegment, this.currentPosition, this.segmentIndex);
                } else {
                    const tx: number = this.currentPosition.x - (this.selectedSegment as StraightSegment | BezierSegment).point.x;
                    const ty: number = this.currentPosition.y - (this.selectedSegment as StraightSegment | BezierSegment).point.y;
                    const index: number = connector.segments.indexOf(this.selectedSegment);
                    this.blocked = !this.commandHandler.dragControlPoint(connector, tx, ty, false, index);
                }
                this.commandHandler.updateSelector();
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }

    /**
     * mouseUp method\
     *
     * @returns {  void }    mouseUp method .\
     * @param {MouseEventArgs} args - provide the args value.
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        let connector: ConnectorModel;
        let oldValues: Connector;
        if (args.source && (args.source as SelectorModel).connectors) {
            connector = (args.source as SelectorModel).connectors[0];
            oldValues = { segments: connector.segments } as Connector;
        }
        if (args && args.source && args.info && args.info.ctrlKey && args.info.shiftKey && connector.type === 'Straight') {
            this.addOrRemoveSegment(connector as Connector, this.currentPosition);
        } else {
            if (this.endPoint === 'OrthoThumb' && this.selectedSegment) {
                const index: number = connector.segments.indexOf(this.selectedSegment);
                const prev: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
                const next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
                if (index === connector.segments.length - 2
                    && this.updateLastSegment(connector as Connector, this.selectedSegment as OrthogonalSegment)) {
                    connector.segments.splice(connector.segments.length - 2, 1);
                } else {
                    if (prev && Math.abs(prev.length) < 5) {
                        if (index !== 1) {
                            this.removePrevSegment(connector, index);
                        }
                    } else if (next) {
                        const len: number = Point.distancePoints(next.points[0], next.points[1]);
                        const length: number = ((next.length || next.length === 0) ? next.length : len);
                        if ((Math.abs(length) <= 5)) {
                            this.removeNextSegment(connector, index);
                        }
                    }
                }
                this.commandHandler.updateEndPoint(connector as Connector, oldValues);
            }
        }
        if (this.undoElement) {
            //let obj: SelectorModel;
            const obj: SelectorModel = cloneObject(args.source);
            const entry: HistoryEntry = {
                type: 'SegmentChanged', redoObject: obj, undoObject: this.undoElement, category: 'Internal'
            };
            this.commandHandler.addHistoryEntry(entry);
        }
        super.mouseUp(args);
    }

    private removePrevSegment(connector: ConnectorModel, index: number): void {
        const first: OrthogonalSegment = connector.segments[index - 2] as OrthogonalSegment;
        const next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
        const length: number = (next.length || next.length === 0) ? next.length : Point.distancePoints(next.points[0], next.points[1]);
        if (!(length <= 5)) {
            const removeSegments: OrthogonalSegmentModel[] = connector.segments.slice(index - 1, index + 1);
            let args: ISegmentCollectionChangeEventArgs = {
                element: connector, removeSegments: removeSegments, type: 'Removal', cancel: false
            };
            if (isBlazor()) {
                args = {
                    element: cloneBlazorObject(connector), removeSegments: cloneBlazorObject(removeSegments) as OrthogonalSegmentModel[],
                    type: 'Removal', cancel: args.cancel
                };
            }
            this.commandHandler.triggerEvent(DiagramEvent.segmentCollectionChange, args);
            if (!args.cancel) {
                const last: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
                connector.segments.splice(index - 1, 2);
                const segment: OrthogonalSegment = this.selectedSegment as OrthogonalSegment;
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
    }

    private findSegmentDirection(segment: OrthogonalSegment): void {
        if (segment.direction && (segment.length || segment.length === 0)) {
            segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
            segment.direction = Point.direction(segment.points[0], segment.points[segment.points.length - 1]) as Direction;
        }
    }

    private removeNextSegment(connector: ConnectorModel, index: number): void {
        const segment: OrthogonalSegment = this.selectedSegment as OrthogonalSegment;
        const first: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
        const last: OrthogonalSegment = connector.segments[index + 2] as OrthogonalSegment;
        const next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
        // eslint-disable-next-line
        let removeSegments: OrthogonalSegmentModel[]; let args: ISegmentCollectionChangeEventArgs | IBlazorSegmentCollectionChangeEventArgs;
        if (next.length || next.length === 0) {
            removeSegments = connector.segments.slice(index, 2);
            args = {
                element: connector, removeSegments: removeSegments, type: 'Removal', cancel: false
            };
            args = {
                element: cloneBlazorObject(connector), removeSegments: cloneBlazorObject(removeSegments) as OrthogonalSegmentModel[],
                type: 'Removal', cancel: false
            };
            if (isBlazor()) {
                args = {
                    element: cloneBlazorObject(connector), removeSegments: cloneBlazorObject(removeSegments) as OrthogonalSegmentModel[],
                    type: 'Removal', cancel: false
                };
            }
            this.commandHandler.triggerEvent(DiagramEvent.segmentCollectionChange, args);
            if (!args.cancel) {
                connector.segments.splice(index, 2);
                if (segment.direction === 'Top' || segment.direction === 'Bottom') {
                    last.points[0].y = segment.points[0].y;
                    first.points[first.points.length - 1].x = last.points[0].x;
                } else {
                    last.points[0].x = segment.points[0].x;
                    first.points[first.points.length - 1].y = last.points[0].y;
                }
            }
        } else {
            removeSegments = connector.segments.slice(index + 1, 1);
            args = {
                element: connector, removeSegments: removeSegments, type: 'Removal', cancel: false
            };
            if (isBlazor()) {
                args = {
                    element: connector, removeSegments: removeSegments, type: 'Removal', cancel: false
                };
            }
            this.commandHandler.triggerEvent(DiagramEvent.segmentCollectionChange, args);
            if (!args.cancel) {
                connector.segments.splice(index + 1, 1);
                if (segment.direction === 'Top' || segment.direction === 'Bottom') {
                    first.points[first.points.length - 1].x = next.points[next.points.length - 1].x;
                } else {
                    first.points[first.points.length - 1].y = next.points[next.points.length - 1].y;
                }
                this.findSegmentDirection(first);
                segment.length = segment.direction = null;
            }
        }
        if (first && last && !args.cancel) {
            first.length = Point.distancePoints(first.points[0], last.points[0]);
            first.direction = Point.direction(first.points[0], last.points[0]) as Direction;
            if (last.length || last.length === 0) {
                last.length = Point.distancePoints(first.points[first.points.length - 1], last.points[last.points.length - 1]);
                const point1: PointModel[] = first.points; const point2: PointModel[] = last.points;
                last.direction = Point.direction(point1[point1.length - 1], point2[point2.length - 1]) as Direction;
            }
        }
    }

    private addOrRemoveSegment(connector: ConnectorModel, point: PointModel): void {
        let updateSeg: boolean; let segmentIndex: number;
        const oldValues: Connector = { segments: connector.segments } as Connector;
        for (let i: number = 0; i < connector.segments.length; i++) {
            const segment: StraightSegment = (connector.segments)[i] as StraightSegment;
            if (contains(point, segment.point, connector.hitPadding)) {
                segmentIndex = i;
                updateSeg = true;
            }
        }
        if (updateSeg && segmentIndex !== undefined) {
            if (connector.segments && connector.segments[segmentIndex] && connector.segments[segmentIndex].type === 'Straight') {
                const segment: StraightSegment = connector.segments[segmentIndex] as StraightSegment;
                const previous: StraightSegment = connector.segments[segmentIndex + 1] as StraightSegment;
                if (previous) {
                    connector.segments.splice(segmentIndex, 1);
                    previous.points[0] = segment.points[0];
                }
            }
        } else {
            this.commandHandler.enableServerDataBinding(false);
            const index: number = this.findIndex(connector as Connector, point);
            if (connector.segments && connector.segments[index] && connector.segments[index].type === 'Straight') {
                const segment: StraightSegment = connector.segments[index] as StraightSegment;
                const newseg: StraightSegment =
                    new StraightSegment(connector, 'segments', { type: 'Straight', point: point }, true);
                newseg.points[0] = segment.points[0];
                newseg.points[1] = point;
                segment.points[0] = point;
                connector.segments.splice(index, 0, newseg);
                updateSeg = true;
            }
            this.commandHandler.enableServerDataBinding(true);
        }
        if (updateSeg) {
            this.commandHandler.updateEndPoint(connector as Connector, oldValues);
        }
    }
    private findIndex(connector: Connector, point: PointModel): number {
        const intersectingSegs: StraightSegment[] = [];
        for (let i: number = 0; i < connector.segments.length; i++) {
            const segment: StraightSegment = connector.segments[i] as StraightSegment;
            const rect: Rect = Rect.toBounds([segment.points[0], segment.points[1]]);
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
        const segmentPoint: PointModel = { x: 0, y: 0 };
        const oldValues: Connector = { segments: obj.segments } as Connector;
        segmentPoint.x = ((segment.points[segmentIndex].x + segment.points[segmentIndex + 1].x) / 2);
        segmentPoint.y = ((segment.points[segmentIndex].y + segment.points[segmentIndex + 1].y) / 2);
        const ty: number = point.y - segmentPoint.y;
        const tx: number = point.x - segmentPoint.x;
        let index: number = obj.segments.indexOf(segment); let update: boolean = false;
        //const orientation: string = (segment.points[0].y.toFixed(2) === segment.points[1].y.toFixed(2)) ? 'horizontal' : 'vertical';
        //const prevSegment: OrthogonalSegmentModel; const nextSegment: OrthogonalSegmentModel;
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
            if (index) {
                if (update) {
                    this.selectedSegment = segment = obj.segments[index] as OrthogonalSegment;
                    this.segmentIndex = 0;
                }
                this.updateAdjacentSegments(obj as Connector, index, tx, ty);
                this.commandHandler.updateEndPoint(obj as Connector, oldValues);
            }
        }
        return true;
    }

    private addSegments(obj: ConnectorModel, segment: OrthogonalSegment, tx: number, ty: number, coll: number): number {
        let index: number; const segments: OrthogonalSegmentModel[] = []; //let len: number;
        const length: number = Point.distancePoints(segment.points[0], segment.points[1]);
        const segmentDirection: Direction = Point.direction(segment.points[0], segment.points[1]) as Direction;
        segments.push(
            new OrthogonalSegment(
                obj, 'segments', { type: 'Orthogonal', direction: segmentDirection, length: length / 4 }, true));
        const direction: Direction = (segment.points[0].y === segment.points[1].y) ? ((ty > 0) ? 'Bottom' : 'Top') : ((tx > 0) ? 'Right' : 'Left');
        const len: number = (segment.points[0].x === segment.points[1].x) ? ty : tx;
        segments.push(new OrthogonalSegment(
            obj, 'segments', { type: 'Orthogonal', direction: direction, length: len }, true));
        segments.push(
            new OrthogonalSegment(
                obj, 'segments', { type: 'Orthogonal', direction: segmentDirection, length: length / 2 }, true));
        let args: ISegmentCollectionChangeEventArgs = {
            element: obj, addSegments: segments, type: 'Addition', cancel: false
        };
        if (isBlazor()) {
            args = {
                addSegments: cloneBlazorObject(segments) as OrthogonalSegmentModel[], type: 'Addition',
                cancel: args.cancel, element: cloneBlazorObject(obj)
            };
        }
        this.commandHandler.triggerEvent(DiagramEvent.segmentCollectionChange, args);
        if (!args.cancel) {
            obj.segments = segments.concat(obj.segments);
            index = coll + 2;
        }
        return index;
    }
    // eslint-disable-next-line
    private insertFirstSegment(obj: ConnectorModel, segment: OrthogonalSegment, tx: number, ty: number, coll: number): number {
        let direction: Direction; let length: number; const segments: OrthogonalSegmentModel[] = [];
        let segValues: Object; let index: number; let insertseg: OrthogonalSegment;
        if (obj.sourcePortID && segment.length && (obj.segments[0] as OrthogonalSegment).points.length > 2) {
            let prev: OrthogonalSegment;
            for (let i: number = 0; i < segment.points.length - 1; i++) {
                const len: number = Point.distancePoints(segment.points[i], segment.points[i + 1]);
                const dir: Direction = Point.direction(segment.points[i], segment.points[i + 1]) as Direction;
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

        }
        let args: ISegmentCollectionChangeEventArgs | IBlazorSegmentCollectionChangeEventArgs = {
            element: obj, addSegments: segments, type: 'Addition', cancel: false
        };
        if (isBlazor()) {
            args = {
                element: cloneBlazorObject(obj), addSegments: cloneBlazorObject(segments) as OrthogonalSegmentModel[], type: 'Addition',
                cancel: args.cancel
            };
        }
        this.commandHandler.triggerEvent(DiagramEvent.segmentCollectionChange, args);
        if (!args.cancel) {

            if (obj.sourcePortID && segment.length && (obj.segments[0] as OrthogonalSegment).points.length > 2) {
                obj.segments.splice(0, 1); index = 1;
            } else {
                const nextseg: OrthogonalSegmentModel = obj.segments[1];
                if (nextseg && nextseg.length) {
                    nextseg.length = (direction !== nextseg.direction) ? nextseg.length + length : nextseg.length - length;
                }
                index = 2; segment.length = 2 * segment.length / 3;
            }
            obj.segments = segments.concat(obj.segments);
        }
        return index;
    }

    private updateAdjacentSegments(obj: Connector, index: number, tx: number, ty: number): void {
        const current: OrthogonalSegment = obj.segments[index] as OrthogonalSegment;
        const endPoint: PointModel = current.points[current.points.length - 1];
        const startPoint: PointModel = current.points[0];
        let isNextUpdate: boolean = true;
        if (current.type === 'Orthogonal') {
            current.points[0] = startPoint; current.points[current.points.length - 1] = endPoint;
            const prev: OrthogonalSegmentModel = obj.segments[index - 1] as OrthogonalSegment;
            if (prev) {
                isNextUpdate = this.updatePreviousSegment(tx, ty, obj, index);
            }
            if (obj.segments.length - 1 > index && isNextUpdate) {
                if (!obj.maxSegmentThumb) {
                    const nextSegment: OrthogonalSegment = obj.segments[index + 1] as OrthogonalSegment;
                    this.updateNextSegment(obj, current, nextSegment, tx, ty);
                }
            }
        }
    }

    private addTerminalSegment(connector: ConnectorModel, segment: OrthogonalSegment, tx: number, ty: number, segmentIndex: number)
        : number {
        //const oldValues: Connector = { segments: connector.segments } as Connector;
        let index: number = connector.segments.indexOf(segment); let first: OrthogonalSegment; let insertseg: OrthogonalSegment;
        let len: number; let dir: Direction; const segments: OrthogonalSegmentModel[] = [];
        const removeSegment: OrthogonalSegmentModel = connector.segments.pop();
        const last: OrthogonalSegment = connector.segments[connector.segments.length - 1] as OrthogonalSegment;
        first = (last && last.type === 'Orthogonal') ? last : null;
        for (let i: number = 0; i < segment.points.length - 2; i++) {
            len = Point.distancePoints(segment.points[i], segment.points[i + 1]);
            dir = Point.direction(segment.points[i], segment.points[i + 1]) as Direction;
            insertseg = new OrthogonalSegment(
                connector, 'segments', { type: 'Orthogonal', length: len, direction: dir }, true);
            segments.push(insertseg); first = insertseg;
        }
        const sec: number = segmentIndex;
        if (segment.points.length === 2 || sec === segment.points.length - 2) {
            if (first) {
                first.length += 5;
            }
            if (sec !== undefined) {
                //let newseg: OrthogonalSegment;
                len = 2 * Point.distancePoints(segment.points[segment.points.length - 2], segment.points[segment.points.length - 1]) / 3;
                dir = Point.direction(segment.points[segment.points.length - 2], segment.points[segment.points.length - 1]) as Direction;
                const newseg: OrthogonalSegment = new OrthogonalSegment(
                    connector, 'segments', { type: 'Orthogonal', length: len, direction: dir });
                segments.push(newseg);
            }
        }
        const lastseg: OrthogonalSegment = new OrthogonalSegment(
            connector, 'segments', { type: 'Orthogonal' }, true);
        segments.push(lastseg);
        const args: ISegmentCollectionChangeEventArgs = {
            element: connector, addSegments: segments, type: 'Addition', cancel: false
        };
        let args1: ISegmentCollectionChangeEventArgs | IBlazorSegmentCollectionChangeEventArgs;
        args1 = {
            element: cloneBlazorObject(connector), addSegments: cloneBlazorObject(segments) as OrthogonalSegmentModel[],
            type: 'Addition', cancel: args.cancel
        };
        if (isBlazor()) {
            args1 = {
                element: cloneBlazorObject(connector), addSegments: cloneBlazorObject(segments) as OrthogonalSegmentModel[],
                type: 'Addition', cancel: args.cancel
            };
        }
        this.commandHandler.triggerEvent(DiagramEvent.segmentCollectionChange, args1);
        if (!args1.cancel) {
            connector.segments = connector.segments.concat(segments);
            index = index + segmentIndex;
        } else {
            connector.segments.push(removeSegment);
        }
        this.commandHandler.updateEndPoint(connector as Connector);

        return index;
    }

    // eslint-disable-next-line
    private updatePortSegment(prev: OrthogonalSegment, connector: ConnectorModel, index: number, tx: number, ty: number): void {
        if (index === 1 && prev.points.length === 2 && prev.length < 0) {
            const source: Corners = (connector as Connector).sourceWrapper.corners;
            const current: OrthogonalSegment = connector.segments[index] as OrthogonalSegment;
            const next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
            let newseg: OrthogonalSegmentModel;
            const segment: OrthogonalSegmentModel[] = [];
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
            //const dir: Direction = current.direction;
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
        const current: OrthogonalSegment = connector.segments[index] as OrthogonalSegment;
        const prev: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
        //const firstSegment: boolean = (index === 1) ? true : false;
        prev.points[prev.points.length - 1] = current.points[0];
        const isSourceNode: boolean = (connector.sourceID && connector.sourcePortID === '') ? false : true;
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
                this.changeSegmentDirection(prev, connector);
            }
        }
        return isNextUpdate;
    }

    private changeSegmentDirection(segment: OrthogonalSegment, connector: ConnectorModel): void {
        if (!connector.maxSegmentThumb) {
            if (segment.length < 0) {
                segment.direction = getOppositeDirection(segment.direction) as Direction;
                segment.length *= -1;
            }
        }
    }

    private updateNextSegment(obj: Connector, current: OrthogonalSegment, next: OrthogonalSegment, tx: number, ty: number): void {
        next.points[0] = current.points[current.points.length - 1];
        if (next && next.type === 'Orthogonal') {
            if (next.length || next.length === 0) {
                if (next.direction === 'Left' || next.direction === 'Right') {
                    if (tx !== 0) {
                        next.length = (next.direction === 'Right') ? next.length - tx : next.length + tx;
                        if (next.length || next.length === 0) {
                            this.changeSegmentDirection(next, obj);
                        }
                    }
                } else {
                    if (ty !== 0) {
                        next.length = (next.direction === 'Bottom') ? next.length - ty : next.length + ty;
                        if (next.length || next.length === 0) {
                            this.changeSegmentDirection(next, obj);
                        }
                    }
                }
            }
        }
    }

    private updateFirstSegment(connector: ConnectorModel, selectedSegment: OrthogonalSegment): void {
        const index: number = connector.segments.indexOf(selectedSegment); let insertfirst: boolean = false;
        const current: OrthogonalSegment = connector.segments[index] as OrthogonalSegment;
        const prev: OrthogonalSegment = connector.segments[index - 1] as OrthogonalSegment;
        const con: Connector = connector as Connector; let sourcePoint: PointModel;
        const oldValues: Connector = { segments: connector.segments } as Connector;
        if (prev.length < 0 && connector.sourceID) {
            const sourceNode: Corners = (connector as Connector).sourceWrapper.corners;
            const segments: OrthogonalSegmentModel[] = []; let segValues: Object; let removeCurrentPrev: boolean = false;
            this.changeSegmentDirection(current, connector);
            const next: OrthogonalSegment = connector.segments[index + 1] as OrthogonalSegment;
            const nextNext: OrthogonalSegment = connector.segments[index + 2] as OrthogonalSegment;
            if (next) {
                this.changeSegmentDirection(next, connector);
            }
            if (nextNext) {
                this.changeSegmentDirection(nextNext, connector);
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
            this.changeSegmentDirection(prev, connector);
            this.changeSegmentDirection(current, connector);
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
            this.commandHandler.updateEndPoint(connector as Connector, oldValues);
        }
    }

    private updateLastSegment(connector: Connector, selectedSegment: OrthogonalSegment): boolean {

        if (connector.targetID && connector.targetPortID === '') {
            let line1Start: PointModel; let line1End: PointModel; let line2Start: PointModel; let line2End: PointModel;
            const corners: Corners = connector.targetWrapper.corners;
            const firstSegPoint: PointModel = selectedSegment.points[0];
            const lastSegPoint: PointModel = selectedSegment.points[selectedSegment.points.length - 1];

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
            const line1: Segment = { x1: line1Start.x, y1: line1Start.y, x2: line1End.x, y2: line1End.y };
            const line2: Segment = { x1: line2Start.x, y1: line2Start.y, x2: line2End.x, y2: line2End.y };
            return (intersect3(line1, line2).enabled);
        }
        return false;
    }

    /**
     *To destroy the module
     *
     * @returns {void} To destroy the module
     */

    public destroy(): void {
        /**
         * Destroys the connector editing module
         */
    }

    /**
     * Get module name.
     */
    /**
     * Get module name.\
     *
     * @returns {  string  }    Get module name.\
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'ConnectorEditingTool';
    }
}
