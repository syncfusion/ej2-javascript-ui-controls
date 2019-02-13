import { Property, ChildProperty } from '@syncfusion/ej2-base';import { ToolbarType, ActionOnScroll, ToolbarItems } from '../base/enum';import { IToolbarItems, IDropDownItemModel, ColorModeType, IToolsItemConfigs } from '../base/interface';import { TableStyleItems } from '../models/items';

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies whether to render toolbar in RTE.
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether to enable/disable floating toolbar.
     * @default true
     */
    enableFloating?: boolean;

    /**
     * Specifies the Toolbar display types.
     * The possible types are:
     * - Expand: Toolbar items placed within the available space and rest of the items are placed to the extended menu section.
     * - MultiRow: Toolbar which placed at top of RTE editing area.
     * @default Expand
     */
    type?: ToolbarType;

    /**
     * An array of string or object that is used to configure items.
     * @default predefinedItems
     */
    items?: (string | IToolbarItems)[];

    /**
     * Using this property, Modify the default toolbar item configuration like icon class.
     * @default {}
     */
    itemConfigs?: { [key in ToolbarItems]?: IToolsItemConfigs };

}

/**
 * Interface for a class ImageSettings
 */
export interface ImageSettingsModel {

    /**
     * Specifies whether to allowType based file select
     * @default ['.jpeg', '.jpg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether insert image inline or break
     * @default 'inline'
     */
    display?: string;

    /**
     * Specifies whether image width
     * @default 'auto'
     */
    width?: string;

    /**
     * Specifies whether image height
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     * @default 'null'
     */
    saveUrl?: string;

    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     * @default 'null'
     */
    path?: string;

    /**
     * To enable resizing for image element.
     * @default 'true'
     */
    resize?: boolean;

    /**
     * Defines the minimum Width of the image.
     * @default 0
     */
    minWidth?: string | number;

    /**
     * Defines the maximum Width of the image.
     * @default null
     */
    maxWidth?: string | number;

    /**
     * Defines the minimum Height of the image.
     * @default 0
     */
    minHeight?: string | number;

    /**
     * Defines the maximum Height of the image.
     * @default null
     */
    maxHeight?: string | number;

    /**
     * image resizing should be done by percentage calculation.
     * @default false
     */
    resizeByPercent?: boolean;

}

/**
 * Interface for a class TableSettings
 */
export interface TableSettingsModel {

    /**
     * To specify the width of table
     * @default '100%'
     */
    width?: string | number;

    /**
     * Class name should be appended by default in table element.
     * It helps to design the table in specific CSS styles always when inserting in editor.
     * @default TableStyleItems;
     */
    styles?: IDropDownItemModel[];

    /**
     * To enable resizing for table element.
     * @default 'true'
     */
    resize?: boolean;

    /**
     * Defines the minimum Width of the table.
     * @default 0
     */
    minWidth?: string | number;

    /**
     * Defines the maximum Width of the table.
     * @default null
     */
    maxWidth?: string | number;

}

/**
 * Interface for a class QuickToolbarSettings
 */
export interface QuickToolbarSettingsModel {

    /**
     * Specifies whether to enable quick toolbar in RTE.
     * @default true
     */
    enable?: boolean;

    /**
     * specifies the action that should happen when scroll the target-parent container.
     * @default 'hide'
     */
    actionOnScroll?: ActionOnScroll;

    /**
     * Specifies the items to render in quick toolbar, when link selected.
     * @default ['Open', 'Edit', 'UnLink']
     */
    link?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when image selected.
     * @default ['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink','OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension']
     */
    // tslint:disable
    image?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when text selected.
     * @default ['Cut', 'Copy', 'Paste']
     */
    text?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when table selected.
     * @default ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles']
     */
    table?: (string | IToolbarItems)[];

}

/**
 * Interface for a class FontFamily
 */
export interface FontFamilyModel {

    /**
     * Specifies default font family selection
     * @default 'null'
     */
    default?: string;

    /**
     * Specifies content width
     * @default '65px'
     */
    width?: string;

    /**
     * Specifies default font family items
     * @default fontFamily
     */
    items?: IDropDownItemModel[];

}

/**
 * Interface for a class FontSize
 */
export interface FontSizeModel {

    /**
     * Specifies default font size selection
     * @default 'null'
     */
    default?: string;

    /**
     * Specifies content width
     * @default '35px'
     */
    width?: string;

    /**
     * Specifies default font size items
     * @default fontSize
     */
    items?: IDropDownItemModel[];

}

/**
 * Interface for a class Format
 */
export interface FormatModel {

    /**
     * Specifies default format
     * @default 'null'
     */
    default?: string;

    /**
     * Specifies content width
     * @default '65px'
     */
    width?: string;

    /**
     * Specifies default font size items
     * @default formatItems
     */
    types?: IDropDownItemModel[];

}

/**
 * Interface for a class FontColor
 */
export interface FontColorModel {

    /**
     * Specifies default font color
     * @default '#ff0000'
     */
    default?: string;

    /**
     * Specifies mode
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies columns
     * @default 10
     */
    columns?: number;

    /**
     * Specifies color code customization
     * @default fontColor
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Specifies modeSwitcher button
     * @default false
     */
    modeSwitcher?: boolean;

}

/**
 * Interface for a class BackgroundColor
 */
export interface BackgroundColorModel {

    /**
     * Specifies default font color
     * @default '#ffff00'
     */
    default?: string;

    /**
     * Specifies mode
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies columns
     * @default 10
     */
    columns?: number;

    /**
     * Specifies color code customization
     * @default backgroundColor
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Specifies a modeSwitcher button
     * @default false
     */
    modeSwitcher?: boolean;

}