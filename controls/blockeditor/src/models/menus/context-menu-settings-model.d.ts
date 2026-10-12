import { Collection, ChildProperty, Property, Event, EmitType } from '@syncfusion/ej2-base';import { ContextMenuItem } from './context-menu-item';import { ContextMenuItemModel } from './index';import { ContextMenuBeforeCloseEventArgs, ContextMenuBeforeOpenEventArgs, ContextMenuItemSelectEventArgs } from '../eventargs';import { TableCommandName, LinkCommandName } from '../types';

/**
 * Interface for a class ContextMenuSettings
 */
export interface ContextMenuSettingsModel {

    /**
     * Specifies whether the context menu is enabled.
     * If set to `false`, the context menu will not be displayed.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether menu items should only be shown when clicked.
     * If set to `true`, submenu items appear only when the parent item is clicked.
     *
     * @default false
     */
    showItemOnClick?: boolean;

    /**
     * Specifies the list of context menu items.
     *
     * @default []
     */
    items?: ContextMenuItemModel[];

    /**
     * Specifies a custom template for menu items.
     * Accepts either a string template or a function returning a custom template.
     *
     * @default null
     */
    itemTemplate?: string | Function;

    /**
     * Specifies an array of command item models representing the available commands in the table context menu.
     * This property holds the list of commands that appear in the table context menu.
     * Users can customize or disable table operations by providing custom table items.
     *
     * @default []
     */
    table?: string[] | TableCommandName[] | ContextMenuItemModel[];

    /**
     * Specifies an array of command item models representing the available commands in the link context menu.
     * This property holds the list of commands that appear in the link context menu.
     * Users can customize or disable link operations by providing custom link items.
     *
     * @default []
     */
    link?: string[] | LinkCommandName[] | ContextMenuItemModel[];

    /**
     * Triggers before the context menu opens.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<ContextMenuBeforeOpenEventArgs>;

    /**
     * Triggers before the context menu closes.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<ContextMenuBeforeCloseEventArgs>;

    /**
     * Triggers when an item in the context menu is being clicked.
     * This event provides details about the clicked menu item.
     *
     * @event itemSelect
     */
    itemSelect?: EmitType<ContextMenuItemSelectEventArgs>;

}