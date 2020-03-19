import { Workbook, RowModel } from '../base/index';
import { deleteModel, deleteAction, InsertDeleteModelArgs, updateUsedRange, ExtendedRange } from '../../workbook/common/index';
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
    private deleteModel(args: InsertDeleteModelArgs): void {
        let modelName: string = `${args.modelType.toLowerCase()}s`;
        args.start = <number>args.start;
        if (args.start > args.end) {
            let temp: number = args.start; args.start = args.end; args.end = temp;
        }
        let deletedCells: RowModel[];
        if (args.modelType === 'Row') {
            args.model = <SheetModel>args.model;
            if (args.start > args.model.usedRange.rowIndex) { return; }
            if (args.end > args.model.usedRange.rowIndex) { args.end -= (args.end - args.model.usedRange.rowIndex); }
            args.model.usedRange.rowIndex -= ((args.end - args.start) + 1);
            if (args.model.usedRange.rowIndex < 0) { args.model.usedRange.rowIndex = 0; }
            this.parent.notify(updateUsedRange, { index: args.model.usedRange.rowIndex, update: 'row' });
        } else if (args.modelType === 'Column') {
            args.model = <SheetModel>args.model;
            if (args.start > args.model.usedRange.colIndex) { return; }
            if (args.end > args.model.usedRange.colIndex) { args.end -= (args.end - args.model.usedRange.colIndex); }
            let count: number = (args.end - args.start) + 1;
            args.model.usedRange.colIndex -= count;
            if (args.model.usedRange.colIndex < 0) { args.model.usedRange.colIndex = 0; }
            //this.setDeleteInfo(args.start, args.end, 'fldLen', 'Column');
            this.parent.notify(updateUsedRange, { index: args.model.usedRange.colIndex, update: 'col' });
            deletedCells = [];
            for (let i: number = 0; i <= args.model.usedRange.rowIndex; i++) {
                deletedCells.push({});
                if (args.model.rows[i] && args.model.rows[i].cells) {
                    deletedCells[i].cells = (args.model.rows[i].cells.splice(args.start, count));
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
        this.parent.notify(deleteAction, { startIndex: args.start, endIndex: args.end, modelType: args.modelType,
            isAction: args.isAction, deletedModel: deletedModel, deletedCellsModel: deletedCells });
    }
    private setDeleteInfo(startIndex: number, endIndex: number, totalKey: string, modelType: string = 'Row'): void {
        let total: number = (endIndex - startIndex) + 1; let newRange: number[] = []; let insertRange: number[];
        this.parent.getActiveSheet().rangeSettings.forEach((range: ExtendedRange): void => {
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