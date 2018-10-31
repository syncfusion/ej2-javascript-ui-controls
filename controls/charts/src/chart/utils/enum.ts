/**
 * Defines Orientation of axis. They are
 * * horizontal
 * * vertical
 * @private
 */
export type Orientation =
    /**  Horizontal Axis. */
    'Horizontal' |
    /**  Vertical Axis. */
    'Vertical';

/**
 * Defines area type of chart. They are
 * * none
 * * cartesianAxes
 * * polarAxes
 * @private
 */
export type ChartAreaType =
    /**  Cartesian panel. */
    'CartesianAxes' |
    /**  Polar panel. */
    'PolarAxes';

/**
 * Defines series type of chart. They are
 * * xy
 * * highLow
 * @private
 */
export type SeriesValueType =
    /**  XY value. */
    'XY' |
    /**  HighLow value. */
    'HighLow' |
    /**  HighLowOpenClose value. */
    'HighLowOpenClose' |
    /** BoxPlot */
    'BoxPlot';

/**
 * Defines the range padding of axis. They are
 * * none - Padding cannot be applied to the axis.
 * * normal - Padding is applied to the axis based on the range calculation.
 * * additional - Interval of the axis is added as padding to the minimum and maximum values of the range.
 * * round - Axis range is rounded to the nearest possible value divided by the interval.
 */
export type ChartRangePadding =
    /**  Padding Normal is applied for orientation vertical axis and None is applied for orientation horizontal axis */
    'Auto' |
    /**  Padding wiil not be applied to the axis. */
    'None' |
    /**  Padding is applied to the axis based on the range calculation. */
    'Normal' |
    /**  Interval of the axis is added as padding to the minimum and maximum values of the range. */
    'Additional' |
    /**  Axis range is rounded to the nearest possible value divided by the interval. */
    'Round';

/**
 * Defines the segment axis. They are,
 * * X - Segment calculation rendered based on horizontal axis
 * * Y - Segment calculation rendered based on vertical axis
 */
export type Segment =
    /** Segment calculation rendered based on horizontal axis */
    'X' |
    /** Segment calculation rendered based on verticalal axis */
    'Y';

/** 
 * Defines the unit of Stripline Size. They are
 * * auto
 * * pixel
 * * year
 * * month
 * * day
 * * hour
 * * minutes
 * * seconds
 * @private
 */
export type sizeType =
    /**  Auto - In numeric axis, it will consider a number and DateTime axis, it will consider as milliseconds. */
    'Auto' |
    /**  Pixel - The stripline gets their size in pixel */
    'Pixel' |
    /**  Years - The stipline size is based on year in the DateTime axis. */
    'Years' |
    /**  Months - The stipline size is based on month in the DateTime axis. */
    'Months' |
    /**  Days - The stipline size is based on day in the DateTime axis. */
    'Days' |
    /**  Hours - The stipline size is based on hour in the DateTime axis. */
    'Hours' |
    /**  Minutes - The stipline size is based on minutes in the DateTime axis. */
    'Minutes' |
    /**  Seconds - The stipline size is based on seconds in the DateTime axis. */
    'Seconds';

/**
 * Defines the type series in chart. They are
 * * line - Renders the line series.
 * * column - Renders the column series.
 * * area - Renders the area series.
 * * pie - Renders the pie series.
 * * polar - Renders the polar series.
 * * radar - Renders the radar series.
 * * bar - Renders the stacking column series
 * * histogram - Renders the histogram series
 * * stackingColumn - Renders the stacking column series.
 * * stackingArea - Renders the stacking area series
 * * stackingBar - Renders the stacking bar series.
 * * StackingColumn100 - Renders the stacking column series.
 * * StackingArea100 - Renders the stacking area 100 percent series
 * * StackingBar100 - Renders the stacking bar 100 percent series.
 * * stepLine -  Renders the step line series.
 * * stepArea -  Renders the step area series.
 * * scatter - Renders the scatter series.
 * * spline - Renders the spline series
 * * rangeColumn - Renders the rangeColumn series.
 * * hilo - Renders the hilo series
 * * hiloOpenClose - Renders the HiloOpenClose Series
 * * Waterfall - Renders the Waterfall Series
 * * rangeArea - Renders the rangeArea series.
 * * Pareto-Render the Pareto series
 */
export type ChartSeriesType =
    /**  Define the line series. */
    'Line' |
    /**  Define the Column series. */
    'Column' |
    /**  Define the Area series. */
    'Area' |
    /**  Define the Bar series. */
    'Bar' |
    /**  Define the Histogram series. */
    'Histogram' |
    /**  Define the StackingColumn series. */
    'StackingColumn' |
    /**  Define the StackingArea series. */
    'StackingArea' |
    /**  Define the StackingBar series. */
    'StackingBar' |
    /**  Define the Stepline series. */
    'StepLine' |
    /**  Define the Steparea series. */
    'StepArea' |
    /**  Define the Steparea series. */
    'SplineArea' |
    /**  Define the Scatter series. */
    'Scatter' |
    /**  Define the Spline series. */
    'Spline' |
    /** Define the StackingColumn100 series */
    'StackingColumn100' |
    /** Define the StackingBar100 series */
    'StackingBar100' |
    /** Define the StackingArea100 series */
    'StackingArea100' |
    /** Define the RangeColumn Series */
    'RangeColumn' |
    /** Define the Hilo Series */
    'Hilo' |
    /** Define the HiloOpenClose Series */
    'HiloOpenClose' |
    /** Define the Waterfall Series */
    'Waterfall' |
    /** Define the RangeArea Series */
    'RangeArea' |
    /** Define the Bubble Series */
    'Bubble' |
    /** Define the Candle Series */
    'Candle' |
    /** Define the polar series */
    'Polar' |
    /** Define the radar series */
    'Radar' |
    /** Define the Box and whisker Series */
    'BoxAndWhisker' |
    /** Define the multi color line series */
    'MultiColoredLine' |
    /** Define the multi color area series */
    'MultiColoredArea' |
    /** Define the Pareto series */
    'Pareto';

/**
 * * Type of series to be drawn in radar or polar series. They are
 * * line - Renders the line series.
 * * column - Renders the column series.
 * * area - Renders the area series.
 * * scatter - Renders the scatter series.
 * * spline - Renders the spline series.
 * * stackingColumn - Renders the stacking column series.
 * * stackingArea - Renders the stacking area series.
 * * rangeColumn - Renders the range column series.
 * * splineArea - Renders the spline area series.
 */
export type ChartDrawType =
    /**  Define the line series. */
    'Line' |
    /**  Define the Column series. */
    'Column' |
    /**  Define the stacking Column series. */
    'StackingColumn' |
    /**  Define the Area series. */
    'Area' |
    /**  Define the Scatter series. */
    'Scatter' |
    /** Define the Range column series */
    'RangeColumn' |
    /** Define the Spline series */
    'Spline' |
    /** Define the Spline Area series */
    'SplineArea' |
    /** Define the spline series */
    'StackingArea';

/**
 * Defines the Edge Label Placement for an axis. They are
 * * none - No action will be perform.
 * * hide - Edge label will be hidden.
 * * shift - Shift the edge labels.
 */

export type EdgeLabelPlacement =
    /**  Render the edge label in axis. */
    'None' |
    /**  Hides the edge label in axis. */
    'Hide' |
    /**  Shift the edge series in axis. */
    'Shift';

/**
 * Defines the Label Placement for category axis. They are
 * * betweenTicks - Render the label between the ticks.
 * * onTicks - Render the label on the ticks.
 */
export type LabelPlacement =
    /**  Render the label between the ticks. */
    'BetweenTicks' |
    /**  Render the label on the ticks. */
    'OnTicks';
/**
 * Defines the shape of marker. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon- Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 * * image - Renders a image.
 */
export type ChartShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a Image. */
    'Image';

/**
 * Defines the type of axis. They are
 * * double -  Renders a numeric axis.
 * * dateTime - Renders a dateTime axis.
 * * category - Renders a category axis.
 * * logarithmic - Renders a log axis.
 * * DateTimeCategory - Renders a datetime DateTimeCategory axis
 */
export type ValueType =
    /** Define the numeric axis. */
    'Double' |
    /** Define the DateTime axis. */
    'DateTime' |
    /** Define the Category axis . */
    'Category' |
    /** Define the Logarithmic axis . */
    'Logarithmic' |
    /** Define the datetime category axis */
    'DateTimeCategory';
/**
 * Defines the type of error bar. They are
 * * fixed -  Renders a fixed type error bar.
 * * percentage - Renders a percentage type error bar.
 * * standardDeviation - Renders a standard deviation type error bar.
 * * standardError -Renders a standard error type error bar.
 * * custom -Renders a custom type error bar.
 */
export type ErrorBarType =
    /** Define the Fixed type. */
    'Fixed' |
    /** Define the Percentage type. */
    'Percentage' |
    /** Define the StandardDeviation type . */
    'StandardDeviation' |
    /** Define the StandardError type . */
    'StandardError' |
    /** Define the Custom type . */
    'Custom';

/**
 * Defines the direction of error bar. They are
 * * both -  Renders both direction of error bar.
 * * minus - Renders minus direction of error bar.
 * * plus - Renders plus direction error bar.
 */
export type ErrorBarDirection =
    /** Define the Both direction. */
    'Both' |
    /** Define the Minus direction. */
    'Minus' |
    /** Define the Plus direction . */
    'Plus';

/**
 * Defines the modes of error bar. They are
 * * vertical -  Renders a vertical error bar.
 * * horizontal - Renders a horizontal error bar.
 * * both - Renders both side error bar.
 */
export type ErrorBarMode =
    /** Define the Vertical mode. */
    'Vertical' |
    /** Define the Horizontal mode. */
    'Horizontal' |
    /** Define the Both mode . */
    'Both';


/**
 * Defines the interval type of datetime axis. They are
 * * auto - Define the interval of the axis based on data.
 * * years - Define the interval of the axis in years.
 * * months - Define the interval of the axis in months.
 * * days - Define the interval of the axis in days.
 * * hours - Define the interval of the axis in hours.
 * * minutes - Define the interval of the axis in minutes.
 */
export type IntervalType =
    /** Define the interval of the axis based on data. */
    'Auto' |
    /** Define the interval of the axis in years. */
    'Years' |
    /** Define the interval of the axis in months. */
    'Months' |
    /** Define the interval of the axis in days. */
    'Days' |
    /** Define the interval of the axis in hours. */
    'Hours' |
    /** Define the interval of the axis in minutes. */
    'Minutes' |
    /** Define the interval of the axis in seconds. */
    'Seconds';

/**
 * Defines the mode of line in crosshair. They are
 * * none - Hides both vertical and horizontal crosshair line.
 * * both - Shows both vertical and horizontal crosshair line.
 * * vertical - Shows the vertical line.
 * * horizontal - Shows the horizontal line.
 */

export type LineType =
    /** Hides both vertical and horizontal crosshair line. */
    'None' |
    /** Shows both vertical and horizontal crosshair line. */
    'Both' |
    /** Shows the vertical line. */
    'Vertical' |
    /** Shows the horizontal line. */
    'Horizontal';

export type MacdType =
    'Line' |

    'Histogram' |

    'Both';

/**
 * Defines the position of the legend. They are
 * * auto - Places the legend based on area type.
 * * top - Displays the legend on the top of chart.
 * * left - Displays the legend on the left of chart.
 * * bottom - Displays the legend on the bottom of chart.
 * * right - Displays the legend on the right of chart.
 * * custom - Displays the legend  based on given x and y value.
 */

export type LegendPosition =
    /** Places the legend based on area type. */
    'Auto' |
    /** Places the legend on the top of chart. */
    'Top' |
    /** Places the legend on the left of chart. */
    'Left' |
    /** Places the legend on the bottom of chart. */
    'Bottom' |
    /** Places the legend on the right of chart. */
    'Right' |
    /** Places the legend based on given x and y. */
    'Custom';

/**
 * Defines the shape of legend. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon - Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 * * SeriesType -Render a legend shape based on series type.
 */
export type LegendShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a legend shape based on series type. */
    'SeriesType';

/**
 * Defines the zooming mode, They are.
 * * x,y - Chart will be zoomed with respect to both vertical and horizontal axis.
 * * x - Chart will be zoomed with respect to horizontal axis.
 * * y - Chart will be zoomed with respect to vertical axis.
 */
export type ZoomMode =
    /** Chart will be zoomed with respect to both vertical and horizontal axis. */
    'XY' |
    /** Chart will be zoomed with respect to horizontal axis. */
    'X' |
    /** Chart will be zoomed with respect to vertical axis. */
    'Y';

/**
 * Defines the ZoomingToolkit, They are.
 * * zoom - Renders the zoom button.
 * * zoomIn - Renders the zoomIn button.
 * * zoomOut - Renders the zoomOut button.
 * * pan - Renders the pan button.
 * * reset - Renders the reset button.
 */

export type ToolbarItems =
    /** Renders the zoom button. */
    'Zoom' |
    /** Renders the zoomIn button. */
    'ZoomIn' |
    /** Renders the zoomOut button. */
    'ZoomOut' |
    /** Renders the pan button. */
    'Pan' |
    /** Renders the reset button. */
    'Reset';

/**
 * Defines the SelectionMode, They are.
 * * none - Disable the selection.
 * * series - To select a series.
 * * point - To select a point.
 * * cluster - To select a cluster of point
 * * dragXY - To select points, by dragging with respect to both horizontal and vertical axis
 * * dragX - To select points, by dragging with respect to horizontal axis.
 * * dragY - To select points, by dragging with respect to vertical axis.
 */
export type SelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a series. */
    'Series' |
    /** To select a point. */
    'Point' |
    /** To select a cluster of point. */
    'Cluster' |
    /** To select points, by dragging with respect to both horizontal and vertical axis. */
    'DragXY' |
    /** To select points, by dragging with respect to vertical axis. */
    'DragY' |
    /** To select points, by dragging with respect to horizontal axis. */
    'DragX';

/**
 * Defines the LabelPosition, They are.
 * * outer - Position the label outside the point.
 * * top - Position the label on top of the point.
 * * bottom - Position the label on bottom of the point.
 * * middle - Position the label to middle of the point.
 * * auto - Position the label based on series.
 */
export type LabelPosition =
    /** Position the label outside the point. */
    'Outer' |
    /** Position the label on top of the point. */
    'Top' |
    /** Position the label on bottom of the point. */
    'Bottom' |
    /** Position the label to middle of the point. */
    'Middle' |
    /** Position the label based on series. */
    'Auto';

/**
 * Defines the Alignment. They are
 * * none - Shows all the labels.
 * * hide - Hide the label when it intersect.
 * * rotate45 - Rotate the label to 45 degree when it intersect.
 * * rotate90 - Rotate the label to 90 degree when it intersect.
 * *
 */
export type LabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Hide the label when it intersect. */
    'Hide' |
    /** Trim the label when it intersect. */
    'Trim' |
    /** Wrap the label when it intersect. */
    'Wrap' |
    /** Arrange the label in multiple row when it intersect. */
    'MultipleRows' |
    /** Rotate the label to 45 degree when it intersect. */
    'Rotate45' |
    /** Rotate the label to 90 degree when it intersect. */
    'Rotate90';

/**
 * Defines the Position. They are
 * * inside - Place the ticks or labels inside to the axis line.
 * * outside - Place the ticks or labels outside to the axis line.
 * *
 */
export type AxisPosition =
    /** Place the ticks or labels inside to the axis line. */
    'Inside' |
    /** Place the ticks or labels outside to the axis line. */
    'Outside';
/**
 * Defines Theme of the chart. They are
 * * Material - Render a chart with Material theme.
 * * Fabric - Render a chart with Fabric theme
 */
export type ChartTheme =
    /**  Render a chart with Material theme. */
    'Material' |
    /**  Render a chart with Fabric theme. */
    'Fabric' |
    /**  Render a chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a chart with Highcontrast theme. */
    'Highcontrast';
/**
 *  Specifies the order of the strip line. `Over` | `Behind`.
 * * Over - Places the strip line over the series elements.
 * * Behind - laces the strip line behind the series elements.
 */
export type ZIndex =
    /** Places the strip line over the series elements. */
    'Over' |
    /** Places the strip line behind the series elements. */
    'Behind';
/**
 * Defines the strip line text position.
 * * Start - Places the strip line text at the start.
 * * Middle - Places the strip line text in the middle.
 * * End - Places the strip line text at the end.
 */
export type Anchor =
    /** Places the strip line text at the start. */
    'Start' |
    /** Places the strip line text in the middle. */
    'Middle' |
    /** Places the strip line text at the end. */
    'End';
/**
 * Defines the empty point mode of the chart.
 * * Gap - Used to display empty points as space.
 * * Zero - Used to display empty points as zero.
 * * Drop - Used to ignore the empty point while rendering.
 * * Average - Used to display empty points as previous and next point average.
 */
export type EmptyPointMode =
    /** Used to display empty points as space  */
    'Gap' |
    /** Used to display empty points as zero  */
    'Zero' |
    /** Used to ignore the empty point while rendering  */
    'Drop' |
    /** Used to display empty points as previous and next point average  */
    'Average';

/**
 * Defines the type of technical indicators. They are
 * * Sma - Predicts the trend using Simple Moving Average approach
 * * Ema - Predicts the trend using Exponential Moving Average approach
 * * Tma - Predicts the trend using Triangle Moving Average approach
 * * Atr - Predicts the trend using Average True Range approach
 * * AccumulationDistribution - Predicts the trend using Accumulation Distribution approach
 * * Momentum - Predicts the trend using Momentum approach
 * * Rsi - Predicts the trend using RSI approach
 * * Macd - Predicts the trend using Moving Average Convergence Divergence approach
 * * Stochastic - Predicts the trend using Stochastic approach
 * * BollingerBands - Predicts the trend using Bollinger approach
 */
export type TechnicalIndicators =
    /** Predicts the trend using Simple Moving Average approach */
    'Sma' |
    /** Predicts the trend using Exponential Moving Average approach */
    'Ema' |
    /** Predicts the trend using Triangle Moving Average approach */
    'Tma' |
    /** Predicts the trend using Momentum approach */
    'Momentum' |
    /** Predicts the trend using Average True Range approach */
    'Atr' |
    /** Predicts the trend using Accumulation Distribution approach */
    'AccumulationDistribution' |
    /** Predicts the trend using Bollinger approach */
    'BollingerBands' |
    /** Predicts the trend using Moving Average Convergence Divergence approach */
    'Macd' |
    /** Predicts the trend using Stochastic approach */
    'Stochastic' |
    /** Predicts the trend using RSI approach */
    'Rsi';

/**
 * Defines the type of trendlines. They are
 * * Linear - Defines the linear trendline
 * * Exponential - Defines the exponential trendline
 * * Polynomial - Defines the polynomial trendline
 * * Power - Defines the power trendline
 * * Logarithmic - Defines the logarithmic trendline
 * * MovingAverage - Defines the moving average trendline
 */
export type TrendlineTypes =
    /** Defines the linear trendline */
    'Linear' |
    /** Defines the exponential trendline */
    'Exponential' |
    /** Defines the polynomial trendline */
    'Polynomial' |
    /** Defines the power trendline */
    'Power' |
    /** Defines the logarithmic trendline */
    'Logarithmic' |
    /** Defines the moving average trendline */
    'MovingAverage';

/**
 * Defines the financial data fields
 * * High - Represents the highest price in the stocks over time
 * * Low - Represents the lowest price in the stocks over time
 * * Open - Represents the opening price in the stocks over time
 * * Close - Represents the closing price in the stocks over time
 */
export type FinancialDataFields =
    /** Represents the highest price in the stocks over time */
    'High' |
    /** Represents the lowest price in the stocks over time */
    'Low' |
    /** Represents the opening price in the stocks over time */
    'Open' |
    /** Represents the closing price in the stocks over time */
    'Close';

/**
 * It defines type of spline.
 * Natural - Used to render Natural spline.
 * Cardinal - Used to render cardinal spline.
 * Clamped - Used to render Clamped spline
 * Monotonic - Used to render monotonic spline
 */
export type SplineType =
    /** Used to render natural spline type */
    'Natural' |
    /** Used to render Monotonicspline  */
    'Monotonic' |
    /** Used to render Cardinal */
    'Cardinal' |
    /** Used to render Clamped */
    'Clamped';
/**
 * Defines the BoxPlotMode for box and whisker chart series, They are.
 * * exclusive - Series render based on exclusive mode.
 * * inclusive - Series render based on inclusive mode.
 * * normal - Series render based on normal mode.
 */
export type BoxPlotMode =
    /** Defines the Exclusive mode. */
    'Exclusive' |
    /** Defines the InClusive mode. */
    'Inclusive' |
    /** Defines the Normal mode. */
    'Normal';
/**
 * Defines the skeleton type for the axis.
 * * Date - it formats date only.
 * * DateTime - it formats date and time.
 * * Time - it formats time only.
 */
export type SkeletonType =
    /** Used to format date */
    'Date' |
    /** Used to format date and time */
    'DateTime' |
    /** Used to format time */
    'Time';

/**
 * Defines border type for multi level labels.
 *  * Rectangle
 *  * Brace
 *  * WithoutBorder
 *  * Without top Border
 *  * Without top and bottom border
 *  * Curly brace
 */
export type BorderType =
    /** Rectangle */
    'Rectangle' |
    /** Brace */
    'Brace' |
    /** WithoutBorder */
    'WithoutBorder' |
    /** WithoutTopBorder */
    'WithoutTopBorder' |
    /** WithoutTopandBottomBorder */
    'WithoutTopandBottomBorder' |
    /** CurlyBrace */
    'CurlyBrace';