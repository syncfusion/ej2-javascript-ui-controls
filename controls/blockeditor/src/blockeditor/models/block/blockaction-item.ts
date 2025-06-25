import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Represents BlockActionItem in the block editor component.
 */
export class BlockActionItem extends ChildProperty<BlockActionItem> {

    /**
     * Specifies unique identifier of the action item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the display label of the action item.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Specifies the CSS class for the action icon.
     * This allows styling customization of the menu items.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies whether the action item is disabled.
     * When set to `true`, the action item will be unavailable for selection and execution.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the tooltip for the action item.
     * This is an optional description shown on hover.
     *
     * @default ''
     */
    @Property('')
    public tooltip: string;

    /**
     * Specifies the keyboard shortcut for the action item.
     * This allows users to trigger the action using a specific key combination.
     *
     * @default ''
     */
    @Property('')
    public shortcut: string;
}
