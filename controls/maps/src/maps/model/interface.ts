/**
 * Maps interfaces doc
 */
import { Maps, FontModel, BorderModel } from '../../index';
import { Size } from '../utils/helper';
import {
    LayerSettingsModel, MarkerSettingsModel, DataLabelSettingsModel, ShapeSettingsModel,
    MarkerType, LegendShape, Annotation, MarkerClusterSettingsModel
} from '../index';
import { ToolLocationModel, TextStyleModel } from '@syncfusion/ej2-svg-base';
/**
 * Specifies the event arguments for the maps.
 *
 * @private
 */
export interface IMapsEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Specifies the cancel state for the event. The default value is false. If set as true, the event progress will be stopped. */
    cancel: boolean;
}
/**
 * Specifies the event arguments for print event in maps.
 */
export interface IPrintEventArgs extends IMapsEventArgs {
    /**
     * Specifies the HTML content that is printed. The HTML content returned is usually the id string of the maps.
     */
    htmlContent: Element;
}
/**
 * Specifies the event arguments for the loaded event in maps.
 */
export interface ILoadedEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;

    /**
     * Defines whether the maps is resized or not.
     */
    isResized: boolean;
}
/**
 * Specifies the event argument of the load event in maps.
 */
export interface ILoadEventArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
}
/**
 * Specifies the event arguments for the data-label event in maps.
 */
export interface IDataLabelArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     * 
     * @deprecated
     */
    maps: Maps;
    /**
     * Defines the data label instance in maps.
     */
    dataLabel: DataLabelSettingsModel;
}
/**
 * Specifies the event arguments for mouse event in maps.
 */
export interface IMouseEventArgs extends IMapsEventArgs {
    /** Defines the current mouse event target id. */
    target: string;
    /** Defines the current mouse x location in pixels. */
    x: number;
    /** Defines the current mouse y location in pixels. */
    y: number;
    /** Defines the current latitude value of maps location. */
    latitude?: number;
    /** Defines the current longitude value of maps location */
    longitude?: number;
    /** Specifies whether the shape is selected or not in the maps. */
    isShapeSelected?: boolean;
}
/**
 * Specifies the location using geographical coordinates in maps.
 */
export interface GeoPosition {
    /** Specifies the latitude value for the maps location. */
    latitude?: number;
    /** Specifies the longitude value for the maps location. */
    longitude?: number;
}
/**
 * Specifies the event arguments for tooltip render event in maps.
 */
export interface ITooltipRenderCompleteEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the current tooltip element.
     */
    element: Element;
    /**
     * Defines the options of the tooltip.
     */
    options: Object;
}
/**
 * Specifies the event arguments for the resize event in maps.
 */
export interface IResizeEventArgs extends IMapsEventArgs {
    /** Defines the size of the maps before the resize event. */
    previousSize: Size;
    /** Defines the size of the maps after the resize event. */
    currentSize: Size;
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps: Maps;
}

/** @private */
export interface IFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
}

/** @private */
export interface MapsTooltipOption {
    location ?: ToolLocationModel;
    text ?:  string[];
    data ?: Object;
    textStyle ?: TextStyleModel;
    template ?: string | Function;
}
/**
 * Specifies the event arguments for tooltip render event in maps.
 */
export interface ITooltipRenderEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the content of the tooltip.
     */
    content?: string | HTMLElement;
    /**
     * Defines the options of the tooltip.
     */
    options?: Object;
    /**
     * Defines the style of text for the tooltip.
     */
    textStyle?: FontModel;
    /**
     * Defines the settings of the border for the tooltip.
     */
    border?: BorderModel;
    /**
     * Defines the color of the tooltip.
     */
    fill?: string;
    /**
     * Defines the data in tooltip.
     */
    data?: Object;
    /**
     * Defines the current tooltip element.
     */
    element: Element;
    /**
     * Defines the original mouse event arguments.
     */
    eventArgs?: PointerEvent;
}
/**
 * Specifies the event arguments for item selection event in maps.
 */
export interface ISelectionEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the color while selecting the shape in maps.
     */
    fill?: string;
    /**
     * Defines the opacity for the selected shape.
     */
    opacity?: number;
    /**
     * Defines the settings of the border for the selected shape in maps.
     */
    border?: BorderModel;
    /**
     * Defines target id of current mouse event.
     */
    target?: string;
    /**
     * Defines the data from GeoJSON data for the current shape.
     */
    shapeData?: Object;
    /**
     * Defines the data from the data source for the current shape or marker.
     */
    data?: Object;
}
/**
 * Specifies the event arguments for shape selected event in maps.
 */
export interface IShapeSelectedEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the color for the selected shape in maps.
     */
    fill?: string;
    /**
     * Defines the opacity for the selected shape in maps.
     */
    opacity?: number;
    /**
     * Defines the settings of the border for the selected shape in maps.
     */
    border?: BorderModel;
    /**
     * Defines the data from the GeoJSON data for the currently selected shape.
     */
    shapeData?: Object;
    /**
     * Defines the data from the data source for the currently selected shape.
     */
    data?: Object;
    /** Defines the id string of the target of the current mouse event. */
    target?: string;
    /**
     * Returns the details of the shapes which are in selected state during multiple selection.
     */
    shapeDataCollection?: Object;
}

/** @private */
export interface ITouches {
    pageX?: number;
    pageY?: number;
    pointerId?: number;
}

/** @private */
export interface IShapes {
    renderOption?: Object;
    functionName?: string;
}
/**
 * Specifies the event arguments for layer rendering event in maps.
 */
export interface ILayerRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the layer index in event argument.
     */
    index?: number;
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the options to customize the layers in event argument.
     *
     * @deprecated
     */
    layer?: LayerSettingsModel;
    /**
     * Enables or disables the visibility of layer in event argument.
     */
    visible?: boolean;
}

/**
 * Specifies the event arguments in shape rendering event in maps.
 */
export interface IShapeRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the index value of the shape rendering in the maps.
     */
    index?: number;
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the current shape settings.
     */
    shape?: ShapeSettingsModel;
    /**
     * Defines the color for the current shape.
     */
    fill?: string;
    /**
     * Defines the settings of the border for the current shape.
     */
    border?: BorderModel;
    /**
     * Defines the data from the data source for the shape which is being currently rendered.
     */
    data?: Object;
}
/**
 * Specifies the event arguments in marker rendering event in maps.
 */
export interface IMarkerRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the marker instance.
     */
    marker?: MarkerSettingsModel;
    /**
     * Defines the color of the marker which is currently rendered.
     */
    fill?: string;

    /**
     * Defines the height of the marker which is currently rendered.
     */
    height?: number;

    /**
     * Defines the width of the marker which is currently rendered.
     */
    width?: number;

    /**
     * Defines the shape of the marker which is currently rendered.
     */
    shape?: MarkerType;

    /**
     * Defines the URL path for the marker when rendered as image.
     */
    imageUrl?: string;

    /**
     * Defines the template of the marker.
     * 
     * @aspType string
     */
    template?: string | Function;
    /**
     * Defines the settings of the border for the marker.
     */
    border?: BorderModel;
    /**
     * Defines the current marker data from the marker data source in maps.
     */
    data?: Object;
    /**
     * Defines the field name from the marker data source to set the color from the marker data source.
     */
    colorValuePath?: string;
    /**
     * Defines the field name from the marker data source to set the marker shape from the marker data source.
     */
    shapeValuePath?: string;
    /**
     * Defines the field name from the marker data source to set the marker image from the marker data source.
     */
    imageUrlValuePath?: string;
}

/**
 * Specifies the event arguments for marker cluster rendering event in maps.
 */
export interface IMarkerClusterRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the marker cluster instance.
     */
    cluster?: MarkerClusterSettingsModel;
    /**
     * Defines the color of the marker cluster.
     */
    fill?: string;

    /**
     * Defines the height of the marker cluster.
     */
    height?: number;

    /**
     * Defines the width of the marker cluster.
     */
    width?: number;

    /**
     * Defines the shape of the marker cluster.
     */
    shape?: MarkerType;

    /**
     * Defines the URL path for rendering image as marker cluster.
     */
    imageUrl?: string;
    /**
     * Defines the settings of the border of the marker cluster.
     */
    border?: BorderModel;
    /**
     * Defines the data from marker data source for the marker cluster in maps.
     */
    data?: Object;

}

/**
 * Specifies the event arguments for marker click event in maps.
 */
export interface IMarkerClickEventArgs extends IMouseEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the marker instance in event argument.
     */
    marker?: MarkerSettingsModel;
    /**
     * Defines the name for a marker.
     */
    value: string;
    /**
     * Defines the data from the marker data source for the marker that is clicked.
     */
    data?: Object;
}

/**
 * Specifies the event arguments for marker click event in maps.
 */
export interface IMarkerDragEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Defines the current x position of the mouse pointer when dragging is performed. */
    x: number;
    /** Defines the current y position of the mouse pointer when dragging is performed. */
    y: number;
    /** Defines the current latitude number of the marker with which the dragging operation is performed. */
    latitude: number;
    /** Defines the current longitude number of the marker with which the dragging operation is performed. */
    longitude: number;
    /** Defines the index of the layer in which the current marker is associated. */
    layerIndex: number;
    /** Defines the index of the marker settings in which the current marker is associated. */
    markerIndex: number;
    /** Defines the index of the current marker data from the entire data source. */
    dataIndex: number;
}

/**
 * Specifies the event arguments for marker move event in maps.
 */
export interface IMarkerMoveEventArgs extends IMouseEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the data from the marker data source for the marker over which the mouse is moved.
     */
    data?: Object;
}

/**
 * Specifies the event arguments for the cluster click event in maps.
 */
export interface IMarkerClusterClickEventArgs extends IMouseEventArgs {
    /**
     * Defines the data from marker data source for the currently clicked marker.
     */
    data?: Object;
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the collection of markers in a cluster.
     */
    markerClusterCollection?: Object;
}

/**
 * Specifies the event arguments for marker cluster move event in maps.
 */
export interface IMarkerClusterMoveEventArgs extends IMouseEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the data from marker data source for the currently clicked marker.
     */
    data?: Object;
}

/**
 * Specifies the event argument for label rendering event in maps.
 */
export interface ILabelRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the text of the data-label which is being currently rendered.
     */
    text: string;
    /**
     * Defines the right and left position of text for the data-label.
     */
    offsetX: number;
    /**
     * Defines the top and bottom position of text for the data-label.
     */
    offsetY: number;
    /**
     * Defines the settings of the border of the data-label.
     */
    border: BorderModel;
    /**
     * Defines the color of the data-label.
     */
    fill: string;
    /**
     * Defines the template for the data-label.
     * 
     * @aspType string
     */
    template: string | Function;
    /**
     * Defines the instance of the data-label.
     */
    datalabel?: DataLabelSettingsModel;
}

/**
 * Specifies the event arguments for bubble rendering event in maps.
 */
export interface IBubbleRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the color of the bubble in event argument.
     */
    fill?: string;
    /**
     * Defines the settings of the border of the bubble in event argument.
     */
    border?: BorderModel;
    /**
     * Defines the center x position of the current bubble.
     */
    cx?: number;
    /**
     * Defines the center Y position of the current bubble.
     */
    cy?: number;
    /**
     * Defines the radius of the current bubble.
     */
    radius?: number;
    /**
     * Defines the data of the current bubble from data source.
     */
    data?: Object;
}
/**
 * Specifies the event argument for bubble click event in maps.
 */
export interface IBubbleClickEventArgs extends IMouseEventArgs {
    /**
     * Defines the maps instance in event argument.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the current data from the data source of the bubble in event argument.
     */
    data?: Object;
}

/**
 * Specifies the event argument for bubble mouse move event in maps.
 */
export interface IBubbleMoveEventArgs extends IMouseEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the data from the data source for the current bubble on which the mouse has hovered.
     */
    data?: Object;
}
/**
 * Specifies the event arguments for animation complete event in maps.
 */
export interface IAnimationCompleteEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the type of animation element in event argument.
     */
    element: string;
}

/**
 * Specifies the event arguments for the legend rendering event in maps.
 */
export interface ILegendRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the color for the shape of legend in event argument.
     */
    fill?: string;

    /**
     * Defines the options for customizing the border of the shape in legend.
     */
    shapeBorder?: BorderModel;

    /**
     * Defines the shape of the current legend item in maps.
     */
    shape?: LegendShape;
    /**
     * Defines the text of the current legend item.
     */
    text?: string | string[];
}

/**
 * Specifies the event arguments for annotation rendering event in maps.
 */
export interface IAnnotationRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the content of the annotation which is being rendered.
     * 
     * @aspType string
     */
    content?: string | Function;
    /**
     * Specifies the annotation instance.
     */
    annotation?: Annotation;
}

/**
 * Specifies the event arguments for the pan event in maps.
 */
export interface IMapPanEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the translate point of the online map providers.
     */
    tileTranslatePoint?: Object;
    /**
     * Defines the translate point of the geometry map.
     */
    translatePoint?: Object;
    /**
     * Defines the zoom level of the online map providers.
     */
    tileZoomLevel?: number;
    /**
     * Defines the scale value of the geometry maps.
     */
    scale?: number;
    /**
     * Defines the latitude value of the maps on pan event.
     */
    latitude: number;
    /**
     * Defines the longitude value of the maps on pan event.
     */
    longitude: number;
}

/**
 * Specifies the event arguments for zoom event in maps.
 */
export interface IMapZoomEventArgs extends IMapsEventArgs {
    /**
     * Defines the current maps instance.
     *
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the type of zoom interaction.
     */
    type: string;
    /**
     * Defines the translate point of the online map providers.
     */
    tileTranslatePoint?: Object;
    /**
     * Defines the translate point of the geometry map.
     */
    translatePoint?: Object;
    /**
     * Defines the zoom level for the tile maps.
     */
    tileZoomLevel?: Object;
    /**
     * Defines the scale value of the geometry maps.
     */
    scale?: Object;
}


/**
 * Specifies the theme style for maps.
 * @private
 */
export interface IThemeStyle {
    /** Specifies the background color for the maps based on theme style. */
    backgroundColor: string;
    /** Specifies the area background color for the maps based on theme style */
    areaBackgroundColor: string;
    /** Specifies the font color for the title of maps. */
    titleFontColor: string;
    /** Specifies the font color for the sub title of the maps. */
    subTitleFontColor: string;
    /** Specifies the font color for the title of legend in maps. */
    legendTitleFontColor: string;
    /** Specifies the color for the legend text in maps. */
    legendTextColor: string;
    /** Specifies the font color for the label in maps. */
    dataLabelFontColor: string;
    /** Specifies the font color for the tooltip in maps. */
    tooltipFontColor: string;
    /** Specifies the color of the tooltip in maps. */
    tooltipFillColor: string;
    /** Specifies the color for the zoom in maps. */
    zoomFillColor: string;
    /** Specifies the font-family for the maps. */
    fontFamily?: string;
    /** Specifies the font-family for the maps. */
    fontSize?: string;
    /** Specifies the font size for the title in maps. */
    titleFontSize?: string;
    /** Specifies the font size for the sub title and legend title in maps. */
    subTitleFontSize?: string;
    /** Specifies the font weight for the sub title and legend title in maps. */
    fontWeight?: string;
    /** Specifies the opacity for the tooltip in maps. */
    tooltipFillOpacity? : number;
    /** Specifies the text opacity for the tooltip in maps. */
    tooltipTextOpacity?: number;
    /** Specifies the font size for the legend in maps. */
    legendFontSize?: string;
    /** Specifies the font-family for the data label in maps. */
    labelFontFamily?: string;
    /** Specifies the font-weight for the data label in maps. */
    titleFontWeight?: string;
    /** Specifies the hover color for the zoom toolbar buttons in maps. */
    zoomSelectionColor?: string;
    /** Specifies the color for the shapes in the maps. */
    shapeFill?: string;
    /** Specifies the color by using rectangle zoom fill color in maps. */
    rectangleZoomFillColor?: string;
    /** Specifies the color by using rectangle zoom fill color in maps. */
    rectangleZoomFillOpacity?: number;
    /** Specifies the color by using rectangle zoom fill color in maps. */
    rectangleZoomBorderColor?: string;
}

/**
 * Defines the template for the marker.
 */
export interface IDataTemplate {
    /** Defines the latitude value for the template. */
    latitude?: number;
    /** Defines the longitude value for the template. */
    longitude?: number;
    /** Defines the name of a marker or data-label. */
    name?: string;
    /** Defines the continent name for data-label. */
    continent?: string;
    /** Defines the admin name for data-label. */
    admin?: string;
    /** Defines the population of bubble. */
    Population?: number;
    /** Defines the name of country. */
    Country?: string;
    /** Defines the Text of any string. */
    text?: string[];
}
