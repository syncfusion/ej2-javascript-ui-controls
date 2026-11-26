/**
 * Public Webhook Trigger API
 *
 * This module defines the transport-neutral interface for triggering workflows
 * through webhook messages. Customers own the transport layer (SignalR, WebSocket,
 * SSE, polling, custom) and call this public API to execute workflows.
 *
 * @internal
 */

import { WorkflowExecutionResult } from '../models/workflow-validation';

/**
 * Defines optional details of the HTTP request that delivered a webhook, for logging.
 */
export interface WorkflowWebhookRequestContext {
    /** HTTP method used for the webhook request (GET, POST, PUT, PATCH, DELETE) */
    method?: string;

    /** Relative path where webhook was received */
    path?: string;

    /** Request headers received with the webhook (sanitized - no auth headers) */
    headers?: Record<string, string>;

    /** Source IP address of the webhook request */
    sourceIp?: string;

    /** ISO 8601 timestamp when webhook was received */
    receivedAt?: string;
}

/**
 * Defines the message passed to `triggerWebhook`. Your backend receives the HTTP webhook, verifies
 * it (authentication, signature, authorization), and forwards this message to the page over its
 * own transport, such as SignalR, WebSocket or server-sent events.
 */
export interface WorkflowWebhookTriggerMessage {
    /** Unique workflow ID matching the loaded workflow */
    workflowId: string;

    /** Unique trigger step ID matching a WebhookTrigger step in the workflow */
    triggerId: string;

    /** Event ID assigned by the backend or transport layer (for correlation/deduplication) */
    eventId?: string;

    /** Execution ID assigned by the backend or transport layer (for tracing) */
    executionId?: string;

    /** Request payload/body from the webhook HTTP call */
    payload?: unknown;

    /** HTTP method used (GET, POST, PUT, PATCH, DELETE) */
    method?: string;

    /** Relative path where webhook was received */
    path?: string;

    /** Request context for audit/logging */
    context?: WorkflowWebhookRequestContext;

    /** ISO 8601 timestamp when webhook was received */
    receivedAt?: string;
    /**
     * Set to `true` by the host after it has verified the request against the
     * trigger's `authMode` (signature, API key, bearer token...). Required when
     * the WebhookTrigger step's `authMode` is anything other than `'None'`.
     */
    authenticated?: boolean;
}

/**
 * Public API contract for triggering workflows via webhooks.
 *
 * Implementations must:
 * 1. Validate that workflowId matches the loaded workflow
 * 2. Find the matching WebhookTrigger step by triggerId
 * 3. Execute the workflow from that step with the webhook payload
 * 4. Return the execution result or throw an error
 *
 * @internal
 */
export interface IWorkflowWebhookTrigger {
    /**
     * Triggers a workflow execution from a WebhookTrigger step using an incoming webhook message.
     *
     * This is the transport-neutral public API. Customers own the transport and must:
     * - Validate HTTP method, authentication, and authorization
     * - Call this method with the validated webhook message
     * - Handle the returned WorkflowExecutionResult or error
     *
     * Examples:
     *
     * ```typescript
     * // Customer-owned SignalR transport
     * connection.on('WorkflowWebhookTriggered', async (message) => {
     *     try {
     *         const result = await designer.triggerWebhook(message);
     *         console.log('Execution completed:', result);
     *     } catch (error) {
     *         console.error('Webhook trigger failed:', error);
     *     }
     * });
     *
     * // Customer-owned WebSocket transport
     * socket.on('webhook-triggered', async (message) => {
     *     try {
     *         const result = await designer.triggerWebhook(message);
     *     } catch (error) {
     *         // Handle error
     *     }
     * });
     *
     * // Customer-owned polling transport
     * const result = await designer.triggerWebhook({
     *     workflowId: 'expense-workflow',
     *     triggerId: 'trigger1',
     *     payload: { expenseId: '123', amount: 500 },
     *     method: 'POST',
     *     path: 'expenses/created',
     *     receivedAt: new Date().toISOString()
     * });
     * ```
     *
     * The returned promise rejects with a `WorkflowError`; see `WorkflowDesigner.triggerWebhook`
     * for the error codes.
     *
     * @param {WorkflowWebhookTriggerMessage} message - The webhook trigger message.
     * @returns {Promise<WorkflowExecutionResult>} The run result.
     */
    triggerWebhook(message: WorkflowWebhookTriggerMessage): Promise<WorkflowExecutionResult>;
}
