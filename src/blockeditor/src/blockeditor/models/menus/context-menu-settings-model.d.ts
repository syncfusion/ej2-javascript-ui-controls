import { Collection, ChildProperty, Property, Event, EmitType } from '@syncfusion/ej2-base';import { ContextMenuItem } from './context-menu-item';import { ContextMenuItemModel } from './index';import { ContextMenuBeforeCloseEventArgs, ContextMenuBeforeOpenEventArgs, ContextMenuCloseEventArgs, ContextMenuItemClickEventArgs, ContextMenuOpenEventArgs } from '../../base';

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
     * Triggers before the context menu opens.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<ContextMenuBeforeOpenEventArgs>;

    /**
     * Triggers when the context menu is opened.
     *
     * @event open
     */
    open?: EmitType<ContextMenuOpenEventArgs>;

    /**
     * Triggers before the context menu closes.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<ContextMenuBeforeCloseEventArgs>;

    /**
     * Triggers when the context menu is closed.
     *
     * @event close
     */
    close?: EmitType<ContextMenuCloseEventArgs>;

    /**
     * Triggers when an item in the context menu is being clicked.
     * This event provides details about the clicked menu item.
     *
     * @event itemClicked
     */
    itemClick?: EmitType<ContextMenuItemClickEventArgs>;

}