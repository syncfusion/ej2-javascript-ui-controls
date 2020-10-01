import { isNullOrUndefined, getValue, setValue, isBlazor } from '@syncfusion/ej2-base';
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
 * @hidden
 */
export class RowModelGenerator implements IModelGenerator<Column> {

    //Module declarations
    protected parent: IGrid;

    /**
     * Constructor for header renderer module
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public generateRows(data: Object, args?: { startIndex?: number, requestType?: Action }): Row<Column>[] {
        let rows: Row<Column>[] = [];
        let startIndex: number = this.parent.enableVirtualization && args ? args.startIndex : 0;
        startIndex = this.parent.enableInfiniteScrolling ? this.getInfiniteIndex(args) : startIndex;
        for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++ , startIndex++) {
            rows[i] = this.generateRow(data[i], startIndex);
        }
        return rows;
    }

    protected ensureColumns(): Cell<Column>[] {
        //TODO: generate dummy column for group, detail here;
        let cols: Cell<Column>[] = [];

        if (this.parent.detailTemplate || this.parent.childGrid) {
            let args: object = {};
            this.parent.notify(events.detailIndentCellInfo, args);
            cols.push(this.generateCell(args as Column, null, CellType.DetailExpand));
        }

        if (this.parent.isRowDragable()) {
            cols.push(this.generateCell({} as Column, null, CellType.RowDragIcon));
        }

        return cols;

    }

    protected generateRow(
        data: Object, index: number, cssClass?: string, indent?: number, pid?: number, tIndex?: number, parentUid?: string): Row<Column> {
        let options: IRow<Column> = {};
        options.foreignKeyData = {};
        let isServerRendered: string = 'isServerRendered';
        options.uid = isBlazor() && this.parent[isServerRendered] ? this.parent.getRowUid('grid-row') : getUid('grid-row');
        options.data = data;
        options.index = index;
        options.indent = indent;
        options.tIndex = tIndex;
        options.isDataRow = true;
        options.parentGid = pid;
        options.parentUid = parentUid;
        if (this.parent.isPrinting) {
            if (this.parent.hierarchyPrintMode === 'All') {
                options.isExpand = true;
            } else if (this.parent.hierarchyPrintMode === 'Expanded' && this.parent.expandedRows && this.parent.expandedRows[index]) {
                options.isExpand = this.parent.expandedRows[index].isExpand;
            }
        }
        options.cssClass = cssClass;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        if (isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization && this.parent.selectionModule.checkBoxState) {
            options.isSelected = this.parent.selectionModule.checkBoxState;
            if (options.isSelected && this.parent.selectionModule.selectedRowIndexes.indexOf(index) === -1 ) {
                this.parent.selectionModule.selectedRowIndexes.push(index);
            }
        } else {
            options.isSelected = this.parent.getSelectedRowIndexes().indexOf(index) > -1;
        }
        this.refreshForeignKeyRow(options);
        let cells: Cell<Column>[] = this.ensureColumns();
        let row: Row<Column> = new Row<Column>(<{ [x: string]: Object }>options, this.parent);
        row.cells = cells.concat(this.generateCells(options));
        return row;
    }

    protected refreshForeignKeyRow(options: IRow<Column>): void {
        let foreignKeyColumns: Column[] = this.parent.getForeignKeyColumns();
        for (let i: number = 0; i < foreignKeyColumns.length; i++) {
            setValue(foreignKeyColumns[i].field, getForeignData(foreignKeyColumns[i], options.data), options.foreignKeyData);
        }
    }

    protected generateCells(options: IRow<Column>): Cell<Column>[] {
        let dummies: Column[] = this.parent.getColumns() as Column[];
        let tmp: Cell<Column>[] = [];

        for (let i: number = 0; i < dummies.length; i++) {
            tmp.push(this.generateCell(
                dummies[i], <string>options.uid, isNullOrUndefined(dummies[i].commands) ? undefined : CellType.CommandColumn, null, i,
                options.foreignKeyData));
        }
        return tmp;
    }

    protected generateCell(
        column: Column, rowId?: string, cellType?: CellType, colSpan?: number,
        oIndex?: number, foreignKeyData?: Object): Cell<Column> {
        let opt: ICell<Column> = {
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
            this.refreshForeignKeyRow(input[i]);
            input[i].cells = this.generateCells(input[i]);
        }
        return input;
    }

    private getInfiniteIndex(args: InfiniteScrollArgs): number {
        return args.requestType === 'infiniteScroll' || args.requestType === 'delete' || (args as SaveEventArgs).action === 'add'
            ? args.startIndex : 0;
    }
}