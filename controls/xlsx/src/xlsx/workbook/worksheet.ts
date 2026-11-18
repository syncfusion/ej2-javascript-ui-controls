/**
 * Worksheet identity, sparse cell access, merged ranges, conditional formatting,
 * data validations, hyperlinks, freeze panes, page setup, and text boxes
 * (M1.1 / M1.2 / TASK-1209–1216).
 *
 * Citations:
 * - docs/specs/worksheet-cells.md; docs/specs/merged-cells.md
 * - docs/specs/conditional-formatting.md; docs/specs/data-validations.md;
 *   docs/specs/hyperlinks.md
 * - docs/specs/freeze-panes.md; docs/specs/page-setup.md
 * - docs/specs/column-properties.md (cols / col widths)
 * - docs/specs/standard-height.md (sheetFormatPr / defaultRowHeight)
 * - docs/specs/text-boxes.md (DrawingML worksheet drawings)
 * - CT_Worksheet / sheetData / sheetViews / sheetFormatPr / cols / mergeCells /
 *   conditionalFormatting / dataValidations / hyperlinks / printOptions /
 *   pageMargins / pageSetup / drawing in transitional sml.xsd
 *
 * Merge content rule: store visible values/styles on the **top-left** cell of
 * each merge. {@link Worksheet.mergedCells} does not move or clear covered cells.
 */

import { formatA1, formatA1Range, MAX_ROW, parseA1, parseA1Range } from '../address/cell-address';
import { Cell } from '../cell/cell';
import { DEFAULT_DATE_TIME_FORMAT } from '../cell/excel-date';
import { CellModel, cellModelHasResidue } from '../cell/cell-model';
import {
  InvalidAddressError,
  InvalidArgumentError,
  InvalidAutoFilterError,
  InvalidStyleIndexError,
  InvalidWorksheetError,
  MissingWorksheetPartError,
} from '../core/errors';
import {
  TABLE_CONTENT_TYPE,
  TABLE_REL_TYPE_TRANSITIONAL,
  WORKSHEET_CONTENT_TYPE_TRANSITIONAL,
  isTableRelationshipType,
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8 } from '../core/xml/minimal-xml';
import { RichTextRun } from '../shared-strings/rich-text-xml';
import { SharedStringTable } from '../shared-strings/shared-string-table';
import { WorkbookStyles, CellFormat } from '../styles/workbook-styles';
import { CellStyle } from '../styles/styles-xml';
import {
  ConditionalFormatsImpl, ConditionalFormats,
} from '../worksheet/conditional-formatting';
import {
  DataValidationsImpl, DataValidations,
} from '../worksheet/data-validations';
import {
  FreezePanesImpl, FreezePanes,
} from '../worksheet/freeze-panes';
import {
  ColumnsImpl, Columns,
} from '../worksheet/columns';
import {
  RowsImpl, Rows,
} from '../worksheet/rows';
import {
  SheetFormatPrImpl,
} from '../worksheet/sheet-format';
import {
  SortStateImpl, DataSorter,
} from '../worksheet/sort-state';
import {
  AutoFilterImpl, AutoFilter,
} from '../worksheet/auto-filter';
import {
  HyperlinksImpl, Hyperlinks,
} from '../worksheet/hyperlinks';
import {
  MergedCellsImpl, MergedCells,
} from '../worksheet/merged-cells';
import {
  PageSetupImpl, PageSetup,
} from '../worksheet/page-setup';
import {
  createRangeFromRef, Range,
} from '../worksheet/range';
import { PivotTablesImpl } from '../pivot/pivot-table';
import { PivotCachesImpl } from '../pivot/pivot-cache';
import { PivotTables } from '../pivot/pivot-types';
import {
  TablesImpl, Tables, TablesHost,
  ensureExcelSafeWorksheetTableSurface,
} from '../worksheet/tables';
import {
  parseTableXml,
  serializeTableXml, TableEntry, TablePartsModel,
} from '../worksheet/table-model';
import {
  TextBoxesImpl, TextBox,
} from '../worksheet/text-boxes';
import {
  AutoShapesImpl, AutoShapeType, Shape, ShapesCollection,
} from '../worksheet/autoshapes';
import {
  ImagesImpl, Image, ImageEntry,
} from '../worksheet/images';
import {
  ChartsImpl, Chart, ChartData, ChartType,
} from '../worksheet/charts';
import {
  FormControlsImpl, CheckBox, CheckState, ComboBox, ComboDropStyle, EditBox, EditValidation, FormButton, FormLabel, GroupBox, ListBox, OptionButton, ScrollBar, SpinButton,
} from '../worksheet/form-controls';
import {
  CommentsImpl, AddCommentOptions, Comment, Comments,
} from '../worksheet/comments';
import {
  SheetProtectionImpl, SheetProtectionInfo, SheetProtectionOptions,
} from '../worksheet/sheet-protection';
import {
  ProtectedRangesImpl, ProtectedRanges,
} from '../worksheet/protected-ranges';
import {
  ThreadedCommentsImpl, ThreadedComment,
} from '../worksheet/threaded-comments';
import {
  parseWorksheetXml,
  serializeWorksheetXml,
} from '../worksheet/worksheet-xml';
import { isCommentsRelationshipType } from '../core/package/constants';
import { PersonsStore } from './persons';
import { RichDataStore } from './rich-data-store';
import { SheetCollection } from './sheet-collection';
import { SheetKind, SheetVisibility, SheetXmlEntry } from './workbook-xml';

/**
 * Represents a single worksheet in a workbook, letting you read and write
 * its cells, formatting, tables, charts, and print settings.
 *
 * Public accessors (API-RULES R1.5): `cell`, `range`, `merges`,
 * `conditionalFormats`, `dataValidations`, `hyperlinks`, `freeze`, `pageSetup`, `textBoxes`, `images`.
 * View/state properties (API-RULES R1.1): `visibility`,
 * `isGridLinesVisible`, `isRowColumnHeadersVisible`, `isDisplayZeros`,
 * `isRightToLeft`, `zoom`.
 * Column layout: `setColumnWidth`, `getColumnWidth`. Row layout:
 * `setRowHeight`, `getRowHeight`. Sheet default row height: `standardHeight`.
 * Used extent: `usedRange`, `lastRow`, `lastColumn` (bounding box of residual
 * cells; `undefined` when the sheet has none).
 * Scroll anchors: `topLeftCell` (`sheetView@topLeftCell`) and
 * `paneTopLeftCell` (`pane@topLeftCell`). Not {@link selectedRange}.
 * Sorting metadata: `dataSorter`, `addDataSorter`, `removeDataSorter` (state
 * record only — never a grid sort operation).
 */
export interface Worksheet {
  /** The sheet's name, shown on its tab — unique in the workbook. */
  name: string;
  /**
   * Whether the sheet is visible. Assign `false` to hide it. A sheet
   * loaded as "very hidden" reports `false` and keeps that state until
   * this property is set.
   */
  visibility: boolean;
  /**
   * Whether the sheet shows gridlines on screen. Default `true`. Hiding
   * gridlines affects only the screen — printing them is a separate
   * setting on {@link Worksheet.pageSetup}.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isGridLinesVisible: boolean;
  /**
   * Whether the sheet shows its row numbers and column letters.
   * Default `true`. Affects only the screen, not printing.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isRowColumnHeadersVisible: boolean;

  /**
   * Whether the sheet shows cells that contain zero. Default `true` — set
   * to `false` to leave zero-valued cells looking empty.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isDisplayZeros: boolean;
  /**
   * Whether the sheet is laid out right-to-left — the direction used by
   * scripts like Arabic and Hebrew. Default `false`.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isRightToLeft: boolean;
  /**
   * The zoom percentage the sheet opens at — for example `150` for 150%.
   * Default `100`.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   * @throws InvalidArgumentError when the value is not a finite integer ≥ 0
   */
  zoom: number;
  /**
   * The top-left cell of the normal scroll viewport — where the sheet is
   * scrolled to when it is not split. `undefined` when the file does not
   * store one. Not the freeze anchor and not {@link selectedRange}.
   *
   * Assign `'C10'` or `undefined` to clear. Reading this never creates cells.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   * @throws InvalidAddressError when the assigned address is not a single cell
   */
  topLeftCell: string | undefined;
  /**
   * The top-left cell of the active pane viewport (`pane` scroll anchor),
   * including split and unfrozen panes. `undefined` when there is no pane
   * or the pane does not store one. Not {@link Worksheet.topLeftCell}.
   *
   * Assigning does not create a freeze or a split. The sheet must already
   * have a pane (`freeze`, or a loaded split).
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   * @throws InvalidArgumentError when there is no pane to attach the cell to
   * @throws InvalidAddressError when the assigned address is not a single cell
   */
  paneTopLeftCell: string | undefined;
  /**
   * @private
   * Stable workbook relationship id (`r:id`).
   * Package identity — prefer sheet name/index for application code.
   */
  readonly relId: string;
  /**
   * @private
   * `CT_Sheet` sheetId.
   * Package identity — prefer sheet name/index for application code.
   */
  readonly sheetId: number;
  /**
   * @private
   * Resolved OPC part name when internal.
   * Package identity — not needed for normal spreadsheet work.
   */
  readonly partName: string | undefined;
  /** @private worksheet vs other (chartsheet, etc.). */
  readonly kind: SheetKind;
  /**
   * The merged areas on this sheet. For merging one range at a time,
   * `sheet.range('A1:B2').merge()` is often simpler.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly merges: MergedCells;
  /**
   * The conditional-formatting rules on this sheet — visual highlights
   * such as color scales, data bars, and icon sets.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly conditionalFormats: ConditionalFormats;
  /**
   * The data-validation rules on this sheet — restrictions on what can be
   * typed into cells, with optional input prompts and error alerts.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly dataValidations: DataValidations;
  /**
   * The hyperlinks on this sheet. For links on a single cell,
   * `cell.hyperlink` is often simpler.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly hyperlinks: Hyperlinks;
  /**
   * The sheet's frozen rows and columns — what stays fixed while the rest
   * scrolls.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly freeze: FreezePanes;
  /**
   * The sheet's printing settings — paper size, orientation, margins,
   * headers and footers, and what part of the sheet prints.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly pageSetup: PageSetup;
  /**
   * Internal column records for this worksheet (`cols` / `col`).
   *
   * Public authoring uses {@link Worksheet.setColumnWidth} /
   * {@link Worksheet.getColumnWidth} only. Enumeration via {@link Columns.list}
   * is package-internal (no dense allocation).
   *
   * Citations: docs/specs/column-properties.md; transitional sml.xsd
   * `CT_Cols` / `CT_Col`; ECMA-376-1 §18.3.1.17 / §18.3.1.12.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   * @private
   */
  readonly columns: Columns;
  /**
   * Set the width of a column, measured in the character units Excel uses
   * for column widths — `10` fits roughly ten characters of the default
   * font. Setting a width never creates cells.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @param width - The new width, in character units (≥ 0).
   * @throws InvalidArgumentError when index or width is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setColumnWidth(index: number, width: number): void;
  /**
   * The effective width of a column in character units, or `0` when it
   * has no custom width.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getColumnWidth(index: number): number;
  /**
   * Internal sparse row records for authored row properties (`row/@ht`).
   * Public authoring uses {@link Worksheet.setRowHeight} /
   * {@link Worksheet.getRowHeight} only.
   *
   * @private
   */
  readonly rows: Rows;
  /**
   * Set the height of a row, in points. Setting a height never creates
   * cells.
   *
   * @param index - The 1-based row number.
   * @param height - The new height, in points (≥ 0).
   * @throws InvalidArgumentError when index or height is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setRowHeight(index: number, height: number): void;
  /**
   * The height of a row in points, or `0` when it has no custom height.
   *
   * @param index - The 1-based row number.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getRowHeight(index: number): number;
  /**
   * Whether a column is hidden (`col@hidden`). Hidden and width 0 are independent.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isColumnHidden(index: number): boolean;
  /**
   * Hide or show a column. Hide snapshots the current width; show restores it.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @param hidden - `true` to hide, `false` to show.
   * @throws InvalidArgumentError when index or hidden is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setColumnHidden(index: number, hidden: boolean): void;
  /**
   * The stored unhide width of a hidden column, or `0` when no snapshot exists.
   * While hidden, setting this also updates the live width.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getColumnHiddenWidth(index: number): number;
  /**
   * Set the stored unhide width for a column. Used when a hidden column is shown.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @param width - The unhide width, in character units (≥ 0).
   * @throws InvalidArgumentError when index or width is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setColumnHiddenWidth(index: number, width: number): void;
  /**
   * Whether a column is locked (read-only). `true` unless the column style xf
   * has `protection/@locked="0"`. Absence of style or protection means locked.
   *
   * @param index - The 1-based column number — `1` is column A.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isColumnLocked(index: number): boolean;
  /**
   * Whether a row is hidden (`row@hidden`). Hidden and height 0 are independent.
   *
   * @param index - The 1-based row number.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  isRowHidden(index: number): boolean;
  /**
   * Hide or show a row. Hide snapshots the current height; show restores it.
   *
   * @param index - The 1-based row number.
   * @param hidden - `true` to hide, `false` to show.
   * @throws InvalidArgumentError when index or hidden is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setRowHidden(index: number, hidden: boolean): void;
  /**
   * The stored unhide height of a hidden row, or `0` when no snapshot exists.
   * While hidden, setting this also updates the live height.
   *
   * @param index - The 1-based row number.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getRowHiddenHeight(index: number): number;
  /**
   * Set the stored unhide height for a row. Used when a hidden row is shown.
   *
   * @param index - The 1-based row number.
   * @param height - The unhide height, in points (≥ 0).
   * @throws InvalidArgumentError when index or height is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setRowHiddenHeight(index: number, height: number): void;
  /**
   * Whether a row has an explicit custom height flag, independent of the actual height.
   *
   * @param index - The 1-based row number.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  hasCustomRowHeight(index: number): boolean;
  /**
   * Set the explicit custom height flag on a row without changing the stored height.
   *
   * @param index - The 1-based row number.
   * @param custom - `true` to mark as custom, `false` to clear it.
   * @throws InvalidArgumentError when index or custom is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  setCustomRowHeight(index: number, custom: boolean): void;
  /**
 /**
  * Get the resolved style (fill, font, border, alignment, number format, protection)
   * applied to a row when `customFormat="1"` is set, or `undefined` when the row
   * has no authored style. The row style does not create a cell record.
   *
   * Precedence: row `s` attribute (when `customFormat="1"`) is resolved through
   * `cellXfs` just like cell styles. Empty cells in the row inherit this style;
   * cells with their own styles override it.
   *
   * @param index - The 1-based row number.
   * @returns The resolved style properties (fill, font, border, etc), or `undefined`
   *          when the row has no style or `customFormat` is not set.
   * @throws InvalidArgumentError when index is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   *
   * Citations: ECMA-376-1 §18.3.1.73 `row@s` / `@customFormat`
   */
  getRowStyle(index: number): CellFormat | undefined;
  /**
   * Sheet default row height in points (`sheetFormatPr@defaultRowHeight`).
   * Returns `0` when the sheet has no authored or loaded standard height.
   * Setting authors `sheetFormatPr` with the required attribute; never densifies
   * the grid.
   *
   * Citations: docs/specs/standard-height.md; sml.xsd CT_SheetFormatPr/
   * @defaultRowHeight; API-RULES R1.4.
   *
   * @throws InvalidArgumentError when value is not a finite number ≥ 0
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  standardHeight: number;
  /**
   * The tables on this sheet — formatted, named ranges of cells with
   * headers, banded rows, and optional totals rows.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly tables: Tables;
  /**
   * The pivot tables authored on this sheet — reports that summarize a
   * pivot cache's source data. Pivot tables read from a file are listed and
   * editable; ones the library cannot describe completely are kept unchanged
   * and not listed. The library writes the definition and cache
   * and sets the cache to refresh on open, so Excel fills in the report
   * body; it does not compute the summarized values itself.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   * @example
   * ```ts
   * const cache = workbook.pivotCaches.add(sheet.range('A1:D100'));
   * const pivot = workbook.sheet('Report').pivotTables.add(cache, { name: 'Sales', location: 'A3' });
   * pivot.rowFields.add('Region');
   * pivot.dataFields.add(pivot.fields.get('Amount'));
   * ```
   */
  readonly pivotTables: PivotTables;
  /**
   * The sort recorded for this sheet — a note of which range was sorted
   * and how, kept from a previous sort. The library stores and re-saves
   * it; it never rearranges cell data. `undefined` when the sheet has no
   * sort record.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly dataSorter: DataSorter | undefined;
  /**
   * Record a sort for this sheet, or replace the existing one. The range
   * itself is unaffected — no cells are moved or created.
   *
   * The range is never densified: authoring a sort state allocates no cells.
   *
   * @param range - The whole range of data to sort, like `'A1:C10'`
   *   (required).
   * @returns the sort record, for setting its flags and conditions.
   * @throws InvalidArgumentError when `range` is missing/empty
   * @throws InvalidSortStateError when `range` does not parse as an A1 range
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addDataSorter(range: string): DataSorter;
  /**
   * Remove the sheet's sort record. Does nothing when there is none.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeDataSorter(): void;
  /**
   * The filter criteria recorded for this sheet, when a filter is set.
   * Only the criteria are stored — no rows are ever hidden by this
   * library.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly autoFilter: AutoFilter | undefined;
  /**
   * Set a filter on a range of cells, or replace the existing one. Only
   * the criteria are recorded — the library never hides rows; Excel
   * applies the filter when it opens the file.
   *
   * @param range - The range to filter, like `'A1:D10'` (required).
   * @returns the filter, for choosing values per column.
   * @throws InvalidArgumentError when `range` is missing/empty
   * @throws InvalidAutoFilterError when `range` does not parse as an A1 range
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addAutoFilter(range: string): AutoFilter;
  /**
   * Remove the sheet's filter. Does nothing when there is none.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeAutoFilter(): void;
  /**
   * The text boxes on this sheet, in the order they were added.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly textBoxes: ReadonlyArray<TextBox>;
  /**
   * The shapes on this sheet — rectangles, ellipses, arrows, and other
   * preset shapes. Add with {@link addShape}.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly shapes: ShapesCollection;
  /** The pictures placed on this sheet, floating above the cells. */
  readonly images: ReadonlyArray<Image>;
  /**
   * The charts embedded on this sheet.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly charts: ReadonlyArray<Chart>;
  /**
   * The smallest rectangle that contains every cell that still has a value,
   * formula, style, or other stored content. `undefined` when the sheet has
   * no such cells.
   *
   * Column widths, row heights, merges, and the file's `dimension` hint do
   * not count by themselves. Reading this never creates cells.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly usedRange: Range | undefined;
  /**
   * The 1-based row of the bottom-most cell that still has content, or
   * `undefined` when the sheet has none. Same edge as {@link usedRange}.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly lastRow: number | undefined;
  /**
   * The 1-based column of the right-most cell that still has content
   * (`1` is column A), or `undefined` when the sheet has none. Same edge as
   * {@link usedRange}.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly lastColumn: number | undefined;
  /**
   * A1 address Excel highlights on this sheet (`selection@sqref` of the
   * primary view), or `undefined` when the sheet has no stored selection.
   *
   * A string such as `'B7'` or `'B2:D5'`. A whole-column selection is reported
   * with XlsIO's row cap (`'F1:G65536'`), not the OOXML grid max. Assign that
   * string or `undefined` to clear it. A {@link Range} from {@link range} is
   * also accepted at runtime (TypeScript 3.3 cannot type that on the setter).
   * Reading this never creates cells and does not change {@link usedRange}.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   * @throws InvalidAddressError when the assigned address is not a single range
   */
  selectedRange: string | undefined;
  /**
   * Get a cell, either by its address — `sheet.cell('B2')` — or by its
   * 1-based position — `sheet.cell(2, 2)`. No storage is used until a
   * value is set on the cell.
   *
   * @throws InvalidAddressError when the address is not a single cell reference
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  cell(addressOrRow: string | number, column?: number): Cell;
  /**
   * Get a cell by its A1 address, like `'B2'`. An alias of
   * `sheet.cell(address)`.
   *
   * @throws InvalidAddressError when the address is not a single cell reference
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getCell(address: string): Cell;
  /**
   * Get a rectangular area of cells — `sheet.range('A1:C3')` — for
   * reading or merging.
   *
   * @throws InvalidMergeRefError when the ref is malformed
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  range(ref: string): Range;
  /**
   * The merged areas on this sheet.
   * @deprecated Prefer {@link merges}. Kept as a compatibility alias.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  readonly mergedCells: MergedCells;
  /**
   * Cell handle at an A1 address.
   * @deprecated Prefer {@link cell}, which also accepts 1-based
   *   `(row, column)`. Kept as a compatibility alias.
   *
   * @throws InvalidAddressError when the address is not a single cell reference
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getCell(address: string): Cell;
  /**
   * Add a text box anchored at a cell. Size is width and height in points
   * (72 pt = 1 in).
   *
   * @param row - The 1-based row the box's top edge is anchored to.
   * @param column - The 1-based column the box's left edge is anchored to.
   * @param width - The box's width, in points, like `144` (2 in).
   * @param height - The box's height, in points, like `72` (1 in).
   * @param text - The text shown inside the box; default empty.
   * @returns the newly created text box.
   * @throws InvalidArgumentError when geometry is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addTextBox(
    row: number,
    column: number,
    width: number,
    height: number,
    text?: string,
  ): TextBox;
  /**
   * Remove a text box.
   *
   * @param target - The text box to remove, or its zero-based position
   *   among the sheet's text boxes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeTextBox(target: TextBox | number): void;
  /**
   * Add a shape anchored at a cell — a rectangle, ellipse, arrow, or
   * another preset. Size is width and height in points (72 pt = 1 in).
   * Set fill, outline, and text on the returned shape.
   *
   * @param type - The kind of shape, like `AutoShapeType.Rectangle`.
   * @param row - The 1-based row the shape's top edge is anchored to.
   * @param column - The 1-based column the shape's left edge is anchored to.
   * @param width - The shape's width, in points, like `144` (2 in).
   * @param height - The shape's height, in points, like `72` (1 in).
   * @param text - The text shown inside the shape, when any.
   * @param name - The name identifying the shape; generated when omitted.
   * @param altText - The alt text for accessibility tools, when any.
   * @param rotation - How far to turn the shape, in degrees clockwise.
   * @param moveWithCell - Whether the shape moves with its anchor cells.
   *   Default `true`.
   * @param sizeWithCell - Whether the shape resizes with its anchor cells.
   *   Default `false`.
   * @returns the newly created shape.
   * @throws InvalidArgumentError when geometry is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addShape(
    type: AutoShapeType,
    row: number,
    column: number,
    width: number,
    height: number,
    text?: string,
    name?: string,
    altText?: string,
    rotation?: number,
    moveWithCell?: boolean,
    sizeWithCell?: boolean,
  ): Shape;
  /**
   * Remove a shape.
   *
   * @param target - The shape to remove, or its zero-based position among
   *   the sheet's shapes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeShape(target: Shape | number): void;
  /**
   * Add a picture to the sheet, anchored at a cell and floating above the
   * cells. The picture format is detected from `bytes`.
   *
   * @param bytes - The raw bytes of the picture file.
   * @param row - The 1-based row the picture's top edge is anchored to.
   * @param column - The 1-based column the picture's left edge is anchored to.
   * @param width - Picture width in points (72 points = 1 inch). Example: `144` = 2 inches.
   * @param height - Picture height in points (72 points = 1 inch). Example: `72` = 1 inch.
   * @returns the newly added picture.
   * @throws InvalidArgumentError when geometry or bytes are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addImage(
    bytes: Uint8Array,
    row: number,
    column: number,
    width: number,
    height: number,
  ): Image;
  /**
   * Remove a picture from the sheet.
   *
   * @param target - The picture to remove, or its zero-based position
   *   among the sheet's pictures.
   */
  removeImage(target: Image | number): void;
  /**
   * Add a chart on this worksheet — column, line, pie, funnel, waterfall,
   * and other {@link ChartType} layouts. Pass type, position, size, and a
   * data argument (`dataRange` string, category/values formulas, or
   * {@link ChartData}). Presentation (title, legend, axes) is set on the
   * returned {@link Chart}; more series via {@link Chart.addSeries}. Drawing
   * and chart parts are written on save.
   *
   * @param type - Chart layout from {@link ChartType}.
   * @param row - Top-left row (1-based).
   * @param column - Top-left column (1-based; 1 = A).
   * @param width - Width in points.
   * @param height - Height in points.
   * @param data - A1 range string, category-label formula string(s), or
   *   {@link ChartData}. Pass `''` to create an empty chart and add series
   *   with {@link Chart.addSeries}.
   * @param values - Values formula when `data` is category-label formula(s).
   * @returns the newly created chart.
   * @throws InvalidChartError when arguments are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addChart(
    type: ChartType,
    row: number,
    column: number,
    width: number,
    height: number,
    data: string | ReadonlyArray<string> | ChartData,
    values?: string,
  ): Chart;
  /**
   * Remove a chart from the sheet.
   *
   * @param target - The chart to remove, or its zero-based position among
   *   the sheet's charts.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeChart(target: Chart | number): void;
  /** The check boxes on this sheet, in the order they were added. */
  readonly checkBoxes: ReadonlyArray<CheckBox>;
  /** The combo boxes and drop-downs on this sheet. */
  readonly comboBoxes: ReadonlyArray<ComboBox>;
  /** The option buttons (radio buttons) on this sheet. */
  readonly optionButtons: ReadonlyArray<OptionButton>;
  /**
   * Add a check box anchored at a cell. Size is width and height in points
   * (72 pt = 1 in).
   *
   * @param row - The 1-based row the box's top edge is anchored to.
   * @param column - The 1-based column the box's left edge is anchored to.
   * @param width - The box's width, in points, like `72` (1 in).
   * @param height - The box's height, in points, like `18`.
   * @param name - The name identifying the box; generated when omitted.
   * @param text - The label shown beside the box.
   * @param checkState - The box's initial state; default unchecked.
   * @param linkedCell - The cell that reports the box's state.
   * @param isDisplay3DShading - Whether the box is drawn 3-D; default
   *   `true`.
   * @returns the newly created check box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addCheckBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    checkState?: CheckState,
    linkedCell?: string,
    isDisplay3DShading?: boolean,
  ): CheckBox;
  /**
   * Add an editable combo box — a drop-down that can also be typed into.
   *
   * @param dropStyle - The kind of drop behavior; default `'combo'`.
   * @returns the newly created combo box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addComboBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    dropDownLines?: number,
    dropStyle?: ComboDropStyle,
    isDisplay3DShading?: boolean,
  ): ComboBox;
  /**
   * Add a combo box that can also be typed into, like a browser's
   * address bar with suggestions.
   *
   * @returns the newly created combo box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addComboEditBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    dropDownLines?: number,
    isDisplay3DShading?: boolean,
  ): ComboBox;
  /**
   * Add a simple drop-down — the list stays visible only while its button
   * is held.
   *
   * @returns the newly created combo box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addComboDropdown(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    dropDownLines?: number,
    isDisplay3DShading?: boolean,
  ): ComboBox;
  /**
   * Add an option button (radio button). Only one button in a group can
   * be selected at a time.
   *
   * @param isFirstButton - Whether this is the first button of its group —
   *   the anchor that links them. Default `false`.
   * @returns the newly created option button.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addOptionButton(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    checkState?: CheckState,
    linkedCell?: string,
    isDisplay3DShading?: boolean,
    isFirstButton?: boolean,
  ): OptionButton;
  /**
   * Remove a check box.
   *
   * @param target - The check box to remove, or its zero-based position
   *   among the sheet's check boxes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeCheckBox(target: CheckBox | number): void;
  /**
   * Remove a combo box.
   *
   * @param target - The combo box to remove, or its zero-based position
   *   among the sheet's combo boxes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeComboBox(target: ComboBox | number): void;
  /**
   * Remove an option button.
   *
   * @param target - The option button to remove, or its zero-based
   *   position among the sheet's option buttons.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeOptionButton(target: OptionButton | number): void;
  /** The buttons on this sheet. */
  readonly buttons: ReadonlyArray<FormButton>;
  /** The list boxes on this sheet. */
  readonly listBoxes: ReadonlyArray<ListBox>;
  /** The group boxes on this sheet — frames that group related controls. */
  readonly groupBoxes: ReadonlyArray<GroupBox>;
  /** The text labels on this sheet. */
  readonly formLabels: ReadonlyArray<FormLabel>;
  /** The scroll bars on this sheet. */
  readonly scrollBars: ReadonlyArray<ScrollBar>;
  /** The spin buttons on this sheet — up/down steppers for values. */
  readonly spinButtons: ReadonlyArray<SpinButton>;
  /** The edit boxes (text fields) on this sheet. */
  readonly editBoxes: ReadonlyArray<EditBox>;
  /**
   * Add a button that can trigger an assigned macro when clicked. The
   * macro name is stored only — it is never executed by this library.
   *
   * @param text - The text shown on the button face.
   * @param onAction - The macro to run when clicked, by name.
   * @returns the newly created button.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addButton(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    onAction?: string,
  ): FormButton;
  /**
   * Add a list box showing entries from a range of cells.
   *
   * @param listFillRange - The cells the list's entries come from.
   * @param linkedCell - The cell the selected entry is written to.
   * @param selectionType - How many entries can be picked; default `'single'`.
   * @returns the newly created list box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addListBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    selectionType?: 'single' | 'multi' | 'extended',
    selectedIndices?: ReadonlyArray<number>,
    isDisplay3DShading?: boolean,
    value?: number,
  ): ListBox;
  /**
   * Add a group box — a labeled frame that groups related controls, such
   * as a set of option buttons.
   *
   * @param text - The caption shown on the frame's border.
   * @param groupLinkedCell - The cell that reports which option button in
   *   the group is selected.
   * @returns the newly created group box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addGroupBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    groupLinkedCell?: string,
  ): GroupBox;
  /**
   * Add a plain text label.
   *
   * @param text - The text shown on the label.
   * @param textLink - The cell whose value the label shows, when linked.
   * @returns the newly created label.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addFormLabel(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    textLink?: string,
  ): FormLabel;
  /**
   * Add a scroll bar for changing a value smoothly by dragging.
   *
   * @param linkedCell - The cell the position is written to.
   * @param min / max - The lowest / highest position.
   * @param incrementalChange - Movement per arrow click.
   * @param pageChange - Movement per track click.
   * @param isHorizontal - Lay the bar out horizontally; default vertical.
   * @returns the newly created scroll bar.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addScrollBar(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    linkedCell?: string,
    value?: number,
    min?: number,
    max?: number,
    incrementalChange?: number,
    pageChange?: number,
    isHorizontal?: boolean,
  ): ScrollBar;
  /**
   * Add a spin button — paired up/down arrows that step a value.
   *
   * @param linkedCell - The cell the value is written to.
   * @param min / max - The lowest / highest value.
   * @param incrementalChange - Movement per arrow click.
   * @returns the newly created spin button.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addSpinButton(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    linkedCell?: string,
    value?: number,
    min?: number,
    max?: number,
    incrementalChange?: number,
  ): SpinButton;
  /**
   * Add an edit box — a text field users can type into.
   *
   * @param textLink - The cell that shows what the user typed, when linked.
   * @param isMultiLine - Allow line breaks in the text.
   * @param validation - The kind of entry expected; default `'text'`.
   * @param isPassword - Mask the text like a password field.
   * @returns the newly created edit box.
   * @throws InvalidArgumentError when options are invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addEditBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    textLink?: string,
    isMultiLine?: boolean,
    validation?: EditValidation,
    isPassword?: boolean,
  ): EditBox;
  /**
   * Remove a button.
   *
   * @param target - The button to remove, or its zero-based position
   *   among the sheet's buttons.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeButton(target: FormButton | number): void;
  /**
   * Remove a list box.
   *
   * @param target - The list box to remove, or its zero-based position
   *   among the sheet's list boxes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeListBox(target: ListBox | number): void;
  /**
   * Remove a group box.
   *
   * @param target - The group box to remove, or its zero-based position
   *   among the sheet's group boxes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeGroupBox(target: GroupBox | number): void;
  /**
   * Remove a form label.
   *
   * @param target - The label to remove, or its zero-based position among
   *   the sheet's labels.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeFormLabel(target: FormLabel | number): void;
  /**
   * Remove a scroll bar.
   *
   * @param target - The scroll bar to remove, or its zero-based position
   *   among the sheet's scroll bars.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeScrollBar(target: ScrollBar | number): void;
  /**
   * Remove a spin button.
   *
   * @param target - The spin button to remove, or its zero-based position
   *   among the sheet's spin buttons.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeSpinButton(target: SpinButton | number): void;
  /**
   * Remove an edit box.
   *
   * @param target - The edit box to remove, or its zero-based position
   *   among the sheet's edit boxes.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeEditBox(target: EditBox | number): void;

  /**
   * Discussion threads on this sheet, in document order.
   */
  readonly threadedComments: ReadonlyArray<ThreadedComment>;

  /**
   * Remove one discussion thread and all of its replies.
   *
   * @param target - The thread to remove, or its zero-based index on the sheet.
   * @throws InvalidArgumentError when the target is invalid
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeThreadedComment(target: ThreadedComment | number): void;

  /**
   * Remove every discussion thread (and reply) on this sheet.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  clearThreadedComments(): void;

  /**
   * `true` when this worksheet is protected.
   */
  readonly isProtected: boolean;

  /**
   * Current sheet protection settings, or `undefined` when the sheet is not protected.
   */
  readonly sheetProtection: SheetProtectionInfo | undefined;

  /**
   * Protect this worksheet so users can only do what you allow.
   *
   * @param password - Optional password required to unprotect later.
   * @param options - Which actions remain allowed (select cells, format, sort, …).
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  protect(password?: string, options?: SheetProtectionOptions): void;

  /**
   * Remove worksheet protection.
   *
   * @param password - Required when the sheet was protected with a password.
   * @throws InvalidProtectionError when password is required/wrong
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  unprotect(password?: string): void;

  /**
   * Ranges users may still edit while the rest of the sheet is protected.
   */
  readonly protectedRanges: ProtectedRanges;

  /**
   * Classic sticky notes on this sheet.
   */
  readonly comments: Comments;

  /**
   * Add a classic sticky note on a cell.
   *
   * @param options - Target cell (`ref` or `row`/`column`) plus optional text, author, visibility, and size.
   * @throws InvalidCommentError when the cell already has a note
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  addComment(options: AddCommentOptions): Comment;

  /**
   * Remove a classic sticky note by handle, A1 address, or zero-based index.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  removeComment(target: Comment | string | number): void;

  /**
   * `true` when the given cell has a classic sticky note.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  hasComment(ref: string): boolean;
  hasComment(row: number, column: number): boolean;

  /**
   * Classic sticky note on the given cell, or `undefined` if none.
   *
   * @throws InvalidWorksheetError when the sheet is not a worksheet
   */
  getComment(ref: string): Comment | undefined;
  getComment(row: number, column: number): Comment | undefined;
}

/**
 * Host surface supplied by {@link Workbook} for cell SST and package I/O.
 * @private
 */
export interface WorksheetCellHost {
  readonly package: OpcPackage;
  sharedStrings(): SharedStringTable;
  /** Workbook styles table (cellXfs / ensure*). */
  styles(): WorkbookStyles;
  /** Workbook persons store (threaded-comment authors). */
  persons(): PersonsStore;
  /**
   * Live workbook 1904 date-system flag (`workbookPr/@date1904`).
   * Used by {@link Cell.dateTime} serial conversion.
   */
  date1904(): boolean;
  markDirty(): void;
  /** Allocate the next table part name (`/xl/tables/tableN.xml`). */
  nextTablePartName(): string;
  /** Record an observed table id for workbook-unique max+1 allocation. */
  noteTableId(id: number): void;
  /**
   * After a dirty flush densifies sheet table parts to `table1..count`,
   * advance workbook allocation so the next add uses `table{count+1}`.
   */
  noteTablePartCount(count: number): void;
  /** Allocate the next workbook-unique table id (max observed + 1). */
  allocateTableId(): number;
  /** Workbook pivot caches (ownership checks for `pivotTables.add`). */
  pivotCaches(): PivotCachesImpl;
  /** Workbook metadata and rich-value store (Picture in Cell). */
  richData(): RichDataStore;
}

/**
 * Mutable worksheet implementation.
 * @private
 */
export class WorksheetImpl implements Worksheet {
  private collection: SheetCollection;
  private _name: string;
  private _visibility: SheetVisibility;
  private readonly _sheetId: number;
  private readonly _relId: string;
  private readonly _partName: string | undefined;
  private readonly _kind: SheetKind;
  private readonly extraAttrsXml: string;

  /** Sparse storage: row → col → model. */
  private readonly cellRows = new Map<number, Map<number, CellModel>>();
  private sheetMeta:
    | {
        beforeSheetDataXml: string[];
        afterSheetDataXml: string[];
        rootExtraAttrsXml: string;
      }
    | undefined;
  private sheetDataLoaded = false;
  private cellsDirty = false;
  private cellHost: WorksheetCellHost | undefined;
  private readonly _mergedCells = new MergedCellsImpl();
  private readonly _conditionalFormats = new ConditionalFormatsImpl();
  private readonly _dataValidations = new DataValidationsImpl();
  private readonly _hyperlinks = new HyperlinksImpl();
  private readonly _freeze = new FreezePanesImpl();
  private readonly _columns = new ColumnsImpl();
  private readonly _rowProperties = new RowsImpl();
  private readonly _sheetFormat = new SheetFormatPrImpl();
  private readonly _sortState = new SortStateImpl();
  private readonly _autoFilter = new AutoFilterImpl();
  private readonly _pageSetup = new PageSetupImpl();
  /** Lazy tables collection; host wires into the wire plumbing lazily. */
  private _tables: TablesImpl | undefined;
  /** Lazy authored pivot tables collection. */
  private _pivotTables: PivotTablesImpl | undefined;
  /**
   * Worksheet `tableParts` refs from the parsed part plus lazily resolved
   * table entries (`CT_Table`). TASK-1210 wire scope: parse/serialize +
   * package plumbing; the public `Worksheet.tables` façade lands in
   * TASK-1211.
   */
  private tablePartsModel: TablePartsModel = { relIds: [], extraAttrsXml: '' };
  /**
   * Resolved tables in file order: relId (worksheet relationship id) and the
   * parsed table entry. Entries whose part failed to parse or is missing are
   * soft-skipped here but their package parts stay untouched (preserve).
   */
  private readonly tableEntries: { relId: string; entry: TableEntry }[] = [];
  private tablesResolved = false;
  /**
   * Entries mutated since the last flush (localized mutation: only these
   * table parts are rewritten; untouched siblings keep their original bytes).
   */
  private readonly dirtyTableEntries = new Set<TableEntry>();
  private readonly _textBoxes = new TextBoxesImpl();
  private readonly _autoShapes = new AutoShapesImpl();
  private readonly _images = new ImagesImpl();
  private readonly _charts = new ChartsImpl();
  private readonly _formControls = new FormControlsImpl();
  private readonly _comments = new CommentsImpl();
  private readonly _protection = new SheetProtectionImpl();
  private readonly _protectedRanges = new ProtectedRangesImpl();
  private readonly _threadedComments = new ThreadedCommentsImpl();

  public constructor(
    collection: SheetCollection,
    entry: SheetXmlEntry,
    partName: string | undefined,
    kind: SheetKind,
  ) {
    this.collection = collection;
    this._name = entry.name;
    this._visibility = entry.state;
    this._sheetId = entry.sheetId;
    this._relId = entry.relId;
    this._partName = partName;
    this._kind = kind;
    this.extraAttrsXml = entry.extraAttrsXml;
    this._mergedCells.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._conditionalFormats.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      styles: () => this.requireCellHost().styles(),
    });
    this._dataValidations.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._hyperlinks.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      applyDisplayText: (address, text) => {
        this.getCell(address).value = text;
      },
    });
    this._freeze.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._columns.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._rowProperties.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._sheetFormat.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._sortState.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._autoFilter.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      columnValues: (columnIndex) => this.filterColumnValues(columnIndex),
    });
    this._pageSetup.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      getPrintName: (name) => this.collection.getPrintName(name, this),
      setPrintName: (name, content) => this.collection.setPrintName(name, this, content),
    });
    // Package is rebound in bindCellHost once the workbook cell host exists.
    this._textBoxes.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet text-box host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
    });
    // Auto-shapes host binding (deferred to bindCellHost).
    this._autoShapes.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet auto-shape host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
    });
    this._images.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet image host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
      getRowHeightPt: (row: number) => this._rowProperties.getRowHeight(row),
      getColumnWidthChars: (column: number) => this._columns.getColumnWidth(column),
      setCellPlaceholder: (row: number, column: number, on: boolean) => {
        this.setImagePlaceholder(row, column, on);
      },
      markPlacedChanged: () => {
        this.requireCellHost().richData().markDirty();
      },
    });
    this._charts.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet chart host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
      sheetName: this._name,
      getRowHeightPt: (row: number) => this._rowProperties.getRowHeight(row),
      getColumnWidthChars: (column: number) => this._columns.getColumnWidth(column),
    });
    this._formControls.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet form-control host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
    });
    this._comments.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet comments host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
    });
    this._comments.bindFormControls(this._formControls);
    this._protection.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._protectedRanges.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
    });
    this._threadedComments.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      get package(): OpcPackage {
        throw new InvalidWorksheetError(
          'Worksheet threaded-comments host package is not available until bound',
        );
      },
      sheetPartName: this._partName,
      persons: () => {
        throw new InvalidWorksheetError(
          'Worksheet threaded-comments persons store is not available until bound',
        );
      },
    });
  }

  /** @private */
  public bindCollection(collection: SheetCollection): void {
    this.collection = collection;
  }

  /** @private */
  public bindCellHost(host: WorksheetCellHost): void {
    this.cellHost = host;
    this._textBoxes.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
    });
    this._autoShapes.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
    });
    this._images.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
      getRowHeightPt: (row: number) => this._rowProperties.getRowHeight(row),
      getColumnWidthChars: (column: number) => this._columns.getColumnWidth(column),
      setCellPlaceholder: (row: number, column: number, on: boolean) => {
        this.setImagePlaceholder(row, column, on);
      },
      markPlacedChanged: () => {
        this.requireCellHost().richData().markDirty();
      },
    });
    this._charts.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
      sheetName: this._name,
      getRowHeightPt: (row: number) => this._rowProperties.getRowHeight(row),
      getColumnWidthChars: (column: number) => this._columns.getColumnWidth(column),
    });
    this._formControls.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
    });
    this._comments.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
    });
    this._comments.bindFormControls(this._formControls);
    this._threadedComments.bindHost({
      markDirty: () => {
        this.markCellsDirty();
      },
      package: host.package,
      sheetPartName: this._partName,
      persons: () => host.persons(),
    });
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this.collection.rename(this, value);
  }

  public get visibility(): boolean {
    return this._visibility !== 'hidden' && this._visibility !== 'veryHidden';
  }

  public set visibility(value: boolean) {
    this.collection.setVisibility(this, value ? 'visible' : 'hidden');
  }

  /**
   * On-screen gridline visibility (`sheetView@showGridLines`).
   *
   * Citations: docs/specs/worksheet-view.md; transitional sml.xsd
   * `CT_SheetView/@showGridLines` (default `true`); API-RULES R1.2 / R1.4.
   */
  public get isGridLinesVisible(): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support gridline visibility`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getGridLinesVisible();
  }

  public set isGridLinesVisible(value: boolean) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support gridline visibility`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setGridLinesVisible(value);
  }


  /**
   * Row/column header visibility (`sheetView@showRowColHeaders`).
   *
   * Citations: docs/specs/worksheet-view.md; transitional sml.xsd
   * `CT_SheetView/@showRowColHeaders` (default `true`); API-RULES R1.2 / R1.4.
   */
  public get isRowColumnHeadersVisible(): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row/column header visibility`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getRowColumnHeadersVisible();
  }

  public set isRowColumnHeadersVisible(value: boolean) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row/column header visibility`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setRowColumnHeadersVisible(value);
  }

  /**
   * Zero-value display (`sheetView@showZeros`).
   *
   * Citations: docs/specs/worksheet-view.md; transitional sml.xsd
   * `CT_SheetView/@showZeros` (default `true`); API-RULES R1.2 / R1.4.
   */
  public get isDisplayZeros(): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support zero-value display`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getDisplayZeros();
  }

  public set isDisplayZeros(value: boolean) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support zero-value display`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setDisplayZeros(value);
  }

  /**
   * Right-to-left layout (`sheetView@rightToLeft`).
   *
   * Citations: docs/specs/worksheet-view.md; transitional sml.xsd
   * `CT_SheetView/@rightToLeft` (default `false`); API-RULES R1.2 / R1.4.
   */
  public get isRightToLeft(): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support right-to-left layout`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getRightToLeft();
  }

  public set isRightToLeft(value: boolean) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support right-to-left layout`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setRightToLeft(value);
  }

  /**
   * Display zoom percentage (`sheetView@zoomScale`).
   *
   * Citations: docs/specs/worksheet-view.md; transitional sml.xsd
   * `CT_SheetView/@zoomScale` (default `100`); API-RULES R1.2 / R1.4.
   */
  public get zoom(): number {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support zoom`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getZoom();
  }

  public set zoom(value: number) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support zoom`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setZoom(value);
  }

  /**
   * Column records (`cols` / `col`).
   *
   * Citations: docs/specs/column-properties.md; sml.xsd `CT_Cols` / `CT_Col`.
   */
  /** @private */
  public get columns(): Columns {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._columns;
  }

  /**
   * Set custom width for one 1-based column (OOXML character units).
   */
  public setColumnWidth(index: number, width: number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column widths`,
      );
    }
    this.ensureSheetDataLoaded();
    this._columns.setColumnWidth(index, width);
  }

  /**
   * Effective column width, or `0` when unset.
   */
  /**
   * Column xf (`CT_Col/@style`) covering a 1-based column, if the attribute
   * is present. Does not allocate cells. Out-of-range xf indexes are not
   * validated here — callers decide whether to ignore them.
   *
   * Citations: ECMA-376-1 §18.3.1.13 `col@style`; transitional sml.xsd `CT_Col`.
   *
   * @private
   */
  public getColumnStyleIndex(index: number): number | undefined {
    if (this._kind !== 'worksheet') {
      return undefined;
    }
    this.ensureSheetDataLoaded();
    return this._columns.getColumnStyleIndex(index);
  }

  /**
   * Row xf when the row record has `customFormat` and `s`.
   * Does not allocate cells.
   *
   * Citations: ECMA-376-1 §18.3.1.73 `row@s` / `@customFormat`.
   *
   * @private
   */
  public getRowStyleIndex(index: number): number | undefined {
    if (this._kind !== 'worksheet') {
      return undefined;
    }
    this.ensureSheetDataLoaded();
    return this._rowProperties.getRowStyleIndex(index);
  }

  public getColumnWidth(index: number): number {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column widths`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._columns.getColumnWidth(index);
  }

  /** Sparse authored row records (`row/@ht` / `@customHeight`). @private */
  public get rows(): Rows {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._rowProperties;
  }

  /** Set custom height for one 1-based row in points. */
  public setRowHeight(index: number, height: number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row heights`,
      );
    }
    this.ensureSheetDataLoaded();
    this._rowProperties.setRowHeight(index, height);
  }

  /** Effective authored row height in points, or `0` when unset. */
  public getRowHeight(index: number): number {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row heights`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._rowProperties.getRowHeight(index);
  }

  /**
   * Whether a column is hidden (`col@hidden`).
   */
  public isColumnHidden(index: number): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._columns.isColumnHidden(index);
  }

  /**
   * Set column hidden flag.
   */
  public setColumnHidden(index: number, hidden: boolean): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column properties`,
      );
    }
    this.ensureSheetDataLoaded();
    this._columns.setColumnHidden(index, hidden);
  }

  /**
   * The stored unhide width of a hidden column, or `0` when no snapshot.
   */
  public getColumnHiddenWidth(index: number): number {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._columns.getColumnHiddenWidth(index);
  }

  /**
   * Set the stored unhide width for a column.
   */
  public setColumnHiddenWidth(index: number, width: number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column properties`,
      );
    }
    this.ensureSheetDataLoaded();
    this._columns.setColumnHiddenWidth(index, width);
  }

  /**
   * Whether a column is locked (read-only).
   */
  public isColumnLocked(index: number): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support column properties`,
      );
    }
    if (!Number.isInteger(index) || index < 1) {
      throw new InvalidArgumentError('Column index must be an integer >= 1');
    }
    this.ensureSheetDataLoaded();
    const styleIndex = this._columns.getColumnStyleIndex(index);
    if (styleIndex === undefined) {
      return true; // No style means locked
    }
    try {
      const xf = this.styles().getCellXf(styleIndex);
      if (xf === undefined || xf.protection === undefined) {
        return true;
      }
      return xf.protection.locked !== false;
    } catch (caught) {
      if (caught instanceof InvalidStyleIndexError) {
        return true;
      }
      throw caught;
    }
  }

  /**
   * Whether a row is hidden (`row@hidden`).
   */
  public isRowHidden(index: number): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._rowProperties.isRowHidden(index);
  }

  /**
   * Set row hidden flag.
   */
  public setRowHidden(index: number, hidden: boolean): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    this._rowProperties.setRowHidden(index, hidden);
  }

  /**
   * The stored unhide height of a hidden row, or `0` when no snapshot.
   */
  public getRowHiddenHeight(index: number): number {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._rowProperties.getRowHiddenHeight(index);
  }

  /**
   * Set the stored unhide height for a row.
   */
  public setRowHiddenHeight(index: number, height: number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    this._rowProperties.setRowHiddenHeight(index, height);
  }

  /**
   * Whether a row has an explicit custom height flag.
   */
  public hasCustomRowHeight(index: number): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._rowProperties.hasCustomRowHeight(index);
  }

  /**
   * Set the explicit custom height flag on a row.
   */
  public setCustomRowHeight(index: number, custom: boolean): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row properties`,
      );
    }
    this.ensureSheetDataLoaded();
    this._rowProperties.setCustomRowHeight(index, custom);
  }

  /**
   * Get the resolved style (fill, font, border, alignment, number format, protection)
   * applied to a row when `customFormat="1"` is set, or `undefined` when the row
   * has no authored style. The row style does not create a cell record.
   */
  public getRowStyle(index: number): CellFormat | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support row styles`,
      );
    }
    if (!Number.isInteger(index) || index < 1) {
      throw new InvalidArgumentError('Row index must be an integer >= 1');
    }
    this.ensureSheetDataLoaded();
    const styleIndex = this._rowProperties.getRowStyleIndex(index);
    if (styleIndex === undefined) {
      return undefined;
    }
    const xfIndex = this.xfIndexOrUndefined(styleIndex);
    if (xfIndex === undefined) {
      return undefined;
    }
    return this.styles().getCellXf(xfIndex);
  }

  /**
   * Validate a style index against live cellXfs.
   * @private
   */
  private xfIndexOrUndefined(index: number): number | undefined {
    const styles = this.styles();
    if (!Number.isInteger(index) || index < 0) {
      return undefined;
    }
    try {
      styles.getCellXf(index);
    } catch (caught) {
      if (caught instanceof InvalidStyleIndexError) {
        return undefined;
      }
      throw caught;
    }
    return index;
  }

  /**
   * Sheet default row height in points (`sheetFormatPr@defaultRowHeight`),
   * or `0` when unset.
   */
  public get standardHeight(): number {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support standard height`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._sheetFormat.getStandardHeight();
  }

  public set standardHeight(value: number) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support standard height`,
      );
    }
    this.ensureSheetDataLoaded();
    this._sheetFormat.setStandardHeight(value);
  }

  /**
   * Sort state (`CT_Worksheet/sortState`) — the record Excel persists after
   * a user sort; the grid is never touched.
   *
   * Citations: docs/specs/sort-state.md; sml.xsd `CT_SortState` /
   * `CT_SortCondition`; ECMA-376-1 §18.3.1.91 / §18.3.1.92.
   */
  public get dataSorter(): DataSorter | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sort state`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._sortState.isPresent ? this._sortState : undefined;
  }

  /**
   * Author (or replace) the sort state. Replaces any existing record: the
   * schema permits at most one `sortState` per worksheet.
   */
  public addDataSorter(range: string): DataSorter {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sort state`,
      );
    }
    this.ensureSheetDataLoaded();
    this._sortState.authorState(range);
    return this._sortState;
  }

  /**
   * Remove the sort state entirely (no-op when absent).
   */
  public removeDataSorter(): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sort state`,
      );
    }
    this.ensureSheetDataLoaded();
    this._sortState.clearState();
  }

  /**
   * AutoFilter criteria metadata (`CT_Worksheet/autoFilter`) — the record
   * Excel persists for filter drop-downs; the grid is never filtered or
   * row-hidden by this library (P1 metadata only).
   *
   * Citations: docs/specs/auto-filter.md; sml.xsd `CT_AutoFilter` /
   * `CT_FilterColumn` / `CT_Filters` / `CT_Filter`; ECMA-376-1 §18.3.1.2 /
   * §18.3.2.6–§18.3.2.8.
   */
  public get autoFilter(): AutoFilter | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support AutoFilter`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._autoFilter.getPublicHandle();
  }

  /**
   * Author (or replace) the AutoFilter. Replaces any existing record: the
   * schema permits at most one `autoFilter` per worksheet. Prior AutoFilter
   * handles from a previous generation throw on use.
   */
  /**
   * Body values of one AutoFilter column (header row excluded). Used only
   * to classify {@link FilterColumn.dataType}.
   */
  private filterColumnValues(columnIndex: number): ReadonlyArray<unknown> { // date formats via isDateNumberFormat
    const filter = this._autoFilter.getPublicHandle();
    if (filter === undefined) {
      return [];
    }
    let range;
    try {
      range = parseA1Range(filter.range);
    } catch {
      return [];
    }
    const col = range.startCol + columnIndex;
    if (col > range.endCol) {
      return [];
    }
    const values: unknown[] = [];
    for (let row = range.startRow + 1; row <= range.endRow; row += 1) {
      const cell = this.cell(row, col);
      const value = cell.value;
      const format = cell.numberFormat;
      if (typeof value === 'number' && format !== undefined && isDateNumberFormat(format)) {
        values.push(cell.dateTime);
      } else {
        values.push(value);
      }
    }
    return values;
  }

  public addAutoFilter(range: string): AutoFilter {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support AutoFilter`,
      );
    }
    this.ensureSheetDataLoaded();
    this._autoFilter.authorState(range);
    const handle = this._autoFilter.getPublicHandle();
    if (handle === undefined) {
      throw new InvalidAutoFilterError('AutoFilter authoring failed to produce a live handle');
    }
    return handle;
  }

  /**
   * Remove the AutoFilter entirely (no-op when absent).
   */
  public removeAutoFilter(): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support AutoFilter`,
      );
    }
    this.ensureSheetDataLoaded();
    this._autoFilter.clearState();
  }

  /** @private Package relationship id used by workbook serialization. */
  public get relId(): string {
    return this._relId;
  }

  /** @private Stable OOXML sheet id used by workbook serialization. */
  public get sheetId(): number {
    return this._sheetId;
  }

  /** @private OPC part name used by workbook serialization. */
  public get partName(): string | undefined {
    return this._partName;
  }

  /** @private Worksheet metadata discriminator used by package handling. */
  public get kind(): SheetKind {
    return this._kind;
  }

  /**
   * Merge regions collection for this worksheet.
   *
   * Sole public merges surface (API-RULES R1.5).
   *
   * Citations: ECMA-376-1 §18.3.1.55; docs/specs/merged-cells.md; API-RULES R1.5.
   */
  public get merges(): MergedCells {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support merged cells`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._mergedCells;
  }

  /**
   * Conditional formatting collection. Loads sheet data on first access for worksheets.
   *
   * Citations: ECMA-376-1 §18.3.1.18 / §18.3.1.10; docs/specs/conditional-formatting.md;
   * API-RULES R1.5 / R5.1.
   */
  public get conditionalFormats(): ConditionalFormats {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support conditional formatting`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._conditionalFormats;
  }

  /**
   * Merged ranges collection. Compatibility alias for {@link merges}
   * (canonical L1 name per API-RULES R1.5).
   * @deprecated Prefer {@link merges}.
   */
  public get mergedCells(): MergedCells {
    return this.merges;
  }
  /**
   * Data validations collection. Loads sheet data on first access for worksheets.
   */
  public get dataValidations(): DataValidations {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support data validations`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._dataValidations;
  }

  /**
   * Hyperlinks collection. Loads sheet data on first access for worksheets.
   *
   * Citations: ECMA-376-1 §18.3.1.47–48; docs/specs/hyperlinks.md; API-RULES R1.5 / R5.1.
   */
  public get hyperlinks(): Hyperlinks {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support hyperlinks`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._hyperlinks;
  }

  /**
   * Freeze panes (`sheet.freeze`). Loads sheet data on first access.
   *
   * Citations: docs/specs/freeze-panes.md; API-RULES R1.4 / R1.5.
   */
  public get freeze(): FreezePanes {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support freeze panes`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze;
  }

  /**
   * Page setup (`sheet.pageSetup`). Loads sheet data on first access.
   *
   * Citations: docs/specs/page-setup.md; API-RULES R1.5 / R3.5 / R4.
   */
  public get pageSetup(): PageSetup {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support page setup`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._pageSetup;
  }

  /**
   * Text boxes on this worksheet (snapshot). Loads sheet + drawing on access.
   *
   * Citations: docs/specs/text-boxes.md; API-RULES R1.5 / R5.1.
   */
  public get textBoxes(): ReadonlyArray<TextBox> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support text boxes`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._textBoxes.list();
  }

  /**
   * Autoshapes on this worksheet. Loads sheet + drawing on access.
   *
   * Citations: docs/specs/autoshapes.md; API-RULES R1.5 / R5.1.
   */
  public get shapes(): ShapesCollection {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support shapes`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._autoShapes;
  }

  /**
   * Floating pictures on this worksheet. Pictures are drawing objects above
   * cells, not cell values or backgrounds.
   */
  public get images(): ReadonlyArray<Image> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support images`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._images.images;
  }

  /**
   * Classic charts on this worksheet. Loads sheet + drawing/chart parts on access.
   *
   * Citations: docs/specs/charts.md; API-RULES R1.5 / R5.1.
   */
  public get charts(): ReadonlyArray<Chart> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support charts`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._charts.charts;
  }

  /**
   * Add a text box. Drawing package side effects defer to save/flush.
   *
   * Citations: docs/specs/text-boxes.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addTextBox(
    row: number,
    column: number,
    width: number,
    height: number,
    text?: string,
  ): TextBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support text boxes`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._textBoxes.add(row, column, width, height, text);
  }

  /**
   * Remove a text box by handle or 0-based index.
   *
   * Citations: docs/specs/text-boxes.md; API-RULES R1.1.
   */
  public removeTextBox(target: TextBox | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support text boxes`,
      );
    }
    this.ensureSheetDataLoaded();
    this._textBoxes.remove(target);
  }

  /**
   * Add an autoshape. Drawing package side effects defer to save/flush.
   *
   * Citations: docs/specs/autoshapes.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addShape(
    type: AutoShapeType,
    row: number,
    column: number,
    width: number,
    height: number,
    text?: string,
    name?: string,
    altText?: string,
    rotation?: number,
    moveWithCell?: boolean,
    sizeWithCell?: boolean,
  ): Shape {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support shapes`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._autoShapes.addShape(
      type,
      row,
      column,
      width,
      height,
      text,
      name,
      altText,
      rotation,
      moveWithCell,
      sizeWithCell,
    );
  }

  /**
   * Remove an autoshape by handle or 0-based index.
   *
   * Citations: docs/specs/autoshapes.md; API-RULES R1.1.
   */
  public removeShape(target: Shape | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support shapes`,
      );
    }
    this.ensureSheetDataLoaded();
    this._autoShapes.removeShape(target);
  }

  /** Add a floating picture above the worksheet grid. */
  public addImage(
    bytes: Uint8Array,
    row: number,
    column: number,
    width: number,
    height: number,
  ): Image {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support images`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._images.add(bytes, row, column, width, height);
  }

  /** Remove a floating picture by handle or zero-based index. */
  public removeImage(target: Image | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support images`,
      );
    }
    this.ensureSheetDataLoaded();
    this._images.remove(target);
  }

  /**
   * Add a chart on this worksheet. Accepts any {@link ChartType} with
   * positional geometry and a data argument. Drawing and chart package parts
   * are written on save/flush.
   *
   * Citations: docs/specs/charts.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addChart(
    type: ChartType,
    row: number,
    column: number,
    width: number,
    height: number,
    data: string | ReadonlyArray<string> | ChartData,
    values?: string,
  ): Chart {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support charts`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._charts.add(type, row, column, width, height, data, values);
  }

  /**
   * Remove a chart by handle or 0-based index.
   *
   * Citations: docs/specs/charts.md; API-RULES R1.1.
   */
  public removeChart(target: Chart | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support charts`,
      );
    }
    this.ensureSheetDataLoaded();
    this._charts.remove(target);
  }

  /**
   * Check boxes on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get checkBoxes(): ReadonlyArray<CheckBox> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listCheckBoxes();
  }

  /**
   * Combo boxes on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get comboBoxes(): ReadonlyArray<ComboBox> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listComboBoxes();
  }

  /**
   * Option buttons on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get optionButtons(): ReadonlyArray<OptionButton> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listOptionButtons();
  }

  /**
   * Add a check box. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addCheckBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    checkState?: CheckState,
    linkedCell?: string,
    isDisplay3DShading?: boolean,
  ): CheckBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addCheckBox(
      row,
      column,
      width,
      height,
      name,
      text,
      checkState,
      linkedCell,
      isDisplay3DShading,
    );
  }

  /**
   * Add a combo box (`DropStyle` combo). VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addComboBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    dropDownLines?: number,
    dropStyle?: ComboDropStyle,
    isDisplay3DShading?: boolean,
  ): ComboBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addComboBox(
      row,
      column,
      width,
      height,
      name,
      listFillRange,
      linkedCell,
      selectedIndex,
      dropDownLines,
      (dropStyle != null ? dropStyle : 'combo'),
      isDisplay3DShading,
    );
  }

  /**
   * Add an editable combo box (`DropStyle` comboedit).
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addComboEditBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    dropDownLines?: number,
    isDisplay3DShading?: boolean,
  ): ComboBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addComboBox(
      row,
      column,
      width,
      height,
      name,
      listFillRange,
      linkedCell,
      selectedIndex,
      dropDownLines,
      'comboedit',
      isDisplay3DShading,
    );
  }

  /**
   * Add a simple drop-down (`DropStyle` simple).
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addComboDropdown(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    dropDownLines?: number,
    isDisplay3DShading?: boolean,
  ): ComboBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addComboBox(
      row,
      column,
      width,
      height,
      name,
      listFillRange,
      linkedCell,
      selectedIndex,
      dropDownLines,
      'simple',
      isDisplay3DShading,
    );
  }

  /**
   * Add an option button (radio). VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addOptionButton(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    checkState?: CheckState,
    linkedCell?: string,
    isDisplay3DShading?: boolean,
    isFirstButton?: boolean,
  ): OptionButton {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addOptionButton(
      row,
      column,
      width,
      height,
      name,
      text,
      checkState,
      linkedCell,
      isDisplay3DShading,
      isFirstButton,
    );
  }

  /**
   * Remove a check box by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeCheckBox(target: CheckBox | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeCheckBox(target);
  }

  /**
   * Remove a combo box by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeComboBox(target: ComboBox | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeComboBox(target);
  }

  /**
   * Remove an option button by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeOptionButton(target: OptionButton | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeOptionButton(target);
  }

  /**
   * Buttons on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get buttons(): ReadonlyArray<FormButton> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listButtons();
  }

  /**
   * List boxes on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get listBoxes(): ReadonlyArray<ListBox> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listListBoxes();
  }

  /**
   * Group boxes on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get groupBoxes(): ReadonlyArray<GroupBox> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listGroupBoxes();
  }

  /**
   * Form labels on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get formLabels(): ReadonlyArray<FormLabel> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listFormLabels();
  }

  /**
   * Scroll bars on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get scrollBars(): ReadonlyArray<ScrollBar> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listScrollBars();
  }

  /**
   * Spin buttons on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get spinButtons(): ReadonlyArray<SpinButton> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listSpinButtons();
  }

  /**
   * Edit boxes on this worksheet (VML form controls). Snapshot.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.5 / R5.1.
   */
  public get editBoxes(): ReadonlyArray<EditBox> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.listEditBoxes();
  }

  /**
   * Add a button. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addButton(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    onAction?: string,
  ): FormButton {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addButton(row, column, width, height, name, text, onAction);
  }

  /**
   * Add a list box. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addListBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    listFillRange?: string,
    linkedCell?: string,
    selectedIndex?: number,
    selectionType?: 'single' | 'multi' | 'extended',
    selectedIndices?: ReadonlyArray<number>,
    isDisplay3DShading?: boolean,
    value?: number,
  ): ListBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addListBox(
      row,
      column,
      width,
      height,
      name,
      listFillRange,
      linkedCell,
      selectedIndex,
      selectionType,
      selectedIndices,
      isDisplay3DShading,
      value,
    );
  }

  /**
   * Add a group box. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addGroupBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    groupLinkedCell?: string,
  ): GroupBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addGroupBox(
      row,
      column,
      width,
      height,
      name,
      text,
      groupLinkedCell,
    );
  }

  /**
   * Add a form label. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addFormLabel(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    textLink?: string,
  ): FormLabel {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addFormLabel(
      row,
      column,
      width,
      height,
      name,
      text,
      textLink,
    );
  }

  /**
   * Add a scroll bar. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addScrollBar(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    linkedCell?: string,
    value?: number,
    min?: number,
    max?: number,
    incrementalChange?: number,
    pageChange?: number,
    isHorizontal?: boolean,
  ): ScrollBar {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addScrollBar(
      row,
      column,
      width,
      height,
      name,
      linkedCell,
      value,
      min,
      max,
      incrementalChange,
      pageChange,
      isHorizontal,
    );
  }

  /**
   * Add a spin button. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addSpinButton(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    linkedCell?: string,
    value?: number,
    min?: number,
    max?: number,
    incrementalChange?: number,
  ): SpinButton {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addSpinButton(
      row,
      column,
      width,
      height,
      name,
      linkedCell,
      value,
      min,
      max,
      incrementalChange,
    );
  }

  /**
   * Add an edit box. VML package side effects defer to save/flush.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1 / R2 / R5.1.
   */
  public addEditBox(
    row: number,
    column: number,
    width: number,
    height: number,
    name?: string,
    text?: string,
    textLink?: string,
    isMultiLine?: boolean,
    validation?: EditValidation,
    isPassword?: boolean,
  ): EditBox {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._formControls.addEditBox(
      row,
      column,
      width,
      height,
      name,
      text,
      textLink,
      isMultiLine,
      validation,
      isPassword,
    );
  }

  /**
   * Remove a button by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeButton(target: FormButton | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeButton(target);
  }

  /**
   * Remove a list box by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeListBox(target: ListBox | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeListBox(target);
  }

  /**
   * Remove a group box by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeGroupBox(target: GroupBox | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeGroupBox(target);
  }

  /**
   * Remove a form label by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeFormLabel(target: FormLabel | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeFormLabel(target);
  }

  /**
   * Remove a scroll bar by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeScrollBar(target: ScrollBar | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeScrollBar(target);
  }

  /**
   * Remove a spin button by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeSpinButton(target: SpinButton | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeSpinButton(target);
  }

  /**
   * Remove an edit box by handle or 0-based index.
   *
   * Citations: docs/specs/form-controls.md; API-RULES R1.1.
   */
  public removeEditBox(target: EditBox | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support form controls`,
      );
    }
    this.ensureSheetDataLoaded();
    this._formControls.removeEditBox(target);
  }

  /**
   * Discussion threads on this sheet, in document order.
   */
  public get threadedComments(): ReadonlyArray<ThreadedComment> {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support threaded comments`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._threadedComments.list();
  }

  /**
   * `true` when this worksheet is protected.
   */
  public get isProtected(): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sheet protection`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._protection.isProtected;
  }

  /**
   * Current sheet protection settings, or `undefined` when the sheet is not protected.
   */
  public get sheetProtection(): SheetProtectionInfo | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sheet protection`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._protection.sheetProtection;
  }

  /**
   * Protect this worksheet so users can only do what you allow.
   *
   * @param password - Optional password required to unprotect later.
   * @param options - Which actions remain allowed (select cells, format, sort, …).
   */
  public protect(password?: string, options?: SheetProtectionOptions): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sheet protection`,
      );
    }
    this.ensureSheetDataLoaded();
    this._protection.protect(password, options);
  }

  /**
   * Remove worksheet protection.
   *
   * @param password - Required when the sheet was protected with a password.
   */
  public unprotect(password?: string): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support sheet protection`,
      );
    }
    this.ensureSheetDataLoaded();
    this._protection.unprotect(password);
  }

  /**
   * Ranges users may still edit while the rest of the sheet is protected.
   */
  public get protectedRanges(): ProtectedRanges {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support protected ranges`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._protectedRanges;
  }

  /**
   * Classic sticky notes on this sheet.
   */
  public get comments(): Comments {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support comments`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._comments;
  }

  /**
   * Add a classic sticky note on a cell.
   */
  public addComment(options: AddCommentOptions): Comment {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support comments`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._comments.add(options);
  }

  /**
   * Remove a classic sticky note by handle, A1 address, or zero-based index.
   */
  public removeComment(target: Comment | string | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support comments`,
      );
    }
    this.ensureSheetDataLoaded();
    this._comments.remove(target);
  }

  /**
   * `true` when the given cell has a classic sticky note.
   */
  public hasComment(a: string | number, b?: number): boolean {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support comments`,
      );
    }
    this.ensureSheetDataLoaded();
    if (typeof a === 'string') {
      return this._comments.has(a);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return this._comments.has(a, b);
    }
    throw new InvalidArgumentError(
      'hasComment() requires an A1 ref or 1-based (row, column)',
    );
  }

  /**
   * Classic sticky note on the given cell, or `undefined` if none.
   */
  public getComment(a: string | number, b?: number): Comment | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support comments`,
      );
    }
    this.ensureSheetDataLoaded();
    if (typeof a === 'string') {
      return this._comments.get(a);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return this._comments.get(a, b);
    }
    throw new InvalidArgumentError(
      'getComment() requires an A1 ref or 1-based (row, column)',
    );
  }

  /**
   * Mutable hyperlinks store for cell property wiring.
   * @private
   */
  public get hyperlinksImpl(): HyperlinksImpl {
    this.ensureSheetDataLoaded();
    return this._hyperlinks;
  }

  /**
   * Mutable threaded-comments store for cell property wiring.
   * @private
   */
  public get threadedCommentsImpl(): ThreadedCommentsImpl {
    this.ensureSheetDataLoaded();
    return this._threadedComments;
  }

  /**
   * Mutable classic-comments store for cell property wiring.
   * @private
   */
  public get commentsImpl(): CommentsImpl {
    this.ensureSheetDataLoaded();
    return this._comments;
  }

  /**
   * Remove one discussion thread and all of its replies.
   *
   * @param target - The thread to remove, or its zero-based index on the sheet.
   */
  public removeThreadedComment(target: ThreadedComment | number): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support threaded comments`,
      );
    }
    this.ensureSheetDataLoaded();
    this._threadedComments.remove(target);
  }

  /**
   * Remove every discussion thread (and reply) on this sheet.
   */
  public clearThreadedComments(): void {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support threaded comments`,
      );
    }
    this.ensureSheetDataLoaded();
    this._threadedComments.clear();
  }

  /**
   * Tables collection. Resolves table parts lazily on first access.
   */
  public get tables(): Tables {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support tables`,
      );
    }
    if (this._tables === undefined) {
      this._tables = new TablesImpl(this.createTablesHost());
    }
    return this._tables;
  }

  /**
   * Pivot tables authored on this worksheet.
   */
  public get pivotTables(): PivotTables {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support pivot tables`,
      );
    }
    if (this._pivotTables === undefined) {
      const host = this.requireCellHost();
      this._pivotTables = new PivotTablesImpl(
        {
          markDirty: () => {
            this.requireCellHost().markDirty();
          },
          sheetPartName: () => this._partName,
        },
        host.pivotCaches(),
      );
    }
    return this._pivotTables;
  }

  /**
   * The typed pivot tables collection (creates it on first use).
   * @private
   */
  public pivotTablesImpl(): PivotTablesImpl {
    // The public getter always returns the collection it created.
    return this.pivotTables as PivotTablesImpl;
  }

  /**
   * The pivot tables collection when it has been used; `undefined` otherwise.
   * @private
   */
  public pivotTablesIfCreated(): PivotTablesImpl | undefined {
    return this._pivotTables;
  }

  /** Host adapter between the public tables collection and the wire plumbing. */
  private createTablesHost(): TablesHost {
    const getCellValue = (row: number, col: number): string | number | undefined => {
      // Get cell value for deriving column names from header row.
      // Returns the text/numeric value or undefined if empty.
      this.ensureSheetDataLoaded();
      const model = ((__rowMap) => (__rowMap !== undefined && __rowMap !== null) ? __rowMap.get(col) : undefined)(this.cellRows.get(row));
      if (model === undefined || model.kind === 'empty') {
        return undefined;
      }
      if (model.kind === 'inlineString') {
        return model.inlinePlain;
      }
      if (model.kind === 'str') {
        return String(model.raw);
      }
      if (model.kind === 'sharedString' && typeof model.raw === 'number') {
        return this.resolveSharedString(model.raw);
      }
      if (model.kind === 'number' && typeof model.raw === 'number') {
        return model.raw;
      }
      // For boolean, error: return undefined
      return undefined;
    };
    return {
      entries: () => this.internalTables(),
      setEntries: (entries, removedRelIds, removedPartNames) => {
        this.internalSetTables(entries, removedRelIds, removedPartNames);
      },
      allocateTableId: () => {
        const host = this.requireCellHost();
        return host.allocateTableId();
      },
      allocateTableRelId: () => this.allocateTableRelId(),
      tablePartsExtraAttrsXml: () => this.internalTablePartsModel().extraAttrsXml,
      markDirty: (entry?: TableEntry) => {
        // In-place handle mutations must rewrite the affected table part,
        // not just the sheet part. Entry-scoped: only the mutated table's
        // part changes (localized mutation); struc    // Text-only; never evaluates (security / cell forly mark the whole layer.
        if (entry !== undefined) {
          this.dirtyTableEntries.add(entry);
        }
        this.tablesDirty = true;
        this.markCellsDirty();
      },
      getCellValue,
      setCellValue: (row: number, col: number, value: string | number | undefined) => {
        // Materialize totals-row labels (and similar table sheet bindings) into
        // the sparse grid so dimension covers table@ref. Uses public Cell APIs.
        this.ensureSheetDataLoaded();
        const address = formatA1(row, col);
        const cell = this.cell(address);
        if (value === undefined) {
          cell.clear();
        } else {
          cell.value = value;
        }
      },
      setCellFormula: (row: number, col: number, expression: string | undefined) => {
        // Materialize totals-row SUBTOTAL / custom formulas (MS-OE376 §2.1.710(n)).
        // Text-only; never evaluates (security / cell formula policy).
        this.ensureSheetDataLoaded();
        const address = formatA1(row, col);
        const cell = this.cell(address);
        cell.formula = expression;
      },
    };
  }

  /**
   * Bounding box of residual sparse cells, or `undefined` when none.
   *
   * Same cells that write `dimension@ref` (`computeDimensionRef`). Column
   * widths, row heights, and the stored dimension hint do not extend it.
   * Reading never allocates cells.
   *
   * Assumption: `lastRow` / `lastColumn` are 1-based numbers, not a `Row`
   * handle — this library has no public `Row` type (API-RULES R3.1 names
   * `Row | undefined`; user also asked for `lastColumn`).
   *
   * Citations: docs/specs/worksheet-cells.md; ECMA-376-1 `CT_SheetDimension`;
   * API-RULES R3.1.
   */
  public get usedRange(): Range | undefined {
    const bounds = this.usedCellBounds();
    if (bounds === undefined) {
      return undefined;
    }
    return this.range(formatA1Range(bounds));
  }

  /**
   * 1-based last row of {@link usedRange}, or `undefined` when empty.
   */
  public get lastRow(): number | undefined {
    const bounds = this.usedCellBounds();
    return bounds === undefined ? undefined : bounds.endRow;
  }

  /**
   * 1-based last column of {@link usedRange}, or `undefined` when empty.
   */
  public get lastColumn(): number | undefined {
    const bounds = this.usedCellBounds();
    return bounds === undefined ? undefined : bounds.endCol;
  }

  /**
   * Excel highlight of the primary sheet view (`selection@sqref` on the
   * topLeft pane). Not {@link usedRange}.
   *
   * Citations: docs/specs/worksheet-view.md; ECMA-376-1 §18.3.1.78
   * `selection`; transitional sml.xsd `CT_Selection`; `[MS-OI29500]`
   * §2.1.649; API-RULES R1.4.
   *
   * Assumption: one public range — the active area of the topLeft pane.
   * Other pane selections and multi-area `sqref` lists stay in the file
   * and are not rewritten by a read.
   */
  public get selectedRange(): string | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support selected range`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getSelectedRange();
  }

  public set selectedRange(value: string | undefined) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support selected range`,
      );
    }
    this.ensureSheetDataLoaded();
    if (value === undefined) {
      this._freeze.setSelectedRange(undefined);
      return;
    }
    const ref = selectionRef(value as string | Range);
    if (ref.trim().length === 0) {
      throw new InvalidArgumentError(
        'selectedRange must be an A1 address string, a Range from sheet.range(), or undefined',
      );
    }
    let address: string;
    try {
      address = formatA1Range(parseA1Range(ref));
    } catch (err) {
      throw new InvalidAddressError(`Invalid selected range "${ref}"`, {
        cause: err,
      });
    }
    this._freeze.setSelectedRange(address);
  }

  /**
   * Normal scroll viewport (`sheetView@topLeftCell`). Not the freeze pane
   * anchor and not {@link selectedRange}.
   *
   * Citations: ECMA-376-1 §18.3.1.87; transitional sml.xsd `CT_SheetView`
   * `@topLeftCell` (`ST_CellRef`, optional, no default); API-RULES R1.4.
   */
  public get topLeftCell(): string | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support topLeftCell`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getViewTopLeftCell();
  }

  public set topLeftCell(value: string | undefined) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support topLeftCell`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setViewTopLeftCell(normalizeScrollAnchor(value, 'topLeftCell'));
  }

  /**
   * Active pane scroll anchor (`pane@topLeftCell`) for frozen, split, and
   * frozenSplit panes. Does not invent a pane.
   *
   * Citations: ECMA-376-1 §18.3.1.66; transitional sml.xsd `CT_Pane`
   * `@topLeftCell`; `[MS-OI29500]` §2.1.640 (optional when `state` is
   * `split`, required otherwise — clearing a frozen pane's anchor is a
   * deliberate caller choice, not repaired on save).
   */
  public get paneTopLeftCell(): string | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support paneTopLeftCell`,
      );
    }
    this.ensureSheetDataLoaded();
    return this._freeze.getPaneTopLeftCell();
  }

  public set paneTopLeftCell(value: string | undefined) {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support paneTopLeftCell`,
      );
    }
    this.ensureSheetDataLoaded();
    this._freeze.setPaneTopLeftCell(normalizeScrollAnchor(value, 'paneTopLeftCell'));
  }

  /**
   * Address-based cell accessor (A1 or 0-based row/col overload).
   *
   * Sole public cell accessor (API-RULES R1.5).
   *
   * Citations: docs/specs/cell-storage.md; API-RULES R1.4 / R1.5.
   */
  public cell(addressOrRow: string | number, column?: number): Cell {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support cells`,
      );
    }
    let row: number;
    let col: number;
    if (typeof addressOrRow === 'string') {
      if (column !== undefined) {
        throw new InvalidAddressError(
          'cell(address) does not accept a second argument; use cell(row, column) for coordinates',
        );
      }
      const coord = parseA1(addressOrRow);
      row = coord.row;
      col = coord.col;
    } else if (typeof addressOrRow === 'number' && typeof column === 'number') {
      // Validate via formatA1 (throws InvalidAddressError on OOB / non-integer).
      formatA1(addressOrRow, column);
      row = addressOrRow;
      col = column;
    } else {
      throw new InvalidAddressError(
        'cell() requires an A1 address string or 1-based (row, column) numbers',
      );
    }
    this.ensureSheetDataLoaded();
    return new Cell(this, row, col);
  }

  /**
   * Range view over an A1 ref (`A1` or `A1:B2`).
   */
  public range(ref: string): Range {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support ranges`,
      );
    }
    this.ensureSheetDataLoaded();
    return createRangeFromRef(this, ref);
  }

  /**
   * Cell handle at an A1 address.
   * @deprecated Compatibility alias for {@link cell} (canonical L1
   * accessor per API-RULES R1.5); kept for existing consumers.
   */
  public getCell(address: string): Cell {
    return this.cell(address);
  }

  /** @private */
  public setNameInternal(name: string): void {
    this._name = name;
  }

  /** @private */
  public setVisibilityInternal(visibility: SheetVisibility): void {
    this._visibility = visibility;
  }

  /** @private */
  public toXmlEntry(): SheetXmlEntry {
    return {
      name: this._name,
      sheetId: this._sheetId,
      relId: this._relId,
      state: this._visibility,
      extraAttrsXml: this.extraAttrsXml,
    };
  }

  /** @private */
  public ensureSheetDataLoaded(): void {
    if (this.sheetDataLoaded || this._kind !== 'worksheet') {
      return;
    }
    const host = this.requireCellHost();
    if (this._partName === undefined) {
      this.sheetMeta = {
        beforeSheetDataXml: [],
        afterSheetDataXml: [],
        rootExtraAttrsXml: '',
      };
      this.sheetDataLoaded = true;
      this._textBoxes.loadFromPackage(host.package, this._partName);
      this._autoShapes.loadFromPackage(host.package, this._partName);
      this._images.loadFromPackage(host.package, this._partName);
      this._charts.loadFromPackage(host.package, this._partName);
      // Form controls first so classic notes can correlate VML Note chrome;
      // threaded comments last (may share comments-part ownership on flush).
      this._formControls.loadFromPackage(host.package, this._partName);
      // Classic notes load after form-controls so VML note-chrome correlates.
      this._comments.loadFromPackage(host.package, this._partName);
      this._threadedComments.loadFromPackage(host.package, this._partName);
      return;
    }

    const part = host.package.getPart(this._partName);
    if (part === undefined) {
      throw new MissingWorksheetPartError(
        `Worksheet part "${this._partName}" for sheet "${this._name}" is missing`,
        { partName: this._partName },
      );
    }
    const sheetRels = host.package.getRelationships(this._partName);
    let model;
    try {
      model = parseWorksheetXml(part.data, this._partName, { sheetRels });
    } catch (err) {
      if (err instanceof InvalidWorksheetError || err instanceof MissingWorksheetPartError) {
        throw err;
      }
      throw new InvalidWorksheetError(
        `Failed to parse worksheet part "${this._partName}"`,
        { partName: this._partName, cause: err },
      );
    }
    this.cellRows.clear();
    for (const cell of model.cells) {
      this.putCellModelInternal(cell);
    }
    this._mergedCells.replaceFromParse(model.mergeCells);
    this._conditionalFormats.replaceFromParse(model.conditionalFormatting);
    this._conditionalFormats.applyX14FromAfterSheetData(model.afterSheetDataXml);
    this._dataValidations.replaceFromParse(model.dataValidations);
    this._hyperlinks.replaceFromParse(model.hyperlinks);
    this._freeze.replaceFromParse(model.sheetViews);
    this._sheetFormat.replaceFromParse(model.sheetFormatPr);
    this._columns.replaceFromParse(model.cols);
    this._autoFilter.replaceFromParse(model.autoFilter);
    this._protection.replaceFromParse(model.sheetProtection);
    this._protectedRanges.replaceFromParse(model.protectedRanges);
    this._rowProperties.replaceFromParse(model.rows);
    this._sortState.replaceFromParse(model.sortState);
    this._pageSetup.replaceFromParse(model.pageSetup);
    this.tablePartsModel = model.tableParts;
    this.tablesResolved = false;
    this.tableEntries.length = 0;
    this._textBoxes.loadFromPackage(host.package, this._partName);
    this._autoShapes.loadFromPackage(host.package, this._partName);
    this._charts.loadFromPackage(host.package, this._partName);
    this._images.loadFromPackage(host.package, this._partName);
    this.loadPlacedPictures(host.richData());
    // Form controls first so classic notes can correlate VML Note chrome;
    // threaded comments last (may share comments-part ownership on flush).
    this._formControls.loadFromPackage(host.package, this._partName);
    this._comments.loadFromPackage(host.package, this._partName);
    this._threadedComments.loadFromPackage(host.package, this._partName);
    this.sheetMeta = {
      beforeSheetDataXml: [...model.beforeSheetDataXml],
      afterSheetDataXml: [...model.afterSheetDataXml],
      rootExtraAttrsXml: model.rootExtraAttrsXml,
    };
    this.sheetDataLoaded = true;
    this.cellsDirty = false;
  }

  /** @private */
  public getCellModel(row: number, col: number): CellModel | undefined {
    this.ensureSheetDataLoaded();
    return ((__rowMap) => (__rowMap !== undefined && __rowMap !== null) ? __rowMap.get(col) : undefined)(this.cellRows.get(row));
  }

  /** @private */
  public putCellModel(model: CellModel): void {
    this.putCellModelInternal(model);
  }

  /** @private */
  public deleteCellModel(row: number, col: number): void {
    const rowMap = this.cellRows.get(row);
    if (rowMap === undefined) {
      return;
    }
    rowMap.delete(col);
    if (rowMap.size === 0) {
      this.cellRows.delete(row);
    }
  }

  /** @private */
  public markCellsDirty(): void {
    this.cellsDirty = true;
    (this.cellHost == null ? undefined : this.cellHost.markDirty());
  }

  /** @private */
  public resolveSharedString(index: number): string {
    return this.requireCellHost().sharedStrings().getPlainText(index);
  }

  /** @private */
  public appendSharedString(text: string): number {
    return this.requireCellHost().sharedStrings().appendPlainText(text);
  }

  /**
   * Append rich shared-string runs (always new index; never plain-dedup).
   * @private
   */
  public appendRichSharedString(runs: ReadonlyArray<RichTextRun>): number {
    return this.requireCellHost().sharedStrings().appendRichRuns(runs);
  }

  /**
   * Structured runs for an SST index (plain → single run).
   * @private
   */
  public getRichSharedStringRuns(index: number): RichTextRun[] {
    return this.requireCellHost().sharedStrings().getRichRuns(index);
  }

  /**
   * Entry kind at SST index (`plain` | `rich`).
   * @private
   */
  public sharedStringEntryKind(index: number): 'plain' | 'rich' {
    return this.requireCellHost().sharedStrings().entryKindAt(index);
  }

  /** @private */
  public addSharedStringReferences(delta: number): void {
    this.requireCellHost().sharedStrings().addReferences(delta);
  }

  /**
   * Workbook styles table for cell styleIndex / applyStyle.
   * @private
   */
  public styles(): WorkbookStyles {
    return this.requireCellHost().styles();
  }

  /**
   * Workbook 1904 date-system flag for cell date serial conversion.
   * @private
   */
  public date1904(): boolean {
    return this.requireCellHost().date1904();
  }

  /**
   * Resolve `tableParts` refs to table parts and parse them (lazy, once).
   * Soft-skips a table whose part is missing or unparseable; the part itself
   * and its worksheet relationship are left untouched in the package so an
   * unmodified workbook round-trips unchanged.
   * @private
   */
  private ensureTablesResolved(): void {
    if (this.tablesResolved) {
      return;
    }
    if (this._kind !== 'worksheet' || this._partName === undefined) {
      this.tablesResolved = true;
      return;
    }
    // tableParts refs live on the parsed sheet; load first (the load path
    // resets tablesResolved so parse-then-resolve happens exactly once here).
    this.ensureSheetDataLoaded();
    this.tablesResolved = true;
    const host = this.requireCellHost();
    const rels = host.package.getRelationships(this._partName);
    this.tableEntries.length = 0;
    for (const relId of this.tablePartsModel.relIds) {
      const rel = rels.find((r) => r.id === relId);
      const partName = (rel == null ? undefined : rel.resolvedTarget);
      if (partName === undefined) {
        continue; // ref without a relationship: soft-skip, keep ref on write
      }
      const part = host.package.getPart(partName);
      if (part === undefined) {
        continue; // relationship without a part: soft-skip, keep ref on write
      }
      let entry: TableEntry | undefined;
      try {
        entry = parseTableXml(decodeUtf8(part.data));
      } catch {
        entry = undefined;
      }
      if (entry === undefined) {
        continue; // unparseable table part: soft-skip, part preserved untouched
      }
      this.tableEntries.push({ relId, entry });
      this.requireCellHost().noteTableId(entry.id);
    }
  }

  /**
   * Internal table model access (TASK-1211 wraps this with the public API).
   * Resolves lazily; returned array is the live internal store.
   * @private
   */
  public internalTables(): { relId: string; entry: TableEntry }[] {
    this.ensureTablesResolved();
    return this.tableEntries;
  }

  /**
   * `tableParts` model for the parse path (TASK-1211 mutates through
   * `internalTables` + this).
   * @private
   */
  public internalTablePartsModel(): TablePartsModel {
    this.ensureTablesResolved();
    return this.tablePartsModel;
  }

  /**
   * Allocate the next workbook-unique table id (host-owned max + 1).
   * Existing ids are never renumbered.
   * @private
   */
  public allocateTableId(): number {
    return this.requireCellHost().allocateTableId();
  }

  /**
   * Allocate a fresh worksheet relationship id for a new table part.
   * Unique within this worksheet's relationships part, counting both
   * persisted relationships and pending entries not yet flushed.
   * @private
   */
  public allocateTableRelId(): string {
    if (this._kind !== 'worksheet' || this._partName === undefined) {
      return '';
    }
    const used = new Set<number>();
    for (const r of this.requireCellHost().package.getRelationships(this._partName)) {
      const m = /^rId(\d+)$/i.exec(r.id);
      if (m !== null && m[1] !== undefined) {
        used.add(Number.parseInt(m[1], 10));
      }
    }
    // Pending entries allocated this session are not in the package yet.
    this.ensureTablesResolved();
    for (const { relId } of this.tableEntries) {
      const m = /^rId(\d+)$/i.exec(relId);
      if (m !== null && m[1] !== undefined) {
        used.add(Number.parseInt(m[1], 10));
      }
    }
    let n = 1;
    while (used.has(n)) {
      n += 1;
    }
    return `rId${n}`;
  }

  /**
   * Write tables back to the package: table parts (`/xl/tables/tableN.xml`)
   * with content-type Override + worksheet relationship, and `tableParts`
   * refs on the sheet part. Removal of the part/Override/relationship for
   * dropped tables happens through `internalSetTables` bookkeeping.
   * @private
   */
  public flushTablesIfDirty(): void {
    if (this._kind !== 'worksheet' || this._partName === undefined) {
      return;
    }
    this.ensureTablesResolved();
    if (!this.tablesDirty) {
      return;
    }
    const host = this.requireCellHost();
    const sheetPart = this._partName;
    const rels = host.package.getRelationships(sheetPart);

    // Resolve each live entry's current table part target (package rel or
    // pending new). Dropped table rels are omitted so survivors can be
    // rewired densely.
    const resolved: {
      entry: TableEntry;
      previousPartName: string | undefined;
      isNew: boolean;
      needsRewrite: boolean;
    }[] = [];
    for (const { relId, entry } of this.tableEntries) {
      const existingRel = rels.find(
        (r) => r.id === relId && !this.droppedTableRelIds.has(r.id),
      );
      if (
        existingRel !== undefined &&
        existingRel.resolvedTarget.length > 0
      ) {
        resolved.push({
          entry,
          previousPartName: existingRel.resolvedTarget,
          isNew: false,
          needsRewrite: this.dirtyTableEntries.has(entry),
        });
      } else {
        resolved.push({
          entry,
          previousPartName: undefined,
          isNew: true,
          needsRewrite: true,
        });
      }
    }

    // Drop parts + Overrides for tables removed this session (before rewrite).
    const previousKeep = new Set(
      resolved
        .map((r) => r.previousPartName)
        .filter((n): n is string => n !== undefined),
    );
    const droppedPartNames = new Set<string>(this.droppedTableParts);
    for (const droppedRelId of this.droppedTableRelIds) {
      const rel = rels.find((r) => r.id === droppedRelId);
      if (rel !== undefined && rel.resolvedTarget.length > 0) {
        droppedPartNames.add(rel.resolvedTarget);
      }
    }
    for (const dropped of droppedPartNames) {
      if (!previousKeep.has(dropped)) {
        host.package.removePart(dropped);
      }
    }

    // Excel-safe packing after middle remove (matches create-path multi-table
    // packages): contiguous `/xl/tables/table1.xml`…`tableK.xml` plus dense
    // worksheet table rIds. Gapped part names (table1+table3) remain hostile
    // even with dense rIds, autoFilter, and styleInfo. `table@id` stays as
    // modeled (workbook-unique; never renumbered here).
    const denseParts = resolved.map((_, i) => `/xl/tables/table${i + 1}.xml`);

    // Stage bytes first so path swaps cannot clobber unread sources
    // (e.g. live table2+table3 → dense table1+table2).
    const stagedBytes: Uint8Array[] = [];
    for (const item of resolved) {
      if (item.needsRewrite || item.isNew) {
        ensureExcelSafeWorksheetTableSurface(item.entry);
        stagedBytes.push(
          encodeUtf8(
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${serializeTableXml(item.entry)}`,
          ),
        );
      } else if (item.previousPartName !== undefined) {
        const part = host.package.getPart(item.previousPartName);
        if (part !== undefined) {
          stagedBytes.push(part.data);
        } else {
          ensureExcelSafeWorksheetTableSurface(item.entry);
          stagedBytes.push(
            encodeUtf8(
              `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${serializeTableXml(item.entry)}`,
            ),
          );
        }
      } else {
        ensureExcelSafeWorksheetTableSurface(item.entry);
        stagedBytes.push(
          encodeUtf8(
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${serializeTableXml(item.entry)}`,
          ),
        );
      }
    }

    // Vacate every previous path, then write dense table1..K (setPart restores
    // Override). Unique set so a shared path is removed once.
    const previousPaths = new Set<string>();
    for (const item of resolved) {
      if (item.previousPartName !== undefined) {
        previousPaths.add(item.previousPartName);
      }
    }
    for (const prev of previousPaths) {
      host.package.removePart(prev);
    }
    for (let i = 0; i < resolved.length; i++) {
      host.package.setPart(denseParts[i]!, stagedBytes[i]!, TABLE_CONTENT_TYPE);
    }

    // Non-table worksheet relationships stay; all table relationships are
    // rebuilt so tablePart r:ids are dense rId1..N.
    const nonTableRels = rels.filter(
      (r) =>
        !isTableRelationshipType(r.type) &&
        !this.droppedTableRelIds.has(r.id),
    );
    const usedRelNums = new Set<number>();
    for (const r of nonTableRels) {
      const m = /^rId(\d+)$/i.exec(r.id);
      if (m !== null && m[1] !== undefined) {
        usedRelNums.add(Number.parseInt(m[1], 10));
      }
    }
    const nextRels: OpcRelationship[] = [...nonTableRels];
    const nextEntries: { relId: string; entry: TableEntry }[] = [];
    let nextRelNum = 1;
    for (let i = 0; i < resolved.length; i++) {
      const item = resolved[i]!;
      const partName = denseParts[i]!;
      while (usedRelNums.has(nextRelNum)) {
        nextRelNum += 1;
      }
      const denseRelId = `rId${nextRelNum}`;
      usedRelNums.add(nextRelNum);
      nextRelNum += 1;
      nextRels.push({
        id: denseRelId,
        type: TABLE_REL_TYPE_TRANSITIONAL,
        target: relativeTargetFromWorksheet(sheetPart, partName),
        resolvedTarget: partName,
      });
      nextEntries.push({ relId: denseRelId, entry: item.entry });
    }

    if (nextRels.length !== rels.length || !arraysEqualRels(nextRels, rels)) {
      host.package.setRelationships(sheetPart, nextRels);
    }
    this.tableEntries.length = 0;
    for (const e of nextEntries) {
      this.tableEntries.push(e);
    }
    this.tablePartsModel = {
      relIds: this.tableEntries.map((t) => t.relId),
      extraAttrsXml: this.tablePartsModel.extraAttrsXml,
    };
    // Contiguous table1..K so the next Tables.add uses table{K+1}.
    host.noteTablePartCount(nextEntries.length);
    this.droppedTableRelIds.clear();
    this.droppedTableParts.clear();
    this.dirtyTableEntries.clear();
    this.tablesDirty = false;
  }

  /**
   * Replace the full table set (TASK-1211 public API calls this).
   * Records dropped parts/rels so flush removes them from the package, and
   * marks the sheet part dirty (the `tableParts` element lives on it).
   * @private
   */
  public internalSetTables(
    entries: ReadonlyArray<{ relId: string; entry: TableEntry }>,
    removedRelIds: ReadonlyArray<string>,
    removedPartNames: ReadonlyArray<string>,
  ): void {
    this.ensureTablesResolved();
    this.tablesDirty = true;
    for (const relId of removedRelIds) {
      this.droppedTableRelIds.add(relId);
    }
    for (const partName of removedPartNames) {
      this.droppedTableParts.add(partName);
    }
    // Snapshot first: `entries` may alias the live internal array.
    const snapshot = [...entries];
    this.tableEntries.length = 0;
    for (const e of snapshot) {
      this.tableEntries.push(e);
      this.requireCellHost().noteTableId(e.entry.id);
    }
    // The worksheet part must be rewritten: `tableParts` refs changed.
    this.markCellsDirty();
  }

  /** Track tables mutation for flush. */
  private tablesDirty = false;
  private readonly droppedTableRelIds = new Set<string>();
  private readonly droppedTableParts = new Set<string>();

  /**
   * True when table entries changed since last flush.
   * @private
   */
  public get hasDirtyTables(): boolean {
    return this.tablesDirty;
  }

  /**
   * Write sheetData, merges, conditional formatting, data validations, hyperlinks,
   * freeze panes, page setup, and tables + table parts back to the package when dirty.
   * @private
   */
  public flushIfDirty(): void {
    // Always rewrite worksheet parts on save. A no-op open/save used to copy
    // the original part, so illegal pageSetup/headerFooter order survived.
    if (this._kind !== 'worksheet' || this._partName === undefined) {
      return;
    }
    this.ensureSheetDataLoaded();
    const host = this.requireCellHost();
    const meta = (this.sheetMeta != null ? this.sheetMeta : {
      beforeSheetDataXml: [],
      afterSheetDataXml: [],
      rootExtraAttrsXml: '',
    });
    const cells = this.collectCells();

    // R5.1 — materialize sheet relationships only on flush/save.
    // Drawing order: textBoxes → autoShapes → images → charts → form-controls (VML).
    const existingSheetRels = host.package.getRelationships(this._partName);
    const materialize =
      this._hyperlinks.materializeExternalRelationships(existingSheetRels);
    // Include newly allocated hyperlink rels when passing to next materializations
    // so they allocate IDs that don't collide with hyperlinks.
    const relsAfterHyperlinks: OpcRelationship[] = [
      ...materialize.retainedRels,
      ...materialize.hyperlinkRels
    ];
    // Publish hyperlink rIds now so drawing materializers allocate past them.
    if (materialize.hyperlinkRels.length > 0) {
      host.package.setRelationships(this._partName, relsAfterHyperlinks);
    }
    const textBoxMat = this._textBoxes.materializeOnFlush(relsAfterHyperlinks);
    const shapesMat = this._autoShapes.materializeOnFlush(
      textBoxMat.drawingRel !== undefined
        ? [...textBoxMat.sheetRelsWithoutDrawing, textBoxMat.drawingRel]
        : textBoxMat.sheetRelsWithoutDrawing,
    );
    const imagesMat = this._images.materializeOnFlush(shapesMat.drawingRel);
    const chartsMat = this._charts.materializeOnFlush(imagesMat.drawingRel);
    // The pictures were the drawing's only content, so it was removed: the sheet
    // keeps neither its relationship nor its `drawing` element.
    const drawingRemoved =
      imagesMat.removedDrawing === true && chartsMat.drawingRel === undefined;
    const drawingRel = drawingRemoved
      ? undefined
      : chartsMat.drawingRel !== undefined
        ? chartsMat.drawingRel
        : imagesMat.drawingRel !== undefined
          ? imagesMat.drawingRel
          : shapesMat.drawingRel !== undefined
            ? shapesMat.drawingRel
            : textBoxMat.drawingRel !== undefined
              ? textBoxMat.drawingRel
              : undefined;
    // Note VML chrome coexistence:
    // - Threaded comments seed Note anchors via syncCommentNoteShapes.
    // - Classic comments then replace Note shapes, so their overlay must
    //   include those same anchors or the H16 (thread) indicator is dropped.
    // Both APIs replace all Note shapes — last writer wins.
    const threadAnchors = this._threadedComments.listCommentNoteAnchorsForFlush();
    if (threadAnchors !== undefined && this._comments.length === 0) {
      this._formControls.syncCommentNoteShapes(threadAnchors);
    }
    // Classic comments materialize BEFORE form-controls so VML Note overlay
    // is in place when the single vmlDrawing part is written.
    // Placeholders for top-level threads are appended to this same comments
    // part ([MS-XLSX] §2.3.7.3) so the sheet has one comments relationship.
    const drawingRelsForComments =
      drawingRel !== undefined
        ? [...shapesMat.sheetRelsWithoutDrawing, drawingRel]
        : shapesMat.sheetRelsWithoutDrawing;
    const commentsMat = this._comments.materializeOnFlush(
      drawingRelsForComments,
      this._formControls,
      this._threadedComments.listLegacyPlaceholders(),
    );
    // Do not call syncCommentNoteShapes here. It replaces every Note shape and
    // allocates new ids, so comment/@shapeId would no longer match the VML id.
    const formMat = this._formControls.materializeOnFlush(commentsMat.sheetRels);
    const tcInput = [
      ...formMat.sheetRelsWithoutVmlDrawing,
      ...(formMat.vmlDrawingRel !== undefined ? [formMat.vmlDrawingRel] : []),
    ];
    const publishedCommentsRel = commentsMat.sheetRels.find((r) =>
      isCommentsRelationshipType(r.type),
    );
    const tcMat = this._threadedComments.materializeOnFlush(tcInput, publishedCommentsRel);
    // One comments relationship: the part that already contains classic notes
    // and `tc={uid}` placeholders. Fall back to TC's own comments rel only
    // when classic materialize did not publish one.
    const commentsRelForFlush =
      publishedCommentsRel != null ? publishedCommentsRel : tcMat.commentsRel;
    const nextRels = [
      ...tcMat.sheetRelsWithoutTcAndComments,
      ...(tcMat.tcRel !== undefined ? [tcMat.tcRel] : []),
      ...(commentsRelForFlush !== undefined ? [commentsRelForFlush] : []),
      // Hyperlink rels are already included in tcMat.sheetRelsWithoutTcAndComments
      // due to passing relsAfterHyperlinks to textboxes materialization.
    ];
    if (nextRels.length > 0 || existingSheetRels.length > 0) {
      // Always rewrite when there were sheet rels or we have hyperlink/drawing
      // rels so orphaned relationship types are dropped.
      host.package.setRelationships(this._partName, nextRels);
    }

    const ownsDrawing =
      textBoxMat.ownsDrawingElement ||
      shapesMat.ownsDrawingElement ||
      imagesMat.ownsDrawingElement ||
      chartsMat.ownsDrawingElement;
    const drawingRelationshipId = drawingRemoved
      ? undefined
      : ((__t) => __t != null ? __t : textBoxMat.drawingRelationshipId)((chartsMat.drawingRelationshipId != null ? chartsMat.drawingRelationshipId : imagesMat.drawingRelationshipId) != null ? (chartsMat.drawingRelationshipId != null ? chartsMat.drawingRelationshipId : imagesMat.drawingRelationshipId) : shapesMat.drawingRelationshipId);
    const ownsLegacyDrawing = formMat.ownsLegacyDrawingElement;
    const legacyDrawingRelationshipId = formMat.legacyDrawingRelationshipId;
    const serializeArgs: Parameters<typeof serializeWorksheetXml>[0] = {
      cells,
      beforeSheetDataXml: meta.beforeSheetDataXml,
      afterSheetDataXml: this._conditionalFormats.rewriteAfterSheetDataXml(
        meta.afterSheetDataXml,
      ),
      rootExtraAttrsXml: meta.rootExtraAttrsXml,
      mergeCells: this._mergedCells.toEntries(),
      conditionalFormatting: this._conditionalFormats.toModel(),
      dataValidations: this._dataValidations.toModel(),
      hyperlinks: { entries: materialize.entries },
      sheetFormatPr: this._sheetFormat.toModel(),
      sheetViews: this._freeze.toModel(),
      autoFilter: this._autoFilter.toModel(),
      sheetProtection: this._protection.toModel(),
      protectedRanges: this._protectedRanges.toModel(),
      cols: this._columns.toModel(),
      rows: this._rowProperties.toModel(),
      sortState: this._sortState.toModel(),
      pageSetup: this._pageSetup.toModel(),
      tableParts: this.ensureTablePartsForFlush(),
      ...(ownsDrawing ? { stripBagDrawing: true } : {}),
      ...(ownsDrawing && drawingRelationshipId !== undefined
        ? { drawingRelationshipId }
        : {}),
      ...(ownsLegacyDrawing ? { stripBagLegacyDrawing: true } : {}),
      ...(ownsLegacyDrawing && legacyDrawingRelationshipId !== undefined
        ? { legacyDrawingRelationshipId }
        : {}),
    };
    const bytes = serializeWorksheetXml(serializeArgs);
    host.package.setPart(this._partName, bytes, WORKSHEET_CONTENT_TYPE_TRANSITIONAL);
    this.cellsDirty = false;
  }

  /**
   * Inclusive corners of residual cells union authored row and column
   * records, or `undefined` when the sheet has neither. Walks the sparse
   * map and the column/row stores only — never allocates, never reads
   * `dimension@ref`.
   */
  private usedCellBounds():
    | { startRow: number; startCol: number; endRow: number; endCol: number }
    | undefined {
    if (this._kind !== 'worksheet') {
      throw new InvalidWorksheetError(
        `Sheet "${this._name}" is not a worksheet and does not support a used range`,
      );
    }
    this.ensureSheetDataLoaded();
    let minRow = Number.POSITIVE_INFINITY;
    let maxRow = 0;
    let minCol = Number.POSITIVE_INFINITY;
    let maxCol = 0;
    let found = false;
    this.cellRows.forEach((rowMap, row) => {
      rowMap.forEach((model, col) => {
        if (!cellModelHasResidue(model)) {
          return;
        }
        found = true;
        if (row < minRow) {
          minRow = row;
        }
        if (row > maxRow) {
          maxRow = row;
        }
        if (col < minCol) {
          minCol = col;
        }
        if (col > maxCol) {
          maxCol = col;
        }
      });
    });
    const authoredCol = this._columns.maxAuthoredIndex();
    if (authoredCol > 0) {
      found = true;
      if (1 < minCol) {
        minCol = 1;
      }
      if (authoredCol > maxCol) {
        maxCol = authoredCol;
      }
    }
    const authoredRow = this._rowProperties.maxAuthoredIndex();
    if (authoredRow > 0) {
      found = true;
      if (1 < minRow) {
        minRow = 1;
      }
      if (authoredRow > maxRow) {
        maxRow = authoredRow;
      }
    }
    if (!found || !Number.isFinite(minRow) || !Number.isFinite(minCol)) {
      return undefined;
    }
    return { startRow: minRow, startCol: minCol, endRow: maxRow, endCol: maxCol };
  }

  /**
   * `tableParts` model snapshot for the sheet write, consistent with the
   * lazily resolved entries (flush tables first when they changed).
   */
  private ensureTablePartsForFlush(): TablePartsModel {
    this.flushTablesIfDirty();
    return this.internalTablePartsModel();
  }

  /**
   * Snapshot whether any cell/merge/CF/data-validation/hyperlink/freeze/page-setup
   * /text-box mutation is pending.
   * @private
   */
  public get hasDirtyCells(): boolean {
    return this.cellsDirty;
  }

  /**
   * Add a picture for every cell whose `vm` resolves to an in-cell picture in the workbook rich data.
   */
  private loadPlacedPictures(richData: RichDataStore): void {
    this.cellRows.forEach((rowMap) => {
      rowMap.forEach((cell) => {
        if (cell.vm === undefined) {
          return;
        }
        const picture = richData.resolvePicture(cell.vm);
        if (picture !== undefined) {
          this._images.addLoadedPlaced({ ...picture, row: cell.row, column: cell.col, vm: cell.vm });
        }
      });
    });
  }

  /** Put or clear the `#VALUE!` host value of a picture placed in a cell. */
  private setImagePlaceholder(row: number, column: number, on: boolean): void {
    this.ensureSheetDataLoaded();
    if (on) {
      this.cell(row, column).value = { type: 'error', code: '#VALUE!' };
      return;
    }
    const model = this.getCellModel(row, column);
    if (model !== undefined) {
      model.vm = undefined;
      this.cell(row, column).clear();
    }
  }

  /** @private */
  /** @private */
  public isSheetDataLoaded(): boolean {
    return this.sheetDataLoaded;
  }

  /** @private */
  /** @private */
  public placedPictures(): ImageEntry[] {
    return this._images.placedPictures();
  }

  /** @private */
  /** @private */
  public vmCells(): Array<{ readonly row: number; readonly col: number; readonly vm: number }> {
    const out: Array<{ readonly row: number; readonly col: number; readonly vm: number }> = [];
    this.cellRows.forEach((rowMap) => {
      rowMap.forEach((cell) => {
        if (cell.vm !== undefined) {
          out.push({ row: cell.row, col: cell.col, vm: cell.vm });
        }
      });
    });
    return out;
  }

  /** @private */
  /** @private */
  public setCellVm(row: number, col: number, vm: number | undefined): void {
    const model = this.getCellModel(row, col);
    if (model === undefined) {
      return;
    }
    if (vm === undefined) {
      delete model.vm;
    } else {
      model.vm = vm;
    }
    this.markCellsDirty();
  }

  /** @private */
  /** @private */
  public isPlaceholderCell(row: number, col: number): boolean {
    const model = this.getCellModel(row, col);
    return model !== undefined && model.kind === 'error' && model.raw === '#VALUE!';
  }

  /** @private */
  /** @private */
  public dropPlaced(entry: ImageEntry): void {
    this._images.dropPlaced(entry);
  }

  /** @private */
  /** @private */
  public takeReleasedMedia(): string[] {
    return this._images.takeReleasedMedia();
  }

  private putCellModelInternal(model: CellModel): void {
    let rowMap = this.cellRows.get(model.row);
    if (rowMap === undefined) {
      rowMap = new Map();
      this.cellRows.set(model.row, rowMap);
    }
    rowMap.set(model.col, model);
  }

  private collectCells(): CellModel[] {
    const out: CellModel[] = [];
    const rowNums = [...this.cellRows.keys()].sort((a, b) => a - b);
    for (const rn of rowNums) {
      const rowMap = this.cellRows.get(rn);
      if (rowMap === undefined) {
        continue;
      }
      const cols = [...rowMap.keys()].sort((a, b) => a - b);
      for (const cn of cols) {
        const cell = rowMap.get(cn);
        if (cell !== undefined) {
          out.push(cell);
        }
      }
    }
    return out;
  }

  private requireCellHost(): WorksheetCellHost {
    if (this.cellHost === undefined) {
      throw new InvalidWorksheetError(
        `Worksheet "${this._name}" is not bound to a workbook cell host`,
      );
    }
    return this.cellHost;
  }
}

/**
 * Relative relationship Target from a worksheet part to a table part.
 * Standard layout: `/xl/worksheets/sheetN.xml` → `../tables/tableN.xml`.
 * @private
 */
/**
 * Normalize a scroll-anchor assignment to A1, or `undefined` to clear.
 * Does not invent `A1` when the caller clears the property.
 */
function normalizeScrollAnchor(
  value: string | undefined,
  label: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new InvalidArgumentError(
      `${label} must be an A1 cell address, or undefined`,
    );
  }
  try {
    const coord = parseA1(value);
    return formatA1(coord.row, coord.col);
  } catch (err) {
    throw new InvalidAddressError(`Invalid ${label} "${value}"`, {
      cause: err,
    });
  }
}

function relativeTargetFromWorksheet(
  worksheetPartName: string,
  tablePartName: string,
): string {
  const sheetSlash = worksheetPartName.lastIndexOf('/');
  const sheetDir =
    sheetSlash <= 0 ? '/' : worksheetPartName.slice(0, sheetSlash + 1);
  const tableSlash = tablePartName.lastIndexOf('/');
  const tableDir =
    tableSlash <= 0 ? '/' : tablePartName.slice(0, tableSlash + 1);
  if (tableDir === sheetDir) {
    return tablePartName.slice(tableDir.length);
  }
  // Walk up from the sheet directory to the common parent, then down.
  const sheetSegs = sheetDir === '/' ? [] : sheetDir.slice(1, -1).split('/');
  const tableSegs = tableDir === '/' ? [] : tableDir.slice(1, -1).split('/');
  let common = 0;
  while (
    common < sheetSegs.length &&
    common < tableSegs.length &&
    sheetSegs[common] === tableSegs[common]
  ) {
    common += 1;
  }
  const ups = sheetSegs.length - common;
  const downSegs = tableSegs.slice(common);
  const upsPart = ups > 0 ? '../'.repeat(ups) : './';
  const downPart =
    downSegs.length > 0 ? `${downSegs.join('/')}/` : '';
  return `${upsPart}${downPart}${tablePartName.slice(tableDir.length)}`;
}

/**
 * Order-insensitive relationship identity comparison for flush bookkeeping.
 * @private
 */
function arraysEqualRels(
  a: ReadonlyArray<OpcRelationship>,
  b: ReadonlyArray<OpcRelationship>,
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    const ra = a[i];
    const rb = b[i];
    if (
      ra === undefined ||
      rb === undefined ||
      ra.id !== rb.id ||
      ra.type !== rb.type ||
      ra.target !== rb.target ||
      ra.resolvedTarget !== rb.resolvedTarget
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Address string from a selection assignment. Accepts the host string and a
 * `Range` so existing callers of `sheet.range(...)` keep compiling.
 */
function selectionRef(value: string | Range): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || typeof value !== 'object' || typeof value.address !== 'string') {
    throw new InvalidArgumentError(
      'selectedRange must be an A1 address string, a Range from sheet.range(), or undefined',
    );
  }
  return value.address;
}

/**
 * True when a number format code displays a date or time. Quoted text and
 * escaped characters are ignored; a remaining `y`, `d`, `h`, or `s` marks a
 * date. A bare `m` is a minute unless it is the whole code.
 */
function isDateNumberFormat(formatCode: string): boolean {
  if (formatCode === DEFAULT_DATE_TIME_FORMAT) {
    return true;
  }
  let code = '';
  for (let i = 0; i < formatCode.length; i += 1) {
    const ch = formatCode.charAt(i);
    if (ch === '"') {
      i += 1;
      while (i < formatCode.length && formatCode.charAt(i) !== '"') {
        i += 1;
      }
      continue;
    }
    if (ch === '\\' || ch === '_') {
      i += 1;
      continue;
    }
    code += ch.toLowerCase();
  }
  const sections = code.split(';');
  for (const section of sections) {
    if (section.indexOf('y') >= 0 || section.indexOf('d') >= 0 ||
      section.indexOf('h') >= 0 || section.indexOf('s') >= 0) {
      return true;
    }
    if (/^m+$/.test(section.trim())) {
      return true;
    }
  }
  return false;
}

