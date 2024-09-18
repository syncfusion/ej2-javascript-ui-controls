import { ChildProperty, Property } from '@syncfusion/ej2-base';import { DialogType, SlashMenuItems } from '../base/enum';import { CommandName, ISlashMenuItem } from '../base';

/**
 * Interface for a class SlashMenuSettings
 */
export interface SlashMenuSettingsModel {

    /**
     * Specifies to enable or disable the slash menu in the Editor.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specfies the items to be rendered in the slash menu.
     *
     * @default ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList', 'CodeBlock', 'Blockquote']
     */
    items?: (SlashMenuItems | ISlashMenuItem)[];

    /**
     * Specifies the width of the slash menu popup in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '300px'
     * @aspType string
     *
     */
    popupWidth?: string | number;

    /**
     * Specifies the height of the slash menu popup in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '320px'
     * @aspType string
     *
     */
    popupHeight?: string | number;

}