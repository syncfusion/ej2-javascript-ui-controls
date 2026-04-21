import { isNullOrUndefined } from '@syncfusion/ej2-base';
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
 *
 * @hidden
 */
export class SummaryCellRenderer extends CellRenderer implements ICellRenderer<AggregateColumnModel> {

    public element: HTMLElement = this.parent
        .createElement('TD', { className: 'e-summarycell', attrs: { tabindex: '-1', role: 'gridcell' } });

    public getValue(field: string, data: Object, column: AggregateColumnModel): Object {
        const key: string = !isNullOrUndefined(column.type) ?
            column.field + ' - ' + (typeof column.type === 'string' ? column.type.toLowerCase() : '') : column.columnName;
        return data[column.columnName] ? data[column.columnName][`${key}`] : '';
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public evaluate(node: Element, cell: Cell<AggregateColumnModel>, data: Object, attributes?: Object): boolean {
        const column: AggregateColumn = <AggregateColumn>cell.column;
        this.parent.on(refreshAggregateCell, this.refreshWithAggregate(node, cell), this);
        if (!(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)) {
            if (this.parent.rowRenderingMode === 'Vertical') {
                (node as HTMLElement).style.display = 'none';
            }
            return true;
        } else {
            if (this.parent.rowRenderingMode === 'Vertical') {
                (node as HTMLElement).classList.add('e-lastsummarycell');
            }
        }
        const tempObj: { fn: Function, property: string } = column.getTemplate(cell.cellType);
        const tempID: string = '';
        const gColumn: Column = this.parent.getColumnByField(data[column.columnName].field);
        if (!isNullOrUndefined(gColumn)) {
            data[column.columnName].headerText = gColumn.headerText;
            if (gColumn.isForeignColumn()) {
                const fData: object = gColumn.columnData.filter((e: object) => {
                    return e[gColumn.foreignKeyField] === data[column.columnName].key;
                })[0];
                if (fData) {
                    data[column.columnName].foreignKey = fData[gColumn.foreignKeyValue];
                }
            }
        }
        const isNotStringTemplate: boolean = column.footerTemplate ? typeof (column.footerTemplate) !== 'string' && !(column.footerTemplate.prototype &&
            column.footerTemplate.prototype.CSPTemplate) : column.groupFooterTemplate ? typeof (column.groupFooterTemplate) !== 'string' &&
            !(column.groupFooterTemplate.prototype && column.groupFooterTemplate.prototype.CSPTemplate)
            : column.groupCaptionTemplate ? typeof (column.groupCaptionTemplate) !== 'string' && !(column.groupCaptionTemplate.prototype &&
            column.groupCaptionTemplate.prototype.CSPTemplate) : false;
        const isReactCompiler: boolean = this.parent.isReact && isNotStringTemplate;
        const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
            this.parent.parentDetails.parentInstObj.isReact && isNotStringTemplate;
        const isReactPrintGrid: boolean = this.parent.printGridParent && this.parent.printGridParent.isReact;
        if (isReactCompiler || isReactChild || isReactPrintGrid) {
            const prop: object = data[column.columnName];
            if (tempObj.property === 'groupCaptionTemplate' || tempObj.property === 'groupFooterTemplate') {
                const groupKey: string = 'groupKey'; const key: string = 'key';
                prop[`${groupKey}`] = prop[`${key}`];
            }
            tempObj.fn(prop, this.parent, tempObj.property, tempID, null, null, node);
            if (!this.parent.isInitialLoad) {
                this.parent.renderTemplates();
            }
        } else {
            appendChildren(node, tempObj.fn(
                data[column.columnName], this.parent, tempObj.property, tempID, null, null, null, this.parent.root));
        }
        return false;
    }
    public refreshWithAggregate(node: Element, cell: Cell<AggregateColumnModel>): Function {
        const cellNode: Cell<AggregateColumnModel> = cell;
        return (args: { cells: Object[], data: Object, dataUid: string }) => {
            const cell: Cell<AggregateColumnModel> = cellNode;
            const field: string = cell.column.columnName ? cell.column.columnName : null;
            const curCell: Cell<Column> = <Cell<Column>>(!isNullOrUndefined(field) ? args.cells.filter((cell: Cell<AggregateColumn>) =>
                cell.column.columnName === field)[0] : null);
            if (node.parentElement && node.parentElement.getAttribute('data-uid') === args.dataUid && field && curCell &&
                field === (<Cell<Column> & { column: AggregateColumn }>curCell).column.columnName) {
                this.refreshTD(node, curCell, args.data);
            }
        };
    }
}
