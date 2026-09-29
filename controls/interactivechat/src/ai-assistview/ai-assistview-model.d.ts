import { EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, Collection, EmitType, Event, remove, L10n, SanitizeHtmlHelper, ModuleDeclaration } from '@syncfusion/ej2-base';import { ChildProperty, getUniqueID, isNullOrUndefined as isNOU, BaseEventArgs, Complex, removeClass, addClass } from '@syncfusion/ej2-base';import { SpeechToTextSettingsModel } from '../ai-assist-base/ai-assist-base-model';import { ItemModel, Toolbar, ClickEventArgs, FieldSettings } from '@syncfusion/ej2-navigations';import { Mention, SelectEventArgs, FilterType, FieldSettingsModel, MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';import { ToolbarSettings, ToolbarItem, ToolbarItemClickedEventArgs, TextState } from '../interactive-chat-base/interactive-chat-base';import { ToolbarItemModel, ToolbarSettingsModel } from '../interactive-chat-base/interactive-chat-base-model';import { FileInfo, Uploader, BeforeUploadEventArgs, UploadingEventArgs, RemovingEventArgs, StartListeningEventArgs, ErrorEventArgs, TranscriptChangedEventArgs, SpeechToText, StopListeningEventArgs, SpeechToTextState } from '@syncfusion/ej2-inputs';import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';import { ButtonSettings, ButtonSettingsModel, TooltipSettings, TooltipSettingsModel } from '@syncfusion/ej2-inputs';import { DataManager, Query } from '@syncfusion/ej2-data';import { Fab } from '@syncfusion/ej2-buttons';import { AIAssistBase, ToolbarPosition, SpeechToTextSettings } from '../ai-assist-base/ai-assist-base';import { ResponseBlock, TextBlock, ToolBlock, ThinkingContextItem, ThinkingBlock, ThinkingStage } from './interface';import { AssistThinking } from '../ai-assist-base/index';import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import {MentionItems,AssistViewType,AttachmentClickEventArgs,PromptRequestEventArgs,PromptChangedEventArgs,StopRespondingEventArgs,EditableContextClickedEventArgs,AssistMentionSelectEventArgs} from "./ai-assistview";
import {AIAssistBaseModel} from "../ai-assist-base/ai-assist-base-model";

/**
 * Interface for a class Prompt
 */
export interface PromptModel {

    /**
     * Specifies the prompt text.
     * Represents the text used for prompting user input.
     *
     * @type {string}
     * @default null
     */
    prompt?: string;

    /**
     * Specifies the response associated with the prompt.
     * Represents the text that provides the response to the prompt.
     *
     * @type {string}
     * @default ''
     */
    response?: string;

    /**
     * Indicates if the response is considered helpful.
     * Represents the state of whether the generated response is useful or not.
     *
     * @type {boolean | null}
     * @default null
     */
    isResponseHelpful?: boolean;

    /**
     * Specifies the list of files attached within the AI assist view.
     * This property accepts an array of `FileInfo` objects that represent the files to be attached.
     * By providing these files, they will be rendered during the initial rendering of the component.
     *
     * @type {FileInfo}
     * @default null
     */
    attachedFiles?: FileInfo[];

    /**
     * Optional list of regenerated responses.
     * When provided, response navigation will be enabled.
     */
    regeneratedResponses?: string[];

    /**
     * Specifies the list of block responses within the AI assist view.
     * This property accepts an array of `ResponseBlock` objects that represent the response to be added.
     * By providing these blocks, the response will be rendered as tool, text or thinking block.
     *
     * @type {ResponseBlock}
     * @default null
     */
    blocks?: ResponseBlock[];

    /**
     * Specifies the collection of mention configurations available in the prompt.
     * Accepts an array of mention items with trigger characters and associated data.
     *
     * @type {MentionItems}
     * @default null
     */
    mentions?: MentionItems[];

}

/**
 * Interface for a class AssistView
 */
export interface AssistViewModel {

    /**
     * Specifies the type of the assist view.
     *
     * @isenumeration true
     * @default AssistViewType.Assist
     * @asptype AssistViewType
     */
    type?: string | AssistViewType;

    /**
     * Specifies the name of the assist view.
     * Represents the name displayed in the assist view.
     *
     * @type {string}
     * @default ''
     */
    name?: string;

    /**
     * Specifies the icon CSS for the assist view.
     * Represents the CSS class for the icon of the assist view.
     *
     * @type {string}
     * @default null
     */
    iconCss?: string;

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
    viewTemplate?: string | Function;

}

/**
 * Interface for a class TextToSpeechSettings
 */
export interface TextToSpeechSettingsModel {

    /**
     * Specifies the language used for text-to-speech synthesis.
     * Accepts valid ISO language codes such as 'en-US', 'fr-FR', or 'de-DE'.
     *
     * @default 'en-US'
     */
    language?: string;

    /**
     * Specifies the pitch of the synthesized voice.
     * Accepts numeric values typically between 0 (low) and 2 (high).
     *
     * @default 1
     */
    speechPitch?: number;

    /**
     * Specifies the speaking rate of the synthesized voice.
     * Accepts numeric values typically between 0.1 (slow) and 10 (fast).
     *
     * @default 1
     */
    speechRate?: number;

    /**
     * Specifies the text content to be converted into speech.
     * Accepts plain string input for synthesis.
     *
     * @default ''
     */
    inputText?: string;

    /**
     * Specifies the voice used for speech synthesis.
     * Must be a valid SpeechSynthesisVoice from speechSynthesis.getVoices().
     *
     * @default null
     */
    voice?: SpeechSynthesisVoice;

    /**
     * Specifies the volume level of the synthesized voice.
     * Accepts numeric values between 0 (mute) and 1 (maximum).
     *
     * @default 1
     */
    volume?: number;

}

/**
 * Interface for a class AttachmentSettings
 */
export interface AttachmentSettingsModel {

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
     * Specifies the allowed file types for attachments.
     *
     * @type {string}
     * @default ''
     */
    allowedFileTypes?: string;

    /**
     * Specifies the maximum file size allowed for attachments in bytes.
     *
     * @type {number}
     * @default 2000000
     */
    maxFileSize?: number;

    /**
     * Specifies the maximum number of attachments allowed per prompt.
     * Limits the number of files that can be uploaded and attached to a single prompt.
     * Must be a positive integer.
     *
     * @type {number}
     * @default 10
     */
    maximumCount?: number;

    /**
     * Specifies a custom template for rendering attachments in footer and assistview.
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
     * Event raised when a attachment item is clicked in the assistview component either before sending or after the attachment is sent.
     *
     * @event attachmentClick
     */
    attachmentClick?: EmitType<AttachmentClickEventArgs>;

}

/**
 * Interface for a class PromptToolbarSettings
 */
export interface PromptToolbarSettingsModel {

    /**
     * Specifies the width of the prompt toolbar in the AIAssistView component.
     * Represents the width of the toolbar, which can be set using a string value such as 'auto', '100%', or other CSS width values.
     *
     * @type {string}
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies the collection of toolbar items in the prompt toolbar of the AIAssistView component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    items?: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the prompt toolbar of the AIAssistView component.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<ToolbarItemClickedEventArgs>;

}

/**
 * Interface for a class ResponseToolbarSettings
 */
export interface ResponseToolbarSettingsModel {

    /**
     * Specifies the width of the response toolbar in the AIAssistView component.
     * Represents the width of the toolbar, which can be defined using various CSS units and values such as 'auto', '100%', or pixel-based measurements.
     *
     * @type {string}
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies the collection of toolbar items in the response toolbar of the AIAssistView component.
     * Represents an array of items that are rendered in the toolbar, allowing for customization and interaction within the response section.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    items?: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the response toolbar of the AIAssistView component.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<ToolbarItemClickedEventArgs>;

}

/**
 * Interface for a class FooterToolbarSettings
 */
export interface FooterToolbarSettingsModel {

    /**
     * Specifies the position of the footer toolbar in the editor.
     * This property determines whether the toolbar is rendered inline with the content or at the bottom of the edit area.
     *
     * @isenumeration true
     * @default ToolbarPosition.Inline
     * @asptype ToolbarPosition
     */
    toolbarPosition?: ToolbarPosition | string;

    /**
     * Specifies the collection of toolbar items in the footer toolbar of the AIAssistView component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    items?: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the footer toolbar of the AIAssistView component.
     *
     * @event itemClick
     */
    itemClick?: EmitType<ToolbarItemClickedEventArgs>;

}

/**
 * Interface for a class MentionSettings
 */
export interface MentionSettingsModel {

    /**
     * Specifies the character used to trigger mention suggestions.
     * Accepts a single character such as '@', '#', or '/'.
     *
     * @type {string}
     * @default ''
     */
    mentionChar?: string;

    /**
     * Specifies the data source used to populate mention suggestions.
     * Accepts local collections, DataManager instances, or remote data sources.
     *
     * @type {string[] | DataManager | { [key: string]: Object; }[] | number[] | boolean[]}
     * @default []
     */
    dataSource?: string[] | DataManager | { [key: string]: Object; }[] | number[] | boolean[];

    /**
     * Specifies the field mappings for the mention data source.
     * Maps data fields used for displaying and identifying mention items.
     *
     * @type {FieldSettingsModel}
     * @default { text: 'text', value: 'id' }
     */
    fields?: FieldSettingsModel;

    /**
     * Specifies the query used to retrieve and filter mention data.
     * Applies additional data operations to the configured data source.
     *
     * @type {Query}
     * @default null
     */
    query?: Query;

    /**
     * Specifies the filtering type used for matching suggestion items.
     * Accepts filtering options such as Contains, StartsWith, or EndsWith.
     *
     * @type {FilterType}
     * @default 'Contains'
     */
    filterType?: FilterType;

    /**
     * Specifies whether matching characters are highlighted in mention suggestions.
     * When enabled, matched text is visually emphasized in the popup list.
     *
     * @type {boolean}
     * @default false
     */
    highlight?: boolean;

    /**
     * Specifies whether the mention character is displayed in the rendered mention item.
     * When set to false, the mention character is omitted from the selected mention display.
     *
     * @type {boolean}
     * @default true
     */
    showMentionChar?: boolean;

    /**
     * Specifies the width of the mention suggestion popup.
     * Accepts CSS width values such as '400px' or '50%', or numeric pixel dimensions.
     *
     * @type {string | number}
     * @default 'auto'
     */
    popupWidth?: string | number;

    /**
     * Specifies the height of the mention suggestion popup.
     * Accepts CSS height values such as '300px' or '50%', or numeric pixel dimensions.
     *
     * @type {string | number}
     * @default '300px'
     */
    popupHeight?: string | number;

    /**
     * Specifies the template used to display selected mention items.
     * Accepts a string template or a framework-specific template function.
     *
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     * @default ''
     */
    displayTemplate?: string | Function;

    /**
     * Specifies the template used to render suggestion list items.
     * Accepts a template string to customize the appearance of suggestion items.
     *
     * @angularType string
     * @reactType string
     * @vueType string
     * @aspType string
     * @default ''
     */
    itemTemplate?: string;

    /**
     * Specifies the template displayed when no matching suggestions are found.
     * Accepts a string value to customize the empty state content shown in the suggestion popup.
     *
     * @angularType string
     * @reactType string
     * @vueType string
     * @aspType string
     * @default 'No records found'
     */
    noRecordsTemplate?: string;

}

/**
 * Interface for a class AIAssistView
 */
export interface AIAssistViewModel extends AIAssistBaseModel{

    /**
     * Specifies the text input prompt for the AIAssistView component.
     *
     * @type {string}
     * @default ''
     */
    prompt?: string;

    /**
     * Specifies the placeholder text for the prompt input text area in the AIAssistView component.
     *
     * @type {string}
     * @default 'Type prompt for assistance...'
     */
    promptPlaceholder?: string;

    /**
     * Specifies the collection of prompts and their responses in the AIAssistView component.
     *
     * {% codeBlock src='ai-assistview/prompts/index.md' %}{% endcodeBlock %}
     *
     * @type {PromptModel[]}
     * @default []
     */
    prompts?: PromptModel[];

    /**
     * Specifies the list of prompt suggestions in the AIAssistView component.
     * Contains suggestions that can be used as prompts.
     *
     * {% codeBlock src='ai-assistview/promptSuggestions/index.md' %}{% endcodeBlock %}
     *
     * @type {string[]}
     * @default null
     */
    promptSuggestions?: string[];

    /**
     * Specifies the header text for the prompt suggestions in the AIAssistView component. Provides a header for the list of suggestions.
     *
     * @type {string}
     * @default ''
     */
    promptSuggestionsHeader?: string;

    /**
     * Specifies whether the header is displayed in the AIAssistView component.
     *
     * @type {boolean}
     * @default true
     */
    showHeader?: boolean;

    /**
     * Specifies the toolbar settings for the AIAssistView component.
     * Represents the configuration for toolbar items and actions within the component.
     *
     * {% codeBlock src='ai-assistview/toolbarSettings/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Specifies the index of the active view in the AIAssistView component.
     * Determines the currently active and visible view.
     *
     * @type {number}
     * @default 0
     * @aspType int
     */
    activeView?: number;

    /**
     * Specifies the CSS class for the prompter avatar in the AIAssistView component. Allows custom styling for the prompt avatar.
     *
     * @type {string}
     * @default null
     */
    promptIconCss?: string;

    /**
     * Specifies the CSS class for the responder avatar in the AIAssistView component. Allows custom styling for the responder avatar.
     *
     * @type {string}
     * @default null
     */
    responseIconCss?: string;

    /**
     * Specifies the width of the AIAssistView component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies the height of the AIAssistView component.
     *
     * @type {string | number}
     * @default '100%'
     * @aspType string
     */
    height?: string | number;

    /**
     * Specifies custom CSS classes for the AIAssistView component. Allows for additional custom styling.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the collection of assist view models in the AIAssistView component.
     * Represents the views available in the assist view.
     *
     * {% codeBlock src='ai-assistview/views/index.md' %}{% endcodeBlock %}
     *
     * @type {AssistViewModel[]}
     * @default null
     */
    views?: AssistViewModel[] ;

    /**
     * Specifies the settings for the prompt toolbar in the AIAssistView component.
     * Represents the configuration for the toolbar associated with prompt items.
     *
     * {% codeBlock src='ai-assistview/promptToolbarSettings/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    promptToolbarSettings?: PromptToolbarSettingsModel;

    /**
     * Specifies the settings for the response toolbar in the AIAssistView component.
     * Represents the configuration for the toolbar associated with response items.
     *
     * {% codeBlock src='ai-assistview/responseToolbarSettings/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    responseToolbarSettings?: ResponseToolbarSettingsModel;

    /**
     * Configuration object for rendering a Syncfusion Toolbar in the footer.
     * This property holds the settings required to initialize and display a custom Syncfusion Toolbar in the input field.
     *
     * @type {FooterToolbarSettingsModel | null}
     * @default null
     */
    footerToolbarSettings?: FooterToolbarSettingsModel;

    /**
     * Configuration object for rendering Speech-to-Text in the AssistView footer.
     * This property holds the settings required to initialize and display the Speech-to-Text component.
     *
     * @type {SpeechToTextSettingsModel}
     * @default { enable: false }
     */
    speechToTextSettings?: SpeechToTextSettingsModel;

    /**
     * Configuration object for rendering Text-to-Speech in the AssistView.
     * This property holds the settings required to control speech synthesis behavior.
     *
     * @type {TextToSpeechSettingsModel}
     * @default {}
     */
    textToSpeechSettings?: TextToSpeechSettingsModel;

    /**
     * Specifies whether the attachments is enabled in the AIAssistView component.
     *
     * @type {boolean}
     * @default false
     */
    enableAttachments?: boolean;

    /**
     * Specifies the settings for the attachments in the AIAssistView component.
     * Represents the configuration for the uploader associated with footer.
     *
     *
     * @default null
     */
    attachmentSettings?: AttachmentSettingsModel;

    /**
     * Specifies the collection of mention configurations available in the AssistView.
     * Each mention setting defines a mention character and the behavior of its suggestion popup.
     *
     * @type {MentionSettingsModel[]}
     * @default []
     */
    mentions?: MentionSettingsModel[];

    /**
     * Specifies whether the clear button of text area is displayed in the AIAssistView component.
     * Determines if a button for clearing the prompt text area is shown or hidden.
     *
     * @type {boolean}
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Specifies whether to show a scroll-to-bottom indicator (typically a floating icon/button) when the user has scrolled up away from the latest message in the AI AssistView.
     *
     * By default, when enabled (`true`), the button appears automatically when the scroll position is not at the bottom. Clicking on it scrolls smoothly to the bottom and hides the button.
     *
     * When disabled(`false`), the users must manually scroll back down to see the latest messages/responses.
     *
     * @type {boolean}
     * @default true
     */
    enableScrollToBottom?: boolean;

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
    footerTemplate?: string | Function;

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
    promptItemTemplate?: string | Function;

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
    responseItemTemplate?: string | Function;

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
    promptSuggestionItemTemplate?: string | Function;

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
    bannerTemplate?: string | Function;

    /**
     * Specifies the content template for rendering the thinking block item.
     * Can be a string or function template to customize the block's HTML structure.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    blockTemplate?: string | Function;

    /**
     * Specifies the content template for rendering the stage item.
     * Can be a string or function template to customize the stage display.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    itemTemplate?: string | Function;

    /**
     * Specifies a custom template for rendering the response animation (skeleton/loading) state
     * while a response is being generated in the AIAssistView component.
     * Accepts a string or function to define the HTML structure or rendering logic for the loading
     * experience (e.g., shimmer placeholders, typing indicators, custom structured blocks).
     * The template context includes the loading state, the current thinking-step index (if applicable),
     * and any partial/streamed content available at the time of rendering.
     * If not provided, the component falls back to its default skeleton animation.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    responseAnimationTemplate?: string | Function;

    /**
     * Event triggered when a prompt request is made in the AIAssistView component.
     * Provides details about the prompt request, including whether it should be cancelled, the prompt text, output, and toolbar items.
     *
     * @event promptRequest
     */
    promptRequest?: EmitType<PromptRequestEventArgs>;

    /**
     * Event triggered when the prompt text changed in the AIAssistView component.
     *
     * @event 'promptChanged'
     */
    promptChanged?: EmitType<PromptChangedEventArgs>;

    /**
     * Triggers when the 'Stop Responding' button is clicked while a prompt request is in progress.
     * This event allows users to handle stopping the response generation and update the UI accordingly.
     *
     * @event stopRespondingClick
     */
    stopRespondingClick?: EmitType<StopRespondingEventArgs>;

    /**
     * Event triggered before an attachment upload is initiated.
     * Provides details about the file to be uploaded.
     *
     * @event beforeAttachmentUpload
     */
    beforeAttachmentUpload?: EmitType<BeforeUploadEventArgs>;

    /**
     * Event triggered on successful attachment upload.
     * Provides details about the uploaded file.
     *
     * @event attachmentUploadSuccess
     */
    attachmentUploadSuccess?: EmitType<object>;

    /**
     * Event triggered on attachment upload failure.
     * Provides details about the failed file and error message.
     *
     * @event attachmentUploadFailure
     */
    attachmentUploadFailure?: EmitType<object>;

    /**
     * Event triggered when an attachment is removed.
     * Provides details about the removed file.
     *
     * @event attachmentRemoved
     */
    attachmentRemoved?: EmitType<object>;

    /**
     * Triggers when an uploaded file is being removed.
     * Provides details about the file removal operation.
     *
     * @event attachmentRemoving
     */
    attachmentRemoving?: EmitType<RemovingEventArgs>;

    /**
     * Event triggered when clickable thinking context item is clicked.
     * Provides context item details and event information for custom handling.
     *
     * @event editableContextClicked
     */
    editableContextClicked?: EmitType<EditableContextClickedEventArgs>;

    /**
     * Event triggered when a mention item is selected from the mention popup.
     * Provides details about the selected mention item and allows the selection action to be canceled.
     *
     * @event mentionSelect
     */
    mentionSelect?: EmitType<AssistMentionSelectEventArgs>;

}