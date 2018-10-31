/**
 * AccumulationChart file
 */
import { Property, Component, Complex, Collection, NotifyPropertyChanges, INotifyPropertyChanged, SvgRenderer } from '@syncfusion/ej2-base';
import { ModuleDeclaration, Internationalization, Event, EmitType, Browser, EventHandler, Touch } from '@syncfusion/ej2-base';
import { remove, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { AccumulationChartModel } from './accumulation-model';
import { Font, Margin, Border, TooltipSettings, Indexes } from '../common/model/base';
import { AccumulationSeries, AccPoints } from './model/acc-base';
import { AccumulationType, AccumulationSelectionMode } from './model/enum';
import { IAccSeriesRenderEventArgs, IAccTextRenderEventArgs, IAccTooltipRenderEventArgs } from './model/pie-interface';
import { IAccAnimationCompleteEventArgs, IAccPointRenderEventArgs, IAccLoadedEventArgs } from './model/pie-interface';
import { Theme, getThemeColor } from '../common/model/theme';
import { ILegendRenderEventArgs, IMouseEventArgs, IPointEventArgs } from '../common/model/interface';
import {  IAnnotationRenderEventArgs } from '../common/model/interface';
import { load, seriesRender, legendRender, textRender, tooltipRender, pointClick } from '../common/model/constants';
import { pointMove, chartMouseClick, chartMouseDown } from '../common/model/constants';
import { chartMouseLeave, chartMouseMove, chartMouseUp, resized } from '../common/model/constants';
import { FontModel, MarginModel, BorderModel, IndexesModel, TooltipSettingsModel } from '../common/model/base-model';
import { AccumulationSeriesModel} from './model/acc-base-model';
import { LegendSettings } from '../common/legend/legend';
import { AccumulationLegend } from './renderer/legend';
import { LegendSettingsModel } from '../common/legend/legend-model';
import { Rect, ChartLocation, Size, subtractRect, indexFinder, appendChildElement, redrawElement } from '../common/utils/helper';
import { measureText, RectOption, showTooltip } from '../common/utils/helper';
import { textElement, TextOption, createSvg, calculateSize, removeElement, firstToLowerCase } from '../common/utils/helper';
import { getElement, titlePositionX } from '../common/utils/helper';
import { Data } from '../common/model/data';
import { AccumulationTooltip } from './user-interaction/tooltip';
import { AccumulationBase } from './renderer/accumulation-base';
import { PieSeries } from './renderer/pie-series';
import { AccumulationDataLabel } from './renderer/dataLabel';
import { FunnelSeries } from './renderer/funnel-series';
import { PyramidSeries } from './renderer/pyramid-series';
import { AccumulationSelection } from './user-interaction/selection';
import { AccumulationTheme } from './model/enum';
import { AccumulationAnnotationSettingsModel } from './model/acc-base-model';
import { AccumulationAnnotationSettings } from './model/acc-base';
import { AccumulationAnnotation } from './annotation/annotation';
import { IPrintEventArgs } from '../common/model/interface';
import { ExportUtils } from '../common/utils/export';
import { ExportType, Alignment } from '../common/utils/enum';
import { getTitle } from '../common/utils/helper';
import {Index} from '../common/model/base';
import { IThemeStyle, Chart, RangeNavigator } from '../index';
import { IAccResizeEventArgs } from './model/pie-interface';
import { DataManager } from '@syncfusion/ej2-data';
/**
 * Represents the AccumulationChart control.
 * ```html
 * <div id="accumulation"/>
 * <script>
 *   var accObj = new AccumulationChart({ });
 *   accObj.appendTo("#accumulation");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class AccumulationChart extends Component<HTMLElement> implements INotifyPropertyChanged {

    // Module declarations

    /**
     * `accBaseModue` is used to define the common functionalities of accumulation series
     * @private
     */
    public accBaseModule: AccumulationBase;

    /**
     * `pieSeriesModule` is used to render pie series.
     * @private
     */
    public pieSeriesModule: PieSeries;

    /**
     * `funnelSeriesModule` is used to render funnel series.
     * @private
     */
    public funnelSeriesModule: FunnelSeries;

    /**
     * `pyramidSeriesModule` is used to render funnel series.
     * @private
     */
    public pyramidSeriesModule: PyramidSeries;

    /**
     * `accumulationLegendModule` is used to manipulate and add legend in accumulation chart.
     */
    public accumulationLegendModule: AccumulationLegend;

    /**
     * `accumulationDataLabelModule` is used to manipulate and add dataLabel in accumulation chart.
     */
    public accumulationDataLabelModule: AccumulationDataLabel;

    /**
     * `accumulationTooltipModule` is used to manipulate and add tooltip in accumulation chart.
     */
    public accumulationTooltipModule: AccumulationTooltip;
    /**
     * `accumulationSelectionModule` is used to manipulate and add selection in accumulation chart.
     */
    public accumulationSelectionModule: AccumulationSelection;

    /**
     * `annotationModule` is used to manipulate and add annotation in chart.
     */
    public annotationModule: AccumulationAnnotation;

    // Property declarations goes here

    /**
     * The width of the chart as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, chart will render to the full width of its parent element.
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, chart will render to the full height of its parent element.
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Title for accumulation chart
     * @default null
     */
    @Property(null)
    public title: string;

   /**
    * Specifies the dataSource for the AccumulationChart. It can be an array of JSON objects or an instance of DataManager.
    * ```html
    * <div id='Pie'></div>
    * ```
    * ```typescript
    * let dataManager: DataManager = new DataManager({
    *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
    * });
    * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
    * let pie: AccumulationChart = new AccumulationChart({
    * ...
    *     dataSource: dataManager,
    *     series: [{
    *        xName: 'Id',
    *        yName: 'Estimate',
    *        query: query
    *    }],
    * ...
    * });
    * pie.appendTo('#Pie');
    * ```
    * @default ''
    */

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Options for customizing the `title` of accumulation chart.
     */

    @Complex<FontModel>(Theme.chartTitleFont, Font)
    public titleStyle: FontModel;

    /**
     * SubTitle for accumulation chart
     * @default null
     */
    @Property(null)
    public subTitle: string;

    /**
     * Options for customizing the `subtitle` of accumulation chart.
     */

    @Complex<FontModel>(Theme.chartSubTitleFont, Font)
    public subTitleStyle: FontModel;

    /**
     * Options for customizing the legend of accumulation chart.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Options for customizing the tooltip of accumulation chart.
     */

    @Complex<TooltipSettingsModel>({},  TooltipSettings)
    public tooltip:  TooltipSettingsModel;

    /**
     * Specifies whether point has to get selected or not. Takes value either 'None 'or 'Point'
     * @default None
     */
    @Property('None')
    public selectionMode: AccumulationSelectionMode;

    /**
     * If set true, enables the multi selection in accumulation chart. It requires `selectionMode` to be `Point`.
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * If set true, enables the animation for both chart and accumulation.
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Specifies the point indexes to be selected while loading a accumulation chart.
     * It requires `selectionMode` to be `Point`.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let pie: AccumulationChart = new AccumulationChart({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * pie.appendTo('#Pie');
     * ```
     * @default []
     */
    @Collection<IndexesModel>([], Indexes)
    public selectedDataIndexes: IndexesModel[];

    /**
     *  Options to customize the left, right, top and bottom margins of accumulation chart.
     */

    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * If set true, labels for the point will be placed smartly without overlapping.
     * @default true
     */
    @Property(true)
    public enableSmartLabels: boolean;

    /**
     * Options for customizing the color and width of the chart border.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * The background color of the chart, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * The configuration for series in accumulation chart.
     */

    @Collection<AccumulationSeriesModel>([{}], AccumulationSeries)
    public series: AccumulationSeriesModel[];

    /**
     * The configuration for annotation in chart.
     */

    @Collection<AccumulationAnnotationSettingsModel>([{}], AccumulationAnnotationSettings)
    public annotations: AccumulationAnnotationSettingsModel[];

    /**
     * Specifies the theme for accumulation chart.
     * @default 'Material'
     */
    @Property('Material')
    public theme: AccumulationTheme;

    /**
     * Triggers after accumulation chart loaded.
     * @event
     */
    @Event()
    public loaded: EmitType<IAccLoadedEventArgs>;

    /**
     * Triggers before accumulation chart load.
     * @event
     */
    @Event()
    public load: EmitType<IAccLoadedEventArgs>;

    /**
     * Triggers before the series gets rendered.
     * @event
     */
    @Event()
    public seriesRender: EmitType<IAccSeriesRenderEventArgs>;

    /**
     * Triggers before the legend gets rendered.
     * @event
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for series gets rendered.
     * @event
     */
    @Event()
    public textRender: EmitType<IAccTextRenderEventArgs>;

    /**
     * Triggers before the tooltip for series gets rendered.
     * @event
     */
    @Event()
    public tooltipRender: EmitType<IAccTooltipRenderEventArgs>;

    /**
     * Triggers before each points for series gets rendered.
     * @event
     */

    @Event()
    public pointRender: EmitType<IAccPointRenderEventArgs>;

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
     * Triggers on hovering the accumulation chart.
     * @event
     */

    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the accumulation chart.
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
     * Triggers after animation gets completed for series.
     * @event
     */
    @Event()
    public animationComplete: EmitType<IAccAnimationCompleteEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     */

    @Event()
    public chartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers while cursor leaves the accumulation chart.
     * @event
     */

    @Event()
    public chartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     */

    @Event()
    public chartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers after window resize.
     * @event
     */

    @Event()
    public resized: EmitType<IAccResizeEventArgs>;

    /**
     * Defines the currencyCode format of the accumulation chart
     * @private
     * @aspType string
     */

    @Property('USD')
    private currencyCode: string;


    // internal properties for Accumulation charts
    /** @private */
    public svgObject: Element;
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public availableSize: Size;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public visibleSeries: AccumulationSeries[];
    /** @private */
    public seriesCounts: number;
    /** @private explode radius internal property */
    public explodeDistance: number = 0;
    /** @private Mouse position x */
    public mouseX: number;
    /** @private Mouse position y */
    public mouseY: number;
    private resizeTo: number;
    /** @private */
    public center: ChartLocation;
    /** @private */
    public get type(): AccumulationType {
        if (this.series && this.series.length) {
            return this.series[0].type;
        }
        return 'Pie';
    }
    /** @private */
    public isTouch: boolean;
    /** @private */
    public redraw: boolean;
    /** @private */
    public animateSeries: boolean;
    private titleCollection: string[];
    private subTitleCollection: string[];
    /** @private */
    public themeStyle: IThemeStyle;
    private chartid : number = 57724;
    /**
     * Constructor for creating the AccumulationChart widget
     * @private
     */
    constructor(options?: AccumulationChartModel, element?: string | HTMLElement) {
        super(options, element);
    }

    // accumulation chart methods
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    protected preRender(): void {
        this.unWireEvents();
        this.setCulture();
        this.animateSeries = true;
        if (this.element.id === '') {
            let collection : number = document.getElementsByClassName('e-accumulationchart').length;
            this.element.id = 'acc_chart_' + this.chartid + '_' + collection;
        }
        calculateSize(this);
        this.wireEvents();
    }
    /**
     * Themeing for chart goes here
     */

    private setTheme(): void {
        /*! Set theme for accumulation chart */
        this.themeStyle = getThemeColor(this.theme);
    }
    /**
     * To render the accumulation chart elements
     */
    protected render(): void {

        this.trigger(load, { accumulation: this, chart: this });

        this.setTheme();

        this.accBaseModule = new AccumulationBase(this);
        this.pieSeriesModule = new PieSeries(this);

        this.calculateVisibleSeries();

        this.processData();
    }
    /**
     * Method to unbind events for accumulation chart
     */

    private unWireEvents(): void {
        /*! Find the Events type */
        let isIE11Pointer: Boolean = Browser.isPointer;

        let start: string = Browser.touchStartEvent;
        let move: string = Browser.touchMoveEvent;
        let stop: string = Browser.touchEndEvent;
        let cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, move, this.accumulationMouseMove);
        EventHandler.remove(this.element, stop, this.accumulationMouseEnd);
        EventHandler.remove(this.element, start, this.accumulationMouseStart);
        EventHandler.remove(this.element, 'click', this.accumulationOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.accumulationRightClick);
        EventHandler.remove(this.element, cancel, this.accumulationMouseLeave);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.accumulationResize
        );
    }
    /**
     * Method to bind events for the accumulation chart
     */
    private wireEvents(): void {
        /*! Find the Events type */

        let isIE11Pointer: Boolean = Browser.isPointer;
        let start: string = Browser.touchStartEvent;
        let stop: string = Browser.touchEndEvent;
        let move: string = Browser.touchMoveEvent;
        let cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, move, this.accumulationMouseMove, this);
        EventHandler.add(this.element, stop, this.accumulationMouseEnd, this);
        EventHandler.add(this.element, start, this.accumulationMouseStart, this);
        EventHandler.add(this.element, 'click', this.accumulationOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.accumulationRightClick, this);
        EventHandler.add(this.element, cancel, this.accumulationMouseLeave, this);

        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.accumulationResize.bind(this)
        );
        new Touch(this.element); // To avoid geasture blocking for browser
        /*! Apply the style for chart */
        this.setStyle(<HTMLElement>this.element);
    }
    /**
     * Method to set mouse x, y from events
     */
    private setMouseXY(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        let rect: ClientRect = this.element.getBoundingClientRect();
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            let touchArg: TouchEvent = <TouchEvent & PointerEvent>e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    public accumulationMouseEnd(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger(chartMouseUp, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            if (this.accumulationDataLabelModule && this.visibleSeries[0].dataLabel.visible) {
                this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY, this.isTouch);
            }
            if (this.accumulationLegendModule && this.legendSettings.visible) {
                this.accumulationLegendModule.move(e);
            }
        }
        this.notify(Browser.touchEndEvent, e);
        return false;
    }

    /*public removeSvgOffset(x: number, y: number): ChartLocation {
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        return { x: (x - rect.left) - Math.max(svgRect.left - rect.left, 0), y: (y - rect.top) - Math.max(svgRect.top - rect.top, 0)};
    }*/

    /**
     * Handles the mouse start.
     * @return {boolean}
     * @private
     */
    public accumulationMouseStart(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger(chartMouseDown, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        return false;
    }
    /**
     * Handles the accumulation chart resize.
     * @return {boolean}
     * @private
     */
    public accumulationResize(e: Event): boolean {
        this.animateSeries = false;
        let args: IAccResizeEventArgs = {
            accumulation: this,
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
            name: resized,
            currentSize: new Size(0, 0),
            chart: this,
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
                calculateSize(this);
                args.currentSize = this.availableSize;
                this.trigger(resized, args);
                this.refreshSeries();
                this.refreshChart();
            },
            500);
        return false;
    }

    /**
     * Handles the export method for accumulation control.
     */
    public export(
        type: ExportType,
        fileName: string, orientation?: PdfPageOrientation,
        controls?: (Chart | AccumulationChart | RangeNavigator)[], width?: number, height?: number
    ): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        exportChart.export(
            type, fileName, orientation, (controls ? controls : [this]),
            width, height
        );
    }

    /**
     * Handles the print method for accumulation chart control.
     */
    public print(id?: string[] | string | Element): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print(id);
    }

    /**
     * Applying styles for accumulation chart element
     */
    private setStyle(element: HTMLElement): void {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    }

    /**
     * Method to set the annotation content dynamically for accumulation.
     */
    public setAnnotationValue(annotationIndex: number, content: string) : void {
        let annotation: AccumulationAnnotationSettings = <AccumulationAnnotationSettings>this.annotations[annotationIndex];
        let element: HTMLElement;
        let parentNode: Element = getElement(this.element.id + '_Annotation_Collections');
        if (content) {
            annotation.content = content;
            if (parentNode) {
                element = this.createElement('div');
                removeElement(this.element.id + '_Annotation_' + annotationIndex);
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
     * Handles the mouse move on accumulation chart.
     * @return {boolean}
     * @private
     */
    public accumulationMouseMove(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger(chartMouseMove, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, <Element>e.target);
        }
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.move(e);
        }
        if (this.accumulationDataLabelModule && this.visibleSeries[0] && this.visibleSeries[0].dataLabel.visible) {
            this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY);
        }
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
       }
        this.notify(Browser.touchMoveEvent, e);

        return false;
    }
    public titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
        let id: boolean = (targetId === (this.element.id + '_title') || targetId === (this.element.id + '_subTitle'));
        if (((<HTMLElement>event.target).textContent.indexOf('...') > -1) && id) {
            let title: string = (targetId === (this.element.id + '_title')) ? this.title : this.subTitle;
            showTooltip(
                title, x, y, this.element.offsetWidth, this.element.id + '_EJ2_Title_Tooltip',
                getElement(this.element.id + '_Secondary_Element'),
                isTouch
            );
        } else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    }

    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    public accumulationOnMouseClick(e: PointerEvent): boolean {
        this.setMouseXY(e);
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.click(e);
        }
        if (this.selectionMode !== 'None' && this.accumulationSelectionModule) {
            this.accumulationSelectionModule.calculateSelectedElements(this, e);
        }
        if (this.visibleSeries[0].explode) {
            this.accBaseModule.processExplode(e);
        }
        this.trigger(chartMouseClick, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.pointClick) {
            this.triggerPointEvent(pointClick, <Element>e.target);
        }
        return false;
    }

    private triggerPointEvent(event : string, element : Element) : void {
        let indexes : Index = indexFinder(element.id, true);
        if (indexes.series >= 0 && indexes.point >= 0 ) {
           this.trigger(event, { series : this.series[indexes.series],
             point : (<AccumulationSeries>this.series[indexes.series]).points[indexes.point],
             seriesIndex : indexes.series, pointIndex : indexes.point,
             x: this.mouseX, y: this.mouseY });
        }
    }

    /**
     * Handles the mouse right click on accumulation chart.
     * @return {boolean}
     * @private
     */
    public accumulationRightClick(event: MouseEvent | PointerEvent): boolean {
        if (event.buttons === 2 || (<PointerEvent>event).pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    }

    /**
     * Handles the mouse leave on accumulation chart.
     * @return {boolean}
     * @private
     */
    public accumulationMouseLeave(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger(chartMouseLeave, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        return false;
    }

    /**
     * Method to set culture for chart
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * Method to create SVG element for accumulation chart.
     */
    private createPieSvg(): void {
        this.removeSvg();
        createSvg(this);
    }
    /**
     * To Remove the SVG from accumulation chart.
     * @return {boolean}
     * @private
     */
    public removeSvg(): void {
        if (this.redraw) {
            return null;
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
                while (this.svgObject.childNodes.length > 0) {
                    this.svgObject.removeChild(this.svgObject.firstChild);
                }
                if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                    remove(this.svgObject);
                }
        }
        removeElement('EJ2_legend_tooltip');
        removeElement('EJ2_datalabel_tooltip');
    }
    /**
     * Method to create the secondary element for tooltip, datalabel and annotaitons.
     */
    private createSecondaryElement(): void {
        let element: Element = redrawElement(this.redraw, this.element.id + '_Secondary_Element') ||
            this.createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: relative'
            });
        appendChildElement(this.element, element, this.redraw);
    }

    /**
     * Method to find visible series based on series types
     */
    private calculateVisibleSeries(): void {
        this.visibleSeries = [];
        for (let i: number = 0, length: number = this.series.length; i < length; i++) {
            (this.series[i] as AccumulationSeries).index = i;
            if (this.series[i].type === this.type && this.visibleSeries.length === 0) {
                this.visibleSeries.push(this.series[i] as AccumulationSeries);
                break;
            }
        }
    }
    /**
     * To find points from dataSource
     */
    private processData(render : boolean = true): void {
        this.seriesCounts = 0;
        for (let series of this.visibleSeries) {
            series.dataModule = new Data(series.dataSource || this.dataSource, series.query);
            series.refreshDataManager(this, render);
        }
    }
    /**
     * To refresh the accumulation chart
     * @private
     */
    public refreshChart(): void {
        this.doGrouppingProcess();
        this.createPieSvg();
        this.calculateBounds();
        this.renderElements();
        removeElement('chartmeasuretext');
    }
    /**
     * Method to find groupped points
     */
    private doGrouppingProcess(): void {
        let series: AccumulationSeries = this.visibleSeries[0];
        if (!isNullOrUndefined(series.resultData) && ((!isNullOrUndefined(series.lastGroupTo) &&
            series.lastGroupTo !== series.groupTo))) {
            series.getPoints(series.resultData, this);
        }
    }
    /**
     * Method to calculate bounds for accumulation chart
     */
    private calculateBounds(): void {
        this.initialClipRect = new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height);
        this.titleCollection = [];
        this.subTitleCollection = [];
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        this.titleCollection = getTitle(this.title, this.titleStyle, this.initialClipRect.width);
        titleHeight = measureText(this.title, this.titleStyle).height * this.titleCollection.length;
        if (this.subTitle) {
            for (let titleText of this.titleCollection) {
                titleWidth = measureText(titleText, this.titleStyle).width;
                maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
            }
            this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth);
            subTitleHeight = (measureText(this.subTitle, this.subTitleStyle).height * this.subTitleCollection.length);
        }
        subtractRect(
            this.initialClipRect,
            new Rect(
                0, (subTitleHeight + titleHeight),
                this.margin.right + this.margin.left, this.margin.bottom + this.margin.top
            )
        );
        this.calculateLegendBounds();

    }
    /*
     * Method to calculate legend bounds for accumulation chart
     */
    private calculateLegendBounds(): void {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        this.accumulationLegendModule.getLegendOptions(this, <AccumulationSeries[]>this.visibleSeries);
        this.accumulationLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize);
    }
    /**
     * To render elements for accumulation chart
     * @private
     */
    public renderElements(): void {

        this.renderBorder();

        this.renderTitle();

        this.createSecondaryElement();

        this.renderSeries();

        this.renderLegend();

        appendChildElement(this.element, this.svgObject, this.redraw);

        this.processSelection();

        this.processExplode();

        this.renderAnnotation();

        this.setSecondaryElementPosition();

        this.trigger('loaded', { accumulation: this, chart: this });

        this.animateSeries = false;
    }
    /**
     * To set the left and top position for data label template for center aligned chart
     * @private
     */
    public setSecondaryElementPosition(): void {
        let tooltipParent: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!tooltipParent) {
            return;
        }
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        tooltipParent.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        tooltipParent.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }

    /**
     * To render the annotaitions for accumulation series.
     * @private
     */
    public renderAnnotation(): void {
        if (this.annotationModule) {
            this.annotationModule.renderAnnotations(
                getElement(this.element.id + '_Secondary_Element')
            );
        }
    }
    /**
     * Method to process the explode in accumulation chart
     * @private
     */
    public processExplode(): void {
        if (this.redraw) {
            return null ;
        }
        if (!this.visibleSeries[0].explode) {
                return null;
        }
        this.accBaseModule.invokeExplode();
    }
    /**
     * Method to render series for accumulation chart
     */
    private renderSeries(): void {
        if (!this.redraw) {
            this.svgObject.appendChild(this.renderer.createGroup({ id: this.element.id + '_SeriesCollection' }));
        }
        for (let series of this.visibleSeries) {
            if (series.visible && this[(firstToLowerCase(series.type) + 'SeriesModule')]) {
                this[(firstToLowerCase(series.type) + 'SeriesModule')].initProperties(this, series);
                series.renderSeries(this, this.redraw);
            }
        }
    }

    /**
     * Method to render border for accumulation chart
     */
    private renderBorder(): void {
        let padding: number = this.border.width;
        appendChildElement(
            this.svgObject, this.renderer.drawRectangle(new RectOption(
                this.element.id + '_border', this.background || this.themeStyle.background, this.border, 1,
                new Rect(padding / 2, padding / 2, this.availableSize.width - padding, this.availableSize.height - padding))
            ),
            this.redraw
        );
    }
    /**
     * Method to render legend for accumulation chart
     */
    private renderLegend(): void {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.accumulationLegendModule.legendCollections.length) {
            if (this.visibleSeries[0].type === 'Pie') {
                this.accumulationLegendModule.getSmartLegendLocation(
                    this.visibleSeries[0].labelBound, this.accumulationLegendModule.legendBounds, this.margin);
            }
            this.accumulationLegendModule.renderLegend(
                this, this.legendSettings, this.accumulationLegendModule.legendBounds, this.redraw);
        }
    }
    /**
     * To process the selection in accumulation chart
     * @private
     */
    public processSelection(): void {
        if (!this.accumulationSelectionModule || this.selectionMode === 'None') {
            return null;
        }
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.accumulationSelectionModule.selectedDataIndexes, null, true);
        this.accumulationSelectionModule.invokeSelection(this);
        if (selectedDataIndexes.length > 0) {
            this.accumulationSelectionModule.selectedDataIndexes = selectedDataIndexes;
            this.accumulationSelectionModule.redrawSelection(this, this.selectionMode);
        }
    }
    /**
     * To render title for accumulation chart
     */
    private renderTitle(): void {
        let rect: Rect;
        let margin: MarginModel = this.margin;
        if (!this.title) {
            return null;
        }
        let alignment: Alignment = this.titleStyle.textAlignment;
        let getAnchor: string = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        let titleSize: Size = measureText(this.title, this.titleStyle);
        rect = new Rect(
            margin.left, 0, this.availableSize.width - margin.left - margin.right, 0
        );
        let options: TextOption = new TextOption(
            this.element.id + '_title',
            titlePositionX(
                rect, this.titleStyle
            ),
            this.margin.top + (titleSize.height * 3 / 4),
            getAnchor, this.titleCollection, '', 'auto'
        );
        let element: Element = textElement(
            options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitle, this.svgObject, false, this.redraw
        );
        if (this.subTitle) {
            this.renderSubTitle(options);
        }
    }
    private renderSubTitle(options: TextOption): void {
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        let padding: number = 10;
        let rect: Rect;
        let alignment: Alignment = this.titleStyle.textAlignment;
        let getAnchor: Function = (alignment: Alignment): string => {
            return alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        };
        let subTitleElementSize: Size = measureText(this.subTitle, this.subTitleStyle);
        for (let titleText of this.titleCollection) {
            titleWidth = measureText(titleText, this.titleStyle).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        rect = new Rect(
            alignment === 'Center' ? (options.x - maxWidth / 2) : alignment === 'Far' ? options.x - maxWidth : options.x,
            0, maxWidth, 0
        );
        let subTitleOption: TextOption = new TextOption(
            this.element.id + '_subTitle',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding,
            getAnchor(this.subTitleStyle.textAlignment), this.subTitleCollection, '', 'auto'
        );
        let element: Element = textElement(
        subTitleOption, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartTitle, this.svgObject, false,
        this.redraw );
    }
    /**
     * To get the series parent element
     * @private
     */
    public getSeriesElement(): Element {
        return this.svgObject.getElementsByTagName('g')[0];
    }
    /**
     * To refresh the all visible series points
     * @private
     */
    public refreshSeries(): void {
        for (let series of this.visibleSeries) {
            this.refreshPoints(series.points);
        }
    }
    /**
     * To refresh points label region and visible
     * @private
     */
    public refreshPoints(points: AccPoints[]): void {
        for (let point of points) {
            point.labelPosition = null;
            point.labelRegion = null;
            point.labelVisible = true;
        }
    }
    /**
     * To get Module name
     *  @private
     */
    public getModuleName(): string {
        return 'accumulationchart';
    }
    /**
     * To destroy the accumulationcharts
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        super.destroy();
        this.element.classList.remove('e-accumulationchart');
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let enableAnnotation: boolean = false;
        modules.push({
            member: this.type + 'Series',
            args: [this]
        });

        if (this.legendSettings.visible) {
            modules.push({
                member: 'AccumulationLegend',
                args: [this]
            });
        }
        if (this.findDatalabelVisibility()) {
            modules.push({
                member: 'AccumulationDataLabel',
                args: [this]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'AccumulationTooltip',
                args: [this]
            });
        }
        if (this.selectionMode !== 'None') {
            modules.push({
                member: 'AccumulationSelection',
                args: [this]
            });
        }
        enableAnnotation = this.annotations.some((value: AccumulationAnnotationSettings) => {
            return (value.content !== null);
        });
        if (enableAnnotation) {
            modules.push({
                member: 'Annotation',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * To find datalabel visibility in series
     */
    private findDatalabelVisibility(): boolean {
        for (let series of this.series) {
            if (series.dataLabel.visible) {
                return true;
            }
        }
        return false;
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return '';
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: AccumulationChartModel, oldProp: AccumulationChartModel): void {
        let update: { refreshElements: boolean, refreshBounds: boolean } = {
            refreshElements: false, refreshBounds: false  };
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'theme':
                    this.animateSeries = true;
                    break;
                case 'title':
                case 'subTitle':
                case 'height':
                case 'width':
                case 'margin':
                    update.refreshBounds = true;
                    break;
                case 'titleStyle':
                    if (newProp.titleStyle && (newProp.titleStyle.size || newProp.titleStyle.textOverflow)) {
                        update.refreshBounds = true;
                    } else {
                        update.refreshElements = true;
                    }
                    break;
                case 'subTitleStyle':
                    if (newProp.subTitleStyle && (newProp.subTitleStyle.size || newProp.subTitleStyle.textOverflow)) {
                        update.refreshBounds = true;
                    } else {
                        update.refreshElements = true;
                    }
                    break;
                case 'legendSettings':
                    update.refreshBounds = true;
                    update.refreshElements = true;
                    break;
                case 'dataSource':
                    this.processData(false);
                    update.refreshBounds = true;
                    break;
                case 'series':
                    let len: number = this.series.length;
                    let seriesRefresh: boolean = false;
                    for (let i: number = 0; i < len; i++) {
                        if (newProp.series[i] && (newProp.series[i].dataSource || newProp.series[i].yName || newProp.series[i].xName)) {
                            seriesRefresh = true;
                        }
                        if (newProp.series[i] && newProp.series[i].explodeIndex !== oldProp.series[i].explodeIndex) {
                            this.accBaseModule.explodePoints(newProp.series[i].explodeIndex, this);
                            this.accBaseModule.deExplodeAll(newProp.series[i].explodeIndex, this.enableAnimation ? 300 : 0);
                        }
                    }
                    if (seriesRefresh) {
                        this.processData(false);
                        update.refreshBounds = true;
                    }
                    break;
                case 'locale':
                case 'currencyCode':
                    super.refresh(); break;
                case 'background':
                case 'border':
                case 'annotations':
                case 'enableSmartLabels':
                    update.refreshElements = true;
                    break;
                case 'isMultiSelect':
                case 'selectedDataIndexes':
                case 'selectionMode':
                    if (this.accumulationSelectionModule) {
                        if (isNullOrUndefined(this.accumulationSelectionModule.selectedDataIndexes)) {
                            this.accumulationSelectionModule.invokeSelection(this);
                        } else {
                            this.accumulationSelectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                    }
                    break;

            }
        }
        if (!update.refreshBounds && update.refreshElements) {
            this.createPieSvg();
            this.renderElements();
        } else if (update.refreshBounds) {
            this.refreshSeries();
            this.createPieSvg();
            this.calculateBounds();
            this.renderElements();
        }
    }
}