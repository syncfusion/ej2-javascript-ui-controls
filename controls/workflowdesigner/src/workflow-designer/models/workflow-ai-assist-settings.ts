import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import { WorkflowAIAssistDirectSettingsModel, WorkflowAIAssistServerSettingsModel } from './workflow-ai-assist-settings-model';


/**
 * Defines the AI provider that AI Assist calls in `'Direct'` mode: `'Gemini'`, `'OpenAI'` or `'Claude'`.
 */
export type WorkflowAIAssistProvider = 'Gemini' | 'OpenAI' | 'Claude';

/**
 * Defines how AI Assist sends requests: `'Direct'` calls the AI provider from the browser, and
 * `'Server'` sends the request to your own backend.
 */
export type WorkflowAIAssistTransportMode = 'Direct' | 'Server';

/**
 * Built-in Gemini model presets surfaced in the AI Assist settings dialog. Free text is also allowed.
 *
 * @private
 */
export const AI_ASSIST_GEMINI_MODELS: string[] = [
    'gemini-3.1-flash-lite',
    'gemini-3.1-flash',
    'gemini-3.1-pro'
];

/**
 * Built-in OpenAI-compatible model presets surfaced in the AI Assist settings dialog. Free text is also allowed.
 *
 * @private
 */
export const AI_ASSIST_OPENAI_MODELS: string[] = [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4.1',
    'gpt-5'
];

/**
 * Built-in default model used when the user has not yet picked one.
 *
 * @private
 */
export const AI_ASSIST_DEFAULT_MODEL: string = AI_ASSIST_GEMINI_MODELS[0];

/**
 * Built-in default provider used when the user has not yet picked one.
 *
 * @private
 */
export const AI_ASSIST_DEFAULT_PROVIDER: WorkflowAIAssistProvider = 'Gemini';

/**
 * Built-in default transport mode.
 *
 * @private
 */
export const AI_ASSIST_DEFAULT_TRANSPORT_MODE: WorkflowAIAssistTransportMode = 'Server';

/**
 * Returns the model presets for a given provider. Used by the AI Assist settings
 * dialog to populate the model select.
 *
 * @param {string} provider - The provider name.
 * @returns {string[]} The model presets relevant to the provider.
 * @private
 */
export function getAIAssistModelPresets(provider: string): string[] {
    const p: string = String(provider || '').toLowerCase();
    if (p.indexOf('openai') !== -1) {
        return AI_ASSIST_OPENAI_MODELS.slice();
    }
    if (p.indexOf('gemini') !== -1 || !p) {
        return AI_ASSIST_GEMINI_MODELS.slice();
    }
    // No presets for other providers (such as Claude); the model is typed in.
    return [];
}

/**
 * Defines how AI Assist reaches your backend in `'Server'` mode.
 */
export class WorkflowAIAssistServerSettings extends ChildProperty<WorkflowAIAssistServerSettings> {
    /**
     * Defines the URL of your backend endpoint. AI Assist posts a `WorkflowAIServerRequest` to it and
     * expects a `WorkflowAIServerResponse`. Add authentication headers in the `beforeRequestSend` event.
     *
     * @default ''
     */
    @Property('')
    public url: string;
}

/**
 * Defines the AI provider AI Assist calls from the browser in `'Direct'` mode. Use `'Direct'` mode for
 * development and demos; in production, use `'Server'` mode so keys stay on your backend.
 */
export class WorkflowAIAssistDirectSettings extends ChildProperty<WorkflowAIAssistDirectSettings> {
    /**
     * Defines the AI provider: `'Gemini'`, `'OpenAI'` or `'Claude'`.
     *
     * @default null
     */
    @Property(null)
    public provider: WorkflowAIAssistProvider;

    /**
     * Defines the model, such as `'gemini-3.1-flash'` or `'gpt-4o'`.
     *
     * @default ''
     */
    @Property('')
    public model: string;

    /**
     * Defines the name of a credential your application resolves through the `credentialRequested`
     * event (with `purpose` set to `'AIAssist'`). When set, it is used instead of `apiKey`.
     *
     * @default ''
     * @private
     */
    @Property('')
    public credentialRef: string;

    /**
     * Defines a raw API key sent from the browser. For development only: anyone using the page can read
     * it. Prefer `credentialRef`, or `'Server'` mode.
     *
     * @default ''
     */
    @Property('')
    public apiKey: string;
}

/**
 * Defines AI Assist, which generates or updates the workflow from natural-language prompts.
 * AI Assist is disabled by default.
 *
 * In `'Server'` mode (the default), requests are posted to `server.url`, and your backend calls the
 * provider and keeps the key. In `'Direct'` mode, the browser calls the provider set in `direct`.
 * Every AI Assist request raises `beforeRequestSend` (with `requestType` set to `'AIAssist'`), so you can
 * add headers, change the request or supply the response.
 *
 * Users can also change these values from the settings button in the AI Assist panel. Keys are never
 * included in event arguments or in the generated workflow.
 */
export class WorkflowAIAssistSettings extends ChildProperty<WorkflowAIAssistSettings> {
    /**
     * Defines whether AI Assist is available. When `false`, the AI Assist panel is not rendered and no
     * AI requests are made.
     *
     * @default false
     */
    @Property(false)
    public enabled: boolean;

    /**
     * Defines the side of the property panel area that AI Assist is displayed on.
     *
     * @default 'Right'
     */
    @Property('Right')
    public position: 'Left' | 'Right';

    /**
     * Defines the suggested prompts displayed in the AI Assist panel.
     *
     * @default null
     */
    @Property(null)
    public promptSuggestions: string[];

    /**
     * Defines the backend endpoint used in `'Server'` mode.
     *
     * @default {}
     */
    @Complex<WorkflowAIAssistServerSettingsModel>({}, WorkflowAIAssistServerSettings)
    public server: WorkflowAIAssistServerSettingsModel;

    /**
     * Defines the provider, model and key used in `'Direct'` mode.
     *
     * @default {}
     */
    @Complex<WorkflowAIAssistDirectSettingsModel>({}, WorkflowAIAssistDirectSettings)
    public direct: WorkflowAIAssistDirectSettingsModel;

    /**
     * Use `direct.provider`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    @Property(null)
    public provider: WorkflowAIAssistProvider;

    /**
     * Use `direct.model`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    @Property(null)
    public model: string;

    /**
     * Use `direct.credentialRef` or `direct.apiKey`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    @Property(null)
    public credential: string;

    /**
     * Use `server.url`. Read for one preview release, then removed.
     *
     * @default null
     * @private
     * @deprecated
     */
    @Property(null)
    public serverUrl: string;
}

/**
 * The AI Assist configuration with the deprecated flat settings folded in.
 *
 * @private
 */
export interface ResolvedAIAssistConfig {
    mode: WorkflowAIAssistTransportMode;
    serverUrl: string;
    provider: string;
    model: string;
    credentialRef: string;
    apiKey: string;
    /** True when any deprecated flat setting supplied a value. */
    usedLegacy: boolean;
}

/**
 * Reads AI Assist settings, preferring `server` and `direct` and falling back to the deprecated flat
 * `serverUrl`, `provider`, `model` and `credential` (whose meaning follows `credentialMode`).
 *
 * @param {object} settings - The AI Assist settings.
 * @param {string} [credentialMode] - `executionSettings.credentialMode`, for the deprecated `credential`.
 * @returns {ResolvedAIAssistConfig} The resolved configuration.
 * @private
 */
export function resolveAIAssistConfig(
    settings: {
        server?: { url?: string }; direct?: { provider?: string; model?: string; credentialRef?: string; apiKey?: string };
        provider?: string; model?: string; credential?: string; serverUrl?: string;
    } | undefined,
    credentialMode?: string
): ResolvedAIAssistConfig {
    const s: typeof settings = settings || {};
    const server: { url?: string } = s.server || {};
    const direct: { provider?: string; model?: string; credentialRef?: string; apiKey?: string } = s.direct || {};
    const text: (value: unknown) => string = (value: unknown): string => (value === undefined || value === null ? '' : String(value).trim());
    const legacyCredential: string = text(s.credential);
    const inline: boolean = credentialMode === 'Inline';
    const config: ResolvedAIAssistConfig = {
        // The execution `credentialMode` decides the transport: Inline calls the provider, Reference uses the server URL.
        mode: inline ? 'Direct' : 'Server',
        serverUrl: text(server.url) || text(s.serverUrl),
        provider: text(direct.provider) || text(s.provider),
        model: text(direct.model) || text(s.model),
        credentialRef: text(direct.credentialRef) || (!inline ? legacyCredential : ''),
        apiKey: text(direct.apiKey) || (inline ? legacyCredential : ''),
        usedLegacy: false
    };
    config.usedLegacy = Boolean(
        (!text(server.url) && text(s.serverUrl)) || (!text(direct.provider) && text(s.provider))
        || (!text(direct.model) && text(s.model)) || legacyCredential
    );
    return config;
}
