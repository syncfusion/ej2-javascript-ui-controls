import { NotifyPropertyChanges, Property, INotifyPropertyChanged, getUniqueID, isNullOrUndefined as isNOU, EventHandler, L10n, remove } from '@syncfusion/ej2-base';import { Internationalization, ChildProperty, Collection, removeClass, Event, EmitType, BaseEventArgs, Complex } from '@syncfusion/ej2-base';import { InterActiveChatBase, ToolbarSettings, ToolbarItemClickedEventArgs, TextState, ToolbarItem } from '../interactive-chat-base/interactive-chat-base';import { ToolbarItemModel, ToolbarSettingsModel } from '../interactive-chat-base/interactive-chat-base-model';import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2-navigations';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { Fab } from '@syncfusion/ej2-buttons';import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { FieldSettingsModel, Mention, SelectEventArgs } from '@syncfusion/ej2-dropdowns';import { BeforeUploadEventArgs, FailureEventArgs, FileInfo, RemovingEventArgs, SuccessEventArgs, Uploader, UploadingEventArgs } from '@syncfusion/ej2-inputs';import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import {MessageToolbarItemClickedEventArgs,SaveFormat,ChatAttachmentClickEventArgs,MessageSendEventArgs,TypingEventArgs,MentionSelectEventArgs} from "./chat-ui";
import {InterActiveChatBaseModel} from "../interactive-chat-base/interactive-chat-base-model";

/**
 * Interface for a class MessageStatus
 */
export interface MessageStatusModel {

    /**
     * Specifies the icon CSS class for the message status shown in messages.
     * This property represents the CSS class applied to the icons in the sent message, allowing for customization of the status icon's appearance.
     *
     * @type {string}
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the text associated with the message status.
     * This property holds the textual representation of the message status, such as "Sent", "Received", or "Read", providing users with clear status updates.
     *
     * @type {string}
     * @default ''
     */
    text?: string;

    /**
     * Specifies the tooltip text for the message status icon.
     * This property provides additional information about the message status when the user hovers over the status icon, enhancing the user experience with context.
     *
     * @type {string}
     * @default ''
     */
    tooltip?: string;

}

/**
 * Interface for a class User
 */
export interface UserModel {

    /**
     * Specifies the unique identifier for each user in the Chat UI component.
     * Represents a string that uniquely identifies a user for tracking and managing individual users within the chat.
     *
     * @type {string}
     * @default '''
     */
    id?: string;

    /**
     * Represents the display name of the user in the Chat UI component.
     *
     * @type {string}
     * @default 'Default'
     */
    user?: string;

    /**
     * Specifies the URL of the user's avatar image.
     * If the URL is not provided, the user's first and last name initial letters will be used as the avatar.
     *
     * @type {string}
     * @default ''
     */
    avatarUrl?: string;

    /**
     * Defines the background color for the user's avatar in the Chat UI component.
     * This property accepts a color in hexadecimal format (e.g., `#FFFFFF` for white), allowing for custom styling of the avatar's background.
     *
     * @type {string}
     * @default ''
     */
    avatarBgColor?: string;

    /**
     * Represents additional CSS classes to style the user's messages in the Chat UI component.
     * This property allows for custom styling by accepting one or more class names as a string.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the CSS class for the status bar icon in the Chat UI component.
     * This allows customization of the status icon's appearance using custom styles.
     *
     * @type {string}
     * @default ''
     */
    statusIconCss?: string;

}

/**
 * Interface for a class MessageToolbarSettings
 */
export interface MessageToolbarSettingsModel {

    /**
     * Specifies the width of the message toolbar in the Chat UI component.
     * Represents the width of the toolbar, which can be defined using various CSS units and values such as 'auto', '100%', or pixel-based measurements.
     *
     * @type {string}
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies the collection of toolbar items in the message toolbar of the Chat UI component.
     * Represents an array of items that are rendered in the toolbar, allowing for customization and interaction within the response section.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    items?: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the message toolbar of the Chat UI component.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<MessageToolbarItemClickedEventArgs>;

}

/**
 * Interface for a class MessageReply
 */
export interface MessageReplyModel {

    /**
     * Specifies the author of the message in the Chat UI component.
     * This property references a `UserModel` object that contains details about the user who sent the message.
     *
     * @default null
     */
    user?: UserModel;

    /**
     * Represents the content of the message sent by a user in the Chat UI component.
     *
     * @type {string}
     * @default ''
     */
    text?: string;

    /**
     * Represents the mentioned Users of the message sent by the replied user in the Chat UI component.
     *
     * @type {UserModel[]}
     * @default []
     */
    mentionUsers?: UserModel[];

    /**
     * Represents the id of the message sent by the replied user in the Chat UI component.
     *
     * @type {string}
     * @default ''
     */
    messageID?: string;

    /**
     * Specifies the timestamp of when the replied message was sent.
     * This property holds a `Date` object that represents the exact time the message was created, providing context to the conversation flow.
     *
     * @type {Date}
     * @default ''
     */
    timestamp?: Date;

    /**
     * Specifies the format of the timestamp for displaying the reply message's sending time.
     * If empty, the format is determined by the application's culture settings.
     * Supports format strings like 'dd/MM/yyyy hh:mm'.
     *
     * @type {string}
     * @default ''
     */
    timestampFormat?: string;

    /**
     * Represents the attached files of the message sent by a user in the Chat UI component.
     *
     * @type {FileInfo}
     * @default null
     */
    attachedFile?: FileInfo;

}

/**
 * Interface for a class Message
 */
export interface MessageModel {

    /**
     * Specifies the unique identifier for each message sent in the Chat UI component.
     * Represents a string that uniquely identifies a message for tracking and managing individual messages within the chat.
     *
     * @type {string}
     * @default '''
     */
    id?: string;

    /**
     * Represents the content of the message sent by a user in the Chat UI component.
     *
     * @type {string}
     * @default ''
     */
    text?: string;

    /**
     * Specifies the author of the message in the Chat UI component.
     * This property references a `UserModel` object that contains details about the user who sent the message.
     *
     * @default null
     */
    author?: UserModel;

    /**
     * Specifies the timestamp of when the message was sent.
     * This property holds a `Date` object that represents the exact time the message was created, providing context to the conversation flow.
     *
     * @type {Date}
     * @default ''
     */
    timeStamp?: Date;

    /**
     * Specifies the format of the timestamp for displaying the message's sending time.
     * By default, the format is set based on the culture of the application.
     * You can customize the format using a specific pattern, such as "'dd/MM/yyyy hh:mm'" in string format.
     *
     * @type {string}
     * @default ''
     */
    timeStampFormat?: string;

    /**
     * Specifies the status of the message in the Chat UI component.
     * Represents the current status of the message, such as sent, received, or read. It helps in tracking the messages within the chat component.
     *
     * @default null
     */
    status?: MessageStatusModel;

    /**
     * Specifies whether the message is pinned.
     * When set to true, the message will be visually highlighted and can appear in the pinned messages section.
     *
     * @type {boolean}
     * @default false
     */
    isPinned?: boolean;

    /**
     * Specifies the reference to the original message when this message is a reply.
     * Contains the `MessageReplyModel` of the message being replied to.
     *
     * @default null
     */
    replyTo?: MessageReplyModel;

    /**
     * Specifies whether the message has been forwarded.
     * When set to true, the message is visually marked as forwarded.
     *
     * @type {boolean}
     * @default false
     */
    isForwarded?: boolean;

    /**
     * Specifies the list of files attached within the Chat UI.
     * This property accepts an array of FileInfo objects that represent the files to be attached.
     * By providing these files, they will be rendered during the initial rendering of the component.
     *
     * @type {FileInfo}
     * @default null
     */
    attachedFile?: FileInfo;

    /**
     * Represents an array of users mentioned in the message.
     * This field contains the list of users referenced via the @mention feature in the message text, populated when mentions are selected from the suggestion popup.
     * The field is optional and defaults to an empty array if no mentions are included in the message.
     *
     * @type {UserModel[]}
     * @default []
     */
    mentionUsers?: UserModel[];

}

/**
 * Interface for a class FileAttachmentSettings
 */
export interface FileAttachmentSettingsModel {

    /**
     * Specifies the URL to save the uploaded files.
     *
     * @type {string}
     * @default ''
     */
    saveUrl?: string;

    /**
     * Specifies the URL to remove the files from the server.
     *
     * @type {string}
     * @default ''
     */
    removeUrl?: string;

    /**
     * Specifies the path for storing and displaying images.
     * If both `saveFormat` and `path` are configured, the `path` property takes priority.
     *
     * @type {string}
     * @default ''
     */
    path?: string;

    /**
     *  Specifies the format in which the attachment will be saved.
     *  Accepts values such as 'Blob' or other supported formats.
     *
     * @type {SaveFormat}
     * @default 'Blob'
     */
    saveFormat?: SaveFormat

    /**
     * Specifies the allowed file types for attachments.
     * Accepts a comma-separated string (e.g., ".jpg,.png").
     *
     * @type {string}
     * @default ''
     */
    allowedFileTypes?: string;

    /**
     * Specifies the maximum file size (in bytes) for attachments.
     * Prevents uploading files larger than this size.
     *
     * @type {number}
     * @default 30000000
     */
    maxFileSize?: number;

    /**
     * Specifies whether drag and drop is enabled for attachments.
     * Allows users to drag files into the upload area.
     *
     * @type {boolean}
     * @default true
     */
    enableDragAndDrop?: boolean;

    /**
     * Specifies the maximum number of attachments allowed per message.
     * Limits the number of files that can be uploaded and attached to a single message.
     * Must be a positive integer.
     *
     * @type {number}
     * @default 10
     */
    maximumCount?: number;

    /**
     * Specifies a custom template for rendering attachment previews.
     * Accepts a string or function to define the HTML structure or rendering logic for attachment previews (e.g., thumbnails, icons, file metadata).
     * If not provided, the default preview will be rendered.
     *
     * @default ''
     * @angularType string | object | HTMLElement
     * @reactType string | function | JSX.Element | HTMLElement
     * @vueType string | function | HTMLElement
     * @aspType string
     */
    previewTemplate?: string | Function;

    /**
     * Specifies a custom template for rendering attachments in footer.
     * Accepts a string or function to define the HTML structure or rendering logic for attachments (e.g., thumbnails, icons, file metadata).
     * If not provided, the default attachments will be rendered.
     *
     * @default ''
     * @angularType string | object | HTMLElement
     * @reactType string | function | JSX.Element | HTMLElement
     * @vueType string | function | HTMLElement
     * @aspType string
     */
    attachmentTemplate?: string | Function;

    /**
     * Event raised when a attachment item is clicked in the Chat UI component wither before sending or after the attachment is sent.
     *
     * @event attachmentClick
     */
    attachmentClick?: EmitType<ChatAttachmentClickEventArgs>;

}

/**
 * Interface for a class ChatUI
 */
export interface ChatUIModel extends InterActiveChatBaseModel{

    /**
     * Specifies the width of the Chat UI component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies the height of the Chat UI component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    height?: string | number;

    /**
     * Represents the current user interacting with the Chat UI.
     * Uses the `UserModel` object, which contains current user information.
     * Messages from the current user are displayed on the right side of the Chat UI for differentiation from other participants.
     *
     * @default null
     */
    user?: UserModel;

    /**
     * Specifies the header text to be displayed in the Chat UI component.
     * This property defines the text that appears in the header, which can indicate the current participant's username or the group name, providing context for the conversation.
     *
     * @type {string}
     * @default 'Chat'
     */
    headerText?: string;

    /**
     * Specifies the CSS class for the header icon in the Chat UI component.
     * This property allows for custom styling of the header icon.
     *
     * @type {string}
     * @default ''
     */
    headerIconCss?: string;

    /**
     * Specifies the placeholder text for the message input textarea in the Chat UI component.
     *
     * @type {string}
     * @default 'Type your message…'
     */
    placeholder?: string;

    /**
     * Specifies custom CSS classes for the Chat UI component.
     * This property enables the application of additional styling options to customize the visual appearance of the chat interface.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies whether the header is displayed in the Chat UI component.
     * This property controls the visibility of the header, allowing users to show or hide it as needed.
     * When set to `false`, the header will be hidden from view.
     *
     * @type {boolean}
     * @default true
     */
    showHeader?: boolean;

    /**
     * Specifies whether to show or hide footer in the Chat UI component.
     * When set to `true`, the footer will be visible in the Chat UI component. If `false`, the footer will be hidden.
     *
     * @type {boolean}
     * @default true
     */
    showFooter?: boolean;

    /**
     * Specifies the header toolbar settings for the Chat UI component.
     * Represents the configuration for toolbar items and actions within the component.
     *
     * @default null
     */
    headerToolbar?: ToolbarSettingsModel;

    /**
     * Specifies the list of message suggestions displayed above the input textarea in the Chat UI component.
     * This property represents an array of suggestions that can assist the user in composing messages, providing quick replies.
     *
     * @type {string[]}
     * @default null
     */
    suggestions?: string[];

    /**
     * Specifies whether time breaks are enabled for grouping chat messages by date.
     * When set to `true`, messages will be grouped based on their timestamp, creating date-wise separators within the chat.
     *
     * @type {boolean}
     * @default false
     */
    showTimeBreak?: boolean;

    /**
     * Specifies a collection of messages within the Chat UI component.
     * Each message is represented by a MessageModel object, containing properties such as text, author, timestamp, and status.
     *
     * @type {MessageModel[]}
     * @default null
     */
    messages?: MessageModel[];

    /**
     * Specifies a list of users who are currently typing in the chat.
     * This property is updated to indicate active participants typing responses.
     *
     * @type {UserModel[]}
     * @default null
     * @aspType List<ChatUIUser>
     */
    typingUsers?: UserModel[];

    /**
     * Specifies the format of the value that to be displayed in component.
     * By default, the format will be set based on the culture. You can set the format to "format:'dd/MM/yyyy hh:mm a'" in string.
     *
     * @type {string}
     * @default 'dd/MM/yyyy hh:mm a'
     */
    timeStampFormat?: string;

    /**
     * Specifies whether timestamps are displayed alongside each message in the Chat UI component.
     * When set to true, timestamps will appear with each message, helping users track the timing of conversations.
     *
     * @type {boolean}
     * @default true
     */
    showTimeStamp?: boolean;

    /**
     * Specifies whether the UI should automatically scroll to the bottom when a new message is added to the Chat UI component.
     * When set to `true`, the chat will automatically scroll to display the latest message, ensuring that users can see new messages without manual intervention.
     *
     * @type {boolean}
     * @default false
     */
    autoScrollToBottom?: boolean;

    /**
     * Enables on-demand loading of messages, typically triggered as the user scrolls through the chat history.
     * When set to `true`, older messages will load progressively, improving performance for large message histories by avoiding initial loading of all messages.
     *
     * @type {boolean}
     * @default false
     */
    loadOnDemand?: boolean;

    /**
     * Specifies the list of users available for mention in the chat UI.
     * This property defines an array of user objects that populate the @mention suggestion popup when the mention trigger character is typed.
     * When typing the `mentionTriggerChar` (e.g., '@') followed by characters filters this list to show matching users.
     *
     * @type {UserModel[]}
     * @default null
     * @aspType List<ChatUIUser>
     */
    mentionUsers?: UserModel[];

    /**
     * Specifies the character that triggers the @mention suggestion popup in the chat input.
     * The trigger character must be a single character, such as '@' or '#', and is case-sensitive in the input.
     *
     * @type {string}
     * @default '@'
     */
    mentionTriggerChar?: string;

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
    suggestionTemplate?: string | Function;

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
    footerTemplate?: string | Function;

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
    emptyChatTemplate?: string | Function;

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
    messageTemplate?: string | Function;

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
    timeBreakTemplate?: string | Function;

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
    typingUsersTemplate?: string | Function;

    /**
     * Enables the compact mode layout in the Chat UI component.
     * When enabled, all messages are aligned to the left side regardless of the sender, creating a simplified chat view.
     * This mode is useful for dense group conversations or compact displays (e.g., mobile,embedded).
     * Example: `compactMode: true`
     *
     * @type {boolean}
     * @default false
     */
    enableCompactMode?: boolean;

    /**
     * Specifies the settings for the message toolbar in the Chat UI component.
     * Configures the toolbar options associated with each message such as Reply, Forward, Copy, Pin, and Delete.
     * If 'items' is not provided, default toolbar actions ['Copy', 'Reply', 'Pin', 'Delete'] will be rendered.
     *
     * @default []
     */
    messageToolbarSettings?: MessageToolbarSettingsModel;

    /**
     * Event triggered when a message is about to be sent in the Chat UI component.
     * This event allows for cancelling the send action if needed.
     *
     * @event messageSend
     */
    messageSend?: EmitType<MessageSendEventArgs>;

    /**
     * Event triggered when the user is typing a message in the Chat UI component.
     * This event provides updates on the user's typing status.
     *
     * @event userTyping
     */
    userTyping?: EmitType<TypingEventArgs>;

    /**
     * Triggered when a user selects a mention from the suggestion popup in the chat UI.
     * This event provides details about the selected user and the current message text, allowing developers to handle mention-related logic, such as custom notifications or validation.
     * The `cancel` property in the event arguments can be set to `true` to prevent the default behavior of inserting the mention into the input field.
     *
     * @event mentionSelect
     */
    mentionSelect?: EmitType<MentionSelectEventArgs>;

    /**
     * Specifies whether the attachments is enabled in the Chat UI component.
     *
     * @type {boolean}
     * @default false
     */
    enableAttachments?: boolean;

    /**
     * Specifies the configuration options for attachment handling.
     *  Includes save URL, allowed file types, and maximum file size.
     *
     *
     * @default null
     */
    attachmentSettings?: FileAttachmentSettingsModel;

    /**
     *  Fires before an attachment upload begins.
     *  Allows inspection or cancellation of the upload process.
     *
     * @event beforeAttachmentUpload
     *
     * @param {BeforeUploadEventArgs} args - Details about the file to be uploaded.
     */
    beforeAttachmentUpload?: EmitType<BeforeUploadEventArgs>;

    /**
     * Fires when an attachment is uploaded successfully.
     *
     * @event attachmentUploadSuccess
     *
     *  @param {object} args - Details about the uploaded file.
     */
    attachmentUploadSuccess?: EmitType<SuccessEventArgs>;

    /**
     * Fires when an attachment upload fails.
     *
     * @event attachmentUploadFailure
     *
     * @param {object} args - Details about the failed file and error information.
     */
    attachmentUploadFailure?: EmitType<FailureEventArgs>;

    /**
     * Fires when an attachment is removed.
     *
     * @event attachmentRemoved
     *
     * @param {object} args - Details about the removed file.
     */
    attachmentRemoved?: EmitType<RemovingEventArgs>;

}