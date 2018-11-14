import { INode, IConnector, Layout } from './layout-base';
import { PointModel } from '../primitives/point-model';

/**
 * Connects diagram objects with layout algorithm
 */
export class ComplexHierarchicalTree {
    /**
     * Constructor for the hierarchical tree layout module
     * @private
     */

    constructor() {
        //constructs the layout module
    }

    /**
     * To destroy the hierarchical tree module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the layout
         */
        return 'ComplexHierarchicalTree';
    }

    /**   @private  */
    public doLayout(nodes: INode[], nameTable: {}, layout: Layout, viewPort: PointModel): void {
        new HierarchicalLayoutUtil().doLayout(nodes, nameTable, layout, viewPort);
    }
}

/**
 * Utility that arranges the nodes in hierarchical structure
 */
class HierarchicalLayoutUtil {

    private nameTable: Object = {};

    /**
     * Holds the collection vertices, that are equivalent to nodes to be arranged
     */
    private vertices: Vertex[];

    private crossReduction: CrossReduction = new CrossReduction();
    /**
     * Defines a vertex that is equivalent to a node object
     */
    private createVertex(node: INode, value: string, x: number, y: number, width: number, height: number): Vertex {
        let geometry: Rect = { x: x, y: y, width: width, height: height };
        let vertex: Vertex = {
            value: value, geometry: geometry, name: value, vertex: true,
            inEdges: node.inEdges.slice(), outEdges: node.outEdges.slice()
        };
        return vertex;
    }

    /**
     * Initializes the edges collection of the vertices
     * @private
     */
    public getEdges(node: Vertex): IConnector[] {
        let edges: IConnector[] = [];
        if (node) {
            for (let i: number = 0; node.inEdges.length > 0 && i < node.inEdges.length; i++) {
                edges.push(this.nameTable[node.inEdges[i]]);
            }
            for (let i: number = 0; node.outEdges.length > 0 && i < node.outEdges.length; i++) {
                edges.push(this.nameTable[node.outEdges[i]]);
            }
        }
        return edges;
    }

    /**
     * Finds the root nodes of the layout
     */
    private findRoots(vertices: {}): Vertex[] {
        let roots: Vertex[] = [];
        let best: Vertex = null;
        let maxDiff: number = -100000;
        for (let i of Object.keys(vertices)) {
            let cell: Vertex = vertices[i];
            let conns: IConnector[] = this.getEdges(cell);
            let outEdges: number = 0;
            let inEdges: number = 0;
            for (let k: number = 0; k < conns.length; k++) {
                let src: Vertex = this.getVisibleTerminal(conns[k], true);
                if (src.name === cell.name) {
                    outEdges++;
                } else {
                    inEdges++;
                }
            }
            if (inEdges === 0 && outEdges > 0) {
                roots.push(cell);
            }
            let diff: number = outEdges - inEdges;
            if (diff > maxDiff) {
                maxDiff = diff;
                best = cell;
            }
        }
        if (roots.length === 0 && best != null) {
            roots.push(best);
        }
        return roots;
    }

    /**
     * Returns the source/target vertex of the given connector
     * @private
     */
    public getVisibleTerminal(edge: IConnector, source: boolean): Vertex {
        let terminalCache: INode = this.nameTable[edge.targetID];
        if (source) {
            terminalCache = this.nameTable[edge.sourceID];
        }
        for (let i: number = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].name === terminalCache.id) {
                return this.vertices[i];
            }
        }
        return null;
    }

    /**
     * Traverses each sub tree, ensures there is no cycle in traversing
     * @private
     */
    public traverse(vertex: Vertex, directed: boolean, edge: IConnector, currentComp: {}, hierarchyVertices: {}[], filledVertices: {}): {} {
        if (vertex != null) {
            let vertexID: string = vertex.name;
            if ((filledVertices == null ? true : filledVertices[vertexID] != null)) {
                if (currentComp[vertexID] == null) {
                    currentComp[vertexID] = vertex;
                }
                if (filledVertices != null) {
                    delete filledVertices[vertexID];
                }
                let edges: IConnector[] = this.getEdges(vertex);
                let edgeIsSource: boolean[] = [];
                for (let i: number = 0; i < edges.length; i++) {
                    edgeIsSource[i] = this.getVisibleTerminal(edges[i], true) === vertex;
                }
                for (let i: number = 0; i < edges.length; i++) {
                    if (!directed || edgeIsSource[i]) {
                        let next: Vertex = this.getVisibleTerminal(edges[i], !edgeIsSource[i]);
                        let netCount: number = 1;
                        for (let j: number = 0; j < edges.length; j++) {
                            if (j === i) {
                                continue;
                            } else {
                                let isSource2: boolean = edgeIsSource[j];
                                let otherTerm: Vertex = this.getVisibleTerminal(edges[j], !isSource2);
                                if (otherTerm === next) {
                                    if (isSource2) {
                                        netCount++;
                                    } else {
                                        netCount--;
                                    }
                                }
                            }
                        }
                        if (netCount >= 0) {
                            currentComp = this.traverse(next, directed, edges[i], currentComp, hierarchyVertices, filledVertices);
                        }
                    }
                }
            } else {
                if (currentComp[vertexID] == null) {
                    // We've seen this vertex before, but not in the current component This component and the one it's in need to be merged
                    for (let i: number = 0; i < hierarchyVertices.length; i++) {
                        let comp: {} = hierarchyVertices[i];
                        if (comp[vertexID] != null) {
                            for (let key of Object.keys(comp)) {
                                currentComp[key] = comp[key];
                            }
                            // Remove the current component from the hierarchy set
                            hierarchyVertices.splice(i, 1);
                            return currentComp;
                        }
                    }
                }
            }
        }
        return currentComp;
    }

    /**
     * Returns the bounds of the given vertices
     */
    private getModelBounds(nodes: Vertex[]): Rect {
        nodes = nodes.slice();
        let rect: Rect = null; let rect1: Rect = null;
        for (let i: number = 0; i < nodes.length; i++) {
            rect = nodes[i].geometry;
            if (rect1) {
                let right: number = Math.max(rect1.x + rect1.width, rect.x + rect.width);
                let bottom: number = Math.max(rect1.y + rect1.height, rect.y + rect.height);
                rect1.x = Math.min(rect1.x, rect.x);
                rect1.y = Math.min(rect1.y, rect.y);
                rect1.width = right - rect1.x;
                rect1.height = bottom - rect1.y;
            } else {
                rect1 = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
            }
        }
        return rect1;
    }

    /**
     * Initializes the layouting process
     * @private
     */
    public doLayout(nodes: INode[], nameTable: {}, layoutProp: Layout, viewPort: PointModel): void {
        this.nameTable = nameTable;
        let layout: LayoutProp = {
            horizontalSpacing: layoutProp.horizontalSpacing, verticalSpacing: layoutProp.verticalSpacing,
            orientation: layoutProp.orientation, marginX: layoutProp.margin.left, marginY: layoutProp.margin.top
        };
        if (layout.orientation === 'BottomToTop') {
            layout.marginY = -layoutProp.margin.top;
        } else if (layout.orientation === 'RightToLeft') {
            layout.marginX = -layoutProp.margin.left;
        }
        this.vertices = [];
        let filledVertexSet: {} = {};
        for (let i: number = 0; i < nodes.length; i++) {
            let node: Vertex = this.createVertex(nodes[i], nodes[i].id, 0, 0, nodes[i].actualSize.width, nodes[i].actualSize.height);
            this.vertices.push(node);
            filledVertexSet[node.name] = node;
        }
        let hierarchyVertices: {}[] = [];
        let candidateRoots: Vertex[];
        candidateRoots = this.findRoots(filledVertexSet);
        for (let i: number = 0; i < candidateRoots.length; i++) {
            let vertexSet: {} = {};
            hierarchyVertices.push(vertexSet);
            this.traverse(candidateRoots[i], true, null, vertexSet, hierarchyVertices, filledVertexSet);
        }
        let limit: Margin = { marginX: 0, marginY: 0 };
        for (let i: number = 0; i < hierarchyVertices.length; i++) {
            let vertexSet: {} = hierarchyVertices[i];
            let tmp: Vertex[] = [];
            for (let key of Object.keys(vertexSet)) {
                tmp.push(vertexSet[key]);
            }
            let model: MultiParentModel = new MultiParentModel(this, tmp, candidateRoots, layout);
            this.cycleStage(model);
            this.layeringStage(model);
            this.crossingStage(model);
            limit = this.placementStage(model, limit.marginX, limit.marginY);
        }
        let modelBounds: Rect = this.getModelBounds(this.vertices);
        let trnsX: number = (viewPort.x - modelBounds.width) / 2;
        for (let i: number = 0; i < this.vertices.length; i++) {
            let clnode: Vertex = this.vertices[i];
            if (clnode) {//Check what is node.source/node.target -  && !clnode.source && !clnode.target) {
                let dnode: INode = this.nameTable[clnode.name];
                dnode.offsetX = 0;
                dnode.offsetY = 0;
                //initialize layout
                let dx: number = (clnode.geometry.x - (dnode.offsetX - (dnode.actualSize.width / 2))) + layout.marginX;
                let dy: number = (clnode.geometry.y - (dnode.offsetY - (dnode.actualSize.height / 2))) + layout.marginY;
                let x: number = dx; let y: number = dy;
                if (layout.orientation === 'BottomToTop') {
                    y = modelBounds.height - dy;
                } else if (layout.orientation === 'RightToLeft') {
                    x = modelBounds.width - dx;
                }
                x += trnsX;
                dnode.offsetX += x - dnode.offsetX;
                dnode.offsetY += y - dnode.offsetY;
            }
        }
    }

    /**
     * Handles positioning the nodes
     */
    private placementStage(model: MultiParentModel, marginX: number, marginY: number): Margin {
        let placementStage: PlacementStage = this.coordinateAssignment(marginX, marginY, parent, model);
        placementStage.model = model;
        placementStage.widestRankValue = null;
        this.placementStageExecute(placementStage);
        return {
            marginX: placementStage.marginX + model.layout.horizontalSpacing,
            marginY: placementStage.marginY + model.layout.verticalSpacing
        };
    }

    /**
     * Initializes the layout properties for positioning 
     */
    private coordinateAssignment(marginX: number, marginY: number, parent: {}, model: MultiParentModel): PlacementStage {
        let plalementChange: PlacementStage = {};
        if (model.layout.orientation === 'TopToBottom' || model.layout.orientation === 'BottomToTop') {
            plalementChange.horizontalSpacing = model.layout.horizontalSpacing;
            plalementChange.verticalSpacing = model.layout.verticalSpacing;
        } else {
            plalementChange.horizontalSpacing = model.layout.verticalSpacing;
            plalementChange.verticalSpacing = model.layout.horizontalSpacing;
        }
        plalementChange.orientation = 'north';
        //Removed the conditions here. So check here in case of any issue
        plalementChange.marginX = plalementChange.marginX = marginX;
        plalementChange.marginY = plalementChange.marginY = marginY;
        return plalementChange;
    }

    /**
     * Calculate the largest size of the node either height or width depends upon the layoutorientation
     */
    private calculateWidestRank(plalementChange: PlacementStage, graph: {}, model: MultiParentModel): void {
        let isHorizontal: boolean = false;
        if (plalementChange.model.layout.orientation === 'LeftToRight' || plalementChange.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        let offset: number = -plalementChange.verticalSpacing;
        let lastRankMaxCellSize: number = 0.0;
        plalementChange.rankSizes = [];
        plalementChange.rankOffset = [];
        for (let rankValue: number = model.maxRank; rankValue >= 0; rankValue--) {
            let maxCellSize: number = 0.0;
            let rank: (IVertex | IEdge)[] = model.ranks[rankValue];
            let localOffset: number = isHorizontal ? plalementChange.marginY : plalementChange.marginX;
            for (let i: number = 0; i < rank.length; i++) {
                let node: IVertex | IEdge = rank[i];
                if (this.crossReduction.isVertex(node)) {
                    let vertex: IVertex = node as IVertex;
                    if (vertex.cell && (vertex.cell.inEdges || vertex.cell.outEdges)) {
                        let obj: INode = this.nameTable[vertex.cell.name];
                        vertex.width = obj.actualSize.width;
                        vertex.height = obj.actualSize.height;
                        maxCellSize = Math.max(maxCellSize, (isHorizontal ? vertex.width : vertex.height));
                    }
                } else {
                    if (node as IEdge) {
                        let edge: IEdge = node as IEdge;
                        let numEdges: number = 1;
                        if (edge.edges != null) {
                            numEdges = edge.edges.length;
                        }
                        node.width = (numEdges - 1) * 10;
                    }
                }
                if (isHorizontal) {
                    if (!node.height) {
                        node.height = 0;
                    }
                }
                // Set the initial x-value as being the best result so far
                localOffset += (isHorizontal ? node.height : node.width) / 2.0;
                this.setXY(node, rankValue, localOffset, isHorizontal ? true : false);
                this.setTempVariable(node, rankValue, localOffset);
                localOffset += ((isHorizontal ? node.height : node.width) / 2.0) + plalementChange.horizontalSpacing;
                if (localOffset > plalementChange.widestRankValue) {
                    plalementChange.widestRankValue = localOffset;
                    plalementChange.widestRank = rankValue;
                }
                plalementChange.rankSizes[rankValue] = localOffset;
            }
            plalementChange.rankOffset[rankValue] = offset;
            let distanceToNextRank: number = maxCellSize / 2.0 + lastRankMaxCellSize / 2.0 + plalementChange.verticalSpacing;
            lastRankMaxCellSize = maxCellSize;
            if (plalementChange.orientation === 'north' || plalementChange.orientation === 'west') {
                offset += distanceToNextRank;
            } else {
                offset -= distanceToNextRank;
            }
            for (let i: number = 0; i < rank.length; i++) {
                let cell: IVertex = rank[i];
                this.setXY(cell, rankValue, offset, isHorizontal ? false : true);
            }
        }
    }

    /**
     * Sets the temp position of the node on the layer
     * @private
     */
    public setTempVariable(node: IVertex, layer: number, value: number): void {
        if (this.crossReduction.isVertex(node)) {
            node.temp[0] = value;
        } else {
            node.temp[layer - node.minRank - 1] = value;
        }
    }

    /**
     * Sets the position of the vertex
     * @private
     */
    public setXY(node: IVertex, layer: number, value: number, isY: boolean): void {
        if (node && node.cell) {
            if (node.cell.inEdges || node.cell.outEdges) {
                if (isY) {
                    node.y[0] = value;
                } else {
                    node.x[0] = value;
                }
            } else {
                if (isY) {
                    node.y[layer - node.minRank - 1] = value;
                } else {
                    node.x[layer - node.minRank - 1] = value;
                }
            }
        }
    }

    /**
     * Sets geometry position of the layout node on the layout model
     */
    private rankCoordinates(stage: PlacementStage, rankValue: number, graph: {}, model: MultiParentModel): void {
        let isHorizontal: boolean = false;
        if (stage.model.layout.orientation === 'LeftToRight' || stage.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        let rank: (IVertex | IEdge)[] = model.ranks[rankValue];
        let maxOffset: number = 0.0;
        let localOffset: number = (isHorizontal ? stage.marginY : stage.marginX) + (stage.widestRankValue - stage.rankSizes[rankValue]) / 2;
        for (let i: number = 0; i < rank.length; i++) {
            let node: IVertex = rank[i];
            if (this.crossReduction.isVertex(node)) {
                let obj: INode = this.nameTable[node.cell.name];
                node.width = obj.actualSize.width;
                node.height = obj.actualSize.height;
                maxOffset = Math.max(maxOffset, node.height);
            } else {
                let edge: IEdge = node as IEdge;
                let numEdges: number = 1;
                if (edge.edges != null) {
                    numEdges = edge.edges.length;
                }
                if (isHorizontal) {
                    node.height = (numEdges - 1) * 10;
                } else {
                    node.width = (numEdges - 1) * 10;
                }
            }
            let size: number = (isHorizontal ? node.height : node.width) / 2.0;
            localOffset += size;
            this.setXY(node, rankValue, localOffset, isHorizontal ? true : false);
            this.setTempVariable(node, rankValue, localOffset);
            localOffset += (size + stage.horizontalSpacing);
        }
    }

    /**
     * sets the layout in an initial positioning.it will arange all the ranks as much as possible
     */
    private initialCoords(plalementChange: PlacementStage, facade: {}, model: MultiParentModel): void {
        this.calculateWidestRank(plalementChange, facade, model);
        // Reverse sweep direction each time from widest rank 
        for (let i: number = plalementChange.widestRank; i >= 0; i--) {
            if (i < model.maxRank) {
                this.rankCoordinates(plalementChange, i, facade, model);
            }
        }
        for (let i: number = plalementChange.widestRank + 1; i <= model.maxRank; i++) {
            if (i > 0) {
                this.rankCoordinates(plalementChange, i, facade, model);
            }
        }
    }

    /**
     * Checks whether the given node is an ancestor
     * @private
     */
    public isAncestor(node: IVertex, otherNode: IVertex): boolean {
        // Firstly, the hash code of this node needs to be shorter than the other node
        if (otherNode != null && node.hashCode != null && otherNode.hashCode != null
            && node.hashCode.length < otherNode.hashCode.length) {
            if (node.hashCode === otherNode.hashCode) {
                return true;
            }
            if (node.hashCode == null || node.hashCode == null) {
                return false;
            }
            for (let i: number = 0; i < node.hashCode.length; i++) {
                if (node.hashCode[i] !== otherNode.hashCode[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * initializes the sorter object
     */
    private weightedCellSorter(cell: IVertex, weightedValue: number): WeightedCellSorter {
        let weightedCellSorter: WeightedCellSorter = {};
        weightedCellSorter.cell = cell ? cell : null;
        weightedCellSorter.weightedValue = weightedValue ? weightedValue : 0;
        weightedCellSorter.visited = false;
        weightedCellSorter.rankIndex = null;
        return weightedCellSorter;
    }

    /**
     * Performs one node positioning in both directions
     */
    private minNode(plalementChange: PlacementStage, model: MultiParentModel): void {
        let nodeList: WeightedCellSorter[] = [];
        let map: VertexMapper = { map: {} };
        let rank: IVertex[][] = [];
        for (let i: number = 0; i <= model.maxRank; i++) {
            rank[i] = model.ranks[i];
            for (let j: number = 0; j < rank[i].length; j++) {
                let node: IVertex = rank[i][j];
                let nodeWrapper: WeightedCellSorter = this.weightedCellSorter(node, i);
                nodeWrapper.rankIndex = j;
                nodeWrapper.visited = true;
                nodeList.push(nodeWrapper);
                model.setDictionaryForSorter(map, node, nodeWrapper, true);
            }
        }
        let maxTries: number = nodeList.length * 10;
        let count: number = 0;
        let tolerance: number = 1;
        while (nodeList.length > 0 && count <= maxTries) {
            let cellWrapper: WeightedCellSorter = nodeList.shift();
            let cell: IVertex = cellWrapper.cell;
            let rankValue: number = cellWrapper.weightedValue;
            let rankIndex: number = cellWrapper.rankIndex;
            let nextLayerConnectedCells: IVertex[] = this.crossReduction.getConnectedCellsOnLayer(cell, rankValue);
            let previousLayerConnectedCells: IVertex[] = this.crossReduction.getConnectedCellsOnLayer(cell, rankValue, true);
            let nextConnectedCount: number = nextLayerConnectedCells.length;
            let prevConnectedCount: number = previousLayerConnectedCells.length;
            let medianNextLevel: number = this.medianXValue(plalementChange, nextLayerConnectedCells, rankValue + 1);
            let medianPreviousLevel: number = this.medianXValue(plalementChange, previousLayerConnectedCells, rankValue - 1);
            let numConnectedNeighbours: number = nextConnectedCount + prevConnectedCount;
            let currentPosition: number = this.crossReduction.getTempVariable(cell, rankValue);
            let cellMedian: number = currentPosition;
            if (numConnectedNeighbours > 0) {
                cellMedian = (medianNextLevel * nextConnectedCount + medianPreviousLevel * prevConnectedCount) / numConnectedNeighbours;
            }
            let positionChanged: boolean = false;
            let tempValue: number = undefined;
            if (cellMedian < currentPosition - tolerance) {
                if (rankIndex === 0) {
                    tempValue = cellMedian;
                    positionChanged = true;
                } else {
                    let leftCell: IVertex = rank[rankValue][rankIndex - 1];
                    let leftLimit: number = this.crossReduction.getTempVariable(leftCell, rankValue);
                    leftLimit = leftLimit + leftCell.width / 2 + plalementChange.intraCellSpacing + cell.width / 2;
                    if (leftLimit < cellMedian) {
                        tempValue = cellMedian;
                        positionChanged = true;
                    } else if (leftLimit < this.crossReduction.getTempVariable(cell, rankValue) - tolerance) {
                        tempValue = leftLimit;
                        positionChanged = true;
                    }
                }
            } else if (cellMedian > currentPosition + tolerance) {
                let rankSize: number = rank[rankValue].length;
                if (rankIndex === rankSize - 1) {
                    tempValue = cellMedian;
                    positionChanged = true;
                } else {
                    let rightCell: IVertex = rank[rankValue][rankIndex + 1];
                    let rightLimit: number = this.crossReduction.getTempVariable(rightCell, rankValue);
                    rightLimit = rightLimit - rightCell.width / 2 - plalementChange.intraCellSpacing - cell.width / 2;
                    if (rightLimit > cellMedian) {
                        tempValue = cellMedian;
                        positionChanged = true;
                    } else if (rightLimit > this.crossReduction.getTempVariable(cell, rankValue) + tolerance) {
                        tempValue = rightLimit;
                        positionChanged = true;
                    }
                }
            }
            if (positionChanged) {
                this.setTempVariable(cell, rankValue, tempValue);
                // Add connected nodes to map and list
                this.updateNodeList(nodeList, map, nextLayerConnectedCells, model);
                this.updateNodeList(nodeList, map, previousLayerConnectedCells, model);
            }
            if (this.crossReduction.isVertex(cellWrapper.cell)) {
                cellWrapper.visited = false;
            }
            count++;
        }
    }

    /**
     * Updates the ndoes collection
     */
    private updateNodeList(nodeList: WeightedCellSorter[], map: VertexMapper, collection: IVertex[], model: MultiParentModel): void {
        for (let i: number = 0; i < collection.length; i++) {
            let connectedCell: IVertex = collection[i];
            let connectedCellWrapper: WeightedCellSorter = model.getDictionaryForSorter(map, connectedCell);
            if (connectedCellWrapper != null) {
                if (connectedCellWrapper.visited === false) {
                    connectedCellWrapper.visited = true;
                    nodeList.push(connectedCellWrapper);
                }
            }
        }
    }

    /**
     * Calculates the node position of the connected cell on the specified rank
     */
    private medianXValue(plalementChange: PlacementStage, connectedCells: IVertex[], rankValue: number): number {
        if (connectedCells.length === 0) {
            return 0;
        }
        let medianValues: number[] = [];
        for (let i: number = 0; i < connectedCells.length; i++) {
            medianValues[i] = this.crossReduction.getTempVariable(connectedCells[i], rankValue);
        }
        medianValues.sort((a: number, b: number) => {
            return a - b;
        });

        if (connectedCells.length % 2 === 1) {
            return medianValues[Math.floor(connectedCells.length / 2)];
        } else {
            let medianPoint: number = connectedCells.length / 2;
            let leftMedian: number = medianValues[medianPoint - 1];
            let rightMedian: number = medianValues[medianPoint];
            return ((leftMedian + rightMedian) / 2);
        }
    }

    /**
     * Updates the geometry of the vertices
     */
    private placementStageExecute(plalementChange: PlacementStage): void {
        let isHorizontal: boolean = false;
        if (plalementChange.model.layout.orientation === 'LeftToRight' || plalementChange.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        plalementChange.jettyPositions = {};
        let model: MultiParentModel = plalementChange.model;
        isHorizontal ? plalementChange.currentYDelta = 0.0 : plalementChange.currentXDelta = 0.0;
        this.initialCoords(plalementChange, { model: model }, model);
        this.minNode(plalementChange, model);
        let bestOffsetDelta: number = 100000000.0;
        if (!plalementChange.maxIterations) {
            plalementChange.maxIterations = 8;
        }
        for (let i: number = 0; i < plalementChange.maxIterations; i++) {
            // if the total offset is less for the current positioning, 
            //there are less heavily angled edges and so the current positioning is used
            if ((isHorizontal ? plalementChange.currentYDelta : plalementChange.currentXDelta) < bestOffsetDelta) {
                for (let j: number = 0; j < model.ranks.length; j++) {
                    let rank: IVertex[] = model.ranks[j];
                    for (let k: number = 0; k < rank.length; k++) {
                        let cell: IVertex = rank[k];
                        this.setXY(cell, j, this.crossReduction.getTempVariable(cell, j), isHorizontal ? true : false);
                    }
                }
                bestOffsetDelta = isHorizontal ? plalementChange.currentYDelta : plalementChange.currentXDelta;
            }
            isHorizontal ? plalementChange.currentYDelta = 0 : plalementChange.currentXDelta = 0;
        }
        this.setCellLocations(plalementChange, model);
    }

    /**
     * sets the cell position in the after the layout operation
     */
    private setCellLocations(plalementChange: PlacementStage, model: MultiParentModel): void {
        let vertices: IVertex[] = this.getValues(model.vertexMapper);
        for (let i: number = 0; i < vertices.length; i++) {
            this.setVertexLocation(plalementChange, vertices[i]);
        }
    }

    /**
     * used to specify the geometrical position of the layout model cell
     */
    private garphModelsetVertexLocation(plalementChange: PlacementStage, cell: Vertex, x: number, y: number): Rect {
        let model: MultiParentModel = plalementChange.model;
        let geometry: Rect = cell.geometry;
        let result: Rect = null;
        if (geometry != null) {
            result = { x: x, y: y, width: geometry.width, height: geometry.height };
            if (geometry.x !== x || geometry.y !== y) {
                cell.geometry = result;
            }
        }
        return result;
    }

    /**
     * set the position of the specified node
     */
    private setVertexLocation(plalementChange: PlacementStage, cell: IVertex): void {
        let isHorizontal: boolean = false;
        if (plalementChange.model.layout.orientation === 'LeftToRight' || plalementChange.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        let realCell: Vertex = cell.cell;
        let positionX: number = cell.x[0] - cell.width / 2;
        let positionY: number = cell.y[0] - cell.height / 2;
        this.garphModelsetVertexLocation(plalementChange, realCell, positionX, positionY);
        if (isHorizontal) {
            if (!plalementChange.marginY) {
                plalementChange.marginY = 0;
            }
            plalementChange.marginY = Math.max(plalementChange.marginY, positionY + cell.height);
        } else {
            if (!plalementChange.marginX) {
                plalementChange.marginX = 0;
            }
            plalementChange.marginX = Math.max(plalementChange.marginX, positionX + cell.width);
        }
    }

    /**
     * get the specific value from the key value pair
     */
    private getValues(mapper: VertexMapper): {}[] {
        let list: {}[] = [];
        if (mapper.map) {
            for (let key of Object.keys(mapper.map)) {
                list.push(mapper.map[key]);
            }
        }
        return list;
    }
    /**
     * Checks and reduces the crosses in between line segments
     */
    private crossingStage(model: MultiParentModel): void {
        this.crossReduction.execute(model);
    }

    /**
     * Initializes the ranks of the vertices
     */
    private layeringStage(model: MultiParentModel): void {
        this.initialRank(model);
        this.fixRanks(model);
    }

    /**
     * determine the initial rank for the each vertex on the relevent direction
     */
    private initialRank(model: MultiParentModel): void {
        let startNodes: IVertex[] = model.startNodes;
        let internalNodes: IVertex[] = model.getDictionaryValues(model.vertexMapper);
        let startNodesCopy: IVertex[] = startNodes.slice();
        while (startNodes.length > 0) {
            let internalNode: IVertex = startNodes[0];
            let layerDeterminingEdges: IEdge[] = internalNode.connectsAsTarget;
            let edgesToBeMarked: IEdge[] = internalNode.connectsAsSource;
            let allEdgesScanned: boolean = true;
            let minimumLayer: number = 100000000;
            for (let i: number = 0; i < layerDeterminingEdges.length; i++) {
                let internalEdge: IEdge = layerDeterminingEdges[i];
                if (internalEdge.temp[0] === 5270620) {
                    // This edge has been scanned, get the layer of the node on the other end
                    let otherNode: IVertex = internalEdge.source;
                    minimumLayer = Math.min(minimumLayer, otherNode.temp[0] - 1);
                } else {
                    allEdgesScanned = false;
                    break;
                }
            }
            // If all edge have been scanned, assign the layer, mark all edges in the other direction and remove from the nodes list
            if (allEdgesScanned) {
                internalNode.temp[0] = minimumLayer;
                if (!model.maxRank) { model.maxRank = 100000000; }
                model.maxRank = Math.min(model.maxRank, minimumLayer);
                if (edgesToBeMarked != null) {
                    for (let i: number = 0; i < edgesToBeMarked.length; i++) {
                        let internalEdge: IEdge = edgesToBeMarked[i];
                        internalEdge.temp[0] = 5270620;
                        // Add node on other end of edge to LinkedList of nodes to be analysed
                        let otherNode: IVertex = internalEdge.target;
                        // Only add node if it hasn't been assigned a layer
                        if (otherNode.temp[0] === -1) {
                            startNodes.push(otherNode);
                            // Mark this other node as neither being unassigned nor assigned 
                            //so it isn't added to this list again, but it's layer isn't used in any calculation.
                            otherNode.temp[0] = -2;
                        }
                    }
                }
                startNodes.shift();
            } else {
                // Not all the edges have been scanned, get to the back of the class and put the dunces cap on
                let removedCell: IVertex = startNodes.shift();
                startNodes.push(internalNode);
                if (removedCell === internalNode && startNodes.length === 1) {
                    // This is an error condition, we can't get out of this loop. 
                    //It could happen for more than one node but that's a lot harder to detect. Log the error
                    break;
                }
            }
        }
        for (let i: number = 0; i < internalNodes.length; i++) {
            internalNodes[i].temp[0] -= model.maxRank;
        }
        for (let i: number = 0; i < startNodesCopy.length; i++) {
            let internalNode: IVertex = startNodesCopy[i];
            let currentMaxLayer: number = 0;
            let layerDeterminingEdges: IEdge[] = internalNode.connectsAsSource;
            for (let j: number = 0; j < layerDeterminingEdges.length; j++) {
                let internalEdge: IEdge = layerDeterminingEdges[j];
                let otherNode: IVertex = internalEdge.target;
                internalNode.temp[0] = Math.max(currentMaxLayer, otherNode.temp[0] + 1);
                currentMaxLayer = internalNode.temp[0];
            }
        }
        model.maxRank = 100000000 - model.maxRank;
    }

    /**
     * used to set the optimum value of each vertex on the layout
     */
    private fixRanks(model: MultiParentModel): void {
        model.fixRanks();
    }

    /**
     * used to determine any cyclic stage have been created on the layout model
     */
    private cycleStage(model: MultiParentModel): void {
        let seenNodes: {} = {};
        model.startNodes = [];
        let unseenNodesArray: IVertex[] = model.getDictionaryValues(model.vertexMapper);
        let unseenNodes: IVertex[] = [];
        for (let i: number = 0; i < unseenNodesArray.length; i++) {
            unseenNodesArray[i].temp[0] = -1;
            unseenNodes[unseenNodesArray[i].id] = unseenNodesArray[i];
        }

        let rootsArray: IVertex[] = null;
        if (model.roots != null) {
            let modelRoots: Vertex[] = model.roots;
            rootsArray = [];
            for (let i: number = 0; i < modelRoots.length; i++) {
                rootsArray[i] = model.getDictionary(model.vertexMapper, modelRoots[i]);
                if (rootsArray[i] != null) {
                    model.startNodes.push(rootsArray[i]);
                }
            }
        }
        model.visit('removeParentConnection', rootsArray, true, null, { seenNodes: seenNodes, unseenNodes: unseenNodes });
        let seenNodesCopy: {} = model.clone(seenNodes, null, true);
        model.visit('removeNodeConnection', unseenNodes, true, seenNodesCopy, { seenNodes: seenNodes, unseenNodes: unseenNodes });
    }

    /**
     * removes the edge from the given collection
     * @private
     */
    public remove(obj: IEdge, array: IEdge[]): IEdge {
        let index: number = array.indexOf(obj);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return obj;
    }

    /**
     * Inverts the source and target of an edge
     * @private
     */
    public invert(connectingEdge: IEdge, layer: number): void {
        let temp: IVertex = connectingEdge.source;
        connectingEdge.source = connectingEdge.target;
        connectingEdge.target = temp;
        connectingEdge.isReversed = !connectingEdge.isReversed;
    }

    /**
     * used to get the edges between the given source and target 
     * @private
     */
    public getEdgesBetween(source: Vertex, target: Vertex, directed: boolean): IConnector[] {
        directed = (directed != null) ? directed : false;
        let edges: IConnector[] = this.getEdges(source);
        let result: IConnector[] = [];
        for (let i: number = 0; i < edges.length; i++) {
            let src: Vertex = this.getVisibleTerminal(edges[i], true);
            let trg: Vertex = this.getVisibleTerminal(edges[i], false);
            if ((src === source && trg === target) || (!directed && src === target && trg === source)) {
                result.push(edges[i]);
            }
        }
        return result;
    }
}

/**
 * Handles position the objects in a hierarchical tree structure
 */
class MultiParentModel {
    /** @private */
    public roots: Vertex[];
    /** @private */
    public vertexMapper: VertexMapper;
    /** @private */
    public layout: LayoutProp;
    /** @private */
    public maxRank: number;
    private hierarchicalLayout: HierarchicalLayoutUtil;
    private multiObjectIdentityCounter: number = 0;
    /** @private */
    public ranks: IVertex[][];
    //used to count the no of times the parent have been used
    private dfsCount: number = 0;
    /** @private */
    public startNodes: IVertex[];
    private hierarchicalUtil: HierarchicalLayoutUtil = new HierarchicalLayoutUtil();
    constructor(layout: HierarchicalLayoutUtil, vertices: Vertex[], roots: Vertex[], dlayout: LayoutProp) {
        this.roots = roots;
        this.vertexMapper = { map: {} };
        let internalVertices: IVertex[] = [];
        this.layout = dlayout;
        this.maxRank = 100000000;
        this.hierarchicalLayout = layout;
        this.createInternalCells(layout, vertices, internalVertices);
        for (let i: number = 0; i < vertices.length; i++) {
            let edges: IEdge[] = internalVertices[i].connectsAsSource;
            for (let j: number = 0; j < edges.length; j++) {
                let internalEdge: IEdge = edges[j];
                let realEdges: IConnector[] = internalEdge.edges;
                if (realEdges != null && realEdges.length > 0) {
                    let realEdge: IConnector = realEdges[0];
                    let targetCell: Vertex = layout.getVisibleTerminal(realEdge, false);
                    let internalTargetCell: IVertex = this.getDictionary(this.vertexMapper, targetCell);
                    if (internalVertices[i] === internalTargetCell) {
                        targetCell = layout.getVisibleTerminal(realEdge, true);
                        internalTargetCell = this.getDictionary(this.vertexMapper, targetCell);
                    }
                    if (internalTargetCell != null && internalVertices[i] !== internalTargetCell) {
                        internalEdge.target = internalTargetCell;
                        if (internalTargetCell.connectsAsTarget.length === 0) {
                            internalTargetCell.connectsAsTarget = [];
                        }
                        if (internalTargetCell.connectsAsTarget.indexOf(internalEdge) < 0) {
                            internalTargetCell.connectsAsTarget.push(internalEdge);
                        }
                    }
                }
            }
            internalVertices[i].temp[0] = 1;
        }
    }

    /**
     * used to create the duplicate of the edges on the layout model
     */
    private createInternalCells(layout: HierarchicalLayoutUtil, vertices: Vertex[], internalVertices: IVertex[]): void {
        for (let i: number = 0; i < vertices.length; i++) {
            internalVertices[i] = {
                x: [], y: [], temp: [], cell: vertices[i],
                id: vertices[i].name, connectsAsTarget: [], connectsAsSource: []
            };
            this.setDictionary(this.vertexMapper, vertices[i], internalVertices[i]);
            let conns: IConnector[] = layout.getEdges(vertices[i]);
            internalVertices[i].connectsAsSource = [];
            for (let j: number = 0; j < conns.length; j++) {
                let cell: Vertex = layout.getVisibleTerminal(conns[j], false);
                if (cell !== vertices[i]) {
                    let undirectedEdges: IConnector[] = layout.getEdgesBetween(vertices[i], cell, false);
                    let directedEdges: IConnector[] = layout.getEdgesBetween(vertices[i], cell, true);
                    if (undirectedEdges != null && undirectedEdges.length > 0 && directedEdges.length * 2 >= undirectedEdges.length) {
                        let internalEdge: IEdge = { x: [], y: [], temp: [], edges: undirectedEdges, ids: [] };
                        for (let m: number = 0; m < undirectedEdges.length; m++) {
                            internalEdge.ids.push(undirectedEdges[m].id);
                        }
                        internalEdge.source = internalVertices[i];
                        if (!internalVertices[i].connectsAsSource) {
                            internalVertices[i].connectsAsSource = [];
                        }
                        if (internalVertices[i].connectsAsSource.indexOf(internalEdge) < 0) {
                            internalVertices[i].connectsAsSource.push(internalEdge);
                        }
                    }
                }
            }
            internalVertices[i].temp[0] = 0;
        }
    }

    /**
     * used to set the optimum value of each vertex on the layout
     * @private
     */
    public fixRanks(): void {
        let rankList: IVertex[][] = [];
        this.ranks = [];
        for (let i: number = 0; i < this.maxRank + 1; i++) {
            rankList[i] = [];
            this.ranks[i] = rankList[i];
        }
        let rootsArray: IVertex[] = null;
        if (this.roots != null) {
            let oldRootsArray: Vertex[] = this.roots;
            rootsArray = [];
            for (let i: number = 0; i < oldRootsArray.length; i++) {
                let cell: Vertex = oldRootsArray[i];
                let internalNode: IVertex = this.getDictionary(this.vertexMapper, cell);
                rootsArray[i] = internalNode;
            }
        }
        this.visit('updateMinMaxRank', rootsArray, false, null, { seenNodes: null, unseenNodes: null, rankList: rankList });
    }

    /**
     * Updates the min/max rank of the layer
     */
    private updateMinMaxRank(layer: number, seen: number, data: TraverseData): void {
        let seenNodes: {} = data.seenNodes;
        let unseenNodes: {} = data.unseenNodes;
        let parent: IVertex = data.parent;
        let node: IVertex = data.root;
        let edge: IEdge = data.edge;
        let rankList: IVertex[][] = data.rankList;
        if (!node.maxRank && node.maxRank !== 0) {
            node.maxRank = -1;
        }
        if (!node.minRank && node.minRank !== 0) {
            node.minRank = -1;
        }
        if (seen === 0 && node.maxRank < 0 && node.minRank < 0) {
            rankList[node.temp[0]].push(node);
            node.maxRank = node.temp[0];
            node.minRank = node.temp[0];
            node.temp[0] = rankList[node.maxRank].length - 1;
        }
        if (parent != null && edge != null) {
            let parentToCellRankDifference: number = parent.maxRank - node.maxRank;
            if (parentToCellRankDifference > 1) {
                edge.maxRank = parent.maxRank;
                edge.minRank = node.maxRank;
                edge.temp = [];
                edge.x = [];
                edge.y = [];
                for (let i: number = edge.minRank + 1; i < edge.maxRank; i++) {
                    rankList[i].push(edge);
                    this.hierarchicalUtil.setTempVariable(edge, i, rankList[i].length - 1);
                }
            }
        }
    }

    /**
     * used to store the value of th given key on the object
     */
    private setDictionary(dic: VertexMapper, key: Vertex, value: IVertex): IVertex {
        let id: string = key.name;
        if (!id) {
            //  id = this._getDictionary(dic, key);
        }
        let previous: IVertex = dic.map[id];
        dic.map[id] = value;
        return previous;
    }

    /**
     * used to store the value of th given key on the object
     * @private
     */
    public setDictionaryForSorter(dic: VertexMapper, key: IVertex, value: WeightedCellSorter, flag: boolean): IVertex {
        let id: string = key.id;
        if (!id) {
            //id = this._getDictionaryForSorter(dic, key);
        }
        let previous: IVertex = dic.map[id];
        dic.map[id] = value;
        return previous;
    }

    /**
     * used to get the value of the given key
     * @private
     */
    public getDictionary(dic: VertexMapper, key: Vertex): IVertex {
        if (!this.multiObjectIdentityCounter && this.multiObjectIdentityCounter !== 0) {
            this.multiObjectIdentityCounter = 0;
        }
        let id: string = key.name;
        if (!id) {
            if (!key.layoutObjectId) {///####
                key.layoutObjectId = 'graphHierarchyNode#' + this.multiObjectIdentityCounter++;
                return key.layoutObjectId as IVertex;
            } else { return dic.map[key.layoutObjectId]; }
        }
        return dic.map[id];
    }

    /**
     * used to get the value of the given key
     * @private
     */
    public getDictionaryForSorter(dic: VertexMapper, key: IVertex): WeightedCellSorter {
        if (!this.multiObjectIdentityCounter && this.multiObjectIdentityCounter !== 0) {
            this.multiObjectIdentityCounter = 0;
        }
        let id: string = key.id;
        if (!id) {
            if (!key.layoutObjectId) {///####
                key.layoutObjectId = 'graphHierarchyNode#' + this.multiObjectIdentityCounter++;
                return key.layoutObjectId as WeightedCellSorter;
            } else { return dic.map[key.layoutObjectId]; }
        }
        return dic.map[id];
    }

    /**
     * used to get all the values of the dictionary object
     * @private
     */
    public getDictionaryValues(dic: VertexMapper): IVertex[] {
        let result: IVertex[] = [];
        for (let key of Object.keys(dic.map)) {
            result.push(dic.map[key]);
        }
        return result;
    }

    /**
     * used to visit all the entries on the given dictionary with given function
     * @private
     */
    public visit(visitor: string, dfsRoots: IVertex[], trackAncestors: boolean, seenNodes: {}, data: TraverseData): void {
        let seenNodes1: {} = data.seenNodes;
        let unseenNodes1: {} = data.unseenNodes;
        let rankList: IVertex[][] = data.rankList;
        // Run depth first search through on all roots
        if (dfsRoots != null) {
            for (let i: number = 0; i < dfsRoots.length; i++) {
                let internalNode: IVertex = dfsRoots[i];
                if (internalNode != null) {
                    if (seenNodes == null) {
                        seenNodes = new Object();
                    }
                    data.parent = null;
                    data.root = internalNode;
                    data.edge = null;
                    if (trackAncestors) {
                        // Set up hash code for root
                        internalNode.hashCode = [];
                        internalNode.hashCode[0] = this.dfsCount;
                        internalNode.hashCode[1] = i;
                        this.extendedDfs(visitor, seenNodes, i, 0, data);
                    } else {
                        this.depthFirstSearch(visitor, seenNodes, 0, data);
                    }
                }
            }
            this.dfsCount++;
        }
    }

    /**
     * used to perform the depth fisrt search on the layout model
     */
    private depthFirstSearch(visitor: string, seen: {}, layer: number, data: TraverseData): void {
        let seenNodes1: {} = data.seenNodes;
        let unseenNodes1: {} = data.unseenNodes;
        let rankList: IVertex[][] = data.rankList;
        let parent: IVertex = data.parent;
        let root: IVertex = data.root;
        let edge: IEdge = data.edge;
        if (root != null) {
            let rootId: string = root.id;
            if (seen[rootId] == null) {
                seen[rootId] = root;
                this.updateConnectionRank(visitor, layer, 0, data);
                // Copy the connects as source list so that visitors can change the original for edge direction inversions
                let outgoingEdges: IEdge[] = root.connectsAsSource.slice();
                for (let i: number = 0; i < outgoingEdges.length; i++) {
                    let internalEdge: IEdge = outgoingEdges[i];
                    let targetNode: IVertex = internalEdge.target;
                    // Root check is O(|roots|)
                    data.parent = root;
                    data.root = targetNode;
                    data.edge = internalEdge;
                    this.depthFirstSearch(visitor, seen, layer + 1, data);
                }
            } else {
                this.updateConnectionRank(visitor, layer, 1, data);
            }
        }
    }

    /**
     * Updates the rank of the connection
     */
    private updateConnectionRank(visitor: string, layer: number, seen: number, traversedList: TraverseData): void {
        let parent: IVertex = traversedList.parent;
        let root: IVertex = traversedList.root;
        let edge: IEdge = traversedList.edge;
        if (visitor === 'removeParentConnection' || visitor === 'removeNodeConnection') {
            let remove: boolean = visitor === 'removeNodeConnection' ? true : false;
            this.removeConnectionEdge(parent, root, edge, layer, traversedList, remove);
        }
        if (visitor === 'updateMinMaxRank') {
            this.updateMinMaxRank(layer, seen, traversedList);
        }
    }
    /**
     * Removes the edge from the collection
     */
    private removeConnectionEdge(parent: IVertex, node: IVertex, edge: IEdge, layer: number, data: TraverseData, remove: boolean): void {
        let seenNodes: {} = data.seenNodes;
        let unseenNodes: {} = data.unseenNodes;
        let rankList: IVertex[][] = data.rankList;
        if (this.hierarchicalUtil.isAncestor(node, parent)) {
            this.hierarchicalUtil.invert(edge, 0);
            this.hierarchicalUtil.remove(edge, parent.connectsAsSource);
            if (remove) {
                node.connectsAsSource.push(edge);
                parent.connectsAsTarget.push(edge);
                this.hierarchicalUtil.remove(edge, node.connectsAsTarget);
            } else {
                parent.connectsAsTarget.push(edge);
                this.hierarchicalUtil.remove(edge, node.connectsAsTarget);
                node.connectsAsSource.push(edge);
            }
        }
        seenNodes[node.id] = node;
        delete unseenNodes[node.id];
    }

    /**
     * the dfs extends the default version by keeping track of cells ancestors, but it should be only used when necessary
     */
    private extendedDfs(visitor: string, seen: {}, cHash: number, layer: number, data: TraverseData): void {
        let seenNodes: {} = data.seenNodes;
        let unseenNodes: {} = data.unseenNodes;
        let rankList: IVertex[][] = data.rankList;
        let parent: IVertex = data.parent;
        let root: IVertex = data.root;
        let edge: IEdge = data.edge;
        if (root != null) {
            if (parent != null) {
                if (root.hashCode == null ||
                    root.hashCode[0] !== parent.hashCode[0]) {
                    let hashCodeLength: number = parent.hashCode.length + 1;
                    root.hashCode = parent.hashCode.slice();
                    root.hashCode[hashCodeLength - 1] = cHash;
                }
            }
            let rootId: string = root.id;
            if (seen[rootId] == null) {
                seen[rootId] = root;
                this.updateConnectionRank(visitor, layer, 0, data);
                let outgoingEdges: IEdge[] = root.connectsAsSource.slice();
                for (let i: number = 0; i < outgoingEdges.length; i++) {
                    let internalEdge: IEdge = outgoingEdges[i];
                    let targetNode: IVertex = internalEdge.target;
                    data.parent = root;
                    data.root = targetNode;
                    data.edge = internalEdge;
                    this.extendedDfs(visitor, seen, i, layer + 1, data);
                }
            } else {
                this.updateConnectionRank(visitor, layer, 1, data);
            }
        }
    }

    /**
     * used to clone the specified object ignoring all fieldnames in the given array of transient fields
     * @private
     */
    public clone(obj: Object, transients: string[], shallow: boolean): Object {
        shallow = (shallow != null) ? shallow : false;
        if (obj != null && typeof (obj.constructor) === 'function') {
            let clonedObj: Object = obj.constructor();
            for (let i of Object.keys(obj)) {
                if (i !== 'layoutObjectId' && (transients == null || transients.indexOf(i) < 0)) {
                    if (!shallow && typeof (obj[i]) === 'object') {
                        //not used
                        //  _clone[i] = $.extend(true, {}, obj[i]);
                    } else {
                        clonedObj[i] = obj[i];
                    }
                }
            }
            return clonedObj;
        }
        return null;
    }
}

/**
 * Defines how to reduce the crosses in between the line segments
 */
class CrossReduction {
    /** @private */
    public nestedBestRanks: IVertex[][];
    /**
     * used to calculate the number of edges crossing the layout model
     * @param model 
     */
    private calculateCrossings(model: MultiParentModel): number {
        let numRanks: number = model.ranks.length;
        let totalCrossings: number = 0;
        for (let i: number = 1; i < numRanks; i++) {
            totalCrossings += this.calculateRankCrossing(i, model);
        }
        return totalCrossings;
    }

    /**
     * used to get the temp value specified for the node or connector
     * @private
     */
    public getTempVariable(node: IVertex, layer: number): number {
        if (node) {
            if (this.isVertex(node)) {
                return node.temp[0];
            } else {
                return node.temp[layer - node.minRank - 1];
            }
        }
        return 0;
    }

    /**
     * used to specify the number of conenctors crossing between the specified rank and its below rank 
     */
    private calculateRankCrossing(i: number, model: MultiParentModel): number {
        let totalCrossings: number = 0;
        let rank: IVertex[] = model.ranks[i];
        let previousRank: IVertex[] = model.ranks[i - 1];
        let tmpIndices: number[][] = [];
        // Iterate over the top rank and fill in the connection information
        for (let j: number = 0; j < rank.length; j++) {
            let node: IVertex = rank[j];
            let rankPosition: number = this.getTempVariable(node, i);
            let connectedCells: IVertex[] = this.getConnectedCellsOnLayer(node, i, true);
            ///#### 
            let nodeIndices: number[] = [];
            for (let k: number = 0; k < connectedCells.length; k++) {
                let connectedNode: IVertex = connectedCells[k];
                let otherCellRankPosition: number = this.getTempVariable(connectedNode, i - 1);
                nodeIndices.push(otherCellRankPosition);
            }
            nodeIndices.sort((x: number, y: number): number => { return x - y; });
            tmpIndices[rankPosition] = nodeIndices;
        }

        let indices: number[] = [];
        for (let j: number = 0; j < tmpIndices.length; j++) {
            indices = indices.concat(tmpIndices[j]);
        }

        let firstIndex: number = 1;
        while (firstIndex < previousRank.length) {
            firstIndex <<= 1;
        }

        let treeSize: number = 2 * firstIndex - 1;
        firstIndex -= 1;
        let tree: number[] = [];
        for (let j: number = 0; j < treeSize; ++j) {
            tree[j] = 0;
        }
        for (let j: number = 0; j < indices.length; j++) {
            let index: number = indices[j];
            let treeIndex: number = index + firstIndex;
            ++tree[treeIndex];
            while (treeIndex > 0) {
                if (treeIndex % 2) {
                    totalCrossings += tree[treeIndex + 1];
                }
                treeIndex = (treeIndex - 1) >> 1;
                ++tree[treeIndex];
            }
        }
        return totalCrossings;
    }

    /**
     * Calculates and reduces the crosses between line segments
     * @private
     */
    public execute(model: MultiParentModel): void {
        // Stores initial ordering 
        this.nestedBestRanks = [];
        for (let i: number = 0; i < model.ranks.length; i++) {
            this.nestedBestRanks[i] = model.ranks[i].slice();
        }
        let iterationsWithoutImprovement: number = 0;
        let currentBestCrossings: number = this.calculateCrossings(model);
        for (let i: number = 0; i < 24 && iterationsWithoutImprovement < 2; i++) {
            this.weightedMedian(i, model);
            let candidateCrossings: number = this.calculateCrossings(model);
            if (candidateCrossings < currentBestCrossings) {
                currentBestCrossings = candidateCrossings;
                iterationsWithoutImprovement = 0;
                for (let j: number = 0; j < this.nestedBestRanks.length; j++) {
                    let rank: (IVertex | IEdge)[] = model.ranks[j];
                    for (let k: number = 0; k < rank.length; k++) {
                        let cell: IVertex | IEdge = rank[k];
                        this.nestedBestRanks[j][cell.temp[0]] = cell;
                    }
                }
            } else {
                // Increase count of iterations  
                iterationsWithoutImprovement++;
                // Restore the best values to the cells
                for (let j: number = 0; j < this.nestedBestRanks.length; j++) {
                    let rank: IVertex[] = model.ranks[j];
                    for (let k: number = 0; k < rank.length; k++) {
                        let cell: IVertex = rank[k];
                        this.setTempVariable(cell, j, k);
                    }
                }
            }
            if (currentBestCrossings === 0) {
                break;
            }
        }
        // Store the best rankings but in the model
        let ranks: IVertex[][] = [];
        let rankList: IVertex[][] = [];
        for (let i: number = 0; i < model.maxRank + 1; i++) {
            rankList[i] = [];
            ranks[i] = rankList[i];
        }
        for (let i: number = 0; i < this.nestedBestRanks.length; i++) {
            for (let j: number = 0; j < this.nestedBestRanks[i].length; j++) {
                rankList[i].push(this.nestedBestRanks[i][j]);
            }
        }
        model.ranks = ranks;
    }

    /**
     * check whether the object is vertext or edge on the layout model.
     * @private
     */
    public isVertex(node: IVertex): boolean {
        if (node && node.cell && (node.cell.inEdges || node.cell.outEdges)) {
            return true;
        }
        return false;
    }

    /**
     * used to move up or move down the node position on the adjacent ranks 
     */
    private weightedMedian(iteration: number, model: MultiParentModel): void {
        // Reverse sweep direction each time through this method
        let downwardSweep: boolean = (iteration % 2 === 0);
        if (downwardSweep) {
            for (let j: number = model.maxRank - 1; j >= 0; j--) {
                this.medianRank(j, downwardSweep);
            }
        } else {
            for (let j: number = 1; j < model.maxRank; j++) {
                this.medianRank(j, downwardSweep);
            }
        }
    }

    /**
     * used to get the node next(up) connected to the specified node or connector
     * @private
     */
    public getConnectedCellsOnLayer(cell: IVertex, layer: number, isPrevious: boolean = false): IVertex[] {
        let connectedlayer: string = 'nextLayerConnectedCells';
        let connectedAs: string = 'connectsAsTarget';
        if (isPrevious) {
            connectedlayer = 'previousLayerConnectedCells';
            connectedAs = 'connectsAsSource';
        }
        if (cell) {
            if (this.isVertex(cell)) {
                if (cell[connectedlayer] == null) {
                    cell[connectedlayer] = [];
                    cell[connectedlayer][0] = [];
                    for (let i: number = 0; i < cell[connectedAs].length; i++) {
                        let edge: IEdge = cell[connectedAs][i];
                        if (edge.maxRank === undefined) {
                            edge.maxRank = -1;
                        }
                        if (edge.maxRank === -1 || (isPrevious ? (edge.minRank === layer - 1) : (edge.maxRank === layer + 1))) {
                            // Either edge is not in any rank or no dummy nodes in edge, add node of other side of edge
                            cell[connectedlayer][0].push(isPrevious ? edge.target : edge.source);
                        } else {
                            // Edge spans at least two layers, add edge
                            cell[connectedlayer][0].push(edge);
                        }
                    }
                }
                return cell[connectedlayer][0];
            } else {
                if (cell[connectedlayer] == null) {
                    cell[connectedlayer] = [];
                    for (let i: number = 0; i < cell.temp.length; i++) {
                        cell[connectedlayer][i] = [];
                        if (i === (isPrevious ? 0 : (cell.temp.length - 1))) {
                            cell[connectedlayer][i].push(isPrevious ? cell.target : cell.source);
                        } else {
                            cell[connectedlayer][i].push(cell);
                        }
                    }
                }
                return cell[connectedlayer][layer - cell.minRank - 1];
            }
        }
        return null;
    }

    /**
     * calculates the rank elements on the specified rank
     * @private
     */
    public medianValue(connectedCells: IVertex[], rankValue: number): number {
        let medianValues: number[] = [];
        let arrayCount: number = 0;
        for (let i: number = 0; i < connectedCells.length; i++) {
            let cell: IVertex = connectedCells[i];
            medianValues[arrayCount++] = this.getTempVariable(cell, rankValue);
        }
        // sorts numerical order sort
        medianValues.sort((a: number, b: number): number => { return a - b; });
        if (arrayCount % 2 === 1) {
            // For odd numbers of adjacent vertices return the median
            return medianValues[Math.floor(arrayCount / 2)];
        } else if (arrayCount === 2) {
            return ((medianValues[0] + medianValues[1]) / 2.0);
        } else {
            let medianPoint: number = arrayCount / 2;
            let leftMedian: number = medianValues[medianPoint - 1] - medianValues[0];
            let rightMedian: number = medianValues[arrayCount - 1]
                - medianValues[medianPoint];
            return (medianValues[medianPoint - 1] * rightMedian + medianValues[medianPoint] * leftMedian) / (leftMedian + rightMedian);
        }
    }

    /**
     * get the temp value of the specified layer
     * @private
     */
    public setTempVariable(cell: IVertex, layer: number, value: number): void {
        if (cell) {
            cell.temp[0] = value;
        }
    }

    /**
     * used to minimize the node position on this rank and one of its adjacent ranks
     */

    private medianRank(rankValue: number, downwardSweep: boolean): void {
        let numCellsForRank: number = this.nestedBestRanks[rankValue].length;
        let medianValues: SortedEntry[] = [];
        let reservedPositions: boolean[] = [];
        for (let i: number = 0; i < numCellsForRank; i++) {
            let cell: IVertex = this.nestedBestRanks[rankValue][i];
            let sorterEntry: SortedEntry = { medianValue: 0 };
            sorterEntry.cell = cell;
            // Flip whether or not equal medians are flipped on up and down sweeps 
            //TODO re-implement some kind of nudge medianValues[i].nudge = !downwardSweep;
            let nextLevelConnectedCells: IVertex[];
            if (downwardSweep) {
                nextLevelConnectedCells = this.getConnectedCellsOnLayer(cell, rankValue);
            } else { nextLevelConnectedCells = this.getConnectedCellsOnLayer(cell, rankValue, true); }
            let nextRankValue: number;
            downwardSweep ? nextRankValue = rankValue + 1 : nextRankValue = rankValue - 1;
            if (nextLevelConnectedCells != null && nextLevelConnectedCells.length !== 0) {
                sorterEntry.medianValue = this.medianValue(nextLevelConnectedCells, nextRankValue);
                medianValues.push(sorterEntry);
            } else {
                // Nodes with no adjacent vertices are flagged in the reserved array to 
                //indicate they should be left in their current position.
                reservedPositions[this.getTempVariable(cell, rankValue)] = true;
            }
        }
        medianValues.sort(this.compare);
        // Set the new position of each node within the rank using its temp variable
        for (let i: number = 0; i < numCellsForRank; i++) {
            if (reservedPositions[i] == null) {
                let cell: IVertex = medianValues.shift().cell;
                this.setTempVariable(cell, rankValue, i);
            }
        }
    }


    /**
     * compares two values, it sends the values to the compare function, 
     * and sorts the values according to the returned (negative, zero, positive) value
     */
    private compare(a: SortedEntry, b: SortedEntry): number {
        if (a != null && b != null) {
            if (b.medianValue > a.medianValue) {
                return -1;
            } else if (b.medianValue < a.medianValue) {
                return 1;
            }
        }
        return 0;
    }
}

/**
 * Each vertex means a node object in diagram
 */
interface Vertex {
    value: string;
    geometry: Rect;
    name: string;
    vertex: boolean;
    inEdges: string[];
    outEdges: string[];
    layoutObjectId?: string;
}

interface Margin {
    marginX: number;
    marginY: number;
}

/**
 * Defines the object to represent each placement stage
 */
interface PlacementStage {
    marginX?: number;
    marginY?: number;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    orientation?: string;
    widestRankValue?: number;
    model?: MultiParentModel;
    jettyPositions?: {};
    currentXDelta?: number;
    currentYDelta?: number;
    maxIterations?: number;
    rankSizes?: number[];
    rankOffset?: number[];
    widestRank?: number;
    intraCellSpacing?: number;
}

/**
 * Defines the edge that is used to maintain the relationship between internal vertices
 */
interface IEdge {
    x?: number[];
    y?: number[];
    temp?: number[];
    edges?: IConnector[];
    ids?: string[];
    source?: IVertex;
    target?: IVertex;
    maxRank?: number;
    minRank?: number;
    isReversed?: boolean;
    previousLayerConnectedCells?: IVertex[];
    nextLayerConnectedCells?: IVertex[];
    width?: number;
    height?: number;
}

/**
 * Defines the internal vertices that are used in positioning the objects
 */
interface IVertex {
    x?: number[]; y?: number[];
    temp?: number[];
    cell?: Vertex;
    id?: string;
    connectsAsTarget?: IEdge[];
    connectsAsSource?: IEdge[];
    hashCode?: number[];
    maxRank?: number;
    minRank?: number;
    width?: number;
    height?: number;
    //For compilation - _getConnectedCellsOnLayer
    source?: IVertex;
    target?: IVertex;
    layoutObjectId?: string;
}

interface VertexMapper {
    map: {};
}

/**
 * Defines weighted cell sorter
 */
interface WeightedCellSorter {
    cell?: IVertex;
    weightedValue?: number;
    visited?: boolean;
    rankIndex?: number;
}

/**
 * Defines sorted entries
 */
interface SortedEntry {
    medianValue?: number;
    cell?: IVertex;
}

/**
 * Defines an object that is used to maintain data in traversing
 */
interface TraverseData {
    seenNodes: {};
    unseenNodes: {};
    rankList?: IVertex[][];
    parent?: IVertex;
    root?: IVertex;
    edge?: IEdge;
}

/**
 * Defines the properties of layout
 * @private
 */
export interface LayoutProp {
    orientation?: string;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    marginX: number;
    marginY: number;
}


interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
