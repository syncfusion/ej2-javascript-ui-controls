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


/**
 * Summary row model generator
 * @hidden
 */
export class SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {

    protected parent: IGrid;

    /**
     * Constructor for Summary row model generator
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public getData(): Object {
        let rows: AggregateRowModel[] = [];
        this.parent.aggregates.slice().forEach((row: AggregateRowModel) => {
            let columns: AggregateColumnModel[] = row.columns.filter((column: AggregateColumnModel) => {
                return !(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)
                    || this.columnSelector(column);
            });
            if (columns.length) {
                rows.push({ columns: columns });
            }
        });
        return rows;
    }

    public columnSelector(column: AggregateColumnModel): boolean {
        return column.footerTemplate !== undefined;
    }

    public getColumns(start?: number, end?: number): Column[] {
        let columns: Column[] = [];
        if (this.parent.allowGrouping) {
            this.parent.groupSettings.columns.forEach((value: string) => columns.push(new Column({})));
        }
        if (this.parent.detailTemplate || !isNullOrUndefined(this.parent.childGrid)) {
            columns.push(new Column({}));
        }
        columns.push(...<Column[]>this.parent.getColumns());
        return isNullOrUndefined(start) ? columns : columns.slice(start, end);
    }

    public generateRows(input: Object[] | Group, args?: Object, start?: number, end?: number): Row<AggregateColumnModel>[] {
        if (this.parent.currentViewData.length === 0) { return []; }
        let data: Object[] = this.buildSummaryData(input, <SummaryData>args);
        let rows: Row<AggregateColumnModel>[] = [];
        (<AggregateRowModel[]>this.getData()).forEach((row: AggregateRowModel, index: number) => {
            rows.push(this.getGeneratedRow(row, data[index], args ? (<SummaryData>args).level : undefined, start, end));
        });
        return rows;
    }

    public getGeneratedRow(summaryRow: AggregateRowModel, data: Object, raw: number, start: number, end: number):
        Row<AggregateColumnModel> {
        let tmp: Cell<AggregateColumnModel>[] = [];
        let indents: string[] = this.getIndentByLevel(raw);
        let isDetailGridAlone: boolean = !isNullOrUndefined(this.parent.childGrid);
        let indentLength: number = this.parent.groupSettings.columns.length + (this.parent.detailTemplate ||
            !isNullOrUndefined(this.parent.childGrid) ? 1 : 0);

        this.getColumns(start, end).forEach((value: Column, index: number) => tmp.push(
            this.getGeneratedCell(
                value,
                summaryRow,
                index >= indentLength ? this.getCellType() : CellType.Indent, indents[index], isDetailGridAlone)
        ));

        let row: Row<AggregateColumnModel> = new Row<AggregateColumnModel>({ data: data, attributes: { class: 'e-summaryrow' } });
        row.cells = tmp;
        row.uid = getUid('grid-row');
        row.visible = tmp.some((cell: Cell<AggregateColumnModel>) => cell.isDataCell && cell.visible);
        return row;
    }

    public getGeneratedCell(
        column: Column, summaryRow: AggregateRowModel, cellType?: CellType, indent?: string, isDetailGridAlone?: boolean)
        : Cell<AggregateColumnModel> {
        //Get the summary column by display
        let sColumn: AggregateColumnModel = summaryRow.columns.filter(
            (scolumn: AggregateColumnModel) => scolumn.columnName === column.field)
        [0];
        let attrs: { style: Object, class?: string } = { 'style': { 'textAlign': column.textAlign } };

        if (indent) {
            attrs.class = indent;
        }

        if (isNullOrUndefined(indent) && isDetailGridAlone) {
            attrs.class = 'e-detailindentcelltop';
        }

        let opt: { [o: string]: Object } = {
            'visible': column.visible,
            'isDataCell': !isNullOrUndefined(sColumn),
            'isTemplate': sColumn && !isNullOrUndefined(sColumn.footerTemplate
                || sColumn.groupFooterTemplate || sColumn.groupCaptionTemplate),
            'column': sColumn || {},
            'attributes': attrs,
            'cellType': cellType
        };

        return new Cell<AggregateColumnModel>(opt);
    }

    private buildSummaryData(data: Object[] | Group, args?: SummaryData): Object[] {
        let dummy: Object[] = [];
        let summaryRows: AggregateRowModel[] = <AggregateRowModel[]>this.getData();
        let single: Object = {};
        let key: string = '';
        summaryRows.forEach((row: AggregateRowModel) => {
            single = {};
            row.columns.forEach((column: AggregateColumn) => {
                single = this.setTemplate(column, (args && args.aggregates) ? <Object[]>args : <Object[]>data, single);
            });
            dummy.push(single);
        });

        return dummy;
    }

    protected getIndentByLevel(data?: number): string[] {
        return this.parent.groupSettings.columns.map(() => 'e-indentcelltop');
    }

    protected setTemplate(column: AggregateColumn, data: Object[], single: Object | Group): Object {
        let types: AggregateType[] = <AggregateType[]>column.type;
        let helper: Object & { format?: Function } = {};
        let formatFn: Function = column.getFormatter() || ((): Function => (a: Object) => a)();
        let group: Group = (<Group>data);
        if (!(types instanceof Array)) {
            types = <AggregateType[]>[column.type];
        }
        types.forEach((type: AggregateType) => {
            let key: string = column.field + ' - ' + type.toLowerCase(); let disp: string = column.columnName;
            let val: Object = type !== 'Custom' && group.aggregates && key in group.aggregates ? group.aggregates[key] :
                calculateAggregate(type, group.aggregates ? group : <Object[]>data, column, this.parent);
            single[disp] = single[disp] || {}; single[disp][key] = val;
            single[disp][type] = !isNullOrUndefined(val) ? formatFn(val) : ' ';
            if (group.field) { (<Group>single[disp]).field = group.field; (<Group>single[disp]).key = group.key; }
        });
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
        let initVal: AggregateRowModel = { columns: [] };
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
}