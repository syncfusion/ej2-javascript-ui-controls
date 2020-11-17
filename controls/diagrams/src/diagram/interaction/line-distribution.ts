import { Diagram } from '../diagram';
import { ConnectorModel } from '../objects/connector-model';
import { Connector, OrthogonalSegment } from '../objects/connector';
import { PointModel } from '../primitives/point-model';
import { NodeModel } from '../objects/node-model';
import { Node } from '../objects/node';
import { Rect } from '../primitives/rect';
import { Direction } from '../enum/enum';
import { findDistance, findPort, intersect2 } from '../utility/diagram-util';
import { randomId } from '../utility/base-util';
import { DiagramElement } from '../core/elements/diagram-element';
import { Layout, INode } from '../layout/layout-base';
import { MatrixModelObject, Vertex, IVertex, IEdge, LayoutProp, MatrixObject } from '../layout/complex-hierarchical-tree';
import { Point } from '../primitives/point';
import { PointPortModel } from '../objects/port-model';
import { Port, PointPort } from '../objects/port';


/**
 * Line Distribution
 * @private
 */

export class LineDistribution {
    /** @private */
    public edgeMapper: EdgeMapperObject[];
    /**
     * Constructor for the line distribution module
     * @private
     */

    constructor() {
        //constructs the line distribution module
    }

    /**
     * To destroy the line distribution module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the line distribution module
         */
    }

    /**
     * Get the diagram instance.
     */
    private diagram: Diagram;

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'LineDistribution';
    }


    /** @private */
    public initLineDistribution(graph: Layout, diagram: Diagram): void {
        let srcDirection: string = 'Bottom';
        this.diagram = diagram;
        if (diagram.layout.connectionPointOrigin === 'DifferentPoint') {
            let tarDirection: string = 'Top';

            if (graph.orientation === 'BottomToTop') {
                srcDirection = 'Top';
                tarDirection = 'Bottom';
            } else if (graph.orientation === 'RightToLeft') {
                srcDirection = 'Left';
                tarDirection = 'Right';
            } else if (graph.orientation === 'LeftToRight') {
                srcDirection = 'Right';
                tarDirection = 'Left';
            }
            let graphnodes: NodeModel[] = diagram.nodes;
            if (graphnodes.length > 0) {
                for (let i: number = 0; i < graphnodes.length; i++) {
                    let node: Node = diagram.nameTable[graphnodes[i].id];
                    this.addDynamicPortandDistrrbuteLine(graph, node, srcDirection, tarDirection, diagram);
                }
            }
        }
    }

    private getConnectorDirection(src: PointModel, tar: PointModel): string {
        if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
            return src.x < tar.x ? 'Right' : 'Left';
        } else {
            return src.y < tar.y ? 'Bottom' : 'Top';
        }
    }
    private ObstacleSegment(options: ObstacleSegmentValues): ObstacleSegmentValues {
        options.direction = this.getConnectorDirection(options.startpt, options.endpt);
        options.distance = Point.findLength(options.startpt, options.endpt);
        options.orientation = options.direction === 'Left' || options.direction === 'Right' ? 'horizontal' : 'vertical';
        options.id = options.id;
        if (options.orientation === 'horizontal') {
            options.coord = options.startpt.y;
            if (options.direction === 'Left') {
                options.start = options.endpt.x;
                options.end = options.startpt.x;
            } else {
                options.start = options.startpt.x;
                options.end = options.endpt.x;
            }
        } else {
            options.coord = options.startpt.x;
            if (options.direction === 'Top') {
                options.start = options.endpt.y;
                options.end = options.startpt.y;
            } else {
                options.start = options.startpt.y;
                options.end = options.endpt.y;
            }
        }
        return options;
    }

    /** @private */
    public distributeLines(layout: Layout, diagram: Diagram): void {
        let isHorizontal: boolean = layout.orientation === 'LeftToRight'
            || layout.orientation === 'RightToLeft';
        let inversespacing: number = !isHorizontal ? layout.verticalSpacing : layout.horizontalSpacing;
        let srcdecoratorSize: number = 8.0;
        let obstacleCollection: string = 'obstaclePointCollection';
        let tardecoratorSize: number = 10.0;
        let avaibaleSpace: number = inversespacing - srcdecoratorSize - tardecoratorSize;
        let graph: GraphObject[] = [];
        let connectorObstacles: ConnectorObstacle[] = [];
        let globalConnectors: ConnectorModel[] = diagram.connectors;
        for (let i: number = 0; i < globalConnectors.length; i++) {
            let connector: ConnectorModel = globalConnectors[i];
            let pts: PointModel[] = [];
            for (let key: number = 0; key < connector.segments.length; key++) {
                let seg: OrthogonalSegment = connector.segments[key] as OrthogonalSegment;
                for (let k: number = 0; k < seg.points.length; k++) {
                    let pt: PointModel = seg.points[k];
                    if (pts.length === 0 || !(Point.equals(pt, pts[pts.length - 1]))) {
                        pts.push(pt);
                    }
                }
            }
            let obssegments: ObstacleSegmentValues[] = [];
            for (let j: number = 1; j < pts.length; j++) {
                let obstacle: ObstacleSegmentValues = this.ObstacleSegment({ startpt: pts[j - 1], endpt: pts[j], id: connector.id });
                obssegments.push(obstacle);
            }

            let connectorObstacle: ConnectorObstacle = { wrapper: connector, segments: obssegments };
            let segments: ObstacleSegmentValues[] = [];
            if (!isHorizontal) {
                for (let key: number = 0; key < connectorObstacle.segments.length; key++) {
                    let obstacle: ObstacleSegmentValues = connectorObstacle.segments[key];
                    if (obstacle.orientation === 'horizontal') {
                        segments.push(obstacle);
                    }
                }
            } else {
                for (let key: number = 0; key < connectorObstacle.segments.length; key++) {
                    let obstacle: ObstacleSegmentValues = connectorObstacle.segments[key];
                    if (obstacle.orientation === 'vertical') {
                        segments.push(obstacle);
                    }
                }
            }

            for (let j: number = 0; j < segments.length; j++) {
                let obstacleSegment: ObstacleSegmentValues = segments[j];
                if (!this.containsValue(graph, obstacleSegment.coord)) {
                    graph.push({ key: obstacleSegment.coord, value: [] });
                }

                let index: number;
                for (let k: number = 0; k < graph.length; k++) {
                    let key: number = graph[k].key;
                    if (Number(key) === obstacleSegment.coord) {
                        index = k;
                        break;
                    }
                }
                graph[index].value.push(obstacleSegment);
            }

            connectorObstacles.push(connectorObstacle);
        }

        let modifiedgrap: ModifiedgrapObject[] = [];
        for (let m: number = 0; m < graph.length; m++) {
            let row: GraphObject = graph[m];
            let sortedrow: ObstacleSegmentValues[] = row.value;
            sortedrow.sort();

            let groupby: ObstacleSegmentValues[];
            groupby = [];

            let index: number = 0;

            let maxEnd: number = Number.MIN_VALUE;
            groupby.push([] as ObstacleSegmentValues);
            for (let n: number = 0; n < sortedrow.length; n++) {
                let obstacleSegment: ObstacleSegmentValues = sortedrow[n];
                if (!((groupby[index] as ObstacleSegmentValues[]).length > 0) || maxEnd >= obstacleSegment.start) {
                    (groupby[index] as ObstacleSegmentValues[]).push(obstacleSegment);
                    maxEnd = Math.max(maxEnd, groupby[index][(groupby[index] as ObstacleSegmentValues[]).length - 1].end);
                } else {
                    index++;
                    groupby.push([] as ObstacleSegmentValues);
                    (groupby[index] as ObstacleSegmentValues[]).push(obstacleSegment);
                    maxEnd = groupby[index][(groupby[index] as ObstacleSegmentValues[]).length - 1].end;
                }
            }

            for (let n: number = 0; n < groupby.length; n++) {
                let group: ObstacleSegmentValues = groupby[n];
                let sortedGroup: ObstacleSegmentValues[] = [];
                for (let j: number = 0; j < (group as ObstacleSegmentValues[]).length; j++) {
                    let e: ObstacleSegmentValues = group[j];
                    if (e.start) {
                        sortedGroup.push(e);
                    }
                }
                let comparingDir: string = isHorizontal ? 'Bottom' : 'Right';

                let directed: ObstacleSegmentValues[] = [];
                for (let j: number = 0; j < sortedGroup.length; j++) {
                    let e: ObstacleSegmentValues = sortedGroup[j];
                    if (e.direction === comparingDir) {
                        directed.push(e);
                    }
                }

                let reversedirected: ObstacleSegmentValues[] = [];
                for (let j: number = 0; j < sortedGroup.length; j++) {
                    let e: ObstacleSegmentValues = sortedGroup[j];
                    if (e.direction !== comparingDir) {
                        reversedirected.push(e);
                    }
                }

                let mutual: ObstacleSegmentValues[] = [];
                if (directed.length > 0) {
                    let temp: number = directed[0].start;

                    let j: number = 0;
                    while (j < reversedirected.length) {
                        if (reversedirected[j].end > temp) {
                            mutual.push(reversedirected[j]);
                            reversedirected.splice(j, 1);
                        } else {
                            j++;
                        }

                    }
                }
                let mutualRow: ObstacleSegmentValues[] = [];
                mutualRow = this.updateSegmentRow(mutual, mutualRow);
                let directedRow: ObstacleSegmentValues[] = [];
                directedRow = [];
                directedRow = this.updateSegmentRow(reversedirected, directedRow);
                directed.reverse();
                directedRow = this.updateSegmentRow(directed, directedRow);


                if (!((mutualRow[mutualRow.length - 1] as ObstacleSegmentValues[]).length > 0)) {
                    mutualRow.splice(mutualRow.length - 1, 1);
                }

                if (!((directedRow[directedRow.length - 1] as ObstacleSegmentValues[]).length > 0)) {
                    directedRow.splice(directedRow.length - 1, 1);
                }

                let subrow: ObstacleSegmentValues[] = [];
                let descAdding: boolean = mutual.length > 0 && (sortedGroup[0].direction === mutual[0].direction
                    || sortedGroup[sortedGroup.length - 1].direction === mutual[mutual.length - 1].direction);
                if (descAdding) {
                    subrow = directedRow;
                    for (let p: number = 0; p < mutualRow.length; p++) {
                        let obj: ObstacleSegmentValues = mutualRow[p];
                        subrow[subrow.length] = obj;
                    }
                } else {
                    subrow = mutualRow;
                    for (let p: number = 0; p < directedRow.length; p++) {
                        let obj: ObstacleSegmentValues = directedRow[p];
                        subrow[subrow.length] = obj;
                    }
                }

                if (subrow.length > 1) {
                    let directionModifier: number = 1;
                    if (layout.orientation === 'BottomToTop'
                        || layout.orientation === 'RightToLeft') {
                        directionModifier = -1;
                    }

                    let startCoord: number = row.key - (directionModifier * avaibaleSpace / 2.0);
                    let diff: number = avaibaleSpace / subrow.length;

                    for (let i: number = 0; i < subrow.length; i++) {
                        let newcoord: number = startCoord + (i * diff * directionModifier);
                        for (let p: number = 0; p < (subrow[i] as ObstacleSegmentValues[]).length; p++) {
                            let obstacleSegment: ObstacleSegmentValues = subrow[i][p];
                            obstacleSegment.coord = newcoord;
                            if (!this.containsValue((modifiedgrap as ModifiedgrapObject[]), obstacleSegment.coord)) {
                                modifiedgrap.push({ key: obstacleSegment.coord, value: [] });
                            }
                            let index: number;
                            for (let k: number = 0; k < modifiedgrap.length; k++) {
                                let keyCheck: number = modifiedgrap[k].key;
                                if (keyCheck === obstacleSegment.coord) {
                                    index = k;
                                    break;
                                }
                            }
                            modifiedgrap[index].value.push(obstacleSegment);
                        }
                    }
                }
            }
        }

        for (let m: number = 0; m < connectorObstacles.length; m++) {
            let connectorObstacle: ConnectorObstacle = connectorObstacles[m];
            let pts: PointModel[] = [];
            for (let i: number = 0; i < connectorObstacle.segments.length; i++) {
                if (i === 0) {
                    pts.push(this.getObstacleStartPoint(connectorObstacle.segments[i]));
                } else if (isHorizontal) {
                    if (connectorObstacle.segments[i].orientation === 'vertical') {
                        pts[pts.length - 1] = this.getObstacleStartPoint(connectorObstacle.segments[i]);
                    }
                } else if (!isHorizontal) {
                    if (connectorObstacle.segments[i].orientation === 'horizontal') {
                        pts[pts.length - 1] = this.getObstacleStartPoint(connectorObstacle.segments[i]);
                    }
                }

                pts.push(this.getObstacleEndPoint(connectorObstacle.segments[i]));
            }
            /* tslint:disable */
            (connectorObstacle.wrapper as Connector)[obstacleCollection] = [];
            for (let j: number = 0; j < pts.length; j++) {
                let point: PointModel = pts[j];
                if (j === 0 || (j > 0 && !(Point.equals(point, pts[j - 1])))) {
                    (connectorObstacle.wrapper as Connector)[obstacleCollection].push(this.getPointvalue(point.x, point.y));
                }
            }
            /* tslint:enable */
            this.resetConnectorPoints(connectorObstacle.wrapper, diagram);
        }
    }

    private inflate(rect: Rect, x: number, y: number): Rect {
        rect.x -= x;
        rect.y -= y;
        rect.width += 2 * x;
        rect.height += 2 * y;
        return rect;
    }

    private updateConnectorPoints(
        connectorPoints: Point[], startSegmentSize: number, intermediatePoint: Point, bounds: object, orientation: string):
        Point[] {
        let layoutBounds: Rect = bounds as Rect;
        let isHorizontal: boolean = orientation === 'LeftToRight' || orientation === 'RightToLeft';
        let pts: Point[] = connectorPoints;
        if (pts.length > 2) {
            let newPt: Point = Point.transform(pts[0], Point.findAngle(pts[0], pts[1]), startSegmentSize) as Point;
            let nextPt: Point = Point.transform(newPt, Point.findAngle(pts[1], pts[2]), Point.findLength(pts[1], pts[2])) as Point;
            pts.splice(1, 2, newPt, nextPt);
            if (intermediatePoint != null) {
                let index: number = 2;
                let ptsCount: number = pts.length;
                let newPt1: Point = Point.transform(
                    pts[ptsCount - 1],
                    Point.findAngle(pts[ptsCount - 1], pts[ptsCount - 2]),
                    startSegmentSize) as Point;
                pts.splice(ptsCount - 1, 0, newPt1);
                while (index < (pts.length - 2)) {
                    pts.splice(index, 1);
                }

                let edgePt: Point = intermediatePoint;
                this.inflate((layoutBounds as Rect), (layoutBounds as Rect).width, layoutBounds.height);

                let line1: Point[] = [];
                line1[0] = this.getPointvalue(edgePt.x, layoutBounds.y) as Point;
                line1[1] = this.getPointvalue(edgePt.x, layoutBounds.y + layoutBounds.height) as Point;

                let line2: Point[] = [];
                line2[0] = this.getPointvalue(layoutBounds.x, pts[1].y) as Point;
                line2[1] = this.getPointvalue(layoutBounds.x + layoutBounds.width, pts[1].y) as Point;

                let line3: Point[] = [];
                line3[0] = this.getPointvalue(layoutBounds.x, newPt1.y) as Point;
                line3[1] = this.getPointvalue(layoutBounds.x + layoutBounds.width, newPt1.y) as Point;


                if (isHorizontal) {
                    line1[0] = this.getPointvalue(layoutBounds.x, edgePt.y) as Point;
                    line1[1] = this.getPointvalue(layoutBounds.x + layoutBounds.width, edgePt.y) as Point;

                    line2[0] = this.getPointvalue(pts[1].x, layoutBounds.y) as Point;
                    line2[1] = this.getPointvalue(pts[1].x, layoutBounds.y + layoutBounds.height) as Point;

                    line3[0] = this.getPointvalue(newPt1.x, layoutBounds.y) as Point;
                    line2[1] = this.getPointvalue(newPt1.x, layoutBounds.y + layoutBounds.height) as Point;
                }

                let intercepts1: Point[] = [intersect2(
                    line1[0] as Point,
                    line1[1] as Point, line2[0] as Point, line2[1] as Point)] as Point[];
                let intercepts2: Point[] = [intersect2(
                    line1[0] as Point, line1[1] as Point,
                    line3[0] as Point, line3[1] as Point)] as Point[];

                if (intercepts2.length > 0) {
                    pts.splice(2, 0, intercepts2[0]);
                }

                if (intercepts1.length > 0) {
                    pts.splice(2, 0, intercepts1[0]);
                }
            }
        }

        let i: number = 1;
        while (i < pts.length - 1) {
            if (Point.equals(pts[i - 1], pts[i])) {
                pts.splice(i, 1);
            } else if (Point.findAngle(pts[i - 1], pts[i]) === Point.findAngle(pts[i], pts[i + 1])) {
                pts.splice(i, 1);
            } else {
                i++;
            }
        }

        return pts;
    }



    /* tslint:disable */

    private resetConnectorPoints(edge: ConnectorModel, diagram: Diagram): void {
        let obstacleCollection: string = 'obstaclePointCollection';
        if ((edge.segments[0] as OrthogonalSegment).points
            && (edge.segments[0] as OrthogonalSegment).points.length > 0) {
            let connector: ConnectorModel = edge;
            connector.sourcePoint = (edge as Connector)[obstacleCollection][0];
            connector.targetPoint = (edge as Connector)[obstacleCollection][(edge as Connector)[obstacleCollection].length - 1];
            let segments: OrthogonalSegment[];
            segments = [];
            for (let i: number = 0; i < (edge as Connector)[obstacleCollection].length - 1; i++) {
                let point1: Point = (edge as Connector)[obstacleCollection][i];
                let point2: Point = (edge as Connector)[obstacleCollection][i + 1];
                let length: number = findDistance(point1, point2);
                let direction: string = this.getConnectorDirection(point1, point2);
                if (i === (edge as Connector)[obstacleCollection].length - 2) {
                    if ((diagram.layout.orientation === 'RightToLeft' && direction === 'Left')
                        || (diagram.layout.orientation === 'LeftToRight' && direction === 'Right')
                        || (diagram.layout.orientation === 'TopToBottom' && direction === 'Bottom')
                        || (diagram.layout.orientation === 'BottomToTop' && direction === 'Top')) {
                        length = length / 2;
                    }

                }
                /* tslint:enable */
                let tempSegment: OrthogonalSegment = new OrthogonalSegment(edge, 'segments', { type: 'Orthogonal' }, true);
                tempSegment.length = length;
                tempSegment.direction = (direction as Direction);
                segments.push(tempSegment);
            }
            connector.segments = segments;

            connector.type = 'Orthogonal';
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, {
                type: 'Orthogonal',
                segments: connector.segments
            } as Connector);
        }
    }
    private getObstacleEndPoint(segment: ObstacleSegmentValues): object {
        if (segment.orientation === 'horizontal') {
            if (segment.direction === 'Left') {
                return this.getPointvalue(segment.start, segment.coord);
            }

            return this.getPointvalue(segment.end, segment.coord);
        }

        if (segment.direction === 'Top') {
            return this.getPointvalue(segment.coord, segment.start);
        }

        return this.getPointvalue(segment.coord, segment.end);
    }
    private getObstacleStartPoint(segment: ObstacleSegmentValues): PointModel {
        if (segment.orientation === 'horizontal') {
            if (segment.direction === 'Left') {
                return this.getPointvalue(segment.end, segment.coord);
            }

            return this.getPointvalue(segment.start, segment.coord);
        }

        if (segment.direction === 'Top') {
            return this.getPointvalue(segment.coord, segment.end);
        }

        return this.getPointvalue(segment.coord, segment.start);
    }

    private updateSegmentRow(
        obstacleSegments: ObstacleSegmentValues[], segmentRow: ObstacleSegmentValues[]):
        ObstacleSegmentValues[] {
        let k: number = 0;
        if (!(segmentRow.length > 0)) {
            segmentRow[0] = [] as ObstacleSegmentValues;
        }

        for (let i: number = 0; i < obstacleSegments.length; i++) {
            let obstacleSegment: ObstacleSegmentValues = obstacleSegments[i];
            while (k < segmentRow.length) {
                if (k === segmentRow.length - 1) {
                    segmentRow[k + 1] = [] as ObstacleSegmentValues;
                }

                if (!((segmentRow[k] as ObstacleSegmentValues[]).length > 0)
                    || segmentRow[k][(segmentRow[k] as ObstacleSegmentValues[]).length - 1].end < obstacleSegment.start) {
                    (segmentRow[k] as ObstacleSegmentValues[]).push(obstacleSegment);
                    break;
                }

                k++;
            }
        }
        return segmentRow;
    }


    private portOffsetCalculation(port: PointPortModel, length: number, direction: string, i: number): void {

        if (direction === 'Top') {
            port.offset = { x: (i + 1) * (1.0 / (length + 1)), y: 0 };
        }
        if (direction === 'Bottom') {
            port.offset = { x: (i + 1) * (1.0 / (length + 1)), y: 1 };
        }
        if (direction === 'Left') {
            port.offset = { x: 0, y: (i + 1) * (1.0 / (length + 1)) };
        }
        if (direction === 'Right') {
            port.offset = { x: 1, y: (i + 1) * (1.0 / (length + 1)) };
        }

    }

    private addDynamicPortandDistrrbuteLine(
        layout: Layout, node: Node | NodeModel, sourceDirection: string, targetDirection: string, diagram: Diagram):
        void {
        if ((node.ports && node.ports.length > 0)) {
            let port: PointPortModel[] = node.ports;
            diagram.removePorts(node as Node, port);

        }
        let existingPorts: PointPortModel[] = node.ports;
        let outConnectors: string[] = (node as Node).outEdges;
        let inConnectors: string[] = (node as Node).inEdges;
        this.initPort(outConnectors, diagram, node, sourceDirection, false);
        this.initPort(inConnectors, diagram, node, targetDirection, true);
    }
/* tslint:disable */
    private initPort(connectors: string[], diagram: Diagram, node: Node | NodeModel, targetDirection: string, inConnectors: boolean) {
        let obstacleCollection: string = 'obstaclePointCollection';
        for (let i: number = 0; i <= connectors.length - 1; i++) {
            let internalConnector: Connector = diagram.nameTable[connectors[i]];
            internalConnector[obstacleCollection] = [];

            let newPort: PointPortModel = findPort(node, inConnectors ? internalConnector.targetPortID : internalConnector.sourcePortID);
            let direction: string = targetDirection;
            if (newPort === undefined) {
                newPort = new PointPort(node, 'ports', '', true);
                newPort.id = randomId() + '_LineDistribution';
                if (inConnectors) {
                    internalConnector.targetPortID = newPort.id;
                } else {
                    internalConnector.sourcePortID = newPort.id;
                }
            }
            this.portOffsetCalculation(newPort, connectors.length, direction, i);
            node.ports.push(newPort);
            let portWrapper: DiagramElement = (node as Node).initPortWrapper((node as NodeModel).ports[node.ports.length - 1] as Port);
            node.wrapper.children.push(portWrapper);
            diagram.connectorPropertyChange(internalConnector, inConnectors ? { targetPortID: '' } as Connector : { sourcePortID: '' } as Connector,
                inConnectors ? { targetPortID: newPort.id } as Connector : { sourcePortID: newPort.id } as Connector);
        }
    }
    /* tslint:enable */

    private shiftMatrixCells(
        value: number, startingCell: MatrixCellGroupObject, shiftChildren: boolean,
        parentCell: MatrixCellGroupObject, matrixModel: MatrixModelObject):
        void {
        if (!(value === 0)) {
            let matrix: MatrixObject[] = matrixModel.matrix;
            let matrixRow: MatrixCellGroupObject[] = matrix[startingCell.level].value;
            let index: number = matrixRow.indexOf(startingCell);

            for (let i: number = index; i < matrixRow.length; i++) {
                matrixRow[i].offset += value;
            }

            if (shiftChildren) {
                if (startingCell.visitedChildren.length > 0) {
                    this.shiftMatrixCells(
                        value,
                        startingCell.visitedChildren[0],
                        true,
                        startingCell,
                        matrixModel);
                } else {
                    let i: number = 1;
                    let nextSibilingwithChild: MatrixCellGroupObject = null;
                    while (index + i < matrixRow.length) {
                        let nextCell: MatrixCellGroupObject = matrixRow[index + i];
                        if (parentCell != null && this.containsValue(nextCell.visitedParents, parentCell)) {
                            if (nextCell.visitedChildren.length > 0) {
                                nextSibilingwithChild = nextCell;
                            } else {
                                i++;
                                continue;
                            }
                        }

                        break;
                    }

                    if (nextSibilingwithChild != null) {
                        this.shiftMatrixCells(
                            value,
                            nextSibilingwithChild.visitedChildren[0],
                            true,
                            nextSibilingwithChild,
                            matrixModel);
                    }
                }
            }
        }
    }

    private arrangeMatrix(cell: MatrixCellGroupObject, parent: MatrixCellGroupObject, matrixModel: MatrixModelObject): void {
        let layoutSettings: LayoutProp = matrixModel.model.layout;
        let isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight'
            || layoutSettings.orientation === 'RightToLeft';
        let spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;

        let matrix: MatrixObject[] = matrixModel.matrix;
        let matrixRow: MatrixCellGroupObject[] = matrix[cell.level].value;
        let matrixIndex: number = matrixRow.indexOf(cell);

        if (cell.visitedParents.length > 0) {
            if (cell.visitedParents.length === 1) {
                cell.initialOffset = cell.offset;
            }

            if (matrixIndex + 1 < matrixRow.length) {
                let nextCell: MatrixCellGroupObject = matrixRow[matrixIndex + 1];
                if (nextCell.visitedParents.length > 0) {
                    if (!this.containsValue(cell.visitedParents, parent)) {
                        cell.visitedParents.push(parent);
                        parent.ignoredChildren.push(cell);
                        return;
                    }
                }
            }
        }

        if (!(cell.children.length > 0)) {
            let validOffset: number = cell.offset;
            if (matrixIndex > 0) {
                let prevCell: MatrixCellGroupObject = matrixRow[matrixIndex - 1];
                validOffset = prevCell.offset + (prevCell.size / 2) + spacing + (cell.size / 2);
            }

            this.shiftMatrixCells(validOffset - cell.offset, cell, false, null, matrixModel);
        } else {
            for (let i: number = 0; i < cell.children.length; i++) {
                let matrixCellChild: MatrixCellGroupObject = cell.children[i];
                if (!this.containsValue(cell.visitedChildren, matrixCellChild)) {
                    this.arrangeMatrix(matrixCellChild, cell, matrixModel);
                    cell.visitedChildren.push(matrixCellChild);
                }
            }

            if (cell.visitedChildren.length > 0) {
                let children: MatrixCellGroupObject[] = cell.visitedChildren.slice();
                for (let i: number = 0; i < cell.ignoredChildren.length; i++) {
                    let cellIgnoredChild: MatrixCellGroupObject = cell.ignoredChildren[i];
                    children.splice(0, 1);
                    cell.visitedChildren.splice(0, 1);
                }

                if (children.length > 0) {
                    let firstChild: MatrixCellGroupObject = cell.visitedChildren[0];
                    let lastChild: MatrixCellGroupObject = cell.visitedChildren[cell.visitedChildren.length - 1];
                    let x1: number = firstChild.offset - (firstChild.size / 2);
                    let x2: number = lastChild.offset + (lastChild.size / 2);
                    let newoffset: number = (x1 + x2) / 2;
                    if (newoffset < cell.offset) {
                        this.shiftMatrixCells(cell.offset - newoffset, firstChild, true, cell, matrixModel);
                    } else if (newoffset > cell.offset) {
                        this.shiftMatrixCells(newoffset - cell.offset, cell, false, null, matrixModel);
                    }
                }
            }
        }

        if (!this.containsValue(cell.visitedParents, parent)) {
            cell.visitedParents.push(parent);
        }
    }

    /** @private */
    public arrangeElements(matrixModel: MatrixModelObject, layout: Layout): void {
        let layoutSettings: LayoutProp = matrixModel.model.layout;

        let isHorizontal: boolean;
        if (layout.orientation === 'LeftToRight' || layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        } else {
            isHorizontal = false;
        }

        let spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
        let spacingInverse: number = !isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
        // Need to group element before
        this.groupLayoutCells(matrixModel);
        this.createMatrixCells(matrixModel);

        for (let j: number = 0; j < matrixModel.matrix.length; j++) {
            let matrixKey: number = matrixModel.matrix[j].key;
            let matrixrow: MatrixCellGroupObject[] = matrixModel.matrix[matrixKey].value;
            for (let i: number = 1; i < matrixrow.length; i++) {
                let cell: MatrixCellGroupObject = matrixrow[i];
                let prevCell: MatrixCellGroupObject = matrixrow[i - 1];
                cell.offset += prevCell.offset + (prevCell.size / 2) + spacing + (cell.size / 2);
            }
        }


        for (let j: number = 0; j < matrixModel.matrix[0].value.length; j++) {
            let root: MatrixCellGroupObject = matrixModel.matrix[0].value[j];
            this.arrangeMatrix(root, null, matrixModel);
        }

        for (let k: number = 0; k < matrixModel.matrix.length; k++) {
            let row: MatrixCellGroupObject[] = matrixModel.matrix[k].value;
            for (let i: number = 0; i < row.length; i++) {
                let cell: MatrixCellGroupObject = row[i];
                if (cell.visitedParents.length > 1) {
                    let firstParent: MatrixCellGroupObject = cell.visitedParents[0];
                    let lastParent: MatrixCellGroupObject = cell.visitedParents[cell.visitedParents.length - 1];
                    let firstVertexParent: MatrixCellGroupObject = this.findParentVertexCellGroup(firstParent);
                    let lastVertexParent: MatrixCellGroupObject = this.findParentVertexCellGroup(lastParent);

                    if (firstParent !== firstVertexParent && firstVertexParent.offset < firstParent.offset) {
                        firstParent = firstVertexParent;
                    }

                    if (lastParent !== lastVertexParent && lastVertexParent.offset > lastParent.offset) {
                        lastParent = firstVertexParent;
                    }

                    let newoffset: number = (firstParent.offset + lastParent.offset) / 2;
                    let availOffsetMin: number = cell.initialOffset;
                    let availOffsetMax: number = cell.offset;
                    if (!(availOffsetMax === availOffsetMin)) {
                        if (newoffset >= availOffsetMin && newoffset <= availOffsetMax) {
                            this.translateMatrixCells(newoffset - cell.offset, cell);
                        } else if (newoffset < availOffsetMin) {
                            this.translateMatrixCells(availOffsetMin - cell.offset, cell);
                        }
                    }
                }
            }
        }

        this.setXYforMatrixCell(matrixModel);
    }
    private findParentVertexCellGroup(cell: MatrixCellGroupObject): MatrixCellGroupObject {
        if (cell.cells[0]) {
            return cell;
        }

        if (cell.parents.length > 0) {
            return this.findParentVertexCellGroup(cell.parents[0]);
        }

        return cell;
    }


    private setXYforMatrixCell(matrixModel: MatrixModelObject): void {
        let layoutSettings: LayoutProp = matrixModel.model.layout;
        let isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight'
            || layoutSettings.orientation === 'RightToLeft';
        let spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;

        for (let i: number = 0; i < matrixModel.matrix.length; i++) {
            let matrixrow1: MatrixCellGroupObject[] = matrixModel.matrix[i].value;
            for (let j: number = 0; j < matrixrow1.length; j++) {
                let matrixCell: MatrixCellGroupObject = matrixrow1[j];
                let start: number = matrixCell.offset - (matrixCell.size / 2);
                for (let k: number = 0; k < (matrixCell.cells as CellObject[]).length; k++) {
                    let cell: CellObject = matrixCell.cells[k];
                    let type: string = this.getType(cell.type);
                    if (type === 'internalVertex') {
                        let internalVertex: CellObject = cell;
                        let width: number = internalVertex.cell.geometry.width;
                        let height: number = internalVertex.cell.geometry.height;
                        if (isHorizontal) {
                            internalVertex.cell.geometry = new Rect(
                                matrixModel.rowOffset[matrixCell.level] - (width / 2),
                                start,
                                width,
                                height) as Rect;
                        } else {
                            internalVertex.cell.geometry = new Rect(
                                start,
                                matrixModel.rowOffset[matrixCell.level] - (height / 2),
                                width,
                                height) as Rect;
                        }

                        start += (isHorizontal ? height : width) + spacing;
                    } else if (type === 'internalEdge') {
                        let internalEdges: CellObject = cell;
                        let parent: MatrixCellGroupObject = matrixCell.visitedParents[0];
                        let isContainSibilingVertex: boolean = false;
                        for (let l: number = 0; l < parent.visitedChildren.length; l++) {
                            let children: MatrixCellGroupObject = parent.visitedChildren[l];
                            let cells: CellObject[] = [];
                            for (let m: number = 0; m < (children.cells as CellObject[]).length; m++) {
                                let cell: CellObject = children.cells[m];
                                let type: string = this.getType(cell.type);
                                if (type === 'internalVertex') {
                                    cells.push(cell);
                                }
                            }
                            if (cells.length > 0) {
                                isContainSibilingVertex = true;
                                break;
                            }
                        }

                        // Need to updated line width
                        let lineWidth: number = 1;
                        let edgeSpacing: number = 5;
                        for (let m: number = 0; m < internalEdges.edges.length; m++) {
                            let internalConnector: Connector = internalEdges.edges[m];
                            let pt: Point = this.getPointvalue(start + (lineWidth / 2.0), matrixModel.rowOffset[matrixCell.level]) as Point;
                            if (isHorizontal) {
                                pt = this.getPointvalue(matrixModel.rowOffset[matrixCell.level], start + (lineWidth / 2.0)) as Point;
                            }

                            if (this.containsValue((this.getEdgeMapper() as EdgeMapperObject[]), internalConnector)) {
                                let key: number;
                                for (let l: number = 0; l < this.getEdgeMapper().length; l++) {
                                    if ((this.getEdgeMapper())[l].key === internalConnector) {
                                        key = l;
                                        break;
                                    }
                                }
                                (this.getEdgeMapper())[key].value.push(pt as Point);
                            }

                            start += lineWidth + edgeSpacing;
                        }

                        start += spacing;
                    }
                }
            }
        }

    }

    private getEdgeMapper(): EdgeMapperObject[] {
        return this.edgeMapper;
    }

    /** @private */
    public  setEdgeMapper(value: EdgeMapperObject): void {
        this.edgeMapper.push(value);
    }

    private translateMatrixCells(value: number, cell: MatrixCellGroupObject): void {
        if (!(value === 0)) {
            cell.offset += value;
            if (cell.visitedChildren.length > 0) {
                for (let i: number = 0; i < cell.visitedChildren.length; i++) {
                    let cellVisitedChild: MatrixCellGroupObject = cell.visitedChildren[i];
                    this.translateMatrixCells(value, cellVisitedChild);
                }
            }
        }
    }
    private groupLayoutCells(matrixModel: MatrixModelObject): void {
        let ranks: IVertex[][] = matrixModel.model.ranks;
        for (let j: number = ranks.length - 1; j >= 0; j--) {
            let vertices: IVertex[] = [];
            for (let v: number = 0; v < ranks[j].length; v++) {
                let rank: IVertex = ranks[j][v];
                let type: string = this.getType(rank.type);
                if (type === 'internalVertex') {
                    vertices.push(ranks[j][v]);
                }
            }

            let edges: IVertex[] = [];
            for (let e: number = 0; e < ranks[j].length; e++) {
                let rank: IVertex = ranks[j][e];
                let type: string = this.getType(rank.type);
                if (type === 'internalEdge') {
                    edges.push(rank);
                }
            }

            while (vertices.length > 1) {
                let vertex1: IVertex = vertices[0];
                let parentset1: string[] = this.selectIds(vertex1.connectsAsTarget, true);
                let childset1: string[] = this.selectIds(vertex1.connectsAsSource, false);
                while (vertices.length > 1) {
                    let vertex2: IVertex = vertices[1];
                    let parentset2: string[] = this.selectIds(vertex2.connectsAsTarget, true);
                    let childset2: string[] = this.selectIds(vertex2.connectsAsSource, false);
                    let parentequals: boolean = this.compareLists(parentset1, parentset2);
                    let childequals: boolean = this.compareLists(childset1, childset2);
                    if (parentequals && childequals) {
                        this.updateMutualSharing(vertices[0], vertex2.id);
                        this.updateMutualSharing(vertices[1], vertex1.id);
                        vertices.splice(1, 1);
                        continue;
                    }
                    break;
                }
                vertices.splice(0, 1);
            }


            while (edges.length > 1) {
                let internalEdge: IVertex = edges[0];
                let parentset: IVertex = internalEdge.source;
                let childset: IVertex = internalEdge.target;
                if (parentset.identicalSibiling != null) {

                    let groupedges: IVertex[] = [];

                    for (let i: number = 0; i < edges.length; i++) {
                        let edge: IVertex = edges[i];
                        if (edge.target === childset) {
                            groupedges.push(edge);
                        }
                    }

                    for (let i: number = 0; i < groupedges.length; i++) {
                        let internalEdgese: IVertex = groupedges[i];
                        if (this.containsValue(parentset.identicalSibiling, internalEdgese.source.id)) {
                            internalEdgese.source.identicalSibiling = null;
                        }
                    }
                    internalEdge.source.identicalSibiling = null;
                }
                edges.splice(0, 1);
            }
        }
    }

    private getType(type: string): string {
        if (type === 'internalVertex') {
            return 'internalVertex';
        } else {
            return 'internalEdge';
        }
    }

    private selectIds(node: IEdge[], source: boolean): string[] {
        let returnIds: string[] = [];
        for (let i: number = 0; i < node.length; i++) {
            let connector: IEdge = node[i];
            if (source) {

                {
                    returnIds.push(connector.source.id);
                }
            } else {
                returnIds.push(connector.target.id);
            }
        }
        return returnIds;
    }

    private compareLists(list1: string[], list2: string[]): boolean {
        let newList1: string[] = list1.slice();
        let newList2: string[] = list2.slice();
        if (newList1.length === newList2.length) {
            if (newList1.length === 0) {
                return true;
            } else {
                let isSame: boolean = true;
                for (let i: number = 0; i < newList2.length; i++) {
                    let o: string = newList2[i];
                    for (let j: number = i; j < newList1.length; j++) {
                        if (!(newList1[j] === o)) {
                            isSame = false;
                            break;
                        }
                    }
                }

                return isSame;
            }
        }

        return false;
    }

    private updateMutualSharing(cell: IVertex, id: string): void {
        if (cell.identicalSibiling != null) {
            cell.identicalSibiling.push(id);
        } else {
            cell.identicalSibiling = [];
            cell.identicalSibiling.push(id);
        }
    }
    private matrixCellGroup(options: MatrixCellGroupObject): MatrixCellGroupObject {
        options.level = options.level;
        options.parents = options.parents;
        options.children = options.children;
        options.visitedChildren = options.visitedChildren;
        options.visitedParents = options.visitedParents;
        options.ignoredChildren = options.ignoredChildren;
        options.cells = options.cells;
        options.offset = options.offset;
        options.initialOffset = options.initialOffset;
        return options;
    }
    private getPointvalue(x: number, y: number): object {
        return { 'x': Number(x) || 0, 'y': Number(y) || 0 };
    }

    private containsValue(
        list: string[] | MatrixCellGroupObject[] | EdgeMapperObject[]
            | ModifiedgrapObject[] | Connector[],
        keyValue: string | number | MatrixCellGroupObject | Connector | string[]):
        boolean {
        for (let i: number = 0; i < list.length; i++) {
            if ((list[i] as MatrixCellGroupObject).key === keyValue || list[i] === keyValue) {
                return true;
            }
        }
        return false;
    }

    /* tslint:disable */
    private createMatrixCells(matrixModel: MatrixModelObject) {
        let layoutSettings: LayoutProp = matrixModel.model.layout;
        let isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight'
            || layoutSettings.orientation === 'RightToLeft';
        let spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
        let spacingInverse = !isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;

        let ranks = matrixModel.model.ranks;
        let matrixCellMapper: MatrixCellMapperObject[] = [];
        let rowoffset = -spacingInverse;
        for (let j: number = ranks.length - 1; j >= 0; j--) {
            let maxDimension = 0.0;
            let index: number = (ranks.length - 1) - j;
            let rank: IVertex[] = ranks[j].slice();//.ToList();

            // Creating new row and adding it to matrix
            let matrixRow: MatrixCellGroupObject[] = [];
            matrixModel.matrix.push({ key: index, value: matrixRow });

            // Creating new row mapper
            let tempMatrixRow: any = [];
            matrixCellMapper.push({ index: index, value: tempMatrixRow });

            while (rank.length > 0) //.Any())
            {
                let layoutCell: IVertex | CellObject = rank[0];
                let matrixCell: MatrixCellGroupObject = this.matrixCellGroup({ level: index, parents: [], children: [], visitedParents: [], visitedChildren: [], ignoredChildren: [], cells: [], size: 0, offset: 0, initialOffset: 0 });
                matrixRow.push(matrixCell);
                let type: string = this.getType(layoutCell.type);
                if (type === 'internalVertex') {
                    (matrixCell.cells as IVertex[]).push(layoutCell as IVertex);
                    if (layoutCell.identicalSibiling != null) {
                        for (let i: number = 0; i < rank.length; i++) {
                            let internalVertex = rank[i];
                            let type: string = this.getType(internalVertex.type);

                            if (type === 'internalVertex' && this.containsValue(layoutCell.identicalSibiling, internalVertex.id)) {
                                (matrixCell.cells as IVertex[]).push(internalVertex);
                                if ((matrixCell.cells as CellObject[]).length > layoutCell.identicalSibiling.length) {
                                    break;
                                }
                            }
                        }
                    }

                    for (let i: number = 0; i < (matrixCell.cells as CellObject[]).length; i++) {
                        let internalVertex: CellObject = matrixCell.cells[i];
                        let type: string = this.getType(internalVertex.type);
                        if (type === 'internalVertex') {
                            let geometry = internalVertex.cell.geometry;
                            matrixCell.size += isHorizontal ? geometry.height : geometry.width;
                            maxDimension = Math.max(maxDimension, !isHorizontal ? geometry.height : geometry.width);
                            tempMatrixRow.push({ key: internalVertex.id, value: matrixCell });
                            if (internalVertex.connectsAsTarget.length > 0) {
                                for (let k: number = 0; k < internalVertex.connectsAsTarget.length; k++) {
                                    let internalEdgese: CellObject = internalVertex.connectsAsTarget[k];
                                    let key = null;
                                    if (this.containsValue(matrixCellMapper[index - 1].value, internalEdgese.ids)) {
                                        key = internalEdgese.ids;
                                    }
                                    else if (this.containsValue(matrixCellMapper[index - 1].value, internalEdgese.source.id)) {
                                        key = internalEdgese.source.id;
                                    }

                                    if (key != null) {
                                        let parentcellValue = matrixCellMapper[index - 1].value;
                                        let parentMartixCell;
                                        for (let v: number = 0; v < parentcellValue.length; v++) {
                                            if (parentcellValue[v].key == key) {
                                                parentMartixCell = parentcellValue[v].value;
                                                break;
                                            }
                                        }
                                        if (!this.containsValue(matrixCell.parents, parentMartixCell)) {
                                            matrixCell.parents.push(parentMartixCell);
                                        }

                                        if (!this.containsValue(parentMartixCell.children, matrixCell)) {
                                            parentMartixCell.children.push(matrixCell);
                                        }
                                    }
                                }
                            }
                            rank.reverse();
                            rank.pop();
                            rank.reverse();
                        }
                    }
                    matrixCell.size += ((matrixCell.cells as CellObject[]).length - 1) * spacing;
                }
                else if (type === 'internalEdge') {
                    (matrixCell.cells as IVertex[]).push(layoutCell);

                    for (let i: number = 0; i < (matrixCell.cells as CellObject[]).length; i++) {
                        let internalEdge: CellObject = matrixCell.cells[i];
                        let type1: string = this.getType(internalEdge.type);

                        if (type1 === 'internalEdge' && internalEdge.edges != null) {
                            // need to spacing based on its source and target Node
                            let edgeSpacing: number = 5;
                            let cellSize: number = -edgeSpacing;
                            for (let k: number = 0; k < internalEdge.edges.length; k++) {
                                let internalConnector = internalEdge.edges[k];
                                // need to summ up the line width
                                cellSize += 1 + edgeSpacing;
                            }

                            matrixCell.size += cellSize;
                        }

                        tempMatrixRow.push({ key: internalEdge.ids, value: matrixCell });

                        let key = null;
                        if (this.containsValue(matrixCellMapper[index - 1].value, internalEdge.ids)) {
                            key = internalEdge.ids;
                        }
                        else if (this.containsValue(matrixCellMapper[index - 1].value, internalEdge.source.id)) {
                            key = internalEdge.source.id;
                        }

                        if (key != null) {
                            let parentcell = matrixCellMapper[index - 1].value;
                            let parentMartixCell;
                            for (let v: number = 0; v < parentcell.length; v++) {
                                if (parentcell[v].key == key) {
                                    parentMartixCell = parentcell[v].value;
                                    break;
                                }
                            }
                            if (!this.containsValue(matrixCell.parents, parentMartixCell)) {
                                matrixCell.parents.push(parentMartixCell);
                            }

                            if (!this.containsValue(parentMartixCell.children, matrixCell)) {
                                parentMartixCell.children.push(matrixCell);
                            }
                        }

                        rank.reverse();
                        rank.pop();
                        rank.reverse();
                    }

                    matrixCell.size += ((matrixCell.cells as CellObject[]).length - 1) * spacing;
                }
            }

            matrixModel.rowOffset.push(rowoffset + (maxDimension / 2) + spacingInverse);
            rowoffset += maxDimension + spacingInverse;
        }
    }

    /** @private */
    public updateLayout(viewPort: PointModel, modelBounds: any, layoutProp: Layout, layout: LayoutProp, nodeWithMultiEdges: INode[], nameTable: object): void {
        {
            let trnsX: number = ((viewPort.x - modelBounds.width) / 2) - modelBounds.x;
            let trnsY: number = ((viewPort.y - modelBounds.height) / 2) - modelBounds.y;

            trnsX = Math.round(trnsX);
            trnsY = Math.round(trnsY);
            let modifiedConnectors: Connector[] = [];
            let transModelBounds: object = new Rect(modelBounds.x + trnsX,
                modelBounds.y + trnsY,
                modelBounds.width,
                modelBounds.height)
            let margin = layoutProp.margin;
            let isHorizontal: boolean = layout.orientation === 'RightToLeft' || layout.orientation === 'LeftToRight';
            let inversespacing: number = !isHorizontal ? layout.verticalSpacing : layout.horizontalSpacing;
            for (let i: number = 0; i < nodeWithMultiEdges.length; i++) {


                let node: INode = nodeWithMultiEdges[i];
                if (node.outEdges != null && node.outEdges.length > 0) {
                    let count: number = node.outEdges.length;
                    for (let j: number = 0; j < count; j++) {
                        let internalConnector: Connector = nameTable[node.outEdges[j]];
                        internalConnector['pointCollection'] = [];
                        if (count > 1) {
                            let segmentsize: number = inversespacing / 2.0;
                            let intermediatePoint: object = null;
                            let key: number;
                            let edgeMapper: EdgeMapperObject[] = this.getEdgeMapper();
                            for (let k: number = 0; k < edgeMapper.length; k++) {
                                if (edgeMapper[k].key === internalConnector) {
                                    key = k;
                                    break;
                                }
                            }
                            if ((edgeMapper[key] as EdgeMapperObject).value.length > 0) {
                                let edgePoint: Point = edgeMapper[key].value[0];
                                let dxValue1: number = edgePoint.x + margin.left;
                                let dyValue1: number = edgePoint.y + margin.top;
                                let x1: number = dxValue1, y1 = dyValue1;
                                if (layout.orientation === 'BottomToTop') {
                                    y1 = modelBounds.height - dyValue1;
                                }
                                else if (layout.orientation === 'RightToLeft') {
                                    x1 = modelBounds.width - dxValue1;
                                }

                                x1 += trnsX;
                                y1 += trnsY;

                                intermediatePoint = this.getPointvalue(x1, y1);
                            }

                            let pts: PointModel[] = [];
                            for (let i: number = 0; i < internalConnector.segments.length; i++) {
                                let pt: PointModel[] = (internalConnector.segments[i] as OrthogonalSegment).points;
                                for (let temp in pt) {
                                    pts.push(pt[temp]);
                                }
                            }

                            pts = this.updateConnectorPoints(pts as Point[], segmentsize, intermediatePoint as Point, (transModelBounds as Rect), layout.orientation);

                            for (let p: number = 0; p < pts.length; p++) {
                                let pt: PointModel = pts[p];

                                internalConnector['pointCollection'].push(this.getPointvalue(pt.x, pt.y));
                            }
                            this.resetConnectorPoints(internalConnector, this.diagram);
                        }
                        modifiedConnectors.push(internalConnector);
                    }
                }

                if (node.inEdges != null && node.inEdges.length > 1) {
                    let count: number = node.inEdges.length;
                    let edgeMapper: EdgeMapperObject[] = this.getEdgeMapper();
                    for (let j: number = 0; j < count; j++) {
                        let internalConnector: Connector = nameTable[node.inEdges[j]];
                        if (!this.containsValue((modifiedConnectors as Connector[]), internalConnector)) {
                            internalConnector['pointCollection'] = [];
                        }

                        if (count > 1) {
                            let segmentsize: number = inversespacing / 2.0;
                            let intermediatePoint: object = null;
                            let key: number;
                            let k: number;
                            for (k = 0; k < edgeMapper.length; k++) {
                                if (edgeMapper[k].key === internalConnector) {
                                    key = k;
                                    break;
                                }
                            }
                            if (edgeMapper[key].value.length > 0
                                && !this.containsValue(modifiedConnectors, internalConnector)) {
                                let edgePt: Point = edgeMapper[k].value[0];
                                let dx1: number = edgePt.x + margin.left;
                                let dy1: number = edgePt.y + margin.top;
                                let x1: number = dx1, y1 = dy1;
                                if (layout.orientation === 'BottomToTop') {
                                    y1 = modelBounds.height - dy1;
                                }
                                else if (layout.orientation === 'RightToLeft') {
                                    x1 = modelBounds.width - dx1;
                                }

                                x1 += trnsX;
                                y1 += trnsY;
                                intermediatePoint = this.getPointvalue(x1, y1);
                            }

                            let pts: PointModel[] = [];
                            for (let p: number = 0; p < internalConnector.segments.length; p++) {
                                let pt: PointModel[] = (internalConnector.segments[p] as OrthogonalSegment).points;
                                for (let temp in pt) {
                                    pts.push(pt[temp]);
                                }
                            }
                            pts.reverse();
                            pts = this.updateConnectorPoints(pts as Point[], segmentsize, (intermediatePoint as Point), transModelBounds as Rect, layoutProp.orientation);
                            pts.reverse();
                            internalConnector['pointCollection'] = [];
                            for (let p: number = 0; p < pts.length; p++) {
                                let pt: PointModel = pts[p];
                                internalConnector['pointCollection'].push(this.getPointvalue(pt.x, pt.y));
                            }
                            this.resetConnectorPoints(internalConnector, this.diagram);
                        }
                    }
                }
            }
        }

    }
    /* tslint:enable */



}


/** @private */
interface ObstacleSegmentValues {
    startpt?: PointModel;
    endpt?: PointModel;
    id?: string;
    direction?: string;
    distance?: number;
    orientation?: string;
    coord?: number;
    start?: number;
    end?: number;
}

/** @private */
interface ConnectorObstacle {
    wrapper: ConnectorModel;
    segments: ObstacleSegmentValues[];
}

/** @private */
interface GraphObject {
    key: number;
    value: ObstacleSegmentValues[];
}

/** @private */
interface EdgeMapperObject {
    value: Point[];
    key: Connector | Node;
}

/** @private */
export interface MatrixCellGroupObject {
    level: number;
    parents: MatrixCellGroupObject[];
    children: MatrixCellGroupObject[];
    visitedParents: MatrixCellGroupObject[];
    ignoredChildren: MatrixCellGroupObject[];
    cells: CellObject[] | IVertex;
    visitedChildren: MatrixCellGroupObject[];
    size: number;
    offset: number;
    initialOffset: number;
    key?: string[] | string;
    value?: MatrixCellGroupObject;
}

/** @private */
interface CellObject {
    x: number[];

    y: number[];
    type: string;
    temp: number[];
    minRank: number;
    maxRank: number;
    identicalSibilings: string[];
    connectsAsTarget: CellObject[];
    source: ConnectsAsSourceObject;
    target: ConnectsAsSourceObject;
    connectsAsSource: ConnectsAsSourceObject;
    cell: Vertex;
    edges?: Connector[];
    hashCode?: number;
    id?: string;
    ids?: string;

}

/** @private */
interface MatrixCellMapperObject {
    index: number;
    value: MatrixCellGroupObject[];

}

/** @private */
interface InterSectObject {
    enabled: boolean;
    intersectPt: Point;
}

/** @private */
interface ModifiedgrapObject {
    key: number;
    value: ObstacleSegmentValues[];
}


/** @private */
interface ConnectsAsSourceObject {
    id: string[];
    source: ConnectsAsSourceObject;
    target: ConnectsAsSourceObject;
    temp: number[];
    x: number[];
    y: number[];
}