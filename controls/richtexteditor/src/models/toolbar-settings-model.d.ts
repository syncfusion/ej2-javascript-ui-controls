import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SaveFormat, DisplayLayoutOptions, ActionOnScroll } from '../common/types';import { ToolbarItems, ToolbarConfigItems, ColorModeType } from '../common/enum';import { ToolbarType } from '../common/enum';import { IToolbarItems, IDropDownItemModel, ICodeBlockLanguageModel, IToolsItemConfigs, IListDropDownModel } from '../common/interface';import { backgroundColor, fontColor, fontFamily, fontSize, formatItems, predefinedItems, TableStyleItems, numberFormatList, bulletFormatList, codeBlockList, lineHeight } from '../models/items';import { ToolbarPosition } from '../editor-manager/base/enum';

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies whether to render the toolbar in the RichTextEditor.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether to enable or disable the floating toolbar.
     *
     * @default true
     */
    enableFloating?: boolean;

    /**
     * Specifies the display types of the toolbar.
     * The available types are:
     * - Expand: Toolbar items fit within available space, and the rest are placed in the extended menu.
     * - MultiRow: Toolbar placed at the top of the RichTextEditor editing area.
     * - Scrollable: Toolbar items displayed in a single line with horizontal scrolling enabled.
     * - Popup: Toolbar items displayed in popup container.
     *
     * @default Expand
     */
    type?: ToolbarType;

    /**
     * An array of strings or objects used to configure the toolbar items.
     *
     * @default ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'Blockquote', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo']
     */
    items?: (string | ToolbarConfigItems | IToolbarItems)[];

    /**
     * Allows modification of the default toolbar item configuration, such as the icon class.
     *
     * @default {}
     */
    itemConfigs?: { [key in ToolbarItems]?: IToolsItemConfigs };

    /**
     * Specifies the position of the toolbar.
     * The available positions are:
     * - Top: Toolbar appears above the content area (default)
     * - Bottom: Toolbar appears below the content area
     *
     * @default ToolbarPosition.Top
     */
    position?: ToolbarPosition | string;

}

/**
 * Interface for a class ImportWord
 */
export interface ImportWordModel {

    /**
     * Specifies the URL to receive and handle file uploads on the server.
     *
     * @default null
     */
    serviceUrl?: string;

}

/**
 * Interface for a class ExportWord
 */
export interface ExportWordModel {

    /**
     * Specifies the URL used to export RichTextEditor content into Word files.
     *
     * @default null
     */
    serviceUrl?: string;

    /**
     * Specifies the file name for the exported Word file.
     *
     * @default 'Sample.docx'
     */
    fileName?: string;

    /**
     * Specifies the stylesheet to be applied to the exported file.
     *
     * @default null
     */
    stylesheet?: string;

}

/**
 * Interface for a class ExportPdf
 */
export interface ExportPdfModel {

    /**
     * Specifies the URL used to export RichTextEditor content into PDF files.
     *
     * @default null
     */
    serviceUrl?: string;

    /**
     * Specifies the file name for the exported PDF file.
     *
     * @default 'Sample.pdf'
     */
    fileName?: string;

    /**
     * Specifies the stylesheet to be applied to the exported file.
     *
     * @default null
     */
    stylesheet?: string;

}

/**
 * Interface for a class ImageSettings
 */
export interface ImageSettingsModel {

    /**
     * Specifies the allowed file types for selection.
     *
     * @default ['.jpeg', '.jpg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether the image is inserted inline or with a break.
     *
     * @default 'inline'
     */
    display?: string;

    /**
     * Specifies whether the inserted image is saved as a blob or base64.
     *
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the width of the image.
     *
     * @default 'auto'
     */
    width?: string;

    /**
     * Specifies the height of the image.
     *
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the URL for the save action that handles uploaded images on the server.
     *
     * This URL should handle a `POST` request, with an argument named `UploadFiles`.
     *
     * The event is triggered when inserting an image via the Insert Image dialog, pasting an image, replacing an existing image, or dragging and dropping from the file browser.
     *
     * @default null
     */
    saveUrl?: string;

    /**
     * Specifies the path for storing and displaying images.
     *
     * @default null
     */
    path?: string;

    /**
     * Enables resizing for the image element.
     *
     * @default true
     */
    resize?: boolean;

    /**
     * Specifies the URL for the remove action that handles image removal on the server.
     *
     * This URL should handle a `POST` request, with an argument named `UploadFiles`.
     *
     * The event is triggered when uploading and canceling or removing an image in the insert image dialog, pasting, and removing an image in the Paste cleanup popup.
     *
     * @default null
     */
    removeUrl?: string;

    /**
     * Defines the minimum width of the image.
     *
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum width of the image.
     *
     * @default null
     */
    maxWidth?: string | number;

    /**
     * Defines the minimum height of the image.
     *
     * @default '0'
     */
    minHeight?: string | number;

    /**
     * Defines the maximum height of the image.
     *
     * @default null
     */
    maxHeight?: string | number;

    /**
     * Enables image resizing by percentage calculation.
     *
     * @default false
     */
    resizeByPercent?: boolean;

    /**
     * Specifies the maximum file size for image uploads in bytes.
     *
     * @default '30000000'
     */
    maxFileSize?: number;

}

/**
 * Interface for a class AudioSettings
 */
export interface AudioSettingsModel {

    /**
     * Specifies the allowed file types for audio selection.
     *
     * @default ['.wav', '.mp3', '.m4a', '.wma']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether the audio is inserted inline or with a break.
     *
     * @default 'Inline'
     */
    layoutOption?: DisplayLayoutOptions;

    /**
     * Specifies whether the inserted audio is saved as a blob or base64.
     *
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the URL for the save action that handles uploaded audio files on the server.
     *
     * @default null
     */
    saveUrl?: string;

    /**
     * Specifies the URL for the remove action that handles audio removal on the server.
     *
     * @default null
     */
    removeUrl?: string;

    /**
     * Specifies the path for storing and displaying audio files.
     *
     * @default null
     */
    path?: string;

    /**
     * Specifies the maximum file size for audio uploads in bytes.
     *
     * @default '30000000'
     */
    maxFileSize?: number;

}

/**
 * Interface for a class VideoSettings
 */
export interface VideoSettingsModel {

    /**
     * Specifies the allowed file types for video selection.
     *
     * @default ['.mp4', '.mov', '.wmv', '.avi']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether the video is inserted inline or with a break.
     *
     * @default 'Inline'
     */
    layoutOption?: DisplayLayoutOptions;

    /**
     * Specifies whether the inserted video is saved as a blob or base64.
     *
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the width of the video.
     *
     * @default 'auto'
     */
    width?: string;

    /**
     * Specifies the height of the video.
     *
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the URL for the save action that handles uploaded video files on the server.
     *
     * @default null
     */
    saveUrl?: string;

    /**
     * Specifies the path for storing and displaying video files.
     *
     * @default null
     */
    path?: string;

    /**
     * Enables resizing for the video element.
     *
     * @default true
     */
    resize?: boolean;

    /**
     * Specifies the URL for the remove action that handles video removal on the server.
     *
     * @default null
     */
    removeUrl?: string;

    /**
     * Defines the minimum width of the video.
     *
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum width of the video.
     *
     * @default null
     */
    maxWidth?: string | number;

    /**
     * Defines the minimum height of the video.
     *
     * @default '0'
     */
    minHeight?: string | number;

    /**
     * Defines the maximum height of the video.
     *
     * @default null
     */
    maxHeight?: string | number;

    /**
     * Enables video resizing by percentage calculation.
     *
     * @default false
     */
    resizeByPercent?: boolean;

    /**
     * Specifies the maximum file size for video uploads in bytes.
     *
     * @default '30000000'
     */
    maxFileSize?: number;

}

/**
 * Interface for a class TableSettings
 */
export interface TableSettingsModel {

    /**
     * Specifies the width of the table.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Class names appended by default to the table element.
     * Assists in styling the table in specific CSS styles when inserted in the editor.
     *
     * Available styles:
     * - `Dashed Borders`: Adds dashed borders around the table using the `e-dashed-borders` CSS class.
     * - `Alternate Rows`: Applies alternating row colors for better readability using the `e-alternate-rows` CSS class.
     *
     * @default TableStyleItems
     */
    styles?: IDropDownItemModel[];

    /**
     * Enables resizing for the table element.
     *
     * @default true
     */
    resize?: boolean;

    /**
     * Defines the minimum width of the table.
     *
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum width of the table.
     *
     * @default null
     */
    maxWidth?: string | number;

}

/**
 * Interface for a class QuickToolbarSettings
 */
export interface QuickToolbarSettingsModel {

    /**
     * Specifies whether to enable the quick toolbar in the RichTextEditor.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether the quick toolbar opens on right-click.
     *
     * @default false
     */
    showOnRightClick?: boolean;

    /**
     * Specifies the action to perform when scrolling the target-parent container.
     *
     * @default 'none'
     */
    actionOnScroll?: ActionOnScroll;

    /**
     * Specifies the items to render in the quick toolbar when a link is selected.
     *
     * @default ['Open', 'Edit', 'UnLink']
     */
    link?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when an image is selected.
     *
     * @default ['AltText', 'Caption', '|', 'Align', 'Display', '|', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', '|', 'Dimension', 'Replace', 'Remove']
     */
    image?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when audio is selected.
     *
     * @default ['AudioLayoutOption', 'AudioReplace', 'AudioRemove']
     */
    audio?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when a video is selected.
     *
     * @default ['VideoLayoutOption', 'VideoAlign', '|', 'VideoDimension', 'VideoReplace', 'VideoRemove']
     */
    video?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when text is selected.
     *
     * @default null
     */
    text?: (string | ToolbarConfigItems | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when a table is selected.
     *
     * @default ['Tableheader', 'TableRemove', '|', 'TableRows', 'TableColumns', '|' , 'Styles', 'BackgroundColor', 'Alignments', 'TableCellVerticalAlign']
     */
    table?: (string | IToolbarItems)[];

}

/**
 * Interface for a class FormatPainterSettings
 */
export interface FormatPainterSettingsModel {

    /**
     * Defines the tag name selectors to obtain formats from elements.
     *
     * @default 'b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; ol; ul; li; pre;'
     */
    allowedFormats?: string;

    /**
     * Defines selectors for elements from which fetching formats is expressly prohibited.
     *
     * @default null
     */
    deniedFormats?: string;

}

/**
 * Interface for a class PasteCleanupSettings
 */
export interface PasteCleanupSettingsModel {

    /**
     * Specifies whether to enable the prompt for paste in the RichTextEditor.
     *
     * @default false
     */
    prompt?: boolean;

    /**
     * Specifies the attributes to restrict when pasting in the RichTextEditor.
     *
     * @default null
     */
    deniedAttrs?: string[];

    /**
     * Specifies the allowed style properties when pasting in the RichTextEditor.
     *
     * @default ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-transform', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width', 'flex-direction']
     */
    allowedStyleProps?: string[];

    /**
     * Specifies the tags to restrict when pasting in the RichTextEditor.
     *
     * @default null
     */
    deniedTags?: string[];

    /**
     * Specifies whether to keep or remove formatting when pasting in the RichTextEditor.
     *
     * @default true
     */
    keepFormat?: boolean;

    /**
     * Specifies whether to paste as plain text or not in the RichTextEditor.
     *
     * @default false
     */
    plainText?: boolean;

}

/**
 * Interface for a class FontFamily
 */
export interface FontFamilyModel {

    /**
     * Specifies the default font family selection.
     *
     * @default null
     */
    default?: string;

    /**
     * Specifies the width of the content area.
     *
     * @default '72px'
     */
    width?: string;

    /**
     * Specifies the default font family items.
     *
     * @default fontFamily
     */
    items?: IDropDownItemModel[];

}

/**
 * Interface for a class FontSize
 */
export interface FontSizeModel {

    /**
     * Specifies the default font size selection.
     *
     * @default null
     */
    default?: string;

    /**
     * Specifies the width of the content area.
     *
     * @default '60px'
     */
    width?: string;

    /**
     * Specifies the default font size items.
     *
     * @default fontSize
     */
    items?: IDropDownItemModel[];

}

/**
 * Interface for a class LineHeight
 */
export interface LineHeightModel {

    /**
     * Specifies the default line height applied to the selected block element.
     *
     * @default null
     */
    default?: string;

    /**
     * Specifies the set of line height options displayed in the dropdown.
     *
     * @default lineHeight
     */
    items?: IDropDownItemModel[];

    /**
     * When enabled, the editor retains any numeric line height values found in pasted or imported content, even if they are not in the predefined lineHeight.items list.
     * These values appear as "Custom: {value}" options in the dropdown.
     * @default false
     */
    supportAllValues?: boolean;

}

/**
 * Interface for a class Format
 */
export interface FormatModel {

    /**
     * Specifies the default format.
     *
     * @default null
     */
    default?: string;

    /**
     * Specifies the width of the content area.
     *
     * @default '65px'
     */
    width?: string;

    /**
     * Specifies the collection of default font size items for the format dropdown.
     * These items define the available options for users to select.
     *
     * @default formatItems
     */
    types?: IDropDownItemModel[];

}

/**
 * Interface for a class FontColor
 */
export interface FontColorModel {

    /**
     * Specifies the default font color.
     *
     * @default '#ff0000'
     */
    default?: string;

    /**
     * Specifies the color mode.
     *
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies the number of columns in the color palette.
     *
     * @default 10
     */
    columns?: number;

    /**
     * Specifies custom color codes.
     *
     * @default fontColor
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Enables or disables the mode switcher button.
     *
     * @default false
     */
    modeSwitcher?: boolean;

    /**
     * Indicates whether the recent colors section is shown in the toolbar's fontColor.
     * This property enables the section in the toolbar's  font color picker that displays the recently selected colors for quick access.
     * This will allow quick re-use of colors that were recently selected, saving time and improving efficiency.
     *
     * {% codeBlock src='rich-text-editor/font-color/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    showRecentColors?: boolean;

}

/**
 * Interface for a class BackgroundColor
 */
export interface BackgroundColorModel {

    /**
     * Specifies the default background color.
     *
     * @default '#ffff00'
     */
    default?: string;

    /**
     * Specifies the color mode.
     *
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies the number of columns in the color palette.
     *
     * @default 10
     */
    columns?: number;

    /**
     * Specifies custom color codes.
     *
     * @default backgroundColor
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Enables or disables the mode switcher button.
     *
     * @default false
     */
    modeSwitcher?: boolean;

    /**
     * Indicates whether the recent colors section is shown in the toolbar's backgroundColor.
     * This property enables the section in the toolbar's  font color picker that displays the recently selected colors for quick access.
     * This will allow quick re-use of colors that were recently selected, saving time and improving efficiency.
     *
     * {% codeBlock src='rich-text-editor/background-color/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    showRecentColors?: boolean;

}

/**
 * Interface for a class NumberFormatList
 */
export interface NumberFormatListModel {

    /**
     * Specifies the default options for the number format list items.
     *
     * @default numberFormatList
     */
    types?: IListDropDownModel[];

}

/**
 * Interface for a class BulletFormatList
 */
export interface BulletFormatListModel {

    /**
     * Specifies the default options for the bullet format list items.
     *
     * @default bulletFormatList
     */
    types?: IListDropDownModel[];

}

/**
 * Interface for a class CodeBlockSettings
 */
export interface CodeBlockSettingsModel {

    /**
     * Specifies the default options for the code block list items.
     *
     * @default codeBlockList
     */
    languages?: ICodeBlockLanguageModel[];

    /**
     * Specifies the default language.
     *
     * @default 'plaintext'
     */
    defaultLanguage?: string;

}