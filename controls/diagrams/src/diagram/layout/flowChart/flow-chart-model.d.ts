import { NodeModel } from '../../objects/node-model';
import { FlowchartLayout, FlowChartVertex } from './flow-chart-layout';
export declare class FlowchartModel {
    private dfsCount;
    private maxRank;
    /** @private*/
    layout: FlowchartLayout;
    private vertexMapper;
    /** @private*/
    ranks: Map<number, []>;
    private rootNode;
    constructor(layout: FlowchartLayout, root: NodeModel, vertices: FlowChartVertex[]);
    private createInternalCells;
    /**
     * @Private
     * @returns { void }  Initializes the ranks of the vertices .\
     */
    layeringStage(): void;
    private recycleConnectors;
    private initialRank;
    private fixRanks;
    /**
     * used to visit all the entries on the given dictionary with given function \
     *
     * @returns { void }  used to visit all the entries on the given dictionary with given function .\
     * @param {InternalVertex[]} dfsRoots - provide the dfsRoots value.
     * @param {boolean} trackAncestors - provide the trackAncestors value.
     * @param {Map<number, []>} rankList - provide the rankList value.
     * @private
     */
    private visit;
    private extendedDfs;
    private removeConnectionEdge;
    private invert;
    private remove;
    private isAncestor;
    private depthFirstSearch;
    private updateMinMaxRank;
}
