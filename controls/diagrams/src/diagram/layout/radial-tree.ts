/* eslint-disable valid-jsdoc */
import { INode, Layout, Bounds } from './layout-base';
import { PointModel } from '../primitives/point-model';
import { HorizontalAlignment, VerticalAlignment } from '../enum/enum';
import { Rect } from '../primitives/rect';
import { MarginModel } from '../core/appearance-model';


/**
 * Radial Tree
 */

export class RadialTree {

    /**
     * Constructor for the organizational chart module.
     *
     * @private
     */

    constructor() {
        //constructs the layout module
    }

    /**
     * To destroy the organizational chart
     *
     * @returns {void}
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

        return 'RadialTree';
    }


    /**
     * @param nodes
     * @param nameTable
     * @param layoutProp
     * @param viewport
     * @private
     */
    public updateLayout(nodes: INode[], nameTable: Object, layoutProp: Layout, viewport: PointModel): void {
        const layout: IRadialLayout = {
            type: layoutProp.type,
            nameTable: nameTable, anchorX: 0, anchorY: 0,
            firstLevelNodes: [], centerNode: null, levels: [], maxLevel: 0, graphNodes: {}, layoutNodes: [],
            orientation: layoutProp.orientation,
            horizontalSpacing: layoutProp.horizontalSpacing, verticalSpacing: layoutProp.verticalSpacing,
            verticalAlignment: layoutProp.verticalAlignment, horizontalAlignment: layoutProp.horizontalAlignment,
            fixedNode: layoutProp.fixedNode, margin: layoutProp.margin,
            bounds: layoutProp.bounds, objects: [], root: layoutProp.root
        };
        this.doLayout(layout, nodes, nameTable, viewport);
    }

    private doLayout(layout: IRadialLayout, nodes: INode[], nameTable: Object, viewport: PointModel): void {
        let node: INode;
        for (let i: number = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (!node.excludeFromLayout) {
                layout.graphNodes[node.id] = this.setUpLayoutInfo(layout, node);
                if (!node.inEdges || !node.inEdges.length) {
                    layout.firstLevelNodes.push(node);
                }
            }
        }
        if (layout.root && nameTable[layout.root]) {
            layout.centerNode = nameTable[layout.root];
        } else if (layout.firstLevelNodes.length) {
            layout.centerNode = layout.firstLevelNodes[0];
            layout.root = layout.centerNode.id;
        }
        if (layout.centerNode) {
            this.updateEdges(layout, layout.centerNode, 0, nameTable);
            this.depthFirstAllignment(layout, layout.centerNode, 0, 0);
            this.populateLevels(layout);
            this.transformToCircleLayout(layout);
            this.updateAnchor(layout, viewport);
            this.updateNodes(layout, layout.centerNode, nameTable);
        }
    }

    private updateEdges(layout: IRadialLayout, node: INode, depth: number, nameTable: Object): void {
        const nodeInfo: ILayoutInfo = layout.graphNodes[node.id];
        layout.layoutNodes.push(nodeInfo);
        nodeInfo.level = depth;
        nodeInfo.visited = true;
        layout.maxLevel = Math.max(layout.maxLevel, depth);
        for (let j: number = 0; j < node.outEdges.length; j++) {
            const edge: INode = nameTable[nameTable[node.outEdges[j]].targetID];
            if (!edge.excludeFromLayout && !edge.visited) {
                nodeInfo.children.push(edge);
                this.updateEdges(layout, edge, depth + 1, nameTable);
            }
        }
    }

    private depthFirstAllignment(layout: IRadialLayout, node: INode, x: number, y: number): PointModel {
        let newValue: PointModel;
        const nodeInfo: INodeInfo = layout.graphNodes[node.id];
        if (nodeInfo.children.length) {
            y += 300;
            for (let i: number = 0; i < nodeInfo.children.length; i++) {
                newValue = this.depthFirstAllignment(layout, nodeInfo.children[i], x, y);
                x = newValue.x; y = newValue.y;
            }
            nodeInfo.children = nodeInfo.children.sort((obj1: INode, obj2: INode) => {
                return layout.graphNodes[obj1.id].x - layout.graphNodes[obj2.id].x;
            });
            const min: number = layout.graphNodes[nodeInfo.children[0].id].min;
            let max: number = layout.graphNodes[nodeInfo.children[nodeInfo.children.length - 1].id].max;
            nodeInfo.x = min + (max - min) / 2;
            x = max + layout.horizontalSpacing;
            nodeInfo.segmentOffset = max + layout.horizontalSpacing;
            nodeInfo.x -= nodeInfo.width / 2;
            nodeInfo.y -= nodeInfo.height / 2;
            nodeInfo.min = min;
            nodeInfo.max = max;
            if (nodeInfo.x < min && nodeInfo.visited) {
                nodeInfo.x = min;
                x = nodeInfo.x + nodeInfo.width / 2 - (max - min) / 2;
                nodeInfo.visited = false;
                for (let i: number = 0; i < nodeInfo.children.length; i++) {
                    newValue = this.depthFirstAllignment(layout, nodeInfo.children[i], x, y);
                }
                nodeInfo.visited = true;
                x = nodeInfo.x + nodeInfo.width + layout.horizontalSpacing;
            }
            max = layout.graphNodes[nodeInfo.children[nodeInfo.children.length - 1].id].segmentOffset;
            x = x < max ? max : x;
            y -= 300;
            nodeInfo.y = y as number;
        } else {
            nodeInfo.x = x as number;
            nodeInfo.y = y as number;
            nodeInfo.min = x as number;
            nodeInfo.max = x as number + nodeInfo.width;
            x += nodeInfo.width + layout.horizontalSpacing;
        }
        return { x: x, y: y };
    }

    private populateLevels(layout: IRadialLayout): void {
        let stages: IStage[] = [];
        // eslint-disable-next-line prefer-spread
        const min: number = Math.min.apply(Math, layout.layoutNodes.map((nodeInfo: INodeInfo) => { return nodeInfo.x; }));
        // eslint-disable-next-line prefer-spread
        const max: number = Math.max.apply(Math, layout.layoutNodes.map((nodeInfo: INodeInfo) => {
            return nodeInfo.x + nodeInfo.width + layout.horizontalSpacing;
        }));
        const full: number = max - min;
        layout.levels = [];
        for (let i: number = 0; i <= layout.maxLevel; i++) {
            stages = layout.layoutNodes.filter((nodeInfo: INodeInfo) => {
                if (nodeInfo.level === i) {
                    return nodeInfo;
                } else {
                    return null;
                }
            });
            const newlevel: INodeInfo = {};
            stages = stages.sort((nodeInfo1: INodeInfo, nodeInfo2: INodeInfo) => { return nodeInfo1.x - nodeInfo2.x; });
            newlevel.min = stages[0].x;
            newlevel.max = stages[stages.length - 1].x + stages[stages.length - 1].width + layout.horizontalSpacing;
            newlevel.actualCircumference = 0;
            newlevel.height = 0;
            for (let k: number = 0; k < stages.length; k++) {
                if (stages[k].height > newlevel.height) { newlevel.height = stages[k].height; }
                newlevel.actualCircumference += Math.max(stages[k].width, stages[k].height);
                if (k !== stages.length - 1) { newlevel.actualCircumference += layout.horizontalSpacing; }
            }
            newlevel.circumference = newlevel.max - newlevel.min;
            if (newlevel.actualCircumference < newlevel.circumference) {
                newlevel.circumference = (newlevel.circumference + newlevel.actualCircumference) / 2;
            }
            newlevel.radius = newlevel.circumference / (2 * Math.PI) + newlevel.height;
            newlevel.nodes = [];
            if (i > 1) {
                if (layout.levels[i - 1].radius + layout.levels[i - 1].height >= newlevel.radius) {
                    newlevel.radius = layout.levels[i - 1].radius + layout.levels[i - 1].height;
                }
            }
            for (let j: number = 0; j < stages.length; j++) {
                stages[j].ratio = Math.abs(stages[j].x + stages[j].width / 2 - min) / full;
                newlevel.nodes.push(stages[j] as INode);
            }
            layout.levels.push(newlevel as LevelBoundary);
        }
    }

    private transformToCircleLayout(layout: IRadialLayout): void {
        const root: INodeInfo = layout.graphNodes[layout.centerNode.id];
        root.x = 0;
        root.y = 0;
        for (let i: number = 1; i < layout.levels.length; i++) {
            for (let j: number = 0; j < layout.levels[i].nodes.length; j++) {
                const nodeInfo: ILayoutInfo = layout.levels[i].nodes[j];
                nodeInfo.x = Math.cos(nodeInfo.ratio * 360 * Math.PI / 180) * (layout.levels[i].radius + layout.verticalSpacing * i);
                nodeInfo.y = Math.sin(nodeInfo.ratio * 360 * Math.PI / 180) * (layout.levels[i].radius + layout.verticalSpacing * i);
                layout.anchorX = Math.min(layout.anchorX, nodeInfo.x);
                layout.anchorY = Math.min(layout.anchorY, nodeInfo.y);
            }
        }
    }

    private updateAnchor(layout: IRadialLayout, viewPort: PointModel): void {
        layout.anchorX = layout.centerNode.offsetX || viewPort.x / 2;
        layout.anchorY = layout.centerNode.offsetY || viewPort.y / 2;
    }

    private updateNodes(layout: IRadialLayout, node: INode, nameTable: Object): void {
        const nodeInfo: INodeInfo = layout.graphNodes[node.id];
        const offsetX: number = nodeInfo.x + layout.anchorX;
        const offsetY: number = nodeInfo.y + layout.anchorY;
        node.offsetX += offsetX;
        node.offsetY += offsetY;
        for (let i: number = 0; i < nodeInfo.children.length; i++) {
            const childInfo: INode = nodeInfo.children[i];
            this.updateNodes(layout, nameTable[childInfo.id], nameTable);
        }
    }

    private setUpLayoutInfo(layout: IRadialLayout, item: INode): ILayoutInfo {
        const info: ILayoutInfo = {};
        info.name = item.id;
        info.x = 0;
        info.y = 0;
        info.min = 0;
        info.max = 0;
        info.width = item.actualSize.width;
        info.height = item.actualSize.height;
        info.children = [];
        info.level = 0;
        info.ratio = 0;
        info.visited = false;
        return info;
    }
}

/**
 * Defines the properties of layout
 *
 * @private
 */
export interface IRadialLayout {
    anchorX?: number;
    anchorY?: number;
    maxLevel?: number;
    nameTable?: Object;
    firstLevelNodes?: INode[];
    layoutNodes?: INodeInfo[];
    centerNode?: INode;
    type?: string;
    orientation?: string;
    graphNodes?: {};
    verticalSpacing?: number;
    horizontalSpacing?: number;
    levels?: LevelBoundary[];
    horizontalAlignment?: HorizontalAlignment;
    verticalAlignment?: VerticalAlignment;
    fixedNode?: string;
    bounds?: Rect;
    level?: number;
    margin?: MarginModel;
    objects?: INode[];
    root?: string;
}

/**
 * Defines the layout information
 */
interface ILayoutInfo {
    name?: string;
    x?: number;
    y?: number;
    min?: number;
    max?: number;
    level?: number;
    ratio?: number;
    visited?: boolean;
    children?: INode[];
    width?: number;
    height?: number;
}

interface IStage {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    ratio?: number;
}


/**
 * Defines the node arrangement in radial manner
 *
 * @private
 */
export interface INodeInfo {
    level?: number;
    visited?: boolean;
    children?: INode[];
    x?: number;
    y?: number;
    min?: number;
    max?: number;
    width?: number;
    height?: number;
    segmentOffset?: number;
    actualCircumference?: number;
    radius?: number;
    circumference?: number;
    nodes?: INode[];
    ratio?: number;
}

/** @private */
export interface LevelBoundary {
    rBounds: Bounds;
    radius: number;
    height: number;
    nodes: INode[];
    node: INodeInfo;
}

