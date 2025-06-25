import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class ContextMenuItem
 */
export interface ContextMenuItemModel {

    /**
     * Specifies the unique identifier of the context menu item.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the display text of the context menu item.
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the CSS class for the menu item icon.
     * This allows for styling customization.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies whether this item is a separator.
     * If set to `true`, this item is displayed as a separator between menu items.
     *
     * @default false
     */
    separator?: boolean;

    /**
     * Specifies the keyboard shortcut for the menu item.
     * This allows users to trigger the menu item using a specific key combination.
     *
     * @default ''
     */
    shortcut?: string;

    /**
     * Specifies sub-items within the context menu item.
     * This enables hierarchical menu structures.
     *
     * @default null
     */
    items?: ContextMenuItemModel[];

}