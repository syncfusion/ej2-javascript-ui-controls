import { Workbook, RowModel, CellModel, getCell, setCell, getSheetIndex } from '../base/index';
import { deleteModel, deleteAction, InsertDeleteModelArgs, updateUsedRange, ExtendedRange, MergeArgs } from '../../workbook/common/index';
import { activeCellMergedRange, setMerge, workbookFormulaOperation, InsertDeleteEventArgs } from '../../workbook/common/index';
import { SheetModel } from '../../workbook/base/index';

/**
 * The `WorkbookDelete` module is used to delete cells, rows, columns and sheets from workbook.
 */
export class WorkbookDelete {
    private parent: Workbook;
    /**
     * Constructor for the workbook delete module.
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    // tslint:disable-next-line
    private deleteModel(args: InsertDeleteModelArgs): void {
        let modelName: string = `${args.modelType.toLowerCase()}s`;
        args.start = <number>args.start;
        if (args.start > args.end) {
            let temp: number = args.start; args.start = args.end; args.end = temp;
        }
        let deletedCells: RowModel[]; let mergeArgsCollection: MergeArgs[] = []; let count: number = (args.end - args.start) + 1;
        let range: number[]; let prevCell: CellModel; let sheetIndex: number;
        if (args.modelType === 'Row') {
            args.model = <SheetModel>args.model;
            if (args.start > args.model.usedRange.rowIndex) { return; }
            if (args.end > args.model.usedRange.rowIndex) { args.end -= (args.end - args.model.usedRange.rowIndex); }
            args.model.usedRange.rowIndex -= ((args.end - args.start) + 1);
            if (args.model.usedRange.rowIndex < 0) { args.model.usedRange.rowIndex = 0; }
            this.parent.notify(updateUsedRange, { index: args.model.usedRange.rowIndex, update: 'row' });
            let curIdx: number = args.end + 1; let cell: CellModel; let mergeArgs: MergeArgs;
            if (args.model.rows[args.start] && args.model.rows[args.start].cells) {
                for (let i: number = 0; i <= args.model.usedRange.colIndex; i++) {
                    if (args.model.rows[args.start].cells[i] && args.model.rows[args.start].cells[i].rowSpan !== undefined &&
                        args.model.rows[args.start].cells[i].rowSpan < 0 && args.model.rows[args.start].cells[i].colSpan === undefined) {
                        mergeArgs = { range: [args.start, i, args.start, i] };
                        this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
                        if (mergeArgs.range[2] <= args.end) {
                            prevCell = getCell(mergeArgs.range[0], i, args.model);
                            if (prevCell && prevCell.rowSpan > 1) {
                                if (prevCell.rowSpan - ((mergeArgs.range[2] - args.start) + 1) > 1) {
                                    setCell(
                                        mergeArgs.range[0], i, args.model,
                                        { colSpan: prevCell.rowSpan - ((mergeArgs.range[2] - args.start) + 1) }, true);
                                } else {
                                    delete args.model.rows[mergeArgs.range[0]].cells[i].rowSpan;
                                }
                            }
                            mergeArgs = null;
                        }
                    }
                    if (args.model.rows[curIdx].cells && args.model.rows[curIdx].cells[i] &&
                        args.model.rows[curIdx].cells[i].rowSpan !== undefined &&
                        args.model.rows[curIdx].cells[i].rowSpan < 0 && args.model.rows[curIdx].cells[i].colSpan === undefined) {
                        if (!mergeArgs) {
                            mergeArgs = { range: [curIdx, i, curIdx, i] }; this.parent.notify(activeCellMergedRange, mergeArgs);
                        }
                        cell = new Object(); mergeArgs.range = mergeArgs.range as number[];
                        Object.assign(cell, getCell(mergeArgs.range[0], mergeArgs.range[1], args.model));
                        if (cell && cell.rowSpan && (cell.rowSpan > 1 || cell.colSpan > 1)) {
                            let indexes: number[] = [];
                            indexes[1] = i; indexes[3] = cell.colSpan > 1 ? i + (cell.colSpan - 1) : i;
                            mergeArgs.range = mergeArgs.range as number[];
                            if (mergeArgs.range[0] < args.start) {
                                indexes[0] = indexes[2] = mergeArgs.range[0];
                                if (cell.rowSpan - count > 1) { indexes[2] += (cell.rowSpan - count - 1); }
                            } else {
                                indexes[0] = indexes[2] = args.start;
                                if (cell.rowSpan - ((args.end - mergeArgs.range[0]) + 1) > 1) {
                                    indexes[2] += ((cell.rowSpan - ((args.end - mergeArgs.range[0]) + 1)) - 1);
                                }
                            }
                            mergeArgsCollection.push(<MergeArgs>{
                                range: indexes, isAction: false, preventRefresh: true, merge: true,
                                type: 'All', skipChecking: true
                            });
                        }
                    }
                    mergeArgs = null;
                }
            }
        } else if (args.modelType === 'Column') {
            args.model = <SheetModel>args.model;
            if (args.start > args.model.usedRange.colIndex) { return; }
            if (args.end > args.model.usedRange.colIndex) { args.end -= (args.end - args.model.usedRange.colIndex); }
            args.model.usedRange.colIndex -= count;
            if (args.model.usedRange.colIndex < 0) { args.model.usedRange.colIndex = 0; }
            //this.setDeleteInfo(args.start, args.end, 'fldLen', 'Column');
            this.parent.notify(updateUsedRange, { index: args.model.usedRange.colIndex, update: 'col' });
            deletedCells = []; let curIdx: number = args.end + 1; let cell: CellModel; let mergeArgs: MergeArgs;
            for (let i: number = 0; i <= args.model.usedRange.rowIndex; i++) {
                deletedCells.push({});
                if (args.model.rows[i] && args.model.rows[i].cells) {
                    if (args.model.rows[i].cells[args.start] && args.model.rows[i].cells[args.start].colSpan !== undefined &&
                        args.model.rows[i].cells[args.start].colSpan < 0 && args.model.rows[i].cells[args.start].rowSpan === undefined) {
                        mergeArgs = { range: [i, args.start, i, args.start] };
                        this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
                        if (mergeArgs.range[3] <= args.end) {
                            let prevCell: CellModel = getCell(i, mergeArgs.range[1], args.model);
                            if (prevCell && prevCell.colSpan > 1) {
                                if (prevCell.colSpan - ((mergeArgs.range[3] - args.start) + 1) > 1) {
                                    setCell(
                                        i, mergeArgs.range[1], args.model,
                                        { colSpan: prevCell.colSpan - ((mergeArgs.range[3] - args.start) + 1) }, true);
                                } else {
                                    delete args.model.rows[i].cells[mergeArgs.range[1]].colSpan;
                                }
                            }
                            mergeArgs = null;
                        }
                    }
                    if (args.model.rows[i].cells[curIdx] && args.model.rows[i].cells[curIdx].colSpan !== undefined &&
                        args.model.rows[i].cells[curIdx].colSpan < 0 && args.model.rows[i].cells[curIdx].rowSpan === undefined) {
                        if (!mergeArgs) {
                            mergeArgs = { range: [i, curIdx, i, curIdx] };
                            this.parent.notify(activeCellMergedRange, mergeArgs);
                        }
                        cell = new Object(); mergeArgs.range = mergeArgs.range as number[];
                        Object.assign(cell, getCell(mergeArgs.range[0], mergeArgs.range[1], args.model));
                        if (cell && cell.colSpan && (cell.colSpan > 1 || cell.rowSpan > 1)) {
                            let indexes: number[] = [];
                            indexes[0] = i; indexes[2] = cell.rowSpan > 1 ? i + (cell.rowSpan - 1) : i;
                            mergeArgs.range = mergeArgs.range as number[];
                            if (mergeArgs.range[1] < args.start) {
                                indexes[1] = indexes[3] = mergeArgs.range[1];
                                if (cell.colSpan - count > 1) { indexes[3] += (cell.colSpan - count - 1); }
                            } else {
                                indexes[1] = indexes[3] = args.start;
                                if (cell.colSpan - ((args.end - mergeArgs.range[1]) + 1) > 1) {
                                    indexes[3] += ((cell.colSpan - ((args.end - mergeArgs.range[1]) + 1)) - 1);
                                }
                            }
                            mergeArgsCollection.push(<MergeArgs>{
                                range: indexes, isAction: false, preventRefresh: true, merge: true,
                                type: 'All', skipChecking: true
                            });
                        }
                    }
                    deletedCells[i].cells = args.model.rows[i].cells.splice(args.start, count);
                    mergeArgs = null;
                }
            }
        }
        let deletedModel: RowModel[] = [];
        for (let i: number = args.start; i <= args.end; i++) {
            if (args.model[modelName][args.start]) {
                deletedModel.push(args.model[modelName][args.start]);
                args.model[modelName].splice(args.start, 1);
            } else {
                deletedModel.push({});
            }
            if (i === args.start) { deletedModel[0].index = args.start; }

        }
        mergeArgsCollection.forEach((merge: MergeArgs): void => { this.parent.notify(setMerge, merge); });
        sheetIndex = getSheetIndex(this.parent, (args.model as SheetModel).name);
        let insertArgs: { action: string, insertArgs: InsertDeleteEventArgs } = {
            action: 'refreshNamedRange', insertArgs: {
                startIndex: args.start, endIndex: args.end, modelType: args.modelType,
                isAction: args.isAction, deletedModel: deletedModel, deletedCellsModel: deletedCells,
                activeSheetIndex: this.parent.activeSheetIndex, name: 'delete'
            }
        };
        let eventArgs: { [key: string]: Object } = {
            action: 'refreshInsDelFormula', insertArgs: {
                model: deletedModel, startIndex: args.start, endIndex: args.end, modelType: args.modelType,
                name: 'delete', activeSheetIndex:
                    args.activeSheetIndex, sheetCount: this.parent.sheets.length
            }
        };
        this.parent.notify(workbookFormulaOperation, insertArgs);
        this.parent.notify(workbookFormulaOperation, eventArgs);
        this.parent.notify(deleteAction, {
            startIndex: args.start, endIndex: args.end, modelType: args.modelType,
            isAction: args.isAction, deletedModel: deletedModel, deletedCellsModel: deletedCells,
            activeSheetIndex: this.parent.activeSheetIndex
        });
    }
    private setDeleteInfo(startIndex: number, endIndex: number, totalKey: string, modelType: string = 'Row'): void {
        let total: number = (endIndex - startIndex) + 1; let newRange: number[] = []; let insertRange: number[];
        this.parent.getActiveSheet().ranges.forEach((range: ExtendedRange): void => {
            if (range.info && startIndex < range.info[totalKey]) {
                if (range.info[`delete${modelType}Range`]) {
                    range.info[`delete${modelType}Range`].push([startIndex, endIndex]);
                } else {
                    range.info[`delete${modelType}Range`] = [[startIndex, endIndex]];
                }
                range.info[totalKey] -= total;
                if (range.info[`insert${modelType}Range`]) {
                    range.info[`insert${modelType}Range`] = newRange;
                }
            }
        });
    }
    private addEventListener(): void {
        this.parent.on(deleteModel, this.deleteModel, this);
    }
    /**
     * Destroy workbook delete module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(deleteModel, this.deleteModel);
        }
    }
    /**
     * Get the workbook delete module name.
     */
    public getModuleName(): string {
        return 'workbookdelete';
    }
}