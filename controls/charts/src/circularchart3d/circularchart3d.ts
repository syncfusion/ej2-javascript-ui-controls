/* eslint-disable quotes */
/**
 * Circular 3D chart file.
 */
import { Animation, AnimationOptions, Browser, Collection, Complex, Component, Event, EmitType, EventHandler, INotifyPropertyChanged, Internationalization, ModuleDeclaration, NotifyPropertyChanges, Property, animationMode, isNullOrUndefined, remove, extend } from '@syncfusion/ej2-base';
import { BorderModel, FontModel, IndexesModel, MarginModel } from '../common/model/base-model';
import { Border, Font, Indexes, Margin } from '../common/model/base';
import { Alignment, ExportType, SelectionPattern } from '../common/utils/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { CircularChart3DHighlightMode, CircularChart3DSelectionMode, CircularChart3DTheme } from './model/enum';
import { CircularChart3DModel } from './circularchart3d-model';
import { CircularChart3DAfterExportEventArgs, CircularChart3DBeforeResizeEventArgs, CircularChart3DExportEventArgs, CircularChart3DLegendClickEventArgs, CircularChart3DLegendRenderEventArgs, CircularChart3DLoadedEventArgs, CircularChart3DMouseEventArgs, CircularChart3DPointEventArgs, CircularChart3DPointRenderEventArgs,  CircularChart3DPrintEventArgs, CircularChart3DResizeEventArgs, CircularChart3DSeriesRenderEventArgs, CircularChart3DTextRenderEventArgs,  CircularChart3DTooltipRenderEventArgs,  CircularChart3DSelectionCompleteEventArgs } from './model/pie-interface';
import { getCircular3DThemeColor } from './model/theme';
import { CircularChart3DPoints, CircularChart3DSeries } from './renderer/series';
import { CircularChart3DSeriesModel } from './renderer/series-model';
import { Data } from '../common/model/data';
import { ChartLocation, ImageOption, RectOption, appendChildElement, calculateSize, createSvg, degreeToLocation, getAnimationFunction, getElement, getTitle, redrawElement, removeElement, showTooltip, subtractRect, textElement, titlePositionX, withInBounds } from '../common/utils/helper';
import { PathOption, Rect, Size, SvgRenderer, TextOption, measureText } from '@syncfusion/ej2-svg-base';
import { CircularChart3DBinaryTreeBuilder, CircularChart3DTransform, CircularChart3DGraphics, CircularChart3DMatrix, CircularChart3DPolygonModule, CircularChart3DSvgRenderer, CircularChart3DVectorModule } from './renderer/3d-renderer';
import { animationComplete, beforeResize, load, pointClick, pointMove, resized } from '../common/model/constants';
import { CircularChartDataLabel3D } from './renderer/dataLabel';
import { PrintUtils } from '../common/utils/print';
import { CircularChartExport3D } from './print-export/export';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { IPDFArgs } from '../common/model/interface';
import { CircularChart3DLegendSettings, CircularChartLegend3D } from './legend/legend';
import { CircularChart3DLegendSettingsModel } from './legend/legend-model';
import { CircularChartSelection3D } from './user-interaction/selection';
import { CircularChartHighlight3D } from './user-interaction/high-light';
import { CircularChart3DPointData, CircularChart3DTooltipSettings, CircularChartTooltip3D } from './user-interaction/tooltip';
import { CircularChart3DTooltipSettingsModel } from './user-interaction/tooltip-model';
import { CircularChart3DPolygon, CircularChart3DThemeStyle, CircularChart3DTitlePosition, CircularChart3DVector } from './model/circular3d-base';

/**
 * Represents the circular 3D chart control.
 * ```html
 * <div id="container"/>
 * <script>
 *   let pie: CircularChart3D = new CircularChart3D({ });
 *   pie.appendTo("#container");
 *
 * </script>
 * ```
 *
 * @public
 */
@NotifyPropertyChanges
export class CircularChart3D extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * The width of the chart as a string, accepting input as both '100px' or '100%'
     * If specified as '100%', the chart renders to the full width of its parent element.
     *
     * @default null
     */
    @Property(null)
    public width: string;

    /**
     * The height of the chart as a string, accepting input as both '100px' or '100%'.
     * If specified as '100%', the chart renders to the full height of its parent element.
     *
     * @default null
     */
    @Property(null)
    public height: string;

    /**
     * Represents the title for the circular 3D chart.
     *
     * @default null
     */
    @Property(null)
    public title: string;

    /**
     * The background image of the chart, specified as a URL link or the location of an image.
     *
     * @default null
     */
    @Property(null)
    public backgroundImage: string;

    /**
     * Specifies the dataSource for the circular 3D chart. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let pie: CircularChart3D = new CircularChart3D({
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
     * Options for customizing the title of the circular 3D chart.
     */
    @Complex<FontModel>({ fontFamily: null, size: '16px', fontStyle: 'Normal', fontWeight: '600', color: null }, Font)
    public titleStyle: FontModel;

    /**
     * Represents the subtitle for the circular 3D chart.
     *
     * @default null
     */
    @Property(null)
    public subTitle: string;

    /**
     * Options for customizing the subtitle of the circular 3D Chart.
     */
    @Complex<FontModel>({ fontFamily: null, size: '14px', fontStyle: 'Normal', fontWeight: '400', color: null }, Font)
    public subTitleStyle: FontModel;

    /**
     * Specifies whether a point has to be selected or not.
     * Takes values: 'None' or 'Point'.
     * * None: Disables the selection.
     * * Point: Selects a point.
     *
     * @default None
     */
    @Property('None')
    public selectionMode: CircularChart3DSelectionMode;

    /**
     * Specifies whether a point has to be highlighted or not.
     * Takes values: 'None' or 'Point'.
     * * None: Disables the highlight.
     * * Point: Highlights a point.
     *
     * @default None
     */
    @Property('None')
    public highlightMode: CircularChart3DHighlightMode;

    /**
     * The configuration for series in circular 3D chart.
     * The `series` property allows you to define an array of circular 3D series, each with its own settings and data.
     */
    @Collection<CircularChart3DSeriesModel>([{}], CircularChart3DSeries)
    public series: CircularChart3DSeriesModel[];

    /**
     * Options for customizing the legend of the circular 3D chart.
     */
    @Complex<CircularChart3DLegendSettingsModel>({}, CircularChart3DLegendSettings)
    public legendSettings: CircularChart3DLegendSettingsModel;

    /**
     * Defines the color for the highlighted data point.
     *
     * @default ''
     */
    @Property('')
    public highlightColor: string;

    /**
     * Specifies the selection pattern for series or data points in the circular 3D chart. Options include:
     * * none: No specific selection pattern.
     * * chessboard: Chessboard pattern.
     * * dots: Dots pattern.
     * * diagonalForward: Diagonal forward pattern.
     * * crosshatch: Crosshatch pattern.
     * * pacman: Pacman pattern.
     * * diagonalbackward: Diagonal backward pattern.
     * * grid: Grid pattern.
     * * turquoise: Turquoise pattern.
     * * star: Star pattern.
     * * triangle: Triangle pattern.
     * * circle: Circle pattern.
     * * tile: Tile pattern.
     * * horizontaldash: Horizontal dash pattern.
     * * verticaldash: Vertical dash pattern.
     * * rectangle: Rectangle pattern.
     * * box: Box pattern.
     * * verticalstripe: Vertical stripe pattern.
     * * horizontalstripe: Horizontal stripe pattern.
     * * bubble: Bubble pattern.
     *
     * @default None
     */
    @Property('None')
    public selectionPattern: SelectionPattern;

    /**
     * Specifies the highlight pattern for series or data points in the circular 3D chart. Options include:
     * * none: No specific selection pattern.
     * * chessboard: Chessboard pattern.
     * * dots: Dots pattern.
     * * diagonalForward: Diagonal forward pattern.
     * * crosshatch: Crosshatch pattern.
     * * pacman: Pacman pattern.
     * * diagonalbackward: Diagonal backward pattern.
     * * grid: Grid pattern.
     * * turquoise: Turquoise pattern.
     * * star: Star pattern.
     * * triangle: Triangle pattern.
     * * circle: Circle pattern.
     * * tile: Tile pattern.
     * * horizontaldash: Horizontal dash pattern.
     * * verticaldash: Vertical dash pattern.
     * * rectangle: Rectangle pattern.
     * * box: Box pattern.
     * * verticalstripe: Vertical stripe pattern.
     * * horizontalstripe: Horizontal stripe pattern.
     * * bubble: Bubble pattern.
     *
     * @default None
     */
    @Property('None')
    public highlightPattern: SelectionPattern;

    /**
     * Enables or disables multi-selection in the circular 3D chart.
     * If set true, enables the multi selection in circular 3D chart. It requires `selectionMode` to be `Point`.
     *
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * If set true, enables the animation for circular 3D chart.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Specifies the theme for the circular 3D chart.
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: CircularChart3DTheme;

    /**
     * Specifies the point indexes to be selected while loading a circular 3D chart.
     * It requires `selectionMode` to be `Point`.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let pie: CircularChart3D = new CircularChart3D({
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
     * Options to customize the left, right, top, and bottom margins of the circular 3D chart.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing the color and width of the circular 3D chart border.
     */
    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the tooltip of the circular 3D chart.
     */
    @Complex<CircularChart3DTooltipSettingsModel>({}, CircularChart3DTooltipSettings)
    public tooltip: CircularChart3DTooltipSettingsModel;

    /**
     * The background color of the circular 3D chart, which accepts a value in hex, rgba as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Specifies whether a grouping separator should be used for numbers.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * Specifies the depth of the circular 3D chart.
     *
     * @default 50
     */
    @Property(50)
    public depth: number;

    /**
     * Defines the slope angle for the circular 3D chart.
     *
     * @default 0
     */
    @Property(0)
    public tilt: number;

    /**
     * Enables or disables rotation in the circular 3D chart.
     *
     * @default false
     */
    @Property(false)
    public enableRotation: boolean;

    /**
     * Defines the rotation angle for the circular 3D chart.
     *
     * @default 0
     */
    @Property(0)
    public rotation: number;

    /**
     * Enables or disables the export feature in the circular 3D chart.
     *
     * @default false
     */
    @Property(false)
    public enableExport: boolean;

    /**
     * Triggered before the circular 3D is loaded.
     *
     * @event load
     */
    @Event()
    public load: EmitType<CircularChart3DLoadedEventArgs>;

    /**
     * Triggers after the circular 3D chart is loaded.
     *
     * @event loaded
     */
    @Event()
    public loaded: EmitType<CircularChart3DLoadedEventArgs>;

    /**
     * Triggers before the legend is rendered.
     *
     * @event legendRender
     */
    @Event()
    public legendRender: EmitType<CircularChart3DLegendRenderEventArgs>;

    /**
     * Triggers after a legend is clicked.
     *
     * @event legendClick
     */
    @Event()
    public legendClick: EmitType<CircularChart3DLegendClickEventArgs>;

    /**
     * Triggers after the selection is completed.
     *
     * @event selectionComplete
     */
    @Event()
    public selectionComplete: EmitType<CircularChart3DSelectionCompleteEventArgs>;

    /**
     * Triggers before each point for a series is rendered.
     *
     * @event pointRender
     */
    @Event()
    public pointRender: EmitType<CircularChart3DPointRenderEventArgs>;

    /**
     * Triggers before a series is rendered.
     *
     * @event seriesRender
     */
    @Event()
    public seriesRender: EmitType<CircularChart3DSeriesRenderEventArgs>;

    /**
     * Triggers before the data label for a series is rendered.
     *
     * @event textRender
     */
    @Event()
    public textRender: EmitType<CircularChart3DTextRenderEventArgs>;

    /**
     * Triggers before the export starts.
     *
     * @event beforeExport
     */
    @Event()
    public beforeExport: EmitType<CircularChart3DExportEventArgs>;

    /**
     * Triggers after the export is completed.
     *
     * @event afterExport
     */
    @Event()
    public afterExport: EmitType<CircularChart3DAfterExportEventArgs>;

    /**
     * Triggers before printing starts.
     *
     * @event beforePrint
     */
    @Event()
    public beforePrint: EmitType<CircularChart3DPrintEventArgs>;

    /**
     * The `circularChartDataLabel3DModule` is used to manipulate and add data labels in the circular 3D chart.
     */
    public circularChartDataLabel3DModule: CircularChartDataLabel3D;

    /**
     * The `circularChartSelection3DModule` is used to manipulate and add selection in the circular 3D chart.
     */
    public circularChartSelection3DModule: CircularChartSelection3D;

    /**
     * The `circularHighlight3DModule` is used to manipulate and add highlights to the circular 3D chart.
     */
    public circularChartHighlight3DModule: CircularChartHighlight3D;

    /**
     * Triggered before resizing the chart.
     *
     * @event beforeResize
     */
    @Event()
    public beforeResize: EmitType<CircularChart3DBeforeResizeEventArgs>;

    /**
     * Triggered after the chart is resized.
     *
     * @event resized
     */
    @Event()
    public resized: EmitType<CircularChart3DResizeEventArgs>;

    /**
     * Triggered when the user hovers over a circular 3D chart.
     *
     * @event circularChart3DMouseMove
     *
     */
    @Event()
    public circularChart3DMouseMove: EmitType<CircularChart3DMouseEventArgs>;

    /**
     * Triggered when the user clicks on a circular 3D chart.
     *
     * @event circularChart3DMouseClick
     *
     */
    @Event()
    public circularChart3DMouseClick: EmitType<CircularChart3DMouseEventArgs>;

    /**
     * Triggered when the mouse is pressed down on a circular 3D chart.
     *
     * @event circularChart3DMouseDown
     *
     */
    @Event()
    public circularChart3DMouseDown: EmitType<CircularChart3DMouseEventArgs>;

    /**
     * Triggered when the cursor leaves a circular 3D chart.
     *
     * @event circularChart3DMouseLeave
     *
     */
    @Event()
    public circularChart3DMouseLeave: EmitType<CircularChart3DMouseEventArgs>;

    /**
     * Triggered when the mouse button is released on a circular 3D chart.
     *
     * @event circularChart3DMouseUp
     *
     */
    @Event()
    public circularChart3DMouseUp: EmitType<CircularChart3DMouseEventArgs>;

    /**
     * Triggered when the user clicks on data points.
     *
     * @event pointClick
     */
    @Event()
    public pointClick: EmitType<CircularChart3DPointEventArgs>;

    /**
     * Triggered when the user hovers over data points.
     *
     * @event pointMove
     */
    @Event()
    public pointMove: EmitType<CircularChart3DPointEventArgs>;

    /**
     * Triggered when the tooltip is ready to render on the screen.
     *
     * @event tooltipRender
     */
    @Event()
    public tooltipRender: EmitType<CircularChart3DTooltipRenderEventArgs>;

    /**
     * The `circularChartExport3DModule` Module is used to facilitate the export of the circular 3D chart.
     */
    public circularChartExport3DModule: CircularChartExport3D;

    /**
     * The `circularChartTooltip3DModule` is used to manipulate and add tooltips in the circular 3D chart.
     */
    public circularChartTooltip3DModule: CircularChartTooltip3D;

    /**
     * The `circularChartLegend3DModule` is used to manipulate and add legend in the circular 3D chart.
     */
    public circularChartLegend3DModule: CircularChartLegend3D;

    /** @private */
    public intl: Internationalization;
    /** @private */
    public visibleSeries: CircularChart3DSeries[];
    /** @private */
    public seriesCounts: number;
    /** @private */
    public animateSeries: boolean;
    private chartId: number = 57724;
    /** @private */
    public themeStyle: CircularChart3DThemeStyle;
    /** @private */
    public redraw: boolean;
    /** @private */
    public svgObject: Element;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public availableSize: Size;
    /** @private */
    public explodeDistance: number = 0;
    /** @private */
    public initialClipRect: Rect;
    private titleCollection: string[];
    private subTitleCollection: string[];
    /** @private */
    public circularRadius: number[];
    /** @private */
    public innerRadius: number[];
    /** @private */
    public groupElement: Element;
    /** @private */
    public titleLocation: CircularChart3DTitlePosition ;
    /** @private */
    public subTitleLocation: CircularChart3DTitlePosition ;
    /** @private */
    public circular3DPolygon: CircularChart3DPolygon [];
    /** @private */
    public matrixObj: CircularChart3DMatrix;
    /** @private */
    public bspTreeObj: CircularChart3DBinaryTreeBuilder;
    /** @private */
    public polygon: CircularChart3DPolygonModule;
    /** @private */
    public vector: CircularChart3DVectorModule;
    /** @private */
    public graphics: CircularChart3DGraphics;
    /** @private */
    public transform3D: CircularChart3DTransform;
    /** @private */
    public svg3DRenderer: CircularChart3DSvgRenderer;
    /** @private */
    public chartResizeBound: EventListenerOrEventListenerObject;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    private resizeTo: number;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public rotateActivate: boolean = false;
    /** @private */
    public previousCoords: { x: number; y: number; };
    /** @private */
    public previousID: string;
    /** @private */
    public cachedX: number;
    /** @private */
    public cachedY: number;
    /** @private */
    public previousTargetId: string = '';
    /** @private */
    public currentPointIndex: number = 0;
    /** @private */
    public currentLegendIndex: number = 0;
    /** @private */
    public isLegendClicked: boolean = false;
    /** @private */
    public delayRedraw: boolean = false;
    public get type(): string {
        return 'Pie';
    }

    /**
     * Constructor for creating the circular 3D chart widget.
     *
     * @private
     * @param {CircularChart3DModel} options - Specifies the instance of the circular 3D chart model.
     * @param {string | HTMLElement} element - Specifies the element for which the circular 3D chart will be rendered
     * @returns {void}
     */
    constructor(options?: CircularChart3DModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * To create SVG object, renderer, and bind events for the container.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.titleLocation = { x: 0, y: 0, size: new Size(0, 0) };
        this.subTitleLocation = { x: 0, y: 0, size: new Size(0, 0) };
        this.circularRadius = [];
        this.innerRadius = [];
        this.matrixObj = new CircularChart3DMatrix();
        this.bspTreeObj = new CircularChart3DBinaryTreeBuilder();
        this.polygon = new CircularChart3DPolygonModule();
        this.vector = new CircularChart3DVectorModule(null, null, null);
        this.graphics = new CircularChart3DGraphics();
        this.transform3D = new CircularChart3DTransform();
        this.svg3DRenderer = new CircularChart3DSvgRenderer();
        this.circular3DPolygon = [];
        this.explodeDistance = 0;
        this.setCulture();
        this.animateSeries = true;
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-circular3dchart').length;
            this.element.id = 'acc_chart_' + this.chartId + '_' + collection;
        }
        this.wireEvents();
        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : '');
    }

    /**
     * Method to unbind events for the circular 3D chart.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        /*! Find the Events type */
        const isIE11Pointer: boolean = Browser.isPointer;

        const start: string = Browser.touchStartEvent;
        const move: string = Browser.touchMoveEvent;
        const stop: string = Browser.touchEndEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, move, this.chartOnMouseMove);
        EventHandler.remove(this.element, stop, this.chartMouseUp);
        EventHandler.remove(this.element, start, this.chartMouseDown);
        EventHandler.remove(this.element, 'click', this.chartOnMouseClick);
        EventHandler.remove(this.element, cancel, this.chartMouseLeave);
        EventHandler.remove(this.element, 'keydown', this.circular3DChartKeyDown);
        EventHandler.remove(this.element, 'keyup', this.circular3DChartKeyUp);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.chartResizeBound
        );
    }

    /**
     * Handles the mouse click on the circular 3D chart.
     *
     * @param {PointerEvent} e - Mouse event arguments.
     * @returns {boolean} - Indicates whether the mouse click event was handled by the circular 3D chart.
     * @private
     */
    public chartOnMouseClick(e: PointerEvent): boolean {
        this.setMouseXY(e);
        if (this.circularChartLegend3DModule && this.legendSettings.visible) {
            this.circularChartLegend3DModule.click(e);
        }
        if (this.selectionMode !== 'None' && this.circularChartSelection3DModule) {
            this.circularChartSelection3DModule.calculateSelectedElements(this, e.target as Element, e.type);
        }
        if (this.visibleSeries[0].explode) {
            const id: string = (<Element>e.target).id;
            let indexes: string[];
            let pointIndex: number;
            if (id.indexOf('-point-') > -1) {
                indexes = id.split('-series-')[1].split('-point-');
                pointIndex = parseInt(indexes[1], 10);
                const currentPointIndex: number = this.visibleSeries[0].explodeIndex;
                if (currentPointIndex === pointIndex || this.visibleSeries[0].points[pointIndex as number].isExplode) {
                    this.visibleSeries[0].explodeIndex = null;
                    this.visibleSeries[0].isExploded = true;
                    this.visibleSeries[0].points.forEach((point: CircularChart3DPoints) => {
                        point.isExplode = false;
                    });
                } else {
                    this.visibleSeries[0].explodeIndex = pointIndex;
                }
                this.removeSeriesElements(this);
                this.visibleSeries[0].segments = [];
                this.circular3DPolygon = [];
                this.renderSeries();
                this.processSelection();
                this.delayRedraw = true;
            }
        }
        this.trigger('circularChart3DMouseClick', { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.pointClick) {
            this.triggerPointEvent(pointClick, <Element>e.target, e);
        }
        return false;
    }

    /**
     * Triggers a point event for a circular 3D chart element.
     *
     * @param {string} event - The type of event to trigger.
     * @param {Element} element - The DOM element associated with the event.
     * @param {PointerEvent | TouchEvent | undefined} e - The pointer or touch event.
     * @returns {void}
     */
    private triggerPointEvent(event: string, element: Element, e?: PointerEvent | TouchEvent): void {
        const evt: PointerEvent = e as PointerEvent;
        let point: CircularChart3DPoints;
        const series: CircularChart3DSeries = this.visibleSeries[0];
        if (element.id.indexOf('point') > -1 && element.id.indexOf('series') > -1) {
            const pointIndex: number = parseInt(element.id.split('point-')[1], 10);
            point = series.points[pointIndex as number];
        }
        if (point) {
            this.trigger(event, {
                series: series,
                point: point,
                seriesIndex: series.index, pointIndex: point.index,
                x: this.mouseX, y: this.mouseY, pageX: evt.pageX, pageY: evt.pageY
            });
        }
    }

    /**
     * Handles the mouse move on the circular 3D chart.
     *
     * @param {PointerEvent} e - Mouse event arguments.
     * @returns {boolean} - Indicates whether the mouse move event was handled by the circular 3D chart.
     * @private
     */
    public chartOnMouseMove(e: PointerEvent): boolean {
        if (!getElement(this.element.id + '_svg')) {
            return false;
        }
        this.setMouseXY(e);
        this.trigger('circularChart3DMouseMove', { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.rotateActivate) {
            const deltaX: number = this.previousCoords.x - this.mouseX;
            const deltaY: number = this.previousCoords.y - this.mouseY;
            if (deltaX || deltaY) {
                this.tilt -= deltaY;
                this.rotation += deltaX;
                if (!this.isTouch) {
                    const grpElement: Element = document.getElementById(this.groupElement.id);
                    grpElement.innerHTML = '';
                    grpElement.remove();
                }
                const size: Size = { width: this.availableSize.width, height: this.availableSize.height };
                this.graphics.view(this.svgObject, this, this.rotation, this.tilt, size, 0, this.depth);
                appendChildElement(false, this.svgObject, this.groupElement, this.redraw);
                this.setSeriesTabIndex();
                this.previousCoords.y = this.mouseY;
                this.previousCoords.x = this.mouseX;
                if (this.circularChartHighlight3DModule && this.highlightMode !== 'None') {
                    this.circularChartHighlight3DModule.calculateSelectedElements(this, document.getElementById(this.element.id + '-border'), 'mousemove');
                    this.circularChartHighlight3DModule.previousSelectedElement = [];
                }
                this.processSelection();
            }
        }
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, <Element>e.target, e);
        }
        if (this.tooltip.enable && this.circularChartTooltip3DModule) {
            this.circularChartTooltip3DModule.mouseMoveHandler(e, this);
        }
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
        }
        this.notify(Browser.touchMoveEvent, e);

        return false;
    }

    /**
     * Displays a tooltip for the given event at the specified coordinates.
     *
     * @param {Event} event - The event triggering the tooltip display.
     * @param {number} x - The x-coordinate for the tooltip position.
     * @param {number} y - The y-coordinate for the tooltip position.
     * @param {boolean} isTouch - Optional parameter indicating whether the event is a touch event. Defaults to false if not provided.
     * @returns {void}
     */
    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        const id: boolean = (targetId === (this.element.id + '-title') || targetId === (this.element.id + '-sub-title') ||
            targetId === (this.element.id + '_chart_legend_title'));
        if (((<HTMLElement>event.target).textContent.indexOf('...') > -1) && id) {
            const title: string = (targetId === (this.element.id + '-title')) ?
                this.title : (targetId === (this.element.id + '-sub-title')) ? this.subTitle : this.legendSettings.title;
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
     * Sets the mouse x and y coordinates based on the specified pointer event.
     *
     * @param {PointerEvent} e - Specifies the pointer event.
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
     * Method to bind events for the circular 3D chart.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        if (!this.element) {
            return;
        }
        /*! Find the Events type */

        const isIE11Pointer: boolean = Browser.isPointer;
        const start: string = Browser.touchStartEvent;
        const stop: string = Browser.touchEndEvent;
        const move: string = Browser.touchMoveEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, move, this.chartOnMouseMove, this);
        EventHandler.add(this.element, stop, this.chartMouseUp, this);
        EventHandler.add(this.element, start, this.chartMouseDown, this);
        EventHandler.add(this.element, 'click', this.chartOnMouseClick, this);
        EventHandler.add(this.element, cancel, this.chartMouseLeave, this);
        EventHandler.add(this.element, 'keydown', this.circular3DChartKeyDown, this);
        EventHandler.add(this.element, 'keyup', this.circular3DChartKeyUp, this);
        this.chartResizeBound = this.chartResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.chartResizeBound
        );
        //new Touch(this.element); // To avoid geasture blocking for browser
        /*! Apply the style for chart */
        this.setStyle(<HTMLElement>this.element);
    }

    /**
     * Handles the mouse leave on circular 3D chart.
     *
     * @param {PointerEvent} e - Mouse event arguments.
     * @returns {boolean} - Indicates the mouse leave event for the circular 3D chart.
     * @private
     */
    public chartMouseLeave(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger('circularChart3DMouseLeave', { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.tooltip.enable && this.circularChartTooltip3DModule) {
            this.circularChartTooltip3DModule.mouseLeaveHandler();
        }
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        this.rotateActivate = false;
        return false;
    }

    /**
     * Handles the mouse end event for the circular 3D chart.
     *
     * @param {PointerEvent} e - Mouse event arguments.
     * @returns {boolean} - Indicates the mouse end event for the circular 3D chart.
     * @private
     */
    public chartMouseUp(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger('circularChart3DMouseUp', { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
        }
        this.rotateActivate = false;
        if (this.tooltip.enable && this.circularChartTooltip3DModule) {
            this.circularChartTooltip3DModule.mouseUpHandler(e, this);
        }
        this.notify(Browser.touchEndEvent, e);
        return false;
    }

    /**
     * Handles the mouse start event on the circular 3D chart.
     *
     * @param {PointerEvent} e - Mouse event arguments.
     * @returns {boolean} - Indicates whether the mouse start event was handled by the circular 3D chart.
     * @private
     */
    public chartMouseDown(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.trigger('circularChart3DMouseDown', { target: (<Element>e.target).id, x: this.mouseX, y: this.mouseY });
        this.cachedX = this.mouseX;
        this.cachedY = this.mouseY;
        const svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        const bounds: ClientRect = document.getElementById(this.element.id + '-svg-chart-3d').getBoundingClientRect();
        const rect: Rect = { x: bounds.left - svgRect.left, y: bounds.top - svgRect.top, width: bounds.width, height: bounds.height };
        if (this.enableRotation && withInBounds(this.mouseX, this.mouseY, rect)) {
            this.rotateActivate = true;
            this.previousCoords = { x: this.mouseX, y: this.mouseY };
        }
        return false;
    }

    /**
     * Applies styles for the circular 3D chart element.
     *
     * @param {HTMLElement} element - Specifies the circular 3D chart element.
     * @returns {void}
     */
    private setStyle(element: HTMLElement): void {
        element.style.touchAction = this.enableRotation ? 'none' : 'element';
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
        default:
            tabColor = '#9e9e9e';
            break;
        }
        const style: HTMLStyleElement = document.createElement('style');
        style.setAttribute('id', element.id + 'Keyboard_circular3dchart_focus');
        style.innerText = '.e-circular3dchart-focused:focus,path[id*=-series-0-point-]:focus, text[id*=-title]:focus' +
            '{outline: none} .e-circular3dchart-focused:focus-visible,path[id*=-series-0-point-]:focus-visible, text[id*=-title]:focus-visible' +
            '{outline: 1.5px ' + tabColor + ' solid}';
        document.body.appendChild(style);
    }

    /**
     * Method to set the culture for the circular 3D chart.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * Renders the circular 3D chart elements.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        if (this.element.className.indexOf('e-circular3dchart') === -1) {
            this.element.classList.add('e-circular3dchart');
        }
        this.element.setAttribute('role', 'region');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('aria-label', this.title + '. Syncfusion interactive chart.');
        this.element.setAttribute('class', this.element.getAttribute('class') + ' e-circular3dchart-focused');
        const loadEventData: CircularChart3DLoadedEventArgs = {
            chart: this,
            theme: this.theme, name: load, cancel: false
        };
        this.trigger(load, loadEventData, () => {
            if (!loadEventData.cancel) {
                this.setTheme();
                this.calculateVisibleSeries();
                this.processData();
                this.renderComplete();
                this.allowServerDataBinding = true;
            }
        });

    }

    /**
     * Sets the theme for the circular 3D chart.
     *
     * @returns {void}
     */
    private setTheme(): void {
        /*! Set theme for circular 3D chart */
        this.themeStyle = getCircular3DThemeColor(this.theme);
    }

    /**
     * Processes data from the data source to find points for rendering.
     *
     * @param {boolean} render - A boolean value indicating whether to trigger rendering after processing the data. Default is true.
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
     * Refreshes the circular 3D chart.
     *
     * @private
     * @returns {void}
     */
    public refreshChart(): void {
        this.createPieSvg();
        this.calculateBounds();
        this.circular3DPolygon = [];
        this.visibleSeries[0].segments = [];
        this.groupElement = this.renderer.createGroup({ 'id': this.element.id + '-svg-chart-3d' });
        this.groupElement.setAttribute('role', 'region');
        this.groupElement.setAttribute('aria-hidden', 'false');
        this.renderElements();
        removeElement('chartmeasuretext');
    }

    /**
     * Renders elements for the circular 3D chart.
     *
     * @private
     * @returns {void}
     */
    public renderElements(): void {

        this.renderBorder();

        this.createSecondaryElement();

        this.renderTitle();

        this.renderSeries();

        this.renderLegend();

        appendChildElement(false, this.element, this.svgObject, this.redraw);

        this.processSelection();

        this.setSecondaryElementPosition();

        this.trigger('loaded', { chart: this });

        this.setSeriesTabIndex();

        this.doAnimation();

        this.animateSeries = false;
    }

    /**
     * Sets the tabindex attribute to '0' for the last element matching the selector pattern "[id*='region-series-0-point-0']".
     *
     * @returns {void}
     */
    private setSeriesTabIndex(): void {
        let elements: NodeListOf<Element>
        for (let i: number = 0; i < this.visibleSeries[0].points.length; i++) {
            if(this.visibleSeries[0].points[i as number].visible){
                elements = document.querySelectorAll("[id*=\"region-series-0-point-"+ this.visibleSeries[0].points[i as number].index + "\"]");
                break;
            }
        }
        if (elements && elements.length > 0) {
            const element: Element = elements[elements.length - 1];
            element.setAttribute('tabindex', '0');
        }
    }

    /**
     * Processes the selection in the circular 3D chart.
     *
     * @returns {void}
     */
    private processSelection(): void {
        let selectedDataIndexes: Indexes[] = [];
        if (this.circularChartSelection3DModule && this.selectionMode !== 'None') {
            selectedDataIndexes = <Indexes[]>extend([], this.circularChartSelection3DModule.selectedDataIndexes, null, true);
            this.circularChartSelection3DModule.invokeSelection(this);
        }
        if (this.circularChartHighlight3DModule) {
            this.circularChartHighlight3DModule.invokeHighlight(this);
        }
        if (selectedDataIndexes.length > 0) {
            this.circularChartSelection3DModule.selectedDataIndexes = selectedDataIndexes;
            this.circularChartSelection3DModule.redrawSelection(this);
        }
    }

    /**
     * Performs a highlight animation on the specified HTML element with the given duration and starting opacity.
     *
     * @param {HTMLElement} element - The HTML element to animate.
     * @param {number} duration - The duration of the animation in milliseconds.
     * @param {number} startOpacity - The starting opacity value for the animation.
     * @returns {void}
     * @private
     */
    public highlightAnimation(element: HTMLElement, duration: number, startOpacity: number): void {
        const endOpacity: number = parseFloat(this.visibleSeries[0].opacity.toString());
        if (endOpacity) {
            new Animation({}).animate(element, {
                duration: duration,
                progress: (args: AnimationOptions): void => {
                    element.style.animation = '';
                    const progress: number = args.timeStamp / args.duration;
                    const currentOpacity: number = startOpacity + (endOpacity - startOpacity) * progress;
                    element.setAttribute('opacity', currentOpacity.toString());
                },
                end: (): void => {
                    element.setAttribute('opacity', endOpacity.toString());
                }
            });
        }
    }

    /**
     * Stops the animation for the specified HTML element in the circular 3D chart.
     *
     * @param {HTMLElement} element - The HTML element for which the animation should be stopped.
     * @returns {void}
     * @private
     */
    public stopElementAnimation(element: HTMLElement): void {
        const endOpacity: number = parseFloat(this.visibleSeries[0].opacity.toString());
        const animation: string = element.getAttribute('e-animate');
        if (animation) {
            Animation.stop(element);
        }
        element.setAttribute('opacity', endOpacity.toString());
    }

    /**
     * Initiates and executes the animation for the circular 3D chart.
     * This method assumes the existence of visible series and focuses on the first series for animation.
     *
     * @returns {void}
     */
    private doAnimation(): void {
        const series: CircularChart3DSeries = this.visibleSeries[0];
        if (series.animation.enable && this.animateSeries) {
            const clippath: Element = this.renderer.createClipPath({ id: this.element.id + 'SeriesGroup0' + '_clipPath' });
            const path: PathOption = new PathOption(this.element.id + 'SeriesGroup0' + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            const clipslice: Element = this.renderer.drawPath(path);
            clippath.appendChild(clipslice);
            this.svgObject.appendChild(clippath);
            const id: string = this.element.id;
            const groupElementID: string = this.groupElement.id;
            document.querySelectorAll("[id*=\"region-series-" + "\"]").forEach(function (slice: Element): void {
                if (slice.parentElement.id === groupElementID) {
                    (slice as HTMLElement).style.cssText = 'clip-path:url(#' + clippath.id + '); -webkit-clip-path:url(#' + clippath.id + ');';
                    slice.setAttribute('clip-path', 'url(#' + id + 'SeriesGroup0' + '_clipPath' + ')');
                }

            });
            if (series.segments[0]) {
                this.animationRect(clipslice, series);
            }
        }
    }

    /**
     * Renders the legend for the circular 3D chart.
     *
     * @returns {void}
     */
    private renderLegend(): void {
        if (!this.circularChartLegend3DModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.circularChartLegend3DModule.legendCollections.length && this.visibleSeries[0].labelBound) {
            this.circularChartLegend3DModule.getSmartLegendLocation(
                this.visibleSeries[0].labelBound, this.circularChartLegend3DModule.legendBounds, this.margin);
        }
        this.circularChartLegend3DModule.renderLegend(
            this, this.legendSettings, this.circularChartLegend3DModule.legendBounds, this.redraw);
    }

    /**
     * Initiates animation for the circular 3D series.
     *
     * @param {Element} slice - Specifies the slice element to animate.
     * @param {CircularChart3DSeries} series - Specifies the circular 3D chart series.
     * @returns {void}
     */
    private animationRect(slice: Element, series: CircularChart3DSeries): void {
        const startAngle: number = - 90;
        const duration: number = series.animation.duration;  //this.duration ? this.duration : series.animation.duration;
        let value: number;
        let radius: number = Math.max(this.availableSize.height, this.availableSize.width) * 0.75;
        radius += radius * (0.414); // formula r + r / 2 * (1.414 -1)
        const effect: Function = getAnimationFunction('Linear'); // need to check animation type
        const center: ChartLocation = {
            x: series.segments[0].center.x - this.rotation / 2,
            y: series.segments[0].center.y + this.tilt / 2
        };
        for (let i: number = 0; i < series.points.length; i++) {
            const dataLabelElement: HTMLElement = getElement(this.element.id + '-svg-data-label-text-' + i) as HTMLElement;
            if (dataLabelElement) { dataLabelElement.style.visibility = 'hidden'; }
            const shapeElement: HTMLElement = getElement(this.element.id + '-svg-data-label-series-0-shape-' + i) as HTMLElement;
            if (shapeElement) { shapeElement.style.visibility = 'hidden'; }
            const templateElement: HTMLElement = getElement(this.element.id + '-series-' + series.index + '-data-label-' + i) as HTMLElement;
            if (templateElement) { templateElement.style.visibility = 'hidden'; }
            const connectorElement: HTMLElement = getElement(this.element.id + '-datalabel-series-0-connector-' + i) as HTMLElement;
            if (connectorElement) { connectorElement.style.visibility = 'hidden'; }
        }
        if (!isNullOrUndefined(slice)) {
            new Animation({}).animate(<HTMLElement>slice, {
                duration: (duration === 0 && animationMode === 'Enable') ? 1000 : duration,
                delay: series.animation.delay,
                progress: (args: AnimationOptions): void => {
                    value = effect(args.timeStamp, startAngle, 359.99999, args.duration);
                    slice.setAttribute('d', this.getPathArc(center, startAngle, value, radius ));
                },
                end: () => {
                    slice.setAttribute('d', this.getPathArc(center, 0, 359.99999, radius ));
                    this.trigger(animationComplete, { series: series, chart: this });
                    for (let i: number = 0; i < series.points.length; i++) {
                        const dataLabelElement: HTMLElement = getElement(this.element.id + '-svg-data-label-text-' + i) as HTMLElement;
                        if (dataLabelElement) { dataLabelElement.style.visibility = 'visible'; }
                        const shapeElement: HTMLElement = getElement(this.element.id + '-svg-data-label-series-0-shape-' + i) as HTMLElement;
                        if (shapeElement) { shapeElement.style.visibility = 'visible'; }
                        const templateElement: HTMLElement = getElement(this.element.id + '-series-' + series.index + '-data-label-' + i) as HTMLElement;
                        if (templateElement) { templateElement.style.visibility = 'visible'; }
                        const connectorElement: HTMLElement = getElement(this.element.id + '-datalabel-series-0-connector-' + i) as HTMLElement;
                        if (connectorElement) { connectorElement.style.visibility = 'visible'; }
                    }
                }
            });
        }
    }

    /**
     * Gets the path arc direction for the circular 3D chart.
     *
     * @param {ChartLocation} center - Specifies the center of the series segment.
     * @param {number} start - Specifies the start angle in degrees.
     * @param {number} end  - Specifies the end angle in degrees.
     * @param {number} radius - Specifies the radius of the series.
     * @returns {string} - Path arc direction as an SVG path string.
     */
    private getPathArc(center: ChartLocation, start: number, end: number, radius: number ): string {
        let degree: number = end - start; degree = degree < 0 ? (degree + 360) : degree;
        const flag: number = (degree < 180) ? 0 : 1;
        return this.getPiePath(center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius, flag);
    }

    /**
     * Gets the SVG path string for a pie in the circular 3D chart.
     *
     * @param {ChartLocation} center - Specifies the center of the series segment.
     * @param {ChartLocation} start - Specifies the start angle in degrees.
     * @param {ChartLocation} end - Specifies the end angle in degrees.
     * @param {number} radius - Specifies the radius of the series.
     * @param {number} clockWise - Specifies the clockwise direction (0 for anti-clockwise, 1 for clockwise).
     * @returns {string} - SVG path string for the pie.
     */
    private getPiePath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number, clockWise: number): string {
        return 'M ' + center.x + ' ' + center.y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y + ' Z';
    }

    /**
     * Renders the border for the circular 3D chart.
     *
     * @returns {void}
     */
    private renderBorder(): void {
        const padding: number = this.border.width;
        const rect: RectOption = new RectOption(this.element.id + '-border', this.background || this.themeStyle.background, this.border, 1,
                                                new Rect(padding / 2, padding / 2, this.availableSize.width - padding,
                                                         this.availableSize.height - padding));
        const htmlObject: Element = this.renderer.drawRectangle(rect);
        htmlObject.setAttribute('aria-hidden', 'true');
        appendChildElement(
            false, this.svgObject, htmlObject, this.redraw);
        const backGroundImage: string = this.backgroundImage;
        if (backGroundImage) {
            const image: ImageOption = new ImageOption(
                this.availableSize.height - padding,
                this.availableSize.width - padding,
                backGroundImage, 0, 0,
                this.element.id + '-background',
                'visible', 'none'
            );
            appendChildElement(false, this.svgObject, this.renderer.drawImage(image) as HTMLElement, this.redraw);
        }
    }

    /**
     * Creates the secondary element for tooltips and data labels.
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
     * Renders the series for the circular 3D chart.
     *
     * @returns {void}
     */
    private renderSeries(): void {
        if (!this.redraw) {
            this.svgObject.appendChild(this.renderer.createGroup({ id: this.element.id + '_SeriesCollection' }));
        }
        for (const series of this.visibleSeries) {
            if (series.visible && this[('pie' + 'Series3DModule')]) {
                series.draw(series, this);
                this.defaultLabelBound(series);
            }
        }
    }

    /**
     * Sets the default label bounds for the specified circular 3D chart series based on its circular bounds.
     *
     * @param {CircularChart3DSeries} series - The CircularChart3DSeries for which to set the default label bounds.
     * @returns {void}
     */
    private defaultLabelBound(series: CircularChart3DSeries): void {
        if (series.segments.length > 0 && series.dataLabel.visible) {
            const circularBound: Rect = this.getSeriesBound(series);
            if (series.dataLabel.visible && series.dataLabel.position === 'Inside') {
                series.labelBound = new Rect(
                    circularBound.x, circularBound.y, circularBound.width + circularBound.x,
                    circularBound.height + circularBound.y);
            }
            series.findMaxBounds(series.labelBound, circularBound);
            if (this.circularChartLegend3DModule) {
                series.labelBound.x -= this.explodeDistance;
                series.labelBound.y -= this.explodeDistance;
                series.labelBound.height += (this.explodeDistance - series.labelBound.y);
                series.labelBound.width += (this.explodeDistance - series.labelBound.x);
            }
        }
    }

    /**
     * Calculates and returns the bounding rectangle (Rect) for the specified circular 3D chart series.
     *
     * @param {CircularChart3DSeries} series - The CircularChart3DSeries for which to calculate the bounding rectangle.
     * @returns {Rect} - The calculated bounding rectangle for the series.
     */
    private getSeriesBound(series: CircularChart3DSeries): Rect {
        const rect: Rect = new Rect(Infinity, Infinity, -Infinity, -Infinity);
        const start: number = 0;
        const total: number = 360;
        let end: number = (0 + total) % 360;
        end = (end === 0) ? 360 : end;
        series.findMaxBounds(rect, this.getRectFromAngle(start));
        series.findMaxBounds(rect, this.getRectFromAngle(end));
        series.findMaxBounds(rect, new Rect(series.segments[0].center.x, series.segments[0].center.y, 0, 0));
        let nextQuandrant: number = (Math.floor(start / 90) * 90 + 90) % 360;
        let lastQuadrant: number = (Math.floor(end / 90) * 90) % 360;
        lastQuadrant = (lastQuadrant === 0) ? 360 : lastQuadrant;
        if (total >= 90 || lastQuadrant === nextQuandrant) {
            series.findMaxBounds(rect, this.getRectFromAngle(nextQuandrant));
            series.findMaxBounds(rect, this.getRectFromAngle(lastQuadrant));
        }
        if (start === 0 || (start + total >= 360)) {
            series.findMaxBounds(rect, this.getRectFromAngle(0));
        }
        const length: number = nextQuandrant === lastQuadrant ? 0 : Math.floor(total / 90);
        for (let i: number = 1; i < length; i++) {
            nextQuandrant = nextQuandrant + 90;
            if ((nextQuandrant < lastQuadrant || end < start) || total === 360) {
                series.findMaxBounds(rect, this.getRectFromAngle(nextQuandrant));
            }
        }
        rect.width -= rect.x;
        rect.height -= rect.y;
        return rect;
    }

    /**
     * Computes and returns a rectangle (Rect) based on the specified angle.
     *
     * @param {number} angle - The angle used to calculate the rectangle position.
     * @returns {Rect} - The calculated rectangle representing the position.
     */
    private getRectFromAngle(angle: number): Rect {
        const location: ChartLocation = degreeToLocation(angle, this.circularRadius[0], this.visibleSeries[0].segments[0].center);
        return new Rect(location.x, location.y, 0, 0);
    }

    /**
     * Renders the title for the circular 3D chart.
     *
     * @returns {void}
     */
    private renderTitle(): void {
        const margin: MarginModel = this.margin;
        if (!this.title) {
            return null;
        }
        const getAnchor: string = this.getTextAnchor(this.titleStyle.textAlignment, this.enableRtl);
        const titleSize: Size = measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont);
        const titleHeight: number = this.margin.top + (titleSize.height * 3 / 4);
        const rect: Rect = new Rect(
            margin.left, 0, this.availableSize.width - margin.left - margin.right, 0
        );
        const options: TextOption = new TextOption(
            this.element.id + '-title',
            titlePositionX(
                rect, this.titleStyle
            ),
            titleHeight,
            getAnchor, this.titleCollection, '', 'auto'
        );
        this.titleLocation = { x: options.x, y: options.y, size: titleSize };
        const element: Element = textElement(
            this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitleFont.color,
            this.svgObject, false, this.redraw, null, null, null,
            null, null, null, null, null, this.themeStyle.chartTitleFont
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
     * Gets the text anchor based on the specified alignment and RTL setting.
     *
     * @param {Alignment} alignment - The alignment of the text.
     * @param {boolean} enableRTL - A boolean indicating whether right-to-left (RTL) text is enabled.
     * @returns {string} - The text anchor value.
     */
    private getTextAnchor(alignment: Alignment, enableRTL: boolean): string {
        switch (alignment) {
        case 'Near':
            return enableRTL ? 'end' : 'start';
        case 'Far':
            return enableRTL ? 'start' : 'end';
        default:
            return 'middle';
        }
    }

    /**
     * Renders the subtitle for the circular 3D chart.
     *
     * @param {TextOption} options - The text options for rendering the subtitle.
     * @returns {void}
     */
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
            this.element.id + '-sub-title',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding,
            this.getTextAnchor(this.subTitleStyle.textAlignment, this.enableRtl), this.subTitleCollection, '', 'auto'
        );
        this.subTitleLocation = { x: subTitleOption.x, y: subTitleOption.y, size: subTitleElementSize };
        textElement(this.renderer, subTitleOption, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartSubTitleFont.color,
                    this.svgObject, false, this.redraw, null, null, null, null, null, null, null, null, this.themeStyle.chartSubTitleFont);
    }

    /**
     * Sets the left and top position for the data label and tooltip template for center-aligned chart.
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
     * Creates an SVG element for the circular 3D chart.
     *
     * @returns {void}
     */
    private createPieSvg(): void {
        this.removeSvg();
        createSvg(this);
    }

    /**
     * Removes the SVG from the circular 3D chart.
     *
     * @returns {void}
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
        removeElement(this.element.id + 'PointHover_Border');
    }

    /**
     * Calculates and sets the visible series for the circular 3D chart.
     *
     * @returns {void}
     */
    private calculateVisibleSeries(): void {
        this.visibleSeries = [];
        (this.series[0] as CircularChart3DSeries).index = 0;
        this.visibleSeries.push(this.series[0] as CircularChart3DSeries);
    }

    /**
     * Method to calculate bounds for the circular 3D chart.
     *
     * @returns {void}
     * @private
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
            this.titleCollection = getTitle(
                this.title, this.titleStyle, this.initialClipRect.width, this.enableRtl, this.themeStyle.chartTitleFont);
        }
        titleHeight = this.title ? measureText(this.title, this.titleStyle,
                                               this.themeStyle.chartTitleFont).height * this.titleCollection.length : titleHeight;
        if (this.subTitle) {
            for (const titleText of this.titleCollection) {
                titleWidth = measureText(titleText, this.titleStyle, this.themeStyle.chartSubTitleFont).width;
                maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
            }
            this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth, this.enableRtl, this.themeStyle.chartTitleFont);
            subTitleHeight = (measureText(this.subTitle,
                                          this.subTitleStyle, this.themeStyle.chartSubTitleFont).height * this.subTitleCollection.length);
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
     * Method to calculate legend bounds for the circular 3D chart.
     *
     * @returns {void}
     */
    private calculateLegendBounds(): void {
        if (!this.circularChartLegend3DModule || !this.legendSettings.visible) {
            return null;
        }
        this.circularChartLegend3DModule.getLegendOptions(this, <CircularChart3DSeries[]>this.visibleSeries);
        this.circularChartLegend3DModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
    }

    /**
     * Handles the print method for the circular 3D chart control.
     *
     * @param {string[] | string | Element} id - Specifies the element to print.
     * @returns {void}
     */
    public print(id?: string[] | string | Element): void {
        const exportChart: PrintUtils = new PrintUtils(this);
        exportChart.print(id);
    }

    /**
     * Export method for the circular 3D chart.
     *
     * @param {ExportType} type - Specifies the type of the image file (PNG, JPEG, SVG).
     * @param {string} fileName - Specifies the name of the exported image file.
     * @returns {void}
     */
    public export(type: ExportType, fileName: string): void {
        if (this.circularChartExport3DModule) {
            this.circularChartExport3DModule.export(type, fileName);
            if (this.afterExport) {
                this.circularChartExport3DModule.getDataUrl(this);
            }
        }
    }

    /**
     * Export the chart on the page to a PDF document.
     *
     * @param {string} fileName - The name of the exported file.
     * @param {PdfPageOrientation} orientation - Page orientation (portrait or landscape).
     * @param {CircularChart3D[]} controls - Array of controls to be exported.
     * @param {number} width - The width of the exported chart.
     * @param {number} height - The height of the exported chart.
     * @param {boolean} isVertical - Export the chart vertically or horizontally.
     * @param {string} header - Text to appear at the top of the exported PDF document.
     * @param {string} footer - Text to appear at the bottom of the exported PDF document.
     * @param {boolean} exportToMultiplePage - Export the chart to multiple PDF pages.
     * @returns {void}
     */
    public pdfExport(
        fileName: string,
        orientation?: PdfPageOrientation, controls?: (CircularChart3D)[],
        width?: number, height?: number, isVertical?: boolean, header?: IPDFArgs, footer?: IPDFArgs, exportToMultiplePage?: boolean
    ): void {
        if (this.circularChartExport3DModule) {
            this.circularChartExport3DModule.pdfExport(
                fileName, orientation, controls, width, height, isVertical, header, footer, exportToMultiplePage);
        }
    }

    /**
     * Provides an array of modules needed for control rendering in the circular 3D chart.
     *
     * @returns {ModuleDeclaration[]} - An array of required modules.
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push({
            member: this.type + 'Series3D',
            args: [this]
        });

        if (this.legendSettings.visible) {
            modules.push({
                member: 'CircularChartLegend3D',
                args: [this]
            });
        }
        if (this.series[0].dataLabel.visible) {
            modules.push({
                member: 'CircularChartDataLabel3D',
                args: [this]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'CircularChartTooltip3D',
                args: [this]
            });
        }
        if (this.selectionMode !== 'None') {
            modules.push({
                member: 'CircularChartSelection3D',
                args: [this]
            });
        }
        if (this.highlightMode !== 'None' || this.legendSettings.enableHighlight) {
            modules.push({
                member: 'CircularChartHighlight3D',
                args: [this]
            });
        }
        if (this.enableExport) {
            modules.push({
                member: 'CircularChartExport3D',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * Handles the keyboard onkeydown event in the circular 3D chart.
     *
     * @param {KeyboardEvent} e - The keydown event arguments.
     * @returns {boolean} - Returns `false`.
     * @private
     */
    public circular3DChartKeyDown(e: KeyboardEvent): boolean {
        let actionKey: string = '';

        if (this.tooltip.enable && ((e.code === 'Tab' && this.previousTargetId.indexOf('series') > -1) || (this.previousTargetId.indexOf('legend') > -1) || e.code === 'Escape')) {
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
     * Handles keyboard navigation for the chart based on the provided KeyboardEvent, targetId, and actionKey.
     *
     * @param {KeyboardEvent} e - The keyboard event object.
     * @param {string} targetId - The ID of the target element related to the keyboard action.
     * @param {string} actionKey - The key representing the type of action (e.g., 'Tab', 'ArrowMove').
     * @returns {void}
     */
    private chartKeyboardNavigations(e: KeyboardEvent, targetId: string, actionKey: string): void {
        this.isLegendClicked = false;
        switch (actionKey) {
        case 'Tab':
        case 'ArrowMove':
            if (targetId.indexOf('-point-') > -1) {
                const seriesIndex: number = 0;
                const pointIndex: number = parseInt(targetId.split('point-')[1], 10);

                const point: CircularChart3DPoints = this.visibleSeries[0].points[pointIndex as number];
                const center: CircularChart3DVector = point.symbolLocation.center;
                const dradius: number = point.symbolLocation.radius * this.visibleSeries[0].coefficient;
                const radius: number = dradius + (point.symbolLocation.radius - dradius) / 2;
                this.mouseX = center.x + radius * Math.cos(point.symbolLocation.angle);
                this.mouseY = center.y + radius * Math.sin(point.symbolLocation.angle);

                if (this.circularChartHighlight3DModule) {
                    let targetElement: Element = getElement(targetId);
                    if (!isNullOrUndefined(targetElement)) {
                        if (targetElement.id.indexOf('text') > 1) {
                            targetElement = getElement(targetElement.id.replace('text', 'shape'));
                        }
                        if (this.circularChartSelection3DModule) {
                            this.circularChartSelection3DModule.calculateSelectedElements(this, targetElement, 'mousemove');
                        }
                        else {
                            this.circularChartHighlight3DModule.calculateSelectedElements(this, targetElement, 'mousemove');
                        }
                    }
                }
                if (this.circularChartTooltip3DModule) {
                    const series: CircularChart3DSeries = this.visibleSeries[seriesIndex as number];
                    let data: CircularChart3DPointData;
                    if (series.enableTooltip) {
                        data = new CircularChart3DPointData(series.points[pointIndex as number], series);
                    }
                    this.circularChartTooltip3DModule.element = this.element;
                    this.circularChartTooltip3DModule.control = this;
                    this.circularChartTooltip3DModule.renderSeriesTooltip(this, data);
                }
            }
            if (this.circularChartHighlight3DModule && this.highlightMode !== 'None') {
                targetId = targetId.indexOf('_chart_legend_g_') > -1 ? document.getElementById(targetId).firstChild['id'] : targetId;
                const legendID: string = this.element.id + '_chart_legend';
                const legendItemsId: string[] = [legendID + '_text_', legendID + '_shape_marker_',
                    legendID + '_shape_'];
                for (let i: number = 0; i < legendItemsId.length; i++) {
                    const id: string = legendItemsId[i as number];
                    if (targetId.indexOf(id) > -1) {
                        document.getElementById(targetId).setAttribute('class', '');
                        if (this.circularChartSelection3DModule) {
                            this.circularChartSelection3DModule.legendSelection(
                                this, getElement(targetId), 'mousemove');
                        }
                        else {
                            this.circularChartHighlight3DModule.legendSelection(
                                this, getElement(targetId), 'mousemove');
                        }
                        break;
                    }
                }
            }
            break;

        case 'Enter':
        case 'Space':
            if (targetId.indexOf('_chart_legend_') > -1 && this.circularChartLegend3DModule) {
                this.isLegendClicked = true;
                this.circularChartLegend3DModule.click(e as Event);
                this.focusChild(document.getElementById(targetId).parentElement);
            } else {
                if (this.circularChartSelection3DModule) {
                    this.circularChartSelection3DModule.calculateSelectedElements(this, document.getElementById(targetId), 'click');
                }
            }
            break;
        case 'CtrlP':
            this.print();
            break;
        case 'ESC':
            if (this.circularChartTooltip3DModule) {
                this.circularChartTooltip3DModule.removeTooltip(1);
            }
            if (this.circularChartSelection3DModule) {
                this.circularChartSelection3DModule.calculateSelectedElements(this, document.getElementById(this.element.id + '-border'), 'mousemove');
            }
            else if (this.circularChartHighlight3DModule && this.highlightMode !== 'None') {
                this.circularChartHighlight3DModule.calculateSelectedElements(this, document.getElementById(this.element.id + '-border'), 'mousemove');
            }
            break;
        }
    }

    /**
     * Sets the tabindex attribute of the provided HTML element to '0'.
     *
     * @param {HTMLElement} element - The HTML element to be focused.
     * @returns {string} - The updated class attribute of the focused element.
     */
    private focusChild(element: HTMLElement): string {
        element.setAttribute('tabindex', '0');
        let className: string = element.getAttribute('class');
        element.setAttribute('tabindex', '0');
        if (className && className.indexOf('e-circular3dchart-focused') === -1) {
            className = 'e-circular3dchart-focused ' + className;
        } else if (!className) {
            className = 'e-circular3dchart-focused';
        }
        element.setAttribute('class', className);
        element.focus();
        return element.id;
    }

    /**
     * Handles the keyboard onkeyup event in the circular 3D chart.
     *
     * @param {KeyboardEvent} e - The keyup event arguments.
     * @returns {boolean} - Returns `false`.
     * @private
     */
    public circular3DChartKeyUp(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        let targetId: string = e.target['id'];

        const legendElement: HTMLElement = getElement(this.element.id + '_chart_legend_translate_g') as HTMLElement;
        const pagingElement: HTMLElement = getElement(this.element.id + '_chart_legend_pageup') as HTMLElement;

        if (legendElement) {
            const firstChild: HTMLElement = legendElement.firstElementChild as HTMLElement;
            let className: string = firstChild.getAttribute('class');
            if (className && className.indexOf('e-circular3dchart-focused') === -1) {
                className = className + ' e-circular3dchart-focused';
            }
            else if (!className) {
                className = 'e-circular3dchart-focused';
            }
            firstChild.setAttribute('class', className);
        }
        if (pagingElement) { pagingElement.setAttribute('class', 'e-circular3dchart-focused'); }


        if (e.code === 'Tab') {
            if (this.previousTargetId !== '') {
                if (this.previousTargetId.indexOf('-point-') > -1 && targetId.indexOf('-point-') === -1) {
                    // const groupElement: HTMLElement = document.getElementById(this.previousTargetId).parentElement;
                    // this.setTabIndex(groupElement.children[this.currentPointIndex] as HTMLElement,
                    //                  groupElement.firstElementChild as HTMLElement);
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
                else if (this.previousTargetId.indexOf('-title') > -1 && targetId.indexOf('-point-') > -1) {
                    this.currentPointIndex =  parseInt(targetId.split('point-')[1], 10)
                }
            }

            this.previousTargetId = targetId;
            if (targetId.indexOf('_chart_legend_g_') > -1 && this.highlightMode !== 'None') {
                targetId = e.target['lastElementChild'].id;
                actionKey = 'Tab';
            }
            else if (targetId.indexOf('-point-') > -1 && (this.highlightMode !== 'None' || this.tooltip.enable)) {
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
            else if (targetId.indexOf('-point-') > -1) {
                (e.target as HTMLElement).setAttribute('tabindex', '-1');
                let totalLength: number = 0;
                const seriesIndexes: number[] = [];
                for (let i: number = 0; i < this.visibleSeries[0].points.length; i++) {
                    const point: CircularChart3DPoints = this.visibleSeries[0].points[i as number];
                    totalLength = point.visible ? totalLength + 1 : totalLength;
                    if(this.visibleSeries[0].points[i as number].visible){
                        seriesIndexes.push(this.visibleSeries[0].points[i as number].index)
                    }
                }
                this.currentPointIndex = seriesIndexes.indexOf(this.currentPointIndex) + ((e.code === 'ArrowUp' || e.code === 'ArrowRight') ? 1 : -1);
                this.currentPointIndex = seriesIndexes[this.getActualIndex(this.currentPointIndex, seriesIndexes.length)];
                const elements: NodeListOf<Element> = document.querySelectorAll(`[id*="region-series-0-point-${this.currentPointIndex}"]`);
                let element: Element;
                if (elements.length > 0) {
                    element = elements[elements.length - 1];
                }
                targetId = element ? element.id : '';
                this.focusTarget(getElement(targetId) as HTMLElement);
                actionKey = this.tooltip.enable || this.circularChartHighlight3DModule ? 'ArrowMove' : '';
            }
        }
        else if ((e.code === 'Enter' || e.code === 'Space') && ((targetId.indexOf('_chart_legend_') > -1) ||
            (targetId.indexOf('-point-') > -1))) {
            targetId = (targetId.indexOf('_chart_legend_g') > -1) ? e.target['lastElementChild'].id : targetId;
            actionKey = 'Enter';
        }

        if (actionKey !== '') {
            this.chartKeyboardNavigations(e, targetId, actionKey);
        }
        return false;
    }

    /**
     * Calculates the actual index based on the specified index and total length.
     *
     * @param {number} index - The index to be adjusted.
     * @param {number} totalLength - The total length of the collection or array.
     * @returns {number} - The actual index after adjustment.
     */
    private getActualIndex(index: number, totalLength: number): number {
        return index > totalLength - 1 ? 0 : (index < 0 ? totalLength - 1 : index);
    }

    /**
     * Focuses the specified HTML element by setting its tabindex attribute to '0'.
     *
     * @param {HTMLElement} element - The HTML element to be focused.
     * @returns {string} - The updated class attribute of the focused element.
     */
    private focusTarget(element: HTMLElement): string {
        let className: string = element.getAttribute('class');
        element.setAttribute('tabindex', '0');
        if (className && className.indexOf('e-circular3dchart-focused') === -1) {
            className = className + ' e-circular3dchart-focused';
        } else if (!className) {
            className = 'e-circular3dchart-focused';
        }
        element.setAttribute('tabindex', '0');
        element.setAttribute('class', className);
        element.focus();
        return element.id;
    }

    /**
     * Sets the tabIndex property on the provided currentElement.
     *
     * @param {HTMLElement} previousElement - The previously focused HTML element.
     * @param {HTMLElement} currentElement - The currently focused HTML element.
     * @returns {void}
     */
    private setTabIndex(previousElement: HTMLElement, currentElement: HTMLElement): void {
        if (previousElement) {
            previousElement.removeAttribute('tabindex');
        }
        if (currentElement) {
            currentElement.setAttribute('tabindex', '0');
        }
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - A string representing the persisted data.
     */
    public getPersistData(): string {
        return '';
    }

    /**
     * Gets the module name for the circular 3D chart.
     *
     *  @private
     * @returns {string} - The circular 3D chart module name.
     */
    public getModuleName(): string {
        return 'circularchart3d';
    }

    /**
     * Destroys the circular 3D chart instance.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.element) {
            this.unWireEvents();
            this.circular3DPolygon = [];
            this.visibleSeries[0].segments = [];
            super.destroy();
            this.element.classList.remove('e-circular3dchart');
            this.element.classList.remove('e-circular3dchart-focused');
            const element: HTMLElement = document.getElementById(this.element.id + 'Keyboard_circular3dchart_focus');
            if (element) { element.remove(); }
            removeElement('chartmeasuretext');
            this.removeSvg();
            this.svgObject = null;
        }
    }

    /**
     * Handles the resize of the circular 3D chart.
     *
     * @returns {boolean} - Returns `true` to indicate the resize method of the circular 3D chart.
     * @private
     */
    public chartResize(): boolean {
        this.animateSeries = false;
        const args: CircularChart3DResizeEventArgs = {
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
            currentSize: new Size(0, 0),
            chart: this
        };
        const beforeResizeArgs: CircularChart3DBeforeResizeEventArgs = { cancel: false };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.trigger(beforeResize, beforeResizeArgs);
        if (!beforeResizeArgs.cancel) {
            this.resizeTo = +setTimeout(
                (): void => {
                    if (this.isDestroyed) {
                        clearTimeout(this.resizeTo);
                        return;
                    }
                    calculateSize(this);
                    args.currentSize = this.availableSize;
                    this.trigger(resized, args);
                    this.refreshChart();
                },
                500);
        }
        return false;
    }

    /**
     * Retrieves the visible circular 3D chart series based on the specified index.
     *
     * @param {CircularChart3DSeries[]} visibleSeries - An array of visible circular 3D chart series.
     * @param {number} index - The index of the desired series.
     * @returns {CircularChart3DSeries} - The CircularChart3D series corresponding to the provided index.
     */
    private changeVisibleSeries(visibleSeries: CircularChart3DSeries[], index: number): CircularChart3DSeries {
        for (const series of visibleSeries) {
            if (index === series.index) {
                return series;
            }
        }
        return null;
    }

    /**
     * Removes elements with IDs containing the substring "region-series-".
     *
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @returns {void}
     * @private
     */
    public removeSeriesElements(chart: CircularChart3D): void {
        document.querySelectorAll("[id*=\"region-series-" + "\"]").forEach(function (element: Element): void {
            if (element.parentElement.id === chart.groupElement.id) {
                return element.remove();
            }
        });
        document.querySelectorAll("[id*=\"data-label-text-" + "\"]").forEach(function (element: Element): void {
            if (element.parentElement.id === chart.groupElement.id) {
                return element.remove();
            }
        });
        document.querySelectorAll("[id*=\"data-label-series-0-shape-" + "\"]").forEach(function (element: Element): void {
            if (element.parentElement.id === chart.groupElement.id) {
                return element.remove();
            }
        });
        document.querySelectorAll("[id*=\"datalabel-series-0-connector-" + "\"]").forEach(function (element: Element): void {
            if (element.parentElement.id === chart.groupElement.id) {
                return element.remove();
            }
        });
    }

    /**
     * Called internally when any property value changes in the circular 3D chart.
     *
     * @private
     * @param {CircularChart3DModel} newProp - Specifies the new properties of the circular 3D chart.
     * @param {CircularChart3DModel} oldProp - Specifies the old properties of the circular 3D chart.
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: CircularChart3DModel, oldProp: CircularChart3DModel): void {
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
            case 'enableRotation':
            case 'depth':
                update.refreshBounds = true;
                break;
            case 'tilt':
            case 'rotation':
                if (!this.rotateActivate) {
                    update.refreshBounds = true;
                    this.animateSeries = false;
                }
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
                if (!this.delayRedraw) {
                    let seriesRefresh: boolean = false;
                    let series: CircularChart3DSeriesModel;
                    let seriesRender: boolean;
                    for (let i: number = 0; i < this.series.length; i++) {
                        series = newProp.series[i as number];
                        if ((series.explodeOffset ||
                            series.radius || series.innerRadius || series.emptyPointSettings)) {
                            seriesRender = true;
                        }
                        if (newProp.series[i as number] && (newProp.series[i as number].dataSource || newProp.series[i as number].yName
                            || newProp.series[i as number].xName ||
                            newProp.series[i as number].dataLabel || seriesRender)) {
                            extend(this.changeVisibleSeries(this.visibleSeries, i), series, null, true);
                            seriesRefresh = true;
                        }
                        if (newProp.series[i as number] && !isNullOrUndefined(newProp.series[i as number].explodeIndex) &&
                            newProp.series[i as number].explodeIndex >= 0
                            && newProp.series[i as number].explodeIndex !== oldProp.series[i as number].explodeIndex) {
                            seriesRefresh = true;
                            this.removeSeriesElements(this);
                        }
                    }
                    if (seriesRefresh) {
                        this.processData(false); update.refreshBounds = true;
                    }
                }
                this.delayRedraw = false;
                this.redraw = false;
                break;
            case 'enableRtl':
            case 'locale':
                super.refresh(); break;
            case 'background':
            case 'border':
                update.refreshElements = true;
                break;
            case 'isMultiSelect':
            case 'selectedDataIndexes':
            case 'selectionMode':
                if (this.circularChartSelection3DModule) {
                    if (isNullOrUndefined(this.circularChartSelection3DModule.selectedDataIndexes)) {
                        this.circularChartSelection3DModule.invokeSelection(this);
                    } else {
                        this.circularChartSelection3DModule.selectedDataIndexes = this.selectedDataIndexes  as Indexes[];
                        this.circularChartSelection3DModule.redrawSelection(this);
                    }
                }
                break;
            case 'tooltip':
                if (this.circularChartTooltip3DModule) {
                    this.circularChartTooltip3DModule.previousPoints = [];
                    if (this.tooltip.template) {
                        this.circularChartTooltip3DModule.template = this.tooltip.template;
                    }
                }
                break;
            }
            if (!update.refreshBounds && update.refreshElements) {
                this.removeSeriesElements(this);
                this.createPieSvg();
                this.circular3DPolygon = [];
                this.visibleSeries[0].segments = [];
                this.renderElements();
            } else if (update.refreshBounds) {
                this.removeSeriesElements(this);
                this.createPieSvg();
                this.circular3DPolygon = [];
                this.visibleSeries[0].segments = [];
                this.calculateBounds();
                this.renderElements();
            }
        }
    }
}
