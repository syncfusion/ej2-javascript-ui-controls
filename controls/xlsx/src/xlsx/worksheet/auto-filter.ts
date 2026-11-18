/**
 * Worksheet AutoFilter criteria metadata (`CT_AutoFilter` / `CT_FilterColumn` /
 * `CT_Filters` / `CT_Filter`).
 *
 * Citations:
 * - ECMA-376-1 5th ed. §18.3.1.2 `autoFilter`, §18.3.2.6 `filterColumn`,
 *   §18.3.2.7 `filters`, §18.3.2.8 `filter`
 * - transitional sml.xsd `CT_AutoFilter`, `CT_FilterColumn`, `CT_Filters`,
 *   `CT_Filter`; `CT_Worksheet` sequence: **`autoFilter`** → `sortState` →
 *   `dataConsolidate` (~L2182–2186)
 * - docs/requirements/auto-filter.md; docs/specs/auto-filter.md;
 *   docs/ooxml-mapping/auto-filter.md
 * - docs/api/AUTO-FILTER-PROPOSAL.md (accepted)
 *
 * This feature is the **criteria record** Excel persists for filter dropdowns
 * and selected values. It never hides rows, evaluates criteria against cells,
 * or rewrites grid data. Discrete values, custom criteria (`CT_CustomFilters`),
 * and date groups (`CT_DateGroupItem`) are modeled. Top 10, dynamic, color,
 * icon, and extension arms, plus unknown attributes, round-trip opaquely.
 * Nested `CT_AutoFilter/sortState` is modeled as {@link AutoFilter.dataSorter}
 * (separate from worksheet-level {@link DataSorter}). Table-embedded
 * `autoFilter` stays opaque in the tables feature.
 *
 * Text criteria that Excel stores as wildcard `equal` (`*text*`, `text*`,
 * `*text`) are exposed as contains / beginsWith / endsWith. Citations:
 * transitional sml.xsd `CT_CustomFilters`, `CT_CustomFilter`,
 * `ST_FilterOperator`, `CT_DateGroupItem`, `ST_DateTimeGrouping`.
 */

import { formatA1Range, parseA1Range, CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidAutoFilterError } from '../core/errors';
import { attrsToXmlExcluding, escapeXml, parseAttrMap } from '../core/xml/minimal-xml';
import {
  DataSorter,
  parseSortStateXml,
  serializeSortStateXml,
  SortStateHost,
  SortStateImpl,
  SortStateModel,
} from './sort-state';

/**
 * Which criteria a filter column stores.
 *
 * - `values` — checked-item list (`CT_Filters` / `filter`)
 * - `custom` — one or two comparison criteria (`CT_CustomFilters`)
 * - `dateGroup` — year / month / day groups (`dateGroupItem`)
 * - `unsupported` — top 10, color, icon, dynamic, or other preserved markup
 */
export type FilterType = 'values' | 'custom' | 'dateGroup' | 'unsupported';

/**
 * How the column's cells read, so a host can open the matching filter menu.
 * Computed from the worksheet grid. Not written to the file.
 */
export type FilterDataType = 'text' | 'number' | 'date' | 'mixed';

/**
 * Comparison used by a custom filter condition.
 *
 * Number and date comparisons map to `ST_FilterOperator`. Text comparisons
 * `beginsWith`, `endsWith`, and `contains` are stored as `equal` with Excel
 * wildcard values (`text*`, `*text`, `*text*`). `doesNotContain` is stored as
 * `notEqual` with `*text*`.
 */
export type FilterOperator =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'beginsWith'
  | 'endsWith'
  | 'contains'
  | 'doesNotContain';

/**
 * One custom filter condition (`CT_CustomFilter`).
 */
export interface FilterCondition {
  readonly operator: FilterOperator;
  /** Comparison text. Omitted for operators that do not need a value. */
  readonly value?: string;
}

/**
 * One date-tree selection (`CT_DateGroupItem`).
 *
 * `month` and `day` are 1-based. A year-only group omits both; a month group
 * omits `day`.
 */
export interface DateGroup {
  readonly year: number;
  readonly month?: number;
  readonly day?: number;
}


/**
 * Represents the filter settings for one column within an AutoFilter range,
 * letting you choose which values the column shows or hides.
 */
export interface FilterColumn {
  /**
   * Which column the filter applies to, counted from zero within the
   * filtered range — `0` is its first column.
   */
  readonly columnIndex: number;
  /**
   * Whether the filter button appears on the column's header cell.
   * Default `true`.
   */
  isButtonVisible: boolean;
  /**
   * Whether the filter button is hidden on the column's header cell.
   * Default `false`.
   */
  isButtonHidden: boolean;
  /**
   * Whether blank cells are included in the filter. Default `false`.
   */
  isBlank: boolean;
  /** The number of filter values defined for the column. */
  readonly count: number;
  /**
   * Get the column's filter values as a list, in the order they were added.
   *
   * @returns the current filter values.
   */
  values(): ReadonlyArray<string>;
  /**
   * Add one value to the column's filter. Values already in the filter are
   * skipped, so each value appears once.
   *
   * @param value - The value to filter by, like `'Delivered'`.
   * @throws InvalidArgumentError when value is not a string
   */
  addValue(value: string): void;
  /**
   * Add multiple values to the column's filter at once. Values already in
   * the filter are skipped.
   *
   * @param values - The values to filter by.
   * @throws InvalidArgumentError when values is not an array of strings
   */
  addValues(values: ReadonlyArray<string>): void;
  /**
   * Remove one value from the column's filter. Does nothing when the value
   * is not in the filter.
   *
   * @param value - The value to remove.
   * @throws InvalidArgumentError when value is not a string
   */
  removeValue(value: string): void;
  /**
   * Remove the filter value at a zero-based position, in the order the
   * values were added.
   *
   * @param index - The zero-based position of the value to remove.
   * @throws InvalidArgumentError when index is out of range
   */
  removeValueAt(index: number): void;
  /**
   * Remove every filter value from the column. The blank-cell and
   * filter-button settings are kept.
   */
  clearValues(): void;
}

/**
 * Represents the filter applied to a range of cells, letting you manage which
 * rows are shown based on column criteria.
 *
 * A worksheet can have at most one filter.
 */
export interface AutoFilter {
  /**
   * Returns the cell range the filter covers, such as `A1:C20`.
   */
  readonly range: string;
  /** Returns the number of columns that have filter criteria applied. */
  readonly count: number;
  /**
   * Returns every column filter on the worksheet, in the order they appear
   * in the file.
   */
  list(): ReadonlyArray<FilterColumn>;
  /**
   * Adds filter criteria for one column, or replaces the criteria if that
   * column already has a filter, and returns a handle for further changes.
   * Set the values and button/blank flags on the returned handle (defaults:
   * empty values, `isBlank` false, `isButtonVisible` true,
   * `isButtonHidden` false).
   *
   * @param columnIndex zero-based offset within the AutoFilter range (`@colId`)
   * @returns live {@link FilterColumn}
   * @throws InvalidAutoFilterError when columnIndex is not a finite unsigned integer
   */
  addFilterColumn(columnIndex: number): FilterColumn;
  /**
   * Returns the column filter at the given position, counted from zero in
   * the order the filters were added.
   * @throws InvalidArgumentError when out of range
   */
  get(index: number): FilterColumn;
  /**
   * Returns the filter applied to the given column, counted from zero
   * within the filter's range, or `undefined` if that column has no filter.
   */
  getByColumnIndex(columnIndex: number): FilterColumn | undefined;
  /**
   * Removes the given column filter. Does nothing if it does not belong to
   * this filter.
   * @throws InvalidArgumentError when argument is not a column handle of this filter
   */
  removeFilterColumn(column: FilterColumn): void;
  /**
   * Removes the column filter at the given position, counted from zero.
   * @throws InvalidArgumentError when out of range
   */
  removeFilterColumnAt(index: number): void;
  /** Removes the filter criteria from every column; the filter itself and its range remain. */
  clearFilterColumns(): void;
  /**
   * Sort settings nested under this AutoFilter (`CT_AutoFilter/sortState`),
   * or `undefined` when absent. Independent of worksheet-level
   * {@link Worksheet.dataSorter}.
   */
  readonly dataSorter: DataSorter | undefined;
  /**
   * Author or replace the nested sort state under this AutoFilter.
   *
   * @param range - A1 range for `sortState/@ref` (often the data body under the header row)
   * @returns live nested {@link DataSorter}
   */
  addDataSorter(range: string): DataSorter;
  /** Remove the nested sort state under this AutoFilter. */
  removeDataSorter(): void;
}

/**
 * One discrete filter value (`CT_Filter`).
 * @private
 */
/**
 * One modeled custom criterion (`CT_CustomFilter`).
 * @private
 */
export interface CustomFilterEntry {
  /** Raw `ST_FilterOperator` lexical, or undefined when the attribute is absent (equal). */
  readonly operator: string | undefined;
  readonly val: string | undefined;
  readonly extraAttrsXml: string;
}

/**
 * One modeled date group (`CT_DateGroupItem`).
 * @private
 */
export interface DateGroupEntry {
  readonly year: number;
  readonly month: number | undefined;
  readonly day: number | undefined;
  /** `ST_DateTimeGrouping` lexical (`year` | `month` | `day` | …). */
  readonly dateTimeGrouping: string;
  readonly hour: number | undefined;
  readonly minute: number | undefined;
  readonly second: number | undefined;
  readonly extraAttrsXml: string;
}

export interface FilterValueEntry {
  readonly val: string;
  /** Extra attributes (unknown) preserved on the filter element. */
  readonly extraAttrsXml: string;
}

/**
 * Internal modeled / opaque `CT_FilterColumn` entry.
 *
 * Modeled entries carry discrete values, custom criteria, and date groups.
 * Opaque entries hold a whole-element backup for unsupported choice arms
 * (top 10, dynamic, color, icon) and are not exposed in the public list.
 *
 * Tri-state booleans: `undefined` = attribute absent (XSD default);
 * explicit `true`/`false` round-trip their lexical form.
 * @private
 */
export interface FilterColumnEntry {
  /**
   * When true, this entry is modeled (`filters` arm). When false, `xml`
   * holds the whole-element opaque backup.
   */
  readonly modeled: boolean;
  readonly colId: number;
  /** `@hiddenButton` — default false. */
  readonly hiddenButton: boolean | undefined;
  /** `@showButton` — default true. */
  readonly showButton: boolean | undefined;
  /** `CT_Filters/@blank` — default false. */
  readonly blank: boolean | undefined;
  /** Discrete `filter@val` entries in document order. */
  readonly values: ReadonlyArray<FilterValueEntry>;
  /**
   * Opaque content under `filters` after the modeled `filter` children
   * (typically `dateGroupItem*`), plus any unknown children of filters.
   */
  readonly filtersExtraChildrenXml: ReadonlyArray<string>;
  /** Extra attributes on `filterColumn` (unknown / invalid lexicals). */
  readonly extraAttrsXml: string;
  /** Extra attributes on the `filters` element. */
  readonly filtersExtraAttrsXml: string;
  /** Modeled `customFilter` children (at most two). */
  readonly customFilters: ReadonlyArray<CustomFilterEntry>;
  /** `CT_CustomFilters/@and`. Undefined = attribute absent (XSD default false). */
  readonly customAnd: boolean | undefined;
  /** Extra attributes on `customFilters`. */
  readonly customFiltersExtraAttrsXml: string;
  /** Modeled `dateGroupItem` children in file order. */
  readonly dateGroups: ReadonlyArray<DateGroupEntry>;
  /**
   * Whole-element backup for opaque (non-modeled) columns, or undefined for
   * modeled columns.
   */
  readonly xml: string | undefined;
}

/**
 * Wire model for the worksheet-level `autoFilter` element.
 * @private
 */
export interface AutoFilterModel {
  readonly present: boolean;
  /** Parsed `CT_AutoFilter/@ref` (required for modeled present states). */
  readonly range: CellRange | undefined;
  /**
   * Filter columns in document order. Modeled filters-arm entries are
   * public; opaque entries serialize but are hidden from public list/count.
   */
  readonly columns: ReadonlyArray<FilterColumnEntry>;
  /**
   * First modeled nested `sortState` under `CT_AutoFilter` (schema order:
   * filterColumn* → sortState? → extLst?). Unparsable / subsequent sortState
   * elements stay in {@link extraChildrenXml}.
   */
  readonly sortState: SortStateModel | undefined;
  /**
   * Opaque children in relative order after filterColumn* (and after a
   * modeled nested sortState when present): extra `sortState`, `extLst`,
   * unknown elements. Relative order among themselves is kept; they always
   * serialize after the column list and the modeled nested sortState.
   */
  readonly extraChildrenXml: ReadonlyArray<string>;
  /** Extra attributes (unknown, plus invalid lexicals excluded from model). */
  readonly extraAttrsXml: string;
  /**
   * Whole-element backup when the root `ref` is unparsable-but-preserved:
   * emits verbatim; public `autoFilter` reads as `undefined`. Modeled states
   * have `undefined`.
   */
  readonly xml: string | undefined;
}

/** Absent AutoFilter: nothing emitted, every public read is `undefined`. */
const EMPTY_MODEL: AutoFilterModel = {
  present: false,
  range: undefined,
  columns: [],
  sortState: undefined,
  extraChildrenXml: [],
  extraAttrsXml: '',
  xml: undefined,
};

/**
 * Host notifications for AutoFilter mutations.
 * @private
 */
export interface AutoFilterHost {
  markDirty(): void;
  /**
   * Cell values in one filtered column, header excluded. Used only to
   * classify {@link FilterColumn.dataType}.
   */
  columnValues?(columnIndex: number): ReadonlyArray<unknown>;
}

/**
 * Internal AutoFilter implementation (package-owned singleton per worksheet).
 * Public {@link AutoFilter} identity is a generation-bound
 * {@link AutoFilterHandle} so replace/clear detach prior API references.
 * @private
 */
export class AutoFilterImpl {
  private model: AutoFilterModel = EMPTY_MODEL;
  private host: AutoFilterHost | undefined;
  /** Generation token: bumped on whole-state replace / clear so old handles die. */
  private generation = 0;
  private readonly handles = new Set<FilterColumnHandle>();
  /** Cached public root handle for the current generation (stable identity). */
  private rootHandle: AutoFilterHandle | undefined;
  /**
   * Nested `CT_AutoFilter/sortState` store. Bound so mutations mark the
   * worksheet dirty through this AutoFilter host. Rebuilt on parse/author
   * and cleared with the AutoFilter.
   */
  private nestedSort: SortStateImpl = new SortStateImpl();

  /** Whether a modeled AutoFilter is present (public façade gate). */
  public get isPresent(): boolean {
    return this.model.present && this.model.range !== undefined;
  }

  /**
   * Bind the host that receives dirty notifications.
   * @private
   */
  public bindHost(host: AutoFilterHost): void {
    this.host = host;
    this.nestedSort.bindHost(this.nestedSortHost());
  }

  private nestedSortHost(): SortStateHost {
    return {
      markDirty: (): void => {
        (this.host == null ? undefined : this.host.markDirty());
      },
    };
  }

  /**
   * Sync nested sorter model into the AutoFilter model before serialize /
   * clone snapshots so nested mutations are not lost.
   * @private
   */
  private flushNestedSortIntoModel(): void {
    if (!this.model.present) {
      return;
    }
    const nested = this.nestedSort.toModel();
    const sortState = nested.present ? nested : undefined;
    this.model = { ...this.model, sortState };
  }

  /**
   * Current generation-bound public handle, or `undefined` when absent.
   * Same object for a given generation so `sheet.autoFilter === addAutoFilter(…)`.
   * @private
   */
  public getPublicHandle(): AutoFilter | undefined {
    if (!this.isPresent) {
      return undefined;
    }
    if (
      this.rootHandle === undefined ||
      !this.rootHandle.isLiveFor(this.generation)
    ) {
      this.rootHandle = new AutoFilterHandle(this, this.generation);
    }
    return this.rootHandle;
  }

  public get range(): string {
    this.assertLive();
    return formatA1Range(this.modelRange());
  }

  public get count(): number {
    this.assertLive();
    return this.modeledColumns().length;
  }

  public list(): ReadonlyArray<FilterColumn> {
    this.assertLive();
    return this.modeledColumns().map((e) => this.handleFor(e));
  }

  public addFilterColumn(columnIndex: number): FilterColumn {
    this.assertLive();
    const colId = columnIndex;
    if (!Number.isInteger(colId) || colId < 0 || !Number.isFinite(colId)) {
      throw new InvalidAutoFilterError(
        `Filter column index must be a finite unsigned integer (received ${String(colId)})`,
      );
    }

    // Defaults: empty values; omit-default booleans (hiddenButton/blank false,
    // showButton true) so XSD defaults are not written until the handle mutates.
    const authored: FilterColumnEntry = emptyModeledColumn(colId);

    const next = this.model.columns.slice();
    // Replace existing modeled or opaque entry with same colId.
    const existingIdx = next.findIndex((c) => c.colId === colId);
    if (existingIdx >= 0) {
      // Kill any live handle for the replaced entry.
      for (const h of [...this.handles]) {
        if (h.columnIndex === colId) {
          h.kill();
          this.handles.delete(h);
        }
      }
      next[existingIdx] = authored;
    } else {
      next.push(authored);
    }

    this.model = {
      ...this.model,
      columns: next,
    };
    (this.host == null ? undefined : this.host.markDirty());
    return this.handleFor(authored);
  }

  public get(index: number): FilterColumn {
    this.assertLive();
    const modeled = this.modeledColumns();
    assertColumnIndex(index, modeled.length);
    const entry = modeled[index];
    if (entry === undefined) {
      throw new InvalidArgumentError(
        `Filter column index must be an integer in [0, ${String(modeled.length)}) (received ${String(index)})`,
      );
    }
    return this.handleFor(entry);
  }

  public getByColumnIndex(columnIndex: number): FilterColumn | undefined {
    this.assertLive();
    if (!Number.isInteger(columnIndex) || columnIndex < 0) {
      return undefined;
    }
    const entry = this.modeledColumns().find((c) => c.colId === columnIndex);
    return entry === undefined ? undefined : this.handleFor(entry);
  }

  public removeFilterColumn(column: FilterColumn): void {
    this.assertLive();
    if (!(column instanceof FilterColumnHandle)) {
      throw new InvalidArgumentError('Argument must be a filter column handle of this AutoFilter');
    }
    if (!this.handles.has(column) || !column.isLive(this.generation)) {
      return;
    }
    const colId = column.columnIndex;
    const next = this.model.columns.filter((c) => !(c.modeled && c.colId === colId));
    column.kill();
    this.handles.delete(column);
    this.model = { ...this.model, columns: next };
    (this.host == null ? undefined : this.host.markDirty());
  }

  public removeFilterColumnAt(index: number): void {
    this.assertLive();
    const modeled = this.modeledColumns();
    assertColumnIndex(index, modeled.length);
    const target = modeled[index];
    if (target === undefined) {
      return;
    }
    for (const h of [...this.handles]) {
      if (h.columnIndex === target.colId) {
        h.kill();
        this.handles.delete(h);
      }
    }
    let seen = -1;
    const next: FilterColumnEntry[] = [];
    for (const c of this.model.columns) {
      if (c.modeled) {
        seen += 1;
        if (seen === index) {
          continue;
        }
      }
      next.push(c);
    }
    this.model = { ...this.model, columns: next };
    (this.host == null ? undefined : this.host.markDirty());
  }

  public clearFilterColumns(): void {
    this.assertLive();
    for (const h of this.handles) {
      h.kill();
    }
    this.handles.clear();
    // Drop modeled columns; keep opaque columns so non-P1 arms survive clear.
    this.model = {
      ...this.model,
      columns: this.model.columns.filter((c) => !c.modeled),
    };
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Nested sort state under this AutoFilter, or `undefined` when absent.
   * @private
   */
  public getNestedDataSorter(): DataSorter | undefined {
    this.assertLive();
    return this.nestedSort.isPresent ? this.nestedSort : undefined;
  }

  /**
   * Author or replace nested `sortState` under this AutoFilter.
   * @private
   */
  public addNestedDataSorter(range: string): DataSorter {
    this.assertLive();
    this.nestedSort.authorState(range);
    this.flushNestedSortIntoModel();
    return this.nestedSort;
  }

  /**
   * Remove nested `sortState` under this AutoFilter.
   * @private
   */
  public removeNestedDataSorter(): void {
    this.assertLive();
    if (!this.nestedSort.isPresent && this.model.sortState === undefined) {
      return;
    }
    this.nestedSort.clearState();
    this.model = { ...this.model, sortState: undefined };
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Author a fresh AutoFilter (or replace the existing record).
   * @private
   */
  public authorState(rangeText: string): void {
    const range = parseFilterRange(rangeText);
    this.invalidateHandles();
    this.generation += 1;
    this.rootHandle = undefined;
    this.nestedSort.clearState();
    this.model = {
      present: true,
      range,
      columns: [],
      sortState: undefined,
      extraChildrenXml: [],
      extraAttrsXml: '',
      xml: undefined,
    };
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Remove the AutoFilter entirely.
   * @private
   */
  public clearState(): void {
    if (!this.model.present && this.model.xml === undefined) {
      return;
    }
    this.invalidateHandles();
    this.generation += 1;
    this.rootHandle = undefined;
    this.nestedSort.clearState();
    this.model = EMPTY_MODEL;
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Replace internal model from parse.
   * @private
   */
  public replaceFromParse(model: AutoFilterModel): void {
    this.invalidateHandles();
    this.generation += 1;
    this.rootHandle = undefined;
    this.model = cloneModel(model);
    this.nestedSort.replaceFromParse(this.model.sortState);
  }

  /**
   * Snapshot for serialize.
   * @private
   */
  public toModel(): AutoFilterModel {
    this.flushNestedSortIntoModel();
    return cloneModel(this.model);
  }

  /**
   * @private
   */
  public writeColumnMutation(
    colId: number,
    mutate: (entry: FilterColumnEntry) => FilterColumnEntry,
  ): void {
    this.assertLive();
    const idx = this.model.columns.findIndex((c) => c.modeled && c.colId === colId);
    if (idx < 0) {
      throw new InvalidAutoFilterError('Filter column handle is no longer attached');
    }
    const current = this.model.columns[idx];
    if (current === undefined || !current.modeled) {
      throw new InvalidAutoFilterError('Filter column handle is no longer attached');
    }
    const next = this.model.columns.slice();
    next[idx] = mutate(current);
    this.model = { ...this.model, columns: next };
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * @private
   */
  /**
   * Cell values under one filter column, or an empty list when the host
   * has no grid.
   * @private
   */
  public columnValues(columnIndex: number): ReadonlyArray<unknown> {
    const host = this.host;
    if (host === undefined || host.columnValues === undefined) {
      return [];
    }
    return host.columnValues(columnIndex);
  }

  public readColumn(colId: number): FilterColumnEntry {
    const entry = this.model.columns.find((c) => c.modeled && c.colId === colId);
    if (entry === undefined || !entry.modeled) {
      throw new InvalidAutoFilterError('Filter column handle is no longer attached');
    }
    return entry;
  }

  /**
   * @private
   */
  public currentGeneration(): number {
    return this.generation;
  }

  /**
   * @private
   */
  public unregisterHandle(handle: FilterColumnHandle): void {
    this.handles.delete(handle);
  }

  private modeledColumns(): ReadonlyArray<FilterColumnEntry> {
    return this.model.columns.filter((c) => c.modeled);
  }

  private handleFor(entry: FilterColumnEntry): FilterColumnHandle {
    for (const h of this.handles) {
      if (h.columnIndex === entry.colId && h.isLive(this.generation)) {
        return h;
      }
    }
    const handle = new FilterColumnHandle(this, entry.colId, this.generation);
    this.handles.add(handle);
    return handle;
  }

  private invalidateHandles(): void {
    for (const h of this.handles) {
      h.kill();
    }
    this.handles.clear();
  }

  private assertLive(): void {
    if (!this.model.present || this.model.range === undefined) {
      throw new InvalidAutoFilterError('AutoFilter is not present on this worksheet');
    }
  }

  private modelRange(): CellRange {
    const range = this.model.range;
    if (range === undefined) {
      throw new InvalidAutoFilterError('AutoFilter has no parsed range');
    }
    return range;
  }
}

function assertColumnIndex(index: number, length: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    throw new InvalidArgumentError(
      `Filter column index must be an integer in [0, ${String(length)}) (received ${String(index)})`,
    );
  }
}

const FILTER_OPERATORS: ReadonlyArray<FilterOperator> = [
  'equal',
  'notEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
  'beginsWith',
  'endsWith',
  'contains',
  'doesNotContain',
];

function isFilterOperator(value: string): value is FilterOperator {
  for (const op of FILTER_OPERATORS) {
    if (op === value) {
      return true;
    }
  }
  return false;
}

function columnType(entry: FilterColumnEntry): FilterType {
  if (!entry.modeled) {
    return 'unsupported';
  }
  if (entry.customFilters.length > 0) {
    return 'custom';
  }
  if (entry.dateGroups.length > 0 && entry.values.length === 0) {
    return 'dateGroup';
  }
  return 'values';
}

function toPublicCondition(entry: CustomFilterEntry): FilterCondition {
  const rawOp = entry.operator === undefined || entry.operator.length === 0 ? 'equal' : entry.operator;
  const rawVal = entry.val === undefined ? '' : entry.val;
  if (rawOp === 'equal' || rawOp === 'notEqual') {
    const wild = wildcardOperator(rawOp, rawVal);
    if (wild !== undefined) {
      return wild;
    }
  }
  const operator: FilterOperator = isFilterOperator(rawOp) ? rawOp : 'equal';
  if (entry.val === undefined) {
    return { operator };
  }
  return { operator, value: entry.val };
}

function wildcardOperator(rawOp: string, rawVal: string): FilterCondition | undefined {
  if (rawVal.length >= 2 && rawVal.charAt(0) === '*' && rawVal.charAt(rawVal.length - 1) === '*') {
    const inner = rawVal.slice(1, rawVal.length - 1);
    if (inner.indexOf('*') < 0 && inner.indexOf('?') < 0) {
      return {
        operator: rawOp === 'notEqual' ? 'doesNotContain' : 'contains',
        value: inner,
      };
    }
  }
  if (rawOp === 'equal' && rawVal.length >= 1 && rawVal.charAt(rawVal.length - 1) === '*' && rawVal.charAt(0) !== '*') {
    const inner = rawVal.slice(0, rawVal.length - 1);
    if (inner.indexOf('*') < 0 && inner.indexOf('?') < 0) {
      return { operator: 'beginsWith', value: inner };
    }
  }
  if (rawOp === 'equal' && rawVal.length >= 1 && rawVal.charAt(0) === '*' && rawVal.charAt(rawVal.length - 1) !== '*') {
    const inner = rawVal.slice(1);
    if (inner.indexOf('*') < 0 && inner.indexOf('?') < 0) {
      return { operator: 'endsWith', value: inner };
    }
  }
  return undefined;
}

function toStoredCondition(operator: FilterOperator, value: string | undefined): CustomFilterEntry {
  if (operator === 'contains' || operator === 'doesNotContain') {
    return {
      operator: operator === 'doesNotContain' ? 'notEqual' : 'equal',
      val: `*${value === undefined ? '' : value}*`,
      extraAttrsXml: '',
    };
  }
  if (operator === 'beginsWith') {
    return { operator: 'equal', val: `${value === undefined ? '' : value}*`, extraAttrsXml: '' };
  }
  if (operator === 'endsWith') {
    return { operator: 'equal', val: `*${value === undefined ? '' : value}`, extraAttrsXml: '' };
  }
  return {
    operator: operator === 'equal' ? undefined : operator,
    val: value,
    extraAttrsXml: '',
  };
}

function toPublicDateGroup(entry: DateGroupEntry): DateGroup | undefined {
  if (entry.dateTimeGrouping === 'year') {
    return { year: entry.year };
  }
  if (entry.dateTimeGrouping === 'month' && entry.month !== undefined) {
    return { year: entry.year, month: entry.month };
  }
  if (entry.dateTimeGrouping === 'day' && entry.month !== undefined && entry.day !== undefined) {
    return { year: entry.year, month: entry.month, day: entry.day };
  }
  return undefined;
}

function toStoredDateGroup(group: DateGroup): DateGroupEntry {
  if (group === null || group === undefined || typeof group !== 'object') {
    throw new InvalidArgumentError('Date group must be an object with a year');
  }
  const year = group.year;
  const month = group.month;
  const day = group.day;
  if (!Number.isInteger(year) || year < 0 || year > 65535) {
    throw new InvalidArgumentError('Date group year must be an integer from 0 to 65535');
  }
  if (month !== undefined && (!Number.isInteger(month) || month < 1 || month > 12)) {
    throw new InvalidArgumentError('Date group month must be an integer from 1 to 12');
  }
  if (day !== undefined && month === undefined) {
    throw new InvalidArgumentError('Date group day requires a month');
  }
  if (day !== undefined && (!Number.isInteger(day) || day < 1 || day > 31)) {
    throw new InvalidArgumentError('Date group day must be an integer from 1 to 31');
  }
  if (day !== undefined && month !== undefined) {
    return {
      year,
      month,
      day,
      dateTimeGrouping: 'day',
      hour: undefined,
      minute: undefined,
      second: undefined,
      extraAttrsXml: '',
    };
  }
  if (month !== undefined) {
    return {
      year,
      month,
      day: undefined,
      dateTimeGrouping: 'month',
      hour: undefined,
      minute: undefined,
      second: undefined,
      extraAttrsXml: '',
    };
  }
  return {
    year,
    month: undefined,
    day: undefined,
    dateTimeGrouping: 'year',
    hour: undefined,
    minute: undefined,
    second: undefined,
    extraAttrsXml: '',
  };
}

function sameDateGroup(a: DateGroupEntry, b: DateGroupEntry): boolean {
  return (
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day &&
    a.dateTimeGrouping === b.dateTimeGrouping
  );
}

function classifyColumnValues(values: ReadonlyArray<unknown>): FilterDataType {
  let sawText = false;
  let sawNumber = false;
  let sawDate = false;
  for (const value of values) {
    const kind = classifyCellValue(value);
    if (kind === 'text') {
      sawText = true;
    } else if (kind === 'number') {
      sawNumber = true;
    } else if (kind === 'date') {
      sawDate = true;
    }
  }
  const kinds = (sawText ? 1 : 0) + (sawNumber ? 1 : 0) + (sawDate ? 1 : 0);
  if (kinds !== 1) {
    return 'mixed';
  }
  if (sawText) {
    return 'text';
  }
  if (sawNumber) {
    return 'number';
  }
  return 'date';
}

function classifyCellValue(value: unknown): 'text' | 'number' | 'date' | 'skip' {
  if (value === undefined || value === null || value === '') {
    return 'skip';
  }
  if (value instanceof Date) {
    return 'date';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'skip';
  }
  if (typeof value === 'string') {
    return 'text';
  }
  if (typeof value === 'object') {
    const record = value as { type?: unknown; text?: unknown; value?: unknown };
    if (record.type === 'date' || record.value instanceof Date) {
      return 'date';
    }
    if (typeof record.text === 'string') {
      return record.text.length === 0 ? 'skip' : 'text';
    }
  }
  return 'skip';
}

function assertValueIndex(index: number, length: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    throw new InvalidArgumentError(
      `Filter value index must be an integer in [0, ${String(length)}) (received ${String(index)})`,
    );
  }
}

function parseFilterRange(rangeText: string): CellRange {
  const trimmed =
    rangeText === undefined || rangeText === null ? '' : String(rangeText).trim();
  if (trimmed.length === 0) {
    throw new InvalidArgumentError('AutoFilter range must be a non-empty string');
  }
  try {
    return parseA1Range(trimmed);
  } catch (err) {
    throw new InvalidAutoFilterError(`AutoFilter range "${trimmed}" is not a valid A1 range`, {
      cause: err,
    });
  }
}

/**
 * CT_Worksheet locals that appear **before** `autoFilter` after `sheetData`.
 */
export const AUTO_FILTER_PREDECESSORS: ReadonlyArray<string> = [
  'sheetCalcPr',
  'sheetProtection',
  'protectedRanges',
  'scenarios',
];

/**
 * CT_Worksheet locals that appear **after** `autoFilter`.
 * Includes `sortState` (the immediate successor) plus sort-state successors.
 */
export const AUTO_FILTER_SUCCESSORS: ReadonlyArray<string> = [
  'sortState',
  'dataConsolidate',
  'customSheetViews',
  'mergeCells',
  'phoneticPr',
  'conditionalFormatting',
  'dataValidations',
  'hyperlinks',
  'printOptions',
  'pageMargins',
  'pageSetup',
  'headerFooter',
  'rowBreaks',
  'colBreaks',
  'customProperties',
  'cellWatches',
  'ignoredErrors',
  'smartTags',
  'drawing',
  'legacyDrawing',
  'legacyDrawingHF',
  'drawingHF',
  'picture',
  'oleObjects',
  'controls',
  'webPublishItems',
  'tableParts',
  'extLst',
];

const PREDECESSOR_SET: ReadonlySet<string> = new Set(AUTO_FILTER_PREDECESSORS);
const SUCCESSOR_SET: ReadonlySet<string> = new Set(AUTO_FILTER_SUCCESSORS);

/**
 * Index at which to insert the serializter` among after
  'extLst',
];

cings. Prefer: after the last known predecessor present; else before
 * the first known successor; else append. Unknown elements keep relative order.
 * @private
 */
export function findAutoFilterInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
  let lastPred = -1;
  for (let i = 0; i < afterSheetDataLocals.length; i += 1) {
    const name = afterSheetDataLocals[i];
    if (name !== undefined && PREDECESSOR_SET.has(name)) {
      lastPred = i;
    }
  }
  if (lastPred >= 0) {
    return lastPred + 1;
  }
  for (let i = 0; i < afterSheetDataLocals.length; i += 1) {
    const name = afterSheetDataLocals[i];
    if (name !== undefined && SUCCESSOR_SET.has(name)) {
      return i;
    }
  }
  return afterSheetDataLocals.length;
}

/**
 * Parse a worksheet-level `autoFilter` element.
 * Unparsable root ref → whole-element opaque backup (`present: false`,
 * `xml` set) so a no-op save preserves it.
 *
 * @private
 */
export function parseAutoFilterXml(autoFilterXml: string): AutoFilterModel {
  const attrs = parseAttrMap(elementOpenAttrsLocal(autoFilterXml));
  const refRaw = attrs.get('ref');
  let range: CellRange | undefined;
  if (refRaw !== undefined && refRaw.trim().length > 0) {
    try {
      range = parseA1Range(refRaw);
    } catch {
      range = undefined;
    }
  }
  if (range === undefined) {
    return {
      present: false,
      range: undefined,
      columns: [],
      sortState: undefined,
      extraChildrenXml: [],
      extraAttrsXml: '',
      xml: autoFilterXml,
    };
  }

  const exclude = new Set(['ref']);
  const extraAttrsXml = attrsToXmlExcluding(attrs, exclude);

  const columns: FilterColumnEntry[] = [];
  const extraChildrenXml: string[] = [];
  let sortState: SortStateModel | undefined;
  const children = splitTopLevelLocal(elementInnerLocal(autoFilterXml));
  for (const child of children) {
    const local = elementLocalNameLocal(child);
    if (local === 'filterColumn') {
      columns.push(parseFilterColumnEntry(child));
      continue;
    }
    if (local === 'sortState' && sortState === undefined) {
      // First nested sortState: model via the shared CT_SortState codec.
      // Unparsable root (missing/bad @ref) → keep the element opaque so a
      // no-op save does not drop markup; subsequent sortState stay opaque.
      const parsed = parseSortStateXml(child);
      if (parsed.present && parsed.range !== undefined) {
        sortState = parsed;
        continue;
      }
    }
    // extLst / unknown / extra or opaque sortState: preserve after columns.
    extraChildrenXml.push(child);
  }

  return {
    present: true,
    range,
    columns,
    sortState,
    extraChildrenXml,
    extraAttrsXml,
    xml: undefined,
  };
}

/**
 * Choice-arm local names under CT_FilterColumn that are NOT the P1
 * discrete-filters arm. Whole element stays opaque.
 */
const OPAQUE_FILTER_ARMS: ReadonlySet<string> = new Set([
  'top10',
  'dynamicFilter',
  'colorFilter',
  'iconFilter',
  'extLst',
]);

function emptyModeledColumn(colId: number): FilterColumnEntry {
  return {
    modeled: true,
    colId,
    hiddenButton: undefined,
    showButton: undefined,
    blank: undefined,
    values: [],
    filtersExtraChildrenXml: [],
    extraAttrsXml: '',
    filtersExtraAttrsXml: '',
    customFilters: [],
    customAnd: undefined,
    customFiltersExtraAttrsXml: '',
    dateGroups: [],
    xml: undefined,
  };
}

function opaqueColumn(colId: number | undefined, xml: string): FilterColumnEntry {
  return {
    modeled: false,
    colId: colId != null ? colId : -1,
    hiddenButton: undefined,
    showButton: undefined,
    blank: undefined,
    values: [],
    filtersExtraChildrenXml: [],
    extraAttrsXml: '',
    filtersExtraAttrsXml: '',
    customFilters: [],
    customAnd: undefined,
    customFiltersExtraAttrsXml: '',
    dateGroups: [],
    xml,
  };
}

function parseFilterColumnEntry(child: string): FilterColumnEntry {
  const attrs = parseAttrMap(elementOpenAttrsLocal(child));
  const colIdRaw = attrs.get('colId');
  const colId = parseUnsignedIntRequired(colIdRaw);

  const innerKids = splitTopLevelLocal(elementInnerLocal(child));
  let filtersEl: string | undefined;
  let customEl: string | undefined;
  let hasOpaqueArm = false;
  let unknownSibling = false;
  for (const k of innerKids) {
    const name = elementLocalNameLocal(k);
    if (name === 'filters') {
      filtersEl = k;
    } else if (name === 'customFilters') {
      customEl = k;
    } else if (OPAQUE_FILTER_ARMS.has(name)) {
      hasOpaqueArm = true;
    } else {
      unknownSibling = true;
    }
  }

  if (
    colId === undefined ||
    hasOpaqueArm ||
    unknownSibling ||
    (filtersEl !== undefined && customEl !== undefined) ||
    (filtersEl === undefined && customEl === undefined)
  ) {
    return opaqueColumn(colId, child);
  }

  const hiddenButton = parseXsdBooleanOptional(attrs.get('hiddenButton'));
  const showButton = parseXsdBooleanOptional(attrs.get('showButton'));

  const exclude = new Set(['colId']);
  if (hiddenButton !== undefined || attrs.get('hiddenButton') === undefined) {
    exclude.add('hiddenButton');
  }
  if (showButton !== undefined || attrs.get('showButton') === undefined) {
    exclude.add('showButton');
  }
  const extraAttrsXml = attrsToXmlExcluding(attrs, exclude);

  let blank: boolean | undefined;
  let filtersExtraAttrsXml = '';
  const values: FilterValueEntry[] = [];
  const filtersExtraChildrenXml: string[] = [];
  const dateGroups: DateGroupEntry[] = [];
  if (filtersEl !== undefined) {
    const filtersAttrs = parseAttrMap(elementOpenAttrsLocal(filtersEl));
    blank = parseXsdBooleanOptional(filtersAttrs.get('blank'));
    const filtersExclude = new Set<string>();
    if (blank !== undefined || filtersAttrs.get('blank') === undefined) {
      filtersExclude.add('blank');
    }
    filtersExtraAttrsXml = attrsToXmlExcluding(filtersAttrs, filtersExclude);
    for (const fk of splitTopLevelLocal(elementInnerLocal(filtersEl))) {
      const name = elementLocalNameLocal(fk);
      if (name === 'filter') {
        values.push(parseFilterValueEntry(fk));
      } else if (name === 'dateGroupItem') {
        const parsed = parseDateGroupEntry(fk);
        if (parsed === undefined) {
          return opaqueColumn(colId, child);
        }
        dateGroups.push(parsed);
      } else {
        filtersExtraChildrenXml.push(fk);
      }
    }
  }

  let customFilters: CustomFilterEntry[] = [];
  let customAnd: boolean | undefined;
  let customFiltersExtraAttrsXml = '';
  if (customEl !== undefined) {
    const customAttrs = parseAttrMap(elementOpenAttrsLocal(customEl));
    customAnd = parseXsdBooleanOptional(customAttrs.get('and'));
    const customExclude = new Set<string>();
    if (customAnd !== undefined || customAttrs.get('and') === undefined) {
      customExclude.add('and');
    }
    customFiltersExtraAttrsXml = attrsToXmlExcluding(customAttrs, customExclude);
    const customKids = splitTopLevelLocal(elementInnerLocal(customEl));
    if (customKids.length < 1 || customKids.length > 2) {
      return opaqueColumn(colId, child);
    }
    for (const ck of customKids) {
      if (elementLocalNameLocal(ck) !== 'customFilter') {
        return opaqueColumn(colId, child);
      }
      customFilters.push(parseCustomFilterEntry(ck));
    }
  }

  return {
    modeled: true,
    colId,
    hiddenButton,
    showButton,
    blank,
    values,
    filtersExtraChildrenXml,
    extraAttrsXml,
    filtersExtraAttrsXml,
    customFilters,
    customAnd,
    customFiltersExtraAttrsXml,
    dateGroups,
    xml: undefined,
  };
}

function parseCustomFilterEntry(el: string): CustomFilterEntry {
  const attrs = parseAttrMap(elementOpenAttrsLocal(el));
  const operator = attrs.get('operator');
  const val = attrs.get('val');
  const extraAttrsXml = attrsToXmlExcluding(attrs, new Set(['operator', 'val']));
  return { operator, val, extraAttrsXml };
}

function parseDateGroupEntry(el: string): DateGroupEntry | undefined {
  const attrs = parseAttrMap(elementOpenAttrsLocal(el));
  const year = parseUnsignedIntRequired(attrs.get('year'));
  const grouping = attrs.get('dateTimeGrouping');
  if (year === undefined || grouping === undefined || !isDateTimeGrouping(grouping)) {
    return undefined;
  }
  const month = parseUnsignedIntRequired(attrs.get('month'));
  const day = parseUnsignedIntRequired(attrs.get('day'));
  const hour = parseUnsignedIntRequired(attrs.get('hour'));
  const minute = parseUnsignedIntRequired(attrs.get('minute'));
  const second = parseUnsignedIntRequired(attrs.get('second'));
  if (attrs.get('month') !== undefined && month === undefined) {
    return undefined;
  }
  if (attrs.get('day') !== undefined && day === undefined) {
    return undefined;
  }
  if (attrs.get('hour') !== undefined && hour === undefined) {
    return undefined;
  }
  if (attrs.get('minute') !== undefined && minute === undefined) {
    return undefined;
  }
  if (attrs.get('second') !== undefined && second === undefined) {
    return undefined;
  }
  const extraAttrsXml = attrsToXmlExcluding(
    attrs,
    new Set(['year', 'month', 'day', 'hour', 'minute', 'second', 'dateTimeGrouping']),
  );
  return {
    year,
    month,
    day,
    dateTimeGrouping: grouping,
    hour,
    minute,
    second,
    extraAttrsXml,
  };
}

function isDateTimeGrouping(value: string): boolean {
  return (
    value === 'year' ||
    value === 'month' ||
    value === 'day' ||
    value === 'hour' ||
    value === 'minute' ||
    value === 'second'
  );
}

function parseFilterValueEntry(filterEl: string): FilterValueEntry {
  const attrs = parseAttrMap(elementOpenAttrsLocal(filterEl));
  const valRaw = attrs.get('val');
  const val = valRaw !== undefined ? valRaw : '';
  const extraAttrsXml = attrsToXmlExcluding(attrs, new Set(['val']));
  return { val, extraAttrsXml };
}

function parseUnsignedIntRequired(raw: string | undefined): number | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const t = raw.trim();
  if (t.length === 0 || !/^\d+$/.test(t)) {
    return undefined;
  }
  const n = Number(t);
  if (!Number.isInteger(n) || n < 0) {
    return undefined;
  }
  return n;
}

/**
 * Serialize an AutoFilter model, or `undefined` when absent and no backup.
 * @private
 */
export function serializeAutoFilterXml(model: AutoFilterModel): string | undefined {
  if (!model.present) {
    if (model.xml !== undefined) {
      return model.xml;
    }
    return undefined;
  }
  if (model.range === undefined) {
    return (model.xml != null ? model.xml : undefined);
  }
  const attrs: string[] = [];
  attrs.push(`ref="${escapeXml(formatA1Range(model.range))}"`);
  if (model.extraAttrsXml.trim().length > 0) {
    attrs.push(model.extraAttrsXml.trim());
  }

  const columnXml = model.columns.map((c) => serializeFilterColumn(c));
  // Schema order: filterColumn* → sortState? → extLst?/unknown extras.
  const nestedSortXml =
    model.sortState !== undefined ? serializeSortStateXml(model.sortState) : undefined;
  const inner = [
    ...columnXml,
    ...(nestedSortXml !== undefined ? [nestedSortXml] : []),
    ...model.extraChildrenXml,
  ];
  if (inner.length === 0) {
    return `<autoFilter ${attrs.join(' ')}/>`;
  }
  const parts: string[] = [`<autoFilter ${attrs.join(' ')}>`];
  parts.push(...inner);
  parts.push('</autoFilter>');
  return parts.join('');
}

function serializeFilterColumn(e: FilterColumnEntry): string {
  if (!e.modeled) {
    return (e.xml != null ? e.xml : '');
  }
  const attrs: string[] = [];
  attrs.push(`colId="${e.colId}"`);
  // hiddenButton default false: emit "1" when true; emit "0" when explicit false.
  if (e.hiddenButton === true) {
    attrs.push('hiddenButton="1"');
  } else if (e.hiddenButton === false) {
    attrs.push('hiddenButton="0"');
  }
  // showButton default true: emit "0" when false; emit "1" when explicit true.
  if (e.showButton === false) {
    attrs.push('showButton="0"');
  } else if (e.showButton === true) {
    attrs.push('showButton="1"');
  }
  if (e.extraAttrsXml.trim().length > 0) {
    attrs.push(e.extraAttrsXml.trim());
  }

  const filtersAttrs: string[] = [];
  if (e.blank === true) {
    filtersAttrs.push('blank="1"');
  } else if (e.blank === false) {
    filtersAttrs.push('blank="0"');
  }
  if (e.filtersExtraAttrsXml.trim().length > 0) {
    filtersAttrs.push(e.filtersExtraAttrsXml.trim());
  }

  const filterEls = e.values.map((v) => {
    const vAttrs = [`val="${escapeXml(v.val)}"`];
    if (v.extraAttrsXml.trim().length > 0) {
      vAttrs.push(v.extraAttrsXml.trim());
    }
    return `<filter ${vAttrs.join(' ')}/>`;
  });
  const dateGroupEls = e.dateGroups.map(serializeDateGroup);
  const filtersInner = [...filterEls, ...dateGroupEls, ...e.filtersExtraChildrenXml];
  const filtersOpen =
    filtersAttrs.length > 0 ? `<filters ${filtersAttrs.join(' ')}>` : '<filters>';
  let filtersXml: string;
  if (filtersInner.length === 0) {
    filtersXml =
      filtersAttrs.length > 0 ? `<filters ${filtersAttrs.join(' ')}/>` : '<filters/>';
  } else {
    filtersXml = `${filtersOpen}${filtersInner.join('')}</filters>`;
  }

  const hasFilters =
    e.values.length > 0 ||
    e.dateGroups.length > 0 ||
    e.filtersExtraChildrenXml.length > 0 ||
    e.blank !== undefined ||
    e.filtersExtraAttrsXml.trim().length > 0;
  const customXml = serializeCustomFilters(e);
  const arms = `${hasFilters ? filtersXml : ''}${customXml}`;
  return `<filterColumn ${attrs.join(' ')}>${arms}</filterColumn>`;
}

function serializeCustomFilters(e: FilterColumnEntry): string {
  if (
    e.customFilters.length === 0 &&
    e.customAnd === undefined &&
    e.customFiltersExtraAttrsXml.trim().length === 0
  ) {
    return '';
  }
  const parts: string[] = [];
  if (e.customAnd === true) {
    parts.push('and="1"');
  } else if (e.customAnd === false) {
    parts.push('and="0"');
  }
  if (e.customFiltersExtraAttrsXml.trim().length > 0) {
    parts.push(e.customFiltersExtraAttrsXml.trim());
  }
  const inner = e.customFilters.map(serializeCustomFilter).join('');
  const open = parts.length > 0 ? `<customFilters ${parts.join(' ')}>` : '<customFilters>';
  return inner.length === 0 ? open.replace(/>$/, '/>') : `${open}${inner}</customFilters>`;
}

function serializeCustomFilter(c: CustomFilterEntry): string {
  const parts: string[] = [];
  if (c.operator !== undefined && c.operator.length > 0 && c.operator !== 'equal') {
    parts.push(`operator="${escapeXml(c.operator)}"`);
  }
  if (c.val !== undefined) {
    parts.push(`val="${escapeXml(c.val)}"`);
  }
  if (c.extraAttrsXml.trim().length > 0) {
    parts.push(c.extraAttrsXml.trim());
  }
  return parts.length === 0 ? '<customFilter/>' : `<customFilter ${parts.join(' ')}/>`;
}

function serializeDateGroup(g: DateGroupEntry): string {
  const parts = [`year="${g.year}"`];
  if (g.month !== undefined) {
    parts.push(`month="${g.month}"`);
  }
  if (g.day !== undefined) {
    parts.push(`day="${g.day}"`);
  }
  if (g.hour !== undefined) {
    parts.push(`hour="${g.hour}"`);
  }
  if (g.minute !== undefined) {
    parts.push(`minute="${g.minute}"`);
  }
  if (g.second !== undefined) {
    parts.push(`second="${g.second}"`);
  }
  parts.push(`dateTimeGrouping="${escapeXml(g.dateTimeGrouping)}"`);
  if (g.extraAttrsXml.trim().length > 0) {
    parts.push(g.extraAttrsXml.trim());
  }
  return `<dateGroupItem ${parts.join(' ')}/>`;
}

function cloneModel(m: AutoFilterModel): AutoFilterModel {
  return {
    present: m.present,
    range: m.range === undefined ? undefined : { ...m.range },
    columns: m.columns.map(cloneColumn),
    sortState: m.sortState === undefined ? undefined : cloneSortStateModel(m.sortState),
    extraChildrenXml: [...m.extraChildrenXml],
    extraAttrsXml: m.extraAttrsXml,
    xml: m.xml,
  };
}

/** Deep-clone nested sort-state so fields stay in lockstep with SortStateImpl. */
function cloneSortStateModel(m: SortStateModel): SortStateModel {
  const tmp = new SortStateImpl(m);
  return tmp.toModel();
}

function cloneColumn(e: FilterColumnEntry): FilterColumnEntry {
  return {
    modeled: e.modeled,
    colId: e.colId,
    hiddenButton: e.hiddenButton,
    showButton: e.showButton,
    blank: e.blank,
    values: e.values.map((v) => ({ val: v.val, extraAttrsXml: v.extraAttrsXml })),
    filtersExtraChildrenXml: [...e.filtersExtraChildrenXml],
    extraAttrsXml: e.extraAttrsXml,
    filtersExtraAttrsXml: e.filtersExtraAttrsXml,
    customFilters: e.customFilters.map((c) => ({
      operator: c.operator,
      val: c.val,
      extraAttrsXml: c.extraAttrsXml,
    })),
    customAnd: e.customAnd,
    customFiltersExtraAttrsXml: e.customFiltersExtraAttrsXml,
    dateGroups: e.dateGroups.map((g) => ({ ...g })),
    xml: e.xml,
  };
}

/**
 * Parsing-coercible xsd:boolean lexical forms used by Office
 * (`"1"`/`"0"`/`"true"`/`"false"`). Invalid/absent → `undefined`.
 */
function parseXsdBooleanOptional(raw: string | undefined): boolean | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const v = raw.trim().toLowerCase();
  if (v === '1' || v === 'true') {
    return true;
  }
  if (v === '0' || v === 'false') {
    return false;
  }
  return undefined;
}

/* ── AutoFilter live root handle ── */

/**
 * Generation-bound public {@link AutoFilter} handle. The worksheet keeps one
 * {@link AutoFilterImpl}; replace / clear / reload bump generation so prior
 * root handles throw {@link InvalidAutoFilterError}.
 * @private
 */
export class AutoFilterHandle implements AutoFilter {
  public constructor(
    private readonly owner: AutoFilterImpl,
    private readonly bornGeneration: number,
  ) {}

  /**
   * @private
   */
  public isLiveFor(ownerGeneration: number): boolean {
    return this.bornGeneration === ownerGeneration && this.owner.isPresent;
  }

  public get range(): string {
    this.assertLive();
    return this.owner.range;
  }

  public get count(): number {
    this.assertLive();
    return this.owner.count;
  }

  public list(): ReadonlyArray<FilterColumn> {
    this.assertLive();
    return this.owner.list();
  }

  public addFilterColumn(columnIndex: number): FilterColumn {
    this.assertLive();
    return this.owner.addFilterColumn(columnIndex);
  }

  public get(index: number): FilterColumn {
    this.assertLive();
    return this.owner.get(index);
  }

  public getByColumnIndex(columnIndex: number): FilterColumn | undefined {
    this.assertLive();
    return this.owner.getByColumnIndex(columnIndex);
  }

  public removeFilterColumn(column: FilterColumn): void {
    this.assertLive();
    this.owner.removeFilterColumn(column);
  }

  public removeFilterColumnAt(index: number): void {
    this.assertLive();
    this.owner.removeFilterColumnAt(index);
  }

  public get dataSorter(): DataSorter | undefined {
    this.assertLive();
    return this.owner.getNestedDataSorter();
  }

  public addDataSorter(range: string): DataSorter {
    this.assertLive();
    return this.owner.addNestedDataSorter(range);
  }

  public removeDataSorter(): void {
    this.assertLive();
    this.owner.removeNestedDataSorter();
  }

  public clearFilterColumns(): void {
    this.assertLive();
    this.owner.clearFilterColumns();
  }

  private assertLive(): void {
    if (!this.isLiveFor(this.owner.currentGeneration())) {
      throw new InvalidAutoFilterError('AutoFilter handle is no longer attached');
    }
  }
}

/* ── FilterColumn live handle ── */

/**
 * Live handle bound to one modeled filter column.
 * @private
 */
export class FilterColumnHandle implements FilterColumn {
  private live = true;

  public constructor(
    private readonly owner: AutoFilterImpl,
    private readonly colId: number,
    private readonly bornGeneration: number,
  ) {}

  public get columnIndex(): number {
    this.assertLive();
    return this.colId;
  }

  public get isButtonVisible(): boolean {
    this.assertLive();
    const e = this.owner.readColumn(this.colId);
    // Default true when absent.
    return e.showButton !== false;
  }

  public set isButtonVisible(value: boolean) {
    this.assertLive();
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError('isButtonVisible must be a boolean');
    }
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      // default true: store undefined when true (omit), false when false.
      showButton: value ? undefined : false,
    }));
  }

  public get isButtonHidden(): boolean {
    this.assertLive();
    const e = this.owner.readColumn(this.colId);
    return e.hiddenButton === true;
  }

  public set isButtonHidden(value: boolean) {
    this.assertLive();
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError('isButtonHidden must be a boolean');
    }
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      // default false: store true when true, undefined when false (omit).
      hiddenButton: value ? true : undefined,
    }));
  }

  public get isBlank(): boolean {
    this.assertLive();
    const e = this.owner.readColumn(this.colId);
    return e.blank === true;
  }

  public set isBlank(value: boolean) {
    this.assertLive();
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError('isBlank must be a boolean');
    }
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      blank: value ? true : undefined,
    }));
  }

  public get count(): number {
    this.assertLive();
    return this.owner.readColumn(this.colId).values.length;
  }

  public values(): ReadonlyArray<string> {
    this.assertLive();
    return this.owner.readColumn(this.colId).values.map((v) => v.val);
  }

  public addValue(value: string): void {
    this.assertLive();
    if (typeof value !== 'string') {
      throw new InvalidArgumentError('Filter value must be a string');
    }
    this.owner.writeColumnMutation(this.colId, (e) => {
      if (e.values.some((v) => v.val === value)) {
        return e;
      }
      return {
        ...e,
        values: [...e.values, { val: value, extraAttrsXml: '' }],
      };
    });
  }

  public addValues(values: ReadonlyArray<string>): void {
    this.assertLive();
    if (values === null || values === undefined || typeof (values as { length?: unknown }).length !== 'number') {
      throw new InvalidArgumentError('Filter values must be an array of strings');
    }
    const incoming: string[] = [];
    for (const v of values) {
      if (typeof v !== 'string') {
        throw new InvalidArgumentError('Filter values must be strings');
      }
      incoming.push(v);
    }
    this.owner.writeColumnMutation(this.colId, (e) => {
      const next: FilterValueEntry[] = e.values.map((existing) => ({
        val: existing.val,
        extraAttrsXml: existing.extraAttrsXml,
      }));
      for (const value of incoming) {
        if (!next.some((x) => x.val === value)) {
          next.push({ val: value, extraAttrsXml: '' });
        }
      }
      return { ...e, values: next };
    });
  }

  public removeValue(value: string): void {
    this.assertLive();
    if (typeof value !== 'string') {
      throw new InvalidArgumentError('Filter value must be a string');
    }
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      values: e.values.filter((v) => v.val !== value),
    }));
  }

  public removeValueAt(index: number): void {
    this.assertLive();
    const e = this.owner.readColumn(this.colId);
    assertValueIndex(index, e.values.length);
    this.owner.writeColumnMutation(this.colId, (cur) => ({
      ...cur,
      values: cur.values.filter((_, i) => i !== index),
    }));
  }

  public clearValues(): void {
    this.assertLive();
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      values: [],
    }));
  }

  public get type(): FilterType {
    this.assertLive();
    return columnType(this.owner.readColumn(this.colId));
  }

  public get dataType(): FilterDataType {
    this.assertLive();
    return classifyColumnValues(this.owner.columnValues(this.colId));
  }

  public get firstCondition(): FilterCondition | undefined {
    this.assertLive();
    const entry = this.owner.readColumn(this.colId).customFilters[0];
    return entry === undefined ? undefined : toPublicCondition(entry);
  }

  public get secondCondition(): FilterCondition | undefined {
    this.assertLive();
    const entry = this.owner.readColumn(this.colId).customFilters[1];
    return entry === undefined ? undefined : toPublicCondition(entry);
  }

  public get isAnd(): boolean {
    this.assertLive();
    return this.owner.readColumn(this.colId).customAnd === true;
  }

  public set isAnd(value: boolean) {
    this.assertLive();
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError('isAnd must be a boolean');
    }
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      customAnd: value ? true : undefined,
    }));
  }

  public addCondition(operator: FilterOperator, value?: string): void {
    this.assertLive();
    if (!isFilterOperator(operator)) {
      throw new InvalidArgumentError(`Unknown filter operator "${String(operator)}"`);
    }
    if (value !== undefined && typeof value !== 'string') {
      throw new InvalidArgumentError('Filter condition value must be a string');
    }
    const stored = toStoredCondition(operator, value);
    this.owner.writeColumnMutation(this.colId, (e) => {
      if (e.customFilters.length >= 2) {
        throw new InvalidArgumentError('A filter column accepts at most two conditions');
      }
      return { ...e, customFilters: [...e.customFilters, stored] };
    });
  }

  public clearConditions(): void {
    this.assertLive();
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      customFilters: [],
      customAnd: undefined,
    }));
  }

  public get dateGroupCount(): number {
    this.assertLive();
    return this.dateGroups().length;
  }

  public dateGroups(): ReadonlyArray<DateGroup> {
    this.assertLive();
    const groups: DateGroup[] = [];
    for (const entry of this.owner.readColumn(this.colId).dateGroups) {
      const group = toPublicDateGroup(entry);
      if (group !== undefined) {
        groups.push(group);
      }
    }
    return groups;
  }

  public addDateGroup(group: DateGroup): void {
    this.assertLive();
    const stored = toStoredDateGroup(group);
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      dateGroups: [...e.dateGroups, stored],
    }));
  }

  public removeDateGroupAt(index: number): void {
    this.assertLive();
    const length = this.owner.readColumn(this.colId).dateGroups.length;
    assertValueIndex(index, length);
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      dateGroups: e.dateGroups.filter((_, i) => i !== index),
    }));
  }

  public clearDateGroups(): void {
    this.assertLive();
    this.owner.writeColumnMutation(this.colId, (e) => ({
      ...e,
      dateGroups: [],
    }));
  }

  /**
   * @private
   */
  public isLive(ownerGeneration: number): boolean {
    return this.live && this.bornGeneration === ownerGeneration;
  }

  /**
   * @private
   */
  public kill(): void {
    this.live = false;
  }

  private assertLive(): void {
    if (!this.live || !this.isLive(this.owner.currentGeneration())) {
      throw new InvalidAutoFilterError('Filter column handle is no longer attached');
    }
  }
}

/* ── minimal local XML helpers (mirror sort-state) ── */

function elementLocalNameLocal(el: string): string {
  const m = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
  return m !== null && m[2] !== undefined ? m[2] : '';
}

function elementOpenAttrsLocal(el: string): string {
  const trimmed = el.trim();
  const gt = trimmed.indexOf('>');
  if (gt < 0) {
    return '';
  }
  const open = trimmed.slice(0, gt);
  const m = /^<[A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?([\s\S]*)$/.exec(open);
  return m !== null && m[1] !== undefined ? m[1].trim() : '';
}

function elementInnerLocal(el: string): string {
  const trimmed = el.trim();
  const firstGt = trimmed.indexOf('>');
  if (firstGt < 0) {
    return '';
  }
  if (trimmed[firstGt - 1] === '/') {
    return '';
  }
  const close = trimmed.lastIndexOf('</');
  if (close < 0 || close <= firstGt) {
    return '';
  }
  return trimmed.slice(firstGt + 1, close);
}

function splitTopLevelLocal(s: string): string[] {
  const out: string[] = [];
  let i = 0;
  const str = s;
  while (i < str.length) {
    while (i < str.length && /\s/.test((str[i] != null ? str[i] : ''))) {
      i += 1;
    }
    if (i >= str.length) {
      break;
    }
    if (str[i] !== '<') {
      break;
    }
    const start = i;
    let depth = 0;
    let j = i;
    while (j < str.length) {
      if (str[j] === '<') {
        if (str.startsWith('<!--', j)) {
          const end = str.indexOf('-->', j + 4);
          j = end < 0 ? str.length : end + 3;
          continue;
        }
        if (str.startsWith('<![CDATA[', j)) {
          const end = str.indexOf(']]>', j + 9);
          j = end < 0 ? str.length : end + 3;
          continue;
        }
        const next = str[j + 1];
        if (next === '/') {
          depth -= 1;
          const gt = str.indexOf('>', j);
          j = gt < 0 ? str.length : gt + 1;
          if (depth === 0) {
            break;
          }
          continue;
        }
        const gt = str.indexOf('>', j);
        if (gt < 0) {
          j = str.length;
          break;
        }
        const selfClose = str[gt - 1] === '/';
        if (!selfClose) {
          depth += 1;
        }
        j = gt + 1;
        if (selfClose && depth === 0) {
          break;
        }
        continue;
      }
      j += 1;
    }
    out.push(str.slice(start, j));
    i = j;
  }
  return out;
}
