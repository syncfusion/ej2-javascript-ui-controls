import { IModelGenerator, IGrid } from '../base/interface';
import { AggregateType } from '../base/enum';
import { Row } from '../models/row';
import { AggregateColumnModel, AggregateRowModel } from '../models/aggregate-model';
import { AggregateColumn } from '../models/aggregate';
import { Column } from '../models/column';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { calculateAggregate, getUid } from '../base/util';
import { Group } from '@syncfusion/ej2-data';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';
import { ReturnType } from '../base/type';


/**
 * Summary row model generator
 *
 * @hidden
 */
export class SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {

    protected parent: IGrid;

    /**
     * Constructor for Summary row model generator
     *
     * @param {IGrid} parent - specifies the IGrid
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public getData(): Object {
        const rows: AggregateRowModel[] = [];
        const row: AggregateRowModel[] = this.parent.aggregates.slice();
        for (let i: number = 0; i < row.length; i++) {
            const columns: AggregateColumnModel[] = row[parseInt(i.toString(), 10)].columns.filter((column: AggregateColumnModel) => {
                return !(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)
                    || this.columnSelector(column);
            });
            if (columns.length) {
                rows.push({ columns: columns });
            }
        }
        return rows;
    }

    public columnSelector(column: AggregateColumnModel): boolean {
        return column.footerTemplate !== undefined;
    }

    public getColumns(start?: number): Column[] {
        const columns: Column[] = [];
        if (this.parent.detailTemplate || !isNullOrUndefined(this.parent.childGrid)) {
            columns.push(new Column({}));
        }
        if (this.parent.allowGrouping) {
            for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                columns.push(new Column({}));
            }
        }
        if (this.parent.isRowDragable() && !start) {
            columns.push(new Column({}));
        }
        columns.push(...<Column[]>this.parent.getColumns());
        return columns;
    }

    public generateRows(input: Object[] | Group, args?: Object, start?: number, end?: number,
                        columns?: Column[]): Row<AggregateColumnModel>[] {
        if ((input as Object[]).length === 0) {
            if (args === undefined || !((args as ReturnType).count || (args as { loadSummaryOnEmpty: boolean }).loadSummaryOnEmpty)) {
                return [];
            }
        }
        const data: Object[] = this.buildSummaryData(input, <SummaryData>args);
        const rows: Row<AggregateColumnModel>[] = [];
        const row: AggregateRowModel[] = (<AggregateRowModel[]>this.getData());
        for (let i: number = 0; i < row.length; i++) {
            rows.push(
                this.getGeneratedRow(
                    row[parseInt(i.toString(), 10)], data[parseInt(i.toString(), 10)],
                    args ? (<SummaryData>args).level : undefined, start, end,
                    args ? (<SummaryData>args).parentUid : undefined, columns));
        }
        return rows;
    }

    public getGeneratedRow(
        summaryRow: AggregateRowModel,
        data: Object, raw: number, start: number, end: number, parentUid?: string, columns?: Column[]): Row<AggregateColumnModel> {
        const tmp: Cell<AggregateColumnModel>[] = [];
        let indents: string[] = this.getIndentByLevel();
        const isDetailGridAlone: boolean = !isNullOrUndefined(this.parent.childGrid);
        const indentLength: number = this.parent.getIndentCount();
        if (this.parent.groupSettings.columns.length && this.parent.allowRowDragAndDrop) {
            indents.push('e-indentcelltop');
        }
        else if (this.parent.isRowDragable() && !start) {
            indents = ['e-indentcelltop'];
        }

        const values: Column[] = columns ? columns : this.getColumns(start);
        for (let i: number = 0; i < values.length; i++) {
            tmp.push(
                this.getGeneratedCell(
                    values[parseInt(i.toString(), 10)],
                    summaryRow,
                    i >= indentLength ? this.getCellType() :
                        i === 0 && (this.parent.childGrid || this.parent.detailTemplate) ? CellType.DetailFooterIntent : CellType.Indent,
                    indents[parseInt(i.toString(), 10)], isDetailGridAlone));
        }

        const row: Row<AggregateColumnModel> = new Row<AggregateColumnModel>({ data: data, attributes: { class: 'e-summaryrow' } });
        row.cells = tmp;
        row.uid = getUid('grid-row');
        row.parentUid = parentUid;
        row.isAggregateRow = true;
        row.visible = tmp.some((cell: Cell<AggregateColumnModel>) => cell.isDataCell && cell.visible);
        return row;
    }

    public getGeneratedCell(
        column: Column, summaryRow: AggregateRowModel, cellType?: CellType, indent?: string, isDetailGridAlone?: boolean)
        : Cell<AggregateColumnModel> {
        //Get the summary column by display
        const sColumn: AggregateColumnModel = summaryRow.columns.filter(
            (scolumn: AggregateColumnModel) => scolumn.columnName === column.field)[0];
        const attrs: { 'data-mappinguid': string, 'data-index': number, class?: string } = {
            'data-mappinguid': column.uid, 'data-index': column.index
        };

        if (column.textAlign) {
            const alignmentClassMap: { [key in string]?: string } = { right: 'e-rightalign', left: 'e-leftalign', center: 'e-centeralign', justify: 'e-justifyalign' };
            if (alignmentClassMap[column.textAlign.toLowerCase()]) {
                attrs.class = alignmentClassMap[column.textAlign.toLowerCase()];
            }
        }

        if (indent) {
            attrs.class = indent;
        }

        if (isNullOrUndefined(indent) && isDetailGridAlone) {
            attrs.class = 'e-detailindentcelltop';
        }

        const opt: { [o: string]: Object } = {
            'visible': column.visible,
            'isDataCell': !isNullOrUndefined(sColumn),
            'isTemplate': sColumn && !isNullOrUndefined(sColumn.footerTemplate
                || sColumn.groupFooterTemplate || sColumn.groupCaptionTemplate),
            'column': sColumn || {},
            'attributes': attrs,
            'cellType': cellType
        };
        (<{ headerText?: string }>opt.column).headerText = column.headerText;

        return new Cell<AggregateColumnModel>(opt);
    }

    private buildSummaryData(data: Object[] | Group, args?: SummaryData): Object[] {
        const dummy: Object[] = [];
        const summaryRows: AggregateRowModel[] = <AggregateRowModel[]>this.getData();
        let single: Object = {};
        for (let i: number = 0; i < summaryRows.length; i++) {
            single = {};
            const column: AggregateColumn[] = (summaryRows[parseInt(i.toString(), 10)].columns as AggregateColumn[]);
            for (let j: number = 0; j < column.length; j++) {
                single = this.setTemplate(
                    (column[parseInt(j.toString(), 10)] as AggregateColumn),
                    (args && args.aggregates) ? <Object[]>args : <Object[]>data, single);
            }
            dummy.push(single);
        }

        return dummy;
    }

    protected getIndentByLevel(): string[] {
        return this.parent.groupSettings.columns.map(() => 'e-indentcelltop');
    }

    protected setTemplate(column: AggregateColumn, data: Object[], single: Object | Group): Object {
        let types: AggregateType[] = <AggregateType[]>column.type;
        const helper: Object & { format?: Function } = {};
        const formatFn: Function = column.getFormatter() || ((): Function => (a: Object) => a)();
        const group: Group = (<Group>data);
        if (!(types instanceof Array)) {
            types = <AggregateType[]>[column.type];
        }
        for (let i: number = 0; i < types.length; i++) {
            const key: string = column.field + ' - ' + types[parseInt(i.toString(), 10)].toLowerCase(); const disp: string = column.columnName;
            const disablePageWiseAggregatesGroup: boolean = this.parent.groupSettings.disablePageWiseAggregates
                && this.parent.groupSettings.columns.length && group.items ? true : false;
            const val: Object = (types[parseInt(i.toString(), 10)] !== 'Custom' || disablePageWiseAggregatesGroup) && group.aggregates
                && key in group.aggregates ? group.aggregates[`${key}`] :
                calculateAggregate(types[parseInt(i.toString(), 10)], group.aggregates ? group : <Object[]>data, column, this.parent);
            single[`${disp}`] = single[`${disp}`] || {}; single[`${disp}`][`${key}`] = val;
            single[`${disp}`][types[parseInt(i.toString(), 10)]] = !isNullOrUndefined(val) ? formatFn(val) : ' ';
            if (group.field) { (<Group>single[`${disp}`]).field = group.field; (<Group>single[`${disp}`]).key = group.key; }
        }
        helper.format = column.getFormatter();
        column.setTemplate(helper);
        return single;
    }

    protected getCellType(): CellType {
        return CellType.Summary;
    }
}

export class GroupSummaryModelGenerator extends SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {

    public columnSelector(column: AggregateColumnModel): boolean {
        return column.groupFooterTemplate !== undefined;
    }

    protected getIndentByLevel(level: number = this.parent.groupSettings.columns.length): string[] {
        if (this.parent.allowRowDragAndDrop && this.parent.groupSettings.columns.length) {
            level -= 1;
        }
        return this.parent.groupSettings.columns.map((v: string, indx: number) => indx <= level - 1 ? '' : 'e-indentcelltop');
    }

    protected getCellType(): CellType {
        return CellType.GroupSummary;
    }

}

export class CaptionSummaryModelGenerator extends SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {

    public columnSelector(column: AggregateColumnModel): boolean {
        return column.groupCaptionTemplate !== undefined;
    }

    public getData(): Object {
        const initVal: AggregateRowModel = { columns: [] };
        return [(<AggregateRowModel[]>super.getData()).reduce(
            (prev: AggregateRowModel, cur: AggregateRowModel) => {
                prev.columns = [...prev.columns, ...cur.columns];
                return prev;
            },
            initVal)];
    }

    public isEmpty(): boolean {
        return ((<AggregateRowModel>this.getData()[0]).columns || []).length === 0;
    }

    protected getCellType(): CellType {
        return CellType.CaptionSummary;
    }
}

interface SummaryData {
    aggregates?: Object;
    level?: number;
    parentUid?: string;
}
