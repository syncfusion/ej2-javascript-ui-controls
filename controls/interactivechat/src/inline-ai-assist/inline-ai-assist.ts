// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../ai-assist-base/ai-assist-base-model.d.ts'/>
import { INotifyPropertyChanged, Property, NotifyPropertyChanges, isNullOrUndefined as isNOU, getUniqueID, Event, EmitType, L10n, SanitizeHtmlHelper, BaseEventArgs, Collection, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { CommandSettingsModel, InlineToolbarSettingsModel, InlineAIAssistModel, ResponseSettingsModel, CommandItemModel, ResponseItemModel, PromptResponseModel } from './inline-ai-assist-model';
import { CloseEventArgs, OpenEventArgs, Popup } from '@syncfusion/ej2-popups';
import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';
import { EventHandler, addClass, removeClass, formatUnit } from '@syncfusion/ej2-base';
import { Mention, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { AIAssistBase, ToolbarPosition } from '../ai-assist-base/ai-assist-base';
import { ToolbarItemModel } from '../interactive-chat-base/interactive-chat-base-model';
import { TextState, ToolbarItem } from '../interactive-chat-base/interactive-chat-base';

/**
 * Specifies the mode of inline ai assist.
 */
export enum ResponseMode {
    /**
     * Represents the inline response updates for the component.
     */
    Inline = 'Inline',
    /**
     * Represents a popup based response update for the component.
     */
    Popup = 'Popup'
}

/**
 * Represents the event arguments for a toolbar item click event in the component.
 */
export interface ToolbarItemClickEventArgs extends BaseEventArgs {
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
     * Specifies the index of the message data associated with the toolbar item click event.
     * This property is not applicable for header toolbar item click.
     *
     * @type {number}
     * @default -1
     */
    dataIndex?: number
}

/**
 * Represents the event arguments for a Command item click event in the Inline AI Assist component.
 */
export interface CommandItemSelectEventArgs extends BaseEventArgs {
    /**
     * Specifies the command item that was clicked.
     *
     * @type {CommandItemModel}
     * @default null
     */
    command: CommandItemModel;

    /**
     * Specifies the HTML element associated with the clicked command item.
     *
     * @type {HTMLElement}
     * @default null
     *
     */
    element: HTMLElement

    /**
     * Specifies the native browser event associated with the command item click.
     *
     * @type {Event}
     * @default null
     *
     */
    event: Event

    /**
     * Specifies whether the event should be canceled. `true` to prevent the default click action.
     *
     * @type {boolean}
     * @default false
     *
     */
    cancel: boolean
}

/**
 * Represents the event arguments for a response item click event in the InlineAIAssist component.
 */
export interface ResponseItemSelectEventArgs extends BaseEventArgs {
    /**
     * Specifies the command item that was clicked.
     *
     * @type {CommandItemModel}
     * @default null
     */
    command: CommandItemModel;

    /**
     * Specifies the HTML element associated with the clicked command item.
     *
     * @type {HTMLElement}
     * @default null
     *
     */
    element: HTMLElement

    /**
     * Specifies the native browser event associated with the command item click.
     *
     * @type {Event}
     * @default null
     *
     */
    event: Event

    /**
     * Specifies whether the event should be canceled. `true` to prevent the default click action.
     *
     * @type {boolean}
     * @default false
     *
     */
    cancel: boolean
}

/**
 * Represents the event arguments for a prompt request in the InlineAIAssist component.
 */
export interface InlinePromptRequestEventArgs extends BaseEventArgs {
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
     * Specifies the text of the prompt request.
     *
     * @type {string}
     * @default ''
     *
     */
    prompt?: string
}

/**
 * Represents a model for a prompt and its associated response in the Inline AI Assist component.
 */
export class PromptResponse extends ChildProperty<PromptResponse> {
    /**
     * Specifies the prompt text for this item in the prompts collection.
     * Specifies the user-entered instruction or question to be processed.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public prompt: string;

    /**
     * Specifies the response associated with the corresponding prompt.
     * Specifies the AI-generated text (plain or Markdown) returned after processing.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public response: string;
}

/**
 * Represents a command item model in the inline AI assist component.
 */
export class CommandItem  extends ChildProperty<CommandItem> {

    /**
     * Specifies the unique identifier of the command item.
     * This ID can be used for referencing specific commands programmatically.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies whether the command item is disabled.
     * When set to true, the command item will be unavailable for selection and execution.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * This allows for styling and representation of icons that are visually linked with the item.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the display label for the command item.
     * This text is shown in the command menu for the user to identify the command.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Specifies the prompt or command text sent to the AI service when selected.
     * Specifies that prompts are resolved from captured context before sending.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public prompt: string;

    /**
     * Specifies the header text for the command item.
     * This provides a descriptive title or label for the item group.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public groupBy: string;

    /**
     * Specifies the title of the item.
     * This serves as the primary label or heading, providing a brief description of the item's purpose.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public tooltip: string;
}

/**
 * Represents a response item model in the inline AI assist component.
 */
export class ResponseItem  extends ChildProperty<ResponseItem> {

    /**
     * Specifies the unique identifier of the response item.
     * This ID can be used for referencing specific response item programmatically.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies whether the response item is disabled.
     * When set to `true`, the response item will be unavailable for selection and execution.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * This allows for styling and representation of icons that are visually linked with the item.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the display label for the response item.
     * This text is shown in the response menu for the user to identify the response.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Specifies the header text for the response item.
     * This provides a descriptive title or label for the item group.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public groupBy: string;

    /**
     * Specifies the title of the item.
     * This serves as the primary label or heading, providing a brief description of the item's purpose.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public tooltip: string;
}

/**
 * Represents the settings for the command options in the InlineAIAssist component.
 */
export class CommandSettings extends ChildProperty<CommandSettings> {

    /**
     * Triggers when a command item is selected in the command menu popup.
     * Use this event to apply the command, modify the prompt, or cancel default behavior.
     *
     * @event itemSelect
     */
    @Event()
    public itemSelect: EmitType<CommandItemSelectEventArgs>;

    /**
     * Specifies the collection of command items displayed in the command menu.
     * Specifies the items shown for quick selection in the prompt toolbar.
     *
     * @type {CommandItemModel[]}
     * @default []
     */
    @Collection<CommandItemModel>([], CommandItem)
    public commands: CommandItemModel[];

    /**
     * Specifies the height of the command menu popup.
     * Specifies a CSS height value such as 'auto', '240px', or '50%'.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public popupHeight: string

    /**
     * SSpecifies the width of the command menu popup.
     * Specifies a CSS width value such as '320px' or '40%'.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public popupWidth: string
}

/**
 * Represents the settings for the response toolbar in the InlineAIAssist component.
 */
export class ResponseSettings extends ChildProperty<ResponseSettings> {

    /**
     * Triggers when a toolbar item is clicked in the response toolbar.
     * Use this event to handle the action, update UI, or cancel default behavior.
     *
     * @event itemSelect
     */
    @Event()
    public itemSelect: EmitType<ResponseItemSelectEventArgs>;

    /**
     * Specifies the collection of toolbar items rendered in the response toolbar.
     * Specifies an array of ResponseItemModel objects for customization and interaction.
     *
     * @type {ResponseItemModel[]}
     * @default null
     */
    @Collection<ResponseItemModel>([], ResponseItem)
    public items: ResponseItemModel[];
}

/**
 * Represents the settings for the response toolbar in the InlineAIAssist component.
 */
export class InlineToolbarSettings extends ChildProperty<InlineToolbarSettings> {

    /**
     * Specifies the position of the footer toolbar in the editor.
     * This property determines whether the toolbar is rendered inline with the content or at the bottom of the edit area.
     *
     * @isenumeration true
     * @default ToolbarPosition.Inline
     * @asptype ToolbarPosition
     */
    @Property('Inline')
    public toolbarPosition: ToolbarPosition | string;

    /**
     * Specifies the collection of toolbar items rendered in the response toolbar.
     * Specifies an array of ToolbarItemModel objects used for customization and interaction.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Triggers when a toolbar item is clicked in the response toolbar.
     * Use this event to handle the action, update UI, or cancel default behavior.
     *
     * @event itemClick
     */
    @Event()
    public itemClick: EmitType<ToolbarItemClickEventArgs>;
}

@NotifyPropertyChanges
export class InlineAIAssist extends AIAssistBase implements INotifyPropertyChanged {

    /**
     * Specifies the element or CSS selector where the InlineAIAssist will be appended.
     * Accepts either a CSS selector string (e.g., '.container' or '#id') or an HTMLElement.
     * Defaults to document.body.
     *
     * @type {string | HTMLElement}
     * @default 'body'
     */
    @Property('body')
    public target: string | HTMLElement;

    /**
     * Specifies the element relative to which the InlineAIAssist popup is positioned.
     * Accepts a CSS selector string (e.g., '#id' or '.class') or an HTMLElement.
     *
     * @type {string | HTMLElement}
     * @default ''
     */
    @Property('')
    public relateTo: string | HTMLElement;

    /**
     * Specifies how the AI response is displayed.
     * 'Inline' renders at the caret position; 'Popup' shows above the prompt.
     *
     * @isenumeration true
     * @default ResponseMode.Popup
     * @asptype ResponseMode
     */
    @Property('Popup')
    public responseMode: ResponseMode | string;

    /**
     * Specifies one or more custom CSS class names for the root element of the component.
     * Specifies multiple classes as a space-separated list.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the current text value of the prompt input field.
     * Specifies the content that will be used to generate the AI response.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public prompt: string;

    /**
     * Specifies the collection of prompts and their corresponding responses.
     * Specifies an array of PromptModel objects used to render the history.
     *
     * @type {PromptResponseModel[]}
     * @default []
     */
    @Collection<PromptResponseModel>([], PromptResponse)
    public prompts: PromptResponseModel[];

    /**
     * Specifies the placeholder text displayed when the prompt input is empty.
     *  Specifies helper text to guide the user on what to ask or generate.
     *
     * @type {string}
     * @default 'Ask or generate AI content..'
     */
    @Property('Ask or generate AI content..')
    public placeholder: string;

    /**
     * Specifies the locale code used for UI text localization.
     * Specifies culture codes such as 'en-US' or 'ta-IN'.
     *
     * @type {string}
     * @default 'en-US'
     */
    @Property('en-US')
    public locale: string;

    /**
     * Specifies the height of the popup container.
     * Specifies a value in CSS units (px, %, rem, vh, etc.) or a number in pixels.
     *
     * @type {string | number}
     * @default 'auto'
     * @aspType string
     */
    @Property('auto')
    public popupHeight: string | number;

    /**
     * Specifies the width of the popup container.
     * Specifies a value in CSS units (px, %, rem, vw, etc.) or a number in pixels.
     *
     * @type {string | number}
     * @default '400px'
     * @aspType string
     */
    @Property('400px')
    public popupWidth: string | number;

    /**
     * Specifies the configuration for available AI commands and suggestions.
     * Specifies options such as enabling/disabling commands and customizing suggestion behavior.
     *
     * @type {CommandSettingsModel | null}
     * @default null
     */
    @Complex<CommandSettingsModel>({commands: [], popupHeight: '', popupWidth: '' }, CommandSettings)
    public commandSettings: CommandSettingsModel;

    /**
     * Specifies the configuration for the toolbar displayed with the generated response.
     * Specifies buttons, actions, and behaviors applied to the response area.
     *
     * @type {ResponseSettingsModel | null}
     * @default null
     */
    @Complex<ResponseSettingsModel>({items: []}, ResponseSettings)
    public responseSettings: ResponseSettingsModel;

    /**
     * Specifies the configuration for the toolbar displayed in the inline prompt input.
     * Specifies buttons, shortcuts, and behaviors available while composing the prompt.
     *
     * @type {InlineToolbarSettingsModel | null}
     * @default null
     */
    @Complex<InlineToolbarSettingsModel>({toolbarPosition: 'Inline', items: [] }, InlineToolbarSettings)
    public inlineToolbarSettings: InlineToolbarSettingsModel;

    /**
     * Specifies a custom template (string or function) for rendering AI-generated response content.
     * Specifies that a function receives a ResponseTemplateContext and returns markup or text.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public responseTemplate: string | Function;

    /**
     * Specifies a custom template (string or function) for rendering the prompt input area.
     * Specifies a string template or a function that returns the editor UI markup.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public editorTemplate: string | Function;

    /**
     * Specifies the z-index value applied to the popup or overlay layer.
     * Specifies a higher value to ensure the component appears above surrounding UI.
     *
     * @type {number}
     * @default 1000
     */
    @Property(1000)
    public zIndex: number;

    /**
     * Specifies whether right-to-left (RTL) text direction is enabled for the component.
     * Specifies true to render UI elements and text in RTL layout.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Triggers when the user submits a prompt by pressing Enter or clicking Generate.
     * Use this event to perform the AI request, update UI, or cancel the default processing.
     *
     * @event promptRequest
     */
    @Event()
    public promptRequest: EmitType<InlinePromptRequestEventArgs>;

    /**
     * Triggers when the popup or inline response area becomes visible.
     * Use this event to set focus, measure layout, or run analytics.
     *
     * @event open
     */
    @Event()
    public open: EmitType<OpenEventArgs>;

    /**
     * Triggers when the popup or inline response area is closed or hidden.
     * Occurs on cancel, Escape key, outside click, or after response insertion.
     *
     * @event close
     */
    @Event()
    public close: EmitType<CloseEventArgs>;

    private popupObj: Popup;
    private footerToolbarEle: Toolbar;
    private responseContainer: HTMLElement;
    private contentWrapper: HTMLElement;
    private l10n: L10n;
    private sendToolbarItem: ItemModel = null;
    private isResponseRequested: boolean = false;
    private responseContainerCreated: boolean = false;
    private targetEl: HTMLElement;
    private relateToEl: HTMLElement;
    private isStopRequested: boolean = false;
    private mentionPopupObj: Mention;
    private commandOptionsData: any[] = [];
    private responseOptionsData: any[] = [];
    private skeletonContainer: HTMLElement;
    private hasResponse: boolean;
    private typingIndicatorEl: HTMLElement = null;

    /**
     * Constructor for creating the component
     *
     * @param {InlineAIAssistModel} options - Specifies the InlineAIAssistModel.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: InlineAIAssistModel, element?: string | HTMLElement) {
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
        return 'EJS-INLINEAIASSIST';
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'inlineaiassist';
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

    /**
     * Renders the component
     *
     * @returns {void}
     */
    protected render(): void {
        this.initializeLocale();
        // Ensure target element is resolved before creating the popup
        this.resolveTargetElement();
        this.resolveRelateToElement();
        this.renderPopup();
        this.addRtlClass(this.element, this.enableRtl);
        this.wireEvents();
    }

    private initializeLocale(): void {
        this.l10n = new L10n('inline-ai-assist', {
            stopResponseText: 'Stop Responding',
            send: 'Send',
            thinkingIndicator: 'Thinking',
            editingIndicator: 'Editing'
        }, this.locale);
        this.l10n.setLocale(this.locale);
    }

    private renderPopup(): void {
        this.element.classList.add('e-inline-ai-assist');
        if (this.cssClass) {
            this.element.classList.add(this.cssClass);
        }
        this.contentWrapper = this.createElement('div', { className: 'e-inline-assist-container' });
        const content: HTMLElement = this.createElement('div', {className: 'e-content'});
        this.contentWrapper.appendChild(content);
        this.footer = this.createElement('div', { className: 'e-footer' });
        this.updateFooterClass(this.editorTemplate);
        this.renderInlineFooter();
        this.contentWrapper.appendChild(this.footer);
        this.element.appendChild(this.contentWrapper);
        if (this.targetEl && this.targetEl !== document.body) {
            this.targetEl.appendChild(this.element);
        }

        this.popupObj = new Popup(this.element, {
            height: this.popupHeight ? formatUnit(this.popupHeight) : 'auto',
            width: this.popupWidth ? formatUnit(this.popupWidth) : '400px',
            relateTo: this.relateToEl,
            position: { X: 'left', Y: 'bottom' },
            collision: {X: 'flip', Y: 'flip'},
            targetType: 'relative',
            close: () => {
                this.trigger('close', {});
                this.onPopupClose();
            },
            open: () => {
                this.trigger('open', {});
                this.attachPopupEventHandlers();
            },
            zIndex: this.zIndex
        });
        this.popupObj.hide();
    }

    private showPopupWithData(dataSource: any[], width: string = '200px', height: string = '400px'): void {
        this.mentionPopupObj.dataSource = dataSource;
        this.mentionPopupObj.popupWidth = width;
        this.mentionPopupObj.popupHeight = height;
        this.mentionPopupObj.dataBind();
        this.mentionPopupObj.showPopup();
    }

    private showResponsePopup(): void {
        if (this.popupObj.element.classList.contains('e-popup-open')) {
            this.showPopupWithData(this.responseOptionsData, 'auto', '400px');
        }
    }

    private showCommandMenuPopup(): void {
        this.showPopupWithData(this.commandOptionsData, this.commandSettings.popupWidth || '200px', this.commandSettings.popupHeight || '400px');
    }

    private setCommandPopupData(): void {
        this.commandOptionsData = this.commandSettings.commands.map((cmd: CommandItemModel) => ({
            label: cmd.label,
            iconCss: cmd.iconCss,
            id: cmd.id,
            disabled: cmd.disabled,
            groupBy: cmd.groupBy,
            tooltip: cmd.tooltip
        }));
    }

    private setResponsePopupData(): void {
        const acceptItem: CommandItemModel = {
            label: 'Accept',
            iconCss: 'e-icons e-inline-accept'
        };
        const rejectItem: CommandItemModel = {
            label: 'Discard',
            iconCss: 'e-icons e-inline-discard'
        };
        let mentionDataSource: any[] = [acceptItem, rejectItem];
        if (this.responseSettings.items && this.responseSettings.items.length > 0) {
            const customItems: any[] = this.responseSettings.items.map((item: CommandItemModel) => ({
                label: item.label,
                iconCss: item.iconCss,
                id: item.id,
                groupBy: item.groupBy,
                disabled: item.disabled,
                tooltip: item.tooltip
            }));
            mentionDataSource = [...mentionDataSource, ...customItems];
        }
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.responseSettings.items = mentionDataSource;
        this.isProtectedOnChange = prevOnChange;
        this.responseOptionsData = mentionDataSource;
    }

    private renderMentionPopup(): void {
        const mentionEl: HTMLElement = this.createElement('div', { attrs: { class: 'e-mention-container' } });
        this.element.appendChild(mentionEl);
        if (this.commandSettings.commands) {
            this.setCommandPopupData();
        }
        this.setResponsePopupData();
        let mentionDataSource: any[] = this.responseOptionsData;
        if (this.commandSettings.commands.length > 0) {
            mentionDataSource = this.commandOptionsData;
        }
        this.mentionPopupObj = new Mention({
            mentionChar: '',
            target: this.editableTextarea,
            dataSource: mentionDataSource,
            fields: { text: 'label', iconCss: 'iconCss' },
            popupWidth: this.commandSettings.commands.length > 0 ? this.commandSettings.popupWidth : '200px',
            popupHeight: this.commandSettings.commands.length > 0 ? this.commandSettings.popupHeight : '400px',
            select: (args: SelectEventArgs) => {
                args.cancel = true;
                this.onMentionCommandSelect(args);
            },
            locale: this.locale,
            opened: () => {
                this.positionMentionPopup();
            }
        }, mentionEl);
    }

    private positionMentionPopup(): void {
        if (this.mentionPopupObj) {
            const mainPopupElement: HTMLElement = this.popupObj.element;
            const mainRect: DOMRect = mainPopupElement.getBoundingClientRect() as DOMRect;
            const popupObj: Popup = (this.mentionPopupObj as any).popupObj as Popup;
            if (popupObj && this.element) {
                popupObj.actionOnScroll = 'reposition';
                popupObj.offsetX = 0;
                popupObj.offsetY = mainRect.height;
                popupObj.position = { X: 'left', Y: 'top' };
                popupObj.relateTo = this.element;
                popupObj.targetType = 'relative';
                popupObj.collision = { X: 'flip', Y: 'flip' };
                popupObj.refreshPosition();
                this.mentionPopupObj.element.style.display = 'block';
                this.mentionPopupObj.element.style.display = '';
            }
        }
    }

    private onMentionCommandSelect(args: SelectEventArgs): void {
        const selectedItem: any = args.itemData;
        const matchedCommand: CommandItemModel = this.commandSettings.commands.find(
            (cmd: CommandItemModel) => cmd.label === selectedItem.label
        );

        if (matchedCommand) {
            const commandItemSelectEventArgs: CommandItemSelectEventArgs = {
                command: selectedItem,
                event: args.e as Event,
                cancel: false,
                element: args.item
            };
            if (this.commandSettings.itemSelect) {
                this.commandSettings.itemSelect.call(this, commandItemSelectEventArgs);
            }
            if (!commandItemSelectEventArgs.cancel && matchedCommand.prompt) {
                this.executePrompt(matchedCommand.prompt);
            }
        } else {
            const responseItemSelectEventArgs: ResponseItemSelectEventArgs = {
                command: selectedItem,
                event: args.e as Event,
                cancel: false,
                element: args.item
            };
            if (this.responseSettings.itemSelect) {
                this.responseSettings.itemSelect.call(this, responseItemSelectEventArgs);
            }
        }
        this.mentionPopupObj.hidePopup();
    }

    private resolveTargetElement(): void {
        this.targetEl = typeof this.target === 'string'
            ? (document.querySelector(this.target) as HTMLElement)
            : this.target instanceof HTMLElement ? this.target : document.body;
    }

    private resolveRelateToElement(): void {
        if (this.relateTo === '' || isNOU(this.relateTo)) {
            return;
        }
        this.relateToEl = (typeof this.relateTo === 'string'
            ? document.querySelector(this.relateTo)
            : this.relateTo) as HTMLElement;
    }

    private onPopupClose(): void {
        this.clearResponses();
        this.isResponseRequested = false;
        this.toggleStopRespondingButton(false);
        if (this.editableTextarea) {
            this.editableTextarea.setAttribute('contenteditable', 'true');
        }
        this.detachPopupEventHandlers();
        if (this.mentionPopupObj && (this.mentionPopupObj as any).element) {
            (this.mentionPopupObj as any).hidePopup();
        }
    }

    private renderInlineFooter(): void {
        const textareaAndIconsWrapper: HTMLElement = this.createElement('div', { attrs: { class: 'e-textarea-icons-wrapper' } });
        if (this.editorTemplate) {
            this.updateContent(this.editorTemplate, this.footer, {}, 'editorTemplate');
        } else {
            this.editableTextarea = this.createElement('div', {
                attrs: {
                    class: 'e-assist-textarea',
                    contenteditable: 'true',
                    placeholder: this.placeholder,
                    role: 'textbox',
                    'aria-multiline': 'true'
                },
                innerHTML: this.prompt
            });
            const hiddenTextarea: HTMLTextAreaElement = this.createElement('textarea', {
                attrs: {
                    class: 'e-hidden-textarea',
                    name: 'userPrompt',
                    value: this.prompt
                }
            }) as HTMLTextAreaElement;
            textareaAndIconsWrapper.appendChild(this.editableTextarea);
            textareaAndIconsWrapper.appendChild(hiddenTextarea);
            const footerIconsWrapper: HTMLElement = this.createElement('div', { attrs: { class: 'e-footer-icons-wrapper' } });
            this.renderFooterToolbar(footerIconsWrapper);
            textareaAndIconsWrapper.appendChild(footerIconsWrapper);
            this.footer.appendChild(textareaAndIconsWrapper);
            this.footer.classList.add('e-footer-focus-wave-effect');
            this.refreshTextareaUI();
            this.pushToUndoStack(this.prompt);
            EventHandler.add(this.editableTextarea, 'keyup', this.keyUpHandler, this);
            this.editableTextarea.addEventListener('keydown', this.keyDownHandler.bind(this), true);
            this.renderMentionPopup();
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.shiftKey && e.key === 'Enter') {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }

    private updateEditorTemplate(): void {
        this.footer.innerHTML = '';
        this.updateFooterClass(this.editorTemplate);
        this.renderInlineFooter();
    }

    private renderFooterToolbar(container: HTMLElement): void {
        const toolbarItems: ItemModel[] = [];
        const customItems: ToolbarItemModel[] = this.inlineToolbarSettings.items || [];

        for (const customItem of customItems) {
            const mappedItem: ItemModel = {
                type: customItem.type,
                template: customItem.template,
                disabled: customItem.disabled,
                cssClass: customItem.cssClass,
                visible: customItem.visible,
                tooltipText: customItem.tooltip,
                prefixIcon: customItem.iconCss,
                text: customItem.text,
                align: customItem.align,
                tabIndex: customItem.tabIndex
            };
            toolbarItems.push(mappedItem);
        }

        if (!this.isDuplicatedItem('e-icons e-inline-send', toolbarItems)) {
            this.sendToolbarItem = {
                prefixIcon: 'e-icons e-inline-send',
                align: 'Right'
            };
            toolbarItems.push(this.sendToolbarItem);
        }

        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        const footerToolbarItems: ToolbarItemModel[] = toolbarItems.map((item: ItemModel) => ({
            type: item.type,
            text: item.text,
            iconCss: item.prefixIcon,
            cssClass: item.cssClass,
            tooltip: item.tooltipText,
            template: item.template as string | Function,
            disabled: item.disabled,
            visible: item.visible,
            align: item.align,
            tabIndex: item.tabIndex
        }));
        this.inlineToolbarSettings.items = footerToolbarItems;
        this.isProtectedOnChange = prevOnChange;

        this.footerToolbarEle = new Toolbar({
            items: toolbarItems,
            enableRtl: this.enableRtl,
            width: '100%',
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
                const eventArgs: ToolbarItemClickEventArgs = {
                    item: eventItemArgs,
                    event: args.originalEvent,
                    cancel: false
                };
                if (this.inlineToolbarSettings.itemClick) {
                    this.inlineToolbarSettings.itemClick.call(this, eventArgs);
                }
                if (!eventArgs.cancel) {
                    switch (args.item.prefixIcon) {
                    case 'e-icons e-inline-send':
                        if (!this.isResponseRequested && !args.item.disabled) {
                            this.onSendIconClick();
                        }
                        break;
                    case 'e-icons e-inline-stop':
                        if (this.isResponseRequested) {
                            this.respondingStopper();
                        }
                        break;
                    }
                }
            }
        });

        const toolbarContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-footer-toolbar-wrapper' } });
        this.footerToolbarEle.appendTo(toolbarContainer);
        this.footerToolbarEle.element.setAttribute('aria-label', 'assist-footer-toolbar');
        container.appendChild(toolbarContainer);
    }

    private isDuplicatedItem(iconCss: string, toolbarItems: ItemModel[]): boolean {
        for (const item of toolbarItems) {
            if ((item.prefixIcon || '') === iconCss) {
                switch (iconCss) {
                case 'e-icons e-inline-send':
                    this.sendToolbarItem = item;
                    break;
                }
                return true;
            }
        }
        return false;
    }

    private keyUpHandler(e: KeyboardEvent): void {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    private wireEvents(): void {
        this.wireFooterEvents(this.editorTemplate);
        // Ensure editableTextarea and footer are available in the DOM
        if (this.editableTextarea && this.footer) {
            const footerIconsWrapper: HTMLElement = this.footer.querySelector('.e-footer-icons-wrapper') as HTMLElement;
            if (footerIconsWrapper) {
                EventHandler.add(footerIconsWrapper, 'pointerdown', this.onFooterIconsPointerDown, this);
                // Optional fallback for environments without Pointer Events
                EventHandler.add(footerIconsWrapper, 'click', this.onFooterIconsClick, this);
                EventHandler.add(footerIconsWrapper, 'focusout', this.onFooterIconsFocusOut, this);
            }
        }
    }

    private unWireEvents(): void {
        this.unWireFooterEvents(this.editorTemplate);
        if (this.editableTextarea) {
            EventHandler.remove(this.editableTextarea, 'keyup', this.keyUpHandler);
            this.editableTextarea.removeEventListener('keydown', this.keyDownHandler.bind(this), true);
            const footerIconsWrapper: HTMLElement = this.footer.querySelector('.e-footer-icons-wrapper') as HTMLElement;
            if (footerIconsWrapper) {
                EventHandler.remove(footerIconsWrapper, 'pointerdown', this.onFooterIconsPointerDown);
                EventHandler.remove(footerIconsWrapper, 'click', this.onFooterIconsClick);
                EventHandler.remove(footerIconsWrapper, 'focusout', this.onFooterIconsFocusOut);
            }
        }
    }

    private attachPopupEventHandlers(): void {
        EventHandler.add(document, 'keydown', this.onPopupKeyDown, this);
        EventHandler.add(document, 'mousedown', this.onPopupOutsideClick, this);
    }

    private detachPopupEventHandlers(): void {
        EventHandler.remove(document, 'keydown', this.onPopupKeyDown);
        EventHandler.remove(document, 'mousedown', this.onPopupOutsideClick);
    }

    private onPopupKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.popupObj && this.popupObj.element.offsetParent !== null) {
            e.preventDefault();
            this.hidePopup();
        }
    }

    private onPopupOutsideClick(e: MouseEvent): void {
        e.stopImmediatePropagation();
        if (!this.popupObj || this.popupObj.element.offsetParent === null) {
            return;
        }
        const target: HTMLElement = e.target as HTMLElement;
        const popupElement: HTMLElement = this.popupObj.element;
        if (this.mentionPopupObj && (this.mentionPopupObj as any).element) {
            const mentionPopupElement: HTMLElement = (this.mentionPopupObj as any).element as HTMLElement;
            if (mentionPopupElement.contains(target)) {
                return;
            }
        }
        if (!popupElement.contains(target)) {
            this.hidePopup();
        }
    }

    private handleInput(event: Event): void {
        const textareaEle: HTMLDivElement = event.target as HTMLDivElement;
        const isEmpty: boolean = textareaEle.innerHTML === '<br>';
        if (isEmpty) {
            this.clearBreakTags(textareaEle);
        }
        const textContent: string = textareaEle.innerHTML;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.prompt = SanitizeHtmlHelper.sanitize(textContent);
        this.isProtectedOnChange = prevOnChange;
        this.refreshTextareaUI();
        this.scheduleUndoPush();
        this.redoStack = [];
        if (this.prompt && this.prompt.trim().length > 0) {
            this.hideCommandPopup();
        } else {
            if (this.commandSettings.commands && this.commandSettings.commands.length > 0 && !this.hasResponse) {
                this.showCommandMenuPopup();
            }
        }
    }

    private onFocusEditableTextarea(): void {
        if (this.footer) {
            this.footer.classList.add('e-footer-focused');
        }
    }

    private onBlurEditableTextarea(): void {
        if (this.footer) {
            this.footer.classList.remove('e-footer-focused');
        }
    }

    private showTypingIndicator(text: string): void {
        if (!this.editableTextarea) { return; }
        this.editableTextarea.setAttribute('contenteditable', 'false');
        this.editableTextarea.classList.add('e-response-indicator-active');
        if (!this.typingIndicatorEl) {
            this.typingIndicatorEl = this.createElement('span', { className: 'e-response-indicator' });
        }
        this.typingIndicatorEl.innerHTML =
            '<span class="e-indicator-text">' + text + '</span>' +
            '<span class="e-indicator"></span>' +
            '<span class="e-indicator"></span>' +
            '<span class="e-indicator"></span>';
        this.editableTextarea.innerHTML = '';
        this.editableTextarea.appendChild(this.typingIndicatorEl);
    }

    private hideTypingIndicator(): void {
        if (!this.editableTextarea) { return; }
        this.editableTextarea.setAttribute('contenteditable', 'true');
        this.editableTextarea.classList.remove('e-typing-indicator-active');
        if (this.typingIndicatorEl && this.typingIndicatorEl.parentElement === this.editableTextarea) {
            this.editableTextarea.removeChild(this.typingIndicatorEl);
        }
        this.editableTextarea.innerHTML = '';
    }

    private onSendIconClick(): void {
        if (this.isResponseRequested || !this.prompt.trim()) {
            return;
        }
        this.isResponseRequested = true;
        this.isStopRequested = false;
        this.hasResponse = false;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.clearResponses();
        this.toggleStopRespondingButton(true);
        if (this.responseMode.toLowerCase() === 'inline') {
            this.showTypingIndicator(this.l10n.getConstant('thinkingIndicator'));
        } else {
            this.responseContainerCreated = false;
            this.createResponseContainer();
            this.renderSkeleton();
            if (this.responseContainer && this.skeletonContainer) {
                this.responseContainer.appendChild(this.skeletonContainer);
            }
        }
        const eventArgs: InlinePromptRequestEventArgs = {
            cancel: false,
            prompt: this.prompt
        };
        if (!this.editorTemplate) {
            this.isProtectedOnChange = true;
            if (this.responseMode.toLowerCase() !== 'inline') {
                this.editableTextarea.innerText = '';
            }
            this.isProtectedOnChange = prevOnChange;
            this.pushToUndoStack('');
            this.refreshTextareaUI();
        }
        this.trigger('promptRequest', eventArgs);
    }

    private respondingStopper(): void {
        this.isResponseRequested = false;
        this.isStopRequested = true;
        let hasGeneratedResponse: boolean = false;
        if (this.responseMode.toLowerCase() === 'inline') {
            this.hideTypingIndicator();
            hasGeneratedResponse = this.hasResponse;
        } else {
            this.removeSkeleton();
            const responseTextElement: HTMLElement = this.element.querySelector('.e-response-text');
            if (responseTextElement && responseTextElement.innerText && responseTextElement.innerText.trim().length > 0) {
                hasGeneratedResponse = true;
            }
        }
        this.toggleStopRespondingButton(false);
        if (hasGeneratedResponse) {
            this.showResponsePopup();
        }
    }

    private createResponseContainer(): void {
        if (!this.responseContainerCreated) {
            this.responseContainer = this.createElement('div', {className: `e-output-container ${this.responseTemplate ? 'e-response-item-template' : ''}`});
            const responseText: HTMLElement = this.createElement('div', { className: 'e-response-text' });
            this.responseContainer.appendChild(responseText);
            const content: HTMLElement = this.element.querySelector('.e-content');
            if (content) {
                content.appendChild(this.responseContainer);
            }
            this.responseContainerCreated = true;
        }
    }

    private renderSkeleton(): void {
        this.skeletonContainer = this.createElement('div', { className: 'e-output-container' });
        const outputViewWrapper: HTMLElement = this.createElement('div', { className: 'e-output', styles: 'width: 70%;' });
        const skeletonIconEle: HTMLElement = this.createElement('span', { className: 'e-output-icon e-skeleton e-skeleton-text e-shimmer-wave' });
        const skeletonBodyEle: HTMLElement = this.createElement('div', { className: 'e-loading-body' });
        const [skeletonLine1, skeletonLine2, skeletonLine3] = [
            this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave', styles: 'width: 100%; height: 15px;' }),
            this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave', styles: 'width: 75%; height: 15px;' }),
            this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave', styles: 'width: 50%; height: 15px;' })
        ];
        skeletonBodyEle.append(skeletonLine1, skeletonLine2, skeletonLine3);
        outputViewWrapper.append(skeletonBodyEle);
        this.skeletonContainer.append(skeletonIconEle, outputViewWrapper);
    }

    private removeSkeleton(): void {
        if (this.responseContainer && this.responseContainer.querySelector('.e-skeleton')) {
            this.skeletonContainer.remove();
        }
    }

    private applyPromptChange(newState: TextState, oldState: TextState, event: KeyboardEvent): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.prompt = this.editableTextarea.innerHTML = newState.content;
        this.isProtectedOnChange = prevOnChange;
        this.refreshTextareaUI();
        this.setCursorPosition(newState.selectionStart, newState.selectionEnd);
    }

    private refreshTextareaUI(): void {
        this.updateHiddenTextarea(this.prompt);
        this.checkAndActivateSendIcon();
        this.updateFooterElementClass();
        this.updateFooterType(this.inlineToolbarSettings.toolbarPosition);
    }

    private checkAndActivateSendIcon(): void {
        if (!this.footerToolbarEle) { return; }
        const length: number = this.editableTextarea.innerText.length;
        if (this.sendToolbarItem && this.sendToolbarItem.prefixIcon === 'e-icons e-inline-send') {
            const sendItem: HTMLElement = this.footerToolbarEle.element.querySelector('.e-inline-send') as HTMLElement;
            if (sendItem) {
                if (length > 0 && !this.isResponseRequested) {
                    removeClass([sendItem], 'disabled');
                    sendItem.setAttribute('title', this.l10n.getConstant('send'));
                } else {
                    addClass([sendItem], 'disabled');
                }
            }
        }
    }

    private toggleStopRespondingButton(show: boolean): void {
        const sendIconClass: string = 'e-inline-send';
        const stopIconClass: string = 'e-inline-stop';
        const stopTooltip: string = this.l10n.getConstant('stopResponseText');
        if (!this.editorTemplate) {
            const currentIconClass: string = show ? sendIconClass : stopIconClass;
            const newIconClass: string = show ? stopIconClass : sendIconClass;
            const currentItem: ItemModel = this.footerToolbarEle.items.find((item: ItemModel) => item.prefixIcon === `e-icons ${currentIconClass}`);
            const itemIndex: number = this.footerToolbarEle.items.indexOf(currentItem);
            const currentToolbarItemElement: HTMLElement = this.footerToolbarEle.element.querySelector(`.e-tbar-btn .${currentIconClass}`) ?
                this.footerToolbarEle.element.querySelector(`.e-tbar-btn .${currentIconClass}`).closest('.e-toolbar-item') as HTMLElement : null;
            if (itemIndex !== -1 && currentItem && currentToolbarItemElement) {
                const newItem: ItemModel = {
                    prefixIcon: `e-icons ${newIconClass}`,
                    align: 'Right',
                    tooltipText: show ? stopTooltip : undefined
                };
                this.footerToolbarEle.addItems([newItem], itemIndex);
                this.footerToolbarEle.removeItems(currentToolbarItemElement);
            }
            this.refreshTextareaUI();
        } else {
            const currentIcon: HTMLElement = this.footer.querySelector(`.${show ? sendIconClass : stopIconClass}`) as HTMLElement;
            if (currentIcon) {
                currentIcon.classList.replace(show ? sendIconClass : stopIconClass, show ? stopIconClass : sendIconClass);
                if (show) {
                    currentIcon.title = stopTooltip;
                    EventHandler.add(currentIcon, 'click', this.respondingStopper, this);
                } else {
                    currentIcon.removeAttribute('title');
                    EventHandler.remove(currentIcon, 'click', this.respondingStopper);
                }
            }
        }
    }

    private updateFooterToolbar(): void {
        const footerIconsWrapper: HTMLElement = this.footer.querySelector('.e-footer-icons-wrapper') as HTMLElement;
        if (footerIconsWrapper) {
            footerIconsWrapper.innerHTML = '';
            this.footerToolbarEle = null;
            this.sendToolbarItem = null;
            this.renderFooterToolbar(footerIconsWrapper);
            this.refreshTextareaUI();
        }
    }

    private keyHandler(e: KeyboardEvent): void {
        if (e.key === 'Enter' && !e.shiftKey) {
            this.pushToUndoStack(this.editableTextarea.innerText);
            e.preventDefault();
            if (!this.isResponseRequested) {
                this.onSendIconClick();
            }
        } else {
            this.handleUndoRedo(e);
        }
    }

    private footerKeyHandler(e: KeyboardEvent): void {
        e.stopPropagation();
        const targetElement: HTMLElement = e.target as HTMLElement;
        if (targetElement.classList.contains('e-tbar-btn')) {
            return;
        }
        else if (e.key === 'Escape') {
            this.onPopupKeyDown(e);
            return;
        }
        this.keyHandler(e);
    }

    /**
     * Appends or sets the generated response content in the component.
     * Use this method to manually inject a response from cache, non-streaming APIs, or custom logic.
     *
     * @method addResponse
     * @param {string} response - The response content (plain text or Markdown) to render.
     * @param {boolean} isFinalUpdate - Indicates whether this response is the final one, to hide the stop response button.
     * @returns {void}
     */
    public addResponse(response: string, isFinalUpdate: boolean = true): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (this.isStopRequested) {
            this.isStopRequested = false;
            this.isResponseRequested = false;
            if (this.responseMode.toLowerCase() === 'inline') {
                this.hideTypingIndicator();
                this.toggleStopRespondingButton(false);
            }
            return;
        }
        const htmlResponse: string | Promise<string> = MarkdownConverter.toHtml(response);
        this.prompts = [...this.prompts, { prompt: this.prompt, response: htmlResponse as string}];
        this.prompt = '';
        this.hasResponse = true;
        if (this.responseMode.toLowerCase() === 'inline') {
            if (isFinalUpdate) {
                this.hideTypingIndicator();
                this.isResponseRequested = false;
                this.toggleStopRespondingButton(false);
                this.showResponsePopup();
            } else {
                if (!this.typingIndicatorEl) {
                    this.showTypingIndicator(this.l10n.getConstant('editingIndicator'));
                } else {
                    const indicatorTextElement: HTMLElement = this.typingIndicatorEl.querySelector('.e-indicator-text');
                    indicatorTextElement.innerHTML = this.l10n.getConstant('editingIndicator');
                }
            }
        } else {
            if (!this.responseContainerCreated) {
                this.responseContainerCreated = false;
                this.createResponseContainer();
            }
            if (this.enableStreaming && !this.responseTemplate) {
                this.streamResponse(htmlResponse as string);
                return;
            } else {
                if (this.responseTemplate) {
                    this.renderResponseWithTemplate(response);
                } else {
                    this.removeSkeleton();
                    const responseItem: HTMLElement = this.element.querySelector('.e-response-text') as HTMLElement;
                    if (!responseItem) {
                        return;
                    }
                    responseItem.innerHTML = htmlResponse as string;
                }
                if (isFinalUpdate) {
                    this.isResponseRequested = false;
                    this.toggleStopRespondingButton(false);
                    this.showResponsePopup();
                }
            }
        }
        this.isProtectedOnChange = prevOnChange;
    }

    private streamResponse(response: string): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        let i: number = 0;
        const words: string[] = response.split(' ');
        const wordCount: number = words.length;
        let lastResponse: string = '';
        const responseItem: HTMLElement = this.element.querySelector('.e-response-text') as HTMLElement;

        const streamingResponse: () => void = (): void => {
            if (this.isStopRequested) {
                return;
            }
            lastResponse += (i === 0 ? '' : ' ') + words[parseInt(i.toString(), 10)];
            i++;
            this.removeSkeleton();
            if (responseItem) {
                responseItem.innerHTML = lastResponse;
            }
            if (i < wordCount) {
                setTimeout(() => {
                    streamingResponse();
                }, 15);
            } else {
                const isFinalUpdate: boolean = lastResponse.length === response.length;
                if (isFinalUpdate) {
                    this.isResponseRequested = false;
                    this.toggleStopRespondingButton(false);
                    this.showResponsePopup();
                }
                this.isProtectedOnChange = prevOnChange;
            }
        };
        streamingResponse();
    }

    /**
     * Executes the specified prompt as if the user typed and submitted it.
     * TUse this to run predefined commands, slash-menu actions, or external triggers.
     *
     * @method executePrompt
     * @param {string} prompt - The prompt text to execute; dispatched to the AI backend or via the promptRequest event.
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
     * Opens the popup UI and optionally positions it at the given screen coordinates.
     * When not provided, default positioning (caret/selection/target) is applied.
     *
     * @method showPopup
     * @param {number} [x] - X coordinate in pixels or CSS units (e.g., 300, '300px', '50%').
     * @param {number} [y] - Y coordinate in pixels or CSS units (e.g., 200, '200px', '50%').
     * @returns {void}
     */
    public showPopup(x?: number, y?: number): void {
        if (this.popupObj) {
            // Determine positioning element: use target if provided, otherwise use selected text
            const positioningElement: string | HTMLElement  = this.relateToEl || document.body;
            (this.popupObj as any).setProperties({ relateTo: positioningElement, targetType: 'relative', offsetX: x ? x : 0, offsetY: y ? y : 0 }, true);
            this.popupObj.refreshPosition();
            this.popupObj.show();
            if (this.editableTextarea) {
                this.editableTextarea.focus();
            }
            this.hasResponse = false;
            if (this.mentionPopupObj && this.commandSettings.commands.length > 0) {
                this.showCommandMenuPopup();
            }
        }
    }

    /**
     * Closes/hides the popup UI or collapses the inline response area.
     * Triggers the close event after the popup is hidden.
     *
     * @method hidePopup
     * @returns {void}
     */
    public hidePopup(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (this.mentionPopupObj) {
            this.mentionPopupObj.dataSource = this.commandOptionsData;
            this.mentionPopupObj.dataBind();
        }
        if (this.popupObj) {
            this.clearResponses();
            this.prompts = [];
            this.editableTextarea.innerHTML = '';
            this.refreshTextareaUI();
            this.popupObj.hide();
        }
        this.isProtectedOnChange = prevOnChange;
    }

    /**
     * Opens the command popup below the prompt input area.
     * Use to display available commands or suggestions for quick selection.
     *
     * @method showCommandPopup
     * @returns {void}
     */
    public showCommandPopup(): void {
        if (this.popupObj.element.classList.contains('e-popup-open')) {
            this.showCommandMenuPopup();
        }
    }

    /**
     * Hides the command popup displayed below the prompt input area.
     * Call this to dismiss the command chooser without selection.
     *
     * @method hideCommandPopup
     * @returns {void}
     */
    public hideCommandPopup(): void {
        if (this.mentionPopupObj && this.mentionPopupObj.element.classList.contains('e-popup-open')) {
            this.mentionPopupObj.hidePopup();
        }
    }

    private renderResponseWithTemplate(response: string): void {
        const outputContainer: HTMLElement = this.element.querySelector('.e-output-container');
        if (!outputContainer) {
            return;
        }
        outputContainer.innerHTML = '';
        const context: any = {
            response: response,
            responseItems: this.responseSettings.items
        };
        this.updateContent(this.responseTemplate, outputContainer, context, 'responseTemplate');
    }

    private clearResponses(): void {
        if (this.responseContainer) {
            this.responseContainer.remove();
        }
    }

    public destroy(): void {
        this.unWireEvents();
        this.destroyAndNullify(this.popupObj);
        this.destroyAndNullify(this.footerToolbarEle);
        this.destroyAndNullify(this.mentionPopupObj);
        this.removeAndNullify(this.responseContainer);
        this.removeAndNullify(this.skeletonContainer);
        this.removeAndNullify(this.contentWrapper);
        this.removeAndNullify(this.footer);
        this.removeAndNullify(this.editableTextarea);
        this.removeAndNullify(this.typingIndicatorEl);
        super.destroy();
        if (this.mentionPopupObj) {
            this.mentionPopupObj.element.remove();
        }
        this.responseContainer = null;
        this.skeletonContainer = null;
        this.contentWrapper = null;
        this.footer = null;
        this.editableTextarea = null;
        this.typingIndicatorEl = null;
        this.sendToolbarItem = null;
        this.responseOptionsData = [];
        this.commandOptionsData = [];
        this.prompts = [];
        this.responseContainerCreated = false;
        this.isResponseRequested = false;
        this.isStopRequested = false;
        this.inlineToolbarSettings = this.responseSettings = this.commandSettings = {};
        if (this.cssClass) { removeClass([this.element], this.cssClass.split(' ')); }
        removeClass([this.element], ['e-inline-ai-assist']);
        this.element.classList.remove('e-rtl');
    }

    /**
     * Called if any of the property value is changed.
     *
     * @param {InlineAIAssistModel} newProp - Specifies new properties
     * @param {InlineAIAssistModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: InlineAIAssistModel, oldProp?: InlineAIAssistModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'popupWidth':
            case 'popupHeight':
                if (this.popupObj) {
                    this.popupObj.width = formatUnit(this.popupWidth);
                    this.popupObj.height = formatUnit(this.popupHeight);
                }
                break;
            case 'prompt':
                if (!this.editorTemplate) {
                    this.editableTextarea.innerText = this.prompt;
                    this.refreshTextareaUI();
                    this.pushToUndoStack(this.prompt);
                }
                break;
            case 'locale':
                this.l10n.setLocale(this.locale);
                break;
            case 'placeholder':
                if (this.editableTextarea) {
                    this.editableTextarea.setAttribute('placeholder', this.placeholder);
                }
                break;
            case 'cssClass':
                this.updateCssClass(this.element, newProp.cssClass, oldProp.cssClass);
                break;
            case 'target':
                this.resolveTargetElement();
                break;
            case 'relateTo':
                this.resolveRelateToElement();
                if (this.popupObj) {
                    (this.popupObj as any).setProperties({ relateTo: this.relateToEl }, true);
                    this.popupObj.refreshPosition();
                }
                break;
            case 'inlineToolbarSettings':
                if (newProp.inlineToolbarSettings.items) {
                    this.updateFooterToolbar();
                }
                if (newProp.inlineToolbarSettings.toolbarPosition) {
                    this.updateFooterType(newProp.inlineToolbarSettings.toolbarPosition);
                }
                break;
            case 'responseSettings':
                if (newProp.responseSettings.items) {
                    this.setResponsePopupData();
                }
                break;
            case 'commandSettings':
                if (newProp.commandSettings) {
                    this.setCommandPopupData();
                    if (this.mentionPopupObj && this.mentionPopupObj.element.classList.contains('e-popup-open')) {
                        this.showCommandMenuPopup();
                    }
                }
                break;
            case 'responseTemplate': {
                if (this.responseContainerCreated && this.prompts.length > 0) {
                    const outputContainer: HTMLElement = this.element.querySelector('.e-output-container');
                    if (outputContainer) {
                        outputContainer.innerHTML = '';
                        this.renderResponseWithTemplate(this.prompts[this.prompts.length - 1].response);
                    }
                }
                break;
            }
            case 'editorTemplate': {
                this.updateEditorTemplate();
                break;
            }
            case 'enableStreaming': {
                this.enableStreaming = newProp.enableStreaming;
                break;
            }
            case 'zIndex':
                if (this.popupObj) {
                    this.popupObj.zIndex = newProp.zIndex;
                    this.popupObj.dataBind();
                }
                break;
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove']('e-rtl');
                if (this.footerToolbarEle) {
                    this.footerToolbarEle.enableRtl = this.enableRtl;
                    this.footerToolbarEle.dataBind();
                }
                break;
            }
        }
    }
}
