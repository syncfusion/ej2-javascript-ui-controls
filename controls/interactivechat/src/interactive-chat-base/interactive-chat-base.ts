import { Component, select, compile, INotifyPropertyChanged, NotifyPropertyChanges, isNullOrUndefined as isNOU, formatUnit, Event, EmitType, append, addClass, removeClass, Property, ChildProperty, Collection, BaseEventArgs } from '@syncfusion/ej2-base';
import { attributes, EventHandler, remove } from '@syncfusion/ej2-base';
import { InterActiveChatBaseModel, ToolbarItemModel } from './interactive-chat-base-model';
import { TextArea } from '@syncfusion/ej2-inputs';
import { ItemType, ItemAlign } from '@syncfusion/ej2-navigations';

/**
 * Represents a toolbar item model in the component.
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
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
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
 * Represents the settings for the toolbar in the component.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {

    /**
     * Specifies the collection of toolbar items in the component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default []
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the component.
     *
     * @event itemClicked
     */
    @Event()
    public itemClicked: EmitType<ToolbarItemClickedEventArgs>;
}

/**
 * Represents the event arguments for a toolbar item click event in the component.
 */
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
     * Specifies the index of the message data associated with the toolbar item click event.
     * This property is not applicable for header toolbar item click.
     *
     * @type {number}
     * @default -1
     */
    dataIndex?: number
}

/**
 * ChatBase component act as base class.
 */
@NotifyPropertyChanges
export class InterActiveChatBase extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Event triggers when the component is created.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Object>;

    /* Private variables */
    protected suggestionsElement: HTMLElement;
    protected suggestionHeader: HTMLElement;
    protected content: HTMLElement;

    /**
     * * Constructor for Base class
     *
     * @param {InterActiveChatBaseModel} options - Specifies the Base model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: InterActiveChatBaseModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected preRender(): void {
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the current module name.
     */
    public getModuleName(): string {
        return 'interactivechatBase';
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected render(): void {
    }

    /* To calculate the width when change via set model */
    protected setDimension(element: HTMLElement, width: string | number, height: string | number): void {
        element.style.width = !isNOU(width) ? formatUnit(width) : element.style.width;
        element.style.height = !isNOU(height) ? formatUnit(height) : element.style.height;
    }

    protected addCssClass(element: HTMLElement, cssClass: string): void {
        if (cssClass) {
            element.classList.add(cssClass);
        }
    }

    protected addRtlClass(element: HTMLElement, isRtl: boolean): void {
        if (isRtl) {
            element.classList.add('e-rtl');
        }
    }

    protected updateCssClass(element: HTMLElement, newClass: string, oldClass: string): void {
        if (oldClass) {
            removeClass([element], oldClass.trim().split(' '));
        }
        if (newClass) {
            addClass([element], newClass.trim().split(' '));
        }
    }

    protected updateHeader(showHeader: boolean, headerElement: HTMLElement, viewWrapper: HTMLElement): void {
        if (!showHeader) {
            headerElement.hidden = true;
            viewWrapper.style.height = '100%';
        }
        else {
            headerElement.hidden = false;
            viewWrapper.style.height = '';
        }
    }

    protected renderViewSections(element: HTMLElement, headerClassName: string, viewClassName: string): void {
        const headerWrapper: HTMLElement = this.createElement('div', { attrs: { class: headerClassName }});
        element.appendChild(headerWrapper);
        const viewWrapper: HTMLElement = this.createElement('div', { attrs: { class: viewClassName} });
        element.appendChild(viewWrapper);
    }

    protected createViewComponents(viewWrapper: HTMLElement): void {
        const contentWrapper: HTMLElement = this.createElement('div', { attrs: { class: 'e-views' } });
        const viewContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-view-container' } });
        contentWrapper.appendChild(viewContainer);
        viewWrapper.appendChild(contentWrapper);
    }

    protected updateScroll(scrollElement: HTMLElement): void {
        scrollElement.scrollTo(0, scrollElement.scrollHeight);
    }

    protected getElement(element: string): HTMLElement {
        let className: string;
        switch (element) {
        case 'footer':
            className = 'e-footer';
            break;
        case 'contentContainer':
            className = 'e-content-container';
            break;
        case 'outputElement':
            className = 'e-content';
            break;
        default:
            className = '';
            break;
        }
        return this.createElement('div', { attrs: { class: className } });
    }

    protected createSuggestionElement(suggestionHeader: string): {
        suggestionContainer: HTMLElement;
        suggestionHeaderElement: HTMLElement;
        suggestionListElement: HTMLElement;
    } {
        const suggestionContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-suggestions' } });
        const suggestionHeaderElement: HTMLElement =  this.createElement('div', { attrs: { class: 'e-suggestion-header' } });
        const suggestionListElement: HTMLElement = this.createElement('div', { attrs: { class: 'e-suggestion-list' } });
        if (suggestionHeader) {
            suggestionContainer.appendChild(suggestionHeaderElement);
        }
        suggestionContainer.appendChild(suggestionListElement);
        return {suggestionContainer, suggestionHeaderElement, suggestionListElement};
    }

    protected renderSuggestions(suggestionsArray: string[], suggestionHeader: string, suggestionTemplate: string | Function,
                                contextName: string, templateName: string, onSuggestionClick: (e: Event) => void): void {
        const isSuggestionTemplate: boolean = suggestionTemplate ? true : false;
        if (suggestionsArray && suggestionsArray.length > 0) {
            const {
                suggestionContainer,
                suggestionHeaderElement,
                suggestionListElement
            } = this.createSuggestionElement(suggestionHeader);
            this.suggestionsElement = suggestionContainer;
            const suggestionContainerClass: string = `e-suggestions ${isSuggestionTemplate ? 'e-suggestion-item-template' : ''}`;
            this.suggestionsElement.className = suggestionContainerClass;
            this.suggestionHeader =  suggestionHeaderElement;
            const suggestionList: HTMLElement = suggestionListElement;
            this.renderSuggestionList(suggestionsArray, suggestionList, isSuggestionTemplate, contextName, suggestionTemplate,
                                      templateName, onSuggestionClick);
            if (suggestionHeader) {
                this.suggestionHeader.innerHTML = suggestionHeader;
            }
            this.suggestionsElement.append(suggestionList);
            this.content.append(this.suggestionsElement);
        }
    }

    private renderSuggestionList(suggestionsArray: string[], suggestionWrapper: HTMLElement, isSuggestionTemplate: boolean,
                                 contextName: string, suggestionTemplate: string | Function, templateName: string,
                                 onSuggestionClick: (e: Event) => void): void {
        const suggestionsListElement: HTMLElement = this.createElement('ul', { attrs: { 'tabindex': '-1' } }) as HTMLElement;
        suggestionsArray.forEach((suggestion: string, i: number) => {
            const suggestionList: HTMLLIElement = this.createElement('li');
            attributes(suggestionList, { 'tabindex': '0' });
            EventHandler.add(suggestionList, 'click', onSuggestionClick, this);
            EventHandler.add(suggestionList, 'keydown', this.suggestionItemHandler, this);
            if (isSuggestionTemplate) {
                const suggestionContext: object = { index: i, [contextName]: suggestionsArray[parseInt(i.toString(), 10)] };
                this.updateContent(suggestionTemplate, suggestionList, suggestionContext, templateName);
            } else {
                suggestionList.innerHTML = suggestion;
            }
            suggestionsListElement.append(suggestionList);
        });
        suggestionWrapper.appendChild(suggestionsListElement);
    }

    private suggestionItemHandler(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).onSuggestionClick(event);
        }
    }

    protected renderBannerView(bannerTemplate: string | Function, parentElement: HTMLElement, templateName: string): void {
        if (bannerTemplate) {
            const introContainer: HTMLElement = this.createElement('div', { attrs: { class: 'e-banner-view'} });
            this.updateContent(bannerTemplate, introContainer, {}, templateName);
            parentElement.prepend(introContainer);
        }
    }

    protected updateContent(template: string | Function, contentElement: HTMLElement, context: object, templateName: string): void {
        if (this.isReact) { this.clearTemplate([templateName]); }
        const notCompile: boolean = !(this.isReact || this.isVue);
        const ctn: string | Function = this.getTemplateFunction(template, notCompile);
        if (typeof ctn === 'string') {
            contentElement.innerHTML = ctn;
        } else {
            append(ctn(context, this), contentElement);
        }
        this.renderReactTemplates();
    }

    protected renderFooterContent(footerTemplate: string | Function, footer: HTMLElement, prompt: string,
                                  promptPlaceholder: string, showClearButton: boolean, rowCount: number, className: string): TextArea {
        if (footerTemplate) {
            this.updateContent(footerTemplate, footer, {}, 'footerTemplate');
            return null;
        } else {
            const textareaEle: HTMLElement = this.createElement('textarea', { attrs: { class: className } });
            footer.appendChild(textareaEle);
            return this.renderFooter(textareaEle, prompt, promptPlaceholder, showClearButton, rowCount);
        }
    }

    private renderFooter(textareaElement: HTMLElement, prompt: string, promptPlaceholder: string,
                         showClearButton: boolean = false, rowCount: number): TextArea {
        const textareaObj: TextArea = new TextArea({
            rows: rowCount,
            cols: 300,
            cssClass: rowCount >= 10 ? 'show-scrollbar' : 'hide-scrollbar',
            placeholder: promptPlaceholder,
            resizeMode: 'None',
            value: prompt,
            showClearButton: showClearButton
        });
        textareaObj.appendTo(textareaElement);
        return textareaObj;
    }

    protected renderSendIcon(sendIconClass: string, footer: HTMLElement): HTMLElement {
        const sendIcon: HTMLElement = this.createElement('span', { attrs: { class: sendIconClass, role: 'button', 'aria-label': 'Submit', tabindex: '0' } }) as HTMLElement;
        footer.appendChild(sendIcon);
        return sendIcon;
    }
    protected appendChildren(target: HTMLElement, ...children: HTMLElement[]): void {
        target.append(...children);
    }
    protected insertBeforeChildren(target: HTMLElement, ...children: HTMLElement[]): void {
        target.prepend(...children);
    }
    protected wireFooterEvents(sendIcon: HTMLElement, footer: HTMLElement, footerTemplate: string | Function): void {
        if (sendIcon) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.add(sendIcon, 'click', (this as any).onSendIconClick, this);
        }
        if (footer && !footerTemplate) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.add(footer, 'keydown', (this as any).footerKeyHandler, this);
        }
    }

    protected unWireFooterEvents(sendIcon: HTMLElement, footer: HTMLElement, footerTemplate: string | Function): void {
        if (sendIcon) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.remove(sendIcon, 'click', (this as any).onSendIconClick);
        }
        if (footer && !footerTemplate) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.remove(footer, 'keydown', (this as any).footerKeyHandler);
        }
    }
    protected removeAndNullify(element: HTMLElement): void {
        if (element) {
            if (!isNOU(element.parentNode)) {
                remove(element);
            } else {
                element.innerHTML = '';
            }
        }
    }
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    protected destroyAndNullify(obj: any): void {
        if (obj) {
            obj.destroy();
            obj = null;
        }
    }
    /**
     * Gets template content based on the template property value.
     *
     * @param {string | Function} template - Template property value.
     * @param {boolean} notCompile - Compile property value.
     * @returns {Function} - Return template function.
     * @hidden
     */
    protected getTemplateFunction(template: string | Function, notCompile: boolean): string | Function {
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

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @param  {InterActiveChatBaseModel} newProp - Specifies new properties
     * @param  {InterActiveChatBaseModel} oldProp - Specifies old properties
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: InterActiveChatBaseModel, oldProp: InterActiveChatBaseModel): void {
    }
}
