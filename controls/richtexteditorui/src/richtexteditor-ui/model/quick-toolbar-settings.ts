import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { LinkQuickToolbarItem, TableQuickToolbarItem, ImageQuickToolbarItem, ToolbarItem } from './toolbar.types';

export const DEFAULT_IMAGE_QUICK_TOOLBAR_ITEMS: ImageQuickToolbarItem[] = [
    'AltText',
    'Caption',
    'Align',
    'Display',
    'WrapText',
    'Dimension',
    'Replace',
    'Remove'
];

export const DEFAULT_TABLE_QUICK_TOOLBAR_ITEMS: TableQuickToolbarItem[] = [
    'Row',
    'Column',
    'Header',
    'CellBackgroundColor',
    'VerticalAlign',
    'Align',
    'Delete'
];

/**
 * Configures the quick toolbar settings of the RichTextEditor.
 */
export class QuickToolbarSettings extends ChildProperty<QuickToolbarSettings> {
    /**
     * Specifies whether the quick toolbar is enabled in the RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies the toolbar items shown when text is selected.
     * If no items are configured, the text quick toolbar is not rendered.
     *
     * @default []
     */
    @Property(null)
    public text: ToolbarItem[];

    /**
     * Specifies the toolbar items shown when an image is selected.
     *
     * @default ['AltText', 'Caption', 'Align',
     * 'Display', 'WrapText',
     * 'Dimension', 'Replace', 'Remove']
     */
    @Property(DEFAULT_IMAGE_QUICK_TOOLBAR_ITEMS)
    public image: ImageQuickToolbarItem[];

    /**
     * Specifies the toolbar items shown when the cursor is inside a link.
     * If no items are configured, the link quick toolbar is not initialized.
     *
     * Default order: Open, Copy, Edit, Remove
     *
     * @default ['Open', 'Copy', 'Edit', 'Remove']
     */
    @Property(null)
    public link: LinkQuickToolbarItem[];

    /**
     * Items displayed in the Table Quick Toolbar.
     *
     * @default ['Row', 'Column', 'Header',
     * 'CellBackgroundColor', 'VerticalAlign',
     * 'Align', 'Delete']
     */
    @Property(DEFAULT_TABLE_QUICK_TOOLBAR_ITEMS)
    public table: TableQuickToolbarItem[];

    /**
     * Specifies whether to append the quick toolbar popup to the document body instead of the editor container.
     * Enable this to avoid clipping in containers with constrained width or overflow.
     * Disable it to keep the popup positioned within the editor container.
     *
     * @default false
     */
    @Property(false)
    public appendToBody: boolean;
}
