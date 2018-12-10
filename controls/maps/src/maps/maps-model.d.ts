import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Ajax } from '@syncfusion/ej2-base';import { EventHandler, Browser, EmitType, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';import { SvgRenderer, Event, remove, L10n, Collection, Internationalization, Complex } from '@syncfusion/ej2-base';import { ModuleDeclaration } from '@syncfusion/ej2-base';import { Size, createSvg, Point, removeElement, triggerShapeEvent, showTooltip, getElement, removeClass } from './utils/helper';import { ZoomSettings, LegendSettings } from './model/base';import { LayerSettings, TitleSettings, Border, Margin, MapsAreaSettings, Annotation } from './model/base';import { ZoomSettingsModel, LegendSettingsModel, LayerSettingsModel, BubbleSettingsModel, MarkerSettingsModel } from './model/base-model';import { TitleSettingsModel, BorderModel, MarginModel } from './model/base-model';import { MapsAreaSettingsModel, AnnotationModel } from './model/base-model';import { Bubble } from './layers/bubble';import { Legend } from './layers/legend';import { Marker } from './layers/marker';import { Highlight } from './user-interaction/highlight';import { Selection } from './user-interaction/selection';import { MapsTooltip } from './user-interaction/tooltip';import { Zoom } from './user-interaction/zoom';import { load, click, rightClick, loaded, doubleClick, resize, shapeSelected, shapeHighlight, itemSelection } from './model/constants';import { itemHighlight } from './model/constants';import { ProjectionType, MapsTheme, PanDirection } from './utils/enum';import { Theme, BootstrapTheme, FabricTheme, HighContrastTheme, DarkTheme } from './model/theme';import { ILoadEventArgs, ILoadedEventArgs, IMouseEventArgs, IResizeEventArgs, ITooltipRenderEventArgs } from './model/interface';import { ILayerRenderingEventArgs, IShapeRenderingEventArgs, IMarkerRenderingEventArgs, IMarkerClickEventArgs } from './model/interface';import { IMarkerMoveEventArgs, ILabelRenderingEventArgs, IBubbleMoveEventArgs, IBubbleClickEventArgs } from './model/interface';import { ISelectionEventArgs, IShapeSelectedEventArgs, IMapPanEventArgs, IMapZoomEventArgs } from './model/interface';import { IBubbleRenderingEventArgs, IAnimationCompleteEventArgs, IPrintEventArgs } from './model/interface';import { LayerPanel } from './layers/layer-panel';import { GeoLocation, Rect, RectOption, measureText, getElementByID, MapAjax } from '../maps/utils/helper';import { findPosition, textTrim, TextOption, renderTextElement, convertGeoToPoint } from '../maps/utils/helper';import { Annotations } from '../maps/user-interaction/annotation';import { FontModel, DataLabel, MarkerSettings, IAnnotationRenderingEventArgs } from './index';import { NavigationLineSettingsModel, changeBorderWidth } from './index';import { IFontMapping, BingMap } from '../index';import { NavigationLine } from './layers/navigation-selected-line';import { DataManager, Query } from '@syncfusion/ej2-data';import { ExportUtils } from '../maps/utils/export';import { ExportType } from '../maps/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Maps
 */
export interface MapsModel extends ComponentModel{

    /**
     * To configure the background of the maps container.
     * @default null
     */
    background?: string;

    /**
     * To enable the separator
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * To apply internationalization for maps
     * @default null
     */
    format?: string;

    /**
     * To configure width of maps.
     * @default null
     */
    width?: string;

    /**
     * To configure height of maps.
     * @default null
     */
    height?: string;

    /**
     * To configure the title settings of the maps.
     */
    titleSettings?: TitleSettingsModel;

    /**
     * To configure the zoom settings of the maps.
     */
    zoomSettings?: ZoomSettingsModel;

    /**
     * To configure the legend settings of the maps.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * To configure the layers settings of the maps.
     */
    layers?: LayerSettingsModel[];

    /**
     *  Options for customizing the annotation of maps.
     */
    annotations?: AnnotationModel[];

    /**
     *  Options to customize left, right, top and bottom margins of the maps.
     */
    margin?: MarginModel;

    /**
     * Options for customizing the color and width of the maps border.
     */
    border?: BorderModel;

    /**
     * Specifies the theme for the maps.
     * @default Material
     */
    theme?: MapsTheme;

    /**
     * Specifies the ProjectionType for the maps.
     * @default Mercator
     */
    projectionType?: ProjectionType;

    /**
     * To configure baseMapIndex of maps. Option to select which layer to be visible.
     * @default 0
     */
    baseLayerIndex?: number;

    /**
     * Description for maps.
     * @default null
     */
    description?: string;

    /**
     * TabIndex value for the maps.
     * @default 1
     */
    tabIndex?: number;

    /**
     * To configure the zoom level of maps.
     * @default { latitude: null, longitude: null}
     */
    centerPosition?: { latitude: number, longitude: number };

    /**
     * To customization Maps area
     */
    mapsArea?: MapsAreaSettingsModel;

    /**
     * Triggers before maps rendered.
     * @event
     */
    load?: EmitType<ILoadEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
     */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after maps rendered.
     * @event
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers on clicking the maps.
     * @event
     */
    click?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on double clicking the maps.
     * @event
     */
    doubleClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on right clicking the maps.
     * @event
     */
    rightClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on resizing the maps.
     * @event
     */
    resize?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the maps tooltip rendered.
     * @event
     */
    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers while clicking the shape
     * @event
     */
    shapeSelected?: EmitType<IShapeSelectedEventArgs>;

    /**
     * Triggers before selection applied
     * @event
     */
    itemSelection?: EmitType<ISelectionEventArgs>;

    /**
     * Trigger before highlight applied
     * @event
     */
    itemHighlight?: EmitType<ISelectionEventArgs>;

    /**
     * Triggers before highlight applied for shape
     * @event
     */
    shapeHighlight?: EmitType<IShapeSelectedEventArgs>;

    /**
     * Triggers before the maps layer rendered.
     * @event
     */
    layerRendering?: EmitType<ILayerRenderingEventArgs>;

    /**
     * Triggers before the maps shape rendered.
     * @event
     */
    shapeRendering?: EmitType<IShapeRenderingEventArgs>;

    /**
     * Triggers before the maps marker rendered.
     * @event
     */
    markerRendering?: EmitType<IMarkerRenderingEventArgs>;

    /**
     * Triggers event mouse clicking on the maps marker element.
     * @event
     */
    markerClick?: EmitType<IMarkerClickEventArgs>;

    /**
     * Triggers event mouse moving on the maps marker element.
     * @event
     */
    markerMouseMove?: EmitType<IMarkerMoveEventArgs>;

    /**
     * Triggers before the data label get rendered.
     * @event
     */
    dataLabelRendering?: EmitType<ILabelRenderingEventArgs>;

    /**
     * Triggers before the maps bubble rendered.
     * @event
     */
    bubbleRendering?: EmitType<IBubbleRenderingEventArgs>;

    /**
     * Triggers event mouse clicking on the maps bubble element.
     * @event
     */
    bubbleClick?: EmitType<IBubbleClickEventArgs>;

    /**
     * Triggers event mouse moving on the maps bubble element.
     * @event
     */
    bubbleMouseMove?: EmitType<IBubbleMoveEventArgs>;

    /**
     * Triggers after the animation completed.
     * @event
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before annotation rendering.
     * @event
     */
    annotationRendering?: EmitType<IAnnotationRenderingEventArgs>;

    /**
     * Triggers before zoom in or zoom out.
     * @event
     */
    zoom?: EmitType<IMapZoomEventArgs>;

    /**
     * Triggers before panning.
     * @event
     */
    pan?: EmitType<IMapPanEventArgs>;

}