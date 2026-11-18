import { Component, INotifyPropertyChanged, Property, Complex, Collection, Internationalization, NotifyPropertyChanges, ModuleDeclaration, SanitizeHtmlHelper, getValue, extend, setValue, AnimationOptions } from '@syncfusion/ej2-base';
import { Browser, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { StockChartModel } from './stock-chart-model';
import { Chart, ZoomSettings, CrosshairSettings } from '../chart/chart';
import { ZoomSettingsModel, CrosshairSettingsModel } from '../chart/chart-model';
import { appendChildElement, redrawElement, titlePositionX, textElement } from '../common/utils/helper';
import { Axis } from '../chart/axis/axis';
import { Series } from '../chart/series/chart-series';
import { Size, Rect, TextOption, measureText, SvgRenderer, TextMeasureCache, removeElement } from '@syncfusion/ej2-svg-base';
import { ITooltipRenderEventArgs, IMouseEventArgs, IPointEventArgs } from '../chart/model/chart-interface';
import { IRangeSelectorRenderEventArgs } from '../range-navigator/model/range-navigator-interface';
import { IAxisLabelRenderEventArgs, ISeriesRenderEventArgs, IZoomingEventArgs  } from '../chart/model/chart-interface';
import { StockTooltipSettingsModel, PeriodsModel } from '../common/model/base-model';
import { calculateSize, getElement } from '../common/utils/helper';
import { RangeNavigator } from '../range-navigator/range-navigator';
import { getRangeValueXByPoint } from '../range-navigator/utils/helper';
import { PeriodSelector } from '../common/period-selector/period-selector';
import { CartesianChart } from './renderer/cartesian-chart';
import { RangeSelector } from './renderer/range-selector';
import { ToolBarSelector } from './renderer/toolbar-selector';
import { StockMargin, StockChartArea, StockChartAxis, StockChartRow, StockChartIndexes, StockEventsSettings, IStockLegendRenderEventArgs, IStockLegendClickEventArgs, IBeforeIndicatorChangeEventArgs, IIndicatorChangedEventArgs } from './model/base';
import { TechnicalIndicator } from '../chart/technical-indicators/technical-indicator';
import { Points } from '../chart/series/chart-series';
import { StockSeries, IStockChartEventArgs, StockChartIndicator, StockChartBorder, IRangeChangeEventArgs } from './model/base';
import { StockChartAnnotationSettings, IStockEventRenderArgs } from './model/base';
import { StockChartAnnotationSettingsModel } from './model/base-model';
import { StockChartFont } from './model/base';
import { StockSeriesModel, StockChartIndicatorModel, StockChartAxisModel, StockChartRowModel } from './model/base-model';
import { StockChartIndexesModel, StockChartFontModel, StockChartAreaModel, StockEventsSettingsModel } from './model/base-model';
import { StockChartBorderModel, StockMarginModel } from './model/base-model';
import { ChartSeriesType, TrendlineTypes, TechnicalIndicators} from '../chart/utils/enum';
import { ChartTheme, SelectionMode, ValueType } from '../common/utils/enum';
import { IExportEventArgs } from '../common/model/interface';
import { ExportType, Alignment } from '../common/utils/enum';
import { getSeriesColor, getThemeColor } from '../common/model/theme';
import { StockEvents } from './renderer/stock-events';
import { IThemeStyle } from '../chart/model/chart-interface';
import { StockChartLegendSettingsModel } from './legend/legend-model';
import { StockLegend, StockChartLegendSettings } from './legend/legend';
import { ColumnSeries, firstToLowerCase, RangeAreaSeries, SeriesModel, SplineRangeAreaSeries } from './index';
import { VisibleRangeModel, ICrosshairLabelRenderEventArgs  } from '../common/model/interface';
import { Periods, StockTooltipSettings } from '../common/model/base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createTemplate, applyGradientsToSeries } from '../common/utils/helper';
import { Animation as EjsAnimation, createElement } from '@syncfusion/ej2-base';
import { RangeNavigatorSeries } from '../range-navigator';

/**
 * Stock Chart
 *
 * @public
 */
@NotifyPropertyChanges
export class StockChart extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Module Declaration of Stockchart.
    /**
     * `legendModule` is used to manipulate and add legend to the Stockchart.
     */
    public stockLegendModule: StockLegend;

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
     * The width of the stockChart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full width of its parent element.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the stockChart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full height of its parent element.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Specifies the DataSource for the stockChart. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='financial'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let financial: stockChart = new stockChart({
     * ...
     *  dataSource:dataManager,
     *   series: [{
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * financial.appendTo('#financial');
     * ```
     *
     * @default ''
     */

    @Property('')
    public dataSource: Object | DataManager;



    /**
     *  Options to customize left, right, top and bottom margins of the stockChart.
     */

    @Complex<StockMarginModel>({}, StockMargin)
    public margin: StockMarginModel;

    /**
     * Options for customizing the color and width of the stockChart border.
     */

    @Complex<StockChartBorderModel>({ color: '#DDDDDD', width: 1 }, StockChartBorder)
    public border: StockChartBorderModel;

    /**
     * The background color of the stockChart that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Specifies the theme for the stockChart.
     *
     * @default 'Material'
     */

    @Property('Material')
    public theme: ChartTheme;

    /**
     * Options to configure the horizontal axis.
     */

    @Complex<StockChartAxisModel>({ name: 'primaryXAxis', valueType: 'DateTime' as ValueType }, StockChartAxis)
    public primaryXAxis: StockChartAxisModel;

    /**
     * Options for configuring the border and background of the stockChart area.
     */

    @Complex<StockChartAreaModel>({ border: { color: null, width: 0.5 }, background: 'transparent' }, StockChartArea)
    public chartArea: StockChartAreaModel;

    /**
     * Options to configure the vertical axis.
     */

    @Complex<StockChartAxisModel>({ name: 'primaryYAxis', opposedPosition: true, labelPosition: 'Inside', tickPosition: 'Inside' }, StockChartAxis)
    public primaryYAxis: StockChartAxisModel;


    /**
     * Options to split stockChart into multiple plotting areas horizontally.
     * Each object in the collection represents a plotting area in the stockChart.
     */

    @Collection<StockChartRowModel>([{}], StockChartRow)
    public rows: StockChartRowModel[];

    /**
     * Secondary axis collection for the stockChart.
     */

    @Collection<StockChartAxisModel>([{ opposedPosition: true }], StockChartAxis)
    public axes: StockChartAxisModel[];

    /**
     * The configuration for series in the stockChart.
     */

    @Collection<StockSeriesModel>([], StockSeries)
    public series: StockSeriesModel[];

    /**
     * The configuration for stock events in the stockChart.
     */

    @Collection<StockEventsSettingsModel>([], StockEventsSettings)
    public stockEvents: StockEventsSettingsModel[];


    /**
     * It specifies whether the stockChart should be render in transposed manner or not.
     *
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * Title of the chart
     *
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the title of the Chart.
     */

    @Complex<StockChartFontModel>({ size: null, fontWeight: null, color: null, fontStyle: null, fontFamily: null }, StockChartFont)
    public titleStyle: StockChartFontModel;
    /**
     * Defines the collection of technical indicators, that are used in financial markets.
     */
    @Collection<StockChartIndicatorModel>([], StockChartIndicator)
    public indicators: StockChartIndicatorModel[];
    /**
     * Options for customizing the tooltip of the chart.
     */

    @Complex<StockTooltipSettingsModel>({ shared: true, enableMarker: false }, StockTooltipSettings)
    public tooltip: StockTooltipSettingsModel;


    /**
     * Options for customizing the crosshair of the chart.
     */
    @Complex<CrosshairSettingsModel>({ dashArray: '5', lineType: 'Vertical'}, CrosshairSettings)
    public crosshair: CrosshairSettingsModel;

    /**
     * Options for customizing the legend of the stockChart.
     */
    @Complex<StockChartLegendSettingsModel>({}, StockChartLegendSettings)
    public legendSettings: StockChartLegendSettingsModel;

    /**
     * Options to enable the zooming feature in the chart.
     */
    @Complex<ZoomSettingsModel>({enablePan: true}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;

    /**
     * It specifies whether the periodSelector to be rendered in financial chart
     *
     * @default true
     */
    @Property(true)
    public enablePeriodSelector: boolean;

    /**
     * Custom Range
     *
     * @default true
     */
    @Property(true)
    public enableCustomRange: boolean;

    /**
     * If set true, enables the animation in chart.
     *
     * @default false
     */
    @Property(false)
    public isSelect: boolean;

    /**
     * It specifies whether the range navigator to be rendered in financial chart
     *
     * @default true
     */
    @Property(true)
    public enableSelector: boolean;

    /**
     * To configure period selector options.
     */
    @Collection<PeriodsModel>([], Periods)
    public periods: PeriodsModel[];

    /**
     * The configuration for annotation in chart.
     */

    @Collection<StockChartAnnotationSettingsModel>([{}], StockChartAnnotationSettings)
    public annotations: StockChartAnnotationSettingsModel[];

    /**
     * Triggers before render the selector
     *
     * @event selectorRender
     * @deprecated
     */
    @Event()
    public selectorRender: EmitType<IRangeSelectorRenderEventArgs>;

    /**
     * Triggers on hovering the stock chart.
     *
     * @event stockChartMouseMove
     * @blazorProperty 'OnStockChartMouseMove'
     */

    @Event()
    public stockChartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers when cursor leaves the chart.
     *
     * @event stockChartMouseLeave
     * @blazorProperty 'OnStockChartMouseLeave'
     */

    @Event()
    public stockChartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     *
     * @event stockChartMouseDown
     * @blazorProperty 'OnStockChartMouseDown'
     */

    @Event()
    public stockChartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     *
     * @event stockChartMouseUp
     * @blazorProperty 'OnStockChartMouseUp'
     */

    @Event()
    public stockChartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the stock chart.
     *
     * @event stockChartMouseClick
     * @blazorProperty 'OnStockChartMouseClick'
     */

    @Event()
    public stockChartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point click.
     *
     * @event pointClick
     * @blazorProperty 'OnPointClick'
     */

    @Event()
    public pointClick: EmitType<IPointEventArgs>;

    /**
     * Triggers on point move.
     *
     * @event pointMove
     * @blazorProperty 'PointMoved'
     */

    @Event()
    public pointMove: EmitType<IPointEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     *
     * @event onZooming
     */
    @Event()
    public onZooming: EmitType<IZoomingEventArgs>;

    /**
     * Triggers before the legend is rendered.
     *
     * @event legendRender
     * @deprecated
     */
    @Event()
    public legendRender: EmitType<IStockLegendRenderEventArgs>;

    /**
     * Triggers after click on legend.
     *
     * @event legendClick
     */
    @Event()
    public legendClick: EmitType<IStockLegendClickEventArgs>;

    /**
     * Triggers before an indicator add/remove mutation is applied.
     *
     * This event is cancelable. Set the `cancel` property to `true` to prevent the mutation.
     *
     * @event beforeIndicatorChange
     */
    @Event()
    public beforeIndicatorChange: EmitType<IBeforeIndicatorChangeEventArgs>;

    /**
     * Triggers after an indicator add/remove mutation has been successfully applied. This event is not triggered when beforeIndicatorChange event is cancelled.
     *
     * @event indicatorChanged
     */
    @Event()
    public indicatorChanged: EmitType<IIndicatorChangedEventArgs>;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
     * * dragX: selects points by dragging with respect to horizontal axis.
     * * dragY: selects points by dragging with respect to vertical axis.
     *
     * @default None
     */
    @Property('None')
    public selectionMode: SelectionMode;

    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     *
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * Triggers before the range navigator rendering.
     *
     * @event load
     */
    @Event()
    public load: EmitType<IStockChartEventArgs>;

    /**
     * Triggers after the range navigator rendering.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<IStockChartEventArgs>;

    /**
     * Triggers if the range is changed
     *
     * @event rangeChange
     * @blazorProperty 'RangeChange'
     */
    @Event()
    public rangeChange: EmitType<IRangeChangeEventArgs>;

    /**
     * Triggers before each axis label is rendered.
     *
     * @event axisLabelRender
     * @deprecated
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before the export process begins. This event allows for the customization of export settings before the chart is exported.
     *
     * @event beforeExport
     *
     */
    @Event()
    public beforeExport: EmitType<IExportEventArgs>;

    /**
     * Triggers before the tooltip for series is rendered.
     *
     * @event tooltipRender
     * @deprecated
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the crosshairtooltip for the series is rendered.
     *
     * @event crosshairLabelRender
     */

    @Event()
    public crosshairLabelRender: EmitType<ICrosshairLabelRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     *
     * @event seriesRender
     * @deprecated
     */

    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     *
     * @event stockEventRender
     * @deprecated
     */
    @Event()
    public stockEventRender: EmitType<IStockEventRenderArgs>;


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
     *
     * @default []
     */
    @Collection<StockChartIndexesModel>([], StockChartIndexes)
    public selectedDataIndexes: StockChartIndexesModel[];

    /**
     * It specifies the types of series in financial chart.
     */
    @Property([])
    public seriesType: ChartSeriesType[];

    /**
     * It specifies the types of indicators in financial chart.
     */
    @Property(['EMA', 'TMA', 'SMA', 'Momentum', 'ATR', 'Accumulation Distribution', 'Bollinger Bands', 'MACD', 'Stochastic', 'RSI'])
    public indicatorType: TechnicalIndicators[];

    /**
     * It specifies the types of Export types in financial chart.
     */
    @Property(['PNG', 'JPEG', 'SVG', 'PDF', 'XLSX', 'CSV', 'Print'])
    public exportType: ExportType[];

    /**
     * It specifies the types of trendline types in financial chart.
     */
    @Property([])
    public trendlineType: TrendlineTypes[];

    /**
     * Gets the current visible series of the Chart.
     *
     * @hidden
     */
    public visibleSeries: Series[];

    /** @private */
    public startValue: number;
    /** @private */
    public isSingleAxis: boolean = false;
    /** @private */
    public endValue: number;
    /** @private */
    public seriesXMax: number;
    /** @private */
    public seriesXMin: number;
    /** @private  */
    public currentEnd: number;
    /** Overall SVG */
    public mainObject: Element;
    /** @private */
    public selectorObject: Element;
    /** @private */
    public chartObject: Element;
    /** @private */
    public svgObject: Element;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public animateSeries: boolean;
    /** @private */
    public availableSize: Size;
    /** @private */
    public titleSize: Size;
    /** @private */
    public chartSize: Size;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public isDoubleTap: boolean;
    /** @private */
    private threshold: number;
    /** @private */
    public isChartDrag: boolean;
    public resizeTo: number;
    /** @private */
    public disableTrackTooltip: boolean;
    /** @private */
    public startMove: boolean;
    /** @private */
    public yAxisElements: Element;
    /** @private */
    public themeStyle: IThemeStyle;
    /** @private */
    public scrollElement: Element;
    private chartid: number = 57723;
    public tempSeriesType: ChartSeriesType[] = [];
    /** @private */
    public chart: Chart;
    /** @private */
    public rangeNavigator: RangeNavigator;
    /** @private */
    public periodSelector: PeriodSelector;
    /** @private */
    public cartesianChart: CartesianChart;
    /** @private */
    public rangeSelector: RangeSelector;
    /** @private */
    public toolbarSelector: ToolBarSelector;
    /** @private */
    public stockEvent: StockEvents;
    /** private */
    public zoomChange: boolean = false;
    /** @private */
    public mouseDownX: number;
    /** @private */
    public mouseDownY: number;
    /** @private */
    public previousMouseMoveX: number;
    /** @private */
    public previousMouseMoveY: number;
    /** @private */
    public mouseDownXPoint: number;
    /** @private */
    public mouseUpXPoint: number;
    /** @private */
    public allowPan: boolean = false;
    /** @private  */
    public onPanning: boolean = false;
    /** @private  */
    public referenceXAxis: Axis;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /** @private */
    public indicatorElements: Element;
    /** @private */
    public trendlinetriggered: boolean = true;
    /** @private */
    public periodSelectorHeight: number;
    /** @private */
    public toolbarHeight: number;
    /** @private */
    public stockChartTheme: IThemeStyle;
    /** @private */
    public initialRender: boolean = true;
    /** @private */
    public rangeFound: boolean = false;
    /** @private */
    public tempPeriods: PeriodsModel[] = [];
    /** @private */
    public legend: StockLegend;
    /** @private */
    public visibleSeriesCount: number;
    /** @private */
    public redraw: boolean;
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public legendClicked: boolean;
    /** @private */
    public tempAvailableSize: Size;
    /** @private */
    public mouseMoveEvent: PointerEvent;
    public isDateTimeCategory: boolean = false;
    public sortedData: number[] = [];
    private visibleRange: VisibleRangeModel = {
        min: 0, max: 0,
        delta: 0, interval: 0
    };
    /** @private */
    public isStockChartRendered: boolean = false;
    /** @private */
    public isLivePointUpdate: boolean = false;
    /** @private */
    public isManualSliderRange: boolean = false;
    /** @private */
    public activeSelectionMethod: string = 'period';
    /** @private */
    public savedZoomStart: number | null = null;
    /** @private */
    public savedZoomEnd: number | null = null;
    /** @private */
    public savedDatePickerStart: number | null = null;
    /** @private */
    public savedDatePickerEnd: number | null = null;
    /** @private */
    public savedSliderStart: number | null = null;
    /** @private */
    public savedSliderEnd: number | null = null;
    /** @private */
    public draggedSliderType: string | null = null;
    /** @private */
    public manualSliderChanged: boolean = false;
    /** @private */
    public isUserZoomed: boolean = false;
    /** @private */
    isDatePickerRangeSet: boolean = false;
    /** @private */
    isPeriodSelectorChange: boolean = false;
    /** @private */
    public liveScrollAnimationId: number = 0;
    /** @private */
    private liveScrollAnimationCleanup:
    (() => void) | null = null;



    /**
     * Constructor for creating the widget.
     *
     * @param {StockChartModel} options - Specifies the stock chart model.
     * @param {string | HTMLElement} element - Specifies the element for the stock chart.
     * @hidden
     */
    constructor(options?: StockChartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        StockChart.Inject(ColumnSeries, RangeAreaSeries, SplineRangeAreaSeries);
        this.toolbarHeight = this.enablePeriodSelector ? (Browser.isDevice ? 56 : 42) : 0;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {StockChartModel} newProp - The new StockChartModel.
     * @returns {void}
     */
    public onPropertyChanged(newProp: StockChartModel): void {
        // on property changes
        for (const property of Object.keys(newProp)) {
            switch (property) {
            case 'series':
                this.storeDataSource();
                this.chartRender();
                this.stockChartDataManagerSuccess();
                this.legendClicked = false;
                break;
            case 'locale':
            case 'enableRtl':
                super.refresh();
            }
        }
    }
    /**
     * To change the range for chart.
     *
     * @param {number} updatedStart - The updated start value for the chart range.
     * @param {number} updatedEnd - The updated end value for the chart range.
     * @returns {void}
     */
    public rangeChanged(
        updatedStart: number,
        updatedEnd: number
    ): void {
        const chartElement: Element =
        document.getElementById(this.chartObject.id) as Element;

        if (chartElement) {
            while (chartElement.firstChild) {
                chartElement.removeChild(
                    chartElement.firstChild
                );
            }
        }

        // Keep the right slider at the rightmost position (latest data)
        // Only update the start to show the selected period range
        const rightmostEnd: number = this.isDateTimeCategory
            ? (this.sortedData.length - 1)
            : (this.rangeNavigator ? this.rangeNavigator.endValue : this.endValue);

        this.startValue = updatedStart;
        this.endValue = updatedEnd;
        this.isDatePickerRangeSet = false;
        this.savedDatePickerStart = null;
        this.savedDatePickerEnd = null;
        this.isUserZoomed = false;
        this.savedZoomStart = null;
        this.savedZoomEnd = null;

        this.cartesianChart.initializeChart();

        // Animate the slider - left moves, right stays at end
        if (this.enableSelector && this.rangeNavigator && this.rangeNavigator.rangeSlider) {
            const animationDuration: number = 500;
            this.rangeNavigator.rangeSlider.performLiveAnimation(
                this.startValue,
                this.startValue,
                this.endValue,
                this.rangeNavigator,
                animationDuration
            );
        }

        this.periodSelector.datePicker.startDate =
        this.isDateTimeCategory
            ? new Date(this.sortedData[updatedStart as number])
            : new Date(updatedStart);

        this.periodSelector.datePicker.endDate =
        this.isDateTimeCategory
            ? new Date(this.sortedData[rightmostEnd as number])
            : new Date(rightmostEnd);

        this.periodSelector.datePicker.dataBind();
    }

    /**
     * Smoothly updates the existing final data point in the
     * specified StockChart series.
     *
     * This method does not add a new point. The x-value of the
     * supplied point must match the x-value of the current final
     * point in the complete StockChart data source.
     *
     * @param {Object} dataPoint - Specifies the updated data point.
     * @param {number} seriesIndex - Specifies the StockChart series index.
     * @param {number} duration - Specifies the optional animation duration.
     * @returns {void}
     *
     * @public
     */
    public setData(
        dataPoint: Object,
        seriesIndex: number,
        duration?: number
    ): void {

        const stockSeries: StockSeries =
            this.series[seriesIndex as number] as StockSeries;

        const chartSeries: Series =
            this.chart.series[seriesIndex as number] as Series;

        const xName: string =
            stockSeries.xName as string;


        /*
         * Complete historical StockChart data.
         *
         * This may contain 3M, 6M, 1Y, or all available
         * historical data.
         */
        const completeData: Object[] | null =
            this.getCompleteSeriesData(
                stockSeries
            );

        const completeLastIndex: number =
            completeData.length - 1;

        const existingPoint: Object =
            completeData[
                completeLastIndex as number
            ];

        const existingTime: number =
            this.getDataPointTime(
                existingPoint,
                xName
            );

        const incomingTime: number =
            this.getDataPointTime(
                dataPoint,
                xName
            );


        /*
         * Normalize the animation duration.
         */
        const numericDuration: number =
            Number(duration);

        const animationDuration: number =
            duration === null ||
                duration === undefined
                ? 300
                : (
                    isFinite(numericDuration)
                        ? Math.max(
                            numericDuration,
                            0
                        )
                        : 0
                );

        const updatedPoint: Object = extend(
            {},
            existingPoint,
            dataPoint,
            true
        );

        /*
         * Preserve the exact existing x-value representation.
         *
         * This supports both simple and complex xName mappings.
         */
        setValue(
            xName,
            getValue(
                xName,
                existingPoint
            ),
            updatedPoint
        );

        /*
         * Resolve the currently selected StockChart range.
         */
        let selectedStart: number =
            Number(this.startValue);

        let selectedEnd: number =
            Number(this.endValue);

        /*
         * Prefer the Range Navigator's actual slider values.
         *
         * For example, if 1M is selected, these values
         * represent that selected one-month window.
         */
        if (
            this.enableSelector &&
            this.rangeNavigator &&
            this.rangeNavigator.rangeSlider
        ) {
            const sliderStart: number =
                Number(
                    this.rangeNavigator
                        .rangeSlider
                        .currentStart
                );

            const sliderEnd: number =
                Number(
                    this.rangeNavigator
                        .rangeSlider
                        .currentEnd
                );

            if (
                !isNaN(sliderStart) &&
                !isNaN(sliderEnd) &&
                sliderEnd >= sliderStart
            ) {
                selectedStart =
                    sliderStart;

                selectedEnd =
                    sliderEnd;
            }
        }

        /*
         * Build only the currently selected visible data.
         *
         * Example:
         *
         * completeData = 90 days
         * selected period = 1M
         * visibleData = approximately 30 days
         */
        let visibleData: Object[] = [];

        if (
            !isNaN(selectedStart) &&
            !isNaN(selectedEnd) &&
            selectedEnd >= selectedStart
        ) {
            visibleData =
                this.getLiveVisibleData(
                    completeData,
                    stockSeries,
                    selectedStart,
                    selectedEnd
                );
        }
        visibleData = visibleData.slice();

        /*
         * Find the latest complete point inside the currently
         * selected visible window.
         *
         * When the user is viewing an older custom range,
         * the latest complete point may not be visible.
         */
        let visiblePointIndex: number = -1;

        for (
            let pointIndex: number =
                visibleData.length - 1;
            pointIndex >= 0;
            pointIndex--
        ) {
            const visibleTime: number =
                this.getDataPointTime(
                    visibleData[
                        pointIndex as number
                    ],
                    xName
                );

            if (
                !isNaN(visibleTime) &&
                visibleTime === existingTime
            ) {
                visiblePointIndex =
                    pointIndex;

                break;
            }
        }

        /*
         * Replace only the matching point in the copied
         * selected-range data.
         */
        visibleData[
            visiblePointIndex as number
        ] =
            updatedPoint;

        /*
         * Verify that the internal Chart currently contains
         * the same selected visible window.
         */
        let chartDataSource: Object[] = chartSeries.dataSource as Object[];

        let sameVisibleWindow: boolean =
            chartDataSource.length ===
            visibleData.length;

        if (sameVisibleWindow) {
            for (
                let compareIndex: number = 0;
                compareIndex <
                visibleData.length;
                compareIndex++
            ) {
                const chartPointTime: number =
                    this.getDataPointTime(
                        chartDataSource[
                            compareIndex as number
                        ],
                        xName
                    );

                const visiblePointTime: number =
                    this.getDataPointTime(
                        visibleData[
                            compareIndex as number
                        ],
                        xName
                    );

                if (
                    isNaN(chartPointTime) ||
                    isNaN(visiblePointTime) ||
                    chartPointTime !==
                    visiblePointTime
                ) {
                    sameVisibleWindow =
                        false;

                    break;
                }
            }
        }

        /*
         * If the internal Chart contains a different visible
         * window, rebuild it before calling Series.setData().
         *
         * Use the old point here so Series.setData() can later
         * compare old OHLC values against updatedPoint.
         */
        if (
            !sameVisibleWindow
        ) {
            const originalVisibleData: Object[] =
                visibleData.slice();

            originalVisibleData[
                visiblePointIndex as number
            ] =
                existingPoint;

            /*
             * updateLiveWindow() replaces the internal
             * Chart datasource.
             */
            chartDataSource =
                Array.isArray(
                    chartSeries.dataSource
                )
                    ? chartSeries
                        .dataSource as Object[]
                    : [];

        }
        chartSeries.currentData = [];

        for (
            let dataIndex: number = 0;
            dataIndex <
            chartDataSource.length;
            dataIndex++
        ) {
            const sourcePoint: Object =
                chartDataSource[
                    dataIndex as number
                ];

            const sourceXValue: Object =
                getValue(
                    xName,
                    sourcePoint
                );

            if (
                sourceXValue instanceof Date
            ) {
                chartSeries.currentData.push(
                    sourceXValue.getTime()
                );
            } else {
                chartSeries.currentData.push(
                    sourceXValue as number | string
                );
            }
        }

        this.isLivePointUpdate = true;

        /*
         * Important:
         *
         * Pass only visibleData to Chart Series.setData().
         *
         * If 1M is selected, this array contains only the
         * selected one-month data window.
         *
         * completeData and the StockChart backing data still
         * contain the old OHLC values at this point, allowing
         * Series.setData() to detect the changed candle.
         */
        chartSeries.setData(
            visibleData,
            animationDuration
        );

        /*
         * Update technical indicators using the updated
         * visible source series.
         */
        if (
            typeof this.updateLiveIndicators ===
            'function'
        ) {
            this.updateLiveIndicators(
                chartSeries
            );
        }

        /*
         * Update complete backing data only after the
         * internal Chart has processed the change.
         */
        completeData[
            completeLastIndex as number
        ] =
            updatedPoint;

        stockSeries.liveCompleteData =
            completeData;

        this.replaceLastSeriesPoint(
            stockSeries.localData,
            xName,
            existingTime,
            updatedPoint
        );

        this.replaceLastSeriesPoint(
            stockSeries.dataSource as Object[],
            xName,
            existingTime,
            updatedPoint
        );

        if (
            Array.isArray(
                this.dataSource
            )
        ) {
            this.replaceLastSeriesPoint(
                this.dataSource as Object[],
                xName,
                existingTime,
                updatedPoint
            );
        }

        /*
         * Range Navigator continues using complete historical
         * data rather than the filtered Chart window.
         */
        if (
            this.enableSelector &&
            this.rangeNavigator &&
            this.rangeNavigator.chartSeries &&
            typeof this.rangeNavigator
                .chartSeries
                .setData === 'function'
        ) {
            this.rangeNavigator
                .chartSeries
                .setData(
                    updatedPoint,
                    seriesIndex,
                    this.rangeNavigator,
                    animationDuration
                );
        }

        this.isLivePointUpdate =
            false;

    }

    /**
     * Replaces the final matching point in an array without
     * changing the array length.
     *
     * @param {Object} dataSource - Specifies the possible array.
     * @param {string} xName - Specifies the x-value field.
     * @param {number} expectedTime - Specifies the expected x-value.
     * @param {Object} updatedPoint - Specifies the replacement point.
     * @returns {void}
     *
     * @private
     */
    private replaceLastSeriesPoint(
        dataSource: Object,
        xName: string,
        expectedTime: number,
        updatedPoint: Object
    ): void {
        if (
            !Array.isArray(dataSource) ||
        dataSource.length === 0
        ) {
            return;
        }

        const lastIndex: number =
        dataSource.length - 1;

        const currentTime: number =
        this.getDataPointTime(
            dataSource[lastIndex as number],
            xName
        );

        if (
            !isNaN(currentTime) &&
        currentTime === expectedTime
        ) {
            dataSource[lastIndex as number] =
            updatedPoint;
        }
    }

    /**
     * Adds a new data point to the specified StockChart series.
     *
     * @param {Object} dataPoint - Specifies the data point to add.
     * @param {number} seriesIndex - Specifies the StockChart series index.
     * @param {number} duration - Specifies the animation duration.
     * @returns {void}
     *
     * @private
     */
    public addPoints(
        dataPoint: Object,
        seriesIndex: number,
        duration: number = 300
    ): void {
        if (
            this.isLivePointUpdate ||
        !dataPoint ||
        typeof dataPoint !== 'object' ||
        seriesIndex < 0 ||
        !this.series ||
        !this.series[seriesIndex as number] ||
        !this.chart ||
        !this.chart.series ||
        !this.chart.series[seriesIndex as number]
        ) {
            return;
        }

        const stockSeries: StockSeries =
        this.series[seriesIndex as number] as StockSeries;

        const chartSeries: Series =
        this.chart.series[seriesIndex as number] as Series;

        const animationDuration: number =
        Math.max(
            Number(duration),
            0
        );

        const newPointTime: number =
        this.getDataPointTime(
            dataPoint,
            stockSeries.xName
        );

        if (isNaN(newPointTime)) {
            return;
        }

        const completeData: Object[] | null =
        this.getCompleteSeriesData(
            stockSeries
        );

        /*
     * Prevent duplicate and older points.
     */
        if (completeData.length > 0) {
            const lastCompletePoint: Object =
            completeData[
                completeData.length - 1
            ];

            const lastCompleteTime: number =
            this.getDataPointTime(
                lastCompletePoint,
                stockSeries.xName
            );

            if (
                !isNaN(lastCompleteTime) &&
            newPointTime <= lastCompleteTime
            ) {
                return;
            }
        }

        /*
     * Preserve the current StockChart range.
     */
        let oldSelectedStart: number =
        Number(this.startValue);

        let oldSelectedEnd: number =
        Number(this.endValue);

        if (
            this.enableSelector &&
        this.rangeNavigator &&
        this.rangeNavigator.rangeSlider
        ) {
            oldSelectedStart =
            Number(
                this.rangeNavigator
                    .rangeSlider
                    .currentStart
            );

            oldSelectedEnd =
            Number(
                this.rangeNavigator
                    .rangeSlider
                    .currentEnd
            );
        }

        /*
     * Detect mouse-wheel zoom directly from the chart axis.
     */
        const currentXAxis: Axis | null = chartSeries.xAxis;

        const currentZoomFactor: number = Number(currentXAxis.zoomFactor);

        let preservedAxisStart: number =
        Number.NaN;

        let preservedAxisEnd: number =
        Number.NaN;

        const preserveMouseWheelZoom: boolean =
        Boolean(
            currentXAxis &&
            currentXAxis.visibleRange &&
            !isNaN(currentZoomFactor) &&
            currentZoomFactor > 0 &&
            currentZoomFactor < 1
        );

        if (preserveMouseWheelZoom) {
            preservedAxisStart =
            Number(
                currentXAxis
                    .visibleRange.min
            );

            preservedAxisEnd =
            Number(
                currentXAxis
                    .visibleRange.max
            );
        }

        /*
     * Store the live endpoint before adding the new point.
     *
     * This is needed to determine whether the right slider
     * was positioned at or near the previous live endpoint.
     */
        const previousLiveEnd: number =
        this.isDateTimeCategory
            ? this.sortedData.length - 1
            : Number(this.seriesXMax);

        let sortedDataPointAdded: boolean =
        false;

        this.isLivePointUpdate = true;

        /*
     * Add the new point to the complete data collection.
     */
        completeData.push(dataPoint);
        (stockSeries.dataSource as Object[]).push(dataPoint);
        /*
     * Update DateTimeCategory values.
     */
        if (this.isDateTimeCategory) {
            if (
                this.sortedData.indexOf(
                    newPointTime
                ) === -1
            ) {
                this.sortedData.push(
                    newPointTime
                );

                this.sortedData.sort(
                    (
                        first: number,
                        second: number
                    ): number => {
                        return first - second;
                    }
                );

                sortedDataPointAdded = true;
            }
        }

        /*
     * Update the complete X-axis range.
     */
        if (this.isDateTimeCategory) {
            this.seriesXMin = 0;

            this.seriesXMax =
            Math.max(
                this.sortedData.length - 1,
                0
            );
        } else {
            if (
                isNaN(
                    Number(this.seriesXMin)
                ) ||
            this.seriesXMin === Infinity ||
            this.seriesXMin === null
            ) {
                this.seriesXMin =
                newPointTime;
            }

            if (
                isNaN(
                    Number(this.seriesXMax)
                ) ||
            this.seriesXMax === -Infinity ||
            this.seriesXMax === null
            ) {
                this.seriesXMax =
                newPointTime;
            } else {
                this.seriesXMax =
                Math.max(
                    Number(
                        this.seriesXMax
                    ),
                    newPointTime
                );
            }
        }

        const liveRange:
        { start: number; end: number } | null =
        this.calculateLiveRange(
            dataPoint,
            stockSeries
        );

        let selectedStart: number;
        let selectedEnd: number;

        const effectiveSelectionMethod: string =
        preserveMouseWheelZoom
            ? 'zoom'
            : this.activeSelectionMethod;

        switch (effectiveSelectionMethod) {
        case 'datepicker': {
            const datePickerStart: number =
                Number(
                    this.savedDatePickerStart
                );

            const datePickerEnd: number =
                Number(
                    this.savedDatePickerEnd
                );

            if (
                this.savedDatePickerStart !== null &&
                this.savedDatePickerEnd !== null &&
                !isNaN(datePickerStart) &&
                !isNaN(datePickerEnd) &&
                datePickerEnd >= datePickerStart
            ) {
                selectedStart =
                    datePickerStart;

                selectedEnd =
                    datePickerEnd;
            } else {
                selectedStart =
                    Number(liveRange.start);

                selectedEnd =
                    Number(liveRange.end);
            }

            break;
        }

        case 'zoom': {
            /*
             * Keep the current zoom width and move the
             * range forward to include the new point.
             */
            const preservedZoomWidth: number =
                preservedAxisEnd -
                preservedAxisStart;

            if (this.isDateTimeCategory) {
                /*
                 * Half-category padding keeps the final
                 * candle inside the plot area.
                 */
                const lastCategoryIndex: number =
                    this.sortedData.length - 1;

                const boundaryPadding: number =
                    0.5;

                selectedEnd =
                    lastCategoryIndex +
                    boundaryPadding;

                selectedStart =
                    selectedEnd -
                    preservedZoomWidth;

                if (selectedStart < -0.5) {
                    selectedStart = -0.5;

                    selectedEnd =
                        selectedStart +
                        preservedZoomWidth;
                }
            } else {
                let previousPointTime: number =
                    Number.NaN;

                if (completeData.length > 1) {
                    previousPointTime =
                        this.getDataPointTime(
                            completeData[
                                completeData.length - 2
                            ],
                            stockSeries.xName
                        );
                }

                let pointInterval: number = newPointTime - previousPointTime;

                if (
                    isNaN(pointInterval) ||
                    pointInterval <= 0
                ) {
                    pointInterval =
                        24 * 60 * 60 * 1000;
                }

                /*
                 * Half-interval padding keeps the final
                 * candle body and wick inside the chart.
                 */
                const boundaryPadding: number =
                    pointInterval / 2;

                selectedEnd =
                    newPointTime +
                    boundaryPadding;

                selectedStart =
                    selectedEnd -
                    preservedZoomWidth;

                const minimumX: number =
                    Number(this.seriesXMin);

                if (
                    !isNaN(minimumX) &&
                    selectedStart < minimumX
                ) {
                    selectedStart =
                        minimumX;

                    selectedEnd =
                        selectedStart +
                        preservedZoomWidth;
                }
            }

            this.savedZoomStart =
                selectedStart;

            this.savedZoomEnd =
                selectedEnd;

            this.isUserZoomed = true;

            this.activeSelectionMethod =
                'zoom';

            break;
        }

        case 'slider': {
            const savedStart: number =
                Number(
                    this.savedSliderStart
                );

            const savedEnd: number =
                Number(
                    this.savedSliderEnd
                );

            if (
                !isNaN(savedStart) &&
                !isNaN(savedEnd) &&
                savedEnd > savedStart
            ) {
                /*
                 * Preserve the selected window width.
                 */
                const selectedWidth: number =
                    savedEnd -
                    savedStart;

                /*
                 * Keep the manual range by default.
                 */
                selectedStart =
                    savedStart;

                selectedEnd =
                    savedEnd;

                /*
                 * Right-slider live tracking.
                 *
                 * If the right slider was at or close to the
                 * previous live endpoint, move the complete
                 * selected window to the new live endpoint.
                 */
                if (
                    this.draggedSliderType ===
                    'right'
                ) {
                    const currentLiveEnd: number =
                        Number(liveRange.end);

                    let nearEndThreshold: number;

                    if (
                        this.isDateTimeCategory
                    ) {
                        /*
                         * DateTimeCategory values are indexes.
                         */
                        nearEndThreshold = 1;
                    } else {
                        /*
                         * Use the latest point interval as the
                         * near-live-end threshold.
                         */
                        const latestPointInterval:
                        number =
                            currentLiveEnd -
                            previousLiveEnd;

                        nearEndThreshold =
                            !isNaN(
                                latestPointInterval
                            ) &&
                            latestPointInterval > 0
                                ? latestPointInterval
                                : 24 *
                                    60 *
                                    60 *
                                    1000;
                    }

                    const isRightSliderNearLiveEnd:
                    boolean =
                        !isNaN(
                            previousLiveEnd
                        ) &&
                        !isNaN(
                            currentLiveEnd
                        ) &&
                        Math.abs(
                            savedEnd -
                            previousLiveEnd
                        ) <= nearEndThreshold;

                    if (
                        isRightSliderNearLiveEnd
                    ) {
                        /*
                         * Move the right boundary to the new
                         * live endpoint.
                         */
                        selectedEnd =
                            currentLiveEnd;

                        /*
                         * Move the start by the same amount.
                         * This retains the selected width and
                         * allows smooth chart scrolling.
                         */
                        selectedStart =
                            selectedEnd -
                            selectedWidth;

                        const minimumRange:
                        number =
                            this.isDateTimeCategory
                                ? 0
                                : Number(
                                    this
                                        .seriesXMin
                                );

                        if (
                            !isNaN(
                                minimumRange
                            ) &&
                            selectedStart <
                                minimumRange
                        ) {
                            selectedStart =
                                minimumRange;

                            selectedEnd =
                                selectedStart +
                                selectedWidth;

                            if (
                                selectedEnd >
                                currentLiveEnd
                            ) {
                                selectedEnd =
                                    currentLiveEnd;

                                selectedStart =
                                    selectedEnd -
                                    selectedWidth;
                            }
                        }

                        this.savedSliderStart =
                            selectedStart;

                        this.savedSliderEnd =
                            selectedEnd;
                    }
                } else if (
                    this.draggedSliderType ===
                    'left'
                ) {
                    /*
                     * Keep the existing left-slider behavior.
                     */
                    selectedEnd =
                        this.isDateTimeCategory
                            ? this.sortedData
                                .length - 1
                            : newPointTime;

                    selectedStart =
                        selectedEnd -
                        selectedWidth;

                    const minimumRange:
                    number =
                        this.isDateTimeCategory
                            ? 0
                            : Number(
                                this
                                    .seriesXMin
                            );

                    if (
                        !isNaN(
                            minimumRange
                        ) &&
                        selectedStart <
                            minimumRange
                    ) {
                        selectedStart =
                            minimumRange;
                    }

                    this.savedSliderStart =
                        selectedStart;

                    this.savedSliderEnd =
                        selectedEnd;
                }

                /*
                 * For the middle slider, selectedStart and
                 * selectedEnd remain savedStart and savedEnd.
                 */
                this.manualSliderChanged =
                    false;
            } else {
                selectedStart =
                    Number(
                        liveRange.start
                    );

                selectedEnd =
                    Number(
                        liveRange.end
                    );
            }

            break;
        }

        case 'period':
        default:
            selectedStart =
                Number(liveRange.start);

            selectedEnd =
                Number(liveRange.end);

            break;
        }

        const visibleData: Object[] =
        this.getLiveVisibleData(
            completeData,
            stockSeries,
            selectedStart,
            selectedEnd
        );

        this.startValue =
        selectedStart;

        this.endValue =
        selectedEnd;

        this.currentEnd =
        selectedEnd;

        let mainChartUpdated: boolean =
        false;

        if (
            chartSeries &&
        typeof chartSeries
            .updateLiveWindow ===
            'function'
        ) {
        /*
         * Complete data is required during mouse-wheel
         * zoom. Otherwise use only the selected data.
         */
            const liveWindowData: Object[] =
            preserveMouseWheelZoom
                ? completeData.slice()
                : visibleData.slice();

            mainChartUpdated =
            chartSeries.updateLiveWindow(
                liveWindowData,
                preserveMouseWheelZoom,
                selectedStart,
                selectedEnd
            );
        }

        let updatedIndicatorSeries:
        Series[] = [];

        if (
            mainChartUpdated &&
        this.chart &&
        this.chart.series &&
        this.chart.series[
            seriesIndex as number
        ]
        ) {
            const currentSourceSeries:
            Series =
            this.chart.series[
                seriesIndex as number
            ] as Series;

            const indicatorResult:
            Series[] =
            this.updateLiveIndicators(
                currentSourceSeries
            );

            updatedIndicatorSeries = indicatorResult;

            const animationStart: number =
            preserveMouseWheelZoom
                ? preservedAxisStart
                : oldSelectedStart;

            const animationEnd: number =
            preserveMouseWheelZoom
                ? preservedAxisEnd
                : oldSelectedEnd;

            /*
         * For right-slider live tracking, both selectedStart
         * and selectedEnd move by the same amount. Therefore,
         * the normal chart-scroll animation can be used.
         */
            this.animateLiveChartScroll(
                currentSourceSeries,
                animationStart,
                animationEnd,
                selectedStart,
                selectedEnd,
                animationDuration,
                (): void => {
                    this.isLivePointUpdate =
                    false;
                },
                updatedIndicatorSeries
            );
        }

        /*
     * Add the new point to the Range Navigator series.
     */
        let preparedRangeSeries:
        RangeNavigatorSeries | null =
        null;

        if (
            this.enableSelector &&
        this.rangeNavigator &&
        this.rangeNavigator.chartSeries
        ) {
            preparedRangeSeries =
            this.rangeNavigator
                .chartSeries
                .addPoint(
                    dataPoint,
                    seriesIndex,
                    this.rangeNavigator
                );
        }

        if (this.rangeNavigator) {
            this.rangeNavigator.startValue =
            selectedStart;

            this.rangeNavigator.endValue =
            selectedEnd;
        }

        if (
            preparedRangeSeries &&
        this.rangeNavigator &&
        this.rangeNavigator.chartSeries
        ) {
            this.rangeNavigator
                .chartSeries
                .renderLivePoint(
                    preparedRangeSeries,
                    seriesIndex,
                    this.rangeNavigator,
                    animationDuration
                );
        }

        /*
     * Mouse-wheel zoom is internal to the chart.
     * Do not animate the external Range Navigator slider
     * while mouse-wheel zoom is active.
     *
     * For right-slider live tracking, selectedStart and
     * selectedEnd both move, so both handles animate while
     * retaining the same selected width.
     */
        if (
            !preserveMouseWheelZoom &&
        this.enableSelector &&
        this.rangeNavigator &&
        this.rangeNavigator.rangeSlider
        ) {
            this.rangeNavigator
                .rangeSlider
                .performLiveAnimation(
                    oldSelectedStart,
                    selectedStart,
                    selectedEnd,
                    this.rangeNavigator,
                    animationDuration
                );
        }

        /*
     * Store the final selected range.
     */
        this.startValue =
        selectedStart;

        this.endValue =
        selectedEnd;

        this.currentEnd =
        selectedEnd;

        if (this.rangeNavigator) {
            this.rangeNavigator.startValue =
            selectedStart;

            this.rangeNavigator.endValue =
            selectedEnd;
        }

        this.isLivePointUpdate = false;
    }

    /**
     * Resolves the full historical dataset for the given StockChart series.
     *
     * The complete series data is preferred from `liveCompleteData` because it
     * reflects the latest live updates. When that cache is missing, the method
     * falls back to `localData`, `dataSource`, and finally the chart-level
     * `dataSource`. The resolved array is cached back into `liveCompleteData`
     * so subsequent calls do not need to re-scan the sources.
     *
     * @param {StockSeries} stockSeries - Specifies the stock series whose data should be resolved.
     * @returns {Object[] | null} - The complete series data array, or null when no series is supplied.
     *
     * @private
     */
    private getCompleteSeriesData(
        stockSeries: StockSeries
    ): Object[] | undefined {
        if (!stockSeries) {
            return undefined;
        }

        if (
            Array.isArray(
                stockSeries.liveCompleteData
            )
        ) {
            return stockSeries
                .liveCompleteData;
        }

        if (
            Array.isArray(
                stockSeries.localData
            )
        ) {
            stockSeries.liveCompleteData =
                stockSeries.localData.slice();

            return stockSeries
                .liveCompleteData;
        }
        return stockSeries.liveCompleteData;
    }
    /**
     * Pre render for financial Chart.
     *
     * @returns {void}
     */
    protected preRender(): void {
        this.unWireEvents();
        this.initPrivateVariable();
        this.allowServerDataBinding = false;
        this.isProtectedOnChange = true;
        this.setCulture();
        this.wireEvents();
    }

    /**
     * Method to bind events for chart.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        /** Find the Events type */
        const startEvent: string = Browser.touchStartEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const stopEvent: string = Browser.touchEndEvent;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /** UnBind the Event handler */

        EventHandler.remove(this.element, startEvent, this.stockChartOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.stockChartOnMouseMove);
        EventHandler.remove(this.element, stopEvent, this.stockChartMouseEnd);
        EventHandler.remove(this.element, 'click', this.stockChartOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.stockChartRightClick);
        EventHandler.remove(this.element, cancelEvent, this.stockChartOnMouseLeave);

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.stockChartResize
        );

    }


    private wireEvents(): void {
        /** Find the Events type */

        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /** Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.stockChartOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.stockChartOnMouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.stockChartMouseEnd, this);
        EventHandler.add(this.element, 'click', this.stockChartOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.stockChartRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.stockChartOnMouseLeave, this);

        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.stockChartResize.bind(this)
        );
        this.setStyle(this.element);
    }

    private initPrivateVariable(): void {
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-stockChart').length;
            this.element.id = 'stockChart_' + this.chartid + '_' + collection;
        }
        this.seriesXMax = null;
        this.seriesXMin = null;
        this.startValue = null;
        this.endValue = null;
        this.currentEnd = null;
        this.margin = {
            right: this.margin.right === null ? (Browser.isDevice ? 5 : 10) : this.margin.right,
            left: this.margin.left === null ? (Browser.isDevice ? 5 : 10) : this.margin.left,
            top: this.margin.top === null ? (Browser.isDevice ? 5 : 10) : this.margin.top,
            bottom: this.margin.bottom === null ? (Browser.isDevice ? 5 : 10) : this.margin.bottom
        };
        this.isStockChartRendered = false;
    }

    /**
     * Method to set culture for chart.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }
    private storeDataSource(): void {
        for (let i: number = 0; i < this.series.length; i++) {
            const series: StockSeries =
                this.series[i as number] as StockSeries;
            series.chart = this;
            this.tempSeriesType.push(series.type);
            series.localData = undefined;
        }

        if (this.series.length === 0) {
            this.series.push({});
        }

        this.initialRender = !this.legendClicked;
        this.rangeFound = false;
        this.resizeTo = null;
        this.startValue = null;
        this.endValue = null;
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     */
    protected render(): void {
        const loadEventData: IStockChartEventArgs = { name: 'load', stockChart: this, theme: this.theme };
        this.trigger('load', loadEventData, () => {
            //this.theme = this.theme;
            this.themeStyle = getThemeColor(this.theme, false, this);
            this.storeDataSource();
            this.drawSVG();
            this.renderTitle();
            this.renderLegend();
            this.chartModuleInjection();
            this.chartRender();
            if (!(this.dataSource instanceof DataManager) || !(this.series[0].dataSource instanceof DataManager)) {
                this.stockChartDataManagerSuccess();
                this.initialRender = false;
            }
            this.renderComplete();
            this.allowServerDataBinding = true;
            this.isStockChartRendered = true;
        });
        this.isProtectedOnChange = false;
    }

    /**
     * DataManager Success.
     *
     * @returns {void}
     */
    public stockChartDataManagerSuccess(): void {
        this.findRange();
        const isAllSeriesEmpty: boolean = this.series.every((s: StockSeriesModel) => {
            const dataSource: Object[] = s.dataSource as Object[] || [];
            return !dataSource || dataSource.length === 0;
        });

        this.renderNoDataTemplate(isAllSeriesEmpty && !isNullOrUndefined(this.noDataTemplate));
        this.renderRangeSelector();
        this.renderPeriodSelector();
        this.trigger('loaded', { stockChart: this });
    }

    private renderNoDataTemplate(allowTemplate: boolean): void {
        const existingTemplate: Element = this.element.querySelector(`#${this.element.id}_NoDataTemplate_wrapper`);
        if (existingTemplate) {
            existingTemplate.remove();
        }
        if (allowTemplate) {
            const rawTemplate: string | Function = typeof this.noDataTemplate === 'function'
                ? this.noDataTemplate() : this.noDataTemplate;
            const wrapper: HTMLElement = createElement('div', { id: this.element.id + '_NoDataTemplate_wrapper' });
            const container: HTMLElement = this.element.querySelector(`#${this.element.id}_Secondary_Element`) as HTMLElement;
            let borderStrokeWidth : number = 0;
            const borderElement : HTMLElement = document.getElementById(`${this.element.id}_stock_border`) as HTMLElement;
            if (borderElement) {
                const computedStyle : CSSStyleDeclaration = getComputedStyle(borderElement);
                const borderWidth : string | null = computedStyle.borderWidth || computedStyle.borderTopWidth;
                borderStrokeWidth = borderWidth ? parseFloat(borderWidth) : 0;
            }
            let topOffset: number = 0;
            if (this.title) {
                const titleHeight: number = measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont).height;
                topOffset = titleHeight + 11;
            }
            const chartRect: ClientRect = this.element.getBoundingClientRect();
            const rangeSelector: Element = document.querySelector(`#${this.element.id}_rangeSelector`) ||
                container.querySelector('[id*="rangeSelector"]');
            let bottom: number = chartRect.bottom;
            if (rangeSelector) {
                const rangeRect: ClientRect = (rangeSelector as HTMLElement).getBoundingClientRect();
                bottom = Math.max(bottom, rangeRect.bottom);
            }
            const containerRect: ClientRect = container.getBoundingClientRect();
            const height: number = bottom - containerRect.top - topOffset - borderStrokeWidth;
            wrapper.style.cssText = `position: absolute; top: ${topOffset}px; left: ${borderStrokeWidth}px; width: ${this.availableSize.width - borderStrokeWidth * 2}px;
                height: ${height}px; z-index: 1;
            `;
            const secondaryElement: HTMLElement = getElement(this.element.id + '_Secondary_Element') as HTMLElement;
            secondaryElement.appendChild(wrapper);
            createTemplate(wrapper, null, rawTemplate, this as unknown as Chart, null, null, this.element.id + '_NoData');
        }
    }

    /**
     * To set styles to resolve mvc width issue.
     *
     * @param {HTMLElement} element - The html element.
     * @returns {void}
     */
    private setStyle(element: HTMLElement): void {
        const zooming: ZoomSettingsModel = this.zoomSettings;
        const disableScroll: boolean = zooming.enableSelectionZooming || zooming.enablePinchZooming ||
            this.selectionMode !== 'None' || this.crosshair.enable;
        element.style.msTouchAction = disableScroll ? 'none' : 'element';
        element.style.touchAction = disableScroll ? 'none' : 'element';
        element.style.msUserSelect = 'none';
        element.style.msContentZooming = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        element.style.webkitUserSelect = 'none';
    }

    private drawSVG(): void {
        this.removeSvg();
        calculateSize(this);
        this.renderer = new SvgRenderer(this.element.id);
        this.renderBorder();
        this.createSecondaryElements();
        this.calculateVisibleSeries();
        this.calculateLegendBounds();
        //overall svg in which chart and selector appened
        this.mainObject = this.renderer.createSvg({
            id: this.element.id + '_stockChart_svg',
            width: this.availableSize.width,
            height: this.availableSize.height - (this.enablePeriodSelector ? this.toolbarHeight : 0) - this.titleSize.height,
            style: 'display: block;'
        });
        this.svgObject = this.mainObject;
        applyGradientsToSeries(this.svgObject, false, this.visibleSeries, this.element);
        this.element.appendChild(this.mainObject);
    }

    private calculateVisibleSeries(): void {
        this.visibleSeries = [];
        let series: Series;
        const color: string[] = getSeriesColor(this.theme);
        const count: number = color.length;
        const seriesCollections: SeriesModel[] = this.series.sort((a: SeriesModel, b: SeriesModel) => { return a.zOrder - b.zOrder; });
        for (let i: number = 0, len: number = seriesCollections.length; i < len; i++) {
            series = <Series>seriesCollections[i as number];
            series.category = 'Series';
            series.index = i;
            series.interior = series.fill || color[i % count];
            this.visibleSeries.push(series);
            seriesCollections[i as number] = series;
        }
    }

    private createSecondaryElements(): void {
        const tooltipDiv: Element = redrawElement(false, this.element.id + '_Secondary_Element') ||
            this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        if (this.title) {
            this.titleSize = measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont);
            this.titleSize.height += 15;  // for title padding
        } else {
            this.titleSize = { height: null, width: null };
        }
        const height: number = (this.enablePeriodSelector ? this.toolbarHeight : 0) + this.titleSize.height;
        (tooltipDiv as HTMLElement).style.cssText = 'position: relative; height:' + height + 'px';
        appendChildElement(false, this.element, tooltipDiv, false);
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} required modules
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.legendSettings.visible) {
            modules.push({
                member: 'StockLegend',
                args: [this]
            });
        }
        return modules;
    }

    public findCurrentData(totalData: Object, xName: string): Object {
        let tempData: Object = (!this.enablePeriodSelector && !this.enableSelector) ? totalData : undefined;
        const start: number = (this.isDateTimeCategory) ? new Date(this.sortedData[Math.floor(this.startValue)]).getTime() :
            this.startValue;
        const end: number = (this.isDateTimeCategory) ? new Date(this.sortedData[Math.floor(this.endValue)]).getTime() : this.endValue;
        if (totalData && start && end) {
            tempData = (totalData as Object[])
                .filter((data: Object) => {
                    return (
                        new Date(Date.parse(data[xName as string])).getTime() >= start &&
                    new Date(Date.parse(data[xName as string])).getTime() <= end
                    );
                });
        }
        return tempData;
    }

    /**
     * Render period selector.
     *
     * @returns {void}
     */
    public renderPeriodSelector(): void {
        if (this.enablePeriodSelector) {
            this.toolbarSelector.initializePeriodSelector();
            this.periodSelector.toolbar.refreshOverflow();   //to avoid overlapping toolbar elements
            if (!this.enableSelector) {
                this.cartesianChart.cartesianChartRefresh(this);
            }
        }
    }

    private chartRender(): void {
        this.sortedData = [];
        this.cartesianChart = new CartesianChart(this);
        this.cartesianChart.initializeChart();
    }

    /**
     * To render range Selector.
     *
     * @returns {void}
     */
    private renderRangeSelector(): void {
        //SVG in which range navigator is going to append
        if (this.enableSelector) {
            this.rangeSelector = new RangeSelector(this);
            this.rangeSelector.initializeRangeNavigator();
        }
    }

    /**
     * Get component name.
     *
     * @returns {string} - To get the module name.
     */
    public getModuleName(): string {
        return 'stockChart';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - The persisted data containing the properties.
     */
    public getPersistData(): string {
        return '';
    }

    /**
     * To Remove the SVG.
     *
     * @returns {void}
     * @private
     */
    public removeSvg(): void {
        if (document.getElementById(this.element.id + '_Secondary_Element')) {
            remove(document.getElementById(this.element.id + '_Secondary_Element'));
        }
        const removeLength: number = 0;
        if (this.mainObject) {
            while (this.mainObject.childNodes.length > removeLength) {
                this.mainObject.removeChild(this.mainObject.firstChild);
            }
            if (!this.mainObject.hasChildNodes() && this.mainObject.parentNode) {
                remove(this.mainObject);
                this.mainObject = null; this.selectorObject = null; this.chartObject = null;
            }
        }
    }

    /**
     * Module Injection for components.
     *
     * @returns {void}
     */
    public chartModuleInjection(): void {
        let moduleName: string;
        for (const modules of this.getInjectedModules()) {
            moduleName = modules.prototype.getModuleName().toLowerCase();
            if (moduleName.indexOf('rangetooltip') === -1) {
                Chart.Inject(modules);
            } else {
                RangeNavigator.Inject(modules);
            }
            if (moduleName === 'datetime' || moduleName === 'areaseries' || moduleName === 'steplineseries' || moduleName === 'datetimecategory') {
                RangeNavigator.Inject(modules);
            }
        }
    }

    /**
     * Find range for financal chart.
     *
     * @returns {void}
     * @private
     */
    public findRange(): void {
        this.seriesXMin = Infinity; this.seriesXMax = -Infinity;
        for (const value of this.chart.series as Series[]) {
            if (value.visible) {
                this.seriesXMin = Math.min(this.seriesXMin, value.xMin);
                this.seriesXMax = Math.max(this.seriesXMax, value.xMax);
            }
        }
        this.endValue = this.currentEnd = this.seriesXMax;
        if (this.enablePeriodSelector) {
            this.toolbarSelector = new ToolBarSelector(this);
            this.periodSelector = new PeriodSelector(this);
            this.tempPeriods = this.periods.length ? this.periods : this.toolbarSelector.calculateAutoPeriods();
            this.tempPeriods.map((period: PeriodsModel) => {
                if (period.selected && period.text.toLowerCase() === 'ytd') {
                    if (this.isDateTimeCategory) {
                        const currentYear: number = new Date(this.sortedData[this.currentEnd]).getFullYear();
                        let index: number = this.currentEnd - 1;
                        for (; index >= 0; index--) {
                            if (new Date(this.sortedData[index as number]).getFullYear() !== currentYear) {
                                this.startValue = index + 1;
                                break;
                            }
                        }
                        this.startValue = index === -1 ? 0 : this.startValue;
                    }
                    else {
                        this.startValue = new Date(new Date(this.currentEnd).getFullYear().toString()).getTime();
                    }
                } else if (period.selected && period.text.toLowerCase() === 'all') {
                    this.startValue = this.seriesXMin;
                } else if (period.selected) {
                    this.startValue = this.periodSelector.changedRange(period.intervalType, this.endValue, period.interval).getTime();
                    this.startValue = this.isDateTimeCategory ? this.periodSelector.findStartValue(this.startValue, this.endValue) :
                        this.startValue;
                }
            });
        } else {
            this.startValue = this.seriesXMin;
        }
        this.rangeFound = true;
    }
    /**
     * Handles the chart resize.
     *
     * @returns {boolean} false
     * @private
     */
    public stockChartResize(): boolean {
        // To avoid resize console error
        if (!document.getElementById(this.element.id)) {
            return false;
        }
        this.animateSeries = false;
        TextMeasureCache.clear();
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = +setTimeout(
            (): void => {
                if (this.cartesianChart) {
                    calculateSize(this);
                    this.renderBorder();
                    this.calculateLegendBounds();
                    this.renderTitle();
                    this.renderLegend();
                    this.cartesianChart.cartesianChartRefresh(this);
                    this.mainObject.setAttribute('width', (this.availableSize.width + (this.stockLegendModule && (this.legendSettings.position === 'Right' || this.legendSettings.position === 'Left') ? this.stockLegendModule.legendBounds.width : 0)).toString());
                    if (this.enablePeriodSelector) {
                        this.renderPeriodSelector();
                    }
                }
            },
            500);
        return false;

    }

    /**
     * Handles the mouse down on chart.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public stockChartOnMouseDown(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        const rect: ClientRect = this.chart.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
        this.trigger('stockChartMouseDown', { target: element.id, x: this.mouseX, y: this.mouseY });
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            target = <Element>touchArg.target;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.clientX; pageY = e.clientY;
            target = <Element>e.target;
        }
        if (target.id.indexOf(this.element.id + '_stockChart_chart') > -1) {
            const svgRect: ClientRect = getElement(this.element.id + '_stockChart_chart').getBoundingClientRect();

            this.mouseDownY = this.previousMouseMoveY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
            this.mouseDownX = this.previousMouseMoveX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
            this.setMouseXY(pageX, pageY);
            this.referenceXAxis = this.chart.primaryXAxis as Axis;
            getElement(this.element.id + '_stockChart_chart').setAttribute('cursor', 'pointer');
            if (this.isDateTimeCategory) {
                this.visibleRange.min = this.sortedData.indexOf(parseInt(
                    this.referenceXAxis.labels[this.referenceXAxis.visibleRange.min], 10));
                this.visibleRange.max = this.sortedData.indexOf(parseInt(
                    this.referenceXAxis.labels[this.referenceXAxis.visibleRange.max], 10));
                this.visibleRange.delta = this.referenceXAxis.visibleRange.delta;
                this.visibleRange.interval = this.referenceXAxis.visibleRange.interval;
            }
            else {
                this.visibleRange = this.referenceXAxis.visibleRange;
            }
            this.mouseDownXPoint = getRangeValueXByPoint(this.mouseX - this.referenceXAxis.rect.x, this.referenceXAxis.rect.width,
                                                         this.visibleRange, this.referenceXAxis.isInversed);
            this.allowPan = true;
            this.notify(Browser.touchStartEvent, e);
        }
        return false;
    }
    /**
     * Handles the mouse up.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public stockChartMouseEnd(e: PointerEvent): boolean {
        let pageY: number;
        let pageX: number;
        let touchArg: TouchEvent;
        if (e.type === 'touchend') {
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX; pageY = touchArg.changedTouches[0].clientY;
            this.isTouch = true;
        } else {
            pageY = e.clientY; pageX = e.clientX;
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        getElement(this.element.id + '_stockChart_chart').setAttribute('cursor', 'auto');
        this.onPanning = false;
        this.setMouseXY(pageX, pageY);
        this.stockChartOnMouseUp(e);
        return false;
    }

    /**
     * Handles the mouse up.
     *
     * @param {PointerEvent | TouchEvent} e - The pointer event or touch event.
     * @returns {boolean} - false
     * @private
     */

    public stockChartOnMouseUp(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger('stockChartMouseUp', { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        this.allowPan = false;
        if (this.rangeNavigator) {
            this.rangeNavigator.rangeSlider.isDrag = false;
        }
        if (this.isTouch) {
            this.threshold = new Date().getTime() + 300;
        }
        this.notify(Browser.touchEndEvent, e);
        if (this.stockEvent) {
            this.stockEvent.removeStockEventTooltip(0);
        }
        return false;
    }

    /**
     * To find mouse x, y for aligned chart element svg position.
     *
     * @param {number} pageX - The x-coordinate of the mouse pointer event.
     * @param {number} pageY - The y-coordinate of the mouse pointer event.
     * @returns {void}
     */
    private setMouseXY(pageX: number, pageY: number): void {
        const svgRectElement: Element = getElement(this.element.id + '_stockChart_chart');
        if (this.element && svgRectElement) {
            const stockRect: ClientRect = this.element.getBoundingClientRect();
            const svgRect: ClientRect = svgRectElement.getBoundingClientRect();
            this.mouseX = (pageX - stockRect.left) - Math.max(svgRect.left - stockRect.left, 0);
            this.mouseY = (pageY - stockRect.top) - Math.max(svgRect.top - stockRect.top, 0);
        }
    }

    /**
     * Handles the mouse move.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public stockChartOnMouseMove(e: PointerEvent): boolean {
        let pageX: number;
        let touchArg: TouchEvent; let pageY: number;
        this.mouseMoveEvent = e;
        if (e.type === 'touchmove') {
            this.isTouch = true; touchArg = <TouchEvent & PointerEvent>e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
            pageX = e.clientX; pageY = e.clientY;
        }
        this.trigger('stockChartMouseMove', { target: (e.target as Element).id, x: this.mouseX, y: this.mouseY });
        if (getElement(this.element.id + '_stockChart_chart')) {
            this.setMouseXY(pageX, pageY);
            this.chartOnMouseMove(e);
        }
        return false;
    }

    /**
     * Handles the mouse move on chart.
     *
     * @param {PointerEvent | TouchEvent} e - The pointer event or touch event.
     * @returns {boolean} - false
     * @private
     */
    public chartOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        if (this.rangeNavigator && this.rangeNavigator.rangeSlider.isDrag) {
            this.rangeNavigator.mouseX = this.mouseX;
            this.rangeNavigator.rangeSlider.mouseMoveHandler(e);
        }
        if (this.allowPan && !this.chart.startMove && this.mouseDownXPoint && this.mouseX !== this.previousMouseMoveX &&
             this.zoomSettings.enablePan) {
            this.onPanning = true;
            this.zoomChange = false;
            getElement(this.element.id + '_stockChart_chart').setAttribute('cursor', 'pointer');
            this.mouseUpXPoint = getRangeValueXByPoint(this.mouseX - this.referenceXAxis.rect.x, this.referenceXAxis.rect.width,
                                                       this.visibleRange, this.referenceXAxis.isInversed);
            const diff: number = Math.abs(this.mouseUpXPoint - this.mouseDownXPoint);

            if (this.mouseDownXPoint < this.mouseUpXPoint) {
                if (this.seriesXMin <= this.visibleRange.min - diff) {
                    this.startValue = this.visibleRange.min - diff;
                    this.endValue = this.visibleRange.max - diff;
                    if (this.enableSelector) {
                        this.rangeNavigator.rangeSlider.setSlider(this.visibleRange.min - diff,
                                                                  this.visibleRange.max - diff,
                                                                  !this.rangeNavigator.enableDeferredUpdate,
                                                                  (this.rangeNavigator.rangeTooltipModule
                                                                  && this.rangeNavigator.tooltip.enable));
                    }
                    else {
                        this.cartesianChart.cartesianChartRefresh(this);
                    }
                }
            } else {
                if (this.seriesXMax >= this.visibleRange.max + diff) {
                    this.startValue = this.visibleRange.min + diff;
                    this.endValue = this.visibleRange.max + diff;
                    if (this.enableSelector) {
                        this.rangeNavigator.rangeSlider.setSlider(this.visibleRange.min + diff,
                                                                  this.visibleRange.max + diff,
                                                                  !this.rangeNavigator.enableDeferredUpdate,
                                                                  (this.rangeNavigator.rangeTooltipModule
                                                                  && this.rangeNavigator.tooltip.enable));
                    }
                    else {
                        this.cartesianChart.cartesianChartRefresh(this);
                    }
                }
            }

        }
        this.notify(Browser.touchMoveEvent, e);
        if ((<HTMLElement>e.target).id === ''  && !this.onPanning === true) { //to remove the tooltip when hover on mouse move
            let element: HTMLElement;
            if (this.chart.tooltip.enable || this.crosshair.enable) {
                element = document.getElementById(this.element.id + '_stockChart_chart_tooltip');
                if (element) {
                    remove(element);
                }
            }
            if (getElement(this.element.id + '_StockEvents_Tooltip')) {
                this.stockEvent.removeStockEventTooltip(0);
            }
        }

        if ((<HTMLElement>e.target).id.indexOf('StockEvents') !== -1) {
            clearInterval(this.stockEvent.toolTipInterval);
            this.stockEvent.renderStockEventTooltip((e.target as HTMLElement).id);
        } else {
            if (this.stockEvent) {
                this.stockEvent.removeStockEventTooltip(1000);
            }

        }
        this.isTouch = false;
        return false;
    }

    /**
     * Handles the mouse click on chart.
     *
     * @param {PointerEvent | TouchEvent} e - The pointer event or touch event.
     * @returns {boolean} - false
     * @private
     */
    public stockChartOnMouseClick(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger('stockChartMouseClick', { target: element.id, x: this.mouseX, y: this.mouseY });
        this.notify('click', e);
        return false;
    }

    private stockChartRightClick(event: MouseEvent | PointerEvent): boolean {
        if (this.crosshair.enable &&
            (event.buttons === 2 || event.which === 0 || (<PointerEvent>event).pointerType === 'touch')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    }

    /**
     * Handles the mouse leave.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} false
     * @private
     */
    public stockChartOnMouseLeave(e: PointerEvent): boolean {
        let touchArg: TouchEvent; let pageX: number; let pageY: number;
        if (e.type === 'touchleave') {
            this.isTouch = true; touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX; pageY = touchArg.changedTouches[0].clientY;
        } else {
            pageX = e.clientX; pageY = e.clientY;
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        this.setMouseXY(pageX, pageY);
        this.allowPan = false;
        this.stockChartOnMouseLeaveEvent(e);
        return false;
    }

    /**
     * Handles the mouse leave on chart.
     *
     * @param {PointerEvent | TouchEvent} e - The pointer event or touch event.
     * @returns {boolean} - false
     * @private
     */
    public stockChartOnMouseLeaveEvent(e: PointerEvent | TouchEvent): boolean {
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        //this.trigger(chartMouseLeave, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        this.notify(cancelEvent, e);
        if (this.stockEvent) {
            this.stockEvent.removeStockEventTooltip(1000);
        }
        if (this.rangeNavigator) {
            this.rangeNavigator.rangeSlider.isDrag = false;
        }
        if (this.onPanning) {
            this.onPanning = false;
            this.chart.mouseLeave(e as PointerEvent);
            getElement(this.element.id + '_stockChart_chart').setAttribute('cursor', 'auto');
        }
        return false;
    }

    /**
     * Destroy method.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.cartesianChart = null;
        this.chart = null;
        this.periodSelector = null;
        this.rangeNavigator = null;
        this.rangeSelector = null;
        this.tempPeriods = [];
        this.toolbarSelector = null;
        this.visibleSeries = [];
        this.yAxisElements = null;
        const element: HTMLElement = document.getElementById(this.element.id + '_stockChart_chartKeyboard_chart_focus');
        if (element) {
            element.remove();
        }
        const borderElement: HTMLElement = document.getElementById(this.element.id + '_stock_border');
        if (borderElement) {
            borderElement.remove();
        }
        TextMeasureCache.clear();
        removeElement('chartmeasuretext');
        if (this.element) {
            this.unWireEvents();
            super.destroy();
            this.removeSvg();
            this.svgObject = null;
        }
    }

    private renderBorder(): void {
        if (this.border.width) {
            const border: HTMLElement = this.createElement('div');
            border.id = this.element.id + '_stock_border';
            border.style.width = (this.availableSize.width) + 'px';
            border.style.height = (this.availableSize.height) + 'px';
            border.style.position = 'absolute';
            border.style.border = this.border.width + 'px solid ' + this.border.color;
            border.style.pointerEvents = 'none';
            appendChildElement(false, getElement(this.element.id), border);
        }
    }

    /**
     * Render title for chart.
     *
     * @returns {void}
     */
    private renderTitle(): void {
        let rect: Rect;
        if (this.title) {
            appendChildElement(
                false, getElement(this.element.id + '_Secondary_Element'),
                this.renderer.createSvg({
                    id: this.element.id + '_stockChart_Title',
                    width: this.availableSize.width,
                    height: this.titleSize.height,
                    fill: this.background || this.themeStyle.background
                }),
                false);
            const alignment: Alignment = this.titleStyle.textAlignment;
            const getAnchor: string = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
            rect = new Rect(
                0, 0, this.availableSize.width, 0
            );
            const options: TextOption = new TextOption(
                this.element.id + '_ChartTitle',
                titlePositionX(rect, this.titleStyle),
                ((this.titleSize.height - 10)),
                getAnchor, this.title, '', 'auto'
            );
            textElement(
                this.renderer as unknown as SvgRenderer,
                options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitleFont.color || this.findTitleColor(),
                getElement(this.element.id + '_stockChart_Title'), false, false, null, null, null, null, null, null, null, null, this.themeStyle.chartTitleFont
            );
            this.availableSize.height -= (this.titleSize.height + 5);
        }
    }

    /**
     * To calculate the legend bounds.
     *
     * @private
     * @returns {void}
     */
    public calculateLegendBounds(): void {
        if (this.stockLegendModule && this.legendSettings.visible) {
            this.stockLegendModule.getLegendOptions(this.visibleSeries);
        }
        const titleHeight: number = this.titleSize.height;
        const left: number = this.border.width;
        const width: number = this.availableSize.width - this.border.width - left;
        const top: number = this.chartArea.border.width * 0.5 + this.border.width;
        const height: number = this.availableSize.height - top - this.border.width -
        (this.enablePeriodSelector ? this.toolbarHeight : 0) - titleHeight;
        this.initialClipRect = new Rect(left, top, width, height);
        this.tempAvailableSize = new Size(this.availableSize.width, this.availableSize.height -
            (this.enablePeriodSelector ? this.toolbarHeight : 0) - titleHeight);
        if (this.stockLegendModule && this.legendSettings.visible) {
            this.stockLegendModule.calculateLegendBounds(this.initialClipRect, this.tempAvailableSize, null);
        }
    }

    /**
     * To render the legend.
     *
     * @private
     * @returns {void}
     */
    public renderLegend(): void {
        if (this.stockLegendModule && this.stockLegendModule.legendCollections.length && this.legendSettings.visible) {
            this.stockLegendModule.calTotalPage = true;
            const bounds: Rect = this.stockLegendModule.legendBounds;
            this.stockLegendModule.renderLegend(this, this.legendSettings, bounds);
            if (this.legendSettings.position === 'Auto' || this.legendSettings.position === 'Bottom' || this.legendSettings.position === 'Top') {
                this.availableSize.height -= this.stockLegendModule.legendBounds.height;
            } else if (this.legendSettings.position === 'Left' || this.legendSettings.position === 'Right') {
                this.availableSize.width -= this.stockLegendModule.legendBounds.width;
            }
        }
    }

    private findTitleColor(): string {
        if (this.theme.toLocaleLowerCase().indexOf('highcontrast') > -1 || this.theme.indexOf('Dark') > -1) {
            return '#ffffff';
        }
        return '#424242';
    }

    /**
     * To calculate the stock events.
     *
     * @private
     * @returns {void}
     */
    public calculateStockEvents(): void {
        if (this.stockEvents.length) {
            this.stockEvent = new StockEvents(this);
            appendChildElement(false, this.chartObject, this.stockEvent.renderStockEvents());
        }
    }

    /**
     * Get the time value of a data point.
     *
     * @private
     * @param {Object} dataPoint - The data point to extract time from
     * @param {string} xName - The x-axis property name
     * @returns {number} - The time value in milliseconds
     */
    private getDataPointTime(dataPoint: Object, xName: string): number {
        const rawXValue: Date | number | string =
            getValue(xName, dataPoint) as Date | number | string;
        if (rawXValue instanceof Date) {
            return rawXValue.getTime();
        }
        if (typeof rawXValue === 'number') {
            return rawXValue;
        }
        return new Date(rawXValue).getTime();
    }


    private calculateLiveRange(dataPoint: Object, stockSeries: StockSeries): { start: number; end: number } | null {
        const xValue: Date | number | string =
            getValue(stockSeries.xName, dataPoint) as Date | number | string;
        const latestDate: Date = xValue instanceof Date
            ? xValue
            : new Date(xValue);
        const latestTime: number = latestDate.getTime();

        let newEnd: number;
        if (this.isDateTimeCategory) {
            if (!this.sortedData || this.sortedData.length === 0) {
                return null;
            }
            newEnd = this.sortedData.indexOf(latestTime);
            if (newEnd === -1) {
                this.sortedData.push(latestTime);
                this.sortedData.sort((first: number, second: number) => first - second);
                newEnd = this.sortedData.indexOf(latestTime);
            }
        } else {
            if (this.isDatePickerRangeSet && this.currentEnd !== undefined && this.isPeriodSelectorChange) {
                newEnd = this.currentEnd;

            } else {
                newEnd = latestTime;
            }

        }

        const selectedPeriod: PeriodsModel | null = this.getSelectedLivePeriod();
        let newStart: number;

        if (!selectedPeriod) {
            const previousStart: number = Number(this.startValue);
            const previousEnd: number = Number(this.endValue);
            const previousWidth: number = previousEnd - previousStart;

            if (isNaN(previousWidth) || previousWidth <= 0) {
                newStart = this.seriesXMin;
            } else {
                newStart = newEnd - previousWidth;
            }
        } else {
            const periodText: string = selectedPeriod.text
                ? selectedPeriod.text.toLowerCase()
                : '';

            if (periodText === 'all') {
                newStart = this.seriesXMin;
            } else if (periodText === 'ytd') {
                if (this.isDateTimeCategory) {
                    const latestYear: number = latestDate.getFullYear();
                    let startIndex: number = newEnd;
                    while (startIndex > 0 &&
                        new Date(this.sortedData[startIndex - 1]).getFullYear() === latestYear) {
                        startIndex--;
                    }
                    newStart = startIndex;
                } else {
                    newStart = new Date(latestDate.getFullYear(), 0, 1).getTime();
                }
            } else {
                if (!this.periodSelector) {
                    return null;
                }
                const calculatedStart: number = this.periodSelector.changedRange(
                    selectedPeriod.intervalType,
                    this.isDatePickerRangeSet && this.isPeriodSelectorChange ? this.currentEnd : latestTime,
                    selectedPeriod.interval
                ).getTime();

                if (this.isDateTimeCategory) {
                    newStart = this.periodSelector.findStartValue(calculatedStart, newEnd);
                } else {
                    newStart = calculatedStart;
                }
            }
        }

        const rangeMinimum: number = this.enableSelector &&
            this.rangeNavigator &&
            this.rangeNavigator.chartSeries &&
            this.rangeNavigator.chartSeries.xAxis
            ? Number(this.rangeNavigator.chartSeries.xAxis.actualRange.min)
            : Number(this.seriesXMin);

        if (!isNaN(rangeMinimum)) {
            newStart = Math.max(rangeMinimum, newStart);
        }

        if (isNaN(newStart) || isNaN(newEnd)) {
            return null;
        }

        return {
            start: newStart,
            end: newEnd
        };
    }

    /**
     * Get the live visible data within the selected range.
     *
     * @private
     * @param {Object[]} completeData - The complete historical data
     * @param {StockSeries} stockSeries - The stock series
     * @param {number} selectedStart - The selected start value
     * @param {number} selectedEnd - The selected end value
     * @returns {Object[]} - The filtered visible data
     */
    private getLiveVisibleData(
        completeData: Object[],
        stockSeries:  StockSeriesModel,
        selectedStart: number,
        selectedEnd: number
    ): Object[] {

        let startTime: number;
        let endTime: number;

        if (this.isDateTimeCategory) {
            const startIndex: number = Math.max(0, Math.floor(Number(selectedStart)));
            const endIndex: number = Math.min(
                this.sortedData.length - 1,
                Math.floor(Number(selectedEnd))
            );

            if (startIndex > endIndex ||
                this.sortedData[startIndex as number] === undefined ||
                this.sortedData[endIndex as number] === undefined) {
                return [];
            }

            startTime = Number(this.sortedData[startIndex as number]);
            endTime = Number(this.sortedData[endIndex as number]);
        } else {
            startTime = Number(selectedStart);
            endTime = Number(selectedEnd);
        }


        return completeData.filter((currentData: Object) => {
            const currentTime: number = this.getDataPointTime(currentData, stockSeries.xName);
            return !isNaN(currentTime) && currentTime >= startTime && currentTime <= endTime;
        });
    }


    /**
     * Update the live indicators after adding a new point.
     *
     * @private
     * @param {Series} sourceSeries - The source series
     * @returns {Series[]} - Array of updated indicator target series
     */
    private updateLiveIndicators(sourceSeries: Series): Series[] {
        const updatedTargetSeries: Series[] = [];

        if (!this.chart || !sourceSeries || !this.chart.indicators || this.chart.indicators.length === 0) {
            return updatedTargetSeries;
        }

        const previousDuration: number = this.chart.duration;
        const previousRedraw: boolean = this.chart.redraw;
        const previousAnimateSeries: boolean = this.chart.animateSeries;
        const previousEnableAnimation: boolean = this.chart.enableAnimation;
        const previousPointsAdded: boolean = this.chart.pointsAdded;
        const previousPointsRemoved: boolean = this.chart.pointsRemoved;
        const restoreChartState: () => void = (): void => {
            this.chart.duration = previousDuration;
            this.chart.redraw = previousRedraw;
            this.chart.animateSeries = previousAnimateSeries;
            this.chart.enableAnimation = previousEnableAnimation;
            this.chart.pointsAdded = previousPointsAdded;
            this.chart.pointsRemoved = previousPointsRemoved;
        };
        this.chart.duration = 0;
        this.chart.redraw = true;
        this.chart.animateSeries = false;
        this.chart.enableAnimation = false;
        this.chart.pointsAdded = false;
        this.chart.pointsRemoved = false;
        for (let indicatorIndex: number = 0; indicatorIndex < this.chart.indicators.length; indicatorIndex++) {
            const indicator: TechnicalIndicator = this.chart.indicators[indicatorIndex as number] as TechnicalIndicator;

            const indicatorType: string = firstToLowerCase(indicator.type);
            const indicatorModule: { initDataSource?: (indicator: TechnicalIndicator, chart: Chart) => void } =
                    (this.chart as unknown as Record<string, { initDataSource?: (indicator: TechnicalIndicator, chart: Chart) => void }>)[indicatorType + 'IndicatorModule'];

            // Clear the previous calculated result
            for (let resetIndex: number = 0; resetIndex < indicator.targetSeries.length; resetIndex++) {
                const resetSeries: Series = indicator.targetSeries[resetIndex as number];

                resetSeries.points = [];
                resetSeries.visiblePoints = [];
                resetSeries.xData = [];
                resetSeries.yData = [];
                resetSeries.xMin = Infinity;
                resetSeries.xMax = -Infinity;
                resetSeries.yMin = Infinity;
                resetSeries.yMax = -Infinity;
                (resetSeries as Series & { sizeMax?: number }).sizeMax = -Infinity;
            }

            const indicatorWithState: { _previousValues?: { [targetSeriesIndex: number]: object } } =
                    indicator as unknown as { _previousValues?: { [targetSeriesIndex: number]: object } };
            if (indicatorWithState._previousValues) {
                indicatorWithState._previousValues = {};
            }

            indicator.xData = sourceSeries.xData;
            indicator.yData = sourceSeries.yData;
            indicator.points = sourceSeries.points;

            indicatorModule.initDataSource(indicator, this.chart);

            // Render every generated target series
            for (let targetIndex: number = 0; targetIndex < indicator.targetSeries.length; targetIndex++) {
                const targetSeries: Series = indicator.targetSeries[targetIndex as number];

                if (!targetSeries || !targetSeries.visible || !targetSeries.seriesElement ||
                        !targetSeries.xAxis || !targetSeries.yAxis || !targetSeries.points ||
                        targetSeries.points.length === 0) {
                    continue;
                }

                targetSeries.visiblePoints = targetSeries.points.filter((point: Points) => {
                    return point && (point as Points).visible !== false;
                });

                const targetType: string = targetSeries.type.replace('100', '');
                const targetModuleName: string = firstToLowerCase(targetType) + 'SeriesModule';
                const targetModule: {
                    render?: (series: Series, xAxis: Axis, yAxis: Axis,
                        isInverted: boolean, isAnimate: boolean) => void
                } =
                        (this.chart as unknown as Record<string, {
                            render?: (series: Series,
                                xAxis: Axis, yAxis: Axis, isInverted: boolean, isAnimate: boolean) => void
                        }>)[targetModuleName as string];

                if (!targetModule || typeof targetModule.render !== 'function') {
                    continue;
                }

                const transform: string = 'translate(' +
                        targetSeries.clipRect.x + ',' +
                        targetSeries.clipRect.y + ')';

                targetSeries.seriesElement.setAttribute('transform', '');

                targetModule.render(
                    targetSeries,
                    targetSeries.xAxis,
                    targetSeries.yAxis,
                    this.chart.requireInvertedAxis,
                    false
                );

                if (targetSeries.marker && targetSeries.marker.visible && (targetSeries).symbolElement) {
                    (targetSeries).symbolElement.setAttribute('transform', transform);
                    appendChildElement(
                        this.chart.enableCanvas,
                        this.chart.seriesElements,
                        (targetSeries).symbolElement,
                        true
                    );
                }

                if (updatedTargetSeries.indexOf(targetSeries) === -1) {
                    updatedTargetSeries.push(targetSeries);
                }
            }
        }
        restoreChartState();
        return updatedTargetSeries;
    }

    /**
     * Animate the live chart scroll.
     *
     * @private
     * @param {Series} chartSeries - The chart series
     * @param {number} oldStart - The old range start
     * @param {number} oldEnd - The old range end
     * @param {number} newStart - The new range start
     * @param {number} newEnd - The new range end
     * @param {number} duration - The animation duration
     * @param {Function} completed - The completion callback
     * @param {Series[]} indicatorTargetSeries - The indicator target series
     * @returns {void}
     */
    private animateLiveChartScroll(
        chartSeries: Series,
        oldStart: number,
        oldEnd: number,
        newStart: number,
        newEnd: number,
        duration?: number,
        completed?: () => void,
        indicatorTargetSeries?: Series[]
    ): void {
        let animationCompleted: boolean = false;

        /*
         * Restore elements left by a previous unfinished animation.
         */
        if (
            typeof this.liveScrollAnimationCleanup === 'function'
        ) {
            this.liveScrollAnimationCleanup();
            this.liveScrollAnimationCleanup = null;
        }

        /*
         * Invalidate any previously scheduled or running animation.
         */
        this.liveScrollAnimationId =
            (this.liveScrollAnimationId || 0) + 1;

        const currentAnimationId: number =
            this.liveScrollAnimationId;

        const completeAnimation: () => void = (): void => {
            if (animationCompleted) {
                return;
            }

            animationCompleted = true;

            if (typeof completed === 'function') {
                completed();
            }
        };

        /*
         * Validate the main series.
         */
        if (
            !chartSeries ||
            !chartSeries.seriesElement ||
            !chartSeries.xAxis ||
            !chartSeries.xAxis.rect
        ) {
            completeAnimation();
            return;
        }

        const previousStart: number =
            Number(oldStart);

        const previousEnd: number =
            Number(oldEnd);

        const finalStart: number =
            Number(newStart);

        const finalEnd: number =
            Number(newEnd);

        /*
         * Validate range values.
         */
        if (
            isNaN(previousStart) ||
            isNaN(previousEnd) ||
            isNaN(finalStart) ||
            isNaN(finalEnd)
        ) {
            completeAnimation();
            return;
        }

        const previousRangeWidth: number =
            previousEnd - previousStart;

        if (
            isNaN(previousRangeWidth) ||
            previousRangeWidth <= 0
        ) {
            completeAnimation();
            return;
        }

        /*
         * Calculate how far the visible range moved.
         */
        let rangeMovement: number =
            finalStart - previousStart;

        if (
            isNaN(rangeMovement) ||
            rangeMovement <= 0
        ) {
            rangeMovement =
                finalEnd - previousEnd;
        }

        if (
            isNaN(rangeMovement) ||
            rangeMovement <= 0
        ) {
            completeAnimation();
            return;
        }

        const axisWidth: number =
            Number(chartSeries.xAxis.rect.width);

        if (
            isNaN(axisWidth) ||
            axisWidth <= 0
        ) {
            completeAnimation();
            return;
        }

        /*
         * Convert range movement into pixels.
         */
        let pixelMovement: number =
            (
                rangeMovement /
                previousRangeWidth
            ) *
            axisWidth;

        pixelMovement = Math.min(
            Math.abs(pixelMovement),
            axisWidth
        );

        if (
            isNaN(pixelMovement) ||
            pixelMovement <= 0.1
        ) {
            completeAnimation();
            return;
        }

        /*
         * Collect the main chart-series visual elements.
         */
        const seriesElements: Element[] =
            this.getLiveSeriesVisualElements(
                chartSeries
            );

        /*
         * Include indicator-series visual elements.
         */
        if (Array.isArray(indicatorTargetSeries)) {
            for (
                let targetIndex: number = 0;
                targetIndex <
                indicatorTargetSeries.length;
                targetIndex++
            ) {
                const targetSeries: Series =
                    indicatorTargetSeries[targetIndex as number];

                if (!targetSeries) {
                    continue;
                }

                const targetElements: Element[] = [
                    targetSeries.seriesElement,
                    targetSeries.symbolElement,
                    targetSeries.shapeElement,
                    targetSeries.textElement
                ];

                for (
                    let targetElementIndex: number = 0;
                    targetElementIndex <
                    targetElements.length;
                    targetElementIndex++
                ) {
                    const targetElement: Element =
                        targetElements[
                            targetElementIndex as number
                        ];

                    if (
                        targetElement &&
                        seriesElements.indexOf(
                            targetElement
                        ) === -1
                    ) {
                        seriesElements.push(
                            targetElement
                        );
                    }
                }
            }
        }

        /*
         * Collect the X-axis visual elements.
         */
        const axisElements: Element[] =
            this.getLiveXAxisElements();

        if (
            seriesElements.length === 0 &&
            axisElements.length === 0
        ) {
            completeAnimation();
            return;
        }

        const seriesTransforms: string[] = [];
        const axisTransforms: string[] = [];

        /*
         * Save the original series transforms.
         */
        for (
            let elementIndex: number = 0;
            elementIndex < seriesElements.length;
            elementIndex++
        ) {
            seriesTransforms.push(
                seriesElements[elementIndex as number]
                    .getAttribute('transform') || ''
            );
        }

        /*
         * Save the original X-axis transforms.
         */
        for (
            let elementIndex: number = 0;
            elementIndex < axisElements.length;
            elementIndex++
        ) {
            axisTransforms.push(
                axisElements[elementIndex as number]
                    .getAttribute('transform') || ''
            );
        }

        const appendTranslation: (originalTransform: string, offsetX: number) => string = (
            originalTransform: string,
            offsetX: number
        ): string => {
            const translation: string =
                'translate(' + offsetX + ',0)';

            if (originalTransform) {
                return (
                    originalTransform +
                    ' ' +
                    translation
                );
            }

            return translation;
        };

        /*
         * Restore an element's original transform.
         *
         * Check isConnected because a route change may remove the
         * old SVG element while an animation callback is pending.
         */
        const restoreTransform: (element: Element, originalTransform: string) => void = (
            element: Element,
            originalTransform: string
        ): void => {
            if (!element || !element.isConnected) {
                return;
            }

            if (originalTransform) {
                element.setAttribute(
                    'transform',
                    originalTransform
                );
            } else {
                element.removeAttribute(
                    'transform'
                );
            }
        };

        /*
         * Restore every element to its original transform.
         */
        const restoreElements: () => void = (): void => {
            for (
                let restoreIndex: number = 0;
                restoreIndex <
                seriesElements.length;
                restoreIndex++
            ) {
                restoreTransform(
                    seriesElements[restoreIndex as number],
                    seriesTransforms[restoreIndex as number]
                );
            }

            for (
                let restoreIndex: number = 0;
                restoreIndex <
                axisElements.length;
                restoreIndex++
            ) {
                restoreTransform(
                    axisElements[restoreIndex as number],
                    axisTransforms[restoreIndex as number]
                );
            }
        };

        /*
         * Make cleanup available to a subsequent live update.
         */
        this.liveScrollAnimationCleanup =
            (): void => {
                restoreElements();
                completeAnimation();
            };

        /*
         * Start the series and axis from their previous visual positions.
         */
        for (
            let elementIndex: number = 0;
            elementIndex < seriesElements.length;
            elementIndex++
        ) {
            const element: Element =
                seriesElements[elementIndex as number];

            if (!element || !element.isConnected) {
                continue;
            }

            element.setAttribute(
                'transform',
                appendTranslation(
                    seriesTransforms[elementIndex as number],
                    pixelMovement
                )
            );
        }

        for (
            let elementIndex: number = 0;
            elementIndex < axisElements.length;
            elementIndex++
        ) {
            const element: Element =
                axisElements[elementIndex as number];

            element.setAttribute(
                'transform',
                appendTranslation(
                    axisTransforms[elementIndex as number],
                    pixelMovement
                )
            );
        }

        const animationDuration: number = Math.max(Number(duration), 0);

        /*
         * Skip animation when duration is zero.
         */
        if (animationDuration <= 0) {
            restoreElements();

            if (
                currentAnimationId ===
                this.liveScrollAnimationId
            ) {
                this.liveScrollAnimationCleanup =
                    null;
            }

            completeAnimation();
            return;
        }

        const startAnimation: () => void = (): void => {
            /*
             * Do not start if another update has invalidated
             * this animation.
             */
            if (
                currentAnimationId !==
                this.liveScrollAnimationId
            ) {
                return;
            }

            new EjsAnimation({}).animate(
                createElement('div'),
                {
                    duration: animationDuration,

                    progress: (
                        args: AnimationOptions
                    ): void => {
                        /*
                         * Ignore callbacks from an old animation.
                         */
                        if (
                            currentAnimationId !==
                            this.liveScrollAnimationId
                        ) {
                            return;
                        }

                        let progress: number = 1;

                        if (
                            args &&
                            Number(args.duration) > 0
                        ) {
                            progress =
                                Number(args.timeStamp) /
                                Number(args.duration);
                        }

                        progress = Math.max(
                            0,
                            Math.min(progress, 1)
                        );

                        /*
                         * Ease-in-out animation.
                         */
                        const easedProgress: number =
                            0.5 -
                            Math.cos(
                                progress * Math.PI
                            ) / 2;

                        /*
                         * Reduce the temporary translation to zero.
                         */
                        const currentOffset: number =
                            pixelMovement *
                            (1 - easedProgress);

                        for (
                            let progressIndex: number = 0;
                            progressIndex <
                            seriesElements.length;
                            progressIndex++
                        ) {
                            const element: Element =
                                seriesElements[
                                    progressIndex as number
                                ];

                            if (
                                !element ||
                                !element.isConnected
                            ) {
                                continue;
                            }

                            element.setAttribute(
                                'transform',
                                appendTranslation(
                                    seriesTransforms[
                                        progressIndex as number
                                    ],
                                    currentOffset
                                )
                            );
                        }

                        for (
                            let progressIndex: number = 0;
                            progressIndex <
                            axisElements.length;
                            progressIndex++
                        ) {
                            const element: Element =
                                axisElements[
                                    progressIndex as number
                                ];

                            if (
                                !element ||
                                !element.isConnected
                            ) {
                                continue;
                            }

                            element.setAttribute(
                                'transform',
                                appendTranslation(
                                    axisTransforms[
                                        progressIndex as number
                                    ],
                                    currentOffset
                                )
                            );
                        }
                    },

                    /*
                     * Remove the temporary translation after completion.
                     */
                    end: (): void => {
                        if (
                            currentAnimationId !==
                            this.liveScrollAnimationId
                        ) {
                            return;
                        }

                        restoreElements();

                        this.liveScrollAnimationCleanup =
                            null;

                        completeAnimation();
                    }
                }
            );
        };

        if (
            typeof requestAnimationFrame ===
            'function'
        ) {
            requestAnimationFrame(
                (): void => {
                    startAnimation();
                }
            );
        } else {
            startAnimation();
        }
    }

    /**
     * Get the selected live period.
     *
     * @private
     * @returns {PeriodsModel} - The selected period object
     */
    private getSelectedLivePeriod(): PeriodsModel | null {
        const periods: PeriodsModel[] = this.tempPeriods && this.tempPeriods.length > 0
            ? this.tempPeriods
            : this.periods;

        for (let index: number = 0; index < periods.length; index++) {
            if (periods[index as number].selected) {
                return periods[index as number];
            }
        }

        return null;
    }


    /**
     * Returns the rendered SVG elements belonging to the specified
     * Chart series for use during live-scroll animation.
     *
     * Point-level elements are preferred. If point elements are not
     * available, the method returns the non-clip child elements of
     * the series group.
     *
     * @param {Series} chartSeries - Chart series containing the
     * rendered SVG elements.
     * @returns {Element[]} Rendered series SVG elements.
     * @private
     */
    private getLiveSeriesVisualElements(
        chartSeries: Series
    ): Element[] {

        const result: Element[] = [];

        /*
         * Candle, Column, Hilo, and similar series usually render
         * separate SVG elements for each point.
         */
        const pointElements:
        NodeListOf<Element> =
            chartSeries.seriesElement
                .querySelectorAll(
                    '[id*="_Point_"]'
                );

        for (
            let index: number = 0;
            index < pointElements.length;
            index++
        ) {
            const element: Element =
                pointElements[index as number];

            if (
                result.indexOf(
                    element
                ) === -1
            ) {
                result.push(
                    element
                );
            }
        }

        /*
         * Prefer individual point elements when available.
         */
        if (result.length > 0) {
            return result;
        }

        /*
         * Line, Area, Spline, and similar series may render one or
         * more paths without point-specific element IDs.
         */
        const children:
        HTMLCollection =
            chartSeries.seriesElement
                .children;

        for (
            let index: number = 0;
            index < children.length;
            index++
        ) {
            const element: Element =
                children[index as number];

            const tagName: string =
                element.tagName
                    .toLowerCase();

            const elementId: string =
                element.id || '';

            /*
             * Clip-path and definition elements must not be moved
             * during the live-scroll animation.
             */
            const isClipElement: boolean =
                tagName === 'clippath' ||
                tagName === 'defs' ||
                elementId.indexOf(
                    'ClipRect'
                ) !== -1;

            if (!isClipElement) {
                result.push(
                    element
                );
            }
        }

        return result;
    }

    /**
     * Get the live x-axis elements for animation.
     *
     * @private
     * @returns {SVGElement[]} - Array of x-axis elements
     */
    private getLiveXAxisElements(): Element[] {

        const result: Element[] = [];

        const elements: NodeListOf<Element> =
        this.chart.element
            .querySelectorAll(
                '[id]'
            );

        for (
            let index: number = 0;
            index < elements.length;
            index++
        ) {
            const element: Element =
            elements[index as number];

            const id: string =
            element.id;

            const isXAxisLabel: boolean =
            id.indexOf(
                'AxisLabel_0_'
            ) !== -1;

            const isXAxisLabelGroup: boolean =
            id.indexOf(
                'AxisLabels0'
            ) !== -1;

            const isXAxisTick: boolean =
            id.indexOf(
                'MajorTickLine_0'
            ) !== -1;

            const isXAxisGridLine: boolean =
            id.indexOf(
                'MajorGridLine_0'
            ) !== -1;

            if (
                isXAxisLabel ||
            isXAxisLabelGroup ||
            isXAxisTick ||
            isXAxisGridLine
            ) {
                if (
                    result.indexOf(
                        element
                    ) === -1
                ) {
                    result.push(
                        element
                    );
                }
            }
        }

        return result;
    }

}



