import { Component, EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, Collection, EmitType, Event, select, compile, remove, attributes } from '@syncfusion/ej2-base';import { ChildProperty, getUniqueID, isNullOrUndefined as isNOU, formatUnit, append, BaseEventArgs, Complex, removeClass, addClass } from '@syncfusion/ej2-base';import { InputEventArgs, TextArea } from '@syncfusion/ej2-inputs';import { ItemModel, Toolbar, ClickEventArgs, ItemType, ItemAlign } from '@syncfusion/ej2-navigations';
import {AssistViewType,ToolbarItemClickedEventArgs,PromptRequestEventArgs,PromptChangedEventArgs} from "./ai-assist-view";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ToolbarItem
 */
export interface ToolbarItemModel {

    /**
     * Specifies the CSS class for the icon of the toolbar item.
     * Represents the icon displayed for the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the text of the toolbar item.
     * Represents the display text of the toolbar item.
     *
     * @type {string}
     * @default null
     */
    text?: string;

    /**
     * Specifies the type of the toolbar item.
     * Represents the item type of the toolbar item.
     *
     * @type {ItemType}
     * @default "Button"
     * @aspPopulateDefaultValue
     */
    type?: ItemType;

    /**
     * Specifies the alignment of the toolbar item.
     *
     * @type {ItemAlign}
     * @default "Left"
     * @aspPopulateDefaultValue
     */
    align?: ItemAlign;

    /**
     * Specifies whether the toolbar item is visible.
     * Indicates if the toolbar item should be displayed.
     *
     * @type {boolean}
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies whether the toolbar item is disabled.
     * Indicates if the toolbar item is interactive or not.
     *
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the tooltip text for the toolbar item.
     * Represents the text shown when hovering over the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    tooltip?: string;

    /**
     * Specifies the CSS class for styling the toolbar item.
     * Represents the additional CSS classes applied to the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

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
    template?: string | Function;

    /**
     * Specifies the tab order of the toolbar items.
     * When assigned positive values, it allows switching focus to the next/previous toolbar items using the Tab/Shift+Tab keys.
     * If the value is set to 0 for all toolbar items, the tab order switches based on the element's order in the DOM.
     *
     * @type {number}
     * @default -1
     */
    tabIndex?: number

}

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
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies the collection of toolbar items in the AIAssistView component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    items?: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the AIAssistView component.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<ToolbarItemClickedEventArgs>;

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
 * Interface for a class AIAssistView
 */
export interface AIAssistViewModel extends ComponentModel{

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
     * @type {PromptModel[]}
     * @default []
     */
    prompts?: PromptModel[];

    /**
     * Specifies the list of prompt suggestions in the AIAssistView component.
     * Contains suggestions that can be used as prompts.
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
     * @type {AssistViewModel[]}
     * @default null
     */
    views?: AssistViewModel[] ;

    /**
     * Specifies the settings for the prompt toolbar in the AIAssistView component.
     * Represents the configuration for the toolbar associated with prompt items.
     *
     * @default null
     */
    promptToolbarSettings?: PromptToolbarSettingsModel;

    /**
     * Specifies the settings for the response toolbar in the AIAssistView component.
     * Represents the configuration for the toolbar associated with response items.
     *
     * @default []
     */
    responseToolbarSettings?: ResponseToolbarSettingsModel;

    /**
     * Specifies whether the clear button of text area is displayed in the AIAssistView component.
     * Determines if a button for clearing the prompt text area is shown or hidden.
     *
     * @type {boolean}
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Specifies the template for the footer in the AIAssistView component.
     * Defines the content or layout used to render the footer. Can be a string or a function.
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
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    bannerTemplate?: string | Function;

    /**
     * Event triggered when a prompt request is made in the AIAssistView component.
     * Provides details about the prompt request, including whether it should be cancelled, the prompt text, output, and toolbar items.
     *
     * @event promptRequest
     */
    promptRequest?: EmitType<PromptRequestEventArgs>;

    /**
     * Event triggers when the SfAIAssistView is created.
     *
     * @event 'created'
     */
    created?: EmitType<Object>;

    /**
     * Event triggered when the prompt text changed in the AIAssistView component.
     *
     * @event 'promptChanged'
     */
    promptChanged?: EmitType<PromptChangedEventArgs>;

}