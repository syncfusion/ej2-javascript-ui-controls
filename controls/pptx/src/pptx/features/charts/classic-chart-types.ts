/**
 * Finite classic DrawingML chart type catalog (TASK-1069).
 *
 * @remarks
 * Keys are ej2-xlsx `ChartType` **property names** (PascalCase). Engine values
 * are camelCase strings (e.g. `ColumnClustered` → `columnClustered`). ChartEx
 * types are refused at `addChart` (typed {@link Error}).
 *
 * Primary catalog keys omit deprecated aliases (`Column`, `Bar`, `Scatter`,
 * `Bar3D`). {@link isClassicChartType} still accepts those aliases when they
 * resolve to a classic engine value.
 *
 * Citations: ADR 2026-09-18; spec 037; `@syncfusion/ej2-xlsx` `ChartType`.
 *
 * @packageDocumentation
 */
/**
 * ChartEx engine type strings (xlsx `ChartType` values) — not authorable here.
 *
 * @remarks
 * Keys on xlsx: BoxAndWhisker, Funnel, Pareto, Sunburst, TreeMap, Waterfall.
 */
export const CHART_EX_ENGINE_TYPE_VALUES: ReadonlyArray<string> = Object.freeze([
    'boxWhisker',
    'funnel',
    'paretoLine',
    'sunburst',
    'treemap',
    'waterfall'
]);
/**
 * ChartEx `ChartType` property names (refused by {@link isClassicChartType}).
 */
export const CHART_EX_TYPE_KEYS: ReadonlyArray<string> = Object.freeze([
    'BoxAndWhisker',
    'Funnel',
    'Pareto',
    'Sunburst',
    'TreeMap',
    'Waterfall'
]);
/**
 * Deprecated alias keys on xlsx `ChartType` (map to a primary classic value).
 */
const CLASSIC_ALIAS_KEYS: ReadonlyArray<string> = Object.freeze([
    'Column',
    'Bar',
    'Scatter',
    'Bar3D'
]);
/**
 * Primary classic catalog keys (finite; excludes ChartEx and aliases).
 *
 * @remarks
 * Documented in `docs/ooxml-mapping/chart.md`. Consumers pass these to
 * `addChart({ type })`. Values are resolved via xlsx `ChartType[key]` at runtime.
 *
 * @public
 */
export const CLASSIC_CHART_TYPE_KEYS: ReadonlyArray<string> = Object.freeze([
    'ColumnClustered',
    'ColumnStacked',
    'ColumnPercentStacked',
    'BarClustered',
    'BarStacked',
    'BarPercentStacked',
    'Line',
    'LineStacked',
    'LinePercentStacked',
    'LineMarkers',
    'LineStackedMarkers',
    'LinePercentStackedMarkers',
    'Pie',
    'PieExploded',
    'PieOfPie',
    'BarOfPie',
    'Doughnut',
    'DoughnutExploded',
    'ScatterMarkers',
    'ScatterLine',
    'ScatterLineMarkers',
    'ScatterSmooth',
    'ScatterSmoothMarkers',
    'Bubble',
    'Bubble3D',
    'Area',
    'AreaStacked',
    'AreaPercentStacked',
    'Column3D',
    'ColumnClustered3D',
    'ColumnStacked3D',
    'ColumnPercentStacked3D',
    'BarClustered3D',
    'BarStacked3D',
    'BarPercentStacked3D',
    'Line3D',
    'Pie3D',
    'PieExploded3D',
    'Area3D',
    'AreaStacked3D',
    'AreaPercentStacked3D',
    'Surface3D'
]);
/**
 * One primary classic chart type key.
 *
 * @public
 */
export type ClassicChartTypeKey = (typeof CLASSIC_CHART_TYPE_KEYS)[number];
const PRIMARY_SET: ReadonlySet<string> = new Set(CLASSIC_CHART_TYPE_KEYS);
const CHART_EX_KEY_SET: ReadonlySet<string> = new Set(CHART_EX_TYPE_KEYS);
const ALIAS_SET: ReadonlySet<string> = new Set(CLASSIC_ALIAS_KEYS);
/**
 * Returns whether `key` is a classic (non-ChartEx) xlsx `ChartType` property name.
 *
 * @public
 * @param {string} key - Candidate catalog / enum property name.
 * @returns {*} `true` for primary classic keys and known classic aliases.
 */
export function isClassicChartType(key: string): key is ClassicChartTypeKey | (typeof CLASSIC_ALIAS_KEYS)[number] {
    if (CHART_EX_KEY_SET.has(key)) {
        return false;
    }
    return PRIMARY_SET.has(key) || ALIAS_SET.has(key);
}
/**
 * Returns whether `key` is a refused ChartEx catalog name.
 *
 * @public
 * @param {string} key - Candidate type string.
 * @returns {boolean} `true` when authoring must refuse with typed error.
 */
export function isChartExTypeKey(key: string): boolean {
    return CHART_EX_KEY_SET.has(key);
}
