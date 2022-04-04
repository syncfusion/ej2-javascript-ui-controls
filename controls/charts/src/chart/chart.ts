/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/ban-types */
import { Component, Property, NotifyPropertyChanges, Internationalization } from '@syncfusion/ej2-base';
import { ModuleDeclaration, L10n, setValue, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { TapEventArgs, EmitType, ChildProperty } from '@syncfusion/ej2-base';
import { remove, extend } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Browser, Touch } from '@syncfusion/ej2-base';
import { Event, EventHandler, Complex, Collection } from '@syncfusion/ej2-base';
import { findClipRect, showTooltip, ImageOption, removeElement, appendChildElement, blazorTemplatesReset } from '../common/utils/helper';
import { textElement, RectOption, createSvg, firstToLowerCase, titlePositionX, PointData, redrawElement, getTextAnchor } from '../common/utils/helper';
import { appendClipElement, ChartLocation } from '../common/utils/helper';
import { ChartModel, CrosshairSettingsModel, ZoomSettingsModel, RangeColorSettingModel } from './chart-model';
import { MarginModel, BorderModel, ChartAreaModel, FontModel, TooltipSettingsModel } from '../common/model/base-model';
import { getSeriesColor, Theme, getThemeColor } from '../common/model/theme';
import { IndexesModel } from '../common/model/base-model';
import { Margin, Border, ChartArea, Font, Indexes, TooltipSettings } from '../common/model/base';
import { AxisModel, RowModel, ColumnModel } from './axis/axis-model';
import { Row, Column, Axis } from './axis/axis';
import { Highlight } from './user-interaction/high-light';
import { CartesianAxisLayoutPanel } from './axis/cartesian-panel';
import { DateTime } from './axis/date-time-axis';
import { Category } from './axis/category-axis';
import { DateTimeCategory } from './axis/date-time-category-axis';
import { CandleSeries } from './series/candle-series';
import { ErrorBar } from './series/error-bar';
import { Logarithmic } from './axis/logarithmic-axis';
import { Rect, measureText, TextOption, Size, SvgRenderer, BaseAttibutes, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { ChartData } from './utils/get-data';
import { SelectionMode, HighlightMode, LineType, ZoomMode, ToolbarItems, ChartTheme } from './utils/enum';
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
import { StackingStepAreaSeries } from './series/stacking-step-area-series';
import { StackingLineSeries } from './series/stacking-line-series';
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
import { SplineRangeAreaSeries } from './series/spline-range-area-series';
import { Tooltip } from './user-interaction/tooltip';
import { Crosshair } from './user-interaction/crosshair';
import { DataEditing } from './user-interaction/data-editing';
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
import { ILegendRenderEventArgs, IAxisLabelRenderEventArgs, ITextRenderEventArgs, IResizeEventArgs } from '../chart/model/chart-interface';
import { IAnnotationRenderEventArgs, IAxisMultiLabelRenderEventArgs, IThemeStyle, IScrollEventArgs } from '../chart/model/chart-interface';
import { IPointRenderEventArgs, ISeriesRenderEventArgs, ISelectionCompleteEventArgs } from '../chart/model/chart-interface';
import { IDragCompleteEventArgs, ITooltipRenderEventArgs, IExportEventArgs, IAfterExportEventArgs } from '../chart/model/chart-interface';
import { IZoomCompleteEventArgs, ILoadedEventArgs, IZoomingEventArgs, IAxisLabelClickEventArgs } from '../chart/model/chart-interface';
import { IMultiLevelLabelClickEventArgs, ILegendClickEventArgs, ISharedTooltipRenderEventArgs } from '../chart/model/chart-interface';
import { IAnimationCompleteEventArgs, IMouseEventArgs, IPointEventArgs, IBeforeResizeEventArgs } from '../chart/model/chart-interface';
import { chartMouseClick, chartDoubleClick, pointClick, pointDoubleClick, axisLabelClick, beforeResize  } from '../common/model/constants';
import { chartMouseDown, chartMouseMove, chartMouseUp, load, pointMove, chartMouseLeave, resized } from '../common/model/constants';
import { IPrintEventArgs, IAxisRangeCalculatedEventArgs, IDataEditingEventArgs } from '../chart/model/chart-interface';
import { ChartAnnotationSettingsModel } from './model/chart-base-model';
import { ChartAnnotationSettings } from './model/chart-base';
import { ChartAnnotation } from './annotation/annotation';
import { getElement, getTitle } from '../common/utils/helper';
import { Alignment, ExportType, SelectionPattern } from '../common/utils/enum';
import { MultiColoredLineSeries } from './series/multi-colored-line-series';
import { MultiColoredAreaSeries } from './series/multi-colored-area-series';
import { ScrollBar } from '../common/scrollbar/scrollbar';
import { DataManager } from '@syncfusion/ej2-data';
import { StockChart } from '../stock-chart/stock-chart';
import { Export } from './print-export/export';
import { ExportUtils } from '../common/utils/export';

/**
 * Configures the RangeColorSetting in the chart.
 */
export class RangeColorSetting extends ChildProperty<RangeColorSetting> {
    /**
     * Specify the start value of color mapping range
     */
    @Property()
    public start: number;
    /**
     * Specify the end value of color mapping range
     */
    @Property()
    public end: number;
    /**
     * Specify the fill colors of point those lies on the given range, if multiple colors mentioned, then we need to fill gradient
     */
    @Property([])
    public colors: string[];
    /**
     * Specify name for the range mapping item.
     */
    @Property('')
    public label: string;

}

/**
 * Configures the crosshair in the chart.
 */
export class CrosshairSettings extends ChildProperty<CrosshairSettings> {
    /**
     * If set to true, crosshair line becomes visible.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * DashArray for crosshair.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;

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
     *
     * @default Both
     */
    @Property('Both')
    public lineType: LineType;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public verticalLineColor: string;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public horizontalLineColor: string;

    /**
     * The opacity for background.
     * @default 1
     */
     @Property(1)
     public opacity: number;
}
/**
 * Configures the zooming behavior for the chart.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {

    /**
     * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.
     *
     * @default false
     */

    @Property(false)
    public enableSelectionZooming: boolean;

    /**
     * If to true, chart can be pinched to zoom in / zoom out.
     *
     * @default false
     */

    @Property(false)
    public enablePinchZooming: boolean;

    /**
     * If set to true, chart can be zoomed by using mouse wheel.
     *
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
     *
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
     *
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
     *
     * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
     */

    @Property(['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'])
    public toolbarItems: ToolbarItems[];

    /**
     * Specifies whether chart needs to be panned by default.
     *
     * @default false.
     */

    @Property(false)
    public enablePan: boolean;

    /**
     * Specifies whether axis needs to have scrollbar.
     *
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
 *
 * @public
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
     * `stackingStepAreaSeriesModule` is used to add stacking step area series to the chart.
     */
    public stackingStepAreaSeriesModule: StackingStepAreaSeries;
    /**
     * `stackingLineSeriesModule` is used to add stacking line series to the chart.
     */
    public stackingLineSeriesModule: StackingLineSeries;
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
     * `splineRangeAreaSeriesModule` is used to add splineRangeArea series in chart.
     */
     public splineRangeAreaSeriesModule: SplineRangeAreaSeries;
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
     * `dataEditingModule` is used to drag and drop of the point.
     */
    public dataEditingModule: DataEditing;
    /**
     * `selectionModule` is used to manipulate and add selection to the chart.
     */
    public selectionModule: Selection;
    /**
     * `highlightModule` is used to manipulate and add highlight to the chart.
     */
    public highlightModule: Highlight;
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
    /**
     * ScrollBar Module is used to render scrollbar in chart while zooming.
     */
    public scrollBarModule: ScrollBar;
    /**
     * Export Module is used to export chart.
     */
    public exportModule: Export;

    /**
     * The width of the chart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, chart renders to the full width of its parent element.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, chart renders to the full height of its parent element.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Title of the chart
     *
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
     *
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
     *
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
     *
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
     *
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * Specifies the theme for the chart.
     *
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
     * Options for customizing the points fill color based on condition.
     */
    @Collection<RangeColorSettingModel>([{}], RangeColorSetting)
    public rangeColorSettings: RangeColorSettingModel[];

    /**
     * Options to enable the zooming feature in the chart.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;

    /**
     * Define the color for the data point on highlight.
     *
     * @default ''
     */

    @Property('')
    public highlightColor: string;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
     * * dragX: selects points by dragging with respect to horizontal axis.
     * * dragY: selects points by dragging with respect to vertical axis.
     * * lasso: selects points by dragging with respect to free form.
     *
     * @default None
     */
    @Property('None')
    public selectionMode: SelectionMode;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the highlight.
     * * series: highlight a series.
     * * point: highlight a point.
     * * cluster: highlight a cluster of point
     *
     * @default None
     */
    @Property('None')
    public highlightMode: HighlightMode;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: sets none as selecting pattern.
     * * chessboard: sets chess board as selecting pattern.
     * * dots: sets dots as  selecting pattern.
     * * diagonalForward: sets diagonal forward as selecting pattern.
     * * crosshatch: sets crosshatch as selecting pattern.
     * * pacman: sets pacman selecting pattern.
     * * diagonalbackward: sets diagonal backward as selecting pattern.
     * * grid: sets grid as selecting pattern.
     * * turquoise: sets turquoise as selecting pattern.
     * * star: sets star as selecting pattern.
     * * triangle: sets triangle as selecting pattern.
     * * circle: sets circle as selecting pattern.
     * * tile: sets tile as selecting pattern.
     * * horizontaldash: sets horizontal dash as selecting pattern.
     * * verticaldash: sets vertical dash as selecting pattern.
     * * rectangle: sets rectangle as selecting pattern.
     * * box: sets box as selecting pattern.
     * * verticalstripe: sets vertical stripe as  selecting pattern.
     * * horizontalstripe: sets horizontal stripe as selecting pattern.
     * * bubble: sets bubble as selecting pattern.
     *
     * @default None
     */
    @Property('None')
    public selectionPattern: SelectionPattern;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: sets none as highlighting pattern.
     * * chessboard: sets chess board as highlighting pattern.
     * * dots: sets dots as highlighting pattern.
     * * diagonalForward: sets diagonal forward as highlighting pattern.
     * * crosshatch: sets crosshatch as highlighting pattern.
     * * pacman: sets pacman highlighting  pattern.
     * * diagonalbackward: sets diagonal backward as highlighting pattern.
     * * grid: sets grid as highlighting pattern.
     * * turquoise: sets turquoise as highlighting pattern.
     * * star: sets star as highlighting  pattern.
     * * triangle: sets triangle as highlighting pattern.
     * * circle: sets circle as highlighting  pattern.
     * * tile: sets tile as highlighting pattern.
     * * horizontaldash: sets horizontal dash as highlighting pattern.
     * * verticaldash: sets vertical dash as highlighting pattern.
     * * rectangle: sets rectangle as highlighting  pattern.
     * * box: sets box as highlighting pattern.
     * * verticalstripe: sets vertical stripe as highlighting  pattern.
     * * horizontalstripe: sets horizontal stripe as highlighting  pattern.
     * * bubble: sets bubble as highlighting  pattern.
     *
     * @default None
     */
    @Property('None')
    public highlightPattern: SelectionPattern;

    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     *
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * If set true, enables the multi drag selection in chart. It requires `selectionMode` to be `Dragx` | `DragY` | or `DragXY`.
     *
     * @default false
     */
    @Property(false)
    public allowMultiSelection: boolean;

    /**
     * To enable export feature in chart.
     *
     * @default true
     */
    @Property(true)
    public enableExport: boolean;

    /**
     * To enable export feature in blazor chart.
     *
     * @default false
     */
    @Property(false)
    public allowExport: boolean;

    /**
     * Specifies the point indexes to be selected while loading a chart.
     * It requires `selectionMode` or `highlightMode` to be `Point` | `Series` | or `Cluster`.
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
     *
     * @default []
     */
    @Collection<IndexesModel>([], Indexes)
    public selectedDataIndexes: IndexesModel[];

    /**
     * Specifies whether a grouping separator should be used for a number.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * If set to true, both axis interval will be calculated automatically with respect to the zoomed range.
     *
     * @default false
     */
    @Property(false)
    public enableAutoIntervalOnBothAxis: boolean;

    /**
     * It specifies whether the chart should be render in transposed manner or not.
     *
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * It specifies whether the chart should be rendered in canvas mode
     *
     * @default false
     */
    @Property(false)
    public enableCanvas: boolean;

    /**
     * The background image of the chart that accepts value in string as url link or location of an image.
     *
     * @default null
     */
    @Property(null)
    public backgroundImage: string;

    /**
     * Defines the collection of technical indicators, that are used in financial markets
     */
    @Collection<TechnicalIndicatorModel>([], TechnicalIndicator)
    public indicators: TechnicalIndicatorModel[];

    /**
     * If set true, Animation process will be executed.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Description for chart.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the chart.
     *
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    /**
     * To enable the side by side placing the points for column type series.
     *
     * @default true
     */
    @Property(true)
    public enableSideBySidePlacement: boolean;

    /**
     * Triggers after resizing of chart
     *
     * @event resized
     * @blazorProperty 'Resized'
     */
    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * Triggers before resizing of chart
     * @event
     * @blazorProperty 'BeforeResize'
     */
    @Event()
    public beforeResize: EmitType<IBeforeResizeEventArgs>;

    /**
     * Triggers before the annotation gets rendered.
     *
     * @event annotationRender
     * @deprecated
     */

    @Event()
    public annotationRender: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     * @blazorProperty 'OnPrint'
     */

    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /**
     * Triggers after chart load.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the export gets started.
     *
     * @event beforeExport
     */
    @Event()
    public beforeExport: EmitType<IExportEventArgs>;

    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     * @blazorProperty 'AfterExport'
     */
    @Event()
    public afterExport: EmitType<IAfterExportEventArgs>;

    /**
     * Triggers before chart load.
     *
     * @event load
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after animation is completed for the series.
     *
     * @event animationComplete
     * @blazorProperty 'OnAnimationComplete'
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before the legend is rendered.
     *
     * @event legendRender
     * @deprecated
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for series is rendered.
     *
     * @event textRender
     * @deprecated
     */

    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers before each points for the series is rendered.
     *
     * @event pointRender
     * @deprecated
     */

    @Event()
    public pointRender: EmitType<IPointRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     *
     * @event seriesRender
     * @deprecated
     */

    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;
    /**
     * Triggers before each axis label is rendered.
     *
     * @event axisLabelRender
     * @deprecated
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;
    /**
     * Triggers when x axis label clicked.
     *
     * @event axisLabelClick
     * @deprecated
     */
    @Event()
    public axisLabelClick: EmitType<IAxisLabelClickEventArgs>;
    /**
     * Triggers before each axis range is rendered.
     *
     * @event axisRangeCalculated
     * @deprecated
     */
    @Event()
    public axisRangeCalculated: EmitType<IAxisRangeCalculatedEventArgs>;
    /**
     * Triggers before each axis multi label is rendered.
     *
     * @event axisMultiLabelRender
     * @deprecated
     */
    @Event()
    public axisMultiLabelRender: EmitType<IAxisMultiLabelRenderEventArgs>;
    /**
     * Triggers after click on legend
     *
     * @event legendClick
     */
    @Event()
    public legendClick: EmitType<ILegendClickEventArgs>;

    /**
     * Triggers after click on multiLevelLabelClick
     *
     * @event multiLevelLabelClick
     */
    @Event()
    public multiLevelLabelClick: EmitType<IMultiLevelLabelClickEventArgs>;
    /**
     * Triggers before the tooltip for series is rendered.
     *
     * @event tooltipRender
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before the shared tooltip for series is rendered.
     *
     * @event sharedTooltipRender
     */

    @Event()
    public sharedTooltipRender: EmitType<ISharedTooltipRenderEventArgs>;

    /**
     * Triggers on hovering the chart.
     *
     * @event chartMouseMove
     * @blazorProperty 'OnChartMouseMove'
     */

    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the chart.
     *
     * @event chartMouseClick
     * @blazorProperty 'OnChartMouseClick'
     */

    @Event()
    public chartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers on double clicking the chart.
     *
     * @event chartDoubleClick
     * @blazorProperty 'OnChartDoubleClick'
     */

    @Event()
    public chartDoubleClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point click.
     *
     * @event pointClick
     * @blazorProperty 'OnPointClick'
     */

    @Event()
    public pointClick: EmitType<IPointEventArgs>;

    /**
     * Triggers on point double click.
     *
     * @event pointDoubleClick
     * @blazorProperty 'OnPointDoubleClick'
     */

    @Event()
    public pointDoubleClick: EmitType<IPointEventArgs>;

    /**
     * Triggers on point move.
     *
     * @event pointMove
     * @blazorProperty 'PointMoved'
     */

    @Event()
    public pointMove: EmitType<IPointEventArgs>;


    /**
     * Triggers when cursor leaves the chart.
     *
     * @event chartMouseLeave
     * @blazorProperty 'OnChartMouseLeave'
     */

    @Event()
    public chartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     *
     * @event chartMouseDown
     * @blazorProperty 'OnChartMouseDown'
     */

    @Event()
    public chartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     *
     * @event chartMouseUp
     * @blazorProperty 'OnChartMouseUp'
     */

    @Event()
    public chartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers after the drag selection is completed.
     *
     * @event dragComplete
     * @blazorProperty 'OnDragComplete'
     */

    @Event()
    public dragComplete: EmitType<IDragCompleteEventArgs>;

    /**
     * Triggers after the selection is completed.
     *
     * @event selectionComplete
     * @blazorProperty 'OnSelectionComplete'
     */

    @Event()
    public selectionComplete: EmitType<ISelectionCompleteEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     *
     * @event zoomComplete
     * @deprecated
     */

    @Event()
    public zoomComplete: EmitType<IZoomCompleteEventArgs>;

    /**
     * Triggers after the zoom selection is triggered.
     *
     * @event onZooming
     */
    @Event()
    public onZooming: EmitType<IZoomingEventArgs>;


    /**
     * Triggers when start the scroll.
     *
     * @event scrollStart
     * @blazorProperty 'OnScrollStart'
     */
    @Event()
    public scrollStart: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the scroll end.
     *
     * @event scrollEnd
     * @blazorProperty 'OnScrollEnd'
     */
    @Event()
    public scrollEnd: EmitType<IScrollEventArgs>;

    /**
     * Triggers when change the scroll.
     *
     * @event scrollChanged
     * @blazorProperty 'ScrollChanged'
     */
    @Event()
    public scrollChanged: EmitType<IScrollEventArgs>;

    /**
     * Triggers when the point drag start.
     *
     * @event dragStart
     */
    @Event()
    public dragStart: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point is dragging.
     *
     * @event drag
     */
    @Event()
    public drag: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point drag end.
     *
     * @event dragEnd
     */
    @Event()
    public dragEnd: EmitType<IDataEditingEventArgs>;

    /**
     * Defines the currencyCode format of the chart
     *
     * @private
     * @aspType string
     */
    @Property('USD')
    private currencyCode: string;

    // Internal variables
    private htmlObject: HTMLElement;
    private isLegend: boolean;
    /** @private */
    public stockChart: StockChart;

    /**
     * localization object
     *
     * @private
     */
    public localeObject: L10n;
    /**
     * It contains default values of localization values
     */
    private defaultLocalConstants: Object;

    /**
     * Gets the current visible axis of the Chart.
     *
     * @hidden
     */
    public axisCollections: Axis[];
    /**
     * Gets the current visible series of the Chart.
     *
     * @hidden
     */
    public visibleSeries: Series[];
    /**
     * Render panel for chart.
     *
     * @hidden
     */
    public chartAxisLayoutPanel: CartesianAxisLayoutPanel | PolarRadarPanel;
    /**
     * Gets all the horizontal axis of the Chart.
     *
     * @hidden
     */
    public horizontalAxes: Axis[];
    /**
     * Gets all the vertical axis of the Chart.
     *
     * @hidden
     */
    public verticalAxes: Axis[];
    /**
     * Gets the inverted chart.
     *
     * @hidden
     */
    public requireInvertedAxis: boolean;
    /** @private */
    public svgObject: Element;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public renderer: SvgRenderer | CanvasRenderer;
    /** @private */
    public svgRenderer: SvgRenderer;
    /** @private */
    public canvasRender: CanvasRenderer;
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
    public rotatedDataLabelCollections: ChartLocation[][] = [];
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
    /** @public */
    public animated: boolean = false;
    /** @public */
    public duration: number;
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
    /** @private */
    public isPointMouseDown: boolean = false;
    /** @private */
    public isScrolling: boolean = false;
    /** @private */
    public dragY: number;
    private resizeTo: number;
    /** @private */
    private checkResize: number = 0;
    /** @private */
    public disableTrackTooltip: boolean;
    /** @private */
    public startMove: boolean;
    /** @private */
    public yAxisElements: Element;
    /** @private */
    public radius: number;
    /** @private */
    public visible: number = 0;
    /** @private */
    public clickCount: number = 0;
    /** @private */
    public maxPointCount: number = 0;
    /** @private */
    public singleClickTimer: number = 0;
    /** @private */
    public chartAreaType: string = 'Cartesian';
    /** @private */
    public isRtlEnabled: boolean = false;
    /** @private */
    public scaleX: number = 1;
    /** @private */
    public scaleY: number = 1;
    /**
     * `markerModule` is used to manipulate and add marker to the series.
     *
     * @private
     */
    public markerRender: Marker;
    private titleCollection: string[];
    private subTitleCollection: string[];
    /** @private */
    public themeStyle: IThemeStyle;
    /** @private */
    public scrollElement: Element;
    /** @private */
    public scrollSettingEnabled: boolean;
    private chartid: number = 57723;
    /** @private */
    public svgId: string;
    /** @private */
    public isBlazor: boolean;
    /** @private */
    public isRedrawSelection: boolean;
    /**
     * Touch object to unwire the touch event from element
     */
    private touchObject: Touch;
    /** @private */
    // eslint-disable-next-line
    public resizeBound: any;
    /** @private */
    // eslint-disable-next-line
    public longPressBound: any;

    /**
     * Constructor for creating the widget
     *
     * @hidden
     */
    constructor(options?: ChartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        setValue('mergePersistData', this.mergePersistChartData, this);
    }
    /**
     * To manage persist chart data
     */
    private mergePersistChartData(): void {
        const data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            const dataObj: Chart = JSON.parse(data);
            const keys: string[] = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (const key of keys) {
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    extend(this[key], dataObj[key]);
                } else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    }

    /**
     *
     * @param elementId
     * Return the proper ID when the special character exist in the ID
     */
    private isIdHasSpecialCharacter(elementId: string): string {
        const regex: RegExp = /^[A-Za-z ]+$/;
        const numberRegex: RegExp = /^[0-9 ]+$/;
        let childElementId: string = '';
        if (!regex.test(elementId)) {
            let start: number = 0;
            if (numberRegex.test(elementId[0])) {
                childElementId += ('\\3' + elementId[0]);
                start = 1;
            }
            for (let i: number = start; i < elementId.length; i++) {
                if (!regex.test(elementId[i]) && elementId.indexOf('-') === -1 &&
                    elementId.indexOf('_') === -1 && elementId.indexOf('\\') === -1 && !numberRegex.test(elementId[i])) {
                    childElementId += ('\\' + elementId[i]);
                } else {
                    childElementId += elementId[i];
                }
            }
            return childElementId;
        } else {
            return elementId;
        }
    }

    /**
     * Initialize the event handler.
     */

    protected preRender(): void {
        this.element.id = this.isIdHasSpecialCharacter(this.element.id);
        // It is used for checking blazor framework or not.
        const blazor: string = 'Blazor';
        this.isBlazor = window[blazor];
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.initPrivateVariable();
        this.setCulture();
        this.wireEvents();

        if (this.stockChart) {
            if (this.stockChart.tooltip.header === null) {
                this.tooltip.header = '<b>${point.x}</b>';
            }
            if (this.stockChart.tooltip.format === null) {
                this.tooltip.format = 'High : <b>${point.high}</b><br/>Low :' +
                    ' <b>${point.low}</b><br/>Open : <b>${point.open}</b><br/>Close : <b>${point.close}</b>';
                if (this.stockChart.series[0].volume !== '') {
                    this.tooltip.format += '<br/>Volume : <b>${point.volume}</b>';
                }
            }
            this.animateSeries = false;
        }

        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : '');
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
            const collection: number = document.getElementsByClassName('e-chart').length;
            this.element.id = 'chart_' + this.chartid + '_' + collection;
        }
        //seperate ID to differentiate chart and stock chart
        this.svgId = this.stockChart ? this.stockChart.element.id + '_stockChart_chart' :
            this.element.id + (this.enableCanvas ? '_canvas' : '_svg');
    }

    /**
     * To Initialize the control rendering.
     */

    protected render(): void {
        this.svgRenderer = new SvgRenderer(this.element.id);
        const loadEventData: ILoadedEventArgs = {
            chart: this.isBlazor ? {} as Chart : this, theme: this.theme, name: load, cancel: false
        };
        if (!this.stockChart) {
            /**
             * Load event for the chart will be triggered only chart componet, if this is stock chart, load event did not triggered.
             */
            this.trigger(load, loadEventData, () => {
                if (!loadEventData.cancel) {
                    this.cartesianChartRendering(loadEventData);
                }
            });
        } else {
            // The fix is specific for nextjs app, as window is set as not defined for server side application like nextjs.
            this.isRtlEnabled = (window.getComputedStyle(document.querySelector('body')).direction === 'rtl');
            this.cartesianChartRendering(loadEventData);
        }
    }


    private cartesianChartRendering(beforeRenderData: ILoadedEventArgs): void {

        this.theme = this.isBlazor ? beforeRenderData.theme : this.theme;

        this.createChartSvg();

        this.setTheme();

        this.markerRender = new Marker(this);

        this.calculateAreaType();

        this.calculateVisibleSeries();

        this.initTechnicalIndicators();

        this.initTrendLines();

        this.calculateVisibleAxis();

        this.processData();

        this.renderComplete();

        this.allowServerDataBinding = true;
    }

    /**
     * Gets the localized label by locale keyword.
     *
     * @param  {string} key key
     * @returns {string} localized label
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObject.getConstant(key);
    }

    /**
     * Animate the series bounds.
     *
     * @private
     */
    public animate(duration ?: number): void {
        this.redraw = true;
        this.animated = true; //used to set duration as 1000 for animation at default 300
        this.duration = duration ? duration : 1000;
    }

    /**
     * Refresh the chart bounds.
     *
     * @private
     */

    public refreshBound(): void {
        this.rotatedDataLabelCollections = [];
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.visibleSeries, this);
        }
        /**
         * I264230, EJ2-36761
         * Issue: Tooltip doesnot appears after zooming and hovering on same point
         * Root cause: While performing zoom, previous points in tooltip restore.
         * Fix: previous points set to empty array
         */
        if (this.tooltip.enable && this.tooltipModule) {
            this.tooltipModule.previousPoints = [];
        }
        this.calculateStackValues();

        this.calculateBounds();

        //this prevents the initial rendering of stock chart
        if (this.stockChart && !this.stockChart.rangeFound) {
            if (this.stockChart.enablePeriodSelector || this.stockChart.enableSelector) {
                return null;
            }
        }

        this.renderElements();

        removeElement('chartmeasuretext');
        this.removeSelection();
        
        if (this.markerRender) {
            this.markerRender.mergeXvalues(this.visibleSeries);
        }
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
    private removeSelection(): void {
        for (const series of this.visibleSeries) {
            if (series.visible) {
                for (const point of series.points) {
                    point.isSelect = false;
                }
            }
        }
        if (getElement(this.element.id + '_ej2_drag_multi_group')) {
            if (this.selectionMode.indexOf('Drag') > -1) {
                this.selectionModule.filterArray = [];
            }
            removeElement(this.element.id + '_ej2_drag_multi_group');
            this.selectionModule.calculateDragSelectedElements(this, new Rect(0, 0, 0, 0), true);
        } else if (getElement(this.element.id + '_ej2_drag_group')) {
            if (this.selectionMode !== 'Lasso') {
                this.selectionModule.filterArray = [];
            }
            removeElement(this.element.id + '_ej2_drag_group');
            this.selectionModule.calculateDragSelectedElements(this, new Rect(0, 0, 0, 0), true);
        }
    }

    private renderElements(): void {

        this.renderBorder();

        this.renderTitle();

        this.renderAreaBorder();

        this.renderSeriesElements(this.renderAxes());

        this.renderLegend();

        this.applyZoomkit();

        this.performSelection();

        this.setSecondaryElementPosition();

        for (const value of this.visibleSeries) {
            updateBlazorTemplate(this.element.id + '_DataLabel', 'Template', value.marker.dataLabel);
        }

        this.renderAnnotation();
    }

    /**
     * To render the legend
     *
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
        if (this.legendModule && this.legendModule.legendCollections.length && this.legendSettings.visible) {
            this.legendModule.calTotalPage = true;
            const borderWidth: number = this.legendSettings.border.width;
            const bounds: Rect = this.legendModule.legendBounds;
            let rect: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
            if (this.enableCanvas) {
                rect = new Rect(rect.x - borderWidth / 2, rect.y - borderWidth / 2, rect.width + borderWidth, rect.height + borderWidth);
                (this.renderer as CanvasRenderer).canvasClip(rect);
            }
            this.legendModule.renderLegend(this, this.legendSettings, bounds);
            if (this.enableCanvas) {
                (this.renderer as CanvasRenderer).canvasRestore();
            }
        }
        if (!this.redraw) {
            if (!this.stockChart) {
                this.element.appendChild(this.svgObject);
            } else  {
                if (!getElement(this.stockChart.chartObject.id)) {
                    this.stockChart.mainObject.appendChild(this.svgObject);
                }
            }
        }
    }
    /**
     * To set the left and top position for data label template for center aligned chart
     */
    private setSecondaryElementPosition(): void {
        const element: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect =  getElement(this.svgId).getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }
    private initializeModuleElements(): void {
        this.dataLabelCollections = [];
        const elementId: string = this.element.id;
        if (this.series.length) {
            this.seriesElements = this.svgRenderer.createGroup({ id: elementId + 'SeriesCollection' });
        }
        if (this.indicators.length) {
            this.indicatorElements = this.renderer.createGroup({ id: elementId + 'IndicatorCollection' });
        }
        if (this.hasTrendlines()) {
            this.trendLineElements = this.renderer.createGroup({ id: elementId + 'TrendLineCollection' });
        }
        this.dataLabelElements = this.renderer.createGroup({ id: elementId + 'DataLabelCollection' });
    }

    private hasTrendlines(): boolean {
        let isTrendline: boolean;
        for (const series of this.series) {
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
        const elementId: string = this.element.id;
        if (this.element.tagName !== 'g') {
            const tooltipDiv: Element = redrawElement(this.redraw, elementId + '_Secondary_Element') ||
                this.createElement('div');
            tooltipDiv.id = elementId + '_Secondary_Element';
            (tooltipDiv as HTMLElement).style.cssText = 'position: relative';
            appendChildElement(false, this.element, tooltipDiv, this.redraw);
        }
        // For canvas
        if (this.enableCanvas) {
            let tooltipdiv: Element = document.getElementById(elementId + '_Secondary_Element');
            tooltipdiv = !tooltipdiv ? this.createElement('div', { id: elementId + '_Secondary_Element',
                attrs: {'style': 'position: relative; left:0px; top:0px' } }) : tooltipdiv;
            const svg: Element = this.svgRenderer.createSvg({
                id: elementId + '_tooltip_svg',
                width: this.availableSize.width,
                height: this.availableSize.height
            });
            (svg as SVGElement).style.cssText = 'position: absolute; pointer-events: none';
            tooltipdiv.appendChild(svg);
        }
        // For userInteraction
        if (this.tooltip.enable) {
            appendChildElement(
                this.enableCanvas, this.svgObject, this.renderer.createGroup(
                    { id: elementId + '_UserInteraction', style: 'pointer-events:none;' }
                ),
                this.redraw
            );
        }

        if (this.rows.length > 0 && this.columns.length > 0) {

            this.initializeIndicator();

            this.initializeTrendLine();

            this.renderSeries();
            // Trendline is append to DOM after the series
            if (this.trendLineElements) {
                appendChildElement(this.enableCanvas, this.svgObject, this.trendLineElements, this.redraw);
            }

            this.appendElementsAfterSeries(axisElement);
        }
    }
    /**
     * @private
     */
    public renderSeries(): void {
        let visibility: boolean;
        if (this.enableCanvas) {
            // To clip the series rect for canvas
            (this.renderer as CanvasRenderer).canvasClip(this.chartAxisLayoutPanel.seriesClipRect);
        }
        for (const item of this.visibleSeries) {
            if (item.category === 'TrendLine') {
                visibility = this.series[item.sourceIndex].trendlines[item.index].visible;
            } else {
                visibility = item.visible;
            }
            if (visibility) {
                this.visible++;
                findClipRect(item);
                if (this.enableCanvas) {
                    // To render scatter and bubble series in canvas
                    this.renderCanvasSeries(item);
                }
                item.renderSeries(this);
            }
        }
        if (this.enableCanvas) {
            (this.renderer as CanvasRenderer).canvasRestore();
        }
        this.visible = 0;
        const options: BaseAttibutes = {
            'id': this.element.id + '_ChartAreaClipRect_',
            'x': this.chartAxisLayoutPanel.seriesClipRect.x,
            'y': this.chartAxisLayoutPanel.seriesClipRect.y,
            'width': this.chartAxisLayoutPanel.seriesClipRect.width,
            'height': this.chartAxisLayoutPanel.seriesClipRect.height,
            'fill': 'transparent',
            'stroke-width': 1,
            'stroke': 'Gray'
        };
        if (!this.seriesElements) {
            return;
        }
        if (!this.enableCanvas) {
            this.seriesElements.appendChild(
                appendClipElement(this.redraw, options, this.renderer as SvgRenderer)
            );
        }
        const seriesSvg: HTMLElement = document.getElementById(this.element.id + '_series_svg');
        if (seriesSvg) {
            appendChildElement(false, seriesSvg, this.seriesElements, this.redraw);
        } else {
            appendChildElement(this.enableCanvas, this.svgObject, this.seriesElements, this.redraw);
        }
    }
    protected renderCanvasSeries(item: Series): void {
        let svgElement: Element;
        let divElement: Element;
        if ((item.type === 'Bubble' || item.type === 'Scatter')) {
            svgElement = !svgElement ? this.svgRenderer.createSvg({ id: this.element.id + '_series_svg',
                width: this.availableSize.width, height: this.availableSize.height }) : svgElement;
            divElement = !divElement ? this.createElement('div', { id: this.element.id + '_series' }) : divElement;
            (divElement as HTMLElement).style.cssText = 'position: absolute';
            const mainElement: HTMLElement = document.getElementById(this.element.id + '_Secondary_Element');
            divElement.appendChild(svgElement);
            mainElement.appendChild(divElement);
        }
        svgElement = (this.enableCanvas && (item.type === 'Bubble' || item.type === 'Scatter')) ?
            svgElement : this.svgObject;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const canvas: boolean = (this.enableCanvas && (item.type === 'Bubble' || item.type === 'Scatter')) ?
            false : this.enableCanvas;
    }
    private initializeIndicator(): void {
        for (const indicator of this.indicators) {
            if (this[firstToLowerCase(indicator.type) + 'IndicatorModule']) {
                this[firstToLowerCase(indicator.type) + 'IndicatorModule'].createIndicatorElements(
                    this, indicator as TechnicalIndicator, (indicator as TechnicalIndicator).index);
            }
        }
        if (this.indicatorElements) {
            appendChildElement(this.enableCanvas, this.svgObject, this.indicatorElements, this.redraw);
        }
    }

    private initializeTrendLine(): void {
        for (const series of this.visibleSeries) {
            if (series.trendlines.length) {
                this.trendLineModule.getTrendLineElements(series, this);
            }
        }
    }

    private appendElementsAfterSeries(axisElement: Element): void {

        if (this.chartAreaType === 'PolarRadar') {
            appendChildElement(this.enableCanvas, this.svgObject, this.yAxisElements, this.redraw);
        }

        appendChildElement(this.enableCanvas, this.svgObject, axisElement, this.redraw);
        if ((this.zoomModule && this.zoomSettings.enableScrollbar && this.scrollElement.childElementCount) ||
            (this.scrollElement && this.scrollElement.childElementCount)) {
            appendChildElement(false, getElement(this.element.id + '_Secondary_Element'), this.scrollElement, this.redraw);
        }

        if (this.stripLineModule) {
            this.stripLineModule.renderStripLine(this, 'Over', this.axisCollections);
        }

        if (!this.tooltip.enable) {
            appendChildElement(
                this.enableCanvas, this.svgObject, this.renderer.createGroup(
                    { id: this.element.id + '_UserInteraction', style: 'pointer-events:none;' }
                ),
                this.redraw
            );
        }
        if (this.stockChart) {
            this.stockChart.calculateStockEvents();
        }
    }
    private applyZoomkit(): void {
        /**
         * Issue: Zoomkit not visible after performing refresh()
         * Fix: this method called without checking `zoomModule.isZoomed`
         */
        if (this.chartAreaType === 'PolarRadar') {
            return;
        }
        if (!this.redraw && this.zoomModule && (!this.zoomSettings.enablePan || this.zoomModule.performedUI)) {
            this.zoomModule.applyZoomToolkit(this, this.axisCollections);
        }
    }
    /**
     * Render annotation perform here
     *
     * @private
     */
    private renderAnnotation(): void {
        if (this.annotationModule) {

            //for stock chart, stock chart's id is added to render the annotations
            this.annotationModule.renderAnnotations(
                getElement((this.stockChart ? this.stockChart.element.id : this.element.id) + '_Secondary_Element')
            );
        }
    }

    private performSelection(): void {
        let selectedDataIndexes: Indexes[] = [];
        if (this.selectionModule) {
            selectedDataIndexes = <Indexes[]>extend([], this.selectionModule.selectedDataIndexes, null, true);
            this.selectionModule.invokeSelection(this);
        }
        if (this.highlightModule) {
            this.highlightModule.invokeHighlight(this);
        }
        if (selectedDataIndexes.length > 0) {
            this.selectionModule.selectedDataIndexes = selectedDataIndexes;
            this.selectionModule.redrawSelection(this, this.selectionMode);
        }
    }
    public processData(render: boolean = true): void {
        this.visibleSeriesCount = 0;
        let check: boolean = true;
        let prevPointCount: number = 0;
        for (const series of this.visibleSeries) {
            if (!series.visible && !this.legendSettings.visible) {
                this.visibleSeriesCount++;
                continue;
            }
            if (series.category !== 'Indicator' && series.category !== 'TrendLine') {
                this.initializeDataModule(series);
            }
        }
        for (const indicator of this.indicators) {
            if (indicator.dataSource) {
                const techIndicator: TechnicalIndicator = indicator as TechnicalIndicator;
                this.initializeDataModule(techIndicator);
                check = false;
            }
        }
        if (render && (!this.visibleSeries.length || this.visibleSeriesCount === this.visibleSeries.length && check)) {
            this.refreshBound();
            this.trigger('loaded', { chart: this.isBlazor ? {} : this });
        }

        if (!this.stockChart && this.visibleSeries.length > 0) {
            for (const series of this.visibleSeries) {
                this.maxPointCount = Math.max(prevPointCount, series.points.length);
                prevPointCount = series.points.length;
            }
        }
    }

    private initializeDataModule(series: SeriesBase): void {
        series.xData = []; series.yData = [];
        let dataSource: Object | DataManager;
        const isAngular: string = 'isAngular';
        if (this[isAngular]) {
            dataSource = Object.keys(series.dataSource).length ? series.dataSource : this.dataSource;
        } else {
            dataSource = series.dataSource || this.dataSource;
        }
        series.dataModule = new Data(dataSource, series.query);
        series.points = [];
        (series as TechnicalIndicator).refreshDataManager(this);
    }

    private calculateBounds(): void {
        const margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        let titleWidth: number = 0;
        const padding: number = 15;
        let left: number = margin.left;
        const width: number = this.availableSize.width - left - margin.right - this.border.width;
        this.titleCollection = [];
        this.subTitleCollection = [];
        if (this.title) {
            this.titleCollection = getTitle(this.title, this.titleStyle, width);
            titleHeight = (measureText(this.title, this.titleStyle).height * this.titleCollection.length) + padding;
            if (this.subTitle) {
                let maxWidth: number = 0;
                for (const titleText of this.titleCollection) {
                    titleWidth = measureText(titleText, this.titleStyle).width;
                    maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
                }
                this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth);
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle).height * this.subTitleCollection.length) +
                    padding;
            }
        }
        let top: number = margin.top + subTitleHeight + titleHeight + this.chartArea.border.width * 0.5;
        const height: number = this.availableSize.height - top - this.border.width - margin.bottom;
        if (this.stockChart && this.stockChart.legendSettings.visible && this.stockChart.stockLegendModule) {
            if (this.stockChart.legendSettings.position === "Top") {
                top += this.stockChart.stockLegendModule.legendBounds.height;
            } else if (this.stockChart.legendSettings.position === "Left") {
                left += this.stockChart.stockLegendModule.legendBounds.width;
            }
        }
        this.initialClipRect = new Rect(left, top, width, height);
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
        }
        this.chartAxisLayoutPanel.measureAxis(this.initialClipRect);

    }

    /**
     * Handles the print method for chart control.
     */
    public print(id?: string[] | string | Element): void {
        const exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print(id);
    }

    /**
     * Defines the trendline initialization
     */
    private initTrendLines(): void {
        this.isProtectedOnChange = true;
        for (const series of this.visibleSeries) {
            let trendIndex: number = 0;
            for (const trendline of series.trendlines) {
                const trendLine: Trendline = trendline as Trendline;
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
        this.isProtectedOnChange = false;
    }

    private calculateAreaType(): void {
        const series: SeriesModel = this.series[0];
        this.chartArea.border.width = this.stockChart ? 0 : this.chartArea.border.width;
        if (series) {
            this.requireInvertedAxis = ((series.type.indexOf('Bar') !== -1) && !this.isTransposed) ||
                ((series.type.indexOf('Bar') === -1) && this.isTransposed && this.chartAreaType !== 'PolarRadar');
        }
        this.chartAxisLayoutPanel = this.chartAreaType === 'PolarRadar' ? (this.polarSeriesModule || this.radarSeriesModule)
            : new CartesianAxisLayoutPanel(this);
    }
    /**
     * Calculate the visible axis
     *
     * @private
     */
    private calculateVisibleAxis(): void {
        let axis: Axis;
        let axes: AxisModel[] = [this.primaryXAxis, this.primaryYAxis];
        axes = this.chartAreaType === 'Cartesian' ? axes.concat(this.axes) : axes;
        if (this.paretoSeriesModule && this.series[0].type === 'Pareto') {
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
        if (this.scrollSettingEnabled) {
            if (this.scrollBarModule) {
                this.scrollBarModule.axes = <Axis[]> axes;
            }
        }
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            axis = <Axis>axes[i]; axis.series = [];
            axis.labels = []; axis.indexLabels = {};
            for (const series of this.visibleSeries) {
                this.initAxis(series, axis, true);
            }
            for (const indicator of this.indicators) {
                this.initAxis(indicator as SeriesBase, axis, false);
            }
            if (this.scrollBarModule && !axis.zoomingScrollBar) {
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
        for (const indicator of this.indicators) {
            const techIndicator: TechnicalIndicator = indicator as TechnicalIndicator;
            const type: string = firstToLowerCase(techIndicator.type);
            if (this[type + 'IndicatorModule']) {
                techIndicator.index = i;
                this[type + 'IndicatorModule'].initSeriesCollection(techIndicator, this);
                for (const targetSeries of techIndicator.targetSeries) {
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
                for (const indicator of this.indicators) {
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
        const colors: string[] = this.palettes.length ? this.palettes : getSeriesColor(this.theme);
        const count: number = colors.length;
        const seriesCollection: SeriesModel[] = this.series.sort((a: SeriesModel, b: SeriesModel) => { return a.zOrder - b.zOrder; });
        for (let i: number = 0, len: number = seriesCollection.length; i < len; i++) {
            series = <Series>seriesCollection[i];
            // for y axis label issue during chart navigation
            series.category = seriesCollection[0].type === 'Pareto' ? 'Pareto' : 'Series';
            series.index = i;
            series.interior = series.fill || colors[i % count];
            switch (series.type) {
            case 'Bar':
            case 'StackingBar':
            case 'StackingBar100':
                if (seriesCollection[0].type.indexOf('Bar') === -1) {
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
                if (this.chartAreaType === 'PolarRadar' || seriesCollection[0].type.indexOf('Bar') > -1) {
                    continue;
                }
                break;
            }
            this.visibleSeries.push(series);
            seriesCollection[i] = series;
        }
    }

    private renderTitle(): void {
        let rect: Rect;
        const margin: MarginModel = this.margin;
        if (this.title) {
            const getAnchor: string = getTextAnchor(this.titleStyle.textAlignment, this.enableRtl);
            const elementSize: Size = measureText(this.title, this.titleStyle);
            rect = new Rect(
                margin.left, 0, this.availableSize.width - margin.left - margin.right, 0
            );
            const options: TextOption = new TextOption(
                this.element.id + '_ChartTitle',
                titlePositionX(rect, this.titleStyle),
                this.margin.top + ((elementSize.height) * 3 / 4),
                getAnchor, this.titleCollection, '', 'auto'
            );
            const element: Element = redrawElement(this.redraw, this.element.id + '_ChartTitle', options, this.renderer) ||
                textElement(
                    this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitle, this.svgObject,
                    null, null, null, null, null, null, null, null, this.enableCanvas
                );
            if (element) {
                element.setAttribute('aria-label', this.description || this.title);
                element.setAttribute('tabindex', this.tabIndex.toString());
            }
            if (this.subTitle) {
                this.renderSubTitle(options);
            }
        }
    }
    private renderSubTitle(options: TextOption): void {
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        const padding: number = 10;
        const alignment: Alignment = this.titleStyle.textAlignment;
        for (const titleText of this.titleCollection) {
            titleWidth = measureText(titleText, this.titleStyle).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        const subTitleElementSize: Size = measureText(this.subTitle, this.subTitleStyle);
        const rect: Rect = new Rect(
            alignment === 'Center' ? (options.x - maxWidth * 0.5) : alignment === 'Far' ? options.x - maxWidth : options.x,
            0, maxWidth, 0
        );
        const subTitleOptions: TextOption = new TextOption(
            this.element.id + '_ChartSubTitle',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding,
            getTextAnchor(this.subTitleStyle.textAlignment, this.enableRtl), this.subTitleCollection, '', 'auto'
        );
        const element: Element = redrawElement(this.redraw, this.element.id + '_ChartSubTitle', subTitleOptions, this.renderer) ||
            textElement(
                this.renderer, subTitleOptions, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartTitle, this.svgObject,
                null, null, null, null, null, null, null, null, this.enableCanvas
            );
        if (element) {
            element.setAttribute('aria-label', this.description || this.subTitle);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }
    private renderBorder(): void {
        let x: number = 0;
        let y: number = 0;
        const width: number = this.border.width;
        const backGroundImage: string = this.backgroundImage;
        const fillColor: string = backGroundImage ? 'transparent' : (this.background || this.themeStyle.background);
        if (this.stockChart && this.stockChart.legendSettings.visible && this.stockChart.stockLegendModule) {
            if (this.stockChart.legendSettings.position === "Top") {
                y += this.stockChart.stockLegendModule.legendBounds.height;
            } else if (this.stockChart.legendSettings.position === "Left") {
                x += this.stockChart.stockLegendModule.legendBounds.width;
            }
        }
        const rect: RectOption = new RectOption(
            this.element.id + '_ChartBorder', fillColor, this.border, 1,
            new Rect(width * 0.5 + x, width * 0.5 + y, this.availableSize.width - width, this.availableSize.height - width));

        this.htmlObject = redrawElement(this.redraw, this.element.id + '_ChartBorder', rect, this.renderer) as HTMLElement
            || this.renderer.drawRectangle(rect) as HTMLElement;

        appendChildElement(this.enableCanvas, this.svgObject, this.htmlObject, this.redraw);
        // to draw back ground image for chart
        if (backGroundImage) {
            const image: ImageOption = new ImageOption(
                this.availableSize.height - width,
                this.availableSize.width - width,
                backGroundImage,
                0, 0,
                this.element.id + '_ChartBackground',
                'visible', 'none'
            );
            this.htmlObject = redrawElement(this.redraw, this.element.id + '_ChartBackground', image, this.renderer) as HTMLElement
                        || this.renderer.drawImage(image) as HTMLElement;
            appendChildElement(this.enableCanvas, this.svgObject, this.htmlObject, this.redraw);
        }
    }
    /**
     * @private
     */
    public renderAreaBorder(): void {
        if (this.chartAreaType === 'PolarRadar') {
            return null;
        } else {
            const element: Element = getElement(this.element.id + '_ChartAreaBorder');
            const previousRect: Rect = element ?
                new Rect(
                    +element.getAttribute('x'), +element.getAttribute('y'),
                    +element.getAttribute('width'), +element.getAttribute('height')
                ) : null;
            const rect: RectOption = new RectOption(
                this.element.id + '_ChartAreaBorder', this.chartArea.background,
                { width: this.chartArea.border.width, color: this.chartArea.border.color || this.themeStyle.areaBorder },
                this.chartArea.opacity, this.chartAxisLayoutPanel.seriesClipRect);
            this.htmlObject = this.renderer.drawRectangle(rect) as HTMLElement;
            appendChildElement(
                this.enableCanvas, this.svgObject, this.htmlObject, this.redraw, true, 'x', 'y',
                null, null, true, true, previousRect
            );
            this.htmlObject = null;
        }
        // to draw back ground image for chart area
        const backGroundImage: string = this.chartArea.backgroundImage;
        if (backGroundImage) {
            const width: number = this.chartArea.border.width;
            const image: ImageOption = new ImageOption(
                this.initialClipRect.height - width,
                this.initialClipRect.width - width,
                backGroundImage,
                this.initialClipRect.x, this.initialClipRect.y,
                this.element.id + '_ChartAreaBackground',
                'visible', 'none'
            );
            this.htmlObject = this.renderer.drawImage(image) as HTMLElement;
            appendChildElement(
                this.enableCanvas, this.svgObject, this.htmlObject, this.redraw, true, 'x', 'y',
                null, null, true, true
            );
        }
    }

    /**
     * To add series for the chart
     *
     * @param {SeriesModel[]} seriesCollection - Defines the series collection to be added in chart.
     * @returns {void}.
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
     *
     * @param {number} index - Defines the series index to be remove in chart series
     * @returns {void}
     */
    public removeSeries(index: number): void {
        this.redraw = false; //fix for remove svg not working when use animatemethod.
        this.series.splice(index, 1);
        this.refresh();
    }

    /**
     * To Clear all series for the chart
     *
     * @returns {void}.
     */

    public clearSeries(): void {
        this.series = [];
        this.refresh();
    }

    /**
     * To add secondary axis for the chart
     *
     * @param {AxisModel[]} axisCollection - Defines the axis collection to be added in chart.
     * @returns {void}.
     */

    public addAxes(axisCollection: AxisModel[]): void {
        for (let axis of axisCollection) {
            axis = new Axis(this, 'axes', axis);
            if (this.isBlazor) {
                axis.interval = isNaN(axis.interval) ? null : axis.interval;
                axis.desiredIntervals = isNaN(axis.desiredIntervals) ? null : axis.desiredIntervals;
            }
            this.axes.push(axis);
        }
        this.refresh();
    }

    /**
     * To remove secondary axis for the chart
     *
     * @param {number} index - Defines the axis collection to be removed in chart.
     * @returns {void}
     */
    public removeAxis(index: number): void {
        this.redraw = false;
        this.axes.splice(index, 1);
        this.refresh();
    }

    /**
     * To destroy the widget
     *
     * @function destroy
     * @returns {void}.
     * @member of Chart
     */

    public destroy(): void {
        if (this.scrollBarModule) {
            this.scrollBarModule.destroy();
        }
        if (this.markerRender) {
            this.markerRender.removeEventListener();
            this.markerRender = null;
        }
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.visibleSeries = [];
        this.axisCollections = [];
        this.rotatedDataLabelCollections = [];
        this.seriesElements = null;
        this.chartAxisLayoutPanel = null;
        this.dataLabelCollections = null;
        this.dataLabelElements = null;
        this.yAxisElements = null;
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) { this.clearTemplate(); }
            super.destroy();
            if (!this.enableCanvas) {
                this.removeSvg();
                this.svgObject = null;
            }
        }
    }

    /**
     * Get component name
     */

    public getModuleName(): string {
        return 'chart';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded', 'animationComplete', 'primaryXAxis', 'primaryYAxis'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Method to create SVG element.
     */

    public createChartSvg(): void {
        this.removeSvg();
        createSvg(this);
    }

    /**
     * Method to bind events for chart
     */

    private unWireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const stopEvent: string = Browser.touchEndEvent;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, startEvent, this.chartOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.chartOnMouseClick);
        EventHandler.remove(this.element, 'dblclick', this.chartOnDoubleClick);
        EventHandler.remove(this.element, 'contextmenu', this.chartRightClick);
        EventHandler.remove(this.element, cancelEvent, this.mouseLeave);

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );

        /**
         * To fix memory issue
         */
        if (this.touchObject) {
            this.touchObject.destroy();
            this.touchObject = null;
        }

    }


    private wireEvents(): void {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /*! Find the Events type */

        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.chartOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.chartOnMouseClick, this);
        EventHandler.add(this.element, 'dblclick', this.chartOnDoubleClick, this);
        EventHandler.add(this.element, 'contextmenu', this.chartRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);

        this.resizeBound = this.chartResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );

        this.longPressBound = this.longPress.bind(this);
        this.touchObject = new Touch(this.element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });

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
        const zooming: ZoomSettingsModel = this.zoomSettings;
        const disableScroll: boolean = zooming.enableSelectionZooming || zooming.enablePinchZooming ||
            this.selectionMode !== 'None' || this.crosshair.enable || this.highlightMode !== 'None';
        element.style.touchAction = disableScroll ? 'none' : 'element';
        element.style.msTouchAction = disableScroll ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        // To fix angular and react tooltip div scrollbar issue
        element.style.overflow = 'hidden';
    }
    /**
     * Finds the orientation.
     *
     * @returns {boolean}
     * @private
     */
    public isOrientation(): boolean {
        return ('orientation' in window && 'onorientationchange' in window);
    }

    /**
     * Handles the long press on chart.
     *
     * @returns {boolean} false
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
        if (getElement(this.svgId)) {
            const svgRect: ClientRect = getElement(this.svgId).getBoundingClientRect();
            const rect: ClientRect = this.element.getBoundingClientRect();
            this.mouseY = ((pageY - rect.top) - Math.max(svgRect.top - rect.top, 0) / this.scaleX);
            this.mouseX = ((pageX - rect.left) - Math.max(svgRect.left - rect.left, 0) / this.scaleY);
        }
    }

    /**
     * Export method for the chart.
     */
    public export(type: ExportType, fileName: string): void {
        if (this.exportModule) {
            this.exportModule.export(type, fileName);
            if (this.afterExport) {
                this.exportModule.getDataUrl(this);
            }
        }
    }

    /**
     * Handles the chart resize.
     *
     * @returns {boolean} false
     * @private
     */
    public chartResize(): boolean {
        this.animateSeries = false;
        const arg: IResizeEventArgs = {
            chart: this.isBlazor ? {} as Chart : this,
            name: resized,
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            )
        };
        const beforeResizeArgs: IBeforeResizeEventArgs = { name: 'beforeResize', cancelResizedEvent: false };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.trigger(beforeResize, beforeResizeArgs);
        if (!beforeResizeArgs.cancelResizedEvent) {
            this.resizeTo = +setTimeout(
                (): void => {
                    if (this.isDestroyed || this.stockChart) {
                        clearTimeout(this.resizeTo);
                        return;
                    }
                    this.createChartSvg();
                    arg.currentSize = this.availableSize;
                    this.trigger(resized, arg);
                    this.refreshAxis();
                    this.refreshBound();
                    this.trigger('loaded', { chart: this.isBlazor ? {} : this });
                },
                500);
        }
        return false;

    }
    /**
     * Handles the mouse move.
     *
     * @returns {boolean} false
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
        if (getElement(this.svgId)) {
            this.setMouseXY(pageX, pageY);
            this.chartOnMouseMove(e);
        }
        return false;
    }
    /**
     * Handles the mouse leave.
     *
     * @returns {boolean} false
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
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnMouseLeave(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.trigger(chartMouseLeave, { target: element.id, x: this.mouseX, y: this.mouseY });
        removeElement(this.element.id + '_EJ2_AxisLabel_Tooltip');
        this.isChartDrag = this.isPointMouseDown = false;
        this.notify(cancelEvent, e);
        return false;
    }
    /**
     * Handles the mouse double click on chart.
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnDoubleClick(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger(chartDoubleClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        return false;
    }
    /**
     * Handles the mouse click on chart.
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnMouseClick(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger(chartMouseClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.clickCount++;
        let timeInterval: number = 0;
        const isAngular: string = 'isAngular';
        if (this[isAngular]) {
            const observers: string = 'observers';
            timeInterval = this.pointDoubleClick[observers].length > 0 ? 400 : 0;
        } else {
            timeInterval = this.pointDoubleClick ? 400 : 0;
        }
        if (this.clickCount === 1 && this.pointClick) {
            this.singleClickTimer = +setTimeout(
                (): void => {
                    this.clickCount = 0;
                    this.triggerPointEvent(pointClick, e);
                },
                timeInterval);
        } else if (this.clickCount === 2 && this.pointDoubleClick) {
            clearTimeout(this.singleClickTimer);
            this.clickCount = 0;
            this.triggerPointEvent(pointDoubleClick, e);
        }
        if (this.axisLabelClick) {
            this.triggerAxisLabelClickEvent(axisLabelClick, e);
        }
        this.notify('click', e);
        return false;
    }
    private triggerPointEvent(event: string, e?: PointerEvent | TouchEvent): void {
        const evt: PointerEvent = e as PointerEvent;
        const data: ChartData = new ChartData(this);
        const pointData: PointData = data.getData();
        if (pointData.series && pointData.point) {
            this.trigger(event, {
                series: this.isBlazor ? {} : pointData.series,
                point: pointData.point,
                seriesIndex: pointData.series.index, pointIndex: pointData.point.index,
                x: this.mouseX, y: this.mouseY, pageX: evt.pageX, pageY: evt.pageY
            });
        }
    }
    private triggerAxisLabelClickEvent(event: string, e?: PointerEvent | TouchEvent): void {
        const targetElement: Element = <Element>e.target;
        const clickEvt: PointerEvent = e as PointerEvent;
        if (targetElement.id.indexOf('_AxisLabel_') !== -1) {
            const index: string[] = targetElement.id.split('_AxisLabel_');
            const axisIndex: number = +index[0].slice(-1);
            const labelIndex: number = +index[1];
            const currentAxis: Axis = this.axisCollections[axisIndex];
            if (currentAxis.visible && (axisIndex === 0 || axisIndex === 1)) {
                this.trigger(event, {
                    chart: this,
                    axis: currentAxis,
                    text: currentAxis.visibleLabels[labelIndex].text as string,
                    labelID: targetElement.id,
                    index: labelIndex,
                    location: new ChartLocation(clickEvt.pageX, clickEvt.pageY),
                    value: currentAxis.visibleLabels[labelIndex].value
                });
            }
        }
    }
    /**
     * Handles the mouse move on chart.
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger(chartMouseMove, { target: element.id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, e);
        }
        // Tooltip for chart series.
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
            this.axisTooltip(e, this.mouseX, this.mouseY);
        }
        if (this.dataEditingModule) {
            this.dataEditingModule.pointMouseMove(e);
        }
        this.notify(Browser.touchMoveEvent, e);
        this.isTouch = false;
        return false;
    }
    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        const id: boolean = (targetId === (this.element.id + '_ChartTitle') || targetId === (this.element.id + '_ChartSubTitle') ||
            targetId.indexOf('_AxisTitle') > -1 || targetId.indexOf('_legend_title') > -1);
        let index: number = 0;
        if (targetId.indexOf('_AxisTitle') > -1) {
            index = parseInt(((targetId.replace(this.element.id, '')).replace('AxisLabel_', '')).split('_')[2], 10);
        }
        if (id && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            const title: string = (targetId === (this.element.id + '_ChartTitle')) ? this.title :
                targetId.indexOf('_AxisTitle') > -1 ? this.axisCollections[index].title :
                    targetId.indexOf('_ChartSubTitle') > -1 ? this.subTitle : this.legendSettings.title;
            showTooltip(
                title, x, y, this.element.offsetWidth, this.element.id + '_EJ2_Title_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch
            );
        } else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    }

    private axisTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        if (((targetId.indexOf('AxisLabel') > -1) || targetId.indexOf('Axis_MultiLevelLabel') > -1) &&
            ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            const isTitleOrLegendEnabled: boolean = (this.legendSettings.visible || this.primaryXAxis.title === '');
            showTooltip(
                this.findAxisLabel(targetId), x, y, this.element.offsetWidth, this.element.id + '_EJ2_AxisLabel_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch, isTitleOrLegendEnabled
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
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnMouseDown(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        const offset: number = Browser.isDevice ? 20 : 30;
        const rect: ClientRect = this.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
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
        const svgRect: ClientRect = getElement(this.svgId).getBoundingClientRect();
        this.mouseDownX = this.previousMouseMoveX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        this.mouseDownY = this.previousMouseMoveY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);

        if (this.isTouch) {
            this.isDoubleTap = (new Date().getTime() < this.threshold && target.id.indexOf(this.element.id + '_Zooming_') === -1 &&
                (this.mouseDownX - offset >= this.mouseX || this.mouseDownX + offset >= this.mouseX) &&
                (this.mouseDownY - offset >= this.mouseY || this.mouseDownY + offset >= this.mouseY) &&
                (this.mouseX - offset >= this.mouseDownX || this.mouseX + offset >= this.mouseDownX) &&
                (this.mouseY - offset >= this.mouseDownY || this.mouseY + offset >= this.mouseDownY));
        }
        if (this.dataEditingModule) {
            this.dataEditingModule.pointMouseDown();
        }
        this.notify(Browser.touchStartEvent, e);
        return false;
    }
    /**
     * Handles the mouse up.
     *
     * @returns {boolean} false
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
     *
     * @returns {boolean}
     * @private
     */

    public chartOnMouseUp(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger(chartMouseUp, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.axisTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.threshold = new Date().getTime() + 300;
        }
        if (this.dataEditingModule) {
            this.dataEditingModule.pointMouseUp();
        }
        if (!this.enableCanvas && this.seriesElements) {
            this.seriesElements.removeAttribute('clip-path');
        }
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
        const parentNode: Element = getElement(this.element.id + '_Annotation_Collections');
        const annotation: ChartAnnotationSettings = <ChartAnnotationSettings>this.annotations[annotationIndex];
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
            ZoomIn: 'Zoom in',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom out',
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
     *
     * @returns {ModuleDeclaration[]}
     * @private
     */
    /* eslint-disable  */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let series: SeriesModel[] = this.series;
        let enableAnnotation: boolean = false;
        let moduleName: string; let errorBarVisible: boolean = false;
        let isPointDrag: boolean = false;
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
            isPointDrag = value.dragSettings.enable || isPointDrag;
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
        if (this.enableExport || this.allowExport) {
            modules.push({
                member: 'Export',
                args: [this]
            });
        }
        if (this.chartAreaType !== 'PolarRadar' && !this.scrollSettingEnabled && (zooming.enableSelectionZooming
            || zooming.enableMouseWheelZooming || zooming.enablePinchZooming || zooming.enablePan || zooming.enableScrollbar)) {
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
        if (this.highlightMode !== 'None') {
            modules.push({
                member: 'Highlight',
                args: [this]
            });
        }
        if (dataLabelEnable) {
            modules.push({
                member: 'DataLabel',
                args: [this, series]
            });
        }
        if (isPointDrag) {
            modules.push({
                member: 'DataEditing',
                args: [this]
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
            this.scrollSettingEnabled = axis.scrollbarSettings.enable ? true : this.scrollSettingEnabled;
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
        if (this.scrollSettingEnabled) {
            modules.push({
                member: 'ScrollBar',
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
            if (bandEnable) {
                modules.push({
                    member: 'SplineRangeAreaSeries',
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
        blazorTemplatesReset(this);
        if (this.enableCanvas && this.svgObject && (this.svgObject as HTMLElement).tagName === 'CANVAS' ) {
            (this.renderer as CanvasRenderer).clearRect(new Rect(0, 0, this.availableSize.width, this.availableSize.height));
            if (this.svgObject.parentNode) { remove(this.svgObject); }
            return null;
        }
        removeElement(this.element.id + '_Secondary_Element');
        if ((this as any).isReact) { this.clearTemplate(); }
        let removeLength: number = 0;
        if (this.zoomModule && this.zoomModule.pinchTarget) {
            this.zoomModule.pinchTarget.id = '';
            this.zoomModule.pinchTarget.setAttribute('opacity', '0');
            this.svgObject.appendChild(this.zoomModule.pinchTarget);
            removeLength = 1;
        }
        // Fix for blazor resize issue
        if (!isNullOrUndefined(this.resizeTo)) {
            if (this.resizeTo !== this.checkResize && this.isBlazor && this.element.childElementCount) {
                let containerCollection: NodeListOf<Element> = document.querySelectorAll('.e-chart');
                for (let index: number = 0; index < containerCollection.length; index++) {
                    let container: Element = containerCollection[index];
                    while (container.firstChild) {
                        remove(container.firstChild);
                    }
                }
            }
            this.checkResize = this.resizeTo;
        }

        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode && !(this.stockChart)) {
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
     *
     * @returns {boolean}
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
        if (this.paretoSeriesModule && this.series[0].type === 'Pareto') {
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
     * Get visible series by index
     */
    private getVisibleSeries(visibleSeries: Series[], index: number): Series {
        for (let series of visibleSeries) {
            if (index === series.index) {
                return series;
            }
        }
        return null;
    }

    /**
     * Fix for live data update flicker issue
     */
    public refreshLiveData(): void {
        this.calculateVisibleSeries();
        this.initTechnicalIndicators();
        this.initTrendLines();
        this.refreshDefinition(<Column[]>this.columns);
        this.refreshDefinition(<Row[]>this.rows);
        this.calculateVisibleAxis();
        this.processData(false);
        if (!this.isBlazor) {
            this.enableCanvas ? this.createChartSvg() : this.removeSvg();
            this.refreshAxis();
            this.refreshBound();
            this.trigger('loaded', { chart: this.isBlazor ? {} : this });
        }
    }

    /**
     * To remove style element
     */
    private removeStyles(): void {
        removeElement(this.element.id + '_ej2_chart_selection');
        removeElement(this.element.id + '_ej2_chart_highlight');
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: ChartModel, oldProp: ChartModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        this.animateSeries = false;
        let axis: Axis;
        if (!this.delayRedraw) {
            for (let prop of Object.keys(newProp)) {
                switch (prop) {
                    case 'primaryXAxis':
                        axis = <Axis>newProp.primaryXAxis;
                        refreshBounds = this.axisChange(axis);
                        if (newProp.primaryXAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        if (!newProp.primaryXAxis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        if(!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                           (this.primaryXAxis as Axis).setIsInversedAndOpposedPosition();
                        }
                        break;
                    case 'primaryYAxis':
                        axis = <Axis>newProp.primaryYAxis;
                        refreshBounds = this.axisChange(axis);
                        if (newProp.primaryYAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        if (!newProp.primaryYAxis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        if(!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                            (this.primaryYAxis as Axis).setIsInversedAndOpposedPosition();
                         }
                        break;
                    case 'axes':
                        for (let index of Object.keys(newProp.axes)) {
                            axis = newProp.axes[index] as Axis;
                            refreshBounds = refreshBounds || this.axisChange(axis);
                            if (!axis.crosshairTooltip) {
                                refreshBounds = true;
                            }
                            if(!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                                (this.axes[index] as Axis).setIsInversedAndOpposedPosition()
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
                    case 'enableCanvas':
                        this.refresh();
                        break;
                    case 'series':
                        let len: number = this.series.length;
                        let seriesRefresh: boolean = false;
                        let series: SeriesModel;
                        let blazorProp: boolean;
                        for (let i: number = 0; i < len; i++) {
                            series = newProp.series[i];
                            // I264774 blazor series visible property binding not working issue fixed.
                            if (this.isBlazor && series && ((series.visible !== oldProp.series[i].visible) || series.isClosed ||
                            series.marker || series.emptyPointSettings || series.type || series.boxPlotMode || series.showMean)) {
                                    blazorProp = true;
                            }
                            if (series && (series.dataSource || series.query || series.errorBar || series.xName ||
                                series.yName || series.size || series.high || series.low || series.open || series.close ||
                                series.fill || series.name || series.marker || blazorProp)) {
                                extend(this.getVisibleSeries(this.visibleSeries, i), series, null, true);
                                seriesRefresh = true;
                            }
                        }
                        if (seriesRefresh) {
                            this.calculateVisibleSeries();
                            this.initTechnicalIndicators();
                            this.initTrendLines();
                            this.refreshDefinition(<Column[]>this.columns);
                            this.refreshDefinition(<Row[]>this.rows);
                            this.calculateVisibleAxis();
                            this.processData(false);
                            refreshBounds = true;
                        }
                        break;
                    case 'indicators':
                        refreshBounds = true;
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
                        if (this.selectionModule) {
                            this.selectionModule.currentMode = this.selectionMode;
                            this.selectionModule.selectedDataIndexes = this.selectedDataIndexes as Indexes[];
                            this.selectionModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode, true);
                        }
                        break;
                    case 'selectionMode':
                        if (this.selectionModule && newProp.selectionMode && newProp.selectionMode.indexOf('Drag') === -1) {
                            this.selectionModule.currentMode = this.selectionMode;
                            this.selectionModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode, true);
                        }
                        break;
                    case 'isMultiSelect':
                        if (this.selectionModule && !newProp.isMultiSelect && this.selectionModule.selectedDataIndexes.length > 1) {
                            this.selectionModule.currentMode = this.selectionMode;
                            this.selectionModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                        break;
                    case 'highlightMode':
                    case 'selectionPattern':
                    case 'highlightPattern':
                        this.removeStyles();
                        renderer = true;
                        break;
                    case 'theme':
                        this.animateSeries = true; break;
                    case 'locale':
                    case 'currencyCode':
                        if (this.isBlazor) {
                            this.setCulture();
                            renderer = true;
                        } else {
                           this.refresh();
                        }
                        break;
                    case 'tooltip':
                        if (this.tooltipModule) { // To check the tooltip enable is true.
                            this.tooltipModule.previousPoints = [];
                            if (this.tooltip.template) {
                                this.tooltipModule.template = this.tooltip.template;
                            }
                        }
                        break;
                }
            }
            if (!refreshBounds && renderer) {
		this.rotatedDataLabelCollections = [];
                this.removeSvg();
                this.renderElements();
                this.trigger('loaded', { chart: this.isBlazor ? {} : this });
            }
            if (refreshBounds) {
                this.enableCanvas ? this.createChartSvg() : this.removeSvg();
                if ((this as any).isReact) { this.clearTemplate(); }
                this.refreshAxis();
                this.refreshBound();
                this.trigger('loaded', { chart: this.isBlazor ? {} : this });
                this.redraw = false;
                this.animated = false;
            }
        }
    }
}
