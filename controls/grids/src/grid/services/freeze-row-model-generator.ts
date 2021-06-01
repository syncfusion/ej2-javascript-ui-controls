import { IModelGenerator, IGrid, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { freezeTable } from '../base/enum';
import { RowModelGenerator } from '../services/row-model-generator';
import { splitFrozenRowObjectCells } from '../base/util';

/**
 * FreezeRowModelGenerator is used to generate grid data rows with freeze row and column.
 *
 * @hidden
 */
export class FreezeRowModelGenerator implements IModelGenerator<Column> {

    private rowModelGenerator: IModelGenerator<Column>;
    private parent: IGrid;

    constructor(parent: IGrid) {
        this.parent = parent;
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }

    public generateRows(data: Object, notifyArgs?: NotifyArgs, virtualRows?: Row<Column>[]): Row<Column>[] {
        let tableName: freezeTable;
        if (notifyArgs.renderFrozenRightContent || (notifyArgs.renderMovableContent && !this.parent.enableVirtualization)) {
            tableName = 'frozen-right';
        } else if (notifyArgs.renderMovableContent || notifyArgs.isFrozen) {
            tableName = 'movable';
        } else {
            tableName = this.parent.getFrozenLeftCount() ? 'frozen-left' : 'frozen-right';
        }
        if (notifyArgs.requestType === 'virtualscroll' && notifyArgs.virtualInfo.sentinelInfo.axis === 'X') {
            if (tableName !== 'movable') {
                return null;
            }
        }
        const row: Row<Column>[] = this.parent.enableVirtualization && !notifyArgs.isFrozenRowsRender ? virtualRows
            : this.rowModelGenerator.generateRows(data, notifyArgs);
        for (let i: number = 0, len: number = row.length; i < len; i++) {
            row[i].cells = splitFrozenRowObjectCells(this.parent, row[i].cells, tableName);
        }
        return row;
    }
}
