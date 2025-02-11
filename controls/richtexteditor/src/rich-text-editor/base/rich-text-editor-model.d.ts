import { Component, ModuleDeclaration, EventHandler, Complex, Browser, EmitType, addClass, detach } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, formatUnit, L10n, closest } from '@syncfusion/ej2-base';import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, compile, append, extend, debounce } from '@syncfusion/ej2-base';import { Touch as EJ2Touch, TapEventArgs } from '@syncfusion/ej2-base';import { getScrollableParent, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';import * as events from '../base/constant';import * as classes from '../base/classes';import { Render } from '../renderer/render';import { ViewSource } from '../renderer/view-source';import { IRenderer, IFormatter, PrintEventArgs, ActionCompleteEventArgs, ActionBeginEventArgs, ImageDropEventArgs, IFormatPainterArgs, CleanupResizeElemArgs, IBaseQuickToolbar, SlashMenuItemSelectArgs, ImageSuccessEventArgs, ImageFailedEventArgs } from './interface';import { IExecutionGroup, executeGroup, CommandName, ResizeArgs, StatusArgs, ToolbarStatusEventArgs } from './interface';import { BeforeQuickToolbarOpenArgs, ChangeEventArgs, AfterImageDeleteEventArgs, AfterMediaDeleteEventArgs, PasteCleanupArgs } from './interface';import { ILinkCommandsArgs, IImageCommandsArgs, IAudioCommandsArgs, IVideoCommandsArgs, BeforeSanitizeHtmlArgs, ITableCommandsArgs, ExecuteCommandOption } from './interface';import { ServiceLocator } from '../services/service-locator';import { RendererFactory } from '../services/renderer-factory';import { RenderType, DialogType } from './enum';import { EditorMode, ShiftEnterKey, EnterKey } from './../../common/types';import { Toolbar } from '../actions/toolbar';import { ExecCommandCallBack } from '../actions/execute-command-callback';import { KeyboardEvents, KeyboardEventArgs } from '../actions/keyboard';import { FontFamilyModel, FontSizeModel, FontColorModel, FormatModel, BackgroundColorModel, NumberFormatListModel, BulletFormatListModel } from '../models/models';import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, AudioSettingsModel, VideoSettingsModel, TableSettingsModel } from '../models/models';import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel, FileManagerSettingsModel, FormatPainterSettingsModel, EmojiSettingsModel, ImportWordModel, ExportWordModel, ExportPdfModel } from '../models/models';import { ToolbarSettings, ImageSettings, AudioSettings, VideoSettings, QuickToolbarSettings, FontFamily, FontSize, Format, NumberFormatList, BulletFormatList, FormatPainterSettings, EmojiSettings, ImportWord, ExportWord, ExportPdf } from '../models/toolbar-settings';import { FileManagerSettings } from '../models/toolbar-settings';import { TableSettings, PasteCleanupSettings } from '../models/toolbar-settings';import { FontColor, BackgroundColor } from '../models/toolbar-settings';import { IFrameSettings } from '../models/iframe-settings';import { InlineMode } from '../models/inline-mode';import { Link } from '../renderer/link-module';import { Image } from '../renderer/image-module';import { Audio } from '../renderer/audio-module';import { Video } from '../renderer/video-module';import { Table } from '../renderer/table-module';import { Count } from '../actions/count';import { HtmlEditor } from '../actions/html-editor';import { MarkdownEditor } from '../actions/markdown-editor';import { defaultLocale } from '../models/default-locale';import { setAttributes } from '../actions/html-attributes';import { BaseToolbar } from '../actions/base-toolbar';import { QuickToolbar } from '../actions/quick-toolbar';import { FullScreen } from '../actions/full-screen';import { PasteCleanup } from '../actions/paste-clean-up';import { ImportExport } from '../actions/import-export';import { EnterKeyAction } from '../actions/enter-key';import * as CONSTANT from '../../common/constant';import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';import { dispatchEvent, getEditValue, isIDevice, decode, isEditableValueEmpty, getDefaultValue } from '../base/util';import { scrollToCursor } from '../../common/util';import { DialogRenderer } from '../renderer/dialog-renderer';import { SelectedEventArgs, RemovingEventArgs, UploadingEventArgs, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';import { Resize } from '../actions/resize';import { FileManager } from '../actions/file-manager';import { FormatPainter } from '../actions/format-painter';import { EmojiPicker } from '../actions/emoji-picker';import { SlashMenuSettings } from '../models/slash-menu-settings';import { SlashMenuSettingsModel } from '../models/slash-menu-settings-model';import { SlashMenu} from '../renderer/slash-menu';import { mentionRestrictKeys } from '../../common/config';import { isSafari } from '../../common/util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RichTextEditor
 */
export interface RichTextEditorModel extends ComponentModel{

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
     * type: ToolbarType.Expand,
     * items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
     * 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'],
     * itemConfigs: {}
     * }
     */
    toolbarSettings?: ToolbarSettingsModel;

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
    slashMenuSettings?: SlashMenuSettingsModel;

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
     * actionOnScroll: 'hide',
     * link: ['Open', 'Edit', 'UnLink'],
     * image: ['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink', 'Display', 'AltText', 'Dimension'],
     * audio: ['AudioReplace', 'AudioRemove', 'AudioLayoutOption'],
     * video: ['VideoReplace', 'VideoAlign', 'VideoRemove', 'VideoLayoutOption', 'VideoDimension'],
     * }
     */
    quickToolbarSettings?: QuickToolbarSettingsModel;

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
    pasteCleanupSettings?: PasteCleanupSettingsModel;

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
    formatPainterSettings?: FormatPainterSettingsModel;

    /**
     * Configures emoji picker options in the Rich Text Editor.
     * Properties:
     * * iconsSet: Array representing emoji icons.
     * * showSearchBox: Enables/disables the search box.
     *
     *
     */
    emojiPickerSettings?: EmojiSettingsModel;

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
    iframeSettings?: IFrameSettingsModel;

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
     *   path: null
     * }
     */
    insertImageSettings?: ImageSettingsModel;

    /**
     * Configures the options for importing Word files in the Rich Text Editor component.
     * The `serviceUrl` property specifies the server endpoint URL where the uploaded Word file will be processed.
     *
     * @default
     * {
     *   serviceUrl: null
     * }
     */
    importWord?: ImportWordModel;

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
    exportWord?: ExportWordModel;

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
    exportPdf?: ExportPdfModel;

    /**
     * Defines the options for inserting audio files in the Rich Text Editor, including properties such as:
     * - `allowedTypes`: Specifies the file extensions for audio files allowed to be inserted, listed as a comma-separated string (e.g., '.wav', '.mp3').
     * - `layoutOption`: Sets the default layout for audio files when inserted into the Rich Text Editor. The options are 'Inline' and 'Break'.
     * - `saveFormat`: Determines the format used to store audio files in the Rich Text Editor, either 'Base64' or 'Blob'.
     *   > Choose 'Base64' for frequently inserted small audio files without the need for a specific storage location.
     * - `saveUrl`: Provides the service URL responsible for handling audio file uploads and storage on the server.
     * - `path`: Specifies the storage path for audio files and the reference for displaying them.
     *
     * @default
     * {
     *   allowedTypes: ['.wav', '.mp3', '.m4a', '.wma'],
     *   layoutOption: 'Inline',
     *   saveFormat: 'Blob',
     *   saveUrl: null,
     *   path: null
     * }
     */
    insertAudioSettings?: AudioSettingsModel;

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
     *
     * @default
     * {
     *   allowedTypes: ['.mp4', '.mov', '.wmv', '.avi'],
     *   layoutOption: 'Inline',
     *   width: 'auto',
     *   height: 'auto',
     *   saveFormat: 'Blob',
     *   saveUrl: null,
     *   path: null
     * }
     */
    insertVideoSettings?: VideoSettingsModel;

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
    tableSettings?: TableSettingsModel;

    /**
     * Keeps the toolbar fixed at the top of the Rich Text Editor during scrolling and specifies the
     * toolbar's offset from the document's top position.
     *
     * @default 0
     */
    floatingToolbarOffset?: number;

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
    inlineMode?: InlineModeModel;

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
    fileManagerSettings?: FileManagerSettingsModel;

    /**
     * Specifies the width of the Rich Text Editor.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Enables or disables the persistence of the component's state between page reloads.
     * If enabled, the value of the Rich Text Editor is retained.
     *
     * {% codeBlock src='rich-text-editor/enable-persistence/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Configures whether a tooltip should be displayed for the Rich Text Editor toolbar.
     *
     * @default true
     */
    showTooltip?: boolean;

    /**
     * Enables or disables the resizing option in the editor.
     * When enabled, the editor can be resized by dragging the resize icon in its bottom right corner.
     *
     * {% codeBlock src='rich-text-editor/enable-resize/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableResize?: boolean;

    /**
     * Allows specifying additional HTML attributes like title, name, etc.
     * Accepts multiple attributes in a key-value pair format.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies the placeholder text for the content area of the RichTextEditor when it is empty.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * Enables or disables the auto-save option, which performs the save action during idle states after content changes.
     * If enabled, the editor will save content in idle state based on the `saveInterval` property's value.
     * The change event is triggered if the content has been modified since the last saved state.
     *
     * @default false
     */
    autoSaveOnIdle?: boolean;

    /**
     * Disables user interactions on the component when set to true.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Indicates whether the component is enabled or disabled.
     *
     * {% codeBlock src='rich-text-editor/enabled/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Indicates whether to allow cross-site scripting (XSS) or not.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Determines if source code should be displayed in an encoded format.
     *
     * @default false
     */
    enableHtmlEncode?: boolean;

    /**
     * Indicates whether XHTML is enabled or not.
     *
     * @default false
     */
    enableXhtml?: boolean;

    /**
     * Specifies the height of the Rich Text Editor component.
     *
     * @default "auto"
     */
    height?: string | number;

    /**
     * Specifies the CSS class name appended to the root element of the RichTextEditor.
     * Multiple custom CSS classes can be added.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the initial content to be displayed in the RichTextEditor's content area. It should be a string.
     * The editor's content can also be dynamically loaded from a database, AJAX, etc.
     *
     * {% codeBlock src='rich-text-editor/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    value?: string;

    /**
     * Specifies the tag to be inserted when the enter key is pressed.
     *
     * - `P`: Pressing enter inserts a `p` tag. The default value will be `<p><br></p>`.
     * - `DIV`: Inserts a `div` tag instead of the default `P` tag.
     * - `BR`: Inserts a `br` tag instead of the default `P` tag.
     *
     * @default 'P'
     */
    enterKey?: EnterKey;

    /**
     * Specifies tags to be inserted when the Shift + Enter keys are pressed.
     *
     * - `BR` - When the Shift + Enter key is pressed, a `br` tag will be inserted, which is the default behavior.
     * - `P` - When the Shift + Enter key is pressed, a `p` tag will be inserted instead of the default `br` tag.
     * - `DIV` - When the Shift + Enter key is pressed, a `div` tag will be inserted instead of the default `br` tag.
     *
     * @default 'BR'
     */
    shiftEnterKey?: ShiftEnterKey;

    /**
     * Specifies the number of undo history steps stored in the undo/redo manager.
     *
     * {% codeBlock src='rich-text-editor/undo-redo-steps/index.md' %}{% endcodeBlock %}
     *
     * @default 30
     */
    undoRedoSteps?: number;

    /**
     * Specifies the interval time in milliseconds for storing actions in the undo/redo manager.
     * The minimum value is 300 milliseconds.
     *
     * @default 300
     */
    undoRedoTimer?: number;

    /**
     * Defines the mode of the RichTextEditor.
     *
     * - `HTML`: Render as an HTML editor using an `<IFRAME>`, content editable `<div>`, or `<textarea>`.
     * - `Markdown`: Render as a Markdown editor using a `<textarea>`.
     *
     * @default 'HTML'
     */
    editorMode?: EditorMode;

    /**
     * Customizes key actions in the RichTextEditor.
     * For example, German keyboard users can customize key actions using these shortcuts.
     *
     * {% codeBlock src='rich-text-editor/keyconfig/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    keyConfig?: { [key: string]: string };

    /**
     * Enables or disables the display of the character counter.
     *
     * {% codeBlock src='rich-text-editor/show-char-count/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    showCharCount?: boolean;

    /**
     * Allows the tab key action in the Rich Text Editor content.
     *
     * {% codeBlock src='rich-text-editor/enable-tab-key/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableTabKey?: boolean;

    /**
     * Enable `enableAutoUrl` to accept the given URL (relative or absolute) without validating the URL for hyperlinks.
     * Otherwise, the given URL will automatically convert to an absolute path URL by prefixing it with `https://` for hyperlinks.
     *
     * {% codeBlock src='rich-text-editor/enable-autourl/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableAutoUrl?: boolean;

    /**
     * Specifies the maximum number of characters allowed in the Rich Text Editor.
     *
     * {% codeBlock src='rich-text-editor/max-length/index.md' %}{% endcodeBlock %}
     *
     * @default -1
     */
    maxLength?: number;

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
    format?: FormatModel;

    /**
     * Predefines advanced list types that populate the numberFormatList dropdown in the toolbar.
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
    numberFormatList?: NumberFormatListModel;

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
    bulletFormatList?: BulletFormatListModel;

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
    fontFamily?: FontFamilyModel;

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
    fontSize?: FontSizeModel;

    /**
     * Defines the color palette for the font color toolbar command.
     *
     * {% codeBlock src='rich-text-editor/font-color/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * columns: 10,
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
    fontColor?: FontColorModel;

    /**
     * Defines the color palette for the background color (text highlight color) toolbar command.
     *
     * {% codeBlock src='rich-text-editor/background-color/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * columns: 5,
     * colorCode: {
     * 'Custom': ['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#0000ff', '#ff0000',
     * '#000080', '#008080', '#008000', '#800080', '#800000', '#808000',
     * '#c0c0c0', '#000000', '']
     * }
     * }
     */
    backgroundColor?: BackgroundColorModel;

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
    valueTemplate?: string | Function;

    /**
     * Specifies the save interval in milliseconds for automatically saving the content.
     * The change event is triggered if the content changes from the last saved interval.
     *
     * {% codeBlock src='rich-text-editor/save-interval/index.md' %}{% endcodeBlock %}
     *
     * @default 10000
     */
    saveInterval?: number;

    /**
     * This event triggers before executing a command via toolbar items.
     * Cancel this event to prevent the command from executing by setting the `cancel` argument to `true`.
     *
     * @event 'actionBegin'
     */
    actionBegin?: EmitType<ActionBeginEventArgs>;

    /**
     * This event triggers after executing a command via toolbar items.
     *
     * @event 'actionComplete'
     */
    actionComplete?: EmitType<ActionCompleteEventArgs>;

    /**
     * This event triggers before a dialog is opened.
     * Cancel this event to prevent the dialog from opening by setting the `cancel` argument to `true`.
     *
     * @event 'beforeDialogOpen'
     */
    beforeDialogOpen?: EmitType<BeforeOpenEventArgs>;

    /**
     * This event triggers when a dialog is opened.
     *
     * @event 'dialogOpen'
     */
    dialogOpen?: EmitType<Object>;

    /**
     * This event triggers before a dialog is closed.
     * Cancel this event to prevent the dialog from closing by setting the `cancel` argument to `true`.
     *
     * @event 'beforeDialogClose'
     */
    beforeDialogClose?: EmitType<BeforeCloseEventArgs>;

    /**
     * This event triggers after a dialog has been closed.
     *
     * @event 'dialogClose'
     */
    dialogClose?: EmitType<Object>;

    /**
     * This event triggers before the quick toolbar opens.
     *
     * @event 'beforeQuickToolbarOpen'
     */
    beforeQuickToolbarOpen?: EmitType<BeforeQuickToolbarOpenArgs>;

    /**
     * This event triggers when the quick toolbar is opened.
     *
     * @event 'quickToolbarOpen'
     */
    quickToolbarOpen?: EmitType<Object>;

    /**
     * This event triggers after the quick toolbar has been closed.
     *
     * @event 'quickToolbarClose'
     */
    quickToolbarClose?: EmitType<Object>;

    /**
     * This event is deprecated and no longer works. Use the `updatedToolbarStatus` event for undo/redo status.
     *
     * @deprecated
     * @event 'toolbarStatusUpdate'
     */
    toolbarStatusUpdate?: EmitType<Object>;

    /**
     * This event triggers when the toolbar items status is updated.
     *
     * @event 'updatedToolbarStatus'
     */
    updatedToolbarStatus?: EmitType<ToolbarStatusEventArgs>;

    /**
     * This event triggers when an image is selected or dragged into the insert image dialog.
     *
     * @event 'imageSelected'
     */
    imageSelected?: EmitType<SelectedEventArgs>;

    /**
     * This event triggers before the image upload process starts.
     *
     * @event 'beforeImageUpload'
     */
    beforeImageUpload?: EmitType<BeforeUploadEventArgs>;

    /**
     * This event triggers when an image upload begins in the insert image dialog.
     * It provides access to the upload details through the event arguments.
     *
     * @event 'imageUploading'
     */
    imageUploading?: EmitType<UploadingEventArgs>;

    /**
     * This event triggers when an image has been successfully uploaded to the server side.
     *
     * @event 'imageUploadSuccess'
     */
    imageUploadSuccess?: EmitType<ImageSuccessEventArgs>;

    /**
     * This event triggers when there is an error during image upload.
     *
     * @event 'imageUploadFailed'
     */
    imageUploadFailed?: EmitType<ImageFailedEventArgs>;

    /**
     * This event triggers when a selected image is removed from the insert image dialog.
     *
     * @event 'imageRemoving'
     */
    imageRemoving?: EmitType<RemovingEventArgs>;

    /**
     * This event triggers when a selected image is removed from the Rich Text Editor content.
     *
     * @event 'afterImageDelete'
     */
    afterImageDelete?: EmitType<AfterImageDeleteEventArgs>;

    /**
     * This event triggers when media is selected or dragged into the insert media audio/video dialog.
     *
     * @event 'fileSelected'
     */
    fileSelected?: EmitType<SelectedEventArgs>;

    /**
     * This event triggers before the media audio/video upload process starts.
     *
     * @event 'beforeFileUpload'
     */
    beforeFileUpload?: EmitType<BeforeUploadEventArgs>;

    /**
     * This event triggers when media begins uploading in the insert media audio/video dialog.
     *
     * @event 'fileUploading'
     */
    fileUploading?: EmitType<UploadingEventArgs>;

    /**
     * This event triggers when media has been successfully uploaded to the server side.
     *
     * @event 'fileUploadSuccess'
     */
    fileUploadSuccess?: EmitType<Object>;

    /**
     * This event triggers when there is an error during media upload.
     *
     * @event 'fileUploadFailed'
     */
    fileUploadFailed?: EmitType<Object>;

    /**
     * This event triggers when selected media is removed from the insert audio/video dialog.
     *
     * @event 'fileRemoving'
     */
    fileRemoving?: EmitType<RemovingEventArgs>;

    /**
     * This event triggers when selected media is removed from the Rich Text Editor content.
     *
     * @event 'afterMediaDelete'
     */
    afterMediaDelete?: EmitType<AfterMediaDeleteEventArgs>;

    /**
     * This event triggers when the Rich Text Editor is rendered.
     *
     * @event 'created'
     */
    created?: EmitType<Object>;

    /**
     * This event triggers when the Rich Text Editor is destroyed.
     *
     * @event 'destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * This event triggers before sanitizing the value. Applicable only when `editorMode` is `HTML`.
     *
     * @event 'beforeSanitizeHtml'
     */
    beforeSanitizeHtml?: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * This event triggers when the Rich Text Editor loses focus.
     *
     * @event 'blur'
     */
    blur?: EmitType<Object>;

    /**
     * This event triggers when a Rich Text Editor toolbar item is clicked.
     *
     * @event 'toolbarClick'
     */
    toolbarClick?: EmitType<Object>;

    /**
     * This event triggers when the Rich Text Editor gains focus.
     *
     * @event 'focus'
     */
    focus?: EmitType<Object>;

    /**
     * This event triggers when the Rich Text Editor loses focus and changes have been made to the content.
     *
     * @event 'change'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * This event triggers when resizing elements such as tables, images, videos, and the overall Rich Text Editor.
     *
     * @event 'resizing'
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * This event triggers when resizing starts for various elements including tables, images, videos, and the overall editor.
     *
     * @event 'resizeStart'
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * This event triggers when resizing stops for various elements including tables, images, videos, and the overall editor.
     *
     * @event 'resizeStop'
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * This event triggers before cleaning up copied content.
     *
     * @event 'beforePasteCleanup'
     */
    beforePasteCleanup?: EmitType<PasteCleanupArgs>;

    /**
     * This event triggers after cleaning up copied content.
     *
     * @event 'afterPasteCleanup'
     */
    afterPasteCleanup?: EmitType<object>;

    /**
     * This event triggers before an image is dropped.
     *
     * @event 'beforeImageDrop'
     */
    beforeImageDrop?: EmitType<ImageDropEventArgs>;

    /**
     * Customize the `keyCode` to change the key value.
     *
     * {% codeBlock src='rich-text-editor/formatter/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    formatter?: IFormatter;

    /**
     * This event triggers when a slash menu item in the popup is selected by the user using mouse, tap, or keyboard navigation.
     *
     * @event 'slashMenuItemSelect'
     */
    slashMenuItemSelect?: EmitType<SlashMenuItemSelectArgs>;

}