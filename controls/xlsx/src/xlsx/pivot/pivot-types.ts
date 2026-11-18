/**
 * Public pivot table surface: caches, tables, fields, and data fields.
 *
 * The shape follows the Syncfusion XlsIO pivot object model
 * (`IPivotCaches`, `IPivotTables`, `IPivotTable`, `IPivotFields`,
 * `IPivotDataFields`) with this library's naming rules
 * (`docs/api/API-RULES.md`): `camelCase` members, string-literal unions for
 * enums, options objects instead of long positional lists.
 *
 * Citations: ECMA-376-1 §18.10 (pivot tables); transitional `sml.xsd`
 * `CT_pivotTableDefinition`, `CT_PivotCacheDefinition`, `CT_PivotCacheRecords`;
 * `docs/specs/pivot-tables.md`.
 *
 * Capability limit: the library **authors** pivot definitions. It does not
 * compute or paint the pivot's cell values. Caches are written with
 * `refreshOnOpen` so Excel (and LibreOffice) rebuild the report body when
 * the file is opened.
 */

import { Range } from '../worksheet/range';

/**
 * The area of a pivot table a field is placed on.
 *
 * - `'row'` — row labels
 * - `'column'` — column labels
 * - `'filter'` — report filter (page field), shown above the table
 * - `'none'` — the field is not placed on any area
 *
 * A field aggregated as a value is added through `PivotTable.dataFields`,
 * not through an axis.
 */
export type PivotAxis = 'none' | 'row' | 'column' | 'filter';

/**
 * How values of a data field are combined. Mirrors Excel's "Summarize
 * values by" list.
 *
 * - `'count'` counts every non-empty item; `'countNumbers'` counts numbers only.
 */
export type PivotFunction =
    | 'sum'
    | 'count'
    | 'average'
    | 'max'
    | 'min'
    | 'product'
    | 'countNumbers'
    | 'standardDeviation'
    | 'populationStandardDeviation'
    | 'variance'
    | 'populationVariance';

/**
 * A subtotal shown for a row or column field. `'automatic'` lets Excel pick
 * the function from the data. An empty list means the field shows no
 * subtotals.
 */
export type PivotFieldSubtotal = 'automatic' | PivotFunction;

/** The order a field's items are listed in. */
export type PivotSortOrder = 'manual' | 'ascending' | 'descending';

/**
 * The report layout.
 *
 * - `'compact'` — all row fields share one column (Excel's default)
 * - `'outline'` — one column per row field, subtotals above their items
 * - `'tabular'` — one column per row field, subtotals below their items
 */
export type PivotLayout = 'compact' | 'outline' | 'tabular';

/**
 * Excel's built-in pivot table styles, named as they appear in Excel
 * (`PivotStyleLight1` … `PivotStyleDark28`). `'none'` writes no style.
 */
export type PivotBuiltInStyle =
    | 'none'
    | 'PivotStyleLight1'
    | 'PivotStyleLight2'
    | 'PivotStyleLight3'
    | 'PivotStyleLight4'
    | 'PivotStyleLight5'
    | 'PivotStyleLight6'
    | 'PivotStyleLight7'
    | 'PivotStyleLight8'
    | 'PivotStyleLight9'
    | 'PivotStyleLight10'
    | 'PivotStyleLight11'
    | 'PivotStyleLight12'
    | 'PivotStyleLight13'
    | 'PivotStyleLight14'
    | 'PivotStyleLight15'
    | 'PivotStyleLight16'
    | 'PivotStyleLight17'
    | 'PivotStyleLight18'
    | 'PivotStyleLight19'
    | 'PivotStyleLight20'
    | 'PivotStyleLight21'
    | 'PivotStyleLight22'
    | 'PivotStyleLight23'
    | 'PivotStyleLight24'
    | 'PivotStyleLight25'
    | 'PivotStyleLight26'
    | 'PivotStyleLight27'
    | 'PivotStyleLight28'
    | 'PivotStyleMedium1'
    | 'PivotStyleMedium2'
    | 'PivotStyleMedium3'
    | 'PivotStyleMedium4'
    | 'PivotStyleMedium5'
    | 'PivotStyleMedium6'
    | 'PivotStyleMedium7'
    | 'PivotStyleMedium8'
    | 'PivotStyleMedium9'
    | 'PivotStyleMedium10'
    | 'PivotStyleMedium11'
    | 'PivotStyleMedium12'
    | 'PivotStyleMedium13'
    | 'PivotStyleMedium14'
    | 'PivotStyleMedium15'
    | 'PivotStyleMedium16'
    | 'PivotStyleMedium17'
    | 'PivotStyleMedium18'
    | 'PivotStyleMedium19'
    | 'PivotStyleMedium20'
    | 'PivotStyleMedium21'
    | 'PivotStyleMedium22'
    | 'PivotStyleMedium23'
    | 'PivotStyleMedium24'
    | 'PivotStyleMedium25'
    | 'PivotStyleMedium26'
    | 'PivotStyleMedium27'
    | 'PivotStyleMedium28'
    | 'PivotStyleDark1'
    | 'PivotStyleDark2'
    | 'PivotStyleDark3'
    | 'PivotStyleDark4'
    | 'PivotStyleDark5'
    | 'PivotStyleDark6'
    | 'PivotStyleDark7'
    | 'PivotStyleDark8'
    | 'PivotStyleDark9'
    | 'PivotStyleDark10'
    | 'PivotStyleDark11'
    | 'PivotStyleDark12'
    | 'PivotStyleDark13'
    | 'PivotStyleDark14'
    | 'PivotStyleDark15'
    | 'PivotStyleDark16'
    | 'PivotStyleDark17'
    | 'PivotStyleDark18'
    | 'PivotStyleDark19'
    | 'PivotStyleDark20'
    | 'PivotStyleDark21'
    | 'PivotStyleDark22'
    | 'PivotStyleDark23'
    | 'PivotStyleDark24'
    | 'PivotStyleDark25'
    | 'PivotStyleDark26'
    | 'PivotStyleDark27'
    | 'PivotStyleDark28';

/**
 * Options for {@link PivotDataFields.add}.
 */
export interface PivotDataFieldOptions {
    /**
     * The caption shown for the value, for example `'Total Sales'`. Default
     * `'<Function> of <field name>'` (for example `'Sum of Sales'`),
     * numbered when that caption is already used. The caption must not equal
     * the name of a source field.
     */
    readonly name?: string;
    /** How the values are combined. Default `'sum'`. */
    readonly function?: PivotFunction;
    /**
     * A number format code applied to the value, for example `'#,##0.00'`.
     * `undefined` leaves the value in the cell's General format.
     */
    readonly numberFormat?: string;
}

/**
 * A field aggregated as a value in the pivot table's data area.
 */
export interface PivotDataField {
    /** The source field being aggregated. */
    readonly field: PivotField;
    /**
     * The caption shown for the value. Must be unique among the table's
     * data fields and must not equal a source field's name.
     *
     * @throws InvalidPivotTableError when assigned a blank, duplicate, or source-field name
     */
    name: string;
    /** How the values are combined. */
    function: PivotFunction;
    /** The number format code applied to the value; `undefined` for General. */
    numberFormat: string | undefined;
}

/**
 * The data fields of a pivot table, in the order the values are shown.
 */
export interface PivotDataFields {
    /** The number of data fields. */
    readonly count: number;
    /**
     * Get all data fields as a list, in display order.
     *
     * @returns the current data fields.
     */
    list(): ReadonlyArray<PivotDataField>;
    /**
     * Get the data field at a zero-based position.
     *
     * @param index - The zero-based position.
     * @returns the data field at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): PivotDataField;
    /**
     * Aggregate a source field as a value.
     *
     * @param field - A field of this pivot table (`table.fields`).
     * @param options - Caption, summary function, and number format.
     * @returns the new data field.
     * @throws InvalidPivotTableError when the field belongs to another table or the caption is invalid
     * @example
     * ```ts
     * table.dataFields.add(table.fields.get('Sales'), { name: 'Total Sales', function: 'sum' });
     * ```
     */
    add(field: PivotField, options?: PivotDataFieldOptions): PivotDataField;
    /**
     * Remove a data field previously returned by this collection.
     *
     * @param dataField - The data field to remove.
     * @throws InvalidArgumentError when the data field is not in this collection
     */
    remove(dataField: PivotDataField): void;
    /** Remove every data field. */
    clear(): void;
}

/**
 * One source column of a pivot table, which can be placed on an axis.
 */
export interface PivotField {
    /** The source column heading this field is built from. */
    readonly name: string;
    /**
     * A caption shown instead of the source heading; `undefined` shows the
     * source heading. Must not duplicate another field's name or caption.
     *
     * @throws InvalidPivotTableError when the caption duplicates another field
     */
    caption: string | undefined;
    /**
     * The area the field is placed on. Assigning a different axis moves the
     * field: it is appended to the end of the new axis' field list and
     * removed from the old one. Default `'none'`.
     */
    axis: PivotAxis;
    /**
     * The subtotals shown for this field when it is on the row or column
     * axis. Default `['automatic']`; an empty list shows none.
     */
    subtotals: ReadonlyArray<PivotFieldSubtotal>;
    /** The order the field's items are listed in. Default `'manual'`. */
    sortOrder: PivotSortOrder;
    /**
     * Whether items with no data are shown. Default `false`.
     */
    showItemsWithoutData: boolean;
    /**
     * A number format code applied to the field's items; `undefined` leaves
     * the source format.
     */
    numberFormat: string | undefined;
}

/**
 * The fields of a pivot table, one per source column, in source order.
 */
export interface PivotFields {
    /** The number of fields (equal to the source column count). */
    readonly count: number;
    /**
     * Get all fields as a list, in source column order.
     *
     * @returns the fields.
     */
    list(): ReadonlyArray<PivotField>;
    /**
     * Get a field by zero-based position or by source heading.
     *
     * @param indexOrName - The position, or the source column heading.
     * @returns the field.
     * @throws InvalidArgumentError when the position is out of range or no field has the heading
     */
    get(indexOrName: number | string): PivotField;
}

/**
 * The fields placed on one axis (rows, columns, or report filters), in
 * display order. Equivalent to assigning {@link PivotField.axis}.
 */
export interface PivotAxisFields {
    /** The number of fields on the axis. */
    readonly count: number;
    /**
     * Get the fields on the axis, in display order.
     *
     * @returns the fields on this axis.
     */
    list(): ReadonlyArray<PivotField>;
    /**
     * Get the field at a zero-based position on the axis.
     *
     * @param index - The zero-based position.
     * @returns the field at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): PivotField;
    /**
     * Place a field at the end of this axis, moving it off any other axis.
     *
     * @param field - A field of this pivot table, or its zero-based position or source heading.
     * @returns the field.
     * @throws InvalidPivotTableError when the field belongs to another table
     * @throws InvalidArgumentError when the position or heading does not match a field
     */
    add(field: PivotField | number | string): PivotField;
    /**
     * Take a field off this axis.
     *
     * @param field - A field on this axis.
     * @throws InvalidArgumentError when the field is not on this axis
     */
    remove(field: PivotField): void;
    /** Take every field off this axis. */
    clear(): void;
}

/**
 * Display and behavior options of a pivot table.
 */
export interface PivotTableOptions {
    /**
     * Show grand totals for rows — the total **column** at the right of the
     * table (`rowGrandTotals`). Default `true`.
     */
    rowGrand: boolean;
    /**
     * Show grand totals for columns — the total **row** at the bottom of the
     * table (`colGrandTotals`). Default `true`.
     */
    columnGrand: boolean;
    /** Show expand/collapse buttons. Default `true`. */
    showDrillIndicators: boolean;
    /** Show field captions and filter drop-downs. Default `true`. */
    showFieldHeaders: boolean;
    /** Merge and center cells with item labels. Default `false`. */
    mergeLabels: boolean;
    /** Apply Excel's automatic formatting on refresh. Default `true`. */
    autoFormat: boolean;
    /** Keep cell formatting when the table is refreshed or re-laid out. Default `true`. */
    preserveFormatting: boolean;
    /** Caption of the row label header (compact layout). `undefined` uses Excel's default. */
    rowHeaderCaption: string | undefined;
    /** Caption of the column label header. `undefined` uses Excel's default. */
    columnHeaderCaption: string | undefined;
    /** Caption of the grand total row and column. `undefined` uses Excel's default. */
    grandTotalCaption: string | undefined;
    /** Caption of the values field shown with several data fields. Default `'Values'`. */
    dataCaption: string;
    /**
     * Text shown in cells that contain errors; `undefined` shows the error.
     */
    errorCaption: string | undefined;
    /**
     * Text shown in empty data cells; `undefined` leaves them empty.
     */
    emptyCellCaption: string | undefined;
    /** Style the row header cells. Default `true`. */
    showRowHeaders: boolean;
    /** Style the column header cells. Default `true`. */
    showColumnHeaders: boolean;
    /** Banded rows. Default `false`. */
    showRowStripes: boolean;
    /** Banded columns. Default `false`. */
    showColumnStripes: boolean;
    /** Style the last column (grand totals) differently. Default `true`. */
    showLastColumn: boolean;
}

/**
 * A pivot table on a worksheet: a report that summarizes a pivot cache's
 * source data by the fields placed on its axes.
 */
export interface PivotTable {
    /**
     * The table's name, unique on its worksheet.
     *
     * @throws InvalidPivotTableError when assigned a blank or duplicate name
     */
    name: string;
    /** The cache holding the table's source data. */
    readonly cache: PivotCache;
    /**
     * The top-left cell of the table body as an A1 address, for example
     * `'A3'`. Report filters are placed above this cell, one per row with a
     * blank row between, so the row must leave room for them. Assigning a
     * range uses its top-left cell.
     *
     * @throws InvalidAddressError when the address is not valid
     */
    location: string;
    /** All fields, one per source column. */
    readonly fields: PivotFields;
    /** The fields on the row axis, in display order. */
    readonly rowFields: PivotAxisFields;
    /** The fields on the column axis, in display order. */
    readonly columnFields: PivotAxisFields;
    /** The report-filter fields, in display order. */
    readonly filterFields: PivotAxisFields;
    /** The aggregated values, in display order. */
    readonly dataFields: PivotDataFields;
    /** Display and behavior options. */
    readonly options: PivotTableOptions;
    /** The report layout. Default `'compact'`. */
    layout: PivotLayout;
    /**
     * The built-in style applied to the table. Default
     * `'PivotStyleLight16'`.
     */
    pivotStyle: PivotBuiltInStyle;
}

/**
 * Options for {@link PivotTables.add}.
 */
export interface PivotTableAddOptions {
    /**
     * The table's name, unique on the worksheet. Default `PivotTable<n>`.
     */
    readonly name?: string;
    /**
     * The top-left cell of the table, for example `'A3'`. A range uses its
     * top-left cell. Required.
     */
    readonly location: string;
}

/**
 * The pivot tables on a worksheet.
 *
 * Pivot tables read from a file are listed here and can be edited like
 * authored ones. A table the library cannot describe completely (for example
 * one over an external or OLAP source, or with grouped fields) is kept in the
 * file unchanged and is not listed.
 */
export interface PivotTables {
    /** The number of pivot tables on the worksheet. */
    readonly count: number;
    /**
     * Get all pivot tables as a list, in creation order.
     *
     * @returns the current pivot tables.
     */
    list(): ReadonlyArray<PivotTable>;
    /**
     * Get a pivot table by zero-based position or by name.
     *
     * @param indexOrName - The position, or the table name.
     * @returns the pivot table.
     * @throws InvalidArgumentError when the position is out of range or no table has the name
     */
    get(indexOrName: number | string): PivotTable;
    /**
     * Check whether the worksheet has a pivot table with this name.
     *
     * @param name - The name to look for.
     * @returns `true` when a pivot table has exactly this name.
     */
    has(name: string): boolean;
    /**
     * Add a pivot table over a cache. The new table has no fields placed:
     * assign `field.axis` or use `rowFields.add(...)`, then add data fields.
     *
     * In XlsIO terms this is `worksheet.PivotTables.Add(name, location, cache)`.
     *
     * @param cache - The cache to read data from, from `workbook.pivotCaches.add(...)`.
     * @param options - The table name and location.
     * @returns the new pivot table.
     * @throws InvalidPivotTableError when the name is blank or duplicated, or the cache belongs to another workbook
     * @throws InvalidAddressError when the location is not a valid address
     * @example
     * ```ts
     * const cache = workbook.pivotCaches.add(sheet.range('A1:D100'));
     * const table = sheet.pivotTables.add(cache, { name: 'Sales', location: 'F3' });
     * table.rowFields.add('Region');
     * table.dataFields.add(table.fields.get('Amount'));
     * ```
     */
    add(cache: PivotCache, options: PivotTableAddOptions): PivotTable;
    /**
     * Remove a pivot table previously returned by this collection.
     *
     * @param table - The table to remove.
     * @throws InvalidArgumentError when the table is not in this collection
     */
    remove(table: PivotTable): void;
    /**
     * Remove the pivot table at a zero-based position.
     *
     * @param index - The zero-based position.
     * @throws InvalidArgumentError when the index is out of range
     */
    removeAt(index: number): void;
    /** Remove every pivot table from the worksheet. */
    clear(): void;
}

/**
 * The source data a pivot table summarizes. A cache is shared by every pivot
 * table built over it.
 */
export interface PivotCache {
    /**
     * The source as `Sheet1!A1:D100` (sheet name quoted when needed).
     * Follows the source sheet if it is renamed.
     */
    readonly source: string;
    /** The source column headings, in column order. */
    readonly fieldNames: ReadonlyArray<string>;
    /**
     * Whether Excel rebuilds the pivot tables from the source when the file
     * is opened. Because the library does not paint the report body, leave
     * this `true` (default) for Excel to fill it in.
     */
    refreshOnOpen: boolean;
}

/**
 * The pivot caches authored in a workbook.
 *
 * Caches read from a file are listed here; one the library cannot describe
 * completely is kept in the file unchanged and is not listed.
 */
export interface PivotCaches {
    /** The number of caches. */
    readonly count: number;
    /**
     * Get all caches as a list, in creation order.
     *
     * @returns the current caches.
     */
    list(): ReadonlyArray<PivotCache>;
    /**
     * Get the cache at a zero-based position.
     *
     * @param index - The zero-based position.
     * @returns the cache at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): PivotCache;
    /**
     * Create a cache over a block of source data. The first row holds the
     * field headings; every following row is a record. The data is read when
     * the workbook is saved, so cells written after this call are included.
     *
     * In XlsIO terms this is `workbook.PivotCaches.Add(range)`.
     *
     * @param source - The source range, for example `sheet.range('A1:D100')`, headings first.
     * @returns the new cache.
     * @throws InvalidPivotTableError when the range has fewer than two rows, or a heading is blank or duplicated
     * @example
     * ```ts
     * const cache = workbook.pivotCaches.add(workbook.sheet('Data').range('A1:D100'));
     * ```
     */
    add(source: Range): PivotCache;
}
