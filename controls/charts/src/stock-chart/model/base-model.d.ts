import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';import { DataManager, Query} from '@syncfusion/ej2-data';import { MarkerSettings, Trendline } from '../../chart/series/chart-series';import { MarkerSettingsModel, TrendlineModel } from '../../chart/series/chart-series-model';import { StockChart } from '../stock-chart';import { ChartSeriesType, EmptyPointMode, TechnicalIndicators, MacdType, FinancialDataFields } from '../../chart/utils/enum';import { Anchor, ZIndex, SizeType, LabelIntersectAction, LabelPlacement, AxisPosition, IntervalType } from '../../chart/utils/enum';import { SkeletonType, ChartRangePadding, EdgeLabelPlacement, ValueType, LegendShape, TrendlineTypes } from '../../chart/utils/enum';import { MajorGridLinesModel, MajorTickLinesModel, CrosshairTooltipModel, AxisLineModel } from '../../chart/axis/axis-model';import { MinorGridLinesModel, MinorTickLinesModel } from '../../chart/axis/axis-model';import { MajorGridLines, MajorTickLines, MinorTickLines, MinorGridLines, CrosshairTooltip, AxisLine } from '../../chart/axis/axis';import { ConnectorType } from '../../accumulation-chart/model/enum';import { CornerRadius } from '../../common/model/base';import { TextOverflow, Alignment, Regions, Units, Position, FlagType } from '../../common/utils/enum';import { Theme } from '../../common/model/theme';import { AnimationModel, CornerRadiusModel, EmptyPointSettingsModel, ConnectorModel } from '../../index';

/**
 * Interface for a class StockChartFont
 */
export interface StockChartFontModel {

    /**
     * Color for the text.

     */
    color?: string;

    /**
     * Font size for the text.

     */
    size?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * FontStyle for the text.

     */
    fontStyle?: string;

    /**
     * FontWeight for the text.

     */
    fontWeight?: string;

    /**
     * Opacity for the text.

     */
    opacity?: number;

    /**
     * Specifies the chart title text overflow

     */
    textOverflow?: TextOverflow;

    /**
     * text alignment

     */
    textAlignment?: Alignment;

}

/**
 * Interface for a class StockChartBorder
 */
export interface StockChartBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color?: string;

    /**
     * The width of the border in pixels.

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

     */
    background?: string;

    /**
     * The opacity for background.

     */
    opacity?: number;

}

/**
 * Interface for a class StockMargin
 */
export interface StockMarginModel {

    /**
     * Left margin in pixels.

     */
    left?: number;

    /**
     * Right margin in pixels.

     */
    right?: number;

    /**
     * Top margin in pixels.

     */
    top?: number;

    /**
     * Bottom margin in pixels.

     */
    bottom?: number;

}

/**
 * Interface for a class StockChartStripLineSettings
 */
export interface StockChartStripLineSettingsModel {

    /**
     *  If set true, strip line get render from axis origin.

     */
    startFromAxis?: boolean;

    /**
     * If set true, strip line for axis renders.

     */
    visible?: boolean;

    /**
     * Start value of the strip line.


     */
    start?: number | Date;

    /**
     * Color of the strip line.

     */
    color?: string;

    /**
     * End value of the strip line.


     */
    end?: number | Date;

    /**
     * Size of the strip line, when it starts from the origin.


     */
    size?: number;

    /**
     * Size type of the strip line

     */
    sizeType?: SizeType;

    /**
     * Dash Array of the strip line.


     */
    dashArray?: string;

    /**
     * isRepeat value of the strip line.


     */
    isRepeat?: boolean;

    /**
     * repeatEvery value of the strip line.


     */
    repeatEvery?: number | Date;

    /**
     * isSegmented value of the strip line


     */
    isSegmented?: boolean;

    /**
     * repeatUntil value of the strip line.


     */
    repeatUntil?: number | Date;

    /**
     * segmentStart value of the strip line.


     */
    segmentStart?: number | Date;

    /**
     * segmentAxisName of the strip line.


     */
    segmentAxisName?: string;

    /**
     * segmentEnd value of the strip line.


     */
    segmentEnd?: number | Date;

    /**
     * Strip line Opacity

     */
    opacity?: number;

    /**
     * Strip line text.

     */
    text?: string;

    /**
     * Border of the strip line.
     */
    border?: StockChartBorderModel;

    /**
     * The angle to which the strip line text gets rotated.


     */
    rotation?: number;

    /**
     * Specifies the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.

     */
    zIndex?: ZIndex;

    /**
     * Defines the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.

     */
    horizontalAlignment?: Anchor;

    /**
     * Defines the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.

     */
    verticalAlignment?: Anchor;

    /**
     * Options to customize the strip line text.
     */
    textStyle?: StockChartFontModel;

    /**
     * The option to delay animation of the series.

     */

    delay?: number;

    /**
     * If set to true, series gets animated on initial loading.

     */

    enable?: boolean;

    /**
     * The duration of animation in milliseconds.

     */

    duration?: number;

}

/**
 * Interface for a class StockEmptyPointSettings
 */
export interface StockEmptyPointSettingsModel {

    /**
     * To customize the fill color of empty points.

     */
    fill?: string;

    /**
     * To customize the mode of empty points.

     */
    mode?: EmptyPointMode;

    /**
     * Options to customize the border of empty points.

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

     */
    type?: ConnectorType;

    /**
     * Length of the connector line in pixels.

     */
    length?: string;

    /**
     * Color of the connector line.

     */
    color?: string;

    /**
     * dashArray of the connector line.

     */
    dashArray?: string;

    /**
     * Width of the connector line in pixels.

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

     */

    xName?: string;

    /**
     * The DataSource field that contains the y value.

     */

    yName?: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators

     */

    open?: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators

     */

    close?: string;

    /**
     * The DataSource field that contains the high value of y
     * It is applicable for series and technical indicators

     */

    high?: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators

     */

    low?: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators

     */

    volume?: string;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series

     */

    pointColorMapping?: string;

    /**
     * Options to customizing animation for the series.
     */

    animation?: AnimationModel;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators

     */

    xAxisName?: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators

     */

    yAxisName?: string;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.

     */

    fill?: string;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

     */

    dashArray?: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.

     */

    width?: number;

    /**
     * The name of the series visible in legend.

     */

    name?: string;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.

     */

    dataSource?: Object | DataManager;

    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.

     */
    query?: Query;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is higher than the closing price.

     */

    bullFillColor?: string;

    /**
     * This property is used in stock charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is less than the closing price.

     */

    bearFillColor?: string;

    /**
     * This property is applicable for candle series.
     * It enables/disables to visually compare the current values with the previous values in stock.

     */
    enableSolidCandles?: boolean;

    /**
     * Specifies the visibility of series.

     */

    visible?: boolean;

    /**
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */

    border?: StockChartBorderModel;

    /**
     * The opacity of the series.

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

     */
    enableTooltip?: boolean;

    /**
     * The provided value will be considered as a Tooltip name 

     */
    tooltipMappingName?: string;

    /**
     * Custom style for the selected series or points.

     */
    selectionStyle?: string;

    /**
     * It defines tension of cardinal spline types

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


     */
    columnWidth?: number;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.

     */
    columnSpacing?: number;

}

/**
 * Interface for a class StockChartIndicator
 */
export interface StockChartIndicatorModel {

    /**
     * Defines the type of the technical indicator

     */
    type?: TechnicalIndicators;

    /**
     * Defines the period, the price changes over which will be considered to predict the trend

     */
    period?: number;

    /**
     * Defines the period, the price changes over which will define the %D value in stochastic indicators

     */
    dPeriod?: number;

    /**
     * Defines the look back period, the price changes over which will define the %K value in stochastic indicators

     */
    kPeriod?: number;

    /**
     * Defines the over-bought(threshold) values. It is applicable for RSI and stochastic indicators

     */
    overBought?: number;

    /**
     * Defines the over-sold(threshold) values. It is applicable for RSI and stochastic indicators

     */
    overSold?: number;

    /**
     * Defines the field to compare the current value with previous values

     */
    field?: FinancialDataFields;

    /**
     * Sets the standard deviation values that helps to define the upper and lower bollinger bands

     */
    standardDeviation?: number;

    /**
     * Sets the slow period to define the Macd line

     */
    slowPeriod?: number;

    /**
     * Enables/Disables the over-bought and over-sold regions

     */
    showZones?: boolean;

    /**
     * Sets the fast period to define the Macd line

     */
    fastPeriod?: number;

    /**
     * Defines the appearance of the the MacdLine of Macd indicator

     */
    macdLine?: StockChartConnectorModel;

    /**
     * Defines the type of the Macd indicator.

     */
    macdType?: MacdType;

    /**
     * Defines the color of the negative bars in Macd indicators

     */
    macdNegativeColor?: string;

    /**
     * Defines the color of the positive bars in Macd indicators

     */
    macdPositiveColor?: string;

    /**
     * Options for customizing the BollingerBand in the indicator.

     */

    bandColor?: string;

    /**
     * Defines the appearance of the upper line in technical indicators
     */
    upperLine?: StockChartConnectorModel;

    /**
     * Defines the name of the series, the data of which has to be depicted as indicator

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

     */

    high?: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators

     */

    open?: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators

     */

    low?: string;

    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators

     */

    xName?: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators

     */

    close?: string;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series

     */

    pointColorMapping?: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators

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

     */

    xAxisName?: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * ```html
     * <div id='Chart'></div>
     * ```

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

     */

    fill?: string;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

     */

    dashArray?: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.

     */

    width?: number;

    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.

     */
    query?: Query;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```

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

     */

    title?: string;

    /**
     * Options for customizing the axis title.
     */

    titleStyle?: StockChartFontModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.

     */

    labelFormat?: string;

    /**
     * It specifies the type of format to be used in dateTime format process.

     */

    skeletonType?: SkeletonType;

    /**
     * Specifies the skeleton format in which the dateTime format will process.

     */

    skeleton?: string;

    /**
     * Left and right padding for the plot area in pixels.

     */

    plotOffset?: number;

    /**
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.

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

     */

    rowIndex?: number;

    /**
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.

     */

    span?: number;

    /**
     * The maximum number of label count per 100 pixels with respect to the axis length.

     */

    maximumLabels?: number;

    /**
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.


     */

    desiredIntervals?: number;

    /**
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.

     */

    zoomFactor?: number;

    /**
     * Position of the zoomed axis. Value ranges from 0 to 1.

     */

    zoomPosition?: number;

    /**
     * If set to true, the axis will render at the opposite side of its default position.

     */

    opposedPosition?: boolean;

    /**
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.

     */

    enableAutoIntervalOnZooming?: boolean;

    /**
     * Specifies the type of data the axis is handling.
     * * Double:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.
     * * Logarithmic: Renders a log axis.



     */

    valueType?: ValueType;

    /**
     * Specifies the padding for the axis range in terms of interval.They are,
     * * none: Padding cannot be applied to the axis.
     * * normal: Padding is applied to the axis based on the range calculation.
     * * additional: Interval of the axis is added as padding to the minimum and maximum values of the range.
     * * round: Axis range is rounded to the nearest possible value divided by the interval.

     */

    rangePadding?: ChartRangePadding;

    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * * Shift: Shifts the edge labels.

     */

    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * betweenTicks: Renders the label between the ticks.
     * * onTicks: Renders the label on the ticks.

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

     */

    intervalType?: IntervalType;

    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * inside: Renders the ticks inside to the axis line.
     * * outside: Renders the ticks outside to the axis line.

     */

    tickPosition?: AxisPosition;

    /**
     * Unique identifier of an axis.
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.

     */

    name?: string;

    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * inside: Renders the labels inside to the axis line.
     * * outside: Renders the labels outside to the axis line.

     */

    labelPosition?: AxisPosition;

    /**
     * If set to true, axis label will be visible.

     */

    visible?: boolean;

    /**
     * The angle to which the axis label gets rotated.

     */

    labelRotation?: number;

    /**
     * Specifies the number of minor ticks per interval.

     */

    minorTicksPerInterval?: number;

    /**
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.

     */

    crossesAt?: Object;

    /**
     * Specifies axis name with which the axis line has to be crossed

     */

    crossesInAxis?: string;

    /**
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line

     */

    placeNextToAxisLine?: boolean;

    /**
     * Specifies the minimum range of an axis.

     */

    minimum?: Object;

    /**
     * Specifies the interval for an axis.


     */

    interval?: number;

    /**
     * Specifies the maximum range of an axis.

     */

    maximum?: Object;

    /**
     * Specifies the maximum width of an axis label.

     */
    maximumLabelWidth?: number;

    /**
     * Options for customizing major tick lines.
     */

    majorTickLines?: MajorTickLinesModel;

    /**
     * Specifies the Trim property for an axis.

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

     */
    isInversed?: boolean;

    /**
     * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.

     */

    labelIntersectAction?: LabelIntersectAction;

    /**
     * The polar radar radius position.

     */

    coefficient?: number;

    /**
     * The start angle for the series.

     */

    startAngle?: number;

    /**
     * TabIndex value for the axis.

     */
    tabIndex?: number;

    /**
     * Specifies the stripLine collection for the axis
     */
    stripLines?: StockChartStripLineSettingsModel[];

    /**
     * Description for axis and its element.

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

     */
    period?: number;

    /**
     * Defines the name of trendline

     */
    name?: string;

    /**
     * Defines the type of the trendline

     */
    type?: TrendlineTypes;

    /**
     * Defines the polynomial order of the polynomial trendline

     */
    polynomialOrder?: number;

    /**
     * Defines the period, by which the trend has to forward forecast

     */
    forwardForecast?: number;

    /**
     * Defines the period, by which the trend has to backward forecast

     */
    backwardForecast?: number;

    /**
     * Options to customize the animation for trendlines
     */
    animation?: AnimationModel;

    /**
     * Enables/disables tooltip for trendlines

     */
    enableTooltip?: boolean;

    /**
     * Options to customize the marker for trendlines
     */
    marker?: MarkerSettingsModel;

    /**
     * Defines the intercept of the trendline


     */
    intercept?: number;

    /**
     * Defines the fill color of trendline

     */
    fill?: string;

    /**
     * Sets the legend shape of the trendline

     */
    legendShape?: LegendShape;

    /**
     * Defines the width of the trendline

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

     */
    y?: string | number;

    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    x?: string | Date | number;

    /**
     * Content of the annotation, which accepts the id of the custom element.

     */
    content?: string;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.

     */

    region?: Regions;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as left side.
     * * Far - Align the annotation element as right side.
     * * Center - Align the annotation element as mid point.

     */

    horizontalAlignment?: Alignment;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.

     */

    coordinateUnits?: Units;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.

     */

    verticalAlignment?: Position;

    /**
     * The name of vertical axis associated with the annotation.
     * It requires `axes` of chart.

     */

    yAxisName?: string;

    /**
     * Information about annotation for assistive technology.

     */
    description?: string;

    /**
     * The name of horizontal axis associated with the annotation.
     * It requires `axes` of chart.

     */

    xAxisName?: string;

}

/**
 * Interface for a class StockChartIndexes
 */
export interface StockChartIndexesModel {

    /**
     * Specifies index of point


     */
    point?: number;

    /**
     * Specifies index of series


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

     */
    background?: string;

    /**
     * Enables the stock events to be render on series. If it disabled, stock event rendered on primaryXAxis.

     */
    showOnSeries?: boolean;

    /**
     * Corresponding values in which stock event placed.
     * * Close
     * * Open
     * * High
     * * Close

     */
    placeAt?: string;

    /**
     * Options to customize the styles for stock events text.
     */
    textStyle?: StockChartFontModel;

}