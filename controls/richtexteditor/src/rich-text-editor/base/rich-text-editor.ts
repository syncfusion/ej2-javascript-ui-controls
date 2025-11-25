import { Component, ModuleDeclaration, EventHandler, Complex, Browser, EmitType, addClass, detach, updateCSSText, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, formatUnit, L10n, closest } from '@syncfusion/ej2-base';
import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, compile, append, extend, debounce } from '@syncfusion/ej2-base';
import { Touch as EJ2Touch, TapEventArgs, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { getScrollableParent, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { RichTextEditorModel } from './rich-text-editor-model';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Render } from '../renderer/render';
import { ViewSource } from '../renderer/view-source';
import { IFormatter, IBaseQuickToolbar, SlashMenuItemSelectArgs, ImageFailedEventArgs, IRenderer } from './interface';
import { executeGroup, ToolbarStatusEventArgs } from './interface';
import { ChangeEventArgs, AfterImageDeleteEventArgs, AfterMediaDeleteEventArgs, PasteCleanupArgs } from './interface';
import { ILinkCommandsArgs, ImageDropEventArgs, IImageCommandsArgs, IAudioCommandsArgs, IVideoCommandsArgs, BeforeSanitizeHtmlArgs, ITableCommandsArgs, ExecuteCommandOption, ICodeBlockCommandsArgs, IListCommandArgs, IToolbarItems, MediaDropEventArgs, IToolbarItemModel, NotifyArgs, ToolbarClickEventArgs } from '../../common/interface';
import { PrintEventArgs, ActionCompleteEventArgs, ActionBeginEventArgs, IFormatPainterArgs, CleanupResizeElemArgs, ImageSuccessEventArgs, IExecutionGroup, ResizeArgs, StatusArgs, BeforeQuickToolbarOpenArgs, SelectionChangedEventArgs } from '../../common/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from './enum';
import { EditorMode, ShiftEnterKey, EnterKey } from './../../common/types';
import { Toolbar } from '../actions/toolbar';
import { ExecCommandCallBack } from '../actions/execute-command-callback';
import { KeyboardEvents } from '../actions/keyboard';
import { FontFamilyModel, FontSizeModel, FontColorModel, FormatModel, BackgroundColorModel, NumberFormatListModel, BulletFormatListModel, CodeBlockSettingsModel } from '../../models/models';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, AudioSettingsModel, VideoSettingsModel, TableSettingsModel, EmojiSettingsModel } from '../../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel, FormatPainterSettingsModel, ImportWordModel, ExportWordModel, ExportPdfModel } from '../../models/models';
import { ToolbarSettings, ImageSettings, AudioSettings, VideoSettings, QuickToolbarSettings, FontFamily, FontSize, Format, NumberFormatList, BulletFormatList, FormatPainterSettings, ImportWord, ExportWord, ExportPdf, CodeBlockSettings } from '../../models/toolbar-settings';
import { FileManagerSettingsModel } from '../models/models';
import { EmojiSettings } from '../../models/emoji-settings';
import { FileManagerSettings } from '../models/fileManager-settings';
import { TableSettings, PasteCleanupSettings } from '../../models/toolbar-settings';
import { FontColor, BackgroundColor } from '../../models/toolbar-settings';
import { IFrameSettings } from '../../models/iframe-settings';
import { InlineMode } from '../../models/inline-mode';
import { Link } from '../renderer/link-module';
import { Image } from '../renderer/image-module';
import { Audio } from '../renderer/audio-module';
import { Video } from '../renderer/video-module';
import { Table } from '../renderer/table-module';
import { Count } from '../actions/count';
import { HtmlEditor } from '../actions/html-editor';
import { MarkdownEditor } from '../actions/markdown-editor';
import { defaultLocale } from '../models/default-locale';
import { setAttributes } from '../actions/html-attributes';
import { BaseToolbar } from '../actions/base-toolbar';
import { QuickToolbar } from '../actions/quick-toolbar';
import { FullScreen } from '../actions/full-screen';
import { PasteCleanup } from '../actions/paste-clean-up';
import { ImportExport } from '../actions/import-export';
import { EnterKeyAction } from '../actions/enter-key';
import * as CONSTANT from '../../common/constant';
import { IHtmlKeyboardEvent, IHtmlUndoRedoData, BeforeInputEvent } from '../../editor-manager/base/interface';
import { dispatchEvent, getEditValue, decode, isEditableValueEmpty, getDefaultValue } from '../base/util';
import { cleanHTMLString, scrollToCursor, getStructuredHtml, isIDevice, alignmentHtml, openPrintWindow } from '../../common/util';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { SelectedEventArgs, RemovingEventArgs, UploadingEventArgs, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import { Resize } from '../actions/resize';
import { FileManager } from '../actions/file-manager';
import { FormatPainter } from '../actions/format-painter';
import { EmojiPicker } from '../actions/emoji-picker';
import { SlashMenuSettings } from '../../models/slash-menu-settings';
import { SlashMenuSettingsModel } from '../../models/slash-menu-settings-model';
import { SlashMenu } from '../renderer/slash-menu';
import { mentionRestrictKeys } from '../../common/config';
import { CustomUserAgentData } from '../../common/user-agent';
import { cleanupInternalElements, removeSelectionClassStates, resetContentEditableElements } from '../../common/util';
import { NodeSelection } from '../../selection/index';
import { MarkdownUndoRedoData } from '../../markdown-parser/base/interface';
import { ICodeBlockItem } from '../../common/interface';
import { CodeBlock } from '../actions/code-block';
import { CommandName, DialogType } from '../../common/enum';
import { PopupUploader } from '../renderer/popup-uploader-renderer';

/**
 * Represents the Rich Text Editor component.
 * ```html
 * <textarea id="rte"></textarea>
 * <script>
 *  var rteObj = new RichTextEditor();
 *  rteObj.appendTo("#rte");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class RichTextEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    private placeHolderWrapper: HTMLElement;
    /**
     * Provides the Scrollable parent element from the Root element.
     *
     * @hidden
     *
     */
    public scrollParentElements: HTMLElement[];
    private cloneValue: string;
    private onFocusHandler: () => void;
    private onBlurHandler: () => void;
    private onResizeHandler: () => void;
    private onLoadHandler: () => void;
    private timeInterval: number;
    private autoSaveTimeOut: number;
    private idleInterval: number;
    private touchModule: EJ2Touch;
    private defaultResetValue: string;
    private isResizeInitialized: boolean;
    private isValueChangeBlurhandler: boolean;
    private displayTempElem: HTMLElement;
    private beforeRenderClassValue: string;
    private mouseDownDebListener: Function;
    private internalID: string;
    private mutationObserver: MutationObserver;
    private hasContentChanged: boolean = false;
    /**
     * @private
     */
    public userAgentData: CustomUserAgentData;

    /**
     * Specifies the root container of the Rich Text Editor component.
     *
     * @hidden
     * @deprecated
     *
     **/
    public rootContainer: HTMLElement;
    /**
     * @hidden
     * @deprecated
     */
    public currentTarget: HTMLElement;
    /**
     * @hidden
     * @deprecated
     */
    public isFocusOut: boolean;
    /**
     * @hidden
     * @deprecated
     */
    public inputElement: HTMLElement;
    /**
     * @hidden
     * @deprecated
     */
    public isRTE: boolean;
    /**
     * @hidden
     * @deprecated
     */
    public isBlur: boolean;
    /**
     * @hidden
     * @deprecated
     */
    public renderModule: Render;
    /**
     * @hidden
     * @deprecated
     */
    public contentModule: IRenderer;
    /**
     * @hidden
     * @deprecated
     */
    public serviceLocator: ServiceLocator;
    /**
     * The `toolbarModule` is used to manipulate ToolBar items and its action in the RichTextEditor.
     *
     * @hidden
     * @deprecated
     */
    public toolbarModule: Toolbar;
    /**
     * @hidden
     * @deprecated
     */
    public imageModule: Image;
    /**
     * @hidden
     * @deprecated
     */
    public audioModule: Audio;
    /**
     * @hidden
     * @deprecated
     */
    public videoModule: Video;
    /**
     * @hidden
     * @deprecated
     */
    public tableModule: Table;

    /**
     * @hidden
     * @deprecated
     */
    public fullScreenModule: FullScreen;
    /**
     * @hidden
     * @deprecated
     */
    public resizeModule: Resize;

    /**
     * @hidden
     * @deprecated
     */
    public pasteCleanupModule: PasteCleanup;

    /**
     * @hidden
     * @deprecated
     */
    public codeBlockModule: CodeBlock;

    /**
     * @hidden
     * @deprecated
     */
    public importExportModule: ImportExport;

    /**
     * @hidden
     * @deprecated
     */
    public enterKeyModule: EnterKeyAction;

    /**
     * @hidden
     * @deprecated
     */
    public sourceCodeModule: ViewSource;
    /**
     * @hidden
     * @deprecated
     */
    public linkModule: Link;
    /**
     * @hidden
     * @deprecated
     */
    public markdownEditorModule: MarkdownEditor;
    /**
     * @hidden
     * @deprecated
     */
    public htmlEditorModule: HtmlEditor;
    /**
     * @hidden
     * @deprecated
     */
    public quickToolbarModule: QuickToolbar;
    /**
     * @hidden
     * @deprecated
     */
    public countModule: Count;
    /**
     * @hidden
     * @deprecated
     */
    public fileManagerModule: FileManager;
    /**
     * @hidden
     * @deprecated
     */
    public formatPainterModule: FormatPainter;

    public slashMenuModule: SlashMenu;

    /**
     * @hidden
     * @deprecated
     */
    public emojiPickerModule: EmojiPicker;
    public needsID: boolean;
    /**
     * Specifies the configuration for the toolbar, including the alignment and rendering type.
     * By default, the toolbar floats at the top of the RichTextEditor.
     * When you scroll down, the toolbar will move with the page applying the specified offset.
     *
     * Properties:
     *
     * - enable: A boolean value to show or hide the toolbar.
     *
     * - enableFloating: A boolean value to enable or disable the floating toolbar.
     *   This keeps the toolbar fixed at the top of the RichTextEditor during scrolling.
     *
     * - type: Defines the toolbar type, with the following options:
     *   1. Expand: Overflowing toolbar items are hidden and can be accessed by clicking the expand arrow.
     *   2. MultiRow: Overflowing toolbar items wrap into the next row.
     *   3. Scrollable: Toolbar items are on a single line and can be scrolled horizontally if they overflow.
     *   4. Popup: Overflowing toolbar items wrap into a popup container.
     *
     * - position: Defines the toolbar position, with the following options:
     *   1. Top: Positions the toolbar at the top of the RichTextEditor.
     *   2. Bottom: Positions the toolbar at the bottom of the RichTextEditor.
     *
     * - items: An array specifying the items aligned horizontally in the toolbar.
     * > '|' and '-' can be used to insert vertical and horizontal separator lines in the toolbar.
     *
     * - itemConfigs: Allows the modification of the default toolbar item configuration, such as the icon class.
     *
     * > By default, the toolbar is rendered with a scrollable option on mobile devices and does not support other toolbar types.
     *
     * {% codeBlock src='rich-text-editor/toolbar-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * enable: true,
     * enableFloating: true,
     * position: ToolbarPosition.Top,
     * type: ToolbarType.Expand,
     * items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
     * 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'],
     * itemConfigs: {}
     * }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Configuration options for the slash menu feature in the Editor, used to display a mention popup.
     * Properties:
     * * enable: A boolean indicating whether the slash menu is enabled in the Editor.
     * * items: An array specifying the list of items to be displayed in the slash menu.
     * * popupWidth: Defines the width of the slash menu popup. Accepts values in pixels, numbers, or percentages. Numeric values are treated as pixels.
     * * popupHeight: Defines the height of the slash menu popup. Accepts values in pixels, numbers, or percentages. Numeric values are treated as pixels.
     *
     * @default
     * {
     * enable: false,
     * items: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList',
     * 'CodeBlock', 'BlockQuote'],
     * popupWidth: '300px',
     * popupHeight: '320px'
     * }
     */
    @Complex<SlashMenuSettingsModel>({ enable: false, items: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'OrderedList', 'UnorderedList', 'CodeBlock', 'Blockquote'], popupWidth: '300px', popupHeight: '320px' }, SlashMenuSettings)
    public slashMenuSettings: SlashMenuSettingsModel;

    /**
     * Specifies the items to be rendered in the quick toolbar based on the target element.
     * Properties:
     * * enable: Boolean to show or hide the quick toolbar.
     * * actionOnScroll: Options for quick toolbar behavior on scroll:
     *   1. hide: The quick toolbar closes when the parent element is scrolled.
     *   2. none: The quick toolbar stays open even if the parent element is scrolled.
     * * link: Specifies items in the quick toolbar for links ('Open', 'Edit', 'UnLink').
     * * image: Specifies items in the quick toolbar for images ('Replace', 'Align', 'Caption', 'Remove', 'InsertLink', 'Display', 'AltText', 'Dimension').
     * * text: Specifies items in the quick toolbar for text ('Cut', 'Copy', 'Paste').
     * * audio: Specifies items for audio ('AudioReplace', 'AudioRemove', 'AudioLayoutOption').
     * * video: Specifies items for video ('VideoReplace', 'VideoAlign', 'VideoRemove', 'VideoLayoutOption', 'VideoDimension').
     *
     * {% codeBlock src='rich-text-editor/quick-toolbar-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * enable: true,
     * actionOnScroll: 'none',
     * link: ['Open', 'Edit', 'UnLink'],
     * table: ['Tableheader', 'TableRemove', '|', 'TableRows', 'TableColumns', '|' , 'Styles', 'BackgroundColor', 'Alignments', 'TableCellVerticalAlign'],
     * image: ['AltText', 'Caption', '|', 'Align', 'Display', '|', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', '|', 'Dimension', 'Replace', 'Remove'],
     * audio: ['AudioLayoutOption', 'AudioReplace', 'AudioRemove'],
     * video: ['VideoLayoutOption', 'VideoAlign', '|', 'VideoDimension', 'VideoReplace', 'VideoRemove'],
     * }
     */
    @Complex<QuickToolbarSettingsModel>({}, QuickToolbarSettings)
    public quickToolbarSettings: QuickToolbarSettingsModel;

    /**
     * Configures paste options in the Rich Text Editor.
     * Properties:
     * * prompt: Boolean to enable or disable paste prompt.
     * * deniedAttrs: Attributes to restrict during paste.
     * * allowedStyleProps: Style properties allowed when pasting.
     * * deniedTags: Tags to restrict when pasting.
     * * keepFormat: Boolean to keep or remove format when pasting.
     * * plainText: Boolean to paste as plain text.
     *
     * {% codeBlock src='rich-text-editor/paste-cleanup-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * prompt: false,
     * deniedAttrs: null,
     * allowedStyleProps: ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius',
     * 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor',
     * 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style',
     * 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left',
     * 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width',
     * 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right',
     * 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-transform', 'text-indent',
     * 'top', 'vertical-align', 'visibility', 'white-space', 'width', 'flex-direction'],
     * deniedTags: null,
     * keepFormat: true,
     * plainText:  false
     * }
     */
    @Complex<PasteCleanupSettingsModel>({}, PasteCleanupSettings)
    public pasteCleanupSettings: PasteCleanupSettingsModel;

    /**
     * Configures the format painter options in the Rich Text Editor.
     * Properties:
     * * allowedFormats: Tags selectors that allow format copying.
     * * deniedFormats: Tag selectors that prevent format copying.
     *
     * {% codeBlock src='rich-text-editor/format-painter-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * allowedFormats: 'b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; ol; ul; li; pre;',
     * deniedFormats: null
     * }
     */
    @Complex<FormatPainterSettingsModel>({}, FormatPainterSettings)
    public formatPainterSettings: FormatPainterSettingsModel;

    /**
     * Configures emoji picker options in the Rich Text Editor.
     * Properties:
     * * iconsSet: Array representing emoji icons.
     * * showSearchBox: Enables/disables the search box.
     *
     *
     */
    @Complex<EmojiSettingsModel>({}, EmojiSettings)
    public emojiPickerSettings: EmojiSettingsModel;

    /**
     * Configures iframe mode items in the Rich Text Editor.
     * Properties:
     * * enable: Boolean to place editor content in an iframe, isolating it from the page.
     * * attributes: Custom style for displaying content inside the iframe. Applied to iframe body.
     * * resources: Adds styles and scripts to the iframe.
     *   1. styles[]: Array of CSS files for the iframe content.
     *   2. scripts[]: Array of JS script files for the iframe.
     * * metaTags[]: Array of meta tags for iframe's head, setting metadata (http-equiv, charset, etc.).
     * * sandbox: String array defining iframe sandbox attributes, controlling security restrictions. Default includes "allow-same-origin".
     *
     * {% codeBlock src='rich-text-editor/iframe-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * enable: false,
     * attributes: null,
     * resources: { styles: [], scripts: [] },
     * metaTags: [],
     * sandbox: null,
     * }
     */
    @Complex<IFrameSettingsModel>({}, IFrameSettings)
    public iframeSettings: IFrameSettingsModel;
    /**
     * Specifies the options for inserting images in the Rich Text Editor. Includes properties such as:
     * - `allowedTypes`: Specifies the allowed image file extensions as a comma-separated list (e.g., '.jpg', '.png').
     * - `display`: Sets the default display mode for an inserted image, either 'inline' or 'block'.
     * - `width`: Specifies the default width for an inserted image.
     * - `saveFormat`: Indicates the format for storing images in the editor (Base64 or Blob).
     *   > Select Base64 for numerous small images without a specific physical storage location.
     * - `height`: Defines the default height for an inserted image.
     * - `saveUrl`: Specifies the URL for the service that handles image upload and storage on the server.
     * - `path`: Determines the storage location for images and their display path.
     * - `maxFileSize`: Sets the maximum file size allowed for image uploads.
     *
     * {% codeBlock src='rich-text-editor/insert-image-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     *   allowedTypes: ['.jpeg', '.jpg', '.png'],
     *   display: 'inline',
     *   width: 'auto',
     *   height: 'auto',
     *   saveFormat: 'Blob',
     *   saveUrl: null,
     *   path: null,
     *   maxFileSize: 30000000
     * }
     */
    @Complex<ImageSettingsModel>({}, ImageSettings)
    public insertImageSettings: ImageSettingsModel;

    /**
     * Configures the options for importing Word files in the Rich Text Editor component.
     * The `serviceUrl` property specifies the server endpoint URL where the uploaded Word file will be processed.
     *
     * @default
     * {
     *   serviceUrl: null
     * }
     */
    @Complex<ImportWordModel>({}, ImportWord)
    public importWord: ImportWordModel;

    /**
     * Defines file export options for the Rich Text Editor with properties like:
     * - `serviceurl`: The URL utilized for exporting editor content to Word files.
     * - `fileName`: Designates the default name for exported Word files.
     * - `stylesheet`: Applies a stylesheet to the exported Word file.
     *
     * @default
     * {
     *   serviceUrl: null,
     *   fileName: Sample.docx,
     *   stylesheet: null
     * }
     */
    @Complex<ExportWordModel>({}, ExportWord)
    public exportWord: ExportWordModel;

    /**
     * Describes file export options to PDF in the Rich Text Editor, such as:
     * - `serviceurl`: URL used for exporting content to PDF format.
     * - `fileName`: Specifies the default PDF file name upon export.
     * - `stylesheet`: Applies a stylesheet to the exported PDF file.
     *
     * @default
     * {
     *   serviceUrl: null,
     *   fileName: 'Sample.pdf',
     *   stylesheet: null
     * }
     */
    @Complex<ExportPdfModel>({}, ExportPdf)
    public exportPdf: ExportPdfModel;

    /**
     * Defines the options for inserting audio files in the Rich Text Editor, including properties such as:
     * - `allowedTypes`: Specifies the file extensions for audio files allowed to be inserted, listed as a comma-separated string (e.g., '.wav', '.mp3').
     * - `layoutOption`: Sets the default layout for audio files when inserted into the Rich Text Editor. The options are 'Inline' and 'Break'.
     * - `saveFormat`: Determines the format used to store audio files in the Rich Text Editor, either 'Base64' or 'Blob'.
     *   > Choose 'Base64' for frequently inserted small audio files without the need for a specific storage location.
     * - `saveUrl`: Provides the service URL responsible for handling audio file uploads and storage on the server.
     * - `path`: Specifies the storage path for audio files and the reference for displaying them.
     * - `maxFileSize`: Sets the maximum file size allowed for audio file uploads.
     *
     * @default
     * {
     *   allowedTypes: ['.wav', '.mp3', '.m4a', '.wma'],
     *   layoutOption: 'Inline',
     *   saveFormat: 'Blob',
     *   saveUrl: null,
     *   path: null,
     *   maxFileSize: 30000000
     * }
     */
    @Complex<AudioSettingsModel>({}, AudioSettings)
    public insertAudioSettings: AudioSettingsModel;

    /**
     * Specifies video insert options in the Rich Text Editor, detailing properties such as:
     * - `allowedTypes`: Allowed video file extensions as a comma-separated list (e.g., '.mp4', '.mov').
     * - `layoutOption`: Determines the display mode for videos ('Inline' or 'Break').
     * - `width`: Sets default width for inserted videos.
     * - `saveFormat`: Format for storing video files (Base64 or Blob).
     *   > Select Base64 for numerous small video inserts without defined storage requirements.
     * - `height`: Sets default height for inserted videos.
     * - `saveUrl`: URL of the service for handling video uploads and server storage.
     * - `path`: Identifies the path for storing and displaying videos.
     * - `maxFileSize`: Maximum file size allowed for video uploads.
     *
     * @default
     * {
     *   allowedTypes: ['.mp4', '.mov', '.wmv', '.avi'],
     *   layoutOption: 'Inline',
     *   width: 'auto',
     *   height: 'auto',
     *   saveFormat: 'Blob',
     *   saveUrl: null,
     *   path: null,
     *   maxFileSize: 30000000
     * }
     */
    @Complex<VideoSettingsModel>({}, VideoSettings)
    public insertVideoSettings: VideoSettingsModel;

    /**
     * Specifies the options for inserting tables in the Rich Text Editor, featuring properties like:
     * - `styles`: Automatically appends a CSS class to tables for consistent styling.
     * - `width`: Defines default table width upon insertion.
     * - `minWidth`: Sets the minimum width for inserted tables.
     * - `maxWidth`: Indicates the maximum permissible width for tables.
     * - `resize`: Enables or disables table resizing functionality.
     *
     * {% codeBlock src='rich-text-editor/table-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     *   width: '100%',
     *   styles: [
     *     { text: 'Dashed Borders', class: 'e-dashed-borders', command: 'Table', subCommand: 'Dashed' },
     *     { text: 'Alternate Rows', class: 'e-alternate-rows', command: 'Table', subCommand: 'Alternate' }
     *   ],
     *   resize: true,
     *   minWidth: 0,
     *   maxWidth: null
     * }
     */
    @Complex<TableSettingsModel>({}, TableSettings)
    public tableSettings: TableSettingsModel;

    /**
     * Keeps the toolbar fixed at the top of the Rich Text Editor during scrolling and specifies the
     * toolbar's offset from the document's top position.
     *
     * @default 0
     */
    @Property(0)
    public floatingToolbarOffset: number;

    /**
     * Configures the inline edit mode for the Rich Text Editor with the following options:
     * - `enable`: A boolean value to enable or disable the inline edit mode.
     * - `onSelection`: Determines how the toolbar is activated:
     *   - If set to `true`, the toolbar appears inline upon text selection.
     *   - If set to `false`, the toolbar opens when clicking on the target element.
     *
     * {% codeBlock src='rich-text-editor/inline-mode/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     *   enable: false,
     *   onSelection: true
     * }
     */
    @Complex<InlineModeModel>({}, InlineMode)
    public inlineMode: InlineModeModel;

    /**
     * Defines image manager options in the Rich Text Editor with the following attributes:
     * - `enable`: Boolean to enable or disable the image manager.
     * - `ajaxSettings`: Configures AJAX settings for image handling.
     * - `contextMenuSettings`: Manages context menu availability and options.
     * - `navigationPaneSettings`: Sets up the navigation pane display and contents.
     * - `toolbarSettings`: Specifies toolbar configuration and visible items.
     * - `uploadSettings`: Manages upload-specific configurations.
     *
     * @default
     * {
     *   enable: false,
     *   path: '/',
     *   ajaxSettings: { getImageUrl: null, url: null, uploadUrl: null },
     *   contextMenuSettings: {
     *     visible: true,
     *     file: ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'],
     *     folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
     *     layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll']
     *   },
     *   navigationPaneSettings: {
     *     visible: true,
     *     items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download',
     *       'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details']
     *   },
     *   toolbarSettings: { visible: true, items: ['Upload', 'NewFolder'] },
     *   uploadSettings: { autoUpload: true, minFileSize: 0, maxFileSize: 30000000, allowedExtensions: '', autoClose: false }
     * }
     */
    @Complex<FileManagerSettingsModel>({}, FileManagerSettings)
    public fileManagerSettings: FileManagerSettingsModel;

    /**
     * Specifies the width of the Rich Text Editor.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Enables or disables the persistence of the component's state between page reloads.
     * If enabled, the value of the Rich Text Editor is retained.
     *
     * {% codeBlock src='rich-text-editor/enable-persistence/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Configures whether a tooltip should be displayed for the Rich Text Editor toolbar.
     *
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * Enables or disables the resizing option in the editor.
     * When enabled, the editor can be resized by dragging the resize icon in its bottom right corner.
     *
     * {% codeBlock src='rich-text-editor/enable-resize/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableResize: boolean;

    /**
     * Allows specifying additional HTML attributes like title, name, etc.
     * Accepts multiple attributes in a key-value pair format.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Specifies the placeholder text for the content area of the RichTextEditor when it is empty.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Enables or disables the auto-save option, which performs the save action during idle states after content changes.
     * If enabled, the editor will save content in idle state based on the `saveInterval` property's value.
     * The change event is triggered if the content has been modified since the last saved state.
     *
     * @default false
     */
    @Property(false)
    public autoSaveOnIdle: boolean;

    /**
     * Disables user interactions on the component when set to true.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Indicates whether the component is enabled or disabled.
     *
     * {% codeBlock src='rich-text-editor/enabled/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Indicates whether to allow cross-site scripting (XSS) or not.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Determines if source code should be displayed in an encoded format.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlEncode: boolean;

    /**
     * Indicates whether XHTML is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableXhtml: boolean;

    /**
     * Specifies the height of the Rich Text Editor component.
     *
     * @default "auto"
     */
    @Property('auto')
    public height: string | number;

    /**
     * Specifies the CSS class name appended to the root element of the RichTextEditor.
     * Multiple custom CSS classes can be added.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;

    /**
     * Specifies the initial content to be displayed in the RichTextEditor's content area. It should be a string.
     * The editor's content can also be dynamically loaded from a database, AJAX, etc.
     *
     * {% codeBlock src='rich-text-editor/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public value: string;

    /**
     * Specifies the tag to be inserted when the enter key is pressed.
     *
     * - `P`: Pressing enter inserts a `p` tag. The default value will be `<p><br></p>`.
     * - `DIV`: Inserts a `div` tag instead of the default `P` tag.
     * - `BR`: Inserts a `br` tag instead of the default `P` tag.
     *
     * @default 'P'
     */
    @Property('P')
    public enterKey: EnterKey;

    /**
     * Specifies tags to be inserted when the Shift + Enter keys are pressed.
     *
     * - `BR` - When the Shift + Enter key is pressed, a `br` tag will be inserted, which is the default behavior.
     * - `P` - When the Shift + Enter key is pressed, a `p` tag will be inserted instead of the default `br` tag.
     * - `DIV` - When the Shift + Enter key is pressed, a `div` tag will be inserted instead of the default `br` tag.
     *
     * @default 'BR'
     */
    @Property('BR')
    public shiftEnterKey: ShiftEnterKey;

    /**
     * Specifies the number of undo history steps stored in the undo/redo manager.
     *
     * {% codeBlock src='rich-text-editor/undo-redo-steps/index.md' %}{% endcodeBlock %}
     *
     * @default 30
     */
    @Property(30)
    public undoRedoSteps: number;

    /**
     * Specifies the interval time in milliseconds for storing actions in the undo/redo manager.
     * The minimum value is 300 milliseconds.
     *
     * @default 300
     */
    @Property(300)
    public undoRedoTimer: number;

    /**
     * Defines the mode of the RichTextEditor.
     *
     * - `HTML`: Render as an HTML editor using an `<IFRAME>`, content editable `<div>`, or `<textarea>`.
     * - `Markdown`: Render as a Markdown editor using a `<textarea>`.
     *
     * @default 'HTML'
     */
    @Property('HTML')
    public editorMode: EditorMode;

    /**
     * Customizes key actions in the RichTextEditor.
     * For example, German keyboard users can customize key actions using these shortcuts.
     *
     * {% codeBlock src='rich-text-editor/keyconfig/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public keyConfig: { [key: string]: string };

    /**
     * Enables or disables the display of the character counter.
     *
     * {% codeBlock src='rich-text-editor/show-char-count/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public showCharCount: boolean;

    /**
     * Allows the tab key action in the Rich Text Editor content.
     *
     * {% codeBlock src='rich-text-editor/enable-tab-key/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableTabKey: boolean;

    /**
     * Enable `enableAutoUrl` to accept the given URL (relative or absolute) without validating the URL for hyperlinks.
     * Otherwise, the given URL will automatically convert to an absolute path URL by prefixing it with `https://` for hyperlinks.
     *
     * {% codeBlock src='rich-text-editor/enable-autourl/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableAutoUrl: boolean;

    /**
     * Specifies the maximum number of characters allowed in the Rich Text Editor.
     *
     * {% codeBlock src='rich-text-editor/max-length/index.md' %}{% endcodeBlock %}
     *
     * @default -1
     */
    @Property(-1)
    public maxLength: number;

    /**
     * Predefines a collection of paragraph styles along with quote and code styles
     * that populate the format dropdown in the toolbar.
     *
     * {% codeBlock src='rich-text-editor/format/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * default: 'Paragraph',
     * width: '65px',
     * types: [
     * { text: 'Paragraph', value: 'P'},
     * { text: 'Heading 1', value: 'H1' },
     * { text: 'Heading 2', value: 'H2' },
     * { text: 'Heading 3', value: 'H3' },
     * { text: 'Heading 4', value: 'H4' },
     * { text: 'Heading 5', value: 'H5' },
     * { text: 'Heading 6', value: 'H6' },
     * { text: 'Preformatted', value: 'Pre' }
     * ]
     * }
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;

    /**
     * Predefines advanced list types that populate the code block dropdown in the toolbar.
     *
     * {% codeBlock src='rich-text-editor/code-block/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * defaultLanguage: 'plaintext',
     * languages: [
     * { language: 'plaintext', label: 'Plain text' },
     * { language: 'c', label: 'C' },
     * { language: 'csharp', label: 'C#' },
     * { language: 'cpp', label: 'C++' },
     * { language: 'css', label: 'CSS' },
     * { language: 'diff', label: 'Diff' },
     * { language: 'html', label: 'HTML' },
     * { language: 'java', label: 'Java' },
     * { language: 'javascript', label: 'JavaScript' },
     * { language: 'php', label: 'PHP' },
     * { language: 'python', label: 'Python' },
     * { language: 'ruby', label: 'Ruby' },
     * { language: 'sql', label: 'SQL' },
     * { language: 'typescript', label: 'TypeScript' },
     * { language: 'xml', label: 'XML' }
     * ]
     * }
     */
    @Complex<CodeBlockSettingsModel>({}, CodeBlockSettings)
    public codeBlockSettings: CodeBlockSettingsModel;

    /**
     * Predefines advanced list types that populate the numberFormatList dropdown in the toolbar.
     *
     *
     * @default
     * {
     * types: [
     * { text: 'None', value: 'none' },
     * { text: 'Number', value: 'decimal' },
     * { text: 'Lower Greek', value: 'lowerGreek' },
     * { text: 'Lower Roman', value: 'lowerRoman' },
     * { text: 'Upper Alpha', value: 'upperAlpha' },
     * { text: 'Lower Alpha', value: 'lowerAlpha' },
     * { text: 'Upper Roman', value: 'upperRoman' }
     * ]
     * }
     */
    @Complex<NumberFormatListModel>({}, NumberFormatList)
    public numberFormatList: NumberFormatListModel;

    /**
     * Predefines advanced list types that populate the bulletFormatList dropdown in the toolbar.
     *
     * @default
     * {
     * types: [
     * { text: 'None', value: 'none' },
     * { text: 'Disc', value: 'disc' },
     * { text: 'Circle', value: 'circle' },
     * { text: 'Square', value: 'square' }
     * ]
     * }
     */
    @Complex<BulletFormatListModel>({}, BulletFormatList)
    public bulletFormatList: BulletFormatListModel;

    /**
     * Predefines font families that populate the font family dropdown in the toolbar.
     *
     * {% codeBlock src='rich-text-editor/font-family/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * default: 'Segoe UI',
     * width: '65px',
     * items: [
     * { text: 'Segoe UI', value: 'Segoe UI' },
     * { text: 'Arial', value: 'Arial,Helvetica,sans-serif' },
     * { text: 'Courier New', value: 'Courier New,Courier,monospace' },
     * { text: 'Georgia', value: 'Georgia,serif' },
     * { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
     * { text: 'Lucida Console', value: 'Lucida Console,Monaco,monospace' },
     * { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
     * { text: 'Times New Roman', value: 'Times New Roman,Times,serif' },
     * { text: 'Trebuchet MS', value: 'Trebuchet MS,Helvetica,sans-serif' },
     * { text: 'Verdana', value: 'Verdana,Geneva,sans-serif' }
     * ]
     * }
     */
    @Complex<FontFamilyModel>({}, FontFamily)
    public fontFamily: FontFamilyModel;

    /**
     * Defines the predefined font sizes that populate the font size dropdown in the toolbar.
     *
     * {% codeBlock src='rich-text-editor/font-size/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * default: '10pt',
     * width: '35px',
     * items: [
     * { text: '8', value: '8pt' },
     * { text: '10', value: '10pt' },
     * { text: '12', value: '12pt' },
     * { text: '14', value: '14pt' },
     * { text: '18', value: '18pt' },
     * { text: '24', value: '24pt' },
     * { text: '36', value: '36pt' }
     * ]
     * }
     */
    @Complex<FontSizeModel>({}, FontSize)
    public fontSize: FontSizeModel;

    /**
     * Defines the color palette for the font color toolbar command.
     *
     * {% codeBlock src='rich-text-editor/font-color/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * columns: 10,
     * modeSwitcher: false,
     * showRecentColors: true,
     * colorCode: {
     * 'Custom': [
     * '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
     * '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
     * '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
     * '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
     * '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
     * '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000']
     * }
     * }
     */
    @Complex<FontColorModel>({}, FontColor)
    public fontColor: FontColorModel;

    /**
     * Defines the color palette for the background color (text highlight color) toolbar command.
     *
     * {% codeBlock src='rich-text-editor/background-color/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * columns: 5,
     * modeSwitcher: false,
     * showRecentColors: true,
     * colorCode: {
     * 'Custom': ['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#0000ff', '#ff0000',
     * '#000080', '#008080', '#008000', '#800080', '#800000', '#808000',
     * '#c0c0c0', '#000000', '']
     * }
     * }
     */
    @Complex<BackgroundColorModel>({}, BackgroundColor)
    public backgroundColor: BackgroundColorModel;

    /**
     * Accepts a template design and assigns it as the content of the Rich Text Editor.
     * The built-in template engine provides options to compile a template string into an executable function.
     * For example, it supports expression evaluation similar to ES6 template string literals.
     *
     * {% codeBlock src='rich-text-editor/value-template/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public valueTemplate: string | Function;

    /**
     * Specifies the save interval in milliseconds for automatically saving the content.
     * The change event is triggered if the content changes from the last saved interval.
     *
     * {% codeBlock src='rich-text-editor/save-interval/index.md' %}{% endcodeBlock %}
     *
     * @default 10000
     */
    @Property(10000)
    public saveInterval: number;

    /**
     * This event triggers before executing a command via toolbar items.
     * Cancel this event to prevent the command from executing by setting the `cancel` argument to `true`.
     *
     * @event 'actionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionBeginEventArgs>;

    /**
     * This event triggers after executing a command via toolbar items.
     *
     * @event 'actionComplete'
     */
    @Event()
    public actionComplete: EmitType<ActionCompleteEventArgs>;

    /**
     * This event triggers before a dialog is opened.
     * Cancel this event to prevent the dialog from opening by setting the `cancel` argument to `true`.
     *
     * @event 'beforeDialogOpen'
     */
    @Event()
    public beforeDialogOpen: EmitType<BeforeOpenEventArgs>;

    /**
     * This event triggers when a dialog is opened.
     *
     * @event 'dialogOpen'
     */
    @Event()
    public dialogOpen: EmitType<Object>;

    /**
     * This event triggers before a dialog is closed.
     * Cancel this event to prevent the dialog from closing by setting the `cancel` argument to `true`.
     *
     * @event 'beforeDialogClose'
     */
    @Event()
    public beforeDialogClose: EmitType<BeforeCloseEventArgs>;

    /**
     * This event triggers after a dialog has been closed.
     *
     * @event 'dialogClose'
     */
    @Event()
    public dialogClose: EmitType<Object>;

    /**
     * This event triggers before the quick toolbar opens.
     *
     * @event 'beforeQuickToolbarOpen'
     */
    @Event()
    public beforeQuickToolbarOpen: EmitType<BeforeQuickToolbarOpenArgs>;

    /**
     * This event triggers when the quick toolbar is opened.
     *
     * @event 'quickToolbarOpen'
     */
    @Event()
    public quickToolbarOpen: EmitType<Object>;

    /**
     * This event triggers after the quick toolbar has been closed.
     *
     * @event 'quickToolbarClose'
     */
    @Event()
    public quickToolbarClose: EmitType<Object>;

    /**
     * This event is deprecated and no longer works. Use the `updatedToolbarStatus` event for undo/redo status.
     *
     * @deprecated
     * @event 'toolbarStatusUpdate'
     */
    @Event()
    public toolbarStatusUpdate: EmitType<Object>;

    /**
     * This event triggers when the toolbar items status is updated.
     *
     * @event 'updatedToolbarStatus'
     */
    @Event()
    public updatedToolbarStatus: EmitType<ToolbarStatusEventArgs>;

    /**
     * This event triggers when an image is selected or dragged into the insert image dialog.
     *
     * @event 'imageSelected'
     */
    @Event()
    public imageSelected: EmitType<SelectedEventArgs>;

    /**
     * This event triggers before the image upload process starts.
     *
     * @event 'beforeImageUpload'
     */
    @Event()
    public beforeImageUpload: EmitType<BeforeUploadEventArgs>;

    /**
     * This event triggers when an image upload begins in the insert image dialog.
     * It provides access to the upload details through the event arguments.
     *
     * @event 'imageUploading'
     */
    @Event()
    public imageUploading: EmitType<UploadingEventArgs>;
    /**
     * This event triggers when an image has been successfully uploaded to the server side.
     *
     * @event 'imageUploadSuccess'
     */
    @Event()
    public imageUploadSuccess: EmitType<ImageSuccessEventArgs>;

    /**
     * This event triggers when there is an error during image upload.
     *
     * @event 'imageUploadFailed'
     */
    @Event()
    public imageUploadFailed: EmitType<ImageFailedEventArgs>;

    /**
     * This event triggers when a selected image is removed from the insert image dialog.
     *
     * @event 'imageRemoving'
     */
    @Event()
    public imageRemoving: EmitType<RemovingEventArgs>;

    /**
     * This event triggers when a selected image is removed from the Rich Text Editor content.
     *
     * @event 'afterImageDelete'
     */
    @Event()
    public afterImageDelete: EmitType<AfterImageDeleteEventArgs>;

    /**
     * This event triggers when media is selected or dragged into the insert media audio/video dialog.
     *
     * @event 'fileSelected'
     */
    @Event()
    public fileSelected: EmitType<SelectedEventArgs>;

    /**
     * This event triggers before the media audio/video upload process starts.
     *
     * @event 'beforeFileUpload'
     */
    @Event()
    public beforeFileUpload: EmitType<BeforeUploadEventArgs>;

    /**
     * This event triggers when media begins uploading in the insert media audio/video dialog.
     *
     * @event 'fileUploading'
     */
    @Event()
    public fileUploading: EmitType<UploadingEventArgs>;

    /**
     * This event triggers when media has been successfully uploaded to the server side.
     *
     * @event 'fileUploadSuccess'
     */
    @Event()
    public fileUploadSuccess: EmitType<Object>;

    /**
     * This event triggers when there is an error during media upload.
     *
     * @event 'fileUploadFailed'
     */
    @Event()
    public fileUploadFailed: EmitType<Object>;

    /**
     * This event triggers when selected media is removed from the insert audio/video dialog.
     *
     * @event 'fileRemoving'
     */
    @Event()
    public fileRemoving: EmitType<RemovingEventArgs>;

    /**
     * This event triggers when selected media is removed from the Rich Text Editor content.
     *
     * @event 'afterMediaDelete'
     */
    @Event()
    public afterMediaDelete: EmitType<AfterMediaDeleteEventArgs>;

    /**
     * This event triggers when the Rich Text Editor is rendered.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * This event triggers when the Rich Text Editor is destroyed.
     *
     * @event 'destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * This event triggers before sanitizing the value. Applicable only when `editorMode` is `HTML`.
     *
     * @event 'beforeSanitizeHtml'
     */
    @Event()
    public beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * This event triggers when the Rich Text Editor loses focus.
     *
     * @event 'blur'
     */
    @Event()
    public blur: EmitType<Object>;

    /**
     * This event triggers when a Rich Text Editor toolbar item is clicked.
     *
     * @event 'toolbarClick'
     */
    @Event()
    public toolbarClick: EmitType<Object>;

    /**
     * This event triggers when the Rich Text Editor gains focus.
     *
     * @event 'focus'
     */
    @Event()
    public focus: EmitType<Object>;

    /**
     * This event triggers when the Rich Text Editor loses focus and changes have been made to the content.
     *
     * @event 'change'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * This event triggers when resizing elements such as tables, images, videos, and the overall Rich Text Editor.
     *
     * @event 'resizing'
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * This event triggers when resizing starts for various elements including tables, images, videos, and the overall editor.
     *
     * @event 'resizeStart'
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * This event triggers when resizing stops for various elements including tables, images, videos, and the overall editor.
     *
     * @event 'resizeStop'
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * This event triggers before cleaning up copied content.
     *
     * @event 'beforePasteCleanup'
     */
    @Event()
    public beforePasteCleanup: EmitType<PasteCleanupArgs>;

    /**
     * This event triggers after cleaning up copied content.
     *
     * @event 'afterPasteCleanup'
     */
    @Event()
    public afterPasteCleanup: EmitType<object>;

    /**
     * This event triggers before an image is dropped.
     *
     * @event 'beforeImageDrop'
     */
    @Event()
    public beforeImageDrop: EmitType<ImageDropEventArgs>;

    /**
     * This event triggers before a media is dropped.
     *
     * @event 'beforeMediaDrop'
     */
    @Event()
    public beforeMediaDrop: EmitType<MediaDropEventArgs>;

    /**
     * Customize the `keyCode` to change the key value.
     *
     * {% codeBlock src='rich-text-editor/formatter/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public formatter: IFormatter;

    /**
     * This event triggers when a slash menu item in the popup is selected by the user using mouse, tap, or keyboard navigation.
     *
     * @event 'slashMenuItemSelect'
     */
    @Event()
    public slashMenuItemSelect: EmitType<SlashMenuItemSelectArgs>;

    /**
     * This event triggers when a non-empty text selection is made or updated in the Rich Text Editor.
     * Fires in both HTML and Markdown modes, providing detailed information about the current selection.
     *
     * {% codeBlock src='rich-text-editor/selectionChanged/index.md' %}{% endcodeBlock %}
     *
     * @event 'selectionChanged'
     */
    @Event()
    public selectionChanged: EmitType<SelectionChangedEventArgs>;

    public keyboardModule: KeyboardEvents;
    public localeObj: L10n;
    public valueContainer: HTMLTextAreaElement;
    private originalElement: HTMLElement;
    private clickPoints: { [key: string]: number };
    private initialValue: string;
    private isCopyAll: boolean;
    private isPlainPaste: boolean = false;
    private isSelecting: boolean;
    private isSelectionStartInRTE: boolean;
    private selectionTimeout: number;
    private previousRange: Range | null;

    public constructor(options?: RichTextEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.needsID = true;
        this.isCopyAll = false;
        this.isSelecting = false;
        this.isSelectionStartInRTE = false;
    }
    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} - specifies the declaration.
     * @hidden
     * @deprecated
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.toolbarSettings.enable) {
            modules.push(
                { member: 'toolbar', args: [this, this.serviceLocator] }
            );
            if (this.quickToolbarSettings.enable) {
                modules.push(
                    { member: 'quickToolbar', args: [this, this.serviceLocator] }
                );
            }
        }
        if (this.editorMode === 'HTML' && this.slashMenuSettings.enable) {
            modules.push(
                { member: 'slashMenu', args: [this, this.serviceLocator] }
            );
        }
        if (this.showCharCount) {
            modules.push(
                { member: 'count', args: [this, this.serviceLocator] }
            );
        }
        if (this.editorMode === 'Markdown') {
            modules.push(
                { member: 'markdownEditor', args: [this, this.serviceLocator] }
            );
        }
        modules.push({
            member: 'link',
            args: [this, this.serviceLocator]
        });
        modules.push({
            member: 'table',
            args: [this, this.serviceLocator]
        });
        modules.push({
            member: 'image',
            args: [this, this.serviceLocator]
        });
        if (this.editorMode === 'HTML') {
            modules.push({
                member: 'audio',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'video',
                args: [this, this.serviceLocator]
            });
            modules.push(
                { member: 'htmlEditor', args: [this, this.serviceLocator] }
            );
            modules.push(
                { member: 'pasteCleanup', args: [this, this.serviceLocator] }
            );
            modules.push(
                { member: 'importExport', args: [this, this.serviceLocator] }
            );
            modules.push({
                member: 'formatPainter',
                args: [this]
            });
            modules.push({
                member: 'emojiPicker',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'codeBlock',
                args: [this, this.serviceLocator]
            });
        }
        if (this.fileManagerSettings.enable) {
            modules.push(
                { member: 'fileManager', args: [this, this.serviceLocator] }
            );
        }
        if (this.enableResize) {
            modules.push(
                { member: 'resize', args: [this] }
            );
        }
        return modules;
    }
    private updateEnable(): void {
        if (this.enabled) {
            removeClass([this.element], classes.CLS_DISABLED);
            this.element.setAttribute('aria-disabled', 'false');
            if (!isNOU(this.htmlAttributes.tabindex)) {
                this.inputElement.setAttribute('tabindex', this.htmlAttributes.tabindex);
            } else {
                this.inputElement.setAttribute('tabindex', '0');
            }
        } else {
            if (this.getToolbar()) {
                removeClass(this.getToolbar().querySelectorAll('.' + classes.CLS_ACTIVE), classes.CLS_ACTIVE);
                removeClass([this.getToolbar().parentElement], [classes.CLS_TB_FLOAT]);
            }
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    }
    /**
     * setEnable method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setEnable(): void {
        this.updateEnable();
        // eslint-disable-next-line
        (this.enabled) ? this.eventInitializer() : this.unWireEvents();
    }
    private initializeValue(): void {
        this.isFocusOut = false;
        this.isRTE = false;
        this.isBlur = true;
        this.defaultResetValue = null;
        this.isResizeInitialized = false;

    }

    /**
     * For internal use only - Initialize the event handler;
     *
     * @returns {void}
     * @hidden
     * @private
     */
    protected preRender(): void {
        this.initializeValue();
        this.clickPoints = { clientX: 0, clientY: 0 };
        this.initialValue = this.value;
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setContainer();
        this.persistData();
        setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        attributes(this.element, { role: 'application', 'aria-label': 'Rich Text Editor' });
        this.beforeRenderClassValue = this.element.getAttribute('class');
    }

    private persistData(): void {
        if (this.enablePersistence && this.originalElement.tagName === 'TEXTAREA') {
            this.element.id = this.originalElement.id + '_wrapper';
            const data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNOU(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    }

    private setContainer(): void {
        this.originalElement = this.element.cloneNode(true) as HTMLElement;
        if (this.value === null || this.valueTemplate !== null) {
            this.setValue();
        }
        if (this.element.hasAttribute('tabindex')) {
            this.htmlAttributes = { 'tabindex': this.element.getAttribute('tabindex') };
            this.element.removeAttribute('tabindex');
        }
        this.element.innerHTML = '';
        const invalidAttr: string[] = ['class', 'style', 'id', 'ejs-for'];
        const htmlAttr: { [key: string]: string } = {};
        for (let a: number = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a as number].name) === -1 &&
                !(/^data-val/.test(this.element.attributes[a as number].name))) { // data-val for asp.net core data annotation validation.
                htmlAttr[this.element.attributes[a as number].name] = this.element.getAttribute(this.element.attributes[a as number].name);
            }
        }
        extend(htmlAttr, this.htmlAttributes, htmlAttr);
        this.setProperties({ htmlAttributes: htmlAttr }, true);
        if (!isNOU(this.htmlAttributes.id)) {
            this.element.id = this.htmlAttributes.id;
        }
        this.internalID = this.element.id;
        if (this.element.tagName === 'TEXTAREA') {
            const rteOuterWrapper: HTMLElement = this.createElement('div', {
                className: this.element.getAttribute('class')
            }) as HTMLElement;
            this.element.innerHTML = '';
            this.element.parentElement.insertBefore(rteOuterWrapper, this.element);
            this.valueContainer = this.element as HTMLTextAreaElement;
            removeClass([this.valueContainer], this.element.getAttribute('class').split(' '));
            this.element = rteOuterWrapper;
        } else {
            this.valueContainer = this.createElement('textarea', {
                id: this.getID() + '-value',
                attrs: { 'aria-labelledby': this.getID() }
            }) as HTMLTextAreaElement;
        }
        this.valueContainer.name = this.getID();
        addClass([this.valueContainer], classes.CLS_RTE_HIDDEN);
        if (!isNOU(this.cssClass)) {
            const currentClassList: string[] = this.cssClass.split(' ');
            for (let i: number = 0; i < currentClassList.length; i++) {
                addClass([this.valueContainer], currentClassList[i as number]);
            }
        }
        this.rootContainer = this.createElement('div', { className: classes.CLS_RTE_CONTAINER, attrs: { 'role': 'presentation' } });
        this.element.appendChild(this.rootContainer);
        this.rootContainer.appendChild(this.valueContainer);
    }

    /**
     * getPersistData method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getPersistData(): string {
        return this.addOnPersist(['value']);
    }
    /**
     * Focuses the Rich Text Editor component.
     *
     * @returns {void}
     * @public
     */
    public focusIn(): void {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({} as FocusEvent);
            this.notify(events.toolbarRefresh, {});
        }
    }

    /**
     * Blurs the Rich Text Editor component, removing focus.
     *
     * @returns {void}
     * @public
     */
    public focusOut(): void {
        if (this.enabled) {
            this.inputElement.blur();
            this.blurHandler({} as FocusEvent);
        }
    }

    /**
     * Selects all content within the RichTextEditor.
     *
     * @returns {void}
     * @public
     */
    public selectAll(): void {
        this.notify(events.selectAll, {});
    }

    /**
     * Selects a specific content range or element.
     *
     * @param {Range} range - Specify the range you want to select within the content.
     * This method is used to select a particular sentence, word, or the entire document.
     *
     * @returns {void}
     * @public
     */
    public selectRange(range: Range): void {
        this.notify(events.selectRange, { range: range });
    }

    /**
     * Retrieves the HTML markup from the currently selected content in RichTextEditor.
     *
     * @returns {string} - Returns the HTML string of selected content.
     * @public
     */
    public getSelection(): string {
        let str: string = '';
        this.notify(events.getSelectedHtml, {
            callBack: (txt: string): void => {
                str = txt;
            }
        });
        return str;
    }
    /**
     * Displays the emoji picker. If coordinates are provided, it positions the picker at those locations.
     *
     * @param {number} x - The x-axis position for the emoji picker.
     * @param {number} y - The y-axis position for the emoji picker.
     * @returns {void}
     * @public
     */
    public showEmojiPicker(x?: number, y?: number): void {
        if (this.readonly) {
            return;
        }
        this.notify(events.emojiPicker, { x, y });
    }
    /**
     * Executes a specified command within the rich text editor, optionally utilizing additional parameters to tailor execution.
     *
     * @returns {void}
     * @param {CommandName} commandName - The name of the command to be executed, such as 'importWord', 'insertHTML', and others.
     * @param {string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel | IAudioCommandsArgs | IVideoCommandsArgs} value
     * - An optional parameter that supplies the necessary value relevant to the command. This could be a string, an HTMLElement, or specific argument types like ILinkCommandsArgs, etc., contingent on the command requirements.
     * @param {ExecuteCommandOption} option - Specifies additional options for executing the command, such as enabling features like undo functionality.
     * @public
     */
    public executeCommand(
        commandName: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel | IAudioCommandsArgs
        | IVideoCommandsArgs | ICodeBlockCommandsArgs, option?: ExecuteCommandOption): void {
        if (commandName === 'importWord') {
            const importContainer: HTMLElement = this.createElement('div');
            importContainer.innerHTML = value as string;
            const tableElement: NodeListOf<HTMLElement> = importContainer.querySelectorAll('table:not(.e-rte-table):not(.e-rte-paste-table)');
            for (let i: number = 0; i < tableElement.length; i++) {
                tableElement[i as number].classList.add('e-rte-paste-table');
            }
            value = importContainer.innerHTML;
            importContainer.remove();
            commandName = 'insertHTML';
        }
        value = this.htmlPurifier(commandName, value);
        let internalValue: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel | IFormatPainterArgs |
        ICodeBlockCommandsArgs | IListCommandArgs;
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            const toFocus: boolean = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        const tool: IExecutionGroup = executeGroup[`${commandName}`];
        if (option && option.undo) {
            if (option.undo && this.formatter.getUndoRedoStack().length === 0) {
                this.formatter.saveData();
            }
        }
        if (this.maxLength !== -1 && !isNOU(tool.command)) {
            let currentInsertContentLength: number = 0;
            if (tool.command === 'Links') {
                currentInsertContentLength = (value as ILinkCommandsArgs).text.length === 0 ?
                    (value as ILinkCommandsArgs).url.length : (value as ILinkCommandsArgs).text.length;
            }
            if (tool.command === 'Images' || tool.command === 'Table' || tool.command === 'Files') {
                currentInsertContentLength = 1;
            }
            if (tool.command === 'InsertHTML') {
                if (!isNOU(value)) {
                    const tempElem: HTMLElement = this.createElement('div');
                    tempElem.innerHTML = value;
                    currentInsertContentLength = tempElem.textContent.length;
                } else if (!isNOU(tool.value) && (tool.value === '<hr/>' || tool.value === '<br/>')) {
                    currentInsertContentLength = 1;
                }
            }
            if (tool.command === 'InsertText') {
                currentInsertContentLength = value.length;
            }
            const currentLength: number = this.getText().trim().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
            const selectionLength: number = this.getSelection().length;
            const totalLength: number = (currentLength - selectionLength) + currentInsertContentLength;
            if (!(this.maxLength === -1 || totalLength <= this.maxLength)) {
                return;
            }
        }
        internalValue = value;
        if (tool.command === 'FormatPainter') {
            if (!isNOU(value)) {
                this.formatPainterSettings = value as FormatPainterSettingsModel;
            }
            internalValue = {
                formatPainterAction: tool.value
            };
        }
        if (tool.command === 'CodeBlock' && !isNOU(value)) {
            (value as ICodeBlockItem).action = 'createCodeBlock';
        }
        if ((tool.subCommand === 'NumberFormatList' || tool.subCommand === 'BulletFormatList')) {
            internalValue = { listStyle: value, type: tool.subCommand };
        }
        this.formatter.editorManager.execCommand(
            tool.command,
            tool.subCommand ? tool.subCommand : (internalValue ? internalValue : tool.value),
            null,
            null,
            (internalValue ? internalValue : tool.value),
            (internalValue ? internalValue : (tool.value === 'UL' || tool.value === 'OL') ? null : tool.value),
            null,
            this.enterKey
        );
        scrollToCursor(this.contentModule.getDocument(), this.inputElement);
        if (option && option.undo) {
            this.formatter.saveData();
            this.formatter.enableUndo(this);
        }
        this.setPlaceHolder();
        this.notify(events.contentChanged, {});
    }
    private htmlPurifier(
        command: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel | ICodeBlockCommandsArgs): string {
        if (this.editorMode === 'HTML') {
            switch (command) {
            case 'insertHTML':
                if (this.enableHtmlSanitizer) {
                    if (typeof value === 'string') {
                        value = value.replace(/&(times|divide|ne)/g, '&amp;amp;$1');
                        value = this.htmlEditorModule.sanitizeHelper(value);
                    } else {
                        value = this.htmlEditorModule.sanitizeHelper((value as HTMLElement).outerHTML);
                    }
                }
                break;
            case 'insertTable':
                if (isNOU((value as { [key: string]: object }).width)) {
                    (value as { [key: string]: object }).width = {
                        minWidth: this.tableSettings.minWidth,
                        maxWidth: this.tableSettings.maxWidth, width: this.tableSettings.width
                    };
                }
                break;
            case 'insertImage': {
                const temp: HTMLElement = this.createElement('img', {
                    attrs: {
                        src: (value as IImageCommandsArgs).url as string
                    }
                });
                let imageValue: string = temp.outerHTML;
                if (this.enableHtmlSanitizer) {
                    imageValue = this.htmlEditorModule.sanitizeHelper(temp.outerHTML);
                }
                let url: string = (imageValue !== '' && (this.createElement('div', {
                    innerHTML: imageValue
                }).firstElementChild).getAttribute('src')) || null;
                url = !isNOU(url) ? url : '';
                (value as IImageCommandsArgs).url = url;
                if (isNOU((value as { [key: string]: object }).width)) {
                    (value as { [key: string]: object }).width = {
                        minWidth: this.insertImageSettings.minWidth,
                        maxWidth: this.insertImageSettings.maxWidth, width: this.insertImageSettings.width
                    };
                }
                if (isNOU((value as { [key: string]: object }).height)) {
                    (value as { [key: string]: object }).height = {
                        minHeight: this.insertImageSettings.minHeight,
                        maxHeight: this.insertImageSettings.maxHeight, height: this.insertImageSettings.height
                    };
                }
                break;
            }
            case 'insertAudio': {
                const wrapTemp: HTMLElement = this.createElement('audio', {
                    attrs: {
                        controls: ''
                    }
                });
                const temp: HTMLElement = this.createElement('source', {
                    attrs: {
                        src: (value as IAudioCommandsArgs).url as string,
                        type: (value as IAudioCommandsArgs).url && (value as IAudioCommandsArgs).url.split('.').length > 0
                            ? 'audio/' + (value as IAudioCommandsArgs).url.split('.')[(value as IAudioCommandsArgs).url.split('.').length - 1] : ''
                    }
                });
                wrapTemp.appendChild(temp);
                let audioValue: string = wrapTemp.outerHTML;
                if (this.enableHtmlSanitizer) {
                    audioValue = this.htmlEditorModule.sanitizeHelper(wrapTemp.outerHTML);
                }
                let url: string = (audioValue !== '' && (this.createElement('div', {
                    innerHTML: audioValue
                }).firstElementChild.firstElementChild).getAttribute('src')) || null;
                url = !isNOU(url) ? url : '';
                (value as IAudioCommandsArgs).url = url;
                break;
            }
            case 'insertVideo': {
                const wrapTemp: HTMLElement = this.createElement('video', {
                    attrs: {
                        controls: ''
                    }
                });
                const temp: HTMLElement = this.createElement('source', {
                    attrs: {
                        src: (value as IVideoCommandsArgs).url as string,
                        type: (value as IVideoCommandsArgs).url && (value as IVideoCommandsArgs).url.split('.').length > 0
                            ? 'video/' + (value as IVideoCommandsArgs).url.split('.')[(value as IVideoCommandsArgs).url.split('.').length - 1] : ''
                    }
                });
                wrapTemp.appendChild(temp);
                let audioValue: string = wrapTemp.outerHTML;
                if (this.enableHtmlSanitizer) {
                    audioValue = this.htmlEditorModule.sanitizeHelper(temp.outerHTML);
                }
                let url: string = (audioValue !== '' && (this.createElement('div', {
                    innerHTML: audioValue
                }).firstElementChild).getAttribute('src')) || null;
                url = !isNOU(url) ? url : '';
                (value as IVideoCommandsArgs).url = url;
                if (isNOU((value as { [key: string]: object }).width)) {
                    (value as { [key: string]: object }).width = {
                        minWidth: this.insertVideoSettings.minWidth,
                        maxWidth: this.insertVideoSettings.maxWidth, width: this.insertVideoSettings.width
                    };
                }
                if (isNOU((value as { [key: string]: object }).height)) {
                    (value as { [key: string]: object }).height = {
                        minHeight: this.insertVideoSettings.minHeight,
                        maxHeight: this.insertVideoSettings.maxHeight, height: this.insertVideoSettings.height
                    };
                }
                break;
            }
            case 'createLink': {
                const tempNode: HTMLElement = this.createElement('a', {
                    attrs: {
                        href: (value as ILinkCommandsArgs).url as string
                    }
                });
                let linkValue: string = tempNode.outerHTML;
                if (this.enableHtmlSanitizer) {
                    linkValue = this.htmlEditorModule.sanitizeHelper(tempNode.outerHTML);
                }
                let href: string = (linkValue !== '' && (this.createElement('div', {
                    innerHTML: linkValue
                }).firstElementChild).getAttribute('href')) || null;
                href = !isNOU(href) ? href : '';
                (value as ILinkCommandsArgs).url = href;
                break;
            }
            }
        }
        return value as string;
    }

    private encode(value: string): string {
        const divNode: HTMLElement = this.createElement('div');
        divNode.innerText = value.trim();
        // eslint-disable-next-line
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }

    /**
     * For internal use only - To Initialize the component rendering.
     *
     * @returns {void}
     * @private
     * @deprecated
     */
    protected render(): void {
        this.setProperties({ value: this.replaceEntities(this.value) }, true);
        if (this.value && !this.valueTemplate) {
            this.setProperties({ value: this.serializeValue(this.value) }, true);
        }
        this.value = (!(this.editorMode === 'Markdown') && !isNOU(this.value)) ? this.addAnchorAriaLabel(this.value) : this.value;
        this.renderModule = new Render(this, this.serviceLocator);
        this.sourceCodeModule = new ViewSource(this, this.serviceLocator);
        this.notify(events.initialLoad, {});
        this.trigger(events.load);
        this.RTERender();
        // eslint-disable-next-line
        const execCommandCallBack: ExecCommandCallBack = new ExecCommandCallBack(this);
        if (this.element.dataset.rteUnitTesting === 'true') {
            this.userAgentData = new CustomUserAgentData(Browser.userAgent, true);
        } else {
            this.userAgentData = new CustomUserAgentData(Browser.userAgent, false);
        }
        this.notify(events.initialEnd, {});
        if (this.enableXhtml) {
            this.value = getStructuredHtml(cleanHTMLString(this.value, this.element), this.enterKey, this.enableHtmlEncode);
            this.setProperties({ value: this.getXhtml() });
        }
        if (this.toolbarSettings.enable && (this.toolbarSettings.type === 'Expand' || this.toolbarSettings.type === 'MultiRow' || this.toolbarSettings.type === 'Scrollable') && !isNOU(this.getToolbar()) &&
            (this.toolbarSettings.items.indexOf('Undo') > -1 && this.toolbarSettings.items.indexOf('Redo') > -1)) {
            this.disableToolbarItem(['Undo', 'Redo']);
        }
        if (this.value !== null) {
            this.valueContainer.defaultValue = this.value;
        }
        // eslint-disable-next-line
        (this.enabled && !this.readonly) ? this.eventInitializer() : this.unWireEvents();
        this.notify(events.bindCssClass, { cssClass: this.getCssClass() });
        this.addAudioVideoWrapper();
        this.notify(events.tableclass, {});
        this.autoResize();
        this.renderComplete();
    }

    /**
     * addAudioVideoWrapper method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addAudioVideoWrapper(): void {
        let insertElem: HTMLElement;
        const audioElm: NodeListOf<HTMLElement> = this.element.querySelectorAll('audio');
        for (let i: number = 0; i < audioElm.length; i++) {
            if (!audioElm[i as number].classList.contains('e-rte-audio')) {
                audioElm[i as number].classList.add('e-rte-audio');
                audioElm[i as number].classList.add(classes.CLS_AUDIOINLINE);
            }
            // eslint-disable-next-line max-len
            if (!audioElm[i as number].parentElement.classList.contains(classes.CLS_CLICKELEM) && !audioElm[i as number].parentElement.classList.contains(classes.CLS_AUDIOWRAP)) {
                const audioWrapElem: HTMLElement = this.createElement('span', { className: classes.CLS_AUDIOWRAP });
                const csstext: string = 'width:300px; margin:0 auto;';
                updateCSSText(audioWrapElem, csstext);
                audioWrapElem.contentEditable = 'false';
                const audioInnerWrapElem: HTMLElement = this.createElement('span', { className: classes.CLS_CLICKELEM });
                audioWrapElem.appendChild(audioInnerWrapElem);
                audioElm[i as number].parentNode.insertBefore(audioWrapElem, audioElm[i as number].nextSibling);
                audioInnerWrapElem.appendChild(audioElm[i as number]);
                if (audioWrapElem.nextElementSibling === null) {
                    insertElem = this.createElement('br');
                    audioWrapElem.parentNode.insertBefore(insertElem, audioWrapElem.nextSibling);
                }
            }
        }
        const videoElm: NodeListOf<HTMLElement> = this.element.querySelectorAll('video');
        for (let i: number = 0; i < videoElm.length; i++) {
            if (!videoElm[i as number].classList.contains('e-rte-video')) {
                videoElm[i as number].classList.add('e-rte-video');
                videoElm[i as number].classList.add(classes.CLS_VIDEOINLINE);
            }
            // eslint-disable-next-line max-len
            if (!videoElm[i as number].parentElement.classList.contains(classes.CLS_CLICKELEM) && !videoElm[i as number].parentElement.classList.contains(classes.CLS_VIDEOWRAP)) {
                const videoWrapElem: HTMLElement = this.createElement('span', { className: classes.CLS_VIDEOWRAP });
                videoWrapElem.contentEditable = 'false';
                videoElm[i as number].parentNode.insertBefore(videoWrapElem, videoElm[i as number].nextSibling);
                videoWrapElem.appendChild(videoElm[i as number]);
                if (videoWrapElem.nextElementSibling === null) {
                    insertElem = this.createElement('br');
                    videoWrapElem.parentNode.insertBefore(insertElem, videoWrapElem.nextSibling);
                }
            }
            if (Browser.userAgent.indexOf('Firefox') !== -1) {
                // eslint-disable-next-line
                videoElm[i as number].addEventListener('play', (args) => {
                    this.notify(events.mouseDown, { args: args });
                    this.notify('editAreaClick', { args: args });
                });
                // eslint-disable-next-line
                videoElm[i as number].addEventListener('pause', (args) => {
                    this.notify(events.mouseDown, { args: args });
                    this.notify('editAreaClick', { args: args });
                });
            }
        }
    }

    /**
     * For internal use only - Initialize the event handler
     *
     * @returns {void}
     * @private
     * @deprecated
     * @hidden
     */
    protected eventInitializer(): void {
        this.wireEvents();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public cleanList(e: KeyboardEvent): void {
        const range: Range = this.getRange();
        const currentStartContainer: Node = range.startContainer;
        const currentEndContainer: Node = range.endContainer;
        const currentStartOffset: number = range.startOffset;
        const isSameContainer: boolean = currentStartContainer === currentEndContainer ? true : false;
        // eslint-disable-next-line
        const currentEndOffset: number = currentEndContainer.textContent.length;
        const endNode: Element = range.endContainer.nodeName === '#text' ? range.endContainer.parentElement :
            range.endContainer as Element;
        const closestLI: Element = closest(endNode, 'LI');
        let isDetached: boolean = false;
        let currentRangeEndOffset: number = range.endOffset;
        if (currentEndContainer.nodeType === Node.TEXT_NODE) {
            if (currentEndContainer.textContent.charAt(currentRangeEndOffset - 1) === '\uFEFF') {
                currentRangeEndOffset--;
            }
        }
        if (!isNOU(closestLI) && endNode.textContent.trim().length === currentRangeEndOffset &&
            !range.collapsed && isNOU(endNode.nextElementSibling) && !endNode.classList.contains(classes.CLS_IMG_INNER)) {
            for (let i: number = 0; i < closestLI.childNodes.length; i++) {
                if (closestLI.childNodes[i as number].nodeName === '#text' && closestLI.childNodes[i as number].textContent.trim().length === 0) {
                    detach(closestLI.childNodes[i as number]);
                    isDetached = true;
                    i--;
                }
            }
            let currentLastElem: Element = closestLI;
            while (currentLastElem.lastChild !== null && currentLastElem.nodeName !== '#text') {
                currentLastElem = currentLastElem.lastChild as Element;
            }
            if (isDetached) {
                const currentLast: Node = currentLastElem.nodeName === 'BR' && !isNOU(currentLastElem.previousSibling) ?
                    currentLastElem.previousSibling : currentLastElem;
                this.formatter.editorManager.nodeSelection.setSelectionText(
                    this.contentModule.getDocument(),
                    isSameContainer ? currentLast : currentStartContainer,
                    currentLast, currentStartOffset,
                    (currentLast.nodeName === 'BR' ? 0 : currentLast.textContent.length));
            }
        }
    }

    /**
     * For internal use only - keydown the event handler;
     *
     * @param {KeyboardEvent} e - specifies the event.
     * @returns {void}
     * @private
     * @deprecated
     * @hidden
     */
    public keyDown(e: KeyboardEvent): void {
        this.isSelectionStartInRTE = true;
        const isMacDev: boolean = this.userAgentData.getPlatform() === 'macOS';
        if (((e.ctrlKey || (e.metaKey && isMacDev)) && e.shiftKey && e.keyCode === 86) ||
            (e.metaKey && isMacDev && e.altKey && e.shiftKey && e.keyCode === 86)) {
            this.isPlainPaste = true;
        }
        if (this.inputElement.classList.contains('e-mention')) {
            const mentionPopup: HTMLElement = this.element.ownerDocument.getElementById(this.inputElement.id + '_popup');
            const slashMenuPopup: HTMLElement = this.element.ownerDocument.getElementById(this.inputElement.id + '_slash_menu_popup');
            const mentionKeys: string[] = mentionRestrictKeys;
            const isMentionKeys: boolean = mentionKeys.indexOf(e.key) !== -1;
            const isMentionPopupOpen: boolean = mentionPopup && mentionPopup.classList.contains('e-popup-open');
            const isSlashMenuPopupOpen: boolean = slashMenuPopup && slashMenuPopup.classList.contains('e-popup-open');
            if (isMentionKeys && (isMentionPopupOpen || isSlashMenuPopupOpen)) {
                return;
            }
        }
        if (this.editorMode === 'HTML' && !isNOU(this.codeBlockModule)) {
            const rangeForCodeBlock: Range = this.getRange();
            if (this.formatter.editorManager.codeBlockObj.isActionDisallowedInCodeBlock(e, rangeForCodeBlock)) {
                e.preventDefault();
                return;
            }
        }
        if (this.enableTabKey) {
            if (this.quickToolbarModule && !e.altKey && e.key !== 'F10' && (e as KeyboardEventArgs).action !== 'toolbar-focus') {
                this.quickToolbarModule.hideQuickToolbars();
            }
            const isImageResize: boolean = this.imageModule && this.imageModule.imgResizeDiv ? true : false;
            const isVideoResize: boolean = this.videoModule && this.videoModule.vidResizeDiv ? true : false;
            if (isImageResize) {
                this.imageModule.cancelResizeAction();
            }
            if (isVideoResize) {
                this.videoModule.cancelResizeAction();
            }
        }
        let isCodeBlockEnter: boolean = false;
        if (!isNOU(this.codeBlockModule)) {
            const range: Range = this.getRange();
            isCodeBlockEnter = this.formatter.editorManager.codeBlockObj.isCodeBlockEnterAction(range, e);
        }
        this.notify(events.keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.editorMode === 'HTML') {
            this.cleanList(e);
        }
        if (this.editorMode === 'HTML' && ((e.which === 8 && e.code === 'Backspace') || (e.which === 46 && e.code === 'Delete'))) {
            const range: Range = this.getRange();
            const startNode: Element = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement :
                range.startContainer as Element;
            if (closest(startNode, 'pre') &&
                (e.which === 8 && range.startContainer.textContent.charCodeAt(range.startOffset - 1) === 8203) ||
                (e.which === 46 && range.startContainer.textContent.charCodeAt(range.startOffset) === 8203)) {
                const regEx: RegExp = new RegExp('\u200B', 'g');
                const pointer: number = e.which === 8 ? range.startOffset - 1 : range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.contentModule.getDocument(), range.startContainer as Element, pointer);
            } else if ((e.code === 'Backspace' && e.which === 8) &&
                range.startContainer.textContent.charCodeAt(0) === 8203 && range.collapsed) {
                const parentEle: Element = range.startContainer.parentElement;
                let index: number;
                let i: number;
                for (i = 0; i < parentEle.childNodes.length; i++) {
                    if (parentEle.childNodes[i as number] === range.startContainer) {
                        index = i;
                    }
                }
                let bool: boolean = true;
                const removeNodeArray: number[] = [];
                for (i = index; i >= 0; i--) {
                    // eslint-disable-next-line max-len
                    if (parentEle.childNodes[i as number].nodeType === 3 && parentEle.childNodes[i as number].textContent.charCodeAt(0) === 8203 && bool) {
                        removeNodeArray.push(i);
                    } else {
                        bool = false;
                    }
                }
                if (removeNodeArray.length > 0) {
                    for (i = removeNodeArray.length - 1; i > 0; i--) {
                        parentEle.childNodes[removeNodeArray[i as number]].textContent = '';
                    }
                }
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.contentModule.getDocument(), range.startContainer as Element, range.startOffset);
            }
        }
        const notFormatPainterCopy: boolean = isNOU((e as KeyboardEventArgs).action) ? true : ((e as KeyboardEventArgs).action !== 'format-copy' ? true : false);
        if (this.formatter.getUndoRedoStack().length === 0 && notFormatPainterCopy &&
            !(e.altKey || (e.shiftKey && e.which === 16) || (e.altKey && e.shiftKey && e.which === 67))) {
            this.formatter.saveData();
        }
        let preventingMention: boolean = false;
        let allowInsideCodeBlock: boolean = true;
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            preventingMention = !isNOU(range.startContainer) && range.startContainer === range.endContainer && range.endContainer.childNodes.length > 1 && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) && range.startContainer.childNodes[range.startOffset - 1].nodeName === '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1].previousSibling) && range.startContainer.childNodes[range.startOffset - 1].textContent.charCodeAt(0) === 32 && range.startContainer.childNodes[range.startOffset - 1].previousSibling.nodeName !== '#text' && (range.startContainer.childNodes[range.startOffset - 1].previousSibling as HTMLElement).classList.contains('e-mention-chip');
            if (!isNOU(this.codeBlockModule)) {
                const startInCodeBlock: HTMLElement =
                    this.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(range.startContainer);
                const endInCodeBlock: HTMLElement = this.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(range.endContainer);
                const codeBlockElement: boolean = !isNOU(startInCodeBlock) || !isNOU(endInCodeBlock);
                if (codeBlockElement) {
                    const currentAction: string = (e as KeyboardEventArgs).action;
                    const allowActions: string[] = ['undo', 'redo', 'indents', 'outdents', 'ordered-list', 'unordered-list'];
                    allowInsideCodeBlock = allowActions.indexOf(currentAction) !== -1;
                }
            }
        }
        const keyboardEventAction: string[] = ['insert-link', 'format-copy', 'format-paste', 'insert-image', 'insert-table', 'insert-audio', 'insert-video'];
        if (keyboardEventAction.indexOf((e as KeyboardEventArgs).action) === -1 &&
            (!(e as KeyboardEvent).target || !(((e as KeyboardEvent).target as Element).classList.contains('e-mention') && !isNOU(document.querySelector('#' + ((e as KeyboardEvent).target as Element).id + '_popup.e-popup-open')) && e.code === 'Tab')) &&
            ((e as KeyboardEventArgs).action && (e as KeyboardEventArgs).action !== 'paste' && (e as KeyboardEventArgs).action !== 'space'
                || e.which === 9 || (e.code === 'Backspace' && e.which === 8)) && !preventingMention) {
            let FormatPainterEscapeAction: boolean = false;
            if (!isNOU(this.formatPainterModule)) {
                FormatPainterEscapeAction = this.formatPainterModule.previousAction === 'escape';
            }
            const isUndoRedoAction: boolean = (e as KeyboardEventArgs).action === 'undo' || (e as KeyboardEventArgs).action === 'redo';
            if ((!FormatPainterEscapeAction || isUndoRedoAction) && allowInsideCodeBlock && !isCodeBlockEnter) {
                if (this.editorMode === 'HTML' && ((e as KeyboardEventArgs).action === 'increase-fontsize' || (e as KeyboardEventArgs).action === 'decrease-fontsize')) {
                    this.notify(events.onHandleFontsizeChange, { member: 'onHandleFontsizeChange', args: e });
                } else {
                    this.formatter.process(this, null, e);
                }
            }
            switch ((e as KeyboardEventArgs).action) {
            case 'toolbar-focus':
                if (this.toolbarSettings.enable && this.getToolbarElement()) {
                    if (this.userAgentData.isSafari() && e.type === 'keydown' && this.formatter.editorManager.nodeSelection &&
                        this.formatter.editorManager.nodeSelection.get(this.contentModule.getDocument()).rangeCount > 0 &&
                        this.inputElement.contains(this.getRange().startContainer)) {
                        this.notify(events.selectionSave, {});
                    }
                    let toolbarFocusType: string = 'toolbar';
                    let firstActiveItem: HTMLElement = this.getToolbarElement().querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                    const quickToolbarElem: HTMLElement | null = this.getRenderedQuickToolbarElem();
                    if (quickToolbarElem) {
                        firstActiveItem = quickToolbarElem.querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                        toolbarFocusType = 'quickToolbar';
                    }
                    if (firstActiveItem) {
                        const firstChild: HTMLElement = firstActiveItem.firstElementChild as HTMLElement;
                        firstChild.removeAttribute('tabindex');
                        firstChild.focus();
                        if (this.userAgentData.isSafari() && (toolbarFocusType === 'toolbar' || toolbarFocusType === 'quickToolbar')) {
                            this.inputElement.ownerDocument.getSelection().removeAllRanges();
                        }
                    }
                }
                break;
            case 'escape':
                (this.contentModule.getEditPanel() as HTMLElement).focus();
                break;
            }
        }
        this.notify(events.afterKeyDown, { member: 'afterKeyDown', args: e });
        this.autoResize();
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
        if (this.editorMode === 'HTML' && !isNOU(e) && !isNOU(e.code) && (e.code === 'Backspace' || e.code === 'Delete')) {
            const range: Range = this.contentModule.getDocument().getSelection().getRangeAt(0);
            const div: HTMLElement = document.createElement('div');
            div.appendChild(range.cloneContents());
            const selectedHTML: string = div.innerHTML;
            if (selectedHTML === this.inputElement.innerHTML ||
                (range.commonAncestorContainer === this.inputElement && selectedHTML === this.inputElement.textContent.trim())) {
                this.isCopyAll = true;
            }
        }
        // Cmd + Backspace triggers only the keydown event; the keyup event is not triggered.
        if (e.metaKey && e.key === 'Backspace' && this.autoSaveOnIdle) {
            this.keyUp(e);
        }
        if (this.editorMode === 'HTML') {
            const selection: Selection = this.contentModule.getDocument().getSelection();
            const range: Range = selection && selection.getRangeAt(0);
            this.previousRange = range && range.cloneRange();
        }
    }

    // Clear selection timeout for keyup event triggering
    private clearSelectionTimeout(): void {
        if (this.selectionTimeout) {
            clearTimeout(this.selectionTimeout);
            this.selectionTimeout = null;
        }
    }

    // Triggers the selectionChanged event
    private triggerSelectionChanged(): void {
        const selection: Selection | null = this.contentModule.getDocument().getSelection();
        const currentRange: Range = selection && selection.rangeCount > 0 && selection.getRangeAt(0);
        if (!this.isSelectionCollapsed()) {
            const isSamerange: boolean = this.previousRange &&
                (this.previousRange.startContainer === currentRange.startContainer
                    && this.previousRange.endContainer === currentRange.endContainer
                    && this.previousRange.startOffset === currentRange.startOffset
                    && this.previousRange.endOffset === currentRange.endOffset);
            if (!isSamerange) {
                const selectionArgs: SelectionChangedEventArgs = {
                    selectedContent: this.getSelectedHtml(),
                    selection,
                    editorMode: this.editorMode
                };
                this.trigger(events.selectionChanged, selectionArgs);
                this.previousRange = currentRange.cloneRange();
            }
        }
    }

    private keyUp(e: KeyboardEvent): void {
        if (this.inputElement.classList.contains('e-mention')) {
            const mentionPopup: HTMLElement = this.element.ownerDocument.getElementById(this.inputElement.id + '_popup');
            const slashMenuPopup: HTMLElement = this.element.ownerDocument.getElementById(this.inputElement.id + '_slash_menu_popup');
            const isMentionPopupOpen: boolean = mentionPopup && mentionPopup.classList.contains('e-popup-open');
            const isSlashMenuPopupOpen: boolean = slashMenuPopup && slashMenuPopup.classList.contains('e-popup-open');
            if ((isMentionPopupOpen || isSlashMenuPopupOpen)) {
                return;
            }
        }
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            if (!isNOU(e) && !isNOU(e.code) && (e.code === 'Backspace' || e.code === 'Delete' || e.code === 'KeyX')) {
                // To prevent the reformatting the content removed browser behavior.
                const currentRange: Range = this.getRange();
                const selection: Selection = this.iframeSettings.enable ? this.contentModule.getPanel().ownerDocument.getSelection() :
                    this.contentModule.getDocument().getSelection();
                if (this.isCopyAll) {
                    const brElement: HTMLElement = this.createElement('br');
                    const newElement: HTMLElement = this.enterKey === 'BR' ? brElement : this.createElement(this.enterKey).appendChild(brElement).parentElement;
                    this.inputElement.innerHTML = '';
                    this.inputElement.appendChild(newElement);
                    this.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.contentModule.getDocument(),
                        brElement.parentElement,
                        0
                    );
                    this.isCopyAll = false;
                }
                if (selection.rangeCount > 0 && this.contentModule.getDocument().activeElement.tagName !== 'INPUT' && this.inputElement.contains(this.contentModule.getDocument().activeElement) && (range.startContainer as HTMLElement).innerHTML === '<br>' && (range.startContainer as HTMLElement).textContent === '') {
                    selection.removeAllRanges();
                    selection.addRange(currentRange);
                }
            }
            if (Browser.userAgent.indexOf('Firefox') !== -1 && range.startContainer.nodeName === '#text' &&
                range.startContainer.parentElement === this.inputElement && this.enterKey !== 'BR') {
                const range: Range = this.getRange();
                const tempElem: HTMLElement = this.createElement(this.enterKey);
                range.startContainer.parentElement.insertBefore(tempElem, range.startContainer);
                tempElem.appendChild(range.startContainer);
                this.formatter.editorManager.nodeSelection.setSelectionText(
                    this.contentModule.getDocument(), tempElem.childNodes[0], tempElem.childNodes[0],
                    tempElem.childNodes[0].textContent.length, tempElem.childNodes[0].textContent.length);
            }
        }
        const currentStackIndex: number = this.formatter.getCurrentStackIndex();
        if (currentStackIndex === 0) {
            this.updateUndoRedoStack(e);
        }
        this.notify(events.keyUp, { member: 'keyup', args: e });
        this.notify(events.tableModulekeyUp, { member: 'tableModulekeyUp', args: e });
        if (e.code === 'KeyX' && e.which === 88 && e.keyCode === 88 && e.ctrlKey && (this.inputElement.innerHTML === '' ||
            this.inputElement.innerHTML === '<br>')) {
            this.inputElement.innerHTML = resetContentEditableElements(getEditValue(getDefaultValue(this), this), this.editorMode);
        }
        const isMention: boolean = this.inputElement.classList.contains('e-mention');
        const allowedKeys: boolean = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46 || e.which === 9 && isMention;
        const formatPainterCopy: boolean = e.key === 'C' && e.altKey && e.shiftKey;
        const formatPainterPaste: boolean = e.key === 'V' && e.altKey && e.shiftKey;
        if ((!formatPainterCopy && !formatPainterPaste) && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys)) || (this.autoSaveOnIdle && Browser.isDevice) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0
            || this.element.querySelectorAll('.e-toolbar-item.e-active').length > 0 || this.formatter.getUndoRedoStack().length > 0) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        this.setPlaceHolder();
        if (this.editorMode === 'HTML') {
            //Clears the selectionTimeout and triggers the selectionChanged event.
            this.clearSelectionTimeout();
            const isRteUnitTesting: boolean = (this.element && this.element.dataset && this.element.dataset.rteUnitTesting === 'true');
            if (isRteUnitTesting) {
                if (this.isSelecting) {
                    this.triggerSelectionChanged();
                    this.isSelecting = false;
                    this.isSelectionStartInRTE = false;
                }
            } else {
                this.selectionTimeout = window.setTimeout(() => {
                    if (this.isSelecting) {
                        this.triggerSelectionChanged();
                        this.isSelecting = false;
                        this.isSelectionStartInRTE = false;
                    }
                }, 600);
            }
        }
    }
    /**
     * @param {string} value - specifies the value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public serializeValue(value: string): string {
        if (this.editorMode === 'HTML' && !isNOU(value)) {
            value = cleanHTMLString(value, this.element);
            if (!this.enableXhtml) {
                value = getStructuredHtml(value, this.enterKey, this.enableHtmlEncode);
            }
            if (this.enableHtmlEncode) {
                value = this.htmlEditorModule.sanitizeHelper(decode(value));
                value = this.encode(value);
            } else {
                value = this.htmlEditorModule.sanitizeHelper(value);
                value = this.enableXhtml ? this.htmlEditorModule.xhtmlValidation.selfEncloseValidation(value) : value;
            }
        }
        return value;
    }
    /**
     * Sanitizes an HTML string to prevent cross-site scripting (XSS) attacks.
     * This method is applicable when the editor mode is specifically set to `HTML`.
     *
     * @param {string} value - The HTML content to be sanitized for security purposes.
     * @returns {string} - The HTML content after being sanitized.
     */
    public sanitizeHtml(value: string): string {
        return this.serializeValue(value);
    }

    /**
     * updateValue method
     *
     * @param {string} value - specifies the string value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public updateValue(value?: string): void {
        if (isNOU(value)) {
            const inputVal: string = this.inputElement.innerHTML;
            this.setProperties({ value: isEditableValueEmpty(inputVal) ? null : inputVal });
        } else {
            this.setProperties({ value: value });
        }
    }

    private triggerEditArea(e: MouseEvent | TouchEvent): void {
        if (!isIDevice()) {
            this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
        } else {
            const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    }

    private focusHR(e: MouseEvent | TouchEvent): void {
        if ((e.target as HTMLElement).tagName === 'HR') {
            (e.target as HTMLElement).classList.add('e-rte-hr-focus');
        }
    }

    private notifyMouseUp(e: MouseEvent | TouchEvent): void {
        const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        this.notify(events.mouseUp, {
            member: 'mouseUp', args: e,
            touchData: {
                prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY
            }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && ((this.inputElement.textContent.length !== 0) || e.target && !isNOU((e.target as HTMLElement).querySelector('li')))) ||
            (this.editorMode === 'Markdown' && (this.inputElement as HTMLTextAreaElement).value.length !== 0)) ||
            (e.target && !isNOU(closest((e.target as HTMLElement), 'table'))) ||
            (e.target && !isNOU((e.target as HTMLElement).querySelector('img'))) ||
            (e.target && ((e.target as HTMLElement).nodeName === 'VIDEO' ||
                (e.target as HTMLElement).querySelectorAll('.' + classes.CLS_VIDEOWRAP).length > 0) ||
                (e.target && (e.target as HTMLElement).nodeName !== 'BR' &&
                    ((e.target as HTMLElement).classList.contains(classes.CLS_AUDIOWRAP) ||
                        (e.target as HTMLElement).classList.contains(classes.CLS_CLICKELEM) ||
                        (e.target as HTMLElement).classList.contains(classes.CLS_VID_CLICK_ELEM))))) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
        if (this.editorMode === 'HTML') {
            this.focusHR(e);
        }
    }

    private updateUndoRedoStack(e: MouseEvent | TouchEvent | KeyboardEvent | Event, selectionChange?: boolean): void {
        const undoRedoStack: IHtmlUndoRedoData[] | MarkdownUndoRedoData[] = this.formatter.getUndoRedoStack();
        const currentStackIndex: number = this.formatter.getCurrentStackIndex();
        const navigationKeys: string[] = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', 'PageUp', 'PageDown'
        ];
        const isNavKey: boolean = navigationKeys.indexOf((e as KeyboardEvent).key) !== -1;
        const isNavigationKey: boolean = e.type === 'keyup' ? isNavKey : true;
        if (undoRedoStack.length === 0 || currentStackIndex === 0) {
            if (undoRedoStack.length === 0) {
                this.formatter.saveData();
            } else if ((currentStackIndex === 0 && this.editorMode === 'HTML') && (isNavigationKey || selectionChange)) {
                const firstStackState: IHtmlUndoRedoData = undoRedoStack[0] as IHtmlUndoRedoData;
                const save: NodeSelection = new NodeSelection(this.inputElement as HTMLElement)
                    .save(this.getRange(), this.contentModule.getDocument());
                firstStackState.range = save;
            } else if (currentStackIndex === 0 && this.editorMode === 'Markdown' && isNavigationKey) {
                const markdownFirstStackState: MarkdownUndoRedoData = undoRedoStack[0] as MarkdownUndoRedoData;
                const start: number = (this.inputElement as HTMLTextAreaElement).selectionStart;
                const end: number = (this.inputElement as HTMLTextAreaElement).selectionEnd;
                markdownFirstStackState.start = start;
                markdownFirstStackState.end = end;
            }
        }
    }

    private mouseUp(e: MouseEvent | TouchEvent): void {
        this.isSelectionStartInRTE = false;
        if (this.isSelectionCollapsed()) {
            const selection: Selection = this.contentModule.getDocument().getSelection();
            const range: Range = selection && selection.rangeCount !== 0 && selection.getRangeAt(0);
            this.previousRange = range && range.cloneRange();
        }
        const target: HTMLElement = e.target as HTMLElement;
        const mediaTags: string[] = ['IMG', 'VIDEO', 'AUDIO', 'TABLE', 'TH', 'TD', 'TR', 'TBODY'];
        const isNotMediaElement: boolean = !(target && mediaTags.indexOf(target.tagName) !== -1 || (target.nodeName !== '#text' &&
            (target.closest('.e-audio-wrap') || target.closest('.e-video-wrap') || target.closest('.e-embed-video-wrap'))));
        if (isNotMediaElement && this.editorMode === 'HTML' && !(Browser.isDevice || isIDevice())) {
            if (!this.isSelectionInRTE()) {
                return;
            }
        }
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            const target: Element = e.target as Element;
            const closestTable: Element = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.contentModule.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
        this.setPlaceHolder();
        this.autoResize();
        this.updateUndoRedoStack(e);
        if (this.isSelectionInRTE()) {
            this.triggerSelectionChanged();
            this.isSelecting = false;
        }
    }

    /**
     * @param {Function} module - specifies the module function.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public ensureModuleInjected(module: Function): boolean {
        return this.getInjectedModules().indexOf(module) >= 0;
    }

    /**
     * @param {MouseEvent | KeyboardEvent | ClipboardEvent} e - specifies the event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onCopy(e: MouseEvent | KeyboardEvent | ClipboardEvent = null): void {
        if (e && this.editorMode === 'HTML' && this.handleTableCellCopy()) {
            // Copy was handled by table module
            e.preventDefault();
            return;
        }
        this.contentModule.getDocument().execCommand('copy', false, null);
    }

    /**
     * @param {MouseEvent | KeyboardEvent | ClipboardEvent} e - specifies the event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onCut(e: MouseEvent | KeyboardEvent | ClipboardEvent = null): void {
        if (e && this.editorMode === 'HTML' && this.handleTableCellCopy(true)) {
            // Cut was handled by table module
            e.preventDefault();
            return;
        }
        const range: Range = this.contentModule.getDocument().getSelection().getRangeAt(0);
        const div: HTMLElement = document.createElement('div');
        div.appendChild(range.cloneContents());
        const selectedHTML: string = div.innerHTML;
        if (selectedHTML === this.inputElement.innerHTML ||
            (range.commonAncestorContainer === this.inputElement && selectedHTML === this.inputElement.textContent.trim())) {
            this.isCopyAll = true;
        }
        this.contentModule.getDocument().execCommand('cut', false, null);
    }

    /**
     * @param {KeyboardEvent} e - specifies the keyboard event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onPaste(e?: ClipboardEvent): void {
        const evenArgs: { [key: string]: Object } = {
            originalEvent: e,
            cancel: false,
            requestType: 'Paste'
        };
        this.isPlainPaste = e && e.clipboardData && e.clipboardData.items && e.clipboardData.items.length
            && e.clipboardData.items.length === 1 && e.clipboardData.items[0].type === 'text/plain';
        this.trigger(events.actionBegin, evenArgs, (pasteArgs: { [key: string]: Object }) => {
            const currentLength: number = this.getText().replace(/\u200B/g, '').replace(this.editorMode === 'HTML' ? /(\r\n|\n|\r|\t)/gm : '', '').length;
            const selectionLength: number = this.getSelection().length;
            const pastedContentLength: number = (isNOU(e) || isNOU(e.clipboardData))
                ? 0 : e.clipboardData.getData('text/plain').replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
            const totalLength: number = (currentLength - selectionLength) + pastedContentLength;
            if (this.editorMode === 'Markdown') {
                const args: Object = { requestType: 'Paste', editorMode: this.editorMode, event: e };
                setTimeout(() => {
                    this.formatter.onSuccess(this, args);
                }, 0);
                if (!(this.maxLength === -1 || totalLength <= this.maxLength)) {
                    e.preventDefault();
                }
                return;
            }
            if (!pasteArgs.cancel && this.inputElement.contentEditable === 'true' &&
                (this.maxLength === -1 || totalLength <= this.maxLength)) {
                const currentRange: Range = this.getRange();
                let codeBlockPasteAction: Element;
                if (!isNOU(this.codeBlockModule)) {
                    codeBlockPasteAction = (this.formatter.editorManager.codeBlockObj.
                        isValidCodeBlockStructure(currentRange.startContainer)
                        || this.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(currentRange.endContainer));
                }
                const isImageDialogOpen: HTMLElement = this.contentModule.getDocument().querySelector('.e-rte-img-dialog');
                if (!isNOU(this.pasteCleanupModule) && isNOU(codeBlockPasteAction)) {
                    if (isNOU(isImageDialogOpen)) {
                        this.notify(events.pasteClean, { args: e, isPlainPaste: this.isPlainPaste });
                    }
                } else {
                    if (!this.isPlainPaste) {
                        console.warn('[WARNING] :: Module "pasteCleanup" is not available in RichTextEditor component! You either misspelled the module name or forgot to load it.');
                        const args: Object = { requestType: 'Paste', editorMode: this.editorMode, event: e };
                        let value: string = null;
                        let htmlValue: boolean = false;
                        if (e && !isNOU(e.clipboardData)) {
                            value = e.clipboardData.getData('text/plain');
                            htmlValue = e.clipboardData.getData('text/html').indexOf('MsoNormal') > 0;
                        }
                        const file: File = e && e.clipboardData && e.clipboardData.items.length > 0 ?
                            e.clipboardData.items[0].getAsFile() : null;
                        if (value !== null && isNOU(codeBlockPasteAction)) {
                            this.notify(events.paste, {
                                file: file,
                                args: e,
                                text: value,
                                isWordPaste: htmlValue
                            });
                        } else if (value !== null && !isNOU(codeBlockPasteAction) && !isNOU(this.codeBlockModule)) {
                            this.notify(events.codeBlockPaste, {
                                file: file,
                                args: e,
                                text: value,
                                isWordPaste: htmlValue
                            });
                        }
                        setTimeout(() => {
                            this.formatter.onSuccess(this, args);
                        }, 0);
                    } else if (this.isPlainPaste && !isNOU(codeBlockPasteAction) && !isNOU(this.codeBlockModule)) {
                        this.notify(events.codeBlockPaste, {
                            args: e
                        });
                    }
                }
            } else {
                e.preventDefault();
            }
        });
        this.isPlainPaste = false;
    }

    /**
     * @param {string} action - specifies the string value.
     * @param {MouseEvent} event - specifies the event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public clipboardAction(action: string, event: MouseEvent | KeyboardEvent | ClipboardEvent): void {
        switch (action.toLowerCase()) {
        case 'cut':
            this.onCut(event);
            this.formatter.onSuccess(this, {
                requestType: 'Cut',
                editorMode: this.editorMode,
                event: event
            });
            break;
        case 'copy':
            this.onCopy(event);
            this.formatter.onSuccess(this, {
                requestType: 'Copy',
                editorMode: this.editorMode,
                event: event
            });
            break;
        case 'paste':
            this.onPaste(event as ClipboardEvent);
            break;
        }
    }
    /**
     * Destroys the component by detaching or removing all event handlers,
     * attributes, and CSS classes. It also clears the component's element content.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed || !this.isRendered) {
            return;
        }
        this.element.className = this.beforeRenderClassValue;
        this.removeHtmlAttributes();
        this.removeAttributes();
        this.beforeRenderClassValue = null;
        if (!isNOU(this.timeInterval)) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        if (!isNOU(this.autoSaveTimeOut)) {
            clearTimeout(this.autoSaveTimeOut);
            this.autoSaveTimeOut = null;
        }
        if (!isNOU(this.idleInterval)) {
            clearTimeout(this.idleInterval);
            this.idleInterval = null;
        }
        this.notify(events.destroy, {});
        this.destroyDependentModules();
        this.unWireEvents();
        if (this.originalElement.tagName === 'TEXTAREA') {
            this.element.parentElement.insertBefore(this.valueContainer, this.element);
            this.valueContainer.id = this.getID();
            this.valueContainer.removeAttribute('name');
            detach(this.element);
            if (this.originalElement.innerHTML.trim() !== '') {
                this.valueContainer.value = this.originalElement.innerHTML.trim();
                this.setProperties({ value: (!isNOU(this.initialValue) ? this.initialValue : null) }, true);
            } else {
                this.valueContainer.value = this.valueContainer.defaultValue;
            }
            this.element = this.valueContainer;
            for (let i: number = 0; i < this.originalElement.classList.length; i++) {
                addClass([this.element], this.originalElement.classList[i as number]);
            }
            if (!isNOU(this.cssClass)) {
                const currentClassList: string[] = this.cssClass.split(' ');
                for (let i: number = 0; i < currentClassList.length; i++) {
                    addClass([this.element], currentClassList[i as number]);
                }
            }
            removeClass([this.element], classes.CLS_RTE_HIDDEN);
        } else {
            if (this.originalElement.innerHTML.trim() !== '') {
                this.element.innerHTML = this.originalElement.innerHTML.trim();
                this.setProperties({ value: (!isNOU(this.initialValue) ? this.initialValue : null) }, true);
            } else {
                this.element.innerHTML = '';
            }
        }
        const dialogElement: Element = document.querySelector('.e-dialog.e-rte-elements');
        if (dialogElement) {
            detach(dialogElement);
        }
        if (this.placeholder && this.placeHolderWrapper) {
            this.placeHolderWrapper = null;
        }
        if (!isNOU(this.cssClass)) {
            const allClassName: string[] = this.cssClass.split(' ');
            for (let i: number = 0; i < allClassName.length; i++) {
                if (allClassName[i as number].trim() !== '') {
                    removeClass([this.element], allClassName[i as number]);
                }
            }
        }
        if (this.rootContainer) {
            this.rootContainer = null;
        }
        if (this.valueContainer) {
            this.valueContainer = null;
        }
        if (this.originalElement) {
            this.originalElement = null;
        }
        this.currentTarget = null;
        this.scrollParentElements = [];
        this.userAgentData = null;
        this.isRendered = false;
        this.isSelecting = false;
        this.selectionTimeout = null;
        this.previousRange = null;
        super.destroy();
    }

    /*
     * Handles table cell copy operation when cells are selected.
     */
    private handleTableCellCopy(isCut: boolean = false): boolean {
        const range: Range = this.getRange();
        if (range &&
            range.startContainer &&
            this.tableModule &&
            this.tableModule.tableObj &&
            this.tableModule.tableObj.curTable &&
            this.tableModule.tableObj.curTable.contains(range.startContainer) &&
            this.tableModule.tableObj.curTable.querySelectorAll('.e-cell-select.e-multi-cells-select').length > 0) {
            this.tableModule.tableObj.copy(isCut);
            return true;
        }
        return false;
    }

    private removeHtmlAttributes(): void {
        if (this.htmlAttributes) {
            const keys: string[] = Object.keys(this.htmlAttributes);
            for (let i: number = 0; i < keys.length && this.element.hasAttribute(keys[i as number]); i++) {
                this.element.removeAttribute(keys[i as number]);
            }
        }
    }

    private removeAttributes(): void {
        if (!this.enabled) {
            removeClass([this.element], classes.CLS_DISABLED);
        }
        if (this.enableRtl) {
            removeClass([this.element], classes.CLS_RTL);
        }
        if (this.readonly) {
            removeClass([this.element], classes.CLS_RTE_READONLY);
        }
        if (this.element.style.width !== '' && this.originalElement.style.width === '') {
            this.element.style.removeProperty('width');
        }
        if (this.element.style.height !== '' && this.originalElement.style.height === '') {
            this.element.style.removeProperty('height');
        }
        this.element.removeAttribute('aria-disabled');
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
        this.element.removeAttribute('aria-label');
    }

    private destroyDependentModules(): void {
        // To handle the non Injectible module destruction.
        this.renderModule.destroy();
        this.formatter.editorManager.destroy();
    }

    /**
     * Retrieves the HTML or text content inside the RichTextEditor.
     *
     * @returns {Element} - The element containing the content.
     */
    public getContent(): Element {
        return this.contentModule.getPanel();
    }

    /**
     * Retrieves the text content as a string.
     *
     * @returns {string} - The plain text content.
     */
    public getText(): string {
        return this.contentModule.getText();
    }

    /**
     * Retrieves the HTML representation of the selected content as a string.
     *
     * @returns {string} - The HTML content of the selected area.
     */
    public getSelectedHtml(): string {
        let range: Range;
        let selectedHtml: string;
        const selection: Selection = this.contentModule.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            selectedHtml = this.extractContentFromSelection(range.cloneRange());
        }
        return selectedHtml;
    }

    /* Extracts both HTML and plain text content from the current selection range. */
    private extractContentFromSelection(range: Range): string {
        let htmlContent : string = '';
        htmlContent = this.getHTMLFromSelectionRange(range);
        htmlContent = this.normalizeInlineElementWrapping(range, htmlContent);
        return htmlContent;
    }

    /* Extracts HTML content from the current selection range by wrapping it in a temporary container */
    private getHTMLFromSelectionRange(selectionRange: Range): string {
        const clonedSelection: DocumentFragment = selectionRange.cloneContents();
        const temporaryContainer: HTMLElement = this.createElement('div');
        temporaryContainer.appendChild(clonedSelection);
        return temporaryContainer.innerHTML;
    }

    /* Extracts HTML content and ensures inline elements are properly wrapped if present in the selection.*/
    private normalizeInlineElementWrapping(selectionRange: Range, htmlContent: string): string {
        const startNode: Node = selectionRange.startContainer;
        // Check if the selection starts with non-empty text
        if (startNode.textContent.trim() !== '') {
            const ancestorNode: Node = selectionRange.commonAncestorContainer;
            const isTextNode: boolean = ancestorNode.nodeName === '#text';
            const isNonBlockNode: boolean = !this.formatter.editorManager.domNode.isBlockNode(
                (isTextNode ? ancestorNode.parentNode : ancestorNode) as HTMLElement);
            if (isNonBlockNode) {
                htmlContent = this.getWrappedAroundInlineElement(
                    (isTextNode ? ancestorNode.parentNode : ancestorNode) as HTMLElement, htmlContent);
            }
        }
        // Special handling for video wrapper elements
        const isVideoWrapper: boolean = startNode.nodeName === 'SPAN' &&
            (startNode as HTMLElement).classList.length > 0 && (startNode as HTMLElement).classList.contains('e-video-wrap');
        if (isVideoWrapper) {
            htmlContent = (startNode as HTMLElement).outerHTML;
        }
        return htmlContent;
    }

    /* Returns the outer HTML of the nearest inline-level ancestor after replacing its inner content with the provided HTML content. */
    private getWrappedAroundInlineElement(inlineAncestor: HTMLElement, contentToWrap: string): string {
        const contentContainer: HTMLElement = this.createElement('div');
        contentContainer.innerHTML = contentToWrap;
        //to retrieve only the wrapper inline element without any inner html in it
        do {
            const clonedInlineAncestor: HTMLElement = inlineAncestor.cloneNode(true) as HTMLElement;
            //swapping the existing html and cloned inline wrapper
            clonedInlineAncestor.innerHTML = contentContainer.innerHTML;
            contentContainer.innerHTML = clonedInlineAncestor.outerHTML;
            inlineAncestor = inlineAncestor.parentElement;
        } while (!isNOU(inlineAncestor) && !this.formatter.editorManager.domNode.isBlockNode(inlineAncestor as HTMLElement));
        return contentContainer.innerHTML;
    }

    /**
     * Displays the inline quick toolbar.
     *
     * @returns {void}
     */
    public showInlineToolbar(): void {
        if (this.inlineMode.enable) {
            let currentRange: Range = this.getRange();
            if (!this.isSelectionInRTE()) {
                const node: Element = this.contentModule.getEditPanel();
                const cursorFocusElement: Element = (this.enterKey === 'BR')
                    ? (node.childNodes[0] as Element).parentElement
                    : (node.childNodes[0] as Element);
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.contentModule.getDocument(), cursorFocusElement, 0);
                currentRange = this.getRange();
            }
            const targetElm: HTMLElement = currentRange.endContainer.nodeName === '#text' ?
                currentRange.endContainer.parentElement : currentRange.endContainer as HTMLElement;
            let rects: DOMRect[] = Array.from(currentRange.getClientRects(), (rect: DOMRect) => rect as DOMRect);
            if (rects.length === 0) {
                rects = [(currentRange.startContainer as HTMLElement).getBoundingClientRect() as DOMRect];
            }
            if (rects.length > 0) {
                const x: number = rects[0].left;
                const y: number = rects[0].top;
                this.quickToolbarModule.showInlineQTBar(x, y, (targetElm as HTMLElement));
            }
        }
    }

    /**
     * Hides the inline quick toolbar.
     *
     * @returns {void}
     */
    public hideInlineToolbar(): void {
        this.quickToolbarModule.hideInlineQTBar();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @private
     * @deprecated
     */
    protected getModuleName(): string {
        return 'richtexteditor';
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {RichTextEditorModel} newProp - specifies the the property.
     * @param {RichTextEditorModel} oldProp - specifies the old property.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    /* eslint-disable */
    public onPropertyChanged(newProp: RichTextEditorModel, oldProp: RichTextEditorModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enterKey':
                case 'value': {
                    let nVal: string;
                    if (prop === 'enterKey') {
                        if (this.value === null || this.value === '<div><br></div>' || this.value === '<p><br></p>' ||
                            this.value === '<br>') {
                            nVal = null;
                        } else {
                            nVal = this.value;
                        }
                    } else {
                        nVal = newProp[prop];
                    }
                    nVal = this.editorMode === 'HTML' ? this.replaceEntities(nVal) : nVal;
                    nVal = this.serializeValue(nVal);
                    const val: string = this.editorMode === 'HTML' ? getEditValue(nVal, this) : nVal;
                    if ((!isNOU(nVal) && nVal !== '') || prop === 'enterKey') {
                        this.setProperties({ value: ((this.enableHtmlEncode) ? this.encode(decode(val)) : val) }, true);
                    }
                    this.updatePanelValue();
                    if (this.inputElement) {
                        this.notify(events.tableclass, {});
                    }
                    this.setPlaceHolder();
                    this.notify(events.xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
                    if (this.enableXhtml) {
                        this.setProperties({ value: this.getXhtml() }, true);
                    }
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    this.addAudioVideoWrapper();
                    break;
                }
                case 'valueTemplate':
                    this.setValue(true);
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'width': this.setWidth(newProp[prop]);
                    if (this.toolbarSettings.enable && !this.inlineMode.enable) {
                        this.toolbarModule.refreshToolbarOverflow();
                        this.resizeHandler();
                    }
                    break;
                case 'height':
                    this.setHeight(newProp[prop]);
                    this.autoResize();
                    break;
                case 'readonly':
                    this.setReadOnly(false);
                    break;
                case 'cssClass':
                    this.element.classList.remove(oldProp[prop]);
                    this.setCssClass(newProp[prop]);
                    this.notify(events.bindCssClass, { cssClass: newProp[prop], oldCssClass: oldProp[prop] });
                    break;
                case 'enabled': this.setEnable(); break;
                case 'enableRtl': this.updateRTL(); break;
                case 'placeholder':
                    this.placeholder = newProp[prop];
                    this.setPlaceHolder();
                    break;
                case 'htmlAttributes':
                    setAttributes(this.htmlAttributes, this, false, false); break;
                case 'iframeSettings': {
                    const frameSetting: IFrameSettingsModel = oldProp[prop];
                    if (frameSetting.resources) {
                        const iframe: HTMLDocument = this.contentModule.getDocument();
                        const header: HTMLHeadElement = iframe.querySelector('head');
                        let files: Element[];
                        if (frameSetting.resources.scripts) {
                            files = <NodeListOf<Element> & Element[]>header.querySelectorAll('.' + classes.CLS_SCRIPT_SHEET);
                            this.removeSheets(files);
                        }
                        if (frameSetting.resources.styles) {
                            files = <NodeListOf<Element> & Element[]>header.querySelectorAll('.' + classes.CLS_STYLE_SHEET);
                            this.removeSheets(files);
                        }
                    }
                    this.setIframeSettings(); break;
                }
                case 'locale': super.refresh(); break;
                case 'inlineMode':
                    this.notify(events.modelChanged, { module: 'quickToolbar', newProp: newProp, oldProp: oldProp });
                    break;
                case 'toolbarSettings':
                    this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    break;
                case 'maxLength':
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'showCharCount':
                    if (newProp[prop] && this.countModule) {
                        this.countModule.renderCount();
                    } else if (newProp[prop] === false && this.countModule) {
                        this.countModule.destroy();
                    }
                    break;
                case 'enableHtmlEncode':
                    this.updateValueData(); this.updatePanelValue(); this.setPlaceHolder();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'undoRedoSteps':
                case 'undoRedoTimer':
                    this.formatter.editorManager.observer.notify(CONSTANT.MODEL_CHANGED, { newProp: newProp, oldProp: oldProp });
                    break;
                case 'enableXhtml':
                    this.notify(events.xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
                    this.inputElement.innerHTML = getStructuredHtml(cleanHTMLString(this.inputElement.innerHTML, this.element), this.enterKey, this.enableHtmlEncode);
                    break;
                case 'quickToolbarSettings':
                    if (!isNOU(newProp.quickToolbarSettings.showOnRightClick)) {
                        newProp.quickToolbarSettings.showOnRightClick ? this.wireContextEvent() : this.unWireContextEvent();
                    }
                    this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
                case 'formatPainterSettings':
                    this.formatter.editorManager.observer.notify(CONSTANT.MODEL_CHANGED, { module: 'formatPainter', newProp: newProp });
                    break;
                case 'showTooltip':
                case 'floatingToolbarOffset':
                    this.notify(events.modelChanged, {  module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    break;
                case 'keyConfig':
                    Object.assign(this.keyboardModule.keyConfigs, newProp.keyConfig);
                    break
                default:
                    this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
            }
            this.autoResize();
        }
        if (this.formatter) {
            this.notify(events.updateProperty, {});
        }
    }
    /* eslint-enable */
    /**
     * @hidden
     * @returns {void}
     * @deprecated
     */
    public updateValueData(): void {
        if (this.enableHtmlEncode) {
            this.setProperties({ value: this.encode(decode(this.inputElement.innerHTML)) }, true);
        } else {
            this.setProperties({
                value: /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                    decode(this.inputElement.innerHTML)
            });
        }
    }
    private removeSheets(srcList: Element[]): void {
        let i: number;
        for (i = 0; i < srcList.length; i++) {
            detach(srcList[i as number]);
        }
    }

    private replaceEntities(value: string): string {
        if (this.editorMode !== 'HTML' || isNOU(value) || !/&(amp;)*((times)|(divide)|(ne))/.test(value)) {
            return value === ' ' ? '<p><br></p>' : value;
        }
        const isEncodedOrSanitized: boolean = this.enableHtmlEncode || this.enableHtmlSanitizer;
        const createReplacement: (entity: string) => [string, RegExp] = (entity: string): [string, RegExp] => {
            const replacement: string = isEncodedOrSanitized ? `&amp;amp;${entity}` : `&amp;${entity}`;
            const regexPattern: string = (!this.enableHtmlEncode && this.enableHtmlSanitizer)
                ? `&(${entity})`
                : `&(amp;)*(${entity})`;
            const regExp: RegExpConstructor = RegExp;
            const regex: RegExp = new regExp(regexPattern, 'g');
            return [replacement, regex];
        };
        const entities: string[] = ['times', 'divide', 'ne'];
        const replacementsAndRegexes: [string, RegExp][] = entities.map(createReplacement);
        for (const [replacement, regex] of replacementsAndRegexes) {
            if (regex.test(value)) {
                value = value.replace(regex, replacement);
            }
        }
        return value;
    }

    private updatePanelValue(): void {
        this.setProperties({ value: this.replaceEntities(this.value) }, true);
        let value: string = this.editorMode === 'HTML' && !isNOU(this.value) ? this.listOrderCorrection(this.value) : this.value;
        value = (this.enableHtmlEncode && this.value) ? decode(value) : value;
        const getTextArea: HTMLInputElement = this.element.querySelector('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA);
        if (value) {
            if (!isNOU(getTextArea) && this.rootContainer.classList.contains('e-source-code-enabled')) {
                getTextArea.value = alignmentHtml(this.value);
            }
            if (this.valueContainer) {
                this.valueContainer.value = (this.enableHtmlEncode) ? this.value : value;
            }
            if (this.editorMode === 'HTML' && this.inputElement && this.inputElement.innerHTML.trim() !== value.trim()) {
                this.inputElement.innerHTML = resetContentEditableElements(value, this.editorMode);
            } else if (this.editorMode === 'Markdown' && this.inputElement
                && (this.inputElement as HTMLTextAreaElement).value.trim() !== value.trim()) {
                (this.inputElement as HTMLTextAreaElement).value = value;
            }
        } else {
            if (!isNOU(getTextArea) && this.rootContainer.classList.contains('e-source-code-enabled')) {
                getTextArea.value = '';
            }
            if (this.editorMode === 'HTML') {
                if (this.enterKey === 'DIV') {
                    this.inputElement.innerHTML = '<div><br/></div>';
                } else if (this.enterKey === 'BR') {
                    this.inputElement.innerHTML = '<br/>';
                } else {
                    this.inputElement.innerHTML = '<p><br/></p>';
                }
            } else {
                (this.inputElement as HTMLTextAreaElement).value = '';
            }
            if (this.valueContainer) {
                this.valueContainer.value = '';
            }
        }
        if (this.showCharCount) {
            this.countModule.refresh();
        }
    }
    private listOrderCorrection(value: string): string {
        const valueElementWrapper: HTMLElement = this.createElement('div');
        valueElementWrapper.innerHTML = value;
        const listElements: NodeListOf<Element> = valueElementWrapper.querySelectorAll('UL, OL');
        for (let i: number = 0; i < listElements.length; i++) {
            if (!isNOU(listElements[i as number]) && !isNOU(listElements[i as number].parentElement) && !isNOU(listElements[i as number].previousElementSibling) && (listElements[i as number].parentElement.nodeName === 'UL' || listElements[i as number].parentElement.nodeName === 'OL')) {
                listElements[i as number].previousElementSibling.appendChild(listElements[i as number]);
            }
        }
        return valueElementWrapper.innerHTML;
    }
    private setHeight(height: string | number): void {
        if (height !== 'auto') {
            this.element.style.height = formatUnit(height);
        } else {
            this.element.style.height = 'auto';
        }
        if (this.toolbarSettings.type === 'Expand' && (typeof (this.height) === 'string' &&
            this.height.indexOf('px') > -1 || typeof (this.height) === 'number')) {
            this.element.classList.add(classes.CLS_RTE_FIXED_TB_EXPAND);
        } else {
            this.element.classList.remove(classes.CLS_RTE_FIXED_TB_EXPAND);
        }
    }
    /**
     * setPlaceHolder method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setPlaceHolder(): void {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
            if (this.editorMode !== 'Markdown') {
                if (!this.placeHolderWrapper || !this.inputElement.parentElement.contains(this.placeHolderWrapper)) {
                    this.placeHolderWrapper = this.createElement('span', { className: 'e-rte-placeholder' + ' ' + this.getCssClass() });
                    if (this.fontSize.default) {
                        this.placeHolderWrapper.style.fontSize = this.fontSize.default;
                    }
                    if (this.inputElement) {
                        this.inputElement.parentElement.insertBefore(this.placeHolderWrapper, this.inputElement);
                    }
                }
                this.placeHolderWrapper.innerHTML = this.placeholder;
                if (this.inputElement.textContent.length === 0 && this.inputElement.childNodes.length < 2 && !isNOU(this.inputElement.firstChild) && (this.inputElement.firstChild.nodeName === 'BR' ||
                    ((this.inputElement.firstChild.nodeName === 'P' || this.inputElement.firstChild.nodeName === 'DIV') && !isNOU(this.inputElement.firstChild.firstChild) &&
                        this.inputElement.firstChild.childNodes.length < 2 && this.inputElement.firstChild.firstChild.nodeName === 'BR'))) {
                    this.placeHolderWrapper.classList.add('e-placeholder-enabled');
                    EventHandler.add(this.inputElement as HTMLElement, 'input', this.setPlaceHolder, this);
                } else {
                    this.placeHolderWrapper.classList.remove('e-placeholder-enabled');
                    EventHandler.remove(this.inputElement as HTMLElement, 'input', this.setPlaceHolder);
                }
            } else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
            }
        }
        if (this.placeholder && this.iframeSettings.enable && this.inputElement) {
            if (this.inputElement.textContent.length === 0 && this.inputElement.childNodes.length < 2 && !isNOU(this.inputElement.firstChild) && (this.inputElement.firstChild.nodeName === 'BR' ||
                ((this.inputElement.firstChild.nodeName === 'P' || this.inputElement.firstChild.nodeName === 'DIV') && !isNOU(this.inputElement.firstChild.firstChild) &&
                    this.inputElement.firstChild.firstChild.nodeName === 'BR'))) {
                addClass([this.inputElement], 'e-rte-placeholder');
                this.inputElement.setAttribute('placeholder', this.placeholder);
                EventHandler.add(this.inputElement as HTMLElement, 'input', this.setPlaceHolder, this);
            } else {
                removeClass([this.inputElement], 'e-rte-placeholder');
                EventHandler.remove(this.inputElement as HTMLElement, 'input', this.setPlaceHolder);
            }
        }
    }

    private setWidth(width: string | number): void {
        if (width !== 'auto') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        } else {
            this.element.style.width = 'auto';
        }
    }
    private setCssClass(cssClass: string): void {
        if (!isNOU(cssClass)) {
            const allClassName: string[] = cssClass.split(' ');
            for (let i: number = 0; i < allClassName.length; i++) {
                if (allClassName[i as number].trim() !== '') {
                    this.element.classList.add(allClassName[i as number]);
                }
            }
        }
    }
    private updateRTL(): void {
        this.notify(events.rtlMode, { enableRtl: this.enableRtl });
        if (this.enableRtl) {
            this.element.classList.add(classes.CLS_RTL);
            this.inputElement.classList.add(classes.CLS_RTL);
        } else {
            this.element.classList.remove(classes.CLS_RTL);
            this.inputElement.classList.remove(classes.CLS_RTL);
        }
    }
    private updateReadOnly(): void {
        this.notify(events.readOnlyMode, { editPanel: this.inputElement, mode: this.readonly });
    }
    /**
     * setReadOnly method
     *
     * @param {boolean} initial - specifies the boolean value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setReadOnly(initial?: boolean): void {
        this.updateReadOnly();
        if (!initial) {
            if (this.readonly && this.enabled) {
                this.unbindEvents();
                this.unWireEvents();
            } else if (this.enabled) {
                this.wireEvents();
            }
        }
    }
    /**
     * Prints all the pages of the RichTextEditor by default.
     *
     * @returns {void}
     */
    public print(): void {
        let printWind: Window;
        const printArgs: PrintEventArgs = {
            element: this.inputElement,
            requestType: 'print',
            cancel: false
        };
        this.trigger(events.actionBegin, printArgs, (printingArgs: PrintEventArgs) => {
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') {
                printWind.resizeTo(screen.availWidth, screen.availHeight);
            }
            if (this.iframeSettings.enable) {
                printWind = openPrintWindow(this.inputElement, printWind);
            } else {
                const wrapper: HTMLElement = document.createElement('div');
                addClass([wrapper], ['e-richtexteditor', 'e-control']);
                const content: HTMLElement = document.createElement('div');
                addClass([content], ['e-rte-content']);
                content.appendChild(this.inputElement.cloneNode(true));
                wrapper.appendChild(content);
                printWind = printWindow(wrapper, printWind);
            }
            if (!printingArgs.cancel) {
                const actionArgs: ActionCompleteEventArgs = {
                    requestType: 'print'
                };
                this.trigger(events.actionComplete, actionArgs);
            }
        });
    }

    /**
     * Refreshes the view of the editor.
     *
     * @returns {void}
     * @public
     */
    public refreshUI(): void {
        this.renderModule.refresh();
        // when the editor mode is markdown or iframe, need to set the height manually
        if (this.editorMode === 'Markdown' || this.iframeSettings.enable) {
            this.autoResize();
        }
        if (!isNOU(this.quickToolbarModule) && !this.quickToolbarModule.isDestroyed) {
            this.quickToolbarModule.refreshQuickToolbarPopup(null);
        }
    }

    /**
     * Displays the Rich Text Editor component in full-screen mode.
     *
     * @returns {void}
     */
    public showFullScreen(): void {
        this.fullScreenModule.showFullScreen();
    }

    /**
     * Enables the specified toolbar items in the Rich Text Editor component.
     *
     * @param {string | string[]} items - A single item or a collection of items to be enabled in the toolbar.
     * @param {boolean} muteToolbarUpdate - Determines whether to mute updates of the toolbar item status in the Rich Text Editor.
     * @returns {void}
     * @public
     */
    public enableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true, muteToolbarUpdate);
    }

    /**
     * Disables the specified toolbar items in the Rich Text Editor component.
     *
     * @param {string | string[]} items - A single item or a collection of items to be disabled in the toolbar.
     * @param {boolean} muteToolbarUpdate - Determines whether to mute updates of the toolbar item status in the Rich Text Editor.
     * @returns {void}
     * @public
     */
    public disableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false, muteToolbarUpdate);
    }

    /**
     * Removes the specified toolbar items from the Rich Text Editor component.
     *
     * @param {string | string[]} items - A single item or a collection of items to be removed from the toolbar.
     * @returns {void}
     * @public
     */
    public removeToolbarItem(items: string | string[]): void {
        this.toolbarModule.removeTBarItems(items);
    }

    /**
     * Get the selected range from the RichTextEditor's content.
     *
     * @returns {void}
     * @public
     * @deprecated
     */
    public getRange(): Range {
        return this.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
    }

    private initializeServices(): void {
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('rteLocale', this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register('dialogRenderObject', new DialogRenderer(this));
        this.serviceLocator.register('popupUploaderObject', new PopupUploader(this));
    }

    private RTERender(): void {
        const rendererFactory: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.fullScreenModule = new FullScreen(this);
        this.enterKeyModule = new EnterKeyAction(this);
        this.renderModule.render();
        this.inputElement = <HTMLElement>this.contentModule.getEditPanel();
        this.setHeight(this.height);
        setAttributes(this.htmlAttributes, this, false, true);
        if (this.iframeSettings) {
            this.setIframeSettings();
        }
        this.setCssClass(this.cssClass);
        this.updateEnable();
        this.setPlaceHolder();
        this.updateRTL();
        this.updateReadOnly();
        this.updatePanelValue();
        if (this.inputElement) {
            this.inputElement.innerHTML = resetContentEditableElements(this.inputElement.innerHTML, this.editorMode);
        }
        if (this.enableHtmlEncode && !isNOU(this.value)) {
            this.setProperties({ value: this.encode(decode(this.value)) });
        }
    }

    private setIframeSettings(): void {
        if (this.iframeSettings.resources) {
            const styleSrc: string[] = this.iframeSettings.resources.styles;
            const scriptSrc: string[] = this.iframeSettings.resources.scripts;
            if (!isNOU(this.iframeSettings.resources.scripts) && this.iframeSettings.resources.scripts.length > 0) {
                this.InjectSheet(true, scriptSrc);
            }
            if (!isNOU(this.iframeSettings.resources.styles) && this.iframeSettings.resources.styles.length > 0) {
                this.InjectSheet(false, styleSrc);
            }
        }
        if (this.iframeSettings.attributes) {
            setAttributes(this.iframeSettings.attributes, this, true, false);
        }
    }
    private InjectSheet(scriptSheet: boolean, srcList: string[]): void {
        try {
            if (srcList && srcList.length > 0) {
                const iFrame: HTMLDocument = this.contentModule.getDocument();
                const target: HTMLElement = iFrame.querySelector('head');
                for (let i: number = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        const scriptEle: HTMLScriptElement = this.createScriptElement();
                        scriptEle.src = srcList[i as number];
                        target.appendChild(scriptEle);
                    } else {
                        const styleEle: HTMLLinkElement = this.createStyleElement();
                        styleEle.href = srcList[i as number];
                        target.appendChild(styleEle);
                    }
                }
            }

        } catch (e) {
            return;
        }
    }
    private createScriptElement(): HTMLScriptElement {
        const scriptEle: HTMLScriptElement = this.createElement('script', {
            className: classes.CLS_SCRIPT_SHEET
        }) as HTMLScriptElement;
        scriptEle.type = 'text/javascript';
        return scriptEle;
    }

    private createStyleElement(): HTMLLinkElement {
        const styleEle: HTMLLinkElement = this.createElement('link', {
            className: classes.CLS_STYLE_SHEET
        }) as HTMLLinkElement;
        styleEle.rel = 'stylesheet';
        return styleEle;
    }

    private setValue(isPropertyChange?: boolean): void {
        if (this.valueTemplate) {
            const regEx: RegExp = new RegExp(/<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i);
            if (typeof this.valueTemplate === 'string' && regEx.test(this.valueTemplate)) {
                this.setProperties({ value: this.valueTemplate });
            } else {
                const compiledTemplate: NodeList = compile(this.valueTemplate)('', this, 'valueTemplate');
                if (typeof this.valueTemplate !== 'string' && this.isReact) {
                    this.displayTempElem = this.createElement('div');
                    for (let i: number = 0; i < compiledTemplate.length; i++) {
                        const item: Element = compiledTemplate[i as number] as Element;
                        append([item], this.displayTempElem);
                    }
                    this.renderTemplates(() => {
                        this.inputElement.innerHTML = resetContentEditableElements(
                            (this.displayTempElem.childNodes[0] as HTMLElement).innerHTML, this.editorMode);
                        this.setProperties({ value: this.inputElement.innerHTML.trim() });
                    });
                } else {
                    let appendElem: HTMLElement = this.element;
                    if (isPropertyChange) {
                        this.inputElement.innerHTML = '';
                        appendElem = this.inputElement;
                    }
                    for (let i: number = 0; i < compiledTemplate.length; i++) {
                        const item: Element = compiledTemplate[i as number] as Element;
                        append([item], appendElem);
                    }
                    const content: string = appendElem.innerHTML.trim();
                    if (content.length > 0) {
                        this.setProperties({ value: content });
                    }
                    this.renderReactTemplates();
                }
            }
        } else {
            // eslint-disable-next-line
            const innerHtml: string = !isNOU(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
            if (innerHtml !== '') {
                if (this.element.tagName === 'TEXTAREA') {
                    this.setProperties({ value: decode(innerHtml) });
                } else {
                    this.setProperties({ value: innerHtml });
                }
            }
        }
    }

    // eslint-disable-next-line
    public renderTemplates(callBack: any): void {
        this.renderReactTemplates(callBack);
    }

    private updateResizeFlag(): void {
        this.isResizeInitialized = true;
    }

    /**
     * Image max width calculation method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getInsertImgMaxWidth(): string | number {
        const maxWidth: string | number = this.insertImageSettings.maxWidth;
        // eslint-disable-next-line
        const imgPadding: number = 12
        const imgResizeBorder: number = 2;
        let editEle: HTMLElement = this.contentModule.getEditPanel() as HTMLElement;
        if (this.editorMode === 'HTML' && !isNOU(this.formatter.editorManager.nodeSelection) && !isNOU(this.formatter.editorManager.nodeSelection.range)) {
            const currentRange: Range = this.formatter.editorManager.nodeSelection.range;
            if (currentRange.startContainer.nodeType !== 3 && (currentRange.startContainer as HTMLElement).closest &&
                !isNOU((currentRange.startContainer as HTMLElement).closest('TD'))) {
                editEle = currentRange.startContainer as HTMLElement;
            }
        }
        const eleStyle: CSSStyleDeclaration = window.getComputedStyle(editEle);
        const editEleMaxWidth: number = editEle.offsetWidth - (imgPadding + imgResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    }

    /**
     * Video max width calculation method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getInsertVidMaxWidth(): string | number {
        const maxWidth: string | number = this.insertVideoSettings.maxWidth;
        // eslint-disable-next-line
        const vidPadding: number = 12
        const vidResizeBorder: number = 2;
        const editEle: HTMLElement = this.contentModule.getEditPanel() as HTMLElement;
        const eleStyle: CSSStyleDeclaration = window.getComputedStyle(editEle);
        const editEleMaxWidth: number = editEle.offsetWidth - (vidPadding + vidResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    }

    /**
     * Retrieves the HTML content from the Rich Text Editor.
     *
     * @returns {string} - The HTML content as a string. If XHTML is enabled, `null` is returned for empty content.
     * @public
     */
    public getHtml(): string {
        const htmlValue: string = cleanupInternalElements(this.contentModule.getEditPanel().innerHTML, this.editorMode);
        return (this.enableXhtml && (htmlValue === '<p><br></p>' || htmlValue === '<div><br></div>' ||
            htmlValue === '<br>') ? null : this.serializeValue(htmlValue));
    }

    /**
     * Retrieves XHTML validated HTML content from the Rich Text Editor
     * when the `enableXhtml` property is set to true.
     *
     * @returns {string} - The XHTML validated HTML content as a string.
     * @public
     */
    public getXhtml(): string {
        let currentValue: string = cleanupInternalElements(this.value, this.editorMode);
        if (!isNOU(currentValue) && this.enableXhtml) {
            currentValue = this.htmlEditorModule.xhtmlValidation.selfEncloseValidation(currentValue);
        }
        return currentValue;
    }

    /**
     * Toggles the display of the HTML/Markdown source code within the editor.
     *
     * @returns {void}
     * @public
     */
    public showSourceCode(): void {
        if (this.readonly) {
            return;
        }
        this.notify(events.sourceCode, {});
    }

    /**
     * Calculates the maximum number of characters currently in the Rich Text Editor.
     *
     * @returns {number} - The total number of characters.
     * @public
     */
    public getCharCount(): number {
        const htmlText: string = this.editorMode === 'Markdown' ? (this.inputElement as HTMLTextAreaElement).value.trim() :
            (this.inputElement as HTMLTextAreaElement).textContent.trim();
        let htmlLength: number;
        if (this.editorMode !== 'Markdown' && htmlText.indexOf('\u200B') !== -1) {
            htmlLength = htmlText.replace(/\u200B/g, '').length;
        } else {
            htmlLength = htmlText.length;
        }
        return htmlLength;
    }

    /**
     * Displays a specified dialog within the Rich Text Editor.
     *
     * @param {DialogType} type - The type of dialog to display.
     * @returns {void}
     * @public
     */
    public showDialog(type: DialogType): void {
        if (type === DialogType.InsertLink) {
            this.notify(events.showLinkDialog, {});
        } else if (type === DialogType.InsertImage) {
            this.notify(events.showImageDialog, {});
        } else if (type === DialogType.InsertAudio) {
            this.notify(events.showAudioDialog, {});
        } else if (type === DialogType.InsertVideo) {
            this.notify(events.showVideoDialog, {});
        } else if (type === DialogType.InsertTable) {
            this.notify(events.showTableDialog, {});
        }
    }

    /**
     * Closes a specified dialog within the Rich Text Editor.
     *
     * @param {DialogType} type - The type of dialog to close.
     * @returns {void}
     * @public
     */
    public closeDialog(type: DialogType): void {
        if (type === DialogType.InsertLink) {
            this.notify(events.closeLinkDialog, {});
        } else if (type === DialogType.InsertImage) {
            this.notify(events.closeImageDialog, {});
        } else if (type === DialogType.InsertAudio) {
            this.notify(events.closeAudioDialog, {});
        } else if (type === DialogType.InsertVideo) {
            this.notify(events.closeVideoDialog, {});
        } else if (type === DialogType.InsertTable) {
            this.notify(events.closeTableDialog, {});
        }
    }

    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getBaseToolbarObject(): BaseToolbar {
        let tbObj: BaseToolbar;
        if (this.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            tbObj = this.quickToolbarModule && this.quickToolbarModule.getInlineBaseToolbar();
        } else {
            tbObj = this.toolbarModule && this.toolbarModule.getBaseToolbar();
        }
        return tbObj;
    }

    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getToolbar(): HTMLElement {
        return this.toolbarModule ? <HTMLElement>this.toolbarModule.getToolbarElement() : null;
    }

    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getToolbarElement(): Element {
        return this.toolbarModule && this.toolbarModule.getToolbarElement();
    }

    /**
     * @returns {void}
     * getID method
     *
     * @hidden
     * @deprecated
     */
    public getID(): string {
        return this.internalID;
    }

    /**
     * Returns the CSS class.
     *
     * @param {boolean} [isSpace] - Specifies whether to include a space before the CSS class.
     * @returns {string} The CSS class.
     * @hidden
     * @deprecated
     */
    public getCssClass(isSpace?: boolean): string {
        return (isNOU(this.cssClass) ? '' : isSpace ? ' ' + this.cssClass : this.cssClass);
    }

    private mouseDownHandler(e: MouseEvent | TouchEvent): void {
        this.isSelectionStartInRTE = true;
        const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        addClass([this.element], [classes.CLS_FOCUS]);
        this.preventDefaultResize(e as MouseEvent);
        this.notify(events.mouseDown, { args: e });
        this.formatter.editorManager.observer.notify(events.mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    }

    private preventImgResize(e: FocusEvent | MouseEvent): void {
        if ((e.target as HTMLElement).nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    }

    /**
     * preventDefaultResize method
     *
     * @param {FocusEvent} e - specifies the event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    // eslint-disable-next-line
    public preventDefaultResize(e: FocusEvent | MouseEvent): void {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
        } else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', false, 'false');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', false, 'false');
        }
    }

    // eslint-disable-next-line
    private defaultResize(e: FocusEvent): void {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().removeEventListener('mscontrolselect', this.preventImgResize);
        } else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', true, 'true');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', true, 'true');
        }
    }

    private resizeHandler(e?: Event): void {
        if (!document.body.contains(this.element)) {
            document.defaultView.removeEventListener('resize', this.resizeHandler, true);
            this.onResizeHandler = null;
            return;
        }
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.toolbarModule.refreshToolbarOverflow();
        }
        this.notify(events.windowResize, { args: e });
        this.autoResize();
    }

    private scrollHandler(e: Event): void {
        if (this.element) {
            this.notify(events.scroll, { args: e });
        }
    }

    private contentScrollHandler(e: Event): void {
        this.notify(events.contentscroll, { args: e });
    }

    private focusHandler(e: FocusEvent): void {
        if ((!this.isRTE || this.isFocusOut)) {
            this.isRTE = this.isFocusOut ? false : true;
            this.isFocusOut = false;
            addClass([this.element], [classes.CLS_FOCUS]);
            if (this.editorMode === 'HTML') {
                this.cloneValue = (this.inputElement.innerHTML === '<p><br></p>' || this.inputElement.innerHTML === '<div><br></div>' ||
                    this.inputElement.innerHTML === '<br>') ? null : this.enableHtmlEncode ?
                        this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
            } else {
                this.cloneValue = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                    (this.inputElement as HTMLTextAreaElement).value;
            }
            const active: Element = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.contentModule.getEditPanel()
                || ((this.iframeSettings.enable && active === this.contentModule.getPanel()) &&
                    e.target && !(e.target as HTMLElement).classList.contains('e-img-inner')
                    && (e.target && (e.target as HTMLElement).parentElement
                        && !(e.target as HTMLElement).parentElement.classList.contains('e-img-wrap')))
                || (!isNOU(this.getToolbarElement()) && closest(active, '.e-rte-toolbar') === this.getToolbarElement())) {
                (this.contentModule.getEditPanel() as HTMLElement).focus();
                if (!isNOU(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    const items: NodeList = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    for (let i: number = 0; i < items.length; i++) {
                        (items[i as number] as HTMLElement).setAttribute('tabindex', '-1');
                    }
                }
            }
            this.preventDefaultResize(e);
            this.trigger('focus', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNOU(this.saveInterval) && this.saveInterval > 0 && !this.autoSaveOnIdle && isNOU(this.timeInterval) && this.editorMode === 'Markdown') {
                this.timeInterval = setInterval(this.updateValueOnIdle.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!this.readonly) {
            const currentFocus: string = this.getCurrentFocus(e);
            if (currentFocus === 'editArea' || currentFocus === 'textArea' || currentFocus === 'sourceCode') {
                this.resetToolbarTabIndex();
            }
        }
    }

    private getUpdatedValue(): string {
        let value: string;
        const getTextArea: HTMLInputElement = this.element.querySelector('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA);
        if (this.editorMode === 'HTML') {
            value = (this.inputElement.innerHTML === '<p><br></p>' || this.inputElement.innerHTML === '<div><br></div>' ||
                    this.inputElement.innerHTML === '<br>') ? null : this.enableHtmlEncode ?
                    this.encode(decode(cleanupInternalElements(this.inputElement.innerHTML, this.editorMode))) :
                    this.inputElement.innerHTML;
            if (this.enableHtmlSanitizer && !isNOU(value) && /&(amp;)*((times)|(divide)|(ne))/.test(value)) {
                value = value.replace(/&(amp;)*(times|divide|ne)/g, '&amp;amp;$2');
            }
            if (!isNOU(getTextArea) && this.rootContainer.classList.contains('e-source-code-enabled')) {
                const textAreaValue: string = this.enableHtmlSanitizer ? this.htmlEditorModule.sanitizeHelper(
                    getTextArea.value) : getTextArea.value;
                value = cleanHTMLString((/&(amp;)*((times)|(divide)|(ne))/.test(textAreaValue) ? textAreaValue.replace(/&(amp;)*(times|divide|ne)/g, '&amp;amp;$2') : textAreaValue), this.element);
            }
        } else {
            value = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                (this.inputElement as HTMLTextAreaElement).value;
        }
        if (value != null && !this.enableHtmlEncode) {
            value = cleanupInternalElements(value, this.editorMode);
        }
        return value;
    }

    private updateValueOnIdle(): void {
        if (!isNOU(this.tableModule) && !isNOU(this.inputElement.querySelector('.e-table-box.e-rbox-select'))) { return; }
        this.setProperties({ value: this.getUpdatedValue() }, true);
        this.valueContainer.value = this.value;
        this.isValueChangeBlurhandler = false;
        this.invokeChangeEvent();
    }

    private updateIntervalValue(): void {
        clearTimeout(this.idleInterval);
        this.idleInterval = setTimeout(this.updateValueOnIdle.bind(this), 0);
    }

    private cleanupResizeElements(args: CleanupResizeElemArgs): void {
        const value: string = cleanupInternalElements(args.value, this.editorMode);
        args.callBack(value);
    }

    public addAnchorAriaLabel(value: string): string {
        const valueElementWrapper: HTMLElement = document.createElement('div');
        valueElementWrapper.innerHTML = value;
        const item: NodeListOf<Element> = valueElementWrapper.querySelectorAll('a');
        if (item.length > 0) {
            for (let i: number = 0; i < item.length; i++) {
                if (item[i as number].hasAttribute('target') && item[i as number].getAttribute('target') === '_blank') {
                    if (!item[i as number].hasAttribute('aria-label') || item[i as number].getAttribute('aria-label') === '') {
                        item[i as number].setAttribute('aria-label', (this.serviceLocator.getService<L10n>('rteLocale') as L10n).getConstant('linkAriaLabel'));
                    }
                }
            }
        }
        return valueElementWrapper.innerHTML;
    }

    private updateStatus(e: StatusArgs): void {
        if (!isNOU(e.html) || !isNOU(e.markdown)) {
            const status: { [key: string]: boolean } = this.formatter.editorManager.undoRedoManager.getUndoStatus();
            const eventArgs: ToolbarStatusEventArgs = {
                undo: status.undo,
                redo: status.redo,
                html: e.html,
                markdown: e.markdown
            };
            this.trigger(events.updatedToolbarStatus, eventArgs);
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        const rteElement: Element = closest(target, '.' + classes.CLS_RTE);
        if (!this.element.contains(e.target as Node) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.getID() + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.notify(events.docClick, { args: e });
        this.removeHrFocus(e);
        const hideQuickToolbarChecker: boolean = this.quickToolbarModule && !this.inlineMode.enable &&
            isNOU(this.quickToolbarModule.inlineQTBar);
        if ((hideQuickToolbarChecker && !isNOU(closest(target, '.' + 'e-toolbar-wrapper'))) || (hideQuickToolbarChecker && (!isNOU(closest(target, '.e-rte-table-resize')) || !isNOU(closest(target, '.e-table-box'))))) {
            this.quickToolbarModule.hideQuickToolbars();
        }
        if (Browser.info.name !== 'msie' && e.detail > 3) {
            e.preventDefault();
        }
        this.handleChecklistDocumentClick(e, target);
    }
    private handleChecklistDocumentClick(e: MouseEvent, target: HTMLElement): void {
        if (this.handleChecklistClick(e, target)) {
            const item: IToolbarItemModel = this.createToolbarCommand();
            const actionBeginArgs: ActionBeginEventArgs = {
                originalEvent: e as unknown as KeyboardEvent,
                item: item
            };
            const currentAction: string = 'toggleChecklist';
            this.formatter.process(this, actionBeginArgs, e,
                                   { action: currentAction });
        }
    }
    private createToolbarCommand(): IToolbarItemModel {
        let item: IToolbarItemModel = null;
        if (isNOU(item)) {
            item = {
                command: 'Checklist',
                subCommand: 'Checklist'
            } as IToolbarItemModel;
        }
        return item;
    }
    private handleChecklistClick(event: MouseEvent, target: HTMLElement): boolean {
        if ((target as HTMLElement).tagName !== 'LI' || !closest(target, '.' + 'e-rte-checklist')) {
            return false;
        }
        const rect: ClientRect = target.getBoundingClientRect();
        const clickX: number = event.clientX;
        if (this.enableRtl) {
            if (clickX <= rect.right) {
                return false;
            }
        } else {
            if (clickX >= rect.left) {
                return false;
            }
        }
        return true;
    }
    private blurHandler(e: FocusEvent): void {
        let trg: Element = e.relatedTarget as Element;
        if (trg) {
            let rteElement: Element = closest(trg, '.' + classes.CLS_RTE);
            if (!rteElement && this.iframeSettings.enable) {
                const iframeElement: HTMLIFrameElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                if (iframeElement && iframeElement.contentWindow.document.body.contains(trg)) {
                    rteElement = closest(iframeElement, '.' + classes.CLS_RTE);
                }
            }
            if (rteElement && rteElement === this.element) {
                this.isBlur = false;
                if (trg === this.getToolbarElement()) {
                    trg.setAttribute('tabindex', '-1');
                }
            } else if (closest(trg, '[aria-owns="' + this.getID() + '"]') || closest(trg, '.' + classes.CLS_RTE_ELEMENTS)) {
                this.isBlur = false;
            } else {
                this.isBlur = true;
                trg = null;
            }
        }
        if (this.isBlur && isNOU(trg)) {
            removeClass([this.element], [classes.CLS_FOCUS]);
            removeSelectionClassStates(this.inputElement);
            this.notify(events.focusChange, {});
            const value: string = this.getUpdatedValue();
            if (!this.rootContainer.classList.contains('e-source-code-enabled')) {
                this.setProperties({ value: value }, true);
            } else {
                this.setProperties({ value: value });
            }
            this.valueContainer.value = this.value;
            this.isValueChangeBlurhandler = true;
            this.invokeChangeEvent();
            this.isFocusOut = true;
            this.isBlur = false;
            dispatchEvent(this.valueContainer, 'focusout');
            this.defaultResize(e);
            this.trigger('blur', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNOU(this.timeInterval)) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            if (!isNOU(this.placeHolderWrapper) && this.element.querySelector('[title = Preview]')) {
                this.placeHolderWrapper.style.display = 'none';
            }
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        } else {
            this.isRTE = true;
        }
        if (!this.readonly && this.getCurrentFocus(e) === 'outside') { this.resetToolbarTabIndex(); }
        this.previousRange = null;
    }

    /**
     * invokeChangeEvent method
     *
     * @returns {void}
     * @param {CustomEvent} args - The arguments associated with the content change event.
     * @hidden
     * @deprecated
     */
    private contentChanged(args: CustomEvent): void {
        const tempSpanToRemove: HTMLElement = this.inputElement.querySelector('.tempSpan');
        if (tempSpanToRemove) {
            detach(tempSpanToRemove);
        }
        if (args && !isNOU(args.detail) && args.detail.click) {
            this.formatter.saveData();
        }
        if (this.autoSaveOnIdle) {
            if (!isNOU(this.saveInterval)) {
                clearTimeout(this.autoSaveTimeOut);
                this.autoSaveTimeOut = setTimeout(this.updateIntervalValue.bind(this), this.saveInterval);
            }
        }
    }

    /**
     * invokeChangeEvent method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public invokeChangeEvent(): void {
        let currentValue: string;
        if (this.enableXhtml) {
            currentValue = this.getXhtml();
        } else {
            currentValue = this.value;
        }
        const eventArgs: ChangeEventArgs = {
            value: currentValue,
            isInteracted: this.isValueChangeBlurhandler
        };
        if (this.value !== cleanupInternalElements(this.cloneValue, this.editorMode)) {
            this.trigger('change', eventArgs);
            this.cloneValue = this.value;
        }
    }
    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public wireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (const element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            // Add the scroll event handler from the inputElement
            EventHandler.add(this.inputElement, 'scroll', this.contentScrollHandler, this);
        }
    }

    private wireContextEvent(): void {
        if (this.quickToolbarSettings.showOnRightClick) {
            EventHandler.add(this.inputElement, 'contextmenu', this.contextHandler, this);
            if (Browser.isDevice) {
                this.touchModule = new EJ2Touch(this.inputElement, { tapHold: this.touchHandler.bind(this), tapHoldThreshold: 500 });
            }
        }
    }

    private unWireContextEvent(): void {
        EventHandler.remove(this.inputElement, 'contextmenu', this.contextHandler);
        if (Browser.isDevice && this.touchModule) {
            this.touchModule.destroy();
        }
    }

    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public unWireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (const element of this.scrollParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (!this.iframeSettings.enable) {
            // Remove the scroll event handler from the inputElement
            EventHandler.remove(this.inputElement, 'scroll', this.contentScrollHandler);
        }
    }

    private touchHandler(e: TapEventArgs): void {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    }

    private contextHandler(e: MouseEvent): void {
        let closestElem: Element = closest((e.target as HTMLElement), 'a, table, img, video, audio, .e-embed-video-wrap');
        if (!closestElem && (e.target as HTMLElement) && (e.target as HTMLElement).classList &&
            ((e.target as HTMLElement).classList.contains(classes.CLS_AUDIOWRAP) ||
                (e.target as HTMLElement).classList.contains(classes.CLS_CLICKELEM))) {
            closestElem = (e.target as HTMLElement).querySelector('audio');
        }
        if (this.inlineMode.onSelection === false || (!isNOU(closestElem) && this.inputElement.contains(closestElem)
            && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A' ||
                closestElem.tagName.toLowerCase() === 'video' || closestElem.tagName.toLowerCase() === 'audio' || closestElem.tagName === 'SPAN'))) {
            e.preventDefault();
        }
    }

    private resetHandler(): void {
        const defaultValue: string = this.valueContainer.defaultValue.trim();
        this.setProperties({ value: defaultValue === '' ? null : defaultValue });
    }

    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public autoResize(): void {
        if (!this.element || !this.originalElement || !this.valueContainer) {
            return;
        }
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                this.setAutoHeight(this.inputElement);
            } else if (this.iframeSettings.enable) {
                const iframeElement: HTMLIFrameElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                if (iframeElement) {
                    this.setAutoHeight(iframeElement);
                }
            }
        } else {
            if (this.editorMode === 'Markdown') {
                const textArea: HTMLTextAreaElement = this.inputElement as HTMLTextAreaElement;
                const otherElemHeight: number = (this.enableResize || this.showCharCount) ? 20 : 0;
                // Three added because of border top of the e-rte-container, bottom of the toolbar wrapper and then bottom of the e-rte-container.
                if (textArea) {
                    textArea.style.height = this.element.clientHeight - (this.toolbarModule.getToolbarHeight() + otherElemHeight + 3) + 'px';
                }
            } else if (this.iframeSettings.enable) {
                const iframe: HTMLIFrameElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                const otherElemHeight: number = (this.enableResize || this.showCharCount) ? 20 : 0;
                // Three added because of border top of the e-rte-container, bottom of the toolbar wrapper and then bottom of the e-rte-container.
                if (iframe && this.toolbarModule) {
                    iframe.style.height = this.element.clientHeight - (this.toolbarModule.getToolbarHeight() + otherElemHeight + 3) + 'px';
                }
            }
        }
    }
    private setAutoHeight(element: HTMLElement): void {
        if (element.nodeName === 'TEXTAREA') {
            element.style.height = 'auto';
            element.style.height = (this.inputElement.scrollHeight + 16) + 'px';
            element.style.overflow = 'hidden';
        } else if (element.nodeName === 'IFRAME') {
            element.style.height = this.inputElement.parentElement.offsetHeight + 'px';
        }
    }
    private checkContentChanged(mutations: MutationRecord[]): boolean {
        return mutations.some((mutation: MutationRecord) => {
            // Check for text content changes
            if (mutation.type === 'characterData') {
                return true;
            }
            // Check for added or removed nodes
            if (mutation.type === 'childList' &&
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                return true;
            }
            // Check for relevant attribute changes (if needed)
            if (mutation.type === 'attributes') {
                const target: Node = mutation.target as HTMLElement;
                if ((target as HTMLElement).isContentEditable && this.inputElement === target) {
                    return false;
                }
                const attributeName: string = mutation.attributeName;
                const currentValue: string = (target as HTMLElement).getAttribute(attributeName);
                const previousValue: string = mutation.oldValue;
                return previousValue !== currentValue;
            }
            return false;
        });
    }
    private wireEvents(): void {
        this.onBlurHandler = this.blurHandler.bind(this);
        this.onFocusHandler = this.focusHandler.bind(this);
        this.onResizeHandler = this.resizeHandler.bind(this);
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        if (this.editorMode === 'HTML') {
            this.mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
                if (mutations.length > 0 && !this.isFocusOut) {
                    if (this.checkContentChanged(mutations)) {
                        this.hasContentChanged = true;
                        // Only set up interval for non-autoSaveOnIdle mode
                        if (!this.autoSaveOnIdle && !isNOU(this.saveInterval) && this.saveInterval > 0) {
                            if (isNOU(this.timeInterval)) {
                                this.timeInterval = setInterval(() => {
                                    if (this.hasContentChanged) {
                                        this.updateValueOnIdle();
                                        this.hasContentChanged = false; // Reset after saving
                                    } else {
                                        clearInterval(this.timeInterval);
                                        this.timeInterval = null;
                                    }
                                }, this.saveInterval);
                            }
                        }
                    } else {
                        // If no changes detected and there's an active interval, clear it
                        if (!this.autoSaveOnIdle && !isNOU(this.timeInterval)) {
                            clearInterval(this.timeInterval);
                            this.timeInterval = null;
                        }
                    }
                }
            });
            this.mutationObserver.observe(this.inputElement, {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: true,
                attributeOldValue: true
            });
        }
        this.on(events.contentChanged, this.contentChanged, this);
        this.on(events.resizeInitialized, this.updateResizeFlag, this);
        this.on(events.updateTbItemsStatus, this.updateStatus, this);
        this.on(events.cleanupResizeElements, this.cleanupResizeElements, this);
        this.on(events.updateValueOnIdle, this.updateValueOnIdle, this);
        this.on(events.autoResize, this.autoResize, this);
        if (this.iframeSettings.enable) {
            this.onLoadHandler = this.iframeEditableElemLoad.bind(this);
            this.contentModule.getEditPanel().addEventListener('load', this.onLoadHandler, true);
        }
        if (this.readonly && this.enabled) {
            return;
        }
        this.bindEvents();
    }
    private restrict(e: MouseEvent | KeyboardEvent): void {
        if (this.maxLength >= 0) {
            const element: string = this.editorMode === 'Markdown' ? this.contentModule.getText() :
                (this.getText().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, ''));
            if (!element) { return; }
            const array: number[] = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            let arrayKey: number;
            for (let i: number = 0; i <= array.length - 1; i++) {
                if ((e as MouseEvent).which === array[i as number]) {
                    if ((e as MouseEvent).ctrlKey && (e as MouseEvent).which === 65) {
                        return;
                    } else if ((e as MouseEvent).which !== 65) {
                        arrayKey = array[i as number];
                        return;
                    }
                }
            }
            if ((element.length >= this.maxLength && this.maxLength !== -1) && (e as MouseEvent).which !== arrayKey) {
                (e as MouseEvent).preventDefault();
            }
        }
    }
    private beforeInputHandler(e: BeforeInputEvent): void {
        if (this.maxLength >= 0) {
            const element: string = this.editorMode === 'Markdown' ? this.contentModule.getText() :
                (this.getText().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, ''));
            if (e.data && element.length >= this.maxLength && !this.isSpecialInputType(e)) {
                e.preventDefault();
            }
        }
    }
    private isSpecialInputType(e: BeforeInputEvent): boolean {
        const allowedKeys: number[] = [8, 16, 17, 37, 38, 39, 40, 46, 65];
        if (e.inputType) {
            return (
                e.inputType.indexOf('delete') !== -1 ||
                e.inputType.indexOf('backward') !== -1 ||
                e.inputType === 'insertLineBreak'
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return allowedKeys.indexOf((e as any).which) !== -1;
    }

    private bindEvents(): void {
        this.keyboardModule = new KeyboardEvents(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs:
                { ...this.formatter.keyConfig, ...this.keyConfig }, eventName: 'keydown'
        });
        if (this.userAgentData && this.userAgentData.getPlatform() === 'Android') {
            EventHandler.add(this.inputElement, 'beforeinput', this.beforeInputHandler, this);
        }
        const formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, 'content-changed', this.contentChanged, this);
        this.mouseDownDebListener = debounce(this.mouseUp, 30);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, this.mouseDownDebListener, this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', this.onResizeHandler, true);
        EventHandler.add(this.inputElement, 'drop', this.handleNonFileDrop, this);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
            EventHandler.add(this.contentModule.getPanel(), 'load', this.iframeLoadHandler, this);
        }
        this.wireScrollElementsEvents();
        // Handle selectionchange to update selection state
        EventHandler.add(this.inputElement.ownerDocument, 'selectionchange', this.selectionChangeHandler, this);
        // Handle mouseup (document-wide to capture outside RTE release)
        EventHandler.add(this.inputElement.ownerDocument, 'mouseup', this.mouseUpHandlerForSelection , this);
    }
    private handleNonFileDrop(e: DragEvent): void {
        if (e.dataTransfer.types[0] !== 'Files') {
            if (this.formatter.getUndoRedoStack().length === 0 && !this.isSelectionInRTE()) {
                this.formatter.saveData();
            }
            setTimeout(() => {
                this.formatter.saveData();
                this.formatter.enableUndo(this);
            }, 0);
        }
    }
    private onIframeMouseDown(e: MouseEvent): void {
        this.isBlur = false;
        this.currentTarget = <HTMLElement>e.target;
        this.notify(events.iframeMouseDown, e);
        this.removeHrFocus(e);
        this.handleChecklistDocumentClick(e, this.currentTarget);
    }

    private inputHandler(): void {
        this.autoResize();
    }

    private editorKeyDown(e: IHtmlKeyboardEvent): void {
        switch (e.event.action) {
        case 'copy':
            this.onCopy(e.event);
            break;
        case 'cut':
            this.onCut(e.event);
            break;
        case 'tab':
            if (this.iframeSettings.enable) {
                this.isBlur = true;
            }
            break;
        case 'print':
            e.event.preventDefault();
            this.print();
            break;
        }
        if (e.callBack && (e.event.action === 'copy' || e.event.action === 'cut' || e.event.action === 'delete')) {
            e.callBack({
                requestType: e.event.action,
                editorMode: 'HTML',
                event: e.event
            });
        }
    }

    private unWireEvents(): void {
        this.element.removeEventListener('focusin', this.onFocusHandler, true);
        this.onFocusHandler = null;
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        this.onBlurHandler = null;
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        this.off(events.contentChanged, this.contentChanged);
        this.off(events.resizeInitialized, this.updateResizeFlag);
        this.off(events.updateTbItemsStatus, this.updateStatus);
        this.off(events.cleanupResizeElements, this.cleanupResizeElements);
        this.off(events.updateValueOnIdle, this.updateValueOnIdle);
        this.off(events.autoResize, this.autoResize);
        if (this.iframeSettings.enable) {
            this.contentModule.getEditPanel().removeEventListener('load', this.onLoadHandler, true);
            this.onLoadHandler = null;
        }
        if (this.readonly && this.enabled) {
            return;
        }
        this.unbindEvents();
    }

    private unbindEvents(): void {
        if (this.keyboardModule && !this.keyboardModule.isDestroyed) {
            this.keyboardModule.destroy();
            this.keyboardModule = null;
        }
        const formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, 'content-changed', this.contentChanged);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, this.mouseDownDebListener);
        this.mouseDownDebListener = null;
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        EventHandler.remove(this.inputElement, 'input', this.inputHandler);
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', this.onResizeHandler, true);
        EventHandler.remove(this.inputElement, 'drop', this.handleNonFileDrop);
        this.onResizeHandler = null;
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
            EventHandler.remove(this.contentModule.getPanel(), 'load', this.iframeLoadHandler);
        }
        if (this.userAgentData && this.userAgentData.getPlatform() === 'Android') {
            EventHandler.remove(this.inputElement, 'beforeinput', this.beforeInputHandler);
        }
        this.unWireScrollElementsEvents();
        EventHandler.remove(this.inputElement.ownerDocument, 'selectionchange', this.selectionChangeHandler);
        EventHandler.remove(this.inputElement.ownerDocument, 'mouseup', this.mouseUpHandlerForSelection);
    }

    /**
     *
     * @param {FocusEvent} e - The focus event.
     * @returns {string} Returns the current focus either `editArea` or `toolbar` or `textArea` or `sourceCode` or `outside` of the RichTextEditor.
     * @hidden
     */
    private getCurrentFocus(e: FocusEvent): string {
        if (e.target === this.inputElement && document.activeElement === this.inputElement) {
            return 'editArea';
        } else if (e.target === this.getToolbarElement() || (!isNOU(e.relatedTarget) && closest(e.relatedTarget as Element, '.e-rte-toolbar') === this.getToolbarElement())) {
            return 'toolbar';
        } else if (e.target === this.valueContainer && document.activeElement === this.valueContainer) {
            return 'textArea';
        } else if (!isNOU(e.target) && (e.target as HTMLElement).classList.contains(classes.CLS_RTE_SOURCE_CODE_TXTAREA)
            && document.activeElement === e.target) {
            return 'sourceCode';
        }
        return 'outside';
    }

    /**
     * @returns {void}
     * @hidden
     */
    private resetToolbarTabIndex(): void {
        if (this.getToolbarElement()) {
            const toolbarItem: NodeList = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if ((!(toolbarItem[i as number] as HTMLElement).classList.contains('e-rte-dropdown-btn') &&
                    !(toolbarItem[i as number] as HTMLElement).classList.contains('e-insert-table-btn')) &&
                    (!(toolbarItem[i as number] as HTMLElement).hasAttribute('tabindex') ||
                        (toolbarItem[i as number] as HTMLElement).getAttribute('tabindex') !== '-1')) {
                    (toolbarItem[i as number] as HTMLElement).setAttribute('tabindex', '-1');
                }
            }
        }
    }

    private getRenderedQuickToolbarElem(): HTMLElement | null {
        if (!isNOU(this.quickToolbarModule)) {
            const quickToolbars: IBaseQuickToolbar[] = this.quickToolbarModule.getQuickToolbarInstance();
            for (let i: number = 0; i < quickToolbars.length; i++) {
                if (quickToolbars[i as number] && quickToolbars[i as number].isRendered) {
                    return quickToolbars[i as number].element;
                }
            }
        }
        return null;
    }

    private iframeLoadHandler(): void {
        this.autoResize();
    }

    private iframeEditableElemLoad(): void {
        this.autoResize();
    }

    /**
     * Clears the undo and redo stacks and resets the undo and redo toolbar status to disable the buttons.
     *
     * @returns {void}
     * @public
     */
    public clearUndoRedo(): void {
        if (!isNullOrUndefined(this.formatter)) {
            this.formatter.clearUndoRedoStack();
            this.formatter.enableUndo(this);
        }
    }

    private removeHrFocus(e: MouseEvent): void {
        if (e.target && this.inputElement.querySelector('hr.e-rte-hr-focus')) {
            const hr: HTMLElement = this.inputElement.querySelector('hr.e-rte-hr-focus');
            hr.classList.remove('e-rte-hr-focus');
            if (hr.classList.length === 0) {
                hr.removeAttribute('class');
            }
        }
    }
    /**
     * Utility to check if selection is within RTE
     *
     * @private
     * @returns {boolean} `true` if the selection is within the RTE; otherwise, `false`.
     */
    public isSelectionInRTE(): boolean {
        const selection: Selection = this.contentModule.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            const range: Range = selection.getRangeAt(0);
            if (range && (this.inputElement.contains(range.startContainer) &&
                this.inputElement.contains(range.endContainer))) {
                return true;
            }
        }
        return false;
    }

    // EventHandler for selectionchange event
    private selectionChangeHandler(event: Event): void {
        if (this.isSelectionInRTE() && !this.isSelectionCollapsed() && this.isSelectionStartInRTE) {
            this.isSelecting = true;
        }
        if (this.isSelectionInRTE()) {
            this.updateUndoRedoStack(event, true);
        }
    }

    // Checks the selection is within RTE
    private isMouseUpOutOfRTE(event: Event): boolean {
        const isTargetDocument: boolean = event.target && ((event.target as HTMLElement).nodeName === 'HTML' || (event.target as HTMLElement).nodeName === '#document');
        const isTargetNotRteElements: boolean = !(event.target && (event.target as HTMLElement).nodeName !== '#text' &&
            (event.target as HTMLElement).nodeName !== '#document' && (event.target as HTMLElement).nodeName !== 'HTML' &&
            ((event.target as HTMLElement).closest('.e-rte-elements') || (event.target as HTMLElement).closest('.e-rte-toolbar')));
        if (isTargetDocument || (!this.inputElement.contains(event.target as HTMLElement) && isTargetNotRteElements)) {
            return true;
        }
        return false;
    }

    // EventHandler for mouseup event
    private mouseUpHandlerForSelection(event: MouseEvent): void {
        if (this.isSelecting && this.isMouseUpOutOfRTE(event)) {
            this.endSelection(event);
        }
        this.isSelectionStartInRTE = false;
    }

    // End selection and trigger onTextSelection
    private endSelection(e: MouseEvent | KeyboardEvent): void {
        this.handleSelectionChange(e);
        this.isSelecting = false;
    }

    // Checks range is collapsed or not
    private isSelectionCollapsed(): boolean {
        const selection: Selection = this.contentModule.getDocument().getSelection();
        const range: Range = selection && selection.rangeCount !== 0 && selection.getRangeAt(0);
        return (range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset);
    }

    // Handles selection changes and updates toolbar and quick toolbar based on user interaction
    private handleSelectionChange(e: MouseEvent | KeyboardEvent): void {
        // If selection was made and mouseup occurred (even outside the RTE), trigger quick toolbars
        if (this.inlineMode.enable === true) {
            this.notify(events.selectionChangeMouseUp, { args: e });
        }
        // Determine if quick toolbar should be rendered based on settings and event type
        const shouldRenderQuickToolbar: boolean | (string | IToolbarItems)[] = (!this.inlineMode.enable && this.quickToolbarSettings && (this.quickToolbarSettings.text || (this.quickToolbarSettings.link && e.type === 'mouseup')));
        // Render quick toolbar and notify selectionChangeMouseUp for quicktoolbar functionalities
        if (shouldRenderQuickToolbar) {
            this.notify(events.renderQuickToolbar, { args: e });
            this.notify(events.selectionChangeMouseUp, { args: e });
        }
        // Update the toolbar to reflect current selection state
        if (!(this.quickToolbarModule.linkQTBar && this.quickToolbarModule.linkQTBar.element && this.quickToolbarModule.linkQTBar.element.classList.contains('e-popup-open'))) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerSelectionChanged();
    }

}
