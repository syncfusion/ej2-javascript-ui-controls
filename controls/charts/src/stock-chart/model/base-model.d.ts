import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';import { DataManager, Query} from '@syncfusion/ej2-data';import { MarkerSettings, Trendline } from '../../chart/series/chart-series';import { MarkerSettingsModel, TrendlineModel } from '../../chart/series/chart-series-model';import { StockChart } from '../stock-chart';import { ChartSeriesType, EmptyPointMode, TechnicalIndicators, MacdType, FinancialDataFields, ChartTheme } from '../../chart/utils/enum';import { Anchor, ZIndex, SizeType, LabelIntersectAction, LabelPlacement, AxisPosition, IntervalType } from '../../chart/utils/enum';import { SkeletonType, ChartRangePadding, EdgeLabelPlacement, ValueType, LegendShape, TrendlineTypes } from '../../chart/utils/enum';import { MajorGridLinesModel, MajorTickLinesModel, CrosshairTooltipModel, AxisLineModel } from '../../chart/axis/axis-model';import { MinorGridLinesModel, MinorTickLinesModel } from '../../chart/axis/axis-model';import { MajorGridLines, MajorTickLines, MinorTickLines, MinorGridLines, CrosshairTooltip, AxisLine } from '../../chart/axis/axis';import { ConnectorType } from '../../accumulation-chart/model/enum';import { TextOverflow, Alignment, Regions, Units, Position, FlagType } from '../../common/utils/enum';import { Theme } from '../../common/model/theme';import { AnimationModel, CornerRadiusModel, EmptyPointSettingsModel, ConnectorModel } from '../../chart/index';

/**
 * Interface for a class StockChartFont
 */
export interface StockChartFontModel {

    /**
     * Color for the text.
     * @default ''
     */
    color?: string;

    /**
     * Font size for the text.
     * @default '16px'
     */
    size?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

    /**
     * Specifies the chart title text overflow
     * @default 'Trim'
     */
    textOverflow?: TextOverflow;

    /**
     * text alignment
     * @default 'Center'
     */
    textAlignment?: Alignment;

}

/**
 * Interface for a class StockChartBorder
 */
export interface StockChartBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    width?: number;

}

/**
 * Interface for a class StockChartArea
 */
export interface StockChartAreaModel {

    /**
     * Options to customize the border of the chart area.
     */
    border?: StockChartBorderModel;

    /**
     * The background of the chart area that accepts value in hex and rgba as a valid CSS color string..
     * @default 'transparent'
     */
    background?: string;

    /**
     * The opacity for background.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class StockMargin
 */
export interface StockMarginModel {

    /**
     * Left margin in pixels.
     * @default 10
     */
    left?: number;

    /**
     * Right margin in pixels.
     * @default 10
     */
    right?: number;

    /**
     * Top margin in pixels.
     * @default 10
     */
    top?: number;

    /**
     * Bottom margin in pixels.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class StockChartStripLineSettings
 */
export interface StockChartStripLineSettingsModel {

    /**
     *  If set true, strip line get render from axis origin.
     *  @default false
     */
    startFromAxis?: boolean;

    /**
     * If set true, strip line for axis renders.
     * @default true
     */
    visible?: boolean;

    /**
     * Start value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    start?: Object | number | Date;

    /**
     * Color of the strip line.
     * @default '#808080'
     */
    color?: string;

    /**
     * End value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    end?: Object | number | Date;

    /**
     * Size of the strip line, when it starts from the origin.
     * @default null
     * @aspDefaultValueIgnore
     */
    size?: number;

    /**
     * Size type of the strip line
     * @default Auto
     */
    sizeType?: SizeType;

    /**
     * Dash Array of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    dashArray?: string;

    /**
     * isRepeat value of the strip line.
     * @default false
     * @aspDefaultValueIgnore
     */
    isRepeat?: boolean;

    /**
     * repeatEvery value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    repeatEvery?: Object | number | Date;

    /**
     * isSegmented value of the strip line
     * @default false
     * @aspDefaultValueIgnore
     */
    isSegmented?: boolean;

    /**
     * repeatUntil value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    repeatUntil?: Object | number | Date;

    /**
     * segmentStart value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    segmentStart?: Object | number | Date;

    /**
     * segmentAxisName of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    segmentAxisName?: string;

    /**
     * segmentEnd value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    segmentEnd?: Object | number | Date;

    /**
     * Strip line Opacity
     * @default 1
     */
    opacity?: number;

    /**
     * Strip line text.
     * @default ''
     */
    text?: string;

    /**
     * Border of the strip line.
     */
    border?: StockChartBorderModel;

    /**
     * The angle to which the strip line text gets rotated.
     * @default null
     * @aspDefaultValueIgnore
     */
    rotation?: number;

    /**
     * Specifies the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.
     * @default 'Behind'
     */
    zIndex?: ZIndex;

    /**
     * Defines the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     * @default 'Middle'
     */
    horizontalAlignment?: Anchor;

    /**
     * Defines the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     * @default 'Middle'
     */
    verticalAlignment?: Anchor;

    /**
     * Options to customize the strip line text.
     */
    textStyle?: StockChartFontModel;

    /**
     * The option to delay animation of the series.
     * @default 0
     */

    delay?: number;

    /**
     * If set to true, series gets animated on initial loading.
     * @default false
     */

    enable?: boolean;

    /**
     * The duration of animation in milliseconds.
     * @default 1000
     */

    duration?: number;

}

/**
 * Interface for a class StockEmptyPointSettings
 */
export interface StockEmptyPointSettingsModel {

    /**
     * To customize the fill color of empty points.
     * @default null
     */
    fill?: string;

    /**
     * To customize the mode of empty points.
     * @default Gap
     */
    mode?: EmptyPointMode;

    /**
     * Options to customize the border of empty points.
     * @default "{color: 'transparent', width: 0}"
     */
    border?: StockChartBorderModel;

}

/**
 * Interface for a class StockChartConnector
 */
export interface StockChartConnectorModel {

    /**
     * specifies the type of the connector line. They are
     * * Smooth
     * * Line
     * @default 'Line'
     */
    type?: ConnectorType;

    /**
     * Length of the connector line in pixels.
     * @default null
     */
    length?: string;

    /**
     * Color of the connector line.
     * @default null
     */
    color?: string;

    /**
     * dashArray of the connector line.
     * @default ''
     */
    dashArray?: string;

    /**
     * Width of the connector line in pixels.
     * @default 1
     */
    width?: number;

}

/**
 * Interface for a class StockSeries
 */
export interface StockSeriesModel {

    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators
     * @default ''
     */

    xName?: string;

    /**
     * The DataSource field that contains the y value.
     * @default ''
     */

    yName?: string;

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
     * Options to customizing animation for the series.
     */

    animation?: AnimationModel;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * @default null
     */

    xAxisName?: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * @default null
     */

    yAxisName?: string;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.
     * @default null
     */

    fill?: string;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */

    dashArray?: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.
     * @default 1
     */

    width?: number;

    /**
     * The name of the series visible in legend.
     * @default ''
     */

    name?: string;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.
     * @default null
     */
    query?: Query;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is higher than the closing price.
     * @default '#e74c3d'
     */

    bullFillColor?: string;

    /**
     * This property is used in stock charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is less than the closing price.
     * @default '#2ecd71'
     */

    bearFillColor?: string;

    /**
     * This property is applicable for candle series.
     * It enables/disables to visually compare the current values with the previous values in stock.
     * @default false
     */
    enableSolidCandles?: boolean;

    /**
     * Specifies the visibility of series.
     * @default true
     */

    visible?: boolean;

    /**
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */

    border?: StockChartBorderModel;

    /**
     * The opacity of the series.
     * @default 1
     */
    opacity?: number;

    /**
     * The type of the series are
     * * Line
     * * Column
     * * Area
     * * Spline
     * * Hilo
     * * HiloOpenClose
     * * Candle
     * @default 'Candle'
     */

    type?: ChartSeriesType;

    /**
     * Options for displaying and customizing markers for individual points in a series.
     */
    marker?: MarkerSettingsModel;

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
     * The provided value will be considered as a Tooltip name 
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * Custom style for the selected series or points.
     * @default null
     */
    selectionStyle?: string;

    /**
     * It defines tension of cardinal spline types
     * @default 0.5
     */
    cardinalSplineTension?: number;

    /**
     * To render the column series points with particular rounded corner.
     */
    cornerRadius?: CornerRadiusModel;

    /**
     * options to customize the empty points in series
     */
    emptyPointSettings?: EmptyPointSettingsModel;

    /**
     * To render the column series points with particular column width. If the series type is histogram the
     * default value is 1 otherwise 0.7.
     * @default null
     * @aspDefaultValueIgnore
     */
    columnWidth?: number;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     * @default 0
     */
    columnSpacing?: number;

}

/**
 * Interface for a class StockChartIndicator
 */
export interface StockChartIndicatorModel {

    /**
     * Defines the type of the technical indicator
     * @default 'Sma'
     */
    type?: TechnicalIndicators;

    /**
     * Defines the period, the price changes over which will be considered to predict the trend
     * @default 14
     */
    period?: number;

    /**
     * Defines the period, the price changes over which will define the %D value in stochastic indicators
     * @default 3
     */
    dPeriod?: number;

    /**
     * Defines the look back period, the price changes over which will define the %K value in stochastic indicators
     * @default 14
     */
    kPeriod?: number;

    /**
     * Defines the over-bought(threshold) values. It is applicable for RSI and stochastic indicators
     * @default 80
     */
    overBought?: number;

    /**
     * Defines the over-sold(threshold) values. It is applicable for RSI and stochastic indicators
     * @default 20
     */
    overSold?: number;

    /**
     * Defines the field to compare the current value with previous values
     * @default 'Close'
     */
    field?: FinancialDataFields;

    /**
     * Sets the standard deviation values that helps to define the upper and lower bollinger bands
     * @default 2
     */
    standardDeviation?: number;

    /**
     * Sets the slow period to define the Macd line
     * @default 12
     */
    slowPeriod?: number;

    /**
     * Enables/Disables the over-bought and over-sold regions
     * @default true
     */
    showZones?: boolean;

    /**
     * Sets the fast period to define the Macd line
     * @default 26
     */
    fastPeriod?: number;

    /**
     * Defines the appearance of the the MacdLine of Macd indicator
     * @default { color: '#ff9933', width: 2 }
     */
    macdLine?: StockChartConnectorModel;

    /**
     * Defines the type of the Macd indicator.
     * @default 'Both'
     */
    macdType?: MacdType;

    /**
     * Defines the color of the negative bars in Macd indicators
     * @default '#e74c3d'
     */
    macdNegativeColor?: string;

    /**
     * Defines the color of the positive bars in Macd indicators
     * @default '#2ecd71'
     */
    macdPositiveColor?: string;

    /**
     * Options for customizing the BollingerBand in the indicator.
     * @default 'rgba(211,211,211,0.25)'
     */

    bandColor?: string;

    /**
     * Defines the appearance of the upper line in technical indicators
     */
    upperLine?: StockChartConnectorModel;

    /**
     * Defines the name of the series, the data of which has to be depicted as indicator
     * @default ''
     */
    seriesName?: string;

    /**
     * Defines the appearance of period line in technical indicators
     */

    periodLine?: StockChartConnectorModel;

    /**
     * Defines the appearance of lower line in technical indicators
     */

    lowerLine?: ConnectorModel;

    /**
     * The DataSource field that contains the high value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    high?: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    open?: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    low?: string;

    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators
     * @default ''
     */

    xName?: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators
     * @default ''
     */

    close?: string;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series
     * @default ''
     */

    pointColorMapping?: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators
     * @default ''
     */

    volume?: string;

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
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */

    dashArray?: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.
     * @default 1
     */

    width?: number;

    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.
     * @default null
     */
    query?: Query;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * @default ''
     */

    dataSource?: Object | DataManager;

}

/**
 * Interface for a class StockChartAxis
 */
export interface StockChartAxisModel {

    /**
     * Options to customize the crosshair ToolTip.
     */

    crosshairTooltip?: CrosshairTooltipModel;

    /**
     * Options to customize the axis label.
     */

    labelStyle?: StockChartFontModel;

    /**
     * Specifies the title of an axis.
     * @default ''
     */

    title?: string;

    /**
     * Options for customizing the axis title.
     */

    titleStyle?: StockChartFontModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */

    labelFormat?: string;

    /**
     * It specifies the type of format to be used in dateTime format process.
     * @default 'DateTime'
     */

    skeletonType?: SkeletonType;

    /**
     * Specifies the skeleton format in which the dateTime format will process.
     * @default ''
     */

    skeleton?: string;

    /**
     * Left and right padding for the plot area in pixels.
     * @default 0
     */

    plotOffset?: number;

    /**
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.
     * @default 10
     */
    logBase?: number;

    /**
     * Specifies the index of the row where the axis is associated, when the chart area is divided into multiple plot areas by using `rows`.
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
     *      }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default 0
     */

    rowIndex?: number;

    /**
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.
     * @default 1
     */

    span?: number;

    /**
     * The maximum number of label count per 100 pixels with respect to the axis length.
     * @default 3
     */

    maximumLabels?: number;

    /**
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.
     * @default null
     * @aspDefaultValueIgnore
     */

    desiredIntervals?: number;

    /**
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
     * @default 1
     */

    zoomFactor?: number;

    /**
     * Position of the zoomed axis. Value ranges from 0 to 1.
     * @default 0
     */

    zoomPosition?: number;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */

    opposedPosition?: boolean;

    /**
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.
     * @default true
     */

    enableAutoIntervalOnZooming?: boolean;

    /**
     * Specifies the type of data the axis is handling.
     * * Double:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.
     * * Logarithmic: Renders a log axis.
     * @default 'Double'
     * @blazorType Syncfusion.EJ2.Blazor.Charts.ValueType
     * @isEnumeration true
     */

    valueType?: ValueType;

    /**
     * Specifies the padding for the axis range in terms of interval.They are,
     * * none: Padding cannot be applied to the axis.
     * * normal: Padding is applied to the axis based on the range calculation.
     * * additional: Interval of the axis is added as padding to the minimum and maximum values of the range.
     * * round: Axis range is rounded to the nearest possible value divided by the interval.
     * @default 'Auto'
     */

    rangePadding?: ChartRangePadding;

    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * * Shift: Shifts the edge labels.
     * @default 'None'
     */

    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * betweenTicks: Renders the label between the ticks.
     * * onTicks: Renders the label on the ticks.
     * @default 'BetweenTicks'
     */

    labelPlacement?: LabelPlacement;

    /**
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes`, `Seconds` in date time axis.They are,
     * * Auto: Defines the interval of the axis based on data.
     * * Years: Defines the interval of the axis in years.
     * * Months: Defines the interval of the axis in months.
     * * Days: Defines the interval of the axis in days.
     * * Hours: Defines the interval of the axis in hours.
     * * Minutes: Defines the interval of the axis in minutes.
     * @default 'Auto'
     */

    intervalType?: IntervalType;

    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * inside: Renders the ticks inside to the axis line.
     * * outside: Renders the ticks outside to the axis line.
     * @default 'Outside'
     */

    tickPosition?: AxisPosition;

    /**
     * Unique identifier of an axis.
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.
     * @default ''
     */

    name?: string;

    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * inside: Renders the labels inside to the axis line.
     * * outside: Renders the labels outside to the axis line.
     * @default 'Outside'
     */

    labelPosition?: AxisPosition;

    /**
     * If set to true, axis label will be visible.
     * @default true
     */

    visible?: boolean;

    /**
     * The angle to which the axis label gets rotated.
     * @default 0
     */

    labelRotation?: number;

    /**
     * Specifies the number of minor ticks per interval.
     * @default 0
     */

    minorTicksPerInterval?: number;

    /**
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.
     * @default null
     */

    crossesAt?: Object;

    /**
     * Specifies axis name with which the axis line has to be crossed
     * @default null
     */

    crossesInAxis?: string;

    /**
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line
     * @default true
     */

    placeNextToAxisLine?: boolean;

    /**
     * Specifies the minimum range of an axis.
     * @default null
     */

    minimum?: Object;

    /**
     * Specifies the interval for an axis.
     * @default null
     * @aspDefaultValueIgnore
     */

    interval?: number;

    /**
     * Specifies the maximum range of an axis.
     * @default null
     */

    maximum?: Object;

    /**
     * Specifies the maximum width of an axis label.
     * @default 34.
     */
    maximumLabelWidth?: number;

    /**
     * Options for customizing major tick lines.
     */

    majorTickLines?: MajorTickLinesModel;

    /**
     * Specifies the Trim property for an axis.
     * @default false
     */
    enableTrim?: boolean;

    /**
     * Options for customizing minor tick lines.
     */

    minorTickLines?: MinorTickLinesModel;

    /**
     * Options for customizing minor grid lines.
     */

    minorGridLines?: MinorGridLinesModel;

    /**
     * Options for customizing major grid lines.
     */

    majorGridLines?: MajorGridLinesModel;

    /**
     * Options for customizing axis lines.
     */

    lineStyle?: AxisLineModel;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.
     * @default false
     */
    isInversed?: boolean;

    /**
     * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.
     * @default Hide
     */

    labelIntersectAction?: LabelIntersectAction;

    /**
     * The polar radar radius position.
     * @default 100
     */

    coefficient?: number;

    /**
     * The start angle for the series.
     * @default 0
     */

    startAngle?: number;

    /**
     * TabIndex value for the axis.
     * @default 2
     */
    tabIndex?: number;

    /**
     * Specifies the stripLine collection for the axis
     */
    stripLines?: StockChartStripLineSettingsModel[];

    /**
     * Description for axis and its element.
     * @default null
     */
    description?: string;

}

/**
 * Interface for a class StockChartRow
 */
export interface StockChartRowModel {

    /**
     * The height of the row as a string accept input both as '100px' and '100%'.
     * If specified as '100%, row renders to the full height of its chart.
     * @default '100%'
     */

    height?: string;

    /**
     * Options to customize the border of the rows.
     */

    border?: StockChartBorderModel;

}

/**
 * Interface for a class StockChartTrendline
 */
export interface StockChartTrendlineModel {

    /**
     * Defines the period, the price changes over which will be considered to predict moving average trend line
     * @default 2
     */
    period?: number;

    /**
     * Defines the name of trendline
     * @default ''
     */
    name?: string;

    /**
     * Defines the type of the trendline
     * @default 'Linear'
     */
    type?: TrendlineTypes;

    /**
     * Defines the polynomial order of the polynomial trendline
     * @default 2
     */
    polynomialOrder?: number;

    /**
     * Defines the period, by which the trend has to forward forecast
     * @default 0
     */
    forwardForecast?: number;

    /**
     * Defines the period, by which the trend has to backward forecast
     * @default 0
     */
    backwardForecast?: number;

    /**
     * Options to customize the animation for trendlines
     */
    animation?: AnimationModel;

    /**
     * Enables/disables tooltip for trendlines
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Options to customize the marker for trendlines
     */
    marker?: MarkerSettingsModel;

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
     * Sets the legend shape of the trendline
     * @default 'SeriesType'
     */
    legendShape?: LegendShape;

    /**
     * Defines the width of the trendline
     * @default 1
     */
    width?: number;

}

/**
 * Interface for a class StockChartAnnotationSettings
 */
export interface StockChartAnnotationSettingsModel {

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate
     * @default '0'
     */
    y?: string | number;

    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate
     * @default '0'
     */
    x?: string | Date | number;

    /**
     * Content of the annotation, which accepts the id of the custom element.
     * @default null
     */
    content?: string;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.
     * @default 'Chart'
     */

    region?: Regions;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as left side.
     * * Far - Align the annotation element as right side.
     * * Center - Align the annotation element as mid point.
     * @default 'Center'
     */

    horizontalAlignment?: Alignment;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.
     * @default 'Pixel'
     */

    coordinateUnits?: Units;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.
     * @default 'Middle'
     */

    verticalAlignment?: Position;

    /**
     * The name of vertical axis associated with the annotation.
     * It requires `axes` of chart.
     * @default null
     */

    yAxisName?: string;

    /**
     * Information about annotation for assistive technology.
     * @default null
     */
    description?: string;

    /**
     * The name of horizontal axis associated with the annotation.
     * It requires `axes` of chart.
     * @default null
     */

    xAxisName?: string;

}

/**
 * Interface for a class StockChartIndexes
 */
export interface StockChartIndexesModel {

    /**
     * Specifies index of point
     * @default 0
     * @aspType int
     */
    point?: number;

    /**
     * Specifies index of series
     * @default 0
     * @aspType int
     */
    series?: number;

}

/**
 * Interface for a class StockEventsSettings
 */
export interface StockEventsSettingsModel {

    /**
     * Specifies type of stock events
     * * Circle 
     * * Square
     * * Flag
     * * Text
     * * Sign
     * * Triangle
     * * InvertedTriangle
     * * ArrowUp
     * * ArrowDown
     * * ArrowLeft
     * * ArrowRight
     * @default 'Circle'
     */
    type?: FlagType;

    /**
     * Specifies the text for the stock chart text.
     */
    text?: string;

    /**
     * Specifies the description for the chart which renders in tooltip for stock event.
     */
    description?: string;

    /**
     * Date value of stock event in which stock event shows.
     */
    date?: Date;

    /**
     * Options to customize the border of the stock events.
     */
    border?: StockChartBorderModel;

    /**
     * The background of the stock event that accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    background?: string;

    /**
     * Enables the stock events to be render on series. If it disabled, stock event rendered on primaryXAxis.
     * @default true
     */
    showOnSeries?: boolean;

    /**
     * Corresponding values in which stock event placed.
     * * Close
     * * Open
     * * High
     * * Close
     * @default 'close'
     */
    placeAt?: string;

    /**
     * Options to customize the styles for stock events text.
     */
    textStyle?: StockChartFontModel;

    /**
     * To render stock events in particular series.
     * By default stock events will render for all series.
     * @default []
     */

    seriesIndexes?: number[];

}