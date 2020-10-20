import { isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { AggregateColumnModel } from '../models/models';
import { Cell } from '../models/cell';
import { AggregateColumn } from '../models/aggregate';
import { ICellRenderer } from '../base/interface';
import { appendChildren } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';
import { refreshAggregateCell } from '../base/constant';

/**
 * SummaryCellRenderer class which responsible for building summary cell content. 
 * @hidden
 */
export class SummaryCellRenderer extends CellRenderer implements ICellRenderer<AggregateColumnModel> {

    public element: HTMLElement = this.parent
    .createElement('TD', { className: 'e-summarycell', attrs: { role: 'gridcell', tabindex: '-1' } });

    public getValue(field: string, data: Object, column: AggregateColumnModel): Object {
        let key: string;
        key = !isNullOrUndefined(column.type) ?
            column.field + ' - ' + (typeof column.type === 'string' ? column.type.toLowerCase() : '') : column.columnName;
        return data[column.columnName] ? data[column.columnName][key] : '';
    }

    public evaluate(node: Element, cell: Cell<AggregateColumnModel>, data: Object, attributes?: Object): boolean {
        let column: AggregateColumn = <AggregateColumn>cell.column;
        this.parent.on(refreshAggregateCell, this.refreshWithAggregate(node, cell), this);
        if (!(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)) {
            return true;
        }
        let tempObj: { fn: Function, property: string } = column.getTemplate(cell.cellType);
        let tempID: string = '';
        let gColumn: Column = this.parent.getColumnByField(data[column.columnName].field);
        if (!isNullOrUndefined(gColumn)) {
            data[column.columnName].headerText = gColumn.headerText;
            if (gColumn.isForeignColumn()) {
                let fData: object = gColumn.columnData.filter((e: object) => {
                    return e[gColumn.foreignKeyField] === data[column.columnName].key;
                })[0];
                data[column.columnName].foreignKey = fData[gColumn.foreignKeyValue];
            }
        }
        if (isBlazor()) {
            let guid: string = 'guid';
            tempID = this.parent.element.id + column[guid] + tempObj.property;
        }
        let isReactCompiler: boolean = this.parent.isReact && (column.footerTemplate ?
            typeof (column.footerTemplate) !== 'string' : column.groupFooterTemplate ? typeof (column.groupFooterTemplate) !== 'string'
                : column.groupCaptionTemplate ? typeof (column.groupCaptionTemplate) !== 'string' : false);
        if (isReactCompiler) {
            tempObj.fn(data[column.columnName], this.parent, tempObj.property, tempID, null, null, node);
            this.parent.renderTemplates();
        } else {
            appendChildren(node, tempObj.fn(data[column.columnName], this.parent, tempObj.property, tempID));
        }
        return false;
    }
    public refreshWithAggregate(node: Element, cell: Cell<AggregateColumnModel>): Function {
        let cellNode: Cell<AggregateColumnModel> = cell;
        return (args: { cells: Object[], data: Object, dataUid: string }) => {
            let cell: Cell<AggregateColumnModel> = cellNode;
            let field: string = cell.column.columnName ? cell.column.columnName : null;
            let curCell: Cell<Column> = <Cell<Column>>(!isNullOrUndefined(field) ? args.cells.filter((cell: Cell<AggregateColumn>) =>
                cell.column.columnName === field)[0] : null);
            if (node.parentElement && node.parentElement.getAttribute('data-uid') === args.dataUid && field &&
                field === (<Cell<Column> & { column: AggregateColumn }>curCell).column.columnName) {
                this.refreshTD(node, curCell, args.data);
            }
        };
    }
}