import { Component, EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, Collection, EmitType, Event, select, compile, remove, attributes, L10n } from '@syncfusion/ej2-base';
import { ChildProperty, getUniqueID, isNullOrUndefined as isNOU, formatUnit, append, BaseEventArgs, Complex, removeClass, addClass } from '@syncfusion/ej2-base';
import { AIAssistViewModel, PromptModel, ResponseToolbarSettingsModel, PromptToolbarSettingsModel, ToolbarItemModel, AssistViewModel, ToolbarSettingsModel } from './ai-assist-view-model';
import { InputEventArgs, TextArea } from '@syncfusion/ej2-inputs';
import { ItemModel, Toolbar, ClickEventArgs, ItemType, ItemAlign } from '@syncfusion/ej2-navigations';

const ASSISTHEADER: string = 'e-aiassist-header-text e-assist-view-header';

/**
 * The outputToolbarItems property maps the list of the outputToolbarItems and binds the data to the output items.
 */
export class ToolbarItem extends ChildProperty<ToolbarItem> {
    /**
     * Specifies the CSS class for the icon of the toolbar item.
     * Represents the icon displayed for the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the text of the toolbar item.
     * Represents the display text of the toolbar item.
     *
     * @type {string}
     * @default null
     */
    @Property()
    public text: string;

    /**
     * Specifies the type of the toolbar item.
     * Represents the item type of the toolbar item.
     *
     * @type {ItemType}
     * @default "Button"
     * @aspPopulateDefaultValue
     */
    @Property('Button')
    public type: ItemType;

    /**
     * Specifies the alignment of the toolbar item.
     *
     * @type {ItemAlign}
     * @default "Left"
     * @aspPopulateDefaultValue
     */
    @Property('Left')
    public align: ItemAlign;

    /**
     * Specifies whether the toolbar item is visible.
     * Indicates if the toolbar item should be displayed.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies whether the toolbar item is disabled.
     * Indicates if the toolbar item is interactive or not.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the tooltip text for the toolbar item.
     * Represents the text shown when hovering over the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public tooltip: string;

    /**
     * Specifies the CSS class for styling the toolbar item.
     * Represents the additional CSS classes applied to the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the template that defines the appearance of the toolbar item.
     * Represents the custom template for rendering the toolbar item, which can be a string or a function.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public template: string | Function;

    /**
     * Specifies the tab order of the toolbar items.
     * When assigned positive values, it allows switching focus to the next/previous toolbar items using the Tab/Shift+Tab keys.
     * If the value is set to 0 for all toolbar items, the tab order switches based on the element's order in the DOM.
     *
     * @type {number}
     * @default -1
     */
    @Property(-1)
    public tabIndex: number
}

/**
 * The prompts property maps the list of the prompts and binds the data to the suggestions.
 */
export class Prompt extends ChildProperty<Prompt> {
    /**
     * Specifies the prompt text.
     * Represents the text used for prompting user input.
     *
     * @type {string}
     * @default null
     */
    @Property(null)
    public prompt: string;

    /**
     * Specifies the response associated with the prompt.
     * Represents the text that provides the response to the prompt.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public response: string;

    /**
     * Indicates if the response is considered helpful.
     * Represents the state of whether the generated response is useful or not.
     *
     * @type {boolean | null}
     * @default null
     */
    @Property(null)
    public isResponseHelpful: boolean;
}

/**
 * Specifies the type of assist view.
 */
export enum AssistViewType {
    /**
     * Represents the default assist view type.
     */
    Assist = 'Assist',
    /**
     * Represents a custom assist view type.
     */
    Custom = 'Custom'
}

/**
 * The assistView property maps the customized AiAssistView.
 */
export class AssistView extends ChildProperty<AssistView> {
    /**
     * Specifies the type of the assist view.
     *
     * @isenumeration true
     * @default AssistViewType.Assist
     * @asptype AssistViewType
     */
    @Property('Assist')
    public type: string | AssistViewType;

    /**
     * Specifies the name of the assist view.
     * Represents the name displayed in the assist view.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Specifies the icon CSS for the assist view.
     * Represents the CSS class for the icon of the assist view.
     *
     * @type {string}
     * @default null
     */
    @Property()
    public iconCss: string;

    /**
     * Specifies the template for the view of the assist view.
     * Represents the template for rendering the view, which can be a string or a function.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public viewTemplate: string | Function;
}

/**
 * The toolbarSettings property maps the list of the toolbarSettings and binds the data to the output items.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {

    /**
     * Specifies the collection of toolbar items in the AIAssistView component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the AIAssistView component.
     *
     * @event itemClicked
     */
    @Event()
    public itemClicked: EmitType<ToolbarItemClickedEventArgs>;
}

/**
 * The promptToolbarSettings property maps the list of the promptToolbarSettings and binds the data to the prompt.
 */
export class PromptToolbarSettings extends ChildProperty<PromptToolbarSettings> {
    /**
     * Specifies the width of the prompt toolbar in the AIAssistView component.
     * Represents the width of the toolbar, which can be set using a string value such as 'auto', '100%', or other CSS width values.
     *
     * @type {string}
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the collection of toolbar items in the prompt toolbar of the AIAssistView component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the prompt toolbar of the AIAssistView component.
     *
     * @event itemClicked
     */
    @Event()
    public itemClicked: EmitType<ToolbarItemClickedEventArgs>;
}

/**
 * The responseToolbarSettings property maps the list of the responseToolbarSettings and binds the data to the output items.
 */
export class ResponseToolbarSettings extends ChildProperty<ResponseToolbarSettings> {
    /**
     * Specifies the width of the response toolbar in the AIAssistView component.
     * Represents the width of the toolbar, which can be defined using various CSS units and values such as 'auto', '100%', or pixel-based measurements.
     *
     * @type {string}
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the collection of toolbar items in the response toolbar of the AIAssistView component.
     * Represents an array of items that are rendered in the toolbar, allowing for customization and interaction within the response section.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the response toolbar of the AIAssistView component.
     *
     * @event itemClicked
     */
    @Event()
    public itemClicked: EmitType<ToolbarItemClickedEventArgs>;
}

export interface ToolbarItemClickedEventArgs extends BaseEventArgs {
    /**
     * Specifies the toolbar item that was clicked.
     * Represents the model of the toolbar item that triggered the click event.
     *
     * @type {ToolbarItemModel}
     * @default null
     *
     */
    item?: ToolbarItemModel
    /**
     * Specifies the event object associated with the toolbar item click.
     * Represents the underlying event that triggered the click action, providing details about the event.
     *
     * @type {Event}
     * @default null
     *
     */
    event?: Event
    /**
     * Specifies whether the click event should be cancelled.
     * Determines if the default action associated with the click event should be prevented.
     *
     * @type {boolean}
     * @default false
     *
     */
    cancel?: boolean

    /**
     * Specifies the index of the prompts data.
     * Represents the position of the prompt data associated with the toolbar item click event.
     *
     * @type {number}
     * @default -1
     */
    dataIndex?: number
}

export interface PromptRequestEventArgs extends BaseEventArgs {
    /**
     * Specifies whether the prompt request should be cancelled.
     * Determines if the prompt request should be stopped, giving control over whether the prompt processing continues or is aborted.
     *
     * @type {boolean}
     * @default false
     *
     */
    cancel?: boolean
    /**
     * Specifies the toolbar items for the output view in the AIAssistView component.
     * Represents the collection of toolbar items that are displayed alongside the output view, allowing for additional interactions.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     *
     */
    responseToolbarItems?: ToolbarItemModel[]
    /**
     * Specifies the text of the prompt request.
     *
     * @type {string}
     * @default null
     *
     */
    prompt?: string
    /**
     * Specifies the list of prompt suggestions.
     * Represents an array of suggested prompts that can assist the user.
     *
     * @type {string[]}
     * @default null
     *
     */
    promptSuggestions?: string[]
}

export interface PromptChangedEventArgs extends BaseEventArgs {
    /**
     * Specifies the current value of the prompt.
     * Represents the updated text or data of the prompt after the change has occurred.
     *
     * @type {string}
     * @default null
     *
     */
    value?: string
    /**
     * Specifies the previous value of the prompt before the change.
     *
     * @type {string}
     * @default null
     *
     */
    previousValue?: string
    /**
     * Specifies the event object associated with the prompt change.
     * Represents the underlying event that triggered the prompt change, useful for additional event details or handling.
     *
     * @type {Event}
     */
    event?: Event
    /**
     * Specifies the HTML element of the text area container.
     * Represents the DOM element that contains the text area, allowing for direct manipulation or reference.
     *
     * @type {HTMLElement}
     */
    element?: HTMLElement
}

/**
 * The `AIAssistView` component is designed to enhance user interaction by integrating AI driven assistance features.
 * It provides a seamless interface for incorporating suggestions & AI responses.
 *
 * ```html
 *  <div id='defaultAIAssistView'></div>
 * ```
 * ```typescript
 *  let aiAssistObj: AIAssistView = new AIAssistView();
 *  aiAssistObj.appendTo('#defaultAIAssistView');
 * ```
 */

@NotifyPropertyChanges
export class AIAssistView extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Specifies the text input prompt for the AIAssistView component.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public prompt: string;

    /**
     * Specifies the placeholder text for the prompt input text area in the AIAssistView component.
     *
     * @type {string}
     * @default 'Type prompt for assistance...'
     */
    @Property('Type prompt for assistance...')
    public promptPlaceholder: string;

    /**
     * Specifies the collection of prompts and their responses in the AIAssistView component.
     *
     * {% codeBlock src='ai-assistview/prompts/index.md' %}{% endcodeBlock %}
     *
     * @type {PromptModel[]}
     * @default []
     */
    @Collection<PromptModel>([], Prompt)
    public prompts: PromptModel[];

    /**
     * Specifies the list of prompt suggestions in the AIAssistView component.
     * Contains suggestions that can be used as prompts.
     *
     * {% codeBlock src='ai-assistview/promptSuggestions/index.md' %}{% endcodeBlock %}
     *
     * @type {string[]}
     * @default null
     */
    @Property([])
    public promptSuggestions: string[];

    /**
     * Specifies the header text for the prompt suggestions in the AIAssistView component. Provides a header for the list of suggestions.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public promptSuggestionsHeader: string;

    /**
     * Specifies whether the header is displayed in the AIAssistView component.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public showHeader: boolean;

    /**
     * Specifies the toolbar settings for the AIAssistView component.
     * Represents the configuration for toolbar items and actions within the component.
     *
     * {% codeBlock src='ai-assistview/toolbarSettings/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Complex<ToolbarSettingsModel>({ items: [] }, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Specifies the index of the active view in the AIAssistView component.
     * Determines the currently active and visible view.
     *
     * @type {number}
     * @default 0
     * @aspType int
     */
    @Property(0)
    public activeView : number;

    /**
     * Specifies the CSS class for the prompter avatar in the AIAssistView component. Allows custom styling for the prompt avatar.
     *
     * @type {string}
     * @default null
     */
    @Property(null)
    public promptIconCss: string;

    /**
     * Specifies the CSS class for the responder avatar in the AIAssistView component. Allows custom styling for the responder avatar.
     *
     * @type {string}
     * @default null
     */
    @Property(null)
    public responseIconCss: string;

    /**
     * Specifies the width of the AIAssistView component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the height of the AIAssistView component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public height: string | number;

    /**
     * Specifies custom CSS classes for the AIAssistView component. Allows for additional custom styling.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the collection of assist view models in the AIAssistView component.
     * Represents the views available in the assist view.
     *
     * {% codeBlock src='ai-assistview/views/index.md' %}{% endcodeBlock %}
     *
     * @type {AssistViewModel[]}
     * @default null
     */
    @Collection<AssistViewModel>([], AssistView)
    public views: AssistViewModel[] ;

    /**
     * Specifies the settings for the prompt toolbar in the AIAssistView component.
     * Represents the configuration for the toolbar associated with prompt items.
     *
     * {% codeBlock src='ai-assistview/promptToolbarSettings/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Complex<PromptToolbarSettingsModel>({ width: null, items: [] }, PromptToolbarSettings)
    public promptToolbarSettings: PromptToolbarSettingsModel;

    /**
     * Specifies the settings for the response toolbar in the AIAssistView component.
     * Represents the configuration for the toolbar associated with response items.
     *
     * {% codeBlock src='ai-assistview/responseToolbarSettings/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Complex<ResponseToolbarSettingsModel>({width: null, items: [] }, ResponseToolbarSettings)
    public responseToolbarSettings: ResponseToolbarSettingsModel;

    /**
     * Specifies whether the clear button of text area is displayed in the AIAssistView component.
     * Determines if a button for clearing the prompt text area is shown or hidden.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Specifies the template for the footer in the AIAssistView component.
     * Defines the content or layout used to render the footer. Can be a string or a function.
     *
     * {% codeBlock src='ai-assistview/footerTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public footerTemplate: string | Function;

    /**
     * Specifies the template for rendering prompt items in the AIAssistView component.
     * Defines the content or layout used to render prompt items, and can be either a string or a function.
     * The template context includes prompt text and toolbar items.
     *
     * {% codeBlock src='ai-assistview/promptItemTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public promptItemTemplate: string | Function;

    /**
     * Specifies the template for rendering response items in the AIAssistView component.
     * Defines the content or layout used to render response items, and can be either a string or a function.
     * The template context includes the prompt text, response text, and toolbar items.
     *
     * {% codeBlock src='ai-assistview/responseItemTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public responseItemTemplate: string | Function;

    /**
     * Specifies the template for rendering prompt suggestion items in the AIAssistView component.
     * Defines the content or layout used to render prompt suggestion items, and can be either a string or a function.
     * The template context includes the index and suggestion text.
     *
     * {% codeBlock src='ai-assistview/suggestionItemTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public promptSuggestionItemTemplate: string | Function;

    /**
     * Specifies the template for the banner in the AIAssistView component.
     * Represents the content or layout used to render the banner. Can be a string or a function.
     *
     * {% codeBlock src='ai-assistview/bannerTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public bannerTemplate: string | Function;

    /**
     * Event triggered when a prompt request is made in the AIAssistView component.
     * Provides details about the prompt request, including whether it should be cancelled, the prompt text, output, and toolbar items.
     *
     * @event promptRequest
     */
    @Event()
    public promptRequest: EmitType<PromptRequestEventArgs>;

    /**
     * Event triggers when the SfAIAssistView is created.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Event triggered when the prompt text changed in the AIAssistView component.
     *
     * @event 'promptChanged'
     */
    @Event()
    public promptChanged: EmitType<PromptChangedEventArgs>;

    /* Private variables */
    private l10n: L10n;
    private stopRespondingContent: HTMLElement;
    private viewWrapper: HTMLElement;
    private sendIcon: HTMLElement;
    private textareaObj: TextArea;
    private suggestions: HTMLElement;
    private outputElement: HTMLElement;
    private skeletonContainer: HTMLElement;
    private aiAssistViewRendered: boolean;
    private outputSuggestionEle : HTMLElement;
    private contentFooterEle: HTMLElement;
    private contentWrapper: HTMLElement;
    private footer: HTMLElement;
    private responseToolbarEle: Toolbar;
    private assistViewTemplateIndex: number;
    private toolbarHeader: HTMLElement;
    private assistCustomSection: HTMLElement;
    private toolbarItems: ItemModel[] = [];
    private content: HTMLElement;
    private suggestionHeader: HTMLElement;
    private toolbar: Toolbar;
    private displayContents: HTMLElement[] = [];
    private previousElement: HTMLElement;
    private stopResponding: HTMLElement;
    private isOutputRenderingStop: boolean;
    private promptToolbarEle: Toolbar;
    private isAssistView: boolean;
    private outputContentBodyEle: HTMLElement;
    private preTagElements: { preTag: HTMLPreElement; handler: Function }[] = [];
    private isResponseRequested : boolean;

    /**
     * Constructor for creating the component
     *
     * @param {AIAssistViewModel} options - Specifies the AIAssistViewModel model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: AIAssistViewModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        if (!this.element.id) { this.element.id = getUniqueID('e-' + this.getModuleName()); }
    }

    protected getDirective(): string {
        return 'EJS-AIASSISTVIEW';
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'aiassistview';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    protected render(): void {
        this.renderPromptView();
    }

    private renderPromptView(): void {
        this.setDimension();
        this.renderToolbar();
        this.wireEvents();
    }

    /* To calculate the width when change via set model */
    private setDimension(): void {
        this.element.style.width = !isNOU(this.width) ? formatUnit(this.width) : this.element.style.width;
        this.element.style.height = !isNOU(this.height) ? formatUnit(this.height) : this.element.style.height;
    }

    private renderToolbar(): void {
        this.assistViewTemplateIndex = -1;
        this.aiAssistViewRendered = false;
        this.isAssistView = false;
        this.isOutputRenderingStop = false;
        this.isResponseRequested = false;
        let isAssistViewAssigned: boolean = false;
        let assistView: ItemModel;
        let customViewTemplate: HTMLElement;
        let customViewCount: number = 1;
        if (this.views.length > 0) {
            for (let index: number = 0; index < this.views.length; index++) {
                if (this.views[parseInt(index.toString(), 10)].type.toLocaleLowerCase() === 'assist' && !isAssistViewAssigned) {
                    assistView = {
                        text: this.views[parseInt(index.toString(), 10)].name || 'AI Assist',
                        prefixIcon: this.views[parseInt(index.toString(), 10)].iconCss || 'e-icons e-assistview-icon',
                        cssClass: ASSISTHEADER,
                        htmlAttributes: { 'data-index': this.element.id + '_view_0' }
                    };
                    this.toolbarItems.unshift(assistView);
                    if (this.views[parseInt(index.toString(), 10)].viewTemplate) { this.assistViewTemplateIndex = index; }
                    isAssistViewAssigned = true;
                    this.isAssistView = true;
                }
                else if (this.views[parseInt(index.toString(), 10)].type.toLocaleLowerCase() === 'custom') {
                    customViewTemplate = this.createElement('div', { attrs: { class: 'e-customview-content-section-' + customViewCount + ' e-custom-view' }});
                    this.updateContent('customViewTemplate', customViewTemplate, -1, index);
                    this.displayContents.push(customViewTemplate);
                    this.toolbarItems.push({
                        text: this.views[parseInt(index.toString(), 10)].name || '',
                        prefixIcon : this.views[parseInt(index.toString(), 10)].iconCss || '',
                        cssClass: 'e-aiassist-header-text e-custom-view-header',
                        htmlAttributes: { 'data-index': this.element.id + '_view_' + customViewCount.toString() }
                    });
                    customViewCount++;
                }
            }
        }
        if (this.views.length === 0 || !isAssistViewAssigned) {
            assistView = {
                text: 'AI Assist',
                prefixIcon: 'e-icons e-assistview-icon',
                cssClass: ASSISTHEADER,
                htmlAttributes: { 'data-index': this.element.id + '_view_0' }
            };
            this.toolbarItems.unshift(assistView);
            isAssistViewAssigned = true;
        }
        this.renderViews();
        this.renderToolbarSettings();
        if (this.assistViewTemplateIndex < 0) { this.displayContents.unshift(this.contentWrapper); }
        else { this.displayContents.unshift(this.assistCustomSection); }
        this.previousElement = this.displayContents[this.activeView];
        this.toolbar = new Toolbar({
            items: this.toolbarItems,
            height: '100%',
            clicked: (args: ClickEventArgs) => {
                const eventItemArgs: ToolbarItemModel = {
                    type: args.item.type,
                    text: args.item.text,
                    iconCss: args.item.prefixIcon,
                    cssClass: args.item.cssClass,
                    tooltip: args.item.tooltipText,
                    template: args.item.template as string | Function,
                    disabled: args.item.disabled,
                    visible: args.item.visible,
                    align: args.item.align,
                    tabIndex: args.item.tabIndex
                };
                const eventArgs: ToolbarItemClickedEventArgs = {
                    item: eventItemArgs,
                    event: args.originalEvent,
                    cancel: false
                };
                if (this.toolbarSettings.itemClicked) {
                    this.toolbarSettings.itemClicked.call(this, eventArgs);
                }
                if (!eventArgs.cancel) {
                    if (args.item.htmlAttributes) {
                        const currentIndex: number = parseInt(args.item.htmlAttributes['data-index'].split(this.element.id + '_view_')[1], 10);
                        if (currentIndex !== this.activeView) {
                            const prevOnChange: boolean = this.isProtectedOnChange;
                            this.isProtectedOnChange = true;
                            const previousIndex: number = this.getIndex(this.activeView);
                            this.activeView = parseInt(args.item.htmlAttributes['data-index'].split(this.element.id + '_view_')[1], 10);
                            this.updateActiveView(previousIndex);
                            this.isProtectedOnChange = prevOnChange;
                        }
                    }
                }
            }
        });
        this.toolbarHeader = this.createElement('div', { attrs: { class: 'e-view-header' }});
        const toolbarEle: HTMLElement = this.createElement('div');
        this.toolbar.appendTo(toolbarEle);
        this.toolbar.element.setAttribute('aria-label', 'assist-view-toolbar-header');
        this.toolbarHeader.appendChild(toolbarEle);
        this.element.appendChild(this.toolbarHeader);
        this.viewWrapper = this.createElement('div', { attrs: { class: 'e-view-content'} });
        this.updateActiveView();
        this.element.appendChild(this.viewWrapper);
        if (this.cssClass) { this.element.classList.add(this.cssClass); }
        this.updateToolbarHeader();
        this.aiAssistViewRendered = true;
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
    }

    private renderToolbarSettings(): void {
        if (this.toolbarSettings.items.length > 0) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const pushToolbar: ItemModel[] = this.toolbarSettings.items.map((item: any) => ({
                type: item.type,
                template: item.template,
                disabled: item.disabled,
                cssClass: item.cssClass,
                visible: item.visible,
                tooltipText: item.tooltip,
                prefixIcon: item.iconCss,
                text: item.text,
                align: item.align
            }));
            this.toolbarItems = [...this.toolbarItems, ...pushToolbar];
        }
    }

    private getIndex(currentIndex: number): number {
        return (((currentIndex) > (this.views.length - (this.isAssistView ? 1 : 0))) || (currentIndex < 0)) ?
            0 : currentIndex;
    }

    private updateActiveView(previousIndex?: number): void {
        const activeViewIndex: number = this.getIndex(this.activeView);
        if (!this.aiAssistViewRendered) {
            this.appendView(activeViewIndex);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this.toolbar as any).tbarEle[parseInt(activeViewIndex.toString(), 10)]) {
                (this.toolbar as any).tbarEle[parseInt(activeViewIndex.toString(), 10)].classList.add('e-active');
            }
        }
        else if (previousIndex !== activeViewIndex) {
            this.removePreviousView(previousIndex, activeViewIndex);
            this.appendView(activeViewIndex);
        }
        this.previousElement = this.displayContents[parseInt(activeViewIndex.toString(), 10)];
    }

    private appendView(activeViewIndex: number): void {
        //updating the new view section according to the activeView property
        if (activeViewIndex === 0 && this.assistViewTemplateIndex < 0) {
            this.viewWrapper.append(this.contentWrapper, this.stopResponding, this.footer);
        }
        else if (activeViewIndex === 0 && this.assistViewTemplateIndex >= 0) {
            this.viewWrapper.append(this.assistCustomSection);
        }
        else {
            this.viewWrapper.append(this.displayContents[parseInt(activeViewIndex.toString(), 10)]);
        }
    }

    private removePreviousView(previousIndex: number, activeViewIndex: number): void {
        // removing the previously binded element
        this.viewWrapper.removeChild(this.previousElement);
        if (previousIndex === 0 && this.assistViewTemplateIndex < 0) {
            this.viewWrapper.removeChild(this.stopResponding);
            this.viewWrapper.removeChild(this.footer);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.toolbar as any).tbarEle[parseInt(activeViewIndex.toString(), 10)]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.toolbar as any).tbarEle[parseInt(activeViewIndex.toString(), 10)].classList.add('e-active');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (previousIndex >= 0 && (this.toolbar as any).tbarEle[parseInt(previousIndex.toString(), 10)]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.toolbar as any).tbarEle[parseInt(previousIndex.toString(), 10)].classList.remove('e-active');
        }
    }

    private renderViews(): void {
        if (this.assistViewTemplateIndex >= 0 && this.views[this.assistViewTemplateIndex].viewTemplate) {
            this.assistCustomSection = this.createElement('div', { attrs: { class: 'e-assistview-content-section-0', 'data-index': this.element.id + '_view_0' } });
            this.updateContent('assistViewTemplate', this.assistCustomSection, -1, this.assistViewTemplateIndex);
        } else {
            this.renderDefaultView();
        }
    }

    private renderDefaultView(): void {
        this.contentWrapper = this.createElement('div', { attrs: { class: 'e-views', 'data-index': this.element.id + '_view_0' } });
        const contentContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-view-container' } });
        this.content = this.createElement('div', { attrs: { class: 'e-content-container' } });
        this.footer = this.createElement('div', { attrs: { class: `e-footer ${this.footerTemplate ? 'e-footer-template' : ''}` } });
        this.renderContent();
        this.renderFooterContent();
        if (this.bannerTemplate) {
            const introContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-banner-view'} });
            this.updateContent('bannerTemplate', introContainer);
            contentContainer.append(introContainer);
        }
        contentContainer.append(this.content);
        this.contentWrapper.appendChild(contentContainer);
        this.stopResponding = this.createElement('div', { attrs: { class: 'e-stop-response', tabIndex: '0', 'aria-label': 'Stop Responding', role: 'button' } });
        const stopRespondingIcon: HTMLElement = this.createElement('span', { attrs: { class: 'e-icons e-assist-stop' } });
        this.stopRespondingContent = this.createElement('span', { attrs: { class: 'e-stop-response-text' } });
        this.l10n = new L10n('aiassistview', { stopResponseText: 'Stop Responding' }, this.locale);
        this.updateStopRespondingTitle();
        this.appendChildren(this.stopResponding, stopRespondingIcon, this.stopRespondingContent);
    }

    private updateStopRespondingTitle(): void {
        this.l10n.setLocale(this.locale);
        this.stopRespondingContent.textContent = this.l10n.getConstant('stopResponseText');
    }

    private renderFooterContent(): void {
        if (this.footerTemplate) {
            this.updateContent('footerTemplate', this.footer);
        } else {
            const textareaEle: HTMLElement = this.createElement('textarea', { attrs: { class: 'e-assist-textarea' } });
            this.footer.appendChild(textareaEle);
            this.renderFooter(textareaEle);
            this.footer.appendChild(this.sendIcon);
        }
    }

    private renderContent(): void {
        this.renderOutputContent();
        this.renderSuggestions();
        if (this.outputElement) { this.renderSkeleton(); }
    }

    private renderOutputContent(isMethodCall?: boolean): void {
        this.outputElement = this.createElement('div', { attrs: { class: 'e-content' } });
        if (this.responseToolbarSettings.items.length === 0) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.responseToolbarSettings.items = [
                { iconCss: 'e-icons e-assist-copy', tooltip: 'Copy', cssClass: 'check' },
                { iconCss: 'e-icons e-assist-like', tooltip: 'Like' },
                { iconCss: 'e-icons e-assist-dislike', tooltip: 'Dislike' }
            ];
            this.isProtectedOnChange = prevOnChange;
        }
        if (this.prompts) {
            this.prompts.forEach((prompt: PromptModel, i: number) => {
                this.renderOutputContainer(prompt.prompt, prompt.response, i);
            });
        }
        this.content.appendChild(this.outputElement);
        if (this.suggestions) { this.content.insertBefore(this.suggestions, this.outputElement); }
        if (isMethodCall) { this.aiAssistViewRendered = true; }
    }

    private renderSuggestions(): void {
        if (this.promptSuggestions && this.promptSuggestions.length > 0) {
            this.suggestions = this.createElement('div', { attrs: { class: `e-suggestions ${this.promptSuggestionItemTemplate ? 'e-suggestion-item-template' : ''}` } });
            this.suggestionHeader =  this.createElement('div', { attrs: { class: 'e-suggestion-header' } });
            const suggestionList: HTMLElement = this.createElement('div', { attrs: { class: 'e-suggestion-list' } });
            this.renderSuggestionList(suggestionList);
            if (this.promptSuggestionsHeader) {
                this.suggestionHeader.innerHTML = this.promptSuggestionsHeader;
                this.suggestions.append(this.suggestionHeader);
            }
            this.suggestions.append(suggestionList);
            this.content.append(this.suggestions);
        }
    }

    private renderSuggestionList(suggestionWrapper: HTMLElement): void {
        const suggestionsListElement: HTMLElement = this.createElement('ul', { attrs: { 'tabindex': '-1' } }) as HTMLElement;
        this.promptSuggestions.forEach((suggestion: string, i: number) => {
            const suggestionList: HTMLLIElement = this.createElement('li');
            attributes(suggestionList, { 'tabindex': '0' });
            EventHandler.add(suggestionList, 'click', this.onSuggestionClick, this);
            EventHandler.add(suggestionList, 'keydown', this.suggestionItemHandler, this);
            if (this.promptSuggestionItemTemplate) {
                this.updateContent('promptSuggestionItemTemplate', suggestionList, -1, i);
            } else {
                suggestionList.innerHTML = suggestion;
            }
            suggestionsListElement.append(suggestionList);
        });
        suggestionWrapper.appendChild(suggestionsListElement);
    }

    private updateContent(templateName: string, contentEle: HTMLElement, index?: number, arrayPosition?: number): void {
        const notCompile: boolean = !(this.isReact || this.isVue);
        let template: string | Function;
        let context: object = { };
        const contextIndex: number = index >= 0 ? index : -1;
        const contextPrompt: string = index >= 0 ? this.prompts[parseInt(contextIndex.toString(), 10)].prompt : '';
        const contextOutput: string = index >= 0 ? this.prompts[parseInt(contextIndex.toString(), 10)].response : '';
        if (this.isReact) { this.clearTemplate([templateName]); }
        switch (templateName.toLowerCase()) {
        case 'footertemplate': {
            template = this.footerTemplate;
            break;
        }
        case 'promptitemtemplate': {
            template = this.promptItemTemplate;
            context = { prompt: contextPrompt, toolbarItems: this.promptToolbarSettings.items, index: contextIndex };
            break;
        }
        case 'responseitemtemplate': {
            template = this.responseItemTemplate;
            context = {
                prompt: contextPrompt,
                response: contextOutput,
                index: contextIndex,
                toolbarItems: this.responseToolbarSettings.items,
                output: contextOutput
            };
            break;
        }
        case 'promptsuggestionitemtemplate': {
            template = this.promptSuggestionItemTemplate;
            context = { index: arrayPosition, promptSuggestion: this.promptSuggestions[parseInt(arrayPosition.toString(), 10)] };
            break;
        }
        case 'customviewtemplate':
        case 'assistviewtemplate': {
            template = this.views[parseInt(arrayPosition.toString(), 10)].viewTemplate || '';
            break;
        }
        case 'bannertemplate': {
            template = this.bannerTemplate;
            break;
        }
        }
        const ctn: string | Function = this.getTemplateFunction(template, notCompile);
        if (typeof ctn === 'string') {
            contentEle.innerHTML = ctn;
        } else {
            append(ctn(context, this), contentEle);
        }
        this.renderReactTemplates();
    }

    /**
     * Gets template content based on the template property value.
     *
     * @param {string | Function} template - Template property value.
     * @param {boolean} notCompile - Compile property value.
     * @returns {Function} - Return template function.
     * @hidden
     */
    private getTemplateFunction(template: string | Function, notCompile: boolean): string | Function {
        if (typeof template === 'string') {
            let content: string = '';
            try {
                const tempEle: HTMLElement = select(template);
                if (tempEle) {
                    //Return innerHTML incase of jsrenderer script else outerHTML
                    content = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
                    notCompile = false;
                } else {
                    content = template;
                }
            } catch (e) {
                content = template;
            }
            return notCompile ? content : compile(content);
        } else {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            return compile(template as any);
        }
    }

    private renderFooter(textareaElement: HTMLElement): void {
        const rowCount: number = this.getRowCount(this.prompt);
        this.textareaObj = new TextArea({
            rows: rowCount,
            cols: 300,
            cssClass: rowCount >= 10 ? 'show-scrollbar' : 'hide-scrollbar',
            placeholder: this.promptPlaceholder,
            resizeMode: 'None',
            value: this.prompt,
            showClearButton: this.showClearButton,
            input: this.handleInput.bind(this)
        });
        this.textareaObj.appendTo(textareaElement);
        this.sendIcon = this.createElement('span', { attrs: { class: 'e-assist-send e-icons disabled', role: 'button', 'aria-label': 'Submit', tabindex: '0' } }) as HTMLElement;
        this.activateSendIcon(this.textareaObj.value.length);
    }

    private handleInput(args: InputEventArgs): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.prompt = args.value;
        this.isProtectedOnChange = prevOnChange;
        this.activateSendIcon(args.value.length);
        this.updateTextAreaObject(args.value);
        const eventArgs: PromptChangedEventArgs = {
            value: args.value,
            previousValue: args.previousValue,
            event: args.event,
            element: this.textareaObj.element
        };
        this.trigger('promptChanged', eventArgs);
    }

    private updateTextAreaObject(textValue: string): void {
        const rowCount: number = this.getRowCount(textValue);
        this.textareaObj.rows = rowCount;
        this.textareaObj.cssClass = (rowCount >= 10) ? 'show-scrollbar' : 'hide-scrollbar';
    }

    private getRowCount(textValue: string): number {
        const lines: number = textValue.split('\n').length;
        return (lines < 10 ? (lines >= 1 ? lines : 1) : 10);
    }

    private activateSendIcon(value: number): void {
        this.sendIcon.classList.toggle('disabled', value === 0);
        this.sendIcon.classList.toggle('enabled', value > 0);
    }

    private suggestionItemHandler(e: KeyboardEvent): void {
        this.keyHandler(e, 'suggestionitem');
    }

    private footerKeyHandler(e: KeyboardEvent): void {
        this.keyHandler(e, 'footer');
    }

    private stopResponseKeyHandler(e: KeyboardEvent): void {
        this.keyHandler(e, 'stopresponse');
    }

    private wireEvents(): void {
        if (this.sendIcon) {
            EventHandler.add(this.sendIcon, 'click', this.onSendIconClick, this);
        }
        if (this.footer && !this.footerTemplate) {
            EventHandler.add(this.footer, 'keydown', this.footerKeyHandler, this);
        }
        if (this.stopResponding) {
            EventHandler.add(this.stopResponding, 'click', this.respondingStopper, this);
            EventHandler.add(this.stopResponding, 'keydown', this.stopResponseKeyHandler, this);
        }
    }

    private unWireEvents(): void {
        if (this.sendIcon) {
            EventHandler.remove(this.sendIcon, 'click', this.onSendIconClick);
        }
        if (this.footer && !this.footerTemplate) {
            EventHandler.remove(this.footer, 'keydown', this.footerKeyHandler);
        }
        if (this.stopResponding) {
            EventHandler.remove(this.stopResponding, 'click', this.respondingStopper);
            EventHandler.remove(this.stopResponding, 'keydown', this.stopResponseKeyHandler);
        }
        this.detachCodeCopyEventHandler();
    }

    private detachCodeCopyEventHandler(): void {
        this.preTagElements.forEach(({preTag, handler}: { preTag: HTMLPreElement, handler: Function }) => {
            const copyIcon: HTMLSpanElement = preTag.querySelector('.e-code-copy');
            EventHandler.remove(copyIcon, 'click', handler);
        });
        this.preTagElements = [];
    }

    private keyHandler(event: KeyboardEvent, value: string): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            switch (value) {
            case 'footer':
                event.preventDefault();
                if (!this.isResponseRequested) {
                    this.textareaObj.value = '';
                    this.updateTextAreaObject(this.textareaObj.value);
                    this.onSendIconClick();
                }
                break;
            case 'suggestionitem':
                this.onSuggestionClick(event);
                break;
            case 'stopresponse':
                this.respondingStopper();
                break;
            }
        }
    }

    private respondingStopper(): void {
        this.isOutputRenderingStop = true;
        this.isResponseRequested = false;
        if (this.outputElement.hasChildNodes) {
            this.outputElement.removeChild(this.skeletonContainer);
        }
        this.stopResponding.classList.remove('e-btn-active');
    }

    private onSendIconClick(): void {
        if (this.isResponseRequested || !this.prompt.trim()) {
            return;
        }
        this.isResponseRequested = true;
        if (this.suggestions) { this.suggestions.hidden = true; }
        this.isOutputRenderingStop = false;
        this.stopResponding.classList.add('e-btn-active');
        this.addPrompt();
        this.createOutputElement();
        const eventArgs: PromptRequestEventArgs = {
            cancel: false,
            responseToolbarItems: this.responseToolbarSettings.items,
            prompt: this.prompt,
            promptSuggestions: this.promptSuggestions
        };
        if (!this.footerTemplate) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.prompt = this.textareaObj.value = '';
            this.isProtectedOnChange = prevOnChange;
            this.updateTextAreaObject(this.textareaObj.value);
            this.activateSendIcon(this.textareaObj.value.length);
        }
        this.trigger('promptRequest', eventArgs);
        if (this.contentWrapper) { this.contentWrapper.scrollTo(0, this.contentWrapper.scrollHeight); }
    }

    private addPrompt(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.prompts = [...this.prompts, { prompt: this.prompt, response: null, isResponseHelpful: null }];
        this.isProtectedOnChange = prevOnChange;
    }

    private createOutputElement(): void {
        this.outputSuggestionEle = this.createElement('div', { attrs: { id: `e-prompt-item_${this.prompts.length - 1}`, class: `e-prompt-container ${this.promptItemTemplate ? 'e-prompt-item-template' : ''}` } });
        this.renderPrompt(this.prompt, this.prompts.length - 1);
        this.outputElement.append(this.outputSuggestionEle, this.skeletonContainer);
        this.skeletonContainer.hidden = false;
    }

    private renderOutputContainer(promptText?: string, outputText?: string, index?: number, isMethodCall?: boolean): void {
        const outputContainer: HTMLElement = this.createElement('div', { attrs: { id: `e-response-item_${index}`, class: `e-output-container ${this.responseItemTemplate ? 'e-response-item-template' : ''}` } });
        this.renderOutput(outputContainer, promptText, outputText, isMethodCall, index);
        if (promptText) {
            this.outputElement.append(this.outputSuggestionEle);
        }
        this.outputElement.append(outputContainer);
        if (this.stopResponding) { this.stopResponding.classList.remove('e-btn-active'); }
    }

    private renderOutput(outputContainer: HTMLElement, promptText?: string, outputText?: string,
                         isMethodCall?: boolean, index?: number): void {
        const promptIcon: HTMLElement = this.createElement('span', { attrs: {
            class: 'e-output-icon e-icons ' + (this.responseIconCss || (this.isAssistView && this.views[0].iconCss) || 'e-assistview-icon' ) } });
        const aiOutputEle: HTMLElement = this.createElement('div', { attrs: { class: 'e-output' } });
        if (!this.aiAssistViewRendered || isMethodCall) {
            if (!isNOU(promptText)) {
                this.outputSuggestionEle = this.createElement('div', { attrs: { id: `e-prompt-item_${index}`, class: `e-prompt-container ${this.promptItemTemplate ? 'e-prompt-item-template' : ''}` } });
                this.renderPrompt(promptText, index);
            }
        }
        const lastPrompt: PromptModel = { prompt: promptText, response: outputText };
        if (lastPrompt.response) {
            if (this.responseItemTemplate) {
                this.updateContent('responseItemTemplate', aiOutputEle, index);
                if (this.outputElement.querySelector('.e-skeleton')) { this.outputElement.removeChild(this.skeletonContainer); }
                if (this.contentFooterEle) { this.contentFooterEle.classList.remove('e-assist-toolbar-active'); }
                this.renderOutputToolbarItems(index);
                aiOutputEle.append(this.contentFooterEle);
                outputContainer.append(aiOutputEle);
            }
            else {
                this.renderOutputTextContainer(lastPrompt.response, aiOutputEle, index);
                outputContainer.append(promptIcon, aiOutputEle);
            }
        }
        else if (this.aiAssistViewRendered) {
            if (this.outputElement.querySelector('.e-skeleton')) {
                this.outputElement.removeChild(this.skeletonContainer);
            }
            if (this.suggestions) { this.suggestions.hidden = false; }
        }
    }

    private renderOutputTextContainer(response: string, aiOutputEle: HTMLElement, index?: number, isMethodCall?: boolean): void {
        if (this.contentFooterEle) { this.contentFooterEle.classList.remove('e-assist-toolbar-active'); }
        this.outputContentBodyEle = this.createElement('div', { attrs: { class: 'e-content-body', tabindex: '0' } });
        if (!isMethodCall) {
            this.outputContentBodyEle.innerHTML = response;
            const preTags: HTMLPreElement[] = Array.from(this.outputContentBodyEle.querySelectorAll('pre'));
            preTags.forEach((preTag: HTMLPreElement) => {
                const copyIcon: HTMLSpanElement = document.createElement('span');
                copyIcon.className = 'e-icons e-code-copy e-assist-copy';
                preTag.insertBefore(copyIcon, preTag.firstChild);
                this.preTagElements.push({ preTag, handler: this.getCopyHandler(preTag) });
                EventHandler.add(copyIcon, 'click', this.preTagElements[this.preTagElements.length - 1].handler);
            });
        }
        this.renderOutputToolbarItems(index);
        this.appendChildren(aiOutputEle, this.outputContentBodyEle, this.contentFooterEle);
    }

    private getCopyHandler (preTag: HTMLPreElement): Function {
        return function(): void {
            const preText: string = preTag.innerText;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).navigator.clipboard.writeText(preText);
            const copyIcon: HTMLSpanElement = preTag.querySelector('.e-code-copy');
            copyIcon.className = 'e-icons e-code-copy e-assist-check';
            setTimeout(() => {
                copyIcon.className = 'e-icons e-code-copy e-assist-copy';
            }, 1000);
        };
    }

    private renderOutputToolbarItems(index?: number): void {
        this.contentFooterEle = this.createElement('div', { attrs: { class: 'e-content-footer e-assist-toolbar-active' } });
        const footerContent: HTMLElement = this.createElement('div');
        this.renderResponseToolbar(index);
        if (this.aiAssistViewRendered) {
            if (this.outputElement.querySelector('.e-skeleton')) { this.outputElement.removeChild(this.skeletonContainer); }
            if (this.suggestions) { this.suggestions.hidden = false; }
        }
        this.responseToolbarEle.appendTo(footerContent);
        this.responseToolbarEle.element.setAttribute('aria-label', `response-toolbar-${index}`);
        this.contentFooterEle.appendChild(footerContent);
    }

    private renderResponseToolbar(index?: number): void {
        const pushToolbar: ItemModel[] = this.responseToolbarSettings.items.map((item: ToolbarItemModel) => {
            const toolbarItem: ItemModel = {
                type: item.type,
                visible: item.visible,
                disabled: item.disabled,
                tooltipText: item.tooltip,
                template: item.template,
                prefixIcon: item.iconCss,
                text: item.text,
                cssClass: item.cssClass,
                align: item.align,
                width: this.responseToolbarSettings.width
            };
            if (toolbarItem.prefixIcon === 'e-icons e-assist-like' && this.prompts[parseInt(index.toString(), 10)].isResponseHelpful) {
                toolbarItem.prefixIcon = 'e-icons e-assist-like-filled';
            } else if (toolbarItem.prefixIcon === 'e-icons e-assist-dislike' && this.prompts[parseInt(index.toString(), 10)].isResponseHelpful === false) {
                toolbarItem.prefixIcon = 'e-icons e-assist-dislike-filled';
            }
            return toolbarItem;
        });
        this.responseToolbarEle = new Toolbar({
            items: pushToolbar,
            clicked: (args: ClickEventArgs) => {
                const eventItemArgs: ToolbarItemModel = {
                    type: args.item.type,
                    text: args.item.text,
                    iconCss: args.item.prefixIcon,
                    cssClass: args.item.cssClass,
                    tooltip: args.item.tooltipText,
                    template: args.item.template as string | Function,
                    disabled: args.item.disabled,
                    visible: args.item.visible,
                    align: args.item.align,
                    tabIndex: args.item.tabIndex
                };
                const eventArgs: ToolbarItemClickedEventArgs = {
                    item: eventItemArgs,
                    event: args.originalEvent,
                    cancel: false,
                    dataIndex: index
                };
                if (this.responseToolbarSettings.itemClicked) {
                    this.responseToolbarSettings.itemClicked.call(this, eventArgs);
                }
                if (!eventArgs.cancel) {
                    this.handleItemClick(args, index);
                }
            }
        });
    }
    private getClipBoardContent(value: string): void {
        const tempElement: HTMLElement = document.createElement('div');
        tempElement.innerHTML = value;
        tempElement.style.top = '0';
        tempElement.style.left = '0';
        tempElement.style.position = 'fixed';
        tempElement.style.opacity = '0';
        document.body.appendChild(tempElement);
        const copyText: string = tempElement.innerText;
        document.body.removeChild(tempElement);
        (window as any).navigator.clipboard.writeText(copyText);
    }
    private handleItemClick(args: ClickEventArgs, index: number): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (args.item as any).controlParent.element.querySelector('.e-assist-dislike');
        if (args.item.prefixIcon === 'e-icons e-assist-copy') {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            this.getClipBoardContent(this.prompts[parseInt(index.toString(), 10)].response);
            args.item.prefixIcon = 'e-icons e-assist-check';
            this.responseToolbarEle.dataBind();
            setTimeout(() => {
                args.item.prefixIcon = 'e-icons e-assist-copy';
                this.responseToolbarEle.dataBind();
            }, 1000);
        }
        const icon: string = args.item.prefixIcon;
        const isLikeInteracted: boolean = icon === 'e-icons e-assist-like-filled' || icon === 'e-icons e-assist-like';
        const isDislikeInteracted: boolean = icon === 'e-icons e-assist-dislike-filled' || icon === 'e-icons e-assist-dislike';
        if (isLikeInteracted || isDislikeInteracted) {
            let isHelpful: boolean | null = null;
            if (isLikeInteracted) {
                isHelpful = this.prompts[parseInt(index.toString(), 10)].isResponseHelpful === true ? null : true;
            } else if (isDislikeInteracted) {
                isHelpful = this.prompts[parseInt(index.toString(), 10)].isResponseHelpful === false ? null : false;
            }
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.prompts[parseInt(index.toString(), 10)].isResponseHelpful = isHelpful;
            const promptItem: PromptModel = this.prompts[parseInt(index.toString(), 10)];
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            const controlParentItems: ItemModel[] = (args.item as any).controlParent.items;
            if (isLikeInteracted) {
                if (promptItem.isResponseHelpful === true) {
                    args.item.prefixIcon = 'e-icons e-assist-like-filled';
                    if (controlParentItems && controlParentItems.length > 2) {
                        controlParentItems[2].prefixIcon = 'e-icons e-assist-dislike';
                    }
                }
                else {
                    args.item.prefixIcon = 'e-icons e-assist-like';
                }
            }
            else if (isDislikeInteracted) {
                if (promptItem.isResponseHelpful === false) {
                    args.item.prefixIcon = 'e-icons e-assist-dislike-filled';
                    if (controlParentItems && controlParentItems.length > 1) {
                        controlParentItems[1].prefixIcon = 'e-icons e-assist-like';
                    }
                }
                else {
                    args.item.prefixIcon = 'e-icons e-assist-dislike';
                }
            }
            this.responseToolbarEle.dataBind();
            this.isProtectedOnChange = prevOnChange;
        }
    }
    private renderPrompt(promptText?: string, promptIndex?: number): void {
        const outputPrompt: HTMLElement = this.createElement('div', { attrs: { class: 'e-prompt-text', tabindex: '0' } });
        const promptContent: HTMLElement = this.createElement('div', { attrs: { class: 'e-prompt-content' } });
        const promptToolbarContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-prompt-toolbar' } });
        const promptToolbar: HTMLElement = this.createElement('div');
        const userIcon: HTMLElement = this.createElement('span', { attrs: { class: this.promptIconCss ? 'e-prompt-icon e-icons '
        + this.promptIconCss : '' } });
        if (this.promptItemTemplate) {
            this.updateContent('promptItemTemplate', this.outputSuggestionEle, promptIndex);
        }
        else {
            outputPrompt.innerHTML = promptText;
            this.appendChildren(promptContent, outputPrompt);
            if (this.promptIconCss) {
                promptContent.appendChild(userIcon);
            }
            this.outputSuggestionEle.append(promptContent);
        }
        this.renderPromptToolbar(promptToolbar, promptIndex);
        promptToolbarContainer.append(promptToolbar);
        this.appendChildren(this.outputSuggestionEle, promptToolbarContainer);
    }

    private renderPromptToolbar(element: HTMLElement, promptIndex?: number): void {
        let pushToolbar: ItemModel[] = [];
        if (this.promptToolbarSettings.items.length === 0) {
            pushToolbar = [
                { prefixIcon: 'e-icons e-assist-edit', tooltipText: 'Edit' },
                { prefixIcon: 'e-icons e-assist-copy', tooltipText: 'Copy' }
            ];
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.promptToolbarSettings.items = [
                { iconCss: 'e-icons e-assist-edit', tooltip: 'Edit' },
                { iconCss: 'e-icons e-assist-copy', tooltip: 'Copy' }
            ];
            this.isProtectedOnChange = prevOnChange;
        }
        else {
            pushToolbar = this.promptToolbarSettings.items.map((item: ToolbarItemModel) => ({
                type: item.type,
                template: item.template,
                disabled: item.disabled,
                cssClass: item.cssClass,
                visible: item.visible,
                tooltipText: item.tooltip,
                prefixIcon: item.iconCss,
                text: item.text,
                align: item.align,
                width: this.promptToolbarSettings.width
            }));
        }
        this.promptToolbarEle = new Toolbar({
            items: pushToolbar,
            clicked: (args: ClickEventArgs) => {
                const eventItemArgs: ToolbarItemModel = {
                    type: args.item.type,
                    text: args.item.text,
                    iconCss: args.item.prefixIcon,
                    cssClass: args.item.cssClass,
                    tooltip: args.item.tooltipText,
                    template: args.item.template as string | Function,
                    disabled: args.item.disabled,
                    visible: args.item.visible,
                    align: args.item.align,
                    tabIndex: args.item.tabIndex
                };
                const eventArgs: ToolbarItemClickedEventArgs = {
                    item: eventItemArgs,
                    event: args.originalEvent,
                    cancel: false,
                    dataIndex: promptIndex
                };
                if (this.promptToolbarSettings.itemClicked) {
                    this.promptToolbarSettings.itemClicked.call(this, eventArgs);
                }
                if (!eventArgs.cancel) {
                    if (args.item.prefixIcon === 'e-icons e-assist-edit') {
                        this.onEditIconClick(promptIndex as number);
                    }
                    if (args.item.prefixIcon === 'e-icons e-assist-copy') {
                        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                        this.getClipBoardContent(this.prompts[parseInt(promptIndex.toString(), 10)].prompt);
                        args.item.prefixIcon = 'e-icons e-assist-check';
                        this.promptToolbarEle.dataBind();
                        setTimeout(() => {
                            args.item.prefixIcon = 'e-icons e-assist-copy';
                            this.promptToolbarEle.dataBind();
                        }, 1000);
                    }
                }
            }
        });
        this.promptToolbarEle.appendTo(element);
        this.promptToolbarEle.element.setAttribute('aria-label', `prompt-toolbar-${promptIndex}`);
    }

    private renderSkeleton(): void {
        this.skeletonContainer = this.createElement('div', { attrs: { class: 'e-output-container' } });
        const outputViewWrapper: HTMLElement = this.createElement('div', { attrs: { class: 'e-output', style : 'width: 70%;' } });
        const skeletonIconEle: HTMLElement = this.createElement('span', { attrs: { class: 'e-output-icon e-skeleton e-skeleton-text e-shimmer-wave' } });
        const skeletonBodyEle: HTMLElement = this.createElement('div', { attrs: { class: 'e-loading-body' } });
        const skeletonFooterEle: HTMLElement = this.createElement('div', { attrs: { class: 'e-loading-footer' } });
        const [skeletonLine1, skeletonLine2, skeletonLine3] = [
            this.createElement('div', { attrs: { class: 'e-skeleton e-skeleton-text e-shimmer-wave', style: 'width: 100%; height: 15px;'} }),
            this.createElement('div', { attrs: { class: 'e-skeleton e-skeleton-text e-shimmer-wave', style: 'width: 75%; height: 15px;'} }),
            this.createElement('div', { attrs: { class: 'e-skeleton e-skeleton-text e-shimmer-wave', style: 'width: 50%; height: 15px;'} })
        ];
        const [footerSkeleton] = [
            this.createElement('div', { attrs: { class: 'e-skeleton e-skeleton-text e-shimmer-wave', style: 'width: 100%; height: 30px;'} })
        ];
        this.appendChildren(skeletonBodyEle, skeletonLine1, skeletonLine2, skeletonLine3);
        skeletonFooterEle.append(footerSkeleton);
        this.appendChildren(outputViewWrapper, skeletonBodyEle, skeletonFooterEle);
        this.appendChildren(this.skeletonContainer, skeletonIconEle, outputViewWrapper);
    }

    private appendChildren(target: HTMLElement, ...children: HTMLElement[]): void {
        target.append(...children);
    }

    private onSuggestionClick(e: Event): void {
        this.suggestions.hidden = true;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.prompt = (e.target as HTMLElement).innerText;
        this.isProtectedOnChange = prevOnChange;
        this.onSendIconClick();
    }

    private onEditIconClick(promptIndex: number): void {
        if (this.textareaObj) {
            if (this.suggestions ) { this.suggestions.hidden = true; }
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.textareaObj.value = this.prompt = this.prompts[parseInt(promptIndex.toString(), 10)].prompt;
            this.updateTextAreaObject(this.textareaObj.value);
            this.textareaObj.focusIn();
            this.isProtectedOnChange = prevOnChange;
            this.activateSendIcon(this.prompt.length);
        }
    }

    private updateIcons(newCss: string, isPromptIconCss: boolean = false): void {
        let elements: NodeListOf<Element>;
        if (this.outputElement) {
            if (isPromptIconCss) {
                newCss = 'e-prompt-icon e-icons ' + newCss;
                elements = this.outputElement.querySelectorAll('.e-prompt-icon');
            }
            else {
                newCss = ' e-output-icon e-icons ' + newCss;
                elements = this.outputElement.querySelectorAll('.e-output-icon');
            }
        }
        for (let index: number = 0; index < (elements && elements.length); index++) {
            removeClass([elements[parseInt(index.toString(), 10)]], elements[parseInt(index.toString(), 10)].classList.toString().trim().split(' '));
            addClass([elements[parseInt(index.toString(), 10)]], newCss.trim().split(' '));
        }
    }

    private updateToolbarHeader(): void {
        if (!this.showHeader) { this.toolbarHeader.hidden = true; }
        else { this.toolbarHeader.hidden = false; }
    }

    private updateToolbarSettings(previousToolbar: ToolbarSettingsModel): void {
        const previousToolbarIndex: number = 0;
        for (let index: number = this.views.length; index < this.toolbarItems.length; index++) {
            if (previousToolbar.items[parseInt(previousToolbarIndex.toString(), 10)] === this.toolbarItems[parseInt(index.toString(), 10)])
            {
                this.toolbarItems.splice(index, 1);
            }
        }
        this.renderToolbarSettings();
        this.toolbar.items = this.toolbarItems;
    }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    private destroyAndNullify(obj: any): void {
        if (obj) {
            obj.destroy();
            obj = null;
        }
    }

    public destroy(): void {
        super.destroy();
        this.unWireEvents();
        this.destroyAndNullify(this.textareaObj);
        this.destroyAndNullify(this.responseToolbarEle);
        this.destroyAndNullify(this.promptToolbarEle);
        this.destroyAndNullify(this.toolbar);

        this.destroyAssistView();
        //private html elements nullify
        remove(this.viewWrapper); this.viewWrapper = null;

        this.aiAssistViewRendered = null;
        this.assistViewTemplateIndex = null;
        this.toolbarItems = [];
        this.displayContents = [];
        this.isOutputRenderingStop = null;
        this.isResponseRequested = null;
        this.suggestionHeader = null;
        this.previousElement = null;
        this.assistCustomSection = null;
        this.preTagElements = [];

        // properties nullify
        this.toolbarSettings = this.promptToolbarSettings = this.responseToolbarSettings = {};
        if (this.cssClass) { removeClass([this.element], this.cssClass.split(' ')); }
        this.element.classList.remove('e-rtl');
    }

    private removeAndNullify(element: HTMLElement): void {
        if (element) {
            if (!isNOU(element.parentNode)) {
                remove(element);
            } else {
                element.innerHTML = '';
            }
        }
    }

    private destroyAssistView(): void {
        const properties: string [] = [
            'toolbarHeader',
            'sendIcon',
            'suggestions',
            'skeletonContainer',
            'outputElement',
            'outputSuggestionEle',
            'contentFooterEle',
            'footer',
            'assistCustomSection',
            'content',
            'stopRespondingContent',
            'stopResponding',
            'contentWrapper'
        ];

        for (const prop of properties) {
            const element: keyof AIAssistView = prop as keyof AIAssistView;
            this.removeAndNullify(this[element as keyof AIAssistView]);
            (this[element as keyof AIAssistView] as HTMLElement) = null;
        }
    }

    /**
     * Executes the specified prompt in the AIAssistView component. The method accepts a string representing the prompt.
     *
     * @param {string} prompt - The prompt text to be executed. It must be a non-empty string.
     *
     * @returns {void}
     */
    public executePrompt(prompt: string): void {
        if (!isNOU(prompt) && prompt.trim().length > 0) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.prompt = prompt;
            this.isProtectedOnChange = prevOnChange;
            this.onSendIconClick();
        }
    }

    /**
     * Adds a response to the last prompt or appends a new Prompt data in the AIAssistView component.
     *
     * @param {string | Object} promptData - The response to be added. Can be a string representing the response or an object containing both the prompt and the response.
     * - If `outputResponse` is a string, it updates the response for the last prompt in the prompts collection.
     * - If `outputResponse` is an Object, it can either update the response of an existing prompt if the prompt matches or append a new Prompt data.
     * @returns {void}
     */
    public addPromptResponse(promptData: string | Object): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (!this.isOutputRenderingStop) {
            if (typeof promptData === 'string') {
                if (!this.isResponseRequested) {
                    this.prompts = [...this.prompts, { prompt: null, response: null, isResponseHelpful: null}];
                }
                this.prompts[this.prompts.length - 1].response = promptData;
                this.renderOutputContainer(undefined, promptData as string, this.prompts.length - 1, false);
            }
            if (typeof promptData === 'object') {
                const tPrompt: { prompt: string, response: string, isResponseHelpful: boolean } = {
                    prompt: (<{ prompt: string }>promptData).prompt,
                    response: (<{ response: string }>promptData).response,
                    isResponseHelpful: isNOU((<{ isResponseHelpful: boolean }>promptData).isResponseHelpful) ? null :
                        (<{ isResponseHelpful: boolean }>promptData).isResponseHelpful
                };
                if (this.prompt === tPrompt.prompt) {
                    this.prompts[this.prompts.length - 1].response = tPrompt.response;
                    this.prompts[this.prompts.length - 1].isResponseHelpful = tPrompt.isResponseHelpful;
                    this.renderOutputContainer(undefined, tPrompt.response, this.prompts.length - 1, false);
                } else {
                    this.prompts = [...this.prompts, tPrompt];
                    this.renderOutputContainer(tPrompt.prompt, tPrompt.response, this.prompts.length - 1, true);
                }
            }
            this.isResponseRequested = false;
        }
        this.isProtectedOnChange = prevOnChange;
    }

    /**
     * Called if any of the property value is changed.
     *
     * @param  {AIAssistViewModel} newProp - Specifies new properties
     * @param  {AIAssistViewModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: AIAssistViewModel, oldProp?: AIAssistViewModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
            case 'height':
                this.setDimension();
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.trim().split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.trim().split(' '));
                }
                break;
            case 'promptIconCss':
                this.updateIcons(newProp.promptIconCss, true);
                break;
            case 'responseIconCss':
                this.updateIcons(newProp.responseIconCss);
                break;
            case 'showHeader':
                this.updateToolbarHeader();
                break;
            case 'promptSuggestions':
                if (this.suggestions) { this.suggestions.remove(); }
                if (!this.isOutputRenderingStop) { this.renderSuggestions(); }
                break;
            case 'showClearButton':
                this.textareaObj.showClearButton = this.showClearButton;
                break;
            case 'promptPlaceholder':
                this.textareaObj.placeholder = this.promptPlaceholder;
                break;
            case 'promptSuggestionsHeader': {
                this.suggestionHeader.innerHTML = this.promptSuggestionsHeader;
                const suggestionHeaderElem: HTMLElement = this.element.querySelector('.e-suggestions .e-suggestion-header');
                if (!suggestionHeaderElem) { this.suggestions.append(this.suggestionHeader); }
                break;
            }
            case 'activeView': {
                const previousViewIndex: number = this.getIndex(oldProp.activeView);
                this.updateActiveView(previousViewIndex);
                break;
            }
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove']('e-rtl');
                break;
            case 'toolbarSettings':
                this.updateToolbarSettings(oldProp.toolbarSettings);
                break;
            case 'promptToolbarSettings':
            case 'responseToolbarSettings':
            case 'prompts':
                if (this.outputElement) { remove(this.outputElement); }
                if (this.stopResponding) { this.stopResponding.classList.remove('e-btn-active'); }
                this.aiAssistViewRendered = false;
                this.renderOutputContent(true);
                this.detachCodeCopyEventHandler();
                break;
            case 'prompt':
                if (!this.footerTemplate) {
                    this.textareaObj.value = this.prompt;
                }
                break;
            case 'locale':
                this.updateStopRespondingTitle();
                break;
            }
        }
    }
}
