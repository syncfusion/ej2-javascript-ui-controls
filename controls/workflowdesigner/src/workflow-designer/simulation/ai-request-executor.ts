/**
 * Built-in AI provider execution for AI steps whose `beforeRequestSend` handler
 * did not supply a response. Calls Gemini, OpenAI-compatible or Anthropic chat
 * APIs, or the step's server URL in Server mode, using the resolved step props.
 *
 * When `responseFields` is set, the executor forces JSON output and instructs
 * the model to return an object with those named fields (e.g. priority,
 * bugCategory).
 *
 * Security note: production hosts should use Server mode or `beforeRequestSend`
 * so provider keys stay on the server. By the time the executor runs,
 * `credentialRef` holds the resolved key (from `credentialRequested`, or the
 * step's `apiKey` in Inline mode); it is never persisted.
 */
import { L10n } from '@syncfusion/ej2-base';
import { LocaleContext } from '../localization/locale-context';
import { localeDefaults } from '../localization/locale-defaults';

/**
 * Declared structured field from AIStepProps.responseFields.
 *
 * @private
 */
export interface AiResponseFieldSpec {
    name: string;
    type?: string;
    description?: string;
}

/**
 * Ai Request Execution Result.
 *
 * @private
 */
export interface AiRequestExecutionResult {
    /** Primary model output (text, or parsed JSON when outputFormat is JSON). */
    content: unknown;
    /** Raw text returned by the model. */
    text: string;
    provider: string;
    model: string;
    outputFormat: string;
    raw?: unknown;
}

/**
 * Ai Request Executor.
 *
 * @private
 */
export class AiRequestExecutor {


    /**
     * Resolves a translation key against the shared L10n instance.
     *
     * @param {string} key - The localization key to resolve.
     * @param {L10n} l10n - Optional localization provider.
     * @returns {string} The translated string, or the English fallback.
     * @private
     */
    private static t(key: string, l10n?: L10n): string {
        return LocaleContext.text(key, localeDefaults[`${key}`], l10n);
    }

    /**
     * Executes an AI completion from resolved AI step props.
     * Props are expected to already be expression-resolved.
     *
     * @param {Record<string, unknown>} props - Resolved AI step properties.
     * @param {AbortSignal} signal - Signal used to cancel the request.
     * @param {Record<string, unknown> | undefined} context - Workflow runtime context snapshot, sent in server-mode payload.
     * @returns {Promise<AiRequestExecutionResult>} The AI provider response.
     * @private
     */
    public static async execute(
        props: Record<string, unknown>,
        signal?: AbortSignal,
        context?: Record<string, unknown>
    ): Promise<AiRequestExecutionResult> {
        const mode: string = String(props.mode || 'Direct').trim() || 'Direct';
        const provider: string = String(props.provider || '').trim();
        const model: string = String(props.model || '').trim();
        const apiKey: string = AiRequestExecutor.resolveApiKey(props);
        const systemPrompt: string = props.systemPrompt === undefined || props.systemPrompt === null
            ? ''
            : String(props.systemPrompt);
        const prompt: string = props.prompt === undefined || props.prompt === null
            ? ''
            : String(props.prompt);
        let outputFormat: string = String(props.outputFormat || 'Text').trim() || 'Text';
        const responseFields: AiResponseFieldSpec[] = AiRequestExecutor.normalizeResponseFields(props.responseFields);
        // Extract memory messages if provided by the memory integration layer
        const memoryMessages: Array<{ role: string; content: string }> | undefined =
            Array.isArray(props.memoryMessages)
                ? (props.memoryMessages as Array<{ role: string; content: string }>)
                : undefined;

        // Structured fields require a JSON object response.
        if (responseFields.length) {
            outputFormat = 'JSON';
        }

        if (!prompt && !systemPrompt) {
            throw AiRequestExecutor.aiError('AI_PROMPT_REQUIRED', AiRequestExecutor.t('aiPromptRequired'));
        }

        // Server-mode posts the prompt to the user's URL and forwards the
        // parsed response; no credentials are needed in this path.
        if (mode === 'Server') {
            const serverUrl: string = String(props.serverUrl || '').trim();
            if (!serverUrl) {
                throw AiRequestExecutor.aiError(
                    'AI_SERVER_URL_REQUIRED',
                    AiRequestExecutor.t('aiServerUrlRequired')
                );
            }
            return AiRequestExecutor.executeServer({
                url: serverUrl,
                provider: provider,
                model: model,
                systemPrompt: systemPrompt,
                prompt: prompt,
                outputFormat: outputFormat,
                responseFields: responseFields,
                context: context,
                memoryMessages: memoryMessages,
                headers: AiRequestExecutor.headerRecord(props.headers),
                signal: signal
            });
        }

        if (!model) {
            throw AiRequestExecutor.aiError('AI_MODEL_REQUIRED', AiRequestExecutor.t('aiModelRequired'));
        }
        if (!apiKey) {
            throw AiRequestExecutor.aiError(
                'AI_CREDENTIAL_REQUIRED',
                AiRequestExecutor.t('aiApiKeyRequired')
            );
        }

        const structuredInstruction: string = AiRequestExecutor.buildStructuredOutputInstruction(responseFields);
        const effectiveSystemPrompt: string = AiRequestExecutor.mergeSystemPrompt(systemPrompt, structuredInstruction);

        const kind: 'gemini' | 'openai' | 'claude' = AiRequestExecutor.detectProviderKind(provider, model);
        if (kind === 'gemini') {
            return AiRequestExecutor.executeGemini({
                model: model,
                apiKey: apiKey,
                systemPrompt: effectiveSystemPrompt,
                prompt: prompt,
                outputFormat: outputFormat,
                provider: provider || 'Gemini',
                responseFields: responseFields,
                signal: signal,
                memoryMessages: memoryMessages
            });
        }
        if (kind === 'claude') {
            return AiRequestExecutor.executeClaude({
                model: model,
                apiKey: apiKey,
                systemPrompt: effectiveSystemPrompt,
                prompt: prompt,
                outputFormat: outputFormat,
                provider: provider || 'Claude',
                responseFields: responseFields,
                signal: signal,
                memoryMessages: memoryMessages
            });
        }
        return AiRequestExecutor.executeOpenAiCompatible({
            model: model,
            apiKey: apiKey,
            systemPrompt: effectiveSystemPrompt,
            prompt: prompt,
            outputFormat: outputFormat,
            provider: provider || 'OpenAI',
            responseFields: responseFields,
            signal: signal,
            memoryMessages: memoryMessages
        });
    }

    private static resolveApiKey(props: Record<string, unknown>): string {
        // Single source of truth: `credentialRef` is the only prop that
        // carries the credential and it holds the raw API key as a string.
        // Legacy `credential` / `apiKey` / `key` props in imported JSON are
        // stripped during migration so they never reach the executor.
        const raw: unknown = props.credentialRef;
        if (raw === undefined || raw === null) {
            return '';
        }
        const text: string = String(raw).trim();
        return text;
    }

    private static detectProviderKind(provider: string, model: string): 'gemini' | 'openai' | 'claude' {
        const p: string = provider.toLowerCase();
        const m: string = model.toLowerCase();
        if (p.indexOf('gemini') !== -1 || p.indexOf('google') !== -1 || m.indexOf('gemini') !== -1) {
            return 'gemini';
        }
        if (p.indexOf('claude') !== -1 || p.indexOf('anthropic') !== -1 || m.indexOf('claude') !== -1) {
            return 'claude';
        }
        return 'openai';
    }

    private static async executeGemini(options: {
        model: string;
        apiKey: string;
        systemPrompt: string;
        prompt: string;
        outputFormat: string;
        provider: string;
        responseFields?: AiResponseFieldSpec[];
        signal?: AbortSignal;
        memoryMessages?: Array<{ role: string; content: string }>;
    }): Promise<AiRequestExecutionResult> {
        const modelId: string = options.model.indexOf('models/') === 0
            ? options.model.substring('models/'.length)
            : options.model;
        const modelPath: string = 'models/' + encodeURIComponent(modelId);
        const url: string =
            'https://generativelanguage.googleapis.com/v1beta/' +
            modelPath +
            ':generateContent';

        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        // Add memory messages (conversation history) if provided
        if (Array.isArray(options.memoryMessages)) {
            options.memoryMessages.forEach((msg: { role: string; content: string }) => {
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            });
        }

        // Add current user prompt
        contents.push({
            role: 'user',
            parts: [{ text: options.prompt || options.systemPrompt }]
        });

        const body: Record<string, unknown> = {
            contents: contents
        };
        if (options.systemPrompt && options.prompt) {
            body.systemInstruction = {
                parts: [{ text: options.systemPrompt }]
            };
        }
        const generationConfig: Record<string, unknown> = {};
        if (AiRequestExecutor.wantsJson(options.outputFormat)) {
            generationConfig.responseMimeType = 'application/json';
            const schema: Record<string, unknown> | null = AiRequestExecutor.buildJsonSchema(options.responseFields || []);
            if (schema) {
                generationConfig.responseSchema = schema;
            }
        }
        if (Object.keys(generationConfig).length) {
            body.generationConfig = generationConfig;
        }

        const init: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Key in a header, not the URL, so it stays out of logs, history and Referer.
                'x-goog-api-key': options.apiKey
            },
            body: JSON.stringify(body)
        };
        if (options.signal) {
            init.signal = options.signal;
        }
        const response: Response = await AiRequestExecutor.fetchJson(url, init);
        const raw: unknown = await AiRequestExecutor.readJson(response);
        if (!response.ok) {
            throw AiRequestExecutor.aiError(
                'AI_HTTP_' + response.status,
                AiRequestExecutor.providerErrorMessage(raw, 'Gemini request failed (HTTP ' + response.status + ').'),
                { status: response.status, raw: raw, provider: options.provider, model: options.model }
            );
        }
        const text: string = AiRequestExecutor.extractGeminiText(raw);
        return AiRequestExecutor.toResult(
            options.provider,
            options.model,
            options.outputFormat,
            text,
            raw,
            options.responseFields
        );
    }

    private static async executeOpenAiCompatible(options: {
        model: string;
        apiKey: string;
        systemPrompt: string;
        prompt: string;
        outputFormat: string;
        provider: string;
        responseFields?: AiResponseFieldSpec[];
        signal?: AbortSignal;
        memoryMessages?: Array<{ role: string; content: string }>;
    }): Promise<AiRequestExecutionResult> {
        const url: string = 'https://api.openai.com/v1/chat/completions';
        const messages: Array<{ role: string; content: string }> = [];
        if (options.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        // Add memory messages (conversation history) if provided
        if (Array.isArray(options.memoryMessages)) {
            messages.push(...options.memoryMessages);
        }
        messages.push({ role: 'user', content: options.prompt || options.systemPrompt });

        const body: Record<string, unknown> = {
            model: options.model,
            messages: messages
        };
        if (AiRequestExecutor.wantsJson(options.outputFormat)) {
            // OpenAI requires this protocol field name in snake case.
            // eslint-disable-next-line camelcase
            body.response_format = { type: 'json_object' };
        }

        const init: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + options.apiKey
            },
            body: JSON.stringify(body)
        };
        if (options.signal) {
            init.signal = options.signal;
        }
        const response: Response = await AiRequestExecutor.fetchJson(url, init);
        const raw: unknown = await AiRequestExecutor.readJson(response);
        if (!response.ok) {
            throw AiRequestExecutor.aiError(
                'AI_HTTP_' + response.status,
                AiRequestExecutor.providerErrorMessage(raw, 'OpenAI request failed (HTTP ' + response.status + ').'),
                { status: response.status, raw: raw, provider: options.provider, model: options.model }
            );
        }
        const text: string = AiRequestExecutor.extractOpenAiText(raw);
        return AiRequestExecutor.toResult(
            options.provider,
            options.model,
            options.outputFormat,
            text,
            raw,
            options.responseFields
        );
    }

    private static async executeClaude(options: {
        model: string;
        apiKey: string;
        systemPrompt: string;
        prompt: string;
        outputFormat: string;
        provider: string;
        responseFields?: AiResponseFieldSpec[];
        signal?: AbortSignal;
        memoryMessages?: Array<{ role: string; content: string }>;
    }): Promise<AiRequestExecutionResult> {
        const url: string = 'https://api.anthropic.com/v1/messages';
        const messages: Array<{ role: string; content: string }> = [];

        // Add memory messages (conversation history) if provided
        if (Array.isArray(options.memoryMessages)) {
            messages.push(...options.memoryMessages);
        }
        messages.push({ role: 'user', content: options.prompt || options.systemPrompt });

        const body: Record<string, unknown> = {
            model: options.model,
            // Anthropic's Messages API requires an explicit token cap.
            // eslint-disable-next-line camelcase
            max_tokens: 4096,
            messages: messages
        };
        if (options.systemPrompt && options.prompt) {
            body.system = options.systemPrompt;
        }
        if (AiRequestExecutor.wantsJson(options.outputFormat)) {
            // eslint-disable-next-line camelcase
            body.response_format = { type: 'json_object' };
        }

        const init: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': options.apiKey,
                'anthropic-version': '2023-06-01',
                // Required for direct browser-to-Anthropic calls (CORS).
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(body)
        };
        if (options.signal) {
            init.signal = options.signal;
        }
        const response: Response = await AiRequestExecutor.fetchJson(url, init);
        const raw: unknown = await AiRequestExecutor.readJson(response);
        if (!response.ok) {
            throw AiRequestExecutor.aiError(
                'AI_HTTP_' + response.status,
                AiRequestExecutor.providerErrorMessage(raw, 'Claude request failed (HTTP ' + response.status + ').'),
                { status: response.status, raw: raw, provider: options.provider, model: options.model }
            );
        }
        const text: string = AiRequestExecutor.extractClaudeText(raw);
        return AiRequestExecutor.toResult(
            options.provider,
            options.model,
            options.outputFormat,
            text,
            raw,
            options.responseFields
        );
    }

    private static extractClaudeText(raw: unknown): string {
        if (!raw || typeof raw !== 'object') {
            return '';
        }
        const content: unknown = (raw as { content?: unknown }).content;
        if (!Array.isArray(content)) {
            return '';
        }
        const chunks: string[] = [];
        for (let i: number = 0; i < content.length; i++) {
            const block: unknown = content[parseInt(i.toString(), 10)];
            if (block && typeof block === 'object' && (block as { type?: unknown }).type === 'text'
                && (block as { text?: unknown }).text !== undefined) {
                chunks.push(String((block as { text?: unknown }).text));
            }
        }
        return chunks.join('');
    }
    /**
     * Generates a visitor fingerprint using canvas-based rendering for the
     * Azure samples server. Returns a SHA-256 hash of the rendered canvas data.
     *
     * @returns {Promise<string | null>} The visitor fingerprint, or null on error.
     * @private
     */
    private static async fingerPrint(): Promise<string | null> {
        try {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 300;
            canvas.style.display = 'none';
            document.body.appendChild(canvas);

            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas context not available');
            }

            const size: number = 24;
            const diamondSize: number = 28;
            const gap: number = 4;
            const startX: number = 30;
            const startY: number = 30;
            const blue: string = '#1A3276';
            const orange: string = '#F28C00';

            const colorMap: string[][] = [
                ['blue', 'blue', 'diamond'],
                ['blue', 'orange', 'blue'],
                ['blue', 'blue', 'blue']
            ];

            const drawSquare: (x: number, y: number, color: string) => void = (x: number, y: number, color: string): void => {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, size, size);
            };

            const drawDiamond: (centerX: number, centerY: number, size: number, color: string) => void =
                (centerX: number, centerY: number, size: number, color: string): void => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY - size / 2);
                    ctx.lineTo(centerX + size / 2, centerY);
                    ctx.lineTo(centerX, centerY + size / 2);
                    ctx.lineTo(centerX - size / 2, centerY);
                    ctx.closePath();
                    ctx.fill();
                };

            for (let row: number = 0; row < 3; row++) {
                for (let col: number = 0; col < 3; col++) {
                    const type: string = colorMap[parseInt(row.toString(), 10)][parseInt(col.toString(), 10)];
                    const x: number = startX + col * (size + gap);
                    const y: number = startY + row * (size + gap);
                    if (type === 'blue') {
                        drawSquare(x, y, blue);
                    } else if (type === 'orange') {
                        drawSquare(x, y, orange);
                    } else if (type === 'diamond') {
                        drawDiamond(x + size / 2, y + size / 2, diamondSize, orange);
                    }
                }
            }

            ctx.font = '20px Arial';
            ctx.fillStyle = blue;
            ctx.textBaseline = 'middle';
            ctx.fillText('Syncfusion', startX + 3 * (size + gap) + 20, startY + size + gap);

            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgb(255,0,255)';
            ctx.beginPath();
            ctx.arc(50, 200, 50, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgb(0,255,255)';
            ctx.beginPath();
            ctx.arc(100, 200, 50, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgb(255,255,0)';
            ctx.beginPath();
            ctx.arc(75, 250, 50, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgb(255,0,255)';
            ctx.beginPath();
            ctx.arc(200, 200, 75, 0, Math.PI * 2, true);
            ctx.arc(200, 200, 25, 0, Math.PI * 2, true);
            ctx.fill('evenodd');

            const sha256: (str: string) => Promise<string> = async (str: string): Promise<string> => {
                const encoder: TextEncoder = new TextEncoder();
                const data: Uint8Array = encoder.encode(str);
                const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray: Uint8Array = new Uint8Array(hashBuffer);
                return Array.from(hashArray)
                    .map((b: number) => ('0' + b.toString(16)).slice(-2))
                    .join('');
            };

            const visitorID: string = await sha256(canvas.toDataURL());
            document.body.removeChild(canvas); // Clean up the canvas element
            return visitorID;
        } catch (error) {
            // Silently fail; the request proceeds without the fingerprint
            return null;
        }
    }

    private static async executeServer(options: {
        url: string;
        provider: string;
        model: string;
        systemPrompt: string;
        prompt: string;
        outputFormat: string;
        responseFields?: AiResponseFieldSpec[];
        context?: unknown;
        memoryMessages?: Array<{ role: string; content: string }>;
        headers?: { [name: string]: string };
        signal?: AbortSignal;
    }): Promise<AiRequestExecutionResult> {
        // Server mode posts the prompt payload to the user's server URL
        // and forwards the parsed response. The server owns credential
        // handling and provider choice; the executor is a transport only,
        // so raw keys never appear in the payload.
        const visitorId: string | null = await AiRequestExecutor.fingerPrint();
        // Build promptQuery with system prompt if provided
        let promptQuery: string = options.prompt;
        if (options.systemPrompt) {
            promptQuery = `System: ${options.systemPrompt}\n\nUser: ${options.prompt}`;
        }
        const body: Record<string, unknown> = {
            visitorId: visitorId,
            promptQuery: promptQuery,
            responseFormat: options.outputFormat || undefined,
            desiredFields: options.responseFields && options.responseFields.length > 0
                ? options.responseFields
                : []
        };
        if (options.context !== undefined) {
            body.context = options.context;
        }
        if (Array.isArray(options.memoryMessages)) {
            body.memoryMessages = options.memoryMessages;
        }
        const init: RequestInit = {
            method: 'POST',
            // Headers added in beforeRequestSend (for example Authorization) go to your server.
            headers: { ...(options.headers || {}), 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        if (options.signal) {
            init.signal = options.signal;
        }
        const response: Response = await AiRequestExecutor.fetchJson(options.url, init);
        const raw: unknown = await AiRequestExecutor.readJson(response);
        if (!response.ok) {
            throw AiRequestExecutor.aiError(
                'AI_HTTP_' + response.status,
                AiRequestExecutor.serverErrorMessage(raw, 'AI server request failed (HTTP ' + response.status + ').'),
                { status: response.status, raw: raw, url: options.url }
            );
        }
        const parsed: { content: unknown; text: string; outputFormat?: string; provider?: string; model?: string } =
            AiRequestExecutor.parseServerResponse(raw, options.outputFormat);
        const provider: string = options.provider || parsed.provider || 'Server';
        const model: string = options.model || parsed.model || 'Server';
        // A server may answer with structured `content` and no `text`; keep it rather than an empty result.
        const text: string = parsed.text || (parsed.content !== null && typeof parsed.content === 'object'
            ? JSON.stringify(parsed.content) : '');
        return AiRequestExecutor.toResult(
            provider,
            model,
            parsed.outputFormat || options.outputFormat,
            text,
            raw,
            options.responseFields
        );
    }

    /**
     * Normalizes request headers set by a `beforeRequestSend` handler: a `{ name: value }` object or a
     * `[{ key, value }]` list.
     *
     * @param {unknown} value - The headers value.
     * @returns {object | undefined} The headers as a plain object.
     */
    private static headerRecord(value: unknown): { [name: string]: string } | undefined {
        if (!value || typeof value !== 'object') {
            return undefined;
        }
        const result: { [name: string]: string } = {};
        if (Array.isArray(value)) {
            const entries: Array<{ key?: unknown; name?: unknown; value?: unknown }> = value;
            entries.forEach((item: { key?: unknown; name?: unknown; value?: unknown }) => {
                const name: string = String((item && (item.key || item.name)) || '').trim();
                if (name) {
                    result[`${name}`] = String(item.value === undefined || item.value === null ? '' : item.value);
                }
            });
        } else {
            Object.keys(value as Record<string, unknown>).forEach((name: string) => {
                result[`${name}`] = String((value as Record<string, unknown>)[`${name}`]);
            });
        }
        return result;
    }

    private static parseServerResponse(
        raw: unknown,
        fallbackOutputFormat: string
    ): { content: unknown; text: string; outputFormat?: string; provider?: string; model?: string } {
        if (!raw || typeof raw !== 'object') {
            return { content: raw, text: typeof raw === 'string' ? raw : '' };
        }
        const record: Record<string, unknown> = raw as Record<string, unknown>;
        const text: string = record.text === undefined || record.text === null
            ? ''
            : String(record.text);
        const content: unknown = 'content' in record ? record.content : (text || raw);
        const result: { content: unknown; text: string; outputFormat?: string; provider?: string; model?: string } = {
            content: content,
            text: text || (typeof content === 'string' ? content : '')
        };
        if (record.outputFormat !== undefined && record.outputFormat !== null) {
            result.outputFormat = String(record.outputFormat);
        } else if (fallbackOutputFormat) {
            result.outputFormat = fallbackOutputFormat;
        }
        if (typeof record.provider === 'string' && record.provider) {
            result.provider = record.provider;
        }
        if (typeof record.model === 'string' && record.model) {
            result.model = record.model;
        }
        return result;
    }

    private static serverErrorMessage(raw: unknown, fallback: string): string {
        if (!raw || typeof raw !== 'object') {
            return fallback;
        }
        const err: unknown = (raw as { error?: unknown }).error;
        if (typeof err === 'string' && err) {
            return err;
        }
        if (err && typeof err === 'object') {
            const message: unknown = (err as { message?: unknown }).message;
            if (message !== undefined && message !== null && String(message)) {
                return String(message);
            }
        }
        const message: unknown = (raw as { message?: unknown }).message;
        if (message !== undefined && message !== null && String(message)) {
            return String(message);
        }
        return fallback;
    }

    private static toResult(
        provider: string,
        model: string,
        outputFormat: string,
        text: string,
        raw: unknown,
        responseFields?: AiResponseFieldSpec[]
    ): AiRequestExecutionResult {
        let content: unknown = text;
        if (AiRequestExecutor.wantsJson(outputFormat) && text) {
            try {
                content = JSON.parse(text);
            } catch {
                content = text;
            }
        }
        if (responseFields && responseFields.length) {
            content = AiRequestExecutor.normalizeStructuredContent(content, responseFields);
        }
        return {
            content: content,
            text: text,
            provider: provider,
            model: model,
            outputFormat: outputFormat,
            raw: raw
        };
    }

    private static wantsJson(outputFormat: string): boolean {
        return String(outputFormat || '').toLowerCase() === 'json';
    }

    /**
     * Coerces responseFields from step props into a stable list of name/type/description.
     *
     * @param {unknown} value - Raw response field configuration.
     * @returns {AiResponseFieldSpec[]} Normalized response field definitions.
     */
    private static normalizeResponseFields(value: unknown): AiResponseFieldSpec[] {
        if (!Array.isArray(value) || !value.length) {
            return [];
        }
        const fields: AiResponseFieldSpec[] = [];
        for (let i: number = 0; i < value.length; i++) {
            const item: unknown = value[parseInt(i.toString(), 10)];
            if (!item || typeof item !== 'object') {
                continue;
            }
            const record: Record<string, unknown> = item as Record<string, unknown>;
            const name: string = String(record.name || record.key || record.field || '').trim();
            if (!name) {
                continue;
            }
            const typeRaw: string = String(record.type || 'String').trim() || 'String';
            const description: string = record.description === undefined || record.description === null
                ? ''
                : String(record.description).trim();
            const spec: AiResponseFieldSpec = { name: name, type: typeRaw };
            if (description) {
                spec.description = description;
            }
            fields.push(spec);
        }
        return fields;
    }

    private static mergeSystemPrompt(systemPrompt: string, structuredInstruction: string): string {
        if (!structuredInstruction) {
            return systemPrompt;
        }
        if (!systemPrompt) {
            return structuredInstruction;
        }
        return systemPrompt + '\n\n' + structuredInstruction;
    }

    /**
     * Prompt block that tells the model exactly which keys to return.
     * Example: priority (String), bugCategory (String).
     *
     * @param {AiResponseFieldSpec[]} fields - Fields the model must return.
     * @returns {string} Structured output instructions for the model.
     */
    private static buildStructuredOutputInstruction(fields: AiResponseFieldSpec[]): string {
        if (!fields.length) {
            return '';
        }
        const lines: string[] = [
            'You must respond with a single valid JSON object only (no markdown fences, no prose).',
            'Include every required property listed below. Use null when a value is unknown.',
            'Required properties:'
        ];
        for (let i: number = 0; i < fields.length; i++) {
            const field: AiResponseFieldSpec = fields[parseInt(i.toString(), 10)];
            let line: string = '- "' + field.name + '" (' + (field.type || 'String') + ')';
            if (field.description) {
                line += ': ' + field.description;
            }
            lines.push(line);
        }
        const example: Record<string, unknown> = {};
        for (let i: number = 0; i < fields.length; i++) {
            const field: AiResponseFieldSpec = fields[parseInt(i.toString(), 10)];
            example[field.name] = AiRequestExecutor.exampleValueForType(field.type);
        }
        lines.push('Example shape: ' + JSON.stringify(example));
        return lines.join('\n');
    }

    /**
     * OpenAPI-ish schema for Gemini responseSchema when fields are declared.
     *
     * @param {AiResponseFieldSpec[]} fields - Fields to include in the schema.
     * @returns {Record<string, unknown> | null} The response schema, when fields exist.
     */
    private static buildJsonSchema(fields: AiResponseFieldSpec[]): Record<string, unknown> | null {
        if (!fields.length) {
            return null;
        }
        const properties: Record<string, unknown> = {};
        const required: string[] = [];
        for (let i: number = 0; i < fields.length; i++) {
            const field: AiResponseFieldSpec = fields[parseInt(i.toString(), 10)];
            const prop: Record<string, unknown> = {
                type: AiRequestExecutor.jsonSchemaType(field.type)
            };
            if (field.description) {
                prop.description = field.description;
            }
            properties[field.name] = prop;
            required.push(field.name);
        }
        return {
            type: 'object',
            properties: properties,
            required: required
        };
    }

    private static jsonSchemaType(fieldType?: string): string {
        const t: string = String(fieldType || 'String').toLowerCase();
        if (t === 'number') {
            return 'number';
        }
        if (t === 'boolean') {
            return 'boolean';
        }
        if (t === 'array') {
            return 'array';
        }
        if (t === 'object' || t === 'json') {
            return 'object';
        }
        return 'string';
    }

    private static exampleValueForType(fieldType?: string): unknown {
        const t: string = String(fieldType || 'String').toLowerCase();
        if (t === 'number') {
            return 0;
        }
        if (t === 'boolean') {
            return false;
        }
        if (t === 'array') {
            return [];
        }
        if (t === 'object' || t === 'json') {
            return {};
        }
        return '';
    }

    /**
     * Ensures declared field names exist on the parsed object so downstream
     * steps can bind $.previousStep.response.priority reliably.
     *
     * @param {unknown} content - Parsed model response content.
     * @param {AiResponseFieldSpec[]} fields - Fields that must exist in the response.
     * @returns {unknown} Normalized structured response content.
     */
    private static normalizeStructuredContent(
        content: unknown,
        fields: AiResponseFieldSpec[]
    ): unknown {
        if (!fields.length) {
            return content;
        }
        let source: Record<string, unknown>;
        if (content && typeof content === 'object' && !Array.isArray(content)) {
            source = content as Record<string, unknown>;
        } else {
            source = { value: content };
        }
        const normalized: Record<string, unknown> = {};
        // Keep extra keys the model returned.
        Object.keys(source).forEach((key: string) => {
            // Keys originate from the model's JSON object and are not numeric indexes.
            // eslint-disable-next-line security/detect-object-injection
            normalized[key] = source[key];
        });
        for (let i: number = 0; i < fields.length; i++) {
            const name: string = fields[parseInt(i.toString(), 10)].name;
            if (!Object.prototype.hasOwnProperty.call(normalized, name)) {
                // Field names are user-defined JSON keys and cannot be converted to numeric indexes.
                // eslint-disable-next-line security/detect-object-injection
                normalized[name] = null;
            }
        }
        return normalized;
    }

    private static extractGeminiText(raw: unknown): string {
        if (!raw || typeof raw !== 'object') {
            return '';
        }
        const candidates: unknown = (raw as { candidates?: unknown }).candidates;
        if (!Array.isArray(candidates) || !candidates.length) {
            const blocked: unknown = (raw as { promptFeedback?: { blockReason?: string } }).promptFeedback;
            if (blocked && typeof blocked === 'object' && (blocked as { blockReason?: string }).blockReason) {
                throw AiRequestExecutor.aiError(
                    'AI_BLOCKED',
                    'Gemini blocked the prompt: ' + String((blocked as { blockReason?: string }).blockReason),
                    raw
                );
            }
            return '';
        }
        const first: unknown = candidates[0];
        if (!first || typeof first !== 'object') {
            return '';
        }
        const content: unknown = (first as { content?: unknown }).content;
        if (!content || typeof content !== 'object') {
            return '';
        }
        const parts: unknown = (content as { parts?: unknown }).parts;
        if (!Array.isArray(parts)) {
            return '';
        }
        const chunks: string[] = [];
        for (let i: number = 0; i < parts.length; i++) {
            const part: unknown = parts[parseInt(i.toString(), 10)];
            if (part && typeof part === 'object' && (part as { text?: unknown }).text !== undefined) {
                chunks.push(String((part as { text?: unknown }).text));
            }
        }
        return chunks.join('');
    }

    private static extractOpenAiText(raw: unknown): string {
        if (!raw || typeof raw !== 'object') {
            return '';
        }
        const choices: unknown = (raw as { choices?: unknown }).choices;
        if (!Array.isArray(choices) || !choices.length) {
            return '';
        }
        const first: unknown = choices[0];
        if (!first || typeof first !== 'object') {
            return '';
        }
        const message: unknown = (first as { message?: unknown }).message;
        if (!message || typeof message !== 'object') {
            return '';
        }
        const content: unknown = (message as { content?: unknown }).content;
        if (content === undefined || content === null) {
            return '';
        }
        if (typeof content === 'string') {
            return content;
        }
        return String(content);
    }

    private static async fetchJson(url: string, init: RequestInit): Promise<Response> {
        try {
            return await fetch(url, init);
        } catch (error) {
            throw AiRequestExecutor.aiError(
                'AI_NETWORK',
                error instanceof Error ? error.message : 'Network request to AI provider failed.'
            );
        }
    }

    private static async readJson(response: Response): Promise<unknown> {
        // The AI Assist flow passes the same Response through the AI call
        // pipeline; defensively clone before reading the body so any
        // downstream consumer that touches the original Response sees an
        // untouched stream. CORS-blocked responses also arrive as consumed
        // bodies on some browsers — clone() is a no-op there and the catch
        // below keeps the user-visible error friendly.
        let working: Response = response;
        try {
            if (response.body && (response.body as { locked?: boolean }).locked) {
                return null;
            }
            if (typeof (response as { clone?: () => Response }).clone === 'function') {
                working = (response as { clone: () => Response }).clone();
            }
        } catch {
            // ignore — fall through to the original response
        }
        let text: string;
        try {
            text = await working.text();
        } catch (error) {
            throw AiRequestExecutor.aiError(
                'AI_RESPONSE_READ',
                'Could not read the AI provider response (body stream unavailable). ' +
                    'This usually means a CORS preflight was rejected or the response was already consumed. ' +
                    'Switch AI Assist transport mode to "Server" with a host backend URL that proxies the request.',
                error instanceof Error ? { originalMessage: error.message } : undefined
            );
        }
        if (!text) {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    }

    private static providerErrorMessage(raw: unknown, fallback: string): string {
        // The fallback string already names the provider (e.g. "OpenAI request
        // failed (HTTP 500)."); when the raw payload carries a server-side
        // message, tag it with the provider name so callers can tell at a
        // glance whether the failure was raised by OpenAI / Gemini / other.
        const providerTag: string | null = (fallback.match(/\b(OpenAI|Gemini)\b/) || [])[0] || null;
        if (!raw || typeof raw !== 'object') {
            return fallback;
        }
        const err: unknown = (raw as { error?: unknown }).error;
        if (typeof err === 'string' && err) {
            return providerTag ? (providerTag + ': ' + err) : err;
        }
        if (err && typeof err === 'object') {
            const message: unknown = (err as { message?: unknown }).message;
            if (message !== undefined && message !== null && String(message)) {
                const text: string = String(message);
                return providerTag ? (providerTag + ': ' + text) : text;
            }
        }
        const message: unknown = (raw as { message?: unknown }).message;
        if (message !== undefined && message !== null && String(message)) {
            const text: string = String(message);
            return providerTag ? (providerTag + ': ' + text) : text;
        }
        return fallback;
    }

    private static aiError(
        code: string,
        message: string,
        details?: unknown
    ): { type: string; code: string; message: string; details?: unknown } {
        return {
            type: 'AI',
            code: code,
            message: message,
            details: details
        };
    }
}

