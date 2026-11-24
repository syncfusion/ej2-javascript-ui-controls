/**
 * Public classic chart type enumeration for `shapes.addChart`.
 *
 * @remarks
 * Each member's value is the ej2-xlsx `ChartType` property name used by the
 * internal catalog ({@link CLASSIC_CHART_TYPE_KEYS}), so the engine lookup and
 * generated chart parts are identical to the former string-literal API.
 * ChartEx types (BoxAndWhisker, Funnel, Pareto, Sunburst, TreeMap, Waterfall)
 * are not members and are not authorable.
 *
 * @example
 * ```ts
 * slide.shapes.addChart({ type: OfficeChartType.ColumnClustered });
 * ```
 *
 * @public
 */
export enum OfficeChartType {
    ColumnClustered = 'ColumnClustered',
    ColumnStacked = 'ColumnStacked',
    ColumnPercentStacked = 'ColumnPercentStacked',
    BarClustered = 'BarClustered',
    BarStacked = 'BarStacked',
    BarPercentStacked = 'BarPercentStacked',
    Line = 'Line',
    LineStacked = 'LineStacked',
    LinePercentStacked = 'LinePercentStacked',
    LineMarkers = 'LineMarkers',
    LineStackedMarkers = 'LineStackedMarkers',
    LinePercentStackedMarkers = 'LinePercentStackedMarkers',
    Pie = 'Pie',
    PieExploded = 'PieExploded',
    PieOfPie = 'PieOfPie',
    BarOfPie = 'BarOfPie',
    Doughnut = 'Doughnut',
    DoughnutExploded = 'DoughnutExploded',
    ScatterMarkers = 'ScatterMarkers',
    ScatterLine = 'ScatterLine',
    ScatterLineMarkers = 'ScatterLineMarkers',
    ScatterSmooth = 'ScatterSmooth',
    ScatterSmoothMarkers = 'ScatterSmoothMarkers',
    Bubble = 'Bubble',
    Bubble3D = 'Bubble3D',
    Area = 'Area',
    AreaStacked = 'AreaStacked',
    AreaPercentStacked = 'AreaPercentStacked',
    Column3D = 'Column3D',
    ColumnClustered3D = 'ColumnClustered3D',
    ColumnStacked3D = 'ColumnStacked3D',
    ColumnPercentStacked3D = 'ColumnPercentStacked3D',
    BarClustered3D = 'BarClustered3D',
    BarStacked3D = 'BarStacked3D',
    BarPercentStacked3D = 'BarPercentStacked3D',
    Line3D = 'Line3D',
    Pie3D = 'Pie3D',
    PieExploded3D = 'PieExploded3D',
    Area3D = 'Area3D',
    AreaStacked3D = 'AreaStacked3D',
    AreaPercentStacked3D = 'AreaPercentStacked3D',
    Surface3D = 'Surface3D'
}
