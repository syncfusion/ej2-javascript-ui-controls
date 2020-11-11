import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';import { BorderModel as PivotChartBorderModel, ErrorBarSettingsModel as PivotChartErrorBarSettingsModel, AccumulationLabelPosition } from '@syncfusion/ej2-charts';import { ChartDrawType, ChartShape, DataLabelSettingsModel as PivotChartDataLabelSettingsModel, ZoomMode } from '@syncfusion/ej2-charts';import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes, ToolbarItems, IScrollEventArgs } from '@syncfusion/ej2-charts';import { EmptyPointMode, TextOverflow, Alignment, ZIndex, Anchor, SizeType, BorderType, LineType } from '@syncfusion/ej2-charts';import { TrendlineModel as PivotChartTrendlineModel, LegendShape, SplineType, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';import { AnimationModel as PivotChartAnimationModel, ChartSegmentModel as PivotChartSegmentModel } from '@syncfusion/ej2-charts';import { EdgeLabelPlacement, LabelPlacement, MajorTickLinesModel as PivotChartMajorTickLinesModel } from '@syncfusion/ej2-charts';import { MinorGridLinesModel as PivotChartMinorGridLinesModel, AxisLineModel as PivotChartAxisLineModel } from '@syncfusion/ej2-charts';import { ChartAreaModel as PivotChartAreaModel, IndexesModel as PivotChartIndexesModel, GroupModes } from '@syncfusion/ej2-charts';import { IResizeEventArgs, IPrintEventArgs, FontModel as PivotChartFontModel, LegendPosition } from '@syncfusion/ej2-charts';import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';import { IMouseEventArgs, IPointEventArgs, EmptyPointSettingsModel as PivotChartEmptyPointSettingsModel } from '@syncfusion/ej2-charts';import { LabelIntersectAction, ErrorBarCapSettingsModel as PivotChartErrorBarCapSettingsModel, ChartTheme } from '@syncfusion/ej2-charts';import { CornerRadiusModel as PivotChartCornerRadiusModel, AccumulationSelectionMode } from '@syncfusion/ej2-charts';import { MajorGridLinesModel as PivotChartMajorGridLinesModel, ConnectorType, PyramidModes } from '@syncfusion/ej2-charts';import { IAnimationCompleteEventArgs, StripLineSettingsModel as PivotChartStripLineSettingsModel } from '@syncfusion/ej2-charts';import { CrosshairTooltipModel as PivotChartCrosshairTooltipModel, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';import { LocationModel as PivotChartLocationModel, AccEmptyPointMode, MarkerSettingsModel as PivotChartMarkerSettingsModel } from '@syncfusion/ej2-charts';import { CrosshairSettingsModel as PivotChartCrosshairSettingsModel, IDragCompleteEventArgs } from '@syncfusion/ej2-charts';import { LabelBorderModel as PivotChartLabelBorderModel, MarginModel as PivotChartMarginModel } from '@syncfusion/ej2-charts';import { MinorTickLinesModel as PivotChartMinorTickLinesModel, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-charts';import { Segment, AxisPosition, LegendSettingsModel, ILoadedEventArgs, SelectionPattern } from '@syncfusion/ej2-charts';import { ChartSeriesType, ChartSelectionMode } from '../../common';import { Theme } from '../../common/base/themes';import { MultiLevelLabelClickEventArgs, OffsetModel as PivotChartOffsetModel } from '../../common/base/interface';import { LabelPosition } from '../../common/base/enum';

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
      * Allow the chart series gets animated on initial loading.
      * @default true
      */

    enable?: boolean;

    /**
      * Allows to set the duration of animation in milliseconds.
      * @default 1000
      */

    duration?: number;

    /**
      * Allows to delay the animation of the chart series.
      * @default 0
      */

    delay?: number;

}

/**
 * Interface for a class ChartSegment
 */
export interface ChartSegmentModel {

    /**
      * Allows to set the starting point of region.
      * @default null
      */

    value?: Object;

    /**
      * Allows to set the color of a region.
      * @default null
      */

    color?: string;

    /**
      * Allows to set the pattern of dashes and gaps to stroke.
      * @default '0'
      */

    dashArray?: string;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
      * Allows to set the font style to the text in the chart.
      * @default 'Normal'
      */
    fontStyle?: string;

    /**
      * Allows to set the font size to the text in the chart.
      * @default '16px'
      */
    size?: string;

    /**
      * Allows to set the font weight to the text in the chart.
      * @default 'Normal'
      */
    fontWeight?: string;

    /**
      * Allows to set color to the text in the chart.
      * @default ''
      */
    color?: string;

    /**
      * Allows to set text alignment in the chart
      * @default 'Center'
      * @blazorType PivotChartAlignment
      * @blazorDefaultValue PivotChartAlignment.Center
      */
    textAlignment?: Alignment;

    /**
      * Allows to set font family to the text in the chart.
      */
    fontFamily?: string;

    /**
      * Allows to set opacity to the text in the chart.
      * @default 1
      */
    opacity?: number;

    /**
      * Allows to specify the chart title text overflow
      * @default 'Trim'
      */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
      * Allows to set the left margin in pixels.
      * @default 10
      * @blazorType int
      */
    left?: number;

    /**
      * Allows to set the right margin in pixels.
      * @default 10
      * @blazorType int
      */
    right?: number;

    /**
      * Allows to set the top margin in pixels.
      * @default 10
      */
    top?: number;

    /**
      * Allows to set the bottom margin in pixels.
      * @default 10
      */
    bottom?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
      * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
    color?: string;

    /**
      * Allows to set the width of the border in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

}

/**
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
      * Allows to set the x(left) value of the marker position
      * @default 0
      * @blazorType int
      */
    x?: number;

    /**
      * Allows to set the y(top) value of the marker position
      * @default 0
      * @blazorType int
      */
    y?: number;

}

/**
 * Interface for a class Indexes
 */
export interface IndexesModel {

    /**
      * Allows to specify the series index
      * @default 0
      * @aspType int
      * @blazorType int
      */
    series?: number;

    /**
      * Allows to specify the point index
      * @default 0
      * @aspType int
      * @blazorType int
      */
    point?: number;

}

/**
 * Interface for a class ChartArea
 */
export interface ChartAreaModel {

    /**
      * Allows options to customize the border of the chart area.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows to set the background of the chart area that accepts value in hex and rgba as a valid CSS color string..
      * @default 'transparent'
      */
    background?: string;

    /**
      * Allows to set the opacity to the background of the chart area.
      * @default 1
      * @blazorType int
      */
    opacity?: number;

    /**
      * Allows to set the background image of the chart area that accepts value in string as url link or location of an image.
      * @default null
      */
    backgroundImage?: string;

}

/**
 * Interface for a class CrosshairSettings
 */
export interface CrosshairSettingsModel {

    /**
      * Allows to show the crosshair lines in the chart.
      * @default false
      */
    enable?: boolean;

    /**
      * Allows to set the pattern of dashes and gaps to crosshair.
      * @default ''
      */
    dashArray?: string;

    /**
      * Allow options to customize the border of the crosshair line such as color and border size in the pivot chart.
      */
    line?: PivotChartBorderModel;

    /**
      * Allows to specify the line type of the crosshair. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.
      * @default Both
      * @blazorType PivotChartLineType
      * @blazorDefaultValue PivotChartLineType.Both
      */
    lineType?: LineType;

}

/**
 * Interface for a class DataLabelSettings
 */
export interface DataLabelSettingsModel {

    /**
      * Allows to set the visibility of data label to the series renders.
      * @default false
      */

    visible?: boolean;

    /**
      * Allows to set the data source field that contains the data label value.
      * @default null
      */

    name?: string;

    /**
      * Allows to set the background color of the data label accepts value in hex and rgba as a valid CSS color string.
      * @default 'transparent'
      */

    fill?: string;

    /**
      * Allows to set the opacity to the background.
      * @default 1
      */

    opacity?: number;

    /**
      * Allows to specify the rotation angle to data label.
      * @default 0
      * @blazorType int
      */

    angle?: number;

    /**
      * Allows to set whether rotation to data label is enable or not.
      * @default false
      */

    enableRotation?: boolean;

    /**
      * Allows to specify the position of the data label. They are,
      * * Outer: Positions the label outside the point.
      * * top: Positions the label on top of the point.
      * * Bottom: Positions the label at the bottom of the point.
      * * Middle: Positions the label to the middle of the point.
      * * Auto: Positions the label based on series.
      * @default 'Auto'
      */

    position?: LabelPosition;

    /**
      * Allows to set the roundedCornerX for the data label. It requires `border` values not to be null.
      * @default 5
      * @blazorType int
      */
    rx?: number;

    /**
      * Allows to set the roundedCornerY for the data label. It requires `border` values not to be null.
      * @default 5
      * @blazorType int
      */
    ry?: number;

    /**
      * Allows to set the alignment for data Label. They are,
      * * Near: Aligns the label to the left of the point.
      * * Center: Aligns the label to the center of the point.
      * * Far: Aligns the label to the right of the point.
      * @default 'Center'
      */
    alignment?: Alignment;

    /**
      * Allows option for customizing the border lines.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows customize the margin to the data label.
      */
    margin?: PivotChartMarginModel;

    /**
      * Allows option for customizing the data label text.
      */
    font?: PivotChartFontModel;

    /**
      * Allows custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
      * text to display the corresponding data point.
      * @default null
      */
    template?: string;

}

/**
 * Interface for a class PivotChartConnectorStyle
 */
export interface PivotChartConnectorStyleModel {

    /**
      * specifies the type of the connector line for pie, funnel, doughnut and pyramid chart. They are
      * * curve
      * * Line
      * @default 'Line'
      * @blazorType PivotChartConnectorType
      * @blazorDefaultValue PivotChartConnectorType.Line
      */
    type?: ConnectorType;

    /**
      * Specifies the color of the connector line for pie, funnel, doughnut and pyramid chart.
      * @default null
      */
    color?: string;

    /**
      * Width of the connector line in pixels for pie, funnel, doughnut and pyramid chart.
      * @default 1
      */
    width?: number;

    /**
      * Length of the connector line in pixels for pie, funnel, doughnut and pyramid chart.
      * @default 'null'
      */
    length?: string;

    /**
      * dashArray of the connector line for pie, funnel, doughnut and pyramid chart.
      * @default ''
      */
    dashArray?: string;

}

/**
 * Interface for a class PivotChartDataLabel
 */
export interface PivotChartDataLabelModel {

    /**
      * Allows to set the visibility of data label to the series renders.
      * @default true
      */
    visible?: boolean;

    /**
      * Allows to set the background color of the data label accepts value in hex and rgba as a valid CSS color string.
      * @default 'transparent'
      */
    fill?: string;

    /**
      * Allows to specify the rotation angle to data label.
      * @default 0
      * @blazorType int
      */
    angle?: number;

    /**
      * Allows to set whether rotation to data label is enable or not.
      * @default false
      */

    enableRotation?: boolean;

    /**
      * Allows to specify the position of the data label. They are,
      * * Outside: Positions the label outside the point.
      * * Inside: Positions the label on top of the point.
      * @default 'Outside'
      * @blazorType PivotChartLabelPosition
      * @blazorDefaultValue PivotChartLabelPosition.Outside
      */
    position?: AccumulationLabelPosition;

    /**
      * Allows to set the roundedCornerX for the data label. It requires `border` values not to be null.
      * @default 5
      * @blazorType int
      */
    rx?: number;

    /**
      * Allows to set the roundedCornerY for the data label. It requires `border` values not to be null.
      * @default 5
      * @blazorType int
      */
    ry?: number;

    /**
      * Allows custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
      * text to display the corresponding data point.
      * @default null
      */
    template?: string;

    /**
      * Allows custom connector of the pie, funnel, pyramid and doughnut chart data label.
      * @default null
      */
    connectorStyle?: PivotChartConnectorStyleModel;

}

/**
 * Interface for a class MarkerSettings
 */
export interface MarkerSettingsModel {

    /**
      * Allows the visibility of the marker for chart series. 
      * > This is applicable only for line and area type series.
      * @default false
      */
    visible?: boolean;

    /**
      * Allows to spcify the shape of a marker.They are
      * * Circle - Renders a circle.
      * * Rectangle - Renders a rectangle.
      * * Triangle - Renders a triangle.
      * * Diamond - Renders a diamond.
      * * Cross - Renders a cross.
      * * HorizontalLine - Renders a horizontalLine.
      * * VerticalLine - Renders a verticalLine.
      * * Pentagon- Renders a pentagon.
      * * InvertedTriangle - Renders a invertedTriangle.
      * * Image - Renders a image.
      * @default 'Circle'
      */
    shape?: ChartShape;

    /**
      * Allows to set the URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
      * @default ''
      */
    imageUrl?: string;

    /**
      * Allows to set the width of the marker in pixels.
      * @default 5
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the height of the marker in pixels.
      * @default 5
      * @blazorType int
      */
    height?: number;

    /**
      * Allows options for customizing the border of a marker.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows options for customizing the marker position.
      */
    offset?: PivotChartOffsetModel;

    /**
      *  Allows to set the fill color of the marker that accepts value in hex and rgba as a valid CSS color string.
      *  By default, it will take series' color.
      * @default null
      */
    fill?: string;

    /**
      * Allows to set the opacity of the marker.
      * @default 1
      */
    opacity?: number;

    /**
      * Allows to set the data label for the series.
      */
    dataLabel?: PivotChartDataLabelSettingsModel;

}

/**
 * Interface for a class ErrorBarCapSettings
 */
export interface ErrorBarCapSettingsModel {

    /**
      * Allows to set the width of the error bar in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the length of the error bar in pixels.
      * @default 10
      * @blazorType int
      */
    length?: number;

    /**
      *  Allows to set the stroke color of the cap, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

    /**
      * Allows to set the opacity of the cap.
      * @default 1
      * @blazorType int
      */
    opacity?: number;

}

/**
 * Interface for a class ErrorBarSettings
 */
export interface ErrorBarSettingsModel {

    /**
      * Allows to set the visibility of the error bar gets rendered.
      * @default false
      */
    visible?: boolean;

    /**
      * Allows to set the type of the error bar . They are
      * * Fixed -  Renders a fixed type error bar.
      * * Percentage - Renders a percentage type error bar.
      * * StandardDeviation - Renders a standard deviation type error bar.
      * * StandardError -Renders a standard error type error bar.
      * * Custom -Renders a custom type error bar.
      * @default 'Fixed'
      */
    type?: ErrorBarType;

    /**
      * Allows to set the direction of the error bar . They are
      * * both -  Renders both direction of error bar.
      * * minus - Renders minus direction of error bar.
      * * plus - Renders plus direction error bar.
      * @default 'Both'
      */
    direction?: ErrorBarDirection;

    /**
      * Allows to set the mode of the error bar . They are
      * * Vertical -  Renders a vertical error bar.
      * * Horizontal - Renders a horizontal error bar.
      * * Both - Renders both side error bar.
      * @default 'Vertical'
      */
    mode?: ErrorBarMode;

    /**
      * Allows to set the vertical error of the error bar.
      * @default 1
      * @blazorType int
      */
    verticalError?: number;

    /**
      *  Allows to set the color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

    /**
      * Allows to set the stroke width of the error bar..
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the horizontal error of the error bar.
      * @default 1
      * @blazorType int
      */
    horizontalError?: number;

    /**
      * Allows to set the vertical negative error of the error bar.
      * @default 3
      * @blazorType int
      */
    verticalNegativeError?: number;

    /**
      * Allows to set the vertical positive error of the error bar.
      * @default 3
      * @blazorType int
      */
    verticalPositiveError?: number;

    /**
      * Allows to set the horizontal negative error of the error bar.
      * @default 1
      * @blazorType int
      */
    horizontalNegativeError?: number;

    /**
      * Allows to set the horizontal positive error of the error bar.
      * @default 1
      * @blazorType int
      */
    horizontalPositiveError?: number;

    /**
      * Allows options for customizing the cap of the error bar.
      */
    errorBarCap?: PivotChartErrorBarCapSettingsModel;

}

/**
 * Interface for a class Trendline
 */
export interface TrendlineModel {

    /**
      * Allows to set the name of trendline
      * @default ''
      */
    name?: string;

    /**
      * Allows to set the pattern of dashes and gaps to stroke.
      * @default '0'
      */
    dashArray?: string;

    /**
      * Allows to specify the visibility of trendline.
      * @default true
      */
    visible?: boolean;

    /**
      * Allows to set the period, the price changes over which will be considered to predict moving average trend line
      * @default 2
      * @blazorType int
      */
    period?: number;

    /**
      * Allows to set the type of the trendline
      * @default 'Linear'
      */
    type?: TrendlineTypes;

    /**
      * Allows to set the period, by which the trend has to backward forecast
      * @default 0
      * @blazorType int
      */
    backwardForecast?: number;

    /**
      * Allows to set the period, by which the trend has to forward forecast
      * @default 0
      * @blazorType int
      */
    forwardForecast?: number;

    /**
      * Allows to set the polynomial order of the polynomial trendline
      * @default 2
      * @blazorType int
      */
    polynomialOrder?: number;

    /**
      * Allows options to customize the marker for trendlines
      * @deprecated
      */
    marker?: PivotChartMarkerSettingsModel;

    /**
      * Allows to set the visibility of the tooltip for trendlines
      * @default true
      */
    enableTooltip?: boolean;

    /**
      * Allows options to customize the animation for trendlines
      */
    animation?: PivotChartAnimationModel;

    /**
      * Allows to set the fill color of trendline
      * @default ''
      */
    fill?: string;

    /**
      * Allows to set the width of the trendline
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the intercept of the trendline
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
    intercept?: number;

    /**
      * Allows to set the legend shape of the trendline
      * @default 'SeriesType'
      */
    legendShape?: LegendShape;

}

/**
 * Interface for a class EmptyPointSettings
 */
export interface EmptyPointSettingsModel {

    /**
      * Allows you to customize the fill color of empty points.
      * @default null
      */
    fill?: string;

    /**
      * Allows options to customize the border of empty points.
      * @default "{color: 'transparent', width: 0}"
      */
    border?: PivotChartBorderModel;

    /**
      * Allows you To customize the mode of empty points.
      * @default Gap
      */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class CornerRadius
 */
export interface CornerRadiusModel {

    /**
      * Allows to set the top left corner radius value
      * @default 0
      * @blazorType int
      */
    topLeft?: number;

    /**
      * Allows to set the top right corner radius value
      * @default 0
      * @blazorType int
      */
    topRight?: number;

    /**
      * Allows to set the bottom left corner radius value
      * @default 0
      * @blazorType int
      */
    bottomLeft?: number;

    /**
      * Allows to set the bottom right corner radius value
      * @default 0
      * @blazorType int
      */
    bottomRight?: number;

}

/**
 * Interface for a class CrosshairTooltip
 */
export interface CrosshairTooltipModel {

    /**
      * Allows to set the visibility of the crosshair tooltip.
      *  @default false
      */
    enable?: Boolean;

    /**
      * Allows to set the fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    fill?: string;

    /**
      * Allows options to customize the crosshair ToolTip text.
      */
    textStyle?: PivotChartFontModel;

}

/**
 * Interface for a class StripLineSettings
 */
export interface StripLineSettingsModel {

    /**
      * Allows to set the visibility of the strip line for axis to be rendered.
      * @default true
      */
    visible?: boolean;

    /**
      *  Allows the strip line to be rendered from axis origin.
      *  @default false
      */
    startFromAxis?: boolean;

    /**
      * Allows to set the start value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    start?: number | Date;

    /**
      * Allows to set the end value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    end?: number | Date;

    /**
      * Allows to set the size of the strip line, when it starts from the origin.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
    size?: number;

    /**
      * Allows to set the color of the strip line.
      * @default '#808080'
      */
    color?: string;

    /**
      * Allows to set the dash array of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    dashArray?: string;

    /**
      * Allows to set the size type of the strip line
      * @default Auto
      */
    sizeType?: SizeType;

    /**
      * Allows to set repeated value of the strip line.
      * @default false
      * @aspDefaultValueIgnore
      */
    isRepeat?: boolean;

    /**
      * Allows to set the repeatEvery value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    repeatEvery?: number | Date;

    /**
      * Allows to set the repeatUntil value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    repeatUntil?: number | Date;

    /**
      * Allows to set the isSegmented value of the strip line
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    isSegmented?: boolean;

    /**
      * Allows to set the segmentStart value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentStart?: number | Date;

    /**
      * Allows to set the segmentEnd value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentEnd?: number | Date;

    /**
      * Allows to set the segmentAxisName of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentAxisName?: string;

    /**
      * Allows to customize the border of the strip line with different settings such as text, rotation, line alignment, text style and opacity in the chart.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows to set the strip line text.
      * @default ''
      */
    text?: string;

    /**
      * Allows to set the angle to which the strip line text gets rotated.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
    rotation?: number;

    /**
      * Allows to set the position of the strip line text horizontally. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @default 'Middle'
      */
    horizontalAlignment?: Anchor;

    /**
      * Allows to set the position of the strip line text vertically. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @default 'Middle'
      */
    verticalAlignment?: Anchor;

    /**
      * Allows options to customize the strip line text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Allows to set the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.
      * @default 'Behind'
      */
    zIndex?: ZIndex;

    /**
      * Allows to set the opacity of the strip line
      * @default 1
      */
    opacity?: number;

}

/**
 * Interface for a class LabelBorder
 */
export interface LabelBorderModel {

    /**
      * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
    color?: string;

    /**
      * Allows to set the width of the border in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the border type for labels
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
      * Allows to set the width of the line in pixels.
      * @default 1
      * @blazorType int
      */

    width?: number;

    /**
      * Allows to set the dash array of the grid lines.
      * @default ''
      */

    dashArray?: string;

    /**
      * Allows to set the color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class MinorGridLines
 */
export interface MinorGridLinesModel {

    /**
      * Allows to set the width of the line in pixels.
      * @default 0.7
      */

    width?: number;

    /**
      * Allows to set the dash array of grid lines.
      * @default ''
      */

    dashArray?: string;

    /**
      * Allows to set the color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class AxisLine
 */
export interface AxisLineModel {

    /**
      * Allows to set the width of the line in pixels.
      * @default 1
      * @blazorType int
      */

    width?: number;

    /**
      * Allows to set the dash array of the axis line.
      * @default ''
      */

    dashArray?: string;

    /**
      * Allows to set the color of the axis line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class MajorTickLines
 */
export interface MajorTickLinesModel {

    /**
      * Allows to set the width of the tick lines in pixels.
      * @default 1
      * @blazorType int
      */

    width?: number;

    /**
      * Allows to set the height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */

    height?: number;

    /**
      * Allows to set the color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class MinorTickLines
 */
export interface MinorTickLinesModel {

    /**
      * Allows to set the width of the tick line in pixels.
      * @default 0.7
      */

    width?: number;

    /**
      * Allows to set the height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */

    height?: number;

    /**
      * Allows to set the color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

    color?: string;

}

/**
 * Interface for a class ChartLocation
 */
export interface ChartLocationModel {

    /**
      * Allows to set the x(left) value of the legend position
      * @default 0
      * @blazorType int
      */
    x?: number;

    /**
      * Allows to set the y(top) value of the legend position
      * @default 0
      * @blazorType int
      */
    y?: number;

}

/**
 * Interface for a class PivotChartSeriesBorder
 */
export interface PivotChartSeriesBorderModel {

    /**
      * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
    color?: string;

    /**
      * Allows to set the width of the border in pixels.
      * @default 1
      * @blazorType double
      */
    width?: number;

}

/**
 * Interface for a class PivotChartSeriesAnimation
 */
export interface PivotChartSeriesAnimationModel {

    /**
      * Allows to set the visibility of the series to be animated on initial loading.
      * @default true
      */
    enable?: boolean;

    /**
      * Allows to set the duration of animation in milliseconds.
      * @default 1000
      * @blazorType int
      */
    duration?: number;

    /**
      * Allows to set the option to delay animation of the series.
      * @default 0
      * @blazorType int
      */
    delay?: number;

}

/**
 * Interface for a class PivotChartSeriesSegment
 */
export interface PivotChartSeriesSegmentModel {

    /**
      * Allows to set the starting point of region.
      * @default null
      */
    value?: Object;

    /**
      * Allows to set the color of a region.
      * @default null
      */
    color?: string;

    /**
      * Allows to set the pattern of dashes and gaps to stroke.
      * @default '0'
      */
    dashArray?: string;

}

/**
 * Interface for a class PivotChartSeriesMarkerSettings
 */
export interface PivotChartSeriesMarkerSettingsModel {

    /**
      * If set to true the marker for series is rendered. This is applicable only for line and area type series.
      * @default false
      */
    visible?: boolean;

    /**
      * Allows to set the different shape of a marker:
      * * circle - Renders the marker shaper as circle.
      * * rectangle - Renders the marker shaper as rectangle.
      * * triangle - Renders the marker shaper as triangle.
      * * diamond - Renders the marker shaper as diamond.
      * * cross - Renders the marker shaper as cross.
      * * horizontalLine - Renders the marker shaper as horizontalLine.
      * * verticalLine - Renders the marker shaper as verticalLine.
      * * pentagon- Renders the marker shaper as pentagon.
      * * invertedTriangle - Renders the marker shaper as invertedTriangle.
      * * image - Renders the marker shaper as image.
      * @blazorType PivotChartShape
      * @default 'Circle'
      * @blazorDefaultValue PivotChartShape.Circle
      */
    shape?: ChartShape;

    /**
      * Allows to set the URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
      * @default ''
      */
    imageUrl?: string;

    /**
      * Allows to set the height of the marker in pixels.
      * @default 5
      * @blazorType int
      */
    height?: number;

    /**
      * Allows to set the width of the marker in pixels.
      * @default 5
      * @blazorType int
      */
    width?: number;

    /**
      * Allows options for customizing the border of a marker.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows to set the fill color of the marker that accepts value in hex and rgba as a valid CSS color string. 
      * By default, it will take series' color.
      * @default null
      */
    fill?: string;

    /**
      * Allows to set the opacity of the marker.
      * @default 1
      */
    opacity?: number;

    /**
      * Allows to set the data label for the series.
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
      * Allows to set the type of the error bar . They are
      * * Fixed -  Renders a fixed type error bar.
      * * Percentage - Renders a percentage type error bar.
      * * StandardDeviation - Renders a standard deviation type error bar.
      * * StandardError -Renders a standard error type error bar.
      * * Custom -Renders a custom type error bar.
      * @blazorType PivotChartErrorBarType
      * @default 'Fixed'
      * @blazorDefaultValue PivotChartErrorBarType.Fixed
      */
    type?: ErrorBarType;

    /**
      * Allows to set the direction of the error bar . They are
      * * both -  Renders both direction of error bar.
      * * minus - Renders minus direction of error bar.
      * * plus - Renders plus direction error bar.
      * @blazorType PivotChartErrorBarDirection
      * @default 'Both'
      * @blazorDefaultValue PivotChartErrorBarDirection.Both
      */
    direction?: ErrorBarDirection;

    /**
      * Allows to set the mode of the error bar . They are
      * * Vertical -  Renders a vertical error bar.
      * * Horizontal - Renders a horizontal error bar.
      * * Both - Renders both side error bar.
      * @blazorType PivotChartErrorBarMode
      * @default 'Vertical'
      * @blazorDefaultValue PivotChartErrorBarMode.Vertical
      */
    mode?: ErrorBarMode;

    /**
      *  Allows to set the color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

    /**
      * Allows to set the vertical error of the error bar.
      * @default 1
      * @blazorType int
      */
    verticalError?: number;

    /**
      * Allows to set the stroke width of the error bar..
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the horizontal error of the error bar.
      * @default 1
      * @blazorType int
      */
    horizontalError?: number;

    /**
      * Allows to set the vertical positive error of the error bar.
      * @default 3
      * @blazorType int
      */
    verticalPositiveError?: number;

    /**
      * Allows to set the vertical negative error of the error bar.
      * @default 3
      * @blazorType int
      */
    verticalNegativeError?: number;

    /**
      * Allows to set the horizontal positive error of the error bar.
      * @default 1
      * @blazorType int
      */
    horizontalPositiveError?: number;

    /**
      * Allows to set the horizontal negative error of the error bar.
      * @default 1
      * @blazorType int
      */
    horizontalNegativeError?: number;

    /**
      * Allows options for customizing the cap of the error bar.
      */
    errorBarCap?: PivotChartErrorBarCapSettingsModel;

}

/**
 * Interface for a class PivotChartSeriesTrendline
 */
export interface PivotChartSeriesTrendlineModel {

    /**
      * Allows to set the name of trendline
      * @default ''
      */
    name?: string;

    /**
      * Allows to set the type of the trendline
      * @blazorType PivotChartTrendlineTypes
      * @default 'Linear'
      * @blazorDefaultValue PivotChartTrendlineTypes.Linear
      */
    type?: TrendlineTypes;

    /**
      * Allows to set the period, the price changes over which will be considered to predict moving average trend line
      * @default 2
      * @blazorType int
      */
    period?: number;

    /**
      * Allows to set the polynomial order of the polynomial trendline
      * @default 2
      * @blazorType int
      */
    polynomialOrder?: number;

    /**
      * Allows to set the period, by which the trend has to backward forecast
      * @default 0
      * @blazorType int
      */
    backwardForecast?: number;

    /**
      * Allows to set the period, by which the trend has to forward forecast
      * @default 0
      * @blazorType int
      */
    forwardForecast?: number;

    /**
      * Allows options to customize the animation for trendlines
      */
    animation?: PivotChartAnimationModel;

    /**
      * Allows options to customize the marker for trendlines
      */
    marker?: PivotChartMarkerSettingsModel;

    /**
      * Enables/disables tooltip for trendlines
      * @default true
      */
    enableTooltip?: boolean;

    /**
      * Allows to set the intercept of the trendline
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
    intercept?: number;

    /**
      * Allows to set the fill color of trendline
      * @default ''
      */
    fill?: string;

    /**
      * Allows to set the width of the trendline
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the legend shape of the trendline
      * @blazorType PivotChartLegendShape
      * @default 'SeriesType'
      * @blazorDefaultValue PivotChartLegendShape.SeriesType
      */
    legendShape?: LegendShape;

}

/**
 * Interface for a class PivotChartSeriesEmptyPointSettings
 */
export interface PivotChartSeriesEmptyPointSettingsModel {

    /**
      * Allows to customize the fill color of empty points.
      * @default null
      */
    fill?: string;

    /**
      * Allows options to customize the border of empty points.
      * @default "{color: 'transparent', width: 0}"
      */
    border?: PivotChartBorderModel;

    /**
      * To customize the mode of empty points.
      * @blazorType PivotChartEmptyPointMode
      * @default Gap
      * @blazorDefaultValue PivotChartEmptyPointMode.Gap
      */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class PivotChartSeriesCornerRadius
 */
export interface PivotChartSeriesCornerRadiusModel {

    /**
      * Allows to set the top left corner radius value
      * @default 0
      * @blazorType int
      */
    topLeft?: number;

    /**
      * Allows to set the top right corner radius value
      * @default 0
      * @blazorType int
      */
    topRight?: number;

    /**
      * Allows to set the bottom left corner radius value
      * @default 0
      * @blazorType int
      */
    bottomLeft?: number;

    /**
      * Allows to set the bottom right corner radius value
      * @default 0
      * @blazorType int
      */
    bottomRight?: number;

}

/**
 * Interface for a class PivotChartAxisFont
 */
export interface PivotChartAxisFontModel {

    /**
      * Allows to set the font style for the text.
      * @default 'Normal'
      */
    fontStyle?: string;

    /**
      * Allows to set the font size for the text.
      * @default '16px'
      */
    size?: string;

    /**
      * Allows to set the font weight for the text.
      * @default 'Normal'
      */
    fontWeight?: string;

    /**
      * Allows to set the color for the text.
      * @default ''
      */
    color?: string;

    /**
      * Allows to set the text alignment
      * @blazorType PivotChartAlignment
      * @default 'Center'
      * @blazorDefaultValue PivotChartAlignment.Center
      */
    textAlignment?: Alignment;

    /**
      * Allows to set the font family for the text.
      */
    fontFamily?: string;

    /**
      * Allows to set the opacity for the text.
      * @default 1
      * @blazorType int
      */
    opacity?: number;

    /**
      * Allows to set the chart title text overflow
      * @blazorType PivotChartTextOverflow
      * @default 'Trim'
      * @blazorDefaultValue PivotChartTextOverflow.Trim
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
      * Allows to set the fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    fill?: string;

    /**
      * Allows options to customize the crosshair ToolTip text.
      */
    textStyle?: PivotChartFontModel;

}

/**
 * Interface for a class PivotChartAxisMajorTickLines
 */
export interface PivotChartAxisMajorTickLinesModel {

    /**
      * Allows to set the width of the tick lines in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */
    height?: number;

    /**
      * Allows to set the color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMajorGridLines
 */
export interface PivotChartAxisMajorGridLinesModel {

    /**
      * Allows to set the width of the line in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the dash array of the grid lines.
      * @default ''
      */
    dashArray?: string;

    /**
      * Allows to set the color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMinorTickLines
 */
export interface PivotChartAxisMinorTickLinesModel {

    /**
      * Allows to set the width of the tick line in pixels.
      * @default 0.7
      */
    width?: number;

    /**
      * Allows to set the height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */
    height?: number;

    /**
      * Allows to set the color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisMinorGridLines
 */
export interface PivotChartAxisMinorGridLinesModel {

    /**
      * Allows to set the width of the line in pixels.
      * @default 0.7
      */
    width?: number;

    /**
      * Allows to set the dash array of grid lines.
      * @default ''
      */
    dashArray?: string;

    /**
      * Allows to set the color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisAxisLine
 */
export interface PivotChartAxisAxisLineModel {

    /**
      * Allows to set the width of the line in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the dash array of the axis line.
      * @default ''
      */
    dashArray?: string;

    /**
      * Allows to set the color of the axis line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    color?: string;

}

/**
 * Interface for a class PivotChartAxisStripLineSettings
 */
export interface PivotChartAxisStripLineSettingsModel {

    /**
      * If set true, strip line for pivot chart axis renders.
      * @default true
      */
    visible?: boolean;

    /**
      *  If set true, strip line get render from  pivot chart axis origin.
      *  @default false
      */
    startFromAxis?: boolean;

    /**
      * Allows to set the start value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    start?: number | Date;

    /**
      * Allows to set the end value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    end?: number | Date;

    /**
      * Allows to set the size of the pivot chart strip line, when it starts from the origin.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
    size?: number;

    /**
      * Allows to set the color of the pivot chart strip line.
      * @default '#808080'
      */
    color?: string;

    /**
      * Allows to set the dash Array of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    dashArray?: string;

    /**
      * Allows to set the size type of the pivot chart strip line
      * @blazorType PivotChartSizeType
      * @default Auto
      * @blazorDefaultValue PivotChartSizeType.Auto
      */
    sizeType?: SizeType;

    /**
      * Allows to set the isRepeat value of the pivot chart strip line.
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    isRepeat?: boolean;

    /**
      * Allows to set the repeatEvery value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    repeatEvery?: number | Date;

    /**
      * Allows to set the repeatUntil value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    repeatUntil?: number | Date;

    /**
      * Allows to set the isSegmented value of the pivot chart strip line
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    isSegmented?: boolean;

    /**
      * Allows to set the segmentStart value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentStart?: number | Date;

    /**
      * Allows to set the segmentEnd value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentEnd?: number | Date;

    /**
      * Allows to set the segmentAxisName of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    segmentAxisName?: string;

    /**
      * Allows to set the border of the pivot chart strip line.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows to set the strip line text.
      * @default ''
      */
    text?: string;

    /**
      * Allows to set the angle to which the strip line text gets rotated.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    rotation?: number;

    /**
      * Allows to set the position of the strip line text horizontally. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @blazorType PivotChartAnchor
      * @default 'Middle'
      * @blazorDefaultValue PivotChartAnchor.Middle
      */
    horizontalAlignment?: Anchor;

    /**
      * Allows to set the position of the strip line text vertically. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @blazorType PivotChartAnchor
      * @default 'Middle'
      * @blazorDefaultValue PivotChartAnchor.Middle
      */
    verticalAlignment?: Anchor;

    /**
      * Allows options to customize the strip line text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Allows to set the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.
      * @blazorType PivotChartZIndex
      * @default 'Behind'
      * @blazorDefaultValue PivotChartZIndex.Behind
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
      * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
    color?: string;

    /**
      * Allows to set the width of the border in pixels.
      * @default 1
      * @blazorType int
      */
    width?: number;

    /**
      * Allows to set the border type for labels
      * * Rectangle
      * * Without Top Border
      * * Without Top and BottomBorder
      * * Without Border
      * * Brace
      * * CurlyBrace
      * @blazorType PivotChartBorderType
      * @default 'Rectangle'
      * @blazorDefaultValue PivotChartBorderType.Rectangle
      */
    type?: BorderType;

}

/**
 * Interface for a class PivotChartSettingsChartArea
 */
export interface PivotChartSettingsChartAreaModel {

    /**
      * Allows options to customize the border of the chart area.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows to set the background of the chart area that accepts value in hex and rgba as a valid CSS color string..
      * @default 'transparent'
      */
    background?: string;

    /**
      * Allows to set the opacity for background.
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
      * Allows to set the DashArray for crosshair.
      * @default ''
      */
    dashArray?: string;

    /**
      * Allows options to customize the crosshair line.
      */
    line?: PivotChartBorderModel;

    /**
      * Allows to set the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.
      * @blazorType PivotChartLineType
      * @default Both
      * @blazorDefaultValue PivotChartLineType.Both
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
      * Allows to set the height of the legend in pixels.
      * @default null
      */
    height?: string;

    /**
      * Allows to set the width of the legend in pixels.
      * @default null
      */
    width?: string;

    /**
      * Allows to set the location of the legend, relative to the chart.
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
    location?: PivotChartLocationModel;

    /**
      * Allows to set the position of the legend in the chart are,
      * * Auto: Places the legend based on area type.
      * * Top: Displays the legend at the top of the chart.
      * * Left: Displays the legend at the left of the chart.
      * * Bottom: Displays the legend at the bottom of the chart.
      * * Right: Displays the legend at the right of the chart.
      * * Custom: Displays the legend  based on the given x and y values.
      * @blazorType PivotChartLegendPosition
      * @default 'Auto'
      * @blazorDefaultValue PivotChartLegendPosition.Auto
      */
    position?: LegendPosition;

    /**
      * Allows option to customize the padding between legend items.
      * @default 8
      * @blazorType int
      */
    padding?: number;

    /**
      * Allows to set the legend in chart can be aligned as follows:
      * * Near: Aligns the legend to the left of the chart.
      * * Center: Aligns the legend to the center of the chart.
      * * Far: Aligns the legend to the right of the chart.
      * @blazorType PivotChartAlignment
      * @default 'Center'
      * @blazorDefaultValue PivotChartAlignment.Center
      */
    alignment?: Alignment;

    /**
      * Allows options to customize the legend text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Allows to set the shape height of the legend in pixels.
      * @default 10
      * @blazorType int
      */
    shapeHeight?: number;

    /**
      * Allows to set the shape width of the legend in pixels.
      * @default 10
      * @blazorType int
      */
    shapeWidth?: number;

    /**
      * Allows options to customize the border of the legend.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows options to customize left, right, top and bottom margins of the chart.
      */
    margin?: PivotChartMarginModel;

    /**
      * Allows to set the padding between the legend shape and text.
      * @default 5
      * @blazorType int
      */
    shapePadding?: number;

    /**
      * Allows to set the background color of the legend that accepts value in hex and rgba as a valid CSS color string.
      * @default 'transparent'
      */
    background?: string;

    /**
      * Allows to set the opacity of the legend.
      * @default 1
      */
    opacity?: number;

    /**
      * If set to true, series' visibility collapses based on the legend visibility.
      * @default true
      */
    toggleVisibility?: boolean;

    /**
      * Allows to set the description for legends.
      * @default null
      */
    description?: string;

    /**
      * Allows to set the tabindex value for the legend.
      * @default 3
      * @blazorType int
      */
    tabIndex?: number;

}

/**
 * Interface for a class PivotChartSettingsIndexes
 */
export interface PivotChartSettingsIndexesModel {

    /**
      * Allows to set the series index
      * @default 0
      * @aspType int
      * @blazorType int
      */
    series?: number;

    /**
      * Allows to set the point index
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
      * Allows to set the left margin in pixels.
      * @default 10
      */
    left?: number;

    /**
      * Allows to set the right margin in pixels.
      * @default 10
      */
    right?: number;

    /**
      * Allows to set the top margin in pixels.
      * @default 10
      */
    top?: number;

    /**
      * Allows to set the bottom margin in pixels.
      * @default 10
      */
    bottom?: number;

}

/**
 * Interface for a class PivotSeries
 */
export interface PivotSeriesModel {

    /**
      * Allows to set the fill color for the series that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
    fill?: string;

    /**
      * Allows to set the end angle for the pie and doughnut chart series.
      * @default null
      */
    endAngle?: number;

    /**
      * Allows to enable or disable series point explode on mouse click or touch for pie, funnel, doughnut and pyramid chart.
      * @default false
      */
    explode?: boolean;

    /**
      * Allows to enable or disable all series point explode on mouse click or touch for  pie, funnel, doughnut and pyramid chart.
      * @default false
      */
    explodeAll?: boolean;

    /**
      * Allows to set Index of the point to be exploded on load for pie, funnel, doughnut and pyramid chart.
      * @default null
      */
    explodeIndex?: number;

    /**
      * Allows to set inner radius for pie and doughnut series chart.
      * @default null
      */
    innerRadius?: string;

    /**
      * Allows to set distance of the point from the center, which takes values in both pixels and 
      * percentage for pie, funnel, doughnut and pyramid chart.
      * @default "30%"
      */
    explodeOffset?: string;

    /**
      * Allows to set the distance between the segments of a funnel/pyramid series. The range will be from 0 to 1.
      * @default 0
      */
    gapRatio?: number;

    /**
      * Allows to define the mode of grouping for pie, funnel, doughnut and pyramid chart series.
      * @default "Value"
      * @blazorType PivotChartGroupModes
      * @blazorDefaultValue PivotChartGroupModes.Value
      */
    groupMode?: GroupModes;

    /**
      * Allows to combine the y values into slice named other for  pie, funnel, doughnut and pyramid chart Series.
      * @default null
      */
    groupTo?: string;

    /**
      * Allows to defines the height of the funnel chart neck with respect to the chart area.
      * @default "20%"
      */
    neckHeight?: string;

    /**
      * Allows to defines the width of the funnel chart neck with respect to the chart area.
      * @default "20%"
      */
    neckWidth?: string;

    /**
      * Defines how the values have to be reflected, whether through height/surface of the segments in pyramid series.
      * @default 'Linear'
      * @blazorType PivotChartPyramidModes
      * @blazorDefaultValue PivotChartPyramidModes.Linear
      */
    pyramidMode?: PyramidModes;

    /**
      * Allows you to draw the chart series points with custom color for the pie, funnel, doughnut and pyramid chart types.
      * @default []
      */
    palettes?: string[];

    /**
      * Allows to defines start angle for the pie, funnel, doughnut and pyramid chart series.
      * @default 0
      */
    startAngle?: number;

    /**
      * Allows options to customizing animation for the series.
      * @default null
      */
    animation?: PivotChartAnimationModel;

    /**
      * Allows options to customize data label for the pie, funnel, pyramid, doughnut chart series.
      * @default null
      */
    dataLabel?: PivotChartDataLabelModel;

    /**
      * Allows to set the pattern of dashes and gaps to stroke the lines in `Line` type series.
      * @default '0'
      */
    dashArray?: string;

    /**
      * Allows to set the stroke width for the series that is applicable only for `Line` type series.
      * @default 1
      */
    width?: number;

    /**
      * Allows to set the axis, based on which the line series will be split.
      */
    segmentAxis?: Segment;

    /**
      * Allows to set the type of series to be drawn in radar or polar series. They are
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
      * @blazorDefaultValue PivotChartDrawType.Line
      */
    drawType?: ChartDrawType;

    /**
      * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
      * @default true
      */
    isClosed?: boolean;

    /**
      * Allows to set the collection of regions that helps to differentiate a line series.
      */
    segments?: PivotChartSegmentModel[];

    /**
      * This allows grouping the chart series in `stacked column / bar` charts.
      * Any string value can be provided to the stackingGroup property.
      * If any two or above series have the same value, those series will be grouped together.
      * @default ''
      */
    stackingGroup?: string;

    /**
      * Allows options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
      */
    border?: PivotChartBorderModel;

    /**
      * Allows to set the visibility of series.
      * @default true
      */
    visible?: boolean;

    /**
      * Allows to set the opacity of the series.
      * @default 1
      */
    opacity?: number;

    /**
      * Allows to set the type of the series are
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
      * Allows options for displaying and customizing markers for individual points in a series.
      */
    marker?: PivotChartMarkerSettingsModel;

    /**
      * Allows options for displaying and customizing error bar for individual point in a series.
      */
    errorBar?: PivotChartErrorBarSettingsModel;

    /**
      * If set true, the Tooltip for series will be visible.
      * @default true
      */
    enableTooltip?: boolean;

    /**
      * Allows to set the collection of trendlines that are used to predict the trend
      */
    trendlines?: PivotChartTrendlineModel[];

    /**
      * Allows to set the provided value will be considered as a Tooltip name 
      * @default ''
      */
    tooltipMappingName?: string;

    /**
      * Allows to set the shape of the legend. Each series has its own legend shape. They are,
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
      * @blazorDefaultValue PivotChartLegendShape.SeriesType
      */

    legendShape?: LegendShape;

    /**
      * Allows to set the minimum radius.
      * @default 1
      */
    minRadius?: number;

    /**
      * Allows to set the custom style for the selected series or points.
      * @default null
      */
    selectionStyle?: string;

    /**
      * Allows to set the type of spline to be rendered.
      * @blazorType PivotChartSplineType
      * @default 'Natural'
      * @blazorDefaultValue PivotChartSplineType.Natural
      */
    splineType?: SplineType;

    /**
      * Allows to set the maximum radius.
      * @default 3
      */
    maxRadius?: number;

    /**
      * Allows to set the tension of cardinal spline types
      * @default 0.5
      */
    cardinalSplineTension?: number;

    /**
      * Allows to render the column series points with particular column width.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
    columnWidth?: number;

    /**
      * Allows options to customize the empty points in series
      */
    emptyPointSettings?: PivotChartEmptyPointSettingsModel;

    /**
      * Allows to render the column series points with particular rounded corner.
      */
    cornerRadius?: PivotChartCornerRadiusModel;

    /**
      * Allows to render the column series points with particular column spacing. It takes value from 0 - 1.
      * @default 0
      * @blazorType int
      */
    columnSpacing?: number;

}

/**
 * Interface for a class PivotAxis
 */
export interface PivotAxisModel {

    /**
      * Allows to set the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
      * * Rotate45: Rotates the label to 45 degree when it intersects.
      * * Rotate90: Rotates the label to 90 degree when it intersects.     
      * * None: Shows all the labels.
      * * Hide: Hides the label when it intersects.
      * @blazorType PivotChartLabelIntersectAction
      * @default Rotate45
      * @blazorDefaultValue PivotChartLabelIntersectAction.Rotate45
      */
    labelIntersectAction?: LabelIntersectAction;

    /**
      * Allows options to customize the axis label.
      */
    labelStyle?: PivotChartFontModel;

    /**
      * Allows to set the title of an axis.
      * @default ''
      */
    title?: string;

    /**
      * Allows options to customize the crosshair ToolTip.
      */
    crosshairTooltip?: PivotChartCrosshairTooltipModel;

    /**
      * It used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
      * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
      * @default ''
      */
    labelFormat?: string;

    /**
      * Allows options for customizing the axis title.
      */
    titleStyle?: PivotChartFontModel;

    /**
      * Allows to specify the indexed category to the axis.
      * @default false
      */
    isIndexed?: boolean;

    /**
      * Allows to set the left and right padding for the plot area in pixels.
      * @default 0
      * @blazorType int
      */
    plotOffset?: number;

    /**
      * Allows to set the position of labels at the edge of the axis.They are,
      * * Shift: Shifts the edge labels.
      * * None: No action will be performed.
      * * Hide: Edge label will be hidden.     
      * @blazorType PivotChartEdgeLabelPlacement
      * @default 'None'
      * @blazorDefaultValue PivotChartEdgeLabelPlacement.None
      */
    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
      * Allows to set the placement of a label for category axis. They are,
      * * onTicks: Renders the label on the ticks.     
      * * betweenTicks: Renders the label between the ticks.
      * @blazorType PivotChartLabelPlacement
      * @default 'BetweenTicks'
      * @blazorDefaultValue PivotChartLabelPlacement.BetweenTicks
      */
    labelPlacement?: LabelPlacement;

    /**
      * Allows to set the placement of a ticks to the axis line. They are,
      * * outside: Renders the ticks outside to the axis line.     
      * * inside: Renders the ticks inside to the axis line.
      * @blazorType PivotChartAxisPosition
      * @default 'Outside'
      * @blazorDefaultValue PivotChartAxisPosition.Outside
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
      * Allows to set the placement of a labels to the axis line. They are,
      * * outside: Renders the labels outside to the axis line.     
      * * inside: Renders the labels inside to the axis line.
      * @blazorType PivotChartAxisPosition
      * @default 'Outside'
      * @blazorDefaultValue PivotChartAxisPosition.Outside
      */
    labelPosition?: AxisPosition;

    /**
      * Allows to set the angle to which the axis label gets rotated.
      * @default 0
      * @blazorType int
      */
    labelRotation?: number;

    /**
      * Allows to set the number of minor ticks per interval.
      * @default 0
      * @blazorType int
      */
    minorTicksPerInterval?: number;

    /**
      * Allows to set the maximum range of an axis.
      * @default null
      */
    maximum?: Object;

    /**
      * Allows to set the minimum range of an axis.
      * @default null
      */
    minimum?: Object;

    /**
      * Allows to set the maximum width of an axis label.
      * @default 34.
      * @blazorType int
      */
    maximumLabelWidth?: number;

    /**
      * Allows to set the interval for an axis.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
    interval?: number;

    /**
      * Allows options for customizing major tick lines.
      */
    majorTickLines?: PivotChartMajorTickLinesModel;

    /**
      * Allows to set the Trim property for an axis.
      * @default false
      */
    enableTrim?: boolean;

    /**
      * Allows options for customizing major grid lines.
      */
    majorGridLines?: PivotChartMajorGridLinesModel;

    /**
      * Allows options for customizing minor tick lines.
      */
    minorTickLines?: PivotChartMinorTickLinesModel;

    /**
      * Allows options for customizing axis lines.
      */
    lineStyle?: PivotChartAxisLineModel;

    /**
      * Allows options for customizing minor grid lines.
      */
    minorGridLines?: PivotChartMinorGridLinesModel;

    /**
      * Allows to specify whether the axis to be rendered in inversed manner or not.
      * @default false
      */
    isInversed?: boolean;

    /**
      * Allows to set the description for axis and its element.
      * @default null
      */
    description?: string;

    /**
      * Allows to set the start angle for the series.
      * @default 0
      * @blazorType int
      */
    startAngle?: number;

    /**
      * Allows to set the polar radar radius position.
      * @default 100
      * @blazorType int
      */
    coefficient?: number;

    /**
      * Allows to set the stripLine collection for the axis
      */
    stripLines?: PivotChartStripLineSettingsModel[];

    /**
      * Allows to set the tabindex value for the axis.
      * @default 2
      * @blazorType int
      */
    tabIndex?: number;

    /**
      * Allows to set the border of the multi level labels.
      */
    border?: PivotChartLabelBorderModel;

}

/**
 * Interface for a class PivotTooltipSettings
 */
export interface PivotTooltipSettingsModel {

    /**
      * Allows to set the visibility of the marker.
      * @default false.
      */
    enableMarker?: boolean;

    /**
      * Allows to set the visibility of the tooltip.
      * @default true.
      */
    enable?: boolean;

    /**
      * Allows to set the fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
      * @default null 
      */

    fill?: string;

    /**
      * If set to true, a single ToolTip will be displayed for every index.
      * @default false.
      */
    shared?: boolean;

    /**
      * Allows to set the fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
      * @default 0.75
      */
    opacity?: number;

    /**
      * Allows to set the header for tooltip. 
      * @default null
      */
    header?: string;

    /**
      * Allows to set the format the ToolTip content.
      * @default null.
      */
    format?: string;

    /**
      * Allows options to customize the ToolTip text.
      */
    textStyle?: PivotChartFontModel;

    /**
      * Allows to set the custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
      * @default null.
      */
    template?: string;

    /**
      * Allows options to customize tooltip borders.
      */
    border?: PivotChartBorderModel;

    /**
      * If set to true, ToolTip will animate while moving from one point to another.
      * @default true.
      */
    enableAnimation?: boolean;

}

/**
 * Interface for a class PivotPieChartCenter
 */
export interface PivotPieChartCenterModel {

    /**
      * X value of the center.
      * @default "50%"
      */
    x?: string;

    /**
      * Y value of the center.
      * @default "50%"
      */
    y?: string;

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
      * Allows to specify whether to allow zooming vertically or horizontally or in both ways. They are,
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
      * @blazorDefaultValue PivotChartZoomMode.XY
      */
    mode?: ZoomMode;

    /**
      * Allows to set the toolkit options for the zooming as follows:
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
      * Allow options to customize the chart series with different settings such as fill color, animation of the series, 
      * series width, border, visibility of the series, opacity, chart series types, marker, tooltip, trendlines, etc., in the pivot chart. 
      * For example, to display the line type pivot chart, set the property `type` to **Line**.
      */
    chartSeries?: PivotSeriesModel;

    /**
      * Allow options to customize the horzontal(row) axis with different properties such as labelIntersectAction, labelStyle, title, 
      * description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and 
      * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
      */
    primaryXAxis?: PivotAxisModel;

    /**
      * Allow options to customize the vertical(value) axis with different properties such as labelIntersectAction, labelStyle, 
      * title, description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and 
      * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
      */
    primaryYAxis?: PivotAxisModel;

    /**
      * Allows you to draw a pivot chart with a specific value field during initial loading.
      * @default ''
      */
    value?: string;

    /**
      * Allows to specify the column whose values will be considered to draw the pivot chart. The is applicable
      * for pie, doughnut, funnel and pyramid chart types.
      * @default ''
      */
    columnHeader?: string;

    /**
      * Allows to specify the delimiter to split the column headers. The is applicable for pie, doughnut,
      * funnel and pyramid chart types.
      * @default '-'
      */
    columnDelimiter?: string;

    /**
      * Allows you to draw the pivot chart with multiple value fields as separate chart area.
      * @default false
      */
    enableMultiAxis?: boolean;

    /**
      * Enable or disable scroll bar while multiple axis.
      * @default false
      */
    enableScrollOnMultiAxis?: boolean;

    /**
      * Allow options to customize the title in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
      */
    titleStyle?: PivotChartFontModel;

    /**
      * Allows you to add title to the pivot chart.
      * @default ''
      */
    title?: string;

    /**
      * Allow options to customize the subtitle in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
      */
    subTitleStyle?: PivotChartFontModel;

    /**
      * Allows you to add the subtitle to the pivot chart.
      * @default ''
      */
    subTitle?: string;

    /**
      * Allow options to customize the border of the chart series such as color and border size in the pivot chart. 
      * For example, to display the chart series border color as red, set the properties `color` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"** and `width` to **0.5**.
      */
    border?: PivotChartBorderModel;

    /**
      *  Allow options to customize the left, right, top and bottom margins of the pivot chart.
      */
    margin?: PivotChartMarginModel;

    /**
      * Allow options to customize the chart area with a variety of settings such as background color, border, opacity and background image in the pivot chart. 
      * For example, to change the of the pivot chart's background, set the property `opacity` to **0.5**.
      */
    chartArea?: PivotChartAreaModel;

    /**
      * Allows you to change the background color of the chart series in the pivot chart. 
      * For example, to display the chart series with background color as red, set the property `background` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"**.
      * @default null
      */
    background?: string;

    /**
      * Allows you to draw a pivot chart with either material, fabric, bootstrap, highcontrast light, material dark, fabric dark, highcontrast, bootstrap dark, bootstrap4 theme.
      * @blazorType PivotChartTheme
      * @default 'Material'
      * @blazorDefaultValue PivotChartTheme.Material
      */
    theme?: ChartTheme;

    /**
      * Allows you to draw the chart series points with custom color in the pivot chart.
      * @default []
      */
    palettes?: string[];

    /**
      * Allow options to customize the crosshair line with different settings such as color and width of the line, 
      * line types that are shown horizontally and vertically to indicate the value of the axis at the mouse hover or touch position in the pivot chart.
      */
    crosshair?: PivotChartCrosshairSettingsModel;

    /**
      * Allow options to customize the tooltip of the pivot chart with different properties such as visibility of the tooltip, enableMarker, fill color, opacity, header for tooltip, 
      * format, textStyle, template, border, enableAnimation.
      */
    tooltip?: PivotTooltipSettingsModel;

    /**
      * Allow options to customize the center of pie series chart with properties x and y.
      */
    pieCenter?: PivotPieChartCenterModel;

    /**
      * Allow options to customize the pivot chart zooming with different properties such as enablePinchZooming, enableSelectionZooming, 
      * enableDeferredZooming, enableMouseWheelZooming, zoom modes, toolbarItems, enableScrollbar and enablePan.
      */
    zoomSettings?: PivotZoomSettingsModel;

    /**
      * Allow options for customizing legends with different properties such as legend visibility, 
      * height, width, position, legend padding, alignment, textStyle, border, margin, background, opacity, description, tabIndex in the pivot chart.
      */
    legendSettings?: LegendSettingsModel;

    /**
      * Allow options for customizing the selection mode to be done either by a specific series or point or cluster or by dragging it to the pivot chart. 
      * For example, to highlight a specific point in a specific series of the pivot chart, set the property `selectionMode` to **Point**. The available modes are,
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
      * Allow options for customizing the selection mode to be done either by a specific series or point or cluster 
      * or by dragging it to the pivot chart. For example, to highlight a specific point in a specific series of the 
      * pivot chart, set the property `accumulationSelectionMode` to **Point**. It is applicable for chart types pie,
      * funnel, doughnut and pyramid. The available modes are,
      * * none: Disables the selection.
      * * point: selects a point.
      * @default 'None'
      * @blazorType PivotAccumulationChartSelectionMode
      * @blazorDefaultValue PivotAccumulationChartSelectionMode.None
      */
    accumulationSelectionMode?: AccumulationSelectionMode;

    /**
      * Allows to set the labels placed smartly without overlapping. It is applicable for chart types pie,
      * funnel, doughnut and pyramid.
      * @default true
      */
    enableSmartLabels?: boolean;

    /**
      * Allows to Enable or disable the border in pie and doughnut chart while mouse moving.
      * @default true
      */
    enableBorderOnMouseMove?: boolean;

    /**
      * Specifies whether point has to get highlighted or not. It is applicable for chart types pie,
      * funnel, doughnut and pyramid. Takes value either 'None 'or 'Point'.
      * @default None
      * @blazorType PivotAccumulationChartSelectionMode
      * @blazorDefaultValue PivotAccumulationChartSelectionMode.None
      */
    highlightMode?: AccumulationSelectionMode;

    /**
      * Specifies whether series or data point for accumulation chart has to be selected. They are,
      * * none: sets none as selecting pattern to accumulation chart .
      * * chessboard: sets chess board as selecting pattern accumulation chart .
      * * dots: sets dots as  selecting pattern accumulation chart .
      * * diagonalForward: sets diagonal forward as selecting pattern to accumulation chart .
      * * crosshatch: sets crosshatch as selecting pattern to accumulation chart.
      * * pacman: sets pacman selecting pattern to accumulation chart.
      * * diagonalbackward: sets diagonal backward as selecting pattern to accumulation chart.
      * * grid: sets grid as selecting pattern to accumulation chart.
      * * turquoise: sets turquoise as selecting pattern to accumulation chart.
      * * star: sets star as selecting pattern to accumulation chart.
      * * triangle: sets triangle as selecting pattern to accumulation chart.
      * * circle: sets circle as selecting pattern to accumulation chart.
      * * tile: sets tile as selecting pattern to accumulation chart.
      * * horizontaldash: sets horizontal dash as selecting pattern to accumulation chart.
      * * verticaldash: sets vertical dash as selecting pattern to accumulation chart.
      * * rectangle: sets rectangle as selecting pattern.
      * * box: sets box as selecting pattern to accumulation chart.
      * * verticalstripe: sets vertical stripe as  selecting pattern to accumulation chart.
      * * horizontalstripe: sets horizontal stripe as selecting pattern to accumulation chart.
      * * bubble: sets bubble as selecting pattern to accumulation chart.
      * It is applicable for chart types pie, funnel, doughnut and pyramid.
      * @default None
      */
    highlightPattern?: SelectionPattern;

    /**
      * Allows the pivot chart to be exported to either **PDF** or **PNG** or **JPEG** or **SVG** filter formats.
      * @default true
      */
    enableExport?: boolean;

    /**
      * Allows you to perform multiple selection in the pivot chart. To enable this option, it requires the property `selectionMode` to be **Point** or **Series** or **Cluster**.
      * @default false
      */
    isMultiSelect?: boolean;

    /**
      * Allows you to highlight a specific point of the series while rendering the pivot chart. 
      * For example, to highlight first point in the first series, set the properties series to 0 and points to 1. To use this option, it requires the property `selectionMode` to be **Point** or **Series**.
      * @default []
      * @blazorType List<PivotChartIndexes>
      */
    selectedDataIndexes?: PivotChartIndexesModel[];

    /**
      * Allows you to enable/disable the tooltip animation while performing the mouse move from one point to another in the pivot chart.
      * @default true
      */
    enableAnimation?: boolean;

    /**
      * Allows the group separator to be shown to the values in the pivot chart.
      * @default true
      */
    useGroupingSeparator?: boolean;

    /**
      * Allows you to render the pivot chart in a transposed manner or not.
      * @default false
      */
    isTransposed?: boolean;

    /**
      * Allows you to highlight specific legends by clicking the mouse or by interacting with the keyboard in the pivot chart.
      * @default 1
      * @blazorType int
      */
    tabIndex?: number;

    /**
      * Allows you to add a description of the pivot chart.
      * @default null
      */
    description?: string;

    /**
      * It triggers after the pivot chart resized.
      * @event
      * @deprecated
      */
    resized?: EmitType<IResizeEventArgs>;

    /**
      * Allows you to draw points of the column type pivot chart series as side by side.
      * @default true
      */
    enableSideBySidePlacement?: boolean;

    /**
      * It triggers after the pivot chart loaded.
      * @event
      * @deprecated
      */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
      * It triggers before the pivot chart prints.
      * @event
      * @deprecated
      */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
      * It triggers after the pivot chart series animation is completed.
      * @event
      * @deprecated
      */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
      * It triggers before chart loads.
      * @event
      * @deprecated
      */
    load?: EmitType<ILoadedEventArgs>;

    /**
      * It triggers before the data label for series renders in the pivot chart.
      * @event
      * @deprecated
      */

    textRender?: EmitType<ITextRenderEventArgs>;

    /**
      * It triggers before the legend renders in the pivot chart.
      * @event
      * @deprecated
      */
    legendRender?: EmitType<ILegendRenderEventArgs>;

    /**
      * It triggers before the series is rendered in the pivot chart.
      * @event
      * @deprecated
      */
    seriesRender?: EmitType<ISeriesRenderEventArgs>;

    /**
      * It triggers before each points for the series is rendered.
      * @event
      * @deprecated
      */
    pointRender?: EmitType<IPointRenderEventArgs>;

    /**
      * It triggers before the tooltip for series is rendered.
      * @event
      * @deprecated
      */
    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
      * It triggers before each axis label is rendered.
      * @event
      * @deprecated
      */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
      * It triggers when clicked multi-level label.
      * @event
      * @deprecated
      */
    multiLevelLabelClick?: EmitType<MultiLevelLabelClickEventArgs>;

    /**
      * It triggers on clicking the pivot chart.
      * @event
      * @deprecated
      */
    chartMouseClick?: EmitType<IMouseEventArgs>;

    /**
      * It triggers on hovering the pivot chart.
      * @event
      * @deprecated
      */
    chartMouseMove?: EmitType<IMouseEventArgs>;

    /**
      * It triggers on series point move.
      * @event
      * @deprecated
      */
    pointMove?: EmitType<IPointEventArgs>;

    /**
      * It triggers on series point click.
      * @event
      * @deprecated
      */
    pointClick?: EmitType<IPointEventArgs>;

    /**
      * It triggers when mouse down on chart series.
      * @event
      * @deprecated
      */
    chartMouseDown?: EmitType<IMouseEventArgs>;

    /**
      * It triggers when cursor leaves the chart.
      * @event
      * @deprecated
      */
    chartMouseLeave?: EmitType<IMouseEventArgs>;

    /**
      * It triggers after the drag selection is completed on chart series.
      * @event
      * @deprecated
      */
    dragComplete?: EmitType<IDragCompleteEventArgs>;

    /**
      * It triggers when mouse up on chart series.
      * @event
      * @deprecated
      */
    chartMouseUp?: EmitType<IMouseEventArgs>;

    /**
      * It triggers when start scroll the chart series.
      * @event
      * @deprecated
      */
    scrollStart?: EmitType<IScrollEventArgs>;

    /**
      * It triggers after the zoom selection is completed.
      * @event
      * @deprecated
      */
    zoomComplete?: EmitType<IZoomCompleteEventArgs>;

    /**
      * It triggers when change the scroll of the chart seires.
      * @event
      * @deprecated
      */
    scrollChanged?: EmitType<IScrollEventArgs>;

    /**
      * It triggers after the scroll end.
      * @event
      * @deprecated
      */
    scrollEnd?: EmitType<IScrollEventArgs>;

    /**
      * Allows you to display the multi-level label feature in the pivot chart. This multi-level labels used to perform drill operation in the pivot chart.
      * @default true
      */
    showMultiLevelLabels?: boolean;

}