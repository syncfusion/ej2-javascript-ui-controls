import { NodeModel } from '../../objects/node-model';
import { randomId } from '../../utility/base-util';
import { IEdge, LayoutProp } from '../complex-hierarchical-tree';
import { IConnector } from '../layout-base';
import { LayoutModel } from '../layout-base-model';
import { InternalEdges, InternalVertex, FlowchartLayout, FlowChartVertex } from './flow-chart-layout';

export class FlowchartModel {
    private dfsCount: number = 0;
    private maxRank: number = 100000000;
    /** @private*/
    public layout: FlowchartLayout;
    private vertexMapper: Map<{}, InternalVertex>;
    /** @private*/
    public ranks: Map<number, []>;
    private rootNode: InternalVertex;

    constructor(layout: FlowchartLayout, root: NodeModel, vertices: FlowChartVertex[]) {
        this.layout = layout;
        this.vertexMapper = new Map<string, any>();
        this.ranks = new Map<number, any>();

        const internalVertices: InternalVertex[] = [];
        this.createInternalCells(vertices, internalVertices);

        internalVertices.forEach((internalVertex: InternalVertex ) => {
            const edges: InternalEdges[] = internalVertex.internalOutEdges;
            edges.forEach((internalEdge: InternalEdges) => {
                const realEdges: IConnector[] = internalEdge.edges;
                if (realEdges && realEdges.length > 0) {
                    const realEdge: IConnector = realEdges[0];
                    let targetCell: FlowChartVertex = this.layout.getVisibleTerminal(realEdge, false);
                    let internalTargetCell: InternalVertex = this.vertexMapper.get(targetCell.id);
                    if (internalVertex === internalTargetCell) {
                        targetCell = this.layout.getVisibleTerminal(realEdge, true);
                        internalTargetCell = this.vertexMapper.get(targetCell.id);
                    }
                    if (internalTargetCell && internalVertex !== internalTargetCell) {
                        internalEdge.target = internalTargetCell;
                        if (internalVertex.internalInEdges.indexOf(internalEdge) === -1) {
                            internalTargetCell.internalInEdges.push(internalEdge);
                        }
                    }
                }
            });
        });
        this.rootNode = this.vertexMapper.get(root.id);
    }

    private createInternalCells(vertices: FlowChartVertex[], internalVertices: InternalVertex[]): void {
        for (let j: number = 0; j < vertices.length; j++) {
            const vertex: FlowChartVertex = vertices[parseInt(j.toString(), 10)];
            const internalVertex: InternalVertex = {
                tempRank: -1, cell: vertex, hashCode: [], maxRank: null, minRank: null,
                id: vertex.id, internalOutEdges: [], internalInEdges: [], identicalSibling: []
            };
            internalVertices.push(internalVertex);
            this.vertexMapper.set(vertex.id, internalVertex);

            const connectors: IConnector[] = this.layout.getEdges(vertex);
            let i: number = 0;
            while (i < connectors.length) {
                const connector: IConnector = connectors[parseInt(i.toString(), 10)];
                const childVertex: FlowChartVertex = this.layout.getVisibleTerminal(connector, false);
                if (childVertex !== vertex) {
                    const undirectedEdges: IConnector[] = this.layout.getEdgesBetween(vertex, childVertex, true);
                    if (undirectedEdges.length > 0) {
                        const internalEdge: InternalEdges = {
                            connectorIds: [], edges: undirectedEdges, ids: [], isReversed: false,
                            source: null, target: null, tempRank: 0, maxRank: null, minRank: null
                        };
                        for (let k: number = 0; k < undirectedEdges.length; k++) {
                            const undirectedEdge: IConnector = undirectedEdges[parseInt(k.toString(), 10)];
                            //   if (!undirectedEdge.id) {
                            //     undirectedEdge.id = randomId();
                            //   }
                            internalEdge.ids.push(undirectedEdge.id);
                            if (connectors.indexOf(undirectedEdge) !== -1) {
                                if (connectors.indexOf(undirectedEdge) < i) {
                                    i--;
                                }
                                connectors.splice(connectors.indexOf(undirectedEdge), 1);
                            }
                        }
                        internalEdge.source = internalVertex;
                        if (internalVertex.internalOutEdges.indexOf(internalEdge) === -1) {
                            internalVertex.internalOutEdges.push(internalEdge);
                        }
                    }
                } else {
                    i++;
                }
            }
        }
    }

    //Initializes the ranks of the vertices
    /**
     * @Private
     * @returns { void }  Initializes the ranks of the vertices .\
     */
    public layeringStage(): void {
        this.recycleConnectors();
        this.initialRank();
        this.fixRanks();
    }

    private recycleConnectors(): void {
        const startNodes: InternalVertex[] = [this.rootNode];
        this.visit(startNodes, true);
    }

    private initialRank(): void {
        const startNodes: InternalVertex[] = [this.rootNode];
        const internalNodes: InternalVertex[] = Array.from((this.vertexMapper as any).values());
        while (startNodes.length > 0) {
            const internalNode: InternalVertex = startNodes[0];
            const outEdges: InternalEdges[] = internalNode.internalOutEdges;
            const inEdges: InternalEdges[] = internalNode.internalInEdges;

            let allEdgesScanned: boolean = true;
            let minimumLayer: number = 100000000;
            for (let i: number = 0; i < inEdges.length; i++) {
                const internalEdge: InternalEdges = inEdges[parseInt(i.toString(), 10)];
                if (internalEdge.tempRank === 5270620) {
                    // This edge has been scanned, get the layer of the node on the other end
                    const otherNode: InternalVertex = internalEdge.source;
                    minimumLayer = otherNode.tempRank ? Math.min(minimumLayer, otherNode.tempRank - 1) : minimumLayer;
                } else {
                    allEdgesScanned = false;
                    break;
                }
            }
            // If all edge have been scanned, assign the layer, mark all edges in the other direction and remove from the nodes list
            if (allEdgesScanned) {
                internalNode.tempRank = minimumLayer;
                this.maxRank = Math.min(this.maxRank, minimumLayer);
                if (outEdges.length) {
                    if (internalNode.cell.isDecisionNode) {
                        const yesChild: InternalEdges = outEdges.find((e: InternalEdges) => e.target.cell.isYesChild);
                        if (outEdges.indexOf(yesChild) !== 0) {
                            outEdges.reverse();
                        }
                        if (this.layout.yesBranchDirection === 'RightInFlow'
                            || (this.layout.yesBranchDirection === 'SameAsFlow'
                                && this.layout.noBranchDirection === 'LeftInFlow')) {
                            outEdges.reverse();
                        }
                    }
                    for (let i: number = 0; i < outEdges.length; i++) {
                        const internalEdge: InternalEdges = outEdges[parseInt(i.toString(), 10)];
                        internalEdge.tempRank = 5270620;
                        // Add node on other end of edge to LinkedList of nodes to be analysed
                        const otherNode: InternalVertex = internalEdge.target;
                        // Only add node if it hasn't been assigned a layer
                        if (otherNode.tempRank === -1) {
                            // Mark this other node as neither being unassigned nor assigned
                            //so it isn't added to this list again, but it's layer isn't used in any calculation.
                            otherNode.tempRank = -2;
                            startNodes.push(otherNode);
                        }
                    }
                }
                startNodes.shift();
            } else {
                // Not all the edges have been scanned, get to the back of the class and put the dunces cap on
                const removedCell: InternalVertex = startNodes.shift();
                startNodes.push(internalNode);
                if (removedCell === internalNode && startNodes.length === 1) {
                    // This is an error condition, we can't get out of this loop.
                    //It could happen for more than one node but that's a lot harder to detect. Log the error
                    break;
                }
            }
        }
        for (let i: number = 0; i < internalNodes.length; i++) {
            internalNodes[parseInt(i.toString(), 10)].tempRank -= this.maxRank;
        }
        let currentMaxLayer: number = 0;
        const layerDeterminingEdges: InternalEdges[] = this.rootNode.internalOutEdges;
        for (let j: number = 0; j < layerDeterminingEdges.length; j++) {
            const internalEdge: InternalEdges = layerDeterminingEdges[parseInt(j.toString(), 10)];
            const otherNode: InternalVertex = internalEdge.target;
            this.rootNode.tempRank = (otherNode.tempRank !== undefined && otherNode.tempRank !== null) ?
                Math.max(currentMaxLayer, otherNode.tempRank + 1) : currentMaxLayer;
            currentMaxLayer = this.rootNode.tempRank;
        }
        this.maxRank = 100000000 - this.maxRank;
    }
    private fixRanks(): void {
        const rankList: Map<number, []> = new Map<number, []>();
        this.ranks = new Map<number, []>();

        for (let i: number = 0; i <= this.maxRank; i++) {
            rankList.set(i, []);
            this.ranks.set(i, rankList.get(i));
        }

        const rootsArray: InternalVertex[] = [this.rootNode];
        this.visit(rootsArray, false, rankList);
    }

    /**
     * used to visit all the entries on the given dictionary with given function \
     *
     * @returns { void }  used to visit all the entries on the given dictionary with given function .\
     * @param {InternalVertex[]} dfsRoots - provide the dfsRoots value.
     * @param {boolean} trackAncestors - provide the trackAncestors value.
     * @param {Map<number, []>} rankList - provide the rankList value.
     * @private
     */
    private visit(dfsRoots: InternalVertex[], trackAncestors: boolean, rankList: Map<number, []> = null): void {
        if (dfsRoots) {
            for (let i: number = 0; i < dfsRoots.length; i++) {
                const internalNode: InternalVertex = dfsRoots[parseInt(i.toString(), 10)];
                if (internalNode) {
                    const seenNodes: any = new Map();
                    if (trackAncestors) {
                        internalNode.hashCode = [this.dfsCount, i];
                        this.extendedDfs(null, internalNode, null, seenNodes, i);
                    } else {
                        this.depthFirstSearch(null, internalNode, null, seenNodes, rankList);
                    }
                }
            }
            this.dfsCount++;
        }
    }

    private extendedDfs(parent: InternalVertex, root: InternalVertex, connectingEdge: InternalEdges, seen: Map<string,
    InternalVertex>, childHash: number): void {
        if (parent) {
            if (!root.hashCode || root.hashCode[0] !== parent.hashCode[0]) {
                root.hashCode = [...parent.hashCode, childHash];
            }
        }
        const rootId: string = root.id;
        if (!seen.has(rootId)) {
            seen.set(rootId, root);
            this.removeConnectionEdge(parent, root, connectingEdge);
            const outgoingEdges: InternalEdges[] = [...root.internalOutEdges];
            outgoingEdges.forEach((internalEdge: InternalEdges, i: number) => {
                const targetNode: InternalVertex = internalEdge.target;
                this.extendedDfs(root, targetNode, internalEdge, seen, i);
            });
        } else {
            this.removeConnectionEdge(parent, root, connectingEdge);
        }
    }

    private removeConnectionEdge(parent: InternalVertex, node: InternalVertex, connectingEdge: InternalEdges): void {
        if (parent && this.isAncestor(node, parent)) {
            this.invert(connectingEdge!);
            this.remove(connectingEdge!, parent.internalOutEdges);
            parent.internalInEdges.push(connectingEdge!);
            this.remove(connectingEdge!, node.internalInEdges);
            node.internalOutEdges.push(connectingEdge!);
        }
    }

    private invert(edge: InternalEdges): void {
        const temp: InternalVertex = edge.source;
        edge.source = edge.target;
        edge.target = temp;
        edge.isReversed = !edge.isReversed;
    }

    private remove(edge: InternalEdges, edges: InternalEdges[]): void {
        const index: number = edges.indexOf(edge);
        edges.splice(index, 1);
    }

    private isAncestor(node: InternalVertex, otherNode: InternalVertex): boolean {
        // Firstly, the hash code of this node needs to be shorter than the other node
        if (otherNode !== null && node.hashCode !== null && otherNode.hashCode !== null
            && node.hashCode.length < otherNode.hashCode.length) {

            if (node.hashCode === otherNode.hashCode) {
                return true;
            }
            for (let i: number = 0; i < node.hashCode.length; i++) {
                if (node.hashCode[parseInt(i.toString(), 10)] !== otherNode.hashCode[parseInt(i.toString(), 10)]) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    private depthFirstSearch(parent: InternalVertex, root: InternalVertex, connectingEdge: InternalEdges,
                             seen: Map<string, InternalVertex>, rankList: Map<number, []>): void {
        const rootId: string = root.id;
        if (!seen.has(rootId)) {
            seen.set(rootId, root);
            this.updateMinMaxRank(parent, root, connectingEdge, 0, rankList);
            const outgoingEdges: InternalEdges[] = [...root.internalOutEdges];
            outgoingEdges.forEach((internalEdge: InternalEdges) => {
                const targetNode: InternalVertex = internalEdge.target;
                this.depthFirstSearch(root, targetNode, internalEdge, seen, rankList);
            });
        } else {
            this.updateMinMaxRank(parent, root, connectingEdge, 1, rankList);
        }
    }

    private updateMinMaxRank(parent: InternalVertex, node: InternalVertex, edge: InternalEdges,
                             seen: number, rankList: Map<number, []>): void {
        const rankListArray: any = Array.from((rankList as any).values());
        if (node.maxRank == null && node.maxRank !== 0) {
            node.maxRank = -1;
        }

        if (node.minRank == null && node.minRank !== 0) {
            node.minRank = -1;
        }

        if (seen === 0 && node.maxRank < 0 && node.minRank < 0) {
            if (node.tempRank >= 0) {
                const rank: number = node.tempRank;
                (rankListArray[parseInt(rank.toString(), 10)] as InternalVertex[]).push(node);
                node.maxRank = rank;
                node.minRank = rank;
                node.tempRank = (rankListArray[node.maxRank] as any).length - 1;
            }
        }

        if (parent !== null && edge !== null) {
            const parentToCellRankDifference: number = parent.maxRank - node.maxRank;
            if (parentToCellRankDifference > 1) {
                edge.maxRank = parent.maxRank;
                edge.minRank = node.maxRank;
                for (let i: number = edge.minRank + 1; i < edge.maxRank; i++) {
                    (rankListArray[parseInt(i.toString(), 10)] as InternalEdges[]).push(edge);

                    // CheckMe
                    // this.layout.setTempVariable(edge, i, rankList[i].length - 1);
                }
            } else if (edge.isReversed) {
                edge.maxRank = parent.maxRank;
                edge.minRank = node.maxRank;
                for (let i: number = edge.minRank; i <= edge.maxRank; i++) {
                    (rankListArray[parseInt(i.toString(), 10)] as InternalEdges[]).push(edge);
                }
            }
        }
    }
}
