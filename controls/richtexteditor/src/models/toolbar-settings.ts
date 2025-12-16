import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SaveFormat, DisplayLayoutOptions, ActionOnScroll } from '../common/types';
import { ToolbarItems, ToolbarConfigItems, ColorModeType } from '../common/enum';
import { ToolbarType } from '../common/enum';
import { IToolbarItems, IDropDownItemModel, ICodeBlockLanguageModel, IToolsItemConfigs, IListDropDownModel } from '../common/interface';
import { backgroundColor, fontColor, fontFamily, fontSize, formatItems, predefinedItems, TableStyleItems, numberFormatList, bulletFormatList, codeBlockList, lineHeight } from '../models/items';
import { ToolbarPosition } from '../editor-manager/base/enum';

/**
 * Configures the toolbar settings of the RichTextEditor.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Specifies whether to render the toolbar in the RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies whether to enable or disable the floating toolbar.
     *
     * @default true
     */
    @Property(true)
    public enableFloating: boolean;

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
    @Property(ToolbarType.Expand)
    public type: ToolbarType;

    /**
     * An array of strings or objects used to configure the toolbar items.
     *
     * @default ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'Blockquote', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo']
     */
    @Property(predefinedItems)
    public items: (string | ToolbarConfigItems | IToolbarItems)[];

    /**
     * Allows modification of the default toolbar item configuration, such as the icon class.
     *
     * @default {}
     */
    @Property({})
    public itemConfigs: { [key in ToolbarItems]?: IToolsItemConfigs };

    /**
     * Specifies the position of the toolbar.
     * The available positions are:
     * - Top: Toolbar appears above the content area (default)
     * - Bottom: Toolbar appears below the content area
     *
     * @default ToolbarPosition.Top
     */
    @Property(ToolbarPosition.Top)
    public position: ToolbarPosition | string;
}

/**
 * Configures the importWord settings of the RichTextEditor.
 */
export class ImportWord extends ChildProperty<ImportWord> {
    /**
     * Specifies the URL to receive and handle file uploads on the server.
     *
     * @default null
     */
    @Property(null)
    public serviceUrl: string;
}

/**
 * Configures the export settings for Word format in the RichTextEditor.
 */
export class ExportWord extends ChildProperty<ExportWord> {
    /**
     * Specifies the URL used to export RichTextEditor content into Word files.
     *
     * @default null
     */
    @Property(null)
    public serviceUrl: string;

    /**
     * Specifies the file name for the exported Word file.
     *
     * @default 'Sample.docx'
     */
    @Property('Sample.docx')
    public fileName: string;

    /**
     * Specifies the stylesheet to be applied to the exported file.
     *
     * @default null
     */
    @Property(null)
    public stylesheet: string;
}

/**
 * Configures the export settings for PDF format in the RichTextEditor.
 */
export class ExportPdf extends ChildProperty<ExportPdf> {
    /**
     * Specifies the URL used to export RichTextEditor content into PDF files.
     *
     * @default null
     */
    @Property(null)
    public serviceUrl: string;

    /**
     * Specifies the file name for the exported PDF file.
     *
     * @default 'Sample.pdf'
     */
    @Property('Sample.pdf')
    public fileName: string;

    /**
     * Specifies the stylesheet to be applied to the exported file.
     *
     * @default null
     */
    @Property(null)
    public stylesheet: string;
}

/**
 * Configures the image settings of the RichTextEditor.
 */
export class ImageSettings extends ChildProperty<ImageSettings> {
    /**
     * Specifies the allowed file types for selection.
     *
     * @default ['.jpeg', '.jpg', '.png']
     */
    @Property(['.jpeg', '.jpg', '.png'])
    public allowedTypes: string[];

    /**
     * Specifies whether the image is inserted inline or with a break.
     *
     * @default 'inline'
     */
    @Property('inline')
    public display: string;

    /**
     * Specifies whether the inserted image is saved as a blob or base64.
     *
     * @default 'Blob'
     */
    @Property('Blob')
    public saveFormat: SaveFormat;

    /**
     * Specifies the width of the image.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string;

    /**
     * Specifies the height of the image.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string;

    /**
     * Specifies the URL for the save action that handles uploaded images on the server.
     *
     * This URL should handle a `POST` request, with an argument named `UploadFiles`.
     *
     * The event is triggered when inserting an image via the Insert Image dialog, pasting an image, replacing an existing image, or dragging and dropping from the file browser.
     *
     * @default null
     */
    @Property(null)
    public saveUrl: string;

    /**
     * Specifies the path for storing and displaying images.
     *
     * @default null
     */
    @Property(null)
    public path: string;

    /**
     * Enables resizing for the image element.
     *
     * @default true
     */
    @Property(true)
    public resize: boolean;

    /**
     * Specifies the URL for the remove action that handles image removal on the server.
     *
     * This URL should handle a `POST` request, with an argument named `UploadFiles`.
     *
     * The event is triggered when uploading and canceling or removing an image in the insert image dialog, pasting, and removing an image in the Paste cleanup popup.
     *
     * @default null
     */
    @Property(null)
    public removeUrl: string;

    /**
     * Defines the minimum width of the image.
     *
     * @default '0'
     */
    @Property(0)
    public minWidth: string | number;

    /**
     * Defines the maximum width of the image.
     *
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;

    /**
     * Defines the minimum height of the image.
     *
     * @default '0'
     */
    @Property(0)
    public minHeight: string | number;

    /**
     * Defines the maximum height of the image.
     *
     * @default null
     */
    @Property(null)
    public maxHeight: string | number;

    /**
     * Enables image resizing by percentage calculation.
     *
     * @default false
     */
    @Property(false)
    public resizeByPercent: boolean;

    /**
     * Specifies the maximum file size for image uploads in bytes.
     *
     * @default '30000000'
     */
    @Property(30000000)
    public maxFileSize: number;
}

/**
 * Configures the audio settings of the RichTextEditor.
 */
export class AudioSettings extends ChildProperty<AudioSettings> {
    /**
     * Specifies the allowed file types for audio selection.
     *
     * @default ['.wav', '.mp3', '.m4a', '.wma']
     */
    @Property(['.wav', '.mp3', '.m4a', '.wma'])
    public allowedTypes: string[];

    /**
     * Specifies whether the audio is inserted inline or with a break.
     *
     * @default 'Inline'
     */
    @Property('Inline')
    public layoutOption: DisplayLayoutOptions;

    /**
     * Specifies whether the inserted audio is saved as a blob or base64.
     *
     * @default 'Blob'
     */
    @Property('Blob')
    public saveFormat: SaveFormat;

    /**
     * Specifies the URL for the save action that handles uploaded audio files on the server.
     *
     * @default null
     */
    @Property(null)
    public saveUrl: string;

    /**
     * Specifies the URL for the remove action that handles audio removal on the server.
     *
     * @default null
     */
    @Property(null)
    public removeUrl: string;

    /**
     * Specifies the path for storing and displaying audio files.
     *
     * @default null
     */
    @Property(null)
    public path: string;

    /**
     * Specifies the maximum file size for audio uploads in bytes.
     *
     * @default '30000000'
     */
    @Property(30000000)
    public maxFileSize: number;
}

/**
 * Configures the video settings of the RichTextEditor.
 */
export class VideoSettings extends ChildProperty<VideoSettings> {
    /**
     * Specifies the allowed file types for video selection.
     *
     * @default ['.mp4', '.mov', '.wmv', '.avi']
     */
    @Property(['.mp4', '.mov', '.wmv', '.avi'])
    public allowedTypes: string[];

    /**
     * Specifies whether the video is inserted inline or with a break.
     *
     * @default 'Inline'
     */
    @Property('Inline')
    public layoutOption: DisplayLayoutOptions;

    /**
     * Specifies whether the inserted video is saved as a blob or base64.
     *
     * @default 'Blob'
     */
    @Property('Blob')
    public saveFormat: SaveFormat;

    /**
     * Specifies the width of the video.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string;

    /**
     * Specifies the height of the video.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string;

    /**
     * Specifies the URL for the save action that handles uploaded video files on the server.
     *
     * @default null
     */
    @Property(null)
    public saveUrl: string;

    /**
     * Specifies the path for storing and displaying video files.
     *
     * @default null
     */
    @Property(null)
    public path: string;

    /**
     * Enables resizing for the video element.
     *
     * @default true
     */
    @Property(true)
    public resize: boolean;

    /**
     * Specifies the URL for the remove action that handles video removal on the server.
     *
     * @default null
     */
    @Property(null)
    public removeUrl: string;

    /**
     * Defines the minimum width of the video.
     *
     * @default '0'
     */
    @Property(0)
    public minWidth: string | number;

    /**
     * Defines the maximum width of the video.
     *
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;

    /**
     * Defines the minimum height of the video.
     *
     * @default '0'
     */
    @Property(0)
    public minHeight: string | number;

    /**
     * Defines the maximum height of the video.
     *
     * @default null
     */
    @Property(null)
    public maxHeight: string | number;

    /**
     * Enables video resizing by percentage calculation.
     *
     * @default false
     */
    @Property(false)
    public resizeByPercent: boolean;

    /**
     * Specifies the maximum file size for video uploads in bytes.
     *
     * @default '30000000'
     */
    @Property(30000000)
    public maxFileSize: number;
}

export class TableSettings extends ChildProperty<TableSettings> {
    /**
     * Specifies the width of the table.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

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
    @Property(TableStyleItems)
    public styles: IDropDownItemModel[];

    /**
     * Enables resizing for the table element.
     *
     * @default true
     */
    @Property(true)
    public resize: boolean;

    /**
     * Defines the minimum width of the table.
     *
     * @default '0'
     */
    @Property(0)
    public minWidth: string | number;

    /**
     * Defines the maximum width of the table.
     *
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;
}

/**
 * Configures the quick toolbar settings of the RichTextEditor.
 */
export class QuickToolbarSettings extends ChildProperty<QuickToolbarSettings> {
    /**
     * Specifies whether to enable the quick toolbar in the RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies whether the quick toolbar opens on right-click.
     *
     * @default false
     */
    @Property(false)
    public showOnRightClick: boolean;

    /**
     * Specifies the action to perform when scrolling the target-parent container.
     *
     * @default 'none'
     */
    @Property('none')
    public actionOnScroll: ActionOnScroll;

    /**
     * Specifies the items to render in the quick toolbar when a link is selected.
     *
     * @default ['Open', 'Edit', 'UnLink']
     */
    @Property(['Open', 'Edit', 'UnLink'])
    public link: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when an image is selected.
     *
     * @default ['AltText', 'Caption', '|', 'Align', 'Display', '|', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', '|', 'Dimension', 'Replace', 'Remove']
     */
    @Property(['AltText', 'Caption', '|', 'Align', 'Display', '|', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', '|', 'Dimension', 'Replace', 'Remove'])
    public image: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when audio is selected.
     *
     * @default ['AudioLayoutOption', 'AudioReplace', 'AudioRemove']
     */
    @Property(['AudioLayoutOption', 'AudioReplace', 'AudioRemove'])
    public audio: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when a video is selected.
     *
     * @default ['VideoLayoutOption', 'VideoAlign', '|', 'VideoDimension', 'VideoReplace', 'VideoRemove']
     */
    @Property(['VideoLayoutOption', 'VideoAlign', '|', 'VideoDimension', 'VideoReplace', 'VideoRemove'])
    public video: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when text is selected.
     *
     * @default null
     */
    @Property(null)
    public text: (string | ToolbarConfigItems | IToolbarItems)[];

    /**
     * Specifies the items to render in the quick toolbar when a table is selected.
     *
     * @default ['Tableheader', 'TableRemove', '|', 'TableRows', 'TableColumns', '|' , 'Styles', 'BackgroundColor', 'Alignments', 'TableCellVerticalAlign']
     */
    @Property(['Tableheader', 'TableRemove', '|', 'TableRows', 'TableColumns', '|', 'Styles', 'BackgroundColor', 'Alignments', 'TableCellVerticalAlign'])
    public table: (string | IToolbarItems)[];
}

/**
 * Configures the format painter settings of the RichTextEditor.
 */
export class FormatPainterSettings extends ChildProperty<FormatPainterSettings> {
    /**
     * Defines the tag name selectors to obtain formats from elements.
     *
     * @default 'b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; ol; ul; li; pre;'
     */
    @Property('b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; ol; ul; li; pre;')
    public allowedFormats: string;

    /**
     * Defines selectors for elements from which fetching formats is expressly prohibited.
     *
     * @default null
     */
    @Property(null)
    public deniedFormats: string;
}

/**
 * Configures the paste cleanup settings of the RichTextEditor.
 */
export class PasteCleanupSettings extends ChildProperty<PasteCleanupSettings> {
    /**
     * Specifies whether to enable the prompt for paste in the RichTextEditor.
     *
     * @default false
     */
    @Property(false)
    public prompt: boolean;

    /**
     * Specifies the attributes to restrict when pasting in the RichTextEditor.
     *
     * @default null
     */
    @Property(null)
    public deniedAttrs: string[];

    /**
     * Specifies the allowed style properties when pasting in the RichTextEditor.
     *
     * @default ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-transform', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width', 'flex-direction']
     */
    @Property(['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-transform', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width', 'flex-direction'])
    public allowedStyleProps: string[];

    /**
     * Specifies the tags to restrict when pasting in the RichTextEditor.
     *
     * @default null
     */
    @Property(null)
    public deniedTags: string[];

    /**
     * Specifies whether to keep or remove formatting when pasting in the RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public keepFormat: boolean;

    /**
     * Specifies whether to paste as plain text or not in the RichTextEditor.
     *
     * @default false
     */
    @Property(false)
    public plainText: boolean;
}

/**
 * Configures the font family settings of the RichTextEditor.
 */
export class FontFamily extends ChildProperty<FontFamily> {
    /**
     * Specifies the default font family selection.
     *
     * @default null
     */
    @Property(null)
    public default: string;

    /**
     * Specifies the width of the content area.
     *
     * @default '72px'
     */
    @Property('72px')
    public width: string;

    /**
     * Specifies the default font family items.
     *
     * @default fontFamily
     */
    @Property(fontFamily)
    public items: IDropDownItemModel[];
}

/**
 * Configures the font size settings of the RichTextEditor.
 */
export class FontSize extends ChildProperty<FontSize> {
    /**
     * Specifies the default font size selection.
     *
     * @default null
     */
    @Property(null)
    public default: string;

    /**
     * Specifies the width of the content area.
     *
     * @default '60px'
     */
    @Property('60px')
    public width: string;

    /**
     * Specifies the default font size items.
     *
     * @default fontSize
     */
    @Property(fontSize)
    public items: IDropDownItemModel[];
}

/**
 * Configures the line height settings of the RichTextEditor.
 */
export class LineHeight extends ChildProperty<LineHeight> {
    /**
     * Specifies the default line height applied to the selected block element.
     *
     * @default null
     */
    @Property(null)
    public default: string;

    /**
     * Specifies the set of line height options displayed in the dropdown.
     *
     * @default lineHeight
     */
    @Property(lineHeight)
    public items: IDropDownItemModel[];

    /**
     * When enabled, the editor retains any numeric line height values found in pasted or imported content, even if they are not in the predefined lineHeight.items list.
     * These values appear as "Custom: {value}" options in the dropdown.
     * @default false
     */
    @Property(false)
    public supportAllValues: boolean;
}

/**
 * Configures the format settings of the RichTextEditor.
 */
export class Format extends ChildProperty<Format> {
    /**
     * Specifies the default format.
     *
     * @default null
     */
    @Property(null)
    public default: string;

    /**
     * Specifies the width of the content area.
     *
     * @default '65px'
     */
    @Property('65px')
    public width: string;

    /**
     * Specifies the collection of default font size items for the format dropdown.
     * These items define the available options for users to select.
     *
     * @default formatItems
     */
    @Property(formatItems)
    public types: IDropDownItemModel[];
}

/**
 * Configures the font color settings of the RichTextEditor.
 */
export class FontColor extends ChildProperty<FontColor> {
    /**
     * Specifies the default font color.
     *
     * @default '#ff0000'
     */
    @Property('#ff0000')
    public default: string;

    /**
     * Specifies the color mode.
     *
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;

    /**
     * Specifies the number of columns in the color palette.
     *
     * @default 10
     */
    @Property(10)
    public columns: number;

    /**
     * Specifies custom color codes.
     *
     * @default fontColor
     */
    @Property(fontColor)
    public colorCode: { [key: string]: string[] };

    /**
     * Enables or disables the mode switcher button.
     *
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;

    /**
     * Indicates whether the recent colors section is shown in the toolbar's fontColor.
     * This property enables the section in the toolbar's  font color picker that displays the recently selected colors for quick access.
     * This will allow quick re-use of colors that were recently selected, saving time and improving efficiency.
     *
     * {% codeBlock src='rich-text-editor/font-color/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public showRecentColors: boolean;
}

/**
 * Configures the background color settings of the RichTextEditor.
 */
export class BackgroundColor extends ChildProperty<BackgroundColor> {
    /**
     * Specifies the default background color.
     *
     * @default '#ffff00'
     */
    @Property('#ffff00')
    public default: string;

    /**
     * Specifies the color mode.
     *
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;

    /**
     * Specifies the number of columns in the color palette.
     *
     * @default 10
     */
    @Property(10)
    public columns: number;

    /**
     * Specifies custom color codes.
     *
     * @default backgroundColor
     */
    @Property(backgroundColor)
    public colorCode: { [key: string]: string[] };

    /**
     * Enables or disables the mode switcher button.
     *
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;

    /**
     * Indicates whether the recent colors section is shown in the toolbar's backgroundColor.
     * This property enables the section in the toolbar's  font color picker that displays the recently selected colors for quick access.
     * This will allow quick re-use of colors that were recently selected, saving time and improving efficiency.
     *
     * {% codeBlock src='rich-text-editor/background-color/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public showRecentColors: boolean;
}

/**
 * Configures the settings for the number format list in the RichTextEditor.
 */
export class NumberFormatList extends ChildProperty<NumberFormatList> {
    /**
     * Specifies the default options for the number format list items.
     *
     * @default numberFormatList
     */
    @Property(numberFormatList)
    public types: IListDropDownModel[];
}

/**
 * Configures the settings for the bullet format list in the RichTextEditor.
 */
export class BulletFormatList extends ChildProperty<BulletFormatList> {
    /**
     * Specifies the default options for the bullet format list items.
     *
     * @default bulletFormatList
     */
    @Property(bulletFormatList)
    public types: IListDropDownModel[];
}

/**
 * Configures the settings for the code block list in the RichTextEditor.
 */
export class CodeBlockSettings extends ChildProperty<CodeBlockSettings> {
    /**
     * Specifies the default options for the code block list items.
     *
     * @default codeBlockList
     */
    @Property(codeBlockList)
    public languages: ICodeBlockLanguageModel[];

    /**
     * Specifies the default language.
     *
     * @default 'plaintext'
     */
    @Property('plaintext')
    public defaultLanguage: string;
}
