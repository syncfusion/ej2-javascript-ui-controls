
import { Margin } from '../../core/appearance';
import { Diagram } from '../../diagram';
import { BranchDirection, LayoutOrientation } from '../../enum/enum';
import { Connector, OrthogonalSegment } from '../../objects/connector';
import { ConnectorModel } from '../../objects/connector-model';
import { NodeModel } from '../../objects/node-model';
import { Point } from '../../primitives/point';
import { PointModel } from '../../primitives/point-model';
import { Rect } from '../../primitives/rect';
import { randomId } from '../../utility/base-util';
import { IEdge } from '../complex-hierarchical-tree';
import { IConnector, INode } from '../layout-base';
import { FlowchartModel } from './flow-chart-model';
import { Node } from '../../objects/node';
import { MatrixModel } from './matrix-model';
import { MarginModel } from '../../core/appearance-model';
import { PathAnnotation } from '../../objects/annotation';

/**
 * Defines the Flowchart Layout
 */
export class FlowchartLayout {
    private rootNodes: NodeModel[];
    private vertexMapper: Map<string, object>;
    /** @private*/
    public edgesMapper: Map<object, PointModel[]>;
    /** @private*/
    public loopedgesMapper: Map<object, boolean>;
    private anchorX: number;
    private anchorY: number;
    /** @private*/
    public verticalSpacing: number;
    /** @private*/
    public horizontalSpacing: number;
    /** @private*/
    public horizontalAlignment: string;
    /** @private*/
    public verticalAlignment: string;
    /** @private*/
    public margin: Margin;
    /** @private */
    public orientation: LayoutOrientation;
    /** @private */
    public yesBranchDirection: BranchDirection;
    /** @private */
    public noBranchDirection: BranchDirection;
    /** @private */
    public yesBranchValues: string[];
    /** @private */
    public noBranchValues: string[];
    public diagram: Diagram;
    private flowChartData: FlowchartLayout;

    constructor() {
        this.rootNodes = [];
        this.vertexMapper = new Map<string, FlowChartVertex>();
        this.edgesMapper = new Map();
        this.loopedgesMapper = new Map();
        this.anchorX = 0;
        this.anchorY = 0;
        this.verticalSpacing = 50;
        this.horizontalSpacing = 50;
        this.horizontalAlignment = 'Center';
        this.verticalAlignment = 'Top';
        this.margin = { top: 50, right: 50, bottom: 50, left: 50 } as Margin;
        this.orientation = 'TopToBottom';
        this.yesBranchDirection = 'SameAsFlow';
        this.noBranchDirection = 'RightInFlow';
        this.yesBranchValues = ['Yes', 'True'];
        this.noBranchValues = ['No', 'False'];
        this.diagram = new Diagram();

    }

    /**
     * To update the layout of the diagram.
     * @private
     * @param {NodeModel[]} nodes - provide the node value.
     * @param {Diagram} diagram - provide the diagram value.
     * @returns { void }
     */
    public updateLayout(nodes: NodeModel[], diagram: Diagram): void {
        this.diagram = diagram;
        this.yesBranchDirection = this.diagram.layout.flowchartLayoutSettings.yesBranchDirection;
        this.noBranchDirection = this.diagram.layout.flowchartLayoutSettings.noBranchDirection;
        this.yesBranchValues = this.diagram.layout.flowchartLayoutSettings.yesBranchValues;
        this.noBranchValues = this.diagram.layout.flowchartLayoutSettings.noBranchValues;
        this.orientation = this.diagram.layout.orientation === 'TopToBottom' || this.diagram.layout.orientation === 'BottomToTop' ? 'TopToBottom' : 'LeftToRight';
        this.horizontalAlignment = this.diagram.layout.horizontalAlignment;
        this.verticalAlignment = this.diagram.layout.verticalAlignment;
        this.verticalSpacing = this.diagram.layout.verticalSpacing;
        this.horizontalSpacing = this.diagram.layout.horizontalSpacing;
        (this.margin as MarginModel) = this.diagram.layout.margin;
        const firstLevelNodes: NodeModel[] = [];
        const unseenVertices: FlowChartVertex[] = [];
        this.rootNodes = [];
        this.vertexMapper.clear();
        this.edgesMapper.clear();
        this.loopedgesMapper.clear();

        for (const item of nodes) {
            if (!item.excludeFromLayout) {
                const vertex: FlowChartVertex = this.createVertex(item as Node);
                this.vertexMapper.set(vertex.id, vertex);
                unseenVertices.push(vertex);
                if (!vertex.inEdges || vertex.inEdges.length === 0) {
                    firstLevelNodes.push(vertex);
                    this.rootNodes.push(item);
                }
            }
        }

        let previousModel: MatrixModel = null;
        for (const firstLevelNode of firstLevelNodes) {
            const vertexSet: FlowChartVertex[] = [];
            this.getTreeVertices(firstLevelNode as FlowChartVertex, vertexSet, unseenVertices);

            const layoutModel: FlowchartModel = new FlowchartModel(this, firstLevelNode, vertexSet);
            layoutModel.layeringStage();

            const matrixModel: MatrixModel = new MatrixModel(layoutModel);
            matrixModel.siblingModel = previousModel;
            matrixModel.arrangeElements();

            previousModel = matrixModel;
        }

        const vertices: FlowChartVertex[] = Array.from((this.vertexMapper as any).values());
        const modelBounds: Rect = this.getModelBounds(vertices);
        this.updateAnchor(modelBounds);

        const isHorizontal: boolean = this.orientation === 'LeftToRight';
        const inverseSpacing: number = !isHorizontal ? this.verticalSpacing : this.horizontalSpacing;
        const nodeWithMultiEdges: NodeModel[] = [];

        for (const vertex of vertices) {
            if (vertex) {
                const node: NodeModel = vertex.item;
                if (node) {
                    node.offsetX = vertex.geometry.x + (vertex.geometry.width / 2) + this.anchorX;
                    node.offsetY = vertex.geometry.y + (vertex.geometry.height / 2) + this.anchorY;
                    if ((vertex.inEdges && vertex.inEdges.length > 0) || (vertex.outEdges && vertex.outEdges.length > 0)) {
                        nodeWithMultiEdges.push(node);
                    }
                }
                diagram.dataBind();
            }
        }

        const transModelBounds: Rect = new Rect(modelBounds.x + this.anchorX, modelBounds.y
                                        + this.anchorY, modelBounds.width, modelBounds.height);

        (this as any).nodeWithMultiEdges = nodeWithMultiEdges;
        (this as any).inverseSpacing = inverseSpacing;
        (this as any).transModelBounds = transModelBounds;
        (this.diagram.layout as FlowchartLayout).flowChartData = this;
    }
    /**
     * To re-rout the flowchart connectors.
     * @private
     * @param {FlowchartLayout} layoutData - provide the layoutData value.
     * @param {Diagram} diagram - provide the diagram value.
     * @returns { void }
     */
    public reRouteFlowChartConnectors(layoutData: FlowchartLayout, diagram: Diagram): void {
        this.diagram = diagram;
        const nodeWithMultiEdges: NodeModel[] = (layoutData as LayOutData).nodeWithMultiEdges;
        const inverseSpacing: number = (layoutData as LayOutData).inverseSpacing;
        this.orientation = layoutData.orientation;
        const isVertical: boolean = this.orientation === 'TopToBottom';
        const transModelBounds: Rect = (layoutData as LayOutData).transModelBounds;
        this.vertexMapper = layoutData.vertexMapper;
        this.loopedgesMapper = layoutData.loopedgesMapper;
        this.edgesMapper = layoutData.edgesMapper;
        this.anchorX = layoutData.anchorX;
        this.anchorY = layoutData.anchorY;
        const modifiedConnectors: ConnectorModel[] = [];
        for (const node of nodeWithMultiEdges) {
            if ((node as Node).outEdges && (node as Node).outEdges.length > 0) {
                for (const edge of (node as Node).outEdges) {
                    const internalConnector: Connector = this.diagram.nameTable[`${edge}`];
                    if (this.loopedgesMapper.has(internalConnector) && this.loopedgesMapper.get(internalConnector)) {
                        if (modifiedConnectors.indexOf(internalConnector) === -1) {
                            this.updateLoopConnector(internalConnector);
                            modifiedConnectors.push(internalConnector);
                        }
                    } else {
                        let updatedPts: PointModel[] = [];
                        if ((node as Node).outEdges.length > 1) {
                            const segmentSize: number = inverseSpacing / 2.0;
                            let intermediatePoint: PointModel = null;
                            if (this.edgesMapper.has(internalConnector)) {
                                const edgePt: PointModel = this.edgesMapper.get(internalConnector)[0];
                                if (edgePt) {
                                    intermediatePoint = { x: edgePt.x + this.anchorX, y: edgePt.y + this.anchorY };
                                }
                            }
                            internalConnector.segments = [];
                            internalConnector.intermediatePoints = [];
                            let pts: PointModel[] = [internalConnector.sourcePoint, internalConnector.targetPoint];
                            if (isVertical) {
                                updatedPts = this.updateVerticalConnectorSegments(internalConnector, pts);
                                pts = this.updateConnectorPoints(updatedPts, segmentSize, intermediatePoint, transModelBounds);
                            } else {
                                updatedPts = this.updateHorizontalSegments(internalConnector, pts);
                                pts = this.updateConnectorPoints(updatedPts, segmentSize, intermediatePoint, transModelBounds);
                            }
                            if (pts.length > 2) {
                                this.updatePoints(pts, internalConnector);
                            }
                            modifiedConnectors.push(internalConnector);
                        }
                    }
                }
            }

            if ((node as Node).inEdges && (node as Node).inEdges.length > 1) {
                for (const edge of (node as Node).inEdges) {
                    const internalConnector: Connector = this.diagram.nameTable[`${edge}`];
                    if (modifiedConnectors.indexOf(internalConnector) === -1) {
                        (internalConnector.segments[0] as any).points = [];
                        if (this.loopedgesMapper.has(internalConnector) && this.loopedgesMapper.get(internalConnector)) {
                            this.updateLoopConnector(internalConnector);
                            modifiedConnectors.push(internalConnector);
                        } else {
                            if ((node as Node).inEdges.length > 1) {
                                const segmentSize: number = inverseSpacing / 2.0;
                                let intermediatePoint: PointModel = null;
                                if (this.edgesMapper.has(internalConnector) && modifiedConnectors.indexOf(internalConnector) === -1) {
                                    const edgePt: Point = this.edgesMapper.get(internalConnector)[0] as Point;
                                    if (edgePt) {
                                        intermediatePoint = { x: edgePt.x + this.anchorX, y: edgePt.y + this.anchorY };
                                    }
                                }
                                internalConnector.segments = [];
                                internalConnector.intermediatePoints = [];
                                let pts: PointModel[] = [internalConnector.targetPoint, internalConnector.sourcePoint];
                                let updatedPts: PointModel[] = [];

                                if (isVertical) {
                                    updatedPts = this.updateVerticalConnectorSegments(internalConnector, pts);
                                } else {
                                    updatedPts = this.updateHorizontalSegments(internalConnector, pts);
                                }

                                pts = this.updateConnectorPoints(updatedPts, segmentSize, intermediatePoint, transModelBounds);
                                pts.reverse();
                                if (pts.length > 2) {
                                    this.updatePoints(pts, internalConnector);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private updateAnchor(bounds: { width: number; height: number; x: number; y: number }): void {
        const viewPort: any = {
            width: this.diagram.scrollSettings.viewPortWidth,
            height: this.diagram.scrollSettings.viewPortHeight
        };

        if (this.orientation === 'TopToBottom') {
            this.anchorX = viewPort.width / 2 - bounds.width / 2 - bounds.x;
            this.anchorY = this.margin.top;
        } else {
            this.anchorX = this.margin.left;
            this.anchorY = viewPort.height / 2 - bounds.height / 2 - bounds.y;
        }

        if (this.rootNodes.length === 1) {
            const fixedNode: NodeModel = this.rootNodes[0]; // Assuming rootNodes is defined elsewhere
            const fixedNodeGeometry: Rect = (this.vertexMapper.get(fixedNode.id) as FlowChartVertex).geometry; // Assuming vertexMapper and its usage are defined elsewhere
            const offsetX: number = fixedNodeGeometry.x + fixedNodeGeometry.width / 2;
            const offsetY: number = fixedNodeGeometry.y + fixedNodeGeometry.height / 2;
            const dx: number = offsetX - (bounds.x + bounds.width / 2);
            const dy: number = offsetY - (bounds.y + bounds.height / 2);

            if (this.orientation === 'TopToBottom') {
                this.anchorX -= dx;
            } else {
                this.anchorY -= dy;
            }
        }
    }

    private updateConnectorPoints(
        connectorPoints: PointModel[],
        startSegmentSize: number,
        intermediatePoint: PointModel | null,
        layoutBounds: Rect
    ): PointModel[] {
        const isHorizontal: boolean = this.orientation === 'LeftToRight';
        const pts: PointModel[] = [...connectorPoints];

        // Helper function to find angle between two points
        function findAngle(point1: PointModel, point2: PointModel): number {
            return Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
        }

        // Function to find the distance (length) between two points
        function findLength(point1: PointModel, point2: PointModel): number {
            const dx: number = point2.x - point1.x;
            const dy: number = point2.y - point1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // Helper function to transform a point
        function transform(point: PointModel, length: number, angle: number): PointModel {
            const rad: number = angle * (Math.PI / 180);
            const newX: number = point.x + length * Math.cos(rad);
            const newY: number = point.y + length * Math.sin(rad);
            return { x: newX, y: newY };
        }

        if (pts.length > 2) {
            const newPt: PointModel = transform(pts[0], startSegmentSize, findAngle(pts[0], pts[1]));
            const nextPt: PointModel = transform(newPt, findLength(newPt, pts[1]), findAngle(newPt, pts[2]));
            pts.splice(1, 0, nextPt);
            pts.splice(1, 0, newPt);
            pts.splice(3, 2);

            if (intermediatePoint != null) {
                const index: number = 2;
                const ptsCount: number = pts.length;
                const newPt1: PointModel = transform(
                    pts[ptsCount - 1],
                    startSegmentSize,
                    findAngle(pts[ptsCount - 1], pts[ptsCount - 2])
                );
                pts.splice(ptsCount - 1, 0, newPt1);

                while (index < pts.length - 2) {
                    pts.splice(index, 1);
                }

                const edgePt: PointModel = intermediatePoint;
                this.inflate(layoutBounds, layoutBounds.width, layoutBounds.height);
                if (isHorizontal) {
                    const line1: PointModel[] = [{ x: layoutBounds.left, y: edgePt.y }, { x: layoutBounds.right, y: edgePt.y }];
                    const line2: PointModel[] = [{ x: pts[1].x, y: layoutBounds.top }, { x: pts[1].x, y: layoutBounds.bottom }];
                    const line3: PointModel[] = [{ x: newPt1.x, y: layoutBounds.top }, { x: newPt1.x, y: layoutBounds.bottom }];

                    let intercepts1: PointModel[] = [];
                    let intercepts2: PointModel[] = [];

                    // Dummy function calls, replace with actual implementation or mock
                    intercepts1 = this.diagram.commandHandler.intersect(line1, line2, false);
                    intercepts2 = this.diagram.commandHandler.intersect(line1, line3, false);

                    if (intercepts2.length) {
                        pts.splice(2, 0, intercepts2[0]);
                    }

                    if (intercepts1.length) {
                        pts.splice(2, 0, intercepts1[0]);
                    }
                } else {
                    const line1: PointModel[] = [{ x: edgePt.x, y: layoutBounds.top }, { x: edgePt.x, y: layoutBounds.bottom }];
                    const line2: PointModel[] = [{ x: layoutBounds.left, y: pts[1].y }, { x: layoutBounds.right, y: pts[1].y }];
                    const line3: PointModel[] = [{ x: layoutBounds.left, y: newPt1.y }, { x: layoutBounds.right, y: newPt1.y }];

                    let intercepts1: PointModel[] = [];
                    let intercepts2: PointModel[] = [];

                    // Dummy function calls, replace with actual implementation or mock
                    intercepts1 = this.diagram.commandHandler.intersect(line1, line2, false);
                    intercepts2 = this.diagram.commandHandler.intersect(line1, line3, false);

                    if (intercepts2.length) {
                        pts.splice(2, 0, intercepts2[0]);
                    }

                    if (intercepts1.length) {
                        pts.splice(2, 0, intercepts1[0]);
                    }
                }
            }
        } else if (pts.length === 2 && intermediatePoint != null) {
            const startPt: PointModel = pts[0];
            const endPt: PointModel = pts[1];
            const lineAngle: number = findAngle(pts[0], pts[1]);
            const newPt1: PointModel = transform(startPt, startSegmentSize, lineAngle);
            const newPt2: PointModel = transform(endPt, startSegmentSize, (lineAngle + 180) % 360);
            pts.splice(1, 0, newPt2);

            if (isHorizontal) {
                const nextPt1: PointModel = { x: newPt1.x, y: intermediatePoint.y };
                const nextPt2: PointModel = { x: newPt2.x, y: intermediatePoint.y };
                pts.splice(1, 0, nextPt2);
                pts.splice(1, 0, nextPt1);
            } else {
                const nextPt1: PointModel = { x: intermediatePoint.x, y: newPt1.y };
                const nextPt2: PointModel = { x: intermediatePoint.x, y: newPt2.y };
                pts.splice(1, 0, nextPt2);
                pts.splice(1, 0, nextPt1);
            }

            pts.splice(1, 0, newPt1);
        }

        return pts;
    }


    private inflate(rect: Rect, width: number, height: number): void {

        rect.x -= width;
        rect.y -= height;
        rect.width += 2 * width;
        rect.height += 2 * height;
    }

    private updateHorizontalSegments(internalConnector: Connector, pts: PointModel[]): PointModel[] {
        let updatedPts: PointModel[] = [];
        const sourcenode: NodeModel = this.diagram.nameTable[internalConnector.sourceID];
        const targetnode: NodeModel = this.diagram.nameTable[internalConnector.targetID];
        const decisionNode: boolean = (this.vertexMapper.get(sourcenode.id) as FlowChartVertex).isDecisionNode;

        if (decisionNode && !this.contains({ x: sourcenode.offsetX, y: targetnode.offsetY }, sourcenode.wrapper.bounds)) {
            if (sourcenode.offsetY < targetnode.offsetY) {
                const spoint1: number = sourcenode.wrapper.bounds.bottom;
                const spoint2: number = sourcenode.offsetX;
                const tpoint1: number = targetnode.wrapper.bounds.left;
                const tpoint2: number = targetnode.offsetY;
                updatedPts.push({ x: spoint2, y: spoint1 });
                updatedPts.push({ x: spoint2, y: tpoint2 });
                updatedPts.push({ x: tpoint1, y: tpoint2 });
            } else if (sourcenode.offsetY > targetnode.offsetY) {
                const spoint1: number = sourcenode.wrapper.bounds.top;
                const spoint2: number = sourcenode.offsetX;
                const tpoint1: number = targetnode.wrapper.bounds.left;
                const tpoint2: number = targetnode.offsetY;
                updatedPts.push({ x: spoint2, y: spoint1 });
                updatedPts.push({ x: spoint2, y: tpoint2 });
                updatedPts.push({ x: tpoint1, y: tpoint2 });
            } else {
                updatedPts = pts;
            }
        } else {
            updatedPts = pts;
        }

        return updatedPts;
    }

    private updateVerticalConnectorSegments(internalConnector: Connector, pts: PointModel[]): PointModel[] {
        let updatedPts: PointModel[] = [];
        const sourcenode: NodeModel = this.diagram.nameTable[internalConnector.sourceID];
        const targetnode: NodeModel = this.diagram.nameTable[internalConnector.targetID];
        const decisionNode: boolean = (this.vertexMapper.get(sourcenode.id) as FlowChartVertex).isDecisionNode;

        if (decisionNode && !this.contains({ x: targetnode.offsetX, y: sourcenode.offsetY }, sourcenode.wrapper.bounds)) {
            if (sourcenode.offsetX < targetnode.offsetX) {
                const spoint1: number = sourcenode.wrapper.bounds.right;
                const spoint2: number = sourcenode.offsetY;
                const tpoint1: number = targetnode.wrapper.bounds.top;
                const tpoint2: number = targetnode.offsetY;
                updatedPts.push({ x: spoint1, y: spoint2 });
                updatedPts.push({ x: targetnode.offsetX, y: spoint2 });
                updatedPts.push({ x: tpoint1, y: tpoint2 });
            } else if (sourcenode.offsetX > targetnode.offsetX) {
                const spoint1: number = sourcenode.wrapper.bounds.left;
                const spoint2: number = sourcenode.offsetY;
                const tpoint1: number = targetnode.wrapper.bounds.top;
                const tpoint2: number = targetnode.offsetY;
                updatedPts.push({ x: spoint1, y: spoint2 });
                updatedPts.push({ x: targetnode.offsetX, y: spoint2 });
                updatedPts.push({ x: tpoint1, y: tpoint2 });
            } else {
                updatedPts = pts;
            }
        } else {
            updatedPts = pts;
        }

        if (updatedPts.length > 2) {
            const point: PointModel = updatedPts[1];
            this.diagram.nodes.forEach((node: NodeModel) => {
                if (this.contains(point, node.wrapper.bounds)) {
                    updatedPts[1] = { x: node.wrapper.bounds.left - 5, y: node.offsetY };
                    updatedPts.splice(2, 0, { x: node.wrapper.bounds.left - 5, y: node.wrapper.bounds.bottom + 5 });
                }
            });
        }

        return updatedPts;
    }

    private getModelBounds(nodes: FlowChartVertex[]): Rect {
        const rect: Rect = new Rect(0, 0, 0, 0);
        nodes = Array.from(nodes);
        nodes.forEach((vertex: FlowChartVertex) => {
            const geo: Rect = vertex.geometry;
            rect.uniteRect(geo);
        });
        return rect;
    }

    private createVertex(node: Node): FlowChartVertex {
        const nodeWidth: number = isNaN(node.width) ? node.wrapper.bounds.width : node.width;
        const nodeHeight: number = isNaN(node.height) ? node.wrapper.bounds.height : node.height;
        const geometry: Rect = new Rect(0, 0, nodeWidth, nodeHeight);
        const inEdges: IConnector[] = [];
        const outEdges: IConnector[] = [];
        let branches: any = { isYesBranch: false, isNoBranch: false };

        if (node.inEdges != null) {
            for (const edge of node.inEdges) {
                const con: Connector = this.diagram.nameTable[`${edge}`];
                if (con) {
                    inEdges.push(con);
                }
            }
        }

        if (node.outEdges != null) {
            for (const edge of node.outEdges) {
                const con: Connector = this.diagram.nameTable[`${edge}`];
                if (con) {
                    outEdges.push(con);
                }
            }
        }

        const isYesBranch: boolean = branches.isYesBranch;
        const isNoBranch: boolean = branches.isNoBranch;


        if (inEdges != null) {
            inEdges.forEach((inEdge: IConnector) => {
                branches = this.checkForYesOrNoBranch(inEdge, isYesBranch, isNoBranch);
            });
        }

        if (outEdges != null) {
            outEdges.forEach((outEdge: IConnector) => {
                this.edgesMapper.set(outEdge, []);
                this.loopedgesMapper.set(outEdge, false);
            });
        }
        const vert: FlowChartVertex = {
            id: node.id,
            geometry: geometry,
            inEdges: inEdges,
            layoutObjectId: {},
            outEdges: outEdges,
            item: node,
            isDecisionNode: false,
            isYesChild: branches.isYesBranch,
            isNoChild: branches.isNoBranch
        };
        return vert;
    }

    private updatePoints(pts: PointModel[], internalConnector: Connector): void {
        let pointSets: PointModel[] = [];
        const segCollection: OrthogonalSegment[] = [];
        for (let i: number = 0; i < pts.length; i++) {
            if (pts[i + 2]) {
                pointSets.push(pts[parseInt(i.toString(), 10)]);
                pointSets.push(pts[i + 1]);
                const seg: OrthogonalSegment  = {
                    type: 'Orthogonal',
                    points: pointSets,
                    length: pointSets[0].x === pointSets[1].x ? Math.abs(pointSets[0].y - pointSets[1].y)
                        : Math.abs(pointSets[0].x - pointSets[1].x),
                    direction: pointSets[0].x === pointSets[1].x ? pointSets[0].y > pointSets[1].y ? 'Top' : 'Bottom'
                        : pointSets[0].x > pointSets[1].x ? 'Left' : 'Right'
                } as OrthogonalSegment;
                pointSets = [];
                segCollection.push(seg);
            }
        }
        (internalConnector as any).segments = segCollection;
    }

    private contains(point: PointModel, bounds: Rect): boolean {
        return (point.x >= bounds.left && point.x <= bounds.right && point.y >= bounds.top && point.y <= bounds.bottom);
    }


    updateLoopConnector(internalConnector: Connector): void {
        const loopPts: PointModel[] = [];

        if (this.edgesMapper.has(internalConnector)) {
            const loopPoints: PointModel[] = this.edgesMapper.get(internalConnector) as PointModel[];
            if (loopPoints) {
                for (const loopPt of loopPoints) {
                    const pointX: number = loopPt.x + this.anchorX;
                    const pointY: number = loopPt.y + this.anchorY;
                    loopPts.push({ x: pointX, y: pointY });
                }
            }
        }

        loopPts.reverse();

        const pts: PointModel[] = [];
        const firstPt: PointModel = loopPts[0];
        const lastPt: PointModel = loopPts[loopPts.length - 1];
        const sourceNode: NodeModel = this.diagram.nameTable[internalConnector.sourceID];
        const targetNode: NodeModel = this.diagram.nameTable[internalConnector.targetID];
        const srcBounds: Rect = sourceNode.wrapper.bounds;
        const tarBounds: Rect = targetNode.wrapper.bounds;
        const srcNode: NodeModel = sourceNode;
        const tarNode: NodeModel = targetNode;

        if (this.orientation === 'TopToBottom') {
            const target: FlowChartVertex[] = Array.from((this.vertexMapper as any).values()).filter((e: FlowChartVertex) =>
                (e.item as Node).wrapper.bounds.containsPoint({ x: (e.item as Node).wrapper.bounds.x, y: srcNode.offsetY }) &&
                srcNode.id !== e.item.id
            ) as FlowChartVertex[];

            const max: number = Math.max(firstPt.x, lastPt.x);
            const isSiblingsInRight: boolean = (target.length > 0 && (target[0].item as Node).wrapper.bounds.x > srcBounds.x);

            pts.push({ x: (!isSiblingsInRight && max > srcBounds.right) ? srcBounds.right : srcBounds.left, y: srcNode.offsetY });
            pts.push({ x: isSiblingsInRight ? pts[0].x - (srcBounds.width / 2) : max, y: srcNode.offsetY });
            pts.push({ x: isSiblingsInRight ? pts[0].x - (srcBounds.width / 2) : max, y: tarNode.offsetY });
            pts.push({ x: (!isSiblingsInRight && max > tarBounds.right) ? tarBounds.right : tarBounds.left, y: tarNode.offsetY });
        } else {
            const target: FlowChartVertex[] = Array.from((this.vertexMapper as any).values()).filter((e: FlowChartVertex) =>
                (e.item as Node).wrapper.bounds.containsPoint({ x: srcNode.offsetX, y: (e.item as Node).wrapper.bounds.y }) &&
                srcNode.id !== e.item.id
            ) as FlowChartVertex[];

            const isSiblingsInBottom: boolean = (target.length > 0 && (target[0].item as Node).wrapper.bounds.y > srcBounds.y);
            const max: number = Math.max(firstPt.y, lastPt.y);

            pts.push({ x: srcNode.offsetX, y: (!isSiblingsInBottom && max > srcBounds.bottom) ? srcBounds.bottom : srcBounds.top });
            pts.push({ x: srcNode.offsetX, y: isSiblingsInBottom ? pts[0].y - (srcBounds.height / 2) : max });
            pts.push({ x: tarNode.offsetX, y: isSiblingsInBottom ? pts[0].y - (srcBounds.height / 2) : max });
            pts.push({ x: tarNode.offsetX, y: (!isSiblingsInBottom && max > tarBounds.bottom) ? tarBounds.bottom : tarBounds.top });
        }

        this.updatePoints(pts, internalConnector);
    }

    private checkForYesOrNoBranch(edge: IConnector, isYesBranch: boolean, isNoBranch: boolean):
    { isYesBranch: boolean, isNoBranch: boolean } {
        if ((edge as ConnectorModel).annotations && (edge as ConnectorModel).annotations.length) {
            (edge as ConnectorModel).annotations.forEach((annotation: PathAnnotation) => {
                if (typeof annotation.content === 'string') {
                    const text: string = annotation.content.toString();
                    this.yesBranchValues.forEach((branchText: string) => {
                        if (text.localeCompare(branchText, undefined, { sensitivity: 'accent' }) === 0) {
                            isYesBranch = true;
                            return;
                        }
                    });
                    this.noBranchValues.forEach((branchText: string) => {
                        if (text.localeCompare(branchText, undefined, { sensitivity: 'accent' }) === 0) {
                            isNoBranch = true;
                            return;
                        }
                    });
                }
            });
        }
        return { isYesBranch, isNoBranch };
    }

    private getTreeVertices(root: FlowChartVertex | null, seenVertices: FlowChartVertex[], unseenVertices: FlowChartVertex[]): void {
        if (root != null && seenVertices.indexOf(root) === -1) {
            seenVertices.push(root);
            unseenVertices = unseenVertices.filter((vertex: FlowChartVertex) => vertex !== root);
            const children: string[] = root.item.outEdges;

            if (children.length === 2) {
                const c1: NodeModel = this.diagram.nameTable[this.diagram.nameTable[children[0]].targetID];
                const c2: NodeModel = this.diagram.nameTable[this.diagram.nameTable[children[1]].targetID];
                const childVertex1: FlowChartVertex = this.vertexMapper.get(c1.id) as FlowChartVertex;
                const childVertex2: FlowChartVertex = this.vertexMapper.get(c2.id) as FlowChartVertex;

                if (childVertex1 && childVertex2) {
                    let hasYesChild: boolean = childVertex1.isYesChild || childVertex2.isYesChild;
                    let hasNoChild: boolean = childVertex1.isNoChild || childVertex2.isNoChild;

                    if (hasYesChild && !hasNoChild) {
                        if (childVertex1.isYesChild) {
                            childVertex2.isNoChild = true;
                        } else {
                            childVertex1.isNoChild = true;
                        }
                        hasNoChild = true;
                    } else if (!hasYesChild && hasNoChild) {
                        if (childVertex1.isNoChild) {
                            childVertex2.isYesChild = true;
                        } else {
                            childVertex1.isYesChild = true;
                        }
                        hasYesChild = true;
                    }

                    root.isDecisionNode = hasYesChild;
                }
            }

            root.outEdges.forEach((outConnector: IConnector) => {
                const child: NodeModel = this.diagram.nameTable[outConnector.targetID];
                const childVertex: FlowChartVertex = this.vertexMapper.get(child.id) as FlowChartVertex;
                if (childVertex != null) {
                    if (!root.isDecisionNode) {
                        childVertex.isYesChild = false;
                        childVertex.isNoChild = false;
                    }
                    this.getTreeVertices(childVertex, seenVertices, unseenVertices);
                }
            });
        }
    }



    /**
     * Initializes the edges collection of the vertices\
     *
     * @returns {  IConnector[] }    Initializes the edges collection of the vertices\
     * @param {FlowChartVertex} node - provide the node value.
     * @private
     */
    public getEdges(node: FlowChartVertex): IConnector[] {
        const edges: IConnector[] = [];
        if (node !== null && node !== undefined) {
            for (const inEdge of node.inEdges) {
                edges.push(inEdge);
            }

            for (const outEdge of node.outEdges) {
                edges.push(outEdge);
            }
        }
        return edges;
    }

    /**
     * Returns the source/target vertex of the given connector \
     *
     * @returns {  FlowChartVertex }    Returns the source/target vertex of the given connector \
     * @param {IConnector} edge - provide the node value.
     * @param {boolean} source - provide the node value.
     * @private
     */
    public getVisibleTerminal(edge: ConnectorModel, source: boolean): FlowChartVertex {
        //differ from complex-hierarchical-tree.ts
        const nodeWrapper: string = source ? edge.sourceID : edge.targetID;
        return this.vertexMapper.get(nodeWrapper as string) as FlowChartVertex;
    }

    /**
     * used to get the edges between the given source and target  \
     *
     * @returns {  IConnector[] }    used to get the edges between the given source and target  .\
     * @param {FlowChartVertex} source - provide the angle value.
     * @param { FlowChartVertex} target - provide the angle value.
     * @param { boolean} directed - provide the angle value.
     * @private
     */
    public getEdgesBetween(source: FlowChartVertex, target: FlowChartVertex, directed: boolean): IConnector[] {
        const edges: IConnector[] = this.getEdges(source);
        const result: IConnector[] = [];
        for (let i: number = 0; i < edges.length; i++) {
            const src: FlowChartVertex = this.getVisibleTerminal(edges[parseInt(i.toString(), 10)], true);
            const trg: FlowChartVertex = this.getVisibleTerminal(edges[parseInt(i.toString(), 10)], false);
            if ((src.id === source.id && trg.id === target.id)) {
                result.push(edges[parseInt(i.toString(), 10)]);
            }
        }
        return result;
    }

    /**
     *To destroy the FlowchartLayout
     *
     * @returns {void} To destroy the FlowchartLayout
     */

    public destroy(): void {
        /**
         * Destroys the FlowchartLayout module
         */
    }

    /**
     * @returns { string } toBounds method .\
     * Get getModuleName name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'FlowchartLayout';
    }
}


export interface FlowChartVertex {
    id: string;
    geometry: Rect;
    inEdges: IConnector[];
    layoutObjectId: {};
    outEdges: IConnector[];
    item: INode;
    isDecisionNode: boolean;
    isYesChild: boolean;
    isNoChild: boolean;
}

export interface InternalVertex {
    id: string;
    cell: FlowChartVertex;
    internalOutEdges: InternalEdges[];
    internalInEdges: InternalEdges[];
    hashCode: number[];
    tempRank: number;
    maxRank: number;
    minRank: number;
    identicalSibling: string[];
}

export interface InternalEdges {
    connectorIds: string[];
    edges: IConnector[];
    source: InternalVertex;
    target: InternalVertex;
    isReversed: boolean;
    tempRank: number;
    maxRank: number;
    minRank: number;
    ids: string[];
}

export interface MatrixCellGroup {
    parents: MatrixCellGroup[];
    children: MatrixCellGroup[];
    visitedParents: MatrixCellGroup[];
    visitedChildren: MatrixCellGroup[];
    ignoredChildren: MatrixCellGroup[];
    loopChildren: MatrixCellGroup[];
    cells: InternalVertex[] | InternalEdges[];
    level: number;
    initialOffset: number;
    size: number;
    offset: number;
    key?: string[] | string;
    value?: MatrixCellGroup;
}

interface LayOutData extends FlowchartLayout {
    nodeWithMultiEdges: NodeModel[];
    transModelBounds: Rect;
    inverseSpacing: number;
}

