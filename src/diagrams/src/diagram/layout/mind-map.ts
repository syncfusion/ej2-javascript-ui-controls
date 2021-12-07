/* eslint-disable valid-jsdoc */
import { Layout, ILayout, INode } from './layout-base';
import { BranchTypes } from '../enum/enum';
import { Rect } from '../primitives/rect';
import { getFunction } from '../utility/base-util';
import { PointModel } from '../primitives/point-model';
import { HierarchicalTree } from './hierarchical-tree';
import { NodeModel } from '../objects/node-model';


/**
 * Layout for mind-map tree
 */

export class MindMap {

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
     * Defines the layout animation
     *
     */
    public isAnimation: boolean = false;

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the layout
         */

        return 'MindMapChart';
    }

    /**
     * @param nodes
     * @param nameTable
     * @param layoutProp
     * @param viewPort
     * @param uniqueId
     * @param root
     * @private
     */
    public updateLayout(
        nodes: INode[], nameTable: Object, layoutProp: Layout, viewPort: PointModel, uniqueId: string, root?: string): void {
        const isRoot: string = this.checkRoot(nodes, layoutProp, uniqueId, root, nameTable);
        if (isRoot) {
            layoutProp.fixedNode = isRoot;
        } else {
            for (const node of nodes) {
                if (!node.excludeFromLayout) {
                    if (!node.inEdges || !node.inEdges.length) {
                        layoutProp.fixedNode = node.id;
                        break;
                    }
                }
            }
        }
        const rootNode: INode = nameTable[layoutProp.fixedNode];
        const fistLevelNodes: INode[] = this.findFirstLevelNodes(rootNode, layoutProp, nameTable);
        const leftNodes: INode[] = []; const rightNodes: INode[] = [];
        let getMindmapBranch: Function = getFunction(layoutProp.getBranch);
        getMindmapBranch = getMindmapBranch || getFunction(this.getBranch);
        for (const node of fistLevelNodes) {
            let align: BranchTypes = getMindmapBranch(node, fistLevelNodes);
            align = node && (node as NodeModel).branch ? (node as NodeModel).branch : align;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (align === 'Left') ? leftNodes.push(node) : rightNodes.push(node);
        }
        const viewPortBounds: Rect = new Rect(0, 0, viewPort.x, viewPort.y);
        nameTable[layoutProp.fixedNode].offsetX = viewPortBounds.x + viewPortBounds.width / 2;
        nameTable[layoutProp.fixedNode].offsetY = viewPortBounds.y + viewPortBounds.height / 2;
        if (leftNodes.length) {
            this.updateMindMapBranch(nodes, rightNodes, nameTable, layoutProp, viewPort, uniqueId, 'Left');
        }
        if (rightNodes.length) {
            this.updateMindMapBranch(nodes, leftNodes, nameTable, layoutProp, viewPort, uniqueId, 'Right');
        }

    }

    private checkRoot(nodes: INode[], layoutProp: Layout, uniqueId?: string, root?: string, nameTable?: Object): string {
        for (const node of nodes) {
            if (!node.excludeFromLayout) {
                if (node.data && (node.data[uniqueId].toString() === root || node.data[uniqueId].toString()
                    === layoutProp.root)) {
                    return node.id;
                } else if (!node.data && node.id === layoutProp.root) {
                    return node.id;
                }
            }
        }
        return '';
    }

    private updateMindMapBranch(
        nodes: INode[], excludeNodes: INode[], nameTable: Object, layoutProp: Layout,
        viewPort: PointModel, uniqueId: string, side: BranchTypes): void {
        const layout: ILayout = {
            type: 'HierarchicalTree',
            horizontalSpacing: layoutProp.verticalSpacing, verticalSpacing: layoutProp.horizontalSpacing,
            verticalAlignment: layoutProp.verticalAlignment, horizontalAlignment: layoutProp.horizontalAlignment,
            fixedNode: layoutProp.fixedNode, getLayoutInfo: getFunction(layoutProp.getLayoutInfo),
            layoutInfo: layoutProp.layoutInfo, margin: layoutProp.margin,
            root: layoutProp.fixedNode
        };
        (layout as Layout).orientation = (side === 'Left') ? 'LeftToRight' : 'RightToLeft';
        this.excludeFromLayout(excludeNodes, nameTable, true);

        const mapLayout: HierarchicalTree = new HierarchicalTree();
        mapLayout.updateLayout(nodes, nameTable, layout as Layout, viewPort, uniqueId);
        this.excludeFromLayout(excludeNodes, nameTable, false);
    }

    private getBranch(obj: INode, firstLevelNodes: INode[]): BranchTypes {
        let side: BranchTypes;
        const i: number = firstLevelNodes.indexOf(obj);
        if (i % 2 === 0) {
            side = 'Left';
        } else {
            side = 'Right';
        }
        return side;
    }

    private excludeFromLayout(newCollection: INode[], nameTable: Object, exclude: boolean): void {
        for (const newcol of newCollection) {
            const node: INode = nameTable[newcol.id];
            node.excludeFromLayout = exclude;
        }
    }

    private findFirstLevelNodes(node: INode, layout: Layout, nameTable: Object): INode[] {
        let parentNode: INode;
        const fistLevelNodes: INode[] = [];
        if (node && node.outEdges.length) {
            for (const outEdge of node.outEdges) {
                fistLevelNodes.push(nameTable[nameTable[outEdge].targetID]);
            }
        }
        return fistLevelNodes;
    }





}


