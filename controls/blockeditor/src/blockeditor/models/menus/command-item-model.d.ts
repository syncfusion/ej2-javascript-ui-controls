import { ChildProperty, Property } from '@syncfusion/ej2-base';import { BlockType } from '../../base/enums';

/**
 * Interface for a class CommandItem
 */
export interface CommandItemModel {

    /**
     * Specifies the type of the command item.
     *
     * @default 'Template'
     */
    type?: BlockType;

    /**
     * Specifies the unique identifier of the command item.
     * This ID can be used for referencing specific commands programmatically.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies whether the command item is disabled.
     * When set to true, the command item will be unavailable for selection and execution.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * This allows for styling and representation of icons that are visually linked with the item.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the display label for the command item.
     * This text is shown in the command menu for the user to identify the command.
     *
     * @default ''
     */
    label?: string;

    /**
     * Specifies the header text for the command item.
     * This provides a descriptive title or label for the item group.
     *
     * @default ''
     */
    groupHeader?: string;

    /**
     * Specifies the title of the item.
     * This serves as the primary label or heading, providing a brief description of the item's purpose.
     *
     * @default ''
     */
    tooltip?: string;

    /**
     * Specifies the keyboard shortcut for the command item.
     * This allows users to trigger the command using a specific key combination.
     *
     * @default ''
     */
    shortcut?: string;

}