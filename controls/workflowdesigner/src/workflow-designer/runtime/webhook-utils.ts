/**
 * Webhook Trigger utilities for path validation, normalization, and contract enforcement.
 *
 * @private
 */

/**
 * Normalizes a webhook path by removing leading/trailing slashes and whitespace.
 *
 * Examples:
 * - "/expenses/created/" → "expenses/created"
 * - "  /orders/webhook  " → "orders/webhook"
 * - "products" → "products"
 *
 * @param {string} path - The path to normalize.
 * @returns {string} Normalized path without leading/trailing slashes or whitespace.
 * @private
 */
export function normalizeWebhookPath(path: string): string {
    return path
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

/**
 * Validates a webhook path and returns an error message if invalid.
 *
 * Rules:
 * - Must be non-empty (after trimming)
 * - Cannot contain query strings (?)
 * - Cannot contain fragments (#)
 * - Cannot contain parent path segments (..)
 * - Must match pattern: alphanumeric, forward slashes, hyphens, underscores, curly braces (for placeholders)
 * - Cannot contain spaces or special characters
 *
 * Examples:
 * - "expenses/created" → valid
 * - "orders/{id}/webhook" → valid (supports placeholders)
 * - "products_list" → valid
 * - "integrations/slack-events" → valid
 * - "" → invalid (required)
 * - "/expenses?foo=bar" → invalid (query string)
 * - "../../secret" → invalid (parent segments)
 * - "api.example.com/webhook" → invalid (domain not allowed)
 *
 * @param {string} path - The path to validate.
 * @returns {string | undefined} Error message if invalid, undefined if valid.
 * @private
 */
export function validateWebhookPath(path: string): string | undefined {
    const normalized: string = normalizeWebhookPath(path);

    if (!normalized) {
        return 'Webhook path is required.';
    }

    if (normalized.includes('?')) {
        return 'Webhook path cannot contain a query string (?).';
    }

    if (normalized.includes('#')) {
        return 'Webhook path cannot contain a fragment (#).';
    }

    if (normalized.includes('..')) {
        return 'Webhook path cannot contain parent path segments (..).';
    }

    // Allow: alphanumeric, forward slashes, hyphens, underscores, dots, curly braces (for placeholders)
    if (!/^[a-zA-Z0-9/_{}.-]+$/.test(normalized)) {
        return 'Webhook path contains unsupported characters. Use alphanumeric, slashes, hyphens, underscores, and dots only.';
    }

    return undefined;
}

/**
 * Webhook contract for messages passed between backend and frontend.
 * Replaces the old WorkflowWebhookMessage to clarify the flow and remove
 * transport-specific fields from the node props.
 *
 * @private
 */
export interface WebhookTriggerContract {
    /** Unique event ID assigned by the backend */
    eventId?: string;

    /** Unique execution ID assigned by the backend */
    executionId?: string;

    /** Workflow ID (from component config, not node props) */
    workflowId: string;

    /** Trigger step ID */
    triggerId: string;

    /** Webhook request payload */
    payload?: unknown;

    /** Request context (for logging/display) */
    request?: {
        method?: string;
        path?: string;
        headers?: Record<string, string>;
        query?: Record<string, string>;
    };

    /** ISO 8601 timestamp when webhook was received */
    receivedAt?: string;
}
