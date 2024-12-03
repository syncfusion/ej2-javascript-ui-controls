import { TreeMap } from '../../treemap/treemap';
import { BorderModel, FontModel } from '../model/base-model';
import { LegendShape, LegendPosition } from '../utils/enum';
import { Size } from '../utils/helper';


/**
 * Specifies the event argument for the treemap.
 *
 * @private
 */
export interface ITreeMapEventArgs {
    /** Defines the name of the event. */
    name: string;
    /**
     * Specifies the cancel state for the event. The default value is false.
     * If set as true, the event progress will be stopped.
     */
    cancel: boolean;
}
/**
 * Specifies the event arguments for print event in treemap.
 */
export interface IPrintEventArgs extends ITreeMapEventArgs {
    /**
     * Specifies the html content that is printed. The html content returned is usually the id string of the treemap.
     */
    htmlContent: Element;
}
/**
 * Specifies the event arguments for load event in treemap.
 */
export interface ILoadEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
}

/**
 * Specifies the event arguments for loaded event in treemap.
 */
export interface ILoadedEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;

    /** Specifies whether the treemap is resized or not.
     */
    isResized: boolean;
}

/**
 * Specifies the event arguments in item rendering event in treemap.
 */
export interface IItemRenderingEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current rendering item.
     */
    currentItem: Object;
    /**
     * Defines all the items for rendering.
     */
    RenderItems?: Object[];
    /**
     * Defines the options for the treemap item rendering.
     */
    options: Object;
    /**
     * Defines the label of the treemap item.
     */
    text: string;
}

/**
 * Specifies the event arguments for the drill down start event of treemap.
 */
export interface IDrillStartEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current drill-down item.
     */
    item: Object;
    /**
     * Defines the current element of drill-down.
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
     * Returns whether the right click is performed or not.
     */
    rightClick: boolean;
    /**
     * Defines the details of the child level items in the drill start event.
     */
    childItems: Object;
}

/**
 * Specifies the event arguments for the drill down end event of the treemap.
 */
export interface IDrillEndEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines all the items which is rendered after drill down.
     */
    renderItems: Object[];
}

/**
 * Defines the event arguments for treemap item click event.
 */
export interface IItemClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current item in the click event.
     *
     * @isGenericType true
     */
    item: Object;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
    /**
     * Defines the index of the level of the current treemap item.
     */
    groupIndex: number;
    /**
     * Defines the name of the parent item of the current treemap item.
     */
    groupName: string;
    /**
     * Defines the label of the current treemap item.
     */
    text: string;
    /**
     * Defines the template of the treemap item which is added as custom element for the labels in the treemap.
     */
    contentItemTemplate : string;
}

/**
 * Defines the event argument of the treemap item data.
 *
 * @private
 */
export interface IItemDataEventArgs {
    /**
     * Defines the name of the treemap item.
     */
    name: string;
    /**
     * Defines the level of the current treemap item.
     */
    groupIndex: number;
    /**
     * Defines the parent name of the current treemap item.
     */
    groupName: string;
    /**
     * Specifies whether the drill down is performed or not.
     */
    isDrilled: boolean;
    /**
     * Specifies whether the item is leaf item or not.
     */
    isLeafItem: boolean;
    /**
     * Defines the item area in the treemap.
     */
    itemArea: number;
    /**
     * Defines the name of the parent level of the treemap item.
     */
    levelOrderName: string;
    /**
     * Defines the options provided in the event arguments
     */
    options?: Object;
    /**
     * Specifies the rect element in the event.
     */
    rect?: Object;
}

/**
 * Specifies the event arguments available when mouse move action is performed on the treemap items.
 */
export interface IItemMoveEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current item on which mouse is moved.
     *
     * @isGenericType true
     */
    item: Object;
    /**
     * Defines the original mouse event argument.
     */
    mouseEvent: PointerEvent;
}

/**
 * Specifies the event arguments available when click event is performed on the treemap items.
 */
export interface IClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
}

/**
 * Specifies the event arguments available when double click action is performed on the treemap items.
 */
export interface IDoubleClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
}

/**
 * Specifies the event arguments available when right click action is performed on the treemap items.
 */
export interface IRightClickEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
}

/**
 * Specifies the event arguments available when mouse action is performed on the treemap items.
 */
export interface IMouseMoveEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
}

/**
 * Specifies the event arguments available when the leaf item is selected in the treemap.
 */
export interface IItemSelectedEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Specifies the current selected item.
     */
    items: Object[];
    /**
     * Specifies the current selected elements.
     */
    elements: Element[];
    /**
     * Defines the label of the current selected item.
     */
    text: string;
    /**
     * Defines the template of the treemap item which is added as custom element for the labels in the treemap.
     */
    contentItemTemplate : string;
}

/**
 * Specifies the event arguments available when the item is highlighted in the treemap.
 */
export interface IItemHighlightEventArgs extends ITreeMapEventArgs {
    /**
     * Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current item which is highlighted.
     */
    items: Object[];
    /**
     * Defines the current highlighted elements.
     */
    elements: Element[];
}

/**
 * Specifies the event arguments available when the tooltip is rendered in the treemap.
 */
export interface ITreeMapTooltipRenderEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current treemap item in which the tooltip appears.
     */
    item: Object;
    /**
     * Defines the options for customizing the tooltip.
     */
    options: Object;
    /**
     * Defines the element of the current item on which tooltip is rendered.
     */
    element?: Element;
    /**
     * Defines the original mouse event arguments.
     */
    eventArgs: PointerEvent;
}

/**
 * Specifies the event arguments available for the tooltip events in the treemap.
 *
 * @private
 */
export interface ITreeMapTooltipArgs extends ITreeMapEventArgs {
    /**
     * Defines the location of the tooltip rendering event.
     */
    location: Object;
    /**
     * Defines the text rendered in the tooltip.
     */
    text: string[];
    /**
     * Defines the data for rendering the tooltip.
     */
    data: Object;
    /**
     * Defines the text style for customizing the tooltip text.
     */
    textStyle: FontModel;
    /**
     * Defines the template for rendering the tooltip.
     *
     * @aspType string
     */
    template: string | Function;
}

/**
 * Specifies the event arguments available when rendering each legend item in the treemap.
 */
export interface ILegendItemRenderingEventArgs extends ITreeMapEventArgs {
    /**
     * Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Specifies the shape color of the current legend item.
     */
    fill?: string;
    /**
     * Specifies the options for customizing the color and width of the shape border.
     */
    shapeBorder?: BorderModel;
    /**
     * Defines the shape of the current legend item.
     */
    shape?: LegendShape;
    /**
     * Defines the URL of the legend if the shape is set as image.
     */
    imageUrl?: string;
}

/**
 * Specifies the event arguments available when rendering the legend in the treemap.
 */
export interface ILegendRenderingEventArgs extends ITreeMapEventArgs {
    /**
     * Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Specifies the position of the legend in the treemap.
     */
    position?: LegendPosition;
    /**
     * Specifies the position of the legend in the treemap.
     */
    _changePosition?: LegendPosition;
}


/**
 * Specifies the event arguments available for resize event of the treemap.
 */
export interface IResizeEventArgs extends ITreeMapEventArgs {
    /** Defines the size of the treemap before resizing the window. */
    previousSize: Size;
    /** Defines the size of the treemap after resizing the window. */
    currentSize: Size;
    /** Defines the treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
}


/**
 * @private
 */
export interface IFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
}


/**
 * @private
 */
export interface IShapes {
    renderOption?: Object;
    functionName?: string;
}


/**
 * Defines the theme supported for treemap.
 *
 * @private
 */
export interface IThemeStyle {
    /**
     * Defines the background color of the treemap, supporting the theme.
     */
    backgroundColor: string;
    /**
     * Defines the title text color of the treemap, supporting the theme.
     */
    titleFontColor: string;
    /**
     * Defines the title font weight of the treemap, supporting the theme.
     */
    titleFontWeight: string;
    /**
     * Defines the subtitle text color of the treemap, supporting the theme.
     */
    subTitleFontColor: string;
    /**
     * Defines the tooltip fill color of the treemap, supporting the theme.
     */
    tooltipFillColor: string;
    /**
     * Defines the tooltip text color of the treemap supporting the theme.
     */
    tooltipFontColor: string;
    /**
     * Defines the tooltip text size of the treemap supporting the theme.
     */
    tooltipFontSize: string;
    /**
     * Defines the opacity of tooltip in the treemap, supporting the theme.
     */
    tooltipFillOpacity?: number;
    /**
     * Defines the opacity of tooltip text in the treemap, supporting the theme.
     */
    tooltipTextOpacity?: number;
    /**
     * Defines the color of the legend title in the treemap, supporting the theme.
     */
    legendTitleColor: string;
    /**
     * Defines the color of the legend text in the treemap, supporting the theme.
     */
    legendTextColor: string;
    /**
     * Defines the font weight of texts in the treemap, supporting the theme.
     */
    fontWeight?: string;
    /**
     * Defines the font family of texts in the treemap, supporting the theme.
     */
    fontFamily?: string;
    /**
     * Defines the font size of the texts in the treemap, supporting the theme.
     */
    fontSize?: string;
    /**
     * Defines the font size of the texts in the subtitle of the TreeMap, supporting the theme.
     */
    subtitleFontSize?: string;
    /**
     * Defines the font size of the legend texts in the treemap, supporting the theme.
     */
    legendFontSize?: string;
    /**
     * Defines the font family of the label contents in the treemap, supporting the theme.
     */
    labelFontFamily?: string;
    /**
     * Defines the font size of the label contents in the treemap, supporting the theme.
     */
    labelFontSize?: string;
    /**
     * Defines the border color of the legend in the treemap, supporting the theme.
     */
    legendBorderColor?: string;
    /**
     * Defines the border width of the legend in the treemap, supporting the theme.
     */
    legendBorderWidth?: number;
    /**
     * Defines the border color of the tooltip in the treemap, supporting the theme.
     */
    tooltipBorderColor?: string;
    /**
     * Defines the border width of the tooltip in the treemap, supporting the theme.
     */
    tooltipBorderWidth?: number;
}
