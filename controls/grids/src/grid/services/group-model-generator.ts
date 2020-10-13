import { IModelGenerator, IRow, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { isNullOrUndefined, extend, setValue, isBlazor } from '@syncfusion/ej2-base';
import { Group } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { CellType, Action } from '../base/enum';
import { Cell } from '../models/cell';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { getForeignData, getUid } from '../../grid/base/util';
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
export class GroupModelGenerator extends RowModelGenerator implements IModelGenerator<Column> {

    private rows: Row<Column>[] = [];
    /** @hidden */
    public index: number = 0;
    private prevKey: string;
    private isInfiniteScroll: boolean;

    private summaryModelGen: GroupSummaryModelGenerator;
    private captionModelGen: CaptionSummaryModelGenerator;

    constructor(parent?: IGrid) {
        super(parent);
        this.parent = parent;
        this.summaryModelGen = new GroupSummaryModelGenerator(parent);
        this.captionModelGen = new CaptionSummaryModelGenerator(parent);
    }

    public generateRows(data: { length: number }, args?: { startIndex?: number, requestType?: Action }): Row<Column>[] {
        if (this.parent.groupSettings.columns.length === 0) {
            return super.generateRows(data, args);
        }
        this.isInfiniteScroll = (args.requestType === 'infiniteScroll');
        this.rows = [];
        this.index = this.parent.enableVirtualization || this.isInfiniteScroll ? args.startIndex : 0;
        for (let i: number = 0, len: number = data.length; i < len; i++) {
            this.getGroupedRecords(0, data[i], (<Group>data).level, i, undefined, this.rows.length);
        }
        this.index = 0;
        if (this.parent.isCollapseStateEnabled()) {
            this.ensureRowVisibility();
        }
        return this.rows;
    }

    private getGroupedRecords(
        index: number, data: GroupedData, raw?: Object, parentid?: number, childId?: number, tIndex?: number, parentUid?: string): void {
        let isRenderCaption: boolean = this.isInfiniteScroll  && this.prevKey === data.key;
        let level: number = <number>raw;
        if (isNullOrUndefined(data.items)) {
            if (isNullOrUndefined(data.GroupGuid)) {
                this.rows = this.rows.concat(this.generateDataRows((data as Object[]), index, parentid, this.rows.length, parentUid));
            } else {
                for (let j: number = 0, len: number = (data as Object[]).length; j < len; j++) {
                    this.getGroupedRecords(index, data[j], data.level, parentid, index, this.rows.length, parentUid);
                }
            }
        } else {
            let captionRow: Row<Column> = this.generateCaptionRow(data, index, parentid, childId, tIndex, parentUid);
            if (!isRenderCaption) {
                this.rows = this.rows.concat(captionRow);
            }
            if (data.items && (data.items as Object[]).length) {
                this.getGroupedRecords(index + 1, data.items, data.items.level, parentid, index + 1, this.rows.length, captionRow.uid);
            }
            if (this.parent.aggregates.length) {
                let rowCnt: number = this.rows.length;
                this.rows.push(
                    ...(<Row<Column>[]>this.summaryModelGen.generateRows(<Object>data, { level: level, parentUid: captionRow.uid })));
                for (let i: number = rowCnt - 1; i >= 0; i--) {
                    if (this.rows[i].isCaptionRow) {
                        this.rows[i].aggregatesCount = this.rows.length - rowCnt;
                    } else if (!this.rows[i].isCaptionRow && !this.rows[i].isDataRow) {
                        break;
                    }
                }

            }
        }
        this.prevKey = data.key;
    }

    private getCaptionRowCells(field: string, indent: number, data: Object): Cell<Column>[] {
        let cells: Cell<Column>[] = []; let visibles: Cell<Column>[] = [];
        let column: Column = this.parent.getColumnByField(field); let indexes: number[] = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization) {
            column = (<Column[]>this.parent.columns).filter((c: Column) => c.field === field)[0];
        }
        let groupedLen: number = this.parent.groupSettings.columns.length; let gObj: IGrid = this.parent;
        if (!this.parent.enableColumnVirtualization || indexes.indexOf(indent) !== -1) {
            for (let i: number = 0; i < indent; i++) {
                cells.push(this.generateIndentCell());
            }
            cells.push(this.generateCell({} as Column, null, CellType.Expand));
        }

        indent = this.parent.enableColumnVirtualization ? 1 :
            (this.parent.getVisibleColumns().length + groupedLen + (gObj.detailTemplate || gObj.childGrid ? 1 : 0) -
                indent + (this.parent.getVisibleColumns().length ? -1 : 0));
        //Captionsummary cells will be added here.    
        if (this.parent.aggregates.length && !this.captionModelGen.isEmpty()) {
            let captionCells: Row<Column> = <Row<Column>>this.captionModelGen.generateRows(data)[0];
            extend(data, captionCells.data); let cIndex: number = 0;
            captionCells.cells.some((cell: Cell<Column>, index: number) => { cIndex = index; return cell.visible && cell.isDataCell; });
            visibles = captionCells.cells.slice(cIndex).filter((cell: Cell<Column>) => cell.visible);
            if (captionCells.visible && visibles[0].column.field === this.parent.getVisibleColumns()[0].field) {
                visibles = visibles.slice(1);
            }
            if (this.parent.getVisibleColumns().length === 1) {
                visibles = [];
            }
            indent = indent - visibles.length;
        }
        let cols: Column[] = (!this.parent.enableColumnVirtualization ? [column] : this.parent.getColumns());
        let wFlag: boolean = true;
        for (let j: number = 0; j < cols.length; j++) {
            let tmpFlag: boolean = wFlag && indexes.indexOf(indent) !== -1;
            if (tmpFlag) { wFlag = false; }
            let cellType: CellType = !this.parent.enableColumnVirtualization || tmpFlag ?
                CellType.GroupCaption : CellType.GroupCaptionEmpty;
            indent = this.parent.enableColumnVirtualization && cellType === CellType.GroupCaption ? indent + groupedLen : indent;
            if (gObj.isRowDragable()) {
                indent++;
            }
            cells.push(this.generateCell(column, null, cellType, indent));
        }
        cells.push(...visibles);

        return cells;
    }

    /** @hidden */
    public generateCaptionRow(
        data: GroupedData, indent: number, parentID?: number, childID?: number, tIndex?: number, parentUid?: string): Row<Column> {
        let options: IRow<Column> = {};
        let tmp: Cell<Column>[] = [];
        let records: string = 'records';
        let col: Column = this.parent.getColumnByField(data.field);
        options.data = extend({}, data);
        if (col) {
            (<GroupedData>options.data).field = data.field;
        }
        options.isDataRow = false;
        options.isExpand = !this.parent.groupSettings.enableLazyLoading && !this.parent.isCollapseStateEnabled();
        options.parentGid = parentID;
        options.childGid = childID;
        options.tIndex = tIndex;
        options.isCaptionRow = true;
        options.parentUid = parentUid;
        options.gSummary = !isNullOrUndefined(data.items[records]) ? data.items[records].length : (<Object[]>data.items).length;
        options.uid = isBlazor() && this.parent.isServerRendered ? this.parent.getRowUid('grid-row') : getUid('grid-row');
        let row: Row<Column> = new Row<Column>(<{ [x: string]: Object }>options);
        row.indent = indent;
        this.getForeignKeyData(row);
        row.cells = this.getCaptionRowCells(data.field, indent, row.data);
        return row;
    }

    private getForeignKeyData(row: IRow<Column>): void {
        let data: GroupedData = row.data;
        let col: Column = this.parent.getColumnByField(data.field);
        if (col && col.isForeignColumn && col.isForeignColumn()) {
            let fkValue: string | Date = <string | Date>
            (isNullOrUndefined(data.key) ? '' : (col.valueAccessor as Function)
            (col.foreignKeyValue, getForeignData(col, {}, <string>data.key)[0], col));
            setValue(
                'foreignKey',
                fkValue,
                row.data);
        }
    }

    /** @hidden */
    public generateDataRows(data: Object[], indent: number, childID?: number, tIndex?: number, parentUid?: string): Row<Column>[] {
        let rows: Row<Column>[] = []; let indexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0, len: number = data.length; i < len; i++ , tIndex++) {
            rows[i] = this.generateRow(data[i], this.index, i ? undefined : 'e-firstchildrow', indent, childID, tIndex, parentUid);
            for (let j: number = 0; j < indent; j++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(indent) === -1) { continue; }
                rows[i].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    }

    private generateIndentCell(): Cell<Column> {
        return this.generateCell({} as Column, null, CellType.Indent) as Cell<Column>;
    }

    public refreshRows(input?: Row<Column>[]): Row<Column>[] {
        let indexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0; i < input.length; i++) {
            if (input[i].isDataRow) {
                input[i].cells = this.generateCells(input[i]);
                for (let j: number = 0; j < input[i].indent; j++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(input[i].indent) === -1) { continue; }
                    input[i].cells.unshift(this.generateIndentCell());
                }
            } else {
                let cRow: Row<Column> = this.generateCaptionRow(input[i].data, input[i].indent);
                input[i].cells = cRow.cells;
            }
        }
        return input;
    }

    public ensureRowVisibility(): void {
        for (let i: number = 0; i < this.rows.length; i++) {
            let row: Row<object> = this.rows[i];
            if (!row.isCaptionRow) { continue; }
            for (let j: number = i + 1; j < this.rows.length; j++) {
                let childRow: Row<object> = this.rows[j];
                if (row.uid === childRow.parentUid) {
                    this.rows[j].visible = row.isExpand;
                }
            }
        }
}

}

export interface GroupedData {
    GroupGuid?: string;
    items?: GroupedData;
    field?: string;
    isDataRow?: boolean;
    level?: number;
    key?: string;
    foreignKey?: string;
    count?: number;
    headerText?: string;
}