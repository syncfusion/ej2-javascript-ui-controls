import { Collection, ChildProperty, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuItemModel } from './index';
import { ContextMenuClosingEventArgs, ContextMenuOpeningEventArgs, ContextMenuItemSelectEventArgs } from '../eventargs';

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
     * Triggers before the context menu opens.
     *
     * @event Opening
     */
    @Event()
    public opening: EmitType<ContextMenuOpeningEventArgs>;

    /**
     * Triggers before the context menu closes.
     *
     * @event closing
     */
    @Event()
    public closing: EmitType<ContextMenuClosingEventArgs>;

    /**
     * Triggers when an item in the context menu is being clicked.
     * This event provides details about the clicked menu item.
     *
     * @event itemSelect
     */
    @Event()
    public itemSelect: EmitType<ContextMenuItemSelectEventArgs>;
}
