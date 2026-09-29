import { Component, INotifyPropertyChanged, Property, NotifyPropertyChanges, setStyleAttribute, formatUnit, L10n, Event, EmitType, removeClass, isNullOrUndefined as isNOU, addClass, Complex, print, ModuleDeclaration, EventHandler, isNullOrUndefined, closest, initializeTelemetry, debounce, select, Browser } from '@syncfusion/ej2-base';import { BlurredEventArgs, ChangeEventArgs, FocusedEventArgs, itemClickEventArgs, UpdatedToolbarStatusEventArgs } from './interface';import { ToolbarSettings, FontSize, FontFamily, Format } from './model/toolbar-settings';import { ToolbarSettingsModel, FontSizeModel, FontFamilyModel, FormatModel } from './model/toolbar-settings-model';import { FontColorModel, BackgroundColorModel } from './model/color-picker-settings-model';import { FontColor, BackgroundColor } from './model/color-picker-settings';import { ToolbarItemUpdate, ToolbarItem, AddToolbarItem } from './model/toolbar.types';import { DocumentRoot, ExtensionDefinition, backgroundColorExtension, blockquoteExtension, horizontalRuleExtension, boldExtension, clearFormattingExtension, indentOutdentExtension, codeBlockExtension, fontColorExtension, fontFamilyExtension, fontSizeExtension, headingExtension, imageExtension, inlineCodeExtension, italicExtension, linkExtension, listExtension, paragraphExtension, strikethroughExtension, subscriptExtension, superscriptExtension, toLowerCaseExtension, toUpperCaseExtension, underlineExtension, undoRedoExtension, textAlignExtension, tableExtension, DOCUMENT_CHANGED, DocumentChangedPayload, placeholderExtension } from '@syncfusion/ej2-headless-editor';import { ListSettings } from './model/list-settings';import { ListSettingsModel } from './model/list-settings-model';import { ToolbarModule } from './module/toolbar';import { reconcileToolbarItems } from './model/toolbar-reconciler';import { IToolbar } from '../base/toolbar-interface';import { IEditorCoreOptions } from '../core/base/interface';import { EditorCore } from '../core/base/editor-core';import { EditorController } from '../controller/editor-controller';import { ActionBeginEventArgs, ActionCompleteEventArgs } from '../controller/interface';import * as classes from '../common/classes';import * as constant from '../common/constant';import { BeforeDialogOpenEventArgs, BeforeDialogCloseEventArgs, BeforePopupOpenEventArgs, BeforePopupCloseEventArgs, BeforeFileUploadEventArgs, FileUploadingEventArgs, FileSelectedEventArgs, FileUploadSuccessEventArgs, FileUploadFailedEventArgs, FileRemovingEventArgs, BeforeFileDropEventArgs, ResizeEventArgs, SlashCommandItemSelectArgs } from '../common/interface';import { Locale } from '../base/service/locale';import { QuickToolbarSettings } from './model/quick-toolbar-settings';import { QuickToolbarSettingsModel } from './model/quick-toolbar-settings-model';import { LinkSettings } from './model/link-settings';import { LinkSettingsModel } from './model/link-settings-model';import { TableSettings } from './model/table-settings';import { TableSettingsModel } from './model/table-settings-model';import { getScrollableParent } from '@syncfusion/ej2-popups';import { QuickToolbarModule } from './module/quick-toolbar';import { ValueFormat } from './interface';import { getRegisteredCustomExtensions } from '../common/custom-node-extension';import { SlashCommandSettings } from './model/slash-command-settings';import { SlashCommand } from '../base/renderer/slash-commands';import { SlashCommandSettingsModel } from './model';import { InteractionSettings } from './model/interaction-settings';import { InteractionSettingsModel } from './model/interaction-settings-model';import { ImageSettings } from './model/image-settings';import { ImageSettingsModel } from './model/image-settings-model';import { EditorDocument } from './types/editor-document';import { ImageModule } from './module/image';import { LinkModule } from './module/link-module';import { ServiceLocator } from '../base/service/service-locator';import * as events from '../common/constant';import { CommandExecutor } from './command-builder';import { FormattingState, FormattingStateService } from '../common/services/formatting-state.service';import { TableModule } from './module/table';import * as CLS from '../base/classes';import { EditorKeyBindingAction, EditorKeyBindingMap } from './model/key-bindings';import { KeyBindingRegistry } from './module/keybindings';import { BaseQuickToolbar } from '../base/renderer/base-quick-toolbar';import { CustomUserAgentData } from '../common/user-agent';import { DialogType } from '../common/enum';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RichTextEditorUI
 */
export interface RichTextEditorUIModel extends ComponentModel{

    /**
     * Enable or disable the Rich Text Editor component. When set to `false`, the editor becomes non-interactive
     * and all toolbar items are disabled. The editable area remains visible but input is prevented.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Enable or disable the read-only mode for the Rich Text Editor. When set to `true`, the editor content
     * becomes read-only and toolbar items are disabled, preventing user input while maintaining visibility
     * of the editor and its content.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Sets the Rich Text Editor width. The width can be specified in pixels, percentages, or other valid CSS units.
     * When set to `'100%'`, the editor expands to fill its parent container width.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Sets the Rich Text Editor height. The height can be specified in pixels, percentages, or other valid CSS units.
     * When set to `'auto'`, the height adjusts automatically based on the content.
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Sets the placeholder text displayed in the editor's editable area when it is empty. The placeholder provides
     * a hint to users about the expected content or format.
     *
     * @default ''
     */
    placeholder?: string;

    /**
     * Sets custom HTML attributes on the Rich Text Editor root element. This property accepts a key-value pair
     * object where keys are attribute names and values are attribute values.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Enables persistence for the component state. When set to `true`, the editor state (including content)
     * is persisted across page reloads using the browser's local storage.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies custom CSS classes to be applied to the Rich Text Editor root element. Multiple classes can be
     * separated by spaces to apply multiple CSS classes for custom styling.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Overrides the registered editor keyboard bindings.
     * On macOS, configured `ctrl` modifiers are mapped to the equivalent
     * Command modifier automatically; separate Mac bindings are not required.
     */
    keyBindings?: EditorKeyBindingMap;

    /**
     * Editor content.
     *
     * The accepted type depends on `valueFormat`:
     *  - `'html'`: an HTML string.
     *  - `'json'`: an `EditorDocument` object.
     *
     * @see {@link ValueFormat}
     */
    value?: string | EditorDocument;

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
    valueFormat?: ValueFormat;

    /**
     * Specifies the idle interval in milliseconds before autosave commits dirty (unsaved) content. This property
     * only has an effect when `enableAutoSave` is set to `true`. When the user remains idle for this duration,
     * the editor content is automatically saved.
     *
     * @default 10000
     */
    saveInterval?: number;

    /**
     * Sets the locale (language and region) for the Rich Text Editor component. This affects the language of
     * toolbar tooltips, placeholder text, dialog labels, and error messages displayed in the editor.
     *
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Enables right-to-left (RTL) text direction for the Rich Text Editor. When set to `true`, the editor layout,
     * toolbar, and content direction are flipped to support RTL languages like Arabic and Hebrew.
     *
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Specifies the maximum number of undo history steps stored in the editor. Each step corresponds to a user action
     * or batch of compatible adjacent actions. Increasing this value allows more undo actions at the cost of increased memory.
     *
     * @default 30
     */
    undoRedoSteps?: number;

    /**
     * Specifies the time interval in milliseconds used by the editor to group compatible adjacent changes into a
     * single undo/redo step. Changes that occur within this interval are grouped together, creating a single undoable action.
     * This improves the user experience by preventing excessive undo steps for rapid consecutive changes.
     *
     * @default 300
     */
    undoRedoTimer?: number;

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
    toolbarSettings?: ToolbarSettingsModel;

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
    fontSize?: FontSizeModel;

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
    fontFamily?: FontFamilyModel;

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
    quickToolbarSettings?: QuickToolbarSettingsModel;

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
    linkSettings?: LinkSettingsModel;

    /**
     * Configures the Table insertion feature. Controls whether table cells can be resized after insertion.
     *
     * @default
     * {
     *   resize: true
     * }
     */
    tableSettings?: TableSettingsModel;

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
    fontColor?: FontColorModel;

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
    backgroundColor?: BackgroundColorModel;

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
    listSettings?: ListSettingsModel;

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
    format?: FormatModel;

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
    slashCommandSettings?: SlashCommandSettingsModel;

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
    interactionSettings?: InteractionSettingsModel;

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
    imageSettings?: ImageSettingsModel;

    /**
     * Raised when the Rich Text Editor component has completed initialization and is ready for user interaction.
     * At this point, all internal modules and subcomponents have been initialized and the editor is fully operational.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Raised when the Rich Text Editor component has been destroyed. This event fires after all resources
     * have been cleaned up and the component is no longer functional.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Raised when focus enters the Rich Text Editor shell (editable area or toolbar). This event allows
     * applications to respond when the editor becomes the active component.
     *
     * @event focused
     */
    focused?: EmitType<FocusedEventArgs>;

    /**
     * Raised when focus leaves the Rich Text Editor shell. This event fires when the user moves focus away
     * from the editor to another component.
     *
     * @event blurred
     */
    blurred?: EmitType<BlurredEventArgs>;

    /**
     * Raised before an action-driven mutation is executed. This event allows prevention of user actions
     * like formatting changes by setting `args.cancel = true`.
     *
     * @event actionBegin
     */
    actionBegin?: EmitType<ActionBeginEventArgs>;

    /**
     * Raised after an accepted action-driven mutation has been successfully processed and applied to the document.
     * This event fires only when the action is not cancelled in the `actionBegin` event.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<ActionCompleteEventArgs>;

    /**
     * Raised when a dirty (modified) value is committed to the document. This event fires on blur
     * (when focus leaves the editor) or on autosave if autosave is enabled.
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Raised when a toolbar item is clicked by the user. This event allows applications to track or
     * intercept toolbar item interactions and perform custom logic.
     *
     * @event itemClick
     */
    itemClick?: EmitType<itemClickEventArgs>;

    /**
     * Raised after the toolbar item status (active states, dropdown values, color picker selections)
     * has been synchronized with the current editor selection. This event fires after formatting states
     * are updated to reflect the user's current cursor position or selection in the editor.
     *
     * @event updatedToolbarStatus
     */
    updatedToolbarStatus?: EmitType<UpdatedToolbarStatusEventArgs>;

    /**
     * Raised before a sub-component dialog opens.
     *
     * The event args ({@link BeforeDialogOpenEventArgs}) extend the ej2
     * `BeforeOpenEventArgs` with a `subType` field — a plain string set when
     * the sub-component is created identifying the editor feature the dialog
     * belongs to (e.g. `'Link'`, `'Image'`, `'Table'`).
     */
    beforeDialogOpen?: EmitType<BeforeDialogOpenEventArgs>;

    /**
     * Raised before a sub-component dialog closes.
     *
     * The event args ({@link BeforeDialogCloseEventArgs}) extend the ej2
     * `BeforeCloseEventArgs` with a `subType` field identifying the editor
     * feature the dialog belongs to (e.g. `'Link'`, `'Image'`, `'Table'`).
     */
    beforeDialogClose?: EmitType<BeforeDialogCloseEventArgs>;

    /**
     * Raised before a sub-component popup opens.
     *
     * The event args ({@link BeforePopupOpenEventArgs}) extend the ej2
     * `PopupEventArgs` with a `subType` field identifying the feature (e.g.
     * `'Link'`, `'Image'`, `'Table'`).
     */
    beforePopupOpen?: EmitType<BeforePopupOpenEventArgs>;

    /**
     * Raised before a sub-component popup closes.
     *
     * The event args ({@link BeforePopupCloseEventArgs}) extend the ej2
     * `BeforeCloseEventArgs` with a `subType` field identifying the feature
     * (e.g. `'Link'`, `'Image'`, `'Table'`).
     */
    beforePopupClose?: EmitType<BeforePopupCloseEventArgs>;

    /**
     * Raised before a file is uploaded to the server.
     *
     * The event args ({@link BeforeFileUploadEventArgs}) extend the ej2
     * `BeforeUploadEventArgs` with a `subType` field identifying the feature
     * the upload is for (e.g. `'Image'`).
     */
    beforeFileUpload?: EmitType<BeforeFileUploadEventArgs>;

    /**
     * Raised while a file is being uploaded to the server.
     *
     * The event args ({@link FileUploadingEventArgs}) extend the ej2
     * `UploadingEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    fileUploading?: EmitType<FileUploadingEventArgs>;

    /**
     * Raised when files are selected for upload.
     *
     * The event args ({@link FileSelectedEventArgs}) extend the ej2
     * `SelectedEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    fileSelected?: EmitType<FileSelectedEventArgs>;

    /**
     * Raised when an upload succeeds.
     *
     * The event args ({@link FileUploadSuccessEventArgs}) extend the ej2
     * `SuccessEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    fileUploadSuccess?: EmitType<FileUploadSuccessEventArgs>;

    /**
     * Raised when an upload fails.
     *
     * The event args ({@link FileUploadFailedEventArgs}) extend the ej2
     * `FailureEventArgs` with a `subType` field identifying the feature the
     * upload is for.
     */
    fileUploadFailed?: EmitType<FileUploadFailedEventArgs>;

    /**
     * Raised before a previously-uploaded image is removed (client-side
     * `URL.revokeObjectURL` for `saveFormat: 'Blob'`, or before the
     * `removeUrl` POST is sent for server-side removal).
     *
     * Set `args.cancel = true` to keep the image in place; both the `Blob`
     * revocation and the `removeUrl` POST will be skipped. The event args
     * are {@link FileRemovingEventArgs}.
     */
    fileRemoving?: EmitType<FileRemovingEventArgs>;

    /**
     * Raised before drop/paste-inserted files are routed through the typed
     * command pipeline. Set `args.cancel = true` to keep the document
     * untouched. The event args are {@link BeforeFileDropEventArgs}.
     */
    beforeFileDrop?: EmitType<BeforeFileDropEventArgs>;

    /**
     * Raised when an image resize gesture starts. Set `args.cancel = true`
     * to prevent the gesture. The event args are {@link ResizeEventArgs}.
     */
    resize?: EmitType<ResizeEventArgs>;

    /**
     * Raised continuously while an image is being resized. NOT cancellable.
     * The event args are {@link ResizeEventArgs} with `name: 'resizing'`.
     */
    resizing?: EmitType<ResizeEventArgs>;

    /**
     * Raised after an image resize gesture ends. NOT cancellable. The event
     * args are {@link ResizeEventArgs} with `name: 'resizeStop'`.
     */
    resizeStop?: EmitType<ResizeEventArgs>;

    /**
     * Raised when a slash command item is selected from the slash command popup.
     *
     * Set `args.cancel` to `true` inside the handler to prevent the default
     * command execution. The event args are of type
     * {@link SlashCommandItemSelectArgs}.
     *
     * @event slashCommanditemSelect
     */
    slashCommanditemSelect?: EmitType<SlashCommandItemSelectArgs>;

}