/**
 * Table row and cell collections.
 *
 * @public
 */
import { DetachedObjectError } from '../../core/errors/docx-error';
import { Paragraph } from '../document/paragraph';
import { WordDocument } from '../document/document';

/**
 * Host for {@link TableRowCollection}.
 *
 * @private
 */
export interface TableRowCollectionHost<TRow> {
    listRows(): TRow[];
    replaceRows(rows: TRow[]): void;
    createEmptyRow(): TRow;
    bindRow(row: TRow): void;
    /** Minimum rows required after mutation (usually 1). */
    minRowCount(): number;
}

/**
 * Host for {@link TableCellCollection}.
 *
 * @private
 */
export interface TableCellCollectionHost<TCell, TTable = unknown> {
    listCells(): TCell[];
    replaceCells(cells: TCell[]): void;
    createEmptyCell(): TCell;
    bindCell(cell: TCell): void;
    minCellCount(): number;
    /** Nullable owner probe — must not throw when detached. */
    getOwnerTableOrUndefined(): TTable | undefined;
}

/**
 * Mutable collection of table rows.
 *
 * @public
 */
export class TableRowCollection<TRow = unknown> {
    /**
     * Gets the row at the specified zero-based index.
     *
     * @public
     */
    readonly [index: number]: TRow;

    private readonly host: TableRowCollectionHost<TRow>;
    /** Tracks last published index span for cleanup (length getter is live). */
    private indexedCount: number;

    /**
     * @param {TableRowCollectionHost<TRow>} host - The host.
     * @private
     */
    constructor(host: TableRowCollectionHost<TRow>) {
        this.host = host;
        this.indexedCount = 0;
        this.rebuildIndexProperties();
    }

    /**
     * Gets the number of rows in the collection.
     */
    get count(): number {
        return this.host.listRows().length;
    }

    /**
     * Gets the number of rows in the collection. This is an alias of {@link count}.
     */
    get length(): number {
        return this.count;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    syncFromHost(): void {
        this.rebuildIndexProperties();
    }

    /**
     * Appends a new row to the end of the collection.
     *
     * @returns {TRow} Returns the added row.
     */
    add(): TRow {
        return this.insert(this.count);
    }

    /**
     * Inserts a new row at the specified index.
     *
     * @param {number} index - Specifies the zero-based index at which the row is inserted.
     * @returns {TRow} Returns the inserted row.
     */
    insert(index: number): TRow {
        const rows: TRow[] = this.host.listRows().slice();
        if (index < 0 || index > rows.length) {
            throw new RangeError('Row index ' + String(index) + ' is out of range');
        }
        const row: TRow = this.host.createEmptyRow();
        rows.splice(index, 0, row);
        this.host.replaceRows(rows);
        this.host.bindRow(row);
        this.rebuildIndexProperties();
        return row;
    }

    /**
     * Removes the specified row from the collection.
     *
     * @param {TRow} row - Specifies the row to remove.
     * @returns {void} Nothing is returned.
     */
    remove(row: TRow): void {
        const rows: TRow[] = this.host.listRows();
        const at: number = rows.indexOf(row);
        if (at === -1) {
            throw new DetachedObjectError('This row is no longer in its table');
        }
        this.removeAt(at);
    }

    /**
     * Removes the row at the specified index.
     *
     * @param {number} index - Specifies the zero-based index of the row to remove.
     * @returns {void} Nothing is returned.
     */
    removeAt(index: number): void {
        const rows: TRow[] = this.host.listRows().slice();
        if (index < 0 || index >= rows.length) {
            throw new RangeError('Row index ' + String(index) + ' is out of range');
        }
        if (rows.length <= this.host.minRowCount()) {
            throw new DetachedObjectError('A table must retain at least one row');
        }
        rows.splice(index, 1);
        this.host.replaceRows(rows);
        this.rebuildIndexProperties();
    }

    /**
     * Gets the row at the specified index.
     *
     * @param {number} index - Specifies the zero-based index of the row.
     * @returns {TRow} Returns the row at the specified index.
     */
    get(index: number): TRow {
        const rows: TRow[] = this.host.listRows();
        if (index < 0 || index >= rows.length) {
            throw new RangeError('Row index ' + String(index) + ' is out of range');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return rows[index]!;
    }

    /**
     * Gets the zero-based index of the specified row.
     *
     * @param {TRow} row - Specifies the row to locate.
     * @returns {number} Returns the zero-based index of the row, or `-1` when it is not in the collection.
     */
    indexOf(row: TRow): number {
        return this.host.listRows().indexOf(row);
    }

    /**
     * Creates an array that contains the rows of the collection.
     *
     * @returns {TRow[]} Returns a copy of the rows as an array.
     */
    toArray(): TRow[] {
        return this.host.listRows().slice();
    }

    /**
     * Invokes the specified callback for each row in the collection.
     *
     * @param {Function} fn - Specifies the callback that receives each row and its zero-based index.
     * @returns {void} Nothing is returned.
     */
    forEach(fn: (row: TRow, index: number) => void): void {
        const rows: TRow[] = this.host.listRows();
        for (const [i, tRow] of rows.entries()) {
            fn(tRow, i);
        }
    }

    /**
     *  Enables `for (const row of table.rows)`.
     *
     * @returns {IterableIterator<TRow>} - Returns an iterator over the rows.
     */
    [Symbol.iterator](): IterableIterator<TRow> {
        return this.host.listRows().slice()[Symbol.iterator]();
    }

    private rebuildIndexProperties(): void {
        const self: TableRowCollection<TRow> & { [key: number]: TRow } = this as unknown as TableRowCollection<TRow> & {
            [key: number]: TRow | undefined;
        };
        const host: TableRowCollectionHost<TRow> = this.host;
        const rows: TRow[] = host.listRows();
        const nextCount: number = rows.length;
        const clearThrough: number = this.indexedCount > nextCount ? this.indexedCount : nextCount;
        for (let i: number = 0; i < clearThrough + 8; i += 1) {
            if (Object.prototype.hasOwnProperty.call(self, i)) {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete self[i];
            }
        }
        for (let i: number = 0; i < nextCount; i += 1) {
            Object.defineProperty(self, i, {
                get: ((index: number) => {
                    return (): TRow | undefined => {
                        const live: TRow[] = host.listRows();
                        if (index < 0 || index >= live.length) {
                            return undefined;
                        }
                        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                        return live[index]!;
                    };
                })(i),
                enumerable: true,
                configurable: true
            });
        }
        this.indexedCount = nextCount;
    }
}
/**
 * Mutable collection of table cells in a row.
 *
 * @public
 */
export class TableCellCollection<TCell = unknown> {
    /**
     * Gets the cell at the specified zero-based index.
     *
     * @public
     */
    readonly [index: number]: TCell;

    private readonly host: TableCellCollectionHost<TCell>;
    /** Tracks last published index span for cleanup (length getter is live). */
    private indexedCount: number;

    /**
     * @param {TableCellCollectionHost<TCell>} host - The host.
     * @private
     */
    constructor(host: TableCellCollectionHost<TCell>) {
        this.host = host;
        this.indexedCount = 0;
        this.rebuildIndexProperties();
    }

    /**
     * Gets the number of cells in the collection.
     */
    get count(): number {
        return this.host.listCells().length;
    }

    /**
     * Gets the number of cells in the collection. This is an alias of {@link count}.
     */
    get length(): number {
        return this.count;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    syncFromHost(): void {
        this.rebuildIndexProperties();
    }

    /**
     * Appends a new cell to the end of the collection.
     *
     * @returns {TCell} Returns the added cell.
     */
    add(): TCell {
        return this.insert(this.count);
    }

    /**
     * Inserts a new cell at the specified index.
     *
     * @param {number} index - Specifies the zero-based index at which the cell is inserted.
     * @returns {TCell} Returns the inserted cell.
     */
    insert(index: number): TCell {
        const cells: TCell[] = this.host.listCells().slice();
        if (index < 0 || index > cells.length) {
            throw new RangeError('Cell index ' + String(index) + ' is out of range');
        }
        const cell: TCell = this.host.createEmptyCell();
        cells.splice(index, 0, cell);
        this.host.replaceCells(cells);
        this.host.bindCell(cell);
        this.rebuildIndexProperties();
        return cell;
    }

    /**
     * Removes the specified cell from the collection.
     *
     * @param {TCell} cell - Specifies the cell to remove.
     * @returns {void} Nothing is returned.
     */
    remove(cell: TCell): void {
        const cells: TCell[] = this.host.listCells();
        const at: number = cells.indexOf(cell);
        if (at === -1) {
            throw new DetachedObjectError('This cell is no longer in its row');
        }
        this.removeAt(at);
    }

    /**
     * Removes the cell at the specified index.
     *
     * @param {number} index - Specifies the zero-based index of the cell to remove.
     * @returns {void} Nothing is returned.
     */
    removeAt(index: number): void {
        const cells: TCell[] = this.host.listCells().slice();
        if (index < 0 || index >= cells.length) {
            throw new RangeError('Cell index ' + String(index) + ' is out of range');
        }
        if (cells.length <= this.host.minCellCount()) {
            throw new DetachedObjectError('A table row must retain at least one cell');
        }
        cells.splice(index, 1);
        this.host.replaceCells(cells);
        this.rebuildIndexProperties();
    }

    /**
     * Gets the cell at the specified index.
     *
     * @param {number} index - Specifies the zero-based index of the cell.
     * @returns {TCell} Returns the cell at the specified index.
     */
    get(index: number): TCell {
        const cells: TCell[] = this.host.listCells();
        if (index < 0 || index >= cells.length) {
            throw new RangeError('Cell index ' + String(index) + ' is out of range');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return cells[index]!;
    }

    /**
     * Gets the zero-based index of the specified cell.
     *
     * @param {TCell} cell - Specifies the cell to locate.
     * @returns {number} Returns the zero-based index of the cell, or `-1` when it is not in the collection.
     */
    indexOf(cell: TCell): number {
        return this.host.listCells().indexOf(cell);
    }

    /**
     * Creates an array that contains the cells of the collection.
     *
     * @returns {TCell[]} Returns a copy of the cells as an array.
     */
    toArray(): TCell[] {
        return this.host.listCells().slice();
    }

    /**
     * Invokes the specified callback for each cell in the collection.
     *
     * @param {Function} fn - Specifies the callback that receives each cell and its zero-based index.
     * @returns {void} Nothing is returned.
     */
    forEach(fn: (cell: TCell, index: number) => void): void {
        const cells: TCell[] = this.host.listCells();
        for (const [i, tCell] of cells.entries()) {
            fn(tCell, i);
        }
    }

    /**
     *  Enables `for (const cell of row.cells)`.
     *
     * @returns {IterableIterator<TCell>} - Returns an iterator over the cells.
     */
    [Symbol.iterator](): IterableIterator<TCell> {
        return this.host.listCells().slice()[Symbol.iterator]();
    }

    private rebuildIndexProperties(): void {
        const self: TableCellCollection<TCell> & { [key: number]: TCell } = this as unknown as TableCellCollection<TCell> & {
            [key: number]: TCell | undefined;
        };
        const host: TableCellCollectionHost<TCell, unknown> = this.host;
        const cells: TCell[] = host.listCells();
        const nextCount: number = cells.length;
        const clearThrough: number = this.indexedCount > nextCount ? this.indexedCount : nextCount;
        for (let i: number = 0; i < clearThrough + 8; i += 1) {
            if (Object.prototype.hasOwnProperty.call(self, i)) {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete self[i];
            }
        }
        for (let i: number = 0; i < nextCount; i += 1) {
            Object.defineProperty(self, i, {
                get: ((index: number) => {
                    return (): TCell | undefined => {
                        const live: TCell[] = host.listCells();
                        if (index < 0 || index >= live.length) {
                            return undefined;
                        }
                        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                        return live[index]!;
                    };
                })(i),
                enumerable: true,
                configurable: true
            });
        }
        this.indexedCount = nextCount;
    }
}
/**
 * @param {Function} CellCtor - The cell ctor.
 * @returns {TCell} The result.
 * @private
 * Create a cell with a single empty paragraph (construction helper).
 */
export function createEmptyParagraphCellFactory<TCell>(
    CellCtor: new (
        document: WordDocument | undefined,
        blocks: ReadonlyArray<{ type: 'paragraph'; paragraph: Paragraph }>,
    ) => TCell
): TCell {
    const paragraph: Paragraph = new Paragraph(undefined);
    return new CellCtor(undefined, [{ type: 'paragraph', paragraph: paragraph }]);
}
