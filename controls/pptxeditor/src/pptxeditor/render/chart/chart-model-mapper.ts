import {
    ChartAxisModel, ChartColor, ChartDataLabelsModel, ChartErrorBarsModel, ChartFill, ChartLine, ChartPlotModel,
    ChartRenderModel, ChartSeriesModel, ChartShapeFormat, ChartTextStyle, ChartTrendlineModel
} from '@syncfusion/ej2-pptx';
import { ChartGradientSpec, ChartPatternSpec } from './pattern-fill';
import { SlideFrameThemeSnapshot } from '../../main-slide/slide-frame-model';
import { RenderColor, resolveRenderColor } from '../background/color';

/*
 * Property-mapping layer: `ChartRenderModel` (ej2-pptx) -> `ej2-office-chart` JSON.
 *
 * Output follows the data source consumed by `ChartComponent.chartRender` (see ej2-office-chart
 * `spec/chart_1.spec.ts`). ej2-office-chart only reads a subset of the JSON (type, categories, series
 * values/colours, data-label position, error bars, trendlines, axis title/limits/gridlines, legend position,
 * title). Everything else the PPTX model carries (fonts, sizes, frame fills, line colours) is returned as
 * `ChartStyleHints` and applied to the ej2-charts instance by the renderer, so nothing the parser exposes is
 * dropped silently - what cannot be drawn is reported in `unsupported`.
 */

/**
 * ej2-office-chart chart type keywords.
 *
 * @internal
 */
export type OfficeChartType =
    'Column_Clustered' | 'Column_Stacked' | 'Column_Stacked_100' | 'Bar_Clustered' | 'Bar_Stacked' | 'Bar_Stacked_100' |
    'Line' | 'Line_Markers' | 'Line_Stacked' | 'Line_Markers_Stacked' | 'Line_Stacked_100' | 'Line_Markers_Stacked_100' |
    'Area' | 'Area_Stacked' | 'Area_Stacked_100' | 'Pie' | 'Doughnut' | 'Scatter_Markers' | 'Bubble';
/** Plot kinds drawn by overriding the series type after `chartRender` (office-chart has no keyword for them). */
const RADAR_BASE: OfficeChartType = 'Line_Markers';

/**
 * One resolved fill/line colour pair in the office-chart JSON shape.
 *
 * @internal
 */
export interface OfficeChartFill { foreColor?: string; rgb?: string }

/**
 * Series/data-point format in the office-chart JSON shape.
 *
 * @internal
 */
export interface OfficeChartDataPoint { id: number; fill: OfficeChartFill; line: { color?: string; rgb?: string } }

/**
 * Axis block of the office-chart JSON.
 *
 * @internal
 */
export interface OfficeChartAxis {
    chartTitle?: string;
    categoryType?: string;
    numberFormat?: string;
    minimumValue: number;
    maximumValue: number;
    majorUnit: number;
    isAutoMajor?: boolean;
    hasMajorGridLines: boolean;
    hasMinorGridLines: boolean;
}

/**
 * Series block of the office-chart JSON.
 *
 * @internal
 */
export interface OfficeChartSeries {
    seriesName: string;
    dataPoints: OfficeChartDataPoint[];
    seriesFormat?: { fill: OfficeChartFill };
    dataLabel?: { position: string };
    errorBar?: { type: string; direction: string; endStyle: string };
    trendLines?: Array<{ type: string; name: string; forward: number; backward: number; intercept: number | string }>;
}

/**
 * Category block of the office-chart JSON.
 *
 * @internal
 */
export interface OfficeChartCategory {
    categoryXName: string;
    chartData: Array<{ yValue: number | null; size?: number | null }>;
}

/**
 * The ej2-office-chart data source.
 *
 * @internal
 */
export interface OfficeChartJson {
    chartType: OfficeChartType;
    /** Chart width in office-chart units (the component multiplies by 96/72). */
    width: number;
    /** Chart height in office-chart units. */
    height: number;
    chartTitle: string;
    chartCategory: OfficeChartCategory[];
    chartSeries: OfficeChartSeries[];
    chartLegend: { position: string | null };
    chartPrimaryCategoryAxis: OfficeChartAxis;
    chartPrimaryValueAxis: OfficeChartAxis;
    chartArea: OfficeChartFill;
    plotArea: OfficeChartFill;
}

/**
 * Resolved text formatting applied to the ej2-charts instance (CSS values, 1px = 1 slide point).
 *
 * @internal
 */
export interface ChartTextHint {
    size?: string;
    fontFamily?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    /** Text rotation in degrees (`a:bodyPr/@rot`). */
    rotation?: number;
    /** `a:defRPr/@cap="all"`: draw upper-case. */
    upperCase?: boolean;
}

/**
 * Resolved frame/text styling that ej2-office-chart's JSON cannot carry.
 *
 * @internal
 */
export interface ChartStyleHints {
    background?: string;
    plotBackground?: string;
    title: ChartTextHint;
    legend: ChartTextHint;
    categoryLabels: ChartTextHint;
    valueLabels: ChartTextHint;
    categoryTitle: ChartTextHint;
    valueTitle: ChartTextHint;
    dataLabels: ChartTextHint;
    gridlineColor?: string;
    /** Whether the category axis draws major gridlines (`c:catAx/c:majorGridlines`). */
    categoryGridlines: boolean;
    /** Whether the value axis draws major gridlines (`c:valAx/c:majorGridlines`). */
    valueGridlines: boolean;
    /** Whether the value axis draws minor gridlines. */
    valueMinorGridlines: boolean;
    /** `c:overlap` is 100: bars of a cluster are drawn on top of each other. */
    fullOverlap: boolean;
    /** ej2-charts `columnWidth` (0..1) derived from `c:gapWidth` / `c:overlap`; bar plots only. */
    columnWidth?: number;
    /** ej2-charts `columnSpacing` (0..1) derived from a negative `c:overlap`; bar plots only. */
    columnSpacing?: number;
    /** Category-axis gridline colour (CSS, may be `rgba`). */
    categoryGridlineColor?: string;
    /** Chart-area outline (`c:chartSpace/c:spPr/a:ln`), when authored with a visible fill. */
    chartBorder?: { color: string; width: number };
    /** Per-series fill/outline overrides for the first plot (index = series order). */
    seriesStyles: ChartSeriesStyle[];
    /** Pie/doughnut: per-slice paint overrides (index = point index). */
    pieSlices: ChartSliceStyle[];
    /** Pie/doughnut: data-label position (`Inside` | `Outside`). */
    pieLabelPosition?: string;
    /** Data-label box (`c:dLbls/c:spPr`) fill, CSS. */
    labelBoxFill?: string;
    /** Per-series line appearance for the first plot when it is a line plot. */
    lineStyles: ChartLineStyle[];
    categoryLineColor?: string;
    valueLineColor?: string;
    /** Axis line drawn (authored visible, or PowerPoint's default for the category axis). The value axis has none by default. */
    categoryLineVisible: boolean;
    valueLineVisible: boolean;
    /** Resolved per-series colours (index = series order), used for series without a native mapping. */
    seriesColors: string[];
    /** Maps office-chart series index to authored pie/doughnut hole size percent. */
    holeSizePercent?: number;
    /** Pie/doughnut first slice angle in degrees. */
    firstSliceAngle?: number;
    /** Category axis scaling/visibility. */
    categoryAxis: ChartAxisHint;
    /** Primary value axis scaling/visibility. */
    valueAxis: ChartAxisHint;
    /** Secondary value axis used by plots bound to a different axis pair. */
    secondaryValueAxis?: ChartAxisHint & { labels: ChartTextHint; lineColor?: string };
    /** Series of the 2nd..nth plots of a combination chart (drawn as extra ej2-charts series). */
    extraSeries: ChartExtraSeries[];
    /** Per-series, per-point colour overrides (non pie), keyed by series index then point index. */
    pointColors: { [seriesIndex: number]: { [pointIndex: number]: string } };
    /** Per-series data label content (index = series order of the first plot). */
    labelSpecs: Array<ChartLabelSpec | undefined>;
    /** Present when the first plot is a radar chart. */
    radar?: { filled: boolean };
}

/**
 * Line-series appearance the office-chart JSON cannot express.
 *
 * @internal
 */
export interface ChartLineStyle {
    /** Stroke width in CSS px (`a:ln/@w`). */
    width?: number;
    /** SVG dash array for `a:prstDash`. */
    dashArray?: string;
    /** `c:smooth`. */
    smooth: boolean;
    /** ej2-charts marker, `undefined` = chart default. `visible: false` for `c:symbol="none"`. */
    marker?: { visible: boolean; shape?: string; size?: number; fill?: string; border?: string };
    /** ej2-charts data label position for line series. */
    labelPosition?: string;
}

/**
 * Series paint that the office-chart JSON cannot express (no fill, outline, transparency).
 *
 * @internal
 */
export interface ChartSeriesStyle {
    /** `'transparent'` for `a:noFill`; otherwise the authored fill. */
    fill?: string;
    /** Fill opacity 0..1 (`a:alpha`). */
    opacity?: number;
    /** Authored visible outline. */
    border?: { color: string; width: number };
    /** Preset pattern fill (`a:pattFill`), drawn as an SVG `<pattern>` after render. */
    pattern?: ChartPatternSpec;
}

/**
 * Axis scaling the office-chart JSON cannot express.
 *
 * @internal
 */
export interface ChartAxisHint {
    min?: number;
    max?: number;
    majorUnit?: number;
    logBase?: number;
    reversed: boolean;
    deleted: boolean;
    /** Tick labels and axis line are both hidden (`c:tickLblPos="none"` with no line). */
    hidden?: boolean;
}

/**
 * One series of a secondary plot in a combination chart.
 *
 * @internal
 */
export interface ChartExtraSeries {
    /** ej2-charts series type (`Column`, `StackingColumn`, `Line`, `Area`, `Scatter`, ...). */
    type: string;
    name: string;
    color: string;
    points: Array<{ x: string; y: number | null }>;
    secondary: boolean;
    markers: boolean;
    smooth: boolean;
}

/**
 * What a series' data labels show.
 *
 * @internal
 */
export interface ChartLabelSpec {
    value: boolean;
    category: boolean;
    series: boolean;
    percent: boolean;
    /** `c:separator`; `undefined` = ", ". */
    separator?: string;
    /** Decimal places for percentages (`c:numFmt` such as `0%` or `0.0%`; default 0 like PowerPoint). */
    percentDecimals: number;
}

/**
 * Paint of one pie/doughnut slice that the office-chart JSON cannot carry.
 *
 * @internal
 */
export interface ChartSliceStyle {
    pattern?: ChartPatternSpec;
    gradient?: ChartGradientSpec;
    /** `'none'` removes the outline; otherwise the authored outline. */
    border?: { color: string; width: number } | 'none';
    /** Fill opacity 0..1. */
    opacity?: number;
}

/**
 * Result of mapping one chart.
 *
 * @internal
 */
export interface ChartMappingResult {
    readonly json: OfficeChartJson;
    readonly hints: ChartStyleHints;
    /** Chart features that could not be represented; the chart still renders. */
    readonly unsupported: ReadonlyArray<string>;
}

/**
 * Slide-space size of the chart frame in points.
 *
 * @internal
 */
export interface ChartFrameSize { readonly widthPt: number; readonly heightPt: number }

const PX_PER_PT_INVERSE: number = 72 / 96;
const PX_PER_PT: number = 96 / 72;
const DEFAULT_TEXT_COLOR: string = '#595959';
const DEFAULT_TEXT_SIZE_PT: number = 10;
const ACCENTS: ReadonlyArray<string> = ['accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6'];
const LABEL_POSITIONS: { [key: string]: string } = {
    ctr: 'Center', outEnd: 'Outside', inEnd: 'Inside', inBase: 'OutsideBase', t: 'Inside', b: 'OutsideBase',
    bestFit: 'BestFit', l: 'Center', r: 'Center'
};
const LEGEND_POSITIONS: { [key: string]: string } = { r: 'right', l: 'left', t: 'top', b: 'bottom', tr: 'Corner' };
const TRENDLINE_TYPES: { [key: string]: string } = {
    linear: 'Linear', exp: 'Exponential', log: 'Logarithmic', poly: 'Polynomial', power: 'Power', movingAvg: 'MovingAverage'
};
const ERROR_BAR_TYPES: { [key: string]: string } = {
    fixedVal: 'Fixed', percentage: 'Percentage', stdDev: 'StandardDeviation', stdErr: 'StandardError', cust: 'Custom'
};
const ERROR_BAR_DIRECTIONS: { [key: string]: string } = { both: 'Both', plus: 'Plus', minus: 'Minus' };

/**
 * Selects the ej2-office-chart type for a plot, or `undefined` when office-chart has no equivalent.
 * @param {ChartPlotModel} plot - first plot of the chart.
 * @returns {OfficeChartType | undefined} Office chart type.
 *
 * @internal
 */
export function officeChartTypeFor(plot: ChartPlotModel): OfficeChartType | undefined {
    const stacked: boolean = plot.grouping === 'stacked';
    const percent: boolean = plot.grouping === 'percentStacked';
    switch (plot.kind) {
    case 'bar': {
        const base: string = plot.barDirection === 'bar' ? 'Bar' : 'Column';
        return (base + (percent ? '_Stacked_100' : stacked ? '_Stacked' : '_Clustered')) as OfficeChartType;
    }
    case 'line': {
        const marked: boolean = plot.markers || plot.series.some((series: ChartSeriesModel): boolean =>
            series.marker !== undefined && series.marker.symbol !== 'none');
        const base: string = marked ? 'Line_Markers' : 'Line';
        return (base + (percent ? '_Stacked_100' : stacked ? '_Stacked' : '')) as OfficeChartType;
    }
    case 'area': return percent ? 'Area_Stacked_100' : stacked ? 'Area_Stacked' : 'Area';
    case 'pie': return 'Pie';
    case 'doughnut': return 'Doughnut';
    case 'scatter': return 'Scatter_Markers';
    case 'bubble': return 'Bubble';
    case 'radar': return RADAR_BASE;
    case 'ofPie': return 'Pie';
    default: return undefined;
    }
}

/**
 * Maps a parsed chart part to the ej2-office-chart data source plus style hints.
 * @param {ChartRenderModel} model - Parsed chart render model.
 * @param {ChartFrameSize} size - Frame size in slide points.
 * @param {SlideFrameThemeSnapshot} theme - Slide theme used to resolve scheme colours.
 * @returns {ChartMappingResult | undefined} Mapping, or `undefined` when no plot family can be represented.
 *
 * @internal
 */
export function mapChartToOfficeChart(
    model: ChartRenderModel,
    size: ChartFrameSize,
    theme?: SlideFrameThemeSnapshot
): ChartMappingResult | undefined {
    const plot: ChartPlotModel | undefined = model.plots[0];
    const type: OfficeChartType | undefined = plot ? officeChartTypeFor(plot) : undefined;
    if (!plot || !type || plot.series.length === 0) {
        return undefined;
    }
    const unsupported: string[] = model.unsupported.slice();
    collectUnsupported(model, plot, unsupported);
    const context: MapContext = { theme, plot, type, unsupported, textDefault: model.textStyle };
    const seriesColors: string[] = plot.series.map((series: ChartSeriesModel, index: number): string =>
        seriesColorOf(series, index, plot, context));
    const json: OfficeChartJson = {
        chartType: type,
        width: size.widthPt * PX_PER_PT_INVERSE,
        height: size.heightPt * PX_PER_PT_INVERSE,
        chartTitle: model.title ? (model.title.auto ? autoTitle(plot) : model.title.text) : '',
        chartCategory: buildCategories(plot, model.categoryAxis),
        chartSeries: plot.series.map((series: ChartSeriesModel, index: number): OfficeChartSeries =>
            buildSeries(series, index, seriesColors[index], context)),
        chartLegend: { position: model.legend ? LEGEND_POSITIONS[model.legend.position] || 'right' : null },
        chartPrimaryCategoryAxis: buildAxis(model.categoryAxis, plot),
        chartPrimaryValueAxis: buildAxis(model.valueAxis, plot),
        chartArea: fillToOffice(model.chartArea, theme),
        plotArea: fillToOffice(model.plotArea, theme)
    };
    return { json, hints: buildHints(model, plot, seriesColors, context), unsupported };
}

interface MapContext {
    readonly theme: SlideFrameThemeSnapshot | undefined;
    readonly plot: ChartPlotModel;
    readonly type: OfficeChartType;
    readonly unsupported: string[];
    readonly textDefault: ChartTextStyle;
}

function collectUnsupported(model: ChartRenderModel, plot: ChartPlotModel, out: string[]): void {
    const note: (text: string) => void = (text: string): void => {
        if (out.indexOf(text) < 0) {
            out.push(text);
        }
    };
    if (model.plots.some((other: ChartPlotModel): boolean => other.is3D)) {
        note('3-D chart rendered as 2-D');
    }
    if (plot.kind === 'ofPie') {
        note('of-pie chart rendered as a single pie');
    }
    model.plots.slice(1).forEach((other: ChartPlotModel): void => {
        if (!extraSeriesType(other, plot)) {
            note('plot type ' + other.kind + ' in a combination chart is not drawn');
        }
    });
}

function buildCategories(plot: ChartPlotModel, axis: ChartAxisModel | undefined): OfficeChartCategory[] {
    const first: ChartSeriesModel = plot.series[0];
    const scatter: boolean = plot.kind === 'scatter' || plot.kind === 'bubble';
    let count: number = 0;
    plot.series.forEach((series: ChartSeriesModel): void => {
        count = Math.max(count, series.values.length, scatter ? series.xValues.length : series.categories.length);
    });
    const dateAxis: boolean = axis !== undefined && axis.kind === 'dateAx';
    const categories: OfficeChartCategory[] = [];
    for (let i: number = 0; i < count; i++) {
        categories.push({
            categoryXName: categoryLabel(first, i, scatter, dateAxis),
            chartData: plot.series.map((series: ChartSeriesModel): { yValue: number | null; size?: number | null } => {
                const point: { yValue: number | null; size?: number | null } = { yValue: valueAt(series.values, i) };
                if (plot.kind === 'bubble') {
                    point.size = valueAt(series.bubbleSizes, i);
                }
                return point;
            })
        });
    }
    return categories;
}

function valueAt(values: ReadonlyArray<number | null>, index: number): number | null {
    const value: number | null | undefined = values[index];
    return value === undefined ? null : value;
}

function categoryLabel(series: ChartSeriesModel, index: number, scatter: boolean, dateAxis: boolean): string {
    if (scatter) {
        const x: number | null | undefined = series.xValues[index];
        return x === null || x === undefined ? String(index + 1) : String(x);
    }
    if (dateAxis) {
        const serial: number | null | undefined = series.categoryNumbers[index];
        if (serial !== null && serial !== undefined) {
            return excelSerialToDate(serial);
        }
    }
    const label: string | undefined = series.categories[index];
    return label === undefined || label === '' ? String(index + 1) : label;
}

/**
 * Converts an Excel 1900-system serial to the `m/d/yyyy` text ej2-office-chart date axes parse.
 * @param {number} serial - Excel serial day number.
 * @returns {string} Date text.
 *
 * @internal
 */
export function excelSerialToDate(serial: number): string {
    const date: Date = new Date(Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000);
    return (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear();
}

function buildSeries(series: ChartSeriesModel, index: number, color: string, context: MapContext): OfficeChartSeries {
    const pie: boolean = context.type === 'Pie' || context.type === 'Doughnut';
    const lineType: boolean = context.plot.kind === 'line';
    const line: string = lineType ? lineColorOf(series, color, context) : color;
    const out: OfficeChartSeries = {
        seriesName: series.name === undefined ? 'Series' + (index + 1) : series.name,
        seriesFormat: { fill: { foreColor: color, rgb: color } },
        dataPoints: pie ? pieDataPoints(series, context) : [{
            id: 0,
            fill: { foreColor: color, rgb: color },
            line: { color: line, rgb: line }
        }]
    };
    const labels: ChartDataLabelsModel | undefined = series.dataLabels;
    if (labels && (labels.showValue || labels.showPercent || labels.showCategoryName || labels.showSeriesName)) {
        out.dataLabel = { position: LABEL_POSITIONS[labels.position || ''] || (pie ? 'BestFit' : 'Outside') };
    }
    const bar: ChartErrorBarsModel | undefined = series.errorBars[0];
    if (bar && !pie) {
        out.errorBar = {
            type: ERROR_BAR_TYPES[bar.valueType] || 'Fixed',
            direction: ERROR_BAR_DIRECTIONS[bar.direction] || 'Both',
            endStyle: bar.noEndCap ? 'NoCap' : 'Cap'
        };
    }
    if (series.trendlines.length > 0 && !pie) {
        out.trendLines = series.trendlines.map((trend: ChartTrendlineModel): NonNullable<OfficeChartSeries['trendLines']>[0] => ({
            type: TRENDLINE_TYPES[trend.type] || 'Linear',
            name: trend.name || '',
            forward: trend.forward || 0,
            backward: trend.backward || 0,
            intercept: trend.intercept === undefined ? 'NaN' : trend.intercept
        }));
    }
    return out;
}

function pieDataPoints(series: ChartSeriesModel, context: MapContext): OfficeChartDataPoint[] {
    const points: OfficeChartDataPoint[] = [];
    for (let i: number = 0; i < series.values.length; i++) {
        const override: ChartSeriesModel['points'][0] | undefined = series.points.filter(
            (point: { readonly index: number }): boolean => point.index === i)[0];
        const authored: string | undefined = override ? hexOf(fillOf(override.format), context.theme) : undefined;
        const color: string = authored || paletteColor(i, context);
        points.push({ id: i, fill: { foreColor: color, rgb: color }, line: { color: '#FFFFFF', rgb: '#FFFFFF' } });
    }
    return points;
}

function seriesColorOf(series: ChartSeriesModel, index: number, plot: ChartPlotModel, context: MapContext): string {
    const fill: string | undefined = hexOf(fillOf(series.format), context.theme);
    if (fill) {
        return fill;
    }
    if (plot.kind === 'line') {
        const stroke: string | undefined = hexOf(series.format.line ? series.format.line.fill : undefined, context.theme);
        if (stroke) {
            return stroke;
        }
    }
    return paletteColor(index, context);
}

function lineColorOf(series: ChartSeriesModel, fallback: string, context: MapContext): string {
    return hexOf(series.format.line ? series.format.line.fill : undefined, context.theme) || fallback;
}

/**
 * Automatic colour for the n-th series/point: accent1..6, then darker and lighter cycles (PowerPoint style).
 * @param {number} index - zero-based series or point index.
 * @param {{ theme: SlideFrameThemeSnapshot | undefined }} context - mapping context.
 * @param {SlideFrameThemeSnapshot} context.theme - slide theme.
 * @returns {string} `#RRGGBB`.
 */
function paletteColor(index: number, context: { theme: SlideFrameThemeSnapshot | undefined }): string {
    const lap: number = Math.floor(index / ACCENTS.length);
    const transforms: Array<{ kind: string; value: number }> = lap === 0 ? [] : lap % 2 === 1
        ? [{ kind: 'lumMod', value: 60000 }] : [{ kind: 'lumMod', value: 60000 }, { kind: 'lumOff', value: 40000 }];
    return resolveRenderColor({ kind: 'scheme', val: ACCENTS[index % ACCENTS.length] }, transforms, context.theme).color;
}

function fillOf(format: ChartShapeFormat): ChartFill | undefined {
    return format.fill;
}

function hexOf(fill: ChartFill | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    if (!fill || (fill.kind !== 'solid' && fill.kind !== 'gradient')) {
        return undefined;
    }
    return colorHex(fill.color, theme);
}

function colorHex(color: ChartColor | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    if (!color) {
        return undefined;
    }
    const resolved: RenderColor = resolveRenderColor(color.color, color.transforms, theme);
    return resolved.color;
}

function fillToOffice(format: ChartShapeFormat, theme: SlideFrameThemeSnapshot | undefined): OfficeChartFill {
    const hex: string | undefined = hexOf(format.fill, theme);
    return hex ? { foreColor: hex, rgb: hex } : {};
}

function buildAxis(axis: ChartAxisModel | undefined, plot: ChartPlotModel): OfficeChartAxis {
    const out: OfficeChartAxis = {
        minimumValue: 0, maximumValue: 0, majorUnit: 0, hasMajorGridLines: false, hasMinorGridLines: false
    };
    if (!axis) {
        return out;
    }
    if (axis.title) {
        out.chartTitle = axis.title.text;
    }
    if (axis.kind === 'dateAx') {
        out.categoryType = 'Time';
        out.numberFormat = 'm/d/yyyy';
    } else if (axis.kind === 'catAx') {
        out.categoryType = 'Automatic';
    }
    out.minimumValue = axis.min === undefined ? 0 : axis.min;
    out.maximumValue = axis.max === undefined ? 0 : axis.max;
    out.majorUnit = axis.majorUnit === undefined ? 0 : axis.majorUnit;
    out.hasMajorGridLines = axis.majorGridlines;
    out.hasMinorGridLines = axis.minorGridlines;
    if (plot.kind === 'scatter' || plot.kind === 'bubble') {
        out.categoryType = undefined;
    }
    return out;
}

function toHint(style: ChartTextStyle, fallback: ChartTextStyle, theme: SlideFrameThemeSnapshot | undefined,
                defaultSizePt: number): ChartTextHint {
    const size: number = style.sizePt !== undefined ? style.sizePt
        : fallback.sizePt !== undefined ? fallback.sizePt : defaultSizePt;
    const color: string = colorHex(style.color, theme) || colorHex(fallback.color, theme) || DEFAULT_TEXT_COLOR;
    const hint: ChartTextHint = { size: size + 'px', color };
    const family: string | undefined = resolveFont(style.fontFamily || fallback.fontFamily, theme);
    if (family) {
        hint.fontFamily = family;
    }
    const bold: boolean | undefined = style.bold !== undefined ? style.bold : fallback.bold;
    const italic: boolean | undefined = style.italic !== undefined ? style.italic : fallback.italic;
    const rotation: number | undefined = style.rotationDeg !== undefined ? style.rotationDeg : fallback.rotationDeg;
    if (rotation !== undefined) {
        hint.rotation = rotation;
    }
    if ((style.caps !== undefined ? style.caps : fallback.caps) === 'all') {
        hint.upperCase = true;
    }
    hint.fontWeight = bold ? 'bold' : 'normal';
    hint.fontStyle = italic ? 'italic' : 'normal';
    return hint;
}

function resolveFont(family: string | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    if (!family) {
        return undefined;
    }
    if (family.charAt(0) !== '+') {
        return family;
    }
    const fonts: SlideFrameThemeSnapshot['fonts'] = theme ? theme.fonts : undefined;
    const slot: { readonly latin: string } | undefined = fonts ? (family.indexOf('mj') > 0 ? fonts.major : fonts.minor) : undefined;
    return slot && slot.latin ? slot.latin : undefined;
}

function lineHex(line: ChartLine | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    return line ? hexOf(line.fill, theme) : undefined;
}

function buildHints(model: ChartRenderModel, plot: ChartPlotModel, seriesColors: string[], context: MapContext): ChartStyleHints {
    const base: ChartTextStyle = model.textStyle;
    const theme: SlideFrameThemeSnapshot | undefined = context.theme;
    const empty: ChartTextStyle = {};
    const categoryAxis: ChartAxisModel | undefined = model.categoryAxis;
    const valueAxis: ChartAxisModel | undefined = model.valueAxis;
    const firstLabels: ChartDataLabelsModel | undefined = plot.series.map(
        (series: ChartSeriesModel): ChartDataLabelsModel | undefined => series.dataLabels).filter(Boolean)[0];
    return {
        background: hexOf(model.chartArea.fill, theme),
        plotBackground: hexOf(model.plotArea.fill, theme),
        title: toHint(model.title ? model.title.style : empty, base, theme, 14),
        legend: toHint(model.legend ? model.legend.style : empty, base, theme, DEFAULT_TEXT_SIZE_PT),
        categoryLabels: toHint(categoryAxis ? categoryAxis.labelStyle : empty, base, theme, DEFAULT_TEXT_SIZE_PT),
        valueLabels: toHint(valueAxis ? valueAxis.labelStyle : empty, base, theme, DEFAULT_TEXT_SIZE_PT),
        categoryTitle: toHint(categoryAxis && categoryAxis.title ? categoryAxis.title.style : empty, base, theme, DEFAULT_TEXT_SIZE_PT),
        valueTitle: toHint(valueAxis && valueAxis.title ? valueAxis.title.style : empty, base, theme, DEFAULT_TEXT_SIZE_PT),
        dataLabels: toHint(firstLabels ? firstLabels.style : empty, base, theme, DEFAULT_TEXT_SIZE_PT),
        gridlineColor: lineCss(valueAxis ? valueAxis.majorGridlineFormat : undefined, theme),
        categoryGridlineColor: lineCss(categoryAxis ? categoryAxis.majorGridlineFormat : undefined, theme),
        chartBorder: borderOf(model.chartArea.line, theme),
        pieSlices: plot.kind === 'pie' || plot.kind === 'doughnut' ? pieSliceStyles(plot, theme) : [],
        pieLabelPosition: pieLabelPositionOf(firstLabels),
        labelBoxFill: firstLabels && firstLabels.format ? cssOf(firstLabels.format.fill, theme) : undefined,
        lineStyles: plot.kind === 'line' ? plot.series.map((series: ChartSeriesModel, index: number): ChartLineStyle =>
            lineStyleOf(series, index, seriesColors[index], plot, theme)) : [],
        seriesStyles: plot.series.map((series: ChartSeriesModel): ChartSeriesStyle => seriesStyleOf(series, theme)),
        categoryGridlines: categoryAxis ? categoryAxis.majorGridlines : false,
        valueGridlines: valueAxis ? valueAxis.majorGridlines : false,
        valueMinorGridlines: valueAxis ? valueAxis.minorGridlines : false,
        fullOverlap: plot.kind === 'bar' && plot.overlap === 100 && plot.grouping === 'clustered',
        ...barSpacing(plot),
        categoryLineColor: lineHex(categoryAxis ? categoryAxis.line : undefined, theme),
        valueLineColor: lineHex(valueAxis ? valueAxis.line : undefined, theme),
        categoryLineVisible: !categoryAxis || !categoryAxis.line || categoryAxis.line.fill.kind !== 'none',
        valueLineVisible: !!valueAxis && !!valueAxis.line && valueAxis.line.fill.kind !== 'none',
        seriesColors,
        holeSizePercent: plot.holeSize,
        firstSliceAngle: plot.firstSliceAngle,
        categoryAxis: axisHint(categoryAxis),
        valueAxis: axisHint(valueAxis),
        secondaryValueAxis: secondaryAxisHint(model, plot, theme),
        extraSeries: buildExtraSeries(model, plot, seriesColors.length, context),
        pointColors: buildPointColors(plot, context),
        labelSpecs: plot.series.map(labelSpecOf),
        radar: plot.kind === 'radar' ? { filled: plot.radarStyle === 'filled' } : undefined
    };
}

/**
 * Converts `c:gapWidth` (default 150) and `c:overlap` (default 0) to ej2-charts column width/spacing.
 * ej2-charts splits the cluster into equal slots per series, so only overlap <= 0 is representable
 * (positive overlap is approximated as touching bars); stacked/percent-stacked series share one slot.
 */
function cssOf(fill: ChartFill | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    if (!fill || (fill.kind !== 'solid' && fill.kind !== 'gradient')) {
        return undefined;
    }
    const resolved: RenderColor = resolveRenderColor(fill.color.color, fill.color.transforms, theme);
    if (resolved.opacity >= 1) {
        return resolved.color;
    }
    const n: number = parseInt(resolved.color.substring(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + resolved.opacity + ')';
}

function lineCss(line: ChartLine | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    return line ? cssOf(line.fill, theme) : undefined;
}

function borderOf(line: ChartLine | undefined, theme: SlideFrameThemeSnapshot | undefined): { color: string; width: number } | undefined {
    const color: string | undefined = lineCss(line, theme);
    return line && color ? { color, width: Math.max(1, (line.widthPt === undefined ? 0.75 : line.widthPt) * PX_PER_PT) } : undefined;
}

function seriesStyleOf(series: ChartSeriesModel, theme: SlideFrameThemeSnapshot | undefined): ChartSeriesStyle {
    const style: ChartSeriesStyle = {};
    const fill: ChartFill | undefined = series.format.fill;
    if (fill && fill.kind === 'none') {
        style.fill = 'transparent';
    } else if (fill && fill.kind === 'pattern') {
        const fg: string | undefined = colorHex(fill.foreground, theme);
        const bg: string | undefined = colorHex(fill.background, theme);
        style.pattern = { preset: fill.preset, foreground: fg || '#000000', background: bg || '#FFFFFF' };
    } else if (fill && (fill.kind === 'solid' || fill.kind === 'gradient')) {
        const resolved: RenderColor = resolveRenderColor(fill.color.color, fill.color.transforms, theme);
        if (resolved.opacity < 1) {
            style.opacity = resolved.opacity;
        }
    }
    const border: { color: string; width: number } | undefined = borderOf(series.format.line, theme);
    if (border) {
        style.border = border;
    }
    return style;
}

function autoTitle(plot: ChartPlotModel): string {
    const name: string | undefined = plot.series.length === 1 ? plot.series[0].name : undefined;
    return name || 'Chart Title';
}

const MARKER_SHAPES: { [symbol: string]: string } = {
    circle: 'Circle', dot: 'Circle', square: 'Rectangle', diamond: 'Diamond', triangle: 'Triangle', x: 'Cross',
    plus: 'Plus', star: 'Star', dash: 'HorizontalLine'
};
const AUTO_MARKERS: string[] = ['Diamond', 'Rectangle', 'Triangle', 'Cross', 'Circle', 'Plus'];
const DASH_ARRAYS: { [dash: string]: string } = {
    dash: '6,3', sysDash: '3,1', sysDot: '1,1', dot: '1,3', lgDash: '10,3', dashDot: '6,3,1,3', lgDashDot: '10,3,1,3',
    lgDashDotDot: '10,3,1,3,1,3', sysDashDot: '3,1,1,1', sysDashDotDot: '3,1,1,1,1,1'
};
const LINE_LABEL_POSITIONS: { [key: string]: string } = { t: 'Top', b: 'Bottom', ctr: 'Middle', l: 'Top', r: 'Top' };

function lineStyleOf(series: ChartSeriesModel, index: number, color: string, plot: ChartPlotModel,
                     theme: SlideFrameThemeSnapshot | undefined): ChartLineStyle {
    const line: ChartLine | undefined = series.format.line;
    const style: ChartLineStyle = { smooth: series.smooth };
    if (line && line.widthPt !== undefined) {
        style.width = line.widthPt * PX_PER_PT;
    }
    if (line && line.dash && DASH_ARRAYS[line.dash]) {
        style.dashArray = DASH_ARRAYS[line.dash];
    }
    const marker: ChartSeriesModel['marker'] = series.marker;
    if (marker && marker.symbol === 'none') {
        style.marker = { visible: false };
    } else if (marker || plot.markers) {
        const symbol: string = marker ? marker.symbol : 'auto';
        const fill: string | undefined = marker ? hexOf(marker.format.fill, theme) : undefined;
        const border: string | undefined = marker ? lineHex(marker.format.line, theme) : undefined;
        style.marker = {
            visible: true,
            shape: MARKER_SHAPES[symbol] || AUTO_MARKERS[index % AUTO_MARKERS.length],
            size: marker && marker.size !== undefined ? marker.size * PX_PER_PT : 7,
            fill: fill || color,
            border: border || fill || color
        };
    }
    const labels: ChartDataLabelsModel | undefined = series.dataLabels;
    if (labels) {
        style.labelPosition = LINE_LABEL_POSITIONS[labels.position || ''] || 'Top';
    }
    return style;
}

function percentDecimalsOf(format: string | undefined): number {
    const match: RegExpMatchArray | null = format ? format.match(/0\.(0+)%/) : null;
    return match ? match[1].length : 0;
}

function pieLabelPositionOf(labels: ChartDataLabelsModel | undefined): string | undefined {
    const position: string | undefined = labels ? labels.position : undefined;
    if (position === 'ctr' || position === 'inEnd') {
        return 'Inside';
    }
    return position === 'outEnd' || position === 'bestFit' ? 'Outside' : undefined;
}

function gradientOf(fill: ChartFill, theme: SlideFrameThemeSnapshot | undefined): ChartGradientSpec | undefined {
    if (fill.kind !== 'gradient' || !fill.stops) {
        return undefined;
    }
    const stops: Array<{ position: number; color: string }> = [];
    fill.stops.forEach((stop: { position: number; color: ChartColor }): void => {
        const css: string | undefined = cssOf({ kind: 'solid', color: stop.color }, theme);
        if (css) {
            stops.push({ position: stop.position, color: css });
        }
    });
    return stops.length > 1 ? { stops, angleDeg: fill.angleDeg === undefined ? 0 : fill.angleDeg, radial: fill.path !== undefined } : undefined;
}

function sliceStyleOf(format: ChartShapeFormat, fallback: ChartShapeFormat, theme: SlideFrameThemeSnapshot | undefined): ChartSliceStyle {
    const out: ChartSliceStyle = {};
    const fill: ChartFill | undefined = format.fill || fallback.fill;
    if (fill && fill.kind === 'pattern') {
        out.pattern = {
            preset: fill.preset, foreground: colorHex(fill.foreground, theme) || '#000000',
            background: colorHex(fill.background, theme) || '#FFFFFF'
        };
    } else if (fill) {
        const gradient: ChartGradientSpec | undefined = gradientOf(fill, theme);
        if (gradient) {
            out.gradient = gradient;
        }
        if (fill.kind === 'solid') {
            const resolved: RenderColor = resolveRenderColor(fill.color.color, fill.color.transforms, theme);
            if (resolved.opacity < 1) {
                out.opacity = resolved.opacity;
            }
        }
    }
    const line: ChartLine | undefined = format.line || fallback.line;
    if (line) {
        out.border = line.fill.kind === 'none' ? 'none' : borderOf(line, theme);
    }
    return out;
}

function pieSliceStyles(plot: ChartPlotModel, theme: SlideFrameThemeSnapshot | undefined): ChartSliceStyle[] {
    const series: ChartSeriesModel = plot.series[0];
    return series.values.map((_value: number | null, index: number): ChartSliceStyle => {
        const override: ChartSeriesModel['points'][0] | undefined = series.points.filter(
            (point: { readonly index: number }): boolean => point.index === index)[0];
        return sliceStyleOf(override ? override.format : {}, series.format, theme);
    });
}

function barSpacing(plot: ChartPlotModel): { columnWidth?: number; columnSpacing?: number } {
    if (plot.kind !== 'bar') {
        return {};
    }
    const gap: number = (plot.gapWidth === undefined ? 150 : plot.gapWidth) / 100;
    const stacked: boolean = plot.grouping === 'stacked' || plot.grouping === 'percentStacked';
    const overlap: number = stacked ? 0 : Math.min(0, (plot.overlap === undefined ? 0 : plot.overlap) / 100);
    const count: number = stacked || plot.overlap === 100 ? 1 : Math.max(1, plot.series.length);
    const cluster: number = count * (1 - overlap);
    return { columnWidth: cluster / (cluster + gap), columnSpacing: 1 - 1 / (1 - overlap) };
}

function axisHint(axis: ChartAxisModel | undefined): ChartAxisHint {
    return {
        min: axis ? axis.min : undefined,
        max: axis ? axis.max : undefined,
        majorUnit: axis ? axis.majorUnit : undefined,
        logBase: axis ? axis.logBase : undefined,
        reversed: axis ? axis.reversed : false,
        deleted: axis ? axis.deleted : false,
        hidden: axis ? axis.tickLabelPosition === 'none' && !!axis.line && axis.line.fill.kind === 'none' : false
    };
}

function secondaryAxisHint(model: ChartRenderModel, plot: ChartPlotModel,
                           theme: SlideFrameThemeSnapshot | undefined): ChartStyleHints['secondaryValueAxis'] {
    const other: ChartPlotModel | undefined = model.plots.filter((candidate: ChartPlotModel): boolean =>
        candidate !== plot && candidate.axisIds.join() !== plot.axisIds.join())[0];
    const axis: ChartAxisModel | undefined = other
        ? model.axes.filter((candidate: ChartAxisModel): boolean => candidate.id === other.axisIds[1])[0] : undefined;
    if (!axis) {
        return undefined;
    }
    return {
        ...axisHint(axis),
        labels: toHint(axis.labelStyle, model.textStyle, theme, DEFAULT_TEXT_SIZE_PT),
        lineColor: lineHex(axis.line, theme)
    };
}

function labelSpecOf(series: ChartSeriesModel): ChartLabelSpec | undefined {
    const labels: ChartDataLabelsModel | undefined = series.dataLabels;
    return labels ? {
        value: labels.showValue, category: labels.showCategoryName, series: labels.showSeriesName, percent: labels.showPercent,
        separator: labels.separator, percentDecimals: percentDecimalsOf(labels.numberFormat)
    } : undefined;
}

function buildPointColors(plot: ChartPlotModel, context: MapContext): ChartStyleHints['pointColors'] {
    const out: ChartStyleHints['pointColors'] = {};
    if (plot.kind === 'pie' || plot.kind === 'doughnut' || plot.kind === 'ofPie') {
        return out;
    }
    plot.series.forEach((series: ChartSeriesModel, index: number): void => {
        series.points.forEach((point: ChartSeriesModel['points'][0]): void => {
            const hex: string | undefined = hexOf(fillOf(point.format), context.theme) ||
                (plot.kind === 'line' ? hexOf(point.format.line ? point.format.line.fill : undefined, context.theme) : undefined);
            if (hex) {
                out[index] = out[index] || {};
                out[index][point.index] = hex;
            }
        });
    });
    return out;
}

/**
 * ej2-charts series type for a secondary plot of a combination chart, or `undefined` when it cannot be drawn.
 * @param {ChartPlotModel} plot - plot after the first.
 * @param {ChartPlotModel} first - first plot.
 * @returns {string | undefined} Series type.
 *
 * @internal
 */
export function extraSeriesType(plot: ChartPlotModel, first: ChartPlotModel): string | undefined {
    const stacked: boolean = plot.grouping === 'stacked';
    const percent: boolean = plot.grouping === 'percentStacked';
    const horizontal: boolean = first.kind === 'bar' && first.barDirection === 'bar';
    switch (plot.kind) {
    case 'bar':
        if ((plot.barDirection === 'bar') !== horizontal) {
            return undefined;
        }
        return (horizontal ? 'Bar' : 'Column') === 'Bar'
            ? (percent ? 'StackingBar100' : stacked ? 'StackingBar' : 'Bar')
            : (percent ? 'StackingColumn100' : stacked ? 'StackingColumn' : 'Column');
    case 'line': return percent ? 'StackingLine100' : stacked ? 'StackingLine' : 'Line';
    case 'area': return percent ? 'StackingArea100' : stacked ? 'StackingArea' : 'Area';
    case 'scatter': return first.kind === 'scatter' ? 'Scatter' : undefined;
    default: return undefined;
    }
}

function buildExtraSeries(model: ChartRenderModel, first: ChartPlotModel, offset: number,
                          context: MapContext): ChartExtraSeries[] {
    const out: ChartExtraSeries[] = [];
    if (first.kind === 'pie' || first.kind === 'doughnut' || first.kind === 'ofPie' || first.kind === 'bubble' ||
        first.kind === 'radar') {
        return out;
    }
    const scatter: boolean = first.kind === 'scatter';
    const dateAxis: boolean = model.categoryAxis !== undefined && model.categoryAxis.kind === 'dateAx';
    let running: number = offset;
    model.plots.forEach((plot: ChartPlotModel): void => {
        if (plot === first) {
            return;
        }
        const type: string | undefined = extraSeriesType(plot, first);
        const secondary: boolean = plot.axisIds.join() !== first.axisIds.join();
        plot.series.forEach((series: ChartSeriesModel): void => {
            if (!type) {
                return;
            }
            const color: string = seriesColorOf(series, running, plot, context);
            running++;
            const points: ChartExtraSeries['points'] = [];
            const count: number = Math.max(series.values.length, scatter ? series.xValues.length : series.categories.length);
            for (let i: number = 0; i < count; i++) {
                points.push({ x: categoryLabel(series, i, scatter, dateAxis), y: valueAt(series.values, i) });
            }
            out.push({
                type, name: series.name === undefined ? 'Series' + running : series.name, color, points, secondary,
                markers: plot.kind === 'line' ? (plot.markers || (series.marker !== undefined && series.marker.symbol !== 'none')) : false,
                smooth: series.smooth
            });
        });
    });
    return out;
}
