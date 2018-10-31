import { TreeMap } from '../../treemap/treemap';
import { BorderModel } from '../model/base-model';
import { LegendShape } from '../utils/enum';
import { Size } from '../utils/helper';


/**
 * Specifies TreeMap Events
 * @private
 */
export interface ITreeMapEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}
export interface IPrintEventArgs extends ITreeMapEventArgs {
    htmlContent: Element;
}
/**
 * Specifies the Load Event arguments.
 */
export interface ILoadEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
}

/**
 * Specifies the Loaded Event arguments.
 */
export interface ILoadedEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
}

export interface IItemRenderingEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current rendering item.
     */
    currentItem: Object;
    /**
     * Define the all render items
     */
    RenderItems: Object[];
    /**
     * Define the options.
     */
    options: Object;
}

export interface IDrillStartEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current drillDown item.
     */
    item: Object;
    /**
     * Define the current element of drillDown.
     */
    element: Element;
}

export interface IDrillEndEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the rendering all items.
     */
    renderItems: Object[];
}

export interface IItemClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current item click.
     */
    item: Object;
    /**
     * Define the mouse event.
     */
    mouseEvent: PointerEvent;
}

export interface IItemMoveEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current item move.
     */
    item: Object;
    /**
     * Define the mouse event.
     */
    mouseEvent: PointerEvent;
}

export interface IClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the mouse event.
     */
    mouseEvent: PointerEvent;
}

export interface IMouseMoveEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the mouse event.
     */
    mouseEvent: PointerEvent;
}

export interface IItemSelectedEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current item selected.
     */
    items: Object[];
    /**
     * Define the current element of selected.
     */
    elements: Element[];
}

export interface IItemHighlightEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current item highlight.
     */
    items: Object[];
    /**
     * Define the current element of highlight.
     */
    elements: Element[];
}

export interface ITreeMapTooltipRenderEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the current tooltip item.
     */
    item: Object;
    /**
     * Define the tooltip options.
     */
    options: Object;
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
 * Specifies legendRendering event arguments for maps.
 */
export interface ILegendItemRenderingEventArgs extends ITreeMapEventArgs {
    /**
     * maps instance event argument
     */
    treemap?: TreeMap;
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
    /**
     * Customize the image url.
     */
    imageUrl: string;
}

/**
 * TreeMap Resize event arguments.
 */
export interface IResizeEventArgs extends ITreeMapEventArgs {
    /** Defines the previous size of the treemap */
    previousSize: Size;
    /** Defines the current size of the treemap */
    currentSize: Size;
    /** Defines the treemap instance */
    treemap: TreeMap;
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
export interface IShapes {
    renderOption?: Object;
    functionName?: string;
}