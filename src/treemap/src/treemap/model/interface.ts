/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { TreeMap } from '../../treemap/treemap';
import { BorderModel, FontModel } from '../model/base-model';
import { LegendShape, LegendPosition } from '../utils/enum';
import { Size } from '../utils/helper';


/**
 * Specifies the event argument for the treemap component.
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
 * Specifies the event arguments for on load event in treemap.
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

    /** Defines isResized argument.
     */
    isResized: boolean;
}

/**
 * Specifies the event arguments in item rendering event in treemap.
 */
export interface IItemRenderingEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current rendering item.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    currentItem: Object;
    /**
     * Defines all the items for rendering.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    RenderItems?: Object[];
    /**
     * Defines the options for the treemap item rendering.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Object;
    /**
     * Defines the header text of the treemap item.
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
     * Defines the current drill-down.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
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
     * Returns a boolean value whether it is right click or not.
     */
    rightClick: boolean;
    /**
     * Defines the child values of the item in the drill start event.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
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
     * Defines all the items for rendering.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    item: Object;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
    /**
     * Defines the level of the current treemap item.
     */
    groupIndex: number;
    /**
     * Defines the parent name of the current treemap item.
     */
    groupName: string;
    /**
     * Defines the header name of the current treemap item.
     */
    text: string;
    /**
     * Defines the template of the treemap item which is used to add it in the treemap control.
     */
    contentItemTemplate : string;
}

/**
 * Defines the event argument of the treemap item data.
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    options?: Object;
    /**
     * Specifies the rect element in the event.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    rect?: Object;
}

/**
 * Specifies the event arguments available on performing mouse move on the treemap items.
 */
export interface IItemMoveEventArgs extends ITreeMapEventArgs {
    /** Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Defines the current item move.
     *
     * @isGenericType true
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    item: Object;
    /**
     * Defines the original mouse event arguments.
     */
    mouseEvent: PointerEvent;
}

/**
 * Specifies the event arguments available on performing click event on the treemap items.
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
 * Specifies the event arguments available on performing double click event on the treemap items.
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
 * Specifies the event arguments available on performing right click event on the treemap items.
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
 * Specifies the event arguments available on performing mouse over on the treemap items.
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
 * Specifies the event arguments available when the item is selected in the treemap component.
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    items: Object[];
    /**
     * Specifies the current selected elements.
     */
    elements: Element[];
    /**
     * Defines the text used in the label contents.
     */
    text: string;
    /**
     * Defines the template of the treemap item which is used to add it in the treemap control.
     */
    contentItemTemplate : string;
}

/**
 * Specifies the event arguments available when the item is highlighted in the treemap component.
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    items: Object[];
    /**
     * Defines the current highlighted elements.
     */
    elements: Element[];
}

/**
 * Specifies the event arguments available when the tooltip is rendered in the treemap component.
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    item: Object;
    /**
     * Defines the options for customizing the tooltip.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Object;
    /**
     * Defines the current tooltip element.
     */
    element?: Element;
    /**
     * Defines the original mouse event arguments.
     */
    eventArgs: PointerEvent;
}

/**
 * Specifies the event arguments available for the tooltip events in the treemap component.
 */
export interface ITreeMapTooltipArgs extends ITreeMapEventArgs {
    /**
     * Defines the location of the tooltip rendering event.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    location: Object;
    /**
     * Defines the text rendered in the tooltip.
     */
    text: string[];
    /**
     * Defines the data for rendering the tooltip.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    data: Object;
    /**
     * Defines the text style for customizing the tooltip text.
     */
    textStyle: FontModel;
    /**
     * Defines the template for rendering the tooltip.
     */
    template: string;
}

/**
 * Specifies the event arguments available when rendering each legend item in the treemap component.
 */
export interface ILegendItemRenderingEventArgs extends ITreeMapEventArgs {
    /**
     * Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Specifies the shape color of the legend.
     */
    fill?: string;
    /**
     * Specifies the options for customizing the color and width of the shape border.
     */
    shapeBorder?: BorderModel;
    /**
     * Defines the legend shape of the treemap.
     */
    shape?: LegendShape;
    /**
     * Defines the URL of the legend if the shape is rendered as image.
     */
    imageUrl?: string;
}

/**
 * Specifies the event arguments available when rendering the legend in the treemap component.
 */
export interface ILegendRenderingEventArgs extends ITreeMapEventArgs {
    /**
     * Defines the current treemap instance.
     *
     * @deprecated
     */
    treemap?: TreeMap;
    /**
     * Specifies the position of the legend in the treemap component.
     */
    position?: LegendPosition;
    /**
     * Specifies the position of the legend in the treemap component.
     */
    _changePosition?: LegendPosition;
}


/**
 * Specifies the event arguments available for resize event of the treemap component.
 */
export interface IResizeEventArgs extends ITreeMapEventArgs {
    /** Defines the size of the treemap before resizing. */
    previousSize: Size;
    /** Defines the size of the treemap after resizing. */
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    renderOption?: Object;
    functionName?: string;
}


/**
 * Defines the theme supported for treemap component.
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
     * Defines the font family of texts in the treemap, supporting the theme.
     */
    fontFamily?: string;
    /**
     * Defines the font size of the texts in the treemap, supporting the theme.
     */
    fontSize?: string;
    /**
     * Defines the font size of the legend texts in the treemap, supporting the theme.
     */
    legendFontSize?: string;
    /**
     * Defines the font family of the label contents in the treemap, supporting the theme.
     */
    labelFontFamily?: string;
}
