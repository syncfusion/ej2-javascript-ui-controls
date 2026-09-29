/**
 * Toolbar module type definitions.
 * Extracted from specification section 3.3-3.6.
 */

import { ItemModel } from '@syncfusion/ej2-navigations';

/**
 * Defines the toolbar overflow and layout behavior.
 *
 * @remarks
 * - `Expanded`: Displays items, overflow through expand control
 * - `MultiRow`: Wraps items into multiple rows
 * - `Popup`: Overflow items into popup
 * - `Scrollable`: Horizontally scrollable container
 */
export type ToolbarType = 'Expanded' | 'MultiRow' | 'Scrollable';

/**
 * Defines the toolbar vertical position relative to editor.
 *
 * @remarks
 * - `Top`: Above editor host
 * - `Bottom`: Below editor host
 */
export type ToolbarPosition = 'Top' | 'Bottom';

/**
 * Built-in toolbar item names for common editor commands.
 *
 * @remarks
 * The union must be extended as additional editor features are implemented.
 * Arbitrary string values must not be accepted for built-in items.
 * A typed union provides compile-time validation and API discoverability.
 */
export type BuiltInToolbarItem =
    | 'Undo'
    | 'Redo'
    | 'Bold'
    | 'Italic'
    | 'Underline'
    | 'Strikethrough'
    | 'Subscript'
    | 'Superscript'
    | 'UpperCase'
    | 'LowerCase'
    | 'HorizontalLine'
    | 'InlineCode'
    | 'Formats'
    | 'FontSize'
    | 'FontColor'
    | 'BackgroundColor'
    | 'FontName'
    | 'BulletList'
    | 'NumberedList'
    | 'NumberFormatList'
    | 'BulletFormatList'
    | 'Alignment'
    | 'Quote'
    | 'CodeBlock'
    | 'Link'
    | 'Image'
    | 'Table'
    | 'ClearFormat'
    | 'Heading 1'
    | 'Heading 2'
    | 'Heading 3'
    | 'Heading 4'
    | 'Paragraph'
    | 'Indent'
    | 'Outdent'
    | 'AlignLeft'
    | 'AlignCenter'
    | 'AlignRight'
    | 'AlignJustify';

/**
 * Built-in items exposed by the Link Quick Toolbar.
 *
 * @remarks
 * - `OpenLink`: Opens the link in a new tab using the configured `target`.
 * - `CopyLink`: Copies the link `href` to the clipboard.
 * - `EditLink`: Opens the Insert-Link dialog pre-filled with the current link.
 * - `RemoveLink`: Removes the link while keeping the link text.
 * - `'|'`: Visual separator used to split action groups inside the popup.
 */
export type LinkQuickToolbarItem =
    | 'OpenLink'
    | 'CopyLink'
    | 'EditLink'
    | 'RemoveLink'
    | '|';

// Built-in Table Quick Toolbar items and separators (`'|'`).
export type TableQuickToolbarItem =
    | 'Row'
    | 'Column'
    | 'Header'
    | 'CellBackgroundColor'
    | 'VerticalAlign'
    | 'Align'
    | 'Delete'
    | '|';

// Built-in Image Quick Toolbar items and separators (`'|'`).
export type ImageQuickToolbarItem =
    | 'AltText'
    | 'Caption'
    | 'Align'
    | 'Display'
    | 'WrapText'
    | 'Dimension'
    | 'Replace'
    | 'Remove'
    | '|';

/**
 * Configuration for a built-in toolbar item.
 * Helps align built-in items with ItemModel properties.
 */
export interface BuiltInToolbarItemConfig extends ItemModel {
    /**
     * The built-in toolbar item name.
     */
    item: BuiltInToolbarItem;
}

/**
 * Custom toolbar item with user-defined action.
 */
export interface CustomToolbarItem extends ItemModel {
    /**
     * Unique identifier for the custom toolbar item.
     * Used to distinguish items and handle itemClick events.
     */
    actionId: string;

    /**
     * Keyboard shortcut tooltip for Windows.
     */
    windowsShortcutText?: string;

    /**
     * Keyboard shortcut tooltip for macOS.
     */
    macShortcutText?: string;
}

/**
 * Typed interface for font size dropdown items.
 * Represents a single font size option with numeric value and editor command.
 */
export interface FontSizeItem extends ItemModel {
    /** Display text for the item (e.g., '14') */
    text: string;
    /** Unique identifier for the dropdown menu item */
    id?: string;
    /** Editor command to execute (must be 'fontSize') */
    command?: string;
    /** Font size value payload with CSS unit (e.g., { size: '14px' }) */
    value?: { size: string };
}

/**
 * Typed interface for font family dropdown items.
 * Represents a single font family option with family name and editor command.
 */
export interface FontFamilyItem extends ItemModel {
    /** Display text for the item (e.g., 'Arial') */
    text: string;
    /** Unique identifier for the dropdown menu item */
    id?: string;
    /** Editor command to execute (must be 'fontName') */
    command?: string;
    /** Font family value payload with font name (e.g., { family: 'Arial' }) */
    value?: { family: string };
}

/**
 * Union type for toolbar items.
 * Accepts built-in items by name, custom configurations, custom items, or separators.
 *
 * @remarks
 * - Built-in items: `'Bold'`, `'Italic'`, etc.
 * - Built-in with config: `{ item: 'Bold', text: 'Make Bold' }`
 * - Custom items: `{ actionId: 'save', id: 'save', text: 'Save' }`
 * - Visual separators: `'|'`
 */
export type ToolbarItem = BuiltInToolbarItem | BuiltInToolbarItemConfig | CustomToolbarItem | '|' | LinkQuickToolbarItem | TableQuickToolbarItem | ImageQuickToolbarItem;

/**
 * Default toolbar items array as defined by product requirements.
 *
 * @remarks
 * - Exported as readonly to prevent mutations
 * - Must be cloned per editor instance
 * - Contains 15 items + 3 separators for formatting, alignment, and undo/redo groups
 */
export const DEFAULT_TOOLBAR_ITEMS: readonly ToolbarItem[] = [
    'Bold',
    'Italic',
    'Underline',
    'Strikethrough',
    '|',
    'Formats',
    'Alignment',
    'BulletList',
    'NumberedList',
    '|',
    'Link',
    'Image',
    'Table',
    '|',
    'Undo',
    'Redo'
];

/**
 * Adds a toolbar item at a specified index.
 */
export interface AddToolbarItem {
    /** Discriminant: add operation */
    action: 'add';
    /** Index at which to insert the item */
    index: number;
    /** The item to add */
    item: ToolbarItem;
}

/**
 * Removes a toolbar item by ID.
 */
export interface RemoveToolbarItem {
    /** Discriminant: remove operation */
    action: 'remove';
    /** Index of the item to remove */
    index: number;
    /** Stable ID of the item to remove */
    itemId: string;
}

/**
 * Shows a toolbar item by ID.
 */
export interface ShowToolbarItem {
    /** Discriminant: show operation */
    action: 'show';
    /** Stable ID of the item to show */
    itemId: string;
}

/**
 * Hides a toolbar item by ID.
 */
export interface HideToolbarItem {
    /** Discriminant: hide operation */
    action: 'hide';
    /** Stable ID of the item to hide */
    itemId: string;
}

/**
 * Enables a toolbar item by ID.
 */
export interface EnableToolbarItem {
    /** Discriminant: enable operation */
    action: 'enable';
    /** Stable ID of the item to enable */
    itemId: string;
}

/**
 * Disables a toolbar item by ID.
 */
export interface DisableToolbarItem {
    /** Discriminant: disable operation */
    action: 'disable';
    /** Stable ID of the item to disable */
    itemId: string;
}

/**
 * Discriminated union for toolbar item update operations.
 * Used during reconciliation of items array changes and direct toolbar updates.
 */
export type ToolbarItemUpdate =
    | AddToolbarItem
    | RemoveToolbarItem
    | ShowToolbarItem
    | HideToolbarItem
    | EnableToolbarItem
    | DisableToolbarItem;
