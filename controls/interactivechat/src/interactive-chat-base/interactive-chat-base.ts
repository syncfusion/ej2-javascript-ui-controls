import { Component, select, compile, INotifyPropertyChanged, NotifyPropertyChanges, isNullOrUndefined as isNOU, formatUnit, Event, EmitType, append, addClass, removeClass, Property, ChildProperty, Collection, BaseEventArgs } from '@syncfusion/ej2-base';
import { attributes, EventHandler, remove } from '@syncfusion/ej2-base';
import { InterActiveChatBaseModel, ToolbarItemModel } from './interactive-chat-base-model';
import { TextArea } from '@syncfusion/ej2-inputs';
import { ItemType, ItemAlign } from '@syncfusion/ej2-navigations';

/* eslint-disable @typescript-eslint/no-misused-new, no-redeclare */
interface ClipboardItem {
    new (items: { [mimeType: string]: Blob }): ClipboardItem;
}
declare let ClipboardItem: any;
/* eslint-enable @typescript-eslint/no-misused-new, no-redeclare */

export interface TextState {
    content: string;
    selectionStart: number;
    selectionEnd: number;
}

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
    protected footer: HTMLElement;
    protected editableTextarea: HTMLDivElement;
    protected sendIcon: HTMLElement;
    protected clearIcon: HTMLElement;
    protected undoStack: TextState[] = [];
    protected redoStack: TextState[] = [];
    protected undoDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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
        const headerWrapper: HTMLElement = this.createElement('div', { className: headerClassName });
        element.appendChild(headerWrapper);
        const viewWrapper: HTMLElement = this.createElement('div', { className: viewClassName });
        element.appendChild(viewWrapper);
    }

    protected createViewComponents(viewWrapper: HTMLElement): void {
        const contentWrapper: HTMLElement = this.createElement('div', { className: 'e-views' });
        const viewContainer: HTMLElement = this.createElement('div', { className: 'e-view-container' });
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
        return this.createElement('div', { className: className });
    }

    protected getClipBoardContent(value: string): void {
        const tempElement: HTMLElement = document.createElement('div');
        tempElement.innerHTML = value;
        tempElement.style.top = '0';
        tempElement.style.left = '0';
        tempElement.style.position = 'fixed';
        tempElement.style.opacity = '0';
        document.body.appendChild(tempElement);
        (navigator as any).clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([tempElement.innerHTML], { type: 'text/html' }),
                'text/plain': new Blob([tempElement.innerText], { type: 'text/plain' })
            })
        ]);
        document.body.removeChild(tempElement);
    }

    protected getFooter(): void {
        this.footer = this.getElement('footer');
    }
    protected createSuggestionElement(suggestionHeader: string): {
        suggestionContainer: HTMLElement;
        suggestionHeaderElement: HTMLElement;
        suggestionListElement: HTMLElement;
    } {
        const suggestionContainer: HTMLElement = this.createElement('div', { className: 'e-suggestions' });
        const suggestionHeaderElement: HTMLElement =  this.createElement('div', { className: 'e-suggestion-header' });
        const suggestionListElement: HTMLElement = this.createElement('div', { className: 'e-suggestion-list' });
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
            const className: string = templateName === 'emptyChatTemplate' ? 'e-empty-chat-template' : 'e-banner-view';
            const introContainer: HTMLElement = this.createElement('div', { className: className });
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

    protected renderFooterContent(footerTemplate: string | Function, prompt: string,
                                  promptPlaceholder: string, showClearButton: boolean, className: string): void {
        if (footerTemplate) {
            this.updateContent(footerTemplate, this.footer, {}, 'footerTemplate');
        } else {
            this.renderFooter(className, prompt, promptPlaceholder, showClearButton);
        }
    }

    private renderFooter(className: string, prompt: string, promptPlaceholder: string,
                         showClearButton: boolean = false): void {
        this.editableTextarea = this.createElement('div', {
            attrs: {
                class: className,
                contenteditable: 'true',
                placeholder: promptPlaceholder,
                role: 'textbox',
                'aria-multiline': 'true'
            },
            innerHTML: prompt
        });
        const hiddenTextarea: HTMLTextAreaElement = this.createElement('textarea', {
            attrs: {
                class: 'e-hidden-textarea',
                name: 'userPrompt',
                value: prompt
            }
        });
        const textAreaIconsWrapper: HTMLElement = this.createElement('div', { className: 'e-textarea-icons-wrapper'});
        this.appendChildren(textAreaIconsWrapper, this.editableTextarea, hiddenTextarea);
        this.footer.appendChild(textAreaIconsWrapper);
    }
    protected updateTextAreaObject(textareaObj: TextArea): void {
        if (isNOU(textareaObj)) { return; }
        const textarea: HTMLElement = textareaObj.element;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    protected renderSendIcon(sendIconClass: string): HTMLElement {
        const sendIcon: HTMLElement = this.createElement('span', { attrs: { class: sendIconClass, role: 'button', 'aria-label': 'Submit', tabindex: '0' } }) as HTMLElement;
        this.footer.appendChild(sendIcon);
        return sendIcon;
    }
    protected appendChildren(target: HTMLElement, ...children: HTMLElement[]): void {
        target.append(...children);
    }
    protected insertBeforeChildren(target: HTMLElement, ...children: HTMLElement[]): void {
        target.prepend(...children);
    }
    protected renderFooterIcons(sendIconClass: string, showClearButton: boolean, clearIconClass: string): void {
        const footerIconsWrapper: HTMLDivElement = this.createElement('div', { attrs: { class: 'e-footer-icons-wrapper'}});
        this.sendIcon = this.createElement('span', { attrs: { class: sendIconClass, role: 'button', 'aria-label': 'Submit', tabindex: '0' } }) as HTMLElement;
        footerIconsWrapper.appendChild(this.sendIcon);
        if (showClearButton) {
            this.renderClearIcon(footerIconsWrapper, clearIconClass);
        }
        this.footer.firstChild.appendChild(footerIconsWrapper);
        this.footer.classList.add('focus-wave-effect');
    }
    protected renderClearIcon(footerIconsWrapper: HTMLDivElement, clearIconClass: string): void {
        this.clearIcon = this.createElement('span', { attrs: { class: clearIconClass, role: 'button', 'aria-label': 'Close', tabindex: '-1' } }) as HTMLElement;
        if (footerIconsWrapper) {
            footerIconsWrapper.prepend(this.clearIcon);
        }
    }
    protected updateHiddenTextarea(prompt: string): void {
        const hiddenTextarea: HTMLTextAreaElement = this.footer.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
        hiddenTextarea.value = prompt;
    }
    protected activateSendIcon(value: number): void {
        this.sendIcon.classList.toggle('disabled', value === 0);
        this.sendIcon.classList.toggle('enabled', value > 0);
    }
    protected updateFooterEleClass(): void {
        if (isNOU(this.editableTextarea)) { return; }
        const textarea: HTMLElement = this.editableTextarea;
        textarea.style.height = 'auto';
        this.footer.classList.remove('expanded');
        this.footer.classList[textarea.scrollHeight > parseInt(getComputedStyle(textarea).minHeight, 10) ? 'add' : 'remove']('expanded');
        if (!isNOU(this.clearIcon)) {
            const isFocused: boolean = document.activeElement === this.editableTextarea;
            const hasContent: boolean = this.editableTextarea.textContent.length > 0;
            this.clearIcon.classList[isFocused && hasContent ? 'remove' : 'add']('e-assist-clear-icon-hide');
        }
    }
    protected updatePlaceholder(placeholder: string): void {
        if (this.editableTextarea) {
            this.editableTextarea.setAttribute('placeholder', placeholder);
        }
    }
    protected pushToUndoStack(value: string): void {
        const { start, end } = this.getCursorPosition();
        const state: TextState = {
            content: value,
            selectionStart: start,
            selectionEnd: end
        };
        if (this.undoStack.length === 0 || this.undoStack[this.undoStack.length - 1].content !== value) {
            this.undoStack.push(state);
            if (this.undoStack.length > 100) {
                this.undoStack.shift();
            }
        }
    }
    protected handleUndoRedo(event: KeyboardEvent): void {
        const isUndo: boolean = (event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey;
        const isRedo: boolean = (event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey));
        if (isUndo) {
            event.preventDefault();
            this.undo(event);
        }
        else if (isRedo) {
            event.preventDefault();
            this.redo(event);
        }
    }
    protected undo(event: KeyboardEvent): void {
        if (this.undoStack.length <= 1) {
            return;
        }
        const current: TextState = this.undoStack.pop();
        const previous: TextState = this.undoStack[this.undoStack.length - 1];
        this.redoStack.push(current);
        (this as any).applyPromptChange(previous, current, event);
    }
    protected redo(event: KeyboardEvent): void {
        if (this.redoStack.length === 0) {
            return;
        }
        const current: TextState = {
            content: this.editableTextarea.textContent,
            selectionStart: this.getCursorPosition().start,
            selectionEnd: this.getCursorPosition().end
        };
        const next: TextState = this.redoStack.pop();
        this.undoStack.push(next);
        (this as any).applyPromptChange(next, current, event);
    }
    protected setFocusAtEnd(textArea: HTMLElement): void {
        const range: Range = document.createRange();
        const selection: Selection = window.getSelection();
        range.selectNodeContents(textArea);
        range.collapse(false);
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    protected getCursorPosition(): { start: number; end: number } {
        const selection: Selection | null = window.getSelection();
        const range: Range | null = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (range && this.editableTextarea.contains(range.commonAncestorContainer)) {
            return {
                start: range.startOffset,
                end: range.endOffset
            };
        }
        return { start: 0, end: 0 };
    }
    protected setCursorPosition(start: number, end: number): void {
        const range: Range = document.createRange();
        const selection: Selection | null = window.getSelection();
        const textNode: ChildNode | null = this.editableTextarea.firstChild;

        if (textNode) {
            range.setStart(textNode, start);
            range.setEnd(textNode, end);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    protected clearBreakTags(element: HTMLDivElement): void {
        element.innerHTML = element.innerHTML.replace(/<br>/g, '').trim();
    }
    protected handlePaste(event: Event): void {
        event.preventDefault(); // Prevent default paste behavior
        const pasteContent: string = (event as any).clipboardData.getData('text/plain') || '';
        const selection: Selection | null = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const range: Range = selection.getRangeAt(0);
        range.deleteContents(); // Delete any selected text
        // Handle line breaks with proper typing
        const lines: string[] = pasteContent.split(/\r?\n/);
        const fragment: DocumentFragment = document.createDocumentFragment();
        lines.forEach((line: string, index: number) => {
            if (line) {  // Only add non-empty lines
                fragment.appendChild(document.createTextNode(line));
            }
            if (index < lines.length - 1) {
                fragment.appendChild(document.createElement('br'));
            }
        });
        range.insertNode(fragment);
        this.setFocusAtEnd(this.editableTextarea);
        // Clear redo stack on new input
        this.redoStack = [];
        const inputEvent: Event = new CustomEvent('input', {
            bubbles: true,
            cancelable: true,
            detail: {
                inputType: 'insertFromPaste',
                data: this.editableTextarea.innerText,
                isComposing: false
            }
        });
        this.editableTextarea.dispatchEvent(inputEvent);
        this.pushToUndoStack(this.editableTextarea.innerText);
        this.updateScroll(this.editableTextarea);
    }
    protected scheduleUndoPush(value: string): void {
        if (this.undoDebounceTimer) {
            clearTimeout(this.undoDebounceTimer);
        }
        this.undoDebounceTimer = setTimeout(() => {
            this.pushToUndoStack(value);
            this.undoDebounceTimer = null;
        }, 400);
    }
    protected wireFooterEvents(
        footerTemplate: string | Function
    ): void {
        if (this.sendIcon) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.add(this.sendIcon, 'click', (this as any).onSendIconClick, this);
        }
        if (this.footer && !footerTemplate) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.add(this.footer, 'keydown', (this as any).footerKeyHandler, this);
        }
        if (this.editableTextarea) {
            EventHandler.add(this.editableTextarea, 'focus', (this as any).onFocusEditableTextarea, this);
            EventHandler.add(this.editableTextarea, 'blur', (this as any).onBlurEditableTextarea, this);
            EventHandler.add(this.editableTextarea, 'paste', this.handlePaste, this);
            EventHandler.add(this.editableTextarea, 'input', (this as any).handleInput, this);
            EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.updateFooterEleClass, this);
        }
    }

    protected unWireFooterEvents(
        footerTemplate: string | Function
    ): void {
        if (this.sendIcon) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.remove(this.sendIcon, 'click', (this as any).onSendIconClick);
        }
        if (this.footer && !footerTemplate) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventHandler.remove(this.footer, 'keydown', (this as any).footerKeyHandler);
        }
        if (this.editableTextarea) {
            EventHandler.remove(this.editableTextarea, 'focus', (this as any).onFocusEditableTextarea);
            EventHandler.remove(this.editableTextarea, 'blur', (this as any).onBlurEditableTextarea);
            EventHandler.remove(this.editableTextarea, 'paste', this.handlePaste);
            EventHandler.remove(this.editableTextarea, 'input', (this as any).handleInput);
            EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.updateFooterEleClass);
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
