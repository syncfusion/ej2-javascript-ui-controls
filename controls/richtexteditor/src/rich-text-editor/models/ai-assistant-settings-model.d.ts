import { ChildProperty, Property } from '@syncfusion/ej2-base';import { PromptModel } from '@syncfusion/ej2-interactive-chat';import { IAIAssistantToolbarItem, AICommands } from '../base/interface';import { DEFAULT_AI_COMMANDS } from './items';import { AssistantPromptToolbarItems, AssistantResponseToolbarItems, AssitantHeaderToolbarItems } from '../base/types';

/**
 * Interface for a class AIAssistantSettings
 */
export interface AIAssistantSettingsModel {

    /**
     * Defines the predefined AI command options displayed in the command dropdown menu.
     * Each command contains text, prompts, icons, and optional nested items.
     *
     * @type {AICommands[]}
     * @default
     * [{
        text: "Edit & Improve",
        items: [
            {
                text: "Improve Content",
                prompt: "Improve the clarity, coherence, and overall quality of the following content:"
            },
            {
                text: "Shorten",
                prompt: "Shorten the following content without losing its core message:"
            },
            {
                text: "Elaborate",
                prompt: "Expand on the following content with more detail and explanation:"
            },
            {
                text: "Simplify",
                prompt: "Simplify the language and make the following content easier to understand:"
            },
            {
                text: "Summarize",
                prompt: "Summarize the following content in a concise and clear way:"
            },
            {
                text: "Check Grammar & Spelling",
                prompt: "Check the following content for grammar and spelling mistakes, and correct them:"
            }
        ]
    },
    {
        text: "Change Tone",
        items: [
            {
                text: "Professional",
                prompt: "Rewrite the following content in a professional tone:"
            },
            {
                text: "Casual",
                prompt: "Rewrite the following content in a casual, conversational tone:"
            },
            {
                text: "Direct",
                prompt: "Rewrite the following content to be more direct and to the point:"
            },
            {
                text: "Friendly",
                prompt: "Rewrite the following content in a friendly and approachable tone:"
            },
            {
                text: "Inspirational",
                prompt: "Rewrite the following content in an inspirational and motivational tone:"
            },
            {
                text: "Persuasive",
                prompt: "Rewrite the following content in a persuasive tone to convince the reader:"
            }
        ]
    },
    {
        text: "Change Style",
        items: [
            {
                text: "Business",
                prompt: "Rewrite the following content in a business writing style:"
            },
            {
                text: "Legal",
                prompt: "Rewrite the following content in a formal legal writing style:"
            },
            {
                text: "Journalistic",
                prompt: "Rewrite the following content in a journalistic/reporting style:"
            },
            {
                text: "Academic",
                prompt: "Rewrite the following content in an academic writing style:"
            }
        ]
    },
    {
        text: "Translate",
        prompt: "",
        items: [
            {
                text: "English",
                prompt: "Translate the following content into English:"
            },
            {
                text: "German",
                prompt: "Translate the following content into German:"
            },
            {
                text: "Spanish",
                prompt: "Translate the following content into Spanish:"
            },
            {
                text: "French",
                prompt: "Translate the following content into French:"
            },
            {
                text: "Japanese",
                prompt: "Translate the following content into Japanese:"
            },
            {
                text: "Simplified Chinese",
                prompt: "Translate the following content into Simplified Chinese:"
            },
            {
                text: "Hindi",
                prompt: "Translate the following content into Hindi:"
            },
            {
                text: "Arabic",
                prompt: "Translate the following content into Arabic:"
            }
        ]
    }]
     *
     */
    commands?: AICommands[];

    /**
     * Sets the max height of the AI Assistant popup.
     *
     * Accepts CSS height values (e.g., '350px', '500') or numbers (treated as pixels).
     *
     * @type {string | number}
     * @asptype string
     * @default '400px'
     */
    popupMaxHeight?: string | number;

    /**
     * Sets the width of the AI Assistant popup.
     *
     * Accepts CSS width values (e.g., '400px', '500') or numbers (treated as pixels).
     *
     * @type {string | number}
     * @asptype string
     * @default '600px'
     */
    popupWidth?: string | number;

    /**
     * Specifies the placeholder text shown in the AI prompt textarea.
     *
     * @type {string}
     * @default 'Ask AI to rewrite or generate content.'
     */
    placeholder?: string;

    /**
     * Configures the toolbar in the header section of the AI Assistant interface.
     * Allows customization of toolbar items, appearance, and behavior.
     *
     * @type {(AssitantHeaderToolbarItems | IAIAssistantToolbarItem)[]}
     * @default ['AIcommands', 'Close']
     */
    headerToolbarSettings?: (AssitantHeaderToolbarItems | IAIAssistantToolbarItem)[];

    /**
     * Configures the toolbar in the prompt editor (user input) section.
     * Allows customization of toolbar items, appearance, and behavior for the input area.
     *
     * @type {(AssistantPromptToolbarItems | IAIAssistantToolbarItem)[]}
     * @default ['Edit', 'Copy']
     */
    promptToolbarSettings?: (AssistantPromptToolbarItems | IAIAssistantToolbarItem)[];

    /**
     * Configures the toolbar in the AI response viewer section.
     * Allows customization of toolbar items, appearance, and behavior for the response area.
     *
     * @type {(AssistantResponseToolbarItems | IAIAssistantToolbarItem)[]}
     * @default ['Regenerate', 'Copy', '|', 'Insert']
     */
    responseToolbarSettings?: (AssistantResponseToolbarItems | IAIAssistantToolbarItem)[];

    /**
     * Defines the collection of predefined prompts and their corresponding responses.
     * These prompts can be presented to the user as quick-access options.
     *
     * @type {PromptModel[]}
     * @default []
     */
    prompts?: PromptModel[];

    /**
     * Defines suggestion prompts displayed to the user as guidance.
     * These suggestions help users understand what kinds of queries they can make.
     *
     * @type {string[]}
     * @default []
     */
    suggestions?: string[];

    /**
     * Specifies the template for the banner in the AI Assistant component.
     * Represents the content or layout used to render the banner. Can be a string or a function.
     *
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     * @default ''
     */
    bannerTemplate?: string | Function;

    /**
     * Defines the maximum number of prompts that can be stored in the editor's
     * history stack.
     *
     * Once the limit is reached, the oldest entries are removed as new ones
     * are added to maintain the maximum size.
     *
     * @type {number}
     * @default 20
     */
    maxPromptHistory?: number;

}