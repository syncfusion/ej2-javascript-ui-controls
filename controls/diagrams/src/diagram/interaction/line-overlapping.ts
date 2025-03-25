import { Diagram } from '../diagram';
import { Direction } from '../enum/enum';
import { Node } from '../objects/node';
import { Connector } from '../objects/connector';
import { OrthogonalSegmentModel } from '../objects/connector-model';
import { PointModel } from '../primitives/point-model';
import { getOppositeDirection } from '../utility/connector';
import { VirtualBoundaries } from './line-routing';

// Interface representing a line segment for the sweep line algorithm
interface ILineSegment {
    // The starting position of the segment, sorted for comparison
    sortedStart: number;
    // The ending position of the segment, sorted for comparison
    sortedEnd: number;
    // The main coordinate of the segment (x for vertical, y for horizontal)
    coordinate: number;
    // The direction of the segment (e.g., Top, Bottom, Left, Right)
    direction: Direction;
    // The event representing the start of the segment
    startEvent: SweepEvent;
    // The event representing the end of the segment
    endEvent: SweepEvent;
    // Method to update the coordinate of the segment by a given delta
    updateCoordinate(delta: number): void;
}

// Class representing a line segment
class LineSegment implements ILineSegment {
    public startPoint: PointModel;
    public endPoint: PointModel;
    public readonly previous?: ILineSegment;
    public next?: ILineSegment;
    public sortedStart: number;
    public sortedEnd: number;
    public coordinate: number;
    public direction: Direction;
    public readonly startEvent: SweepEvent;
    public readonly endEvent: SweepEvent;

    /**
     * Constructor to initialize a LineSegment.
     * @param {PointModel} start - The starting point of the line segment.
     * @param {PointModel} end - The ending point of the line segment.
     * @param {ILineSegment} [previousSegment] - The previous line segment in the sequence (optional).
     * @returns {ILineSegment} The newly created line segment.
     */
    constructor(start: PointModel, end: PointModel, previousSegment?: ILineSegment) {
        this.startPoint = start;
        this.endPoint = end;
        this.previous = previousSegment;

        // Link the previous segment to this one, if it exists
        if (previousSegment) {
            (previousSegment as LineSegment).next = this;
        }

        // Determine if the segment is vertical or horizontal
        const isVertical: boolean = start.x === end.x;
        this.coordinate = isVertical ? start.x : start.y;
        this.sortedStart = isVertical ? Math.min(start.y, end.y) : Math.min(start.x, end.x);
        this.sortedEnd = isVertical ? Math.max(start.y, end.y) : Math.max(start.x, end.x);
        this.direction = isVertical ? (start.y < end.y ? 'Bottom' : 'Top') : (start.x < end.x ? 'Right' : 'Left');

        // Create sweep events for the start and end of the segment
        this.startEvent = new SweepEvent(this, true);
        this.endEvent = new SweepEvent(this, false);
    }

    /**
     * Updates the coordinate of the line segment by a given delta.
     * @param {number} delta - The amount to adjust the coordinate by.
     * @returns {void}
     * @private
     */
    public updateCoordinate(delta: number): void {
        this.coordinate += delta;
        const isHorizontal: boolean = this.direction === 'Left' || this.direction === 'Right';

        // Calculate new start and end points based on the updated coordinate
        const newStartPoint: PointModel = isHorizontal
            ? { x: this.startPoint.x, y: this.coordinate }
            : { x: this.coordinate, y: this.startPoint.y };
        const newEndPoint: PointModel = isHorizontal
            ? { x: this.endPoint.x, y: this.coordinate }
            : { x: this.coordinate, y: this.endPoint.y };

        // Update the start point and adjust the previous segment if it exists
        this.startPoint = newStartPoint;
        if (this.previous) {
            (this.previous as LineSegment).adjustEnd(newStartPoint);
        }

        // Update the end point and adjust the next segment if it exists
        this.endPoint = newEndPoint;
        if (this.next) {
            (this.next as LineSegment).adjustStart(newEndPoint);
        }
    }

    /**
     * Adjusts the start point of the segment and updates sorted values.
     * @param {PointModel} point - The new start point.
     * @returns {void}
     */
    private adjustStart(point: PointModel): void {
        this.startPoint = point;
        this.updateSortedValues();
    }

    /**
     * Adjusts the end point of the segment and updates sorted values.
     * @param {PointModel} point - The new end point.
     * @returns {void}
     */
    private adjustEnd(point: PointModel): void {
        this.endPoint = point;
        this.updateSortedValues();
    }

    /**
     * Updates the sorted start and end values based on the current points.
     * @returns {void}
     */
    private updateSortedValues(): void {
        const isVertical: boolean = this.direction === 'Top' || this.direction === 'Bottom';
        this.sortedStart = isVertical ? Math.min(this.startPoint.y, this.endPoint.y) : Math.min(this.startPoint.x, this.endPoint.x);
        this.sortedEnd = isVertical ? Math.max(this.startPoint.y, this.endPoint.y) : Math.max(this.startPoint.x, this.endPoint.x);
        // Refresh the start and end events to reflect the updated sorted values
        this.startEvent.refresh();
        this.endEvent.refresh();
    }
}

// Interface for objects that can be compared
interface Comparable<T> {
    /**
     * Compares this object to another object of the same type.
     * @param other - The other object to compare to.
     * @returns a negative number if this object is less than the other,
     *          a positive number if greater, or 0 if equal.
     */
    compareTo(other: T): number;
}

// Class representing an event in the sweep line algorithm
class SweepEvent implements Comparable<SweepEvent> {
    public readonly segment: ILineSegment;
    public readonly isStart: boolean;
    public value: number;

    /**
     * Constructor to initialize a SweepEvent.
     * @param {ILineSegment} segment - The line segment associated with this event.
     * @param {boolean} isStart - Whether this event is the start of the segment.
     */
    constructor(segment: ILineSegment, isStart: boolean) {
        this.segment = segment;
        this.isStart = isStart;
        // Set the value based on whether this is a start or end event
        this.value = isStart ? segment.sortedStart : segment.sortedEnd;
    }

    /**
     * Refreshes the value of the event based on the segment's current sorted values.
     * @returns {void}
     */
    public refresh(): void {
        // Update the value to reflect the current position of the segment
        this.value = this.isStart ? this.segment.sortedStart : this.segment.sortedEnd;
    }

    /**
     * Compares this event to another event for sorting purposes.
     * @param {SweepEvent} other - The other event to compare to.
     * @returns {number} -1 if this event is less than the other, 1 if greater, 0 if equal.
     */
    public compareTo(other: SweepEvent): number {
        // Compare based on the value of the events
        if (this.value !== other.value) {
            return this.value < other.value ? -1 : 1;
        }
        // If values are equal, prioritize start events over end events
        return this.isStart ? -1 : other.isStart ? 1 : 0;
    }
}

// Class representing a segment tree used for efficient line segment intersection detection
class SegmentTree {
    // Maps to store horizontal and vertical branches of segments
    private readonly horizontalBranches: Map<number, Set<SweepEvent>> = new Map<number, Set<SweepEvent>>();
    private readonly verticalBranches: Map<number, Set<SweepEvent>> = new Map<number, Set<SweepEvent>>();

    /**
     * Adds a line segment to the segment tree.
     * @param {ILineSegment} segment - The line segment to add.
     * @returns {void}
     * @private
     */
    public addSegment(segment: ILineSegment): void {
        // Get the appropriate branches (horizontal or vertical) based on the segment's direction
        const branches: Map<number, Set<SweepEvent>> = this.getBranches(segment.direction);
        this.addSegmentToBranch(branches, segment);
    }

    /**
     * Adds a line segment to the appropriate branch (horizontal or vertical).
     * @param {Map<number, Set<SweepEvent>>} branches - The map of branches to add the segment to.
     * @param {ILineSegment} segment - The line segment to add.
     * @returns {void}
     */
    private addSegmentToBranch(branches: Map<number, Set<SweepEvent>>, segment: ILineSegment): void {
        // If the branch for the segment's coordinate does not exist, create it
        if (!branches.has(segment.coordinate)) {
            branches.set(segment.coordinate, new Set<SweepEvent>());
        }
        const branch: Set<SweepEvent> = branches.get(segment.coordinate);
        if (branch) {
            // Add the start and end events of the segment to the branch
            branch.add(segment.startEvent);
            branch.add(segment.endEvent);
        }
    }

    /**
     * Removes a line segment from the segment tree.
     * @param {ILineSegment} segment - The line segment to remove.
     * @returns {void}
     * @private
     */
    public removeSegment(segment: ILineSegment): void {
        // Get the appropriate branches (horizontal or vertical) based on the segment's direction
        const branches: Map<number, Set<SweepEvent>> = this.getBranches(segment.direction);
        this.removeSegmentFromBranch(branches, segment);
    }

    /**
     * Removes a line segment from the appropriate branch (horizontal or vertical).
     * @param {Map<number, Set<SweepEvent>>} branches - The map of branches to remove the segment from.
     * @param {ILineSegment} segment - The line segment to remove.
     * @returns {void}
     */
    private removeSegmentFromBranch(branches: Map<number, Set<SweepEvent>>, segment: ILineSegment): void {
        const branch: Set<SweepEvent> = branches.get(segment.coordinate);
        if (branch) {
            // Remove the start and end events of the segment from the branch
            branch.delete(segment.startEvent);
            branch.delete(segment.endEvent);
            // If the branch is empty after removal, delete the branch
            if (branch.size === 0) {
                branches.delete(segment.coordinate);
            }
        }
    }

    /**
     * Finds segments that overlap with the given segment.
     * @param {ILineSegment} segment - The line segment to check for overlaps.
     * @returns {ILineSegment[]} An array of overlapping line segments.
     * @private
     */
    public findOverlappingSegments(segment: ILineSegment): ILineSegment[] {
        // Get the appropriate branches (horizontal or vertical) based on the segment's direction
        const branches: Map<number, Set<SweepEvent>> = this.getBranches(segment.direction);
        return this.findOverlappingSegmentsInBranch(branches, segment);
    }

    /**
     * Finds overlapping segments within the appropriate branch.
     * @param {Map<number, Set<SweepEvent>>} branches - The map of branches to search for overlaps.
     * @param {ILineSegment} segment - The line segment to check for overlaps.
     * @returns {ILineSegment[]} An array of overlapping line segments.
     */
    private findOverlappingSegmentsInBranch(branches: Map<number, Set<SweepEvent>>, segment: ILineSegment): ILineSegment[] {
        const result: ILineSegment[] = [];
        const seenSegments: Set<ILineSegment> = new Set<ILineSegment>();
        const branch: Set<SweepEvent> = branches.get(segment.coordinate);
        if (branch) {
            const branchArray: SweepEvent[] = [];
            branch.forEach((item: SweepEvent) => branchArray.push(item));
            for (let i: number = 0; i < branchArray.length; i++) {
                const sweepEvent: SweepEvent = branchArray[parseInt(i.toString(), 10)];
                // Check if the segment overlaps with the current sweep event
                if (!(sweepEvent.segment.sortedStart < segment.sortedStart && sweepEvent.segment.sortedEnd > segment.sortedEnd)) {
                    if (sweepEvent.value < segment.sortedStart || sweepEvent.value > segment.sortedEnd) {
                        continue;
                    }
                }
                // Add the overlapping segment to the result if it hasn't been seen before
                if (sweepEvent.segment !== segment && !seenSegments.has(sweepEvent.segment)) {
                    seenSegments.add(sweepEvent.segment);
                    const maxStart: number = Math.max(segment.sortedStart, sweepEvent.segment.sortedStart);
                    const minEnd: number = Math.min(segment.sortedEnd, sweepEvent.segment.sortedEnd);
                    if (maxStart < minEnd) {
                        result.push(sweepEvent.segment);
                    }
                }
            }
        }
        return result;
    }

    /**
     * Gets the branches (horizontal or vertical) based on the segment's direction.
     * @param {Direction} direction - The direction of the segment.
     * @returns {Map<number, Set<SweepEvent>>} The map of branches.
     */
    private getBranches(direction: Direction): Map<number, Set<SweepEvent>> {
        // Return horizontal branches for left/right direction, vertical branches for top/bottom direction
        return direction === 'Left' || direction === 'Right' ? this.horizontalBranches : this.verticalBranches;
    }
}

// Class responsible for managing line segment overlaps and ensuring connectors do not visually overlap in a diagram.
export class AvoidLineOverlapping {
    // Constant defining the default spacing between connectors
    public static ConnectorSpacing: number = 5;

    // Constant defining the maximum number of times to re-route a connector to resolve overlaps
    public static maxReRouteLimit: number = 5;

    // Tree structure to manage and query line segments efficiently
    private readonly segmentTree: SegmentTree;

    // Mappings between connectors and their corresponding line segments
    private readonly segmentMappings: Map<Connector, Array<ILineSegment>>;

    // Reverse mappings between line segments and their corresponding connectors
    private readonly connectorMappings: Map<ILineSegment, Connector>;

    // Set of connectors that have been modified during overlap resolution
    private modifiedConnector: Set<Connector>;

    // Maps to track segments that have been modified and their original positions
    private modifiedSegments: Map<ILineSegment, number>;
    private currentSegments: Map<ILineSegment, number>;

    private requireReroute: boolean = false;
    private reRoutedCount: number = 0;
    private considerNonWalkable: VirtualBoundaries[] = [];
    private rootShiftingSegment: ILineSegment;

    private diagram: Diagram;

    constructor(parent?: Diagram) {
        this.diagram = parent;
        this.segmentTree = new SegmentTree();
        this.segmentMappings = new Map<Connector, Array<ILineSegment>>();
        this.connectorMappings = new Map<ILineSegment, Connector>();

        this.modifiedConnector = new Set<Connector>();
        this.modifiedSegments = new Map<ILineSegment, number>();
        this.currentSegments = new Map<ILineSegment, number>();
    }

    ///**
    // * Processes all connectors in the diagram to resolve line overlapping issues.
    // * @returns {void}
    // * @private
    // */
    //public refreshLineOverlapping(): void {
    //    if (this.diagram && this.diagram.lineRoutingModule) {
    //        if (this.diagram.connectors.length > 0) {
    //            this.diagram.connectors.forEach((connector: Connector) => {
    //                if (connector.type === 'Orthogonal' && connector.visible) {
    //                    this.addConnector(connector);
    //                }
    //            });

    //            this.refreshModifiedConnectors(this.diagram);
    //        }
    //    }
    //}

    /**
     * Gets the set of connectors that have been modified.
     * @returns {Set<Connector>} A set of modified connectors.
     * @private
     */
    public getModifiedConnector(): Set<Connector> {
        return this.modifiedConnector;
    }

    /**
     * Gets the modified segments of a given connector.
     * @param {Connector} connector - The connector to get the modified segments for.
     * @returns {OrthogonalSegmentModel[]} An array of orthogonal segment models representing the modified segments.
     * @private
     */
    public getModifiedConnectorSegments(connector: Connector): OrthogonalSegmentModel[] {
        // Retrieve the segments associated with the given connector
        const segments: ILineSegment[] = this.segmentMappings.get(connector);

        // Convert the segments to orthogonal segment models if they exist, otherwise return an empty array
        return this.convertSegmentsToOrthogonal(segments);
    }

    /**
     * Refreshes the modified connectors in the diagram.
     * @param {Diagram} diagram - The diagram instance containing the connectors.
     * @returns {void}
     * @private
     */
    public refreshModifiedConnectors(diagram: Diagram): void {
        // Iterate over each modified connector
        this.modifiedConnector.forEach((modifiedConnector: Connector) => {
            // Get the segments of the modified connector
            const segments: OrthogonalSegmentModel[] = this.getModifiedConnectorSegments(modifiedConnector);
            if (segments.length) {
                // Add the modified segments to the connector
                modifiedConnector.segments = segments;

                // Update the connector properties in the diagram
                diagram.connectorPropertyChange(
                    modifiedConnector,
                    {} as Connector,
                    { type: 'Orthogonal', segments: segments } as Connector
                );
            }
        });

        // Clear the modified connectors
        this.modifiedConnector.clear();
    }

    /**
     * Removes connectors and its associated segments from the internal mappings and segment tree.
     * @param {any} connectors - The connectors to remove.
     * @returns {void}
     * @private
     */
    public removeConnectors(connectors: any): void {
        for (let i: number = 0; i < connectors.length; i++) {
            const obj: any = connectors[parseInt(i.toString(), 10)];
            let connector: Connector;
            if (typeof obj === 'string') {
                connector = this.diagram.nameTable[obj as string];
            }
            else if (obj instanceof Connector) {
                connector = obj as Connector;
            }
            if (connector && connector.type === 'Orthogonal') {
                this.removeConnector(connector);
            }
        }
    }

    /**
     * Removes a connector and its associated segments from the internal mappings and segment tree.
     * @param {Connector} connector - The connector to remove.
     * @returns {void}
     * @private
     */
    public removeConnector(connector: Connector): void {
        // Retrieve the line segments associated with the connector
        const segments: ILineSegment[] = this.segmentMappings.get(connector)!;
        if (segments) {
            // Remove each line segment from the segment tree and delete its mapping
            segments.forEach((segment: ILineSegment) => {
                this.segmentTree.removeSegment(segment);
                this.connectorMappings.delete(segment);
            });
        }

        // Remove the mapping between the connector and its segments
        this.segmentMappings.delete(connector);
    }

    /**
     * Adds a connector and processes it to remove overlapping lines in its segments.
     * @param {Connector} connector - The connector to process.
     * @param {PointModel[]} points - The points to adjust (optional).
     * @param {OrthogonalSegmentModel[]} segments - The segments to adjust (optional).
     * @returns {void} The adjusted segments.
     * @private
     */
    public addConnector(connector: Connector, points: PointModel[] = [], segments: OrthogonalSegmentModel[] = []): void {
        if (this.diagram.lineDistributionModule) {
            return;
        }
        // Generate points based on the provided segments or use the connector's intermediate points
        // Needed in case of without using line routing
        // if (!points.length) {
        //     points = segments.length ? this.generatePoints(connector, segments) : connector.intermediatePoints;
        // }
        if (points.length === 0) {
            points = connector.intermediatePoints;
        }

        // Remove the connector from the current mappings
        this.removeConnector(connector);

        // Create line segments from the points
        const lineSegments: ILineSegment[] = this.createLineSegments(points);

        // Map the segments to the connector
        this.mapSegmentsToConnector(connector, lineSegments);

        // If there are more than 3 points, process the connector to remove overlapping
        if (points.length > 3) {
            // Adjust the connector to resolve overlaps in the segments
            this.adjustConnector(connector);
        } else {
            const overlappingConnectors: Set<Connector> = new Set<Connector>();
            for (const lineSegment of lineSegments) {
                // Find overlapping segments of current connector
                const overlappingsegments: ILineSegment[] = this.segmentTree.findOverlappingSegments(lineSegment);
                for (const overlappingSegment of overlappingsegments) {
                    // Fetch overlapping connector
                    const overlappingConnector: Connector = this.connectorMappings.get(overlappingSegment);
                    // Add overlapping connector to the set
                    overlappingConnectors.add(overlappingConnector);
                }
            }

            // Adjust the overlapping connector to resolve overlaps in the segments
            overlappingConnectors.forEach((overlappingConnector: Connector) => this.adjustConnector(overlappingConnector));
        }
    }

    // Needed in case of without using line routing
    // /**
    //  * Generates points based on the connector and segments.
    //  * @param {Connector} connector - The connector to process.
    //  * @param {OrthogonalSegmentModel[]} segments - The segments to adjust.
    //  * @returns {PointModel[]} An array of points representing the connector's path.
    //  */
    // private generatePoints(connector: Connector, segments: OrthogonalSegmentModel[]): PointModel[] {
    //     const points: PointModel[] = [];
    //     let currentPoint: PointModel = connector.sourcePoint;
    //     points.push(currentPoint);

    //     // Iterate through each segment to generate the corresponding points
    //     segments.forEach((segment: OrthogonalSegmentModel) => {
    //         const newPoint: PointModel = { x: currentPoint.x, y: currentPoint.y };
    //         switch (segment.direction) {
    //         case 'Left':
    //             newPoint.x -= segment.length;
    //             break;
    //         case 'Right':
    //             newPoint.x += segment.length;
    //             break;
    //         case 'Top':
    //             newPoint.y -= segment.length;
    //             break;
    //         case 'Bottom':
    //             newPoint.y += segment.length;
    //             break;
    //         }
    //         points.push(newPoint);
    //         currentPoint = newPoint;
    //     });

    //     return points;
    // }

    /**
     * Creates line segments from the given points.
     * @param {PointModel[]} points - The points to create segments from.
     * @returns {ILineSegment[]} An array of line segments.
     */
    private createLineSegments(points: PointModel[]): ILineSegment[] {
        const lineSegments: ILineSegment[] = [];

        // Iterate through the points to create line segments
        for (let i: number = 0; i < points.length - 1; i++) {
            // Create a new line segment from the current point to the next point
            const segment: LineSegment = new LineSegment(points[parseInt(i.toString(), 10)], points[parseInt((i + 1).toString(), 10)],
                                                         i === 0 ? null : lineSegments[parseInt((i - 1).toString(), 10)]);
            lineSegments.push(segment);
        }

        return lineSegments;
    }

    /**
     * Maps line segments to the given connector.
     * @param {Connector} connector - The connector to map segments to.
     * @param {ILineSegment[]} lineSegments - The line segments to map.
     * @returns {void}
     */
    private mapSegmentsToConnector(connector: Connector, lineSegments: ILineSegment[]): void {
        // Store the mapping of segments to the connector
        this.segmentMappings.set(connector, lineSegments);

        // Add each segment to the segment tree and update connector mappings
        lineSegments.forEach((lineSegment: ILineSegment) => {
            this.segmentTree.addSegment(lineSegment);
            if (!this.connectorMappings.has(lineSegment)) {
                this.connectorMappings.set(lineSegment, connector);
            }
        });
    }

    /**
     * Converts line segments to orthogonal segments.
     * @param {ILineSegment[]} lineSegments - The line segments to convert.
     * @returns {OrthogonalSegmentModel[]} An array of orthogonal segments.
     */
    private convertSegmentsToOrthogonal(lineSegments: ILineSegment[]): OrthogonalSegmentModel[] {
        const modifiedSegments: OrthogonalSegmentModel[] = [];

        if (lineSegments) {
            // Iterate through each line segment to create corresponding orthogonal segments
            lineSegments.forEach((lineSegment: ILineSegment) => {
                const orthogonalSegment: OrthogonalSegmentModel = {
                    type: 'Orthogonal',
                    direction: lineSegment.direction,
                    length: Math.abs(lineSegment.sortedEnd - lineSegment.sortedStart)
                };
                modifiedSegments.push(orthogonalSegment);
            });
        }

        return modifiedSegments;
    }

    /**
     * Adjusts the connector to resolve overlapping segments.
     * @param {Connector} connector - The connector to adjust.
     * @returns {void}
     */
    public adjustConnector(connector: Connector): void {
        this.requireReroute = false;
        // Retrieve the line segments associated with the connector
        const segments: ILineSegment[] = this.segmentMappings.get(connector)!;
        if (segments.length > 2) {
            const firstSegment: LineSegment = segments[0] as LineSegment;
            const sourceNode: Node = this.diagram.nameTable[connector.sourceID];
            if (sourceNode && sourceNode.outEdges.length > 0) {
                let refLineSegment: LineSegment | undefined;
                for (let j: number = 0; j < sourceNode.outEdges.length; j++) {
                    const outConnector: Connector = this.diagram.nameTable[sourceNode.outEdges[parseInt(j.toString(), 10)]];
                    if (outConnector === connector) {
                        continue;
                    }
                    const refSegments: ILineSegment[] = this.segmentMappings.get(outConnector);
                    if (refSegments && refSegments.length > 2) {
                        const refFirstSegment: LineSegment = refSegments[0] as LineSegment;
                        if (refFirstSegment.direction === firstSegment.direction &&
                            refFirstSegment.next.direction === firstSegment.next.direction) {
                            if (!refLineSegment) {
                                refLineSegment = refFirstSegment;
                            } else if (Math.abs(firstSegment.coordinate - refFirstSegment.coordinate) <
                                       Math.abs(firstSegment.coordinate - refLineSegment.coordinate)) {
                                refLineSegment = refFirstSegment;
                            }
                        }
                    }
                }

                if (refLineSegment) {
                    const shiftDelta: number = refLineSegment.next.coordinate - firstSegment.next.coordinate;
                    if (shiftDelta) {
                        const superNext: ILineSegment = (firstSegment.next as LineSegment).next;
                        let canShift: boolean = firstSegment.direction !== superNext.direction;
                        if (firstSegment.direction === superNext.direction) {
                            const maximumShift: number = this.calculateMaximumSegmentShift(firstSegment, superNext, superNext.direction);
                            canShift = Math.abs(shiftDelta) <= maximumShift;
                        }
                        if (canShift) {
                            this.modifiedSegments.clear();
                            this.segmentTree.removeSegment(firstSegment.next);
                            firstSegment.next.updateCoordinate(shiftDelta);
                            this.segmentTree.addSegment(firstSegment.next);
                            this.modifiedSegments.set(firstSegment.next, firstSegment.next.coordinate);
                            this.modifiedConnector.add(connector);
                        }
                    }
                }
            }
        }

        let failedSegment: LineSegment = undefined;
        // Iterate through each segment to check for overlaps
        for (let i: number = 0; i < segments.length - 1; i++) {
            const segment: LineSegment = segments[parseInt(i.toString(), 10)] as LineSegment;
            if (segment.previous && segment.next) {
                // Find overlapping segments for this segment
                const overlappingSegments: ILineSegment[] = this.segmentTree.findOverlappingSegments(segment);
                if (overlappingSegments.length > 0) {
                    // Resolve any overlapping segments found
                    if (!this.resolveOverlappingSegments(segment, overlappingSegments)) {
                        if (this.requireReroute) {
                            failedSegment = segment;
                            break;
                        }
                    }
                }
            }
        }

        // If a failed segment is found and rerouting is required, attempt to reroute the connector
        if (failedSegment && this.diagram.lineRoutingModule) {
            if (this.reRoutedCount <= AvoidLineOverlapping.maxReRouteLimit) {
                // Reset the walkable state of previously considered non-walkable grids
                while (this.considerNonWalkable.length > 0) {
                    const grid: VirtualBoundaries = this.considerNonWalkable.pop();
                    grid.walkable = true;
                }
                // Fetch the grids that intersect with the segment path
                const grids: VirtualBoundaries[] = this.diagram.lineRoutingModule
                    .getGridsIntersect(failedSegment.startPoint, failedSegment.endPoint);
                // Mark the grids in the segment path as non-walkable temporarily
                grids.forEach((grid: VirtualBoundaries) => {
                    grid.walkable = false;
                    this.considerNonWalkable.push(grid);
                });
                this.reRoutedCount++;
                // Refresh the connector segments to attempt rerouting
                this.diagram.lineRoutingModule.refreshConnectorSegments(this.diagram, connector, false);
            }
        }

        // Reset the rerouted count and restore the walkable state of grids
        this.reRoutedCount = 0;
        while (this.considerNonWalkable.length > 0) {
            const grid: VirtualBoundaries = this.considerNonWalkable.pop();
            grid.walkable = true;
        }
    }

    /**
     * Resolves overlapping segments by adjusting their positions.
     * @param {ILineSegment} segment - The segment to adjust.
     * @param {ILineSegment[]} overlappingSegments - The overlapping segments to resolve.
     * @returns {boolean} whether the shifted segments get resolved with overlapping segment in finding a free coordinate
     */
    private resolveOverlappingSegments(segment: ILineSegment, overlappingSegments: ILineSegment[]): boolean {
        // Clear maps to track modified and current segments
        this.modifiedSegments.clear();
        this.currentSegments.clear();
        this.rootShiftingSegment = segment;

        const adjustSelfFirst: boolean = this.shouldAdjustSelfFirst(segment, overlappingSegments);

        // Get the first overlapping segment
        const overlapSegment: LineSegment = overlappingSegments[0] as LineSegment;

        // Calculate the direction to shift the segment
        let shiftDirection: Direction = adjustSelfFirst
            ? this.calculateShiftDirection(segment, overlappingSegments)
            : this.calculateShiftDirection(overlapSegment, this.segmentTree.findOverlappingSegments(overlapSegment));
        let shifted: boolean = false;
        if (adjustSelfFirst) {
            const secondarySegment: LineSegment = overlappingSegments.length === 1 ? overlapSegment : undefined;
            // Adjust the segment in calculated direction
            shifted = this.attemptAdjustment(segment, shiftDirection, secondarySegment);
            if (!shifted) {
                // Adjust the segment in the opposite direction
                shiftDirection = getOppositeDirection(shiftDirection) as Direction;
                shifted = this.attemptAdjustment(segment, shiftDirection, secondarySegment, true);
            }
        } else {
            // Adjust the segment in calculated direction
            shifted = this.attemptAdjustment(overlapSegment, shiftDirection, segment);
            if (!shifted) {
                // Adjust the segment in the opposite direction
                shiftDirection = getOppositeDirection(shiftDirection) as Direction;
                shifted = this.attemptAdjustment(overlapSegment, shiftDirection, segment, true);
            }
        }

        // Update the segment tree with the modified segments
        this.updateSegmentTreeWithModifiedSegments();
        this.rootShiftingSegment = undefined;
        return shifted;
    }

    /**
     * Determines whether the current segment should be adjusted before its overlapping segment.
     * @param {ILineSegment } segment - The current segment.
     * @param {ILineSegment[]} overlappingSegments - The list of overlapping segments.
     * @returns {boolean} True if the current segment should be adjusted first, otherwise false.
     */
    private shouldAdjustSelfFirst(segment: ILineSegment, overlappingSegments: ILineSegment[]): boolean {
        let adjustSelfFirst: boolean = overlappingSegments.length > 1;

        // Determine if the current segment should be adjusted first
        if (overlappingSegments.length === 1) {
            // Get the first overlapping segment
            const overlapSegment: LineSegment = overlappingSegments[0] as LineSegment;
            if (overlapSegment.previous && overlapSegment.next) {
                const maxStart: number = Math.max(segment.sortedStart, overlapSegment.sortedStart);
                const minEnd: number = Math.min(segment.sortedEnd, overlapSegment.sortedEnd);
                const currentRatio: number = (minEnd - maxStart) / (segment.sortedEnd - segment.sortedStart);
                const overlapRatio: number = (minEnd - maxStart) / (overlapSegment.sortedEnd - overlapSegment.sortedStart);
                if (currentRatio >= overlapRatio) {
                    adjustSelfFirst = true;
                }
            }
            else {
                adjustSelfFirst = true;
            }
        }

        return adjustSelfFirst;
    }

    /**
     * Attempts to adjust the primary segment and optionally a secondary segment to resolve overlaps.
     * @param {ILineSegment} primarySegment - The primary line segment to adjust.
     * @param {Direction} shiftDirection - The direction to shift the primary segment.
     * @param {ILineSegment} secondarySegment - The secondary line segment to adjust in the opposite direction (optional).
     * @param {boolean} isOppositeShifting - Enabled when shifting segment in opposite direction.
     * @returns {boolean} True if any segment was adjusted, otherwise false.
     */
    private attemptAdjustment(primarySegment: ILineSegment, shiftDirection: Direction, secondarySegment: ILineSegment,
                              isOppositeShifting: boolean = false): boolean {
        // Adjust the primary segment first in shift direction
        let isShifted: boolean = this.adjustSegment(primarySegment, shiftDirection, isOppositeShifting);
        this.updateModifiedSegments(isShifted);
        if (!isShifted) {
            if (secondarySegment && (secondarySegment as LineSegment).previous && (secondarySegment as LineSegment).next) {
                // Adjust the secondary segment in the opposite direction
                shiftDirection = getOppositeDirection(shiftDirection) as Direction;
                isShifted = this.adjustSegment(secondarySegment, shiftDirection, isOppositeShifting);
                this.updateModifiedSegments(isShifted);
            }
        }

        return isShifted;
    }

    ///**
    // * Gets dependent segments based on a reference segment and a map of segments.
    // * @param {ILineSegment} segment - The reference segment.
    // * @param {Map<ILineSegment, number>} segmentMap - The map of segments.
    // * @returns {ILineSegment[]} An array of dependent segments.
    // */
    //private getDependentSegments(segment: ILineSegment, segmentMap: Map<ILineSegment, number>): ILineSegment[] {
    //    const dependentSegments: ILineSegment[] = [];
    //    segmentMap.forEach((newCoordinate: number, dependentSegment: ILineSegment) => {
    //        if (dependentSegment !== segment) { dependentSegments.push(dependentSegment); }
    //    });

    //    return dependentSegments;
    //}

    /**
     * Updates the modified segments by adjusting their coordinates and re-adding them to the segment tree.
     * @param {boolean} resetModifiedSegments - Indicates if the segments have been shifted.
     * @returns {void}
     */
    private updateModifiedSegments(resetModifiedSegments: boolean): void {
        if (resetModifiedSegments) { this.modifiedSegments.clear(); }

        // Update each current segment's coordinate and re-add it to the segment tree
        this.currentSegments.forEach((oldCoordinate: number, currentSegment: ILineSegment) => {
            if (resetModifiedSegments) {
                this.modifiedSegments.set(currentSegment, currentSegment.coordinate);
            }
            this.segmentTree.removeSegment(currentSegment);
            currentSegment.updateCoordinate(oldCoordinate - currentSegment.coordinate);
            this.segmentTree.addSegment(currentSegment);
        });

        // Clear the current segments
        this.currentSegments.clear();
    }

    /**
     * Updates the segment tree with the modified segments.
     * Removes the old segments and adds the new segments with their updated positions.
     * @returns {void}
     */
    private updateSegmentTreeWithModifiedSegments(): void {
        if (this.modifiedSegments.size > 0) {
            this.modifiedSegments.forEach((newCoordinate: number, modifiedSegment: ILineSegment) => {
                // Update the segment tree with shifted segments
                this.segmentTree.removeSegment(modifiedSegment);
                modifiedSegment.updateCoordinate(newCoordinate - modifiedSegment.coordinate);
                this.segmentTree.addSegment(modifiedSegment);

                // Add the connector to the set of modified connectors
                const connector: Connector = this.connectorMappings.get(modifiedSegment)!;
                if (!this.modifiedConnector.has(connector)) {
                    this.modifiedConnector.add(connector);
                }
            });
        }
    }

    /**
     * Resolves overlapping segments in a given direction.
     * @param {ILineSegment} segment - The line segment to resolve overlaps for.
     * @param {ILineSegment[]} overlappingSegments - The list of overlapping segments.
     * @param {Direction} shiftDirection - The direction to shift the segment.
     * @param {boolean} isOppositeShifting - Enabled when tried to shift secondary segment in opposite direction
     * @param {boolean} adjustOverlapsOnly - Enabled only when overlapping segments need to be adjusted.
     * @returns {boolean} True if the segment was adjusted, otherwise false.
     */
    private resolveOverlappingAtGivenDirection(segment: ILineSegment, overlappingSegments: ILineSegment[], shiftDirection: Direction,
                                               isOppositeShifting: boolean, adjustOverlapsOnly: boolean): boolean {
        if (adjustOverlapsOnly) {
            let isShifted: boolean = false;
            for (const overlapSegment of overlappingSegments) {
                if ((overlapSegment as LineSegment).previous && (overlapSegment as LineSegment).next) {
                    isShifted = this.adjustSegment(overlapSegment, shiftDirection, isOppositeShifting, adjustOverlapsOnly);
                    if (!isShifted) {
                        return false;
                    }
                }
            }
            return isShifted;
        }

        let segmentToShift: ILineSegment = segment;
        if (overlappingSegments.length === 1) {
            const adjustSelfFirst: boolean = this.shouldAdjustSelfFirst(segment, overlappingSegments);
            const overlapSegment: LineSegment = overlappingSegments[0] as LineSegment;
            let directionToShift: Direction = adjustSelfFirst
                ? this.calculateShiftDirection(segment, overlappingSegments)
                : this.calculateShiftDirection(overlapSegment, this.segmentTree.findOverlappingSegments(overlapSegment));
            if (isOppositeShifting) {
                directionToShift = getOppositeDirection(directionToShift) as Direction;
            }
            if (adjustSelfFirst) {
                segmentToShift = directionToShift === shiftDirection ? segment : overlapSegment;
            }
            else {
                segmentToShift = directionToShift === shiftDirection ? overlapSegment : segment;
            }

            if (segmentToShift === overlapSegment && (!overlapSegment.previous || !overlapSegment.next)) {
                segmentToShift = segment;
            }
        }

        // Adjust the segment or the overlapping segment based on the direction
        return this.adjustSegment(segmentToShift, shiftDirection, isOppositeShifting);
    }

    /**
     * Calculates the direction to shift a line segment to resolve overlaps.
     * @param {ILineSegment} lineSegment - The line segment to calculate the shift direction for.
     * @param {ILineSegment[]} overlappingSegments - The list of overlapping segments.
     * @returns {Direction} The direction to shift the segment.
     */
    private calculateShiftDirection(lineSegment: ILineSegment, overlappingSegments: ILineSegment[]): Direction {
        const overlapSegment: LineSegment = overlappingSegments[0] as LineSegment;
        const segment: LineSegment = lineSegment as LineSegment;
        const previousSegment: ILineSegment = segment.previous;
        const nextSegment: ILineSegment = segment.next;
        const nonSortedStart: number = segment.direction === 'Left' || segment.direction === 'Right' ? segment.startPoint.x : segment.startPoint.y;
        const nonSortedEnd: number = segment.direction === 'Left' || segment.direction === 'Right' ? segment.endPoint.x : segment.endPoint.y;
        let shiftDirection: Direction = segment.direction;

        // Determine the shift direction based on the previous and next segments
        if (previousSegment.direction === nextSegment.direction) {
            const overlapsPrevious: ILineSegment = overlapSegment.previous;
            const overlapsNext: ILineSegment = overlapSegment.next;
            let isStartCovered: boolean = overlapSegment.sortedStart <= nonSortedStart && nonSortedStart <= overlapSegment.sortedEnd;
            let isEndCovered: boolean = overlapSegment.sortedStart <= nonSortedEnd && nonSortedEnd <= overlapSegment.sortedEnd;

            // Determine if the start or end of the segment is covered by the overlap
            if (isStartCovered && isEndCovered) {
                let nonSortedStart1: number = overlapSegment.direction === 'Left' || overlapSegment.direction === 'Right' ? overlapSegment.startPoint.x : overlapSegment.startPoint.y;
                let nonSortedEnd1: number = overlapSegment.direction === 'Left' || overlapSegment.direction === 'Right' ? overlapSegment.endPoint.x : overlapSegment.endPoint.y;
                if (segment.direction !== overlapSegment.direction) {
                    const temp: number = nonSortedStart1;
                    nonSortedStart1 = nonSortedEnd1;
                    nonSortedEnd1 = temp;
                }

                const startDistance: number = Math.abs(nonSortedStart - nonSortedStart1);
                const endDistance: number = Math.abs(nonSortedEnd - nonSortedEnd1);
                if (startDistance >= endDistance) {
                    isEndCovered = false;
                }
                else {
                    if ((nextSegment as LineSegment).next && segment.direction === (nextSegment as LineSegment).next.direction &&
                        this.segmentTree.findOverlappingSegments(nextSegment).length !== 0) {
                        isEndCovered = false;
                    }
                    else {
                        isStartCovered = false;
                    }
                }
            }

            // Determine the shift direction based on the overlap and segment directions
            if (isStartCovered) {
                if (segment.direction === overlapSegment.direction && overlapsNext) {
                    shiftDirection = getOppositeDirection(overlapsNext.direction) as Direction;
                } else if (segment.direction !== overlapSegment.direction && overlapsPrevious) {
                    //shiftDirection = overlapsPrevious.direction;
                    shiftDirection = getOppositeDirection(overlapsPrevious.direction) as Direction;
                } else {
                    shiftDirection = getOppositeDirection(previousSegment.direction) as Direction;
                }
            } else if (isEndCovered) {
                if (segment.direction === overlapSegment.direction && overlapsPrevious) {
                    shiftDirection = overlapsPrevious.direction;
                } else if (segment.direction !== overlapSegment.direction && overlapsNext) {
                    shiftDirection = getOppositeDirection(overlapsNext.direction) as Direction;
                } else {
                    shiftDirection = getOppositeDirection(previousSegment.direction) as Direction;
                }
            } else {
                shiftDirection = nextSegment.direction;
            }
        } else {
            if (!overlapSegment.previous || !overlapSegment.next ||
                overlapSegment.previous.direction === overlapSegment.next.direction) {
                shiftDirection = nextSegment.direction;
            }
            else {
                const maxStart: number = Math.max(segment.sortedStart, overlapSegment.sortedStart);
                const minEnd: number = Math.min(segment.sortedEnd, overlapSegment.sortedEnd);
                const currentRatio: number = (minEnd - maxStart) / (segment.sortedEnd - segment.sortedStart);
                const overlapRatio: number = (minEnd - maxStart) / (overlapSegment.sortedEnd - overlapSegment.sortedStart);
                shiftDirection = currentRatio >= overlapRatio ? nextSegment.direction : previousSegment.direction;
            }
        }

        return shiftDirection;
    }

    /**
     * Adjusts a segment by shifting it in a given direction.
     * @param {ILineSegment} segment - The segment to adjust.
     * @param {Direction} directionToShift - The direction to shift the segment.
     * @param {boolean} isOppositeShifting - Enabled when shifting secondary segment in opposite direction.
     * @param {boolean} adjustOverlapsOnly - Enabled only when overlapping segments need to be adjusted.
     * @returns {boolean} True if the segment was adjusted, false otherwise.
     */
    private adjustSegment(segment: ILineSegment, directionToShift: Direction, isOppositeShifting: boolean,
                          adjustOverlapsOnly: boolean = false): boolean {
        const currentCoord: number = segment.coordinate;
        const previousSegment: ILineSegment = (segment as LineSegment).previous;
        const nextSegment: ILineSegment = (segment as LineSegment).next;

        // Calculate the maximum allowed shift for the segment
        const maximumAllowedShift: number = this.calculateMaximumSegmentShift(previousSegment, nextSegment, directionToShift);

        // Determine the shift delta based on the direction
        const directionMultiplier: number = directionToShift === 'Right' || directionToShift === 'Bottom' ? 1 : -1;
        const shiftDelta: number = directionMultiplier * AvoidLineOverlapping.ConnectorSpacing;

        // Adjust the segment if the shift delta is within the allowed range
        if (Math.abs(shiftDelta) <= maximumAllowedShift) {
            this.segmentTree.removeSegment(segment);
            segment.updateCoordinate(shiftDelta);
            this.segmentTree.addSegment(segment);
            // Store the segment's initial routed coordinate.
            if (!this.currentSegments.has(segment)) {
                this.currentSegments.set(segment, currentCoord);
            }

            if (this.diagram.lineRoutingModule) {
                // Check if the shifted segment overlaps with a node.
                const startPoint: PointModel = (segment as LineSegment).startPoint;
                const endPoint: PointModel = (segment as LineSegment).endPoint;
                if (!this.diagram.lineRoutingModule.isPathWalkable(startPoint, endPoint, this.diagram)) {
                    if (!adjustOverlapsOnly && segment === this.rootShiftingSegment) {
                        this.segmentTree.removeSegment(segment);
                        segment.updateCoordinate(shiftDelta * -1);
                        this.segmentTree.addSegment(segment);
                        const overlappingSegments: ILineSegment[] = this.segmentTree.findOverlappingSegments(segment);
                        if (overlappingSegments.length !== 0) {
                            const oppositeDirection: Direction = getOppositeDirection(directionToShift) as Direction;
                            return this.resolveOverlappingAtGivenDirection(segment, overlappingSegments,
                                                                           oppositeDirection, isOppositeShifting, true);
                        }
                    }

                    this.requireReroute = true;
                    return false;
                }
            }

            const overlappingSegments: ILineSegment[] = this.segmentTree.findOverlappingSegments(segment);
            if (overlappingSegments.length !== 0) {
                if (this.modifiedSegments.size !== 0 && this.modifiedSegments.size > (this.currentSegments.size + 1)) {
                    return false;
                }
                return this.resolveOverlappingAtGivenDirection(segment, overlappingSegments,
                                                               directionToShift, isOppositeShifting, adjustOverlapsOnly);
            }
        }
        else if (!adjustOverlapsOnly && segment === this.rootShiftingSegment) {
            const overlappingSegments: ILineSegment[] = this.segmentTree.findOverlappingSegments(segment);
            if (overlappingSegments.length !== 0) {
                const oppositeDirection: Direction = getOppositeDirection(directionToShift) as Direction;
                return this.resolveOverlappingAtGivenDirection(segment, overlappingSegments, oppositeDirection, isOppositeShifting, true);
            }
        }

        return segment.coordinate !== currentCoord;
    }

    /**
     * Calculates the maximum allowed shift for segments.
     * @param {ILineSegment} previousSegment - The previous segment.
     * @param {ILineSegment} nextSegment - The next segment.
     * @param {Direction} directionToShift - The direction to shift the segment.
     * @returns {number} The maximum allowed shift.
     */
    private calculateMaximumSegmentShift(previousSegment: ILineSegment, nextSegment: ILineSegment, directionToShift: Direction): number {
        // Calculate the lengths of the previous and next segments
        let previousLength: number = Math.abs(previousSegment.sortedEnd - previousSegment.sortedStart);
        let nextLength: number = Math.abs(nextSegment.sortedEnd - nextSegment.sortedStart);

        const connector: Connector = this.connectorMappings.get(previousSegment);
        if (connector) {
            if (!(previousSegment as LineSegment).previous) {
                let sourceDecoratorLength: number = 5;
                if (connector.sourceDecorator.shape !== 'None') {
                    sourceDecoratorLength = Math.max(connector.sourceDecorator.width, connector.sourceDecorator.height);
                }

                previousLength -= sourceDecoratorLength + 5;
            }
            if (!(nextSegment as LineSegment).next) {
                let targetDecoratorLength: number = 5;
                if (connector.targetDecorator.shape !== 'None') {
                    targetDecoratorLength = Math.max(connector.targetDecorator.width, connector.targetDecorator.height);
                }

                nextLength -= targetDecoratorLength + 5;
            }
        }

        if (previousSegment.direction === nextSegment.direction) {
            return directionToShift === nextSegment.direction ? nextLength : previousLength;
        }
        else {
            return directionToShift === nextSegment.direction ? Math.min(previousLength, nextLength) : Number.MAX_VALUE;
        }
    }

    /**
     *To destroy the line overlapping
     *
     * @returns {void} To destroy the line overlapping
     */
    public destroy(): void {
        /**
         * Destroys the line overlapping module
         */
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string}  Core method to return the component name.
     * @private
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'AvoidLineOverlapping';
    }
}
