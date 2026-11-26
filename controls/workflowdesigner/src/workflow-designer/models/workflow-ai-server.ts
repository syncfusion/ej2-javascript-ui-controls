/**
 * Defines the JSON body that AI steps and AI Assist post to your server in `'Server'` mode
 * (the AI step's `serverUrl`, or `aiAssistSettings.server.url`). Your server calls the AI provider
 * with its own key and replies with a `WorkflowAIServerResponse`.
 *
 * Headers added to the request in the `beforeRequestSend` event (for example an `Authorization`
 * header) are sent with the post.
 *
 * @private
 */
export interface WorkflowAIServerRequest {
    /** The provider configured on the AI step, if any. Your server may ignore it. */
    provider?: string;
    /** The model configured on the AI step, if any. Your server may ignore it. */
    model?: string;
    /** The combined prompt with system and user instructions: "System: ...\n\nUser: ...". */
    promptQuery: string;
    /** Conversation history: prior messages with `role` ('user' or 'assistant') and `content`. */
    memoryMessages?: Array<{ role: string; content: string }>;
    /** The format the response should use: `'Text'`, `'JSON'` or `'Markdown'`. */
    responseFormat: string;
    /** For JSON output, the fields the response should contain. */
    desiredFields: Array<{ name: string; type?: string; description?: string }>;
    /** The run's context, sent only when the AI step's `includeContext` is true. */
    context?: unknown;
}

/**
 * Defines the JSON reply your server returns to a `WorkflowAIServerRequest`. Return `content` for
 * structured (JSON) output, `text` for plain text, or both. On failure, return a non-2xx status with
 * `{ "error": "message" }` or `{ "error": { "message": "..." } }`; the step fails with code
 * `AI_HTTP_<status>` and that message.
 *
 * @private
 */
export interface WorkflowAIServerResponse {
    /** The response as text. */
    text?: string;
    /** The structured response, for JSON output. */
    content?: unknown;
    /** The format of the response, when it differs from the requested one. */
    outputFormat?: string;
    /** The provider that answered, for display in the execution log. */
    provider?: string;
    /** The model that answered, for display in the execution log. */
    model?: string;
}
