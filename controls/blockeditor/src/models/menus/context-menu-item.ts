import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { ContextMenuItemModel } from './context-menu-item-model';

/**
 * Represents a context menu item model in the block editor component.
 */
export class ContextMenuItem extends ChildProperty<ContextMenuItem> {
    /**
     * Specifies the unique identifier of the context menu item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the display text of the context menu item.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the CSS class for the menu item icon.
     * This allows for styling customization.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies whether this item is a separator.
     * If set to `true`, this item is displayed as a separator between menu items.
     *
     * @default false
     */
    @Property(false)
    public separator: boolean;

    /**
     * Specifies the keyboard shortcut for the menu item.
     * This allows users to trigger the menu item using a specific key combination.
     *
     * @default ''
     */
    @Property('')
    public shortcut: string;

    /**
     * Specifies sub-items within the context menu item.
     * This enables hierarchical menu structures.
     *
     * @default null
     */
    @Collection<ContextMenuItemModel>([], ContextMenuItem)
    public items: ContextMenuItemModel[];
}
