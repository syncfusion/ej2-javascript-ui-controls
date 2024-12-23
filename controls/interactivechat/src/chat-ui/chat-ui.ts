// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../interactive-chat-base/interactive-chat-base-model.d.ts'/>
import { NotifyPropertyChanges, Property, INotifyPropertyChanged, getUniqueID, isNullOrUndefined as isNOU, EventHandler, L10n, remove } from '@syncfusion/ej2-base';
import { Internationalization, ChildProperty, Collection, removeClass, Event, EmitType, BaseEventArgs, Complex } from '@syncfusion/ej2-base';
import { InterActiveChatBase, ToolbarSettings, ToolbarItemClickedEventArgs } from '../interactive-chat-base/interactive-chat-base';
import { ToolbarItemModel, ToolbarSettingsModel } from '../interactive-chat-base/interactive-chat-base-model';
import { InputEventArgs, FocusOutEventArgs, TextArea } from '@syncfusion/ej2-inputs';
import { ChatUIModel, MessageModel, UserModel, MessageStatusModel } from './chat-ui-model';
import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Fab } from '@syncfusion/ej2-buttons';
export class MessageStatus extends ChildProperty<MessageStatus> {
    /**
     * Specifies the icon CSS class for the message status shown in messages.
     * This property represents the CSS class applied to the icons in the sent message, allowing for customization of the status icon's appearance.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the text associated with the message status.
     * This property holds the textual representation of the message status, such as "Sent", "Received", or "Read", providing users with clear status updates.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the tooltip text for the message status icon.
     * This property provides additional information about the message status when the user hovers over the status icon, enhancing the user experience with context.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public tooltip: string;
}

/**
 * Represents a user model for a messages in the chatUI component.
 */
export class User extends ChildProperty<User> {
    /**
     * Specifies the unique identifier for each user in the Chat UI component.
     * Represents a string that uniquely identifies a user for tracking and managing individual users within the chat.
     *
     * @type {string}
     * @default '''
     */
    @Property('')
    public id: string;
    /**
     * Represents the display name of the user in the Chat UI component.
     *
     * @type {string}
     * @default 'Default'
     */
    @Property('Default')
    public user: string;

    /**
     * Specifies the URL of the user's avatar image.
     * If the URL is not provided, the user's first and last name initial letters will be used as the avatar.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public avatarUrl: string;

    /**
     * Defines the background color for the user's avatar in the Chat UI component.
     * This property accepts a color in hexadecimal format (e.g., `#FFFFFF` for white), allowing for custom styling of the avatar's background.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public avatarBgColor: string;

    /**
     * Represents additional CSS classes to style the user's messages in the Chat UI component.
     * This property allows for custom styling by accepting one or more class names as a string.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public cssClass: string;
}

/**
 *  Represents a model for a messages in the chatUI component.
 */
export class Message extends ChildProperty<Message> {
    /**
     * Specifies the unique identifier for each message sent in the Chat UI component.
     * Represents a string that uniquely identifies a message for tracking and managing individual messages within the chat.
     *
     * @type {string}
     * @default '''
     */
    @Property('')
    public id: string;

    /**
     * Represents the content of the message sent by a user in the Chat UI component.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the author of the message in the Chat UI component.
     * This property references a `UserModel` object that contains details about the user who sent the message.
     *
     * @default null
     */
    @Complex<UserModel>({}, User)
    public author: UserModel;

    /**
     * Specifies the timestamp of when the message was sent.
     * This property holds a `Date` object that represents the exact time the message was created, providing context to the conversation flow.
     *
     * @type {Date}
     * @default ''
     */
    @Property('')
    public timeStamp: Date;

    /**
     * Specifies the format of the timestamp for displaying the message's sending time.
     * By default, the format is set based on the culture of the application.
     * You can customize the format using a specific pattern, such as "'dd/MM/yyyy hh:mm'" in string format.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public timeStampFormat: string;

    /**
     * Specifies the status of the message in the Chat UI component.
     * Represents the current status of the message, such as sent, received, or read. It helps in tracking the messages within the chat component.
     *
     * @default null
     */
    @Complex<MessageStatusModel>({}, MessageStatus)
    public status: MessageStatusModel;
}

export interface MessageSendEventArgs  extends BaseEventArgs {
    /**
     * Indicates whether the message sending action should be canceled.
     * Setting this boolean property to `true` will prevent the message from being sent, allowing for validation or modification before the final send.
     *
     * @type {boolean}
     * @default false
     *
     */
    cancel?: boolean

    /**
     * Represents the message that is intended to be sent.
     * This property holds a `MessageModel` object containing all relevant details of the message, including content, author, and timestamp. It can be modified before the message is sent.
     *
     * @type {MessageModel}
     * @default null
     *
     */
    message?: MessageModel
}

export interface TypingEventArgs extends BaseEventArgs {

    /**
     * Represents the current user in the Chat UI component.
     * This property holds the user information, such as username and other relevant details.
     *
     * @type {UserModel}
     * @default null
     *
     */
    user?: UserModel

    /**
     * Represents the content of the message sent by a user in the Chat UI component.
     *
     * @type {string}
     * @default ''
     */
    message?: string

    /**
     * Specifies the event object associated with the input event args.
     * Represents the underlying event that triggered the action, providing details about the event.
     *
     * @type {Event}
     * @default null
     *
     */
    event?: Event

    /**
     * Specifies the whether the user is typing in the chat UI component.
     * Returns `true`, when the user ends typing and `false` when the message is sent or user value is cleared.
     *
     * @type {boolean}
     * @default false
     *
     */
    isTyping?: boolean
}

@NotifyPropertyChanges
export class ChatUI extends InterActiveChatBase implements INotifyPropertyChanged {

    /**
     * Specifies the width of the Chat UI component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the height of the Chat UI component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public height: string | number;

    /**
     * Represents the current user interacting with the Chat UI.
     * Uses the `UserModel` object, which contains current user information.
     * Messages from the current user are displayed on the right side of the Chat UI for differentiation from other participants.
     *
     * @default null
     */
    @Complex<UserModel>({}, User)
    public user: UserModel;

    /**
     * Specifies the header text to be displayed in the Chat UI component.
     * This property defines the text that appears in the header, which can indicate the current participant's username or the group name, providing context for the conversation.
     * @type {string}
     * @default 'Chat'
     */
    @Property('Chat')
    public headerText: string;

    /**
     * Specifies the CSS class for the header icon in the Chat UI component.
     * This property allows for custom styling of the header icon.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public headerIconCss: string;

    /**
     * Specifies the placeholder text for the message input textarea in the Chat UI component.
     *
     * @type {string}
     * @default 'Type your message…'
     */
    @Property('Type your message…')
    public placeholder: string;

    /**
     * Specifies custom CSS classes for the Chat UI component.
     * This property enables the application of additional styling options to customize the visual appearance of the chat interface.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies whether the header is displayed in the Chat UI component.
     * This property controls the visibility of the header, allowing users to show or hide it as needed.
     * When set to `false`, the header will be hidden from view.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public showHeader: boolean;

    /**
     * Specifies whether to show or hide footer in the Chat UI component.
     * When set to `true`, the footer will be visible in the Chat UI component. If `false`, the footer will be hidden.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public showFooter: boolean;

    /**
     * Specifies the header toolbar settings for the Chat UI component.
     * Represents the configuration for toolbar items and actions within the component.
     *
     * @default null
     */
    @Complex<ToolbarSettingsModel>({ items: [] }, ToolbarSettings)
    public headerToolbar : ToolbarSettingsModel;

    /**
     * Specifies the list of message suggestions displayed above the input textarea in the Chat UI component.
     * This property represents an array of suggestions that can assist the user in composing messages, providing quick replies.
     *
     * @type {string[]}
     * @default null
     */
    @Property([])
    public suggestions: string[];

    /**
     * Specifies whether time breaks are enabled for grouping chat messages by date.
     * When set to `true`, messages will be grouped based on their timestamp, creating date-wise separators within the chat.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public showTimeBreak: boolean;

    /**
     * Specifies a collection of messages within the Chat UI component.
     * Each message is represented by a MessageModel object, containing properties such as text, author, timestamp, and status.
     *
     * @type {MessageModel[]}
     * @default null
     */
    @Collection<MessageModel>([], Message)
    public messages: MessageModel[];

    /**
     * Specifies a list of users who are currently typing in the chat.
     * This property is updated to indicate active participants typing responses.
     *
     * @type {UserModel[]}
     * @default null
     * @aspType List<ChatUIUser>
     */
    @Collection<UserModel>([], User)
    public typingUsers: UserModel[];

    /**
     * Specifies the format of the value that to be displayed in component.
     * By default, the format will be set based on the culture. You can set the format to "format:'dd/MM/yyyy hh:mm a'" in string.
     *
     * @type {string}
     * @default 'dd/MM/yyyy hh:mm a'
     */
    @Property('dd/MM/yyyy hh:mm a')
    public timeStampFormat: string;

    /**
     * Specifies whether timestamps are displayed alongside each message in the Chat UI component.
     * When set to true, timestamps will appear with each message, helping users track the timing of conversations.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public showTimeStamp: boolean;

    /**
     * Specifies whether the UI should automatically scroll to the bottom when a new message is added to the Chat UI component.
     * When set to `true`, the chat will automatically scroll to display the latest message, ensuring that users can see new messages without manual intervention.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public autoScrollToBottom: boolean;

    /**
     * Enables on-demand loading of messages, typically triggered as the user scrolls through the chat history.
     * When set to `true`, older messages will load progressively, improving performance for large message histories by avoiding initial loading of all messages.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public loadOnDemand: boolean;

    /**
     * Specifies the template for rendering suggestion items in the Chat UI component.
     * Defines the content or layout used to render suggestion items, and can be either a string or a function.
     * The template context includes the index and suggestion text.
     *
     * @type {string | Function}
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public suggestionTemplate: string | Function;

    /**
     * Specifies the template for the footer area in the Chat UI component.
     * Defines the content or layout used to render the footer, which can be provided as a string or a function.
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
     * Specifies the template for rendering the empty state of the Chat UI component.
     * This property can accept either a string or a function to customize the appearance when there are no messages to display in the chat.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public emptyChatTemplate: string | Function;

    /**
     * Specifies the template for rendering individual messages in the Chat UI component.
     * This property can accept either a string or a function to customize the appearance of messages. The template context includes message and index.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public messageTemplate: string | Function;

    /**
     * Defines a custom template for rendering time breaks in the Chat UI component.
     * Accepts a string or function that formats the appearance of date-based separators, allowing customization of how messages are visually grouped by date.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public timeBreakTemplate: string | Function;

    /**
     * Template for displaying users currently typing in the chat interface.
     * Accepts a string or function to customize the display format.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public typingUsersTemplate: string | Function;

    /**
     * Event triggered when a message is about to be sent in the Chat UI component.
     * This event allows for cancelling the send action if needed.
     *
     * @event messageSend
     */
    @Event()
    public messageSend: EmitType<MessageSendEventArgs>;

    /**
     * Event triggered when the user is typing a message in the Chat UI component.
     * This event provides updates on the user's typing status.
     *
     * @event userTyping
     */
    @Event()
    public userTyping: EmitType<TypingEventArgs>;

    /* Private variables */
    private l10n: L10n;
    private footer: HTMLElement;
    private sendIcon: HTMLElement;
    private textareaObj: TextArea;
    private viewWrapper: HTMLElement;
    private chatHeader: HTMLElement;
    private messageWrapper: HTMLElement;
    private downArrowIcon: Fab;
    private lastUser: string;
    private intl: Internationalization;
    private indicatorWrapper: HTMLElement;
    private isEmptyChatTemplateRendered: boolean;
    private startIndex: number;
    private batchSize: number = 100;
    private initialLoadSize: number = 100;
    private toolbar: Toolbar;
    private isScrollAtBottom: boolean;
    /**
     * Constructor for creating the component
     *
     * @param {ChatUIModel} options - Specifies the ChatUIModel model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: ChatUIModel, element?: string | HTMLElement) {
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
        return 'EJS-CHATUI';
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'chat-ui';
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
        this.renderChatUIView();
    }

    private renderChatUIView(): void {
        this.intl = new Internationalization();
        this.setDimension(this.element, this.width, this.height);
        this.renderViewSections(this.element, 'e-chat-header', 'e-chat-content');
        this.viewWrapper = this.element.querySelector('.e-chat-content');
        this.chatHeader = this.element.querySelector('.e-chat-header');
        this.renderChatHeader();
        this.renderChatContentElement();
        this.renderChatSuggestionsElement();
        this.renderChatFooterContent();
        this.addCssClass(this.element, this.cssClass);
        this.addRtlClass(this.element, this.enableRtl);
        this.updateHeader(this.showHeader, this.chatHeader, this.viewWrapper);
        if (isNOU(this.messages) || this.messages.length <= 0) {
            this.renderBannerView(this.emptyChatTemplate, this.messageWrapper, 'emptyChatTemplate');
            this.isEmptyChatTemplateRendered =  isNOU(this.messageWrapper.querySelector('.e-empty-chat-template')) ? false : true;
        }
        this.wireEvents();
        this.renderTypingIndicator();
        this.scrollToBottom();
    }
    private renderChatHeader(): void {
        if (this.headerText) {
            const headerContainer: HTMLDivElement = this.createElement('div', { className: 'e-header' });
            if (this.headerIconCss) {
                const iconElement: HTMLSpanElement = this.createElement('span', { className: `e-header-icon e-icons ${this.headerIconCss}` });
                headerContainer.appendChild(iconElement);
            }
            const headerTextElement: HTMLDivElement = this.createElement('div', { className: 'e-header-text' });
            headerTextElement.innerHTML = this.headerText;
            headerContainer.appendChild(headerTextElement);
            this.chatHeader.appendChild(headerContainer);
            this.renderChatHeaderToolbar(headerContainer);
        }
    }

    private renderChatHeaderToolbar(headerContainer: HTMLElement): void {
        if (!isNOU(this.headerToolbar) && this.headerToolbar.items.length > 0) {
            const toolbarEle: HTMLElement = this.createElement('div', {attrs: {class: 'e-chat-toolbar'}});
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const pushToolbar: ItemModel[] = this.headerToolbar.items.map((item: any) => ({
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
            this.toolbar = new Toolbar({
                items: pushToolbar,
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
                    if (this.headerToolbar.itemClicked) {
                        this.headerToolbar.itemClicked.call(this, eventArgs);
                    }
                }
            });
            this.toolbar.appendTo(toolbarEle);
            headerContainer.appendChild(toolbarEle);
        }
    }
    private updateHeaderToolbar(): void {
        const headerContainer: HTMLDivElement = this.chatHeader.querySelector('.e-header');
        if (!isNOU(this.toolbar)) {
            const pushToolbar: ItemModel[] = this.headerToolbar.items.map((item: any) => ({
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
            this.toolbar.items = pushToolbar;
        }
        else {
            this.renderChatHeaderToolbar(headerContainer);
        }
    }

    private renderChatContentElement(): void{
        this.messageWrapper = this.createElement('div', {className: 'e-message-wrapper'});
        this.viewWrapper.prepend(this.messageWrapper);
        this.renderMessageGroup(this.messageWrapper);
        this.content = this.createElement('div', {attrs: {class: 'e-typing-suggestions'} });
        this.viewWrapper.append(this.content);
        this.renderScrollDown();
    }
    private renderScrollDown(): void {
        const scrollDownButton: HTMLButtonElement = this.createElement('button', {id: 'scrollDownButton'} );
        this.downArrowIcon = new Fab({
            iconCss: 'e-icons e-chat-scroll-down',
            position: 'BottomRight',
            target: this.content,
            isPrimary: false
        });
        this.downArrowIcon.appendTo(scrollDownButton);
    }

    private renderMessageGroup(chatContentWrapper: HTMLElement): void {
        if (this.loadOnDemand) {
            createSpinner({target: this.messageWrapper});
            this.startIndex = Math.max(0, this.messages.length - this.initialLoadSize);
            const initialMessages: MessageModel[] = this.messages.slice(this.startIndex);
            initialMessages.forEach((msg: MessageModel, i: number) => {
                const currIndex: number = this.startIndex + i;
                const prevIndex: number = i === 0 ? -1 : currIndex - 1;
                this.renderGroup(chatContentWrapper, msg, false, currIndex, prevIndex);
            });
        }
        else {
            this.messages.forEach((msg: MessageModel, i: number) => {
                this.renderGroup(chatContentWrapper, msg, false, i, i - 1);
            });
        }
    }
    private isTimeBreakAdded(chatContentWrapper: HTMLElement, loadOldChat: boolean): boolean {
        return loadOldChat ?
            chatContentWrapper.firstElementChild.classList.contains('e-timebreak') :
            chatContentWrapper.lastElementChild.classList.contains('e-timebreak');
    }
    private renderGroup(chatContentWrapper: HTMLElement, msg: MessageModel, loadOldChat: boolean, index: number, prevIndex: number): void {
        let messageGroup: HTMLDivElement | null;
        if (!loadOldChat) {
            this.updateMessageTimeFormats(msg, index);
            this.handleTimeBreak(prevIndex, index, loadOldChat);
        }
        if (msg.author.id === this.user.id) {
            if ((msg.author.id !== this.lastUser) || (this.showTimeBreak && this.isTimeBreakAdded(chatContentWrapper, loadOldChat))) {
                messageGroup = this.createElement('div', {className: `e-message-group e-right ${this.messageTemplate ? 'e-message-item-template' : ''}`});
                this.manageChatContent(loadOldChat, chatContentWrapper, messageGroup);
                this.addGroupItems(msg, messageGroup, false, true, index, loadOldChat);
            }
            else {
                const length: number = this.element.querySelectorAll('.e-message-group.e-right').length;
                messageGroup = this.element.querySelectorAll('.e-message-group.e-right')[loadOldChat ? 0 : length - 1] as HTMLDivElement;
                this.addGroupItems(msg, messageGroup, false, true, index, loadOldChat);
            }
        }
        else {
            if (this.lastUser !== msg.author.id || this.isTimeVaries(index, prevIndex)) {
                messageGroup = this.createElement('div', {className: `e-message-group e-left ${this.messageTemplate ? 'e-message-item-template' : ''}`});
                const avatarElement: HTMLElement = this.createAvatarIcon(msg.author, false);
                if (!this.messageTemplate) { messageGroup.prepend(avatarElement); }
                this.manageChatContent(loadOldChat, chatContentWrapper, messageGroup);
                if (this.loadOnDemand) {
                    this.loadLeftGroupOnDemand(msg, loadOldChat, index, messageGroup);
                }
                else {
                    this.createLeftGroupItems(messageGroup, msg, index);
                    this.addGroupItems(msg, messageGroup, true, false, index, loadOldChat);
                }
            }
            else {
                const length: number = this.element.querySelectorAll('.e-message-group.e-left').length;
                messageGroup = this.element.querySelectorAll('.e-message-group.e-left')[loadOldChat ? 0 : length - 1] as HTMLDivElement;
                if (!loadOldChat) {
                    this.addGroupItems(msg, messageGroup, false, false, index, loadOldChat);
                }
                else {
                    this.loadLeftGroupOnDemand(msg, loadOldChat, index, messageGroup);
                }
            }
        }
        this.lastUser = msg.author.id;
    }
    private isTimeVaries(index: number, prevIndex: number): boolean {
        const currentMessageDate: Date = this.getMessageDate(index);
        currentMessageDate.setHours(0, 0, 0, 0);
        const lastMessageDate: Date = this.getMessageDate(prevIndex);
        lastMessageDate.setHours(0, 0, 0, 0);
        return currentMessageDate.getTime() !== lastMessageDate.getTime();
    }
    private loadLeftGroupOnDemand(msg: MessageModel, loadOldChat: boolean, index: number, messageGroup: HTMLDivElement): void {
        // To check if the previous author is the same as the current author. If not, create a group header.
        const isAnyMsgPresent: boolean = this.messages[index - 1] ? true : false;
        const prevAuthorId: string = isAnyMsgPresent ? this.messages[index - 1].author.id : '';
        const shouldCreateHeader: boolean = prevAuthorId !== msg.author.id ? true : false;
        if (shouldCreateHeader || this.isTimeVaries(index, index - 1)) {
            this.addGroupItems(msg, messageGroup, true, false, index, loadOldChat);
            this.createLeftGroupItems(messageGroup, msg, index);
        }
        else {
            this.addGroupItems(msg, messageGroup, false, false, index, loadOldChat);
        }
    }
    private createLeftGroupItems(messageGroup: HTMLElement | null, msg: MessageModel, index: number): void {
        if (this.messageTemplate) { return; }
        const userHeaderContainer: HTMLDivElement = this.createElement('div', {
            className: 'e-message-header-container'
        });
        const userHeader: HTMLElement = this.createElement('div', {
            className: 'e-message-header'
        });
        userHeader.innerHTML = msg.author.user;
        const timeSpan : HTMLDivElement = this.getTimeStampElement(msg.timeStamp
            ? msg.timeStamp
            : new Date(), msg.timeStampFormat, index);
        this.appendChildren(userHeaderContainer, userHeader, timeSpan);
        this.insertBeforeChildren(messageGroup, userHeaderContainer);
    }
    private createAvatarIcon(author: UserModel, isTypingUser: boolean): HTMLElement {
        const userName: string = author.user.trim();
        const nameParts: string[] = userName.split(' ');
        const initials: string = nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
            : userName[0];
        const avatarIcon: HTMLElement = this.createElement((!isNOU(author.avatarUrl) && author.avatarUrl !== '') ? 'img' : 'span',
                                                           {className: ` ${!isTypingUser ? 'e-message-icon' : 'e-user-icon'} ${author.cssClass}`});
        if (author.avatarBgColor) {
            avatarIcon.style.backgroundColor = author.avatarBgColor;
        }
        if (!isNOU(author.avatarUrl) && author.avatarUrl !== '') {
            (avatarIcon as HTMLImageElement).src = author.avatarUrl;
            (avatarIcon as HTMLImageElement).alt = userName;
        }
        else {
            avatarIcon.innerHTML = initials;
        }
        return avatarIcon;
    }
    private getTimeStampElement (timeStamp: Date, timeStampFormat: string, index?: number): HTMLDivElement {
        const formattedTime: string = this.getFormattedTime(timeStamp, timeStampFormat);
        return this.createElement('div', {
            className: 'e-time',
            innerHTML: this.showTimeStamp ? formattedTime : ''
        });
    }
    private updateTimeFormats(timeStampFormat: string, fullTime: string, index?: number): void {
        if (this.messages[parseInt(index.toString(), 10)]) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.messages[parseInt(index.toString(), 10)].timeStamp = this.intl.parseDate(
                fullTime,
                { format: 'dd/MM/yyyy hh:mm a'});
            this.messages[parseInt(index.toString(), 10)].timeStampFormat = timeStampFormat;
            this.isProtectedOnChange = prevOnChange;
        }
    }
    private getFormattedTime(timeStamp: Date, timeStampFormat: string): string{
        return this.intl.formatDate(timeStamp, { format: this.getFormat(timeStampFormat) });
    }
    private getFormat(timeStampFormat: string): string {
        const hasValue: boolean = !isNOU(timeStampFormat) && timeStampFormat.length > 0;
        return hasValue ? timeStampFormat
            : (!isNOU(this.timeStampFormat) && this.timeStampFormat.length) ? this.timeStampFormat : 'dd/MM/yyyy hh:mm a';
    }
    private addGroupItems(msg: MessageModel, messageGroup: HTMLDivElement, isUserTimeStampRendered: boolean,
                          showStatus: boolean, index: number, loadOldChat: boolean): void {
        const messageItem : HTMLDivElement = this.createElement('div', { className: 'e-message-item'});
        const messageStatusWrapper : HTMLDivElement = this.createElement('div', {className: 'e-status-wrapper'});
        const timeSpan : HTMLDivElement = this.getTimeStampElement(msg.timeStamp ? msg.timeStamp : new Date(), msg.timeStampFormat, index);
        const textElement : HTMLDivElement = this.createElement('div', {
            className: 'e-text',
            innerHTML: msg.text
        });
        if (this.messageTemplate) {
            this.getContextObject('messageTemplate', messageGroup, index, msg);
        } else {
            if (!isUserTimeStampRendered) { messageItem.appendChild(timeSpan); }
            if (showStatus) {
                const messageElement : HTMLDivElement = this.createElement('div', { className: 'e-status-item'});
                const statusIcon : HTMLSpanElement = this.createElement('span', { attrs: {class: `e-status-icon ${msg.status ? msg.status.iconCss : ''}`, title: `${msg.status ? msg.status.tooltip : ''}`} });
                const statusText : HTMLDivElement = this.createElement('div', { innerHTML: msg.status ? msg.status.text : '' , className: 'e-status-text'} );
                this.appendChildren(messageElement, textElement, statusIcon);
                this.appendChildren(messageStatusWrapper, messageElement, statusText);
                messageItem.appendChild(messageStatusWrapper);
            }
            else {
                messageItem.appendChild(textElement);
            }
            this.manageChatContent(loadOldChat, messageGroup, messageItem);
        }
    }
    private manageChatContent(loadOldChat: boolean, parentItem: HTMLElement, ChildItem: HTMLElement): void {
        if (loadOldChat) { parentItem.prepend(ChildItem); }
        else { parentItem.appendChild(ChildItem); }
    }
    private createTimebreakElement(date: Date): HTMLElement{
        const timebreakDiv: HTMLElement = this.createElement('div', {className: `e-timebreak ${this.timeBreakTemplate ? 'e-timebreak-template' : ''}`});
        const formattedTime: string = this.getFormattedTime(date, 'MMMM d, yyyy');
        if (this.timeBreakTemplate) {
            this.getContextObject('timeBreakTemplate', timebreakDiv, null, null, date);
        } else {
            const timeStampEle: HTMLSpanElement = this.createElement('span', {className: 'e-timestamp'});
            timeStampEle.innerHTML = formattedTime;
            timebreakDiv.appendChild(timeStampEle);
        }
        return timebreakDiv;
    }
    private handleTimeBreak(lastMsgIndex: number, index: number, loadOldChat: boolean): void {
        if (!this.showTimeBreak) {
            return;
        }
        const currentMessageDate: Date = this.getMessageDate(index);
        currentMessageDate.setHours(0, 0, 0, 0);
        if (lastMsgIndex === -1) {
            this.messageWrapper.appendChild(this.createTimebreakElement(currentMessageDate));
        } else if (index > 0) {
            const lastMessageDate: Date = this.getMessageDate(lastMsgIndex);
            lastMessageDate.setHours(0, 0, 0, 0);
            if ((currentMessageDate.getTime() !== lastMessageDate.getTime()) && !loadOldChat) {
                this.messageWrapper.appendChild(this.createTimebreakElement(currentMessageDate));
            }
        }
    }
    private renderNewMessage(msg: MessageModel, index: number): void {
        if (this.isEmptyChatTemplateRendered) {
            const introContainer: HTMLElement = this.messageWrapper.querySelector('.e-empty-chat-template');
            this.messageWrapper.removeChild(introContainer);
            this.isEmptyChatTemplateRendered = false;
        }
        this.renderGroup(this.messageWrapper, msg, false, index, index - 1);
    }
    private loadMoreMessages(): void {
        if (this.startIndex <= 0) { return; }
        const currentScrollOffset: number = this.messageWrapper.scrollHeight - this.messageWrapper.scrollTop;
        showSpinner(this.messageWrapper);
        setTimeout(() => {
            hideSpinner(this.messageWrapper);
            const endIndex: number = this.startIndex; // To slice up to the previously rendered message items.
            this.startIndex = Math.max(0, this.startIndex - this.batchSize);
            const nextBatchMessages: MessageModel[] = this.messages.slice(this.startIndex, endIndex);
            nextBatchMessages.reverse().forEach((msg: MessageModel, i: number) => {
                const currIndex: number = (endIndex - i) - 1; // To pass the actual index of the reversed item.
                const prevIndex: number = currIndex + 1;
                this.updateMessageTimeFormats(msg, currIndex);
                const currentMessageDate: Date = this.getMessageDate(currIndex);
                currentMessageDate.setHours(0, 0, 0, 0);
                const lastMessageDate: Date = this.getMessageDate(prevIndex);
                lastMessageDate.setHours(0, 0, 0, 0);
                if (currIndex >= 0) {
                    if (currentMessageDate.getTime() === lastMessageDate.getTime()) {
                        const prevTimeBreak: HTMLDivElement = this.messageWrapper.querySelectorAll('.e-timebreak')[0] as HTMLDivElement;
                        if (prevTimeBreak) {
                            prevTimeBreak.remove();
                        }
                    }
                }
                this.renderGroup(this.messageWrapper, msg, true , currIndex, prevIndex);
                this.messageWrapper.prepend(this.createTimebreakElement(currentMessageDate));
                this.messageWrapper.scrollTop = this.messageWrapper.scrollHeight - currentScrollOffset;
            });
        }, 1000);
    }
    private updateMessageTimeFormats(msg: MessageModel, index: number): void {
        const fullTime: string = this.getFormattedTime(msg.timeStamp
            ? msg.timeStamp
            : new Date(), 'dd/MM/yyyy hh:mm a');
        this.updateTimeFormats(msg.timeStampFormat, fullTime, index);
    }
    private getMessageDate(index: number): Date {
        return new Date(this.messages[parseInt(index.toString(), 10)].timeStamp);
    }
    private renderChatSuggestionsElement(): void {
        if (!isNOU(this.suggestions) && this.suggestions.length > 0) {
            this.renderSuggestions(this.suggestions, null, this.suggestionTemplate, 'suggestion', 'suggestionTemplate', this.onSuggestionClick);
        }
    }
    private handleSuggestionUpdate(): void {
        if (this.suggestionsElement) { this.suggestionsElement.remove(); }
        if (!isNOU(this.suggestions) && this.suggestions.length > 0) {
            this.renderSuggestions(this.suggestions, null, this.suggestionTemplate, 'suggestion', 'suggestionTemplate', this.onSuggestionClick);
        }
        this.toggleScrollIcon();
    }
    private onSuggestionClick(e: Event): void {
        this.suggestionsElement.hidden = true;
        this.textareaObj.value = (e.target as HTMLElement).innerText;
        this.onSendIconClick(e);
    }
    private renderChatFooterContent(): void {
        this.footer = this.getElement('footer');
        const footerClass: string = `e-footer ${this.footerTemplate ? 'e-footer-template' : ''}`;
        this.footer.className = footerClass;
        this.renderChatFooter();
        this.viewWrapper.append(this.footer);
        this.updateFooter(this.showFooter, this.footer);
    }

    private renderChatFooter(): void {
        this.textareaObj = this.renderFooterContent(this.footerTemplate, this.footer, '',
                                                    this.placeholder, false, this.getRowCount(''), 'e-chat-textarea');
        const sendIconClass: string = 'e-chat-send e-icons disabled';
        if (!this.footerTemplate) { this.sendIcon = this.renderSendIcon(sendIconClass, this.footer); }
        if (this.textareaObj) {
            this.textareaObj.input = this.handleInput.bind(this);
            this.textareaObj.blur = (args: FocusOutEventArgs) => this.triggerUserTyping(args.event, args.value);
            if (!isNOU(this.textareaObj.value)) {
                this.activateSendIcon(this.textareaObj.value.length);
            }
        }
    }
    private handleInput(args: InputEventArgs): void {
        this.triggerUserTyping(args.event, args.value);
        this.activateSendIcon(args.value.length);
        this.updateTextAreaObject(args.value);
    }
    private triggerUserTyping(event: Event, value: string): void {
        const eventArgs: TypingEventArgs = {
            event: event,
            message: value,
            user: this.user,
            isTyping: event.type === 'blur' ? false : value.length > 0 ? true : false
        };
        this.trigger('userTyping', eventArgs);
    }
    private renderTypingIndicator(): void {
        this.l10n = new L10n('chat-ui', {
            oneUserTyping: '{0} is typing',
            twoUserTyping: '{0} and {1} are typing',
            threeUserTyping: '{0}, {1}, and {2} other are typing',
            multipleUsersTyping: '{0}, {1}, and {2} others are typing'
        }, this.locale);
        if (this.indicatorWrapper) {
            this.indicatorWrapper.remove();
        }
        if (!this.typingUsers || this.typingUsers.length === 0) {
            return;
        }
        this.indicatorWrapper = this.createElement('div', {
            className: `e-typing-indicator ${this.typingUsersTemplate ? 'e-typing-indicator-template' : ''}`
        });
        if (this.typingUsersTemplate) {
            this.getContextObject('typingUsersTemplate', this.indicatorWrapper, null, null, null);
        }
        else {
            this.typingUsers.slice(0, 3).forEach((user: UserModel) => {
                const avatarElement: HTMLElement = this.createAvatarIcon(user, true);
                this.indicatorWrapper.appendChild(avatarElement);
            });
            const typingMessage: HTMLDivElement = this.createElement('span', { className: 'e-user-text' });
            this.indicatorWrapper.appendChild(typingMessage);
            this.updateUserText();
            const indicatorContainer: HTMLDivElement = this.createElement('div', { className: 'e-indicator-wrapper' });
            for (let i: number = 0; i < 3; i++) {
                const indicator: HTMLDivElement = this.createElement('span', {
                    className: 'e-indicator'
                });
                this.appendChildren(indicatorContainer, indicator);
            }
            this.indicatorWrapper.appendChild(indicatorContainer);
        }
        this.content.prepend(this.indicatorWrapper);
    }
    private updateUserText(): void {
        if (this.typingUsersTemplate) { return; }
        this.l10n.setLocale(this.locale);
        const userNames: string[] = this.typingUsers.filter((user: UserModel) => user.user !== this.user.user)
            .map((user: UserModel) => user.user);
        const displayText: string = this.getTypingMessage(userNames);
        const typingMessage: HTMLDivElement = this.indicatorWrapper.querySelector('.e-user-text');
        typingMessage.innerHTML = displayText;
    }
    private getTypingMessage(userNames: string[]): string {
        if (userNames.length >= 3) {
            return this.l10n.getConstant( userNames.length > 3 ? 'multipleUsersTyping' : 'threeUserTyping')
                .replace('{0}', userNames[0].toString())
                .replace('{1}', userNames[1].toString())
                .replace('{2}', (userNames.length - 2).toString());
        } else {
            const userTemplate: string = this.l10n.getConstant( userNames.length === 2 ? 'twoUserTyping' : 'oneUserTyping');
            return userNames.length === 2
                ? userTemplate.replace('{0}', userNames[0].toString()).replace('{1}', userNames[1].toString())
                : userTemplate.replace('{0}', userNames[0].toString());
        }
    }
    private updateTypingUsers(users: UserModel[]): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.typingUsers = users;
        this.isProtectedOnChange = prevOnChange;
        this.renderTypingIndicator();
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
    private updateHeaderIcon(): void {
        const existingIconElement: HTMLDivElement | null = this.element.querySelector('.e-header-icon');
        if (existingIconElement) {
            existingIconElement.className = `e-header-icon e-icons ${this.headerIconCss}`;
        }
        else {
            const headerContainer: HTMLDivElement | null = this.element.querySelector('.e-header');
            if (headerContainer) {
                const iconElement: HTMLSpanElement = this.createElement('span', {
                    className: `e-header-icon e-icons ${this.headerIconCss}`
                });
                headerContainer.prepend(iconElement);
            }
        }
    }
    private updateHeaderText(): void {
        if (this.headerText) {
            const headerTextEle: HTMLDivElement | null = this.element.querySelector('.e-header-text');
            if (headerTextEle) {
                headerTextEle.innerHTML = this.headerText;
            }
        }
    }
    private renderUpdatedMessage(): void {
        this.lastUser = '';
        this.messageWrapper.innerHTML = '';
        this.renderMessageGroup(this.messageWrapper);
    }
    private onSendIconClick(event: KeyboardEvent | Event): void {
        if (!this.textareaObj.value.trim()) {
            return;
        }
        let newMessageObj: MessageModel = {
            id: getUniqueID('e-message-'),
            author: this.user,
            text: this.textareaObj.value
        };
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.textareaObj.value = '';
        this.activateSendIcon(this.textareaObj.value.length);
        const eventArgs: MessageSendEventArgs = {
            cancel: false,
            message: newMessageObj
        };
        this.triggerUserTyping(event as Event , '');
        this.trigger('messageSend', eventArgs, (args: MessageSendEventArgs) => {
            if (args.cancel) { return; }
            newMessageObj = args.message;
            this.isProtectedOnChange = true;
            this.messages = [...this.messages, newMessageObj];
            this.isProtectedOnChange = prevOnChange;
            this.renderNewMessage(newMessageObj, (this.messages.length - 1));
        });
        if (this.suggestionsElement) { this.suggestionsElement.hidden = false; }
        this.scrollToBottom();
    }
    private getContextObject(
        templateName: string,
        contentElement: HTMLElement,
        index?: number,
        message?: MessageModel,
        currentMessagedate?: Date
    ): void {
        let template: string | Function;
        let context: object = { };
        switch (templateName.toLowerCase()) {
        case 'messagetemplate': {
            template = this.messageTemplate;
            context = { message: message, index: index};
            break;
        }
        case 'timebreaktemplate': {
            template = this.timeBreakTemplate;
            context = { messageDate: currentMessagedate};
            break;
        }
        case 'typinguserstemplate': {
            template = this.typingUsersTemplate;
            context = { users: this.typingUsers };
            break;
        }
        }
        this.updateContent(template, contentElement, context, templateName);
    }
    private handleAutoScroll(): void {
        if (this.isScrollAtBottom) {
            this.updateScroll(this.messageWrapper);
        }
        if (this.autoScrollToBottom) { this.updateScroll(this.messageWrapper); }
        this.toggleScrollIcon();
    }
    private footerKeyHandler(e: KeyboardEvent): void {
        this.keyHandler(e, 'footer');
    }
    private scrollBottomKeyHandler(e: KeyboardEvent): void {
        this.keyHandler(e, 'scrollBottom');
    }
    private keyHandler(event: KeyboardEvent, value: string): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            switch (value) {
            case 'footer':
                event.preventDefault();
                this.onSendIconClick(event);
                this.updateTextAreaObject(this.textareaObj.value);
                break;
            case 'scrollBottom':
                this.scrollToBottom();
                break;
            }
        }
    }
    private updateFooter(showFooter: boolean, footerElement: HTMLElement): void {
        if (!showFooter) { footerElement.hidden = true; }
        else { footerElement.hidden = false; }
    }
    private handleScroll(): void {
        const atBottom: boolean = this.checkScrollAtBottom();
        if (atBottom) {
            this.toggleClassName(this.downArrowIcon.element, atBottom, 'downArrow');
            const suggestionEle: HTMLDivElement | null = this.element.querySelector('.e-suggestions');
            if (suggestionEle) {
                this.toggleClassName(suggestionEle, atBottom, 'suggestion');
                if (!atBottom || !this.isScrollAtBottom) {
                    this.updateScroll(this.messageWrapper);
                }
            }
        }
        if (this.loadOnDemand && this.messageWrapper.scrollTop === 0) {
            this.loadMoreMessages();
        }
        this.isScrollAtBottom = atBottom;
    }
    private checkScrollAtBottom(): boolean {
        const scrollThreshold: number = 5;
        const scrollTop: number = Math.floor(this.messageWrapper.scrollTop);
        const scrollHeight: number = Math.floor(this.messageWrapper.scrollHeight);
        const clientHeight: number = Math.floor(this.messageWrapper.clientHeight);
        return scrollHeight - scrollTop <= clientHeight + scrollThreshold;
    }
    private toggleClassName(element: HTMLElement, atBottom: boolean, name: string): void {
        switch (name) {
        case 'downArrow':
            element.classList.toggle('e-arrowdown-hide', atBottom);
            element.classList.toggle('e-arrowdown-show', !atBottom);
            break;
        case 'suggestion':
            element.classList.toggle('e-show-suggestions', atBottom);
            element.classList.toggle('e-hide-suggestions', !atBottom);
            break;
        case 'scroll':
            element.classList.toggle('e-scroll-smooth', !atBottom);
            break;
        }
    }
    private toggleScrollIcon(): void {
        const atBottom: boolean = this.checkScrollAtBottom();
        this.toggleClassName(this.downArrowIcon.element, atBottom, 'downArrow');
        const suggestionEle: HTMLDivElement | null = this.element.querySelector('.e-suggestions');
        if (suggestionEle) {
            this.toggleClassName(suggestionEle, atBottom, 'suggestion');
            if (atBottom) { this.updateScroll(this.messageWrapper); }
        }
        this.isScrollAtBottom = atBottom;
    }
    private scrollBtnClick(): void {
        this.toggleClassName(this.messageWrapper, false, 'scroll');
        this.scrollToBottom();
        this.toggleClassName(this.messageWrapper, true, 'scroll');
    }
    private wireEvents(): void {
        this.wireFooterEvents(this.sendIcon, this.footer, this.footerTemplate);
        EventHandler.add(this.messageWrapper, 'scroll', this.handleScroll, this);
        EventHandler.add(this.downArrowIcon.element, 'click', this.scrollBtnClick, this);
        EventHandler.add(this.downArrowIcon.element, 'keydown', this.scrollBottomKeyHandler, this);
    }
    private unwireEvents(): void {
        this.unWireFooterEvents(this.sendIcon, this.footer, this.footerTemplate);
        EventHandler.remove(this.messageWrapper, 'scroll', this.handleScroll);
        EventHandler.remove(this.downArrowIcon.element, 'click', this.scrollBtnClick);
        EventHandler.remove(this.downArrowIcon.element, 'keydown', this.scrollBottomKeyHandler);
    }
    private destroyChatUI(): void {
        const properties: string [] = [
            'content',
            'sendIcon',
            'footer',
            'indicatorWrapper',
            'messageWrapper',
            'viewWrapper',
            'chatHeader'
        ];

        for (const prop of properties) {
            const element: keyof ChatUI = prop as keyof ChatUI;
            this.removeAndNullify(this[element as keyof ChatUI]);
            (this[element as keyof ChatUI] as HTMLElement) = null;
        }
    }
    /**
     * Scrolls to the last message in the conversation area of the Chat UI component.
     * This method allows programmatic control to ensure the chat view is scrolled to the bottom, typically used when new messages are added or to refocus on the most recent conversation.
     *
     * @returns {void}
     */
    public scrollToBottom(): void {
        this.updateScroll(this.messageWrapper);
        this.toggleScrollIcon();
    }

    /**
     * Appends a new message to the end of the Chat UI conversation area.
     * This method adds the specified message as the latest entry in the chat:
     *
     * @function addMessage
     * @param {string | MessageModel} message - The message to be added to the conversation. Accepts either a plain text string or a `MessageModel` object.
     * - If `message` is a string, a `MessageModel` will be automatically created with the current user’s details, and the message will be appended.
     * - If `message` is an instance of `MessageModel`, it can represent a message from either the current user or another participant and will be appended directly.
     * @returns {void} No return value.
     */
    public addMessage(message: string | MessageModel): void {
        if (isNOU(message)) { return; }
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (typeof message === 'string') {
            const newMessageObj: MessageModel = {
                id: getUniqueID('e-message-'),
                author: this.user,
                text: message,
                timeStamp: new Date(),
                timeStampFormat: this.timeStampFormat
            };
            this.messages = [...this.messages, newMessageObj];
            this.renderNewMessage(newMessageObj, (this.messages.length - 1));
        }
        else {
            this.messages = [...this.messages, message];
            this.renderNewMessage(message, (this.messages.length - 1));
        }
        this.handleAutoScroll();
        this.isProtectedOnChange = prevOnChange;
    }

    /**
     * Updates an existing message in the Chat UI component.
     * This method allows for modifying a message that has already been added to the conversation.
     * It requires the unique identifier of the message to be updated and the new message content as a `MessageModel`.
     *
     * @function updateMessage
     * @param {MessageModel} message - The updated message content represented as a `MessageModel`.
     * @param {string} msgId - The unique identifier of the message to be updated.
     * @returns {void} No return value.
     */
    public updateMessage(message: MessageModel, msgId: string): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.messages = this.messages.map((messageItem: MessageModel) =>
            messageItem.id === msgId ? { ...messageItem, ...message } : messageItem
        );
        this.renderUpdatedMessage();
        this.isProtectedOnChange = prevOnChange;
    }

    public destroy(): void {
        super.destroy();
        this.unwireEvents();
        if (this.cssClass) { removeClass([this.element], this.cssClass.split(' ')); }
        this.element.classList.remove('e-rtl');
        this.destroyAndNullify(this.textareaObj);
        this.destroyAndNullify(this.downArrowIcon);
        this.destroyAndNullify(this.toolbar);
        this.destroyChatUI();
        this.intl = null;
        this.lastUser = null;
    }

    /**
     * Called if any of the property value is changed.
     *
     * @param  {ChatUIModel} newProp - Specifies new properties
     * @param  {ChatUIModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: ChatUIModel, oldProp?: ChatUIModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
            case 'height':
                this.setDimension(this.element, this.width, this.height);
                break;
            case 'placeholder':
                if (this.textareaObj) { this.textareaObj.placeholder = this.placeholder; }
                break;
            case 'cssClass':
                this.updateCssClass(this.element, newProp.cssClass, oldProp.cssClass);
                break;
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove']('e-rtl');
                break;
            case 'showHeader':
                this.updateHeader(this.showHeader, this.chatHeader, this.viewWrapper);
                break;
            case 'headerText':
                this.updateHeaderText();
                break;
            case 'headerIconCss':
                this.updateHeaderIcon();
                break;
            case 'messages': {
                this.renderUpdatedMessage();
                this.handleAutoScroll();
                break;
            }
            case 'user': {
                const newUser: UserModel = {
                    id: newProp.user.id,
                    user: newProp.user.user,
                    avatarUrl: newProp.user.avatarUrl,
                    avatarBgColor: newProp.user.avatarBgColor,
                    cssClass: newProp.user.cssClass
                };
                this.user = {...this.user, ...newUser};
                break;
            }
            case 'showTimeStamp':
            case 'timeStampFormat':
            case 'showTimeBreak':
                if (this.messages.length > 0) { this.renderUpdatedMessage(); }
                break;
            case 'showFooter':
                this.updateFooter(this.showFooter, this.footer);
                break;
            case 'autoScrollToBottom':
                this.handleAutoScroll();
                break;
            case 'suggestions':
                this.handleSuggestionUpdate();
                break;
            case 'typingUsers':
                this.updateTypingUsers(this.typingUsers);
                break;
            case 'locale':
                if (!this.typingUsers || this.typingUsers.length === 0) {
                    return;
                }
                this.updateUserText();
                break;
            case 'headerToolbar':
                this.updateHeaderToolbar();
                break;
            case 'currencyCode':
                this.refresh();
                break;
            }
        }
    }
}
