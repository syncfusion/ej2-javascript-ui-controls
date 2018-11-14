/**
 * Maps Component file
 */
import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Ajax } from '@syncfusion/ej2-base';
import { EventHandler, Browser, EmitType, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { SvgRenderer, Event, remove, L10n, Collection, Internationalization, Complex } from '@syncfusion/ej2-base';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { Size, createSvg, Point, removeElement, triggerShapeEvent, showTooltip, getElement } from './utils/helper';
import { ZoomSettings, LegendSettings } from './model/base';
import { LayerSettings, TitleSettings, Border, Margin, MapsAreaSettings, Annotation } from './model/base';
import { ZoomSettingsModel, LegendSettingsModel, LayerSettingsModel, BubbleSettingsModel, MarkerSettingsModel } from './model/base-model';
import { TitleSettingsModel, BorderModel, MarginModel } from './model/base-model';
import { MapsAreaSettingsModel, AnnotationModel } from './model/base-model';
import { Bubble } from './layers/bubble';
import { Legend } from './layers/legend';
import { Marker } from './layers/marker';
import { Highlight } from './user-interaction/highlight';
import { Selection } from './user-interaction/selection';
import { MapsTooltip } from './user-interaction/tooltip';
import { Zoom } from './user-interaction/zoom';
import { load, click, rightClick, loaded, doubleClick, resize, shapeSelected, shapeHighlight, itemSelection } from './model/constants';
import { itemHighlight } from './model/constants';
import { ProjectionType, MapsTheme } from './utils/enum';
import { MapsModel } from './maps-model';
import { Theme, BootstrapTheme, FabricTheme, HighContrastTheme } from './model/theme';
import { ILoadEventArgs, ILoadedEventArgs, IMouseEventArgs, IResizeEventArgs, ITooltipRenderEventArgs } from './model/interface';
import { ILayerRenderingEventArgs, IShapeRenderingEventArgs, IMarkerRenderingEventArgs, IMarkerClickEventArgs } from './model/interface';
import { IMarkerMoveEventArgs, ILabelRenderingEventArgs, IBubbleMoveEventArgs, IBubbleClickEventArgs } from './model/interface';
import { ISelectionEventArgs, IShapeSelectedEventArgs } from './model/interface';
import { IBubbleRenderingEventArgs, IAnimationCompleteEventArgs, IPrintEventArgs } from './model/interface';
import { LayerPanel } from './layers/layer-panel';
import { GeoLocation, Rect, RectOption, measureText, getElementByID, MapAjax } from '../maps/utils/helper';
import { findPosition, textTrim, TextOption, renderTextElement, convertGeoToPoint } from '../maps/utils/helper';
import { Annotations } from '../maps/user-interaction/annotation';
import { FontModel, DataLabel, MarkerSettings, IAnnotationRenderingEventArgs } from './index';
import { NavigationLineSettingsModel, changeBorderWidth } from './index';
import { IFontMapping, BingMap } from '../index';
import { NavigationLine } from './layers/navigation-selected-line';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ExportUtils } from '../maps/utils/export';
import { ExportType } from '../maps/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
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
     * `bubbleModule` is used to add bubble to the maps.
     */
    public bubbleModule: Bubble;
    /**
     * `markerModule` is used to add marker to the maps.
     */
    public markerModule: Marker;
    /**
     * `dataLabelModule` is used to add datalabel to the maps.
     */
    public dataLabelModule: DataLabel;
    /**
     * `highlightModule` is used to add highlight to the maps.
     */
    public highlightModule: Highlight;
    /**
     * `navigationLineModule` is used to add navigationLine to the maps.
     */
    public navigationLineModule: NavigationLine;
    /**
     * `legendModule` is used to add legend to the maps.
     */
    public legendModule: Legend;
    /**
     * `selectionModule` is used to add selection to the maps.
     */
    public selectionModule: Selection;
    /**
     * `mapsTooltipModule` is used to add tooltip to the maps.
     */
    public mapsTooltipModule: MapsTooltip;
    /**
     * `zoomModule` is used to add zoom to the maps.
     */
    public zoomModule: Zoom;
    /**
     *  annotationModule is used to place the any text or images into the maps.
     */
    public annotationsModule: Annotations;


    // Maps pblic API Declaration 

    /**
     * To configure the background of the maps container.
     * @default null
     */
    @Property(null)
    public background: string;
    /**
     * To enable the separator
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;
    /**
     * To apply internationalization for maps
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * To configure width of maps.
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * To configure height of maps.
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * To configure the title settings of the maps.
     */
    @Complex<TitleSettingsModel>({}, TitleSettings)
    public titleSettings: TitleSettingsModel;
    /**
     * To configure the zoom settings of the maps.
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;
    /**
     * To configure the legend settings of the maps.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;
    /**
     * To configure the layers settings of the maps.
     */
    @Collection<LayerSettingsModel>([], LayerSettings)
    public layers: LayerSettingsModel[];
    /**
     *  Options for customizing the annotation of maps.
     */
    @Collection<AnnotationModel>([], Annotation)
    public annotations: AnnotationModel[];

    /**
     *  Options to customize left, right, top and bottom margins of the maps.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing the color and width of the maps border.
     */
    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Specifies the theme for the maps.
     * @default Material
     */
    @Property('Material')
    public theme: MapsTheme;
    /**
     * Specifies the ProjectionType for the maps.
     * @default Mercator
     */
    @Property('Mercator')
    public projectionType: ProjectionType;
    /**
     * To configure baseMapIndex of maps. Option to select which layer to be visible.
     * @default 0
     */
    @Property(0)
    public baseLayerIndex: number;

    /**
     * Description for maps.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the maps.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;
    /**
     * To configure the zoom level of maps.
     * @default { latitude: null, longitude: null}
     */
    @Property({ latitude: null, longitude: null })
    public centerPosition: { latitude: number, longitude: number };
    /**
     * To customization Maps area
     */
    @Complex<MapsAreaSettingsModel>({}, MapsAreaSettings)
    public mapsArea: MapsAreaSettingsModel;
    /**
     * Triggers before maps rendered.
     * @event
     */
    @Event()
    public load: EmitType<ILoadEventArgs>;
    /**
     * Triggers before the prints gets started.
     * @event
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers after maps rendered.
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers on clicking the maps.
     * @event
     */
    @Event()
    public click: EmitType<IMouseEventArgs>;
    /**
     * Triggers on double clicking the maps.
     * @event
     */
    @Event()
    public doubleClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers on right clicking the maps.
     * @event
     */
    @Event()
    public rightClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers on resizing the maps.
     * @event
     */
    @Event()
    public resize: EmitType<IResizeEventArgs>;
    /**
     * Triggers before the maps tooltip rendered.
     * @event
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers while clicking the shape
     * @event
     */
    @Event()
    public shapeSelected: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers before selection applied
     * @event
     */
    @Event()
    public itemSelection: EmitType<ISelectionEventArgs>;
    /**
     * Trigger before highlight applied
     * @event
     */
    @Event()
    public itemHighlight: EmitType<ISelectionEventArgs>;
    /**
     * Triggers before highlight applied for shape
     * @event
     */
    @Event()
    public shapeHighlight: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers before the maps layer rendered.
     * @event
     */
    @Event()
    public layerRendering: EmitType<ILayerRenderingEventArgs>;

    /**
     * Triggers before the maps shape rendered.
     * @event
     */
    @Event()
    public shapeRendering: EmitType<IShapeRenderingEventArgs>;

    /**
     * Triggers before the maps marker rendered.
     * @event
     */
    @Event()
    public markerRendering: EmitType<IMarkerRenderingEventArgs>;

    /**
     * Triggers event mouse clicking on the maps marker element.
     * @event
     */
    @Event()
    public markerClick: EmitType<IMarkerClickEventArgs>;

    /**
     * Triggers event mouse moving on the maps marker element.
     * @event
     */
    @Event()
    public markerMouseMove: EmitType<IMarkerMoveEventArgs>;

    /**
     * Triggers before the data label get rendered.
     * @event
     */
    @Event()
    public dataLabelRendering: EmitType<ILabelRenderingEventArgs>;

    /**
     * Triggers before the maps bubble rendered.
     * @event
     */
    @Event()
    public bubbleRendering: EmitType<IBubbleRenderingEventArgs>;

    /**
     * Triggers event mouse clicking on the maps bubble element.
     * @event
     */
    @Event()
    public bubbleClick: EmitType<IBubbleClickEventArgs>;

    /**
     * Triggers event mouse moving on the maps bubble element.
     * @event
     */
    @Event()
    public bubbleMouseMove: EmitType<IBubbleMoveEventArgs>;

    /**
     * Triggers after the animation completed.
     * @event
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before annotation rendering.
     * @event
     */
    @Event()
    public annotationRendering: EmitType<IAnnotationRenderingEventArgs>;

    // Internal properties declaration area.
    /**
     * Format method
     * @private
     */
    public formatFunction: Function;
    /**
     * svg renderer object.
     * @private
     */
    public renderer: SvgRenderer;
    /**
     * maps svg element's object
     * @private
     */
    public svgObject: Element;
    /**
     * Maps available height, width
     * @private
     */
    public availableSize: Size;

    /**
     * localization object 
     * @private
     */
    public localeObject: L10n;
    /**
     * It contains default values of localization values
     */
    private defaultLocalConstants: Object;

    /**
     * Internal use of internationalization instance.
     * @private
     */
    public intl: Internationalization;

    /**
     * Check layer whether is normal or tile
     * @private
     */
    public isTileMap: boolean = false;

    /**
     * Resize the map
     */
    private resizeTo: number;

    /**
     * @private
     * Stores the map area rect
     */

    public mapAreaRect: Rect;

    /**
     * @private
     * Stores layers collection for rendering
     */
    public layersCollection: LayerSettings[];

    /**
     * @private
     * Calculate the axes bounds for map.
     * @hidden
     */
    public mapLayerPanel: LayerPanel;
    /**
     * @private
     * Render the data label.
     * @hidden
     */
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
    public baseMapBounds: GeoLocation;
    /** @private */
    public baseMapRectBounds: Object;
    /** @private */
    public translatePoint: Point = new Point(0, 0);
    /** @private */
    public baseTranslatePoint: Point = new Point(0, 0);
    /** @private */
    public tileTranslatePoint: Point = new Point(0, 0);
    /** @private */
    public baseTileTranslatePoint: Point = new Point(0, 0);
    /** @private */
    public isDevice: Boolean = false;
    /** @private */
    public tileZoomLevel: number;
    /** @private */
    public serverProcess: Object;
    /** @private */
    public previousScale: number;
    /** @private */
    public previousPoint: Point;


    /**
     * Constructor for creating the widget
     */
    constructor(options?: MapsModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }
    /** 
     * Gets the localized label by locale keyword. 
     * @param  {string} key  
     * @return {string}  
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObject.getConstant(key);
    }
    /**
     * Initializing pre-required values.
     */
    protected preRender(): void {

        this.isDevice = Browser.isDevice;

        this.initPrivateVariable();

        this.trigger(load, { maps: this });

        this.themeEffect();

        this.unWireEVents();

        this.createSVG();

        this.wireEVents();

        this.setCulture();

    }
    private setTextStyle(theme: IFontMapping, font: FontModel): void {
        font.color = font.color || theme.color;
        font.size = font.size || theme.size;
        font.fontFamily = font.fontFamily || theme.fontFamily;
        font.fontStyle = font.fontStyle || theme.fontStyle;
        font.fontWeight = font.fontWeight || theme.fontWeight;
    }
    private bingMap: BingMap;
    /**
     * To change font styles of map based on themes
     */
    private themeEffect(): void {
        this.setBackgroundValue(this.theme);
        switch (this.theme) {
            case 'Material':
                this.setTextStyle(Theme.mapsTitleFont, this.titleSettings.textStyle);
                this.setTextStyle(Theme.mapsSubTitleFont, this.titleSettings.subtitleSettings.textStyle);
                this.setTextStyle(Theme.legendLabelFont, this.legendSettings.textStyle);
                this.setTextStyle(Theme.legendTitleFont, this.legendSettings.textStyle);
                this.setLabelFont(this.layers, Theme.dataLabelFont);
                break;
            case 'Bootstrap':
                this.setTextStyle(BootstrapTheme.mapsTitleFont, this.titleSettings.textStyle);
                this.setTextStyle(BootstrapTheme.mapsSubTitleFont, this.titleSettings.subtitleSettings.textStyle);
                this.setTextStyle(BootstrapTheme.legendLabelFont, this.legendSettings.textStyle);
                this.setTextStyle(BootstrapTheme.legendTitleFont, this.legendSettings.textStyle);
                this.setLabelFont(this.layers, BootstrapTheme.dataLabelFont);
                break;
            case 'Fabric':
                this.setTextStyle(FabricTheme.mapsTitleFont, this.titleSettings.textStyle);
                this.setTextStyle(FabricTheme.mapsSubTitleFont, this.titleSettings.subtitleSettings.textStyle);
                this.setTextStyle(FabricTheme.legendLabelFont, this.legendSettings.textStyle);
                this.setTextStyle(FabricTheme.legendTitleFont, this.legendSettings.textStyle);
                this.setLabelFont(this.layers, FabricTheme.dataLabelFont);
                break;
            case 'Highcontrast':
                this.setTextStyle(HighContrastTheme.mapsTitleFont, this.titleSettings.textStyle);
                this.setTextStyle(HighContrastTheme.mapsSubTitleFont, this.titleSettings.subtitleSettings.textStyle);
                this.setTextStyle(HighContrastTheme.legendLabelFont, this.legendSettings.textStyle);
                this.setTextStyle(HighContrastTheme.legendTitleFont, this.legendSettings.textStyle);
                this.setLabelFont(this.layers, HighContrastTheme.dataLabelFont);
                break;
        }
    }
    /**
     * Maps background and area background colors change as per theme.
     * @param theme based on theme background colors will change.
     */
    private setBackgroundValue(theme: MapsTheme): void {
        let color: string = theme === 'Highcontrast' ? '#000000' : '#FFFFFF';
        this.background = this.background ? this.background : color;
        this.mapsArea.background = this.mapsArea.background ? this.mapsArea.background : color;
        color = theme !== 'Highcontrast' ? '#737373' : '#FFFFFF';
        this.zoomSettings.color = (this.zoomSettings.color) ? this.zoomSettings.color : color;
    }
    /**
     * To change datalabel font
     * @param layers 
     * @param style 
     */
    private setLabelFont(layers: LayerSettingsModel[], style: FontModel): void {
        for (let layer of layers) {
            this.setTextStyle(style, layer.dataLabelSettings.textStyle);
        }
    }

    /**
     * To Initialize the control rendering.
     */
    protected render(): void {

        this.findBaseAndSubLayers();

        this.createSecondaryElement();

        this.addTabIndex();

        this.renderBorder();

        this.renderTitle(this.titleSettings, 'title', null, null);

        this.renderArea();

        this.processRequestJsonData();

    }

    /* tslint:disable:no-string-literal */
    protected processRequestJsonData(): void {
        let length: number = this.layersCollection.length - 1;
        this.serverProcess = { request: 0, response: 0 }; let queryModule: Query;
        let localAjax: MapAjax; let ajaxModule: Ajax; let dataModule: DataManager;
        this.layersCollection.forEach((layer: LayerSettings, layerIndex: number) => {
            if (layer.shapeData instanceof DataManager) {
                this.serverProcess['request']++;
                dataModule = layer.shapeData;
                queryModule = layer.query instanceof Query ? layer.query : new Query();
                let dataManager: Promise<Object> = dataModule.executeQuery(queryModule);
                dataManager.then((e: object) => {
                    this.processResponseJsonData('DataManager', e, layer, 'ShapeData');
                });
            } else if (layer.shapeData instanceof MapAjax) {
                this.processAjaxRequest(layer, layer.shapeData, 'ShapeData');
            }
            if (layer.dataSource instanceof MapAjax) {
                this.processAjaxRequest(layer, layer.dataSource, 'DataSource');
            }
            if (this.serverProcess['request'] === this.serverProcess['response'] && length === layerIndex) {
                this.processResponseJsonData(null);
            }
        });
    }

    private processAjaxRequest(layer: LayerSettings, localAjax: MapAjax, type: string): void {
        let ajaxModule: Ajax;
        this.serverProcess['request']++;
        ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
        ajaxModule.onSuccess = (args: string) => {
            this.processResponseJsonData('Ajax', args, layer, type);
        };
        ajaxModule.send(localAjax.sendData);
    }

    /* tslint:disable:no-eval */
    public processResponseJsonData(processType: string, data?: object | string, layer?: LayerSettings, dataType?: string): void {
        this.serverProcess['response']++;
        if (processType) {
            if (dataType === 'ShapeData') {
                layer.shapeData = (processType === 'DataManager') ? !isNullOrUndefined(data['result']) ? data['result'] : data['actual'] :
                    JSON.parse(data as string);
            } else {
                layer.dataSource = (processType === 'DataManager') ? !isNullOrUndefined(data['result']) ? data['result'] : data['actual'] :
                    JSON.parse('[' + data + ']')[0];
            }
        }
        if (!isNullOrUndefined(processType) && this.serverProcess['request'] === this.serverProcess['response']) {
            let collection: LayerSettings[] = this.layersCollection;
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

            this.legendModule.renderLegend();

        }

        this.createTile();

        if (this.zoomSettings.enable && this.zoomModule) {

            this.zoomModule.createZoomingToolbars();

        }

        this.mapLayerPanel.measureLayerPanel();

        this.element.appendChild(this.svgObject);

        //this.setSecondaryElementPosition();

        this.arrangeTemplate();

        if (this.annotationsModule) {

            this.annotationsModule.renderAnnotationElements();

        }

        this.zoomingChange();

        this.trigger(loaded, { maps: this });

    }

    /**
     * Render the map area border
     */
    private renderArea(): void {
        let rect: RectOption = new RectOption(
            this.element.id + '_MapAreaBorder', this.mapsArea.background, this.mapsArea.border, 1, this.mapAreaRect);
        this.svgObject.appendChild(this.renderer.drawRectangle(rect) as SVGRectElement);
    }
    /**
     * To add tab index for map element
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
            let tileRect: ClientRect = getElementByID(this.element.id + '_tile_parent').getBoundingClientRect();
            let tileSvgRect: ClientRect = getElementByID(this.element.id + '_Tile_SVG').getBoundingClientRect();
            left = (tileRect.left - tileSvgRect.left);
            top = (tileRect.top - tileSvgRect.top);
            getElementByID(this.element.id + '_Tile_SVG').setAttribute('transform', 'translate(' + left + ' ' + top + ')');
            let markerTemplateElements: HTMLCollectionOf<Element> = document.getElementsByClassName('template');
            if (!isNullOrUndefined(markerTemplateElements) && markerTemplateElements.length > 0) {
                for (let i: number = 0; i < markerTemplateElements.length; i++) {
                    let templateGroupEle: HTMLElement = markerTemplateElements[i] as HTMLElement;
                    templateGroupEle.style.left = left + 'px';
                    templateGroupEle.style.top = top + 'px';
                }
            }
        }
        if (this.zoomSettings.zoomFactor >= 1) {
            if (this.zoomModule && this.zoomModule.toolBarGroup && this.zoomSettings.enable) {
                this.zoomModule.alignToolBar();
            }
            let elements: Element = document.getElementById(this.element.id + '_Layer_Collections');
            if (!isNullOrUndefined(elements) && elements.childElementCount > 0) {
                for (let i: number = 0; i < elements.childNodes.length; i++) {
                    let childElement: SVGAElement = elements.childNodes[i] as SVGAElement;
                    if (childElement.tagName === 'g') {
                        let layerIndex: number = parseFloat(childElement.id.split('_')[2]);
                        for (let j: number = 0; j < childElement.childNodes.length; j++) {
                            let childNode: Element = <Element>childElement.childNodes[j];
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
            let secondaryElement: Element = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
        }
    }

    private arrangeTemplate(): void {
        let secondaryEle: HTMLElement = <HTMLElement>getElementByID(this.element.id + '_Secondary_Element');
        if (document.getElementById(this.element.id + '_Legend_Border')) {
            document.getElementById(this.element.id + '_Legend_Border').style.pointerEvents = 'none';
        }
        let templateElements: HTMLCollectionOf<Element> = document.getElementsByClassName('template');
        if (!isNullOrUndefined(templateElements) && templateElements.length > 0 && getElementByID(this.element.id + '_Layer_Collections')) {
            for (let i: number = 0; i < templateElements.length; i++) {
                let templateGroupEle: Element = templateElements[i] as Element;
                if (!isNullOrUndefined(templateGroupEle) && templateGroupEle.childElementCount > 0) {
                    let layerOffset: ClientRect = getElementByID(this.element.id + '_Layer_Collections').getBoundingClientRect();
                    let elementOffset: ClientRect = getElementByID(templateGroupEle.id).getBoundingClientRect();
                    for (let j: number = 0; j < templateGroupEle.childElementCount; j++) {
                        let currentTemplate: HTMLElement = <HTMLElement>templateGroupEle.childNodes[j];
                        let templateOffset: ClientRect = currentTemplate.getBoundingClientRect();
                        currentTemplate.style.left = ((this.isTileMap ? parseFloat(currentTemplate.style.left) :
                            ((layerOffset.left < elementOffset.left ? (parseFloat(currentTemplate.style.left) -
                                Math.abs(elementOffset.left - layerOffset.left)) : (parseFloat(currentTemplate.style.left) +
                                    Math.abs(elementOffset.left - layerOffset.left))))) - (templateOffset.width / 2)) + 'px';
                        currentTemplate.style.top = ((this.isTileMap ? parseFloat(currentTemplate.style.top) :
                            ((layerOffset.top < elementOffset.top ? (parseFloat(currentTemplate.style.top) -
                                Math.abs(elementOffset.top - layerOffset.top)) : (parseFloat(currentTemplate.style.top) +
                                    Math.abs(elementOffset.top - layerOffset.top))))) - (templateOffset.height / 2)) + 'px';
                    }
                }
            }
        }
    }

    private createTile(): void {
        let mainLayer: LayerSettings = this.layersCollection[0];
        let padding: number = 0;
        if (mainLayer.isBaseLayer && (mainLayer.layerType === 'OSM' || mainLayer.layerType === 'Bing')) {
            removeElement(this.element.id + '_tile_parent');
            let elementRect: ClientRect = this.element.getBoundingClientRect();
            let parentRect: ClientRect = this.element.parentElement.getBoundingClientRect();
            let left: number = Math.abs(elementRect.left - parentRect.left);
            let top: number = Math.abs(elementRect.top - parentRect.top);
            let ele: Element = createElement('div', {
                id: this.element.id + '_tile_parent', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x + left) + 'px; top: ' + (this.mapAreaRect.y + top + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            this.element.appendChild(ele);
        }
    }


    /**
     * To initilize the private varibales of maps.
     */
    private initPrivateVariable(): void {
        this.renderer = new SvgRenderer(this.element.id);
        this.mapLayerPanel = new LayerPanel(this);
    }

    private findBaseAndSubLayers(): void {
        let baseIndex: number = this.baseLayerIndex;
        let mainLayers: Object[] = []; let subLayers: Object[] = [];
        this.layersCollection = [];
        this.layers.forEach((layer: LayerSettingsModel) => {
            (layer.type === 'Layer') ? mainLayers.push(layer) : subLayers.push(layer);
        });
        for (let i: number = 0; i < mainLayers.length; i++) {
            let baseLayer: LayerSettings = <LayerSettings>mainLayers[i];
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
     * @private
     * Render the map border
     */
    private renderBorder(): void {
        let width: number = this.border.width;
        let borderElement: Element = this.svgObject.querySelector('#' + this.element.id + '_MapBorder');
        if ((width > 0 || this.background) && isNullOrUndefined(borderElement)) {
            let borderRect: RectOption = new RectOption(
                this.element.id + '_MapBorder', this.background, this.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect) as SVGRectElement);
        } else {
            borderElement.setAttribute('fill', this.background);
        }
    }

    /**
     * @private
     * Render the title and subtitle
     */
    private renderTitle(title: TitleSettingsModel, type: string, bounds: Rect, groupEle: Element): void {
        let style: FontModel = title.textStyle;
        let height: number;
        let width: number = Math.abs((this.margin.left + this.margin.right) - this.availableSize.width);
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            let trimmedTitle: string = textTrim(width, title.text, style);
            let elementSize: Size = measureText(trimmedTitle, style);
            let rect: Rect = (isNullOrUndefined(bounds)) ? new Rect(
                this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            let location: Point = findPosition(rect, title.alignment, elementSize, type);
            let options: TextOption = new TextOption(
                this.element.id + '_Map_' + type, location.x, location.y, 'start', trimmedTitle
            );
            let titleBounds: Rect = new Rect(location.x, location.y, elementSize.width, elementSize.height);
            let element: Element = renderTextElement(options, style, style.color, groupEle);
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
     */
    private createSVG(): void {

        this.removeSvg();

        createSvg(this);
    }
    /**
     * To Remove the SVG
     */
    private removeSvg(): void {
        removeElement(this.element.id + '_Secondary_Element');
        removeElement(this.element.id + '_tile_parent');
        if (document.getElementsByClassName('e-tooltip-wrap')[0]) {
            remove(document.getElementsByClassName('e-tooltip-wrap')[0]);
        }
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }
    /**
     * To bind event handlers for maps.
     */
    private wireEVents(): void {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, 'click', this.mapsOnClick, this);
        // EventHandler.add(this.element, 'contextmenu', this.mapsOnRightClick, this);
        EventHandler.add(this.element, 'dblclick', this.mapsOnDoubleClick, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnMap, this);
        //  EventHandler.add(this.element, cancelEvent, this.mouseLeaveOnMap, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.mapsOnResize.bind(this)
        );

    }

    /**
     * To unbind event handlers from maps.
     */
    private unWireEVents(): void {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, 'click', this.mapsOnClick);
        // EventHandler.remove(this.element, 'contextmenu', this.mapsOnRightClick);
        EventHandler.remove(this.element, 'dblclick', this.mapsOnDoubleClick);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnMap);
        //EventHandler.remove(this.element, cancelEvent, this.mouseLeaveOnMap);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.mapsOnResize
        );
    }
    /**
     * To handle the click event for the maps.
     */
    /* tslint:disable:no-string-literal */
    public mapsOnClick(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let targetId: string = targetEle.id;
        let eventArgs: IMouseEventArgs = {
            cancel: false, name: click, target: targetId, x: e.clientX, y: e.clientY
        };
        this.trigger(click, eventArgs);
        if (targetEle.id.indexOf('ShapeIndex') !== -1) {
            let layerIndex: number = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
            triggerShapeEvent(targetId, this.layers[layerIndex].selectionSettings, this, shapeSelected);
        }
        if (this.markerModule) {
            this.markerModule.markerClick(e);
        }
        if (this.bubbleModule) {
            this.bubbleModule.bubbleClick(e);
        }
        if (!eventArgs.cancel) {
            this.notify(click, targetEle);
        }
    }

    /**
     * 
     */
    public mouseEndOnMap(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        let rect: ClientRect = this.element.getBoundingClientRect();
        let element: Element = <Element>e.target;
        if (e.type.indexOf('touch') !== - 1) {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = <Element>touchArg.target;
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = <Element>e.target;
        }
        if (this.isTouch) {
            this.titleTooltip(e, pageX, pageY, true);
        }
        this.notify(Browser.touchEndEvent, e);
        e.preventDefault();
        return false;
    }
    /**
     * 
     */
    public mouseDownOnMap(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        let rect: ClientRect = this.element.getBoundingClientRect();
        let element: Element = <Element>e.target;
        this.notify(Browser.touchStartEvent, e);
    }

    /**
     * To handle the double click event for the maps.
     */
    public mapsOnDoubleClick(e: PointerEvent): void {
        this.notify('dblclick', e);
    }

    /**
     * 
     */
    /* tslint:disable:no-string-literal */
    public mouseMoveOnMap(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        let target: Element;
        let touches: TouchList = null;
        target = (e.type === 'touchmove') ? <Element>(<TouchEvent & PointerEvent>e).target :
            target = <Element>e.target;
        // if (target.id.indexOf('ShapeIndex') !== -1 && !this.highlightSettings.enable) {
        //     triggerShapeEvent(target.id, this.highlightSettings, this, shapeHighlight);
        // }
        if (this.markerModule) {
            this.markerModule.markerMove(e);
        }
        if (this.bubbleModule) {
            this.bubbleModule.bubbleMove(e);
        }
        this.onMouseMove(e);
        this.notify(Browser.touchMoveEvent, e);
    }
    public onMouseMove(e: PointerEvent): boolean {
        let element: Element = <Element>e.target;
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touchArg: TouchEvent;
        if (!this.isTouch) {
            this.titleTooltip(e, e.pageX, e.pageY);
        }
        return false;
    }
    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
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
     * To handle the window resize event on maps.
     */
    public mapsOnResize(e: Event): boolean {
        let args: IResizeEventArgs = {
            name: resize,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            maps: this
        };

        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-maps')) {
            this.resizeTo = setTimeout(
                (): void => {
                    this.unWireEVents();
                    this.createSVG();
                    this.refreshing = true;
                    this.wireEVents();
                    args.currentSize = this.availableSize;
                    this.trigger(resize, args);
                    this.render();
                },
                500);
        }
        return false;
    }
    public zoomByPosition(centerPosition: { latitude: number, longitude: number }, zoomFactor: number): void {
        let lattitude: number = centerPosition.latitude;
        let longitude: number = centerPosition.longitude;
        let factor: number = this.mapLayerPanel.calculateFactor(this.layersCollection[0]);
        let position: Point = convertGeoToPoint(lattitude, longitude, factor, this.layersCollection[0], this);
        if (this.zoomModule) {
            this.zoomModule.performZooming(position, zoomFactor, 'ZoomIn');
        }
    }

    /**
     * To add layers to maps
     */
    public addLayer(layer: LayerSettingsModel): void {
        this.layers.push(new LayerSettings(this.layers[0] as LayerSettings, 'layers', layer));
        this.refresh();
    }
    /**
     * To remove layers from maps
     */
    public removeLayer(index: number): void {
        this.layers.splice(index, 1);
        this.refresh();
    }
    /**
     * To add marker to layers
     */
    public addMarker(layerIndex: number, marker: MarkerSettingsModel): void {
        let currentMarker: MarkerSettingsModel[] = this.layers[layerIndex].markerSettings;
        currentMarker.push(new MarkerSettings(currentMarker[0] as MarkerSettings, 'markerSettings', marker));
        this.refresh();
    }
    /**
     * Method to set culture for maps
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * Method to set locale constants
     */
    private setLocaleConstants(): void {
        // Need to modify after the api confirm
        this.defaultLocalConstants = {
            ZoomIn: 'Zoom In',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom Out',
            Pan: 'Pan',
            Reset: 'Reset',
        };
    }

    /**
     * To destroy maps control.
     */
    public destroy(): void {
        this.unWireEVents();
        super.destroy();
    }

    /**
     * Get component name
     */
    public getModuleName(): string {
        return 'maps';
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
    public onPropertyChanged(newProp: MapsModel, oldProp: MapsModel): void {
        let render: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                    this.createSVG();
                    render = true;
                    break;
            }
        }
        if (render) {
            this.render();
        }
    }
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let isVisible: { layer: boolean, bubble: boolean, tooltip: boolean, selection: boolean, highlight: boolean } =
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

        return modules;
    }

    /**
     * To find marker visibility
     */

    private isMarkersVisible(): boolean {
        let isVisible: boolean = false;
        this.layers.forEach((layer: LayerSettings, layerIndex: number) => {
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
        this.layers.forEach((layer: LayerSettings, layerIndex: number) => {
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
        for (let layer of this.layers) {
            if (this.getBubbleVisible(layer)) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * To find the bubble visibility from layer
     * @private
     */
    public getBubbleVisible(layer: LayerSettingsModel): boolean {
        let isVisible: boolean = false;
        for (let bubble of layer.bubbleSettings) {
            if (bubble.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * Handles the print method for chart control.
     */
    public print(id?: string[] | string | Element): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print(id);
    }
    /**
     * Handles the export method for chart control.
     * @param type 
     * @param fileName 
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation): void {
        let exportMap: ExportUtils = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    }
    /**
     * To find visibility of layers and markers for required modules load. 
     */
    private findVisibleLayers(
        layers: LayerSettingsModel[], isLayerVisible: boolean = false,
        isBubblevisible: boolean = false, istooltipVisible: boolean = false, isSelection: boolean = false,
        isHighlight: boolean = false
    ): { layer: boolean, bubble: boolean, tooltip: boolean, selection: boolean, highlight: boolean } {
        let bubbles: BubbleSettingsModel[];
        let markers: MarkerSettingsModel[];
        let navigationLine: NavigationLineSettingsModel[];
        for (let layer of layers) {
            isLayerVisible = layer.visible || isLayerVisible;
            if (layer.visible) {
                bubbles = layer.bubbleSettings;
                markers = layer.markerSettings;
                navigationLine = layer.navigationLineSettings;
                for (let navigation of navigationLine) {
                    if (navigation.visible) {
                        isSelection = navigation.highlightSettings.enable || isSelection;
                        isHighlight = navigation.selectionSettings.enable || isHighlight;
                    }
                }
                for (let marker of markers) {
                    if (marker.visible) {
                        istooltipVisible = marker.tooltipSettings.visible || istooltipVisible;
                        isSelection = marker.selectionSettings.enable || isSelection;
                        isHighlight = marker.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) { break; }
                }
                for (let bubble of bubbles) {
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
}