/**
 * Built-in HTTP execution for API Request steps whose `beforeRequestSend`
 * handler did not supply a response. Resolves query params, headers, and body rules.
 * GET and DELETE never send a body.
 *
 * @private
 */
import { L10n } from '@syncfusion/ej2-base';
import { LocaleContext } from '../localization/locale-context';
import { isHttpUrl } from '../validation/url-check';
import { localeDefaults } from '../localization/locale-defaults';

export interface ApiRequestExecutionResult {
    ok: boolean;
    status: number;
    statusText: string;
    headers: { [name: string]: string };
    body: unknown;
    url: string;
    method: string;
}

/**
 * Api Request Executor.
 *
 * @private
 */
export class ApiRequestExecutor {


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
     * Executes an HTTP request from resolved ApiRequest step props.
     * Props are expected to already be expression-resolved.
     *
     * @param {object} props - Resolved API request properties.
     * @param {AbortSignal} signal - Signal used to cancel the request.
     * @returns {Promise<ApiRequestExecutionResult>} The HTTP request result.
     * @private
     */
    public static async execute(
        props: Record<string, unknown>,
        signal?: AbortSignal
    ): Promise<ApiRequestExecutionResult> {
        // Captured synchronously: messages built after the fetch await must use
        // the locale of the instance that started this request.
        const l10n: L10n | undefined = LocaleContext.current();
        const method: string = String(props.method || 'GET').toUpperCase();
        const rawUrl: string = String(props.url || '').trim();
        if (!rawUrl) {
            throw ApiRequestExecutor.apiError('API_URL_REQUIRED', ApiRequestExecutor.t('apiUrlRequired'));
        }
        if (!isHttpUrl(rawUrl)) {
            throw ApiRequestExecutor.apiError(
                'API_URL_PROTOCOL',
                ApiRequestExecutor.t('apiUrlProtocol'),
                { url: rawUrl }
            );
        }

        const url: string = ApiRequestExecutor.buildUrl(rawUrl, props.queryParams);
        const headers: { [name: string]: string } = ApiRequestExecutor.buildHeaders(props.headers);
        const init: RequestInit = {
            method: method,
            headers: headers,
            signal: signal,
            // Never send the page's cookies or HTTP auth: a shared or imported workflow must not
            // act as the signed-in user. Authentication comes from authRef or the request headers.
            credentials: 'omit'
        };

        // GET and DELETE must not carry a body (browsers/fetch may reject or corrupt the call).
        if (method !== 'GET' && method !== 'DELETE' && method !== 'HEAD') {
            const bodyPayload: { body?: string; contentType?: string } | null =
                ApiRequestExecutor.buildBody(props.bodyType, props.body);
            if (bodyPayload) {
                if (bodyPayload.contentType && !ApiRequestExecutor.hasHeader(headers, 'Content-Type')) {
                    headers['Content-Type'] = bodyPayload.contentType;
                }
                init.body = bodyPayload.body;
            }
        }

        let response: Response;
        try {
            response = await fetch(url, init);
        } catch (error) {
            // If the underlying fetch threw with its own message (CORS,
            // DNS, offline, ...) we surface it verbatim — it is a
            // technical token from the runtime, not a localized phrase.
            // Only the empty/fallback case is translated.
            throw ApiRequestExecutor.apiError(
                'API_NETWORK',
                error instanceof Error && error.message ? error.message : ApiRequestExecutor.t('networkRequestFailed', l10n),
                { url: url, method: method }
            );
        }

        const responseHeaders: { [name: string]: string } = {};
        response.headers.forEach((value: string, key: string) => {
            Object.defineProperty(responseHeaders, key, {
                configurable: true,
                enumerable: true,
                value: value,
                writable: true
            });
        });

        const body: unknown = await ApiRequestExecutor.readResponseBody(response, url, method, l10n);
        const result: ApiRequestExecutionResult = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: body,
            url: url,
            method: method
        };

        if (!response.ok) {
            throw ApiRequestExecutor.apiError(
                'API_HTTP_' + response.status,
                'HTTP ' + response.status + (response.statusText ? ' ' + response.statusText : ''),
                result
            );
        }

        return result;
    }

    /**
     * True when method should not include a request body.
     *
     * @param {object} method - HTTP method to inspect.
     * @returns {boolean} Whether the method must not include a request body.
     * @private
     */
    public static isBodylessMethod(method: unknown): boolean {
        const normalized: string = String(method || '').toUpperCase();
        return normalized === 'GET' || normalized === 'DELETE' || normalized === 'HEAD';
    }

    private static buildUrl(baseUrl: string, queryParams: unknown): string {
        const pairs: Array<{ key: string; value: string }> = ApiRequestExecutor.toPairs(queryParams);
        if (!pairs.length) {
            return baseUrl;
        }
        let url: URL;
        try {
            url = new URL(baseUrl);
        } catch {
            // Relative or malformed absolute URL — append query string manually.
            const query: string = pairs
                .map((pair: { key: string; value: string }) =>
                    encodeURIComponent(pair.key) + '=' + encodeURIComponent(pair.value))
                .join('&');
            if (!query) {
                return baseUrl;
            }
            return baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + query;
        }
        pairs.forEach((pair: { key: string; value: string }) => {
            url.searchParams.append(pair.key, pair.value);
        });
        return url.toString();
    }

    private static buildHeaders(headers: unknown): { [name: string]: string } {
        const result: { [name: string]: string } = {};
        ApiRequestExecutor.toPairs(headers).forEach((pair: { key: string; value: string }) => {
            if (pair.key) {
                result[pair.key] = pair.value;
            }
        });
        return result;
    }

    private static buildBody(
        bodyType: unknown,
        body: unknown
    ): { body: string; contentType?: string } | null {
        if (body === undefined || body === null || body === '') {
            return null;
        }
        const type: string = String(bodyType || 'Json');
        if (type === 'Text') {
            return { body: String(body), contentType: 'text/plain;charset=UTF-8' };
        }
        if (type === 'Expression') {
            // Expression is already resolved by the dispatcher; treat object as JSON, else text.
            if (typeof body === 'object') {
                return { body: JSON.stringify(body), contentType: 'application/json' };
            }
            return { body: String(body), contentType: 'text/plain;charset=UTF-8' };
        }
        // Json (default)
        if (typeof body === 'string') {
            const trimmed: string = body.trim();
            if (!trimmed) {
                return null;
            }
            // Keep valid JSON strings as-is; otherwise wrap as JSON string value.
            try {
                JSON.parse(trimmed);
                return { body: trimmed, contentType: 'application/json' };
            } catch {
                return { body: JSON.stringify(body), contentType: 'application/json' };
            }
        }
        return { body: JSON.stringify(body), contentType: 'application/json' };
    }

    /**
     * Reads the response text, failing with `API_RESPONSE_TOO_LARGE` once it exceeds
     * `MAX_RESPONSE_CHARS`, so a huge response can't freeze the page or bloat the run context.
     *
     * @param {Response} response The fetch response.
     * @param {string} url The request URL, for the error details.
     * @param {string} method The request method, for the error details.
     * @param {L10n} [l10n] The localization of the instance that started the request.
     * @returns {Promise<string>} The response text.
     */
    private static async readLimitedText(response: Response, url: string, method: string, l10n?: L10n): Promise<string> {
        const tooLarge: () => never = (): never => {
            throw ApiRequestExecutor.apiError('API_RESPONSE_TOO_LARGE', ApiRequestExecutor.t('apiResponseTooLarge', l10n), {
                url: url, method: method, limit: MAX_RESPONSE_CHARS
            });
        };
        const declared: number = Number(response.headers.get('content-length') || 0);
        if (declared > MAX_RESPONSE_CHARS * 4) {
            tooLarge();
        }
        const stream: ReadableStream<Uint8Array> | null = response.body;
        if (!stream || typeof stream.getReader !== 'function' || typeof TextDecoder === 'undefined') {
            const whole: string = await response.text();
            if (whole.length > MAX_RESPONSE_CHARS) {
                tooLarge();
            }
            return whole;
        }
        const reader: ReadableStreamDefaultReader<Uint8Array> = stream.getReader();
        const decoder: TextDecoder = new TextDecoder();
        let text: string = '';
        for (;;) {
            const chunk: ReadableStreamReadResult<Uint8Array> = await reader.read();
            if (chunk.done) {
                break;
            }
            text += decoder.decode(chunk.value, { stream: true });
            if (text.length > MAX_RESPONSE_CHARS) {
                void reader.cancel();
                tooLarge();
            }
        }
        return text + decoder.decode();
    }

    private static async readResponseBody(response: Response, url: string, method: string, l10n?: L10n): Promise<unknown> {
        const text: string = await ApiRequestExecutor.readLimitedText(response, url, method, l10n);
        if (!text) {
            return null;
        }
        const contentType: string = (response.headers.get('content-type') || '').toLowerCase();
        if (contentType.indexOf('application/json') !== -1 || contentType.indexOf('+json') !== -1) {
            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        }
        // Heuristic: parse JSON-looking payloads even without the header.
        const trimmed: string = text.trim();
        if (
            (trimmed.charAt(0) === '{' && trimmed.charAt(trimmed.length - 1) === '}')
            || (trimmed.charAt(0) === '[' && trimmed.charAt(trimmed.length - 1) === ']')
        ) {
            try {
                return JSON.parse(trimmed);
            } catch {
                return text;
            }
        }
        return text;
    }

    private static toPairs(value: unknown): Array<{ key: string; value: string }> {
        if (!value) {
            return [];
        }
        if (Array.isArray(value)) {
            return value
                .map((item: unknown) => {
                    if (!item || typeof item !== 'object') {
                        return null;
                    }
                    const record: Record<string, unknown> = item as Record<string, unknown>;
                    const key: unknown = record.key !== undefined ? record.key : record.name;
                    if (key === undefined || key === null || key === '') {
                        return null;
                    }
                    const raw: unknown = record.value;
                    return {
                        key: String(key),
                        value: ApiRequestExecutor.toRequestString(raw)
                    };
                })
                .filter((pair: { key: string; value: string } | null): pair is { key: string; value: string } => !!pair);
        }
        if (typeof value === 'object') {
            const record: Record<string, unknown> = value as Record<string, unknown>;
            return Object.keys(record).map((key: string) => ({
                key: key,
                value: ApiRequestExecutor.toRequestString(record[`${key}`])
            }));
        }
        return [];
    }

    private static toRequestString(value: unknown): string {
        if (value === undefined || value === null) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch (_error) {
                return String(value);
            }
        }
        return String(value);
    }

    private static hasHeader(headers: { [name: string]: string }, name: string): boolean {
        const target: string = name.toLowerCase();
        return Object.keys(headers).some((key: string) => key.toLowerCase() === target);
    }


    private static apiError(
        code: string,
        message: string,
        details?: unknown
    ): { type: string; code: string; message: string; details?: unknown } {
        return {
            type: 'ApiRequest',
            code: code,
            message: message,
            details: details
        };
    }
}

/**
 * Default English strings used when no L10n is wired in. Technical tokens
 * (`http://`, `https://`) and any underlying fetch error message are
 * preserved verbatim — only the empty/fallback prose is translated.
 *
 * @private
 */
/**
 * Largest response body, in characters, that an API Request step accepts (5 MB of text,
 * the same limit as workflow import).
 */
const MAX_RESPONSE_CHARS: number = 5 * 1024 * 1024;

