import { Shape } from '../../core/shapes/shape';
import { DirectFill } from '../../core/shapes/fill-line-types';  
import { AuthoredGradientFill } from '../../core/theme/gradient-types';
import { GradientFillOptions } from '../../core/shapes/gradient-fill-options';
import { GradientStopEditor } from '../../core/shapes/gradient-stop-editor';
import { buildGradientFill } from '../../core/shapes/write-gradient-fill';
import { tableFillNamespace, tableGradientElement, readTableFill, readTableGradient, commitTableFill } from './table-fill';
/**
 * Table handle bound to a live `a:tbl` under a table `graphicFrame`.
 *
 * @remarks
 * Grid dimensions follow `tblGrid/gridCol` × `tr` document order. Ragged `tc`
 * counts fail soft on read (actual length exposed via {@link Table.getCell}); missing
 * cells are never invented on save. Citation: Transitional `dml-main.xsd` `CT_Table`,
 * `CT_TableGrid`, `CT_TableRow`, `CT_TableCol`, `CT_TableProperties`.
 *
 * Structural writes ({@link Table.addRow}, {@link Table.insertRowAt},
 * {@link Table.addColumn}, {@link Table.insertColumnAt}) rebuild internal grid
 * caches after a successful DOM write (TASK-1083–TASK-1085).
 */
import { PresentationError } from '../../core/errors';
import { SecurityLimits } from '../../core/security/limits';
import { DML_NS } from '../../core/shapes/constants';
import { asMutable, collectDirectText, findChild, getAttr, MutableOoxmlElement } from '../../core/shapes/dom-utils';
import { emuToPoints, pointsToEmu } from '../../core/util/length-units';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { BuiltInTableStyle, classifyBuiltInTableStyle, isBuiltInTableStyle } from './built-in-table-style';
import { builtinTableStyleGuid } from './builtin-table-style-ids';
import { buildEmptyTableCell } from './create-table-seed';
import { partNameOptions, TablesError } from './errors';
import { TableCell } from './table-cell';
import { arrayAt } from '../../core/util/es5-compat';
/** Shared identity invalidation across optional table aliases; no DOM retained globally. */
const DETACHED_TABLES: WeakSet<OoxmlElement> = new WeakSet();
/**
 * Options for {@link Table.addRow} and {@link Table.insertRowAt}.
 *
 * @public
 */
export interface AddTableRowOptions {
    /**
     * New row height in **points** (written as `a:tr/@h` EMU). When omitted,
     * copies the last existing row height when that height is ≥ 1 EMU;
     * otherwise uses SF-cited half of the default frame height (100 pt →
     * `1270000` EMU).
     */
    readonly height?: number;
}
/**
 * Options for {@link Table.addColumn} and {@link Table.insertColumnAt}.
 *
 * @public
 */
export interface AddTableColumnOptions {
    /**
     * New column width in **points** (written as `a:gridCol/@w` EMU). When
     * omitted, copies the last existing column width when that width is ≥ 1 EMU;
     * otherwise uses SF-cited half of the default frame width (200 pt →
     * `2540000` EMU).
     */
    readonly width?: number;
}
/**
 * DrawingML table (`a:tbl`) bound to the live slide DOM.
 *
 * Extends {@link Shape} so a table graphic frame from `slide.shapes` is a `Table`
 * (`instanceof Table`, customer cast `as Table`). {@link asTable} and
 * {@link addTable} use the same class. When those paths have no frame identity yet,
 * {@link Shape} fields are filled by {@link Table.adoptFrame} (no XML write). 
 *
 * @public
 */
export class Table extends Shape {   
    private readonly onFillMutate: (() => void) | undefined;
    private readonly tbl: OoxmlElement;
    /** True after {@link Table.adoptFrame}: shape element is the graphic frame. */
    private frameAdopted: boolean = false; 
    private gridCols: ReadonlyArray<OoxmlElement>; 
    private rows: ReadonlyArray<OoxmlElement>;
    private widths: ReadonlyArray<number>;
    private heights: ReadonlyArray<number>;
    private styleId: string | undefined;
    /**
     * @internal
     * @param {OoxmlElement} tbl - The tbl value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {*} onFillMutate - Optional post-commit fill notification.
     */
    constructor(tbl: OoxmlElement, limits: SecurityLimits, partName?: string, onFillMutate?: () => void) {
        super(tbl, 'graphicFrame', '', '', limits, partName, undefined, 0, onFillMutate);
        this.onFillMutate = onFillMutate;
        this.tbl = tbl;
        this.gridCols = []; 
        this.rows = [];
        this.widths = [];
        this.heights = [];
        this.styleId = undefined;
        this.refreshCaches();
    }
    /**
     * Whether this handle was invalidated by {@link removeTable}.
     *
     * @internal
     * @returns {boolean} The result.
     */
    isDetached(): boolean {
        return DETACHED_TABLES.has(this.tbl);
    }
    /**
     * Marks the handle unusable after the graphic frame left the slide tree.
     *
     * @internal
     * @returns {void} Nothing.
     */
    markDetached(): void {
        DETACHED_TABLES.add(this.tbl);
    }
    /**
     * Column count from `a:tblGrid/a:gridCol` length.
     *
     * @throws {Error} When the handle is detached (TASK-1086).
     * @returns {number} The result.
     */
    get columnCount(): number {
        this.assertLive();
        return this.gridCols.length;
    }
    /**
     * Row count from `a:tr` length.
     *
     * @throws {Error} When the handle is detached (TASK-1086).
     * @returns {number} The result.
     */
    get rowCount(): number {
        this.assertLive();
        return this.rows.length;
    }
    /**
     * Column widths in **points** from each `a:gridCol/@w` (document order).
     *
     * @remarks Unparsable `@w` fails soft as `0` so indices stay aligned with {@link Table.columnCount}. Wire EMU values are converted with
     * {@link emuToPoints}.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @returns {*} The result.
     */
    get columnWidths(): ReadonlyArray<number> {
        this.assertLive();
        return this.widths.map((w: number) => (w === 0 ? 0 : emuToPoints(w)));
    }
    /**
     * Row heights in **points** from each `a:tr/@h` (document order).
     *
     * @remarks Unparsable `@h` fails soft as `0` so indices stay aligned with {@link Table.rowCount}. Wire EMU values are converted with
     * {@link emuToPoints}.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @returns {*} The result.
     */
    get rowHeights(): ReadonlyArray<number> {
        this.assertLive();
        return this.heights.map((h: number) => (h === 0 ? 0 : emuToPoints(h)));
    }
    /**
     * `a:tblPr/a:tableStyleId` GUID text when present.
     *
     * @remarks Does not flatten inline `tableStyle` or resolve style definitions. Absent or empty → `undefined`.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @returns {string | undefined} The result.
     */
    get tableStyleId(): string | undefined {
        this.assertLive();
        return this.styleId;
    }
    /**
     * Built-in style classification for this table.
     *
     * @remarks
     * Reads `a:tblPr` only. A missing `a:tableStyleId` and no inline `a:tableStyle`
     * is {@link BuiltInTableStyle.none}. A GUID in the cited catalog
     * (`mediumStyle2Accent1`, `themedStyle1Accent1`, `noStyleTableGrid`) returns
     * that member. Any other id, an empty id, or an inline `a:tableStyle` is
     * {@link BuiltInTableStyle.custom}. Does not write the tree. Does not resolve
     * `ppt/tableStyles.xml`. Uncited gallery members cannot be returned until
     * TASK-1110 cites their GUIDs. Read is case-insensitive; `ST_Guid` write form
     * is uppercase.
     *
     * @throws {Error} When the handle is detached (TASK-1086).
     * @returns {BuiltInTableStyle} The classification.
     */
    get builtInStyle(): BuiltInTableStyle {
        this.assertLive();
        const tblPr: OoxmlElement | undefined = findChild(this.tbl, DML_NS, 'tblPr');
        if (tblPr === undefined) {
            return BuiltInTableStyle.none;
        }
        const styleIdEl: OoxmlElement | undefined = findChild(tblPr, DML_NS, 'tableStyleId');
        if (styleIdEl !== undefined) {
            return classifyBuiltInTableStyle(collectDirectText(styleIdEl));
        }
        if (findChild(tblPr, DML_NS, 'tableStyle') !== undefined) {
            return BuiltInTableStyle.custom;
        }
        return BuiltInTableStyle.none;
    }
    /**
     * Assigns a cited built-in style, or clears the style id.
     *
     * @remarks
     * A catalog member replaces the `a:tblPr` choice child with `a:tableStyleId`
     * containing the cited braced GUID. {@link BuiltInTableStyle.none} removes
     * `a:tableStyleId` only and leaves an inline `a:tableStyle` in place.
     * {@link BuiltInTableStyle.custom}, a non-member, and a gallery member with no
     * TASK-1110 citation throw {@link TablesError} before any write.
     * An inline `a:tableStyle` is not replaced: `ppt/tableStyles.xml` is not loaded
     * on this handle, so a unique inline definition cannot be proven duplicate
     * (spec 044, fail closed). Flags, `rtl`, and other `tblPr` children are unchanged.
     *
     * @throws {TablesError} When the value cannot be written without inventing OOXML.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @param {BuiltInTableStyle} value - Cited member, or `none`.
     */
    set builtInStyle(value: BuiltInTableStyle) {
        this.assertLive();
        if (value === BuiltInTableStyle.custom || !isBuiltInTableStyle(value)) {
            throw new TablesError('builtInStyle must be a BuiltInTableStyle member other than custom',
                                  partNameOptions(this.boundPartName));
        }
        if (value !== BuiltInTableStyle.none && builtinTableStyleGuid(value) === undefined) {
            throw new TablesError(
                'builtInStyle ' + value + ' has no cited tableStyleId; refusing to invent a GUID',
                partNameOptions(this.boundPartName));
        }
        const tblPr: OoxmlElement | undefined = findChild(this.tbl, DML_NS, 'tblPr');
        if (tblPr !== undefined && findChild(tblPr, DML_NS, 'tableStyle') !== undefined && value !== BuiltInTableStyle.none) {
            throw new TablesError(
                'Refusing to replace inline a:tableStyle; tableStyles.xml is not loaded so the definition is not proven duplicate',
                partNameOptions(this.boundPartName));
        }
        this.writeBuiltInStyle(value);
    }
    /**
     * `a:tblPr/@firstRow`. Absent reads `false` and is not created by the getter.
     *
     * @remarks XSD default is `false` (`CT_TableProperties`). Setter writes `1` or `0`.
     * Citation: Transitional `dml-main.xsd` `CT_TableProperties` `@firstRow`.
     * @throws {Error} When the handle is detached (TASK-1086).
     */
    get hasHeaderRow(): boolean {
        return this.readFlag('firstRow');
    }
    set hasHeaderRow(value: boolean) {
        this.writeFlag('firstRow', value);
    }
    /**
     * `a:tblPr/@firstCol`. Absent reads `false` and is not created by the getter.
     *
     * @remarks Citation: Transitional `dml-main.xsd` `CT_TableProperties` `@firstCol`.
     * @throws {Error} When the handle is detached (TASK-1086).
     */
    get hasFirstColumn(): boolean {
        return this.readFlag('firstCol');
    }
    set hasFirstColumn(value: boolean) {
        this.writeFlag('firstCol', value);
    }
    /**
     * `a:tblPr/@lastRow`. Absent reads `false` and is not created by the getter.
     *
     * @remarks Citation: Transitional `dml-main.xsd` `CT_TableProperties` `@lastRow`.
     * @throws {Error} When the handle is detached (TASK-1086).
     */
    get hasTotalRow(): boolean {
        return this.readFlag('lastRow');
    }
    set hasTotalRow(value: boolean) {
        this.writeFlag('lastRow', value);
    }
    /**
     * `a:tblPr/@lastCol`. Absent reads `false` and is not created by the getter.
     *
     * @remarks Citation: Transitional `dml-main.xsd` `CT_TableProperties` `@lastCol`.
     * @throws {Error} When the handle is detached (TASK-1086).
     */
    get hasLastColumn(): boolean {
        return this.readFlag('lastCol');
    }
    set hasLastColumn(value: boolean) {
        this.writeFlag('lastCol', value);
    }
    /**
     * `a:tblPr/@bandRow`. Absent reads `false` and is not created by the getter.
     *
     * @remarks Citation: Transitional `dml-main.xsd` `CT_TableProperties` `@bandRow`.
     * @throws {Error} When the handle is detached (TASK-1086).
     */
    get hasBandedRows(): boolean {
        return this.readFlag('bandRow');
    }
    set hasBandedRows(value: boolean) {
        this.writeFlag('bandRow', value);
    }
    /**
     * `a:tblPr/@bandCol`. Absent reads `false` and is not created by the getter.
     *
     * @remarks Citation: Transitional `dml-main.xsd` `CT_TableProperties` `@bandCol`.
     * @throws {Error} When the handle is detached (TASK-1086).
     */
    get hasBandedColumns(): boolean {
        return this.readFlag('bandCol');
    }
    set hasBandedColumns(value: boolean) {
        this.writeFlag('bandCol', value);
    }
    /**
     * Returns the cell at zero-based `(row, column)`.
     *
     * @throws {Error} When the handle is detached (TASK-1086).
     * @throws {RangeError} When the row is outside `0..rowCount-1`, the column is outside the **actual** `tc` count for that row (ragged
     * rows fail soft), or the cell element is missing.
     * @param {number} row - Zero-based row index.
     * @param {number} column - Zero-based column index.
     * @returns {TableCell} Live {@link TableCell} handle.
     */
    getCell(row: number, column: number): TableCell {
        this.assertLive();
        if (!Number.isInteger(row) || row < 0 || row >= this.rows.length) {
            throw new RangeError(`Table cell row ${String(row)} out of range (rowCount=${String(this.rows.length)})`);
        }
        const tr: OoxmlElement = arrayAt(this.rows, row);
        if (tr === undefined) {
            throw new RangeError(`Table cell row ${String(row)} out of range`);
        }
        const tcs: Array<OoxmlElement> = childrenNamed(tr, DML_NS, 'tc');
        if (!Number.isInteger(column) || column < 0 || column >= tcs.length) {
            throw new RangeError(`Table cell column ${String(column)} out of range for row ${String(row)} (cellCount=${String(tcs.length)})`);
        }
        const tc: OoxmlElement = arrayAt(tcs, column);
        if (tc === undefined) {
            throw new RangeError(`Table cell (${String(row)}, ${String(column)}) is missing (ragged row)`);
        }
        return new TableCell(tc, row, column, this.boundLimits, this.boundPartName, this.onFillMutate, (): void => {
            this.assertLive();
            const currentRow: OoxmlElement | undefined = arrayAt(childrenNamed(this.tbl, this.tbl.namespaceUri, 'tr'), row);
            const currentCell: OoxmlElement | undefined = currentRow === undefined ? undefined :
                arrayAt(childrenNamed(currentRow, DML_NS, 'tc'), column);
            if (currentCell !== tc) {
                throw new TablesError('Table cell fill handle is stale after structural edit', partNameOptions(this.boundPartName));
            }
        });
    }
    /**
     * Appends one `a:tr` at the end of the table with `columnCount` empty `a:tc` cells.
     *
     * @remarks Equivalent to {@link Table.insertRowAt} with `index === rowCount`. Default height copies the last row's `@h` when ≥ 1 EMU;
     * otherwise SF half-frame default `1270000` EMU (100 pt). Cells are merge-free seeds (`buildEmptyTableCell`). **Fail closed:** any
     * existing cell merge attribute, or any row whose `tc` count ≠ `columnCount`, throws {@link Error} with no DOM write (TASK-1080
     * preferred default). Citation: `dml-main.xsd` `CT_TableRow` / `CT_TableCell`; spec **038** `addRow`.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @throws {Error} Invalid `height`, zero columns, ragged grid, or merge attrs.
     * @param {AddTableRowOptions} options - Optional row height in **points** (`height`).
     * @returns {void} Nothing.
     */
    addRow(options?: AddTableRowOptions): void {
        this.assertLive();
        this.insertRowAt(this.rows.length, options);
    }
    /**
     * Inserts one `a:tr` at zero-based `index` with `columnCount` empty `a:tc` cells.
     *
     * @remarks Existing rows at `index..` shift down. DOM insert is relative to `a:tr` siblings so `tblPr` / `tblGrid` order is preserved.
     * Height and fail-closed merge/ragged rules match {@link Table.addRow}. Citation: `dml-main.xsd` `CT_TableRow`; spec **038**
     * `insertRowAt`; TASK-1080 lock (`PresentationError` `model/out-of-range`).
     * @throws {Error} When `index` is not an integer in `0..rowCount` (code `model/out-of-range`); no DOM write.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @throws {Error} Invalid `height`, zero columns, ragged grid, or merge attrs.
     * @param {number} index - Insert position; valid range is `0..rowCount` inclusive
     * @param {AddTableRowOptions} options - Optional row height in **points** (`height`).
     * @returns {void} Nothing.
     */
    insertRowAt(index: number, options?: AddTableRowOptions): void {
        this.assertLive();
        const rowCount: number = this.rows.length;
        if (!Number.isInteger(index) || index < 0 || index > rowCount) {
            throw new PresentationError('model/out-of-range',
                                        `Table insertRowAt index ${String(index)} is out of range (rowCount ${String(rowCount)}; valid 0..rowCount inclusive).`);
        }
        const columnCount: number = this.gridCols.length;
        if (columnCount < 1) {
            throw new TablesError('Cannot insert row: table has no grid columns (tblGrid/gridCol required)',
                                  partNameOptions(this.boundPartName));
        }
        const heightEmu: number = resolveAddRowHeightEmu((options == null ? undefined : options.height), this.heights, this.boundPartName);
        assertRectangularGridOrThrow(this.rows, columnCount, this.boundPartName);
        assertNoMergeAttrsOrThrow(this.rows, this.boundPartName);
        const tr: OoxmlElement = buildEmptyTableRow(columnCount, heightEmu);
        const mutable: MutableOoxmlElement = asMutable(this.tbl);
        if (index >= rowCount) {
            mutable.children.push(tr);
        }
        else {
            const anchor: OoxmlElement = arrayAt(this.rows, index);
            if (anchor === undefined) {
                throw new PresentationError('model/out-of-range',
                                            `Table insertRowAt index ${String(index)} is out of range (rowCount ${String(rowCount)}; valid 0..rowCount inclusive).`);
            }
            const childIndex: number = mutable.children.indexOf(anchor);
            if (childIndex < 0) {
                throw new TablesError('Cannot insert row: target tr is not a direct child of tbl (invariant)',
                                      partNameOptions(this.boundPartName));
            }
            mutable.children.splice(childIndex, 0, tr);
        }
        this.refreshCaches();
    }
    /**
     * Appends one `a:gridCol` and one empty `a:tc` in every `a:tr`.
     *
     * @remarks Equivalent to {@link Table.insertColumnAt} with `index === columnCount`. Default width copies the last column's `@w` when ≥
     * 1 EMU; otherwise SF half-frame default `2540000` EMU (200 pt). Cells are merge-free seeds (`buildEmptyTableCell`). **Fail closed:**
     * any existing cell merge attribute, or any row whose `tc` count ≠ `columnCount`, throws {@link Error} with no DOM write
     * (TASK-1080 preferred default). Citation: `dml-main.xsd` `CT_TableCol` / `CT_TableCell`; spec **038** `addColumn`.
     * @throws {Error} Invalid `width`, missing `tblGrid`, ragged grid, or merge attrs.
     * @param {AddTableColumnOptions} options - Optional column width in **points** (`width`).
     * @returns {void} Nothing.
     */
    addColumn(options?: AddTableColumnOptions): void {
        this.assertLive();
        this.insertColumnAt(this.gridCols.length, options);
    }
    /**
     * Inserts one `a:gridCol` at zero-based `index` and one empty `a:tc` at the
     * same index in every `a:tr`.
     *
     * @remarks Existing columns at `index..` shift right. Grid and every row are updated together so `tc` counts stay aligned with
     * `gridCol` count. Width and fail-closed merge/ragged rules match {@link Table.addColumn}. Citation: `dml-main.xsd` `CT_TableGrid` /
     * `CT_TableCol`; spec **038** `insertColumnAt`; TASK-1080 lock (`PresentationError` `model/out-of-range`).
     * @throws {Error} When `index` is not an integer in `0..columnCount` (code `model/out-of-range`); no DOM write.
     * @throws {Error} When the handle is detached (TASK-1086).
     * @throws {Error} Invalid `width`, missing `tblGrid`, ragged grid, or merge attrs.
     * @param {number} index - Insert position; valid range is `0..columnCount` inclusive
     * @param {AddTableColumnOptions} options - Optional column width in **points** (`width`).
     * @returns {void} Nothing.
     */
    insertColumnAt(index: number, options?: AddTableColumnOptions): void {
        this.assertLive();
        const columnCount: number = this.gridCols.length;
        if (!Number.isInteger(index) || index < 0 || index > columnCount) {
            throw new PresentationError('model/out-of-range',
                                        `Table insertColumnAt index ${String(index)} is out of range (columnCount ${String(columnCount)}; valid 0..columnCount inclusive).`);
        }
        const widthEmu: number = resolveAddColumnWidthEmu((options == null ? undefined : options.width), this.widths, this.boundPartName);
        assertRectangularGridOrThrow(this.rows, columnCount, this.boundPartName);
        assertNoMergeAttrsOrThrow(this.rows, this.boundPartName);
        const tblGrid: OoxmlElement = findChild(this.tbl, DML_NS, 'tblGrid');
        if (tblGrid === undefined) {
            throw new TablesError('Cannot insert column: table has no tblGrid (required)', partNameOptions(this.boundPartName));
        }
        const gridCol: OoxmlElement = buildEmptyGridCol(widthEmu);
        const mutableGrid: MutableOoxmlElement = asMutable(tblGrid);
        if (index >= columnCount) {
            mutableGrid.children.push(gridCol);
        }
        else {
            const anchorCol: OoxmlElement = arrayAt(this.gridCols, index);
            if (anchorCol === undefined) {
                throw new PresentationError('model/out-of-range',
                                            `Table insertColumnAt index ${String(index)} is out of range (columnCount ${String(columnCount)}; valid 0..columnCount inclusive).`);
            }
            const colChildIndex: number = mutableGrid.children.indexOf(anchorCol);
            if (colChildIndex < 0) {
                throw new TablesError('Cannot insert column: target gridCol is not a direct child of tblGrid (invariant)',
                                      partNameOptions(this.boundPartName));
            }
            mutableGrid.children.splice(colChildIndex, 0, gridCol);
        }
        for (let r: number = 0; r < this.rows.length; r += 1) {
            const tr: OoxmlElement = arrayAt(this.rows, r);
            if (tr === undefined) {
                continue;
            }
            const tcs: Array<OoxmlElement> = childrenNamed(tr, DML_NS, 'tc');
            const cell: OoxmlElement = buildEmptyTableCell();
            const mutableTr: MutableOoxmlElement = asMutable(tr);
            if (index >= tcs.length) {
                mutableTr.children.push(cell);
            }
            else {
                const anchorTc: OoxmlElement = arrayAt(tcs, index);
                if (anchorTc === undefined) {
                    throw new TablesError(`Cannot insert column: row ${String(r)} missing tc at index ${String(index)} (invariant)`,
                                          partNameOptions(this.boundPartName));
                }
                const tcChildIndex: number = mutableTr.children.indexOf(anchorTc);
                if (tcChildIndex < 0) {
                    throw new TablesError(`Cannot insert column: target tc is not a direct child of tr at row ${String(r)} (invariant)`,
                                          partNameOptions(this.boundPartName));
                }
                mutableTr.children.splice(tcChildIndex, 0, cell);
            }
        }
        this.refreshCaches();
    }
    /**
     * Direct properties fill; missing remains distinct from explicit noFill.
     *
     * @returns {DirectFill} Classification only; styles and table background remain separate.
     */
    get fill(): DirectFill {
        this.assertLive();
        return readTableFill(this.tbl, this.boundPartName);
    }
    /**
     * Complete sparse direct gradient, retaining presence, flags, rectangles and references.
     *
     * @returns {AuthoredGradientFill | undefined} Authored data, without style inheritance.
     */
    get gradientFill(): AuthoredGradientFill | undefined {
        this.assertLive();
        return readTableGradient(this.tbl, this.boundPartName);
    }
    /**
     * Replaces only direct fill after validating the complete detached gradient.
     *
     * @param {GradientFillOptions} options - Explicit stops and geometry in normalized units.
     * @returns {void} Preserves styles, grid, merges, text, borders and unknown XML.
     * @throws Invalid input or detached host, without mutation or notification.
     */
    setGradientFill(options: GradientFillOptions): void {
        this.assertLive();
        const fill: OoxmlElement = buildGradientFill(options, tableFillNamespace(this.tbl, this.boundPartName), this.boundPartName);
        if (commitTableFill(this.tbl, fill, this.boundPartName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Writes explicit noFill without changing any other properties.
     *
     * @returns {void} Notifies after a successful commit.
     */
    setNoFill(): void {
        this.assertLive();
        const ns: string = tableFillNamespace(this.tbl, this.boundPartName);
        const fill: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 'noFill', attributes: [], children: [], prefixHint: 'a' };
        if (commitTableFill(this.tbl, fill, this.boundPartName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Removes only direct fill, making the existing style tier eligible again.
     *
     * @returns {void} Missing fill is a no-op; properties remain intact.
     */
    clearFill(): void {
        this.assertLive();
        if (commitTableFill(this.tbl, undefined, this.boundPartName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Edits individual stops in the existing direct gradient.
     *
     * @returns {GradientStopEditor} Stale-checked session; dispose after use.
     * @throws Missing direct gradient, detached host or stale replacement.
     */
    editGradientFill(): GradientStopEditor {
        this.assertLive();
        tableFillNamespace(this.tbl, this.boundPartName);
        return new GradientStopEditor((): OoxmlElement | undefined => {
            this.assertLive();
            return tableGradientElement(this.tbl, this.boundPartName);
        }, this.boundPartName, (): void => { if (this.onFillMutate) { this.onFillMutate(); } });
    }
    /**
     * Live `a:tbl`. {@link Table.getElement} is also `a:tbl` (historic binder).
     * The graphic frame, when this handle was adopted from the walk, is
     * {@link Shape.getHostElement}.
     *
     * @internal
     */
    getTableElement(): OoxmlElement { 
        return this.tbl;
    }
    /**
     * Live table DOM (`a:tbl`). Kept so {@link removeTable} identity checks match
     * handles from {@link asTable}. Walk-adopted tables override this via
     * {@link Shape.adopt} only for shape fields — this method still returns `a:tbl`.
     *
     * @returns {OoxmlElement} Bound `a:tbl`.
     * @internal
     */
    getElement(): OoxmlElement {
        return this.tbl;
    } 
    /**
     * Copies graphic-frame identity from the walk probe. {@link Table.getElement}
     * stays `a:tbl`; the frame is {@link Shape.getHostElement}. 
     *
     * @internal
     */
    adoptFrame(source: Shape): void {
        this.adopt(source);
        this.frameAdopted = true;
    }  
    /**
     * Throws when the handle was invalidated by {@link removeTable}.
     *
     * @internal
     * @returns {void} Nothing.
     */
    private assertLive(): void {
        if (this.isDetached()) {
            throw new TablesError('Table handle is detached after removeTable', partNameOptions(this.boundPartName));
        }
    }
    /**
     * Reads one `CT_TableProperties` boolean. Absent or non-true tokens are `false`.
     * Does not create `tblPr` or the attribute.
     *
     * @param name - Unprefixed attribute local name.
     * @returns Whether the token is `1` or `true`.
     */
    private readFlag(name: string): boolean {
        this.assertLive();
        const tblPr: OoxmlElement | undefined = findChild(this.tbl, DML_NS, 'tblPr');
        if (tblPr === undefined) {
            return false;
        }
        const token: string | undefined = getAttr(tblPr, '', name);
        return token === '1' || token === 'true';
    }
    /**
     * Writes one flag as `1` or `0`. Creates `a:tblPr` before `a:tblGrid` when missing.
     * Does not touch the other five flags or `tableStyleId`.
     *
     * @param name - Unprefixed attribute local name.
     * @param value - Caller value. Non-booleans throw before mutation.
     */
    private writeFlag(name: string, value: boolean): void {
        this.assertLive();
        if (value !== true && value !== false) {
            throw new TablesError('Table flag ' + name + ' requires a boolean', partNameOptions(this.boundPartName));
        }
        const tblPr: OoxmlElement = this.ensureTblPr();
        setUnprefixedAttr(tblPr, name, value ? '1' : '0');
    }
    /**
     * Writes a cited style id, or removes `a:tableStyleId` for `none`.
     * Caller has already refused inline replacement and uncited members.
     *
     * @param value - `none` or a cited member.
     */
    private writeBuiltInStyle(value: BuiltInTableStyle): void {
        if (value === BuiltInTableStyle.none) {
            const existing: OoxmlElement | undefined = findChild(this.tbl, DML_NS, 'tblPr');
            if (existing === undefined) {
                return;
            }
            removeNamedChild(existing, DML_NS, 'tableStyleId');
            this.styleId = undefined;
            return;
        }
        const guid: string | undefined = builtinTableStyleGuid(value);
        if (guid === undefined) {
            throw new TablesError('builtInStyle ' + value + ' has no cited tableStyleId', partNameOptions(this.boundPartName));
        }
        const tblPr: OoxmlElement = this.ensureTblPr();
        removeNamedChild(tblPr, DML_NS, 'tableStyleId');
        const idEl: OoxmlElement = {
            kind: 'element',
            namespaceUri: DML_NS,
            localName: 'tableStyleId',
            attributes: [],
            children: [{ kind: 'text', text: guid }],
            prefixHint: 'a',
        };
        const mutable: MutableOoxmlElement = asMutable(tblPr);
        const extIndex: number = childIndexNamed(tblPr, DML_NS, 'extLst');
        if (extIndex < 0) {
            mutable.children.push(idEl);
        }
        else {
            mutable.children.splice(extIndex, 0, idEl);
        }
        this.styleId = guid;
    }
    /**
     * Returns `a:tblPr`, inserting it before `a:tblGrid` when absent.
     *
     * @returns Live properties element.
     */
    private ensureTblPr(): OoxmlElement {
        const existing: OoxmlElement | undefined = findChild(this.tbl, DML_NS, 'tblPr');
        if (existing !== undefined) {
            return existing;
        }
        const created: OoxmlElement = {
            kind: 'element',
            namespaceUri: DML_NS,
            localName: 'tblPr',
            attributes: [],
            children: [],
            prefixHint: 'a',
        };
        const mutable: MutableOoxmlElement = asMutable(this.tbl);
        const gridIndex: number = childIndexNamed(this.tbl, DML_NS, 'tblGrid');
        if (gridIndex < 0) {
            mutable.children.unshift(created);
        }
        else {
            mutable.children.splice(gridIndex, 0, created);
        }
        return created;
    }
    /**
     *
     * @returns {void} Nothing.
     */
    private refreshCaches(): void {
        const tblGrid: OoxmlElement = findChild(this.tbl, DML_NS, 'tblGrid');
        this.gridCols = tblGrid === undefined ? [] : childrenNamed(tblGrid, DML_NS, 'gridCol');
        this.rows = childrenNamed(this.tbl, DML_NS, 'tr');
        this.widths = this.gridCols.map((col: OoxmlElement) => {
            const w: number = parseEmuAttr(col, 'w');
            return w != null ? w : 0;
        });
        this.heights = this.rows.map((row: OoxmlElement) => {
            const h: number = parseEmuAttr(row, 'h');
            return h != null ? h : 0;
        });
        this.styleId = readTableStyleId(this.tbl);
    }
}
/**
 * SF-cited default single-row height when no prior row height is usable:
 * half of {@link DEFAULT_TABLE_BOUNDS} height (2×2 equal split on cy 2540000).
 *
 * @internal
 */
const DEFAULT_ADD_ROW_HEIGHT_EMU: number = 1270000;
/**
 * SF-cited default single-column width when no prior column width is usable:
 * half of {@link DEFAULT_TABLE_BOUNDS} width (2×2 equal split on cx 5080000).
 *
 * @internal
 */
const DEFAULT_ADD_COLUMN_WIDTH_EMU: number = 2540000;
/**
 *
 * @param {number} columnCount - The columnCount value.
 * @param {number} heightEmu - The heightEmu value.
 * @returns {OoxmlElement} The result.
 */
function buildEmptyTableRow(columnCount: number, heightEmu: number): OoxmlElement {
    const cells: OoxmlElement[] = [];
    for (let c: number = 0; c < columnCount; c += 1) {
        cells.push(buildEmptyTableCell());
    }
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName: 'tr',
        attributes: [{ namespaceUri: '', localName: 'h', value: String(heightEmu) }],
        children: cells,
        prefixHint: 'a'
    };
}
/**
 *
 * @param {number} widthEmu - The widthEmu value.
 * @returns {OoxmlElement} The result.
 */
function buildEmptyGridCol(widthEmu: number): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName: 'gridCol',
        attributes: [{ namespaceUri: '', localName: 'w', value: String(widthEmu) }],
        children: [],
        prefixHint: 'a'
    };
}
/**
 *
 * @param {number | undefined} explicitPoints - The explicitPoints value.
 * @param {*} existingHeightsEmu - The existingHeightsEmu value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number} The result.
 */
function resolveAddRowHeightEmu(explicitPoints: number | undefined, existingHeightsEmu: ReadonlyArray<number>,
                                partName: string | undefined): number {
    if (explicitPoints !== undefined) {
        if (typeof explicitPoints !== 'number' || !Number.isFinite(explicitPoints) || explicitPoints <= 0) {
            throw new TablesError('Row height must be a finite positive number of points', partNameOptions(partName));
        }
        const emu: number = pointsToEmu(explicitPoints);
        if (!Number.isInteger(emu) || emu < 1) {
            throw new TablesError('Row height must convert to an integer EMU >= 1', partNameOptions(partName));
        }
        return emu;
    }
    const last: number = existingHeightsEmu[existingHeightsEmu.length - 1];
    if (last !== undefined && Number.isInteger(last) && last >= 1) {
        return last;
    }
    return DEFAULT_ADD_ROW_HEIGHT_EMU;
}
/**
 *
 * @param {number | undefined} explicitPoints - The explicitPoints value.
 * @param {*} existingWidthsEmu - The existingWidthsEmu value.
 * @param {string | undefined} partName - The partName value.
 * @returns {number} The result.
 */
function resolveAddColumnWidthEmu(explicitPoints: number | undefined, existingWidthsEmu: ReadonlyArray<number>,
                                  partName: string | undefined): number {
    if (explicitPoints !== undefined) {
        if (typeof explicitPoints !== 'number' || !Number.isFinite(explicitPoints) || explicitPoints <= 0) {
            throw new TablesError('Column width must be a finite positive number of points', partNameOptions(partName));
        }
        const emu: number = pointsToEmu(explicitPoints);
        if (!Number.isInteger(emu) || emu < 1) {
            throw new TablesError('Column width must convert to an integer EMU >= 1', partNameOptions(partName));
        }
        return emu;
    }
    const last: number = existingWidthsEmu[existingWidthsEmu.length - 1];
    if (last !== undefined && Number.isInteger(last) && last >= 1) {
        return last;
    }
    return DEFAULT_ADD_COLUMN_WIDTH_EMU;
}
/**
 *
 * @param {*} rows - The rows value.
 * @param {number} columnCount - The columnCount value.
 * @param {string | undefined} partName - The partName value.
 * @returns {void} Nothing.
 */
function assertRectangularGridOrThrow(rows: ReadonlyArray<OoxmlElement>, columnCount: number, partName: string | undefined): void {
    for (let r: number = 0; r < rows.length; r += 1) {
        const tr: OoxmlElement = arrayAt(rows, r);
        if (tr === undefined) {
            continue;
        }
        const tcs: Array<OoxmlElement> = childrenNamed(tr, DML_NS, 'tc');
        if (tcs.length !== columnCount) {
            throw new TablesError(`Cannot mutate table structure: row ${String(r)} has ${String(tcs.length)} cells; expected ${String(columnCount)} (ragged grid)`, partNameOptions(partName));
        }
    }
}
/**
 *
 * @param {*} rows - The rows value.
 * @param {string | undefined} partName - The partName value.
 * @returns {void} Nothing.
 */
function assertNoMergeAttrsOrThrow(rows: ReadonlyArray<OoxmlElement>, partName: string | undefined): void {
    for (let r: number = 0; r < rows.length; r += 1) {
        const tr: OoxmlElement = arrayAt(rows, r);
        if (tr === undefined) {
            continue;
        }
        const tcs: Array<OoxmlElement> = childrenNamed(tr, DML_NS, 'tc');
        for (let c: number = 0; c < tcs.length; c += 1) {
            const tc: OoxmlElement = arrayAt(tcs, c);
            if (tc === undefined) {
                continue;
            }
            if (cellHasMergeAttrs(tc)) {
                throw new TablesError(`Cannot mutate table structure: cell (${String(r)}, ${String(c)}) has merge attributes (fail-closed)`,
                                      partNameOptions(partName));
            }
        }
    }
}
/**
 * True when any merge attribute is present beyond XSD defaults
 * (`gridSpan`/`rowSpan` > 1 or `hMerge`/`vMerge` true).
 *
 * @param {OoxmlElement} tc - The tc value.
 * @returns {boolean} The result.
 */
function cellHasMergeAttrs(tc: OoxmlElement): boolean {
    const rowSpanRaw: string = getAttr(tc, '', 'rowSpan');
    if (rowSpanRaw !== undefined && /^-?\d+$/u.test(rowSpanRaw)) {
        const n: number = Number(rowSpanRaw);
        if (Number.isSafeInteger(n) && n !== 1) {
            return true;
        }
    }
    const gridSpanRaw: string = getAttr(tc, '', 'gridSpan');
    if (gridSpanRaw !== undefined && /^-?\d+$/u.test(gridSpanRaw)) {
        const n: number = Number(gridSpanRaw);
        if (Number.isSafeInteger(n) && n !== 1) {
            return true;
        }
    }
    if (isTruthyMergeFlag(getAttr(tc, '', 'hMerge'))) {
        return true;
    }
    if (isTruthyMergeFlag(getAttr(tc, '', 'vMerge'))) {
        return true;
    }
    return false;
}
/**
 *
 * @param {string | undefined} raw - The raw value.
 * @returns {boolean} The result.
 */
function isTruthyMergeFlag(raw: string | undefined): boolean {
    if (raw === undefined) {
        return false;
    }
    const v: string = raw.trim().toLowerCase();
    return v === '1' || v === 'true';
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {OoxmlElement[]} The result.
 */
function childrenNamed(parent: OoxmlElement, namespaceUri: string, localName: string): OoxmlElement[] {
    const out: OoxmlElement[] = [];
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' &&
            child.namespaceUri === namespaceUri &&
            child.localName === localName) {
            out.push(child);
        }

    }
    return out;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {number | undefined} The result.
 */
function parseEmuAttr(el: OoxmlElement, localName: string): number | undefined {
    const raw: string = getAttr(el, '', localName);
    if (raw === undefined || !/^-?\d+$/u.test(raw)) {
        return undefined;
    }
    const n: number = Number(raw);
    return Number.isSafeInteger(n) ? n : undefined;
}
/**
 *
 * @param {OoxmlElement} tbl - The tbl value.
 * @returns {string | undefined} The result.
 */
function readTableStyleId(tbl: OoxmlElement): string | undefined {
    const tblPr: OoxmlElement = findChild(tbl, DML_NS, 'tblPr');
    if (tblPr === undefined) {
        return undefined;
    }
    const styleIdEl: OoxmlElement = findChild(tblPr, DML_NS, 'tableStyleId');
    if (styleIdEl === undefined) {
        return undefined;
    }
    const text: string = collectDirectText(styleIdEl).trim();
    return text.length > 0 ? text : undefined;
}

/**
 * Index of the first direct child with this name, or -1.
 *
 * @param parent - Element to scan.
 * @param namespaceUri - Expected namespace.
 * @param localName - Expected local name.
 * @returns Child index, or -1.
 */
function childIndexNamed(parent: OoxmlElement, namespaceUri: string, localName: string): number {
    for (let i: number = 0; i < parent.children.length; i += 1) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === namespaceUri && child.localName === localName) {
            return i;
        }
    }
    return -1;
}

/**
 * Removes every direct child with this name. No-op when absent.
 *
 * @param parent - Element to edit.
 * @param namespaceUri - Expected namespace.
 * @param localName - Expected local name.
 */
function removeNamedChild(parent: OoxmlElement, namespaceUri: string, localName: string): void {
    const mutable: MutableOoxmlElement = asMutable(parent);
    mutable.children = mutable.children.filter((child: OoxmlElement | OoxmlText): boolean => {
        return !(child.kind === 'element' && child.namespaceUri === namespaceUri && child.localName === localName);
    });
}

/**
 * Sets or replaces one unprefixed attribute. Other attributes stay in place.
 *
 * @param el - Element to edit.
 * @param localName - Attribute local name.
 * @param value - Attribute value.
 */
function setUnprefixedAttr(el: OoxmlElement, localName: string, value: string): void {  
    const mutable: MutableOoxmlElement = asMutable(el);
    const next: Array<OoxmlAttribute> = [];
    let replaced: boolean = false;
    for (let i: number = 0; i < el.attributes.length; i += 1) {
        const existing: OoxmlAttribute = arrayAt(el.attributes, i);
        if (existing.namespaceUri === '' && existing.localName === localName) {
            next.push({ namespaceUri: '', localName, value });
            replaced = true;
        }
        else {
            next.push(existing);
        }
    }
    if (!replaced) {
        next.push({ namespaceUri: '', localName, value });
    }
    mutable.attributes = next;
}
