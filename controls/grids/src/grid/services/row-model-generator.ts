import { isNullOrUndefined, getValue, setValue } from '@syncfusion/ej2-base';
import { IModelGenerator, ICell, IRow, IGrid, InfiniteScrollArgs, SaveEventArgs } from '../base/interface';
import { Row } from '../models/row';
import { CellType, Action } from '../base/enum';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { getUid } from '../base/util';
import { getForeignData } from '../../grid/base/util';
import * as events from '../base/constant';

/**
 * RowModelGenerator is used to generate grid data rows.
 *
 * @hidden
 */
export class RowModelGenerator implements IModelGenerator<Column> {

    //Module declarations
    protected parent: IGrid;

    /**
     * Constructor for header renderer module
     *
     * @param {IGrid} parent - specifies the IGrid
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public generateRows(data: Object, args?: { startIndex?: number, requestType?: Action }): Row<Column>[] {
        const rows: Row<Column>[] = [];
        let startIndex: number = this.parent.enableVirtualization && args ? args.startIndex : 0;
        startIndex = this.parent.enableInfiniteScrolling && args ? this.getInfiniteIndex(args) : startIndex;
        if (this.parent.enableImmutableMode && args && args.startIndex) {
            startIndex = args.startIndex;
        }
        for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++ , startIndex++) {
            rows[parseInt(i.toString(), 10)] = this.generateRow(data[parseInt(i.toString(), 10)], startIndex);
        }
        return rows;
    }

    protected ensureColumns(): Cell<Column>[] {
        //TODO: generate dummy column for group, detail here;
        const cols: Cell<Column>[] = [];

        if (this.parent.detailTemplate || this.parent.childGrid) {
            const args: object = {};
            this.parent.notify(events.detailIndentCellInfo, args);
            cols.push(this.generateCell(args as Column, null, CellType.DetailExpand));
        }

        if (this.parent.isRowDragable()) {
            cols.push(this.generateCell({} as Column, null, CellType.RowDragIcon));
        }

        return cols;

    }

    protected generateRow(
        data: Object, index: number, cssClass?: string, indent?: number, pid?: number, tIndex?: number, parentUid?: string,
        groupDataIndex?: number): Row<Column> {
        const options: IRow<Column> = {};
        options.foreignKeyData = {};
        options.uid = getUid('grid-row');
        options.data = data;
        options.index = index;
        options.indent = indent;
        options.tIndex = tIndex;
        options.isDataRow = true;
        options.parentGid = pid;
        options.parentUid = parentUid;
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            options.groupDataIndex = groupDataIndex;
        }
        if (this.parent.isPrinting) {
            if (this.parent.hierarchyPrintMode === 'All') {
                options.isExpand = true;
            } else if (this.parent.hierarchyPrintMode === 'Expanded' && this.parent.expandedRows && this.parent.expandedRows[parseInt(index.toString(), 10)]) {
                options.isExpand = this.parent.expandedRows[parseInt(index.toString(), 10)].isExpand;
            }
        }
        options.cssClass = cssClass;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        options.isSelected = this.parent.getSelectedRowIndexes().indexOf(index) > -1;
        this.refreshForeignKeyRow(options);
        const cells: Cell<Column>[] = this.ensureColumns();
        const row: Row<Column> = new Row<Column>(<{ [x: string]: Object }>options, this.parent);
        row.cells = this.parent.getFrozenMode() === 'Right' ? this.generateCells(options).concat(cells)
            : cells.concat(this.generateCells(options));
        return row;
    }

    protected refreshForeignKeyRow(options: IRow<Column>): void {
        const foreignKeyColumns: Column[] = this.parent.getForeignKeyColumns();
        for (let i: number = 0; i < foreignKeyColumns.length; i++) {
            setValue(
                foreignKeyColumns[parseInt(i.toString(), 10)].field,
                getForeignData(foreignKeyColumns[parseInt(i.toString(), 10)], options.data), options.foreignKeyData);
        }
    }

    protected generateCells(options: IRow<Column>): Cell<Column>[] {
        const dummies: Column[] = this.parent.getColumns() as Column[];
        const tmp: Cell<Column>[] = [];

        for (let i: number = 0; i < dummies.length; i++) {
            tmp.push(this.generateCell(
                dummies[parseInt(i.toString(), 10)], <string>options.uid,
                isNullOrUndefined(dummies[parseInt(i.toString(), 10)].commands) ? undefined : CellType.CommandColumn, null, i,
                options.foreignKeyData));
        }
        return tmp;
    }

    /**
     *
     * @param {Column} column - Defines column details
     * @param {string} rowId - Defines row id
     * @param {CellType} cellType  - Defines cell type
     * @param {number} colSpan - Defines colSpan
     * @param {number} oIndex - Defines index
     * @param {Object} foreignKeyData - Defines foreign key data
     * @returns {Cell<Column>} returns cell model
     * @hidden
     */
    public generateCell(
        column: Column, rowId?: string, cellType?: CellType, colSpan?: number,
        oIndex?: number, foreignKeyData?: Object): Cell<Column> {
        const opt: ICell<Column> = {
            'visible': column.visible,
            'isDataCell': !isNullOrUndefined(column.field || column.template),
            'isTemplate': !isNullOrUndefined(column.template),
            'rowID': rowId,
            'column': column,
            'cellType': !isNullOrUndefined(cellType) ? cellType : CellType.Data,
            'colSpan': colSpan,
            'commands': column.commands,
            'isForeignKey': column.isForeignColumn && column.isForeignColumn(),
            'foreignKeyData': column.isForeignColumn && column.isForeignColumn() && getValue(column.field, foreignKeyData)
        };

        if (opt.isDataCell || opt.column.type === 'checkbox' || opt.commands) {
            opt.index = oIndex;
        }

        return new Cell<Column>(<{ [x: string]: Object }>opt);
    }

    public refreshRows(input?: Row<Column>[]): Row<Column>[] {
        for (let i: number = 0; i < input.length; i++) {
            this.refreshForeignKeyRow(input[parseInt(i.toString(), 10)]);
            input[parseInt(i.toString(), 10)].cells = this.generateCells(input[parseInt(i.toString(), 10)]);
        }
        return input;
    }

    private getInfiniteIndex(args: InfiniteScrollArgs): number {
        return args.requestType === 'infiniteScroll' || args.requestType === 'delete' || (args as SaveEventArgs).action === 'add'
            ? (isNullOrUndefined(args.startIndex) ? args['index'] : args.startIndex) : 0;
    }
}
