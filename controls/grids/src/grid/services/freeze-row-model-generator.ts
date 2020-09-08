import { IModelGenerator, IGrid, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { RowModelGenerator } from '../services/row-model-generator';
import { isBlazor } from '@syncfusion/ej2-base';

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

    public generateRows(data: Object, notifyArgs?: NotifyArgs, virtualRows?: Row<Column>[]): Row<Column>[] {
        let frzCols: number = this.parent.getFrozenColumns();
        frzCols = frzCols && this.parent.isRowDragable() ? frzCols + 1 : frzCols;
        if (this.isFrzLoad % 2 !== 0 && notifyArgs.requestType === 'virtualscroll' && notifyArgs.virtualInfo.sentinelInfo.axis === 'X') {
            this.isFrzLoad++;
            return null;
        }
        let row: Row<Column>[] = this.parent.enableVirtualization ? virtualRows
            : this.rowModelGenerator.generateRows(data, notifyArgs);
        if (isBlazor() && !this.parent.isJsComponent) { return row; }
        for (let i: number = 0, len: number = row.length; i < len; i++) {
            if (this.isFrzLoad % 2 === 0) {
                row[i].cells = row[i].cells.slice(frzCols, row[i].cells.length);
            } else {
                row[i].isFreezeRow = true;
                row[i].cells = row[i].cells.slice(0, frzCols);
            }
        }
        this.isFrzLoad++;
        return row;
    }
}