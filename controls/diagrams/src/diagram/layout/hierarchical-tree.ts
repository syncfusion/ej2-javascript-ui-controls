/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { INode, IConnector, Bounds, TreeInfo } from './layout-base';
import { Layout, ILayout, LevelBounds } from './layout-base';
import { SubTreeAlignments, Direction, DiagramAction } from '../enum/enum';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { OrthogonalSegmentModel } from '../objects/connector-model';
import { BezierSegment, OrthogonalSegment } from '../objects/connector';
import { getFunction } from '../utility/base-util';
import { Point } from '../primitives/point';
import { updateLayoutValue } from '../utility/diagram-util';

/**
 * Hierarchical Tree and Organizational Chart
 */

export class HierarchicalTree {

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

        return 'OrganizationalChart';
    }

    /**
     * @param nodes
     * @param nameTable
     * @param layoutProp
     * @param viewport
     * @param uniqueId
     * @param action
     * @private
     */
    public updateLayout(
        nodes: INode[], nameTable: Object, layoutProp: Layout, viewport: PointModel, uniqueId: string, action?: DiagramAction): ILayout {
        const layout: ILayout = {
            type: layoutProp.type,
            nameTable: nameTable, anchorX: 0, anchorY: 0,
            firstLevelNodes: [], centerNode: null, levels: [], maxLevel: 0, graphNodes: {},
            orientation: layoutProp.orientation,
            horizontalSpacing: layoutProp.horizontalSpacing, verticalSpacing: layoutProp.verticalSpacing,
            verticalAlignment: layoutProp.verticalAlignment, horizontalAlignment: layoutProp.horizontalAlignment,
            fixedNode: layoutProp.fixedNode, getLayoutInfo: getFunction(layoutProp.getLayoutInfo)
            , layoutInfo: layoutProp.layoutInfo, margin: layoutProp.margin,
            bounds: layoutProp.bounds, objects: [], root: layoutProp.root
        };
        this.doLayout(layout, nodes, viewport, uniqueId, action);
        return layout;
    }

    private doLayout(layout: ILayout, nodes: INode[], viewport: PointModel, uniqueId: string, action?: DiagramAction): void {
        let node: INode;
        let i: number;
        let layoutInfo: LayoutInfo = {};
        let shape: INode;
        const rootNodes: INode[] = [];
        if (layout.nameTable[layout.root]) {
            layout.firstLevelNodes.push(layout.nameTable[layout.root]);
        }
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (!node.excludeFromLayout) {
                layoutInfo = layout.graphNodes[node.id] = this.setUpLayoutInfo(layout, node);
                layoutInfo.tree.hasSubTree = false;
                if (!layout.nameTable[layout.root]) {
                    if (!node.inEdges || !node.inEdges.length) {
                        const parentId: string = 'parentId';
                        const processId: string = 'processId';
                        if (!node[parentId] && !node[processId]) {
                            rootNodes.push(node as INode);
                        }
                        if (node.data && String(node.data[uniqueId]) === layout.root) {
                            layout.firstLevelNodes.push(node as INode);
                        }
                    }
                }
            }
        }

        if (layout.firstLevelNodes.length === 0) { layout.firstLevelNodes = rootNodes; }
        //Update relationship(parent and children)
        for (i = 0; i < layout.firstLevelNodes.length; i++) {
            node = layout.firstLevelNodes[i];
            //let check: boolean;
            this.updateEdges(layout, node, 1, action, nodes);
        }
        if (layout.firstLevelNodes.length > 0) {
            layout.rootNode = layout.firstLevelNodes[0];

            let x: number = 0;
            let y: number = 0;
            let minX: number;
            let maxY: number;
            let maxX: number;
            let minY: number;
            //let j: number;
            let bounds: Bounds;

            for (i = 0; i < layout.firstLevelNodes.length; i++) {
                bounds = this.updateTree(layout, x, y, layout.firstLevelNodes[i], 0, layout.firstLevelNodes[i - 1]);

                const rootInfo: LayoutInfo = layout.graphNodes[layout.firstLevelNodes[i].id];
                bounds.y = Math.min(bounds.y, rootInfo.y);
                bounds.x = Math.min(bounds.x, rootInfo.x);
                if (layout.orientation.indexOf('Left') !== -1) {
                    y = bounds.right + layout.horizontalSpacing;
                } else {
                    x = bounds.right + layout.horizontalSpacing;
                }
                if (i === 0) { minX = bounds.x; minY = bounds.y; maxX = bounds.right; maxY = bounds.bottom; } else {
                    minX = Math.min(minX, bounds.x);
                    minY = Math.min(minY, bounds.y);
                    maxX = Math.max(maxX, bounds.right);
                    maxY = Math.max(maxY, bounds.bottom);
                }
            }

            this.updateAnchor(layout, { x: minX, y: minY, right: maxX, bottom: maxY }, viewport);
            for (i = 0; i < layout.firstLevelNodes.length; i++) {
                this.updateNodes(layout, layout.firstLevelNodes[i], 0);
            }

            for (i = 0; i < layout.firstLevelNodes.length; i++) {
                this.updateConnectors(layout, layout.firstLevelNodes[i], 1);
            }
        }
    }

    private getBounds(node: INode): Rect {
        const x: number = node.offsetX - node.actualSize.width * node.pivot.x;
        const y: number = node.offsetY - node.actualSize.height * node.pivot.y;
        return new Rect(x, y, node.actualSize.width, node.actualSize.height);
    }

    private updateTree(layout: ILayout, x: number, y: number, shape: INode, level?: number, prev?: INode, dontupdate?: boolean): Bounds {
        //let dimensions: Dimensions;
        let info: LayoutInfo = {};
        let lev: number;
        let obj: AsstInfo;
        //let hasChild: number;
        const dimensions: Dimensions = this.getDimensions(layout, shape, x, y, level);
        info = layout.graphNodes[shape.id];
        let firstChild: FirstChild;
        //Set maximum level of layout
        layout.maxLevel = Math.max(layout.maxLevel, level);
        lev = level;
        const hasChild: number = this.hasChild(layout, shape);
        if (!hasChild && !info.tree.assistants.length) {
            //update leaf nodes
            shape.treeBounds = this.updateLeafNode(layout, shape, prev, dimensions, level, dontupdate);
            return shape.treeBounds;
        } else {
            let treeBounds: Bounds;
            let shapeBounds: Bounds;
            let levelBounds: Bounds;
            let d: number;
            let asstBounds: Bounds;
            let space: number;
            let bottom: number;
            bottom = dimensions.y + dimensions.height + layout.verticalSpacing;
            if (info.tree.assistants.length) {
                //Vertically place assistants
                obj = this.setDepthSpaceForAssitants(layout, shape, bottom, dimensions.height, level, layout.verticalSpacing);
                lev = obj.level;
                bottom = obj.bottom;
            }
            if (!info.tree.assistants.length && info.tree.orientation !== 'Horizontal') {
                bottom = dimensions.y + dimensions.height + layout.verticalSpacing / 2;
            }
            if (info.tree.children.length) {
                if (info.tree.orientation === 'Horizontal' && (info.tree.type !== 'Balanced' || info.tree.children.length === 1)) {
                    treeBounds = this.updateHorizontalTree(layout, shape, prev, dimensions.x, bottom, lev);
                } else if (info.tree.type === 'Balanced') {
                    treeBounds = this.updateHorizontalTreeWithMultipleRows(layout, shape, prev, dimensions.x, bottom, lev);
                } else {
                    treeBounds = this.updateVerticalTree(layout, shape, dimensions.x, bottom, lev, dontupdate);
                }
            }

            if (!(info.y && info.y > dimensions.y)) {
                info.y = dimensions.y;
            }
            if (info.mid) {
                x = info.mid;
            }
            if (info.tree.assistants.length) {
                //Set breadth space for assistants
                space = x !== undefined ? x : dimensions.x;
                asstBounds = this.setBreadthSpaceForAssistants(layout, shape, dimensions, space, bottom, level);
                if (!hasChild) {
                    levelBounds = treeBounds = asstBounds;
                    x = (levelBounds.x + levelBounds.right) / 2 - dimensions.width / 2;
                    treeBounds = levelBounds;
                }
                d = asstBounds ? asstBounds.canMoveBy : undefined;
            }
            info.x = x;
            if (!info.translate) { info.treeWidth = treeBounds.right - treeBounds.x; }
            {
                shapeBounds = { x: x, y: dimensions.y, right: x + dimensions.width, bottom: dimensions.y + dimensions.height };
            }
            const translateInfo: TranslateInfo = {
                layout: layout, shape: shape, shapeBounds: shapeBounds, treeBounds: treeBounds,
                dim: dimensions, level: level
            };
            this.translateSubTree(translateInfo, d, prev !== undefined, dontupdate);
            if (info.firstChild && typeof info.firstChild !== 'string') {
                info.firstChild.x += info.subTreeTranslation;
            }
            shape.treeBounds = treeBounds;
            return treeBounds;
        }
    }

    private updateLeafNode(layout: ILayout, shape: INode, prev: INode, dimensions: Dimensions, level: number, dontupdate: boolean): Bounds {
        //let bounds: Bounds;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        info.x = dimensions.x;
        if (!(info.y && info.y > dimensions.y)) {
            info.y = dimensions.y;
            info.maxLevel = Math.max(level, info.maxLevel || 0);
        }
        // eslint-disable-next-line max-len
        const bounds: Bounds = { x: dimensions.x, y: dimensions.y, right: dimensions.x + dimensions.width, bottom: dimensions.y + dimensions.height };
        info.maxLevel = Math.max(info.maxLevel || 0, level);
        const translateInfo: TranslateInfo = {
            layout: layout, shape: shape, shapeBounds: bounds, treeBounds: bounds,
            dim: dimensions, level: level
        };
        this.translateSubTree(translateInfo, undefined, prev !== undefined, dontupdate);
        return { x: info.x, y: info.y, right: info.x + dimensions.width, bottom: info.y + dimensions.height };
    }

    private setUpLayoutInfo(layout: ILayout, item: INode): LayoutInfo {
        const info: LayoutInfo = {};
        info.subTreeTranslation = 0;
        if (layout.type === 'OrganizationalChart') {
            info.tree = { orientation: 'Vertical', type: 'Alternate', offset: 20, enableRouting: true };
        } else {
            info.tree = { orientation: 'Horizontal', type: 'Center', enableRouting: true };
        }
        info.tree.children = [];
        info.tree.assistants = [];
        info.tree.level = 0;
        info.translate = true;
        return info;
    }

    private translateSubTree(translateInfo: TranslateInfo, asstDif: number, translate: boolean, dontupdate: boolean): void {
        const layout: ILayout = translateInfo.layout;
        const shape: INode = translateInfo.shape;
        let shapeBounds: Bounds = translateInfo.shapeBounds;
        const treeBounds: Bounds = translateInfo.treeBounds;
        const level: number = translateInfo.level;
        const dim: Dimensions = translateInfo.dim;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        const firstChild: FirstChildInfo = layout.nameTable[info.firstChild ? info.firstChild.child : info.tree.children[0]];
        const firstChildInfo: LayoutInfo = firstChild ? layout.graphNodes[firstChild.id] : null;
        const hasChild: number = this.hasChild(layout, shape);
        const intersect: number[] = this.findIntersectingLevels(layout, shapeBounds, level, info.actualLevel);
        const treeIntersect: number[] = this.findIntersectingLevels(layout, treeBounds, level, info.actualLevel);
        const levelBounds: LevelBounds[] = [];
        //const diff: number;
        if (intersect.length && info.translate) {
            info.intersect = intersect;
            this.spaceLeftFromPrevSubTree(layout, shape, shapeBounds);
            info.canMoveBy = info.diff;
            if (asstDif !== undefined) {
                info.canMoveBy = Math.min(asstDif, info.canMoveBy);
            }
            if (firstChild && firstChildInfo.canMoveBy !== undefined) {
                if (firstChildInfo.canMoveBy >= info.canMoveBy) { info.translated = true; }
                info.canMoveBy = Math.min(info.canMoveBy, firstChildInfo.canMoveBy);
            }
            if (translate) {
                info.x -= info.canMoveBy;
                info.subTreeTranslation -= info.canMoveBy;
                if (hasChild) {
                    this.shiftSubordinates(layout, treeIntersect, info.canMoveBy);
                    treeBounds.x = Math.min(treeBounds.x, info.x);
                    treeBounds.right = Math.max(treeBounds.right, info.x + dim.width);
                    treeBounds.bottom = Math.max(treeBounds.bottom, info.y + dim.height);
                    treeBounds.x -= info.canMoveBy;
                    treeBounds.right -= info.canMoveBy;
                }
                if (firstChild && firstChildInfo.canMoveBy > info.canMoveBy) {
                    info.canMoveBy = firstChildInfo.canMoveBy - info.canMoveBy;
                } else if (firstChild && info.canMoveBy !== undefined) {
                    info.canMoveBy = 0;
                }
            }
        } else {
            if (hasChild) {
                treeBounds.x = Math.min(treeBounds.x, shapeBounds.x);
                treeBounds.right = Math.max(treeBounds.right, shapeBounds.x + dim.width);
                treeBounds.bottom = Math.max(treeBounds.bottom, info.y + dim.height);
            }
            if (!info.translate) {
                info.canMoveBy = 0;
                info.subTreeTranslation = 0;
            }
        }
        if (!dontupdate) {
            shapeBounds = { x: info.x, y: dim.y, right: info.x + dim.width, bottom: dim.y + dim.height };
            levelBounds.push({ rBounds: shapeBounds });
            this.updateRearBounds(layout, shape, levelBounds, level);
        }
    }
    private updateRearBounds(layout: ILayout, shape: INode, levelBounds: LevelBounds[], level: number, intersect?: number[]): void {
        let bnds: Bounds;
        let index: number;
        let isLastLeaf: boolean = true;
        let i: number;
        let info: LayoutInfo = {};
        //let firstLevel: Bounds;
        //let lastLevel: Bounds;
        let bottom: number;
        if (shape) {
            info = layout.graphNodes[shape.id];
            intersect = info.intersect;
            isLastLeaf = !info.tree.children.length && !info.tree.assistants.length;
        }
        const firstLevel: Bounds = levelBounds[0].rBounds;
        const lastLevel: Bounds = levelBounds[levelBounds.length - 1].rBounds;
        if (intersect && intersect.length) {
            bnds = layout.levels[intersect[0]].rBounds;
            bottom = bnds.bottom;
            if (bnds.y < firstLevel.y) {
                bnds.bottom = firstLevel.y;
                levelBounds.splice(0, 0, { rBounds: bnds });
            }
            if (bottom > lastLevel.bottom) {
                levelBounds.push({ rBounds: { x: bnds.x, right: bnds.right, y: firstLevel.bottom, bottom: bottom } });
            } else {
                bnds = layout.levels[intersect[intersect.length - 1]].rBounds;
                if (isLastLeaf && bnds.bottom > lastLevel.bottom) {
                    bnds.y = lastLevel.bottom;
                    levelBounds.push({ rBounds: bnds });
                }
            }
            index = intersect[0];
            for (i = levelBounds.length - 1; i >= 0; i--) {
                layout.levels.splice(index, 0, levelBounds[i]);
            }
            index += levelBounds.length;
            layout.levels.splice(index, intersect.length);
        } else {
            index = this.findLevel(layout, levelBounds[levelBounds.length - 1].rBounds, level);
            for (i = levelBounds.length - 1; i >= 0; i--) {
                layout.levels.splice(index, 0, levelBounds[i]);
            }
        }
    }

    private shiftSubordinates(layout: ILayout, intersect: number[], diff: number): void {
        let i: number;
        //Shift the sublevels by the distance diff
        if (diff !== 0) {
            for (i = 0; i < intersect.length; i++) {
                if (layout.levels[intersect[i]].rBounds) {
                    layout.levels[intersect[i]].rBounds.x -= diff;
                    layout.levels[intersect[i]].rBounds.right -= diff;
                }
            }
        }
    }

    private setDepthSpaceForAssitants(
        layout: ILayout, shape: INode, bottom: number, height: number, lev: number, vSpace: number): AsstInfo {
        const info: LayoutInfo = layout.graphNodes[shape.id];
        let asst: LayoutInfo = {};
        let asstHeight: number;
        let i: number;
        let asstElement: INode;
        let max: number;
        max = bottom;
        //Vertically place the assistants as alternate layout(alternatively at both right and left sides of parent)
        for (i = 0; i < info.tree.assistants.length; i++) {
            asst = layout.graphNodes[info.tree.assistants[i]];
            if (asst) {
                asst.tree.children = asst.tree.assistants = [];
                asst.y = bottom;
                asstElement = layout.nameTable[info.tree.assistants[i]];
                asstHeight = asstElement.actualSize.height;
                if (layout.orientation.indexOf('Left') !== -1) {
                    asstHeight = asstElement.actualSize.width;
                }
                max = bottom + asstHeight + vSpace / 2;
                layout.maxLevel = lev + 1;
                if (i % 2 === 1 && i !== info.tree.assistants.length - 1) {
                    bottom = max;
                    lev++;
                }
            }
        }
        return { level: layout.maxLevel, bottom: bottom + asstHeight + vSpace };
    }

    private setBreadthSpaceForAssistants(
        layout: ILayout, shape: INode, dim: Dimensions, space: number, bottom: number, level: number): Bounds {
        let asst: LayoutInfo = {};
        let asstWidth: number;
        //let prevBounds: number;
        let bounds: Bounds;
        let asstElement: INode;
        let i: number;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        //let max: number = bottom;
        let lev: number = level;
        let left: number;
        let diff: number;
        let intersect: number[];
        let levelBounds: Bounds = { x: 0, y: 0, right: 0, bottom: 0 };
        for (i = 0; i < info.tree.assistants.length; i++) {
            asst = layout.graphNodes[info.tree.assistants[i]];
            //Arrange assistants at both left and right sides of parent(like alternate layout)
            //Check - By default, distance to be left between parent and child nodes is assumed as 20.
            //It can be modified/customized later.
            if (asst) {
                asstElement = layout.nameTable[info.tree.assistants[i]];
                asstWidth = asstElement.actualSize.width;
                if (layout.orientation.indexOf('Left') !== -1) {
                    asstWidth = asstElement.actualSize.height;
                }
                if (i % 2 === 0) {
                    left = space + dim.width / 2 - 20 - asstWidth;
                } else {
                    left = space + dim.width / 2 + 20;
                }

                //Check - What will happen if update leaf node is called? Since assistants don't have children
                bounds = this.updateTree(layout, left, asst.y, layout.nameTable[info.tree.assistants[i]], lev + 1);
                if (!this.hasChild(layout, shape)) {
                    if (i === 0) {
                        levelBounds = bounds;
                    } else {
                        this.uniteRects(levelBounds, bounds);
                    }
                }
                if (i % 2 === 0 && asst.prevBounds) {
                    if (diff === undefined) { diff = asst.canMoveBy; } else { diff = Math.min(diff, asst.canMoveBy); }
                }
                if (i % 2 === 1 || i === info.tree.assistants.length - 1) {
                    intersect = this.findIntersectingLevels(layout, bounds, lev + 1);
                    //Update rightmost positions of known layout levels
                    this.updateRearBounds(layout, null, [{ rBounds: bounds }], lev + 1, intersect);
                    lev++;
                }
            }
        }
        if (levelBounds) {
            levelBounds.canMoveBy = diff;
        }
        return levelBounds;
    }

    private getDimensions(layout: ILayout, shape: INode, x: number, y: number, level: number): Dimensions {
        let width: number;
        width = shape.actualSize.width;
        let height: number;
        height = shape.actualSize.height;
        if (layout.orientation.indexOf('Left') !== -1) {
            if (!level) {
                //let temp: number;
                const temp: number = x;
                x = y;
                y = temp;
            }
            height = shape.actualSize.width;
            width = shape.actualSize.height;
        }
        return { x: x, y: y, width: width, height: height };
    }

    private hasChild(layout: ILayout, shape: INode): number {
        //Check whether the node has children
        const shape1: LayoutInfo = layout.graphNodes[shape.id];
        return shape1 ? shape1.tree.children && shape1.tree.children.length : 0;
    }

    private updateHorizontalTree(layout: ILayout, shape: INode, prev: INode, x: number, y: number, level: number): Bounds {
        //Get dimensions with respect to layout orientations
        //let dimensions: Dimensions;
        const dimensions: Dimensions = this.getDimensions(layout, shape, x, y, level);
        let info: LayoutInfo = {};
        info = layout.graphNodes[shape.id];
        const side: SubTreeAlignments = info.tree.type;
        //let lev: number;
        const lev: number = level;
        let right: number = 0;
        right = x;
        const bottom: number = y;
        let width: number; let height: number;
        let child: INode;
        let childBounds: Bounds; let childWidth: number; let childHeight: number;
        //let prevBounds: Bounds;
        let bounds: Bounds;
        let actBounds: Bounds;
        let maxLevel: number; let translateSibilingsBy: number; let canMoveBy: number; let oldActBounds: Bounds;
        let i: number; let childInfo: LayoutInfo;  let firstChildInfo: LayoutInfo;
        const prevLayoutLevels: LevelBounds[] = layout.levels.slice(0, layout.levels.length);
        if (this.hasChild(layout, shape)) {
            //let h: boolean;
            const h: boolean = layout.orientation.indexOf('Left') !== -1 ? true : false;
            for (i = 0; i < info.tree.children.length; i++) {
                child = layout.nameTable[info.tree.children[i]];
                width = child.actualSize.width;
                height = child.actualSize.height;
                childWidth = h ? height : width;
                childHeight = h ? width : height;
                const prevBounds: Bounds = layout.levels[lev + 1] ? layout.levels[lev + 1].rBounds : null;
                //Update sub tree
                childBounds = this.updateTree(layout, right, bottom, child, lev + 1, layout.nameTable[info.tree.children[i - 1]]);
                childInfo = layout.graphNodes[child.id];
                info.maxLevel = Math.max(info.maxLevel || 0, childInfo.maxLevel || 0);
                actBounds = { x: childInfo.x, y: childInfo.y, right: childInfo.x + childWidth, bottom: childInfo.y + childHeight };
                if (i === 0) {
                    //Compare with previous(right most) subtree
                    bounds = {
                        x: Math.min(childInfo.x, childBounds.x), y: Math.min(childInfo.y, childBounds.y),
                        right: childBounds.right, bottom: childBounds.bottom
                    };
                    firstChildInfo = childInfo;
                }
                if (!oldActBounds) {
                    oldActBounds = actBounds;
                } else {
                    oldActBounds.x = actBounds.x;
                    oldActBounds.y = actBounds.y;
                    if (actBounds.right > oldActBounds.right) {
                        oldActBounds.right = actBounds.right;
                    }
                    oldActBounds.bottom = actBounds.bottom;
                    //oldActBounds = actBounds;
                }
                //Compare with previous subtree if level of the child is greater than the level of previous sub tree
                //Check - what will happen if level of second child is greater than current child

                if (i === 0) {
                    info.firstChild = { x: childInfo.x, canMoveBy: childInfo.canMoveBy, child: child.id };
                }
                if (this.hasChild(layout, child)) {
                    if (!info.firstChild || info.firstChild.x >= childInfo.firstChild.x) {
                        if (childInfo.firstChild && info.firstChild.canMoveBy < childInfo.canMoveBy) {
                            canMoveBy = info.firstChild.canMoveBy;
                            childInfo.canMoveBy = canMoveBy;
                            layout.graphNodes[info.firstChild.child].canMoveBy = canMoveBy;
                            info.firstChild.canMoveBy = canMoveBy;
                        }
                        const canMoveValue: number = canMoveBy !== undefined ? canMoveBy : childInfo.canMoveBy;
                        info.firstChild = { x: childInfo.firstChild.x, canMoveBy: canMoveValue, child: child.id };
                    } else if (childInfo.firstChild && childInfo.translated && info.firstChild.canMoveBy > childInfo.canMoveBy) {
                        info.firstChild.canMoveBy = layout.graphNodes[info.firstChild.child].canMoveBy = childInfo.canMoveBy;
                    }
                }
                maxLevel = maxLevel ? Math.max(childInfo.maxLevel, maxLevel) : childInfo.maxLevel;
                this.uniteRects(bounds, childBounds);
                if (i !== 0 && !this.hasChild(layout, child) && childInfo.subTreeTranslation < 0) {
                    right = childBounds.right - childInfo.subTreeTranslation + layout.horizontalSpacing;
                } else {
                    right = childBounds.right + layout.horizontalSpacing;
                }
            }
            if (!isNaN(translateSibilingsBy)) { firstChildInfo.canMoveBy = translateSibilingsBy; }
            info.mid = (firstChildInfo.x + oldActBounds.right) / 2 - dimensions.width / 2;
            //Set parent based on the chart type
            if (side === 'Left') {
                info.mid = actBounds.right - dimensions.width;
            } else if (side === 'Right') {
                info.mid = x;
            }
        }
        return bounds;
    }
/* eslint-disable */
    private updateHorizontalTreeWithMultipleRows(layout: ILayout, shape: INode, prev: INode, x: number, y: number, level: number): Bounds {
        //declarations
        let child: INode; let childInfo: LayoutInfo; let childBounds: Bounds;
        let childWidth: number; let childHeight: number; let firstChildInfo: LayoutInfo;
        let maxLevel: number; let bounds: Bounds; let rowBounds: Bounds; let width: number; let height: number;
        let diff: number; let translateSibilingsBy: number;
        let fchild: INode; let maxRowWidth: number;
        let j: number; let i: number; let k: number; let max: number; let leftCenter: number; let rightCenter: number;
        //Get dimensions with respect to layout orientations
        let dimensions: Dimensions = this.getDimensions(layout, shape, x, y, level);
        let info: LayoutInfo = layout.graphNodes[shape.id]; let side: string = info.tree.type; let lev: number = level;
        let right: number = x; let bottom: number = y; let prevLayoutLevels: LevelBounds[] = layout.levels.slice(0, layout.levels.length);
        let minTranslation: number = 0;
        if (this.hasChild(layout, shape)) {
            let h: boolean = layout.orientation.indexOf('Left') !== -1 ? true : false;
            let align: boolean;
            let rows: string[][] = this.splitChildrenInRows(layout, shape);
            let unique: boolean = info.tree.children.length === 5 && rows[0].length === 3;
            let leftTree: string[][] = []; let rightTree: string[][] = [];

            if (!unique) {
                this.splitRows(rows, leftTree, rightTree);
            } else { rightTree = rows; }

            let treeInfo: MultipleRowInfo = { leftTree: leftTree, rows: rows, rightTree: rightTree, dimensions: dimensions };

            let rightMost: number = this.updateLeftTree(layout, treeInfo, shape, x, bottom, lev);
            bounds = treeInfo.bounds;
            let rightX: number;
            let center: number = (rightMost || 0) + (rightMost !== undefined ? (layout.horizontalSpacing / 2) : 0);

            if (rightMost !== undefined) {
                info.mid = center - dimensions.width / 2;
                rightX = rightMost + layout.horizontalSpacing;
            }

            bottom = y;
            let rightBounds: Bounds[];
            rightBounds = [];
            for (i = 0; i < rightTree.length; i++) {
                if (rows[i].length % 2 === 1 && i === rightTree.length - 1 || unique) { right = x; } else {
                    right = rightX || x;
                }
                if (i !== 0) { bottom = rightBounds[i - 1].bottom + layout.verticalSpacing; }
                for (j = 0; j < rightTree[i].length; j++) {
                    child = layout.nameTable[rightTree[i][j]];
                    width = child.actualSize.width;
                    height = child.actualSize.height;
                    childWidth = h ? height : width;
                    childHeight = h ? width : height;
                    //Update sub tree
                    childInfo = layout.graphNodes[child.id];
                    childInfo.actualLevel = lev + 1 + i;
                    if (j === 0 && leftTree[i] && leftTree[i].length) { childInfo.translate = false; }
                    if (unique && i === 1) {
                        if (j === 0 && leftCenter + childWidth + layout.horizontalSpacing <= rightCenter) {
                            align = true;
                            right = leftCenter - childWidth / 2;
                        }
                        if (align && j === 1) { right = rightCenter - childWidth / 2; }
                    }

                    childBounds = this.updateTree(layout, right, bottom, child, lev + 1, layout.nameTable[rightTree[i][j - 1]]);
                    if (unique && j <= 2 && i === 0) {
                        if (j === 1) {
                            leftCenter = childBounds.x - layout.horizontalSpacing / 2;
                            rightCenter = childBounds.x + childWidth + layout.horizontalSpacing / 2;
                        }
                    }
                    if (j === 0) {
                        rightBounds[i] = { x: childBounds.x, y: childBounds.y, right: childBounds.right, bottom: childBounds.bottom };
                    } else {
                        this.uniteRects(rightBounds[i], childBounds);
                    }
                    if (!bounds) {
                        bounds = {
                            x: rightBounds[i].x, y: rightBounds[i].y, right: rightBounds[i].right,
                            bottom: rightBounds[i].bottom
                        };
                    }
                    this.uniteRects(bounds, rightBounds[i]);
                    right = childBounds.right + layout.horizontalSpacing;
                    if (!info.firstChild || ((i === rightTree.length - 1 && rows[i].length % 2 === 1) || unique)
                        && j === 0 && childInfo.canMoveBy !== undefined && minTranslation > childInfo.canMoveBy) {
                        minTranslation = Math.min(minTranslation, childInfo.canMoveBy || 0);
                        info.firstChild = { x: childInfo.x, child: child.id, canMoveBy: childInfo.canMoveBy };
                    }
                    treeInfo.leftCenter = leftCenter; treeInfo.rightCenter = rightCenter; treeInfo.align = align;
                    treeInfo.level = lev; treeInfo.rightBounds = rightBounds;
                    this.alignRowsToCenter(layout, i, shape, treeInfo, rightX);
                }
            }
        }
        return bounds;
    }
    /* eslint-enable */

    private updateLeftTree(layout: ILayout, treeInfo: MultipleRowInfo, shape: INode, x: number, bottom: number, lev: number): number {
        const leftTree: string[][] = treeInfo.leftTree;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        let right: number;
        const leftBounds: Bounds[] = [];
        let minTranslation: number;
        let rightMost: number;
        let childBounds: Bounds;
        let bounds: Bounds;
        const h: boolean = layout.orientation.indexOf('Left') !== -1 ? true : false;
        //Arrange left side
        for (let i: number = 0; i < leftTree.length && leftTree[i].length; i++) {
            right = x;
            if (leftBounds[i - 1]) { bottom = leftBounds[i - 1].bottom + layout.verticalSpacing; }
            for (let j: number = 0; j < leftTree[i].length; j++) {
                const child: INode = layout.nameTable[leftTree[i][j]];
                const childWidth: number = h ? child.actualSize.height : child.actualSize.width;
                const childHeight: number = h ? child.actualSize.width : child.actualSize.height;
                //Update sub tree
                const childInfo: LayoutInfo = layout.graphNodes[child.id];
                childInfo.actualLevel = lev + 1 + i;
                childBounds = this.updateTree(layout, right, bottom, child, lev + 1, layout.nameTable[leftTree[i][j - 1]]);
                if (j === 0) {
                    leftBounds[i] = { x: childBounds.x, y: childBounds.y, right: childBounds.right, bottom: childBounds.bottom };
                } else {
                    this.uniteRects(leftBounds[i], childBounds);
                }
                if (i === 0 && j === 0) {
                    minTranslation = childInfo.canMoveBy;
                    info.firstChild = { x: childInfo.x, child: child.id, canMoveBy: childInfo.canMoveBy };
                } else if (j === 0 && childInfo.canMoveBy !== undefined && minTranslation > childInfo.canMoveBy) {
                    minTranslation = Math.min(minTranslation, childInfo.canMoveBy || 0);
                    info.firstChild = { x: childInfo.x, child: child.id, canMoveBy: childInfo.canMoveBy };
                }
                right = childBounds.right + layout.horizontalSpacing;
            }
            if (i === 0) {
                rightMost = leftBounds[i].right;
            } else {
                rightMost = Math.max(rightMost, leftBounds[i].right);
            }
        }

        //Translate to same positions
        for (let i: number = 0; i < leftTree.length && leftTree[i].length; i++) {
            if (rightMost !== leftBounds[i].right) {
                const diff: number = rightMost - leftBounds[i].right;
                for (let j: number = 0; j < leftTree[i].length; j++) {
                    const element: INode = layout.nameTable[leftTree[i][j]];
                    const elementInfo: LayoutInfo = layout.graphNodes[leftTree[i][j]];
                    elementInfo.x += diff;
                }
                //leftBounds[i].x += diff;
                //leftBounds[i].right += diff;
            }
            if (i === 0) {
                bounds = { x: leftBounds[0].x, y: leftBounds[0].y, right: leftBounds[0].right, bottom: leftBounds[0].bottom };
            } else { this.uniteRects(bounds, leftBounds[i]); }
        }
        treeInfo.bounds = bounds;
        return rightMost;
    }

    private alignRowsToCenter(layout: ILayout, i: number, shape: INode, treeInfo: MultipleRowInfo, rightX: number): void {
        let max: number;
        let centered: string;
        let diff: number;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        const rows: string[][] = treeInfo.rows;
        const rightTree: string[][] = treeInfo.rightTree;
        const leftCenter: number = treeInfo.leftCenter;
        const rightCenter: number = treeInfo.rightCenter;
        let align: boolean = treeInfo.align;
        const rightBounds: Bounds[] = treeInfo.rightBounds;
        const dimensions: Dimensions = treeInfo.dimensions;
        const lev: number = treeInfo.level;
        const unique: boolean = info.tree.children.length === 5 && rows[0].length === 3;
        if (unique && i === 1) {
            max = (rightBounds[0].right - rightBounds[0].x) >= (rightBounds[1].right - rightBounds[1].x) ? 0 : 1;
        }
        if (i === rows.length - 1) {
            if (rows[i].length % 2 === 1 || unique && i === 1) {
                centered = rightTree[i][Math.floor(rightTree[i].length / 2)];
                //let centerObjct: INode;
                const centerObjct: INode = layout.nameTable[centered];
                //let childDimension: Dimensions;
                const centeredX: number = layout.graphNodes[centered].x;
                const centeredY: number = layout.graphNodes[centered].y;
                const childDimension: Dimensions = this.getDimensions(layout, centerObjct, centeredX, centeredY, lev + 1);
                diff = undefined;
                if (!align && unique) {
                    if (max === 1) { i = 0; }
                    diff = (rightBounds[max].x + rightBounds[max].right) / 2 - (rightBounds[i].x + rightBounds[i].right) / 2;
                    if (i === 0) { info.mid += diff; }
                } else if (!unique && rightX !== undefined) {
                    diff = rightX - layout.horizontalSpacing / 2 - (centeredX + childDimension.width / 2);
                }
                if (diff !== undefined) {
                    this.updateRearBoundsOfTree(layout, rightTree[i], diff, dimensions);
                }

                if (unique) {
                    info.mid = (rightCenter + leftCenter) / 2 + (i === 0 ? diff : 0) - dimensions.width / 2;
                }
                if (info.mid === undefined && layout.graphNodes[centered]) { info.mid = centeredX; }
                align = false;
                i++;
            }
        }
    }

    private updateRearBoundsOfTree(layout: ILayout, rightTree: string[], diff: number, dimensions: Dimensions): void {
        for (let j: number = 0; j < rightTree.length; j++) {
            const childInfo: LayoutInfo = layout.graphNodes[rightTree[j]];
            //let child: INode = layout.nameTable[rightTree[j]];
            childInfo.x += diff;
            childInfo.canMoveBy += diff;
            if (j === rightTree.length - 1) {
                //removed child dimensions call calculation, since that is not used
                const childBnds: Bounds = {
                    x: childInfo.x, y: childInfo.y, right: childInfo.x +
                        dimensions.width, bottom: childInfo.y + dimensions.height
                };
                const intersect: number[] = this.findIntersectingLevels(layout, childBnds, childInfo.actualLevel);
                this.updateRearBounds(layout, null, [{ rBounds: childBnds }], childInfo.actualLevel, intersect);
            }
        }
    }

    private splitRows(rows: string[][], leftTree: string[][], rightTree: string[][]): void {
        for (let i: number = 0; i < rows.length; i++) {
            leftTree[i] = []; rightTree[i] = [];
            let half: number;
            half = rows[i].length;
            if (rows[i].length % 2 !== 1) {
                half = Math.ceil(rows[i].length / 2);
                for (let k: number = 0; k < half; k++) {
                    leftTree[i].push(rows[i][k]);
                }
            }
            for (let j: number = leftTree[i].length; j < rows[i].length; j++) {
                rightTree[i].push(rows[i][j]);
            }
        }
    }


    private updateVerticalTree(layout: ILayout, shape: INode, x: number, y: number, level: number, dontUpdate: boolean): Bounds {
        //declarations
        let child: INode; let childInfo: LayoutInfo; let childBounds: Bounds; let childWidth: number; let childHeight: number;
        let prevBounds: Bounds; let bounds: Bounds; let actBounds: Bounds; let oddBounds: Bounds; let evenBounds: Bounds;

        //let dimensions: Dimensions = this.getDimensions(layout, shape, x, y, level);
        const info: LayoutInfo = layout.graphNodes[shape.id];
        const firstChild: INode = layout.nameTable[info.tree.children[0]];
        const h: boolean = layout.orientation.indexOf('Left') !== -1 ? true : false;
        let factor: number = info.tree.type === 'Left' ? -1 : 0;
        let right: number = x; let bottom: number = y;
        const lev: number = level; let i: number; let intersect: number[];
        let type: SubTreeAlignments; let levels: LevelBounds[] = [];
        let oddLevels: LevelBounds[] = []; let canMoveBy: number; //let diff: number;
        for (i = 0; i < info.tree.children.length; i++) {
            if (info.tree.type === 'Alternate') {
                //arrange at both left and right
                type = (i % 2 === 0 && info.tree.children.length > 2) ? 'Left' : 'Right';
                factor = (i % 2 === 0 && info.tree.children.length > 2) ? -1 : 0;
            }
            right = x + this.findOffset(layout, shape, info, type);
            child = layout.nameTable[info.tree.children[i]];
            childWidth = h ? child.actualSize.height : child.actualSize.width;
            childHeight = h ? child.actualSize.width : child.actualSize.height;
            //Update sub tree
            childBounds = this.updateTree(layout, right + factor * childWidth, bottom, child, level + 1, undefined, true);
            childInfo = layout.graphNodes[child.id];
            actBounds = { x: childInfo.x, y: childInfo.y, right: childInfo.x + childWidth, bottom: childInfo.y + childHeight };
            if (i === 0) {
                this.uniteRects(childBounds, actBounds);
                bounds = childBounds;
            } else {
                this.uniteRects(bounds, childBounds);
            }
            //Check and adjust the space left from previous subtree/sibling
            if (childInfo.prevBounds && !(info.tree.type === 'Alternate' && i % 2 === 1 && info.tree.children.length > 2)) {
                canMoveBy = canMoveBy !== undefined ? Math.min(childInfo.canMoveBy, canMoveBy) : childInfo.canMoveBy;
            }
            //Max level of the subtree node
            info.maxLevel = Math.max(info.maxLevel || 0, childInfo.maxLevel || 0);
            if (!(info.tree.type === 'Alternate' && info.tree.children.length > 2 && i % 2 === 0)) {
                if (info.tree.type === 'Alternate' && info.tree.children.length > 2) {
                    //alternate - arrange children with even index(0,2,4,6,..) at the next level
                    bottom = Math.max(childBounds.bottom, prevBounds.bottom) + layout.verticalSpacing / 2;
                } else {
                    // left/right - arrange next child at the nect level(bottom)
                    bottom = childBounds.bottom + layout.verticalSpacing / 2;
                }
                level = info.maxLevel;
                levels.push({ rBounds: actBounds });
                if (!evenBounds) {
                    evenBounds = {
                        x: childInfo.x, y: childInfo.y, right: childInfo.x + childWidth,
                        bottom: childInfo.y + childHeight
                    };
                } else { this.uniteRects(evenBounds, actBounds); }
                if (childInfo.levelBounds) { levels = levels.concat(childInfo.levelBounds); }
            } else {
                if (i !== 0) { bottom = prevBounds.bottom + layout.verticalSpacing / 2; }
                oddLevels.push({ rBounds: actBounds });
                if (childInfo.levelBounds) { oddLevels = oddLevels.concat(childInfo.levelBounds); }
            }
            if (i === 0) { info.firstChild = { x: childInfo.x, canMoveBy: childInfo.canMoveBy, child: child.id }; }
            if (this.hasChild(layout, child)) {
                if (!info.firstChild || info.firstChild.x >= childInfo.firstChild.x) {
                    if (childInfo.firstChild && info.firstChild.canMoveBy < childInfo.canMoveBy) {
                        const canMoveBy: number = info.firstChild.canMoveBy;
                        childInfo.canMoveBy = canMoveBy;
                        layout.graphNodes[info.firstChild.child].canMoveBy = canMoveBy;
                        info.firstChild.canMoveBy = canMoveBy;
                    }
                    info.firstChild = {
                        x: childInfo.firstChild.x, canMoveBy: canMoveBy !== undefined ? canMoveBy : childInfo.canMoveBy,
                        child: child.id
                    };
                } else if (childInfo.firstChild && childInfo.translated && info.firstChild.canMoveBy > childInfo.canMoveBy) {
                    info.firstChild.canMoveBy = layout.graphNodes[info.firstChild.child].canMoveBy = childInfo.canMoveBy;
                }
            }
            prevBounds = actBounds;
        }
        //To set level bounds(right most position of levels)
        if (!dontUpdate) {
            if (info.tree.type === 'Alternate' && info.tree.children.length > 2) {
                oddBounds = {
                    x: oddLevels[0].rBounds.x, y: oddLevels[0].rBounds.y,
                    right: oddLevels[oddLevels.length - 1].rBounds.right, bottom: oddLevels[oddLevels.length - 1].rBounds.bottom
                };
                intersect = this.findIntersectingLevels(layout, oddBounds, lev + 1);
                this.updateRearBounds(layout, null, oddLevels, lev + 1, intersect);
            }
            intersect = this.findIntersectingLevels(layout, evenBounds || bounds, lev + 1);
            this.updateRearBounds(layout, null, evenBounds ? levels : [{ rBounds: bounds }], lev + 1, intersect);
        } else { info.levelBounds = levels; }
        if (!isNaN(canMoveBy)) {
            layout.graphNodes[firstChild.id].canMoveBy = canMoveBy;
        }
        info.childBounds = bounds;
        info.mid = x;
        return bounds;
    }

    private splitChildrenInRows(layout: ILayout, shape: INode): string[][] {
        //let info: LayoutInfo;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        let column: number;
        column = 4;
        const rows: string[][] = [];
        let childNodes: number;
        childNodes = info.tree.children.length;
        const children: string[] = this.extend(info.tree.children);
        if (info.tree.rows) {
            //let count: number;
            const count: number = info.tree.children.length;
            //let columns: number;
            const columns: number = info.tree.rows;
            if (columns % 2 === 0) {
                column = columns;
            } else {
                column = columns - 1;
            }
        } else if (info.tree.children.length === 3 || info.tree.children.length === 4) {
            column = 2;
        } else if (info.tree.children.length === 5) {
            column = 3;
        }
        while (childNodes > 0) {
            rows[rows.length] = children.splice(0, column);
            childNodes -= column;
            if (childNodes < column) {
                if (childNodes % 2 === 0) {
                    column = childNodes;
                } else if (childNodes !== 1) {
                    column = childNodes - 1;
                }
                if (childNodes < column) {
                    column = childNodes;
                }
            }
        }
        return rows;
    }

    private extend(temp: string[]): string[] {
        let i: number;
        const dummy: string[] = [];
        for (i = 0; i < temp.length; i++) {
            dummy[i] = temp[i];
        }
        return dummy;
    }

    private findOffset(layout: ILayout, shape: INode, info: LayoutInfo, type: SubTreeAlignments): number {
        let offset: number = 0;
        const space: number = (layout.orientation.indexOf('Left') !== -1) ? shape.actualSize.height :
            shape.actualSize.width;
        const treeType: SubTreeAlignments = type ? type : info.tree.type;
        offset = info.tree.offset || 20;
        if (info.tree.type === 'Alternate') {
            if (offset >= layout.horizontalSpacing) { offset = layout.horizontalSpacing / 2; }
        }
        switch (treeType) {
        case 'Left':
            offset = space / 2 - offset;
            break;
        case 'Right':
            offset = offset + space / 2;
            break;
        }
        return offset;
    }

    private uniteRects(rect1: Bounds, rect2: Bounds): void {
        //Unite two rects
        rect1.x = Math.min(rect1.x, rect2.x);
        rect1.right = Math.max(rect1.right, rect2.right);
        rect1.bottom = Math.max(rect1.bottom, rect2.bottom);
    }

    private spaceLeftFromPrevSubTree(layout: ILayout, shape: INode, bounds: Bounds): void {
        //let info: LayoutInfo;
        const info: LayoutInfo = layout.graphNodes[shape.id];
        let dif: number; let prevBounds: Bounds; //let intersect: number[]; let k: number;
        //let space: number;
        const space: number = layout.horizontalSpacing;
        //Find the minimum distance to move towards previous sub tree
        for (let k: number = 0; k < info.intersect.length; k++) {
            prevBounds = layout.levels[info.intersect[k]].rBounds;
            dif = bounds.x - (prevBounds.right + space);
            if (info.diff === undefined || dif < info.diff) {
                info.diff = dif;
                info.prevBounds = layout.levels[info.intersect[k]].rBounds;
            }
        }
    }

    private findIntersectingLevels(layout: ILayout, bounds: Bounds, level: number, actualLevel?: number): number[] {
        //intersecting with exact Level
        //let bnds: Bounds;
        const bnds: Bounds = { x: bounds.x, y: bounds.y, right: bounds.right, bottom: bounds.bottom };
        bnds.y -= layout.verticalSpacing / 2;
        bnds.bottom += layout.verticalSpacing / 2;
        //let intersectingLevels: number[];
        const intersectingLevels: number[] = [];
        let rBounds: Bounds;
        let l: number;
        l = actualLevel !== undefined ? actualLevel : level;
        rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
        //Performance - We can consider only the intersecting levels
        do {
            if (rBounds && ((bnds.y < rBounds.y && bnds.bottom > rBounds.y)
                || (bnds.y < rBounds.bottom && rBounds.bottom < bnds.bottom) ||
                bnds.y >= rBounds.y &&
                bnds.bottom <= rBounds.bottom || bnds.y < rBounds.y && bnds.bottom > rBounds.bottom)) {
                const index: number = 0;
                intersectingLevels.splice(index, 0, l);
            } else if (rBounds && rBounds.bottom < bnds.y) {
                break;
            }
            l--;
            rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
        } while (l >= 0);

        l = (actualLevel !== undefined ? actualLevel : level) + 1;
        rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
        do {
            if (rBounds && ((bnds.y < rBounds.y && bnds.bottom > rBounds.y) ||
                (bnds.y < rBounds.bottom && rBounds.bottom < bnds.bottom) ||
                bnds.y >= rBounds.y && bnds.bottom <= rBounds.bottom || bnds.y < rBounds.y && bnds.bottom > rBounds.bottom)) {
                intersectingLevels.push(l);
            } else if (rBounds && rBounds.y > bnds.bottom) { break; }
            l++;
            rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
        } while (l <= layout.levels.length);

        return intersectingLevels;
    }

    private findLevel(layout: ILayout, bounds: Bounds, level: number): number {
        //let bnds: Bounds;
        const bnds: Bounds = bounds;
        let l: number; l = 0;
        let rBounds: Bounds;
        rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
        while (l < layout.levels.length) {
            if (rBounds && bnds.bottom < rBounds.y) {
                return l;
            } else {
                l++;
            }
            rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
        }
        return l;
    }

    private getParentNode(layout: ILayout, node: INode): INode {
        //Return the first parent node
        return layout.nameTable[layout.nameTable[node.inEdges[0]].sourceID];
    }
    private updateEdges(layout: ILayout, node: INode, depth: number, action?: DiagramAction, nodes?: INode[]): void {
        //let layoutInfo: LayoutInfo;
        const layoutInfo: LayoutInfo = layout.graphNodes[node.id];
        let j: number;
        if (node.outEdges && node.outEdges.length && (node.isExpanded || (action === DiagramAction.Render))) {
            for (j = 0; j < node.outEdges.length; j++) {
                //let edge: INode;
                const edge: INode = layout.nameTable[layout.nameTable[node.outEdges[j]].targetID];
                if (edge && !edge.excludeFromLayout) {
                    if (layoutInfo.tree.children.indexOf(edge.id) === -1) {
                        layoutInfo.tree.children.push(edge.id);
                    }
                    if (edge.outEdges && edge.outEdges.length && edge.isExpanded) {
                        layoutInfo.tree.hasSubTree = true;
                    }
                    this.updateEdges(layout, edge, depth + 1, action, nodes);
                }
            }
        }
        //set level info
        layoutInfo.tree.level = depth;
        //By default, orientation is horizontal for nested trees
        if (layoutInfo.tree.hasSubTree) {
            layoutInfo.tree.orientation = 'Horizontal';
            layoutInfo.tree.type = 'Center';
        }
        //Customizing assistants and children collection
        //Performance-Instead of reading the method everytime, we can set once and can reuse that
        if ((layout.getLayoutInfo || layout.layoutInfo) && layout.type === 'OrganizationalChart') {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            layout.getLayoutInfo ?
                layout.getLayoutInfo(node, layoutInfo.tree) : updateLayoutValue(layoutInfo.tree, layout.layoutInfo, nodes, node);
            if (layoutInfo.tree.type === 'Balanced' && layoutInfo.tree.hasSubTree) {
                layoutInfo.tree.type = 'Center'; layoutInfo.tree.orientation = 'Horizontal';
            }
        }
        if (layout.level && layoutInfo.tree.type !== 'Alternate' && depth >= layout.level) {
            layoutInfo.tree.hasSubTree = false;
        }
    }
/* eslint-disable */
    private updateAnchor(layout: ILayout, bounds: Bounds, viewPort: PointModel): void {
        let node: INode; let fixedNode: INode;
        let width: number = 0; let height: number = 0; let mod: number = 0;
        let yValue: number = 0;
        const viewPortBounds: Rect = new Rect(0, 0, viewPort.x, viewPort.y); //let layoutBounds: Rect;
        const layoutBounds:Rect = layout.bounds ? layout.bounds : viewPortBounds;
        const orientation: string = layout.orientation;
        //Anchor based on fixed nodes
        if (layout.fixedNode) {
            fixedNode = layout.nameTable[layout.fixedNode];
            width = fixedNode.actualSize.width;
            height = fixedNode.actualSize.height;
            layout.anchorX = fixedNode.offsetX;
            layout.anchorY = fixedNode.offsetY;
            const pivot: PointModel = fixedNode.pivot;
            layout.anchorX += layout.orientation === 'RightToLeft' ? width * pivot.x : -width * pivot.x;
            layout.anchorY += layout.orientation === 'BottomToTop' ? height * pivot.y : -height * pivot.y;
            node = fixedNode;
            mod = 0;
            while (node.inEdges.length) {
                node = this.getParentNode(layout, node);
                mod += layout.graphNodes[node.id].subTreeTranslation || 0;
            }
            if (layout.orientation.indexOf('Left') !== -1) {
                yValue = layout.graphNodes[fixedNode.id].y;
                // eslint-disable-next-line
                orientation === 'LeftToRight' ? layout.anchorX -= yValue : layout.anchorX += yValue;
                layout.anchorY -= layout.graphNodes[fixedNode.id].x + mod;
            } else {
                yValue = layout.graphNodes[fixedNode.id].y;
                // eslint-disable-next-line
                layout.anchorX -= layout.graphNodes[fixedNode.id].x + mod;
                orientation === 'TopToBottom' ? layout.anchorY -= yValue : layout.anchorY += yValue;
            }
        } else {
            if (orientation === 'TopToBottom' || orientation === 'BottomToTop') {
            switch (layout.horizontalAlignment) {
                case 'Left':
                    layout.anchorX = (layoutBounds.x - bounds.x) + layout.margin.left;
                    break;
                case 'Right':
                    layout.anchorX = layoutBounds.x + layoutBounds.width - layout.margin.right - bounds.right;
                    break;
                case 'Auto':
                case 'Center':
                    layout.anchorX = layoutBounds.x + layoutBounds.width / 2 - (bounds.x + bounds.right) / 2;
                    break;
                }
            switch (layout.verticalAlignment) {
                case 'Auto':
                case 'Top':
                    let top: number;
                    top = layoutBounds.y + layout.margin.top;
                    layout.anchorY = orientation === 'TopToBottom' ? top : bounds.bottom + top;
                    break;
                case 'Bottom':
                    let bottom: number;
                    bottom = layoutBounds.y + layoutBounds.height - layout.margin.bottom;
                    layout.anchorY = orientation === 'TopToBottom' ? bottom - bounds.bottom : bottom;
                    break;
                case 'Center':
                    let center: number;
                    center = layoutBounds.y + layoutBounds.height / 2;
                    layout.anchorY = layout.orientation === 'TopToBottom' ?
                        center - (bounds.y + bounds.bottom) / 2 : center + (bounds.y + bounds.bottom) / 2;
                    break;
                }
            } else {
            switch (layout.horizontalAlignment) {
                case 'Auto':
                case 'Left':
                    let left: number;
                    left = layoutBounds.x + layout.margin.left;
                    layout.anchorX = orientation === 'LeftToRight' ? left : bounds.bottom + left;
                    break;
                case 'Right':
                    let right: number;
                    right = layoutBounds.x + layoutBounds.width - layout.margin.right;
                    layout.anchorX = orientation === 'LeftToRight' ? right - bounds.bottom : right;
                    break;
                case 'Center':
                    let center: number;
                    center = layoutBounds.width / 2 + layoutBounds.x;
                    layout.anchorX = layout.orientation === 'LeftToRight' ?
                            center - (bounds.y + bounds.bottom) / 2 : center + (bounds.y + bounds.bottom) / 2;
                        break;
                }
                switch (layout.verticalAlignment) {
                    case 'Top':
                        layout.anchorY = layoutBounds.y + layout.margin.top - bounds.x;
                        break;
                    case 'Auto':
                    case 'Center':
                        layout.anchorY = layoutBounds.y + layoutBounds.height / 2 - (bounds.right + bounds.x) / 2;
                        break;
                    case 'Bottom':
                        layout.anchorY = layoutBounds.y + layoutBounds.height - layout.margin.bottom - bounds.right;
                        break;
                }
            }
        }
    }
    /* eslint-enable */
    private updateConnectors(layout: ILayout, node: INode, level: number): void {
        let i: number;
        //let info: LayoutInfo;
        //let nodeWidth: number; let nodeHeight: number; let targetWidth: number; let targetHeight: number;
        //let length: number; let offsetLen: number; let points: PointModel[];
        //let segments: ConnSegments;
        let target: INode;
        let conn: IConnector;
        //Route out edges
        const info: LayoutInfo = layout.graphNodes[node.id];
        let direction: string;
        if (node.outEdges.length) {
            for (i = 0; i < node.outEdges.length; i++) {
                conn = layout.nameTable[node.outEdges[i]];
                conn.points = [];
                target = layout.nameTable[conn.targetID];
                if (conn.visible) {
                    conn.visited = true;
                    if (layout.getConnectorSegments) {
                        const segments: ConnSegments = layout.getConnectorSegments(conn);
                    } else {
                        if (info && info.tree.children.indexOf(conn.targetID) !== -1) {
                            conn.segments = [];
                            if (conn.type === 'Bezier') {
                                (conn.segments).push(new BezierSegment(conn, 'segments', { type: 'Bezier'}, true));
                            }
                            if (layout.type === 'OrganizationalChart' && conn.type === 'Orthogonal') {
                                this.updateSegments(layout, conn, node, target, i);
                            }
                        }
                    }
                    if (target && (target.isExpanded || this.hasChild(layout, target))) {
                        this.updateConnectors(layout, target, level + 1);
                    }
                }
            }
        }
        if (info && info.tree.assistants.length) {
            //In-Edge routing of assistant nodes
            for (i = 0; i < info.tree.assistants.length; i++) {
                target = layout.nameTable[info.tree.assistants[i]];
                conn = layout.nameTable[target.inEdges[0]];
                this.get3Points(layout, node, target, conn);
                if (target.isExpanded || this.hasChild(layout, target)) {
                    this.updateConnectors(layout, target, level + 1);
                }
            }
        }
    }

    private updateSegments(layout: ILayout, conn: IConnector, node: INode, target: INode, i: number): void {
        const info: LayoutInfo = layout.graphNodes[node.id];
        //Connector routing - Horizontal layout orientation
        if (info.tree.assistants.length) {
            //Route in-edge of child node, if the parent has assistant
            this.updateSegmentsForHorizontalOrientation(layout, node, target, conn);
        } else {
            //Route in-edge of child node
            if (info.tree.orientation === 'Horizontal' && info.tree.type === 'Balanced') {
                this.updateSegmentsForBalancedTree(layout, conn, node, target, i);
            } else {
                if (info.tree.orientation === 'Horizontal') {
                    this.updateSegmentsForHorizontalOrientation(layout, node, target, conn);
                } else {
                    if (info.tree.offset < 5) {
                        this.get5Points(layout, node, target, conn);
                    } else {
                        this.get3Points(layout, node, target, conn);
                    }
                }
            }
        }
    }

    private updateSegmentsForBalancedTree(layout: ILayout, connector: IConnector, node: INode, target: INode, i: number): void {
        const info: LayoutInfo = layout.graphNodes[node.id];
        let center: number;
        let relative: string;
        if (info.tree.children.length === 5 && i > 2) {
            relative = info.tree.children[1];
            if (isNaN(layout.graphNodes[relative].treeWidth)) {
                layout.graphNodes[relative].treeWidth = layout.nameTable[relative].actualSize.width;
            }
            const factor: number = i !== 3 ? 1 : -1;
            if (layout.orientation.indexOf('Left') !== -1) {
                center = layout.nameTable[relative].offsetY - layout.graphNodes[relative].treeWidth / 2 -
                    (layout.verticalSpacing * factor / 2);
            } else {
                const center: number = layout.nameTable[relative].offsetX +
                    layout.graphNodes[relative].treeWidth / 2 + (layout.horizontalSpacing * factor) / 2;
            }
            this.getSegmentsForMultipleRows(layout, node, target, connector);
        } else {
            if (info.tree.children.length > 5) {
                if (i < 4 || i < info.tree.rows) {
                    this.getSegmentsForMultipleRows(layout, node, target, connector);
                } else {
                    this.updateSegmentsForHorizontalOrientation(layout, node, target, connector);
                }
            } else if (info.tree.children.length === 4) {
                if (i < 2 || i < info.tree.rows) {
                    this.getSegmentsForMultipleRows(layout, node, target, connector);
                } else {
                    this.updateSegmentsForHorizontalOrientation(layout, node, target, connector);
                }
            } else {
                this.getSegmentsForMultipleRows(layout, node, target, connector);
            }
        }
    }

    private get3Points(layout: ILayout, node: INode, target: INode, connector: IConnector): void {
        const points: PointModel[] = [];
        const nodeBounds: Rect = this.getBounds(node);
        const targetBounds: Rect = this.getBounds(target);
        if (layout.orientation.indexOf('Top') !== -1) {
            const startingPoint: PointModel = layout.orientation.indexOf('Top') === 0 ? nodeBounds.bottomCenter :
                nodeBounds.topCenter;
            const endPoint: PointModel = node.offsetX > target.offsetX ? targetBounds.middleRight : targetBounds.middleLeft;
            points.push(
                startingPoint, { x: nodeBounds.bottomCenter.x, y: endPoint.y },
                endPoint);
        } else {
            const startingPoint: PointModel = layout.orientation.indexOf('Left') === 0 ? nodeBounds.middleRight :
                nodeBounds.middleLeft;
            const endPoint: PointModel = node.offsetY > target.offsetY ? targetBounds.bottomCenter : targetBounds.topCenter;
            points.push(
                startingPoint, { x: targetBounds.bottomCenter.x, y: nodeBounds.middleRight.y },
                endPoint);
        }
        this.getSegmentsFromPoints(points, connector);
    }

    private get5Points(layout: ILayout, node: INode, target: INode, connector: IConnector): void {
        const points: PointModel[] = [];
        //let layoutprop: Layout;
        const nodeBounds: Rect = this.getBounds(node);
        const targetBounds: Rect = this.getBounds(target);
        //let info: LayoutInfo = layout.graphNodes[node.id];
        let startingPoint: PointModel; let endPoint: PointModel;
        let horizontalSpacing: number; let verticalSpacing: number;
        if (layout.orientation.indexOf('Top') !== -1) {
            startingPoint = (node.offsetY < target.offsetY) ? nodeBounds.bottomCenter : nodeBounds.topCenter;
            verticalSpacing = layout.verticalSpacing / 4 * ((node.offsetY < target.offsetY) ? 1 : -1);
            horizontalSpacing = layout.horizontalSpacing / 2 * ((node.offsetX > target.offsetX) ? 1 : -1);
            endPoint = (node.offsetX > target.offsetX) ? targetBounds.middleRight : targetBounds.middleLeft;
            points.push(
                startingPoint, { x: startingPoint.x, y: startingPoint.y + verticalSpacing },
                { x: endPoint.x + horizontalSpacing, y: startingPoint.y + verticalSpacing },
                { x: endPoint.x + horizontalSpacing, y: endPoint.y }, endPoint);
        } else {
            startingPoint = (node.offsetX > target.offsetX) ? nodeBounds.middleLeft : nodeBounds.middleRight;
            endPoint = node.offsetY > target.offsetY ? targetBounds.bottomCenter : targetBounds.topCenter;
            horizontalSpacing = layout.horizontalSpacing / 4 * ((node.offsetX < target.offsetX) ? 1 : -1);
            verticalSpacing = layout.verticalSpacing / 2 * ((node.offsetY > target.offsetY) ? 1 : -1);
            points.push(
                startingPoint,
                { x: startingPoint.x + horizontalSpacing, y: startingPoint.y },
                { x: startingPoint.x + horizontalSpacing, y: startingPoint.y + verticalSpacing },
                { x: endPoint.x, y: startingPoint.y + verticalSpacing }, endPoint);
        }
        this.getSegmentsFromPoints(points, connector);
    }

    private getSegmentsFromPoints(points: PointModel[], connector: IConnector): void {
        const segments: OrthogonalSegment[] = [];
        let segment: OrthogonalSegment;
        for (let i: number = 0; i < points.length - 2; i++) {
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(points[i], points[i + 1]) as Direction;
            segment.length = Point.distancePoints(points[i], points[i + 1]);
            segments.push(segment);
        }
        connector.segments = segments;
    }

    private getSegmentsForMultipleRows(layout: ILayout, node: INode, target: INode, connector: IConnector): void {
        //let points: PointModel[] = [];
        const segments: OrthogonalSegmentModel[] = []; let point: PointModel; let segment: OrthogonalSegmentModel;
        const targetBounds: Rect = this.getBounds(target);
        const nodeBounds: Rect = this.getBounds(node);
        switch (layout.orientation) {
        case 'TopToBottom':
            point = { x: nodeBounds.bottomCenter.x, y: (nodeBounds.bottomCenter.y + layout.verticalSpacing / 4) };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.bottomCenter, point) as Direction;
            segment.length = Point.distancePoints(nodeBounds.bottomCenter, point);
            segments.push(segment);
            break;
        case 'BottomToTop':
            point = { x: nodeBounds.bottomCenter.x, y: (nodeBounds.topCenter.y - layout.verticalSpacing / 4) };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.topCenter, point) as Direction;
            segment.length = Point.distancePoints(nodeBounds.topCenter, point);
            segments.push(segment);
            break;
        case 'LeftToRight':
            point = { x: (nodeBounds.middleRight.x + layout.verticalSpacing / 4), y: nodeBounds.middleRight.y };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.middleRight, point) as Direction;
            segment.length = Point.distancePoints(nodeBounds.middleRight, point);
            segments.push(segment);
            if (targetBounds.center.y !== nodeBounds.center.y) {
                const point3: PointModel = { x: (nodeBounds.middleRight.x + layout.verticalSpacing / 4), y: targetBounds.middleLeft.y };
                segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
                segment.direction = Point.direction(point, point3) as Direction;
                segment.length = Point.distancePoints(point, point3);
                segments.push(segment);
            }
            break;
        case 'RightToLeft':
            point = { x: (nodeBounds.middleLeft.x - layout.verticalSpacing / 4), y: nodeBounds.middleRight.y };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.middleLeft, point) as Direction;
            segment.length = Point.distancePoints(nodeBounds.middleLeft, point);
            segments.push(segment);
            if (targetBounds.center.y !== nodeBounds.center.y) {
                const point: PointModel = { x: (nodeBounds.middleLeft.x - layout.verticalSpacing / 4), y: targetBounds.middleLeft.y };
                segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
                segment.direction = Point.direction(point, point) as Direction;
                segment.length = Point.distancePoints(point, point);
                segments.push(segment);
            }
            break;
        }
        connector.segments = segments;
    }

    private updateSegmentsForHorizontalOrientation(layout: ILayout, node: INode, target: INode, connector: IConnector): PointModel[] {
        const points: PointModel[] = []; let point2: PointModel;
        let segment: OrthogonalSegmentModel;
        const segments: OrthogonalSegmentModel[] = [];
        const nodeBounds: Rect = this.getBounds(node);
        const targetBounds: Rect = this.getBounds(target);
        switch (layout.orientation) {
        case 'TopToBottom':
            point2 = { x: nodeBounds.bottomCenter.x, y: (targetBounds.topCenter.y - layout.verticalSpacing / 2) };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.bottomCenter, point2) as Direction;
            segment.length = Point.distancePoints(nodeBounds.bottomCenter, point2);
            segments.push(segment);
            break;
        case 'BottomToTop':
            point2 = { x: nodeBounds.topCenter.x, y: (targetBounds.bottomCenter.y + layout.verticalSpacing / 2) };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.topCenter, point2) as Direction;
            segment.length = Point.distancePoints(nodeBounds.topCenter, point2);
            segments.push(segment);
            break;
        case 'LeftToRight':
            point2 = { x: (targetBounds.middleLeft.x - layout.verticalSpacing / 2), y: nodeBounds.middleRight.y };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.middleRight, point2) as Direction;
            segment.length = Point.distancePoints(nodeBounds.middleRight, point2);
            segments.push(segment);
            if (targetBounds.center.y !== nodeBounds.center.y) {
                const point3: PointModel = { x: (targetBounds.middleLeft.x - layout.verticalSpacing / 2), y: targetBounds.middleLeft.y };
                segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
                segment.direction = Point.direction(point2, point3) as Direction;
                segment.length = Point.distancePoints(point2, point3);
                segments.push(segment);
            }
            break;
        case 'RightToLeft':
            point2 = { x: (targetBounds.middleRight.x + layout.verticalSpacing / 2), y: nodeBounds.middleRight.y };
            segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
            segment.direction = Point.direction(nodeBounds.middleLeft, point2) as Direction;
            segment.length = Point.distancePoints(nodeBounds.middleLeft, point2);
            segments.push(segment);
            if (targetBounds.center.y !== nodeBounds.center.y) {
                const point: PointModel = { x: (targetBounds.middleRight.x + layout.verticalSpacing / 2), y: targetBounds.middleLeft.y };
                segment = new OrthogonalSegment(connector, 'segments', { type: 'Orthogonal' }, true);
                segment.direction = Point.direction(point2, point) as Direction;
                segment.length = Point.distancePoints(point2, point);
                segments.push(segment);
            }
            break;
        }
        connector.segments = segments;
        return points;
    }

    private updateNodes(layout: ILayout, node: INode, mod: number, update?: boolean, dx?: number, dy?: number): void {
        let i: number;
        let child: INode;
        let width: number; let height: number; let offsetX: number; let offsetY: number;
        if (node && !node.excludeFromLayout) {
            width = node.actualSize.width;
            height = node.actualSize.height;


            offsetX = layout.anchorX;
            offsetY = layout.anchorY;
            /*Performance - instead of checking conditions for every node, we can make the layout related
            conditions once and we can reuse them*/
            if (layout.orientation === 'LeftToRight') {
                offsetX += layout.graphNodes[node.id].y + width / 2;
                offsetY += layout.graphNodes[node.id].x + mod + height / 2;
            } else if (layout.orientation === 'RightToLeft') {
                offsetX -= layout.graphNodes[node.id].y + width / 2;
                offsetY += layout.graphNodes[node.id].x + mod + height / 2;
            } else if (layout.orientation === 'TopToBottom') {
                offsetX += layout.graphNodes[node.id].x + mod + width / 2;
                offsetY += layout.graphNodes[node.id].y + height / 2;
            } else {
                offsetX += layout.graphNodes[node.id].x + mod + width / 2;
                offsetY -= layout.graphNodes[node.id].y + height / 2;
            }
            if (layout.graphNodes) {
                dx = dx ? dx : 0;
                dy = dy ? dy : 0;
                offsetX += dx;
                offsetY += dy;
                if (!this.isAnimation) {
                    node.offsetX = offsetX;
                    node.offsetY = offsetY;
                }
            }
            const objects: INode = { id: node.id, differenceX: offsetX - node.offsetX, differenceY: offsetY - node.offsetY } as INode;
            layout.objects.push(objects);
            const list: INode[] = [];
            if (this.hasChild(layout, node)) {
                for (i = 0; i < layout.graphNodes[node.id].tree.children.length; i++) {
                    child = layout.nameTable[layout.graphNodes[node.id].tree.children[i]];
                    this.updateNodes(layout, child, mod + (layout.graphNodes[node.id].subTreeTranslation || 0), update, dx, dy);
                    list.push(child);
                }
            }

            if (layout.graphNodes[node.id].tree.assistants.length) {
                for (i = 0; i < layout.graphNodes[node.id].tree.assistants.length; i++) {
                    child = layout.nameTable[layout.graphNodes[node.id].tree.assistants[i]];
                    this.updateNodes(layout, child, mod + (layout.graphNodes[node.id].subTreeTranslation || 0), null, dx, dy);
                }
            }
        }
    }
}

interface LayoutInfo {
    subTreeTranslation?: number;
    tree?: TreeInfo;
    canMoveBy?: number;
    translate?: boolean;
    x?: number;
    y?: number;
    intersect?: number[];
    mid?: number;
    maxLevel?: number;
    translated?: boolean;
    diff?: number;
    firstChild?: FirstChildInfo;
    treeWidth?: number;
    treeBounds?: Bounds;
    prevBounds?: Bounds;
    childBounds?: Bounds;
    levelBounds?: LevelBounds[];
    actualLevel?: number;
    id?: string;
}

interface FirstChild {
    canMoveBy: number;
}

interface Dimensions {
    x: number;
    y: number;
    height: number;
    width: number;
}
interface FirstChildInfo {
    x: number; child: string; canMoveBy: number; id?: string;
}

interface ConnSegments {
    type?: string;
    length?: number;
    direction?: string;
}
interface AsstInfo {
    level: number;
    bottom: number;
}

interface TranslateInfo {
    layout: ILayout;
    shape: INode;
    shapeBounds: Bounds;
    treeBounds: Bounds;
    dim: Dimensions;
    level: number;
}

interface MultipleRowInfo {
    leftCenter?: number;
    rightCenter?: number;
    align?: boolean;
    rows?: string[][];
    rightTree?: string[][];
    leftTree?: string[][];
    bounds?: Bounds;
    rightBounds?: Bounds[];
    dimensions?: Dimensions;
    level?: number;
}


