import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class BlockActionItem
 */
export interface BlockActionItemModel {

    /**
     * Specifies unique identifier of the action item.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the display label of the action item.
     *
     * @default ''
     */
    label?: string;

    /**
     * Specifies the CSS class for the action icon.
     * This allows styling customization of the menu items.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies whether the action item is disabled.
     * When set to `true`, the action item will be unavailable for selection and execution.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the tooltip for the action item.
     * This is an optional description shown on hover.
     *
     * @default ''
     */
    tooltip?: string;

    /**
     * Specifies the keyboard shortcut for the action item.
     * This allows users to trigger the action using a specific key combination.
     *
     * @default ''
     */
    shortcut?: string;

}