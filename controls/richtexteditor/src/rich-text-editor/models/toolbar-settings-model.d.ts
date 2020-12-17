import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { AjaxSettings, AjaxSettingsModel, ContextMenuSettings, ContextMenuSettingsModel } from '@syncfusion/ej2-filemanager';import { DetailsViewSettings, DetailsViewSettingsModel, NavigationPaneSettings } from '@syncfusion/ej2-filemanager';import { NavigationPaneSettingsModel, SearchSettings, SearchSettingsModel, SortOrder } from '@syncfusion/ej2-filemanager';import { ToolbarSettingsModel as FileToolbarSettingsModel, ToolbarSettings as FileToolbarSettings } from '@syncfusion/ej2-filemanager';import { UploadSettings, UploadSettingsModel, ViewType } from '@syncfusion/ej2-filemanager';import { SaveFormat } from '../../common';import { TableStyleItems } from '../models/items';import { ToolbarType, ActionOnScroll, ToolbarItems } from '../base/enum';import { IToolbarItems, IDropDownItemModel, ColorModeType, IToolsItemConfigs } from '../base/interface';

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies whether to render toolbar in RichTextEditor.
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
     * - MultiRow: Toolbar which placed at top of Rich Text Editor editing area.
     * - Scrollable: All the toolbar items are displayed in a single line with horizontal scrolling enabled.
     * @default Expand
     */
    type?: ToolbarType;

    /**
     * An array of string or object that is used to configure items.
     * @default ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
     * 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo']
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
     * Specifies whether to allowType based file select.
     * @default ['.jpeg', '.jpg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether insert image inline or break.
     * @default 'inline'
     */
    display?: string;

    /**
     * Specifies whether the inserted image is saved as blob or base64.
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies whether image width.
     * @default 'auto'
     */
    width?: string;

    /**
     * Specifies whether image height.
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
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     * @default 'null'
     */
    removeUrl?: string;

    /**
     * Defines the minimum Width of the image.
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum Width of the image.
     * @default null
     */
    maxWidth?: string | number;

    /**
     * Defines the minimum Height of the image.
     * @default '0'
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
 * Interface for a class FileManagerSettings
 */
export interface FileManagerSettingsModel {

    /**
     * Specifies the AJAX settings of the file manager.
     * @default {
     *  getImageUrl: null;
     *  url: null;
     *  uploadUrl: null;
     *  downloadUrl: null;
     * }
     */
    ajaxSettings?: AjaxSettingsModel;

    /**
     * Enables or disables drag-and-drop of files.
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Specifies the context menu settings of the file manager.
     * @default {
     *  file: ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'],
     *  folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
     *  layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'],
     *  visible: true
     * }
     */
    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager that allows you to customize the appearance by overriding the styles.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the details view settings of the file manager.
     * @default {
     *  columns: [{
     *    field: 'name', headerText: 'Name', minWidth: 120, template: '<span class="e-fe-text">${name}</span>',
     *    customAttributes: { class: 'e-fe-grid-name'}}, { field: '_fm_modified', headerText: 'DateModified', type: 'dateTime',
     *    format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190' }, { field: 'size', headerText: 'Size', minWidth: 90, width: '110',
     *    template: '<span class="e-fe-size">${size}</span>'
     *  }]
     * }
     */
    detailsViewSettings?: DetailsViewSettingsModel;

    /**
     * Specifies whether to enable the file manager in RichTextEditor.
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies the navigation pane settings of the file manager.
     * @default { maxWidth: '650px', minWidth: '240px', visible: true }
     */
    navigationPaneSettings?: NavigationPaneSettingsModel;

    /**
     * Specifies the current path of the file manager.
     * @default '/'
     */
    path?: string;

    /**
     * Specifies the root folder alias name in file manager
     * @default null
     */
    rootAliasName?: string;

    /**
     * Specifies the search settings of the file manager.
     * @default {
     *  allowSearchOnTyping: true,
     *  filterType: 'contains',
     *  ignoreCase: true
     * }
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Shows or hides the file extension in file manager.
     * @default true
     */
    showFileExtension?: boolean;

    /**
     * Shows or hides the files and folders that are marked as hidden.
     * @default false
     */
    showHiddenItems?: boolean;

    /**
     * Shows or hides the thumbnail images in large icons view.
     * @default true
     */
    showThumbnail?: boolean;

    /**
     * Specifies a value that indicates whether the folders and files are sorted in the ascending or descending order,
     * or they are not sorted at all. The available types of sort orders are,
     * `None` - Indicates that the folders and files are not sorted.
     * `Ascending` - Indicates that the folders and files are sorted in the ascending order.
     * `Descending` - Indicates that the folders and files are sorted in the descending order.
     * @default 'Ascending'
     */
    sortOrder?: SortOrder;

    /**
     * Specifies the group of items aligned horizontally in the toolbar.
     * @default { visible: true, items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'] }
     */
    toolbarSettings?: FileToolbarSettingsModel;

    /**
     * Specifies the upload settings for the file manager.
     * @default { autoUpload: true, minFileSize: 0, maxFileSize: 30000000, allowedExtensions: '', autoClose: false }
     */
    uploadSettings?: UploadSettingsModel;

    /**
     * Specifies the initial view of the file manager. 
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     * @default 'LargeIcons'
     */
    view?: ViewType;

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
     * @default '0'
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
     * Specifies whether to enable quick toolbar in RichTextEditor.
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether to opens a quick toolbar on the right click.
     * @default false
     */
    showOnRightClick?: boolean;

    /**
     * Specifies the action that should happen when scroll the target-parent container.
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
 * Interface for a class PasteCleanupSettings
 */
export interface PasteCleanupSettingsModel {

    /**
     * Specifies whether to enable the prompt for paste in RichTextEditor.
     * @default false
     */
    prompt?: boolean;

    /**
     * Specifies the attributes to restrict when pasting in RichTextEditor.
     * @default null
     */
    deniedAttrs?: string[];

    /**
     * Specifies the allowed style properties when pasting in RichTextEditor.
     * @default ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width']
     */
    allowedStyleProps?: string[];

    /**
     * Specifies the tags to restrict when pasting in RichTextEditor.
     * @default null
     */
    deniedTags?: string[];

    /**
     * Specifies whether to keep or remove the format when pasting in RichTextEditor.
     * @default true
     */
    keepFormat?: boolean;

    /**
     * Specifies whether to paste as plain text or not in RichTextEditor.
     * @default false
     */
    plainText?: boolean;

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