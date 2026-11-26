import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import {WorkflowAIAssistProvider} from "./workflow-ai-assist-settings";

/**
 * Interface for a class WorkflowAIAssistServerSettings
 */
export interface WorkflowAIAssistServerSettingsModel {

    /**
     * Defines the URL of your backend endpoint. AI Assist posts a `WorkflowAIServerRequest` to it and
     * expects a `WorkflowAIServerResponse`. Add authentication headers in the `beforeRequestSend` event.
     *
     * @default ''
     */
    url?: string;

}

/**
 * Interface for a class WorkflowAIAssistDirectSettings
 */
export interface WorkflowAIAssistDirectSettingsModel {

    /**
     * Defines the AI provider: `'Gemini'`, `'OpenAI'` or `'Claude'`.
     *
     * @default null
     */
    provider?: WorkflowAIAssistProvider;

    /**
     * Defines the model, such as `'gemini-3.1-flash'` or `'gpt-4o'`.
     *
     * @default ''
     */
    model?: string;

    /**
     * Defines the name of a credential your application resolves through the `credentialRequested`
     * event (with `purpose` set to `'AIAssist'`). When set, it is used instead of `apiKey`.
     *
     * @default ''
     * @private
     */
    credentialRef?: string;

    /**
     * Defines a raw API key sent from the browser. For development only: anyone using the page can read
     * it. Prefer `credentialRef`, or `'Server'` mode.
     *
     * @default ''
     */
    apiKey?: string;

}

/**
 * Interface for a class WorkflowAIAssistSettings
 */
export interface WorkflowAIAssistSettingsModel {

    /**
     * Defines whether AI Assist is available. When `false`, the AI Assist panel is not rendered and no
     * AI requests are made.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Defines the side of the property panel area that AI Assist is displayed on.
     *
     * @default 'Right'
     */
    position?: 'Left' | 'Right';

    /**
     * Defines the suggested prompts displayed in the AI Assist panel.
     *
     * @default null
     */
    promptSuggestions?: string[];

    /**
     * Defines the backend endpoint used in `'Server'` mode.
     *
     * @default {}
     */
    server?: WorkflowAIAssistServerSettingsModel;

    /**
     * Defines the provider, model and key used in `'Direct'` mode.
     *
     * @default {}
     */
    direct?: WorkflowAIAssistDirectSettingsModel;

    /**
     * Use `direct.provider`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    provider?: WorkflowAIAssistProvider;

    /**
     * Use `direct.model`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    model?: string;

    /**
     * Use `direct.credentialRef` or `direct.apiKey`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    credential?: string;

    /**
     * Use `server.url`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    serverUrl?: string;

}