import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';import { BorderModel as PivotChartBorderModel, ErrorBarSettingsModel as PivotChartErrorBarSettingsModel } from '@syncfusion/ej2-charts';import { ChartDrawType, ChartShape, DataLabelSettingsModel as PivotChartDataLabelSettingsModel, ZoomMode } from '@syncfusion/ej2-charts';import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes, ToolbarItems, IScrollEventArgs } from '@syncfusion/ej2-charts';import { EmptyPointMode, TextOverflow, Alignment, ZIndex, Anchor, SizeType, BorderType, LineType } from '@syncfusion/ej2-charts';import { TrendlineModel as PivotChartTrendlineModel, LegendShape, SplineType, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';import { AnimationModel as PivotChartAnimationModel, ChartSegmentModel as PivotChartSegmentModel } from '@syncfusion/ej2-charts';import { EdgeLabelPlacement, LabelPlacement, MajorTickLinesModel as PivotChartMajorTickLinesModel } from '@syncfusion/ej2-charts';import { MinorGridLinesModel as PivotChartMinorGridLinesModel, AxisLineModel as PivotChartAxisLineModel } from '@syncfusion/ej2-charts';import { ChartAreaModel as PivotChartAreaModel, IndexesModel as PivotChartIndexesModel } from '@syncfusion/ej2-charts';import { IResizeEventArgs, IPrintEventArgs, FontModel as PivotChartFontModel, LegendPosition } from '@syncfusion/ej2-charts';import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';import { IMouseEventArgs, IPointEventArgs, EmptyPointSettingsModel as PivotChartEmptyPointSettingsModel } from '@syncfusion/ej2-charts';import { LabelIntersectAction, ErrorBarCapSettingsModel as PivotChartErrorBarCapSettingsModel, ChartTheme } from '@syncfusion/ej2-charts';import { CornerRadiusModel as PivotChartCornerRadiusModel } from '@syncfusion/ej2-charts';import { MajorGridLinesModel as PivotChartMajorGridLinesModel } from '@syncfusion/ej2-charts';import { IAnimationCompleteEventArgs, StripLineSettingsModel as PivotChartStripLineSettingsModel } from '@syncfusion/ej2-charts';import { CrosshairTooltipModel as PivotChartCrosshairTooltipModel, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';import { LocationModel, AccEmptyPointMode, MarkerSettingsModel as PivotChartMarkerSettingsModel } from '@syncfusion/ej2-charts';import { CrosshairSettingsModel as PivotChartCrosshairSettingsModel, IDragCompleteEventArgs } from '@syncfusion/ej2-charts';import { LabelBorderModel as PivotChartLabelBorderModel, MarginModel as PivotChartMarginModel } from '@syncfusion/ej2-charts';import { MinorTickLinesModel as PivotChartMinorTickLinesModel, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-charts';import { Segment, AxisPosition, LegendSettingsModel, ILoadedEventArgs, ChartLocation } from '@syncfusion/ej2-charts';import { ChartSeriesType, ChartSelectionMode } from '../../common';import { Theme } from '../../common/base/themes';import { OffsetModel as PivotChartOffsetModel } from '../../common/base/interface';import { LabelPosition } from '../../common/base/enum';

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
      * If set to true, series gets animated on initial loading.
      * @default true
      */

    enable?: boolean;

    /**
      * The duration of animation in milliseconds.
      * @default 1000
      */

    duration?: number;

    /**
      * The option to delay animation of the series.
      * @default 0
      */

    delay?: number;

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
 * Interface for a class Font
 */
export interface FontModel {

    /**
      * FontStyle for the text.
      * @default 'Normal'
      */
    fontStyle?: string;

    /**
      * Font size for the text.
      * @default '16px'
      */
    size?: string;

    /**
      * FontWeight for the text.
      * @default 'Normal'
      */
    fontWeight?: string;

    /**
      * Color for the text.
      * @default ''
      */
    color?: string;

    /**
      * text alignment
      * @default 'Center'
      */
    textAlignment?: Alignment;

    /**
      * FontFamily for the text.
      */
    fontFamily?: string;

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

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

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
 * Interface for a class Border
 */
export interface BorderModel {

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
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
      * x value of the marker position
      * @default 0
      */
    x?: number;

    /**
      * y value of the marker position
      * @default 0
      */
    y?: number;

}

/**
 * Interface for a class Indexes
 */
export interface IndexesModel {

    /**
      * Specifies the series index
      * @default 0
      * @aspType int
      */
    series?: number;

    /**
      * Specifies the point index
      * @default 0
      * @aspType int
      */
    point?: number;

}

/**
 * Interface for a class ChartArea
 */
export interface ChartAreaModel {

    /**
      * Options to customize the border of the chart area.
      */
    border?: PivotChartBorderModel;

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

    /**
      * The background image of the chart area that accepts value in string as url link or location of an image.
      * @default null
      */
    backgroundImage?: string;

}

/**
 * Interface for a class CrosshairSettings
 */
export interface CrosshairSettingsModel {

    /**
      * If set to true, crosshair line becomes visible.
      * @default false
      */
    enable?: boolean;

    /**
      * DashArray for crosshair.
      * @default ''
      */
    dashArray?: string;

    /**
      * Options to customize the crosshair line.
      */
    line?: PivotChartBorderModel;

    /**
      * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.
      * @default Both
      */
    lineType?: LineType;

}

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

    border?: PivotChartBorderModel;

    /**
      * Margin configuration for the data label.
      */

    margin?: PivotChartMarginModel;

    /**
      * Option for customizing the data label text.
      */

    font?: PivotChartFontModel;

    /**
      * Custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
      * text to display the corresponding data point.
      * @default null
      */

    template?: string;

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
      * The width of the marker in pixels.
      * @default 5
      */

    width?: number;

    /**
      * The height of the marker in pixels.
      * @default 5
      */

    height?: number;

    /**
      * Options for customizing the border of a marker.
      */

    border?: PivotChartBorderModel;

    /**
      * Options for customizing the marker position.
      */

    offset?: PivotChartOffsetModel;

    /**
      *  The fill color of the marker that accepts value in hex and rgba as a valid CSS color string.
      *  By default, it will take series' color.
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

    dataLabel?: PivotChartDataLabelSettingsModel;

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
      * The vertical error of the error bar.
      * @default 1
      */

    verticalError?: number;

    /**
      *  The color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

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
      * The vertical negative error of the error bar.
      * @default 3
      */

    verticalNegativeError?: number;

    /**
      * The vertical positive error of the error bar.
      * @default 3
      */

    verticalPositiveError?: number;

    /**
      * The horizontal negative error of the error bar.
      * @default 1
      */

    horizontalNegativeError?: number;

    /**
      * The horizontal positive error of the error bar.
      * @default 1
      */

    horizontalPositiveError?: number;

    /**
      * Options for customizing the cap of the error bar.
      */
    errorBarCap?: PivotChartErrorBarCapSettingsModel;

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
      * Defines the period, the price changes over which will be considered to predict moving average trend line
      * @default 2
      */
    period?: number;

    /**
      * Defines the type of the trendline
      * @default 'Linear'
      */
    type?: TrendlineTypes;

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
      * Defines the polynomial order of the polynomial trendline
      * @default 2
      */
    polynomialOrder?: number;

    /**
      * Options to customize the marker for trendlines
      * @deprecated
      */
    marker?: PivotChartMarkerSettingsModel;

    /**
      * Enables/disables tooltip for trendlines
      * @default true
      */
    enableTooltip?: boolean;

    /**
      * Options to customize the animation for trendlines
      */
    animation?: PivotChartAnimationModel;

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
      * Defines the intercept of the trendline
      * @default null
      * @aspDefaultValueIgnore
      */
    intercept?: number;

    /**
      * Sets the legend shape of the trendline
      * @default 'SeriesType'
      */
    legendShape?: LegendShape;

}

/**
 * Interface for a class EmptyPointSettings
 */
export interface EmptyPointSettingsModel {

    /**
      * To customize the fill color of empty points.
      * @default null
      */
    fill?: string;

    /**
      * Options to customize the border of empty points.
      * @default "{color: 'transparent', width: 0}"
      */
    border?: PivotChartBorderModel;

    /**
      * To customize the mode of empty points.
      * @default Gap
      */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class CornerRadius
 */
export interface CornerRadiusModel {

    /**
      * Specifies the top left corner radius value
      * @default 0
      */
    topLeft?: number;

    /**
      * Specifies the top right corner radius value
      * @default 0
      */
    topRight?: number;

    /**
      * Specifies the bottom left corner radius value
      * @default 0
      */
    bottomLeft?: number;

    /**
      * Specifies the bottom right corner radius value
      * @default 0
      */
    bottomRight?: number;

}

/**
 * Interface for a class CrosshairTooltip
 */
export interface CrosshairTooltipModel {

    /**
      * If set to true, crosshair ToolTip will be visible.
      *  @default false
      */

    enable?: Boolean;

    /**
      * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    fill?: string;

    /**
      * Options to customize the crosshair ToolTip text.
      */

    textStyle?: PivotChartFontModel;

}

/**
 * Interface for a class StripLineSettings
 */
export interface StripLineSettingsModel {

    /**
      * If set true, strip line for axis renders.
      * @default true
      */
    visible?: boolean;

    /**
      *  If set true, strip line get render from axis origin.
      *  @default false
      */
    startFromAxis?: boolean;

    /**
      * Start value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    start?: number | Date;

    /**
      * End value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    end?: number | Date;

    /**
      * Size of the strip line, when it starts from the origin.
      * @default null
      * @aspDefaultValueIgnore
      */
    size?: number;

    /**
      * Color of the strip line.
      * @default '#808080'
      */
    color?: string;

    /**
      * Dash Array of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    dashArray?: string;

    /**
      * Size type of the strip line
      * @default Auto
      */
    sizeType?: SizeType;

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
    repeatEvery?: number | Date;

    /**
      * repeatUntil value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    repeatUntil?: number | Date;

    /**
      * isSegmented value of the strip line
      * @default false
      * @aspDefaultValueIgnore
      */
    isSegmented?: boolean;

    /**
      * segmentStart value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    segmentStart?: number | Date;

    /**
      * segmentEnd value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    segmentEnd?: number | Date;

    /**
      * segmentAxisName of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      */
    segmentAxisName?: string;

    /**
      * Border of the strip line.
      */
    border?: PivotChartBorderModel;

    /**
      * Strip line text.
      * @default ''
      */
    text?: string;

    /**
      * The angle to which the strip line text gets rotated.
      * @default null
      * @aspDefaultValueIgnore
      */
    rotation?: number;

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
    textStyle?: PivotChartFontModel;

    /**
      * Specifies the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.
      * @default 'Behind'
      */
    zIndex?: ZIndex;

    /**
      * Strip line Opacity
      * @default 1
      */
    opacity?: number;

}

/**
 * Interface for a class LabelBorder
 */
export interface LabelBorderModel {

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

    /**
      * Border type for labels
      * * Rectangle
      * * Without Top Border
      * * Without Top and BottomBorder
      * * Without Border
      * * Brace
      * * CurlyBrace
      * @default 'Rectangle'
      */
    type?: BorderType;

}

/**
 * Interface for a class MajorGridLines
 */
export interface MajorGridLinesModel {

    /**
      * The width of the line in pixels.
      * @default 1
      */

    width?: number;

    /**
      * The dash array of the grid lines.
      * @default ''
      */

    dashArray?: string;

    /**
      * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class MinorGridLines
 */
export interface MinorGridLinesModel {

    /**
      * The width of the line in pixels.
      * @default 0.7
      */

    width?: number;

    /**
      * The dash array of grid lines.
      * @default ''
      */

    dashArray?: string;

    /**
      * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class AxisLine
 */
export interface AxisLineModel {

    /**
      * The width of the line in pixels.
      * @default 1
      */

    width?: number;

    /**
      * The dash array of the axis line.
      * @default ''
      */

    dashArray?: string;

    /**
      * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class MajorTickLines
 */
export interface MajorTickLinesModel {

    /**
      * The width of the tick lines in pixels.
      * @default 1
      */

    width?: number;

    /**
      * The height of the ticks in pixels.
      * @default 5
      */

    height?: number;

    /**
      * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class MinorTickLines
 */
export interface MinorTickLinesModel {

    /**
      * The width of the tick line in pixels.
      * @default 0.7
      */

    width?: number;

    /**
      * The height of the ticks in pixels.
      * @default 5
      */

    height?: number;

    /**
      * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class PivotChartSeriesBorder
 */
export interface PivotChartSeriesBorderModel {

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
 * Interface for a class PivotChartSeriesAnimation
 */
export interface PivotChartSeriesAnimationModel {

    /**
      * If set to true, series gets animated on initial loading.
      * @default true
      */
    enable?: boolean;

    /**
      * The duration of animation in milliseconds.
      * @default 1000
      */
    duration?: number;

    /**
      * The option to delay animation of the series.
      * @default 0
      */
    delay?: number;

}

/**
 * Interface for a class PivotChartSeriesSegment
 */
export interface PivotChartSeriesSegmentModel {

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
 * Interface for a class PivotChartSeriesMarkerSettings
 * @private
 */
export interface PivotChartSeriesMarkerSettingsModel {

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
      * @blazorType PivotChartShape
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
    border?: PivotChartBorderModel;

    /**
      * The fill color of the marker that accepts value in hex and rgba as a valid CSS color string. 
      * By default, it will take series' color.
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
    dataLabel?: PivotChartDataLabelSettingsModel;

}

/**
 * Interface for a class PivotChartSeriesErrorSettings
 */
export interface PivotChartSeriesErrorSettingsModel {

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
      * @blazorType PivotChartErrorBarType
      * @default 'Fixed'
      */
    type?: ErrorBarType;

    /**
      * The direction of the error bar . They are
      * * both -  Renders both direction of error bar.
      * * minus - Renders minus direction of error bar.
      * * plus - Renders plus direction error bar.
      * @blazorType PivotChartErrorBarDirection
      * @default 'Both'
      */
    direction?: ErrorBarDirection;

    /**
      * The mode of the error bar . They are
      * * Vertical -  Renders a vertical error bar.
      * * Horizontal - Renders a horizontal error bar.
      * * Both - Renders both side error bar.
      * @blazorType PivotChartErrorBarMode
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
    errorBarCap?: PivotChartErrorBarCapSettingsModel;

}

/**
 * Interface for a class PivotChartSeriesTrendline
 */
export interface PivotChartSeriesTrendlineModel {

    /**
      * Defines the name of trendline
      * @default ''
      */
    name?: string;

    /**
      * Defines the type of the trendline
      * @blazorType PivotChartTrendlineTypes
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
    animation?: PivotChartAnimationModel;

    /**
      * Options to customize the marker for trendlines
      */
    marker?: PivotChartMarkerSettingsModel;

    /**
      * Enables/disables tooltip for trendlines
      * @default true
      */
    enableTooltip?: boolean;

    /**
      * Defines the intercept of the trendline
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
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
      * @blazorType PivotChartLegendShape
      * @default 'SeriesType'
      */
    legendShape?: LegendShape;

}

/**
 * Interface for a class PivotChartSeriesEmptyPointSettings
 */
export interface PivotChartSeriesEmptyPointSettingsModel {

    /**
      * To customize the fill color of empty points.
      * @default null
      */
    fill?: string;

    /**
      * Options to customize the border of empty points.
      * @default "{color: 'transparent', width: 0}"
      */
    border?: PivotChartBorderModel;

    /**
      * To customize the mode of empty points.
      * @blazorType PivotChartEmptyPointMode
      * @default Gap
      */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class PivotChartSeriesCornerRadius
 */
export interface PivotChartSeriesCornerRadiusModel {

    /**
      * Specifies the top left corner radius value
      * @default 0
      */
    topLeft?: number;

    /**
      * Specifies the top right corner radius value
      * @default 0
      */
    topRight?: number;

    /**
      * Specifies the bottom left corner radius value
      * @default 0
      */
    bottomLeft?: number;

    /**
      * Specifies the bottom right corner radius value
      * @default 0
      */
    bottomRight?: number;

}

/**
 * Interface for a class PivotChartAxisFont
 */
export interface PivotChartAxisFontModel {

    /**
      * FontStyle for the text.
      * @default 'Normal'
      */
    fontStyle?: string;

    /**
      * Font size for the text.
      * @default '16px'
      */
    size?: string;

    /**
      * FontWeight for the text.
      * @default 'Normal'
      */
    fontWeight?: string;

    /**
      * Color for the text.
      * @default ''
      */
    color?: string;

    /**
      * text alignment
      * @blazorType PivotChartAlignment
      * @default 'Center'
      */
    textAlignment?: Alignment;

    /**
      * FontFamily for the text.
      */
    fontFamily?: string;

    /**
      * Opacity for the text.
      * @default 1
      */
    opacity?: number;

    /**
      * Specifies the chart title text overflow
      * @blazorType PivotChartTextOverflow
      * @default 'Trim'
      */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class PivotChartAxisCrosshairTooltip
 */
export interface PivotChartAxisCrosshairTooltipModel {

    /**
      * If set to true, crosshair ToolTip will be visible.
      *  @default false
      */
    enable?: Boolean;

    /**
      * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    fill?: string;

    /**
      * Options to customize the crosshair ToolTip text.
      */
    textStyle?: PivotChartFontModel;

}

/**
 * Interface for a class PivotChartAxisMajorTickLines
 */
export interface PivotChartAxisMajorTickLinesModel {

    /**
      * The width of the tick lines in pixels.
      * @default 1
      */
    width?: number;

    /**
      * The height of the ticks in pixels.
      * @default 5
      */
    height?: number;

    /**
      * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMajorGridLines
 */
export interface PivotChartAxisMajorGridLinesModel {

    /**
      * The width of the line in pixels.
      * @default 1
      */
    width?: number;

    /**
      * The dash array of the grid lines.
      * @default ''
      */
    dashArray?: string;

    /**
      * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMinorTickLines
 */
export interface PivotChartAxisMinorTickLinesModel {

    /**
      * The width of the tick line in pixels.
      * @default 0.7
      */
    width?: number;

    /**
      * The height of the ticks in pixels.
      * @default 5
      */
    height?: number;

    /**
      * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMinorGridLines
 */
export interface PivotChartAxisMinorGridLinesModel {

    /**
      * The width of the line in pixels.
      * @default 0.7
      */
    width?: number;

    /**
      * The dash array of grid lines.
      * @default ''
      */
    dashArray?: string;

    /**
      * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisAxisLine
 */
export interface PivotChartAxisAxisLineModel {

    /**
      * The width of the line in pixels.
      * @default 1
      */
    width?: number;

    /**
      * The dash array of the axis line.
      * @default ''
      */
    dashArray?: string;

    /**
      * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisStripLineSettings
 */
export interface PivotChartAxisStripLineSettingsModel {

    /**
      * If set true, strip line for axis renders.
      * @default true
      */
    visible?: boolean;

    /**
      *  If set true, strip line get render from axis origin.
      *  @default false
      */
    startFromAxis?: boolean;

    /**
      * Start value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    start?: number | Date;

    /**
      * End value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    end?: number | Date;

    /**
      * Size of the strip line, when it starts from the origin.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    size?: number;

    /**
      * Color of the strip line.
      * @default '#808080'
      */
    color?: string;

    /**
      * Dash Array of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    dashArray?: string;

    /**
      * Size type of the strip line
      * @blazorType PivotChartSizeType
      * @default Auto
      */
    sizeType?: SizeType;

    /**
      * isRepeat value of the strip line.
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    isRepeat?: boolean;

    /**
      * repeatEvery value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    repeatEvery?: number | Date;

    /**
      * repeatUntil value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    repeatUntil?: number | Date;

    /**
      * isSegmented value of the strip line
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    isSegmented?: boolean;

    /**
      * segmentStart value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentStart?: number | Date;

    /**
      * segmentEnd value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentEnd?: number | Date;

    /**
      * segmentAxisName of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentAxisName?: string;

    /**
      * Border of the strip line.
      */
    border?: PivotChartBorderModel;

    /**
      * Strip line text.
      * @default ''
      */
    text?: string;

    /**
      * The angle to which the strip line text gets rotated.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    rotation?: number;

    /**
      * Defines the position of the strip line text horizontally. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @blazorType PivotChartAnchor
      * @default 'Middle'
      */
    horizontalAlignment?: Anchor;

    /**
      * Defines the position of the strip line text vertically. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @blazorType PivotChartAnchor
      * @default 'Middle'
      */
    verticalAlignment?: Anchor;

    /**
      * Options to customize the strip line text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Specifies the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.
      * @blazorType PivotChartZIndex
      * @default 'Behind'
      */
    zIndex?: ZIndex;

    /**
      * Strip line Opacity
      * @default 1
      */
    opacity?: number;

}

/**
 * Interface for a class PivotChartAxisLabelBorder
 */
export interface PivotChartAxisLabelBorderModel {

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

    /**
      * Border type for labels
      * * Rectangle
      * * Without Top Border
      * * Without Top and BottomBorder
      * * Without Border
      * * Brace
      * * CurlyBrace
      * @blazorType PivotChartBorderType
      * @default 'Rectangle'
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
    border?: PivotChartBorderModel;

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
 * Interface for a class PivotChartSettingsCrosshairSettings
 */
export interface PivotChartSettingsCrosshairSettingsModel {

    /**
      * If set to true, crosshair line becomes visible.
      * @default false
      */
    enable?: boolean;

    /**
      * DashArray for crosshair.
      * @default ''
      */
    dashArray?: string;

    /**
      * Options to customize the crosshair line.
      */
    line?: PivotChartBorderModel;

    /**
      * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.
      * @blazorType PivotChartLineType
      * @default Both
      */
    lineType?: LineType;

}

/**
 * Interface for a class PivotChartSettingsLegendSettings
 */
export interface PivotChartSettingsLegendSettingsModel {

    /**
      * If set to true, legend will be visible.
      * @default true
      */
    visible?: boolean;

    /**
      * The height of the legend in pixels.
      * @default null
      */
    height?: string;

    /**
      * The width of the legend in pixels.
      * @default null
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
      * @blazorType PivotChartLegendPosition
      * @default 'Auto'
      */
    position?: LegendPosition;

    /**
      * Option to customize the padding between legend items.
      * @default 8
      */
    padding?: number;

    /**
      * Legend in chart can be aligned as follows:
      * * Near: Aligns the legend to the left of the chart.
      * * Center: Aligns the legend to the center of the chart.
      * * Far: Aligns the legend to the right of the chart.
      * @blazorType PivotChartAlignment
      * @default 'Center'
      */
    alignment?: Alignment;

    /**
      * Options to customize the legend text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Shape height of the legend in pixels.
      * @default 10
      */
    shapeHeight?: number;

    /**
      * Shape width of the legend in pixels.
      * @default 10
      */
    shapeWidth?: number;

    /**
      * Options to customize the border of the legend.
      */
    border?: PivotChartBorderModel;

    /**
      *  Options to customize left, right, top and bottom margins of the chart.
      */
    margin?: PivotChartMarginModel;

    /**
      * Padding between the legend shape and text.
      * @default 5
      */
    shapePadding?: number;

    /**
      * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.
      * @default 'transparent'
      */
    background?: string;

    /**
      * Opacity of the legend.
      * @default 1
      */
    opacity?: number;

    /**
      * If set to true, series' visibility collapses based on the legend visibility.
      * @default true
      */
    toggleVisibility?: boolean;

    /**
      * Description for legends.
      * @default null
      */
    description?: string;

    /**
      * TabIndex value for the legend.
      * @default 3
      */
    tabIndex?: number;

}

/**
 * Interface for a class PivotChartSettingsIndexes
 */
export interface PivotChartSettingsIndexesModel {

    /**
      * Specifies the series index
      * @default 0
      * @aspType int
      * @blazorType int
      */
    series?: number;

    /**
      * Specifies the point index
      * @default 0
      * @aspType int
      * @blazorType int
      */
    point?: number;

}

/**
 * Interface for a class PivotChartSettingsMargin
 */
export interface PivotChartSettingsMarginModel {

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
 * Interface for a class PivotSeries
 */
export interface PivotSeriesModel {

    /**
      * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    fill?: string;

    /**
      * Options to customizing animation for the series.
      * @default null
      */
    animation?: PivotChartAnimationModel;

    /**
      * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
      * @default '0'
      */
    dashArray?: string;

    /**
      * The stroke width for the series that is applicable only for `Line` type series.
      * @default 1
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
      * @blazorType PivotChartDrawType
      * @default 'Line'
      */
    drawType?: ChartDrawType;

    /**
      * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
      * @default true
      */
    isClosed?: boolean;

    /**
      * Defines the collection of regions that helps to differentiate a line series.
      */
    segments?: PivotChartSegmentModel[];

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
    border?: PivotChartBorderModel;

    /**
      * Specifies the visibility of series.
      * @default true
      */
    visible?: boolean;

    /**
      * The opacity of the series.
      * @default 1
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
      * @default 'Line'
      */

    type?: ChartSeriesType;

    /**
      * Options for displaying and customizing markers for individual points in a series.
      */
    marker?: PivotChartMarkerSettingsModel;

    /**
      * Options for displaying and customizing error bar for individual point in a series.
      */
    errorBar?: PivotChartErrorBarSettingsModel;

    /**
      * If set true, the Tooltip for series will be visible.
      * @default true
      */
    enableTooltip?: boolean;

    /**
      * Defines the collection of trendlines that are used to predict the trend
      */
    trendlines?: PivotChartTrendlineModel[];

    /**
      * The provided value will be considered as a Tooltip name 
      * @default ''
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
      * @blazorType PivotChartLegendShape
      * @default 'SeriesType'
      */

    legendShape?: LegendShape;

    /**
      * Minimum radius
      * @default 1
      */
    minRadius?: number;

    /**
      * Custom style for the selected series or points.
      * @default null
      */
    selectionStyle?: string;

    /**
      * Defines type of spline to be rendered.
      * @blazorType PivotChartSplineType
      * @default 'Natural'
      */
    splineType?: SplineType;

    /**
      * Maximum radius
      * @default 3
      */
    maxRadius?: number;

    /**
      * It defines tension of cardinal spline types
      * @default 0.5
      */
    cardinalSplineTension?: number;

    /**
      * To render the column series points with particular column width.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    columnWidth?: number;

    /**
      * options to customize the empty points in series
      */
    emptyPointSettings?: PivotChartEmptyPointSettingsModel;

    /**
      * To render the column series points with particular rounded corner.
      */
    cornerRadius?: PivotChartCornerRadiusModel;

    /**
      * To render the column series points with particular column spacing. It takes value from 0 - 1.
      * @default 0
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
      * @blazorType PivotChartLabelIntersectAction
      * @default Rotate45
      */
    labelIntersectAction?: LabelIntersectAction;

    /**
      * Options to customize the axis label.
      */
    labelStyle?: PivotChartFontModel;

    /**
      * Specifies the title of an axis.
      * @default ''
      */
    title?: string;

    /**
      * Options to customize the crosshair ToolTip.
      */
    crosshairTooltip?: PivotChartCrosshairTooltipModel;

    /**
      * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
      * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
      * @default ''
      */
    labelFormat?: string;

    /**
      * Options for customizing the axis title.
      */
    titleStyle?: PivotChartFontModel;

    /**
      * Specifies indexed category  axis.
      * @default false
      */
    isIndexed?: boolean;

    /**
      * Left and right padding for the plot area in pixels.
      * @default 0
      */
    plotOffset?: number;

    /**
      * Specifies the position of labels at the edge of the axis.They are,
      * * Shift: Shifts the edge labels.
      * * None: No action will be performed.
      * * Hide: Edge label will be hidden.     
      * @blazorType PivotChartEdgeLabelPlacement
      * @default 'None'
      */
    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
      * Specifies the placement of a label for category axis. They are,
      * * onTicks: Renders the label on the ticks.     
      * * betweenTicks: Renders the label between the ticks.
      * @blazorType PivotChartLabelPlacement
      * @default 'BetweenTicks'
      */
    labelPlacement?: LabelPlacement;

    /**
      * Specifies the placement of a ticks to the axis line. They are,
      * * outside: Renders the ticks outside to the axis line.     
      * * inside: Renders the ticks inside to the axis line.
      * @blazorType PivotChartAxisPosition
      * @default 'Outside'
      */
    tickPosition?: AxisPosition;

    /**
      * If set to true, the axis will render at the opposite side of its default position.
      * @default false
      */
    opposedPosition?: boolean;

    /**
      * If set to true, axis label will be visible.
      * @default true
      */
    visible?: boolean;

    /**
      * Specifies the placement of a labels to the axis line. They are,
      * * outside: Renders the labels outside to the axis line.     
      * * inside: Renders the labels inside to the axis line.
      * @blazorType PivotChartAxisPosition
      * @default 'Outside'
      */
    labelPosition?: AxisPosition;

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
      * Specifies the maximum range of an axis.
      * @default null
      */
    maximum?: Object;

    /**
      * Specifies the minimum range of an axis.
      * @default null
      */
    minimum?: Object;

    /**
      * Specifies the maximum width of an axis label.
      * @default 34.
      */
    maximumLabelWidth?: number;

    /**
      * Specifies the interval for an axis.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    interval?: number;

    /**
      * Options for customizing major tick lines.
      */
    majorTickLines?: PivotChartMajorTickLinesModel;

    /**
      * Specifies the Trim property for an axis.
      * @default false
      */
    enableTrim?: boolean;

    /**
      * Options for customizing major grid lines.
      */
    majorGridLines?: PivotChartMajorGridLinesModel;

    /**
      * Options for customizing minor tick lines.
      */
    minorTickLines?: PivotChartMinorTickLinesModel;

    /**
      * Options for customizing axis lines.
      */
    lineStyle?: PivotChartAxisLineModel;

    /**
      * Options for customizing minor grid lines.
      */
    minorGridLines?: PivotChartMinorGridLinesModel;

    /**
      * It specifies whether the axis to be rendered in inversed manner or not.
      * @default false
      */
    isInversed?: boolean;

    /**
      * Description for axis and its element.
      * @default null
      */
    description?: string;

    /**
      * The start angle for the series.
      * @default 0
      */
    startAngle?: number;

    /**
      * The polar radar radius position.
      * @default 100
      */
    coefficient?: number;

    /**
      * Specifies the stripLine collection for the axis
      */
    stripLines?: PivotChartStripLineSettingsModel[];

    /**
      * TabIndex value for the axis.
      * @default 2
      */
    tabIndex?: number;

    /**
      * Border of the multi level labels.
      */
    border?: PivotChartLabelBorderModel;

}

/**
 * Interface for a class PivotTooltipSettings
 */
export interface PivotTooltipSettingsModel {

    /**
      * Enables / Disables the visibility of the marker.
      * @default false.
      */
    enableMarker?: boolean;

    /**
      * Enables / Disables the visibility of the tooltip.
      * @default true.
      */
    enable?: boolean;

    /**
      * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
      * @default null 
      */

    fill?: string;

    /**
      * If set to true, a single ToolTip will be displayed for every index.
      * @default false.
      */
    shared?: boolean;

    /**
      * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
      * @default 0.75
      */
    opacity?: number;

    /**
      * Header for tooltip. 
      * @default null
      */
    header?: string;

    /**
      * Format the ToolTip content.
      * @default null.
      */
    format?: string;

    /**
      * Options to customize the ToolTip text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
      * @default null.
      */
    template?: string;

    /**
      * Options to customize tooltip borders.
      */
    border?: PivotChartBorderModel;

    /**
      * If set to true, ToolTip will animate while moving from one point to another.
      * @default true.
      */
    enableAnimation?: boolean;

}

/**
 * Interface for a class PivotZoomSettings
 */
export interface PivotZoomSettingsModel {

    /**
      * If to true, chart can be pinched to zoom in / zoom out.
      * @default false
      */
    enablePinchZooming?: boolean;

    /**
      * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.
      * @default true
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
      * @default false
      */

    enableDeferredZooming?: boolean;

    /**
      * If set to true, chart can be zoomed by using mouse wheel.
      * @default false
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
      * @blazorType PivotChartZoomMode
      * @default 'XY'
      */
    mode?: ZoomMode;

    /**
      * Specifies the toolkit options for the zooming as follows:
      * * ZoomIn
      * * ZoomOut
      * * Pan     
      * * Zoom
      * * Reset
      * @blazorType List<PivotChartToolbarItems>
      * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
      */

    toolbarItems?: ToolbarItems[];

    /**
      * Specifies whether axis needs to have scrollbar.
      * @default true.
      */
    enableScrollbar?: boolean;

    /**
      * Specifies whether chart needs to be panned by default.
      * @default false.
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
      * @default ''
      */
    value?: string;

    /**
      * Defines the measure to load in chart
      * @default false
      */
    enableMultiAxis?: boolean;

    /**
      * Options for customizing the title of the Chart.
      */
    titleStyle?: PivotChartFontModel;

    /**
      * Title of the chart
      * @default ''
      */
    title?: string;

    /**
      * Options for customizing the Subtitle of the Chart.
      */
    subTitleStyle?: PivotChartFontModel;

    /**
      * SubTitle of the chart
      * @default ''
      */
    subTitle?: string;

    /**
      * Options for customizing the color and width of the chart border.
      */
    border?: PivotChartBorderModel;

    /**
      *  Options to customize left, right, top and bottom margins of the chart.
      */
    margin?: PivotChartMarginModel;

    /**
      * Options for configuring the border and background of the chart area.
      */
    chartArea?: PivotChartAreaModel;

    /**
      * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    background?: string;

    /**
      * Specifies the theme for the chart.
      * @blazorType PivotChartTheme
      * @default 'Material'
      */
    theme?: ChartTheme;

    /**
      * Palette for the chart series.
      * @default []
      */
    palettes?: string[];

    /**
      * Options for customizing the crosshair of the chart.
      */
    crosshair?: PivotChartCrosshairSettingsModel;

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
      * @default 'None'
      */
    selectionMode?: ChartSelectionMode;

    /**
      * To enable export feature in chart.
      * @default true
      */
    enableExport?: boolean;

    /**
      * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
      * @default false
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
      * @default []
      * @blazorType List<PivotChartIndexes>
      */
    selectedDataIndexes?: PivotChartIndexesModel[];

    /**
      * If set true, Animation process will be executed.
      * @default true
      */
    enableAnimation?: boolean;

    /**
      * Specifies whether a grouping separator should be used for a number.
      * @default true
      */
    useGroupingSeparator?: boolean;

    /**
      * It specifies whether the chart should be render in transposed manner or not.
      * @default false
      */
    isTransposed?: boolean;

    /**
      * TabIndex value for the chart.
      * @default 1
      */
    tabIndex?: number;

    /**
      * Description for chart.
      * @default null
      */
    description?: string;

    /**
      * Triggers after resizing of chart
      * @event
      * @deprecated
      */
    resized?: EmitType<IResizeEventArgs>;

    /**
      * To enable the side by side placing the points for column type series.
      * @default true
      */
    enableSideBySidePlacement?: boolean;

    /**
      * Triggers after chart load.
      * @event
      * @deprecated
      */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
      * Triggers before the prints gets started.
      * @event
      * @deprecated
      */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
      * Triggers after animation is completed for the series.
      * @event
      * @deprecated
      */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
      * Triggers before chart load.
      * @event
      * @deprecated
      */
    load?: EmitType<ILoadedEventArgs>;

    /**
      * Triggers before the data label for series is rendered.
      * @event
      * @deprecated
      */

    textRender?: EmitType<ITextRenderEventArgs>;

    /**
      * Triggers before the legend is rendered.
      * @event
      * @deprecated
      */
    legendRender?: EmitType<ILegendRenderEventArgs>;

    /**
      * Triggers before the series is rendered.
      * @event
      * @deprecated
      */
    seriesRender?: EmitType<ISeriesRenderEventArgs>;

    /**
      * Triggers before each points for the series is rendered.
      * @event
      * @deprecated
      */
    pointRender?: EmitType<IPointRenderEventArgs>;

    /**
      * Triggers before the tooltip for series is rendered.
      * @event
      * @deprecated
      */
    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
      * Triggers before each axis label is rendered.
      * @event
      * @deprecated
      */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
      * Triggers on clicking the chart.
      * @event
      * @deprecated
      */
    chartMouseClick?: EmitType<IMouseEventArgs>;

    /**
      * Triggers on hovering the chart.
      * @event
      * @deprecated
      */
    chartMouseMove?: EmitType<IMouseEventArgs>;

    /**
      * Triggers on point move.
      * @event
      * @deprecated
      */
    pointMove?: EmitType<IPointEventArgs>;

    /**
      * Triggers on point click.
      * @event
      * @deprecated
      */
    pointClick?: EmitType<IPointEventArgs>;

    /**
      * Triggers on mouse down.
      * @event
      * @deprecated
      */
    chartMouseDown?: EmitType<IMouseEventArgs>;

    /**
      * Triggers when cursor leaves the chart.
      * @event
      * @deprecated
      */
    chartMouseLeave?: EmitType<IMouseEventArgs>;

    /**
      * Triggers after the drag selection is completed.
      * @event
      * @deprecated
      */
    dragComplete?: EmitType<IDragCompleteEventArgs>;

    /**
      * Triggers on mouse up.
      * @event
      * @deprecated
      */
    chartMouseUp?: EmitType<IMouseEventArgs>;

    /**
      * Triggers when start the scroll.
      * @event
      * @deprecated
      */
    scrollStart?: EmitType<IScrollEventArgs>;

    /**
      * Triggers after the zoom selection is completed.
      * @event
      * @deprecated
      */
    zoomComplete?: EmitType<IZoomCompleteEventArgs>;

    /**
      * Triggers when change the scroll.
      * @event
      * @deprecated
      */
    scrollChanged?: EmitType<IScrollEventArgs>;

    /**
      * Triggers after the scroll end.
      * @event
      * @deprecated
      */
    scrollEnd?: EmitType<IScrollEventArgs>;

    /**
      * Specifies whether to show multilevel labels in chart.
      * @default true
      */
    showMultiLevelLabels?: boolean;

}