import { INotifyPropertyChanged, Property, NotifyPropertyChanges, isNullOrUndefined as isNOU, getUniqueID, Event, EmitType, L10n, SanitizeHtmlHelper, BaseEventArgs, Collection, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Toolbar, ClickEventArgs, ItemModel } from '@syncfusion/ej2-navigations';import { CloseEventArgs, OpenEventArgs, Popup } from '@syncfusion/ej2-popups';import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';import { EventHandler, addClass, removeClass, formatUnit } from '@syncfusion/ej2-base';import { Mention, SelectEventArgs } from '@syncfusion/ej2-dropdowns';import { AIAssistBase, ToolbarPosition } from '../ai-assist-base/ai-assist-base';import { ToolbarItemModel } from '../interactive-chat-base/interactive-chat-base-model';import { TextState, ToolbarItem } from '../interactive-chat-base/interactive-chat-base';
import {CommandItemSelectEventArgs,ResponseItemSelectEventArgs,ToolbarItemClickEventArgs,ResponseMode,InlinePromptRequestEventArgs} from "./inline-ai-assist";
import {AIAssistBaseModel} from "../ai-assist-base/ai-assist-base-model";

/**
 * Interface for a class PromptResponse
 */
export interface PromptResponseModel {

    /**
     * Specifies the prompt text for this item in the prompts collection.
     * Specifies the user-entered instruction or question to be processed.
     *
     * @type {string}
     * @default ''
     */
    prompt?: string;

    /**
     * Specifies the response associated with the corresponding prompt.
     * Specifies the AI-generated text (plain or Markdown) returned after processing.
     *
     * @type {string}
     * @default ''
     */
    response?: string;

}

/**
 * Interface for a class CommandItem
 */
export interface CommandItemModel {

    /**
     * Specifies the unique identifier of the command item.
     * This ID can be used for referencing specific commands programmatically.
     *
     * @type {string}
     * @default ''
     */
    id?: string;

    /**
     * Specifies whether the command item is disabled.
     * When set to true, the command item will be unavailable for selection and execution.
     *
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * This allows for styling and representation of icons that are visually linked with the item.
     *
     * @type {string}
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the display label for the command item.
     * This text is shown in the command menu for the user to identify the command.
     *
     * @type {string}
     * @default ''
     */
    label?: string;

    /**
     * Specifies the prompt or command text sent to the AI service when selected.
     * Specifies that prompts are resolved from captured context before sending.
     *
     * @type {string}
     * @default ''
     */
    prompt?: string;

    /**
     * Specifies the header text for the command item.
     * This provides a descriptive title or label for the item group.
     *
     * @type {string}
     * @default ''
     */
    groupBy?: string;

    /**
     * Specifies the title of the item.
     * This serves as the primary label or heading, providing a brief description of the item's purpose.
     *
     * @type {string}
     * @default ''
     */
    tooltip?: string;

}

/**
 * Interface for a class ResponseItem
 */
export interface ResponseItemModel {

    /**
     * Specifies the unique identifier of the response item.
     * This ID can be used for referencing specific response item programmatically.
     *
     * @type {string}
     * @default ''
     */
    id?: string;

    /**
     * Specifies whether the response item is disabled.
     * When set to `true`, the response item will be unavailable for selection and execution.
     *
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * This allows for styling and representation of icons that are visually linked with the item.
     *
     * @type {string}
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the display label for the response item.
     * This text is shown in the response menu for the user to identify the response.
     *
     * @type {string}
     * @default ''
     */
    label?: string;

    /**
     * Specifies the header text for the response item.
     * This provides a descriptive title or label for the item group.
     *
     * @type {string}
     * @default ''
     */
    groupBy?: string;

    /**
     * Specifies the title of the item.
     * This serves as the primary label or heading, providing a brief description of the item's purpose.
     *
     * @type {string}
     * @default ''
     */
    tooltip?: string;

}

/**
 * Interface for a class CommandSettings
 */
export interface CommandSettingsModel {

    /**
     * Triggers when a command item is selected in the command menu popup.
     * Use this event to apply the command, modify the prompt, or cancel default behavior.
     *
     * @event itemSelect
     */
    itemSelect?: EmitType<CommandItemSelectEventArgs>;

    /**
     * Specifies the collection of command items displayed in the command menu.
     * Specifies the items shown for quick selection in the prompt toolbar.
     *
     * @type {CommandItemModel[]}
     * @default []
     */
    commands?: CommandItemModel[];

    /**
     * Specifies the height of the command menu popup.
     * Specifies a CSS height value such as 'auto', '240px', or '50%'.
     *
     * @type {string}
     * @default ''
     */
    popupHeight?: string

    /**
     * SSpecifies the width of the command menu popup.
     * Specifies a CSS width value such as '320px' or '40%'.
     *
     * @type {string}
     * @default ''
     */
    popupWidth?: string

}

/**
 * Interface for a class ResponseSettings
 */
export interface ResponseSettingsModel {

    /**
     * Triggers when a toolbar item is clicked in the response toolbar.
     * Use this event to handle the action, update UI, or cancel default behavior.
     *
     * @event itemSelect
     */
    itemSelect?: EmitType<ResponseItemSelectEventArgs>;

    /**
     * Specifies the collection of toolbar items rendered in the response toolbar.
     * Specifies an array of ResponseItemModel objects for customization and interaction.
     *
     * @type {ResponseItemModel[]}
     * @default null
     */
    items?: ResponseItemModel[];

}

/**
 * Interface for a class InlineToolbarSettings
 */
export interface InlineToolbarSettingsModel {

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
     * Specifies the collection of toolbar items rendered in the response toolbar.
     * Specifies an array of ToolbarItemModel objects used for customization and interaction.
     *
     * @type {ToolbarItemModel[]}
     * @default null
     */
    items?: ToolbarItemModel[];

    /**
     * Triggers when a toolbar item is clicked in the response toolbar.
     * Use this event to handle the action, update UI, or cancel default behavior.
     *
     * @event itemClick
     */
    itemClick?: EmitType<ToolbarItemClickEventArgs>;

}

/**
 * Interface for a class InlineAIAssist
 */
export interface InlineAIAssistModel extends AIAssistBaseModel{

    /**
     * Specifies the element or CSS selector where the InlineAIAssist will be appended.
     * Accepts either a CSS selector string (e.g., '.container' or '#id') or an HTMLElement.
     * Defaults to document.body.
     *
     * @type {string | HTMLElement}
     * @default 'body'
     */
    target?: string | HTMLElement;

    /**
     * Specifies the element relative to which the InlineAIAssist popup is positioned.
     * Accepts a CSS selector string (e.g., '#id' or '.class') or an HTMLElement.
     *
     * @type {string | HTMLElement}
     * @default ''
     */
    relateTo?: string | HTMLElement;

    /**
     * Specifies how the AI response is displayed.
     * 'Inline' renders at the caret position; 'Popup' shows above the prompt.
     *
     * @isenumeration true
     * @default ResponseMode.Popup
     * @asptype ResponseMode
     */
    responseMode?: ResponseMode | string;

    /**
     * Specifies one or more custom CSS class names for the root element of the component.
     * Specifies multiple classes as a space-separated list.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the current text value of the prompt input field.
     * Specifies the content that will be used to generate the AI response.
     *
     * @type {string}
     * @default ''
     */
    prompt?: string;

    /**
     * Specifies the collection of prompts and their corresponding responses.
     * Specifies an array of PromptModel objects used to render the history.
     *
     * @type {PromptResponseModel[]}
     * @default []
     */
    prompts?: PromptResponseModel[];

    /**
     * Specifies the placeholder text displayed when the prompt input is empty.
     *  Specifies helper text to guide the user on what to ask or generate.
     *
     * @type {string}
     * @default 'Ask or generate AI content..'
     */
    placeholder?: string;

    /**
     * Specifies the locale code used for UI text localization.
     * Specifies culture codes such as 'en-US' or 'ta-IN'.
     *
     * @type {string}
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Specifies the height of the popup container.
     * Specifies a value in CSS units (px, %, rem, vh, etc.) or a number in pixels.
     *
     * @type {string | number}
     * @default 'auto'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Specifies the width of the popup container.
     * Specifies a value in CSS units (px, %, rem, vw, etc.) or a number in pixels.
     *
     * @type {string | number}
     * @default '400px'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies the configuration for available AI commands and suggestions.
     * Specifies options such as enabling/disabling commands and customizing suggestion behavior.
     *
     * @type {CommandSettingsModel | null}
     * @default null
     */
    commandSettings?: CommandSettingsModel;

    /**
     * Specifies the configuration for the toolbar displayed with the generated response.
     * Specifies buttons, actions, and behaviors applied to the response area.
     *
     * @type {ResponseSettingsModel | null}
     * @default null
     */
    responseSettings?: ResponseSettingsModel;

    /**
     * Specifies the configuration for the toolbar displayed in the inline prompt input.
     * Specifies buttons, shortcuts, and behaviors available while composing the prompt.
     *
     * @type {InlineToolbarSettingsModel | null}
     * @default null
     */
    inlineToolbarSettings?: InlineToolbarSettingsModel;

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
    responseTemplate?: string | Function;

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
    editorTemplate?: string | Function;

    /**
     * Specifies the z-index value applied to the popup or overlay layer.
     * Specifies a higher value to ensure the component appears above surrounding UI.
     *
     * @type {number}
     * @default 1000
     */
    zIndex?: number;

    /**
     * Specifies whether right-to-left (RTL) text direction is enabled for the component.
     * Specifies true to render UI elements and text in RTL layout.
     *
     * @type {boolean}
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Triggers when the user submits a prompt by pressing Enter or clicking Generate.
     * Use this event to perform the AI request, update UI, or cancel the default processing.
     *
     * @event promptRequest
     */
    promptRequest?: EmitType<InlinePromptRequestEventArgs>;

    /**
     * Triggers when the popup or inline response area becomes visible.
     * Use this event to set focus, measure layout, or run analytics.
     *
     * @event open
     */
    open?: EmitType<OpenEventArgs>;

    /**
     * Triggers when the popup or inline response area is closed or hidden.
     * Occurs on cancel, Escape key, outside click, or after response insertion.
     *
     * @event close
     */
    close?: EmitType<CloseEventArgs>;

}