/**
 * Row and column collections for {@link Table} (`table.rows`, `table.columns`).
 *
 * @remarks
 * API-level views over the live `a:tbl`. Every operation delegates to the same structural
 * primitives as {@link Table.addRow} / {@link Table.insertColumnAt}, so the fail-closed
 * merge/ragged rules and `model/out-of-range` errors are unchanged. Handles are live: they
 * resolve their index from the current DOM on each call.
 *
 * @packageDocumentation
 */
import { arrayAt } from '../../core/util/es5-compat';
import { OoxmlElement } from '../../core/xml/dom';
import { Table } from './table';
import { TableCell } from './table-cell';

/**
 * One table row (`a:tr`).
 *
 * @public
 */
export class TableRow {
    private readonly table: Table;
    private readonly tr: OoxmlElement;
    /**
     * @internal
     * @param {Table} table - Owning table.
     * @param {OoxmlElement} tr - Row element.
     */
    constructor(table: Table, tr: OoxmlElement) {
        this.table = table;
        this.tr = tr;
    }
    /**
     * Cells of this row in column order (live {@link TableCell} handles).
     *
     * @throws {RangeError} When the row was removed from the table.
     * @returns {TableCell[]} A new array each call.
     */
    get cells(): TableCell[] {
        const row: number = this.index();
        const out: TableCell[] = [];
        const count: number = this.table.cellCountInRow(row);
        for (let c: number = 0; c < count; c += 1) {
            out.push(this.table.getCell(row, c));
        }
        return out;
    }
    /**
     * Row height in **points** (`a:tr/@h`); `0` when unparsable.
     *
     * @throws {TablesError} On set when the value is not a finite positive number.
     * @returns {number} Height in points.
     */
    get height(): number {
        return this.table.readRowHeight(this.tr);
    }
    set height(value: number) {
        this.table.writeRowHeight(this.tr, value);
    }
    /**
     * @internal
     * @returns {OoxmlElement} Backing `a:tr`.
     */
    getElement(): OoxmlElement {
        return this.tr;
    }
    /**
     * @returns {number} Current zero-based index.
     */
    private index(): number {
        const i: number = this.table.rowElements().indexOf(this.tr);
        if (i < 0) {
            throw new RangeError('Table row is no longer part of the table');
        }
        return i;
    }
}

/**
 * One table column (`a:gridCol` plus the cell at that index in every row).
 *
 * @public
 */
export class TableColumn {
    private readonly table: Table;
    private readonly gridCol: OoxmlElement;
    /**
     * @internal
     * @param {Table} table - Owning table.
     * @param {OoxmlElement} gridCol - Grid column element.
     */
    constructor(table: Table, gridCol: OoxmlElement) {
        this.table = table;
        this.gridCol = gridCol;
    }
    /**
     * Cells of this column in row order (live {@link TableCell} handles).
     *
     * @throws {RangeError} When the column was removed from the table.
     * @returns {TableCell[]} A new array each call.
     */
    get cells(): TableCell[] {
        const column: number = this.index();
        const out: TableCell[] = [];
        for (let r: number = 0; r < this.table.rowCount; r += 1) {
            out.push(this.table.getCell(r, column));
        }
        return out;
    }
    /**
     * Column width in **points** (`a:gridCol/@w`); `0` when unparsable.
     *
     * @throws {TablesError} On set when the value is not a finite positive number.
     * @returns {number} Width in points.
     */
    get width(): number {
        return this.table.readColumnWidth(this.gridCol);
    }
    set width(value: number) {
        this.table.writeColumnWidth(this.gridCol, value);
    }
    /**
     * @internal
     * @returns {OoxmlElement} Backing `a:gridCol`.
     */
    getElement(): OoxmlElement {
        return this.gridCol;
    }
    /**
     * @internal
     * @returns {number} Current zero-based index.
     */
    index(): number {
        const i: number = this.table.columnElements().indexOf(this.gridCol);
        if (i < 0) {
            throw new RangeError('Table column is no longer part of the table');
        }
        return i;
    }
    /**
     * @internal
     * @returns {OoxmlElement[]} The `a:tc` of this column, one per row.
     */
    cellElements(): OoxmlElement[] {
        return this.cells.map((cell: TableCell): OoxmlElement => cell.getElement());
    }
}

/**
 * Live collection of {@link TableRow}, available as `table.rows`.
 *
 * @remarks Indexable (`table.rows[0]`); out-of-range indices yield `undefined`.
 *
 * @public
 */
export class TableRows {
    [index: number]: TableRow;
    private readonly table: Table;
    /**
     * @internal
     * @param {Table} table - Owning table.
     */
    constructor(table: Table) {
        this.table = table;
        return new Proxy(this, {
            /**
             * @param {TableRows} target - Collection.
             * @param {string | symbol} prop - Property.
             * @returns {*} Row for numeric props, otherwise the member.
             */
            get(target: TableRows, prop: string | symbol): unknown {
                if (typeof prop === 'string' && /^(0|[1-9]\d*)$/u.test(prop)) {
                    const tr: OoxmlElement | undefined = arrayAt(target.table.rowElements(), Number(prop));
                    return tr === undefined ? undefined : new TableRow(target.table, tr);
                }
                return Reflect.get(target, prop, target);
            }
        });
    }
    /**
     * Number of rows.
     *
     * @returns {number} Row count.
     */
    get count(): number {
        return this.table.rowCount;
    }
    /**
     * Appends a row. Without an argument a new empty row is created (same defaults as {@link Table.addRow}) and
     * returned. With a {@link TableRow} a deep copy is appended and its index returned.
     *
     * @param {TableRow} row - Optional row to copy (cell count must equal the column count).
     * @returns {TableRow | number} The new row, or the new row's index.
     */
    add(): TableRow;
    add(row: TableRow): number;
    add(row?: TableRow): TableRow | number {
        if (row !== undefined) {
            const at: number = this.count;
            this.table.insertRowClone(at, row.getElement());
            return at;
        }
        this.table.addRow();
        return new TableRow(this.table, arrayAt(this.table.rowElements(), this.count - 1));
    }
    /**
     * Inserts a deep copy of `row` at `index`.
     *
     * @throws {Error} `model/out-of-range` when `index` is not in `0..count`.
     * @param {number} index - Insert position.
     * @param {TableRow} row - Row to copy.
     * @returns {void} Nothing.
     */
    insert(index: number, row: TableRow): void {
        this.table.insertRowClone(index, row.getElement());
    }
    /**
     * Removes the row at `index`.
     *
     * @throws {Error} `model/out-of-range` when `index` is not in `0..count-1`.
     * @param {number} index - Row index.
     * @returns {void} Nothing.
     */
    removeAt(index: number): void {
        this.table.removeRowAt(index);
    }
    /**
     * Removes `row`; no-op when it is not in this table.
     *
     * @param {TableRow} row - Row to remove.
     * @returns {void} Nothing.
     */
    remove(row: TableRow): void {
        const i: number = this.indexOf(row);
        if (i >= 0) {
            this.table.removeRowAt(i);
        }
    }
    /**
     * Zero-based index of `row`, or `-1` when it is not in this table.
     *
     * @param {TableRow} row - Row to find.
     * @returns {number} Index or -1.
     */
    indexOf(row: TableRow): number {
        return this.table.rowElements().indexOf(row.getElement());
    }
    /**
     * Removes every row.
     *
     * @returns {void} Nothing.
     */
    clear(): void {
        while (this.count > 0) {
            this.table.removeRowAt(this.count - 1);
        }
    }
}

/**
 * Live collection of {@link TableColumn}, available as `table.columns`.
 *
 * @remarks Indexable (`table.columns[0]`); out-of-range indices yield `undefined`.
 *
 * @public
 */
export class TableColumns {
    [index: number]: TableColumn;
    private readonly table: Table;
    /**
     * @internal
     * @param {Table} table - Owning table.
     */
    constructor(table: Table) {
        this.table = table;
        return new Proxy(this, {
            /**
             * @param {TableColumns} target - Collection.
             * @param {string | symbol} prop - Property.
             * @returns {*} Column for numeric props, otherwise the member.
             */
            get(target: TableColumns, prop: string | symbol): unknown {
                if (typeof prop === 'string' && /^(0|[1-9]\d*)$/u.test(prop)) {
                    const col: OoxmlElement | undefined = arrayAt(target.table.columnElements(), Number(prop));
                    return col === undefined ? undefined : new TableColumn(target.table, col);
                }
                return Reflect.get(target, prop, target);
            }
        });
    }
    /**
     * Number of columns.
     *
     * @returns {number} Column count.
     */
    get count(): number {
        return this.table.columnCount;
    }
    /**
     * Appends a column. Without an argument a new empty column is created (same defaults as {@link Table.addColumn})
     * and returned. With a {@link TableColumn} a deep copy (grid column and cells) is appended and its index returned.
     *
     * @param {TableColumn} column - Optional column to copy (row count must match).
     * @returns {TableColumn | number} The new column, or the new column's index.
     */
    add(): TableColumn;
    add(column: TableColumn): number;
    add(column?: TableColumn): TableColumn | number {
        if (column !== undefined) {
            const at: number = this.count;
            this.table.insertColumnClone(at, column.getElement(), column.cellElements());
            return at;
        }
        this.table.addColumn();
        return new TableColumn(this.table, arrayAt(this.table.columnElements(), this.count - 1));
    }
    /**
     * Inserts a deep copy of `column` at `index`.
     *
     * @throws {Error} `model/out-of-range` when `index` is not in `0..count`.
     * @param {number} index - Insert position.
     * @param {TableColumn} column - Column to copy.
     * @returns {void} Nothing.
     */
    insert(index: number, column: TableColumn): void {
        this.table.insertColumnClone(index, column.getElement(), column.cellElements());
    }
    /**
     * Removes the column at `index` (grid column and the cell in every row).
     *
     * @throws {Error} `model/out-of-range` when `index` is not in `0..count-1`.
     * @param {number} index - Column index.
     * @returns {void} Nothing.
     */
    removeAt(index: number): void {
        this.table.removeColumnAt(index);
    }
    /**
     * Removes `column`; no-op when it is not in this table.
     *
     * @param {TableColumn} column - Column to remove.
     * @returns {void} Nothing.
     */
    remove(column: TableColumn): void {
        const i: number = this.indexOf(column);
        if (i >= 0) {
            this.table.removeColumnAt(i);
        }
    }
    /**
     * Zero-based index of `column`, or `-1` when it is not in this table.
     *
     * @param {TableColumn} column - Column to find.
     * @returns {number} Index or -1.
     */
    indexOf(column: TableColumn): number {
        return this.table.columnElements().indexOf(column.getElement());
    }
    /**
     * Removes every column.
     *
     * @returns {void} Nothing.
     */
    clear(): void {
        while (this.count > 0) {
            this.table.removeColumnAt(this.count - 1);
        }
    }
}
