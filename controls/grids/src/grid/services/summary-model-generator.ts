import { IModelGenerator, IGrid } from '../base/interface';
import { AggregateType } from '../base/enum';
import { Row } from '../models/row';
import { AggregateColumnModel, AggregateRowModel } from '../models/aggregate-model';
import { AggregateColumn } from '../models/aggregate';
import { Column } from '../models/column';
import { isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { calculateAggregate, getUid } from '../base/util';
import { Group } from '@syncfusion/ej2-data';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';
import { ReturnType } from '../base/type';


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
        let row: AggregateRowModel[] = this.parent.aggregates.slice();
        for (let i: number = 0; i < row.length; i++) {
            let columns: AggregateColumnModel[] = row[i].columns.filter((column: AggregateColumnModel) => {
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

    public getColumns(start?: number, end?: number): Column[] {
        let columns: Column[] = [];
        if (this.parent.allowGrouping) {
            for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                columns.push(new Column({}));
            }
        }
        if (this.parent.detailTemplate || !isNullOrUndefined(this.parent.childGrid) || (this.parent.isRowDragable() && !start)) {
            columns.push(new Column({}));
        }
        columns.push(...<Column[]>this.parent.getColumns());
        end = end ? end + this.parent.getIndentCount() : end;
        return isNullOrUndefined(start) ? columns : columns.slice(start, end);
    }

    public generateRows(input: Object[] | Group, args?: Object, start?: number, end?: number,
                        columns?: Column[]): Row<AggregateColumnModel>[] {
        if ((input as Object[]).length === 0) {
            if (args === undefined || !(args as ReturnType).count) {
                return [];
            }
        }
        let data: Object[] = this.buildSummaryData(input, <SummaryData>args);
        let rows: Row<AggregateColumnModel>[] = [];
        let row: AggregateRowModel[] = (<AggregateRowModel[]>this.getData());
        for (let i: number = 0; i < row.length; i++) {
            rows.push(
                this.getGeneratedRow(
                    row[i], data[i],
                    args ? (<SummaryData>args).level : undefined, start, end,
                    args ? (<SummaryData>args).parentUid : undefined, columns));
        }
        return rows;
    }

    public getGeneratedRow(
        summaryRow: AggregateRowModel,
        data: Object, raw: number, start: number, end: number, parentUid?: string, columns?: Column[]): Row<AggregateColumnModel> {
        let tmp: Cell<AggregateColumnModel>[] = [];
        let indents: string[] = this.getIndentByLevel(raw);
        let isDetailGridAlone: boolean = !isNullOrUndefined(this.parent.childGrid);
        let indentLength: number = this.parent.getIndentCount();
        if (this.parent.isRowDragable()) {
            indents = ['e-indentcelltop'];
        }

        let values: Column[] = columns ? columns : this.getColumns(start, end);
        for (let i: number = 0; i < values.length; i++) {
            tmp.push(
                this.getGeneratedCell(
                    values[i],
                    summaryRow,
                    i >= indentLength ? this.getCellType() :
                    i < this.parent.groupSettings.columns.length ? CellType.Indent : CellType.DetailFooterIntent,
                    indents[i], isDetailGridAlone));
        }

        let row: Row<AggregateColumnModel> = new Row<AggregateColumnModel>({ data: data, attributes: { class: 'e-summaryrow' } });
        row.cells = tmp;
        if (isBlazor() && this.parent.isServerRendered && !isNullOrUndefined(parentUid)) {
            row.uid = this.parent.getRowUid('grid-row');
        } else {
            row.uid = getUid('grid-row');
        }
        row.parentUid = parentUid;
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
        let attrs: { style: Object, 'e-mappinguid': string, index: number, class?: string } = {
            'style': { 'textAlign': column.textAlign },
            'e-mappinguid': column.uid, index: column.index
        };

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
        (<{ headerText?: string }>opt.column).headerText = column.headerText;

        return new Cell<AggregateColumnModel>(opt);
    }

    private buildSummaryData(data: Object[] | Group, args?: SummaryData): Object[] {
        let dummy: Object[] = [];
        let summaryRows: AggregateRowModel[] = <AggregateRowModel[]>this.getData();
        let single: Object = {};
        let key: string = '';
        for (let i: number = 0; i < summaryRows.length; i++) {
            single = {};
            let column: AggregateColumn[] = (summaryRows[i].columns as AggregateColumn[]);
            for (let j: number = 0; j < column.length; j++) {
                single = this.setTemplate(
                    (column[j] as AggregateColumn), (args && args.aggregates) ? <Object[]>args : <Object[]>data, single);
            }
            dummy.push(single);
        }

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
        for (let i: number = 0; i < types.length; i++) {
            let key: string = column.field + ' - ' + types[i].toLowerCase(); let disp: string = column.columnName;
            let val: Object = types[i] !== 'Custom' && group.aggregates && key in group.aggregates ? group.aggregates[key] :
                calculateAggregate(types[i], group.aggregates ? group : <Object[]>data, column, this.parent);
            single[disp] = single[disp] || {}; single[disp][key] = val;
            single[disp][types[i]] = !isNullOrUndefined(val) ? formatFn(val) : ' ';
            if (group.field) { (<Group>single[disp]).field = group.field; (<Group>single[disp]).key = group.key; }
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
    parentUid?: string;
}