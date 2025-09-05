import { IModelGenerator, IRow, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { isNullOrUndefined, extend, setValue } from '@syncfusion/ej2-base';
import { Group } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { CellType, Action } from '../base/enum';
import { Cell } from '../models/cell';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { getForeignData, getUid } from '../../grid/base/util';
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 *
 * @hidden
 */
export class GroupModelGenerator extends RowModelGenerator implements IModelGenerator<Column> {

    private rows: Row<Column>[] = [];
    /** @hidden */
    public index: number = 0;
    private infiniteChildCount: number = 0;
    private isInfiniteScroll: boolean;
    private renderInfiniteAgg: boolean = true;

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
            this.infiniteChildCount = 0; this.renderInfiniteAgg = true;
            this.getGroupedRecords(0, data[parseInt(i.toString(), 10)], (<Group>data).level, i, undefined, this.rows.length);
        }
        this.index = 0;
        if (this.parent.isCollapseStateEnabled()) {
            this.ensureRowVisibility();
        }
        return this.rows;
    }

    private getGroupedRecords(
        index: number, data: GroupedData, raw?: Object, parentid?: number, childId?: number, tIndex?: number, parentUid?: string): void {
        const level: number = <number>raw;
        if (isNullOrUndefined(data.items)) {
            if (isNullOrUndefined(data.GroupGuid)) {
                this.rows = this.rows.concat(this.generateDataRows((data as Object[]), index, parentid, this.rows.length, parentUid));
            } else {
                for (let j: number = 0, len: number = (data as Object[]).length; j < len; j++) {
                    this.getGroupedRecords(
                        index, data[parseInt(j.toString(), 10)], data.level, parentid, index, this.rows.length, parentUid);
                }
            }
        } else {
            let preCaption: Row<Column>;
            const captionRow: Row<Column> = this.generateCaptionRow(data, index, parentid, childId, tIndex, parentUid);
            if (this.isInfiniteScroll) {
                preCaption = this.getPreCaption(index, (<{ key?: string | Date }>captionRow.data).key);
            }
            if (!preCaption) {
                this.rows = this.rows.concat(captionRow);
            } else {
                captionRow.uid = preCaption.uid;
            }
            if (data.items && (data.items as Object[]).length) {
                this.getGroupedRecords(index + 1, data.items, data.items.level, parentid, index + 1, this.rows.length, captionRow.uid);
            }
            if (this.parent.aggregates.length && this.isRenderAggregate(captionRow)) {
                const rowCnt: number = this.rows.length;
                this.rows.push(
                    ...(<Row<Column>[]>this.summaryModelGen.generateRows(<Object>data, { level: level, parentUid: captionRow.uid })));
                for (let i: number = rowCnt - 1; i >= 0; i--) {
                    if (this.rows[parseInt(i.toString(), 10)].isCaptionRow) {
                        this.rows[parseInt(i.toString(), 10)].aggregatesCount = this.rows.length - rowCnt;
                    } else if (!this.rows[parseInt(i.toString(), 10)].isCaptionRow && !this.rows[parseInt(i.toString(), 10)].isDataRow) {
                        break;
                    }
                }
            }
            if (preCaption) { this.setInfiniteRowVisibility(preCaption); }
        }
    }

    private isRenderAggregate(data: Row<Column>): boolean {
        if (this.parent.enableInfiniteScrolling) {
            if (!this.renderInfiniteAgg) { return false; }
            this.getPreCaption(data.indent, (data.data as GroupedData).key);
            this.renderInfiniteAgg = (data.data as GroupedData).count === this.infiniteChildCount;
            return this.renderInfiniteAgg;
        }
        return !this.parent.enableInfiniteScrolling;
    }

    private getPreCaption(indent: number, key: string | Date): Row<Column> {
        const rowObj: Row<Column>[] = [...this.parent.getRowsObject(), ...this.rows];
        let preCap: Row<Column>; this.infiniteChildCount = 0;
        let i: number = rowObj.length;
        while (i--) {
            if (rowObj[parseInt(i.toString(), 10)].isCaptionRow && rowObj[parseInt(i.toString(), 10)].indent === indent) {
                const groupKey: string | Date = (<{ key?: string | Date }>rowObj[parseInt(i.toString(), 10)].data).key;
                if ((groupKey && groupKey.toString() === key.toString() && groupKey instanceof Date) || groupKey === key) {
                    preCap = rowObj[parseInt(i.toString(), 10)];
                }
            }
            if (rowObj[parseInt(i.toString(), 10)].indent === indent || rowObj[parseInt(i.toString(), 10)].indent < indent) {
                break;
            }
            if (rowObj[parseInt(i.toString(), 10)].indent === indent + 1) {
                this.infiniteChildCount++;
            }
        }
        return preCap;
    }

    private getCaptionRowCells(field: string, indent: number, data: Object): Cell<Column>[] {
        const cells: Cell<Column>[] = []; let visibles: Cell<Column>[] = [];
        let column: Column = this.parent.getColumnByField(field); const indexes: number[] = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization) {
            column = (<Column[]>this.parent.columns).filter((c: Column) => c.field === field)[0];
        }
        const groupedLen: number = this.parent.groupSettings.columns.length; const gObj: IGrid = this.parent;
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
            const captionCells: Row<Column> = <Row<Column>>this.captionModelGen.generateRows(data)[0];
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
        const cols: Column[] = (!this.parent.enableColumnVirtualization ? [column] : this.parent.getColumns());
        let wFlag: boolean = true;
        for (let j: number = 0; j < cols.length; j++) {
            const tmpFlag: boolean = wFlag && indexes.indexOf(indent) !== -1;
            if (tmpFlag) { wFlag = false; }
            const cellType: CellType = !this.parent.enableColumnVirtualization || tmpFlag ?
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

    /**
     * @param {GroupedData} data - specifies the data
     * @param {number} indent - specifies the indent
     * @param {number} parentID - specifies the parentID
     * @param {number} childID - specifies the childID
     * @param {number} tIndex - specifies the TIndex
     * @param {string} parentUid - specifies the ParentUid
     * @returns {Row<Column>} returns the Row object
     * @hidden
     */
    public generateCaptionRow(
        data: GroupedData, indent: number, parentID?: number, childID?: number, tIndex?: number, parentUid?: string): Row<Column> {
        const options: IRow<Column> = {};
        const records: string = 'records';
        const col: Column = this.parent.getColumnByField(data.field);
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
        options.gSummary = !isNullOrUndefined(data.items[`${records}`]) ? data.items[`${records}`].length : (<Object[]>data.items).length;
        options.uid = getUid('grid-row');
        const row: Row<Column> = new Row<Column>(<{ [x: string]: Object }>options);
        row.indent = indent;
        this.getForeignKeyData(row);
        row.cells = this.getCaptionRowCells(data.field, indent, row.data);
        return row;
    }

    private getForeignKeyData(row: IRow<Column>): void {
        const data: GroupedData = row.data;
        const col: Column = this.parent.getColumnByField(data.field);
        if (col && col.isForeignColumn && col.isForeignColumn()) {
            const fkValue: string | Date = <string | Date>
            (isNullOrUndefined(data.key) ? '' : (col.valueAccessor as Function)(col.foreignKeyValue, getForeignData(col, {}, <string>data.key)[0], col));
            setValue(
                'foreignKey',
                fkValue,
                row.data);
        }
    }

    /**
     * @param {Object[]} data - specifies the data
     * @param {number} indent - specifies the indent
     * @param {number} childID - specifies the childID
     * @param {number} tIndex - specifies the tIndex
     * @param {string} parentUid - specifies the ParentUid
     * @returns {Row<Column>[]} returns the row object
     * @hidden
     */
    public generateDataRows(data: Object[], indent: number, childID?: number, tIndex?: number, parentUid?: string): Row<Column>[] {
        const rows: Row<Column>[] = []; const indexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0, len: number = data.length; i < len; i++ , tIndex++) {
            rows[parseInt(i.toString(), 10)] = this.generateRow(data[parseInt(i.toString(), 10)], this.index, i ? undefined : 'e-firstchildrow', indent, childID, tIndex, parentUid, i);
            for (let j: number = 0; j < indent; j++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(indent) === -1) { continue; }
                rows[parseInt(i.toString(), 10)].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    }

    private generateIndentCell(): Cell<Column> {
        return this.generateCell({} as Column, null, CellType.Indent) as Cell<Column>;
    }

    public refreshRows(input?: Row<Column>[]): Row<Column>[] {
        const indexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0; i < input.length; i++) {
            if (input[parseInt(i.toString(), 10)].isDataRow) {
                input[parseInt(i.toString(), 10)].cells = this.generateCells(input[parseInt(i.toString(), 10)]);
                for (let j: number = 0; j < input[parseInt(i.toString(), 10)].indent; j++) {
                    if (this.parent.enableColumnVirtualization
                        && indexes.indexOf(input[parseInt(i.toString(), 10)].indent) === -1) { continue; }
                    input[parseInt(i.toString(), 10)].cells.unshift(this.generateIndentCell());
                }
            } else {
                const cRow: Row<Column> =
                    this.generateCaptionRow(input[parseInt(i.toString(), 10)].data, input[parseInt(i.toString(), 10)].indent);
                input[parseInt(i.toString(), 10)].cells = cRow.cells;
            }
        }
        return input;
    }

    private setInfiniteRowVisibility(caption: Row<Column>): void {
        if (!caption.isExpand || caption.visible === false) {
            for (const row of this.rows) {
                if (row.parentUid === caption.uid) {
                    row.visible = false;
                    if (row.isCaptionRow) {
                        this.setInfiniteRowVisibility(row);
                    }
                }
            }
        }
    }

    public ensureRowVisibility(): void {
        for (let i: number = 0; i < this.rows.length; i++) {
            const row: Row<object> = this.rows[parseInt(i.toString(), 10)];
            if (!row.isCaptionRow) { continue; }
            for (let j: number = i + 1; j < this.rows.length; j++) {
                const childRow: Row<object> = this.rows[parseInt(j.toString(), 10)];
                if (row.uid === childRow.parentUid) {
                    this.rows[parseInt(j.toString(), 10)].visible = row.isExpand;
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
