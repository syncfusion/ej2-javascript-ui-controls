/**
 * Defines area type of chart. They are
 * * none
 * * cartesianAxes
 * * polarAxes
 *
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
 *
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
 * Defines the segment axis. They are:
 * * X - Segment calculation rendered based on the horizontal axis.
 * * Y - Segment calculation rendered based on the vertical axis.
 */
export type Segment =
    /** Segment calculation rendered based on horizontal axis */
    'X' |
    /** Segment calculation rendered based on verticalal axis */
    'Y';

/**
 * Defines the unit of strip line size. They are:
 * * Auto - In numeric axis, it will consider a number and DateTime axis, it will consider as milliseconds.
 * * Pixel - The stripline gets their size in pixel.
 * * Year - The stripline size is based on year in the DateTime axis.
 * * Month - The stripline size is based on month in the DateTime axis.
 * * Day - The stripline size is based on day in the DateTime axis.
 * * Hour - The stripline size is based on hour in the DateTime axis.
 * * Minutes - The stripline size is based on minutes in the DateTime axis.
 * * Seconds - The stripline size is based on seconds in the DateTime axis.
 */
export type SizeType =
    /**  Auto - In numeric axis, it will consider a number and DateTime axis, it will consider as milliseconds. */
    'Auto' |
    /**  Pixel - The stripline gets their size in pixel */
    'Pixel' |
    /**  Years - The stripline size is based on year in the DateTime axis. */
    'Years' |
    /**  Months - The stripline size is based on month in the DateTime axis. */
    'Months' |
    /**  Days - The stripline size is based on day in the DateTime axis. */
    'Days' |
    /**  Hours - The striplinee size is based on hour in the DateTime axis. */
    'Hours' |
    /**  Minutes - The stripline size is based on minutes in the DateTime axis. */
    'Minutes' |
    /**  Seconds - The stripline size is based on seconds in the DateTime axis. */
    'Seconds';

/**
 * Defines the type of series in chart. They are:
 * * Line - Renders the line series.
 * * Column - Renders the column series.
 * * Area - Renders the area series.
 * * Pie - Renders the pie series.
 * * Polar - Renders the polar series.
 * * Radar - Renders the radar series.
 * * Bar - Renders the stacking column series
 * * Histogram - Renders the histogram series
 * * StackingColumn - Renders the stacking column series.
 * * StackingArea - Renders the stacking area series.
 * * StackingLine - Renders the stacking line series.
 * * StackingBar - Renders the stacking bar series.
 * * StackingColumn100 - Renders the stacking column series.
 * * StackingArea100 - Renders the stacking area 100 percent series
 * * StackingLine100 - Renders the stacking line 100 percent series.
 * * StackingBar100 - Renders the stacking bar 100 percent series.
 * * StepLine -  Renders the step line series.
 * * StepArea -  Renders the step area series.
 * * Scatter - Renders the scatter series.
 * * Spline - Renders the spline series
 * * RangeColumn - Renders the rangeColumn series.
 * * Hilo - Renders the hilo series
 * * HiloOpenClose - Renders the HiloOpenClose series
 * * Waterfall - Renders the Waterfall series
 * * RangeArea - Renders the rangeArea series.
 * * RangeStepArea - Renders the rangeStepArea series.
 * * Candle - Renders the candle series.
 * * SplineRangeArea - Renders the splineRangeArea series.
 * * BoxAndWhisker - Renders the Box and whisker series.
 * * MultiColoredLine - Renders the multi color line series.
 * * MultiColoredArea - Renders the multi color area series.
 * * Pareto- Renders the pareto series.
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
    /**  Define the StackingStepArea series. */
    'StackingStepArea' |
    /**  Define the StackingLine series. */
    'StackingLine' |
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
    /** Define the StackingLine100 series */
    'StackingLine100' |
    /** Define the StackingArea100 series */
    'StackingArea100' |
    /** Define the RangeColumn Series */
    'RangeColumn' |
    /** Define the RangeStepArea Series */
    'RangeStepArea' |
    /** Define the Hilo Series */
    'Hilo' |
    /** Define the HiloOpenClose Series */
    'HiloOpenClose' |
    /** Define the Waterfall Series */
    'Waterfall' |
    /** Define the RangeArea Series */
    'RangeArea' |
    /** Define the SplineRangeArea Series */
    'SplineRangeArea' |
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
 * Type of series to be drawn in radar or polar series. They are:
 * * Line - Renders the line series.
 * * Column - Renders the column series.
 * * Area - Renders the area series.
 * * Scatter - Renders the scatter series.
 * * Spline - Renders the spline series.
 * * StackingColumn - Renders the stacking column series.
 * * StackingArea - Renders the stacking area series.
 * * RangeColumn - Renders the range column series.
 * * SplineArea - Renders the spline area series.
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
    'StackingArea' |
    /** Define the Stacking line series */
    'StackingLine';

/**
 * Defines the shape of marker. They are:
 * * Circle - Renders a circle.
 * * Rectangle - Renders a rectangle.
 * * Triangle - Renders a triangle.
 * * Diamond - Renders a diamond.
 * * Cross - Renders a cross.
 * * Plus - Renders a Plus.
 * * HorizontalLine - Renders a horizontalLine.
 * * VerticalLine - Renders a verticalLine.
 * * Pentagon- Renders a pentagon.
 * * InvertedTriangle - Renders a invertedTriangle.
 * * Image - Renders a image.
 */
export type ChartShape =
    /** Specifies the shape of the marker as a circle symbol. */
    'Circle' |
    /** Specifies the shape of the marker as a Rectangle symbol. */
    'Rectangle' |
    /** Specifies the shape of the marker as a Triangle symbol. */
    'Triangle' |
    /** Specifies the shape of the marker as a Diamond symbol. */
    'Diamond' |
    /** Specifies the shape of the marker as a cross symbol. */
    'Cross' |
    /** Specifies the shape of the marker as a plus symbol. */
    'Plus' |
    /** Specifies the shape of the marker as a HorizontalLine symbol. */
    'HorizontalLine' |
    /** Specifies the shape of the marker as a VerticalLine symbol. */
    'VerticalLine' |
    /** Specifies the shape of the marker as a Pentagon symbol. */
    'Pentagon' |
    /** Specifies the shape of the marker as a InvertedTriangle symbol. */
    'InvertedTriangle' |
    /** Specifies the shape of the marker as a Image symbol. */
    'Image' |
    /** Specifies the shape of the marker as a Star symbol. */
    'Star' |
    /** Specifies the shape of the marker as a none */
    'None';

/**
 * Defines the type of the error bar. They are:
 * * Fixed -  Renders a fixed type error bar.
 * * Percentage - Renders a percentage type error bar.
 * * StandardDeviation - Renders a standard deviation type error bar.
 * * StandardError -Renders a standard error type error bar.
 * * Custom -Renders a custom type error bar.
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
 * Defines the direction of error bar. They are:
 * * Both - Renders the error bar in both directions.
 * * Minus - Renders the error bar in the negative direction.
 * * Plus - Renders the error bar in the positive direction.
 */
export type ErrorBarDirection =
    /** Define the Both direction. */
    'Both' |
    /** Define the Minus direction. */
    'Minus' |
    /** Define the Plus direction . */
    'Plus';

/**
 * Defines the modes of error bar. They are:
 * * Vertical -  Renders a vertical error bar.
 * * Horizontal - Renders a horizontal error bar.
 * * Both - Renders error bars on both sides.
 */
export type ErrorBarMode =
    /** Define the Vertical mode. */
    'Vertical' |
    /** Define the Horizontal mode. */
    'Horizontal' |
    /** Define the Both mode . */
    'Both';

/**
 * Defines the mode of line in crosshair. They are:
 * * None - Hides both the vertical and horizontal crosshair lines.
 * * Both - Shows both the vertical and horizontal crosshair lines.
 * * Vertical - Shows the vertical line.
 * * Horizontal - Shows the horizontal line.
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

/**
 * Defines the type of MACD indicator. The options are:
 * * Line - Displays only the MACD line and signal line.
 * * Histogram - Displays only the MACD histogram.
 * * Both - Displays the MACD line, signal line, and histogram.
 */
export type MacdType =
    /** Displays only the MACD line and signal line. */
    'Line' |
    /** Displays only the MACD histogram. */
    'Histogram' |
    /** Displays the MACD line, signal line, and histogram. */
    'Both';

/**
 * Defines the zooming mode. They are:
 * * X,Y - Chart will be zoomed with respect to both the vertical and horizontal axis.
 * * X - Chart will be zoomed with respect to the horizontal axis.
 * * Y - Chart will be zoomed with respect to the vertical axis.
 */
export type ZoomMode =
    /** Chart will be zoomed with respect to both vertical and horizontal axis. */
    'XY' |
    /** Chart will be zoomed with respect to horizontal axis. */
    'X' |
    /** Chart will be zoomed with respect to vertical axis. */
    'Y';

/**
 * Defines the zooming toolkit. They are:
 * * Zoom - Renders the zoom button.
 * * ZoomIn - Renders the zoomIn button.
 * * ZoomOut - Renders the zoomOut button.
 * * Pan - Renders the pan button.
 * * Reset - Renders the reset button.
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
 * Defines the Alignment. They are:
 * * None - Shows all the labels.
 * * Hide - Hide the label when it intersect.
 * * Rotate90 - Rotate the label to 90 degree when it intersect.
 */
export type DataLabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Hide the label when it intersect. It is also applicable for polar radar chart */
    'Hide' |
    /** Rotate the label to 90 degree when it intersect. */
    'Rotate90';

/**
 * Defines the position of the axis tick and labels. They are:
 * * Inside - Place the ticks or labels inside to the axis line.
 * * Outside - Place the ticks or labels outside to the axis line.
 */
export type AxisPosition =
    /** Place the ticks or labels inside to the axis line. */
    'Inside' |
    /** Place the ticks or labels outside to the axis line. */
    'Outside';

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
 * Defines the strip line text position. They are:
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
 * Defines the tooltip fade out mode of the chart. They are:
 * * Click - Used to remove the tooltip on click.
 * * Move - Used to remove the tooltip with some delay.
 */
export type FadeOutMode =
    /** Used to remove the tooltip on click  */
    'Click' |
    /** Used to remove the tooltip with some delay  */
    'Move';

/**
 * Defines the tooltip position. They are:
 * * Fixed - Place the tooltip in the fixed position.
 * * Nearest- Tooltip moves along with the mouse.
 */
export type TooltipPosition =
    /** Place the tooltip in the fixed position. */
    'Fixed' |
    /** Tooltip moves along with the mouse. */
    'Nearest';

/**
 * Defines the type of technical indicators. They are:
 * * Sma - Predicts the trend using simple moving average approach.
 * * Ema - Predicts the trend using exponential moving average approach.
 * * Tma - Predicts the trend using triangle moving average approach.
 * * Atr - Predicts the trend using average true range approach.
 * * AccumulationDistribution - Predicts the trend using accumulation distribution approach.
 * * Momentum - Predicts the trend using momentum approach.
 * * Rsi - Predicts the trend using RSI approach.
 * * Macd - Predicts the trend using moving average convergence divergence approach.
 * * Stochastic - Predicts the trend using stochastic approach.
 * * BollingerBands - Predicts the trend using bollinger approach.
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
 * Defines the type of trendlines. They are:
 * * Linear - Defines the linear trendline.
 * * Exponential - Defines the exponential trendline.
 * * Polynomial - Defines the polynomial trendline.
 * * Power - Defines the power trendline.
 * * Logarithmic - Defines the logarithmic trendline.
 * * MovingAverage - Defines the moving average trendline.
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
 * Defines the financial data fields. They are:
 * * High - Represents the highest price in the stocks over time.
 * * Low - Represents the lowest price in the stocks over time.
 * * Open - Represents the opening price in the stocks over time.
 * * Close - Represents the closing price in the stocks over time.
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
 * It defines type of spline. They are:
 * * Natural - Used to render a natural spline.
 * * Cardinal - Used to render a cardinal spline.
 * * Clamped - Used to render a clamped spline.
 * * Monotonic - Used to render a monotonic spline.
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
 * Defines the box plot mode for box and whisker chart series. They are:
 * * Exclusive - Series render based on exclusive mode.
 * * Inclusive - Series render based on inclusive mode.
 * * Normal - Series render based on normal mode.
 */
export type BoxPlotMode =
    /** Defines the Exclusive mode. */
    'Exclusive' |
    /** Defines the InClusive mode. */
    'Inclusive' |
    /** Defines the Normal mode. */
    'Normal';

/**
 * Defines the border type for multi level labels. They are:
 * * Rectangle - A rectangular border around the labels.
 * * Brace - A brace-style border around the labels.
 * * WithoutBorder - No border around the labels.
 * * WithoutTopBorder - No top border around the labels.
 * * WithoutTopandBottomBorder - No top and bottom borders around the labels.
 * * CurlyBrace - A curly brace-style border around the labels.
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

/**
 * Defines the mode of the legend in the chart. They are:
 * * Series - Render legend items based on visible series.
 * * Point - Render legend items based on points.
 * * Range - Render legend items based on range color mapping conditions.
 * * Gradient - Render legend items based on gradient color mapping conditions.
 */
export type LegendMode =
    /** Render legend items based on visible series */
    'Series' |
    /** Render legend items based on points  */
    'Point' |
    /** Render legend item based on range color mapping conditions */
    'Range' |
    /** Render legend items based on range color mapping conditions */
    'Gradient';

/**
 * Defines the position for the steps in the step line, step area, and step range area chart types. They are:
 * * Left: Steps start from the left side of the 2nd point.
 * * Center: Steps start between the data points.
 * * Right: Steps start from the right side of the 1st point.
 */
export type StepPosition =
    /** Steps start from the left side of the 2nd point.*/
    'Left' |
    /** Steps start from the right side of the 1st point.*/
    'Right' |
    /** Steps start between the data points.*/
    'Center';
