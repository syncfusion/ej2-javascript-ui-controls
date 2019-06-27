import { TreeMap } from '../../treemap/treemap';
import { BorderModel } from '../model/base-model';
import { LegendShape, LegendPosition } from '../utils/enum';
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
 * @deprecated
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

/**
 * Specifies the Item Rendering Event arguments.
 * @deprecated
 */
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

/**
 * Specifies the Drill Start Event arguments.
 * @deprecated
 */
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
    /**
     * Defines the level of the treemap item.
     */
    groupIndex: number;
    /**
     * Defines the parent name of the treemap item.
     */
    groupName: string;
    /**
     * return the boolean value whether it is right or not.
     */
    rightClick: boolean;
    /**
     * return the child values to process the onDemand support.
     */
    childItems: Object;


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
    /**
     * Defines the level of the treemap item.
     */
    groupIndex: number;
    /**
     * Defines the parent name of the treemap item.
     */
    groupName: string;
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

export interface IDoubleClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current TreeMap instance */
    treemap: TreeMap;
    /**
     * Define the mouse event.
     */
    mouseEvent: PointerEvent;
}

export interface IRightClickEventArgs extends ITreeMapEventArgs {
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

/**
 * Specifies the Tooltip Rendering Event arguments.
 * @deprecated
 */
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
 * @deprecated
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
 * Specifies legendRendering event arguments for maps.
 */
export interface ILegendRenderingEventArgs extends ITreeMapEventArgs {
    /**
     * maps instance event argument
     */
    treemap?: TreeMap;
    /**
     * Customize the legend position of the maps.
     */
    position?: LegendPosition;
    /**
     * Customize the legend position of the maps.
     */
    _changePosition?: LegendPosition;
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


/**
 * Specifies the theme style interface.
 */
export interface IThemeStyle {
    backgroundColor: string;
    titleFontColor: string;
    subTitleFontColor: string;
    tooltipFillColor: string;
    tooltipFontColor: string;
    tooltipFillOpacity?: number;
    tooltipTextOpacity?: number;
    legendTitleColor: string;
    legendTextColor: string;
    fontFamily?: string;
    fontSize?: string;
    legendFontSize?: string;
    labelFontFamily?: string;
}