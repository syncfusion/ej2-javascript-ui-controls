import { IModelGenerator, IGrid, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { RowModelGenerator } from '../services/row-model-generator';

/**
 * FreezeRowModelGenerator is used to generate grid data rows with freeze row and column.
 * @hidden
 */
export class FreezeRowModelGenerator implements IModelGenerator<Column> {

    private rowModelGenerator: IModelGenerator<Column>;
    private parent: IGrid;
    private isFrzLoad: number = 1;

    constructor(parent: IGrid) {
        this.parent = parent;
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }

    public generateRows(data: Object, notifyArgs?: NotifyArgs): Row<Column>[] {
        let frzCols: number = this.parent.getFrozenColumns();
        let row: Row<Column>[] = this.rowModelGenerator.generateRows(data, notifyArgs);
        for (let i: number = 0, len: number = row.length; i < len; i++) {
            if (this.isFrzLoad % 2 === 0) {
                row[i].cells = row[i].cells.slice(frzCols, row[i].cells.length);
            } else {
                row[i].cells = row[i].cells.slice(0, frzCols);
            }
        }
        this.isFrzLoad++;
        return row;
    }
}