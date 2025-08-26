import { ChildProperty, Property } from '../../../base'; /*externalscript*/
import { DialogType } from '../common/enum';
import { ISlashMenuItem } from '../common/interface';
import { CommandName } from '../common/enum';
import { SlashMenuItems } from '../common/types';

/**
 * Configures the slash menu settings of the RichTextEditor.
 */
export class SlashMenuSettings extends ChildProperty<SlashMenuSettings> {
    /**
     * Specifies whether to enable or disable the slash menu in the editor.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines the items to be displayed in the slash menu.
     *
     * @default ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList', 'CodeBlock', 'Blockquote']
     */
    @Property(['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList', 'CodeBlock', 'Blockquote'])
    public items: (SlashMenuItems | ISlashMenuItem)[];

    /**
     * Specifies the width of the slash menu popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '300px'
     * @aspType string
     */
    @Property('300px')
    public popupWidth: string | number;

    /**
     * Specifies the height of the slash menu popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '320px'
     * @aspType string
     */
    @Property('320px')
    public popupHeight: string | number;
}

export interface ISlashMenuModel {
    text?: string;
    command: SlashMenuItems;
    subCommand: CommandName | DialogType | string;
    type: SlashCommandType;
    iconCss: string
    description?: string;
}

export interface ModuleSlashMenuModel extends ISlashMenuModel {
    module: string;
}

export type SlashCommandType = 'Inline' | 'Basic Block' | 'Media';

export const defaultSlashMenuDataModel: ISlashMenuModel[] = [
    {
        command: 'Paragraph',
        subCommand: 'p',
        type: 'Basic Block',
        iconCss: 'e-rte-paragraph'
    },
    {
        command: 'Heading 1',
        subCommand: 'h1',
        type: 'Basic Block',
        iconCss: 'e-rte-h1'
    },
    {
        command: 'Heading 2',
        subCommand: 'h2',
        type: 'Basic Block',
        iconCss: 'e-rte-h2'
    },
    {
        command: 'Heading 3',
        subCommand: 'h3',
        type: 'Basic Block',
        iconCss: 'e-rte-h3'
    },
    {
        command: 'Heading 4',
        subCommand: 'h4',
        type: 'Basic Block',
        iconCss: 'e-rte-h4'
    },
    {
        command: 'OrderedList',
        subCommand: 'insertOrderedList',
        type: 'Basic Block',
        iconCss: 'e-list-ordered e-icons'
    },
    {
        command: 'UnorderedList',
        subCommand: 'insertUnorderedList',
        type: 'Basic Block',
        iconCss: 'e-list-unordered e-icons'
    },
    {
        command: 'Blockquote',
        subCommand: 'blockquote',
        type: 'Basic Block',
        iconCss: 'e-blockquote e-icons'
    },
    {
        command: 'CodeBlock',
        subCommand: 'pre',
        type: 'Basic Block',
        iconCss: 'e-code-view e-icons'
    }
];

export const injectibleSlashMenuDataModel: ModuleSlashMenuModel[] = [
    {
        command: 'Image',
        subCommand: DialogType.InsertImage,
        type: 'Media',
        module: 'Image',
        iconCss: 'e-icons e-image'
    },
    {
        command: 'Audio',
        subCommand: DialogType.InsertAudio,
        type: 'Media',
        module: 'Audio',
        iconCss: 'e-icons e-audio'
    },
    {
        command: 'Video',
        subCommand: DialogType.InsertVideo,
        type: 'Media',
        module: 'Video',
        iconCss: 'e-icons e-video'
    },
    {
        command: 'Link',
        subCommand: DialogType.InsertLink,
        type: 'Inline',
        module: 'Link',
        iconCss: 'e-icons e-link'
    },
    {
        command: 'Table',
        subCommand: DialogType.InsertTable,
        type: 'Basic Block',
        module: 'Table',
        iconCss: 'e-icons e-table'
    },
    {
        command: 'Emojipicker',
        subCommand: null,
        type: 'Inline',
        module: 'EmojiPicker',
        iconCss: 'e-icons e-emoji'
    }
];
