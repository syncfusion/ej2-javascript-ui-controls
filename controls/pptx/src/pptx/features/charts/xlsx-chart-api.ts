/**
 * Typed narrowing of ej2-xlsx root chart host APIs (TASK-1067 / TASK-1069).
 *
 * @remarks
 * {@link Ej2XlsxRootModule} exposes parse/serialize/export and Workbook as
 * `unknown` so CH-0 probes stay free of hard xlsx type coupling. This adapter
 * validates callables at runtime and returns strongly typed wrappers without
 * `any` or double assertions across unrelated types.
 *
 * Type shapes match `@syncfusion/ej2-xlsx` root re-exports
 * (`ParsedChartSpace`, `ChartDataSource`, `serializeChartSpace`,
 * `exportChartPart`, `Workbook`). Host may pass `pkg: undefined` when PPT owns
 * the package graph — the engine then classifies `c:externalData` without
 * chart-part relationships (`dataSource.kind` may be `none`).
 */
import { ChartsError } from './errors';
import { Ej2XlsxRootModule } from './xlsx-surface';
import { arrayAt, objectGet, objectGetChain } from '../../core/util/es5-compat';
import { PackageRelationship } from '../../core/package/relationships';
/**
 * Chart data package relationship state (`c:externalData`).
 *
 * @remarks
 * Mirrors ej2-xlsx `ChartDataSource`. Absent externalData is `none`.
 *
 * @public
 */
export type ChartDataSource = {
    /**
     * Discriminant for chart data embedded via a package relationship (c:externalData with internal target).
     */
    readonly kind: 'embedded';
    /** Relationship Id of the c:externalData target when kind is embedded or external. */
    readonly relationshipId: string;
} | {
    /** Discriminant for chart data linked to an external target via relationship. */
    readonly kind: 'external';
    /** Relationship Id of the c:externalData target when kind is embedded or external. */
    readonly relationshipId: string;
    /** Optional external target path when kind is external. */
    readonly target?: string;
} | {
    /** Discriminant when no c:externalData relationship is present. */
    readonly kind: 'none';
};
/**
 * Title text run formatting (ej2-xlsx `chartTitleArea` / parse surface).
 *
 * @remarks
 * Colour is RRGGBB / #RRGGBB only on write (engine rejects theme objects —
 * aligns with never writing `schemeClr` → `srgbClr` via this path).
 *
 * @public
 */
export interface ChartTitleAreaFormat {
    /** Whether title/legend/axis text runs are bold. */
    bold: boolean;
    /** Whether title/legend/axis text runs are italic. */
    italic: boolean;
    /** Font size in points when set. */
    size: number | undefined;
    /** Typeface name when set. */
    fontName: string | undefined;
    /** RRGGBB or #RRGGBB when set; never a theme / scheme reference object. */
    color: string | undefined;
}
/**
 * Solid fill on chart/plot/series frame (`c:spPr` / `a:solidFill`).
 *
 * @public
 */
export interface ChartFrameFillFormat {
    /** Engine fill kind (`solid` / `none` when modelled). */
    type: string;
    /** RRGGBB / #RRGGBB when solid. */
    foreColor: string | undefined;
    /** 0–1 when the engine surfaces transparency. */
    transparency: number | undefined;
}
/**
 * Line on chart/plot/series frame (`a:ln`).
 *
 * @public
 */
export interface ChartFrameLineFormat {
    /** Line colour as RRGGBB or #RRGGBB when set; never a scheme reference object. */
    color: string | undefined;
    /** Line weight in points when set. */
    weightPt: number | undefined;
}
/**
 * Chart area, plot area, or series frame format (fill + line).
 *
 * @public
 */
export interface ChartFrameFormat {
    /** Solid or none fill bag for the chart/plot/series frame. */
    readonly fill: ChartFrameFillFormat;
    /** Border line colour and weight for the chart/plot/series frame. */
    readonly line: ChartFrameLineFormat;
}
/**
 * Series-level data labels (ej2-xlsx `ChartDataLabels` on `ChartSeries`).
 *
 * @remarks
 * Maps to `c:dLbls` children (`c:showVal`, `c:showCatName`, `c:showSerName`,
 * `c:showPercent`, `c:dLblPos`, optional `c:txPr`). Position strings match
 * engine `DataLabelPosition` values (`center`, `outsideEnd`, …).
 * Chart-level plot `c:dLbls` is not a separate live bag on ej2-xlsx `Chart`;
 * series-level is the modelled path (TASK-1073 / TASK-1074).
 *
 * @public
 */
export interface ChartSeriesDataLabels {
    /** Show value labels (c:showVal). */
    isValue: boolean;
    /** Show category-name labels (c:showCatName). */
    isCategoryName: boolean;
    /** Show series-name labels (c:showSerName). */
    isSeriesName: boolean;
    /** Show percentage labels (c:showPercent). */
    isPercentage: boolean;
    /** Engine position string when set (`center`, `outsideEnd`, …). */
    position: string | undefined;
    /** Font styling bag for data-label text runs. */
    readonly textArea: ChartTitleAreaFormat;
}
/**
 * Legend handle (ej2-xlsx `ChartLegend`).
 *
 * @remarks
 * Position strings match engine `LegendPosition` values
 * (`bottom` | `top` | `left` | `right` | `corner`). Text area is the same bag
 * shape as title runs; frame is fill + line like chart/plot area.
 * Maps to `c:legend` / `c:legendPos` / legend `c:txPr` / `c:spPr`.
 *
 * @public
 */
export interface ChartLegendFormat {
    /** Engine legend position (`bottom`, `top`, `left`, `right`, `corner`). */
    position: string;
    /** Font styling for legend entries. */
    readonly textArea: ChartTitleAreaFormat;
    /** Legend box fill and border. */
    readonly frameFormat: ChartFrameFormat;
}
/**
 * Primary category or value axis (ej2-xlsx `ChartAxis`).
 *
 * @remarks
 * Maps to classic `c:catAx` / `c:valAx` (title, gridlines, scaling, ticks,
 * `c:numFmt`, axis line `c:spPr`/`a:ln`, title text area). Tick mark strings
 * match engine `TickMarkType` (`none` | `inside` | `outside` | `cross`).
 * Number format is an opaque engine string (no invented format codes).
 * Scale uses engine `minimumValue` / `maximumValue` (auto when `undefined`).
 * Secondary / date / series axes are not modelled here (TASK-1075 Later).
 *
 * @public
 */
export interface ChartAxisFormat {
    /** Axis title plain text. */
    title: string | undefined;
    /** Whether the axis is drawn. */
    visible: boolean;
    /** Major gridlines (`c:majorGridlines`). */
    hasMajorGridLines: boolean;
    /** Minor gridlines (`c:minorGridlines`). */
    hasMinorGridLines: boolean;
    /** Tick-label number format string when set (e.g. `#,##0`). */
    numberFormat: string | undefined;
    /** Fixed axis minimum; `undefined` = auto-scale. */
    minimumValue: number | undefined;
    /** Fixed axis maximum; `undefined` = auto-scale. */
    maximumValue: number | undefined;
    /** Major tick mark style (`none` | `inside` | `outside` | `cross`). */
    majorTickMark: string;
    /** Minor tick mark style. */
    minorTickMark: string;
    /** Axis line colour and thickness. */
    readonly line: ChartFrameLineFormat;
    /** Font styling for the axis title. */
    readonly titleArea: ChartTitleAreaFormat;
}
/**
 * 3-D camera settings of the host engine (`c:view3D`).
 *
 * @internal
 */
export interface HostChartView3D {
    rotationX?: number;
    rotationY?: number;
    heightPercent?: number;
    depthPercent?: number;
    rightAngleAxis?: boolean;
    perspective?: number;
}
/**
 * Parsed classic `c:chartSpace` surface from ej2-xlsx `parseChartSpace`.
 *
 * @remarks
 * Structural fields the host bridge relies on. Additional engine fields may
 * exist at runtime; this is the typed subset used by TASK-1067+.
 * TASK-1072 adds optional title/area format bags when the engine returns them.
 * TASK-1073 series entries may carry `serieFormat` / `dataLabels` at runtime
 * (typed as `unknown[]` on this surface; extract via helpers).
 * TASK-1075 adds optional primary category/value axis bags (`categoryAxis`
 * `valueAxis` on the engine parse model).
 *
 * @public
 */
export interface ParsedChartSpace {
    /** Parsed `c:view3D` camera settings (3-D charts) when present. */
    readonly view3D?: HostChartView3D;
    /** Parsed chart type token from c:chartSpace. */
    readonly type: string;
    /** Optional chart name when the engine surfaces it. */
    readonly name?: string;
    /** Parsed chart title plain text when present. */
    readonly chartTitle?: string;
    /** Whether the parsed chart reports a title. */
    readonly hasTitle: boolean;
    /** Optional title text-run formatting from parse. */
    readonly chartTitleArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    /** Optional chart-area fill/line snapshot from parse. */
    readonly chartArea?: {
        readonly fill?: Readonly<Partial<ChartFrameFillFormat>>;
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
    };
    /** Optional plot-area fill/line snapshot from parse. */
    readonly plotArea?: {
        readonly fill?: Readonly<Partial<ChartFrameFillFormat>>;
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
    };
    /** Optional primary data range string from parse. */
    readonly dataRange?: string;
    /** Parsed chart data-source classification. */
    readonly dataSource: ChartDataSource;
    /** Parsed series rows (opaque engine objects; narrow via helpers). */
    readonly series: ReadonlyArray<unknown>;
    /** Whether the parsed chart reports a legend. */
    readonly hasLegend: boolean;
    /**
     * Legend position when the engine returns it (`LegendPosition` string).
     * TASK-1074.
     */
    readonly legendPosition?: string;
    /** Legend text-run bag when present on parse (TASK-1074). */
    readonly legendTextArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    /** Legend frame fill/line when present on parse (TASK-1074). */
    readonly legendFrame?: {
        readonly fill?: Readonly<Partial<ChartFrameFillFormat>>;
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
    };
    /**
     * Primary category axis when the engine returns `categoryAxis` (TASK-1075).
     * Maps to `c:catAx` (or secondary valAx-as-category for some layouts).
     */
    readonly categoryAxis?: Readonly<Partial<ChartAxisFormat>> & {
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
        readonly titleArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    };
    /**
     * Primary value axis when the engine returns `valueAxis` (TASK-1075).
     * Maps to `c:valAx`.
     */
    readonly valueAxis?: Readonly<Partial<ChartAxisFormat>> & {
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
        readonly titleArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    };
    /** Present when the engine retained unrecognized chartSpace markup. */
    readonly preservedChartXml?: string;
}
/**
 * Minimal entry accepted by ej2-xlsx `serializeChartSpace`.
 *
 * @public
 */
export interface SerializeChartSpaceEntry {
    /** Chart type token for serializeChartSpace. */
    readonly type: string;
    /** Data-source classification for serializeChartSpace. */
    readonly dataSource: ChartDataSource;
    /** Series rows passed to serializeChartSpace. */
    readonly series: ReadonlyArray<unknown>;
    /** Optional chart title plain text on serialize. */
    readonly chartTitle?: string;
    /** Optional flag to show the chart title on serialize. */
    readonly hasTitle?: boolean;
    /** Optional flag to show the legend on serialize. */
    readonly hasLegend?: boolean;
}
/**
 * One relationship row emitted by ej2-xlsx `exportChartPart`.
 *
 * @public
 */
export interface HostChartRelationship {
    /** Relationship Id for a chart-part export relationship row. */
    readonly id: string;
    /** Relationship Type URI for a chart-part export relationship row. */
    readonly type: string;
    /** Relationship Target for a chart-part export relationship row. */
    readonly target: string;
    /** Optional TargetMode on a chart-part export relationship row. */
    readonly targetMode?: string;
}
/**
 * Chart part export descriptor from ej2-xlsx `exportChartPart`.
 *
 * @public
 */
export interface ChartPartExport {
    /** Serialized chartSpace XML payload for the chart part. */
    readonly xml: string;
    /** Content type for the exported chart part. */
    readonly contentType: string;
    /** OPC relationship type URI used to link the chart part. */
    readonly chartRelationshipType: string;
    /** Suggested file name for the chart part when packaging. */
    readonly suggestedPartFileName?: string;
    /** Chart data-source classification (embedded, external, or none). */
    readonly dataSource: ChartDataSource;
    /** Relationships emitted with the chart part export. */
    readonly relationships: ReadonlyArray<HostChartRelationship>;
}
/**
 * Mutable series row on a host chart (ej2-xlsx `ChartSeries` surface).
 *
 * @remarks
 * Formula strings map to `c:f` on export. Title may be a formula or literal.
 * TASK-1073: `serieFormat` (`c:ser`/`c:spPr`) and `dataLabels` (`c:dLbls`).
 *
 * @public
 */
export interface HostChartSeries {
    /** Opaque dependency-owned series identity when the host exporter supports preservation. @internal */
    readonly sourceIdentity?: object;
    title: string | undefined;
    categoryLabels: string | undefined;
    values: string | undefined;
    /** Per-series engine chart type override (combination charts); `undefined` = chart default. */
    serieType?: string | undefined;
    /** Fill + line for this series (`c:spPr`); same bag shape as chart/plot area. */
    readonly serieFormat: ChartFrameFormat;
    /** Series data labels (`c:dLbls`). */
    readonly dataLabels: ChartSeriesDataLabels;
}
/**
 * Options accepted by host {@link HostChart.addSeries}.
 *
 * @public
 */
export interface HostAddSeriesOptions {
    readonly title?: string;
    readonly categoryLabels?: string;
    readonly values: string;
}
/**
 * Host chart object returned by worksheet `addChart` (mutable dataSource + series).
 *
 * @remarks
 * TASK-1071 extends the façade with `dataRange`, `isSeriesInRows`, `series`,
 * and `addSeries` / `removeSeries`. TASK-1072 adds title / chartArea / plotArea.
 * TASK-1073 adds series `serieFormat` / `dataLabels` on each series row.
 * TASK-1074 adds `hasLegend` / `legend` (position, textArea, frameFormat).
 * TASK-1075 adds `primaryCategoryAxis` / `primaryValueAxis` (ej2-xlsx names).
 * Live engine chart remains in a WeakMap so `exportChartPart` receives a real
 * ChartHandle (not a plain object).
 *
 * @public
 */
export interface HostChart {
    /** Chart type token accepted by the host xlsx engine (e.g. column, line, pie). */
    type: string;
    /** How chart data is packaged (embedded workbook, external, or none). */
    dataSource: ChartDataSource;
    /** Primary data range string when known. */
    dataRange: string | undefined;
    /** True when series are arranged in rows rather than columns. */
    isSeriesInRows: boolean;
    /** Whether the chart title is shown. */
    hasTitle: boolean;
    /** Chart title plain text when set. */
    chartTitle: string | undefined;
    /** Font styling for the chart title text runs. */
    readonly chartTitleArea: ChartTitleAreaFormat;
    /** Fill and line format for the outer chart area. */
    readonly chartArea: ChartFrameFormat;
    /** Fill and line format for the plot area. */
    readonly plotArea: ChartFrameFormat;
    /** Whether the legend is shown. */
    hasLegend: boolean;
    /** Legend position, text area, and frame format. */
    readonly legend: ChartLegendFormat;
    /** Primary category (X) axis — engine `primaryCategoryAxis`. */
    readonly primaryCategoryAxis: ChartAxisFormat;
    /** Primary value (Y) axis — engine `primaryValueAxis`. */
    readonly primaryValueAxis: ChartAxisFormat;
    /** 3-D camera settings written as `c:view3D` (`undefined` removes the element). */
    view3D: HostChartView3D | undefined;
    /** Ordered series rows on the host chart. */
    readonly series: ReadonlyArray<HostChartSeries>;
    /** Adds a series from host options and returns the new series row. */
    addSeries(options: HostAddSeriesOptions): HostChartSeries;
    /** Removes a series by zero-based index. */
    removeSeries(index: number): void;
}
/**
 * Worksheet cell addressable by A1 string.
 *
 * @public
 */
export interface HostWorksheetCell {
    /** Cell value (string, number, boolean, Date, null, or undefined). */
    value: string | number | boolean | Date | null | undefined;
}
/**
 * Minimal worksheet surface for demo seed + addChart.
 *
 * @public
 */
export interface HostWorksheet {
    /** Worksheet tab name (xlsx `Worksheet.name`). */
    readonly name: string;
    /** Returns a cell handle for an A1-style address. */
    getCell(address: string): HostWorksheetCell;
    /** Creates a chart on the worksheet and returns the host chart handle. */
    addChart(type: string, left: number, top: number, width: number, height: number, categoryRange: string, valueRange: string): HostChart;
}
/**
 * Minimal workbook surface (`Workbook.create` / `Workbook.open` + `save`).
 *
 * @public
 */
export interface HostWorkbook {
    /** Worksheets in workbook order. */
    readonly worksheets: ReadonlyArray<HostWorksheet>;
    /**
     * Resolve a worksheet by 0-based index or tab name.
     *
     * @throws {Error} When the sheet is missing.
     */
    sheet(selector: string | number): HostWorksheet;
    /** Serializes the workbook to xlsx package bytes. */
    save(): Promise<Uint8Array>;
}
/**
 * Runtime-validated chart host callables from a loaded xlsx root module.
 *
 * @public
 */
export interface XlsxChartHostApi {
    /**
     * Parse chartSpace XML. Pass `pkg` undefined when the host owns the graph.
     */
    readonly parseChartSpace: (xml: string, pkg: undefined, chartPartName: string | undefined) => ParsedChartSpace | undefined;
    /** Serialize a minimal valid `c:chartSpace`. */
    readonly serializeChartSpace: (entry: SerializeChartSpaceEntry) => string;
    /**
     * Map of `ChartType` property name → engine value string
     * (e.g. `ColumnClustered` → `columnClustered`).
     */
    readonly chartTypeByKey: ReadonlyMap<string, string>;
    /** Create an empty workbook with at least one worksheet. */
    readonly createWorkbook: () => HostWorkbook;
    /**
     * Open an existing XLSX package (`Workbook.open`).
     *
     * @remarks
     * Callers must run {@link openNestedXlsxPackage} on untrusted bytes first.
     */
    readonly openWorkbook: (bytes: Uint8Array) => Promise<HostWorkbook>;
    /**
     * Export chart part XML + embedding relationship descriptors for PPT hosts.
     */
    readonly exportChartPart: (chart: HostChart, options: {
        readonly embeddedTarget: string;
        readonly preserveSourceFormatting?: (xml: string) => string;
    }) => ChartPartExport;
}
/** Live engine chart objects for facades returned by worksheet.addChart. */
const hostChartLive: WeakMap<object, object> = new WeakMap<object, object>();
/**
 *
 * @param {*} value - The value value.
 * @returns {boolean} The result.
 */
function isChartDataSource(value: unknown): value is ChartDataSource {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const rec: { readonly kind?: unknown; readonly relationshipId?: unknown; } = value as {
        readonly kind?: unknown;
        readonly relationshipId?: unknown;
    };
    const kind: unknown = rec.kind;
    if (kind === 'none') {
        return true;
    }
    if (kind === 'embedded' || kind === 'external') {
        return typeof rec.relationshipId === 'string';
    }
    return false;
}
/**
 *
 * @param {*} value - The value value.
 * @returns {boolean} The result.
 */
function isParsedChartSpace(value: unknown): value is ParsedChartSpace {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const rec: Record<string, unknown> = value as {
        readonly type?: unknown;
        readonly hasTitle?: unknown;
        readonly dataSource?: unknown;
        readonly series?: unknown;
        readonly hasLegend?: unknown;
    };
    return (typeof rec.type === 'string' &&
        typeof rec.hasTitle === 'boolean' &&
        typeof rec.hasLegend === 'boolean' &&
        Array.isArray(rec.series) &&
        isChartDataSource(rec.dataSource));
}
/**
 *
 * @param {*} value - The value value.
 * @returns {boolean} The result.
 */
function isHostChartRelationship(value: unknown): value is HostChartRelationship {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const rec: { readonly id?: unknown; readonly type?: unknown; readonly target?: unknown; } = value as {
        readonly id?: unknown;
        readonly type?: unknown;
        readonly target?: unknown;
    };
    return (typeof rec.id === 'string' &&
        typeof rec.type === 'string' &&
        typeof rec.target === 'string');
}
/**
 *
 * @param {*} value - The value value.
 * @returns {boolean} The result.
 */
function isChartPartExport(value: unknown): value is ChartPartExport {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const rec: Record<string, unknown> = value as {
        readonly xml?: unknown;
        readonly contentType?: unknown;
        readonly chartRelationshipType?: unknown;
        readonly dataSource?: unknown;
        readonly relationships?: unknown;
    };
    if (typeof rec.xml !== 'string' ||
        typeof rec.contentType !== 'string' ||
        typeof rec.chartRelationshipType !== 'string' ||
        !isChartDataSource(rec.dataSource) ||
        !Array.isArray(rec.relationships)) {
        return false;
    }
    for (let i: number = 0; i < rec.relationships.length; i++) {
        const edge: PackageRelationship = arrayAt(rec.relationships, i);
        if (!isHostChartRelationship(edge)) {
            return false;
        }

    }
    return true;
}
/**
 *
 * @param {Ej2XlsxRootModule} module - The module value.
 * @returns {ReadonlyMap<string, string>} The result.
 */
function buildChartTypeByKey(module: Ej2XlsxRootModule): ReadonlyMap<string, string> {
    const chartTypeRaw: unknown = (module as {
        readonly ChartType?: unknown;
    }).ChartType;
    const map: Map<string, string> = new Map<string, string>();
    if (chartTypeRaw === null || typeof chartTypeRaw !== 'object') {
        return map;
    }
    const keys2: string[] = Object.keys(chartTypeRaw as object);
    for (let i: number = 0; i < keys2.length; i++) {
        const key: string = arrayAt(keys2, i);
        const value: unknown = objectGet((chartTypeRaw as Record<string, unknown>), String(key));
        if (typeof value === 'string' && value.length > 0) {
            map.set(key, value);
        }

    }
    return map;
}
/**
 *
 * @param {object} parent - The parent value.
 * @param {string} key - The key value.
 * @param {string} label - The label value.
 * @returns {object} The result.
 */
function requireObjectProp(parent: object, key: string, label: string): object {
    const value: unknown = objectGetChain<unknown>(parent, String(key));
    if (value === null || typeof value !== 'object') {
        throw new ChartsError(`ej2-xlsx chart.${label} is not an object`);
    }
    return value as object;
}
/**
 *
 * @param {object} raw - The raw value.
 * @returns {ChartTitleAreaFormat} The result.
 */
function wrapTitleArea(raw: object): ChartTitleAreaFormat {
    const live: Record<string, unknown> & {
        addSeries?: unknown;
        removeSeries?: unknown;
    } = raw as {
        bold: unknown;
        italic: unknown;
        size: unknown;
        fontName: unknown;
        color: unknown;
    };
    return {
        /**
         *
         * @returns {boolean} The result.
         */
        get bold(): boolean {
            return live.bold === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set bold(value: boolean) {
            live.bold = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get italic(): boolean {
            return live.italic === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set italic(value: boolean) {
            live.italic = value;
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get size(): number | undefined {
            return typeof live.size === 'number' && Number.isFinite(live.size) ? live.size : undefined;
        },
        /**
         *
         * @param {number | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set size(value: number | undefined) {
            live.size = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get fontName(): string | undefined {
            return typeof live.fontName === 'string' ? live.fontName : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set fontName(value: string | undefined) {
            live.fontName = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get color(): string | undefined {
            return typeof live.color === 'string' ? live.color : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set color(value: string | undefined) {
            live.color = value;
        }
    };
}
/**
 *
 * @param {object} raw - The raw value.
 * @returns {ChartFrameFillFormat} The result.
 */
function wrapFrameFill(raw: object): ChartFrameFillFormat {
    const live: { type: unknown; foreColor: unknown; transparency: unknown; } = raw as {
        type: unknown;
        foreColor: unknown;
        transparency: unknown;
    };
    return {
        /**
         *
         * @returns {string} The result.
         */
        get type(): string {
            return typeof live.type === 'string' ? live.type : '';
        },
        /**
         *
         * @param {string} value - The value value.
         * @returns {void} Nothing.
         */
        set type(value: string) {
            live.type = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get foreColor(): string | undefined {
            return typeof live.foreColor === 'string' ? live.foreColor : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set foreColor(value: string | undefined) {
            live.foreColor = value;
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get transparency(): number | undefined {
            return typeof live.transparency === 'number' && Number.isFinite(live.transparency)
                ? live.transparency
                : undefined;
        },
        /**
         *
         * @param {number | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set transparency(value: number | undefined) {
            live.transparency = value;
        }
    };
}
/**
 *
 * @param {object} raw - The raw value.
 * @returns {ChartFrameLineFormat} The result.
 */
function wrapFrameLine(raw: object): ChartFrameLineFormat {
    const live: { color: unknown; weightPt: unknown; } = raw as {
        color: unknown;
        weightPt: unknown;
    };
    return {
        /**
         *
         * @returns {string | undefined} The result.
         */
        get color(): string | undefined {
            return typeof live.color === 'string' ? live.color : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set color(value: string | undefined) {
            live.color = value;
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get weightPt(): number | undefined {
            return typeof live.weightPt === 'number' && Number.isFinite(live.weightPt)
                ? live.weightPt
                : undefined;
        },
        /**
         *
         * @param {number | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set weightPt(value: number | undefined) {
            live.weightPt = value;
        }
    };
}
/**
 *
 * @param {object} raw - The raw value.
 * @param {string} label - The label value.
 * @returns {ChartFrameFormat} The result.
 */
function wrapFrameFormat(raw: object, label: string): ChartFrameFormat {
    const fill: ChartFrameFillFormat = wrapFrameFill(requireObjectProp(raw, 'fill', `${label}.fill`));
    const line: ChartFrameLineFormat = wrapFrameLine(requireObjectProp(raw, 'line', `${label}.line`));
    return { fill, line };
}
/**
 *
 * @param {object} raw - The raw value.
 * @returns {ChartLegendFormat} The result.
 */
function wrapLegend(raw: object): ChartLegendFormat {
    const live: { position: unknown; } = raw as {
        position: unknown;
    };
    const textArea: ChartTitleAreaFormat = wrapTitleArea(requireObjectProp(raw, 'textArea', 'legend.textArea'));
    const frameFormat: ChartFrameFormat = wrapFrameFormat(requireObjectProp(raw, 'frameFormat', 'legend.frameFormat'),
                                                          'legend.frameFormat');
    return {
        /**
         *
         * @returns {string} The result.
         */
        get position(): string {
            return typeof live.position === 'string' ? live.position : '';
        },
        /**
         *
         * @param {string} value - The value value.
         * @returns {void} Nothing.
         */
        set position(value: string) {
            live.position = value;
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get textArea(): ChartTitleAreaFormat {
            return textArea;
        },
        /**
         *
         * @returns {ChartFrameFormat} The result.
         */
        get frameFormat(): ChartFrameFormat {
            return frameFormat;
        }
    };
}
/**
 *
 * @param {object} raw - The raw value.
 * @param {string} label - The label value.
 * @returns {ChartAxisFormat} The result.
 */
function wrapAxis(raw: object, label: string): ChartAxisFormat {
    const live: Record<string, unknown> & {
        addSeries?: unknown;
        removeSeries?: unknown;
    } = raw as {
        title: unknown;
        visible: unknown;
        hasMajorGridLines: unknown;
        hasMinorGridLines: unknown;
        numberFormat: unknown;
        minimumValue: unknown;
        maximumValue: unknown;
        majorTickMark: unknown;
        minorTickMark: unknown;
    };
    const line: ChartFrameLineFormat = wrapFrameLine(requireObjectProp(raw, 'line', `${label}.line`));
    const titleArea: ChartTitleAreaFormat = wrapTitleArea(requireObjectProp(raw, 'titleArea', `${label}.titleArea`));
    return {
        /**
         *
         * @returns {string | undefined} The result.
         */
        get title(): string | undefined {
            return typeof live.title === 'string' ? live.title : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set title(value: string | undefined) {
            live.title = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get visible(): boolean {
            return live.visible !== false;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set visible(value: boolean) {
            live.visible = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get hasMajorGridLines(): boolean {
            return live.hasMajorGridLines === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set hasMajorGridLines(value: boolean) {
            live.hasMajorGridLines = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get hasMinorGridLines(): boolean {
            return live.hasMinorGridLines === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set hasMinorGridLines(value: boolean) {
            live.hasMinorGridLines = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get numberFormat(): string | undefined {
            return typeof live.numberFormat === 'string' ? live.numberFormat : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set numberFormat(value: string | undefined) {
            live.numberFormat = value;
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get minimumValue(): number | undefined {
            return typeof live.minimumValue === 'number' && Number.isFinite(live.minimumValue)
                ? live.minimumValue
                : undefined;
        },
        /**
         *
         * @param {number | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set minimumValue(value: number | undefined) {
            live.minimumValue = value;
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get maximumValue(): number | undefined {
            return typeof live.maximumValue === 'number' && Number.isFinite(live.maximumValue)
                ? live.maximumValue
                : undefined;
        },
        /**
         *
         * @param {number | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set maximumValue(value: number | undefined) {
            live.maximumValue = value;
        },
        /**
         *
         * @returns {string} The result.
         */
        get majorTickMark(): string {
            return typeof live.majorTickMark === 'string' ? live.majorTickMark : 'none';
        },
        /**
         *
         * @param {string} value - The value value.
         * @returns {void} Nothing.
         */
        set majorTickMark(value: string) {
            live.majorTickMark = value;
        },
        /**
         *
         * @returns {string} The result.
         */
        get minorTickMark(): string {
            return typeof live.minorTickMark === 'string' ? live.minorTickMark : 'none';
        },
        /**
         *
         * @param {string} value - The value value.
         * @returns {void} Nothing.
         */
        set minorTickMark(value: string) {
            live.minorTickMark = value;
        },
        /**
         *
         * @returns {ChartFrameLineFormat} The result.
         */
        get line(): ChartFrameLineFormat {
            return line;
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get titleArea(): ChartTitleAreaFormat {
            return titleArea;
        }
    };
}
/**
 *
 * @param {object} raw - The raw value.
 * @returns {ChartSeriesDataLabels} The result.
 */
function wrapDataLabels(raw: object): ChartSeriesDataLabels {
    const live: Record<string, unknown> & {
        addSeries?: unknown;
        removeSeries?: unknown;
    } = raw as {
        isValue: unknown;
        isCategoryName: unknown;
        isSeriesName: unknown;
        isPercentage: unknown;
        position: unknown;
    };
    const textArea: ChartTitleAreaFormat = wrapTitleArea(requireObjectProp(raw, 'textArea', 'dataLabels.textArea'));
    return {
        /**
         *
         * @returns {boolean} The result.
         */
        get isValue(): boolean {
            return live.isValue === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set isValue(value: boolean) {
            live.isValue = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isCategoryName(): boolean {
            return live.isCategoryName === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set isCategoryName(value: boolean) {
            live.isCategoryName = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isSeriesName(): boolean {
            return live.isSeriesName === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set isSeriesName(value: boolean) {
            live.isSeriesName = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isPercentage(): boolean {
            return live.isPercentage === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set isPercentage(value: boolean) {
            live.isPercentage = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get position(): string | undefined {
            return typeof live.position === 'string' ? live.position : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set position(value: string | undefined) {
            live.position = value;
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get textArea(): ChartTitleAreaFormat {
            return textArea;
        }
    };
}
/**
 *
 * @param {*} raw - The raw value.
 * @returns {HostChartSeries} The result.
 */
function wrapHostChartSeries(raw: unknown): HostChartSeries {
    if (raw === null || typeof raw !== 'object') {
        throw new ChartsError('ej2-xlsx chart series is not an object');
    }
    const live: { title: unknown; categoryLabels: unknown; values: unknown; } = raw as {
        title: unknown;
        categoryLabels: unknown;
        values: unknown;
    };
    const serieFormat: ChartFrameFormat = wrapFrameFormat(requireObjectProp(raw as object, 'serieFormat', 'serieFormat'), 'serieFormat');
    const dataLabels: ChartSeriesDataLabels = wrapDataLabels(requireObjectProp(raw as object, 'dataLabels', 'dataLabels'));
    // ES5 safety: never mix a spread with accessor properties in one literal. Downlevel
    // emits `__assign({}, …, { get/set … })` whose Object.assign copies getter values as
    // plain data properties, deleting every setter — `addSeries` then wrote the values
    // formula onto a dead copy and the engine model kept `values: ''`, so the next
    // setSeriesValueCells threw `Chart series N has no values formula`. Attach
    // `sourceIdentity` on its own literal so all accessors stay accessors under every TS
    // target.
    const seriesView: HostChartSeries = {
        /**
         *
         * @returns {string | undefined} The result.
         */
        get title(): string | undefined {
            return typeof live.title === 'string' ? live.title : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set title(value: string | undefined) {
            live.title = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get categoryLabels(): string | undefined {
            return typeof live.categoryLabels === 'string' ? live.categoryLabels : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set categoryLabels(value: string | undefined) {
            live.categoryLabels = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get values(): string | undefined {
            return typeof live.values === 'string' ? live.values : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set values(value: string | undefined) {
            live.values = value;
        },
        /**
         *
         * @returns {ChartFrameFormat} The result.
         */
        get serieType(): string | undefined {
            return typeof (live as { serieType?: unknown }).serieType === 'string'
                ? (live as { serieType?: string }).serieType : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set serieType(value: string | undefined) {
            (live as { serieType?: string }).serieType = value;
        },
        /**
         *
         * @returns {ChartFrameFormat} The result.
         */
        get serieFormat(): ChartFrameFormat {
            return serieFormat;
        },
        /**
         *
         * @returns {ChartSeriesDataLabels} The result.
         */
        get dataLabels(): ChartSeriesDataLabels {
            return dataLabels;
        }
    };
    const sourceIdentity: unknown = Reflect.get(raw, 'sourceIdentity');
    if (sourceIdentity !== null && typeof sourceIdentity === 'object') {
        (seriesView as { sourceIdentity?: unknown }).sourceIdentity = sourceIdentity;
    }
    return seriesView;
}
/**
 *
 * @param {*} raw - The raw value.
 * @returns {HostChart} The result.
 */
function wrapHostChart(raw: unknown): HostChart {
    if (raw === null || typeof raw !== 'object') {
        throw new ChartsError('ej2-xlsx worksheet.addChart did not return a chart object');
    }
    const live: Record<string, unknown> & {
        addSeries?: unknown;
        removeSeries?: unknown;
    } = raw as {
        type: unknown;
        dataSource: unknown;
        dataRange: unknown;
        isSeriesInRows: unknown;
        hasTitle: unknown;
        chartTitle: unknown;
        series: unknown;
        addSeries?: unknown;
        removeSeries?: unknown;
    };
    if (typeof live.type !== 'string') {
        throw new ChartsError('ej2-xlsx chart object missing string type');
    }
    const addSeriesRaw: unknown = live.addSeries;
    const removeSeriesRaw: unknown = live.removeSeries;
    if (typeof addSeriesRaw !== 'function') {
        throw new ChartsError('ej2-xlsx chart.addSeries is not a function');
    }
    if (typeof removeSeriesRaw !== 'function') {
        throw new ChartsError('ej2-xlsx chart.removeSeries is not a function');
    }
    // Engine signature: addSeries(title?: string); formulas set on returned handle.
    const addSeriesFn: (title?: string) => unknown = addSeriesRaw as (title?: string) => unknown;
    const removeSeriesFn: (index: number) => void = removeSeriesRaw as (index: number) => void;
    const titleArea: ChartTitleAreaFormat = wrapTitleArea(requireObjectProp(raw as object, 'chartTitleArea', 'chartTitleArea'));
    const chartArea: ChartFrameFormat = wrapFrameFormat(requireObjectProp(raw as object, 'chartArea', 'chartArea'), 'chartArea');
    const plotArea: ChartFrameFormat = wrapFrameFormat(requireObjectProp(raw as object, 'plotArea', 'plotArea'), 'plotArea');
    const legend: ChartLegendFormat = wrapLegend(requireObjectProp(raw as object, 'legend', 'legend'));
    const primaryCategoryAxis: ChartAxisFormat = wrapAxis(requireObjectProp(raw as object, 'primaryCategoryAxis', 'primaryCategoryAxis'),
                                                          'primaryCategoryAxis');
    const primaryValueAxis: ChartAxisFormat = wrapAxis(requireObjectProp(raw as object, 'primaryValueAxis', 'primaryValueAxis'),
                                                       'primaryValueAxis');
    const facade: HostChart = {
        /**
         *
         * @returns {string} The result.
         */
        get type(): string {
            return typeof live.type === 'string' ? live.type : '';
        },
        /**
         *
         * @param {string} value - The value value.
         * @returns {void} Nothing.
         */
        set type(value: string) {
            live.type = value;
        },
        /**
         *
         * @returns {ChartDataSource} The result.
         */
        get dataSource(): ChartDataSource {
            if (!isChartDataSource(live.dataSource)) {
                throw new ChartsError('ej2-xlsx chart dataSource is not a ChartDataSource shape');
            }
            return live.dataSource;
        },
        /**
         *
         * @param {ChartDataSource} value - The value value.
         * @returns {void} Nothing.
         */
        set dataSource(value: ChartDataSource) {
            live.dataSource = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get dataRange(): string | undefined {
            return typeof live.dataRange === 'string' ? live.dataRange : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set dataRange(value: string | undefined) {
            live.dataRange = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isSeriesInRows(): boolean {
            return live.isSeriesInRows === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set isSeriesInRows(value: boolean) {
            live.isSeriesInRows = value;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get hasTitle(): boolean {
            return live.hasTitle === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set hasTitle(value: boolean) {
            live.hasTitle = value;
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get chartTitle(): string | undefined {
            return typeof live.chartTitle === 'string' ? live.chartTitle : undefined;
        },
        /**
         *
         * @param {string | undefined} value - The value value.
         * @returns {void} Nothing.
         */
        set chartTitle(value: string | undefined) {
            live.chartTitle = value;
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get chartTitleArea(): ChartTitleAreaFormat {
            return titleArea;
        },
        /**
         *
         * @returns {ChartFrameFormat} The result.
         */
        get chartArea(): ChartFrameFormat {
            return chartArea;
        },
        /**
         *
         * @returns {ChartFrameFormat} The result.
         */
        get plotArea(): ChartFrameFormat {
            return plotArea;
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get view3D(): HostChartView3D | undefined {
            return (live as { view3D?: HostChartView3D }).view3D;
        },
        set view3D(value: HostChartView3D | undefined) {
            (live as { view3D?: HostChartView3D }).view3D = value;
        },
        get hasLegend(): boolean {
            return (live as {
                hasLegend?: unknown;
            }).hasLegend === true;
        },
        /**
         *
         * @param {boolean} value - The value value.
         * @returns {void} Nothing.
         */
        set hasLegend(value: boolean) {
            (live as unknown as {
                hasLegend: boolean;
            }).hasLegend = value;
        },
        /**
         *
         * @returns {ChartLegendFormat} The result.
         */
        get legend(): ChartLegendFormat {
            return legend;
        },
        /**
         *
         * @returns {ChartAxisFormat} The result.
         */
        get primaryCategoryAxis(): ChartAxisFormat {
            return primaryCategoryAxis;
        },
        /**
         *
         * @returns {ChartAxisFormat} The result.
         */
        get primaryValueAxis(): ChartAxisFormat {
            return primaryValueAxis;
        },
        /**
         *
         * @returns {*} The result.
         */
        get series(): ReadonlyArray<HostChartSeries> {
            if (!Array.isArray(live.series)) {
                return [];
            }
            return live.series.map((s: unknown) => wrapHostChartSeries(s));
        },
        /**
         *
         * @param {HostAddSeriesOptions} options - The options value.
         * @returns {HostChartSeries} The result.
         */
        addSeries(options: HostAddSeriesOptions): HostChartSeries {
            if (typeof options.values !== 'string' || options.values.trim().length === 0) {
                throw new ChartsError('addSeries requires non-empty values formula');
            }
            const createdRaw: unknown = addSeriesFn.call(live, typeof options.title === 'string' ? options.title : undefined);
            const created: HostChartSeries = wrapHostChartSeries(createdRaw);
            if (options.categoryLabels !== undefined) {
                created.categoryLabels = options.categoryLabels;
            }
            created.values = options.values;
            return created;
        },
        /**
         *
         * @param {number} index - The index value.
         * @returns {void} Nothing.
         */
        removeSeries(index: number): void {
            if (!Number.isInteger(index) || index < 0) {
                throw new ChartsError('removeSeries requires a non-negative integer index');
            }
            removeSeriesFn.call(live, index);
        }
    };
    hostChartLive.set(facade, live as object);
    return facade;
}
/**
 *
 * @param {*} raw - The raw value.
 * @returns {HostWorksheet} The result.
 */
function wrapWorksheet(raw: unknown): HostWorksheet {
    if (raw === null || typeof raw !== 'object') {
        throw new ChartsError('ej2-xlsx worksheet is not an object');
    }
    const getCellRaw: unknown = (raw as {
        getCell?: unknown;
    }).getCell;
    const addChartRaw: unknown = (raw as {
        addChart?: unknown;
    }).addChart;
    if (typeof getCellRaw !== 'function') {
        throw new ChartsError('ej2-xlsx worksheet.getCell is not a function');
    }
    if (typeof addChartRaw !== 'function') {
        throw new ChartsError('ej2-xlsx worksheet.addChart is not a function');
    }
    const getCellFn: (address: string) => unknown = getCellRaw as (address: string) => unknown;
    const addChartFn: (type: string, left: number, top: number, width: number, height: number,
        categoryRange: string, valueRange: string) => unknown =
        addChartRaw as (type: string, left: number, top: number, width: number, height: number,
            categoryRange: string, valueRange: string) => unknown;
    const nameDesc: PropertyDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(raw), 'name');
    const nameGetter: (() => unknown) | false = nameDesc !== undefined && typeof nameDesc.get === 'function'
        ? (nameDesc.get as () => unknown).bind(raw)
        : (): unknown => (raw as {
            name?: unknown;
        }).name;
    return {
        /**
         *
         * @returns {string} The result.
         */
        get name(): string {
            const n: any = (nameGetter as () => unknown)();// eslint-disable-line
            return typeof n === 'string' ? n : '';
        },
        /**
         *
         * @param {string} address - The address value.
         * @returns {HostWorksheetCell} The result.
         */
        getCell(address: string): HostWorksheetCell {
            if (typeof address !== 'string' || address.length === 0) {
                throw new ChartsError('worksheet.getCell requires a non-empty A1 address');
            }
            const cell: unknown = getCellFn.call(raw, address);
            if (cell === null || typeof cell !== 'object') {
                throw new ChartsError(`worksheet.getCell("${address}") did not return a cell object`);
            }
            const live: { value: string | number | boolean | Date | null | undefined; } = cell as {
                value: string | number | boolean | Date | null | undefined;
            };
            return {
                /**
                 *
                 * @returns {string | number | boolean | Date} The result.
                 */
                get value() : string | number | boolean | Date {
                    return live.value;
                },
                /**
                 *
                 * @param {string | number | boolean | Date} v - The v value.
                 * @returns {void} Nothing.
                 */
                set value(v: string | number | boolean | Date) {
                    live.value = v;
                }
            };
        },
        /**
         *
         * @param {string} type - The type value.
         * @param {number} left - The left value.
         * @param {number} top - The top value.
         * @param {number} width - The width value.
         * @param {number} height - The height value.
         * @param {string} categoryRange - The categoryRange value.
         * @param {string} valueRange - The valueRange value.
         * @returns {HostChart} The result.
         */
        addChart(type: string, left: number, top: number, width: number, height: number, categoryRange: string,
                 valueRange: string): HostChart {
            const chart: unknown = addChartFn.call(raw, type, left, top, width, height, categoryRange, valueRange);
            return wrapHostChart(chart);
        }
    };
}
/**
 *
 * @param {*} raw - The raw value.
 * @returns {HostWorkbook} The result.
 */
function wrapWorkbook(raw: unknown): HostWorkbook {
    if (raw === null || typeof raw !== 'object') {
        throw new ChartsError('ej2-xlsx Workbook did not return a workbook object');
    }
    const sheetsRaw: unknown = (raw as {
        worksheets?: unknown;
    }).worksheets;
    if (!Array.isArray(sheetsRaw) || sheetsRaw.length === 0) {
        throw new ChartsError('ej2-xlsx Workbook has no worksheets');
    }
    const worksheets: Array<HostWorksheet> = sheetsRaw.map((s: unknown) => wrapWorksheet(s));
    const saveRaw: unknown = (raw as {
        save?: unknown;
    }).save;
    if (typeof saveRaw !== 'function') {
        throw new ChartsError('ej2-xlsx Workbook.save is not a function');
    }
    const saveFn: () => unknown = saveRaw as () => unknown;
    const sheetRaw: unknown = (raw as {
        sheet?: unknown;
    }).sheet;
    return {
        worksheets,
        /**
         *
         * @param {string | number} selector - The selector value.
         * @returns {HostWorksheet} The result.
         */
        sheet(selector: string | number): HostWorksheet {
            if (typeof selector === 'number') {
                if (!Number.isInteger(selector) || selector < 0 || selector >= worksheets.length) {
                    throw new ChartsError(`Worksheet index ${String(selector)} is out of range (0..${String(worksheets.length - 1)})`);
                }
                const byIndex: HostWorksheet = arrayAt(worksheets, selector);
                if (byIndex === undefined) {
                    throw new ChartsError(`Worksheet index ${String(selector)} is missing`);
                }
                return byIndex;
            }
            if (typeof selector !== 'string' || selector.length === 0) {
                throw new ChartsError('Worksheet selector must be a non-empty name or 0-based index');
            }
            if (typeof sheetRaw === 'function') {
                const found: unknown = (sheetRaw as (name: string) => unknown).call(raw, selector);
                if (found !== null && found !== undefined) {
                    const byName: HostWorksheet = worksheets.find((w: HostWorksheet) => w.name === selector);
                    if (byName !== undefined) {
                        return byName;
                    }
                    return wrapWorksheet(found);
                }
            }
            const match: HostWorksheet = worksheets.find((w: HostWorksheet) => w.name === selector);
            if (match === undefined) {
                throw new ChartsError(`Worksheet "${selector}" was not found`);
            }
            return match;
        },
        /**
         *
         * @returns {*} The result.
         */
        async save(): Promise<Uint8Array> {
            const result: unknown = await Promise.resolve(saveFn.call(raw));
            if (!(result instanceof Uint8Array)) {
                throw new ChartsError('ej2-xlsx Workbook.save did not return Uint8Array');
            }
            return result;
        }
    };
}
/**
 * Re-bind series titles after engine `parseChartSpace`.
 *
 * @remarks
 * The vendored engine extracts the series title with an unbounded
 * `<c:tx[\s\S]*?<c:f>` scan that crosses `</c:tx>` into `c:cat`/`c:val` and
 * captures a range formula as `titleFormula` (preferred over the literal
 * `c:v`). On session rebuild (`refresh`) that formula serializes as a
 * `strRef` pointing at the category range, so legends paint months instead of
 * series names. Re-read the bounded `c:tx` block per `c:ser`: when the block
 * holds a literal `c:v` and no `c:f`, restore the literal title and drop the
 * bogus `titleFormula`.
 *
 * Citations: ECMA-376 Part 1 §21.2.2.207 `c:tx` (literal `c:v` or `c:strRef`);
 * §21.2.2.176 `c:ser` child order.
 *
 * @internal
 * @param {string} xml - Serialized `c:chartSpace` the engine parsed.
 * @param {ParsedChartSpace} parsed - Engine parse result.
 * @returns {ParsedChartSpace} Same parse with corrected per-series titles.
 */
function rebindParsedSeriesTitles(xml: string, parsed: ParsedChartSpace): ParsedChartSpace {
    const series: unknown = parsed.series;
    if (!Array.isArray(series) || series.length === 0) {
        return parsed;
    }
    const serBlocks: string[] = collectSerBlocks(xml);
    if (serBlocks.length === 0) {
        return parsed;
    }
    let mutated: boolean = false;
    const fixed: unknown[] = series.slice();
    for (let i: number = 0; i < series.length && i < serBlocks.length; i += 1) {
        const entry: unknown = series[i];
        if (entry === null || typeof entry !== 'object') {
            continue;
        }
        const record: { title?: unknown; titleFormula?: unknown } = entry as { title?: unknown; titleFormula?: unknown };
        const tx: { readonly literal?: string; readonly formula?: string } | undefined = readBoundedSeriesTx(serBlocks[i]);
        if (tx === undefined) {
            continue;
        }
        if (tx.literal !== undefined && tx.formula === undefined) {
            if (typeof record.titleFormula === 'string' && record.titleFormula.length > 0) {
                record.title = tx.literal;
                delete record.titleFormula;
                mutated = true;
            }
        }
    }
    if (!mutated) {
        return parsed;
    }
    return { ...parsed, series: fixed };
}
/**
 * Restore the series fill the engine mis-reads as `none`.
 *
 * @remarks
 * The vendored engine tests `<a:noFill` against the whole series `c:spPr`, so the
 * ubiquitous PowerPoint form `<a:solidFill>..</a:solidFill><a:ln><a:noFill/></a:ln>` (an
 * outline-less series) is parsed as a `none` fill. The edit session then writes `a:noFill`
 * and the bars (notably after a switch to a 3-D type) become invisible. Re-read the fill
 * from the series `c:spPr` with the `a:ln` outline removed, and restore an explicit
 * `a:srgbClr` solid fill when the engine reported `none`.
 *
 * Citations: ECMA-376 Part 1 §21.2.2.197 `c:spPr`; §20.1.2.2.35 `a:ln` (its own `a:noFill`
 * describes the outline, not the fill); §20.1.8.54 `a:solidFill`.
 *
 * @internal
 * @param {string} xml - Serialized `c:chartSpace` the engine parsed.
 * @param {ParsedChartSpace} parsed - Engine parse result.
 * @returns {ParsedChartSpace} Same parse with corrected per-series solid fills.
 */
function rebindParsedSeriesFills(xml: string, parsed: ParsedChartSpace): ParsedChartSpace {
    const series: unknown = parsed.series;
    if (!Array.isArray(series)) {
        return parsed;
    }
    const serBlocks: string[] = collectSerBlocks(xml);
    for (let i: number = 0; i < series.length && i < serBlocks.length; i += 1) {
        const entry: unknown = series[i];
        if (entry === null || typeof entry !== 'object') {
            continue;
        }
        const format: { fill?: { type?: unknown; foreColor?: unknown } } | undefined =
            (entry as { serieFormat?: { fill?: { type?: unknown; foreColor?: unknown } } }).serieFormat;
        if (format === undefined || format.fill === undefined || format.fill.type !== 'none') {
            continue;
        }
        const spPr: RegExpExecArray | null = /<c:spPr>([\s\S]*?)<\/c:spPr>/.exec(serBlocks[i]);
        if (spPr === null) {
            continue;
        }
        const own: string = spPr[1].replace(/<a:ln\b[^>]*\/>/g, '').replace(/<a:ln\b[^>]*>[\s\S]*?<\/a:ln>/g, '');
        if (/<a:noFill\b/.test(own)) {
            continue;
        }
        const solid: RegExpExecArray | null = /<a:solidFill\b[^>]*>\s*<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{6})"/.exec(own);
        if (solid !== null) {
            format.fill.type = 'solid';
            format.fill.foreColor = solid[1].toUpperCase();
        }
    }
    return parsed;
}
/**
 * Collect the inner `c:ser` block strings in document order.
 *
 * @internal
 * @param {string} xml - Serialized `c:chartSpace`.
 * @returns {string[]} Inner text of each `<c:ser>` element.
 */
function collectSerBlocks(xml: string): string[] {
    const out: string[] = [];
    const open: string = '<c:ser>';
    let at: number = xml.indexOf(open);
    while (at >= 0) {
        const close: number = xml.indexOf('</c:ser>', at);
        if (close < 0) {
            break;
        }
        out.push(xml.slice(at + open.length, close));
        at = xml.indexOf(open, close + '</c:ser>'.length);
    }
    return out;
}
/**
 * Read the bounded `c:tx` block of one `c:ser`.
 *
 * @internal
 * @param {string} ser - Inner `c:ser` text.
 * @returns {{ literal?: string; formula?: string } | undefined} Literal `c:v`
 * and/or formula `c:f` inside `c:tx` only.
 */
function readBoundedSeriesTx(ser: string): { readonly literal?: string; readonly formula?: string } | undefined {
    const start: number = ser.indexOf('<c:tx>');
    if (start < 0) {
        return undefined;
    }
    const end: number = ser.indexOf('</c:tx>', start);
    if (end < 0) {
        return undefined;
    }
    const inner: string = ser.slice(start + '<c:tx>'.length, end);
    const out: { literal?: string; formula?: string } = {};
    const v: RegExpExecArray | null = /<c:v>([^<]*)<\/c:v>/.exec(inner);
    if (v !== null) {
        out.literal = unescapeXmlText(v[1]);
    }
    const f: RegExpExecArray | null = /<c:f>([^<]*)<\/c:f>/.exec(inner);
    if (f !== null) {
        out.formula = unescapeXmlText(f[1]);
    }
    if (out.literal === undefined && out.formula === undefined) {
        return undefined;
    }
    return out;
}
/**
 * Decode the five XML entities chart titles may contain.
 *
 * @internal
 * @param {string} value - Escaped XML text.
 * @returns {string} Decoded text.
 */
function unescapeXmlText(value: string): string {
    return value
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, '\'')
        .replace(/&amp;/g, '&');
}
/**
 * Narrows a loaded xlsx root module to typed chart host callables.
 * @throws {Error} when exports are not functions or return shapes fail.
 * @public
 * @param {Ej2XlsxRootModule} module - Result of {@link loadXlsxRoot}.
 * @returns {XlsxChartHostApi} Validated parse/serialize/export/workbook wrappers.
 */
export function getXlsxChartHostApi(module: Ej2XlsxRootModule): XlsxChartHostApi {
    const parseRaw: unknown = module.parseChartSpace;
    const serializeRaw: unknown = module.serializeChartSpace;
    const exportRaw: unknown = module.exportChartPart;
    if (typeof parseRaw !== 'function') {
        throw new ChartsError('ej2-xlsx root parseChartSpace is not a function');
    }
    if (typeof serializeRaw !== 'function') {
        throw new ChartsError('ej2-xlsx root serializeChartSpace is not a function');
    }
    if (typeof exportRaw !== 'function') {
        throw new ChartsError('ej2-xlsx root exportChartPart is not a function');
    }
    const parseFn: (xml: string, pkg: undefined, chartPartName: string | undefined) => unknown = parseRaw as (xml: string, pkg: undefined,
        chartPartName: string | undefined) => unknown;
    const serializeFn: (entry: SerializeChartSpaceEntry) => unknown = serializeRaw as (entry: SerializeChartSpaceEntry) => unknown;
    const exportFn: (chart: unknown, options: { readonly embeddedTarget: string;
        readonly preserveSourceFormatting?: (xml: string) => string; }) => unknown = exportRaw as (chart: unknown,
        options: {
            readonly embeddedTarget: string;
            readonly preserveSourceFormatting?: (xml: string) => string;
        }) => unknown;
    const chartTypeByKey: ReadonlyMap<string, string> = buildChartTypeByKey(module);
    const workbookCtor: unknown = module.Workbook;
    if (workbookCtor === null ||
        (typeof workbookCtor !== 'function' && typeof workbookCtor !== 'object')) {
        throw new ChartsError('ej2-xlsx root Workbook is missing');
    }
    const createRaw: unknown = (workbookCtor as {
        create?: unknown;
    }).create;
    if (typeof createRaw !== 'function') {
        throw new ChartsError('ej2-xlsx Workbook.create is not a function');
    }
    const createFn: () => unknown = createRaw as () => unknown;
    const openRaw: unknown = (workbookCtor as {
        open?: unknown;
    }).open;
    if (typeof openRaw !== 'function') {
        throw new ChartsError('ej2-xlsx Workbook.open is not a function');
    }
    const openFn: (bytes: Uint8Array) => unknown = openRaw as (bytes: Uint8Array) => unknown;
    return {
        chartTypeByKey,
        /**
         *
         * @param {string} xml - The xml value.
         * @param {undefined} pkg - The pkg value.
         * @param {string} chartPartName - The chartPartName value.
         * @returns {ParsedChartSpace} The result.
         */
        parseChartSpace(xml: string, pkg: undefined, chartPartName: string): ParsedChartSpace | undefined {
            const result: unknown = parseFn(xml, pkg, chartPartName);
            if (result === undefined) {
                return undefined;
            }
            if (!isParsedChartSpace(result)) {
                throw new ChartsError('ej2-xlsx parseChartSpace returned an unexpected value (not a ParsedChartSpace shape)',
                                      chartPartName === undefined || chartPartName.length === 0
                                          ? {}
                                          : { partName: chartPartName });
            }
            return rebindParsedSeriesFills(xml, rebindParsedSeriesTitles(xml, result as ParsedChartSpace));
        },
        /**
         *
         * @param {SerializeChartSpaceEntry} entry - The entry value.
         * @returns {string} The result.
         */
        serializeChartSpace(entry: SerializeChartSpaceEntry): string {
            const result: unknown = serializeFn(entry);
            if (typeof result !== 'string') {
                throw new ChartsError('ej2-xlsx serializeChartSpace did not return a string');
            }
            return result;
        },
        /**
         *
         * @returns {HostWorkbook} The result.
         */
        createWorkbook() : HostWorkbook {
            return wrapWorkbook(createFn.call(workbookCtor));
        },
        /**
         *
         * @param {Uint8Array} bytes - The bytes value.
         * @returns {*} The result.
         */
        async openWorkbook(bytes: Uint8Array): Promise<HostWorkbook> {
            if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0) {
                throw new ChartsError('Workbook.open requires non-empty Uint8Array package bytes');
            }
            const opened: unknown = await Promise.resolve(openFn.call(workbookCtor, bytes));
            return wrapWorkbook(opened);
        },
        /**
         * @param {HostChart} chart - The chart value.
         * @param {object} options - The options value.
         * @param {*} options.embeddedTarget - The options.embeddedTarget value.
         * @param {Function} options.preserveSourceFormatting - Optional source paint preservation callback.
         * @returns {ChartPartExport} The result.
         */
        exportChartPart(chart: HostChart, options: { readonly embeddedTarget: string;
            readonly preserveSourceFormatting?: (xml: string) => string; }): ChartPartExport {
            const live: object = hostChartLive.get(chart);
            const target: object = (live !== null && live !== undefined ? live : chart);
            const result: unknown = exportFn(target, options);
            if (!isChartPartExport(result)) {
                throw new ChartsError('ej2-xlsx exportChartPart returned an unexpected ChartPartExport shape');
            }
            return result;
        }
    };
}
