/**
 * Public worksheet tables collection (`Worksheet.tables`) over the
 * `CT_Table` wire model (TASK-1210) and the `tableParts` / table-part
 * plumbing.
 *
 * Citations:
 * - ECMA-376-1 §18.5 (`table`, `tableColumn(s)`, `tableStyleInfo`)
 * - transitional sml.xsd `CT_Table` / `CT_TableColumns` / `CT_TableColumn` /
 *   `CT_TableStyleInfo` / `ST_TotalsRowFunction` / `ST_TableType`
 * - docs/specs/tables.md (public API + behavior contracts),
 *   docs/ooxml-mapping/tables.md
 *
 * Semantics:
 * - `Table.name` is the schema-required `@displayName` (unique per sheet).
 * - `table@id` values are workbook-unique, allocated as max+1, never
 *   renumbered.
 * - Formulas are opaque text (leading `=` stripped on authoring, never
 *   evaluated per `.agent/policies/security.md`).
 * - The grid stays sparse: `add` does not allocate body or empty header cells.
 *   Column rename still syncs the matching header cell via
 *   `syncHeaderCellForColumn`.
 */

import { formatA1Range, parseA1Range, CellRange } from '../address/cell-address';
import {
    InvalidAddressError,
    InvalidArgumentError,
    InvalidTableError
} from '../core/errors';
import {
    defaultAuthoredTableStyleInfo,
    normalizeTableFormula,
    TableEntry,
    TableColumnEntry,
    TableStyleInfoEntry,
    TotalsRowFunctionValue
} from './table-model';

export { defaultAuthoredTableStyleInfo } from './table-model';

/**
 * SpreadsheetML `ST_TableType` tokens (`worksheet` | `xml` | `queryTable`).
 * Authored tables are always worksheet tables; non-worksheet kinds are load
 * preservation only. Not part of the published package surface (`stripInternal`).
 *
 * @private
 */
export type TableType = 'worksheet' | 'xml' | 'queryTable';

const TABLE_TYPES: ReadonlySet<string> = new Set([
    'worksheet',
    'xml',
    'queryTable'
]);

/**
 * The table kind as read from a file: a known type, or an unrecognized
 * value kept exactly as it appears.
 *
 * @private
 */
export type TableTypeOrRaw = string;

/**
 * True when `value` is one of the defined `ST_TableType` values.
 *
 * @param {string} value - value value.
 * @returns {boolean} True when value is TableType.
 * @private
 */
export function isKnownTableType(value: string): value is TableType {
    return TABLE_TYPES.has(value);
}

/**
 * SpreadsheetML `ST_TotalsRowFunction` tokens used by the table model.
 *
 * @private
 */
export type TotalsRowFunction =
  | 'none'
  | 'sum'
  | 'min'
  | 'max'
  | 'average'
  | 'count'
  | 'countNums'
  | 'stdDev'
  | 'var'
  | 'custom';

const TOTALS_ROW_FUNCTIONS: ReadonlySet<string> = new Set([
    'none',
    'sum',
    'min',
    'max',
    'average',
    'count',
    'countNums',
    'stdDev',
    'var',
    'custom'
]);

/**
 * Map known built-in `ST_TotalsRowFunction` tokens to Excel `SUBTOTAL`
 * function-numbers in the 101–111 band (exclude manually hidden rows).
 * Excel table totals use this band so filtered/hidden body rows do not
 * change the total (ECMA-376-1 §18.17.7.305; MS-OE376 §2.1.710(n)).
 *
 * `none` / `custom` are not mapped — `none` has no formula; `custom` uses
 * `totalsRowFormula` text on the occupied cell instead.
 *
 * @private
 */
const TOTALS_ROW_SUBTOTAL_FN: ReadonlyMap<string, number> = new Map([
    // MS-OE376 §2.1.1123: average 101, countNums 102, count 103, max 104,
    // min 105, stdDev 107, sum 109, var 110 (101–111 = ignore hidden rows).
    // count vs countNums were previously inverted; Excel enforces §2.1.710(n)
    // (totalsRowFunction must match the occupied cell’s SUBTOTAL number).
    ['average', 101],
    ['countNums', 102],
    ['count', 103],
    ['max', 104],
    ['min', 105],
    // product is in ST_TotalsRowFunction in some sources; not in our public set.
    ['product', 106],
    ['stdDev', 107],
    ['stdDevp', 108],
    ['sum', 109],
    ['var', 110],
    ['varp', 111]
]);

/**
 * The totals-row function as read from a file: a known function such as
 * `sum`, or an unrecognized value kept exactly as it appears.
 *
 * @private
 */
export type TotalsRowFunctionOrRaw = string;

/**
 * True when `value` is one of the defined `ST_TotalsRowFunction` values.
 *
 * @param {string} value - value value.
 * @returns {boolean} True when value is TotalsRowFunction.
 * @private
 */
export function isKnownTotalsRowFunction(value: string): value is TotalsRowFunction {
    return TOTALS_ROW_FUNCTIONS.has(value);
}

/**
 * Describes how a table looks, naming its style and choosing whether to
 * emphasize its first column, last column, or banded rows and columns.
 */
export interface TableStyle {
    /**
     * The built-in or custom table style used — for example
     * `'TableStyleMedium9'`.
     */
    name: string | undefined;
    /** Whether the first column is emphasized with special formatting. */
    showFirstColumn: boolean;
    /** Whether the last column is emphasized with special formatting. */
    showLastColumn: boolean;
    /** Whether alternate rows are shaded (banded rows). */
    showRowStripes: boolean;
    /** Whether alternate columns are shaded (banded columns). */
    showColumnStripes: boolean;
}

/**
 * Represents one column of a table, letting you set its name and totals-row
 * settings.
 *
 * @private
 */
export interface TableColumn {
    /**
     * The column's heading text, shown in the header row. Unique within the
     * table.
     *
     * @private
     */
    name: string;
    /**
     * The calculation shown in the totals row, as a built-in function name
     * like `'sum'` or `'average'`.
     *
     * @private
     */
    totalsRowFunction: TotalsRowFunctionOrRaw;
    /**
     * The label shown in the totals row, instead of a calculation.
     *
     * @private
     */
    totalsRowLabel: string | undefined;
    /**
     * The formula used in the totals row, when a custom one replaces the
     * built-in function.
     *
     * @private
     */
    readonly totalsRowFormula: string | undefined;
    /**
     * Whether the totals-row formula is an array formula (one that produces
     * multiple results). Set via {@link TableColumn.setTotalsRowFormula}.
     *
     * @private
     */
    readonly totalsRowFormulaIsArray: boolean;
    /**
     * The formula Excel fills the whole column with when a row is added —
     * for example `=[@Qty]*[@Price]`.
     *
     * @private
     */
    readonly calculatedColumnFormula: string | undefined;
    /**
     * Whether the calculated-column formula is an array formula. Set via
     * {@link TableColumn.setCalculatedColumnFormula}.
     *
     * @private
     */
    readonly calculatedColumnFormulaIsArray: boolean;
    /**
     * Set the formula used in the totals row. An optional leading `=` is
     * stripped; the formula is stored as text and never evaluated.
     *
     * @param text - The formula text, or `undefined` to remove it.
     * @param options.isArray - Whether the formula is an array formula.
     * @private
     */
    setTotalsRowFormula(text: string | undefined, options?: { readonly isArray?: boolean }): void;
    /**
     * Set the formula Excel fills the whole column with. An optional leading
     * `=` is stripped; the formula is stored as text and never evaluated.
     *
     * @param text - The formula text, or `undefined` to remove it.
     * @param options.isArray - Whether the formula is an array formula.
     * @private
     */
    setCalculatedColumnFormula(text: string | undefined, options?: { readonly isArray?: boolean }): void;
}

/**
 * Represents a table in a worksheet, letting you set its name, style, and
 * totals row.
 */
export interface Table {
    /** The table's name, shown in Excel's table tools. */
    name: string;
    /**
     * The cells the table covers, written as an A1-style range — for
     * example `'A1:D10'`.
     */
    readonly range: string;
    /** A note attached to the table; `undefined` when there is none. */
    readonly comment: string | undefined;
    /**
     * The table's kind as read from the file (opaque string). Authored tables
     * are always ordinary worksheet tables. Unknown wire values are kept
     * exactly as read.
     */
    readonly tableType: string;
    /**
     * The number of rows in the table's header. Default `1`.
     */
    readonly headerRowCount: number;
    /**
     * The table's visual style — its color scheme and banding. `undefined`
     * leaves the table unstyled.
     */
    style: TableStyle | undefined;
    /** Whether the table ends with a totals row. */
    totalsRowEnabled: boolean;
    /**
     * Whether the totals row is visible. A declared totals row can be
     * hidden while its column calculations stay in place.
     */
    totalsRowShown: boolean;
    /**
     * The table's columns, in left-to-right order.
     *
     * @private
     */
    readonly columns: ReadonlyArray<TableColumn>;
}

/**
 * Represents the tables on a worksheet, letting you add, list, and remove
 * them.
 */
export interface Tables {
    /** The number of tables on the worksheet. */
    readonly count: number;
    /**
     * Get all tables as a list, in the order they appear on the worksheet.
     *
     * @returns the current tables.
     */
    list(): ReadonlyArray<Table>;
    /**
     * Get the table at a zero-based position, in the order tables appear on
     * the worksheet.
     *
     * @param index - The zero-based position of the table.
     * @returns the table at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): Table;
    /**
     * Add a table over a range of cells. Column headings come from the
     * header row's values (`Column1`, `Column2`, … when empty). Empty header
     * cells are written with those derived names so the sheet matches
     * `tableColumn@name` (required for Excel-safe open). Body cells in the
     * range are not allocated. Set the style, totals row, and column
     * calculations on the returned table. Authored tables are always
     * worksheet tables (`tableType` `'worksheet'`).
     *
     * @param name - The table's name, unique on the worksheet.
     * @param range - The cells the table covers, like `'A1:D10'`. Header cells
     *   that were empty are filled with derived column names; data cells are
     *   not created by this call.
     * @param headerRowCount - The number of header rows; default `1`.
     * @returns the newly created table.
     * @throws InvalidArgumentError when `name`/`range` are empty or
     *         `headerRowCount` is invalid
     * @throws InvalidTableError when the name duplicates an existing table
     * @throws InvalidAddressError when the range is unparseable/inverted
     */
    add(name: string, range: string, headerRowCount?: number): Table;
    /**
     * Remove the table at a zero-based position.
     *
     * @param index - The zero-based position of the table to remove.
     * @throws InvalidArgumentError when the index is out of range
     */
    removeAt(index: number): void;
    /**
     * Remove a table previously returned by this collection.
     *
     * @param table - The table to remove.
     * @throws InvalidArgumentError when the table was not created by this
     *   collection
     */
    remove(table: Table): void;
    /** Remove every table from the worksheet. */
    clear(): void;
    /**
     * Check whether the worksheet has a table with exactly this name.
     *
     * @param name - The table name to look for.
     * @returns `true` when a table with the name exists.
     */
    has(name: string): boolean;
}

/**
 * Host surface the worksheet implementation provides.
 *
 * @private
 */
export interface TablesHost {
    /** Current table entries in file order ({@link WorksheetImpl.internalTables}). */
    entries(): ReadonlyArray<{ relId: string; entry: TableEntry }>;
    /**
     * Replace the full set (see {@link WorksheetImpl.internalSetTables}).
     * `removedRelIds` / `removedPartNames` record package cleanup for dropped tables.
     */
    setEntries(
        entries: ReadonlyArray<{ relId: string; entry: TableEntry }>,
        removedRelIds: ReadonlyArray<string>,
        removedPartNames: ReadonlyArray<string>,
    ): void;
    /** Allocate the next workbook-unique table id. */
    allocateTableId(): number;
    /** Allocate a fresh worksheet relationship id for a new table part. */
    allocateTableRelId(): string;
    /** Current `tableParts` extra attributes. */
    tablePartsExtraAttrsXml(): string;
    /**
     * Record a mutation. When `entry` is provided only that table's part is
     * rewritten on flush (localized mutation); without it the whole tables
     * layer is conservatively marked (collection structure changed).
     */
    markDirty(entry?: TableEntry): void;
    /**
     * Get cell value at row/column coordinates (1-based). Used to derive
     * column names from header row when creating tables without explicit columns.
     */
    getCellValue(row: number, col: number): string | number | undefined;
    /**
     * Write a plain cell value (string/number/clear). Used so totals-row labels
     * appear in sheetData. Excel expects the label text in the totals row cell
     * (in addition to `tableColumn@totalsRowLabel`); omitting it leaves
     * dimension short of `table@ref` and triggers repair on open.
     */
    setCellValue(row: number, col: number, value: string | number | undefined): void;
    /**
     * Write or clear formula text on a sheet cell (never evaluates). Required so
     * built-in / custom totals-row functions match MS-OE376 §2.1.710(n): the
     * occupied cell formula must be `SUBTOTAL(<n>,<ref>)` (or the custom
     * expression) when `totalsRowCount ≠ 0`.
     */
    setCellFormula(row: number, col: number, expression: string | undefined): void;
}

/**
 * Mutable public tables collection implementation.
 *
 * @private
 */
export class TablesImpl implements Tables {
    private readonly host: TablesHost;
    private readonly handles: Map<TableEntry, TableHandle> = new Map<TableEntry, TableHandle>();
    private readonly columnHandles: Map<TableColumnEntry, TableColumnHandle> = new Map<TableColumnEntry, TableColumnHandle>();

    /**
     * Creates a new instance.
     *
     * @param {TablesHost} host - host value.
     */
    public constructor(host: TablesHost) {
        this.host = host;
    }

    /**
     * Gets count.
     *
     * @returns {number} Function result.
     */
    public get count(): number {
        return this.host.entries().length;
    }

    /**
     * list function.
     *
     * @returns {ReadonlyArray<Table>} Function result.
     */
    public list(): ReadonlyArray<Table> {
        return this.host.entries().map(({ entry }: { entry: TableEntry }) => this.handleFor(entry));
    }

    /**
     * get function.
     *
     * @param {number} index - index value.
     * @returns {Table} Function result.
     */
    public get(index: number): Table {
        const entries: ReadonlyArray<{ relId: string; entry: TableEntry; }> = this.host.entries();
        if (!Number.isInteger(index) || index < 0 || index >= entries.length) {
            throw new InvalidArgumentError(
                `Table index ${String(index)} is out of range`
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const found: TableEntry = ((__t: { relId: string; entry: TableEntry; }) => __t == null ? undefined : __t.entry)(entries[index]);
        if (found === undefined) {
            throw new InvalidArgumentError(
                `Table index ${String(index)} is out of range`
            );
        }
        return this.handleFor(found);
    }

    /**
     * add function.
     *
     * @param {string} name - name value.
     * @param {string} range - range value.
     * @param {number} [headerRowCount] - headerRowCount value.
     * @returns {Table} Function result.
     */
    public add(name: string, range: string, headerRowCount?: number): Table {
        const displayName: string = requireNonEmpty(name, 'Table name');
        const normalizedRange: string = normalizeTableRange(range);
        const resolvedHeaderRowCount: number = parseNonNegativeInt(
            headerRowCount,
            'Table headerRowCount',
            1
        );

        const columnInputs: ReadonlyArray<{ readonly name: string; }> = deriveColumnInputs(normalizedRange, this.host);
        assertUniqueColumnNames(columnInputs.map((c: { readonly name: string; }) => c.name));

        this.assertNameAvailable(displayName);

        const entry: TableEntry = createEntryFromInput(
            this.host.allocateTableId(),
            displayName,
            normalizedRange,
            columnInputs,
            {
                comment: undefined,
                tableType: 'worksheet',
                headerRowCount: resolvedHeaderRowCount,
                totalsRowCount: 0,
                totalsRowShown: true,
                // Match Excel create-table: always emit tableStyleInfo
                // (Medium2 + row stripes).
                style: defaultAuthoredTableStyleInfo()
            }
        );

        // Excel requires header-row cell text to match tableColumn@name.
        // When the authored grid had empty headers, write derived ColumnN
        // names so a no-op load/save is Excel-safe.
        materializeHeaderRowSheetCells(entry, this.host);

        const relId: string = this.host.allocateTableRelId();
        this.host.setEntries([...this.host.entries(), { relId, entry }], [], []);
        this.host.markDirty();
        return this.handleFor(entry);
    }

    /**
     * removeAt function.
     *
     * @param {number} index - index value.
     * @returns {void} Nothing.
     */
    public removeAt(index: number): void {
        const entries: { relId: string; entry: TableEntry; }[] = [...this.host.entries()];
        if (!Number.isInteger(index) || index < 0 || index >= entries.length) {
            throw new InvalidArgumentError(
                `Table index ${String(index)} is out of range`
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const removed: { relId: string; entry: TableEntry; } = entries[index];
        if (removed !== undefined) {
            this.removeEntries([removed]);
        }
    }

    /**
     * remove function.
     *
     * @param {Table} table - table value.
     * @returns {void} Nothing.
     */
    public remove(table: Table): void {
        if (!(table instanceof TableHandle)) {
            throw new InvalidArgumentError(
                'remove(table) requires a handle from this collection'
            );
        }
        const live: { relId: string; entry: TableEntry; } = this.host.entries()
            .find(({ entry }: { entry: TableEntry }) => entry === table.entry);
        if (live === undefined) {
            return; // already removed; no-op
        }
        // Use live package relId (flush may densify after prior surgery).
        this.removeEntries([{ relId: live.relId, entry: live.entry }]);
    }

    /**
     * clear function.
     *
     * @returns {void} Nothing.
     */
    public clear(): void {
        const entries: ReadonlyArray<{ relId: string; entry: TableEntry; }> = this.host.entries();
        if (entries.length === 0) {
            return;
        }
        this.removeEntries([...entries]);
    }

    /**
     * has function.
     *
     * @param {string} name - name value.
     * @returns {boolean} Function result.
     */
    public has(name: string): boolean {
        const key: string = tableKey(name);
        return this.host.entries().some(({ entry }: { entry: TableEntry }) => tableKey(entry.displayName) === key);
    }

    /**
     * assertNameAvailable function.
     *
     * @param {string} displayName - displayName value.
     * @returns {void} Nothing.
     */
    private assertNameAvailable(displayName: string): void {
        if (this.has(displayName)) {
            throw new InvalidTableError(
                `A table named "${displayName}" already exists on this worksheet`
            );
        }
    }

    /**
     * removeEntries function.
     *
     * @param {*} removed - removed value.
     * @returns {void} Nothing.
     */
    private removeEntries(
        removed: ReadonlyArray<{ relId: string; entry: TableEntry }>
    ): void {
        const removedKeys: Set<TableEntry> = new Set(removed.map(({ entry }: { entry: TableEntry }) => entry));
        const keep: { relId: string; entry: TableEntry; }[] = this.host.entries().filter(
            ({ entry }: { entry: TableEntry }) => !removedKeys.has(entry)
        );
        // Part names for dropped tables were allocated (or loaded) per relId;
        // the host flush resolves them from its own wiring. We pass relIds only.
        const removedRelIds: string[] = removed.map(({ relId }: { relId: string }) => relId);
        this.host.setEntries(keep, removedRelIds, []);
        for (const { entry } of removed) {
            this.handles.delete(entry);
            for (const col of entry.columns) {
                this.columnHandles.delete(col);
            }
        }
        // Surviving tables must be rewritten after collection surgery: flushed
        // only when entry-dirty. Bare open-path fixtures lack Excel-required
        // autoFilter (and typically styleInfo); ensure both and mark each dirty.
        for (const { entry } of keep) {
            ensureExcelSafeWorksheetTableSurface(entry);
            ensureDefaultTableStyleInfoIfMissing(entry);
            this.host.markDirty(entry);
        }
        this.host.markDirty();
    }

    /**
     * handleFor function.
     *
     * @param {TableEntry} entry - entry value.
     * @returns {Table} Function result.
     */
    private handleFor(entry: TableEntry): Table {
        let handle: TableHandle = this.handles.get(entry);
        if (handle === undefined) {
            const relId: string = ((__t: string) => __t != null ? __t : (''))(((__t: { relId: string; entry: TableEntry; }) => __t == null ? undefined : __t.relId)(this.host.entries()
                .find((t: { relId: string; entry: TableEntry; }) => t.entry === entry)));
            handle = new TableHandle(this, entry, relId, () =>
                this.host.markDirty(entry)
            );
            this.handles.set(entry, handle);
        }
        return handle;
    }

    /**
     * columnHandleFor function.
     *
     * @param {TableColumnEntry} col - col value.
     * @param {TableHandle} owner - owner value.
     * @returns {TableColumn} Function result.
     * @private
     */
    public columnHandleFor(col: TableColumnEntry, owner: TableHandle): TableColumn {
        let handle: TableColumnHandle = this.columnHandles.get(col);
        if (handle === undefined) {
            handle = new TableColumnHandle(
                col,
                owner,
                () => this.host.markDirty(owner.entry)
            );
            this.columnHandles.set(col, handle);
        }
        return handle;
    }

    /**
     * nameTakenExcluding function.
     *
     * @param {string} displayName - displayName value.
     * @param {TableEntry} self - self value.
     * @returns {boolean} Function result.
     * @private
     */
    public nameTakenExcluding(displayName: string, self: TableEntry): boolean {
        const key: string = tableKey(displayName);
        return this.host
            .entries()
            .some(({ entry }: { entry: TableEntry }) => entry !== self && tableKey(entry.displayName) === key);
    }

    /**
     * materializeTotalsRowLabels function.
     *
     * @param {TableEntry} entry - entry value.
     * @returns {void} Nothing.
     * @private
     */
    public materializeTotalsRowLabels(entry: TableEntry): void {
        materializeTotalsRowSheetCells(entry, this.host);
    }

    /**
     * clearTotalsRowLabels function.
     *
     * @param {TableEntry} entry - entry value.
     * @returns {void} Nothing.
     * @private
     */
    public clearTotalsRowLabels(entry: TableEntry): void {
        clearTotalsRowSheetCells(entry, this.host);
    }

    /**
     * Write `tableColumn@name` into the matching header-row sheet cell.
     * Excel repairs the table part when header text and column `@name` diverge.
     *
     * @param {TableEntry} entry - entry value.
     * @param {TableColumnEntry} column - column value.
     * @returns {void} Nothing.
     * @private
     */
    public syncHeaderCellForColumn(entry: TableEntry, column: TableColumnEntry): void {
        syncHeaderCellForColumn(entry, column, this.host);
    }

    /**
     * columnNameTakenExcluding function.
     *
     * @param {TableEntry} table - table value.
     * @param {string} name - name value.
     * @param {TableColumnEntry} self - self value.
     * @returns {boolean} Function result.
     * @private
     */
    public columnNameTakenExcluding(
        table: TableEntry,
        name: string,
        self: TableColumnEntry
    ): boolean {
        const key: string = tableKey(name);
        return table.columns.some((c: TableColumnEntry) => c !== self && tableKey(c.name) === key);
    }
}

/**
 * Case-insensitive comparison key (Excel behavior).
 *
 * @param {string} name - name value.
 * @returns {string} Function result.
 */
function tableKey(name: string): string {
    return name.trim().toLowerCase();
}

/**
 * Validate an authoring totals-row function against `ST_TotalsRowFunction`.
 *
 * @param {string} value - value value.
 * @returns {void} Nothing.
 * @throws InvalidTableError when the value is not a defined member
 */
function assertTotalsRowFunction(value: string): void {
    if (typeof value !== 'string' || !TOTALS_ROW_FUNCTIONS.has(value)) {
        throw new InvalidTableError(
            `Unknown totals row function "${typeof value === 'string' ? value : '(not a string)'}"`
        );
    }
}

/**
 * requireNonEmpty function.
 *
 * @param {*} value - value value.
 * @param {string} label - label value.
 * @returns {string} Function result.
 */
function requireNonEmpty(value: unknown, label: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new InvalidArgumentError(`${label} must be a non-empty string`);
    }
    return value.trim();
}

/**
 * normalizeOptionalString function.
 *
 * @param {*} value - value value.
 * @returns {string | undefined} Function result.
 */
function normalizeOptionalString(value: unknown): string | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return undefined;
    }
    return value;
}

/**
 * Validate and normalize the authoring range; never allocates cells.
 *
 * @param {*} range - range value.
 * @returns {string} Function result.
 * @throws InvalidTableError when not a single rectangle-shaped range
 * @throws InvalidAddressError when unparseable or inverted
 */
function normalizeTableRange(range: unknown): string {
    if (typeof range !== 'string' || range.trim().length === 0) {
        throw new InvalidArgumentError('Table range must be a non-empty string');
    }
    let parsed: CellRange;
    try {
        parsed = parseA1Range(range);
    } catch (err) {
        throw new InvalidAddressError(`Invalid table range "${range}"`, {
            cause: err
        });
    }
    if (parsed.startRow > parsed.endRow || parsed.startCol > parsed.endCol) {
        throw new InvalidAddressError(`Invalid table range "${range}"`);
    }
    return range.trim().toUpperCase();
}

/**
 * parseNonNegativeInt function.
 *
 * @param {*} value - value value.
 * @param {string} label - label value.
 * @param {number} defaultValue - defaultValue value.
 * @returns {number} Function result.
 */
function parseNonNegativeInt(
    value: unknown,
    label: string,
    defaultValue: number
): number {
    if (value === undefined) {
        return defaultValue;
    }
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        throw new InvalidArgumentError(
            `${label} must be a non-negative integer`
        );
    }
    return value;
}

/**
 * Derive column names from header-row cell values, falling back to
 * `Column1..ColumnN` when a header cell is empty.
 *
 * @param {string} range - range value.
 * @param {TablesHost} host - host value.
 * @returns {ReadonlyArray<*>} Function result.
 */
function deriveColumnInputs(
    range: string,
    host: TablesHost
): ReadonlyArray<{ readonly name: string }> {
    const parsed: CellRange = parseA1Range(range);
    const headerRowIndex: number = parsed.startRow; // 1-based
    const columnNames: string[] = [];

    // Read header row cell values from startCol to endCol (all 1-based)
    for (let colIndex: number = parsed.startCol; colIndex <= parsed.endCol; colIndex++) {
        const cellValue: string | number = host.getCellValue(headerRowIndex, colIndex);
        const cellText: string =
      cellValue === undefined || cellValue === '' ? undefined : String(cellValue);
        columnNames.push(cellText || `Column${colIndex - parsed.startCol + 1}`);
    }

    return columnNames.map((name: string) => ({ name }));
}

/**
 * Write derived column names into empty header-row cells so sheet text matches
 * `tableColumn@name`. Does not overwrite non-empty cells. No-op when
 * `headerRowCount` is 0 (headerless table). Body/data rows stay sparse.
 * Microsoft Excel repairs `/xl/tables/tableN.xml` when `table@ref` covers a
 * header row with no matching cell values (see recovery log
 * "Repaired Records: Table from … tableN.xml").
 *
 * @param {TableEntry} entry - entry value.
 * @param {TablesHost} host - host value.
 * @returns {void} Nothing.
 * @private
 */
function materializeHeaderRowSheetCells(entry: TableEntry, host: TablesHost): void {
    if (entry.headerRowCount <= 0) {
        return;
    }
    const range: CellRange = parseA1Range(entry.ref);
    const headerRow: number = range.startRow;
    for (let i: number = 0; i < entry.columns.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const colEntry: TableColumnEntry = entry.columns[i];
        if (colEntry === undefined) {
            continue;
        }
        const col: number = range.startCol + i;
        const existing: string | number = host.getCellValue(headerRow, col);
        if (existing !== undefined && existing !== '') {
            continue;
        }
        host.setCellValue(headerRow, col, colEntry.name);
    }
}

/**
 * Keep the header-row sheet cell aligned with a column's `@name` after rename.
 * Unlike {@link materializeHeaderRowSheetCells}, this **overwrites** the cell
 * for that column index — authoring rename must update both the table model and
 * the visible header text Excel validates on open.
 *
 * @param {TableEntry} entry - entry value.
 * @param {TableColumnEntry} column - column value.
 * @param {TablesHost} host - host value.
 * @returns {void} Nothing.
 * @private
 */
function syncHeaderCellForColumn(
    entry: TableEntry,
    column: TableColumnEntry,
    host: TablesHost
): void {
    if (entry.headerRowCount <= 0) {
        return;
    }
    const colIndex: number = entry.columns.indexOf(column);
    if (colIndex < 0) {
        return;
    }
    const range: CellRange = parseA1Range(entry.ref);
    host.setCellValue(range.startRow, range.startCol + colIndex, column.name);
}

/**
 * assertUniqueColumnNames function.
 *
 * @param {ReadonlyArray<string>} names - names value.
 * @returns {void} Nothing.
 */
function assertUniqueColumnNames(names: ReadonlyArray<string>): void {
    const seen: Set<string> = new Set<string>();
    for (const name of names) {
        const key: string = tableKey(name);
        if (seen.has(key)) {
            throw new InvalidTableError(
                `Duplicate column name "${name}" — column names must be unique within a table`
            );
        }
        seen.add(key);
    }
}

/**
 * normalizeStyleInput function.
 *
 * @param {TableStyle} style - style value.
 * @returns {TableStyleInfoEntry} Function result.
 */
function normalizeStyleInput(style: TableStyle): TableStyleInfoEntry {
    if (style === null || typeof style !== 'object') {
        throw new InvalidArgumentError('Table style must be an object');
    }
    return {
        name: normalizeOptionalString(style.name),
        showFirstColumn: Boolean(style.showFirstColumn),
        showLastColumn: Boolean(style.showLastColumn),
        showRowStripes: Boolean(style.showRowStripes),
        showColumnStripes: Boolean(style.showColumnStripes),
        extraAttrsXml: ''
    };
}

/**
 * Build the default table-level `<autoFilter ref="..."/>` Excel expects on
 * worksheet tables. The filter range covers header + data rows only — never
 * the totals row (ECMA-376-1 §18.5.1.2 / Excel create-table behavior).
 * Does not invent filter columns; empty self-closed element is valid CT_AutoFilter.
 *
 * @param {string} tableRef - tableRef value.
 * @param {number} headerRowCount - headerRowCount value.
 * @param {number} totalsRowCount - totalsRowCount value.
 * @returns {string} Function result.
 * @private
 */
function buildDefaultAutoFilterXml(
    tableRef: string,
    headerRowCount: number,
    totalsRowCount: number
): string {
    const range: CellRange = parseA1Range(tableRef);
    // end of filter = table end minus totals rows (when present)
    let filterEndRow: number = range.endRow;
    if (totalsRowCount > 0) {
        filterEndRow = Math.max(range.startRow, range.endRow - totalsRowCount);
    }
    // When headerRowCount is 0 there is still a valid filter over data cells.
    void headerRowCount;
    const filterRef: string = formatA1Range({
        startRow: range.startRow,
        startCol: range.startCol,
        endRow: filterEndRow,
        endCol: range.endCol
    });
    // Escape is unnecessary for A1 ST_Ref tokens (letters/digits/colon only).
    return `<autoFilter ref="${filterRef}"/>`;
}

/**
 * Keep a library-managed default autoFilter in sync with `ref` / totals.
 * If the bag holds a richer autoFilter (filterColumn children, etc. from
 * load or a prior producer), leave it alone — only rewrite the simple
 * self-closed form we emit on create, or fill in a missing one on authoring.
 *
 * @param {TableEntry} entry - entry value.
 * @returns {void} Nothing.
 * @private
 */
function syncManagedAutoFilter(entry: TableEntry): void {
    const current: string = entry.autoFilterXml;
    const isAbsent: boolean = current === undefined;
    const isManagedDefault: boolean =
    current !== undefined &&
    /^<autoFilter\s+ref="[^"]*"\s*\/>$/.test(current.trim());
    if (!isAbsent && !isManagedDefault) {
        return;
    }
    entry.autoFilterXml = buildDefaultAutoFilterXml(
        entry.ref,
        entry.headerRowCount,
        entry.totalsRowCount
    );
}

/**
 * Excel-hostile bare worksheet tables (no `autoFilter`) are schema-legal but
 * modern Excel removes the table part on repair (observed on
 * `tables-preserve-middle-removal.xlsx` / Content.MSO logs). Library `add`
 * already emits a self-closed autoFilter over header+data. When a table part
 * is rewritten dirty, fill a missing managed autoFilter so the wire stays
 * Excel-safe.
 * Scope: default `worksheet` tables only — never invent filters for
 * `xml` / `queryTable` / unknown `tableType`. Does not replace a richer
 * autoFilter. Does not invent `tableStyleInfo`; collection surgery calls
 * {@link ensureDefaultTableStyleInfoIfMissing} for that.
 *
 * @param {TableEntry} entry - entry value.
 * @returns {void} Nothing.
 * @private
 */
export function ensureExcelSafeWorksheetTableSurface(entry: TableEntry): void {
    if (entry.tableTypeRaw !== undefined && entry.tableTypeRaw.length > 0) {
        return;
    }
    if (entry.tableType !== 'worksheet') {
        return;
    }
    syncManagedAutoFilter(entry);
}

/**
 * Fill default `tableStyleInfo` (Medium2 + row stripes) when a worksheet
 * table has none. Collection surgery applies this so bare survivors match
 * Excel after a remove. Does not replace an authored style.
 *
 * @param {TableEntry} entry - entry value.
 * @returns {void} Nothing.
 * @private
 */
export function ensureDefaultTableStyleInfoIfMissing(entry: TableEntry): void {
    if (entry.tableTypeRaw !== undefined && entry.tableTypeRaw.length > 0) {
        return;
    }
    if (entry.tableType !== 'worksheet') {
        return;
    }
    if (entry.styleInfo === undefined) {
        entry.styleInfo = defaultAuthoredTableStyleInfo();
    }
}

/**
 * Escape a table or column name for use inside a structured reference.
 * Bracket characters in names are doubled (Excel structured-ref rules).
 *
 * @param {string} name - name value.
 * @returns {string} Function result.
 * @private
 */
function escapeStructuredRefName(name: string): string {
    return name.replace(/\]/g, ']]').replace(/\[/g, '[[');
}

/**
 * Structured-reference argument for a totals-row SUBTOTAL formula:
 * `{displayName}[{columnName}]` when there is at least one body data row.
 * Excel-native table totals (verified against Excel 16.0 wire) use this form
 * rather than an A1 body range — e.g. `SUBTOTAL(109,T1_[H3])` when
 * `displayName="T1_"` and column `name="H3"` (MS-OE376 §2.1.710(n)).
 * Falls back to `name` when `displayName` is empty. Returns `undefined`
 * when the column is missing or the table has no data rows under the header.
 *
 * @param {TableEntry} entry - entry value.
 * @param {number} columnIndex - columnIndex value.
 * @returns {string | undefined} Function result.
 * @private
 */
function totalsDataColumnStructuredRef(
    entry: TableEntry,
    columnIndex: number
): string | undefined {
    const range: CellRange = parseA1Range(entry.ref);
    const headerRows: number = Math.max(0, entry.headerRowCount);
    const totalsRows: number = Math.max(0, entry.totalsRowCount);
    const dataStartRow: number = range.startRow + headerRows;
    const dataEndRow: number = range.endRow - totalsRows;
    if (dataEndRow < dataStartRow) {
        return undefined;
    }
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    const colEntry: TableColumnEntry = entry.columns[columnIndex];
    if (colEntry === undefined) {
        return undefined;
    }
    const rawToken: string =
    entry.displayName.length > 0 ? entry.displayName : entry.name;
    const tableToken: string = rawToken === undefined ? '' : rawToken;
    if (tableToken.length === 0 || colEntry.name.length === 0) {
        return undefined;
    }
    return `${escapeStructuredRefName(tableToken)}[${escapeStructuredRefName(colEntry.name)}]`;
}

/**
 * True when this column would cause materializeTotalsRowSheetCells to write
 * a label and/or formula into the totals row.
 *
 * @param {TableColumnEntry} colEntry - colEntry value.
 * @returns {boolean} Function result.
 * @private
 */
function columnMaterializesTotalsCell(colEntry: TableColumnEntry): boolean {
    const fn: string =
    colEntry.totalsRowFunctionRaw != null
        ? colEntry.totalsRowFunctionRaw
        : colEntry.totalsRowFunction;
    if (fn === 'custom') {
        return (
            (colEntry.totalsRowFormula !== undefined &&
        colEntry.totalsRowFormula.length > 0) ||
      (colEntry.totalsRowLabel !== undefined && colEntry.totalsRowLabel.length > 0)
        );
    }
    if (fn !== 'none' && TOTALS_ROW_SUBTOTAL_FN.has(fn)) {
        return true;
    }
    return (
        colEntry.totalsRowLabel !== undefined && colEntry.totalsRowLabel.length > 0
    );
}

/**
 * Materialize totals-row sheet cells for the current totals row (last row of
 * `table@ref` when totals are on):
 * - `none` + label → plain text cell (no formula)
 * - built-in function → `SUBTOTAL(<101–111>,{displayName}[{column}])`
 * structured reference on the cell (Excel-native form; MS-OE376 §2.1.710(n);
 * does not evaluate)
 * - `custom` → sheet formula = `totalsRowFormula` text
 * No-op when totals are off — clearing on disable is
 * {@link clearTotalsRowSheetCells}.
 *
 * @param {TableEntry} entry - entry value.
 * @param {TablesHost} host - host value.
 * @returns {void} Nothing.
 * @private
 */
function materializeTotalsRowSheetCells(entry: TableEntry, host: TablesHost): void {
    if (entry.totalsRowCount <= 0) {
        return;
    }
    const range: CellRange = parseA1Range(entry.ref);
    const totalsRow: number = range.endRow;
    for (let i: number = 0; i < entry.columns.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const colEntry: TableColumnEntry = entry.columns[i];
        if (colEntry === undefined) {
            continue;
        }
        const col: number = range.startCol + i;
        const fn: string =
      colEntry.totalsRowFunctionRaw != null
          ? colEntry.totalsRowFunctionRaw
          : colEntry.totalsRowFunction;
        const label: string = colEntry.totalsRowLabel;
        const hasLabel: boolean = label !== undefined && label.length > 0;

        if (fn === 'custom') {
            const formulaText: string = colEntry.totalsRowFormula;
            if (formulaText !== undefined && formulaText.length > 0) {
                host.setCellFormula(totalsRow, col, formulaText);
            } else if (hasLabel) {
                host.setCellValue(totalsRow, col, label);
            }
            continue;
        }

        const subtotalNum: number = TOTALS_ROW_SUBTOTAL_FN.get(fn);
        if (subtotalNum !== undefined) {
            const dataRef: string = totalsDataColumnStructuredRef(entry, i);
            if (dataRef !== undefined) {
                // Expression without leading "=" — Cell.formula / normalize strips it.
                host.setCellFormula(
                    totalsRow,
                    col,
                    `SUBTOTAL(${String(subtotalNum)},${dataRef})`
                );
            }
            continue;
        }

        // none (or unknown raw): label text only; no formula per OE376(n).
        if (hasLabel) {
            host.setCellValue(totalsRow, col, label);
        }
    }
}

/**
 * After totals are disabled (ref already shrunk), clear sheet cells that held
 * library-written totals labels/formulas on the former totals row (`endRow + 1`).
 *
 * @param {TableEntry} entry - entry value.
 * @param {TablesHost} host - host value.
 * @returns {void} Nothing.
 * @private
 */
function clearTotalsRowSheetCells(entry: TableEntry, host: TablesHost): void {
    const range: CellRange = parseA1Range(entry.ref);
    const clearedRow: number = range.endRow + 1;
    for (let i: number = 0; i < entry.columns.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const colEntry: TableColumnEntry = entry.columns[i];
        if (colEntry === undefined) {
            continue;
        }
        if (columnMaterializesTotalsCell(colEntry)) {
            // Clear value and formula so leftover SUBTOTAL cells do not outlive the table.
            host.setCellFormula(clearedRow, range.startCol + i, undefined);
            host.setCellValue(clearedRow, range.startCol + i, undefined);
        }
    }
}

/**
 * createEntryFromInput function.
 *
 * @param {number} id - id value.
 * @param {string} displayName - displayName value.
 * @param {string} range - range value.
 * @param {ReadonlyArray<*>} columnInputs - columnInputs value.
 * @param {*} options - options value.
 * @returns {TableEntry} Function result.
 */
function createEntryFromInput(
    id: number,
    displayName: string,
    range: string,
    columnInputs: ReadonlyArray<{ readonly name: string }>,
    options: {
        comment: string | undefined;
        tableType: TableType;
        headerRowCount: number;
        totalsRowCount: number;
        totalsRowShown: boolean;
        style: TableStyleInfoEntry | undefined;
    }
): TableEntry {
    const columns: TableColumnEntry[] = columnInputs.map((column: { readonly name: string; }, i: number) => {
        return {
            id: i + 1,
            name: column.name,
            uniqueName: undefined,
            totalsRowFunction: 'none' as TotalsRowFunctionValue,
            totalsRowFunctionRaw: undefined,
            totalsRowLabel: undefined,
            queryTableFieldId: undefined,
            calculatedColumnFormula: undefined,
            calculatedColumnFormulaArray: false,
            totalsRowFormula: undefined,
            totalsRowFormulaArray: false,
            xmlColumnPrXml: undefined,
            extLstXml: undefined,
            headerRowDxfId: undefined,
            dataDxfId: undefined,
            totalsRowDxfId: undefined,
            headerRowCellStyle: undefined,
            dataCellStyle: undefined,
            totalsRowCellStyle: undefined,
            extraAttrsXml: ''
        };
    });
    const entry: TableEntry = {
        id,
        displayName,
        name: displayName, // Excel mirrors displayName into @name on create
        ref: range,
        comment: options.comment,
        tableType: options.tableType,
        tableTypeRaw: undefined,
        headerRowCount: options.headerRowCount,
        insertRow: false,
        insertRowShift: false,
        totalsRowCount: options.totalsRowCount,
        totalsRowShown: options.totalsRowShown,
        published: false,
        connectionId: undefined,
        headerRowDxfId: undefined,
        dataDxfId: undefined,
        totalsRowDxfId: undefined,
        headerRowBorderDxfId: undefined,
        tableBorderDxfId: undefined,
        totalsRowBorderDxfId: undefined,
        headerRowCellStyle: undefined,
        dataCellStyle: undefined,
        totalsRowCellStyle: undefined,
        columns,
        tableColumnsExtraAttrsXml: '',
        styleInfo: options.style,
        // Excel-created worksheet tables always carry autoFilter over header+data.
        // Omitting it is schema-legal but triggers repair on open in Microsoft Excel.
        autoFilterXml: buildDefaultAutoFilterXml(
            range,
            options.headerRowCount,
            options.totalsRowCount
        ),
        sortStateXml: undefined,
        extLstXml: undefined,
        unknownChildrenXml: undefined,
        extraAttrsXml: ''
    };
    return entry;
}

/** Live {@link Table} implementation. @private */
export class TableHandle implements Table {
    public readonly entry: TableEntry;
    /**
     * Relationship id of the backing table part at handle creation.
     * Flush may densify table rIds after collection surgery; removal uses
     * the live host entry, not this snapshot.
     *
     * @private
     */
    public readonly entryRelId: string;
    private readonly owner: TablesImpl;
    private readonly markDirty: () => void;

    /**
     * Creates a new instance.
     *
     * @param {TablesImpl} owner - owner value.
     * @param {TableEntry} entry - entry value.
     * @param {string} entryRelId - entryRelId value.
     * @param {*} markDirty - markDirty value.
     */
    public constructor(
        owner: TablesImpl,
        entry: TableEntry,
        entryRelId: string,
        markDirty: () => void
    ) {
        this.owner = owner;
        this.entry = entry;
        this.entryRelId = entryRelId;
        this.markDirty = markDirty;
    }

    /**
     * Gets name.
     *
     * @returns {string} Function result.
     */
    public get name(): string {
        return this.entry.displayName;
    }

    /**
     * name function.
     *
     * @param {string} value - value value.
     */
    public set name(value: string) {
        const displayName: string = requireNonEmpty(value, 'Table name');
        if (this.owner.nameTakenExcluding(displayName, this.entry)) {
            throw new InvalidTableError(
                `A table named "${displayName}" already exists on this worksheet`
            );
        }
        this.entry.displayName = displayName;
        // Excel mirrors displayName into @name; mirror the same convention.
        this.entry.name = displayName;
        this.markDirty();
    }

    /**
     * Gets range.
     *
     * @returns {string} Function result.
     */
    public get range(): string {
        return this.entry.ref;
    }

    /**
     * Gets comment.
     *
     * @returns {string | undefined} Function result.
     */
    public get comment(): string | undefined {
        return this.entry.comment;
    }

    /**
     * Gets tableType.
     *
     * @returns {string} Function result.
     */
    public get tableType(): string {
        return (this.entry.tableTypeRaw != null ? this.entry.tableTypeRaw : this.entry.tableType);
    }

    /**
     * Gets headerRowCount.
     *
     * @returns {number} Function result.
     */
    public get headerRowCount(): number {
        return this.entry.headerRowCount;
    }

    /**
     * Gets style.
     *
     * @returns {TableStyle | undefined} Function result.
     */
    public get style(): TableStyle | undefined {
        if (this.entry.styleInfo === undefined) {
            return undefined;
        }
        return styleView(this.entry.styleInfo);
    }

    /**
     * style function.
     *
     * @param {TableStyle | undefined} value - value value.
     */
    public set style(value: TableStyle | undefined) {
        if (value === undefined) {
            this.entry.styleInfo = undefined;
        } else {
            this.entry.styleInfo = normalizeStyleInput(value);
        }
        this.markDirty();
    }

    /**
     * Gets totalsRowEnabled.
     *
     * @returns {boolean} Function result.
     */
    public get totalsRowEnabled(): boolean {
        return this.entry.totalsRowCount > 0;
    }

    /**
     * totalsRowEnabled function.
     *
     * @param {boolean} value - value value.
     */
    public set totalsRowEnabled(value: boolean) {
        const wasEnabled: boolean = this.entry.totalsRowCount > 0;
        if (wasEnabled === value) {
            return; // no-op if state unchanged
        }

        // When toggling totals row on/off, the table's ref must be updated to
        // include/exclude the totals row space. ECMA-376-1 §18.5.1.1: the table
        // range (`ref` attribute) encompasses all rows from the header through
        // the totals row (if present); the `totalsRowCount` attribute indicates
        // how many rows are devoted to totals (0 or 1).
        const range: CellRange = parseA1Range(this.entry.ref);
        let newEndRow: number = range.endRow;
        if (value) {
            // Enable totals row: expand end row by 1
            newEndRow += 1;
        } else {
            // Disable totals row: shrink end row by 1 (validate minimum of start row)
            if (range.endRow > range.startRow) {
                newEndRow -= 1;
            }
        }
        const newRange: { startRow: number; startCol: number; endRow: number; endCol: number; } = {
            startRow: range.startRow,
            startCol: range.startCol,
            endRow: newEndRow,
            endCol: range.endCol
        };
        this.entry.ref = formatA1Range(newRange);
        this.entry.totalsRowCount = value ? 1 : 0;
        // Keep managed default autoFilter aligned with header+data (excludes totals).
        syncManagedAutoFilter(this.entry);
        // Materialize / clear totals-row label + SUBTOTAL cells in the sheet grid
        // so dimension covers table@ref and OE376 §2.1.710(n) is satisfied.
        if (value) {
            this.owner.materializeTotalsRowLabels(this.entry);
        } else {
            this.owner.clearTotalsRowLabels(this.entry);
        }
        this.markDirty();
    }

    /**
     * Gets totalsRowShown.
     *
     * @returns {boolean} Function result.
     */
    public get totalsRowShown(): boolean {
        return this.entry.totalsRowShown;
    }

    /**
     * totalsRowShown function.
     *
     * @param {boolean} value - value value.
     */
    public set totalsRowShown(value: boolean) {
        this.entry.totalsRowShown = value;
        this.markDirty();
    }

    /**
     * Gets columns.
     *
     * @returns {ReadonlyArray<TableColumn>} Function result.
     * @private
     */
    public get columns(): ReadonlyArray<TableColumn> {
        return this.entry.columns.map((col: TableColumnEntry) => this.owner.columnHandleFor(col, this));
    }

    /**
     * Re-write totals-row sheet cells after column totals mutations.
     *
     * @returns {void} Nothing.
     * @private
     */
    public syncTotalsRowLabels(): void {
        if (this.entry.totalsRowCount <= 0) {
            return;
        }
        this.owner.materializeTotalsRowLabels(this.entry);
    }

    /**
     * Keep one header-row sheet cell aligned with `tableColumn@name` after rename.
     *
     * @param {TableColumnEntry} column - column value.
     * @returns {void} Nothing.
     * @private
     */
    public syncHeaderCellForColumn(column: TableColumnEntry): void {
        this.owner.syncHeaderCellForColumn(this.entry, column);
    }
}

/**
 * styleView function.
 *
 * @param {TableStyleInfoEntry} style - style value.
 * @returns {TableStyle} Function result.
 */
function styleView(style: TableStyleInfoEntry): TableStyle {
    return {
        name: style.name,
        showFirstColumn: style.showFirstColumn,
        showLastColumn: style.showLastColumn,
        showRowStripes: style.showRowStripes,
        showColumnStripes: style.showColumnStripes
    };
}

/** Live {@link TableColumn} implementation. @private */
export class TableColumnHandle implements TableColumn {
    private readonly entry: TableColumnEntry;
    private readonly owner: TableHandle;
    private readonly markDirty: () => void;

    /**
     * Creates a new instance.
     *
     * @param {TableColumnEntry} entry - entry value.
     * @param {TableHandle} owner - owner value.
     * @param {*} markDirty - markDirty value.
     */
    public constructor(
        entry: TableColumnEntry,
        owner: TableHandle,
        markDirty: () => void
    ) {
        this.entry = entry;
        this.owner = owner;
        this.markDirty = markDirty;
    }

    /**
     * Gets name.
     *
     * @returns {string} Function result.
     */
    public get name(): string {
        return this.entry.name;
    }

    /**
     * name function.
     *
     * @param {string} value - value value.
     */
    public set name(value: string) {
    // Uniqueness must be checked against sibling columns
        const newName: string = requireNonEmpty(value, 'Column name');
        // Case-insensitive uniqueness check per Excel behavior
        const key: string = tableKey(newName);
        const duplicateExists: boolean = this.owner.entry.columns.some(
            (c: TableColumnEntry) => c !== this.entry && tableKey(c.name) === key
        );
        if (duplicateExists) {
            throw new InvalidTableError(
                `Column name "${newName}" already exists in table "${this.owner.entry.displayName}"`
            );
        }
        this.entry.name = newName;
        // Excel requires header-row cell text === tableColumn@name; keep them in
        // lockstep on rename (see docs/requirements/tables.md).
        this.owner.syncHeaderCellForColumn(this.entry);
        this.markDirty();
    }

    /**
     * Gets totalsRowFunction.
     *
     * @returns {TotalsRowFunctionOrRaw | string} Function result.
     */
    public get totalsRowFunction(): TotalsRowFunctionOrRaw | string {
        return (this.entry.totalsRowFunctionRaw != null ? this.entry.totalsRowFunctionRaw : this.entry.totalsRowFunction);
    }

    /**
     * totalsRowFunction function.
     *
     * @param {TotalsRowFunctionOrRaw | string} value - value value.
     */
    public set totalsRowFunction(value: TotalsRowFunctionOrRaw | string) {
        assertTotalsRowFunction(value);
        this.entry.totalsRowFunction = value as TotalsRowFunctionValue;
        this.entry.totalsRowFunctionRaw = undefined;
        // Built-in / none: Excel rejects nested totalsRowFormula together with a
        // non-custom totalsRowFunction (repair drops the whole table part). Only
        // custom carries totalsRowFormula on the wire; clear orphaned text so
        // prior setTotalsRowFormula + later sum/average does not re-emit it.
        if (value !== 'custom') {
            this.entry.totalsRowFormula = undefined;
            this.entry.totalsRowFormulaArray = false;
        }
        // Keep occupied sheet cell formula in sync with OE376 §2.1.710(n).
        this.owner.syncTotalsRowLabels();
        this.markDirty();
    }

    /**
     * Gets totalsRowLabel.
     *
     * @returns {string | undefined} Function result.
     */
    public get totalsRowLabel(): string | undefined {
        return this.entry.totalsRowLabel;
    }

    /**
     * totalsRowLabel function.
     *
     * @param {string | undefined} value - value value.
     */
    public set totalsRowLabel(value: string | undefined) {
        this.entry.totalsRowLabel = normalizeOptionalString(value);
        // Keep sheetData totals-row label cells in sync when totals are shown.
        this.owner.syncTotalsRowLabels();
        this.markDirty();
    }

    /**
     * Gets totalsRowFormula.
     *
     * @returns {string | undefined} Function result.
     */
    public get totalsRowFormula(): string | undefined {
        return this.entry.totalsRowFormula;
    }

    /**
     * Gets totalsRowFormulaIsArray.
     *
     * @returns {boolean} Function result.
     */
    public get totalsRowFormulaIsArray(): boolean {
        return this.entry.totalsRowFormulaArray;
    }

    /**
     * setTotalsRowFormula function.
     *
     * @param {string | undefined} text - text value.
     * @param {*} [options] - options value.
     * @returns {void} Nothing.
     */
    public setTotalsRowFormula(
        text: string | undefined,
        options?: { readonly isArray?: boolean }
    ): void {
        this.entry.totalsRowFormula =
      text === undefined ? undefined : normalizeTableFormula(text);
        this.entry.totalsRowFormulaArray = (options == null ? undefined : options.isArray) === true;
        // Excel-native: totalsRowFormula is only valid with totalsRowFunction=custom.
        // Authoring a formula text promotes the column to custom so wire + sheet
        // cell stay aligned (OE376 §2.1.710(n)); clearing formula alone leaves the
        // function token as-is (caller may set none/sum next).
        if (this.entry.totalsRowFormula !== undefined && this.entry.totalsRowFormula.length > 0) {
            this.entry.totalsRowFunction = 'custom' as TotalsRowFunctionValue;
            this.entry.totalsRowFunctionRaw = undefined;
        }
        // Custom totals must also appear as the occupied cell formula (OE376(n)).
        this.owner.syncTotalsRowLabels();
        this.markDirty();
    }

    /**
     * Gets calculatedColumnFormula.
     *
     * @returns {string | undefined} Function result.
     */
    public get calculatedColumnFormula(): string | undefined {
        return this.entry.calculatedColumnFormula;
    }

    /**
     * Gets calculatedColumnFormulaIsArray.
     *
     * @returns {boolean} Function result.
     */
    public get calculatedColumnFormulaIsArray(): boolean {
        return this.entry.calculatedColumnFormulaArray;
    }

    /**
     * setCalculatedColumnFormula function.
     *
     * @param {string | undefined} text - text value.
     * @param {*} [options] - options value.
     * @returns {void} Nothing.
     */
    public setCalculatedColumnFormula(
        text: string | undefined,
        options?: { readonly isArray?: boolean }
    ): void {
        this.entry.calculatedColumnFormula =
      text === undefined ? undefined : normalizeTableFormula(text);
        this.entry.calculatedColumnFormulaArray = (options == null ? undefined : options.isArray) === true;
        this.markDirty();
    }
}
