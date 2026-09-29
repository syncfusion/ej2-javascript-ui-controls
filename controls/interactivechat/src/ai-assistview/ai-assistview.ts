// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../ai-assist-base/ai-assist-base-model.d.ts'/>
import { EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, Collection, EmitType, Event, remove, L10n, SanitizeHtmlHelper, ModuleDeclaration } from '@syncfusion/ej2-base';
import { ChildProperty, getUniqueID, isNullOrUndefined as isNOU, BaseEventArgs, Complex, removeClass, addClass } from '@syncfusion/ej2-base';
import { AIAssistViewModel, PromptModel, ResponseToolbarSettingsModel, PromptToolbarSettingsModel, AssistViewModel, AttachmentSettingsModel, FooterToolbarSettingsModel, TextToSpeechSettingsModel, MentionSettingsModel } from './ai-assistview-model';
import { SpeechToTextSettingsModel } from '../ai-assist-base/ai-assist-base-model';
import { ItemModel, Toolbar, ClickEventArgs, FieldSettings } from '@syncfusion/ej2-navigations';
import { Mention, SelectEventArgs, FilterType, FieldSettingsModel, MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { ToolbarSettings, ToolbarItem, ToolbarItemClickedEventArgs, TextState } from '../interactive-chat-base/interactive-chat-base';
import { ToolbarItemModel, ToolbarSettingsModel } from '../interactive-chat-base/interactive-chat-base-model';
import { FileInfo, Uploader, BeforeUploadEventArgs, UploadingEventArgs, RemovingEventArgs, StartListeningEventArgs, ErrorEventArgs, TranscriptChangedEventArgs, SpeechToText, StopListeningEventArgs, SpeechToTextState } from '@syncfusion/ej2-inputs';
import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';
import { ButtonSettings, ButtonSettingsModel, TooltipSettings, TooltipSettingsModel } from '@syncfusion/ej2-inputs';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Fab } from '@syncfusion/ej2-buttons';
import { AIAssistBase, ToolbarPosition, SpeechToTextSettings } from '../ai-assist-base/ai-assist-base';
import { ResponseBlock, TextBlock, ToolBlock, ThinkingContextItem, ThinkingBlock, ThinkingStage } from './interface';
import { AssistThinking } from '../ai-assist-base/index';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

const ASSISTHEADER: string = 'e-aiassist-header-text e-assist-view-header';
/* eslint-disable @typescript-eslint/no-misused-new, no-redeclare */
interface ClipboardItem {
    new (items: { [mimeType: string]: Blob }): ClipboardItem;
}

declare let ClipboardItem: any;
/* eslint-enable @typescript-eslint/no-misused-new, no-redeclare */
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

    /**
     * Specifies the list of files attached within the AI assist view.
     * This property accepts an array of `FileInfo` objects that represent the files to be attached.
     * By providing these files, they will be rendered during the initial rendering of the component.
     *
     * @type {FileInfo}
     * @default null
     */
    @Property(null)
    public attachedFiles: FileInfo[];

    /**
     * Optional list of regenerated responses.
     * When provided, response navigation will be enabled.
     */
    @Property(null)
    public regeneratedResponses: string[];

    /**
     * Specifies the list of block responses within the AI assist view.
     * This property accepts an array of `ResponseBlock` objects that represent the response to be added.
     * By providing these blocks, the response will be rendered as tool, text or thinking block.
     *
     * @type {ResponseBlock}
     * @default null
     */
    @Property(null)
    public blocks: ResponseBlock[];

    /**
     * Specifies the collection of mention configurations available in the prompt.
     * Accepts an array of mention items with trigger characters and associated data.
     *
     * @type {MentionItems}
     * @default null
     */
    @Property(null)
    public mentions: MentionItems[];

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
 * Configuration for registering a custom tool UI in AIAssistView.
 * Allows to define how a tool UI should be rendered and interactive.
 */
export interface ToolUIConfig {
    /**
     * The unique name of the tool.
     */
    toolName: string;

    /**
     * Template function that returns HTML string for rendering the tool.
     * Receives the tool UI arguments (props) and should return an HTML string.
     *
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template: string | Function;

    /**
     * Optional callback invoked after the tool UI is rendered into the DOM.
     * Use this to attach event listeners or perform post-render setup.
     *
     * @param container - The DOM element containing the rendered tool
     * @param args - The tool UI arguments (props) passed from AI
     */
    handler?: (container: HTMLElement, args: Object) => void;
}

/**
 * Mention item configuration for context selection using trigger characters.
 * Defines the trigger character and its associated item data.
 */
export interface MentionItems {
    /**
     * Specifies the data mapping configuration associated with the mention.
     * Accepts field settings used to resolve and display mention items.
     */
    itemData: FieldSettingsModel;

    /**
     * Specifies the character that activates the mention suggestions.
     * Accepts a single trigger character such as '@', '#', or '/'.
     */
    mentionChar: string;
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
 * Configuration settings for rendering Text-to-Speech in the AssistView.
 * This property holds the settings required to control speech synthesis behavior.
 *
 */
export class TextToSpeechSettings extends ChildProperty<TextToSpeechSettings> {

    /**
     * Specifies the language used for text-to-speech synthesis.
     * Accepts valid ISO language codes such as 'en-US', 'fr-FR', or 'de-DE'.
     *
     * @default 'en-US'
     */
    @Property('en-US')
    public language: string;

    /**
     * Specifies the pitch of the synthesized voice.
     * Accepts numeric values typically between 0 (low) and 2 (high).
     *
     * @default 1
     */
    @Property(1)
    public speechPitch: number;

    /**
     * Specifies the speaking rate of the synthesized voice.
     * Accepts numeric values typically between 0.1 (slow) and 10 (fast).
     *
     * @default 1
     */
    @Property(1)
    public speechRate: number;

    /**
     * Specifies the text content to be converted into speech.
     * Accepts plain string input for synthesis.
     *
     * @default ''
     */
    @Property('')
    public inputText: string;

    /**
     * Specifies the voice used for speech synthesis.
     * Must be a valid SpeechSynthesisVoice from speechSynthesis.getVoices().
     *
     * @default null
     */
    @Property(null)
    public voice: SpeechSynthesisVoice;

    /**
     * Specifies the volume level of the synthesized voice.
     * Accepts numeric values between 0 (mute) and 1 (maximum).
     *
     * @default 1
     */
    @Property(1)
    public volume: number;
}

/**
 * Represents settings for managing file attachments in the AI Assist View.
 * Includes configuration for URLs, file types, and size limitations.
 */
export class AttachmentSettings extends ChildProperty<AttachmentSettings> {

    /**
     * Specifies the URL to save the uploaded files.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public saveUrl: string;

    /**
     * Specifies the URL to remove the files from the server.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public removeUrl: string;

    /**
     * Specifies the allowed file types for attachments.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public allowedFileTypes: string;

    /**
     * Specifies the maximum file size allowed for attachments in bytes.
     *
     * @type {number}
     * @default 2000000
     */
    @Property(2000000)
    public maxFileSize: number;

    /**
     * Specifies the maximum number of attachments allowed per prompt.
     * Limits the number of files that can be uploaded and attached to a single prompt.
     * Must be a positive integer.
     *
     * @type {number}
     * @default 10
     */
    @Property(10)
    public maximumCount: number;

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
    @Property('')
    public attachmentTemplate : string | Function;

    /**
     * Event raised when a attachment item is clicked in the assistview component either before sending or after the attachment is sent.
     *
     * @event attachmentClick
     */
    @Event()
    public attachmentClick: EmitType<AttachmentClickEventArgs>;
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

/**
 * Represents a toolbar item model in the AIAssistview component.
 */
export class FooterToolbarSettings extends ChildProperty<FooterToolbarSettings> {

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
     * Specifies the collection of toolbar items in the footer toolbar of the AIAssistView component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the footer toolbar of the AIAssistView component.
     *
     * @event itemClick
     */
    @Event()
    public itemClick: EmitType<ToolbarItemClickedEventArgs>;
}

/**
 * Configuration settings for rendering mention in the AssistView.
 * Specifies the data source, filtering options, popup settings, and templates for mention interactions.
 */
export class MentionSettings extends ChildProperty<MentionSettings> {
    /**
     * Specifies the character used to trigger mention suggestions.
     * Accepts a single character such as '@', '#', or '/'.
     *
     * @type {string}
     * @default ''
     */
    @Property('')
    public mentionChar: string;

    /**
     * Specifies the data source used to populate mention suggestions.
     * Accepts local collections, DataManager instances, or remote data sources.
     *
     * @type {string[] | DataManager | { [key: string]: Object; }[] | number[] | boolean[]}
     * @default []
     */
    @Property([])
    public dataSource: string[] | DataManager | { [key: string]: Object; }[] | number[] | boolean[];

    /**
     * Specifies the field mappings for the mention data source.
     * Maps data fields used for displaying and identifying mention items.
     *
     * @type {FieldSettingsModel}
     * @default { text: 'text', value: 'id' }
     */
    @Complex<FieldSettingsModel>({ text: 'text', value: 'id' }, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Specifies the query used to retrieve and filter mention data.
     * Applies additional data operations to the configured data source.
     *
     * @type {Query}
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Specifies the filtering type used for matching suggestion items.
     * Accepts filtering options such as Contains, StartsWith, or EndsWith.
     *
     * @type {FilterType}
     * @default 'Contains'
     */
    @Property('Contains')
    public filterType: FilterType;

    /**
     * Specifies whether matching characters are highlighted in mention suggestions.
     * When enabled, matched text is visually emphasized in the popup list.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public highlight: boolean;

    /**
     * Specifies whether the mention character is displayed in the rendered mention item.
     * When set to false, the mention character is omitted from the selected mention display.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public showMentionChar: boolean;

    /**
     * Specifies the width of the mention suggestion popup.
     * Accepts CSS width values such as '400px' or '50%', or numeric pixel dimensions.
     *
     * @type {string | number}
     * @default 'auto'
     */
    @Property('auto')
    public popupWidth: string | number;

    /**
     * Specifies the height of the mention suggestion popup.
     * Accepts CSS height values such as '300px' or '50%', or numeric pixel dimensions.
     *
     * @type {string | number}
     * @default '300px'
     */
    @Property('300px')
    public popupHeight: string | number;

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
    @Property('')
    public displayTemplate: string | Function;

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
    @Property('')
    public itemTemplate: string;

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
    @Property('No records found')
    public noRecordsTemplate: string;
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

    /**
     * Specifies the files attached with the prompt request.
     * Represents an array of file information objects for files attached during the prompt request.
     *
     * @type {FileInfo[]}
     * @default []
     *
     */
    attachedFiles?: FileInfo[];

    /**
     * Specifies the mention items associated with the prompt request.
     * Contains the mention details inserted into the prompt through configured mention settings.
     *
     * @type { MentionItems[]}
     * @default []
     *
     */
    mentions?: MentionItems[];
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

export interface StopRespondingEventArgs extends BaseEventArgs {
    /**
     * Specifies the event object associated with the stop responding action.
     * Represents the underlying event that triggered the action.
     *
     * @type {Event}
     * @default null
     */
    event?: Event
    /**
     * Specifies the prompt text associated with the request.
     * Represents the input prompt for which the response was being generated.
     *
     * @type {string}
     * @default ''
     *
     */
    prompt?: string
    /**
     * Specifies the index of the prompt in the prompt list.
     * Represents the position of the prompt in the stored collection.
     *
     * @type {number}
     * @default -1
     */
    dataIndex?: number
}

export interface AttachmentClickEventArgs extends BaseEventArgs {
    /**
     * Specifies the event object associated with the click event args.
     * Represents the underlying event that triggered the action, providing details about the event.
     *
     * @type {Event}
     * @default null
     *
     */
    event?: Event

    /**
     * Represents the file that is intended to be previewed.
     * This property holds a `file` object containing all relevant details of the file. It can be canceled or previewed before the message is sent.
     *
     * @type {FileInfo}
     * @default null
     *
     */
    file?: FileInfo
}

export interface EditableContextClickedEventArgs extends BaseEventArgs {
    /**
     * Specifies the event object associated with context item click.
     * Represents underlying browser event triggered when clicking context item.
     *
     * @type {Event}
     * @default null
     */
    event?: Event

    /**
     * Specifies the context item that was clicked.
     * Contains all properties of thinking context item.
     *
     * @type {ThinkingContextItem}
     * @default null
     */
    contextItem?: ThinkingContextItem
}

export interface AssistMentionSelectEventArgs extends BaseEventArgs {
    /**
     * Specifies whether the mention selection should be canceled.
     * Set to true to prevent the default selection action.
     *
     * @type {boolean}
     * @default false
     */
    cancel?: boolean;

    /**
     * Specifies the original event that triggered the mention selection.
     * Provides access to the underlying browser event details.
     *
     * @type {Event}
     * @default null
     */
    event?: Event;

    /**
     * Specifies whether the selection was initiated through user interaction.
     * Returns true when the action is performed directly by the user.
     *
     * @type {boolean}
     * @default false
     */
    isInteracted?: boolean;

    /**
     * Specifies the data associated with the selected mention item.
     * Contains the field settings information for the selected mention.
     *
     * @type {FieldSettingsModel}
     * @default null
     */
    itemData?: FieldSettingsModel;
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
export class AIAssistView extends AIAssistBase implements INotifyPropertyChanged {

    /**
     * @hidden
     */
    private assistThinkingModule: AssistThinking;

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
     * Configuration object for rendering a Syncfusion Toolbar in the footer.
     * This property holds the settings required to initialize and display a custom Syncfusion Toolbar in the input field.
     *
     * @type {FooterToolbarSettingsModel | null}
     * @default null
     */
    @Complex<FooterToolbarSettingsModel>({toolbarPosition: 'Inline', items: [] }, FooterToolbarSettings)
    public footerToolbarSettings: FooterToolbarSettingsModel;

    /**
     * Configuration object for rendering Speech-to-Text in the AssistView footer.
     * This property holds the settings required to initialize and display the Speech-to-Text component.
     *
     * @type {SpeechToTextSettingsModel}
     * @default { enable: false }
     */
    @Complex<SpeechToTextSettingsModel>({ enable: false }, SpeechToTextSettings)
    public speechToTextSettings: SpeechToTextSettingsModel;

    /**
     * Configuration object for rendering Text-to-Speech in the AssistView.
     * This property holds the settings required to control speech synthesis behavior.
     *
     * @type {TextToSpeechSettingsModel}
     * @default {}
     */
    @Complex<TextToSpeechSettingsModel>({}, TextToSpeechSettings)
    public textToSpeechSettings: TextToSpeechSettingsModel;

    /**
     * Specifies whether the attachments is enabled in the AIAssistView component.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public enableAttachments: boolean;

    /**
     * Specifies the settings for the attachments in the AIAssistView component.
     * Represents the configuration for the uploader associated with footer.
     *
     *
     * @default null
     */
    @Complex<AttachmentSettingsModel>({saveUrl: '', removeUrl: '', maxFileSize: 2000000, allowedFileTypes: '', maximumCount: 10, attachmentTemplate: ''}, AttachmentSettings)
    public attachmentSettings: AttachmentSettingsModel;

    /**
     * Specifies the collection of mention configurations available in the AssistView.
     * Each mention setting defines a mention character and the behavior of its suggestion popup.
     *
     * @type {MentionSettingsModel[]}
     * @default []
     */
    @Collection<MentionSettingsModel>([], MentionSettings)
    public mentions: MentionSettingsModel[];

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
     * Specifies whether to show a scroll-to-bottom indicator (typically a floating icon/button) when the user has scrolled up away from the latest message in the AI AssistView.
     *
     * By default, when enabled (`true`), the button appears automatically when the scroll position is not at the bottom. Clicking on it scrolls smoothly to the bottom and hides the button.
     *
     * When disabled(`false`), the users must manually scroll back down to see the latest messages/responses.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public enableScrollToBottom: boolean;

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
     * Specifies the content template for rendering the thinking block item.
     * Can be a string or function template to customize the block's HTML structure.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public blockTemplate: string | Function;

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
    @Property('')
    public itemTemplate: string | Function;

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
    @Property('')
    public responseAnimationTemplate: string | Function;

    /**
     * Event triggered when a prompt request is made in the AIAssistView component.
     * Provides details about the prompt request, including whether it should be cancelled, the prompt text, output, and toolbar items.
     *
     * @event promptRequest
     */
    @Event()
    public promptRequest: EmitType<PromptRequestEventArgs>;

    /**
     * Event triggered when the prompt text changed in the AIAssistView component.
     *
     * @event 'promptChanged'
     */
    @Event()
    public promptChanged: EmitType<PromptChangedEventArgs>;

    /**
     * Triggers when the 'Stop Responding' button is clicked while a prompt request is in progress.
     * This event allows users to handle stopping the response generation and update the UI accordingly.
     *
     * @event stopRespondingClick
     */
    @Event()
    public stopRespondingClick: EmitType<StopRespondingEventArgs>;

    /**
     * Event triggered before an attachment upload is initiated.
     * Provides details about the file to be uploaded.
     *
     * @event beforeAttachmentUpload
     */
    @Event()
    public beforeAttachmentUpload: EmitType<BeforeUploadEventArgs>;

    /**
     * Event triggered on successful attachment upload.
     * Provides details about the uploaded file.
     *
     * @event attachmentUploadSuccess
     */
    @Event()
    public attachmentUploadSuccess: EmitType<object>;

    /**
     * Event triggered on attachment upload failure.
     * Provides details about the failed file and error message.
     *
     * @event attachmentUploadFailure
     */
    @Event()
    public attachmentUploadFailure: EmitType<object>;

    /**
     * Event triggered when an attachment is removed.
     * Provides details about the removed file.
     *
     * @event attachmentRemoved
     */
    @Event()
    public attachmentRemoved: EmitType<object>;

    /**
     * Triggers when an uploaded file is being removed.
     * Provides details about the file removal operation.
     *
     * @event attachmentRemoving
     */
    @Event()
    public attachmentRemoving: EmitType<RemovingEventArgs>;

    /**
     * Event triggered when clickable thinking context item is clicked.
     * Provides context item details and event information for custom handling.
     *
     * @event editableContextClicked
     */
    @Event()
    public editableContextClicked: EmitType<EditableContextClickedEventArgs>;

    /**
     * Event triggered when a mention item is selected from the mention popup.
     * Provides details about the selected mention item and allows the selection action to be canceled.
     *
     * @event mentionSelect
     */
    @Event()
    public mentionSelect: EmitType<AssistMentionSelectEventArgs>;

    /* Private variables */
    private l10n: L10n;
    private viewWrapper: HTMLElement;
    private outputElement: HTMLElement;
    private skeletonContainer: HTMLElement;
    private aiAssistViewRendered: boolean;
    private outputSuggestionEle : HTMLElement;
    private contentFooterEle: HTMLElement;
    private contentWrapper: HTMLElement;
    private responseToolbarEle: Toolbar;
    private assistViewTemplateIndex: number;
    private toolbarHeader: HTMLElement;
    private assistCustomSection: HTMLElement;
    private toolbarItems: ItemModel[] = [];
    private toolbar: Toolbar;
    private displayContents: HTMLElement[] = [];
    private previousElement: HTMLElement;
    private isOutputRenderingStop: boolean;
    private promptToolbarEle: Toolbar;
    private isAssistView: boolean;
    private outputContentBodyEle: HTMLElement;
    private preTagElements: { preTag: HTMLPreElement; handler: Function }[] = [];
    private isResponseRequested : boolean;
    private lastStreamPrompt: string;
    private uploadedFiles: FileInfo[] = [];
    private uploaderObj: Uploader;
    private isAttachmentRemovalCancelled: boolean = false;
    private speechToTextObj: SpeechToText;
    private dropArea: HTMLElement;
    private footerToolbarEle: Toolbar;
    private footerLeftToolbarEle: Toolbar;
    private sendToolbarItem: ItemModel = null;
    private clearToolbarItem: ItemModel = null;
    private attachmentToolbarItem: ItemModel = null;
    private speechToTextToolbarItem: ItemModel = null;
    private latestResponseMinHeight: number | null = null;
    private downArrowIcon: Fab;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private mentionModels: Mention[] = [];
    private regeneratedResponses: Map<number, string[]> = new Map();
    private regeneratedBlocks: Map<number, ResponseBlock[][]> = new Map();
    private currentRegeneratedIndex: Map<number, number> = new Map();
    private originalResponses: Map<number, string> = new Map();
    private originalBlocks: Map<number, ResponseBlock[]> = new Map();
    private isRegenerating: boolean = false;
    private regeneratingPromptIndex: number = -1;
    private blockIndex: number = 0;
    private lastRenderedBlockCount: number = 0;
    private isToolResponse: boolean;
    private registeredTools: Map<string, ToolUIConfig> = new Map();
    private selectedMentions: {itemData: FieldSettingsModel, mentionChar: string, element: HTMLElement}[] = [];
    private mentionCounter: number = 0;

    /**
     * Enhanced setup: Enforce viewport on .e-content + dynamic min-height on latest .e-output-container.
     * Preserves structure; only inline styles on existing elements. Scrolls to prompt top.
     * Also applies during loading by sizing the skeleton container when the final response item
     * isn't rendered yet.
     *
     * @private
     * @returns {void}
     */
    private setupViewportFilling(): void {
        if (!this.contentWrapper || this.prompts.length === 0) {return; }
        const lastIndex: number = this.prompts.length - 1;
        const allResponseItems: HTMLElement[] = Array.from(this.contentWrapper.querySelectorAll('.e-output-container[id^="e-response-item_"]')) as HTMLElement[];

        // Set auto for all previous .e-output-container (as in example)
        for (let i: number = 0; i < allResponseItems.length; i++) {
            const index: number = parseInt(allResponseItems[i as number].id.split('_')[1], 10);
            if (index < lastIndex) {
                allResponseItems[i as number].style.minHeight = 'auto';

                const footerEle: HTMLElement = allResponseItems[i as number].querySelector('.e-content-footer');
                if (footerEle) {
                    footerEle.classList.remove('e-assist-toolbar-active');
                }
            }
        }
        // Compute dynamic min-height based on viewport and fixed chrome (header/footer/paddings)
        const contentWrapperHeight: number = this.contentWrapper.clientHeight;
        const promptEle: HTMLElement = this.contentWrapper.querySelector(`#e-prompt-item_${lastIndex}`) as HTMLElement | null;
        const promptHeight: number = promptEle ? promptEle.offsetHeight : 0;

        // Get the actual height of uploaded files if they exist
        const promptFilesEle: HTMLElement = promptEle ? promptEle.querySelector('.e-prompt-uploaded-files') as HTMLElement : null;
        const promptFilesHeight: number = promptFilesEle ? promptFilesEle.offsetHeight : 0;

        // Get the actual height of prompt toolbar if it exists
        const promptToolbarEle: HTMLElement = promptEle ? promptEle.querySelector('.e-prompt-toolbar') as HTMLElement : null;
        const promptToolbarHeight: number = promptToolbarEle ? promptToolbarEle.offsetHeight : 0;

        // Get the actual height of response toolbar if it exists
        const lastResponseEle: HTMLElement = this.contentWrapper.querySelector(`#e-response-item_${lastIndex}`) as HTMLElement | null;
        const responseToolbarEle: HTMLElement = lastResponseEle ? lastResponseEle.querySelector('.e-response-toolbar') as HTMLElement : null;
        const responseToolbarHeight: number = responseToolbarEle ? responseToolbarEle.offsetHeight : 0;

        // Check if suggestions are visible - if so, reserve space for them
        const suggestionsHeight: number = (this.suggestionsElement && !this.suggestionsElement.hidden) ?
            this.suggestionsElement.offsetHeight : 0;

        let scrollToBottomBtnHeight: number = 0;
        if (this.downArrowIcon.element) {
            scrollToBottomBtnHeight = this.downArrowIcon.element.offsetHeight;
        }

        // Calculate minHeight to fill the content wrapper viewport completely
        const dynamicMinHeight: number =
        Math.max(160, contentWrapperHeight - promptHeight - promptFilesHeight - promptToolbarHeight -
            responseToolbarHeight - suggestionsHeight - scrollToBottomBtnHeight);
        this.latestResponseMinHeight = dynamicMinHeight;

        // Apply to the actual latest response container if available; otherwise apply to loading skeleton
        if (lastResponseEle) {
            lastResponseEle.style.minHeight = `${dynamicMinHeight}px`;
        } else if (this.skeletonContainer) {
            // Ensure the loader occupies the viewport so previous chats don't remain visible while loading
            this.skeletonContainer.style.minHeight = `${dynamicMinHeight}px`;
        }
    }

    private renderContentElement(): void {
        if (this.enableScrollToBottom) {
            const scrollDownButton: HTMLButtonElement = this.createElement('button', { id: `${this.element.id}-scrollDownButton`, className: 'e-scroll-down-btn' });
            this.downArrowIcon = new Fab({
                iconCss: 'e-icons e-assist-scroll-down',
                position: 'BottomCenter',
                target: this.outputElement.parentElement,
                isPrimary: false,
                visible: false
            });
            this.downArrowIcon.appendTo(scrollDownButton);
        }
    }

    private handleScroll(): void {
        const atBottom: boolean = this.checkScrollAtBottom(this.contentWrapper, 50);
        this.toggleScrollIcon(atBottom);
    }

    // Toggle button visibility (show if not at bottom and enableScrollToBottom=true)
    private toggleScrollIcon(atBottom: boolean): void {
        if (this.isResponseRequested || !this.enableScrollToBottom || !this.downArrowIcon) { return; }
        this.downArrowIcon.visible = !atBottom;
        this.downArrowIcon.dataBind();
    }

    // Click handler to scroll to bottom
    private scrollBtnClick(): void {
        if (this.enableScrollToBottom) {
            this.scrollToBottom();
        }
    }

    private hasSkeletonEle(): boolean {
        return this.skeletonContainer && this.outputElement.contains(this.skeletonContainer);
    }

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
        this.initializeLocale();
        this.renderPromptView();
    }

    private renderPromptView(): void {
        this.setDimension(this.element, this.width, this.height);
        this.renderViews();
        this.renderToolbar();
        this.updateFooterElementClass();
        this.wireEvents();
    }

    private renderToolbar(): void {
        this.updateHeaderToolbar();
        if (this.assistViewTemplateIndex < 0) { this.displayContents.unshift(this.contentWrapper); }
        else { this.displayContents.unshift(this.assistCustomSection); }
        this.previousElement = this.displayContents[this.activeView];
        this.renderHeaderToolbar();
        this.viewWrapper = this.element.querySelector('.e-view-content');
        this.updateActiveView();
        this.addCssClass(this.element, this.cssClass);
        this.updateHeader(this.showHeader, this.toolbarHeader, this.viewWrapper);
        this.aiAssistViewRendered = true;
        this.addRtlClass(this.element, this.enableRtl);
    }

    private renderViews(): void {
        this.assistViewTemplateIndex = -1;
        this.aiAssistViewRendered = false;
        this.isAssistView = false;
        this.isOutputRenderingStop = false;
        this.isResponseRequested = false;
        this.renderViewSections(this.element, 'e-view-header', 'e-view-content');
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
                    customViewTemplate = this.createElement('div', { className: 'e-customview-content-section-' + customViewCount + ' e-custom-view' });
                    this.getContextObject('customViewTemplate', customViewTemplate, -1, index);
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
        if (this.assistViewTemplateIndex >= 0 && this.views[this.assistViewTemplateIndex].viewTemplate) {
            this.assistCustomSection = this.createElement('div', { attrs: { class: 'e-assistview-content-section', 'data-index': this.element.id + '_view_0' } });
            this.getContextObject('assistViewTemplate', this.assistCustomSection, -1, this.assistViewTemplateIndex);
        } else {
            this.renderDefaultView();
        }
    }

    private renderHeaderToolbar(): void {
        this.toolbar = new Toolbar({
            items: this.toolbarItems,
            height: '100%',
            enableRtl: this.enableRtl,
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
        this.toolbarHeader = this.element.querySelector('.e-view-header');
        const toolbarEle: HTMLElement = this.createElement('div');
        this.toolbar.appendTo(toolbarEle);
        this.toolbar.element.setAttribute('aria-label', 'assist-view-toolbar-header');
        this.toolbarHeader.appendChild(toolbarEle);
    }

    private updateHeaderToolbar(): void {
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
                align: item.align,
                tabIndex: item.tabIndex
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            this.viewWrapper.append(this.contentWrapper, this.footer);
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

    private renderDefaultView(): void {
        const viewWrapper: HTMLElement = this.element.querySelector('.e-view-content');
        this.createViewComponents(viewWrapper);
        this.contentWrapper = this.element.querySelector('.e-views');
        this.contentWrapper.setAttribute('data-index', this.element.id + '_view_0');
        const contentContainer: HTMLElement = this.element.querySelector('.e-view-container');
        this.content = this.getElement('contentContainer');
        this.getFooter();
        this.updateFooterClass(this.footerTemplate);
        this.renderContent();
        this.renderAssistViewFooter();
        this.updateBannerView(contentContainer);
        contentContainer.append(this.content);
        this.checkIsScrollable();
    }
    private checkIsScrollable(): void {
        if (this.enableScrollToBottom) {
            this.downArrowIcon.visible = this.contentWrapper.scrollHeight > this.contentWrapper.clientHeight;
        }
    }

    private initializeLocale(): void {
        this.l10n = new L10n('aiassistview', {
            stopResponseText: 'Stop Responding',
            fileSizeFailure: 'Upload failed: {0} files exceeded the maximum size',
            fileCountFailure: 'Upload limit reached: Maximum {0} files allowed. Remove extra files to proceed uploading',
            send: 'Send',
            attachments: 'Attach File',
            clear: 'Clear',
            readAloud: 'Read Aloud',
            stopAudio: 'Stop',
            previousResponse: 'Previous',
            nextResponse: 'Next',
            noRecordsTemplate: 'No records found'
        }, this.locale);
        this.l10n.setLocale(this.locale);
    }

    private toggleStopRespondingButton(show: boolean): void {
        const sendIconClass: string = 'e-assist-send';
        const stopIconClass: string = 'e-assist-stop';
        const stopTooltip: string = this.l10n.getConstant('stopResponseText');
        if (!this.footerTemplate) {
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

    private hasStopResponseButton(): boolean {
        if (!this.footerToolbarEle && this.footerTemplate) {
            return this.footer.querySelector('.e-assist-stop') ? true : false;
        }
        else if (this.footerToolbarEle) {
            return this.footerToolbarEle.element.querySelector('.e-assist-stop') ? true : false;
        }
        return false;
    }

    private finalizeIncompleteThinkingBlocks(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        // Step 1: Get last prompt index
        const lastPromptIndex: number = this.prompts.length - 1;
        if (lastPromptIndex < 0) { return; } // No prompts yet

        const lastPrompt: PromptModel = this.prompts[parseInt(lastPromptIndex.toString(), 10)];
        if (!lastPrompt.blocks || lastPrompt.blocks.length === 0) { return; } // No blocks

        // Step 2: Single-pass transform + check for incomplete thinking blocks
        let hasIncompleteThinking: boolean = false;
        const finalizedBlocks: ResponseBlock[] = lastPrompt.blocks.map((block: ResponseBlock) => {
            if (block.blockType === 'thinking') {
                const thinkingBlock: ThinkingBlock = block as ThinkingBlock;
                // Track if this block is incomplete
                if (thinkingBlock.isActive ||
                    (thinkingBlock.stages && thinkingBlock.stages.some((s: ThinkingStage) => s.status === 'inprogress'))) {
                    hasIncompleteThinking = true;
                }
                // Transform block
                return {
                    ...thinkingBlock,
                    isActive: false,  // Stop showing spinner
                    stages: (thinkingBlock.stages || []).map((stage: ThinkingStage) => ({
                        ...stage,
                        // Only change inProgress → failed; keep others
                        status: stage.status.toLowerCase() === 'inprogress' ? 'failed' : stage.status,
                        iconCss: stage.status.toLowerCase() === 'inprogress'
                            ? 'e-icons e-close'  // Error icon instead of progress
                            : stage.iconCss
                    }))
                };
            }
            // Non-thinking blocks pass through unchanged
            return block;
        });

        if (!hasIncompleteThinking) {
            this.isProtectedOnChange = prevOnChange;
            return;  // Nothing to finalize
        }

        // Step 3: Replace blocks in last prompt (immutable update)
        lastPrompt.blocks = finalizedBlocks;
        this.isProtectedOnChange = prevOnChange;

        // Step 4: Re-render existing response without adding new response
        // This updates the existing response with finalized blocks
        this.addPromptResponse( { blocks: finalizedBlocks});
    }

    private renderContent(): void {
        this.renderOutputContent();
        this.renderSuggestions(this.promptSuggestions, this.promptSuggestionsHeader, this.promptSuggestionItemTemplate,
                               'promptSuggestion', 'promptSuggestionItemTemplate', this.onSuggestionClick);
        this.renderContentElement();
        if (this.outputElement) { this.renderSkeleton(); }
    }

    private renderOutputContent(isMethodCall?: boolean): void {
        this.outputElement = this.getElement('outputElement');
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
                if (!this.originalResponses.has(i)) {
                    this.originalResponses.set(i, prompt.response || '');
                    this.originalBlocks.set(i, prompt.blocks || []);
                }
                if (prompt.regeneratedResponses && prompt.regeneratedResponses.length > 0) {
                    const responseStack: string[] = [this.originalResponses.get(i)!, ...prompt.regeneratedResponses];
                    this.regeneratedResponses.set(i, responseStack);
                    const blocksStack: ResponseBlock[][] = [this.originalBlocks.get(i) || []];
                    for (let j: number = 0; j < prompt.regeneratedResponses.length; j++) {
                        blocksStack.push([]);
                    }
                    this.regeneratedBlocks.set(i, blocksStack);
                    this.currentRegeneratedIndex.set(i, responseStack.length - 1);
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    prompt.response = responseStack[responseStack.length - 1];
                    prompt.blocks = [];
                    this.isProtectedOnChange = prevOnChange;
                }
                this.renderOutputContainer(SanitizeHtmlHelper.sanitize(prompt.prompt)
                    , SanitizeHtmlHelper.sanitize(prompt.response), prompt.attachedFiles, i, undefined, true, prompt.blocks);
            });
        }
        if (this.suggestionsElement && this.content.contains(this.suggestionsElement)) {
            this.content.insertBefore(this.outputElement, this.suggestionsElement);
        }
        else { this.content.appendChild(this.outputElement); }
        if (isMethodCall) { this.aiAssistViewRendered = true; }
    }

    private updateBannerView(contentContainer: HTMLElement): void {
        if (this.prompts.length === 0) {
            this.renderBannerView(this.bannerTemplate, contentContainer, 'bannerTemplate');
        }
    }

    private renderAssistViewFooter(): void {
        const textareaAndIconsWrapper: HTMLElement = this.createElement('div', { attrs: { class: 'e-textarea-icons-wrapper' } });
        if (this.footerTemplate) {
            this.updateContent(this.footerTemplate, this.footer, {}, 'footerTemplate');
        } else {
            this.editableTextarea = this.createElement('div', {
                attrs: {
                    class: 'e-assist-textarea',
                    contenteditable: 'true',
                    placeholder: this.promptPlaceholder,
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
            });
            this.appendChildren(textareaAndIconsWrapper, this.editableTextarea, hiddenTextarea);
            this.footer.append(textareaAndIconsWrapper);
        }
        if (!this.footerTemplate) {
            const footerIconsWrapper: HTMLDivElement = this.createElement('div', { attrs: { class: 'e-footer-icons-wrapper e-footer-right-items'}});
            this.renderFooterToolbar(footerIconsWrapper);
            textareaAndIconsWrapper.appendChild(footerIconsWrapper);
            this.footer.appendChild(textareaAndIconsWrapper);
            this.footer.classList.add('e-footer-focus-wave-effect');
            this.refreshTextareaUI();
            this.pushToUndoStack(this.prompt);
            this.initializeMentions();
        }
    }

    private getUploaderElement(): HTMLElement {
        let uploaderElement: HTMLElement = null;

        if (this.footerLeftToolbarEle) {
            uploaderElement = this.footerLeftToolbarEle.element.querySelector('.e-assist-file-upload') as HTMLElement;
        }

        if (!uploaderElement && this.footerToolbarEle) {
            uploaderElement = this.footerToolbarEle.element.querySelector('.e-assist-file-upload') as HTMLElement;
        }

        return uploaderElement;
    }

    private renderFooterToolbar(container: HTMLElement): void {
        const customItems: ToolbarItemModel[] = this.footerToolbarSettings.items || [];
        const isInlineMode: boolean = (this.footerToolbarSettings.toolbarPosition || '').toLowerCase() !== 'bottom';
        const rightItems: ItemModel[] = [];
        const leftItems: ItemModel[] = [];

        for (const customItem of customItems) {
            const isSttToolbarItem: boolean = customItem.iconCss.indexOf('e-assist-speech-to-text') !== -1;
            const mappedItem: ItemModel = {
                type: customItem.type,
                template: isSttToolbarItem && isNOU(customItem.template) ? '<button class="e-assistview-speech-to-text e-tbar-btn"></button>' : customItem.template,
                disabled: customItem.disabled,
                cssClass: customItem.cssClass,
                visible: customItem.visible,
                tooltipText: customItem.tooltip,
                prefixIcon: customItem.iconCss,
                text: customItem.text,
                align: customItem.align,
                tabIndex: customItem.disabled ? -1 : (customItem.tabIndex >= 0 ? customItem.tabIndex : 0)

            };
            if (isInlineMode && customItem.align === 'Left') {
                leftItems.push(mappedItem);
            } else {
                rightItems.push(mappedItem);
            }
        }

        if (this.enableAttachments && !this.isDuplicatedItem('e-icons e-assist-attachment-icon', rightItems.concat(leftItems))) {
            this.attachmentToolbarItem = {
                prefixIcon: 'e-icons e-assist-attachment-icon',
                tooltipText: this.l10n.getConstant('attachments'),
                align: 'Right'
            };
            rightItems.push(this.attachmentToolbarItem);
        }

        if (this.speechToTextSettings.enable && !this.isDuplicatedItem('e-icons e-assist-speech-to-text', rightItems.concat(leftItems))) {
            this.speechToTextToolbarItem = {
                id: this.element.id + '_speechtotext',
                template: '<button class="e-assistview-speech-to-text e-tbar-btn"></button>',
                prefixIcon: 'e-icons e-assist-speech-to-text',
                align: 'Right'
            };
            rightItems.push(this.speechToTextToolbarItem);
        }

        if (this.showClearButton && !this.isDuplicatedItem('e-icons e-assist-clear-icon', rightItems.concat(leftItems))) {
            this.clearToolbarItem = {
                prefixIcon: 'e-icons e-assist-clear-icon',
                tooltipText: this.l10n.getConstant('clear'),
                align: 'Right'
            };
            rightItems.push(this.clearToolbarItem);
        }

        if (!this.isDuplicatedItem('e-icons e-assist-send', rightItems.concat(leftItems))) {
            this.sendToolbarItem = {
                prefixIcon: 'e-icons e-assist-send',
                align: 'Right'
            };
            rightItems.push(this.sendToolbarItem);
        }

        const toolbarClickHandler: (args: ClickEventArgs) => void = (args: ClickEventArgs): void => {
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
            if (this.footerToolbarSettings.itemClick) {
                this.footerToolbarSettings.itemClick.call(this, eventArgs);
            }
            if (!eventArgs.cancel) {
                switch (args.item.prefixIcon) {
                case 'e-icons e-assist-send':
                    if (!this.isResponseRequested && !args.item.disabled) {
                        this.onSendIconClick();
                    }
                    break;
                case 'e-icons e-assist-stop':
                    this.respondingStopper(args.originalEvent as MouseEvent);
                    break;
                case 'e-icons e-assist-clear-icon':
                    this.clearIconHandler();
                    break;
                case 'e-icons e-assist-attachment-icon':
                    if (this.uploaderObj && this.attachmentToolbarItem) {
                        let uploaderElement: HTMLElement = this.getUploaderElement();
                        if (!uploaderElement) {
                            this.updateAttachmentElement();
                            uploaderElement = this.getUploaderElement();
                        }
                        if (uploaderElement) {
                            uploaderElement.click();
                        }
                    }
                    break;
                }
            }
        };

        this.footerToolbarEle = new Toolbar({
            items: rightItems,
            enableRtl: this.enableRtl,
            width: '100%',
            clicked: toolbarClickHandler
        });

        const toolbarContainer: HTMLElement = this.createElement('div');
        this.footerToolbarEle.appendTo(toolbarContainer);
        this.footerToolbarEle.element.setAttribute('aria-label', 'assist-footer-toolbar');
        container.appendChild(toolbarContainer);

        if (isInlineMode && leftItems.length > 0) {
            this.footerLeftToolbarEle = new Toolbar({
                items: leftItems,
                enableRtl: this.enableRtl,
                width: '100%',
                clicked: toolbarClickHandler
            });
            const leftToolbarContainer: HTMLElement = this.createElement('div');
            this.footerLeftToolbarEle.appendTo(leftToolbarContainer);
            this.footerLeftToolbarEle.element.setAttribute('aria-label', 'assist-footer-left-toolbar');
            const leftItemsContainer: HTMLElement = this.createElement('div', {
                attrs: { class: 'e-footer-left-items' }
            });
            leftItemsContainer.appendChild(leftToolbarContainer);
            this.insertLeftItems(leftItemsContainer);
        }

        this.updateAttachmentElement();
        this.renderSpeechToText();
    }

    private insertLeftItems(leftItems: HTMLElement): void {
        const textareaAndIconsWrapper: HTMLElement = this.footer.querySelector('.e-textarea-icons-wrapper') as HTMLElement;
        if (!textareaAndIconsWrapper) { return; }
        const textarea: HTMLElement = textareaAndIconsWrapper.querySelector('.e-assist-textarea') as HTMLElement;
        if (textarea) {
            textareaAndIconsWrapper.insertBefore(leftItems, textarea);
        } else {
            textareaAndIconsWrapper.appendChild(leftItems);
        }
    }

    private isDuplicatedItem(iconCss: string, toolbarItems: ItemModel[]): boolean {
        for (const item of toolbarItems) {
            if ((item.prefixIcon || '') === iconCss) {
                switch (iconCss) {
                case 'e-icons e-assist-send':
                    this.sendToolbarItem = item;
                    break;
                case 'e-icons e-assist-clear-icon':
                    this.clearToolbarItem = item;
                    break;
                case 'e-icons e-assist-attachment-icon':
                    this.attachmentToolbarItem = item;
                    break;
                }
                return true;
            }
        }
        return false;
    }

    private updateAttachmentElement(): void {
        if (this.enableAttachments && this.attachmentToolbarItem) {
            this.renderAttachmentIcon();
        }
        else {
            if (this.uploaderObj) {
                this.uploaderObj.destroy();
                this.dropArea.innerHTML = '';
                remove(this.dropArea);
            }
        }
    }

    private renderSpeechToText(): void {
        if (this.speechToTextObj) {
            this.speechToTextObj.destroy();
            this.speechToTextObj = null;
        }
        if (this.speechToTextSettings.enable) {
            this.speechToTextObj = new SpeechToText({
                allowInterimResults: this.speechToTextSettings.allowInterimResults,
                transcript: this.speechToTextSettings.transcript,
                lang: this.speechToTextSettings.lang,
                listeningState: this.speechToTextSettings.listeningState,
                disabled: this.speechToTextSettings.disabled,
                buttonSettings: this.speechToTextSettings.buttonSettings,
                showTooltip: this.speechToTextSettings.showTooltip,
                tooltipSettings: this.speechToTextSettings.tooltipSettings,
                cssClass: this.speechToTextSettings.cssClass,
                onStart: (args: StartListeningEventArgs) => {
                    if (this.speechToTextSettings.onStart) {
                        this.speechToTextSettings.onStart.call(this, args);
                    }
                },
                onStop: (args: StopListeningEventArgs) => {
                    if (this.speechToTextSettings.onStop) {
                        this.speechToTextSettings.onStop.call(this, args);
                    }
                },
                transcriptChanged: (args: TranscriptChangedEventArgs) => {
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    const value: string = this.prompt.length > 0 ? this.prompt + ' ' : '';
                    if (args.isInterimResult) {
                        this.editableTextarea.innerHTML = value + SanitizeHtmlHelper.sanitize(args.transcript);
                    }
                    else {
                        const prevPrompt: string = this.prompt;
                        this.prompt = value + SanitizeHtmlHelper.sanitize(args.transcript);
                        this.editableTextarea.innerHTML = this.prompt;
                        this.speechToTextObj.transcript = '';
                        this.editableTextarea.focus();
                        this.setFocusAtEnd(this.editableTextarea);
                        this.triggerPromptChanged(event, prevPrompt);
                    }
                    this.refreshTextareaUI();
                    // Debounced push to undo stack
                    this.scheduleUndoPush();
                    this.redoStack = [];
                    this.speechToTextSettings.transcript = args.transcript;
                    if (this.speechToTextSettings.transcriptChanged) {
                        this.speechToTextSettings.transcriptChanged.call(this, args);
                    }
                    this.isProtectedOnChange = prevOnChange;
                },
                onError: (args: ErrorEventArgs) => {
                    if (this.speechToTextSettings.onError) {
                        this.speechToTextSettings.onError.call(this, args);
                    }
                }
            });
            let speechToTextButton: HTMLElement = null;
            if (this.footerLeftToolbarEle) {
                speechToTextButton = this.footerLeftToolbarEle.element.querySelector('.e-assistview-speech-to-text') as HTMLElement;
            }

            if (!speechToTextButton && this.footerToolbarEle) {
                speechToTextButton = this.footerToolbarEle.element.querySelector('.e-assistview-speech-to-text') as HTMLElement;
            }
            if (speechToTextButton) {
                this.speechToTextObj.appendTo(speechToTextButton);
            }
        }
    }

    private initializeMentions(): void {
        if (!this.mentions || this.mentions.length === 0 || !this.editableTextarea) {
            return;
        }
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        for (const settings of this.mentions) {
            if (!settings.mentionChar) {
                continue; // Skip entries with empty mentionChar
            }

            const displayTemplate: string | Function = settings.displayTemplate || this.getMentionElement(settings);
            const noRecordsTemplate: string = settings.noRecordsTemplate || this.l10n.getConstant('noRecordsTemplate');

            const mentionInstance: Mention = new Mention({
                mentionChar: settings.mentionChar,
                dataSource: settings.dataSource,
                fields: settings.fields,
                query: settings.query,
                filterType: settings.filterType,
                highlight: settings.highlight,
                popupWidth: settings.popupWidth,
                popupHeight: settings.popupHeight,
                cssClass: this.enableRtl ? 'e-assist-mention e-rtl' : 'e-assist-mention',
                requireLeadingSpace: false,
                suffixText: '&nbsp;',
                allowSpaces: true,
                displayTemplate: displayTemplate,
                itemTemplate: settings.itemTemplate,
                noRecordsTemplate: noRecordsTemplate,
                change: this.onMentionUpdated.bind(this, settings.mentionChar),
                select: this.onMentionSelect.bind(this)
            }, this.editableTextarea);

            this.mentionModels.push(mentionInstance);
        }
        this.isProtectedOnChange = prevOnChange;
    }

    private getMentionElement(mentionItem: MentionSettingsModel, itemData?: FieldSettingsModel): string {
        const iconCssFieldName: string = mentionItem.fields.iconCss;
        let hasIconCss: boolean = false;
        let iconCssValue: string = '';
        if (itemData) {
            // eslint-disable-next-line security/detect-object-injection
            iconCssValue = (itemData as any)[iconCssFieldName] || itemData.iconCss || '';
            hasIconCss = !isNOU(iconCssValue) && typeof iconCssValue === 'string' && iconCssValue.trim() !== '';
        } else if (mentionItem.dataSource && (mentionItem.dataSource as any[]).length > 0) {
            const firstItem: any = (mentionItem.dataSource as any)[0];
            // eslint-disable-next-line security/detect-object-injection
            const iconValue: string = firstItem[iconCssFieldName] as string;
            hasIconCss = !isNOU(iconValue) && typeof iconValue === 'string' && iconValue.trim() !== '';
        }
        const shouldShowMentionChar: boolean = !hasIconCss && (!isNOU(mentionItem.showMentionChar) ? mentionItem.showMentionChar : true);
        let textContent: string = '';
        if (itemData) {
            const textFieldName: string = mentionItem.fields.text;
            // eslint-disable-next-line security/detect-object-injection
            const textValue: any = (itemData as any)[textFieldName] || itemData.text;
            textContent = !isNOU(textValue) ? String(textValue) : '';
        } else {
            textContent = '${' + mentionItem.fields.text + '}';
        }
        const mentionHTMLContent: string =
            (hasIconCss ? (itemData
                ? `<span class="${iconCssValue}"></span>`
                : `<span class="\${${mentionItem.fields.iconCss}}"></span>`)
                : '') +
            (shouldShowMentionChar ? `<span class="e-mention-char">${mentionItem.mentionChar}</span>` : '') +
            '<span class="e-aiassist-mention-item-chip">' +
                textContent +
            '</span>';
        return mentionHTMLContent;
    }

    private renderAttachmentIcon(): void {
        this.dropArea = this.createElement('div', { attrs: { class: 'e-assist-drop-area' } });
        this.footer.prepend(this.dropArea);
        let attachmentIcon: HTMLElement = null;
        if (this.footerLeftToolbarEle) {
            attachmentIcon = this.footerLeftToolbarEle.element.querySelector('.e-assist-attachment-icon') as HTMLElement;
        }
        if (!attachmentIcon && this.footerToolbarEle) {
            attachmentIcon = this.footerToolbarEle.element.querySelector('.e-assist-attachment-icon') as HTMLElement;
        }
        const uploaderElement: HTMLElement = this.createElement('input', { attrs: { class: 'e-assist-file-upload', type: 'file', name: 'UploadFiles', id: 'fileUpload'} });
        attachmentIcon.appendChild(uploaderElement);
        this.uploaderObj = new Uploader({
            asyncSettings: {
                saveUrl: this.attachmentSettings.saveUrl,
                removeUrl: this.attachmentSettings.removeUrl
            },
            maxFileSize: this.attachmentSettings.maxFileSize,
            allowedExtensions: this.attachmentSettings.allowedFileTypes,
            progress: this.onUploadProgress.bind(this),
            success: this.onUploadSuccess.bind(this),
            failure: this.onUploadFailure.bind(this),
            uploading: this.onUploadStart.bind(this),
            removing: this.onAttachmentRemoving.bind(this),
            multiple: true,
            dropArea: this.footer,
            selected: (args: any) => {
                const oversized: FileInfo[] = args.filesData.filter((file: FileInfo) =>
                    file.status === (this.uploaderObj as any).l10n.getConstant('invalidMaxFileSize') && file.statusCode === '0');
                if (oversized.length) {
                    this.showFailureAlert('fileSizeFailure', oversized.length, 'e-size-failure');
                    (uploaderElement as any).value = '';
                }
                const totalSelected: number = args.filesData.length + this.uploadedFiles.length;
                if (totalSelected > this.attachmentSettings.maximumCount) {
                    args.cancel = true;
                    this.showFailureAlert('fileCountFailure', this.attachmentSettings.maximumCount, 'e-count-failure');
                    (uploaderElement as any).value = '';
                    return;
                }
            }
        });
        this.uploaderObj.appendTo(uploaderElement);
    }

    private showFailureAlert(localeConstantKey: string, fileCount: number, failureType: string): void {
        let failureMessage: string = this.l10n.getConstant(localeConstantKey).replace('{0}', fileCount.toString());
        if (fileCount === 1) {
            failureMessage = failureMessage.replace('files', 'file');
        }
        this.createFailureAlert(failureMessage, failureType);
    }

    private createFailureAlert(failureMessage: string, failureType: string): void {
        const failureAlert: HTMLElement = this.renderFailureAlert(this.viewWrapper, failureMessage, failureType, 'e-assist-circle-close', 'e-assist-clear-icon');
        if (this.viewWrapper.contains(this.footer)) {
            this.viewWrapper.insertBefore(failureAlert, this.footer);
        }
        failureAlert.classList.add('e-show');
        setTimeout(() => {
            this.handleFailureAlertRemove(this.viewWrapper, failureAlert);
        }, 3000);
    }

    private onUploadStart(args: UploadingEventArgs): void {
        this.trigger('beforeAttachmentUpload', args);
        this.uploadedFiles.push(args.fileData);
        const fileItem: HTMLElement = this.createFileItem(args.fileData, true);
        this.dropArea.appendChild(fileItem);
    }

    private onUploadProgress(args: any): void {
        const uploadProgress: number = args.e.loaded / args.e.total * 100;
        const progressFill: HTMLElement = this.footer.querySelector(`#e-assist-progress-${CSS.escape(args.file.name)}`) as HTMLElement;
        if (progressFill) {
            progressFill.style.width = `${uploadProgress}%`;
        }
    }

    private onMentionUpdated(mentionChar: string, args: MentionChangeEventArgs): void {
        const mentionId: string = (++this.mentionCounter).toString();
        const mentionElements: NodeListOf<HTMLElement> = this.editableTextarea.querySelectorAll('.e-mention-chip');
        const mentionElement: HTMLElement = mentionElements[mentionElements.length - 1] as HTMLElement;
        if (mentionElement) {
            mentionElement.setAttribute('data-mention-id', mentionId);
            this.selectedMentions.push({
                itemData: args.itemData,
                element: mentionElement,
                mentionChar: mentionChar
            });
        }
    }

    private onMentionSelect(args: SelectEventArgs): void {
        const eventArgs: AssistMentionSelectEventArgs = {
            cancel: false,
            event: args.e,
            isInteracted: args.isInteracted,
            itemData: args.itemData
        };
        this.trigger('mentionSelect', eventArgs);

        // If the event handler cancelled the selection, propagate it to the Mention control
        if (eventArgs.cancel) {
            args.cancel = true;
        }
    }

    private restoreMentionsFromPrompt(promptIndex: number): void {
        // Reset the selectedMentions and counter
        this.selectedMentions = [];
        this.mentionCounter = 0;

        // Get the stored mentions from the prompt data
        const storedMentions: MentionItems[] = this.prompts[parseInt(promptIndex.toString(), 10)].mentions;
        if (!storedMentions || storedMentions.length === 0 || !this.editableTextarea) {
            return;
        }

        // Get the rendered chips from the textarea
        const mentionElements: NodeListOf<HTMLElement> = this.editableTextarea.querySelectorAll('.e-mention-chip') as NodeListOf<HTMLElement>;

        // Rebuild selectedMentions array by matching stored mentions to rendered chips
        for (let i: number = 0; i < mentionElements.length; i++) {
            const mentionElement: HTMLElement = mentionElements[parseInt(i.toString(), 10)];
            const mentionId: string = (++this.mentionCounter).toString();
            mentionElement.setAttribute('data-mention-id', mentionId);

            // Match the chip with the corresponding stored mention
            if (i < storedMentions.length) {
                const storedMention: MentionItems = storedMentions[parseInt(i.toString(), 10)];
                this.selectedMentions.push({
                    itemData: storedMention.itemData,
                    element: mentionElement,
                    mentionChar: storedMention.mentionChar
                });
            }
        }
    }

    private onUploadSuccess(args: any): void {
        if (args.operation === 'upload') {
            this.trigger('attachmentUploadSuccess', args);
            const progressFill: HTMLElement = this.footer.querySelector(`#e-assist-progress-${CSS.escape(args.file.name)}`) as HTMLElement;
            if (progressFill) {
                progressFill.style.width = '100%';
                this.cleanupFileItem(args.file.name);
            }
            const progressBar: HTMLElement = this.footer.querySelector('.e-assist-progress-fill');
            if (!progressBar) {
                this.checkAndActivateSendIcon();
            }
        }
        else if (args.operation === 'remove') {
            this.trigger('attachmentRemoved', args);
        }
    }

    private cleanupFileItem(fileName: string): void {
        const fileItem: HTMLElement = this.footer.querySelector(`#e-assist-progress-${CSS.escape(fileName)}`) as HTMLElement;
        if (fileItem) {
            fileItem.parentElement.remove();
        }
    }

    /**
     * Handles the internal Uploader's `removing` event and forwards it to the public
     * `attachmentRemoving` event. The same args object reference is passed through, so any
     * changes made by the consumer (`args.cancel`, `args.customFormData`, `args.postRawFile`)
     * are honored by the Uploader before the remove request is dispatched.
     *
     * @param {RemovingEventArgs} args - Specifies the removing event arguments from the Uploader.
     * @returns {void}
     */
    private onAttachmentRemoving(args: RemovingEventArgs): void {
        this.trigger('attachmentRemoving', args);
        this.isAttachmentRemovalCancelled = !!args.cancel;
    }

    private onUploadFailure(args: any): void {
        if (args.operation === 'remove') {
            this.trigger('attachmentRemoved', args);
        }
        else {
            this.trigger('attachmentUploadFailure', args);
            this.uploaderObj.remove(args.file);
            this.uploadedFiles = this.uploadedFiles.filter((file: FileInfo) => file.name !== args.file.name);
            const progressFill: HTMLElement = this.footer.querySelector(`#e-assist-progress-${CSS.escape(args.file.name)}`) as HTMLElement;
            if (progressFill) {
                progressFill.style.width = '100%';
                progressFill.classList.add('e-assist-upload-failed');
            }
        }
    }

    private createFileItem(fileData: FileInfo, isForFooter: boolean): HTMLElement {
        const fileItem: HTMLElement = this.createElement('div', { className: 'e-assist-uploaded-file-item' });
        if (this.attachmentSettings.attachmentTemplate) {
            const introContainer: HTMLElement = this.createElement('div', { className: 'e-attachment-template' });
            fileItem.appendChild(introContainer);
            this.getContextObject('attachmenttemplate', introContainer, -1 , -1, fileData);
        }
        else {
            const fileIcon: HTMLElement = this.createElement('div', {
                className: 'e-assist-file-icon-svg'
            });
            fileIcon.appendChild(this.createFileTypeIcon(fileData.name));
            const fileDetails: HTMLElement = this.createElement('div', { className: 'e-assist-file-details' });
            const fileName: HTMLElement = this.createElement('span', { className: 'e-assist-file-name', innerHTML: fileData.name });
            const fileSize: HTMLElement = this.createElement('span', { className: 'e-assist-file-size', innerHTML: `${(fileData.size / 1024).toFixed(2)} KB` });
            fileDetails.append(fileName, fileSize);
            fileItem.append(fileIcon, fileDetails);
        }
        const progressBar: HTMLElement = this.createElement('div', { className: 'e-assist-progress-bar' });
        const progressFill: HTMLElement = this.createElement('div', { id: `e-assist-progress-${fileData.name}`, className: 'e-assist-progress-fill' });

        progressBar.appendChild(progressFill);
        let closeButton: HTMLElement;
        if (isForFooter) {
            closeButton = this.createElement('span', { attrs: { class: 'e-icons e-assist-clear-icon', role: 'button', 'aria-label': 'Clear file', tabindex: '-1' } });
            EventHandler.add(closeButton, 'click', () => this.handleRemoveUploadedFile(closeButton, fileData, fileItem));
            fileItem.append(closeButton);
        }
        fileItem.append(progressBar);
        EventHandler.add(fileItem, 'click', (event: MouseEvent) => {
            if (closeButton && (event.target === closeButton || (event.target as HTMLElement).classList.contains('e-assist-clear-icon'))) {
                return;
            }
            this.handleAttachmentPreview(fileData);
        });
        return fileItem;
    }

    private handleAttachmentPreview(file: FileInfo): void {
        const eventArgs: AttachmentClickEventArgs = {};
        if (this.attachmentSettings.attachmentClick) {
            this.attachmentSettings.attachmentClick.call(this, eventArgs);
        }
    }

    private handleRemoveUploadedFile(closeButton: HTMLElement, fileData: FileInfo, fileItem: HTMLElement): void {
        this.uploaderObj.remove(fileData);
        if (this.isAttachmentRemovalCancelled) {
            return;
        }
        this.uploadedFiles = this.uploadedFiles.filter((file: FileInfo) => file.name !== fileData.name);
        EventHandler.remove(closeButton, 'click', this.handleRemoveUploadedFile);
        fileItem.remove();
        this.checkAndActivateSendIcon();
    }

    private applyPromptChange(newState: TextState, oldState: TextState, event: KeyboardEvent): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.prompt = this.editableTextarea.innerHTML = newState.content;
        this.isProtectedOnChange = prevOnChange;
        this.refreshTextareaUI();
        this.setCursorPosition(newState.selectionStart, newState.selectionEnd);
        this.triggerPromptChanged(event, oldState.content);
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
        const prevPrompt: string = this.prompt;
        if (this.selectedMentions.length > 0)
        {
            this.prompt = this.getPromptTextWithPlaceholders();
        } else {
            this.prompt = SanitizeHtmlHelper.sanitize(textContent);
        }
        this.isProtectedOnChange = prevOnChange;
        this.refreshTextareaUI();
        this.editableTextarea.focus();
        // Debounced push to undo stack
        this.scheduleUndoPush();
        this.redoStack = [];
        this.triggerPromptChanged(event, prevPrompt);
    }
    private triggerPromptChanged(event: Event, prevPrompt: string): void {
        const eventArgs: PromptChangedEventArgs = {
            value: this.prompt,
            previousValue: prevPrompt,
            event: event,
            element: (event && event.currentTarget as HTMLElement) || this.editableTextarea
        };
        this.trigger('promptChanged', eventArgs);
    }

    private footerKeyHandler(e: KeyboardEvent): void {
        const targetElement: HTMLElement = e.target as HTMLElement;
        if (targetElement.classList.contains('e-tbar-btn') && targetElement.querySelector('.e-assist-attachment-icon')) {
            return;
        }
        this.keyHandler(e, 'footer');
    }

    private bindScroll(): void {
        if (this.contentWrapper) {
            EventHandler.add(this.contentWrapper, 'scroll', this.handleScroll, this);
        }
        if (this.enableScrollToBottom && this.downArrowIcon && this.downArrowIcon.element) {
            EventHandler.add(this.downArrowIcon.element, 'click', this.scrollBtnClick, this);
        }
    }
    private unBindScroll(): void {
        if (this.contentWrapper) {
            EventHandler.remove(this.contentWrapper, 'scroll', this.handleScroll);
        }
        if (this.enableScrollToBottom && this.downArrowIcon && this.downArrowIcon.element) {
            EventHandler.remove(this.downArrowIcon.element, 'click', this.scrollBtnClick);
        }
    }

    private attachFooterIconHandlersTo(container: HTMLElement): void {
        EventHandler.add(container, 'pointerdown', this.onFooterIconsPointerDown, this);
        EventHandler.add(container, 'click', this.onFooterIconsClick, this);
        EventHandler.add(container, 'focusout', this.onFooterIconsFocusOut, this);
    }

    private removeFooterIconHandlersFrom(container: HTMLElement): void {
        EventHandler.remove(container, 'pointerdown', this.onFooterIconsPointerDown);
        EventHandler.remove(container, 'click', this.onFooterIconsClick);
        EventHandler.remove(container, 'focusout', this.onFooterIconsFocusOut);
    }

    private wireEvents(): void {
        this.wireFooterEvents(this.footerTemplate);

        if (this.editableTextarea) {
            const footerIconsWrapper: HTMLElement = this.footer.querySelector('.e-footer-icons-wrapper') as HTMLElement;
            if (footerIconsWrapper) {
                this.attachFooterIconHandlersTo(footerIconsWrapper);
            }
            const footerLeftItems: HTMLElement = this.footer.querySelector('.e-footer-left-items') as HTMLElement;
            if (footerLeftItems) {
                this.attachFooterIconHandlersTo(footerLeftItems);
            }
        }
        if (this.enableScrollToBottom) {
            this.bindScroll();
        }
    }
    private unWireEvents(): void {
        this.unWireFooterEvents(this.footerTemplate);
        if (this.editableTextarea) {
            const footerIconsWrapper: HTMLElement = this.footer.querySelector('.e-footer-icons-wrapper') as HTMLElement;
            if (footerIconsWrapper) {
                this.removeFooterIconHandlersFrom(footerIconsWrapper);
            }
            const footerLeftItems: HTMLElement = this.footer.querySelector('.e-footer-left-items') as HTMLElement;
            if (footerLeftItems) {
                this.removeFooterIconHandlersFrom(footerLeftItems);
            }
        }
        this.detachCodeCopyEventHandler();
        this.unBindScroll();
    }
    private onFocusEditableTextarea(): void {
        if (this.footer) {
            this.footer.classList.add('e-footer-focused');
        }
        this.toggleClearIcon();
    }

    private onBlurEditableTextarea(e: FocusEvent): void {
        const relatedTargetEle: HTMLElement = e.relatedTarget as HTMLElement;

        if (relatedTargetEle && relatedTargetEle.closest('.e-toolbar')) {
            return;
        }

        if (!relatedTargetEle) {
            if (this.footer) {
                this.footer.classList.remove('e-footer-focused');
            }
            if (this.clearToolbarItem) {
                this.toggleClearIcon();
            }
        }
        else {
            if (this.clearToolbarItem) {
                if (relatedTargetEle && !(relatedTargetEle.querySelector('.e-assist-clear-icon'))) {
                    this.toggleClearIcon();
                }
            }
            if (this.footer) {
                this.footer.classList.remove('e-footer-focused');
            }
        }
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
            const mentionPopup: HTMLElement = document.querySelector('.e-assist-mention.e-mention');
            if (mentionPopup && mentionPopup.classList.contains('e-popup-open')) {
                return;
            }
            switch (value) {
            case 'footer':
                this.pushToUndoStack(this.editableTextarea.innerText);
                event.preventDefault();
                if (!this.isResponseRequested) {
                    this.onSendIconClick();
                }
                else if (this.isResponseRequested && this.hasStopResponseButton()) {
                    this.respondingStopper(event);
                }
                break;
            }
        }
        else if (event.key === 'Backspace' || event.key === 'Delete') {
            if (this.speechToTextObj) {
                this.speechToTextObj.transcript = '';
            }
        }
        else {
            this.handleUndoRedo(event);
        }
    }

    private clearIconHandler(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.editableTextarea.innerText = this.prompt = '';
        if (this.speechToTextObj) {
            this.speechToTextObj.transcript = '';
        }
        this.isProtectedOnChange = prevOnChange;
        this.refreshTextareaUI();
        this.editableTextarea.focus();
        this.pushToUndoStack(this.prompt);
        this.checkAndActivateSendIcon();
    }
    private respondingStopper(event: KeyboardEvent | MouseEvent): void {
        // Finalize incomplete thinking blocks to error state before stopping output
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.finalizeIncompleteThinkingBlocks();
        this.isProtectedOnChange = prevOnChange;
        this.isOutputRenderingStop = true;
        this.isResponseRequested = false;
        this.lastStreamPrompt = '';
        if (this.outputElement.hasChildNodes) {
            if (this.skeletonContainer && (this.skeletonContainer.parentNode === this.outputElement)) {
                this.outputElement.removeChild(this.skeletonContainer);
            }
        }
        this.toggleStopRespondingButton(false);
        const promptIndex: number = this.prompts ? this.prompts.length - 1 : -1;
        const eventArgs: StopRespondingEventArgs = {
            event: event,
            prompt: promptIndex >= 0 ? this.prompts[parseInt(promptIndex.toString(), 10)].prompt : '',
            dataIndex: this.prompts ? this.prompts.length - 1 : -1
        };
        this.trigger('stopRespondingClick', eventArgs);
        const outputContainer: HTMLDivElement = this.element.querySelector(`#e-response-item_${promptIndex}`);
        if (outputContainer) {
            const outputContentBodyEle: HTMLDivElement = this.element.querySelector(`#e-response-item_${this.prompts.length - 1}`).querySelector('.e-content-body');
            if (outputContentBodyEle) {
                this.renderPreTag(outputContentBodyEle);
            }
        }
    }

    private onSuggestionClick(e: Event, suggestion?: string): void {
        this.suggestionsElement.hidden = true;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        // Prefer the passed-in canonical suggestion; fall back to event target text if absent
        this.prompt = !isNOU(suggestion) ? suggestion : (e.target as HTMLElement).innerText;
        this.isProtectedOnChange = prevOnChange;
        this.onSendIconClick();
    }

    private onSendIconClick(): void {
        if (this.isResponseRequested || !(this.prompt.trim() || this.uploadedFiles.length)) {
            return;
        }
        if (!isNOU(this.speechToTextObj)) {
            this.speechToTextObj.stopListening();
        }
        this.isResponseRequested = true;
        this.lastStreamPrompt = '';
        if (this.suggestionsElement) { this.suggestionsElement.hidden = true; }
        this.isOutputRenderingStop = false;
        this.toggleStopRespondingButton(true);
        this.addPrompt();
        if (this.prompts.length === 1) {
            this.updateBannerTemplate('');
        }
        this.createOutputElement();
        const mentionChips: MentionItems[] = this.getMentionItems();
        const eventArgs: PromptRequestEventArgs = {
            cancel: false,
            responseToolbarItems: this.responseToolbarSettings.items,
            prompt: this.prompt,
            promptSuggestions: this.promptSuggestions,
            attachedFiles: [...this.uploadedFiles],
            mentions: mentionChips
        };
        this.clearUploadedFiles();
        this.selectedMentions = [];
        this.mentionCounter = 0;
        if (!this.footerTemplate) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.prompt = this.editableTextarea.innerText = '';
            this.isProtectedOnChange = prevOnChange;
            this.refreshTextareaUI();
            this.pushToUndoStack(this.prompt);
        }
        this.setupViewportFilling();
        this.trigger('promptRequest', eventArgs);
        if (this.contentWrapper) { this.scrollToBottom(); }
    }

    private clearUploadedFiles(): void {
        this.uploadedFiles = [];
        if (this.dropArea) {
            this.dropArea.innerHTML = '';
        }
    }

    private getMentionItems(): MentionItems[] {
        const mentions: MentionItems[] = [];

        if (!this.editableTextarea || this.mentions.length === 0) {
            return mentions;
        }
        // Remove deleted mentions
        const currentEditorChips: NodeListOf<HTMLElement> = this.editableTextarea.querySelectorAll('.e-mention-chip') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < currentEditorChips.length; i++) {
            const mentionElement: HTMLElement = currentEditorChips[parseInt(i.toString(), 10)];
            const mention: { itemData: FieldSettingsModel; mentionChar: string; element: HTMLElement; } = this.selectedMentions.find((item: { itemData: FieldSettingsModel; mentionChar: string; element: HTMLElement; }) => item.element.getAttribute('data-mention-id') === mentionElement.getAttribute('data-mention-id'));
            if (mention) {
                mentions.push({ itemData: mention.itemData, mentionChar: mention.mentionChar });
            }
        }
        return mentions;
    }

    private getPromptText(promptText: string, promptIndex: number, isCopyAction?: boolean): string {
        let mentions: MentionItems[] = [];
        if (this.prompts[parseInt(promptIndex.toString(), 10)].mentions &&
         this.prompts[parseInt(promptIndex.toString(), 10)].mentions.length > 0) {
            mentions = this.prompts[parseInt(promptIndex.toString(), 10)].mentions;
        }
        if (!mentions || mentions.length === 0) {
            return SanitizeHtmlHelper.sanitize(promptText);
        }

        const placeholderRegex: RegExp = /\{(-?\d+)\}/g;
        let renderedText: string = this.prompts[parseInt(promptIndex.toString(), 10)].prompt || promptText;
        let match: RegExpExecArray | null = placeholderRegex.exec(renderedText);
        const placeholders: Array<{ fullMatch: string; index: number }> = [];
        while (match !== null) {
            placeholders.push({
                fullMatch: match[0],
                index: parseInt(match[1], 10)
            });
            match = placeholderRegex.exec(renderedText);
        }
        for (const placeholder of placeholders) {
            const mentionIndex: number = placeholder.index;
            if (mentionIndex >= 0 && mentionIndex < mentions.length) {
                const mention: MentionItems = mentions[parseInt(mentionIndex.toString(), 10)];
                if (mention) {
                    renderedText = renderedText.replace(placeholder.fullMatch, this.renderMentionChipSimple(mention, isCopyAction));
                }
            }
        }
        return SanitizeHtmlHelper.sanitize(renderedText);
    }

    private renderMentionChipSimple(mention: MentionItems, isCopyAction?: boolean): string {
        const settings: MentionSettingsModel = this.mentions.find(
            (m: MentionSettingsModel) => m.mentionChar === mention.mentionChar
        );
        if (isNOU(settings) || !mention.itemData)
        {
            return '';
        }
        const textFieldName: string = settings.fields.text;
        // eslint-disable-next-line security/detect-object-injection
        const textValue: any = (mention.itemData as any)[textFieldName] || mention.itemData.text;
        const textContent: string = !isNOU(textValue) ? String(textValue) : '';
        if (isCopyAction) {
            return SanitizeHtmlHelper.sanitize(textContent);
        }
        const displayTemplate: string | Function = settings.displayTemplate;
        if (!isNOU(displayTemplate) && !(typeof displayTemplate === 'string' && displayTemplate === '')) {
            const tempContainer: HTMLElement = this.createElement('div');
            this.updateContent(displayTemplate, tempContainer, mention.itemData, 'mentionDisplayTemplate');
            let mentionContent: string = tempContainer.innerHTML;
            // Interpolate ${field} placeholders with data values
            for (const key in mention.itemData) {
                if (Object.prototype.hasOwnProperty.call(mention.itemData, key)) {
                    // eslint-disable-next-line security/detect-object-injection
                    const value: any = (mention as any).itemData[key];
                    const escapeKey: string = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const pattern: string = '\\$\\{' + escapeKey + '\\}';
                    // eslint-disable-next-line security/detect-non-literal-regexp
                    mentionContent = mentionContent.replace( new RegExp(pattern, 'g'), !isNOU(value) ? String(value) : '');
                }
            }
            return '<span class="e-mention-chip">' + SanitizeHtmlHelper.sanitize(mentionContent) + '</span>';
        }
        const mentionElement: string =
            '<span class="e-mention-chip">' +
                this.getMentionElement(settings, mention.itemData) +
            '</span>';
        return SanitizeHtmlHelper.sanitize(mentionElement);
    }

    private getPromptTextWithPlaceholders(): string {
        if (!this.editableTextarea) {
            return this.prompt;
        }

        const contentClone: HTMLElement = this.editableTextarea.cloneNode(true) as HTMLElement;
        let placeholderIndex: number = 0;

        const mentionElements: NodeListOf<HTMLElement> = contentClone.querySelectorAll('.e-mention-chip');
        for (const mentionElement of Array.from(mentionElements)) {
            const placeholder: Text = document.createTextNode(`{${placeholderIndex}}`);
            mentionElement.replaceWith(placeholder);
            placeholderIndex++;
        }

        return SanitizeHtmlHelper.sanitize(contentClone.innerHTML);
    }

    private addPrompt(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        const mentionChips: MentionItems[] = this.getMentionItems();
        const promptTextWithPlaceholders: string = this.getPromptTextWithPlaceholders();
        this.prompts = [...this.prompts, { prompt: promptTextWithPlaceholders, response: '', isResponseHelpful: null, attachedFiles: this.uploadedFiles, blocks: null, mentions: mentionChips }];
        this.isProtectedOnChange = prevOnChange;
    }

    private getContextObject(templateName: string, contentElement: HTMLElement, index?: number, arrayPosition?: number,
                             file?: FileInfo): void {
        let template: string | Function;
        let context: object = { };
        const contextIndex: number = index >= 0 ? index : -1;
        const contextPrompt: string = index >= 0 ? this.prompts[parseInt(contextIndex.toString(), 10)].prompt : '';
        const contextOutput: string = index >= 0 ? this.prompts[parseInt(contextIndex.toString(), 10)].response : '';
        switch (templateName.toLowerCase()) {
        case 'promptitemtemplate': {
            template = this.promptItemTemplate;
            context = {
                prompt: contextPrompt,
                toolbarItems: this.promptToolbarSettings.items,
                index: contextIndex,
                attachedFiles: this.uploadedFiles,
                mentions: index >= 0 ? this.prompts[parseInt(contextIndex.toString(), 10)].mentions : null
            };
            break;
        }
        case 'responseitemtemplate': {
            template = this.responseItemTemplate;
            context = {
                prompt: contextPrompt,
                response: contextOutput,
                index: contextIndex,
                toolbarItems: this.responseToolbarSettings.items,
                blocks: index >= 0 ? this.prompts[parseInt(contextIndex.toString(), 10)].blocks : null
            };
            break;
        }
        case 'customviewtemplate':
        case 'assistviewtemplate': {
            template = this.views[parseInt(arrayPosition.toString(), 10)].viewTemplate || '';
            break;
        }
        case 'attachmenttemplate': {
            template = this.attachmentSettings.attachmentTemplate;
            context = { selectedFile: file};
            break;
        }
        }
        this.updateContent(template, contentElement, context, templateName);
    }

    private createOutputElement(): void {
        this.outputSuggestionEle = this.createElement('div', { attrs: { id: `e-prompt-item_${this.prompts.length - 1}`, class: `e-prompt-container ${this.promptItemTemplate ? 'e-prompt-item-template' : ''}` } });
        this.renderPrompt(this.prompt, this.prompts.length - 1, this.uploadedFiles);
        this.outputElement.append(this.outputSuggestionEle, this.skeletonContainer);
        this.skeletonContainer.hidden = false;
    }

    private renderOutputContainer(
        promptText?: string,
        outputText?: string,
        attachedFiles?: FileInfo[],
        index?: number,
        isMethodCall?: boolean,
        isFinalUpdate?: boolean,
        blocks?: ResponseBlock[]
    ): void {
        const outputContainer: HTMLElement = this.createElement('div', { attrs: { id: `e-response-item_${index}`, class: `e-output-container ${this.responseItemTemplate ? 'e-response-item-template' : ''}`, ...(this.latestResponseMinHeight != null ?
            {style: `min-height:${this.latestResponseMinHeight}px`} : {}) } });
        this.renderOutput(outputContainer, promptText, outputText, attachedFiles, isMethodCall, index, isFinalUpdate, blocks);
        if (promptText) {
            this.outputElement.append(this.outputSuggestionEle);
        }
        this.outputElement.append(outputContainer);
        if (this.hasStopResponseButton() && isFinalUpdate && !this.isToolResponse) { this.toggleStopRespondingButton(false); }
        if (!this.isOutputRenderingStop && !this.content.contains(this.suggestionsElement) && this.suggestionsElement) {
            this.content.append(this.suggestionsElement);
        }
    }

    protected requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push(
            { member: 'assistThinking', args: [this] }
        );
        return modules;
    }

    private renderOutput(outputContainer: HTMLElement, promptText?: string, outputText?: string, attachedFiles?: FileInfo[],
                         isMethodCall?: boolean, index?: number, isFinalUpdate?: boolean, blocks?: ResponseBlock[]): void {
        const promptIcon: HTMLElement = this.createElement('span', {
            className: 'e-output-icon e-icons ' + (this.responseIconCss || (this.isAssistView && this.views[0].iconCss) || 'e-assistview-icon' ) });
        const aiOutputEle: HTMLElement = this.createElement('div', { className: 'e-output' });
        if (!this.aiAssistViewRendered || isMethodCall) {
            if (!isNOU(promptText) || (attachedFiles && attachedFiles.length > 0)) {
                this.outputSuggestionEle = this.createElement('div', { attrs: { id: `e-prompt-item_${index}`, class: `e-prompt-container ${this.promptItemTemplate ? 'e-prompt-item-template' : ''}` } });
                this.renderPrompt(promptText, index, attachedFiles);
            }
        }
        const lastPrompt: PromptModel = { prompt: promptText, response: outputText, blocks: blocks };
        const hasToolBlocks: boolean = Array.isArray(lastPrompt.blocks) && lastPrompt.blocks.length > 0;
        if (lastPrompt.response || hasToolBlocks) {
            if (this.responseItemTemplate) {
                this.getContextObject('responseItemTemplate', aiOutputEle, index);
                if (this.hasSkeletonEle() || this.outputElement.querySelector('.e-skeleton')) {
                    this.outputElement.removeChild(this.skeletonContainer);
                }
                if (this.contentFooterEle) { this.contentFooterEle.classList.remove('e-assist-toolbar-active'); }
                if (isFinalUpdate && this.hasStopResponseButton()) {
                    this.toggleStopRespondingButton(false);
                }
                this.renderOutputToolbarItems(index, isFinalUpdate);
                aiOutputEle.append(this.contentFooterEle);
                outputContainer.append(aiOutputEle);
            }
            else {
                this.renderOutputTextContainer(lastPrompt.response, aiOutputEle, index, false, isFinalUpdate, lastPrompt.blocks);
                outputContainer.append(promptIcon, aiOutputEle);
            }
        }
        else if (this.aiAssistViewRendered) {
            if (this.outputElement.querySelector('.e-skeleton')) {
                this.outputElement.removeChild(this.skeletonContainer);
            }
            if (this.suggestionsElement) { this.suggestionsElement.hidden = false; }
        }
    }

    private renderResponseSegments( outputEle: HTMLElement, blocks: ResponseBlock[] , isFinalUpdate?: boolean ): void {
        if (blocks.length === 0) {
            return;
        }
        if (!this.lastRenderedBlockCount) {
            this.lastRenderedBlockCount = 0;
        }
        if (blocks.length > this.lastRenderedBlockCount) {
            // NEW BLOCKS: Update already-rendered blocks state, then render new blocks
            this.updateExistingBlocksState(blocks, this.lastRenderedBlockCount);
            this.blockIndex = this.lastRenderedBlockCount;
            this.renderNextSegment(outputEle, blocks, isFinalUpdate);
            this.lastRenderedBlockCount = blocks.length;
        } else if (blocks.length === this.lastRenderedBlockCount) {
            // SAME COUNT: Update state of all already-rendered blocks
            this.updateExistingBlocksState(blocks, this.lastRenderedBlockCount);
            if (blocks[this.lastRenderedBlockCount - 1].blockType === 'text') {
                const block: TextBlock = blocks[this.lastRenderedBlockCount - 1] as TextBlock;
                const responseItem: HTMLDivElement = this.element.querySelector(`#e-response-item_${this.prompts.length - 1}`);
                this.updateResponse('', this.prompts.length - 1, isFinalUpdate, responseItem, block);
            }
            this.updateLastThinkingBlock(blocks);
        }
        if (isFinalUpdate) {
            if (this.blockIndex >= blocks.length && this.hasStopResponseButton()) {
                this.toggleStopRespondingButton(false);
                this.isResponseRequested = false;
            }
        }
    }

    private updateExistingBlocksState(blocks: ResponseBlock[], renderedCount: number): void {
        const responseItem: HTMLDivElement = this.element.querySelector(`#e-response-item_${this.prompts.length - 1}`);
        if (responseItem) {
            // Check and update only the blocks that were already rendered (0 to renderedCount-1)
            for (let index: number = 0; index < renderedCount; index++) {
                const block: ResponseBlock = blocks[parseInt(index.toString(), 10)];
                // Only thinking blocks have state that can change (isActive, stages status)
                if (block.blockType === 'thinking') {
                    const thinkingBlock: ThinkingBlock = block as ThinkingBlock;
                    const blockWrapper: HTMLElement = responseItem.querySelector(`.e-response-block-item-${index}`);
                    if (blockWrapper) {
                        // Update isActive state (spinner/check icon)
                        const isActiveChanged: boolean = thinkingBlock.isActive !== (blockWrapper.classList.contains('e-thinking-active'));
                        if (isActiveChanged) {
                            if (thinkingBlock.isActive) {
                                // Block becoming active: replace check icon with spinner
                                blockWrapper.classList.add('e-thinking-active');
                                blockWrapper.classList.remove('e-thinking-finished');

                                // Find the check icon span and replace with spinner span
                                const headerButton: HTMLElement = blockWrapper.querySelector('.e-aiassist-thinking-toggle');
                                if (headerButton) {
                                    const checkIconSpan: HTMLElement = headerButton.querySelector('.e-icons.e-check');
                                    if (checkIconSpan) {
                                        // Create new spinner span
                                        const spinnerSpan: HTMLElement = this.createElement('span', {
                                            attrs: { class: 'e-active-spinner' }
                                        });
                                        // Create and show spinner
                                        createSpinner({ target: spinnerSpan, type: 'Bootstrap' });
                                        // Replace check icon with spinner
                                        checkIconSpan.replaceWith(spinnerSpan);
                                        showSpinner(spinnerSpan);
                                    }
                                }
                            } else {
                                // Block becoming inactive: replace spinner with check icon
                                blockWrapper.classList.remove('e-thinking-active');
                                blockWrapper.classList.add('e-thinking-finished');
                                // Find the spinner span and replace with check icon span
                                const headerButton: HTMLElement = blockWrapper.querySelector('.e-aiassist-thinking-toggle');
                                if (headerButton) {
                                    const spinnerSpan: HTMLElement = headerButton.querySelector('.e-active-spinner');
                                    if (spinnerSpan) {
                                        // Hide and destroy spinner
                                        hideSpinner(spinnerSpan);
                                        // Create new check icon span
                                        const checkIconSpan: HTMLElement = this.createElement('span', {
                                            attrs: { class: 'e-icons e-check' }
                                        });
                                        // Replace spinner with check icon
                                        spinnerSpan.replaceWith(checkIconSpan);
                                    }
                                }
                            }
                        }
                        // Update stages if they changed
                        if (thinkingBlock.stages && thinkingBlock.stages.length > 0) {
                            // Determine if this is single stage or timeline rendering
                            const isSingleStage: boolean = thinkingBlock.stages.length === 1;

                            if (isSingleStage) {
                                // Single stage rendering uses .e-single-stage-container
                                const stage: ThinkingStage = thinkingBlock.stages[0];
                                const stageElement: HTMLElement = blockWrapper.querySelector('.e-single-stage-container');
                                if (stageElement) {
                                    // Get current stage status from DOM
                                    const statusMatch: RegExpMatchArray = stageElement.className.match(/e-stage-(\w+)/);
                                    const currentStatus: string = statusMatch ? statusMatch[1] : '';
                                    const statusChanged: boolean = stage.status !== currentStatus;
                                    if (statusChanged) {
                                        // Update stage status class (replace old status with new)
                                        stageElement.className = stageElement.className.replace(/e-stage-\w+/g, `e-stage-${stage.status}`);
                                        // Update stage status icon when status changes
                                        const stageIconElement: HTMLElement = stageElement.querySelector('.e-stage-icon');
                                        if (stageIconElement && stage.iconCss) {
                                            // Replace all icon classes with new one
                                            const iconClassList: string[] = stageIconElement.className.split(' ').filter((c: string) => {
                                                return !c.includes('e-') || c === 'e-icons' || c === 'e-stage-icon';
                                            });
                                            stageIconElement.className = `${iconClassList.join(' ')} ${stage.iconCss}`.trim();
                                        }
                                        // Add visual indicator when transitioning to completed
                                        if (stage.status === 'completed') {
                                            stageElement.classList.add('e-stage-completed');
                                            // Hide any spinners in this stage
                                            const stageSpinners: NodeListOf<Element> = stageElement.querySelectorAll('.e-active-spinner');
                                            stageSpinners.forEach((spinner: HTMLElement) => {
                                                hideSpinner(spinner);
                                            });
                                        }
                                        // Remove completed indicator and show spinners if status reverts to inprogress
                                        else if (stage.status === 'inprogress') {
                                            stageElement.classList.remove('e-stage-completed');
                                            // Show spinners when transitioning back to inprogress
                                            const stageSpinners: NodeListOf<Element> = stageElement.querySelectorAll('.e-active-spinner');
                                            stageSpinners.forEach((spinner: HTMLElement) => {
                                                spinner.style.display = '';  // Restore display
                                                showSpinner(spinner);
                                            });
                                        }
                                    }
                                }
                            } else {
                                // Multiple stages: Timeline rendering uses .e-timeline-wrapper with Timeline component
                                const timelineWrapper: HTMLElement = blockWrapper.querySelector('.e-timeline-wrapper');
                                if (timelineWrapper) {
                                    // Query timeline item elements and update their states
                                    const timelineItems: NodeListOf<Element> = timelineWrapper.querySelectorAll('.e-timeline-item');
                                    for (let stageIndex: number = 0; stageIndex < thinkingBlock.stages.length; stageIndex++) {
                                        const stage: ThinkingStage = thinkingBlock.stages[parseInt(stageIndex.toString(), 10)];
                                        const timelineItem: HTMLElement = timelineItems[parseInt(stageIndex.toString(), 10)] as HTMLElement;
                                        if (timelineItem) {
                                            // Get current stage status from DOM
                                            const statusMatch: RegExpMatchArray = timelineItem.className.match(/e-stage-(\w+)/);
                                            const currentStatus: string = statusMatch ? statusMatch[1] : '';
                                            const statusChanged: boolean = stage.status !== currentStatus;
                                            if (statusChanged) {
                                                // Update timeline item status class (replace old status with new)
                                                timelineItem.className = timelineItem.className.replace(/e-stage-\w+/g, `e-stage-${stage.status}`);
                                                // Update stage status icon when status changes
                                                const dotElement: HTMLElement = timelineItem.querySelector('.e-timeline-dot');
                                                if (dotElement && stage.iconCss) {
                                                    // Update dot CSS (for status icon)
                                                    dotElement.className = `e-timeline-dot ${stage.iconCss}`;
                                                }
                                                // Add visual indicator when transitioning to completed
                                                if (stage.status === 'completed') {
                                                    timelineItem.classList.add('e-stage-completed');
                                                    // Hide any spinners in this timeline item
                                                    const stageSpinners: NodeListOf<Element> = timelineItem.querySelectorAll('.e-stage-spinner');
                                                    stageSpinners.forEach((spinner: HTMLElement) => {
                                                        hideSpinner(spinner);
                                                    });
                                                }
                                                // Remove completed indicator and show spinners if status reverts to inprogress
                                                else if (stage.status === 'inprogress') {
                                                    timelineItem.classList.remove('e-stage-completed');
                                                    // Show spinners when transitioning back to inprogress
                                                    const stageSpinners: NodeListOf<Element> = timelineItem.querySelectorAll('.e-stage-spinner');
                                                    stageSpinners.forEach((spinner: HTMLElement) => {
                                                        spinner.style.display = '';  // Restore display
                                                        showSpinner(spinner);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private updateLastThinkingBlock(blocks: ResponseBlock[]): void {
        const responseItem: HTMLDivElement = this.element.querySelector(`#e-response-item_${this.prompts.length - 1}`);
        if (responseItem) {
            for (let index: number = 0; index < blocks.length; index++) {
                if (blocks[parseInt(index.toString(), 10)].blockType === 'thinking') {
                    const thinkingBlock: ThinkingBlock = blocks[parseInt(index.toString(), 10)] as ThinkingBlock;
                    let existingThinkingWrapper: HTMLElement = responseItem.querySelector('.e-response-block-item-' + (index));
                    if (existingThinkingWrapper) {
                        // Clear spinnerInstances Map for this block
                        const oldSpinners: NodeListOf<Element> = existingThinkingWrapper.querySelectorAll('.e-active-spinner');
                        oldSpinners.forEach((spinner: HTMLElement) => {
                            hideSpinner(spinner);
                        });
                        // Clear existing thinking content and re-render with new block data
                        existingThinkingWrapper.innerHTML = '';
                    }
                    else {
                        const outputContentBodyEle: HTMLElement = responseItem.querySelector('.e-content-body');
                        existingThinkingWrapper = this.createElement('div', { attrs: { class: `e-response e-response-block-item-${index}` } });
                        outputContentBodyEle.append(existingThinkingWrapper);
                    }
                    this.assistThinkingModule.createThinkingWrapper(thinkingBlock, existingThinkingWrapper,
                                                                    this.lastRenderedBlockCount - 1);
                }
            }
        }
    }

    private renderNextSegment( outputEle: HTMLElement, blocks: ResponseBlock[], isFinalUpdate?: boolean ): void {
        if (this.blockIndex >= blocks.length) {
            if (this.enableStreaming) {
                isFinalUpdate = true;
            }
            if (isFinalUpdate) {
                if (this.hasStopResponseButton()) {
                    this.toggleStopRespondingButton(false);
                }
                const responseIndex: number = this.prompts.length - 1;
                const responseItem: HTMLElement = this.element.querySelector('#e-response-item_' + (responseIndex));
                if (!this.responseItemTemplate && responseItem) {
                    const outputContainer: HTMLElement = responseItem.querySelector('.e-output') as HTMLElement;
                    if (isFinalUpdate && this.suggestionsElement) {
                        this.suggestionsElement.hidden = false;
                    }
                    if (isFinalUpdate && outputContainer.querySelector('.e-content-footer') === null) {
                        this.renderOutputToolbarItems(responseIndex, isFinalUpdate);
                        this.appendChildren(outputContainer, this.contentFooterEle);
                    }
                }
                this.isResponseRequested = false;
            }
            return;
        }
        const responseBlock: ResponseBlock = blocks[parseInt(this.blockIndex.toString(), 10)];
        const responseWrapper: HTMLElement = this.createElement('div', { attrs: { class: `e-response e-response-block-item-${this.blockIndex}` } });
        this.blockIndex++;
        // TEXT SEGMENT
        if (responseBlock.blockType === 'text') {
            const responseText: HTMLElement = this.createElement('div', {
                attrs: { class: 'e-text' }
            });
            responseWrapper.append(responseText);
            outputEle.appendChild(responseWrapper);
            const htmlResponse: string | Promise<string> = MarkdownConverter.toHtml(responseBlock.content);
            if (this.enableStreaming && !isFinalUpdate) {
                this.streamToolResponse(htmlResponse as string, responseText, () => {
                    if (isFinalUpdate) {
                        this.renderPreTag(responseText);
                    }
                    this.renderNextSegment(outputEle, blocks, isFinalUpdate);
                });
            } else {
                responseText.innerHTML = htmlResponse as string;
                this.renderNextSegment(outputEle, blocks, isFinalUpdate);
            }
            return;
        }
        // TOOL SEGMENT
        if (responseBlock.blockType === 'tool') {
            const tool: ToolUIConfig = this.registeredTools.get(responseBlock.toolName.toLowerCase());
            if (tool) {
                const toolContainer: HTMLElement = this.createElement('div', {
                    attrs: {
                        class: 'e-assist-tool'
                    }
                });
                responseWrapper.append(toolContainer);
                outputEle.appendChild(responseWrapper);
                this.renderToolUI(responseBlock, tool, toolContainer);
            }
            this.renderNextSegment(outputEle, blocks, isFinalUpdate);
            return;
        }

        //Thinking SEGMENT
        if (responseBlock.blockType === 'thinking') {
            this.assistThinkingModule.createThinkingWrapper(responseBlock, responseWrapper, this.blockIndex - 1);
            outputEle.appendChild(responseWrapper);
            this.renderNextSegment(outputEle, blocks, isFinalUpdate);
            return;
        }
    }

    private renderToolUI( toolBlock: ToolBlock, tool: ToolUIConfig, container: HTMLElement ): void {
        const toolArgs: any = toolBlock.props || {};
        try {
            this.updateContent(tool.template, container, toolArgs, 'toolTemplate');
            if (tool.handler) {
                tool.handler(container, toolArgs);
            }
        } catch (error) {
            //error statement
        }
    }

    private renderOutputTextContainer(
        response: string,
        aiOutputEle: HTMLElement,
        index?: number,
        isMethodCall?: boolean,
        isFinalUpdate?: boolean,
        blocks?: ResponseBlock[]
    ): void {
        if (this.contentFooterEle) { this.contentFooterEle.classList.remove('e-assist-toolbar-active'); }
        this.outputContentBodyEle = this.createElement('div', { attrs: { class: 'e-content-body', tabindex: '0' } });
        if (!isMethodCall && blocks && blocks.length > 0) {
            this.lastRenderedBlockCount = 0;
            this.renderResponseSegments(this.outputContentBodyEle, blocks, isFinalUpdate);
        }
        if (!isMethodCall && !isNOU(response) && response !== '') {
            this.updateDynamicResponse(this.outputContentBodyEle, isFinalUpdate, response, isNOU(blocks) ? 0 : blocks.length);
        }
        if (this.hasSkeletonEle() || this.outputElement.querySelector('.e-skeleton')) {
            this.outputElement.removeChild(this.skeletonContainer);
        }
        this.appendChildren(aiOutputEle, this.outputContentBodyEle);
        if (isFinalUpdate){
            this.renderOutputToolbarItems(index, isFinalUpdate);
            this.appendChildren(aiOutputEle, this.contentFooterEle);
        }
    }

    private updateDynamicResponse(outputContentBodyEle: HTMLElement, isFinalUpdate: boolean, response: string, blocksLength: number): void {
        // Method used for updating the response value from prompt collection
        let responseWrapper: HTMLElement = outputContentBodyEle.querySelector(`.e-response.e-response-block-item-${blocksLength}`);
        const existingResponseWrapper: boolean = responseWrapper === null;
        if (existingResponseWrapper) {
            responseWrapper = this.createElement('div', { attrs: { class: `e-response e-response-block-item-${blocksLength}` } });
        }
        if (!this.enableStreaming || isFinalUpdate) {
            const htmlResponse: string | Promise<string> = MarkdownConverter.toHtml(response);
            responseWrapper.innerHTML = htmlResponse as string;
        } else {
            responseWrapper.innerHTML = response;
        }
        if (isFinalUpdate) { this.renderPreTag(responseWrapper); }
        if (existingResponseWrapper) {
            outputContentBodyEle.append(responseWrapper);
        }
    }

    private renderPreTag (outputContentEle: HTMLElement): void {
        const preTags: HTMLPreElement[] = Array.from(outputContentEle.querySelectorAll('pre'));
        preTags.forEach((preTag: HTMLPreElement) => {
            const copyIcon: HTMLSpanElement = document.createElement('span');
            copyIcon.className = 'e-icons e-code-copy e-assist-copy';
            preTag.insertBefore(copyIcon, preTag.firstChild);
            this.preTagElements.push({ preTag, handler: this.getCopyHandler(preTag) });
            EventHandler.add(copyIcon, 'click', this.preTagElements[this.preTagElements.length - 1].handler);
        });
    }

    private getCopyHandler (preTag: HTMLPreElement): Function {
        return function(): void {
            const preText: string = preTag.innerText;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((window as any).navigator.clipboard && typeof (window as any).navigator.clipboard.writeText === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).navigator.clipboard.writeText(preText);
            }
            const copyIcon: HTMLSpanElement = preTag.querySelector('.e-code-copy');
            copyIcon.className = 'e-icons e-code-copy e-assist-check';
            setTimeout(() => {
                copyIcon.className = 'e-icons e-code-copy e-assist-copy';
            }, 1000);
        };
    }

    private renderOutputToolbarItems(index?: number, isFinalUpdate?: boolean): void {
        this.contentFooterEle = this.createElement('div', {
            className: 'e-content-footer e-assist-toolbar-active'
        });
        if (this.aiAssistViewRendered) {
            if (this.outputElement.querySelector('.e-skeleton')) { this.outputElement.removeChild(this.skeletonContainer); }
            if (isFinalUpdate && this.suggestionsElement) { this.suggestionsElement.hidden = false; }
        }
        const navigationUI: HTMLElement = this.renderResponseNavigation(index);
        if (navigationUI) {
            this.contentFooterEle.appendChild(navigationUI);
        }
        this.renderResponseToolbar(index);
        const toolbarContainer: HTMLElement = this.createElement('div', {
            attrs: { class: 'e-response-toolbar-wrapper' }
        });
        this.responseToolbarEle.appendTo(toolbarContainer);
        this.responseToolbarEle.element.setAttribute('aria-label', `response-toolbar-${index}`);
        this.contentFooterEle.appendChild(toolbarContainer);
    }

    private renderResponseNavigation(promptIndex: number): HTMLElement {
        const regeneratedResponses: string[] = this.regeneratedResponses.get(promptIndex);
        if (!regeneratedResponses || regeneratedResponses.length <= 1) {
            return this.createElement('div', {});
        }
        const navigationContainer: HTMLElement = this.createElement('div', {
            attrs: { class: 'e-response-navigation-container' }
        });
        const currentIndex: number = this.currentRegeneratedIndex.get(promptIndex) || 0;
        const totalCount: number = regeneratedResponses.length;
        const prevButtonAttrs: { [key: string]: string } = {
            class: 'e-btn e-icons e-assist-previous',
            'aria-label': this.l10n.getConstant('previousResponse'),
            title: this.l10n.getConstant('previousResponse')
        };
        if (currentIndex === 0) {
            prevButtonAttrs['class'] += ' e-disabled';
        }
        const prevButton: HTMLElement = this.createElement('button', { attrs: prevButtonAttrs });
        const indexIndicator: HTMLElement = this.createElement('span', {
            attrs: { class: 'e-response-index-indicator' },
            innerHTML: `${currentIndex + 1} / ${totalCount}`
        });
        const nextButtonAttrs: { [key: string]: string } = {
            class: 'e-btn e-icons e-assist-next',
            'aria-label': this.l10n.getConstant('nextResponse'),
            title: this.l10n.getConstant('nextResponse')
        };
        if (currentIndex === totalCount - 1) {
            nextButtonAttrs['class'] += ' e-disabled';
        }
        const nextButton: HTMLElement = this.createElement('button', { attrs: nextButtonAttrs });
        if (prevButton.classList.contains('e-disabled')) { prevButton.tabIndex = -1; } else { prevButton.tabIndex = 0; }
        if (nextButton.classList.contains('e-disabled')) { nextButton.tabIndex = -1; } else { nextButton.tabIndex = 0; }
        navigationContainer.appendChild(prevButton);
        navigationContainer.appendChild(indexIndicator);
        navigationContainer.appendChild(nextButton);
        EventHandler.add(prevButton, 'click', () => {
            if (prevButton.classList.contains('e-disabled')) { return; }
            this.navigateRegeneratedResponse(promptIndex, -1);
        });
        EventHandler.add(nextButton, 'click', () => {
            if (nextButton.classList.contains('e-disabled')) { return; }
            this.navigateRegeneratedResponse(promptIndex, 1);
        });
        return navigationContainer;
    }

    private navigateRegeneratedResponse(promptIndex: number, direction: number): void {
        const regeneratedResponses: string[] = this.regeneratedResponses.get(promptIndex);
        const regeneratedBlocksArr: ResponseBlock[][] = this.regeneratedBlocks.get(promptIndex);
        const currentIndex: number = this.currentRegeneratedIndex.get(promptIndex) || 0;
        const newIndex: number = currentIndex + direction;
        if (newIndex < 0 || newIndex >= regeneratedResponses.length) {
            return;
        }
        this.currentRegeneratedIndex.set(promptIndex, newIndex);
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        // eslint-disable-next-line security/detect-object-injection
        this.prompts[promptIndex].response = regeneratedResponses[newIndex];
        const blocksAtIndex: ResponseBlock[] = regeneratedBlocksArr && newIndex < regeneratedBlocksArr.length
            ? regeneratedBlocksArr[newIndex as number] : [];
        this.prompts[promptIndex as number].blocks = blocksAtIndex;
        this.isProtectedOnChange = prevOnChange;
        const responseContainer: HTMLElement = this.element.querySelector(`#e-response-item_${promptIndex}`) as HTMLElement;
        if (responseContainer) {
            if (this.responseItemTemplate) {
                // For custom template: preserve footer during navigation
                const outputEle: HTMLDivElement = responseContainer.querySelector('.e-output') as HTMLDivElement;
                const footer: HTMLElement = responseContainer.querySelector('.e-content-footer') as HTMLDivElement;
                if (outputEle && footer) {
                    const childrenToRemove: Element[] = Array.from(outputEle.children).filter((child: Element) => child !== footer);
                    childrenToRemove.forEach((child: Element) => {
                        outputEle.removeChild(child);
                    });
                    this.getContextObject('responseItemTemplate', outputEle, promptIndex);
                    outputEle.appendChild(footer);
                }
            } else {
                const contentBody: HTMLElement = responseContainer.querySelector('.e-content-body') as HTMLElement;
                if (contentBody) {
                    contentBody.innerHTML = '';
                    this.lastRenderedBlockCount = 0;
                    this.blockIndex = 0;
                    if (blocksAtIndex && blocksAtIndex.length > 0) {
                        this.renderResponseSegments(contentBody, blocksAtIndex, true);
                    }

                    const responseText: string = regeneratedResponses[newIndex as number];
                    if (!isNOU(responseText) && responseText !== '') {
                        this.updateDynamicResponse(contentBody, true, responseText, blocksAtIndex ? blocksAtIndex.length : 0);
                    }

                    if ((!blocksAtIndex || blocksAtIndex.length === 0) && (isNOU(responseText) || responseText === '')) {
                        const newResponse: string | Promise<string> = MarkdownConverter.toHtml(regeneratedResponses[newIndex as number]);
                        contentBody.innerHTML = newResponse as string;
                        this.renderPreTag(contentBody);
                    }
                }
            }
            const existingNav: HTMLElement = responseContainer.querySelector('.e-response-navigation-container') as HTMLElement;
            if (existingNav) {
                this.updateNavigationUI(promptIndex, existingNav);
            }
        }
    }

    private updateNavigationUI(promptIndex: number, existingNav: HTMLElement): void {
        const regeneratedResponses: string[] = this.regeneratedResponses.get(promptIndex);
        const currentIndex: number = this.currentRegeneratedIndex.get(promptIndex) || 0;
        const totalCount: number = regeneratedResponses.length;
        const prevButton: HTMLElement = existingNav.querySelector('.e-assist-previous') as HTMLElement;
        const nextButton: HTMLElement = existingNav.querySelector('.e-assist-next') as HTMLElement;
        const indexIndicator: HTMLElement = existingNav.querySelector('.e-response-index-indicator') as HTMLElement;
        if (prevButton) {
            if (currentIndex === 0) {
                addClass([prevButton], 'e-disabled');
                prevButton.tabIndex = -1;
            } else {
                removeClass([prevButton], 'e-disabled');
                prevButton.tabIndex = 0;
            }
        }
        if (nextButton) {
            if (currentIndex === totalCount - 1) {
                addClass([nextButton], 'e-disabled');
                nextButton.tabIndex = -1;
            } else {
                removeClass([nextButton], 'e-disabled');
                nextButton.tabIndex = 0;
            }
        }
        if (indexIndicator) {
            indexIndicator.innerHTML = `${currentIndex + 1} / ${totalCount}`;
        }
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
                width: this.responseToolbarSettings.width,
                tabIndex: item.tabIndex
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

    private extractResponseText(output: any): string {
        if (typeof output === 'string') {
            return output;
        }
        if (typeof output === 'object') {
            return output.response;
        }
        return '';
    }

    private handleRegenerateClick(promptIndex: number): void {
        // eslint-disable-next-line security/detect-object-injection
        const currentResponse: string = this.prompts[promptIndex].response;
        // eslint-disable-next-line security/detect-object-injection
        const currentBlocks: ResponseBlock[] = this.prompts[promptIndex].blocks;
        if (!this.regeneratedResponses.has(promptIndex)) {
            this.regeneratedResponses.set(promptIndex, [currentResponse]);
            this.regeneratedBlocks.set(promptIndex, [currentBlocks || []]);
            this.currentRegeneratedIndex.set(promptIndex, 0);
        }
        this.isRegenerating = true;
        this.regeneratingPromptIndex = promptIndex;
        this.isResponseRequested = true;
        this.isOutputRenderingStop = false;
        this.toggleStopRespondingButton(true);
        this.resetResponse(promptIndex);
        // eslint-disable-next-line security/detect-object-injection
        const promptText: string = this.prompts[promptIndex].prompt;
        const eventArgs: PromptRequestEventArgs = {
            cancel: false,
            prompt: promptText,
            // eslint-disable-next-line security/detect-object-injection
            attachedFiles: this.prompts[promptIndex].attachedFiles || [],
            mentions: this.prompts[parseInt(promptIndex.toString(), 10)].mentions || []
        };
        this.trigger('promptRequest', eventArgs);
    }

    private resetResponse(promptIndex: number): void {
        const responseContainer: HTMLElement = this.element.querySelector(`#e-response-item_${promptIndex}`) as HTMLElement;
        let loadingIndicatorElement: HTMLElement;
        if (this.responseAnimationTemplate) {
            loadingIndicatorElement = this.skeletonContainer;
        } else {
            loadingIndicatorElement  = this.skeletonContainer.querySelector('.e-loading-body') as HTMLElement;
        }
        if (this.responseItemTemplate) {
            const outputEle: HTMLElement = responseContainer.querySelector('.e-output') as HTMLElement;
            const footer: HTMLElement = outputEle.querySelector('.e-content-footer') as HTMLElement;
            const childrenToRemove: Element[] = Array.from(outputEle.children).filter((child: Element) => child !== footer);
            childrenToRemove.forEach((child: Element) => {
                outputEle.removeChild(child);
            });
            outputEle.insertBefore(loadingIndicatorElement, footer);
            this.hideResponseToolbar(responseContainer);
        } else {
            const contentBody: HTMLElement = responseContainer.querySelector('.e-content-body') as HTMLElement;
            contentBody.innerHTML = '';
            contentBody.appendChild(loadingIndicatorElement);
            this.hideResponseToolbar(responseContainer);
        }
        this.renderSkeleton();
    }

    private hideResponseToolbar(responseContainer: HTMLElement): void {
        const navigationContainer: HTMLElement = responseContainer.querySelector('.e-response-navigation-container') as HTMLElement;
        if (navigationContainer) {
            navigationContainer.classList.add('e-response-hidden');
        }
        const toolbarWrapper: HTMLElement = responseContainer.querySelector('.e-response-toolbar-wrapper') as HTMLElement;
        if (toolbarWrapper) {
            toolbarWrapper.classList.add('e-response-hidden');
        }
    }

    private handleItemClick(args: ClickEventArgs, index: number): void {
        if (args.item.prefixIcon === 'e-icons e-assist-copy') {
            const currentPrompt: PromptModel = this.prompts[parseInt(index.toString(), 10)];
            let contentToCopy: string = currentPrompt.response;
            if (!contentToCopy && currentPrompt.blocks && currentPrompt.blocks.length > 0) {
                const blocks: ResponseBlock[] = currentPrompt.blocks;
                for (let i: number = blocks.length - 1; i >= 0; i--) {
                    if (blocks[parseInt(i.toString(), 10)].blockType === 'text') {
                        contentToCopy = (blocks[parseInt(i.toString(), 10)] as TextBlock).content;
                        break;
                    }
                }
            }
            this.getClipBoardContent(SanitizeHtmlHelper.sanitize(contentToCopy));
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
            const likeIndex: number = controlParentItems.findIndex((it: ItemModel) =>
                it.prefixIcon === 'e-icons e-assist-like' || it.prefixIcon === 'e-icons e-assist-like-filled'
            );
            const dislikeIndex: number = controlParentItems.findIndex((it: ItemModel) =>
                it.prefixIcon === 'e-icons e-assist-dislike' || it.prefixIcon === 'e-icons e-assist-dislike-filled'
            );
            if (isLikeInteracted) {
                if (promptItem.isResponseHelpful === true) {
                    args.item.prefixIcon = 'e-icons e-assist-like-filled';
                    if (controlParentItems && controlParentItems.length > 2) {
                        controlParentItems[parseInt(dislikeIndex.toString(), 10)].prefixIcon = 'e-icons e-assist-dislike';
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
                        controlParentItems[parseInt(likeIndex.toString(), 10)].prefixIcon = 'e-icons e-assist-like';
                    }
                }
                else {
                    args.item.prefixIcon = 'e-icons e-assist-dislike';
                }
            }
            this.responseToolbarEle.dataBind();
            this.isProtectedOnChange = prevOnChange;
        }
        // Built-in Text-to-Speech
        if (args.item.prefixIcon === 'e-icons e-assist-audio' ||
            args.item.prefixIcon === 'e-icons e-assist-stop') {
            if (this.currentUtterance) {
                speechSynthesis.cancel();
                this.currentUtterance = null;
                args.item.prefixIcon = 'e-icons e-assist-audio';
                args.item.tooltipText = this.l10n.getConstant('readAloud');
            } else {
                const contentBody: HTMLElement | null = this.element.querySelector(`#e-response-item_${index} .e-content-body`) as HTMLElement | null;
                const cleanText: string = (contentBody && contentBody.innerText) ? contentBody.innerText.trim() : '';
                this.speakText(cleanText, args.item);
            }
            this.responseToolbarEle.dataBind();
        }

        // Built-in Regenerate Support
        if (args.item.prefixIcon === 'e-icons e-assist-regenerate') {
            this.handleRegenerateClick(index);
        }

    }

    private speakText(cleanText: string, item: ItemModel): void {
        if (!cleanText) { return; }
        const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = this.textToSpeechSettings.language;
        utterance.pitch = this.textToSpeechSettings.speechPitch;
        utterance.rate = this.textToSpeechSettings.speechRate;
        utterance.volume = this.textToSpeechSettings.volume;
        if (this.textToSpeechSettings.voice) {
            utterance.voice = this.textToSpeechSettings.voice;
        }
        utterance.onend = () => {
            this.currentUtterance = null;
            item.prefixIcon = 'e-icons e-assist-audio';
            item.tooltipText = this.l10n.getConstant('readAloud');
            if (this.responseToolbarEle) { this.responseToolbarEle.dataBind(); }
        };
        speechSynthesis.speak(utterance);
        this.currentUtterance = utterance;
        item.prefixIcon = 'e-icons e-assist-stop';
        item.tooltipText = this.l10n.getConstant('stopAudio');
    }

    private renderPrompt(promptText?: string, promptIndex?: number, attachedFiles?: FileInfo[]): void {
        const outputPrompt: HTMLElement = this.createElement('div', { attrs: { class: 'e-prompt-text', tabindex: '0' } });
        const promptFiles: HTMLElement = this.createElement('div', { attrs: { class: 'e-prompt-uploaded-files' } });
        const promptContent: HTMLElement = this.createElement('div', { className: 'e-prompt-content' });
        const promptDetails: HTMLElement = this.createElement('div', { className: 'e-prompt-details' });
        const promptToolbarContainer: HTMLElement = this.createElement('div', { className: 'e-prompt-toolbar' });
        const promptToolbar: HTMLElement = this.createElement('div');
        const userIcon: HTMLElement = this.createElement('span', { className: this.promptIconCss ? 'e-prompt-icon e-icons '
        + this.promptIconCss : '' });
        if (this.promptItemTemplate) {
            this.getContextObject('promptItemTemplate', this.outputSuggestionEle, promptIndex);
        }
        else {
            // Use getPromptText to render mention chips if mentions are available
            outputPrompt.innerHTML = this.getPromptText(promptText, promptIndex);
            const uploadedFiles: FileInfo[] = attachedFiles || this.uploadedFiles;
            if (uploadedFiles.length > 0)
            {
                uploadedFiles.forEach((file: FileInfo) => {
                    promptFiles.appendChild(this.createFileItem(file, false));
                });
                promptDetails.appendChild(promptFiles);
            }
            if (promptText.length > 0) {
                promptDetails.appendChild(outputPrompt);
            }
            promptContent.appendChild(promptDetails);
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
                width: this.promptToolbarSettings.width,
                tabIndex: item.tabIndex
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
                        this.onEditIconClick(promptIndex as number, args.originalEvent);
                    }
                    if (args.item.prefixIcon === 'e-icons e-assist-copy') {
                        this.getClipBoardContent(this.getPromptText(this.prompts[parseInt(promptIndex.toString(), 10)].prompt,
                                                                    promptIndex, true));
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
        this.skeletonContainer = this.createElement('div', { className: 'e-output-container' });
        if (this.responseAnimationTemplate) {
            this.skeletonContainer.classList.add('e-response-animation-template');
            this.updateContent(this.responseAnimationTemplate, this.skeletonContainer, {}, 'responseAnimationTemplate');
        } else {
            const outputViewWrapper: HTMLElement = this.createElement('div', {  className: 'e-output', styles : 'width: 70%;'});
            const skeletonIconEle: HTMLElement = this.createElement('span', { className: 'e-output-icon e-skeleton e-skeleton-text e-shimmer-wave' });
            const skeletonBodyEle: HTMLElement = this.createElement('div', { className: 'e-loading-body' });
            const skeletonFooterEle: HTMLElement = this.createElement('div', { className: 'e-loading-footer' });
            const [skeletonLine1, skeletonLine2, skeletonLine3] = [
                this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave' , styles: 'width: 100%; height: 15px;' }),
                this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave' , styles: 'width: 75%; height: 15px;' }),
                this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave' , styles: 'width: 50%; height: 15px;' })
            ];
            const [footerSkeleton] = [
                this.createElement('div', { className: 'e-skeleton e-skeleton-text e-shimmer-wave', styles: 'width: 100%; height: 30px;' })
            ];
            this.appendChildren(skeletonBodyEle, skeletonLine1, skeletonLine2, skeletonLine3);
            skeletonFooterEle.append(footerSkeleton);
            this.appendChildren(outputViewWrapper, skeletonBodyEle, skeletonFooterEle);
            this.appendChildren(this.skeletonContainer, skeletonIconEle, outputViewWrapper);
        }
    }

    private onEditIconClick(promptIndex: number, event?: Event): void {
        if (this.editableTextarea) {
            if (this.suggestionsElement ) { this.suggestionsElement.hidden = true; }
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            const prevPrompt: string = this.prompt;
            this.editableTextarea.innerHTML = this.prompt =
this.getPromptText(this.prompts[parseInt(promptIndex.toString(), 10)].prompt, promptIndex);
            this.isProtectedOnChange = prevOnChange;
            // Restore selectedMentions array from stored prompt data
            this.restoreMentionsFromPrompt(promptIndex);
            this.refreshTextareaUI();
            this.editableTextarea.focus();
            this.setFocusAtEnd(this.editableTextarea);
            this.pushToUndoStack(this.prompt);
            this.redoStack = [];
            this.triggerPromptChanged(event as Event, prevPrompt);
        }
    }
    private refreshTextareaUI(): void {
        this.updateHiddenTextarea(this.prompt);
        this.checkAndActivateSendIcon();
        this.updateFooterElementClass();
        this.updateFooterType(this.footerToolbarSettings.toolbarPosition);
        this.toggleClearIcon();
    }

    private checkAndActivateSendIcon(): void {
        if (!this.footerToolbarEle) { return; }
        const length: number = this.prompt.length > 0 ? this.prompt.length : this.uploadedFiles.length;
        if (this.sendToolbarItem.prefixIcon === 'e-icons e-assist-send') {
            const sendItem: HTMLElement = this.footerToolbarEle.element.querySelector('.e-assist-send') as HTMLElement;
            if (sendItem) {
                if (length > 0) {
                    removeClass([sendItem], 'disabled');
                    sendItem.setAttribute('title', this.l10n.getConstant('send'));
                } else {
                    addClass([sendItem], 'disabled');
                }
            }
        }
    }

    private toggleClearIcon(): void {
        if (this.clearToolbarItem && this.footerToolbarEle) {
            const isFocused: boolean = document.activeElement === this.editableTextarea;
            const hasContent: boolean = this.editableTextarea.textContent.length > 0;
            const clearItemElement: HTMLElement = this.footerToolbarEle.element.querySelector('.e-toolbar-item .e-icons.e-assist-clear-icon')
                .closest('.e-toolbar-item') as HTMLElement;
            if (clearItemElement) {
                if (isFocused && hasContent) {
                    this.footerToolbarEle.hideItem(clearItemElement, false);
                } else {
                    this.footerToolbarEle.hideItem(clearItemElement, true);
                }
            }
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

    private updateToolbarSettings(previousToolbar: ToolbarSettingsModel): void {
        const previousToolbarIndex: number = 0;
        for (let index: number = this.views.length; index < this.toolbarItems.length; index++) {
            if (previousToolbar.items[parseInt(previousToolbarIndex.toString(), 10)] === this.toolbarItems[parseInt(index.toString(), 10)])
            {
                this.toolbarItems.splice(index, 1);
            }
        }
        this.updateHeaderToolbar();
        this.toolbar.items = this.toolbarItems;
    }

    private updateAttachmentToolbarItemInSettings(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;

        const items: ToolbarItemModel[] = this.footerToolbarSettings.items;
        const attachmentItemIndex: number = items.findIndex((item: ToolbarItemModel) => item.iconCss === 'e-icons e-assist-attachment-icon');

        if (this.enableAttachments && attachmentItemIndex === -1) {
            const attachmentItem: ToolbarItemModel = {
                iconCss: 'e-icons e-assist-attachment-icon',
                tooltip: this.l10n.getConstant('attachments'),
                align: 'Right'
            };
            const sendItemIndex: number = items.findIndex((item: ToolbarItemModel) => item.iconCss === 'e-icons e-assist-send');
            items.splice(sendItemIndex !== -1 ? sendItemIndex : items.length, 0, attachmentItem);

        } else if (!this.enableAttachments && attachmentItemIndex !== -1) {
            items.splice(attachmentItemIndex, 1);
        }

        this.isProtectedOnChange = prevOnChange;
    }

    private updateClearToolbarItemInSettings(): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;

        const items: ToolbarItemModel[] = this.footerToolbarSettings.items;
        const clearItemIndex: number = items.findIndex((item: ToolbarItemModel) => item.iconCss === 'e-icons e-assist-clear-icon');

        if (this.showClearButton && clearItemIndex === -1) {
            const clearItem: ToolbarItemModel = {
                iconCss: 'e-icons e-assist-clear-icon',
                tooltip: this.l10n.getConstant('clear'),
                align: 'Right'
            };
            const sendItemIndex: number = items.findIndex((item: ToolbarItemModel) => item.iconCss === 'e-icons e-assist-send');
            items.splice(sendItemIndex !== -1 ? sendItemIndex : items.length, 0, clearItem);
        } else if (!this.showClearButton && clearItemIndex !== -1) {
            items.splice(clearItemIndex, 1);
        }

        this.isProtectedOnChange = prevOnChange;
    }

    private updateFooterToolbar(): void {
        const footerIconsWrapper: HTMLElement = this.footer.querySelector('.e-footer-icons-wrapper') as HTMLElement;
        if (footerIconsWrapper) {
            const leftItems: HTMLElement = this.footer.querySelector('.e-footer-left-items') as HTMLElement;
            if (leftItems) {
                this.destroyAndNullify(this.footerLeftToolbarEle);
                remove(leftItems);
            }
            footerIconsWrapper.innerHTML = '';
            this.footerToolbarEle = null;
            this.sendToolbarItem = null;
            this.clearToolbarItem = null;
            this.attachmentToolbarItem = null;
            this.renderFooterToolbar(footerIconsWrapper);
            this.refreshTextareaUI();
        }
    }

    private updateResponse(response: string, index: number, isFinalUpdate: boolean, responseItem: HTMLDivElement | null,
                           block?: TextBlock, blocksLength?: number): void {
        if (!this.responseItemTemplate && responseItem) {
            const outputEle: HTMLDivElement | null = responseItem.querySelector('.e-output');
            const outputContentBodyEle: HTMLDivElement = responseItem.querySelector('.e-content-body');
            if (response && !this.isToolResponse) {
                if (outputContentBodyEle) {
                    //outputContentBodyEle.innerHTML = response;
                    this.updateDynamicResponse(outputContentBodyEle, isFinalUpdate, response, blocksLength);
                }
            } else if (this.isToolResponse) {
                const textContainers: NodeListOf<HTMLElement> = outputContentBodyEle.querySelectorAll('.e-text');
                const textContainer: HTMLElement = textContainers[textContainers.length - 1] as HTMLElement;
                if (textContainer) {
                    textContainer.innerHTML = block.content;
                }
            }
            if (isFinalUpdate && this.suggestionsElement) {
                this.suggestionsElement.hidden = false;
            }
            if (isFinalUpdate) { this.renderPreTag(outputContentBodyEle); }
            if (isFinalUpdate && outputEle.querySelector('.e-content-footer') === null){
                this.renderOutputToolbarItems(index, isFinalUpdate);
                this.appendChildren(outputEle, this.contentFooterEle);
            }
        }
        else if (this.responseItemTemplate && responseItem) {
            // Template is configured AND container exists: update it instead of creating duplicate
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            // Update the prompt model with accumulated response
            if (index < this.prompts.length) {
                this.prompts[parseInt(index.toString(), 10)].response = response;
            }
            this.isProtectedOnChange = prevOnChange;
            // Re-render template with updated data
            const outputEle: HTMLDivElement | null = responseItem.querySelector('.e-output');
            if (outputEle) {
                outputEle.innerHTML = '';
                this.getContextObject('responseItemTemplate', outputEle, index);
                // Remove skeleton if present
                if (this.hasSkeletonEle() || this.outputElement.querySelector('.e-skeleton')) {
                    this.outputElement.removeChild(this.skeletonContainer);
                }
                // Handle final update: toolbar and suggestions
                if (isFinalUpdate) {
                    if (this.suggestionsElement) {
                        this.suggestionsElement.hidden = false;
                    }
                    if (this.contentFooterEle) {
                        this.contentFooterEle.classList.remove('e-assist-toolbar-active');
                    }
                    if (this.hasStopResponseButton()) {
                        this.toggleStopRespondingButton(false);
                    }
                    this.renderOutputToolbarItems(index, isFinalUpdate);
                    this.appendChildren(outputEle, this.contentFooterEle);
                }
            }
        }
        else {
            // Template is configured BUT container doesn't exist yet: create it
            this.renderOutputContainer(undefined, response, undefined, index, false, isFinalUpdate);
        }
    }

    private streamText( text: string, onUpdate: (accumulated: string, isComplete: boolean) => void, onComplete?: () => void ): void {
        if (!text || !text.trim()) {
            if (onComplete) { onComplete(); }
            return;
        }
        let i: number = 0;
        const words: string[] = text.split(' ');
        let lastResponse: string = '';
        const streamingText: () => void = (): void => {
            if (this.isOutputRenderingStop || !this.contentWrapper) {
                if (onComplete) { onComplete(); }
                return;
            }
            if (i < words.length) {
                lastResponse += (i === 0 ? '' : ' ') + words[i++];
                onUpdate(lastResponse, false);
                if (!this.isRegenerating) {
                    this.scrollToBottom();
                }
                setTimeout(streamingText, 15);
            } else {
                onUpdate(lastResponse, true);
                if (onComplete) { onComplete(); }
            }
        };
        streamingText();
    }

    private resetRegeneratingState(): void {
        this.isRegenerating = false;
        this.regeneratingPromptIndex = -1;
    }

    private streamResponse(response: string, index: number, blocksLength: number): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.streamText( response, (lastResponse: string, isComplete: boolean) => {
            if (index >= this.prompts.length) {
                this.isResponseRequested = false;
                return;
            }
            const responseItem: HTMLDivElement = this.element.querySelector(`#e-response-item_${index}`);
            if (this.isRegenerating) {
                if (responseItem) {
                    const contentBody: HTMLElement = responseItem.querySelector('.e-content-body') as HTMLElement;
                    if (contentBody && contentBody.firstChild && contentBody.children.length === 1
                        && (contentBody.querySelector('.e-skeleton') || contentBody.querySelector('.e-output-container .e-response-animation-template'))) {
                        contentBody.removeChild(contentBody.firstChild);
                    }
                }
            } else if (this.hasSkeletonEle() || this.outputElement.querySelector('.e-skeleton')) {
                this.outputElement.removeChild(this.skeletonContainer);
            }
            this.updateResponse(lastResponse, index, isComplete, responseItem, null, blocksLength);
            this.setupViewportFilling();
            if (isComplete) {
                if (this.hasStopResponseButton()) {
                    this.toggleStopRespondingButton(false);
                }
                this.isResponseRequested = false;
                if (this.isRegenerating) {
                    this.resetRegeneratingState();
                }
            }
        });
        this.isProtectedOnChange = prevOnChange;
    }

    private streamToolResponse(response: string, element: HTMLElement, streamingCompleted: () => void): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.streamText( response, (lastResponse: string) => {
            element.innerHTML = lastResponse;
        }, streamingCompleted );
        this.isProtectedOnChange = prevOnChange;
    }

    private updateBannerTemplate(newTemplate: string | Function): void {
        if (!isNOU(newTemplate)) {
            const contentContainer: HTMLElement = this.element.querySelector('.e-view-container');
            const existingTemplate: HTMLElement = contentContainer.querySelector('.e-banner-view');
            if (existingTemplate) {
                existingTemplate.remove();
            }
            this.updateBannerView(contentContainer);
        }
    }

    private updateResponseAnimationTemplate(newTemplate: string | Function): void {
        const prevSkeleton: HTMLElement = this.skeletonContainer;
        this.renderSkeleton();
        if (prevSkeleton && prevSkeleton.parentElement) {
            prevSkeleton.parentElement.replaceChild(this.skeletonContainer, prevSkeleton);
        }
    }

    private updatePromptSuggestionTemplate(): void {
        if (this.suggestionsElement) { this.suggestionsElement.remove(); }
        if (!this.isOutputRenderingStop) {
            this.renderSuggestions(this.promptSuggestions, this.promptSuggestionsHeader, this.promptSuggestionItemTemplate,
                                   'promptSuggestion', 'promptSuggestionItemTemplate', this.onSuggestionClick);
        }
    }

    private updateFooterTemplate(): void {
        this.footer.innerHTML = '';
        this.updateFooterClass(this.footerTemplate);
        this.unWireFooterEvents(this.footerTemplate);
        this.renderAssistViewFooter();
        if (!this.footerTemplate) {
            this.wireFooterEvents(this.footerTemplate);
        }
    }

    private updateAttachmentSettings(newAttachment: AttachmentSettingsModel): void {
        if (!isNOU(newAttachment.allowedFileTypes)) {
            this.uploaderObj.allowedExtensions = newAttachment.allowedFileTypes;
        }
        if (!isNOU(newAttachment.maxFileSize)) {
            this.uploaderObj.maxFileSize = newAttachment.maxFileSize;
        }
        this.uploaderObj.asyncSettings = {
            saveUrl: !isNOU(newAttachment.saveUrl) ?  newAttachment.saveUrl : this.uploaderObj.asyncSettings.saveUrl,
            removeUrl: !isNOU(newAttachment.removeUrl) ?  newAttachment.removeUrl : this.uploaderObj.asyncSettings.removeUrl
        };
    }

    private handleSTTDynamicChange(newProp: SpeechToTextSettingsModel, oldProp: SpeechToTextSettingsModel): void {
        if (oldProp.enable !== newProp.enable) {
            this.updateFooterToolbar();
            this.updateSpeechToTextSettings(newProp);
        }
        if (isNOU(this.speechToTextObj)) { return; }
        if (oldProp.allowInterimResults !== newProp.allowInterimResults) {
            this.speechToTextObj.allowInterimResults = newProp.allowInterimResults;
        }
        if (oldProp.buttonSettings !== newProp.buttonSettings) {
            this.speechToTextObj.buttonSettings = newProp.buttonSettings;
        }
        if (oldProp.tooltipSettings !== newProp.tooltipSettings) {
            this.speechToTextObj.tooltipSettings = newProp.tooltipSettings;
        }
        if (oldProp.showTooltip !== newProp.showTooltip) {
            this.speechToTextObj.showTooltip = newProp.showTooltip;
        }
        if (oldProp.cssClass !== newProp.cssClass) {
            this.speechToTextObj.cssClass = newProp.cssClass;
        }
        if (oldProp.disabled !== newProp.disabled) {
            this.speechToTextObj.disabled = newProp.disabled;
        }
        if (oldProp.lang !== newProp.lang) {
            this.speechToTextObj.lang = newProp.lang;
        }
        if (oldProp.listeningState !== newProp.listeningState) {
            this.speechToTextObj.listeningState = newProp.listeningState;
        }
        this.speechToTextObj.dataBind();
    }

    private updateSpeechToTextSettings(newProps: SpeechToTextSettingsModel): void {
        this.renderSpeechToText();
        if (this.speechToTextObj == null) { return; }
        this.speechToTextObj.allowInterimResults = newProps.allowInterimResults;
        this.speechToTextObj.transcript = newProps.transcript;
        this.speechToTextObj.lang = newProps.lang || 'en-US';
        this.speechToTextObj.disabled = newProps.disabled;
        this.speechToTextObj.buttonSettings = newProps.buttonSettings;
        this.speechToTextObj.showTooltip = newProps.showTooltip;
        this.speechToTextObj.tooltipSettings = newProps.tooltipSettings;
        this.speechToTextObj.cssClass = newProps.cssClass;
    }

    private updateLocale(): void {
        // Update file upload failure locale
        this.l10n.setLocale(this.locale);
        const failureElement: HTMLElement = this.viewWrapper.querySelector('.e-upload-failure-alert') as HTMLElement;
        if (failureElement) {
            const failureMessageEle: HTMLElement = failureElement.querySelector('.e-failure-message') as HTMLElement;
            if (failureMessageEle.classList.contains('e-size-failure')) {
                failureMessageEle.textContent = this.l10n.getConstant('fileSizeFailure');
            }
            else {
                let failureText: string = this.l10n.getConstant('fileCountFailure');
                failureText = failureText.replace('{0}', this.attachmentSettings.maximumCount.toString());
                if (this.attachmentSettings.maximumCount === 1) {
                    failureText = failureText.replace('files', 'file');
                }
                failureMessageEle.textContent = failureText;
            }
        }

        // Update mention popups with localized noRecordsTemplate
        if (this.mentionModels && this.mentionModels.length > 0) {
            for (const mention of this.mentionModels) {
                if (mention) {
                    mention.noRecordsTemplate = this.l10n.getConstant('noRecordsTemplate');
                }
            }
        }
    }

    public destroy(): void {
        if (this.currentUtterance) {
            speechSynthesis.cancel();
            this.currentUtterance = null;
        }
        super.destroy();
        this.unWireEvents();
        this.destroyAndNullify(this.responseToolbarEle);
        this.destroyAndNullify(this.promptToolbarEle);
        this.destroyAndNullify(this.footerToolbarEle);
        this.destroyAndNullify(this.footerLeftToolbarEle);
        this.destroyAndNullify(this.downArrowIcon);
        this.destroyAndNullify(this.toolbar);
        this.destroyAndNullify(this.speechToTextObj);
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
        this.speechToTextToolbarItem = null;
        this.preTagElements = [];
        this.regeneratedResponses.clear();
        this.regeneratedBlocks.clear();
        this.currentRegeneratedIndex.clear();
        this.originalBlocks.clear();
        this.isRegenerating = false;
        this.regeneratingPromptIndex = -1;
        this.registeredTools.clear();
        this.mentionModels = [];
        this.selectedMentions = [];
        this.mentionCounter = 0;

        // properties nullify
        this.toolbarSettings = this.promptToolbarSettings = this.responseToolbarSettings = {};
        if (this.cssClass) { removeClass([this.element], this.cssClass.split(' ')); }
        this.element.classList.remove('e-rtl');
    }

    private destroyAssistView(): void {
        const properties: string [] = [
            'toolbarHeader',
            'sendIcon',
            'clearIcon',
            'suggestions',
            'skeletonContainer',
            'outputElement',
            'outputSuggestionEle',
            'contentFooterEle',
            'editableTextarea',
            'footer',
            'speechToTextToolbarItem',
            'assistCustomSection',
            'content',
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
     * Registers a custom tool UI for rendering AI-generated tool responses.
     * Use this method to define how specific tool blocks should be rendered in the AIAssistView.
     *
     * @param {ToolUIConfig} tool - Configuration object containing toolName, template, and optional handler callback
     * @returns {void}
     *
     */
    public registerToolUI(tool: ToolUIConfig): void {
        if (tool.toolName) {
            const name: string = tool.toolName.toLowerCase();
            this.registeredTools.set(name, { toolName: name, template: tool.template, handler: tool.handler });
        }
    }

    /**
     * Adds a response to the last prompt or appends a new prompt data in the AIAssistView component.
     *
     * @param {string | Object} outputResponse - The response to be added. Can be a string representing the response or an object containing both the prompt and the response.
     * - If `outputResponse` is a string, it updates the response for the last prompt in the prompts collection.
     * - If `outputResponse` is an object, it can either update the response of an existing prompt if the prompt matches or append a new prompt data.
     * @param {boolean} isFinalUpdate - Indicates whether this response is the final one, to hide the stop response button.
     * @returns {void}
     */
    public addPromptResponse(
        outputResponse: string | Object,
        isFinalUpdate: boolean = true
    ): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if (this.isRegenerating && this.regeneratingPromptIndex >= 0 && this.regeneratingPromptIndex < this.prompts.length) {
            const regenerateIndex: number = this.regeneratingPromptIndex;
            const responseText: string = this.extractResponseText(outputResponse);
            const blocks: ResponseBlock[] = typeof outputResponse === 'object' && outputResponse !== null && !isNOU((<{blocks: ResponseBlock[] }>outputResponse).blocks)
                ? ((<{blocks: ResponseBlock[] }>outputResponse).blocks as ResponseBlock[])
                : [];
            // eslint-disable-next-line security/detect-object-injection
            const responseHistory: string[] = this.regeneratedResponses.get(regenerateIndex) || [this.prompts[regenerateIndex].response];
            responseHistory.push(responseText);
            this.regeneratedResponses.set(regenerateIndex, responseHistory);
            // Store corresponding blocks
            const blocksHistory: ResponseBlock[][] = this.regeneratedBlocks.get(regenerateIndex) ||
                [this.prompts[regenerateIndex as number].blocks || []];
            blocksHistory.push(blocks);
            this.regeneratedBlocks.set(regenerateIndex, blocksHistory);
            this.currentRegeneratedIndex.set(regenerateIndex, responseHistory.length - 1);
            // eslint-disable-next-line security/detect-object-injection
            this.prompts[regenerateIndex].response = responseText;
            this.prompts[regenerateIndex as number].blocks = blocks;
            const responseContainer: HTMLElement = this.element.querySelector(`#e-response-item_${regenerateIndex}`) as HTMLElement;
            if (responseContainer) {
                if (this.responseItemTemplate) {
                    this.updateResponse(responseText, regenerateIndex, isFinalUpdate, responseContainer as HTMLDivElement);
                } else {
                    const contentBody: HTMLElement = responseContainer.querySelector('.e-content-body') as HTMLElement;
                    if (contentBody) {
                        if (this.enableStreaming) {
                            const blocksLength: number =
                                typeof outputResponse === 'object' && outputResponse !== null && !isNOU((<{blocks: ResponseBlock[] }>outputResponse).blocks)
                                    ? ((<{blocks: ResponseBlock[] }>outputResponse).blocks as ResponseBlock[]).length
                                    : 0;
                            this.streamResponse(responseText, regenerateIndex, blocksLength);
                        } else {
                            const htmlResponse: string | Promise<string> = MarkdownConverter.toHtml(responseText);
                            contentBody.innerHTML = htmlResponse as string;
                            this.renderPreTag(contentBody);
                        }
                        const navigationContainer: HTMLElement = responseContainer.querySelector('.e-response-navigation-container') as HTMLElement;
                        if (navigationContainer) {
                            navigationContainer.classList.remove('e-response-hidden');
                        }
                    }
                }
                const toolbarWrapper: HTMLElement = responseContainer.querySelector('.e-response-toolbar-wrapper') as HTMLElement;
                if (toolbarWrapper) {
                    toolbarWrapper.classList.remove('e-response-hidden');
                }
                const oldNav: HTMLElement = responseContainer.querySelector('.e-response-navigation-container') as HTMLElement;
                const footer: HTMLElement = responseContainer.querySelector('.e-content-footer') as HTMLElement;
                if (oldNav) {
                    this.updateNavigationUI(regenerateIndex, oldNav);
                } else if (responseHistory.length >= 2 && footer) {
                    const newNav: HTMLElement = this.renderResponseNavigation(regenerateIndex);
                    if (newNav && newNav.children.length > 0) {
                        footer.insertBefore(newNav, footer.firstChild);
                    }
                }
            }
            if (isFinalUpdate) {
                if (!this.enableStreaming) {
                    this.resetRegeneratingState();
                    if (this.hasStopResponseButton()) {
                        this.toggleStopRespondingButton(false);
                    }
                }
            }
            this.isResponseRequested = false;
            this.isProtectedOnChange = prevOnChange;
            if (this.enableScrollToBottom && this.downArrowIcon && this.outputContentBodyEle && this.contentWrapper) {
                this.downArrowIcon.visible = this.outputContentBodyEle.scrollHeight > this.contentWrapper.clientHeight;
            }
            return;
        }
        if (!this.isOutputRenderingStop) {
            const responseItem: HTMLDivElement = this.element.querySelector(`#e-response-item_${this.prompts.length - 1}`);
            let lastPrompt: PromptModel = this.prompts[this.prompts.length - 1];
            // If lastPrompt is undefined, initialize a new prompt entry
            if (!lastPrompt) {
                this.prompts = [...this.prompts, {
                    prompt: null,
                    response: null,
                    isResponseHelpful: null,
                    attachedFiles: null,
                    blocks: []
                }];
                lastPrompt = this.prompts[this.prompts.length - 1];
                this.lastRenderedBlockCount = 0;
            }

            const processResponse: (rawResponse: string, blocks?: ResponseBlock[]) => void = (rawResponse: string,
                                                                                              blocks?: ResponseBlock[]): void => {
                if (this.enableStreaming && !this.isToolResponse) {
                    if (this.prompts.length === 0) {
                        this.isResponseRequested = false;
                        return;
                    }
                    isFinalUpdate = false;
                    const htmlResponse: string | Promise<string> = MarkdownConverter.toHtml(rawResponse);
                    lastPrompt.response = htmlResponse as string;
                    this.streamResponse(lastPrompt.response, this.prompts.length - 1, isNOU(blocks) ? 0 : blocks.length);
                } else {
                    if (this.prompts.length === 0) {
                        this.isResponseRequested = false;
                        return;
                    }
                    lastPrompt.response =  rawResponse ? MarkdownConverter.toHtml(rawResponse) as string : rawResponse;
                    if (!this.isToolResponse) {
                        this.updateResponse(lastPrompt.response, this.prompts.length - 1, isFinalUpdate, responseItem,
                                            null, isNOU(blocks) ? 0 : blocks.length);
                    } else {
                        if (!blocks) {
                            return;
                        }
                        blocks.forEach((block: ResponseBlock) => {
                            if (block.blockType === 'text') {
                                this.updateResponse(lastPrompt.response, this.prompts.length - 1, isFinalUpdate, responseItem, block);
                            }
                        });
                        this.updateLastThinkingBlock(blocks);
                        if (rawResponse) {
                            this.isToolResponse = false;
                            if (this.enableStreaming) {
                                this.streamResponse(lastPrompt.response, this.prompts.length - 1, isNOU(blocks) ? 0 : blocks.length);
                            } else {
                                this.updateResponse(lastPrompt.response, this.prompts.length - 1, isFinalUpdate,
                                                    responseItem, null, isNOU(blocks) ? 0 : blocks.length);
                            }
                        }
                    }
                }
            };
            if (typeof outputResponse === 'string') {
                if (!this.isResponseRequested) {
                    this.prompts = [...this.prompts, { prompt: null, response: null, isResponseHelpful: null, attachedFiles: null,
                        blocks: [] }];
                    lastPrompt = this.prompts[this.prompts.length - 1];
                    this.lastRenderedBlockCount = 0;
                }
                this.isToolResponse = false;
                processResponse(outputResponse);
            }
            if (typeof outputResponse === 'object') {
                if (this.enableStreaming) {
                    isFinalUpdate = false;
                }
                const tPrompt: PromptModel = {
                    prompt: (<{ prompt: string }>outputResponse).prompt,
                    attachedFiles: (<{ attachedFiles: FileInfo[] }>outputResponse).attachedFiles,
                    response: (<{ response: string }>outputResponse).response,
                    isResponseHelpful: isNOU((<{ isResponseHelpful: boolean }>outputResponse).isResponseHelpful) ? null :
                        (<{ isResponseHelpful: boolean }>outputResponse).isResponseHelpful,
                    blocks: (<{blocks: ResponseBlock[] }>outputResponse).blocks
                };
                this.isToolResponse = tPrompt.blocks ?  tPrompt.blocks.length > 0 ? true : false : false;
                if (this.prompt === tPrompt.prompt || this.lastStreamPrompt === tPrompt.prompt) {
                    lastPrompt.attachedFiles = tPrompt.attachedFiles;
                    lastPrompt.isResponseHelpful = tPrompt.isResponseHelpful;
                    lastPrompt.blocks = tPrompt.blocks;
                    const hasBlocksOnly: boolean = Array.isArray(tPrompt.blocks) && tPrompt.blocks.length > 0 && (isNOU(tPrompt.response) || tPrompt.response === '');
                    // Check if this is a newly created prompt (when blocks-only called with no existing prompts)
                    const isNewlyCreatedPrompt: boolean = lastPrompt.prompt === null && lastPrompt.response === null;
                    // Render blocks only if: hasBlocksOnly AND responseItem exists AND (existing prompt OR template exists for new prompt)
                    if (hasBlocksOnly && responseItem && !this.responseItemTemplate && !isNewlyCreatedPrompt) {
                        const outputEle: HTMLElement = responseItem.querySelector('.e-output') as HTMLElement;
                        let outputContentBodyEle: HTMLDivElement = responseItem.querySelector('.e-content-body') as HTMLDivElement;
                        if (!outputContentBodyEle) {
                            outputContentBodyEle = this.createElement('div', { attrs: { class: 'e-content-body', tabindex: '0' } });
                            if (outputEle) {
                                outputEle.appendChild(outputContentBodyEle);
                            }
                        }
                        this.renderResponseSegments(outputContentBodyEle, tPrompt.blocks, isFinalUpdate);
                        if (this.outputElement.querySelector('.e-skeleton')) {
                            this.outputElement.removeChild(this.skeletonContainer);
                        }
                    } else {
                        processResponse(tPrompt.response, tPrompt.blocks);
                    }
                } else {
                    if (!this.isResponseRequested) {
                        this.prompts = [...this.prompts, tPrompt];
                        lastPrompt = this.prompts[this.prompts.length - 1];
                    }
                    lastPrompt.blocks = tPrompt.blocks;
                    this.lastRenderedBlockCount = 0;
                    this.renderOutputContainer(tPrompt.prompt, tPrompt.response, tPrompt.attachedFiles,
                                               this.prompts.length - 1, true, isFinalUpdate, tPrompt.blocks);
                }
                if (!isFinalUpdate) {
                    this.lastStreamPrompt = tPrompt.prompt;
                }
            }
            if (isFinalUpdate) {
                this.setupViewportFilling();
            }
            if (!this.enableStreaming && !this.isToolResponse) {
                if (isFinalUpdate && this.hasStopResponseButton()) {
                    this.toggleStopRespondingButton(false);
                }
                this.isResponseRequested = !isFinalUpdate;
            }
        }
        this.isProtectedOnChange = prevOnChange;
        if (this.enableScrollToBottom && this.downArrowIcon && this.outputContentBodyEle && this.contentWrapper) {
            this.downArrowIcon.visible = this.outputContentBodyEle.scrollHeight > this.contentWrapper.clientHeight;
        }
    }

    /**
     * Scrolls the view to the bottom to display the most recent response in the AIAssistView component.
     *
     * This method programmatically scrolls the view to the bottom,
     * typically used when new responses are added or to refocus on the latest response.
     *
     * @returns {void}
     */
    public scrollToBottom(): void {
        if  (this.contentWrapper) {
            this.updateScroll(this.contentWrapper);
        }
    }

    private updateMentionObjs(): void {
        if (this.editableTextarea) {
            this.destroyAndNullifyMentions();
            this.initializeMentions();
        }
    }

    private destroyAndNullifyMentions(): void {
        if (this.mentionModels && this.mentionModels.length > 0) {
            for (const mention of this.mentionModels) {
                if (mention && mention.destroy) {
                    mention.destroy();
                }
            }
            this.mentionModels = [];
            this.selectedMentions = [];
            this.mentionCounter = 0;
        }
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
                this.setDimension(this.element, this.width, this.height);
                break;
            case 'cssClass':
                this.updateCssClass(this.element, newProp.cssClass, oldProp.cssClass);
                break;
            case 'promptIconCss':
                this.updateIcons(newProp.promptIconCss, true);
                break;
            case 'responseIconCss':
                this.updateIcons(newProp.responseIconCss);
                break;
            case 'showHeader':
                this.updateHeader(this.showHeader, this.toolbarHeader, this.viewWrapper);
                break;
            case 'promptSuggestions':
                this.updatePromptSuggestionTemplate();
                break;
            case 'showClearButton':
                if (this.footerTemplate) { return; }
                else {
                    this.updateClearToolbarItemInSettings();
                    this.updateFooterToolbar();
                }
                break;
            case 'promptPlaceholder':
                this.updatePlaceholder(this.promptPlaceholder);
                break;
            case 'promptSuggestionsHeader': {
                this.suggestionHeader.innerHTML = this.promptSuggestionsHeader;
                const suggestionHeaderElem: HTMLElement = this.element.querySelector('.e-suggestions .e-suggestion-header');
                if (!suggestionHeaderElem) { this.suggestionsElement.append(this.suggestionHeader); }
                break;
            }
            case 'activeView': {
                const previousViewIndex: number = this.getIndex(oldProp.activeView);
                this.updateActiveView(previousViewIndex);
                break;
            }
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove']('e-rtl');
                if (!isNOU(this.toolbar)) {
                    this.toolbar.enableRtl = this.enableRtl;
                    this.toolbar.dataBind();
                }
                break;
            case 'toolbarSettings':
                this.updateToolbarSettings(oldProp.toolbarSettings);
                break;
            case 'footerToolbarSettings':
                if (newProp.footerToolbarSettings.items || newProp.footerToolbarSettings.toolbarPosition) {
                    this.updateFooterToolbar();
                }
                if (newProp.footerToolbarSettings.toolbarPosition) {
                    this.updateFooterType(newProp.footerToolbarSettings.toolbarPosition);
                }
                break;
            case 'promptToolbarSettings':
            case 'responseToolbarSettings':
            case 'prompts':
                this.isOutputRenderingStop = false;
                if (this.outputElement) { remove(this.outputElement); }
                if (this.hasStopResponseButton()) { this.toggleStopRespondingButton(false); }
                this.aiAssistViewRendered = false;
                this.latestResponseMinHeight = null;
                this.regeneratedResponses.clear();
                this.regeneratedBlocks.clear();
                this.currentRegeneratedIndex.clear();
                this.originalResponses.clear();
                this.originalBlocks.clear();
                this.isRegenerating = false;
                this.regeneratingPromptIndex = -1;
                this.renderOutputContent(true);
                this.detachCodeCopyEventHandler();
                if (this.bannerTemplate) {
                    this.updateBannerTemplate(this.bannerTemplate);
                }
                this.checkIsScrollable();
                this.setupViewportFilling();
                break;
            case 'prompt':
                if (!this.footerTemplate) {
                    this.editableTextarea.innerText = this.prompt;
                    this.refreshTextareaUI();
                    this.pushToUndoStack(this.prompt);
                }
                break;
            case 'locale':
                this.updateLocale();
                break;
            case 'bannerTemplate': {
                this.updateBannerTemplate(newProp.bannerTemplate);
                break;
            }
            case 'promptSuggestionItemTemplate': {
                if (!isNOU(newProp.promptSuggestionItemTemplate)) {
                    this.updatePromptSuggestionTemplate();
                }
                break;
            }
            case 'footerTemplate': {
                this.updateFooterTemplate();
                break;
            }
            case 'enableStreaming': {
                this.enableStreaming = newProp.enableStreaming;
                break;
            }
            case 'enableAttachments': {
                if (!this.footerTemplate) {
                    this.updateAttachmentToolbarItemInSettings();
                    this.updateFooterToolbar();
                }
                break;
            }
            case 'responseAnimationTemplate': {
                this.updateResponseAnimationTemplate(newProp.responseAnimationTemplate);
                break;
            }
            case 'enableScrollToBottom': {
                if (this.enableScrollToBottom) {
                    this.bindScroll();
                }
                else {
                    this.unBindScroll();
                }
                break;
            }
            case 'attachmentSettings':
                this.updateAttachmentSettings(newProp.attachmentSettings);
                break;
            case 'speechToTextSettings':
                this.handleSTTDynamicChange(newProp.speechToTextSettings, oldProp.speechToTextSettings);
                break;
            case 'mentions':
                this.updateMentionObjs();
                break;
            }
        }
    }
}
