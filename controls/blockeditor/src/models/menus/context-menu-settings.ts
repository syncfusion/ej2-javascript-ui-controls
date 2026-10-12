import { Collection, ChildProperty, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuItemModel } from './index';
import { ContextMenuBeforeCloseEventArgs, ContextMenuBeforeOpenEventArgs, ContextMenuItemSelectEventArgs } from '../eventargs';
import { TableCommandName, LinkCommandName } from '../types';

/**
 * Represents ContextMenuSettings in the block editor component.
 */
export class ContextMenuSettings extends ChildProperty<ContextMenuSettings>{
    /**
     * Specifies whether the context menu is enabled.
     * If set to `false`, the context menu will not be displayed.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies whether menu items should only be shown when clicked.
     * If set to `true`, submenu items appear only when the parent item is clicked.
     *
     * @default false
     */
    @Property(false)
    public showItemOnClick: boolean;

    /**
     * Specifies the list of context menu items.
     *
     * @default []
     */
    @Collection<ContextMenuItemModel>([], ContextMenuItem)
    public items: ContextMenuItemModel[];

    /**
     * Specifies a custom template for menu items.
     * Accepts either a string template or a function returning a custom template.
     *
     * @default null
     */
    @Property(null)
    public itemTemplate: string | Function;

    /**
     * Specifies an array of command item models representing the available commands in the table context menu.
     * This property holds the list of commands that appear in the table context menu.
     * Users can customize or disable table operations by providing custom table items.
     *
     * @default []
     */
    @Property([])
    public table: string[] | TableCommandName[] | ContextMenuItemModel[];

    /**
     * Specifies an array of command item models representing the available commands in the link context menu.
     * This property holds the list of commands that appear in the link context menu.
     * Users can customize or disable link operations by providing custom link items.
     *
     * @default []
     */
    @Property([])
    public link: string[] | LinkCommandName[] | ContextMenuItemModel[];

    /**
     * Triggers before the context menu opens.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<ContextMenuBeforeOpenEventArgs>;

    /**
     * Triggers before the context menu closes.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<ContextMenuBeforeCloseEventArgs>;

    /**
     * Triggers when an item in the context menu is being clicked.
     * This event provides details about the clicked menu item.
     *
     * @event itemSelect
     */
    @Event()
    public itemSelect: EmitType<ContextMenuItemSelectEventArgs>;
}
