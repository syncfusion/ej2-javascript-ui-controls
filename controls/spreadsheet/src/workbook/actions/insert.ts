import { Workbook } from '../base/index';
import { insert, insertModel, ExtendedRange, InsertDeleteModelArgs, workbookFormulaOperation } from '../../workbook/common/index';
import { ModelType } from '../../workbook/common/index';
import { SheetModel, RowModel, CellModel } from '../../workbook/base/index';

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
    private insertModel(args: InsertDeleteModelArgs): void {
        let index: number; let model: RowModel[] = [];
        if (typeof(args.start) === 'number') {
            index = args.start; args.end = args.end || index;
            if (index > args.end) { index = args.end; args.end = args.start; }
            for (let i: number = index; i <= args.end; i++) { model.push({}); }
        } else {
            if (args.start) {
                index = args.start[0].index || 0; model = args.start;
            } else {
                index = 0; model.push({});
            }
        }
        if (args.modelType === 'Row') {
            args.model = <SheetModel>args.model;
            if (!args.model.rows) { args.model.rows = []; }
            args.model.rows.splice(index, 0, ...model);
            //this.setInsertInfo(args.model, index, model.length, 'count');
            if (index > args.model.usedRange.rowIndex) {
                this.parent.setUsedRange(index + (model.length - 1), args.model.usedRange.colIndex);
            } else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex + model.length, args.model.usedRange.colIndex);
            }
        } else if (args.modelType === 'Column') {
            args.model = <SheetModel>args.model;
            if (!args.model.columns) { args.model.columns = []; }
            args.model.columns.splice(index, 0, ...model);
            //this.setInsertInfo(args.model, index, model.length, 'fldLen', 'Column');
            if (index > args.model.usedRange.colIndex) {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, index + (model.length - 1));
            } else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, args.model.usedRange.colIndex + model.length);
            }
            if (!args.model.rows) { args.model.rows = []; }
            let cellModel: CellModel[] = [];
            if (!args.columnCellsModel) { args.columnCellsModel = []; }
            for (let i: number = 0; i < model.length; i++) { cellModel.push({}); }
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
                    args.columnCellsModel[i].cells : cellModel));
            }
        } else {
            if (args.checkCount !== undefined && args.checkCount === this.parent.sheets.length) { return; }
            this.parent.createSheet(index, model); let id: number;
            if (args.activeSheetTab) { this.parent.setProperties({ activeSheetTab: args.activeSheetTab }, true); }
            model.forEach((sheet: SheetModel): void => {
                id = sheet.id;
                this.parent.notify(workbookFormulaOperation, { action: 'addSheet', visibleName: sheet.name, sheetName: 'Sheet' + id,
                    index: id });
            });
        }
        this.parent.notify(insert, { model: model, index: index, modelType: args.modelType, isAction: args.isAction, activeSheetTab:
            args.activeSheetTab, sheetCount: this.parent.sheets.length });
    }
    private setInsertInfo(sheet: SheetModel, startIndex: number, count: number, totalKey: string, modelType: ModelType = 'Row'): void {
        let endIndex: number = count = startIndex + (count - 1);
        sheet.rangeSettings.forEach((range: ExtendedRange): void => {
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
        this.parent.on(insertModel, this.insertModel, this);
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
            this.parent.off(insertModel, this.insertModel);
        }
    }
    /**
     * Get the workbook insert module name.
     */
    public getModuleName(): string {
        return 'workbookinsert';
    }
}