import { Layout, ILayout, INode } from './layout-base';
import { BranchTypes } from '../enum/enum';
import { Rect } from '../primitives/rect';
import { getFunction } from '../utility/base-util';
import { PointModel } from '../primitives/point-model';
import { HierarchicalTree } from './hierarchical-tree';


/**
 * Layout for mind-map tree
 */

export class MindMap {

    /**
     * Constructor for the organizational chart module.
     * @private
     */

    constructor() {
        //constructs the layout module
    }

    /**
     * To destroy the organizational chart
     * @return {void}
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

    /**   @private  */
    public updateLayout(
        nodes: INode[], nameTable: Object, layoutProp: Layout, viewPort: PointModel, uniqueId: string, root?: string): void {
        let isRoot: string;
        isRoot = this.checkRoot(nodes, layoutProp, uniqueId, root, nameTable);
        if (isRoot) {
            layoutProp.fixedNode = isRoot;
        } else {
            for (let node of nodes) {
                if (!node.excludeFromLayout) {
                    if (!node.inEdges || !node.inEdges.length) {
                        layoutProp.fixedNode = node.id;
                        break;
                    }
                }
            }
        }

        let rootNode: INode = nameTable[layoutProp.fixedNode];
        let fistLevelNodes: INode[] = this.findFirstLevelNodes(rootNode, layoutProp, nameTable);
        let leftNodes: INode[] = []; let rightNodes: INode[] = [];
        let getMindmapBranch: Function = getFunction(layoutProp.getBranch);
        getMindmapBranch = getMindmapBranch || getFunction(this.getBranch);
        for (let node of fistLevelNodes) {
            let align: BranchTypes = getMindmapBranch(node, fistLevelNodes);
            (align === 'Left') ? leftNodes.push(node) : rightNodes.push(node);
        }
        let viewPortBounds: Rect = new Rect(0, 0, viewPort.x, viewPort.y);
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
        for (let node of nodes) {
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
        let layout: ILayout;
        layout = {
            type: 'HierarchicalTree',
            horizontalSpacing: layoutProp.verticalSpacing, verticalSpacing: layoutProp.horizontalSpacing,
            verticalAlignment: layoutProp.verticalAlignment, horizontalAlignment: layoutProp.horizontalAlignment,
            fixedNode: layoutProp.fixedNode, getLayoutInfo: getFunction(layoutProp.getLayoutInfo), margin: layoutProp.margin,
            root: layoutProp.fixedNode
        };
        (layout as Layout).orientation = (side === 'Left') ? 'LeftToRight' : 'RightToLeft';
        this.excludeFromLayout(excludeNodes, nameTable, true);

        let mapLayout: HierarchicalTree = new HierarchicalTree();
        mapLayout.updateLayout(nodes, nameTable, layout as Layout, viewPort, uniqueId);
        this.excludeFromLayout(excludeNodes, nameTable, false);
    }

    private getBranch(obj: INode, firstLevelNodes: INode[]): BranchTypes {
        let side: BranchTypes;
        let i: number = firstLevelNodes.indexOf(obj);
        if (i % 2 === 0) {
            side = 'Left';
        } else {
            side = 'Right';
        }
        return side;
    }

    private excludeFromLayout(newCollection: INode[], nameTable: Object, exclude: boolean): void {
        for (let newcol of newCollection) {
            let node: INode = nameTable[newcol.id];
            node.excludeFromLayout = exclude;
        }
    }

    private findFirstLevelNodes(node: INode, layout: Layout, nameTable: Object): INode[] {
        let parentNode: INode;
        let fistLevelNodes: INode[] = [];
        if (node && node.outEdges.length) {
            for (let outEdge of node.outEdges) {
                fistLevelNodes.push(nameTable[nameTable[outEdge].targetID]);
            }
        }
        return fistLevelNodes;
    }





}


