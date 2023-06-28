/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
import { Component, Property, NotifyPropertyChanges, Complex, Collection, Browser } from '@syncfusion/ej2-base';
import { EventHandler, remove, ModuleDeclaration, Internationalization } from '@syncfusion/ej2-base';
import { Event, EmitType } from '@syncfusion/ej2-base';
import { RangeNavigatorModel } from './range-navigator-model';
import { createSvg, removeElement } from '../common/utils/helper';
import { Rect, measureText, Size, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { RangeTooltip } from '../range-navigator/user-interaction/tooltip';
import { Border, Margin, PeriodSelectorSettings } from '../common/model/base';
import { BorderModel, MarginModel, PeriodSelectorSettingsModel } from '../common/model/base-model';
import { RangeSeries } from './renderer/chart-render';
import { RangeNavigatorAxis } from './renderer/range-axis';
import { RangeNavigatorSeries, StyleSettings, RangeTooltipSettings } from './model/range-base';
import { RangeNavigatorSeriesModel, StyleSettingsModel } from './model/range-base-model';
import { ThumbSettingsModel, RangeTooltipSettingsModel } from './model/range-base-model';
import { RangeSlider } from './renderer/slider';
import { RectOption, getElement} from '../common/utils/helper';
import { LineSeries } from '../chart/series/line-series';
import { AreaSeries } from '../chart/series/area-series';
import { StepLineSeries } from '../chart/series/step-line-series';
import { Chart } from '../chart/chart';
import { IResizeRangeNavigatorEventArgs } from '../range-navigator/model/range-navigator-interface';
import { DateTime } from '../chart/axis/date-time-axis';
import { Logarithmic } from '../chart/axis/logarithmic-axis';
import { ILabelRenderEventsArgs, IRangeTooltipRenderEventArgs } from './model/range-navigator-interface';
import { IRangeLoadedEventArgs, IRangeStyle, IChangedEventArgs, IRangeBeforeResizeEventArgs } from './model/range-navigator-interface';
import { beforeResize } from '../common/model/constants';
import { getRangeThemeColor } from './utils/theme';
import { RangeValueType, LabelAlignment, RangeLabelIntersectAction, NavigatorPlacement } from './utils/enum';
import { Font } from '../common/model/base';
import { FontModel } from '../common/model/base-model';
import { MajorGridLines, MajorTickLines, VisibleRangeModel } from '../chart/axis/axis';
import { MajorGridLinesModel, MajorTickLinesModel } from '../chart/axis/axis-model';
import { SkeletonType, AxisPosition, ChartTheme } from '../chart/utils/enum';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Double } from '../chart/axis/double-axis';
import { Data } from '../common/model/data';
import { ExportUtils } from '../common/utils/export';
import { RangeIntervalType, ExportType } from '../common/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { PeriodSelector } from '../common/period-selector/period-selector';
import { AccumulationChart } from '../accumulation-chart/accumulation';
import { IRangeSelectorRenderEventArgs, IPrintEventArgs } from '../chart/model/chart-interface';
import { StockChart } from '../stock-chart/stock-chart';

/**
 * Range Navigator
 */
@NotifyPropertyChanges
export class RangeNavigator extends Component<HTMLElement> {

    //Module Declaration of Chart.
    /**
     * `lineSeriesModule` is used to add line series to the chart.
     */
    public lineSeriesModule: LineSeries;

    /**
     * `areaSeriesModule` is used to add area series in the chart.
     */
    public areaSeriesModule: AreaSeries;

    /**
     * `stepLineSeriesModule` is used to add stepLine series in the chart.
     */
    public stepLineSeriesModule: StepLineSeries;

    /**
     * `datetimeModule` is used to manipulate and add dateTime axis to the chart.
     */
    public dateTimeModule: DateTime;

    /**
     * `doubleModule` is used to manipulate and add double axis to the chart.
     */
    public doubleModule: Double;
    /**
     * `logarithmicModule` is used to manipulate and add log axis to the chart.
     */
    public logarithmicModule: Logarithmic;
    /**
     * `tooltipModule` is used to manipulate and add tooltip to the series.
     */
    public rangeTooltipModule: RangeTooltip;
    /**
     * `periodSelectorModule` is used to add period selector un range navigator
     */
    public periodSelectorModule: PeriodSelector;

    /**
     * The width of the range navigator as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, range navigator renders to the full width of its parent element.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, range navigator renders to the full height of its parent element.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public height: string;

    /**
     * It defines the data source for a range navigator.
     *
     * @default null
     */
    @Property(null)
    public dataSource: Object | DataManager;

    /**
     * It defines the xName for the range navigator.
     *
     * @default null
     */
    @Property(null)
    public xName: string;

    /**
     * It defines the yName for the range navigator.
     *
     * @default null
     */
    @Property(null)
    public yName: string;

    /**
     * It defines the query for the data source.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * It defines the configuration of series in the range navigator
     */
    @Collection<RangeNavigatorSeriesModel>([], RangeNavigatorSeries)
    public series: RangeNavigatorSeriesModel[];

    /**
     * Options for customizing the tooltip of the chart.
     */

    @Complex<RangeTooltipSettingsModel>({}, RangeTooltipSettings)
    public tooltip: RangeTooltipSettingsModel;

    /**
     * Minimum value for the axis
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public minimum: number | Date;

    /**
     * Maximum value for the axis
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public maximum: number | Date;

    /**
     * interval value for the axis.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public interval: number;

    /**
     * IntervalType for the dateTime axis.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public intervalType: RangeIntervalType;

    /**
     * Specifies, when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     *
     * @default Hide
     */

    @Property('Hide')
    public labelIntersectAction: RangeLabelIntersectAction;

    /**
     * base value for log axis.
     *
     * @default 10
     */
    @Property(10)
    public logBase: number;

    /**
     * ValueType for the axis
     *
     * @default 'Double'
     */
    @Property('Double')
    public valueType: RangeValueType;

    /**
     * Label positions for the axis.
     *
     * @default 'Outside'
     */
    @Property('Outside')
    public labelPosition: AxisPosition;
    
    /**
     * Specifies the placement of labels to the axis line. They are, 
     * betweenTicks - Render the label between the ticks. 
     * onTicks - Render the label on the ticks. 
     * auto - Render the label between or on the tick based on data.
     * 
     * @default 'Auto' 
     */ 
    @Property('Auto') 
    public labelPlacement: NavigatorPlacement; 

    /**
     * Duration of the animation.
     *
     * @default 500
     */
    @Property(500)
    public animationDuration: number;

    /**
     * Enable grouping for the labels.
     *
     * @default false
     */
    @Property(false)
    public enableGrouping: boolean;

    /**
     * Enable deferred update for the range navigator.
     *
     * @default false
     */
    @Property(false)
    public enableDeferredUpdate: boolean;

    /**
     * To render the period selector with out range navigator.
     *
     * @default false
     */
    @Property(false)
    public disableRangeSelector: boolean;

    /**
     * Enable snapping for range navigator sliders.
     *
     * @default false
     */
    @Property(false)
    public allowSnapping: boolean;

    /**
     * Allow the data to be selected for that particular interval while clicking the particular label.
     */
    @Property(false)
    public allowIntervalData: boolean;

    /**
     * Specifies whether a grouping separator should be used for a number.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * GroupBy property for the axis.
     *
     * @default `Auto`
     */
    @Property()
    public groupBy: RangeIntervalType;

    /**
     * Tick Position for the axis
     *
     * @default 'Outside'
     */
    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * Label style for the labels.
     */
    @Complex<FontModel>({fontFamily: null, size: "12px", fontStyle: 'Normal', fontWeight: '400', color: null}, Font)
    public labelStyle: FontModel;

    /**
     * MajorGridLines
     */
    @Complex<MajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: MajorGridLinesModel;

    /**
     * MajorTickLines
     */
    @Complex<MajorTickLinesModel>({}, MajorTickLines)
    public majorTickLines: MajorTickLinesModel;
    /**
     * Navigator style settings
     */
    @Complex<StyleSettingsModel>({}, StyleSettings)
    public navigatorStyleSettings: StyleSettingsModel;
    /**
     * Period selector settings
     */
    @Complex<PeriodSelectorSettingsModel>({}, PeriodSelectorSettings)
    public periodSelectorSettings: PeriodSelectorSettingsModel;

    /**
     * Options for customizing the color and width of the chart border.
     */
    @Complex<BorderModel>({ color: null, width: 1 }, Border)
    public navigatorBorder: BorderModel;

    /**
     * Specifies the theme for the range navigator.
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Selected range for range navigator.
     *
     * @default []
     */
    @Property([])
    public value: number[] | Date[];

    /**
     * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     *
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the skeleton format in which the dateTime format will process.
     *
     * @default ''
     */

    @Property('')
    public skeleton: string;

    /**
     * It specifies the type of format to be used in dateTime format process.
     *
     * @default 'DateTime'
     */

    @Property('DateTime')
    public skeletonType: SkeletonType;

    /**
     * It specifies the label alignment for secondary axis labels
     *
     * @default 'Middle'
     */

    @Property('Middle')
    public secondaryLabelAlignment: LabelAlignment;

    /**
     * Margin for the range navigator
     *
     * @default
     */
    @Complex<MarginModel>({ top: 5, bottom: 5, right: 5, left: 5 }, Margin)
    public margin: MarginModel;

    /** @private */
    public themeStyle: IRangeStyle;

    /**
     * Triggers before the range navigator rendering.
     *
     * @event load
     */
    @Event()
    public load: EmitType<IRangeLoadedEventArgs>;

    /**
     * Triggers after the range navigator rendering.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<IRangeLoadedEventArgs>;

    /**
     * Triggers after the range navigator resized
     *
     * @event resized
     * @blazorProperty 'Resized'
     */
    @Event()
    public resized: EmitType<IResizeRangeNavigatorEventArgs>;

    /**
     * Triggers before window resize.
     *
     * @event
     * @blazorProperty 'BeforeResize'
     */
    @Event()
    public beforeResize: EmitType<IRangeBeforeResizeEventArgs>;

    /**
     * Triggers before the label rendering.
     *
     * @event labelRender
     * @deprecated
     */
    @Event()
    public labelRender: EmitType<ILabelRenderEventsArgs>;
    /**
     * Triggers after change the slider.
     *
     * @event changed
     * @blazorProperty 'Changed'
     */
    @Event()
    public changed: EmitType<IChangedEventArgs>;
    /**
     * Triggers before the tooltip for series is rendered.
     *
     * @event tooltipRender
     * @deprecated
     */

    @Event()
    public tooltipRender: EmitType<IRangeTooltipRenderEventArgs>;

    /**
     * Triggers before the range navigator selector rendering.
     *
     * @event selectorRender
     * @deprecated
     */
    @Event()
    public selectorRender: EmitType<IRangeSelectorRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     * @blazorProperty 'OnPrint'
     */

    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public svgObject: HTMLElement;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public bounds: Rect;
    /** @private */
    public availableSize: Size;
    /** @private */
    public startValue: number;
    /** @private */
    public endValue: number;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseDownX: number;
    /** @private */
    public rangeSlider: RangeSlider;
    /** @private */
    public chartSeries: RangeSeries;
    /** @private */
    public rangeAxis: RangeNavigatorAxis;
    /** @private */
    private resizeTo: number;
    /** @private */
    public dataModule: Data;
    /** @private */
    public labels: ILabelRenderEventsArgs[];
    /** @private */
    public animateSeries: boolean = true;
    /** @private */
    public format: Function;
    private chartid: number = 57725;
    /** @private */
    public stockChart: StockChart;
    redraw: boolean = false;

    /**
     * Constructor for creating the widget
     *
     * @hidden
     */
    constructor(options?: RangeNavigatorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Starting point of the control initialization
     */
    public preRender(): void {
        this.unWireEvents();
        this.setCulture();
        this.allowServerDataBinding = false;
        if (this.periodSelectorModule) {
            this.periodSelectorModule.selectedIndex = null;
        }
        if (this.element.id === '') {
            const collection : number = document.getElementsByClassName('e-rangenavigator').length;
            this.element.id = 'rangenavigator_' + this.chartid + '_' + collection;
        }
        this.wireEvents();
    }

    /**
     * To initialize the private variables
     */
    private initPrivateVariables(): void {
        this.doubleModule = new Double();
        this.labels = [];
        this.rangeSlider = new RangeSlider(this);
        this.chartSeries = new RangeSeries(this);
        this.lineSeriesModule = new LineSeries();
        this.rangeAxis = new RangeNavigatorAxis(this);
    }

    /**
     * Method to set culture for chart
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * to initialize the slider
     */
    private setSliderValue(): void {
        const isDateTime: boolean = this.valueType === 'DateTime';
        const range: VisibleRangeModel = this.chartSeries.xAxis.actualRange;
        this.startValue = this.startValue ? this.startValue : (!this.value[0] ? range.min :
            (isDateTime ? (new Date(this.value[0].toString())).getTime() : +this.value[0]));
        this.endValue = this.endValue ? this.endValue : (!this.value[1] ? range.max :
            (isDateTime ? (new Date(this.value[1].toString())).getTime() : +this.value[1]));
    }

    /**
     * To render the range navigator
     */
    public render(): void {
        const loadEventData: IRangeLoadedEventArgs = {
            name: 'load', rangeNavigator: this,
            theme: this.theme
        };
        this.trigger('load', loadEventData, () => {
            //this.theme = this.theme;
            this.setTheme();
            this.initPrivateVariables();
            this.createRangeSvg();
            this.calculateBounds();
            this.chartSeries.renderChart(this);
            removeElement('chartmeasuretext');
            this.renderComplete();
            this.allowServerDataBinding = true;
        });

    }

    /**
     * Theming for rangeNavigator
     */

    private setTheme(): void {
        /*! Set theme */
        this.themeStyle = getRangeThemeColor(this.theme, this);
    }

    /**
     * Method to create SVG for Range Navigator
     */
    private createRangeSvg(): void {
        this.removeSvg();
        createSvg(this);
        this.renderChartBackground();
    }

    /**
     * Bounds calculation for widget performed.
     */
    private calculateBounds(): void {
        const labelPadding: number = this.enableGrouping ? 15 : 8;
        const thumb: ThumbSettingsModel = this.navigatorStyleSettings.thumb;
        const labelSize: number = measureText('tempString', this.labelStyle, this.themeStyle.axisLabelFont).height;
        const margin: MarginModel = this.margin;
        const isLeightWeight: boolean = !this.series.length;
        const tooltipSpace: number = (!this.disableRangeSelector) &&
            isLeightWeight && this.tooltip.enable ? 35 : 0;
        if (!this.periodSelectorModule && this.periodSelectorSettings.periods.length && !this.stockChart) {
            this.periodSelectorModule = new PeriodSelector(this);
        }
        const selector: PeriodSelector = this.periodSelectorModule;
        if (this.periodSelectorModule && this.periodSelectorSettings.periods.length > 0) {
            selector.periodSelectorSize = { x: 0, y: 0, height: 0, width: 0 };
            selector.periodSelectorSize.width = this.availableSize.width;
            selector.periodSelectorSize.height = this.periodSelectorSettings.height;
            selector.periodSelectorSize.y = this.periodSelectorSettings.position === 'Bottom' ?
                this.availableSize.height - selector.periodSelectorSize.height : 0;
        }
        const periodSelectorY: number = this.periodSelectorSettings.position === 'Top' && selector ?
            selector.periodSelectorSize.y + selector.periodSelectorSize.height : 0;
        let left: number = 0;
        let top: number = 0;
        if (this.stockChart && this.stockChart.stockLegendModule && this.stockChart.legendSettings.visible) {
            if (this.stockChart.legendSettings.position === 'Left') {
                left += this.stockChart.stockLegendModule.legendBounds.width;
            } else if (this.stockChart.legendSettings.position === 'Top') {
                top += this.stockChart.stockLegendModule.legendBounds.height;
            }
        }
        this.bounds = new Rect(
            (this.themeStyle.thumbWidth / 2 + thumb.border.width + margin.left + left),
            margin.top + tooltipSpace + periodSelectorY + top,
            this.availableSize.width - this.themeStyle.thumbWidth - (thumb.border.width * 2) - margin.left - margin.right,
            this.availableSize.height - margin.top - margin.bottom - tooltipSpace - (selector ? selector.periodSelectorSize.height : 0)
        );
        const deductHeight: number = ((this.labelPosition === 'Outside' || isLeightWeight) ?
            (labelSize + labelPadding) : 0) + ((this.tickPosition === 'Outside' || isLeightWeight) ?
            (this.majorTickLines.height) : 0);
        this.bounds.height -= deductHeight;
        if (isLeightWeight) {
            const height: number = this.enableGrouping ? this.bounds.height - ((labelSize) + labelPadding) : this.bounds.height;
            this.bounds.y += (this.themeStyle.thumbHeight > height ? (this.themeStyle.thumbHeight - height) / 2 : 0);
        }
        if (this.disableRangeSelector) {
            this.bounds.y = 0;
            this.bounds.height = this.periodSelectorSettings.periods.length > 0 ? this.periodSelectorSettings.height : 0;
        }
    }

    /**
     * Creating Chart for range navigator
     */
    public renderChart(resize: boolean = false): void {
        this.chartSeries.renderSeries(this);
        this.chartSeries.appendSeriesElements(this);
        this.rangeAxis.renderGridLines();
        this.rangeAxis.renderAxisLabels();
        this.createSecondaryElement();
        this.setSliderValue();
        this.renderPeriodSelector();
        this.renderSlider(resize);
        if (!this.stockChart) {
            this.element.appendChild(this.svgObject);
        }
        this.trigger('loaded', { rangeNavigator: this });
        this.rangeSlider.setSlider(
            this.startValue, this.endValue, false,
            this.tooltip.enable && this.tooltip.displayMode === 'Always', resize
        );
    }
    /**
     * To render period selector value
     */
    private renderPeriodSelector(): void {
        if (this.periodSelectorModule) {
            this.periodSelectorModule.renderSelectorElement(this);
            this.periodSelectorModule.renderSelector();
        }
    }
    /**
     * Creating secondary range navigator
     */
    public createSecondaryElement(): void {
        // For userInteraction
        if (this.tooltip.enable) {
            const tooltipDiv: Element = this.createElement('div');
            tooltipDiv.id = this.element.id + '_Secondary_Element';
            (tooltipDiv as HTMLElement).style.position = 'relative';
            this.element.appendChild(tooltipDiv);
        }
    }
    /**
     * Slider Calculation ane rendering performed here
     */
    private renderSlider(resize: boolean): void {
        this.rangeSlider.render(this);
        if (this.periodSelectorModule) {
            this.startValue = this.periodSelectorModule.control.startValue;
            this.endValue = this.periodSelectorModule.control.endValue;
        }
        this.rangeSlider.setSlider(
            this.startValue, this.endValue, true,
            this.tooltip.enable && this.tooltip.displayMode === 'Always', resize
        );
    }

    /**
     * To Remove the SVG.
     *
     * @returns {void}
     * @private
     */
    public removeSvg(): void {
        if (getElement(this.element.id + '_Secondary_Element')) {
            remove(getElement(this.element.id + '_Secondary_Element'));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) { this.clearTemplate(); }
        }
        const removeLength: number = 0;
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode && !this.stockChart) {
                remove(this.svgObject);
            }
        }
    }

    /** Wire, UnWire and Event releated calculation Started here */

    /**
     * Method to un-bind events for range navigator
     */
    private unWireEvents(): void {
        /*! Find the Events type */
        const startEvent: string = Browser.touchStartEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const stopEvent: string = Browser.touchEndEvent;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, startEvent, this.rangeOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.rangeOnMouseClick);
        //EventHandler.remove(this.element, 'contextmenu', this.rangeRightClick);
        EventHandler.remove(this.element, cancelEvent, this.mouseLeave);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.rangeResize
        );
    }
    /**
     * Method to bind events for range navigator
     */
    private wireEvents(): void {
        /*! Find the Events type */
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.rangeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.rangeOnMouseClick, this);
        //EventHandler.add(this.element, 'contextmenu', this.rangeRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.rangeResize.bind(this)
        );
        const element: HTMLElement = <HTMLElement>this.element;
        element.style.touchAction = 'none';
        element.style.msTouchAction = 'none';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    }

    /**
     * Handles the widget resize.
     *
     * @private
     */
    public rangeResize(): boolean {
        // To avoid resize console error
        if (!document.getElementById(this.element.id)) {
            return false;
        }
        this.animateSeries = false;
        this.removeAllTooltip();
        const beforeResizeArgs: IRangeBeforeResizeEventArgs = { name: 'beforeResize', cancelResizedEvent: false };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        const arg: IResizeRangeNavigatorEventArgs = {
            rangeNavigator: this,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            )
        };
        this.trigger(beforeResize, beforeResizeArgs);
        if (!beforeResizeArgs.cancelResizedEvent) {
            this.resizeTo = +setTimeout(
                (): void => {
                    if (this.isDestroyed) {
                        clearTimeout(this.resizeTo);
                        return;
                    }
                    this.createRangeSvg();
                    arg.currentSize = this.availableSize;
                    this.trigger('resized', arg);
                    this.calculateBounds();
                    this.chartSeries.processXAxis(this);
                    this.chartSeries.calculateGroupingBounds(this);
                    this.chartSeries.processYAxis(this);
                    this.renderChart(true);
                },
                500);
        }
        return false;
    }

    /**
     * Bug task ID: EJ2-30797
     * while resizing tooltip shows in wrong position
     * Cause: Due to time lag in resize, tooltip did not remove until the component calculation
     * Fix: Removed the tooltip element on resize
     */
    private removeAllTooltip(): void {
        if (this.tooltip.enable && this.tooltip.displayMode === 'Always') {
            if (getElement(this.element.id + '_leftTooltip')) {
                remove(getElement(this.element.id + '_leftTooltip'));
            }
            if (getElement(this.element.id + '_rightTooltip')) {
                remove(getElement(this.element.id + '_rightTooltip'));
            }
        }
    }

    /**
     * Handles the mouse move.
     *
     * @private
     */
    public mouseMove(e: PointerEvent): boolean {
        if (this.stockChart) {
            return false;
        }
        if (getElement(!this.stockChart ? this.element.id + '_svg' : this.element.id)) {
            this.mouseX = this.setMouseX(e);
            this.notify(Browser.touchMoveEvent, e);
        }
        return false;
    }
    /**
     * Handles the mouse leave.
     *
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        const rangeSlider: RangeSlider = this.rangeSlider;
        if (rangeSlider.isDrag) {
            if (this.stockChart) {
                return false;
            }
            const enabledTooltip: boolean = rangeSlider.control.tooltip.enable;
            if (rangeSlider.control.allowSnapping) {
                rangeSlider.isDrag = false;
                rangeSlider.setAllowSnapping(rangeSlider.control, rangeSlider.currentStart, rangeSlider.currentEnd, false, enabledTooltip);
            }
            rangeSlider.triggerEvent(this.chartSeries.xAxis.actualRange);
        }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.mouseX = this.setMouseX(e);
        this.notify(cancelEvent, e);
        return false;
    }
    /**
     * Handles the mouse click on range navigator.
     *
     * @private
     */
    public rangeOnMouseClick(e: PointerEvent | TouchEvent): boolean {
        this.notify('click', e);
        return false;
    }

    /**
     * Handles the print method for range navigator control.
     */
    public print(id?: string[] | string | Element): void {
        new ExportUtils(this).print(id);
    }
    /**
     * Handles the export method for range navigator control.
     */
    public export(
        type: ExportType, fileName: string, orientation?: PdfPageOrientation,
        controls?: (Chart | AccumulationChart | RangeNavigator)[],
        width?: number, height?: number, isVertical ?: boolean
    ): void {
        controls = controls ? controls : [this];
        new ExportUtils(this).export(type, fileName, orientation, controls, width, height, isVertical);
    }

    /**
     * Creating a background element to the svg object
     */
    private renderChartBackground(): void {
        let top: number = 0;
        let left: number = 0;
        if (this.stockChart && this.stockChart.legendSettings.visible && this.stockChart.stockLegendModule) {
            if (this.stockChart.legendSettings.position === 'Top') {
                top += this.stockChart.stockLegendModule.legendBounds.height;
            } else if (this.stockChart.legendSettings.position === 'Left') {
                left += this.stockChart.stockLegendModule.legendBounds.width;
            }
        }
        const rect: RectOption = new RectOption(
            this.element.id + '_ChartBorder', this.background || this.themeStyle.background, { width: 0, color: 'transparent' }, 1,
            new Rect(left, top, this.availableSize.width, this.availableSize.height));
        this.svgObject.appendChild(this.renderer.drawRectangle(rect) as HTMLElement);
    }

    /**
     * Handles the mouse down on range navigator.
     *
     * @private
     */
    public rangeOnMouseDown(e: PointerEvent): boolean {
        this.mouseDownX = this.setMouseX(e);
        this.notify(Browser.touchStartEvent, e);
        return false;
    }
    /**
     * Handles the mouse up.
     *
     * @private
     */
    public mouseEnd(e: PointerEvent): boolean {
        this.mouseX = this.setMouseX(e);
        this.notify(Browser.touchEndEvent, e);
        return false;
    }

    // private rangeRightClick(event: MouseEvent | PointerEvent): boolean {
    //     if (event.buttons === 2 || event.which === 0 || (<PointerEvent>event).pointerType === 'touch') {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         return false;
    //     }
    //     return true;
    // }

    /**
     * To find mouse x, y for aligned range navigator element svg position
     */
    private setMouseX(e: PointerEvent): number {
        const pageX: number = e.type.indexOf('touch') > -1 ?
            (<TouchEvent & PointerEvent>e).changedTouches[0].clientX : e.clientX;
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect = !this.stockChart ? getElement(this.element.id + '_svg').getBoundingClientRect() :
            getElement(this.element.id).getBoundingClientRect();
        return (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }

    /** Wire, UnWire and Event releated calculation End here */

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * OnProperty change method calling here
     *
     * @param {RangeNavigatorModel} newProp new RangeNavigatorModel
     * @param {RangeNavigatorModel} oldProp old RangeNavigatorModel
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: RangeNavigatorModel, oldProp: RangeNavigatorModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let refreshRange: boolean = false;
        this.animateSeries = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
            case 'height':
            case 'navigatorBorder':
            case 'enableGrouping':
            case 'labelPosition':
            case 'tickPosition':
            case 'labelStyle':
                refreshBounds = true;
                break;
            case 'enableRtl':
            case 'xName':
            case 'yName':
            case 'query':
            case 'minimum':
            case 'maximum':
            case 'interval':
            case 'intervalType':
            case 'logBase':
            case 'valueType':
            case 'majorGridLines':
            case 'minorGridLines':
            case 'navigatorStyleSettings':
            case 'labelFormat':
            case 'skeleton':
            case 'skeletonType':
            case 'secondaryLabelAlignment':
            case 'background':
                renderer = true;
                break;
            case 'dataSource':
            case 'series':
                renderer = true;
                refreshBounds = true;
                break;
            case 'theme':
                this.animateSeries = true;
                break;
            case 'locale':
                super.refresh(); break;
            case 'value':
                this.startValue = null; this.endValue = null;
                refreshRange = true;
                this.redraw = true;
                break;
            }
        }
        if (!refreshBounds && renderer) {
            this.removeSvg();
            this.chartSeries.xMin = Infinity;
            this.chartSeries.xMax = -Infinity;
            this.chartSeries.renderChart(this);
        }
        // issue fix for Range Navigator size gets reduced when the data source is refreshed
        if (refreshBounds && renderer) {
            this.removeSvg();
            this.chartSeries.xMin = this.chartSeries.yMin = Infinity;
            this.chartSeries.xMax = this.chartSeries.yMax = -Infinity;
            this.calculateBounds();
            this.chartSeries.renderChart(this);
        }
        if (refreshBounds && !renderer) {
            this.removeSvg();
            this.calculateBounds();
            this.chartSeries.renderChart(this);
        }
        if (!refreshBounds && !renderer && refreshRange) {
            this.setSliderValue();
            this.rangeSlider.setSlider(
                this.startValue, this.endValue, true,
                this.tooltip.enable && this.tooltip.displayMode === 'Always'
            );
        }
    }
    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} requiredModules
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        this.series.map((series: RangeNavigatorSeries) => {
            modules.push({
                member: series.type + 'Series',
                args: [this]
            });
        });
        if (this.periodSelectorSettings.periods.length > 0) {
            modules.push({
                member: 'PeriodSelector',
                args: [this]
            });
        }
        if (this.valueType !== 'Double') {
            modules.push({
                member: this.valueType,
                args: [this]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'RangeTooltip',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * To get the module name of the widget
     */
    public getModuleName(): string {
        return 'rangeNavigator';
    }

    /**
     * To destroy the widget
     *
     * @function destroy
     * @returns {void}.
     * @member of rangeNavigator
     */

    public destroy(): void {
        this.unWireEvents();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) { this.clearTemplate(); }
        this.rangeSlider.destroy();
        super.destroy();
        this.element.innerText = '';
        this.element.classList.remove('e-rangenavigator');
    }
}
