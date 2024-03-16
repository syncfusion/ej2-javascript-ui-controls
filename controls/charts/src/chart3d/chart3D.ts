import { Component, Property, NotifyPropertyChanges, Internationalization, INotifyPropertyChanged, remove, Complex, Collection, ModuleDeclaration, Browser, EventHandler, TapEventArgs, extend, Animation, AnimationOptions, AnimationModel, animationMode } from '@syncfusion/ej2-base';
import { L10n, isNullOrUndefined, Touch } from '@syncfusion/ej2-base';
import { Event, EmitType } from '@syncfusion/ej2-base';
import { Chart3DModel } from './chart3D-model';
import { Rect, Size, SvgRenderer, TextOption, measureText, removeElement } from '@syncfusion/ej2-svg-base';
import { ImageOption, RectOption, appendChildElement, createSvg, getElement, getTextAnchor, getTitle, redrawElement, textElement, titlePositionX, showTooltip, appendClipElement, getAnimationFunction, withInBounds, Point3D  } from '../common/utils/helper';
import { beforeResize, load, pointClick, pointMove, resized } from '../common/model/constants';
import { Chart3DBoderElements, Chart3DLoadedEventArgs, Chart3DThemeStyle, Chart3DBeforeResizeEventArgs, Chart3DLegendClickEventArgs, Chart3DLegendRenderEventArgs, Chart3DPointRenderEventArgs, Chart3DResizeEventArgs, Chart3DTooltipRenderEventArgs, TitleSettings } from './model/chart3d-Interface';
import { Chart3DSeriesRenderEventArgs, Chart3DAxisLabelRenderEventArgs, Chart3DExportEventArgs, Chart3DMouseEventArgs, Chart3DPointEventArgs, Chart3DPrintEventArgs, Chart3DSelectionCompleteEventArgs, Chart3DTextRenderEventArgs, Chart3DPolygon } from './model/chart3d-Interface';
import { CartesianAxisLayoutPanel } from './axis/cartesian-panel';
import { get3DSeriesColor, get3DThemeColor } from './model/theme';
import { Border, Indexes, Margin } from '../common/model/base';
import { BorderModel, IndexesModel, MarginModel } from '../common/model/base-model';
import { Alignment, HighlightMode, SelectionPattern, ExportType, ChartTheme } from '../common/utils/enum';
import { Vector3D, Matrix3D, Graphics3D, BinaryTreeBuilder, Polygon3D, ChartTransform3D, Svg3DRenderer, Chart3DRender } from './utils/chart3dRender';
import { AxisRenderer, WallRenderer } from './utils/renderer';
import { Chart3DAxisModel, Chart3DColumnModel, Chart3DRowModel } from './axis/axis-model';
import { Chart3DAxis, Chart3DColumn, Chart3DRow } from './axis/axis';
import { DataManager } from '@syncfusion/ej2-data';
import { Data } from '../common/model/data';
import { Chart3DPoint, Chart3DSeries } from './series/chart-series';
import { DataLabel3D } from './series/data-label';
import { Chart3DTooltipSettings, Tooltip3D } from './user-interaction/tooltip';
import { Legend3D, Chart3DLegendSettings } from './legend/legend';
import { Highlight3D } from './user-interaction/high-light';
import { Selection3D } from './user-interaction/selection';
import { Export3D } from './print-export/export';
import { Chart3DSeriesModel } from './series/chart-series-model';
import { PrintUtils } from '../common/utils/print';
import { IAfterExportEventArgs } from '../common/model/interface';
import { Chart3DSelectionMode } from './utils/enum';
import { Chart3DTooltipSettingsModel } from './user-interaction/tooltip-model';
import { Chart3DLegendSettingsModel } from './legend/legend-model';
import { TitleSettingsModel } from './model/chart3d-Interface-model';

/**
 * The Chart3D class represents a 3D chart component that extends the Component class
 * and implements the INotifyPropertyChanged interface.
 *
 * @public
 * @class
 * @extends Component<HTMLElement>
 * @implements {INotifyPropertyChanged} INotifyPropertyChanged
 */
@NotifyPropertyChanges
export class Chart3D extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Title of the chart
     *
     * @default ''
     */
    @Property('')
    public title: string;
    /**
     * SubTitle of the chart.
     *
     * @default ''
     */
    @Property('')
    public subTitle: string;
    /**
     * Specifies the theme for the chart.
     *
     * @default 'Bootstrap5'
     */
    @Property('Bootstrap5')
    public theme: ChartTheme;
    /**
     * Description for chart.
     *
     * @default null
     */
    @Property(null)
    public description: string;
    /**
     * The width of the chart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, chart renders to the full width of its parent element.
     *
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * The background image of the chart that accepts value in string as url link or location of an image.
     *
     * @default null
     */
    @Property(null)
    public backgroundImage: string;
    /**
     * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public background: string;
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
     * let chart3D: Chart3D = new Chart3D({
     * ...
     *  dataSource:dataManager,
     *   series: [{
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * chart3D.appendTo('#Chart');
     * ```
     *
     * @default ''
     */
    @Property('')
    public dataSource: Object | DataManager;
    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, chart renders to the full height of its parent element.
     *
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * Depth of the 3D Chart from front view of the series to the background wall.
     *
     * @default 50
     */
    @Property(50)
    public depth: number;
    /**
     * Defines the width of the 3D chart wall.
     *
     * @default 2
     */
    @Property(2)
    public wallSize: number;
    /**
     * Defines the slope angle for the 3D chart.
     *
     * @default 0
     */
    @Property(0)
    public tilt: number;
    /**
     * If set true, enables the rotation in the 3D chart.
     *
     * @default false
     */
    @Property(false)
    public enableRotation: boolean;
    /**
     * Defines the rotating angle for the 3D chart.
     *
     * @default 0
     */
    @Property(0)
    public rotation: number;
    /**
     * To enable the side by side placing the points for column type series.
     *
     * @default true
     */
    @Property(true)
    public enableSideBySidePlacement: boolean;
    /**
     * Defines the perspective angle for the 3D chart.
     *
     * @default 90
     */
    @Property(90)
    public perspectiveAngle: number;
    /**
     * Represents the color of the 3D wall.
     *
     * @default null
     */
    @Property(null)
    public wallColor: string;
    /**
     * It specifies whether the chart should be render in transposed manner or not.
     *
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;
    /**
     * Defines the currencyCode format of the chart
     *
     * @private
     * @aspType string
     */
    @Property('USD')
    private currencyCode: string;
    /**
     * Enables or disables the export feature in the 3D chart.
     *
     * @default false
     */
    @Property(false)
    public enableExport: boolean;
    /**
     * Triggered before the chart is loaded.
     *
     * @event load
     */
    @Event()
    public load: EmitType<Chart3DLoadedEventArgs>;
    /**
     * Triggered after the chart is loaded.
     *
     * @event loaded
     */
    @Event()
    public loaded: EmitType<Chart3DLoadedEventArgs>;
    /**
     * Triggered when the user clicks on data points.
     *
     * @event pointClick
     *
     */
    @Event()
    public pointClick: EmitType<Chart3DPointEventArgs>;
    /**
     * Triggered when the user hovers over data points.
     *
     * @event pointMove
     *
     */
    @Event()
    public pointMove: EmitType<Chart3DPointEventArgs>;
    /**
     * Triggered when the data point is ready to render on the screen.
     *
     * @event pointRender
     * @deprecated
     */
    @Event()
    public pointRender: EmitType<Chart3DPointRenderEventArgs>;
    /**
     * Triggered when the legend is ready to render on the screen.
     *
     * @event legendRender
     * @deprecated
     *
     */
    @Event()
    public legendRender: EmitType<Chart3DLegendRenderEventArgs>;
    /**
     * Triggered when the user clicks on the legend.
     *
     * @event legendClick
     */
    @Event()
    public legendClick: EmitType<Chart3DLegendClickEventArgs>;
    /**
     * Triggered when the series is ready to render on the screen.
     *
     * @event seriesRender
     * @deprecated
     */
    @Event()
    public seriesRender: EmitType<Chart3DSeriesRenderEventArgs>;
    /**
     * Triggered when the data label is ready to render on the screen.
     *
     * @event textRender
     * @deprecated
     */
    @Event()
    public textRender: EmitType<Chart3DTextRenderEventArgs>;
    /**
     * Triggered when the tooltip is ready to render on the screen.
     *
     * @event tooltipRender
     */
    @Event()
    public tooltipRender: EmitType<Chart3DTooltipRenderEventArgs>;
    /**
     * Triggers before resizing of chart
     *
     * @event beforeResize
     *
     */
    @Event()
    public beforeResize: EmitType<Chart3DBeforeResizeEventArgs>;
    /**
     * Triggers after resizing of chart.
     *
     * @event resized
     *
     */
    @Event()
    public resized: EmitType<Chart3DResizeEventArgs>;
    /**
     * Triggered when the user hovers over a 3D chart.
     *
     * @event chart3DMouseMove
     *
     */
    @Event()
    public chart3DMouseMove: EmitType<Chart3DMouseEventArgs>;
    /**
     * Triggered when the user clicks on a 3D chart.
     *
     * @event chart3DMouseClick
     *
     */
    @Event()
    public chart3DMouseClick: EmitType<Chart3DMouseEventArgs>;
    /**
     * Triggered when the mouse is pressed down on a 3D chart.
     *
     * @event chart3DMouseDown
     *
     */
    @Event()
    public chart3DMouseDown: EmitType<Chart3DMouseEventArgs>;
    /**
     * Triggered when the cursor leaves a 3D chart.
     *
     * @event chart3DMouseLeave
     *
     */
    @Event()
    public chart3DMouseLeave: EmitType<Chart3DMouseEventArgs>;
    /**
     * Triggered when the mouse button is released on a 3D chart.
     *
     * @event chart3DMouseUp
     *
     */
    @Event()
    public chart3DMouseUp: EmitType<Chart3DMouseEventArgs>;
    /**
     * Triggers before each axis label is rendered.
     *
     * @event axisLabelRender
     * @deprecated
     */
    @Event()
    public axisLabelRender: EmitType<Chart3DAxisLabelRenderEventArgs>;
    /**
     * Triggers after the selection is completed.
     *
     * @event selectionComplete
     */
    @Event()
    public selectionComplete: EmitType<Chart3DSelectionCompleteEventArgs>;
    /**
     * Triggers before the export gets started.
     *
     * @event beforeExport
     */
    @Event()
    public beforeExport: EmitType<Chart3DExportEventArgs>;
    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     */
    @Event()
    public afterExport: EmitType<IAfterExportEventArgs>;
    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     */
    @Event()
    public beforePrint: EmitType<Chart3DPrintEventArgs>;
    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
    /**
     * Options for customizing the title of the Chart.
     */
    @Complex<TitleSettingsModel>({ fontFamily: null, size: '16px', fontStyle: 'Normal', fontWeight: '600', color: null }, TitleSettings)
    public titleStyle: TitleSettingsModel;
    /**
     * Options for customizing the Subtitle of the Chart.
     */
    @Complex<TitleSettingsModel>({ fontFamily: null, size: '14px', fontStyle: 'Normal', fontWeight: '400', color: null }, TitleSettings)
    public subTitleStyle: TitleSettingsModel;
    /**
     * The chart legend configuration options.
     */
    @Complex<Chart3DLegendSettingsModel>({}, Chart3DLegendSettings)
    public legendSettings: Chart3DLegendSettingsModel;
    /**
     * Options for customizing the color and width of the chart border.
     */
    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;
    /**
     * Options to configure the horizontal axis.
     */
    @Complex<Chart3DAxisModel>({ name: 'primaryXAxis' }, Chart3DAxis)
    public primaryXAxis: Chart3DAxisModel;
    /**
     * Options to configure the vertical axis.
     */
    @Complex<Chart3DAxisModel>({ name: 'primaryYAxis' }, Chart3DAxis)
    public primaryYAxis: Chart3DAxisModel;
    /**
     * The chart tooltip configuration options.
     */
    @Complex<Chart3DTooltipSettingsModel>({}, Chart3DTooltipSettings)
    public tooltip: Chart3DTooltipSettingsModel;
    /**
     * Options to split Chart into multiple plotting areas horizontally.
     * Each object in the collection represents a plotting area in the Chart.
     */
    @Collection<Chart3DRowModel>([{}], Chart3DRow)
    public rows: Chart3DRowModel[];
    /**
     * Options to split chart into multiple plotting areas vertically.
     * Each object in the collection represents a plotting area in the chart.
     */
    @Collection<Chart3DColumnModel>([{}], Chart3DColumn)
    public columns: Chart3DColumnModel[];
    /**
     * Secondary axis collection for the chart.
     */
    @Collection<Chart3DAxisModel>([{}], Chart3DAxis)
    public axes: Chart3DAxisModel[];
    /**
     * The configuration for series in the chart.
     */
    @Collection<Chart3DSeriesModel>([{}], Chart3DSeries)
    public series: Chart3DSeriesModel[];
    /**
     * Defines the color for the highlighted data point.
     *
     * @default ''
     */
    @Property('')
    public highlightColor: string;
    /**
     * Specifies whether a series or data point should be highlighted. The options are:
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     *
     * @default None
     */
    @Property('None')
    public selectionMode: Chart3DSelectionMode;
    /**
     * Specifies whether a series or data point should be highlighted. The options are:
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
     * Specifies the point indexes to be selected while loading a chart.
     * It requires `selectionMode` or `highlightMode` to be `Point` | `Series` | or `Cluster`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart3D: Chart3D = new Chart3D({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * chart3D.appendTo('#Chart');
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
     * Palette for the chart series.
     *
     * @default []
     */
    @Property([])
    public palettes: string[];
    /**
     *
     * Localization object.
     *
     * @private
     */
    public localeObject: L10n;
    /**
     * Default values of localization values.
     */
    private defaultLocalConstants: Object;
    /**
     * Gets the current visible series of the Chart.
     *
     * @hidden
     */
    public visibleSeries: Chart3DSeries[];
    /**
     * Gets the current visible axis of the Chart.
     *
     * @hidden
     */
    public axisCollections: Chart3DAxis[];
    /**
     * The `dataLabel3DModule` is used to manipulate and add data label to the series.
     */
    public dataLabel3DModule: DataLabel3D;
    /**
     * The `tooltip3DModule` is used to manipulate and add tooltip to the series.
     */
    public tooltip3DModule: Tooltip3D;
    /**
     * The `selection3DModule` is used to manipulate and add selection to the chart.
     */
    public selection3DModule: Selection3D;
    /**
     * The `highlight3DModule` is used to manipulate and add highlight to the chart.
     */
    public highlight3DModule: Highlight3D;
    /**
     * The Export Module is used to export chart.
     */
    public export3DModule: Export3D;
    /**
     * The `legend3DModule` is used to manipulate and add legend to the chart.
     *
     * @private
     */
    public legend3DModule: Legend3D;
    private previousTargetId: string = '';
    private currentPointIndex: number = 0;
    private currentSeriesIndex: number = 0;
    private currentLegendIndex: number = 0;
    private isLegend: boolean;
    public requireInvertedAxis: boolean;
    /** @private */
    public svgObject: Element;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public svgRenderer: SvgRenderer;
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public seriesElements: Element;
    /** @private */
    public visibleSeriesCount: number;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public dataLabelCollections: Rect[];
    /** @private */
    public dataLabelElements: Element;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /** @private */
    public redraw: boolean;
    /** @private */
    public animateSeries: boolean;
    /** @public */
    public animated: boolean = false;
    /** @public */
    public duration: number;
    /** @private */
    public availableSize: Size;
    /** @private */
    public delayRedraw: boolean;
    /** @private */
    public mouseDownX: number;
    /** @private */
    public mouseDownY: number;
    /** @private */
    public previousMouseMoveX: number;
    /** @private */
    public previousMouseMoveY: number;
    /** @private */
    public isPointMouseDown: boolean = false;
    private resizeTo: number;
    /** @private */
    public disableTrackTooltip: boolean;
    /** @private */
    public startMove: boolean;
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
    public isRtlEnabled: boolean = false;
    /** @private */
    public scaleX: number = 1;
    /** @private */
    public scaleY: number = 1;
    private titleCollection: string[];
    private subTitleCollection: string[];
    /** @private */
    public themeStyle: Chart3DThemeStyle;
    private chartId: number = 57723;
    /** @private */
    public svgId: string;
    /** @private */
    public chart3D: Element;
    /** @private */
    public isRedrawSelection: boolean;
    /**
     * Touch object to unwire the touch event from element.
     */
    private touchObject: Touch;
    /** @private */
    // eslint-disable-next-line
    public resizeBound: any;
    /** @private */
    // eslint-disable-next-line
    public longPressBound: any;
    /** @private */
    public isLegendClicked: boolean = false;
    // Internal variables
    private htmlObject: HTMLElement;
    /** @private */
    public vector: Vector3D;
    /** @private */
    public wallRender: WallRenderer;
    /** @private */
    public matrixObj: Matrix3D;
    /** @private */
    public bspTreeObj: BinaryTreeBuilder;
    /** @private */
    public polygon: Polygon3D;
    /** @private */
    public graphics: Graphics3D;
    /** @private */
    public transform3D: ChartTransform3D;
    /** @private */
    public svg3DRenderer: Svg3DRenderer;
    /** @private */
    public axisRender: AxisRenderer;
    /** @private */
    public chart3DRender: Chart3DRender;
    /** @private */
    public rotateActivate: boolean = false;
    /** @private */
    public previousID: string;
    /** @private */
    public isRemove: boolean = false;
    /** @private */
    public previousCoords: { x: number; y: number; };
    /** @private */
    public polygons: Chart3DPolygon[] = [];
    /** @private */
    public currentSeries: Chart3DSeries;
    /**
     * Render panel for chart.
     *
     * @hidden
     */
    public chartAxisLayoutPanel: CartesianAxisLayoutPanel;
    /**
     * Gets all the horizontal axis of the Chart.
     *
     * @hidden
     */
    public horizontalAxes: Chart3DAxis[];
    /**
     * Gets all the vertical axis of the Chart.
     *
     * @hidden
     */
    public verticalAxes: Chart3DAxis[];

    /**
     * Constructor for creating the 3D chart
     *
     * @param {Chart3DModel} options - Specifies the 3D chart model.
     * @param {string | HTMLElement} element - Specifies the element for the 3D chart.
     * @hidden
     */
    constructor(options?: Chart3DModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Checks if the given elementId has special characters and modifies it if necessary.
     *
     * @param {string} elementId - The input elementId to be checked.
     * @returns {string} - The modified elementId.
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
     * For internal use only - Initialize the event handler;
     *
     * @returns {void}
     */
    protected preRender(): void {
        this.element.id = this.isIdHasSpecialCharacter(this.element.id);
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.initPrivateVariable();
        this.setCulture();
        this.wireEvents();
        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : '');
    }

    /**
     * Initializes private variables and prepares the chart component for rendering.
     *
     * @returns {void}
     */
    private initPrivateVariable(): void {
        this.delayRedraw = false;
        this.animateSeries = true;
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.polygons = [];
        this.vector = new Vector3D(0, 0, 0);
        this.wallRender = new WallRenderer();
        this.matrixObj = new Matrix3D();
        this.bspTreeObj = new BinaryTreeBuilder();
        this.polygon = new Polygon3D();
        this.graphics = new Graphics3D();
        this.transform3D = new ChartTransform3D();
        this.svg3DRenderer = new Svg3DRenderer();
        this.axisRender = new AxisRenderer();
        this.chart3DRender = new Chart3DRender();
        this.chartAxisLayoutPanel = new CartesianAxisLayoutPanel(this);
        this.refreshAxis();
        this.refreshDefinition(<Chart3DRow[]>this.rows);
        this.refreshDefinition(<Chart3DColumn[]>this.columns);
        if (this.tooltip3DModule) {
            this.tooltip3DModule.previousPoints = [];
        }
        this.element.setAttribute('role', 'region');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('aria-label', this.description || this.title + '. Syncfusion interactive chart.');
        if (!(this.element.classList.contains('e-chart-focused'))) {
            this.element.setAttribute('class', this.element.getAttribute('class') + ' e-chart-focused');
        }
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-chart').length;
            this.element.id = 'chart_' + this.chartId + '_' + collection;
        }
        this.svgId = this.element.id + '_svg';
    }

    /**
     * Method to set culture for chart.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * To Initialize the 3D chart rendering.
     *
     * @returns {void}
     */
    protected render(): void {
        this.svgRenderer = new SvgRenderer(this.element.id);
        const loadEventData: Chart3DLoadedEventArgs = {
            chart: this, theme: this.theme, cancel: false
        };

        /**
         * Load event for the 3D chart componet.
         */
        this.trigger(load, loadEventData, () => {
            if (!loadEventData.cancel) {
                this.cartesianChartRendering();
            }
        });
    }

    /**
     * Renders the chart using a Cartesian coordinate system.
     *
     * This function is responsible for rendering the chart's graphical elements and data points using a Cartesian coordinate system.
     * It may include actions such as drawing axes, plotting data, and applying visual styles.
     *
     * @returns {void}
     */
    private cartesianChartRendering(): void {
        this.setTheme();
        this.createChartSvg();
        this.calculateVisibleSeries();
        this.calculateVisibleAxis();
        this.processData();
        this.renderComplete();
        this.allowServerDataBinding = true;
    }

    /**
     * Method to create SVG element.
     *
     * @returns {void}
     */
    public createChartSvg(): void {
        this.removeSvg();
        createSvg(this);
    }

    /**
     * Method to remove the SVG.
     *
     * @returns {void}
     * @private
     */
    public removeSvg(): void {
        if (this.redraw) {
            return null;
        }
        removeElement(this.element.id + '_Secondary_Element');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact) { this.clearTemplate(); }
        const removeLength: number = 0;
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }

    /**
     * Processes and prepares data for rendering.
     *
     * @param {boolean} render - (Optional) Indicates whether to trigger rendering after data processing.
     * @returns {void}
     */
    private processData(render: boolean = true): void {
        this.visibleSeriesCount = 0;
        const check: boolean = true;
        for (const series of this.visibleSeries) {
            if (!series.visible && !this.legendSettings.visible) {
                this.visibleSeriesCount++;
                continue;
            }
            this.initializeDataModule(series);
        }
        if (render && (!this.visibleSeries.length || this.visibleSeriesCount === this.visibleSeries.length && check)) {
            this.refreshBound();
            this.trigger('loaded', { chart: this });
        }
    }

    /**
     * Initializes the data module for a three-dimensional series.
     *
     * @param {Chart3DSeries} series - The series for which data module is initialized.
     * @returns {void}
     */
    private initializeDataModule(series: Chart3DSeries): void {
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
        series.refreshDataManager(this);
    }

    /**
     * Animate the series bounds.
     *
     * @private
     */
    public animate(duration?: number): void {
        this.redraw = true;
        this.animated = true; //used to set duration as 1000 for animation at default 300
        this.duration = duration ? duration : 1000;
    }
    /**
     * Refresh the chart bounds.
     *
     * @private
     * @returns {void}
     */
    public refreshBound(): void {
        if (this.legend3DModule && this.legendSettings.visible) {
            this.legend3DModule.getLegendOptions(this.visibleSeries, this);
        }
        if (this.tooltip.enable && this.tooltip3DModule) {
            this.tooltip3DModule.previousPoints = [];
        }
        this.calculateStackValues();

        this.calculateBounds();

        this.renderElements();

        removeElement('chartmeasuretext');
        this.removeSelection();
    }

    /**
     * Clears the selection state in the chart.
     *
     * @returns {void}
     */
    private removeSelection(): void {
        for (const series of this.visibleSeries) {
            if (series.visible) {
                for (const point of series.points) {
                    point.isSelect = false;
                }
            }
        }
    }

    /**
     * Calculates stacked values for three-dimensional series in the chart.
     *
     * @returns {void}
     */
    private calculateStackValues(): void {
        let series: Chart3DSeries;
        let isCalculateStacking: boolean = false;
        for (let i: number = 0, len: number = this.visibleSeries.length; i < len; i++) {
            series = <Chart3DSeries>this.visibleSeries[i as number];
            series.position = series.rectCount = undefined;
            if (((series.type.indexOf('Stacking') !== -1)) && !isCalculateStacking) {
                series.calculateStackedValue(series.type.indexOf('100') > -1, this);
                isCalculateStacking = true;
            }
        }
    }

    /**
     * Calculates the bounds and dimensions for the chart area.
     *
     * @returns {void}
     */
    private calculateBounds(): void {
        const margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        let titleWidth: number = 0;
        const padding: number = this.titleStyle.position === 'Top' || (this.titleStyle.position === 'Bottom') ? 15 : 5;
        let left: number = margin.left + this.border.width;
        let width: number = this.availableSize.width - left - margin.right - this.border.width;
        let elementSpacing: number = 0;
        let top: number = margin.top + this.border.width;
        let height: number = this.availableSize.height - top - this.border.width - margin.bottom;
        this.titleCollection = [];
        this.subTitleCollection = [];
        if (this.title) {
            this.titleCollection = getTitle(this.title, this.titleStyle, (this.titleStyle.position === 'Left' || this.titleStyle.position === 'Right' ? height : width), this.enableRtl, this.themeStyle.chartTitleFont);
            titleHeight = (measureText(this.title, this.titleStyle,
                                       this.themeStyle.chartTitleFont).height * this.titleCollection.length) + padding;
            if (this.subTitle) {
                let maxWidth: number = 0;
                for (const titleText of this.titleCollection) {
                    titleWidth = measureText(titleText, this.titleStyle, this.themeStyle.chartSubTitleFont).width;
                    maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
                }
                this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth, this.enableRtl, this.themeStyle.chartSubTitleFont);
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle,
                                              this.themeStyle.chartSubTitleFont).height * this.subTitleCollection.length) +
                    padding;
            }
        } else if (this.legendSettings.position !== 'Top' && this.border.width) { elementSpacing = 10; }
        top = margin.top + elementSpacing + this.border.width;
        height = this.availableSize.height - top - this.border.width - margin.bottom;
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
        this.initialClipRect = new Rect(left, top, width, height);
        if (this.legend3DModule && this.legendSettings.visible) {
            this.legend3DModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
        }
        this.chartAxisLayoutPanel.measureAxis(this.initialClipRect);
    }

    /**
     * Renders various chart elements, including the border, title, series, legend, and datalabel etc.
     *
     * @returns {void}
     */
    private renderElements(): void {

        this.renderBorder();

        this.renderTitle();

        this.createSeriesElements();

        this.render3DChart();

        this.renderLegend();

        this.performSelection();

        this.setSecondaryElementPosition();

        this.doAnimation();
    }

    /**
     * Animates the height of an SVG element.
     *
     * @param {HTMLElement} element - The SVG element to animate.
     * @param {Chart3DSeries} series - The series related to the animation.
     * @param {Chart3DPoint} point - The point related to the animation.
     * @param {HTMLElement} dataLabelElement - The data label element related to the animation.
     * @param {HTMLElement} shapeElement - The shape element related to the animation.
     * @param {HTMLElement} templateElement - The template element related to the animation.
     * @returns {void}
     */
    private animateRect(element: HTMLElement, series: Chart3DSeries, point: Chart3DPoint,
                        dataLabelElement: HTMLElement, shapeElement: HTMLElement, templateElement: HTMLElement): void {
        const option: AnimationModel = series.animation;
        const duration: number = series.chart.animated ? series.chart.duration : option.duration;
        const effect: Function = getAnimationFunction('Linear');
        let elementHeight: number = element.getAttribute('height') ? +element.getAttribute('height') : 0;
        let elementWidth: number = element.getAttribute('width') ? +element.getAttribute('width') : 0;
        const isPlot: boolean = point.yValue < 0;
        let centerX: number;
        let centerY: number;
        const x: number = +element.getAttribute('x');
        const y: number = +element.getAttribute('y');
        if (!series.chart.requireInvertedAxis) {
            centerY = (isPlot !== series.yAxis.isAxisInverse) ? y : y + elementHeight;
            centerX = isPlot ? x : x + elementWidth;
        } else {
            if (series.type.indexOf('Stacking') > -1) {
                centerX = x;
                centerY = y;
            } else {
                centerY = isPlot ? y : y + elementHeight;
                centerX = (isPlot !== series.yAxis.isAxisInverse) ? x + elementWidth : x;
            }
        }
        let value: number;
        if (!isNullOrUndefined(element)) {
            element.style.visibility = 'hidden';
            if (dataLabelElement) { dataLabelElement.style.visibility = 'hidden'; }
            if (shapeElement) { shapeElement.style.visibility = 'hidden'; }
            if (templateElement) { templateElement.style.visibility = 'hidden'; }
            new Animation({}).animate(element, {
                duration: (duration === 0 && animationMode === 'Enable') ? 1000 : duration,
                delay: option.delay,
                progress: (args: AnimationOptions): void => {
                    if (args.timeStamp >= args.delay) {
                        element.style.visibility = 'visible';
                        if (!series.chart.requireInvertedAxis) {
                            elementHeight = elementHeight ? elementHeight : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(1,' + (value / elementHeight) + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                        else {
                            elementWidth = elementWidth ? elementWidth : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(' + (value / elementWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                    }
                },
                end: () => {
                    element.setAttribute('transform', 'translate(0,0)');
                    if (dataLabelElement) { dataLabelElement.style.visibility = 'visible'; }
                    if (shapeElement) { shapeElement.style.visibility = 'visible'; }
                    if (templateElement) { templateElement.style.visibility = 'visible'; }
                    series.chart.trigger('animationComplete', { series: series });
                }
            });
        }
    }

    /**
     * Animates the series.
     *
     * @returns {void}
     */
    private doAnimation(): void {
        for (let i: number = 0; i < this.visibleSeries.length; i++) {
            const series: Chart3DSeries  = this.visibleSeries[i as number];
            if (series.visible && series.animation.enable && this.animateSeries && !this.rotateActivate) {
                let dataLabelElement: Element;
                let shapeElement: Element;
                let templateElement: Element;
                const options: RectOption = new RectOption(
                    this.element.id + '_ChartSeriesClipRect_' + i, 'transparent', { width: 1, color: 'Gray' }, 1,
                    {
                        x: 0, y: 0,
                        width: this.availableSize.width,
                        height: this.availableSize.height
                    });
                const clipRectElement: Element = appendClipElement(this.redraw, options, this.svgRenderer);
                appendChildElement(false, this.chart3D, clipRectElement.children[0], this.redraw);
                for (let k: number = 0; series.visiblePoints && k < series.visiblePoints.length; k++) {
                    const point: Chart3DPoint = series.visiblePoints[k as number];
                    const elements: NodeListOf<Element> = document.querySelectorAll(`[id*="region-series-${i}"]`);
                    elements.forEach((element: Element) => {
                        element.setAttribute('clip-path', 'url(#' + this.element.id + '_ChartSeriesClipRect_' + i + ')');
                    });
                    if (series.dataLabel.visible) {
                        dataLabelElement = getElement(this.element.id + '-svg-series-' + series.index + '-point-' + k + '-data-label');
                        shapeElement = getElement(this.element.id + '-svg-data-label-series-' + series.index + '-point-' + k);
                        templateElement = getElement(this.element.id + '-series-' + series.index + '-data-label-' + k);
                    }
                    this.animateRect(document.getElementById(this.element.id + '_ChartSeriesClipRect_' + i).children[0] as HTMLElement, series,
                                     point, dataLabelElement as HTMLElement, shapeElement as HTMLElement, templateElement as HTMLElement);
                }
            }
        }
    }

    /**
     * Performs data selection based on selected data indexes.
     *
     * @returns {void}
     */
    private performSelection(): void {
        let selectedDataIndexes: Indexes[] = [];
        if (this.selection3DModule) {
            selectedDataIndexes = <Indexes[]>extend([], this.selection3DModule.selectedDataIndexes, null, true);
            this.selection3DModule.invokeSelection(this);
        }
        if (this.highlight3DModule) {
            this.highlight3DModule.invokeHighlight(this);
        }
        if ((!this.highlight3DModule || (this.legendSettings.enableHighlight && this.highlightMode === 'None')) && this.tooltip3DModule){
            this.tooltip3DModule.seriesStyles();
        }
        if (selectedDataIndexes.length > 0) {
            this.selection3DModule.selectedDataIndexes = selectedDataIndexes;
            this.selection3DModule.redrawSelection(this, this.selectionMode);
        }
    }

    /**
     * To render the legend.
     *
     * @returns {void}
     */
    private renderLegend(): void {
        if (this.legend3DModule && this.legend3DModule.legendCollections.length && this.legendSettings.visible) {
            this.legend3DModule.calTotalPage = true;
            const bounds: Rect = this.legend3DModule.legendBounds;
            this.legend3DModule.renderLegend(this, this.legendSettings, bounds);
        }
        if (!this.redraw) {
            this.element.appendChild(this.svgObject);
        }
    }

    /**
     * To set the left and top position for secondary element in chart.
     *
     * @returns {void}
     */
    private setSecondaryElementPosition(): void {
        const element: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect = getElement(this.svgId).getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }

    /**
     * Initializes module-specific elements and settings for the chart.
     *
     * @returns {void}
     */
    private initializeModuleElements(): void {
        this.dataLabelCollections = [];
        const elementId: string = this.element.id;
        if (this.series.length) {
            this.seriesElements = this.svgRenderer.createGroup({ id: elementId + 'SeriesCollection' });
        }
        this.dataLabelElements = this.renderer.createGroup({ id: elementId + 'DataLabelCollection' });
    }

    /**
     * Renders elements specific to chart series.
     *
     * @returns {void}
     */
    private createSeriesElements(): void {
        // Initialize the series elements values
        this.initializeModuleElements();
        const elementId: string = this.element.id;
        const tooltipDiv: Element = redrawElement(this.redraw, elementId + '_Secondary_Element') ||
            this.createElement('div');
        tooltipDiv.id = elementId + '_Secondary_Element';
        (tooltipDiv as HTMLElement).style.cssText = 'position: relative';
        appendChildElement(false, this.element, tooltipDiv, this.redraw);
        // For userInteraction
        if (this.tooltip.enable) {
            appendChildElement(
                false, this.svgObject, this.renderer.createGroup(
                    { id: elementId + '_UserInteraction', style: 'pointer-events:none;' }
                ),
                this.redraw
            );
        }
    }

    /**
     * Renders the chart title.
     *
     * @returns {void}
     */
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
            const borderOptions: Chart3DBoderElements = {
                'id': this.element.id + '-chart-title-border',
                'x': positionX - (getAnchor === 'middle' ? (elementSize.width / 2) + elementSpacing : getAnchor === 'end' ? elementSize.width + elementSpacing : elementSpacing),
                'y': positionY - elementSize.height + (elementSize.height / 4),
                'rx': this.titleStyle.border.cornerRadius,
                'ry': this.titleStyle.border.cornerRadius,
                'width': elementSize.width + (elementSpacing * 2),
                'height': elementSize.height * this.titleCollection.length,
                'fill': this.titleStyle.background,
                'stroke-width': borderWidth,
                'stroke': this.titleStyle.border.color,
                'transform': rotation ? rotation : ''
            };
            const htmlObject: Element = redrawElement(this.redraw, this.element.id + '-chart-title-border', borderOptions, this.renderer)
                || this.renderer.drawRectangle(borderOptions);
            appendChildElement(false, this.svgObject, htmlObject, this.redraw);
            const options: TextOption = new TextOption(
                this.element.id + '-chart-title',
                positionX, positionY,
                getAnchor, this.titleCollection, rotation, 'auto'
            );
            const element: Element = redrawElement(this.redraw, this.element.id + '-chart-title', options, this.renderer) ||
                textElement(
                    this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitleFont.color, this.svgObject,
                    null, null, null, null, null, null, null, null, false, null, this.themeStyle.chartTitleFont
                );
            if (element) {
                element.setAttribute('tabindex', '0');
                element.setAttribute('class', 'e-chart-focused');
            }
            if (this.subTitle) {
                this.renderSubTitle(options);
            }
        }
    }

    /**
     * Renders the chart sub title.
     *
     * @param {TextOption} options - Specifies the text option.
     * @returns {void}
     */
    private renderSubTitle(options: TextOption): void {
        let maxWidth: number = 0;
        let titleWidth: number = 0;
        const padding: number = 10;
        const alignment: Alignment = this.titleStyle.textAlignment;
        for (const titleText of this.titleCollection) {
            titleWidth = measureText(titleText, this.titleStyle, this.themeStyle.chartSubTitleFont).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        const subTitleElementSize: Size = measureText(this.subTitleCollection.
            reduce((a: string, b: string): string => (a.length > b.length ? a : b)),
                                                      this.subTitleStyle, this.themeStyle.chartSubTitleFont);
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
        const borderOptions: Chart3DBoderElements = {
            'id': this.element.id + '-chart-sub-title-border',
            'x': titlePositionX(rect, this.subTitleStyle) - (getAnchor === 'middle' ? (subTitleElementSize.width / 2) + padding / 2 : getAnchor === 'end' ? subTitleElementSize.width + padding / 2 : padding / 2),
            'y': positionY - subTitleElementSize.height + (subTitleElementSize.height / 4),
            'rx': this.subTitleStyle.border.cornerRadius,
            'ry': this.subTitleStyle.border.cornerRadius,
            'width': subTitleElementSize.width + padding,
            'height': subTitleElementSize.height * this.subTitleCollection.length,
            'fill': this.subTitleStyle.background,
            'stroke-width': this.subTitleStyle.border.width,
            'stroke': this.subTitleStyle.border.color,
            'transform': options.transform
        };
        const htmlObject: Element = redrawElement(this.redraw, this.element.id + '-chart-sub-title-border', borderOptions, this.renderer)
            || this.renderer.drawRectangle(borderOptions);
        appendChildElement(false, this.svgObject, htmlObject, this.redraw);
        const subTitleOptions: TextOption = new TextOption(
            this.element.id + '-chart-sub-title',
            titlePositionX(
                rect, this.subTitleStyle
            ),
            positionY,
            getTextAnchor(this.subTitleStyle.textAlignment, this.enableRtl), this.subTitleCollection, options.transform, 'auto'
        );
        const element: Element = redrawElement(this.redraw, this.element.id + '-chart-sub-title', subTitleOptions, this.renderer) ||
            textElement(
                this.renderer, subTitleOptions, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartSubTitleFont.color,
                this.svgObject, null, null, null, null, null, null, null, null, false, null, this.themeStyle.chartSubTitleFont
            );
    }

    /**
     * Renders the chart border.
     *
     * @returns {void}
     */
    private renderBorder(): void {
        const x: number = 0;
        const y: number = 0;
        const width: number = this.border.width;
        const backGroundImage: string = this.backgroundImage;
        const fillColor: string = backGroundImage ? 'transparent' : (this.background || this.themeStyle.background);
        const rect: RectOption = new RectOption(
            this.element.id + '-chart-border', fillColor, this.border, 1,
            new Rect(width * 0.5 + x, width * 0.5 + y, this.availableSize.width - width, this.availableSize.height - width), 0, 0, '', this.border.dashArray);

        this.htmlObject = redrawElement(this.redraw, this.element.id + '-chart-border', rect, this.renderer) as HTMLElement
            || this.renderer.drawRectangle(rect) as HTMLElement;
        this.htmlObject.setAttribute('aria-hidden', 'true');

        appendChildElement(false, this.svgObject, this.htmlObject, this.redraw);
        // to draw back ground image for chart
        if (backGroundImage) {
            const image: ImageOption = new ImageOption(
                this.availableSize.height - width,
                this.availableSize.width - width,
                backGroundImage,
                0, 0,
                this.element.id + '-chart-background',
                'visible', 'none'
            );
            this.htmlObject = redrawElement(this.redraw, this.element.id + '-chart-background', image, this.renderer) as HTMLElement
                || this.renderer.drawImage(image) as HTMLElement;
            appendChildElement(false, this.svgObject, this.htmlObject, this.redraw);
        }
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
        let series: Chart3DSeriesModel[] = this.series;
        let moduleName: string;
        let dataLabelEnable: boolean = false;
        if (this.tooltip.enable) {
            modules.push({
                member: 'Tooltip3D',
                args: [this]
            });
        }
        series.map((value: Chart3DSeries) => {
            this.isLegend = (this.legendSettings.visible && ((value.name !== '') || !!this.isLegend));
            moduleName = value.type.indexOf('100') !== -1 ? value.type.replace('100', '') + 'Series3D' : value.type + 'Series3D';
            dataLabelEnable = value.dataLabel.visible || dataLabelEnable;
            if (!modules.some((currentModule: ModuleDeclaration) => {
                return currentModule.member === moduleName;
            })) {
                modules.push({
                    member: moduleName,
                    args: [this, series]
                });
            }
        });
        if (dataLabelEnable) {
            modules.push({
                member: 'DataLabel3D',
                args: [this, series]
            });
        }
        modules = this.findAxisModule(modules);
        if (this.isLegend) {
            modules.push({
                member: 'Legend3D',
                args: [this]
            });
        }
        if (this.enableExport) {
            modules.push({
                member: 'Export3D',
                args: [this]
            });
        }
        if (this.selectionMode !== 'None') {
            modules.push({
                member: 'Selection3D',
                args: [this]
            });
        }
        if (this.highlightMode !== 'None' || this.legendSettings.enableHighlight) {
            modules.push({
                member: 'Highlight3D',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * Finds axis modules within a collection of module declarations.
     *
     * @param {ModuleDeclaration[]} modules - The collection of module declarations to search for axis modules.
     * @returns {ModuleDeclaration[]} - An array of module declarations representing axis modules.
     */
    private findAxisModule(modules: ModuleDeclaration[]): ModuleDeclaration[] {
        let axisCollections: Chart3DAxisModel[] = [];
        axisCollections.push(this.primaryXAxis);
        axisCollections.push(this.primaryYAxis);
        axisCollections = axisCollections.concat(this.axes);
        let datetimeEnabled: boolean = false;
        let categoryEnabled: boolean = false;
        let logarithmicEnabled: boolean = false;
        let dateTimeCategoryEnabled: boolean = false;
        for (let axis of axisCollections) {
            datetimeEnabled = axis.valueType === 'DateTime' || datetimeEnabled;
            categoryEnabled = axis.valueType === 'Category' || categoryEnabled;
            logarithmicEnabled = axis.valueType === 'Logarithmic' || logarithmicEnabled;
            dateTimeCategoryEnabled = axis.valueType === 'DateTimeCategory' || dateTimeCategoryEnabled;
        }
        if (datetimeEnabled) {
            modules.push({
                member: 'DateTime3D',
                args: [this]
            });
        }
        if (categoryEnabled) {
            modules.push({
                member: 'Category3D',
                args: [this]
            });
        }
        if (logarithmicEnabled) {
            modules.push({
                member: 'Logarithmic3D',
                args: [this]
            });
        }
        if (dateTimeCategoryEnabled) {
            modules.push({
                member: 'DateTimeCategory3D',
                args: [this]
            });
        }
        return modules;
    }
 
    /**
     * Sets the theme for the chart.
     */
    private setTheme(): void {
        /*! Set theme */
        this.themeStyle = get3DThemeColor(this.theme);
        if (!(document.getElementById(this.element.id + 'Keyboard_chart_focus'))) {
            const style: HTMLStyleElement = document.createElement('style');
            style.setAttribute('id', (<HTMLElement>this.element).id + 'Keyboard_chart_focus');
            style.innerText = '.e-chart-focused:focus, path[class*=_ej2_chart_selection_series]:focus,' +
                'path[id*=-point-]:focus, text[id*=-chart-title]:focus {outline: none } .e-chart-focused:focus-visible, path[class*=_ej2_chart_selection_series]:focus-visible,' +
                'path[id*=-point-]:focus-visible, text[id*=-chart-title]:focus-visible {outline: 1.5px ' + this.themeStyle.tabColor + ' solid}';
            document.body.appendChild(style);
        }
    }

    /**
     * Renders the three-dimensional chart, creating a 3D visualization.
     *
     * The function sets up a 3D perspective, depth, rotation, and tilt to create a 3D visualization of the chart.
     */
    private render3DChart(): void {
        let chart = this;
        this.chart3D = chart.svgRenderer.createGroup({ 'id': chart.element.id + '-svg-chart-3d' });
        this.chart3D.setAttribute('role', 'region');
        this.chart3D.setAttribute('aria-hidden', 'false');
        this.draw3DAxis();
        this.wallRender.update3DWall(chart);
        this.renderSeries();
        appendChildElement(false, chart.svgObject, chart.chart3D, chart.redraw);
        let size: Size = new Size(chart.availableSize.width, chart.availableSize.height);
        this.graphics.prepareView(this.perspectiveAngle, this.depth, this.rotation, this.tilt, size, this);
        this.graphics.view(this.svgObject, this);
    }
    /**
     * Draws three-dimensional axes for the chart.
     *
     */
    private draw3DAxis(): void {
        for (let i: number = 0; i < this.axisCollections.length; i++) {
            this.axisRender.drawAxes(i, this.axisCollections[i as number], this);
        }
    }

    /**
     * Renders chart series elements.
     * 
     * @private
     */
    public renderSeries(): void {
        let visibility: boolean;
        for (const item of this.visibleSeries) {
            visibility = item.visible;
            if (visibility) {
                this.visible++;
                item.renderSeries(this);
            }
        }
        this.visible = 0;
    }

    /**
     * Initializes the configuration for an axis within a three-dimensional chart series.
     *
     * @param {Chart3DSeries} series - The series to which the axis belongs.
     * @param {Chart3DAxis} axis - The axis to be configured and initialized.
     * @param {boolean} isSeries - Indicates whether the axis configuration is for the series.
     */
    private initAxis(series: Chart3DSeries, axis: Chart3DAxis, isSeries: boolean): void {
        if (series.xAxisName === axis.name || (series.xAxisName == null && axis.name === 'primaryXAxis')) {
            axis.orientation = this.requireInvertedAxis ? 'Vertical' : 'Horizontal';
            series.xAxis = axis;
            if (isSeries) { axis.series.push(series as Chart3DSeries); }
        } else if (series.yAxisName === axis.name || (series.yAxisName == null && axis.name === 'primaryYAxis')) {
            axis.orientation = this.requireInvertedAxis ? 'Horizontal' : 'Vertical';
            series.yAxis = axis;
            if (isSeries) { axis.series.push(series as Chart3DSeries); }
        }
    }

    /**
     * Calculate the visible axis.
     *
     * @private
     */
    private calculateVisibleAxis(): void {
        let axis: Chart3DAxis;
        let axes: Chart3DAxisModel[] = [this.primaryXAxis, this.primaryYAxis];
        axes = axes.concat(this.axes);
        this.axisCollections = [];
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            axis = <Chart3DAxis>axes[i as number]; axis.series = [];
            axis.labels = []; axis.indexLabels = {};
            axis.orientation = (i === 0) ? (this.requireInvertedAxis ? 'Vertical' : 'Horizontal') :
                (i === 1) ? (this.requireInvertedAxis ? 'Horizontal' : 'Vertical') : axis.orientation;
            for (const series of this.visibleSeries) {
                this.initAxis(series, axis, true);
            }
            if (axis.orientation != null) {
                this.axisCollections.push(axis);
            }
        }
        if (this.rows.length > 0 && this.columns.length > 0) {
            this.chartAxisLayoutPanel.measure();
        }
    }

    /**
     * Unbinding events from the element while component destroy.
     *
     * @hidden
     * @returns {void}
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

    /**
     * Binding events to the element while component creation.
     *
     * @hidden
     * @returns {void}
     */
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

        /*! Apply the style for chart */
        this.setStyle(<HTMLElement>this.element);
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
     * Handles the mouse click on chart.
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnMouseClick(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        const chart: Chart3D = this;
        this.clickCount++;
        let timeInterval: number = 400;
        if (this.clickCount === 1) {
            this.singleClickTimer = +setTimeout(function () {
                chart.clickCount = 0;
                chart.trigger('chart3DMouseClick', { target: element.id, x: chart.mouseX, y: chart.mouseY });
            }, timeInterval);
        }
        else if (this.clickCount === 2) {
            clearTimeout(this.singleClickTimer);
            this.clickCount = 0;
        }
        const isAngular: string = 'isAngular';
        if (this[isAngular as string]) {
            const observers: string = 'observers';
            timeInterval = 0;
        } else {
            timeInterval = 0;
        }
        if (this.clickCount === 1 && this.pointClick) {
            this.singleClickTimer = +setTimeout(
                (): void => {
                    this.clickCount = 0;
                    this.triggerPointEvent(pointClick, e);
                },
                timeInterval);
        }
        this.notify('click', e);
        return false;
    }
    
    /**
     * Export method for the chart.
     */
    public export(type: ExportType, fileName: string): void {
        if (this.export3DModule) {
            this.export3DModule.export(type, fileName);
            if (this.afterExport) {
                this.export3DModule.getDataUrl(this);
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
        const arg: Chart3DResizeEventArgs = {
            chart:  this,
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            )
        };
        const beforeResizeArgs: Chart3DBeforeResizeEventArgs = { cancel: false };
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
                    this.createChartSvg();
                    arg.currentSize = this.availableSize;
                    this.trigger(resized, arg);
                    this.polygons = [];
                    this.refreshAxis();
                    this.refreshBound();
                    this.trigger('loaded', { chart: this });
                },
                500);
        }
        return false;
    }

    /**
     * Triggers a point-specific event with the specified event type and event data.
     *
     * @param {string} event - The type of event to trigger.
     * @param {PointerEvent | TouchEvent} [e] - (Optional) The event data associated with the triggered event.
     */
    private triggerPointEvent(event: string, e?: PointerEvent | TouchEvent): void {
        const evt: PointerEvent = e as PointerEvent;
        let series: Chart3DSeries = null; let point: Chart3DPoint = null;
        let index: string[] | null;
        let pointIndex: number | undefined;
        let seriesIndex: number | undefined;
        const targetElement: HTMLElement = evt.target as HTMLElement;
        if (targetElement) {
            const nodeName: string | null = targetElement.nodeName;
            if ((nodeName === 'path' || nodeName === 'shape') && targetElement.id.indexOf('-region-') > 1) {
                index = targetElement.id.match(/(\d+)/g);
                pointIndex = parseInt(index[index.length - 1].toString(), 10);
                seriesIndex = parseInt(index[index.length - 2].toString(), 10);
            }
            if (!isNullOrUndefined(seriesIndex)) {
                series = this.visibleSeries[seriesIndex as number];
            }
            if (series && series.visible) {
                point = series.points[pointIndex as number];
            }
        }
        if (series && point) {
            this.trigger(event, {
                series: series,
                point: point,
                seriesIndex: seriesIndex, pointIndex: pointIndex,
                x: this.mouseX, y: this.mouseY,
            });
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
        this.trigger('chart3DMouseDown', { target: element.id, x: this.mouseX, y: this.mouseY });
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
        if (this.enableRotation) {
            if (this.isTouch && this.tooltip3DModule && this.tooltip3DModule.svgTooltip) {
                this.tooltip3DModule.svgTooltip.fadeOut();
            }
            this.rotateActivate = true;
            this.previousCoords = { x: this.mouseDownX, y: this.mouseDownY };
        }
        this.notify(Browser.touchStartEvent, e);
        return false;
    }

    /**
     * Handles the mouse move on chart.
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
     * Handles the mouse leave on chart.
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
     * Handles the mouse up on chart.
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
     * Handles the mouse up on chart.
     *
     * @returns {boolean}
     * @private
     */
    public chartOnMouseUp(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger('chart3DMouseUp', { target: element.id, x: this.mouseX, y: this.mouseY });
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
            this.axisTooltip(e, this.mouseX, this.mouseY, this.isTouch);
        }
        this.notify(Browser.touchEndEvent, e);
        this.rotateActivate = false;
        this.delayRedraw = false;
        return false;
    }

    /**
     * Prints the chart in the page. 
     * 
     * @param {string[] | string | Element} id - The id of the chart to be printed on the page. 
     */
    public print(id?: string[] | string | Element): void {
        const printChart: PrintUtils  = new PrintUtils(this);
        printChart.print(id);
    }

    /**
     * Handles the mouse move on chart.
     *
     * @returns {boolean} false
     * @private
     */
    private chartOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        this.trigger('chart3DMouseMove', { target: element.id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, e);
        }
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
            this.axisTooltip(e, this.mouseX, this.mouseY);
        }
        if (this.rotateActivate && withInBounds(this.mouseX, this.mouseY, this.chartAxisLayoutPanel.seriesClipRect)) {
            let difX: number = this.previousCoords.x - this.mouseX;
            let difY: number = this.previousCoords.y - this.mouseY;
            if (difX || difY) {
                this.tilt -= difY;
                this.rotation += difX;
                if (!this.isTouch) {
                    const grpElement: Element = document.getElementById(this.chart3D.id);
                    grpElement.innerHTML = '';
                    grpElement.remove();
                }
                else {
                    document.querySelectorAll("[id*=\"axis-label-" + "\"]").forEach(function (axisElement) { return axisElement.remove(); });
                    this.delayRedraw = true;
                }
                let size: Size = { width: this.availableSize.width, height: this.availableSize.height };
                this.graphics.view(this.svgObject, this, this.rotation, this.tilt, size, this.perspectiveAngle, this.depth);
                appendChildElement(false, this.svgObject, this.chart3D, this.redraw);
                this.previousCoords.y = this.mouseY;
                this.previousCoords.x = this.mouseX;
                this.isRemove = false;
            }
        }
        this.notify(Browser.touchMoveEvent, e);
        this.isTouch = false;
        return false;
    }

    /**
     * Displays a tooltip for a title or element at the specified coordinates.
     *
     * @param {Event} event - The event triggering the tooltip display.
     * @param {number} x - The X-coordinate for the tooltip.
     * @param {number} y - The Y-coordinate for the tooltip.
     * @param {boolean} [isTouch] - (Optional) Indicates whether the event was triggered by a touch input.
     */
    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        const id: boolean = (targetId === (this.element.id + '-chart-title') || targetId === (this.element.id + '-chart-sub-title') ||
            targetId.indexOf('-axis-title') > -1 || targetId.indexOf('_legend_title') > -1);
        let index: number = 0;
        if (targetId.indexOf('-axis-title') > -1) {
            index = parseInt(((targetId.replace(this.element.id + '-svg', '')).replace('-axis-title', '')).split('-')[1], 10);
        }
        if (id && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            const title: string = (targetId === (this.element.id + '-chart-title')) ? this.title :
                targetId.indexOf('-axis-title') > -1 ? this.axisCollections[index as number].title :
                    targetId.indexOf('-chart-sub-title') > -1 ? this.subTitle : this.legendSettings.title;
            showTooltip(
                title, x, y, this.element.offsetWidth, this.element.id + '-EJ2-title-tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch
            );
        } else {
            removeElement(this.element.id + '-EJ2-title-tooltip');
        }
    }

    /**
     * To find mouse x, y coordinate for the chart.
     * 
     * @param {number} pageX - Specifies the x value of the pageX.
     * @param {number} pageY - Specifies the y value of the pageY.
     * @returns {void}
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
     * Handles the mouse leave on chart.
     *
     * @returns {boolean} false
     * @private
     */
    public chartOnMouseLeave(e: PointerEvent | TouchEvent): boolean {
        const element: Element = <Element>e.target;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.trigger('chart3DMouseLeave', { target: element.id, x: this.mouseX, y: this.mouseY });
        removeElement(this.element.id + '-EJ2-axis-label-tooltip');
        this.isPointMouseDown = false;
        this.notify(cancelEvent, e);
        this.rotateActivate = false;
        this.delayRedraw = false;
        return false;
    }
    
    /**
     * Handles the 'onkeydown' keyboard event on the chart.
     *
     * @param {KeyboardEvent} e - Specifies the keydown event arguments.
     * @returns {boolean}
     * @private
     */
    public chartKeyDown(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        if (e.code === 'Space') {
            e.preventDefault();
        }
        if (this.tooltip.enable && ((e.code === 'Tab' && this.previousTargetId.indexOf('-series') > -1) || e.code === 'Escape')) {
            actionKey = 'ESC';
        }
        if (this.highlightMode !== 'None' && e.code === 'Tab' && this.previousTargetId.indexOf('_chart_legend_') > -1) {
            if (this.highlight3DModule) {
                this.highlight3DModule.removeLegendHighlightStyles();
            }
        }

        if (e.ctrlKey && (e.key === 'p')) {
            e.preventDefault();
            actionKey = 'CtrlP';
        }

        if (actionKey !== '')
            this.chartKeyboardNavigations(e, (e.target as HTMLElement).id, actionKey);

        return false;
    }

    /**
     *Handles the 'onkeyup' keyboard event on the chart..
     *
     * @param {KeyboardEvent} e - Specifies the keyup event arguments.
     * @returns {boolean} false
     * @private
     */
    public chartKeyUp(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        let targetId: string = e.target['id'];
        let groupElement: HTMLElement;
        const targetElement: HTMLElement = e.target as HTMLElement;
        const titleElement: HTMLElement = getElement(this.element.id + '-chart-title') as HTMLElement;
        const seriesElement: HTMLElement = getElement(this.element.id + '-svg-0-region-series-0-point-0') as HTMLElement;
        const legendElement: HTMLElement = getElement(this.element.id + '_chart_legend_translate_g') as HTMLElement;
        const pagingElement: HTMLElement = getElement(this.element.id + '_chart_legend_pageup') as HTMLElement;

        if (titleElement) { titleElement.setAttribute('class', 'e-chart-focused'); }
        if (seriesElement) {
            let className: string = seriesElement.getAttribute('class');
            if (className && className.indexOf('e-chart-focused') === -1) {
                className = className + ' e-chart-focused';
            } else if (!className) {
                className = 'e-chart-focused';
            }
            seriesElement.setAttribute('class', className);
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
                if ((this.previousTargetId.indexOf('-series-') > -1 && targetId.indexOf('-series-') === -1)) {
                    const previousElement: Element = getElement(this.element.id + '-svg-0-region-series-' + this.currentSeriesIndex +'-point-' + this.currentPointIndex);
                    this.setTabIndex(previousElement as HTMLElement, seriesElement as HTMLElement);
                    this.currentPointIndex = 0;
                    this.currentSeriesIndex = 0;
                }
                else if (this.previousTargetId.indexOf('_chart_legend_page') > -1 && targetId.indexOf('_chart_legend_page') === -1
                    && targetId.indexOf('_chart_legend_g_') === -1) {
                    this.setTabIndex(e.target as HTMLElement, getElement(this.element.id + '_chart_legend_pageup') as HTMLElement);
                }
                else if (this.previousTargetId.indexOf('_chart_legend_g_') > -1 && targetId.indexOf('_chart_legend_g_') === -1) {
                    groupElement = getElement(this.element.id + '_chart_legend_translate_g') as HTMLElement;
                    this.setTabIndex(groupElement.children[this.currentLegendIndex] as HTMLElement, groupElement.firstElementChild as HTMLElement);
                }
            }
            this.previousTargetId = targetId;
            if (targetId.indexOf('-series-') > -1) {
                this.currentSeriesIndex =  +(targetId.split('-series-')[1].split('-point-')[0]);
                targetElement.removeAttribute('tabindex');
                targetElement.blur();
                targetId = this.focusChild(targetElement);
            }
            actionKey = this.highlightMode !== 'None' || this.tooltip.enable ? 'Tab' : '';
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
                targetId = currentLegend.children[1].id;
                actionKey = this.highlightMode !== 'None' ? 'ArrowMove' : '';
            }
            else if (targetId.indexOf('-series-') > -1) {
                let currentPoint: Element = e.target as Element;
                targetElement.removeAttribute('tabindex');
                targetElement.blur();

                if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                    this.currentSeriesIndex = this.currentSeriesIndex + (e.code === 'ArrowRight' ? 1 : -1);
                    this.currentSeriesIndex = this.getActualIndex(this.currentSeriesIndex, this.series.length);
                }
                else {
                    this.currentPointIndex += e.code === 'ArrowUp' ? 1 : -1;
                }
                if (targetId.indexOf('-point-') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex, this.visibleSeries[this.currentSeriesIndex].points.length ? this.currentSeries.points.length : 1);
                    const pointElements: NodeListOf<Element> = document.querySelectorAll('[id*="svg-0-region-series-' + this.currentSeriesIndex + '-point-' +
                        this.currentPointIndex + '"]');
                    for (let i = 0; i < pointElements.length; i++) {
                        if (pointElements[i as number].id.split('-point-')[1].split('-')[0] === this.currentPointIndex.toString()) {
                            currentPoint = pointElements[i as number];
                        }
                    }
                }
                targetId = this.focusChild(currentPoint as HTMLElement);
                actionKey = this.tooltip.enable || this.highlightMode !== 'None' ? 'ArrowMove' : '';
            }
        }
        else if ((e.code === 'Enter' || e.code === 'Space') && ((targetId.indexOf('_chart_legend_') > -1) ||
            (targetId.indexOf('-point-') > -1))) {
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
     * Sets the tabindex for the current element and removes it from the previous element.
     *
     * @param {HTMLElement} previousElement - The element whose tabindex should be removed.
     * @param {HTMLElement} currentElement - The element to which tabindex should be set.
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
      * Calculates the actual index considering boundary conditions within a given range.
      *
      * @param {number} index - The index to be adjusted.
      * @param {number} totalLength - The total length or maximum allowed index value.
      * @returns {number} - The adjusted index within the valid range.
      */
    private getActualIndex(index: number, totalLength: number): number {
        return index > totalLength - 1 ? 0 : (index < 0 ? totalLength - 1 : index);
    }

    /**
     *  Used to configure tooltips for the chart's axes.
     * 
     * @private
     * @param {Event} event - Specifies the event args.
     * @param {number} x - Specifies the x value.
     * @param {number} y - Specifies the y value.
     * @param {boolean} isTouch - Specifies the boolean value.
     * @description - Handles the axis tooltip.
     * 
     */
    private axisTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        if ((targetId.indexOf('axis-label') > -1) &&
            ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            const isTitleOrLegendEnabled: boolean = (this.legendSettings.visible || this.primaryXAxis.title === '');
            showTooltip(
                this.findAxisLabel(targetId), x, y, this.element.offsetWidth, this.element.id + '-EJ2-axis-label-tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch, isTitleOrLegendEnabled
            );
        } else {
            removeElement(this.element.id + '-EJ2-axis-label-tooltip');
        }
    }

    /**
     * Searches for an axis label based on the provided text.
     *
     * @param {string} text - The text to search for within the axis label collection.
     * @returns {string} - The matching axis label, or an empty string if no match is found.
     */
    private findAxisLabel(text: string): string {
        let texts: string[];
        texts = ((text.replace(this.element.id + '-', '')).replace('-axis-label', '')).split('-');
        return this.axisCollections[parseInt(texts[0], 10)].visibleLabels[parseInt(texts[1], 10)].originalText;
    }

    /**
     * Sets focus on a child element within the parent element.
     * 
     * @param {HTMLElement} element - The parent element containing the child to be focused.
     * @returns {string} - A message indicating the result of the focus operation.
     */
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
     * Handles the document onkey.
     *
     * @param {KeyboardEvent} e - The keyboard event triggering the navigation.
     * @private
     */
    private documentKeyHandler(e: KeyboardEvent): void {
        if (e.altKey && e.keyCode === 74 && !isNullOrUndefined(this.element)) {
            this.element.focus();
        }
    }

   /**
    * Handles chart keyboard navigation events.
    * 
    * @param {KeyboardEvent} e - The keyboard event triggering the navigation.
    * @param {string} targetId - The ID of the target element or chart component.
    * @param { string} actionKey - - The type of keyboard action (e.g., 'Tab' or 'ArrowMove').
    */
    private chartKeyboardNavigations(e: KeyboardEvent, targetId: string, actionKey: string): void {
        this.isLegendClicked = false;
        switch (actionKey) {
            case 'Tab':
            case 'ArrowMove':
                if (this.highlight3DModule) {
                    this.highlight3DModule.removeLegendHighlightStyles();
                }
                if (targetId.indexOf('-point-') > -1) {
                    if (document.activeElement) {
                        const element = document.activeElement;
                        const rect = element.getBoundingClientRect();
                        // Client coordinates (relative to the viewport)
                        const clientX = rect.left + rect.width / 2;
                        const clientY = rect.top;
                        // Page coordinates (relative to the whole document)
                        const pageX = window.scrollX + clientX;
                        const pageY = window.scrollY + clientY;
                        this.mouseX = pageX;
                        this.mouseY = pageY;
                    }
                    if (this.highlight3DModule) {
                        this.highlight3DModule.highlightChart(document.getElementById(targetId), 'mousemove');
                        this.highlight3DModule.completeSelection(document.getElementById(targetId), 'mousemove');
                    }
                    if (this.tooltip3DModule) {
                        const data = { series: this.visibleSeries[targetId.split('-series-')[1].split('-point-')[0]], point: this.visibleSeries[targetId.split('-series-')[1].split('-point-')[0]].points[targetId.split('-point-')[1].split('-')[0]] }
                        const svgElement: HTMLElement = document.getElementById(this.element.id + '_tooltip_svg');
                        const isFirst: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
                        const tooltipDiv: HTMLDivElement = this.tooltip3DModule.getTooltipElement(isFirst);
                        if (this.tooltip3DModule.pushData((data as Point3D), !isFirst, tooltipDiv, true)) {
                        this.tooltip3DModule.triggerTooltipRender(data, !isFirst, this.tooltip3DModule.getTooltipText(data), this.tooltip3DModule.findHeader(data));
                        }
                    }
                }
                if (this.highlight3DModule && this.highlightMode !== 'None') {
                    targetId = targetId.indexOf('_chart_legend_g_') > -1 ? document.getElementById(targetId).firstChild['id'] : targetId;
                    const legendID: string = this.element.id + '_chart_legend';
                    const legendItemsId: string[] = [legendID + '_text_', legendID + '_shape_marker_',
                    legendID + '_shape_'];
                    for (let i: number = 0; i < legendItemsId.length; i++) {
                        const id: string = legendItemsId[i as number];
                        if (targetId.indexOf(id) > -1) {
                            document.getElementById(targetId).setAttribute('class', '');
                            this.highlight3DModule.legendSelection(this, parseInt(targetId.split(id)[1], 10),
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
                    this.legend3DModule.click(e as Event);
                    this.focusChild(document.getElementById(targetId).parentElement);
                } else {
                    this.selection3DModule.calculateSelectedElements(document.getElementById(targetId), 'click');
                }
                break;
            case 'CtrlP':
                this.print();
                break;
            case 'ESC':
                this.tooltip3DModule.removeTooltip(1);
                break;
        }

    }

    /**
     *  Applys the style for chart.
     * 
     * @private
     * @param {HTMLElement} element - Specifies the element.
     */
    private setStyle(element: HTMLElement): void {
        const disableScroll: boolean = this.selectionMode !== 'None' || this.highlightMode !== 'None';
        element.style.touchAction = this.enableRotation || disableScroll ? 'none' : 'element';
        element.style.msTouchAction = disableScroll ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        element.style.overflow = 'hidden';
        element.style.height = (element.style.height || (this.height && this.height.indexOf('%') === -1)) ? element.style.height : 'inherit';
    }

    /**
     * The method to determine whether it is a secondary axis or not.
     *  
     * @private
     * @param  {Chart3DAxis} axis 
     * @returns {boolean}
     * 
     */
    public isSecondaryAxis(axis: Chart3DAxis): boolean {
        return ((this as Chart3D).axes.indexOf(axis) > -1);
    }

    /**
     * To refresh the rows and columns.
     *
     * @param {Chart3DRow[] | Chart3DColumn} definitions - Specifies the row or column definition.
     */
    private refreshDefinition(definitions: Chart3DRow[] | Chart3DColumn[]): void {
        for (let item of definitions) {
            item.axes = [];
        }
    }

    /**
     * Adds new series to the chart
     *
     * @param {Chart3DSeriesModel[]} seriesCollection - The series collection to be added to the chart. 
     */
    public addSeries(seriesCollection: Chart3DSeriesModel[]): void {
        this.animateSeries = false;
        for (let series of seriesCollection) {
            series = new Chart3DSeries(this, 'series', series);
            this.series.push(series);
        }
        this.refresh();
    }

    /**
     * Removes a series from the chart
     *
     * @param {number} index - The index of the series to be removed from the chart.
     */
    public removeSeries(index: number): void {
        this.redraw = false;
        this.animateSeries = false;
        if (this.visibleSeries[index as number]) {
            this.visibleSeries[index as number].xAxis.orientation = null;
            this.visibleSeries[index as number].yAxis.orientation = null;
        }
        for (let i: number = 0; i < this.axes.length; i++) {
            if ((this.axes[i as number] as Chart3DAxis).orientation === null) {
                this.axes.splice(i, 1);
            }
        }
        this.series.splice(index, 1);
        this.refresh();
    }

    /**
     * Refresh the axis default value.
     *
     * @private
     */
    public refreshAxis(): void {
        let axis: Chart3DAxis = <Chart3DAxis>this.primaryXAxis;
        axis.rect = new Rect(undefined, undefined, 0, 0);
        axis = <Chart3DAxis>this.primaryYAxis;
        axis.isStack100 = false;
        axis.rect = new Rect(undefined, undefined, 0, 0);
        for (const item of this.axes) {
            axis = <Chart3DAxis>item;
            axis.rect = new Rect(undefined, undefined, 0, 0);
            axis.isStack100 = false;
        }
    }

    /**
     * Refresh the 3D chart axis.
     *
     * @param {Chart3DAxis} axis 
     * @returns {boolean}
     * @private
     */
    private axisChange(axis: Chart3DAxis): boolean {
        if (!axis.name && !axis.valueType) {
            return false;
        }
        this.refreshDefinition(<Chart3DColumn[]>this.columns);
        this.refreshDefinition(<Chart3DRow[]>this.rows);
        this.calculateVisibleAxis();
        this.processData();
        return true;
    }

    /**
     * Get visible series by index.
     */
    private getVisibleSeries(visibleSeries: Chart3DSeries[], index: number): Chart3DSeries {
        for (let series of visibleSeries) {
            if (index === series.index) {
                return series;
            }
        }
        return null;
    }

    /**
     * To remove style element.
     */
    private removeStyles(): void {
        removeElement(this.element.id + '_ej2_chart_selection');
        removeElement(this.element.id + '_ej2_chart_highlight');
    }

    /**
     * To find the 3D chart visible series.
     * 
     */
    private calculateVisibleSeries(): void {
        let series: Chart3DSeries;
        this.visibleSeries = [];
        const colors: string[] = this.palettes.length ? this.palettes : get3DSeriesColor(this.theme);
        const count: number = colors.length;
        const seriesCollection: Chart3DSeriesModel[] = this.series;
        const vibileSeries: Chart3DSeriesModel = this.series[0];
        if (vibileSeries) {
            this.requireInvertedAxis = ((vibileSeries.type.indexOf('Bar') !== -1) && !this.isTransposed) ||
                ((vibileSeries.type.indexOf('Bar') === -1) && this.isTransposed);
        }
        for (let i: number = 0, len: number = seriesCollection.length; i < len; i++) {
            series = <Chart3DSeries>seriesCollection[i as number];
            series.category = 'Series';
            series.index = i;
            series.interior = series.fill || colors[i % count];
            if (this.isSecondaryAxis(series.xAxis)) {
                series.xAxis.internalVisibility = series.xAxis.series.some((value) => (value.visible));
            }
            if (this.isSecondaryAxis(series.yAxis)) {
                series.yAxis.internalVisibility = series.yAxis.series.some((value) => (value.visible));
            }
            switch (series.type) {
                case 'Bar':
                case 'StackingBar':
                case 'StackingBar100':
                    if (seriesCollection[0].type.indexOf('Bar') === -1) {
                        continue;
                    } break;
                default:
                    if (seriesCollection[0].type.indexOf('Bar') > -1) {
                        continue;
                    }
                    break;
            }
            this.visibleSeries.push(series);
            seriesCollection[i as number] = series;
        }
    }

    public highlightAnimation(element: HTMLElement, index: number, duration: number, startOpacity: number): void {
        let endOpacity: number = parseFloat(this.visibleSeries[index as number].opacity.toString());
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

    public stopElementAnimation(element: HTMLElement, index: number) {
        let endOpacity: number = parseFloat(this.visibleSeries[index as number].opacity.toString());
        const animation = element.getAttribute('e-animate');
        if (animation) {
            Animation.stop(element);
        }
        element.setAttribute('opacity', endOpacity.toString());
    }

    /**
      * To destroy the widget
      *
      * @function destroy
      * @member of Chart
      */
    public destroy(): void {
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.visibleSeries = [];
        this.axisCollections = [];
        this.seriesElements = null;
        this.chartAxisLayoutPanel = null;
        this.dataLabelElements = null;
        this.dataLabelCollections = null;
        removeElement(this.element.id + 'Keyboard_chart_focus');
        removeElement(this.element.id + '_ej2_chart_highlight');
        removeElement('chartmeasuretext');
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
            if ((this as any).isReact) { this.clearTemplate(); }
            super.destroy();
            this.polygons = [];
            let grpElement: Element = document.getElementById(this.chart3D.id);
            if (grpElement) {
                grpElement.innerHTML = '';
                grpElement.remove();
            }
            this.removeSvg();
            this.svgObject = null;
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
     public getModuleName(): string {
        return 'chart3d';
    }

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
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: Chart3DModel, oldProp: Chart3DModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let axis: Chart3DAxis;
        this.animateSeries = false;
        if (!this.delayRedraw) {
            for (let prop of Object.keys(newProp)) {
                switch (prop) {
                    case 'primaryXAxis':
                        axis = <Chart3DAxis>newProp.primaryXAxis;
                        refreshBounds = this.axisChange(axis);
                        if (newProp.primaryXAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        refreshBounds = true;
                        if (!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                            (this.primaryXAxis as Chart3DAxis).setIsInversedAndOpposedPosition();
                        }
                        break;
                    case 'primaryYAxis':
                        axis = <Chart3DAxis>newProp.primaryYAxis;
                        refreshBounds = this.axisChange(axis);
                        if (newProp.primaryYAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        refreshBounds = true;
                        if (!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                            (this.primaryYAxis as Chart3DAxis).setIsInversedAndOpposedPosition();
                        }
                        break;
                    case 'axes':
                        for (let index of Object.keys(newProp.axes)) {
                            axis = newProp.axes[index] as Chart3DAxis;
                            refreshBounds = refreshBounds || this.axisChange(axis);
                            refreshBounds = true;
                            if (!isNullOrUndefined(axis.isInversed) || !isNullOrUndefined(axis.opposedPosition)) {
                                (this.axes[index] as Chart3DAxis).setIsInversedAndOpposedPosition()
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
                    case 'series':
                        let len: number = this.series.length;
                        let seriesRefresh: boolean = false;
                        let series: Chart3DSeriesModel;
                        for (let i: number = 0; i < len; i++) {
                            series = newProp.series[i];
                            if (series && (series.dataSource || series.query || series.xName ||
                                series.yName || series.size || series.fill || series.name || series.type)) {
                                extend(this.getVisibleSeries(this.visibleSeries, i), series, null, true);
                                seriesRefresh = true;
                            }
                        }
                        if (this.availableSize && this.element) {
                            this.element.style.height = (!this.element.style.height || this.element.style.height == 'inherit') ? (this.availableSize.height + 'px') : this.element.style.height;
                        }
                        if (seriesRefresh) {
                            this.calculateVisibleSeries();
                            this.refreshDefinition(<Chart3DColumn[]>this.columns);
                            this.refreshDefinition(<Chart3DRow[]>this.rows);
                            this.calculateVisibleAxis();
                            this.processData(false);
                            refreshBounds = true;
                        }
                        break;
                    case 'background':
                        renderer = true;
                        break;
                    case 'dataSource':
                        this.processData(false);
                        refreshBounds = true;
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
                        if (this.selection3DModule) {
                            this.selection3DModule.currentMode = this.selectionMode;
                            this.selection3DModule.selectedDataIndexes = this.selectedDataIndexes as Indexes[];
                            this.selection3DModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selection3DModule.redrawSelection(this, oldProp.selectionMode, true);
                        }
                        break;
                    case 'selectionMode':
                        if (this.selection3DModule && newProp.selectionMode && newProp.selectionMode.indexOf('Drag') === -1) {
                            this.selection3DModule.currentMode = this.selectionMode;
                            this.selection3DModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selection3DModule.redrawSelection(this, oldProp.selectionMode, true);
                        }
                        break;
                    case 'isMultiSelect':
                        if (this.selection3DModule && !newProp.isMultiSelect && this.selection3DModule.selectedDataIndexes.length > 1) {
                            this.selection3DModule.currentMode = this.selectionMode;
                            this.selection3DModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selection3DModule.redrawSelection(this, oldProp.selectionMode);
                        }
                        break;
                    case 'highlightMode':
                    case 'selectionPattern':
                    case 'highlightPattern':
                        this.removeStyles();
                        renderer = true;
                        break;
                    case 'theme':
                        this.animateSeries = true;
                        break;
                    case 'enableRtl':
                    case 'locale':
                    case 'currencyCode':
                        this.refresh();
                        break;
                    case 'tooltip':
                        if (this.tooltip3DModule) { // To check the tooltip enable is true.
                            this.tooltip3DModule.previousPoints = [];
                            if (this.tooltip.template) {
                                this.tooltip3DModule.template = this.tooltip.template;
                            }
                        }
                        break;
                    case 'enableRotation':
                    case 'tilt':
                    case 'depth':
                    case 'wallSize':
                    case 'rotation':
                    case 'perspectiveAngle':
                    case 'enableSideBySidePlacement':
                        renderer = true;
                        break;
                }
            }
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.polygons = [];
                this.renderElements();
                this.trigger('loaded', { chart: this });
            }
            if (refreshBounds) {
                this.removeSvg();
                if ((this as any).isReact) { this.clearTemplate(); }
                this.polygons = [];
                this.refreshAxis();
                this.refreshBound();
                this.trigger('loaded', { chart: this });
                this.redraw = false;
                this.animated = false;
            }
        }
    }
}
