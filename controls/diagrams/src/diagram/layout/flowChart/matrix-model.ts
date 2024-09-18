import { FlowchartModel } from './flow-chart-model';
import { FlowchartLayout, InternalEdges, InternalVertex, MatrixCellGroup } from './flow-chart-layout';
import { Rect } from '../../primitives/rect';
import { PointModel } from '../../primitives/point-model';
import { Connector } from '../../objects/connector';
import { IConnector } from '../layout-base';
export class MatrixModel {
    /** @private */
    public flowchartModel: FlowchartModel;
    /** @private */
    public matrix: MatrixCellGroup[];
    /** @private */
    public rowOffset: number[]
    /** @private */
    public rowMaxDimension: number[];
    /** @private */
    public siblingModel: MatrixModel;

    constructor(model: FlowchartModel) {
        this.flowchartModel = model;
        this.matrix = [];
        this.rowOffset = [];
        this.rowMaxDimension = [];
        this.siblingModel = null;
    }
    /**
     * @private
     * @returns {void} - Arranges the elements in the flowchart layout
     */
    public arrangeElements(): void {
        if (this.flowchartModel === null) {
            return;
        }
        const layoutSettings: FlowchartLayout = this.flowchartModel.layout;
        const isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight';
        const spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;

        this.groupLayoutCells();
        this.createMatrixCells();
        for (const matrixRow of this.matrix as MatrixCellGroup[]) {
            for (let i: number = 1; i < (matrixRow as any).length; i++) {
                const cell: any = (matrixRow as any)[parseInt(i.toString(), 10)];
                const prevCell: any = (matrixRow as any)[i - 1];
                cell.offset += prevCell.offset + (prevCell.size / 2) + spacing + (cell.size / 2);
            }
        }

        for (const root of this.matrix[0] as any) {
            this.arrangeMatrix(root as MatrixCellGroup, null);
        }

        for (const row of this.matrix) {
            for (let i: number = 0; i < (row as any).length; i++) {
                const cell: any = (row as any)[parseInt(i.toString(), 10)];
                if (cell.visitedParents.length > 1) {
                    let firstParent: any = cell.visitedParents[0];
                    let lastParent: any = cell.visitedParents[cell.visitedParents.length - 1];
                    const firstVertexParent: MatrixCellGroup = this.findParentVertexCellGroup(firstParent);
                    const lastVertexParent: MatrixCellGroup = this.findParentVertexCellGroup(lastParent);

                    if (firstParent !== firstVertexParent && firstVertexParent.offset < firstParent.offset) {
                        firstParent = firstVertexParent;
                    }

                    if (lastParent !== lastVertexParent && lastVertexParent.offset > lastParent.offset) {
                        lastParent = firstVertexParent;
                    }

                    let newOffset: number = (firstParent.offset + lastParent.offset) / 2;
                    const interVertex: any = cell.cells.find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                    if (this.flowchartModel.layout.yesBranchDirection === 'SameAsFlow') {
                        const tempVisitedParents: any[] = [...cell.visitedParents];
                        if (interVertex && interVertex.cell.isYesChild) {
                            for (const tempParent of tempVisitedParents) {
                                const tempParentVertex: InternalVertex = tempParent.cells.find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                                if (!tempParentVertex) {
                                    newOffset = tempParent.offset;
                                    break;
                                }
                            }
                        } else {
                            if (this.flowchartModel.layout.noBranchDirection === 'LeftInFlow') {
                                tempVisitedParents.reverse();
                            }

                            for (const tempParent of tempVisitedParents) {
                                const tempParentVertex: InternalVertex = tempParent.cells.find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                                if (tempParentVertex) {
                                    if (tempParentVertex.cell.isYesChild) {
                                        newOffset = tempParent.offset;
                                        break;
                                    }
                                } else {
                                    const tempSuperParent: MatrixCellGroup = this.findParentVertexCellGroup(tempParent);
                                    if (tempSuperParent) {
                                        const superParentVertex: InternalVertex = (tempSuperParent.cells as InternalVertex[]).find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                                        if (superParentVertex && (superParentVertex as InternalVertex).cell.isYesChild) {
                                            newOffset = tempParent.offset;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else if (this.flowchartModel.layout.noBranchDirection === 'SameAsFlow') {
                        const tempVisitedParents: any = [...cell.visitedParents];
                        if (interVertex && interVertex.cell.isNoChild) {
                            for (const tempParent of tempVisitedParents) {
                                const tempParentVertex: InternalVertex = tempParent.cells.find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                                if (!tempParentVertex) {
                                    newOffset = tempParent.offset;
                                    break;
                                }
                            }
                        } else {
                            if (this.flowchartModel.layout.yesBranchDirection === 'LeftInFlow') {
                                tempVisitedParents.reverse();
                            }

                            for (const tempParent of tempVisitedParents) {
                                const tempParentVertex: InternalVertex = tempParent.cells.find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                                if (tempParentVertex) {
                                    if (tempParentVertex.cell.isNoChild) {
                                        newOffset = tempParent.offset;
                                        break;
                                    }
                                } else {
                                    const tempSuperParent: MatrixCellGroup = this.findParentVertexCellGroup(tempParent);
                                    if (tempSuperParent) {
                                        const superParentVertex: InternalVertex = (tempSuperParent.cells as InternalVertex[]).find((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c);
                                        if (superParentVertex && (superParentVertex as InternalVertex).cell.isNoChild) {
                                            newOffset = tempParent.offset;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    const availOffsetMin: any = cell.initialOffset; const availOffsetMax: any = cell.offset;
                    if (availOffsetMax !== availOffsetMin) {
                        if (newOffset >= availOffsetMin && newOffset <= availOffsetMax) {
                            this.translateMatrixCells(newOffset - cell.offset, cell);
                        } else if (newOffset < availOffsetMin) {
                            this.translateMatrixCells(availOffsetMin - cell.offset, cell);
                        }
                    }
                }
            }
        }

        this.setXYForMatrixCell();
    }

    private arrangeMatrix(cell: MatrixCellGroup, parent: MatrixCellGroup): void {
        const layoutSettings: FlowchartLayout = this.flowchartModel.layout;
        const isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight';
        const spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
        const matrixRow: any = this.matrix[cell.level];
        const matrixIndex: number = (matrixRow as any).indexOf(cell);

        if (cell.visitedParents.length) {
            if (cell.visitedParents.length === 1) {
                cell.initialOffset = cell.offset;
            }

            if (matrixIndex + 1 < matrixRow.length) {
                const nextCell: any = matrixRow[matrixIndex + 1];
                if (nextCell.visitedParents.length) {
                    if (cell.visitedParents.indexOf(parent) === -1) {
                        if (cell.level !== parent.level) {
                            cell.visitedParents.push(parent);
                            parent.ignoredChildren.push(cell);
                        }

                        return;
                    }
                }
            }
        }

        if (!cell.children.length) {
            let validOffset: number = cell.offset;
            if (matrixIndex > 0) {
                const prevCell: any = matrixRow[matrixIndex - 1];
                validOffset = prevCell.offset + (prevCell.size / 2) + spacing + (cell.size / 2);
            }

            this.shiftMatrixCells(validOffset - cell.offset, cell);
        } else {
            for (const matrixCellChild of cell.children) {
                if (cell.visitedChildren.indexOf(matrixCellChild)) {
                    this.arrangeMatrix(matrixCellChild, cell);
                    if (cell.level !== matrixCellChild.level) {
                        cell.visitedChildren.push(matrixCellChild);
                    } else {
                        cell.loopChildren.push(matrixCellChild);
                    }
                }
            }

            if (cell.visitedChildren.length) {
                let children: MatrixCellGroup[] = [...cell.visitedChildren];
                for (const cellIgnoredChild of cell.ignoredChildren) {
                    children = children.filter((child: MatrixCellGroup) => child !== cellIgnoredChild);
                }

                if (children.length) {
                    const firstChild: MatrixCellGroup = children[0];
                    const lastChild: MatrixCellGroup = children[children.length - 1];
                    const x1: number = firstChild.offset;
                    const x2: number = lastChild.offset;
                    let newOffset: number = (x1 + x2) / 2;
                    if (cell.cells.length) {
                        const interVertex: InternalVertex = (cell.cells as InternalVertex[]).filter((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c)[0];
                        const firstChildVertex: InternalVertex = (firstChild.cells as InternalVertex[]).filter((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c)[0];
                        const lastChildVertex: InternalVertex = (lastChild.cells as InternalVertex[]).filter((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c)[0];
                        if (interVertex && interVertex.cell.isDecisionNode) {
                            if (this.flowchartModel.layout.yesBranchDirection === 'SameAsFlow') {
                                if (firstChildVertex) {
                                    newOffset = firstChildVertex.cell.isYesChild ? firstChild.offset : lastChild.offset;
                                } else if (lastChildVertex) {
                                    newOffset = lastChildVertex.cell.isYesChild ? lastChild.offset : firstChild.offset;
                                }
                            } else if (this.flowchartModel.layout.noBranchDirection === 'SameAsFlow') {
                                if (firstChildVertex) {
                                    newOffset = firstChildVertex.cell.isNoChild ? firstChild.offset : lastChild.offset;
                                } else if (lastChildVertex) {
                                    newOffset = lastChildVertex.cell.isNoChild ? lastChild.offset : firstChild.offset;
                                }
                            }
                        }
                    }

                    if (newOffset < cell.offset) {
                        this.shiftMatrixCells(cell.offset - newOffset, firstChild, true, cell);
                    } else if (newOffset > cell.offset) {
                        this.shiftMatrixCells(newOffset - cell.offset, cell);
                    }
                }
            }
        }

        if (cell.visitedParents.indexOf(parent) === -1) {
            if (parent !== null && cell.level !== parent.level) {
                cell.visitedParents.push(parent);
            }
        }
    }

    private shiftMatrixCells(value: number, startingCell: MatrixCellGroup, shiftChildren: boolean = false,
                             parentCell: MatrixCellGroup = null): void {
        if (value !== 0) {
            const matrixRow: any = this.matrix[startingCell.level];
            const index: number = (matrixRow as any).indexOf(startingCell);

            for (let i: number = index; i < matrixRow.length; i++) {
                matrixRow[parseInt(i.toString(), 10)].offset += value;
            }

            if (shiftChildren) {
                if (startingCell.visitedChildren.length) {
                    this.shiftMatrixCells(value, startingCell.visitedChildren[0], true, startingCell);
                } else {
                    let i: number = 1;
                    let nextSiblingWithChild: any = null;
                    while (index + i < matrixRow.length) {
                        const nextCell: any = matrixRow[index + i];
                        if (parentCell !== null && nextCell.visitedParents.indexOf(parentCell) !== -1) {
                            if (nextCell.visitedChildren.length) {
                                nextSiblingWithChild = nextCell;
                            } else {
                                i++;
                                continue;
                            }
                        }

                        break;
                    }

                    if (nextSiblingWithChild !== null) {
                        this.shiftMatrixCells(value, nextSiblingWithChild.visitedChildren[0], true, nextSiblingWithChild);
                    }
                }
            }
        }
    }

    private findParentVertexCellGroup(cell: MatrixCellGroup): MatrixCellGroup {
        if ('internalInEdges' in cell.cells[0] && 'internalOutEdges' in cell.cells[0]) {
            return cell;
        }

        if (cell.parents.length) {
            return this.findParentVertexCellGroup(cell.parents[0]);
        }

        return cell;
    }

    private translateMatrixCells(value: number, cell: MatrixCellGroup): void {
        if (value !== 0) {
            cell.offset += value;
            if (cell.visitedChildren.length) {
                for (const child of cell.visitedChildren) {
                    this.translateMatrixCells(value, child);
                }
                for (const loopChild of cell.loopChildren) {
                    this.translateMatrixCells(value, loopChild);
                }
            }
        }
    }
    private getObjectValues(obj: any): number[] | MatrixCellGroup[] {
        const values: MatrixCellGroup[] | number[] = [];
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                values.push(obj[`${key}`]);
            }
        }
        return values;
    }
    private setXYForMatrixCell(): void {
        const layoutSettings: FlowchartLayout = this.flowchartModel.layout;
        const isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight';
        const spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
        let siblingSize: number = 0;

        if (this.siblingModel) {
            const rowMaxValues: number[] | MatrixCellGroup[] = this.getObjectValues(this.rowMaxDimension);
            const maxRowValue: number = Math.max(...rowMaxValues as number[]);
            siblingSize = this.siblingModel.getSiblingDimension(maxRowValue);
        }

        for (const matrixRow1 of this.getObjectValues(this.matrix) as any) {
            for (const matrixCell of matrixRow1) {
                let start: number = matrixCell.offset - (matrixCell.size / 2);
                if (siblingSize !== 0) {
                    start += siblingSize + spacing;
                }

                for (const cell of matrixCell.cells) {
                    if ('internalInEdges' in cell && 'internalOutEdges' in cell) {
                        const internalVertex: any = cell;
                        const width: number = internalVertex.cell.geometry.width;
                        const height: number = internalVertex.cell.geometry.height;
                        if (isHorizontal) {
                            internalVertex.cell.geometry = new Rect(
                                this.rowOffset[matrixCell.level] - (width / 2),
                                start,
                                width,
                                height);
                        }
                        else {
                            internalVertex.cell.geometry = new Rect(
                                start,
                                this.rowOffset[matrixCell.level] - (height / 2),
                                width,
                                height);
                        }
                        start += (isHorizontal ? height : width) + spacing;
                    } else if ('edges' in cell) {
                        const internalEdges: any = cell;
                        let isContainSiblingVertex: boolean = internalEdges.isReversed;

                        if (!isContainSiblingVertex) {
                            const parent: MatrixCellGroup[] = matrixCell.visitedParents[0];
                            if (parent) {
                                for (const child of (parent as any).visitedChildren) {
                                    if (child.cells.some((c: InternalVertex) => 'internalInEdges' in c && 'internalOutEdges' in c)) {
                                        isContainSiblingVertex = true;
                                        break;
                                    }
                                }
                            }
                        }

                        const lineWidth: number = 1; const edgeSpacing: number = 5;
                        for (const internalConnector of internalEdges.edges) {
                            if (isContainSiblingVertex) {
                                let pt: PointModel = { x: start + (lineWidth / 2.0), y: this.rowOffset[matrixCell.level] };
                                if (isHorizontal) {
                                    pt = { x: this.rowOffset[matrixCell.level], y: start + (lineWidth / 2.0) };
                                }
                                if (this.flowchartModel.layout.edgesMapper.has(internalConnector)) {
                                    (this.flowchartModel.layout.edgesMapper.get(internalConnector) as PointModel[]).push(pt);
                                    this.flowchartModel.layout.loopedgesMapper.set(internalConnector, internalEdges.isReversed);
                                }
                            }
                            start += lineWidth + edgeSpacing;
                        }
                        start += spacing;
                    }
                }
            }
        }
    }

    private getSiblingDimension(maxHeight: number): number {
        const layoutSettings: FlowchartLayout = this.flowchartModel.layout;
        const isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight';
        const spacing: number = isHorizontal ? layoutSettings.horizontalSpacing : layoutSettings.verticalSpacing;

        let commonRowIndex: number = 0;
        for (const key in this.rowMaxDimension) {
            if (Object.prototype.hasOwnProperty.call(this.rowMaxDimension, key)) {
                const value: number = this.rowMaxDimension[`${key}`];
                if (value < maxHeight) {
                    commonRowIndex = parseInt(key, 10);
                } else {
                    break;
                }
            }
        }

        if (this.rowMaxDimension[parseInt(commonRowIndex.toString(), 10)] + spacing <= maxHeight
            && this.rowMaxDimension[commonRowIndex + 1]) {
            commonRowIndex++;
        }

        const commonRows: MatrixCellGroup[] = [];
        for (const key in this.matrix) {
            if (Object.prototype.hasOwnProperty.call(this.matrix, key) && parseInt(key, 10) <= commonRowIndex) {
                commonRows[`${key}`] = this.matrix[`${key}`];
            }
        }

        let maxSize: number = 0;

        for (const key in commonRows) {
            if (Object.prototype.hasOwnProperty.call(commonRows, key)) {
                const matrixRow1: any = commonRows[`${key}`];

                if ((matrixRow1 as any).length) {
                    const firstCell: any = matrixRow1[0].cells[0];

                    let rowStart: number = 0;
                    if (firstCell && 'cell' in firstCell) {
                        const geometry: Rect = firstCell.cell.geometry;
                        rowStart = isHorizontal ? geometry.y : geometry.x;
                    } else if (firstCell && 'edges' in firstCell) {
                        const internalConnector: Connector = firstCell.edges[firstCell.edges.length - 1];
                        const edgePts: PointModel[] = this.flowchartModel.layout.edgesMapper.get(internalConnector);
                        if (edgePts.length) {
                            rowStart = isHorizontal ? edgePts[0].y : edgePts[0].x;
                        }
                    }

                    let rowEnd: number = 0;
                    const lastCell: any = matrixRow1[(matrixRow1 as any).length - 1]
                        .cells[matrixRow1[(matrixRow1 as any).length - 1].cells.length - 1];

                    if (lastCell && 'cell' in lastCell) {
                        const geometry: Rect = lastCell.cell.geometry;
                        rowEnd = isHorizontal ? geometry.y + geometry.height : geometry.x + geometry.width;
                    } else if (lastCell && 'edges' in lastCell) {
                        const internalConnector: Connector = lastCell.edges[lastCell.edges.length - 1];
                        const edgePts: PointModel[] = this.flowchartModel.layout.edgesMapper.get(internalConnector);
                        if (edgePts.length) {
                            rowEnd = isHorizontal ? edgePts[0].y : edgePts[0].x;
                        }
                    }

                    maxSize = Math.max(maxSize, rowEnd - rowStart);
                }
            }
        }

        return maxSize;

    }


    private createMatrixCells(): void {
        const layoutSettings: FlowchartLayout = this.flowchartModel.layout;
        const isHorizontal: boolean = layoutSettings.orientation === 'LeftToRight';
        const spacing: number = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
        const spacingInverse: number = isHorizontal ? layoutSettings.horizontalSpacing : layoutSettings.verticalSpacing;

        const rank:  Map<number, []> = this.flowchartModel.ranks;
        const ranks: any = Array.from((rank as any).values());
        const matrixCellMapper: { [index: number]: { [key: string]: MatrixCellGroup } } = {};
        let matrixRowOffset: number = -spacingInverse;

        for (let j: number = ranks.length - 1; j >= 0; j--) {
            let maxDimension: number = 0.0;
            const index: number = (ranks.length - 1) - j;
            const rank: (InternalVertex | InternalEdges)[] = [...ranks[parseInt(j.toString(), 10)] as InternalVertex[] | InternalEdges[]];

            // Creating new row and adding it to matrix
            const matrixRow: any = [];
            this.matrix[parseInt(index.toString(), 10)] = matrixRow;

            // Creating new row mapper
            const tempMatrixRow: { [key: string]: MatrixCellGroup } = {};
            matrixCellMapper[parseInt(index.toString(), 10)] = tempMatrixRow;

            while (rank.length > 0) {
                const layoutCell: InternalVertex | InternalEdges = rank[0] as InternalVertex;
                const matrixCell: MatrixCellGroup = {
                    parents: [],
                    children: [],
                    visitedParents: [],
                    visitedChildren: [],
                    ignoredChildren: [],
                    loopChildren: [],
                    cells: [],
                    level: index,
                    initialOffset: 0,
                    size: 0,
                    offset: 0
                };
                matrixRow.push(matrixCell);

                if ('internalInEdges' in layoutCell && 'internalOutEdges' in layoutCell) {
                    (matrixCell.cells as InternalVertex[]).push(layoutCell as InternalVertex);

                    if (layoutCell.identicalSibling) {
                        for (let i: number = 0; i < rank.length; i++) {
                            const internalVertex: InternalVertex = rank[parseInt(i.toString(), 10)] as InternalVertex;
                            if ('internalInEdges' in internalVertex && 'internalOutEdges' in internalVertex) {
                                if (layoutCell.identicalSibling.indexOf(internalVertex.id) !== -1) {
                                    (matrixCell.cells as InternalVertex[]).push(internalVertex);
                                    if (matrixCell.cells.length > layoutCell.identicalSibling.length) {
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    const cells: InternalVertex[] = matrixCell.cells as InternalVertex[];
                    for (let i: number = 0; i < cells.length; i++) {
                        const internalVertex: InternalVertex = cells[parseInt(i.toString(), 10)];
                        if ('internalInEdges' in internalVertex && 'internalOutEdges' in internalVertex) {
                            const geometry: Rect = internalVertex.cell.geometry;
                            matrixCell.size += isHorizontal ? geometry.height : geometry.width;
                            maxDimension = Math.max(maxDimension, isHorizontal ? geometry.width : geometry.height);
                            tempMatrixRow[internalVertex.id] = matrixCell;

                            if (internalVertex.internalInEdges.length) {
                                const internalInEdges: InternalEdges[] = internalVertex.internalInEdges as InternalEdges[];
                                for (let j: number = 0; j < internalInEdges.length; j++) {
                                    const internalEdges: InternalEdges = internalInEdges[parseInt(j.toString(), 10)];
                                    if (internalEdges.isReversed) {
                                        continue;
                                    }

                                    let key: string | string[] = null;
                                    if (
                                        matrixCellMapper[index - 1] &&
                                        Object.prototype.hasOwnProperty.call(matrixCellMapper[index - 1], internalEdges.ids as any)
                                    ) {
                                        key = internalEdges.ids;
                                    } else if (
                                        matrixCellMapper[index - 1] &&
                                        Object.prototype.hasOwnProperty.call(matrixCellMapper[index - 1], internalEdges.source.id)
                                    ) {
                                        key = internalEdges.source.id;
                                    }

                                    if (key !== null) {
                                        const parentMatrixCell: MatrixCellGroup = matrixCellMapper[index - 1][`${key as string}`] as MatrixCellGroup;
                                        if (matrixCell.parents.indexOf(parentMatrixCell) === -1) {
                                            matrixCell.parents.push(parentMatrixCell);
                                        }

                                        if (parentMatrixCell.children.indexOf(matrixCell) === -1) {
                                            if (parentMatrixCell.children.length) {
                                                if (parentMatrixCell.children[0].level === parentMatrixCell.level) {
                                                    parentMatrixCell.children.unshift(matrixCell);
                                                } else {
                                                    parentMatrixCell.children.push(matrixCell);
                                                }
                                            } else {
                                                parentMatrixCell.children.push(matrixCell);
                                            }
                                        }
                                    }
                                }
                            }

                            rank.splice((rank as InternalVertex[]).indexOf(internalVertex), 1);
                        }
                    }


                    matrixCell.size += (matrixCell.cells.length - 1) * spacing;
                } else if ('edges' in layoutCell) {
                    matrixCell.cells.push(layoutCell);

                    const cells: InternalEdges[] = matrixCell.cells as InternalEdges[];
                    for (let i: number = 0; i < cells.length; i++) {
                        const internalEdge: InternalEdges = cells[parseInt(i.toString(), 10)];

                        if ('edges' in internalEdge && internalEdge.edges) {
                            const lineWidth: number = 1; const edgeSpacing: number = 5;
                            let cellSize: number = -edgeSpacing;

                            for (let j: number = 0; j < internalEdge.edges.length; j++) {
                                const internalConnector: IConnector = internalEdge.edges[parseInt(j.toString(), 10)];
                                cellSize += lineWidth + edgeSpacing;
                            }

                            matrixCell.size += cellSize;
                        }

                        let key: string | string[] = null;
                        if (internalEdge.isReversed) {
                            if (matrixCellMapper[parseInt(index.toString(), 10)][internalEdge.ids as any]) {
                                key = internalEdge.ids;
                            } else if (matrixCellMapper[parseInt(index.toString(), 10)][internalEdge.source.id]) {
                                key = internalEdge.source.id;
                            }
                        } else {
                            if (matrixCellMapper[index - 1][internalEdge.ids as any]) {
                                key = internalEdge.ids;
                            } else if (matrixCellMapper[index - 1][internalEdge.source.id]) {
                                key = internalEdge.source.id;
                            }
                        }

                        if (key !== null) {
                            const parentMatrixCell:  MatrixCellGroup = matrixCellMapper[internalEdge.isReversed ?
                                index : index - 1][`${key as string}`];
                            if (matrixCell.parents.indexOf(parentMatrixCell) === -1) {
                                matrixCell.parents.push(parentMatrixCell);
                            }

                            if (parentMatrixCell.children.indexOf(matrixCell) === -1) {
                                parentMatrixCell.children.push(matrixCell);
                            }
                        }

                        tempMatrixRow[internalEdge.ids as any] = matrixCell;
                        rank.splice((rank as InternalEdges[]).indexOf(internalEdge), 1);
                    }

                    matrixCell.size += (matrixCell.cells.length - 1) * spacing;
                }
            }

            this.rowOffset[parseInt(index.toString(), 10)] = matrixRowOffset + (maxDimension / 2) + spacingInverse;
            this.rowMaxDimension[parseInt(index.toString(), 10)] = this.rowOffset[parseInt(index.toString(), 10)] + maxDimension / 2;
            matrixRowOffset += maxDimension + spacingInverse;
        }
    }


    private groupLayoutCells(): void {
        const rank: Map<number, []> = this.flowchartModel.ranks;
        const ranks: any = Array.from((rank as any).values());
        ranks.reverse();

        for (let j: number = ranks.length - 1; j >= 0; j--) {
            const vertices: InternalVertex[] = ranks[parseInt(j.toString(), 10)].filter((v: InternalVertex) => 'internalInEdges' in v && 'internalOutEdges' in v);
            const edges: InternalEdges[] = ranks[parseInt(j.toString(), 10)].filter((e: InternalEdges) => 'edges' in e && 'edges' in e);

            while (vertices.length > 1) {
                const vertex1: InternalVertex = vertices[0];
                if (vertex1.cell.isYesChild || vertex1.cell.isNoChild) {
                    vertices.shift();
                    continue;
                }

                const parentSet1: string[] = vertex1.internalInEdges.map((e: InternalEdges) => e.source.id);
                const childSet1: string[] = vertex1.internalOutEdges.map((e: InternalEdges) => e.target.id);

                while (vertices.length > 1) {
                    const vertex2: InternalVertex = vertices[1];
                    const parentSet2: string[] = vertex2.internalInEdges.map((e: InternalEdges) => e.source.id);
                    const childSet2: string[] = vertex2.internalOutEdges.map((e: InternalEdges) => e.target.id);

                    const parentEquals: boolean = this.compareLists(parentSet1, parentSet2);
                    const childEquals: boolean = this.compareLists(childSet1, childSet2);

                    if (parentEquals && childEquals) {
                        this.updateMutualSharing(vertices[0], vertex2.id);
                        this.updateMutualSharing(vertices[1], vertex1.id);
                        vertices.splice(1, 1);
                        continue;
                    }
                    break;
                }
                vertices.shift();
            }

            while (edges.length > 1) {
                const internalEdge: InternalEdges = edges[0];
                const parentSet: InternalVertex  = internalEdge.source;
                const childSet: InternalVertex = internalEdge.target;

                if (parentSet.identicalSibling) {
                    const groupEdges: InternalEdges[] = edges.filter((e: InternalEdges) => e.target === childSet);
                    for (const internalEdges of groupEdges) {
                        if ((parentSet.identicalSibling).indexOf(internalEdges.source.id) !== -1) {
                            internalEdges.source.identicalSibling = null;
                        }
                    }
                    internalEdge.source.identicalSibling = null;
                }
                edges.shift();
            }
        }
    }

    private updateMutualSharing(cell: InternalVertex, id: string): void {
        if (cell.identicalSibling) {
            cell.identicalSibling.push(id);
        } else {
            cell.identicalSibling = [id];
        }
    }

    private compareLists(list1: string[], list2: string[]): boolean {
        const newList1: string[] = list1.slice();
        const newList2: string[] = list2.slice();

        if (newList1.length === newList2.length) {
            if (newList1.length === 0) {
                return true;
            }

            for (const o of newList2) {
                if (newList1.indexOf(o) === -1) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

}
