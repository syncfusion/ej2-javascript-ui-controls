/**
 * Classic DrawingML charts (`c:chartSpace`) for worksheet embedding.
 *
 * Public surface follows Syncfusion XlsIO chart authoring purpose and names
 * (camelCase): `addChart`, `chartTitle`/`hasTitle`, `dataRange`/`isSeriesInRows`,
 * `addSeries`/`categoryLabels`/`values`, `primaryCategoryAxis`/`primaryValueAxis`,
 * `hasLegend`/`legend.position`, and anchor `row`/`column`/`width`/`height`
 * (XlsIO TopRow/LeftColumn + size). Load/parse/serialize is this library's
 * OOXML model — not a port of XlsIO internals.
 *
 * Host-agnostic chart.xml parse/serialize is shared for DOCX/PPTX reuse.
 * XLSX owns the spreadsheetDrawing graphicFrame adapter only.
 *
 * Citations:
 * - docs/specs/charts.md; docs/requirements/charts.md; docs/ooxml-mapping/charts.md
 * - docs/api/API-RULES.md (R1.1 properties, add* / remove*; R1.5 one name; no TS enums)
 * - Syncfusion XlsIO IChartShape / ExcelChartType (API names/purpose only)
 * - dml-chart.xsd CT_ChartSpace / CT_Chart / CT_PlotArea / CT_View3D / CT_ExternalData
 * - dml-spreadsheetDrawing.xsd graphicFrame anchors
 *
 * @private
 */

import { parseA1Range, CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidChartError } from '../core/errors';
import { EMU_PER_PT } from '../core/length'; 
import {
    CHART_CONTENT_TYPE,
    CHART_REL_TYPE_TRANSITIONAL,
    CHARTEX_CONTENT_TYPE,
    CHARTEX_REL_TYPE,
    DRAWING_CONTENT_TYPE,
    DRAWING_REL_TYPE_TRANSITIONAL,
    DRAWINGML_CHARTEX_NS,
    DRAWINGML_CHART_NS_TRANSITIONAL,
    isChartExRelationshipType,
    isChartRelationshipType,
    isDrawingRelationshipType
} from '../core/package/constants';
import { OpcPackage, OpcPart } from '../core/package/opc-package';
import { normalizePartName, resolveRelationshipTarget } from '../core/package/part-names';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8, escapeXml, unescapeXml } from '../core/xml/minimal-xml';
import {
    cloneChartEx,
    createChartEx,
    isChartExType,
    serializeChartEx,
    ChartEx,
    ChartExLayoutValue as ChartExLayoutToken
} from './chart-ex';

import {
    anchorToAbsoluteLeftPt,
    anchorToAbsoluteTopPt,
    applyAbsoluteLeft,
    applyAbsoluteTop,
    pointsToEmu,
    requireNonNegativePoints,
    requirePositiveInt,
    requirePositivePoints,
    SheetMetrics,
    twoCellAnchorHeightEmu,
    twoCellAnchorWidthEmu
} from './drawing-placement';

const XDR_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing';
const A_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const C_NS: string = DRAWINGML_CHART_NS_TRANSITIONAL;
const CX_NS: string = DRAWINGML_CHARTEX_NS;

/**
 * Chart layouts you can pass as the first argument to {@link Worksheet.addChart}.
 * Covers standard Excel charts (column, bar, line, pie, scatter, bubble, area, 3-D,
 * radar, stock, surface and contour, column-line combinations) and extended layouts
 * (funnel, waterfall, box-and-whisker, Pareto, treemap, sunburst, histogram, filled map).
 *
 * Prefer the specific tokens (for example `ColumnClustered`, not the deprecated
 * coarse aliases like `Column`). Use as `ChartType.ColumnClustered`, not a TypeScript enum.
 */
export const ChartType: { [key: string]: string } = {
    // Column
    ColumnClustered: 'columnClustered',
    ColumnStacked: 'columnStacked',
    ColumnPercentStacked: 'columnPercentStacked',
    /** @deprecated Prefer {@link ChartType.ColumnClustered}. */
    Column: 'columnClustered',
    // Bar
    BarClustered: 'barClustered',
    BarStacked: 'barStacked',
    BarPercentStacked: 'barPercentStacked',
    /** @deprecated Prefer {@link ChartType.BarClustered}. */
    Bar: 'barClustered',
    // Line
    /** A line connecting one value per category. */
    Line: 'line',
    /** Lines stacked, showing cumulative contribution. */
    LineStacked: 'lineStacked',
    /** Lines stacked to 100%, showing each series' share of the total. */
    LinePercentStacked: 'linePercentStacked',
    /** A line chart with a dot marking each data point. */
    LineMarkers: 'lineMarkers',
    /** Stacked lines with a dot marking each data point. */
    LineStackedMarkers: 'lineStackedMarkers',
    /** 100% stacked lines with a dot marking each data point. */
    LinePercentStackedMarkers: 'linePercentStackedMarkers',
    // Pie / of-pie / doughnut
    /** A pie chart showing each value's share of a total. */
    Pie: 'pie',
    /** Pie with slices pulled away from the center. */
    PieExploded: 'pieExploded',
    /** Pie of pie (main pie plus a second pie for small slices). */
    PieOfPie: 'pieOfPie',
    /** Bar of pie (main pie plus a bar for small slices). */
    BarOfPie: 'barOfPie',
    /** Doughnut chart. */
    Doughnut: 'doughnut',
    /** Doughnut with slices pulled away from the center. */
    DoughnutExploded: 'doughnutExploded',
    // Scatter
    /** Scatter points shown as markers only, without connecting lines. */
    ScatterMarkers: 'scatterMarkers',
    /** Scatter points connected by straight lines. */
    ScatterLine: 'scatterLine',
    /** Scatter points connected by straight lines, with a marker on each point. */
    ScatterLineMarkers: 'scatterLineMarkers',
    /** Scatter points connected by a smooth curved line. */
    ScatterSmooth: 'scatterSmooth',
    /** Scatter points connected by a smooth curved line, with a marker on each point. */
    ScatterSmoothMarkers: 'scatterSmoothMarkers',
    /**
     * Scatter points shown as markers only. Alias of `ScatterMarkers`.
     *
     * @deprecated Prefer {@link ChartType.ScatterMarkers}.
     */
    Scatter: 'scatterMarkers',
    // Bubble
    /** A bubble chart where each point's size carries a third value. */
    Bubble: 'bubble',
    /** A bubble chart whose bubbles have a 3-D shaded look. */
    Bubble3D: 'bubble3D',
    // Area
    /** A filled area under a line, one per series. */
    Area: 'area',
    /** Filled areas stacked on top of each other. */
    AreaStacked: 'areaStacked',
    /** Filled areas stacked to 100%, showing each series' share of the total. */
    AreaPercentStacked: 'areaPercentStacked',
    // 3D column / bar
    /** A true 3-D column chart with depth, viewed at an angle. */
    Column3D: 'column3D',
    /** 3-D columns grouped side by side. */
    ColumnClustered3D: 'columnClustered3D',
    /** 3-D columns stacked front to back. */
    ColumnStacked3D: 'columnStacked3D',
    /** 3-D columns stacked to 100%. */
    ColumnPercentStacked3D: 'columnPercentStacked3D',
    /** 3-D horizontal bars grouped side by side. */
    BarClustered3D: 'barClustered3D',
    /**
     * 3-D horizontal bars grouped side by side. Alias of `BarClustered3D`.
     *
     * @deprecated Prefer {@link ChartType.BarClustered3D}.
     */
    Bar3D: 'barClustered3D',
    /** 3-D horizontal bars stacked. */
    BarStacked3D: 'barStacked3D',
    /** 3-D horizontal bars stacked to 100%. */
    BarPercentStacked3D: 'barPercentStacked3D',
    // Other 3D
    /** A line chart drawn with 3-D depth. */
    Line3D: 'line3D',
    /** A pie chart drawn with 3-D depth. */
    Pie3D: 'pie3D',
    /** A 3-D pie chart with the slices pulled slightly apart. */
    PieExploded3D: 'pieExploded3D',
    /** A 3-D area chart with filled sides. */
    Area3D: 'area3D',
    /** A 3-D area chart, stacked. */
    AreaStacked3D: 'areaStacked3D',
    /** A 3-D area chart, stacked to 100%. */
    AreaPercentStacked3D: 'areaPercentStacked3D',
    /** A 3-D surface chart showing values as a continuous landscape. */
    Surface3D: 'surface3D',
    /** Wireframe 3-D surface: the surface drawn as a mesh of lines without color bands. */
    SurfaceNoColor3D: 'surfaceNoColor3D',
    /** Contour: a surface chart seen from above, with color bands for value ranges. */
    SurfaceContour: 'surfaceContour',
    /** Wireframe contour: a top-down surface chart drawn as contour lines without color bands. */
    SurfaceNoColorContour: 'surfaceNoColorContour',
    // Radar
    /** Radar chart: one spoke per category, one line per series. */
    Radar: 'radar',
    /** Radar chart with a marker on each data point. */
    RadarMarkers: 'radarMarkers',
    /** Filled radar chart: the area inside each series line is filled. */
    RadarFilled: 'radarFilled',
    // Stock (series order matters: see each token)
    /** High-Low-Close stock chart. Needs three series in the order High, Low, Close. */
    StockHighLowClose: 'stockHighLowClose',
    /** Open-High-Low-Close stock chart. Needs four series in the order Open, High, Low, Close. */
    StockOpenHighLowClose: 'stockOpenHighLowClose',
    /**
     * Volume-High-Low-Close stock chart. Needs four series in the order
     * Volume, High, Low, Close. Volume is drawn as columns on the primary axis,
     * prices on the secondary axis.
     */
    StockVolumeHighLowClose: 'stockVolumeHighLowClose',
    /**
     * Volume-Open-High-Low-Close stock chart. Needs five series in the order
     * Volume, Open, High, Low, Close. Volume is drawn as columns on the primary
     * axis, prices on the secondary axis.
     */
    StockVolumeOpenHighLowClose: 'stockVolumeOpenHighLowClose',
    // Combination charts
    /**
     * Clustered Column - Line. Every series is a clustered column except the
     * last, which is a line. Override a series with {@link ChartSeries.serieType}.
     */
    ColumnClusteredLine: 'columnClusteredLine',
    /**
     * Clustered Column - Line on Secondary Axis. Like `ColumnClusteredLine`, with
     * the line series plotted on the secondary value axis. Override a series with
     * {@link ChartSeries.usePrimaryAxis}.
     */
    ColumnClusteredLineSecondaryAxis: 'columnClusteredLineSecondaryAxis',
    // Extended layouts (Excel 2016+)
    /** Box-and-whisker statistical chart. */
    BoxAndWhisker: 'boxWhisker',
    /** Funnel chart. */
    Funnel: 'funnel',
    /** Pareto chart (bars plus cumulative line). */
    Pareto: 'paretoLine',
    /** Sunburst hierarchical chart. */
    Sunburst: 'sunburst',
    /** Treemap hierarchical chart. */
    TreeMap: 'treemap',
    /** Waterfall chart. */
    Waterfall: 'waterfall',
    /** Histogram: counts how many values fall into each bin (extended layout). */
    Histogram: 'histogram',
    /** Filled map: regions shaded by value (extended layout; categories are place names). */
    FilledMap: 'regionMap'
};

/**
 * A chart type string (values of the {@link ChartType} object).
 * Prefer `ChartType.*` at call sites. Merged with the `ChartType` const.
 */
// eslint-disable-next-line no-redeclare -- ChartType is both the value object and its value type
export type ChartType = string;

/** Extended layout values on {@link ChartType} (funnel, waterfall, and related). */
export type ChartExLayoutValue =
| typeof ChartType.BoxAndWhisker
| typeof ChartType.Funnel
| typeof ChartType.Pareto
| typeof ChartType.Sunburst
| typeof ChartType.TreeMap
| typeof ChartType.Waterfall
| typeof ChartType.Histogram
| typeof ChartType.FilledMap;

/** Standard chart types only (excludes funnel, waterfall, and other extended layouts). */
export type ClassicChartType = Exclude<ChartType, ChartExLayoutValue>;

/**
 * Where the legend appears on the chart.
 * Use with {@link ChartLegend.position}.
 */
export const LegendPosition: {
    readonly Bottom: string;
    readonly Top: string;
    readonly Left: string;
    readonly Right: string;
    readonly Corner: string;
} = {
    Bottom: 'bottom',
    Top: 'top',
    Left: 'left',
    Right: 'right',
    Corner: 'corner'
};

export type LegendPositionValue = (typeof LegendPosition)[keyof typeof LegendPosition];

/** dml-chart.xsd `ST_LegendPos` enumeration values. */
type OoxmlLegendPos = 'b' | 't' | 'l' | 'r' | 'tr';

const LEGEND_POSITION_TO_OOXML: Record<LegendPositionValue, OoxmlLegendPos> = {
    [LegendPosition.Bottom]: 'b',
    [LegendPosition.Top]: 't',
    [LegendPosition.Left]: 'l',
    [LegendPosition.Right]: 'r',
    [LegendPosition.Corner]: 'tr'
};

const OOXML_LEGEND_POS_TO_API: Record<OoxmlLegendPos, LegendPositionValue> = {
    b: LegendPosition.Bottom,
    t: LegendPosition.Top,
    l: LegendPosition.Left,
    r: LegendPosition.Right,
    tr: LegendPosition.Corner
};

/**
 * legendPositionToOoxml.
 *
 * @param {LegendPositionValue} position - The position parameter.
 * @returns {OoxmlLegendPos} - Returns the result.
 */
function legendPositionToOoxml(position: LegendPositionValue): OoxmlLegendPos {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    const ooxmlPos: OoxmlLegendPos = LEGEND_POSITION_TO_OOXML[position];
    return ooxmlPos != null ? ooxmlPos : 'r';
}

/**
 * legendPositionFromOoxml.
 *
 * @param {string | undefined} raw - The raw parameter.
 * @returns {LegendPositionValue} - Returns the result.
 */
function legendPositionFromOoxml(raw: string | undefined): LegendPositionValue {
    if (raw === undefined) {return LegendPosition.Right; }
    if (raw in LEGEND_POSITION_TO_OOXML) {return raw as LegendPositionValue; }
    if (raw in OOXML_LEGEND_POS_TO_API) {
        return OOXML_LEGEND_POS_TO_API[raw as OoxmlLegendPos];
    }
    return LegendPosition.Right;
}

/**
 * Where data labels sit relative to each point or slice.
 * Use with {@link ChartDataLabels.position}.
 */
export const DataLabelPosition: {
    readonly Center: string;
    readonly InsideBase: string;
    readonly InsideEnd: string;
    readonly OutsideEnd: string;
    readonly BestFit: string;
    readonly Left: string;
    readonly Right: string;
    readonly Top: string;
    readonly Bottom: string;
} = {
    Center: 'center',
    InsideBase: 'insideBase',
    InsideEnd: 'insideEnd',
    OutsideEnd: 'outsideEnd',
    BestFit: 'bestFit',
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom'
};

export type DataLabelPositionValue =
  (typeof DataLabelPosition)[keyof typeof DataLabelPosition];

/** dml-chart.xsd `ST_DLblPos` enumeration values. */
type OoxmlDLblPos =
| 'ctr'
| 'inBase'
| 'inEnd'
| 'outEnd'
| 'bestFit'
| 'l'
| 'r'
| 't'
| 'b';

const DATA_LABEL_POSITION_TO_OOXML: Record<DataLabelPositionValue, OoxmlDLblPos> = {
    [DataLabelPosition.Center]: 'ctr',
    [DataLabelPosition.InsideBase]: 'inBase',
    [DataLabelPosition.InsideEnd]: 'inEnd',
    [DataLabelPosition.OutsideEnd]: 'outEnd',
    [DataLabelPosition.BestFit]: 'bestFit',
    [DataLabelPosition.Left]: 'l',
    [DataLabelPosition.Right]: 'r',
    [DataLabelPosition.Top]: 't',
    [DataLabelPosition.Bottom]: 'b'
};

const OOXML_DLBL_POS_TO_API: Record<OoxmlDLblPos, DataLabelPositionValue> = {
    ctr: DataLabelPosition.Center,
    inBase: DataLabelPosition.InsideBase,
    inEnd: DataLabelPosition.InsideEnd,
    outEnd: DataLabelPosition.OutsideEnd,
    bestFit: DataLabelPosition.BestFit,
    l: DataLabelPosition.Left,
    r: DataLabelPosition.Right,
    t: DataLabelPosition.Top,
    b: DataLabelPosition.Bottom
};

/**
 * dataLabelPositionToOoxml.
 *
 * @param {DataLabelPositionValue} position - The position parameter.
 * @returns {OoxmlDLblPos} - Returns the result.
 */
function dataLabelPositionToOoxml(position: DataLabelPositionValue): OoxmlDLblPos {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    return (DATA_LABEL_POSITION_TO_OOXML[position] != null ? DATA_LABEL_POSITION_TO_OOXML[position] : 'outEnd');
}

/**
 * dataLabelPositionFromOoxml.
 *
 * @param {string | undefined} raw - The raw parameter.
 * @returns {DataLabelPositionValue | undefined} - Returns the result.
 */
function dataLabelPositionFromOoxml(raw: string | undefined): DataLabelPositionValue | undefined {
    if (raw === undefined) {return undefined; }
    if (raw in DATA_LABEL_POSITION_TO_OOXML) {return raw as DataLabelPositionValue; }
    if (raw in OOXML_DLBL_POS_TO_API) {return OOXML_DLBL_POS_TO_API[raw as OoxmlDLblPos]; }
    return undefined;
}

/**
 * Axis tick mark style (none, inside, outside, or crossing the axis).
 * Use with {@link ChartAxis.majorTickMark} / {@link ChartAxis.minorTickMark}.
 */
export const TickMarkType: {
    readonly None: string;
    readonly Inside: string;
    readonly Outside: string;
    readonly Cross: string;
} = {
    None: 'none',
    Inside: 'inside',
    Outside: 'outside',
    Cross: 'cross'
};

export type TickMarkTypeValue = (typeof TickMarkType)[keyof typeof TickMarkType];

type OoxmlTickMark = 'none' | 'in' | 'out' | 'cross';

const TICK_MARK_TO_OOXML: Record<TickMarkTypeValue, OoxmlTickMark> = {
    [TickMarkType.None]: 'none',
    [TickMarkType.Inside]: 'in',
    [TickMarkType.Outside]: 'out',
    [TickMarkType.Cross]: 'cross'
};

const OOXML_TICK_MARK_TO_API: Record<OoxmlTickMark, TickMarkTypeValue> = {
    none: TickMarkType.None,
    in: TickMarkType.Inside,
    out: TickMarkType.Outside,
    cross: TickMarkType.Cross
};

/**
 * tickMarkToOoxml.
 *
 * @param {TickMarkTypeValue} value - The value parameter.
 * @returns {OoxmlTickMark} - Returns the result.
 */
function tickMarkToOoxml(value: TickMarkTypeValue): OoxmlTickMark {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    return (TICK_MARK_TO_OOXML[value] != null ? TICK_MARK_TO_OOXML[value] : 'none');
}

/**
 * tickMarkFromOoxml.
 *
 * @param {string | undefined} raw - The raw parameter.
 * @returns {TickMarkTypeValue | undefined} - Returns the result.
 */
function tickMarkFromOoxml(raw: string | undefined): TickMarkTypeValue | undefined {
    if (raw === undefined) {return undefined; }
    if (raw in TICK_MARK_TO_OOXML) {return raw as TickMarkTypeValue; }
    if (raw in OOXML_TICK_MARK_TO_API) {return OOXML_TICK_MARK_TO_API[raw as OoxmlTickMark]; }
    return undefined;
}

/**
 * Fill mode for chart areas and series: solid color or no fill.
 * Use as `ChartFillType.Solid` / `ChartFillType.None`.
 */
export const ChartFillType: { readonly Solid: string; readonly None: string } = {
    Solid: 'solid',
    None: 'none'
};

/**
 * String values of {@link ChartFillType}. Prefer `ChartFillType.*` at call sites.
 */
export type ChartFillTypeValue = (typeof ChartFillType)[keyof typeof ChartFillType];

/**
 * Fill for a chart area, plot area, legend box, or series.
 * Use {@link ChartFillType.Solid} with `foreColor`, or {@link ChartFillType.None}.
 * Colors are RRGGBB or #RRGGBB. Transparency is 0–100 (0 = fully opaque).
 */
export interface ChartFill {
    type: ChartFillTypeValue;
    foreColor: string | undefined;
    transparency: number | undefined;
}

/**
 * Line or border styling (axis line, series line, frame border).
 * `weightPt` is stroke thickness in points.
 */
export interface ChartLineFormat {
    color: string | undefined;
    weightPt: number | undefined;
}

/**
 * Font styling for chart title, legend text, axis titles, and data labels.
 * `size` is font size in points.
 */
export interface ChartTextArea {
    fontName: string | undefined;
    size: number | undefined;
    bold: boolean;
    italic: boolean;
    color: string | undefined;
}

/**
 * Fill and border for a framed region (chart area, plot area, or legend box).
 */
export interface ChartFrameFormat {
    readonly fill: ChartFill;
    readonly line: ChartLineFormat;
}

/**
 * What each data point shows as a label (value, category, series name, percent)
 * and where the label is placed.
 */
export interface ChartDataLabels {
    isValue: boolean;
    isCategoryName: boolean;
    isSeriesName: boolean;
    isPercentage: boolean;
    position: DataLabelPositionValue | undefined;
    readonly textArea: ChartTextArea;
}

/**
 * Fill and line styling for one series (bars, lines, markers outline, etc.).
 */
export interface ChartSerieFormat {
    readonly fill: ChartFill;
    readonly line: ChartLineFormat;
}

/**
 * Bar/column grouping (dml-chart ST_BarGrouping).
 * `standard` is used for true 3-D Column (`Column3D`); 2-D column/bar use
 * clustered|stacked|percentStacked.
 */
export type BarGrouping = 'clustered' | 'stacked' | 'percentStacked' | 'standard';

/** Area/line grouping (dml-chart ST_Grouping). */
export type AreaGrouping = 'standard' | 'stacked' | 'percentStacked';

/** Scatter style (dml-chart ST_ScatterStyle). */
export type ScatterStyle = 'none' | 'line' | 'lineMarker' | 'marker' | 'smooth' | 'smoothMarker';

/** Of-pie secondary plot type (dml-chart ST_OfPieType). */
export type OfPieType = 'pie' | 'bar';

/**
 * Chart data package relationship state (`c:externalData`).
 * Absent externalData is `none`, never silently `embedded`.
 *
 * Not part of the end-user root surface. DocIO/PPTX and other host products
 * import this type from `@syncfusion/ej2-xlsx/internal/charts`. Public
 * {@link Chart} intentionally omits `dataSource`; host products use
 * `ChartHost` / `getChartDataSource` / `setChartDataSource` on the internal
 * subpath (and the runtime getters/setters on the chart handle).
 */
export type ChartDataSource =
  | { readonly kind: 'embedded'; readonly relationshipId: string }
  | { readonly kind: 'external'; readonly relationshipId: string; readonly target?: string }
  | { readonly kind: 'none' };

/**
 * Optional 3-D camera settings for 3-D chart types (rotation, depth, perspective).
 */
export interface ChartView3D {
    /** Tilt up/down in degrees (−90…90). */
    rotationX?: number;
    /** Spin left/right in degrees (0…360). */
    rotationY?: number;
    /** Relative 3-D height percent (5…500). */
    heightPercent?: number;
    /** Relative 3-D depth percent (20…2000). */
    depthPercent?: number;
    /** When true, axes stay at right angles (isometric-style view). */
    rightAngleAxis?: boolean;
    /** Perspective strength (0…240). */
    perspective?: number;
}

/** Position and size of a chart on the sheet (row/column are 1-based; size is in points). */
export interface ChartAnchor {
    readonly row: number;
    readonly column: number;
    /** Width in points (72 points = 1 inch). */
    readonly width: number;
    /** Height in points (72 points = 1 inch). */
    readonly height: number;
}

/**
 * Data-only descriptor for {@link Worksheet.addChart} when a single range
 * string or category/values pair is not enough (ChartEx hierarchy, cached
 * points, or `isSeriesInRows` with other fields).
 *
 * Presentation (title, legend, name, axes, grouping) is set on the returned
 * {@link Chart} handle after creation. Additional series are added with
 * {@link Chart.addSeries}.
 */
export interface ChartData {
    /**
     * Cell range that holds the chart data, including headers
     * (for example `A1:C4` or `Sheet1!A1:C4`).
     */
    readonly dataRange?: string;
    /**
     * When `true`, each row is a series. Default `false` (each column is a series).
     */
    readonly isSeriesInRows?: boolean;
    /**
     * Category labels formula, or several formulas for hierarchy levels
     * (treemap / sunburst). Extended layouts and single-series classic seed.
     */
    readonly categoryLabels?: string | ReadonlyArray<string>;
    /**
     * Values formula (or size values for treemap / sunburst). Extended layouts
     * and single-series classic seed.
     */
    readonly values?: string;
    /**
     * Category labels as plain strings (no worksheet formula). Extended layouts
     * only. Do not combine with formula {@link categoryLabels} or {@link dataRange}.
     */
    readonly categories?: ReadonlyArray<string> | ReadonlyArray<(ReadonlyArray<string>)>;
    /** Optional display names for cached category levels (extended layouts). */
    readonly categoryNames?: ReadonlyArray<string>;
    /** Numeric values as plain numbers (no formula). Extended layouts only. */
    readonly valuePoints?: ReadonlyArray<number>;
    /** Number format for numeric values on extended layouts (for example `0%`). */
    readonly formatCode?: string;
    /**
     * Histogram only: the width of each bin in value units. Mutually exclusive
     * with {@link binCount}. When neither is set, Excel chooses the bins.
     */
    readonly binWidth?: number;
    /**
     * Histogram only: the number of bins. Mutually exclusive with {@link binWidth}.
     */
    readonly binCount?: number;
}

/**
 * Normalized create-time fields used by classic and ChartEx add paths.
 *
 * @private
 */
interface CreateChartArgs {
    readonly type: ChartType;
    readonly row: number;
    readonly column: number;
    readonly width: number;
    readonly height: number;
    readonly dataRange?: string;
    readonly isSeriesInRows?: boolean;
    readonly categoryLabels?: string | ReadonlyArray<string>;
    readonly values?: string;
    readonly categories?: ReadonlyArray<string> | ReadonlyArray<(ReadonlyArray<string>)>;
    readonly categoryNames?: ReadonlyArray<string>;
    readonly valuePoints?: ReadonlyArray<number>;
    readonly formatCode?: string;
    readonly binWidth?: number;
    readonly binCount?: number;
}

/**
 * isStringArray.
 *
 * @param {unknown} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function isStringArray(value: unknown): value is ReadonlyArray<string> {
    return Array.isArray(value) && value.every((item: any) => typeof item === 'string');
}

/**
 * isChartDataObject.
 *
 * @param {unknown} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function isChartDataObject(value: unknown): value is ChartData {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Expand the public positional addChart arguments into internal create fields.
 *
 * @param {ChartType} type - The type parameter.
 * @param {number} row - The row parameter.
 * @param {number} column - The column parameter.
 * @param {number} width - The width parameter.
 * @param {number} height - The height parameter.
 * @param {string | ReadonlyArray<string> | ChartData} data - The data parameter.
 * @param {string} values - The values parameter.
 * @returns {CreateChartArgs} - Returns the result.
 */
function normalizeCreateChartArgs(
    type: ChartType,
    row: number,
    column: number,
    width: number,
    height: number,
    data: string | ReadonlyArray<string> | ChartData,
    values?: string
): CreateChartArgs {
    if (typeof type !== 'string' || type.length === 0) {
        throw new InvalidArgumentError('addChart type must be a non-empty string');
    }
    if (typeof row !== 'number' || !Number.isFinite(row)) {
        throw new InvalidArgumentError('addChart row must be a finite number');
    }
    if (typeof column !== 'number' || !Number.isFinite(column)) {
        throw new InvalidArgumentError('addChart column must be a finite number');
    }
    if (typeof width !== 'number' || !Number.isFinite(width)) {
        throw new InvalidArgumentError('addChart width must be a finite number');
    }
    if (typeof height !== 'number' || !Number.isFinite(height)) {
        throw new InvalidArgumentError('addChart height must be a finite number');
    }
    if (data === null || data === undefined) {
        throw new InvalidArgumentError('addChart data is required');
    }
    if (values !== undefined && typeof values !== 'string') {
        throw new InvalidArgumentError('addChart values must be a string when provided');
    }

    const base: CreateChartArgs = { type, row, column, width, height };

    if (typeof data === 'string') {
        const trimmed: string = data.trim();
        if (values !== undefined) {
            return {
                ...base,
                categoryLabels: trimmed,
                values: values.trim()
            };
        }
        return {
            ...base,
            ...(trimmed.length > 0 ? { dataRange: trimmed } : {})
        };
    }

    if (isStringArray(data)) {
        if (values === undefined) {
            throw new InvalidArgumentError(
                'addChart values is required when data is category-label formula(s)'
            );
        }
        return {
            ...base,
            categoryLabels: data,
            values: values.trim()
        };
    }

    if (isChartDataObject(data)) {
        if (values !== undefined && data.values !== undefined && values !== data.values) {
            throw new InvalidArgumentError(
                'addChart values argument conflicts with ChartData.values'
            );
        }
        const resolvedValues: string =
      values !== undefined ? values.trim() : data.values !== undefined ? String(data.values) : undefined;
        const dataRangeRaw: string =
      data.dataRange === undefined ? undefined : String(data.dataRange).trim();
        return {
            ...base,
            ...(dataRangeRaw !== undefined && dataRangeRaw.length > 0 ? { dataRange: dataRangeRaw } : {}),
            ...(data.isSeriesInRows !== undefined ? { isSeriesInRows: data.isSeriesInRows } : {}),
            ...(data.categoryLabels !== undefined ? { categoryLabels: data.categoryLabels } : {}),
            ...(resolvedValues !== undefined ? { values: resolvedValues } : {}),
            ...(data.categories !== undefined ? { categories: data.categories } : {}),
            ...(data.categoryNames !== undefined ? { categoryNames: data.categoryNames } : {}),
            ...(data.valuePoints !== undefined ? { valuePoints: data.valuePoints } : {}),
            ...(data.formatCode !== undefined ? { formatCode: data.formatCode } : {}),
            ...(data.binWidth !== undefined ? { binWidth: data.binWidth } : {}),
            ...(data.binCount !== undefined ? { binCount: data.binCount } : {})
        };
    }

    throw new InvalidArgumentError(
        'addChart data must be a range string, category-label formula(s), or ChartData'
    );
}

/** One series on a chart after it has been created (title, values, format, labels). */
export interface ChartSeries {
/** Series name in the legend. */
    title: string | undefined;
    /** Category / X labels formula. */
    categoryLabels: string | undefined;
    /** Values / Y formula. */
    values: string;
    /**
     * Bubble-size formula for bubble charts.
     * When omitted, Excel uses default sizes.
     */
    bubbleSizes: string | undefined;
    /**
     * Whether this bubble series uses a 3-D bubble look.
     * Defaults to `true` for {@link ChartType.Bubble3D}, otherwise `false`.
     */
    bubbleSize3D: boolean;
    /**
     * How far pie/doughnut slices pull out from the center (0–400 percent).
     * Overrides the default for exploded doughnut/pie types when set.
     */
    explodePercent: number | undefined;
    /**
     * The chart type this series is drawn as. Defaults to the chart's {@link Chart.type}
     * (for the combination types, column for every series except the last, which is a
     * line). Set a different 2-D column, line or area type to turn the chart into a
     * combination chart; set `undefined` to go back to the default.
     */
    serieType: ChartType | undefined;
    /**
     * Whether this series uses the primary value axis (`true`) or the secondary value
     * axis (`false`). Defaults to `true`, except for the line series of
     * {@link ChartType.ColumnClusteredLineSecondaryAxis}. At least one series must stay
     * on the primary axis.
     */
    usePrimaryAxis: boolean;
    /** Fill and line styling for this series. */
    readonly serieFormat: ChartSerieFormat;
    /** Data labels for this series. */
    readonly dataLabels: ChartDataLabels;
}

/** Category or value axis: title, scale, gridlines, ticks, and line style. */
export interface ChartAxis {
/** Axis title text. */
    title: string | undefined;
    /**
     * Whether the axis is drawn. Defaults to `true` on create; set `false` to
     * hide (`c:delete`). Load/parse follows package truth.
     */
    visible: boolean;
    /**
     * Major gridlines across the plot area. Defaults to `true` on create; set
     * `false` to hide. Load/parse follows package truth. Pie/doughnut plots omit
     * axes on the wire regardless of this flag.
     */
    hasMajorGridLines: boolean;
    /**
     * Minor gridlines across the plot area. Defaults to `false` on create
     * (Excel-like); set `true` to show.
     */
    hasMinorGridLines: boolean;
    /** Number format for tick labels (for example `#,##0` or `0%`). */
    numberFormat: string | undefined;
    /** Fixed axis minimum; omit to let Excel auto-scale. */
    minimumValue: number | undefined;
    /** Fixed axis maximum; omit to let Excel auto-scale. */
    maximumValue: number | undefined;
    /** Major tick mark style ({@link TickMarkType}). */
    majorTickMark: TickMarkTypeValue;
    /** Minor tick mark style ({@link TickMarkType}). */
    minorTickMark: TickMarkTypeValue;
    /** Axis line color and thickness. */
    readonly line: ChartLineFormat;
    /** Font styling for the axis title. */
    readonly titleArea: ChartTextArea;
}

/** Legend: placement, text styling, and box fill/border. */
export interface ChartLegend {
    /** Where the legend appears ({@link LegendPosition}). */
    position: LegendPositionValue;
    /** Font styling for legend entries. */
    readonly textArea: ChartTextArea;
    /** Legend box fill and border. */
    readonly frameFormat: ChartFrameFormat;
}

/**
 * Live chart on a worksheet. Returned by {@link Worksheet.addChart}.
 * Change type, data, axes, legend, and formatting, then save the workbook.
 */
export interface Chart {
    /**
     * Chart layout ({@link ChartType}). Do not switch between a standard chart
     * and an extended layout (funnel, waterfall, …) on the same instance —
     * create a new chart instead.
     */
    type: ChartType;
    /**
     * Which format this chart uses internally:
     * - `'classic'` — standard Excel charts (column, line, pie, …)
     * - `'chartex'` — extended layouts (funnel, waterfall, treemap, …)
     */
    readonly engine: 'classic' | 'chartex';
    /** Optional name for the chart object. */
    name: string;
    /**
     * Chart title text. New charts default to an empty title with
     * {@link hasTitle} enabled; set text or set `hasTitle = false` to hide.
     */
    chartTitle: string | undefined;
    /**
     * Whether the title is shown. Defaults to `true` on create (with empty
     * {@link chartTitle}); set `false` to hide. Load/parse follows package truth.
     */
    hasTitle: boolean;
    /** Font styling for the chart title. */
    readonly chartTitleArea: ChartTextArea;
    /** Outer chart border and background fill. */
    readonly chartArea: ChartFrameFormat;
    /** Plot area (the region that holds series) fill and border. */
    readonly plotArea: ChartFrameFormat;
    /**
     * Source data range (A1 style). Setting a non-empty range rebuilds series
     * from that range.
     */
    dataRange: string | undefined;
    /** When `true`, series come from rows; otherwise from columns. */
    isSeriesInRows: boolean;
    /** Stacking style when not fully encoded by {@link type}. */
    grouping: BarGrouping | AreaGrouping | undefined;
    /** Scatter marker/line style when not fully encoded by {@link type}. */
    scatterStyle: ScatterStyle | undefined;
    /** 3-D view settings for 3-D chart types. */
    view3D: ChartView3D | undefined;
    // Host-only `dataSource` is NOT declared on the public Chart interface.
    // Runtime ChartHandle still implements get/set; hosts use ChartHost /
    // getChartDataSource / setChartDataSource from the internal charts subpath.
    // A public `@private dataSource` member poisons stripInternal emit of host types.
    /**
     * The row the chart's top edge is anchored to — 1-based, like Excel
     * rows. Setting `row` snaps the top edge to the row boundary (zero rowOff).
     */
    row: number;
    /**
     * The column the chart's left edge is anchored to — 1-based, like
     * Excel columns (1 = A). Setting `column` snaps the left edge to the
     * column boundary (zero colOff).
     */
    column: number;
    /**
     * Absolute distance in points from the top of the sheet (row 1) to the
     * top edge of the chart (XlsIO `IShape.Top`). Setting `top` rewrites
     * `row` and DrawingML `xdr:rowOff` from live row heights (Excel-like
     * defaults when heights are unset).
     */
    top: number;
    /**
     * Absolute distance in points from the left of the sheet (column A) to
     * the left edge of the chart (XlsIO `IShape.Left`). Setting `left`
     * rewrites `column` and `xdr:colOff` from live column widths.
     */
    left: number;
    /** Width in points (72 points = 1 inch). */
    width: number;
    /** Height in points (72 points = 1 inch). */
    height: number;
    /**
     * Whether the legend is shown. Defaults to `true` on create; set `false`
     * to hide. Load/parse follows package truth.
     */
    hasLegend: boolean;
    /** Legend handle (position, text, frame). */
    readonly legend: ChartLegend;
    /**
     * When `true`, show a data table under the plot.
     * Excel may ignore this on pure pie/doughnut charts.
     */
    hasDataTable: boolean;
    /**
     * For stock charts (High-Low-Close, Open-High-Low-Close, Volume-High-Low-Close,
     * Volume-Open-High-Low-Close): controls whether High-Low vertical lines that connect
     * the high and low values are displayed with styling. Defaults to `true` to match
     * Microsoft Excel's rendering. When `false`, High-Low lines are omitted from the chart.
     * Has no effect on non-stock chart types.
     */
    hasHighLowLines: boolean;
    /**
     * High-Low Line formatting (color and weight) for stock charts only.
     * Returns `undefined` for non-stock chart types.
     * Modifying properties directly changes the chart model: `chart.highLowLines.color = '0000FF'`.
     * Only applies when `hasHighLowLines` is `true`.
     */
    readonly highLowLines: ChartLineFormat | undefined;
    /** Primary category (X) axis. */
    readonly primaryCategoryAxis: ChartAxis;
    /** Primary value (Y) axis. */
    readonly primaryValueAxis: ChartAxis;
    /**
     * Secondary category (X) axis, used by series with {@link ChartSeries.usePrimaryAxis}
     * `false` and by the price series of the volume stock charts. Hidden by default.
     */
    readonly secondaryCategoryAxis: ChartAxis;
    /**
     * Secondary value (Y) axis, drawn on the right. Used by series with
     * {@link ChartSeries.usePrimaryAxis} `false` and by the price series of the
     * volume stock charts.
     */
    readonly secondaryValueAxis: ChartAxis;
    /** Series currently on the chart (read-only array; mutate items in place). */
    readonly series: ReadonlyArray<ChartSeries>;
    /** Append a series; optional legend title. */
    addSeries(title?: string): ChartSeries;
    /** Remove a series by handle or 0-based index. */
    removeSeries(target: ChartSeries | number): void;
    /** Deep copy of this chart (not yet attached to another sheet). */
    clone(): Chart;
}

export interface ChartsHost {
    markDirty(): void;
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
    /** Worksheet name for sheet-qualified series formulas. */
    readonly sheetName?: string;
    /** 1-based row height in points; 0 = unset → placement default. */
    getRowHeightPt?(row: number): number;
    /** 1-based column width in OOXML character units; 0 = unset. */
    getColumnWidthChars?(column: number): number;
}

export interface ChartsMaterializeResult {
    readonly drawingRel: OpcRelationship | undefined;
    readonly drawingRelationshipId: string | undefined;
    readonly ownsDrawingElement: boolean;
}

interface FillModel {
    type: ChartFillTypeValue;
    foreColor?: string;
    transparency?: number;
}

interface LineModel {
    color?: string;
    weightPt?: number;
}

interface TextAreaModel {
    fontName?: string;
    size?: number;
    bold: boolean;
    italic: boolean;
    color?: string;
}

interface FrameModel {
    fill: FillModel;
    line: LineModel;
}

interface DataLabelsModel {
    isValue: boolean;
    isCategoryName: boolean;
    isSeriesName: boolean;
    isPercentage: boolean;
    position?: DataLabelPositionValue;
    textArea: TextAreaModel;
}

/**
 * Series payload for model storage and host serialize helpers.
 * `serieFormat` / `dataLabels` are optional on input; serialize paths call
 * {@link ensureSeriesFormat} so bare `{ title, values, categoryLabels }` is valid.
 */
interface SeriesModel {
    /** Series title: cell reference (e.g., "Sheet1!$B$1"), plain text, or undefined. */
    title?: string;
    /**
     * Series title formula/reference preserved from loading (`c:tx/c:strRef/c:f`).
     * When present, takes priority over {@link title} during serialization.
     * This ensures round-trip preservation of formula references in charts.
     *
     * Example: When a chart is loaded with `<c:tx><c:strRef><c:f>Sheet1!$B$1</c:f>...`,
     * {@link titleFormula} captures "Sheet1!$B$1" and {@link title} captures the evaluated
     * value or cached text. On save, the formula is emitted, not the value.
     */
    titleFormula?: string;
    categoryLabels?: string;
    values: string;
    /** Bubble-size formula (`c:bubbleSize/c:numRef/c:f`); bubble charts only. */
    bubbleSizes?: string;
    /** Per-series 3-D bubble effect (`c:bubble3D`). */
    bubbleSize3D?: boolean;
    explodePercent?: number;
    /** Per-series chart type override (combination charts). */
    serieType?: ChartType;
    /** `false` plots the series on the secondary value axis. */
    usePrimaryAxis?: boolean;
    serieFormat?: FrameModel;
    dataLabels?: DataLabelsModel;
}

interface AxisModel {
    title?: string;
    visible: boolean;
    hasMajorGridLines: boolean;
    hasMinorGridLines: boolean;
    numberFormat?: string;
    minimumValue?: number;
    maximumValue?: number;
    majorTickMark: TickMarkTypeValue;
    minorTickMark: TickMarkTypeValue;
    line: LineModel;
    titleArea: TextAreaModel;
}

interface ChartEntry {
    id: number;
    /**
     * Classic DrawingML type or ChartEx layoutId. When {@link engine} is
     * `'chartex'`, {@link chartEx} holds the serialized model and classic plot
     * fields are placeholders.
     */
    type: ChartType;
    /** Package/serializer engine. Default classic when omitted (loaded charts). */
    engine?: 'classic' | 'chartex';
    /** ChartEx model when {@link engine} is `'chartex'`. */
    chartEx?: ChartEx;
    name: string;
    chartTitle?: string;
    hasTitle: boolean;
    chartTitleArea: TextAreaModel;
    chartArea: FrameModel;
    plotArea: FrameModel;
    dataRange?: string;
    isSeriesInRows: boolean;
    grouping?: BarGrouping | AreaGrouping;
    scatterStyle?: ScatterStyle;
    view3D?: ChartView3D;
    dataSource: ChartDataSource;
    series: SeriesModel[];
    row: number;
    column: number;
    /** Offset below the top of row, DrawingML xdr:rowOff EMU. */
    rowOffEmu: number;
    /** Offset right of the left of column, DrawingML xdr:colOff EMU. */
    colOffEmu: number;
    widthEmu: number;
    heightEmu: number;
    hasLegend: boolean;
    legendPosition: LegendPositionValue;
    legendTextArea: TextAreaModel;
    legendFrame: FrameModel;
    hasDataTable: boolean;
    /**
     * For stock charts (HLC, OHLC, VHLC, VOHLC): whether to display styled High-Low lines.
     * When true or undefined (default), emits `<c:hiLowLines>` with `<c:spPr>` styling.
     * When false, emits empty `<c:hiLowLines/>` (no styling, not displayed).
     * Has no effect on non-stock chart types.
     */
    hasHighLowLines?: boolean;
    /**
     * High-Low Line formatting model (color and weight).
     * Only used when stock chart and hasHighLowLines is true.
     * When undefined, uses default (black, 0.75pt) for backward compatibility.
     */
    highLowLinesFormat?: LineModel;
    categoryAxis: AxisModel;
    valueAxis: AxisModel;
    /** Secondary category axis; created on first access or when parsed from a file. */
    secondaryCategoryAxis?: AxisModel;
    /** Secondary value axis; created on first access or when parsed from a file. */
    secondaryValueAxis?: AxisModel;
    /** Drawing → chart part relationship id once materialized. */
    relId?: string;
    /** Package part name for the chart / chartEx part once allocated. */
    chartPartName?: string;
    /** Opaque foreign chartSpace body when parsed with unknown structure. */
    preservedChartXml?: string;
}

/**
 * isChartExEntry.
 *
 * @param {ChartEntry} entry - The entry parameter.
 * @returns {boolean} - Returns the result.
 */
function isChartExEntry(entry: ChartEntry): boolean {
    return (
        entry.engine === 'chartex' ||
    entry.chartEx !== undefined ||
    isChartExType(entry.type)
    );
}

const DEFAULT_FILL: () => FillModel = (): FillModel => ({
    type: ChartFillType.Solid
});

const DEFAULT_LINE: () => LineModel = (): LineModel => ({});

const DEFAULT_TEXT_AREA: () => TextAreaModel = (): TextAreaModel => ({
    bold: false,
    italic: false
});

const DEFAULT_FRAME: () => FrameModel = (): FrameModel => ({
    fill: DEFAULT_FILL(),
    line: DEFAULT_LINE()
});

const DEFAULT_DATA_LABELS: () => DataLabelsModel = (): DataLabelsModel => ({
    isValue: false,
    isCategoryName: false,
    isSeriesName: false,
    isPercentage: false,
    textArea: DEFAULT_TEXT_AREA()
});

const DEFAULT_AXIS: () => AxisModel = (): AxisModel => ({
    visible: true,
    // Primary category axis: no gridlines by default (matches Microsoft Excel).
    hasMajorGridLines: false,
    hasMinorGridLines: false,
    majorTickMark: TickMarkType.Outside,
    minorTickMark: TickMarkType.None,
    line: { color: '000000', weightPt: 0.75 },
    titleArea: DEFAULT_TEXT_AREA()
});

/**
 * Primary value (Y) axis default: major gridlines on by default for newly
 * authored charts (Excel-like). Load/parse still reflects file truth; callers
 * may set false to hide.
 *
 * @returns {AxisModel} - Returns the result.
 */
const DEFAULT_VALUE_AXIS: () => AxisModel = (): AxisModel => ({
    ...DEFAULT_AXIS(),
    hasMajorGridLines: true
});

/**
 * Secondary category axis default: not drawn (Excel hides it) and no gridlines.
 *
 * @returns {AxisModel} - Returns the result.
 */
const DEFAULT_SECONDARY_CATEGORY_AXIS: () => AxisModel = (): AxisModel => ({
    ...DEFAULT_AXIS(),
    visible: false,
    hasMajorGridLines: false
});

/**
 * Secondary value axis default: drawn on the right, no gridlines.
 *
 * @returns {AxisModel} - Returns the result.
 */
const DEFAULT_SECONDARY_VALUE_AXIS: () => AxisModel = (): AxisModel => ({
    ...DEFAULT_AXIS(),
    hasMajorGridLines: false
});

/**
 * cloneFill.
 *
 * @param {FillModel} src - The src parameter.
 * @returns {FillModel} - Returns the result.
 */
function cloneFill(src: FillModel): FillModel {
    return {
        type: src.type,
        ...(src.foreColor !== undefined ? { foreColor: src.foreColor } : {}),
        ...(src.transparency !== undefined ? { transparency: src.transparency } : {})
    };
}

/**
 * cloneLine.
 *
 * @param {LineModel} src - The src parameter.
 * @returns {LineModel} - Returns the result.
 */
function cloneLine(src: LineModel): LineModel {
    return {
        ...(src.color !== undefined ? { color: src.color } : {}),
        ...(src.weightPt !== undefined ? { weightPt: src.weightPt } : {})
    };
}

/**
 * cloneTextArea.
 *
 * @param {TextAreaModel} src - The src parameter.
 * @returns {TextAreaModel} - Returns the result.
 */
function cloneTextArea(src: TextAreaModel): TextAreaModel {
    return {
        ...(src.fontName !== undefined ? { fontName: src.fontName } : {}),
        ...(src.size !== undefined ? { size: src.size } : {}),
        bold: src.bold,
        italic: src.italic,
        ...(src.color !== undefined ? { color: src.color } : {})
    };
}

/**
 * cloneFrame.
 *
 * @param {FrameModel} src - The src parameter.
 * @returns {FrameModel} - Returns the result.
 */
function cloneFrame(src: FrameModel): FrameModel {
    return { fill: cloneFill(src.fill), line: cloneLine(src.line) };
}

/**
 * cloneDataLabels.
 *
 * @param {DataLabelsModel} src - The src parameter.
 * @returns {DataLabelsModel} - Returns the result.
 */
function cloneDataLabels(src: DataLabelsModel): DataLabelsModel {
    return {
        isValue: src.isValue,
        isCategoryName: src.isCategoryName,
        isSeriesName: src.isSeriesName,
        isPercentage: src.isPercentage,
        ...(src.position !== undefined ? { position: src.position } : {}),
        textArea: cloneTextArea(src.textArea)
    };
}

/**
 * cloneAxis.
 *
 * @param {AxisModel} src - The src parameter.
 * @returns {AxisModel} - Returns the result.
 */
function cloneAxis(src: AxisModel): AxisModel {
    return {
        ...(src.title !== undefined ? { title: src.title } : {}),
        visible: src.visible,
        hasMajorGridLines: src.hasMajorGridLines,
        hasMinorGridLines: src.hasMinorGridLines,
        ...(src.numberFormat !== undefined ? { numberFormat: src.numberFormat } : {}),
        ...(src.minimumValue !== undefined ? { minimumValue: src.minimumValue } : {}),
        ...(src.maximumValue !== undefined ? { maximumValue: src.maximumValue } : {}),
        majorTickMark: src.majorTickMark,
        minorTickMark: src.minorTickMark,
        line: cloneLine(src.line),
        titleArea: cloneTextArea(src.titleArea)
    };
}

/**
 * cloneSeriesModel.
 *
 * @param {SeriesModel} src - The src parameter.
 * @returns {SeriesModel} - Returns the result.
 */
function cloneSeriesModel(src: SeriesModel): SeriesModel {
    const normalized: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(src);
    return {
        ...(normalized.title !== undefined ? { title: normalized.title } : {}),
        ...(normalized.categoryLabels !== undefined
            ? { categoryLabels: normalized.categoryLabels }
            : {}),
        values: normalized.values,
        ...(normalized.bubbleSizes !== undefined
            ? { bubbleSizes: normalized.bubbleSizes }
            : {}),
        ...(normalized.bubbleSize3D !== undefined
            ? { bubbleSize3D: normalized.bubbleSize3D }
            : {}),
        ...(normalized.explodePercent !== undefined
            ? { explodePercent: normalized.explodePercent }
            : {}),
        ...(normalized.serieType !== undefined ? { serieType: normalized.serieType } : {}),
        ...(normalized.usePrimaryAxis !== undefined ? { usePrimaryAxis: normalized.usePrimaryAxis } : {}),
        serieFormat: cloneFrame(normalized.serieFormat),
        dataLabels: cloneDataLabels(normalized.dataLabels)
    };
}

/**
 * Ensure nested format objects exist (load/derive/host serialize may omit them).
 *
 * @param {SeriesModel} s - The s parameter.
 * @returns {SeriesModel} - Returns the result.
 */
function ensureSeriesFormat(
    s: SeriesModel
): SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel } {
    if (s.serieFormat === undefined) {s.serieFormat = DEFAULT_FRAME(); }
    if (s.dataLabels === undefined) {s.dataLabels = DEFAULT_DATA_LABELS(); }
    return s as SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel };
}

/**
 * ensureAxisFormat.
 *
 * @param {AxisModel} ax - The ax parameter.
 * @returns {AxisModel} - Returns the result.
 */
function ensureAxisFormat(ax: AxisModel): AxisModel {
    if (ax.majorTickMark === undefined) {ax.majorTickMark = TickMarkType.Outside; }
    if (ax.minorTickMark === undefined) {ax.minorTickMark = TickMarkType.None; }
    if (ax.line === undefined) {ax.line = DEFAULT_LINE(); }
    if (ax.titleArea === undefined) {ax.titleArea = DEFAULT_TEXT_AREA(); }
    return ax;
}

/** Internal plot family used by serialize/parse type mapping. */
interface PlotKind {
    readonly family:
    | 'bar'
    | 'bar3d'
    | 'line'
    | 'line3d'
    | 'area'
    | 'area3d'
    | 'pie'
    | 'pie3d'
    | 'doughnut'
    | 'ofPie'
    | 'scatter'
    | 'bubble'
    | 'surface3d'
    | 'surface'
    | 'radar'
    | 'stock'
    | 'combo';
    readonly barDir?: 'col' | 'bar';
    readonly barGrouping?: BarGrouping;
    readonly areaGrouping?: AreaGrouping;
    readonly scatterStyle?: ScatterStyle;
    /** Line with markers (`c:lineChart/c:marker`). */
    readonly showMarkers?: boolean;
    /** Of-pie secondary type (`c:ofPieType`). */
    readonly ofPieType?: OfPieType;
    /** Doughnut hole size percent (1–90); default 50 when family is doughnut. */
    readonly holeSize?: number;
    /** Slice explosion percent for exploded doughnut/pie series. */
    readonly explosion?: number;
    /** Surface charts: draw as a wireframe mesh instead of color bands (`c:wireframe`). */
    readonly wireframe?: boolean;
    /** Radar charts: `c:radarStyle`. */
    readonly radarStyle?: RadarStyle;
    /** Stock charts: which series layout the chart expects. */
    readonly stock?: StockLayout;
}

/** Radar style (dml-chart ST_RadarStyle). */
type RadarStyle = 'standard' | 'marker' | 'filled';

/** Stock chart series layouts: High-Low-Close, Open-High-Low-Close, plus a leading Volume series. */
type StockLayout = 'hlc' | 'ohlc' | 'vhlc' | 'vohlc';

// eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
const CHART_TYPE_VALUES: Set<string> = new Set<string>(Object.keys(ChartType).map((k: string) => (ChartType as any)[k]));

const BAR_GROUPINGS: Set<string> = new Set<string>(['clustered', 'stacked', 'percentStacked', 'standard']);
const AREA_GROUPINGS: Set<string> = new Set<string>(['standard', 'stacked', 'percentStacked']);
const SCATTER_STYLES: Set<string> = new Set<string>([
    'none',
    'line',
    'lineMarker',
    'marker',
    'smooth',
    'smoothMarker'
]);
// eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
const LEGEND_POSITIONS: Set<string> = new Set<string>(Object.keys(LegendPosition).map((k: string) => (LegendPosition as any)[k]));
// eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
const DATA_LABEL_POSITIONS: Set<string> = new Set<string>(Object.keys(DataLabelPosition).map((k: string) => (DataLabelPosition as any)[k]));
// eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
const TICK_MARK_TYPES: Set<string> = new Set<string>(Object.keys(TickMarkType).map((k: string) => (TickMarkType as any)[k]));

/** Default doughnut hole size percent (`c:holeSize`); XlsIO/Excel common default. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DOUGHNUT_HOLE_SIZE: 50 = 50;
/** Default slice explosion percent for exploded doughnut (`c:explosion`). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_DOUGHNUT_EXPLOSION: 25 = 25;

/**
 * Normalize chart color to uppercase RRGGBB.
 * Accepts RRGGBB, #RRGGBB, or AARRGGBB/#AARRGGBB (alpha stripped).
 * Empty/undefined clears; invalid throws.
 *
 * @param {string | undefined | null} value - The value parameter.
 * @returns {string | undefined} - Returns the result.
 */
function normalizeChartColor(value: string | undefined | null): string | undefined {
    if (value === undefined || value === null || String(value).trim() === '') {
        return undefined;
    }
    let s: string = String(value).trim();
    if (s.startsWith('#')) {s = s.slice(1); }
    if (s.length === 8 && /^[0-9a-fA-F]{8}$/.test(s)) {
        s = s.slice(2);
    }
    if (!/^[0-9a-fA-F]{6}$/.test(s)) {
        throw new InvalidChartError('Color must be RRGGBB or #RRGGBB (optional AARRGGBB)');
    }
    return s.toUpperCase();
}

/**
 * resolveTickMark.
 *
 * @param {TickMarkTypeValue | undefined} value - The value parameter.
 * @param {TickMarkTypeValue} fallback - The fallback parameter.
 * @returns {TickMarkTypeValue} - Returns the result.
 */
function resolveTickMark(
    value: TickMarkTypeValue | undefined,
    fallback: TickMarkTypeValue
): TickMarkTypeValue {
    if (value === undefined) {return fallback; }
    if (!TICK_MARK_TYPES.has(value)) {
        throw new InvalidChartError(
            `Invalid tick mark "${String(value)}"; expected none|inside|outside|cross`
        );
    }
    return value;
}

/**
 * resolveDataLabelPosition.
 *
 * @param {DataLabelPositionValue} value - The value parameter.
 * @returns {DataLabelPositionValue} - Returns the result.
 */
function resolveDataLabelPosition(value: DataLabelPositionValue): DataLabelPositionValue {
    if (!DATA_LABEL_POSITIONS.has(value)) {
        throw new InvalidChartError(
            `Invalid data label position "${String(value)}"; expected a DataLabelPosition token`
        );
    }
    return value;
}

export class ChartsImpl {
    private readonly entries: ChartEntry[] = [];
    private readonly handles: Map<ChartEntry, ChartHandle> = new Map<ChartEntry, ChartHandle>();
    private host: ChartsHost | undefined;
    private drawingPartName: string | undefined;
    private drawingRelId: string | undefined;
    private dirty: boolean = false;
    private nextId: number = 2;
    private nextName: number = 1;

    public bindHost(host: ChartsHost): void {
        this.host = host;
    }

    public loadFromPackage(pkg: OpcPackage, sheetPartName: string | undefined): void {
        this.entries.length = 0;
        this.handles.clear();
        this.drawingPartName = undefined;
        this.drawingRelId = undefined;
        this.dirty = false;
        this.nextId = 2;
        this.nextName = 1;
        if (sheetPartName === undefined) {return; }
        const drawingRel: OpcRelationship = pkg
            .getRelationships(sheetPartName)
            .find((r: OpcRelationship) => isDrawingRelationshipType(r.type));
        if (drawingRel === undefined) {return; }
        this.drawingRelId = drawingRel.id;
        this.drawingPartName = normalizePartName(drawingRel.resolvedTarget);
        const part: OpcPart = pkg.getPart(this.drawingPartName);
        if (part === undefined) {return; }
        const drawingRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(this.drawingPartName);
        for (const anchor of extractAnchors(decodeUtf8(part.data))) {
            if (!isChartGraphicFrameAnchor(anchor)) {continue; }
            const id: number = numberAttr(anchor, 'cNvPr', 'id');
            // Relationship attribute may be r:id or a writer-chosen prefix for the same
            // relationships namespace (e.g. p7:id), as emitted by some XlsIO packages.
            const chartRelId: string = chartRelationshipIdFromAnchor(anchor);
            if (id === undefined || chartRelId === undefined) {continue; }
            const chartRel: OpcRelationship = drawingRels.find(
                (r: OpcRelationship) => r.id === chartRelId && isChartRelationshipType(r.type)
            );
            if (chartRel === undefined) {continue; }
            const chartPart: OpcPart = pkg.getPart(chartRel.resolvedTarget);
            if (chartPart === undefined) {continue; }
            const chartXml: string = decodeUtf8(chartPart.data);
            const parsed: ParsedChartSpace = parseChartSpace(chartXml, pkg, chartRel.resolvedTarget);
            if (parsed === undefined) {continue; }
            const geometry: ChartAnchorGeometry = parseChartAnchorGeometry(anchor, this.sheetMetrics());
            if (geometry === undefined) {continue; }
            const name: string = ((__t: string) => __t != null ? __t : `Chart ${this.nextName}`)(attribute(anchor, 'cNvPr', 'name') != null ? attribute(anchor, 'cNvPr', 'name') : parsed.name);
            const entry: ChartEntry = {
                id,
                relId: chartRelId,
                chartPartName: chartRel.resolvedTarget,
                type: parsed.type,
                name,
                ...(parsed.chartTitle !== undefined ? { chartTitle: parsed.chartTitle } : {}),
                hasTitle: parsed.hasTitle,
                chartTitleArea: cloneTextArea(parsed.chartTitleArea),
                chartArea: cloneFrame(parsed.chartArea),
                plotArea: cloneFrame(parsed.plotArea),
                ...(parsed.dataRange !== undefined ? { dataRange: parsed.dataRange } : {}),
                isSeriesInRows: parsed.isSeriesInRows === true,
                ...(parsed.grouping !== undefined ? { grouping: parsed.grouping } : {}),
                ...(parsed.scatterStyle !== undefined ? { scatterStyle: parsed.scatterStyle } : {}),
                ...(parsed.view3D !== undefined ? { view3D: parsed.view3D } : {}),
                dataSource: parsed.dataSource,
                series: parsed.series.map((s: SeriesModel) => cloneSeriesModel(ensureSeriesFormat(s))),
                row: geometry.row,
                column: geometry.column,
                colOffEmu: geometry.colOffEmu,
                rowOffEmu: geometry.rowOffEmu,
                widthEmu: geometry.widthEmu,
                heightEmu: geometry.heightEmu,
                hasLegend: parsed.hasLegend,
                legendPosition: parsed.legendPosition,
                legendTextArea: cloneTextArea(parsed.legendTextArea),
                legendFrame: cloneFrame(parsed.legendFrame),
                hasDataTable: parsed.hasDataTable,
                categoryAxis: cloneAxis(ensureAxisFormat(parsed.categoryAxis)),
                valueAxis: cloneAxis(ensureAxisFormat(parsed.valueAxis)),
                ...(parsed.secondaryCategoryAxis !== undefined
                    ? { secondaryCategoryAxis: cloneAxis(ensureAxisFormat(parsed.secondaryCategoryAxis)) }
                    : {}),
                ...(parsed.secondaryValueAxis !== undefined
                    ? { secondaryValueAxis: cloneAxis(ensureAxisFormat(parsed.secondaryValueAxis)) }
                    : {}),
                ...(parsed.preservedChartXml !== undefined
                    ? { preservedChartXml: parsed.preservedChartXml }
                    : {})
            };
            this.entries.push(entry);
            this.nextId = Math.max(this.nextId, id + 1);
            this.nextName = Math.max(this.nextName, trailingNumber(name) + 1);
        }
    }

    public get charts(): ReadonlyArray<Chart> {
        return this.entries.map((entry: ChartEntry) => this.handleFor(entry));
    }

    /**
     * Add a chart with positional geometry and a data argument.
     *
     *   {@link ChartData} for ChartEx cached points / mixed fields. Pass `''`
     *   to create an empty chart and add series with {@link Chart.addSeries}.
     *
     * @param {ChartType} type - The type parameter.
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string | ReadonlyArray<string> | ChartData} data - The data parameter.
     * @param {string} values - The values parameter.
     * @returns {Chart} - Returns the result.
     */
    public add(
        type: ChartType,
        row: number,
        column: number,
        width: number,
        height: number,
        data: string | ReadonlyArray<string> | ChartData,
        values?: string
    ): Chart {
        const options: CreateChartArgs = normalizeCreateChartArgs(type, row, column, width, height, data, values);
        requirePositivePoints(options.width, 'width');
        requirePositivePoints(options.height, 'height');

        if (isChartExType(options.type)) {
            return this.addChartEx(options, options.type as ChartExLayoutToken);
        }
        if (!isClassicChartType(options.type)) {
            throw new InvalidChartError(`Unknown chart type "${String(options.type)}"`);
        }
        return this.addClassic(options, options.type);
    }

    private addChartEx(options: CreateChartArgs, type: ChartExLayoutToken): Chart {
        const isSeriesInRows: boolean = options.isSeriesInRows === true;
        const dataRangeRaw: string =
      options.dataRange === undefined ? undefined : String(options.dataRange).trim();
        const dataRange: string =
      dataRangeRaw !== undefined && dataRangeRaw.length > 0 ? dataRangeRaw : undefined;

        const categoryLabels: string | ReadonlyArray<string> = options.categoryLabels;
        const values: string = options.values;

        const chartEx: ChartEx = createChartEx({
            type,
            ...(categoryLabels !== undefined ? { categoryLabels } : {}),
            ...(values !== undefined ? { values } : {}),
            ...(dataRange !== undefined ? { dataRange } : {}),
            isSeriesInRows,
            sheetName: this.sheetName(),
            ...(options.formatCode !== undefined ? { formatCode: options.formatCode } : {}),
            ...(options.categories !== undefined ? { categories: options.categories } : {}),
            ...(options.categoryNames !== undefined ? { categoryNames: options.categoryNames } : {}),
            ...(options.valuePoints !== undefined ? { valuePoints: options.valuePoints } : {}),
            ...(options.binWidth !== undefined ? { binWidth: options.binWidth } : {}),
            ...(options.binCount !== undefined ? { binCount: options.binCount } : {})
        });

        // Mirror ChartEx formulas onto a placeholder classic series so handle.series
        // remains inspectable without inventing classic plot markup.
        let series: SeriesModel[] = [];
        const mirroredValues: string = (chartEx.values != null ? chartEx.values : '');
        if (mirroredValues.length > 0 || chartEx.valuePoints !== undefined) {
            series = [
                {
                    ...(chartEx.categoryLabels !== undefined && chartEx.categoryLabels[0] !== undefined
                        ? { categoryLabels: chartEx.categoryLabels[0] }
                        : {}),
                    values: mirroredValues.length > 0 ? mirroredValues : '(cached)',
                    serieFormat: DEFAULT_FRAME(),
                    dataLabels: DEFAULT_DATA_LABELS()
                }
            ];
        }

        const entry: ChartEntry = {
            id: this.nextId++,
            type,
            engine: 'chartex',
            chartEx,
            name: `Chart ${this.nextName++}`,
            // Create defaults: title/legend/axes/gridlines on; disable via public setters.
            hasTitle: true,
            chartTitle: '',
            chartTitleArea: DEFAULT_TEXT_AREA(),
            chartArea: DEFAULT_FRAME(),
            plotArea: DEFAULT_FRAME(),
            ...(dataRange !== undefined ? { dataRange } : {}),
            isSeriesInRows,
            dataSource: { kind: 'none' },
            series,
            row: options.row,
            column: options.column,
            colOffEmu: 0,
            rowOffEmu: 0,
            widthEmu: pointsToEmu(options.width),
            heightEmu: pointsToEmu(options.height),
            hasLegend: true,
            legendPosition: resolveLegendPosition(undefined),
            legendTextArea: DEFAULT_TEXT_AREA(),
            legendFrame: DEFAULT_FRAME(),
            hasDataTable: false,
            categoryAxis: DEFAULT_AXIS(),
            valueAxis: DEFAULT_VALUE_AXIS()
        };
        this.entries.push(entry);
        this.markDirty();
        return this.handleFor(entry);
    }

    private addClassic(options: CreateChartArgs, type: ClassicChartType): Chart {
        const isSeriesInRows: boolean = options.isSeriesInRows === true;
        let series: SeriesModel[] = [];
        const dataRange: string | undefined =
      options.dataRange === undefined ? undefined : String(options.dataRange).trim();

        if (dataRange !== undefined && dataRange.length > 0) {
            series = deriveSeriesFromDataRange(dataRange, isSeriesInRows, this.sheetName());
        } else if (options.values !== undefined) {
            const values: string = String(options.values).trim();
            if (values.length === 0) {
                throw new InvalidChartError('addChart values must be a non-empty formula reference');
            }
            const categoryLabels: string = firstCategoryLabelFormula(options.categoryLabels);
            series = [
                {
                    ...(categoryLabels !== undefined ? { categoryLabels } : {}),
                    values,
                    serieFormat: DEFAULT_FRAME(),
                    dataLabels: DEFAULT_DATA_LABELS()
                }
            ];
        }

        // Empty series is allowed so callers can seed with '' and Chart.addSeries.

        const typeDefaults: PlotKind = plotKindFromType(type);
        // Stamp chart-type default explosion (e.g. DoughnutExploded) onto series
        // that do not already set explodePercent, so the public API reflects the
        // same default that serialize would emit.
        if (typeDefaults.explosion !== undefined && typeDefaults.explosion > 0) {
            for (const s of series) {
                if (s.explodePercent === undefined) {
                    s.explodePercent = typeDefaults.explosion;
                }
            }
        }
        // Bubble3D flags the 3-D effect on every series (Office disallows the
        // group-level flag — [MS-OE376] §2.1.1458(b)); stamp the default so the
        // public API reflects what serialize emits.
        if (type === ChartType.Bubble3D) {
            for (const s of series) {
                if (s.bubbleSize3D === undefined) {
                    s.bubbleSize3D = true;
                }
            }
        }
        const grouping: BarGrouping = resolveGrouping(
            type,
            (typeDefaults.barGrouping != null ? typeDefaults.barGrouping : typeDefaults.areaGrouping)
        );
        const scatterStyle: ScatterStyle = resolveScatterStyle(type, typeDefaults.scatterStyle);

        // Axes: category axis has no gridlines by default; value axis has major gridlines
        // (matches Microsoft Excel behavior for default chart creation).
        const categoryAxis: AxisModel = DEFAULT_AXIS();
        const valueAxis: AxisModel = DEFAULT_VALUE_AXIS();

        const entry: ChartEntry = {
            id: this.nextId++,
            type,
            engine: 'classic',
            name: `Chart ${this.nextName++}`,
            // Create defaults: title/legend/axes/gridlines on; disable via public setters.
            hasTitle: true,
            chartTitle: '',
            chartTitleArea: DEFAULT_TEXT_AREA(),
            chartArea: DEFAULT_FRAME(),
            plotArea: DEFAULT_FRAME(),
            ...(dataRange !== undefined && dataRange.length > 0 ? { dataRange } : {}),
            isSeriesInRows,
            ...(grouping !== undefined ? { grouping } : {}),
            ...(scatterStyle !== undefined ? { scatterStyle } : {}),
            dataSource: { kind: 'none' },
            series,
            row: options.row,
            column: options.column,
            colOffEmu: 0,
            rowOffEmu: 0,
            widthEmu: pointsToEmu(options.width),
            heightEmu: pointsToEmu(options.height),
            hasLegend: true,
            legendPosition: resolveLegendPosition(undefined),
            legendTextArea: DEFAULT_TEXT_AREA(),
            legendFrame: DEFAULT_FRAME(),
            hasDataTable: false,
            categoryAxis,
            valueAxis
        };
        this.entries.push(entry);
        this.markDirty();
        return this.handleFor(entry);
    }

    public remove(target: Chart | number): void {
        const index: number =
      typeof target === 'number' ? target : this.entries.indexOf((target as ChartHandle).entry);
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError('removeChart target is not on this worksheet');
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: ChartEntry = this.entries[index];
        if (entry !== undefined) {
            this.entries.splice(index, 1);
            this.handles.delete(entry);
            this.markDirty();
        }
    }

    public materializeOnFlush(drawingRel: OpcRelationship | undefined): ChartsMaterializeResult {
        const host: ChartsHost = this.host;
        if (host === undefined || host.sheetPartName === undefined) {
            return {
                drawingRel,
                drawingRelationshipId: (drawingRel == null ? undefined : drawingRel.id),
                ownsDrawingElement: this.dirty || this.entries.length > 0
            };
        }
        if (!this.dirty && this.entries.length === 0) {
            return {
                drawingRel,
                drawingRelationshipId: (drawingRel == null ? undefined : drawingRel.id),
                ownsDrawingElement: false
            };
        }

        const partName: string =
      drawingRel === undefined
          ? this.allocateDrawingPart(host.package)
          : normalizePartName(drawingRel.resolvedTarget);
        this.drawingPartName = partName;

        const existing: OpcPart = host.package.getPart(partName);
        let xml: string =
      existing === undefined
          ? `<xdr:wsDr xmlns:xdr="${XDR_NS}" xmlns:a="${A_NS}" xmlns:r="${R_NS}"></xdr:wsDr>`
          : decodeUtf8(existing.data);

        xml = xml.replace(
            /<xdr:(?:oneCellAnchor|twoCellAnchor)\b[\s\S]*?<\/xdr:(?:oneCellAnchor|twoCellAnchor)>/g,
            (anchor: string) => (isChartGraphicFrameAnchor(anchor) ? '' : anchor)
        );

        const priorRels: ReadonlyArray<OpcRelationship> = host.package.getRelationships(partName);
        const keptRels: OpcRelationship[] = priorRels.filter(
            (r: OpcRelationship) => !isChartRelationshipType(r.type) && !isChartExRelationshipType(r.type)
        );
        let nextRel: number = 1;
        for (const rel of keptRels) {
            const match: RegExpExecArray = /^rId(\d+)$/i.exec(rel.id);
            if (match) {nextRel = Math.max(nextRel, Number(match[1]) + 1); }
        }
        const rels: OpcRelationship[] = [...keptRels];
        const anchors: string[] = [];
        let hasClassicChart: boolean = false;
        let hasChartEx: boolean = false;

        for (const entry of this.entries) {
            if (isChartExEntry(entry)) {
                hasChartEx = true;
                if (entry.chartEx === undefined) {
                    throw new InvalidChartError(`ChartEx "${entry.name}" has no ChartEx model`);
                }
                // Keep ChartEx title in sync with handle mutations before serialize.
                entry.chartEx = syncChartExFromEntry(entry, this.sheetName());
                const chartPartName: string = (entry.chartPartName != null ? entry.chartPartName : this.allocateChartExPart(host.package));
                entry.chartPartName = chartPartName;
                const chartBytes: Uint8Array = encodeUtf8(serializeChartEx(entry.chartEx));
                host.package.setPart(chartPartName, chartBytes, CHARTEX_CONTENT_TYPE);

                const relId: string = `rId${nextRel++}`;
                entry.relId = relId;
                rels.push({
                    id: relId,
                    type: CHARTEX_REL_TYPE,
                    target: relativeTarget(partName, chartPartName),
                    resolvedTarget: chartPartName
                });
                anchors.push(serializeChartAnchor(entry, relId));
                continue;
            }

            hasClassicChart = true;
            if (entry.series.length === 0) {
                throw new InvalidChartError(`Chart "${entry.name}" has no series`);
            }
            const chartPartName: string = (entry.chartPartName != null ? entry.chartPartName : this.allocateChartPart(host.package));
            entry.chartPartName = chartPartName;

            if (!isClassicChartType(entry.type)) {
                throw new InvalidChartError(`Chart "${entry.name}" has unknown classic type`);
            }
            const classicEntry: Parameters<typeof serializeChartSpace>[0] = {
                ...entry,
                type: entry.type
            };
            const chartBytes: Uint8Array = encodeUtf8(
                entry.preservedChartXml !== undefined && !this.entryNeedsRewrite(entry)
                    ? entry.preservedChartXml
                    : serializeChartSpace(classicEntry)
            );
            host.package.setPart(chartPartName, chartBytes, CHART_CONTENT_TYPE);

            this.materializeChartPartRels(host.package, entry, chartPartName);

            const relId: string = `rId${nextRel++}`;
            entry.relId = relId;
            rels.push({
                id: relId,
                type: CHART_REL_TYPE_TRANSITIONAL,
                target: relativeTarget(partName, chartPartName),
                resolvedTarget: chartPartName
            });
            anchors.push(serializeChartAnchor(entry, relId));
        }

        xml = xml.replace('</xdr:wsDr>', `${anchors.join('')}</xdr:wsDr>`);
        if (hasClassicChart && !xml.includes(`xmlns:c="${C_NS}"`) && !xml.includes(C_NS)) {
            xml = xml.replace('<xdr:wsDr', `<xdr:wsDr xmlns:c="${C_NS}"`);
        }
        if (hasChartEx && !xml.includes(`xmlns:cx="${CX_NS}"`) && !xml.includes(CX_NS)) {
            xml = xml.replace('<xdr:wsDr', `<xdr:wsDr xmlns:cx="${CX_NS}"`);
        }
        host.package.setPart(partName, encodeUtf8(xml), DRAWING_CONTENT_TYPE);
        host.package.setRelationships(partName, rels);

        let resultRel: OpcRelationship = drawingRel;
        if (resultRel === undefined) {
            const relId: string = `rId${maxSheetRelId(host.package.getRelationships(host.sheetPartName)) + 1}`;
            const target: string = relativeTarget(host.sheetPartName, partName);
            resultRel = {
                id: relId,
                type: DRAWING_REL_TYPE_TRANSITIONAL,
                target,
                resolvedTarget: resolveRelationshipTarget(host.sheetPartName, target, undefined)
            };
        }
        this.drawingRelId = resultRel.id;
        this.dirty = false;
        return {
            drawingRel: resultRel,
            drawingRelationshipId: resultRel.id,
            ownsDrawingElement: true
        };
    }

    private entryNeedsRewrite(_entry: ChartEntry): boolean {
        return true;
    }

    private materializeChartPartRels(
        pkg: OpcPackage,
        entry: ChartEntry,
        chartPartName: string
    ): void {
        const dataSource: ChartDataSource = entry.dataSource;
        const existing: OpcRelationship[] = pkg.getRelationships(chartPartName).filter((r: OpcRelationship) => {
            if (dataSource.kind === 'none') {return true; }
            return r.id !== dataSource.relationshipId;
        });
        if (dataSource.kind === 'none') {
            if (existing.length > 0 || pkg.getRelationships(chartPartName).length > 0) {
                pkg.setRelationships(chartPartName, existing);
            }
            return;
        }
        const has: boolean = existing.some((r: OpcRelationship) => r.id === dataSource.relationshipId);
        if (!has && dataSource.kind === 'external' && dataSource.target !== undefined) {
            existing.push({
                id: dataSource.relationshipId,
                type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject',
                target: dataSource.target,
                targetMode: 'External',
                resolvedTarget: dataSource.target
            });
        }
        pkg.setRelationships(chartPartName, existing);
    }

    private allocateChartExPart(pkg: OpcPackage): string {
        let i: number = 1;
        while (pkg.getPart(`/xl/charts/chartEx${i}.xml`) !== undefined) {i++; }
        return `/xl/charts/chartEx${i}.xml`;
    }

    private allocateDrawingPart(pkg: OpcPackage): string {
        let i: number = 1;
        while (pkg.getPart(`/xl/drawings/drawing${i}.xml`) !== undefined) {i++; }
        return `/xl/drawings/drawing${i}.xml`;
    }

    private allocateChartPart(pkg: OpcPackage): string {
        let i: number = 1;
        while (pkg.getPart(`/xl/charts/chart${i}.xml`) !== undefined) {i++; }
        return `/xl/charts/chart${i}.xml`;
    }

    private markDirty(): void {
        this.dirty = true;
        if (this.host != null) { this.host.markDirty(); }
    }

    private sheetName(): string {
        return ((__t: string) => __t != null ? __t : 'Sheet1')(this.host == null ? undefined : this.host.sheetName);
    }

    private sheetMetrics(): SheetMetrics | undefined {
        const host: ChartsHost = this.host;
        if (host === undefined) {return undefined; }
        if (host.getRowHeightPt === undefined && host.getColumnWidthChars === undefined) {
            return undefined;
        }
        return {
            getRowHeightPt: (row: number) =>
                host.getRowHeightPt === undefined ? 0 : host.getRowHeightPt(row),
            getColumnWidthChars: (column: number) =>
                host.getColumnWidthChars === undefined ? 0 : host.getColumnWidthChars(column)
        };
    }

    private handleFor(entry: ChartEntry): Chart {
        let handle: ChartHandle = this.handles.get(entry);
        if (handle === undefined) {
            handle = new ChartHandle(
                entry,
                () => this.markDirty(),
                () => this.sheetName(),
                () => this.sheetMetrics()
            );
            this.handles.set(entry, handle);
        }
        return handle;
    }
}

class ChartHandle implements Chart {
    public readonly entry: ChartEntry;
    private readonly dirty: () => void;
    private readonly sheetName: () => string;
    private readonly metrics: () => SheetMetrics | undefined;
    private highLowLinesHandle: ChartLineFormatHandle | undefined;

    public constructor(
        entry: ChartEntry,
        dirty: () => void,
        sheetName: () => string,
        metrics: () => SheetMetrics | undefined = () => undefined
    ) {
        this.entry = entry;
        this.dirty = dirty;
        this.sheetName = sheetName;
        this.metrics = metrics;
    }

    public get type(): ChartType {
        return this.entry.type;
    }
    public set type(value: ChartType) {
        if (isChartExType(value)) {
            if (!isChartExEntry(this.entry) || this.entry.chartEx === undefined) {
                throw new InvalidChartError(
                    'Cannot change a classic chart to a ChartEx type; add a new chart instead'
                );
            }
            const prev: ChartEx = this.entry.chartEx;
            this.entry.type = value;
            this.entry.engine = 'chartex';
            this.entry.chartEx = cloneChartEx(
                createChartEx({
                    type: value,
                    ...(prev.title !== undefined ? { title: prev.title } : {}),
                    ...(prev.categoryLabels !== undefined
                        ? { categoryLabels: [...prev.categoryLabels] }
                        : {}),
                    ...(prev.values !== undefined ? { values: prev.values } : {}),
                    ...(this.entry.dataRange !== undefined
                        ? { dataRange: this.entry.dataRange }
                        : prev.dataRange !== undefined
                            ? { dataRange: prev.dataRange }
                            : {}),
                    isSeriesInRows: this.entry.isSeriesInRows,
                    ...(prev.formatCode !== undefined ? { formatCode: prev.formatCode } : {}),
                    ...(prev.categories !== undefined
                        ? { categories: prev.categories.map((level: ReadonlyArray<string>) => [...level]) }
                        : {}),
                    ...(prev.categoryNames !== undefined
                        ? { categoryNames: [...prev.categoryNames] }
                        : {}),
                    ...(prev.valuePoints !== undefined ? { valuePoints: [...prev.valuePoints] } : {}),
                    ...(prev.binWidth !== undefined ? { binWidth: prev.binWidth } : {}),
                    ...(prev.binCount !== undefined ? { binCount: prev.binCount } : {})
                })
            );
            delete this.entry.grouping;
            delete this.entry.scatterStyle;
            this.dirty();
            return;
        }
        if (!isClassicChartType(value)) {
            throw new InvalidChartError(`Unknown chart type "${String(value)}"`);
        }
        if (isChartExEntry(this.entry)) {
            throw new InvalidChartError(
                'Cannot change a ChartEx chart to a classic type; add a new chart instead'
            );
        }
        this.entry.type = value;
        this.entry.engine = 'classic';
        delete this.entry.chartEx;
        const defaults: PlotKind = plotKindFromType(value);
        const groupingDefault: BarGrouping = (defaults.barGrouping != null ? defaults.barGrouping : defaults.areaGrouping);
        if (groupingDefault !== undefined) {
            this.entry.grouping = groupingDefault;
        } else {
            delete this.entry.grouping;
        }
        if (defaults.scatterStyle !== undefined) {
            this.entry.scatterStyle = defaults.scatterStyle;
        } else {
            delete this.entry.scatterStyle;
        }
        this.dirty();
    }
    /**
     * engine.
     *
     * @returns {'classic' | 'chartex'} - Returns the result.
     */
    public get engine(): 'classic' | 'chartex' {
        return isChartExEntry(this.entry) ? 'chartex' : 'classic';
    }
    public get name(): string {
        return this.entry.name;
    }
    public set name(value: string) {
        this.entry.name = String(value);
        this.dirty();
    }
    public get chartTitle(): string | undefined {
        return this.entry.chartTitle;
    }
    public set chartTitle(value: string | undefined) {
        if (value === undefined) {
            delete this.entry.chartTitle;
        } else {
            this.entry.chartTitle = String(value);
            this.entry.hasTitle = true;
        }
        this.dirty();
    }
    public get hasTitle(): boolean {
        return this.entry.hasTitle && this.entry.chartTitle !== undefined;
    }
    public set hasTitle(value: boolean) {
        this.entry.hasTitle = Boolean(value);
        this.dirty();
    }
    public get chartTitleArea(): ChartTextArea {
        return new ChartTextAreaHandle(this.entry.chartTitleArea, this.dirty);
    }
    public get chartArea(): ChartFrameFormat {
        return new ChartFrameFormatHandle(this.entry.chartArea, this.dirty);
    }
    public get plotArea(): ChartFrameFormat {
        return new ChartFrameFormatHandle(this.entry.plotArea, this.dirty);
    }
    public get dataRange(): string | undefined {
        return this.entry.dataRange;
    }
    public set dataRange(value: string | undefined) {
        if (value === undefined || String(value).trim().length === 0) {
            delete this.entry.dataRange;
            this.dirty();
            return;
        }
        const range: string = String(value).trim();
        this.entry.dataRange = range;
        this.entry.series = deriveSeriesFromDataRange(
            range,
            this.entry.isSeriesInRows,
            this.sheetName()
        );
        this.dirty();
    }
    public get isSeriesInRows(): boolean {
        return this.entry.isSeriesInRows;
    }
    public set isSeriesInRows(value: boolean) {
        this.entry.isSeriesInRows = Boolean(value);
        if (this.entry.dataRange !== undefined) {
            this.entry.series = deriveSeriesFromDataRange(
                this.entry.dataRange,
                this.entry.isSeriesInRows,
                this.sheetName()
            );
        }
        this.dirty();
    }
    public get grouping(): BarGrouping | AreaGrouping | undefined {
        if (isChartExEntry(this.entry) || !isClassicChartType(this.entry.type)) {
            return this.entry.grouping;
        }
        const grouping: BarGrouping = this.entry.grouping != null
            ? this.entry.grouping
            : plotKindFromType(this.entry.type).barGrouping;
        return grouping != null ? grouping : plotKindFromType(this.entry.type).areaGrouping;
    }
    public set grouping(value: BarGrouping | AreaGrouping | undefined) {
        if (isChartExEntry(this.entry) || !isClassicChartType(this.entry.type)) {
            throw new InvalidChartError('grouping is not supported on ChartEx charts');
        }
        if (value === undefined) {
            delete this.entry.grouping;
        } else {
            const resolved: BarGrouping = resolveGrouping(this.entry.type, value);
            if (resolved === undefined) {delete this.entry.grouping; }
            else {this.entry.grouping = resolved; }
        }
        this.dirty();
    }
    public get scatterStyle(): ScatterStyle | undefined {
        if (isChartExEntry(this.entry) || !isClassicChartType(this.entry.type)) {
            return this.entry.scatterStyle;
        }
        return (this.entry.scatterStyle != null ? this.entry.scatterStyle : plotKindFromType(this.entry.type).scatterStyle);
    }
    public set scatterStyle(value: ScatterStyle | undefined) {
        if (isChartExEntry(this.entry) || !isClassicChartType(this.entry.type)) {
            throw new InvalidChartError('scatterStyle is not supported on ChartEx charts');
        }
        if (value === undefined) {
            delete this.entry.scatterStyle;
        } else {
            const resolved: ScatterStyle = resolveScatterStyle(this.entry.type, value);
            if (resolved === undefined) {delete this.entry.scatterStyle; }
            else {this.entry.scatterStyle = resolved; }
        }
        this.dirty();
    }
    public get view3D(): ChartView3D | undefined {
        return this.entry.view3D === undefined ? undefined : { ...this.entry.view3D };
    }
    public set view3D(value: ChartView3D | undefined) {
        if (value === undefined) {delete this.entry.view3D; }
        else {this.entry.view3D = normalizeView3D(value); }
        this.dirty();
    }
    /**
     * Host-only `c:externalData` binding. Not on the public {@link Chart}
     * interface; DocIO/PPTX access via `@syncfusion/ej2-xlsx/internal/charts`.
     *
     * @returns {ChartDataSource} - Returns the result.
     */
    public get dataSource(): ChartDataSource {
        return this.entry.dataSource;
    }
    public set dataSource(value: ChartDataSource) {
        validateDataSource(value);
        this.entry.dataSource = value;
        this.dirty();
    }
    public get row(): number {
        return this.entry.row;
    }
    public set row(value: number) {
        requirePositiveInt(value, 'row');
        this.entry.row = value;
        this.entry.rowOffEmu = 0;
        this.dirty();
    }
    public get column(): number {
        return this.entry.column;
    }
    public set column(value: number) {
        requirePositiveInt(value, 'column');
        this.entry.column = value;
        this.entry.colOffEmu = 0;
        this.dirty();
    }
    public get top(): number {
        return anchorToAbsoluteTopPt(this.entry, this.metrics());
    }
    public set top(value: number) {
        requireNonNegativePoints(value, 'top');
        applyAbsoluteTop(this.entry, value, this.metrics());
        this.dirty();
    }
    public get left(): number {
        return anchorToAbsoluteLeftPt(this.entry, this.metrics());
    }
    public set left(value: number) {
        requireNonNegativePoints(value, 'left');
        applyAbsoluteLeft(this.entry, value, this.metrics());
        this.dirty();
    }
    public get width(): number {
        return this.entry.widthEmu / EMU_PER_PT;
    }
    public set width(value: number) {
        requirePositivePoints(value, 'width');
        this.entry.widthEmu = pointsToEmu(value);
        this.dirty();
    }
    public get height(): number {
        return this.entry.heightEmu / EMU_PER_PT;
    }
    public set height(value: number) {
        requirePositivePoints(value, 'height');
        this.entry.heightEmu = pointsToEmu(value);
        this.dirty();
    }
    public get hasLegend(): boolean {
        return this.entry.hasLegend;
    }
    public set hasLegend(value: boolean) {
        this.entry.hasLegend = Boolean(value);
        this.dirty();
    }
    public get legend(): ChartLegend {
        return new ChartLegendHandle(this.entry, this.dirty);
    }
    public get hasDataTable(): boolean {
        return this.entry.hasDataTable;
    }
    public set hasDataTable(value: boolean) {
        this.entry.hasDataTable = Boolean(value);
        this.dirty();
    }
    public get hasHighLowLines(): boolean {
        // Default to true for stock charts when property is undefined
        return this.entry.hasHighLowLines !== false;
    }
    public set hasHighLowLines(value: boolean) {
        // Explicitly store false; undefined means true (default)
        this.entry.hasHighLowLines = Boolean(value) ? undefined : false;
        this.dirty();
    }
    public get highLowLines(): ChartLineFormat | undefined {
        // Only available for stock chart types
        if (!isStockChartType(this.entry.type)) {
            return undefined;
        }
        // Lazy-initialize handle on first access
        if (this.highLowLinesHandle === undefined) {
            if (this.entry.highLowLinesFormat === undefined) {
                this.entry.highLowLinesFormat = {};
            }
            this.highLowLinesHandle = new ChartLineFormatHandle(
                this.entry.highLowLinesFormat,
                this.dirty
            );
        }
        return this.highLowLinesHandle;
    }
    public get primaryCategoryAxis(): ChartAxis {
        return new ChartAxisHandle(this.entry.categoryAxis, this.dirty);
    }
    public get primaryValueAxis(): ChartAxis {
        return new ChartAxisHandle(this.entry.valueAxis, this.dirty);
    }
    public get secondaryCategoryAxis(): ChartAxis {
        if (this.entry.secondaryCategoryAxis === undefined) {
            this.entry.secondaryCategoryAxis = DEFAULT_SECONDARY_CATEGORY_AXIS();
        }
        return new ChartAxisHandle(this.entry.secondaryCategoryAxis, this.dirty);
    }
    public get secondaryValueAxis(): ChartAxis {
        if (this.entry.secondaryValueAxis === undefined) {
            this.entry.secondaryValueAxis = DEFAULT_SECONDARY_VALUE_AXIS();
        }
        return new ChartAxisHandle(this.entry.secondaryValueAxis, this.dirty);
    }
    public get series(): ReadonlyArray<ChartSeries> {
        return this.entry.series.map(
            (s: SeriesModel) => new ChartSeriesHandle(ensureSeriesFormat(s), this.dirty, () => this.placementOf(s))
        );
    }
    private placementOf(model: SeriesModel): SeriesPlacement {
        const placements: SeriesPlacement[] = resolveSeriesPlacements(this.entry);
        const index: number = this.entry.series.indexOf(model);
        return index >= 0 ? placements[index] : { type: this.entry.type, secondary: false };
    }
    public addSeries(title?: string): ChartSeries {
        const typeDefaults: PlotKind = plotKindFromType(this.entry.type);
        const model: SeriesModel = ensureSeriesFormat({
            values: '',
            ...(title !== undefined ? { title: String(title) } : {}),
            // Match create-time defaults so empty+addSeries charts reflect the same
            // public series flags serialize would emit for this chart type.
            ...(typeDefaults.explosion !== undefined && typeDefaults.explosion > 0
                ? { explodePercent: typeDefaults.explosion }
                : {}),
            ...(this.entry.type === ChartType.Bubble3D ? { bubbleSize3D: true } : {}),
            serieFormat: DEFAULT_FRAME(),
            dataLabels: DEFAULT_DATA_LABELS()
        });
        this.entry.series.push(model);
        this.dirty();
        return new ChartSeriesHandle(model, this.dirty, () => this.placementOf(model));
    }
    public removeSeries(target: ChartSeries | number): void {
        let index: number;
        if (typeof target === 'number') {
            index = target;
        } else {
            index = this.entry.series.findIndex(
                (s: SeriesModel) => target instanceof ChartSeriesHandle && target.isModel(s)
            );
        }
        if (!Number.isInteger(index) || index < 0 || index >= this.entry.series.length) {
            throw new InvalidChartError(`Series index out of range: ${String(index)}`);
        }
        this.entry.series.splice(index, 1);
        this.dirty();
    }
    public clone(): Chart {
        const {
            relId: _r,
            chartPartName: _c,
            preservedChartXml: _p,
            chartEx: _cx,
            ...rest
        } = this.entry;
        void _r;
        void _c;
        void _p;
        void _cx;
        const copy: ChartEntry = {
            ...rest,
            colOffEmu: this.entry.colOffEmu,
            rowOffEmu: this.entry.rowOffEmu,
            series: this.entry.series.map((s: SeriesModel) => cloneSeriesModel(ensureSeriesFormat(s))),
            ...(this.entry.view3D !== undefined ? { view3D: { ...this.entry.view3D } } : {}),
            dataSource: { ...this.entry.dataSource } as ChartDataSource,
            chartTitleArea: cloneTextArea(this.entry.chartTitleArea),
            chartArea: cloneFrame(this.entry.chartArea),
            plotArea: cloneFrame(this.entry.plotArea),
            legendTextArea: cloneTextArea(this.entry.legendTextArea),
            legendFrame: cloneFrame(this.entry.legendFrame),
            hasDataTable: this.entry.hasDataTable,
            ...(this.entry.highLowLinesFormat !== undefined
                ? { highLowLinesFormat: cloneLine(this.entry.highLowLinesFormat) }
                : {}),
            categoryAxis: cloneAxis(ensureAxisFormat(this.entry.categoryAxis)),
            valueAxis: cloneAxis(ensureAxisFormat(this.entry.valueAxis)),
            ...(this.entry.secondaryCategoryAxis !== undefined
                ? { secondaryCategoryAxis: cloneAxis(ensureAxisFormat(this.entry.secondaryCategoryAxis)) }
                : {}),
            ...(this.entry.secondaryValueAxis !== undefined
                ? { secondaryValueAxis: cloneAxis(ensureAxisFormat(this.entry.secondaryValueAxis)) }
                : {}),
            ...(this.entry.chartEx !== undefined
                ? { engine: 'chartex', chartEx: cloneChartEx(this.entry.chartEx) }
                : {})
        };
        return new ChartHandle(copy, this.dirty, this.sheetName, this.metrics);
    }
}
class ChartSeriesHandle implements ChartSeries {
    private readonly model: SeriesModel;
    private readonly dirty: () => void;
    private readonly placement: (() => SeriesPlacement) | undefined;

    public constructor(model: SeriesModel, dirty: () => void, placement?: () => SeriesPlacement) {
        this.model = model;
        this.dirty = dirty;
        this.placement = placement;
    }
    public isModel(model: SeriesModel): boolean {
        return this.model === model;
    }
    public get title(): string | undefined {
        return this.model.title;
    }
    public set title(value: string | undefined) {
        if (value === undefined) {delete this.model.title; }
        else {this.model.title = String(value); }
        this.dirty();
    }
    public get categoryLabels(): string | undefined {
        return this.model.categoryLabels;
    }
    public set categoryLabels(value: string | undefined) {
        if (value === undefined || String(value).length === 0) {delete this.model.categoryLabels; }
        else {this.model.categoryLabels = String(value); }
        this.dirty();
    }
    public get values(): string {
        return this.model.values;
    }
    public set values(value: string) {
        if (typeof value !== 'string' || value.length === 0) {
            throw new InvalidChartError('series values must be a non-empty formula reference');
        }
        this.model.values = value;
        this.dirty();
    }
    public get bubbleSizes(): string | undefined {
        return this.model.bubbleSizes;
    }
    public set bubbleSizes(value: string | undefined) {
        if (value === undefined) {
            delete this.model.bubbleSizes;
        } else {
            if (typeof value !== 'string' || value.length === 0) {
                throw new InvalidChartError(
                    'bubbleSizes must be a non-empty formula reference when set'
                );
            }
            this.model.bubbleSizes = value;
        }
        this.dirty();
    }
    public get bubbleSize3D(): boolean {
        return this.model.bubbleSize3D === true;
    }
    public set bubbleSize3D(value: boolean) {
        this.model.bubbleSize3D = Boolean(value);
        this.dirty();
    }
    public get explodePercent(): number | undefined {
        return this.model.explodePercent;
    }
    public set explodePercent(value: number | undefined) {
        if (value === undefined) {
            delete this.model.explodePercent;
        } else {
            const n: number = Number(value);
            if (!Number.isFinite(n) || n < 0 || n > 400) {
                throw new InvalidChartError('explodePercent must be a number between 0 and 400');
            }
            this.model.explodePercent = n;
        }
        this.dirty();
    }
    public get serieType(): ChartType | undefined {
        if (this.model.serieType !== undefined) {return this.model.serieType; }
        return this.placement === undefined ? undefined : this.placement().type;
    }
    public set serieType(value: ChartType | undefined) {
        if (value === undefined) {
            delete this.model.serieType;
        } else {
            if (!isComboSeriesType(value)) {
                throw new InvalidChartError(
                    `Invalid serieType "${String(value)}"; expected a 2-D column, line or area chart type`
                );
            }
            this.model.serieType = value;
        }
        this.dirty();
    }
    public get usePrimaryAxis(): boolean {
        if (this.model.usePrimaryAxis !== undefined) {return this.model.usePrimaryAxis; }
        return this.placement === undefined ? true : !this.placement().secondary;
    }
    public set usePrimaryAxis(value: boolean) {
        this.model.usePrimaryAxis = Boolean(value);
        this.dirty();
    }
    public get serieFormat(): ChartSerieFormat {
        const model: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(this.model);
        return new ChartSerieFormatHandle(model.serieFormat, this.dirty);
    }
    public get dataLabels(): ChartDataLabels {
        const model: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(this.model);
        return new ChartDataLabelsHandle(model.dataLabels, this.dirty);
    }
}

class ChartAxisHandle implements ChartAxis {
    private readonly model: AxisModel;
    private readonly dirty: () => void;

    public constructor(model: AxisModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
        ensureAxisFormat(model);
    }
    public get title(): string | undefined {
        return this.model.title;
    }
    public set title(value: string | undefined) {
        if (value === undefined) {delete this.model.title; }
        else {this.model.title = String(value); }
        this.dirty();
    }
    public get visible(): boolean {
        return this.model.visible;
    }
    public set visible(value: boolean) {
        this.model.visible = Boolean(value);
        this.dirty();
    }
    public get hasMajorGridLines(): boolean {
        return this.model.hasMajorGridLines;
    }
    public set hasMajorGridLines(value: boolean) {
        this.model.hasMajorGridLines = Boolean(value);
        this.dirty();
    }
    public get hasMinorGridLines(): boolean {
        return this.model.hasMinorGridLines;
    }
    public set hasMinorGridLines(value: boolean) {
        this.model.hasMinorGridLines = Boolean(value);
        this.dirty();
    }
    public get numberFormat(): string | undefined {
        return this.model.numberFormat;
    }
    public set numberFormat(value: string | undefined) {
        if (value === undefined || String(value).length === 0) {delete this.model.numberFormat; }
        else {this.model.numberFormat = String(value); }
        this.dirty();
    }
    public get minimumValue(): number | undefined {
        return this.model.minimumValue;
    }
    public set minimumValue(value: number | undefined) {
        if (value === undefined) {delete this.model.minimumValue; }
        else {
            if (!Number.isFinite(value)) {
                throw new InvalidChartError('minimumValue must be a finite number');
            }
            this.model.minimumValue = value;
        }
        this.dirty();
    }
    public get maximumValue(): number | undefined {
        return this.model.maximumValue;
    }
    public set maximumValue(value: number | undefined) {
        if (value === undefined) {delete this.model.maximumValue; }
        else {
            if (!Number.isFinite(value)) {
                throw new InvalidChartError('maximumValue must be a finite number');
            }
            this.model.maximumValue = value;
        }
        this.dirty();
    }
    public get majorTickMark(): TickMarkTypeValue {
        return this.model.majorTickMark;
    }
    public set majorTickMark(value: TickMarkTypeValue) {
        this.model.majorTickMark = resolveTickMark(value, TickMarkType.Outside);
        this.dirty();
    }
    public get minorTickMark(): TickMarkTypeValue {
        return this.model.minorTickMark;
    }
    public set minorTickMark(value: TickMarkTypeValue) {
        this.model.minorTickMark = resolveTickMark(value, TickMarkType.None);
        this.dirty();
    }
    public get line(): ChartLineFormat {
        return new ChartLineFormatHandle(this.model.line, this.dirty);
    }
    public get titleArea(): ChartTextArea {
        return new ChartTextAreaHandle(this.model.titleArea, this.dirty);
    }
}

class ChartLegendHandle implements ChartLegend {
    private readonly entry: ChartEntry;
    private readonly dirty: () => void;

    public constructor(entry: ChartEntry, dirty: () => void) {
        this.entry = entry;
        this.dirty = dirty;
    }
    public get position(): LegendPositionValue {
        return this.entry.legendPosition;
    }
    public set position(value: LegendPositionValue) {
        this.entry.legendPosition = resolveLegendPosition(value);
        this.entry.hasLegend = true;
        this.dirty();
    }
    public get textArea(): ChartTextArea {
        return new ChartTextAreaHandle(this.entry.legendTextArea, this.dirty);
    }
    public get frameFormat(): ChartFrameFormat {
        return new ChartFrameFormatHandle(this.entry.legendFrame, this.dirty);
    }
}

class ChartFillHandle implements ChartFill {
    private readonly model: FillModel;
    private readonly dirty: () => void;

    public constructor(model: FillModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
    }
    public get type(): ChartFillTypeValue {
        return this.model.type;
    }
    public set type(value: ChartFillTypeValue) {
        if (value !== ChartFillType.Solid && value !== ChartFillType.None) {
            throw new InvalidChartError(`Unknown chart fill type "${String(value)}"`);
        }
        this.model.type = value;
        this.dirty();
    }
    public get foreColor(): string | undefined {
        return this.model.foreColor;
    }
    public set foreColor(value: string | undefined) {
        if (value === undefined) {delete this.model.foreColor; }
        else {
            const color: string = normalizeChartColor(value);
            if (color === undefined) {
                throw new InvalidChartError('foreColor must be RRGGBB or #RRGGBB');
            }
            this.model.foreColor = color;
            this.model.type = ChartFillType.Solid;
        }
        this.dirty();
    }
    public get transparency(): number | undefined {
        return this.model.transparency;
    }
    public set transparency(value: number | undefined) {
        if (value === undefined) {delete this.model.transparency; }
        else {
            const n: number = Number(value);
            if (!Number.isFinite(n) || n < 0 || n > 100) {
                throw new InvalidChartError('transparency must be a number between 0 and 100');
            }
            this.model.transparency = n;
        }
        this.dirty();
    }
}

class ChartLineFormatHandle implements ChartLineFormat {
    private readonly model: LineModel;
    private readonly dirty: () => void;

    public constructor(model: LineModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
    }
    public get color(): string | undefined {
        return this.model.color;
    }
    public set color(value: string | undefined) {
        if (value === undefined) {delete this.model.color; }
        else {
            const color: string = normalizeChartColor(value);
            if (color === undefined) {
                throw new InvalidChartError('line color must be RRGGBB or #RRGGBB');
            }
            this.model.color = color;
        }
        this.dirty();
    }
    public get weightPt(): number | undefined {
        return this.model.weightPt;
    }
    public set weightPt(value: number | undefined) {
        if (value === undefined) {delete this.model.weightPt; }
        else {
            const n: number = Number(value);
            if (!Number.isFinite(n) || n < 0) {
                throw new InvalidChartError('weightPt must be a non-negative number');
            }
            this.model.weightPt = n;
        }
        this.dirty();
    }
}

class ChartTextAreaHandle implements ChartTextArea {
    private readonly model: TextAreaModel;
    private readonly dirty: () => void;

    public constructor(model: TextAreaModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
    }
    public get fontName(): string | undefined {
        return this.model.fontName;
    }
    public set fontName(value: string | undefined) {
        if (value === undefined || String(value).length === 0) {delete this.model.fontName; }
        else {this.model.fontName = String(value); }
        this.dirty();
    }
    public get size(): number | undefined {
        return this.model.size;
    }
    public set size(value: number | undefined) {
        if (value === undefined) {delete this.model.size; }
        else {
            const n: number = Number(value);
            if (!Number.isFinite(n) || n <= 0) {
                throw new InvalidChartError('text size must be a positive number (points)');
            }
            this.model.size = n;
        }
        this.dirty();
    }
    public get bold(): boolean {
        return this.model.bold;
    }
    public set bold(value: boolean) {
        this.model.bold = Boolean(value);
        this.dirty();
    }
    public get italic(): boolean {
        return this.model.italic;
    }
    public set italic(value: boolean) {
        this.model.italic = Boolean(value);
        this.dirty();
    }
    public get color(): string | undefined {
        return this.model.color;
    }
    public set color(value: string | undefined) {
        if (value === undefined) {delete this.model.color; }
        else {
            const color: string = normalizeChartColor(value);
            if (color === undefined) {
                throw new InvalidChartError('text color must be RRGGBB or #RRGGBB');
            }
            this.model.color = color;
        }
        this.dirty();
    }
}

class ChartFrameFormatHandle implements ChartFrameFormat {
    private readonly model: FrameModel;
    private readonly dirty: () => void;

    public constructor(model: FrameModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
    }
    public get fill(): ChartFill {
        return new ChartFillHandle(this.model.fill, this.dirty);
    }
    public get line(): ChartLineFormat {
        return new ChartLineFormatHandle(this.model.line, this.dirty);
    }
}

class ChartSerieFormatHandle implements ChartSerieFormat {
    private readonly model: FrameModel;
    private readonly dirty: () => void;

    public constructor(model: FrameModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
    }
    public get fill(): ChartFill {
        return new ChartFillHandle(this.model.fill, this.dirty);
    }
    public get line(): ChartLineFormat {
        return new ChartLineFormatHandle(this.model.line, this.dirty);
    }
}

class ChartDataLabelsHandle implements ChartDataLabels {
    private readonly model: DataLabelsModel;
    private readonly dirty: () => void;

    public constructor(model: DataLabelsModel, dirty: () => void) {
        this.model = model;
        this.dirty = dirty;
    }
    public get isValue(): boolean {
        return this.model.isValue;
    }
    public set isValue(value: boolean) {
        this.model.isValue = Boolean(value);
        this.dirty();
    }
    public get isCategoryName(): boolean {
        return this.model.isCategoryName;
    }
    public set isCategoryName(value: boolean) {
        this.model.isCategoryName = Boolean(value);
        this.dirty();
    }
    public get isSeriesName(): boolean {
        return this.model.isSeriesName;
    }
    public set isSeriesName(value: boolean) {
        this.model.isSeriesName = Boolean(value);
        this.dirty();
    }
    public get isPercentage(): boolean {
        return this.model.isPercentage;
    }
    public set isPercentage(value: boolean) {
        this.model.isPercentage = Boolean(value);
        this.dirty();
    }
    public get position(): DataLabelPositionValue | undefined {
        return this.model.position;
    }
    public set position(value: DataLabelPositionValue | undefined) {
        if (value === undefined) {delete this.model.position; }
        else {this.model.position = resolveDataLabelPosition(value); }
        this.dirty();
    }
    public get textArea(): ChartTextArea {
        return new ChartTextAreaHandle(this.model.textArea, this.dirty);
    }
}

// --- chartSpace serialize / parse (host-agnostic) ---

interface ParsedChartSpace {
    type: ChartType;
    name?: string;
    chartTitle?: string;
    hasTitle: boolean;
    chartTitleArea: TextAreaModel;
    chartArea: FrameModel;
    plotArea: FrameModel;
    dataRange?: string;
    isSeriesInRows?: boolean;
    grouping?: BarGrouping | AreaGrouping;
    scatterStyle?: ScatterStyle;
    view3D?: ChartView3D;
    dataSource: ChartDataSource;
    series: SeriesModel[];
    hasLegend: boolean;
    legendPosition: LegendPositionValue;
    legendTextArea: TextAreaModel;
    legendFrame: FrameModel;
    hasDataTable: boolean;
    categoryAxis: AxisModel;
    valueAxis: AxisModel;
    secondaryCategoryAxis?: AxisModel;
    secondaryValueAxis?: AxisModel;
    preservedChartXml?: string;
}

/**
 * Office document relationship for an embedded chart package (xlsx/docx package part).
 * [MS-ODRAWXML] 2.24.3.24 CT_ExternalData — package or oleObject.
 */
const CHART_EXTERNAL_DATA_PACKAGE_REL_TYPE: string =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';

/**
 * Office document relationship for an external/OLE chart data link.
 * [MS-ODRAWXML] 2.24.3.24; also used by this library's XLSX materialize path.
 */
const CHART_EXTERNAL_DATA_OLE_REL_TYPE: string =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject';

/**
 * One relationship the host must write into the chart part's `.rels`
 * (`chartN.xml.rels`) so `c:externalData/@r:id` resolves.
 */
export interface HostChartRelationship {
    /** Relationship Id — must match `dataSource.relationshipId` / `c:externalData/@r:id`. */
    readonly id: string;
    /** Relationship type URI (package or oleObject for externalData). */
    readonly type: string;
    /**
     * Target URI or package-relative path.
     * Omitted when the host must supply it (embedded part path unknown here).
     */
    readonly target?: string;
    /** OPC TargetMode; `External` for external workbook links. */
    readonly targetMode?: 'External' | 'Internal';
}

/**
 * Chart part handoff for DocIO / PPTX (and other hosts).
 * Hosts place {@link ChartPartExport.xml} as `chartN.xml` and write
 * {@link ChartPartExport.relationships} into that part's `.rels`.
 */
export interface ChartPartExport {
    /** Full `c:chartSpace` document (`chartN.xml` body), including XML declaration. */
    readonly xml: string;
    /** OPC content type for the chart part. */
    readonly contentType: string;
    /**
     * Drawing → chart relationship type the host uses from its graphic frame
     * (`…/relationships/chart`).
     */
    readonly chartRelationshipType: string;
    /** Suggested file name only (`chart{id}.xml`); host chooses the folder. */
    readonly suggestedPartFileName: string;
    readonly chartId: number;
    readonly chartName: string;
    /** Current `c:externalData` model (kind + relationship id). */
    readonly dataSource: ChartDataSource;
    /**
     * Relationships to write beside the chart part.
     * Empty when `dataSource.kind === 'none'`.
     */
    readonly relationships: ReadonlyArray<HostChartRelationship>;
}

/**
 * Create options for a classic live chart handle that is **not** owned by a
 * worksheet (`createOfficeChart`). Word/PPT hosts own layout; dummy sheet
 * geometry is stamped only so the shared {@link Chart} model stays valid.
 *
 * Data follows the same shapes as {@link Worksheet.addChart}: a range string,
 * category-label formula(s) + values, or {@link ChartData}. Presentation and
 * `dataSource` are set on the returned handle after create (no create-time
 * `dataSource` bag).
 *
 * Does not register the chart on any worksheet and does not change XLSX sheet
 * chart lifecycle.
 */
export interface OfficeChartCreateOptions {
    /** Classic chart layout from {@link ChartType}. ChartEx types are rejected. */
    readonly type: ChartType;
    /**
     * A1 range string, category-label formula string(s), or {@link ChartData}.
     * Pass `''` to create an empty chart and add series with {@link Chart.addSeries}.
     */
    readonly data: string | ReadonlyArray<string> | ChartData;
    /** Values formula when `data` is category-label formula(s). */
    readonly values?: string;
    /** Optional chart name (default `Chart N`). */
    readonly name?: string;
    /** Optional chart title text (also enables {@link Chart.hasTitle}). */
    readonly chartTitle?: string;
    /**
     * Sheet name used when deriving series formulas from a bare A1 range.
     * Default `'Sheet1'`. Does not attach the chart to a worksheet.
     */
    readonly sheetName?: string;
}

/**
 * Optional context when parsing a host `c:chartSpace` into a live chart handle
 * (`parseOfficeChart`).
 */
export interface ParseOfficeChartOptions {
    /** OPC package for resolving chart-part `c:externalData` relationships. */
    readonly package?: OpcPackage;
    /** Chart part name used with {@link package} for relationship lookup. */
    readonly chartPartName?: string;
    /**
     * Sheet name used when the handle later mutates `dataRange` / series formulas.
     * Default `'Sheet1'`. Does not attach the chart to a worksheet.
     */
    readonly sheetName?: string;
}

/** Dummy sheet anchor for office-host charts (Word/PPT own real layout). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const OFFICE_CHART_DUMMY_ROW: 1 = 1;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const OFFICE_CHART_DUMMY_COLUMN: 1 = 1;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const OFFICE_CHART_DUMMY_WIDTH_PT: 288 = 288;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const OFFICE_CHART_DUMMY_HEIGHT_PT: 216 = 216;

/**
 * Id/name counters for {@link createOfficeChart} / {@link parseOfficeChart}.
 * Independent of worksheet {@link ChartsImpl} counters so sheet charts are
 * unaffected.
 */
let nextOfficeChartId: number = 2;
let nextOfficeChartName: number = 1;

const OFFICE_CHART_NOOP_DIRTY: () => void = (): void => {
    /* Detached office chart — no worksheet dirty tracking. */
};

/**
 * officeChartSheetName.
 *
 * @param {string} sheetName - The sheetName parameter.
 * @returns {Function} - Returns the result.
 */
function officeChartSheetName(sheetName: string | undefined): () => string {
    const name: string =
    sheetName === undefined || String(sheetName).trim().length === 0
        ? 'Sheet1'
        : String(sheetName).trim();
    return () => name;
}

/**
 *
 * @returns {number} - Returns the result.
 */
function allocateOfficeChartId(): number {
    return nextOfficeChartId++;
}

/**
 * allocateOfficeChartName.
 *
 * @param {string} explicit - The explicit parameter.
 * @returns {string} - Returns the result.
 */
function allocateOfficeChartName(explicit?: string): string {
    if (explicit !== undefined && String(explicit).trim().length > 0) {
        return String(explicit).trim();
    }
    return `Chart ${nextOfficeChartName++}`;
}

/**
 * Build a classic {@link ChartEntry} the same way {@link ChartsImpl.addClassic}
 * does, without pushing onto a worksheet. Used only by host office factories.
 *
 * @param {CreateChartArgs} options - The options parameter.
 * @param {ClassicChartType} type - The type parameter.
 * @param {string} sheetName - The sheetName parameter.
 * @param {number} id - The id parameter.
 * @param {string} name - The name parameter.
 * @returns {ChartEntry} - Returns the result.
 */
function buildClassicOfficeChartEntry(
    options: CreateChartArgs,
    type: ClassicChartType,
    sheetName: string,
    id: number,
    name: string
): ChartEntry {
    const isSeriesInRows: boolean = options.isSeriesInRows === true;
    let series: SeriesModel[] = [];
    const dataRange: string | undefined =
    options.dataRange === undefined ? undefined : String(options.dataRange).trim();

    if (dataRange !== undefined && dataRange.length > 0) {
        series = deriveSeriesFromDataRange(dataRange, isSeriesInRows, sheetName);
    } else if (options.values !== undefined) {
        const values: string = String(options.values).trim();
        if (values.length === 0) {
            throw new InvalidChartError('createOfficeChart values must be a non-empty formula reference');
        }
        const categoryLabels: string = firstCategoryLabelFormula(options.categoryLabels);
        series = [
            {
                ...(categoryLabels !== undefined ? { categoryLabels } : {}),
                values,
                serieFormat: DEFAULT_FRAME(),
                dataLabels: DEFAULT_DATA_LABELS()
            }
        ];
    }

    const typeDefaults: PlotKind = plotKindFromType(type);
    if (typeDefaults.explosion !== undefined && typeDefaults.explosion > 0) {
        for (const s of series) {
            if (s.explodePercent === undefined) {
                s.explodePercent = typeDefaults.explosion;
            }
        }
    }
    if (type === ChartType.Bubble3D) {
        for (const s of series) {
            if (s.bubbleSize3D === undefined) {
                s.bubbleSize3D = true;
            }
        }
    }
    const grouping: BarGrouping = resolveGrouping(
        type,
        typeDefaults.barGrouping != null ? typeDefaults.barGrouping : typeDefaults.areaGrouping
    );
    const scatterStyle: ScatterStyle = resolveScatterStyle(type, typeDefaults.scatterStyle);
    const categoryAxis: AxisModel = DEFAULT_AXIS();
    const valueAxis: AxisModel = DEFAULT_AXIS();

    return {
        id,
        type,
        engine: 'classic',
        name,
        hasTitle: true,
        chartTitle: '',
        chartTitleArea: DEFAULT_TEXT_AREA(),
        chartArea: DEFAULT_FRAME(),
        plotArea: DEFAULT_FRAME(),
        ...(dataRange !== undefined && dataRange.length > 0 ? { dataRange } : {}),
        isSeriesInRows,
        ...(grouping !== undefined ? { grouping } : {}),
        ...(scatterStyle !== undefined ? { scatterStyle } : {}),
        dataSource: { kind: 'none' },
        series,
        row: options.row,
        column: options.column,
        colOffEmu: 0,
        rowOffEmu: 0,
        widthEmu: pointsToEmu(options.width),
        heightEmu: pointsToEmu(options.height),
        hasLegend: true,
        legendPosition: resolveLegendPosition(undefined),
        legendTextArea: DEFAULT_TEXT_AREA(),
        legendFrame: DEFAULT_FRAME(),
        hasDataTable: false,
        categoryAxis,
        valueAxis
    };
}

/**
 * Create a classic live {@link Chart} handle that is **not** owned by a worksheet.
 *
 * For DocIO/PPTX hosts that need a mutable chart model + {@link exportChartPart}
 * without calling `sheet.addChart`. Does not push into any worksheet chart
 * collection and does not mark any sheet dirty — existing XLSX sheet behavior
 * is unchanged.
 *
 * ChartEx layouts are not supported in this phase (same policy as
 * {@link exportChartPart}). Bind {@link ChartDataSource} after create via the
 * host helpers on `@syncfusion/ej2-xlsx/internal/charts`.
 *
 * @throws {InvalidArgumentError} when options or data are invalid.
 * @throws {InvalidChartError} when the type is ChartEx or unknown.
 *
 * @param {OfficeChartCreateOptions} options - The options parameter.
 * @returns {Chart} - Returns the result.
 */
export function createOfficeChart(options: OfficeChartCreateOptions): Chart {
    if (options === null || options === undefined || typeof options !== 'object') {
        throw new InvalidArgumentError('createOfficeChart options is required');
    }
    const sheetName: string =
    options.sheetName === undefined || String(options.sheetName).trim().length === 0
        ? 'Sheet1'
        : String(options.sheetName).trim();
    if (typeof options.type !== 'string' || options.type.length === 0) {
        throw new InvalidArgumentError('createOfficeChart type must be a non-empty string');
    }
    if (isChartExType(options.type)) {
        throw new InvalidChartError(
            'createOfficeChart does not support ChartEx charts; use residual host preserve for ChartEx'
        );
    }
    if (!isClassicChartType(options.type)) {
        throw new InvalidChartError(`Unknown chart type "${String(options.type)}"`);
    }
    if (options.data === null || options.data === undefined) {
        throw new InvalidArgumentError('createOfficeChart data is required');
    }
    // options.type is ClassicChartType after the guards above (same pattern as
    // ChartsImpl.add → addClassic). Pass the narrowed type, not createArgs.type
    // (still ChartType on CreateChartArgs), so sheet addChart paths stay untouched.
    const classicType: ClassicChartType = options.type;
    const createArgs: CreateChartArgs = normalizeCreateChartArgs(
        classicType,
        OFFICE_CHART_DUMMY_ROW,
        OFFICE_CHART_DUMMY_COLUMN,
        OFFICE_CHART_DUMMY_WIDTH_PT,
        OFFICE_CHART_DUMMY_HEIGHT_PT,
        options.data,
        options.values
    );

    const id: number = allocateOfficeChartId();
    const name: string = allocateOfficeChartName(options.name);
    const entry: ChartEntry = buildClassicOfficeChartEntry(
        createArgs,
        classicType,
        sheetName,
        id,
        name
    );
    if (options.chartTitle !== undefined) {
        entry.chartTitle = String(options.chartTitle);
        entry.hasTitle = true;
    }
    return new ChartHandle(entry, OFFICE_CHART_NOOP_DIRTY, officeChartSheetName(sheetName));
}

/**
 * Parse a `c:chartSpace` XML document into a detached live {@link Chart} handle.
 *
 * Returns `undefined` when the XML is not a chartSpace (host should keep residual
 * bytes). Unknown classic plot structures still yield a handle with
 * `preservedChartXml` when {@link parseChartSpace} returns a placeholder entry.
 * Does not attach the chart to any worksheet — existing XLSX load/materialize
 * paths are unchanged.
 *
 * @param {string} xml - The xml parameter.
 * @param {ParseOfficeChartOptions} options - The options parameter.
 * @returns {Chart | undefined} - Returns the result.
 */
export function parseOfficeChart(
    xml: string,
    options?: ParseOfficeChartOptions
): Chart | undefined {
    if (typeof xml !== 'string') {
        throw new InvalidArgumentError('parseOfficeChart xml must be a string');
    }
    const parsed: ParsedChartSpace = parseChartSpace(
        xml,
        options === undefined ? undefined : options.package,
        options === undefined ? undefined : options.chartPartName
    );
    if (parsed === undefined) {
        return undefined;
    }

    const sheetName: string =
    options === undefined ||
    options.sheetName === undefined ||
    String(options.sheetName).trim().length === 0
        ? 'Sheet1'
        : String(options.sheetName).trim();
    const id: number = allocateOfficeChartId();
    const name: string =
    parsed.name !== undefined && String(parsed.name).trim().length > 0
        ? String(parsed.name).trim()
        : allocateOfficeChartName();

    const entry: ChartEntry = {
        id,
        type: parsed.type,
        engine: 'classic',
        name,
        ...(parsed.chartTitle !== undefined ? { chartTitle: parsed.chartTitle } : {}),
        hasTitle: parsed.hasTitle,
        chartTitleArea: cloneTextArea(parsed.chartTitleArea),
        chartArea: cloneFrame(parsed.chartArea),
        plotArea: cloneFrame(parsed.plotArea),
        ...(parsed.dataRange !== undefined ? { dataRange: parsed.dataRange } : {}),
        isSeriesInRows: parsed.isSeriesInRows === true,
        ...(parsed.grouping !== undefined ? { grouping: parsed.grouping } : {}),
        ...(parsed.scatterStyle !== undefined ? { scatterStyle: parsed.scatterStyle } : {}),
        ...(parsed.view3D !== undefined ? { view3D: parsed.view3D } : {}),
        dataSource: parsed.dataSource,
        series: parsed.series.map((s: SeriesModel) => cloneSeriesModel(ensureSeriesFormat(s))),
        row: OFFICE_CHART_DUMMY_ROW,
        column: OFFICE_CHART_DUMMY_COLUMN,
        colOffEmu: 0,
        rowOffEmu: 0,
        widthEmu: pointsToEmu(OFFICE_CHART_DUMMY_WIDTH_PT),
        heightEmu: pointsToEmu(OFFICE_CHART_DUMMY_HEIGHT_PT),
        hasLegend: parsed.hasLegend,
        legendPosition: parsed.legendPosition,
        legendTextArea: cloneTextArea(parsed.legendTextArea),
        legendFrame: cloneFrame(parsed.legendFrame),
        hasDataTable: parsed.hasDataTable,
        categoryAxis: cloneAxis(ensureAxisFormat(parsed.categoryAxis)),
        valueAxis: cloneAxis(ensureAxisFormat(parsed.valueAxis)),
        ...(parsed.secondaryCategoryAxis !== undefined
            ? { secondaryCategoryAxis: cloneAxis(ensureAxisFormat(parsed.secondaryCategoryAxis)) }
            : {}),
        ...(parsed.secondaryValueAxis !== undefined
            ? { secondaryValueAxis: cloneAxis(ensureAxisFormat(parsed.secondaryValueAxis)) }
            : {}),
        ...(options !== undefined && options.chartPartName !== undefined
            ? { chartPartName: options.chartPartName }
            : {}),
        ...(parsed.preservedChartXml !== undefined
            ? { preservedChartXml: parsed.preservedChartXml }
            : {})
    };

    return new ChartHandle(entry, OFFICE_CHART_NOOP_DIRTY, officeChartSheetName(sheetName));
}

/**
 * Export serialized chart part XML + relationship descriptors for host packages.
 *
 * DocIO/PPTX call this instead of XLSX `materializeOnFlush`. They own the
 * drawing/frame and package paths; this library owns `c:chartSpace` XML and
 * reports the chart-part relationship intent for `c:externalData`.
 *
 * {@link createOfficeChart} / {@link parseOfficeChart}.
 * `kind: 'embedded'` (e.g. `../embeddings/Microsoft_Excel_Worksheet1.xlsx`).
 * When omitted, the relationship still carries `id` + package type; host fills target.
 *
 * @throws {InvalidArgumentError} when `chart` is not a library chart handle.
 * @throws {InvalidChartError} when the chart has no series or is ChartEx.
 * @param {Chart} chart - The chart parameter.
 * @param {Object} options - The options parameter.
 * @returns {ChartPartExport} - Returns the result.
 */
export function exportChartPart(
    chart: Chart,
    options?: { embeddedTarget?: string }
): ChartPartExport {
    if (!(chart instanceof ChartHandle)) {
        throw new InvalidArgumentError('chart must be a library Chart handle');
    }
    const entry: ChartEntry = chart.entry;
    if (isChartExEntry(entry)) {
        throw new InvalidChartError(
            'exportChartPart does not support ChartEx charts; save the workbook to emit chartEx parts'
        );
    }
    if (entry.series.length === 0) {
        throw new InvalidChartError(`Chart "${entry.name}" has no series`);
    }
    if (!isClassicChartType(entry.type)) {
        throw new InvalidChartError(`Chart "${entry.name}" has unknown classic type`);
    }
    const classicEntry: Parameters<typeof serializeChartSpace>[0] = {
        ...entry,
        type: entry.type
    };
    const dataSource: ChartDataSource = entry.dataSource;
    const xml: string =
    entry.preservedChartXml !== undefined && !entryNeedsRewrite(entry)
        ? entry.preservedChartXml
        : serializeChartSpace(classicEntry);
    return {
        xml,
        contentType: CHART_CONTENT_TYPE,
        chartRelationshipType: CHART_REL_TYPE_TRANSITIONAL,
        suggestedPartFileName: `chart${entry.id}.xml`,
        chartId: entry.id,
        chartName: entry.name,
        dataSource,
        relationships: buildHostChartRelationships(dataSource, (options == null ? undefined : options.embeddedTarget))
    };
}

/**
 * entryNeedsRewrite.
 *
 * @param {ChartEntry} _entry - The _entry parameter.
 * @returns {boolean} - Returns the result.
 */
function entryNeedsRewrite(_entry: ChartEntry): boolean {
    return true;
}

/**
 * buildHostChartRelationships.
 *
 * @param {ChartDataSource} dataSource - The dataSource parameter.
 * @param {string} embeddedTarget - The embeddedTarget parameter.
 * @returns {HostChartRelationship[]} - Returns the result.
 */
function buildHostChartRelationships(
    dataSource: ChartDataSource,
    embeddedTarget?: string
): HostChartRelationship[] {
    if (dataSource.kind === 'none') {return []; }
    if (dataSource.kind === 'external') {
        return [
            {
                id: dataSource.relationshipId,
                type: CHART_EXTERNAL_DATA_OLE_REL_TYPE,
                targetMode: 'External',
                ...(dataSource.target !== undefined ? { target: dataSource.target } : {})
            }
        ];
    }
    // embedded — package relationship; host supplies embedding path when omitted
    return [
        {
            id: dataSource.relationshipId,
            type: CHART_EXTERNAL_DATA_PACKAGE_REL_TYPE,
            ...(embeddedTarget !== undefined ? { target: embeddedTarget } : {})
        }
    ];
}

/**
 * Serialize a minimal valid `c:chartSpace` (dml-chart.xsd).
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeChartSpace(entry: {
    type: ChartType;
    chartTitle?: string | undefined;
    hasTitle?: boolean;
    chartTitleArea?: TextAreaModel;
    chartArea?: FrameModel;
    plotArea?: FrameModel;
    grouping?: BarGrouping | AreaGrouping | undefined;
    scatterStyle?: ScatterStyle | undefined;
    view3D?: ChartView3D | undefined;
    dataSource: ChartDataSource;
    /** Series formulas; `serieFormat` / `dataLabels` optional (defaults applied). */
    series: ReadonlyArray<SeriesModel>;
    hasLegend?: boolean;
    legendPosition?: LegendPositionValue;
    legendTextArea?: TextAreaModel;
    legendFrame?: FrameModel;
    hasDataTable?: boolean;
    categoryAxis?: AxisModel;
    valueAxis?: AxisModel;
    secondaryCategoryAxis?: AxisModel;
    secondaryValueAxis?: AxisModel;
    isSeriesInRows?: boolean | undefined;
    hasHighLowLines?: boolean | undefined;
}): string {
    const normalized: {
        series: (SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel })[];
        type: string;
        chartTitle?: string;
        hasTitle?: boolean;
        chartTitleArea?: TextAreaModel;
        chartArea?: FrameModel;
        plotArea?: FrameModel;
        grouping?: BarGrouping;
        scatterStyle?: ScatterStyle;
        view3D?: ChartView3D;
        dataSource: ChartDataSource;
        hasLegend?: boolean;
        legendPosition?: string;
        legendTextArea?: TextAreaModel;
        legendFrame?: FrameModel;
        hasDataTable?: boolean;
        categoryAxis?: AxisModel;
        valueAxis?: AxisModel;
        hasHighLowLines?: boolean;
    } = {
        ...entry,
        series: entry.series.map((s: SeriesModel) => ensureSeriesFormat({ ...s }))
    };
    const catAx: AxisModel = ensureAxisFormat((entry.categoryAxis != null ? entry.categoryAxis : DEFAULT_AXIS()));
    const valAx: AxisModel = ensureAxisFormat((entry.valueAxis != null ? entry.valueAxis : DEFAULT_AXIS()));
    const plot: string = serializePlotArea(
        normalized,
        catAx,
        valAx,
        entry.secondaryCategoryAxis,
        entry.secondaryValueAxis,
        entry.isSeriesInRows === true
    );
    const showTitle: boolean = entry.hasTitle !== false && entry.chartTitle !== undefined;
    const titleXml: string = showTitle
        ? serializeChartTitle(entry.chartTitle!, entry.chartTitleArea)
        : '';
    // A contour chart is a surface chart seen from straight above.
    const view3DXml: string = serializeView3D(
        entry.view3D !== undefined
            ? entry.view3D
            : plotKindFromType(entry.type).family === 'surface'
                ? { rotationX: 90, rotationY: 0, rightAngleAxis: false, perspective: 0 }
                : undefined
    );
    const legendXml: string =
    entry.hasLegend === false
        ? ''
        : serializeLegend(
            (entry.legendPosition != null ? entry.legendPosition : LegendPosition.Right),
            entry.legendTextArea,
            entry.legendFrame
        );
    // CT_PlotArea: dTable is a child of plotArea (after axes), never of CT_Chart.
    const dataTableXml: string =
    entry.hasDataTable === true
        ? '<c:dTable><c:showHorzBorder val="1"/><c:showVertBorder val="1"/><c:showOutline val="1"/><c:showKeys val="1"/></c:dTable>'
        : '';
    const chartSpaceSpPr: string = serializeSpPr(entry.chartArea);
    const plotAreaSpPr: string = serializeSpPr(entry.plotArea);
    const external: string =
    entry.dataSource.kind === 'none'
        ? ''
        : `<c:externalData r:id="${escapeXml(entry.dataSource.relationshipId)}"/>`;

    // CT_ChartSpace: date1904? → lang? → roundedCorners? → style? → … → chart → spPr → …
    // CT_PlotArea: layout → chart type(s) → axes → dTable → spPr.
    // Default style 2 matches common Excel workbook charts (CT_Style val 1–48).
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<c:chartSpace xmlns:c="${C_NS}" xmlns:a="${A_NS}" xmlns:r="${R_NS}">` +
    '<c:roundedCorners val="0"/><c:style val="2"/>' +
    `<c:chart>${titleXml}${view3DXml}` +
    `<c:plotArea><c:layout/>${plot}${dataTableXml}${plotAreaSpPr}</c:plotArea>` +
    `${legendXml}<c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart>` +
    chartSpaceSpPr +
    external +
    '</c:chartSpace>'
    );
}

/**
 * serializeChartTitle.
 *
 * @param {string} title - The title parameter.
 * @param {TextAreaModel | undefined} textArea - The textArea parameter.
 * @returns {string} - Returns the result.
 */
function serializeChartTitle(title: string, textArea: TextAreaModel | undefined): string {
    const rPr: string = serializeTextRPr(textArea);
    return (
        '<c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr/></a:pPr>' +
    `<a:r>${rPr}<a:t>${escapeXml(title)}</a:t></a:r></a:p></c:rich></c:tx>` +
    '<c:overlay val="0"/></c:title>'
    );
}

/**
 * serializeLegend.
 *
 * @param {LegendPositionValue} position - The position parameter.
 * @param {TextAreaModel} textArea - The textArea parameter.
 * @param {FrameModel} frame - The frame parameter.
 * @returns {string} - Returns the result.
 */
function serializeLegend(
    position: LegendPositionValue,
    textArea?: TextAreaModel,
    frame?: FrameModel
): string {
    // ST_LegendPos: b|t|l|r|tr — not the public API long names (right/bottom/…).
    // CT_Legend sequence (dml-chart.xsd): legendPos → legendEntry* → layout →
    // overlay → spPr → txPr → extLst. overlay MUST precede spPr/txPr.
    const pos: OoxmlLegendPos = legendPositionToOoxml(position);
    const spPr: string = serializeSpPr(frame);
    const txPr: string =
    textArea !== undefined && textAreaHasFormatting(textArea)
        ? `<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr>${serializeTextRPr(textArea, 'defRPr')}</a:pPr><a:endParaRPr lang="en-US"/></a:p></c:txPr>`
        : '';
    return `<c:legend><c:legendPos val="${pos}"/><c:overlay val="0"/>${spPr}${txPr}</c:legend>`;
}

/**
 * serializeView3D.
 *
 * @param {ChartView3D | undefined} view - The view parameter.
 * @returns {string} - Returns the result.
 */
function serializeView3D(view: ChartView3D | undefined): string {
    if (view === undefined) {return ''; }
    const parts: string[] = [];
    if (view.rotationX !== undefined) {parts.push(`<c:rotX val="${view.rotationX}"/>`); }
    if (view.heightPercent !== undefined) {parts.push(`<c:hPercent val="${view.heightPercent}"/>`); }
    if (view.rotationY !== undefined) {parts.push(`<c:rotY val="${view.rotationY}"/>`); }
    if (view.depthPercent !== undefined) {parts.push(`<c:depthPercent val="${view.depthPercent}"/>`); }
    if (view.rightAngleAxis !== undefined) {
        parts.push(`<c:rAngAx val="${view.rightAngleAxis ? '1' : '0'}"/>`);
    }
    if (view.perspective !== undefined) {parts.push(`<c:perspective val="${view.perspective}"/>`); }
    if (parts.length === 0) {return ''; }
    return `<c:view3D>${parts.join('')}</c:view3D>`;
}

/**
 * serializePlotArea.
 *
 * @param {Object} entry - The entry parameter.
 * @param {AxisModel} catAx - The catAx parameter.
 * @param {AxisModel} valAx - The valAx parameter.
 * @param {boolean} isSeriesInRows - The isSeriesInRows parameter.
 * @returns {string} - Returns the result.
 */
function serializePlotArea(
    entry: {
        type: ChartType;
        grouping?: BarGrouping | AreaGrouping | undefined;
        scatterStyle?: ScatterStyle | undefined;
        series: ReadonlyArray<SeriesModel>;
        hasHighLowLines?: boolean;
    },
    catAx: AxisModel,
    valAx: AxisModel,
    secondaryCatAx?: AxisModel,
    secondaryValAx?: AxisModel,
    isSeriesInRows: boolean = false
): string {
    const kind: PlotKind = plotKindFromType(entry.type);
    const secCatAx: AxisModel = ensureAxisFormat(secondaryCatAx != null ? secondaryCatAx : DEFAULT_SECONDARY_CATEGORY_AXIS());
    const secValAx: AxisModel = ensureAxisFormat(secondaryValAx != null ? secondaryValAx : DEFAULT_SECONDARY_VALUE_AXIS());
    if (kind.family === 'stock') {
        return serializeStockPlotArea(entry, kind, catAx, valAx, secCatAx, secValAx);
    }
    const placements: SeriesPlacement[] = resolveSeriesPlacements(entry);
    if (needsComboLayout(entry.type, placements)) {
        return serializeComboPlotArea(entry.series, placements, catAx, valAx, secCatAx, secValAx);
    }
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const axCat: 1 = 1;
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const axVal: 2 = 2;
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const axSer: 3 = 3;
    const barGrouping: BarGrouping =
    ((__t: BarGrouping) => __t != null ? __t : 'clustered')((entry.grouping as BarGrouping | undefined) != null ? (entry.grouping as BarGrouping | undefined) : kind.barGrouping);
    const areaGrouping: AreaGrouping =
    ((__t: AreaGrouping) => __t != null ? __t : 'standard')((entry.grouping as AreaGrouping | undefined) != null ? (entry.grouping as AreaGrouping | undefined) : kind.areaGrouping);
    const scatterStyle: ScatterStyle = ((__t: ScatterStyle) => __t != null ? __t : 'marker')(entry.scatterStyle != null ? entry.scatterStyle : kind.scatterStyle);

    if (kind.family === 'pie' || kind.family === 'pie3d') {
        const tag: string = kind.family === 'pie3d' ? 'pie3DChart' : 'pieChart';
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, {
                    serKind: 'pie',
                    explosion: kind.explosion,
                    plotFamily: kind.family
                })
            )
            .join('');
        return `<c:${tag}><c:varyColors val="1"/>${sers}</c:${tag}>`;
    }

    if (kind.family === 'doughnut') {
        const hole: number = (kind.holeSize != null ? kind.holeSize : DEFAULT_DOUGHNUT_HOLE_SIZE);
        const explosion: number = kind.explosion;
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, {
                    serKind: 'pie',
                    explosion,
                    plotFamily: 'doughnut'
                })
            )
            .join('');
        return (
            `<c:doughnutChart><c:varyColors val="1"/>${sers}` +
      `<c:holeSize val="${hole}"/></c:doughnutChart>`
        );
    }

    if (kind.family === 'ofPie') {
        const ofPieType: OfPieType = (kind.ofPieType != null ? kind.ofPieType : 'pie');
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, { serKind: 'pie', plotFamily: 'ofPie' })
            )
            .join('');
        return (
            `<c:ofPieChart><c:ofPieType val="${ofPieType}"/>` +
      `<c:varyColors val="1"/>${sers}</c:ofPieChart>`
        );
    }

    if (kind.family === 'scatter') {
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) => serializeScatterSer(s, i, { plotFamily: 'scatter' }))
            .join('');
        return (
            `<c:scatterChart><c:scatterStyle val="${scatterStyle}"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:scatterChart>` +
      serializeValAx(axCat, axVal, 'b', catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    if (kind.family === 'bubble') {
    // CT_BubbleChart sequence (dml-chart.xsd): varyColors? → ser* → dLbls? →
    // bubble3D? → bubbleScale? → showNegBubbles? → sizeRepresents? → axId{2}.
    // Group-level bubble3D is intentionally NOT emitted: Office does not allow
    // it as a child of bubbleChart ([MS-OE376] §2.1.1458(b)); the 3-D effect
    // for Bubble3D is per-series on CT_BubbleSer.
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) => serializeBubbleSer(s, i, entry.type))
            .join('');
        return (
            `<c:bubbleChart><c:varyColors val="0"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:bubbleChart>` +
      serializeValAx(axCat, axVal, 'b', catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    if (kind.family === 'bar') {
        return (
            serializeCatValGroup(kind, indexSeries(entry.series), axCat, axVal, barGrouping, areaGrouping) +
      serializeCatAx(axCat, axVal, catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    if (kind.family === 'bar3d') {
        const barDir: string = (kind.barDir != null ? kind.barDir : 'col');
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, {
                    serKind: 'bar',
                    plotFamily: 'bar3d',
                    barGrouping
                })
            )
            .join('');
        // Excel emits shape=box by default for bar3DChart; include for parity.
        return (
            `<c:bar3DChart><c:barDir val="${barDir}"/><c:grouping val="${barGrouping}"/>` +
      `<c:varyColors val="0"/>${sers}<c:shape val="box"/>` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:bar3DChart>` +
      serializeCatAx(axCat, axVal, catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    if (kind.family === 'area' || kind.family === 'area3d') {
        const tag: string = kind.family === 'area3d' ? 'area3DChart' : 'areaChart';
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, { serKind: 'area', plotFamily: kind.family })
            )
            .join('');
        return (
            `<c:${tag}><c:grouping val="${areaGrouping}"/><c:varyColors val="0"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:${tag}>` +
      serializeCatAx(axCat, axVal, catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    if (kind.family === 'line') {
        return (
            serializeCatValGroup(kind, indexSeries(entry.series), axCat, axVal, barGrouping, areaGrouping) +
      serializeCatAx(axCat, axVal, catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    if (kind.family === 'line3d') {
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, { serKind: 'line', plotFamily: 'line3d' })
            )
            .join('');
        return (
            `<c:line3DChart><c:grouping val="${areaGrouping}"/><c:varyColors val="0"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/><c:axId val="${axSer}"/></c:line3DChart>` +
      serializeCatAx(axCat, axVal, catAx) +
      serializeValAx(axVal, axCat, 'l', valAx) +
      serializeSerAx(axSer, axCat)
        );
    }

    if (kind.family === 'surface3d' || kind.family === 'surface') {
    // CT_SurfaceSer: idx/order/tx/spPr/cat/val only — no dLbls/marker/explosion.
    // surface3DChart is the 3-D surface; surfaceChart is the top-down contour view.
    // Both carry c:wireframe (EG_SurfaceChartShared) and the same three axes.
        const tag: string = kind.family === 'surface3d' ? 'surface3DChart' : 'surfaceChart';
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) => serializeCatValSer(s, i, { serKind: 'surface' }))
            .join('');
        return (
            `<c:${tag}><c:wireframe val="${kind.wireframe === true ? '1' : '0'}"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/><c:axId val="${axSer}"/></c:${tag}>` +
      serializeCatAx(axCat, axVal, catAx, true, isSeriesInRows) +
      serializeValAx(axVal, axCat, 'l', valAx) +
      serializeSerAx(axSer, axCat)
        );
    }

    if (kind.family === 'radar') {
    // CT_RadarChart: radarStyle → varyColors → ser* → dLbls? → axId{2}.
        const radarStyle: RadarStyle = (kind.radarStyle != null ? kind.radarStyle : 'standard');
        const sers: string = entry.series
            .map((s: SeriesModel, i: number) =>
                serializeCatValSer(s, i, { serKind: 'radar', plotFamily: 'radar', radarStyle })
            )
            .join('');
        return (
            `<c:radarChart><c:radarStyle val="${radarStyle}"/><c:varyColors val="0"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:radarChart>` +
      serializeCatAx(axCat, axVal, catAx) +
      serializeValAx(axVal, axCat, 'l', valAx)
        );
    }

    throw new InvalidChartError(`Unsupported chart type "${entry.type}"`);
}

/** One series with its zero-based position on the chart (the value of `c:idx` and `c:order`). */
interface IndexedSeries {
    readonly s: SeriesModel;
    readonly i: number;
}

/**
 * Pair each series with its position on the chart.
 *
 * @param {ReadonlyArray<SeriesModel>} series - The series parameter.
 * @returns {IndexedSeries[]} - Returns the result.
 */
function indexSeries(series: ReadonlyArray<SeriesModel>): IndexedSeries[] {
    return series.map((s: SeriesModel, i: number) => ({ s, i }));
}

/**
 * One plot group (`c:barChart`, `c:lineChart` or `c:areaChart`) over category axes.
 * Shared by the single-type charts and by the combination charts, where each
 * group holds the series of one type.
 *
 * @param {PlotKind} kind - The kind parameter.
 * @param {ReadonlyArray<IndexedSeries>} items - The items parameter.
 * @param {number} axCat - The axCat parameter.
 * @param {number} axVal - The axVal parameter.
 * @param {BarGrouping} barGrouping - The barGrouping parameter.
 * @param {AreaGrouping} areaGrouping - The areaGrouping parameter.
 * @returns {string} - Returns the result.
 */
function serializeCatValGroup(
    kind: PlotKind,
    items: ReadonlyArray<IndexedSeries>,
    axCat: number,
    axVal: number,
    barGrouping: BarGrouping,
    areaGrouping: AreaGrouping
): string {
    if (kind.family === 'bar') {
        const barDir: string = (kind.barDir != null ? kind.barDir : 'col');
        const sers: string = items
            .map((it: IndexedSeries) =>
                serializeCatValSer(it.s, it.i, { serKind: 'bar', plotFamily: 'bar', barGrouping })
            )
            .join('');
        return (
            `<c:barChart><c:barDir val="${barDir}"/><c:grouping val="${barGrouping}"/>` +
      `<c:varyColors val="0"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:barChart>`
        );
    }
    if (kind.family === 'area') {
        const sers: string = items
            .map((it: IndexedSeries) => serializeCatValSer(it.s, it.i, { serKind: 'area', plotFamily: 'area' }))
            .join('');
        return (
            `<c:areaChart><c:grouping val="${areaGrouping}"/><c:varyColors val="0"/>${sers}` +
      `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:areaChart>`
        );
    }
    const sers: string = items
        .map((it: IndexedSeries) =>
            serializeCatValSer(it.s, it.i, {
                serKind: 'line',
                showMarkers: kind.showMarkers === true,
                plotFamily: 'line'
            })
        )
        .join('');
    const markerXml: string = kind.showMarkers ? '<c:marker val="1"/>' : '';
    return (
        `<c:lineChart><c:grouping val="${areaGrouping}"/><c:varyColors val="0"/>${sers}` +
    `${markerXml}<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:lineChart>`
    );
}

/** The type a series is drawn as and the value axis it uses (combination charts). */
interface SeriesPlacement {
    readonly type: ChartType;
    readonly secondary: boolean;
}

/**
 * Whether `type` is one of the two combination presets.
 *
 * @param {ChartType} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
function isComboPreset(type: ChartType): boolean {
    return type === ChartType.ColumnClusteredLine || type === ChartType.ColumnClusteredLineSecondaryAxis;
}

/**
 * Whether a series may be drawn as `type` inside a combination chart: 2-D
 * column, line or area (the types that share category axes and can be mixed).
 *
 * @param {unknown} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
function isComboSeriesType(type: unknown): boolean {
    if (!isClassicChartType(type)) {return false; }
    const kind: PlotKind = plotKindFromType(type);
    return (kind.family === 'bar' && kind.barDir === 'col') || kind.family === 'line' || kind.family === 'area';
}

/**
 * Resolve, for every series, the type it is drawn as and the axis it uses.
 *
 * - An explicit {@link SeriesModel.serieType} / {@link SeriesModel.usePrimaryAxis} wins.
 * - The combination presets draw every series as a clustered column except the
 *   last, which is a line with markers (on the secondary axis for
 *   `ColumnClusteredLineSecondaryAxis`).
 * - Any other chart type draws every series as the chart type, on the primary axis.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {SeriesPlacement[]} - Returns the result.
 */
function resolveSeriesPlacements(entry: { type: ChartType; series: ReadonlyArray<SeriesModel> }): SeriesPlacement[] {
    const count: number = entry.series.length;
    const preset: boolean = isComboPreset(entry.type);
    const presetSecondary: boolean = entry.type === ChartType.ColumnClusteredLineSecondaryAxis;
    return entry.series.map((s: SeriesModel, i: number): SeriesPlacement => {
        const presetLine: boolean = preset && count > 1 && i === count - 1;
        const defaultType: ChartType = preset
            ? (presetLine ? ChartType.LineMarkers : ChartType.ColumnClustered)
            : entry.type;
        return {
            type: s.serieType !== undefined ? s.serieType : defaultType,
            secondary: s.usePrimaryAxis !== undefined ? !s.usePrimaryAxis : presetSecondary && presetLine
        };
    });
}

/**
 * Whether the chart needs one plot group per series type (and possibly a
 * secondary axis pair) rather than the single plot group of its chart type.
 *
 * @param {ChartType} type - The type parameter.
 * @param {ReadonlyArray<SeriesPlacement>} placements - The placements parameter.
 * @returns {boolean} - Returns the result.
 */
function needsComboLayout(type: ChartType, placements: ReadonlyArray<SeriesPlacement>): boolean {
    if (isComboPreset(type)) {return true; }
    return placements.some(
        (p: SeriesPlacement) => p.secondary || p.type !== placements[0].type
    );
}

/** The series of one combination-chart plot group. */
interface ComboGroup {
    readonly type: ChartType;
    readonly secondary: boolean;
    readonly items: IndexedSeries[];
}

/**
 * Plot area for a combination chart: one plot group per distinct
 * (series type, axis) pair, primary groups first. Primary groups use axes 1/2;
 * secondary groups use axes 3/4 (a hidden category axis and a value axis on the
 * right that crosses at the maximum), as Excel writes them.
 *
 * @param {ReadonlyArray<SeriesModel>} series - The series parameter.
 * @param {ReadonlyArray<SeriesPlacement>} placements - The placements parameter.
 * @param {AxisModel} catAx - The catAx parameter.
 * @param {AxisModel} valAx - The valAx parameter.
 * @param {AxisModel} secCatAx - The secCatAx parameter.
 * @param {AxisModel} secValAx - The secValAx parameter.
 * @returns {string} - Returns the result.
 */
function serializeComboPlotArea(
    series: ReadonlyArray<SeriesModel>,
    placements: ReadonlyArray<SeriesPlacement>,
    catAx: AxisModel,
    valAx: AxisModel,
    secCatAx: AxisModel,
    secValAx: AxisModel
): string {
    const groups: ComboGroup[] = [];
    series.forEach((s: SeriesModel, i: number) => {
        const placement: SeriesPlacement = placements[i];
        if (!isComboSeriesType(placement.type)) {
            throw new InvalidChartError(
                `Series ${i} cannot be drawn as "${String(placement.type)}" in a combination chart; ` +
                'use a 2-D column, line or area type'
            );
        }
        let group: ComboGroup = groups.find(
            (g: ComboGroup) => g.type === placement.type && g.secondary === placement.secondary
        );
        if (group === undefined) {
            group = { type: placement.type, secondary: placement.secondary, items: [] };
            groups.push(group);
        }
        group.items.push({ s, i });
    });
    if (groups.length === 0) {
        groups.push({ type: ChartType.ColumnClustered, secondary: false, items: [] });
    }
    if (!groups.some((g: ComboGroup) => !g.secondary)) {
        throw new InvalidChartError('At least one series must use the primary axis');
    }
    const ordered: ComboGroup[] = groups
        .filter((g: ComboGroup) => !g.secondary)
        .concat(groups.filter((g: ComboGroup) => g.secondary));
    const hasSecondary: boolean = ordered.some((g: ComboGroup) => g.secondary);
    const groupXml: string = ordered
        .map((g: ComboGroup) => {
            const kind: PlotKind = plotKindFromType(g.type);
            return serializeCatValGroup(
                kind,
                g.items,
                g.secondary ? 3 : 1,
                g.secondary ? 4 : 2,
                (kind.barGrouping != null ? kind.barGrouping : 'clustered'),
                (kind.areaGrouping != null ? kind.areaGrouping : 'standard')
            );
        })
        .join('');
    return (
        groupXml +
    serializeCatAx(1, 2, catAx) +
    serializeValAx(2, 1, 'l', valAx) +
    (hasSecondary ? serializeValAx(4, 3, 'r', secValAx, 'max') + serializeCatAx(3, 4, secCatAx) : '')
    );
}

/** Series names, in order, each stock layout expects. */
const STOCK_SERIES_ORDER: { [layout: string]: ReadonlyArray<string> } = {
    hlc: ['High', 'Low', 'Close'],
    ohlc: ['Open', 'High', 'Low', 'Close'],
    vhlc: ['Volume', 'High', 'Low', 'Close'],
    vohlc: ['Volume', 'Open', 'High', 'Low', 'Close']
};

/**
 * buildNumCacheElement.
 * Builds the <c:numCache> element for series value caching.
 * Required by Excel to recognize and render stock chart elements including High-Low Lines.
 *
 * @param {number[]} values - Array of numeric values to cache.
 * @returns {string} - Returns the numCache XML element.
 */
function buildNumCacheElement(values: number[]): string {
    if (!values || values.length === 0) {
        return '';
    }
    const pointElements: string = values
        .map((v: number, idx: number) => `<c:pt idx="${idx}"><c:v>${v}</c:v></c:pt>`)
        .join('');
    return (
        `<c:numCache><c:formatCode>General</c:formatCode><c:ptCount val="${values.length}"/>` +
        `${pointElements}</c:numCache>`
    );
}

/**
 * Stock series: a `c:lineChart`-style series (CT_LineSer) with its line hidden —
 * the high-low lines and up-down bars carry the picture. The Close series of a
 * High-Low-Close chart gets a dash marker so the closing value is visible.
 *
 * @param {SeriesModel} s - The s parameter.
 * @param {number} index - The index parameter.
 * @param {boolean} closeMarker - The closeMarker parameter.
 * @param {number[]} cachedValues - Numeric values to cache for Excel stock chart rendering.
 * @returns {string} - Returns the result.
 */
function serializeStockSer(s: SeriesModel, index: number, closeMarker: boolean, cachedValues?: number[]): string {
    const model: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(s);
    // Prefer titleFormula (preserved from loading) over title (value or plain text).
    // titleFormula is set when a formula reference was found in the source XML.
    const titleToSerialize: string | undefined = model.titleFormula !== undefined ? model.titleFormula : model.title;
    const tx: string =
    titleToSerialize === undefined
        ? ''
        : looksLikeFormula(titleToSerialize)
            ? `<c:tx><c:strRef><c:f>${escapeXml(titleToSerialize)}</c:f></c:strRef></c:tx>`
            : `<c:tx><c:v>${escapeXml(titleToSerialize)}</c:v></c:tx>`;
    const custom: string = serializeSpPr(model.serieFormat);
    const spPr: string =
    custom.length > 0
        ? custom
        : '<c:spPr><a:ln w="19050" cap="rnd"><a:noFill/><a:round/></a:ln></c:spPr>';
    const marker: string = closeMarker
        ? '<c:marker><c:symbol val="dash"/><c:size val="5"/></c:marker>'
        : '<c:marker><c:symbol val="none"/></c:marker>';
    const dLbls: string = serializeDataLabels(model.dataLabels, resolveDLblPosPolicy('line'));
    const cat: string =
    model.categoryLabels === undefined
        ? ''
        : `<c:cat><c:strRef><c:f>${escapeXml(model.categoryLabels)}</c:f></c:strRef></c:cat>`;
    // Include numCache (cached point data) to enable Excel stock chart rendering, including High-Low Lines
    const numCache: string = buildNumCacheElement(cachedValues);
    const val: string = (
        `<c:val><c:numRef><c:f>${escapeXml(model.values)}</c:f>` +
        (numCache.length > 0 ? numCache : '') +
        `</c:numRef></c:val>`
    );
    return (
        `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}${marker}${dLbls}${cat}${val}` +
    '<c:smooth val="0"/></c:ser>'
    );
}

/** Up/down bars for Open-High-Low-Close: white up bars, black down bars. */
const STOCK_UP_DOWN_BARS: string =
  '<c:upDownBars><c:gapWidth val="150"/>' +
  '<c:upBars><c:spPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>' +
  '<a:ln w="9525"><a:solidFill><a:srgbClr val="000000"/></a:solidFill></a:ln></c:spPr></c:upBars>' +
  '<c:downBars><c:spPr><a:solidFill><a:srgbClr val="000000"/></a:solidFill>' +
  '<a:ln w="9525"><a:solidFill><a:srgbClr val="000000"/></a:solidFill></a:ln></c:spPr></c:downBars>' +
  '</c:upDownBars>';

/**
 * Plot area for the four stock charts.
 *
 * Series must be in the order the layout expects (see {@link ChartType.StockHighLowClose}
 * and friends). The volume layouts draw the first series as columns on the
 * primary axes and the price series as a `c:stockChart` on the secondary axes,
 * which is how Excel writes them; the price axis is
 * {@link Chart.secondaryValueAxis}.
 *
 * @param {Object} entry - The entry parameter.
 * @param {PlotKind} kind - The kind parameter.
 * @param {AxisModel} catAx - The catAx parameter.
 * @param {AxisModel} valAx - The valAx parameter.
 * @param {AxisModel} secCatAx - The secCatAx parameter.
 * @param {AxisModel} secValAx - The secValAx parameter.
 * @returns {string} - Returns the result.
 */
function serializeStockPlotArea(
    entry: { type: ChartType; series: ReadonlyArray<SeriesModel>; hasHighLowLines?: boolean; highLowLinesFormat?: LineModel },
    kind: PlotKind,
    catAx: AxisModel,
    valAx: AxisModel,
    secCatAx: AxisModel,
    secValAx: AxisModel
): string {
    const layout: StockLayout = kind.stock;
    const order: ReadonlyArray<string> = STOCK_SERIES_ORDER[layout];
    if (entry.series.length !== order.length) {
        throw new InvalidChartError(
            `Chart type "${entry.type}" needs ${order.length} series (${order.join(', ')}) ` +
            `but the chart has ${entry.series.length}`
        );
    }
    const hasVolume: boolean = layout === 'vhlc' || layout === 'vohlc';
    const hasOpen: boolean = layout === 'ohlc' || layout === 'vohlc';
    const firstPrice: number = hasVolume ? 1 : 0;
    const axCat: number = hasVolume ? 3 : 1;
    const axVal: number = hasVolume ? 4 : 2;
    // For stock charts, we need to generate cached values for Excel to properly render High-Low Lines
    // Extract numeric values from series formulas (placeholder implementation - future: resolve from worksheet)
    const generatePlaceholderCache = (seriesIndex: number): number[] => {
        const s: SeriesModel = entry.series[seriesIndex];
        if (!s || !s.values) {
            return [];
        }
        // For now, generate placeholder numeric values (100, 101, 102...)
        // This ensures the numCache structure exists; actual values should be loaded from worksheet
        // when available. This is sufficient for Excel to recognize and render stock chart elements.
        const placeholderCount: number = 3;
        return Array.from({ length: placeholderCount }, (_, i: number) => 100 + i);
    };

    const sers: string = entry.series
        .slice(firstPrice)
        .map((s: SeriesModel, k: number) => {
            const cachedValues: number[] = generatePlaceholderCache(firstPrice + k);
            return serializeStockSer(s, firstPrice + k, !hasOpen && firstPrice + k === entry.series.length - 1, cachedValues);
        })
        .join('');
    // CT_StockChart: ser{3,4} → dLbls? → dropLines? → hiLowLines? → upDownBars? → axId{2}.
    // Per ECMA-376 and Office behavior, emit styled hiLowLines element (CT_ChartLines with spPr)
    // when hasHighLowLines is true (default). When false, omit the element.
    // Use model-driven formatting from entry.highLowLinesFormat if available, else use defaults
    // for backward compatibility.
    const showHighLowLines: boolean = entry.hasHighLowLines !== false;
    const hiLowLines: string = buildHighLowLinesElement(showHighLowLines, entry.highLowLinesFormat);
    const stock: string =
    `<c:stockChart>${sers}${hiLowLines}${hasOpen ? STOCK_UP_DOWN_BARS : ''}` +
    `<c:axId val="${axCat}"/><c:axId val="${axVal}"/></c:stockChart>`;
    if (!hasVolume) {
        return stock + serializeCatAx(1, 2, catAx) + serializeValAx(2, 1, 'l', valAx);
    }
    const volume: string = serializeCatValGroup(
        plotKindFromType(ChartType.ColumnClustered),
        [{ s: entry.series[0], i: 0 }],
        1,
        2,
        'clustered',
        'standard'
    );
    return (
        volume +
    stock +
    serializeCatAx(1, 2, catAx) +
    serializeValAx(2, 1, 'l', valAx) +
    serializeValAx(4, 3, 'r', secValAx, 'max') +
    serializeCatAx(3, 4, secCatAx)
    );
}

/** Series schema family — drives legal child element set and order (dml-chart.xsd). */
type SerKind = 'bar' | 'line' | 'area' | 'pie' | 'surface' | 'radar';

/**
 * MS-OE376 §2.1.1475 (dLblPos): Office forbids or restricts `c:dLblPos` by chart group.
 * XSD still allows any ST_DLblPos; Excel repairs (often by removing the drawing) when violated.
 *
 * - areaChart / area3DChart / bar3DChart / doughnutChart / line3DChart / radarChart:
 * element shall NOT be specified (Office defaults: area/doughnut → Center, etc.).
 * - pie / ofPie / pie3D: bestFit | outEnd | inEnd | ctr
 * - barChart clustered: inBase | inEnd | outEnd | ctr
 * - barChart stacked | percentStacked: inBase | inEnd | ctr (no outEnd)
 * - line / scatter (/ bubble / stock): l | r | b | t | ctr
 *
 * @param {string} plotFamily - The plotFamily parameter.
 * @param {BarGrouping} barGrouping - The barGrouping parameter.
 * @returns {Object} - Returns the result.
 */
function resolveDLblPosPolicy(
    plotFamily: PlotKind['family'] | undefined,
    barGrouping?: BarGrouping
): { readonly emit: boolean; readonly allowed?: ReadonlySet<OoxmlDLblPos> } {
    if (
        plotFamily === 'area' ||
    plotFamily === 'area3d' ||
    plotFamily === 'bar3d' ||
    plotFamily === 'doughnut' ||
    plotFamily === 'line3d' ||
    plotFamily === 'radar'
    ) {
        return { emit: false };
    }
    if (plotFamily === 'pie' || plotFamily === 'pie3d' || plotFamily === 'ofPie') {
        return { emit: true, allowed: new Set<OoxmlDLblPos>(['bestFit', 'outEnd', 'inEnd', 'ctr']) };
    }
    if (plotFamily === 'line' || plotFamily === 'scatter' || plotFamily === 'bubble') {
        return { emit: true, allowed: new Set<OoxmlDLblPos>(['l', 'r', 'b', 't', 'ctr']) };
    }
    if (plotFamily === 'bar') {
        if (barGrouping === 'stacked' || barGrouping === 'percentStacked') {
            return { emit: true, allowed: new Set<OoxmlDLblPos>(['inBase', 'inEnd', 'ctr']) };
        }
        return { emit: true, allowed: new Set<OoxmlDLblPos>(['inBase', 'inEnd', 'outEnd', 'ctr']) };
    }
    // Unknown / surface (no dLbls) — emit unrestricted ST_DLblPos if labels exist.
    return { emit: true };
}

/**
 * serializeCatValSer.
 *
 * @param {SeriesModel} s - The s parameter.
 * @param {number} index - The index parameter.
 * @param {Object} opts - The opts parameter.
 * @returns {string} - Returns the result.
 */
function serializeCatValSer(
    s: SeriesModel,
    index: number,
    opts?: {
        serKind?: SerKind;
        explosion?: number | undefined;
        showMarkers?: boolean;
        plotFamily?: PlotKind['family'];
        barGrouping?: BarGrouping;
        radarStyle?: RadarStyle;
    }
): string {
    const model: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(s);
    const serKind: SerKind = ((__t: SerKind) => __t != null ? __t : 'bar')(opts == null ? undefined : opts.serKind);
    // Prefer titleFormula (preserved from loading) over title (value or plain text).
    const titleToSerialize: string | undefined = model.titleFormula !== undefined ? model.titleFormula : model.title;
    const tx: string =
    titleToSerialize === undefined
        ? ''
        : looksLikeFormula(titleToSerialize)
            ? `<c:tx><c:strRef><c:f>${escapeXml(titleToSerialize)}</c:f></c:strRef></c:tx>`
            : `<c:tx><c:v>${escapeXml(titleToSerialize)}</c:v></c:tx>`;
    const spPr: string = serializeSpPr(model.serieFormat);
    const cat: string =
    model.categoryLabels === undefined
        ? ''
        : `<c:cat><c:strRef><c:f>${escapeXml(model.categoryLabels)}</c:f></c:strRef></c:cat>`;
    const val: string = `<c:val><c:numRef><c:f>${escapeXml(model.values)}</c:f></c:numRef></c:val>`;

    // CT_SurfaceSer forbids dLbls / marker / explosion.
    if (serKind === 'surface') {
        return `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}${cat}${val}</c:ser>`;
    }

    const explosionValue: number =
    model.explodePercent !== undefined ? model.explodePercent : (opts == null ? undefined : opts.explosion);
    const explosion: string =
    serKind === 'pie' && explosionValue !== undefined && explosionValue > 0
        ? `<c:explosion val="${Math.round(explosionValue)}"/>`
        : '';
    // CT_LineSer: marker before dLbls before cat/val. Prefer a concrete symbol so Excel
    // does not reject empty CT_Marker content.
    // CT_RadarSer has the same order: standard radar hides markers, marker radar
    // shows them, filled radar leaves them out.
    const radarStyle: RadarStyle = (opts == null ? undefined : opts.radarStyle);
    let marker: string = '';
    if (serKind === 'line' && (opts == null ? undefined : opts.showMarkers) === true) {
        marker = '<c:marker><c:symbol val="circle"/><c:size val="7"/></c:marker>';
    } else if (serKind === 'radar' && radarStyle === 'standard') {
        marker = '<c:marker><c:symbol val="none"/></c:marker>';
    } else if (serKind === 'radar' && radarStyle === 'marker') {
        marker = '<c:marker><c:symbol val="circle"/><c:size val="5"/></c:marker>';
    }
    const dLblPosPolicy: { readonly emit: boolean; readonly allowed?: ReadonlySet<OoxmlDLblPos> } =
        resolveDLblPosPolicy(
            (opts == null ? undefined : opts.plotFamily),
            (opts == null ? undefined : opts.barGrouping)
        );
    const dLbls: string = serializeDataLabels(model.dataLabels, dLblPosPolicy);

    // CT_BarSer / CT_AreaSer / CT_PieSer / CT_LineSer: dLbls (and line marker) BEFORE cat/val.
    if (serKind === 'line' || serKind === 'radar') {
        return (
            `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}` +
      `${marker}${dLbls}${cat}${val}</c:ser>`
        );
    }
    if (serKind === 'pie') {
        return (
            `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}` +
      `${explosion}${dLbls}${cat}${val}</c:ser>`
        );
    }
    // bar | area
    return (
        `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}` +
    `${dLbls}${cat}${val}</c:ser>`
    );
}

/**
 * serializeScatterSer.
 *
 * @param {SeriesModel} s - The s parameter.
 * @param {number} index - The index parameter.
 * @param {Object} opts - The opts parameter.
 * @returns {string} - Returns the result.
 */
function serializeScatterSer(
    s: SeriesModel,
    index: number,
    opts?: { plotFamily?: PlotKind['family'] }
): string {
    const model: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(s);
    // Prefer titleFormula (preserved from loading) over title (value or plain text).
    const titleToSerialize: string | undefined = model.titleFormula !== undefined ? model.titleFormula : model.title;
    const tx: string =
    titleToSerialize === undefined
        ? ''
        : looksLikeFormula(titleToSerialize)
            ? `<c:tx><c:strRef><c:f>${escapeXml(titleToSerialize)}</c:f></c:strRef></c:tx>`
            : `<c:tx><c:v>${escapeXml(titleToSerialize)}</c:v></c:tx>`;
    const spPr: string = serializeSpPr(model.serieFormat);
    const xVal: string =
    model.categoryLabels === undefined
        ? ''
        : `<c:xVal><c:numRef><c:f>${escapeXml(model.categoryLabels)}</c:f></c:numRef></c:xVal>`;
    const yVal: string = `<c:yVal><c:numRef><c:f>${escapeXml(model.values)}</c:f></c:numRef></c:yVal>`;
    const dLbls: string = serializeDataLabels(
        model.dataLabels,
        resolveDLblPosPolicy(((__t: PlotKind['family']) => __t != null ? __t : 'scatter')(opts == null ? undefined : opts.plotFamily))
    );
    // CT_ScatterSer: marker/dLbls before xVal/yVal.
    return (
        `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}${dLbls}${xVal}${yVal}</c:ser>`
    );
}

/**
 * Bubble series (dml-chart.xsd CT_BubbleSer): idx → order → tx → spPr →
 * dLbls → xVal → yVal → bubbleSize → bubble3D. The 3-D flag lives on the
 * series, never on the chart group ([MS-OE376] §2.1.1458(b)).
 *
 * @param {SeriesModel} s - The s parameter.
 * @param {number} index - The index parameter.
 * @param {ChartType} chartType - The chartType parameter.
 * @returns {string} - Returns the result.
 */
function serializeBubbleSer(s: SeriesModel, index: number, chartType: ChartType): string {
    const model: SeriesModel & { serieFormat: FrameModel; dataLabels: DataLabelsModel; } = ensureSeriesFormat(s);
    // Prefer titleFormula (preserved from loading) over title (value or plain text).
    const titleToSerialize: string | undefined = model.titleFormula !== undefined ? model.titleFormula : model.title;
    const tx: string =
    titleToSerialize === undefined
        ? ''
        : looksLikeFormula(titleToSerialize)
            ? `<c:tx><c:strRef><c:f>${escapeXml(titleToSerialize)}</c:f></c:strRef></c:tx>`
            : `<c:tx><c:v>${escapeXml(titleToSerialize)}</c:v></c:tx>`;
    const spPr: string = serializeSpPr(model.serieFormat);
    const dLbls: string = serializeDataLabels(model.dataLabels, resolveDLblPosPolicy('bubble'));
    const xVal: string =
    model.categoryLabels === undefined
        ? ''
        : `<c:xVal><c:numRef><c:f>${escapeXml(model.categoryLabels)}</c:f></c:numRef></c:xVal>`;
    const yVal: string = `<c:yVal><c:numRef><c:f>${escapeXml(model.values)}</c:f></c:numRef></c:yVal>`;
    const bubbleSize: string =
    model.bubbleSizes === undefined
        ? ''
        : `<c:bubbleSize><c:numRef><c:f>${escapeXml(model.bubbleSizes)}</c:f></c:numRef></c:bubbleSize>`;
    // Bubble3D charts flag every series; plain Bubble honors an explicit
    // per-series author override (default false).
    const bubble3DFlag: string =
    model.bubbleSize3D === true || chartType === ChartType.Bubble3D
        ? '<c:bubble3D val="1"/>'
        : '';
    return (
        `<c:ser><c:idx val="${index}"/><c:order val="${index}"/>${tx}${spPr}${dLbls}` +
    `${xVal}${yVal}${bubbleSize}${bubble3DFlag}</c:ser>`
    );
}

/**
 * EG_AxShared tail after title: numFmt → majorTickMark → minorTickMark →
 * tickLblPos → spPr → txPr → crossAx → crosses.
 *
 * Always emit major/minor tick marks (including Excel defaults `out` / `none`).
 * Omitting them leaves Excel chart chrome ambiguous for some hosts and keeps
 * Chart Elements → Axes from matching a normal Excel-authored axis.
 *
 * @param {AxisModel} ax - The ax parameter.
 * @param {number} crossAx - The crossAx parameter.
 * @returns {string} - Returns the result.
 */
function serializeAxisSharedTail(ax: AxisModel, crossAx: number, crosses: 'autoZero' | 'max' = 'autoZero'): string {
    const numFmt: string =
    ax.numberFormat !== undefined && ax.numberFormat.length > 0
        ? `<c:numFmt formatCode="${escapeXml(ax.numberFormat)}" sourceLinked="0"/>`
        : '';
    const majorTick: string = `<c:majorTickMark val="${tickMarkToOoxml(ax.majorTickMark)}"/>`;
    const minorTick: string = `<c:minorTickMark val="${tickMarkToOoxml(ax.minorTickMark)}"/>`;
    // Line-only spPr: fill on axes is not used for the axis line chrome.
    const lineXml: string =
    ax.line !== undefined &&
    (ax.line.color !== undefined || ax.line.weightPt !== undefined)
        ? serializeLine(ax.line)
        : '';
    const spPr: string = lineXml.length > 0 ? `<c:spPr>${lineXml}</c:spPr>` : '';
    // Tick-label text body (EG_AxShared txPr). Keep bodyPr neutral — no forced
    // rotation — so cat/val axes both keep default label orientation.
    const txPr: string =
    '<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr>' +
    '<a:defRPr lang="en-US" sz="900"/></a:pPr>' +
    '<a:endParaRPr lang="en-US"/></a:p></c:txPr>';
    return (
        `${numFmt}${majorTick}${minorTick}` +
    `<c:tickLblPos val="nextTo"/>${spPr}${txPr}` +
    `<c:crossAx val="${crossAx}"/><c:crosses val="${crosses}"/>`
    );
}

/**
 * serializeScaling.
 *
 * @param {AxisModel} ax - The ax parameter.
 * @returns {string} - Returns the result.
 */
function serializeScaling(ax: AxisModel): string {
    // CT_Scaling: orientation → max → min (max before min).
    const max: string =
    ax.maximumValue !== undefined ? `<c:max val="${ax.maximumValue}"/>` : '';
    const min: string =
    ax.minimumValue !== undefined ? `<c:min val="${ax.minimumValue}"/>` : '';
    return `<c:scaling><c:orientation val="minMax"/>${max}${min}</c:scaling>`;
}

/**
 * EG_AxShared gridline elements after axPos (major before minor).
 *
 * @param {AxisModel} ax - The ax parameter.
 * @returns {string} - Returns the result.
 */
function serializeGridlines(ax: AxisModel): string {
    let out: string = '';
    if (ax.hasMajorGridLines) {out += '<c:majorGridlines/>'; }
    if (ax.hasMinorGridLines) {out += '<c:minorGridlines/>'; }
    return out;
}

/**
 * Axis title (`c:title`) — same rich-text shell as chart title.
 *
 * @param {string | undefined} title - The title parameter.
 * @param {TextAreaModel | undefined} titleArea - The titleArea parameter.
 * @returns {string} - Returns the result.
 */
function serializeAxisTitle(
    title: string | undefined,
    titleArea: TextAreaModel | undefined
): string {
    if (title === undefined || title.length === 0) {return ''; }
    return serializeChartTitle(title, titleArea);
}

/**
 * serializeCatAx.
 *
 * @param {number} axId - The axId parameter.
 * @param {number} crossAx - The crossAx parameter.
 * @param {AxisModel} ax - The ax parameter.
 * @param {boolean} isSurfaceChart - The isSurfaceChart parameter.
 * @param {boolean} isSeriesInRows - The isSeriesInRows parameter.
 * @returns {string} - Returns the result.
 */
function serializeCatAx(axId: number, crossAx: number, ax: AxisModel, isSurfaceChart: boolean = false, isSeriesInRows: boolean = false): string {
    ensureAxisFormat(ax);
    // Always write c:delete — Excel Chart Elements → Axes maps to this flag.
    // Omitting delete when visible is schema-legal but leaves the UI unchecked
    // on some Excel builds; explicit val="0" matches Excel-authored charts.
    const deleteXml: string = `<c:delete val="${ax.visible ? '0' : '1'}"/>`;
    // For surface charts, emit c:plotBy based on isSeriesInRows.
    // c:plotBy val="cat" (default) means categories on X axis, series on Z axis.
    // c:plotBy val="ser" means series on X axis, categories on Z axis.
    const plotByXml: string = isSurfaceChart
        ? `<c:plotBy val="${isSeriesInRows ? 'ser' : 'cat'}"/>`
        : '';
    // EG_AxShared: axId → scaling → delete → axPos → gridlines → title → shared tail.
    // CT_CatAx after shared: auto → lblAlgn → lblOffset → … → noMultiLvlLbl.
    return (
        `<c:catAx><c:axId val="${axId}"/>${serializeScaling(ax)}` +
    deleteXml +
    `<c:axPos val="b"/>${serializeGridlines(ax)}${serializeAxisTitle(ax.title, ax.titleArea)}` +
    serializeAxisSharedTail(ax, crossAx) +
    `${plotByXml}<c:auto val="1"/><c:lblOffset val="100"/><c:noMultiLvlLbl val="0"/></c:catAx>`
    );
}

/**
 * serializeValAx.
 *
 * @param {number} axId - The axId parameter.
 * @param {number} crossAx - The crossAx parameter.
 * @param {'b' | 'l' | 'r' | 't'} pos - The pos parameter.
 * @param {AxisModel} ax - The ax parameter.
 * @returns {string} - Returns the result.
 */
function serializeValAx(
    axId: number,
    crossAx: number,
    pos: 'b' | 'l' | 'r' | 't',
    ax: AxisModel,
    crosses: 'autoZero' | 'max' = 'autoZero'
): string {
    ensureAxisFormat(ax);
    const deleteXml: string = `<c:delete val="${ax.visible ? '0' : '1'}"/>`;
    const crossBetween: string = pos === 'l' || pos === 'r' ? '<c:crossBetween val="between"/>' : '';
    return (
        `<c:valAx><c:axId val="${axId}"/>${serializeScaling(ax)}` +
    deleteXml +
    `<c:axPos val="${pos}"/>${serializeGridlines(ax)}${serializeAxisTitle(ax.title, ax.titleArea)}` +
    serializeAxisSharedTail(ax, crossAx, crosses) +
    `${crossBetween}</c:valAx>`
    );
}

/**
 * DrawingML `c:spPr` for chart frames/series (solid fill + line subset).
 *
 * @param {FrameModel | undefined} frame - The frame parameter.
 * @returns {string} - Returns the result.
 */
function serializeSpPr(frame: FrameModel | undefined): string {
    if (frame === undefined) {return ''; }
    const fillXml: string = serializeFill(frame.fill);
    const lineXml: string = serializeLine(frame.line);
    if (fillXml.length === 0 && lineXml.length === 0) {return ''; }
    return `<c:spPr>${fillXml}${lineXml}</c:spPr>`;
}

/**
 * serializeFill.
 *
 * @param {FillModel | undefined} fill - The fill parameter.
 * @returns {string} - Returns the result.
 */
function serializeFill(fill: FillModel | undefined): string {
    if (fill === undefined) {return ''; }
    if (fill.type === ChartFillType.None) {return '<a:noFill/>'; }
    if (fill.type === ChartFillType.Solid && fill.foreColor !== undefined) {
        const alpha: string =
      fill.transparency !== undefined && fill.transparency > 0
          ? `<a:alpha val="${Math.round((100 - fill.transparency) * 1000)}"/>`
          : '';
        return `<a:solidFill><a:srgbClr val="${escapeXml(fill.foreColor)}">${alpha}</a:srgbClr></a:solidFill>`;
    }
    return '';
}

/**
 * serializeLine.
 *
 * @param {LineModel | undefined} line - The line parameter.
 * @returns {string} - Returns the result.
 */
function serializeLine(line: LineModel | undefined): string {
    if (line === undefined) {return ''; }
    if (line.color === undefined && line.weightPt === undefined) {return ''; }
    const wAttr: string =
    line.weightPt !== undefined
        ? ` w="${Math.round(line.weightPt * 12700)}"`
        : '';
    if (line.color === undefined) {
        return `<a:ln${wAttr}/>`;
    }
    return (
        `<a:ln${wAttr}><a:solidFill><a:srgbClr val="${escapeXml(line.color)}"/></a:solidFill></a:ln>`
    );
}

/**
 * buildHighLowLinesElement.
 *
 * Builds the `<c:hiLowLines>` element for stock charts.
 * When hasHighLowLines is false, returns empty string (no element).
 * When true, returns element with formatting from the model or defaults.
 *
 * @param {boolean} show - Whether to show the element.
 * @param {LineModel | undefined} format - The line formatting model.
 * @returns {string} - Returns the result.
 */
function buildHighLowLinesElement(show: boolean, format: LineModel | undefined): string {
    if (!show) {
        return '';
    }
    // Default: black, 0.75pt (9525 EMU) for backward compatibility
    const lineModel: LineModel = format !== undefined && (format.color !== undefined || format.weightPt !== undefined)
        ? format
        : { color: '000000', weightPt: 0.75 };
    const lineXml: string = serializeLine(lineModel);
    return `<c:hiLowLines><c:spPr>${lineXml}</c:spPr></c:hiLowLines>`;
}

/**
 * textAreaHasFormatting.
 *
 * @param {TextAreaModel | undefined} text - The text parameter.
 * @returns {boolean} - Returns the result.
 */
function textAreaHasFormatting(text: TextAreaModel | undefined): boolean {
    return (
        text !== undefined &&
    (text.color !== undefined ||
      text.fontName !== undefined ||
      text.size !== undefined ||
      text.bold === true ||
      text.italic === true)
    );
}

/**
 * serializeTextRPr.
 *
 * @param {TextAreaModel | undefined} text - The text parameter.
 * @param {'rPr' | 'defRPr'} tag - The tag parameter.
 * @returns {string} - Returns the result.
 */
function serializeTextRPr(
    text: TextAreaModel | undefined,
    tag: 'rPr' | 'defRPr' = 'rPr'
): string {
    if (text === undefined || !textAreaHasFormatting(text)) {
        return tag === 'rPr' ? '<a:rPr lang="en-US"/>' : '<a:defRPr/>';
    }
    const attrs: string[] = ['lang="en-US"'];
    if (text.size !== undefined) {attrs.push(`sz="${Math.round(text.size * 100)}"`); }
    if (text.bold) {attrs.push('b="1"'); }
    if (text.italic) {attrs.push('i="1"'); }
    const solid: string =
    text.color !== undefined
        ? `<a:solidFill><a:srgbClr val="${escapeXml(text.color)}"/></a:solidFill>`
        : '';
    const latin: string =
    text.fontName !== undefined
        ? `<a:latin typeface="${escapeXml(text.fontName)}"/>`
        : '';
    return `<a:${tag} ${attrs.join(' ')}>${solid}${latin}</a:${tag}>`;
}

/**
 * Serialize `c:dLbls`. MS-OE376 §2.1.1475: emit `c:dLblPos` only when the chart group
 * allows the element and the mapped token is in the allowed set.
 *
 * @param {DataLabelsModel | undefined} labels - The labels parameter.
 * @param {Object} dLblPosPolicy - The dLblPosPolicy parameter.
 * @returns {string} - Returns the result.
 */
function serializeDataLabels(
    labels: DataLabelsModel | undefined,
    dLblPosPolicy: {
        readonly emit: boolean;
        readonly allowed?: ReadonlySet<OoxmlDLblPos>;
    } = { emit: true }
): string {
    if (labels === undefined) {return ''; }
    const ooxmlPos: OoxmlDLblPos =
    labels.position !== undefined ? dataLabelPositionToOoxml(labels.position) : undefined;
    const emitDLblPos: boolean =
    dLblPosPolicy.emit &&
    ooxmlPos !== undefined &&
    (dLblPosPolicy.allowed === undefined || dLblPosPolicy.allowed.has(ooxmlPos));
    const anyShow: boolean =
    labels.isValue ||
    labels.isCategoryName ||
    labels.isSeriesName ||
    labels.isPercentage;
    if (!anyShow && !emitDLblPos && !textAreaHasFormatting(labels.textArea)) {
        return '';
    }
    const parts: string[] = [];
    if (textAreaHasFormatting(labels.textArea)) {
        parts.push(
            `<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr>${serializeTextRPr(labels.textArea, 'defRPr')}</a:pPr>` +
        '<a:endParaRPr lang="en-US"/></a:p></c:txPr>'
        );
    }
    if (emitDLblPos && ooxmlPos !== undefined) {
        parts.push(`<c:dLblPos val="${ooxmlPos}"/>`);
    }
    parts.push('<c:showLegendKey val="0"/>');
    parts.push(`<c:showVal val="${labels.isValue ? '1' : '0'}"/>`);
    parts.push(`<c:showCatName val="${labels.isCategoryName ? '1' : '0'}"/>`);
    parts.push(`<c:showSerName val="${labels.isSeriesName ? '1' : '0'}"/>`);
    parts.push(`<c:showPercent val="${labels.isPercentage ? '1' : '0'}"/>`);
    parts.push('<c:showBubbleSize val="0"/>');
    return `<c:dLbls>${parts.join('')}</c:dLbls>`;
}

/**
 * serializeSerAx.
 *
 * @param {number} axId - The axId parameter.
 * @param {number} crossAx - The crossAx parameter.
 * @returns {string} - Returns the result.
 */
function serializeSerAx(axId: number, crossAx: number): string {
    return (
        `<c:serAx><c:axId val="${axId}"/><c:scaling><c:orientation val="minMax"/></c:scaling>` +
    `<c:axPos val="b"/><c:tickLblPos val="nextTo"/><c:crossAx val="${crossAx}"/>` +
    '<c:crosses val="autoZero"/></c:serAx>'
    );
}

/**
 * Rebuild ChartEx model from entry title/data fields before package write.
 * Classic series/dataRange edits on ChartEx handles stay best-effort only.
 *
 * @param {ChartEntry} entry - The entry parameter.
 * @param {string} sheetName - The sheet assumed for a changed dataRange that names none.
 * @returns {ChartEx} - Returns the result.
 */
function syncChartExFromEntry(entry: ChartEntry, sheetName?: string): ChartEx {
    const base: ChartEx = entry.chartEx;
    if (base === undefined) {
        throw new InvalidChartError(`ChartEx "${entry.name}" has no ChartEx model`);
    }
    const title: string =
    entry.hasTitle && entry.chartTitle !== undefined ? entry.chartTitle : undefined;
    // The model already holds the formulas derived from its dataRange. Only re-derive
    // when the handle's dataRange was changed; createChartEx rejects a dataRange
    // alongside category labels or values, so pass one source or the other.
    const rangeChanged: boolean = entry.dataRange !== undefined && entry.dataRange !== base.dataRange;
    return cloneChartEx(
        createChartEx({
            type: base.type,
            ...(title !== undefined ? { title } : {}),
            ...(rangeChanged
                ? { dataRange: entry.dataRange, ...(sheetName !== undefined ? { sheetName } : {}) }
                : {
                    ...(base.categoryLabels !== undefined ? { categoryLabels: [...base.categoryLabels] } : {}),
                    ...(base.values !== undefined ? { values: base.values } : {})
                }),
            isSeriesInRows: entry.isSeriesInRows,
            ...(base.formatCode !== undefined ? { formatCode: base.formatCode } : {}),
            ...(base.categories !== undefined
                ? { categories: base.categories.map((level: ReadonlyArray<string>) => [...level]) }
                : {}),
            ...(base.categoryNames !== undefined ? { categoryNames: [...base.categoryNames] } : {}),
            ...(base.valuePoints !== undefined ? { valuePoints: [...base.valuePoints] } : {}),
            ...(base.binWidth !== undefined ? { binWidth: base.binWidth } : {}),
            ...(base.binCount !== undefined ? { binCount: base.binCount } : {})
        })
    );
}

/**
 * serializeChartAnchor.
 *
 * @param {ChartEntry} entry - The entry parameter.
 * @param {string} chartRelId - The chartRelId parameter.
 * @returns {string} - Returns the result.
 */
function serializeChartAnchor(entry: ChartEntry, chartRelId: string): string {
    const name: string = escapeXml(entry.name);
    const graphicInner: string = isChartExEntry(entry)
        ? // [MS-ODRAWXML] §2.24.1.1 chart element (CT_RelId) in chartex ns.
        `<a:graphicData uri="${CX_NS}">` +
      `<cx:chart xmlns:cx="${CX_NS}" xmlns:r="${R_NS}" r:id="${escapeXml(chartRelId)}"/>` +
      '</a:graphicData>'
        : `<a:graphicData uri="${C_NS}">` +
      `<c:chart xmlns:c="${C_NS}" xmlns:r="${R_NS}" r:id="${escapeXml(chartRelId)}"/>` +
      '</a:graphicData>';
    return (
        '<xdr:oneCellAnchor>' +
    `<xdr:from><xdr:col>${entry.column - 1}</xdr:col><xdr:colOff>${entry.colOffEmu | 0}</xdr:colOff>` +
    `<xdr:row>${entry.row - 1}</xdr:row><xdr:rowOff>${entry.rowOffEmu | 0}</xdr:rowOff></xdr:from>` +
    `<xdr:ext cx="${entry.widthEmu}" cy="${entry.heightEmu}"/>` +
    '<xdr:graphicFrame>' +
    `<xdr:nvGraphicFramePr><xdr:cNvPr id="${entry.id}" name="${name}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr>` +
    `<xdr:xfrm><a:off x="0" y="0"/><a:ext cx="${entry.widthEmu}" cy="${entry.heightEmu}"/></xdr:xfrm>` +
    `<a:graphic>${graphicInner}</a:graphic>` +
    '</xdr:graphicFrame><xdr:clientData/>' +
    '</xdr:oneCellAnchor>'
    );
}

/**
 * Parse chartSpace XML; classify externalData via chart-part relationships.
 *
 * @param {string} xml - The xml parameter.
 * @param {OpcPackage | undefined} pkg - The pkg parameter.
 * @param {string | undefined} chartPartName - The chartPartName parameter.
 * @returns {ParsedChartSpace | undefined} - Returns the result.
 */
export function parseChartSpace(
    xml: string,
    pkg: OpcPackage | undefined,
    chartPartName: string | undefined
): ParsedChartSpace | undefined {
    if (!/<c:chartSpace\b/.test(xml) && !/<chartSpace\b/.test(xml)) {return undefined; }

    const groups: PlotGroupXml[] = collectPlotGroups(xml);
    const plotMatch: PlotGroupXml = groups.length > 0 ? groups[0] : undefined;
    if (plotMatch === undefined) {
        return {
            type: ChartType.ColumnClustered,
            hasTitle: false,
            chartTitleArea: DEFAULT_TEXT_AREA(),
            chartArea: DEFAULT_FRAME(),
            plotArea: DEFAULT_FRAME(),
            dataSource: { kind: 'none' },
            series: [],
            hasLegend: false,
            legendPosition: LegendPosition.Right,
            legendTextArea: DEFAULT_TEXT_AREA(),
            legendFrame: DEFAULT_FRAME(),
            hasDataTable: false,
            categoryAxis: DEFAULT_AXIS(),
            valueAxis: DEFAULT_AXIS(),
            preservedChartXml: xml
        };
    }
    const plotTag: string = plotMatch.tag;
    const plotXml: string = plotMatch.xml;
    const groupingRaw: string = parseAttrVal(plotXml, 'grouping');
    const scatterRaw: string = parseAttrVal(plotXml, 'scatterStyle');
    const merged: MergedPlotGroups = mergePlotGroups(groups);
    const type: string = merged !== undefined
        ? merged.type
        : plotTagToChartType(plotTag, plotXml, groupingRaw, scatterRaw);
    const kind: PlotKind = plotKindFromType(type);
    const parsedGrouping: BarGrouping = groupingRaw as BarGrouping | AreaGrouping | undefined;
    const grouping: BarGrouping = kind.barGrouping !== undefined || kind.areaGrouping !== undefined
        ? (parsedGrouping != null ? parsedGrouping : kind.barGrouping) != null
            ? (parsedGrouping != null ? parsedGrouping : kind.barGrouping)
            : kind.areaGrouping
        : undefined;
    // For surface charts, extract plotBy from the category axis to determine isSeriesInRows.
    // plotBy="ser" means series on X axis → isSeriesInRows=true
    // plotBy="cat" (or absent) means categories on X axis → isSeriesInRows=false
    let isSeriesInRows: boolean = false;
    if (kind.family === 'surface3d' || kind.family === 'surface') {
        const plotByMatch: RegExpExecArray = /<c:catAx\b[\s\S]*?<c:plotBy\s+val="([^"]*)"/i.exec(xml);
        if (plotByMatch !== null && plotByMatch[1] === 'ser') {
            isSeriesInRows = true;
        }
    }
    const scatterStyle: ScatterStyle =
    kind.family === 'scatter'
        ? (((__t: ScatterStyle) => __t != null ? __t : 'marker')(SCATTER_STYLES.has((scatterRaw != null ? scatterRaw : ''))
            ? (scatterRaw as ScatterStyle)
            : kind.scatterStyle))
        : undefined;
    const series: SeriesModel[] = merged !== undefined
        ? merged.series
        : parseSeries(plotXml, kind.family === 'scatter' || kind.family === 'bubble');
    const chartTitle: string = parseChartTitle(xml);
    const hasTitle: boolean = chartTitle !== undefined;
    const chartTitleAreaParsed: TextAreaModel = parseChartTitleArea(xml);
    const chartTitleArea: TextAreaModel = chartTitleAreaParsed != null ? chartTitleAreaParsed : DEFAULT_TEXT_AREA();
    const chartAreaParsed: FrameModel = parseChartSpaceFrame(xml);
    const chartArea: FrameModel = chartAreaParsed != null ? chartAreaParsed : DEFAULT_FRAME();
    const plotAreaParsed: FrameModel = parsePlotAreaFrame(xml);
    const plotArea: FrameModel = plotAreaParsed != null ? plotAreaParsed : DEFAULT_FRAME();
    const view3D: ChartView3D = parseView3D(xml);
    const dataSource: ChartDataSource = parseDataSource(xml, pkg, chartPartName);
    const legend: { hasLegend: boolean; position: string; textArea: TextAreaModel; frame: FrameModel } = parseLegend(xml);
    const hasDataTable: boolean = /<c:dTable\b/.test(xml);
    // For stock charts, extract High-Low lines formatting.
    // Presence of <c:spPr> within hiLowLines indicates styled/enabled lines.
    // If hiLowLines element exists without spPr, treat as disabled (not visible).
    let hasHighLowLines: boolean | undefined;
    let highLowLinesFormat: LineModel | undefined;
    if (kind.family === 'stock' && /<c:hiLowLines\b/.test(plotXml)) {
        const hiLowMatch = plotXml.match(/<c:hiLowLines[^>]*>[\s\S]*?<\/c:hiLowLines>/);
        if (hiLowMatch) {
            const hiLowContent: string = hiLowMatch[0];
            if (!/<c:spPr>/.test(hiLowContent)) {
                hasHighLowLines = false;  // Has element but no styling = disabled
            } else {
                // Extract formatting from <c:spPr> content
                const spPrContent: string = ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : ''; })(/<c:spPr[^>]*>([\s\S]*?)<\/c:spPr>/.exec(hiLowContent));
                if (spPrContent.length > 0) {
                    const parsedLine: LineModel | undefined = parseLineFromSpPr(spPrContent);
                    if (parsedLine !== undefined && (parsedLine.color !== undefined || parsedLine.weightPt !== undefined)) {
                        highLowLinesFormat = parsedLine;
                    }
                }
            }
        }
    }
    // Scatter and bubble plots use two valAx (bottom X + left Y); other plots
    // use catAx + valAx.
    const usesTwoValAx: boolean = kind.family === 'scatter' || kind.family === 'bubble';
    let categoryAxis: AxisModel;
    if (usesTwoValAx) {
        const catAxB: AxisModel = parseAxis(xml, 'valAx', 'b');
        const catAxFallback: AxisModel = catAxB != null ? catAxB : parseAxis(xml, 'valAx');
        categoryAxis = catAxFallback != null ? catAxFallback : DEFAULT_AXIS();
    } else {
        const catAx: AxisModel = parseAxis(xml, 'catAx');
        categoryAxis = catAx != null ? catAx : DEFAULT_AXIS();
    }
    const valueAxisL: AxisModel = parseAxis(xml, 'valAx', 'l');
    const valueAxisFallback: AxisModel = valueAxisL != null ? valueAxisL : parseAxis(xml, 'valAx');
    const valueAxis: AxisModel = valueAxisFallback != null ? valueAxisFallback : DEFAULT_AXIS();
    // Merged charts (combination / volume stock) address axes by id: the first
    // group's pair is primary, a different pair is secondary.
    let primaryCatAxis: AxisModel = categoryAxis;
    let primaryValAxis: AxisModel = valueAxis;
    let secondaryCatAxis: AxisModel;
    let secondaryValAxis: AxisModel;
    if (merged !== undefined) {
        const byId: AxisModel = parseAxisById(xml, merged.primaryAxisIds[0]);
        const byIdVal: AxisModel = parseAxisById(xml, merged.primaryAxisIds[1]);
        primaryCatAxis = byId != null ? byId : categoryAxis;
        primaryValAxis = byIdVal != null ? byIdVal : valueAxis;
        if (merged.secondaryAxisIds !== undefined) {
            secondaryCatAxis = parseAxisById(xml, merged.secondaryAxisIds[0]);
            secondaryValAxis = parseAxisById(xml, merged.secondaryAxisIds[1]);
        }
    }

    return {
        type,
        ...(chartTitle !== undefined ? { chartTitle } : {}),
        hasTitle,
        chartTitleArea,
        chartArea,
        plotArea,
        ...(grouping !== undefined &&
    (BAR_GROUPINGS.has(grouping) || AREA_GROUPINGS.has(grouping))
            ? { grouping }
            : {}),
        ...(scatterStyle !== undefined ? { scatterStyle } : {}),
        ...(view3D !== undefined ? { view3D } : {}),
        ...(isSeriesInRows ? { isSeriesInRows } : {}),
        dataSource,
        series,
        hasLegend: legend.hasLegend,
        legendPosition: legend.position,
        legendTextArea: legend.textArea,
        legendFrame: legend.frame,
        hasDataTable,
        ...(hasHighLowLines !== undefined ? { hasHighLowLines } : {}),
        ...(highLowLinesFormat !== undefined ? { highLowLinesFormat } : {}),
        categoryAxis: primaryCatAxis,
        valueAxis: primaryValAxis,
        ...(secondaryCatAxis != null ? { secondaryCategoryAxis: secondaryCatAxis } : {}),
        ...(secondaryValAxis != null ? { secondaryValueAxis: secondaryValAxis } : {})
    };
}

/** One chart-group element (`c:barChart`, `c:lineChart`, …) cut out of a plot area. */
interface PlotGroupXml {
    readonly tag: string;
    readonly xml: string;
}

/**
 * The chart groups of a plot area, in document order.
 *
 * @param {string} xml - The xml parameter.
 * @returns {PlotGroupXml[]} - Returns the result.
 */
function collectPlotGroups(xml: string): PlotGroupXml[] {
    const re: RegExp =
    /<c:(barChart|bar3DChart|lineChart|line3DChart|areaChart|area3DChart|pieChart|pie3DChart|doughnutChart|ofPieChart|scatterChart|bubbleChart|surface3DChart|surfaceChart|radarChart|stockChart)\b[\s\S]*?<\/c:\1>/g;
    const out: PlotGroupXml[] = [];
    let m: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((m = re.exec(xml)) !== null) {
        out.push({ tag: m[1]!, xml: m[0]! });
    }
    return out;
}

/** The two axis ids (`c:axId`) a chart group references. */
function groupAxisIds(groupXml: string): [string, string] | undefined {
    const ids: string[] = [];
    const re: RegExp = /<c:axId\b[^>]*\bval="([^"]*)"/g;
    let m: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((m = re.exec(groupXml)) !== null) {
        ids.push(m[1]!);
    }
    return ids.length >= 2 ? [ids[0]!, ids[1]!] : undefined;
}

/** A plot area folded into one chart: its type, all series, and the axis pairs in use. */
interface MergedPlotGroups {
    readonly type: ChartType;
    readonly series: SeriesModel[];
    readonly primaryAxisIds: [string, string];
    readonly secondaryAxisIds?: [string, string];
}

/**
 * Fold a plot area with several chart groups into one chart, when the groups
 * are a combination Excel can author with this library: 2-D column, line and
 * area groups (series keep their own type, and series on a second axis pair use
 * the secondary value axis), or a volume stock chart (a column group followed by
 * a stock group). Returns `undefined` for a single group or for any other mix, so
 * the first group is read on its own as before.
 *
 * @param {PlotGroupXml[]} groups - The groups parameter.
 * @returns {MergedPlotGroups | undefined} - Returns the result.
 */
function mergePlotGroups(groups: PlotGroupXml[]): MergedPlotGroups | undefined {
    if (groups.length < 2) {return undefined; }
    const first: PlotGroupXml = groups[0];
    const primaryAxisIds: [string, string] = groupAxisIds(first.xml);
    if (primaryAxisIds === undefined) {return undefined; }

    // Volume stock: column group + stock group on a second axis pair.
    if (groups.length === 2 && first.tag === 'barChart' && groups[1].tag === 'stockChart') {
        const barType: ChartType = plotTagToChartType('barChart', first.xml, parseAttrVal(first.xml, 'grouping'), undefined);
        const stockSeries: SeriesModel[] = parseSeries(groups[1].xml, false);
        const volumeSeries: SeriesModel[] = parseSeries(first.xml, false);
        if (barType !== ChartType.ColumnClustered || volumeSeries.length !== 1) {return undefined; }
        const stockAxisIds: [string, string] = groupAxisIds(groups[1].xml);
        if (stockSeries.length < 3 || stockSeries.length > 4 || stockAxisIds === undefined) {return undefined; }
        return {
            type: stockSeries.length === 4 ? ChartType.StockVolumeOpenHighLowClose : ChartType.StockVolumeHighLowClose,
            series: volumeSeries.concat(stockSeries),
            primaryAxisIds,
            secondaryAxisIds: stockAxisIds
        };
    }

    // Column / line / area combination.
    const types: ChartType[] = [];
    for (const g of groups) {
        const t: ChartType = plotTagToChartType(g.tag, g.xml, parseAttrVal(g.xml, 'grouping'), undefined);
        if (!(g.tag === 'barChart' || g.tag === 'lineChart' || g.tag === 'areaChart') || !isComboSeriesType(t)) {
            return undefined;
        }
        types.push(t);
    }
    let secondaryAxisIds: [string, string];
    const series: SeriesModel[] = [];
    groups.forEach((g: PlotGroupXml, gi: number) => {
        const ids: [string, string] = groupAxisIds(g.xml);
        const secondary: boolean = ids !== undefined && (ids[0] !== primaryAxisIds[0] || ids[1] !== primaryAxisIds[1]);
        if (secondary && secondaryAxisIds === undefined) {secondaryAxisIds = ids; }
        for (const s of parseSeries(g.xml, false)) {
            series.push({ ...s, serieType: types[gi], ...(secondary ? { usePrimaryAxis: false } : {}) });
        }
    });
    // Recognise the two presets so the chart reports the type Excel's gallery names it.
    const last: number = series.length - 1;
    const isPreset: boolean =
    series.length > 1 &&
    series.every((s: SeriesModel, i: number) =>
        i < last
            ? s.serieType === ChartType.ColumnClustered && s.usePrimaryAxis !== false
            : s.serieType === ChartType.LineMarkers
    );
    if (isPreset) {
        const onSecondary: boolean = series[last].usePrimaryAxis === false;
        for (const s of series) {
            delete s.serieType;
            delete s.usePrimaryAxis;
        }
        return {
            type: onSecondary ? ChartType.ColumnClusteredLineSecondaryAxis : ChartType.ColumnClusteredLine,
            series,
            primaryAxisIds,
            ...(secondaryAxisIds !== undefined ? { secondaryAxisIds } : {})
        };
    }
    return {
        type: types[0],
        series,
        primaryAxisIds,
        ...(secondaryAxisIds !== undefined ? { secondaryAxisIds } : {})
    };
}

/**
 * plotTagToChartType.
 *
 * @param {string} tag - The tag parameter.
 * @param {string} plotXml - The plotXml parameter.
 * @param {string | undefined} grouping - The grouping parameter.
 * @param {string | undefined} scatterStyle - The scatterStyle parameter.
 * @returns {ChartType} - Returns the result.
 */
function plotTagToChartType(
    tag: string,
    plotXml: string,
    grouping: string | undefined,
    scatterStyle: string | undefined
): ChartType {
    switch (tag) {
    case 'barChart': {
        const dir: string = (parseAttrVal(plotXml, 'barDir') != null ? parseAttrVal(plotXml, 'barDir') : 'col');
        const g: string = (grouping != null ? grouping : 'clustered');
        if (dir === 'bar') {
            if (g === 'stacked') {return ChartType.BarStacked; }
            if (g === 'percentStacked') {return ChartType.BarPercentStacked; }
            return ChartType.BarClustered;
        }
        if (g === 'stacked') {return ChartType.ColumnStacked; }
        if (g === 'percentStacked') {return ChartType.ColumnPercentStacked; }
        return ChartType.ColumnClustered;
    }
    case 'bar3DChart': {
        const dir: string = (parseAttrVal(plotXml, 'barDir') != null ? parseAttrVal(plotXml, 'barDir') : 'col');
        const g: string = (grouping != null ? grouping : 'clustered');
        if (dir === 'bar') {
            if (g === 'stacked') {return ChartType.BarStacked3D; }
            if (g === 'percentStacked') {return ChartType.BarPercentStacked3D; }
            return ChartType.BarClustered3D;
        }
        if (g === 'standard') {return ChartType.Column3D; }
        if (g === 'stacked') {return ChartType.ColumnStacked3D; }
        if (g === 'percentStacked') {return ChartType.ColumnPercentStacked3D; }
        return ChartType.ColumnClustered3D;
    }
    case 'lineChart': {
        const g: string = (grouping != null ? grouping : 'standard');
        const hasMarkers: boolean = lineChartHasMarkers(plotXml);
        if (hasMarkers) {
            if (g === 'stacked') {return ChartType.LineStackedMarkers; }
            if (g === 'percentStacked') {return ChartType.LinePercentStackedMarkers; }
            return ChartType.LineMarkers;
        }
        if (g === 'stacked') {return ChartType.LineStacked; }
        if (g === 'percentStacked') {return ChartType.LinePercentStacked; }
        return ChartType.Line;
    }
    case 'line3DChart':
        return ChartType.Line3D;
    case 'areaChart': {
        const g: string = (grouping != null ? grouping : 'standard');
        if (g === 'stacked') {return ChartType.AreaStacked; }
        if (g === 'percentStacked') {return ChartType.AreaPercentStacked; }
        return ChartType.Area;
    }
    case 'area3DChart': {
        const g: string = (grouping != null ? grouping : 'standard');
        if (g === 'stacked') {return ChartType.AreaStacked3D; }
        if (g === 'percentStacked') {return ChartType.AreaPercentStacked3D; }
        return ChartType.Area3D;
    }
    case 'pieChart':
        return /<c:explosion\b[^>]*\bval="([1-9]\d*)"/.test(plotXml)
            ? ChartType.PieExploded
            : ChartType.Pie;
    case 'pie3DChart':
        return /<c:explosion\b[^>]*\bval="([1-9]\d*)"/.test(plotXml)
            ? ChartType.PieExploded3D
            : ChartType.Pie3D;
    case 'doughnutChart': {
        // Exploded when any series has c:explosion > 0.
        if (/<c:explosion\b[^>]*\bval="([1-9]\d*)"/.test(plotXml)) {
            return ChartType.DoughnutExploded;
        }
        return ChartType.Doughnut;
    }
    case 'ofPieChart': {
        const ofPieType: string = (parseAttrVal(plotXml, 'ofPieType') != null ? parseAttrVal(plotXml, 'ofPieType') : 'pie');
        return ofPieType === 'bar' ? ChartType.BarOfPie : ChartType.PieOfPie;
    }
    case 'scatterChart': {
        const s: string = (scatterStyle != null ? scatterStyle : 'marker');
        if (s === 'line') {return ChartType.ScatterLine; }
        if (s === 'lineMarker') {return ChartType.ScatterLineMarkers; }
        if (s === 'smooth') {return ChartType.ScatterSmooth; }
        if (s === 'smoothMarker') {return ChartType.ScatterSmoothMarkers; }
        return ChartType.ScatterMarkers;
    }
    case 'bubbleChart':
        // Bubble3D is the 3-D bubble effect. Well-formed files carry it
        // per-series (CT_BubbleSer); Office disallows group-level bubble3D
        // ([MS-OE376] §2.1.1458(b)), but a foreign flag anywhere in the plot
        // still means the effect is on.
        return /<c:bubble3D\b[^>]*\bval="(?:1|true)"/.test(plotXml)
            ? ChartType.Bubble3D
            : ChartType.Bubble;
    case 'surface3DChart':
        return parseAttrVal(plotXml, 'wireframe') === '1' || parseAttrVal(plotXml, 'wireframe') === 'true'
            ? ChartType.SurfaceNoColor3D
            : ChartType.Surface3D;
    case 'surfaceChart':
        return parseAttrVal(plotXml, 'wireframe') === '1' || parseAttrVal(plotXml, 'wireframe') === 'true'
            ? ChartType.SurfaceNoColorContour
            : ChartType.SurfaceContour;
    case 'radarChart': {
        const style: string = parseAttrVal(plotXml, 'radarStyle');
        if (style === 'filled') {return ChartType.RadarFilled; }
        if (style === 'marker') {return ChartType.RadarMarkers; }
        return ChartType.Radar;
    }
    case 'stockChart':
        // Four series is Open-High-Low-Close; three is High-Low-Close.
        return (plotXml.match(/<c:ser\b/g) || []).length >= 4
            ? ChartType.StockOpenHighLowClose
            : ChartType.StockHighLowClose;
    default:
        return ChartType.ColumnClustered;
    }
}

/**
 * both use CT_AxDataSource `xVal` / CT_NumDataSource `yVal`, per
 * CT_ScatterSer / CT_BubbleSer in dml-chart.xsd).
 *
 * @param {string} plotXml - The plotXml parameter.
 * @param {boolean} scatter - The scatter parameter.
 * @returns {SeriesModel[]} - Returns the result.
 */
function parseSeries(plotXml: string, scatter: boolean): SeriesModel[] {
    const out: SeriesModel[] = [];
    const serRe: RegExp = /<c:ser\b[\s\S]*?<\/c:ser>/g;
    let m: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((m = serRe.exec(plotXml)) !== null) {
        const ser: string = m[0];
        const titleV: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:tx\b[\s\S]*?<c:v>([^<]*)<\/c:v>/.exec(ser));
        const titleF: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:tx\b[\s\S]*?<c:f>([^<]*)<\/c:f>/.exec(ser));
        // Prefer formula reference (titleF) for preservation; use value (titleV) as fallback.
        // This ensures round-trip fidelity: if a formula is present, it takes priority.
        const title: string =
      titleF !== undefined
          ? unescapeXml(titleF)
          : titleV !== undefined
              ? unescapeXml(titleV)
              : undefined;
        // Store both formula and evaluated value separately.
        // On serialization, titleFormula is preferred if present.
        const titleFormula: string | undefined = titleF !== undefined ? unescapeXml(titleF) : undefined;
        const cat: string = scatter
            ? ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:xVal\b[\s\S]*?<c:f>([^<]*)<\/c:f>/.exec(ser))
            : ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:cat\b[\s\S]*?<c:f>([^<]*)<\/c:f>/.exec(ser));
        const val: string = scatter
            ? ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:yVal\b[\s\S]*?<c:f>([^<]*)<\/c:f>/.exec(ser))
            : ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:val\b[\s\S]*?<c:f>([^<]*)<\/c:f>/.exec(ser));
        if (val === undefined) {continue; }
        const explosionRaw: string = parseAttrVal(ser, 'explosion');
        let explodePercent: number | undefined;
        if (explosionRaw !== undefined) {
            const n: number = Number(explosionRaw);
            if (Number.isFinite(n) && n >= 0) {explodePercent = n; }
        }
        // CT_BubbleSer-only children; harmless no-op on non-bubble series (never present).
        const bubbleSizeRaw: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:bubbleSize\b[\s\S]*?<c:f>([^<]*)<\/c:f>/.exec(ser));
        const bubble3DRaw: string = parseAttrVal(ser, 'bubble3D');
        const serieFormatParsed: FrameModel = parseSpPrFrame(ser);
        const serieFormat: FrameModel = serieFormatParsed != null ? serieFormatParsed : DEFAULT_FRAME();
        const dataLabelsParsed: DataLabelsModel = parseDataLabels(ser);
        const dataLabels: DataLabelsModel = dataLabelsParsed != null ? dataLabelsParsed : DEFAULT_DATA_LABELS();
        out.push({
            ...(title !== undefined ? { title } : {}),
            ...(titleFormula !== undefined ? { titleFormula } : {}),
            ...(cat !== undefined ? { categoryLabels: unescapeXml(cat) } : {}),
            values: unescapeXml(val),
            ...(bubbleSizeRaw !== undefined ? { bubbleSizes: unescapeXml(bubbleSizeRaw) } : {}),
            ...(bubble3DRaw === '1' || bubble3DRaw === 'true' ? { bubbleSize3D: true } : {}),
            ...(explodePercent !== undefined ? { explodePercent } : {}),
            serieFormat,
            dataLabels
        });
    }
    return out;
}

/**
 * parseChartTitle.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string | undefined} - Returns the result.
 */
function parseChartTitle(xml: string): string | undefined {
    // Prefer title directly under c:chart (not axis titles inside plotArea).
    const chartOpen: RegExpExecArray = /<c:chart\b[^>]*>/.exec(xml);
    if (chartOpen === null) {return undefined; }
    const startIdx: number = ((chartOpen.index != null ? chartOpen.index : 0)) + chartOpen[0].length;
    const plotArea: RegExpExecArray = /<c:plotArea\b/.exec(xml.slice(startIdx));
    const head: string =
    plotArea === null ? xml.slice(startIdx) : xml.slice(startIdx, startIdx + plotArea.index!);
    const rich: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:title\b[\s\S]*?<a:t>([^<]*)<\/a:t>/.exec(head));
    if (rich !== undefined) {return unescapeXml(rich); }
    const plain: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:title\b[\s\S]*?<c:v>([^<]*)<\/c:v>/.exec(head));
    if (plain !== undefined) {return unescapeXml(plain); }
    return undefined;
}

/**
 * parseLegend.
 *
 * @param {string} xml - The xml parameter.
 * @returns {Object} - Returns the result.
 */
function parseLegend(xml: string): {
    hasLegend: boolean;
    position: LegendPositionValue;
    textArea: TextAreaModel;
    frame: FrameModel;
} {
    const full: RegExpExecArray = /<c:legend\b[^>]*>([\s\S]*?)<\/c:legend>/.exec(xml);
    if (full === null) {
    // Self-closing or absent
        if (/<c:legend\b/.test(xml)) {
            return {
                hasLegend: true,
                position: LegendPosition.Right,
                textArea: DEFAULT_TEXT_AREA(),
                frame: DEFAULT_FRAME()
            };
        }
        return {
            hasLegend: false,
            position: LegendPosition.Right,
            textArea: DEFAULT_TEXT_AREA(),
            frame: DEFAULT_FRAME()
        };
    }
    const block: string = (full[1] != null ? full[1] : '');
    // Accept both ST_LegendPos short tokens (r/b/…) and legacy long API tokens.
    const pos: string = parseAttrVal(block, 'legendPos');
    return {
        hasLegend: true,
        position: legendPositionFromOoxml(pos),
        textArea: (() => { const __ta: TextAreaModel = parseTxPrTextArea(block); return __ta != null ? __ta : DEFAULT_TEXT_AREA(); })(),
        frame: (() => { const __fr: FrameModel = parseSpPrFrame(block); return __fr != null ? __fr : DEFAULT_FRAME(); })()
    };
}

/**
 * parseAxis.
 *
 * @param {string} xml - The xml parameter.
 * @param {'catAx' | 'valAx'} tag - The tag parameter.
 * @param {'b' | 'l' | 'r' | 't'} preferPos - The preferPos parameter.
 * @returns {AxisModel | undefined} - Returns the result.
 */
function parseAxis(
    xml: string,
    tag: 'catAx' | 'valAx',
    preferPos?: 'b' | 'l' | 'r' | 't'
): AxisModel | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const re: RegExp = new RegExp('<c:' + tag + '\\b[\\s\\S]*?<\\/c:' + tag + '>', 'g');
    let match: RegExpExecArray | null;
    let chosen: string | undefined;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((match = re.exec(xml)) !== null) {
        const block: string = match[0];
        if (preferPos !== undefined) {
            const pos: string = parseAttrVal(block, 'axPos');
            if (pos === preferPos) {
                chosen = block;
                break;
            }
            if (chosen === undefined) {chosen = block; }
        } else {
            chosen = block;
            break;
        }
    }
    if (chosen === undefined) {return undefined; }
    return axisModelFromBlock(chosen);
}

/**
 * The axis (`c:catAx`, `c:valAx` or `c:dateAx`) whose `c:axId` is `id`.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} id - The id parameter.
 * @returns {AxisModel | undefined} - Returns the result.
 */
function parseAxisById(xml: string, id: string): AxisModel | undefined {
    const re: RegExp = /<c:(catAx|valAx|dateAx)\b[\s\S]*?<\/c:\1>/g;
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((match = re.exec(xml)) !== null) {
        if (parseAttrVal(match[0], 'axId') === id) {
            return axisModelFromBlock(match[0]);
        }
    }
    return undefined;
}

/**
 * Axis model from one axis element's XML.
 *
 * @param {string} chosen - The chosen parameter.
 * @returns {AxisModel} - Returns the result.
 */
function axisModelFromBlock(chosen: string): AxisModel {
    const deleted: string = parseAttrVal(chosen, 'delete');
    const titleRich: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:title\b[\s\S]*?<a:t>([^<]*)<\/a:t>/.exec(chosen));
    const model: AxisModel = DEFAULT_AXIS();
    model.visible = !(deleted === '1' || deleted === 'true');
    model.hasMajorGridLines = /<c:majorGridlines\b/.test(chosen);
    model.hasMinorGridLines = /<c:minorGridlines\b/.test(chosen);
    if (titleRich !== undefined) {model.title = unescapeXml(titleRich); }

    const numFmt: string =
    ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : (parseAttrVal(chosen, 'numFmt')); })(/<c:numFmt\b[^>]*\bformatCode="([^"]*)"/.exec(chosen));
    if (numFmt !== undefined && numFmt.length > 0) {
        model.numberFormat = unescapeXml(numFmt);
    }

    const scalingBlock: string = ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[0]; return v != null ? v : (''); })(/<c:scaling\b[\s\S]*?<\/c:scaling>/.exec(chosen));
    const minRaw: string = parseAttrVal(scalingBlock, 'min');
    const maxRaw: string = parseAttrVal(scalingBlock, 'max');
    if (minRaw !== undefined) {
        const n: number = Number(minRaw);
        if (Number.isFinite(n)) {model.minimumValue = n; }
    }
    if (maxRaw !== undefined) {
        const n: number = Number(maxRaw);
        if (Number.isFinite(n)) {model.maximumValue = n; }
    }

    const majorTick: string = tickMarkFromOoxml(parseAttrVal(chosen, 'majorTickMark'));
    if (majorTick !== undefined) {model.majorTickMark = majorTick; }
    const minorTick: string = tickMarkFromOoxml(parseAttrVal(chosen, 'minorTickMark'));
    if (minorTick !== undefined) {model.minorTickMark = minorTick; }

    const frame: FrameModel = parseSpPrFrame(chosen);
    if (frame !== undefined) {model.line = frame.line; }

    const titleBlock: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[0])(/<c:title\b[\s\S]*?<\/c:title>/.exec(chosen));
    if (titleBlock !== undefined) {
        const titleArea: TextAreaModel =
      (parseRPrTextArea(titleBlock) != null ? parseRPrTextArea(titleBlock) : parseTxPrTextArea(titleBlock));
        if (titleArea !== undefined) {model.titleArea = titleArea; }
    }

    return model;
}

/**
 * Chart title text-run formatting from \`c:chart/c:title\`.
 *
 * @param {string} xml - The xml parameter.
 * @returns {TextAreaModel | undefined} - Returns the result.
 */
function parseChartTitleArea(xml: string): TextAreaModel | undefined {
    const chartOpen: RegExpExecArray = /<c:chart\b[^>]*>/.exec(xml);
    if (chartOpen === null) {return undefined; }
    const startIdx: number = ((chartOpen.index != null ? chartOpen.index : 0)) + chartOpen[0].length;
    const plotArea: RegExpExecArray = /<c:plotArea\b/.exec(xml.slice(startIdx));
    const head: string =
    plotArea === null ? xml.slice(startIdx) : xml.slice(startIdx, startIdx + plotArea.index!);
    const titleBlock: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[0])(/<c:title\b[\s\S]*?<\/c:title>/.exec(head));
    if (titleBlock === undefined) {return undefined; }
    return (parseRPrTextArea(titleBlock) != null ? parseRPrTextArea(titleBlock) : parseTxPrTextArea(titleBlock));
}

/**
 * `c:chartSpace` direct child `c:spPr` (chart area frame).
 * CT_ChartSpace order is chart → spPr → …, so spPr is after `</c:chart>` (legacy
 * files may still place spPr before chart — accept either).
 *
 * @param {string} xml - The xml parameter.
 * @returns {FrameModel | undefined} - Returns the result.
 */
function parseChartSpaceFrame(xml: string): FrameModel | undefined {
    const spaceOpen: RegExpExecArray = /<c:chartSpace\b[^>]*>/.exec(xml);
    if (spaceOpen === null) {return undefined; }
    const startIdx: number = ((spaceOpen.index != null ? spaceOpen.index : 0)) + spaceOpen[0].length;
    const afterOpen: string = xml.slice(startIdx);
    const chartOpen: RegExpExecArray = /<c:chart\b/.exec(afterOpen);
    if (chartOpen === null) {
        return parseSpPrFrame(afterOpen);
    }
    // Prefer spPr that is a direct child after </c:chart> (schema-correct order).
    const afterChartOpen: string = afterOpen.slice(chartOpen.index!);
    const chartClose: RegExpExecArray = /<\/c:chart>/.exec(afterChartOpen);
    if (chartClose !== null) {
        const tail: string = afterChartOpen.slice(chartClose.index! + chartClose[0].length);
        const tailFrame: FrameModel = parseSpPrFrame(tail);
        if (tailFrame !== undefined) {return tailFrame; }
    }
    // Legacy: spPr before <c:chart>.
    const head: string = afterOpen.slice(0, chartOpen.index!);
    return parseSpPrFrame(head);
}

/**
 * \`c:plotArea\` child \`c:spPr\` (plot area frame).
 *
 * @param {string} xml - The xml parameter.
 * @returns {FrameModel | undefined} - Returns the result.
 */
function parsePlotAreaFrame(xml: string): FrameModel | undefined {
    const plot: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:plotArea\b[^>]*>([\s\S]*?)<\/c:plotArea>/.exec(xml));
    if (plot === undefined) {return undefined; }
    // Prefer spPr that is a direct-ish child of plotArea (not nested in axes/series).
    // Take the last top-level-ish spPr after chart elements — Excel often emits layout then charts then spPr.
    const matches: RegExpMatchArray = plot.match(/<c:spPr\b[\s\S]*?<\/c:spPr>/g);
    if (matches === null || matches.length === 0) {return undefined; }
    return parseSpPrFrame(matches[matches.length - 1]!);
}

/**
 * parseDataLabels.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @returns {DataLabelsModel | undefined} - Returns the result.
 */
function parseDataLabels(parentXml: string): DataLabelsModel | undefined {
    const block: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:dLbls\b[^>]*>([\s\S]*?)<\/c:dLbls>/.exec(parentXml));
    if (block === undefined) {
        if (/<c:dLbls\b/.test(parentXml)) {return DEFAULT_DATA_LABELS(); }
        return undefined;
    }
    const model: DataLabelsModel = DEFAULT_DATA_LABELS();
    const showVal: string = parseAttrVal(block, 'showVal');
    const showCat: string = parseAttrVal(block, 'showCatName');
    const showSer: string = parseAttrVal(block, 'showSerName');
    const showPct: string = parseAttrVal(block, 'showPercent');
    if (showVal === '1' || showVal === 'true') {model.isValue = true; }
    if (showCat === '1' || showCat === 'true') {model.isCategoryName = true; }
    if (showSer === '1' || showSer === 'true') {model.isSeriesName = true; }
    if (showPct === '1' || showPct === 'true') {model.isPercentage = true; }
    const pos: string = dataLabelPositionFromOoxml(parseAttrVal(block, 'dLblPos'));
    if (pos !== undefined) {model.position = pos; }
    const textArea: TextAreaModel = parseTxPrTextArea(block);
    if (textArea !== undefined) {model.textArea = textArea; }
    return model;
}

/**
 * parseSpPrFrame.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @returns {FrameModel | undefined} - Returns the result.
 */
function parseSpPrFrame(parentXml: string): FrameModel | undefined {
    const spPr: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:spPr\b[^>]*>([\s\S]*?)<\/c:spPr>/.exec(parentXml));
    if (spPr === undefined) {
        if (/<c:spPr\b/.test(parentXml)) {return DEFAULT_FRAME(); }
        return undefined;
    }
    const fill: FillModel = parseFillFromSpPr(spPr);
    const line: LineModel = parseLineFromSpPr(spPr);
    if (fill === undefined && line === undefined) {return DEFAULT_FRAME(); }
    return {
        fill: (fill != null ? fill : DEFAULT_FILL()),
        line: (line != null ? line : DEFAULT_LINE())
    };
}

/**
 * parseFillFromSpPr.
 *
 * @param {string} spPrInner - The spPrInner parameter.
 * @returns {FillModel | undefined} - Returns the result.
 */
function parseFillFromSpPr(spPrInner: string): FillModel | undefined {
    if (/<a:noFill\b/.test(spPrInner)) {
        return { type: ChartFillType.None };
    }
    const solid: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[0])(/<a:solidFill\b[\s\S]*?<\/a:solidFill>/.exec(spPrInner));
    if (solid === undefined) {return undefined; }
    const srgb: string =
    ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : (((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{8})"/i.exec(solid))); })(/<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{6})"/i.exec(solid));
    let foreColor: string | undefined;
    if (srgb !== undefined) {
        try {
            foreColor = normalizeChartColor(srgb);
        } catch {
            foreColor = undefined;
        }
    }
    let transparency: number | undefined;
    const alphaRaw: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<a:alpha\b[^>]*\bval="(\d+)"/.exec(solid));
    if (alphaRaw !== undefined) {
        const alpha: number = Number(alphaRaw);
        // OOXML alpha is 0–100000 (100000 = opaque). API transparency is 0–100.
        if (Number.isFinite(alpha) && alpha >= 0 && alpha <= 100_000) {
            transparency = Math.round(100 - alpha / 1000);
        }
    }
    return {
        type: ChartFillType.Solid,
        ...(foreColor !== undefined ? { foreColor } : {}),
        ...(transparency !== undefined && transparency > 0 ? { transparency } : {})
    };
}

/**
 * parseLineFromSpPr.
 *
 * @param {string} spPrInner - The spPrInner parameter.
 * @returns {LineModel | undefined} - Returns the result.
 */
function parseLineFromSpPr(spPrInner: string): LineModel | undefined {
    const ln: RegExpExecArray =
    (/<a:ln\b([^>]*)>([\s\S]*?)<\/a:ln>/.exec(spPrInner) != null ? /<a:ln\b([^>]*)>([\s\S]*?)<\/a:ln>/.exec(spPrInner) : /<a:ln\b([^>]*)\/>/.exec(spPrInner));
    if (ln === null) {return undefined; }
    const attrs: string = (ln[1] != null ? ln[1] : '');
    const inner: string = (ln[2] != null ? ln[2] : '');
    const line: LineModel = {};
    const wMatch: RegExpExecArray = /\bw="(\d+)"/.exec(attrs);
    if (wMatch !== null) {
        const emu: number = Number(wMatch[1]);
        if (Number.isFinite(emu) && emu >= 0) {line.weightPt = emu / 12700; }
    }
    const srgb: string =
    ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : (((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{8})"/i.exec(inner))); })(/<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{6})"/i.exec(inner));
    if (srgb !== undefined) {
        try {
            const color: string = normalizeChartColor(srgb);
            if (color !== undefined) {line.color = color; }
        } catch {
            // ignore invalid
        }
    }
    return line.color !== undefined || line.weightPt !== undefined ? line : {};
}

/**
 * Parse \`a:rPr\` text run props inside a title/rich block.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @returns {TextAreaModel | undefined} - Returns the result.
 */
function parseRPrTextArea(parentXml: string): TextAreaModel | undefined {
    const rPr: RegExpExecArray =
    (/<a:rPr\b([^>]*)(?:\/>|>([\s\S]*?)<\/a:rPr>)/.exec(parentXml) != null ? /<a:rPr\b([^>]*)(?:\/>|>([\s\S]*?)<\/a:rPr>)/.exec(parentXml) : /<a:defRPr\b([^>]*)(?:\/>|>([\s\S]*?)<\/a:defRPr>)/.exec(parentXml));
    if (rPr === null) {return undefined; }
    return textAreaFromRPrAttrs((rPr[1] != null ? rPr[1] : ''), (rPr[2] != null ? rPr[2] : ''));
}

/**
 * Parse \`c:txPr\` paragraph defRPr text props.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @returns {TextAreaModel | undefined} - Returns the result.
 */
function parseTxPrTextArea(parentXml: string): TextAreaModel | undefined {
    const txPr: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[0])(/<c:txPr\b[\s\S]*?<\/c:txPr>/.exec(parentXml));
    if (txPr === undefined) {return undefined; }
    return parseRPrTextArea(txPr);
}

/**
 * textAreaFromRPrAttrs.
 *
 * @param {string} attrs - The attrs parameter.
 * @param {string} inner - The inner parameter.
 * @returns {TextAreaModel} - Returns the result.
 */
function textAreaFromRPrAttrs(attrs: string, inner: string): TextAreaModel {
    const model: TextAreaModel = DEFAULT_TEXT_AREA();
    const sz: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/\bsz="(\d+)"/.exec(attrs));
    if (sz !== undefined) {
        const n: number = Number(sz);
        if (Number.isFinite(n) && n > 0) {model.size = n / 100; }
    }
    const b: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/\bb="([01]|true|false)"/i.exec(attrs));
    if (b === '1' || b === 'true') {model.bold = true; }
    const i: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/\bi="([01]|true|false)"/i.exec(attrs));
    if (i === '1' || i === 'true') {model.italic = true; }
    const typeface: string =
    ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : (((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/\btypeface="([^"]*)"/.exec(attrs))); })(/<a:latin\b[^>]*\btypeface="([^"]*)"/.exec(inner));
    if (typeface !== undefined && typeface.length > 0) {
        model.fontName = unescapeXml(typeface);
    }
    const srgb: string =
    ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : (((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{8})"/i.exec(inner))); })(/<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{6})"/i.exec(inner));
    if (srgb !== undefined) {
        try {
            const color: string = normalizeChartColor(srgb);
            if (color !== undefined) {model.color = color; }
        } catch {
            // ignore
        }
    }
    return model;
}

/**
 * parseView3D.
 *
 * @param {string} xml - The xml parameter.
 * @returns {ChartView3D | undefined} - Returns the result.
 */
function parseView3D(xml: string): ChartView3D | undefined {
    const block: string = ((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:view3D\b[^>]*>([\s\S]*?)<\/c:view3D>/.exec(xml));
    if (block === undefined) {return undefined; }
    const view: ChartView3D = {};
    const rotationX: string = parseChildVal(block, 'rotX');
    const heightPercent: string = parseChildVal(block, 'hPercent');
    const rotationY: string = parseChildVal(block, 'rotY');
    const depthPercent: string = parseChildVal(block, 'depthPercent');
    const perspective: string = parseChildVal(block, 'perspective');
    const rightAngleAxis: string = parseChildVal(block, 'rAngAx');
    if (rotationX !== undefined) {view.rotationX = Number(rotationX); }
    if (heightPercent !== undefined) {view.heightPercent = Number(heightPercent); }
    if (rotationY !== undefined) {view.rotationY = Number(rotationY); }
    if (depthPercent !== undefined) {view.depthPercent = Number(depthPercent); }
    if (perspective !== undefined) {view.perspective = Number(perspective); }
    if (rightAngleAxis !== undefined) {
        view.rightAngleAxis = rightAngleAxis === '1' || rightAngleAxis === 'true';
    }
    return Object.keys(view).length > 0 ? view : undefined;
}

/**
 * parseDataSource.
 *
 * @param {string} xml - The xml parameter.
 * @param {OpcPackage | undefined} pkg - The pkg parameter.
 * @param {string | undefined} chartPartName - The chartPartName parameter.
 * @returns {ChartDataSource} - Returns the result.
 */
function parseDataSource(
    xml: string,
    pkg: OpcPackage | undefined,
    chartPartName: string | undefined
): ChartDataSource {
    const id: string =
    ((m: RegExpExecArray) => { const v: string = m == null ? undefined : m[1]; return v != null ? v : (((__t: RegExpExecArray) => __t == null ? undefined : __t[1])(/<c:externalData\b[^>]*\b(?:r:)?id="([^"]+)"/.exec(xml))); })(/<c:externalData\b[^>]*\br:id="([^"]+)"/.exec(xml));
    if (id === undefined) {return { kind: 'none' }; }
    if (pkg === undefined || chartPartName === undefined) {
        return { kind: 'embedded', relationshipId: id };
    }
    const rel: OpcRelationship = pkg.getRelationships(chartPartName).find((r: OpcRelationship) => r.id === id);
    if (rel === undefined) {
        return { kind: 'embedded', relationshipId: id };
    }
    if (rel.targetMode === 'External') {
        return { kind: 'external', relationshipId: id, target: rel.target };
    }
    return { kind: 'embedded', relationshipId: id };
}

// --- type resolution / dataRange ---

/**
 * Map a classic {@link ChartType} token to plot-family defaults.
 * Extended (ChartEx) tokens fall through to a clustered-column default;
 * callers that serialize classic chart space must already exclude them.
 *
 * @param {ChartType} type - The type parameter.
 * @returns {PlotKind} - Returns the result.
 */
function plotKindFromType(type: ChartType): PlotKind {
    switch (type) {
    case ChartType.ColumnClustered:
        return { family: 'bar', barDir: 'col', barGrouping: 'clustered' };
    case ChartType.ColumnStacked:
        return { family: 'bar', barDir: 'col', barGrouping: 'stacked' };
    case ChartType.ColumnPercentStacked:
        return { family: 'bar', barDir: 'col', barGrouping: 'percentStacked' };
    case ChartType.BarClustered:
        return { family: 'bar', barDir: 'bar', barGrouping: 'clustered' };
    case ChartType.BarStacked:
        return { family: 'bar', barDir: 'bar', barGrouping: 'stacked' };
    case ChartType.BarPercentStacked:
        return { family: 'bar', barDir: 'bar', barGrouping: 'percentStacked' };
    case ChartType.Line:
        return { family: 'line', areaGrouping: 'standard' };
    case ChartType.LineStacked:
        return { family: 'line', areaGrouping: 'stacked' };
    case ChartType.LinePercentStacked:
        return { family: 'line', areaGrouping: 'percentStacked' };
    case ChartType.LineMarkers:
        return { family: 'line', areaGrouping: 'standard', showMarkers: true };
    case ChartType.LineStackedMarkers:
        return { family: 'line', areaGrouping: 'stacked', showMarkers: true };
    case ChartType.LinePercentStackedMarkers:
        return { family: 'line', areaGrouping: 'percentStacked', showMarkers: true };
    case ChartType.Pie:
        return { family: 'pie' };
    case ChartType.PieExploded:
        return { family: 'pie', explosion: DEFAULT_DOUGHNUT_EXPLOSION };
    case ChartType.PieOfPie:
        return { family: 'ofPie', ofPieType: 'pie' };
    case ChartType.BarOfPie:
        return { family: 'ofPie', ofPieType: 'bar' };
    case ChartType.Doughnut:
        return { family: 'doughnut', holeSize: DEFAULT_DOUGHNUT_HOLE_SIZE };
    case ChartType.DoughnutExploded:
        return {
            family: 'doughnut',
            holeSize: DEFAULT_DOUGHNUT_HOLE_SIZE,
            explosion: DEFAULT_DOUGHNUT_EXPLOSION
        };
    case ChartType.ScatterMarkers:
        return { family: 'scatter', scatterStyle: 'marker' };
    case ChartType.ScatterLine:
        return { family: 'scatter', scatterStyle: 'line' };
    case ChartType.ScatterLineMarkers:
        return { family: 'scatter', scatterStyle: 'lineMarker' };
    case ChartType.ScatterSmooth:
        return { family: 'scatter', scatterStyle: 'smooth' };
    case ChartType.ScatterSmoothMarkers:
        return { family: 'scatter', scatterStyle: 'smoothMarker' };
    case ChartType.Bubble:
        return { family: 'bubble' };
    case ChartType.Bubble3D:
        return { family: 'bubble' };
    case ChartType.Area:
        return { family: 'area', areaGrouping: 'standard' };
    case ChartType.AreaStacked:
        return { family: 'area', areaGrouping: 'stacked' };
    case ChartType.AreaPercentStacked:
        return { family: 'area', areaGrouping: 'percentStacked' };
    case ChartType.Column3D:
        return { family: 'bar3d', barDir: 'col', barGrouping: 'standard' };
    case ChartType.ColumnClustered3D:
        return { family: 'bar3d', barDir: 'col', barGrouping: 'clustered' };
    case ChartType.ColumnStacked3D:
        return { family: 'bar3d', barDir: 'col', barGrouping: 'stacked' };
    case ChartType.ColumnPercentStacked3D:
        return { family: 'bar3d', barDir: 'col', barGrouping: 'percentStacked' };
    case ChartType.BarClustered3D:
        return { family: 'bar3d', barDir: 'bar', barGrouping: 'clustered' };
    case ChartType.BarStacked3D:
        return { family: 'bar3d', barDir: 'bar', barGrouping: 'stacked' };
    case ChartType.BarPercentStacked3D:
        return { family: 'bar3d', barDir: 'bar', barGrouping: 'percentStacked' };
    case ChartType.Line3D:
        return { family: 'line3d', areaGrouping: 'standard' };
    case ChartType.Pie3D:
        return { family: 'pie3d' };
    case ChartType.PieExploded3D:
        return { family: 'pie3d', explosion: DEFAULT_DOUGHNUT_EXPLOSION };
    case ChartType.Area3D:
        return { family: 'area3d', areaGrouping: 'standard' };
    case ChartType.AreaStacked3D:
        return { family: 'area3d', areaGrouping: 'stacked' };
    case ChartType.AreaPercentStacked3D:
        return { family: 'area3d', areaGrouping: 'percentStacked' };
    case ChartType.Surface3D:
        return { family: 'surface3d', wireframe: false };
    case ChartType.SurfaceNoColor3D:
        return { family: 'surface3d', wireframe: true };
    case ChartType.SurfaceContour:
        return { family: 'surface', wireframe: false };
    case ChartType.SurfaceNoColorContour:
        return { family: 'surface', wireframe: true };
    case ChartType.Radar:
        return { family: 'radar', radarStyle: 'standard' };
    case ChartType.RadarMarkers:
        return { family: 'radar', radarStyle: 'marker' };
    case ChartType.RadarFilled:
        return { family: 'radar', radarStyle: 'filled' };
    case ChartType.StockHighLowClose:
        return { family: 'stock', stock: 'hlc' };
    case ChartType.StockOpenHighLowClose:
        return { family: 'stock', stock: 'ohlc' };
    case ChartType.StockVolumeHighLowClose:
        return { family: 'stock', stock: 'vhlc' };
    case ChartType.StockVolumeOpenHighLowClose:
        return { family: 'stock', stock: 'vohlc' };
    case ChartType.ColumnClusteredLine:
    case ChartType.ColumnClusteredLineSecondaryAxis:
        return { family: 'combo' };
    default:
        return { family: 'bar', barDir: 'col', barGrouping: 'clustered' };
    }
}

/**
 * Derive series formulas from a rectangular data range with header row/column.
 * Layout matches common XlsIO / Excel DataRange behaviour (headers included).
 *
 * Single-column (`A1:A5`) and single-row (`A1:E1`) ranges are valid: they map
 * to one series of values with no category-label or series-title formulas
 * (Excel and Syncfusion XlsIO accept the same layout as a single series).
 *
 * @param {string} dataRange - The dataRange parameter.
 * @param {boolean} isSeriesInRows - The isSeriesInRows parameter.
 * @param {string} defaultSheetName - The defaultSheetName parameter.
 * @returns {SeriesModel[]} - Returns the result.
 */
function deriveSeriesFromDataRange(
    dataRange: string,
    isSeriesInRows: boolean,
    defaultSheetName: string
): SeriesModel[] {
    const { sheetName, range } = splitSheetRange(dataRange, defaultSheetName);
    const sheetPrefix: string = quoteSheetName(sheetName);
    const singleColumn: boolean = range.startCol === range.endCol;
    const singleRow: boolean = range.startRow === range.endRow;

    if (isSeriesInRows) {
    // Single row (or single cell): one series whose values span the whole range.
    // Excel/XlsIO treat A1:E1 (and A1) as a valid single-series data source.
        if (singleRow) {
            return [
                {
                    values: absSheetRange(
                        sheetPrefix,
                        range.startRow,
                        range.startCol,
                        range.endRow,
                        range.endCol
                    ),
                    serieFormat: DEFAULT_FRAME(),
                    dataLabels: DEFAULT_DATA_LABELS()
                }
            ];
        }

        // Single column, series-in-rows: first cell is series title; remaining cells
        // are values (no category header row available).
        if (singleColumn) {
            if (range.startRow >= range.endRow) {
                // Defensive: single cell already handled via singleRow.
                throw new InvalidChartError('dataRange is too small to derive series in rows');
            }
            return [
                {
                    title: absSheetCell(sheetPrefix, range.startRow, range.startCol),
                    values: absSheetRange(
                        sheetPrefix,
                        range.startRow + 1,
                        range.startCol,
                        range.endRow,
                        range.endCol
                    ),
                    serieFormat: DEFAULT_FRAME(),
                    dataLabels: DEFAULT_DATA_LABELS()
                }
            ];
        }

        // Multi-row / multi-col: series in rows → each data row after header col is
        // a series; category labels from remaining header-row cells.
        const catStartCol: number = range.startCol + 1;
        if (catStartCol > range.endCol || range.startRow >= range.endRow) {
            throw new InvalidChartError('dataRange is too small to derive series in rows');
        }
        const categories: string = absSheetRange(
            sheetPrefix,
            range.startRow,
            catStartCol,
            range.startRow,
            range.endCol
        );
        const series: SeriesModel[] = [];
        for (let r: number = range.startRow + 1; r <= range.endRow; r++) {
            const title: string = absSheetCell(sheetPrefix, r, range.startCol);
            const values: string = absSheetRange(sheetPrefix, r, catStartCol, r, range.endCol);
            series.push({
                title,
                categoryLabels: categories,
                values,
                serieFormat: DEFAULT_FRAME(),
                dataLabels: DEFAULT_DATA_LABELS()
            });
        }
        return series;
    }

    // Series in columns (default).
    // Single column (or single cell): one series whose values span the whole range.
    // Excel/XlsIO treat A1:A5 (and A1) as a valid single-series data source.
    if (singleColumn) {
        return [
            {
                values: absSheetRange(
                    sheetPrefix,
                    range.startRow,
                    range.startCol,
                    range.endRow,
                    range.endCol
                ),
                serieFormat: DEFAULT_FRAME(),
                dataLabels: DEFAULT_DATA_LABELS()
            }
        ];
    }

    // Single row, series-in-columns: first cell is series title; remaining cells
    // are values (no category header column available).
    if (singleRow) {
        if (range.startCol >= range.endCol) {
            throw new InvalidChartError('dataRange is too small to derive series in columns');
        }
        return [
            {
                title: absSheetCell(sheetPrefix, range.startRow, range.startCol),
                values: absSheetRange(
                    sheetPrefix,
                    range.startRow,
                    range.startCol + 1,
                    range.endRow,
                    range.endCol
                ),
                serieFormat: DEFAULT_FRAME(),
                dataLabels: DEFAULT_DATA_LABELS()
            }
        ];
    }

    // Multi-row / multi-col: header row titles; category labels first column.
    const catStartRow: number = range.startRow + 1;
    if (catStartRow > range.endRow || range.startCol >= range.endCol) {
        throw new InvalidChartError('dataRange is too small to derive series in columns');
    }
    const categories: string = absSheetRange(
        sheetPrefix,
        catStartRow,
        range.startCol,
        range.endRow,
        range.startCol
    );
    const series: SeriesModel[] = [];
    for (let c: number = range.startCol + 1; c <= range.endCol; c++) {
        const title: string = absSheetCell(sheetPrefix, range.startRow, c);
        const values: string = absSheetRange(sheetPrefix, catStartRow, c, range.endRow, c);
        series.push({
            title,
            categoryLabels: categories,
            values,
            serieFormat: DEFAULT_FRAME(),
            dataLabels: DEFAULT_DATA_LABELS()
        });
    }
    return series;
}

/**
 * splitSheetRange.
 *
 * @param {string} dataRange - The dataRange parameter.
 * @param {string} defaultSheetName - The defaultSheetName parameter.
 * @returns {Object} - Returns the result.
 */
function splitSheetRange(
    dataRange: string,
    defaultSheetName: string
): { sheetName: string; range: CellRange } {
    const trimmed: string = dataRange.trim();
    const bang: number = trimmed.lastIndexOf('!');
    let sheetName: string = defaultSheetName;
    let local: string = trimmed;
    if (bang >= 0) {
        sheetName = unquoteSheetName(trimmed.slice(0, bang));
        local = trimmed.slice(bang + 1);
    }
    // Strip optional absolute $ for parseA1Range.
    try {
        const range: CellRange = parseA1Range(local.replace(/\$/g, ''));
        return { sheetName, range };
    } catch (err) {
        throw new InvalidChartError(`Invalid dataRange "${dataRange}"`, { cause: err });
    }
}

/**
 * unquoteSheetName.
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
function unquoteSheetName(name: string): string {
    const t: string = name.trim();
    if (t.startsWith('\'') && t.endsWith('\'') && t.length >= 2) {
        return t.slice(1, -1).replace(/''/g, '\'');
    }
    return t;
}

/**
 * quoteSheetName.
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
function quoteSheetName(name: string): string {
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {return name; }
    return `'${name.replace(/'/g, '\'\'')}'`;
}

/**
 * absSheetCell.
 *
 * @param {string} sheetPrefix - The sheetPrefix parameter.
 * @param {number} row - The row parameter.
 * @param {number} col - The col parameter.
 * @returns {string} - Returns the result.
 */
function absSheetCell(sheetPrefix: string, row: number, col: number): string {
    return `${sheetPrefix}!$${colLetters(col)}$${row}`;
}

/**
 * absSheetRange.
 *
 * @param {string} sheetPrefix - The sheetPrefix parameter.
 * @param {number} r1 - The r1 parameter.
 * @param {number} c1 - The c1 parameter.
 * @param {number} r2 - The r2 parameter.
 * @param {number} c2 - The c2 parameter.
 * @returns {string} - Returns the result.
 */
function absSheetRange(
    sheetPrefix: string,
    r1: number,
    c1: number,
    r2: number,
    c2: number
): string {
    return `${sheetPrefix}!$${colLetters(c1)}$${r1}:$${colLetters(c2)}$${r2}`;
}

/**
 * colLetters.
 *
 * @param {number} col - The col parameter.
 * @returns {string} - Returns the result.
 */
function colLetters(col: number): string {
    // Local copy avoids coupling formatA1 relative emission for abs formulas.
    let n: number = col;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}

// --- helpers ---

/**
 * Read chart relationship Id from a drawing anchor.
 * Writers may bind the relationships namespace as `r` (`r:id`) or another
 * prefix (`p7:id`, etc.); bare `id` is accepted only on the chart element.
 *
 * @param {string} anchor - The anchor parameter.
 * @returns {string | undefined} - Returns the result.
 */
function chartRelationshipIdFromAnchor(anchor: string): string | undefined {
    const m: RegExpExecArray =
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    /<(?:[A-Za-z_][\w.-]*:)?chart\b[^>]*\b(?:(?:[A-Za-z_][\w.-]*:)?id)="([^"]+)"/.exec(
        anchor
    );
    return m != null ? m[1] : undefined;
}

/**
 * isChartGraphicFrameAnchor.
 *
 * @param {string} anchor - The anchor parameter.
 * @returns {boolean} - Returns the result.
 */
function isChartGraphicFrameAnchor(anchor: string): boolean {
    return (
        anchor.includes('graphicFrame') &&
    (anchor.includes('chart') || anchor.includes(C_NS) || anchor.includes('chartex'))
    );
}

/**
 * isChartType.
 *
 * @param {unknown} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function isChartType(value: unknown): value is ChartType {
    return typeof value === 'string' && CHART_TYPE_VALUES.has(value);
}

/**
 * isClassicChartType.
 *
 * @param {unknown} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function isClassicChartType(value: unknown): value is ClassicChartType {
    return isChartType(value) && !isChartExType(value);
}

/**
 * isStockChartType.
 *
 * @param {ChartType} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
function isStockChartType(type: ChartType): boolean {
    return (
        type === ChartType.StockHighLowClose ||
        type === ChartType.StockOpenHighLowClose ||
        type === ChartType.StockVolumeHighLowClose ||
        type === ChartType.StockVolumeOpenHighLowClose
    );
}

/**
 * firstCategoryLabelFormula.
 *
 * @param {string | ReadonlyArray<string> | undefined} categoryLabels - The categoryLabels parameter.
 * @returns {string | undefined} - Returns the result.
 */
function firstCategoryLabelFormula(
    categoryLabels: string | ReadonlyArray<string> | undefined
): string | undefined {
    if (categoryLabels === undefined) {return undefined; }
    if (typeof categoryLabels === 'string') {
        const trimmed: string = categoryLabels.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    const first: string = categoryLabels[0];
    if (typeof first !== 'string') {return undefined; }
    const trimmed: string = first.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Whether a `c:lineChart` plot encodes markers (chart-level `c:marker` or any
 * series-level `c:marker`). Used by {@link plotTagToChartType} to distinguish
 * Line vs LineMarkers (and stacked variants).
 *
 * @param {string} plotXml - The plotXml parameter.
 * @returns {boolean} - Returns the result.
 */
function lineChartHasMarkers(plotXml: string): boolean {
    // Chart-level CT_Boolean marker, or any series-level CT_Marker element.
    const chartMarker: string = parseAttrVal(plotXml, 'marker');
    if (chartMarker === '1' || chartMarker === 'true') {return true; }
    // Series marker: <c:marker>…</c:marker> or self-closing inside a series.
    if (/<c:ser\b[\s\S]*?<c:marker\b/.test(plotXml)) {return true; }
    return false;
}

/**
 * resolveGrouping.
 *
 * @param {ChartType} type - The type parameter.
 * @param {BarGrouping | AreaGrouping | undefined} grouping - The grouping parameter.
 * @returns {BarGrouping | AreaGrouping | undefined} - Returns the result.
 */
function resolveGrouping(
    type: ChartType,
    grouping: BarGrouping | AreaGrouping | undefined
): BarGrouping | AreaGrouping | undefined {
    const kind: PlotKind = plotKindFromType(type);
    if (kind.family === 'bar' || kind.family === 'bar3d') {
        const g: BarGrouping = ((__t: BarGrouping) => __t != null ? __t : 'clustered')(grouping != null ? grouping : kind.barGrouping);
        if (!BAR_GROUPINGS.has(g)) {
            throw new InvalidChartError(
                `Invalid bar grouping "${g}"; expected clustered|stacked|percentStacked|standard`
            );
        }
        // 2-D bar charts do not use ST_BarGrouping "standard" in our public model.
        if (kind.family === 'bar' && g === 'standard') {
            throw new InvalidChartError(
                'Invalid bar grouping "standard" for 2-D bar/column; use clustered|stacked|percentStacked'
            );
        }
        return g as BarGrouping;
    }
    if (
        kind.family === 'area' ||
    kind.family === 'area3d' ||
    kind.family === 'line' ||
    kind.family === 'line3d'
    ) {
        const g: BarGrouping = ((__t: BarGrouping) => __t != null ? __t : 'standard')(grouping != null ? grouping : kind.areaGrouping);
        if (!AREA_GROUPINGS.has(g)) {
            throw new InvalidChartError(
                `Invalid area/line grouping "${g}"; expected standard|stacked|percentStacked`
            );
        }
        return g as AreaGrouping;
    }
    if (grouping !== undefined) {
        throw new InvalidChartError(`grouping is not applicable to chart type "${type}"`);
    }
    return undefined;
}

/**
 * resolveScatterStyle.
 *
 * @param {ChartType} type - The type parameter.
 * @param {ScatterStyle | undefined} style - The style parameter.
 * @returns {ScatterStyle | undefined} - Returns the result.
 */
function resolveScatterStyle(
    type: ChartType,
    style: ScatterStyle | undefined
): ScatterStyle | undefined {
    const kind: PlotKind = plotKindFromType(type);
    if (kind.family !== 'scatter') {
        if (style !== undefined) {
            throw new InvalidChartError('scatterStyle is only valid for scatter charts');
        }
        return undefined;
    }
    const s: ScatterStyle = ((__t: ScatterStyle) => __t != null ? __t : 'marker')(style != null ? style : kind.scatterStyle);
    if (!SCATTER_STYLES.has(s)) {
        throw new InvalidChartError(`Invalid scatterStyle "${s}"`);
    }
    return s;
}

/**
 * resolveLegendPosition.
 *
 * @param {LegendPositionValue | undefined} value - The value parameter.
 * @returns {LegendPositionValue} - Returns the result.
 */
function resolveLegendPosition(value: LegendPositionValue | undefined): LegendPositionValue {
    if (value === undefined) {return LegendPosition.Right; }
    if (!LEGEND_POSITIONS.has(value)) {
        throw new InvalidChartError(`Invalid legendPosition "${String(value)}"`);
    }
    return value;
}

/**
 * normalizeView3D.
 *
 * @param {ChartView3D} view - The view parameter.
 * @returns {ChartView3D} - Returns the result.
 */
function normalizeView3D(view: ChartView3D): ChartView3D {
    if (view === null || typeof view !== 'object') {
        throw new InvalidChartError('view3D must be an object');
    }
    const out: ChartView3D = {};
    if (view.rotationX !== undefined) {
        requireNumberInRange(view.rotationX, 'view3D.rotationX', -90, 90);
        out.rotationX = view.rotationX;
    }
    if (view.rotationY !== undefined) {
        requireNumberInRange(view.rotationY, 'view3D.rotationY', 0, 360);
        out.rotationY = view.rotationY;
    }
    if (view.heightPercent !== undefined) {
        requireNumberInRange(view.heightPercent, 'view3D.heightPercent', 5, 500);
        out.heightPercent = view.heightPercent;
    }
    if (view.depthPercent !== undefined) {
        requireNumberInRange(view.depthPercent, 'view3D.depthPercent', 20, 2000);
        out.depthPercent = view.depthPercent;
    }
    if (view.perspective !== undefined) {
        requireNumberInRange(view.perspective, 'view3D.perspective', 0, 240);
        out.perspective = view.perspective;
    }
    if (view.rightAngleAxis !== undefined) {
        if (typeof view.rightAngleAxis !== 'boolean') {
            throw new InvalidChartError('view3D.rightAngleAxis must be a boolean');
        }
        out.rightAngleAxis = view.rightAngleAxis;
    }
    return out;
}

/**
 * validateDataSource.
 *
 * @param {ChartDataSource} ds - The ds parameter.
 * @returns {void} - Returns the result.
 */
function validateDataSource(ds: ChartDataSource): void {
    if (ds === null || typeof ds !== 'object' || !('kind' in ds)) {
        throw new InvalidChartError('dataSource must be { kind: embedded|external|none, ... }');
    }
    if (ds.kind === 'none') {return; }
    if (ds.kind !== 'embedded' && ds.kind !== 'external') {
        throw new InvalidChartError(`Unknown dataSource.kind "${String((ds as { kind: string }).kind)}"`);
    }
    if (typeof ds.relationshipId !== 'string' || ds.relationshipId.length === 0) {
        throw new InvalidChartError('dataSource.relationshipId is required for embedded/external');
    }
}

/**
 * Detect sheet formula / A1 references vs literal series titles.
 *
 * IMPORTANT: bare labels like `Series1` must NOT match — they are common
 * XlsIO-style titles. Emitting them as `c:strRef/c:f` produces invalid chart
 * formulas and Excel reports the workbook as corrupted.
 *
 * True refs: sheet-qualified (`Sheet1!A1`), absolute (`$A$1`), ranges (`A1:B2`),
 * or a bare A1 cell with at most three column letters (A–XFD).
 *
 * @param {string} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function looksLikeFormula(value: string): boolean {
    const t: string = value.trim();
    if (t.length === 0) {return false; }
    // Sheet bang, absolute $, or range colon always indicate a formula/ref.
    if (/[!:$]/.test(t)) {return true; }
    // Bare single cell A1 (optional $ already handled above) — max 3 col letters.
    if (/^[A-Za-z]{1,3}\d{1,7}$/.test(t)) {return true; }
    // Bare A1:A1-style range without $.
    if (/^[A-Za-z]{1,3}\d{1,7}:[A-Za-z]{1,3}\d{1,7}$/.test(t)) {return true; }
    return false;
}

/**
 * extractAnchors.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string[]} - Returns the result.
 */
function extractAnchors(xml: string): string[] {
    const matches: RegExpMatchArray = xml.match(/<xdr:(?:oneCellAnchor|twoCellAnchor)\b[\s\S]*?<\/xdr:(?:oneCellAnchor|twoCellAnchor)>/g);
    return matches !== null ? matches : [];
}

interface ChartAnchorMarker {
    readonly col0: number;
    readonly colOff: number;
    readonly row0: number;
    readonly rowOff: number;
}

interface ChartAnchorGeometry {
    readonly row: number;
    readonly column: number;
    /** Offset right of the left of {@link column}, DrawingML xdr:colOff EMU. */
    readonly colOffEmu: number;
    /** Offset below the top of {@link row}, DrawingML xdr:rowOff EMU. */
    readonly rowOffEmu: number;
    readonly widthEmu: number;
    readonly heightEmu: number;
}

/**
 * Parse `xdr:from` / `xdr:to` marker (col, colOff, row, rowOff).
 * Tolerant of whitespace and minor child ordering noise between required tags.
 *
 * @param {string} xml - The xml parameter.
 * @param {'from' | 'to'} tag - The tag parameter.
 * @returns {ChartAnchorMarker | undefined} - Returns the result.
 */
function parseChartAnchorMarker(xml: string, tag: 'from' | 'to'): ChartAnchorMarker | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const match: RegExpExecArray = new RegExp(
        `<xdr:${tag}>[\\s\\S]*?<xdr:col>(\\d+)</xdr:col>[\\s\\S]*?<xdr:colOff>(\\d+)</xdr:colOff>` +
      `[\\s\\S]*?<xdr:row>(\\d+)</xdr:row>[\\s\\S]*?<xdr:rowOff>(\\d+)</xdr:rowOff>[\\s\\S]*?</xdr:${tag}>`,
        'i'
    ).exec(xml);
    if (match === null) {
        return undefined;
    }
    return {
        col0: Number(match[1]),
        colOff: Number(match[2]),
        row0: Number(match[3]),
        rowOff: Number(match[4])
    };
}

/**
 * First positive DrawingML extent on the anchor.
 * Prefers `xdr:ext` (oneCell / absolute) over `a:ext` (graphicFrame xfrm).
 * Zero extents are ignored — Excel twoCell chart frames often write cx="0" cy="0".
 *
 * @param {string} xml - The xml parameter.
 * @returns {Object} - Returns the result.
 */
function parsePositiveChartExtent(xml: string): { widthEmu: number; heightEmu: number } | undefined {
    const extentTags: string[] = ['xdr:ext', 'a:ext'];
    for (let i: number = 0; i < extentTags.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const tag: string = extentTags[i]!;
        // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
        const re: RegExp = new RegExp('<' + tag + '\\b([^>/]*)', 'gi');
        let match: RegExpExecArray = re.exec(xml);
        while (match !== null) {
            const attrs: string = match[1] !== undefined ? match[1] : '';
            const cxMatch: RegExpExecArray = /\bcx="(\d+)"/i.exec(attrs);
            const cyMatch: RegExpExecArray = /\bcy="(\d+)"/i.exec(attrs);
            if (cxMatch !== null && cyMatch !== null) {
                const widthEmu: number = Number(cxMatch[1]);
                const heightEmu: number = Number(cyMatch[1]);
                if (widthEmu > 0 && heightEmu > 0) {
                    return { widthEmu, heightEmu };
                }
            }
            match = re.exec(xml);
        }
    }
    return undefined;
}

/**
 * Resolve chart anchor row/column (1-based) and size in EMU.
 *
 * Size priority:
 * 1. Positive `xdr:ext` / `a:ext`
 * 2. `xdr:from`→`xdr:to` using live row heights and column widths
 * 3. Otherwise 0 (caller may still load type/series; getters report 0 pt)
 *
 * @param {string} anchor - The anchor parameter.
 * @param {SheetMetrics | undefined} metrics - The metrics parameter.
 * @returns {ChartAnchorGeometry | undefined} - Returns the result.
 */
function parseChartAnchorGeometry(anchor: string, metrics?: SheetMetrics): ChartAnchorGeometry | undefined {
    const from: ChartAnchorMarker = parseChartAnchorMarker(anchor, 'from');
    if (from === undefined) {
        return undefined;
    }

    let widthEmu: number = 0;
    let heightEmu: number = 0;
    const extent: { widthEmu: number; heightEmu: number; } = parsePositiveChartExtent(anchor);
    if (extent !== undefined) {
        widthEmu = extent.widthEmu;
        heightEmu = extent.heightEmu;
    } else {
        const to: ChartAnchorMarker = parseChartAnchorMarker(anchor, 'to');
        if (to !== undefined) {
            widthEmu = twoCellAnchorWidthEmu(from.col0, from.colOff, to.col0, to.colOff, metrics);
            heightEmu = twoCellAnchorHeightEmu(from.row0, from.rowOff, to.row0, to.rowOff, metrics);
        }
    }

    return {
        row: from.row0 + 1,
        column: from.col0 + 1,
        colOffEmu: from.colOff,
        rowOffEmu: from.rowOff,
        widthEmu,
        heightEmu
    };
}

/**
 * attribute.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} element - The element parameter.
 * @param {string} name - The name parameter.
 * @returns {string | undefined} - Returns the result.
 */
function attribute(xml: string, element: string, name: string): string | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const match: RegExpExecArray = new RegExp(`<xdr:${element}\\b[^>]*\\b${name}="([^"]*)"`).exec(xml);
    if (match === null || match[1] === undefined) {
        return undefined;
    }
    return unescapeXml(match[1]);
}

/**
 * numberAttr.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} element - The element parameter.
 * @param {string} name - The name parameter.
 * @returns {number | undefined} - Returns the result.
 */
function numberAttr(xml: string, element: string, name: string): number | undefined {
    const value: string = attribute(xml, element, name);
    return value === undefined ? undefined : Number(value);
}

/**
 * parseAttrVal.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} element - The element parameter.
 * @returns {string | undefined} - Returns the result.
 */
function parseAttrVal(xml: string, element: string): string | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const match: RegExpExecArray = new RegExp(`<c:${element}\\b[^>]*\\bval="([^"]*)"`, 'i').exec(xml);
    return (match == null ? undefined : match[1]);
}

/**
 * parseChildVal.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} element - The element parameter.
 * @returns {string | undefined} - Returns the result.
 */
function parseChildVal(xml: string, element: string): string | undefined {
    return parseAttrVal(xml, element);
}

/**
 * requireNumberInRange.
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @param {number} min - The min parameter.
 * @param {number} max - The max parameter.
 * @returns {void} - Returns the result.
 */
function requireNumberInRange(value: number, label: string, min: number, max: number): void {
    if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
        throw new InvalidChartError(`${label} must be a number in [${min}, ${max}]`);
    }
}

/**
 * trailingNumber.
 *
 * @param {string} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function trailingNumber(value: string): number {
    const match: RegExpExecArray = /(\d+)$/.exec(value);
    return match === null ? 0 : Number(match[1]);
}

/**
 * maxSheetRelId.
 *
 * @param {ReadonlyArray<OpcRelationship>} rels - The rels parameter.
 * @returns {number} - Returns the result.
 */
function maxSheetRelId(rels: ReadonlyArray<OpcRelationship>): number {
    return rels.reduce((max: number, rel: OpcRelationship) => {
        const match: RegExpExecArray = /^rId(\d+)$/i.exec(rel.id);
        return match === null ? max : Math.max(max, Number(match[1]));
    }, 0);
}

/**
 * relativeTarget.
 *
 * @param {string} source - The source parameter.
 * @param {string} target - The target parameter.
 * @returns {string} - Returns the result.
 */
function relativeTarget(source: string, target: string): string {
    const sourceDir: string = source.slice(0, source.lastIndexOf('/'));
    const sourceParts: string[] = sourceDir.split('/').filter(Boolean);
    const targetParts: string[] = target.split('/').filter(Boolean);
    while (sourceParts.length > 0 && targetParts[0] === sourceParts[0]) {
        sourceParts.shift();
        targetParts.shift();
    }
    return `${'../'.repeat(sourceParts.length)}${targetParts.join('/')}`;
}
