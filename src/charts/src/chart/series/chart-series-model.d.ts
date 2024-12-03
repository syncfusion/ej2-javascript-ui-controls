import { Property, ChildProperty, Complex, Collection, DateFormatOptions, getValue, animationMode } from '@syncfusion/ej2-base';import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';import { StackValues, RectOption, ControlPoints, PolarArc, appendChildElement, appendClipElement, getElement } from '../../common/utils/helper';import { firstToLowerCase, ChartLocation, CircleOption, IHistogramValues, getColorByValue} from '../../common/utils/helper';import { Rect, SvgRenderer, CanvasRenderer, Size } from '@syncfusion/ej2-svg-base';import { ChartSeriesType, ChartShape, SeriesValueType, SplineType, StepPosition } from '../utils/enum';import { ChartDrawType, DataLabelIntersectAction } from '../utils/enum';import { BorderModel, FontModel, MarginModel, AnimationModel, OffsetModel, DragSettingsModel, EmptyPointSettingsModel, ConnectorModel, CornerRadiusModel } from '../../common/model/base-model';import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes } from '../utils/enum';import { Border, Font, Margin, Animation, DragSettings, EmptyPointSettings, Connector, CornerRadius } from '../../common/model/base';import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';import { Chart } from '../chart';import { Axis, Column, Row } from '../axis/axis';import { Data } from '../../common/model/data';import { Offset } from '../../common/model/base';import { ISeriesRenderEventArgs } from '../../chart/model/chart-interface';import { seriesRender } from '../../common/model/constants';import { Alignment, EmptyPointMode, LabelPosition, LegendShape, SeriesCategories, ShapeType } from '../../common/utils/enum';import { BoxPlotMode, Segment } from '../utils/enum';import { getVisiblePoints, setRange, findClipRect } from '../../common/utils/helper';import { Browser } from '@syncfusion/ej2-base';import { StockSeries } from '../../stock-chart/index';import { CartesianAxisLayoutPanel } from '../axis/cartesian-panel';

/**
 * Interface for a class DataLabelSettings
 */
export interface DataLabelSettingsModel {

    /**
     * If set to true, data labels for the series are render. By default, it is set to false.
     *
     * @default false
     */

    visible?: boolean;

    /**
     * If set to true, data labels for zero values in the series are render.
     *
     * @default true
     */

    showZero?: boolean;

    /**
     * Specifies the data source field that contains the data label value.
     *
     * @default null
     */

    name?: string;

    /**
     * The background color of the data label accepts hex and rgba values as valid CSS color strings.
     *
     * @default 'transparent'
     */

    fill?: string;

    /**
     * Used to format the data label, accepting global string formats like `C`, `n1`, `P`, etc.
     * It also supports placeholders, such as `{value}°C`, where `{value}` represent the point data label (e.g., 20°C).
     *
     * @default null
     */

    format?: string;

    /**
     * Specifies the opacity level for the data label background, which controls its transparency.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies the rotation angle of the data label.
     *
     * @default 0
     */

    angle?: number;

    /**
     * If set to true, the data label will be rotated according to the specified angle.
     *
     * @default false
     */

    enableRotation?: boolean;

    /**
     * Specifies the position of the data label relative to the data point.
     * The available options are:
     * * Outer: Positions the label outside the point.
     * * Top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label in the middle of the point.
     * * Auto: Automatically selects the best position for the label based on the series and data point.
     *
     * @default 'Auto'
     */

    position?: LabelPosition;

    /**
     * Specifies the X-axis rounded corner radius for the data label.
     > Note that `border` values must not be null for this feature to work.
     *
     * @default 5
     */
    rx?: number;

    /**
     * Specifies the Y-axis rounded corner radius for the data label.
     > Note that `border` values must not be null for this feature to work.
     *
     * @default 5
     */
    ry?: number;

    /**
     * Specifies the alignment of the data label relative to the data point.
     * The available options are:
     * * Near: Positions the label to the left of the data point.
     * * Center: Positions the label in the center of the data point.
     * * Far: Positions the label to the right of the data point.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Configures the appearance of the border lines with options for width and color properties.
     */

    border?: BorderModel;

    /**
     * Configures the margin for the data label.
     */

    margin?: MarginModel;

    /**
     * Customizes the appearance of the data label text with options for font size, color, style, weight, and family.
     */

    font?: FontModel;

    /**
     * Custom template for the data label.
     * Use `${point.x}` and `${point.y}` as placeholders to display the corresponding data point values.
     *
     * @default null
     * @aspType string
     */

    template?: string | Function;

    /**
     * Specifies the action to handle overlapping data labels.
     * Available options include:
     * * None - All data labels are displayed, even if they overlap.
     * * Hide - Overlapping data labels are hidden to avoid clutter.
     * * Rotate90 - Data labels are rotated 90 degrees to avoid overlap and improve readability.
     *
     * @default 'Hide'
     */

    labelIntersectAction?: DataLabelIntersectAction;

}

/**
 * Interface for a class MarkerSettings
 */
export interface MarkerSettingsModel {

    /**
     * If set to true, this enables the marker for the series.
     *
     * @default false
     */

    visible?: boolean;

    /**
     * Configures the shape of the marker used in the series.
     * Available options are:
     * * Circle - Circular shape for the marker.
     * * Rectangle - Rectangular shape for the marker.
     * * Triangle - Triangular shape for the marker.
     * * Diamond - Diamond shape for the marker.
     * * HorizontalLine - Marker as a horizontal line.
     * * VerticalLine - Marker as a vertical line.
     * * Pentagon - Pentagon shape for the marker.
     * * InvertedTriangle - Inverted triangle shape for the marker.
     * * Image - Custom image as the marker.
     * * Star - Star shape fot the marker.
     *
     * @default null
     */

    shape?: ChartShape;

    /**
     * The URL for the image to be displayed as a marker. It requires the marker's `shape` value to be `Image`.
     > Note that the marker's `shape` value must be `Image` for this feature to work.
     *
     * @default ''
     */

    imageUrl?: string;

    /**
     * Specifies the height of the marker in pixels.
     *
     * @default 5
     */

    height?: number;

    /**
     * If set to true, the marker will be filled with the series color.
     *
     * @default false
     */

    isFilled?: boolean;

    /**
     * Specifies the width of the marker in pixels.
     *
     * @default 5
     */

    width?: number;

    /**
     * Options for customizing the border of a marker, including setting the border's width and color.
     */

    border?: BorderModel;

    /**
     * This property allows for the adjustment of the marker's position relative to its data point by specifying horizontal and vertical offsets.
     */

    offset?: OffsetModel;

    /**
     * The fill color of the marker, which accepts values in hex and rgba as valid CSS color strings. By default, it takes the series color.
     *
     * @default null
     */

    fill?: string;

    /**
     * The trackball is enabled by default when the mouse moves but disabling it can be achieved by setting the marker's `allowHighlight` property to 'false'.
     *
     * @default true
     */

    allowHighlight?: boolean;

    /**
     * Sets the opacity level for the marker, which controls its transparency.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * The `dataLabel` property can be used to show the data label and customize its position and styling.
     */

    dataLabel?: DataLabelSettingsModel;

}

/**
 * Interface for a class ParetoOptions
 */
export interface ParetoOptionsModel {

    /**
     * The fill color of the Pareto line, which accepts values in hex or rgba as valid CSS color strings.
     * By default, a color based on the theme is used.
     *
     * @default null
     */

    fill?: string;

    /**
     * The `width` property controls the thickness of the line for the Pareto series, affecting its visual weight on the chart.
     *
     * @default 1
     */

    width?: number;

    /**
     * Sets the pattern of dashes and gaps for the stroke of the Pareto line series.
     *
     * @default '0'
     */

    dashArray?: string;

    /**
     * Options for displaying and customizing markers for individual points in a Pareto line.
     */

    marker?: MarkerSettingsModel;

    /**
     * By default, the axis for the Pareto line is displayed, but this can be disabled using the `showAxis` property.
     *
     * @default true
     */

    showAxis?: boolean;

}

/**
 * Interface for a class Points
 */
export interface PointsModel {

}

/**
 * Interface for a class Trendline
 */
export interface TrendlineModel {

    /**
     * The `name` property is used to assign a descriptive name to the trendline, which will be displayed in the chart as a legend.
     *
     * @default ''
     */
    name?: string;

    /**
     * Configures the pattern of dashes and gaps in the trendline stroke using the `dashArray` property.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * The `visible` property controls the display of the trendline. If set to true, the trendline will be rendered on the chart. If set to false, the trendline will be hidden.
     *
     * @default true
     */

    visible?: boolean;

    /**
     * Defines the type of trendline used in the series.
     * Available types are:
     * * Linear - A straight line that shows the general direction of data.
     * * Exponential - A curve that fits data with exponential growth or decay.
     * * Polynomial - A curve that fits data with a polynomial function.
     * * Power - A curve that represents data with a power function.
     * * Logarithmic - A curve that fits data with a logarithmic scale.
     * * MovingAverage - A trendline that smoothens data using a moving average calculation.
     *
     * @default 'Linear'
     */
    type?: TrendlineTypes;

    /**
     * Defines the period, the price changes over which will be considered to predict the moving average trendline.
     *
     * @default 2
     */
    period?: number;

    /**
     * Defines the polynomial order of the polynomial trendline.
     *
     * @default 2
     */
    polynomialOrder?: number;

    /**
     * Defines the period by which the trend is to be backward forecasted.
     *
     * @default 0
     */
    backwardForecast?: number;

    /**
     * Defines the period by which the trend must be forward forecasted.
     *
     * @default 0
     */
    forwardForecast?: number;

    /**
     * Options to customize the animation for trendlines.
     */
    animation?: AnimationModel;

    /**
     * Options for customizing the markers for trendlines, including shape, size, color, and other visual aspects.
     *
     * @deprecated
     */
    marker?: MarkerSettingsModel;

    /**
     * Enables or disables the tooltip for the trendline using the `enableTooltip` property. By default, it is set to true.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Specifies the intercept value of the trendline.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    intercept?: number;

    /**
     * The fill color for the trendline, which accepts values in hex or rgba as valid CSS color strings.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Defines the width of the trendline.
     *
     * @default 1
     */
    width?: number;

    /**
     * The `legendShape` property defines the shape used to represent the trendline in the chart legend.
     *
     * @default 'SeriesType'
     */
    legendShape?: LegendShape;

}

/**
 * Interface for a class ErrorBarCapSettings
 */
export interface ErrorBarCapSettingsModel {

    /**
     * The width of the error bar cap in pixels.
     *
     * @default 1
     */

    width?: number;

    /**
     * The length of the caps on the error bars, measured in pixels.
     *
     * @default 10
     */

    length?: number;

    /**
     * The stroke color of the cap, which accepts values in hex or rgba as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

    /**
     * The opacity of the error bar caps in the chart.
     *
     * @default 1
     */

    opacity?: number;

}

/**
 * Interface for a class ChartSegment
 */
export interface ChartSegmentModel {

    /**
     * Defines the starting point of region.
     *
     * @default null
     */

    value?: Object;

    /**
     * Defines the fill color for the region using a color name, hex code, or rgba value.
     *
     * @default null
     */

    color?: string;

    /**
     * Specifies the dash pattern for the stroke of the series. The string format allows defining various dash and gap lengths.
     *
     * @default '0'
     */

    dashArray?: string;

}

/**
 * Interface for a class ErrorBarSettings
 */
export interface ErrorBarSettingsModel {

    /**
     * If set to true, the error bar for the data will be rendered.
     *
     * @default false
     */

    visible?: boolean;

    /**
     * Specifies the type of error bar.
     * The available options are:
     * * Fixed - Renders a fixed type error bar.
     * * Percentage - Renders a percentage type error bar.
     * * StandardDeviation - Renders a standard deviation type error bar.
     * * StandardError - Renders a standard error type error bar.
     * * Custom - Renders a custom type error bar.
     *
     * @default 'Fixed'
     */

    type?: ErrorBarType;

    /**
     * Specifies the direction of the error bar.
     * The available options are:
     * * Both - Renders error bars in both directions (positive and negative).
     * * Minus - Renders error bars in the negative direction.
     * * Plus - Renders error bars in the positive direction.
     *
     * @default 'Both'
     */

    direction?: ErrorBarDirection;

    /**
     * Specifies the mode for the error bar.
     * The available options are:
     * * Vertical - Renders error bars in a vertical direction.
     * * Horizontal - Renders error bars in a horizontal direction.
     * * Both - Renders error bars in both vertical and horizontal directions.
     *
     * @default 'Vertical'
     */

    mode?: ErrorBarMode;

    /**
     * The color of the error bar's stroke, which accepts values in hex, rgba, or as a valid CSS color string.
     *
     * @default null
     */

    color?: string;

    /**
     * The vertical error for the point can also be mapped from the data source.
     *
     * @default 1
     * @aspType Object
     */

    verticalError?: number | string;

    /**
     * The `width` property determines the thickness of the error bars rendered in the chart series.
     *
     * @default 1
     */

    width?: number;

    /**
     * The horizontal error of the point can also be mapped from the data source.
     *
     * @default 1
     * @aspType Object
     */

    horizontalError?: number | string;

    /**
     * The vertical positive error of the point can be mapped from the data source as well.
     *
     * @default 3
     * @aspType Object
     */

    verticalPositiveError?: number | string;

    /**
     * The vertical negative error of the point can be mapped from the data source as well.
     *
     * @default 3
     * @aspType Object
     */

    verticalNegativeError?: number | string;

    /**
     * The horizontal positive error of the point can be mapped from the data source as well.
     *
     * @default 1
     * @aspType Object
     */

    horizontalPositiveError?: number | string;

    /**
     * The horizontal negative error of the point can be mapped from the data source as well.
     *
     * @default 1
     * @aspType Object
     */

    horizontalNegativeError?: number | string;

    /**
     * The `errorBarCap` property allows customization of the appearance and behavior of the caps at the ends of error bars in a chart series.
     */
    errorBarCap?: ErrorBarCapSettingsModel;

    /**
     * Defines the color for the error bar, which is mapped to the data source mapping name.
     *
     * @default ''
     */
    errorBarColorMapping?: string;

}

/**
 * Interface for a class SeriesBase
 */
export interface SeriesBaseModel {

    /**
     * The data source field that contains the x value.
     * It is applicable to both series and technical indicators.
     *
     * @default ''
     */

    xName?: string;

    /**
     * The data source field that contains the color mapping value.
     * It is applicable for range color mapping.
     */
    colorName?: string;

    /**
     * The data source field that contains the high value.
     * It is applicable for both financial series and technical indicators.
     *
     * @default ''
     */

    high?: string;

    /**
     * The data source field that contains the low value.
     * It is applicable for both financial series and technical indicators.
     *
     * @default ''
     */

    low?: string;

    /**
     * The data source field that contains the open value.
     * It is applicable for both financial series and technical indicators.
     *
     * @default ''
     */

    open?: string;

    /**
     * The data source field that contains the close value.
     * It is applicable for both financial series and technical indicators.
     *
     * @default ''
     */

    close?: string;

    /**
     * Defines the data source field that contains the volume value in candle charts.
     * It is applicable for both financial series and technical indicators.
     *
     * @default ''
     */

    volume?: string;

    /**
     * The data source field that contains the color value of a point.
     * It is applicable for series.
     *
     * @default ''
     */

    pointColorMapping?: string;

    /**
     * If set to `true`, the series will be visible. If set to `false`, the series will be hidden.
     *
     * @default true
     */

    visible?: boolean;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     columns: [{ width: '50%' },
     *               { width: '50%' }],
     *     axes: [{
     *                name: 'xAxis 1',
     *                columnIndex: 1
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                xAxisName: 'xAxis 1'
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default null
     */

    xAxisName?: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     rows: [{ height: '50%' },
     *            { height: '50%' }],
     *     axes: [{
     *                name: 'yAxis 1',
     *                rowIndex: 1
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                yAxisName: 'yAxis 1'
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default null
     */

    yAxisName?: string;

    /**
     * Options for customizing the animation of the series.
     * By default, animation is enabled with a duration of 1000 milliseconds (about 1 second). It can be disabled by setting enable to `false`.
     * The following properties are supported in animation:
     * * enable: If set to true, the series is animated on initial loading.
     * * duration: The duration of the animation in milliseconds.
     * * delay: The delay before the animation starts, in milliseconds.
     */

    animation?: AnimationModel;

    /**
     * The fill color for the series, which accepts values in hex or rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue', and for series, it is null.
     *
     * @default null
     */

    fill?: string;

    /**
     * The stroke width for the series, applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.
     *
     * @default 1
     */

    width?: number;

    /**
     * Defines the pattern of dashes and gaps used to stroke the lines in `Line` type series.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * Specifies the data source for the series. It can be an array of JSON objects, or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *    url: 'https://services.syncfusion.com/js/production/api/orders'
     * });
     * let query: Query = new Query().take(5);
     * let chart: Chart = new Chart({
     * ...
     *   series: [{
     *        type: 'Column',
     *        dataSource: dataManager,
     *        xName: 'CustomerID',
     *        yName: 'Freight',
     *        query: query
     *    }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Specifies a query to select data from the data source. This property is applicable only when the data source is an `ej.DataManager`.
     *
     * @default ''
     */
    query?: Query;

    /**
     * Specifies a collection of regions used to differentiate a line series.
     */
    segments?: ChartSegmentModel[];

    /**
     * Defines the axis along which the line series will be split.
     */
    segmentAxis?: Segment;

    /**
     * This property is used to improve chart performance through data mapping for the series data source.
     *
     * @default false
     */
    enableComplexProperty?: boolean;

}

/**
 * Interface for a class Series
 */
export interface SeriesModel extends SeriesBaseModel{

    /**
     * The `name` property allows setting a name for the series, which will be displayed in the legend, identifying different series in the chart, especially when multiple series are present.
     *
     * @default ''
     */

    name?: string;

    /**
     * The data source field that contains the y value.
     *
     * @default ''
     */

    yName?: string;

    /**
     * Specifies the type of series to be drawn in radar or polar charts.
     * The available options are:
     * * 'Line' - Renders a line series.
     * * 'Column' - Renders a column series.
     * * 'Area' - Renders an area series.
     * * 'Scatter' - Renders a scatter series.
     * * 'Spline' - Renders a spline series.
     * * 'StackingColumn' - Renders a stacking column series.
     * * 'StackingArea' - Renders a stacking area series.
     * * 'RangeColumn' - Renders a range column series.
     * * 'SplineArea' - Renders a spline area series.
     *
     * @default 'Line'
     */
    drawType?: ChartDrawType;

    /**
     * Specifies whether to join the start and end points of a line/area series used in a polar/radar chart to form a closed path.
     *
     * @default true
     */
    isClosed?: boolean;

    /**
     * This property is used in financial charts to visualize price movements in stocks.
     * It defines the color of the candle/point when the opening price is less than the closing price.
     *
     * @default null
     */

    bearFillColor?: string;

    /**
     * This property is used in financial charts to visualize price movements in stocks.
     * It defines the color of the candle/point when the opening price is higher than the closing price.
     *
     * @default null
     */

    bullFillColor?: string;

    /**
     * This property is applicable for the candle series.
     * It enables or disables the visual comparison of the current values with previous values in stock charts.
     *
     * @default false
     */
    enableSolidCandles?: boolean;

    /**
     * The data source field that contains the size value for the y-axis.
     *
     * @default ''
     */

    size?: string;

    /**
     * The `binInterval` property controls the width of each bin and the interval between bins for histogram points.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    binInterval?: number;

    /**
     * Specifies whether to display the normal distribution curve for the histogram series.
     *
     * @default false
     */

    showNormalDistribution?: boolean;

    /**
     * This property allows the grouping of series in stacked column and stacked bar charts.
     * Any string value can be assigned to the `stackingGroup` property.
     * Series with the same `stackingGroup` value will be grouped together in the chart.
     *
     * @default ''
     */

    stackingGroup?: string;

    /**
     * Options for customizing the border of the series.
     > Note that this property is applicable only for `Column` and `Bar` type series.
     */

    border?: BorderModel;

    /**
     * Sets the opacity of the series, with a value between 0 and 1 where 0 is fully transparent and 1 is fully opaque.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * The z-order of the series, which controls the stack order of the series. Higher values are drawn on top of lower values.
     *
     * @default 0
     */
    zOrder?: number;

    /**
     * Defines the name that specifies the chart series are mutually exclusive and can be overlaid.
     * Series in the same group share the same baseline and location on the corresponding axis.
     *
     * @default ''
     */

    groupName?: string;

    /**
     * The type of the series determines the visual representation of the data.
     * Available series types include:
     * * Line - Draws a line series.
     * * Column - Draws a column series.
     * * Area - Draws an area series.
     * * Bar - Draws a bar series.
     * * Histogram - Draws a histogram series.
     * * StackingColumn - Draws a stacking column series.
     * * StackingArea - Draws a stacking area series.
     * * StackingBar - Draws a stacking bar series.
     * * StepLine - Draws a step line series.
     * * StepArea - Draws a step area series.
     * * Scatter - Draws a scatter series.
     * * Spline - Draws a spline series.
     * * StackingColumn100 - Draws a 100% stacked column series.
     * * StackingBar100 - Draws a 100% stacked bar series.
     * * StackingArea100 - Draws a 100% stacked area series.
     * * RangeColumn - Draws a range column series.
     * * Hilo - Draws a Hilo series.
     * * HiloOpenClose - Draws a Hilo Open Close series.
     * * Waterfall - Draws a waterfall series.
     * * RangeArea - Draws a range area series.
     * * SplineRangeArea - Draws a spline range area series.
     * * Bubble - Draws a bubble series.
     * * Candle - Draws a candle series.
     * * Polar - Draws a polar series.
     * * Radar - Draws a radar series.
     * * BoxAndWhisker - Draws a box and whisker series.
     * * Pareto - Draws a Pareto series.
     *
     * @default 'Line'
     */

    type?: ChartSeriesType;

    /**
     * Options for displaying and customizing error bars for individual points in a series.
     */
    errorBar?: ErrorBarSettingsModel;

    /**
     * Options for displaying and customizing markers for individual points in a series.
     */
    marker?: MarkerSettingsModel;

    /**
     * Options for customizing the Pareto line series, including its appearance and behavior in the chart.
     */
    paretoOptions?: ParetoOptionsModel;

    /**
     * Customize the drag settings for the series with this property to configure drag behavior in the chart.
     */
    dragSettings?: DragSettingsModel;

    /**
     * Defines the collection of trendlines used to predict the trend.
     */
    trendlines?: TrendlineModel[];

    /**
     * Controls whether the tooltip for the chart series is enabled or disabled. Set to true to display tooltips on hover, or false to hide them.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Use this property to define a custom format for how tooltips are displayed.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    series: [{
     *           dataSource: data,
     *           xName: 'x',
     *           yName: 'y',
     *           tooltipFormat: '${point.x} : ${point.y}'
     *     }],
     *    tooltip: {
     *       enable: true
     *    }
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default ''
     */
    tooltipFormat?: string;

    /**
     * The data source field that contains the value to be displayed in the tooltip.
     *
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * Specifies the shape of the legend icon for each series.
     * Available shapes for legend:
     * * Circle - Renders a circular icon.
     * * Rectangle - Renders a rectangular icon.
     * * Triangle - Renders a triangular icon.
     * * Diamond - Renders a diamond-shaped icon.
     * * Cross - Renders a cross-shaped icon.
     * * HorizontalLine - Renders a horizontal line icon.
     * * VerticalLine - Renders a vertical line icon.
     * * Pentagon - Renders a pentagon-shaped icon.
     * * InvertedTriangle - Renders an inverted triangle-shaped icon.
     * * SeriesType - Uses the default icon shape based on the series type.
     * * Image - Renders a custom image for the legend icon.
     *
     * @default 'SeriesType'
     */

    legendShape?: LegendShape;

    /**
     * The URL for the image to be displayed as a legend icon.
     > Note that `legendShape` must be set to `Image`.
     *
     * @default ''
     */

    legendImageUrl?: string;

    /**
     * The `selectionStyle` property is used to specify custom CSS styles for the selected series or points.
     *
     * @default null
     */
    selectionStyle?: string;

    /**
     * The `unSelectedStyle` property is used to specify custom CSS styles for the deselected series or points.
     *
     * @default null
     */
    unSelectedStyle?: string;

    /**
     * The `nonHighlightStyle` property is used to specify custom CSS styles for the non-highlighted series or points.
     *
     * @default null
     */
    nonHighlightStyle?: string;

    /**
     * Specifies the minimum radius for the data points in the series.
     *
     * @default 1
     */
    minRadius?: number;

    /**
     * Specifies the maximum radius for the data points in the series.
     *
     * @default 3
     */
    maxRadius?: number;

    /**
     * Specifies the type of spline used for rendering.
     * Available options include:
     * * Natural - Renders a natural spline.
     * * Cardinal - Renders a cardinal spline.
     * * Clamped - Renders a clamped spline.
     * * Monotonic - Renders a monotonic spline.
     *
     * @default 'Natural'
     */
    splineType?: SplineType;

    /**
     * Specifies the tension parameter for cardinal splines. This affects the curvature of the spline.
     *
     * @default 0.5
     */
    cardinalSplineTension?: number;

    /**
     * Customization options for the appearance of empty points in the series.
     * `null` or `undefined` values are considered empty points.
     */
    emptyPointSettings?: EmptyPointSettingsModel;

    /**
     * If set to true, the mean value for the box and whisker plot will be visible.
     *
     * @default true
     */
    showMean?: boolean;

    /**
     * Specifies the box plot mode for the box and whisker chart series.
     * The available modes are:
     * Exclusive - Renders the series based on the exclusive mode.
     * Inclusive - Renders the series based on the inclusive mode.
     * Normal - Renders the series based on the normal mode.
     *
     * @default 'Normal'
     */
    boxPlotMode?: BoxPlotMode;

    /**
     * The `columnWidth` property can be used to customize the width of the columns in a column series.
     > Note that if the series type is histogram, the default value is 1; otherwise, it is 0.7.
     *
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValue Double.NaN
     */
    columnWidth?: number;

    /**
     * To render the column series points with a specific column width in pixels.
     *
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValue Double.NaN
     */
    columnWidthInPixel?: number;

    /**
     * Defines the shape of the data in a column and bar chart.
     * Available shapes are:
     * * Rectangle: Displays the data in a column and bar chart with a rectangular shape.
     * * Cylinder: Displays the data in a column and bar chart with a cylindrical shape.
     *
     * @default 'Rectangle'
     */
    columnFacet?: ShapeType;

    /**
     * This property determines the space between columns in a column or bar chart.
     > Note that it takes a value from 0 to 1.
     *
     * @default 0
     */
    columnSpacing?: number;

    /**
     * Defines the visual representation of negative changes in waterfall charts.
     *
     * @default '#C64E4A'
     */
    negativeFillColor?: string;

    /**
     * Defines the visual representation of summaries in waterfall charts.
     *
     * @default '#4E81BC'
     */
    summaryFillColor?: string;

    /**
     * Defines the collection of indexes for the intermediate summary columns in waterfall charts.
     *
     * @default []
     * @aspType int[]
     */
    intermediateSumIndexes?: number[];

    /**
     * Defines the collection of indexes for the overall summary columns in waterfall charts.
     *
     * @default []
     * @aspType int[]
     */
    sumIndexes?: number[];

    /**
     * The `step` property can be used to change the position of the steps in step line, step area, and step range area chart types.
     * * Left: Steps start from the left side of the 2nd point.
     * * Center: Steps start between the data points.
     * * Right: Steps start from the right side of the 1st point. 
     *
     * @default 'Left'
     */
    step?: StepPosition;

    /**
     * When set to true, the step series will be rendered without the vertical lines (risers) connecting the horizontal steps.
     > Note this property is only applicable to step series.
     *
     * @default false
     */
    noRisers?: boolean;

    /**
     * Specifies the appearance of the line connecting adjacent points in waterfall charts.
     */

    connector?: ConnectorModel;

    /**
     * The `cornerRadius` property specifies the radius for the corners of the column series points to create a rounded appearance in the chart.
     */
    cornerRadius?: CornerRadiusModel;

    /**
     * Adds a data point to the data source.
     *
     * @function addPoint
     * @param {Object} dataPoint - The data point to be added.
     * @param {number} duration - The duration for the animation.
     * @returns {void}
     */
    addPoint?(dataPoint: Object, duration?: number) : void

    /**
     * Removes a data point from the series data source at the specified index.
     *
     * @function removePoint
     * @param {number} index - The index of the data point to be removed.
     * @param {number} duration - The duration for the animation.
     * @returns {void}
     */
    removePoint?(index: number, duration?: number) : void

    /**
     * Sets the data source with the provided data.
     *
     * @function setData
     * @param {Object[]} data - An array of objects representing the data points.
     * @param {number} duration - The duration for the animation.
     * @returns {void}
     */
    setData?(data: Object[], duration?: number) : void

}