import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';import { BorderModel, Border, ErrorBarSettingsModel, ErrorBarSettings, MarkerSettingsModel, ChartDrawType } from '@syncfusion/ej2-charts';import { TrendlineModel, Trendline, LegendShape, SplineType, EmptyPointSettingsModel, EmptyPointSettings } from '@syncfusion/ej2-charts';import { CornerRadius, AnimationModel, ChartSegmentModel, ChartSegment, Segment, Animation, FontModel } from '@syncfusion/ej2-charts';import { EdgeLabelPlacement, LabelPlacement, AxisPosition, MajorTickLinesModel, MinorTickLinesModel } from '@syncfusion/ej2-charts';import { MinorGridLinesModel, AxisLineModel, LabelBorderModel, Theme, Font, MarginModel, Margin } from '@syncfusion/ej2-charts';import { ChartAreaModel, ChartArea, ChartTheme, CrosshairSettings, LegendSettingsModel, IndexesModel } from '@syncfusion/ej2-charts';import { Indexes, IResizeEventArgs, IPrintEventArgs, ILoadedEventArgs, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';import { IMouseEventArgs, IPointEventArgs, IDragCompleteEventArgs, IScrollEventArgs } from '@syncfusion/ej2-charts';import { LabelIntersectAction, ZoomMode, ToolbarItems, MajorTickLines, MinorTickLines, MajorGridLines } from '@syncfusion/ej2-charts';import { MarkerSettings, CornerRadiusModel, MajorGridLinesModel, StripLineSettingsModel } from '@syncfusion/ej2-charts';import { IAnimationCompleteEventArgs, IAxisLabelRenderEventArgs, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';import { MinorGridLines, AxisLine, StripLineSettings, LabelBorder, CrosshairTooltipModel } from '@syncfusion/ej2-charts';import { CrosshairTooltip, CrosshairSettingsModel } from '@syncfusion/ej2-charts';import { ChartSeriesType, ChartSelectionMode } from '../../common';

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
    animation?: AnimationModel;

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
    segments?: ChartSegmentModel[];

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
    marker?: MarkerSettingsModel;

    /**
     * Options for displaying and customizing error bar for individual point in a series.
     */
    errorBar?: ErrorBarSettingsModel;

    /**
     * If set true, the Tooltip for series will be visible.
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Defines the collection of trendlines that are used to predict the trend
     */
    trendlines?: TrendlineModel[];

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
     * @default Rotate45
     */
    labelIntersectAction?: LabelIntersectAction;

    /**
     * Options to customize the axis label.
     */
    labelStyle?: FontModel;

    /**
     * Specifies the title of an axis.
     * @default ''
     */
    title?: string;

    /**
     * Options to customize the crosshair ToolTip.
     */
    crosshairTooltip?: CrosshairTooltipModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */
    labelFormat?: string;

    /**
     * Options for customizing the axis title.
     */
    titleStyle?: FontModel;

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
     * @default 'None'
     */
    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * onTicks: Renders the label on the ticks.     
     * * betweenTicks: Renders the label between the ticks.
     * @default 'BetweenTicks'
     */
    labelPlacement?: LabelPlacement;

    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * outside: Renders the ticks outside to the axis line.     
     * * inside: Renders the ticks inside to the axis line.
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
     */
    interval?: number;

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
    stripLines?: StripLineSettingsModel[];

    /**
     * TabIndex value for the axis.
     * @default 2
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
    textStyle?: FontModel;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     */
    template?: string;

    /**
     * Options to customize tooltip borders.
     */
    border?: BorderModel;

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
    titleStyle?: FontModel;

    /**
     * Title of the chart
     * @default ''
     */
    title?: string;

    /**
     * Options for customizing the Subtitle of the Chart.
     */
    subTitleStyle?: FontModel;

    /**
     * SubTitle of the chart
     * @default ''
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
     * @default null
     */
    background?: string;

    /**
     * Specifies the theme for the chart.
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
     */
    selectedDataIndexes?: IndexesModel[];

    /**
     * If set true, Animation process will be executed.
     * @default true
     */
    enableAnimation?: boolean;

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

}