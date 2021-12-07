
import { Layout } from './layout-base';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { INode, IConnector, Bounds } from './layout-base';
import { MarginModel } from '../core/appearance-model';
import { cloneObject } from '../utility/base-util';

export class GraphForceNode {

    /**
     * @private
     */
    public velocityX: number = 0;
    /**
     * @private
     */
    public velocityY: number = 0;
    /**
     * @private
     */
    public location: PointModel;
    /**
     * @private
     */
    public nodes: IGraphObject[] = [];
    /**
     * @private
     */
    public graphNode: IGraphObject;

    constructor(gnNode: IGraphObject) {
        this.graphNode = gnNode;
        const nNode: IGraphObject = this.graphNode;
        const bounds: Rect = getGraphBounds(nNode);
        this.location = bounds.center;
        this.nodes = [];
        if (!gnNode.treeInfo.parents) {
            gnNode.treeInfo.parents = [];
        }
        if (!gnNode.treeInfo.children) {
            gnNode.treeInfo.children = [];
        }
        this.nodes = (gnNode.treeInfo.parents).concat(gnNode.treeInfo.children);
    }



    /**
     * applyChanges method\
     *
     * @returns {  void }    applyChanges method .\
     * @private
     */
    public applyChanges(): void {
        this.graphNode.treeInfo.center = this.location;
    }
}
/**
 * SymmetricalLayout
 */
export class SymmetricLayout {
    private cdCOEF: number = 0.442;
    private cfMAXVELOCITY: number = 50;
    private cnMAXITERACTION: number = 1000;
    private cnSPRINGLENGTH: number = 100;
    private mszMaxForceVelocity: SizeF = { width: this.cfMAXVELOCITY, height: this.cfMAXVELOCITY };
    /**
     * @private
     */
    public springLength: number = 0;
    /**
     * @private
     */
    public springFactor: number = this.cdCOEF;
    /**
     * @private
     */
    public maxIteration: number = this.cnMAXITERACTION;
    private selectedNode: IGraphObject;

    constructor() {
        this.springLength = this.cnSPRINGLENGTH;
    }
    /**
     *To destroy the layout
     *
     * @returns {void} To destroy the layout
     */
    public destroy(): void {
        /**
         * Destroys symmetricLayout
         */
    }

    protected getModuleName(): string {
        return 'SymmetricalLayout';
    }

    private doGraphLayout(graphLayoutManager: GraphLayoutManager): void {
        const graph: IGraphObject = this.selectedNode;
        graph.treeInfo.Bounds = graphLayoutManager.getModelBounds(graphLayoutManager.nodes);
        const lstGraphNodes: {} = graph.treeInfo.GraphNodes;
        const lstNodes: IGraphObject[] = this.convertGraphNodes(lstGraphNodes);
        let count: number = lstNodes.length;
        count = Math.min(this.maxIteration, count * count * count);
        this.preLayoutNodes(lstNodes, graph.treeInfo.Bounds);
        for (let i: number = 0, nLenght: number = count; i < nLenght; i++) {
            this.makeSymmetricLayout(lstNodes);
            this.appendForces(lstNodes);
        }
        this.resetGraphPosition(lstNodes, graph);
    }
    private preLayoutNodes(lstNodes: IGraphObject[], rcBounds: Rect): void {
        const fMaxSize: number = Math.max(rcBounds ? rcBounds.width : 25, rcBounds ? rcBounds.height : 25);
        const ptCenter: PointModel = { x: fMaxSize / 2, y: fMaxSize / 2 };
        const dRotateAngle: number = 2 * Math.PI / lstNodes.length;
        let dAngle: number = dRotateAngle;
        for (let i: number = 0; i < lstNodes.length; i++) {
            const gnNode: IGraphObject = lstNodes[i];
            const forceNode: GraphForceNode = this.getForceNode(gnNode);
            forceNode.location = {
                x: ptCenter.x + fMaxSize * Number((Math.cos(dAngle)).toFixed(2)),
                y: ptCenter.y + fMaxSize * Number(Math.sin(dAngle).toFixed(2))
            };
            dAngle -= dRotateAngle;
        }
    }

    /**
     * doLayout method\
     *
     * @returns {  void }    doLayout method .\
     * @param {GraphLayoutManager} graphLayoutManager - provide the angle value.
     * @private
     */
    public doLayout(graphLayoutManager: GraphLayoutManager): void {
        this.selectedNode = graphLayoutManager.selectedNode;
        this.doGraphLayout(graphLayoutManager);
    }

    private makeSymmetricLayout(lstNodes: IGraphObject[]): void {
        let forceNode: GraphForceNode;
        let force: GraphForceNode;
        for (let k: number = 0; k < lstNodes.length; k++) {
            const gnNode: IGraphObject = lstNodes[k];
            forceNode = this.getForceNode(gnNode);
            const nodes: IGraphObject[] = forceNode.nodes;
            for (let l: number = 0; l < nodes.length; l++) {
                const gnChild: IGraphObject = nodes[l];
                if (collectionContains(gnChild.id, lstNodes)) {
                    this.calcNodesForce(forceNode, this.getForceNode(gnChild));
                }
            }
            for (let i: number = 0, length: number = nodes.length; i < length; i++) {
                if (length < 2) {
                    break;
                }
                const vtx1: GraphForceNode = this.getForceNode(nodes[i]);
                const vtx2: GraphForceNode = (i + 1 >= length) ? this.getForceNode(nodes[0]) : this.getForceNode((nodes[i + 1]));
                const angle: number = (360 / nodes.length / 2) * Math.PI / 180;
                const normalDistance: number = 2 * this.springLength * Math.sin(angle);
                this.calcRelatesForce(vtx1, vtx2, normalDistance);
            }
            for (let s: number = 0; s < lstNodes.length; s++) {
                const gnChild: IGraphObject = lstNodes[s];
                if (!collectionContains(gnChild.id, nodes) && gnChild.id !== gnNode.id) {
                    force = this.getForceNode(gnChild);
                    this.updateNeigbour(forceNode, force);
                }
            }
        }
    }
    private appendForces(lstNodes: IGraphObject[]): void {
        let gfnNode: GraphForceNode = null;
        for (let k: number = 0; k < lstNodes.length; k++) {
            const gnNode: IGraphObject = lstNodes[k];
            gfnNode = this.getForceNode(gnNode);
            const ptPoint: PointModel = gfnNode.location;
            ptPoint.x += Math.min(gfnNode.velocityX, this.mszMaxForceVelocity.width);
            ptPoint.y += Math.min(gfnNode.velocityY, this.mszMaxForceVelocity.height);
            gfnNode.velocityX = 0;
            gfnNode.velocityY = 0;
            gfnNode.location = ptPoint;
        }
    }
    private resetGraphPosition(lstNodes: IGraphObject[], graph: IGraphObject): void {
        const szMin: SizeF = { width: Number.MAX_VALUE, height: Number.MAX_VALUE };
        let gfnNode: GraphForceNode = null;
        let gnNode: IGraphObject;
        for (let k: number = 0; k < lstNodes.length; k++) {
            gnNode = lstNodes[k];
            gfnNode = this.getForceNode(gnNode);
            const ptLocation: PointModel = {
                x: gfnNode.location.x - gnNode.actualSize.width / 2,
                y: gfnNode.location.y - gnNode.actualSize.height / 2
            };
            szMin.width = Math.min(szMin.width, ptLocation.x);
            szMin.height = Math.min(szMin.height, ptLocation.y);
        }
        for (let k: number = 0; k < lstNodes.length; k++) {
            gnNode = lstNodes[k];
            gfnNode = this.getForceNode(gnNode);
            const ptLocation: PointModel = gfnNode.location;
            ptLocation.x -= szMin.width - (graph.treeInfo.location ? graph.treeInfo.location.x : 0);
            ptLocation.y -= szMin.height - (graph.treeInfo.location ? graph.treeInfo.location.y : 0);
            gfnNode.location = ptLocation;
            gfnNode.applyChanges();
        }
    }
    private convertGraphNodes(lstNodes: {}): IGraphObject[] {
        const lstToReturn: IGraphObject[] = [];
        const keys: string[] = Object.keys(lstNodes);
        for (const k of keys) {
            if (lstNodes[k]) {
                const gnNode: IGraphObject = lstNodes[k];
                const forceNode: GraphForceNode = new GraphForceNode(gnNode);
                gnNode.treeInfo.tag = forceNode;
                lstToReturn.push(gnNode);
            }
        }
        return lstToReturn;
    }

    /**
     * getForceNode method\
     *
     * @returns {  GraphForceNode }    getForceNode method .\
     * @param {IGraphObject} gnNode - provide the angle value.
     * @private
     */
    public getForceNode(gnNode: IGraphObject): GraphForceNode {
        return <GraphForceNode>gnNode.treeInfo.tag;
    }
    private updateNeigbour(vtSource: GraphForceNode, vtTarget: GraphForceNode): void {
        if (vtTarget == null || vtSource == null) {
            return;
        }
        const distance: number = this.pointDistance(vtSource.location, vtTarget.location);
        const angle: number = this.lineAngle(vtSource.location, vtTarget.location);
        const normalDistance: number = (this.springLength * 0.9);
        if (distance < normalDistance) {
            this.calcForce(distance, normalDistance, angle, vtTarget);
        }
    }
    private lineAngle(pt1: PointModel, pt2: PointModel): number {
        let radians: number = 0;
        const vx: number = pt2.x - pt1.x;
        const vy: number = pt2.y - pt1.y;
        if (vx === 0) {
            if (vy <= 0) {
                radians = (3.0 * Math.PI) / 2.0;
            } else {
                radians = Math.PI / 2.0;
            }
        } else if (vy === 0) {
            if (vx < 0) {
                radians = Math.PI;
            } else {
                radians = 0;
            }
        } else {
            radians = Math.atan(vy / vx);
            if (vx < 0 && vy > 0) {
                radians = Math.PI + radians;
            } else if (vx < 0 && vy < 0) {
                radians = Math.PI + radians;
            } else if (vx > 0 && vy < 0) {
                radians = 2.0 * Math.PI + radians;
            }
        }
        return radians;
    }
    private pointDistance(pt1: PointModel, pt2: PointModel): number {
        let d: number = 0;
        const dx: number = pt2.x - pt1.x;
        const dy: number = pt2.y - pt1.y;
        const t: number = (dx * dx) + (dy * dy);
        if (t > 0) {
            d = Math.sqrt(t);
        }
        return d;
    }
    private calcRelatesForce(vtSource: GraphForceNode, vtTarget: GraphForceNode, normalDistance: number): void {
        const distance: number = this.pointDistance(vtSource.location, vtTarget.location);
        const angle: number = this.lineAngle(vtSource.location, vtTarget.location);
        if (distance < normalDistance) {
            this.calcForce(distance, normalDistance, angle, vtTarget);
        }
    }
    /**
     * @param nodeCollection
     * @param connectors
     * @param symmetricLayout
     * @param nameTable
     * @param layout
     * @param viewPort
     * @private
     */
    /**
     * updateLayout method\
     *
     * @returns {  void }    updateLayout method .\
     * @param {IGraphObject[]} nodeCollection - provide the angle value.
     * @param {IGraphObject[]} connectors - provide the connectors value.
     * @param {SymmetricLayout} symmetricLayout - provide the symmetricLayout value.
     * @param {Object} nameTable - provide the nameTable value.
     * @param {Layout} layout - provide the layout value.
     * @param {PointModel} viewPort - provide the viewPort value.
     * @private
     */
    public updateLayout(
        nodeCollection: IGraphObject[], connectors: IGraphObject[],
        symmetricLayout: SymmetricLayout, nameTable: Object, layout: Layout,
        viewPort: PointModel): void {
        const layoutManager: GraphLayoutManager = new GraphLayoutManager();
        layoutManager.updateLayout(nodeCollection, connectors, symmetricLayout, nameTable, layout, viewPort);
    }
    private calcNodesForce(vtSource: GraphForceNode, vtTarget: GraphForceNode): void {
        const distance: number = this.pointDistance(vtSource.location, vtTarget.location);
        const angle: number = this.lineAngle(vtSource.location, vtTarget.location);
        if (distance > this.springLength || distance < this.springLength) {
            this.calcForce(distance, this.springLength, angle, vtTarget);
        }
    }
    private calcForce(distance: number, minDist: number, angle: number, vtTarget: GraphForceNode): void {
        const count: number = vtTarget.nodes.length;
        const length: number = distance - minDist;
        const factor: number = this.springFactor / (count * count) * Math.sqrt(count);
        if (length !== 0) {
            const fVelocity: number = length * factor;
            const fOffset: number = fVelocity;
            const offsetX: number = Math.cos(angle) * fOffset;
            const offsetY: number = Math.sin(angle) * fOffset;
            vtTarget.velocityX -= offsetX;
            vtTarget.velocityY -= offsetY;
        }
    }
}

export class GraphLayoutManager {
    private mhelperSelectedNode: IGraphObject;
    private visitedStack: IGraphObject[] = [];
    private cycleEdgesCollection: IGraphObject[] = [];
    private nameTable: Object;
    /**
     * @private
     */
    public nodes: IGraphObject[];
    private graphObjects: IGraphObject[] = [];
    private connectors: IGraphObject[];
    private passedNodes: IGraphObject[] = [];
    /**
     * @private
     */
    public selectedNode: IGraphObject;
    /**
     * @param nodeCollection
     * @param connectors
     * @param symmetricLayout
     * @param nameTable
     * @param layout
     * @param viewPort
     * @private
     */
    /**
     * updateLayout method\
     *
     * @returns {  boolean }    updateLayout method .\
     * @param {IGraphObject[]} nodeCollection - provide the nodeCollection value.
     * @param {IGraphObject[]} connectors - provide the nodeCollection value.
     * @param {SymmetricLayout} symmetricLayout - provide the nodeCollection value.
     * @param {Object} nameTable - provide the nodeCollection value.
     * @param {Layout} layout - provide the nodeCollection value.
     * @param {PointModel} viewPort - provide the nodeCollection value.
     * @private
     */
    public updateLayout(
        nodeCollection: IGraphObject[], connectors: IGraphObject[],
        symmetricLayout: SymmetricLayout, nameTable: Object, layout: Layout,
        viewPort: PointModel): boolean {
        this.nameTable = nameTable;
        this.nodes = nodeCollection; this.connectors = connectors;
        const selectionList: IGraphObject[] = nodeCollection;
        if (selectionList.length > 0) {
            this.mhelperSelectedNode = cloneObject(selectionList[0]) as IGraphObject;
        }
        for (const node of nodeCollection) {
            const nodeGraphObject: IGraphObject = node;
            nodeGraphObject.treeInfo = {} as ITreeInfo;
            nodeGraphObject.treeInfo.graphType = 'Node';
            this.graphObjects.push(nodeGraphObject);
        }
        for (const connector of connectors) {
            const connectorGraphObject: IGraphObject = connector;
            connectorGraphObject.treeInfo = {} as ITreeInfo;
            connectorGraphObject.treeInfo.graphType = 'Connector';
            this.graphObjects.push(connectorGraphObject);
        }
        this.updateLayout1(this.graphObjects, symmetricLayout);
        const modelBounds: Rect = this.getModelBounds(selectionList);
        for (let i: number = 0; i < selectionList.length; i++) {
            const node: IGraphObject = selectionList[i];
            const trnsX: number = (viewPort.x - modelBounds.width) / 2;
            const margin: MarginModel = layout.margin || {};
            //let marginX: number; let marginY: number;
            margin.left = margin.left || 0;
            margin.right = margin.right || 0;
            margin.top = margin.top || 0;
            margin.bottom = margin.bottom || 0;
            if (layout.margin.left) {
                margin.left = layout.margin.left;
            }
            if (layout.margin.top) {
                margin.top = layout.margin.top;
            }

            const dx: number = (node.treeInfo.tag.location.x - (node.offsetX - (node.actualSize.width / 2)) -
                modelBounds.x + trnsX + margin.left);
            const dy: number = (node.treeInfo.tag.location.y - (node.offsetY - (node.actualSize.height / 2)) - modelBounds.y + margin.top);
            node.offsetX += dx;
            node.offsetY += dy;
            delete node.treeInfo;
        }
        return true;
    }

    /**
     * getModelBounds method\
     *
     * @returns {  Rect }    getModelBounds method .\
     * @param {IGraphObject[]} lNodes - provide the angle value.
     * @private
     */
    public getModelBounds(lNodes: IGraphObject[]): Rect {
        lNodes = lNodes.slice();
        let rect: Rect = null;
        let rect1: Rect = null;
        let node: IGraphObject;
        for (let i: number = 0; i < lNodes.length; i++) {
            node = lNodes[i];
            const bounds: Rect = getGraphBounds(node);
            rect = new Rect(
                node.treeInfo.tag ? node.treeInfo.tag.location.x : bounds.x,
                node.treeInfo.tag ? node.treeInfo.tag.location.y : bounds.y,
                node.actualSize.width, node.actualSize.height);
            if (rect1) {
                rect1 = rect1.uniteRect(rect);
            } else {
                rect1 = rect;
            }
        }
        return rect1;
    }
    private updateLayout1(nodesToLayout: IGraphObject[], symmetricLayout: SymmetricLayout): boolean {
        this.detectCyclesInGraph(nodesToLayout);
        const nodesCount: number = nodesToLayout.length;
        if (nodesCount > 0) {
            const cycleConnColln: IGraphObject[] = [];
            let nodes: IGraphObject[] = [];
            const nodeSymbols: IGraphObject[] = [];
            for (let s: number = 0; s < nodesToLayout.length; s++) {
                const nd: IGraphObject = nodesToLayout[s];

                if (nd.treeInfo.isCycleEdge === undefined) {
                    nd.treeInfo.isCycleEdge = false;
                }
                if (nd.treeInfo.graphType === 'Connector' && !nd.treeInfo.isCycleEdge) {
                    nodes.push(nd);
                } else if (nd.treeInfo.graphType === 'Connector') {
                    cycleConnColln.push(nd);
                } else {
                    nodeSymbols.push(nd);
                }
            }
            nodes = nodes.concat(nodeSymbols);
            nodes = cycleConnColln.concat(nodes);
            while (nodesCount > this.dictionaryLength(this.passedNodes)) {
                this.getNodesToPosition(nodes);
                if (this.selectedNode == null) {
                    continue;
                }
                symmetricLayout.doLayout(this);
                this.selectedNode = null;
                this.visitedStack = [];
                for (const connector of this.cycleEdgesCollection) {
                    connector.treeInfo.isCycleEdge = false;
                }
            }
            this.passedNodes = null;
            this.selectedNode = null;
        }
        return false;
    }
    private getNodesToPosition(nodes: IGraphObject[]): void {
        for (let i: number = 0; i < nodes.length; i++) {
            const node: IGraphObject = nodes[i];
            if (!collectionContains(node.id, this.passedNodes)) {
                if (node) {
                    this.selectNodes(node);
                }
                break;
            }
        }
    }
    private selectNodes(node: IGraphObject): void {
        const nodeGraph: IGraphObject = node;
        if (node.treeInfo.graphType === 'Connector') {
            this.exploreGraphEdge(node);
        } else if (nodeGraph != null) {
            if (this.addNode(node, 'passed')) {
                this.addNode(node, 'selected');
                if (this.isConnectedToAnotherNode(nodeGraph)) {
                    this.selectedNode = { treeInfo: {} } as IGraphObject;
                    this.selectedNode.treeInfo.LeftMargin = 10;
                    this.selectedNode.treeInfo.TopMargin = 10;
                    this.selectConnectedNodes(nodeGraph);
                } else {
                    this.selectedNode = node;
                }
            }
        }
    }
    private selectConnectedNodes(nodeGraph: IGraphObject): void {
        const graph: IGraphObject = this.selectedNode;
        if (!graph.treeInfo.GraphNodes) {
            graph.treeInfo.GraphNodes = {};
        }
        const node: IGraphObject = nodeGraph;
        if (node != null && this.addNode(node, 'passed')) {
            const nodeName: string = node.id;
            if (!this.dictionaryContains(graph.treeInfo.GraphNodes, node)) {
                const gnNode: IGraphObject = this.addGraphNode(node);
                this.getConnectedRelatives(gnNode);
                this.exploreRelatives(nodeGraph);
            } else {
                const graphNode: IGraphObject = graph.treeInfo.GraphNodes[nodeName];
                if (graphNode.treeInfo.Added) {
                    graphNode.treeInfo.Added = false;
                    this.getConnectedRelatives(graphNode);
                    this.exploreRelatives(nodeGraph);
                }
            }
        }
    }
    private exploreRelatives(nodeGraph: IGraphObject): void {
        this.exploreRelatives1(nodeGraph, 'Parents');
        this.exploreRelatives1(nodeGraph, 'Children');
    }
    private exploreRelatives1(nodeGraph: IGraphObject, relativesToExplore: string): void {
        let edges: string[] = [];
        if (relativesToExplore === 'Parents') {
            edges = nodeGraph.inEdges;
        } else if (relativesToExplore === 'Children') {
            edges = nodeGraph.outEdges;
        }
        for (let i: number = 0; i < edges.length; i++) {
            const edge: IGraphObject = this.nameTable[edges[i]];
            if (this.addNode(edge, 'passed')) {
                const fromNode: IGraphObject = this.nameTable[edge.sourceID];
                const toNode: IGraphObject = this.nameTable[edge.targetID];
                if (relativesToExplore === 'Parents' && fromNode != null &&
                    collectionContains(fromNode.id, this.nodes)) {
                    this.selectConnectedNodes(this.nameTable[edge.sourceID]);
                } else if (relativesToExplore === 'Children' && toNode != null &&
                    collectionContains(toNode.id, this.nodes)) {
                    this.selectConnectedNodes(this.nameTable[edge.targetID]);
                }
            }
        }
    }
    private getConnectedRelatives(graphNode: IGraphObject): void {
        this.getConnectedParents(graphNode);
        this.getConnectedChildren(graphNode);
    }

    private dictionaryContains(obj: {}, keyObj: IGraphObject): boolean {
        const keys: string[] = Object.keys(obj);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[i] === keyObj.id) {
                return true;
            }
        }
        return false;
    }
    private dictionaryLength(obj: Object): number {
        const keys: string[] = Object.keys(obj);
        return keys.length;
    }

    private getConnectedChildren(graphNode: IGraphObject): void {
        const graph: IGraphObject = this.selectedNode;
        const nodeGraph: IGraphObject = graphNode;
        for (let s: number = 0; s < nodeGraph.outEdges.length; s++) {
            const edge: IGraphObject = this.nameTable[nodeGraph.outEdges[s]];
            if (!edge.treeInfo.isCycleEdge) {
                const node: IGraphObject = this.nameTable[edge.targetID];
                if (collectionContains(node.id, this.nodes) && node != null && node.visible) {
                    let gnNodeChildren: IGraphObject;
                    if (!this.dictionaryContains(graph.treeInfo.GraphNodes, node)) {
                        gnNodeChildren = this.addGraphNode(node);
                        gnNodeChildren.treeInfo.Added = true;
                    } else {
                        gnNodeChildren = graph.treeInfo.GraphNodes[node.id];
                    }
                    if (!graphNode.treeInfo.children) {
                        graphNode.treeInfo.children = [];
                    }
                    if (!gnNodeChildren.treeInfo.parents) {
                        gnNodeChildren.treeInfo.parents = [];
                    }
                    this.setNode(gnNodeChildren.treeInfo.parents, graphNode);
                    if (this.findNode(graphNode.treeInfo.children, gnNodeChildren.id) < 0) {
                        graphNode.treeInfo.children.push(gnNodeChildren);
                    }
                }
            }
        }
    }
    private getConnectedParents(graphNode: IGraphObject): void {
        const graph: IGraphObject = this.selectedNode;
        const nodeGraph: IGraphObject = graphNode;
        for (let s: number = 0; s < nodeGraph.inEdges.length; s++) {
            const edge: IGraphObject = this.nameTable[nodeGraph.inEdges[s]];
            if (!edge.treeInfo.isCycleEdge) {
                const node: IGraphObject = this.nameTable[edge.sourceID];
                if (collectionContains(node.id, this.nodes) && node != null && node.visible) {
                    let gnNode: IGraphObject;
                    if (!this.dictionaryContains(graph.treeInfo.GraphNodes, node)) {
                        gnNode = this.addGraphNode(node);
                        gnNode.treeInfo.Added = true;
                    } else {
                        gnNode = graph.treeInfo.GraphNodes[node.id];
                    }
                    if (!graphNode.treeInfo.parents) {
                        graphNode.treeInfo.parents = [];
                    }
                    if (!gnNode.treeInfo.children) {
                        gnNode.treeInfo.children = [];
                    }
                    this.setNode(gnNode.treeInfo.children, graphNode);
                    if (this.findNode(graphNode.treeInfo.parents, gnNode.id) < 0) {
                        graphNode.treeInfo.parents.push(gnNode);
                    }
                }
            }
        }
    }
    private setNode(list: IGraphObject[], node: IGraphObject): void {
        const nIndex: number = this.findNode(list, node.id);
        if (nIndex >= 0 && nIndex < list.length) {
            list[nIndex] = node;
        } else {
            list.push(node);
        }
    }
    private findNode(list: IGraphObject[], fullName: string): number {
        let nIndex: number = -1;
        if (list != null && fullName !== '') {
            for (let i: number = 0, nLength: number = list.length; i < nLength; i++) {
                const gnNode: IGraphObject = list[i];
                if (typeof (gnNode) === 'string' && gnNode === fullName) {
                    nIndex = i;
                    break;
                } else if (gnNode != null && gnNode.id === fullName) {
                    nIndex = i;
                    break;
                }
            }
        }
        return nIndex;
    }
    private addGraphNode(node: IGraphObject): IGraphObject {
        const graph: IGraphObject = this.selectedNode;
        if (!graph.treeInfo.GraphNodes) {
            graph.treeInfo.GraphNodes = {};
        }
        const gnNode: IGraphObject = node;
        if (graph != null) {
            graph.treeInfo.GraphNodes[gnNode.id] = gnNode;
            const nodeHelper: IGraphObject = this.mhelperSelectedNode;
            if (nodeHelper != null && node.id === nodeHelper.id) {
                this.mhelperSelectedNode = gnNode;
            }
        }
        return gnNode;
    }
    private isConnectedToAnotherNode(gnNode: IGraphObject): boolean {
        let bFoundConnectedNode: boolean = false;
        const edges: string[] = (gnNode.inEdges).concat(gnNode.outEdges);
        if (edges.length > 0) {
            if ((gnNode.inEdges != null) && (gnNode.inEdges.length > 0)) {
                bFoundConnectedNode = this.searchEdgeCollection(gnNode.inEdges, 'FromNode');
            }
            if ((!bFoundConnectedNode) && (gnNode.outEdges != null) && (gnNode.outEdges.length > 0)) {
                bFoundConnectedNode = this.searchEdgeCollection(gnNode.outEdges, 'ToNode');
            }
        }
        return bFoundConnectedNode;
    }
    private searchEdgeCollection(edgesToSearchThrough: string[], connectionDirection: string): boolean {
        let bFoundConnectedNode: boolean = false;
        for (let i: number = 0; i < edgesToSearchThrough.length - 1; i++) {
            const edge: IGraphObject = this.nameTable[edgesToSearchThrough[i]];
            if (!this.addNode(edge, 'passed')) {
                continue;
            }
            if (!edge.treeInfo.isCycleEdge && ((connectionDirection === 'FromNode' && this.nameTable[edge.sourceID] != null)
                || (connectionDirection === 'ToNode' && this.nameTable[edge.targetID] != null))) {
                bFoundConnectedNode = true;
                break;
            }
        }
        return bFoundConnectedNode;
    }
    private exploreGraphEdge(node: IGraphObject): void {
        const nodeLink: IGraphObject = node;
        if (nodeLink != null && !nodeLink.treeInfo.isCycleEdge && this.addNode(node, 'passed')) {
            this.addNode(node, 'selected');
            const fromNode: IGraphObject = this.nameTable[nodeLink.sourceID];
            const toNode: IGraphObject = this.nameTable[nodeLink.targetID];
            if (fromNode != null) {
                this.selectNodes(fromNode);
            } else if (toNode != null) {
                this.selectNodes(toNode);
            } else { this.selectedNode = node; }
        }
    }
    private addNode(nodeToAdd: IGraphObject, collectionToAdd: string): boolean {
        const bResult: boolean = true;
        const node: IGraphObject = nodeToAdd;
        if (collectionToAdd === 'passed' || !node.visible) {
            if (!this.dictionaryContains(this.passedNodes, node)) {
                this.passedNodes[node.id] = node;
            }
        }
        if (!node.visible) {
            return false;
        }
        return bResult;
    }
    private detectCyclesInGraph(nodes: IGraphObject[]): void {
        const vertex: IGraphObject[] = [];
        const currentStack: IGraphObject[] = [];
        for (let k: number = 0; k < nodes.length; k++) {
            if (!(nodes[k].treeInfo.graphType === 'Connector')) {
                vertex.push(nodes[k]);
            }
        }
        if (vertex.length > 0) {
            currentStack.push(vertex[0]);
            this.visitedStack.push(vertex[0]);
            while (currentStack.length > 0) {
                const top: IGraphObject = currentStack[currentStack.length - 1];
                const childNodes: IGraphObject[] = this.getUnVisitedChildNodes(top);
                if (childNodes.length > 0) {
                    const child: IGraphObject = childNodes[0];
                    const currentEdge: IGraphObject = childNodes[childNodes.length - 1];
                    if (collectionContains(child.id, this.visitedStack)) {
                        currentEdge.treeInfo.isCycleEdge = true;
                        this.cycleEdgesCollection.push(currentEdge);
                    } else {
                        currentStack.push(child);
                        this.visitedStack.splice(0, 0, child);
                    }
                } else { currentStack.pop(); }
            }
        }
    }
    private getUnVisitedChildNodes(top: IGraphObject): IGraphObject[] {
        const childNodes: IGraphObject[] = [];
        if (top.outEdges.length > 0) {
            for (let i: number = 0; i < top.outEdges.length; i++) {
                const con: IGraphObject = this.nameTable[top.outEdges[i]];
                if (!collectionContains(con.id, this.visitedStack)) {
                    const toNode: IGraphObject = this.nameTable[con.targetID];
                    if (toNode != null) {
                        childNodes.push(toNode);
                    }
                    childNodes.push(con);
                    this.visitedStack.splice(0, 0, con);
                    return childNodes;
                }
            }
            return childNodes;
        }
        return childNodes;
    }
}

interface SizeF {
    width?: number;
    height?: number;
}




export interface ITreeInfo extends INode, IConnector {
    graphType?: GraphObjectType;
    parents?: IGraphObject[];
    children?: IGraphObject[];
    tag?: GraphForceNode;
    center?: PointModel;
    Added?: boolean;
    isCycleEdge: boolean;
    visible?: boolean;
    GraphNodes?: {};
    LeftMargin?: number;
    TopMargin?: number;
    location?: PointModel;
    Bounds?: Rect;
}


export interface IGraphObject extends INode, IConnector {
    treeInfo?: ITreeInfo;
}

export type GraphObjectType = 'Node' | 'Connector';



/**
 * getGraphBounds method\
 *
 * @returns {  void }    getGraphBounds method .\
 * @param {IGraphObject} node - provide the angle value.
 * @private
 */
function getGraphBounds(node: IGraphObject): Rect {
    const x: number = node.offsetX - node.actualSize.width * node.pivot.x;
    const y: number = node.offsetY - node.actualSize.height * node.pivot.y;
    return new Rect(x, y, node.actualSize.width, node.actualSize.height);
}

/**
 * @param id
 * @param coll
 */
/**
 * collectionContains method\
 *
 * @returns {  boolean }    collectionContains method .\
 * @param {string} id - provide the id value.
 * @param {IGraphObject[]} coll - provide the id value.
 * @private
 */
function collectionContains(id: string, coll: IGraphObject[]): boolean {
    for (let i: number = 0; i < coll.length; i++) {
        if (coll[i].id === id) {
            return true;
        }
    }
    return false;
}


