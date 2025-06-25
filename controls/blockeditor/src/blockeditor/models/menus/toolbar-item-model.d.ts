import { ChildProperty, Property } from '@syncfusion/ej2-base';import { ItemType } from '@syncfusion/ej2-navigations';import { BuiltInToolbar } from '../../base/enums';

/**
 * Interface for a class ToolbarItem
 */
export interface ToolbarItemModel {

    /**
     * Specifies the unique identifier for the toolbar item.
     * This property is used to uniquely identify each item.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the toolbar item type.
     * Supports built-in formatting options or custom commands.
     *
     * @default 'Custom'
     */
    item?: BuiltInToolbar;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * Allows styling and representation of icons next to item headers.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the text content associated with the item.
     * It can be used as a label or description. Default is empty.
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the type of the item, determining its function or category.
     * The default type is ItemType.Button.
     *
     * @default 'Button'
     */
    type?: ItemType;

    /**
     * Specifies whether the item is visible.
     * This controls the visibility of the item in the UI. Default is true.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies whether the item is disabled.
     * When set to true, the item is not interactive. Default is false.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the tooltip text that appears when hovering over the item.
     * It provides additional information or context. Default is an empty string.
     *
     * @default ''
     */
    tooltip?: string;

    /**
     * Specifies additional CSS classes for styling the item.
     * This allows for further customization of the item's appearance. Default is an empty string.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the tab index of the item when it appears in a tabbing sequence.
     * This controls the keyboard focus order. Default is -1, indicating no focus.
     *
     * @default -1
     */
    tabIndex?: number;

    /**
     * Specifies the template used for rendering the item.
     * It can be a string or a function returning a string, allowing for customized rendering. Default is null.
     *
     * @default null
     */
    template?: string | Object | Function;

    /**
     * Defines htmlAttributes used to add custom attributes to Toolbar command.
     * Supports HTML attributes such as style, class, etc.
     *
     * @default null
     */
    htmlAttributes?: { [key: string]: string };

}