/**
 * Public string-literal types used by the Workflow Designer API.
 */

/**
 * Defines the types of workflow steps. A step with an unknown type is displayed with a default shape.
 */
export type WorkflowStepType =
    | 'ManualTrigger'
    | 'ScheduledTrigger'
    | 'WebhookTrigger'
    | 'FormInputTrigger'
    | 'SetVariable'
    | 'Filter'
    | 'Sort'
    | 'ApiRequest'
    | 'Delay'
    | 'Condition'
    | 'Switch'
    | 'Loop'
    | 'Approve'
    | 'Notify'
    | 'AI'
    | 'Formatter'
    | 'Custom'
    | 'End';

/**
 * Defines the shape of a connection's line: straight, orthogonal (right-angled) or Bezier (curved).
 */
export type WorkflowConnectionType = 'Straight' | 'Orthogonal' | 'Bezier';

/**
 * Defines the shape drawn at the end of a connection.
 *
 * @private
 */
export type WorkflowConnectionDecorator =
    | 'None'
    | 'Arrow'
    | 'OpenArrow'
    | 'Circle'
    | 'Diamond';

/**
 * Defines the active canvas tool: single selection, multiple selection, or zooming and panning.
 */
export type WorkflowTool = 'SingleSelection' | 'MultiSelection' | 'ZoomPan';

/**
 * Flowchart orientation for automatic workflow layout.
 *
 * @private
 */
export type WorkflowLayoutOrientation = 'TopToBottom' | 'LeftToRight';

/**
 * Defines the commands that can be shown in the top toolbar.
 */
export type WorkflowToolbarItem =
    | 'Undo'
    | 'Redo'
    | 'Layout'
    | 'Execute'
    | 'Lock'
    | 'Export'
    | 'Import';

/**
 * Defines the commands that can be shown in the floating canvas toolbar.
 */
export type WorkflowCanvasToolbarItem =
    | 'Add'
    | 'Select'
    | 'Pan'
    | 'StickyNote'
    | 'ZoomOut'
    | 'ZoomIn'
    | 'Fit'
    | 'ResetZoom'
    | 'Clear';

/**
 * Node handle action items.
 *
 * @private
 */
export type WorkflowNodeHandleItem = 'Delete' | 'Execute' | 'Add';

/**
 * Connector handle action items.
 *
 * @private
 */
export type WorkflowConnectorHandleItem = 'Add' | 'Delete';

/**
 * Context menu command items.
 *
 * @private
 */
export type WorkflowContextMenuItem =
    | 'Execute'
    | 'Delete'
    | 'AddNextStep'
    | 'Copy'
    | 'Paste'
    | 'Replace';

/**
 * Defines the state of a workflow run, as reported by `executionState` and the execution events:
 * `'Idle'`, `'Scheduled'`, `'Running'`, `'WaitingForHuman'`, `'Completed'`, `'Failed'`, `'Stopped'`
 * or `'Cancelled'`.
 *
 * @private
 */
export type WorkflowExecutionState =
    | 'Idle'
    | 'Scheduled'
    | 'Running'
    | 'WaitingForHuman'
    | 'Completed'
    | 'Failed'
    | 'Stopped'
    | 'Cancelled';

/**
 * Defines the final status of a run.
 */
export type WorkflowExecutionStatus = 'Completed' | 'Stopped' | 'Failed' | 'Cancelled';

/**
 * Defines the categories of errors that can occur during a run or an AI Assist request.
 */
export type WorkflowExecutionErrorType =
    | 'Validation'
    | 'Timeout'
    | 'ApiRequest'
    | 'AI'
    | 'Notify'
    | 'Approval'
    | 'Custom'
    | 'Expression'
    | 'Runtime';

/**
 * Defines the severity of a validation message. Only errors make the workflow invalid.
 */
export type WorkflowValidationMessageType = 'Error' | 'Warning' | 'Info';

/**
 * AI Assist mode.
 *
 * @private
 */
export type WorkflowAIAssistMode = 'CreateNew' | 'UpdateCurrent';

/**
 * AI Assist response output format.
 *
 * @private
 */
export type WorkflowAIAssistOutputFormat = 'Text' | 'JSON' | 'Markdown';

/**
 * Formatter output format.
 *
 * @private
 */
export type WorkflowFormatterFormat = 'Text' | 'JSON' | 'Markdown' | 'Table';

/**
 * Input field type.
 *
 * @private
 */
export type WorkflowInputFieldType =
    | 'TextBox'
    | 'TextArea'
    | 'Number'
    | 'Date'
    | 'Password'
    | 'Email'
    | 'DropDown'
    | 'CheckBoxes'
    | 'RadioButton';

/**
 * Condition value type.
 *
 * @private
 */
export type WorkflowConditionValueType =
    | 'String'
    | 'Array'
    | 'Number'
    | 'Date'
    | 'Boolean';

/**
 * Condition operator.
 *
 * @private
 */
export type WorkflowConditionOperator =
    | 'Equal'
    | 'NotEqual'
    | 'Contains'
    | 'NotContains'
    | 'StartsWith'
    | 'NotStartsWith'
    | 'EndsWith'
    | 'NotEndsWith'
    | 'MatchesRegex'
    | 'NotMatchesRegex'
    | 'IsEmpty'
    | 'IsNotEmpty'
    | 'ArrayContains'
    | 'ArrayNotContains'
    | 'LengthEqual'
    | 'LengthNotEqual'
    | 'LengthGreaterThan'
    | 'LengthLessThan'
    | 'GreaterThan'
    | 'GreaterThanOrEqual'
    | 'LessThan'
    | 'LessThanOrEqual'
    | 'Before'
    | 'BeforeOrEqual'
    | 'After'
    | 'AfterOrEqual'
    | 'IsTrue'
    | 'IsFalse';

/**
 * Condition logic combinator.
 *
 * @private
 */
export type WorkflowConditionLogic = 'AND' | 'OR';

/**
 * Set Variable operator.
 *
 * @private
 */
export type WorkflowVariableOperator =
    | 'Add'
    | 'Subtract'
    | 'Multiply'
    | 'Divide'
    | 'Modulo'
    | 'Percentage'
    | 'GreaterThan'
    | 'LessThan'
    | 'GreaterThanOrEqual'
    | 'LessThanOrEqual'
    | 'StrictEqual';

/**
 * How a Set Variable value is interpreted.
 * - `Auto` (default): literals that look like numbers, booleans, null, arrays or objects are converted.
 * - `String`: the value is kept as text, so `"00123"` and `"true"` stay strings.
 * - `Number`, `Boolean`: converted, and the step fails if the value can't be.
 * - `Json`: parsed as JSON, and the step fails if it isn't valid.
 *
 * @private
 */
export type WorkflowVariableValueType = 'Auto' | 'String' | 'Number' | 'Boolean' | 'Json';

/**
 * Defines the order in which a Sort step arranges items: `'Ascending'` (smallest first) or
 * `'Descending'` (largest first).
 *
 * @private
 */
export type WorkflowSortDirection = 'Ascending' | 'Descending';

/**
 * Delay type.
 *
 * @private
 */
export type WorkflowDelayType = 'Fixed' | 'Until' | 'Dynamic';

/**
 * Delay time unit.
 *
 * @private
 */
export type WorkflowDelayTimeUnit = 'Seconds' | 'Minutes' | 'Hours' | 'Days';

/**
 * Approval decision result.
 *
 * @private
 */
export type WorkflowApprovalDecision = 'approved' | 'declined';

/**
 * Reviewer reference type.
 *
 * @private
 */
export type WorkflowReviewerType = 'User' | 'Role' | 'Group' | 'Email' | 'Expression';

/**
 * Notify channel.
 *
 * @private
 */
export type WorkflowNotifyChannel =
    | 'Email'
    | 'SMS'
    | 'Push'
    | 'Teams'
    | 'Slack'
    | 'Webhook'
    | 'Custom';

/**
 * Workflow output field type.
 *
 * @private
 */
export type WorkflowOutputFieldType =
    | 'String'
    | 'Number'
    | 'Boolean'
    | 'Array'
    | 'Object'
    | 'Json';

/**
 * Formatter input source.
 *
 * @private
 */
export type WorkflowFormatterInputSource = 'PreviousStep' | 'ContextPath';

/**
 * Scheduled trigger schedule type.
 *
 * @private
 */
export type WorkflowScheduleType = 'Once' | 'Recurring' | 'Cron';

/**
 * Scheduled trigger interval unit.
 *
 * @private
 */
export type WorkflowIntervalUnit = 'Minutes' | 'Hours' | 'Days' | 'Weeks';

/**
 * Webhook HTTP method.
 *
 * @private
 */
export type WorkflowHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Webhook authentication mode.
 *
 * Defines the authentication strategy enforced by the backend for incoming webhook requests.
 * Frontend stores only the strategy and credential reference; backend handles validation.
 *
 * - `None`: No authentication required.
 * - `Basic`: HTTP Basic Authentication (Authorization: Basic <base64>).
 * - `ApiKeyHeader`: Custom header containing an API key (e.g., X-API-Key).
 * - `Bearer`: Bearer token (Authorization: Bearer <token>).
 * - `HmacSha256`: HMAC-SHA256 signature validation (X-Webhook-Signature header).
 * - `Custom`: Customer-defined authentication handler.
 *
 * @private
 */
export type WorkflowAuthMode = 'None' | 'Basic' | 'ApiKeyHeader' | 'Bearer' | 'HmacSha256' | 'Custom';

/**
 * Webhook response mode.
 *
 * @private
 */
export type WorkflowResponseMode = 'Immediate' | 'LastNode';

/**
 * API request body type.
 *
 * @private
 */
export type WorkflowBodyType = 'Json' | 'Text' | 'Expression';

/**
 * Notification web hook HTTP method.
 *
 * @private
 */
export type WorkflowNotifyWebhookMethod = 'POST' | 'PUT';

/**
 * Defines the schema versions of the workflow JSON.
 */
export type WorkflowSchemaVersion = '1.0' | '1.1';

/**
 * Defines how AI steps get their API key.
 * - `Reference`: `credentialRef` holds a name the host resolves through `credentialRequested`; it is exported with the workflow.
 * - `Inline`: `apiKey` holds the raw key, used directly from the browser and never exported. Development only.
 */
export type WorkflowCredentialMode = 'Reference' | 'Inline';

/**
 * Where AI step conversation memory is kept: in page memory only, or in sessionStorage.
 *
 * @private
 */
export type WorkflowAIMemoryPersistence = 'None' | 'Session';

/**
 * Defines the Trigger steps that can be shown in the step collection.
 */
export type WorkflowTriggerStepType = 'ManualTrigger' | 'ScheduledTrigger' | 'WebhookTrigger' | 'FormInputTrigger';

/**
 * Defines the Action steps that can be shown in the step collection.
 */
export type WorkflowActionStepType = 'SetVariable' | 'Filter' | 'Sort' | 'ApiRequest';

/**
 * Defines the Flow steps that can be shown in the step collection.
 */
export type WorkflowFlowStepType = 'Delay' | 'Condition' | 'Switch' | 'Loop';

/**
 * Defines the Human steps that can be shown in the step collection.
 */
export type WorkflowHumanStepType = 'Approve' | 'Notify';

/**
 * Defines the AI steps that can be shown in the step collection.
 */
export type WorkflowAIStepType = 'AI';

/**
 * Defines the Output steps that can be shown in the step collection.
 */
export type WorkflowOutputStepType = 'Formatter' | 'End';

/**
 * Defines the inputs a custom step field can display.
 */
export type WorkflowCustomFieldType =
    | 'TextBox'
    | 'TextArea'
    | 'DropDownList'
    | 'MultiSelect'
    | 'NumericTextBox'
    | 'DatePicker'
    | 'DateTimePicker'
    | 'CheckBox'
    | 'RadioButton';
