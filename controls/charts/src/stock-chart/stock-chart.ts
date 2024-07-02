import { Component, INotifyPropertyChanged, Property, Complex, Collection, Internationalization, NotifyPropertyChanges, ModuleDeclaration } from '@syncfusion/ej2-base';
import { Browser, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { StockChartModel } from './stock-chart-model';
import { Chart, ZoomSettings, CrosshairSettings } from '../chart/chart';
import { ZoomSettingsModel, CrosshairSettingsModel } from '../chart/chart-model';
import { appendChildElement, redrawElement, titlePositionX, textElement } from '../common/utils/helper';
import { Axis } from '../chart/axis/axis';
import { Series } from '../chart/series/chart-series';
import { Size, Rect, TextOption, measureText, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Periods } from '../common/model/base';
import { IRangeSelectorRenderEventArgs, ITooltipRenderEventArgs, IMouseEventArgs, IPointEventArgs } from '../chart/model/chart-interface';
import { IAxisLabelRenderEventArgs, ISeriesRenderEventArgs, IZoomingEventArgs  } from '../chart/model/chart-interface';
import { PeriodsModel } from '../common/model/base-model';
import { StockTooltipSettings } from '../common/model/base';
import { StockTooltipSettingsModel } from '../common/model/base-model';
import { calculateSize, getElement } from '../common/utils/helper';
import { RangeNavigator } from '../range-navigator/range-navigator';
import { getRangeValueXByPoint } from '../range-navigator/utils/helper';
import { PeriodSelector } from '../common/period-selector/period-selector';
import { CartesianChart } from './renderer/cartesian-chart';
import { RangeSelector } from './renderer/range-selector';
import { ToolBarSelector } from './renderer/toolbar-selector';
import { StockMargin, StockChartArea, StockChartAxis, StockChartRow, StockChartIndexes, StockEventsSettings, IStockLegendRenderEventArgs, IStockLegendClickEventArgs } from './model/base';
import { StockSeries, IStockChartEventArgs, StockChartIndicator, StockChartBorder, IRangeChangeEventArgs } from './model/base';
import { StockChartAnnotationSettings, IStockEventRenderArgs } from './model/base';
import { StockChartAnnotationSettingsModel } from './model/base-model';
import { StockChartFont } from './model/base';
import { StockSeriesModel, StockChartIndicatorModel, StockChartAxisModel, StockChartRowModel } from './model/base-model';
import { StockChartIndexesModel, StockChartFontModel, StockChartAreaModel, StockEventsSettingsModel } from './model/base-model';
import { StockChartBorderModel, StockMarginModel } from './model/base-model';
import { ChartSeriesType, TrendlineTypes, TechnicalIndicators} from '../chart/utils/enum';
import { ChartTheme, SelectionMode } from '../common/utils/enum';
import { ExportType, Alignment } from '../common/utils/enum';
import { getSeriesColor, getThemeColor } from '../common/model/theme';
import { StockEvents } from './renderer/stock-events';
import { IThemeStyle } from '../chart/model/chart-interface';
import { StockChartLegendSettingsModel } from './legend/legend-model';
import { StockLegend, StockChartLegendSettings } from './legend/legend';
import { ColumnSeries, RangeAreaSeries, SeriesModel, SplineRangeAreaSeries, VisibleRangeModel } from './index';

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

    @Complex<StockChartAxisModel>({ name: 'primaryXAxis', valueType: 'DateTime' }, StockChartAxis)
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
     * Triggers before the tooltip for series is rendered.
     *
     * @event tooltipRender
     * @deprecated
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

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
    public tempAvailableSize: Size;
    /** @private */
    public mouseMoveEvent: PointerEvent;
    public isDateTimeCategory: boolean = false;
    public sortedData: number[] = [];
    private visibleRange: VisibleRangeModel = {
        min: 0, max: 0,
        delta: 0, interval: 0
    };
    public isStockChartRendered: boolean = false;

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
                break;
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
    public rangeChanged(updatedStart: number, updatedEnd: number): void {
        // manage chart refresh
        const chartElement: Element = document.getElementById(this.chartObject.id);
        if (chartElement) {
            while (chartElement.firstChild) {
                chartElement.removeChild(chartElement.firstChild);
            }
        }
        this.startValue = updatedStart; this.endValue = updatedEnd;
        this.cartesianChart.initializeChart();
        this.periodSelector.datePicker.startDate = this.isDateTimeCategory ? new Date(this.sortedData[updatedStart as number]) :
            new Date(updatedStart);
        this.periodSelector.datePicker.endDate = this.isDateTimeCategory ? new Date(this.sortedData[updatedEnd as number]) :
            new Date(updatedEnd);
        this.periodSelector.datePicker.dataBind();
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
            const series: StockSeries = this.series[i as number] as StockSeries;
            this.tempSeriesType.push(series.type);
            series.localData = undefined;
        }
        if (this.series.length === 0) {
            this.series.push({});
        }
        this.initialRender = true;
        this.rangeFound = false;
        this.resizeTo = null;
        this.startValue = null; this.endValue = null;
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
        this.renderRangeSelector();
        this.renderPeriodSelector();
        this.trigger('loaded', { stockChart: this });
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
            height: this.availableSize.height - (this.enablePeriodSelector ? this.toolbarHeight : 0) - this.titleSize.height
        });
        this.svgObject = this.mainObject;
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
     */
    private findRange(): void {
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
                    if (!this.legendSettings.visible) {
                        this.mainObject.setAttribute('width', this.availableSize.width.toString());
                    }
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
}
