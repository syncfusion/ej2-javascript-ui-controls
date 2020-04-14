import { Workbook, RangeModel, Cell } from '../base/index';
import { insert, insertModel, ExtendedRange, InsertDeleteModelArgs, workbookFormulaOperation } from '../../workbook/common/index';
import { ModelType, insertMerge, MergeArgs, updateSheetFromDataSource, getCellAddress, getCellIndexes } from '../../workbook/common/index';
import { SheetModel, RowModel, CellModel } from '../../workbook/base/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `WorkbookInsert` module is used to insert cells, rows, columns and sheets in to workbook.
 */
export class WorkbookInsert {
    private parent: Workbook;
    /**
     * Constructor for the workbook insert module.
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    private insert(args: InsertDeleteModelArgs): void {
        if (args.modelType !== 'Sheet' && !isNullOrUndefined(args.sheet) && args.sheet !== this.parent.activeSheetIndex) {
            args.model = args.model as SheetModel;
            for (let i: number = 0; i < args.model.ranges.length; i++) {
                if (args.model.ranges[i].dataSource) {
                    let eventArgs: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell>, skipModelUpdate?: boolean } = {
                        sheet: args.model, indexes: [0, 0, 1048576, 16384], promise:
                        new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
                    };
                    this.parent.notify(updateSheetFromDataSource, eventArgs);
                    eventArgs.promise.then(() => {
                        args.model = this.parent.sheets[args.sheet]; this.insertModel(args);
                        eventArgs.skipModelUpdate = true;
                    });
                    return;
                }
            }
            this.insertModel(args);
        } else {
            this.insertModel(args);
        }
    }
    private insertModel(args: InsertDeleteModelArgs): void {
        let index: number; let model: RowModel[] = []; let mergeCollection: MergeArgs[];
        if (typeof(args.start) === 'number') {
            index = args.start; args.end = args.end || index;
            if (index > args.end) { index = args.end; args.end = args.start; }
            for (let i: number = index; i <= args.end; i++) { model.push({}); }
        } else {
            if (args.start) {
                index = args.start[0].index || 0; model = args.start;
                delete args.start[0].index;
            } else {
                index = 0; model.push({});
            }
        }
        if (args.modelType === 'Row') {
            args.model = <SheetModel>args.model;
            if (!args.model.rows) { args.model.rows = []; }
            if (index && !args.model.rows[index - 1]) { args.model.rows[index - 1] = {}; }
            args.model.rows.splice(index, 0, ...model);
            //this.setInsertInfo(args.model, index, model.length, 'count');
            let startCell: number[];
            args.model.ranges.forEach((range: RangeModel): void => {
                startCell = getCellIndexes(range.startCell);
                if (index <= startCell[0]) { startCell[0] += model.length; range.startCell = getCellAddress(startCell[0], startCell[1]); }
            });
            if (index > args.model.usedRange.rowIndex) {
                this.parent.setUsedRange(index + (model.length - 1), args.model.usedRange.colIndex, args.sheet);
            } else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex + model.length, args.model.usedRange.colIndex, args.sheet);
            }
            let curIdx: number = index + model.length;
            for (let i: number = 0; i <= args.model.usedRange.colIndex; i++) {
                if (args.model.rows[curIdx] && args.model.rows[curIdx].cells && args.model.rows[curIdx].cells[i] &&
                    args.model.rows[curIdx].cells[i].rowSpan !== undefined && args.model.rows[curIdx].cells[i].rowSpan < 0 &&
                    args.model.rows[curIdx].cells[i].colSpan === undefined) {
                    this.parent.notify(insertMerge, <MergeArgs>{ range: [curIdx, i, curIdx, i], insertCount: model.length,
                        insertModel: 'Row' });
                }
            }
        } else if (args.modelType === 'Column') {
            args.model = <SheetModel>args.model;
            if (!args.model.columns) { args.model.columns = []; }
            if (index && !args.model.columns[index - 1]) { args.model.columns[index - 1] = {}; }
            args.model.columns.splice(index, 0, ...model);
            //this.setInsertInfo(args.model, index, model.length, 'fldLen', 'Column');
            let startCell: number[];
            args.model.ranges.forEach((range: RangeModel): void => {
                startCell = getCellIndexes(range.startCell);
                if (index <= startCell[1]) { startCell[1] += model.length; range.startCell = getCellAddress(startCell[0], startCell[1]); }
            });
            if (index > args.model.usedRange.colIndex) {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, index + (model.length - 1), args.sheet);
            } else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, args.model.usedRange.colIndex + model.length, args.sheet);
            }
            if (!args.model.rows) { args.model.rows = []; }
            if (!args.columnCellsModel) { args.columnCellsModel = []; }
            mergeCollection = [];
            for (let i: number = 0; i <= args.model.usedRange.rowIndex; i++) {
                if (!args.model.rows[i]) {
                    args.model.rows[i] = { cells: [] };
                } else if (!args.model.rows[i].cells) {
                    args.model.rows[i].cells = [];
                }
                if (index && !args.model.rows[i].cells[index - 1]) {
                    args.model.rows[i].cells[index - 1] = {};
                }
                args.model.rows[i].cells.splice(index, 0, ...(args.columnCellsModel[i] && args.columnCellsModel[i].cells ?
                    args.columnCellsModel[i].cells : this.getEmptyModel(model.length)));
                let curIdx: number = index + model.length;
                if (args.model.rows[i].cells[curIdx] && args.model.rows[i].cells[curIdx].colSpan !== undefined &&
                    args.model.rows[i].cells[curIdx].colSpan < 0 && args.model.rows[i].cells[curIdx].rowSpan === undefined) {
                    mergeCollection.push(<MergeArgs>{ range: [i, curIdx, i, curIdx], insertCount: model.length,
                        insertModel: 'Column' });
                }
            }
            mergeCollection.forEach((mergeArgs: MergeArgs): void => { this.parent.notify(insertMerge, mergeArgs); });
        } else {
            if (args.checkCount !== undefined && args.checkCount === this.parent.sheets.length) { return; }
            this.parent.createSheet(index, model); let id: number;
            if (args.activeSheetIndex) { this.parent.setProperties({ activeSheetIndex: args.activeSheetIndex }, true); }
            model.forEach((sheet: SheetModel): void => {
                id = sheet.id;
                this.parent.notify(workbookFormulaOperation, { action: 'addSheet', visibleName: sheet.name, sheetName: 'Sheet' + id,
                    index: id });
            });
        }
        this.parent.notify(insert, { model: model, index: index, modelType: args.modelType, isAction: args.isAction, activeSheetIndex:
            args.activeSheetIndex, sheetCount: this.parent.sheets.length });
    }
    private getEmptyModel(len: number): CellModel[] {
        let cellModel: CellModel[] = [];
        for (let i: number = 0; i < len; i++) { cellModel.push({}); }
        return cellModel;
    }
    private setInsertInfo(sheet: SheetModel, startIndex: number, count: number, totalKey: string, modelType: ModelType = 'Row'): void {
        let endIndex: number = count = startIndex + (count - 1);
        sheet.ranges.forEach((range: ExtendedRange): void => {
            if (range.info && startIndex < range.info[totalKey]) {
                if (!range.info[`insert${modelType}Range`]) {
                    range.info[`insert${modelType}Range`] = [[startIndex, endIndex]];
                } else {
                    range.info[`insert${modelType}Range`].push([startIndex, endIndex]);
                }
                range.info[totalKey] += ((endIndex - startIndex) + 1);
            }
        });
    }
    private addEventListener(): void {
        this.parent.on(insertModel, this.insert, this);
    }
    /**
     * Destroy workbook insert module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(insertModel, this.insert);
        }
    }
    /**
     * Get the workbook insert module name.
     */
    public getModuleName(): string {
        return 'workbookinsert';
    }
}