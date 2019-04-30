import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';
import { BorderModel, Border, ErrorBarSettingsModel, ErrorBarSettings, MarkerSettingsModel, ChartDrawType } from '@syncfusion/ej2-charts';
import { TrendlineModel, Trendline, LegendShape, SplineType, EmptyPointSettingsModel, EmptyPointSettings } from '@syncfusion/ej2-charts';
import { CornerRadius, AnimationModel, ChartSegmentModel, ChartSegment, Segment, Animation, FontModel } from '@syncfusion/ej2-charts';
import { EdgeLabelPlacement, LabelPlacement, AxisPosition, MajorTickLinesModel, MinorTickLinesModel } from '@syncfusion/ej2-charts';
import { MinorGridLinesModel, AxisLineModel, LabelBorderModel, Theme, Font, MarginModel, Margin } from '@syncfusion/ej2-charts';
import { ChartAreaModel, ChartArea, ChartTheme, CrosshairSettings, LegendSettingsModel, IndexesModel } from '@syncfusion/ej2-charts';
import { Indexes, IResizeEventArgs, IPrintEventArgs, ILoadedEventArgs, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';
import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';
import { IMouseEventArgs, IPointEventArgs, IDragCompleteEventArgs, IScrollEventArgs } from '@syncfusion/ej2-charts';
import { LabelIntersectAction, ZoomMode, ToolbarItems, MajorTickLines, MinorTickLines, MajorGridLines } from '@syncfusion/ej2-charts';
import { MarkerSettings, CornerRadiusModel, MajorGridLinesModel, StripLineSettingsModel } from '@syncfusion/ej2-charts';
import { IAnimationCompleteEventArgs, IAxisLabelRenderEventArgs, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';
import { MinorGridLines, AxisLine, StripLineSettings, LabelBorder, CrosshairTooltipModel } from '@syncfusion/ej2-charts';
import { CrosshairTooltip, CrosshairSettingsModel } from '@syncfusion/ej2-charts';
import { PivotSeriesModel, PivotAxisModel, PivotTooltipSettingsModel, PivotZoomSettingsModel } from './chartsettings-model';
import { ChartSeriesType, ChartSelectionMode } from '../../common';

/**
 *  Configures the series in charts.
 */
export class PivotSeries extends ChildProperty<PivotSeries> {

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Options to customizing animation for the series.
     * @default null
     */
    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */
    @Property('0')
    public dashArray: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * @default 1
     */
    @Property(1)
    public width: number;


    /**
     * Defines the axis, based on which the line series will be split.
     */
    @Property('X')
    public segmentAxis: Segment;

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
    @Property('Line')
    public drawType: ChartDrawType;

    /**
     * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
     * @default true
     */
    @Property(true)
    public isClosed: boolean;

    /**
     * Defines the collection of regions that helps to differentiate a line series.
     */
    @Collection<ChartSegmentModel>([], ChartSegment)
    public segments: ChartSegmentModel[];

    /**
     * This property allows grouping series in `stacked column / bar` charts.
     * Any string value can be provided to the stackingGroup property.
     * If any two or above series have the same value, those series will be grouped together.
     * @default ''
     */
    @Property('')
    public stackingGroup: string;

    /**
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Specifies the visibility of series.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * The opacity of the series.
     * @default 1
     */
    @Property(1)
    public opacity: number;

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

    @Property('Line')
    public type: ChartSeriesType;

    /**
     * Options for displaying and customizing markers for individual points in a series.
     */
    @Complex<MarkerSettingsModel>(null, MarkerSettings)
    public marker: MarkerSettingsModel;

    /**
     * Options for displaying and customizing error bar for individual point in a series.
     */
    @Complex<ErrorBarSettingsModel>(null, ErrorBarSettings)
    public errorBar: ErrorBarSettingsModel;

    /**
     * If set true, the Tooltip for series will be visible.
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * Defines the collection of trendlines that are used to predict the trend
     */
    @Collection<TrendlineModel>([], Trendline)
    public trendlines: TrendlineModel[];

    /**
     * The provided value will be considered as a Tooltip name 
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

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

    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * Minimum radius
     * @default 1
     */
    @Property(1)
    public minRadius: number;

    /**
     * Custom style for the selected series or points.
     * @default null
     */
    @Property(null)
    public selectionStyle: string;

    /**
     * Defines type of spline to be rendered.
     * @default 'Natural'
     */
    @Property('Natural')
    public splineType: SplineType;

    /**
     * Maximum radius
     * @default 3
     */
    @Property(3)
    public maxRadius: number;

    /**
     * It defines tension of cardinal spline types
     * @default 0.5
     */
    @Property(0.5)
    public cardinalSplineTension: number;

    /**
     * To render the column series points with particular column width.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public columnWidth: number;

    /**
     * options to customize the empty points in series
     */
    @Complex<EmptyPointSettingsModel>(null, EmptyPointSettings)
    public emptyPointSettings: EmptyPointSettingsModel;


    /**
     * To render the column series points with particular rounded corner.
     */
    @Complex<CornerRadiusModel>(null, CornerRadius)
    public cornerRadius: CornerRadiusModel;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     * @default 0
     */
    @Property(0)
    public columnSpacing: number;
}

/**
 * Configures the axes in charts.
 */
export class PivotAxis extends ChildProperty<PivotAxis> {

    /**
     * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.     
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * @default Rotate45
     */
    @Property('Rotate45')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * Options to customize the axis label.
     */
    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public labelStyle: FontModel;

    /**
     * Specifies the title of an axis.
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Options to customize the crosshair ToolTip.
     */
    @Complex<CrosshairTooltipModel>({}, CrosshairTooltip)
    public crosshairTooltip: CrosshairTooltipModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */
    @Property('')
    public labelFormat: string;

    /**
     * Options for customizing the axis title.
     */
    @Complex<FontModel>(Theme.axisTitleFont, Font)
    public titleStyle: FontModel;

    /**
     * Specifies indexed category  axis.
     * @default false
     */
    @Property(false)
    public isIndexed: boolean;

    /**
     * Left and right padding for the plot area in pixels.
     * @default 0
     */
    @Property(0)
    public plotOffset: number;

    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * Shift: Shifts the edge labels.
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.     
     * @default 'None'
     */
    @Property('None')
    public edgeLabelPlacement: EdgeLabelPlacement;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * onTicks: Renders the label on the ticks.     
     * * betweenTicks: Renders the label between the ticks.
     * @default 'BetweenTicks'
     */
    @Property('BetweenTicks')
    public labelPlacement: LabelPlacement;

    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * outside: Renders the ticks outside to the axis line.     
     * * inside: Renders the ticks inside to the axis line.
     * @default 'Outside'
     */
    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */
    @Property(false)
    public opposedPosition: boolean;

    /**
     * If set to true, axis label will be visible.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * outside: Renders the labels outside to the axis line.     
     * * inside: Renders the labels inside to the axis line.
     * @default 'Outside'
     */
    @Property('Outside')
    public labelPosition: AxisPosition;

    /**
     * The angle to which the axis label gets rotated.
     * @default 0
     */
    @Property(0)
    public labelRotation: number;

    /**
     * Specifies the number of minor ticks per interval.
     * @default 0
     */
    @Property(0)
    public minorTicksPerInterval: number;

    /**
     * Specifies the maximum range of an axis.
     * @default null
     */
    @Property(null)
    public maximum: Object;

    /**
     * Specifies the minimum range of an axis.
     * @default null
     */
    @Property(null)
    public minimum: Object;

    /**
     * Specifies the maximum width of an axis label.
     * @default 34.
     */
    @Property(34)
    public maximumLabelWidth: number;

    /**
     * Specifies the interval for an axis.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public interval: number;

    /**
     * Options for customizing major tick lines.
     */
    @Complex<MajorTickLinesModel>({}, MajorTickLines)
    public majorTickLines: MajorTickLinesModel;

    /**
     * Specifies the Trim property for an axis.
     * @default false
     */
    @Property(false)
    public enableTrim: boolean;

    /**
     * Options for customizing major grid lines.
     */
    @Complex<MajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: MajorGridLinesModel;

    /**
     * Options for customizing minor tick lines.
     */
    @Complex<MinorTickLinesModel>({}, MinorTickLines)
    public minorTickLines: MinorTickLinesModel;

    /**
     * Options for customizing axis lines.
     */
    @Complex<AxisLineModel>({}, AxisLine)
    public lineStyle: AxisLineModel;

    /**
     * Options for customizing minor grid lines.
     */
    @Complex<MinorGridLinesModel>({}, MinorGridLines)
    public minorGridLines: MinorGridLinesModel;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.
     * @default false
     */
    @Property(false)
    public isInversed: boolean;

    /**
     * Description for axis and its element.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * The start angle for the series.
     * @default 0
     */
    @Property(0)
    public startAngle: number;

    /**
     * The polar radar radius position.
     * @default 100
     */
    @Property(100)
    public coefficient: number;

    /**
     * Specifies the stripLine collection for the axis
     */
    @Collection<StripLineSettings>([], StripLineSettings)
    public stripLines: StripLineSettingsModel[];

    /**
     * TabIndex value for the axis.
     * @default 2
     */
    @Property(2)
    public tabIndex: number;

    /**
     * Border of the multi level labels.
     */
    @Complex<LabelBorderModel>({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    public border: LabelBorderModel;
}


/**
 * Configures the ToolTips in the chart.
 */
export class PivotTooltipSettings extends ChildProperty<PivotTooltipSettings> {


    /**
     * Enables / Disables the visibility of the marker.
     * @default false.
     */
    @Property(false)
    public enableMarker: boolean;

    /**
     * Enables / Disables the visibility of the tooltip.
     * @default true.
     */
    @Property(true)
    public enable: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @default null 
     */

    @Property(null)
    public fill: string;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     * @default false.
     */
    @Property(false)
    public shared: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
     * @default 0.75
     */
    @Property(0.75)
    public opacity: number;

    /**
     * Header for tooltip. 
     * @default null
     */
    @Property(null)
    public header: string;

    /**
     * Format the ToolTip content.
     * @default null.
     */
    @Property(null)
    public format: string;

    /**
     * Options to customize the ToolTip text.
     */
    @Complex<FontModel>(Theme.tooltipLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     */
    @Property(null)
    public template: string;

    /**
     * Options to customize tooltip borders.
     */
    @Complex<BorderModel>({ color: '#cccccc', width: 0.5 }, Border)
    public border: BorderModel;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     * @default true.
     */
    @Property(true)
    public enableAnimation: boolean;
}

/**
 * Configures the zooming behavior for the chart.
 */
export class PivotZoomSettings extends ChildProperty<PivotZoomSettings> {

    /**
     * If to true, chart can be pinched to zoom in / zoom out.
     * @default false
     */
    @Property(false)
    public enablePinchZooming: boolean;

    /**
     * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.
     * @default true
     */
    @Property(true)
    public enableSelectionZooming: boolean;

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

    @Property(false)
    public enableDeferredZooming: boolean;

    /**
     * If set to true, chart can be zoomed by using mouse wheel.
     * @default false
     */
    @Property(false)
    public enableMouseWheelZooming: boolean;

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
    @Property('XY')
    public mode: ZoomMode;

    /**
     * Specifies the toolkit options for the zooming as follows:
     * * ZoomIn
     * * ZoomOut
     * * Pan     
     * * Zoom
     * * Reset
     * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
     */

    @Property(['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'])
    public toolbarItems: ToolbarItems[];

    /**
     * Specifies whether axis needs to have scrollbar.
     * @default true.
     */
    @Property(true)
    public enableScrollbar: boolean;

    /**
     * Specifies whether chart needs to be panned by default.
     * @default false.
     */
    @Property(false)
    public enablePan: boolean;
}

/** 
 *  Configures the chart settings.
 */
export class ChartSettings extends ChildProperty<ChartSettings> {

    /**     
     * Options to configures the series of chart.
     */
    @Complex<PivotSeriesModel>({}, PivotSeries)
    public chartSeries: PivotSeriesModel;

    /**     
     * Options to configure the horizontal axis of chart.
     */
    @Complex<PivotAxisModel>({}, PivotAxis)
    public primaryXAxis: PivotAxisModel;

    /**     
     * Options to configure the vertical axis of chart.
     */
    @Complex<PivotAxisModel>({}, PivotAxis)
    public primaryYAxis: PivotAxisModel;

    /**     
     * Defines the measure to load in chart
     * @default ''
     */
    @Property('')
    public value: string;

    /**     
     * Defines the measure to load in chart
     * @default false
     */
    @Property(false)
    public enableMultiAxis: boolean;

    /**
     * Options for customizing the title of the Chart.
     */
    @Complex<FontModel>(Theme.chartTitleFont, Font)
    public titleStyle: FontModel;

    /**
     * Title of the chart
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Options for customizing the Subtitle of the Chart.
     */
    @Complex<FontModel>(Theme.chartSubTitleFont, Font)
    public subTitleStyle: FontModel;

    /**
     * SubTitle of the chart
     * @default ''
     */
    @Property('')
    public subTitle: string;

    /**
     * Options for customizing the color and width of the chart border.
     */
    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for configuring the border and background of the chart area.
     */
    @Complex<ChartAreaModel>({ border: { color: null, width: 0.5 }, background: 'transparent' }, ChartArea)
    public chartArea: ChartAreaModel;

    /**
     * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Specifies the theme for the chart.
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Palette for the chart series.
     * @default []
     */
    @Property([])
    public palettes: string[];


    /**
     * Options for customizing the crosshair of the chart.
     */
    @Complex<CrosshairSettingsModel>({}, CrosshairSettings)
    public crosshair: CrosshairSettingsModel;

    /**
     * Options for customizing the tooltip of the chart.
     */
    @Complex<PivotTooltipSettingsModel>({}, PivotTooltipSettings)
    public tooltip: PivotTooltipSettingsModel;

    /**
     * Options to enable the zooming feature in the chart.
     */
    @Complex<PivotZoomSettingsModel>({}, PivotZoomSettings)
    public zoomSettings: PivotZoomSettingsModel;

    /**
     * Options for customizing the legend of the chart.
     */
    @Property()
    public legendSettings: LegendSettingsModel;

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
    @Property('None')
    public selectionMode: ChartSelectionMode;

    /**
     * To enable export feature in chart.
     * @default true
     */
    @Property(true)
    public enableExport: boolean;

    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

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
    @Collection<IndexesModel>([], Indexes)
    public selectedDataIndexes: IndexesModel[];

    /**
     * If set true, Animation process will be executed.
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * It specifies whether the chart should be render in transposed manner or not.
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * TabIndex value for the chart.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    /**
     * Description for chart.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Triggers after resizing of chart
     * @event
     */
    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * To enable the side by side placing the points for column type series.
     * @default true
     */
    @Property(true)
    public enableSideBySidePlacement: boolean;

    /**
     * Triggers after chart load.
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /**
     * Triggers after animation is completed for the series.
     * @event
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before chart load.
     * @event
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the data label for series is rendered.
     * @event
     */

    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * @event
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     */
    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;

    /**
     * Triggers before each points for the series is rendered.
     * @event
     */
    @Event()
    public pointRender: EmitType<IPointRenderEventArgs>;

    /**
     * Triggers before the tooltip for series is rendered.
     * @event
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before each axis label is rendered.
     * @event
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers on clicking the chart.
     * @event
     */
    @Event()
    public chartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers on hovering the chart.
     * @event
     */
    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point move.
     * @event
     */
    @Event()
    public pointMove: EmitType<IPointEventArgs>;

    /**
     * Triggers on point click.
     * @event
     */
    @Event()
    public pointClick: EmitType<IPointEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     */
    @Event()
    public chartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers when cursor leaves the chart.
     * @event
     */
    @Event()
    public chartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers after the drag selection is completed.
     * @event
     */
    @Event()
    public dragComplete: EmitType<IDragCompleteEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     */
    @Event()
    public chartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers when start the scroll.
     * @event
     */
    @Event()
    public scrollStart: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     * @event
     */
    @Event()
    public zoomComplete: EmitType<IZoomCompleteEventArgs>;

    /**
     * Triggers when change the scroll.
     * @event
     */
    @Event()
    public scrollChanged: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the scroll end.
     * @event
     */
    @Event()
    public scrollEnd: EmitType<IScrollEventArgs>;
}
