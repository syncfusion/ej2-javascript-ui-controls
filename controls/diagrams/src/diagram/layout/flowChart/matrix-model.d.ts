import { FlowchartModel } from './flow-chart-model';
import { MatrixCellGroup } from './flow-chart-layout';
export declare class MatrixModel {
    /** @private */
    flowchartModel: FlowchartModel;
    /** @private */
    matrix: MatrixCellGroup[];
    /** @private */
    rowOffset: number[];
    /** @private */
    rowMaxDimension: number[];
    /** @private */
    siblingModel: MatrixModel;
    constructor(model: FlowchartModel);
    /**
     * @private
     * @returns {void} - Arranges the elements in the flowchart layout
     */
    arrangeElements(): void;
    private arrangeMatrix;
    private shiftMatrixCells;
    private findParentVertexCellGroup;
    private translateMatrixCells;
    private getObjectValues;
    private setXYForMatrixCell;
    private getSiblingDimension;
    private createMatrixCells;
    private groupLayoutCells;
    private updateMutualSharing;
    private compareLists;
}
