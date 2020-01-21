import { Component, ModuleDeclaration, EventHandler, Complex, Browser, EmitType, addClass, select, detach } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, formatUnit, L10n, closest } from '@syncfusion/ej2-base';import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, compile, append, extend, debounce, isBlazor } from '@syncfusion/ej2-base';import { Touch as EJ2Touch, TapEventArgs } from '@syncfusion/ej2-base';import { getScrollableParent, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';import * as events from '../base/constant';import * as classes from '../base/classes';import { Render } from '../renderer/render';import { ViewSource } from '../renderer/view-source';import { IRenderer, IFormatter, PrintEventArgs, ActionCompleteEventArgs, ActionBeginEventArgs} from './interface';import { BeforeQuickToolbarOpenArgs } from './interface';import { IExecutionGroup, executeGroup, CommandName, ResizeArgs, QuickToolbarEventArgs } from './interface';import { ILinkCommandsArgs, IImageCommandsArgs, BeforeSanitizeHtmlArgs, ITableCommandsArgs } from './interface';import { ServiceLocator } from '../services/service-locator';import { RendererFactory } from '../services/renderer-factory';import { RenderType, ToolbarType } from './enum';import { EditorMode } from './../../common/types';import { Toolbar } from '../actions/toolbar';import { ExecCommandCallBack } from '../actions/execute-command-callback';import { KeyboardEvents, KeyboardEventArgs } from '../actions/keyboard';import { FontFamilyModel, FontSizeModel, FontColorModel, FormatModel, BackgroundColorModel } from '../models/models';import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, TableSettingsModel } from '../models/models';import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel } from '../models/models';import { ToolbarSettings, ImageSettings, QuickToolbarSettings, FontFamily, FontSize, Format } from '../models/toolbar-settings';import { TableSettings, PasteCleanupSettings } from '../models/toolbar-settings';import { FontColor, BackgroundColor } from '../models/toolbar-settings';import { IFrameSettings } from '../models/iframe-settings';import { InlineMode } from '../models/inline-mode';import { Link } from '../renderer/link-module';import { Image } from '../renderer/image-module';import { Table } from '../renderer/table-module';import { Count } from '../actions/count';import { HtmlEditor } from '../actions/html-editor';import { MarkdownEditor } from '../actions/markdown-editor';import { defaultLocale } from '../models/default-locale';import { setAttributes } from '../actions/html-attributes';import { BaseToolbar } from '../actions/base-toolbar';import { QuickToolbar } from '../actions/quick-toolbar';import { FullScreen } from '../actions/full-screen';import { PasteCleanup } from '../actions/paste-clean-up';import * as CONSTANT from '../../common/constant';import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';import { dispatchEvent, getEditValue, isIDevice, decode, isEditableValueEmpty } from '../base/util';import { DialogRenderer } from '../renderer/dialog-renderer';import { SelectedEventArgs, RemovingEventArgs, UploadingEventArgs, FileInfo } from '@syncfusion/ej2-inputs';import { Resize } from '../actions/resize';import { ItemModel } from '@syncfusion/ej2-navigations';import { XhtmlValidation } from '../actions/xhtml-validation';
import {ChangeEventArgs} from "./rich-text-editor";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RichTextEditor
 */
export interface RichTextEditorModel extends ComponentModel{

    /**
     * Specifies the group of items aligned horizontally in the toolbar as well as defined the toolbar rendering type.
     * By default, toolbar is float at the top of the RichTextEditor.
     * When you scroll down, the toolbar will scroll along with the page on RichTextEditor with the specified offset value.
     * * enable: set boolean value to show or hide the toolbar.
     * * enableFloating: Set Boolean value to enable or disable the floating toolbar. 
     * Preserves the toolbar at top of the RichTextEditor on scrolling.
     * * type: it has two possible options
     *      1. Expand: Hide the overflowing toolbar items in the next row. Click the expand arrow to view overflowing toolbar items
     *      2. MultiRow: The toolbar overflowing items wrapped in the next row.
     * * items: Specifies the array of items aligned horizontally in the toolbar.
     * > | and - can insert a vertical and horizontal separator lines in the toolbar.
     * * itemConfigs: Modify the default toolbar item configuration like icon class.
     * 
     * > By default, The toolbar is rendered with scrollable in mobile devices and does not support the toolbar type.
     * @default
     * {
     *  enable: true,
     *  enableFloating: true,
     *  type: ToolbarType.Expand,
     *  items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
     *  'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'],
     *  itemConfigs: {}
     * }
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Specifies the items to be rendered in quick toolbar based on the target element.
     * * It has following fields:
     * * enable - set boolean value to show or hide the quick toolbar
     * * actionOnScroll - it has two possible options
     *     1. hide: The quickToolbar is closed when the parent element is scrolled. 
     *     2. none: The quickToolbar cannot be closed even the parent element is scrolled.
     * * link  - Specifies the items to be rendered in quick toolbar based on link element such as `Open`, `Edit`, and `UnLink`.
     * * image - Specifies the items to be rendered in quick toolbar based on image element such as 'Replace',
     * 'Align', 'Caption', 'Remove', 'InsertLink', 'Display', 'AltText', 'Dimension'.
     * * text	 - Specifies the items to be rendered in quick toolbar based on text element such as 'Cut', 'Copy', 'Paste'.
     * @default
     * {
     *  enable: true,
     *  actionOnScroll: 'hide',
     *  link: ['Open', 'Edit', 'UnLink'],
     *  image: ['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink', 'Display', 'AltText', 'Dimension'],
     *  text: ['Cut', 'Copy', 'Paste']
     * }
     */
    quickToolbarSettings?: QuickToolbarSettingsModel;

    /**
     * Specifies the pasting options in RichTextEditor component and control with the following properties.
     * * prompt - Set boolean value to enable or disable the prompt when pasting.
     * * deniedAttrs  -  Specifies the attributes to restrict when pasting in RTE.
     * * allowedStyleProps  -  Specifies the allowed style properties when pasting in RTE.
     * * deniedTags	 -  Specifies the tags to restrict when pasting in RTE.
     * * keepFormat	 -   Set boolean value to keep or remove the from when pasting.
     * * plainText	 -   Set boolean value to paste as plain text or not.
     * @default
     * {
     *  prompt: false,
     *  deniedAttrs: null,
     *  allowedStyleProps: ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius',
     *  'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor',
     *  'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style',
     *  'height', 'left', 'line-height', 'margin', 'margin-top', 'margin-left',
     *  'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width',
     *  'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right',
     *  'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-indent',
     *  'top', 'vertical-align', 'visibility', 'white-space', 'width'],
     *  deniedTags: null,
     *  keepFormat: true,
     *  plainText:  false
     * }
     */
    pasteCleanupSettings?: PasteCleanupSettingsModel;

    /**
     * Specifies the items to be rendered in an iframe mode, and it has the following properties.
     * * enable - Set Boolean value to enable, the editors content is placed in an iframe and isolated from the rest of the page.
     * * attributes - Custom style to be used inside the iframe to display content. This style is added to the iframe body.
     * * resources - we can add both styles and scripts to the iframe.
     *    1. styles[] - An array of CSS style files to inject inside the iframe to display content
     *    2. scripts[] - An array of JS script files to inject inside the iframe
     * @default
     * {
     *  enable: false,
     *  attributes: null,
     *  resources: { styles: [], scripts: [] }
     * }
     */
    iframeSettings?: IFrameSettingsModel;

    /**
     * Specifies the image insert options in RichTextEditor component and control with the following properties.
     * * allowedTypes - Specifies the extensions of the image types allowed to insert on bowering and 
     * passing the extensions with comma separators. For example, pass allowedTypes as .jpg and .png.
     * * display - Sets the default display for an image when it is inserted in to the RichTextEditor. 
     * Possible options are: 'inline' and 'block'.
     * * width - Sets the default width of the image when it is inserted in the RichTextEditor.
     * * saveFormat - Specifies the format to store the image in the RichTextEditor (Base64 or Blob).
     * * height - Sets the default height of the image when it is inserted in the RichTextEditor.
     * * saveUrl - Specifies the service URL of save action that will receive the uploaded files and save them in the server.
     * * path - Specifies the path of the location to store the images and refer it to display the images.
     * @default 
     * {
     *  allowedTypes: ['.jpeg', '.jpg', '.png'],
     *  display: 'inline',
     *  width: 'auto', 
     *  height: 'auto', 
     *  saveFormat: 'Blob'
     *  saveUrl: null, 
     *  path: null,
     * }
     */
    insertImageSettings?: ImageSettingsModel;

    /**
     * Specifies the table insert options in RichTextEditor component and control with the following properties.
     * * styles - Class name should be appended by default in table element.
     * It helps to design the table in specific CSS styles always when inserting in editor.
     * * width - Sets the default width of the table when it is inserted in the RichTextEditor.
     * * minWidth - Sets the default minWidth of the table when it is inserted in the RichTextEditor.
     * * maxWidth - Sets the default maxWidth of the table when it is inserted in the RichTextEditor.
     * * resize - To enable resize the table.
     * @default 
     * {
     *  width: '100%',
     *  styles: [{ text: 'Dashed Borders', class: 'e-dashed-borders', command: 'Table', subCommand: 'Dashed' },
     * { text: 'Alternate Rows', class: 'e-alternate-rows', command: 'Table', subCommand: 'Alternate' }],
     * resize: true,
     *  minWidth: 0, 
     *  maxWidth: null,
     * }
     */
    tableSettings?: TableSettingsModel;

    /**
     * Preserves the toolbar at the top of the RichTextEditor on scrolling and 
     * specifies the offset of the floating toolbar from documents top position
     * @default 0
     */
    floatingToolbarOffset?: number;

    /**
     * Enable or disable the inline edit mode.
     * * enable -  set boolean value to enable or disable the inline edit mode.
     * * onSelection - If its set to true, upon selecting the text, the toolbar is opened in inline. 
     * If its set to false, upon clicking to the target element, the toolbar is opened.
     * @default
     * {
     *  enable: false,
     *  onSelection: true
     * }
     */
    inlineMode?: InlineModeModel;

    /**
     * Specifies the width of the RichTextEditor.
     * @default '100%'
     */
    width?: string | number;

    /**
     * Enables or disables the persisting component's state between page reloads. 
     * If enabled, the value of RichTextEditor is persisted
     * @default false.
     */
    enablePersistence?: boolean;

    /**
     * Enables or disables the resizing option in the editor. 
     * If enabled, the RichTextEditor can be resized by dragging the resize icon in the bottom right corner.
     * @default false.
     */
    enableResize?: boolean;

    /**
     * Allows additional HTML attributes such as title, name, etc., and 
     * It will be accepts n number of attributes in a key-value pair format.
     * @default {}.
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Specifies the placeholder for the RichTextEditor’s content used when the RichTextEditor body is empty.
     * @default null.
     */
    placeholder?: string;

    /**
     * The user interactions on the component are disabled, when set to true.
     * @default false.
     */
    readonly?: boolean;

    /**
     * Specifies a value that indicates whether the component is enabled or not.
     * @default true.
     */
    enabled?: boolean;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * specifies the value whether the source code is displayed with encoded format. 
     * @default false.
     */
    enableHtmlEncode?: boolean;

    /**
     * Specifies a value that indicates whether the xhtml is enabled or not.
     * @default false.
     */
    enableXhtml?: boolean;

    /**
     * Specifies the height of the RichTextEditor component.    
     * @default "auto"    
     */
    height?: string | number;

    /**
     * Specifies the CSS class name appended with the root element of the RichTextEditor.
     * One or more custom CSS classes can be added to a RichTextEditor.
     * @default null  
     */
    cssClass?: string;

    /**
     * Specifies the value displayed in the RichTextEditor's content area and it should be string. 
     * The content of RichTextEditor can be loaded with dynamic data such as database, AJAX content, and more.
     * @default null 
     */
    value?: string;

    /**
     * Specifies the count of undo history which is stored in undoRedoManager. 
     * @default 30 
     */
    undoRedoSteps?: number;

    /**
     * Specifies the interval value in milliseconds that store actions in undoRedoManager. The minimum value is 300 milliseconds. 
     * @default 300 
     */
    undoRedoTimer?: number;

    /**
     * Specifies the editing mode of the RichTextEditor.
     * 
     *   - `HTML` - Render RichTextEditor as HTML editor using &lt;IFRAME&gt; element or content editable &lt;div&gt; element
     *     or &lt;textarea&gt; element.
     * 
     *   - `Markdown` - Render RichTextEditor as markdown editor using &lt;textarea&gt;.
     * 
     * @default 'HTML'
     */
    editorMode?: EditorMode;

    /**
     * Customizes the key actions in RichTextEditor.
     * For example, when using German keyboard, the key actions can be customized using these shortcuts.
     * @default null 
     */
    keyConfig?: { [key: string]: string };

    /**
     * Sets Boolean value to enable or disable the display of the character counter. 
     * @default false 
     */
    showCharCount?: boolean;

    /**
     * Allows the tab key action in the RichTextEditor content. 
     * @default false 
     */
    enableTabKey?: boolean;

    /**
     * Enable `enableAutoUrl` to accept the given URL (relative or absolute) without validating the URL for hyperlinks, otherwise
     * the given URL will automatically convert to absolute path URL by prefixing `https://` for hyperlinks.
     * @default false
     */
    enableAutoUrl?: boolean;

    /**
     * Specifies the maximum number of characters allowed in the RichTextEditor component.
     * @default -1
     */
    maxLength?: number;

    /**
     * Predefine the collection of paragraph styles along with quote and code style that populate in format dropdown from the toolbar.
     * @default
     * {
     *  default: 'Paragraph',
     *  width: '65px',
     *  types: [
     *      { text: 'Paragraph' },
     *      { text: 'Code' },
     *      { text: 'Quotation' },
     *      { text: 'Heading 1' },
     *      { text: 'Heading 2' },
     *      { text: 'Heading 3' },
     *      { text: 'Heading 4' },
     *      { text: 'Heading 5' },
     *      { text: 'Heading 6' }
     *  ]
     * }
     */
    format?: FormatModel;

    /**
     * Predefine the font families that populate in font family dropdown list from the toolbar.
     * @default 
     * {
     *  default: 'Segoe UI',
     *  width: '65px',
     *  items: [
     *      { text: 'Segoe UI', value: 'Segoe UI' },
     *      { text: 'Arial',  value: 'Arial,Helvetica,sans-serif' },
     *      { text: 'Courier New', value: 'Courier New,Courier,monospace' },
     *      { text: 'Georgia', value: 'Georgia,serif' },
     *      { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
     *      { text: 'Lucida Console', value: 'Lucida Console,Monaco,monospace' },
     *      { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
     *      { text: 'Times New Roman', value: 'Times New Roman,Times,serif' },
     *      { text: 'Trebuchet MS', value: 'Trebuchet MS,Helvetica,sans-serif' },
     *      { text: 'Verdana', value: 'Verdana,Geneva,sans-serif' }
     *     ]
     * }
     */
    fontFamily?: FontFamilyModel;

    /**
     * Predefine the font sizes that populate in font size dropdown list from the toolbar.
     * @default 
     * {
     *  default: '10',
     *  width: '35px',
     *  items: [
     *      { text: '8', value: '8pt' },
     *      { text: '10', value: '10pt' },
     *      { text: '12', value: '12pt' },
     *      { text: '14', value: '14pt' },
     *      { text: '18', value: '18pt' },
     *      { text: '24', value: '24pt' },
     *      { text: '36', value: '36pt' }
     *    ]
     * }
     */
    fontSize?: FontSizeModel;

    /**
     * Predefine the color palette that can be rendered for font color toolbar command .
     * @default 
     * {
     *  columns: 10,
     *  colorCode: {
     *      'Custom': [
     *          '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
     *          '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
     *          '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
     *          '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
     *          '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
     *          '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000']
     *    }
     *  }
     */
    fontColor?: FontColorModel;

    /**
     * Predefine the color palette that can be rendered for background color (text highlighted color) toolbar command.
     * @default 
     * {
     *  columns: 5,
     *  colorCode: {
     *          'Custom': ['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#0000ff', '#ff0000',
     *              '#000080', '#008080', '#008000', '#800080', '#800000', '#808000',
     *              '#c0c0c0', '#000000', '']
     *   }
     * }
     */
    backgroundColor?: BackgroundColorModel;

    /**
     * Accepts the template design and assigns it as RichTextEditor’s content.
     * The built-in template engine which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals
     * @default null
     */
    valueTemplate?: string;

    /**
     * Specifies the saveInterval in milliseconds for autosave the value.
     * The change event will be triggered if the content was changed from the last saved interval.
     * @default 10000
     */
    saveInterval?: number;

    /**
     * Triggers before command execution using toolbar items or executeCommand method. 
     * If you cancel this event, the command cannot be executed. 
     * Set the cancel argument to true to cancel the command execution.
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin?: EmitType<ActionBeginEventArgs>;

    /**
     * Triggers after command execution using toolbar items or executeCommand method.
     * @event
     * @blazorProperty 'OnActionComplete'
     */
    actionComplete?: EmitType<ActionCompleteEventArgs>;

    /**
     * Event triggers when the dialog is being opened.
     * If you cancel this event, the dialog remains closed. 
     * Set the cancel argument to true to cancel the open of a dialog.
     * @event
     * @blazorProperty 'OnDialogOpen'
     * @blazorType Syncfusion.EJ2.Blazor.Popups.BeforeOpenEventArgs
     */

    beforeDialogOpen?: EmitType<BeforeOpenEventArgs>;

    /**
     * Event triggers when a dialog is opened.
     * @event
     * @blazorProperty 'DialogOpened'
     * @blazorType DialogOpenEventArgs
     */
    dialogOpen?: EmitType<Object>;

    /**
     * Event triggers after the dialog has been closed.
     * @event
     * @blazorProperty 'DialogClosed'
     * @blazorType DialogCloseEventArgs
     */
    dialogClose?: EmitType<Object>;

    /**
     * Event triggers when the quick toolbar is being opened.
     * @event
     * @blazorProperty 'OnQuickToolbarOpen'
     */

    beforeQuickToolbarOpen?: EmitType<BeforeQuickToolbarOpenArgs>;

    /**
     * Event triggers when a quick toolbar is opened.
     * @event
     * @blazorProperty 'QuickToolbarOpened'
     * @blazorType QuickToolbarEventArgs
     */
    quickToolbarOpen?: EmitType<Object>;

    /**
     * Event triggers after the quick toolbar has been closed.
     * @event
     * @blazorProperty 'QuickToolbarClosed'
     * @blazorType QuickToolbarEventArgs
     */
    quickToolbarClose?: EmitType<Object>;

    /**
     * Triggers when the undo and redo status is updated.
     * @event
     * @blazorType ToolbarUpdateEventArgs
     */
    toolbarStatusUpdate?: EmitType<Object>;

    /**
     * Event triggers when the image is selected or dragged into the insert image dialog.
     * @event
     * @blazorProperty 'OnImageSelected'
     */
    imageSelected?: EmitType<SelectedEventArgs>;

    /**
     * Event triggers when the selected image begins to upload in the insert image dialog.
     * @event
     * @blazorProperty 'OnImageUploading'
     */
    imageUploading?: EmitType<UploadingEventArgs>;

    /**
     * Event triggers when the image is successfully uploaded to the server side.
     * @event
     * @blazorProperty 'OnImageUploadSuccess'
     * @blazorType ImageSuccessEventArgs
     */
    imageUploadSuccess?: EmitType<Object>;

    /**
     * Event triggers when there is an error in the image upload.
     * @event
     * @blazorProperty 'OnImageUploadFailed'
     * @blazorType ImageFailedEventArgs
     */
    imageUploadFailed?: EmitType<Object>;

    /**
     * Event triggers when the selected image is cleared from the insert image dialog.
     * @event
     * @blazorProperty 'OnImageRemoving'
     */
    imageRemoving?: EmitType<RemovingEventArgs>;

    /**
     * Triggers when the RichTextEditor is rendered.
     * @event 
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the RichTextEditor is destroyed.
     * @event 
     * @blazorProperty 'Destroyed'
     * @blazorType DestroyedEventArgs
     */
    destroyed?: EmitType<Object>;

    /**
     * Event triggers before sanitize the value. It's only applicable to editorMode as `HTML`.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    beforeSanitizeHtml?: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * Triggers when RichTextEditor is focused out.
     * @event
     * @blazorType BlurEventArgs
     */
    blur?: EmitType<Object>;

    /**
     * Triggers when RichTextEditor Toolbar items is clicked.
     * @event
     * @blazorProperty 'OnToolbarClick'
     * @blazorType ToolbarClickEventArgs
     */
    toolbarClick?: EmitType<Object>;

    /**
     * Triggers when RichTextEditor is focused in
     * @event
     * @blazorType FocusEventArgs
     */
    focus?: EmitType<Object>;

    /**
     * Triggers only when RichTextEditor is blurred and changes are done to the content.
     * @event 
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers only when resizing the image.
     * @event 
     * @blazorProperty 'Resizing'
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers only when start resize the image.
     * @event 
     * @blazorProperty 'OnResizeStart'
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers only when stop resize the image.
     * @event 
     * @blazorProperty 'OnResizeStop'
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Customize keyCode to change the key value. 
     * @default null 
     * @blazorType object
     */
    formatter?: IFormatter;

}