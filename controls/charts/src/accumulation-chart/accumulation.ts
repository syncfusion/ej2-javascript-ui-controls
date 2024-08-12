/**
 * AccumulationChart file
 */
import { Property, Component, Complex, Collection, NotifyPropertyChanges, INotifyPropertyChanged, animationMode } from '@syncfusion/ej2-base';
import { ModuleDeclaration, Internationalization, Event, EmitType, Browser, EventHandler, Touch } from '@syncfusion/ej2-base';
import { remove, extend, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { AccumulationChartModel } from './accumulation-model';
import { Font, Margin, Border, TooltipSettings, Indexes, CenterLabel } from '../common/model/base';
import { AccumulationSeries, AccPoints, PieCenter } from './model/acc-base';
import { AccumulationType, AccumulationSelectionMode, AccumulationHighlightMode } from './model/enum';
import { IAccSeriesRenderEventArgs, IAccTextRenderEventArgs } from './model/pie-interface';
import { IAccAnimationCompleteEventArgs, IAccPointRenderEventArgs, IAccLoadedEventArgs, IAccSelectionCompleteEventArgs } from './model/pie-interface';
import { getThemeColor } from '../common/model/theme';
import { ILegendRenderEventArgs, IMouseEventArgs, IPointEventArgs, ITooltipRenderEventArgs } from '../chart/model/chart-interface';
import { IAnnotationRenderEventArgs } from '../chart/model/chart-interface';
import { load, pointClick } from '../common/model/constants';
import { pointMove, chartDoubleClick, chartMouseClick, chartMouseDown } from '../common/model/constants';
import { chartMouseLeave, chartMouseMove, chartMouseUp, resized, beforeResize } from '../common/model/constants';
import { FontModel, MarginModel, BorderModel, IndexesModel, TooltipSettingsModel, CenterLabelModel } from '../common/model/base-model';
import { AccumulationSeriesModel, PieCenterModel } from './model/acc-base-model';
import { LegendSettings } from '../common/legend/legend';
import { AccumulationLegend } from './renderer/legend';
import { LegendSettingsModel } from '../common/legend/legend-model';
import { ChartLocation, subtractRect, indexFinder, appendChildElement, redrawElement, blazorTemplatesReset, getTextAnchor, stringToNumber, textWrap } from '../common/utils/helper';
import { RectOption, showTooltip, ImageOption } from '../common/utils/helper';
import { textElement, createSvg, calculateSize, removeElement, firstToLowerCase, withInBounds } from '../common/utils/helper';
import { getElement, titlePositionX } from '../common/utils/helper';
import { Rect, Size, measureText, TextOption, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Data } from '../common/model/data';
import { AccumulationTooltip } from './user-interaction/tooltip';
import { AccumulationBase } from './renderer/accumulation-base';
import { PieSeries } from './renderer/pie-series';
import { AccumulationDataLabel } from './renderer/dataLabel';
import { FunnelSeries } from './renderer/funnel-series';
import { PyramidSeries } from './renderer/pyramid-series';
import { AccumulationSelection } from './user-interaction/selection';
import { AccumulationHighlight } from './user-interaction/high-light';
import { AccumulationTheme } from './model/enum';
import { AccumulationAnnotationSettingsModel } from './model/acc-base-model';
import { AccumulationAnnotationSettings } from './model/acc-base';
import { AccumulationAnnotation } from './annotation/annotation';
import { IPrintEventArgs } from '../chart/model/chart-interface';
import { Alignment, ExportType, SelectionPattern } from '../common/utils/enum';
import { getTitle, AccPointData } from '../common/utils/helper';
import { Index } from '../common/model/base';
import { IThemeStyle } from '../chart/model/chart-interface';
import { IAccResizeEventArgs, IAccBeforeResizeEventArgs, IAccLegendClickEventArgs } from './model/pie-interface';
import { DataManager } from '@syncfusion/ej2-data';
import { Export } from '../chart/print-export/export';
import { Animation, AnimationOptions, compile as templateComplier} from '@syncfusion/ej2-base';
import { PrintUtils } from '../common/utils/print';
import { IAfterExportEventArgs } from '../common/model/interface';

/**
 * Represents the AccumulationChart control.
 * ```html
 * <div id="accumulation"/>
 * <script>
 *   var accObj = new AccumulationChart({ });
 *   accObj.appendTo("#accumulation");
 * </script>
 * ```
 *
 * @public
 */
@NotifyPropertyChanges
export class AccumulationChart extends Component<HTMLElement> implements INotifyPropertyChanged {

    // Module declarations

    /**
     * `accBaseModue` is used to define the common functionalities of accumulation series
     *
     * @private
     */
    public accBaseModule: AccumulationBase;

    /**
     * `pieSeriesModule` is used to render pie series.
     *
     * @private
     */
    public pieSeriesModule: PieSeries;

    /**
     * `funnelSeriesModule` is used to render funnel series.
     *
     * @private
     */
    public funnelSeriesModule: FunnelSeries;

    /**
     * `pyramidSeriesModule` is used to render funnel series.
     *
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
     * `accumulationHighlightModule` is used to manipulate and add highlight to the accumulation chart.
     */
    public accumulationHighlightModule: AccumulationHighlight;
    /**
     * `annotationModule` is used to manipulate and add annotation in chart.
     */
    public annotationModule: AccumulationAnnotation;
    /**
     * Export Module is used to export Accumulation chart.
     */
    public exportModule: Export;

    // Property declarations goes here

    /**
     * The width of the chart as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, chart will render to the full width of its parent element.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, chart will render to the full height of its parent element.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * The title for accumulation chart.
     *
     * @default null
     */
    @Property(null)
    public title: string;

    /**
     * The background image of the chart that accepts value in string as url link or location of an image.
     *
     * @default null
     */
    @Property(null)
    public backgroundImage: string;

    /**
     * Configuration for the center of the pie chart.
     */
    @Complex<PieCenterModel>({}, PieCenter)
    public center: PieCenterModel;

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
     *
     * @default ''
     */

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Options for customizing the `title` of accumulation chart.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public titleStyle: FontModel;

    /**
     * The subtitle for accumulation chart.
     *
     * @default null
     */
    @Property(null)
    public subTitle: string;

    /**
     * Options for customizing the `subTitle` of the accumulation chart.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public subTitleStyle: FontModel;

    /**
     * Options for customizing the legend of accumulation chart.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Options for customizing the tooltip of accumulation chart.
     */

    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltip: TooltipSettingsModel;

    /**
     * Options for customizing the center label of accumulation chart.
     */

    @Complex<CenterLabelModel>({}, CenterLabel)
    public centerLabel: CenterLabelModel;

    /**
     * Specifies whether point has to get selected or not. Takes value either 'None 'or 'Point'
     * * None: Disables the selection.
     * * Point: selects a point.
     *
     * @default None
     */
    @Property('None')
    public selectionMode: AccumulationSelectionMode;

    /**
     * Defines the highlight color for the data point when user hover the data point.
     *
     * @default ''
     */

    @Property('')
    public highlightColor: string;

    /**
     * Specifies whether point has to get highlighted or not. Takes value either 'None 'or 'Point'
     * * None: Disables the highlight.
     * * Point: highlight a point.
     *
     * @default None
     */
    @Property('None')
    public highlightMode: AccumulationHighlightMode;

    /**
     * Specifies whether series or data point for accumulation chart has to be selected. They are,
     * * None: Sets none as selecting pattern to accumulation chart .
     * * Chessboard: Sets chess board as selecting pattern accumulation chart .
     * * Dots: Sets dots as  selecting pattern accumulation chart .
     * * DiagonalForward: Sets diagonal forward as selecting pattern to accumulation chart .
     * * Crosshatch: Sets crosshatch as selecting pattern to accumulation chart.
     * * Pacman: Sets pacman selecting pattern to accumulation chart.
     * * DiagonalBackward: Sets diagonal backward as selecting pattern to accumulation chart.
     * * Grid: Sets grid as selecting pattern to accumulation chart.
     * * Turquoise: Sets turquoise as selecting pattern to accumulation chart.
     * * Star: Sets star as selecting pattern to accumulation chart.
     * * Triangle: Sets triangle as selecting pattern to accumulation chart.
     * * Circle: Sets circle as selecting pattern to accumulation chart.
     * * Tile: Sets tile as selecting pattern to accumulation chart.
     * * HorizontalDash: Sets horizontal dash as selecting pattern to accumulation chart.
     * * VerticalDash: Sets vertical dash as selecting pattern to accumulation chart.
     * * Rectangle: Sets rectangle as selecting pattern.
     * * Box: Sets box as selecting pattern to accumulation chart.
     * * VerticalStripe: Sets vertical stripe as  selecting pattern to accumulation chart.
     * * HorizontalStripe: Sets horizontal stripe as selecting pattern to accumulation chart.
     * * Bubble: Sets bubble as selecting pattern to accumulation chart.
     *
     * @default None
     */
    @Property('None')
    public selectionPattern: SelectionPattern;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * None: Sets none as highlighting pattern to accumulation chart.
     * * Chessboard: Sets chess board as highlighting pattern to accumulation chart.
     * * Dots: Sets dots as highlighting pattern to accumulation chart.
     * * DiagonalForward: Sets diagonal forward as highlighting pattern to accumulation chart.
     * * Crosshatch: Sets crosshatch as highlighting pattern to accumulation chart.
     * * Pacman: Sets pacman highlighting  pattern to accumulation chart.
     * * Diagonalbackward: Sets diagonal backward as highlighting pattern to accumulation chart.
     * * Grid: Sets grid as highlighting pattern to accumulation chart.
     * * Turquoise: Sets turquoise as highlighting pattern to accumulation chart.
     * * Star: Sets star as highlighting  pattern to accumulation chart.
     * * Triangle: Sets triangle as highlighting pattern to accumulation chart.
     * * Circle: Sets circle as highlighting  pattern to accumulation chart.
     * * Tile: Sets tile as highlighting pattern to accumulation chart.
     * * HorizontalDash: Sets horizontal dash as highlighting pattern to accumulation chart.
     * * VerticalDash: Sets vertical dash as highlighting pattern to accumulation chart.
     * * Rectangle: Sets rectangle as highlighting  pattern to accumulation chart.
     * * Box: Sets box as highlighting pattern to accumulation chart.
     * * VerticalStripe: Sets vertical stripe as highlighting  pattern to accumulation chart.
     * * HorizontalStripe: Sets horizontal stripe as highlighting  pattern to accumulation chart.
     * * Bubble: Sets bubble as highlighting  pattern to accumulation chart.
     *
     * @default None
     */
    @Property('None')
    public highlightPattern: SelectionPattern;

    /**
     * If set true, enables the border in pie and accumulation chart while mouse moving.
     *
     * @default true
     */
    @Property(true)
    public enableBorderOnMouseMove: boolean;

    /**
     * If set true, enables the multi selection in accumulation chart. It requires `selectionMode` to be `Point`.
     *
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * If set true, enables the animation for both chart and accumulation.
     *
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
     *
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
     *
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
     *
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
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: AccumulationTheme;

    /**
     * Specifies whether a grouping separator should be used for a number.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

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
     * Triggers after accumulation chart loaded.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<IAccLoadedEventArgs>;

    /**
     * Triggers after legend clicked.
     *
     * @event legendClick
     */
    @Event()
    public legendClick: EmitType<IAccLegendClickEventArgs>;

    /**
     * Triggers before accumulation chart load.
     *
     * @event load
     */
    @Event()
    public load: EmitType<IAccLoadedEventArgs>;

    /**
     * Triggers before the series gets rendered.
     *
     * @event seriesRender
     * @deprecated
     */
    @Event()
    public seriesRender: EmitType<IAccSeriesRenderEventArgs>;

    /**
     * Triggers before the legend gets rendered.
     *
     * @event legendRender
     * @deprecated
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for series gets rendered.
     *
     * @event textRender
     * @deprecated
     */
    @Event()
    public textRender: EmitType<IAccTextRenderEventArgs>;

    /**
     * Triggers before the tooltip for series gets rendered.
     *
     * @event tooltipRender
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before each points for series gets rendered.
     *
     * @event pointRender
     * @deprecated
     */

    @Event()
    public pointRender: EmitType<IAccPointRenderEventArgs>;

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
     * Triggers on hovering the accumulation chart.
     *
     * @event chartMouseMove
     * @blazorProperty 'OnChartMouseMove'
     */

    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the accumulation chart.
     *
     * @event chartMouseClick
     * @blazorProperty 'OnChartMouseClick'
     */

    @Event()
    public chartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * Triggers on double clicking the accumulation chart.
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
     * Triggers on point move.
     *
     * @event pointMove
     * @blazorProperty 'PointMoved'
     */

    @Event()
    public pointMove: EmitType<IPointEventArgs>;

    /**
     * Triggers after animation gets completed for series.
     *
     * @event animationComplete
     * @blazorProperty 'OnAnimationComplete'
     */
    @Event()
    public animationComplete: EmitType<IAccAnimationCompleteEventArgs>;

    /**
     * Triggers on mouse down.
     *
     * @event chartMouseDown
     * @blazorProperty 'OnChartMouseDown'
     */

    @Event()
    public chartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers while cursor leaves the accumulation chart.
     *
     * @event chartMouseLeave
     * @blazorProperty 'OnChartMouseLeave'
     */

    @Event()
    public chartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     *
     * @event chartMouseUp
     * @blazorProperty 'OnChartMouseUp'
     */

    @Event()
    public chartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers before window resize.
     *
     * @event beforeResize
     * @blazorProperty 'BeforeResize'
     */
    @Event()
    public beforeResize: EmitType<IAccBeforeResizeEventArgs>;

    /**
     * Triggers after window resize.
     *
     * @event resized
     * @blazorProperty 'Resized'
     */

    @Event()
    public resized: EmitType<IAccResizeEventArgs>;

    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     * @blazorProperty 'AfterExport'
     */
    @Event()
    public afterExport: EmitType<IAfterExportEventArgs>;

    /**
     * Triggers after the selection is completed.
     *
     * @event selectionComplete
     */

    @Event()
    public selectionComplete: EmitType<IAccSelectionCompleteEventArgs>;

    /**
     * Defines the currencyCode format of the accumulation chart
     *
     * @private
     * @aspType string
     */

    @Property('USD')
    private currencyCode: string;

    /**
     * Animate the series bounds on data change.
     *
     * @private
     * @param {number} duration - The duration of the animation.
     * @returns {void}
     */
    public animate(duration?: number): void {
        this.duration = (duration === 0 && animationMode === 'Enable') ? 700 : duration;
        this.animateselected = true;
        this.animateSeries = false;
        let temIndex: number = 0;
        const tempcolor: string[] = [];
        const tempindex: number[] = [];
        const tempindex1: number[] = [];
        const currentSeries: AccumulationSeries = this.visibleSeries[0];
        let datasource: object[] = [];
        datasource = currentSeries.dataSource as Object[];
        currentSeries.sumOfPoints = 0;
        if (currentSeries.points.length < Object.keys(currentSeries.dataSource).length) {
            this.refresh();
        } else if (currentSeries.points.length > Object.keys(currentSeries.dataSource).length) {
            const currentSeries: AccumulationSeries = this.visibleSeries[0];
            currentSeries.points = currentSeries.points.filter((entry1: AccPoints) => {
                entry1.visible = false;
                tempindex.push(entry1.index);
                tempcolor.push(entry1.color);
                return (datasource).some((entry2: AccPoints) => {
                    const accPoint: AccPoints = entry2 as AccPoints;
                    if (entry1.x === accPoint.x) {
                        entry1.visible = true;
                        tempindex1.push(entry1.index);
                        entry1.index = temIndex;
                        temIndex++;
                    }
                    return entry1.x === accPoint.x;
                });
            });
            const missing: number[] = tempindex.filter((item: number) => tempindex1.indexOf(item) < 0);
            const interval: number = tempindex.length - missing.length;
            for (let i: number = (tempindex.length - 1); i >= interval; i--) {
                removeElement('container_Series_0_Point_' + tempindex[i as number]);
            }
            for (let i: number = 0; i < currentSeries.points.length; i++) {
                currentSeries.points[i as number].y = currentSeries.dataSource[i as number].y;
                currentSeries.points[i as number].color = tempcolor[i as number];
                currentSeries.sumOfPoints += currentSeries.dataSource[i as number].y;
            }
            this.redraw = this.enableAnimation;
            this.animateSeries = false;
            this.calculateBounds();
            this.renderElements();
        } else {
            for (let i: number = 0; i < currentSeries.points.length; i++) {
                currentSeries.points[i as number].y = currentSeries.dataSource[i as number][currentSeries.yName];
                currentSeries.points[i as number].color = currentSeries.dataSource[i as number][currentSeries.pointColorMapping] != null
                    ? currentSeries.dataSource[i as number][currentSeries.pointColorMapping] : currentSeries.points[i as number].color;
                currentSeries.sumOfPoints += currentSeries.dataSource[i as number][currentSeries.yName];
            }
            this.redraw = this.enableAnimation;
            this.animateSeries = false;
            this.removeSvg();
            this.refreshPoints(currentSeries.points);
            this.renderElements();
        }
    }

    // internal properties for Accumulation charts
    /** @private */
    public svgObject: Element;
    /** @private */
    private animateselected: boolean = false;
    /** @public */
    public duration: number;
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public availableSize: Size;
    /** @private */
    public renderer: SvgRenderer | CanvasRenderer;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public visibleSeries: AccumulationSeries[];
    /** @private */
    public seriesCounts: number;
    /** @private */
    public explodeDistance: number = 0;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    private resizeTo: number;
    /** @private */
    public origin: ChartLocation;
    /** @private */
    public currentLegendIndex: number = 0;
    /** @private */
    public currentPointIndex: number = 0;
    /** @private */
    public previousTargetId: string = '';
    /** @private */
    public isLegendClicked: boolean = false;
    /**
     * Gets the type of accumulation chart.
     *
     * @returns {AccumulationType} - The type of accumulation chart.
     * @private
     * */
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
    /**
     * Defines the format of center label
     *
     * @private
     */
    private format: string;
    private titleCollection: string[];
    private subTitleCollection: string[];
    /** @private */
    public themeStyle: IThemeStyle;
    private chartid: number = 57724;
    /** @private */
    public isBlazor: boolean;
    /** @private */
    public accumulationResizeBound: EventListenerOrEventListenerObject;
    /**
     * Constructor for creating the AccumulationChart widget.
     *
     * @private
     * @param {AccumulationChartModel} options - Specifies the accumulation chart model.
     * @param {string | HTMLElement} element - Specifies the element for the accumulation chart.
     */
    constructor(options?: AccumulationChartModel, element?: string | HTMLElement) {
        super(options, element);
    }

    // accumulation chart methods.
    /**
     * To create svg object, renderer and binding events for the container.
     *
     * @returns {void}
     */
    protected preRender(): void {
        const blazor: string = 'Blazor';
        this.isBlazor = window[blazor as string];
        this.allowServerDataBinding = false;

        this.unWireEvents();
        this.setCulture();
        this.animateSeries = true;
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-accumulationchart').length;
            this.element.id = 'acc_chart_' + this.chartid + '_' + collection;
        }
        this.wireEvents();
        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : 'ltr');
    }
    /**
     * Themeing for chart goes here.
     *
     * @returns {void}
     */
    private setTheme(): void {
        /** Set theme for accumulation chart */
        this.themeStyle = getThemeColor(this.theme, false, this);
    }
    /**
     * To render the accumulation chart elements.
     *
     * @returns {void}
     */
    protected render(): void {
        if (this.element.className.indexOf('e-accumulationchart') === -1) {
            this.element.classList.add('e-accumulationchart');
        }
        this.element.setAttribute('role', 'region');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('aria-label', this.title + '. Syncfusion interactive chart.');
        this.element.setAttribute('class', this.element.getAttribute('class') + ' e-accumulationchart-focused');
        const loadEventData: IAccLoadedEventArgs = {
            chart: this.isBlazor ? {} as AccumulationChart : this,
            accumulation: this.isBlazor ? {} as AccumulationChart : this,
            theme: this.theme, name: load, cancel: false
        };
        this.trigger(load, loadEventData, () => {

            this.theme = this.isBlazor ? loadEventData.theme : this.theme;
            this.setTheme();

            this.accBaseModule = new AccumulationBase(this);
            this.pieSeriesModule = new PieSeries(this);

            this.calculateVisibleSeries();

            this.processData();

            this.renderComplete();

            this.allowServerDataBinding = true;
        });

    }
    /**
     * Method to unbind events for accumulation chart.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        /** Find the Events type */
        const isIE11Pointer: boolean = Browser.isPointer;

        const start: string = Browser.touchStartEvent;
        const move: string = Browser.touchMoveEvent;
        const stop: string = Browser.touchEndEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /** UnBind the Event handler */

        EventHandler.remove(this.element, move, this.accumulationMouseMove);
        EventHandler.remove(this.element, stop, this.accumulationMouseEnd);
        EventHandler.remove(this.element, start, this.accumulationMouseStart);
        EventHandler.remove(this.element, 'click', this.accumulationOnMouseClick);
        EventHandler.remove(this.element, 'dblclick', this.accumulationOnDoubleClick);
        EventHandler.remove(this.element, 'contextmenu', this.accumulationRightClick);
        EventHandler.remove(this.element, cancel, this.accumulationMouseLeave);
        EventHandler.remove(this.element, 'keydown', this.accumulationChartKeyDown);
        EventHandler.remove(document.body, 'keydown', this.documentKeyHandler);
        EventHandler.remove(this.element, 'keyup', this.accumulationChartKeyUp);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.accumulationResizeBound
        );
    }
    /**
     * Method to bind events for the accumulation chart.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /** Find the Events type */

        const isIE11Pointer: boolean = Browser.isPointer;
        const start: string = Browser.touchStartEvent;
        const stop: string = Browser.touchEndEvent;
        const move: string = Browser.touchMoveEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';

        /** Bind the Event handler */
        EventHandler.add(this.element, move, this.accumulationMouseMove, this);
        EventHandler.add(this.element, stop, this.accumulationMouseEnd, this);
        EventHandler.add(this.element, start, this.accumulationMouseStart, this);
        EventHandler.add(this.element, 'click', this.accumulationOnMouseClick, this);
        EventHandler.add(this.element, 'dblclick', this.accumulationOnDoubleClick, this);
        EventHandler.add(this.element, 'contextmenu', this.accumulationRightClick, this);
        EventHandler.add(this.element, cancel, this.accumulationMouseLeave, this);
        EventHandler.add(this.element, 'keydown', this.accumulationChartKeyDown, this);
        EventHandler.add(document.body, 'keydown', this.documentKeyHandler, this);
        EventHandler.add(this.element, 'keyup', this.accumulationChartKeyUp, this);
        this.accumulationResizeBound = this.accumulationResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.accumulationResizeBound
        );
        new Touch(this.element); // To avoid geasture blocking for browser
        /** Apply the style for chart */
        this.setStyle(<HTMLElement>this.element);
    }
    /**
     * Method to set mouse x, y from events.
     *
     * @param {PointerEvent} e - The pointer event containing mouse coordinates.
     * @returns {void}
     */
    private setMouseXY(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        const svgRectElement: Element = getElement(this.element.id + '_svg');
        if (svgRectElement && this.element) {
            const svgRect: ClientRect = svgRectElement.getBoundingClientRect();
            const rect: ClientRect = this.element.getBoundingClientRect();
            if (e.type.indexOf('touch') > -1) {
                this.isTouch = true;
                const touchArg: TouchEvent = <TouchEvent & PointerEvent>e;
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
    }
    /**
     * Handles the mouse end.
     *
     * @param {PointerEvent} e - The pointer event containing mouse coordinates.
     * @returns {boolean} - Mouse end of accumulation chart.
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
        if (this.centerLabel.hoverTextFormat) {
            this.updateCenterLabel(e);
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
     *
     * @param {PointerEvent} e - The pointer event containing mouse coordinates.
     * @returns {boolean} - Mouse start of accumulation chart.
     * @private
     */
    public accumulationMouseStart(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger(chartMouseDown, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        return false;
    }
    /**
     * Handles the accumulation chart resize.
     *
     * @returns {boolean} - Resize method of accumulation chart.
     * @private
     */
    public accumulationResize(): boolean {
        this.animateSeries = false;
        const args: IAccResizeEventArgs = {
            accumulation: this.isBlazor ? {} as AccumulationChart : this,
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
            name: resized,
            currentSize: new Size(0, 0),
            chart: this.isBlazor ? {} as AccumulationChart : this
        };
        const beforeResizeArgs: IAccBeforeResizeEventArgs = { name: 'beforeResize', cancelResizedEvent: false };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.trigger(beforeResize, beforeResizeArgs);
        if (!beforeResizeArgs.cancelResizedEvent) {
            this.resizeTo = +setTimeout(
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
        }
        return false;
    }

    /**
     * Handles the print method for accumulation chart control.
     *
     * @param {string[] | string | Element} id - The id of the accumulation chart to be printed on the page.
     * @returns {void}
     */
    public print(id?: string[] | string | Element): void {
        // To handle the print funtion in IE and Edge browsers
        const clippath: string = document.getElementById(this.element.id + '_Series_0').style.clipPath;
        document.getElementById(this.element.id + '_Series_0').style.clipPath = '';
        const exportChart: PrintUtils = new PrintUtils(this);
        exportChart.print(id);
        document.getElementById(this.element.id + '_Series_0').style.clipPath = clippath;
    }

    /**
     * Export method for the chart.
     *
     * @param {ExportType} type - The type of export.
     * @param {string} fileName - The name of the file for export.
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
     * Applying styles for accumulation chart element.
     *
     * @param {HTMLElement} element - Specifies the element.
     * @returns {void}
     */
    private setStyle(element: HTMLElement): void {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        element.style.height = (element.style.height || (this.height && this.height.indexOf('%') === -1)) ? element.style.height : 'inherit';
        let tabColor: string = '';
        switch (this.theme) {

        case 'HighContrastLight':
        case 'HighContrast':
            tabColor = '#969696';
            break;
        case 'MaterialDark':
        case 'FabricDark':
        case 'Bootstrap':
        case 'Bootstrap4':
            tabColor = '#66afe9';
            break;
        case 'Tailwind':
        case 'TailwindDark':
            tabColor = '#4f46e5';
            break;
        case 'Bootstrap5':
        case 'Bootstrap5Dark':
            tabColor = '#0d6efd';
            break;
        case 'Fluent':
        case 'FluentDark':
            tabColor = '#9e9e9e';
            break;
        case 'Fluent2':
        case 'Fluent2Dark':
            tabColor = '#0078D4';
            break;
        default:
            tabColor = '#9e9e9e';
            break;
        }
        const style: HTMLStyleElement = document.createElement('style');
        style.setAttribute('id', element.id + 'Keyboard_accumulationchart_focus');
        style.innerText = '.e-accumulationchart-focused:focus,path[id*=_Series_0_Point_]:focus, text[id*=_title]:focus' +
        '{outline: none} .e-accumulationchart-focused:focus-visible,path[id*=_Series_0_Point_]:focus-visible, text[id*=_title]:focus-visible' +
            '{outline: 1.5px ' + tabColor + ' solid}';
        document.body.appendChild(style);
    }

    /**
     * Method to set the annotation content dynamically for accumulation.
     *
     * @param {number} annotationIndex - The index of the annotation.
     * @param {string} content - The content to set for the annotation.
     * @returns {void}
     */
    public setAnnotationValue(annotationIndex: number, content: string): void {
        const annotation: AccumulationAnnotationSettings = <AccumulationAnnotationSettings>this.annotations[annotationIndex as number];
        let element: HTMLElement;
        const parentNode: Element = getElement(this.element.id + '_Annotation_Collections');
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
     *
     * @param {PointerEvent} e - The pointer event containing mouse coordinates.
     * @returns {boolean} - Mouse move of accumulation chart.
     * @private
     */
    public accumulationMouseMove(e: PointerEvent): boolean {
        if (!getElement(this.element.id + '_svg')) {
            return false;
        }
        this.setMouseXY(e);
        this.trigger(chartMouseMove, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, <Element>e.target, e);
        }
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.move(e);
        }
        if (this.accumulationDataLabelModule && this.visibleSeries[0] && this.visibleSeries[0].dataLabel.visible) {
            this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY);
        }
        if (this.centerLabel.hoverTextFormat) {
            this.updateCenterLabel(e);
        }
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
        }
        if (this.enableBorderOnMouseMove && this.type === 'Pie' && this.pieSeriesModule &&
            withInBounds(this.mouseX, this.mouseY, this.initialClipRect)) {
            this.pieSeriesModule.findSeries(e);
        }
        this.notify(Browser.touchMoveEvent, e);

        return false;
    }
    public titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        const id: boolean = (targetId === (this.element.id + '_title') || targetId === (this.element.id + '_subTitle') ||
            targetId === (this.element.id + '_chart_legend_title'));
        if (((<HTMLElement>event.target).textContent.indexOf('...') > -1) && id) {
            const title: string = (targetId === (this.element.id + '_title')) ?
                this.title : (targetId === (this.element.id + '_subTitle')) ? this.subTitle : this.legendSettings.title;
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
     * Handles the keyboard onkeydown on chart.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {boolean} - false
     * @private
     */
    public accumulationChartKeyDown(e: KeyboardEvent): boolean {
        let actionKey: string = '';

        if (this.tooltip.enable && ((e.code === 'Tab' && this.previousTargetId.indexOf('Series') > -1) || e.code === 'Escape')) {
            actionKey = 'ESC';
        }
        if (e.code.indexOf('Arrow') > -1) {
            e.preventDefault();
        }

        if (e.ctrlKey && (e.key === 'p')) {
            e.preventDefault();
            actionKey = 'CtrlP';
        }

        if (actionKey !== '') {
            this.chartKeyboardNavigations(e, (e.target as HTMLElement).id, actionKey);
        }
        return false;
    }

    /**
     * Handles the keyboard onkeydown on chart.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {boolean} - false
     * @private
     */
    public accumulationChartKeyUp(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        let targetId: string = e.target['id'];

        const legendElement: HTMLElement = getElement(this.element.id + '_chart_legend_translate_g') as HTMLElement;
        const pagingElement: HTMLElement = getElement(this.element.id + '_chart_legend_pageup') as HTMLElement;

        if (legendElement) {
            const firstChild: HTMLElement = legendElement.firstElementChild as HTMLElement;
            let className: string = firstChild.getAttribute('class');
            if (className && className.indexOf('e-accumulationchart-focused') === -1) {
                className = className + ' e-accumulationchart-focused';
            }
            else if (!className) {
                className = 'e-accumulationchart-focused';
            }
            firstChild.setAttribute('class', className);
        }
        if (pagingElement) { pagingElement.setAttribute('class', 'e-accumulationchart-focused'); }


        if (e.code === 'Tab') {
            if (this.previousTargetId !== '') {
                if (this.previousTargetId.indexOf('_Point_') > -1 && targetId.indexOf('_Point_') === -1) {
                    const groupElement: HTMLElement = document.getElementById(this.previousTargetId).parentElement;
                    this.setTabIndex(groupElement.children[this.currentPointIndex] as HTMLElement,
                                     groupElement.firstElementChild as HTMLElement);
                    this.currentPointIndex = 0;
                }
                else if (this.previousTargetId.indexOf('_chart_legend_page') > -1 && targetId.indexOf('_chart_legend_page') === -1 &&
                   targetId.indexOf('_chart_legend_g_') === -1) {
                    this.setTabIndex(e.target as HTMLElement, pagingElement);
                }
                else if (this.previousTargetId.indexOf('_chart_legend_g_') > -1 && targetId.indexOf('chart_legend_g_') === -1) {
                    this.setTabIndex(legendElement.children[this.currentLegendIndex] as HTMLElement,
                                     legendElement.firstElementChild as HTMLElement);
                }
            }

            this.previousTargetId = targetId;
            if (targetId.indexOf('_chart_legend_g_') > -1 && this.highlightMode !== 'None') {
                targetId = e.target['lastElementChild'].id;
                actionKey = 'Tab';
            }
            else if (targetId.indexOf('_Point_') > -1 && (this.highlightMode !== 'None' || this.tooltip.enable)) {
                actionKey = 'Tab';
            }
        }
        else if (e.code.indexOf('Arrow') > -1) {
            e.preventDefault();

            if (targetId.indexOf('_chart_legend_page') > -1) {
                (e.target as HTMLElement).removeAttribute('tabindex');
                this.previousTargetId = targetId = this.element.id + '_chart_legend_page' + (e.code === 'ArrowRight' ? 'up' : 'down');
                this.focusTarget(getElement(targetId) as HTMLElement);
            }
            else if ((targetId.indexOf('_chart_legend_') > -1)) {
                (e.target as HTMLElement).removeAttribute('tabindex');
                this.currentLegendIndex += (e.code === 'ArrowUp' || e.code === 'ArrowRight') ? + 1 : - 1;
                this.currentLegendIndex = this.getActualIndex(this.currentLegendIndex, legendElement.children.length);

                const currentLegend: Element = legendElement.children[this.currentLegendIndex];
                this.focusTarget(currentLegend as HTMLElement);
                this.previousTargetId = targetId = currentLegend.lastElementChild.id;
                actionKey = this.highlightMode !== 'None' ? 'ArrowMove' : '';
            }
            else if (targetId.indexOf('_Point_') > -1) {
                (e.target as HTMLElement).setAttribute('tabindex', '-1');
                this.currentPointIndex += (e.code === 'ArrowUp' || e.code === 'ArrowRight') ? + 1 : - 1;
                let totalLength: number = 0;
                for (let i: number = 0; i < e.target['parentElement'].children.length; i++) {
                    totalLength = e.target['parentElement'].children[i as number].id.indexOf('_Point_') > -1 ? totalLength + 1 : totalLength;
                }
                this.currentPointIndex = this.getActualIndex(this.currentPointIndex, totalLength);
                targetId = this.element.id + '_Series_0_Point_' + this.currentPointIndex;
                this.focusTarget(getElement(targetId) as HTMLElement);
                actionKey = this.tooltip.enable ? 'ArrowMove' : '';
            }
        }
        else if ((e.code === 'Enter' || e.code === 'Space') && ((targetId.indexOf('_chart_legend_') > -1) ||
            (targetId.indexOf('_Point_') > -1))) {
            targetId = (targetId.indexOf('_chart_legend_g') > -1) ? e.target['lastElementChild'].id : targetId;
            actionKey = 'Enter';
        }

        if (actionKey !== '') {
            this.chartKeyboardNavigations(e, targetId, actionKey);
        }
        return false;
    }

    private setTabIndex(previousElement: HTMLElement, currentElement: HTMLElement): void {
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

    private focusTarget(element: HTMLElement): string {
        let className: string = element.getAttribute('class');
        element.setAttribute('tabindex', '0');
        if (className && className.indexOf('e-accumulationchart-focused') === -1) {
            className = className + ' e-accumulationchart-focused';
        } else if (!className) {
            className = 'e-accumulationchart-focused';
        }
        element.setAttribute('tabindex', '0');
        element.setAttribute('class', className);
        element.focus();
        return element.id;
    }

    /**
     * Handles the document onkey.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {void}
     * @private
     */
    private documentKeyHandler(e: KeyboardEvent): void {
        // 74 - J
        if (e.altKey && e.keyCode === 74 && !isNullOrUndefined(this.element)) {
            this.element.focus();
        }
    }


    private chartKeyboardNavigations(e: KeyboardEvent, targetId: string, actionKey: string): void {
        this.isLegendClicked = false;
        switch (actionKey) {
        case 'Tab':
        case 'ArrowMove':
            if (this.accumulationHighlightModule) {
                //  this.accumulationHighlightModule.removeHighlightElements();
            }
            if (targetId.indexOf('_Point_') > -1) {
                const seriesIndex: number = +(targetId.split('_Series_')[1].split('_Point_')[0]);
                const pointIndex: number = +(targetId.split('_Series_')[1].replace('_Symbol', '').split('_Point_')[1]);

                const pointRegion: ChartLocation = this.visibleSeries[seriesIndex as number].points[pointIndex as number].symbolLocation;
                this.mouseX = pointRegion.x + this.initialClipRect.x;
                this.mouseY = pointRegion.y + this.initialClipRect.y;
                if (this.accumulationHighlightModule) {
                    let targetElement: Element = getElement(targetId);
                    if (!isNullOrUndefined(targetElement)) {
                        if (targetElement.id.indexOf('text') > 1) {
                            targetElement = getElement(targetElement.id.replace('text', 'shape'));
                        }
                        if ((targetElement).hasAttribute('class') && (targetElement).getAttribute('class').indexOf('highlight') > -1) {
                            return;
                        }
                        this.accumulationHighlightModule.calculateSelectedElements(this, targetElement, 'mousemove');
                        return;
                    }
                }
                if (this.accumulationTooltipModule) {
                    const series: AccumulationSeries = this.visibleSeries[seriesIndex as number];
                    let data: AccPointData;
                    if (series.enableTooltip) {
                        data = new AccPointData(series.points[pointIndex as number], series);
                    }
                    this.accumulationTooltipModule.renderSeriesTooltip(this, data);
                }
            }
            if (this.accumulationHighlightModule && this.highlightMode !== 'None') {
                targetId = targetId.indexOf('_chart_legend_g_') > -1 ? document.getElementById(targetId).firstChild['id'] : targetId;
                const legendID: string = this.element.id + '_chart_legend';
                const legendItemsId: string[] = [legendID + '_text_', legendID + '_shape_marker_',
                    legendID + '_shape_'];
                for (let i: number = 0; i < legendItemsId.length; i++) {
                    const id: string = legendItemsId[i as number];
                    if (targetId.indexOf(id) > -1) {
                        document.getElementById(targetId).setAttribute('class', '');
                        this.accumulationHighlightModule.legendSelection(this, 0, parseInt(targetId.split(id)[1], 10),
                                                                         getElement(targetId), 'mousemove');
                        break;
                    }
                }
            }
            break;

        case 'Enter':
        case 'Space':
            if (targetId.indexOf('_chart_legend_') > -1 && this.accumulationLegendModule) {
                this.isLegendClicked = true;
                this.accumulationLegendModule.click(e as Event);
                this.focusChild(document.getElementById(targetId).parentElement);
            } else {
                if (this.accumulationSelectionModule) {
                    this.accumulationSelectionModule.calculateSelectedElements(this, document.getElementById(targetId), 'click');
                }
            }
            break;
        case 'CtrlP':
            this.print();
            break;
        case 'ESC':
            if (this.accumulationTooltipModule) {
                this.accumulationTooltipModule.removeTooltip(1);
            }
            break;
        }

    }

    private focusChild(element: HTMLElement): string {
        element.setAttribute('tabindex', '0');
        let className: string = element.getAttribute('class');
        element.setAttribute('tabindex', '0');
        if (className && className.indexOf('e-accumulationchart-focused') === -1) {
            className = 'e-accumulationchart-focused ' + className;
        } else if (!className) {
            className = 'e-accumulationchart-focused';
        }
        element.setAttribute('class', className);
        element.focus();
        return element.id;
    }


    /**
     * Handles the mouse double click on accumulation chart.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - Mouse double click of accumulation chart.
     * @private
     */
    public accumulationOnDoubleClick(e: PointerEvent): boolean {
        this.trigger(chartDoubleClick, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        return false;
    }
    /**
     * Handles the mouse click on accumulation chart.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - Mouse click of accumulation chart.
     * @private
     */
    public accumulationOnMouseClick(e: PointerEvent): boolean {
        this.setMouseXY(e);
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.click(e);
        }
        if (this.selectionMode !== 'None' && this.accumulationSelectionModule) {
            this.accumulationSelectionModule.calculateSelectedElements(this, e.target as Element, e.type);
        }
        if (this.visibleSeries[0].explode) {
            this.accBaseModule.processExplode(e);
        }
        if (this.enableBorderOnMouseMove && this.pieSeriesModule && this.type === 'Pie') {
            this.pieSeriesModule.findSeries(e);
        }
        this.trigger(chartMouseClick, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.pointClick) {
            this.triggerPointEvent(pointClick, <Element>e.target, e);
        }
        return false;
    }

    private triggerPointEvent(event: string, element: Element, e?: PointerEvent | TouchEvent): void {
        const evt: PointerEvent = e as PointerEvent;
        const indexes: Index = indexFinder(element.id, true);
        if (indexes.series >= 0 && indexes.point >= 0) {
            this.trigger(event, {
                series: this.isBlazor ? {} : this.series[indexes.series],
                point: (<AccumulationSeries>this.series[indexes.series]).points[indexes.point],
                seriesIndex: indexes.series, pointIndex: indexes.point,
                x: this.mouseX, y: this.mouseY, pageX: evt.pageX, pageY: evt.pageY
            });
        }
    }

    /**
     * Handles the mouse right click on accumulation chart.
     *
     * @param {MouseEvent | PointerEvent} event - The mouse event or pointer event.
     * @returns {boolean} - Right click of accumulation chart.
     * @private
     */
    public accumulationRightClick(event: MouseEvent | PointerEvent): boolean {
        if (event.buttons === 2 && (<PointerEvent>event).pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    }

    /**
     * Handles the mouse leave on accumulation chart.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - Mouse leave of accumulation chart.
     * @private
     */
    public accumulationMouseLeave(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger(chartMouseLeave, { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        let borderElement: Element = document.getElementById(this.element.id + 'PointHover_Border');
        if (borderElement) {
            this.pieSeriesModule.removeBorder(borderElement, 1000);
            borderElement = null;
        }
        return false;
    }

    /**
     * Method to set culture for chart.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * Method to create SVG element for accumulation chart.
     *
     * @returns {void}
     */
    private createPieSvg(): void {
        this.removeSvg();
        createSvg(this);
    }
    /**
     * To Remove the SVG from accumulation chart.
     *
     * @returns {boolean} - Remove svg.
     * @private
     */
    public removeSvg(): void {
        if (this.redraw) {
            return null;
        }
        blazorTemplatesReset(this);
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
        removeElement(this.element.id + 'PointHover_Border');
    }
    /**
     * Method to create the secondary element for tooltip, datalabel and annotaitons.
     *
     * @returns {void}
     */
    private createSecondaryElement(): void {
        const element: Element = redrawElement(this.redraw, this.element.id + '_Secondary_Element') ||
            this.createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: relative'
            });
        appendChildElement(false, this.element, element, this.redraw);
    }

    /**
     * Method to find visible series based on series types.
     *
     * @returns {void}
     */
    private calculateVisibleSeries(): void {
        this.visibleSeries = [];
        for (let i: number = 0, length: number = this.series.length; i < length; i++) {
            (this.series[i as number] as AccumulationSeries).index = i;
            if (this.series[i as number].type === this.type && this.visibleSeries.length === 0) {
                this.visibleSeries.push(this.series[i as number] as AccumulationSeries);
                break;
            }
        }
    }
    /**
     * To find points from dataSource.
     *
     * @param {boolean} render - Indicates whether to render the points (default: true).
     * @returns {void}
     */
    private processData(render: boolean = true): void {
        this.seriesCounts = 0;
        for (const series of this.visibleSeries) {
            series.dataModule = new Data(series.dataSource || this.dataSource, series.query);
            series.refreshDataManager(this, render);
        }
    }
    /**
     * To refresh the accumulation chart.
     *
     * @private
     * @returns {void}
     */
    public refreshChart(): void {
        this.doGrouppingProcess();
        this.createPieSvg();
        this.calculateBounds();
        this.renderElements();
        removeElement('chartmeasuretext');
    }
    /**
     * Method to find groupped points.
     *
     * @returns {void}
     */
    private doGrouppingProcess(): void {
        const series: AccumulationSeries = this.visibleSeries[0];
        if (!isNullOrUndefined(series.resultData) && ((!isNullOrUndefined(series.lastGroupTo) &&
            series.lastGroupTo !== series.groupTo))) {
            series.getPoints(series.resultData, this);
        }
    }
    /**
     * Method to calculate bounds for accumulation chart.
     *
     * @returns {void}
     */
    public calculateBounds(): void {
        this.initialClipRect = new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height);
        this.titleCollection = [];
        this.subTitleCollection = [];
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        if (this.title) {
            this.titleCollection = getTitle(this.title, this.titleStyle, this.initialClipRect.width,
                                            this.enableRtl, this.themeStyle.chartTitleFont);
        }
        titleHeight = this.title ? measureText(this.title, this.titleStyle,
                                               this.themeStyle.chartTitleFont).height * this.titleCollection.length : titleHeight;
        if (this.subTitle) {
            for (const titleText of this.titleCollection) {
                titleWidth = measureText(titleText, this.titleStyle, this.themeStyle.chartSubTitleFont).width;
                maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
            }
            this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth, this.enableRtl,
                                               this.themeStyle.chartSubTitleFont);
            subTitleHeight = (measureText(this.subTitle, this.subTitleStyle,
                                          this.themeStyle.chartSubTitleFont).height * this.subTitleCollection.length);
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
    /**
     * Method to calculate legend bounds for accumulation chart.
     *
     * @returns {void}
     */
    private calculateLegendBounds(): void {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        this.accumulationLegendModule.getLegendOptions(this, <AccumulationSeries[]>this.visibleSeries);
        this.accumulationLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
    }
    /**
     * To render elements for accumulation chart.
     *
     * @private
     * @returns {void}
     */
    public renderElements(): void {

        this.renderBorder();

        this.createSecondaryElement();

        this.renderSeries();

        this.renderTitle();

        this.renderCenterLabel(true);

        this.renderLegend();

        appendChildElement(false, this.element, this.svgObject, this.redraw);

        this.processSelection();

        this.processExplode();

        this.renderAnnotation();

        this.setSecondaryElementPosition();

        updateBlazorTemplate(this.element.id + '_DataLabel', 'Template', this.series[0].dataLabel);

        this.trigger('loaded', { accumulation: this.isBlazor ? {} : this, chart: this.isBlazor ? {} : this });

        this.animateSeries = false;
    }
    /**
     * To set the left and top position for data label template for center aligned chart.
     *
     * @private
     * @returns {void}
     */
    public setSecondaryElementPosition(): void {
        const tooltipParent: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!tooltipParent) {
            return;
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        tooltipParent.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        tooltipParent.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }

    /**
     * To render the annotaitions for accumulation series.
     *
     * @private
     * @returns {void}
     */
    public renderAnnotation(): void {
        if (this.annotationModule) {
            this.annotationModule.renderAnnotations(
                getElement(this.element.id + '_Secondary_Element')
            );
        }
    }
    /**
     * Method to process the explode in accumulation chart.
     *
     * @private
     * @returns {void}
     */
    public processExplode(): void {
        if (this.redraw) {
            return null;
        }
        if (!this.visibleSeries[0].explode) {
            return null;
        }
        this.accBaseModule.invokeExplode();
    }
    /**
     * Method to render series for accumulation chart.
     *
     * @returns {void}
     */
    private renderSeries(): void {
        if (!this.redraw) {
            this.svgObject.appendChild(this.renderer.createGroup({ id: this.element.id + '_SeriesCollection' }));
        }
        for (const series of this.visibleSeries) {
            if (series.visible && this[(firstToLowerCase(series.type) + 'SeriesModule')]) {
                this[(firstToLowerCase(series.type) + 'SeriesModule')].initProperties(this, series);
                series.renderSeries(this, this.redraw);
            }
        }
    }

    /**
     * Method to render border for accumulation chart.
     *
     * @returns {void}
     */
    private renderBorder(): void {
        const padding: number = this.border.width;
        const rect: RectOption = new RectOption(this.element.id + '_border', this.background || this.themeStyle.background, this.border, 1,
                                                new Rect(padding / 2, padding / 2, this.availableSize.width - padding,
                                                         this.availableSize.height - padding), 0, 0, '', this.border.dashArray);
        const htmlObject: Element = this.renderer.drawRectangle(rect);
        htmlObject.setAttribute('aria-hidden', 'true');
        appendChildElement(
            false, this.svgObject, htmlObject, this.redraw);
        // to draw back ground image for accumulation chart
        const backGroundImage: string = this.backgroundImage;
        if (backGroundImage) {
            const image: ImageOption = new ImageOption(
                this.availableSize.height - padding,
                this.availableSize.width - padding,
                backGroundImage, 0, 0,
                this.element.id + '_background',
                'visible', 'none'
            );
            appendChildElement(false, this.svgObject, this.renderer.drawImage(image) as HTMLElement, this.redraw);
        }
    }
    /**
     * Method to render legend for accumulation chart.
     *
     * @returns {void}
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
     * To process the selection in accumulation chart.
     *
     * @private
     * @returns {void}
     */
    public processSelection(): void {
        let selectedDataIndexes: Indexes[] = [];
        if (this.accumulationSelectionModule && this.selectionMode !== 'None') {
            selectedDataIndexes = <Indexes[]>extend([], this.accumulationSelectionModule.selectedDataIndexes, null, true);
            this.accumulationSelectionModule.invokeSelection(this);
        }
        if (this.accumulationHighlightModule && this.highlightMode !== 'None') {
            this.accumulationHighlightModule.invokeHighlight(this);
        }
        if (selectedDataIndexes.length > 0) {
            this.accumulationSelectionModule.selectedDataIndexes = selectedDataIndexes;
            this.accumulationSelectionModule.redrawSelection(this);
        }
    }
    /**
     * To render title for accumulation chart.
     *
     * @returns {void}
     */
    private renderTitle(): void {
        const margin: MarginModel = this.margin;
        if (!this.title) {
            return null;
        }
        const getAnchor: string = getTextAnchor(this.titleStyle.textAlignment, this.enableRtl);
        const titleSize: Size = measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont);
        const padding: number = 20;
        const titleHeight: number = this.margin.top + (titleSize.height * 3 / 4);
        const legendHeight: number = this.accumulationLegendModule === undefined ? 0 : this.legendSettings.position === 'Top' ?
            this.accumulationLegendModule.legendBounds.height : 0;
        const explode: number = this.explodeDistance === 0 ? 0 : this.explodeDistance;
        const expodeValue: number = legendHeight !== 0 ? 0 : explode / 2;
        const rect: Rect = new Rect(
            margin.left, 0, this.availableSize.width - margin.left - margin.right, 0
        );
        const options: TextOption = new TextOption(
            this.element.id + '_title',
            titlePositionX(
                rect, this.titleStyle
            ),
            titleHeight,
            getAnchor, this.titleCollection, '', 'auto'
        );
        const space: number = (this.series[0].type === 'Pie' && this.visibleSeries[0].dataLabel.position === 'Outside' && this.visibleSeries[0].dataLabel.connectorStyle.length) ? stringToNumber(this.visibleSeries[0].dataLabel.connectorStyle.length , this.accBaseModule.radius) : 0;
        if (!this.subTitle && (this.series[0].type !== 'Funnel' && this.series[0].type !== 'Pyramid')) {
            options.y = parseInt(this.series[0].radius, 10) >= 80 ? options.y :
                (this.accBaseModule.center.y - this.accBaseModule.radius - padding
                    - titleHeight - legendHeight - expodeValue - space);
            if (this.series[0].type === 'Pie' && (parseInt(this.series[0].radius, 10) < 80 || isNaN(parseInt(this.series[0].radius, 10)))) {
                options.y = options.y < (this.initialClipRect.y - legendHeight) ? (this.initialClipRect.y - legendHeight) : options.y;
            }
        }
        const element: Element = textElement(
            this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitleFont.color,
            this.svgObject, false, this.redraw, null, null, null, null, null, null, null, null, this.themeStyle.chartTitleFont
        );
        if (element) {
            element.setAttribute('tabindex', '0');
            element.parentNode.insertBefore(element, this.svgObject.children && this.svgObject.children[1]);
        }
        if (this.subTitle) {
            this.renderSubTitle(options);
        }
    }

    /**
     * To update center label on mouse move.
     *
     * @param {Event} event - The mouse move event.
     * @returns {void}
     */
    private updateCenterLabel(event: Event): void {
        const data: AccPointData = this.getPieData(event as PointerEvent);
        this.format = (data.point == null) ? '' : this.parseFormat(data.point, this.visibleSeries[0], this.centerLabel.hoverTextFormat);
        this.renderCenterLabel();
    }

    /**
     * Function to get pie data on mouse move.
     *
     * @param {PointerEvent | TouchEvent} e - The event object containing mouse or touch coordinates.
     * @returns {AccPointData} - The data of the pie.
     */
    private getPieData(e: PointerEvent | TouchEvent): AccPointData {
        const dataIndex: Index = indexFinder((e.target as Element).id, true);
        if (!isNaN(dataIndex.series)) {
            return new AccPointData(this.visibleSeries[0].points[dataIndex.point as number], this.visibleSeries[0]);
        }
        return new AccPointData(null, null);
    }

    /**
     * Function to get format of pie data on mouse move.
     *
     * @param {AccPoints} point - The point data.
     * @param {AccumulationSeries} series - The series to which the point belongs.
     * @param {string} format - The format string for the data.
     * @returns {string} - The formatted data.
     */
    private parseFormat(point: AccPoints, series: AccumulationSeries, format: string): string {
        let value: RegExp;
        let textValue: string;
        const regExp: RegExpConstructor = RegExp;
        for (const dataValue of Object.keys(point)) {
            value = new regExp('${point' + '.' + dataValue + '}', 'gm');
            format = format.replace(value.source, point[dataValue as string]);
        }
        for (const dataValue of Object.keys(Object.getPrototypeOf(series))) {
            value = new regExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue as string];
            format = format.replace(value.source, textValue);
        }
        return format;
    }

    /**
     * To render center label for accumulation chart.
     *
     * @param {boolean} isanimate - Specifies whether to animate the rendering.
     * @returns {void}
     */
    private renderCenterLabel(isanimate?: boolean): void {
        if (!this.centerLabel.text) {
            return null;
        }
        const series: AccumulationSeries = <AccumulationSeries>this.series[0];
        let ypos: number;
        const getAnchor: string = getTextAnchor(this.centerLabel.textStyle.textAlignment, this.enableRtl);
        const padding: number = 10;
        // To get side of square inside the circle , which is considered as maxwidth , d*sqrt(0.5)
        const maxwidth: number = this.pieSeriesModule.innerRadius ? ((2 * this.pieSeriesModule.innerRadius) * (0.7071067)) :
            ((2 * this.pieSeriesModule.radius) * (0.7071067));
        const labelCollection: string[] = (this.format || this.centerLabel.text).split('<br>');
        const centerLabelSize: Size = measureText(labelCollection[0], this.centerLabel.textStyle, this.themeStyle.chartTitleFont);
        const collectionLength: number = labelCollection.length;
        for (let i: number = 0; i < collectionLength; i++) {
            const labelSize: Size = measureText(labelCollection[i as number], this.centerLabel.textStyle, this.themeStyle.chartTitleFont);
            if (labelSize.width > maxwidth) {
                labelCollection.splice(i, 1, ...(textWrap(labelCollection[i as number], maxwidth, this.centerLabel.textStyle,
                                                          this.enableRtl, null, null, this.themeStyle.chartTitleFont)));
            }
        }
        if (centerLabelSize.height * (labelCollection.length) > maxwidth) {
            ypos = this.accBaseModule.center.y + ((centerLabelSize.height + padding) / 2) - (maxwidth / 2);
        }
        else if ((series.startAngle && series.endAngle) && (Math.abs(series.endAngle - series.startAngle) === 180)) {
            ypos = this.accBaseModule.center.y - (centerLabelSize.height * labelCollection.length / 2) +
            ((centerLabelSize.height + padding) / 2) - this.pieSeriesModule.innerRadius / 2 +
            (this.pieSeriesModule.innerRadius ? padding : 0);
            if ((centerLabelSize.height * (labelCollection.length) + this.pieSeriesModule.innerRadius / 2 + padding > maxwidth)) {
                ypos = this.accBaseModule.center.y + ((centerLabelSize.height + padding) / 2) - (maxwidth / 2);
            }
        }
        else {
            ypos = labelCollection.length > 1 ? (this.accBaseModule.center.y - (centerLabelSize.height * labelCollection.length / 2) +
            ((centerLabelSize.height + padding) / 2)) : (this.accBaseModule.center.y + (centerLabelSize.height) / 4);
        }
        const options: TextOption = new TextOption(
            this.element.id + '_centerLabel',
            (((this.series[0].animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && isanimate) ? this.pieSeriesModule.center.x - 1 : this.pieSeriesModule.center.x,
            ypos,
            getAnchor, '', '', 'auto'
        );
        const element: Element = textElement(
            this.renderer, options, this.centerLabel.textStyle, this.centerLabel.textStyle.color ||
             this.themeStyle.chartTitleFont.color, this.svgObject, false, this.redraw,
            null, null, null, null, null, null, null, null, this.themeStyle.chartTitleFont
        );
        for (let i: number = 0; i < labelCollection.length; i++) {
            const tspanOption: Object = { x: options.x, y: options.y + (i * centerLabelSize.height), fill: '' };
            const tspanElement: HTMLElement = <HTMLElement>(this.renderer as SvgRenderer).createTSpan(tspanOption, '');
            tspanElement.style.fontFamily = 'inherit';
            tspanElement.style.fontStyle = 'inherit';
            tspanElement.style.fontSize = 'inherit';
            tspanElement.style.fontWeight = (labelCollection[i as number].indexOf('<b>') > -1 || labelCollection[i as number].indexOf('</b>') > -1) ? 'bold' : 'inherit';
            tspanElement.textContent = labelCollection[i as number].replace(/<\/?b>/g, '');
            element.appendChild(tspanElement);
        }
        if (isanimate && ((this.series[0].animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && this.animateSeries) {
            this.centerLabelDelay(element);
        }
    }

    /**
     * Function to delay Center label at initial stage of accumulation chart.
     *
     * @param {Element} element - The element to delay.
     * @returns {void}
     */
    private centerLabelDelay(element: Element): void {
        (element as HTMLElement).style.visibility = 'hidden';
        const animation: Animation = new Animation({});
        animation.animate(<HTMLElement>element, {
            delay: this.duration ? this.duration : this.series[0].animation.duration,
            progress: (args: AnimationOptions): void => {
                args.element.style.visibility = 'visible';
            }
        });
    }

    private renderSubTitle(options: TextOption): void {
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        const padding: number = 10;
        const alignment: Alignment = this.titleStyle.textAlignment;
        const subTitleElementSize: Size = measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont);
        for (const titleText of this.titleCollection) {
            titleWidth = measureText(titleText, this.titleStyle, this.themeStyle.chartSubTitleFont).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        const rect: Rect = new Rect(
            alignment === 'Center' ? (options.x - maxWidth / 2) : alignment === 'Far' ? options.x - maxWidth : options.x,
            0, maxWidth, 0
        );
        const subTitleOption: TextOption = new TextOption(
            this.element.id + '_subTitle',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding,
            getTextAnchor(this.subTitleStyle.textAlignment, this.enableRtl), this.subTitleCollection, '', 'auto'
        );
        textElement(this.renderer, subTitleOption, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartSubTitleFont.color,
                    this.svgObject, false, this.redraw, null, null, null, null, null, null, null, null, this.themeStyle.chartSubTitleFont);
    }
    /**
     * To get the series parent element.
     *
     * @private
     * @returns {Element} - The parent element of the series.
     */
    public getSeriesElement(): Element {
        return this.svgObject.getElementsByTagName('g')[0];
    }
    /**
     * To refresh the all visible series points.
     *
     * @private
     * @returns {void}
     */
    public refreshSeries(): void {
        for (const series of this.visibleSeries) {
            this.refreshPoints(series.points);
        }
    }
    /**
     * To refresh points label region and visible.
     *
     * @private
     * @param {AccPoints[]} points - The array of points to refresh.
     * @returns {void}
     */
    public refreshPoints(points: AccPoints[]): void {
        for (const point of points) {
            point.labelPosition = null;
            point.labelRegion = null;
            point.labelVisible = true;
        }
    }
    /**
     * To get Module name.
     *
     * @private
     * @returns {string} - Returns the module name.
     */
    public getModuleName(): string {
        return 'accumulationchart';
    }
    /**
     * To destroy the accumulation charts.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
            super.destroy();
            this.element.classList.remove('e-accumulationchart');
            this.element.classList.remove('e-accumulationchart-focused');
            const element: HTMLElement = document.getElementById(this.element.id + 'Keyboard_accumulationchart_focus');
            if (element) { element.remove(); }
            removeElement('chartmeasuretext');
            this.removeSvg();
            this.svgObject = null;
        }
    }
    /**
     * To provide the array of modules needed for control rendering.
     *
     * @returns {ModuleDeclaration[]} - required modules.
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
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
        if (this.highlightMode !== 'None') {
            modules.push({
                member: 'AccumulationHighlight',
                args: [this]
            });
        }
        if (this.enableExport || this.allowExport) {
            modules.push({
                member: 'Export',
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
     * To find datalabel visibility in series.
     *
     * @returns {boolean} - false
     */
    private findDatalabelVisibility(): boolean {
        for (const series of this.series) {
            if (series.dataLabel.visible) {
                return true;
            }
        }
        return false;
    }
    /**
     * Get visible series for accumulation chart by index.
     *
     * @param {AccumulationSeries[]} visibleSeries - The array of visible series in the accumulation chart.
     * @param {number} index - The index of the series to retrieve.
     * @returns {AccumulationSeries} - The visible series at the specified index.
     */
    private changeVisibleSeries(visibleSeries: AccumulationSeries[], index: number): AccumulationSeries {
        for (const series of visibleSeries) {
            if (index === series.index) {
                return series;
            }
        }
        return null;
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
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {AccumulationChartModel} newProp - The new AccumulationChartModel.
     * @param {AccumulationChartModel} oldProp - The old AccumulationChartModel.
     * @returns {void}
     */
    public onPropertyChanged(newProp: AccumulationChartModel, oldProp: AccumulationChartModel): void {
        const update: { refreshElements: boolean, refreshBounds: boolean } = {
            refreshElements: false, refreshBounds: false
        };
        for (const prop of Object.keys(newProp)) {
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
                if (!this.animateselected) {
                    const len: number = this.series.length;
                    let seriesRefresh: boolean = false;
                    let series: AccumulationSeriesModel;
                    let blazorProp: boolean;
                    for (let i: number = 0; i < len; i++) {
                        series = newProp.series[i as number];
                        if (this.isBlazor && (series.startAngle || series.endAngle || series.explodeOffset || series.neckHeight ||
                            series.neckWidth || series.radius || series.innerRadius || series.groupMode || series.emptyPointSettings)) {
                            blazorProp = true;
                        }
                        if (newProp.series[i as number] && (newProp.series[i as number].dataSource || newProp.series[i as number].yName
                            || newProp.series[i as number].xName || series.type ||
                            newProp.series[i as number].dataLabel || blazorProp)) {
                            extend(this.changeVisibleSeries(this.visibleSeries, i), series, null, true);
                            seriesRefresh = true;
                        }
                        if (newProp.series[i as number] && !isNullOrUndefined(newProp.series[i as number].explodeIndex) &&
                            newProp.series[i as number].explodeIndex >= 0
                            && newProp.series[i as number].explodeIndex !== oldProp.series[i as number].explodeIndex) {
                            this.accBaseModule.explodePoints(newProp.series[i as number].explodeIndex, this);
                            this.accBaseModule.deExplodeAll(newProp.series[i as number].explodeIndex, this.enableAnimation ? 300 : 0);
                        } else if (newProp.series[i as number].explodeIndex < 0) {
                            this.accBaseModule.deExplodeAll(newProp.series[i as number].explodeIndex, this.enableAnimation ? 300 : 0);
                        }
                        if (!this.pieSeriesModule) {
                            this.pieSeriesModule = new PieSeries(this);
                        }
                    }
                    if (seriesRefresh) {
                        this.processData(false); update.refreshBounds = true;
                    }
                }
                this.animateselected = false;
                this.redraw = false;
                break;
            case 'enableRtl':
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
                        this.accumulationSelectionModule.selectedDataIndexes = this.selectedDataIndexes  as Indexes[];
                        this.accumulationSelectionModule.redrawSelection(this);
                    }
                }
                break;
            case 'tooltip':
                if (this.accumulationTooltipModule) { // To check the tooltip enable is true.
                    this.accumulationTooltipModule.previousPoints = [];
                    if (this.tooltip.template) {
                        this.accumulationTooltipModule.template = this.tooltip.template;
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
