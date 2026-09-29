import { ChildProperty, Property } from '@syncfusion/ej2-base';import { LinkQuickToolbarItem, TableQuickToolbarItem, ImageQuickToolbarItem, ToolbarItem } from './toolbar.types';

/**
 * Interface for a class QuickToolbarSettings
 */
export interface QuickToolbarSettingsModel {

    /**
     * Specifies whether the quick toolbar is enabled in the RichTextEditor.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies the toolbar items shown when text is selected.
     * If no items are configured, the text quick toolbar is not rendered.
     *
     * @default []
     */
    text?: ToolbarItem[];

    /**
     * Specifies the toolbar items shown when an image is selected.
     *
     * @default ['AltText', 'Caption', 'Align',
     * 'Display', 'WrapText',
     * 'Dimension', 'Replace', 'Remove']
     */
    image?: ImageQuickToolbarItem[];

    /**
     * Specifies the toolbar items shown when the cursor is inside a link.
     * If no items are configured, the link quick toolbar is not initialized.
     *
     * Default order: Open, Copy, Edit, Remove
     *
     * @default ['Open', 'Copy', 'Edit', 'Remove']
     */
    link?: LinkQuickToolbarItem[];

    /**
     * Items displayed in the Table Quick Toolbar.
     *
     * @default ['Row', 'Column', 'Header',
     * 'CellBackgroundColor', 'VerticalAlign',
     * 'Align', 'Delete']
     */
    table?: TableQuickToolbarItem[];

    /**
     * Specifies whether to append the quick toolbar popup to the document body instead of the editor container.
     * Enable this to avoid clipping in containers with constrained width or overflow.
     * Disable it to keep the popup positioned within the editor container.
     *
     * @default false
     */
    appendToBody?: boolean;

}