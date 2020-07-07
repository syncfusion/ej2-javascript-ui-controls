import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Ajax } from '@syncfusion/ej2-base';import { EventHandler, Browser, EmitType, isNullOrUndefined, createElement, setValue, extend } from '@syncfusion/ej2-base';import { Event, remove, L10n, Collection, Internationalization, Complex, isBlazor } from '@syncfusion/ej2-base';import { ModuleDeclaration, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { Size, createSvg, Point, removeElement, triggerShapeEvent, showTooltip, checkShapeDataFields } from './utils/helper';import { getElement, removeClass, getTranslate, triggerItemSelectionEvent, mergeSeparateCluster, customizeStyle } from './utils/helper';import { createStyle } from './utils/helper';import { ZoomSettings, LegendSettings, Tile } from './model/base';import { LayerSettings, TitleSettings, Border, Margin, MapsAreaSettings, Annotation, CenterPosition } from './model/base';import { ZoomSettingsModel, LegendSettingsModel, LayerSettingsModel, BubbleSettingsModel } from './model/base-model';import { MarkerSettingsModel, SelectionSettingsModel , InitialMarkerSelectionSettingsModel} from './model/base-model';import { TitleSettingsModel, BorderModel, MarginModel, CenterPositionModel, InitialShapeSelectionSettingsModel } from './model/base-model';import { MapsAreaSettingsModel, AnnotationModel } from './model/base-model';import { Bubble } from './layers/bubble';import { Legend } from './layers/legend';import { Marker } from './layers/marker';import { Highlight } from './user-interaction/highlight';import { Selection } from './user-interaction/selection';import { MapsTooltip } from './user-interaction/tooltip';import { Zoom } from './user-interaction/zoom';import { load, click, rightClick, loaded, doubleClick, resize, shapeSelected, itemSelection, zoomIn } from './model/constants';import { ProjectionType, MapsTheme, PanDirection, TooltipGesture } from './utils/enum';import { getThemeStyle } from './model/theme';import { BingMap } from './layers/bing-map';import { ILoadEventArgs, ILoadedEventArgs, IMouseEventArgs, IResizeEventArgs, ITooltipRenderEventArgs } from './model/interface';import { GeoPosition, ITooltipRenderCompleteEventArgs, ILegendRenderingEventArgs } from './model/interface';import { ILayerRenderingEventArgs, IShapeRenderingEventArgs, IMarkerRenderingEventArgs, IMarkerClickEventArgs } from './model/interface';import { IMarkerMoveEventArgs, ILabelRenderingEventArgs, IBubbleMoveEventArgs, IBubbleClickEventArgs } from './model/interface';import { IMarkerClusterClickEventArgs, IMarkerClusterMoveEventArgs, IMarkerClusterRenderingEventArgs } from './model/interface';import { ISelectionEventArgs, IShapeSelectedEventArgs, IMapPanEventArgs, IMapZoomEventArgs } from './model/interface';import { IBubbleRenderingEventArgs, IAnimationCompleteEventArgs, IPrintEventArgs, IThemeStyle } from './model/interface';import { LayerPanel } from './layers/layer-panel';import { GeoLocation, Rect, RectOption, measureText, getElementByID, MapAjax, processResult } from '../maps/utils/helper';import { findPosition, textTrim, TextOption, renderTextElement, convertGeoToPoint, calculateZoomLevel } from '../maps/utils/helper';import { Annotations } from '../maps/user-interaction/annotation';import { FontModel, DataLabel, MarkerSettings, IAnnotationRenderingEventArgs } from './index';import { NavigationLineSettingsModel, changeBorderWidth } from './index';import { NavigationLine } from './layers/navigation-selected-line';import { DataManager, Query } from '@syncfusion/ej2-data';import { ExportType } from '../maps/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { Print } from './model/print';import { PdfExport } from './model/export-pdf';import { ImageExport } from './model/export-image';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Maps
 */
export interface MapsModel extends ComponentModel{

    /**
     * Sets and gets the background color of the maps container.
     * @default null
     */
    background?: string;

    /**
     * Enables or disables the visibility state of the separator for grouping.
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Sets and gets the format in which the text in the maps are to be rendered.
     * @default null
     */
    format?: string;

    /**
     * Sets and gets the width in which the maps is to be rendered.
     * @default null
     */
    width?: string;

    /**
     * Sets and gets the height in which the maps is to be rendered.
     * @default null
     */
    height?: string;

    /**
     * Sets and gets the mode in which the tooltip is to be displayed.
     * The tooltip can be rendered on mouse move, click or double clicking on the
     * element on the map.
     * @default 'MouseMove'
     */
    tooltipDisplayMode?: TooltipGesture;

    /**
     * Enables or disables the print functionality in map.
     * @default false
     */
    allowPrint?: boolean;

    /**
     * Enables or disables the export to image functionality in map.
     * @default false
     */
    allowImageExport?: boolean;

    /**
     * Enables or disables the export to PDF functionality in map.
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Sets and gets the title to be displayed for maps.
     */
    titleSettings?: TitleSettingsModel;

    /**
     * Sets and gets the options to customize the zooming operations in maps.
     */
    zoomSettings?: ZoomSettingsModel;

    /**
     * Sets and gets the options to customize the legend of the maps.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Sets and gets the options to customize the layers of the maps.
     */
    layers?: LayerSettingsModel[];

    /**
     *  Sets and gets the options for customizing the annotation of maps.
     */
    annotations?: AnnotationModel[];

    /**
     *  Sets and gets the options to customize the margins of the maps.
     */
    margin?: MarginModel;

    /**
     * Sets and gets the options for customizing the color and width of the maps border.
     */
    border?: BorderModel;

    /**
     * Set and gets the theme supported for the maps.
     * @default Material
     */
    theme?: MapsTheme;

    /**
     * Sets and gets the projection type for the maps.
     * @default Mercator
     */
    projectionType?: ProjectionType;

    /**
     * Sets and gets the base map index of maps. It provides the option to select which layer to be visible in the maps.
     * @default 0
     */
    baseLayerIndex?: number;

    /**
     * Sets and gets the description for maps.
     * @default null
     */
    description?: string;

    /**
     * Sets and gets the tab index value for the maps.
     * @default 1
     */
    tabIndex?: number;

    /**
     * Sets and gets the center position of the maps.
     */
    centerPosition?: CenterPositionModel;

    /**
     * Sets and gets the options to customize the area around the map.
     */
    mapsArea?: MapsAreaSettingsModel;

    /**
     * Triggers when the map is on load.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<ILoadEventArgs>;

    /**
     * Triggers before the print gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after the maps gets rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers when clicking an element in maps.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when performing the double click operation on an element in maps.
     * @event
     * @blazorProperty 'OnDoubleClick'
     */
    doubleClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when performing the right click operation on an element in maps.
     * @event
     * @blazorProperty 'OnRightClick'
     */
    rightClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when resizing the maps.
     * @event
     * @blazorProperty 'Resizing'
     */
    resize?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the maps tooltip gets rendered.
     * @event
     * @blazorProperty 'TooltipRendering'
     */
    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the legend gets rendered.
     * @event
     * @deprecated
     * @blazorProperty 'LegendRendering'
     */
    legendRendering?: EmitType<ILegendRenderingEventArgs>;

    /**
     * Triggers after the maps tooltip gets rendered.
     * @deprecated
     * @event
     * @blazorProperty 'TooltipRenderComplete'
     */
    tooltipRenderComplete?: EmitType<ITooltipRenderCompleteEventArgs>;

    /**
     * Triggers when clicking a shape in maps.
     * @event
     * @blazorProperty 'ShapeSelected'
     */
    shapeSelected?: EmitType<IShapeSelectedEventArgs>;

    /**
     * Triggers when clicking the shape on maps and before the selection is applied.
     * @event
     * @blazorProperty 'OnItemSelect'
     */
    itemSelection?: EmitType<ISelectionEventArgs>;

    /**
     * Trigger when mouse move on the shape in maps and before the shape gets highlighted.
     * @event
     * @blazorProperty 'OnItemHighlight'
     */
    itemHighlight?: EmitType<ISelectionEventArgs>;

    /**
     * Triggers when mouse move on the shape in maps and before the shape gets highlighted.
     * @event
     * @blazorProperty 'ShapeHighlighted'
     */
    shapeHighlight?: EmitType<IShapeSelectedEventArgs>;

    /**
     * Triggers before the maps layer gets rendered.
     * @event
     * @blazorProperty 'LayerRendering'
     */
    layerRendering?: EmitType<ILayerRenderingEventArgs>;

    /**
     * Triggers before the maps shape gets rendered.
     * @event
     * @blazorProperty 'ShapeRendering'
     */
    shapeRendering?: EmitType<IShapeRenderingEventArgs>;

    /**
     * Triggers before the maps marker gets rendered.
     * @event
     * @blazorProperty 'MarkerRendering'
     */
    markerRendering?: EmitType<IMarkerRenderingEventArgs>;

    /**
     * Triggers before the maps marker cluster gets rendered.
     * @event
     */
    markerClusterRendering?: EmitType<IMarkerClusterRenderingEventArgs>;

    /**
     * Triggers when clicking on the maps marker element.
     * @event
     * @blazorProperty 'OnMarkerClick'
     */
    markerClick?: EmitType<IMarkerClickEventArgs>;

    /**
     * Triggers when clicking the marker cluster in maps.
     * @event
     */
    markerClusterClick?: EmitType<IMarkerClusterClickEventArgs>;

    /**
     * Triggers when moving the mouse over the marker cluster element in maps.
     * @event
     */
    markerClusterMouseMove?: EmitType<IMarkerClusterMoveEventArgs>;

    /**
     * Triggers when moving the mouse over the marker element in maps.
     * @event
     * @blazorProperty 'OnMarkerMouseMove'
     */
    markerMouseMove?: EmitType<IMarkerMoveEventArgs>;

    /**
     * Triggers before the data-label gets rendered.
     * @event
     * @blazorProperty 'DataLabelRendering'
     */
    dataLabelRendering?: EmitType<ILabelRenderingEventArgs>;

    /**
     * Triggers before the bubble element gets rendered on the map.
     * @event
     * @blazorProperty 'BubbleRendering'
     */
    bubbleRendering?: EmitType<IBubbleRenderingEventArgs>;

    /**
     * Triggers when performing the click operation on the bubble element in maps.
     * @event
     * @blazorProperty 'OnBubbleClick'
     */
    bubbleClick?: EmitType<IBubbleClickEventArgs>;

    /**
     * Triggers when hovering the mouse on the bubble element in maps.
     * @event
     * @blazorProperty 'OnBubbleMouseMove'
     */
    bubbleMouseMove?: EmitType<IBubbleMoveEventArgs>;

    /**
     * Triggers after the animation completed in the maps component.
     * @event
     * @blazorProperty 'AnimationCompleted'
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before rendering the annotation in maps.
     * @event
     * @blazorProperty 'AnnotationRendering'
     */
    annotationRendering?: EmitType<IAnnotationRenderingEventArgs>;

    /**
     * Triggers before the zoom operations in the maps such as zoom in and zoom out.
     * @event
     * @blazorProperty 'OnZoom'
     */
    zoom?: EmitType<IMapZoomEventArgs>;

    /**
     * Triggers before performing the panning operation.
     * @event
     * @blazorProperty 'OnPan'
     */
    pan?: EmitType<IMapPanEventArgs>;

}