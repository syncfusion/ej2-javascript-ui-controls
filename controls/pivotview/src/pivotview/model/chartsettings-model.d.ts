import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';import { BorderModel, Border, ErrorBarSettingsModel, ErrorBarSettings, MarkerSettingsModel, LegendPosition } from '@syncfusion/ej2-charts';import { ChartDrawType, ChartShape, DataLabelSettingsModel, DataLabelSettings, ErrorBarCapSettingsModel } from '@syncfusion/ej2-charts';import { ErrorBarCapSettings, ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes } from '@syncfusion/ej2-charts';import { EmptyPointMode, TextOverflow, Alignment, ZIndex, Anchor, SizeType, BorderType, LineType } from '@syncfusion/ej2-charts';import { TrendlineModel, Trendline, LegendShape, SplineType, EmptyPointSettingsModel, EmptyPointSettings } from '@syncfusion/ej2-charts';import { CornerRadius, AnimationModel, ChartSegmentModel, ChartSegment, Segment, Animation, FontModel } from '@syncfusion/ej2-charts';import { EdgeLabelPlacement, LabelPlacement, AxisPosition, MajorTickLinesModel, MinorTickLinesModel } from '@syncfusion/ej2-charts';import { MinorGridLinesModel, AxisLineModel, LabelBorderModel, Theme, Font, MarginModel, Margin } from '@syncfusion/ej2-charts';import { ChartAreaModel, ChartArea, ChartTheme, CrosshairSettings, LegendSettingsModel, IndexesModel } from '@syncfusion/ej2-charts';import { Indexes, IResizeEventArgs, IPrintEventArgs, ILoadedEventArgs, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';import { IMouseEventArgs, IPointEventArgs, IDragCompleteEventArgs, IScrollEventArgs } from '@syncfusion/ej2-charts';import { LabelIntersectAction, ZoomMode, ToolbarItems, MajorTickLines, MinorTickLines, MajorGridLines } from '@syncfusion/ej2-charts';import { MarkerSettings, CornerRadiusModel, MajorGridLinesModel, StripLineSettingsModel } from '@syncfusion/ej2-charts';import { IAnimationCompleteEventArgs, IAxisLabelRenderEventArgs, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';import { MinorGridLines, AxisLine, StripLineSettings, LabelBorder, CrosshairTooltipModel } from '@syncfusion/ej2-charts';import { LocationModel, AccEmptyPointMode, ChartLocation } from '@syncfusion/ej2-charts';import { CrosshairTooltip, CrosshairSettingsModel } from '@syncfusion/ej2-charts';import { ChartSeriesType, ChartSelectionMode } from '../../common';

/**
 * Interface for a class PivotChartSeriesBorder
 */
export interface PivotChartSeriesBorderModel {

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
 * Interface for a class PivotChartSeriesAnimation
 */
export interface PivotChartSeriesAnimationModel {

    /**
      * If set to true, series gets animated on initial loading.

      */
    enable?: boolean;

    /**
      * The duration of animation in milliseconds.

      */
    duration?: number;

    /**
      * The option to delay animation of the series.

      */
    delay?: number;

}

/**
 * Interface for a class PivotChartSeriesSegment
 */
export interface PivotChartSeriesSegmentModel {

    /**
      * Defines the starting point of region.

      */
    value?: Object;

    /**
      * Defines the color of a region.

      */
    color?: string;

    /**
      * Defines the pattern of dashes and gaps to stroke.

      */
    dashArray?: string;

}

/**
 * Interface for a class PivotChartSeriesMarkerSettings
 * @private
 */
export interface PivotChartSeriesMarkerSettingsModel {

    /**
      * If set to true the marker for series is rendered. This is applicable only for line and area type series.

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


      */
    shape?: ChartShape;

    /**
      * The URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.

      */
    imageUrl?: string;

    /**
      * The height of the marker in pixels.

      */
    height?: number;

    /**
      * The width of the marker in pixels.

      */
    width?: number;

    /**
      * Options for customizing the border of a marker.
      */
    border?: BorderModel;

    /**
      * The fill color of the marker that accepts value in hex and rgba as a valid CSS color string. 
      * By default, it will take series' color.

      */
    fill?: string;

    /**
      * The opacity of the marker.

      */
    opacity?: number;

    /**
      * The data label for the series.
      */
    dataLabel?: DataLabelSettingsModel;

}

/**
 * Interface for a class PivotChartSeriesErrorSettings
 */
export interface PivotChartSeriesErrorSettingsModel {

    /**
      * If set true, error bar for data gets rendered.

      */
    visible?: boolean;

    /**
      * The type of the error bar . They are
      * * Fixed -  Renders a fixed type error bar.
      * * Percentage - Renders a percentage type error bar.
      * * StandardDeviation - Renders a standard deviation type error bar.
      * * StandardError -Renders a standard error type error bar.
      * * Custom -Renders a custom type error bar.


      */
    type?: ErrorBarType;

    /**
      * The direction of the error bar . They are
      * * both -  Renders both direction of error bar.
      * * minus - Renders minus direction of error bar.
      * * plus - Renders plus direction error bar.


      */
    direction?: ErrorBarDirection;

    /**
      * The mode of the error bar . They are
      * * Vertical -  Renders a vertical error bar.
      * * Horizontal - Renders a horizontal error bar.
      * * Both - Renders both side error bar.


      */
    mode?: ErrorBarMode;

    /**
      *  The color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.

      */
    color?: string;

    /**
      * The vertical error of the error bar.

      */
    verticalError?: number;

    /**
      * The stroke width of the error bar..

      */
    width?: number;

    /**
      * The horizontal error of the error bar.

      */
    horizontalError?: number;

    /**
      * The vertical positive error of the error bar.

      */
    verticalPositiveError?: number;

    /**
      * The vertical negative error of the error bar.

      */
    verticalNegativeError?: number;

    /**
      * The horizontal positive error of the error bar.

      */
    horizontalPositiveError?: number;

    /**
      * The horizontal negative error of the error bar.

      */
    horizontalNegativeError?: number;

    /**
      * Options for customizing the cap of the error bar.
      */
    errorBarCap?: ErrorBarCapSettingsModel;

}

/**
 * Interface for a class PivotChartSeriesTrendline
 */
export interface PivotChartSeriesTrendlineModel {

    /**
      * Defines the name of trendline

      */
    name?: string;

    /**
      * Defines the type of the trendline


      */
    type?: TrendlineTypes;

    /**
      * Defines the period, the price changes over which will be considered to predict moving average trend line

      */
    period?: number;

    /**
      * Defines the polynomial order of the polynomial trendline

      */
    polynomialOrder?: number;

    /**
      * Defines the period, by which the trend has to backward forecast

      */
    backwardForecast?: number;

    /**
      * Defines the period, by which the trend has to forward forecast

      */
    forwardForecast?: number;

    /**
      * Options to customize the animation for trendlines
      */
    animation?: AnimationModel;

    /**
      * Options to customize the marker for trendlines
      */
    marker?: MarkerSettingsModel;

    /**
      * Enables/disables tooltip for trendlines

      */
    enableTooltip?: boolean;

    /**
      * Defines the intercept of the trendline



      */
    intercept?: number;

    /**
      * Defines the fill color of trendline

      */
    fill?: string;

    /**
      * Defines the width of the trendline

      */
    width?: number;

    /**
      * Sets the legend shape of the trendline


      */
    legendShape?: LegendShape;

}

/**
 * Interface for a class PivotChartSeriesEmptyPointSettings
 */
export interface PivotChartSeriesEmptyPointSettingsModel {

    /**
      * To customize the fill color of empty points.

      */
    fill?: string;

    /**
      * Options to customize the border of empty points.

      */
    border?: BorderModel;

    /**
      * To customize the mode of empty points.


      */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class PivotChartSeriesCornerRadius
 */
export interface PivotChartSeriesCornerRadiusModel {

    /**
      * Specifies the top left corner radius value

      */
    topLeft?: number;

    /**
      * Specifies the top right corner radius value

      */
    topRight?: number;

    /**
      * Specifies the bottom left corner radius value

      */
    bottomLeft?: number;

    /**
      * Specifies the bottom right corner radius value

      */
    bottomRight?: number;

}

/**
 * Interface for a class PivotChartAxisFont
 */
export interface PivotChartAxisFontModel {

    /**
      * FontStyle for the text.

      */
    fontStyle?: string;

    /**
      * Font size for the text.

      */
    size?: string;

    /**
      * FontWeight for the text.

      */
    fontWeight?: string;

    /**
      * Color for the text.

      */
    color?: string;

    /**
      * text alignment


      */
    textAlignment?: Alignment;

    /**
      * FontFamily for the text.
      */
    fontFamily?: string;

    /**
      * Opacity for the text.

      */
    opacity?: number;

    /**
      * Specifies the chart title text overflow


      */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class PivotChartAxisCrosshairTooltip
 */
export interface PivotChartAxisCrosshairTooltipModel {

    /**
      * If set to true, crosshair ToolTip will be visible.

      */
    enable?: Boolean;

    /**
      * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.

      */
    fill?: string;

    /**
      * Options to customize the crosshair ToolTip text.
      */
    textStyle?: FontModel;

}

/**
 * Interface for a class PivotChartAxisMajorTickLines
 */
export interface PivotChartAxisMajorTickLinesModel {

    /**
      * The width of the tick lines in pixels.

      */
    width?: number;

    /**
      * The height of the ticks in pixels.

      */
    height?: number;

    /**
      * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.

      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMajorGridLines
 */
export interface PivotChartAxisMajorGridLinesModel {

    /**
      * The width of the line in pixels.

      */
    width?: number;

    /**
      * The dash array of the grid lines.

      */
    dashArray?: string;

    /**
      * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.

      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMinorTickLines
 */
export interface PivotChartAxisMinorTickLinesModel {

    /**
      * The width of the tick line in pixels.

      */
    width?: number;

    /**
      * The height of the ticks in pixels.

      */
    height?: number;

    /**
      * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.

      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMinorGridLines
 */
export interface PivotChartAxisMinorGridLinesModel {

    /**
      * The width of the line in pixels.

      */
    width?: number;

    /**
      * The dash array of grid lines.

      */
    dashArray?: string;

    /**
      * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.

      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisAxisLine
 */
export interface PivotChartAxisAxisLineModel {

    /**
      * The width of the line in pixels.

      */
    width?: number;

    /**
      * The dash array of the axis line.

      */
    dashArray?: string;

    /**
      * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.

      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisStripLineSettings
 */
export interface PivotChartAxisStripLineSettingsModel {

    /**
      * If set true, strip line for axis renders.

      */
    visible?: boolean;

    /**
      *  If set true, strip line get render from axis origin.

      */
    startFromAxis?: boolean;

    /**
      * Start value of the strip line.



      */
    start?: number | Date;

    /**
      * End value of the strip line.



      */
    end?: number | Date;

    /**
      * Size of the strip line, when it starts from the origin.



      */
    size?: number;

    /**
      * Color of the strip line.

      */
    color?: string;

    /**
      * Dash Array of the strip line.



      */
    dashArray?: string;

    /**
      * Size type of the strip line


      */
    sizeType?: SizeType;

    /**
      * isRepeat value of the strip line.



      */
    isRepeat?: boolean;

    /**
      * repeatEvery value of the strip line.



      */
    repeatEvery?: number | Date;

    /**
      * repeatUntil value of the strip line.



      */
    repeatUntil?: number | Date;

    /**
      * isSegmented value of the strip line



      */
    isSegmented?: boolean;

    /**
      * segmentStart value of the strip line.



      */
    segmentStart?: number | Date;

    /**
      * segmentEnd value of the strip line.



      */
    segmentEnd?: number | Date;

    /**
      * segmentAxisName of the strip line.



      */
    segmentAxisName?: string;

    /**
      * Border of the strip line.
      */
    border?: BorderModel;

    /**
      * Strip line text.

      */
    text?: string;

    /**
      * The angle to which the strip line text gets rotated.



      */
    rotation?: number;

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
    textStyle?: FontModel;

    /**
      * Specifies the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.


      */
    zIndex?: ZIndex;

    /**
      * Strip line Opacity

      */
    opacity?: number;

}

/**
 * Interface for a class PivotChartAxisLabelBorder
 */
export interface PivotChartAxisLabelBorderModel {

    /**
      * The color of the border that accepts value in hex and rgba as a valid CSS color string.

      */
    color?: string;

    /**
      * The width of the border in pixels.

      */
    width?: number;

    /**
      * Border type for labels
      * * Rectangle
      * * Without Top Border
      * * Without Top and BottomBorder
      * * Without Border
      * * Brace
      * * CurlyBrace


      */
    type?: BorderType;

}

/**
 * Interface for a class PivotChartSettingsChartArea
 */
export interface PivotChartSettingsChartAreaModel {

    /**
      * Options to customize the border of the chart area.
      */
    border?: BorderModel;

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
 * Interface for a class PivotChartSettingsCrosshairSettings
 */
export interface PivotChartSettingsCrosshairSettingsModel {

    /**
      * If set to true, crosshair line becomes visible.

      */
    enable?: boolean;

    /**
      * DashArray for crosshair.

      */
    dashArray?: string;

    /**
      * Options to customize the crosshair line.
      */
    line?: BorderModel;

    /**
      * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.


      */
    lineType?: LineType;

}

/**
 * Interface for a class PivotChartSettingsLegendSettings
 */
export interface PivotChartSettingsLegendSettingsModel {

    /**
      * If set to true, legend will be visible.

      */
    visible?: boolean;

    /**
      * The height of the legend in pixels.

      */
    height?: string;

    /**
      * The width of the legend in pixels.

      */
    width?: string;

    /**
      * Specifies the location of the legend, relative to the chart.
      * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
      * ```html
      * <div id='Chart'></div>
      * ```
      * ```typescript
      * let chart: Chart = new Chart({
      * ...
      *   legendSettings: {
      *     visible: true,
      *     position: 'Custom',
      *     location: { x: 100, y: 150 },
      *   },
      * ...
      * });
      * chart.appendTo('#Chart');
      * ```
      */
    location?: LocationModel;

    /**
      * Position of the legend in the chart are,
      * * Auto: Places the legend based on area type.
      * * Top: Displays the legend at the top of the chart.
      * * Left: Displays the legend at the left of the chart.
      * * Bottom: Displays the legend at the bottom of the chart.
      * * Right: Displays the legend at the right of the chart.
      * * Custom: Displays the legend  based on the given x and y values.


      */
    position?: LegendPosition;

    /**
      * Option to customize the padding between legend items.

      */
    padding?: number;

    /**
      * Legend in chart can be aligned as follows:
      * * Near: Aligns the legend to the left of the chart.
      * * Center: Aligns the legend to the center of the chart.
      * * Far: Aligns the legend to the right of the chart.


      */
    alignment?: Alignment;

    /**
      * Options to customize the legend text.
      */
    textStyle?: FontModel;

    /**
      * Shape height of the legend in pixels.

      */
    shapeHeight?: number;

    /**
      * Shape width of the legend in pixels.

      */
    shapeWidth?: number;

    /**
      * Options to customize the border of the legend.
      */
    border?: BorderModel;

    /**
      *  Options to customize left, right, top and bottom margins of the chart.
      */
    margin?: MarginModel;

    /**
      * Padding between the legend shape and text.

      */
    shapePadding?: number;

    /**
      * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.

      */
    background?: string;

    /**
      * Opacity of the legend.

      */
    opacity?: number;

    /**
      * If set to true, series' visibility collapses based on the legend visibility.

      */
    toggleVisibility?: boolean;

    /**
      * Description for legends.

      */
    description?: string;

    /**
      * TabIndex value for the legend.

      */
    tabIndex?: number;

}

/**
 * Interface for a class PivotChartSettingsIndexes
 */
export interface PivotChartSettingsIndexesModel {

    /**
      * Specifies the series index



      */
    series?: number;

    /**
      * Specifies the point index



      */
    point?: number;

}

/**
 * Interface for a class PivotChartSettingsMargin
 */
export interface PivotChartSettingsMarginModel {

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
 * Interface for a class PivotSeries
 */
export interface PivotSeriesModel {

    /**
      * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.

      */
    fill?: string;

    /**
      * Options to customizing animation for the series.

      */
    animation?: AnimationModel;

    /**
      * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

      */
    dashArray?: string;

    /**
      * The stroke width for the series that is applicable only for `Line` type series.

      */
    width?: number;

    /**
      * Defines the axis, based on which the line series will be split.
      */
    segmentAxis?: Segment;

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


      */
    drawType?: ChartDrawType;

    /**
      * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.

      */
    isClosed?: boolean;

    /**
      * Defines the collection of regions that helps to differentiate a line series.
      */
    segments?: ChartSegmentModel[];

    /**
      * This property allows grouping series in `stacked column / bar` charts.
      * Any string value can be provided to the stackingGroup property.
      * If any two or above series have the same value, those series will be grouped together.

      */
    stackingGroup?: string;

    /**
      * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
      */
    border?: BorderModel;

    /**
      * Specifies the visibility of series.

      */
    visible?: boolean;

    /**
      * The opacity of the series.

      */
    opacity?: number;

    /**
      * The type of the series are
      * * StackingColumn
      * * StackingArea
      * * StackingBar
      * * StepLine      
      * * Line
      * * Column
      * * Area
      * * Bar
      * * StepArea
      * * Pareto
      * * Bubble
      * * Scatter     
      * * Spline
      * * SplineArea
      * * StackingColumn100
      * * StackingBar100
      * * StackingArea100
      * * Polar
      * * Radar

      */

    type?: ChartSeriesType;

    /**
      * Options for displaying and customizing markers for individual points in a series.
      */
    marker?: MarkerSettingsModel;

    /**
      * Options for displaying and customizing error bar for individual point in a series.
      */
    errorBar?: ErrorBarSettingsModel;

    /**
      * If set true, the Tooltip for series will be visible.

      */
    enableTooltip?: boolean;

    /**
      * Defines the collection of trendlines that are used to predict the trend
      */
    trendlines?: TrendlineModel[];

    /**
      * The provided value will be considered as a Tooltip name 

      */
    tooltipMappingName?: string;

    /**
      * The shape of the legend. Each series has its own legend shape. They are,
      * * Circle
      * * Rectangle
      * * VerticalLine
      * * Pentagon
      * * InvertedTriangle
      * * SeriesType     
      * * Triangle
      * * Diamond
      * * Cross
      * * HorizontalLine


      */

    legendShape?: LegendShape;

    /**
      * Minimum radius

      */
    minRadius?: number;

    /**
      * Custom style for the selected series or points.

      */
    selectionStyle?: string;

    /**
      * Defines type of spline to be rendered.


      */
    splineType?: SplineType;

    /**
      * Maximum radius

      */
    maxRadius?: number;

    /**
      * It defines tension of cardinal spline types

      */
    cardinalSplineTension?: number;

    /**
      * To render the column series points with particular column width.



      */
    columnWidth?: number;

    /**
      * options to customize the empty points in series
      */
    emptyPointSettings?: EmptyPointSettingsModel;

    /**
      * To render the column series points with particular rounded corner.
      */
    cornerRadius?: CornerRadiusModel;

    /**
      * To render the column series points with particular column spacing. It takes value from 0 - 1.

      */
    columnSpacing?: number;

}

/**
 * Interface for a class PivotAxis
 */
export interface PivotAxisModel {

    /**
      * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
      * * Rotate45: Rotates the label to 45 degree when it intersects.
      * * Rotate90: Rotates the label to 90 degree when it intersects.     
      * * None: Shows all the labels.
      * * Hide: Hides the label when it intersects.


      */
    labelIntersectAction?: LabelIntersectAction;

    /**
      * Options to customize the axis label.
      */
    labelStyle?: FontModel;

    /**
      * Specifies the title of an axis.

      */
    title?: string;

    /**
      * Options to customize the crosshair ToolTip.
      */
    crosshairTooltip?: CrosshairTooltipModel;

    /**
      * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
      * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.

      */
    labelFormat?: string;

    /**
      * Options for customizing the axis title.
      */
    titleStyle?: FontModel;

    /**
      * Specifies indexed category  axis.

      */
    isIndexed?: boolean;

    /**
      * Left and right padding for the plot area in pixels.

      */
    plotOffset?: number;

    /**
      * Specifies the position of labels at the edge of the axis.They are,
      * * Shift: Shifts the edge labels.
      * * None: No action will be performed.
      * * Hide: Edge label will be hidden.     


      */
    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
      * Specifies the placement of a label for category axis. They are,
      * * onTicks: Renders the label on the ticks.     
      * * betweenTicks: Renders the label between the ticks.


      */
    labelPlacement?: LabelPlacement;

    /**
      * Specifies the placement of a ticks to the axis line. They are,
      * * outside: Renders the ticks outside to the axis line.     
      * * inside: Renders the ticks inside to the axis line.


      */
    tickPosition?: AxisPosition;

    /**
      * If set to true, the axis will render at the opposite side of its default position.

      */
    opposedPosition?: boolean;

    /**
      * If set to true, axis label will be visible.

      */
    visible?: boolean;

    /**
      * Specifies the placement of a labels to the axis line. They are,
      * * outside: Renders the labels outside to the axis line.     
      * * inside: Renders the labels inside to the axis line.


      */
    labelPosition?: AxisPosition;

    /**
      * The angle to which the axis label gets rotated.

      */
    labelRotation?: number;

    /**
      * Specifies the number of minor ticks per interval.

      */
    minorTicksPerInterval?: number;

    /**
      * Specifies the maximum range of an axis.

      */
    maximum?: Object;

    /**
      * Specifies the minimum range of an axis.

      */
    minimum?: Object;

    /**
      * Specifies the maximum width of an axis label.

      */
    maximumLabelWidth?: number;

    /**
      * Specifies the interval for an axis.



      */
    interval?: number;

    /**
      * Options for customizing major tick lines.
      */
    majorTickLines?: MajorTickLinesModel;

    /**
      * Specifies the Trim property for an axis.

      */
    enableTrim?: boolean;

    /**
      * Options for customizing major grid lines.
      */
    majorGridLines?: MajorGridLinesModel;

    /**
      * Options for customizing minor tick lines.
      */
    minorTickLines?: MinorTickLinesModel;

    /**
      * Options for customizing axis lines.
      */
    lineStyle?: AxisLineModel;

    /**
      * Options for customizing minor grid lines.
      */
    minorGridLines?: MinorGridLinesModel;

    /**
      * It specifies whether the axis to be rendered in inversed manner or not.

      */
    isInversed?: boolean;

    /**
      * Description for axis and its element.

      */
    description?: string;

    /**
      * The start angle for the series.

      */
    startAngle?: number;

    /**
      * The polar radar radius position.

      */
    coefficient?: number;

    /**
      * Specifies the stripLine collection for the axis
      */
    stripLines?: StripLineSettingsModel[];

    /**
      * TabIndex value for the axis.

      */
    tabIndex?: number;

    /**
      * Border of the multi level labels.
      */
    border?: LabelBorderModel;

}

/**
 * Interface for a class PivotTooltipSettings
 */
export interface PivotTooltipSettingsModel {

    /**
      * Enables / Disables the visibility of the marker.

      */
    enableMarker?: boolean;

    /**
      * Enables / Disables the visibility of the tooltip.

      */
    enable?: boolean;

    /**
      * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.

      */

    fill?: string;

    /**
      * If set to true, a single ToolTip will be displayed for every index.

      */
    shared?: boolean;

    /**
      * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 

      */
    opacity?: number;

    /**
      * Header for tooltip. 

      */
    header?: string;

    /**
      * Format the ToolTip content.

      */
    format?: string;

    /**
      * Options to customize the ToolTip text.
      */
    textStyle?: FontModel;

    /**
      * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.

      */
    template?: string;

    /**
      * Options to customize tooltip borders.
      */
    border?: BorderModel;

    /**
      * If set to true, ToolTip will animate while moving from one point to another.

      */
    enableAnimation?: boolean;

}

/**
 * Interface for a class PivotZoomSettings
 */
export interface PivotZoomSettingsModel {

    /**
      * If to true, chart can be pinched to zoom in / zoom out.

      */
    enablePinchZooming?: boolean;

    /**
      * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.

      */
    enableSelectionZooming?: boolean;

    /**
      * If set to true, zooming will be performed on mouse up. It requires `enableSelectionZooming` to be true.
      * ...
      *    zoomSettings: {
      *      enableSelectionZooming: true,
      *      enableDeferredZooming: false
      *    }
      * ...

      */

    enableDeferredZooming?: boolean;

    /**
      * If set to true, chart can be zoomed by using mouse wheel.

      */
    enableMouseWheelZooming?: boolean;

    /**
      * Specifies whether to allow zooming vertically or horizontally or in both ways. They are,
      * * x: Chart can be zoomed horizontally.
      * * y: Chart can be zoomed  vertically.     
      * * x,y: Chart can be zoomed both vertically and horizontally.
      *  It requires `enableSelectionZooming` to be true.
      * 
      * ...
      *    zoomSettings: {
      *      enableSelectionZooming: true,
      *      mode: 'XY'
      *    }
      * ...


      */
    mode?: ZoomMode;

    /**
      * Specifies the toolkit options for the zooming as follows:
      * * ZoomIn
      * * ZoomOut
      * * Pan     
      * * Zoom
      * * Reset


      */

    toolbarItems?: ToolbarItems[];

    /**
      * Specifies whether axis needs to have scrollbar.

      */
    enableScrollbar?: boolean;

    /**
      * Specifies whether chart needs to be panned by default.

      */
    enablePan?: boolean;

}

/**
 * Interface for a class ChartSettings
 */
export interface ChartSettingsModel {

    /**
      * Options to configures the series of chart.
      */
    chartSeries?: PivotSeriesModel;

    /**
      * Options to configure the horizontal axis of chart.
      */
    primaryXAxis?: PivotAxisModel;

    /**
      * Options to configure the vertical axis of chart.
      */
    primaryYAxis?: PivotAxisModel;

    /**
      * Defines the measure to load in chart

      */
    value?: string;

    /**
      * Defines the measure to load in chart

      */
    enableMultiAxis?: boolean;

    /**
      * Options for customizing the title of the Chart.
      */
    titleStyle?: FontModel;

    /**
      * Title of the chart

      */
    title?: string;

    /**
      * Options for customizing the Subtitle of the Chart.
      */
    subTitleStyle?: FontModel;

    /**
      * SubTitle of the chart

      */
    subTitle?: string;

    /**
      * Options for customizing the color and width of the chart border.
      */
    border?: BorderModel;

    /**
      *  Options to customize left, right, top and bottom margins of the chart.
      */
    margin?: MarginModel;

    /**
      * Options for configuring the border and background of the chart area.
      */
    chartArea?: ChartAreaModel;

    /**
      * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.

      */
    background?: string;

    /**
      * Specifies the theme for the chart.


      */
    theme?: ChartTheme;

    /**
      * Palette for the chart series.

      */
    palettes?: string[];

    /**
      * Options for customizing the crosshair of the chart.
      */
    crosshair?: CrosshairSettingsModel;

    /**
      * Options for customizing the tooltip of the chart.
      */
    tooltip?: PivotTooltipSettingsModel;

    /**
      * Options to enable the zooming feature in the chart.
      */
    zoomSettings?: PivotZoomSettingsModel;

    /**
      * Options for customizing the legend of the chart.
      */
    legendSettings?: LegendSettingsModel;

    /**
      * Specifies whether series or data point has to be selected. They are,
      * * none: Disables the selection.
      * * series: selects a series.
      * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
      * * dragX: selects points by dragging with respect to horizontal axis.
      * * dragY: selects points by dragging with respect to vertical axis.      
      * * point: selects a point.
      * * cluster: selects a cluster of point

      */
    selectionMode?: ChartSelectionMode;

    /**
      * To enable export feature in chart.

      */
    enableExport?: boolean;

    /**
      * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.

      */
    isMultiSelect?: boolean;

    /**
      * Specifies the point indexes to be selected while loading a chart.
      * It requires `selectionMode` to be `Point` | `Series`.
      * ...
      *   selectionMode: 'Point',
      *   selectedDataIndexes: [ { series: 0, point: 1},
      *                          { series: 2, point: 3} ],
      * ...

      */
    selectedDataIndexes?: IndexesModel[];

    /**
      * If set true, Animation process will be executed.

      */
    enableAnimation?: boolean;

    /**
      * Specifies whether a grouping separator should be used for a number.

      */
    useGroupingSeparator?: boolean;

    /**
      * It specifies whether the chart should be render in transposed manner or not.

      */
    isTransposed?: boolean;

    /**
      * TabIndex value for the chart.

      */
    tabIndex?: number;

    /**
      * Description for chart.

      */
    description?: string;

    /**
      * Triggers after resizing of chart
      * @event


      */
    resized?: EmitType<IResizeEventArgs>;

    /**
      * To enable the side by side placing the points for column type series.

      */
    enableSideBySidePlacement?: boolean;

    /**
      * Triggers after chart load.
      * @event


      */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
      * Triggers before the prints gets started.
      * @event


      */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
      * Triggers after animation is completed for the series.
      * @event


      */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
      * Triggers before chart load.
      * @event


      */
    load?: EmitType<ILoadedEventArgs>;

    /**
      * Triggers before the data label for series is rendered.
      * @event


      */

    textRender?: EmitType<ITextRenderEventArgs>;

    /**
      * Triggers before the legend is rendered.
      * @event


      */
    legendRender?: EmitType<ILegendRenderEventArgs>;

    /**
      * Triggers before the series is rendered.
      * @event


      */
    seriesRender?: EmitType<ISeriesRenderEventArgs>;

    /**
      * Triggers before each points for the series is rendered.
      * @event


      */
    pointRender?: EmitType<IPointRenderEventArgs>;

    /**
      * Triggers before the tooltip for series is rendered.
      * @event


      */
    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
      * Triggers before each axis label is rendered.
      * @event


      */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
      * Triggers on clicking the chart.
      * @event


      */
    chartMouseClick?: EmitType<IMouseEventArgs>;

    /**
      * Triggers on hovering the chart.
      * @event


      */
    chartMouseMove?: EmitType<IMouseEventArgs>;

    /**
      * Triggers on point move.
      * @event


      */
    pointMove?: EmitType<IPointEventArgs>;

    /**
      * Triggers on point click.
      * @event


      */
    pointClick?: EmitType<IPointEventArgs>;

    /**
      * Triggers on mouse down.
      * @event


      */
    chartMouseDown?: EmitType<IMouseEventArgs>;

    /**
      * Triggers when cursor leaves the chart.
      * @event


      */
    chartMouseLeave?: EmitType<IMouseEventArgs>;

    /**
      * Triggers after the drag selection is completed.
      * @event


      */
    dragComplete?: EmitType<IDragCompleteEventArgs>;

    /**
      * Triggers on mouse up.
      * @event


      */
    chartMouseUp?: EmitType<IMouseEventArgs>;

    /**
      * Triggers when start the scroll.
      * @event


      */
    scrollStart?: EmitType<IScrollEventArgs>;

    /**
      * Triggers after the zoom selection is completed.
      * @event


      */
    zoomComplete?: EmitType<IZoomCompleteEventArgs>;

    /**
      * Triggers when change the scroll.
      * @event


      */
    scrollChanged?: EmitType<IScrollEventArgs>;

    /**
      * Triggers after the scroll end.
      * @event


      */
    scrollEnd?: EmitType<IScrollEventArgs>;

    /**
      * Specifies whether to show multilevel labels in chart.

      */
    showMultiLevelLabels?: boolean;

}