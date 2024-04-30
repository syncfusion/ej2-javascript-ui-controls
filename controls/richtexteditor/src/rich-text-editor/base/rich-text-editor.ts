import { Component, ModuleDeclaration, EventHandler, Complex, Browser, EmitType, addClass, select, detach } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, formatUnit, L10n, closest } from '@syncfusion/ej2-base';
import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, compile, append, extend, debounce } from '@syncfusion/ej2-base';
import { Touch as EJ2Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { getScrollableParent, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { RichTextEditorModel } from './rich-text-editor-model';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Render } from '../renderer/render';
import { ViewSource } from '../renderer/view-source';
import { IRenderer, IFormatter, PrintEventArgs, ActionCompleteEventArgs, ActionBeginEventArgs, ImageDropEventArgs, IFormatPainterArgs, CleanupResizeElemArgs, IBaseQuickToolbar } from './interface';
import { IExecutionGroup, executeGroup, CommandName, ResizeArgs, StatusArgs, ToolbarStatusEventArgs } from './interface';
import { BeforeQuickToolbarOpenArgs, ChangeEventArgs, AfterImageDeleteEventArgs, AfterMediaDeleteEventArgs, PasteCleanupArgs } from './interface';
import { ILinkCommandsArgs, IImageCommandsArgs, IAudioCommandsArgs, IVideoCommandsArgs, BeforeSanitizeHtmlArgs, ITableCommandsArgs, ExecuteCommandOption } from './interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType, ToolbarType, DialogType } from './enum';
import { EditorMode, ShiftEnterKey, EnterKey, ContentHeightSource } from './../../common/types';
import { Toolbar } from '../actions/toolbar';
import { ExecCommandCallBack } from '../actions/execute-command-callback';
import { KeyboardEvents, KeyboardEventArgs } from '../actions/keyboard';
import { FontFamilyModel, FontSizeModel, FontColorModel, FormatModel, BackgroundColorModel, NumberFormatListModel, BulletFormatListModel } from '../models/models';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, AudioSettingsModel, VideoSettingsModel, TableSettingsModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel, FileManagerSettingsModel, FormatPainterSettingsModel, EmojiSettingsModel } from '../models/models';
import { ToolbarSettings, ImageSettings, AudioSettings, VideoSettings, QuickToolbarSettings, FontFamily, FontSize, Format, NumberFormatList, BulletFormatList, FormatPainterSettings, EmojiSettings } from '../models/toolbar-settings';
import { FileManagerSettings } from '../models/toolbar-settings';
import { TableSettings, PasteCleanupSettings } from '../models/toolbar-settings';
import { FontColor, BackgroundColor } from '../models/toolbar-settings';
import { IFrameSettings } from '../models/iframe-settings';
import { InlineMode } from '../models/inline-mode';
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
import { EnterKeyAction } from '../actions/enter-key';
import * as CONSTANT from '../../common/constant';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { dispatchEvent, getEditValue, isIDevice, decode, isEditableValueEmpty, getDefaultValue } from '../base/util';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { SelectedEventArgs, RemovingEventArgs, UploadingEventArgs, BeforeUploadEventArgs } from '@syncfusion/ej2-inputs';
import { Resize } from '../actions/resize';
import { FileManager } from '../actions/file-manager';
import { FormatPainter } from '../actions/format-painter';
import { EmojiPicker } from '../actions/emoji-picker';

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
    private scrollParentElements: HTMLElement[];
    private cloneValue: string;
    private onFocusHandler: EventListenerOrEventListenerObject;
    private onBlurHandler: EventListenerOrEventListenerObject;
    private onResizeHandler: Function;
    private timeInterval: number;
    private idleInterval: number;
    private touchModule: EJ2Touch;
    private defaultResetValue: string;
    private isResizeInitialized: boolean;
    private isValueChangeBlurhandler: boolean;
    private displayTempElem: HTMLElement;
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
    /**
     * @hidden
     * @deprecated
     */
    public emojiPickerModule: EmojiPicker;
    public needsID: boolean;
    /**
     * Specifies the group of items aligned horizontally in the toolbar as well as defined the toolbar rendering type.
     * By default, toolbar is float at the top of the RichTextEditor.
     * When you scroll down, the toolbar will scroll along with the page on Rich Text Editor with the specified offset value.
     * * enable: set boolean value to show or hide the toolbar.
     * * enableFloating: Set Boolean value to enable or disable the floating toolbar.
     * Preserves the toolbar at top of the Rich Text Editor on scrolling.
     * * type: it has two possible options
     * 1. Expand: Hide the overflowing toolbar items in the next row. Click the expand arrow to view overflowing toolbar items
     * 2. MultiRow: The toolbar overflowing items wrapped in the next row.
     * * items: Specifies the array of items aligned horizontally in the toolbar.
     * > | and - can insert a vertical and horizontal separator lines in the toolbar.
     * * itemConfigs: Modify the default toolbar item configuration like icon class.
     *
     * > By default, The toolbar is rendered with scrollable in mobile devices and does not support the toolbar type.
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
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;
    /**
     * Specifies the items to be rendered in quick toolbar based on the target element.
     * * It has following fields:
     * * enable - set boolean value to show or hide the quick toolbar
     * * actionOnScroll - it has two possible options
     * 1. hide: The quickToolbar is closed when the parent element is scrolled.
     * 2. none: The quickToolbar cannot be closed even the parent element is scrolled.
     * * link  - Specifies the items to be rendered in quick toolbar based on link element such as `Open`, `Edit`, and `UnLink`.
     * * image - Specifies the items to be rendered in quick toolbar based on image element such as 'Replace',
     * 'Align', 'Caption', 'Remove', 'InsertLink', 'Display', 'AltText', 'Dimension'.
     * * text	 - Specifies the items to be rendered in quick toolbar based on text element such as 'Cut', 'Copy', 'Paste'.
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
    @Complex<QuickToolbarSettingsModel>({}, QuickToolbarSettings)
    public quickToolbarSettings: QuickToolbarSettingsModel;
    /**
     * Specifies the pasting options in Rich Text Editor component and control with the following properties.
     * * prompt - Set boolean value to enable or disable the prompt when pasting.
     * * deniedAttrs  -  Specifies the attributes to restrict when pasting in RTE.
     * * allowedStyleProps  -  Specifies the allowed style properties when pasting in RTE.
     * * deniedTags	 -  Specifies the tags to restrict when pasting in RTE.
     * * keepFormat	 -   Set boolean value to keep or remove the from when pasting.
     * * plainText	 -   Set boolean value to paste as plain text or not.
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
     * 'top', 'vertical-align', 'visibility', 'white-space', 'width'],
     * deniedTags: null,
     * keepFormat: true,
     * plainText:  false
     * }
     */
    @Complex<PasteCleanupSettingsModel>({}, PasteCleanupSettings)
    public pasteCleanupSettings: PasteCleanupSettingsModel;
    /**
     * Specifies the format painter options in Rich Text Editor with the following properties.
     * * allowedFormats - Sets the tag name selectors  for elements from which the formats  can be copied.
     * * deniedFormats - Sets the selectors  for elements from which formats  cannot be copied.
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
    public formatPainterSettings: FormatPainterSettingsModel
    /**
     * Specifies the emoji picker options in Rich Text Editor with the following properties.
     * * iconsSet – Specify an array of items representing emoji icons.
     * * showSearchBox -  Enables or disables the search box in an emoji picker.
     *
     *
     */
    @Complex<EmojiSettingsModel>({}, EmojiSettings)
    public emojiPickerSettings : EmojiSettingsModel
    /**
     * Specifies the items to be rendered in an iframe mode, and it has the following properties.
     * * enable - Set Boolean value to enable, the editors content is placed in an iframe and isolated from the rest of the page.
     * * attributes - Custom style to be used inside the iframe to display content. This style is added to the iframe body.
     * * resources - we can add both styles and scripts to the iframe.
     * 1. styles[] - An array of CSS style files to inject inside the iframe to display content
     * 2. scripts[] - An array of JS script files to inject inside the iframe
     *
     * {% codeBlock src='rich-text-editor/iframe-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * enable: false,
     * attributes: null,
     * resources: { styles: [], scripts: [] }
     * }
     */
    @Complex<IFrameSettingsModel>({}, IFrameSettings)
    public iframeSettings: IFrameSettingsModel;
    /**
     * Specifies the image insert options in Rich Text Editor component and control with the following properties.
     * * allowedTypes - Specifies the extensions of the image types allowed to insert on bowering and
     * passing the extensions with comma separators. For example, pass allowedTypes as .jpg and .png.
     * * display - Sets the default display for an image when it is inserted in to the RichTextEditor.
     * Possible options are: 'inline' and 'block'.
     * * width - Sets the default width of the image when it is inserted in the RichTextEditor.
     * * saveFormat - Specifies the format to store the image in the Rich Text Editor (Base64 or Blob).
     * > If you want to insert a lot of tiny images in the editor and don't want a specific physical location for
     * saving images, you can opt to save format as Base64.
     * * height - Sets the default height of the image when it is inserted in the RichTextEditor.
     * * saveUrl - Specifies the service URL of save action that will receive the uploaded files and save them in the server.
     * * path - Specifies the path of the location to store the images and refer it to display the images.
     *
     * {% codeBlock src='rich-text-editor/insert-image-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * allowedTypes: ['.jpeg', '.jpg', '.png'],
     * display: 'inline',
     * width: 'auto',
     * height: 'auto',
     * saveFormat: 'Blob'
     * saveUrl: null,
     * path: null,
     * }
     */
    @Complex<ImageSettingsModel>({}, ImageSettings)
    public insertImageSettings: ImageSettingsModel;
    /**
     * Specifies the audio insert options in Rich Text Editor component and control with the following properties.
     * * allowedTypes - Specifies the extensions of the audio types allowed to insert on bowering and
     * passing the extensions with comma separators. For example, pass allowedTypes as .jpg and .png.
     * * layoutOption - Sets the default display for an audio when it is inserted in to the RichTextEditor.
     * Possible options are: 'Inline' and 'Break'.
     * * saveFormat - Specifies the format to store the audio in the Rich Text Editor (Base64 or Blob).
     * > If you want to insert a lot of tiny audios in the editor and don't want a specific physical location for
     * saving audios, you can opt to save format as Base64.
     * * saveUrl - Specifies the service URL of save action that will receive the uploaded files and save them in the server.
     * * path - Specifies the path of the location to store the audios and refer it to display the audios.
     *
     * @default
     * {
     * allowedTypes: ['.wav', '.mp3', '.m4a','.wma'],
     * layoutOption: 'Inline',
     * saveFormat: 'Blob'
     * saveUrl: null,
     * path: null,
     * }
     */
    @Complex<AudioSettingsModel>({}, AudioSettings)
    public insertAudioSettings: AudioSettingsModel;
    /**
     * Specifies the video insert options in Rich Text Editor component and control with the following properties.
     * * allowedTypes - Specifies the extensions of the video types allowed to insert on bowering and
     * passing the extensions with comma separators. For example, pass allowedTypes as .jpg and .png.
     * * layoutOption - Sets the default display for an video when it is inserted in to the RichTextEditor.
     * Possible options are: 'Inline' and 'Break'.
     * * width - Sets the default width of the video when it is inserted in the RichTextEditor.
     * * saveFormat - Specifies the format to store the video in the Rich Text Editor (Base64 or Blob).
     * > If you want to insert a lot of tiny videos in the editor and don't want a specific physical location for
     * saving videos, you can opt to save format as Base64.
     * * height - Sets the default height of the video when it is inserted in the RichTextEditor.
     * * saveUrl - Specifies the service URL of save action that will receive the uploaded files and save them in the server.
     * * path - Specifies the path of the location to store the videos and refer it to display the videos.
     *
     * @default
     * {
     * allowedTypes: ['.mp4', '.mov', '.wmv','.avi'],
     * layoutOption: 'Inline',
     * width: 'auto',
     * height: 'auto',
     * saveFormat: 'Blob'
     * saveUrl: null,
     * path: null,
     * }
     */
    @Complex<VideoSettingsModel>({}, VideoSettings)
    public insertVideoSettings: VideoSettingsModel;
    /**
     * Specifies the table insert options in Rich Text Editor component and control with the following properties.
     * * styles - Class name should be appended by default in table element.
     * It helps to design the table in specific CSS styles always when inserting in editor.
     * * width - Sets the default width of the table when it is inserted in the RichTextEditor.
     * * minWidth - Sets the default minWidth of the table when it is inserted in the RichTextEditor.
     * * maxWidth - Sets the default maxWidth of the table when it is inserted in the RichTextEditor.
     * * resize - To enable resize the table.
     *
     * {% codeBlock src='rich-text-editor/table-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * width: '100%',
     * styles: [{ text: 'Dashed Borders', class: 'e-dashed-borders', command: 'Table', subCommand: 'Dashed' },
     * { text: 'Alternate Rows', class: 'e-alternate-rows', command: 'Table', subCommand: 'Alternate' }],
     * resize: true,
     * minWidth: 0,
     * maxWidth: null,
     * }
     */
    @Complex<TableSettingsModel>({}, TableSettings)
    public tableSettings: TableSettingsModel;
    /**
     * Preserves the toolbar at the top of the Rich Text Editor on scrolling and
     * specifies the offset of the floating toolbar from documents top position
     *
     * @default 0
     */
    @Property(0)
    public floatingToolbarOffset: number;
    /**
     * Enable or disable the inline edit mode.
     * * enable - set boolean value to enable or disable the inline edit mode.
     * * onSelection - If its set to true, upon selecting the text, the toolbar is opened in inline.
     * If its set to false, upon clicking to the target element, the toolbar is opened.
     *
     * {% codeBlock src='rich-text-editor/inline-mode/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * enable: false,
     * onSelection: true
     * }
     */
    @Complex<InlineModeModel>({}, InlineMode)
    public inlineMode: InlineModeModel;
    /**
     * Specifies the image manager options in Rich Text Editor component and control with the following properties.
     * * enable - set boolean value to enable or disable the image manager.
     * * ajaxSettings - Specifies the AJAX settings of the image manager.
     * * contextMenuSettings - Specifies the context menu settings of the image manager.
     * * navigationPaneSettings - Specifies the navigation pane settings of the image manager.
     * * toolbarSettings - Specifies the group of items aligned horizontally in the toolbar.
     * * uploadSettings - Specifies the upload settings for the image manager.
     *
     * @default
     * {
     * enable: false,
     * path: '/',
     * ajaxSettings: { getImageUrl: null, url: null, uploadUrl: null },
     * contextMenuSettings: {
     * visible: true,
     * file: ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'],
     * folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
     * layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll']
     * },
     * navigationPaneSettings: {
     * visible: true,
     * items: [
     * 'NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download',
     * 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'
     * ]
     * },
     * toolbarSettings: { visible: true, items: ['Upload', 'NewFolder'] },
     * uploadSettings: { autoUpload: true, minFileSize: 0, maxFileSize: 30000000, allowedExtensions: '', autoClose: false }
     * }
     */
    @Complex<FileManagerSettingsModel>({}, FileManagerSettings)
    public fileManagerSettings: FileManagerSettingsModel;
    /**
     * Specifies the width of the RichTextEditor.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Enables or disables the persisting component's state between page reloads.
     * If enabled, the value of Rich Text Editor is persisted
     *
     * {% codeBlock src='rich-text-editor/enable-persistence/index.md' %}{% endcodeBlock %}
     *
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specify the value whether tooltip will be displayed for the Rich Text Editor toolbar.
     *
     * @default true.
     */
    @Property(true)
    public showTooltip: boolean;
    /**
     * Enables or disables the resizing option in the editor.
     * If enabled, the Rich Text Editor can be resized by dragging the resize icon in the bottom right corner.
     *
     * {% codeBlock src='rich-text-editor/enable-resize/index.md' %}{% endcodeBlock %}
     *
     * @default false.
     */
    @Property(false)
    public enableResize: boolean;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * It will be accepts n number of attributes in a key-value pair format.
     *
     * @default {}.
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };
    /**
     * Specifies the placeholder for the RichTextEditor’s content used when the Rich Text Editor body is empty.
     *
     * @default null.
     */
    @Property(null)
    public placeholder: string;

    /**
     * Enables or disables the auto-save option which performs the save action while in the idle state after typed content.
     * If enabled, the Rich Text Editor will save the content on idle state with `saveInterval` property's value.
     * The change event will be triggered if the content has changed from the last saved state.
     *
     * @default false.
     */
    @Property(false)
    public autoSaveOnIdle: boolean;

    /**
     * The user interactions on the component are disabled, when set to true.
     *
     * @default false.
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies a value that indicates whether the component is enabled or not.
     *
     * {% codeBlock src='rich-text-editor/enabled/index.md' %}{% endcodeBlock %}
     *
     * @default true.
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * specifies the value whether the source code is displayed with encoded format.
     *
     * @default false.
     */
    @Property(false)
    public enableHtmlEncode: boolean;
    /**
     * Specifies a value that indicates whether the xhtml is enabled or not.
     *
     * @default false.
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
     * Specifies the CSS class name appended with the root element of the RichTextEditor.
     * One or more custom CSS classes can be added to a RichTextEditor.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Specifies the value displayed in the RichTextEditor's content area and it should be string.
     * The content of Rich Text Editor can be loaded with dynamic data such as database, AJAX content, and more.
     *
     * {% codeBlock src='rich-text-editor/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public value: string;
    /**
     * Specifies tag to be inserted when enter key is pressed.
     *
     * - `P` - When the enter key is pressed a `p` tag will be inserted and the default value of the Rich Text Editor will be &lt;p&gt;&lt;br&gt;&lt;/p&gt;.
     *
     * - `DIV` - When the enter key is pressed a `div` tag will be inserted instead of the default `P` tag and the default value of the Rich Text Editor will be &lt;div&gt;&lt;br&gt;&lt;/div&gt;.
     *
     * - `BR` - When the enter key is pressed a `br` tag will be inserted instead of the default `P` tag and the default value of the Rich Text Editor will be &lt;br&gt;.
     *
     * @default 'P'
     */
    @Property('P')
    public enterKey: EnterKey;
    /**
     * Specifies tags to be inserted when shift+enter key is pressed.
     *
     * - `BR` - When the shift + enter key is pressed a `br` tag will be inserted which is the default behavior.
     *
     * - `P` - When the shift + enter key is pressed a `p` tag will be inserted instead of the default `br` tag.
     *
     * - `DIV` - When the shift + enter key is pressed a `div` tag will be inserted instead of the default `br` tag.
     *
     * @default 'BR'
     */
    @Property('BR')
    public shiftEnterKey: ShiftEnterKey;
    /**
     * Specifies the count of undo history which is stored in undoRedoManager.
     *
     * {% codeBlock src='rich-text-editor/undo-redo-steps/index.md' %}{% endcodeBlock %}
     *
     * @default 30
     */
    @Property(30)
    public undoRedoSteps: number;
    /**
     * Specifies the interval value in milliseconds that store actions in undoRedoManager. The minimum value is 300 milliseconds.
     *
     * @default 300
     */
    @Property(300)
    public undoRedoTimer: number;
    /**
     * Specifies the editing mode of the RichTextEditor.
     *
     * - `HTML` - Render Rich Text Editor as HTML editor using &lt;IFRAME&gt; element or content editable &lt;div&gt; element
     * or &lt;textarea&gt; element.
     *
     * - `Markdown` - Render Rich Text Editor as markdown editor using &lt;textarea&gt;.
     *
     * @default 'HTML'
     */
    @Property('HTML')
    public editorMode: EditorMode;
    /**
     * Customizes the key actions in RichTextEditor.
     * For example, when using German keyboard, the key actions can be customized using these shortcuts.
     *
     * {% codeBlock src='rich-text-editor/keyconfig/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public keyConfig: { [key: string]: string };
    /**
     * Sets Boolean value to enable or disable the display of the character counter.
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
     * Enable `enableAutoUrl` to accept the given URL (relative or absolute) without validating the URL for hyperlinks, otherwise
     * the given URL will automatically convert to absolute path URL by prefixing `https://` for hyperlinks.
     *
     * {% codeBlock src='rich-text-editor/enable-autourl/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableAutoUrl: boolean;
    /**
     * Specifies the maximum number of characters allowed in the Rich Text Editor component.
     *
     * {% codeBlock src='rich-text-editor/max-length/index.md' %}{% endcodeBlock %}
     *
     * @default -1
     */
    @Property(-1)
    public maxLength: number;
    /**
     * Predefine the collection of paragraph styles along with quote and code style that populate in format dropdown from the toolbar.
     *
     * {% codeBlock src='rich-text-editor/format/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * default: 'Paragraph',
     * width: '65px',
     * types: [
     * { text: 'Paragraph' },
     * { text: 'Code' },
     * { text: 'Quotation' },
     * { text: 'Heading 1' },
     * { text: 'Heading 2' },
     * { text: 'Heading 3' },
     * { text: 'Heading 4' },
     * { text: 'Heading 5' },
     * { text: 'Heading 6' }
     * ]
     * }
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;
    /**
     * Predefine the advanced list types that populate in the numberFormatList dropdown list from the toolbar.
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
     * { text: 'Upper Roman', value: 'upperRoman' },
     * ]
     * }
     */
    @Complex<NumberFormatListModel>({}, NumberFormatList)
    public numberFormatList: NumberFormatListModel;
    /**
     * Predefine the advanced list types that populate in the bulletFormatList dropdown list from the toolbar.
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
     * Predefine the font families that populate in font family dropdown list from the toolbar.
     *
     * {% codeBlock src='rich-text-editor/font-family/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     * default: 'Segoe UI',
     * width: '65px',
     * items: [
     * { text: 'Segoe UI', value: 'Segoe UI' },
     * { text: 'Arial',  value: 'Arial,Helvetica,sans-serif' },
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
     * Predefine the font sizes that populate in font size dropdown list from the toolbar.
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
     * Predefine the color palette that can be rendered for font color toolbar command .
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
    @Complex<FontColorModel>({}, FontColor)
    public fontColor: FontColorModel;
    /**
     * Predefine the color palette that can be rendered for background color (text highlighted color) toolbar command.
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
    @Complex<BackgroundColorModel>({}, BackgroundColor)
    public backgroundColor: BackgroundColorModel;
    /**
     * Accepts the template design and assigns it as RichTextEditor’s content.
     * The built-in template engine which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals
     *
     * {% codeBlock src='rich-text-editor/value-template/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public valueTemplate: string | Function;

    /**
     * Specifies the saveInterval in milliseconds for autosave the value.
     * The change event will be triggered if the content was changed from the last saved interval.
     *
     * {% codeBlock src='rich-text-editor/save-interval/index.md' %}{% endcodeBlock %}
     *
     * @default 10000
     */
    @Property(10000)
    public saveInterval: number;

    /**
     * Triggers before command execution using toolbar items or executeCommand method.
     * If you cancel this event, the command cannot be executed.
     * Set the cancel argument to true to cancel the command execution.
     *
     * @event 'actionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionBeginEventArgs>;
    /**
     * Triggers after command execution using toolbar items or executeCommand method.
     *
     * @event 'actionComplete'
     */
    @Event()
    public actionComplete: EmitType<ActionCompleteEventArgs>;
    /**
     * Event triggers when the dialog is being opened.
     * If you cancel this event, the dialog remains closed.
     * Set the cancel argument to true to cancel the open of a dialog.
     *
     * @event 'beforeDialogOpen'
     */

    @Event()
    public beforeDialogOpen: EmitType<BeforeOpenEventArgs>;
    /**
     * Event triggers when a dialog is opened.
     *
     * @event 'dialogOpen'
     */
    @Event()
    public dialogOpen: EmitType<Object>;
    /**
     * Event triggers when the dialog is being closed.
     * If you cancel this event, the dialog remains opened.
     * Set the cancel argument to true to prevent closing a dialog.
     *
     * @event 'beforeDialogClose'
     */
    @Event()
    public beforeDialogClose: EmitType<BeforeCloseEventArgs>;
    /**
     * Event triggers after the dialog has been closed.
     *
     * @event 'dialogClose'
     */
    @Event()
    public dialogClose: EmitType<Object>;
    /**
     * Event triggers when the quick toolbar is being opened.
     *
     * @event 'beforeQuickToolbarOpen'
     */
    @Event()
    public beforeQuickToolbarOpen: EmitType<BeforeQuickToolbarOpenArgs>;
    /**
     * Event triggers when a quick toolbar is opened.
     *
     * @event 'quickToolbarOpen'
     */
    @Event()
    public quickToolbarOpen: EmitType<Object>;
    /**
     * Event triggers after the quick toolbar has been closed.
     *
     * @event 'quickToolbarClose'
     */
    @Event()
    public quickToolbarClose: EmitType<Object>;
    /**
     * This event is deprecated and no longer works. Use `updatedToolbarStatus` event to get the undo and redo status.
     *
     * @deprecated
     * @event 'toolbarStatusUpdate'
     */
    @Event()
    public toolbarStatusUpdate: EmitType<Object>;
    /**
     * Triggers when the toolbar items status is updated.
     *
     * @event 'updatedToolbarStatus'
     */
    @Event()
    public updatedToolbarStatus: EmitType<ToolbarStatusEventArgs>;
    /**
     * Event triggers when the image is selected or dragged into the insert image dialog.
     *
     * @event 'imageSelected'
     */
    @Event()
    public imageSelected: EmitType<SelectedEventArgs>;
    /**
     * Event triggers before the image upload process.
     *
     * @event 'beforeImageUpload'
     */
    @Event()
    public beforeImageUpload: EmitType<BeforeUploadEventArgs>;
    /**
     * Event triggers when the selected image begins to upload in the insert image dialog.
     *
     * @event 'imageUploading'
     */
    @Event()
    public imageUploading: EmitType<UploadingEventArgs>;
    /**
     * Event triggers when the image is successfully uploaded to the server side.
     *
     * @event 'imageUploadSuccess'
     */
    @Event()
    public imageUploadSuccess: EmitType<Object>;
    /**
     * Event triggers when there is an error in the image upload.
     *
     * @event 'imageUploadFailed'
     */
    @Event()
    public imageUploadFailed: EmitType<Object>;
    /**
     * Event triggers when the selected image is cleared from the insert image dialog.
     *
     * @event 'imageRemoving'
     */
    @Event()
    public imageRemoving: EmitType<RemovingEventArgs>;
    /**
     * Event triggers when the selected image is cleared from the Rich Text Editor Content.
     *
     * @event 'afterImageDelete'
     */
    @Event()
    public afterImageDelete: EmitType<AfterImageDeleteEventArgs>;
    /**
     * Event triggers when the media is selected or dragged into the insert media audio/video dialog.
     *
     * @event 'fileSelected'
     */
    @Event()
    public fileSelected: EmitType<SelectedEventArgs>;
    /**
     * Event triggers before the media audio/video upload process.
     *
     * @event 'beforeFileUpload'
     */
    @Event()
    public beforeFileUpload: EmitType<BeforeUploadEventArgs>;
    /**
     * Event triggers when the selected media begins to upload in the insert media audio/video dialog.
     *
     * @event 'fileUploading'
     */
    @Event()
    public fileUploading: EmitType<UploadingEventArgs>;
    /**
     * Event triggers when the media is successfully uploaded to the server side.
     *
     * @event 'fileUploadSuccess'
     */
    @Event()
    public fileUploadSuccess: EmitType<Object>;
    /**
     * Event triggers when there is an error in the media upload.
     *
     * @event 'fileUploadFailed'
     */
    @Event()
    public fileUploadFailed: EmitType<Object>;
    /**
     * Event triggers when the selected media is cleared from the insert audio/video dialog.
     *
     * @event 'fileRemoving'
     */
    @Event()
    public fileRemoving: EmitType<RemovingEventArgs>;
    /**
     * Event triggers when the selected media is cleared from the Rich Text Editor Content.
     *
     * @event 'afterMediaDelete'
     */
    @Event()
    public afterMediaDelete: EmitType<AfterMediaDeleteEventArgs>;
    /**
     * Triggers when the Rich Text Editor is rendered.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the Rich Text Editor is destroyed.
     *
     * @event 'destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Event triggers before sanitize the value. It's only applicable to editorMode as `HTML`.
     *
     * @event 'beforeSanitizeHtml'
     */
    @Event()
    public beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;
    /**
     * Triggers when Rich Text Editor is focused out.
     *
     * @event 'blur'
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Triggers when Rich Text Editor Toolbar items is clicked.
     *
     * @event 'toolbarClick'
     */
    @Event()
    public toolbarClick: EmitType<Object>;
    /**
     * Triggers when Rich Text Editor is focused in
     *
     * @event 'focus'
     */
    @Event()
    public focus: EmitType<Object>;
    /**
     * Triggers only when Rich Text Editor is blurred and changes are done to the content.
     *
     * @event 'change'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Triggers only when resizing the image.
     *
     * @event 'resizing'
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;
    /**
     * Triggers only when start resize the image.
     *
     * @event 'resizeStart'
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;
    /**
     * Triggers only when stop resize the image.
     *
     * @event 'resizeStop'
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * Triggers before cleanup the copied content.
     *
     * @event 'beforePasteCleanup'
     */
    @Event()
    public beforePasteCleanup: EmitType<PasteCleanupArgs>;

    /**
     * Triggers after cleanup the copied content.
     *
     * @event 'afterPasteCleanup'
     */
    @Event()
    public afterPasteCleanup: EmitType<object>;

    /**
     * Triggers before drop the image.
     *
     * @event 'beforeImageDrop'
     */
    @Event()
    public beforeImageDrop: EmitType<ImageDropEventArgs>;
    /**
     * Customize keyCode to change the key value.
     *
     * {% codeBlock src='rich-text-editor/formatter/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public formatter: IFormatter;
    public keyboardModule: KeyboardEvents;
    public localeObj: L10n;
    public valueContainer: HTMLTextAreaElement;
    private originalElement: HTMLElement;
    private clickPoints: { [key: string]: number };
    private initialValue: string;

    public constructor(options?: RichTextEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.needsID = true;
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
            modules.push({
                member: 'audio',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'video',
                args: [this, this.serviceLocator]
            });
            if (this.quickToolbarSettings.enable) {
                modules.push(
                    { member: 'quickToolbar', args: [this, this.serviceLocator] }
                );
            }
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
        if (this.editorMode === 'HTML') {
            modules.push(
                { member: 'htmlEditor', args: [this, this.serviceLocator] }
            );
            modules.push(
                { member: 'pasteCleanup', args: [this, this.serviceLocator] }
            );
            modules.push({
                member: 'formatPainter',
                args: [this ]
            });
            modules.push({
                member: 'emojiPicker',
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
    private initializeValue(): void{
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
        this.onBlurHandler = this.blurHandler.bind(this);
        this.onFocusHandler = this.focusHandler.bind(this);
        this.onResizeHandler = this.resizeHandler.bind(this);
        this.clickPoints = { clientX: 0, clientY: 0 };
        this.initialValue = this.value;
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setContainer();
        this.persistData();
        setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        attributes(this.element, { role: 'application', 'aria-label' : 'Rich Text Editor' });
    }

    private persistData (): void {
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
        this.element.appendChild(this.valueContainer);
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
     * Focuses the Rich Text Editor component
     *
     * @returns {void}
     * @public
     */
    public focusIn(): void {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({} as FocusEvent);
        }
    }
    /**
     * Blurs the Rich Text Editor component
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
     * Selects all the content in RichTextEditor
     *
     * @returns {void}
     * @public
     */
    public selectAll(): void {
        this.notify(events.selectAll, {});
    }
    /**
     * Selects a content range or an element
     *
     * @param {Range} range - Specify the range which you want to select within the content.
     * The method used to select a particular sentence or word or entire document.
     *
     * @returns {void}
     * @public
     */
    public selectRange(range: Range): void {
        this.notify(events.selectRange, { range: range });
    }
    /**
     * Retrieves the HTML markup content from currently selected content of RichTextEditor.
     *
     * @returns {void}
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
     * Shows the emoji picker
     *
     * @param {number} x - specifies the number value.
     * @param {number} y - specifies the number value.
     * @returns {void}
     * @public
     */
    public  showEmojiPicker(x?: number, y?: number): void {
        if (this.readonly){
            return ;
        }
        this.notify(events.emojiPicker, {x, y});
    }
    /**
     * Executes the commands
     *
     * @returns {void}
     * @param {CommandName} commandName - Specifies the name of the command to be executed.
     * @param {string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs} value - Specifies the value that you want to execute.
     * @param {ExecuteCommandOption} option - specifies the command option
     * @public
     */
    public executeCommand(
        commandName: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel | IAudioCommandsArgs | IVideoCommandsArgs,
        option?: ExecuteCommandOption): void {
        value = this.htmlPurifier(commandName, value);
        let internalValue: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel | IFormatPainterArgs;
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
        this.formatter.editorManager.execCommand(
            tool.command,
            tool.subCommand ? tool.subCommand : (internalValue ? internalValue : tool.value),
            null,
            null,
            (internalValue ? internalValue : tool.value),
            (internalValue ? internalValue : tool.value)
        );
        if (option && option.undo) {
            this.formatter.saveData();
            this.formatter.enableUndo(this);
        }
        this.setPlaceHolder();
        this.notify(events.contentChanged, {});
    }
    private htmlPurifier(
        command: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel): string {
        if (this.editorMode === 'HTML') {
            switch (command) {
            case 'insertHTML':
                if (this.enableHtmlSanitizer) {
                    if (typeof value === 'string') {
                        value = this.htmlEditorModule.sanitizeHelper(value);
                    } else {
                        value = this.htmlEditorModule.sanitizeHelper((value as HTMLElement).outerHTML);
                    }
                }
                break;
            case 'insertTable':
                if (isNOU((value as { [key: string]: object }).width)) {
                    (value as { [key: string]: object }).width = { minWidth: this.tableSettings.minWidth,
                        maxWidth: this.tableSettings.maxWidth, width: this.tableSettings.width };
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
                    (value as { [key: string]: object }).width = { minWidth: this.insertImageSettings.minWidth,
                        maxWidth: this.insertImageSettings.maxWidth, width: this.insertImageSettings.width };
                }
                if (isNOU((value as { [key: string]: object }).height)) {
                    (value as { [key: string]: object }).height = { minHeight: this.insertImageSettings.minHeight,
                        maxHeight: this.insertImageSettings.maxHeight, height: this.insertImageSettings.height };
                }
                break; }
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
                break; }
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
                    (value as { [key: string]: object }).width = { minWidth: this.insertVideoSettings.minWidth,
                        maxWidth: this.insertVideoSettings.maxWidth, width: this.insertVideoSettings.width };
                }
                if (isNOU((value as { [key: string]: object }).height)) {
                    (value as { [key: string]: object }).height = { minHeight: this.insertVideoSettings.minHeight,
                        maxHeight: this.insertVideoSettings.maxHeight, height: this.insertVideoSettings.height };
                }
                break; }
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
                break; }
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
        this.value = (!(this.editorMode === 'Markdown') && !isNOU(this.value)) ? this.addAnchorAriaLabel(this.value) : this.value;
        if (this.value && !this.valueTemplate) {
            this.setProperties({ value: this.serializeValue(this.value) }, true);
        }
        this.renderModule = new Render(this, this.serviceLocator);
        this.sourceCodeModule = new ViewSource(this, this.serviceLocator);
        this.notify(events.initialLoad, {});
        this.trigger(events.load);
        this.RTERender();
        // eslint-disable-next-line
        const execCommandCallBack: ExecCommandCallBack = new ExecCommandCallBack(this);
        this.notify(events.initialEnd, {});
        if (this.enableXhtml) {
            this.setProperties({ value: this.getXhtml() }, true);
        }
        if (this.toolbarSettings.enable && (this.toolbarSettings.type === 'Expand' || this.toolbarSettings.type === 'MultiRow' || this.toolbarSettings.type === 'Scrollable') && !isNOU(this.getToolbar()) &&
            (this.toolbarSettings.items.indexOf('Undo') > -1 && this.toolbarSettings.items.indexOf('Redo') > -1)) {
            this.disableToolbarItem(['Undo', 'Redo']);
        }
        this.setContentHeight('Init');
        if (this.value !== null) {
            this.valueContainer.defaultValue = this.value;
        }
        // eslint-disable-next-line
        (this.enabled && !this.readonly) ? this.eventInitializer() : this.unWireEvents();
        this.notify(events.bindCssClass, {cssClass: this.getCssClass()});
        this.addAudioVideoWrapper();
        this.notify(events.tableclass, {});
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
                audioWrapElem.setAttribute('style', 'width:300px; margin:0 auto;');
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
        !range.collapsed && isNOU(endNode.nextElementSibling)) {
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
                // eslint-disable-next-line
                const regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
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
            !(e.altKey || e.shiftKey || (e.altKey && e.shiftKey && e.which == 67))) {
            this.formatter.saveData();
        }
        const keyboardEventAction: string[] = ['insert-link', 'format-copy', 'format-paste', 'insert-image', 'insert-table', 'insert-audio', 'insert-video'];
        if (keyboardEventAction.indexOf((e as KeyboardEventArgs).action) === -1 &&
        (!(e as KeyboardEvent).target || !(((e as KeyboardEvent).target as Element).classList.contains('e-mention') && !isNOU(document.querySelector('#' + ((e as KeyboardEvent).target as Element).id + '_popup.e-popup-open')) && e.code === 'Tab')) &&
        ((e as KeyboardEventArgs).action && (e as KeyboardEventArgs).action !== 'paste' && (e as KeyboardEventArgs).action !== 'space'
        || e.which === 9 || (e.code === 'Backspace' && e.which === 8))) {
            let FormatPainterEscapeAction: boolean = false;
            if (!isNOU(this.formatPainterModule)) {
                FormatPainterEscapeAction = this.formatPainterModule.previousAction === 'escape';
            }
            if (!FormatPainterEscapeAction) {
                if (this.editorMode === 'HTML' && ((e as KeyboardEventArgs).action === 'increase-fontsize' || (e as KeyboardEventArgs).action === 'decrease-fontsize')) {
                    this.notify(events.onHandleFontsizeChange, { member: 'onHandleFontsizeChange', args: e });
                } else {
                    this.formatter.process(this, null, e);
                }
            }
            switch ((e as KeyboardEventArgs).action) {
            case 'toolbar-focus':
                if (this.toolbarSettings.enable && this.getToolbarElement()) {
                    let firstActiveItem: HTMLElement = this.getToolbarElement().querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                    const quickToolbarElem: HTMLElement | null = this.getRenderedQuickToolbarElem();
                    if (quickToolbarElem) {
                        firstActiveItem = quickToolbarElem.querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                    }
                    if (firstActiveItem) {
                        const firstChild = firstActiveItem.firstElementChild as HTMLElement;
                        firstChild.removeAttribute('tabindex');
                        firstChild.focus();
                    }
                }
                break;
            case 'escape':
                (this.contentModule.getEditPanel() as HTMLElement).focus();
                break;
            }
        }
        if (!isNOU(this.placeholder)) {
            if ((!isNOU(this.placeHolderWrapper)) && (this.inputElement.textContent.length !== 1)) {
                this.placeHolderWrapper.style.display = 'none';
            } else if (this.iframeSettings.enable && this.inputElement.classList.contains('e-rte-placeholder')) {
                removeClass([this.inputElement], 'e-rte-placeholder');
            } else {
                this.setPlaceHolder();
            }
        }
        this.notify(events.afterKeyDown, { member: 'afterKeyDown', args: e });
        this.autoResize();
    }

    private keyUp(e: KeyboardEvent): void {
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            if (!isNOU(e) && !isNOU(e.code) && (e.code === 'Backspace' || e.code === 'Delete')) {
                // To prevent the reformatting the content removed browser behavior.
                const currentRange: Range = this.getRange();
                const selection: Selection = this.iframeSettings.enable ? this.contentModule.getPanel().ownerDocument.getSelection() :
                    this.contentModule.getDocument().getSelection();
                if (selection.rangeCount > 0) {
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
        this.notify(events.keyUp, { member: 'keyup', args: e });
        if (e.keyCode === 39  || e.keyCode === 37) {
            this.notify(events.tableModulekeyUp, { member: 'tableModulekeyUp', args: e });
        }
        if (e.code === 'KeyX' && e.which === 88 && e.keyCode === 88 && e.ctrlKey && (this.inputElement.innerHTML === '' ||
        this.inputElement.innerHTML === '<br>')) {
            this.inputElement.innerHTML = getEditValue(getDefaultValue(this), this);
        }
        const allowedKeys: boolean = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
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
        if (!isNOU(this.placeholder)) {
            if (!(e.key === 'Enter' && e.keyCode === 13) && (this.inputElement.innerHTML === '<p><br></p>' || this.inputElement.innerHTML === '<div><br></div>' ||
            this.inputElement.innerHTML === '<br>')) {
                this.setPlaceHolder();
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
     * This method will clean up the HTML against cross-site scripting attack and return the HTML as string.
     * It's only applicable to editorMode as `HTML`.
     *
     * @param {string} value - Specifies the value that you want to sanitize.
     * @returns {string} - specifies the the string value
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

    private notifyMouseUp(e: MouseEvent | TouchEvent): void {
        const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        this.notify(events.mouseUp, { member: 'mouseUp', args: e,
            touchData: { prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && (this.inputElement as HTMLTextAreaElement).value.length !== 0)) ||
            (e.target && !isNOU(closest((e.target as HTMLElement), 'table'))) ||
            (e.target && ((e.target as HTMLElement).nodeName === 'VIDEO' ||
            (e.target as HTMLElement).querySelectorAll('.' + classes.CLS_VIDEOWRAP).length > 0) ||
            (e.target && (e.target as HTMLElement).nodeName !== 'BR' &&
            ((e.target as HTMLElement).classList.contains(classes.CLS_AUDIOWRAP) ||
            (e.target as HTMLElement).classList.contains(classes.CLS_CLICKELEM) ||
            (e.target as HTMLElement).classList.contains(classes.CLS_VID_CLICK_ELEM))))) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
    }

    private mouseUp(e: MouseEvent | TouchEvent): void {
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            const target: Element = e.target as Element;
            const closestTable: Element = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.contentModule.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
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
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onCopy(): void {
        this.contentModule.getDocument().execCommand('copy', false, null);
    }

    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onCut(): void {
        this.contentModule.getDocument().execCommand('cut', false, null);
    }

    /**
     * @param {KeyboardEvent} e - specifies the keyboard event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onPaste(e?: KeyboardEvent | ClipboardEvent): void {
        const evenArgs: { [key: string]: Object } = {
            originalEvent: e,
            cancel: false,
            requestType: 'Paste'
        };
        this.trigger(events.actionBegin, evenArgs, (pasteArgs: { [key: string]: Object }) => {
            const currentLength: number = this.getText().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
            const selectionLength: number = this.getSelection().length;
            const pastedContentLength: number = (isNOU(e as ClipboardEvent) || isNOU((e as ClipboardEvent).clipboardData))
                ? 0 : (e as ClipboardEvent).clipboardData.getData('text/plain').replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
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
                if (!isNOU(this.pasteCleanupModule)) {
                    this.notify(events.pasteClean, { args: e as ClipboardEvent });
                } else {
                    console.warn('[WARNING] :: Module "pasteCleanup" is not available in RichTextEditor component! You either misspelled the module name or forgot to load it.'); 
                    const args: Object = { requestType: 'Paste', editorMode: this.editorMode, event: e };
                    let value: string = null;
                    let htmlValue: boolean = false;
                    if (e && !isNOU((e as ClipboardEvent).clipboardData)) {
                        value = (e as ClipboardEvent).clipboardData.getData('text/plain');
                        htmlValue = (e as ClipboardEvent).clipboardData.getData('text/html').indexOf('MsoNormal') > 0;
                    }
                    const file: File = e && (e as ClipboardEvent).clipboardData && (e as ClipboardEvent).clipboardData.items.length > 0 ?
                        (e as ClipboardEvent).clipboardData.items[0].getAsFile() : null;
                    if (value !== null) {
                        this.notify(events.paste, {
                            file: file,
                            args: e,
                            text: value,
                            isWordPaste: htmlValue
                        });
                    }
                    setTimeout(() => {
                        this.formatter.onSuccess(this, args);
                    }, 0);
                }
            } else {
                e.preventDefault();
            }
        });
    }

    /**
     * @param {string} action - specifies the string value.
     * @param {MouseEvent} event - specifies the event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public clipboardAction(action: string, event: MouseEvent | KeyboardEvent): void {
        switch (action.toLowerCase()) {
        case 'cut':
            this.onCut();
            this.formatter.onSuccess(this, {
                requestType: 'Cut',
                editorMode: this.editorMode,
                event: event
            });
            break;
        case 'copy':
            this.onCopy();
            this.formatter.onSuccess(this, {
                requestType: 'Copy',
                editorMode: this.editorMode,
                event: event
            });
            break;
        case 'paste':
            this.onPaste(event as KeyboardEvent);
            break;
        }
    }
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed || !this.isRendered) {
            return;
        }
        if (!isNOU(this.timeInterval)) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        const tooltipElements: NodeListOf<Element> = document.querySelectorAll('[data-rte-id="' + this.getID() + '"]');
        for (let i: number = 0; i < tooltipElements.length; i++) {
            const tooltipEle: Element = tooltipElements[i as number] as Element;
            if (this.getID() === tooltipEle.getAttribute('data-rte-id') as string) {
                detach(tooltipEle);
            }
        }
        if (this.element.offsetParent === null) {
            if (!isNOU(this.toolbarModule)) { this.toolbarModule.destroy(); }
            this.notify(events.moduleDestroy, {});
            super.destroy();
            this.isRendered = false;
            return;
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
        this.removeHtmlAttributes();
        this.removeAttributes();
        super.destroy();
        this.isRendered = false;
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
    }

    private destroyDependentModules(): void {
        /* destroy dependent modules */
        this.renderModule.destroy();
        this.formatter.editorManager.undoRedoManager.destroy();
        this.sourceCodeModule.destroy();
    }

    /**
     * Returns the HTML or Text inside the RichTextEditor.
     *
     * @returns {Element} - specifies the element.
     */
    public getContent(): Element {
        return this.contentModule.getPanel();
    }
    /**
     * Returns the text content as string.
     *
     * @returns {string} - specifies the string value.
     */
    public getText(): string {
        return this.contentModule.getText();
    }

    /**
     * Returns the html value of the selected content as string.
     *
     * @returns {string} - specifies the string value.
     */
    public getSelectedHtml(): string {
        let range: Range;
        const wrapperElm: HTMLElement = this.createElement('div');
        const selection: Selection = this.contentModule.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            const selectedHtml: DocumentFragment = range.cloneContents();
            wrapperElm.appendChild(selectedHtml);
        }
        return wrapperElm.innerHTML;
    }

    /**
     * It shows the inline quick toolbar
     *
     * @returns {void}
     */
    public showInlineToolbar(): void {
        if (this.inlineMode.enable) {
            const currentRange: Range = this.getRange();
            const targetElm: HTMLElement = currentRange.endContainer.nodeName === '#text' ?
                currentRange.endContainer.parentElement : currentRange.endContainer as HTMLElement;
            const x: number = currentRange.getClientRects()[0].left;
            const y: number = currentRange.getClientRects()[0].top;
            this.quickToolbarModule.showInlineQTBar(x, y, (targetElm as HTMLElement));
        }
    }

    /**
     * It hides the inline quick toolbar
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
                nVal = this.serializeValue(nVal);
                const val: string = this.editorMode === 'HTML' ? getEditValue(nVal, this) : nVal;
                if ((!isNOU(nVal) && nVal !== '') || prop === 'enterKey') {
                    this.setProperties({value:((this.enableHtmlEncode) ? this.encode(decode(val)) : val)}, true);
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
                this.setContentHeight('Init');
                this.autoResize();
                break;
            case 'readonly':
                this.setReadOnly(false);
                break;
            case 'cssClass':
                this.element.classList.remove(oldProp[prop]);
                this.setCssClass(newProp[prop]);
                this.notify(events.bindCssClass, {cssClass: newProp[prop], oldCssClass: oldProp[prop]});
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
                this.setIframeSettings(); break; }
            case 'locale': super.refresh(); break;
            case 'inlineMode':
                this.notify(events.modelChanged, { module: 'quickToolbar', newProp: newProp, oldProp: oldProp });
                this.setContentHeight('Init');
                break;
            case 'toolbarSettings':
                this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                this.setContentHeight('Init');
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
                break;
            case 'quickToolbarSettings':
                newProp.quickToolbarSettings.showOnRightClick ? this.wireContextEvent() : this.unWireContextEvent();
                this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                break;
            case 'formatPainterSettings':
                this.formatter.editorManager.observer.notify(CONSTANT.MODEL_CHANGED,{ module: 'formatPainter', newProp: newProp });
                break;
            default:
                this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                break;
            }
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
    private updatePanelValue(): void {
        let value: string = this.value;
        value = (this.enableHtmlEncode && this.value) ? decode(value) : value;
        const getTextArea: HTMLInputElement = this.element.querySelector('.'+ classes.CLS_RTE_SOURCE_CODE_TXTAREA) ;
        if (value) {
            if (getTextArea && getTextArea.style.display === 'block') {
                getTextArea.value = this.value;
            }
            if (this.valueContainer) {
                this.valueContainer.value = (this.enableHtmlEncode) ? this.value : value;
            }
            if (this.editorMode === 'HTML' && this.inputElement && this.inputElement.innerHTML.trim() !== value.trim()) {
                this.inputElement.innerHTML = value;
            } else if (this.editorMode === 'Markdown' && this.inputElement
                && (this.inputElement as HTMLTextAreaElement).value.trim() !== value.trim()) {
                (this.inputElement as HTMLTextAreaElement).value = value;
            }
        } else {
            if (getTextArea && getTextArea.style.display === 'block') {
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
                if (!this.placeHolderWrapper) {
                    this.placeHolderWrapper = this.createElement('span', { className: 'rte-placeholder e-rte-placeholder' + ' ' + this.cssClass });
                    if (this.inputElement) {
                        this.inputElement.parentElement.insertBefore(this.placeHolderWrapper, this.inputElement);
                    }
                    attributes(this.placeHolderWrapper, {
                        'style': 'font-size: 14px; margin-left: 0px; margin-right: 0px;'
                    });
                }
                this.placeHolderWrapper.innerHTML = this.placeholder;
                if ( this.inputElement.textContent.length === 0 && this.inputElement.childNodes.length < 2 && !isNOU(this.inputElement.firstChild) && (this.inputElement.firstChild.nodeName === 'BR' ||
                ((this.inputElement.firstChild.nodeName === 'P' || this.inputElement.firstChild.nodeName === 'DIV') && !isNOU(this.inputElement.firstChild.firstChild) &&
                this.inputElement.firstChild.firstChild.nodeName === 'BR'))) {
                    this.placeHolderWrapper.style.display = 'block';
                } else {
                    this.placeHolderWrapper.style.display = 'none';
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
            } else {
                removeClass([this.inputElement], 'e-rte-placeholder');
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
     * By default, prints all the pages of the RichTextEditor.
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
            printWind = printWindow(this.inputElement, printWind);
            if (!printingArgs.cancel) {
                const actionArgs: ActionCompleteEventArgs = {
                    requestType: 'print'
                };
                this.trigger(events.actionComplete, actionArgs);
            }
        });
    }

    /**
     * Refresh the view of the editor.
     *
     * @returns {void}
     * @public
     */
    public refreshUI(): void {
        this.renderModule.refresh();
    }
    /**
     * Shows the Rich Text Editor component in full-screen mode.
     *
     * @returns {void}
     */
    public showFullScreen(): void {
        this.fullScreenModule.showFullScreen();
    }
    /**
     * Enables the give toolbar items in the Rich Text Editor component.
     *
     * @returns {void}
     * @param {string | string[]} items - Specifies the single or collection of items
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * that you want to be enable in Rich Text Editor’s Toolbar.
     *
     * @public
     */
    public enableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true, muteToolbarUpdate);
    }
    /**
     * Disables the given toolbar items in the Rich Text Editor component.
     *
     * @returns {void}
     * @param {string | string[]} items - Specifies the single or collection of items
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * that you want to be disable in Rich Text Editor’s Toolbar.
     *
     * @public
     */
    public disableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false, muteToolbarUpdate);
    }
    /**
     * Removes the give toolbar items from the Rich Text Editor component.
     *
     * @returns {void}
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be remove from Rich Text Editor’s Toolbar.
     *
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
                // eslint-disable-next-line
                if (typeof this.valueTemplate !== 'string' && (this as any).isReact) {
                    this.displayTempElem = this.createElement('div');
                    for (let i: number = 0; i < compiledTemplate.length; i++) {
                        const item: Element = compiledTemplate[i as number] as Element;
                        append([item], this.displayTempElem);
                    }
                    this.renderTemplates(() => {
                        this.inputElement.innerHTML = (this.displayTempElem.childNodes[0] as HTMLElement).innerHTML;
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
                    this.setProperties({ value: appendElem.innerHTML.trim() });
                    this.renderReactTemplates();
                }
            }
        } else {
            // eslint-disable-next-line
            const  innerHtml: string = !isNOU(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
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
        if (this.editorMode === "HTML" && !isNOU(this.formatter.editorManager.nodeSelection) && !isNOU(this.formatter.editorManager.nodeSelection.range)) {
            const currentRange : Range = this.formatter.editorManager.nodeSelection.range;
            if(currentRange.startContainer.nodeType !== 3 && (currentRange.startContainer as HTMLElement).closest &&
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
     * setContentHeight method
     *
     * @param {string} target - specifies the target value.
     * @param {boolean} isExpand - specifies  the bollean value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setContentHeight(target: ContentHeightSource, isExpand?: boolean): void {
        let heightValue: string;
        let rteHeightPercent: string;
        const heightPercent: boolean = typeof (this.height) === 'string' && this.height.indexOf('%') > -1;
        const cntEle: HTMLElement = this.contentModule.getPanel() as HTMLElement;
        let rteHeight: number = this.element.offsetHeight;
        if (rteHeight === 0 && this.height !== 'auto' && !this.getToolbar()) {
            rteHeight = parseInt(this.height as string, 10);
            if (heightPercent) {
                rteHeightPercent = this.height as string;
            }
        }
        let tbHeight: number = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        const rzHandle: HTMLElement = this.element.querySelector('.' + classes.CLS_RTE_RES_HANDLE) as HTMLElement;
        const rzHeight: number = this.enableResize ? (!isNOU(rzHandle) ? (rzHandle.offsetHeight + 8) : 0) : 0;
        const expandPopHeight: number = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (target && target !== 'Toolbar' && expandPopHeight && this.element.querySelectorAll('.e-toolbar-extended.e-popup-open').length > 0) {
            tbHeight = tbHeight - expandPopHeight;
        }
        if (this.toolbarSettings.type === ToolbarType.Expand) {
            if (isExpand) {
                heightValue = (this.height === 'auto' && this.element.style.height === 'auto') ? 'auto' : rteHeight - (tbHeight + expandPopHeight + rzHeight) + 'px';
            } else {
                heightValue = (this.height === 'auto' && this.element.style.height === 'auto') ? 'auto' : rteHeight - (tbHeight - expandPopHeight + rzHeight) + 'px';
            }
        } else {
            heightValue = (this.height === 'auto' && this.element.style.height === 'auto') ? 'auto' : rteHeight - tbHeight + 'px';
        }
        const finalHeight: string | number = heightPercent && rteHeightPercent ? rteHeightPercent : heightValue;
        switch (target) {
            case 'Init':
            case 'Toolbar':
            case 'WindowResize':
            case 'Refresh':
                if (this.element.querySelectorAll('.e-source-content').length > 0 && (this.element.querySelector('.e-source-content') as HTMLElement).style.display === 'block') {
                    setStyleAttribute(this.element.querySelector('.e-source-content') as HTMLElement, { height: finalHeight});
                } else {
                    setStyleAttribute(cntEle, { height: finalHeight});
                }
                break;
            case 'Resize':
                setStyleAttribute(cntEle, { height: finalHeight});
                break;
        }
        if (rzHeight === 0) {
            this.autoResize();
        }
    }
    /**
     * Retrieves the HTML from RichTextEditor.
     *
     * @returns {void}
     * @public
     */
    public getHtml(): string {
        const htmlValue: string = this.removeResizeElement(this.contentModule.getEditPanel().innerHTML);
        return (this.enableXhtml && (htmlValue === '<p><br></p>' || htmlValue === '<div><br></div>' ||
        htmlValue === '<br>') ? null : this.serializeValue(htmlValue));
    }

    /**
     * Retrieves the Rich Text Editor's XHTML validated HTML content when `enableXhtml` property is enabled.
     *
     * @returns {void}
     * @public
     */
    public getXhtml(): string {
        let currentValue: string = this.removeResizeElement(this.value);
        if (!isNOU(currentValue) && this.enableXhtml) {
            currentValue = this.htmlEditorModule.xhtmlValidation.selfEncloseValidation(currentValue);
        }
        return currentValue;
    }

    /**
     * Shows the source HTML/MD markup.
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
     * Returns the maximum number of characters in the Rich Text Editor.
     *
     * @returns {void}
     * @public
     */
    public getCharCount(): number {
        const htmlText : string = this.editorMode === 'Markdown' ? (this.inputElement as HTMLTextAreaElement).value.trim() :
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
     * Show the dialog in the Rich Text Editor.
     *
     * @param {DialogType} type - specifies the dialog type.
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
     * Close the dialog in the Rich Text Editor.
     *
     * @param {DialogType} type - specifies the dialog type.
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
        return (this.originalElement.tagName === 'TEXTAREA' ? this.valueContainer.id : this.element.id);
    }

    /**
   * @returns {void}
   * getCssClass method
   *
   * @hidden
   * @deprecated
   */
    public getCssClass(isSpace?: boolean): string {
        return (isNOU(this.cssClass) ? '' : isSpace?' '+ this.cssClass: this.cssClass);
    }

    private mouseDownHandler(e: MouseEvent | TouchEvent): void {
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

    private resizeHandler(): void {
        let isExpand: boolean = false;
        if (!document.body.contains(this.element)) {
            document.defaultView.removeEventListener('resize', debounce(this.onResizeHandler, 10) as EventListenerOrEventListenerObject, true);
            return;
        }
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.toolbarModule.refreshToolbarOverflow();
            isExpand = this.toolbarModule.baseToolbar.toolbarObj.element.classList.contains(classes.CLS_EXPAND_OPEN);
        }
        this.setContentHeight('WindowResize', isExpand);
        this.notify(events.windowResize, null);
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
                || closest(active, '.e-rte-toolbar') === this.getToolbarElement()) {
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
            if (!isNOU(this.saveInterval) && this.saveInterval > 0 && !this.autoSaveOnIdle) {
                this.timeInterval = setInterval(this.updateValueOnIdle.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!this.readonly ) {
            const currentFocus: string = this.getCurrentFocus(e);
            if (currentFocus === 'editArea' || currentFocus === 'textArea' || currentFocus === 'sourceCode') {
                this.resetToolbarTabIndex();
            }
        }
    }

    private getUpdatedValue(): string {
        let value: string;
        const getTextArea: HTMLInputElement = this.element.querySelector('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA) ;
        if (this.editorMode === 'HTML') {
            value = (this.inputElement.innerHTML === '<p><br></p>' || this.inputElement.innerHTML === '<div><br></div>' ||
            this.inputElement.innerHTML === '<br>') ? null : this.enableHtmlEncode ?
                    this.encode(decode(this.removeResizeElement(this.inputElement.innerHTML))) : this.inputElement.innerHTML;
            if (getTextArea && getTextArea.style.display === 'block') {
                value = getTextArea.value;
            }
        } else {
            value = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                (this.inputElement as HTMLTextAreaElement).value;
        }
        if (value != null && !this.enableHtmlEncode) {
            value = this.removeResizeElement(value);
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
        const value = this.removeResizeElement(args.value);
        args.callBack(value);
    }

    public addAnchorAriaLabel(value: string): string {
        let valueElementWrapper: HTMLElement = document.createElement("div");
        valueElementWrapper.innerHTML = value;
        let item: NodeListOf<Element> = valueElementWrapper.querySelectorAll("a");
        if (item.length > 0) {
            for (let i: number = 0; i < item.length; i++) {
                (item[i as number].hasAttribute("target") && item[i as number].getAttribute("target") === '_blank') ? item[i as number].setAttribute("aria-label", (this.serviceLocator.getService<L10n>('rteLocale') as any).getConstant("linkAriaLabel")) : item[i as number];
            }
        }
        return valueElementWrapper.innerHTML;
    }

    private removeResizeElement(value: string): string {
        let valueElementWrapper: HTMLElement = document.createElement("div");
        valueElementWrapper.innerHTML = value;
        let item: NodeListOf<Element> = valueElementWrapper.querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box, .e-table-rhelper, .e-img-resize');
        if (item.length > 0) {
            for (let i: number = 0; i < item.length; i++) {
                detach(item[i as number]);
            }
        }
        this.removeSelectionClassStates(valueElementWrapper);
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
        const hideQuickToolbarChecker: boolean = this.quickToolbarModule && !this.inlineMode.enable && isNOU(this.quickToolbarModule.inlineQTBar);
        if ((hideQuickToolbarChecker && !isNOU(closest(target, '.' + 'e-toolbar-wrapper'))) || (hideQuickToolbarChecker && (!isNOU(closest(target, '.e-rte-table-resize')) || !isNOU(closest(target, '.e-table-box'))))) {
            this.quickToolbarModule.hideQuickToolbars();
        }
        if (Browser.info.name !== 'msie' && e.detail > 3) {
            e.preventDefault();
        }
    }

    private blurHandler(e: FocusEvent): void {
        let trg: Element = e.relatedTarget as Element;
        if (trg) {
            let rteElement: Element = closest(trg, '.' + classes.CLS_RTE);
            if (!rteElement && this.iframeSettings.enable)
            {
                const iframeElement: HTMLIFrameElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                if(iframeElement && iframeElement.contentWindow.document.body.contains(trg))
                {
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
            this.removeSelectionClassStates(this.inputElement);
            this.notify(events.focusChange, {});
            const value: string = this.getUpdatedValue();
            this.setProperties({ value: value });
            this.valueContainer.value = this.value;
            this.notify(events.toolbarRefresh, { args: e, documentNode: document });
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
            if (!isNOU(this.placeHolderWrapper) && this.element.querySelector('[title = Preview]'))
            {
                this.placeHolderWrapper.style.display = 'none';
            }
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        } else {
            this.isRTE = true;
        }
        if (!this.readonly && this.getCurrentFocus(e) === 'outside') { this.resetToolbarTabIndex(); }
    }

    /**
     * invokeChangeEvent method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    private contentChanged(): void {
        if (this.autoSaveOnIdle) {
            if (!isNOU(this.saveInterval)) {
                clearTimeout(this.timeInterval);
                this.timeInterval = setTimeout(this.updateIntervalValue.bind(this), this.saveInterval);
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
        if (this.value !== this.cloneValue) {
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
        const closestElem: Element = closest((e.target as HTMLElement), 'a, table, img, video, audio');
        if (this.inlineMode.onSelection === false ||  (!isNOU(closestElem) && this.inputElement.contains(closestElem)
        && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A' ||
        closestElem.tagName.toLowerCase() === 'video' || closestElem.tagName.toLowerCase() === 'audio'))) {
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
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                this.setAutoHeight(this.inputElement);
            } else if (this.iframeSettings.enable) {
                const iframeElement: HTMLIFrameElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                this.setAutoHeight(iframeElement);
                this.inputElement.style.overflow = 'hidden';
            }
        } else {
            this.inputElement.style.overflow = null;
        }
    }
    private setAutoHeight(element: HTMLElement): void {
        if (!isNOU(element)) {
            element.style.height = this.inputElement.scrollHeight + 'px';
            element.style.overflow = 'hidden';
        }
    }
    private wireEvents(): void {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        this.on(events.contentChanged, this.contentChanged, this);
        this.on(events.resizeInitialized, this.updateResizeFlag, this);
        this.on(events.updateTbItemsStatus, this.updateStatus, this);
        this.on(events.cleanupResizeElements, this.cleanupResizeElements, this);
        this.on(events.updateValueOnIdle, this.updateValueOnIdle, this);
        if (this.readonly && this.enabled) {
            return;
        }
        this.bindEvents();
    }
    private restrict(e: MouseEvent | KeyboardEvent): void {
        if (this.maxLength >= 0 ) {
            const element: string = this.editorMode === 'Markdown' ? this.contentModule.getText():
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

    private bindEvents(): void {
        this.keyboardModule = new KeyboardEvents(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs:
                { ...this.formatter.keyConfig, ...this.keyConfig }, eventName: 'keydown'
        });
        const formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, 'content-changed', this.contentChanged, this);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30), this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', debounce(this.onResizeHandler, 10) as EventListenerOrEventListenerObject, true);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
        }
        this.wireScrollElementsEvents();
    }

    private onIframeMouseDown(e: MouseEvent): void {
        this.isBlur = false;
        this.currentTarget = <HTMLElement>e.target;
        this.notify(events.iframeMouseDown, e);
    }

    private editorKeyDown(e: IHtmlKeyboardEvent): void {
        switch (e.event.action) {
        case 'copy':
            this.onCopy();
            break;
        case 'cut':
            this.onCut();
            break;
        case 'tab':
            if (this.iframeSettings.enable) {
                this.isBlur = true;
            }
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
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        this.off(events.contentChanged, this.contentChanged);
        this.off(events.resizeInitialized, this.updateResizeFlag);
        this.off(events.updateTbItemsStatus, this.updateStatus);
        this.off(events.cleanupResizeElements, this.cleanupResizeElements);
        this.off(events.updateValueOnIdle, this.updateValueOnIdle);
        if (this.readonly && this.enabled) {
            return;
        }
        this.unbindEvents();
    }

    private unbindEvents(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        const formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, 'content-changed', this.contentChanged);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30));
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', debounce(this.onResizeHandler, 10) as EventListenerOrEventListenerObject, true);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
    }

    /**
     * 
     * @param e Focus event
     * @returns string Returns the current focus either `editArea` or `toolbar` or `textArea` or `sourceCode` or `outside` of the RichTextEditor.
     * @hidden
     */
    private getCurrentFocus(e: FocusEvent): string {
        if (e.target === this.inputElement && document.activeElement === this.inputElement) {
            return 'editArea';
        } else if (e.target === this.getToolbarElement() || (!isNOU(e.relatedTarget) && closest(e.relatedTarget as Element, '.e-rte-toolbar') === this.getToolbarElement())) {
            return 'toolbar';
        } else if (e.target === this.valueContainer && document.activeElement === this.valueContainer) {
            return 'textArea';
        } else if (!isNOU(e.target) && (e.target as HTMLElement).classList.contains(classes.CLS_RTE_SOURCE_CODE_TXTAREA) && document.activeElement === e.target) {
            return 'sourceCode';
        }
        return 'outside';
    }

    /**
     * @param {FocusEvent} e - specifies the event.
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

    private removeSelectionClassStates(element: HTMLElement): void {
        const classNames: string[] = [classes.CLS_IMG_FOCUS, classes.CLS_TABLE_SEL, classes.CLS_VID_FOCUS,  classes.CLS_AUD_FOCUS]
        for (let i: number = 0; i < classNames.length; i++) {
            const item: NodeListOf<Element> = element.querySelectorAll('.' + classNames[i as number]);
            removeClass(item, classNames[i as number]);
            if (item.length === 0) { continue; }
            for (let j: number = 0; j < item.length; j++) {
                if (item[j as number].classList.length === 0) {
                    item[j as number].removeAttribute('class');
                }
                if (item[j as number].nodeName === 'IMG' && (item[j as number] as HTMLElement).style.outline !== '') {
                    (item[j as number] as HTMLElement).style.outline = '';
                }
            }
        }
    }

    private getRenderedQuickToolbarElem(): HTMLElement | null {
        const quickToolbars : IBaseQuickToolbar[] = this.quickToolbarModule.getQuickToolbarInstance();
        for (let i: number = 0; i < quickToolbars.length; i++) {
            if (quickToolbars[i as number] && quickToolbars[i as number].isRendered) {
                return quickToolbars[i as number].element;
            }
        }
        return null;
    }
}
