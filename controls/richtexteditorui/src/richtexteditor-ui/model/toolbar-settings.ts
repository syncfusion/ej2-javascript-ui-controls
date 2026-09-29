import { BaseEventArgs, ChildProperty, EmitType, Event, Property } from '@syncfusion/ej2-base';
import { ToolbarItem, ToolbarType, ToolbarPosition, DEFAULT_TOOLBAR_ITEMS, FontSizeItem, FontFamilyItem } from './toolbar.types';
import { ToolbarSubItem } from '../../base/renderer/toolbar-item-config';
import { ToolbarItemModel } from '../../base/renderer/toolbar-item-normalizer';

/**
 * Default font size items for the dropdown.
 */
const DEFAULT_FONT_SIZE_ITEMS: FontSizeItem[] = [
    { text: 'Default', value: { size: 'Default' } },
    { text: '8', value: { size: '8px' } },
    { text: '10', value: { size: '10px' } },
    { text: '12', value: { size: '12px' } },
    { text: '14', value: { size: '14px' } },
    { text: '16', value: { size: '16px' } },
    { text: '18', value: { size: '18px' } },
    { text: '24', value: { size: '24px' } }
];

/**
 * Default font family items for the dropdown.
 */
const DEFAULT_FONT_FAMILY_ITEMS: FontFamilyItem[] = [
    { text: 'Default', value: { family: 'Default' } },
    { text: 'Arial', value: { family: 'Arial' } },
    { text: 'Helvetica', value: { family: 'Helvetica' } },
    { text: 'Times New Roman', value: { family: 'Times New Roman' } },
    { text: 'Courier New', value: { family: 'Courier New' } }
];

/**
 * Default format items for the dropdown.
 */
const DEFAULT_FORMAT_ITEMS: ToolbarSubItem[] = [
    { id: 'Paragraph', text: 'Paragraph', command: 'paragraph' },
    { id: 'Heading 1', text: 'Heading 1', command: 'heading1' },
    { id: 'Heading 2', text: 'Heading 2', command: 'heading2' },
    { id: 'Heading 3', text: 'Heading 3', command: 'heading3' },
    { id: 'Heading 4', text: 'Heading 4', command: 'heading4' }
];

export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Specifies whether to render the Toolbar in the Editor.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Defines the items displayed in the toolbar.
     *
     * @default DEFAULT_TOOLBAR_ITEMS (cloned per instance)
     */
    @Property()
    public items: ToolbarItem[];

    /**
     * Defines the toolbar overflow and layout behavior.
     *
     * @default 'Expanded'
     */
    @Property('Expanded')
    public type: ToolbarType;

    /**
     * Defines whether the toolbar is rendered above or below the editor.
     *
     * @default 'Top'
     */
    @Property('Top')
    public position: ToolbarPosition;

    /**
     * Whether the toolbar remains visible while its scroll owner is scrolled.
     *
     * @default true
     */
    @Property(true)
    public enableFloating: boolean;

    /**
     * Non-negative vertical offset, in pixels, applied while floating.
     *
     * @default 0
     */
    @Property(0)
    public floatingOffset: number;

    /**
     * Event raised when a toolbar item is clicked in the component.
     *
     * @event itemClicked
     */
    @Event()
    public itemClicked: EmitType<ToolbarItemClickedEventArgs>;

}

/**
 * Represents the event arguments for a toolbar item click event in the component.
 */
export interface ToolbarItemClickedEventArgs extends BaseEventArgs {
    /**
     * Specifies the toolbar item that was clicked.
     * Represents the model of the toolbar item that triggered the click event.
     *
     * @type {ToolbarItemModel}
     * @default null
     *
     */
    item?: ToolbarItemModel
    /**
     * Specifies the event object associated with the toolbar item click.
     * Represents the underlying event that triggered the click action, providing details about the event.
     *
     * @type {Event}
     * @default null
     *
     */
    event?: Event
    /**
     * Specifies whether the click event should be cancelled.
     * Determines if the default action associated with the click event should be prevented.
     *
     * @type {boolean}
     * @default false
     *
     */
    cancel?: boolean

    /**
     * Specifies the index of the message data associated with the toolbar item click event.
     * This property is not applicable for header toolbar item click.
     *
     * @type {number}
     * @default -1
     */
    dataIndex?: number
}

/**
 * Font size settings for the editor.
 * Configures the font size dropdown control within the toolbar.
 */
export class FontSize extends ChildProperty<FontSize> {
    /**
     * Specifies the width of the dropdown content area.
     *
     * @default '60px'
     */
    @Property('60px')
    public width: string;

    /**
     * Specifies the default font size items for the dropdown.
     * Each item includes id, text, command, and typed value payload.
     *
     * @default DEFAULT_FONT_SIZE_ITEMS
     */
    @Property(DEFAULT_FONT_SIZE_ITEMS)
    public items: FontSizeItem[];

}

/**
 * Font family settings for the editor.
 * Configures the font family dropdown control within the toolbar.
 */
export class FontFamily extends ChildProperty<FontFamily> {
    /**
     * Specifies the width of the dropdown content area.
     *
     * @default '72px'
     */
    @Property('72px')
    public width: string;

    /**
     * Specifies the default font family items for the dropdown.
     * Each item includes id, text, command, and typed value payload.
     *
     * @default DEFAULT_FONT_FAMILY_ITEMS
     */
    @Property(DEFAULT_FONT_FAMILY_ITEMS)
    public items: FontFamilyItem[];

}

/**
 * Configuration for the Format toolbar item.
 */
export class Format extends ChildProperty<Format> {
    /**
     * Specifies the width of the Format dropdown.
     *
     * @default '75px'
     */
    @Property('75px')
    public width: string;

    /**
     * Specifies the items displayed in the Format dropdown.
     *
     * @default DEFAULT_FORMAT_ITEMS
     */
    @Property(DEFAULT_FORMAT_ITEMS)
    public items: ToolbarSubItem[];

}
