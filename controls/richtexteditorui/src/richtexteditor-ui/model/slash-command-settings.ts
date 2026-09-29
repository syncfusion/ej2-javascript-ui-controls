import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { ISlashCommandItem } from '../../common/interface';
import { SlashCommandItems } from '../../common/types';

/**
 * Configures the slash command settings of the RichTextEditor.
 */
export class SlashCommandSettings extends ChildProperty<SlashCommandSettings> {
    /**
     * Specifies whether to enable or disable the slash command in the editor.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines the items to be displayed in the slash command popup.
     *
     * @default ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'NumberedList', 'BulletList', 'Blockquote', 'Table', 'Link', 'Image']
     */
    @Property(['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'NumberedList', 'BulletList', 'Blockquote', 'Table', 'Link', 'Image' ])
    public items: (SlashCommandItems | ISlashCommandItem)[];

    /**
     * Specifies the width of the slash command popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '300px'
     * @aspType string
     */
    @Property('300px')
    public popupWidth: string | number;

    /**
     * Specifies the height of the slash command popup. Can be defined in pixels, numbers, or percentages.
     * A numeric value is treated as pixels.
     *
     * @default '320px'
     * @aspType string
     */
    @Property('320px')
    public popupHeight: string | number;
}

/**
 * Defines the type of the slash command item.
 */
export type SlashCommandType = 'Inline' | 'Basic Block' | 'Media';

/**
 * Represents a predefined slash command item model.
 */
export interface ISlashCommandModel {
    text?: string;
    command: SlashCommandItems;
    subCommand: string;
    type: SlashCommandType;
    iconCss: string;
    description?: string;
}

/**
 * Represents an injectable slash command item model tied to a module.
 */
export interface IInjectableSlashCommandModel extends ISlashCommandModel {
    module: string;
}

/**
 * The default predefined slash command data model.
 *
 * The `subCommand` for each item mirrors the canonical
 * {@link EditorCommandName} (see `src/controller/interface.ts`) consumed by
 * the headless editor's block / list plugins
 * (see `src/core/plugins/block-formats.ts` and `list-formats.ts`). Mapping
 * the slash command directly to the editor command name lets
 * `SlashCommand.handleSelect` dispatch the action through the editor's
 * `executeCommand` gateway so it actually mutates the document.
 *
 * The `iconCss` values reference glyphs defined in
 * `@syncfusion/ej2-base/styles/<theme>.css` (e.g. `e-icons e-paragraph`,
 * `e-icons e-heading-1`). The `e-icons` base class is required for the
 * icon font to render; omitting it produces an empty icon box.
 */
export const defaultSlashCommandDataModel: ISlashCommandModel[] = [
    { command: 'Paragraph', subCommand: 'paragraph', type: 'Basic Block', iconCss: 'e-icons e-paragraph' },
    { command: 'Heading 1', subCommand: 'heading1', type: 'Basic Block', iconCss: 'e-icons e-heading-1' },
    { command: 'Heading 2', subCommand: 'heading2', type: 'Basic Block', iconCss: 'e-icons e-heading-2' },
    { command: 'Heading 3', subCommand: 'heading3', type: 'Basic Block', iconCss: 'e-icons e-heading-3' },
    { command: 'Heading 4', subCommand: 'heading4', type: 'Basic Block', iconCss: 'e-icons e-heading-4' },
    { command: 'NumberedList', subCommand: 'numberedList', type: 'Basic Block', iconCss: 'e-icons e-list-ordered' },
    { command: 'BulletList', subCommand: 'bulletList', type: 'Basic Block', iconCss: 'e-icons e-list-unordered' },
    { command: 'Blockquote', subCommand: 'blockQuote', type: 'Basic Block', iconCss: 'e-icons e-blockquote' }
];

/**
 * The injectible slash command data model for media and insertion modules.
 */
export const injectableSlashCommandDataModel: IInjectableSlashCommandModel[] = [
    { command: 'Link', subCommand: 'InsertLink', type: 'Inline', module: 'Link', iconCss: 'e-icons e-link' },
    { command: 'Image', subCommand: 'InsertImage', type: 'Media', module: 'Image', iconCss: 'e-icons e-image' },
    { command: 'Table', subCommand: 'InsertTable', type: 'Basic Block', module: 'Table', iconCss: 'e-icons e-table' }
];
