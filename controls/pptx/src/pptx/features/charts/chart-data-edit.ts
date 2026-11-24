import { preserveChartGradientExport, ChartGradientPaintOverride } from './chart-gradient-export';
import { ChartFrameFillFormat, ChartFrameLineFormat } from './xlsx-chart-api';
/**
 * Chart dual-write (cache formulas ↔ embedded sheet) + refresh orchestration.
 *
 * @remarks
 * **TASK-1071 / spec 037:**
 * - Mutations update the live ej2-xlsx `Chart` model and corresponding embedding
 *   cells (when formulas map to simple A1 ranges), then flush chart part XML +
 *   embedding bytes via {@link PackagePartAccess.setPart}.
 * - ej2-xlsx `exportChartPart` emits bare `c:f` refs; flush fills
 *   `numCache`/`strCache` from dual-write sheet cells via
 *   {@link enrichChartPartCachesFromSheet} (never fabricates points).
 * - Authoring does **not** call `Workbook.save`. Flush writes a minimal cell
 *   workbook via {@link writeChartEmbeddingXlsx} (no nested `xl/charts`).
 *   {@link sanitizeChartEmbeddingXlsx} remains on load paths only.
 *   PPT rebuilds a session host chart from chartSpace series formulas + the
 *   chart-local cell sheet on each edit/refresh.
 * - `refresh()` re-opens the embedding under nested package limits, rebuilds the
 *   host chart from current formulas / sheet values, and rewrites the chart part.
 *   It does **not** run full Excel calculation, trendlines, OLE, or network fetch.
 * - External-only / missing embedding → typed {@link Error}.
 *
 * Citations: ADR `docs/adr/2026-09-18-chart-edit.md`; req/spec **037**;
 * ECMA-376 `c:strRef`/`c:numRef` `c:f`; EMBEDDED_PACKAGE relationship.
 *
 * @packageDocumentation
 */
import { Presentation } from '../../core/package/index';
import { PackagePartAccess } from '../../core/package/package-part-access';
import { Slide } from '../../core/slideimplementation/slide';
import { CHART_CONTENT_TYPE } from './constants';
import { ChartsError, partNameOptions } from './errors';
import { openNestedXlsxPackageSync } from './nested-package-security';
import { ChartCellSheet } from './chart-cell-sheet';
import { writeChartEmbeddingXlsx } from './embedding-writer';
import { readEmbeddingCellSheet } from './xlsx-value-reader';
import { ChartInstance, ChartRelatedPart } from './resolve-chart';
import { DEFAULT_CHART_CACHE_SHEET_NAME, enrichChartPartCachesFromSheet } from './chart-part-caches';
import { getXlsxChartHostApi, ChartFrameFormat, ChartSeriesDataLabels, HostChart, HostWorkbook, HostWorksheet,
    ParsedChartSpace, XlsxChartHostApi, ChartDataSource, ChartPartExport, ChartTitleAreaFormat,
    HostChartSeries } from './xlsx-chart-api';
import { getXlsxRootRequired, Ej2XlsxRootModule } from './xlsx-surface';
import { stringIncludes, arrayAt } from '../../core/util/es5-compat';
import { PackagePart } from '../../core/package/package-model';
import { SlideCollection } from '../../core/create/slide-collection';
const utf8Enc: TextEncoder = new TextEncoder();
const utf8Dec: TextDecoder = new TextDecoder('utf-8');
/** SpreadsheetML content type for embedded xlsx (same as add-chart). */
const EMBEDDED_XLSX_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
/**
 * Public series surface for dual-write (formula strings + optional title).
 *
 * @remarks
 * TASK-1073: optional {@link ChartFrameFormat} / {@link ChartSeriesDataLabels}
 * when reading a live session or a parse entry that retained series bags.
 * Cold formula-only views omit bags (`undefined`).
 *
 * @public
 */
export interface ChartSeriesView {
    /** Series title formula or literal (xlsx `ChartSeries.title`). */
    title: string | undefined;
    /** Category labels formula (`c:cat` / `c:f`). */
    categoryLabels: string | undefined;
    /** Values formula (`c:val` / `c:f`). */
    values: string | undefined;
    /**
     * Series fill/line (`c:ser` / `c:spPr`) when known.
     * Live session: mutable host bag. Cold parse: snapshot when present.
     */
    readonly serieFormat?: ChartFrameFormat;
    /**
     * Series data labels (`c:dLbls`) when known.
     * Live session: mutable host bag. Cold parse: snapshot when present.
     */
    readonly dataLabels?: ChartSeriesDataLabels;
}
/**
 * Options for {@link Chart.addSeries}.
 *
 * @public
 */
export interface AddChartSeriesOptions {
    /** Optional series title (literal or formula string accepted by the host chart engine). */
    readonly title?: string;
    /** Optional category-label range or formula for the new series. */
    readonly categoryLabels?: string;
    /** Required values range or formula for the new series. */
    readonly values: string;
}
/**
 * Session dual-write state held on the PPT {@link Chart} handle.
 *
 * @internal
 */
export interface ChartEditSession {
    hostChart: HostChart;
    /** @deprecated Authoring no longer saves a live host workbook. Kept optional for callers that still set it. */
    workbook?: HostWorkbook;
    sheet: HostWorksheet;
    embeddingPartName: string;
    embeddingRelId: string;
    embeddingRelTarget: string;
    dirty: boolean;
    sourceFormattingSupported?: boolean;
    sourceBaselineXml?: string;
    sourceSeriesIdentities?: ReadonlyArray<object | undefined>;
    sourcePaintOverrides?: ChartGradientPaintOverride[];
}
/**
 * Mutable fields on {@link ChartInstance} updated after flush (typed cast).
 *
 * @internal
 */
export interface MutableChartInstance {
    originalXml: string;
    parsed: ParsedChartSpace;
    relatedParts: ReadonlyArray<ChartRelatedPart>;
}
/**
 * Locates the embedded package related part, or `undefined`.
 *
 * @internal
 * @param {ChartInstance} instance - The instance value.
 * @returns {ChartRelatedPart | undefined} The result.
 */
export function findEmbeddedPackagePart(instance: ChartInstance): ChartRelatedPart | undefined {
    return instance.relatedParts.find((r: ChartRelatedPart) => r.kind === 'embeddedPackage');
}
/**
 * Relative embedding target from chart part to embedding absolute name.
 *
 * @internal
 * @param {string} chartPartName - The chartPartName value.
 * @param {string} embeddingPartName - The embeddingPartName value.
 * @returns {string} The result.
 */
export function relativeEmbeddingTarget(chartPartName: string, embeddingPartName: string): string {
    // chart: /ppt/charts/chartN.xml → ../embeddings/…
    const embFile: string = embeddingPartName.replace(/^\/ppt\/embeddings\//, '');
    if (embFile.length === 0 || embFile === embeddingPartName) {
        // Fall back: strip leading slash only.
        return embeddingPartName.startsWith('/')
            ? `..${embeddingPartName}`
            : embeddingPartName;
    }
    void chartPartName;
    return `../embeddings/${embFile}`;
}
/**
 * Strip optional sheet qualifier and `$` from a single A1 cell or range formula.
 *
 * @internal
 * @param {string} formula - The formula value.
 * @returns {string} The result.
 */
export function stripSheetAndDollars(formula: string): string {
    let s: string = formula.trim();
    const bang: number = s.lastIndexOf('!');
    if (bang >= 0) {
        s = s.slice(bang + 1);
    }
    return s.replace(/\$/g, '');
}
/**
 * Loose A1 cell parse (no throw) for dual-write range mapping.
 *
 * @internal
 * @param {string} address - A1 address.
 * @returns {*} Parsed cell `{ col, row }` or `undefined`.
 */
function parseA1CellLoose(address: string): { readonly col: number; readonly row: number; } | undefined {
    const m: RegExpExecArray | null = /^([A-Za-z]+)([1-9][0-9]*)$/.exec(address.trim());
    if (m === null || m[1] === undefined || m[2] === undefined) {
        return undefined;
    }
    let n: number = 0;
    const letters: string = m[1].toUpperCase();
    for (let i: number = 0; i < letters.length; i += 1) {
        const code: number = letters.charCodeAt(i);
        if (code < 65 || code > 90) {
            return undefined;
        }
        n = n * 26 + (code - 64);
    }
    const row: number = Number.parseInt(m[2], 10);
    if (!Number.isFinite(row) || row < 1) {
        return undefined;
    }
    return { col: n - 1, row };
}

/**
 * Parse a simple single-area A1 range (no unions) into start/end col+row.
 *
 * @internal
 * @param {string} formula - Range formula or plain A1 range text.
 * @returns {*} Start/end col+row, or `undefined` when not a simple range.
 */
export function parseSimpleA1Range(formula: string): {
    readonly col0: number;
    readonly row0: number;
    readonly col1: number;
    readonly row1: number;
} | undefined {
    const plain: string = stripSheetAndDollars(formula);
    if (plain.length === 0 || stringIncludes(plain, ',') || stringIncludes(plain, ' ')) {
        return undefined;
    }
    const parts: Array<string> = plain.split(':');
    if (parts.length === 1) {
        const one: { readonly col: number; readonly row: number; } | undefined = parseA1CellLoose((parts[0] !== null &&
            parts[0] !== undefined ? parts[0] : ''));
        if (one === undefined) {
            return undefined;
        }
        return { col0: one.col, row0: one.row, col1: one.col, row1: one.row };
    }
    if (parts.length !== 2) {
        return undefined;
    }
    const a: { readonly col: number; readonly row: number; } | undefined = parseA1CellLoose((parts[0] !== null &&
        parts[0] !== undefined ? parts[0] : ''));
    const b: { readonly col: number; readonly row: number; } | undefined = parseA1CellLoose((parts[1] !== null &&
        parts[1] !== undefined ? parts[1] : ''));
    if (a === undefined || b === undefined) {
        return undefined;
    }
    return {
        col0: Math.min(a.col, b.col),
        row0: Math.min(a.row, b.row),
        col1: Math.max(a.col, b.col),
        row1: Math.max(a.row, b.row)
    };
}
/**
 *
 * @param {string} seriesEntry - The address value.
 * @returns {object} The result.
 */

/**
 * Read cell values along a simple A1 formula range from the host sheet.
 *
 * @internal
 * @param {HostWorksheet} sheet - Host worksheet.
 * @param {string | undefined} formula - Series formula.
 * @returns {ReadonlyArray<string | number | boolean | Date>} Values in row-major order.
 */
export function readValuesAlongFormula(
    sheet: HostWorksheet,
    formula: string | undefined
): ReadonlyArray<string | number | boolean | Date> {
    if (formula === undefined || formula.trim().length === 0) {
        return [];
    }
    const range: ReturnType<typeof parseSimpleA1Range> = parseSimpleA1Range(formula);
    if (range === undefined) {
        return [];
    }
    const out: Array<string | number | boolean | Date> = [];
    for (let r: number = range.row0; r <= range.row1; r += 1) {
        for (let c: number = range.col0; c <= range.col1; c += 1) {
            const addr: string = colRowToA1(c, r);
            const cell: ReturnType<HostWorksheet['getCell']> = sheet.getCell(addr);
            const v: unknown = cell !== undefined && cell !== null ? (cell as { value?: unknown }).value : undefined;
            if (v === undefined || v === null) {
                continue;
            }
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v instanceof Date) {
                out.push(v);
            } else {
                out.push(String(v));
            }
        }
    }
    return out;
}

/**
 * Write values along a simple A1 formula range on the host sheet.
 *
 * @internal
 * @param {HostWorksheet} sheet - Host worksheet.
 * @param {string | undefined} formula - Series formula.
 * @param {ReadonlyArray<string | number | boolean | Date>} values - Values to write.
 * @returns {void} Nothing.
 */
export function writeValuesAlongFormula(
    sheet: HostWorksheet,
    formula: string | undefined,
    values: ReadonlyArray<string | number | boolean | Date>
): void {
    if (formula === undefined || formula.trim().length === 0) {
        return;
    }
    const range: ReturnType<typeof parseSimpleA1Range> = parseSimpleA1Range(formula);
    if (range === undefined) {
        return;
    }
    let idx: number = 0;
    for (let r: number = range.row0; r <= range.row1; r += 1) {
        for (let c: number = range.col0; c <= range.col1; c += 1) {
            if (idx >= values.length) {
                return;
            }
            const addr: string = colRowToA1(c, r);
            const cell: ReturnType<HostWorksheet['getCell']> = sheet.getCell(addr);
            if (cell !== undefined && cell !== null) {
                const nextVal: string | number | boolean | Date | undefined = arrayAt(values, idx);
                if (nextVal !== undefined) {
                    (cell as { value: string | number | boolean | Date }).value = nextVal;
                }
            }
            idx += 1;
        }
    }
}

/**
 * Convert 0-based column and 1-based row to A1.
 *
 * @internal
 * @param {number} col0 - Zero-based column index.
 * @param {number} row1 - One-based row index.
 * @returns {string} A1 address.
 */
export function colRowToA1(col0: number, row1: number): string {
    let n: number = col0 + 1;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s + String(row1);
}

/**
 * Extract series title/category/values formulas from a parsed series entry.
 *
 * @internal
 * @param {*} seriesEntry - Parsed series bag.
 * @returns {*} Formula strings for title/category/values when present.
 */
export function seriesFormulasFromParsed(seriesEntry: unknown): {
    title?: string;
    categoryLabels?: string;
    values?: string;
} {
    if (seriesEntry === null || typeof seriesEntry !== 'object') {
        return {};
    }
    const rec: {
        readonly title?: unknown;
        readonly categoryLabels?: unknown;
        readonly values?: unknown;
    } = seriesEntry as {
        readonly title?: unknown;
        readonly categoryLabels?: unknown;
        readonly values?: unknown;
    };
    const out: {
        title?: string;
        categoryLabels?: string;
        values?: string;
    } = {};
    if (typeof rec.title === 'string') {
        out.title = rec.title;
    }
    if (typeof rec.categoryLabels === 'string') {
        out.categoryLabels = rec.categoryLabels;
    }
    if (typeof rec.values === 'string') {
        out.values = rec.values;
    }
    return out;
}
/**
 * Apply series title / serieFormat / dataLabels from a parsed entry onto a live host series.
 *
 * @internal
 * @param {*} hostSeries - The hostSeries value.
 * @param {*} seriesEntry - The seriesEntry value.
 * @returns {void} Nothing.
 */
export function applySeriesCustomizeFromParsed(hostSeries: HostChart['series'][number], seriesEntry: unknown): void {
    if (seriesEntry === null || typeof seriesEntry !== 'object') {
        return;
    }
    const rec: {
        readonly title?: unknown;
        readonly serieFormat?: {
            readonly fill?: {
                readonly type?: string;
                readonly foreColor?: string;
                readonly transparency?: number;
            };
            readonly line?: {
                readonly color?: string;
                readonly weightPt?: number;
            };
        };
        readonly dataLabels?: {
            readonly isValue?: boolean;
            readonly isCategoryName?: boolean;
            readonly isSeriesName?: boolean;
            readonly isPercentage?: boolean;
            readonly position?: string;
            readonly textArea?: {
                readonly bold?: boolean;
                readonly italic?: boolean;
                readonly size?: number;
                readonly fontName?: string;
                readonly color?: string;
            };
        };
    } = seriesEntry as {
        readonly title?: unknown;
        readonly serieFormat?: {
            readonly fill?: {
                readonly type?: string;
                readonly foreColor?: string;
                readonly transparency?: number;
            };
            readonly line?: {
                readonly color?: string;
                readonly weightPt?: number;
            };
        };
        readonly dataLabels?: {
            readonly isValue?: boolean;
            readonly isCategoryName?: boolean;
            readonly isSeriesName?: boolean;
            readonly isPercentage?: boolean;
            readonly position?: string;
            readonly textArea?: {
                readonly bold?: boolean;
                readonly italic?: boolean;
                readonly size?: number;
                readonly fontName?: string;
                readonly color?: string;
            };
        };
    };
    if (typeof rec.title === 'string') {
        hostSeries.title = rec.title;
    }
    applyFrameFromParsed(hostSeries.serieFormat, rec.serieFormat);
    const dl: NonNullable<typeof rec>['dataLabels'] | undefined = rec.dataLabels;
    if (dl === undefined) {
        return;
    }
    if (typeof dl.isValue === 'boolean') {
        hostSeries.dataLabels.isValue = dl.isValue;
    }
    if (typeof dl.isCategoryName === 'boolean') {
        hostSeries.dataLabels.isCategoryName = dl.isCategoryName;
    }
    if (typeof dl.isSeriesName === 'boolean') {
        hostSeries.dataLabels.isSeriesName = dl.isSeriesName;
    }
    if (typeof dl.isPercentage === 'boolean') {
        hostSeries.dataLabels.isPercentage = dl.isPercentage;
    }
    if (typeof dl.position === 'string') {
        try {
            hostSeries.dataLabels.position = dl.position;
        }
        catch {
            // Engine may reject unknown positions.
        }
    }
    const ta: NonNullable<typeof dl>['textArea'] | undefined = dl.textArea;
    if (ta === undefined) {
        return;
    }
    if (typeof ta.bold === 'boolean') {
        hostSeries.dataLabels.textArea.bold = ta.bold;
    }
    if (typeof ta.italic === 'boolean') {
        hostSeries.dataLabels.textArea.italic = ta.italic;
    }
    if (typeof ta.size === 'number' && Number.isFinite(ta.size)) {
        hostSeries.dataLabels.textArea.size = ta.size;
    }
    if (typeof ta.fontName === 'string') {
        hostSeries.dataLabels.textArea.fontName = ta.fontName;
    }
    if (typeof ta.color === 'string' && ta.color.length > 0) {
        try {
            hostSeries.dataLabels.textArea.color = ta.color;
        }
        catch {
            // RRGGBB only
        }
    }
}
/**
 * Require embedded package for dual-write / refresh; typed refuse otherwise.
 *
 * @internal
 * @param {ChartInstance} instance - The instance value.
 * @param {string} operation - The operation value.
 * @returns {ChartRelatedPart} The result.
 */
export function requireEmbeddedForEdit(instance: ChartInstance, operation: string): ChartRelatedPart {
    const ds: ChartDataSource = instance.parsed.dataSource;
    if (ds !== undefined && ds.kind === 'external') {
        throw new ChartsError(`${operation} refused: chart data source is external-only (no network fetch; dual-write requires an embedded workbook)`, partNameOptions(instance.partName));
    }
    const emb: ChartRelatedPart = findEmbeddedPackagePart(instance);
    if (emb === undefined) {
        throw new ChartsError(`${operation} refused: no embedded package relationship on chart part`, partNameOptions(instance.partName));
    }
    return emb;
}
/**
 * Open embedding bytes under nested limits and return host workbook + sheet.
 *
 * @internal
 * @param {Presentation} document - The document value.
 * @param {string} embeddingPartName - The embeddingPartName value.
 * @param {string} chartPartName - The chartPartName value.
 * @param {XlsxChartHostApi} api - The api value.
 * @returns {*} The result.
 */
export function openEmbeddingWorkbook(document: Presentation, embeddingPartName: string, chartPartName: string,
                                     _api: XlsxChartHostApi): {
        sheet: HostWorksheet;
        bytes: Uint8Array;
    } {
    const access: PackagePartAccess = document.packagePartAccess();
    const part: PackagePart = access.getPart(embeddingPartName);
    if (part === undefined) {
        throw new ChartsError(`Embedded package part is missing: ${embeddingPartName}`, partNameOptions(chartPartName));
    }
    // Same nested limits as the async pre-check, without awaiting inflate.
    openNestedXlsxPackageSync(part.data, undefined, { partName: embeddingPartName });
    const sheet: ChartCellSheet = readEmbeddingCellSheet(part.data, embeddingPartName);
    return { sheet, bytes: part.data };
}
/**
 * Rebuild a live host chart on a sheet from chartSpace series formulas.
 *
 * @remarks Uses first series category/value formulas when present; otherwise a minimal empty-series chart is refused (export requires ≥1 series).
 * @internal
 * @param {XlsxChartHostApi} api - The api value.
 * @param {HostWorksheet} sheet - The sheet value.
 * @param {ChartInstance} instance - The instance value.
 * @returns {HostChart} The result.
 */
export function rebuildHostChartOnSheet(api: XlsxChartHostApi, sheet: HostWorksheet, instance: ChartInstance): HostChart {
    const parsed: ParsedChartSpace = instance.parsed;
    const seriesList: ReadonlyArray<unknown> = parsed.series;
    if (!Array.isArray(seriesList) || seriesList.length === 0) {
        throw new ChartsError('Cannot rebuild host chart: parsed chartSpace has no series', partNameOptions(instance.partName));
    }
    const first: { title?: string; categoryLabels?: string; values?: string; } = seriesFormulasFromParsed(seriesList[0]);
    const catFormula: string = (first.categoryLabels !== null && first.categoryLabels !== undefined ? first.categoryLabels : 'A2:A2');
    const valFormula: string = (first.values !== null && first.values !== undefined ? first.values : 'B2:B2');
    const catPlain: string = stripSheetAndDollars(catFormula);
    const valPlain: string = stripSheetAndDollars(valFormula);
    const engineType: string = parsed.type.length > 0 ? parsed.type : 'columnClustered';
    const hostChart: HostChart = sheet.addChart(engineType, 0, 2, 10, 10, catPlain, valPlain);
    // Align additional series formulas when the engine supports addSeries.
    for (let i: number = 1; i < seriesList.length; i += 1) {
        const s: { title?: string; categoryLabels?: string; values?: string; } = seriesFormulasFromParsed(arrayAt(seriesList, i));
        if (s.values === undefined || s.values.length === 0) {
            continue;
        }
        try {
            hostChart.addSeries({
                ...(s.title !== undefined ? { title: s.title } : {}),
                ...(s.categoryLabels !== undefined
                    ? { categoryLabels: stripSheetAndDollars(s.categoryLabels) }
                    : {}),
                values: stripSheetAndDollars(s.values)
            });
        }
        catch {
            // Engine may refuse additional series for some types — keep first series.
            break;
        }
    }
    if (typeof parsed.dataRange === 'string' && parsed.dataRange.length > 0) {
        try {
            hostChart.dataRange = stripSheetAndDollars(parsed.dataRange);
        }
        catch {
            // dataRange derivation may fail for exotic layouts — formulas already set.
        }
    }
    // TASK-1072: restore title / frame formats so dual-write flush keeps prior customize.
    applyTitleAndAreasFromParsed(hostChart, parsed);
    // 3-D camera (rotation / autoscale / right-angle axes) survives the edit-session rebuild.
    if (parsed.view3D !== undefined) {
        hostChart.view3D = { ...parsed.view3D };
    }
    // TASK-1074: restore legend visibility / position / text / frame.
    applyLegendFromParsed(hostChart, parsed);
    // TASK-1075: restore primary category/value axis bags.
    applyAxesFromParsed(hostChart, parsed);
    // TASK-1073: restore per-series title / serieFormat / dataLabels after formulas.
    for (let i: number = 0; i < seriesList.length; i += 1) {
        const hs: HostChartSeries = arrayAt(hostChart.series, i);
        if (hs === undefined) {
            break;
        }
        applySeriesCustomizeFromParsed(hs, arrayAt(seriesList, i));
        // Combination charts: keep a per-series type that differs from the chart type (same-as-chart is the engine default).
        const entry: { serieType?: unknown } = arrayAt(seriesList, i) as { serieType?: unknown };
        if (entry !== null && typeof entry === 'object' && typeof entry.serieType === 'string' &&
            entry.serieType !== engineType) {
            hs.serieType = entry.serieType;
        }
    }
    return hostChart;
}
/**
 * Copy legend visibility + format bags from parsed chartSpace onto a live host chart.
 *
 * @internal
 * @param {HostChart} hostChart - The hostChart value.
 * @param {*} parsed - The parsed value.
 * @returns {void} Nothing.
 */
export function applyLegendFromParsed(hostChart: HostChart, parsed: ChartInstance['parsed']): void {
    if (typeof parsed.hasLegend === 'boolean') {
        hostChart.hasLegend = parsed.hasLegend;
    }
    if (typeof parsed.legendPosition === 'string' && parsed.legendPosition.length > 0) {
        try {
            hostChart.legend.position = parsed.legendPosition;
        }
        catch {
            // Engine may reject unknown legend positions.
        }
    }
    const ta: Readonly<Partial<ChartTitleAreaFormat>> = parsed.legendTextArea;
    if (ta !== undefined) {
        if (typeof ta.bold === 'boolean') {
            hostChart.legend.textArea.bold = ta.bold;
        }
        if (typeof ta.italic === 'boolean') {
            hostChart.legend.textArea.italic = ta.italic;
        }
        if (typeof ta.size === 'number' && Number.isFinite(ta.size)) {
            hostChart.legend.textArea.size = ta.size;
        }
        if (typeof ta.fontName === 'string') {
            hostChart.legend.textArea.fontName = ta.fontName;
        }
        if (typeof ta.color === 'string' && ta.color.length > 0) {
            try {
                hostChart.legend.textArea.color = ta.color;
            }
            catch {
                // RRGGBB only
            }
        }
    }
    applyFrameFromParsed(hostChart.legend.frameFormat, parsed.legendFrame);
}
/**
 * Copy primary category/value axis bags from parsed chartSpace onto a live host chart.
 *
 * @remarks Engine parse model uses `categoryAxis` / `valueAxis`; live handle uses `primaryCategoryAxis` / `primaryValueAxis`. Scale field names are `minimumValue` / `maximumValue` (not min/max).
 * @internal
 * @param {HostChart} hostChart - The hostChart value.
 * @param {*} parsed - The parsed value.
 * @returns {void} Nothing.
 */
export function applyAxesFromParsed(hostChart: HostChart, parsed: ChartInstance['parsed']): void {
    applyOneAxisFromParsed(hostChart.primaryCategoryAxis, parsed.categoryAxis);
    applyOneAxisFromParsed(hostChart.primaryValueAxis, parsed.valueAxis);
}
/**
 *
 * @param {*} target - The target value.
 * @param {*} source - The source value.
 * @returns {void} Nothing.
 */
function applyOneAxisFromParsed(target: HostChart['primaryCategoryAxis'],
                                source: ChartInstance['parsed']['categoryAxis'] | ChartInstance['parsed']['valueAxis'] | undefined): void {
    if (source === undefined) {
        return;
    }
    if (typeof source.title === 'string') {
        try {
            target.title = source.title.length > 0 ? source.title : undefined;
        }
        catch {
            // Engine may reject empty titles on some axis kinds.
        }
    }
    if (typeof source.visible === 'boolean') {
        target.visible = source.visible;
    }
    if (typeof source.hasMajorGridLines === 'boolean') {
        target.hasMajorGridLines = source.hasMajorGridLines;
    }
    if (typeof source.hasMinorGridLines === 'boolean') {
        target.hasMinorGridLines = source.hasMinorGridLines;
    }
    if (typeof source.numberFormat === 'string') {
        target.numberFormat = source.numberFormat.length > 0 ? source.numberFormat : undefined;
    }
    if ('minimumValue' in source) {
        target.minimumValue =
            typeof source.minimumValue === 'number' && Number.isFinite(source.minimumValue)
                ? source.minimumValue
                : undefined;
    }
    if ('maximumValue' in source) {
        target.maximumValue =
            typeof source.maximumValue === 'number' && Number.isFinite(source.maximumValue)
                ? source.maximumValue
                : undefined;
    }
    if (typeof source.majorTickMark === 'string' && source.majorTickMark.length > 0) {
        try {
            target.majorTickMark = source.majorTickMark;
        }
        catch {
            // unknown tick mark string
        }
    }
    if (typeof source.minorTickMark === 'string' && source.minorTickMark.length > 0) {
        try {
            target.minorTickMark = source.minorTickMark;
        }
        catch {
            // unknown tick mark string
        }
    }
    if (source.line !== undefined) {
        if (typeof source.line.color === 'string' && source.line.color.length > 0) {
            try {
                target.line.color = source.line.color;
            }
            catch {
                // RRGGBB only
            }
        }
        if (typeof source.line.weightPt === 'number' && Number.isFinite(source.line.weightPt)) {
            target.line.weightPt = source.line.weightPt;
        }
    }
    const ta: ChartTitleAreaFormat & Readonly<Partial<ChartTitleAreaFormat>> = source.titleArea;
    if (ta !== undefined) {
        if (typeof ta.bold === 'boolean') {
            target.titleArea.bold = ta.bold;
        }
        if (typeof ta.italic === 'boolean') {
            target.titleArea.italic = ta.italic;
        }
        if (typeof ta.size === 'number' && Number.isFinite(ta.size)) {
            target.titleArea.size = ta.size;
        }
        if (typeof ta.fontName === 'string') {
            target.titleArea.fontName = ta.fontName;
        }
        if (typeof ta.color === 'string' && ta.color.length > 0) {
            try {
                target.titleArea.color = ta.color;
            }
            catch {
                // RRGGBB only
            }
        }
    }
}
/**
 * Copy title + chart/plot area formats from parsed chartSpace onto a live host chart.
 *
 * @internal
 * @param {HostChart} hostChart - The hostChart value.
 * @param {*} parsed - The parsed value.
 * @returns {void} Nothing.
 */
export function applyTitleAndAreasFromParsed(hostChart: HostChart, parsed: ChartInstance['parsed']): void {
    if (parsed.hasTitle === true) {
        hostChart.hasTitle = true;
    }
    if (typeof parsed.chartTitle === 'string' && parsed.chartTitle.length > 0) {
        hostChart.hasTitle = true;
        hostChart.chartTitle = parsed.chartTitle;
    }
    const titleArea: Readonly<Partial<ChartTitleAreaFormat>> = parsed.chartTitleArea;
    if (titleArea !== undefined) {
        if (typeof titleArea.bold === 'boolean') {
            hostChart.chartTitleArea.bold = titleArea.bold;
        }
        if (typeof titleArea.italic === 'boolean') {
            hostChart.chartTitleArea.italic = titleArea.italic;
        }
        if (typeof titleArea.size === 'number' && Number.isFinite(titleArea.size)) {
            hostChart.chartTitleArea.size = titleArea.size;
        }
        if (typeof titleArea.fontName === 'string') {
            hostChart.chartTitleArea.fontName = titleArea.fontName;
        }
        if (typeof titleArea.color === 'string' && titleArea.color.length > 0) {
            hostChart.chartTitleArea.color = titleArea.color;
        }
    }
    applyFrameFromParsed(hostChart.chartArea, parsed.chartArea);
    applyFrameFromParsed(hostChart.plotArea, parsed.plotArea);
}
/**
 *
 * @param {*} target - The target value.
 * @param {*} source - The source value.
 * @returns {void} Nothing.
 */
function applyFrameFromParsed(target: HostChart['chartArea'] | HostChart['legend']['frameFormat'], source: {
    readonly fill?: {
        readonly type?: string;
        readonly foreColor?: string | undefined;
        readonly transparency?: number | undefined;
    };
    readonly line?: {
        readonly color?: string | undefined;
        readonly weightPt?: number | undefined;
    };
} | undefined): void {
    if (source === undefined) {
        return;
    }
    const fill: NonNullable<typeof source>['fill'] | undefined = source.fill;
    if (fill !== undefined) {
        if (typeof fill.type === 'string' && fill.type.length > 0) {
            try {
                target.fill.type = fill.type;
            }
            catch {
                // Engine may reject unknown fill types — keep default.
            }
        }
        if (typeof fill.foreColor === 'string' && fill.foreColor.length > 0) {
            try {
                target.fill.foreColor = fill.foreColor;
            }
            catch {
                // Colour must be RRGGBB — skip invalid parse leftovers.
            }
        }
        if (typeof fill.transparency === 'number' && Number.isFinite(fill.transparency)) {
            target.fill.transparency = fill.transparency;
        }
    }
    const line: { readonly color?: string; readonly weightPt?: number; } = source.line;
    if (line !== undefined) {
        if (typeof line.color === 'string' && line.color.length > 0) {
            try {
                target.line.color = line.color;
            }
            catch {
                // skip invalid
            }
        }
        if (typeof line.weightPt === 'number' && Number.isFinite(line.weightPt)) {
            target.line.weightPt = line.weightPt;
        }
    }
}
/**
 * Ensure a dual-write session is attached (open embedding + rebuild host chart).
 *
 * @internal
 * @param {Presentation} document - The document value.
 * @param {ChartInstance} instance - The instance value.
 * @param {ChartEditSession | undefined} existing - The existing value.
 * @returns {*} The result.
 */
export function ensureEditSession(document: Presentation, instance: ChartInstance,
                                     existing: ChartEditSession | undefined): ChartEditSession {
    // Guard on every edit, not only session creation: a cached live session must
    // not bypass external-only / missing-embedding refusal (TASK-1071).
    const emb: ChartRelatedPart = requireEmbeddedForEdit(instance, 'Chart data edit');
    if (existing !== undefined) {
        if (existing.sourceFormattingSupported !== true &&
            (instance.sourcePaintAuthored === true || instance.originalXml.indexOf('gradFill') >= 0)) {
            const loaded: Ej2XlsxRootModule = getXlsxRootRequired();
            captureChartGradientBaseline(existing, getXlsxChartHostApi(loaded), existing.sourceBaselineXml !== undefined);
        }
        return existing;
    }
    const module: Ej2XlsxRootModule = getXlsxRootRequired();
    const api: XlsxChartHostApi = getXlsxChartHostApi(module);
    const opened: { sheet: HostWorksheet; bytes: Uint8Array; } =
        openEmbeddingWorkbook(document, emb.targetPartName, instance.partName, api);
    const hostChart: HostChart = rebuildHostChartOnSheet(api, opened.sheet, instance);
    const relId: string = emb.relationshipId;
    const target: string = relativeEmbeddingTarget(instance.partName, emb.targetPartName);
    hostChart.dataSource = { kind: 'embedded', relationshipId: relId };
    const session: ChartEditSession = {
        hostChart,
        sheet: opened.sheet,
        embeddingPartName: emb.targetPartName,
        embeddingRelId: relId,
        embeddingRelTarget: target,
        dirty: false
    };
    if (instance.sourcePaintAuthored === true || instance.originalXml.indexOf('gradFill') >= 0) {
        captureChartGradientBaseline(session, api);
    }
    return session;
}
/**
 * Flush dual-write: export chart XML + save workbook → setPart both.
 *
 * @internal
 * @param {Presentation} document - The document value.
 * @param {ChartInstance} instance - The instance value.
 * @param {ChartEditSession} session - The session value.
 * @returns {*} The result.
 */
export function flushDualWrite(document: Presentation, instance: ChartInstance, session: ChartEditSession): void {
    const module: Ej2XlsxRootModule = getXlsxRootRequired();
    const api: XlsxChartHostApi = getXlsxChartHostApi(module);
    session.hostChart.dataSource = {
        kind: 'embedded',
        relationshipId: session.embeddingRelId
    };
    const preserve: boolean = instance.sourcePaintAuthored === true || instance.originalXml.indexOf('gradFill') >= 0;
    let nextEngineXml: string | undefined;
    let applied: boolean = false;
    const ids: ReadonlyArray<object | undefined> = session.sourceSeriesIdentities || [];
    const currentIds: Map<object, number> = new Map();
    if (preserve) {
        session.hostChart.series.forEach((series: HostChartSeries, index: number): void => {
            if (series.sourceIdentity === undefined || currentIds.has(series.sourceIdentity)) {
                throw new ChartsError('Chart gradient export requires ej2-xlsx source-formatting support');
            }
            currentIds.set(series.sourceIdentity, index);
        });
        if (session.sourceBaselineXml === undefined || ids.some((id: object | undefined): boolean => id === undefined)) {
            throw new ChartsError('Chart gradient export requires ej2-xlsx source-formatting support');
        }
    }
    const seriesMap: ReadonlyArray<number | undefined> = ids.map((id: object | undefined): number | undefined =>
        id === undefined ? undefined : currentIds.get(id));
    const sheetName: string = typeof session.sheet.name === 'string' && session.sheet.name.length > 0
        ? session.sheet.name
        : DEFAULT_CHART_CACHE_SHEET_NAME;
    const exported: ChartPartExport = api.exportChartPart(session.hostChart, {
        embeddedTarget: session.embeddingRelTarget,
        ...(preserve ? { preserveSourceFormatting: (xml: string): string => {
            applied = true; nextEngineXml = xml;
            if (session.sourceBaselineXml === undefined) { throw new ChartsError('Missing chart gradient export baseline'); }
            return preserveChartGradientExport(instance.originalXml, session.sourceBaselineXml,
                                               enrichChartPartCachesFromSheet(xml, session.sheet, sheetName), seriesMap,
                                               document.packagePartAccess().limits, instance.partName, session.sourcePaintOverrides);
        } } : {})
    });
    if (preserve && !applied) { throw new ChartsError('Chart gradient export requires ej2-xlsx source-formatting support'); }
    if (exported.contentType !== CHART_CONTENT_TYPE) {
        throw new ChartsError(`exportChartPart contentType mismatch on dual-write flush: "${exported.contentType}"`,
                              partNameOptions(instance.partName));
    }
    // PPT paints from presentation-chart caches; fill from dual-write cells only.
    const enriched: string = preserve ? exported.xml : enrichChartPartCachesFromSheet(exported.xml, session.sheet, sheetName);
    // Combination charts holding an area plot put the points on the tick marks (no half-category gap), as Excel does.
    const midCatXml: string = !preserve && enriched.indexOf('<c:areaChart>') >= 0 && /<c:(barChart|lineChart)>/.test(enriched)
        ? enriched.replace('<c:crossBetween val="between"/>', '<c:crossBetween val="midCat"/>')
        : enriched;
    const chartXml: string = preserve ? midCatXml : completeBar3DXml(midCatXml);
    const reparsed: ParsedChartSpace = api.parseChartSpace(chartXml, undefined, instance.partName);
    if (reparsed === undefined) {
        throw new ChartsError('parseChartSpace returned undefined after dual-write export', partNameOptions(instance.partName));
    }
    // Authoring writes cells only — no host Workbook.save, so no nested xl/charts to strip.
    const localSheet: ChartCellSheet = session.sheet instanceof ChartCellSheet
        ? session.sheet
        : copyHostSheet(session.sheet);
    const xlsxBytes: Uint8Array = writeChartEmbeddingXlsx({
        sheetName: sheetName,
        cells: localSheet.occupiedCells()
    });
    const chartXmlBytes: Uint8Array = utf8Enc.encode(chartXml);
    const access: PackagePartAccess = document.packagePartAccess();
    enforcePartWriteLimits(access, instance.partName, [
        chartXmlBytes.byteLength,
        xlsxBytes.byteLength
    ]);
    access.setPart({
        name: instance.partName,
        contentType: CHART_CONTENT_TYPE,
        data: chartXmlBytes
    });
    access.ensureContentTypeOverride(instance.partName, CHART_CONTENT_TYPE);
    access.setPart({
        name: session.embeddingPartName,
        contentType: EMBEDDED_XLSX_CONTENT_TYPE,
        data: xlsxBytes
    });
    access.ensureContentTypeOverride(session.embeddingPartName, EMBEDDED_XLSX_CONTENT_TYPE);
    const mut: MutableChartInstance = instance as unknown as MutableChartInstance;
    mut.originalXml = chartXml;
    mut.parsed = reparsed;
    session.sourceBaselineXml = nextEngineXml === undefined ? exported.xml : nextEngineXml;
    session.sourceSeriesIdentities = session.hostChart.series.map((series: HostChartSeries): object | undefined => series.sourceIdentity);
    session.sourcePaintOverrides = [];
    session.dirty = false;
    notifySourceSlideDirty(document, instance.sourcePartName);
}
/**
 *
 * @param {PackagePartAccess} access - The access value.
 * @param {string} partName - The partName value.
 * @param {*} byteLengths - The byteLengths value.
 * @returns {void} Nothing.
 */
function enforcePartWriteLimits(access: PackagePartAccess, partName: string, byteLengths: ReadonlyArray<number>): void {
    const max: number = access.limits.singlePartUncompressedBytes;
    for (let i: number = 0; i < byteLengths.length; i++) {
        const len: number = arrayAt(byteLengths, i);
        if (len > max) {
            throw new ChartsError(`Dual-write part exceeds singlePartUncompressedBytes (${String(len)} > ${String(max)})`,
                                  partNameOptions(partName));
        }

    }
}
/**
 * Marks the owner slide dirty when present in the document.
 *
 * @internal
 * @param {Presentation} document - The document value.
 * @param {string} sourcePartName - The sourcePartName value.
 * @returns {void} Nothing.
 */
export function notifySourceSlideDirty(document: Presentation, sourcePartName: string): void {
    const slides: SlideCollection = document.slides;
    for (let i: number = 0; i < slides.length; i++) {
        const slide: Slide = arrayAt(slides, i);
        if (slide.partName === sourcePartName) {
            slide.notifyMutate();
            return;
        }

    }
    const first: Slide | undefined = slides[0];
    if (first != null && first.notifyMutate != null) {
        first.notifyMutate();
    }
}
/**
 * Refresh: re-open embedding, rebuild host chart from sheet + formulas, flush.
 *
 * @remarks Does **not** evaluate arbitrary spreadsheet formulas beyond stored cell values ej2-xlsx already materializes. External-only charts throw. Missing embedding throws. Empty series throws.
 * @internal
 * @param {Presentation} document - The document value.
 * @param {ChartInstance} instance - The instance value.
 * @param {*} sessionHolder - Mutable holder for the chart edit session.
 * @param {*} [sessionHolder.current] - Current chart edit session.
 * @returns {Promise<void>} Resolves when the chart embedding is refreshed.
 */
export function refreshChartFromEmbedding(document: Presentation, instance: ChartInstance, sessionHolder: {
    current: ChartEditSession | undefined;
}): void {
    const emb: ChartRelatedPart = requireEmbeddedForEdit(instance, 'chart.refresh()');
    const module: Ej2XlsxRootModule = getXlsxRootRequired();
    const api: XlsxChartHostApi = getXlsxChartHostApi(module);
    const opened: { sheet: HostWorksheet; bytes: Uint8Array; } =
        openEmbeddingWorkbook(document, emb.targetPartName, instance.partName, api);
    const hostChart: HostChart = rebuildHostChartOnSheet(api, opened.sheet, instance);
    const session: ChartEditSession = {
        hostChart,
        sheet: opened.sheet,
        embeddingPartName: emb.targetPartName,
        embeddingRelId: emb.relationshipId,
        embeddingRelTarget: relativeEmbeddingTarget(instance.partName, emb.targetPartName),
        dirty: true
    };
    if (instance.sourcePaintAuthored === true || instance.originalXml.indexOf('gradFill') >= 0) {
        captureChartGradientBaseline(session, api);
    }
    sessionHolder.current = session;
    flushDualWrite(document, instance, session);
}
/**
 * Copies a host worksheet grid into the chart-local sheet used by the embedding writer.
 *
 * @param {HostWorksheet} sheet - Source sheet.
 * @returns {ChartCellSheet} Local copy of occupied cells in A1:ZZ200.
 */
function copyHostSheet(sheet: HostWorksheet): ChartCellSheet {
    const local: ChartCellSheet = new ChartCellSheet(sheet.name);
    for (let r: number = 1; r <= 200; r++) {
        for (let c: number = 0; c < 26; c++) {
            const addr: string = colRowToA1(c, r);
            try {
                const cell: ReturnType<HostWorksheet['getCell']> = sheet.getCell(addr);
                if (cell !== undefined && cell.value !== undefined && cell.value !== null) {
                    local.getCell(addr).value = cell.value;
                }
            }
            catch {
                break;
            }
        }
    }
    return local;
}
/**
 * Decode chart part XML for tests/helpers.
 *
 * @internal
 * @param {Uint8Array} bytes - The bytes value.
 * @returns {string} The result.
 */
export function decodeChartXml(bytes: Uint8Array): string {
    return utf8Dec.decode(bytes);
}

/**
 * Captures the unchanged engine paint view and opaque series identities before an edit.
 *
 * @param {ChartEditSession} session - Newly created live edit session.
 * @param {XlsxChartHostApi} api - Shared dependency-owned chart serializer.
 * @param {boolean} retainBaseline - Keep a previously exported baseline when probing an upgraded clean session.
 * @returns {void} Nothing.
 */
function captureChartGradientBaseline(session: ChartEditSession, api: XlsxChartHostApi, retainBaseline: boolean = false): void {
    const identities: ReadonlyArray<object | undefined> = session.hostChart.series.map(
        (series: HostChartSeries): object | undefined => series.sourceIdentity);
    const unique: Set<object> = new Set();
    identities.forEach((identity: object | undefined): void => {
        if (identity === undefined || unique.has(identity)) {
            throw new ChartsError('Chart gradient export requires ej2-xlsx source-formatting support');
        }
        unique.add(identity);
    });
    let applied: boolean = false;
    const exported: ChartPartExport = api.exportChartPart(session.hostChart, {
        embeddedTarget: session.embeddingRelTarget,
        preserveSourceFormatting: (xml: string): string => { applied = true; return xml; }
    });
    if (!applied) { throw new ChartsError('Chart gradient export requires ej2-xlsx source-formatting support'); }
    if (!retainBaseline) {
        session.sourceBaselineXml = exported.xml;
        session.sourceSeriesIdentities = identities;
    }
    session.sourceFormattingSupported = true;
}
/**
 * Records explicit paint bags so assigning an engine fallback value can still replace a source gradient.
 *
 * @param {ChartEditSession} session - Current live engine session.
 * @param {object} target - Existing engine owner.
 * @param {string} target.kind - Known source owner kind.
 * @param {number} target.series - Current series position when applicable.
 * @param {object} partial - Explicit partial fill/line values.
 * @returns {void} Nothing.
 * @internal
 */
export function markChartGradientPaintOverride(session: ChartEditSession, target: { kind: string; series?: number },
                                               partial: { fill?: Readonly<Partial<ChartFrameFillFormat>>;
                                                   line?: Readonly<Partial<ChartFrameLineFormat>> } | undefined): void {
    if (partial === undefined) { return; }
    if (session.sourcePaintOverrides === undefined) { session.sourcePaintOverrides = []; }
    if (partial.fill !== undefined && (partial.fill.type !== undefined || partial.fill.foreColor !== undefined ||
        partial.fill.transparency !== undefined) &&
        !session.sourcePaintOverrides.some((value: ChartGradientPaintOverride): boolean =>
            value.kind === target.kind && value.series === target.series && value.lane === 'fill')) {
        session.sourcePaintOverrides.push({ ...target, lane: 'fill' });
    }
    if (partial.line !== undefined && partial.line.color !== undefined &&
        !session.sourcePaintOverrides.some((value: ChartGradientPaintOverride): boolean =>
            value.kind === target.kind && value.series === target.series && value.lane === 'outline')) {
        session.sourcePaintOverrides.push({ ...target, lane: 'outline' });
    }
}

/**
 * Complete a `c:bar3DChart` the way PowerPoint writes it.
 *
 * @remarks
 * The engine emits a 3-D bar plot without `c:floor`/`c:sideWall`/`c:backWall`, `c:gapWidth`/`c:gapDepth`, and
 * (for `barDir="bar"`) with the category axis at the bottom and the value axis at the left. PowerPoint
 * and other consumers then draw the walls but not the bars. This adds the missing, schema-defined elements
 * and corrects the axis positions. Existing elements are never replaced.
 *
 * Citations: ECMA-376 Part 1 §21.2.2.17 `c:bar3DChart` (barDir, grouping, varyColors, ser, dLbls, gapWidth,
 * gapDepth, shape, axId); §21.2.2.27 `c:chart` child order (view3D, floor, sideWall, backWall, plotArea);
 * §21.2.2.15 `c:axPos`.
 *
 * @internal
 * @param {string} xml - Exported `c:chartSpace` XML.
 * @returns {string} XML with the missing 3-D elements added; unchanged for non-3-D-bar charts.
 */
function completeBar3DXml(xml: string): string {
    if (xml.indexOf('<c:bar3DChart>') < 0) {
        return xml;
    }
    let out: string = xml;
    if (out.indexOf('<c:floor>') < 0 && out.indexOf('</c:view3D>') >= 0) {
        out = out.replace('</c:view3D>', '</c:view3D><c:floor><c:thickness val="0"/></c:floor>' +
            '<c:sideWall><c:thickness val="0"/></c:sideWall><c:backWall><c:thickness val="0"/></c:backWall>');
    }
    const plot: RegExpExecArray | null = /<c:bar3DChart>[\s\S]*?<\/c:bar3DChart>/.exec(out);
    if (plot !== null && plot[0].indexOf('<c:gapWidth') < 0) {
        out = out.replace(plot[0], plot[0].replace(/(<c:shape val="[^"]*"\/>)?<c:axId/, '<c:gapWidth val="150"/><c:gapDepth val="150"/>$1<c:axId'));
    }
    if (plot !== null && plot[0].indexOf('<c:invertIfNegative') < 0) {
        // CT_BarSer order: tx, spPr, invertIfNegative, ..., cat, val, shape.
        out = out.replace(/(<c:ser>(?:(?!<\/c:ser>)[\s\S])*?)(<c:cat>|<c:val>)/g, '$1<c:invertIfNegative val="0"/>$2')
            .replace(/(<c:\/val>|<\/c:val>)(<\/c:ser>)/g, '$1<c:shape val="box"/>$2');
    }
    if (out.indexOf('<c:barDir val="bar"/>') >= 0) {
        out = out.replace(/(<c:catAx>[\s\S]*?)<c:axPos val="b"\/>/, '$1<c:axPos val="l"/>')
            .replace(/(<c:valAx>[\s\S]*?)<c:axPos val="l"\/>/, '$1<c:axPos val="b"/>');
    }
    return out;
}
