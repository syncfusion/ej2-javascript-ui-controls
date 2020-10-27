import { Property, ChildProperty, Complex, Collection, DateFormatOptions, getValue } from '@syncfusion/ej2-base';import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';import { StackValues, RectOption, ControlPoints, PolarArc, appendChildElement, appendClipElement } from '../../common/utils/helper';import { firstToLowerCase, ChartLocation, CircleOption, IHistogramValues } from '../../common/utils/helper';import { Rect, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';import { ChartSeriesType, ChartShape, LegendShape, LabelPosition, SeriesValueType, EmptyPointMode, SplineType } from '../utils/enum';import { ChartDrawType } from '../utils/enum';import { BorderModel, FontModel, MarginModel, AnimationModel, EmptyPointSettingsModel, OffsetModel } from '../../common/model/base-model';import { ConnectorModel } from '../../common/model/base-model';import { CornerRadiusModel, DragSettingsModel } from '../../common/model/base-model';import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes } from '../utils/enum';import { Border, Font, Margin, Animation, EmptyPointSettings, CornerRadius, Connector, DragSettings } from '../../common/model/base';import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';import { Chart } from '../chart';import { Axis, Column, Row } from '../axis/axis';import { Data } from '../../common/model/data';import { Offset } from '../../common/model/base';import { ISeriesRenderEventArgs } from '../../chart/model/chart-interface';import { seriesRender } from '../../common/model/constants';import { Alignment, SeriesCategories } from '../../common/utils/enum';import { BoxPlotMode, Segment } from '../utils/enum';import { sort, getVisiblePoints, setRange } from '../../common/utils/helper';import { Browser } from '@syncfusion/ej2-base';import { StockSeries } from '../../stock-chart/index';

/**
 * Interface for a class DataLabelSettings
 */
export interface DataLabelSettingsModel {

    /**
     * If set true, data label for series renders.
     * @default false
     */

    visible?: boolean;

    /**
     * If set true, data label for zero values in series renders.
     * @default true
     */

    showZero?: boolean;

    /**
     * The DataSource field that contains the data label value.
     * @default null
     */

    name?: string;

    /**
     * The background color of the data label accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */

    fill?: string;

    /**
     * The opacity for the background.
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies angle for data label.
     * @default 0
     */

    angle?: number;

    /**
     * Enables rotation for data label.
     * @default false
     */

    enableRotation?: boolean;

    /**
     * Specifies the position of the data label. They are,
     * * Outer: Positions the label outside the point.
     * * top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label to the middle of the point.
     * * Auto: Positions the label based on series.
     * @default 'Auto'
     */

    position?: LabelPosition;

    /**
     * The roundedCornerX for the data label. It requires `border` values not to be null.
     * @default 5
     */
    rx?: number;

    /**
     * The roundedCornerY for the data label. It requires `border` values not to be null.
     * @default 5
     */
    ry?: number;

    /**
     * Specifies the alignment for data Label. They are,
     * * Near: Aligns the label to the left of the point.
     * * Center: Aligns the label to the center of the point.
     * * Far: Aligns the label to the right of the point.
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Option for customizing the border lines.
     */

    border?: BorderModel;

    /**
     * Margin configuration for the data label.
     */

    margin?: MarginModel;

    /**
     * Option for customizing the data label text.
     */

    font?: FontModel;

    /**
     * Custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     * @default null
     */

    template?: string;

    /**
     * Show Datalabel Even two Data Labels Are Overflow
     * @default 'Hide'
     */

    labelIntersectAction?: string;

}

/**
 * Interface for a class MarkerSettings
 */
export interface MarkerSettingsModel {

    /**
     * If set to true the marker for series is rendered. This is applicable only for line and area type series.
     * @default false
     */

    visible?: boolean;

    /**
     * The different shape of a marker:
     * * Circle
     * * Rectangle
     * * Triangle
     * * Diamond
     * * HorizontalLine
     * * VerticalLine
     * * Pentagon
     * * InvertedTriangle
     * * Image
     * @default 'Circle'
     */

    shape?: ChartShape;

    /**
     * The URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
     * @default ''
     */

    imageUrl?: string;

    /**
     * The height of the marker in pixels.
     * @default 5
     */

    height?: number;

    /**
     * The width of the marker in pixels.
     * @default 5
     */

    width?: number;

    /**
     * Options for customizing the border of a marker.
     */

    border?: BorderModel;

    /**
     * Options for customizing the marker position.
     */

    offset?: OffsetModel;

    /**
     *  The fill color of the marker that accepts value in hex and rgba as a valid CSS color string. By default, it will take series' color.
     * @default null
     */

    fill?: string;

    /**
     * The opacity of the marker.
     * @default 1
     */

    opacity?: number;

    /**
     * The data label for the series.
     */

    dataLabel?: DataLabelSettingsModel;

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
     * Defines the name of trendline
     * @default ''
     */
    name?: string;

    /**
     * Defines the pattern of dashes and gaps to stroke.
     * @default '0'
     */

    dashArray?: string;

    /**
     * Specifies the visibility of trendline.
     * @default true
     */

    visible?: boolean;

    /**
     * Defines the type of the trendline
     * @default 'Linear'
     */
    type?: TrendlineTypes;

    /**
     * Defines the period, the price changes over which will be considered to predict moving average trend line
     * @default 2
     */
    period?: number;

    /**
     * Defines the polynomial order of the polynomial trendline
     * @default 2
     */
    polynomialOrder?: number;

    /**
     * Defines the period, by which the trend has to backward forecast
     * @default 0
     */
    backwardForecast?: number;

    /**
     * Defines the period, by which the trend has to forward forecast
     * @default 0
     */
    forwardForecast?: number;

    /**
     * Options to customize the animation for trendlines
     */
    animation?: AnimationModel;

    /**
     * Options to customize the marker for trendlines
     * @deprecated
     */
    marker?: MarkerSettingsModel;

    /**
     * Enables/disables tooltip for trendlines
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Defines the intercept of the trendline
     * @default null
     * @aspDefaultValueIgnore
     */
    intercept?: number;

    /**
     * Defines the fill color of trendline
     * @default ''
     */
    fill?: string;

    /**
     * Defines the width of the trendline
     * @default 1
     */
    width?: number;

    /**
     * Sets the legend shape of the trendline
     * @default 'SeriesType'
     */
    legendShape?: LegendShape;

}

/**
 * Interface for a class ErrorBarCapSettings
 */
export interface ErrorBarCapSettingsModel {

    /**
     * The width of the error bar in pixels.
     * @default 1
     */

    width?: number;

    /**
     * The length of the error bar in pixels.
     * @default 10
     */

    length?: number;

    /**
     *  The stroke color of the cap, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */

    color?: string;

    /**
     * The opacity of the cap.
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
     * @default null
     */

    value?: Object;

    /**
     * Defines the color of a region.
     * @default null
     */

    color?: string;

    /**
     * Defines the pattern of dashes and gaps to stroke.
     * @default '0'
     */

    dashArray?: string;

}

/**
 * Interface for a class ErrorBarSettings
 */
export interface ErrorBarSettingsModel {

    /**
     * If set true, error bar for data gets rendered.
     * @default false
     */

    visible?: boolean;

    /**
     * The type of the error bar . They are
     * * Fixed -  Renders a fixed type error bar.
     * * Percentage - Renders a percentage type error bar.
     * * StandardDeviation - Renders a standard deviation type error bar.
     * * StandardError -Renders a standard error type error bar.
     * * Custom -Renders a custom type error bar.
     * @default 'Fixed'
     */

    type?: ErrorBarType;

    /**
     * The direction of the error bar . They are
     * * both -  Renders both direction of error bar.
     * * minus - Renders minus direction of error bar.
     * * plus - Renders plus direction error bar.
     * @default 'Both'
     */

    direction?: ErrorBarDirection;

    /**
     * The mode of the error bar . They are
     * * Vertical -  Renders a vertical error bar.
     * * Horizontal - Renders a horizontal error bar.
     * * Both - Renders both side error bar.
     * @default 'Vertical'
     */

    mode?: ErrorBarMode;

    /**
     *  The color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */

    color?: string;

    /**
     * The vertical error of the error bar.
     * @default 1
     */

    verticalError?: number;

    /**
     * The stroke width of the error bar..
     * @default 1
     */

    width?: number;

    /**
     * The horizontal error of the error bar.
     * @default 1
     */

    horizontalError?: number;

    /**
     * The vertical positive error of the error bar.
     * @default 3
     */

    verticalPositiveError?: number;

    /**
     * The vertical negative error of the error bar.
     * @default 3
     */

    verticalNegativeError?: number;

    /**
     * The horizontal positive error of the error bar.
     * @default 1
     */

    horizontalPositiveError?: number;

    /**
     * The horizontal negative error of the error bar.
     * @default 1
     */

    horizontalNegativeError?: number;

    /**
     * Options for customizing the cap of the error bar.
     */
    errorBarCap?: ErrorBarCapSettingsModel;

}

/**
 * Interface for a class SeriesBase
 */
export interface SeriesBaseModel {

    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators
     * @default ''
     */

    xName?: string;

    /**
     * The DataSource field that contains the high value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    high?: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    low?: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    open?: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    close?: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators
     * @default ''
     */

    volume?: string;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series
     * @default ''
     */

    pointColorMapping?: string;

    /**
     * Specifies the visibility of series.
     * @default true
     */

    visible?: boolean;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
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
     *                columnIndex: 1,
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                xAxisName: 'xAxis 1',
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default null
     */

    xAxisName?: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
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
     *                rowIndex: 1,
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                yAxisName: 'yAxis 1'
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default null
     */

    yAxisName?: string;

    /**
     * Options to customizing animation for the series.
     */

    animation?: AnimationModel;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.
     * @default null
     */

    fill?: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.
     * @default 1
     */

    width?: number;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */

    dashArray?: string;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let chart: Chart = new Chart({
     * ...
     *     series: [{
     *        dataSource: dataManager,
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.
     * @default ''
     */
    query?: Query;

    /**
     * Defines the collection of regions that helps to differentiate a line series.
     */
    segments?: ChartSegmentModel[];

    /**
     * Defines the axis, based on which the line series will be split.
     */
    segmentAxis?: Segment;

    /**
     * This property used to improve chart performance via data mapping for series dataSource.
     * @default false
     */
    enableComplexProperty?: boolean;

}

/**
 * Interface for a class Series
 */
export interface SeriesModel extends SeriesBaseModel{

    /**
     * The name of the series visible in legend.
     * @default ''
     */

    name?: string;

    /**
     * The DataSource field that contains the y value.
     * @default ''
     */

    yName?: string;

    /**
     * Type of series to be drawn in radar or polar series. They are
     *  'Line'
     *  'Column'
     *  'Area'
     *  'Scatter'
     *  'Spline'
     *  'StackingColumn'
     *  'StackingArea'
     *  'RangeColumn'
     *  'SplineArea'
     * @default 'Line'
     */
    drawType?: ChartDrawType;

    /**
     * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
     * @default true
     */
    isClosed?: boolean;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is less than the closing price.
     * @default '#2ecd71'
     */

    bearFillColor?: string;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is higher than the closing price.
     * @default '#e74c3d'
     */

    bullFillColor?: string;

    /**
     * This property is applicable for candle series.
     * It enables/disables to visually compare the current values with the previous values in stock.
     * @default false
     */
    enableSolidCandles?: boolean;

    /**
     * The DataSource field that contains the size value of y
     * @default ''
     */

    size?: string;

    /**
     * The bin interval of each histogram points.
     * @default null
     * @aspDefaultValueIgnore
     */

    binInterval?: number;

    /**
     * The normal distribution of histogram series.
     * @default false
     */

    showNormalDistribution?: boolean;

    /**
     * This property allows grouping series in `stacked column / bar` charts.
     * Any string value can be provided to the stackingGroup property.
     * If any two or above series have the same value, those series will be grouped together.
     * @default ''
     */

    stackingGroup?: string;

    /**
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */

    border?: BorderModel;

    /**
     * The opacity of the series.
     * @default 1
     */
    opacity?: number;

    /**
     * The z order of the series.
     * @default 0
     */
    zOrder?: number;

    /**
     * The type of the series are
     * * Line
     * * Column
     * * Area
     * * Bar
     * * Histogram
     * * StackingColumn
     * * StackingArea
     * * StackingBar
     * * StepLine
     * * StepArea
     * * Scatter
     * * Spline
     * * StackingColumn100
     * * StackingBar100
     * * StackingArea100
     * * RangeColumn
     * * Hilo
     * * HiloOpenClose
     * * Waterfall
     * * RangeArea
     * * Bubble
     * * Candle
     * * Polar
     * * Radar
     * * BoxAndWhisker
     * * Pareto
     * @default 'Line'
     */

    type?: ChartSeriesType;

    /**
     * Options for displaying and customizing error bar for individual point in a series.
     */
    errorBar?: ErrorBarSettingsModel;

    /**
     * Options for displaying and customizing markers for individual points in a series.
     */
    marker?: MarkerSettingsModel;

    /**
     * Options to customize the drag settings for series
     */
    dragSettings?: DragSettingsModel;

    /**
     * Defines the collection of trendlines that are used to predict the trend
     */
    trendlines?: TrendlineModel[];

    /**
     * If set true, the Tooltip for series will be visible.
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * user can format now each series tooltip format separately.
     * @default ''
     */
    tooltipFormat?: string;

    /**
     * The provided value will be considered as a Tooltip name 
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * The shape of the legend. Each series has its own legend shape. They are,
     * * Circle
     * * Rectangle
     * * Triangle
     * * Diamond
     * * Cross
     * * HorizontalLine
     * * VerticalLine
     * * Pentagon
     * * InvertedTriangle
     * * SeriesType
     * @default 'SeriesType'
     */

    legendShape?: LegendShape;

    /**
     * Custom style for the selected series or points.
     * @default null
     */
    selectionStyle?: string;

    /**
     * Custom style for the deselected series or points.
     * @default null
     */
    unSelectedStyle?: string;

    /**
     * Custom style for the non-highlighted series or points.
     * @default null
     */
    nonHighlightStyle?: string;

    /**
     * Minimum radius
     * @default 1
     */
    minRadius?: number;

    /**
     * Maximum radius
     * @default 3
     */
    maxRadius?: number;

    /**
     * Defines type of spline to be rendered.
     * @default 'Natural'
     */
    splineType?: SplineType;

    /**
     * It defines tension of cardinal spline types
     * @default 0.5
     */
    cardinalSplineTension?: number;

    /**
     * options to customize the empty points in series
     */
    emptyPointSettings?: EmptyPointSettingsModel;

    /**
     * If set true, the mean value for box and whisker will be visible.
     * @default true
     */
    showMean?: boolean;

    /**
     * The mode of the box and whisker char series. They are,
     * Exclusive
     * Inclusive
     * Normal
     * @default 'Normal'
     */
    boxPlotMode?: BoxPlotMode;

    /**
     * To render the column series points with particular column width. If the series type is histogram the
     * default value is 1 otherwise 0.7.
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValue Double.NaN
     */
    columnWidth?: number;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     * @default 0
     */
    columnSpacing?: number;

    /**
     * Defines the visual representation of the negative changes in waterfall charts.
     * @default '#C64E4A'
     */
    negativeFillColor?: string;

    /**
     * Defines the visual representation of the summaries in waterfall charts.
     * @default '#4E81BC'
     */
    summaryFillColor?: string;

    /**
     * Defines the collection of indexes of the intermediate summary columns in waterfall charts.
     * @default []
     * @aspType int[]
     */
    intermediateSumIndexes?: number[];

    /**
     * Defines the collection of indexes of the overall summary columns in waterfall charts.
     * @default []
     * @aspType int[]
     */
    sumIndexes?: number[];

    /**
     * Defines the appearance of line connecting adjacent points in waterfall charts.
     */

    connector?: ConnectorModel;

    /**
     * To render the column series points with particular rounded corner.
     */
    cornerRadius?: CornerRadiusModel;

}