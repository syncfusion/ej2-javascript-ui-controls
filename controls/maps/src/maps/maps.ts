/**
 * Maps Component file
 */
import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Fetch } from '@syncfusion/ej2-base';
import { EventHandler, Browser, EmitType, isNullOrUndefined, createElement, setValue, extend } from '@syncfusion/ej2-base';
import { Event, remove, L10n, Collection, Internationalization, Complex } from '@syncfusion/ej2-base';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Size, createSvg, Point, removeElement, triggerShapeEvent, showTooltip, checkShapeDataFields, MapLocation, getMousePosition, calculateSize } from './utils/helper';
import { getElement, removeClass, getTranslate, triggerItemSelectionEvent, mergeSeparateCluster, customizeStyle, querySelector } from './utils/helper';
import { createStyle } from './utils/helper';
import { ZoomSettings, LegendSettings } from './model/base';
import { LayerSettings, TitleSettings, Border, Margin, MapsAreaSettings, Annotation, CenterPosition } from './model/base';
import { ZoomSettingsModel, LegendSettingsModel, LayerSettingsModel, BubbleSettingsModel } from './model/base-model';
import { MarkerSettingsModel, SelectionSettingsModel, InitialMarkerSelectionSettingsModel } from './model/base-model';
import { TitleSettingsModel, BorderModel, MarginModel, CenterPositionModel, InitialShapeSelectionSettingsModel } from './model/base-model';
import { MapsAreaSettingsModel, AnnotationModel } from './model/base-model';
import { Bubble } from './layers/bubble';
import { Legend } from './layers/legend';
import { Marker } from './layers/marker';
import { Highlight } from './user-interaction/highlight';
import { Selection } from './user-interaction/selection';
import { MapsTooltip } from './user-interaction/tooltip';
import { Zoom } from './user-interaction/zoom';
import { load, click, onclick, rightClick, loaded, doubleClick, resize, shapeSelected, itemSelection, zoomIn } from './model/constants';
import { ProjectionType, MapsTheme, PanDirection, TooltipGesture } from './utils/enum';
import { MapsModel } from './maps-model';
import { getThemeStyle, Theme } from './model/theme';
import { ILoadEventArgs, ILoadedEventArgs, IMouseEventArgs, IResizeEventArgs, ITooltipRenderEventArgs } from './model/interface';
import { GeoPosition, ITooltipRenderCompleteEventArgs, ILegendRenderingEventArgs } from './model/interface';
import { ILayerRenderingEventArgs, IShapeRenderingEventArgs, IMarkerRenderingEventArgs, IMarkerClickEventArgs } from './model/interface';
import { IMarkerMoveEventArgs, ILabelRenderingEventArgs, IBubbleMoveEventArgs, IBubbleClickEventArgs } from './model/interface';
import { IMarkerClusterClickEventArgs, IMarkerClusterMoveEventArgs, IMarkerClusterRenderingEventArgs } from './model/interface';
import { ISelectionEventArgs, IShapeSelectedEventArgs, IMapPanEventArgs, IMapZoomEventArgs } from './model/interface';
import { IBubbleRenderingEventArgs, IAnimationCompleteEventArgs, IPrintEventArgs, IThemeStyle } from './model/interface';
import { LayerPanel } from './layers/layer-panel';
import { GeoLocation, Rect, RectOption, measureText, getElementByID, MapAjax, processResult, getElementsByClassName } from '../maps/utils/helper';
import { findPosition, textTrim, TextOption, renderTextElement, calculateZoomLevel, convertTileLatLongToPoint, convertGeoToPoint} from '../maps/utils/helper';
import { Annotations } from '../maps/user-interaction/annotation';
import { FontModel, DataLabel, MarkerSettings, IAnnotationRenderingEventArgs, IMarkerDragEventArgs } from './index';
import { NavigationLineSettingsModel, changeBorderWidth } from './index';
import { NavigationLine } from './layers/navigation-selected-line';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ExportType } from '../maps/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { Print } from './model/print';
import { PdfExport } from './model/export-pdf';
import { ImageExport } from './model/export-image';

/**
 * Represents the maps control. It is ideal for rendering maps from GeoJSON data or other map providers like OpenStreetMap, Google Maps, Bing Maps, etc that 
 * has rich feature set that includes markers, labels, bubbles and much more.
 * ```html
 * <div id="maps"/>
 * <script>
 *   var maps = new Maps();
 *   maps.appendTo("#maps");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Maps extends Component<HTMLElement> implements INotifyPropertyChanged {

    //Module Declaration of Maps.
    /**
     * Gets or sets the module to add bubbles in the maps.
     * 
     * @private
     */
    public bubbleModule: Bubble;
    /**
     * Sets and get the module to add the marker in the maps.
     * 
     * @private
     */
    public markerModule: Marker;
    /**
     * Gets or sets the module to add the data-label in the maps.
     * 
     * @private
     */
    public dataLabelModule: DataLabel;
    /**
     * Gets or sets the module to highlight the element when mouse has hovered on it in maps.
     * 
     * @private
     */
    public highlightModule: Highlight;
    /**
     * Gets or sets the module to add the navigation lines in the maps.
     * 
     * @private
     */
    public navigationLineModule: NavigationLine;
    /**
     * Gets or sets the module to add the legend in maps.
     * 
     * @private
     */
    public legendModule: Legend;
    /**
     * Gets or sets the module to select the geometric shapes when clicking in maps.
     * 
     * @private
     */
    public selectionModule: Selection;
    /**
     * Gets or sets the module to add the tooltip when mouse has hovered on an element in maps.
     * 
     * @private
     */
    public mapsTooltipModule: MapsTooltip;
    /**
     * Gets or sets the module to add the zooming operations in maps.
     * 
     * @private
     */
    public zoomModule: Zoom;
    /**
     * Gets or sets the module to add annotation elements in maps.
     * 
     * @private
     */
    public annotationsModule: Annotations;
    /**
     * This module enables the print functionality in maps.
     *
     * @private
     */
    public printModule: Print;
    /**
     * This module enables the export to PDF functionality in maps.
     *
     * @private
     */
    public pdfExportModule: PdfExport;
    /**
     * This module enables the export to image functionality in maps.
     *
     * @private
     */
    public imageExportModule: ImageExport;


    // Maps pblic API Declaration

    /**
     * Gets or sets the background color of the maps container.
     *
     * @default null
     */
    @Property(null)
    public background: string;
    /**
     * Enables or disables the visibility state of the separator for grouping.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;
    /**
     * Gets or sets the format to apply internationalization for the text in the maps.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Gets or sets the width in which the maps is to be rendered.
     *
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * Gets or sets the height in which the maps is to be rendered.
     *
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * Gets or sets the mode in which the tooltip is to be displayed.
     * The tooltip can be rendered on mouse move, click or double clicking on the
     * element on the map.
     *
     * @default 'MouseMove'
     */
    @Property('MouseMove')
    public tooltipDisplayMode: TooltipGesture;
    /**
     * Enables or disables the print functionality in maps.
     *
     * @default false
     */
    @Property(false)
    public allowPrint: boolean;
    /**
     * Enables or disables the export to image functionality in maps.
     *
     * @default false
     */
    @Property(false)
    public allowImageExport: boolean;
    /**
     * Enables or disables the export to PDF functionality in maps.
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**
     * Gets or sets the options to customize the title of the maps.
     */
    @Complex<TitleSettingsModel>({}, TitleSettings)
    public titleSettings: TitleSettingsModel;
    /**
     * Gets or sets the options to customize the zooming operations in maps.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;
    /**
     * Gets or sets the options to customize the legend of the maps.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;
    /**
     * Gets or sets the options to customize the layers of the maps.
     */
    @Collection<LayerSettingsModel>([], LayerSettings)
    public layers: LayerSettingsModel[];
    /**
     * Gets or sets the options for customizing the annotations in the maps.
     */
    @Collection<AnnotationModel>([], Annotation)
    public annotations: AnnotationModel[];

    /**
     * Gets or sets the options to customize the margin of the maps.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Gets or sets the options for customizing the style properties of the maps border.
     */
    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Gets or sets the theme styles supported for maps. When the theme is set, the styles associated with the theme will be set in the maps.
     *
     * @default Material
     */
    @Property('Material')
    public theme: MapsTheme;
    /**
     * Gets or sets the projection with which the maps will be rendered to show the two-dimensional curved surface of a globe on a plane.
     *
     * @default Mercator
     */
    @Property('Mercator')
    public projectionType: ProjectionType;
    /**
     * Gets or sets the index of the layer of maps which will be the base layer. It provides the option to select which layer to be visible in the maps.
     *
     * @default 0
     */
    @Property(0)
    public baseLayerIndex: number;

    /**
     * Gets or sets the description of the maps for assistive technology.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Gets or sets the tab index value for the maps.
     *
     * @default 1
     */
    @Property(1)
    public tabIndex: number;
    /**
     * Gets or sets the center position of the maps.
     */
    @Complex<CenterPositionModel>({ latitude: null, longitude: null }, CenterPosition)
    public centerPosition: CenterPositionModel;
    /**
     * Gets or sets the options to customize the area around the map.
     */
    @Complex<MapsAreaSettingsModel>({}, MapsAreaSettings)
    public mapsArea: MapsAreaSettingsModel;
    /**
     * Triggers before the maps gets rendered.
     *
     * @event load
     */
    @Event()
    public load: EmitType<ILoadEventArgs>;
    /**
     * Triggers before the print gets started.
     *
     * @event beforePrint
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers after the maps gets rendered.
     *
     * @event loaded
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers when a user clicks on an element in Maps.
     *
     * @event click
     * @deprecated
     */
    @Event()
    public click: EmitType<IMouseEventArgs>;
    /**
     * Triggers when a user clicks on an element in Maps.
     *
     * @event onclick
     */
    @Event()
    public onclick: EmitType<IMouseEventArgs>;
    /**
     * Triggers when performing the double click operation on an element in maps.
     *
     * @event doubleClick
     */
    @Event()
    public doubleClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers when performing the right click operation on an element in maps.
     *
     * @event rightClick
     */
    @Event()
    public rightClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers to notify the resize of the maps when the window is resized.
     *
     * @event resize
     */
    @Event()
    public resize: EmitType<IResizeEventArgs>;
    /**
     * Triggers before the maps tooltip gets rendered.
     *
     * @event tooltipRender
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before the legend gets rendered.
     *
     * @event legendRendering
     * @deprecated
     */
    @Event()
    public legendRendering: EmitType<ILegendRenderingEventArgs>;
    /**
     * Triggers after the maps tooltip gets rendered.
     *
     * @deprecated
     * @event tooltipRenderComplete
     */
    @Event()
    public tooltipRenderComplete: EmitType<ITooltipRenderCompleteEventArgs>;
    /**
     * Triggers when a shape is selected in the maps.
     *
     * @event shapeSelected
     */
    @Event()
    public shapeSelected: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers before the shape, bubble or marker gets selected.
     *
     * @event itemSelection
     */
    @Event()
    public itemSelection: EmitType<ISelectionEventArgs>;
    /**
     * Trigger before the shape, bubble or marker gets highlighted.
     *
     * @event itemHighlight
     */
    @Event()
    public itemHighlight: EmitType<ISelectionEventArgs>;
    /**
     * Triggers before the shape gets highlighted.
     *
     * @event shapeHighlight
     */
    @Event()
    public shapeHighlight: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers before the maps layer gets rendered.
     *
     * @event layerRendering
     */
    @Event()
    public layerRendering: EmitType<ILayerRenderingEventArgs>;

    /**
     * Triggers before the maps shape gets rendered.
     *
     * @event shapeRendering
     */
    @Event()
    public shapeRendering: EmitType<IShapeRenderingEventArgs>;

    /**
     * Triggers before the maps marker gets rendered.
     *
     * @event markerRendering
     */
    @Event()
    public markerRendering: EmitType<IMarkerRenderingEventArgs>;
    /**
     * Triggers before the maps marker cluster gets rendered.
     *
     * @event markerClusterRendering
     */
    @Event()
    public markerClusterRendering: EmitType<IMarkerClusterRenderingEventArgs>;

    /**
     * Triggers when clicking on a marker element.
     *
     * @event markerClick
     */
    @Event()
    public markerClick: EmitType<IMarkerClickEventArgs>;

    /**
     * When the marker begins to drag on the map, this event is triggered.
     *
     * @event markerDragStart
     */
    @Event()
    public markerDragStart: EmitType<IMarkerDragEventArgs>;
    /**
     * When the marker has stopped dragging on the map, this event is triggered.
     *
     * @event markerDragEnd
     */
    @Event()
    public markerDragEnd: EmitType<IMarkerDragEventArgs>;

    /**
     * Triggers when clicking the marker cluster in maps.
     *
     * @event markerClusterClick
     */
    @Event()
    public markerClusterClick: EmitType<IMarkerClusterClickEventArgs>;

    /**
     * Triggers when moving the mouse over the marker cluster element in maps.
     *
     * @event markerClusterMouseMove
     */
    @Event()
    public markerClusterMouseMove: EmitType<IMarkerClusterMoveEventArgs>;

    /**
     * Triggers when moving the mouse over the marker element in maps.
     *
     * @event markerMouseMove
     */
    @Event()
    public markerMouseMove: EmitType<IMarkerMoveEventArgs>;

    /**
     * Triggers before the data-label gets rendered.
     *
     * @event dataLabelRendering
     */
    @Event()
    public dataLabelRendering: EmitType<ILabelRenderingEventArgs>;

    /**
     * Triggers before the bubble element gets rendered on the map.
     *
     * @event bubbleRendering
     */
    @Event()
    public bubbleRendering: EmitType<IBubbleRenderingEventArgs>;

    /**
     * Triggers when performing the click operation on the bubble element in maps.
     *
     * @event bubbleClick
     */
    @Event()
    public bubbleClick: EmitType<IBubbleClickEventArgs>;

    /**
     * Triggers when hovering the mouse on the bubble element in maps.
     *
     * @event bubbleMouseMove
     */
    @Event()
    public bubbleMouseMove: EmitType<IBubbleMoveEventArgs>;

    /**
     * Triggers after the animation is completed in the maps.
     *
     * @event animationComplete
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before rendering an annotation in the maps.
     *
     * @event annotationRendering
     */
    @Event()
    public annotationRendering: EmitType<IAnnotationRenderingEventArgs>;

    /**
     * Triggers before the zoom operations such as zoom in and zoom out in the maps.
     *
     * @event zoom
     */
    @Event()
    public zoom: EmitType<IMapZoomEventArgs>;

    /**
     * Triggers before performing the panning operation.
     *
     * @event pan
     */
    @Event()
    public pan: EmitType<IMapPanEventArgs>;

    // Internal properties declaration area.
    /**
     * Specifies the function to format the text contents in the maps.
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public formatFunction: any;
    /**
     * Specifies the svg renderer object.
     *
     * @private
     */
    public renderer: SvgRenderer;
    /**
     * Specifies the svg element's object of maps.
     *
     * @private
     */
    public svgObject: Element;
    /** @public */
    public mapScaleValue: number;
    /**
     * Specifies the available height and width of maps.
     *
     * @private
     */
    public availableSize: Size;

    /**
     * whether it is layer add or not.
     *
     * @private
     */
    public isAddLayer: boolean;

    /**
     * Specifies the localization object.
     *
     * @private
     */
    public localeObject: L10n;
    /**
     * Specifies the default values of localization values.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private defaultLocalConstants: any;

    /**
     * Internal use of internationalization instance.
     *
     * @private
     */
    public intl: Internationalization;

    /**
     * Check layer whether is geometry or tile
     *
     * @private
     */
    public isTileMap: boolean = false;

    /**
     * Resize the map
     */
    private resizeTo: number;

    /**
     * Resize the map
     */
    private isResize: boolean = false;

    /**
     * @private
     */

    public mapAreaRect: Rect;

    /**
     * @private
     */
    public layersCollection: LayerSettings[];

    /**
     * @private
     */
    public isExportInitialTileMap: boolean;

    /**
     * @private
     * @hidden
     */
    public mapLayerPanel: LayerPanel;
    /**
     * @private
     * @hidden
     */
    /**
     * @private
     */
    public themeStyle: IThemeStyle;
    /**
     * @private
     */
    public isReset: boolean = false;
    /**
     * @private
     */
    public totalRect: Rect;
    /**
     *
     * Specifies whether the shape is selected in the maps or not.
     *
     * @returns {boolean} - Returns a boolean value to specify whether the shape is selected in the maps or not.
     */
    public get isShapeSelected(): boolean {
        return this.mapSelect;
    }
    public dataLabel: DataLabel;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public baseSize: Size = new Size(0, 0);
    /** @private */
    public scale: number;
    /** @private */
    public baseScale: number;
    /** @private */
    public mapSelect: boolean;
    /** @private */
    public baseMapBounds: GeoLocation;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public baseMapRectBounds: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private resizeEvent: any;
    /** @public */
    public translatePoint: Point = new Point(0, 0);
    /** @private */
    public baseTranslatePoint: Point = new Point(0, 0);
    /** @public */
    public zoomTranslatePoint: Point = new Point(0, 0);
    /** @private */
    public markerZoomFactor: number;
    /** @private */
    public markerZoomCenterPoint: CenterPositionModel;
    /** @private */
    public markerZoomedState: boolean = true;
    /** @private */
    public zoomPersistence: boolean = false;
    /** @private */
    public defaultState: boolean = true;
    /** @private */
    public currentTiles: HTMLElement;
    /** @private */
    public markerCenterLatitude: number;
    /** @private */
    public markerCenterLongitude: number;
    /** @private */
    public previousCenterLatitude: number;
    /** @private */
    public previousCenterLongitude: number;
    /** @private */
    public centerPositionChanged: boolean = false;
    /** @private */
    public previousZoomFactor: number;
    /** @private */
    public isTileMapSubLayer: boolean = false;
    /** @private */
    public shouldZoomCurrentFactor: number;
    /** @private */
    public shouldZoomPreviousFactor: number;
    /** @private */
    public markerNullCount: number = 0;
    /** @private */
    public translateType: string;
    /** @public */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public previousProjection: String;
    /** @private */
    public currentShapeDataLength: number;
    /** @private */
    public tileTranslatePoint: Point = new Point(0, 0);
    /** @private */
    public baseTileTranslatePoint: Point = new Point(0, 0);
    /** @private */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public isDevice: Boolean = false;
    /** @private */
    public tileZoomLevel: number;
    /** @private */
    public isZoomByPosition: boolean;
    /** @private */
    public tileZoomScale: number;
    /** @private */
    public staticMapZoom: number = this.zoomSettings.enable ? this.zoomSettings.zoomFactor : 0;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public serverProcess: any;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public toolbarProperties: any;
    /** @private */
    public previousScale: number;
    /** @private */
    public previousPoint: Point;
    /** @private */
    public centerLatOfGivenLocation: number;
    /** @private */
    public centerLongOfGivenLocation: number;
    /** @private */
    public minLatOfGivenLocation: number;
    /** @private */
    public minLongOfGivenLocation: number;
    /** @private */
    public maxLatOfGivenLocation: number;
    /** @private */
    public maxLongOfGivenLocation: number;
    /** @private */
    public scaleOfGivenLocation: number;
    /** @private */
    public zoomNotApplied: boolean = false;
    /** @public */
    public dataLabelShape: number[] = [];
    public zoomShapeCollection: object[] = [];
    public zoomLabelPositions: object[] = [];
    public mouseDownEvent: Object = { x: null, y: null };
    public mouseClickEvent: Object = { x: null, y: null };

    /** @private */
    public shapeSelectionClass: Element;
    /** @private */
    public selectedElementId: string[] = [];
    /** @private */
    public markerSelectionClass: Element;
    /** @private */
    public selectedMarkerElementId: string[] = [];
    /** @private */
    public bubbleSelectionClass: Element;
    /** @private */
    public selectedBubbleElementId: string[] = [];
    /** @private */
    public navigationSelectionClass: Element;
    /** @private */
    public selectedNavigationElementId: string[] = [];
    /** @private */
    public legendSelectionClass: SelectionSettingsModel;
    /** @private */
    public selectedLegendElementId: number[] = [];
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendSelectionCollection: any[] = [];
    /** @private */
    public shapeSelections: boolean = true;
    /** @private */
    public legendSelection: boolean = true;
    /** @private */
    public toggledLegendId: number[] = [];
    /** @private */
    public toggledShapeElementId: string[] = [];
    /** @private */
    public checkInitialRender: boolean = true;
    /** @private */
    public widthBeforeRefresh: number;
    /** @private */
    public heightBeforeRefresh: number;
    /** @private */
    public previousTranslate: Point;
    /** @private */
    public initialTileTranslate: Point = new Point(0, 0);
    /** @private */
    public previousTileWidth: number;
    /** @private */
    public markerDragId: string = '';
    /** @private */
    public previousTileHeight: number;
    /** @private */
    public initialZoomLevel: number;
    /** @private */
    public initialCheck: boolean = true;
    /** @private */
    public applyZoomReset: boolean = false;
    /** @private */
    public markerClusterExpandCheck: boolean = false;
    /** @private */
    public markerClusterExpand: boolean = false;
    /** @private */
    public mouseMoveId: string = '';
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public shapeSelectionItem: any[] = [];
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public markerDragArgument: any = null;

    /**
     * Constructor for creating the widget
     *
     * @param {MapsModel} options Specifies the options
     * @param {string | HTMLElement} element Specifies the element
     */
    constructor(options?: MapsModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        setValue('mergePersistData', this.mergePersistMapsData, this);
    }
    /**
     * To manage persist maps data
     *
     * @returns {void}
     */
    private mergePersistMapsData(): void {
        let data: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let windowData: any;
        try {
            windowData = window.localStorage;
        } catch (e) {
            windowData = null;
        }
        if (!isNullOrUndefined(windowData)) {
            data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        }
        if (!(isNullOrUndefined(data) || (data === ''))) {
            const dataObj: Maps = JSON.parse(data);
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
     * Gets the localized label by locale keyword.
     *
     * @param  {string} key - Specifies the key
     * @returns {string} - Returns the string value
     * @private
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObject.getConstant(key);
    }
    /**
     * Initializing pre-required values.
     *
     * @returns {void}
     */
    protected preRender(): void {
        this.isDevice = Browser.isDevice;
        this.initPrivateVariable();
        this.allowServerDataBinding = false;
        this.unWireEVents();
        this.wireEVents();
        this.setCulture();
    }
    private renderElements(): void {
        if (!this.isDestroyed) {
            this.trigger(load, { maps: this });
            this.createSVG();
            this.findBaseAndSubLayers();
            this.createSecondaryElement();
            this.addTabIndex();
            this.themeStyle = getThemeStyle(this.theme);
            this.renderBorder();
            this.renderTitle(this.titleSettings, 'title', null, null);
            this.renderArea();
            this.processRequestJsonData();
            this.renderComplete();
            this.isAddLayer = !this.isTileMap ? false : this.isAddLayer;
        }
    }
    /**
     * To Initialize the control rendering.
     *
     * @returns {void}
     */
    protected render(): void {
        this.renderElements();
    }

    protected processRequestJsonData(): void {
        const length: number = this.layersCollection.length - 1;
        this.serverProcess = { request: 0, response: 0 }; let queryModule: Query;
        let dataModule: DataManager;
        Array.prototype.forEach.call(this.layersCollection, (layer: LayerSettings, layerIndex: number) => {
            if (layer.shapeData instanceof DataManager) {
                this.serverProcess['request']++;
                dataModule = layer.shapeData;
                queryModule = layer.query instanceof Query ? layer.query : new Query();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dataManager.then((e: any) => {
                    this.processResponseJsonData('DataManager', e, layer, 'ShapeData');
                });
            } else if (layer.shapeData instanceof MapAjax || layer.shapeData) {
                if (!isNullOrUndefined(layer.shapeData['dataOptions'])) {
                    this.processAjaxRequest(layer, layer.shapeData, 'ShapeData');
                }
            }
            if (layer.dataSource instanceof DataManager) {
                this.serverProcess['request']++;
                dataModule = layer.dataSource as DataManager;
                queryModule = layer.query instanceof Query ? layer.query : new Query();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dataManager.then((e: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    layer.dataSource = processResult(e) as any[];
                });
            }
            if (layer.markerSettings.length > 0) {
                for (let i: number = 0; i < layer.markerSettings.length; i++) {
                    if (layer.markerSettings[i as number].dataSource instanceof DataManager) {
                        this.serverProcess['request']++;
                        dataModule = layer.markerSettings[i as number].dataSource as DataManager;
                        queryModule = layer.markerSettings[i as number].query instanceof Query ?
                            layer.markerSettings[i as number].query : new Query();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dataManager.then((e: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            layer.markerSettings[i as number].dataSource = processResult(e) as any[];
                        });
                    }
                }
            }
            if (layer.bubbleSettings.length > 0) {
                for (let i: number = 0; i < layer.bubbleSettings.length; i++) {
                    if (layer.bubbleSettings[i as number].dataSource instanceof DataManager) {
                        this.serverProcess['request']++;
                        dataModule = layer.bubbleSettings[i as number].dataSource as DataManager;
                        queryModule = layer.bubbleSettings[i as number].query instanceof Query ?
                            layer.bubbleSettings[i as number].query : new Query();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dataManager.then((e: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            layer.bubbleSettings[i as number].dataSource = processResult(e) as any[];
                        });
                    }
                }
            }
            if (layer.dataSource instanceof MapAjax || !isNullOrUndefined(layer.dataSource['dataOptions'])) {
                this.processAjaxRequest(layer, layer.dataSource, 'DataSource');
            }
            if (this.serverProcess['request'] === this.serverProcess['response'] && length === layerIndex) {
                this.processResponseJsonData(null);
            }
        });
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private processAjaxRequest(layer: LayerSettings, localAjax: MapAjax | any, type: string): void {
        this.serverProcess['request']++;
        const fetchApiModule: Fetch = new Fetch(localAjax.dataOptions, localAjax.type, localAjax.contentType);
        fetchApiModule.onSuccess = (args: any) => {
            if (!isNullOrUndefined(args.type) && args.type === 'application/octet-stream') {
                let reader: FileReader = new FileReader();
                let map: Maps = this;
                reader.onload = function (data) {
                    args = JSON.parse(reader.result.toString());
                    map.processResponseJsonData('Fetch', args, layer, type);
                };
                reader.readAsText(args);
            } else {
                this.processResponseJsonData('Fetch', args, layer, type);
            }
        };
        fetchApiModule.send(localAjax.sendData);
    }
    /**
     * This method is used to process the JSON data to render the maps.
     *
     * @param {string} processType - Specifies the process type in maps.
     * @param {any | string} data - Specifies the data for maps.
     * @param {LayerSettings} layer - Specifies the layer for the maps.
     * @param {string} dataType - Specifies the data type for maps.
     * @returns {void}
     * @private
     */
    public processResponseJsonData(processType: string, data?: any | string, layer?: LayerSettings, dataType?: string): void {
        this.serverProcess['response']++;
        if (processType) {
            if (dataType === 'ShapeData') {
                layer.shapeData = (processType === 'DataManager') ? processResult((data as any)) : data;
            } else {
                layer.dataSource = (processType === 'DataManager') ? processResult((data as any)) : data;
            }
        }
        if (!isNullOrUndefined(processType) && this.serverProcess['request'] === this.serverProcess['response']) {
            const collection: LayerSettings[] = this.layersCollection;
            this.layersCollection = [];
            for (let i: number = 0; i < collection.length; i++) {
                if (collection[i as number].isBaseLayer) {
                    this.layersCollection.push(collection[i as number]);
                }
            }
            for (let j: number = 0; j < collection.length; j++) {
                if (!collection[j as number].isBaseLayer) {
                    this.layersCollection.push(collection[j as number]);
                }
            }
            this.renderMap();
        } else if (isNullOrUndefined(processType)) {
            this.renderMap();
        }
    }

    private renderMap(): void {
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.renderLegend();
        }
        this.createTile();
        if (this.zoomSettings.enable && this.zoomModule) {
            this.zoomModule.createZoomingToolbars();
        }
        if (!isNullOrUndefined(this.dataLabelModule)) {
            this.dataLabelModule.dataLabelCollections = [];
        }
        this.mapLayerPanel.measureLayerPanel();
        if (!isNullOrUndefined(this.svgObject)) {
            this.element.appendChild(this.svgObject);
        }
        this.setSecondaryElementPosition();
        for (let i: number = 0; i < this.layers.length; i++) {
            if (this.layers[i as number].selectionSettings && this.layers[i as number].selectionSettings.enable &&
                this.layers[i as number].initialShapeSelection.length > 0 && this.checkInitialRender) {
                const checkSelection: boolean = this.layers[i as number].selectionSettings.enableMultiSelect;
                this.layers[i as number].selectionSettings.enableMultiSelect = checkSelection ? checkSelection : true;
                const shapeSelection: InitialShapeSelectionSettingsModel[] = this.layers[i as number].initialShapeSelection;
                for (let j: number = 0; j < this.layers[i as number].initialShapeSelection.length; j++) {
                    this.shapeSelection(i, shapeSelection[j as number].shapePath, shapeSelection[j as number].shapeValue, true);
                }
                this.layers[i as number].selectionSettings.enableMultiSelect = checkSelection;
                if (i === this.layers.length - 1) { this.checkInitialRender = false; }
            }
            if (!this.isResize) {
                for (let k: number = 0; k < this.layers[i as number].markerSettings.length; k++) {
                    // eslint-disable-next-line max-len
                    if (this.layers[i as number].markerSettings[k as number].selectionSettings && this.layers[i as number].markerSettings[k as number].selectionSettings.enable
                        && this.layers[i as number].markerSettings[k as number].initialMarkerSelection.length > 0) {
                        const markerSelectionValues: InitialMarkerSelectionSettingsModel[] =
                            this.layers[i as number].markerSettings[k as number].initialMarkerSelection;
                        for (let j: number = 0; j < markerSelectionValues.length; j++) {
                            this.markerInitialSelection(i, k, this.layers[i as number].markerSettings[k as number],
                                                        markerSelectionValues[j as number].latitude,
                                                        markerSelectionValues[j as number].longitude);
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(document.getElementById(this.element.id + '_tile_parent'))) {
            const svg: ClientRect = this.svgObject.getBoundingClientRect();
            const element: HTMLElement = document.getElementById(this.element.id);
            const tileElement: HTMLElement = document.getElementById(this.element.id + '_tile_parent');
            const tileElement1: HTMLElement = document.getElementById(this.element.id + '_tiles');
            const tile: ClientRect = tileElement.getBoundingClientRect();
            let bottom: number; let top: number; let left: number;
            left = parseFloat(tileElement.style.left);
            const titleTextSize: Size = measureText(
                this.titleSettings.text,
                this.titleSettings.textStyle
            );
            const subTitleTextSize: Size = measureText(
                this.titleSettings.subtitleSettings.text,
                this.titleSettings.subtitleSettings.textStyle
            );
            if (this.isTileMap && this.isTileMapSubLayer && this.legendSettings.position === 'Bottom' && this.legendSettings.visible) {
                if (this.legendSettings.mode !== 'Default') {
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top = parseFloat(tileElement.style.top) + (subTitleTextSize.height / 2)
                            - (this.legendModule.legendBorderRect.height / 2);
                    } else {
                        top = parseFloat(tileElement.style.top) - this.mapAreaRect.y;
                    }
                } else {
                    left = this.legendModule.legendBorderRect.x;
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top = parseFloat(tileElement.style.top) + (subTitleTextSize['height'] / 2)
                            - this.legendModule.legendBorderRect.y;
                    } else {
                        top = parseFloat(tileElement.style.top) + (subTitleTextSize['height'] / 2);
                    }
                }
            } else {
                bottom = svg.bottom - tile.bottom - element.offsetTop;
                top = parseFloat(tileElement.style.top);
            }
            top = (bottom <= 11) ? top : (!isNullOrUndefined(this.legendModule) && this.legendSettings.position === 'Bottom') ? this.mapAreaRect.y : (top * 2);
            left = (bottom <= 11) ? left : !isNullOrUndefined(this.legendModule) ? left : (left * 2);
            tileElement.style.top = top + 'px';
            tileElement.style.left = left + 'px';
            tileElement1.style.top = top + 'px';
            tileElement1.style.left = left + 'px';
            if (!isNullOrUndefined(this.legendModule) && this.legendModule.totalPages.length > 0) {
                tileElement.style.height = tileElement1.style.height = this.legendModule.legendTotalRect.height + 'px';
                tileElement.style.width = tileElement1.style.width = this.legendModule.legendTotalRect.width + 'px';
            }
        }

        this.arrangeTemplate();

        if (this.annotationsModule) {
            if (this.width !== '0px' && this.height !== '0px' && this.width !== '0%' && this.height !== '0%') {
                this.annotationsModule.renderAnnotationElements();
            }
        }
        this.element.style.outline = 'none';
        this.element.style.position = 'relative';
        for (let i: number = 0; i < document.getElementsByTagName('path').length - 1; i++) {
            if (document.getElementsByTagName('path')[i as number].id.indexOf('shapeIndex') > -1) {
                document.getElementsByTagName('path')[i as number].style.outline = 'none';
            }
        }
        this.zoomingChange();
        if (this.zoomModule && this.isDevice) {
            this.zoomModule.removeToolbarOpacity(this.isTileMap ? Math.round(this.tileZoomLevel) : this.mapScaleValue, this.element.id + '_Zooming_');
        }
        if (!this.isZoomByPosition && !this.zoomNotApplied) {
            this.trigger(loaded, { maps: this, isResized: this.isResize });
        }
        this.isResize = false;
    }

    /**
     * To apply color to the initial selected marker
     *
     * @param {SelectionSettingsModel} selectionSettings - Specifies the selection settings
     * @param {Maps} map - Specifies the instance of the maps
     * @param {Element} targetElement - Specifies the target element
     * @param {any} data - Specifies the data
     * @returns {void}
     * @private
     */
    public markerSelection(
        selectionSettings: SelectionSettingsModel, map: Maps, targetElement: Element,
        data: any
    ): void {
        const border: BorderModel = {
            color: selectionSettings.border.color,
            width: selectionSettings.border.width / map.scale,
            opacity: selectionSettings.border.opacity
        };
        const markerSelectionProperties: any = {
            opacity: selectionSettings.opacity,
            fill: selectionSettings.fill,
            border: border,
            target: targetElement.id,
            cancel: false,
            data: data,
            maps: map
        };

        if (!getElement('MarkerselectionMap')) {
            document.body.appendChild(createStyle('MarkerselectionMap', 'MarkerselectionMapStyle', markerSelectionProperties));
        } else {
            customizeStyle('MarkerselectionMap', 'MarkerselectionMapStyle', markerSelectionProperties);
        }
        if (this.selectedMarkerElementId.length === 0 || selectionSettings.enableMultiSelect) {
            if (targetElement.tagName === 'g') {
                targetElement.children[0].setAttribute('class', 'MarkerselectionMapStyle');
                this.selectedMarkerElementId.push(targetElement.children[0].id);
            } else {
                targetElement.setAttribute('class', 'MarkerselectionMapStyle');
                this.selectedMarkerElementId.push(targetElement.id);
            }
        }
    }
    /**
     * initial selection of marker
     *
     * @param {number} layerIndex - Specifies the layer index
     * @param {number} markerIndex - Specifies the marker index
     * @param {MarkerSettingsModel} markerSettings - Specifies the marker settings
     * @param {number} latitude - Specifies hte latitude
     * @param {number} longitude - Specifies the longitude
     * @returns {void}
     * @private
     */
    public markerInitialSelection(
        layerIndex: number, markerIndex: number, markerSettings: MarkerSettingsModel,
        latitude: number, longitude: number
    ): void {
        const selectionSettings: SelectionSettingsModel = markerSettings.selectionSettings;
        if (selectionSettings.enable) {
            for (let i: number = 0; i < markerSettings.dataSource['length']; i++) {
                const data: any = markerSettings.dataSource[i as number];
                if (data['latitude'] === latitude && data['longitude'] === longitude) {
                    const targetId: string = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex +
                        '_dataIndex_' + i;
                    this.markerSelection(selectionSettings, this, getElement(targetId), data);
                }
            }
        }
    }

    /**
     * Render the map area border
     *
     * @returns {void}
     */
    private renderArea(): void {
        const width: number = this.mapsArea.border.width;
        const background: string = this.mapsArea.background;
        if (width > 0 || (background || this.themeStyle.areaBackgroundColor)) {
            const mapBorder: BorderModel = {
                opacity: isNullOrUndefined(this.mapsArea.border.opacity) ? 1 : this.mapsArea.border.opacity,
                color: this.mapsArea.border.color, width: this.mapsArea.border.width
            };
            const rect: RectOption = new RectOption(
                this.element.id + '_MapAreaBorder', background || this.themeStyle.areaBackgroundColor,
                mapBorder, 1, this.mapAreaRect
            );
            this.svgObject.appendChild(this.renderer.drawRectangle(rect) as SVGRectElement);
        }
    }
    /**
     * To add tab index for map element
     *
     * @returns {void}
     */
    private addTabIndex(): void {
        this.element.setAttribute('aria-label', this.description || 'Maps Element');
        this.element.setAttribute('role', '');
        this.element.tabIndex = this.tabIndex;
    }

    private setSecondaryElementPosition(): void {
        let element: HTMLDivElement = getElementByID(this.element.id + '_Secondary_Element') as HTMLDivElement;
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgElement: Element = getElementByID(this.element.id + '_svg');
        if (!isNullOrUndefined(svgElement)) {
            let svgRect: ClientRect = svgElement.getBoundingClientRect();
            element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
            element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
        }
    }

    private zoomingChange(): void {
        let left: number; let top: number;
        if (getElementByID(this.element.id + '_Layer_Collections') && this.zoomModule) {
            this.zoomModule.layerCollectionEle = getElementByID(this.element.id + '_Layer_Collections');
        }
        if (this.isTileMap && getElementByID(this.element.id + '_Tile_SVG') && getElementByID(this.element.id + '_tile_parent')) {
            const tileElement: Element = getElementByID(this.element.id + '_tile_parent');
            const tileSvgElement: Element = getElementByID(this.element.id + '_Tile_SVG');
            const tileSvgParentElement: Element = getElementByID(this.element.id + '_Tile_SVG_Parent');
            const tileRect: ClientRect = tileElement.getBoundingClientRect();
            const tileSvgRect: ClientRect = tileSvgElement.getBoundingClientRect();
            left = (tileRect.left - tileSvgRect.left);
            top = (tileRect.top - tileSvgRect.top);
            (tileSvgParentElement as HTMLElement).style.left = left + 'px';
            (tileSvgParentElement as HTMLElement).style.top = top + 'px';
            if (!isNullOrUndefined(this.legendModule) && this.legendModule.totalPages.length > 0) {
                (tileElement as HTMLElement).style.width = (tileSvgElement as HTMLElement).style.width =
                    this.legendModule.legendTotalRect.width.toString();
                (tileElement as HTMLElement).style.height = (tileSvgElement as HTMLElement).style.height =
                    this.legendModule.legendTotalRect.height.toString();
                (tileSvgParentElement as HTMLElement).style.width = this.legendModule.legendTotalRect.width + 'px';
                (tileSvgParentElement as HTMLElement).style.height = this.legendModule.legendTotalRect.height + 'px';
            }
            const markerTemplateElements: HTMLCollectionOf<Element> = document.getElementsByClassName('template');
            if (!isNullOrUndefined(markerTemplateElements) && markerTemplateElements.length > 0) {
                for (let i: number = 0; i < markerTemplateElements.length; i++) {
                    const templateGroupEle: HTMLElement = markerTemplateElements[i as number] as HTMLElement;
                    templateGroupEle.style.left = left + 'px';
                    templateGroupEle.style.top = top + 'px';
                }
            }
        }
        if (this.zoomSettings.zoomFactor >= 0) {
            if (this.zoomModule && this.zoomModule.toolBarGroup && this.zoomSettings.enable) {
                this.zoomModule.alignToolBar();
            }
            const elements: Element = document.getElementById(this.element.id + '_Layer_Collections');
            if (!isNullOrUndefined(elements) && elements.childElementCount > 0) {
                for (let i: number = 0; i < elements.childNodes.length; i++) {
                    const childElement: SVGAElement = elements.childNodes[i as number] as SVGAElement;
                    if (childElement.tagName === 'g' && childElement.id.indexOf('_Legend_Group') === -1) {
                        const layerIndex: number = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                        for (let j: number = 0; j < childElement.childNodes.length; j++) {
                            const childNode: Element = <Element>childElement.childNodes[j as number];
                            if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                                (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                                (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))) {
                                changeBorderWidth(childNode, layerIndex, this.scale, this);
                            }
                        }
                    }
                }
            }
            if (this.zoomModule && ((this.previousScale !== this.scale) || this.zoomNotApplied || this.isZoomByPosition)) {
                this.zoomModule.applyTransform(this, true);
            }
        }
    }

    private createSecondaryElement(): void {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            const secondaryElement: Element = createElement('div', {
                id: this.element.id + '_Secondary_Element'
            });
            (secondaryElement as HTMLElement).style.cssText = 'position: relative;z-index:2;';
            this.element.appendChild(secondaryElement);
        }
    }

    /**
     * @returns {void}
     * @private
     */
    public arrangeTemplate(): void {
        if (document.getElementById(this.element.id + '_Legend_Border')) {
            document.getElementById(this.element.id + '_Legend_Border').style.pointerEvents = 'none';
        }
        const templateElements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.element.id + '_template');
        if (!isNullOrUndefined(templateElements) && templateElements.length > 0 &&
            getElementByID(this.element.id + '_Layer_Collections') && !this.isTileMap) {
            for (let i: number = 0; i < templateElements.length; i++) {
                let offSetLetValue: number = 0;
                let offSetTopValue: number = 0;
                const templateGroupEle: Element = templateElements[i as number] as Element;
                if (!isNullOrUndefined(templateGroupEle) && templateGroupEle.childElementCount > 0) {
                    const layerOffset: ClientRect = getElementByID(this.element.id + '_Layer_Collections').getBoundingClientRect();
                    const elementOffset: ClientRect = getElementByID(templateGroupEle.id).getBoundingClientRect();
                    if (templateGroupEle.id.indexOf('Marker') === -1) {
                        offSetLetValue = this.isTileMap ? 0 : (layerOffset.left < elementOffset.left) ?
                            -(Math.abs(elementOffset.left - layerOffset.left)) : (Math.abs(elementOffset.left - layerOffset.left));
                        offSetTopValue = this.isTileMap ? 0 : (layerOffset.top < elementOffset.top) ?
                            - (Math.abs(elementOffset.top - layerOffset.top)) : Math.abs(elementOffset.top - layerOffset.top);
                    }
                    for (let j: number = 0; j < templateGroupEle.childElementCount; j++) {
                        const currentTemplate: HTMLElement = <HTMLElement>templateGroupEle.childNodes[j as number];
                        if (currentTemplate.id.indexOf('Marker') !== -1) {
                            const elementOffset: ClientRect = getElementByID(currentTemplate.id).getBoundingClientRect();
                            currentTemplate.style.left = parseFloat(currentTemplate.style.left) - (this.isTileMap ? 0 : elementOffset.width / 2) + 'px';
                            currentTemplate.style.top = parseFloat(currentTemplate.style.top) - (this.isTileMap ? 0 : elementOffset.height / 2) + 'px';
                        } else {
                            currentTemplate.style.left = parseFloat(currentTemplate.style.left) + offSetLetValue + 'px';
                            currentTemplate.style.top = parseFloat(currentTemplate.style.top) + offSetTopValue + 'px';
                            currentTemplate.style.transform = 'translate(-50%, -50%)';
                        }
                    }
                }
            }
        }
    }

    private createTile(): void {
        const mainLayer: LayerSettings = this.layersCollection[0];
        const padding: number = 0;
        if (mainLayer.isBaseLayer && (mainLayer.layerType === 'OSM' || mainLayer.layerType === 'Bing' ||
            mainLayer.layerType === 'GoogleStaticMap' || mainLayer.layerType === 'Google' || (!isNullOrUndefined(mainLayer.urlTemplate) && mainLayer.urlTemplate !== ''))) {
            removeElement(this.element.id + '_tile_parent');
            removeElement(this.element.id + '_tiles');
            removeElement('animated_tiles');
            const ele: Element = createElement('div', {
                id: this.element.id + '_tile_parent'
            });
            (ele as HTMLElement).style.cssText = 'position: absolute; left: ' +
                (this.mapAreaRect.x) + 'px; right: ' + (this.margin.right) + 'px; top: '
                + (this.mapAreaRect.y + padding) + 'px; height: ' +
                (this.mapAreaRect.height) + 'px; width: '
                + (this.mapAreaRect.width) + 'px; overflow: hidden;';
            const ele1: Element = createElement('div', {
                id: this.element.id + '_tiles'
            });
            (ele1 as HTMLElement).style.cssText = 'position: absolute; left: ' +
                (this.mapAreaRect.x) + 'px;  right: ' + (this.margin.right) + 'px; top: '
                + (this.mapAreaRect.y + padding) + 'px; height: ' + (this.mapAreaRect.height) + 'px; width: '
                + (this.mapAreaRect.width) + 'px; overflow: hidden;';
            this.element.appendChild(ele);
            this.element.appendChild(ele1);
        }
    }


    /**
     * To initilize the private varibales of maps.
     *
     * @returns {void}
     */
    private initPrivateVariable(): void {
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-maps').length;
            this.element.id = 'maps_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.mapLayerPanel = new LayerPanel(this);
    }

    private findBaseAndSubLayers(): void {
        const baseIndex: number = this.baseLayerIndex;
        const mainLayers: any[] = []; const subLayers: any[] = [];
        this.layersCollection = [];
        Array.prototype.forEach.call(this.layers, (layer: LayerSettingsModel) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (layer.type === 'Layer') ? mainLayers.push(layer) : subLayers.push(layer);
        });
        for (let i: number = 0; i < mainLayers.length; i++) {
            const baseLayer: LayerSettings = <LayerSettings>mainLayers[i as number];
            if (baseLayer.visible && baseIndex === i) {
                baseLayer.isBaseLayer = true;
                this.isTileMap = (baseLayer.layerType === 'Geometry' && !isNullOrUndefined(baseLayer.shapeData)) ? false : true;
                this.layersCollection.push(baseLayer);
                break;
            } else if (i === mainLayers.length - 1) {
                this.layersCollection.push(<LayerSettings>mainLayers[0]);
                break;
            }
        }
        subLayers.map((subLayer: LayerSettings) => {
            if (subLayer.visible) {
                this.layersCollection.push(subLayer);
            }
        });
    }

    /**
     * Render the map border
     *
     * @private
     * @returns {void}
     */
    private renderBorder(): void {
        const width: number = this.border.width;
        const borderElement: Element = this.svgObject.querySelector('#' + this.element.id + '_MapBorder');
        if ((width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            const border: BorderModel = {
                opacity: isNullOrUndefined(this.border.opacity) ? 1 : this.border.opacity,
                color: this.border.color, width: this.border.width
            };
            const borderRect: RectOption = new RectOption(
                this.element.id + '_MapBorder', this.background || this.themeStyle.backgroundColor, border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect) as SVGRectElement);
        } else {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    }

    /**
     * Render the title and subtitle
     *
     * @param {TitleSettingsModel} title - Specifies the title
     * @param {string} type - Specifies the type
     * @param {Rect} bounds - Specifies the bounds
     * @param {Element} groupEle - Specifies the group element
     * @returns {void}
     * @private
     */
    private renderTitle(title: TitleSettingsModel, type: string, bounds: Rect, groupEle: Element): void {
        const style: FontModel = {
            size: title.textStyle.size,
            color: title.textStyle.color,
            fontFamily: title.textStyle.fontFamily,
            fontWeight: title.textStyle.fontWeight,
            fontStyle: title.textStyle.fontStyle,
            opacity: title.textStyle.opacity
        };
        let height: number;
        const width: number = Math.abs((this.margin.left + this.margin.right) - this.availableSize.width);
        style.fontFamily = !isNullOrUndefined(style.fontFamily) ? style.fontFamily : this.themeStyle.fontFamily;
        style.fontWeight = type === 'title' ? style.fontWeight || this.themeStyle.titleFontWeight : style.fontWeight || this.themeStyle.titleFontWeight;
        style.size = type === 'title' ? (style.size || this.themeStyle.titleFontSize) : (style.size || this.themeStyle.subTitleFontSize || Theme.mapsSubTitleFont.size);
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            const trimmedTitle: string = textTrim(width, title.text, style);
            const elementSize: Size = measureText(trimmedTitle, style);
            const rect: Rect = (isNullOrUndefined(bounds)) ? new Rect(
                this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            const location: Point = findPosition(rect, title.alignment, elementSize, type);
            const options: TextOption = new TextOption(
                this.element.id + '_Map_' + type, location.x, location.y, 'start', trimmedTitle
            );
            const titleBounds: Rect = new Rect(location.x, location.y, elementSize.width, elementSize.height);
            const element: Element = renderTextElement(
                options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor),
                groupEle
            );
            element.setAttribute('aria-label', this.description || title.text);
            element.setAttribute('role', '');
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = Math.abs((titleBounds.y + this.margin.bottom) - this.availableSize.height);
                this.mapAreaRect = new Rect(this.margin.left, titleBounds.y + 10, width, height - 10);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            } else {
                this.svgObject.appendChild(groupEle);
            }
        } else {
            height = Math.abs((this.margin.top + this.margin.bottom) - this.availableSize.height);
            this.mapAreaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    }

    /**
     * To create svg element for maps
     *
     * @returns {void}
     */
    private createSVG(): void {
        this.removeSvg();
        createSvg(this);
    }
    /**
     * To Remove the SVG
     *
     * @returns {void}
     */
    private removeSvg(): void {
        removeElement(this.element.id + '_Secondary_Element');
        removeElement(this.element.id + '_tile_parent');
        removeElement(this.element.id + '_tiles');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        this.clearTemplate();
    }
    /**
     * To bind event handlers for maps.
     *
     * @returns {void}
     */
    private wireEVents(): void {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, 'click', this.mapsOnClick, this);
        EventHandler.add(this.element, 'contextmenu', this.mapsOnRightClick, this);
        EventHandler.add(this.element, 'dblclick', this.mapsOnDoubleClick, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        //  EventHandler.add(this.element, cancelEvent, this.mouseLeaveOnMap, this);
        this.resizeEvent = this.mapsOnResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeEvent
        );

    }

    /**
     * To unbind event handlers from maps.
     *
     * @returns {void}
     */
    private unWireEVents(): void {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, 'click', this.mapsOnClick);
        EventHandler.remove(this.element, 'contextmenu', this.mapsOnRightClick);
        EventHandler.remove(this.element, 'dblclick', this.mapsOnDoubleClick);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        //EventHandler.remove(this.element, cancelEvent, this.mouseLeaveOnMap);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeEvent
        );
    }
    /**
     * This method is used to perform operations when mouse pointer leave from maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
     * @private
     */
    public mouseLeaveOnMap(e: PointerEvent): void {
        if (document.getElementsByClassName('highlightMapStyle').length > 0 && this.legendModule) {
            this.legendModule.removeShapeHighlightCollection();
            removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
        }
    }
    private keyUpHandler(event: KeyboardEvent): void {
        const id: string = event.target['id'];
        if (this.isTileMap) {
            this.removeTileMap();
        }
        if (event.code === 'Tab' && id.indexOf('_LayerIndex_') > -1 && id.indexOf('shapeIndex') > -1) {
            this.keyboardHighlightSelection(id, event.type);
        } else if (id.indexOf('_LayerIndex_') === -1 && id.indexOf('shapeIndex') === -1 &&
            getElementsByClassName('highlightMapStyle').length > 0) {
            removeClass(<Element>getElementsByClassName('highlightMapStyle')[0]);
            if (this.legendSettings.visible && this.legendModule) {
                this.legendModule.removeShapeHighlightCollection();
            }
        }
    }

    private keyboardHighlightSelection(id: string, key: string): void {
        const layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
        const shapeIndex: number = parseInt(id.split('_shapeIndex_')[1].split('_')[0], 10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapeData: any = this.layers[layerIndex as number].shapeData['features']['length'] > shapeIndex ?
            this.layers[layerIndex as number].shapeData['features'][shapeIndex as number]['properties'] : null;
        const dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = isNullOrUndefined(dataIndex) ? null : this.layers[layerIndex as number].dataSource[dataIndex as number];
        if (this.layers[layerIndex as number].selectionSettings.enable && key === 'keydown' && this.selectionModule) {
            this.selectionModule.selectionsettings = this.layers[layerIndex as number].selectionSettings;
            this.selectionModule.selectionType = 'Shape';
            this.selectionModule.selectElement(<Element>event.target, layerIndex, data, shapeData);
        } else if (this.highlightModule && (this.layers[layerIndex as number].highlightSettings.enable && key === 'keyup' &&
            !(event.target as HTMLElement).classList.contains('ShapeselectionMapStyle'))) {
            this.highlightModule.highlightSettings = this.layers[layerIndex as number].highlightSettings;
            this.highlightModule.handleHighlight(<Element>event.target, layerIndex, data, shapeData);
        }
    }

    private keyDownHandler(event: KeyboardEvent): void {
        const zoom: Zoom = this.zoomModule;
        let id: string = event.target['id'];
        if ((event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft'
            || event.code === 'ArrowRight') && zoom) {
            const animatedTiles: HTMLElement = document.getElementById(this.element.id + '_animated_tiles');
            if (this.isTileMap && !isNullOrUndefined(animatedTiles)) {
                this.currentTiles = (animatedTiles.cloneNode(true) as HTMLElement);
            }
        }
        if (this.zoomSettings.enable && zoom && (event.key === '+' || event.code === 'Equal')) {
            zoom.performZoomingByToolBar('zoomin');
        } else if (this.zoomSettings.enable && zoom && (event.key === '-' || event.code === 'Minus')) {
            zoom.performZoomingByToolBar('zoomout');
        } else if (this.zoomSettings.enable && zoom && event['keyCode'] === 82) {
            zoom.performZoomingByToolBar('reset');
            zoom.isPanning = false;
        } else if (this.zoomSettings.enable && this.zoomSettings.enablePanning && zoom
            && (event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
            event.preventDefault();
            zoom.mouseDownLatLong['x'] = 0;
            zoom.mouseMoveLatLong['y'] = this.mapAreaRect.height / 7;
            zoom.panning('None', zoom.mouseDownLatLong['x'], event.code === 'ArrowUp' ? -(zoom.mouseMoveLatLong['y']) :
                zoom.mouseMoveLatLong['y'], event);
            zoom.mouseDownLatLong['y'] = zoom.mouseMoveLatLong['y'];
        } else if (this.zoomSettings.enable && this.zoomSettings.enablePanning && zoom
            && (event.code === 'ArrowLeft' || event.code === 'ArrowRight')) {
            event.preventDefault();
            zoom.mouseDownLatLong['y'] = 0;
            zoom.mouseMoveLatLong['x'] = this.mapAreaRect.width / 7;
            zoom.panning('None', event.code === 'ArrowLeft' ? -(zoom.mouseMoveLatLong['x']) : zoom.mouseMoveLatLong['x'],
                         zoom.mouseDownLatLong['y'], event);
            zoom.mouseDownLatLong['x'] = zoom.mouseMoveLatLong['x'];
        } else if (event.code === 'Enter') {
            id = event.target['id'];
            event.preventDefault();
            if (this.legendModule && (id.indexOf('_Left_Page_Rect') > -1 || id.indexOf('_Right_Page_Rect') > -1)) {
                this.mapAreaRect = this.legendModule.initialMapAreaRect;
                this.legendModule.currentPage = (id.indexOf('_Left_Page_') > -1) ? (this.legendModule.currentPage - 1) :
                    (this.legendModule.currentPage + 1);
                this.legendModule.legendGroup = this.renderer.createGroup({ id: this.element.id + '_Legend_Group' });
                this.legendModule.drawLegendItem(this.legendModule.currentPage);
                const textContent: string = (document.getElementById(this.element.id + '_Paging_Text')).textContent;
                const text: number[] = textContent.split('/').map(Number);
                if (id.indexOf('_Left_Page_Rect') > -1) {
                    if (text[0] !== 1) {
                        (event.target as HTMLElement).focus();
                    }
                    (event.target as HTMLElement).style.outlineColor = text[0] - 1 !== text[1] ? '' : 'transparent';
                } else if (id.indexOf('_Right_Page_Rect') > -1) {
                    if (text[0] !== text[1]) {
                        (event.target as HTMLElement).focus();
                    }
                    (event.target as HTMLElement).style.outlineColor = text[0] !== text[1] + 1 ? '' : 'transparent';
                }
                if (querySelector(this.element.id + '_Legend_Border', this.element.id)) {
                    (<HTMLElement>querySelector(this.element.id + '_Legend_Border', this.element.id)).style.pointerEvents = 'none';
                }
            }
            if (id.indexOf('shapeIndex') > -1) {
                this.keyboardHighlightSelection(id, event.type);
            }
        }
        if (this.zoomModule) {
            this.zoomModule.removeToolbarOpacity(this.isTileMap ? Math.round(this.tileZoomLevel) : this.mapScaleValue, this.mouseMoveId);
        }
    }

    /**
     * Gets the selected element to be maintained or not.
     *
     * @param {Element} targetEle - Specifies the target element
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public SelectedElement(targetEle: Element): boolean {
        let isSelect: boolean = false;
        if (targetEle.getAttribute('class') === 'ShapeselectionMapStyle') {
            isSelect = true;
        }
        return isSelect;
    }

    /**
     * This method is used to perform the operations when a click operation is performed on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
     * @private
     */
    public mapsOnClick(e: PointerEvent): void {
        const targetEle: Element = <Element>e.target;
        const targetId: string = targetEle.id;
        let latitude: number = null;
        let longitude: number = null;
        this.mouseClickEvent = { x: e.x, y: e.y };
        if (targetEle.id.indexOf('_ToolBar') === -1) {
            const latLongValue: GeoPosition = this.getClickLocation(targetId, e.pageX, e.pageY, (targetEle as HTMLElement), e['layerX'], e['layerY']);
            if (!isNullOrUndefined(latLongValue)) {
                latitude = latLongValue.latitude;
                longitude = latLongValue.longitude;
            }
            const eventArgs: IMouseEventArgs = {
                cancel: false, name: click, target: targetId, x: e.clientX, y: e.clientY,
                latitude: latitude, longitude: longitude,
                isShapeSelected: this.SelectedElement(targetEle)
            };
            if (this.onclick) {
                eventArgs.name = onclick;
                this.trigger('onclick', eventArgs, (mouseArgs: IMouseEventArgs) => {
                    this.clickHandler(e, eventArgs, targetEle);
                });
            } else {
                this.trigger('click', eventArgs, (mouseArgs: IMouseEventArgs) => {
                    this.clickHandler(e, eventArgs, targetEle);
                });
            }
        }
        if (this.zoomModule) {
            this.zoomModule.removeToolbarOpacity(this.isTileMap ? Math.round(this.tileZoomLevel) : this.mapScaleValue, targetId)
            if (this.isDevice) {
                this.zoomModule.removeToolbarClass('', '', '', '', '');
            }
        }
    }

    private clickHandler(e: PointerEvent, eventArgs: IMouseEventArgs, targetEle: Element): void {
        if (targetEle.id.indexOf('shapeIndex') > -1) {
            this.mergeCluster();
            if (getElement(this.element.id + '_mapsTooltip') &&
                this.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                removeElement(this.element.id + '_mapsTooltip');
            }
        }
        if (this.markerModule) {
            this.markerModule.markerClusterClick(e);
        }
        if (!eventArgs.cancel) {
            this.notify(click, targetEle);
        }
        if (!eventArgs.cancel && targetEle.id.indexOf('shapeIndex') !== -1) {
            this.triggerShapeSelection(targetEle);
        }
    }

    private triggerShapeSelection(targetEle: Element): void {
        const layerIndex: number = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
        const shapeSelectedEventArgs: IShapeSelectedEventArgs = triggerShapeEvent(
            targetEle.id, this.layers[layerIndex as number].selectionSettings, this, shapeSelected
        );
        if (!shapeSelectedEventArgs.cancel && this.selectionModule && !isNullOrUndefined(this.shapeSelected)) {
            customizeStyle(this.selectionModule.selectionType + 'selectionMap',
                           this.selectionModule.selectionType + 'selectionMapStyle', shapeSelectedEventArgs);
        } else if (shapeSelectedEventArgs.cancel && this.selectionModule
            && isNullOrUndefined(shapeSelectedEventArgs['data'])) {
            removeClass(targetEle);
            this.selectionModule.removedSelectionList(targetEle);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getMarkerClickLocation(pageX: number, pageY: number, x: number, y: number, marker: any, isDragEnd: boolean): GeoPosition {
        document.getElementById(this.element.id + "_svg").style.cursor = 'grabbing';
        const targetElement: Element = getElement(marker.targetId);
        let latLongValue: GeoPosition = this.getClickLocation(marker.targetId, pageX, pageY, (targetElement as HTMLElement), x, y);
        const location: Point = (this.isTileMap) ? convertTileLatLongToPoint(
            new MapLocation(latLongValue.longitude, latLongValue.latitude), this.scale, this.tileTranslatePoint, true
        ) : convertGeoToPoint(latLongValue.latitude, latLongValue.longitude, this.mapLayerPanel.currentFactor,
            <LayerSettings>this.layersCollection[marker.layerIndex], this);
        const transPoint: Point = this.translatePoint;
        const translateX: number = (this.isTileMap ? location.x : (location.x + transPoint.x) * this.scale);
        const translateY: number = (this.isTileMap ? location.y : (location.y + transPoint.y) * this.scale);
        if (this.markerDragArgument.shape !== 'Balloon') {
            targetElement.setAttribute('transform', 'translate( ' + translateX + ' ' + translateY + ' )');
        } else {
            targetElement.parentElement.setAttribute('transform', 'translate( ' + translateX + ' ' + translateY + ' )');
        }
        if (isDragEnd) {
            const markerSettings: MarkerSettingsModel = this.layers[marker.layerIndex].markerSettings[marker.markerIndex];
            latLongValue = this.getClickLocation(marker.targetId, (pageX - markerSettings.offset.x), (pageY - markerSettings.offset.y),
                (targetElement as HTMLElement), (x - markerSettings.offset.x), (y - markerSettings.offset.y));
        }
        return latLongValue;
    }
    private getClickLocation(targetId: string, pageX: number, pageY: number, targetElement: HTMLElement,
                             x: number, y: number): GeoPosition {
        let layerIndex: number = 0;
        let latLongValue: any;
        if (targetId.indexOf('_LayerIndex_') !== -1 && !this.isTileMap &&
            (parseInt(this.mouseDownEvent['x'], 10) === parseInt(this.mouseClickEvent['x'], 10)) &&
            (parseInt(this.mouseDownEvent['y'], 10) === parseInt(this.mouseClickEvent['y'], 10))) {
            layerIndex = parseFloat(targetId.split('_LayerIndex_')[1].split('_')[0]);
            if (this.layers[layerIndex as number].geometryType === 'Normal') {
                if (targetId.indexOf('_shapeIndex_') > -1) {
                    const location: MapLocation = getMousePosition(pageX, pageY, (targetElement as any).parentElement);
                    const minLongitude: number = Math.abs((-this.baseMapBounds.longitude.min) * this.mapLayerPanel.currentFactor);
                    const minLatitude: number = Math.abs(this.baseMapBounds.latitude.max * this.mapLayerPanel.currentFactor);
                    latLongValue = {
                        latitude: Math.abs(this.baseMapBounds.latitude.max - (location.y / this.mapLayerPanel.currentFactor)),
                        longitude: Math.abs((location.x / this.mapLayerPanel.currentFactor) + this.baseMapBounds.longitude.min)
                    };
                    if (this.baseMapBounds.longitude.min < 0 && minLongitude > location.x) {
                        (latLongValue as any).longitude = -(latLongValue as any).longitude;
                    }
                    if (this.baseMapBounds.latitude.min < 0 && minLatitude > location.y) {
                        (latLongValue as any).latitude = - (latLongValue as any).latitude;
                    }
                } else if (targetId.indexOf('_MarkerIndex_') > -1 && this.markerModule && !this.markerDragArgument) {
                    const markerIndex: number = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[0], 10);
                    const dataIndex: number = parseInt(targetId.split('_dataIndex_')[1].split('_')[0], 10);
                    if (!isNaN(markerIndex) && !isNaN(dataIndex)) {
                        const dataObject: any =
                            this.layers[layerIndex as number].markerSettings[markerIndex as number].dataSource[dataIndex as number];
                        latLongValue = { latitude: dataObject['latitude'], longitude: dataObject.longitude };
                    } else {
                        latLongValue = { latitude: null, longitude: null };
                    }
                } else if (targetId.indexOf('_MarkerIndex_') > -1 && this.markerModule && this.markerDragArgument) {
                    const element: HTMLElement = document.getElementById(this.element.id + '_LayerIndex_' + this.markerDragArgument.layerIndex);
                    const elementRect: ClientRect = element.getBoundingClientRect();
                    const location: MapLocation = new MapLocation(pageX > elementRect.left ? Math.abs(elementRect.left - pageX) : 0,
                        pageY > elementRect.top ? Math.abs(elementRect.top - pageY) : 0);
                    const minLongitude: number = Math.abs((-this.baseMapBounds.longitude.min) * this.mapLayerPanel.currentFactor);
                    const minLatitude: number = Math.abs(this.baseMapBounds.latitude.max * this.mapLayerPanel.currentFactor);
                    latLongValue = {
                        latitude: Math.abs(this.baseMapBounds.latitude.max - (location.y / (this.mapLayerPanel.currentFactor * this.scale))),
                        longitude: Math.abs((location.x / (this.mapLayerPanel.currentFactor * this.scale)) + this.baseMapBounds.longitude.min)
                    };
                    if (this.baseMapBounds.longitude.min < 0 && minLongitude > location.x) {
                        (latLongValue as any).longitude = -(latLongValue as any).longitude;
                    }
                    if (this.baseMapBounds.latitude.min < 0 && minLatitude > location.y) {
                        (latLongValue as any).latitude = - (latLongValue as any).latitude;
                    }
                } else { latLongValue = { latitude: null, longitude: null }; }
            } else {
                latLongValue = this.getGeoLocation(layerIndex, x, y);
            }
        } else if (this.isTileMap && (parseInt(this.mouseDownEvent['x'], 10) === parseInt(this.mouseClickEvent['x'], 10)) &&
            (parseInt(this.mouseDownEvent['y'], 10) === parseInt(this.mouseClickEvent['y'], 10))) {
            latLongValue = this.getTileGeoLocation(x, y);
        }
        return latLongValue;
    }

    private removeTileMap(): void {
        const animateElement: HTMLElement = document.getElementById(this.element.id + '_animated_tiles');
        if (!isNullOrUndefined(this.currentTiles) && animateElement.childElementCount < this.currentTiles.childElementCount) {
            for (let l: number = animateElement.childElementCount - 1; l >= this.currentTiles.childElementCount; l--) {
                animateElement.removeChild(animateElement.children[l as number]);
            }
        }
        this.currentTiles = null;
    }

    /**
     * This method is used to perform operations when mouse click on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public mouseEndOnMap(e: PointerEvent): boolean {
        const targetEle: Element = <Element>e.target;
        const targetId: string = targetEle.id;
        let pageX: number;
        let latitude: number = null;
        let longitude: number = null;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        let layerX: number = 0;
        let layerY: number = 0;
        const rect: ClientRect = this.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
        if (e.type.indexOf('touch') !== - 1) {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            layerX = pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            layerY = pageY - (this.isTileMap ? 10 : 0);
            target = <Element>touchArg.target;
            this.mouseClickEvent = { x: pageX, y: pageY };
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            layerX = e['layerX'];
            layerY = e['layerY'] - (this.isTileMap ? 10 : 0);
            target = <Element>e.target;
        }
        if (this.isTileMap) {
            this.removeTileMap();
        }
        if (this.isTouch) {
            if (targetEle.id.indexOf('_ToolBar') === -1) {
                const latLongValue: GeoPosition = this.getClickLocation(targetId, pageX, pageY, (targetEle as HTMLElement), pageX, pageY);
                if (!isNullOrUndefined(latLongValue)) {
                    latitude = latLongValue.latitude;
                    longitude = latLongValue.longitude;
                }
            }
            this.titleTooltip(e, pageX, pageY, true);
            if (!isNullOrUndefined(this.legendModule)) {
                this.legendTooltip(e, e.pageX, e.pageY, true);
            }
        }
        this.notify(Browser.touchEndEvent, e);
        if (e.cancelable && !this.isTouch) {
            e.preventDefault();
        }
        if (!isNullOrUndefined(this.markerDragArgument)) {
            const marker: any = this.markerDragArgument;
            this.mouseClickEvent['x'] = this.mouseDownEvent['x'];
            this.mouseClickEvent['y'] = this.mouseDownEvent['y'];
            const latLongValue: GeoPosition = this.getMarkerClickLocation(pageX, pageY, layerX, layerY, this.markerDragArgument, true);
            const markerObject: MarkerSettingsModel = this.layers[marker.layerIndex].markerSettings[marker.markerIndex];
            document.getElementById(this.element.id + "_svg").style.cursor = markerObject.enableDrag ? 'pointer' : 'grabbing';
            const dragEventArgs: IMarkerDragEventArgs = {
                name: 'markerDragEnd', x: pageX, y: pageY,
                latitude: latLongValue.latitude, longitude: latLongValue.longitude,
                layerIndex: marker.layerIndex, markerIndex: marker.markerIndex,
                dataIndex: marker.dataIndex
            };
            if (isNullOrUndefined(markerObject.latitudeValuePath) && isNullOrUndefined(markerObject.longitudeValuePath)) {
                const data: object  = markerObject.dataSource[marker.dataIndex];
                if (!isNullOrUndefined(data['Longitude']) && !isNullOrUndefined(data['Latitude'])) {
                    markerObject.dataSource[marker.dataIndex].Latitude = dragEventArgs.latitude;
                    markerObject.dataSource[marker.dataIndex].Longitude = dragEventArgs.longitude;
                } else {
                    markerObject.dataSource[marker.dataIndex].latitude = dragEventArgs.latitude;
                    markerObject.dataSource[marker.dataIndex].longitude = dragEventArgs.longitude;
                }
            } else {
                markerObject.dataSource[marker.dataIndex][markerObject.latitudeValuePath] = dragEventArgs.latitude;
                markerObject.dataSource[marker.dataIndex][markerObject.longitudeValuePath] = dragEventArgs.longitude;
            }
            this.markerDragId = '';
            this.markerDragArgument = null;
            this.trigger('markerDragEnd', dragEventArgs);
        } else {
            document.getElementById(this.element.id + "_svg").style.cursor = 'auto';
        }
        if (this.zoomModule && this.isDevice) {
            this.zoomModule.removeToolbarOpacity(this.isTileMap ? Math.round(this.tileZoomLevel) : this.scale, this.element.id + '_Zooming_');
            this.zoomModule.removeToolbarClass('', '', '', '', '');
        }
        return false;
    }
    /**
     * This method is used to perform operations when mouse is clicked down on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps
     * @returns {void}
     * @private
     */
    public mouseDownOnMap(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        this.mouseDownEvent = { x: e.x, y: e.y };
        if (e.type.indexOf('touch') !== - 1 && (e as any).changedTouches) {
            this.mouseDownEvent = { x: (e as any).changedTouches[0].pageX, y: (e as any).changedTouches[0].pageY };
        }
        if (this.isDevice && !isNullOrUndefined(this.mapsTooltipModule)) {
            this.mapsTooltipModule.renderTooltip(e);
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
        this.markerDragId = element.id;
        const animatedTiles: HTMLElement = document.getElementById(this.element.id + '_animated_tiles');
        if (this.isTileMap && !isNullOrUndefined(animatedTiles)) {
            this.currentTiles = (animatedTiles.cloneNode(true) as HTMLElement);
        }
        if (element.id.indexOf('_ToolBar') === -1) {
            const markerModule: Marker = this.markerModule;
            if (element.id.indexOf('shapeIndex') > -1 || element.id.indexOf('Tile') > -1) {
                this.mergeCluster();
            }
            if (markerModule) {
                markerModule.markerClick(e);
                markerModule.markerClusterClick(e);
            }
            if (this.bubbleModule) {
                this.bubbleModule.bubbleClick(e);
            }
        }
        this.notify(Browser.touchStartEvent, e);
    }

    /**
     * Merges the marker clusters.
     *
     * @returns {void}
     * @private
     */
    public mergeCluster(): void {
        if (this.markerModule && (this.markerModule.sameMarkerData.length > 0) &&
            (this.zoomModule ? this.zoomModule.isSingleClick : true)) {
            mergeSeparateCluster(this.markerModule.sameMarkerData, this, getElement(this.element.id + '_Markers_Group'));
            this.markerModule.sameMarkerData = [];
        }
    }

    /**
     * @param {PointerEvent} e - Specifies the pointer event.
     * @returns {void}
     * @private
     */
    public mapsOnRightClick(e: PointerEvent): void {
        const targetEle: Element = <Element>e.target;
        const targetId: string = targetEle.id;
        let latitude: number = null;
        let longitude: number = null;
        this.mouseClickEvent = this.mouseDownEvent = { x: e.x, y: e.y };
        if (targetEle.id.indexOf('_ToolBar') === -1) {
            const latLongValue: GeoPosition = this.getClickLocation(targetId, e.pageX, e.pageY, (targetEle as HTMLElement), e['layerX'], e['layerY']);
            if (!isNullOrUndefined(latLongValue)) {
                latitude = latLongValue.latitude;
                longitude = latLongValue.longitude;
            }
            const eventArgs: IMouseEventArgs = {
                cancel: false, name: rightClick, target: targetId, x: e.clientX, y: e.clientY,
                latitude: latitude, longitude: longitude,
                isShapeSelected: false
            };
            this.trigger('rightClick', eventArgs);
        }
    }

    /**
     * This method is used to perform operations when performing the double click operation on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event.
     * @returns {void}
     * @private
     */
    public mapsOnDoubleClick(e: PointerEvent): void {
        this.notify('dblclick', e);
        const targetElement: Element = <Element>e.target;
        const targetId: string = targetElement.id;
        let layerIndex: number = 0;
        let latLongValue: any;
        let latitude: number = null; let longitude: number = null;
        if (targetElement.id.indexOf('_ToolBar') === -1) {
            if (targetElement.id.indexOf('_LayerIndex_') !== -1 && !this.isTileMap && (this.mouseDownEvent['x'] === e.clientX)
                && (this.mouseDownEvent['y'] === e.clientY)) {
                layerIndex = parseFloat(targetElement.id.split('_LayerIndex_')[1].split('_')[0]);
                latLongValue = this.getGeoLocation(layerIndex, e['layerX'], e['layerY']);
                latitude = latLongValue['latitude']; longitude = latLongValue['longitude'];
            } else if (this.isTileMap && (this.mouseDownEvent['x'] === e.clientX)
                && (this.mouseDownEvent['y'] === e.clientY)) {
                latLongValue = this.getTileGeoLocation(e['layerX'], e['layerY']);
                latitude = latLongValue['latitude']; longitude = latLongValue['longitude'];
            }
            const doubleClickArgs: IMouseEventArgs = {
                cancel: false, name: doubleClick, x: e.clientX, y: e.clientY,
                target: targetId, latitude: latitude, longitude: longitude, isShapeSelected: null
            };
            this.trigger('doubleClick', doubleClickArgs);
        }
    }

    /**
     * This method is used to perform operations while performing mouse over on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
     * @private
     */
    public mouseMoveOnMap(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        let target: Element;
        const touches: TouchList = null;
        target = (e.type === 'touchmove') ? <Element>(<TouchEvent & PointerEvent>e).target :
            target = <Element>e.target;
        // if (target.id.indexOf('shapeIndex') !== -1 && !this.highlightSettings.enable) {
        //     triggerShapeEvent(target.id, this.highlightSettings, this, shapeHighlight);
        // }
        if (this.markerModule) {
            this.markerModule.markerMove(e);
            this.markerModule.markerClusterMouseMove(e);
        }
        if (this.bubbleModule) {
            this.bubbleModule.bubbleMove(e);
        }
        if (target.id.indexOf('MarkerIndex') == -1) {
            document.getElementById(this.element.id + "_svg").style.cursor = 'auto';
        }
        this.onMouseMove(e);
        this.notify(Browser.touchMoveEvent, e);
    }
    /**
     * This method is used to perform operations when mouse move event is performed on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
     * @private
     */
    public onMouseMove(e: PointerEvent): boolean {
        const element: Element = <Element>e.target;
        this.mouseMoveId = element['id'];
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        let touches: TouchList = null;
        let layerX: number = 0;
        let layerY: number = 0;
        if (e.type.indexOf('touch') == -1) {
            pageX = (<PointerEvent>e).pageX;
            pageY = (<PointerEvent>e).pageY;
            layerX = e['layerX'];
            layerY = e['layerY'] - (this.isTileMap ? 10 : 0);
            this.titleTooltip(e, e.pageX, e.pageY);
            if (!isNullOrUndefined(this.legendModule)) {
                this.legendTooltip(e, e.pageX, e.pageY, true);
            }
        } else {
            touches = (<TouchEvent & PointerEvent>e).touches;
            layerX = pageX = touches[0].clientX;
            layerY = pageY = touches[0].clientY - (this.isTileMap ? 10 : 0);
        }
        if (!isNullOrUndefined(this.markerDragArgument)) {
            const marker: any = this.markerDragArgument;
            this.mouseClickEvent['x'] = this.mouseDownEvent['x'];
            this.mouseClickEvent['y'] = this.mouseDownEvent['y'];
            this.getMarkerClickLocation(pageX, pageY, layerX, layerY, marker, false);
        }
        if (this.zoomModule) {
            this.zoomModule.removeToolbarOpacity(this.isTileMap ? Math.round(this.tileZoomLevel) : this.scale, (<HTMLElement>e.target).id)
        }
        return false;
    }

    private legendTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
        let legendText: string; let page: number = this.legendModule.currentPage;
        let legendIndex: string = (<HTMLElement>event.target).id.split('_Index_')[1];
        let collection: any;
        page = this.legendModule.totalPages.length <= this.legendModule.currentPage
            ? this.legendModule.totalPages.length - 1 : this.legendModule.currentPage < 0 ?
                0 : this.legendModule.currentPage;
        const count: number = this.legendModule.totalPages.length !== 0 ?
            this.legendModule.totalPages[page as number]['Collection'].length : this.legendModule.totalPages.length;
        for (let i: number = 0; i < count; i++) {
            collection = this.legendModule.totalPages[page as number]['Collection'][i as number];
            legendText = collection['DisplayText'];
            targetId = event.target['id'];
            legendIndex = event.target['id'].split('_Index_')[1];
            if ((targetId === (this.element.id + '_Legend_Text_Index_' + legendIndex)) &&
                ((<HTMLElement>event.target).textContent.indexOf('...') > -1) && collection['idIndex'] === parseInt(legendIndex, 10)) {
                showTooltip(
                    legendText, this.legendSettings.textStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight,
                    this.element.id + '_EJ2_Legend_Text_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch
                );
            }
        }
        if ((targetId !== (this.element.id + '_Legend_Text_Index_' + legendIndex))) {
            removeElement(this.element.id + '_EJ2_Legend_Text_Tooltip');
        }
    }

    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        if (targetId === (this.element.id + '_LegendTitle') && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            showTooltip(
                this.legendSettings.title.text, this.legendSettings.titleStyle.size, x, y, this.element.offsetWidth,
                this.element.offsetHeight, this.element.id + '_EJ2_LegendTitle_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch
            );
        } else {
            removeElement(this.element.id + '_EJ2_LegendTitle_Tooltip');
        }
        if ((targetId === (this.element.id + '_Map_title')) && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            showTooltip(
                this.titleSettings.text, this.titleSettings.textStyle.size || this.themeStyle.titleFontSize, x, y,
                this.element.offsetWidth, this.element.offsetHeight,
                this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch
            );
        } else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    }
    /*

    /**
     * This method is used to perform operations while resizing the window.
     *
     * @param e - Specifies the arguments of window resize event.
     */
    public mapsOnResize(e: Event): boolean {
        if (!this.isDestroyed && !this.isExportInitialTileMap) {
            this.isResize = this.isReset = true;
            const args: IResizeEventArgs = {
                cancel: false,
                name: resize,
                previousSize: this.availableSize,
                currentSize: calculateSize(this),
                maps: this
            };
            this.trigger(resize, args);
            if (!args.cancel) {
                if (this.resizeTo) {
                    clearTimeout(this.resizeTo);
                }
                if (!isNullOrUndefined(this.element) && this.element.classList.contains('e-maps')) {
                    this.resizeTo = setTimeout(
                        (): void => {
                            this.unWireEVents();
                            this.createSVG();
                            this.refreshing = true;
                            this.wireEVents();
                            this.render();
                            this.refreshing = false;
                        },
                        500);
                }
            }
        }
        return false;
    }

    /**
     * This method is used to zoom the map by specifying the center position.
     *
     * @param {number} centerPosition - Specifies the location of the maps to be zoomed as geographical coordinates.
     * @param {number} zoomFactor - Specifies the zoom factor for the maps.
     * @returns {void}
     */
    public zoomByPosition(centerPosition: { latitude: number, longitude: number }, zoomFactor: number): void {
        if (!this.isDestroyed) {
            this.zoomNotApplied = false;
            let isRefresh: boolean = this.zoomSettings.zoomFactor === zoomFactor;
            if (!this.isTileMap && this.zoomModule) {
                if (!isNullOrUndefined(centerPosition)) {
                    this.zoomSettings.zoomFactor = zoomFactor;
                    isRefresh = this.centerPosition.latitude === centerPosition.latitude &&
                        this.centerPosition.longitude === centerPosition.longitude ? true : isRefresh;
                    this.centerPosition = centerPosition;
                    this.isZoomByPosition = true;
                    this.mapScaleValue = null;
                }
                else {
                    this.zoomSettings.zoomFactor = zoomFactor;
                    this.isZoomByPosition = true;
                    this.mapScaleValue = null;
                }
            } else if (this.zoomModule) {
                this.tileZoomLevel = this.zoomSettings.zoomFactor = zoomFactor;
                isRefresh = this.centerPosition.latitude === centerPosition.latitude &&
                    this.centerPosition.longitude === centerPosition.longitude ? true : isRefresh;
                this.centerPosition = centerPosition;
                this.isZoomByPosition = true;
            }
            if (isRefresh) {
                this.refresh();
            }
        }
    }

    /**
     * This method is used to perform panning by specifying the direction.
     *
     * @param {PanDirection} direction - Specifies the direction in which the panning must be performed.
     * @param {PointerEvent | TouchEvent} mouseLocation - Specifies the location of the mouse pointer in maps in pixels.
     * @returns {void}
     */
    public panByDirection(direction: PanDirection, mouseLocation?: PointerEvent | TouchEvent): void {
        if (!this.isDestroyed) {
            let xDiff: number = 0; let yDiff: number = 0;
            switch (direction) {
            case 'Left':
                xDiff = -(this.mapAreaRect.width / 7);
                break;
            case 'Right':
                xDiff = (this.mapAreaRect.width / 7);
                break;
            case 'Top':
                yDiff = -(this.mapAreaRect.height / 7);
                break;
            case 'Bottom':
                yDiff = (this.mapAreaRect.height / 7);
                break;
            }
            if (this.zoomModule) {
                this.zoomModule.panning(direction, xDiff, yDiff, mouseLocation);
            }
        }
    }

    /**
     * This method is used to add the layers dynamically to the maps.
     *
     * @param {Object} layer - Specifies the layer to be added in the maps.
     * @returns {void}
     */
    public addLayer(layer: Object): void {
        if (!this.isDestroyed) {
            const mapsLayer: LayerSettingsModel[] = this.layers;
            mapsLayer.push(layer);
            this.isAddLayer = true;
            this.layers = mapsLayer;
        }
    }
    /**
     * This method is used to remove a layer from the maps.
     *
     * @param {number} index - Specifies the index number of the layer to be removed.
     * @returns {void}
     */
    public removeLayer(index: number): void {
        if (!this.isDestroyed) {
            const mapsLayer: LayerSettingsModel[] = this.layers;
            mapsLayer.splice(index, 1);
            this.layers = mapsLayer;
        }
    }
    /**
     * This method is used to add markers dynamically in the maps.
     * If we provide the index value of the layer in which the marker to be added and the settings
     * of the marker as parameters, the marker will be added in the location.
     *
     * @param {number} layerIndex - Specifies the index number of the layer.
     * @param {MarkerSettingsModel[]} markerCollection - Specifies the settings of the marker to be added.
     * @returns {void}
     */
    public addMarker(layerIndex: number, markerCollection: MarkerSettingsModel[]): void {
        if (!this.isDestroyed) {
            const layerEle: Element = document.getElementById(this.element.id + '_LayerIndex_' + layerIndex);
            if (markerCollection.length > 0 && layerEle) {
                for (const newMarker of markerCollection) {
                    this.layersCollection[layerIndex as number].markerSettings.push(new MarkerSettings(this, 'markerSettings', newMarker));
                }
                const markerModule: Marker = new Marker(this);
                markerModule.markerRender(this, layerEle, layerIndex, this.mapLayerPanel['currentFactor'], 'AddMarker');
                this.arrangeTemplate();
            }
        }
    }
    /**
     * This method is used to select the geometric shape element in the maps.
     *
     * @param {number} layerIndex - Specifies the index of the layer in maps.
     * @param {string | string[]} propertyName - Specifies the property name from the data source.
     * @param {string} name - Specifies the name of the shape, which is mapped from the data source, that is selected.
     * @param {boolean} enable - Specifies whether the shape should be selected or the selection should be removed.
     * @returns {void}
     */
    public shapeSelection(layerIndex: number, propertyName: string | string[], name: string, enable?: boolean): void {
        if (!this.isDestroyed) {
            let targetEle: Element;
            let subLayerIndex: number;
            const popertyNameArray: string[] = Array.isArray(propertyName) ? propertyName : Array(propertyName);
            if (isNullOrUndefined(enable)) {
                enable = true;
            }
            const selectionsettings: SelectionSettingsModel = this.layers[layerIndex as number].selectionSettings;
            if (!selectionsettings.enableMultiSelect && this.legendSelection && enable) {
                this.removeShapeSelection();
            }
            if (this.layers[layerIndex as number].type === 'SubLayer') {
                for (let i: number = 0; i < this.layersCollection.length; i++) {
                    if ((this.layersCollection[i as number].shapeData === this.layers[layerIndex as number].shapeData)) {
                        subLayerIndex = i;
                        break;
                    }
                }
            }
            if (selectionsettings.enable) {
                let targetId: string;
                let dataIndex: number;
                let shapeIndex: number;
                let indexValue: number;
                let shapeDataValue: any;
                let data: any;
                const shapeData: any[] = <any[]>this.layers[layerIndex as number].shapeData['features'];
                for (let i: number = 0; i < shapeData.length; i++) {
                    for (let j: number = 0; j < (<string[]>popertyNameArray).length; j++) {
                        const propertyName: string = !isNullOrUndefined(shapeData[i as number]['properties'][popertyNameArray[j as number]])
                            && isNaN(shapeData[i as number]['properties'][popertyNameArray[j as number]]) ?
                            shapeData[i as number]['properties'][popertyNameArray[j as number]].toLowerCase() : shapeData[i as number]['properties'][popertyNameArray[j as number]];
                        const shapeName: string = !isNullOrUndefined(name) && typeof name === 'string' ? name.toLowerCase() : name;
                        let k: number;
                        if (propertyName === shapeName) {
                            if (!isNullOrUndefined(this.layers[layerIndex as number].shapeSettings.colorValuePath)) {
                                k = checkShapeDataFields(
                                    <any[]>this.layers[layerIndex as number].dataSource, shapeData[i as number]['properties'],
                                    this.layers[layerIndex as number].shapeDataPath, this.layers[layerIndex as number].shapePropertyPath,
                                    this.layers[layerIndex as number]);
                            }
                            const baseLayer: LayerSettings = <LayerSettings>this.layers[layerIndex as number];
                            if (this.baseLayerIndex >= 0 && baseLayer.isBaseLayer) {
                                indexValue = 0;
                            } else if (this.layers[layerIndex as number].type === 'SubLayer') {
                                indexValue = subLayerIndex;
                            }
                            targetId = this.element.id + '_' + 'LayerIndex_' + indexValue + '_shapeIndex_' + i + '_dataIndex_' + k;
                            targetEle = getElement(targetId);
                            if (isNullOrUndefined(k) && isNullOrUndefined(targetEle)) {
                                targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_null';
                                targetEle = getElement(targetId);
                            }
                            shapeIndex = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                            shapeDataValue = this.layers[layerIndex as number].shapeData['features']['length'] > shapeIndex ?
                                this.layers[layerIndex as number].shapeData['features'][shapeIndex as number]['properties'] : null;
                            dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                            data = isNullOrUndefined(dataIndex) ? null : this.layers[layerIndex as number].dataSource[dataIndex as number];
                            if (enable) {
                                triggerItemSelectionEvent(selectionsettings, this, targetEle, shapeDataValue, data);
                                this.shapeSelectionClass = getElement('ShapeselectionMap');
                                if (this.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1) {
                                    this.legendModule.shapeHighLightAndSelection(
                                        targetEle, data, selectionsettings, 'selection', layerIndex);
                                }
                                const shapeToggled: boolean = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                                if (shapeToggled) {
                                    targetEle.setAttribute('class', 'ShapeselectionMapStyle');
                                    if (this.selectedElementId.indexOf(targetEle.getAttribute('id')) === -1) {
                                        this.selectedElementId.push(targetEle.getAttribute('id'));
                                    }
                                    if (!selectionsettings.enableMultiSelect) { return; }
                                }
                            } else {
                                this.legendSelection = (!selectionsettings.enableMultiSelect && !this.legendSelection) ?
                                    true : this.legendSelection;
                                if (this.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1 &&
                                    targetEle.getAttribute('class') === 'ShapeselectionMapStyle') {
                                    this.legendModule.shapeHighLightAndSelection(
                                        targetEle, data, selectionsettings, 'selection', layerIndex);
                                }
                                const shapeToggled: boolean = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                                if (shapeToggled) {
                                    removeClass(targetEle);
                                    const selectedElementIdIndex: number = this.selectedElementId.indexOf(targetEle.getAttribute('id'));
                                    if (selectedElementIdIndex !== -1) {
                                        this.selectedElementId.splice(selectedElementIdIndex, 1);
                                        if (!selectionsettings.enableMultiSelect && this.legendSelection
                                            && this.selectedElementId.length > 0) {
                                            this.removeShapeSelection();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * This method is used to zoom the maps based on the provided coordinates.
     *
     * @param {number} minLatitude - Specifies the minimum latitude of the location to be zoomed.
     * @param {number} minLongitude - Specifies the minimum latitude of the location to be zoomed.
     * @param {number} maxLatitude - Specifies the maximum latitude of the location to be zoomed.
     * @param {number} maxLongitude - Specifies the maximum longitude of the location to be zoomed.
     * @returns {void}
     */
    public zoomToCoordinates(minLatitude: number, minLongitude: number, maxLatitude: number, maxLongitude: number): void {
        if (!this.isDestroyed) {
            let centerLatitude: number;
            let centerLongtitude: number;
            let isTwoCoordinates: boolean = false;
            this.centerPosition = {
                latitude: null,
                longitude: null
            };
            this.isZoomByPosition = false;
            if (isNullOrUndefined(maxLatitude) && isNullOrUndefined(maxLongitude)
                || isNullOrUndefined(minLatitude) && isNullOrUndefined(minLongitude)) {
                minLatitude = isNullOrUndefined(minLatitude) ? 0 : minLatitude;
                minLongitude = isNullOrUndefined(minLatitude) ? 0 : minLongitude;
                maxLatitude = isNullOrUndefined(maxLatitude) ? minLatitude : maxLatitude;
                maxLongitude = isNullOrUndefined(maxLongitude) ? minLongitude : maxLongitude;
                isTwoCoordinates = true;
            }
            if (minLatitude > maxLatitude) {
                [minLatitude, maxLatitude] = [maxLatitude, minLatitude];
            }
            if (minLongitude > maxLongitude) {
                [minLongitude, maxLongitude] = [maxLongitude, minLongitude];
            }
            if (!isTwoCoordinates) {
                centerLatitude = (minLatitude + maxLatitude) / 2;
                centerLongtitude = (minLongitude + maxLongitude) / 2;
            } else {
                centerLatitude = (minLatitude + maxLatitude);
                centerLongtitude = (minLongitude + maxLongitude);
            }
            this.centerLatOfGivenLocation = centerLatitude;
            this.centerLongOfGivenLocation = centerLongtitude;
            this.minLatOfGivenLocation = minLatitude;
            this.minLongOfGivenLocation = minLongitude;
            this.maxLatOfGivenLocation = maxLatitude;
            this.maxLongOfGivenLocation = maxLongitude;
            this.zoomNotApplied = true;
            this.scaleOfGivenLocation = calculateZoomLevel(minLatitude, maxLatitude, minLongitude, maxLongitude,
                                                           this.mapAreaRect.width, this.mapAreaRect.height, this, true);
            const zoomArgs: IMapZoomEventArgs = {
                cancel: false, name: 'zoom', type: zoomIn, maps: this,
                tileTranslatePoint: {}, translatePoint: {},
                tileZoomLevel: this.isTileMap ? { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation } : {},
                scale: !this.isTileMap ? { previous: this.scale, current: this.scaleOfGivenLocation } :
                    { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation }
            };
            this.trigger('zoom', zoomArgs);
            this.refresh();
        }
    }

    /**
     * This method is used to remove multiple selected shapes in the maps.
     *
     * @returns {void}
     */
    private removeShapeSelection(): void {
        const selectedElements: number = this.selectedElementId.length;
        for (let i: number = 0; i < selectedElements; i++) {
            removeClass(getElementByID(this.selectedElementId[0]));
            this.selectedElementId.splice(0, 1);
        }
        if (this.legendSettings.visible) {
            const legendSelectedElements: number = this.legendSelectionCollection.length;
            for (let i: number = 0; i < legendSelectedElements; i++) {
                removeClass(getElementByID(this.legendSelectionCollection[i as number]['legendElement']['id']));
                this.selectedLegendElementId.splice(0, 1);
            }
        }
        this.shapeSelectionItem = [];
        this.legendSelectionCollection = [];

    }

    /**
     * This method is used to set culture for maps.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * This method to set locale constants to the maps.
     *
     * @returns {void}
     */
    private setLocaleConstants(): void {
        // Need to modify after the api confirm
        this.defaultLocalConstants = {
            ZoomIn: 'Zoom in',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom out',
            Pan: 'Pan',
            Reset: 'Reset',
            ImageNotFound: 'Image Not Found'
        };
    }

    /**
     * This method destroys the maps. This method removes the events associated with the maps and disposes the objects created for rendering and updating the maps.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.unWireEVents();
        if (!isNullOrUndefined(this.mapsTooltipModule)) {
            this.mapsTooltipModule.removeEventListener();
        }
        super.destroy();
        this.shapeSelectionItem = [];
        this.toggledShapeElementId = [];
        this.toggledLegendId = [];
        this.legendSelectionCollection = [];
        this.selectedLegendElementId = [];
        this.selectedNavigationElementId = [];
        this.selectedBubbleElementId = [];
        this.selectedMarkerElementId = [];
        this.selectedElementId = [];
        this.dataLabelShape = [];
        this.zoomShapeCollection = [];
        this.zoomLabelPositions = [];
        this.mouseDownEvent = { x: null, y: null };
        this.mouseClickEvent = { x: null, y: null };
        this.formatFunction = null;
        //TODO: Calling the below code throws spec issue.
        //this.renderer = null;
        this.availableSize = new Size(0, 0);
        if (document.getElementById('mapsmeasuretext')) {
            document.getElementById('mapsmeasuretext').remove();
        }
        this.removeSvg();
    }

    /**
     * Gets component name
     *
     * @returns {string} - Returns the string value
     * @private
     */
    public getModuleName(): string {
        return 'maps';
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     *
     * @returns {string} - Returns the string value
     * @private
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['translatePoint', 'zoomSettings', 'mapScaleValue', 'tileTranslatePoint', 'baseTranslatePoint',
            'scale', 'zoomPersistence', 'defaultState', 'markerZoomedState', 'initialCheck', 'initialZoomLevel', 'initialTileTranslate',
            'applyZoomReset', 'markerZoomFactor'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {MapsModel} newProp - Specifies the new property
     * @param {MapsModel} oldProp - Specifies the old property
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: MapsModel, oldProp: MapsModel): void {
        if (!this.isDestroyed) {
            let render: boolean = false; let isMarker: boolean = false; let isLayer: boolean = false;
            let isStaticMapType: boolean = false;
            let layerEle: Element;
            if (newProp['layers']) {
                const newLayerLength: number = Object.keys(newProp['layers']).length;
                layerEle = document.getElementById(this.element.id + '_LayerIndex_' + (newLayerLength - 1));
            }
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layers':
                case 'projectionType':
                case 'centerPosition':
                case 'legendSettings':
                case 'baseLayerIndex':
                    if (prop === 'layers') {
                        isLayer = true;
                        const layerPropLength: number = Object.keys(newProp.layers).length;
                        for (let x: number = 0; x < layerPropLength; x++) {
                            if (!isNullOrUndefined(newProp.layers[x as number])) {
                                const collection: string[] = Object.keys(newProp.layers[x as number]);
                                for (const collectionProp of collection) {
                                    if ((collectionProp === 'layerType' && newProp.layers[x as number].layerType !== 'Geometry') ||
                                        (isNullOrUndefined(this.layers[x as number].shapeData)
                                            && !isNullOrUndefined(this.layers[x as number].urlTemplate) && this.layers[x as number].urlTemplate !== '')) {
                                        this.isReset = true;
                                    } else if (collectionProp === 'markerSettings') {
                                        isMarker = true;
                                    } else if (collectionProp === 'staticMapType') {
                                        isStaticMapType = true;
                                    }
                                }
                            }
                        }
                    }
                    render = true;
                    break;
                case 'zoomSettings':
                    if (!isNullOrUndefined(oldProp.zoomSettings)) {
                        if (newProp.zoomSettings.zoomFactor !== oldProp.zoomSettings.zoomFactor && !isLayer) {
                            render = false;
                        } else if (newProp.zoomSettings.shouldZoomInitially !== oldProp.zoomSettings.shouldZoomInitially) {
                            this.zoomSettings.zoomFactor = 1;
                            render = true;
                        } else if (newProp.zoomSettings.enable !== oldProp.zoomSettings.enable) {
                            this.zoomSettings.zoomFactor = 1;
                            render = true;
                        } else {
                            render = true;
                        }
                    }
                    break;
                case 'locale':
                case 'currencyCode':
                    super.refresh();
                    break;
                }
            }
            if (render) {
                if (newProp.layers && isMarker) {
                    removeElement(this.element.id + '_Markers_Group');
                    if (this.isTileMap) {
                        this.mapLayerPanel.renderTileLayer(this.mapLayerPanel, this.layers['currentFactor'], (this.layers.length - 1));
                    } else {
                        this.render();
                    }
                } else if (newProp.layers && isStaticMapType) {
                    this.mapLayerPanel.renderGoogleMap(this.layers[this.layers.length - 1].key, this.staticMapZoom);
                } else {
                    this.createSVG();
                    this.renderElements();
                }
            }
        }
    }
    /**
     * To provide the array of modules needed for maps rendering
     *
     * @returns {ModuleDeclaration[]} - Returns the modules
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        const isVisible: { layer: boolean, bubble: boolean, tooltip: boolean, selection: boolean, highlight: boolean } =
            this.findVisibleLayers(this.layers);
        let annotationEnable: boolean = false;
        this.annotations.map((annotation: Annotation) => {
            annotationEnable = annotation.content != null;
        });

        if (this.isBubbleVisible()) {
            modules.push({
                member: 'Bubble',
                args: [this]
            });
        }
        if (isVisible.highlight) {
            modules.push({
                member: 'Highlight',
                args: [this]
            });
        }
        if (isVisible.selection) {
            modules.push({
                member: 'Selection',
                args: [this]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.zoomSettings.enable || this.zoomSettings.zoomFactor > this.zoomSettings.minZoom) {
            modules.push({
                member: 'Zoom',
                args: [this]
            });
        }

        if (this.isMarkersVisible()) {
            modules.push({
                member: 'Marker',
                args: [this]
            });
        }


        if (this.isDataLabelVisible()) {
            modules.push({
                member: 'DataLabel',
                args: [this]
            });
        }

        if (this.isNavigationVisible()) {
            modules.push({
                member: 'NavigationLine',
                args: [this]
            });
        }

        if (isVisible.tooltip) {
            modules.push({
                member: 'MapsTooltip',
                args: [this]
            });
        }
        if (annotationEnable) {
            modules.push({
                member: 'Annotations',
                args: [this, Annotations]
            });
        }
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }

        return modules;
    }

    /**
     * To find marker visibility
     *
     * @returns {boolean} - Returns whether the markers are visible or not.
     */

    private isMarkersVisible(): boolean {
        let isVisible: boolean = false;
        Array.prototype.forEach.call(this.layers, (layer: LayerSettings) => {
            for (let i: number = 0; i < layer.markerSettings.length; i++) {
                if (layer.markerSettings[i as number].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    }

    /**
     * To find DataLabel visibility
     *
     * @returns {boolean} - Returns whether the data labels are visible or not.
     */

    private isDataLabelVisible(): boolean {
        let isVisible: boolean = false;
        for (let i: number = 0; i < this.layers.length; i++) {
            if (this.layers[i as number].dataLabelSettings.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }

    /**
     * To find navigation line visibility
     *
     * @returns {boolean} - Returns whether the navigation lines are visible or not.
     */

    private isNavigationVisible(): boolean {
        let isVisible: boolean = false;
        Array.prototype.forEach.call(this.layers, (layer: LayerSettings) => {
            for (let i: number = 0; i < layer.navigationLineSettings.length; i++) {
                if (layer.navigationLineSettings[i as number].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    }

    /**
     * To find marker visibility
     */

    private isBubbleVisible(): boolean {
        let isVisible: boolean = false;
        for (const layer of this.layers) {
            if (this.getBubbleVisible(layer)) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * To find the bubble visibility from layer
     *
     * @param {LayerSettingsModel} layer - Spcifies the layer settings model
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public getBubbleVisible(layer: LayerSettingsModel): boolean {
        let isVisible: boolean = false;
        for (const bubble of layer.bubbleSettings) {
            if (bubble.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * This method handles the printing functionality for the maps.
     *
     * @param {string[] | string | Element} id - Specifies the element to be printed.
     * @returns {void}
     */
    public print(id?: string[] | string | Element): void {
        if ((this.allowPrint) && (this.printModule) && !this.isDestroyed) {
            this.printModule.print(this, id);
        }
    }
    /**
     * This method handles the export functionality for the maps.
     *
     * @param {ExportType} type - Specifies the type of the exported file.
     * @param {string} fileName - Specifies the name of the file with which the rendered maps need to be exported.
     * @param {PdfPageOrientation} orientation - Specifies the orientation of the PDF document while exporting.
     * @param {boolean} allowDownload - Specifies whether to download as a file or get as base64 string for the file.
     * @returns {Promise<string>} - Specifies the base64 string of the exported image which is returned when the `allowDownload` is set to false.
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {
        if (!this.isDestroyed) {
            if (isNullOrUndefined(allowDownload)) {
                allowDownload = true;
            }
            if ((type !== 'PDF') && (this.allowImageExport) && (this.imageExportModule)) {
                return new Promise((resolve: any, reject: any) => {
                    resolve(this.imageExportModule.export(this, type, fileName, allowDownload));
                });
            } else if ((this.allowPdfExport) && (this.pdfExportModule)) {
                return new Promise((resolve: any, reject: any) => {
                    resolve(this.pdfExportModule.export(this, type, fileName, allowDownload, orientation));
                });
            }
        }
        return null;
    }

    /**
     * This method is used to get the Bing maps URL.
     *
     * @param {string} url - Specifies the URL of the Bing maps along with the API key.
     * @returns {Promise<string>} - Returns the processed Bing URL as `Promise`.
     */
    public getBingUrlTemplate(url: string): Promise<string> {
        let promise: Promise<string>;
        if (!this.isDestroyed) {
            promise = new Promise((resolve: any, reject: any) => {
                const fetchApi : Fetch = new Fetch({
                    url: url
                });
                fetchApi.onSuccess = (json: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const resource: any = json['resourceSets'][0]['resources'][0];
                    resolve(<string>resource['imageUrl']);
                };
                fetchApi.send();
            });
        }
        return promise;
    }

    /**
     * To find visibility of layers and markers for required modules load.
     *
     * @param {LayerSettingsModel[]} layers - Specifies the layers.
     * @param {boolean} isLayerVisible - Specifies whether the layer is visible or not.
     * @param {boolean} isBubblevisible - Specifies whether the bubble is visible or not.
     * @param {boolean} istooltipVisible - Specifies whether the tooltip is visible or not.
     * @param {boolean} isSelection - Specifies whether the shape is selectd or not.
     * @param {boolean} isHighlight - Specfies whether the shape is highlighted or not.
     * @returns {boolean} - Returns the boolean value
     */
    private findVisibleLayers(
        layers: LayerSettingsModel[], isLayerVisible: boolean = false,
        isBubblevisible: boolean = false, istooltipVisible: boolean = false, isSelection: boolean = false,
        isHighlight: boolean = false
    ): { layer: boolean, bubble: boolean, tooltip: boolean, selection: boolean, highlight: boolean } {
        let bubbles: BubbleSettingsModel[];
        let markers: MarkerSettingsModel[];
        let navigationLine: NavigationLineSettingsModel[];
        for (const layer of layers) {
            isLayerVisible = layer.visible || isLayerVisible;
            if (layer.visible) {
                bubbles = layer.bubbleSettings;
                markers = layer.markerSettings;
                navigationLine = layer.navigationLineSettings;
                for (const navigation of navigationLine) {
                    if (navigation.visible) {
                        isSelection = navigation.highlightSettings.enable || isSelection;
                        isHighlight = navigation.selectionSettings.enable || isHighlight;
                    }
                }
                for (const marker of markers) {
                    if (marker.visible) {
                        istooltipVisible = marker.tooltipSettings.visible || istooltipVisible;
                        isSelection = marker.selectionSettings.enable || isSelection;
                        isHighlight = marker.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) { break; }
                }
                for (const bubble of bubbles) {
                    if (bubble.visible) {
                        istooltipVisible = bubble.tooltipSettings.visible || istooltipVisible;
                        isSelection = bubble.selectionSettings.enable || isSelection;
                        isHighlight = bubble.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) { break; }
                }
                istooltipVisible = layer.tooltipSettings.visible || istooltipVisible;
                isSelection = layer.selectionSettings.enable || isSelection;
                isHighlight = layer.highlightSettings.enable || isHighlight;
            }
            if (isLayerVisible && isBubblevisible && istooltipVisible) { break; }
        }
        return {
            layer: isLayerVisible, bubble: isBubblevisible, tooltip: istooltipVisible,
            selection: isSelection, highlight: isHighlight
        };
    }
    /**
     * This method is used to get the geographical coordinates for location points in pixels when shape maps are rendered in the maps.
     *
     * @param {number} layerIndex - Specifies the index number of the layer of the maps.
     * @param {number} x - Specifies the x value in pixel.
     * @param {number} y - Specifies the y value in pixel.
     * @returns {GeoPosition}- Returns the geographical coordinates.
     */
    public getGeoLocation(layerIndex: number, x: number, y: number): GeoPosition {
        let latitude: number = 0;
        let longitude: number = 0;
        if (!this.isDestroyed) {
            const container: HTMLElement = document.getElementById(this.element.id);
            const pageX: number = x - (isNullOrUndefined(this.markerDragArgument) ? container.offsetLeft : 0);
            const pageY: number = y - (isNullOrUndefined(this.markerDragArgument) ? container.offsetTop : 0);
            const currentLayer: LayerSettings = <LayerSettings>this.layersCollection[layerIndex as number];
            const translate: any = getTranslate(this, currentLayer, false);
            const translatePoint: Point = translate['location'] as Point;
            const translatePointX: number = translatePoint.x * this.scale;
            const translatePointY: number = translatePoint.y * this.scale;
            const mapSize: number = (Math.min(this.mapAreaRect.height, this.mapAreaRect.width)
                * this.mapLayerPanel['currentFactor']) * this.scale;
            const xx: number = (this.clip(pageX - translatePointX, 0, mapSize - 1) / mapSize) - 0.5;
            const yy: number = 0.5 - (this.clip(pageY - translatePointY, 0, mapSize - 1) / mapSize);
            latitude = 90 - 360 * Math.atan(Math.exp(-yy * 2 * Math.PI)) / Math.PI;
            longitude = 360 * xx;
        }
        return { latitude: latitude, longitude: longitude };
    }

    private clip(value: number, minVal: number, maxVal: number): number {
        return Math.min(Math.max(value, minVal), maxVal);
    }

    /**
     * This method is used to get the geographical coordinates for location points in pixels when an online map provider is rendered in the maps.
     *
     * @param {number} x - Specifies the x value in pixel.
     * @param {number} y - Specifies the y value in pixel.
     * @returns {GeoPosition} - Returns the geographical coordinates.
     */
    public getTileGeoLocation(x: number, y: number): GeoPosition {
        let latitude: number = 0;
        let longitude: number = 0;
        if (!this.isDestroyed) {
            const container: HTMLElement = document.getElementById(this.element.id);
            const ele: HTMLElement = document.getElementById(this.element.id + '_tile_parent');
            const latLong: any = this.pointToLatLong(
                x + this.mapAreaRect.x - (ele.offsetLeft - (isNullOrUndefined(this.markerDragArgument) ? container.offsetLeft : 0)),
                y + this.mapAreaRect.y - (ele.offsetTop - (isNullOrUndefined(this.markerDragArgument) ? container.offsetTop : 0)));
            latitude = latLong['latitude'];
            longitude = latLong['longitude'];
        }
        return { latitude: latitude, longitude: longitude };
    }
    /**
     * This method is used to convert the point in pixels to latitude and longitude in maps.
     *
     * @param {number} pageX - Specifies the x position value in pixels.
     * @param {number} pageY - Specifies the y position value in pixels.
     * @returns {Object} - Returns the latitude and longitude values.
     */
    public pointToLatLong(pageX: number, pageY: number): Object {
        let latitude: number = 0;
        let longitude: number = 0;
        if (!this.isDestroyed) {
            const padding: number = this.layers[this.layers.length - 1].layerType === 'GoogleStaticMap' ? 0 : 10;
            pageY = pageY + padding;
            const mapSize: number = 256 * Math.pow(2, this.tileZoomLevel);
            const x1: number = (this.clip(pageX - (this.translatePoint.x * this.scale), 0, mapSize - 1) / mapSize) - 0.5;
            const y1: number = 0.5 - (this.clip(pageY - (this.translatePoint.y * this.scale), 0, mapSize - 1) / mapSize);
            latitude = 90 - 360 * Math.atan(Math.exp(-y1 * 2 * Math.PI)) / Math.PI;
            longitude = 360 * x1;
        }
        return { latitude: latitude, longitude: longitude };
    }
}
