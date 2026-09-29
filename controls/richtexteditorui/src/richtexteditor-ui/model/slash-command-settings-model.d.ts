import { ChildProperty, Property } from '@syncfusion/ej2-base';import { ISlashCommandItem } from '../../common/interface';import { SlashCommandItems } from '../../common/types';

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
     * @default ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'NumberedList', 'BulletList', 'Blockquote', 'Table', 'Link', 'Image']
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

}