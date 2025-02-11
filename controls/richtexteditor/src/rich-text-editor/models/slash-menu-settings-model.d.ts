import { ChildProperty, Property } from '@syncfusion/ej2-base';import { DialogType, SlashMenuItems } from '../base/enum';import { CommandName, ISlashMenuItem } from '../base';

/**
 * Interface for a class SlashMenuSettings
 */
export interface SlashMenuSettingsModel {

    /**
     * Specifies whether to enable or disable the slash menu in the editor.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Defines the items to be displayed in the slash menu.
     *
     * @default ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList', 'CodeBlock', 'Blockquote']
     */
    items?: (SlashMenuItems | ISlashMenuItem)[];

    /**
     * Specifies the width of the slash menu popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '300px'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies the height of the slash menu popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '320px'
     * @aspType string
     */
    popupHeight?: string | number;

}