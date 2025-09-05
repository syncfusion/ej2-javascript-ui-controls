import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { BlockType } from '../../base/enums';

/**
 * Represents a command item model used in the command menu of the block editor component.
 *
 * Each command item defines an action that can be performed in the editor, such as inserting a block type.
 *
 */
export class CommandItem  extends ChildProperty<CommandItem> {

    /**
     * Specifies the type of the command item.
     *
     * @default 'Template'
     */
    @Property('Template')
    public type: string | BlockType;

    /**
     * Specifies the unique identifier of the command item.
     * This ID can be used for referencing specific commands programmatically.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies whether the command item is disabled.
     * When set to true, the command item will be unavailable for selection and execution.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * This allows for styling and representation of icons that are visually linked with the item.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the display label for the command item.
     * This text is shown in the command menu for the user to identify the command.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Specifies the header text for the command item.
     * This provides a descriptive title or label for the item group.
     *
     * @default ''
     */
    @Property('')
    public groupHeader: string;

    /**
     * Specifies the title of the item.
     * This serves as the primary label or heading, providing a brief description of the item's purpose.
     *
     * @default ''
     */
    @Property('')
    public tooltip: string;

    /**
     * Specifies the keyboard shortcut for the command item.
     * This allows users to trigger the command using a specific key combination.
     *
     * @default ''
     */
    @Property('')
    public shortcut: string;

}
