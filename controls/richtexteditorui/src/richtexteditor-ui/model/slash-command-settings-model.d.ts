import { ChildProperty, Property, Event, EmitType } from '@syncfusion/ej2-base';import { ISlashCommandItem, SlashCommandItemSelectArgs } from '../../common/interface';import { SlashCommandItems } from '../../common/types';

/**
 * Interface for a class SlashCommandSettings
 */
export interface SlashCommandSettingsModel {

    /**
     * Specifies whether to enable or disable the slash command in the editor.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Defines the items to be displayed in the slash command popup.
     *
     * @default ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'NumberedList', 'BulletList', 'Checklist', 'Blockquote', 'Table', 'Link', 'Image', 'Collapsible Paragraph', 'Collapsible Heading 1', 'Collapsible Heading 2', 'Collapsible Heading 3', 'Collapsible Heading 4', 'Info', 'Warning', 'Error', 'Success', 'Note' ]
     */
    items?: (SlashCommandItems | ISlashCommandItem)[];

    /**
     * Specifies the width of the slash command popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '300px'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies the height of the slash command popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '320px'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Raised when a slash command item is selected from the slash command popup.
     *
     * Set `args.cancel` to `true` inside the handler to prevent the default
     * command execution. The event args are of type
     * {@link SlashCommandItemSelectArgs}.
     *
     * @event itemSelect
     */
    itemSelect?: EmitType<SlashCommandItemSelectArgs>;

}