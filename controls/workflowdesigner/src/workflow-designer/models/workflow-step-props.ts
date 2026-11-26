/**
 * Typed `props` contracts for each workflow step type.
 */

import {
    WorkflowApprovalDecision,
    WorkflowAuthMode,
    WorkflowConditionLogic,
    WorkflowBodyType,
    WorkflowDelayTimeUnit,
    WorkflowDelayType,
    WorkflowFormatterFormat,
    WorkflowFormatterInputSource,
    WorkflowHttpMethod,
    WorkflowIntervalUnit,
    WorkflowNotifyWebhookMethod,
    WorkflowResponseMode,
    WorkflowScheduleType,
    WorkflowSortDirection,
    WorkflowVariableOperator,
    WorkflowVariableValueType
} from './workflow-enums';
import { ConditionRule } from './workflow-shared-types';
import { KeyValue } from './workflow-shared-types';
import { WorkflowInputFieldModel } from './workflow-shared-types';
import { WorkflowOutputFieldModel } from './workflow-shared-types';


/**
 * Scheduled Trigger start step props.
 *
 * @private
 */
export interface ScheduledTriggerStepProps {
    scheduleType: WorkflowScheduleType;
    startDateTime?: Date | string;
    interval?: number;
    intervalUnit?: WorkflowIntervalUnit;
    endDateTime?: Date | string;
    maxOccurrences?: number;
    cronExpression?: string;
    /** IANA time zone for the schedule. Defaults to `'UTC'`. */
    timeZone?: string;
}

/**
 * Webhook Trigger start step props. Defines the webhook endpoint contract.
 *
 * This interface stores the configuration that a workflow author defines for a webhook trigger.
 * The Workflow Designer UI allows users to specify HTTP method, path, and authentication requirements.
 * Actual enforcement of these requirements (method validation, authentication, authorization)
 * is handled exclusively by the backend before the event reaches the browser runtime.
 *
 * ## Frontend Configuration Role
 *
 * The Workflow Designer allows users to define:
 * - `method`: HTTP method the endpoint accepts (GET, POST, PUT, PATCH, DELETE)
 * - `path`: Relative URL path for this webhook (e.g., "expenses/created")
 * - `authMode`: Authentication strategy (None, Basic, ApiKeyHeader, Bearer, HmacSha256, Custom)
 * - `authRef`: Reference to backend authentication configuration (never a secret)
 * - `payloadSchema`: Schema describing expected webhook payload structure
 * - `responseMode`: Whether to respond immediately (Immediate only in v1) or after processing
 * - `responseCode`: HTTP status code for webhook response
 * - `responseBody`: Optional response body template
 *
 * ## Backend Enforcement Role
 *
 * The backend:
 * - Maps the configured `path` to this workflow and trigger
 * - Validates incoming HTTP `method` matches the configured method; returns 405 if mismatch
 * - Enforces `authMode` (Basic, Bearer, ApiKeyHeader, HmacSha256, or Custom)
 * - Looks up secrets/credentials using `authRef`; rejects unauthorized requests with 401/403
 * - Validates payload against `payloadSchema` if strict validation is enabled
 * - Returns appropriate HTTP status code and response body
 * - Forwards the event to the page (through any transport, such as SignalR or WebSocket) only after
 *   authentication and validation succeed, where the host calls `triggerWebhook()`
 *
 * ## Transport Configuration (Not Stored Here)
 *
 * The workflow does NOT store:
 * - Transport endpoints such as a SignalR hub URL (part of the host application, not the workflow)
 * - Workflow ID (part of component configuration, not workflow definition)
 * - Deployment environment settings (belong in app config)
 *
 * The host owns the transport and passes each verified message to `triggerWebhook()`:
 * ```typescript
 * const designer = new WorkflowDesigner({ workflowId: 'expense-workflow' });
 * connection.on('WorkflowWebhookTriggered', (message) => designer.triggerWebhook(message));
 * ```
 *
 * ## Example Workflow Definition
 *
 * ```json
 * {
 *   "id": "webhookTrigger",
 *   "stepType": "WebhookTrigger",
 *   "props": {
 *     "method": "POST",
 *     "path": "expenses/created",
 *     "authMode": "ApiKeyHeader",
 *     "authRef": "expense-webhook-key",
 *     "responseMode": "Immediate",
 *     "responseCode": 202,
 *     "payloadSchema": [...]
 *   }
 * }
 * ```
 *
 * ## Backend Configuration Reference
 *
 * The backend uses `authRef` to look up secrets:
 * ```json
 * {
 *   "WebhookCredentials": {
 *     "expense-webhook-key": {
 *       "Type": "ApiKeyHeader",
 *       "HeaderName": "X-Webhook-Key",
 *       "SecretRef": "expense-webhook-secret"
 *     }
 *   }
 * }
 * ```
 *
 * The secret itself is stored securely (environment variable, Key Vault, Secrets Manager).
 *
 * @private
 */
export interface WebhookTriggerStepProps {
    /**
     * HTTP method that the webhook endpoint accepts.
     * Supported values: GET, POST, PUT, PATCH, DELETE.
     *
     * Backend validates that the incoming HTTP request method matches this value.
     * Requests with mismatched methods are rejected with 405 Method Not Allowed.
     * Required field.
     */
    method: WorkflowHttpMethod;

    /**
     * Relative URL path for the webhook endpoint.
     * Example: "expenses/created" or "orders/{id}/webhook"
     *
     * Should be URL-safe (alphanumeric, forward slashes, hyphens, underscores, curly braces).
     * Frontend normalizes by removing leading/trailing slashes.
     * Backend maps this path to trigger location.
     *
     * Not the full URL:
     * ❌ "https://api.example.com/webhooks/expenses"
     * ✓ "expenses"
     * ✓ "orders/created"
     * ✓ "integrations/slack/events"
     *
     * Required field.
     */
    path: string;

    /**
     * Authentication strategy enforced by the backend for incoming webhook requests.
     * Supported values: None, Basic, ApiKeyHeader, Bearer, HmacSha256, Custom.
     * Default: None
     *
     * - `None`: No authentication required.
     * - `Basic`: HTTP Basic Authentication (Authorization: Basic <base64>).
     * - `ApiKeyHeader`: Custom header with API key (authRef specifies credential ID, authHeaderName specifies header).
     * - `Bearer`: Bearer token (Authorization: Bearer <token>, authRef specifies credential ID).
     * - `HmacSha256`: HMAC-SHA256 signature (authRef specifies credential ID, authSignatureHeaderName specifies signature header).
     * - `Custom`: Delegated to custom authentication handler.
     *
     * Frontend stores only the mode; backend handles validation.
     * Optional field (defaults to None).
     */
    authMode?: WorkflowAuthMode;

    /**
     * Reference to authentication credential configuration.
     * This identifies WHICH credential to use, not the credential itself or its header name.
     *
     * Examples:
     * - "expense-webhook-api-key" → backend looks up this credential in store
     * - "slack-verification-token" → backend retrieves this credential
     *
     * Frontend must never store actual secrets here.
     * ✓ authRef: "expense-webhook-credential"
     *
     * Required if authMode is not 'None'.
     * Optional field (only needed when authMode is set).
     */
    authRef?: string;

    /**
     * HTTP header name for ApiKeyHeader authentication mode.
     * Only meaningful when authMode === 'ApiKeyHeader'.
     *
     * Examples:
     * - "X-API-Key"
     * - "X-Webhook-Key"
     * - "Authorization" (not recommended - use Bearer mode instead)
     *
     * Backend uses this header name when validating incoming requests.
     * Frontend displays this in property panel only when authMode is 'ApiKeyHeader'.
     *
     * Optional field (only needed when authMode === 'ApiKeyHeader').
     */
    authHeaderName?: string;

    /**
     * HTTP header name for HMAC-SHA256 signature.
     * Only meaningful when authMode === 'HmacSha256'.
     *
     * Examples:
     * - "X-Webhook-Signature"
     * - "X-Hub-Signature"
     * - "X-Signature-Sha256"
     *
     * Backend uses this header name when computing and validating HMAC signatures.
     * Frontend displays this in property panel only when authMode is 'HmacSha256'.
     *
     * Optional field (only needed when authMode === 'HmacSha256').
     */
    authSignatureHeaderName?: string;

    /**
     * HTTP response mode for the webhook request.
     * Supported values: Immediate, LastNode (LastNode not fully supported in v1).
     * Default: Immediate
     *
     * - `Immediate`: Return HTTP response immediately (202 Accepted).
     *   Workflow executes asynchronously. Best for most use cases.
     * - `LastNode`: Not reliably supported yet. Scheduled for v2 with server-side execution.
     *
     * For v1, only Immediate is recommended.
     * Optional field (defaults to Immediate).
     */
    responseMode?: WorkflowResponseMode;

    /**
     * HTTP status code for webhook response.
     * Common values: 200, 202, 204, 400, 401, 403, 500.
     * Default: 202 (Accepted)
     *
     * - 202 (Accepted): Recommended. Indicates async processing.
     * - 200 (OK): Use only if response body contains meaningful data.
     *
     * Optional field (defaults to 202).
     */
    responseCode?: number;

    /**
     * Optional response body to return in webhook HTTP response.
     * Example:
     * ```json
     * {
     *   "status": "accepted",
     *   "executionId": "{executionId}",
     *   "workflowId": "{workflowId}"
     * }
     * ```
     *
     * Supports template variables:
     * - {executionId}: Unique ID for this webhook execution
     * - {workflowId}: Workflow identifier
     * - {triggerId}: Trigger step identifier
     * - {receivedAt}: ISO 8601 timestamp
     *
     * Optional field.
     */
    responseBody?: unknown;

    /**
     * Schema definition describing expected webhook payload structure.
     * Defines fields that external systems should send in the request body.
     *
     * Used by:
     * - Frontend: Display in property panel, used for data mapping hints
     * - Backend: Optionally validate payload structure
     * - Workflow: Reference fields in subsequent steps via $.input.response.fieldName
     *
     * Example:
     * ```typescript
     * [
     *   { name: 'expenseId', type: 'string', required: true },
     *   { name: 'amount', type: 'number', required: true },
     *   { name: 'description', type: 'string' }
     * ]
     * ```
     *
     * Optional field.
     */
    payloadSchema?: WorkflowInputFieldModel[];
}

/**
 * Form Input Trigger start step props. Stores submitted values in
 * `$.input.response`.
 *
 * @private
 */
export interface FormInputTriggerStepProps {
    formTitle?: string;
    fields: WorkflowInputFieldModel[];
}

/**
 * A single variable assignment for the Set Variable step.
 *
 * @private
 */
export interface WorkflowVariableAssignment {
    variableName: string;
    value?: unknown;
    /** How `value` is interpreted. Defaults to `'Auto'`. */
    valueType?: WorkflowVariableValueType;
    isMathOperation?: boolean;
    firstValue?: unknown;
    secondValue?: unknown;
    operator?: WorkflowVariableOperator;
}

/**
 * Set Variable step props. Creates reusable values only under `$.variables`
 * without modifying input context or the payload passed between nodes.
 *
 * @private
 */
export interface SetVariableStepProps {
    variables: WorkflowVariableAssignment[];
}

/**
 * Filter step props.
 *
 * @private
 */
export interface FilterStepProps {
    itemsPath: string;
    conditions: ConditionRule[];
    conditionLogic?: WorkflowConditionLogic;
}

/**
 * Sort step props.
 *
 * @private
 */
export interface SortStepProps {
    itemsPath: string;
    sortBy: string;
    sortDirection: WorkflowSortDirection;
}

/**
 * API Request step props. Execution is delegated to the host application.
 *
 * @private
 */
export interface ApiRequestStepProps {
    method: WorkflowHttpMethod;
    url: string;
    headers?: KeyValue[];
    queryParams?: KeyValue[];
    bodyType?: WorkflowBodyType;
    body?: unknown;
    authRef?: string;
}

/**
 * Delay step props.
 *
 * @private
 */
export interface DelayStepProps {
    delayType: WorkflowDelayType;
    duration?: number;
    timeUnit?: WorkflowDelayTimeUnit;
    untilDateTime?: Date | string;
    /** IANA time zone for `untilDateTime` without an offset. Defaults to `'UTC'`. */
    timeZone?: string;
    dynamicCondition?: ConditionRule[];
    dynamicConditionLogic?: WorkflowConditionLogic;
    dynamicDuration?: number;
    dynamicTimeUnit?: WorkflowDelayTimeUnit;
}

/**
 * Condition step props.
 *
 * @private
 */
export interface ConditionStepProps {
    conditions: ConditionRule[];
    conditionLogic?: WorkflowConditionLogic;
}

/**
 * A single branch rule for the Switch step.
 *
 * @private
 */
export interface BranchRule {
    branchName: string;
    condition: ConditionRule;
}

/**
 * Switch step props.
 *
 * No-match behaviour is fixed: the Switch always falls through to the named
 * `defaultBranch` port when no configured branch matches. The legacy
 * `noMatchBehavior` switch (`Fail` / `CompletePath` / `DefaultBranch`) has been
 * removed; existing JSON files that still carry the key are accepted as
 * inert props and ignored at runtime.
 *
 * @private
 */
export interface SwitchStepProps {
    branches: BranchRule[];
    /**
     * Port name used when no configured branch matches. When unset, the
     * default port is named `default`. First-match wins across branches.
     */
    defaultBranch?: string;
}

/**
 * Loop step props.
 *
 * @private
 */
export interface LoopStepProps {
    /**
     * Path to the items. A list loops over each item; a single value is treated as a one-item
     * list; a missing or null value loops zero times and logs a warning.
     */
    itemsPath: string;
    itemFields?: WorkflowOutputFieldModel[];
    maxIterations?: number;
}

/**
 * A reviewer reference for the Approve step. The host application resolves
 * user/role/group references into actual approvers; `Email` is sent directly
 * to the address. Expression-style review routing is supported through
 * templated `value` (e.g. `'{{$.input.response.managerEmail}}'`).
 *
 * @private
 */
export interface ReviewerRef {
    type: 'User' | 'Role' | 'Group' | 'Email';
    value: string;
}

/**
 * A single read-only row the reviewer sees in the approval popup.
 * Replaces the legacy `ReviewContentField` and `contentToReview` shape so
 * authors can dynamically compose any request from expressions — no fixed
 * host-side schema required.
 *
 * @private
 */
export interface ApprovalRequestField {
    /** Display label (e.g. "Amount", "Customer name"). */
    label: string;
    /**
     * Expression-capable value (e.g. `"{{$.input.response.amount}}"`) shown
     * in the approval popup. Resolved at popup-open time against the
     * current runtime context.
     */
    value: string;
}

/**
 * An approval decision result returned by the popup or by the host's
 * `approvalRequested` event.
 *
 * @private
 */
export interface ApprovalDecisionResult {
    decision: WorkflowApprovalDecision;
    comments?: string;
    reviewedBy?: string;
    reviewedAt?: Date | string;
}

/**
 * Approve step props.
 *
 * Competitor-aligned (Zapier Approvals / Activepieces / Make) shape: a
 * human-readable ask, a list of dynamic detail rows the reviewer sees, and
 * the list of reviewers. Each reviewer decides independently; the host
 * approval backend (Slack, Teams, email, custom) is responsible for
 * routing, aggregation and reminders. Step-level timeout / due-date /
 * escalation are intentionally omitted — they belong to the workflow-level
 * `errorSettings` (or to the host approval backend), not to a per-step
 * JSON payload the author has to hand-edit. `taskId` and `resumeToken`
 * are host implementation details and must never be authored.
 *
 * @private
 */
export interface ApproveStepProps {
    reviewers: ReviewerRef[];
    requestMessage: string;
    requestFields: ApprovalRequestField[];
}

/**
 * Email Notify props.
 *
 * @private
 */
export interface EmailNotifyProps {
    channel: 'Email';
    to: string;
    cc?: string[] | string;
    subject?: string;
    message: string;
}

/**
 * SMS Notify props.
 *
 * @private
 */
export interface SmsNotifyProps {
    channel: 'SMS';
    phoneNumber: string;
    message: string;
}

/**
 * Push Notify props.
 *
 * @private
 */
export interface PushNotifyProps {
    channel: 'Push';
    deviceToken?: string;
    userId?: string;
    subject?: string;
    message: string;
}

/**
 * Teams Notify props.
 *
 * @private
 */
export interface TeamsNotifyProps {
    channel: 'Teams';
    channelId: string;
    mentionUsers?: string[] | string;
    subject?: string;
    message: string;
}

/**
 * Slack Notify props.
 *
 * @private
 */
export interface SlackNotifyProps {
    channel: 'Slack';
    channelId: string;
    mentionUsers?: string[] | string;
    subject?: string;
    message: string;
}

/**
 * Webhook Notify props.
 *
 * @private
 */
export interface WebhookNotifyProps {
    channel: 'Webhook';
    webhookUrl: string;
    method?: WorkflowNotifyWebhookMethod;
    headers?: KeyValue[];
    body?: unknown;
    message: string;
}

/**
 * Custom Notify props.
 *
 * @private
 */
export interface CustomNotifyProps {
    channel: 'Custom';
    target: string;
    subject?: string;
    message: string;
}

/**
 * Notify step props discriminated by channel.
 *
 * @private
 */
export type NotifyStepProps =
    | EmailNotifyProps
    | SmsNotifyProps
    | PushNotifyProps
    | TeamsNotifyProps
    | SlackNotifyProps
    | WebhookNotifyProps
    | CustomNotifyProps;

/**
 * AI step props. The step raises `beforeRequestSend`, calls the provider (or `serverUrl`) and
 * stores its result in `$.previousStep.response` and `$.nodes.<stepId>.response`.
 *
 * @private
 */
export interface AIStepProps {
    provider: string;
    model: string;
    credential?: string;
    /**
     * The name of a credential the host resolves through `credentialRequested`. Exported with
     * the workflow.
     */
    credentialRef?: string;
    /**
     * The raw API key used when `executionSettings.credentialMode` is `'Inline'` (development only).
     * It is never written to exported workflow JSON.
     */
    apiKey?: string;
    systemPrompt?: string;
    prompt: string;
    outputFormat: 'Text' | 'JSON' | 'Markdown';
    responseFields?: WorkflowOutputFieldModel[];
    // Memory configuration
    memoryEnabled?: boolean;
    memoryHistorySize?: number;
    sessionKey?: string;
    /** Server endpoint used when `executionSettings.credentialMode` is `'Reference'`. */
    serverUrl?: string;
    /** Seconds the step may run before it fails with a timeout. Defaults to 30. */
    timeoutSeconds?: number;
}

/**
 * Formatter step props.
 *
 * @private
 */
export interface FormatterStepProps {
    inputSource: WorkflowFormatterInputSource;
    sourcePath?: string;
    format: WorkflowFormatterFormat;
}

/**
 * End step props.
 *
 * @private
 */
export interface EndStepProps {
    endMessage?: string;
}

/**
 * Host-executed custom action step props.
 *
 * @private
 */
export interface CustomStepProps {
    actionType: string;
    input?: unknown;
    outputFields?: WorkflowOutputFieldModel[];
}




/**
 * Properties of a Manual Trigger step. It has no settings; the run's input is the
 * context passed to `runExecution`.
 *
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ManualTriggerStepProps {
}

/**
 * Maps each step type to its properties interface.
 *
 * @private
 */
export interface WorkflowStepPropsMap {
    /** Settings of a Manual Trigger step. */
    ManualTrigger: ManualTriggerStepProps;
    /** Settings of a Scheduled Trigger step. */
    ScheduledTrigger: ScheduledTriggerStepProps;
    /** Settings of a Webhook Trigger step. */
    WebhookTrigger: WebhookTriggerStepProps;
    /** Settings of a Form Input Trigger step. */
    FormInputTrigger: FormInputTriggerStepProps;
    /** Settings of a Set Variable step. */
    SetVariable: SetVariableStepProps;
    /** Settings of a Filter step. */
    Filter: FilterStepProps;
    /** Settings of a Sort step. */
    Sort: SortStepProps;
    /** Settings of an API Request step. */
    ApiRequest: ApiRequestStepProps;
    /** Settings of a Delay step. */
    Delay: DelayStepProps;
    /** Settings of a Condition step. */
    Condition: ConditionStepProps;
    /** Settings of a Switch step. */
    Switch: SwitchStepProps;
    /** Settings of a Loop step. */
    Loop: LoopStepProps;
    /** Settings of an Approve step. */
    Approve: ApproveStepProps;
    /** Settings of a Notify step. */
    Notify: NotifyStepProps;
    /** Settings of an AI step. */
    AI: AIStepProps;
    /** Settings of a Formatter step. */
    Formatter: FormatterStepProps;
    /** Settings of a Custom step. */
    Custom: CustomStepProps;
    /** Settings of an End step. */
    End: EndStepProps;
}

/**
 * Properties of any step type.
 *
 * @private
 */
export type WorkflowStepProps = WorkflowStepPropsMap[keyof WorkflowStepPropsMap];
