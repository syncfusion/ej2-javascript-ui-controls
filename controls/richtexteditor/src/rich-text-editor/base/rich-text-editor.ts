import { Component, ModuleDeclaration, EventHandler, Complex, Browser, EmitType, addClass, select } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, formatUnit, L10n, closest } from '@syncfusion/ej2-base';
import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, compile, append, MouseEventArgs } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { RichTextEditorModel } from './rich-text-editor-model';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Render } from '../renderer/render';
import { ViewSource } from '../renderer/view-source';
import { IRenderer, IFormatter, PrintEventArgs, ActionCompleteEventArgs, ActionBeginEventArgs } from './interface';
import { IFontProperties, IFormatProperties, IColorProperties, IExecutionGroup, executeGroup, CommandName, ResizeArgs } from './interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType, ToolbarType } from './enum';
import { EditorMode } from './../../common/types';
import { Toolbar } from '../actions/toolbar';
import { ExecCommandCallBack } from '../actions/execute-command-callback';
import { KeyboardEvents, KeyboardEventArgs } from '../actions/keyboard';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, TableSettingsModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel } from '../models/models';
import { ToolbarSettings, ImageSettings, QuickToolbarSettings, FontFamily, FontSize, Format } from '../models/toolbar-settings';
import { TableSettings } from '../models/toolbar-settings';
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
import * as CONSTANT from '../../common/constant';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { dispatchEvent } from '../base/util';

export interface ChangeEventArgs {
    /**
     * Returns value of RichTextEditor
     */
    value: string;
    /** Defines the event name. */
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
    private inputElement: HTMLElement;
    private placeHolderWrapper: HTMLElement;
    private scrollParentElements: HTMLElement[];
    private cloneValue: string;
    /**
     * @hidden
     */
    public isFocusOut: boolean = false;
    /**
     * @hidden
     */
    public isRTE: boolean = false;
    /**
     * @hidden
     */
    public isBlur: boolean = true;
    /**
     * @hidden
     */
    public renderModule: Render;
    /**
     * @hidden
     */
    public contentModule: IRenderer;
    /**
     * @hidden
     */
    public serviceLocator: ServiceLocator;
    /**
     * The `toolbarModule` is used to manipulate ToolBar items and its action in the RichTextEditor.
     * @hidden
     */
    public toolbarModule: Toolbar;

    /**
     * @hidden
     */
    public imageModule: Image;
    /**
     * @hidden
     */
    public tableModule: Table;

    /**
     * @hidden
     */
    public fullScreenModule: FullScreen;

    /**
     * @hidden
     */
    public sourceCodeModule: ViewSource;
    /**
     * @hidden
     */
    public linkModule: Link;
    /**
     * @hidden
     */
    public markdownEditorModule: MarkdownEditor;
    /**
     * @hidden
     */
    public htmlEditorModule: HtmlEditor;
    /**
     * @hidden
     */
    public quickToolbarModule: QuickToolbar;
    /**
     * @hidden
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
     * @default
     * {
     *  enable: true,
     *  enableFloating: true,
     *  type: ToolbarType.Expand,
     *  items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
     *  'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo']
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
     * * height - Sets the default height of the image when it is inserted in the RichTextEditor.
     * * saveUrl - Provides URL to map the action result method to save the image.
     * * path - Specifies the location to store the image.
     * @default 
     * {
     *  allowedTypes: ['.jpeg', '.jpg', '.png'],
     *  display: 'inline',
     *  width: 'auto', 
     *  height: 'auto', 
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
     * Specifies the direction of the RichTextEditor component.
     * For cultures like Arabic, Hebrew, etc. direction can be switched to right to left
     * @default false.
     */
    @Property(false)
    public enableRtl: boolean;
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
     * specifies the value whether the source code is displayed with encoded format. 
     * @default false.
     */
    @Property(false)
    public enableHtmlEncode: boolean;
    /**    
     * Specifies the height of the RichTextEditor component.    
     * @default auto    
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
    @Complex<IFormatProperties>({}, Format)
    public format: IFormatProperties;
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
    @Complex<IFontProperties>({}, FontFamily)
    public fontFamily: IFontProperties;
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
    @Complex<IFontProperties>({}, FontSize)
    public fontSize: IFontProperties;
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
    @Complex<IColorProperties>({}, FontColor)
    public fontColor: IColorProperties;
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
    @Complex<IColorProperties>({}, BackgroundColor)
    public backgroundColor: IColorProperties;
    /**
     * Accepts the template design and assigns it as RichTextEditor’s content. 
     * For more details about the available template options refer to [`Template`](./templates.html) documentation. 
     * The built-in template engine which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals
     * @default null
     */
    @Property(null)
    public valueTemplate: string;

    /**
     * Triggers before command execution using toolbar items or executeCommand method. 
     * If you cancel this event, the command cannot be executed. 
     * Set the cancel argument to true to cancel the command execution.
     * @event
     */
    @Event()
    public actionBegin: EmitType<ActionBeginEventArgs>;
    /** 
     * Triggers after command execution using toolbar items or executeCommand method.
     * @event
     */
    @Event()
    public actionComplete: EmitType<ActionCompleteEventArgs>;
    /** 
     * Triggers when the RichTextEditor is rendered.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when the RichTextEditor is destroyed.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Triggers when RichTextEditor is focused out.
     * @event
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Triggers when RichTextEditor Toolbar items is clicked.
     * @event
     */
    @Event()
    public toolbarClick: EmitType<Object>;
    /** 
     * Triggers when RichTextEditor is focused in
     * @event
     */
    @Event()
    public focus: EmitType<Object>;
    /** 
     * Triggers only when RichTextEditor is blurred and changes are done to the content.
     * @event 
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /** 
     * Triggers only when resizing the image.
     * @event 
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;
    /** 
     * Triggers only when start resize the image.
     * @event 
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;
    /** 
     * Triggers only when stop resize the image.
     * @event 
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;
    /**     
     * Customize keyCode to change the key value. 
     * @default null 
     */
    @Property(null)
    public formatter: IFormatter;

    public keyboardModule: KeyboardEvents;
    public localeObj: L10n;
    public valueContainer: HTMLTextAreaElement;
    private originalElement: HTMLElement;

    constructor(options?: RichTextEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
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
        }
        return modules;
    }
    private updateEnable(): void {
        if (this.enabled) {
            removeClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = 0;
            this.element.setAttribute('aria-disabled', 'false');
            this.inputElement.setAttribute('tabindex', '0');
        } else {
            if (this.getToolbar()) {
                removeClass(this.getToolbar().querySelectorAll('.' + classes.CLS_ACTIVE), classes.CLS_ACTIVE);
            }
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    }
    public setEnable(): void {
        this.updateEnable();
        (this.enabled) ? this.eventInitializer() : this.unWireEvents();
    }

    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void {
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setContainer();
        setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        attributes(this.element, { role: 'application' });
    }

    private setContainer(): void {
        this.originalElement = this.element.cloneNode(true) as HTMLElement;
        if (this.value === null || this.valueTemplate !== null) {
            this.setValue();
            this.element.innerHTML = '';
        }
        if (this.element.tagName === 'TEXTAREA') {
            let rteOutterWrapper: HTMLElement = this.createElement('div', {
                className: 'e-control e-richtexteditor', id: this.getID()
            }) as HTMLElement;
            rteOutterWrapper.innerHTML = (this.element as HTMLTextAreaElement).value;
            this.element.parentElement.insertBefore(rteOutterWrapper, this.element);
            this.valueContainer = this.element as HTMLTextAreaElement;
            this.valueContainer.classList.remove('e-control', 'e-richtexteditor');
            this.valueContainer.id = this.getID() + '-value';
            this.valueContainer.name = this.element.hasAttribute('name') ? this.element.getAttribute('name') : this.getID();
            this.element = rteOutterWrapper;
        } else {
            this.valueContainer = this.createElement('textarea', {
                id: this.getID() + '-value'
            }) as HTMLTextAreaElement;
            this.valueContainer.name = this.getID();
        }
        this.valueContainer.style.display = 'none';
        if (this.value !== null) {
            this.valueContainer.value = this.value;
        }
        this.element.appendChild(this.valueContainer);
    }

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
        }
    }
    /**
     * Blurs the RichTextEditor component
     * @public
     */
    public focusOut(): void {
        if (this.enabled) {
            this.inputElement.blur();
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
     * CommandName - Specifies the name of the command to be executed.
     * value - Specifies the sub command.
     * @public
     */
    public executeCommand(commandName: CommandName, value?: string | HTMLElement): void {
        let tool: IExecutionGroup = executeGroup[commandName];
        this.formatter.editorManager.execCommand(
            tool.command,
            tool.subCommand ? tool.subCommand : (value ? value : tool.value),
            null,
            null,
            (value ? value : tool.value),
            (value ? value : tool.value)
        );
    }

    private encode(value: string): string {
        let divNode: HTMLElement = this.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }

    private decode(value: string): string {
        return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
            .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
            .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
            .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
    }

    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    protected render(): void {
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
        (this.readonly || !this.enabled) ? this.unWireEvents() : this.eventInitializer();
    }

    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    protected eventInitializer(): void {
        this.wireEvents();
    }

    /**
     * For internal use only - keydown the event handler;
     * @private
     */
    public keyDown(e: KeyboardEvent): void {
        this.notify(events.keyDown, { member: 'keydown', args: e });
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        if ((e as KeyboardEventArgs).action || e.which === 9) {
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
    }

    private keyUp(e: KeyboardEvent): void {
        this.notify(events.keyUp, { member: 'keyup', args: e });
        let allowedKeys: boolean = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
        if (((e.key !== 'shift' && !e.ctrlKey) && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key.length === 1 || allowedKeys)) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
    }
    public updateValue(value?: string): void {
        if (isNOU(value)) {
            this.setProperties({ value: this.inputElement.innerHTML });
        } else {
            this.setProperties({ value: value });
        }
    }
    private mouseUp(e: MouseEvent): void {
        this.notify(events.mouseUp, { member: 'mouseUp', args: e });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && (this.inputElement as HTMLTextAreaElement).value.length !== 0))) {
            this.notify(events.toolbarRefresh, { args: e });
        }
    }

    /** 
     * @hidden
     */
    public ensureModuleInjected(module: Function): boolean {
        return this.getInjectedModules().indexOf(module) >= 0;
    }

    public onCopy(): void {
        this.contentModule.getDocument().execCommand('copy', false, null);
    }

    public onCut(): void {
        this.contentModule.getDocument().execCommand('cut', false, null);
    }

    public onPaste(e?: KeyboardEvent | ClipboardEvent): void {
        let args: Object = { requestType: 'Paste', editorMode: this.editorMode, event: e };
        let proxy: RichTextEditor = this;
        let value: string = null;
        if (e && !isNOU((e as ClipboardEvent).clipboardData)) { value = (e as ClipboardEvent).clipboardData.getData('text/plain'); }
        setTimeout(() => { this.formatter.saveData(); }, 0);
        this.formatter.onSuccess(this, args);
        if (value !== null && value.length === 0) {
            this.notify(events.paste, {
                module: events.imgModule, file: (e as ClipboardEvent).clipboardData.items[0].getAsFile(), args: e
            });
        }
    }

    /** 
     * @hidden
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
        this.unWireEvents();
        if (this.originalElement.tagName === 'TEXTAREA') {
            this.element.parentElement.insertBefore(this.valueContainer, this.element);
            this.valueContainer.id = this.getID();
            this.valueContainer.removeAttribute('name');
            this.element.remove();
            if (this.originalElement.innerHTML.trim() !== '') {
                this.valueContainer.value = this.originalElement.innerHTML.trim();
            } else {
                this.valueContainer.value = '';
            }
            this.element = this.valueContainer;
        } else {
            if (this.originalElement.innerHTML.trim() !== '') {
                this.element.innerHTML = this.originalElement.innerHTML.trim();
            } else {
                this.element.innerHTML = '';
            }
        }
        if (this.placeholder && this.placeHolderWrapper) {
            this.placeHolderWrapper.remove();
        }
        if (!isNOU(this.cssClass)) {
            removeClass([this.element], this.cssClass);
        }
        this.removeHtmlAttributes();
        this.removeAttributes();
        super.destroy();
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
        return this.contentModule.getPanel();
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
     */
    protected getModuleName(): string {
        return 'richtexteditor';
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    public onPropertyChanged(newProp: RichTextEditorModel, oldProp: RichTextEditorModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    this.value = (this.enableHtmlEncode) ? this.encode(this.decode(newProp[prop])) : newProp[prop];
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'valueTemplate':
                    this.setValue();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'width':
                    this.setWidth(newProp[prop]);
                    break;
                case 'height':
                    this.setHeight(newProp[prop]);
                    this.setContentHeight();
                    break;
                case 'readonly':
                    this.setReadOnly();
                    break;
                case 'cssClass':
                    this.element.classList.remove(oldProp[prop]);
                    this.setCssClass(newProp[prop]);
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'enableRtl':
                    this.updateRTL();
                    break;
                case 'placeholder':
                    this.placeholder = newProp[prop];
                    this.setPlaceHolder();
                    break;
                case 'htmlAttributes':
                    setAttributes(this.htmlAttributes, this, false);
                    break;
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
                    this.setIframeSettings();
                    break;
                case 'locale':
                    super.refresh();
                    break;
                case 'inlineMode':
                    this.notify(events.modelChanged, { module: 'quickToolbar' });
                    this.setContentHeight();
                    break;
                case 'toolbarSettings':
                    this.notify(events.modelChanged, { module: 'toolbar' });
                    this.setContentHeight();
                    break;
                case 'showCharCount':
                    if (newProp[prop] && this.countModule) {
                        this.countModule.renderCount();
                    } else if (newProp[prop] === false && this.countModule) {
                        this.countModule.destroy();
                    }
                    break;
                case 'enableHtmlEncode':
                    this.updateValueData();
                    break;
                default:
                    this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
            }
        }
    }
    /**
     * @hidden
     */
    public updateValueData(): void {
        if (this.enableHtmlEncode) {
            this.setProperties({ value: this.encode(this.decode(this.inputElement.innerHTML)) });
        } else {
            this.setProperties({
                value: /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                    this.decode(this.inputElement.innerHTML)
            });
        }
    }
    private removeSheets(srcList: Element[]): void {
        let i: number;
        for (i = 0; i < srcList.length; i++) {
            srcList[i].remove();
        }
    }
    private updatePanelValue(): void {
        let value: string;
        if (this.editorMode === 'HTML' && this.value) {
            value = this.value.replace(/>\s+</g, '><');
        } else {
            value = this.value;
        }
        value = (this.enableHtmlEncode && this.value) ? this.decode(value) : value;
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
    }
    private setHeight(height: string | number): void {
        if (height !== 'auto') {
            this.element.style.height = formatUnit(height);
        } else {
            this.element.style.height = 'auto';
        }
    }
    public setPlaceHolder(): void {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
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
            if (this.inputElement.textContent.length !== 0) {
                this.placeHolderWrapper.style.display = 'none';
            } else {
                this.placeHolderWrapper.style.display = 'block';
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
        if (this.editorMode !== 'Markdown') {
            if (this.readonly) {
                attributes(this.inputElement, { contenteditable: 'false' });
                addClass([this.element], classes.CLS_RTE_READONLY);
            } else {
                attributes(this.inputElement, { contenteditable: 'true' });
                removeClass([this.element], classes.CLS_RTE_READONLY);
            }
        }
    }
    public setReadOnly(): void {
        this.updateReadOnly();
        (this.readonly) ? this.unWireEvents() : this.eventInitializer();
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
        this.trigger(events.actionBegin, printArgs);
        printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
        if (Browser.info.name === 'msie') { printWind.resizeTo(screen.availWidth, screen.availHeight); }
        printWind = printWindow(this.inputElement, printWind);
        if (printArgs.cancel) { return; }
        let actionArgs: ActionCompleteEventArgs = {
            requestType: 'print'
        };
        this.trigger(events.actionComplete, actionArgs);
    }

    /**
     * Applies all the pending property changes and render the component again.
     * @public
     */
    public refresh(): void {
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
     * @public
     */
    public enableToolbarItem(items: string | string[]): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true);
    }
    /**
     * Disables the given toolbar items in the RichTextEditor component.
     * @public
     */
    public disableToolbarItem(items: string | string[]): void {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false);
    }
    /**
     * Removes the give toolbar items from the RichTextEditor component.
     * @public
     */
    public removeToolbarItem(items: string | string[]): void {
        this.toolbarModule.removeTBarItems(items);
    }

    /**
     * Get the selected range from the RichTextEditor's content.
     * @public
     */
    public getRange(): Range {
        return this.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
    }

    private initializeServices(): void {
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('rteLocale', this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale));
    }

    private RTERender(): void {
        let rendererFactory: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.fullScreenModule = new FullScreen(this);
        this.renderModule.render();
        this.inputElement = <HTMLElement>this.contentModule.getEditPanel();
        this.setHeight(this.height);
        setAttributes(this.htmlAttributes, this, false);
        if (this.iframeSettings) {
            this.setIframeSettings();
        }
        this.setCssClass(this.cssClass);
        this.updateEnable();
        this.setPlaceHolder();
        this.updateRTL();
        this.updateReadOnly();
        this.updatePanelValue();
        if (this.enableHtmlEncode) {
            this.setProperties({ value: this.encode(this.decode(this.value)) });
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
            setAttributes(this.iframeSettings.attributes, this, true);
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
        } else if (this.element.innerHTML.trim() !== '') {
            this.setProperties({ value: this.element.innerHTML.trim() });
        }
    }

    public setContentHeight(target?: string, isExpand?: boolean): void {
        let heightValue: string;
        let topValue: number = 0;
        let cntEle: HTMLElement = (this.sourceCodeModule.getPanel() &&
            this.sourceCodeModule.getPanel().parentElement.style.display === 'block') ? this.sourceCodeModule.getPanel().parentElement :
            <HTMLElement>this.contentModule.getPanel();
        let rteHeight: number = this.element.offsetHeight;
        let tbHeight: number = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        let expandPopHeight: number = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (this.toolbarSettings.type === ToolbarType.Expand && isExpand && target !== 'preview') {
            heightValue = (this.height === 'auto') ? 'auto' : rteHeight - (tbHeight + expandPopHeight) + 'px';
            topValue = (!this.toolbarSettings.enableFloating) ? expandPopHeight : 0;
        } else {
            if (this.height === 'auto') {
                heightValue = (this.element.classList.contains('e-rte-full-screen')) ? '100%' : 'auto';
            } else {
                heightValue = rteHeight - tbHeight + 'px';
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
     * @hidden
     */
    public getBaseToolbarObject(): BaseToolbar {
        let tbObj: BaseToolbar;
        if (this.inlineMode.enable && !Browser.isDevice) {
            tbObj = this.quickToolbarModule && this.quickToolbarModule.getInlineBaseToolbar();
        } else {
            tbObj = this.toolbarModule && this.toolbarModule.getBaseToolbar();
        }
        return tbObj;
    }

    /**
     * @hidden
     */
    public getToolbar(): HTMLElement {
        return this.toolbarModule ? <HTMLElement>this.toolbarModule.getToolbarElement() : null;
    }

    /**
     * @hidden
     */
    public getToolbarElement(): Element {
        return this.toolbarModule && this.toolbarModule.getToolbarElement();
    }

    public getID(): string {
        return this.element.id;
    }

    private mouseDownHandler(e: MouseEvent): void {
        addClass([this.element], [classes.CLS_FOCUS]);
        this.preventDefaultResize(e);
        this.notify(events.mouseDown, { args: e });
    }

    private preventImgResize(e: FocusEvent | MouseEvent): void {
        if ((e.target as HTMLElement).nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    }

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
        let isExpand: boolean = (this.toolbarSettings.type === ToolbarType.Expand) ? true : false;
        this.setContentHeight('', isExpand);
    }

    private scrollHandler(e: Event): void {
        this.notify(events.scroll, { args: e });
    }

    private editAreaClickHandler(e: MouseEventArgs): void {
        this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
    }

    private focusHandler(e: FocusEvent): void {
        if (!this.isRTE || this.isFocusOut) {
            this.isRTE = this.isFocusOut ? false : true;
            this.isFocusOut = false;
            addClass([this.element], [classes.CLS_FOCUS]);
            if (this.editorMode === 'HTML') {
                this.cloneValue = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.inputElement.innerHTML;
            } else {
                this.cloneValue = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                    (this.inputElement as HTMLTextAreaElement).value;
            }
            if (document.activeElement === this.element) {
                (this.contentModule.getEditPanel() as HTMLElement).focus();
            }
            this.preventDefaultResize(e);
            this.trigger('focus');
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        if (!this.element.contains(e.target as Node) && document !== e.target && !closest(target, '.' + classes.CLS_RTE) &&
            !closest(target, '.' + classes.CLS_RTE_ELEMENTS)) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.notify(events.docClick, { args: e });
    }

    private blurHandler(e: FocusEvent): void {
        let trg: Element = e.relatedTarget as Element;
        if (trg) {
            if (closest(trg, '.' + classes.CLS_RTE)) {
                this.isBlur = false;
            } else if (closest(trg, '.' + classes.CLS_RTE_ELEMENTS)) {
                this.isBlur = false;
            } else {
                this.isBlur = true;
                trg = null;
            }
        }
        if (this.isBlur && isNOU(trg)) {
            removeClass([this.element], [classes.CLS_FOCUS]);
            this.notify(events.focusChange, {});
            if (this.editorMode === 'HTML') {
                this.value = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.inputElement.innerHTML;
            } else {
                this.value = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                    (this.inputElement as HTMLTextAreaElement).value;
            }
            this.valueContainer.value = this.value;
            this.notify(events.toolbarRefresh, { args: e, documentNode: document });
            this.invokeChangeEvent();
            this.isFocusOut = true;
            this.isBlur = false;
            dispatchEvent(this.valueContainer, 'focusout');
            this.defaultResize(e);
            this.trigger('blur');
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        } else {
            this.isRTE = true;
        }
    }

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
     */
    public wireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
    }

    /**
     * @hidden
     */
    public unWireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
    }
    private resetHandler(): void {
        this.value = null;
    }

    private wireEvents(): void {
        this.keyboardModule = new KeyboardEvents(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs: this.formatter.keyConfig, eventName: 'keydown'
        });
        let formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, 'mouseup', this.mouseUp, this);
        EventHandler.add(this.inputElement, 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.inputElement, 'click', this.editAreaClickHandler, this);
        this.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown, this);
        this.element.addEventListener('focusin', this.focusHandler.bind(this), true);
        this.element.addEventListener('focusout', this.blurHandler.bind(this), true);
        window.addEventListener('resize', this.resizeHandler.bind(this), true);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'mousedown', this.onIframeMouseDown, this);
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
        if (e.callBack && (e.event.action === 'copy' || e.event.action === 'cut')) {
            e.callBack({
                requestType: e.event.action,
                editorMode: 'HTML',
                event: e.event
            });
        }
    }

    private unWireEvents(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        let formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, 'mouseup', this.mouseUp);
        EventHandler.remove(this.inputElement, 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.inputElement, 'click', this.editAreaClickHandler);
        if (this.formatter) {
            this.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown);
        }
        this.element.removeEventListener('focusin', this.focusHandler.bind(this), false);
        this.element.removeEventListener('focusout', this.blurHandler.bind(this), false);
        window.removeEventListener('resize', this.resizeHandler.bind(this), false);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'mousedown', this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
    }
}