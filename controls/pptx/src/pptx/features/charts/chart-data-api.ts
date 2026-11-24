/**
 * Convenience convenience surface for {@link Chart} (additive; no new XML or workbook logic).
 *
 * @remarks
 * Every member here is a thin adapter over the existing dual-write path:
 * cells go through the edit-session sheet, formulas through `HostChartSeries`
 * (`title` / `categoryLabels` / `values` / `serieType`), and every mutation is
 * flushed with `flushDualWrite` exactly like `setSeriesValueCells` /
 * `replaceSeriesFormulas`. Row and column indices are **1-based** (
 * worksheet convention): `setValue(2, 3, x)` writes cell `C2`.
 *
 * @packageDocumentation
 */
import { arrayAt } from '../../core/util/es5-compat';
import { ChartEditSession, colRowToA1, parseSimpleA1Range } from './chart-data-edit';
import { ChartsError } from './errors';
import { isClassicChartType } from './classic-chart-types';
import { OfficeChartType } from './office-chart-type';
import { getXlsxChartHostApi, HostChart, ChartAxisFormat, HostChartSeries } from './xlsx-chart-api';
import { getXlsxRootRequired } from './xlsx-surface';
import { ChartCellValue } from './chart-cell-sheet';

/**
 * Session access the adapters need from {@link Chart}.
 *
 * @internal
 */
export interface ChartDataHost {
    /** Runs `mutate` on the live edit session, then dual-write flushes. */
    runInSession<T>(mutate: (session: ChartEditSession) => T): T;
    /** Runs `read` on the live edit session without flushing. */
    readSession<T>(read: (session: ChartEditSession) => T): T;
}

/**
 * Lightweight rectangular worksheet range (1-based rows and columns).
 *
 * @remarks Rectangular range over the chart worksheet. {@link ChartRange.formula} is the
 * `Sheet!$A$1:$B$2` form used by existing series formulas.
 *
 * @public
 */
export class ChartRange {
    /**
     * @param {number} startRow - First row (1-based).
     * @param {number} startColumn - First column (1-based).
     * @param {number} endRow - Last row (1-based).
     * @param {number} endColumn - Last column (1-based).
     * @param {string} sheetName - Worksheet tab name.
     */
    constructor(readonly startRow: number, readonly startColumn: number, readonly endRow: number, readonly endColumn: number,
                readonly sheetName: string) {
    }
    /**
     * A1 address without sheet or `$`, e.g. `B2:B4`.
     *
     * @returns {string} The address.
     */
    get address(): string {
        const a: string = colRowToA1(this.startColumn - 1, this.startRow);
        const b: string = colRowToA1(this.endColumn - 1, this.endRow);
        return a === b ? a : `${a}:${b}`;
    }
    /**
     * Absolute chart formula, e.g. `Sheet1!$B$2:$B$4`.
     *
     * @returns {string} The formula.
     */
    get formula(): string {
        const cell: (r: number, c: number) => string = (r: number, c: number): string => {
            const m: RegExpExecArray = /^([A-Z]+)([0-9]+)$/.exec(colRowToA1(c - 1, r));
            return `$${m[1]}$${m[2]}`;
        };
        const needsQuotes: boolean = /[^A-Za-z0-9_]/.test(this.sheetName);
        const sheet: string = needsQuotes ? `'${this.sheetName.replace(/'/g, '\'\'')}'` : this.sheetName;
        return `${sheet}!${cell(this.startRow, this.startColumn)}:${cell(this.endRow, this.endColumn)}`;
    }
    /**
     * Builds a range from a simple A1 formula; `undefined` when unmappable.
     *
     * @internal
     * @param {string | undefined} formula - Series formula.
     * @param {string} fallbackSheet - Sheet used when the formula is unqualified.
     * @returns {ChartRange | undefined} The range.
     */
    static fromFormula(formula: string | undefined, fallbackSheet: string): ChartRange | undefined {
        if (formula === undefined) {
            return undefined;
        }
        const r: ReturnType<typeof parseSimpleA1Range> = parseSimpleA1Range(formula);
        if (r === undefined) {
            return undefined;
        }
        const bang: number = formula.lastIndexOf('!');
        const sheet: string = bang > 0 ? formula.slice(0, bang).replace(/^'|'$/g, '').replace(/''/g, '\'') : fallbackSheet;
        return new ChartRange(r.row0, r.col0 + 1, r.row1, r.col1 + 1, sheet);
    }
}

/**
 * The active data range of a chart (`chart.dataRange`), as returned by `chart.chartData.getRange(...)`.
 *
 * @remarks Immutable, 1-based and inclusive. It is a {@link ChartRange}, so it is also accepted wherever a series
 * `values` / `categoryLabels` range is expected. The `first*` / `last*` members mirror `startRow`, `startColumn`,
 * `endRow` and `endColumn`.
 *
 * @public
 */
export class ChartDataRange extends ChartRange {
    /**
     * First row of the range (1-based).
     *
     * @returns {number} The row.
     */
    get firstRow(): number {
        return this.startRow;
    }
    /**
     * Last row of the range (1-based, inclusive).
     *
     * @returns {number} The row.
     */
    get lastRow(): number {
        return this.endRow;
    }
    /**
     * First column of the range (1-based).
     *
     * @returns {number} The column.
     */
    get firstColumn(): number {
        return this.startColumn;
    }
    /**
     * Last column of the range (1-based, inclusive).
     *
     * @returns {number} The column.
     */
    get lastColumn(): number {
        return this.endColumn;
    }
    /**
     * Builds a data range from a simple A1 formula; `undefined` when unmappable.
     *
     * @internal
     * @param {string | undefined} formula - Chart data range formula.
     * @param {string} fallbackSheet - Sheet used when the formula is unqualified.
     * @returns {ChartDataRange | undefined} The range.
     */
    static fromDataRangeFormula(formula: string | undefined, fallbackSheet: string): ChartDataRange | undefined {
        const r: ChartRange | undefined = ChartRange.fromFormula(formula, fallbackSheet);
        return r === undefined ? undefined : new ChartDataRange(r.startRow, r.startColumn, r.endRow, r.endColumn, r.sheetName);
    }
}

/**
 * Value accepted by series / axis range setters: a {@link ChartRange} or an existing formula string.
 *
 * @public
 */
export type ChartRangeLike = ChartRange | string;

/**
 * @param {ChartRangeLike} value - Range or formula.
 * @returns {string} Formula string.
 */
function toFormula(value: ChartRangeLike): string {
    if (typeof value === 'string') {
        return value;
    }
    if (value instanceof ChartRange) {
        return value.formula;
    }
    throw new ChartsError('Expected a ChartRange (chart.chartData.getRange) or a formula string');
}

/**
 * @param {number} n - Candidate index.
 * @param {string} what - Argument name.
 * @returns {void} Nothing.
 */
function requirePositive(n: number, what: string): void {
    if (!Number.isInteger(n) || n < 1) {
        throw new ChartsError(`${what} must be a positive 1-based integer`);
    }
}

/**
 * Convenience `chart.ChartData`: cell access on the chart's embedded worksheet.
 *
 * @public
 */
export class ChartData {
    /** @internal */
    constructor(private readonly host: ChartDataHost) {
    }
    /**
     * Writes a value to a cell (1-based row/column) and dual-write flushes.
     *
     * @param {number} rowIndex - Row (1-based).
     * @param {number} columnIndex - Column (1-based).
     * @param {string | number | boolean | Date} value - Cell value.
     * @returns {void} Nothing.
     */
    setValue(rowIndex: number, columnIndex: number, value: string | number | boolean | Date): void {
        requirePositive(rowIndex, 'rowIndex');
        requirePositive(columnIndex, 'columnIndex');
        this.host.runInSession((s: ChartEditSession): void => {
            s.sheet.getCell(colRowToA1(columnIndex - 1, rowIndex)).value = value;
        });
    }
    /**
     * Reads a cell value (1-based row/column); `undefined` when empty.
     *
     * @param {number} rowIndex - Row (1-based).
     * @param {number} columnIndex - Column (1-based).
     * @returns {ChartCellValue} Cell value.
     */
    getValue(rowIndex: number, columnIndex: number): ChartCellValue {
        requirePositive(rowIndex, 'rowIndex');
        requirePositive(columnIndex, 'columnIndex');
        return this.host.readSession((s: ChartEditSession): ChartCellValue =>
            s.sheet.getCell(colRowToA1(columnIndex - 1, rowIndex)).value);
    }
    /**
     * Creates a range (1-based, inclusive) for series values / category labels.
     *
     * @param {number} startRow - First row.
     * @param {number} startColumn - First column.
     * @param {number} endRow - Last row.
     * @param {number} endColumn - Last column.
     * @remarks The result is a {@link ChartDataRange}; assign it to `chart.dataRange` to make it the active data range.
     * @returns {ChartDataRange} The range.
     */
    getRange(startRow: number, startColumn: number, endRow: number, endColumn: number): ChartDataRange {
        requirePositive(startRow, 'startRow');
        requirePositive(startColumn, 'startColumn');
        requirePositive(endRow, 'endRow');
        requirePositive(endColumn, 'endColumn');
        if (endRow < startRow || endColumn < startColumn) {
            throw new ChartsError('Range end must not precede range start');
        }
        const sheet: string = this.host.readSession((s: ChartEditSession): string => s.sheet.name);
        return new ChartDataRange(startRow, startColumn, endRow, endColumn, sheet);
    }
}

/**
 * Engine chart type for an {@link OfficeChartType} member.
 *
 * @param {OfficeChartType} type - Public chart type.
 * @returns {string} Engine value.
 */
function engineTypeOf(type: OfficeChartType): string {
    if (typeof type !== 'string' || !isClassicChartType(type)) {
        throw new ChartsError(`Unsupported chart type "${String(type)}"`);
    }
    const engine: string = getXlsxChartHostApi(getXlsxRootRequired()).chartTypeByKey.get(type);
    if (engine === undefined || engine.length === 0) {
        throw new ChartsError(`ej2-xlsx ChartType has no engine value for key "${type}"`);
    }
    return engine;
}

/**
 * @param {string} engine - Engine chart type.
 * @returns {OfficeChartType | string} Public key, or the engine token when unmapped.
 */
function keyOfEngineType(engine: string): OfficeChartType | string {
    const map: ReadonlyMap<string, string> = getXlsxChartHostApi(getXlsxRootRequired()).chartTypeByKey;
    let found: string;
    map.forEach((value: string, key: string): void => {
        if (found === undefined && value === engine) {
            found = key;
        }
    });
    return found === undefined ? engine : found;
}

/**
 * Chart-level type read/write over the engine token (`HostChart.type`).
 *
 * @internal
 */
export const chartTypeAccess: {
    toEngine(type: OfficeChartType): string;
    toKey(engine: string): OfficeChartType | string;
} = { toEngine: engineTypeOf, toKey: keyOfEngineType };

/**
 * One series of a chart.
 *
 * @public
 */
export class ChartSeries {
    /** @internal */
    detached: boolean = false;
    /** @internal */
    constructor(private readonly host: ChartDataHost, /** @internal */ public index: number) {
    }
    private hostSeries(s: ChartEditSession): HostChartSeries {
        if (this.detached) {
            throw new ChartsError('Series has been removed from the chart');
        }
        const ser: HostChartSeries = arrayAt(s.hostChart.series, this.index);
        if (ser === undefined) {
            throw new ChartsError(`Chart series index ${String(this.index)} is out of range`);
        }
        return ser;
    }
    /**
     * Series name (literal title, or the referenced cell's text when the title is a cell formula).
     *
     * @returns {string | undefined} The name.
     */
    get name(): string | undefined {
        return this.host.readSession((s: ChartEditSession): string | undefined => seriesName(s, this.hostSeries(s)));
    }
    set name(value: string | undefined) {
        this.host.runInSession((s: ChartEditSession): void => {
            this.hostSeries(s).title = value;
        });
    }
    /**
     * Values range; assign `chart.chartData.getRange(...)`. Reads back as a {@link ChartRange} (or the raw formula when
     * it is not a simple A1 range).
     *
     * @returns {ChartRangeLike | undefined} The range.
     */
    get values(): ChartRangeLike | undefined {
        return this.host.readSession((s: ChartEditSession): ChartRangeLike | undefined => {
            const f: string = this.hostSeries(s).values;
            return ChartRange.fromFormula(f, s.sheet.name) || f;
        });
    }
    set values(value: ChartRangeLike | undefined) {
        const formula: string = toFormula(value);
        this.host.runInSession((s: ChartEditSession): void => {
            this.hostSeries(s).values = formula;
        });
    }
    /**
     * Per-series chart type (combination charts); `undefined` follows the chart type.
     *
     * @returns {OfficeChartType | string | undefined} The type.
     */
    get chartType(): OfficeChartType | string | undefined {
        return this.host.readSession((s: ChartEditSession): OfficeChartType | string | undefined => {
            const t: string = this.hostSeries(s).serieType;
            return t === undefined ? undefined : keyOfEngineType(t);
        });
    }
    set chartType(value: OfficeChartType | string | undefined) {
        const engine: string = value === undefined ? undefined : engineTypeOf(value as OfficeChartType);
        this.host.runInSession((s: ChartEditSession): void => {
            this.hostSeries(s).serieType = engine;
        });
    }
    /**
     * Per-series chart type; same property as {@link ChartSeries.chartType}.
     *
     * @remarks Builds a combination chart. Only 2-D column, line and area types are valid per series (the engine throws
     * otherwise, e.g. for `BarClustered`, which cannot be combined with column charts); it takes effect once the chart has
     * more than one series.
     *
     * @returns {OfficeChartType | string | undefined} The type.
     */
    get seriesType(): OfficeChartType | string | undefined {
        return this.chartType;
    }
    set seriesType(value: OfficeChartType | string | undefined) {
        this.chartType = value;
    }
}

/**
 * @param {ChartEditSession} s - Session.
 * @param {HostChartSeries} ser - Series.
 * @returns {string | undefined} Display name.
 */
function seriesName(s: ChartEditSession, ser: HostChartSeries): string | undefined {
    const t: string = ser.title;
    if (t === undefined || t.indexOf('!') < 0) {
        return t;
    }
    const r: ReturnType<typeof parseSimpleA1Range> = parseSimpleA1Range(t);
    if (r === undefined) {
        return t;
    }
    const v: ChartCellValue = s.sheet.getCell(colRowToA1(r.col0, r.row0)).value;
    return v === undefined || v === null ? t : String(v);
}

/**
 * Members added to `chart.series` (which remains a `ReadonlyArray<ChartSeriesView>`).
 *
 * @public
 */
export interface ChartSeriesApi {
    /** Number of series. */
    readonly count: number;
    /** Series by zero-based index or name. */
    get(key: number | string): ChartSeries;
    /** Adds a series: `()`, `(type)`, `(name)` or `(name, type)`. */
    add(nameOrType?: string | OfficeChartType, type?: OfficeChartType): ChartSeries;
    /** Removes by zero-based index. */
    removeAt(index: number): void;
    /** Removes by name. */
    remove(name: string): void;
}

/**
 * Charts created from scratch carry a demo series (`B2:B4`). It is a placeholder, replaced when the first series is added
 * through {@link ChartSeriesCollection.add}.
 */
const seedPlaceholders: WeakSet<object> = new WeakSet<object>();
/**
 * Marks the demo series of a freshly created scratch chart as a placeholder.
 *
 * @internal
 * @param {HostChart} hostChart - Scratch host chart.
 * @returns {void} Nothing.
 */
export function markSeedPlaceholder(hostChart: HostChart): void {
    seedPlaceholders.add(hostChart);
}
/**
 * Convenience `chart.Series` collection. Also an array of {@link ChartSeriesView}-compatible items on `Chart.series`.
 *
 * @public
 */
export class ChartSeriesCollection implements ChartSeriesApi {
    private cache: ChartSeries[] = [];
    /**
     * Adds the collection members onto an array (non-enumerable; existing array behaviour is unchanged).
     *
     * @internal
     * @param {ReadonlyArray<T>} target - Array view of the series.
     * @returns {ReadonlyArray<T> & ChartSeriesApi} The same array.
     */
    decorate<T>(target: ReadonlyArray<T>): ReadonlyArray<T> & ChartSeriesApi {
        const self: ChartSeriesCollection = this;
        const define: (k: string, v: object) => void = (k: string, v: object): void => {
            Object.defineProperty(target, k, Object.assign({ configurable: true, enumerable: false }, v));
        };
        define('count', { get: (): number => self.count });
        define('get', { value: (k: number | string): ChartSeries => self.get(k) });
        define('add', { value: (a?: string | OfficeChartType, t?: OfficeChartType): ChartSeries => self.add(a, t) });
        define('removeAt', { value: (i: number): void => self.removeAt(i) });
        define('remove', { value: (n: string): void => self.remove(n) });
        return target as ReadonlyArray<T> & ChartSeriesApi;
    }
    /** @internal */
    constructor(private readonly host: ChartDataHost) {
    }
    private list<T>(read: (hostSeries: ReadonlyArray<HostChartSeries>, s: ChartEditSession) => T): T {
        return this.host.readSession((s: ChartEditSession): T => read(s.hostChart.series, s));
    }
    private sync(length: number): void {
        while (this.cache.length > length) {
            this.cache.pop().detached = true;
        }
        while (this.cache.length < length) {
            this.cache.push(new ChartSeries(this.host, this.cache.length));
        }
    }
    /**
     * Number of series (always current).
     *
     * @returns {number} Count.
     */
    get count(): number {
        return this.list((l: ReadonlyArray<HostChartSeries>): number => l.length);
    }
    /**
     * Series by zero-based index or by name.
     *
     * @param {number | string} key - Index or series name.
     * @returns {ChartSeries} The series.
     */
    get(key: number | string): ChartSeries {
        const index: number = this.resolve(key);
        return arrayAt(this.cache, index);
    }
    /**
     * Adds a series. Overloads: `()`, `(type)`, `(name)`, `(name, type)`.
     *
     * @remarks The new series is bound to the next free worksheet column over the same rows (and categories) as the
     * first series; assign `values` to retarget it.
     * @param {string | OfficeChartType} [nameOrType] - Series name, or chart type when it is an {@link OfficeChartType}.
     * @param {OfficeChartType} [type] - Series chart type.
     * @returns {ChartSeries} The new series.
     */
    add(nameOrType?: string | OfficeChartType, type?: OfficeChartType): ChartSeries {
        let name: string;
        let kind: OfficeChartType = type;
        if (type === undefined && typeof nameOrType === 'string' && isOfficeChartType(nameOrType)) {
            kind = nameOrType as OfficeChartType;
        } else if (nameOrType !== undefined) {
            name = nameOrType;
        }
        const engine: string = kind === undefined ? undefined : engineTypeOf(kind);
        const index: number = this.host.runInSession((s: ChartEditSession): number => {
            const existing: ReadonlyArray<HostChartSeries> = s.hostChart.series;
            let col1: number = 1;
            let row0: number = 2;
            let row1: number = 2;
            let cats: string;
            const seedFirst: HostChartSeries | undefined = seedPlaceholders.has(s.hostChart) ? arrayAt(existing, 0) : undefined;
            for (let i: number = 0; i < existing.length; i += 1) {
                const r: ReturnType<typeof parseSimpleA1Range> = parseSimpleA1Range(arrayAt(existing, i).values || '');
                if (r !== undefined) {
                    col1 = Math.max(col1, r.col1 + 1);
                    if (i === 0) {
                        row0 = r.row0;
                        row1 = r.row1;
                        // The demo categories (A2:A4) must not leak into user series; without categoryLabels the axis
                        // shows point numbers until `categoryLabels` is assigned.
                        cats = seedFirst === undefined ? arrayAt(existing, i).categoryLabels : undefined;
                    }
                }
            }
            const range: ChartRange = new ChartRange(row0, col1 + 1, row1, col1 + 1, s.sheet.name);
            const created: HostChartSeries = s.hostChart.addSeries({
                ...(name !== undefined ? { title: name } : {}),
                ...(cats !== undefined ? { categoryLabels: cats } : {}),
                values: range.formula
            });
            if (engine !== undefined) {
                created.serieType = engine;
            }
            if (seedPlaceholders.has(s.hostChart)) {
                seedPlaceholders.delete(s.hostChart);
                const seed: HostChartSeries = arrayAt(existing, 0);
                if (existing.length === 1 && /^(.+!)?\$?B\$?2:\$?B\$?4$/.test(seed.values || '')) {
                    s.hostChart.removeSeries(0);
                    return 0;
                }
            }
            return s.hostChart.series.length - 1;
        });
        this.sync(index + 1);
        return arrayAt(this.cache, index);
    }
    /**
     * Removes the series at a zero-based index.
     *
     * @param {number} index - Zero-based index.
     * @returns {void} Nothing.
     */
    removeAt(index: number): void {
        this.resolve(index);
        this.host.runInSession((s: ChartEditSession): void => {
            s.hostChart.removeSeries(index);
        });
        const gone: ChartSeries = this.cache.splice(index, 1)[0];
        gone.detached = true;
        for (let i: number = index; i < this.cache.length; i += 1) {
            this.cache[i].index = i;
        }
    }
    /**
     * Removes the first series with the given name.
     *
     * @param {string} name - Series name.
     * @returns {void} Nothing.
     */
    remove(name: string): void {
        this.removeAt(this.resolve(name));
    }
    private resolve(key: number | string): number {
        const names: Array<string | undefined> = this.host.readSession((s: ChartEditSession): Array<string | undefined> =>
            s.hostChart.series.map((h: HostChartSeries): string | undefined => seriesName(s, h)));
        this.sync(names.length);
        if (typeof key === 'number') {
            if (!Number.isInteger(key) || key < 0 || key >= names.length) {
                throw new ChartsError(`Chart series index ${String(key)} is out of range`);
            }
            return key;
        }
        const at: number = names.indexOf(key);
        if (at < 0) {
            throw new ChartsError(`Chart series "${String(key)}" was not found`);
        }
        return at;
    }
}

/**
 * @param {string} v - Candidate.
 * @returns {boolean} Whether it names an {@link OfficeChartType} member.
 */
function isOfficeChartType(v: string): boolean {
    return Object.keys(OfficeChartType).some((k: string): boolean => (OfficeChartType as unknown as Record<string, string>)[k] === v);
}

/**
 * Primary category axis with a `categoryLabels` property added.
 *
 * @public
 */
export interface ChartCategoryAxis extends ChartAxisFormat {
    /** Category labels range applied to every series; reads the first series' range. */
    categoryLabels: ChartRangeLike | undefined;
}

/**
 * Attaches `categoryLabels` (non-enumerable) to an axis object.
 *
 * @internal
 * @param {ChartAxisFormat} axis - Axis.
 * @param {ChartDataHost} host - Chart.
 * @returns {ChartCategoryAxis} Same object.
 */
export function attachCategoryLabels(axis: ChartAxisFormat, host: ChartDataHost): ChartCategoryAxis {
    Object.defineProperty(axis, 'categoryLabels', {
        configurable: true,
        enumerable: false,
        get: (): ChartRangeLike | undefined => host.readSession((s: ChartEditSession): ChartRangeLike | undefined => {
            const first: HostChartSeries = arrayAt(s.hostChart.series, 0);
            const f: string = first === undefined ? undefined : first.categoryLabels;
            return ChartRange.fromFormula(f, s.sheet.name) || f;
        }),
        set: (value: ChartRangeLike | undefined): void => {
            const formula: string = toFormula(value);
            host.runInSession((s: ChartEditSession): void => {
                const list: ReadonlyArray<HostChartSeries> = s.hostChart.series;
                for (let i: number = 0; i < list.length; i += 1) {
                    arrayAt(list, i).categoryLabels = formula;
                }
            });
        }
    });
    return axis as ChartCategoryAxis;
}
