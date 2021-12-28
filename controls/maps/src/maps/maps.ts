/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/**
 * Maps Component file
 */
import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Ajax } from '@syncfusion/ej2-base';
import { EventHandler, Browser, EmitType, isNullOrUndefined, createElement, setValue, extend } from '@syncfusion/ej2-base';
import { Event, remove, L10n, Collection, Internationalization, Complex } from '@syncfusion/ej2-base';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Size, createSvg, Point, removeElement, triggerShapeEvent, showTooltip, checkShapeDataFields, MapLocation, getMousePosition, calculateSize } from './utils/helper';
import { getElement, removeClass, getTranslate, triggerItemSelectionEvent, mergeSeparateCluster, customizeStyle } from './utils/helper';
import { createStyle } from './utils/helper';
import { ZoomSettings, LegendSettings, Tile } from './model/base';
import { LayerSettings, TitleSettings, Border, Margin, MapsAreaSettings, Annotation, CenterPosition } from './model/base';
import { ZoomSettingsModel, LegendSettingsModel, LayerSettingsModel, BubbleSettingsModel } from './model/base-model';
import { MarkerSettingsModel, SelectionSettingsModel , InitialMarkerSelectionSettingsModel} from './model/base-model';
import { TitleSettingsModel, BorderModel, MarginModel, CenterPositionModel, InitialShapeSelectionSettingsModel } from './model/base-model';
import { MapsAreaSettingsModel, AnnotationModel } from './model/base-model';
import { Bubble } from './layers/bubble';
import { Legend } from './layers/legend';
import { Marker } from './layers/marker';
import { Highlight } from './user-interaction/highlight';
import { Selection } from './user-interaction/selection';
import { MapsTooltip } from './user-interaction/tooltip';
import { Zoom } from './user-interaction/zoom';
import { load, click, rightClick, loaded, doubleClick, resize, shapeSelected, itemSelection, zoomIn } from './model/constants';
import { ProjectionType, MapsTheme, PanDirection, TooltipGesture } from './utils/enum';
import { MapsModel } from './maps-model';
import { getThemeStyle } from './model/theme';
import { BingMap } from './layers/bing-map';
import { ILoadEventArgs, ILoadedEventArgs, IMouseEventArgs, IResizeEventArgs, ITooltipRenderEventArgs } from './model/interface';
import { GeoPosition, ITooltipRenderCompleteEventArgs, ILegendRenderingEventArgs } from './model/interface';
import { ILayerRenderingEventArgs, IShapeRenderingEventArgs, IMarkerRenderingEventArgs, IMarkerClickEventArgs } from './model/interface';
import { IMarkerMoveEventArgs, ILabelRenderingEventArgs, IBubbleMoveEventArgs, IBubbleClickEventArgs } from './model/interface';
import { IMarkerClusterClickEventArgs, IMarkerClusterMoveEventArgs, IMarkerClusterRenderingEventArgs } from './model/interface';
import { ISelectionEventArgs, IShapeSelectedEventArgs, IMapPanEventArgs, IMapZoomEventArgs } from './model/interface';
import { IBubbleRenderingEventArgs, IAnimationCompleteEventArgs, IPrintEventArgs, IThemeStyle } from './model/interface';
import { LayerPanel } from './layers/layer-panel';
import { GeoLocation, Rect, RectOption, measureText, getElementByID, MapAjax, processResult } from '../maps/utils/helper';
import { findPosition, textTrim, TextOption, renderTextElement, convertGeoToPoint, calculateZoomLevel } from '../maps/utils/helper';
import { Annotations } from '../maps/user-interaction/annotation';
import { FontModel, DataLabel, MarkerSettings, IAnnotationRenderingEventArgs } from './index';
import { NavigationLineSettingsModel, changeBorderWidth } from './index';
import { NavigationLine } from './layers/navigation-selected-line';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ExportType } from '../maps/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { Print } from './model/print';
import { PdfExport } from './model/export-pdf';
import { ImageExport } from './model/export-image';

/**
 * Represents the Maps control.
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
     * Sets and gets the module to add bubbles in the maps component.
     */
    public bubbleModule: Bubble;
    /**
     * Sets and get the module to add the marker in the maps component.
     */
    public markerModule: Marker;
    /**
     * Sets and gets the module to add the data-label in the maps component.
     */
    public dataLabelModule: DataLabel;
    /**
     * Sets and gets the module to highlight the element when mouse has hovered on it in maps.
     */
    public highlightModule: Highlight;
    /**
     * Sets and gets the module to add the navigation lines in the maps component.
     */
    public navigationLineModule: NavigationLine;
    /**
     * Sets and gets the module to add the legend in maps.
     */
    public legendModule: Legend;
    /**
     * Sets and gets the module to select the geometric shapes when clicking in maps.
     */
    public selectionModule: Selection;
    /**
     * Sets and gets the module to add the tooltip when mouse has hovered on an element in maps.
     */
    public mapsTooltipModule: MapsTooltip;
    /**
     * Sets and gets the module to add the zooming operations in maps.
     */
    public zoomModule: Zoom;
    /**
     * Sets and gets the module to add annotation elements in maps.
     */
    public annotationsModule: Annotations;
    /**
     * This module enables the print functionality in Maps control.
     *
     * @private
     */
    public printModule: Print;
    /**
     * This module enables the export to PDF functionality in Maps control.
     *
     * @private
     */
    public pdfExportModule: PdfExport;
    /**
     * This module enables the export to image functionality in Maps control.
     *
     * @private
     */
    public imageExportModule: ImageExport;


    // Maps pblic API Declaration

    /**
     * Sets and gets the background color of the maps container.
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
     * Sets and gets the format in which the text in the maps are to be rendered.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Sets and gets the width in which the maps is to be rendered.
     *
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * Sets and gets the height in which the maps is to be rendered.
     *
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * Sets and gets the mode in which the tooltip is to be displayed.
     * The tooltip can be rendered on mouse move, click or double clicking on the
     * element on the map.
     *
     * @default 'MouseMove'
     */
    @Property('MouseMove')
    public tooltipDisplayMode: TooltipGesture;
    /**
     * Enables or disables the print functionality in map.
     *
     * @default false
     */
    @Property(false)
    public allowPrint: boolean;
    /**
     * Enables or disables the export to image functionality in map.
     *
     * @default false
     */
    @Property(false)
    public allowImageExport: boolean;
    /**
     * Enables or disables the export to PDF functionality in map.
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**
     * Sets and gets the title to be displayed for maps.
     */
    @Complex<TitleSettingsModel>({}, TitleSettings)
    public titleSettings: TitleSettingsModel;
    /**
     * Sets and gets the options to customize the zooming operations in maps.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;
    /**
     * Sets and gets the options to customize the legend of the maps.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;
    /**
     * Sets and gets the options to customize the layers of the maps.
     */
    @Collection<LayerSettingsModel>([], LayerSettings)
    public layers: LayerSettingsModel[];
    /**
     * Sets and gets the options for customizing the annotation of maps.
     */
    @Collection<AnnotationModel>([], Annotation)
    public annotations: AnnotationModel[];

    /**
     * Sets and gets the options to customize the margins of the maps.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets and gets the options for customizing the color and width of the maps border.
     */
    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Set and gets the theme supported for the maps.
     *
     * @default Material
     */
    @Property('Material')
    public theme: MapsTheme;
    /**
     * Sets and gets the projection type for the maps.
     *
     * @default Mercator
     */
    @Property('Mercator')
    public projectionType: ProjectionType;
    /**
     * Sets and gets the base map index of maps. It provides the option to select which layer to be visible in the maps.
     *
     * @default 0
     */
    @Property(0)
    public baseLayerIndex: number;

    /**
     * Sets and gets the description for maps.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Sets and gets the tab index value for the maps.
     *
     * @default 1
     */
    @Property(1)
    public tabIndex: number;
    /**
     * Sets and gets the center position of the maps.
     */
    @Complex<CenterPositionModel>({ latitude: null, longitude: null }, CenterPosition)
    public centerPosition: CenterPositionModel;
    /**
     * Sets and gets the options to customize the area around the map.
     */
    @Complex<MapsAreaSettingsModel>({}, MapsAreaSettings)
    public mapsArea: MapsAreaSettingsModel;
    /**
     * Triggers when the map is on load.
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
     * Triggers when clicking an element in maps.
     *
     * @event click
     */
    @Event()
    public click: EmitType<IMouseEventArgs>;
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
     * Triggers when resizing the maps.
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
     * Triggers when clicking a shape in maps.
     *
     * @event shapeSelected
     */
    @Event()
    public shapeSelected: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers when clicking the shape on maps and before the selection is applied.
     *
     * @event itemSelection
     */
    @Event()
    public itemSelection: EmitType<ISelectionEventArgs>;
    /**
     * Trigger when mouse move on the shape in maps and before the shape gets highlighted.
     *
     * @event itemHighlight
     */
    @Event()
    public itemHighlight: EmitType<ISelectionEventArgs>;
    /**
     * Triggers when mouse move on the shape in maps and before the shape gets highlighted.
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
     * Triggers when clicking on the maps marker element.
     *
     * @event markerClick
     */
    @Event()
    public markerClick: EmitType<IMarkerClickEventArgs>;

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
     * Triggers after the animation completed in the maps component.
     *
     * @event animationComplete
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before rendering the annotation in maps.
     *
     * @event annotationRendering
     */
    @Event()
    public annotationRendering: EmitType<IAnnotationRenderingEventArgs>;

    /**
     * Triggers before the zoom operations in the maps such as zoom in and zoom out.
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
    public isReset: boolean;
    /**
     * @private
     */
    public totalRect: Rect;
    /**
     *
     * Specifies whether the shape is selected in the maps or not.
     *
     * @returns {boolean} - Returns the boolean value.
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
    public tileZoomScale: number;
    /** @private */
    public staticMapZoom: number = this.zoomSettings.enable ? this.zoomSettings.zoomFactor : 0;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public serverProcess: any;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public shapeSelectionItem: any[] = [];

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
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    extend(this[key], dataObj[key]);
                } else {
                    this[key] = dataObj[key];
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
        let localAjax: MapAjax; let ajaxModule: Ajax; let dataModule: DataManager;
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
                    if (layer.markerSettings[i].dataSource instanceof DataManager) {
                        this.serverProcess['request']++;
                        dataModule = layer.markerSettings[i].dataSource as DataManager;
                        queryModule = layer.markerSettings[i].query instanceof Query ? layer.markerSettings[i].query : new Query();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dataManager.then((e: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            layer.markerSettings[i].dataSource = processResult(e) as any[];
                        });
                    }
                }
            }
            if (layer.bubbleSettings.length > 0) {
                for (let i: number = 0; i < layer.bubbleSettings.length; i++) {
                    if (layer.bubbleSettings[i].dataSource instanceof DataManager) {
                        this.serverProcess['request']++;
                        dataModule = layer.bubbleSettings[i].dataSource as DataManager;
                        queryModule = layer.bubbleSettings[i].query instanceof Query ? layer.bubbleSettings[i].query : new Query();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dataManager.then((e: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            layer.bubbleSettings[i].dataSource = processResult(e) as any[];
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
        const ajaxModule: Ajax = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
        ajaxModule.onSuccess = (args: string) => {
            this.processResponseJsonData('Ajax', args, layer, type);
        };
        ajaxModule.send(localAjax.sendData);
    }
    /**
     * This method is used to process the JSON data to render the maps.
     *
     * @param {string} processType - Specifies the process type in maps.
     * @param {any | string} data - Specifies the data for maps.
     * @param {LayerSettings} layer - Specifies the layer for the maps.
     * @param {string} dataType - Specifies the data type for maps.
     * @returns {void}
     */
    public processResponseJsonData(processType: string, data?: any | string, layer?: LayerSettings, dataType?: string): void {
        this.serverProcess['response']++;
        if (processType) {
            if (dataType === 'ShapeData') {
                layer.shapeData = (processType === 'DataManager') ? processResult((data as any)) : JSON.parse(data as string);
            } else {
                layer.dataSource = (processType === 'DataManager') ? processResult((data as any)) : JSON.parse('[' + data + ']')[0];
            }
        }
        if (!isNullOrUndefined(processType) && this.serverProcess['request'] === this.serverProcess['response']) {
            const collection: LayerSettings[] = this.layersCollection;
            this.layersCollection = [];
            for (let i: number = 0; i < collection.length; i++) {
                if (collection[i].isBaseLayer) {
                    this.layersCollection.push(collection[i]);
                }
            }
            for (let j: number = 0; j < collection.length; j++) {
                if (!collection[j].isBaseLayer) {
                    this.layersCollection.push(collection[j]);
                }
            }
            this.renderMap();
        } else if (isNullOrUndefined(processType)) {
            this.renderMap();
        }
    }

    private renderMap(): void {
        if (this.legendModule && this.legendSettings.visible) {
            if (!this.isTileMap) {
                this.legendModule.renderLegend();
            } else {
                const layerCount: number = this.layersCollection.length - 1;
                if (!this.layersCollection[layerCount].isBaseLayer) {
                    this.isTileMapSubLayer = true;
                    this.legendModule.renderLegend();
                }
            }
        }
        this.createTile();
        if (this.zoomSettings.enable && this.zoomModule) {
            this.zoomModule.createZoomingToolbars();
        }
        if (!isNullOrUndefined(this.dataLabelModule)) {
            this.dataLabelModule.dataLabelCollections = [];
            this.dataLabelShape = [];
        }
        this.mapLayerPanel.measureLayerPanel();
        this.element.appendChild(this.svgObject);
        for (let i: number = 0; i < this.layers.length; i++) {
            if (this.layers[i].selectionSettings && this.layers[i].selectionSettings.enable &&
                this.layers[i].initialShapeSelection.length > 0 && this.checkInitialRender) {
                const checkSelection: boolean = this.layers[i].selectionSettings.enableMultiSelect;
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection ? checkSelection : true;
                const shapeSelection: InitialShapeSelectionSettingsModel[] = this.layers[i].initialShapeSelection;
                for (let j: number = 0; j < this.layers[i].initialShapeSelection.length; j++) {
                    this.shapeSelection(i, shapeSelection[j].shapePath, shapeSelection[j].shapeValue, true);
                }
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection;
                if (i === this.layers.length - 1) { this.checkInitialRender = false; }
            }
            for (let k : number = 0; k < this.layers[i].markerSettings.length; k++) {
                if (this.layers[i].markerSettings[k].selectionSettings && this.layers[i].markerSettings[k].selectionSettings.enable
                    && this.layers[i].markerSettings[k].initialMarkerSelection.length > 0) {
                    const markerSelectionValues : InitialMarkerSelectionSettingsModel[] =
                        this.layers[i].markerSettings[k].initialMarkerSelection;
                    for (let j : number = 0; j < markerSelectionValues.length; j++) {
                        this.markerInitialSelection(i, k, this.layers[i].markerSettings[k], markerSelectionValues[j].latitude,
                                                    markerSelectionValues[j].longitude);
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
            left = parseFloat(tileElement.style.left) + element.offsetLeft;
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
                        top = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize.height / 2)
                            - (this.legendModule.legendBorderRect.height / 2);
                    } else {
                        top = parseFloat(tileElement.style.top) + element.offsetTop - this.mapAreaRect.y;
                    }
                } else {
                    left = this.legendModule.legendBorderRect.x;
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize['height'] / 2)
                            - this.legendModule.legendBorderRect.y;
                    } else {
                        top = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize['height'] / 2);
                    }
                }
            } else {
                bottom = svg.bottom - tile.bottom - element.offsetTop;
                top = parseFloat(tileElement.style.top) + element.offsetTop;
            }
            top = (bottom <= 11) ? top : (top * 2);
            left = (bottom <= 11) ? left : (left * 2);
            tileElement.style.top = top + 'px';
            tileElement.style.left = left + 'px';
            tileElement1.style.top = top + 'px';
            tileElement1.style.left = left + 'px';
        }

        this.arrangeTemplate();

        if (this.annotationsModule) {
            if (this.width !== '0px' && this.height !== '0px' && this.width !== '0%' && this.height !== '0%') {
                this.annotationsModule.renderAnnotationElements();
            }
        }
        this.element.style.outline = 'none';
        for (let i: number = 0; i < document.getElementsByTagName('path').length - 1; i++) {
            if (document.getElementsByTagName('path')[i].id.indexOf('shapeIndex') > -1) {
                document.getElementsByTagName('path')[i].style.outline = 'none';
            }
        }
        this.zoomingChange();
        this.trigger(loaded, { maps: this, isResized: this.isResize });
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
        selectionSettings : SelectionSettingsModel, map : Maps, targetElement : Element,
        data : any
    ) : void {
        const border : BorderModel = {
            color: selectionSettings.border.color,
            width: selectionSettings.border.width / map.scale
        };
        const markerSelectionProperties : any = {
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
            } else {
                targetElement.setAttribute('class', 'MarkerselectionMapStyle');
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
        layerIndex : number, markerIndex : number, markerSettings : MarkerSettingsModel,
        latitude : number, longitude : number
    ): void {
        const selectionSettings : SelectionSettingsModel = markerSettings.selectionSettings;
        if (selectionSettings.enable) {
            for (let i : number = 0; i < markerSettings.dataSource['length']; i++) {
                const data: any = markerSettings.dataSource[i];
                if (data['latitude'] === latitude && data['longitude'] === longitude) {
                    const targetId : string = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex +
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
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    }

    // private setSecondaryElementPosition(): void {
    //     if (!this.isTileMap) {
    //         let element: HTMLDivElement = getElementByID(this.element.id + '_Secondary_Element') as HTMLDivElement;
    //         let rect: ClientRect = this.element.getBoundingClientRect();
    //         let svgRect: ClientRect = getElementByID(this.element.id + '_svg').getBoundingClientRect();
    //         element.style.marginLeft = Math.max(svgRect.left - rect.left, 0) + 'px';
    //         element.style.marginTop = Math.max(svgRect.top - rect.top, 0) + 'px';
    //     }
    // }

    private zoomingChange(): void {
        let left: number; let top: number;
        if (getElementByID(this.element.id + '_Layer_Collections') && this.zoomModule) {
            this.zoomModule.layerCollectionEle = getElementByID(this.element.id + '_Layer_Collections');
        }
        if (this.isTileMap && getElementByID(this.element.id + '_Tile_SVG') && getElementByID(this.element.id + '_tile_parent')) {
            const tileRect: ClientRect = getElementByID(this.element.id + '_tile_parent').getBoundingClientRect();
            const tileSvgRect: ClientRect = getElementByID(this.element.id + '_Tile_SVG').getBoundingClientRect();
            left = (tileRect.left - tileSvgRect.left);
            top = (tileRect.top - tileSvgRect.top);
            (getElementByID(this.element.id + '_Tile_SVG_Parent') as HTMLElement).style.left = left + 'px';
            (getElementByID(this.element.id + '_Tile_SVG_Parent') as HTMLElement).style.top = top + 'px';
            const markerTemplateElements: HTMLCollectionOf<Element> = document.getElementsByClassName('template');
            if (!isNullOrUndefined(markerTemplateElements) && markerTemplateElements.length > 0) {
                for (let i: number = 0; i < markerTemplateElements.length; i++) {
                    const templateGroupEle: HTMLElement = markerTemplateElements[i] as HTMLElement;
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
                    const childElement: SVGAElement = elements.childNodes[i] as SVGAElement;
                    if (childElement.tagName === 'g') {
                        const layerIndex: number = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                        for (let j: number = 0; j < childElement.childNodes.length; j++) {
                            const childNode: Element = <Element>childElement.childNodes[j];
                            if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                                (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                                (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))) {
                                changeBorderWidth(childNode, layerIndex, this.scale, this);
                            }
                        }
                    }
                }
            }
            if (this.zoomModule && (this.previousScale !== this.scale)) {
                this.zoomModule.applyTransform(true);
            }
        }
    }

    private createSecondaryElement(): void {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            const secondaryElement: Element = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:2;'
            });
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
            getElementByID(this.element.id + '_Layer_Collections') && this.layers[this.layers.length - 1].layerType !== 'OSM') {
            for (let i: number = 0; i < templateElements.length; i++) {
                let offSetLetValue: number = 0;
                let offSetTopValue: number = 0;
                const templateGroupEle: Element = templateElements[i] as Element;
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
                        const currentTemplate: HTMLElement = <HTMLElement>templateGroupEle.childNodes[j];
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
            mainLayer.layerType === 'GoogleStaticMap' || mainLayer.layerType === 'Google')) {
            if (mainLayer.layerType === 'Google') {
                mainLayer.urlTemplate = 'https://mt1.google.com/vt/lyrs=m@129&hl=en&x=tileX&y=tileY&z=level';
            }
            removeElement(this.element.id + '_tile_parent');
            removeElement(this.element.id + '_tiles');
            removeElement('animated_tiles');
            const ele: Element = createElement('div', {
                id: this.element.id + '_tile_parent', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px; right: ' + (this.margin.right) + 'px; top: '
                    + (this.mapAreaRect.y + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            const ele1: Element = createElement('div', {
                id: this.element.id + '_tiles', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px;  right: ' + (this.margin.right) + 'px; top: '
                    + (this.mapAreaRect.y + padding) + 'px; height: ' + (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
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
            const baseLayer: LayerSettings = <LayerSettings>mainLayers[i];
            if (baseLayer.visible && baseIndex === i) {
                baseLayer.isBaseLayer = true;
                this.isTileMap = (baseLayer.layerType === 'Geometry') ? false : true;
                this.layersCollection.push(baseLayer);
                break;
            } else if (i === mainLayers.length - 1) {
                this.layersCollection.push(<LayerSettings>mainLayers[0]);
                break;
            }
        }
        subLayers.map((subLayer: LayerSettings, subLayerIndex: number) => {
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
        const style: FontModel = title.textStyle;
        let height: number;
        const width: number = Math.abs((this.margin.left + this.margin.right) - this.availableSize.width);
        style.fontFamily = this.themeStyle.fontFamily || style.fontFamily;
        style.fontWeight = style.fontWeight || this.themeStyle.titleFontWeight;
        style.size = this.themeStyle.titleFontSize || style.size;
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
            element.setAttribute('tabindex', (this.tabIndex + (type === 'title' ? 1 : 2)).toString());
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
        // EventHandler.add(this.element, 'contextmenu', this.mapsOnRightClick, this);
        EventHandler.add(this.element, 'dblclick', this.mapsOnDoubleClick, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap, this);
        //  EventHandler.add(this.element, cancelEvent, this.mouseLeaveOnMap, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.mapsOnResize.bind(this)
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
        // EventHandler.remove(this.element, 'contextmenu', this.mapsOnRightClick);
        EventHandler.remove(this.element, 'dblclick', this.mapsOnDoubleClick);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap);
        //EventHandler.remove(this.element, cancelEvent, this.mouseLeaveOnMap);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.mapsOnResize
        );
    }
    /**
     * This method is used to perform operations when mouse pointer leave from maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
     */
    public mouseLeaveOnMap(e: PointerEvent): void {
        if (document.getElementsByClassName('highlightMapStyle').length > 0 && this.legendModule) {
            this.legendModule.removeShapeHighlightCollection();
            removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
        }
    }

    /**
     * Gets the selected element to be maintained or not.
     *
     * @param {Element} targetEle - Specifies the target element
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public SelectedElement(targetEle : Element) : boolean {
        let isSelect : boolean = false;
        if (targetEle.getAttribute('class') === 'ShapeselectionMapStyle') {
            isSelect = true;
        }
        return isSelect;
    }
    /**
     * This method is used to perform the operations when a click operation is performed on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
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
                isShapeSelected : this.SelectedElement(targetEle)
            };
            this.trigger('click', eventArgs, (mouseArgs: IMouseEventArgs) => {
                if (targetEle.id.indexOf('shapeIndex') > -1) {
                    this.mergeCluster();
                    if (getElement(this.element.id + '_mapsTooltip') &&
                        this.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                        removeElement(this.element.id + '_mapsTooltip');
                    }
                }
                if (this.markerModule) {
                    this.markerModule.markerClick(e);
                    this.markerModule.markerClusterClick(e);
                }
                if (this.bubbleModule) {
                    this.bubbleModule.bubbleClick(e);
                }
                if (!eventArgs.cancel) {
                    this.notify(click, targetEle);
                }
                if (!eventArgs.cancel && targetEle.id.indexOf('shapeIndex') !== -1) {
                    const layerIndex: number = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    const shapeSelectedEventArgs : IShapeSelectedEventArgs = triggerShapeEvent(
                        targetId, this.layers[layerIndex].selectionSettings, this, shapeSelected
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
            });
        }
    }

    private getClickLocation(targetId: string, pageX: number, pageY: number, targetElement: HTMLElement, x: number, y: number): GeoPosition {
        let layerIndex: number = 0;
        let latLongValue: any;
        if (targetId.indexOf('_LayerIndex_') !== -1 && !this.isTileMap && (parseInt(this.mouseDownEvent['x']) === parseInt(this.mouseClickEvent['x']))
            && (parseInt(this.mouseDownEvent['y']) === parseInt(this.mouseClickEvent['y']))) {
            layerIndex = parseFloat(targetId.split('_LayerIndex_')[1].split('_')[0]);
            if (this.layers[layerIndex].geometryType === 'Normal') {
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
                } else if (targetId.indexOf('_MarkerIndex_') > -1 && this.markerModule) {
                    const markerIndex: number = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[0], 10);
                    const dataIndex: number = parseInt(targetId.split('_dataIndex_')[1].split('_')[0], 10);
                    if (!isNaN(markerIndex) && !isNaN(dataIndex)) {
                        const dataObject: any = this.layers[layerIndex].markerSettings[markerIndex].dataSource[dataIndex];
                        latLongValue = { latitude: dataObject['latitude'], longitude: dataObject.longitude };
                    } else {
                        latLongValue = { latitude: null, longitude: null };
                    }
                } else { latLongValue = { latitude: null, longitude: null }; }
            } else {
                latLongValue = this.getGeoLocation(layerIndex, x, y);
            }
        } else if (this.isTileMap && (parseInt(this.mouseDownEvent['x']) === parseInt(this.mouseClickEvent['x']))
            && (parseInt(this.mouseDownEvent['y']) === parseInt(this.mouseClickEvent['y']))) {
            latLongValue = this.getTileGeoLocation(x, y);
        }
        return latLongValue;
    }

    /**
     * This method is used to perform operations when mouse click on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {boolean} - Returns the boolean value
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
        const rect: ClientRect = this.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
        if (e.type.indexOf('touch') !== - 1) {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = <Element>touchArg.target;
            this.mouseClickEvent = { x: pageX, y: pageY };
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = <Element>e.target;
        }
        if (this.isTouch) {
            if (targetEle.id.indexOf('_ToolBar') === -1) {
                const latLongValue: GeoPosition = this.getClickLocation(targetId, pageX, pageY, (targetEle as HTMLElement), pageX, pageY);
                if (!isNullOrUndefined(latLongValue)) {
                    latitude = latLongValue.latitude;
                    longitude = latLongValue.longitude;
                }
                const eventArgs: IMouseEventArgs = {
                    cancel: false, name: click, target: targetId, x: e.clientX, y: e.clientY,
                    latitude: latitude, longitude: longitude, isShapeSelected: this.SelectedElement(targetEle)
                };
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                this.trigger('click', eventArgs, (mouseArgs: IMouseEventArgs) => {
                });
            }
            this.titleTooltip(e, pageX, pageY, true);
            if (!isNullOrUndefined(this.legendModule)) {
                this.legendTooltip(e, e.pageX, e.pageY, true);
            }
        }
        this.notify(Browser.touchEndEvent, e);
        if (e.cancelable) {
            e.preventDefault();
        }
        return false;
    }
    /**
     * This method is used to perform operations when mouse is clicked down on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps
     * @returns {void}
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
        const rect: ClientRect = this.element.getBoundingClientRect();
        const element: Element = <Element>e.target;
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
     * This method is used to perform operations when performing the double click operation on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event.
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
            const doubleClickArgs: IMouseEventArgs = { cancel: false, name: doubleClick,  x: e.clientX, y: e.clientY,
                target : targetId, latitude: latitude, longitude: longitude, isShapeSelected : null };
            this.trigger('doubleClick', doubleClickArgs);
        }
    }

    /**
     * This method is used to perform operations while performing mouse over on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
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
        this.onMouseMove(e);
        this.notify(Browser.touchMoveEvent, e);
    }
    /**
     * This method is used to perform operations when mouse move event is performed on maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event on maps.
     * @returns {void}
     */
    public onMouseMove(e: PointerEvent): boolean {
        const element: Element = <Element>e.target;
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        if (!this.isTouch) {
            this.titleTooltip(e, e.pageX, e.pageY);
            if (!isNullOrUndefined(this.legendModule)) {
                this.legendTooltip(e, e.pageX, e.pageY, true);
            }
        }
        return false;
    }

    private legendTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
        let legendText : string; let page : number = this.legendModule.currentPage;
        let legendIndex : string = (<HTMLElement>event.target).id.split('_Index_')[1];
        let collection : any;
        page = this.legendModule.totalPages.length <= this.legendModule.currentPage
            ? this.legendModule.totalPages.length - 1 : this.legendModule.currentPage < 0 ?
                0 : this.legendModule.currentPage;
        const count : number = this.legendModule.totalPages.length !== 0 ?
            this.legendModule.totalPages[page]['Collection'].length : this.legendModule.totalPages.length;
        for (let i : number = 0; i < count; i++) {
            collection = this.legendModule.totalPages[page]['Collection'][i];
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
                this.titleSettings.text, this.titleSettings.textStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight,
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
                    },
                    500);
            }
        }
        return false;
    }

    /**
     * This method is used to zoom the map by specifying the center position.
     *
     * @param {number} centerPosition - Specifies the center position
     * @param {number} centerPosition.latitude - Specifies the latitude value for the center position
     * @param {number} centerPosition.longitude - Specifies the longitude value for the center position
     * @param {number} zoomFactor - Specifies the zoom factor for maps.
     * @returns {void}
     */
    public zoomByPosition(centerPosition: { latitude: number, longitude: number }, zoomFactor: number): void {
        const factor: number = this.mapLayerPanel.calculateFactor(this.layersCollection[0]);
        let position: Point;
        const size: Rect = this.mapAreaRect;
        if (!this.isTileMap && this.zoomModule) {
            if (!isNullOrUndefined(centerPosition)) {
                position = convertGeoToPoint(
                    centerPosition.latitude, centerPosition.longitude, factor, this.layersCollection[0], this);
                const mapRect: ClientRect = document.getElementById(this.element.id + '_Layer_Collections').getBoundingClientRect();
                const svgRect: ClientRect = this.svgObject.getBoundingClientRect();
                const xDiff: number = Math.abs(mapRect.left - svgRect.left) / this.scale;
                const yDiff: number = Math.abs(mapRect.top - svgRect.top) / this.scale;
                const x: number = this.translatePoint.x + xDiff;
                const y: number = this.translatePoint.y + yDiff;
                this.scale = zoomFactor;
                this.translatePoint.x = ((mapRect.left < svgRect.left ? x : 0) + (size.width / 2) - (position.x * zoomFactor)) / zoomFactor;
                this.translatePoint.y = ((mapRect.top < svgRect.top ? y : 0) + (size.height / 2) - (position.y * zoomFactor)) / zoomFactor;
                this.zoomModule.applyTransform();
            } else {
                position = { x: size.width / 2, y: size.height / 2 };
                this.zoomModule.performZooming(position, zoomFactor, zoomFactor > this.scale ? 'ZoomIn' : 'ZoomOut');
            }
        } else if (this.zoomModule) {
            this.tileZoomLevel = zoomFactor;
            this.tileTranslatePoint = this.mapLayerPanel['panTileMap'](
                this.availableSize.width, this.availableSize.height,
                { x: centerPosition.longitude, y: centerPosition.latitude }
            );
            this.mapLayerPanel.generateTiles(zoomFactor, this.tileTranslatePoint, null, new BingMap(this));
        }
    }

    /**
     * This method is used to perform panning by specifying the direction.
     *
     * @param {PanDirection} direction - Specifies the direction in which the panning is performed.
     * @param {PointerEvent | TouchEvent} mouseLocation - Specifies the location of the mouse pointer in maps.
     */
    public panByDirection(direction: PanDirection, mouseLocation?: PointerEvent | TouchEvent): void {
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

    /**
     * This method is used to add the layers dynamically to the maps.
     *
     * @param {Object} layer - Specifies the layer for the maps.
     */
    public addLayer(layer: Object): void {
        this.layers.push(new LayerSettings(this.layers[0] as LayerSettings, 'layers', layer));
        this.refresh();
    }
    /**
     * This method is used to remove a layer from map.
     *
     * @param {number} index - Specifies the index number of the layer to be removed.
     * @returns {void}
     */
    public removeLayer(index: number): void {
        this.layers.splice(index, 1);
        this.refresh();
    }
    /**
     * This method is used to add markers dynamically in the maps.
     * If we provide the index value of the layer in which the marker to be added and the coordinates
     * of the marker as parameters, the marker will be added in the location.
     *
     * @param {number} layerIndex - Specifies the index number of the layer.
     * @param {MarkerSettingsModel[]} markerCollection - Specifies the settings of the marker to be added.
     * @returns {void}
     */
    public addMarker(layerIndex: number, markerCollection: MarkerSettingsModel[]): void {
        const layerEle: Element = document.getElementById(this.element.id + '_LayerIndex_' + layerIndex);
        if (markerCollection.length > 0 && layerEle) {
            for (const newMarker of markerCollection) {
                this.layersCollection[layerIndex].markerSettings.push(new MarkerSettings(this, 'markerSettings', newMarker));
            }
            const markerModule: Marker = new Marker(this);
            markerModule.markerRender(layerEle, layerIndex, this.mapLayerPanel['currentFactor'], 'AddMarker');
            this.arrangeTemplate();
        }
    }
    /**
     * This method is used to select the geometric shape element in the maps component.
     *
     * @param {number} layerIndex - Specifies the index of the layer in maps.
     * @param {string | string[]} propertyName - Specifies the property name from the data source.
     * @param {string} name - Specifies the name of the shape that is selected.
     * @param {boolean} enable - Specifies the shape selection to be enabled.
     * @returns {void}
     */
    public shapeSelection(layerIndex: number, propertyName: string | string[], name: string, enable?: boolean): void {
        let targetEle: Element;
        let subLayerIndex: number;
        const popertyNameArray: string[] = Array.isArray(propertyName) ? propertyName : Array(propertyName);
        if (isNullOrUndefined(enable)) {
            enable = true;
        }
        const selectionsettings: SelectionSettingsModel = this.layers[layerIndex].selectionSettings;
        if (!selectionsettings.enableMultiSelect && this.legendSelection && enable) {
            this.removeShapeSelection();
        }
        if (this.layers[layerIndex].type === 'SubLayer') {
            for (let i: number = 0; i < this.layersCollection.length; i++) {
                if ((this.layersCollection[i].shapeData === this.layers[layerIndex].shapeData)) {
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
            const shapeData: any[] = <any[]>this.layers[layerIndex].shapeData['features'];
            for (let i: number = 0; i < shapeData.length; i++) {
                for (let j: number = 0; j < (<string[]>popertyNameArray).length; j++) {
                    const propertyName : string = !isNullOrUndefined(shapeData[i]['properties'][popertyNameArray[j]])
                    && isNaN(shapeData[i]['properties'][popertyNameArray[j]]) ?
                        shapeData[i]['properties'][popertyNameArray[j]].toLowerCase() : shapeData[i]['properties'][popertyNameArray[j]];
                    const shapeName : string = !isNullOrUndefined(name) ? name.toLowerCase() : name;
                    let k: number;
                    if (propertyName === shapeName) {
                        if (!isNullOrUndefined(this.layers[layerIndex].shapeSettings.colorValuePath)) {
                            k = checkShapeDataFields(
                                <any[]>this.layers[layerIndex].dataSource, shapeData[i]['properties'],
                                this.layers[layerIndex].shapeDataPath, this.layers[layerIndex].shapePropertyPath,
                                this.layers[layerIndex]);
                        }
                        const baseLayer: LayerSettings = <LayerSettings>this.layers[layerIndex];
                        if (this.baseLayerIndex >= 0 && baseLayer.isBaseLayer) {
                            indexValue = 0;
                        } else if (this.layers[layerIndex].type === 'SubLayer') {
                            indexValue = subLayerIndex;
                        }
                        targetId = this.element.id + '_' + 'LayerIndex_' + indexValue + '_shapeIndex_' + i + '_dataIndex_' + k;
                        targetEle = getElement(targetId);
                        if (isNullOrUndefined(k) && isNullOrUndefined(targetEle)) {
                            targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_null';
                            targetEle = getElement(targetId);
                        }
                        shapeIndex = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                        shapeDataValue = this.layers[layerIndex].shapeData['features']['length'] > shapeIndex ?
                            this.layers[layerIndex].shapeData['features'][shapeIndex]['properties'] : null;
                        dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                        data = isNullOrUndefined(dataIndex) ? null : this.layers[layerIndex].dataSource[dataIndex];
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
                                    if (!selectionsettings.enableMultiSelect && this.legendSelection && this.selectedElementId.length > 0) {
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

    /**
     * This method is used to zoom the maps component based on the provided coordinates.
     *
     * @param {number} minLatitude - Specifies the minimum latitude to be zoomed.
     * @param {number} minLongitude - Specifies the minimum latitude to be zoomed.
     * @param {number} maxLatitude - Specifies the maximum latitude to be zoomed.
     * @param {number} maxLongitude - Specifies the maximum longitude to be zoomed.
     * @returns {void}
     */
    public zoomToCoordinates(minLatitude: number, minLongitude: number, maxLatitude: number, maxLongitude: number): void {
        let centerLatitude: number;
        let centerLongtitude: number;
        let isTwoCoordinates: boolean = false;
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
                                                       this.mapAreaRect.width, this.mapAreaRect.height, this);
        const zoomArgs: IMapZoomEventArgs = {
            cancel: false, name: 'zoom', type: zoomIn, maps: this,
            tileTranslatePoint: {}, translatePoint: {},
            tileZoomLevel: this.isTileMap ? { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation } : {},
            scale: !this.isTileMap ? { previous: this.scale, current: this.scaleOfGivenLocation } :
                { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation}
        };
        this.trigger('zoom', zoomArgs);
        this.refresh();
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
                removeClass(getElementByID(this.legendSelectionCollection[i]['legendElement']['id']));
                this.selectedLegendElementId.splice(0, 1);
            }
        }
        this.shapeSelectionItem = [];
        this.legendSelectionCollection = [];

    }

    /**
     * This method is used to set culture for maps component.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * This method to set locale constants to the maps component.
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
            Reset: 'Reset'
        };
    }

    /**
     * This method disposes the maps component.
     */
    public destroy(): void {
        this.unWireEVents();
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
        if (document.getElementById('mapsmeasuretext')) {
            document.getElementById('mapsmeasuretext').remove();
        }
        this.removeSvg();
        super.destroy();
    }

    /**
     * Gets component name
     *
     * @returns {string} - Returns the string value
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
        let render: boolean = false; let isMarker: boolean = false;
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
                    const layerPropLength: number = Object.keys(newProp.layers).length;
                    for (let x: number = 0; x < layerPropLength; x++) {
                        if (!isNullOrUndefined(newProp.layers[x])) {
                            const collection: string[] = Object.keys(newProp.layers[x]);
                            for (const collectionProp of collection) {
                                if (collectionProp === 'markerSettings') {
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
                    if (newProp.zoomSettings.zoomFactor !== oldProp.zoomSettings.zoomFactor) {
                        render = false;
                    }
                    else if (newProp.zoomSettings.shouldZoomInitially !== oldProp.zoomSettings.shouldZoomInitially) {
                        this.zoomSettings.zoomFactor = 1;
                        render = true;
                    } else if (newProp.zoomSettings.enable !== oldProp.zoomSettings.enable) {
                        this.zoomSettings.zoomFactor = 1;
                        render = true;
                    }
                    else {
                        render = true;
                    }
                }
                break;
            case 'locale':
            case 'currencyCode':
                super.refresh(); break;
            }
        }
        if (render) {
            if (newProp.layers && isMarker) {
                removeElement(this.element.id + '_Markers_Group');
                if (this.isTileMap) {
                    this.mapLayerPanel.renderTileLayer(this.mapLayerPanel, this.layers['currentFactor'], (this.layers.length - 1));
                }
				else {
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
        this.annotations.map((annotation: Annotation, index: number) => {
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
     */

    private isMarkersVisible(): boolean {
        let isVisible: boolean = false;
        Array.prototype.forEach.call(this.layers, (layer: LayerSettings, layerIndex: number) => {
            for (let i: number = 0; i < layer.markerSettings.length; i++) {
                if (layer.markerSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    }

    /**
     * To find DataLabel visibility
     */

    private isDataLabelVisible(): boolean {
        let isVisible: boolean = false;
        for (let i: number = 0; i < this.layers.length; i++) {
            if (this.layers[i].dataLabelSettings.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }

    /**
     * To find navigation line visibility
     */

    private isNavigationVisible(): boolean {
        let isVisible: boolean = false;
        Array.prototype.forEach.call(this.layers, (layer: LayerSettings, layerIndex: number) => {
            for (let i: number = 0; i < layer.navigationLineSettings.length; i++) {
                if (layer.navigationLineSettings[i].visible) {
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
     * This method handles the printing functionality for the maps component.
     *
     * @param {string[] | string | Element} id - Specifies the element to be printed.
     * @returns {void}
     */
    public print(id?: string[] | string | Element): void {
        if ((this.allowPrint) && (this.printModule)) {
            this.printModule.print(id);
        }
    }
    /**
     * This method handles the export functionality for the maps component.
     *
     * @param {ExportType} type - Specifies the type of the exported file.
     * @param {string} fileName - Specifies the name of the file with which the rendered maps need to be exported.
     * @param {PdfPageOrientation} orientation - Specifies the orientation of the pdf document in exporting.
     * @param {boolean} allowDownload - Specifies whether to download as a file or get as base64 string for the file
     * @returns {Promise<string>} - Returns the string value.
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if ((type !== 'PDF') && (this.allowImageExport) && (this.imageExportModule)) {
            return new Promise((resolve: any, reject: any) => {
                resolve(this.imageExportModule.export(type, fileName, allowDownload));
            });
        } else if ((this.allowPdfExport) && (this.pdfExportModule)) {
            return new Promise((resolve: any, reject: any) => {
                resolve(this.pdfExportModule.export(type, fileName, allowDownload, orientation));
            });
        }
        return null;
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
     * This method is used to get the geo location points.
     *
     * @param {number} layerIndex - Specifies the index number of the layer of the map.
     * @param {number} x - Specifies the x value.
     * @param {number} y - Specifies the y value.
     * @returns {GeoPosition}- Returns the geo position
     */
    public getGeoLocation(layerIndex: number, x: number, y: number): GeoPosition {
        const container: HTMLElement = document.getElementById(this.element.id);
        const pageX: number = x - container.offsetLeft;
        const pageY: number = y - container.offsetTop;
        const currentLayer: LayerSettings = <LayerSettings>this.layersCollection[layerIndex];
        const translate: any = getTranslate(this, currentLayer, false);
        const translatePoint: Point = translate['location'] as Point;
        const translatePointX: number = translatePoint.x * this.scale;
        const translatePointY: number = translatePoint.y * this.scale;
        const mapSize: number = (Math.min(this.mapAreaRect.height, this.mapAreaRect.width)
            * this.mapLayerPanel['currentFactor']) * this.scale;
        const xx: number = (this.clip(pageX - translatePointX, 0, mapSize - 1) / mapSize) - 0.5;
        const yy: number = 0.5 - (this.clip(pageY - translatePointY, 0, mapSize - 1) / mapSize);
        const lat: number = 90 - 360 * Math.atan(Math.exp(-yy * 2 * Math.PI)) / Math.PI;
        const long: number = 360 * xx;
        return { latitude: lat, longitude: long };
    }

    private clip(value: number, minVal: number, maxVal: number): number {
        return Math.min(Math.max(value, minVal), maxVal);
    }

    /**
     * This method is used to get the geo location points when tile maps is rendered in the maps component.
     *
     * @param {number} x - Specifies the x value
     * @param {number} y - Specifies the y value
     * @returns {GeoPosition} - Returns the position
     */
    public getTileGeoLocation(x: number, y: number): GeoPosition {
        const container: HTMLElement = document.getElementById(this.element.id);
        const ele: HTMLElement = document.getElementById(this.element.id + '_tile_parent');
        const latLong: any = this.pointToLatLong(
            x + this.mapAreaRect.x - (ele.offsetLeft - container.offsetLeft),
            y + this.mapAreaRect.y - (ele.offsetTop - container.offsetTop));
        return { latitude: latLong['latitude'], longitude: latLong['longitude'] };
    }
    /**
     * This method is used to convert the point to latitude and longitude in maps.
     *
     * @param {number} pageX - Specifies the x value for the page.
     * @param {number} pageY - Specifies the y value for the page.
     * @returns {Object} - Returns the object.
     */
    public pointToLatLong(pageX: number, pageY: number): Object {
        const padding: number = this.layers[this.layers.length - 1].layerType === 'GoogleStaticMap' ? 0 : 10;
        pageY = (this.zoomSettings.enable) ? pageY + padding : pageY;
        const mapSize: number = 256 * Math.pow(2, this.tileZoomLevel);
        const x1: number = (this.clip(pageX - (this.translatePoint.x * this.scale), 0, mapSize - 1) / mapSize) - 0.5;
        const y1: number = 0.5 - (this.clip(pageY - (this.translatePoint.y * this.scale), 0, mapSize - 1) / mapSize);
        const lat: number = 90 - 360 * Math.atan(Math.exp(-y1 * 2 * Math.PI)) / Math.PI;
        const long: number = 360 * x1;
        return { latitude: lat, longitude: long };
    }
}
