import { Component, INotifyPropertyChanged, Property, Complex, Collection, Internationalization } from '@syncfusion/ej2-base';
import { SvgRenderer, Browser, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { StockChartModel } from './stock-chart-model';
import { Chart } from '../chart/index';
import { Size, RangeNavigator, IThemeStyle, appendChildElement, redrawElement, Series } from '../index';
import { Axis } from '../chart/index';
import { Periods } from '../common/model/base';
import { IRangeSelectorRenderEventArgs, ITooltipRenderEventArgs } from '../common/model/interface';
import { IAxisLabelRenderEventArgs, ISeriesRenderEventArgs } from '../common/model/interface';
import { PeriodsModel } from '../common/model/base-model';
import { ChartTheme } from '../chart/index';
import { CrosshairSettings, CrosshairSettingsModel, TooltipSettings, TooltipSettingsModel } from '../chart/index';
import { ZoomSettings, ZoomSettingsModel } from '../chart/index';
import { calculateSize, getElement } from '../common/utils/helper';
import { getRangeValueXByPoint } from '../range-navigator/index';
import { PeriodSelector } from '../common/period-selector/period-selector';
import { CartesianChart } from './renderer/cartesian-chart';
import { RangeSelector } from './renderer/range-selector';
import { ToolBarSelector } from './renderer/toolbar-selector';
import { SelectionMode } from '../index';
import { StockMargin, StockChartArea, StockChartAxis, StockChartRow, StockChartIndexes } from './model/base';
import { StockSeries, IStockChartEventArgs, StockChartIndicator, StockChartBorder } from './model/base';
import { StockChartAnnotationSettings } from './model/base';
import { StockChartAnnotationSettingsModel} from './model/base-model';
import { StockChartFont } from './model/base';
import { StockSeriesModel, StockChartIndicatorModel, StockChartAxisModel, StockChartRowModel } from './model/base-model';
import { StockChartIndexesModel, StockChartFontModel, StockChartAreaModel } from './model/base-model';
import { StockChartBorderModel, StockMarginModel } from './model/base-model';
import { ChartSeriesType, ExportType, TrendlineTypes, TechnicalIndicators } from '../index';
import { textElement, titlePositionX, Rect, Alignment, TextOption, measureText } from '../index';
import { getThemeColor } from '../common/model/theme';

/**
 * Stock Chart
 */

export class StockChart extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * The width of the stockChart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full width of its parent element.
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the stockChart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full height of its parent element.
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
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Specifies the theme for the stockChart.
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

    @Complex<StockChartAxisModel>({ name: 'primaryYAxis', opposedPosition: true, labelPosition : 'Inside' }, StockChartAxis)
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
     * It specifies whether the stockChart should be render in transposed manner or not.
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * Title of the chart
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the title of the Chart.
     */

    // tslint:disable-next-line:max-line-length
    @Complex<StockChartFontModel>({size: '15px', fontWeight: '500', color: null,  fontStyle: 'Normal', fontFamily: 'Segoe UI'}, StockChartFont)
    public titleStyle: StockChartFontModel;
    /**
     * Defines the collection of technical indicators, that are used in financial markets
     */
    @Collection<StockChartIndicatorModel>([], StockChartIndicator)
    public indicators: StockChartIndicatorModel[];
    /**
     * Options for customizing the tooltip of the chart.
     */

    @Complex<TooltipSettingsModel>({shared : true, enableMarker : false}, TooltipSettings)
    public tooltip: TooltipSettingsModel;


    /**
     * Options for customizing the crosshair of the chart.
     */
    @Complex<CrosshairSettingsModel>({dashArray : '5'}, CrosshairSettings)
    public crosshair: CrosshairSettingsModel;

    /**
     * Options to enable the zooming feature in the chart.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;

    /**
     * It specifies whether the periodSelector to be rendered in financial chart
     * @default true
     */
    @Property(true)
    public enablePeriodSelector: boolean;

    /**
     * Custom Range
     * @default true
     */
    @Property(true)
    public enableCustomRange: boolean;

    /**
     * If set true, enables the animation in chart.
     * @default false
     */
    @Property(false)
    public isSelect: boolean;

    /**
     * It specifies whether the range navigator to be rendered in financial chart
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
     * @event
     */
    @Event()
    public selectorRender: EmitType<IRangeSelectorRenderEventArgs>;

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
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * @default false
     */
    @Property(false)
    public isSingleAxis: boolean;

    /**
     * Triggers before the range navigator rendering
     * @event
     */
    @Event()
    public load: EmitType<IStockChartEventArgs>;

    /**
     * Triggers after the range navigator rendering
     * @event
     */
    @Event()
    public loaded: EmitType<IStockChartEventArgs>;

    /**
     * Triggers before each axis label is rendered.
     * @event
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before the tooltip for series is rendered.
     * @event
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     */

    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;

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
    @Collection<StockChartIndexesModel>([], StockChartIndexes)
    public selectedDataIndexes: StockChartIndexesModel[];

    /**
     * It specifies the types of series in financial chart.
     */
    @Property(['Line', 'Hilo', 'HiloOpenClose', 'Hollow Candle', 'Spline', 'Candle'])
    public seriesType: ChartSeriesType[];

    /**
     * It specifies the types of indicators in financial chart.
     */
    @Property(['EMA', 'TMA', 'SMA', 'Momentum', 'ATR', 'Accumulation Distribution', 'Bollinger Bands', 'MACD', 'Stochastic', 'RSI'])
    public indicatorType: TechnicalIndicators[];

    /**
     * It specifies the types of Export types in financial chart.
     */
    @Property(['PNG', 'JPEG', 'SVG', 'PDF', 'Print'])
    public exportType: ExportType[];

    /**
     * It specifies the types of trendline types in financial chart.
     */
    @Property(['Linear', 'Exponential', 'Polynomial', 'Power', 'Logarithmic', 'MovingAverage'])
    public trendlineType: TrendlineTypes[];


    /** @private */
    public startValue: number;
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
    private resizeTo: number;
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
    /** @private */
    public tempDataSource: Object[] = [];
    /** @private */
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
    public toolbarHeight: number = Browser.isDevice ? 56 : 42;
    /** @private */
    public stockChartTheme: IThemeStyle;

    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options?: StockChartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: StockChartModel, oldProp: StockChartModel): void {
        //
    }
    /**
     * To change the range for chart
     */
    public rangeChanged(updatedStart: number, updatedEnd: number): void {
        // manage chart refresh
        this.chart.series.forEach((series: Series) => {
            series.dataSource = (this.tempDataSource[series.index] as Object[]).filter((data: Object) => {
                return (
                    data[series.xName].getTime() >= updatedStart && data[series.xName].getTime() <= updatedEnd
                );
            });
            series.animation.enable = false;
        });
        let chartElement: Element = document.getElementById(this.chartObject.id);
        if (chartElement) {
            while (chartElement.firstChild) {
                chartElement.removeChild(chartElement.firstChild);
            }
        }
        this.startValue = updatedStart; this.endValue = updatedEnd;
        this.cartesianChart.initializeChart();
        this.periodSelector.datePicker.startDate = new Date(updatedStart);
        this.periodSelector.datePicker.endDate = new Date(updatedEnd);
        this.periodSelector.datePicker.dataBind();
    }
    /**
     * Pre render for financial Chart
     */
    protected preRender(): void {
        this.unWireEvents();
        this.initPrivateVariable();
        this.setCulture();
        this.stockChartTheme = getThemeColor(this.theme);
        this.wireEvents();
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

        EventHandler.remove(this.element, startEvent, this.stockChartOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.stockChartMouseMove);
        EventHandler.remove(this.element, stopEvent, this.stockChartMouseEnd);
        EventHandler.remove(this.element, 'click', this.stockChartOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.stockChartRightClick);
        EventHandler.remove(this.element, cancelEvent, this.stockChartMouseLeave);

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.stockChartResize
        );

    }


    private wireEvents(): void {
        /*! Find the Events type */

        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.stockChartOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.stockChartMouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.stockChartMouseEnd, this);
        EventHandler.add(this.element, 'click', this.stockChartOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.stockChartRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.stockChartMouseLeave, this);

        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.stockChartResize.bind(this)
        );
        this.setStyle(this.element);
    }

    private initPrivateVariable(): void {
        if (this.element.id === '') {
            let collection: number = document.getElementsByClassName('e-stockChart').length;
            this.element.id = 'stockChart_' + this.chartid + '_' + collection;
        }
    }

    /**
     * Method to set culture for chart
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    private storeDataSource(): void {
        this.series.forEach((series: Series) => {
            this.tempDataSource.push(series.dataSource);
            this.tempSeriesType.push(series.type);
        });
    }

    /**
     * To Initialize the control rendering.
     */

    protected render(): void {
        this.trigger('load', { stockChart: this });
        this.storeDataSource();
        this.drawSVG();
        this.renderTitle();
        this.chartModuleInjection();
        this.chartRender();
        this.findRange();
        this.renderRangeSelector();
        this.renderPeriodSelector();
        this.trigger('loaded', { stockChart: this });
    }
    /**
     * To set styles to resolve mvc width issue.
     * @param element
     */
    private setStyle(element: HTMLElement): void {
        let zooming: ZoomSettingsModel = this.zoomSettings;
        let disableScroll: boolean = zooming.enableSelectionZooming || zooming.enablePinchZooming ||
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
        //overall svg in which chart and selector appened
        this.mainObject = this.renderer.createSvg({
            id: this.element.id + '_stockChart_svg',
            width: this.availableSize.width,
            height: this.availableSize.height - (this.enablePeriodSelector ? this.toolbarHeight : 0) - this.titleSize.height
        });
        this.svgObject = this.mainObject;
        this.element.appendChild(this.mainObject);
    }

    private createSecondaryElements(): void {
        let tooltipDiv: Element = redrawElement(false, this.element.id + '_Secondary_Element') ||
            this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        if (this.title) {
            this.titleSize = measureText(this.title, this.titleStyle);
            this.titleSize.height += 15;  // for title padding
        } else {
            this.titleSize = { height: null, width: null };
        }
        let height: number = (this.enablePeriodSelector ? this.toolbarHeight : 0) + this.titleSize.height;
        tooltipDiv.setAttribute('style', 'position: relative; height:' + height + 'px');
        appendChildElement(this.element, tooltipDiv, false);
    }

    /**
     * Render period selector
     */
    public renderPeriodSelector(): void {
        if (this.enablePeriodSelector) {
            this.toolbarSelector.initializePeriodSelector();
            if (!this.enableSelector) {
                this.cartesianChart.cartesianChartRefresh(this, this.startValue, this.endValue);
            }
        }
    }

    private chartRender(): void {
        this.cartesianChart = new CartesianChart(this);
        this.cartesianChart.initializeChart();
    }

    /**
     * To render range Selector
     */
    private renderRangeSelector(): void {
        //SVG in which range navigator is going to append
        if (this.enableSelector) {
            this.rangeSelector = new RangeSelector(this);
            this.rangeSelector.initializeRangeNavigator();
        }
    }

    /**
     * Get component name
     */
    public getModuleName(): string {
        return 'stockChart';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return '';
    }

    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    public removeSvg(): void {
        if (document.getElementById(this.element.id + '_Secondary_Element')) {
            remove(document.getElementById(this.element.id + '_Secondary_Element'));
        }
        let removeLength: number = 0;
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
     * Module Injection for components
     */

    public chartModuleInjection(): void {
        let moduleName: string;
        for (let modules of this.getInjectedModules()) {
            moduleName = modules.prototype.getModuleName().toLowerCase();
            if (moduleName.indexOf('range') === -1) {
                Chart.Inject(modules);
            } else {
                RangeNavigator.Inject(modules);
            }
            if (moduleName === 'datetime' || moduleName === 'areaseries') {
                RangeNavigator.Inject(modules);
            }
        }
    }

    /**
     * find range for financal chart
     */
    private findRange(): void {
        this.seriesXMin = Infinity; this.seriesXMax = -Infinity;
        for (let axis of this.chart.axisCollections) {
            if (axis.orientation === 'Horizontal') {
                this.seriesXMin = Math.min(this.seriesXMin, axis.visibleRange.min);
                this.seriesXMax = Math.max(this.seriesXMax, axis.visibleRange.max);
            }
            this.endValue = this.currentEnd = this.seriesXMax;
            if (this.enablePeriodSelector) {
                this.toolbarSelector = new ToolBarSelector(this);
                this.periodSelector = new PeriodSelector(this);
                this.periods = this.periods.length ? this.periods : this.toolbarSelector.calculateAutoPeriods();
                this.periods.map((period: PeriodsModel, index: number) => {
                    if (period.selected && period.text.toLowerCase() === 'ytd') {
                        this.startValue = new Date(new Date(this.currentEnd).getFullYear().toString()).getTime();
                    } else if (period.selected && period.text.toLowerCase() === 'all') {
                        this.startValue = this.seriesXMin;
                    } else if (period.selected) {
                        this.startValue = this.periodSelector.changedRange(
                            period.intervalType, this.endValue, period.interval
                        ).getTime();
                    }
                });
            } else {
                this.startValue = this.seriesXMin;
            }
        }
    }

    /**
     * Handles the chart resize.
     * @return {boolean}
     * @private
     */
    public stockChartResize(e: Event): boolean {
        this.animateSeries = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(
            (): void => {
                calculateSize(this);
                this.renderBorder();
                this.renderTitle();
                this.cartesianChart.cartesianChartRefresh(this, this.startValue, this.endValue);
                this.mainObject.setAttribute('width', this.availableSize.width.toString());
                if (this.enablePeriodSelector) {
                    this.renderPeriodSelector();
                }
            },
            500);
        return false;

    }

    /**
     * Handles the mouse down on chart.
     * @return {boolean}
     * @private
     */
    public stockChartOnMouseDown(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        let offset: number = Browser.isDevice ? 20 : 30;
        let rect: ClientRect = this.chart.element.getBoundingClientRect();
        let element: Element = <Element>e.target;
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
            let svgRect: ClientRect = getElement(this.element.id + '_stockChart_chart').getBoundingClientRect();

            this.mouseDownY = this.previousMouseMoveY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
            this.mouseDownX = this.previousMouseMoveX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
            this.setMouseXY(this.mouseDownX, this.mouseDownY);
            this.referenceXAxis = this.chart.primaryXAxis as Axis;
            getElement(this.element.id + '_stockChart_chart').setAttribute('cursor', 'pointer');
            this.mouseDownXPoint = getRangeValueXByPoint(this.mouseX - this.referenceXAxis.rect.x, this.referenceXAxis.rect.width,
                                                         this.referenceXAxis.visibleRange, this.referenceXAxis.isInversed);
            this.allowPan = true;
            this.notify(Browser.touchStartEvent, e);
        }
        return false;
    }
    /**
     * Handles the mouse up.
     * @return {boolean}
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
     * @return {boolean}
     * @private
     */

    public stockChartOnMouseUp(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        //this.trigger(chartMouseUp, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        this.allowPan = false;
        if (this.isTouch) {
            //this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            //this.axisTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.threshold = new Date().getTime() + 300;
        }
        this.notify(Browser.touchEndEvent, e);
        return false;
    }

    /**
     * To find mouse x, y for aligned chart element svg position
     */
    private setMouseXY(pageX: number, pageY: number): void {
        let svgRect: ClientRect = getElement(this.element.id + '_stockChart_chart').getBoundingClientRect();
        let rect: ClientRect = this.element.getBoundingClientRect();
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
    }

    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    public stockChartMouseMove(e: PointerEvent): boolean {
        let pageX: number;
        let touchArg: TouchEvent; let pageY: number;
        if (e.type === 'touchmove') {
            this.isTouch = true; touchArg = <TouchEvent & PointerEvent>e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
            pageX = e.clientX; pageY = e.clientY;
        }
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseMove(e);
        return false;
    }

    /**
     * Handles the mouse move on chart.
     * @return {boolean}
     * @private
     */
    public chartOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        if (this.allowPan && this.mouseDownXPoint && this.mouseX !== this.previousMouseMoveX && this.zoomSettings.enablePan) {
            this.onPanning = true;
            getElement(this.element.id + '_stockChart_chart').setAttribute('cursor', 'pointer');
            this.mouseUpXPoint = getRangeValueXByPoint(this.mouseX - this.referenceXAxis.rect.x, this.referenceXAxis.rect.width,
                                                       this.referenceXAxis.visibleRange, this.referenceXAxis.isInversed);
            let diff: number = Math.abs(this.mouseUpXPoint - this.mouseDownXPoint);

            if (this.mouseDownXPoint < this.mouseUpXPoint) {
                if (this.seriesXMin <= this.referenceXAxis.visibleRange.min - diff) {
                    this.cartesianChart.cartesianChartRefresh(this, this.referenceXAxis.visibleRange.min - diff,
                                                              this.referenceXAxis.visibleRange.max - diff);
                    this.rangeSelector.sliderChange(this.referenceXAxis.visibleRange.min - diff,
                                                    this.referenceXAxis.visibleRange.max - diff);
                }
            } else {
                if (this.seriesXMax >= this.referenceXAxis.visibleRange.max + diff) {
                    this.cartesianChart.cartesianChartRefresh(this, this.referenceXAxis.visibleRange.min + diff,
                                                              this.referenceXAxis.visibleRange.max + diff);
                    this.rangeSelector.sliderChange(this.referenceXAxis.visibleRange.min + diff,
                                                    this.referenceXAxis.visibleRange.max + diff);
                }
            }

        }
        this.notify(Browser.touchMoveEvent, e);
        if ((<HTMLElement>e.target).id.indexOf(this.element.id + '_stockChart_chart') === -1) {
            let element : HTMLElement;
            if (this.chart.tooltip.enable || this.crosshair.enable) {
                element = document.getElementById('chart_stockChart_chart_tooltip');
                if (element) {
                    element.remove();
                }
            }
        }
        this.isTouch = false;
        return false;
    }

    /**
     * Handles the mouse click on chart.
     * @return {boolean}
     * @private
     */
    public stockChartOnMouseClick(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        // this.trigger(chartMouseClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        // if (this.pointClick) {
        //     this.triggerPointEvent(pointClick);
        // }
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
     * @return {boolean}
     * @private
     */
    public stockChartMouseLeave(e: PointerEvent): boolean {
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
        this.stockChartOnMouseLeave(e);
        return false;
    }

    /**
     * Handles the mouse leave on chart.
     * @return {boolean}
     * @private
     */
    public stockChartOnMouseLeave(e: PointerEvent | TouchEvent): boolean {
        let element: Element = <Element>e.target;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        //this.trigger(chartMouseLeave, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        this.notify(cancelEvent, e);
        return false;
    }

    /**
     * Destroy method
     */
    public destroy(): void {
        //Perform destroy here
    }

    private renderBorder() : void {
        if (this.border.width) {
            let border: HTMLElement = this.createElement('div');
            border.id = this.element.id + '_stock_border';
            border.style.width = (this.availableSize.width) + 'px';
            border.style.height = (this.availableSize.height)  + 'px';
            border.style.position = 'absolute';
            border.style.border = this.border.width + 'px solid ' + this.border.color;
            border.style.pointerEvents = 'none';
            appendChildElement(getElement(this.element.id), border);
        }
    }

    /**
     * Render title for chart
     */
    private renderTitle(): void {
        let rect: Rect;
        if (this.title) {
            appendChildElement(
                getElement(this.element.id + '_Secondary_Element'),
                this.renderer.createSvg({
                    id: this.element.id + '_stockChart_Title',
                    width: this.availableSize.width,
                    height: this.titleSize.height,
                    fill: this.background || this.stockChartTheme.background
                }),
                false);
            let alignment: Alignment = this.titleStyle.textAlignment;
            let getAnchor: string = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
            rect = new Rect(
                0, 0, this.availableSize.width, 0
            );
            let options: TextOption = new TextOption(
                this.element.id + '_ChartTitle',
                titlePositionX(rect, this.titleStyle),
                ((this.titleSize.height - 10)),
                getAnchor, this.title, '', 'auto'
            );
            let element: Element = textElement(
                options, this.titleStyle, this.titleStyle.color || this.findTitleColor(),
                getElement(this.element.id + '_stockChart_Title'), false, false
            );
            this.availableSize.height -= (this.titleSize.height + 5);
        }
    }
    private findTitleColor() : string {
        if (this.theme.indexOf('Highcontrast') > -1 || this.theme.indexOf('Dark') > -1) {
            return '#ffffff';
        }
        return '#424242';
    }
}