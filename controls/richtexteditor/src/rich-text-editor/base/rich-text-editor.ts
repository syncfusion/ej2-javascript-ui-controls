import { Component, ModuleDeclaration, EventHandler, Complex, Browser, EmitType, addClass, select, detach } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, formatUnit, L10n, closest } from '@syncfusion/ej2-base';
import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, compile, append, extend, debounce, isBlazor } from '@syncfusion/ej2-base';
import { Touch as EJ2Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { getScrollableParent, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { RichTextEditorModel } from './rich-text-editor-model';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Render } from '../renderer/render';
import { ViewSource } from '../renderer/view-source';
import { IRenderer, IFormatter, PrintEventArgs, ActionCompleteEventArgs, ActionBeginEventArgs} from './interface';
import { BeforeQuickToolbarOpenArgs } from './interface';
import { IExecutionGroup, executeGroup, CommandName, ResizeArgs, QuickToolbarEventArgs } from './interface';
import { ILinkCommandsArgs, IImageCommandsArgs, BeforeSanitizeHtmlArgs } from './interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType, ToolbarType } from './enum';
import { EditorMode } from './../../common/types';
import { Toolbar } from '../actions/toolbar';
import { ExecCommandCallBack } from '../actions/execute-command-callback';
import { KeyboardEvents, KeyboardEventArgs } from '../actions/keyboard';
import { FontFamilyModel, FontSizeModel, FontColorModel, FormatModel, BackgroundColorModel } from '../models/models';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, TableSettingsModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel } from '../models/models';
import { ToolbarSettings, ImageSettings, QuickToolbarSettings, FontFamily, FontSize, Format } from '../models/toolbar-settings';
import { TableSettings, PasteCleanupSettings } from '../models/toolbar-settings';
import { FontColor, BackgroundColor } from '../models/toolbar-settings';
import { IFrameSettings } from '../models/iframe-settings';
import { InlineMode } from '../models/inline-mode';
import { Link } from '../renderer/link-module';
import { Image } from '../renderer/image-module';
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
import * as CONSTANT from '../../common/constant';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { dispatchEvent, getEditValue, isIDevice, decode, isEditableValueEmpty } from '../base/util';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { SelectedEventArgs, RemovingEventArgs, UploadingEventArgs, FileInfo } from '@syncfusion/ej2-inputs';
import { Resize } from '../actions/resize';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { XhtmlValidation } from '../actions/xhtml-validation';

export interface ChangeEventArgs {
    /**
     * Returns value of RichTextEditor
     */
    value: string;
    /** Defines the event name. */
    name?: string;
}

export interface DialogOpenEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    target: HTMLElement | String;
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement;
    /**
     * Returns the element of the dialog.
     */
    element: Element;
    /**
     * Specify the name of the event.
     */
    name?: string;
}

export interface DialogCloseEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement;
    /**
     * Returns the element of the dialog.
     */
    element: Element;
    /**
     * Returns the original event arguments.
     */
    event: Event;
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean;
    /**
     * DEPRECATED-Determines whether the event is triggered by interaction.
     */
    isInteraction: boolean;
    /**
     * Specify the name of the event.
     */
    name?: string;
    /**
     * Defines whether the current action can be prevented.
     */
    target: HTMLElement | String;
}

export interface ToolbarUpdateEventArgs {
    /**
     * Specify the name of the event.
     */
    name?: string;
    /**
     * Specify the name of the event.
     */
    redo: boolean;
    /**
     * Specify the name of the event.
     */
    undo: boolean;
}

export interface ImageSuccessEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object;
    /**
     * Returns the details about upload file.
     * @blazorType Syncfusion.EJ2.Blazor.Inputs.FileInfo
     */
    file: FileInfo;
    /**
     * Returns the upload status.
     */
    statusText?: string;
    /**
     * Returns the upload event operation.
     */
    operation: string;
    /**
     * Returns the upload event operation.
     * @blazorType ResponseEventArgs
     */
    response?: ResponseEventArgs;
    /**
     * Specify the name of the event.
     */
    name?: string;
}

export interface ImageFailedEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object;
    /**
     * Returns the details about upload file.
     * @blazorType Syncfusion.EJ2.Blazor.Inputs.FileInfo
     */
    file: FileInfo;
    /**
     * Returns the upload status.
     */
    statusText?: string;
    /**
     * Returns the upload event operation.
     */
    operation: string;
    /**
     * Returns the upload event operation.
     * @blazorType ResponseEventArgs
     */
    response?: ResponseEventArgs;
    /**
     * Specify the name of the event.
     */
    name?: string;
}

export interface ResponseEventArgs {
    headers?: string;
    readyState?: object;
    statusCode?: object;
    statusText?: string;
    withCredentials?: boolean;
}

export interface DestroyedEventArgs {
    /**
     * Specify the name of the event.
     */
    name?: string;
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
}

export interface BlurEventArgs {
    /**
     * Returns the original event arguments.
     */
    event: Event;
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean;
    /**
     * Specify the name of the event.
     */
    name?: string;
}

export interface ToolbarClickEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Defines the current Toolbar Item Object.
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ItemModel
     */
    item: ItemModel;
    /**
     * Defines the current Event arguments
     */
    originalEvent: MouseEvent;
    /**
     * Specify the request type of the event.
     */
    requestType: string;
    /**
     * Specify the name of the event.
     */
    name?: string;
}

export interface FocusEventArgs {
    /**
     * Returns the original event arguments.
     */
    event: FocusEvent;
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean;
    /**
     * Specify the name of the event.
     */
    name?: string;
}

/**
 * Represents the RichTextEditor component.
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
    private onResizeHandler: EventListenerOrEventListenerObject;
    private timeInterval: number;
    private touchModule: EJ2Touch;
    private defaultResetValue: string = null;
    /**
     * @hidden
     * @deprecated
     */
    public isFocusOut: boolean = false;
    /**
     * @hidden
     * @deprecated
     */
    public inputElement: HTMLElement;
    /**
     * @hidden
     * @deprecated
     */
    public isRTE: boolean = false;
    /**
     * @hidden
     * @deprecated
     */
    public isBlur: boolean = true;
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

    public needsID: boolean = true;
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
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;
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
    @Complex<QuickToolbarSettingsModel>({}, QuickToolbarSettings)
    public quickToolbarSettings: QuickToolbarSettingsModel;
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
    @Complex<PasteCleanupSettingsModel>({}, PasteCleanupSettings)
    public pasteCleanupSettings: PasteCleanupSettingsModel;
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
    @Complex<IFrameSettingsModel>({}, IFrameSettings)
    public iframeSettings: IFrameSettingsModel;
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
    @Complex<ImageSettingsModel>({}, ImageSettings)
    public insertImageSettings: ImageSettingsModel;
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
    @Complex<TableSettingsModel>({}, TableSettings)
    public tableSettings: TableSettingsModel;
    /**
     * Preserves the toolbar at the top of the RichTextEditor on scrolling and 
     * specifies the offset of the floating toolbar from documents top position
     * @default 0
     */
    @Property(0)
    public floatingToolbarOffset: number;
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
    @Complex<InlineModeModel>({}, InlineMode)
    public inlineMode: InlineModeModel;
    /**
     * Specifies the width of the RichTextEditor.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Enables or disables the persisting component's state between page reloads. 
     * If enabled, the value of RichTextEditor is persisted
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Enables or disables the resizing option in the editor. 
     * If enabled, the RichTextEditor can be resized by dragging the resize icon in the bottom right corner.
     * @default false.
     */
    @Property(false)
    public enableResize: boolean;
    /**
     * Allows additional HTML attributes such as title, name, etc., and 
     * It will be accepts n number of attributes in a key-value pair format.
     * @default {}.
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Specifies the placeholder for the RichTextEditor’s content used when the RichTextEditor body is empty.
     * @default null.
     */
    @Property(null)
    public placeholder: string;

    /**
     * The user interactions on the component are disabled, when set to true.
     * @default false.
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies a value that indicates whether the component is enabled or not.
     * @default true.
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * specifies the value whether the source code is displayed with encoded format. 
     * @default false.
     */
    @Property(false)
    public enableHtmlEncode: boolean;
    /**
     * Specifies a value that indicates whether the xhtml is enabled or not.
     * @default false.
     */
    @Property(false)
    public enableXhtml: boolean;
    /**    
     * Specifies the height of the RichTextEditor component.    
     * @default "auto"    
     */
    @Property('auto')
    public height: string | number;
    /**    
     * Specifies the CSS class name appended with the root element of the RichTextEditor.
     * One or more custom CSS classes can be added to a RichTextEditor.
     * @default null  
     */
    @Property(null)
    public cssClass: string;
    /**     
     * Specifies the value displayed in the RichTextEditor's content area and it should be string. 
     * The content of RichTextEditor can be loaded with dynamic data such as database, AJAX content, and more.
     * @default null 
     */
    @Property(null)
    public value: string;
    /**     
     * Specifies the count of undo history which is stored in undoRedoManager. 
     * @default 30 
     */
    @Property(30)
    public undoRedoSteps: number;
    /**     
     * Specifies the interval value in milliseconds that store actions in undoRedoManager. The minimum value is 300 milliseconds. 
     * @default 300 
     */
    @Property(300)
    public undoRedoTimer: number;
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
    @Property('HTML')
    public editorMode: EditorMode;
    /**     
     * Customizes the key actions in RichTextEditor.
     * For example, when using German keyboard, the key actions can be customized using these shortcuts.
     * @default null 
     */
    @Property(null)
    public keyConfig: { [key: string]: string };
    /**     
     * Sets Boolean value to enable or disable the display of the character counter. 
     * @default false 
     */
    @Property(false)
    public showCharCount: boolean;
    /**     
     * Allows the tab key action in the RichTextEditor content. 
     * @default false 
     */
    @Property(false)
    public enableTabKey: boolean;
    /**     
     * Enable `enableAutoUrl` to accept the given URL (relative or absolute) without validating the URL for hyperlinks, otherwise
     * the given URL will automatically convert to absolute path URL by prefixing `https://` for hyperlinks.
     * @default false
     */
    @Property(false)
    public enableAutoUrl: boolean;
    /**     
     * Specifies the maximum number of characters allowed in the RichTextEditor component.
     * @default -1
     */
    @Property(-1)
    public maxLength: number;
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
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;
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
    @Complex<FontFamilyModel>({}, FontFamily)
    public fontFamily: FontFamilyModel;
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
    @Complex<FontSizeModel>({}, FontSize)
    public fontSize: FontSizeModel;
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
    @Complex<FontColorModel>({}, FontColor)
    public fontColor: FontColorModel;
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
    @Complex<BackgroundColorModel>({}, BackgroundColor)
    public backgroundColor: BackgroundColorModel;
    /**
     * Accepts the template design and assigns it as RichTextEditor’s content.
     * The built-in template engine which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals
     * @default null
     */
    @Property(null)
    public valueTemplate: string;

    /**
     * Specifies the saveInterval in milliseconds for autosave the value.
     * The change event will be triggered if the content was changed from the last saved interval.
     * @default 10000
     */
    @Property(10000)
    public saveInterval: number;

    /**
     * Triggers before command execution using toolbar items or executeCommand method. 
     * If you cancel this event, the command cannot be executed. 
     * Set the cancel argument to true to cancel the command execution.
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionBeginEventArgs>;
    /** 
     * Triggers after command execution using toolbar items or executeCommand method.
     * @event
     * @blazorProperty 'OnActionComplete'
     */
    @Event()
    public actionComplete: EmitType<ActionCompleteEventArgs>;
    /**
     * Event triggers when the dialog is being opened.
     * If you cancel this event, the dialog remains closed. 
     * Set the cancel argument to true to cancel the open of a dialog.
     * @event
     * @blazorProperty 'OnDialogOpen'
     * @blazorType Syncfusion.EJ2.Blazor.Popups.BeforeOpenEventArgs
     */

    @Event()
    public beforeDialogOpen: EmitType<BeforeOpenEventArgs>;
    /**
     * Event triggers when a dialog is opened.
     * @event
     * @blazorProperty 'DialogOpened'
     * @blazorType DialogOpenEventArgs
     */
    @Event()
    public dialogOpen: EmitType<Object>;
    /**
     * Event triggers after the dialog has been closed.
     * @event
     * @blazorProperty 'DialogClosed'
     * @blazorType DialogCloseEventArgs
     */
    @Event()
    public dialogClose: EmitType<Object>;
    /**
     * Event triggers when the quick toolbar is being opened.
     * @event
     * @blazorProperty 'OnQuickToolbarOpen'
     */

    @Event()
    public beforeQuickToolbarOpen: EmitType<BeforeQuickToolbarOpenArgs>;
    /**
     * Event triggers when a quick toolbar is opened.
     * @event
     * @blazorProperty 'QuickToolbarOpened'
     * @blazorType QuickToolbarEventArgs
     */
    @Event()
    public quickToolbarOpen: EmitType<Object>;
    /**
     * Event triggers after the quick toolbar has been closed.
     * @event
     * @blazorProperty 'QuickToolbarClosed'
     * @blazorType QuickToolbarEventArgs
     */
    @Event()
    public quickToolbarClose: EmitType<Object>;
    /** 
     * Triggers when the undo and redo status is updated.
     * @event
     * @blazorType ToolbarUpdateEventArgs
     */
    @Event()
    private toolbarStatusUpdate: EmitType<Object>;
    /**
     * Event triggers when the image is selected or dragged into the insert image dialog.
     * @event
     * @blazorProperty 'OnImageSelected'
     */
    @Event()
    public imageSelected: EmitType<SelectedEventArgs>;
    /**
     * Event triggers when the selected image begins to upload in the insert image dialog.
     * @event
     * @blazorProperty 'OnImageUploading'
     */
    @Event()
    public imageUploading: EmitType<UploadingEventArgs>;
    /**
     * Event triggers when the image is successfully uploaded to the server side.
     * @event
     * @blazorProperty 'OnImageUploadSuccess'
     * @blazorType ImageSuccessEventArgs
     */
    @Event()
    public imageUploadSuccess: EmitType<Object>;
    /**
     * Event triggers when there is an error in the image upload.
     * @event
     * @blazorProperty 'OnImageUploadFailed'
     * @blazorType ImageFailedEventArgs
     */
    @Event()
    public imageUploadFailed: EmitType<Object>;
    /**
     * Event triggers when the selected image is cleared from the insert image dialog.
     * @event
     * @blazorProperty 'OnImageRemoving'
     */
    @Event()
    public imageRemoving: EmitType<RemovingEventArgs>;
    /** 
     * Triggers when the RichTextEditor is rendered.
     * @event 
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when the RichTextEditor is destroyed.
     * @event 
     * @blazorProperty 'Destroyed'
     * @blazorType DestroyedEventArgs
     */
    @Event()
    public destroyed: EmitType<Object>;
    /** 
     * Event triggers before sanitize the value. It's only applicable to editorMode as `HTML`.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    @Event()
    public beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;
    /**
     * Triggers when RichTextEditor is focused out.
     * @event
     * @blazorType BlurEventArgs
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Triggers when RichTextEditor Toolbar items is clicked.
     * @event
     * @blazorProperty 'OnToolbarClick'
     * @blazorType ToolbarClickEventArgs
     */
    @Event()
    public toolbarClick: EmitType<Object>;
    /** 
     * Triggers when RichTextEditor is focused in
     * @event
     * @blazorType FocusEventArgs
     */
    @Event()
    public focus: EmitType<Object>;
    /** 
     * Triggers only when RichTextEditor is blurred and changes are done to the content.
     * @event 
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /** 
     * Triggers only when resizing the image.
     * @event 
     * @blazorProperty 'Resizing'
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;
    /** 
     * Triggers only when start resize the image.
     * @event 
     * @blazorProperty 'OnResizeStart'
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;
    /** 
     * Triggers only when stop resize the image.
     * @event 
     * @blazorProperty 'OnResizeStop'
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;
    /**     
     * Customize keyCode to change the key value. 
     * @default null 
     * @blazorType object
     */
    @Property(null)
    public formatter: IFormatter;

    public keyboardModule: KeyboardEvents;
    public localeObj: L10n;
    public valueContainer: HTMLTextAreaElement;
    private originalElement: HTMLElement;
    private clickPoints: { [key: string]: number };
    private initialValue: string;

    constructor(options?: RichTextEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     * @deprecated
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
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
                removeClass([this.getToolbar()], [classes.CLS_TB_FLOAT, classes.CLS_TB_ABS_FLOAT]);
            }
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    }
    /**
     * setEnable method
     * @hidden
     * @deprecated
     */
    public setEnable(): void {
        this.updateEnable();
        (this.enabled) ? this.eventInitializer() : this.unWireEvents();
    }

    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void {
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
        attributes(this.element, { role: 'application' });
    }

    private persistData (): void {
        if (this.enablePersistence && this.originalElement.tagName === 'TEXTAREA') {
            this.element.id = this.originalElement.id + '_wrapper';
            let data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNOU(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    };

    private setContainer(): void {
        this.originalElement = this.element.cloneNode(true) as HTMLElement;
        if (this.value === null || this.valueTemplate !== null) {
            this.setValue();
        }
        if (this.element.hasAttribute('tabindex')) {
            this.htmlAttributes = { 'tabindex': this.element.getAttribute('tabindex') };
            this.element.removeAttribute('tabindex');
        }
        if (!this.isBlazor()) { this.element.innerHTML = ''; }
        let invalidAttr: string[] = ['class', 'style', 'id', 'ejs-for'];
        let htmlAttr: { [key: string]: string; } = {};
        for (let a: number = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(/^data-val/.test(this.element.attributes[a].name))) { // data-val for asp.net core data annotation validation.
                htmlAttr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(htmlAttr, this.htmlAttributes, htmlAttr);
        this.setProperties({ htmlAttributes: htmlAttr }, true);
        if (!isNOU(this.htmlAttributes.id)) {
            this.element.id = this.htmlAttributes.id;
        }
        if (this.element.tagName === 'TEXTAREA') {
            let rteOuterWrapper: HTMLElement = this.createElement('div', {
                className: this.element.getAttribute('class')
            }) as HTMLElement;
            if (!this.isBlazor()) { this.element.innerHTML = ''; }
            this.element.parentElement.insertBefore(rteOuterWrapper, this.element);
            if (isBlazor()) {
                rteOuterWrapper.appendChild(this.element);
                this.valueContainer = this.createElement('textarea', {
                    id: this.element.id + '-value'
                }) as HTMLTextAreaElement;
            } else {
                this.valueContainer = this.element as HTMLTextAreaElement;
            }
            removeClass([this.valueContainer], this.element.getAttribute('class').split(' '));
            if (this.isBlazor()) { addClass([this.element], classes.CLS_RTE_HIDDEN); }
            this.element = rteOuterWrapper;
        } else {
            this.valueContainer = this.createElement('textarea', {
                id: this.getID() + '-value'
            }) as HTMLTextAreaElement;
        }
        this.valueContainer.name = this.getID();
        addClass([this.valueContainer], classes.CLS_RTE_HIDDEN);
        this.element.appendChild(this.valueContainer);
    }

    /**
     * getPersistData method
     * @hidden
     * @deprecated
     */
    public getPersistData(): string {
        return this.addOnPersist(['value']);
    }
    /**
     * Focuses the RichTextEditor component
     * @public
     */
    public focusIn(): void {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({} as FocusEvent);
        }
    }
    /**
     * Blurs the RichTextEditor component
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
     * @public
     */
    public selectAll(): void {
        this.notify(events.selectAll, {});
    }
    /**
     * Selects a content range or an element
     * @param {Range} range - Specify the range which you want to select within the content.
     * The method used to select a particular sentence or word or entire document.
     * @public
     */
    public selectRange(range: Range): void {
        this.notify(events.selectRange, { range: range });
    }
    /**
     * Retrieves the HTML markup content from currently selected content of RichTextEditor.
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
     * Executes the commands 
     * @param {CommandName} CommandName - Specifies the name of the command to be executed.
     * @param {string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs} value - Specifies the value that you want to execute.
     * @public
     */
    public executeCommand(
        commandName: CommandName, value?: string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs): void {
        value = this.htmlPurifier(commandName, value);
        if (this.editorMode === 'HTML') {
            let range: Range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            let toFocus: boolean = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        let tool: IExecutionGroup = executeGroup[commandName];
        this.formatter.editorManager.execCommand(
            tool.command,
            tool.subCommand ? tool.subCommand : (value ? value : tool.value),
            null,
            null,
            (value ? value : tool.value),
            (value ? value : tool.value)
        );
        this.setPlaceHolder();
    }

    private htmlPurifier(
        command: CommandName, value?: string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs): string {
        if (this.editorMode === 'HTML') {
            switch (command) {
                case 'insertHTML':
                    if (typeof value === 'string') {
                        value = this.htmlEditorModule.sanitizeHelper(value);
                    } else {
                        value = this.htmlEditorModule.sanitizeHelper((value as HTMLElement).outerHTML);
                    }
                    break;
                case 'insertImage':
                    let temp: HTMLElement = this.createElement('img', {
                        attrs: {
                            src: (value as IImageCommandsArgs).url as string
                        }
                    });
                    let imageValue: string = this.htmlEditorModule.sanitizeHelper(temp.outerHTML);
                    let url: string = (imageValue !== '' && (this.createElement('div', {
                        innerHTML: imageValue
                    }).firstElementChild).getAttribute('src')) || null;
                    url = !isNOU(url) ? url : '';
                    (value as IImageCommandsArgs).url = url;
                    break;
                case 'createLink':
                    let tempNode: HTMLElement = this.createElement('a', {
                        attrs: {
                            href: (value as ILinkCommandsArgs).url as string
                        }
                    });
                    let linkValue: string = this.htmlEditorModule.sanitizeHelper(tempNode.outerHTML);
                    let href: string = (linkValue !== '' && (this.createElement('div', {
                        innerHTML: linkValue
                    }).firstElementChild).getAttribute('href')) || null;
                    href = !isNOU(href) ? href : '';
                    (value as ILinkCommandsArgs).url = href;
                    break;
            }
        }
        return value as string;
    }

    private encode(value: string): string {
        let divNode: HTMLElement = this.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }

    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     * @deprecated
     */
    protected render(): void {
        if (this.value && !this.valueTemplate) {
            this.setProperties({ value: this.serializeValue(this.value) }, true);
        }
        this.renderModule = new Render(this, this.serviceLocator);
        this.sourceCodeModule = new ViewSource(this, this.serviceLocator);
        this.notify(events.initialLoad, {});
        this.trigger(events.load);
        this.RTERender();
        let execCommandCallBack: ExecCommandCallBack = new ExecCommandCallBack(this);
        this.notify(events.initialEnd, {});
        if (this.toolbarSettings.enable && this.toolbarSettings.type === 'Expand' && !isNOU(this.getToolbar()) &&
            (this.toolbarSettings.items.indexOf('Undo') > -1 && this.toolbarSettings.items.indexOf('Redo') > -1)) {
            this.disableToolbarItem(['Undo', 'Redo']);
        }
        this.setContentHeight();
        if (this.value !== null) {
            if (!this.isBlazor()) {
                this.valueContainer.defaultValue = this.value;
            } else {
                this.defaultResetValue = this.value;
            }
        }
        (!this.enabled) ? this.unWireEvents() : this.eventInitializer();
        this.renderComplete();
    }

    /**
     * For internal use only - Initialize the event handler
     * @private
     * @deprecated
     */
    protected eventInitializer(): void {
        this.wireEvents();
    }

    /**
     * For internal use only - keydown the event handler;
     * @private
     * @deprecated
     */
    public keyDown(e: KeyboardEvent): void {
        this.notify(events.keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.editorMode === 'HTML' && ((e.which === 8 && e.code === 'Backspace') || (e.which === 46 && e.code === 'Delete'))) {
            let range: Range = this.getRange();
            let startNode: Element = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement :
            range.startContainer as Element;
            if (closest(startNode, 'pre') &&
            (e.which === 8 && range.startContainer.textContent.charCodeAt(range.startOffset - 1) === 8203) ||
            (e.which === 46 && range.startContainer.textContent.charCodeAt(range.startOffset) === 8203)) {
                let regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
                let pointer: number = e.which === 8 ? range.startOffset - 1 : range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                this.contentModule.getDocument(), range.startContainer as Element, pointer);
            }
        }
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        if ((e as KeyboardEventArgs).action && (e as KeyboardEventArgs).action !== 'paste' || e.which === 9) {
            this.formatter.process(this, null, e);
            switch ((e as KeyboardEventArgs).action) {
                case 'toolbar-focus':
                    if (this.toolbarSettings.enable) {
                        let selector: string = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                        (this.toolbarModule.baseToolbar.toolbarObj.element.querySelector(selector) as HTMLElement).focus();
                    }
                    break;
                case 'escape':
                    (this.contentModule.getEditPanel() as HTMLElement).focus();
                    break;
            }
        }
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
        this.autoResize();
    }

    private keyUp(e: KeyboardEvent): void {
        this.notify(events.keyUp, { member: 'keyup', args: e });
        let allowedKeys: boolean = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
        if (((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys)) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
    }
    /** 
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
            }
        }
        return value;
    }
    /**
     * This method will clean up the HTML against cross-site scripting attack and return the HTML as string.
     * It's only applicable to editorMode as `HTML`.
     * @param {string} value - Specifies the value that you want to sanitize.
     * @return {string}
     */
    public sanitizeHtml(value: string): string {
        return this.serializeValue(value);
    }

    /** 
     * updateValue method
     * @hidden
     * @deprecated
     */
    public updateValue(value?: string): void {
        if (isNOU(value)) {
            let inputVal: string = this.inputElement.innerHTML;
            this.setProperties({ value: isEditableValueEmpty(inputVal) ? null : inputVal });
        } else {
            this.setProperties({ value: value });
        }
    }

    private triggerEditArea(e: MouseEvent | TouchEvent): void {
        if (!isIDevice()) {
            this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
        } else {
            let touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    }

    private notifyMouseUp(e: MouseEvent | TouchEvent): void {
        let touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        this.notify(events.mouseUp, { member: 'mouseUp', args: e,
            touchData: { prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && (this.inputElement as HTMLTextAreaElement).value.length !== 0))) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
    }

    private mouseUp(e: MouseEvent | TouchEvent): void {
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            let target: Element = e.target as Element;
            let closestTable: Element = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.contentModule.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
    }

    /** 
     * @hidden
     * @deprecated
     */
    public ensureModuleInjected(module: Function): boolean {
        return this.getInjectedModules().indexOf(module) >= 0;
    }

    /**
     * @hidden
     * @deprecated
     */
    public onCopy(): void {
        this.contentModule.getDocument().execCommand('copy', false, null);
    }

    /**
     * @hidden
     * @deprecated
     */
    public onCut(): void {
        this.contentModule.getDocument().execCommand('cut', false, null);
    }

    /**
     * @hidden
     * @deprecated
     */
    public onPaste(e?: KeyboardEvent | ClipboardEvent): void {
        let evenArgs: { [key: string]: Object } = {
            originalEvent: e,
            cancel: false,
            requestType: 'Paste'
        };
        this.trigger(events.actionBegin, evenArgs, (pasteArgs: { [key: string]: Object }) => {
            let currentLength: number = this.getText().length;
            let selectionLength: number = this.getSelection().length;
            let pastedContentLength: number = (isNOU(e as ClipboardEvent) || isNOU((e as ClipboardEvent).clipboardData))
            ? 0 : (e as ClipboardEvent).clipboardData.getData('text/plain').length;
            let totalLength: number = (currentLength - selectionLength) + pastedContentLength;
            if (!pasteArgs.cancel && (this.maxLength === -1 || totalLength < this.maxLength)) {
                if (!isNOU(this.pasteCleanupModule)) {
                    this.notify(events.pasteClean, { args: e as ClipboardEvent });
                } else {
                    let args: Object = { requestType: 'Paste', editorMode: this.editorMode, event: e };
                    let value: string = null;
                    if (e && !isNOU((e as ClipboardEvent).clipboardData)) {
                        value = (e as ClipboardEvent).clipboardData.getData('text/plain');
                    }
                    let file: File = e && (e as ClipboardEvent).clipboardData && (e as ClipboardEvent).clipboardData.items.length > 0 ?
                        (e as ClipboardEvent).clipboardData.items[0].getAsFile() : null;
                    if (value !== null) {
                        this.notify(events.paste, {
                            file: file,
                            args: e,
                            text: value
                        });
                    }
                    setTimeout(() => { this.formatter.onSuccess(this, args); }, 0);
                }
            } else {
                e.preventDefault();
            }
        });
    }

    /** 
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
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.notify(events.destroy, {});
        this.destroyDependentModules();
        if (!isNOU(this.timeInterval)) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        this.unWireEvents();
        if (this.originalElement.tagName === 'TEXTAREA') {
            if (isBlazor()) {
                detach(this.valueContainer);
                this.valueContainer = this.element.querySelector('.e-blazor-hidden.e-control.e-richtexteditor');
            }
            this.element.parentElement.insertBefore(this.valueContainer, this.element);
            this.valueContainer.id = this.getID();
            this.valueContainer.removeAttribute('name');
            detach(this.element);
            if (this.originalElement.innerHTML.trim() !== '') {
                this.valueContainer.value = this.originalElement.innerHTML.trim();
                this.setProperties({ value: (!isNOU(this.initialValue) ? this.initialValue : null) }, true);
            } else {
                this.valueContainer.value = !this.isBlazor() ? this.valueContainer.defaultValue : this.defaultResetValue;
            }
            this.element = this.valueContainer;
            for (let i: number = 0; i < this.originalElement.classList.length; i++) {
                addClass([this.element], this.originalElement.classList[i]);
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
            removeClass([this.element], this.cssClass);
        }
        this.removeHtmlAttributes();
        this.removeAttributes();
        super.destroy();
        if (this.enablePersistence) { window.localStorage.removeItem(this.getModuleName() + this.element.id); }
    }

    private removeHtmlAttributes(): void {
        if (this.htmlAttributes) {
            let keys: string[] = Object.keys(this.htmlAttributes);
            for (let i: number = 0; i < keys.length && this.element.hasAttribute(keys[i]); i++) {
                this.element.removeAttribute(keys[i]);
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
     * @return {Element} 
     */
    public getContent(): Element {
        if (this.iframeSettings.enable && isBlazor()) {
            return this.inputElement;
        } else {
            return this.contentModule.getPanel();
        }
    }
    /**
     * Returns the text content as string.
     * @return {string} 
     */
    public getText(): string {
        return this.contentModule.getText();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     * @deprecated
     */
    protected getModuleName(): string {
        return 'richtexteditor';
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    public onPropertyChanged(newProp: RichTextEditorModel, oldProp: RichTextEditorModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    let val: string;
                    let nVal: string = newProp[prop];
                    val = this.editorMode === 'HTML' ? getEditValue(nVal, this) : nVal;
                    if (!isNOU(nVal) && nVal !== '') {
                        this.value = this.serializeValue(((this.enableHtmlEncode) ? this.encode(decode(val)) : val));
                    }
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    this.notify(events.xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
                    if (this.showCharCount) { this.countModule.refresh(); } break;
                case 'valueTemplate':
                    this.setValue();
                    if (this.showCharCount) { this.countModule.refresh(); }
                    break;
                case 'width': this.setWidth(newProp[prop]);
                    if (this.toolbarSettings.enable) {
                        this.toolbarModule.refreshToolbarOverflow();
                        this.resizeHandler();
                    }
                    break;
                case 'height':
                    this.setHeight(newProp[prop]);
                    this.setContentHeight();
                    this.autoResize();
                    break;
                case 'readonly': this.setReadOnly(false); break;
                case 'cssClass':
                    this.element.classList.remove(oldProp[prop]);
                    this.setCssClass(newProp[prop]);
                    break;
                case 'enabled': this.setEnable(); break;
                case 'enableRtl': this.updateRTL(); break;
                case 'placeholder':
                    this.placeholder = newProp[prop];
                    this.setPlaceHolder();
                    break;
                case 'htmlAttributes':
                    setAttributes(this.htmlAttributes, this, false, false); break;
                case 'iframeSettings':
                    let frameSetting: IFrameSettingsModel = oldProp[prop];
                    if (frameSetting.resources) {
                        let iframe: HTMLDocument = this.contentModule.getDocument();
                        let header: HTMLHeadElement = iframe.querySelector('head');
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
                case 'locale': super.refresh(); break;
                case 'inlineMode':
                    this.notify(events.modelChanged, { module: 'quickToolbar', newProp: newProp, oldProp: oldProp });
                    this.setContentHeight();
                    break;
                case 'toolbarSettings':
                    this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    this.setContentHeight();
                    break;
                case 'maxLength':
                    if (this.showCharCount) { this.countModule.refresh(); }
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
                    if (this.showCharCount) { this.countModule.refresh(); }
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
                default:
                    this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
            }
        }
    }
    /**
     * @hidden
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
            detach(srcList[i]);
        }
    }
    private updatePanelValue(): void {
        let value: string = this.value;
        value = (this.enableHtmlEncode && this.value) ? decode(value) : value;
        if (value) {
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
            if (this.editorMode === 'HTML') {
                this.inputElement.innerHTML = '<p><br/></p>';
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
    }
    /**
     * setPlaceHolder method
     * @hidden
     * @deprecated
     */
    public setPlaceHolder(): void {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
            if (this.editorMode !== 'Markdown') {
                if (!this.placeHolderWrapper) {
                    this.placeHolderWrapper = this.createElement('span', { className: 'rte-placeholder' });
                    if (this.inputElement) {
                        this.inputElement.parentElement.insertBefore(this.placeHolderWrapper, this.inputElement);
                    }
                    attributes(this.placeHolderWrapper, {
                        'style': 'font-size: 16px; padding: 16px; margin-left: 0px; margin-right: 0px;'
                    });
                }
                this.placeHolderWrapper.innerHTML = this.placeholder;
                if (this.inputElement.textContent.length === 0 &&
                !isNOU(this.inputElement.firstChild) && this.inputElement.firstChild.nodeName === 'P' &&
                !isNOU(this.inputElement.firstChild.firstChild) && this.inputElement.firstChild.firstChild.nodeName === 'BR') {
                    this.placeHolderWrapper.style.display = 'block';
                } else {
                    this.placeHolderWrapper.style.display = 'none';
                }
            } else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
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
            this.element.classList.add(cssClass);
        }
    }
    private updateRTL(): void {
        this.notify(events.rtlMode, { enableRtl: this.enableRtl });
        if (this.enableRtl) {
            this.element.classList.add(classes.CLS_RTL);
        } else {
            this.element.classList.remove(classes.CLS_RTL);
        }
    }
    private updateReadOnly(): void {
        this.notify(events.readOnlyMode, { editPanel: this.inputElement, mode: this.readonly });
    }
    /**
     * setReadOnly method
     * @hidden
     * @deprecated
     */
    public setReadOnly(initial?: boolean): void {
        this.updateReadOnly();
        if (!initial) {
            if (this.readonly && this.enabled) {
                this.unbindEvents();
            } else if (this.enabled) {
                this.bindEvents();
            }
        }
    }
    /**
     * By default, prints all the pages of the RichTextEditor.
     * @return {void}
     */
    public print(): void {
        let printWind: Window;
        let printArgs: PrintEventArgs = {
            element: this.inputElement,
            requestType: 'print',
            cancel: false
        };
        this.trigger(events.actionBegin, printArgs, (printingArgs: PrintEventArgs) => {
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') { printWind.resizeTo(screen.availWidth, screen.availHeight); }
            printWind = printWindow(this.inputElement, printWind);
            if (!printingArgs.cancel) {
                let actionArgs: ActionCompleteEventArgs = {
                    requestType: 'print'
                };
                this.trigger(events.actionComplete, actionArgs);
             }
        });
    }

    /**
     * Refresh the view of the editor.
     * @public
     */
    public refreshUI(): void {
        this.renderModule.refresh();
    }
    /**
     * Shows the RichTextEditor component in full-screen mode.
     */
    public showFullScreen(): void {
        if (this.readonly) { return; }
        this.fullScreenModule.showFullScreen();
    }
    /**
     * Enables the give toolbar items in the RichTextEditor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be enable in Rich Text Editor’s Toolbar.
     * @public
     */
    public enableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true, muteToolbarUpdate);
    }
    /**
     * Disables the given toolbar items in the RichTextEditor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be disable in Rich Text Editor’s Toolbar.
     * @public
     */
    public disableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false, muteToolbarUpdate);
    }
    /**
     * Removes the give toolbar items from the RichTextEditor component.
     * @param {string | string[]} items - Specifies the single or collection of items 
     * that you want to be remove from Rich Text Editor’s Toolbar.
     * @public
     */
    public removeToolbarItem(items: string | string[]): void {
        this.toolbarModule.removeTBarItems(items);
    }

    /**
     * Get the selected range from the RichTextEditor's content.
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
        let rendererFactory: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.fullScreenModule = new FullScreen(this);
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
            let styleSrc: string[] = this.iframeSettings.resources.styles;
            let scriptSrc: string[] = this.iframeSettings.resources.scripts;
            if (this.iframeSettings.resources.scripts.length > 0) {
                this.InjectSheet(true, scriptSrc);
            }
            if (this.iframeSettings.resources.styles.length > 0) {
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
                let iFrame: HTMLDocument = this.contentModule.getDocument();
                let target: HTMLElement = iFrame.querySelector('head');
                for (let i: number = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        let scriptEle: HTMLScriptElement = this.createScriptElement();
                        scriptEle.src = srcList[i];
                        target.appendChild(scriptEle);
                    } else {
                        let styleEle: HTMLLinkElement = this.createStyleElement();
                        styleEle.href = srcList[i];
                        target.appendChild(styleEle);
                    }
                }
            }

        } catch (e) {
            return;
        }
    }
    private createScriptElement(): HTMLScriptElement {
        let scriptEle: HTMLScriptElement = this.createElement('script', {
            className: classes.CLS_SCRIPT_SHEET
        }) as HTMLScriptElement;
        scriptEle.type = 'text/javascript';
        return scriptEle;
    }

    private createStyleElement(): HTMLLinkElement {
        let styleEle: HTMLLinkElement = this.createElement('link', {
            className: classes.CLS_STYLE_SHEET
        }) as HTMLLinkElement;
        styleEle.rel = 'stylesheet';
        return styleEle;
    }

    private isBlazor(): boolean {
        return ((Object.keys(window).indexOf('ejsInterop') === -1) ? false : true);
    }

    private setValue(): void {
        if (this.valueTemplate) {
            if (typeof this.valueTemplate === 'string') {
                this.setProperties({ value: this.valueTemplate });
            } else {
                let compiledString: Function;
                compiledString = compile(this.valueTemplate);
                let compiledTemplate: Element[] = compiledString({});
                for (let i: number = 0; i < compiledTemplate.length; i++) {
                    let item: Element = compiledTemplate[i] as Element;
                    append([item], this.element);
                }
                this.setProperties({ value: this.element.innerHTML.trim() });
            }
        } else {
            let  innerHtml: string = !isNOU(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
            if (innerHtml !== '') {
                if (this.element.tagName === 'TEXTAREA') {
                    this.setProperties({ value: decode(innerHtml) });
                } else {
                    this.setProperties({ value: innerHtml });
                }
            }
        }
    }

    /**
     * setContentHeight method
     * @hidden
     * @deprecated
     */
    public setContentHeight(target?: string, isExpand?: boolean): void {
        let heightValue: string;
        let topValue: number = 0;
        let cntEle: HTMLElement = (this.sourceCodeModule.getPanel() &&
            this.sourceCodeModule.getPanel().parentElement.style.display === 'block') ? this.sourceCodeModule.getPanel().parentElement :
            <HTMLElement>this.contentModule.getPanel();
        let rteHeight: number = this.element.offsetHeight;
        let tbHeight: number = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        let rzHeight: number = this.enableResize ?
            (this.element.querySelector('.' + classes.CLS_RTE_RES_HANDLE) as HTMLElement).offsetHeight + 8 : 0;
        let expandPopHeight: number = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (this.toolbarSettings.type === ToolbarType.Expand && isExpand && target !== 'preview') {
            heightValue = (this.height === 'auto' && rzHeight === 0) ? 'auto' : rteHeight - (tbHeight + expandPopHeight + rzHeight) + 'px';
            topValue = (!this.toolbarSettings.enableFloating) ? expandPopHeight : 0;
        } else {
            if (this.height === 'auto' && !(this.element.classList.contains('e-rte-full-screen'))) {
                heightValue = 'auto';
            } else {
                heightValue = rteHeight - (tbHeight + rzHeight)  + 'px';
            }
        }
        setStyleAttribute(cntEle, { height: heightValue, marginTop: topValue + 'px' });
        if (this.iframeSettings.enable && target === 'sourceCode') {
            let codeElement: HTMLElement = <HTMLElement>select('.' + classes.CLS_RTE_CONTENT, this.element);
            setStyleAttribute(codeElement, { height: heightValue, marginTop: topValue + 'px' });
        }
        if (this.toolbarSettings.enableFloating && this.getToolbar() && !this.inlineMode.enable) {
            if (isExpand) {
                setStyleAttribute(this.getToolbar().parentElement, { height: (tbHeight + expandPopHeight) + 'px' });
            } else {
                setStyleAttribute(this.getToolbar().parentElement, { height: tbHeight + 'px' });
            }
        }
        if (rzHeight === 0) {
            this.autoResize();
        }
    }
    /**
     * Retrieves the HTML from RichTextEditor.
     * @public
     */
    public getHtml(): string {
        return this.value;
    }
    /**
     * Shows the source HTML/MD markup.
     * @public
     */
    public showSourceCode(): void {
        if (this.readonly) { return; }
        this.notify(events.sourceCode, {});
    }

    /**
     * Returns the maximum number of characters in the Rich Text Editor.
     * @public
     */
    public getCharCount(): number {
        let htmlText : string = this.editorMode === 'Markdown' ? (this.inputElement as HTMLTextAreaElement).value.trim() :
            (this.inputElement as HTMLTextAreaElement).textContent.trim();
        return htmlText.length;
    }

    /**
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
     * @hidden
     * @deprecated
     */
    public getToolbar(): HTMLElement {
        return this.toolbarModule ? <HTMLElement>this.toolbarModule.getToolbarElement() : null;
    }

    /**
     * @hidden
     * @deprecated
     */
    public getToolbarElement(): Element {
        return this.toolbarModule && this.toolbarModule.getToolbarElement();
    }

    /**
     * getID method
     * @hidden
     * @deprecated
     */
    public getID(): string {
        return (this.originalElement.tagName === 'TEXTAREA' ? this.valueContainer.id : this.element.id);
    }

    private mouseDownHandler(e: MouseEvent | TouchEvent): void {
        let touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        addClass([this.element], [classes.CLS_FOCUS]);
        this.preventDefaultResize(e as MouseEvent);
        this.notify(events.mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    }

    private preventImgResize(e: FocusEvent | MouseEvent): void {
        if ((e.target as HTMLElement).nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    }

    /**
     * preventDefaultResize method
     * @hidden
     * @deprecated
     */
    public preventDefaultResize(e: FocusEvent | MouseEvent): void {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
        } else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', false, 'false');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', false, 'false');
        }
    }

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
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.toolbarModule.refreshToolbarOverflow();
            isExpand = this.toolbarModule.baseToolbar.toolbarObj.element.classList.contains(classes.CLS_EXPAND_OPEN);
        }
        this.setContentHeight('', isExpand);
    }

    private scrollHandler(e: Event): void {
        this.notify(events.scroll, { args: e });
    }

    private contentScrollHandler(e: Event): void {
        this.notify(events.contentscroll, { args: e });
    }

    private focusHandler(e: FocusEvent): void {
        if ((!this.isRTE || this.isFocusOut) && !this.readonly) {
            this.isRTE = this.isFocusOut ? false : true;
            this.isFocusOut = false;
            addClass([this.element], [classes.CLS_FOCUS]);
            if (this.editorMode === 'HTML') {
                this.cloneValue = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                    this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
            } else {
                this.cloneValue = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                    (this.inputElement as HTMLTextAreaElement).value;
            }
            let active: Element = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.contentModule.getEditPanel()
                || ((this.iframeSettings.enable && active === this.contentModule.getPanel()) &&
                    !(e.target as HTMLElement).classList.contains('e-img-inner')
                    && (e.target && (e.target as HTMLElement).parentElement
                    && !(e.target as HTMLElement).parentElement.classList.contains('e-img-wrap')))
                || closest(active, '.e-rte-toolbar') === this.getToolbarElement()) {
                (this.contentModule.getEditPanel() as HTMLElement).focus();
                if (!isNOU(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    let items: NodeList = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    for (let i: number = 0; i < items.length; i++) {
                        (items[i] as HTMLElement).setAttribute('tabindex', '-1');
                    }
                }
            }
            this.preventDefaultResize(e);
            this.trigger('focus', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNOU(this.saveInterval) && this.saveInterval > 0) {
                this.timeInterval = setInterval(this.updateIntervalValue.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!isNOU(this.getToolbarElement())) {
            let toolbarItem: NodeList = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if (!(toolbarItem[i] as HTMLElement).hasAttribute('tabindex') ||
                (toolbarItem[i] as HTMLElement).getAttribute('tabindex') !== '-1') {
                    (toolbarItem[i] as HTMLElement).setAttribute('tabindex', '-1');
                }
            }
        }
    }

    private getUpdatedValue(): string {
        let value: string;
        if (this.editorMode === 'HTML') {
            value = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
        } else {
            value = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                (this.inputElement as HTMLTextAreaElement).value;
        }
        return value;
    }

    private updateIntervalValue(): void {
        this.setProperties({ value: this.getUpdatedValue() }, true);
        this.valueContainer.value = this.value;
        this.invokeChangeEvent();
    }

    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        let rteElement: Element = closest(target, '.' + classes.CLS_RTE);
        if (!this.element.contains(e.target as Node) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.getID() + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.notify(events.docClick, { args: e });
    }

    private blurHandler(e: FocusEvent): void {
        let trg: Element = e.relatedTarget as Element;
        if (trg) {
            let rteElement: Element = closest(trg, '.' + classes.CLS_RTE);
            if (rteElement && rteElement === this.element) {
                this.isBlur = false;
                if (trg === this.getToolbarElement()) { trg.setAttribute('tabindex', '-1'); }
            } else if (closest(trg, '[aria-owns="' + this.getID() + '"]')) {
                this.isBlur = false;
            } else {
                this.isBlur = true;
                trg = null;
            }
        }
        if (this.isBlur && isNOU(trg)) {
            removeClass([this.element], [classes.CLS_FOCUS]);
            this.notify(events.focusChange, {});
            let value: string = this.getUpdatedValue();
            this.setProperties({ value: value });
            this.notify(events.toolbarRefresh, { args: e, documentNode: document });
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
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        } else {
            this.isRTE = true;
        }
    }

    /**
     * invokeChangeEvent method
     * @hidden
     * @deprecated
     */
    public invokeChangeEvent(): void {
        let eventArgs: ChangeEventArgs = {
            value: this.value
        };
        if (this.value !== this.cloneValue) {
            this.trigger('change', eventArgs);
            this.cloneValue = this.value;
        }
    }
    /**
     * @hidden
     * @deprecated
     */
    public wireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.add(this.contentModule.getPanel(), 'scroll', this.contentScrollHandler, this);
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
        if (Browser.isDevice && this.touchModule) { this.touchModule.destroy(); }
    }

    /**
     * @hidden
     * @deprecated
     */
    public unWireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.remove(this.contentModule.getPanel(), 'scroll', this.contentScrollHandler);
        }
    }

    private touchHandler(e: TapEventArgs): void {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    }

    private contextHandler(e: MouseEvent): void {
        let closestElem: Element = closest((e.target as HTMLElement), 'a, table, img');
        if (this.inlineMode.onSelection === false ||  (!isNOU(closestElem) && this.inputElement.contains(closestElem)
        && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A'))) {
            e.preventDefault();
        }
    }

    private resetHandler(): void {
        let defaultValue: string = this.valueContainer.defaultValue.trim();
        this.setProperties({ value: defaultValue === '' ? null : (this.isBlazor() ? this.defaultResetValue : defaultValue) });
    }

    /**
     * @hidden
     * @deprecated
     */
    public autoResize(): void {
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                setTimeout(() => { this.setAutoHeight(this.inputElement); }, 0);
            } else if (this.iframeSettings.enable) {
                let iframeElement: HTMLIFrameElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                setTimeout(() => { this.setAutoHeight(iframeElement); }, 100);
                this.inputElement.style.overflow = 'hidden';
            }
        } else {
            this.inputElement.style.overflow = null;
        }
    }
    private setAutoHeight(element: HTMLElement): void {
        element.style.height = '';
        element.style.height = this.inputElement.scrollHeight + 'px';
        element.style.overflow = 'hidden';
    }
    private wireEvents(): void {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        if (this.readonly && this.enabled) { return; }
        this.bindEvents();
    }
    private restrict(e: MouseEvent | KeyboardEvent): void {
        if (this.maxLength >= 0 ) {
            let element: string = this.editorMode === 'Markdown' ? this.contentModule.getText() :
            ((e as MouseEvent).currentTarget as HTMLElement).textContent.trim();
            let array: number[] = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            let arrayKey: number;
            for (let i: number = 0; i <= array.length - 1; i++) {
                if ((e as MouseEvent).which === array[i]) {
                    if ((e as MouseEvent).ctrlKey && (e as MouseEvent).which === 65) {
                        return;
                    } else if ((e as MouseEvent).which !== 65) {
                        arrayKey = array[i];
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
        let formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30), this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', this.onResizeHandler, true);
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
        if (this.readonly && this.enabled) { return; }
        this.unbindEvents();
    }

    private unbindEvents(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        let formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30));
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
    }
}