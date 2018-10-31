import { Component, Property, NotifyPropertyChanges, Internationalization, BaseAttibutes } from '@syncfusion/ej2-base';
import { ModuleDeclaration, L10n } from '@syncfusion/ej2-base';
import { TapEventArgs, EmitType, ChildProperty } from '@syncfusion/ej2-base';
import { remove, extend } from '@syncfusion/ej2-base';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { INotifyPropertyChanged, SvgRenderer, Browser, Touch } from '@syncfusion/ej2-base';
import { Event, EventHandler, Complex, Collection } from '@syncfusion/ej2-base';
import { findClipRect, measureText, TextOption, showTooltip, removeElement, appendChildElement } from '../common/utils/helper';
import { textElement, RectOption, createSvg, firstToLowerCase, titlePositionX, PointData, redrawElement } from '../common/utils/helper';
import { appendClipElement } from '../common/utils/helper';
import { ChartModel, CrosshairSettingsModel, ZoomSettingsModel } from './chart-model';
import { MarginModel, BorderModel, ChartAreaModel, FontModel, TooltipSettingsModel } from '../common/model/base-model';
import { getSeriesColor, Theme, getThemeColor } from '../common/model/theme';
import { IndexesModel } from '../common/model/base-model';
import { Margin, Border, ChartArea, Font, Indexes, TooltipSettings } from '../common/model/base';
import { AxisModel, RowModel, ColumnModel } from './axis/axis-model';
import { Row, Column, Axis } from './axis/axis';
import { CartesianAxisLayoutPanel } from './axis/cartesian-panel';
import { DateTime } from './axis/date-time-axis';
import { Category } from './axis/category-axis';
import { DateTimeCategory } from './axis/date-time-category-axis';
import { CandleSeries } from './series/candle-series';
import { ErrorBar } from './series/error-bar';
import { Logarithmic } from './axis/logarithmic-axis';
import { Size, Rect } from '../common/utils/helper';
import { ChartData } from './utils/get-data';
import { SelectionMode, LineType, ZoomMode, ToolbarItems, ChartTheme } from './utils/enum';
import { Series, SeriesBase } from './series/chart-series';
import { SeriesModel } from './series/chart-series-model';
import { Data } from '../common/model/data';
import { LineSeries } from './series/line-series';
import { AreaSeries } from './series/area-series';
import { BarSeries } from './series/bar-series';
import { HistogramSeries } from './series/histogram-series';
import { StepLineSeries } from './series/step-line-series';
import { StepAreaSeries } from './series/step-area-series';
import { ColumnSeries } from './series/column-series';
import { ParetoSeries } from './series/pareto-series';
import { StackingColumnSeries } from './series/stacking-column-series';
import { StackingBarSeries } from './series/stacking-bar-series';
import { StackingAreaSeries } from './series/stacking-area-series';
import { ScatterSeries } from './series/scatter-series';
import { SplineSeries } from './series/spline-series';
import { SplineAreaSeries } from './series/spline-area-series';
import { RangeColumnSeries } from './series/range-column-series';
import { PolarSeries } from './series/polar-series';
import { RadarSeries } from './series/radar-series';
import { HiloSeries } from './series/hilo-series';
import { HiloOpenCloseSeries } from './series/hilo-open-close-series';
import { WaterfallSeries } from './series/waterfall-series';
import { BubbleSeries } from './series/bubble-series';
import { RangeAreaSeries } from './series/range-area-series';
import { Tooltip } from './user-interaction/tooltip';
import { Crosshair } from './user-interaction/crosshair';
import { Marker } from './series/marker';
import { LegendSettings } from '../common/legend/legend';
import { LegendSettingsModel } from '../common/legend/legend-model';
import { Legend } from './legend/legend';
import { Zoom } from './user-interaction/zooming';
import { Selection } from './user-interaction/selection';
import { DataLabel } from './series/data-label';
import { StripLine } from './axis/strip-line';
import { MultiLevelLabel } from './axis/multi-level-labels';
import { BoxAndWhiskerSeries } from './series/box-and-whisker-series';
import { PolarRadarPanel } from './axis/polar-radar-panel';
import { StripLineSettingsModel } from './model/chart-base-model';
import { Trendline } from './series/chart-series';
import { Trendlines } from './trend-lines/trend-line';
import { TechnicalIndicator } from './technical-indicators/technical-indicator';
import { SmaIndicator } from './technical-indicators/sma-indicator';
import { EmaIndicator } from './technical-indicators/ema-indicator';
import { TmaIndicator } from './technical-indicators/tma-indicator';
import { AccumulationDistributionIndicator } from './technical-indicators/ad-indicator';
import { AtrIndicator } from './technical-indicators/atr-indicator';
import { BollingerBands } from './technical-indicators/bollinger-bands';
import { MomentumIndicator } from './technical-indicators/momentum-indicator';
import { StochasticIndicator } from './technical-indicators/stochastic-indicator';
import { MacdIndicator } from './technical-indicators/macd-indicator';
import { RsiIndicator } from './technical-indicators/rsi-indicator';
import { TechnicalIndicatorModel } from './technical-indicators/technical-indicator-model';
import { ILegendRenderEventArgs, IAxisLabelRenderEventArgs, ITextRenderEventArgs, IResizeEventArgs } from '../common/model/interface';
import { IAnnotationRenderEventArgs, IAxisMultiLabelRenderEventArgs, IThemeStyle, IScrollEventArgs } from '../common/model/interface';
import { IPointRenderEventArgs, ISeriesRenderEventArgs, IDragCompleteEventArgs, ITooltipRenderEventArgs } from '../common/model/interface';
import { IZoomCompleteEventArgs, ILoadedEventArgs } from '../common/model/interface';
import { IAnimationCompleteEventArgs, IMouseEventArgs, IPointEventArgs } from '../common/model/interface';
import { loaded, chartMouseClick, pointClick, pointMove, chartMouseLeave, resized } from '../common/model/constants';
import { chartMouseDown, chartMouseMove, chartMouseUp, load } from '../common/model/constants';
import { IPrintEventArgs, IAxisRangeCalculatedEventArgs } from '../common/model/interface';
import { ExportUtils } from '../common/utils/export';
import { ChartAnnotationSettingsModel } from './model/chart-base-model';
import { ChartAnnotationSettings } from './model/chart-base';
import { ChartAnnotation } from './annotation/annotation';
import { getElement, getTitle } from '../common/utils/helper';
import { ExportType, Alignment } from '../common/utils/enum';
import { MultiColoredLineSeries } from './series/multi-colored-line-series';
import { MultiColoredAreaSeries } from './series/multi-colored-area-series';
import { ScrollBar } from '../common/scrollbar/scrollbar';
import { AccumulationChart, RangeNavigator } from '..';
import { DataManager } from '@syncfusion/ej2-data';
/**
 * Configures the crosshair in the chart.
 */
export class CrosshairSettings extends ChildProperty<CrosshairSettings> {
    /**
     * If set to true, crosshair line becomes visible.
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Options to customize the crosshair line.
     */
    @Complex<BorderModel>({ color: null, width: 1 }, Border)
    public line: BorderModel;

    /**
     * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
     * * None: Hides both vertical and horizontal crosshair lines.
     * * Both: Shows both vertical and horizontal crosshair lines.
     * * Vertical: Shows the vertical line.
     * * Horizontal: Shows the horizontal line.
     * @default Both
     */
    @Property('Both')
    public lineType: LineType;

}
/**
 * Configures the zooming behavior for the chart.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {

    /**
     * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.
     * @default false
     */

    @Property(false)
    public enableSelectionZooming: boolean;

    /**
     * If to true, chart can be pinched to zoom in / zoom out.
     * @default false
     */

    @Property(false)
    public enablePinchZooming: boolean;

    /**
     * If set to true, chart can be zoomed by using mouse wheel.
     * @default false
     */

    @Property(false)
    public enableMouseWheelZooming: boolean;

    /**
     * If set to true, zooming will be performed on mouse up. It requires `enableSelectionZooming` to be true.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    zoomSettings: {
     *      enableSelectionZooming: true,
     *      enableDeferredZooming: false
     *    }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default true
     */

    @Property(true)
    public enableDeferredZooming: boolean;

    /**
     * Specifies whether to allow zooming vertically or horizontally or in both ways. They are,
     * * x,y: Chart can be zoomed both vertically and horizontally.
     * * x: Chart can be zoomed horizontally.
     * * y: Chart can be zoomed  vertically.
     *  It requires `enableSelectionZooming` to be true.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    zoomSettings: {
     *      enableSelectionZooming: true,
     *      mode: 'XY'
     *    }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default 'XY'
     */
    @Property('XY')
    public mode: ZoomMode;

    /**
     * Specifies the toolkit options for the zooming as follows:
     * * Zoom
     * * ZoomIn
     * * ZoomOut
     * * Pan
     * * Reset
     * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
     */

    @Property(['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'])
    public toolbarItems: ToolbarItems[];

    /**
     * Specifies whether chart needs to be panned by default.
     * @default false.
     */

    @Property(false)
    public enablePan: boolean;

    /**
     * Specifies whether axis needs to have scrollbar.
     * @default false.
     */

    @Property(false)
    public enableScrollbar: boolean;


}

/**
 * Represents the Chart control.
 * ```html
 * <div id="chart"/>
 * <script>
 *   var chartObj = new Chart({ isResponsive : true });
 *   chartObj.appendTo("#chart");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Chart extends Component<HTMLElement> implements INotifyPropertyChanged {


    //Module Declaration of Chart.
    /**
     * `lineSeriesModule` is used to add line series to the chart.
     */
    public lineSeriesModule: LineSeries;
    /**
     * `multiColoredLineSeriesModule` is used to add multi colored line series to the chart.
     */
    public multiColoredLineSeriesModule: MultiColoredLineSeries;
    /**
     * `multiColoredAreaSeriesModule` is used to add multi colored area series to the chart.
     */
    public multiColoredAreaSeriesModule: MultiColoredAreaSeries;
    /**
     * `columnSeriesModule` is used to add column series to the chart.
     */
    public columnSeriesModule: ColumnSeries;
    /**
     * `ParetoSeriesModule` is used to add pareto series in the chart.
     */
    public paretoSeriesModule: ParetoSeries;
    /**
     * `areaSeriesModule` is used to add area series in the chart.
     */
    public areaSeriesModule: AreaSeries;
    /**
     * `barSeriesModule` is used to add bar series to the chart.
     */
    public barSeriesModule: BarSeries;
    /**
     * `stackingColumnSeriesModule` is used to add stacking column series in the chart.
     */
    public stackingColumnSeriesModule: StackingColumnSeries;
    /**
     * `stackingAreaSeriesModule` is used to add stacking area series to the chart.
     */
    public stackingAreaSeriesModule: StackingAreaSeries;
    /**
     * 'CandleSeriesModule' is used to add candle series in the chart.
     */
    public candleSeriesModule: CandleSeries;
    /**
     * `stackingBarSeriesModule` is used to add stacking bar series to the chart.
     */
    public stackingBarSeriesModule: StackingBarSeries;
    /**
     * `stepLineSeriesModule` is used to add step line series to the chart.
     */
    public stepLineSeriesModule: StepLineSeries;
    /**
     * `stepAreaSeriesModule` is used to add step area series to the chart.
     */
    public stepAreaSeriesModule: StepAreaSeries;
    /**
     * `polarSeriesModule` is used to add polar series in the chart.
     */
    public polarSeriesModule: PolarSeries;
    /**
     *  `radarSeriesModule` is used to add radar series in the chart.
     */
    public radarSeriesModule: RadarSeries;
    /**
     * `splineSeriesModule` is used to add spline series to the chart.
     */
    public splineSeriesModule: SplineSeries;
    /**
     * `splineAreaSeriesModule` is used to add spline area series to the chart.
     */
    public splineAreaSeriesModule: SplineAreaSeries;
    /**
     * `scatterSeriesModule` is used to add scatter series to the chart.
     */
    public scatterSeriesModule: ScatterSeries;
    /**
     * `boxAndWhiskerSeriesModule` is used to add line series to the chart.
     */
    public boxAndWhiskerSeriesModule: BoxAndWhiskerSeries;
    /**
     * `rangeColumnSeriesModule` is used to add rangeColumn series to the chart.
     */
    public rangeColumnSeriesModule: RangeColumnSeries;
    /**
     * histogramSeriesModule is used to add histogram series in chart
     */
    public histogramSeriesModule: HistogramSeries;
    /**
     * hiloSeriesModule is used to add hilo series in chart
     */
    public hiloSeriesModule: HiloSeries;
    /**
     * hiloOpenCloseSeriesModule is used to add hilo series in chart
     */
    public hiloOpenCloseSeriesModule: HiloOpenCloseSeries;
    /**
     * `waterfallSeries` is used to add waterfall series in chart.
     */
    public waterfallSeriesModule: WaterfallSeries;
    /**
     * `bubbleSeries` is used to add bubble series in chart.
     */
    public bubbleSeriesModule: BubbleSeries;
    /**
     * `rangeAreaSeriesModule` is used to add rangeArea series in chart.
     */
    public rangeAreaSeriesModule: RangeAreaSeries;
    /**
     * `tooltipModule` is used to manipulate and add tooltip to the series.
     */
    public tooltipModule: Tooltip;
    /**
     * `crosshairModule` is used to manipulate and add crosshair to the chart.
     */
    public crosshairModule: Crosshair;
    /**
     * `errorBarModule` is used to manipulate and add errorBar for series.
     */
    public errorBarModule: ErrorBar;
    /**
     * `dataLabelModule` is used to manipulate and add data label to the series.
     */
    public dataLabelModule: DataLabel;
    /**
     * `datetimeModule` is used to manipulate and add dateTime axis to the chart.
     */
    public dateTimeModule: DateTime;
    /**
     * `categoryModule` is used to manipulate and add category axis to the chart.
     */
    public categoryModule: Category;
    /**
     * `dateTimeCategoryModule` is used to manipulate date time and category axis
     */
    public dateTimeCategoryModule: DateTimeCategory;
    /**
     * `logarithmicModule` is used to manipulate and add log axis to the chart.
     */
    public logarithmicModule: Logarithmic;
    /**
     * `legendModule` is used to manipulate and add legend to the chart.
     */
    public legendModule: Legend;
    /**
     * `zoomModule` is used to manipulate and add zooming to the chart.
     */
    public zoomModule: Zoom;
    /**
     * `selectionModule` is used to manipulate and add selection to the chart.
     */
    public selectionModule: Selection;
    /**
     * `annotationModule` is used to manipulate and add annotation in chart.
     */
    public annotationModule: ChartAnnotation;
    /**
     * `stripLineModule` is used to manipulate and add stripLine in chart.
     */
    public stripLineModule: StripLine;
    /**
     * `multiLevelLabelModule` is used to manipulate and add multiLevelLabel in chart.
     */
    public multiLevelLabelModule: MultiLevelLabel;

    /**
     * 'TrendlineModule' is used to predict the market trend using trendlines
     */
    public trendLineModule: Trendlines;

    /**
     * `sMAIndicatorModule` is used to predict the market trend using SMA approach
     */
    public sMAIndicatorModule: SmaIndicator;

    /**
     * `eMAIndicatorModule` is used to predict the market trend using EMA approach
     */
    public eMAIndicatorModule: EmaIndicator;

    /**
     * `tMAIndicatorModule` is used to predict the market trend using TMA approach
     */
    public tMAIndicatorModule: TmaIndicator;

    /**
     * `accumulationDistributionIndicatorModule` is used to predict the market trend using Accumulation Distribution approach
     */
    public accumulationDistributionIndicatorModule: AccumulationDistributionIndicator;

    /**
     * `atrIndicatorModule` is used to predict the market trend using ATR approach
     */
    public atrIndicatorModule: AtrIndicator;

    /**
     * `rSIIndicatorModule` is used to predict the market trend using RSI approach
     */
    public rsiIndicatorModule: RsiIndicator;

    /**
     * `macdIndicatorModule` is used to predict the market trend using Macd approach
     */
    public macdIndicatorModule: MacdIndicator;

    /**
     * `stochasticIndicatorModule` is used to predict the market trend using Stochastic approach
     */
    public stochasticIndicatorModule: StochasticIndicator;

    /**
     * `momentumIndicatorModule` is used to predict the market trend using Momentum approach
     */
    public momentumIndicatorModule: MomentumIndicator;

    /**
     * `bollingerBandsModule` is used to predict the market trend using Bollinger approach
     */
    public bollingerBandsModule: BollingerBands;

    public scrollBarModule: ScrollBar;

    /**
     * The width of the chart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, chart renders to the full width of its parent element.
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, chart renders to the full height of its parent element.
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Title of the chart
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Specifies the DataSource for the chart. It can be an array of JSON objects or an instance of DataManager.
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
     *  dataSource:dataManager,
     *   series: [{
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

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Options for customizing the title of the Chart.
     */

    @Complex<FontModel>(Theme.chartTitleFont, Font)
    public titleStyle: FontModel;

    /**
     * SubTitle of the chart
     * @default ''
     */

    @Property('')
    public subTitle: string;

    /**
     * Options for customizing the Subtitle of the Chart.
     */

    @Complex<FontModel>(Theme.chartSubTitleFont, Font)
    public subTitleStyle: FontModel;
    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */

    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing the color and width of the chart border.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Options for configuring the border and background of the chart area.
     */

    @Complex<ChartAreaModel>({ border: { color: null, width: 0.5 }, background: 'transparent' }, ChartArea)
    public chartArea: ChartAreaModel;

    /**
     * Options to configure the horizontal axis.
     */

    @Complex<AxisModel>({ name: 'primaryXAxis' }, Axis)
    public primaryXAxis: AxisModel;

    /**
     * Options to configure the vertical axis.
     */

    @Complex<AxisModel>({ name: 'primaryYAxis' }, Axis)
    public primaryYAxis: AxisModel;


    /**
     * Options to split Chart into multiple plotting areas horizontally.
     * Each object in the collection represents a plotting area in the Chart.
     */

    @Collection<RowModel>([{}], Row)
    public rows: RowModel[];


    /**
     * Options to split chart into multiple plotting areas vertically.
     * Each object in the collection represents a plotting area in the chart.
     */

    @Collection<ColumnModel>([{}], Column)
    public columns: ColumnModel[];

    /**
     * Secondary axis collection for the chart.
     */

    @Collection<AxisModel>([{}], Axis)
    public axes: AxisModel[];

    /**
     * The configuration for series in the chart.
     */

    @Collection<SeriesModel>([{}], Series)
    public series: SeriesModel[];

    /**
     * The configuration for annotation in chart.
     */

    @Collection<ChartAnnotationSettingsModel>([{}], ChartAnnotationSettings)
    public annotations: ChartAnnotationSettingsModel[];

    /**
     * Palette for the chart series.
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * Specifies the theme for the chart.
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Options for customizing the tooltip of the chart.
     */

    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltip: TooltipSettingsModel;


    /**
     * Options for customizing the crosshair of the chart.
     */
    @Complex<CrosshairSettingsModel>({}, CrosshairSettings)
    public crosshair: CrosshairSettingsModel;

    /**
     * Options for customizing the legend of the chart.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Options to enable the zooming feature in the chart.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
     * * dragX: selects points by dragging with respect to horizontal axis.
     * * dragY: selects points by dragging with respect to vertical axis.
     * @default None
     */
    @Property('None')
    public selectionMode: SelectionMode;

    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * Specifies the point indexes to be selected while loading a chart.
     * It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default []
     */
    @Collection<IndexesModel>([], Indexes)
    public selectedDataIndexes: IndexesModel[];

    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * It specifies whether the chart should be render in transposed manner or not.
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * Defines the collection of technical indicators, that are used in financial markets
     */
    @Collection<TechnicalIndicatorModel>([], TechnicalIndicator)
    public indicators: TechnicalIndicatorModel[];

    /**
     * If set true, Animation process will be executed.
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Description for chart.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the chart.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    /**
     * To enable the side by side placing the points for column type series.
     * @default true
     */
    @Property(true)
    public enableSideBySidePlacement: boolean;

    /**
     * Triggers after resizing of chart
     * @event
     */
    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the annotation gets rendered.
     * @event
     */

    @Event()
    public annotationRender: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
     */

    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /**
     * Triggers after chart load.
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before chart load.
     * @event
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after animation is completed for the series.
     * @event
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * @event
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for series is rendered.
     * @event
     */

    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers before each points for the series is rendered.
     * @event
     */

    @Event()
    public pointRender: EmitType<IPointRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     */

    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;
    /**
     * Triggers before each axis label is rendered.
     * @event
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;
    /**
     * Triggers before each axis range is rendered.
     * @event
     */
    @Event()
    public axisRangeCalculated: EmitType<IAxisRangeCalculatedEventArgs>;
    /**
     * Triggers before each axis multi label is rendered.
     * @event
     */
    @Event()
    public axisMultiLabelRender: EmitType<IAxisMultiLabelRenderEventArgs>;
    /**
     * Triggers before the tooltip for series is rendered.
     * @event
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers on hovering the chart.
     * @event
     */

    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the chart.
     * @event
     */

    @Event()
    public chartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point click.
     * @event
     */

    @Event()
    public pointClick: EmitType<IPointEventArgs>;

    /**
     * Triggers on point move.
     * @event
     */

    @Event()
    public pointMove: EmitType<IPointEventArgs>;


    /**
     * Triggers when cursor leaves the chart.
     * @event
     */

    @Event()
    public chartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     */

    @Event()
    public chartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     */

    @Event()
    public chartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers after the drag selection is completed.
     * @event
     */

    @Event()
    public dragComplete: EmitType<IDragCompleteEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     * @event
     */

    @Event()
    public zoomComplete: EmitType<IZoomCompleteEventArgs>;

    /**
     * Triggers when start the scroll.
     * @event
     */
    @Event()
    public scrollStart: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the scroll end.
     * @event
     */
    @Event()
    public scrollEnd: EmitType<IScrollEventArgs>;

    /**
     * Triggers when change the scroll.
     * @event
     */
    @Event()
    public scrollChanged: EmitType<IScrollEventArgs>;

    /**
     * Defines the currencyCode format of the chart
     * @private
     * @aspType string
     */
    @Property('USD')
    private currencyCode: string;

    // Internal variables
    private htmlObject: HTMLElement;
    private getElement: MethodDecorator;
    private elementSize: Size;
    private isLegend: boolean;

    /**
     * localization object
     * @private
     */
    public localeObject: L10n;
    /**
     * It contains default values of localization values
     */
    private defaultLocalConstants: Object;

    /**
     * Gets the current visible axis of the Chart.
     * @hidden
     */
    public axisCollections: Axis[];
    /**
     * Gets the current visible series of the Chart.
     * @hidden
     */
    public visibleSeries: Series[];
    /**
     * Render panel for chart.
     * @hidden
     */
    public chartAxisLayoutPanel: CartesianAxisLayoutPanel | PolarRadarPanel;
    /**
     * Gets all the horizontal axis of the Chart.
     * @hidden
     */
    public horizontalAxes: Axis[];
    /**
     * Gets all the vertical axis of the Chart.
     * @hidden
     */
    public verticalAxes: Axis[];
    /**
     * Gets the inverted chart.
     * @hidden
     */
    public requireInvertedAxis: boolean;
    /** @private */
    public svgObject: Element;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public seriesElements: Element;
    /** @private */
    public indicatorElements: Element;
    /** @private */
    public trendLineElements: Element;
    /** @private */
    public visibleSeriesCount: number;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public dataLabelCollections: Rect[];
    /** @private */
    public dataLabelElements: Element;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /** @private */
    public animateSeries: boolean;
    /** @private */
    public redraw: boolean;
    /** @private */
    public availableSize: Size;
    /** @private */
    public delayRedraw: boolean;
    /** @private */
    public isDoubleTap: boolean;
    /** @private */
    public mouseDownX: number;
    /** @private */
    public mouseDownY: number;
    /** @private */
    public previousMouseMoveX: number;
    /** @private */
    public previousMouseMoveY: number;
    /** @private */
    private threshold: number;
    /** @private */
    public isChartDrag: boolean;
    private resizeTo: number;
    /** @private */
    public disableTrackTooltip: boolean;
    /** @private */
    public startMove: boolean;
    /** @private */
    public yAxisElements: Element;
    /** @private */
    public radius: number;
    /** @private */
    public chartAreaType: string = 'Cartesian';
    /**
     * `markerModule` is used to manipulate and add marker to the series.
     * @private
     */
    public markerRender: Marker;
    private titleCollection: string[];
    private subTitleCollection: string[];
    /** @private */
    public themeStyle: IThemeStyle;
    /** @private */
    public scrollElement: Element;
    private chartid: number = 57723;

    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options?: ChartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Initialize the event handler.
     */

    protected preRender(): void {
        this.unWireEvents();
        this.initPrivateVariable();
        this.setCulture();
        this.wireEvents();
    }

    private initPrivateVariable(): void {
        this.animateSeries = true;
        this.delayRedraw = false;
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.refreshAxis();
        this.refreshDefinition(<Row[]>this.rows);
        this.refreshDefinition(<Column[]>this.columns);
        if (this.tooltipModule) {
            this.tooltipModule.previousPoints = [];
        }
        if (this.element.id === '') {
            let collection: number = document.getElementsByClassName('e-chart').length;
            this.element.id = 'chart_' + this.chartid + '_' + collection;
        }
    }

    /**
     * To Initialize the control rendering.
     */

    protected render(): void {

        this.trigger(load, { chart: this });

        this.createChartSvg();

        this.setTheme();

        this.markerRender = new Marker(this);

        this.calculateAreaType();

        this.calculateVisibleSeries();

        this.initTechnicalIndicators();

        this.initTrendLines();

        this.calculateVisibleAxis();

        this.processData();

    }

    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObject.getConstant(key);
    }

    /**
     * Refresh the chart bounds.
     * @private
     */

    public refreshBound(): void {
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.visibleSeries, this);
        }

        this.calculateStackValues();

        this.calculateBounds();

        this.renderElements();

        removeElement('chartmeasuretext');
    }
    /**
     * To calcualte the stack values
     */
    private calculateStackValues(): void {
        let series: Series;
        let isCalculateStacking: boolean = false;
        for (let i: number = 0, len: number = this.visibleSeries.length; i < len; i++) {
            series = <Series>this.visibleSeries[i];
            series.position = series.rectCount = undefined;
            if (((series.type.indexOf('Stacking') !== -1) || (series.drawType.indexOf('Stacking') !== -1
                && this.chartAreaType === 'PolarRadar')) && !isCalculateStacking) {
                series.calculateStackedValue(series.type.indexOf('100') > -1, this);
                isCalculateStacking = true;
            }
        }
    }

    private renderElements(): void {

        this.renderBorder();

        this.renderTitle();

        this.renderAreaBorder();

        let axisElement: Element = this.renderAxes();

        this.renderSeriesElements(axisElement);

        this.renderLegend();

        this.applyZoomkit();

        this.performSelection();

        this.setSecondaryElementPosition();

        this.renderAnnotation();
    }

    /**
     * To render the legend
     * @private
     */

    public renderAxes(): Element {
        this.yAxisElements = this.renderer.createGroup({ id: this.element.id + 'yAxisCollection' });
        let axisElement: Element;
        if (this.rows.length > 0 && this.columns.length > 0) {
            axisElement = this.chartAxisLayoutPanel.renderAxes();
        }

        if (this.stripLineModule) {
            this.stripLineModule.renderStripLine(this, 'Behind', this.axisCollections);
        }
        return axisElement;
    }
    /**
     * To render the legend
     */

    private renderLegend(): void {
        if (this.legendModule && this.legendModule.legendCollections.length) {
            this.legendModule.renderLegend(this, this.legendSettings, this.legendModule.legendBounds);
        }
        if (!this.redraw) {
            this.element.appendChild(this.svgObject);
        }
    }
    /**
     * To set the left and top position for data label template for center aligned chart
     */
    private setSecondaryElementPosition(): void {
        let element: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }
    private initializeModuleElements(): void {
        this.dataLabelCollections = [];
        this.seriesElements = this.renderer.createGroup({ id: this.element.id + 'SeriesCollection' });
        if (this.indicators.length) {
            this.indicatorElements = this.renderer.createGroup({ id: this.element.id + 'IndicatorCollection' });
        }
        if (this.hasTrendlines()) {
            this.trendLineElements = this.renderer.createGroup({ id: this.element.id + 'TrendLineCollection' });
        }
        this.dataLabelElements = this.renderer.createGroup({ id: this.element.id + 'DataLabelCollection' });
    }

    private hasTrendlines(): boolean {
        let isTrendline: boolean;
        for (let series of this.series) {
            isTrendline = series.trendlines.length ? true : false;
            if (isTrendline) {
                break;
            }
        }
        return isTrendline;
    }
    private renderSeriesElements(axisElement: Element): void {
        // Initialize the series elements values
        this.initializeModuleElements();
        let tooltipDiv: Element = redrawElement(this.redraw, this.element.id + '_Secondary_Element') ||
            this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        tooltipDiv.setAttribute('style', 'position: relative');
        appendChildElement(this.element, tooltipDiv, this.redraw);
        // For userInteraction
        if (this.tooltip.enable) {
            appendChildElement(
                this.svgObject, this.renderer.createGroup(
                    { id: this.element.id + '_UserInteraction', style: 'pointer-events:none;' }
                ),
                this.redraw
            );
        }

        if (this.rows.length > 0 && this.columns.length > 0) {

            this.initializeIndicator();

            this.initializeTrendLine();

            this.renderSeries();

            this.appendElementsAfterSeries(axisElement);
        }
    }
    /**
     * @private
     */
    public renderSeries(): void {
        for (let item of this.visibleSeries) {
            if (item.visible) {
                findClipRect(item);
                item.renderSeries(this);
            }
        }
        let options: BaseAttibutes = {
            'id': this.element.id + '_ChartAreaClipRect_',
            'x': this.chartAxisLayoutPanel.seriesClipRect.x,
            'y': this.chartAxisLayoutPanel.seriesClipRect.y,
            'width': this.chartAxisLayoutPanel.seriesClipRect.width,
            'height': this.chartAxisLayoutPanel.seriesClipRect.height,
            'fill': 'transparent',
            'stroke-width': 1,
            'stroke': 'Gray'
        };
        this.seriesElements.appendChild(
            appendClipElement(this.redraw, options, this.renderer)
        );
        appendChildElement(this.svgObject, this.seriesElements, this.redraw);
    }

    private initializeIndicator(): void {
        for (let indicator of this.indicators) {
            if (this[firstToLowerCase(indicator.type) + 'IndicatorModule']) {
                this[firstToLowerCase(indicator.type) + 'IndicatorModule'].createIndicatorElements(
                    this, indicator as TechnicalIndicator, (indicator as TechnicalIndicator).index);
            }
        }
        if (this.indicatorElements) {
            appendChildElement(this.svgObject, this.indicatorElements, this.redraw);
        }
    }

    private initializeTrendLine(): void {
        for (let series of this.visibleSeries) {
            if (series.trendlines.length) {
                this.trendLineModule.getTrendLineElements(series, this);
            }
        }

        if (this.trendLineElements) {
            appendChildElement(this.svgObject, this.trendLineElements, this.redraw);
        }
    }

    private appendElementsAfterSeries(axisElement: Element): void {

        if (this.chartAreaType === 'PolarRadar') {
            appendChildElement(this.svgObject, this.yAxisElements, this.redraw);
        }

        appendChildElement(this.svgObject, axisElement, this.redraw);
        if (this.zoomModule && this.zoomSettings.enableScrollbar && this.scrollElement.childElementCount) {
            appendChildElement(getElement(this.element.id + '_Secondary_Element'), this.scrollElement, this.redraw);
        }

        if (this.stripLineModule) {
            this.stripLineModule.renderStripLine(this, 'Over', this.axisCollections);
        }

        if (!this.tooltip.enable) {
            appendChildElement(
                this.svgObject, this.renderer.createGroup(
                    { id: this.element.id + '_UserInteraction', style: 'pointer-events:none;' }
                ),
                this.redraw
            );
        }
    }
    private applyZoomkit(): void {
        if (
            !this.redraw && this.zoomModule && this.zoomModule.isZoomed &&
            (!this.zoomSettings.enablePan || this.zoomModule.performedUI)
        ) {
            this.zoomModule.applyZoomToolkit(this, this.axisCollections);
        }
    }
    /**
     * Render annotation perform here
     * @param redraw
     * @private
     */
    private renderAnnotation(): void {
        if (this.annotationModule) {
            this.annotationModule.renderAnnotations(
                getElement(this.element.id + '_Secondary_Element')
            );
        }
    }

    private performSelection(): void {
        let selectedDataIndexes: Indexes[] = [];
        if (this.selectionModule) {
            selectedDataIndexes = <Indexes[]>extend([], this.selectionModule.selectedDataIndexes, null, true);
            this.selectionModule.invokeSelection(this);
        }
        if (selectedDataIndexes.length > 0) {
            this.selectionModule.selectedDataIndexes = selectedDataIndexes;
            this.selectionModule.redrawSelection(this, this.selectionMode);
        }
    }
    private processData(render: boolean = true): void {
        let series: Series;
        this.visibleSeriesCount = 0;
        let check: boolean = true;
        for (let series of this.visibleSeries) {
            if (!series.visible && !this.legendSettings.visible) {
                this.visibleSeriesCount++;
                continue;
            }
            if (series.category !== 'Indicator' && series.category !== 'TrendLine') {
                this.initializeDataModule(series);
            }
        }
        for (let indicator of this.indicators) {
            if (indicator.dataSource) {
                let techIndicator: TechnicalIndicator = indicator as TechnicalIndicator;
                this.initializeDataModule(techIndicator);
                check = false;
            }
        }
        if (render && (!this.visibleSeries.length || this.visibleSeriesCount === this.visibleSeries.length && check)) {
            this.refreshBound();
            this.trigger('loaded', { chart: this });
        }
    }

    private initializeDataModule(series: SeriesBase): void {
        series.xData = []; series.yData = [];
        series.dataModule = new Data(series.dataSource || this.dataSource, series.query);
        series.points = [];
        (series as TechnicalIndicator).refreshDataManager(this);
    }

    private calculateBounds(): void {
        let margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        let titleWidth: number = 0;
        let padding: number = 15;
        let left: number = margin.left;
        let width: number = this.availableSize.width - left - margin.right - this.border.width;
        this.titleCollection = [];
        this.subTitleCollection = [];
        if (this.title) {
            this.titleCollection = getTitle(this.title, this.titleStyle, width);
            titleHeight = (measureText(this.title, this.titleStyle).height * this.titleCollection.length) + padding;
            if (this.subTitle) {
                let maxWidth: number = 0;
                for (let titleText of this.titleCollection) {
                    titleWidth = measureText(titleText, this.titleStyle).width;
                    maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
                }
                this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth);
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle).height * this.subTitleCollection.length) +
                    padding;
            }
        }
        let top: number = margin.top + subTitleHeight + titleHeight + this.chartArea.border.width / 2;
        let height: number = this.availableSize.height - top - this.border.width - margin.bottom;
        this.initialClipRect = new Rect(left, top, width, height);
        if (this.legendModule) {
            this.legendModule.calculateLegendBounds(this.initialClipRect, this.availableSize);
        }
        this.chartAxisLayoutPanel.measureAxis(this.initialClipRect);

    }

    /**
     * Handles the print method for chart control.
     */
    public print(id?: string[] | string | Element): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print(id);
    }
    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    public export(
        type: ExportType, fileName: string,
        orientation?: PdfPageOrientation, controls?: (Chart | AccumulationChart | RangeNavigator)[],
        width?: number, height?: number
    ): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        controls = controls ? controls : [this];
        exportChart.export(
            type, fileName, orientation,
            controls, width, height
        );
    }

    /**
     * Defines the trendline initialization
     */
    private initTrendLines(): void {
        for (let series of this.visibleSeries) {
            let trendIndex: number = 0;
            for (let trendline of series.trendlines) {
                let trendLine: Trendline = trendline as Trendline;
                let type: string = firstToLowerCase(trendLine.type);
                if (this.trendLineModule) {
                    trendLine.index = trendIndex;
                    trendLine.sourceIndex = series.index;
                    this.trendLineModule.initSeriesCollection(trendLine, this);
                    if (trendLine.targetSeries) {
                        trendLine.targetSeries.xAxisName = series.xAxisName;
                        trendLine.targetSeries.yAxisName = series.yAxisName;
                        this.visibleSeries.push(trendLine.targetSeries);
                    }
                }
                trendIndex++;
            }
        }
    }

    private calculateAreaType(): void {
        let series: SeriesModel = this.series[0];
        if (series) {
            this.requireInvertedAxis = ((series.type.indexOf('Bar') !== -1) && !this.isTransposed) ||
                ((series.type.indexOf('Bar') === -1) && this.isTransposed && this.chartAreaType !== 'PolarRadar');
        }
        this.chartAxisLayoutPanel = this.chartAreaType === 'PolarRadar' ? (this.polarSeriesModule || this.radarSeriesModule)
            : new CartesianAxisLayoutPanel(this);
    }
    /**
     * Calculate the visible axis
     * @private
     */
    private calculateVisibleAxis(): void {
        let axis: Axis; let series: Series;
        let axes: AxisModel[] = [this.primaryXAxis, this.primaryYAxis];
        axes = this.chartAreaType === 'Cartesian' ? axes.concat(this.axes) : axes;
        if (this.paretoSeriesModule) {
            axes = axes.concat(this.paretoSeriesModule.paretoAxes);
        }
        this.axisCollections = [];
        if (this.zoomModule) {
            this.zoomModule.isPanning = this.zoomModule.isAxisZoomed(axes) && this.zoomSettings.enablePan;
            this.svgObject.setAttribute('cursor', this.zoomModule.isPanning ? 'pointer' : 'auto');
            if (this.scrollBarModule) {
                this.scrollBarModule.axes = <Axis[]>axes;
            }
        }
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            axis = <Axis>axes[i]; axis.series = [];
            axis.labels = [];
            for (let series of this.visibleSeries) {
                this.initAxis(series, axis, true);
            }
            for (let indicator of this.indicators) {
                this.initAxis(indicator as SeriesBase, axis, false);
            }
            if (this.scrollBarModule) {
                this.scrollBarModule.injectTo(axis, this);
            }
            if (axis.orientation != null) {
                this.axisCollections.push(axis);
            }
        }
        if (this.rows.length > 0 && this.columns.length > 0) {
            this.chartAxisLayoutPanel.measure();
        }
    }

    private initAxis(series: SeriesBase, axis: Axis, isSeries: boolean): void {
        if (series.xAxisName === axis.name || (series.xAxisName == null && axis.name === 'primaryXAxis')) {
            axis.orientation = this.requireInvertedAxis ? 'Vertical' : 'Horizontal';
            series.xAxis = axis;
            if (isSeries) { axis.series.push(series as Series); }
        } else if (series.yAxisName === axis.name || (series.yAxisName == null && axis.name === 'primaryYAxis')) {
            axis.orientation = this.requireInvertedAxis ? 'Horizontal' : 'Vertical';
            series.yAxis = axis;
            if (isSeries) { axis.series.push(series as Series); }
        }
    }

    private initTechnicalIndicators(): void {
        let i: number = 0;
        for (let indicator of this.indicators) {
            let techIndicator: TechnicalIndicator = indicator as TechnicalIndicator;
            let type: string = firstToLowerCase(techIndicator.type);
            if (this[type + 'IndicatorModule']) {
                techIndicator.index = i;
                this[type + 'IndicatorModule'].initSeriesCollection(techIndicator, this);
                for (let targetSeries of techIndicator.targetSeries) {
                    if (indicator.seriesName || indicator.dataSource) {
                        this.visibleSeries.push(targetSeries);
                    }
                }
            }
            i++;
        }
    }

    /** @private */
    public refreshTechnicalIndicator(series: SeriesBase): void {
        if (this.indicators.length) {
            let targetIndicator: TechnicalIndicator = null;
            if (series instanceof Series && series.category !== 'Indicator') {
                for (let indicator of this.indicators) {
                    if (indicator.seriesName === series.name && !indicator.dataSource) {
                        targetIndicator = indicator as TechnicalIndicator;
                        targetIndicator.setDataSource(series, this);
                    }
                }
            } else if (series instanceof TechnicalIndicator) {
                targetIndicator = series as TechnicalIndicator;
                targetIndicator.setDataSource(series instanceof Series ? series : null, this);
            }
        }
    }


    private calculateVisibleSeries(): void {
        let series: Series;
        this.visibleSeries = [];
        let colors: string[] = this.palettes.length ? this.palettes : getSeriesColor(this.theme);
        let count: number = colors.length;
        for (let i: number = 0, len: number = this.series.length; i < len; i++) {
            series = <Series>this.series[i];
            series.index = i;
            series.interior = series.fill || colors[i % count];
            switch (series.type) {
                case 'Bar':
                case 'StackingBar':
                case 'StackingBar100':
                    if (this.series[0].type.indexOf('Bar') === -1) {
                        continue;
                    } break;
                case 'Polar':
                case 'Radar':
                    if (this.chartAreaType !== 'PolarRadar') {
                        continue;
                    }
                    if (this.chartAreaType === 'PolarRadar' && ((series.xAxisName === null && series.yAxisName !== null) ||
                        (series.xAxisName !== null && series.yAxisName === null) ||
                        (series.xAxisName !== null && series.yAxisName !== null))) {
                        continue;
                    }
                    break;
                case 'Pareto':
                    this.visibleSeries.push(series);
                    this.paretoSeriesModule.initSeries(series, this);
                    continue;
                default:
                    if (this.chartAreaType === 'PolarRadar' || this.series[0].type.indexOf('Bar') > -1) {
                        continue;
                    }
                    break;
            }
            this.visibleSeries.push(series);
            this.series[i] = series;
        }
    }

    private renderTitle(): void {
        let rect: Rect;
        let margin: MarginModel = this.margin;
        if (this.title) {
            let alignment: Alignment = this.titleStyle.textAlignment;
            let getAnchor: string = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
            this.elementSize = measureText(this.title, this.titleStyle);
            rect = new Rect(
                margin.left, 0, this.availableSize.width - margin.left - margin.right, 0
            );
            let options: TextOption = new TextOption(
                this.element.id + '_ChartTitle',
                titlePositionX(rect, this.titleStyle),
                this.margin.top + ((this.elementSize.height) * 3 / 4),
                getAnchor, this.titleCollection, '', 'auto'
            );
            let element: Element = redrawElement(this.redraw, this.element.id + '_ChartTitle', options, this.renderer) ||
                textElement(
                    options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitle, this.svgObject
                );
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
            if (this.subTitle) {
                this.renderSubTitle(options);
            }
        }
    }
    private renderSubTitle(options: TextOption): void {
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        let padding: number = 10;
        let rect: Rect;
        let anchor: Function = (alignment: Alignment): string => {
            return alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        };
        let alignment: Alignment = this.titleStyle.textAlignment;
        for (let titleText of this.titleCollection) {
            titleWidth = measureText(titleText, this.titleStyle).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        let subTitleElementSize: Size = measureText(this.subTitle, this.subTitleStyle);
        rect = new Rect(
            alignment === 'Center' ? (options.x - maxWidth / 2) : alignment === 'Far' ? options.x - maxWidth : options.x,
            0, maxWidth, 0
        );
        let subTitleOptions: TextOption = new TextOption(
            this.element.id + '_ChartSubTitle',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding,
            anchor(this.subTitleStyle.textAlignment), this.subTitleCollection, '', 'auto'
        );
        let element: Element = redrawElement(this.redraw, this.element.id + '_ChartSubTitle', subTitleOptions, this.renderer) ||
            textElement(
                subTitleOptions, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartTitle, this.svgObject
            );
        element.setAttribute('aria-label', this.description || this.subTitle);
        element.setAttribute('tabindex', this.tabIndex.toString());
    }
    private renderBorder(): void {
        let width: number = this.border.width;
        let rect: RectOption = new RectOption(
            this.element.id + '_ChartBorder', this.background || this.themeStyle.background, this.border, 1,
            new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));

        this.htmlObject = redrawElement(this.redraw, this.element.id + '_ChartBorder', rect, this.renderer) as HTMLElement
            || this.renderer.drawRectangle(rect) as HTMLElement;

        appendChildElement(this.svgObject, this.htmlObject, this.redraw);

    }
    /**
     * @private
     */
    public renderAreaBorder(): void {

        if (this.chartAreaType === 'PolarRadar') {
            return null;
        } else {
            let rect: RectOption = new RectOption(
                this.element.id + '_ChartAreaBorder', this.chartArea.background,
                { width: this.chartArea.border.width, color: this.chartArea.border.color || this.themeStyle.areaBorder },
                this.chartArea.opacity, this.chartAxisLayoutPanel.seriesClipRect);

            this.htmlObject = this.renderer.drawRectangle(rect) as HTMLElement;

            appendChildElement(this.svgObject, this.htmlObject, this.redraw);
        }
    }

    /**
     * To add series for the chart
     * @param {SeriesModel[]} seriesCollection - Defines the series collection to be added in chart.
     * @return {void}.
     */

    public addSeries(seriesCollection: SeriesModel[]): void {
        for (let series of seriesCollection) {
            series = new Series(this, 'series', series);
            this.series.push(series);
        }
        this.refresh();
    }

    /**
     * To Remove series for the chart
     * @param index - Defines the series index to be remove in chart series
     * @return {void}
     */
    public removeSeries(index: number): void {
        this.series.splice(index, 1);
        this.refresh();
    }

    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of Chart
     */

    public destroy(): void {
        if (this.scrollBarModule) {
            this.scrollBarModule.destroy();
        }
        this.unWireEvents();
        super.destroy();
        this.element.classList.remove('e-chart');
    }

    /**
     * Get component name
     */

    public getModuleName(): string {
        return 'chart';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded', 'animationComplete'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Method to create SVG element.
     */

    private createChartSvg(): void {
        this.removeSvg();
        createSvg(this);
    }

    /**
     * Method to bind events for chart
     */

    private unWireEvents(): void {
        /*! Find the Events type */
        let startEvent: string = Browser.touchStartEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let stopEvent: string = Browser.touchEndEvent;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, startEvent, this.chartOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.chartOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.chartRightClick);
        EventHandler.remove(this.element, cancelEvent, this.mouseLeave);

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.chartResize
        );

    }


    private wireEvents(): void {
        /*! Find the Events type */

        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.chartOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.chartOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.chartRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);

        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.chartResize.bind(this)
        );

        this.longPress = this.longPress.bind(this);
        new Touch(this.element, { tapHold: this.longPress, tapHoldThreshold: 500 });

        /*! Apply the style for chart */
        this.setStyle(<HTMLElement>this.element);
    }

    private chartRightClick(event: MouseEvent | PointerEvent): boolean {
        if (this.crosshair.enable && this.crosshairModule &&
            (event.buttons === 2 || event.which === 0 || (<PointerEvent>event).pointerType === 'touch')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    }

    private setStyle(element: HTMLElement): void {
        let zooming: ZoomSettingsModel = this.zoomSettings;
        let disableScroll: boolean = zooming.enableSelectionZooming || zooming.enablePinchZooming ||
            this.selectionMode !== 'None' || this.crosshair.enable;
        element.style.touchAction = disableScroll ? 'none' : 'element';
        element.style.msTouchAction = disableScroll ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    }
    /**
     * Finds the orientation.
     * @return {boolean}
     * @private
     */
    public isOrientation(): boolean {
        return ('orientation' in window && 'onorientationchange' in window);
    }

    /**
     * Handles the long press on chart.
     * @return {boolean}
     * @private
     */
    public longPress(e?: TapEventArgs): boolean {
        this.mouseX = (e && e.originalEvent.changedTouches) ? (e.originalEvent.changedTouches[0].clientX) : 0;
        this.mouseY = (e && e.originalEvent.changedTouches) ? (e.originalEvent.changedTouches[0].clientY) : 0;
        this.startMove = true;
        this.setMouseXY(this.mouseX, this.mouseY);
        this.notify('tapHold', e);
        return false;
    }
    /**
     * To find mouse x, y for aligned chart element svg position
     */
    private setMouseXY(pageX: number, pageY: number): void {
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        let rect: ClientRect = this.element.getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }

    /**
     * Handles the chart resize.
     * @return {boolean}
     * @private
     */
    public chartResize(e: Event): boolean {
        this.animateSeries = false;
        let arg: IResizeEventArgs = {
            chart: this,
            name: resized,
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(
            (): void => {
                if (this.isDestroyed) {
                    clearTimeout(this.resizeTo);
                    return;
                }
                this.createChartSvg();
                arg.currentSize = this.availableSize;
                this.trigger(resized, arg);
                this.refreshAxis();
                this.refreshBound();
                this.trigger('loaded', { chart: this });
            },
            500);
        return false;

    }
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    public mouseMove(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseMove(e);
        return false;
    }
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (e.type === 'touchleave') {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;

        }
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseLeave(e);
        return false;
    }
    /**
     * Handles the mouse leave on chart.
     * @return {boolean}
     * @private
     */
    public chartOnMouseLeave(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.trigger(chartMouseLeave, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        this.notify(cancelEvent, e);
        return false;
    }
    /**
     * Handles the mouse click on chart.
     * @return {boolean}
     * @private
     */
    public chartOnMouseClick(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        this.trigger(chartMouseClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        if (this.pointClick) {
            this.triggerPointEvent(pointClick);
        }
        this.notify('click', e);
        return false;
    }
    private triggerPointEvent(event: string): void {
        let data: ChartData = new ChartData(this);
        let pointData: PointData = data.getData();
        if (pointData.series && pointData.point) {
            this.trigger(event, {
                series: pointData.series,
                point: pointData.point,
                seriesIndex: pointData.series.index, pointIndex: pointData.point.index,
                x: this.mouseX, y: this.mouseY
            });
        }
    }
    /**
     * Handles the mouse move on chart.
     * @return {boolean}
     * @private
     */
    public chartOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        this.trigger(chartMouseMove, { target: element.id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove);
        }
        // Tooltip for chart series.
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
            this.axisTooltip(e, this.mouseX, this.mouseY);
        }
        this.notify(Browser.touchMoveEvent, e);
        this.isTouch = false;
        return false;
    }
    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
        let id: boolean = (targetId === (this.element.id + '_ChartTitle') || targetId === (this.element.id + '_ChartSubTitle'));
        if (id && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            let title: string = (targetId === (this.element.id + '_ChartTitle')) ? this.title : this.subTitle;
            showTooltip(
                title, x, y, this.element.offsetWidth, this.element.id + '_EJ2_Title_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch
            );
        } else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    }

    private axisTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
        if (((targetId.indexOf('AxisLabel') > -1) || targetId.indexOf('Axis_MultiLevelLabel') > -1) &&
            ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            showTooltip(
                this.findAxisLabel(targetId), x, y, this.element.offsetWidth, this.element.id + '_EJ2_AxisLabel_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch
            );
        } else {
            removeElement(this.element.id + '_EJ2_AxisLabel_Tooltip');
        }
    }

    private findAxisLabel(text: string): string {
        let texts: string[];
        if (text.indexOf('AxisLabel') > -1) {
            texts = ((text.replace(this.element.id, '')).replace('AxisLabel_', '')).split('_');
            return this.axisCollections[parseInt(texts[0], 10)].visibleLabels[parseInt(texts[1], 10)].originalText;
        } else {
            texts = ((text.replace(this.element.id, '')).replace('Axis_MultiLevelLabel_Level_', '').replace('Text_', '')).split('_');
            return (this.axisCollections[parseInt(texts[0], 10)].multiLevelLabels[parseInt(texts[1], 10)]
                .categories[parseInt(texts[2], 10)].text);
        }
    }

    /**
     * Handles the mouse down on chart.
     * @return {boolean}
     * @private
     */
    public chartOnMouseDown(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        let offset: number = Browser.isDevice ? 20 : 30;
        let rect: ClientRect = this.element.getBoundingClientRect();
        let element: Element = <Element>e.target;
        this.trigger(chartMouseDown, { target: element.id, x: this.mouseX, y: this.mouseY });
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
            target = <Element>touchArg.target;
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.clientX;
            pageY = e.clientY;
            target = <Element>e.target;
        }
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        this.mouseDownX = this.previousMouseMoveX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        this.mouseDownY = this.previousMouseMoveY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);

        if (this.isTouch) {
            this.isDoubleTap = (new Date().getTime() < this.threshold && target.id.indexOf(this.element.id + '_Zooming_') === -1 &&
                (this.mouseDownX - offset >= this.mouseX || this.mouseDownX + offset >= this.mouseX) &&
                (this.mouseDownY - offset >= this.mouseY || this.mouseDownY + offset >= this.mouseY) &&
                (this.mouseX - offset >= this.mouseDownX || this.mouseX + offset >= this.mouseDownX) &&
                (this.mouseY - offset >= this.mouseDownY || this.mouseY + offset >= this.mouseDownY));
        }
        this.notify(Browser.touchStartEvent, e);
        return false;
    }
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    public mouseEnd(e: PointerEvent): boolean {
        let pageY: number;
        let pageX: number;
        let touchArg: TouchEvent;
        if (e.type === 'touchend') {
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            this.isTouch = true;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            pageY = e.clientY;
            pageX = e.clientX;
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseUp(e);
        return false;
    }

    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */

    public chartOnMouseUp(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        this.trigger(chartMouseUp, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.axisTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.threshold = new Date().getTime() + 300;
        }
        this.seriesElements.removeAttribute('clip-path');
        this.notify(Browser.touchEndEvent, e);
        return false;
    }
    /**
     * Method to set culture for chart
     */

    private setCulture(): void {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * Method to set the annotation content dynamically for chart.
     */
    public setAnnotationValue(annotationIndex: number, content: string): void {
        let parentNode: Element = getElement(this.element.id + '_Annotation_Collections');
        let annotation: ChartAnnotationSettings = <ChartAnnotationSettings>this.annotations[annotationIndex];
        let element: HTMLElement;
        if (content !== null) {
            annotation.content = content;
            if (parentNode) {
                removeElement(this.element.id + '_Annotation_' + annotationIndex);
                element = this.createElement('div');
                this.annotationModule.processAnnotation(
                    annotation, annotationIndex, element
                );
                parentNode.appendChild(element.children[0]);
            } else {
                this.annotationModule.renderAnnotations(
                    getElement(this.element.id + '_Secondary_Element')
                );
            }
        }
    }

    /**
     * Method to set locale constants
     */
    private setLocaleConstants(): void {
        this.defaultLocalConstants = {
            ZoomIn: 'ZoomIn',
            Zoom: 'Zoom',
            ZoomOut: 'ZoomOut',
            Pan: 'Pan',
            Reset: 'Reset',
            ResetZoom: 'Reset Zoom'
        };
    }


    /**
     * Theming for chart
     */

    private setTheme(): void {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let series: SeriesModel[] = this.series;
        let enableAnnotation: boolean = false;
        let moduleName: string; let errorBarVisible: boolean = false;
        let dataLabelEnable: boolean = false; let zooming: ZoomSettingsModel = this.zoomSettings;
        this.chartAreaType = (series.length > 0 && (series[0].type === 'Polar' || series[0].type === 'Radar')) ? 'PolarRadar' : 'Cartesian';
        if (this.tooltip.enable) {
            modules.push({
                member: 'Tooltip',
                args: [this]
            });
        }
        series.map((value: Series) => {
            this.isLegend = (this.legendSettings.visible && ((value.name !== '') || !!this.isLegend));
            moduleName = value.type.indexOf('100') !== -1 ? value.type.replace('100', '') + 'Series' : value.type + 'Series';
            errorBarVisible = value.errorBar.visible || errorBarVisible;
            dataLabelEnable = value.marker.dataLabel.visible || dataLabelEnable;
            if (!modules.some((currentModule: ModuleDeclaration) => {
                return currentModule.member === moduleName;
            })) {
                modules.push({
                    member: moduleName,
                    args: [this, series]
                });
            }
            if (this.chartAreaType === 'PolarRadar') {
                modules.push({
                    member: value.drawType + 'Series',
                    args: [this, series]
                });
            }
            if (value.type === 'Pareto') {
                modules.push({
                    member: 'ColumnSeries',
                    args: [this, series]
                });
                modules.push({
                    member: 'LineSeries',
                    args: [this, series]
                });
            }
        });
        this.findIndicatorModules(modules);
        this.findTrendLineModules(modules);
        modules = this.findAxisModule(modules);
        enableAnnotation = this.annotations.some((value: ChartAnnotationSettings) => {
            return (value.content !== null);
        });
        if (errorBarVisible) {
            modules.push({
                member: 'ErrorBar',
                args: [this, series]
            });
        }
        if (this.isLegend) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.chartAreaType !== 'PolarRadar' && (zooming.enableSelectionZooming
            || zooming.enableMouseWheelZooming || zooming.enablePinchZooming || zooming.enablePan)) {
            modules.push({
                member: 'Zoom',
                args: [this, this.zoomSettings]
            });
            if (zooming.enableScrollbar) {
                modules.push({
                    member: 'ScrollBar',
                    args: [this]
                });
            }
        }
        if (this.selectionMode !== 'None' && !(this.chartAreaType === 'PolarRadar' &&
            this.selectionMode.indexOf('Drag') > -1)) {
            modules.push({
                member: 'Selection',
                args: [this]
            });
        }
        if (dataLabelEnable) {
            modules.push({
                member: 'DataLabel',
                args: [this, series]
            });
        }
        if (enableAnnotation) {
            modules.push({
                member: 'Annotation',
                args: [this]
            });
        }
        if (this.chartAreaType !== 'PolarRadar' && this.crosshair.enable) {
            modules.push({
                member: 'Crosshair',
                args: [this]
            });
        }
        return modules;
    }
    private findAxisModule(modules: ModuleDeclaration[]): ModuleDeclaration[] {
        let axisCollections: AxisModel[] = [];
        axisCollections.push(this.primaryXAxis);
        axisCollections.push(this.primaryYAxis);
        axisCollections = axisCollections.concat(this.axes);
        let datetimeEnabled: boolean = false;
        let categoryEnabled: boolean = false;
        let logarithmicEnabled: boolean = false;
        let striplineEnabled: boolean = false;
        let dateTimeCategoryEnabled: boolean = false;
        let multiLevelEnabled: boolean = false;
        for (let axis of axisCollections) {
            datetimeEnabled = axis.valueType === 'DateTime' || datetimeEnabled;
            categoryEnabled = axis.valueType === 'Category' || categoryEnabled;
            logarithmicEnabled = axis.valueType === 'Logarithmic' || logarithmicEnabled;
            dateTimeCategoryEnabled = axis.valueType === 'DateTimeCategory' || dateTimeCategoryEnabled;
            striplineEnabled = this.findStriplineVisibility(axis.stripLines) || striplineEnabled;
            multiLevelEnabled = axis.multiLevelLabels.length > 0 || multiLevelEnabled;
        }

        if (datetimeEnabled) {
            modules.push({
                member: 'DateTime',
                args: [this]
            });
        }

        if (categoryEnabled) {
            modules.push({
                member: 'Category',
                args: [this]
            });
        }
        if (logarithmicEnabled) {
            modules.push({
                member: 'Logarithmic',
                args: [this]
            });
        }
        if (striplineEnabled) {
            modules.push({
                member: 'StripLine',
                args: [this]
            });
        }
        if (multiLevelEnabled) {
            modules.push({
                member: 'MultiLevelLabel',
                args: [this]
            });
        }
        if (dateTimeCategoryEnabled) {
            modules.push({
                member: 'DateTimeCategory',
                args: [this]
            });
        }
        return modules;

    }

    private findIndicatorModules(modules: ModuleDeclaration[]): void {
        let macdEnable: boolean;
        let bandEnable: boolean;
        let indicators: TechnicalIndicatorModel[] = this.indicators;
        if (this.indicators.length) {
            modules.push({
                member: 'LineSeries',
                args: [this]
            });
            indicators.map((indicator: TechnicalIndicator) => {
                macdEnable = macdEnable || indicator.type === 'Macd';
                bandEnable = bandEnable || indicator.type === 'BollingerBands';
            });
            if (macdEnable) {
                modules.push({
                    member: 'ColumnSeries',
                    args: [this]
                });
            }
            if (bandEnable) {
                modules.push({
                    member: 'RangeAreaSeries',
                    args: [this]
                });
            }
            for (let indicator of this.indicators) {
                modules.push({
                    member: indicator.type + 'Indicator',
                    args: [this]
                });
            }
        }
    }

    private findTrendLineModules(modules: ModuleDeclaration[]): void {
        let isLine: boolean;
        let isSpline: boolean;
        for (let series of this.series) {
            let markerEnable: boolean;
            series.trendlines.map((trendline: Trendline) => {
                markerEnable = markerEnable || trendline.marker.visible;
                isLine = isLine || (trendline.type === 'Linear' || trendline.type === 'MovingAverage') ? true : false;
                isSpline = isSpline || !isLine ? true : false;
            });
            if (markerEnable) {
                modules.push({
                    member: 'Marker',
                    args: [this, series]
                });
            }
        }

        if (isLine || isSpline) {
            modules.push({
                member: 'TrendLine',
                args: [this]
            });
        }

        if (isLine) {
            modules.push({
                member: 'LineSeries',
                args: [this]
            });
        }
        if (isSpline) {
            modules.push({
                member: 'SplineSeries',
                args: [this]
            });
        }
    }

    private findStriplineVisibility(striplines: StripLineSettingsModel[]): boolean {
        let visible: boolean = false;
        for (let stripline of striplines) {
            if (stripline.visible) {
                visible = true;
                break;
            }
        }
        return visible;
    }

    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    public removeSvg(): void {
        if (this.redraw) {
            return null;
        }
        if (document.getElementById(this.element.id + '_Secondary_Element')) {
            remove(document.getElementById(this.element.id + '_Secondary_Element'));
        }
        let removeLength: number = 0;
        if (this.zoomModule && this.zoomModule.pinchTarget) {
            this.zoomModule.pinchTarget.id = '';
            this.zoomModule.pinchTarget.setAttribute('opacity', '0');
            this.svgObject.appendChild(this.zoomModule.pinchTarget);
            removeLength = 1;
        }
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }

    private refreshDefinition(definitions: Row[] | Column[]): void {
        for (let item of definitions) {
            item.axes = [];
        }
    }
    /**
     * Refresh the axis default value.
     * @return {boolean}
     * @private
     */
    public refreshAxis(): void {
        let axis: Axis = <Axis>this.primaryXAxis;
        axis.rect = new Rect(undefined, undefined, 0, 0, );
        axis = <Axis>this.primaryYAxis;
        axis.isStack100 = false;
        axis.rect = new Rect(undefined, undefined, 0, 0, );
        for (let item of this.axes) {
            axis = <Axis>item;
            axis.rect = new Rect(undefined, undefined, 0, 0, );
            axis.isStack100 = false;
        }
        if (this.paretoSeriesModule) {
            for (let item of this.paretoSeriesModule.paretoAxes) {
                axis = <Axis>item;
                axis.rect = new Rect(undefined, undefined, 0, 0);
                axis.isStack100 = false;
            }
        }
    }

    private axisChange(axis: Axis): boolean {
        if (!axis.name && !axis.valueType) {
            return false;
        }
        this.refreshDefinition(<Column[]>this.columns);
        this.refreshDefinition(<Row[]>this.rows);
        this.calculateVisibleAxis();
        this.processData();
        return true;
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: ChartModel, oldProp: ChartModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        if (Object.keys(newProp).length === 1 && Object.keys(newProp)[0] === 'indicators') {
            //add valid check,it should happen only when property change is triggered for target series
            return;
        }
        this.animateSeries = false;
        if (!this.delayRedraw) {
            for (let prop of Object.keys(newProp)) {
                switch (prop) {
                    case 'primaryXAxis':
                        refreshBounds = this.axisChange(<Axis>newProp.primaryXAxis);
                        if (newProp.primaryXAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        if (!newProp.primaryXAxis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        break;
                    case 'primaryYAxis':
                        refreshBounds = this.axisChange(<Axis>newProp.primaryYAxis);
                        if (newProp.primaryYAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        if (!newProp.primaryYAxis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        break;
                    case 'axes':
                        for (let index of Object.keys(newProp.axes)) {
                            refreshBounds = refreshBounds || this.axisChange(newProp.axes[index] as Axis);
                            if (!newProp.axes[index].crosshairTooltip) {
                                refreshBounds = true;
                            }
                        }
                        break;
                    case 'height':
                    case 'width':
                        this.createChartSvg();
                        refreshBounds = true;
                        break;
                    case 'subTitle':
                    case 'title':
                        refreshBounds = true;
                        break;
                    case 'titleStyle':
                        if (newProp.titleStyle && (newProp.titleStyle.size || newProp.titleStyle.textOverflow)) {
                            refreshBounds = true;
                        } else {
                            renderer = true;
                        }
                        break;
                    case 'subTitleStyle':
                        if (newProp.subTitleStyle && (newProp.subTitleStyle.size || newProp.subTitleStyle.textOverflow)) {
                            refreshBounds = true;
                        } else {
                            renderer = true;
                        }
                        break;
                    case 'border':
                        renderer = true;
                        break;
                    case 'dataSource':
                        this.processData(false);
                        refreshBounds = true;
                        break;
                    case 'series':
                        let len: number = this.series.length;
                        let seriesRefresh: boolean = false;
                        let series: SeriesModel;
                        for (let i: number = 0; i < len; i++) {
                            series = newProp.series[i];
                            if (series && (series.dataSource || series.xName || series.yName || series.size ||
                                series.high || series.low || series.open || series.close)) {
                                seriesRefresh = true;
                            }
                        }
                        if (seriesRefresh) {
                            this.processData(false);
                            refreshBounds = true;
                        }
                        break;
                    case 'zoomSettings':
                        if (newProp.zoomSettings.enableScrollbar || oldProp.zoomSettings.enableScrollbar) {
                            refreshBounds = true;
                        }
                        renderer = true;
                        break;
                    case 'background':
                        renderer = true;
                        break;
                    case 'chartArea':
                        if (newProp.chartArea.border && newProp.chartArea.border.width) {
                            refreshBounds = true;
                        }
                        renderer = true;
                        break;
                    case 'legendSettings':
                        if (!newProp.legendSettings.background || !newProp.legendSettings.opacity) {
                            refreshBounds = true;
                        }
                        renderer = true; break;
                    case 'palettes':
                        this.calculateVisibleSeries();
                        renderer = true;
                        break;
                    case 'selectedDataIndexes':
                    case 'selectionMode':
                        if (this.selectionModule && newProp.selectionMode && newProp.selectionMode.indexOf('Drag') === -1) {
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                        break;
                    case 'isMultiSelect':
                        if (this.selectionModule && !newProp.isMultiSelect && this.selectionModule.selectedDataIndexes.length > 1) {
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                        break;
                    case 'theme':
                        this.animateSeries = true; break;
                    case 'locale':
                    case 'currencyCode':
                        super.refresh(); break;
                    case 'tooltip':
                        this.tooltipModule.previousPoints = []; break;
                }
            }
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderElements();
                this.trigger('loaded', { chart: this });
            }
            if (refreshBounds) {
                this.removeSvg();
                this.refreshAxis();
                this.refreshBound();
                this.trigger('loaded', { chart: this });
            }
        }
    }
}