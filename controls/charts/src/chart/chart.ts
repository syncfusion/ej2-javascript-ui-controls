import { Component, Property, NotifyPropertyChanges, Internationalization, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ModuleDeclaration, L10n, setValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TapEventArgs, EmitType, ChildProperty } from '@syncfusion/ej2-base';
import { remove, extend } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Browser, Touch } from '@syncfusion/ej2-base';
import { Event, EventHandler, Complex, Collection } from '@syncfusion/ej2-base';
import { findClipRect, showTooltip, ImageOption, removeElement, appendChildElement, withInBounds, getValueXByPoint, getValueYByPoint } from '../common/utils/helper';
import { textElement, RectOption, createSvg, firstToLowerCase, titlePositionX, PointData, redrawElement, getTextAnchor } from '../common/utils/helper';
import { appendClipElement, ChartLocation } from '../common/utils/helper';
import { ChartModel, CrosshairSettingsModel, ZoomSettingsModel, RangeColorSettingModel } from './chart-model';
import { MarginModel, BorderModel, TooltipSettingsModel, IndexesModel, titleSettingsModel, ChartAreaModel, AccessibilityModel } from '../common/model/base-model';
import { getSeriesColor, getThemeColor } from '../common/model/theme';
import { Margin, Border, TooltipSettings, Indexes, ChartArea, titleSettings, Accessibility } from '../common/model/base';
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
import { LineType, ZoomMode, ToolbarItems } from './utils/enum';
import { SelectionMode, HighlightMode, ChartTheme } from '../common/utils/enum';
import { Points, Series, SeriesBase } from './series/chart-series';
import { LastValueLabelSettingsModel, SeriesModel } from './series/chart-series-model';
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
import { RangeStepAreaSeries } from './series/range-step-area-series';
import { SplineRangeAreaSeries } from './series/spline-range-area-series';
import { Tooltip } from './user-interaction/tooltip';
import { Crosshair } from './user-interaction/crosshair';
import { DataEditing } from './user-interaction/data-editing';
import { Marker, markerShapes } from './series/marker';
import { LegendSettings } from '../common/legend/legend';
import { LegendSettingsModel } from '../common/legend/legend-model';
import { Legend } from './legend/legend';
import { Zoom } from './user-interaction/zooming';
import { Selection } from './user-interaction/selection';
import { DataLabel } from './series/data-label';
import { LastValueLabel } from './series/last-value-label';
import { StripLine } from './axis/strip-line';
import { MultiLevelLabel } from './axis/multi-level-labels';
import { BoxAndWhiskerSeries } from './series/box-and-whisker-series';
import { PolarRadarPanel } from './axis/polar-radar-panel';
import { StripLineSettingsModel, ToolbarPositionModel, StackLabelSettingsModel } from './model/chart-base-model';
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
import { IDragCompleteEventArgs, ITooltipRenderEventArgs } from '../chart/model/chart-interface';
import { IZoomCompleteEventArgs, ILoadedEventArgs, IZoomingEventArgs, IAxisLabelClickEventArgs } from '../chart/model/chart-interface';
import { IMultiLevelLabelClickEventArgs, ILegendClickEventArgs, ISharedTooltipRenderEventArgs } from '../chart/model/chart-interface';
import { IAnimationCompleteEventArgs, IMouseEventArgs, IPointEventArgs, IBeforeResizeEventArgs } from '../chart/model/chart-interface';
import { chartMouseClick, chartDoubleClick, pointClick, pointDoubleClick, axisLabelClick, beforeResize } from '../common/model/constants';
import { chartMouseDown, chartMouseMove, chartMouseUp, load, pointMove, chartMouseLeave, resized } from '../common/model/constants';
import { IPrintEventArgs, IAxisRangeCalculatedEventArgs, IDataEditingEventArgs } from '../chart/model/chart-interface';
import { ChartAnnotationSettingsModel } from './model/chart-base-model';
import { ChartAnnotationSettings, StackLabelSettings, ToolbarPosition } from './model/chart-base';
import { ChartAnnotation } from './annotation/annotation';
import { getElement, getTitle } from '../common/utils/helper';
import { Alignment, ExportType, SelectionPattern } from '../common/utils/enum';
import { MultiColoredLineSeries } from './series/multi-colored-line-series';
import { MultiColoredAreaSeries } from './series/multi-colored-area-series';
import { ScrollBar } from '../common/scrollbar/scrollbar';
import { DataManager } from '@syncfusion/ej2-data';
import { StockChart } from '../stock-chart/stock-chart';
import { Export } from './print-export/export';
import { PrintUtils } from '../common/utils/print';
import { IAfterExportEventArgs, IExportEventArgs } from '../common/model/interface';
import { createTemplate } from '../common/utils/helper';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Configures the range color settings in the chart.
 */
export class RangeColorSetting extends ChildProperty<RangeColorSetting> {
    /**
     * Specifies the start value of the color mapping range.
     */
    @Property()
    public start: number;
    /**
     * Specifies the end value of the color mapping range.
     */
    @Property()
    public end: number;
    /**
     * Specifies the fill colors for points that lie within the given range. If multiple colors are specified, a gradient will be applied.
     */
    @Property([])
    public colors: string[];
    /**
     * Specifies the name or label for the range mapping item.
     */
    @Property('')
    public label: string;

}

/**
 * Options to configure the crosshair on the chart, which displays lines that follow the mouse cursor and show the axis values of the data points.
 */
export class CrosshairSettings extends ChildProperty<CrosshairSettings> {
    /**
     * If set to true, the crosshair line becomes visible.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Specifies the pattern of dashes and gaps used to stroke the crosshair line.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * The `line` property allows defining the appearance of the crosshair line, including its color and width.
     */
    @Complex<BorderModel>({ color: null, width: 1 }, Border)
    public line: BorderModel;

    /**
     * Specifies the line type for the crosshair.
     * The available modes are:
     * * None: Both vertical and horizontal crosshair lines are hidden.
     * * Both: Displays both the vertical and horizontal crosshair lines.
     * * Vertical: Shows only the vertical crosshair line.
     * * Horizontal: Shows only the horizontal crosshair line.
     *
     * @default Both
     */
    @Property('Both')
    public lineType: LineType;

    /**
     * The color of the vertical crosshair line accepts values in hex and rgba as valid CSS color strings.
     *
     * @default ''
     */
    @Property('')
    public verticalLineColor: string;

    /**
     * The color of the horizontal crosshair line accepts values in hex and rgba as valid CSS color strings.
     *
     * @default ''
     */
    @Property('')
    public horizontalLineColor: string;

    /**
     * Specifies the opacity level for the crosshair, which controls its transparency.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * If set to `true`, the horizontal crosshair snaps to the nearest data point.
     *
     * @default false
     */
    @Property(false)
    public snapToData: boolean;

    /**
     * If set to true, highlights the entire category range when hovered over.
     * This property applies only to category axes.
     *
     * @default false
     */
    @Property(false)
    public highlightCategory: boolean;
}
/**
 * Configures the zooming behavior for the chart.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {

    /**
     * If set to true, the chart can be zoomed in by selecting a rectangular region on the plot area.
     *
     * @default false
     */

    @Property(false)
    public enableSelectionZooming: boolean;

    /**
     * If set to true, the chart can be pinched to zoom in and out.
     *
     * @default false
     */

    @Property(false)
    public enablePinchZooming: boolean;

    /**
     * If set to true, the chart is rendered with a toolbar on initial load.
     *
     * @default false
     */

    @Property(false)
    public showToolbar: boolean;

    /**
     * If set to true, the chart can be zoomed using the mouse wheel.
     *
     * @default false
     */

    @Property(false)
    public enableMouseWheelZooming: boolean;

    /**
     * If set to true, zooming will be performed on mouse up.
     > Note that `enableDeferredZooming` requires `enableSelectionZooming` to be true.
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
     * Specifies whether to allow zooming vertically, horizontally, or in both ways.
     * Available options are:
     * * XY: Chart can be zoomed both vertically and horizontally.
     * * X: Chart can be zoomed horizontally.
     * * Y: Chart can be zoomed vertically.
     > Note that `enableSelectionZooming` must be set to true for this feature to work.
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
     * Specifies the toolkit options for zooming as follows:
     * * Zoom - Enables the zooming tool to select and zoom into a specific region of the chart.
     * * ZoomIn - Provides a button to zoom in on the chart.
     * * ZoomOut - Provides a button to zoom out from the chart.
     * * Pan - Allows panning across the chart to explore different regions.
     * * Reset - Resets the zoom level to the default view of the chart.
     *
     * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
     */

    @Property(['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'])
    public toolbarItems: ToolbarItems[];

    /**
     * If set to true, the chart can be panned without requiring toolbar items. If set to false, panning is disabled, and the toolbar options must be used to pan the chart.
     *
     * @default false.
     */

    @Property(false)
    public enablePan: boolean;

    /**
     * Specifies whether the axis should have a scrollbar.
     *
     * @default false.
     */

    @Property(false)
    public enableScrollbar: boolean;

    /**
     * If set to true, the chart will animate when zooming.
     *
     * @default false.
     */

    @Property(false)
    public enableAnimation: boolean;

    /**
     * Allows customization of the zoom toolbar position. Users can set the horizontal and vertical alignment of the toolbar, as well as specify offsets for precise placement.
     */
    @Complex<ToolbarPositionModel>({}, ToolbarPosition)
    public toolbarPosition: ToolbarPositionModel;

    /**
     * Options to improve accessibility for zoom toolkit elements.
     */
    @Complex<AccessibilityModel>({}, Accessibility)
    public accessibility: AccessibilityModel;

}

/**
 * Represents the chart control.
 * ```html
 * <div id="chart"/>
 * <script>
 *   var chartObj = new Chart({});
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
     * `paretoSeriesModule` is used to add pareto series to the chart.
     */
    public paretoSeriesModule: ParetoSeries;
    /**
     * `areaSeriesModule` is used to add area series to the chart.
     */
    public areaSeriesModule: AreaSeries;
    /**
     * `barSeriesModule` is used to add bar series to the chart.
     */
    public barSeriesModule: BarSeries;
    /**
     * `stackingColumnSeriesModule` is used to add stacking column series to the chart.
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
     * 'candleSeriesModule' is used to add candle series to the chart.
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
     * `polarSeriesModule` is used to add polar series to the chart.
     */
    public polarSeriesModule: PolarSeries;
    /**
     * `radarSeriesModule` is used to add radar series to the chart.
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
     * `boxAndWhiskerSeriesModule` is used to add box and whisker series to the chart.
     */
    public boxAndWhiskerSeriesModule: BoxAndWhiskerSeries;
    /**
     * `rangeColumnSeriesModule` is used to add range column series to the chart.
     */
    public rangeColumnSeriesModule: RangeColumnSeries;
    /**
     * `histogramSeriesModule` is used to add histogram series to the chart.
     */
    public histogramSeriesModule: HistogramSeries;
    /**
     * `hiloSeriesModule` is used to add hilo series to the chart.
     */
    public hiloSeriesModule: HiloSeries;
    /**
     * `hiloOpenCloseSeriesModule` is used to add hilo open close series to the chart.
     */
    public hiloOpenCloseSeriesModule: HiloOpenCloseSeries;
    /**
     * `waterfallSeries` is used to add waterfall series to the chart.
     */
    public waterfallSeriesModule: WaterfallSeries;
    /**
     * `bubbleSeries` is used to add bubble series to the chart.
     */
    public bubbleSeriesModule: BubbleSeries;
    /**
     * `rangeAreaSeriesModule` is used to add range area series to the chart.
     */
    public rangeAreaSeriesModule: RangeAreaSeries;
    /**
     * `rangeStepAreaSeriesModule` is used to add range step area series to the chart.
     */
    public rangeStepAreaSeriesModule: RangeStepAreaSeries;
    /**
     * `splineRangeAreaSeriesModule` is used to add spline range area series to the chart.
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
     * 'lastValueLabelModule' is used to manipulate and add last value indicator to the series.
     */
    public lastValueLabelModule: LastValueLabel;
    /**
     * `errorBarModule` is used to manipulate and add errorBar for series.
     */
    public errorBarModule: ErrorBar;
    /**
     * `dataLabelModule` is used to manipulate and add data label to the series.
     */
    public dataLabelModule: DataLabel;
    /**
     * `dateTimeModule` is used to manipulate and add date time axis to the chart.
     */
    public dateTimeModule: DateTime;
    /**
     * `categoryModule` is used to manipulate and add category axis to the chart.
     */
    public categoryModule: Category;
    /**
     * `dateTimeCategoryModule` is used to manipulate date time and category axis to the chart.
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
     * `annotationModule` is used to manipulate and add annotation to the chart.
     */
    public annotationModule: ChartAnnotation;
    /**
     * `stripLineModule` is used to manipulate and add strip line to the chart.
     */
    public stripLineModule: StripLine;
    /**
     * `multiLevelLabelModule` is used to manipulate and add multi-level labels to the chart.
     */
    public multiLevelLabelModule: MultiLevelLabel;

    /**
     * 'trendlineModule' is used to predict the market trend using trendlines.
     */
    public trendLineModule: Trendlines;

    /**
     * `sMAIndicatorModule` is used to predict the market trend using SMA approach.
     */
    public sMAIndicatorModule: SmaIndicator;

    /**
     * `eMAIndicatorModule` is used to predict the market trend using EMA approach.
     */
    public eMAIndicatorModule: EmaIndicator;

    /**
     * `tMAIndicatorModule` is used to predict the market trend using TMA approach.
     */
    public tMAIndicatorModule: TmaIndicator;

    /**
     * `accumulationDistributionIndicatorModule` is used to predict the market trend using Accumulation Distribution approach.
     */
    public accumulationDistributionIndicatorModule: AccumulationDistributionIndicator;

    /**
     * `atrIndicatorModule` is used to predict the market trend using ATR approach.
     */
    public atrIndicatorModule: AtrIndicator;

    /**
     * `rSIIndicatorModule` is used to predict the market trend using RSI approach.
     */
    public rsiIndicatorModule: RsiIndicator;

    /**
     * `macdIndicatorModule` is used to predict the market trend using Macd approach.
     */
    public macdIndicatorModule: MacdIndicator;

    /**
     * `stochasticIndicatorModule` is used to predict the market trend using Stochastic approach.
     */
    public stochasticIndicatorModule: StochasticIndicator;

    /**
     * `momentumIndicatorModule` is used to predict the market trend using Momentum approach.
     */
    public momentumIndicatorModule: MomentumIndicator;

    /**
     * `bollingerBandsModule` is used to predict the market trend using Bollinger approach.
     */
    public bollingerBandsModule: BollingerBands;
    /**
     * `scrollBarModule` is used to render a scrollbar in the chart while zooming.
     */
    public scrollBarModule: ScrollBar;
    /**
     * `exportModule` is used to export the chart in `JPEG`, `PNG`, `SVG`, `PDF`, `XLSX`, or `CSV` format.
     */
    public exportModule: Export;

    /**
     * Specifies the template to be displayed when the chart has no data.
     * This property enables the users to display customized messages, images, or other UI elements in place of an empty chart.
     * It provides a better user experience by offering context when no data points are available.
     *
     * @default null
     */
    @Property(null)
    public noDataTemplate: string | Function;

    /**
     * The width of the chart as a string, accepting input such as '100px' or '100%'.
     * If specified as '100%', the chart renders to the full width of its parent element.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string, accepting input such as '100px' or '100%'.
     * If specified as '100%', the chart renders to the full height of its parent element.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * The title is displayed at the top of the chart to provide information about the plotted data.
     *
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Specifies the data source for the chart. It can be an array of JSON objects, or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *    url: 'https://services.syncfusion.com/js/production/api/orders'
     * });
     * let query: Query = new Query().take(5);
     * let chart: Chart = new Chart({
     * ...
     * dataSource: dataManager,
     *   series: [{
     *        type: 'Column',
     *        xName: 'CustomerID',
     *        yName: 'Freight',
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
     * Options for customizing the appearance of the title, which displays information about the plotted data.
     * Use the `fontFamily`, `size`, `fontStyle`, `fontWeight`, and `color` properties in `titleSettings` to adjust the title's appearance.
     */

    @Complex<titleSettingsModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, titleSettings)
    public titleStyle: titleSettingsModel;

    /**
     * The subtitle is positioned below the main title and provides additional details about the data represented in the chart.
     *
     * @default ''
     */

    @Property('')
    public subTitle: string;

    /**
     * Options for customizing the appearance of the subtitle, which displays information about the plotted data below the main title.
     * Use the `fontFamily`, `size`, `fontStyle`, `fontWeight`, and `color` properties in `titleSettings` to adjust the subtitle's appearance.
     */

    // eslint-disable-next-line max-len
    @Complex<titleSettingsModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null, accessibility: {focusable: false}}, titleSettings)
    public subTitleStyle: titleSettingsModel;
    /**
     * Options to customize the margins around the chart, including the left, right, top, and bottom margins.
     * These margins refer to the space between the outer edge of the chart and its chart area.
     */

    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing the appearance of the border in the chart by using the `color` and `width` properties in the `border`.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * The background color of the chart accepts values in hex and rgba formats as valid CSS color strings.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Configuration options for the chart area's border and background.
     */

    @Complex<ChartAreaModel>({ border: { color: null, width: 0.5 }, background: 'transparent' }, ChartArea)
    public chartArea: ChartAreaModel;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the Chart component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * The `primaryXAxis` property configures the horizontal axis of the chart, including settings for axis labels, tick marks, grid lines, and axis ranges.
     */

    @Complex<AxisModel>({ name: 'primaryXAxis' }, Axis)
    public primaryXAxis: AxisModel;

    /**
     * The `primaryYAxis` property configures the vertical axis of the chart, including settings for axis labels, tick marks, grid lines, and axis ranges.
     */

    @Complex<AxisModel>({ name: 'primaryYAxis' }, Axis)
    public primaryYAxis: AxisModel;


    /**
     * Options to split the chart into multiple plotting areas horizontally.
     * Each object in the collection represents a separate plotting area (row) in the chart, allowing multiple data series to be displayed in distinct horizontal sections.
     */

    @Collection<RowModel>([{}], Row)
    public rows: RowModel[];


    /**
     * Options to split the chart into multiple plotting areas vertically.
     * Each object in the collection represents a separate plotting area (column) in the chart, allowing multiple data series to be displayed in distinct vertical sections.
     */

    @Collection<ColumnModel>([{}], Column)
    public columns: ColumnModel[];

    /**
     * Configuration options for the secondary axis in the chart.
     * Each object in the collection represents an additional axis, allowing for the plotting of multiple data series with different scales.
     */

    @Collection<AxisModel>([{}], Axis)
    public axes: AxisModel[];

    /**
     * Configuration options for the chart's series.
     * Each object in the `series` collection represents a distinct data series displayed in the chart. Customize various aspects of each series such as data, type, and appearance.
     */

    @Collection<SeriesModel>([{}], Series)
    public series: SeriesModel[];

    /**
     * Annotations are used to highlight specific data points or areas in the chart, providing additional context and information.
     */

    @Collection<ChartAnnotationSettingsModel>([{accessibility: {focusable: false}}], ChartAnnotationSettings)
    public annotations: ChartAnnotationSettingsModel[];

    /**
     * The `palettes` array defines a set of colors used for rendering the chart's series. Each color in the array is applied to the series in order.
     *
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * The theme applied to the chart for visual styling.
     * Choose from predefined themes to change the overall look and feel of the chart.
     * The available themes are:
     * * Fabric
     * * FabricDark
     * * Bootstrap4
     * * Bootstrap
     * * BootstrapDark
     * * HighContrastLight
     * * HighContrast
     * * Tailwind
     * * TailwindDark
     * * Bootstrap5
     * * Bootstrap5Dark
     * * Fluent
     * * FluentDark
     * * Fluent2
     * * Fluent2Dark
     * * Fluent2HighContrast
     * * Material3
     * * Material3Dark
     * * Material
     * * MaterialDark
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Configuration options for the chart's tooltip, which displays details about the points when hovering over them.
     */

    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltip: TooltipSettingsModel;


    /**
     * The crosshair displays lines on the chart that follow the mouse cursor and show the axis values of the data points.
     */
    @Complex<CrosshairSettingsModel>({}, CrosshairSettings)
    public crosshair: CrosshairSettingsModel;

    /**
     * The legend provides descriptive information about the data series displayed in the chart, helping to understand what each series represents.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * The `rangeColorSettings` property specifies a set of rules for applying different colors to points based on their value ranges.
     */
    @Collection<RangeColorSettingModel>([{}], RangeColorSetting)
    public rangeColorSettings: RangeColorSettingModel[];

    /**
     * Options to enable and configure the zooming feature in the chart.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;

    /**
     * Defines the color used to highlight a data point on mouse hover.
     *
     * @default ''
     */

    @Property('')
    public highlightColor: string;

    /**
     * The `selectionMode` property determines how data points or series can be highlighted or selected.
     * The available options are:
     * * 'None': Disables any form of highlight or selection.
     * * 'Series': Highlights or selects an entire series of data points.
     * * 'Point': Highlights or selects a single data point.
     * * 'Cluster': Highlights or selects a group of data points that belong to the same cluster.
     * * 'DragXY': Selects points by dragging with respect to both horizontal and vertical axes.
     * * 'DragX': Selects points by dragging with respect to horizontal axis.
     * * 'DragY': Selects points by dragging with respect to vertical axis.
     * * 'Lasso': Selects points by dragging with respect to free form.
     *
     * @default None
     */
    @Property('None')
    public selectionMode: SelectionMode;

    /**
     * The `highlightMode` property determines how a series or individual data points are highlighted in the chart.
     * The available options are:
     * * 'None': Disables highlighting.
     * * 'Series': Highlights an entire series of data points.
     * * 'Point': Highlights a single data point.
     * * 'Cluster': Highlights a group of data points that belong to the same cluster.
     *
     * @default None
     */
    @Property('None')
    public highlightMode: HighlightMode;

    /**
     * The `selectionPattern` property determines how the selected data points or series are visually represented.
     * The available options are:
     * * 'None': No selection pattern is applied.
     * * 'Chessboard': Applies a chessboard pattern as the selection effect.
     * * 'Dots': Applies a dot pattern as the selection effect.
     * * 'DiagonalForward': Applies a forward diagonal line pattern as the selection effect.
     * * 'Crosshatch': Applies a crosshatch pattern as the selection effect.
     * * 'Pacman': Applies a Pacman pattern as the selection effect.
     * * 'DiagonalBackward': Applies a backward diagonal line pattern as the selection effect.
     * * 'Grid': Applies a grid pattern as the selection effect.
     * * 'Turquoise': Applies a turquoise pattern as the selection effect.
     * * 'Star': Applies a star pattern as the selection effect.
     * * 'Triangle': Applies a triangle pattern as the selection effect.
     * * 'Circle': Applies a circle pattern as the selection effect.
     * * 'Tile': Applies a tile pattern as the selection effect.
     * * 'HorizontalDash': Applies a horizontal dash pattern as the selection effect.
     * * 'VerticalDash': Applies a vertical dash pattern as the selection effect.
     * * 'Rectangle': Applies a rectangle pattern as the selection effect.
     * * 'Box': Applies a box pattern as the selection effect.
     * * 'VerticalStripe': Applies a vertical stripe pattern as the selection effect.
     * * 'HorizontalStripe': Applies a horizontal stripe pattern as the selection effect.
     * * 'Bubble': Applies a bubble pattern as the selection effect.
     *
     * @default None
     */
    @Property('None')
    public selectionPattern: SelectionPattern;

    /**
     * The `highlightPattern` property determines how the data points or series are visually highlighted.
     * The available options are:
     * * 'None': No highlighting pattern.
     * * 'Chessboard': Applies a chessboard pattern for highlighting.
     * * 'Dots': Applies a dot pattern for highlighting.
     * * 'DiagonalForward': Applies a forward diagonal line pattern for highlighting.
     * * 'Crosshatch': Applies a crosshatch pattern for highlighting.
     * * 'Pacman': Applies a Pacman pattern for highlighting.
     * * 'DiagonalBackward': Applies a backward diagonal line pattern for highlighting.
     * * 'Grid': Applies a grid pattern for highlighting.
     * * 'Turquoise': Applies a turquoise pattern for highlighting.
     * * 'Star': Applies a star pattern for highlighting.
     * * 'Triangle': Applies a triangle pattern for highlighting.
     * * 'Circle': Applies a circle pattern for highlighting.
     * * 'Tile': Applies a tile pattern for highlighting.
     * * 'HorizontalDash': Applies a horizontal dash pattern for highlighting.
     * * 'VerticalDash': Applies a vertical dash pattern for highlighting.
     * * 'Rectangle': Applies a rectangle pattern for highlighting.
     * * 'Box': Applies a box pattern for highlighting.
     * * 'VerticalStripe': Applies a vertical stripe pattern for highlighting.
     * * 'HorizontalStripe': Applies a horizontal stripe pattern for highlighting.
     * * 'Bubble': Applies a bubble pattern for highlighting.
     *
     * @default None
     */
    @Property('None')
    public highlightPattern: SelectionPattern;

    /**
     * When set to true, it allows selecting multiple data points, series, or clusters.
     > Note that the `selectionMode` must be set to `Point`, `Series`, or `Cluster` for multi-selection to be enabled.
     *
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * If set to true, enables multi-drag selection in the chart.
     * This feature allows selecting multiple data points by dragging a selection box.
     > Note that the `selectionMode` to be set to `DragX`, `DragY`, or `DragXY` for this feature to work.
     *
     * @default false
     */
    @Property(false)
    public allowMultiSelection: boolean;

    /**
     * When set to true, it enables exporting the chart to various formats such as `JPEG`, `PNG`, `SVG`, `PDF`, `XLSX`, or `CSV`.
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
     * Specifies the point indexes to be selected when a chart is initially loaded.
     > Note that `selectionMode` or `highlightMode` must be set to `Point`, `Series`, or `Cluster` for this feature to work.
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
     * When set to true, a grouping separator will be used for numbers to separate groups of thousands in the chart.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * If set to true, the intervals for all the axes will be calculated automatically based on the zoomed range.
     *
     * @default false
     */
    @Property(false)
    public enableAutoIntervalOnBothAxis: boolean;

    /**
     * When set to true, the chart will render in a transposed manner, where the X and Y axes are interchanged.
     *
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * When set to true, the chart will render using a canvas.
     *
     * @default false
     */
    @Property(false)
    public enableCanvas: boolean;

    /**
     * The background image of the chart accepts a string value as a URL link or the location of an image.
     *
     * @default null
     */
    @Property(null)
    public backgroundImage: string;

    /**
     * Technical indicators assist in evaluating market conditions and identifying trends for making trading decisions.
     */
    @Collection<TechnicalIndicatorModel>([], TechnicalIndicator)
    public indicators: TechnicalIndicatorModel[];

    /**
     * If set to true, animation effects will be enabled for chart elements such as axis labels, gridlines, series, markers, and data labels when the legend is clicked, or the data source is updated.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * A description for the chart that provides additional information about its content for screen readers.
     *
     * @default null
     * @deprecated
     */
    @Property(null)
    public description: string;

    /**
     * The `tabIndex` value determines the order in which the chart container receives focus during keyboard navigation.
     *
     * @default 1
     * @deprecated
     */
    @Property(1)
    public tabIndex: number;

    /**
     * This property controls whether columns for different series appear next to each other in a column chart.
     *
     * @default true
     */
    @Property(true)
    public enableSideBySidePlacement: boolean;

    /**
     * Options to improve accessibility for chart elements.
     */
    @Complex<AccessibilityModel>({}, Accessibility)
    public accessibility: AccessibilityModel;

    /**
     * Customize the focus border color.
     * If not specified, the element will use the default focus border color.
     *
     * @default null
     */
    @Property(null)
    public focusBorderColor: string;

    /**
     * Customize the focus border width.
     * If not specified, the element will use the default focus border width.
     *
     * @default 1.5
     */
    @Property(1.5)
    public focusBorderWidth: number;

    /**
     * Customize the focus border margin.
     * If not specified, the element will use the default focus border margin.
     *
     * @default 0
     */
    @Property(0)
    public focusBorderMargin: number;

    /**
     * Configuration options for stack labels in the chart.
     * Stack labels display the total value for stacked series, including customization options for appearance and positioning, and other visual elements to enhance chart readability.
     * This property allows users to modify how stack labels are rendered in a stacked chart.
     */
    @Complex<StackLabelSettingsModel>({}, StackLabelSettings)
    public stackLabels: StackLabelSettingsModel;

    /**
     * Triggers after the chart is resized.
     *
     * @event resized
     * @blazorProperty 'Resized'
     */
    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the chart is resized. This event allows for modifications to the chart size before resizing occurs.
     *
     * @event beforeResize
     * @blazorProperty 'BeforeResize'
     */
    @Event()
    public beforeResize: EmitType<IBeforeResizeEventArgs>;

    /**
     * Triggers before the annotation gets rendered. This event allows for modifications of the annotation content and its location before it is rendered on the chart.
     *
     * @event annotationRender
     * @deprecated
     */

    @Event()
    public annotationRender: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the printing process starts. This event allows for the modification of the chart's HTML content before it is sent to the printer.
     *
     * @event beforePrint
     * @blazorProperty 'OnPrint'
     */

    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /**
     * Triggers after the chart has fully loaded.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the export process begins. This event allows for the customization of export settings before the chart is exported.
     *
     * @event beforeExport
     */
    @Event()
    public beforeExport: EmitType<IExportEventArgs>;

    /**
     * Triggers after the export is completed.
     *
     * @event afterExport
     * @blazorProperty 'AfterExport'
     */
    @Event()
    public afterExport: EmitType<IAfterExportEventArgs>;

    /**
     * Triggers before the chart loads. This event allows for customization and configuration before the chart is rendered.
     *
     * @event load
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after the animation for the series is completed.
     *
     * @event animationComplete
     * @blazorProperty 'OnAnimationComplete'
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before the legend is rendered. This allows the customization of legend before rendering on the chart.
     *
     * @event legendRender
     * @deprecated
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for the series is rendered. This allows customization of data labels before they are rendered on the chart.
     *
     * @event textRender
     * @deprecated
     */

    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers before each point in the series is rendered. This allows for the customization of each data point before it is rendered on the chart.
     *
     * @event pointRender
     * @deprecated
     */

    @Event()
    public pointRender: EmitType<IPointRenderEventArgs>;

    /**
     * Triggers before the series is rendered. This event allows for the customization of series properties before they are rendered on the chart.
     *
     * @event seriesRender
     * @deprecated
     */

    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;
    /**
     * Triggers before each axis label is rendered. This event allows for the customization of axis label and its font style before rendering on the chart.
     *
     * @event axisLabelRender
     * @deprecated
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;
    /**
     * Triggers when the x-axis label is clicked.
     *
     * @event axisLabelClick
     * @deprecated
     */
    @Event()
    public axisLabelClick: EmitType<IAxisLabelClickEventArgs>;
    /**
     * Triggers before each axis range is rendered. This event allows modification of the axis range and interval that are calculated based on data.
     *
     * @event axisRangeCalculated
     * @deprecated
     */
    @Event()
    public axisRangeCalculated: EmitType<IAxisRangeCalculatedEventArgs>;
    /**
     * Triggers before each axis multi-label is rendered. This event allows modification of multi-labels on the axis before they are rendered.
     *
     * @event axisMultiLabelRender
     * @deprecated
     */
    @Event()
    public axisMultiLabelRender: EmitType<IAxisMultiLabelRenderEventArgs>;
    /**
     * Triggers after clicking on a legend item.
     *
     * @event legendClick
     */
    @Event()
    public legendClick: EmitType<ILegendClickEventArgs>;

    /**
     * Triggers after clicking on a multi-level label.
     *
     * @event multiLevelLabelClick
     */
    @Event()
    public multiLevelLabelClick: EmitType<IMultiLevelLabelClickEventArgs>;
    /**
     * Triggers before the tooltip for the series is rendered. This event allows customization of the tooltip properties such as text, style, and template before it is rendered on the chart.
     *
     * @event tooltipRender
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before the shared tooltip for the series is rendered. This event allows customization of the shared tooltip properties such as text, style, and template before it is rendered on the chart.
     *
     * @event sharedTooltipRender
     */

    @Event()
    public sharedTooltipRender: EmitType<ISharedTooltipRenderEventArgs>;

    /**
     * Triggers on hovering over the chart.
     *
     * @event chartMouseMove
     * @blazorProperty 'OnChartMouseMove'
     */

    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers when clicking on the chart.
     *
     * @event chartMouseClick
     * @blazorProperty 'OnChartMouseClick'
     */

    @Event()
    public chartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers when double-clicking the chart.
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
     * Triggers on point double-click.
     *
     * @event pointDoubleClick
     * @blazorProperty 'OnPointDoubleClick'
     */

    @Event()
    public pointDoubleClick: EmitType<IPointEventArgs>;

    /**
     * Triggers when a data point is hovered.
     *
     * @event pointMove
     * @blazorProperty 'PointMoved'
     */

    @Event()
    public pointMove: EmitType<IPointEventArgs>;


    /**
     * Triggers when the cursor leaves the chart.
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
     * Triggers when the zoom selection started.
     *
     * @event onZooming
     */
    @Event()
    public onZooming: EmitType<IZoomingEventArgs>;


    /**
     * Triggers when the scroll action starts.
     *
     * @event scrollStart
     * @blazorProperty 'OnScrollStart'
     */
    @Event()
    public scrollStart: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the scroll action ends.
     *
     * @event scrollEnd
     * @blazorProperty 'OnScrollEnd'
     */
    @Event()
    public scrollEnd: EmitType<IScrollEventArgs>;

    /**
     * Triggers when the scroll position changes.
     *
     * @event scrollChanged
     * @blazorProperty 'ScrollChanged'
     */
    @Event()
    public scrollChanged: EmitType<IScrollEventArgs>;

    /**
     * Triggers when the drag operation for a point starts.
     *
     * @event dragStart
     */
    @Event()
    public dragStart: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point is being dragged.
     *
     * @event drag
     */
    @Event()
    public drag: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point drag operation ends.
     *
     * @event dragEnd
     */
    @Event()
    public dragEnd: EmitType<IDataEditingEventArgs>;

    /**
     * Specifies the currency code format to use for displaying values in the chart.
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
    public lastValueLabelCollections: Rect[];
    /** @private */
    public rotatedDataLabelCollections: ChartLocation[][] = [];
    /** @private */
    public dataLabelElements: Element;
    /** @private */
    public lastValueLabelElements: Element;
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
    public scaleX: number;
    /** @private */
    public scaleY: number;
    public isCrosshair: boolean = true;
    /**
     * `markerModule` is used to manipulate and add marker to the series.
     *
     * @private
     */
    public markerRender: Marker;
    public markerIndex: number;
    /** @private */
    public titleCollection: string[];
    /** @private */
    public subTitleCollection: string[];
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
    public isRedrawSelection: boolean;
    /**
     * Touch object to unwire the touch event from element
     */
    private touchObject: Touch;
    /** @private */
    public resizeBound: any;
    /** @private */
    public longPressBound: any;

    /** @private */
    public isLegendClicked: boolean = false;
    public isZoomed: boolean = false;
    private previousTargetId: string = '';
    private currentPointIndex: number = 0;
    private currentSeriesIndex: number = 0;
    private currentLegendIndex: number = 0;
    private previousPageX: number = null;
    private previousPageY: number = null;
    private allowPan: boolean = false;
    /** @private */
    public pointsRemoved: boolean = false;
    /** @private */
    public pointsAdded: boolean = false;
    /** @private */
    public zoomRedraw: boolean = false;

    /**
     * Constructor for the chart component.
     *
     * @param {ChartModel} [options] - The chart model options.
     * @param {string | HTMLElement} [element] - The element ID or instance where the chart needs to be rendered.
     * @private
     */
    constructor(options?: ChartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        setValue('mergePersistData', this.mergePersistChartData, this);
    }
    /**
     * To manage persist chart data.
     *
     * @returns {void}
     */
    private mergePersistChartData(): void {
        const data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            const dataObj: Chart = JSON.parse(data);
            const keys: string[] = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (const key of keys) {
                if ((typeof this[key as string] === 'object') && !isNullOrUndefined(this[key as string])) {
                    extend(this[key as string], dataObj[key as string]);
                } else {
                    this[key as string] = dataObj[key as string];
                }
            }
            this.isProtectedOnChange = false;
        }
    }

    /**
     * Checks if the element ID contains special characters.
     *
     * @param {string} elementId - The ID of the element.
     * @returns {string} - The modified ID without special characters.
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
                if (!regex.test(elementId[i as number]) && elementId.indexOf('-') === -1 &&
                    elementId.indexOf('_') === -1 && elementId.indexOf('\\') === -1 && !numberRegex.test(elementId[i as number])) {
                    childElementId += ('\\' + elementId[i as number]);
                } else {
                    childElementId += elementId[i as number];
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
        this.allowServerDataBinding = false;
        this.markerIndex = 0;
        this.unWireEvents();
        this.initPrivateVariable();
        this.setCulture();
        this.wireEvents();

        if (this.stockChart) {
            if (this.stockChart.tooltip.header === null) {
                this.tooltip.header = this.stockChart.theme.indexOf('Tailwind3') > -1 ? '${point.x}' : '<b>${point.x}</b>';
            }
            if (this.stockChart.tooltip.format === null) {
                this.tooltip.format = this.stockChart.theme.indexOf('Tailwind3') > -1 ? 'High : ${point.high}<br/>Low :' +
                    ' ${point.low}<br/>Open : ${point.open}<br/>Close : ${point.close}' : 'High : <b>${point.high}</b><br/>Low :' +
                    ' <b>${point.low}</b><br/>Open : <b>${point.open}</b><br/>Close : <b>${point.close}</b>';
            }
        }

        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : 'ltr');
    }

    private initPrivateVariable(): void {
        this.animateSeries = true;
        this.delayRedraw = false;
        this.dragY = null;
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.refreshAxis();
        this.refreshDefinition(<Row[]>this.rows);
        this.refreshDefinition(<Column[]>this.columns);
        if (this.tooltipModule) {
            this.tooltipModule.previousPoints = [];
        }
        this.element.setAttribute('role', this.accessibility.accessibilityRole ? this.accessibility.accessibilityRole : 'region');
        this.element.setAttribute('tabindex', this.accessibility.focusable ? String(this.accessibility.tabIndex) : '-1');
        (this.element as HTMLElement).style.outline = 'none';
        this.element.setAttribute('aria-label', this.accessibility.accessibilityDescription ? this.accessibility.accessibilityDescription : this.title + '. Syncfusion interactive chart.');
        if (!(this.element.classList.contains('e-chart-focused'))) {
            this.element.setAttribute('class', this.element.getAttribute('class') + ' e-chart-focused');
        }
        if (this.element.id === '') {
            let collection: number = document.getElementsByClassName('e-chart').length;
            let elementid: string = 'chart_' + this.chartid + '_' + collection;
            while (document.getElementById(elementid)) {
                collection++;
                elementid = 'chart_' + this.chartid + '_' + collection;
            }
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
            chart: this, theme: this.theme, name: load, cancel: false
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
        this.applyZoomkit();
    }


    private cartesianChartRendering(beforeRenderData: ILoadedEventArgs): void {

        this.setTheme();

        this.createChartSvg();

        this.markerRender = new Marker(this);

        this.calculateAreaType();

        this.calculateVisibleSeries();

        this.initTechnicalIndicators();

        this.initTrendLines();

        this.calculateVisibleAxis();

        this.processData();

        this.renderComplete();

        this.mouseMoveEvent();

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
     * Initiates animation for the chart.
     *
     * @param {number} [duration] - The duration of the animation in milliseconds.
     * @returns {void}
     * @private
     */
    public animate(duration ?: number): void {
        this.redraw = true;
        this.animated = true; //used to set duration as 1000 for animation at default 300
        this.duration = duration ? duration : 1000;
        if (this.tooltipModule) {
            this.tooltipModule.removeHighlightedMarker(<PointData[]>this.tooltipModule.previousPoints, true);
        }
        else if (this.markerRender.previousPoints) {
            for (let previousPoint: number = 0; previousPoint < this.markerRender.previousPoints.length; previousPoint++) {
                this.markerRender.removeHighlightedMarker(this.markerRender.previousPoints[previousPoint as number].series as Series,
                                                          this.markerRender.previousPoints[previousPoint as number].point as Points);
            }
        }
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

        const isAllSeriesEmpty: boolean = this.series.every((s: SeriesModel) => {
            const dataSource: Object[] = s.dataSource as Object[] || [];
            return dataSource.length === 0;
        });

        //this prevents the initial rendering of stock chart
        if (this.stockChart && !this.stockChart.rangeFound) {
            if (this.stockChart.enablePeriodSelector || this.stockChart.enableSelector) {
                return null;
            }
        }

        this.renderElements();
        this.renderNoDataTemplate(isAllSeriesEmpty && !isNullOrUndefined(this.noDataTemplate));
        removeElement('chartmeasuretext');
        this.removeSelection();
        if (this.markerRender) {
            this.markerRender.mergeXvalues(this.visibleSeries);
        }
    }

    private renderNoDataTemplate(allowTemplate: boolean): void {
        const existingTemplate: Element = this.element.querySelector(`#${this.element.id}_NoDataTemplate_wrapper`);
        if (existingTemplate) {
            existingTemplate.remove();
        }
        if (allowTemplate) {
            const sanitizedTemplate: string | Function = this.enableHtmlSanitizer
                ? this.sanitize(this.noDataTemplate as string)
                : this.noDataTemplate;

            const wrapper: HTMLElement = createElement('div', {
                id: this.element.id + '_NoDataTemplate_wrapper'
            });

            let borderStrokeWidth: number = 0;
            const borderElement: SVGRectElement | null = this.element.querySelector(
                `#${this.element.id}_ChartBorder`
            ) as SVGRectElement | null;

            if (borderElement) {
                const strokeAttr: string | null = borderElement.getAttribute('stroke-width');
                borderStrokeWidth = strokeAttr ? parseFloat(strokeAttr) : 0;
            }

            let topOffset: number = borderStrokeWidth;
            let leftOffset: number = borderStrokeWidth;
            let width: number = this.availableSize.width - borderStrokeWidth * 2;
            let height: number = this.availableSize.height - borderStrokeWidth * 2;

            if (this.title) {
                const titleHeight: number = this.title
                    ? measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont).height
                    : 0;
                const subTitleHeight: number = this.subTitle
                    ? measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont).height
                    : 0;
                const spacing: number = this.subTitle ? 5 : 0;
                const totalOffset: number = titleHeight + subTitleHeight + spacing;

                switch (this.titleStyle.position) {
                case 'Top':
                    topOffset = totalOffset + 11;
                    height -= totalOffset + 11;
                    break;
                case 'Left':
                    leftOffset = totalOffset + 11;
                    width -= totalOffset + 11;
                    break;
                case 'Bottom':
                    height = height - totalOffset - 16;
                    break;
                case 'Right':
                    width = width - totalOffset - 11;
                    break;
                }
            }

            wrapper.style.cssText = `position: absolute; top: ${topOffset}px; left: ${leftOffset}px; width: ${width}px;
            height: ${height}px; z-index: 1;
        `;

            const element: HTMLElement = getElement(this.element.id + '_Secondary_Element') as HTMLElement;
            element.appendChild(wrapper);
            createTemplate(wrapper, null, sanitizedTemplate, this, null, null, this.element.id + '_NoData');
        }
    }

    /**
     * To calcualte the stack values.
     *
     * @returns {void}
     * @private
     */
    public calculateStackValues(): void {
        let series: Series;
        let isCalculateStacking: boolean = false;
        for (let i: number = 0, len: number = this.visibleSeries.length; i < len; i++) {
            series = <Series>this.visibleSeries[i as number];
            if (series.visible) {
                series.position = series.rectCount = undefined;
            }
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

        this.renderAnnotation();
        if (this.stackLabels.visible && this.visibleSeries.some((series: Series) => series.type && series.type.indexOf('Stacking') > -1) && this.dataLabelModule) {
            this.dataLabelModule.renderStackLabels();
        }
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
                this.canvasRender.ctx.beginPath();
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
     * To set the left and top position for data label template for center aligned chart.
     *
     * @returns {void}
     */
    private setSecondaryElementPosition(): void {
        const element: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect =  getElement(this.svgId).getBoundingClientRect();
        element.style.left = Math.max(((svgRect.left - rect.left) / this.scaleX), 0) + 'px';
        element.style.top = Math.max(((svgRect.top - rect.top) / this.scaleY), 0) + 'px';
    }
    private initializeModuleElements(): void {
        this.dataLabelCollections = [];
        this.lastValueLabelCollections = [];
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
        if (this.lastValueLabelModule) {
            this.lastValueLabelElements = this.renderer.createGroup({id: elementId + 'LastValueLabelCollection'});
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
        if (this.tooltip.enable && !this.stockChart) {
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
            if (this.enableCanvas) {
                for (const series of this.visibleSeries) {
                    if (series.lastValueLabel.enable) {
                        this.lastValueLabelModule.render(series, this, series.lastValueLabel);
                    }
                }
            }
            // Trendline is append to DOM after the series
            if (this.trendLineElements) {
                appendChildElement(this.enableCanvas, this.svgObject, this.trendLineElements, this.redraw);
            }

            this.appendElementsAfterSeries(axisElement);
        }
    }
    /**
     * Renders the series on the chart.
     *
     * @private
     * @returns {void}
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
            if (!visibility) {
                if (item.lastValueLabelElement) {
                    removeElement(item.lastValueLabelElement.id);
                    item.lastValueLabelElement = null;
                }
            }
            if (visibility) {
                this.visible++;
                findClipRect(item, this.enableCanvas);
                if (this.enableCanvas) {
                    // To render scatter and bubble series in canvas
                    this.renderCanvasSeries();
                }
                item.renderSeries(this);
            }
            else if (item.isLegendClicked && (item.type.indexOf('StackingArea') > -1 || item.type.indexOf('StackingBar') > -1 || item.type.indexOf('StackingColumn') > -1)) {
                findClipRect(item, this.enableCanvas);
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
        if (!this.seriesElements || (options.height < 0 || options.width < 0)) {
            return;
        }
        let clipRectElement: Element;
        if (this.chartAreaType === 'PolarRadar') {
            clipRectElement = appendClipElement(this.redraw, options, this.renderer as SvgRenderer, 'drawCircularClipPath');
        } else {
            clipRectElement = appendClipElement(this.redraw, options, this.renderer as SvgRenderer);
        }

        if (!this.enableCanvas) {
            this.seriesElements.appendChild(clipRectElement);
        }
        const seriesSvg: HTMLElement = document.getElementById(this.element.id + '_series_svg');
        if (seriesSvg) {
            appendChildElement(false, seriesSvg, this.seriesElements, this.redraw);
        } else {
            appendChildElement(this.enableCanvas, this.svgObject, this.seriesElements, this.redraw);
        }
    }
    protected renderCanvasSeries(): void {
        // const svgElement: Element;
        // svgElement = (this.enableCanvas) ?
        //     svgElement : this.svgObject;
        // const canvas: boolean = (this.enableCanvas) ?
        //     false : this.enableCanvas;
        let svgElement: Element;
        // let canvas: boolean;
        if (this.enableCanvas) {
            const tempSvgElement: Element = svgElement;
            svgElement = tempSvgElement;
            // canvas = false;
        }
        else {
            svgElement = this.svgObject;
            // canvas = this.enableCanvas;
        }
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
        if ((this.zoomModule && this.zoomSettings.enableScrollbar && this.scrollElement && this.scrollElement.childElementCount) ||
            (this.scrollElement && this.scrollElement.childElementCount)) {
            appendChildElement(false, getElement(this.element.id + '_Secondary_Element'), this.scrollElement, this.redraw);
        }

        if (this.stripLineModule) {
            this.stripLineModule.renderStripLine(this, 'Over', this.axisCollections);
        }

        if (!this.tooltip.enable || this.stockChart) {
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
        if (this.lastValueLabelElements && this.lastValueLabelElements.hasChildNodes()) {
            appendChildElement(this.enableCanvas, this.svgObject, this.lastValueLabelElements, this.redraw);
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
        if ((!this.redraw || this.zoomRedraw) && this.zoomModule && (!this.zoomSettings.enablePan || this.zoomModule.performedUI ||
            this.zoomSettings.showToolbar)) {
            this.zoomModule.applyZoomToolkit(this, this.axisCollections);
        }
    }
    /**
     * Render annotation perform here.
     *
     * @private
     * @returns {void}
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
            this.trigger('loaded', { chart: this });
        }

        if (!this.stockChart && this.visibleSeries.length > 0) {
            for (const series of this.visibleSeries) {
                if (!isNullOrUndefined(series.points)) {
                    this.maxPointCount = Math.max(prevPointCount, series.points.length);
                    prevPointCount = series.points.length;
                }
            }
        }
    }

    private initializeDataModule(series: SeriesBase): void {
        series.xData = []; series.yData = [];
        let dataSource: Object | DataManager;
        const isAngular: string = 'isAngular';
        if (this[isAngular as string]) {
            dataSource = Object.keys(series.dataSource).length ? series.dataSource : this.dataSource;
        } else {
            dataSource = series.dataSource || this.dataSource;
        }
        series.dataModule = new Data(dataSource, series.query);
        series.points = [];
        (series as TechnicalIndicator).refreshDataManager(this);
    }

    /**
     * To provide the array of modules needed for control rendering.
     *
     * @returns {void} - To provide the array of modules needed for control rendering.
     * @private
     */
    public calculateBounds(): void {
        const margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        const padding: number = this.titleStyle.position === 'Top' || (this.titleStyle.position === 'Bottom' && !this.legendSettings.visible) ? 15 : 5;
        let left: number = margin.left + this.border.width;
        let width: number = this.availableSize.width - left - margin.right - this.border.width;
        let elementSpacing: number = 0;
        this.titleCollection = [];
        this.subTitleCollection = [];
        if (this.title) {
            this.titleCollection = getTitle(this.title, this.titleStyle, width, this.enableRtl, this.themeStyle.chartTitleFont);
            titleHeight = (measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont).height *
            this.titleCollection.length) + padding;
            if (this.subTitle) {
                this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, width,
                                                   this.enableRtl, this.themeStyle.chartSubTitleFont);
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont).height *
                this.subTitleCollection.length) + padding;
            }
        } else if (this.legendSettings.position !== 'Top' && this.border.width) { elementSpacing = 10; }
        let top: number = margin.top + elementSpacing + this.border.width + this.chartArea.border.width * 0.5;
        let height: number = this.availableSize.height - top - this.border.width - margin.bottom;
        const marginTotal: number = subTitleHeight + titleHeight + this.titleStyle.border.width + this.subTitleStyle.border.width;
        switch (this.titleStyle.position) {
        case 'Top':
            top += marginTotal;
            height -= marginTotal;
            break;
        case 'Bottom':
            height -= marginTotal;
            break;
        case 'Left':
            left += marginTotal;
            width -= marginTotal;
            break;
        case 'Right':
            left -= (this.titleStyle.border.width + this.subTitleStyle.border.width);
            width -= marginTotal;
            break;
        }
        if (this.stockChart && this.stockChart.legendSettings.visible && this.stockChart.stockLegendModule) {
            if (this.stockChart.legendSettings.position === 'Top') {
                top += this.stockChart.stockLegendModule.legendBounds.height;
            } else if (this.stockChart.legendSettings.position === 'Left') {
                left += this.stockChart.stockLegendModule.legendBounds.width;
            }
        }
        if (this.scrollBarModule && ((this.zoomModule && this.zoomSettings.enableScrollbar && this.zoomModule.isZoomed) ||
            this.scrollSettingEnabled)) {
            const scrollbarPadding: number = 10;
            for (let i: number = 0, len: number = this.axisCollections.length; i < len; i++) {
                const axis: Axis = this.axisCollections[i as number];
                if (axis.orientation === 'Horizontal' && axis.scrollbarSettings.position === 'Bottom') {
                    height -= axis.scrollbarSettings.height + scrollbarPadding;
                }
                else if (axis.orientation === 'Horizontal' && axis.scrollbarSettings.position === 'Top') {
                    height -= axis.scrollbarSettings.height + scrollbarPadding;
                    top += axis.scrollbarSettings.height + scrollbarPadding;
                }
                else if (axis.orientation === 'Vertical' && axis.scrollbarSettings.position === 'Right') {
                    width -= axis.scrollbarSettings.height + scrollbarPadding;
                }
                else if (axis.orientation === 'Vertical' && axis.scrollbarSettings.position === 'Left') {
                    width -= axis.scrollbarSettings.height + scrollbarPadding;
                    left += axis.scrollbarSettings.height + scrollbarPadding;
                }
            }
        }
        this.initialClipRect = new Rect(left, top, width, height);
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
        }
        this.initialClipRect.y += this.chartArea.margin.top;
        this.initialClipRect.height -= (this.chartArea.margin.top + this.chartArea.margin.bottom);
        this.initialClipRect.x += this.chartArea.margin.left;
        this.initialClipRect.width -= (this.chartArea.margin.left + this.chartArea.margin.right);
        this.chartAxisLayoutPanel.measureAxis(this.initialClipRect);

    }

    /**
     * Prints the chart or specified element.
     *
     * @param {string[] | string | Element} id - The ID or array of IDs of the elements to print.
     * @returns {void}
     */
    public print(id?: string[] | string | Element): void {
        const exportChart: PrintUtils = new PrintUtils(this);
        const width: string = this.width;
        if (this.getModuleName() === 'chart' && parseInt(this.width, 10) >= 80 && this.width.indexOf('%') > -1) {
            this.width = '80%';
            this.dataBind();
        }
        exportChart.print(id);
        if (this.getModuleName() === 'chart' && parseInt(this.width, 10) >= 80 && this.width.indexOf('%') > -1) {
            this.width = width;
            this.dataBind();
        }
    }

    /**
     * Defines the trendline initialization.
     *
     * @returns {void}
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
     * Calculate the visible axis.
     *
     * @private
     * @returns {void}
     */
    private calculateVisibleAxis(): void {
        let axis: Axis;
        let axes: AxisModel[] = [this.primaryXAxis, this.primaryYAxis];
        axes = this.chartAreaType === 'Cartesian' ? axes.concat(this.axes) : axes;
        if (this.paretoSeriesModule && this.series[0] && this.series[0].type === 'Pareto') {
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
            axis = <Axis>axes[i as number]; axis.series = [];
            axis.labels = []; axis.indexLabels = {};
            axis.orientation = (i === 0 && this.visibleSeries.length === 0) ? (this.requireInvertedAxis ? 'Vertical' : 'Horizontal') :
                (i === 1 && this.visibleSeries.length === 0) ? (this.requireInvertedAxis ? 'Horizontal' : 'Vertical') : axis.orientation;
            for (const series of this.visibleSeries) {
                this.initAxis(series, axis, true);
                if (series.category === 'Pareto' && series.type === 'Line' && series.yAxis) {
                    series.yAxis.internalVisibility = series.paretoOptions.showAxis;
                }
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

    /**
     * Refreshes the technical indicator for the specified series.
     *
     * @param {SeriesBase} series - The series for which to refresh the technical indicator.
     * @returns {void}
     * @private
     */
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
            series = <Series>seriesCollection[i as number];
            // for y axis label issue during chart navigation
            series.category = seriesCollection[0].type === 'Pareto' ? 'Pareto' : 'Series';
            series.index = i;
            series.interior = series.fill || colors[i % count];
            if (!series.marker.shape && (series.marker.visible || series.type === 'Scatter' || series.drawType === 'Scatter')) {
                series.marker.shape = markerShapes[this.markerIndex as number % 10];
                this.markerIndex++;
            }
            if (this.isSecondaryAxis(series.xAxis)) {
                series.xAxis.internalVisibility = series.xAxis.series.some((value: Series) => (value.visible));
            }
            if (this.isSecondaryAxis(series.yAxis)) {
                series.yAxis.internalVisibility = series.yAxis.series.some((value: Series) => (value.visible));
            }
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
                if (this.chartAreaType === 'PolarRadar' && ((series.xAxisName !== null && (this.primaryXAxis.name !== series.xAxisName)) ||
                        (series.yAxisName !== null && (this.primaryYAxis.name !== series.yAxisName)))) {
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
            seriesCollection[i as number] = series;
        }
    }

    public isSecondaryAxis(axis: Axis): boolean {
        return ((this as Chart).axes.indexOf(axis) > -1);
    }

    private renderTitle(): void {
        let rect: Rect;
        const margin: MarginModel = this.margin;
        const elementSpacing: number = 5;
        if (this.title) {
            let getAnchor: string = getTextAnchor(this.titleStyle.textAlignment, this.enableRtl);
            const elementSize: Size = measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont);
            rect = new Rect(
                margin.left, 0, this.availableSize.width - margin.left - margin.right, 0
            );
            const borderWidth: number = this.titleStyle.border.width;
            let positionY: number = this.margin.top + ((elementSize.height) * 3 / 4);
            let positionX: number = titlePositionX(rect, this.titleStyle || this.themeStyle.chartTitleFont) + borderWidth;
            let rotation: string;
            const alignment: Alignment = this.titleStyle.textAlignment;
            const subtitleSize: Size = measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont);
            switch (this.titleStyle.position) {
            case 'Top':
                positionY += borderWidth * 0.5;
                positionX += getAnchor === 'start' ? borderWidth * 0.5 + this.border.width :
                    getAnchor === 'end' ? ((-borderWidth * 2) - this.border.width) : 0;
                break;
            case 'Bottom':
                positionX += getAnchor === 'start' ? (borderWidth * 0.5) + this.border.width :
                    getAnchor === 'end' ? (-borderWidth * 2) - this.border.width : 0;
                positionY = this.availableSize.height - this.margin.bottom - subtitleSize.height - (elementSize.height / 2) -
                        (borderWidth * 0.5) - (this.subTitleStyle.border.width * 0.5);
                break;
            case 'Left':
                positionX = this.margin.left + ((elementSize.height) * 3 / 4) + (borderWidth * 0.5);
                positionY = alignment === 'Near' ? margin.bottom + (borderWidth * 0.5) + this.border.width :
                    alignment === 'Far' ? this.availableSize.height - margin.bottom - (borderWidth * 0.5) - this.border.width : this.availableSize.height / 2;
                getAnchor = alignment === 'Near' ? 'end' : alignment === 'Far' ? 'start' : 'middle';
                getAnchor = this.enableRtl ? (getAnchor === 'end' ? 'start' : getAnchor === 'start' ? 'end' : getAnchor) : getAnchor;
                rotation = 'rotate(' + -90 + ',' + positionX + ',' + positionY + ')';
                break;
            case 'Right':
                positionX = this.availableSize.width - this.margin.right - ((elementSize.height) * 3 / 4) - (borderWidth * 0.5);
                positionY = alignment === 'Near' ? margin.bottom + (borderWidth * 0.5) + this.border.width :
                    alignment === 'Far' ? this.availableSize.height - margin.bottom - (borderWidth * 0.5) - this.border.width : this.availableSize.height / 2;
                getAnchor = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
                getAnchor = this.enableRtl ? (getAnchor === 'end' ? 'start' : getAnchor === 'start' ? 'end' : getAnchor) : getAnchor;
                rotation = 'rotate(' + 90 + ',' + positionX + ',' + positionY + ')';
                break;
            case 'Custom':
                positionX = this.titleStyle.x;
                positionY = this.titleStyle.y;
                getAnchor = 'middle';
                break;
            }
            const borderOptions: borderOption = {
                'id': this.element.id + '_ChartTitleBorder',
                'x': positionX - (getAnchor === 'middle' ? (elementSize.width / 2) + elementSpacing : getAnchor === 'end' ? elementSize.width + elementSpacing : elementSpacing),
                'y': positionY - elementSize.height + (elementSize.height / 4),
                'rx': this.titleStyle.border.cornerRadius,
                'ry': this.titleStyle.border.cornerRadius,
                'width': elementSize.width + (elementSpacing * 2),
                'height': elementSize.height * this.titleCollection.length,
                'fill': this.titleStyle.background,
                'stroke-width': borderWidth,
                'stroke': this.titleStyle.border.color,
                'transform': rotation ? rotation : '',
                'd': ''
            };
            const htmlObject: Element = redrawElement(this.redraw, this.element.id + '_ChartTitleBorder', borderOptions, this.renderer)
                || this.renderer.drawRectangle(borderOptions);
            appendChildElement(this.enableCanvas, this.svgObject, htmlObject, this.redraw);
            const options: TextOption = new TextOption(
                this.element.id + '_ChartTitle',
                positionX, positionY,
                getAnchor, this.titleCollection, rotation, 'auto'
            );
            const element: Element = redrawElement(this.redraw, this.element.id + '_ChartTitle', options, this.renderer) ||
                textElement(
                    this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitleFont.color, this.svgObject,
                    null, null, null, null, null, null, null, null, this.enableCanvas, null, this.themeStyle.chartTitleFont
                );
            if (element && !this.enableCanvas) {
                element.setAttribute('tabindex', this.titleStyle.accessibility.focusable ? String(this.titleStyle.accessibility.tabIndex) : '-1');
                (element as HTMLElement).style.outline = 'none';
                element.setAttribute('class', 'e-chart-focused');
                element.setAttribute('role', this.titleStyle.accessibility.accessibilityRole);
                element.setAttribute('aria-label', this.titleStyle.accessibility.accessibilityDescription);
            }
            if (this.subTitle) {
                this.renderSubTitle(options);
            }
        }
    }
    private renderSubTitle(options: TextOption): void {
        let maxWidth: number = 0;
        let subMaxWidth: number = 0;
        let titleWidth: number = 0;
        let subTitleWidth: number = 0;
        const padding: number = 10;
        const alignment: Alignment = this.titleStyle.textAlignment;
        for (const titleText of this.titleCollection) {
            titleWidth = measureText(titleText, this.titleStyle, this.themeStyle.chartTitleFont).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        for (const subTitleText of this.subTitleCollection) {
            subTitleWidth = measureText(subTitleText, this.subTitleStyle, this.themeStyle.chartSubTitleFont).width;
            subMaxWidth = subTitleWidth > subMaxWidth ? subTitleWidth : subMaxWidth;
        }
        maxWidth = Math.max(titleWidth, subMaxWidth);
        const subTitleElementSize: Size = measureText(this.subTitleCollection.reduce((a: string, b: string) =>
            (a.length > b.length ? a : b)), this.subTitleStyle, this.themeStyle.chartSubTitleFont);
        const getAnchor: string = getTextAnchor(this.subTitleStyle.textAlignment, this.enableRtl);
        const rect: Rect = new Rect(
            alignment === 'Center' ? (options.x - maxWidth * 0.5) : alignment === 'Far' ? options.x - maxWidth : options.x,
            0, maxWidth, 0
        );
        if (this.titleStyle.position === 'Left') {
            rect.x = alignment === 'Center' ? (options.x - maxWidth * 0.5) : alignment === 'Far' ? this.margin.left + ((subTitleElementSize.height) * 3 / 4) : (options.x - maxWidth);
        }
        const elementSize: Size = measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont);
        let positionY: number = options.y * options.text.length + subTitleElementSize.height + (padding / 2) +
        this.titleStyle.border.width + (this.subTitleStyle.border.width * 0.5);
        if (this.titleStyle.position === 'Bottom') {
            positionY = options.y * options.text.length + (padding / 2) + (elementSize.height / 2) + (subTitleElementSize.height / 2);
        }
        const borderOptions: border = {
            'id': this.element.id + '_ChartSubTitleBorder',
            'x': titlePositionX(rect, this.subTitleStyle) - (getAnchor === 'middle' ? (subTitleElementSize.width / 2) + padding / 2 : getAnchor === 'end' ? subTitleElementSize.width + padding / 2 : padding / 2),
            'y': positionY - subTitleElementSize.height + (subTitleElementSize.height / 4),
            'rx': this.subTitleStyle.border.cornerRadius,
            'ry': this.subTitleStyle.border.cornerRadius,
            'width': subTitleElementSize.width + padding,
            'height': subTitleElementSize.height * this.subTitleCollection.length,
            'fill': this.subTitleStyle.background,
            'stroke-width': this.subTitleStyle.border.width,
            'stroke': this.subTitleStyle.border.color,
            'transform': options.transform,
            'd': ''
        };
        const htmlObject: Element = redrawElement(this.redraw, this.element.id + '_ChartSubTitleBorder', borderOptions, this.renderer)
            || this.renderer.drawRectangle(borderOptions);
        appendChildElement(this.enableCanvas, this.svgObject, htmlObject, this.redraw);
        const subTitleOptions: TextOption = new TextOption(
            this.element.id + '_ChartSubTitle',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            positionY,
            getTextAnchor(this.subTitleStyle.textAlignment, this.enableRtl), this.subTitleCollection, options.transform, 'auto'
        );
        const element: Element = redrawElement(this.redraw, this.element.id + '_ChartSubTitle', subTitleOptions, this.renderer) ||
            textElement(
                this.renderer, subTitleOptions, this.subTitleStyle, this.subTitleStyle.color ||
                this.themeStyle.chartSubTitleFont.color, this.svgObject,
                null, null, null, null, null, null, null, null, this.enableCanvas, null, this.themeStyle.chartSubTitleFont
            );
        if (element && !this.enableCanvas) {
            element.setAttribute('tabindex', this.subTitleStyle.accessibility.focusable ? String(this.subTitleStyle.accessibility.tabIndex) : '-1');
            if (this.subTitleStyle.accessibility.focusable) { (element as HTMLElement).style.outline = 'none'; }
            element.setAttribute('class', 'e-chart-focused');
            element.setAttribute('role', this.subTitleStyle.accessibility.accessibilityRole);
            element.setAttribute('aria-label', this.subTitleStyle.accessibility.accessibilityDescription);
        }
    }
    private renderBorder(): void {
        let x: number = 0;
        let y: number = 0;
        const width: number = this.border.width;
        const backGroundImage: string = this.backgroundImage;
        const fillColor: string = backGroundImage ? 'transparent' : (this.background || this.themeStyle.background);
        if (this.stockChart && this.stockChart.legendSettings.visible && this.stockChart.stockLegendModule) {
            if (this.stockChart.legendSettings.position === 'Top') {
                y += this.stockChart.stockLegendModule.legendBounds.height;
            } else if (this.stockChart.legendSettings.position === 'Left') {
                x += this.stockChart.stockLegendModule.legendBounds.width;
            }
        }
        const rect: RectOption = new RectOption(
            this.element.id + '_ChartBorder', fillColor, this.border, 1,
            new Rect(width * 0.5 + x, width * 0.5 + y, this.availableSize.width - width, this.availableSize.height - width), 0, 0, '', this.border.dashArray);

        this.htmlObject = redrawElement(this.redraw, this.element.id + '_ChartBorder', rect, this.renderer) as HTMLElement
            || this.renderer.drawRectangle(rect) as HTMLElement;
        this.htmlObject.setAttribute('aria-hidden', 'true');

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
     * Renders the border for the area.
     *
     * @returns {void}
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
                this.chartArea.opacity, this.chartAxisLayoutPanel.seriesClipRect, 0, 0, '', this.chartArea.border.dashArray);
            if (rect.height < 0 || rect.width < 0) { return null; }
            this.htmlObject = this.renderer.drawRectangle(rect) as HTMLElement;
            this.htmlObject.setAttribute('aria-hidden', 'true');
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
        const scrollTop: number = window.scrollY || document.documentElement.scrollTop;
        for (let series of seriesCollection) {
            series = new Series(this, 'series', series, true);
            this.series.push(series);
        }
        this.refresh();
        window.scrollTo(0, scrollTop);
    }

    /**
     * To Remove series for the chart
     *
     * @param {number} index - Defines the series index to be remove in chart series
     * @returns {void}
     */
    public removeSeries(index: number): void {
        this.redraw = false; //fix for remove svg not working when use animatemethod.
        const scrollTop: number = window.scrollY || document.documentElement.scrollTop;
        const series: Series = this.visibleSeries[index as number];
        if (series) {
            if (series.xAxis.series.length <= 1) {
                series.xAxis.orientation = null;
            }
            if (series.yAxis.series.length <= 1) {
                series.yAxis.orientation = null;
            }
        }
        for (let i: number = 0; i < this.axes.length; i++) {
            if ((this.axes[i as number] as Axis).orientation === null) {
                this.axes.splice(i, 1);
            }
        }
        this.series.splice(index, 1);
        this.refresh();
        window.scrollTo(0, scrollTop);
    }

    /**
     * Clear all series from the chart.
     *
     * @returns {void}.
     */

    public clearSeries(): void {
        this.series = [];
        const scrollTop: number = window.scrollY || document.documentElement.scrollTop;
        this.refresh();
        window.scrollTo(0, scrollTop);
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
            this.axes.push(axis);
        }
        this.refresh();
    }

    /**
     * To remove secondary axis for the chart.
     *
     * @param {number} index - Defines the axis collection to be removed in chart.
     * @returns {void}
     * @private
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
        this.visibleSeriesCount = null;
        this.dataLabelElements = null;
        this.lastValueLabelCollections = null;
        this.lastValueLabelElements = null;
        this.yAxisElements = null;
        const element: HTMLElement = document.getElementById(this.element.id + 'Keyboard_chart_focus');
        if (element) { element.remove(); }
        const highlightElement: HTMLElement = document.getElementById(this.element.id + '_ej2_chart_highlight');
        if (highlightElement) { highlightElement.remove(); }
        const selectionElement: HTMLElement = document.getElementById(this.element.id + '_ej2_chart_selection');
        if (selectionElement) { selectionElement.remove(); }
        removeElement('chartmeasuretext');
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
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
     * Gets the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - The persisted data.
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded', 'animationComplete', 'primaryXAxis', 'primaryYAxis'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Method to create SVG element.
     *
     * @private
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
        /** UnBind the Event handler */
        EventHandler.remove(this.element, startEvent, this.chartOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.chartOnMouseClick);
        EventHandler.remove(this.element, 'dblclick', this.chartOnDoubleClick);
        EventHandler.remove(this.element, 'contextmenu', this.chartRightClick);
        EventHandler.remove(this.element, cancelEvent, this.mouseLeave);
        EventHandler.remove(this.element, 'keydown', this.chartKeyDown);
        EventHandler.remove(document.body, 'keydown', this.documentKeyHandler);
        EventHandler.remove(this.element, 'keyup', this.chartKeyUp);

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
        /** Find the Events type */

        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /** Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.chartOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.chartOnMouseClick, this);
        EventHandler.add(this.element, 'dblclick', this.chartOnDoubleClick, this);
        EventHandler.add(this.element, 'contextmenu', this.chartRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);
        EventHandler.add(this.element, 'keydown', this.chartKeyDown, this);
        EventHandler.add(document.body, 'keydown', this.documentKeyHandler, this);
        EventHandler.add(this.element, 'keyup', this.chartKeyUp, this);

        this.resizeBound = this.chartResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );

        this.longPressBound = this.longPress.bind(this);
        this.touchObject = new Touch(this.element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });

        /** Apply the style for chart */
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
            this.selectionMode !== 'None' || this.highlightMode !== 'None';
        element.style.touchAction = disableScroll ? 'none' : 'element';
        element.style.msTouchAction = disableScroll ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        // To fix angular and react tooltip div scrollbar issue
        element.style.overflow = 'hidden';
        element.style.height = (element.style.height || (this.height && this.height.indexOf('%') === -1)) ? element.style.height : 'inherit';
    }
    /**
     * Determines the orientation.
     *
     * @private
     * @returns {boolean} - True if the orientation is found, otherwise false.
     */
    public isOrientation(): boolean {
        return ('orientation' in window && 'onorientationchange' in window);
    }

    /**
     * Handles the long press on the chart.
     *
     * @param {TapEventArgs} [e] - The event arguments for the long press.
     * @returns {boolean} - Returns false.
     * @private
     */
    public longPress(e?: TapEventArgs): boolean {
        this.mouseX = (e && e.originalEvent.changedTouches) ? (e.originalEvent.changedTouches[0].clientX) : 0;
        this.mouseY = (e && e.originalEvent.changedTouches) ? (e.originalEvent.changedTouches[0].clientY) : 0;
        this.startMove = true;
        this.allowPan = this.stockChart ? false : this.allowPan;
        this.setMouseXY(this.mouseX, this.mouseY);
        this.notify('tapHold', e);
        return false;
    }
    /**
     * Sets the mouse x and y coordinates for the aligned chart element SVG position.
     *
     * @param {number} pageX - The x-coordinate of the mouse pointer.
     * @param {number} pageY - The y-coordinate of the mouse pointer.
     * @returns {void}
     * @private
     */
    private setMouseXY(pageX: number, pageY: number): void {
        if (getElement(this.svgId)) {
            const svgRect: ClientRect = getElement(this.svgId).getBoundingClientRect();
            const rect: ClientRect = this.element.getBoundingClientRect();
            this.scaleX = svgRect.width / this.availableSize.width;
            this.scaleY = svgRect.height / this.availableSize.height;
            this.mouseY = ((pageY - rect.top) - Math.max(svgRect.top - rect.top, 0)) / this.scaleY;
            this.mouseX = ((pageX - rect.left) - Math.max(svgRect.left - rect.left, 0)) / this.scaleX;
            if (this.stockChart) {
                this.mouseX += this.stockChart.legendSettings.position === 'Left' ? this.stockChart.stockLegendModule.legendBounds.width : 0;
                this.mouseY += this.stockChart.legendSettings.position === 'Top' ? this.stockChart.stockLegendModule.legendBounds.height : 0;
            }
        }
    }

    /**
     * Exports the chart in the specified format.
     *
     * @param {ExportType} type - The file format for the export. Available options are PNG, JPEG, PDF, and SVG.
     * @param {string} fileName - The name of the file to be saved.
     * @returns {void}
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
            chart: this,
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
                    this.trigger('loaded', { chart: this });
                },
                500);
        }
        return false;

    }
    /**
     * Handles the mouse movement event on the chart.
     *
     * @param {PointerEvent} e - The mouse event.
     * @returns {boolean} - Returns false.
     * @private
     */
    public mouseMove(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (this.allowPan) {
            return false;
        }
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
        this.previousPageX = pageX;
        this.previousPageY = pageY;
        if (getElement(this.svgId)) {
            this.setMouseXY(pageX, pageY);
            this.chartOnMouseMove(e);
        }
        return false;
    }
    /**
     * Handles the mouse leave event on the chart.
     *
     * @param {PointerEvent} e - The mouse event.
     * @returns {boolean} - Returns false.
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (this.stockChart && this.stockChart.onPanning) {
            return false;
        }
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
        this.previousPageX = null;
        this.previousPageY = null;
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseLeave(e);
        return false;
    }
    /**
     * Handles the mouse leave event on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} - Returns false.
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
     * Handles the double click event on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} - Returns false.
     * @private
     */
    public chartOnDoubleClick(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger(chartDoubleClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        return false;
    }

    /**
     * Handles the key down event on the chart.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {boolean} - Returns false.
     * @private
     */
    public chartKeyDown(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        if ((this.isZoomed && e.code === 'Tab') || e.code === 'Space') {
            e.preventDefault();
        }
        if (this.tooltip.enable && ((e.code === 'Tab' && this.previousTargetId.indexOf('Series') > -1) || e.code === 'Escape')) {
            actionKey = 'ESC';
        }
        if (this.highlightMode !== 'None' && e.code === 'Tab' && this.previousTargetId.indexOf('_chart_legend_') > -1) {
            if (this.highlightModule) {
                this.highlightModule.removeLegendHighlightStyles();
            }
        }
        if (e.ctrlKey && (e.key === '+' || e.code === 'Equal' || e.key === '-' || e.code === 'Minus')) {
            e.preventDefault();
            this.isZoomed = this.zoomModule && (this.zoomSettings.enableDeferredZooming || this.zoomSettings.enableSelectionZooming ||
                this.zoomSettings.enablePinchZooming || this.zoomSettings.enableMouseWheelZooming);
            //this.tooltipModule.fadeOut(this.element);
            actionKey = this.isZoomed ? e.code : '';
        }
        else if (e['keyCode'] === 82 && this.isZoomed) { // KeyCode 82 (R) for reseting
            e.preventDefault();
            this.isZoomed = false;
            actionKey = 'R';
        }
        else if (e.code.indexOf('Arrow') > -1) {
            e.preventDefault();
            actionKey = this.isZoomed ? e.code : '';
        }

        if (e.ctrlKey && (e.key === 'p')) {
            e.preventDefault();
            actionKey = 'CtrlP';
        }

        if (actionKey !== '') {
            this.chartKeyboardNavigations(e, (e.target as HTMLElement).id, actionKey);
        }
        if (e.code === 'Tab') {
            this.removeNavigationStyle();
        }
        return false;
    }

    /**
     * Handles the key up event on the chart.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {boolean} - Returns false.
     * @private
     */
    public chartKeyUp(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        let targetId: string = e.target['id'];
        let groupElement: HTMLElement;
        let markerGroup: HTMLElement;
        const targetElement: HTMLElement = e.target as HTMLElement;

        const titleElement: HTMLElement = getElement(this.element.id + '_ChartTitle') as HTMLElement;
        const seriesElement: HTMLElement = getElement(this.element.id + 'SeriesCollection') as HTMLElement;
        const legendElement: HTMLElement = getElement(this.element.id + '_chart_legend_translate_g') as HTMLElement;
        const pagingElement: HTMLElement = getElement(this.element.id + '_chart_legend_pageup') as HTMLElement;

        if (titleElement) { titleElement.setAttribute('class', 'e-chart-focused'); }
        if (seriesElement && seriesElement.firstElementChild && seriesElement.firstElementChild.children[1]) {
            const firstChild: HTMLElement = seriesElement.firstElementChild.children[1] as HTMLElement;
            let className: string = firstChild.getAttribute('class');
            if (className && className.indexOf('e-chart-focused') === -1) {
                className = className + ' e-chart-focused';
            } else if (!className) {
                className = 'e-chart-focused';
            }
            firstChild.setAttribute('class', className);
        }
        if (legendElement) {
            const firstChild: HTMLElement = legendElement.firstElementChild as HTMLElement;
            let className: string = firstChild.getAttribute('class');
            if (className && className.indexOf('e-chart-focused') === -1) {
                className = className + ' e-chart-focused';
            }
            else if (!className) {
                className = 'e-chart-focused';
            }
            firstChild.setAttribute('class', className);
        }
        if (pagingElement) { pagingElement.setAttribute('class', 'e-chart-focused'); }


        if (e.code === 'Tab') {

            if (this.previousTargetId !== '') {
                if ((this.previousTargetId.indexOf('_Series_') > -1 && targetId.indexOf('_Series_') === -1)) {
                    groupElement = getElement(this.element.id + 'SeriesCollection') as HTMLElement;
                    let previousElement: Element;
                    if (this.previousTargetId.indexOf('_Symbol') > -1 ? getElement(this.element.id + 'SymbolGroup' + this.currentSeriesIndex) :
                        groupElement.children[this.currentSeriesIndex]) {
                        previousElement = this.previousTargetId.indexOf('_Symbol') > -1 ?
                            getElement(this.element.id + 'SymbolGroup' + this.currentSeriesIndex).children[this.currentPointIndex + 1] :
                            (this.previousTargetId.indexOf('_Point_') > -1 ?
                                groupElement.children[this.currentSeriesIndex].children[this.currentPointIndex + 1] :
                                groupElement.children[this.currentSeriesIndex]);
                    }
                    this.currentPointIndex = 0;
                    this.currentSeriesIndex = 0;
                }
                else if (this.previousTargetId.indexOf('_chart_legend_page') > -1 && targetId.indexOf('_chart_legend_page') === -1
                    && targetId.indexOf('_chart_legend_g_') === -1) {
                    this.setTabIndex(e.target as HTMLElement, getElement(this.element.id + '_chart_legend_pageup') as HTMLElement);
                }
                else if (this.previousTargetId.indexOf('_chart_legend_g_') > -1 && targetId.indexOf('_chart_legend_g_') === -1) {
                    groupElement = getElement(this.element.id + '_chart_legend_translate_g') as HTMLElement;
                    this.setTabIndex(groupElement.children[this.currentLegendIndex] as HTMLElement,
                                     groupElement.firstElementChild as HTMLElement);
                }
            }

            this.previousTargetId = targetId;

            if (targetId.indexOf('SeriesGroup') > -1) {
                this.currentSeriesIndex = +targetId.split('SeriesGroup')[1];
                targetElement.removeAttribute('tabindex');
                targetElement.blur();
                if (targetElement.children.length > 1 && targetElement.children[1].id.indexOf('_Point_') === -1) {
                    markerGroup = getElement(this.element.id + 'SymbolGroup' + targetId.split('SeriesGroup')[1]) as HTMLElement;
                }
                let childToFocus: HTMLElement | null = null;
                if (markerGroup && markerGroup.children.length > 1) {
                    childToFocus = markerGroup.children[1] as HTMLElement;
                } else if (targetElement.children.length > 1) {
                    childToFocus = targetElement.children[1] as HTMLElement;
                }

                if (childToFocus) {
                    targetId = this.focusChild(childToFocus);
                }
            }
            else if (targetId.indexOf('_ChartTitle') > -1) {
                this.setNavigationStyle(targetId);
            }
            actionKey = targetId !== this.element.id ? 'Tab' : '';
        }
        else if (e.code.indexOf('Arrow') > -1) {
            e.preventDefault();
            this.previousTargetId = targetId;
            if (targetId.indexOf('_chart_legend_page') > -1) {
                if (e.code === 'ArrowLeft') {
                    getElement(this.element.id + '_chart_legend_pagedown').removeAttribute('tabindex');
                    this.focusChild(getElement(this.element.id + '_chart_legend_pageup') as HTMLElement);
                }
                else if (e.code === 'ArrowRight') {
                    getElement(this.element.id + '_chart_legend_pageup').removeAttribute('tabindex');
                    this.focusChild(getElement(this.element.id + '_chart_legend_pagedown') as HTMLElement);
                }
            }
            else if ((targetId.indexOf('_chart_legend_') > -1)) {
                const legendElement: HTMLCollection = targetElement.parentElement.children;
                legendElement[this.currentLegendIndex].removeAttribute('tabindex');

                this.currentLegendIndex += (e.code === 'ArrowUp' || e.code === 'ArrowRight') ? + 1 : - 1;
                this.currentLegendIndex = this.getActualIndex(this.currentLegendIndex, legendElement.length);

                const currentLegend: Element = legendElement[this.currentLegendIndex];
                this.focusChild(currentLegend as HTMLElement);
                this.removeNavigationStyle();
                this.setNavigationStyle(currentLegend.id);
                targetId = currentLegend.children[1].id;
                actionKey = this.highlightMode !== 'None' ? 'ArrowMove' : '';
            }
            else if (targetId.indexOf('_Series_') > -1) {
                groupElement = targetElement.parentElement.parentElement;
                let currentPoint: Element = e.target as Element;
                targetElement.removeAttribute('tabindex');
                targetElement.blur();

                if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                    const seriesIndexes: number[] = [];
                    for (let i: number = 0; i < groupElement.children.length; i++) {
                        if (groupElement.children[i as number].id.indexOf('SeriesGroup') > -1) {
                            seriesIndexes.push(+groupElement.children[i as number].id.split('SeriesGroup')[1]);
                        }
                    }
                    this.currentSeriesIndex = seriesIndexes.indexOf(this.currentSeriesIndex) + (e.code === 'ArrowRight' ? 1 : -1);
                    this.currentSeriesIndex = seriesIndexes[this.getActualIndex(this.currentSeriesIndex, seriesIndexes.length)];
                }
                else {
                    this.currentPointIndex += e.code === 'ArrowUp' ? 1 : -1;
                }
                if (targetId.indexOf('_Symbol') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex,
                                                                 getElement(this.element.id + 'SymbolGroup' + this.currentSeriesIndex).childElementCount - 1);
                    currentPoint = getElement(this.element.id + '_Series_' + this.currentSeriesIndex + '_Point_' +
                        this.currentPointIndex + '_Symbol');
                }
                else if (targetId.indexOf('_Point_') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex,
                                                                 getElement(this.element.id + 'SeriesGroup' + this.currentSeriesIndex).childElementCount - 1);
                    currentPoint = getElement(this.element.id + '_Series_' + this.currentSeriesIndex + '_Point_' +
                        this.currentPointIndex);
                }
                targetId = this.focusChild(currentPoint as HTMLElement);
                actionKey = 'ArrowMove';
            }
        }
        else if ((e.code === 'Enter' || e.code === 'Space') && ((targetId.indexOf('_chart_legend_') > -1) ||
            (targetId.indexOf('_Point_') > -1))) {
            targetId = (targetId.indexOf('_chart_legend_page') > -1) ? targetId : ((targetId.indexOf('_chart_legend_') > -1) ?
                targetElement.children[1].id : targetId);
            actionKey = 'Enter';
        }
        if (actionKey !== '') {
            this.chartKeyboardNavigations(e, targetId, actionKey);
        }


        return false;
    }
    /**
     * Sets the tab index for the specified elements.
     *
     * @param {HTMLElement} previousElement - The previous element whose tab index needs to be removed.
     * @param {HTMLElement} currentElement - The current element to which the tab index needs to be set.
     * @returns {void}
     * @private
     */
    public setTabIndex(previousElement: HTMLElement, currentElement: HTMLElement): void {
        if (previousElement) {
            previousElement.removeAttribute('tabindex');
        }
        if (currentElement) {
            currentElement.setAttribute('tabindex', '0');
        }
    }

    private getActualIndex(index: number, totalLength: number): number {
        return index > totalLength - 1 ? 0 : (index < 0 ? totalLength - 1 : index);
    }

    private focusChild(element: HTMLElement): string {
        element.setAttribute('tabindex', '0');
        let className: string = element.getAttribute('class');
        element.setAttribute('tabindex', '0');
        if (className && className.indexOf('e-chart-focused') === -1) {
            className = 'e-chart-focused ' + className;
        } else if (!className) {
            className = 'e-chart-focused';
        }
        element.setAttribute('class', className);
        element.focus();
        return element.id;
    }

    /**
     * Handles the key event on the document.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {void}
     * @private
     */
    private documentKeyHandler(e: KeyboardEvent): void {
        // 74 - J
        if (e.altKey && e.keyCode === 74 && !isNullOrUndefined(this.element)) {
            this.element.focus();
            this.setNavigationStyle(this.element.id);
        }
    }

    /**
     * Handles to set style for key event on the document.
     *
     * @param {target} target - element which currently focused.
     * @returns {void}
     * @private
     */
    private setNavigationStyle(target: string): void {
        const currentElement: HTMLElement = document.getElementById(target);
        if (currentElement) {
            currentElement.style.setProperty('outline', `${this.focusBorderWidth}px solid ${this.focusBorderColor || this.themeStyle.tabColor}`);
            currentElement.style.setProperty('margin', `${this.focusBorderMargin}px`);
        }
    }

    /**
     * Handles to remove style for key event on the document.
     *
     * @returns {void}
     * @private
     */
    private removeNavigationStyle(): void {
        const currentElement: NodeList = document.querySelectorAll(`[id*=_Point_], [id*=${this.element.id}], [id*=_ChartBorder], text[id*=_ChartTitle],g[id*=_chart_legend],  text[id*=_ChartSubTitle], div[id*=_Annotation], g[id*=IndicatorGroup], g[id*=_Zooming_Zoom], g[id*=_Zooming_ZoomIn], g[id*=_Zooming_ZoomOut], g[id*=_Zooming_Pan], g[id*=_Zooming_Reset], path[id*=_TrendLine_]`);
        if (currentElement) {
            currentElement.forEach((element: Node) => {
                if (element instanceof HTMLElement || element instanceof SVGElement) {
                    element.style.setProperty('outline', 'none');
                    element.style.setProperty('margin', '');
                }
            });
        }
    }
    /**
     * Handles keyboard navigation on the chart.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @param {string} targetId - The ID of the target element.
     * @param {string} actionKey - The key that determines the action to be taken.
     * @returns {void}
     * @private
     */
    public chartKeyboardNavigations(e: KeyboardEvent, targetId: string, actionKey: string): void {
        this.isLegendClicked = false;
        this.removeNavigationStyle();
        if (actionKey.indexOf('Arrow') > -1 || actionKey === 'Tab') {
            this.setNavigationStyle(targetId);
        }
        switch (actionKey) {
        case 'Tab':
        case 'ArrowMove':
            if (this.highlightModule) {
                this.highlightModule.removeLegendHighlightStyles();
            }
            if (targetId.indexOf('_Point_') > -1) {
                const seriesIndex: number = +(targetId.split('_Series_')[1].split('_Point_')[0]);
                const pointIndex: number = +(targetId.split('_Series_')[1].replace('_Symbol', '').split('_Point_')[1]);
                const pointRegion: ChartLocation = this.visibleSeries[seriesIndex as number].points[pointIndex as number].
                    symbolLocations[0];
                this.mouseX = pointRegion.x + this.initialClipRect.x - (this.visibleSeries[seriesIndex as number].type.indexOf('StackingBar') > -1 ?
                    this.visibleSeries[seriesIndex as number].marker.height / 2 : 0);
                this.mouseY = pointRegion.y + this.initialClipRect.y + (this.visibleSeries[seriesIndex as number].type.indexOf('StackingColumn') > -1 ?
                    this.visibleSeries[seriesIndex as number].marker.height / 2 : 0);
                if (this.highlightModule) {
                    this.highlightModule.highlightChart(document.getElementById(targetId), 'mousemove');
                    this.highlightModule.completeSelection(document.getElementById(targetId), 'mousemove');
                }
                if (this.tooltipModule) {
                    this.tooltipModule.tooltip();
                }
            }
            if (this.highlightModule && this.highlightMode !== 'None') {
                targetId = targetId.indexOf('_chart_legend_g_') > -1 ? document.getElementById(targetId).firstChild['id'] : targetId;
                const legendID: string = this.element.id + '_chart_legend';
                const legendItemsId: string[] = [legendID + '_text_', legendID + '_shape_marker_',
                    legendID + '_shape_'];
                for (let i: number = 0; i < legendItemsId.length; i++) {
                    const id: string = legendItemsId[i as number];
                    if (targetId.indexOf(id) > -1) {
                        document.getElementById(targetId).setAttribute('class', '');
                        this.highlightModule.legendSelection(this, parseInt(targetId.split(id)[1], 10),
                                                             document.getElementById(targetId), 'mousemove');
                        break;
                    }
                }
            }
            break;

        case 'Enter':
        case 'Space':
            if (targetId.indexOf('_chart_legend_') > -1) {
                this.isLegendClicked = true;
                this.legendModule.click(e as Event);
                this.focusChild(document.getElementById(targetId).parentElement);
                this.setNavigationStyle(document.getElementById(targetId).parentElement.id);
            } else {
                if (this.selectionModule) {
                    this.selectionModule.calculateSelectedElements(document.getElementById(targetId), 'click');
                }
                this.setNavigationStyle(targetId);
            }
            break;
        case 'CtrlP':
            this.print();
            break;
        case 'ESC':
            this.tooltipModule.removeTooltip(1);
            break;
        case 'Equal':
        case 'Minus':
            this.zoomModule.isZoomed = this.zoomModule.performedUI = true;
            this.zoomModule.isPanning = this.isChartDrag = false;
            if (actionKey === 'Equal') {
                this.zoomModule.toolkit.zoomInOutCalculation(1, this, this.axisCollections, this.zoomSettings.mode);
            }
            else {
                this.zoomModule.toolkit.zoomInOutCalculation(-1, this, this.axisCollections, this.zoomSettings.mode);
            }
            this.zoomModule.performZoomRedraw(this);
            this.element.focus();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
            const yArrowPadding: number = actionKey === 'ArrowUp' ? 10 : (actionKey === 'ArrowDown' ? -10 : 0);
            const xArrowPadding: number = actionKey === 'ArrowLeft' ? -10 : (actionKey === 'ArrowRight' ? 10 : 0);
            this.zoomModule.isPanning = this.isChartDrag = true;
            this.zoomModule.doPan(this, this.axisCollections, xArrowPadding, yArrowPadding);
            this.zoomModule.performZoomRedraw(this);
            this.element.focus();
            break;
        }
        case 'R':
            this.zoomModule.toolkit.reset(e);
            break;
        }
    }

    /**
     * Handles the mouse click on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} -  Return false.
     * @private
     */
    public chartOnMouseClick(e:  PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        const chart: Chart = this as Chart;
        this.clickCount++;
        const XYvalues: { [key: string]: number } = this.FindXYPointValue(chart.mouseX, chart.mouseY);
        let timeInterval: number = 400;
        if (this.clickCount === 1) {
            this.singleClickTimer = +setTimeout(function (): void {
                chart.clickCount = 0;
                chart.trigger(chartMouseClick, { target: element.id, x: chart.mouseX, y: chart.mouseY , axisData : XYvalues });
            }, timeInterval);
        }
        else if (this.clickCount === 2 && !this.pointDoubleClick) {
            clearTimeout(this.singleClickTimer);
            this.clickCount = 0;
        }
        const isAngular: string = 'isAngular';
        if (this[isAngular as string]) {
            const observers: string = 'observers';
            timeInterval = this.pointDoubleClick[observers as string].length > 0 ? 400 : 0;
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
        this.removeNavigationStyle();
        this.notify('click', e);
        return false;
    }
    public FindXYPointValue(mouseX: number, mouseY: number): { [key: string]: number } | null {
        if (withInBounds(mouseX, mouseY, this.chartAxisLayoutPanel.seriesClipRect)
            && this.series.some((series: Series) => series.visible)) {
            let axis: Axis;
            let Xvalue: number;
            let Yvalue: number;
            const axisData: { [key: string]: number } = {};
            for (let k: number = 0, length: number = this.axisCollections.length; k < length; k++) {
                axis = this.axisCollections[k as number];
                if (axis.orientation === 'Horizontal') {
                    Xvalue = getValueXByPoint(Math.abs(mouseX - axis.rect.x), axis.rect.width, axis);
                    axisData[this.axisCollections[k as number].name] = Xvalue;
                } else {
                    Yvalue = getValueYByPoint(Math.abs(mouseY - axis.rect.y), axis.rect.height, axis);
                    axisData[this.axisCollections[k as number].name] = Yvalue;
                }
            }
            return axisData;
        }
        return null;
    }
    private triggerPointEvent(event: string, e?: PointerEvent | TouchEvent): void {
        const evt: PointerEvent = e as PointerEvent;
        const data: ChartData = new ChartData(this);
        const pointData: PointData = data.getData();
        if (pointData.series && pointData.point) {
            this.trigger(event, {
                series: pointData.series,
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
            const currentAxis: Axis = this.axisCollections[axisIndex as number];
            if (currentAxis.visible && (axisIndex === 0 || axisIndex === 1)) {
                this.trigger(event, {
                    chart: this,
                    axis: currentAxis,
                    text: currentAxis.visibleLabels[labelIndex as number].text as string,
                    labelID: targetElement.id,
                    index: labelIndex,
                    location: new ChartLocation(clickEvt.pageX, clickEvt.pageY),
                    value: currentAxis.visibleLabels[labelIndex as number].value
                });
            }
        }
    }
    /**
     * Handles the mouse move on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} - False.
     * @private
     */
    public chartOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        const XYvalues: { [key: string]: number } = this.FindXYPointValue(this.mouseX, this.mouseY);
        this.trigger(chartMouseMove, { target: element.id, x: this.mouseX, y: this.mouseY, axisData : XYvalues });
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
        if (this.crosshair.enable && this.startMove) {
            e.preventDefault();
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
                targetId.indexOf('_AxisTitle') > -1 ? this.axisCollections[index as number].title :
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
     * Handles the mouse down on the chart.
     *
     * @param {PointerEvent} e - The mouse event.
     * @returns {boolean} - False.
     * @private
     */
    public chartOnMouseDown(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        const XYvalues: { [key: string]: number } = this.FindXYPointValue(this.mouseX, this.mouseY);
        const offset: number = Browser.isDevice ? 20 : 30;
        const rect: ClientRect = this.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
        if (this.stockChart && this.stockChart.zoomSettings.enablePan) {
            this.allowPan = true;
        }
        this.trigger(chartMouseDown, { target: element.id, x: this.mouseX, y: this.mouseY, axisData : XYvalues  });
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
     * Handles the mouse up on the chart.
     *
     * @param {PointerEvent} e - The mouse event.
     * @returns {boolean} - False.
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
     * Handles the mouse up on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} - False.
     * @private
     */
    public chartOnMouseUp(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        const XYvalues: { [key: string]: number } = this.FindXYPointValue(this.mouseX, this.mouseY);
        this.trigger(chartMouseUp, { target: element.id, x: this.mouseX, y: this.mouseY, axisData : XYvalues });
        this.isChartDrag = false;
        this.allowPan = false;
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
     * Method to set culture for chart.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * Sets the content of the annotation dynamically for the chart.
     *
     * @param {number} annotationIndex - The index of the annotation.
     * @param {string} content - The content to set for the annotation.
     * @returns {void}
     */
    public setAnnotationValue(annotationIndex: number, content: string): void {
        const parentNode: Element = getElement(this.element.id + '_Annotation_Collections');
        const annotation: ChartAnnotationSettings = <ChartAnnotationSettings>this.annotations[annotationIndex as number];
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
     * Method to set locale constants.
     *
     * @returns {void}
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
     * Theming for chart.
     *
     * @returns {void}
     */
    private setTheme(): void {
        /** Set theme */
        this.themeStyle = getThemeColor(this.theme, this.enableCanvas, this);
    }

    /**
     * Provides the array of modules needed for control rendering.
     *
     * @returns {ModuleDeclaration[]} - The array of module declarations.
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        const series: SeriesModel[] = this.series;
        let enableAnnotation: boolean = false;
        let moduleName: string; let errorBarVisible: boolean = false;
        let isPointDrag: boolean = false;
        let dataLabelEnable: boolean = false; const zooming: ZoomSettingsModel = this.zoomSettings;
        let lastValueLabelEnable: boolean = false;
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
            dataLabelEnable = value.marker.dataLabel.visible || dataLabelEnable || (value.type === 'Pareto' && value.paretoOptions.marker.dataLabel.visible);
            lastValueLabelEnable = value.lastValueLabel.enable || lastValueLabelEnable;
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
        if (this.chartAreaType !== 'PolarRadar' && this.crosshair.enable) {
            modules.push({
                member: 'Crosshair',
                args: [this]
            });
        }
        if (this.chartAreaType !== 'PolarRadar' && !this.scrollSettingEnabled && (zooming.enableSelectionZooming
            || zooming.enableMouseWheelZooming || zooming.enablePinchZooming || zooming.enablePan ||
            zooming.enableScrollbar || zooming.showToolbar)) {
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
        if (this.highlightMode !== 'None' || this.legendSettings.enableHighlight) {
            modules.push({
                member: 'Highlight',
                args: [this]
            });
        }
        if (dataLabelEnable || this.stackLabels.visible) {
            modules.push({
                member: 'DataLabel',
                args: [this, series]
            });
        }
        if (lastValueLabelEnable) {
            modules.push({
                member: 'LastValueLabel',
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
        for (const axis of axisCollections) {
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
        const indicators: TechnicalIndicatorModel[] = this.indicators;
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
            for (const indicator of this.indicators) {
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
        for (const series of this.series) {
            let markerEnable: boolean;
            series.trendlines.map((trendline: Trendline) => {
                markerEnable = markerEnable ||
                (this.getActualProperties(trendline).marker && this.getActualProperties(trendline).marker.visible);
                isLine = isLine || (trendline.type === 'Linear' || trendline.type === 'MovingAverage') ? true : false;
                isSpline = isSpline || (!isLine || (trendline.type === 'Exponential' || trendline.type === 'Logarithmic' || trendline.type === 'Power' || trendline.type === 'Polynomial')) ? true : false;
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
        for (const stripline of striplines) {
            if (stripline.visible) {
                visible = true;
                break;
            }
        }
        return visible;
    }

    /**
     * To Remove the SVG.
     *
     * @returns {void}
     * @private
     */
    public removeSvg(): void {
        if (this.redraw) {
            return null;
        }
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

        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode && !(this.stockChart)) {
                remove(this.svgObject);
            }
        }
        this.trendLineElements = null;
    }

    private refreshDefinition(definitions: Row[] | Column[]): void {
        for (const item of definitions) {
            item.axes = [];
        }
    }
    /**
     * Refresh the axis default value.
     *
     * @returns {void}
     * @private
     */
    public refreshAxis(): void {
        let axis: Axis = <Axis>this.primaryXAxis;
        axis.rect = new Rect(undefined, undefined, 0, 0 );
        axis = <Axis>this.primaryYAxis;
        axis.isStack100 = false;
        axis.rect = new Rect(undefined, undefined, 0, 0 );
        for (const item of this.axes) {
            axis = <Axis>item;
            axis.rect = new Rect(undefined, undefined, 0, 0 );
            axis.isStack100 = false;
        }
        if (this.paretoSeriesModule && this.series[0] && this.series[0].type === 'Pareto') {
            for (const item of this.paretoSeriesModule.paretoAxes) {
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
     * Gets the visible series by index.
     *
     * @param {Series[]} visibleSeries - The array of visible series.
     * @param {number} index - The index of the series to retrieve.
     * @returns {Series} - The visible series at the specified index.
     * @private
     */
    private getVisibleSeries(visibleSeries: Series[], index: number): Series {
        for (const series of visibleSeries) {
            if (index === series.index) {
                return series;
            }
        }
        return null;
    }

    /**
     * Refresh the chart for live data updates.
     *
     * @returns {void}
     */
    public refreshLiveData(): void {
        this.calculateVisibleSeries();
        this.initTechnicalIndicators();
        this.initTrendLines();
        this.refreshDefinition(<Column[]>this.columns);
        this.refreshDefinition(<Row[]>this.rows);
        this.calculateVisibleAxis();
        this.processData(false);
    }

    /**
     * To remove style element.
     *
     * @returns {void}
     */
    private removeStyles(): void {
        removeElement(this.element.id + '_ej2_chart_selection');
        removeElement(this.element.id + '_ej2_chart_highlight');
    }

    /**
     * To trigger the manual mouse move event for live chart tooltip.
     *
     * @returns {void}
     */
    private mouseMoveEvent(): void {
        if (this.tooltip.enable && this.previousPageX !== null && this.previousPageY !== null) {
            const mousemove: MouseEvent = document.createEvent('MouseEvent');
            mousemove.initMouseEvent('mousemove', true, false, window, 1, 100, 100, this.previousPageX, this.previousPageY, false, false, false, false, 0, null);
            this.element.dispatchEvent(mousemove);
        }
    }

    /**
     * Displays a tooltip for the data points.
     *
     * @param {number | string | Date} x - Specifies the x value of the point or x coordinate.
     * @param {number} y - Specifies the x value of the point or y coordinate.
     * @param {boolean} isPoint - Specifies whether x and y are data point or chart coordinates.
     * @returns {void}
     */
    public showTooltip(x: number | string | Date, y: number, isPoint: boolean = false): void {
        if (isPoint) {
            for (const series of this.visibleSeries) {
                for (const point of series.points) {
                    const pointX: any = series.xAxis.valueType === 'DateTime' ? point.xValue : point.x;
                    let xValue: any = x;
                    if (series.xAxis.valueType === 'DateTime') {
                        xValue = new Date(xValue).getTime();
                    }
                    if (x === pointX && y === point.yValue) {
                        this.mouseX = point.regions[0].x + this.chartAxisLayoutPanel.seriesClipRect.x;
                        this.mouseY = point.regions[0].y + this.chartAxisLayoutPanel.seriesClipRect.y;
                        this.tooltipModule.tooltip();
                        this.markerRender.mouseMoveHandler();
                        break;
                    }
                }
            }
        } else {
            if (this.isTouch) { this.startMove = true; }
            this.mouseX = x as number;
            this.mouseY = y;
            this.tooltipModule.mouseMoveHandler();
            this.markerRender.mouseMoveHandler();
        }
    }

    /**
     * Hides a tooltip in the chart.
     *
     * @returns {void}
     */
    public hideTooltip(): void {
        this.tooltipModule.removeTooltip(Browser.isDevice ? 2000 : 1000);
    }

    /**
     * Displays a crosshair for the chart.
     *
     * @param {number} x - Specifies the x value of the point or x coordinate.
     * @param {number} y - Specifies the x value of the point or y coordinate.
     * @returns {void}
     */
    public showCrosshair(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
        this.isCrosshair = false;
        if (withInBounds(this.mouseX, this.mouseY, this.chartAxisLayoutPanel.seriesClipRect)) {
            this.crosshairModule.crosshair();
        } else {
            this.hideCrosshair();
        }
        this.isCrosshair = true;
    }

    /**
     * Hides a tooltip in the chart.
     *
     * @returns {void}
     */
    public hideCrosshair(): void {
        this.crosshairModule.removeCrosshair(Browser.isDevice ? 2000 : 1000);
    }

    /**
     * Method to sanitize any potentially untrusted strings and scripts before rendering them.
     *
     * @param {string} value - Specifies the html value to sanitize
     * @returns {string} Returns the sanitized html string
     * @private
     */
    public sanitize(value: string): string {
        if (this.enableHtmlSanitizer) {
            return SanitizeHtmlHelper.sanitize(value);
        }
        return value;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {ChartModel} newProp - The new ChartModel.
     * @param {ChartModel} oldProp - The new ChartModel.
     * @returns {void}
     */
    public onPropertyChanged(newProp: ChartModel, oldProp: ChartModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        this.animateSeries = false;
        let axis: Axis;
        let axisChange: boolean = false;
        let isZooming: boolean = false;
        if (!this.delayRedraw && !this.zoomRedraw) {
            for (const prop of Object.keys(newProp)) {
                axisChange = axisChange || (prop !== 'primaryXAxis' && prop !== 'primaryYAxis' && prop !== 'axes');
                if (isZooming && axisChange) {
                    this.redraw = false;
                }
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
                    if (newProp.primaryXAxis.scrollbarSettings) {
                        refreshBounds = true;
                    }
                    if (!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                        (this.primaryXAxis as Axis).setIsInversedAndOpposedPosition();
                    }
                    if ((!(this.primaryXAxis as Axis).zoomingScrollBar || !((this.primaryXAxis as Axis).zoomingScrollBar.isScrollUI)) &&
                    this.zoomModule && (!isNullOrUndefined(axis.zoomFactor) || !isNullOrUndefined(axis.zoomPosition))) {
                        this.redraw = this.zoomSettings.enableAnimation && !axisChange;
                        isZooming = this.zoomSettings.enableAnimation && !axisChange;
                    }
                    if (newProp.primaryXAxis.crosshairTooltip) {
                        if (!newProp.primaryXAxis.crosshairTooltip.enable) {
                            removeElement(this.element.id + '_axis_tooltip_0');
                            removeElement(this.element.id + '_axis_tooltip_text_0');
                        }
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
                    if (newProp.primaryYAxis.scrollbarSettings) {
                        refreshBounds = true;
                    }
                    if (!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                        (this.primaryYAxis as Axis).setIsInversedAndOpposedPosition();
                    }
                    if ((!(this.primaryYAxis as Axis).zoomingScrollBar || !((this.primaryYAxis as Axis).zoomingScrollBar.isScrollUI)) &&
                    this.zoomModule && (!isNullOrUndefined(axis.zoomFactor) || !isNullOrUndefined(axis.zoomPosition))) {
                        this.redraw = this.zoomSettings.enableAnimation && !axisChange;
                        isZooming = this.zoomSettings.enableAnimation && !axisChange;
                    }
                    if (newProp.primaryYAxis.crosshairTooltip) {
                        if (!newProp.primaryYAxis.crosshairTooltip.enable) {
                            removeElement(this.element.id + '_axis_tooltip_1');
                            removeElement(this.element.id + '_axis_tooltip_text_1');
                        }
                    }
                    break;
                case 'axes':
                    for (const index of Object.keys(newProp.axes)) {
                        axis = newProp.axes[index as string] as Axis;
                        refreshBounds = refreshBounds || this.axisChange(axis);
                        if (!axis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        if (axis.scrollbarSettings) {
                            refreshBounds = true;
                        }
                        if (!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                            (this.axes[index as string] as Axis).setIsInversedAndOpposedPosition();
                        }
                        if ((!this.axes[index as string].zoomingScrollBar || !(this.axes[index as string].zoomingScrollBar.isScrollUI)) &&
                        this.zoomModule && (!isNullOrUndefined(axis.zoomFactor) || !isNullOrUndefined(axis.zoomPosition))) {
                            this.redraw = this.zoomSettings.enableAnimation && !axisChange;
                            isZooming = this.zoomSettings.enableAnimation && !axisChange;
                        }
                        if (axis.crosshairTooltip) {
                            if (!axis.crosshairTooltip.enable) {
                                removeElement(this.element.id + '_axis_tooltip_' + (this.axes[index as string] as Axis).index);
                                removeElement(this.element.id + '_axis_tooltip_text_' + (this.axes[index as string] as Axis).index);
                            }
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
                    if (newProp.titleStyle && (newProp.titleStyle.size || newProp.titleStyle.textOverflow || newProp.titleStyle.position)) {
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
                case 'series': {
                    const len: number = this.series.length;
                    let seriesRefresh: boolean = false;
                    let series: SeriesModel;
                    for (let i: number = 0; i < len; i++) {
                        series = newProp.series[i as number];
                        // I264774 blazor series visible property binding not working issue fixed.
                        if (!isNullOrUndefined(series) && series.lastValueLabel && this.series[i as number]
                            .lastValueLabel.enable && this.lastValueLabelModule) {
                            this.lastValueLabelCollections = [];
                            const updatedLabelSettings: LastValueLabelSettingsModel = extend(
                                this.series[i as number].lastValueLabel, series.lastValueLabel);
                            this.lastValueLabelModule.render(this.series[i as number] as Series
                                , this, updatedLabelSettings, true);
                            if ((this.series[i as number] as Series).lastValueLabelElement) {
                                appendChildElement(this.enableCanvas, this.lastValueLabelElements
                                    , (this.series[i as number] as Series).lastValueLabelElement, true);
                            }
                        }
                        else if (!isNullOrUndefined(series) && series.lastValueLabel
                            && !series.lastValueLabel.enable && (this.series[i as number] as Series)
                            && (this.series[i as number] as Series).lastValueLabelElement) {
                            removeElement((this.series[i as number] as Series).lastValueLabelElement.id);
                            (this.series[i as number] as Series).lastValueLabelElement = null;
                        }
                        if (!isNullOrUndefined(series) && (series.dataSource || series.query || series.errorBar || series.xName ||
                            series.yName || series.size || series.high || series.low || series.open || series.close || series.trendlines ||
                            series.fill || series.name || series.marker || series.width || series.binInterval || series.type ||
                            (series.visible !== oldProp.series[i as number].visible) ||
                            series.legendShape || series.emptyPointSettings || series.opacity ||
                            series.columnWidth || series.columnSpacing || series.opacity || series.dashArray ||
                            series.bearFillColor || series.bullFillColor)) {
                            extend(this.getVisibleSeries(this.visibleSeries, i), series, null, true);
                            seriesRefresh = true;
                        }
                    }
                    if (seriesRefresh) {
                        this.calculateAreaType();
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
                }
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
                    } else if (this.highlightModule) {
                        this.highlightModule.currentMode = this.highlightMode;
                        this.highlightModule.highlightDataIndexes = this.selectedDataIndexes as Indexes[];
                        this.highlightModule.styleId = this.element.id + '_ej2_chart_highlight';
                        this.highlightModule.redrawSelection(this, oldProp.selectionMode, true);
                    }
                    break;
                case 'selectionMode':
                    if (this.selectionModule && newProp.selectionMode && newProp.selectionMode.indexOf('Drag') === -1) {
                        this.selectionModule.currentMode = this.selectionMode;
                        if (oldProp.selectionMode === 'None') {
                            this.selectionModule.invokeSelection(this);
                        }
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
                case 'enableRtl':
                case 'locale':
                case 'currencyCode':
                    this.refresh();
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
                this.trigger('loaded', { chart: this });
            }
            if (refreshBounds) {
                if (this.enableCanvas) {
                    this.createChartSvg();
                }
                else {
                    this.removeSvg();
                }
                // this.enableCanvas ? this.createChartSvg() : this.removeSvg();
                if ((this as any).isReact) { this.clearTemplate(); }
                this.dragY = null;
                this.refreshAxis();
                this.refreshBound();
                this.trigger('loaded', { chart: this });
                this.redraw = false;
                this.animated = false;
            }
        }
        this.zoomRedraw = false;
    }
}

export interface borderOption {
    id: string;
    x: number;
    y: number;
    rx: any;
    ry: any;
    width: number;
    height: number;
    fill: any;
    'stroke-width': number;
    stroke: any;
    transform: string;
    d: string;
}

export interface border {
    id: string;
    x: number;
    y: number;
    rx: any;
    ry: any;
    width: number;
    height: number;
    fill: any;
    'stroke-width': any;
    stroke: any;
    transform: string;
    d: string;
}
