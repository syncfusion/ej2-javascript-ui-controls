/**
 * Maps interfaces doc
 */
import { Maps, FontModel, BorderModel } from '../../index';
import { Size } from '../utils/helper';
import {
    LayerSettingsModel, MarkerSettingsModel, DataLabelSettingsModel, ShapeSettingsModel,
    MarkerType, LegendShape, Annotation
} from '../index';
/**
 * Specifies Maps Events
 * @private
 */
export interface IMapsEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}
/**
 * specifies Print Events
 */
export interface IPrintEventArgs extends IMapsEventArgs {
    htmlContent: Element;
}
/**
 * Specifies the Loaded Event arguments.
 */
export interface ILoadedEventArgs extends IMapsEventArgs {
    /** Defines the current Maps instance */
    maps: Maps;
}
/**
 * Specifies the Load Event arguments.
 */
export interface ILoadEventArgs extends IMapsEventArgs {
    /** Defines the current Maps instance */
    maps: Maps;
}
/**
 * Specifies the data label Event arguments.
 */
export interface IDataLabelArgs extends IMapsEventArgs {
    /** Defines the current Maps instance */
    maps: Maps;
    /**
     * define event
     */
    dataLabel: DataLabelSettingsModel;
}
/**
 * Specifies the Chart Mouse Event arguments.
 */
export interface IMouseEventArgs extends IMapsEventArgs {
    /** Defines current mouse event target id */
    target: string;
    /** Defines current mouse x location */
    x: number;
    /** Defines current mouse y location */
    y: number;
}
/**
 * Maps Resize event arguments.
 */
export interface IResizeEventArgs {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the maps */
    previousSize: Size;
    /** Defines the current size of the maps */
    currentSize: Size;
    /** Defines the Maps instance */
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
/**
 * Specifies TooltipRender event arguments for maps.
 */
export interface ITooltipRenderEventArgs extends IMapsEventArgs {
    /** Defines the current TreeMap instance */
    maps: Maps;
    /**
     * Define the content 
     */
    content?: string | HTMLElement;
    /**
     * Define the tooltip options.
     */
    options: Object;
    /**
     * textStyle event argument 
     */
    textStyle?: FontModel;
    /**
     * border event argument 
     */
    border?: BorderModel;
    /**
     * fill color event argument 
     */
    fill?: string;
    /**
     * Define the current tooltip element.
     */
    element: Element;
    /**
     * Define the mouse location.
     */
    eventArgs: PointerEvent;
}
/**
 * Specifies itemSelection event arguments for maps.
 */
export interface ISelectionEventArgs extends IMapsEventArgs {
    /**
     * fill event argument
     */
    fill?: string;
    /**
     * opacity event argument
     */
    opacity?: number;
    /**
     * border event argument
     */
    border?: BorderModel;
    /** 
     * Defines current mouse event target id 
     */
    target?: string;
    /**
     * shape data event argument
     */
    shapeData?: object;
    /**
     * data from data source
     */
    data?: object;
}
/**
 * Specifies shapeSelected event arguments for maps.
 */
export interface IShapeSelectedEventArgs extends IMapsEventArgs {
    /**
     * fill event argument
     */
    fill?: string;
    /**
     * opacity event argument
     */
    opacity?: number;
    /**
     * border event argument
     */
    border?: BorderModel;
    /**
     * shapeData event argument
     */
    shapeData?: object;
    /**
     * data source event argument
     */
    data?: object;
    /** Defines current mouse event target id */
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
 * Specifies layerRendering event arguments for maps.
 */
export interface ILayerRenderingEventArgs extends IMapsEventArgs {
    /**
     * layer index event argument 
     */
    index?: number;
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * layer options event argument
     */
    layer?: LayerSettingsModel;
}

/**
 * Specifies shapeRendering event arguments for maps.
 */
export interface IShapeRenderingEventArgs extends IMapsEventArgs {
    /**
     * shape index event argument 
     */
    index?: number;
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * current shape settings
     */
    shape?: ShapeSettingsModel;
    /**
     * current shape fill
     */
    fill?: string;
    /**
     * current shape border
     */
    border?: BorderModel;
    /**
     * shape data source event argument
     */
    data?: object;
}
/**
 * Specifies markerRendering event arguments for maps.
 */
export interface IMarkerRenderingEventArgs extends IMapsEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * marker instance. This is Read Only option.
     */
    marker?: MarkerSettingsModel;
    /**
     * Marker fill.
     */
    fill?: string;

    /**
     * To customize the height of the marker.
     */
    height?: number;

    /**
     * To customize the width of the marker.
     */
    width?: number;

    /**
     * To customize the shape of the marker.
     */
    shape?: MarkerType;

    /**
     * To provide the image url for rendering marker image
     */
    imageUrl?: string;

    /**
     * To customize the template of the marker.
     */
    template?: string;
    /**
     * Configures the marker border
     */
    border?: BorderModel;
    /**
     * marker data event argument
     */
    data?: object;
}

/**
 * Specifies markerClick event arguments for maps.
 */
export interface IMarkerClickEventArgs extends IMouseEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * marker instance event argument
     */
    marker?: MarkerSettingsModel;
    /**
     * marker data event argument
     */
    data?: object;
}

/**
 * Specifies markerMove event arguments for maps.
 */
export interface IMarkerMoveEventArgs extends IMouseEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * marker data event argument. This is Read Only option.
     */
    data?: object;
}

/**
 * Specifies labelRendering event arguments for maps.
 */
export interface ILabelRenderingEventArgs extends IMapsEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * data label text event argument
     */
    text?: string;
    /**
     * Configures the label border
     */
    border?: BorderModel;
    /**
     * configure the fill
     */
    fill?: string;
    /**
     * To customize the data label template.
     */
    template?: string;
    /**
     * label instance event argument
     */
    datalabel?: DataLabelSettingsModel;
}

/**
 * Specifies bubbleRendering event arguments for maps.
 */
export interface IBubbleRenderingEventArgs extends IMapsEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * bubble fill event argument
     */
    fill?: string;
    /**
     * bubble border event argument
     */
    border?: BorderModel;
    /**
     * current bubble center x
     */
    cx?: number;
    /**
     * current bubble center y
     */
    cy?: number;
    /**
     * current bubble radius
     */
    radius?: number;
    /**
     * current bubble data
     */
    data?: object;
}
/**
 * Specifies bubbleClick event arguments for maps.
 */
export interface IBubbleClickEventArgs extends IMouseEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * bubble current data event argument
     */
    data?: object;
}

/**
 * Specifies bubbleMove event arguments for maps.
 */
export interface IBubbleMoveEventArgs extends IMouseEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * bubble current data event argument
     */
    data?: object;
}
/**
 * Specifies animationComplete event arguments for maps.
 */
export interface IAnimationCompleteEventArgs extends IMapsEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * animation element type event argument
     */
    element: string;
}

/**
 * Specifies legendRendering event arguments for maps.
 */
export interface ILegendRenderingEventArgs extends IMapsEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * Specifies the legend shape color
     */
    fill?: string;

    /**
     * Options for customizing the color and width of the shape border.
     */
    shapeBorder?: BorderModel;

    /**
     * Customize the legend shape of the maps.
     */
    shape?: LegendShape;
}

/**
 * Specifies annotationRendering event arguments for maps.
 */
export interface IAnnotationRenderingEventArgs extends IMapsEventArgs {
    /**
     * maps instance event argument
     */
    maps?: Maps;
    /**
     * Specifies the annotation content
     */
    content?: string;
    /**
     * Specifies the annotation instance
     */
    annotation?: Annotation;
}
