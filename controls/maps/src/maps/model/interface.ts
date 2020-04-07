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
 * Specifies the event arguments for the maps component.
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
     * Specifies the html content that is printed. The html content returned is usually the id string of the maps.
     */
    htmlContent: Element;
}
/**
 * Specifies the event arguments for load event in maps.
 */
export interface ILoadedEventArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
     * @deprecated
     */
    maps?: Maps;
}
/**
 * Specifies the event argument load event in maps.
 */
export interface ILoadEventArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
     * @deprecated
     */
    maps?: Maps;
}
/**
 * Specifies the event arguments for the data-label event in maps.
 */
export interface IDataLabelArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
     * @deprecated
     */
    maps: Maps;
    /**
     * Defines the labels in maps.
     */
    dataLabel: DataLabelSettingsModel;
}
/**
 * Specifies the event arguments for mouse move event in maps.
 */
export interface IMouseEventArgs extends IMapsEventArgs {
    /** Defines the current mouse event target id */
    target: string;
    /** Defines the current mouse x location. */
    x: number;
    /** Defines the current mouse y location. */
    y: number;
    /** Defines the current latitude value of maps location */
    latitude?: number;
    /** Defines the current longitude value of maps location */
    longitude?: number;
}
/**
 * Specifies the current position in maps.
 */
export interface GeoPosition {
    /** Specifies the current latitude value for the maps location. */
    latitude?: number;
    /** Specifies the current longitude value for the maps location. */
    longitude?: number;
}
/**
 * Specifies the event arguments for tooltip render event in maps.
 */
export interface ITooltipRenderCompleteEventArgs extends IMapsEventArgs {
    /** Defines the current map instance.
     * @deprecated 
     */
    maps?: Maps;
    /**
     * Define the current tooltip element.
     */
    element: Element;
    /**
     * Define the tooltip options.
     */
    options: Object;
}
/**
 * Specifies the event arguments for the resize event in maps.
 */
export interface IResizeEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Defines the previous size of the maps before the resize event. */
    previousSize: Size;
    /** Defines the current size of the maps after the resize event. */
    currentSize: Size;
    /** Defines the current maps instance.
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
    template ?: string;
}
/**
 * Specifies the event arguments for tooltip render event in maps.
 */
export interface ITooltipRenderEventArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Define the content of the tooltip.
     */
    content?: string | HTMLElement;
    /**
     * Define the tooltip options.
     */
    options?: Object;
    /**
     * Defines the style of text for the tooltip in event argument.
     */
    textStyle?: FontModel;
    /**
     * Defines the color and width of the border for the tooltip in event argument.
     */
    border?: BorderModel;
    /**
     * Defines the color for the tooltip in event argument.
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
     * Defines the original event arguments.
     */
    eventArgs?: PointerEvent;
}
/**
 * Specifies the event arguments for item selection event in maps.
 */
export interface ISelectionEventArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
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
     * Defines the color and width of the border for the selected shape in maps.
     */
    border?: BorderModel;
    /**
     * Defines current mouse event target id.
     */
    target?: string;
    /**
     * Defines the shape data for the maps.
     */
    shapeData?: Object;
    /**
     * Defines the data from the data source.
     */
    data?: Object;
}
/**
 * Specifies the event arguments for shape selected event in maps.
 */
export interface IShapeSelectedEventArgs extends IMapsEventArgs {
    /** Defines the current maps instance.
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
     * Defines the color and width of the border for the selected element in maps.
     */
    border?: BorderModel;
    /**
     * Defines the shapeData for the currently clicked shape.
     */
    shapeData?: Object;
    /**
     * Defines the data source for the currently clicked shape.
     */
    data?: Object;
    /** Defines the id string of current mouse event target. */
    target?: string;
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
     * Defines the maps instance in event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the options to customize the layers in event argument.
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
     * Defines the index value of shape rendering in the map.
     */
    index?: number;
    /**
     * Defines the maps instance in event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the current shape settings in event argument.
     */
    shape?: ShapeSettingsModel;
    /**
     * Defines the color for the current shape in event argument.
     */
    fill?: string;
    /**
     * Defines the color and width of the border for the current shape in event argument.
     */
    border?: BorderModel;
    /**
     * Defines the data for the shape from the data source in event argument.
     */
    data?: Object;
}
/**
 * Specifies the event arguments in marker rendering event in maps.
 */
export interface IMarkerRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance in event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the marker instance.
     */
    marker?: MarkerSettingsModel;
    /**
     * Defines the color for the marker in event argument.
     */
    fill?: string;

    /**
     * Defines the height of the marker in event argument.
     */
    height?: number;

    /**
     * Defines the width of the marker.
     */
    width?: number;

    /**
     * Defines the shape of the marker.
     */
    shape?: MarkerType;

    /**
     * Defines the URL path for the marker when rendered as image.
     */
    imageUrl?: string;

    /**
     * Defines the template of the marker.
     */
    template?: string;
    /**
     * Defines the color and width of the border for the marker.
     */
    border?: BorderModel;
    /**
     * Defines the marker data from the marker data source in maps.
     */
    data?: Object;
    /**
     * Defines the value path of marker color from the marker data source.
     */
    colorValuePath?: string;
    /**
     * Defines the value path of marker shape from the marker data source.
     */
    shapeValuePath?: string;
    /**
     * Defines the value path of marker image from the marker data source.
     */
    imageUrlValuePath?: string;
}

/**
 * Specifies the event arguments for marker cluster rendering event in maps.
 */
export interface IMarkerClusterRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the marker cluster instance.
     */
    cluster?: MarkerClusterSettingsModel;
    /**
     * Defines the color for the marker cluster.
     */
    fill?: string;

    /**
     * Defines the height for the marker cluster.
     */
    height?: number;

    /**
     * Defines the width for the marker cluster.
     */
    width?: number;

    /**
     * Defines the shape for the marker cluster.
     */
    shape?: MarkerType;

    /**
     * Defines the URL path for rendering image as marker cluster.
     */
    imageUrl?: string;
    /**
     * Defines the color and width of the border for the marker cluster.
     */
    border?: BorderModel;
    /**
     * Defines the data for the marker cluster in maps.
     */
    data?: Object;

}

/**
 * Specifies the event arguments for marker click event in maps.
 */
export interface IMarkerClickEventArgs extends IMouseEventArgs {
    /**
     * Defines the maps instance event argument.
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
     * Defines the marker data for the marker that is clicked.
     */
    data?: Object;
}

/**
 * Specifies the event arguments for marker move event in maps.
 */
export interface IMarkerMoveEventArgs extends IMouseEventArgs {
    /**
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the data of the marker in event argument.
     */
    data?: Object;
}

/**
 * Specifies the event arguments for the cluster click event in maps.
 */
export interface IMarkerClusterClickEventArgs extends IMouseEventArgs {
    /**
     * Defines the currently clicked marker data.
     */
    data?: Object;
    /**
     * Defines the maps instance event argument.
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
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the data of the cluster of marker in event argument.
     */
    data?: Object;
}

/**
 * Specifies the event argument for label rendering event in maps.
 */
export interface ILabelRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the text for the data-label in event argument.
     */
    text: string;
    /**
     * Defines the color and width of the border for the data-label in event argument.
     */
    border: BorderModel;
    /**
     * Defines the color for the data-label in event argument.
     */
    fill: string;
    /**
     * Defines the template for the data-label.
     */
    template: string;
    /**
     * Defines the instance of the data-label in event argument.
     */
    datalabel?: DataLabelSettingsModel;
}

/**
 * Specifies the event arguments for bubble rendering event in maps.
 */
export interface IBubbleRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the color for the bubble in event argument.
     */
    fill?: string;
    /**
     * Defines the color and width of the border for the bubble in event argument.
     */
    border?: BorderModel;
    /**
     * Defines the center x position for the current bubble.
     */
    cx?: number;
    /**
     * Defines the center Y position for the current bubble.
     */
    cy?: number;
    /**
     * Defines the radius for the current bubble.
     */
    radius?: number;
    /**
     * Defines the data for the current bubble.
     */
    data?: Object;
}
/**
 * Specifies the event argument for bubble click event in maps.
 */
export interface IBubbleClickEventArgs extends IMouseEventArgs {
    /**
     * Defines the maps instance in event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the current data for the bubble in event argument.
     */
    data?: Object;
}

/**
 * Specifies the event argument for bubble mouse move event in maps.
 */
export interface IBubbleMoveEventArgs extends IMouseEventArgs {
    /**
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the data for the current bubble on which the mouse has hovered in event argument.
     */
    data?: Object;
}
/**
 * Specifies the event arguments for animation complete event in maps.
 */
export interface IAnimationCompleteEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance event argument.
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
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the color for the shape of legend in event argument.
     */
    fill?: string;

    /**
     * Defines the options for customizing the color and width of the shape in legend.
     */
    shapeBorder?: BorderModel;

    /**
     * Defines the shape of the legend in maps.
     */
    shape?: LegendShape;
    /**
     * Defines the text for legend.
     */
    text?: string | string[];
}

/**
 * Specifies the event arguments for annotation rendering event in maps.
 */
export interface IAnnotationRenderingEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance in event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the content for annotation in maps.
     */
    content?: string;
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
     * Defines the maps instance in event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the tile map translate point.
     */
    tileTranslatePoint?: Object;
    /**
     * Defines the translate point of the geometry map.
     */
    translatePoint?: Object;
    /**
     * Defines the zoom level for the tile map.
     */
    tileZoomLevel?: number;
    /**
     * Defines the scale value for the maps.
     */
    scale?: number;
    /**
     * Defines the latitude value of maps on pan event.
     */
    latitude: number;
    /**
     * Defines the longitude value of maps on pan event.
     */
    longitude: number;
}

/**
 * Specifies the event arguments for zoom event in maps.
 */
export interface IMapZoomEventArgs extends IMapsEventArgs {
    /**
     * Defines the maps instance event argument.
     * @deprecated
     */
    maps?: Maps;
    /**
     * Defines the type of zoom interaction.
     */
    type: string;
    /**
     * Defines the tile translate point.
     */
    tileTranslatePoint?: Object;
    /**
     * Defines the translate point of geometry map.
     */
    translatePoint?: Object;
    /**
     * Defines the zoom level for the tile maps.
     */
    tileZoomLevel?: Object;
    /**
     * Defines the scale value for the maps.
     */
    scale?: Object;
}


/** @private */
/**
 * Specifies the theme style for maps.
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
    /** Specifies the font size for the title in maps. */
    titleFontSize?: string;
    /** Specifies the opacity for the tooltip in maps. */
    tooltipFillOpacity? : number;
    /** Specifies the text opacity for the tooltip in maps. */
    tooltipTextOpacity?: number;
    /** Specifies the font size for the legend in maps. */
    legendFontSize?: string;
    /** Specifies the font-family for the data label in maps. */
    labelFontFamily?: string;
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