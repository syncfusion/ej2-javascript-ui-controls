import { BaseEventArgs, ChildProperty, EmitType, Event, Property } from '@syncfusion/ej2-base';import { ToolbarItem, ToolbarType, ToolbarPosition, FontSizeItem, FontFamilyItem } from './toolbar.types';import { ToolbarSubItem } from '../../base/renderer/toolbar-item-config';import { ToolbarItemModel } from '../../base/renderer/toolbar-item-normalizer';import { UpdatedToolbarStatusEventArgs } from '../interface';
import {ToolbarItemClickedEventArgs} from "./toolbar-settings";

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies whether to render the Toolbar in the Editor.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Defines the items displayed in the toolbar.
     *
     * @default ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'Formats', 'Alignment', 'BulletList', 'NumberedList', '|', 'Link', 'Image', 'Table', '|', 'Undo', 'Redo']
     */
    items?: ToolbarItem[];

    /**
     * Defines the toolbar overflow and layout behavior.
     *
     * @default 'Auto'
     */
    type?: ToolbarType;

    /**
     * Defines whether the toolbar is rendered above or below the editor.
     *
     * @default 'Top'
     */
    position?: ToolbarPosition;

    /**
     * Whether the toolbar remains visible while its scroll owner is scrolled.
     *
     * @default true
     */
    enableFloating?: boolean;

    /**
     * Non-negative vertical offset, in pixels, applied while floating.
     *
     * @default 0
     */
    floatingOffset?: number;

    /**
     * Event raised when a toolbar item is clicked in the component.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<ToolbarItemClickedEventArgs>;

    /**
     * Raised after the toolbar item status (active states, dropdown values, color picker selections)
     * has been synchronized with the current editor selection. This event fires after formatting states
     * are updated to reflect the user's current cursor position or selection in the editor.
     *
     * @event updatedToolbarStatus
     */
    updatedToolbarStatus?: EmitType<UpdatedToolbarStatusEventArgs>;

}

/**
 * Interface for a class FontSize
 */
export interface FontSizeModel {

    /**
     * Specifies the width of the dropdown content area.
     *
     * @default '60px'
     */
    width?: string;

    /**
     * Specifies the default font size items for the dropdown.
     * Each item includes id, text, command, and typed value payload.
     *
     * @default DEFAULT_FONT_SIZE_ITEMS
     */
    items?: FontSizeItem[];

}

/**
 * Interface for a class FontFamily
 */
export interface FontFamilyModel {

    /**
     * Specifies the width of the dropdown content area.
     *
     * @default '72px'
     */
    width?: string;

    /**
     * Specifies the default font family items for the dropdown.
     * Each item includes id, text, command, and typed value payload.
     *
     * @default DEFAULT_FONT_FAMILY_ITEMS
     */
    items?: FontFamilyItem[];

}

/**
 * Interface for a class Format
 */
export interface FormatModel {

    /**
     * Specifies the width of the Format dropdown.
     *
     * @default '75px'
     */
    width?: string;

    /**
     * Specifies the items displayed in the Format dropdown.
     *
     * @default DEFAULT_FORMAT_ITEMS
     */
    items?: ToolbarSubItem[];

}