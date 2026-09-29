import { Component, INotifyPropertyChanged, Property, NotifyPropertyChanges, setStyleAttribute, formatUnit, L10n, Event, EmitType, removeClass, isNullOrUndefined as isNOU, addClass, Complex, print, ModuleDeclaration, EventHandler, isNullOrUndefined, closest, initializeTelemetry, debounce, select, Browser } from '@syncfusion/ej2-base';
import { BlurredEventArgs, ChangeEventArgs, FocusedEventArgs, itemClickEventArgs, UpdatedToolbarStatusEventArgs } from './interface';
import { ToolbarSettings, FontSize, FontFamily, Format } from './model/toolbar-settings';
import { ToolbarSettingsModel, FontSizeModel, FontFamilyModel, FormatModel } from './model/toolbar-settings-model';
import { FontColorModel, BackgroundColorModel } from './model/color-picker-settings-model';
import { FontColor, BackgroundColor } from './model/color-picker-settings';
import { ToolbarItemUpdate, ToolbarItem, AddToolbarItem } from './model/toolbar.types';
import { DocumentRoot, ExtensionDefinition, backgroundColorExtension, blockquoteExtension, horizontalRuleExtension, boldExtension, clearFormattingExtension, indentOutdentExtension, codeBlockExtension, fontColorExtension, fontFamilyExtension, fontSizeExtension, headingExtension, imageExtension, inlineCodeExtension, italicExtension, linkExtension, listExtension, paragraphExtension, strikethroughExtension, subscriptExtension, superscriptExtension, toLowerCaseExtension, toUpperCaseExtension, underlineExtension, undoRedoExtension, textAlignExtension, tableExtension, DOCUMENT_CHANGED, DocumentChangedPayload, placeholderExtension } from '@syncfusion/ej2-headless-editor';
import { ListSettings } from './model/list-settings';
import { ListSettingsModel } from './model/list-settings-model';
import { ToolbarModule } from './module/toolbar';
import { RichTextEditorUIModel } from './richtexteditor-ui-model';
import { reconcileToolbarItems } from './model/toolbar-reconciler';
import { IToolbar } from '../base/toolbar-interface';
import { IEditorCoreOptions } from '../core/base/interface';
import { EditorCore } from '../core/base/editor-core';
import { EditorController } from '../controller/editor-controller';
import { ActionBeginEventArgs, ActionCompleteEventArgs } from '../controller/interface';
import * as classes from '../common/classes';
import * as constant from '../common/constant';
import { BeforeDialogOpenEventArgs, BeforeDialogCloseEventArgs, BeforePopupOpenEventArgs, BeforePopupCloseEventArgs, BeforeFileUploadEventArgs, FileUploadingEventArgs, FileSelectedEventArgs, FileUploadSuccessEventArgs, FileUploadFailedEventArgs, FileRemovingEventArgs, BeforeFileDropEventArgs, ResizeEventArgs, SlashCommandItemSelectArgs } from '../common/interface';
import { Locale } from '../base/service/locale';
import { QuickToolbarSettings } from './model/quick-toolbar-settings';
import { QuickToolbarSettingsModel } from './model/quick-toolbar-settings-model';
import { LinkSettings } from './model/link-settings';
import { LinkSettingsModel } from './model/link-settings-model';
import { TableSettings } from './model/table-settings';
import { TableSettingsModel } from './model/table-settings-model';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { QuickToolbarModule } from './module/quick-toolbar';
import { ValueFormat } from './interface';
import { getRegisteredCustomExtensions } from '../common/custom-node-extension';
import { SlashCommandSettings } from './model/slash-command-settings';
import { SlashCommand } from '../base/renderer/slash-commands';
import { SlashCommandSettingsModel } from './model';
import { InteractionSettings } from './model/interaction-settings';
import { InteractionSettingsModel } from './model/interaction-settings-model';
import { ImageSettings } from './model/image-settings';
import { ImageSettingsModel } from './model/image-settings-model';
import { EditorDocument } from './types/editor-document';
import { ImageModule } from './module/image';
import { LinkModule } from './module/link-module';
import { ServiceLocator } from '../base/service/service-locator';
import * as events from '../common/constant';
import { CommandExecutor } from './command-builder';
import { FormattingState, FormattingStateService } from '../common/services/formatting-state.service';
import { TableModule } from './module/table';
import * as CLS from '../base/classes';

import { EditorKeyBindingAction, EditorKeyBindingMap } from './model/key-bindings';
import { KeyBindingRegistry } from './module/keybindings';
import { BaseQuickToolbar } from '../base/renderer/base-quick-toolbar';
import { CustomUserAgentData } from '../common/user-agent';
import { DialogType } from '../common/enum';

/**
 * The Rich Text Editor component is a feature-rich, WYSIWYG (What You See Is What You Get) editor
 * that enables users to create and format rich HTML content with an intuitive user interface.
 * It provides comprehensive text formatting, media insertion, table creation, and content management capabilities.
 *
 * The component includes:
 * * **Toolbar** - Customizable toolbar with formatting commands, font controls, and media insertion tools
 * * **Quick Toolbar** - Context-sensitive toolbar appearing on text selection for quick formatting
 * * **Formatting** - Support for text styles (bold, italic, underline), alignment, indentation, and block formatting
 * * **Media** - Image upload, resize, and manipulation with configurable storage options
 * * **Tables** - Table creation and management with resizable cells
 * * **Links** - Hyperlink creation with automatic protocol handling and validation
 * * **Undo/Redo** - Configurable undo and redo history
 * * **Localization** - Multi-language support for UI elements
 * * **RTL Support** - Full right-to-left language support
 *
 * ## Usage Examples
 *
 * ### Default Setup
 *
 * ```html
 * <div id="editor"></div>
 * <script>
 *   var editor = new RichTextEditorUI({});
 *   editor.appendTo('#editor');
 * </script>
 * ```
 *
 * ### With Toolbar Customization
 *
 * ```html
 * <div id="editor"></div>
 * <script>
 *   var editor = new RichTextEditorUI({
 *     toolbarSettings: {
 *       items: ['Bold', 'Italic', 'Underline', '|', 'FormatPainter', '|',
 *               'NumberFormatList', 'BulletFormatList', '|', 'Link', 'Image', 'Table']
 *     }
 *   });
 *   editor.appendTo('#editor');
 * </script>
 * ```
 *
 * @class RichTextEditorUI
 * @extends Component
 */
@NotifyPropertyChanges
export class RichTextEditorUI extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Enable or disable the Rich Text Editor component. When set to `false`, the editor becomes non-interactive
     * and all toolbar items are disabled. The editable area remains visible but input is prevented.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Enable or disable the read-only mode for the Rich Text Editor. When set to `true`, the editor content
     * becomes read-only and toolbar items are disabled, preventing user input while maintaining visibility
     * of the editor and its content.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Sets the Rich Text Editor width. The width can be specified in pixels, percentages, or other valid CSS units.
     * When set to `'100%'`, the editor expands to fill its parent container width.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Sets the Rich Text Editor height. The height can be specified in pixels, percentages, or other valid CSS units.
     * When set to `'auto'`, the height adjusts automatically based on the content.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Sets the placeholder text displayed in the editor's editable area when it is empty. The placeholder provides
     * a hint to users about the expected content or format.
     *
     * @default ''
     */
    @Property('')
    public placeholder: string;

    /**
     * Sets custom HTML attributes on the Rich Text Editor root element. This property accepts a key-value pair
     * object where keys are attribute names and values are attribute values.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Enables persistence for the component state. When set to `true`, the editor state (including content)
     * is persisted across page reloads using the browser's local storage.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies custom CSS classes to be applied to the Rich Text Editor root element. Multiple classes can be
     * separated by spaces to apply multiple CSS classes for custom styling.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Overrides the registered editor keyboard bindings.
     * On macOS, configured `ctrl` modifiers are mapped to the equivalent
     * Command modifier automatically; separate Mac bindings are not required.
     */
    @Property({})
    public keyBindings: EditorKeyBindingMap;

    /**
     * Editor content.
     *
     * The accepted type depends on `valueFormat`:
     *  - `'html'`: an HTML string.
     *  - `'json'`: an `EditorDocument` object.
     *
     * @see {@link ValueFormat}
     */
    @Property<string | EditorDocument>()
    public value: string | EditorDocument;

    /**
     * Specifies the format used by the `value` property and getter methods. Controls how the editor content
     * is serialized and deserialized.
     * ```props
     * html :- The value is an HTML string representation of the editor content.
     * json :- The value is an EditorDocument object representing the document structure.
     * ```
     *
     * @default 'json'
     */
    @Property('json')
    public valueFormat: ValueFormat;

    /**
     * Specifies the idle interval in milliseconds before autosave commits dirty (unsaved) content. This property
     * only has an effect when `enableAutoSave` is set to `true`. When the user remains idle for this duration,
     * the editor content is automatically saved.
     *
     * @default 10000
     */
    @Property(10000)
    public saveInterval: number;

    /**
     * Sets the locale (language and region) for the Rich Text Editor component. This affects the language of
     * toolbar tooltips, placeholder text, dialog labels, and error messages displayed in the editor.
     *
     * @default 'en-US'
     */
    @Property('en-US')
    public locale: string;

    /**
     * Enables right-to-left (RTL) text direction for the Rich Text Editor. When set to `true`, the editor layout,
     * toolbar, and content direction are flipped to support RTL languages like Arabic and Hebrew.
     *
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Specifies the maximum number of undo history steps stored in the editor. Each step corresponds to a user action
     * or batch of compatible adjacent actions. Increasing this value allows more undo actions at the cost of increased memory.
     *
     * @default 30
     */
    @Property(30)
    public undoRedoSteps: number;

    /**
     * Specifies the time interval in milliseconds used by the editor to group compatible adjacent changes into a
     * single undo/redo step. Changes that occur within this interval are grouped together, creating a single undoable action.
     * This improves the user experience by preventing excessive undo steps for rapid consecutive changes.
     *
     * @default 300
     */
    @Property(300)
    public undoRedoTimer: number;

    /**
     * Defines the Toolbar settings of the Rich Text Editor. This property controls the toolbar configuration,
     * including the items displayed, their grouping, and visibility. Use this to customize toolbar appearance
     * and behavior based on your application's requirements.
     *
     * @default
     * {
     *   enable: true,
     *   type: 'Expanded',
     *   position: 'Top',
     *   enableFloating: true,
     *   floatingOffset: 0
     * }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Defines the font size settings of the Rich Text Editor. Configures the font size dropdown items,
     * default font size selection, and the width of the font size dropdown in the toolbar.
     *
     * @default
     * {
     *   items: [
     *     { text: 'Default', value: { size: 'Default' } },
     *     { text: '8', value: { size: '8px' } },
     *     { text: '10', value: { size: '10px' } },
     *     { text: '12', value: { size: '12px' } },
     *     { text: '14', value: { size: '14px' } },
     *     { text: '16', value: { size: '16px' } },
     *     { text: '18', value: { size: '18px' } },
     *     { text: '24', value: { size: '24px' } }
     *   ]
     * }
     */
    @Complex<FontSizeModel>({}, FontSize)
    public fontSize: FontSizeModel;

    /**
     * Defines the font family settings of the Rich Text Editor. Configures the font family dropdown items,
     * default font family selection, and the width of the font family dropdown in the toolbar.
     *
     * @default
     * {
     *   items: [
     *     { text: 'Default', value: { family: 'Default' } },
     *     { text: 'Arial', value: { family: 'Arial' } },
     *     { text: 'Helvetica', value: { family: 'Helvetica' } },
     *     { text: 'Times New Roman', value: { family: 'Times New Roman' } },
     *     { text: 'Courier New', value: { family: 'Courier New' } }
     *   ]
     * }
     */
    @Complex<FontFamilyModel>({}, FontFamily)
    public fontFamily: FontFamilyModel;

    /**
     * Configures the font color picker. Controls the default color, color
     * Defines the Quick Toolbar settings of the Editor.
     *
     * The quick toolbar is a contextual popup toolbar that appears next to the
     * current text selection within the editable area, providing fast access to
     * the most relevant formatting commands without moving focus back to the
     * main toolbar.
     *
     * Use this property to:
     * * Toggle the quick toolbar on or off via {@link QuickToolbarSettings.enable|enable}.
     * * Configure the items displayed on text selection via
     *   {@link QuickToolbarSettings.text|text}.
     * * Control popup attachment via {@link QuickToolbarSettings.appendToBody|appendToBody}
     *   to avoid clipping inside narrow or scroll-constrained containers.
     *
     * @default
     * {
     *   enable: true,
     *   text: null,
     *   image: ['image-src', 'image-alt', 'image-title', 'image-height', 'image-width', '|', 'image-delete', '|', 'image-block', 'image-inline', '|', 'image-blob', 'image-base64', '|', 'image-align-left', 'image-align-center', 'image-align-right', '|', 'image-wrap-left', 'image-wrap-right'],
     *   table: ['Row', 'Column', 'Header', 'CellBackgroundColor', 'VerticalAlign', 'Align', 'Delete']
     * }
     */
    @Complex<QuickToolbarSettingsModel>({}, QuickToolbarSettings)
    public quickToolbarSettings: QuickToolbarSettingsModel;

    /**
     * Defines the Link settings of the Editor.
     *
     * The link settings govern how hyperlinks are created, normalized, and
     * validated within the editable area — covering automatic link creation
     * when a URL is pasted over selected text, the default target applied
     * to newly created links, protocol normalization for external URLs,
     * and validation of accepted protocols.
     *
     * Use this property to:
     * * Toggle automatic link creation on paste via {@link LinkSettings.linkOnPaste|linkOnPaste}.
     * * Configure the default target for newly created links via
     *   {@link LinkSettings.defaultTarget|defaultTarget}.
     * * Control protocol normalization for URLs missing a protocol via
     *   {@link LinkSettings.autoPrependProtocol|autoPrependProtocol} and
     *   {@link LinkSettings.defaultProtocol|defaultProtocol}.
     * * Restrict accepted URL protocols via {@link LinkSettings.allowedProtocols|allowedProtocols}
     *   to guard against unsafe schemes such as `javascript:`.
     *
     * {% codeBlock src='richtexteditor-ui/link-settings/index.md' %}{% endcodeBlock %}
     *
     * @default
     * {
     *   linkOnPaste: true,
     *   defaultTarget: '_blank',
     *   autoPrependProtocol: true,
     *   defaultProtocol: 'https',
     *   allowedProtocols: ['http', 'https', 'mailto', 'tel']
     * }
     */
    @Complex<LinkSettingsModel>({}, LinkSettings)
    public linkSettings: LinkSettingsModel;

    /**
     * Configures the Table insertion feature. Controls whether table cells can be resized after insertion.
     *
     * @default
     * {
     *   resize: true
     * }
     */
    @Complex<TableSettingsModel>({ resize: true }, TableSettings)
    public tableSettings: TableSettingsModel;

    /**
     * Configures the font color picker settings in the Rich Text Editor. This property controls the color palette,
     * default color selection, color picker mode (Palette or Picker), number of columns in the palette, mode switcher
     * visibility, and recent colors functionality shown in the FontColor toolbar item.
     *
     * @default
     * {
     *   default: '#DC2626',
     *   mode: 'Palette',
     *   columns: 5,
     *   modeSwitcher: false,
     *   showRecentColors: true,
     *   preset: {
     *     'Custom': ['#000000', '#FFFFFF', '#DC2626', '#B8590D', '#8C7000', '#5B21B6', '#4D700F', '#1F7333', '#146B52', '#0D6666', '#0A6185', '#1A5499', '#2640A6', '#383399', '#612E9E', '#732494', '#941F6B', '#9E2447', '#992938', '#704724', '#7A612E', '#5C611F', '#404C61', '#4D4D4D', '#242947']
     *   }
     * }
     */
    @Complex<FontColorModel>({}, FontColor)
    public fontColor: FontColorModel;

    /**
     * Configures the background color (text highlight color) picker settings in the Rich Text Editor. This property
     * controls the color palette, default background color selection, color picker mode (Palette or Picker), number of
     * columns in the palette, mode switcher visibility, and recent colors functionality. Uses the same configuration
     * shape as {@link fontColor}.
     *
     * @default
     * {
     *   default: '#FFF7C7',
     *   mode: 'Palette',
     *   columns: 5,
     *   modeSwitcher: false,
     *   showRecentColors: true,
     *   preset: {
     *     'Custom': ['#000000', '#FFFFFF', '#FCE3E0', '#FFEDD4', '#EBF7D1', '#FFF7C7', '#DBF5E0', '#D6F5EB', '#D4F2F2', '#D4F0FA', '#DBEBFC', '#E0E5FC', '#E5E3FC', '#EDE0FC', '#F2E0FC', '#FAE0F2', '#FCE0E8', '#FCE0E3', '#F5EBDE', '#F7F2E0', '#F0F2DB', '#E5EBF0', '#EDEDED', '#E0E0E5', '#DEE0EB']
     *   }
     * }
     */
    @Complex<BackgroundColorModel>({}, BackgroundColor)
    public backgroundColor: BackgroundColorModel;

    /**
     * Defines the List settings of the Rich Text Editor. This property controls the items shown in the
     * `NumberFormatList` and `BulletFormatList` toolbar dropdowns, allowing customization of available
     * list formatting options.
     *
     * @default
     * {
     *   numberFormatList: [{ id: 'NumberDecimal', text: 'Number', command: 'setListStyle', listType: 'decimal' }, ...],
     *   bulletFormatList: [{ id: 'BulletDisc', text: 'Disc', command: 'setListStyle', listType: 'disc' }, ...]
     * }
     */
    @Complex<ListSettingsModel>({}, ListSettings)
    public listSettings: ListSettingsModel;

    /**
     * Defines the Format toolbar item configuration for the Rich Text Editor. This property controls the
     * formatting options available in the Format dropdown menu in the toolbar.
     *
     * @default
     * {
     *   items: [
     *     { id: 'Paragraph', text: 'Paragraph', command: 'paragraph' },
     *     { id: 'Heading 1', text: 'Heading 1', command: 'heading1' },
     *     { id: 'Heading 2', text: 'Heading 2', command: 'heading2' },
     *     { id: 'Heading 3', text: 'Heading 3', command: 'heading3' },
     *     { id: 'Heading 4', text: 'Heading 4', command: 'heading4' }
     *   ]
     * }
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;
    /**
     * Configures the slash command settings of the Rich Text Editor. Typing `/` in the editor content opens
     * an inline command popup with predefined and custom formatting items. This feature enables quick access to
     * block-level formatting commands without accessing the main toolbar.
     *
     * Properties:
     * * `enable` - Specifies whether the slash command feature is enabled or disabled.
     * * `items` - An array specifying the items displayed in the slash command popup (e.g., 'Paragraph', 'Heading 1', 'BulletList').
     * * `popupWidth` - Width of the slash command popup. Accepts pixels, numbers, or percentages.
     * * `popupHeight` - Height of the slash command popup. Accepts pixels, numbers, or percentages.
     *
     * @default
     * {
     *   enable: false,
     *   items: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'NumberedList', 'BulletList', 'Blockquote', 'Table', 'Link', 'Image'],
     *   popupWidth: '300px',
     *   popupHeight: '320px'
     * }
     */
    @Complex<SlashCommandSettingsModel>({}, SlashCommandSettings)
    public slashCommandSettings: SlashCommandSettingsModel;

    /**
     * Configures editor interaction behaviors and user interaction preferences. These settings control
     * interaction behavior only and must not change the persisted document format or content structure.
     * They affect how the editor responds to user actions like typing, pasting, and keyboard events.
     *
     * @default
     * {
     *   enableAutoFormat: true,
     *   enableTabKeyIndent: true
     * }
     */
    @Complex<InteractionSettingsModel>({}, InteractionSettings)
    public interactionSettings: InteractionSettingsModel;

    /**
     * Configures image upload, validation, storage, display, dimensions, and resize behavior in the Rich Text Editor.
     * This property controls all aspects of image handling including file type validation, size restrictions, server
     * endpoints for upload and removal, storage format, display mode, and resize capabilities.
     *
     * Properties:
     * * `allowedTypes` - Image file extensions that may be selected, dropped, pasted, or uploaded. Defaults to `['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']`.
     * * `maxFileSize` - Maximum image file size in bytes. Defaults to 30000000 (30 MB).
     * * `uploadUrl` - Server endpoint used to upload image files via POST request. When `null`, `editor.uploadFile()` fails with `fileUploadFailed` event.
     * * `removeUrl` - Server endpoint used to remove a previously uploaded image from the server.
     * * `imageUrl` - Base URL for resolving uploaded image names returned by the server into full image URLs.
     * * `saveFormat` - Storage format for inserted images: `'Blob'` (object URL) or `'Base64'` (data URI). Defaults to `'Blob'`.
     * * `display` - Display mode for images: `'inline'` (within text flow) or `'break'` (block-level). Defaults to `'inline'`.
     * * `dimension` - Plain object with `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` properties. Replace the whole object on update.
     * * `resize` - Whether users may resize images in the editor. Defaults to `true`.
     *
     * @default
     * {
     *   allowedTypes: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
     *   maxFileSize: 30000000,
     *   uploadUrl: null,
     *   removeUrl: null,
     *   imageUrl: null,
     *   saveFormat: 'Blob',
     *   display: 'inline',
     *   dimension: {
     *     width: 'auto',
     *     height: 'auto',
     *     minWidth: 0,
     *     maxWidth: null,
     *     minHeight: 0,
     *     maxHeight: null
     *   },
     *   resize: true
     * }
     */
    @Complex<ImageSettingsModel>({}, ImageSettings)
    public imageSettings: ImageSettingsModel;

    /**
     * Raised when the Rich Text Editor component has completed initialization and is ready for user interaction.
     * At this point, all internal modules and subcomponents have been initialized and the editor is fully operational.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Raised when the Rich Text Editor component has been destroyed. This event fires after all resources
     * have been cleaned up and the component is no longer functional.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Raised when focus enters the Rich Text Editor shell (editable area or toolbar). This event allows
     * applications to respond when the editor becomes the active component.
     *
     * @event focused
     */
    @Event()
    public focused: EmitType<FocusedEventArgs>;

    /**
     * Raised when focus leaves the Rich Text Editor shell. This event fires when the user moves focus away
     * from the editor to another component.
     *
     * @event blurred
     */
    @Event()
    public blurred: EmitType<BlurredEventArgs>;

    /**
     * Raised before an action-driven mutation is executed. This event allows prevention of user actions
     * like formatting changes by setting `args.cancel = true`.
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<ActionBeginEventArgs>;

    /**
     * Raised after an accepted action-driven mutation has been successfully processed and applied to the document.
     * This event fires only when the action is not cancelled in the `actionBegin` event.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<ActionCompleteEventArgs>;

    /**
     * Raised when a dirty (modified) value is committed to the document. This event fires on blur
     * (when focus leaves the editor) or on autosave if autosave is enabled.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Raised when a toolbar item is clicked by the user. This event allows applications to track or
     * intercept toolbar item interactions and perform custom logic.
     *
     * @event itemClick
     */
    @Event()
    public itemClick: EmitType<itemClickEventArgs>;

    /**
     * Raised after the toolbar item status (active states, dropdown values, color picker selections)
     * has been synchronized with the current editor selection. This event fires after formatting states
     * are updated to reflect the user's current cursor position or selection in the editor.
     *
     * @event updatedToolbarStatus
     */
    @Event()
    public updatedToolbarStatus: EmitType<UpdatedToolbarStatusEventArgs>;

    /**
     * Raised before a sub-component dialog opens.
     *
     * The event args ({@link BeforeDialogOpenEventArgs}) extend the ej2
     * `BeforeOpenEventArgs` with a `subType` field — a plain string set when
     * the sub-component is created identifying the editor feature the dialog
     * belongs to (e.g. `'Link'`, `'Image'`, `'Table'`).
     */
    @Event()
    public beforeDialogOpen: EmitType<BeforeDialogOpenEventArgs>;

    /**
     * Raised before a sub-component dialog closes.
     *
     * The event args ({@link BeforeDialogCloseEventArgs}) extend the ej2
     * `BeforeCloseEventArgs` with a `subType` field identifying the editor
     * feature the dialog belongs to (e.g. `'Link'`, `'Image'`, `'Table'`).
     */
    @Event()
    public beforeDialogClose: EmitType<BeforeDialogCloseEventArgs>;

    /**
     * Raised before a sub-component popup opens.
     *
     * The event args ({@link BeforePopupOpenEventArgs}) extend the ej2
     * `PopupEventArgs` with a `subType` field identifying the feature (e.g.
     * `'Link'`, `'Image'`, `'Table'`).
     */
    @Event()
    public beforePopupOpen: EmitType<BeforePopupOpenEventArgs>;

    /**
     * Raised before a sub-component popup closes.
     *
     * The event args ({@link BeforePopupCloseEventArgs}) extend the ej2
     * `BeforeCloseEventArgs` with a `subType` field identifying the feature
     * (e.g. `'Link'`, `'Image'`, `'Table'`).
     */
    @Event()
    public beforePopupClose: EmitType<BeforePopupCloseEventArgs>;

    /**
     * Raised before a file is uploaded to the server.
     *
     * The event args ({@link BeforeFileUploadEventArgs}) extend the ej2
     * `BeforeUploadEventArgs` with a `subType` field identifying the feature
     * the upload is for (e.g. `'Image'`).
     */
    @Event()
    public beforeFileUpload: EmitType<BeforeFileUploadEventArgs>;

    /**
     * Raised while a file is being uploaded to the server.
     *
     * The event args ({@link FileUploadingEventArgs}) extend the ej2
     * `UploadingEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    @Event()
    public fileUploading: EmitType<FileUploadingEventArgs>;

    /**
     * Raised when files are selected for upload.
     *
     * The event args ({@link FileSelectedEventArgs}) extend the ej2
     * `SelectedEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    @Event()
    public fileSelected: EmitType<FileSelectedEventArgs>;

    /**
     * Raised when an upload succeeds.
     *
     * The event args ({@link FileUploadSuccessEventArgs}) extend the ej2
     * `SuccessEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    @Event()
    public fileUploadSuccess: EmitType<FileUploadSuccessEventArgs>;

    /**
     * Raised when an upload fails.
     *
     * The event args ({@link FileUploadFailedEventArgs}) extend the ej2
     * `FailureEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    @Event()
    public fileUploadFailed: EmitType<FileUploadFailedEventArgs>;

    /**
     * Raised before a previously-uploaded image is removed (client-side
     * `URL.revokeObjectURL` for `saveFormat: 'Blob'`, or before the
     * `removeUrl` POST is sent for server-side removal).
     *
     * Set `args.cancel = true` to keep the image in place; both the `Blob`
     * revocation and the `removeUrl` POST will be skipped. The event args
     * are {@link FileRemovingEventArgs}.
     */
    @Event()
    public fileRemoving: EmitType<FileRemovingEventArgs>;

    /**
     * Raised before drop/paste-inserted files are routed through the typed
     * command pipeline. Set `args.cancel = true` to keep the document
     * untouched. The event args are {@link BeforeFileDropEventArgs}.
     */
    @Event()
    public beforeFileDrop: EmitType<BeforeFileDropEventArgs>;

    /**
     * Raised when an image resize gesture starts. Set `args.cancel = true`
     * to prevent the gesture. The event args are {@link ResizeEventArgs}.
     */
    @Event()
    public resize: EmitType<ResizeEventArgs>;

    /**
     * Raised continuously while an image is being resized. NOT cancellable.
     * The event args are {@link ResizeEventArgs} with `name: 'resizing'`.
     */
    @Event()
    public resizing: EmitType<ResizeEventArgs>;

    /**
     * Raised after an image resize gesture ends. NOT cancellable. The event
     * args are {@link ResizeEventArgs} with `name: 'resizeStop'`.
     */
    @Event()
    public resizeStop: EmitType<ResizeEventArgs>;

    /**
     * Raised when a slash command item is selected from the slash command popup.
     *
     * Set `args.cancel` to `true` inside the handler to prevent the default
     * command execution. The event args are of type
     * {@link SlashCommandItemSelectArgs}.
     *
     * @event slashCommanditemSelect
     */
    @Event()
    public slashCommanditemSelect: EmitType<SlashCommandItemSelectArgs>;


    // Lifecycle state fields
    protected isInitialized: boolean = false;
    public isDestroyed: boolean = false;
    protected hasCreatedEventBeenRaised: boolean = false;
    private isHeadlessEventsWired: boolean = false;
    private isUiEventsWired: boolean = false;
    private pendingChangeArgs: ChangeEventArgs | null = null;
    private autoSaveDebounced: Function = null;
    // Internal references
    public baseEditorCore: EditorCore | null = null;
    /**
     * The editor controller - the sole mutation gateway between UI modules
     * and the headless {@link EditorCore}. Initialized in {@link render}
     * after `baseEditorCore` and destroyed in {@link destroy}.
     */
    public editorController: EditorController;
    protected editorHost: HTMLElement | null = null;
    public inputElement: HTMLElement | null = null;
    public localeObj: L10n | null = null;
    public rootElement: HTMLElement | null = null;
    private linkModule: LinkModule = null;
    public isBlur: boolean;
    public serviceLocator: ServiceLocator;

    /**
     * Reference to the Toolbar module instance.
     * Set by the Toolbar module when it initializes.
     * Implements the IToolbar interface for toolbar operations.
     */
    public toolbar: IToolbar | null = null;
    public toolbarModule: ToolbarModule | null;
    public quickToolbarModule: QuickToolbarModule | null;
    public slashCommandModule: SlashCommand;
    public tableModule: TableModule;
    /**
     * Service for querying and caching the editor's formatting state.
     * Shared by toolbar and quick-toolbar modules to avoid duplicate queries.
     */
    public formattingStateService: FormattingStateService | null = null;
    private readonly documentSelectionChangeHandler: EventListener = this.notifyEditorSelectionChange.bind(this);
    private readonly documentMouseDownHandler: EventListener = this.notifyDocumentMouseDown.bind(this);
    private readonly documentMouseUpHandler: EventListener = this.notifyDocumentMouseUp.bind(this);
    private readonly windowResizeHandler: EventListener = this.handleWindowResize.bind(this);
    private resizeObserver: ResizeObserver | null = null;
    private resizeObserverHandler: ResizeObserverCallback | null = null;

    public scrollParentElements: HTMLElement[]
    /**
     * Reference to the Image module instance.
     *
     * `ImageModule` is a built-in (default) module — created in `render()`,
     * so this is always populated after the editor mounts. Hosts do not need
     * to call `RichTextEditorUI.Inject(ImageModule)` themselves; the module
     * is wired in unconditionally, mirroring `ToolbarModule` and
     * `QuickToolbarModule`.
     */
    public imageModule: ImageModule;
    /** Action selected by the headless keymap for the current native keydown. */
    public keyboardShortcutAction: EditorKeyBindingAction | undefined;
    /**
     * Function pointer installed by {@link ImageModule} so the toolbar's
     * action handler can dispatch a click on the `Image` toolbar item into
     * the module's `show()` method without taking a direct dependency on
     * the module class. Cleared on destroy.
     */
    public openImageDialog: (() => void) | null | undefined;

    /**
     * @private
     */
    public userAgentData: CustomUserAgentData;

    constructor(options?: RichTextEditorUIModel, element?: string | HTMLElement) {
        super(options, element as HTMLElement);
        initializeTelemetry('RichTextEditor UI');
        // State initialized in constructor per lifecycle spec section 2
        this.isInitialized = false;
        this.isDestroyed = false;
        this.baseEditorCore = null;
        this.editorController = null;
        this.editorHost = null;
        this.localeObj = null;
        this.hasCreatedEventBeenRaised = false;
        this.formattingStateService = new FormattingStateService();
        // Validate initial valueFormat per spec
        assertValidValueFormat(options ? options.valueFormat : undefined);
    }

    protected getEditorExtensions(): ExtensionDefinition<Object>[] {
        // eslint-disable-next-line @typescript-eslint/tslint/config, @typescript-eslint/no-this-alias
        const parent = this;
        // eslint-disable-next-line @typescript-eslint/tslint/config, @typescript-eslint/no-this-alias
        const editor = this;
        return [
            paragraphExtension,
            headingExtension,
            boldExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'bold');
                }
            }),
            italicExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'italic');
                }
            }),
            underlineExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'underline');
                }
            }),
            strikethroughExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'strikethrough');
                }
            }),
            subscriptExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'subscript');
                }
            }),
            superscriptExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'superscript');
                }
            }),
            toLowerCaseExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'lowercase');
                }
            }),
            toUpperCaseExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'uppercase');
                }
            }),
            blockquoteExtension,
            horizontalRuleExtension,
            codeBlockExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'code-block');
                }
            }),
            clearFormattingExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'clear-format');
                }
            }),
            indentOutdentExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'indents', 'outdents');
                }
            }),
            fontColorExtension,
            backgroundColorExtension,
            fontFamilyExtension,
            fontSizeExtension,
            inlineCodeExtension.extend({
                priority: 1000,
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'inlinecode');
                }
            }),
            listExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'ordered-list', 'unordered-list');
                }
            }),
            undoRedoExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'undo', 'redo');
                }
            }),
            textAlignExtension.extend({
                keyboardShortcuts(): Record<string, () => boolean> {
                    const inlineBinding: string | undefined = KeyBindingRegistry.getResolvedKeyBinding(editor, 'inlinecode');
                    const inlineShortcut: string | undefined = inlineBinding
                        ? KeyBindingRegistry.toHeadlessShortcut(inlineBinding)
                        : undefined;
                    const alignShortcut: string = KeyBindingRegistry.toHeadlessShortcut('ctrl+e');
                    return inlineShortcut === alignShortcut ? { 'Mod-e': () => false } : {};
                }
            }),
            linkExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'link');
                }
            }),
            placeholderExtension.configure({
                placeholder: parent.placeholder,
                emptyNodeClass: 'e-placeholder-is-empty',
                emptyEditorClass: 'e-placeholder-is-editor-empty',
                dataAttribute: 'data-placeholder',
                showOnlyCurrent: false,
                showOnlyWhenEditable: false,
                showOnlyWhenEditorEmpty: true
            }),
            tableExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'table');
                }
            }),
            imageExtension.extend({
                keyboardShortcuts(): Record<string, (event?: KeyboardEvent) => void> {
                    return KeyBindingRegistry.getKeyboardShortcutMap(editor, 'image');
                },
                defineOptions(): { resize: false | { enabled: boolean; alwaysPreserveAspectRatio: boolean;
                    minWidth: number | undefined; minHeight: number | undefined;
                    max: { width: number | undefined; height: number | undefined };
                    onResizeStart: () => void } } {
                    return {
                        resize: parent.imageSettings?.resize ? {
                            enabled: true,
                            alwaysPreserveAspectRatio: true,
                            minWidth: parent.toPixelDimension(parent.imageSettings.dimension?.minWidth),
                            minHeight: parent.toPixelDimension(parent.imageSettings.dimension?.minHeight),
                            max: {
                                width: parent.toPixelDimension(parent.imageSettings.dimension?.maxWidth),
                                height: parent.toPixelDimension(parent.imageSettings.dimension?.maxHeight)
                            },
                            onResizeStart: (): void => {
                                if (parent.quickToolbarModule) {
                                    parent.quickToolbarModule.hideQuickToolbars(true);
                                }
                            }
                        } : false
                    };
                }
            }) as ExtensionDefinition<Object>,
            ...getRegisteredCustomExtensions()
        ];
    }

    private toPixelDimension(value: string | number | null | undefined): number | undefined {
        if (typeof value === 'number' && isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '' && !value.trim().endsWith('%') && value.trim() !== 'auto') {
            const parsed: number = Number(value.trim().replace(/px$/i, ''));
            return isFinite(parsed) ? parsed : undefined;
        }
        return undefined;
    }

    public onPropertyChanged(newProp: RichTextEditorUIModel, oldProp: RichTextEditorUIModel): void {
        if (!this.isInitialized || this.isDestroyed) {
            return;
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
                if (newProp.width !== undefined) {
                    this.applyWidth(newProp.width);
                }
                break;
            case 'height':
                if (newProp.height !== undefined) {
                    this.applyHeight(newProp.height);
                }
                break;
            case 'value':
                if (this.baseEditorCore) {
                    const incomingValue: string | EditorDocument | undefined = newProp.value;
                    // Headless Editor validates the document on mount.
                    const nextValue: string | EditorDocument = incomingValue !== undefined
                        ? incomingValue
                        : (oldProp ? oldProp.value : this.value);
                    if (this.valueFormat === 'html' && typeof nextValue === 'string') {
                        const nextContent: string = nextValue;
                        newProp.value = nextContent;
                    } else {
                        const nextDocumentRoot: EditorDocument | null = nextValue as EditorDocument;
                        newProp.value = nextDocumentRoot;
                    }
                    this.baseEditorCore.observer.notify(constant.modelChanged, { newProperties: newProp, oldProperties: oldProp });
                    this.value = nextValue;
                }
                break;
            case 'valueFormat':
                assertValidValueFormat(newProp.valueFormat);
                this.valueFormat = newProp.valueFormat as ValueFormat;
                break;
            case 'placeholder':
                if (this.baseEditorCore) {
                    this.baseEditorCore.observer.notify(constant.modelChanged,
                                                        { newProperties: newProp, oldProperties: oldProp });
                }
                break;
            case 'htmlAttributes':
                this.applyHtmlAttributes(newProp.htmlAttributes);
                break;
            case 'cssClass':
                this.applyCssClass(newProp.cssClass, oldProp?.cssClass);
                break;
            case 'locale':
                this.initializeLocale();
                if (this.toolbarModule) {
                    this.toolbarModule.updateLocale();
                }
                if (this.quickToolbarModule) {
                    this.quickToolbarModule.updateLocale();
                }
                break;
            case 'enablePersistence':
                this.enablePersistence = newProp.enablePersistence;
                break;
            case 'enableRtl':
                if (!isNOU(newProp.enableRtl)) {
                    this.applyRtlClass(newProp.enableRtl);
                    if (this.baseEditorCore) {
                        this.baseEditorCore.observer.notify(constant.modelChanged,
                                                            { newProperties: newProp, oldProperties: oldProp });
                    }
                }
                break;
            case 'saveInterval':
                if (!isNOU(newProp.saveInterval)) {
                    this.saveInterval = newProp.saveInterval;
                    this.clearAutoSaveTimer();
                }
                break;
            case 'toolbarSettings':
                if (newProp.toolbarSettings !== undefined) {
                    this.applyToolbarSettings(
                        newProp.toolbarSettings as ToolbarSettingsModel,
                        oldProp?.toolbarSettings as ToolbarSettingsModel | undefined
                    );
                }
                break;
            case 'fontColor':
                if (newProp.fontColor !== undefined || newProp.fontColor !== oldProp.fontColor) {
                    this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'backgroundColor':
                if (newProp.backgroundColor !== undefined || newProp.backgroundColor !== oldProp.backgroundColor) {
                    this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'format':
                if (newProp.format !== undefined || newProp.format !== oldProp.format) {
                    this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'readonly':
                this.updatReadOnlyState();
                this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                if (this.baseEditorCore) {
                    this.baseEditorCore.observer.notify(constant.modelChanged,
                                                        { newProperties: newProp, oldProperties: oldProp });
                }
                break;
            case 'quickToolbarSettings':
                if (!isNOU(newProp.quickToolbarSettings)) {
                    this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'fontSize':
                if (newProp.fontSize !== undefined || newProp.fontSize !== oldProp.fontSize) {
                    this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'fontFamily':
                if (newProp.fontFamily !== undefined || newProp.fontFamily !== oldProp.fontFamily) {
                    this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'slashCommandSettings':
                this.notify(constant.modelChanged, { newProp: newProp, oldProp: oldProp });
                break;
            case 'listSettings':
                if (newProp.listSettings !== undefined) {
                    this.notify(constant.modelChanged, {
                        newProp: newProp,
                        oldProp: oldProp
                    });
                }
                break;
            case 'interactionSettings':
                this.notify(constant.modelChanged, {newProp: newProp, oldProp: oldProp});
                break;
            case 'imageSettings':
                if (newProp.imageSettings !== undefined) {
                    this.applyImageSettings(
                        newProp.imageSettings as ImageSettingsModel,
                        oldProp ? (oldProp.imageSettings as ImageSettingsModel) : undefined
                    );
                }
                break;
            case 'linkSettings':
                if (newProp.linkSettings !== undefined) {
                    this.linkSettings = newProp.linkSettings as LinkSettingsModel;
                    if (this.isInitialized && !this.isDestroyed && this.linkModule) {
                        this.notify(constant.linkModelChanged, this.linkSettings);
                    }
                }
                break;
            default:
                break;
            }
        }
    }

    /**
     * Routes `imageSettings` mutations to the live `EditorUploadPopup` inside
     * the image module. Each property is diffed against the previous value
     * inside `imageModelChanged` so the module can re-wire only what changed.
     *
     * No-op when the editor has not finished initializing or has already
     * been destroyed.
     *
     * @param {ImageSettingsModel} next - Incoming image settings.
     * @param {ImageSettingsModel} [prev] - Previous image settings, when known.
     * @returns {void}
     */
    private applyImageSettings(next: ImageSettingsModel, prev?: ImageSettingsModel): void {
        if (!this.isInitialized || this.isDestroyed) {
            return;
        }
        if (!this.imageModule) {
            // No module registered; mutate the model silently so reads stay
            // consistent even when the image module is not in use.
            return;
        }
        const diff: { kind: string; value: unknown }[] = [];
        const trackedKeys: (keyof ImageSettingsModel)[] = [
            'allowedTypes', 'maxFileSize', 'uploadUrl', 'removeUrl', 'imageUrl',
            'saveFormat', 'display', 'dimension', 'resize'
        ];
        for (const key of trackedKeys) {
            const nextVal: unknown = (next as Record<string, unknown>)[key as string];
            const prevVal: unknown = prev ? ((prev as Record<string, unknown>)[key as string]) : undefined;
            if (nextVal !== prevVal) {
                diff.push({ kind: key, value: nextVal });
            }
        }
        // Single notify covers all kinds so subscribers can iterate.
        this.notify(constant.imageModelChanged, { changes: diff });
    }

    protected preRender(): void {
        // Validate host element is attached to DOM per lifecycle spec section 3.2
        if (!this.element) {
            throw new Error('EditorBase: Host element must be attached to the DOM');
        }
        this.initializeLocale();
        this.isBlur = true;
        // Build the editor wrapper hierarchy and pass the content wrapper to EditorCore.
        const editorContainer: HTMLElement = this.createElement('div', { className: 'e-rte-ui-container' });
        const contentContainer: HTMLElement = this.createElement('div', { className: 'e-rte-ui-content-container' });
        editorContainer.appendChild(contentContainer);
        this.editorHost = contentContainer;
        this.element.appendChild(editorContainer);
        this.rootElement = editorContainer;
        this.applyHostConfiguration();
    }

    private initializeModules(): void {
        this.editorController = new EditorController(this.baseEditorCore);
        if (this.toolbarSettings.enable) {
            this.toolbarModule = new ToolbarModule(this, this.localeObj);
        }
        this.quickToolbarModule = new QuickToolbarModule(this, this.localeObj);
        this.linkModule = new LinkModule(this, this.serviceLocator);
        this.tableModule = new TableModule(this, this.localeObj);
        this.imageModule = new ImageModule(this, this.localeObj);
    }
    protected render(): void {
        // Mount the runtime inside the editor host
        if (this.editorHost) {
            const initialDocumentRoot: EditorDocument | null = this.valueFormat === 'json' ? this.value as EditorDocument : null;
            const initialContent: string | null = this.valueFormat === 'html' && typeof this.value === 'string'
                ? this.value : null;
            const editorCoreOptions: IEditorCoreOptions = {
                hostElement: this.editorHost,
                value: this.value as string,
                content: initialContent,
                valueFormat: this.valueFormat,
                enableRtl: this.enableRtl,
                placeholder: this.placeholder,
                enableAutoFormat: this.interactionSettings ? this.interactionSettings.enableAutoFormat : true,
                enableTabKeyIndent: this.interactionSettings ? this.interactionSettings.enableTabKeyIndent : true,
                undoRedoSteps: this.undoRedoSteps,
                undoRedoTimer: this.undoRedoTimer,
                extensions: this.getEditorExtensions(),
                documentRoot: initialDocumentRoot as DocumentRoot,
                readonly: this.readonly
            };
            this.baseEditorCore = new EditorCore(editorCoreOptions);
            this.inputElement = this.baseEditorCore.getInputElement();
            this.inputElement.id = this.element.id + '_edit-view';
        }
        this.isInitialized = true;
        this.applyRtlClass(this.enableRtl);
        this.updateEnable(this.enable);
        this.initializeModules();
        this.updatReadOnlyState();
        this.wireResizeObserver();
        this.notify(events.initialEnd, {});
        if (this.element.dataset.rteUnitTesting === 'true') {
            this.userAgentData = new CustomUserAgentData(Browser.userAgent, true);
        } else {
            this.userAgentData = new CustomUserAgentData(Browser.userAgent, false);
        }

    }
    // Initializes and attaches a ResizeObserver to monitor element size changes.
    private wireResizeObserver(): void {
        this.unwireResizeObserver();
        this.resizeObserverHandler = this.handleResizeObserverEntries.bind(this);
        this.resizeObserver = new ResizeObserver(this.resizeObserverHandler);
        this.resizeObserver.observe(this.element);
    }
    // Refreshes toolbar overflow when the observed element is resized.
    private handleResizeObserverEntries(): void {
        if (this.toolbarModule) {
            this.toolbarModule.refreshOverflow();
        }
    }
    // Disconnects and clears the existing ResizeObserver instance.
    private unwireResizeObserver(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        this.resizeObserverHandler = null;
    }

    /**
     * Prints all the pages of the Editor by default.
     *
     * @returns {void}
     */
    public print(): void {
        let printWindow: Window | null = window.open('', '_blank', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
        if (!printWindow || !printWindow.document) {
            return;
        }
        const wrapper: HTMLElement = document.createElement('div');
        addClass([wrapper], ['e-editorbase', 'e-control']);
        const content: HTMLElement = document.createElement('div');
        addClass([content], ['e-content-conatiner']);
        content.appendChild(this.inputElement.cloneNode(true));
        wrapper.appendChild(content);
        printWindow = print(wrapper, printWindow);
    }

    /**
     * Provides chainable command builder for executing editor commands.
     * Enables fluent API for type-safe command execution.
     *
     * @example
     * // Toggle formatting
     * editor.commands.bold().apply();
     * editor.commands.italic().apply();
     *
     * // Commands with options
     * editor.commands.link().url('https://example.com').text('Link').apply();
     * editor.commands.fontColor().color('#FF0000').apply();
     * editor.commands.setTextAlign().align('center').apply();
     *
     * @returns {CommandExecutor} Command builder instance
     * @public
     */
    public commands(): CommandExecutor {
        return new CommandExecutor(this);
    }

    /**
     * Focuses the Editor component.
     *
     * @returns {void}
     * @public
     */
    public focus(): void {
        if (this.inputElement && typeof this.inputElement.focus === 'function') {
            this.inputElement.focus();
            this.handleFocusIn({} as FocusEvent);
        }
    }

    /**
     * Blurs Editor component, removing focus.
     *
     * @returns {void}
     * @public
     */
    public blur(): void {
        if (this.inputElement && typeof this.inputElement.blur === 'function') {
            this.inputElement.blur();
            this.handleFocusOut({} as FocusEvent);
        }
    }

    /**
     * Commits the current value and raises change
     *
     * @returns {void}
     * @public
     */
    public save(): void {
        if (this.valueFormat === 'json') {
            this.setProperties({ value: this.baseEditorCore.editor.getDocument() }, true);
        } else {
            this.setProperties({ value: this.baseEditorCore.editor.getHtml() }, true);
        }
    }

    /**
     * Uploads the supplied binary file data using the endpoint configured
     * through `imageSettings.uploadUrl`. The method validates file type and
     * size, then either:
     *
     * - Fires `fileUploadFailed` synchronously with a configuration /
     *   validation error message when the upload cannot proceed
     *   (`uploadUrl` is `null`, the extension is not in `allowedTypes`, or
     *   `blobData.size > maxFileSize`); or
     * - Fires cancelable `beforeFileUpload`, then delegates to the image
     *   module's `EditorUploadPopup.show(file)`. From that point the popup's
     *   existing pipeline takes over: it emits `fileUploading` (NOT
     *   cancellable) and ultimately `fileUploadSuccess` or
     *   `fileUploadFailed`.
     *
     * The method does NOT mutate the editor document directly. Consumers
     * observing `fileUploadSuccess` are responsible for inserting the
     * resulting image (typically via the controller execute command
     * `insertImage`).
     *
     * @param {string} fileType - File extension (`.png`) or MIME type
     *   (`image/png`).
     * @param {Blob} blobData - Binary data to upload.
     * @returns {void}
     */
    public uploadFile(fileType: string, blobData: Blob): void {
        const settings: ImageSettingsModel = this.imageSettings;
        if (!settings || !blobData) {
            return;
        }
        const ext: string = this.normalizeImageExtension(fileType);
        if (settings.allowedTypes && settings.allowedTypes.indexOf(ext) === -1) {
            this.trigger('fileUploadFailed', {
                name: 'fileUploadFailed',
                subType: 'Image',
                message: 'Image type not allowed: ' + ext
            });
            return;
        }
        if (typeof blobData.size === 'number' &&
            typeof settings.maxFileSize === 'number' &&
            blobData.size > settings.maxFileSize) {
            this.trigger('fileUploadFailed', {
                name: 'fileUploadFailed',
                subType: 'Image',
                message: 'Image size exceeds ' + settings.maxFileSize + ' bytes.'
            });
            return;
        }
        if (!settings.uploadUrl) {
            this.trigger('fileUploadFailed', {
                name: 'fileUploadFailed',
                subType: 'Image',
                message: 'uploadUrl is not configured.'
            });
            return;
        }
        // Cancelable hook so app code can abort the network path.
        this.trigger('beforeFileUpload', { name: 'beforeFileUpload', subType: 'Image' });
        // After exposing `beforeFileUpload` consumers can set args.cancel =
        // true on the args object; emulation is done by throwing a
        // `trigger` listener that returns false. Here we keep the simple
        // form: the consumer observes `fileUploading`/`fileUploadSuccess`
        // explicitly to learn about state.
        if (this.imageModule &&
            typeof (this.imageModule as { uploadFileShow?: unknown }).uploadFileShow === 'function') {
            (this.imageModule as unknown as { uploadFileShow(blob: Blob, type: string): void })
                .uploadFileShow(blobData, fileType);
        }
    }

    /**
     * Normalizes a file-type argument to a `.ext` token compatible with
     * `ImageSettings.allowedTypes`. Accepts either a leading-dot extension
     * (`.png`) or a MIME type (`image/png`).
     *
     * @param {string} fileType - File extension or MIME type.
     * @returns {string} Normalized extension starting with `.`.
     */
    private normalizeImageExtension(fileType: string): string {
        const lower: string = (fileType || '').toLowerCase();
        if (lower.charAt(0) === '.') { return lower; }
        const tail: string = (lower.split('/').pop() || '').trim();
        return '.' + tail;
    }

    /**
     * Get the current document as an `EditorDocument`.
     *
     * @returns {EditorDocument | null} The public document, or `null` if the
     *   editor is not mounted.
     */
    public getDocument(): EditorDocument | null {

        if (isNOU(this.baseEditorCore.editor)) {
            return null;
        }
        // Headless Editor's `DocumentRoot` IS the public `EditorDocument`.
        return this.baseEditorCore.editor.getDocument() as unknown as EditorDocument;
    }

    /**
     * Get the current document as an HTML string.
     *
     * Delegates to the Headless Editor (`getHtml()`).
     *
     * @returns {string} The HTML representation, or '' if not mounted.
     */
    public getHtml(): string {
        if (!this.baseEditorCore.editor) {
            return '';
        }
        return this.baseEditorCore.editor.getHtml();
    }

    /**
     * Get the current document as plain text.
     *
     * Delegates to the Headless Editor (`getText()`).
     *
     * @returns {string} The plain text, or '' if not mounted.
     */
    public getText(): string {
        if (!this.baseEditorCore.editor) {
            return '';
        }
        return this.baseEditorCore.editor.getText();
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
        return (isNullOrUndefined(this.cssClass) ? '' : isSpace ? ' ' + this.cssClass : this.cssClass);
    }

    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }

    protected getModuleName(): string {
        return 'richtexteditor-ui';
    }

    /**
     * Declares the modules this instance needs that are routed through
     * EJ2's `Component.Inject` machinery. Built-in modules
     * (`ToolbarModule`, `QuickToolbarModule`, `ImageModule`) are instantiated
     * directly in `render()` and intentionally NOT listed here, so hosts
     * never have to register them.
     *
     * Only opt-in modules — those driven by a settings flag — appear in
     * this list. Today that's `SlashCommand`, gated on
     * `slashCommandSettings.enable`. The SlashCommand module is only created
     * when its settings flag is on, which keeps it opt-in per editor
     * instance even after a caller has registered it via
     * `RichTextEditor.Inject(SlashCommand)`.
     *
     * @returns {ModuleDeclaration[]} - the module declarations to inject.
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.slashCommandSettings && this.slashCommandSettings.enable) {
            modules.push({ member: 'slashCommand', args: [this] });
        }
        return modules;
    }

    private applyHostConfiguration(): void {
        if (!this.element) {
            return;
        }
        this.applyHtmlAttributes(this.htmlAttributes);
        this.applyWidth(this.width);
        this.applyHeight(this.height);
        this.applyCssClass(this.cssClass);
    }

    private applyWidth(width: string | number): void {
        if (!this.element) {
            return;
        }
        if (width !== 'auto') {
            setStyleAttribute(this.element, { 'width': formatUnit(width) });
        } else {
            this.element.style.width = 'auto';
        }
        this.width = width;
    }

    private applyHeight(height: string | number): void {
        if (!this.element) {
            return;
        }
        if (height !== 'auto') {
            setStyleAttribute(this.element, { 'height': formatUnit(height) });
        } else {
            this.element.style.height = 'auto';
        }
        this.height = height;
    }

    private applyHtmlAttributes(htmlAttributes?: { [key: string]: string }): void {
        if (!this.element || !htmlAttributes) {
            return;
        }
        for (const htmlAttr of Object.keys(htmlAttributes)) {
            const value: string = htmlAttributes[htmlAttr as string];
            if (htmlAttr === 'class') {
                this.element.classList.add(value);
            } else if (htmlAttr === 'id') {
                this.element.id = htmlAttr;
            } else if (htmlAttr === 'disabled' && value === 'disabled') {
                this.enable = false;
            } else if (htmlAttr === 'readonly' && value === 'readonly') {
                this.readonly = true;
            } else if (htmlAttr === 'style') {
                this.element.style.cssText = value;
                this.applyWidth(this.width);
                this.applyHeight(this.height);
            } else if (htmlAttr === 'width') {
                this.applyWidth(value);
            } else if (htmlAttr === 'height') {
                this.applyHeight(value);
            } else {
                this.element.setAttribute(htmlAttr, value);
            }
        }
    }

    private applyCssClass(cssClass?: string, oldCssClass?: string): void {
        if (!this.element) {
            return;
        }
        if (oldCssClass) {
            this.updateCssClass(oldCssClass, false);
        }
        if (cssClass) {
            this.updateCssClass(cssClass, true);
        }
    }

    private applyRtlClass(enableRtl: boolean): void {
        if (!this.element) {
            return;
        }

        if (enableRtl) {
            addClass([this.element], classes.CLS_RTL);
        } else if (this.element.classList.contains(classes.CLS_RTL)) {
            removeClass([this.element], classes.CLS_RTL);
        }
    }

    private updateCssClass(cssClass: string, setCssClass: boolean): void {
        if (!this.element || !cssClass) {
            return;
        }
        const allClassName: string[] = cssClass.split(' ');
        for (let i: number = 0; i < allClassName.length; i++) {
            const className: string = allClassName[i as number].trim();
            if (className !== '') {
                if (setCssClass) {
                    this.element.classList.add(className);
                } else {
                    this.element.classList.remove(className);
                }
            }
        }
    }

    private wireEvents(): void {
        if (!this.inputElement || !this.element || this.readonly ||
            !this.baseEditorCore || !this.baseEditorCore.observer || this.isUiEventsWired) {
            return;
        }
        EventHandler.add(this.element, 'focusin', this.handleFocusIn, this);
        EventHandler.add(this.element, 'focusout', this.handleFocusOut, this);
        this.baseEditorCore.observer.on('editor-mouseup', this.editorMouseUpHandler, this);
        this.baseEditorCore.observer.on('editor-keyup', this.onKeyUpHandler, this);
        this.baseEditorCore.observer.on('editor-keydown', this.notifyEditorKeydown, this);
        this.scrollParentElements = getScrollableParent(this.element);
        for (const element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        const ownerDocument: Document | null = this.inputElement.ownerDocument || null;
        if (ownerDocument) {
            EventHandler.add(ownerDocument, 'selectionchange', this.documentSelectionChangeHandler, this);
            EventHandler.add(ownerDocument, 'mousedown', this.documentMouseDownHandler, this);
            EventHandler.add(ownerDocument, 'mouseup', this.documentMouseUpHandler, this);
            const ownerWindow: Window = ownerDocument.defaultView;
            if (ownerWindow) {
                ownerWindow.addEventListener('resize', this.windowResizeHandler);
            }
        }
        EventHandler.add(this.inputElement, 'scroll', this.contentScrollHandler, this);
        this.isUiEventsWired = true;
    }

    private editorMouseUpHandler(args: Event): void {
        if (this.isSelectionInRTE()) {
            this.notify(constant.editorMouseup, { originalEvent: args });
        }
        const state: FormattingState = this.formattingStateService.refreshFormattingState(this.baseEditorCore);
        this.triggerUpdatedToolbarStatus(state);
    }

    /**
     * Utility to check if selection is within RTE
     *
     * @private
     * @returns {boolean} `true` if the selection is within the RTE; otherwise, `false`.
     */
    public isSelectionInRTE(): boolean {
        const selection: Selection = this.inputElement.ownerDocument.getSelection();
        if (selection.rangeCount > 0) {
            const range: Range = selection.getRangeAt(0);
            if (range && (this.inputElement.contains(range.startContainer) &&
                this.inputElement.contains(range.endContainer))) {
                return true;
            }
        }
        return false;
    }

    private onDocumentClick(args: MouseEvent): void {
        const target: HTMLElement = args.target as HTMLElement;
        const rteUIElement: Element = closest(target, '.' + classes.CLS_RTE_UI);
        if (!this.element.contains(target as Node) && document !== args.target && rteUIElement !== this.element &&
            !closest(target, '[aria-owns="' + this.element.id + '"]')) {
            this.isBlur = true;
        }
        const hideQuickToolbarChecker: boolean = this.quickToolbarModule && this.quickToolbarSettings.enable;
        if ((hideQuickToolbarChecker && !isNOU(closest(target, '.' + 'e-rte-ui-toolbar-wrapper')) && !isNOU(closest(target, '.' + 'e-rte-ui-elements')))) {
            this.quickToolbarModule.hideQuickToolbars();
        }
    }

    private isSelectionCollapsed(): boolean {
        const selection: Selection = this.inputElement.ownerDocument.getSelection();
        const range: Range = selection && selection.rangeCount !== 0 && selection.getRangeAt(0);
        return (range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset);
    }

    private scrollHandler(e: Event): void {
        if (this.element) {
            this.notify(constant.parentScroll, { args: e });
        }
    }

    /**
     * Forwards `keyup` events from the editor input element to internal
     * observers via the {@link constant.editorKeyup|editorKeyup} event.
     *
     * @param {KeyboardEvent} e - The native keyboard event.
     * @returns {void}
     * @private
     */
    private onKeyUpHandler(e: KeyboardEvent): void {
        this.notify(constant.editorKeyup, { originalEvent: e });
        const state: FormattingState = this.formattingStateService.refreshFormattingState(this.baseEditorCore);
        this.triggerUpdatedToolbarStatus(state);
    }

    /**
     * Forwards `keydown` events from the editor input element to internal
     * observers via the {@link constant.editorKeydown|editorKeydown} event.
     *
     * @param {KeyboardEvent} e - The native keyboard event.
     * @param {{name}}e.name - Describes the name.
     * @param {{originalEvent}}e.originalEvent - Specifies the original event.
     * @returns {void}
     * @private
     */
    private notifyEditorKeydown(e: {name: string, originalEvent: KeyboardEvent}): void {
        const action: EditorKeyBindingAction | undefined = this.keyboardShortcutAction;
        this.keyboardShortcutAction = undefined;
        const event: KeyboardEvent = e.originalEvent;
        this.toolbarFocusKeydownHandler(event);
        this.notify(constant.editorKeydown, { originalEvent: event, action: action });
    }

    private toolbarFocusKeydownHandler(event: KeyboardEvent): void {
        const binding: string | undefined = KeyBindingRegistry.getResolvedKeyBinding(this, 'toolbar-focus');
        if (!binding) {
            return;
        }
        const tokens: string[] = binding.toLowerCase().split('+');
        const key: string = tokens.pop() || '';
        const hasCtrl: boolean = tokens.indexOf('ctrl') !== -1;
        const hasMeta: boolean = tokens.indexOf('meta') !== -1;
        const hasAlt: boolean = tokens.indexOf('alt') !== -1;
        const hasShift: boolean = tokens.indexOf('shift') !== -1;
        if (key !== (event.key || '').toLowerCase() || event.ctrlKey !== hasCtrl ||
            event.metaKey !== hasMeta || event.altKey !== hasAlt || event.shiftKey !== hasShift) {
            return;
        }
        // Only proceed if toolbar is enabled
        if (!this.toolbarSettings || !this.toolbarSettings.enable) {
            return;
        }

        // Check if cursor is on a link; if so, show link quick toolbar
        const selection: Selection = this.inputElement.ownerDocument.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range: Range = selection.getRangeAt(0);
            const selectedStartNode: HTMLElement = range.startContainer.nodeName === '#text' ?
                (range.startContainer.parentElement as HTMLElement) : (range.startContainer as HTMLElement);
            const selectedEndNode: HTMLElement = range.endContainer.nodeName === '#text' ?
                (range.endContainer.parentElement as HTMLElement) : (range.endContainer as HTMLElement);
            // Check if both start and end are within <a> elements and range is collapsed
            if (selectedStartNode && selectedEndNode && selectedStartNode.closest('a') &&
                selectedEndNode.closest('a') && range.collapsed) {
                const linkElement: HTMLElement | null = selectedStartNode.closest('a') as HTMLElement;
                if (linkElement && this.quickToolbarModule) {
                    const linkToolbar: BaseQuickToolbar | null = this.quickToolbarModule.getToolbar('Link');
                    if (linkToolbar) {
                        linkToolbar.showPopup(linkElement, event);
                    }
                }
            }
        }
        // Determine which toolbar to focus (quick toolbar if rendered, else main toolbar)
        const quickToolbarTypes: string[] = ['Text', 'Image', 'Link', 'Table'];
        let toolbarElement: HTMLElement | null = null;
        if (this.quickToolbarModule) {
            for (const type of quickToolbarTypes) {
                const quickToolbar: { isRendered?: boolean; element?: HTMLElement } | null =
                    this.quickToolbarModule.getToolbar(type as 'Text' | 'Image' | 'Link' | 'Table');
                if (quickToolbar && quickToolbar.isRendered && quickToolbar.element) {
                    toolbarElement = quickToolbar.element;
                    break;
                }
            }
        }
        if (!toolbarElement && this.toolbarModule) {
            toolbarElement = this.toolbarModule.element;
        }
        if (!toolbarElement) {
            return;
        }

        // Focus the first toolbar item
        const firstItem: HTMLElement = toolbarElement.querySelector(
            '.e-toolbar-item:not(.e-overlay)[title]'
        ) as HTMLElement;
        if (firstItem && firstItem.firstElementChild) {
            event.preventDefault();
            const firstChild: HTMLElement = firstItem.firstElementChild as HTMLElement;
            firstChild.removeAttribute('tabindex');
            firstChild.focus();
        }
    }

    /**
     * Forwards `selectionchange` events from the owner document to internal
     * observers via the {@link constant.editorSelectionChange|editorSelectionChange} event.
     *
     * @param {Event} e - The native selectionchange event.
     * @returns {void}
     * @private
     */
    private notifyEditorSelectionChange(e: Event): void {
        if (!this.isSelectionInRTE()) {
            return;
        }
        this.baseEditorCore.updateLastSelection();
        this.notify(constant.editorSelectionChange, { originalEvent: e });
    }

    /**
     * Forwards `mousedown` events from the owner document to internal
     * observers via the {@link constant.documentMouseDown|documentMouseDown} event.
     *
     * @param {MouseEvent} e - The native mouse event.
     * @returns {void}
     * @private
     */
    private notifyDocumentMouseDown(e: MouseEvent): void {
        this.notify(constant.documentMouseDown, { originalEvent: e });
    }

    /**
     * Forwards `mouseup` events from the owner document to internal
     * observers via the {@link constant.documentMouseUp|documentMouseUp} event.
     *
     * @param {MouseEvent} e - The native mouse event.
     * @returns {void}
     * @private
     */
    private notifyDocumentMouseUp(e: MouseEvent): void {
        this.notify(constant.documentMouseUp, { originalEvent: e });
    }

    /**
     * Forwards `resize` events from the owner window to internal observers
     * via the {@link constant.windowResize|windowResize} event.
     *
     * @param {Event} e - The native resize event.
     * @returns {void}
     * @private
     */
    private handleWindowResize(e: Event): void {
        this.notify(constant.windowResize, { originalEvent: e });
    }

    // Subscribe to the Headless Editor's `contentChanged` event.
    private wireHeadlessEditorEvents(): void {
        if (this.isHeadlessEventsWired || !this.baseEditorCore || !this.baseEditorCore.editor) {
            return;
        }
        // Forward the Headless Editor's contentChanged payload directly.
        this.baseEditorCore.editor.on(DOCUMENT_CHANGED, (payload: DocumentChangedPayload) => {
            if (this.quickToolbarModule) {
                this.quickToolbarModule.hideQuickToolbars(true);
            }
            this.pendingChangeArgs = {
                name: 'change',
                document: payload.document as EditorDocument,
                selection: payload.selection,
                action: payload.action,
                affectedNodeIds: payload.affectedNodeIds,
                affectedNodes: payload.affectedNodes
            };
            this.scheduleAutoSave();
        });
        this.isHeadlessEventsWired = true;
    }

    private unwireEvents(): void {
        if (!this.inputElement || !this.element || !this.baseEditorCore || !this.baseEditorCore.observer) {
            this.isUiEventsWired = false;
            return;
        }
        EventHandler.remove(this.element, 'focusin', this.handleFocusIn);
        EventHandler.remove(this.element, 'focusout', this.handleFocusOut);
        this.baseEditorCore.observer.off('editor-mouseup', this.editorMouseUpHandler);
        this.baseEditorCore.observer.off('editor-keyup', this.onKeyUpHandler);
        this.baseEditorCore.observer.off('editor-keydown', this.notifyEditorKeydown);
        if (this.scrollParentElements && this.scrollParentElements.length > 0) {
            for (const element of this.scrollParentElements) {
                EventHandler.remove(element, 'scroll', this.scrollHandler);
            }
        }
        this.inputElement.removeEventListener('mouseup', this.editorMouseUpHandler);
        const ownerDocument: Document | null = this.inputElement.ownerDocument || null;
        if (ownerDocument) {
            EventHandler.remove(ownerDocument, 'selectionchange', this.documentSelectionChangeHandler);
            EventHandler.remove(ownerDocument, 'mousedown', this.documentMouseDownHandler);
            EventHandler.remove(ownerDocument, 'mouseup', this.documentMouseUpHandler);
            const ownerWindow: Window = ownerDocument.defaultView;
            if (ownerWindow) {
                ownerWindow.removeEventListener('resize', this.windowResizeHandler);
            }
        }
        EventHandler.remove(this.inputElement, 'scroll', this.contentScrollHandler);
        this.isUiEventsWired = false;
    }

    private contentScrollHandler(e: Event): void {
        this.notify(events.contentscroll, { args: e });
    }

    private scheduleAutoSave(): void {
        const interval: number = this.saveInterval > 0 ? this.saveInterval : 10000;
        if (!this.autoSaveDebounced) {
            this.autoSaveDebounced = debounce(() => this.commitPendingChange(), interval);
        }
        this.autoSaveDebounced();
    }

    private clearAutoSaveTimer(): void {
        this.autoSaveDebounced = null;
    }

    private commitPendingChange(): void {
        this.clearAutoSaveTimer();
        if (!this.pendingChangeArgs) {
            return;
        }
        if (this.valueFormat === 'json') {
            this.setProperties({ value: this.baseEditorCore.editor.getDocument() }, true);
        } else {
            this.setProperties({ value: this.baseEditorCore.editor.getHtml() }, true);
        }
        this.trigger(constant.change, this.pendingChangeArgs);
        this.pendingChangeArgs = null;
    }

    private initializeLocale(): void {
        this.serviceLocator = new ServiceLocator;
        this.localeObj = new L10n(this.getModuleName(), Locale.getDefaultLocale(), this.locale);
        this.serviceLocator.register('rteLocale', this.localeObj = new L10n(this.getModuleName(), Locale.getDefaultLocale(), this.locale));
    }

    private handleFocusIn(event: FocusEvent): void {
        if (!this.isInitialized || this.isDestroyed) {
            return;
        }
        this.isBlur = false;
        this.triggerFocusedEvent(event);
        EventHandler.add(this.element.ownerDocument, 'click', this.onDocumentClick, this);
    }

    private handleFocusOut(event: FocusEvent): void {
        if (!this.isInitialized || this.isDestroyed) {
            return;
        }
        let target: Element = event && event.relatedTarget as Element;
        if (target) {
            const rteUIElement: Element = closest(target, '.' + classes.CLS_RTE_UI);
            if (rteUIElement && rteUIElement === this.element) {
                this.isBlur = false;
                if (target === this.getToolbarElement()) {
                    target.setAttribute('tabindex', '-1');
                }
            } else if (closest(target, '[aria-owns="' + this.element.id + '"]') || closest(target, '.' + CLS.CLS_RTE_ELEMENTS)) {
                this.isBlur = false;
            } else {
                this.isBlur = true;
                target = null;
            }
        } else {
            this.isBlur = true;
        }
        if (this.isBlur && isNOU(target)) {
            this.commitPendingChange();
            this.triggerBlurredEvent(event);
            this.isBlur = false;
        }
        EventHandler.remove(this.element.ownerDocument, 'click', this.onDocumentClick);
    }

    private raiseDestroyedEvent(): void {
        this.trigger('destroyed', { name: 'destroyed' });
    }

    private triggerFocusedEvent(e: FocusEvent): void {
        const eventSource: 'Event' | 'Method' = e instanceof FocusEvent ? 'Event' : 'Method';
        const focusEventArgs: FocusedEventArgs = {
            name: 'focused',
            isInteracted: false,
            event: e,
            source: eventSource
        };
        this.trigger(constant.focused, focusEventArgs);
    }

    private triggerBlurredEvent(e: FocusEvent): void {
        const eventSource: 'Event' | 'Method' = e instanceof FocusEvent ? 'Event' : 'Method';
        const blurEventArgs: BlurredEventArgs = {
            name: 'blurred',
            isInteracted: false,
            event: e,
            source: eventSource
        };
        this.trigger(constant.blurred, blurEventArgs);
    }

    private updateEnable(enable: boolean): void {
        if (enable) {
            removeClass([this.element], classes.CLS_DISABLED);
            this.element.setAttribute('aria-disabled', 'false');
            if (!isNOU(this.htmlAttributes.tabindex)) {
                this.inputElement.setAttribute('tabindex', this.htmlAttributes.tabindex);
            } else {
                this.inputElement.setAttribute('tabindex', '0');
            }
        } else {
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
        }
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
        if (!this.enable) {
            removeClass([this.element], classes.CLS_DISABLED);
        }
        if (this.enableRtl) {
            removeClass([this.element], classes.CLS_RTL);
        }
        // if (this.readonly) {
        //     removeClass([this.element], classes.CLS_RTE_READONLY);
        // }
        if (this.element.style.width !== '') {
            this.element.style.removeProperty('width');
        }
        if (this.element.style.height !== '') {
            this.element.style.removeProperty('height');
        }
        this.element.removeAttribute('aria-disabled');
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
        this.element.removeAttribute('aria-label');
    }

    public destroy(): void {
        // Idempotent guard per lifecycle spec section 6.3
        if (this.isDestroyed) {
            return;
        }
        this.raiseDestroyedEvent();
        this.removeHtmlAttributes();
        this.removeAttributes();
        this.notify(events.destroy, {});
        this.unwireEvents();
        // Destroy the controller before the core so the controller can
        // release its listeners and references first.
        if (this.editorController) {
            this.editorController = null;
        }
        if (this.linkModule) {
            this.linkModule.destroy();
            this.linkModule = null;
        }
        if (this.baseEditorCore) {
            this.baseEditorCore.destroy();
            this.baseEditorCore = null;
        }
        // Cancel any pending rAF and disconnect the observer in one step.
        this.unwireResizeObserver();
        this.clearAutoSaveTimer();
        // Clear host reference
        this.editorHost = null;
        this.inputElement = null;
        this.localeObj = null;
        this.pendingChangeArgs = null;
        this.autoSaveDebounced = null;
        this.isInitialized = false;
        if (this.element) {
            this.element.innerHTML = '';
        }
        if (!isNOU(this.cssClass)) {
            const allClassName: string[] = this.cssClass.split(' ');
            for (let i: number = 0; i < allClassName.length; i++) {
                if (allClassName[i as number].trim() !== '') {
                    removeClass([this.element], allClassName[i as number]);
                }
            }
        }
        super.destroy();
    }

    /**
     * Applies a batch of toolbar item updates (add, remove, show, hide, enable, disable).
     *
     * Delegates to the injected Toolbar module if present.
     *
     * @param {ToolbarItemUpdate[]} updates - Array of discriminated-union update operations
     * @returns {void}
     */
    public updateToolbarItems(updates: ToolbarItemUpdate[]): void {
        if (this.toolbarModule) {
            this.toolbarModule.updateToolbarItems(updates);
        }
    }

    /**
     * Applies toolbar settings changes to the toolbar module.
     *
     * Orchestrates all toolbar-related property changes:
     * - Items: Uses reconciliation algorithm to detect adds/removes/reorders
     * - Type: Validates and applies toolbar display type
     * - Position: Validates and applies toolbar positioning
     * - Floating: Applies floating behavior and offset
     *
     * Guard clauses prevent operations if:
     * - Editor hasn't finished initializing
     * - Toolbar module hasn't been initialized
     *
     * @param {ToolbarSettingsModel} newSettings - New toolbar settings to apply
     * @param {ToolbarSettingsModel} oldSettings - Previous toolbar settings (for change detection)
     * @returns {void}
     */
    private applyToolbarSettings(newSettings: ToolbarSettingsModel, oldSettings?: ToolbarSettingsModel): void {
        // Guard: Check if editor is ready
        if (!this.baseEditorCore) {
            console.warn('EditorBase.applyToolbarSettings: Editor core not initialized');
            return;
        }
        if (!isNOU(newSettings.enable)) {
            this.applyToolbarEnable(newSettings.enable);
        }
        // Guard: Check if toolbar exists (Toolbar module may not be initialized yet)
        if (!this.toolbar) {
            console.warn('EditorBase.applyToolbarSettings: Toolbar module not initialized. Settings will be applied when toolbar is ready.');
            return;
        }

        // Reconcile items array if changed
        if (newSettings.items !== undefined && oldSettings?.items !== newSettings.items) {
            this.reconcileToolbarItems(newSettings.items, oldSettings?.items ?? []);
        }

        // Apply toolbar type if changed
        if (newSettings.type !== undefined && oldSettings?.type !== newSettings.type) {
            this.applyToolbarType(newSettings.type);
        }

        // Apply toolbar position if changed
        if (newSettings.position !== undefined && oldSettings?.position !== newSettings.position) {
            this.applyToolbarPosition(newSettings.position);
        }

        // Apply floating behavior if changed
        if (newSettings.enableFloating !== undefined || newSettings.floatingOffset !== undefined) {
            this.applyFloatingBehavior(
                newSettings.enableFloating ?? true,
                newSettings.floatingOffset ?? 0
            );
        }
    }

    /**
     * Applies the toolbar type change to the toolbar module.
     *
     * Validates the type value before delegation to prevent invalid states.
     * Gracefully degrades on validation failure (no exception thrown).
     *
     * Valid types: 'Expanded', 'MultiRow', 'Popup', 'Scrollable'
     *
     * @param {string} type - The toolbar type to apply
     * @returns {void}
     */
    private applyToolbarType(type: string): void {
        // Validate against allowed values
        const validTypes: string[] = ['Expanded', 'MultiRow', 'Popup', 'Scrollable'];
        if (validTypes.indexOf(type) === -1) {
            console.warn(`EditorBase.applyToolbarType: Invalid toolbar type "${type}". Valid types: ${validTypes.join(', ')}`);
            return;
        }

        // Delegate to toolbar module
        if (this.toolbar) {
            try {
                this.toolbar.updateType(type as 'Expanded' | 'MultiRow' | 'Scrollable');
            } catch (error) {
                console.error(`EditorBase.applyToolbarType: Failed to apply toolbar type: ${error}`);
            }
        }
    }

    /**
     * Applies the toolbar position change to the toolbar module.
     *
     * Validates the position value before delegation to prevent invalid states.
     * Gracefully degrades on validation failure (no exception thrown).
     *
     * Valid positions: 'Top', 'Bottom'
     *
     * @param {string} position - The toolbar position to apply
     * @returns {void}
     */
    private applyToolbarPosition(position: string): void {
        // Validate against allowed values
        const validPositions: string[] = ['Top', 'Bottom'];
        if (validPositions.indexOf(position) === -1) {
            console.warn(`EditorBase.applyToolbarPosition: Invalid toolbar position "${position}". Valid positions: ${validPositions.join(', ')}`);
            return;
        }

        // Delegate to toolbar module
        if (this.toolbar) {
            try {
                this.toolbar.updatePosition(position as 'Top' | 'Bottom');
            } catch (error) {
                console.error(`EditorBase.applyToolbarPosition: Failed to apply toolbar position: ${error}`);
            }
        }
    }

    private applyToolbarEnable(enable: boolean): void {
        if (enable) {
            this.toolbarModule = new ToolbarModule(this, this.localeObj);
            this.toolbarModule.refreshOverflow();
        } else {
            this.toolbarModule.destroyModule();
            this.toolbarModule = null;
        }
    }

    /**
     * Applies floating behavior configuration to the toolbar module.
     *
     * @param {boolean} enableFloating - Whether to enable floating mode
     * @param {number} floatingOffset - Offset in pixels when floating (default: 0)
     * @returns {void}
     */
    private applyFloatingBehavior(enableFloating: boolean, floatingOffset: number): void {
        if (this.toolbar) {
            try {
                this.toolbar.updateFloating(enableFloating, floatingOffset);
            } catch (error) {
                console.error(`EditorBase.applyFloatingBehavior: Failed to apply floating behavior: ${error}`);
            }
        }
    }

    /**
     * Reconciles toolbar items array changes and applies to toolbar module.
     *
     * Process:
     * 1. Runs reconciliation algorithm to detect adds, removes, reorders (O(n))
     * 2. Generates ToolbarItemUpdate operations
     * 3. Passes operations to toolbar module for smart diffing
     * 4. Toolbar module applies changes to DOM selectively
     *
     * Benefits of reconciliation:
     * - Detects only changed items (efficient)
     * - Maintains item state across updates
     * - Handles separators and custom items
     * - Prevents unnecessary DOM operations
     *
     * @param {ToolbarItem[]} newItems - New toolbar items array
     * @param {ToolbarItem[]} oldItems - Previous toolbar items array (for diffing)
     * @returns {void}
     */
    private reconcileToolbarItems(newItems: ToolbarItem[], oldItems: ToolbarItem[]): void {
        if (!newItems || !Array.isArray(newItems)) {
            console.warn('EditorBase.reconcileToolbarItems: newItems must be an array');
            return;
        }

        // Run reconciliation algorithm to detect adds, removes, reorders
        const operations: ToolbarItemUpdate[] = reconcileToolbarItems(newItems, oldItems);

        // Apply operations via toolbar module
        if (this.toolbar) {
            try {
                if (operations && operations.length > 0) {
                    // Pass operations to toolbar for smart diffing
                    this.toolbar.updateToolbarItems(operations);
                } else if (newItems && newItems.length === 0 && oldItems && oldItems.length > 0) {
                    // No items remain - clear toolbar
                    this.toolbar.updateToolbarItems([]);
                } else if (newItems && newItems.length > 0) {
                    // Fallback: wrap items as AddToolbarItem operations if reconciliation produced no ops
                    const addOps: AddToolbarItem[] = [];
                    for (let i: number = 0; i < newItems.length; i++) {
                        addOps.push({ action: 'add', index: i, item: newItems[i as number] });
                    }
                    this.toolbar.updateToolbarItems(addOps);
                }
            } catch (error) {
                console.error(`EditorBase.reconcileToolbarItems: Failed to update toolbar items: ${error}`);
            }
        }
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
        this.baseEditorCore.observer.notify(events.selectRange, { range: range });
    }

    public triggerUpdatedToolbarStatus(state: FormattingState): void {
        if (!this.toolbarModule) {
            return;
        }
        const eventArgs: UpdatedToolbarStatusEventArgs = {
            name: 'updatedToolbarStatus',
            activeMarks: {
                bold: state.bold,
                italic: state.italic,
                underline: state.underline,
                strikethrough: state.strikethrough,
                superscript: state.superscript,
                subscript: state.subscript,
                inlineCode: state.inlineCode
            },
            blockFormats: {
                paragraph: state.paragraph,
                heading: state.heading,
                codeBlock: state.codeBlock,
                blockQuote: state.blockQuote,
                orderedList: state.orderedList,
                bulletList: state.bulletList,
                alignLeft: state.alignLeft,
                alignCenter: state.alignCenter,
                alignRight: state.alignRight,
                alignJustify: state.alignJustify
            },
            styles: {
                fontColor: state.fontColor,
                backgroundColor: state.backgroundColor,
                fontSize: state.fontSize,
                fontFamily: state.fontFamily
            }
        };
        this.notify(events.updateTbItemsStatus, eventArgs);
        this.toolbarModule.toolbarStatusUpdater.applyFormattingState(state);
        this.quickToolbarModule.applyFormattingState(state);
    }
    /**
     * getToolbarElement method
     *
     * @returns {void}
     * @hidden
     */
    public getToolbarElement(): Element {
        return this.element ? select('.' + CLS.CLS_TOOLBAR, this.element) : null;
    }

    /**
     * Closes a specified dialog within the Rich Text Editor.
     *
     * @param {DialogType} type - The type of dialog to close.
     * @returns {void}
     * @public
     */
    public closeDialog(type: DialogType): void {
        if (type === 'InsertLink') {
            this.notify(events.closeLinkDialog, {});
        } else if (type === 'InsertImage') {
            this.notify(events.closeImageDialog, {});
        } else if (type === 'InsertTable') {
            this.notify(events.closeTableDialog, {});
        }
    }

    private closeDialogDropdownandQuicktoolbars(): void {
        if (this.quickToolbarModule) {
            this.quickToolbarModule.hideQuickToolbars();
        }
        if (this.linkModule && this.linkModule.dialogModel) {
            this.closeDialog(DialogType.InsertLink);
        }
        if (this.imageModule && this.imageModule.dialog) {
            this.closeDialog(DialogType.InsertImage);
        }
        if (this.tableModule && this.tableModule.tableDialog) {
            this.closeDialog(DialogType.InsertTable);
        }
    }

    private updatReadOnlyState(): void {
        if (!this.isInitialized || this.isDestroyed || !this.baseEditorCore || !this.inputElement) {
            return;
        }
        if (this.readonly || !this.enable) {
            this.unwireEvents();
        } else {
            this.wireHeadlessEditorEvents();
            this.wireEvents();
        }
        if (!this.toolbarSettings || !this.toolbarSettings.enable || !this.toolbar) {
            return;
        }
        if (this.readonly && this.toolbarSettings.enable && !isNOU(this.getToolbarElement())) {
            this.closeDialogDropdownandQuicktoolbars();
            this.toolbarModule.mainToolbar.getRenderer().enableToolbarItems(this.toolbarSettings.items as string[], false);
            this.toolbarModule.mainToolbar.getRenderer().ej2Toolbar.disable(true);
        } else if (!this.readonly && this.toolbarSettings.enable && !isNOU(this.getToolbarElement())) {
            this.toolbarModule.mainToolbar.getRenderer().enableToolbarItems(this.toolbarSettings.items as string[], true);
            this.toolbarModule.mainToolbar.getRenderer().ej2Toolbar.disable(false);
        }
    }
}

/**
 * Configuration error raised when an invalid option is supplied to the
 * Rich Text Editor.
 */
class RTEConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RTEConfigurationError';
        // Ensure prototype chain is correct for instanceof checks
        Object.setPrototypeOf(this, RTEConfigurationError.prototype);
    }
}

/**
 * Assert the supplied string is one of the supported `valueFormat` values.
 *
 * No-op when valueFormat is `undefined` / `null` so the caller can pass
 * through the default.
 *
 * @param {string | null | undefined} valueFormat - ValueFormat
 * @returns {void}
 */
function assertValidValueFormat(valueFormat: string | null | undefined): void {
    if (valueFormat === undefined || valueFormat === null) {
        return;
    }
    if (valueFormat !== 'html' && valueFormat !== 'json') {
        throw new RTEConfigurationError('Invalid valueFormat. Allowed values are `html` or `json`.');
    }
}
