// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../textarea/textarea-model.d.ts'/>
import { EventHandler, Property, createElement } from '@syncfusion/ej2-base';
import { TextArea } from '../textarea/textarea';
import { CaretPosition, CaretPositionHelper } from './caret-helper';
import { SmartTextAreaModel } from './smart-textarea-model';

export interface ChatParameters {
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
    stopSequences: string[];
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export enum ChatMessageRole {
    System = 'system',
    User = 'user',
    Assistant = 'assistant',
}

export interface ChatMessage {
    role: ChatMessageRole;
    content: string;
}

export type SuggestionMode = 'Enable' | 'Disable' | 'None';

export class SmartTextArea extends TextArea {
    private pendingSuggestionAbort: any;

    /**
     * Represents the user's role or designation, which can be used to provide role-specific suggestions or content within the smart textarea.
     * Provide a string that describes who is typing and for what reason, optionally giving other contextual information.
     *
     * @default ''
     */
    @Property('')
    public userRole: string;

    /**
     * Specifies a collection of phrases commonly used by the user, which can be leveraged for auto-completion and suggestions.
     * Provide an array of string phrases commonly used by the user to enhance auto-completion and suggestions. Include preferred tone, voice, and any relevant information such as policies, URLs, or keywords for improved suggestions.
     *
     * @default []
     */
    @Property([])
    public UserPhrases: string[];

    /**
     * Callback function to get suggestion text from server to display smart suggestion.
     *
     * @returns {string}
     */
    @Property()
    public aiSuggestionHandler: Function;

    /**
     * Specifies whether suggestions should appear in a popup or inline within the text area.
     * possible values are:
     * * `Enable` - Suggestions are always shown as a floating overlay, which can be tapped or clicked.
     * * `Disable` - Suggestions are always shown inline and can be accepted by pressing `Tab` key.
     * * `None` - Touch devices display suggestions as an overlay, while non-touch devices use inline suggestions.
     *
     * @default None
     */
    @Property('None')
    public showSuggestionOnPopup: SuggestionMode;

    /**
     * Constructor for creating the widget
     *
     * @private
     * @param {SmartTextArea} options - Specifies Smart text area model
     * @param {string | HTMLTextAreaElement} element - Specifies target element
     */
    public constructor(options?: SmartTextAreaModel, element?: string | HTMLTextAreaElement) {
        super(options, <string | HTMLTextAreaElement>element);
    }
    private textArea: HTMLTextAreaElement;
    private suggestionDisplay: InlineSuggestion | ContextSuggestion;
    private typingDebounceTimeout: any;

    public render(): void {
        super.render();
        if (!(this.element instanceof HTMLTextAreaElement)) {
            return;
        }
        this.textArea = this.element;
        const smartTextArea: HTMLElement = createElement('smart-textarea');
        smartTextArea.classList.add('e-smart-textarea');
        this.textArea.after(smartTextArea);
        if (this.showSuggestionOnPopup !== 'None') {
            const suggestionState: string = this.showSuggestionOnPopup === 'Enable' ? 'false' : 'true';
            this.textArea.setAttribute('data-inline-suggestions', suggestionState);
        }
        this.suggestionDisplay = this.shouldShowInlineSuggestions(this.textArea) ?
            new InlineSuggestion(smartTextArea, this.textArea) : new ContextSuggestion(smartTextArea, this.textArea);
    }

    protected wireEvents(): void {
        super.wireEvents();
        EventHandler.add(this.element, 'keyup', this.handleKeyUp, this);
        EventHandler.add(this.element, 'keydown', this.handleKeyDown, this);
        EventHandler.add(this.element, 'mousedown', this.removeExistingOrPendingSuggestion, this);
        EventHandler.add(this.element, 'focusout', this.removeExistingOrPendingSuggestion, this);
        this.element.addEventListener('scroll', (() => this.suggestionDisplay.reject()), {
            passive: true
        });
    }

    protected unWireEvents(): void {
        super.unWireEvents();
        EventHandler.remove(this.element, 'keyup', this.handleKeyUp);
        EventHandler.remove(this.element, 'keydown', this.handleKeyDown);
        EventHandler.remove(this.element, 'mousedown', this.removeExistingOrPendingSuggestion);
        EventHandler.remove(this.element, 'focusout', this.removeExistingOrPendingSuggestion);
        this.element.removeEventListener('scroll', (() => this.suggestionDisplay.reject()));
    }

    protected keydownHandler (): void {
        // Overridden to prevent default behavior
    }

    private shouldShowInlineSuggestions(textArea: any): boolean {
        const inlineSuggestions: string | null = textArea.getAttribute('data-inline-suggestions');
        if (inlineSuggestions) {
            return inlineSuggestions.toLowerCase() === 'true';
        }
        return !('ontouchstart' in window);
    }

    private handleKeyDown(event: any): void {
        switch (event.key) {
        case 'Tab':
            if (this.suggestionDisplay.isShowing()) {
                this.suggestionDisplay.accept();
                event.preventDefault();
            }
            break;
        case 'Alt':
        case 'Control':
        case 'Shift':
        case 'Command':
            break;
        default:
            if (this.suggestionDisplay.isShowing() && this.suggestionDisplay.currentSuggestion.startsWith(event.key)) {
                CaretPositionHelper.insertCharacter(this.textArea, event.key);
                event.preventDefault();
                this.suggestionDisplay.show(this.suggestionDisplay.currentSuggestion.substring(event.key.length));
                CaretPositionHelper.adjustScrollToCaretPosition(this.textArea);
            } else {
                this.removeExistingOrPendingSuggestion();
            }
            break;
        }
    }

    private handleKeyUp(): void {
        if (!this.suggestionDisplay.isShowing()) {
            clearTimeout(this.typingDebounceTimeout);
            this.typingDebounceTimeout = setTimeout(() => this.handleTypingPaused(), 350);
        }
    }

    private async handleTypingPaused(): Promise<void> {
        if (document.activeElement !== this.textArea) {
            return;
        }
        if (this.textArea.selectionStart === this.textArea.selectionEnd &&
            (this.textArea.selectionStart === this.textArea.value.length ||
                this.textArea.value[this.textArea.selectionStart] === '\n')) {
            await this.requestSuggestionAsync();
        }
    }

    private removeExistingOrPendingSuggestion(): void {
        clearTimeout(this.typingDebounceTimeout);
        if (this.pendingSuggestionAbort) {
            this.pendingSuggestionAbort.abort();
            this.pendingSuggestionAbort = null;
        }
        this.suggestionDisplay.reject();
    }

    private createSuggestionPrompt(textBefore: string, textAfter: string): ChatParameters {
        let stringBuilder: string = 'Predict what text the user in the given ROLE would insert at the cursor position indicated by ^^^.\nOnly give predictions for which you have' +
            ' an EXTREMELY high confidence that the user would insert that EXACT text.\nDo not make up new information. If you are not sure, ' +
            'just reply with NO_PREDICTION.\n\nRULES:\n1. Reply with OK:, then in square brackets the predicted text, then END_INSERTION, and no other output.\n2. ' +
            'When a specific value or quantity cannot be inferred and would need to be provided, use the word NEED_INFO.\n3. ' +
            'If there is not enough information to predict any words that the user would type next, just reply with the word NO_PREDICTION.' +
            '\n4. NEVER invent new information. If you can not be sure what the user is about to type, ALWAYS stop the prediction with END_INSERTION.';
        const userPhrases: string[] = this.UserPhrases;
        if (userPhrases && userPhrases.length > 0) {
            stringBuilder += '\nAlways try to use variations on the following phrases as part of the predictions:\n';
            for (const phrase of userPhrases) {
                stringBuilder += `- ${phrase}\n`;
            }
        }
        const chatMessageList: ChatMessage[] = [
            { role: ChatMessageRole.System, content: stringBuilder },
            { role: ChatMessageRole.User, content: 'ROLE: Family member sending a text\nUSER_TEXT: Hey, it is a nice day - the weather is ^^^' },
            { role: ChatMessageRole.Assistant, content: 'OK:[great!]END_INSERTION' },
            { role: ChatMessageRole.User, content: 'ROLE: Customer service assistant\nUSER_TEXT: You can find more information on^^^\n\nAlternatively, phone us.' },
            { role: ChatMessageRole.Assistant, content: 'OK:[ our website at NEED_INFO]END_INSERTION' },
            { role: ChatMessageRole.User, content: 'ROLE: Casual\nUSER_TEXT: Oh I see!\n\nWell sure thing, we can' },
            { role: ChatMessageRole.Assistant, content: 'OK:[ help you out with that!]END_INSERTION' },
            { role: ChatMessageRole.User, content: 'ROLE: Storyteller\nUSER_TEXT: Sir Digby Chicken Caesar, also know^^^' },
            { role: ChatMessageRole.Assistant, content: 'OK:[n as NEED_INFO]END_INSERTION' },
            { role: ChatMessageRole.User, content: 'ROLE: Customer support agent\nUSER_TEXT: Goodbye for now.^^^' },
            { role: ChatMessageRole.Assistant, content: 'NO_PREDICTION END_INSERTION' },
            { role: ChatMessageRole.User, content: 'ROLE: Pirate\nUSER_TEXT: Have you found^^^' },
            { role: ChatMessageRole.Assistant, content: 'OK:[ the treasure, me hearties?]END_INSERTION' },
            { role: ChatMessageRole.User, content: `ROLE: ${this.userRole}\nUSER_TEXT: ${textBefore}^^^${textAfter}` }
        ];
        return {
            messages: chatMessageList,
            temperature: 0.0,
            maxTokens: 400,
            stopSequences: ['END_INSERTION', 'NEED_INFO'],
            frequencyPenalty: 0.0,
            presencePenalty: 0.0
        };
    }

    private async requestSuggestionAsync(): Promise<void> {
        if (this.pendingSuggestionAbort) {
            this.pendingSuggestionAbort.abort();
            return;
        }
        this.pendingSuggestionAbort = new AbortController();
        const requestDetails: { textAreaValue: string; cursorPosition: number }  = {
            textAreaValue: this.textArea.value,
            cursorPosition: this.textArea.selectionStart
        };
        const suggestionData: {[key: string]: string} = {
            textBefore: requestDetails.textAreaValue.substring(0, requestDetails.cursorPosition),
            textAfter: requestDetails.textAreaValue.substring(requestDetails.cursorPosition)
        };
        const chatConfig: ChatParameters = this.createSuggestionPrompt(suggestionData.textBefore, suggestionData.textAfter);
        let insertSuggestion: string;
        if (typeof this.aiSuggestionHandler === 'function') {
            const response: string = await this.aiSuggestionHandler(chatConfig);
            insertSuggestion = this.validateSuggestion(response, suggestionData.textBefore);
        }
        if (insertSuggestion && requestDetails.textAreaValue === this.textArea.value &&
            requestDetails.cursorPosition === this.textArea.selectionStart) {
            if (!insertSuggestion.endsWith(' ')) {
                insertSuggestion += ' ';
            }
            this.suggestionDisplay.show(insertSuggestion);
        }
    }

    private validateSuggestion(response: string, textBefore: string): string {
        let suggestion: string;
        if (typeof response !== 'string' || response.length <= 5 || response.indexOf('OK:[') !== 0) {
            return '';
        }
        const endIndex: number = this.indexOfAny(response, ['.', '?', '!']);
        if (endIndex > 0 && response.length > endIndex + 1 && response[endIndex + 1] === ' ') {
            response = response.substring(0, endIndex + 1);
        }
        suggestion = response.substring(4).replace(/[\]\s]+$/, '');
        if (textBefore.length > 0 && textBefore[textBefore.length - 1] === ' ') {
            suggestion = suggestion.replace(/^\s+/, '');
        }
        return suggestion;
    }

    private indexOfAny(str: string, chars: string[]): number {
        for (let i: number = 0; i < str.length; i++) {
            if (chars.indexOf(str[`${i}` as any]) !== -1) {
                return i;
            }
        }
        return -1;
    }

    public getModuleName(): string {
        return 'smarttextarea';
    }

    public destroy(): void {
        super.destroy();
        this.textArea = null;
        this.suggestionDisplay = null;
        this.typingDebounceTimeout = null;
    }
}

class InlineSuggestion {
    private owner: HTMLElement;
    private textArea: HTMLTextAreaElement;
    private latestSuggestionText: string;
    private suggestionStartPos: number;
    private suggestionEndPos: number;
    private virtualCaret: VirtualCaret;
    private originalValueProperty: any;

    private get value(): string {
        const value: string = this.originalValueProperty.get.call(this.textArea);
        return this.isShowing() ? value.substring(0, this.suggestionStartPos) + value.substring(this.suggestionEndPos) : value;
    }

    private set value(newValue: string) {
        this.originalValueProperty.set.call(this.textArea, newValue);
    }

    constructor(smartTextArea: HTMLElement, textArea: HTMLTextAreaElement) {
        this.owner = smartTextArea;
        this.textArea = textArea;
        this.latestSuggestionText = '';
        this.suggestionStartPos = null;
        this.suggestionEndPos = null;
        this.virtualCaret = null;
        this.originalValueProperty = this.getOriginalValueProperty(textArea, 'value');
    }

    private getOriginalValueProperty(obj: any, property: any): PropertyDescriptor {
        while (obj) {
            const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(obj, property);
            if (descriptor) {
                return descriptor;
            }
            obj = Object.getPrototypeOf(obj);
        }
        throw new Error(`Property ${property} not found on object or its prototype chain`);
    }

    public get valueIncludingSuggestion(): string {
        return this.originalValueProperty.get.call(this.textArea);
    }

    public set valueIncludingSuggestion(newValue: string) {
        this.originalValueProperty.set.call(this.textArea, newValue);
    }

    public isShowing(): boolean {
        return this.suggestionStartPos !== null;
    }

    public show(suggestionText: string): void {
        this.latestSuggestionText = suggestionText;
        this.suggestionStartPos = this.textArea.selectionStart;
        this.suggestionEndPos = this.suggestionStartPos + suggestionText.length;
        this.textArea.setAttribute('data-suggestion-visible', '');
        this.valueIncludingSuggestion = this.valueIncludingSuggestion.substring(0, this.suggestionStartPos) +
            suggestionText +
            this.valueIncludingSuggestion.substring(this.suggestionStartPos);
        this.textArea.setSelectionRange(this.suggestionStartPos, this.suggestionEndPos);
        if (!this.virtualCaret) {
            this.virtualCaret = new VirtualCaret(this.owner, this.textArea);
        }
        this.virtualCaret.show();
    }

    public get currentSuggestion(): string {
        return this.latestSuggestionText;
    }

    public accept(): void {
        this.textArea.setSelectionRange(this.suggestionEndPos, this.suggestionEndPos);
        this.suggestionStartPos = null;
        this.suggestionEndPos = null;
        if (this.virtualCaret) {
            this.virtualCaret.hide();
        }
        this.textArea.removeAttribute('data-suggestion-visible');
        CaretPositionHelper.adjustScrollToCaretPosition(this.textArea);
    }

    public reject(): void {
        if (!this.isShowing()) {
            return;
        }
        const selectionStart: number = this.textArea.selectionStart;
        const selectionEnd: number = this.textArea.selectionEnd;
        this.valueIncludingSuggestion = this.valueIncludingSuggestion.substring(0, this.suggestionStartPos) +
            this.valueIncludingSuggestion.substring(this.suggestionEndPos);
        if (this.suggestionStartPos === selectionStart && this.suggestionEndPos === selectionEnd) {
            this.textArea.setSelectionRange(selectionStart, selectionStart);
        }
        this.suggestionStartPos = null;
        this.suggestionEndPos = null;
        this.textArea.removeAttribute('data-suggestion-visible');
        if (this.virtualCaret) {
            this.virtualCaret.hide();
        }
    }
}

class ContextSuggestion {
    private textArea: HTMLTextAreaElement;
    private latestSuggestionText: string = '';
    private suggestionElement: HTMLDivElement;
    private suggestionPrefixElement: HTMLSpanElement;
    private suggestionTextElement: HTMLSpanElement;
    private showing: boolean = false;

    constructor(container: HTMLElement, textArea: HTMLTextAreaElement) {
        this.textArea = textArea;
        this.suggestionElement = document.createElement('div');
        this.suggestionElement.classList.add('smart-textarea-suggestion-overlay');
        this.suggestionElement.addEventListener('mousedown', (event: MouseEvent) => this.handleSuggestionClicked(event));
        this.suggestionElement.addEventListener('touchend', (event: TouchEvent) => this.handleSuggestionClicked(event));
        this.suggestionPrefixElement = document.createElement('span');
        this.suggestionTextElement = document.createElement('span');
        this.suggestionElement.appendChild(this.suggestionPrefixElement);
        this.suggestionElement.appendChild(this.suggestionTextElement);
        this.suggestionPrefixElement.style.opacity = '0.3';
        const computedStyle: CSSStyleDeclaration = window.getComputedStyle(this.textArea);
        this.suggestionElement.style.font = computedStyle.font;
        this.suggestionElement.style.marginTop = `${1.4 * parseFloat(computedStyle.fontSize)}px`;
        container.appendChild(this.suggestionElement);
    }

    public get currentSuggestion(): string {
        return this.latestSuggestionText;
    }

    public show(suggestionText: string): void {
        this.latestSuggestionText = suggestionText;
        this.suggestionPrefixElement.textContent = suggestionText[0] !== ' ' ? this.getPrefixText(this.textArea, 20) : '';
        this.suggestionTextElement.textContent = suggestionText;
        const position: CaretPosition = CaretPositionHelper.getTextAreaPosition(this.textArea);
        const style: CSSStyleDeclaration = this.suggestionElement.style;
        style.minWidth = null;
        this.suggestionElement.classList.add('smart-textarea-suggestion-overlay-visible');
        style.zIndex = this.textArea.style.zIndex + 1;
        style.top = `${position.top}px`;
        const leftPosition: number = position.left - this.suggestionPrefixElement.offsetWidth;
        if (!style.left || Math.abs(parseFloat(style.left) - leftPosition) > 10) {
            style.left = `${leftPosition}px`;
        }
        this.showing = true;
        const computedStyle: CSSStyleDeclaration = window.getComputedStyle(this.suggestionElement);
        const lineHeight: number = parseFloat(computedStyle.lineHeight);
        const paddingTop: number = parseFloat(computedStyle.paddingTop);
        const paddingBottom: number = parseFloat(computedStyle.paddingBottom);
        const lines: number = Math.round((this.suggestionElement.offsetHeight - paddingTop - paddingBottom) / lineHeight);
        if (lines > 2) {
            const elementWidth: number = this.suggestionElement.offsetWidth;
            style.minWidth = `calc(min(70vw, ${(lines * elementWidth) / 2}px))`;
        }
        const rect: any = this.suggestionElement.getBoundingClientRect();
        if (rect.right > document.body.clientWidth - 20) {
            style.left = `calc(${parseFloat(style.left) - (rect.right - document.body.clientWidth)}px - 2rem)`;
        }
    }

    public accept(): void {
        if (this.showing) {
            CaretPositionHelper.insertCharacter(this.textArea, this.currentSuggestion);
            CaretPositionHelper.adjustScrollToCaretPosition(this.textArea);
            this.hide();
        }
    }

    public reject(): void {
        this.hide();
    }

    public hide(): void {
        if (this.showing) {
            this.showing = false;
            this.suggestionElement.classList.remove('smart-textarea-suggestion-overlay-visible');
        }
    }

    public isShowing(): boolean {
        return this.showing;
    }

    private handleSuggestionClicked(event: MouseEvent | TouchEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.accept();
    }

    private getPrefixText(textArea: HTMLTextAreaElement, maxLength: number): string {
        const value: string = textArea.value;
        const selectionStart: number = textArea.selectionStart;
        for (let i: number = selectionStart - 1; i > selectionStart - maxLength; i--) {
            if (i < 0 || /\s/.test(value[`${i}` as any])) {
                return value.substring(i + 1, selectionStart);
            }
        }
        return '';
    }
}

class VirtualCaret {
    private textArea: HTMLTextAreaElement;
    private caretDiv: HTMLDivElement;
    constructor(smartTextArea: HTMLElement, textArea: HTMLTextAreaElement) {
        this.textArea = textArea;
        this.caretDiv = document.createElement('div');
        this.caretDiv.classList.add('smart-textarea-caret');
        smartTextArea.appendChild(this.caretDiv);
    }

    public show(): void {
        const textAreaPosition: CaretPosition = CaretPositionHelper.getTextAreaPosition(this.textArea);
        const caretStyle: CSSStyleDeclaration = this.caretDiv.style;
        caretStyle.display = 'block';
        caretStyle.top = textAreaPosition.top + 'px';
        caretStyle.left = textAreaPosition.left + 'px';
        caretStyle.height = textAreaPosition.height + 'px';
        caretStyle.zIndex = this.textArea.style.zIndex;
        caretStyle.backgroundColor = (textAreaPosition as any).elemStyle.caretColor;
    }

    public hide(): void {
        this.caretDiv.style.display = 'none';
    }
}
