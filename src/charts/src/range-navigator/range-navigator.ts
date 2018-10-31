import { Component, Property, NotifyPropertyChanges, SvgRenderer, Complex, Collection, Browser } from '@syncfusion/ej2-base';
import { EventHandler, remove, ModuleDeclaration, Internationalization } from '@syncfusion/ej2-base';
import { Event, EmitType } from '@syncfusion/ej2-base';
import { RangeNavigatorModel } from './range-navigator-model';
import { createSvg, Size, Rect, measureText, removeElement } from '../common/utils/helper';
import { RangeTooltip } from '../range-navigator/user-interaction/tooltip';
import { Border, Margin } from '../common/model/base';
import { BorderModel, MarginModel } from '../common/model/base-model';
import { RangeSeries } from './renderer/chart-render';
import { RangeNavigatorAxis } from './renderer/range-axis';
import { RangeNavigatorSeries, StyleSettings, RangeTooltipSettings, PeriodSelectorSettings } from './model/range-base';
import { RangeNavigatorSeriesModel, StyleSettingsModel } from './model/range-base-model';
import { ThumbSettingsModel, RangeTooltipSettingsModel, PeriodSelectorSettingsModel } from './model/range-base-model';
import { RangeSlider } from './renderer/slider';
import { AxisPosition, StepLineSeries, ExportType, IPrintEventArgs, RectOption } from '../chart/index';
import { Chart, getElement, ChartTheme, LineSeries, AreaSeries } from '../chart/index';
import { DateTime, Logarithmic, IResizeRangeNavigatorEventArgs } from '../chart/index';
import { ILabelRenderEventsArgs, IRangeTooltipRenderEventArgs } from './model/range-navigator-interface';
import { IRangeLoadedEventArgs, IRangeStyle, IChangedEventArgs } from './model/range-navigator-interface';
import { getRangeThemeColor } from './utils/theme';
import { RangeValueType, LabelAlignment, RangeIntervalType, RangeLabelIntersectAction } from './utils/enum';
import { Font } from '../common/model/base';
import { FontModel } from '../common/model/base-model';
import { MajorGridLines, MajorTickLines, VisibleRangeModel } from '../chart/axis/axis';
import { MajorGridLinesModel, MajorTickLinesModel } from '../chart/axis/axis-model';
import { RangeNavigatorTheme } from './utils/theme';
import { SkeletonType } from '../chart/utils/enum';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Double } from '../chart/axis/double-axis';
import { Data } from '../common/model/data';
import { ExportUtils } from '../common/utils/export';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { PeriodSelector } from './renderer/period-selector';
import { AccumulationChart } from '../accumulation-chart/index';
import { IRangeSelectorRenderEventArgs } from './model/range-navigator-interface';

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
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, range navigator renders to the full height of its parent element.
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public height: string;

    /**
     * It defines the data source for a range navigator.
     * @default null
     */
    @Property(null)
    public dataSource: Object | DataManager;

    /**
     * It defines the xName for the range navigator.
     * @default null
     */
    @Property(null)
    public xName: string;

    /**
     * It defines the yName for the range navigator.
     * @default null
     */
    @Property(null)
    public yName: string;

    /**
     * It defines the query for the data source.
     * @default null
     */
    @Property(null)
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
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public minimum: number | Date;

    /**
     * Maximum value for the axis
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public maximum: number | Date;

    /**
     * interval value for the axis
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public interval: number;

    /**
     * IntervalType for the dateTime axis
     * @default 'Auto'
     */
    @Property('Auto')
    public intervalType: RangeIntervalType;

    /**
     * Specifies, when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * @default Hide
     */

    @Property('Hide')
    public labelIntersectAction: RangeLabelIntersectAction;

    /**
     * base value for log axis
     * @default 10
     */
    @Property(10)
    public logBase: number;

    /**
     * ValueType for the axis
     * @default 'Double'
     */
    @Property('Double')
    public valueType: RangeValueType;

    /**
     * Label positions for the axis
     * @default 'Outside'
     */
    @Property('Outside')
    public labelPosition: AxisPosition;

    /**
     * Duration of the animation
     * @default 500
     */
    @Property(500)
    public animationDuration: number;

    /**
     * Enable grouping for the labels
     * @default false
     */
    @Property(false)
    public enableGrouping: boolean;

    /**
     * Enable deferred update for the range navigator
     * @default false
     */
    @Property(false)
    public enableDeferredUpdate: boolean;

    /**
     * To render the period selector with out range navigator.
     * @default false
     */
    @Property(false)
    public disableRangeSelector: boolean;

    /**
     * Enable snapping for range navigator sliders
     * @default false
     */
    @Property(false)
    public allowSnapping: boolean;

    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * GroupBy property for the axis
     * @default `Auto`
     */
    @Property()
    public groupBy: RangeIntervalType;

    /**
     * Tick Position for the axis
     * @default 'Outside'
     */
    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * Label style for the labels
     */
    @Complex<FontModel>(RangeNavigatorTheme.axisLabelFont, Font)
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
    @Complex<BorderModel>({ color: '#DDDDDD', width: 1 }, Border)
    public navigatorBorder: BorderModel;

    /**
     * Specifies the theme for the range navigator.
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Selected range for range navigator.
     * @default []
     */
    @Property([])
    public value: number[] | Date[];

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the skeleton format in which the dateTime format will process.
     * @default ''
     */

    @Property('')
    public skeleton: string;

    /**
     * It specifies the type of format to be used in dateTime format process.
     * @default 'DateTime'
     */

    @Property('DateTime')
    public skeletonType: SkeletonType;

    /**
     * It specifies the label alignment for secondary axis labels
     * @default 'Middle'
     */

    @Property('Middle')
    public secondaryLabelAlignment: LabelAlignment;

    /**
     * Margin for the range navigator
     * @default
     */
    @Complex<MarginModel>({ top: 5, bottom: 5, right: 5, left: 5 }, Margin)
    public margin: MarginModel;

    /** @private */
    public themeStyle: IRangeStyle;

    /**
     * Triggers before the range navigator rendering
     * @event
     */
    @Event()
    public load: EmitType<IRangeLoadedEventArgs>;

    /**
     * Triggers after the range navigator rendering
     * @event
     */
    @Event()
    public loaded: EmitType<IRangeLoadedEventArgs>;

    /**
     * Triggers after the range navigator resized
     * @event
     */
    @Event()
    public resized: EmitType<IResizeRangeNavigatorEventArgs>;

    /** 
     * Triggers before the label rendering
     * @event
     */
    @Event()
    public labelRender: EmitType<ILabelRenderEventsArgs>;
    /**
     * Triggers after change the slider.
     * @event
     */
    @Event()
    public changed: EmitType<IChangedEventArgs>;
    /**
     * Triggers before the tooltip for series is rendered.
     * @event
     */

    @Event()
    public tooltipRender: EmitType<IRangeTooltipRenderEventArgs>;

    /**
     * Triggers before the range navigator selector rendering
     * @event
     */
    @Event()
    public selectorRender: EmitType<IRangeSelectorRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
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
    private chartid : number = 57725;

    /**
     * Constructor for creating the widget
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
        if (this.element.id === '') {
           let collection : number = document.getElementsByClassName('e-rangenavigator').length;
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
        let isDateTime: boolean = this.valueType === 'DateTime';
        let range: VisibleRangeModel = this.chartSeries.xAxis.actualRange;
        this.startValue = this.startValue ? this.startValue : (!this.value[0] ? range.min :
            (isDateTime ? (<Date>this.value[0]).getTime() : +this.value[0]));
        this.endValue = this.endValue ? this.endValue : (!this.value[1] ? range.max :
            (isDateTime ? (<Date>this.value[1]).getTime() : +this.value[1]));
    }

    /**
     * To render the range navigator
     */
    public render(): void {
        this.trigger('load', { rangeNavigator: this });
        this.setTheme();
        this.initPrivateVariables();
        this.createRangeSvg();
        this.calculateBounds();
        this.chartSeries.renderChart(this);
        removeElement('chartmeasuretext');
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
        let labelPadding: number = this.enableGrouping ? 15 : 8;
        let thumb: ThumbSettingsModel = this.navigatorStyleSettings.thumb;
        let labelSize: number = measureText('tempString', this.labelStyle).height;
        let margin: MarginModel = this.margin;
        let isLeightWeight: boolean = !this.series.length;
        let tooltipSpace: number = (!this.disableRangeSelector) &&
            isLeightWeight && this.tooltip.enable ? 35 : 0;
        let selector: PeriodSelector = this.periodSelectorModule;
        if (this.periodSelectorModule && this.periodSelectorSettings.periods.length > 0) {
            selector.periodSelectorSize = { x: 0, y: 0, height: 0, width: 0 };
            selector.periodSelectorSize.width = this.availableSize.width;
            selector.periodSelectorSize.height = this.periodSelectorSettings.height;
            selector.periodSelectorSize.y = this.periodSelectorSettings.position === 'Bottom' ?
                this.availableSize.height - selector.periodSelectorSize.height : 0;
        }
        let periodSelectorY: number = this.periodSelectorSettings.position === 'Top' && selector ?
            selector.periodSelectorSize.y + selector.periodSelectorSize.height : 0;
        this.bounds = new Rect(
            (this.themeStyle.thumbWidth / 2 + thumb.border.width + margin.left),
            margin.top + tooltipSpace + periodSelectorY,
            this.availableSize.width - this.themeStyle.thumbWidth - (thumb.border.width * 2) - margin.left - margin.right,
            this.availableSize.height - margin.top - margin.bottom - tooltipSpace - (selector ? selector.periodSelectorSize.height : 0)
        );
        let deductHeight: number = ((this.labelPosition === 'Outside' || isLeightWeight) ?
            (labelSize + labelPadding) : 0) + ((this.tickPosition === 'Outside' || isLeightWeight) ?
                (this.majorTickLines.height) : 0);
        this.bounds.height -= deductHeight;
        if (isLeightWeight) {
            let height: number = this.enableGrouping ? this.bounds.height - ((labelSize) + labelPadding) : this.bounds.height;
            this.bounds.y += (this.themeStyle.thumbHeight > height ? (this.themeStyle.thumbHeight - height) / 2 : 0);
        }
        if (this.disableRangeSelector) {
            this.bounds.y = 0;
            this.bounds.height = this.periodSelectorSettings.height;
        }
    }

    /**
     * Creating Chart for range navigator
     */
    public renderChart(): void {
        this.chartSeries.renderSeries(this);
        this.rangeAxis.renderGridLines();
        this.rangeAxis.renderAxisLabels();
        this.createSecondaryElement();
        this.setSliderValue();
        this.renderPeriodSelector();
        this.renderSlider();
        this.element.appendChild(this.svgObject);
        this.trigger('loaded', { rangeNavigator: this });
        this.rangeSlider.setSlider(
            this.startValue, this.endValue, false,
            this.tooltip.enable && this.tooltip.displayMode === 'Always'
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
            let tooltipDiv: Element = this.createElement('div');
            tooltipDiv.id = this.element.id + '_Secondary_Element';
            tooltipDiv.setAttribute('style', 'position: relative');
            this.element.appendChild(tooltipDiv);
        }
    }
    /**
     * Slider Calculation ane rendering performed here
     */
    private renderSlider(): void {
        this.rangeSlider.render(this);
        this.rangeSlider.setSlider(
            this.startValue, this.endValue, true,
            this.tooltip.enable && this.tooltip.displayMode === 'Always'
        );
    }

    /**
     * To Remove the SVG. 
     * @return {boolean}
     * @private
     */
    public removeSvg(): void {
        if (getElement(this.element.id + '_Secondary_Element')) {
            remove(getElement(this.element.id + '_Secondary_Element'));
        }
        let removeLength: number = 0;
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
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
        let startEvent: string = Browser.touchStartEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let stopEvent: string = Browser.touchEndEvent;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
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
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

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
        let element: HTMLElement = <HTMLElement>this.element;
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
     * @return {boolean}
     * @private
     */
    public rangeResize(e: Event): boolean {
        this.animateSeries = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        let arg: IResizeRangeNavigatorEventArgs = {
            rangeNavigator: this,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
        };
        this.resizeTo = setTimeout(
            (): void => {
                if (this.isDestroyed) {
                    clearTimeout(this.resizeTo);
                    return;
                }
                this.createRangeSvg();
                arg.currentSize = this.availableSize;
                this.trigger('resized', arg);
                this.calculateBounds();
                this.chartSeries.renderChart(this);
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
        this.mouseX = this.setMouseX(e);
        this.notify(Browser.touchMoveEvent, e);
        return false;
    }
    /**
     * Handles the mouse leave. 
     * @return {boolean}
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.mouseX = this.setMouseX(e);
        this.notify(cancelEvent, e);
        return false;
    }
    /**
     * Handles the mouse click on range navigator. 
     * @return {boolean}
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
     * @param type 
     * @param fileName 
     */
    public export(
        type: ExportType, fileName: string, orientation?: PdfPageOrientation,
        controls?: (Chart | AccumulationChart | RangeNavigator)[],
        width?: number, height?: number
    ): void {
        controls = controls ? controls : [this];
        new ExportUtils(this).export(type, fileName, orientation, controls, width, height);
    }

    /**
     * Creating a background element to the svg object
     */
    private renderChartBackground(): void {
        let rect: RectOption = new RectOption(
            this.element.id + '_ChartBorder', this.themeStyle.background, { width: 0, color: 'transparent' }, 1,
            new Rect(0, 0, this.availableSize.width, this.availableSize.height));
        this.svgObject.appendChild(this.renderer.drawRectangle(rect) as HTMLElement);
    }

    /**
     * Handles the mouse down on range navigator. 
     * @return {boolean}
     * @private
     */
    public rangeOnMouseDown(e: PointerEvent): boolean {
        this.mouseDownX = this.setMouseX(e);
        this.notify(Browser.touchStartEvent, e);
        return false;
    }
    /**
     * Handles the mouse up. 
     * @return {boolean}
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
        let pageX: number = e.type.indexOf('touch') > -1 ?
            (<TouchEvent & PointerEvent>e).changedTouches[0].clientX : e.clientX;
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        return (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }

    /** Wire, UnWire and Event releated calculation End here */

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * OnProperty change method calling here
     * @param newProp 
     * @param oldProp 
     */
    public onPropertyChanged(newProp: RangeNavigatorModel, oldProp: RangeNavigatorModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let refreshRange: boolean = false;
        this.animateSeries = false;
        for (let prop of Object.keys(newProp)) {
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
                case 'series':
                case 'enableRtl':
                case 'dataSource':
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
                    renderer = true;
                    break;
                case 'theme':
                    this.animateSeries = true;
                    break;
                case 'locale':
                    super.refresh(); break;
                case 'value':
                    refreshRange = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.removeSvg();
            this.chartSeries.renderChart(this);
        }
        if (refreshBounds) {
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
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
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
     * @method destroy
     * @return {void}.
     * @member of rangeNavigator
     */

    public destroy(): void {
        this.unWireEvents();
        this.rangeSlider.destroy();
        super.destroy();
        this.element.classList.remove('e-rangenavigator');
    }
}