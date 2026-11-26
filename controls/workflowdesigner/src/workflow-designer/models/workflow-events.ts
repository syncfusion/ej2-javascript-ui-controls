/**
 * Event argument types for the Workflow Designer events. Runtime context carried by these
 * arguments is never written back to the workflow definition.
 */

import { WorkflowDefinitionModel } from './workflow-definition';
import { WorkflowRuntimeContext, WorkflowStepResult } from './workflow-runtime-context';
import { WorkflowAIAssistTransportMode } from './workflow-ai-assist-settings';
import { KeyValue, WorkflowOutputFieldModel } from './workflow-shared-types';
import { WorkflowStep } from './workflow-step';
import { WorkflowStickyNote } from './workflow-sticky-note';
import { WorkflowConnection } from './workflow-connection';
import { WorkflowExecutionError, WorkflowExecutionResult } from './workflow-validation';
import {
    WorkflowAIAssistOutputFormat, WorkflowBodyType, WorkflowHttpMethod, WorkflowNotifyChannel, WorkflowNotifyWebhookMethod
} from './workflow-enums';

/**
 * Defines the kind of change reported by the `workflowChanged` event.
 */
export type WorkflowChangeType =
    | 'StepAdded'
    | 'StepRemoved'
    | 'StepModified'
    | 'ConnectionAdded'
    | 'ConnectionRemoved'
    | 'ConnectionModified'
    | 'StickyNoteAdded'
    | 'StickyNoteRemoved'
    | 'StickyNoteModified'
    | 'WorkflowImported'
    | 'WorkflowModified';

/**
 * Defines a single property change reported by the `workflowChanged` event.
 */
export interface WorkflowPropertyChange {
    /**
     * Specifies the name of the property that changed.
     */
    propertyName: string;

    /**
     * Specifies the value before the change.
     */
    previousValue?: Object;

    /**
     * Specifies the value after the change.
     */
    newValue?: Object;
}

/**
 * Provides the arguments for the `workflowChanged` event.
 * Triggered when the workflow definition changes due to user actions or programmatic updates.
 */
export interface WorkflowChangedEventArgs {
    /**
     * Specifies a snapshot of the workflow definition at the time the event was triggered.
     */
    workflow: WorkflowDefinitionModel;

    /**
     * Specifies the type of change that occurred. `WorkflowModified` is used when no more specific change applies.
     */
    changeType: WorkflowChangeType;

    /**
     * Specifies the step, connection, or sticky note that was affected by the change, if applicable.
     */
    affectedItem?: WorkflowStep | WorkflowConnection | WorkflowStickyNote;

    /**
     * Specifies the properties that changed and their previous and new values.
     */
    changedProperties?: WorkflowPropertyChange[];
}

/**
 * Provides the arguments for the `selectionChanged` event.
 * Triggered when the user selects or deselects a workflow item on the canvas.
 */
export interface WorkflowSelectionChangedEventArgs {
    /**
     * Specifies the selected step, connection or sticky note, or `null` when the selection is cleared.
     */
    selectedItem?: WorkflowStep | WorkflowConnection | WorkflowStickyNote | null;
}

/**
 * Provides the arguments for the `created` event.
 * Triggered once after the Workflow Designer has finished rendering.
 *
 * @private
 */
export type WorkflowCreatedEventArgs = Object;

/**
 * Provides the arguments for the `executionStarted` event.
 * Triggered when a run starts, after validation passes.
 */
export interface WorkflowExecutionStartedEventArgs {
    /**
     * Specifies the workflow definition at the time the run started.
     */
    workflow: WorkflowDefinitionModel;
}

/**
 * Provides the arguments for the `executionStepStarted` event.
 * Triggered when a run reaches a step, before the step executes.
 * Treat all properties as read-only; they are copies, so changing them does not change the run.
 */
export interface WorkflowExecutionStepStartedEventArgs {
    /**
     * Specifies the step about to execute.
     */
    step: WorkflowStep;

    /**
     * Specifies the results of the steps that ran before this step, in run order.
     */
    stepResults: WorkflowStepResult[];

    /**
     * Specifies the result of the step that ran immediately before this one, if any.
     */
    previousStep?: WorkflowStepResult;

    /**
     * Specifies the connection the run followed to reach this step, if any.
     */
    incomingConnection?: WorkflowConnection;

    /**
     * Specifies all the connections leaving this step.
     */
    outgoingConnections?: WorkflowConnection[];
}

/**
 * Provides the arguments for the `executionStepCompleted` event.
 * Triggered after a step completes successfully during a run.
 * Treat all properties as read-only; they are copies, so changing them does not change the run.
 */
export interface WorkflowExecutionStepCompletedEventArgs {
    /**
     * Specifies the step that completed.
     */
    step: WorkflowStep;

    /**
     * Specifies the step's response. Later steps can read it from the runtime context.
     */
    result: Object;

    /**
     * Specifies the output port the run continues from. Set for branching steps such as Condition and Switch.
     */
    outputPort?: string;

    /**
     * Specifies the results of the steps that ran, including this step, in run order.
     */
    stepResults: WorkflowStepResult[];

    /**
     * Specifies the result of the step that ran immediately before this one, if any.
     */
    previousStep?: WorkflowStepResult;

    /**
     * Specifies the connection the run followed to reach this step, if any.
     */
    incomingConnection?: WorkflowConnection;

    /**
     * Specifies the connections the run selected to continue from this step.
     */
    followedConnections?: WorkflowConnection[];
}

/**
 * Provides the arguments for the `executionStepFailed` event.
 * Triggered when a step fails during a run.
 * Treat all properties as read-only; they are copies, so changing them does not change the run.
 */
export interface WorkflowExecutionStepFailedEventArgs {
    /**
     * Specifies the step that failed.
     */
    step: WorkflowStep;

    /**
     * Specifies the error that caused the step to fail.
     */
    error: WorkflowExecutionError;

    /**
     * Specifies the results of the steps that ran before the failure, in run order.
     */
    stepResults: WorkflowStepResult[];

    /**
     * Specifies the result of the step that ran immediately before the failed step, if any.
     */
    previousStep?: WorkflowStepResult;

    /**
     * Specifies the connection the run followed to reach the failed step, if any.
     */
    incomingConnection?: WorkflowConnection;
}

/**
 * Provides the arguments for the `executionCompleted` event.
 * Triggered once when a run ends, whatever the outcome.
 */
export interface WorkflowExecutionCompletedEventArgs {
    /**
     * Specifies the workflow definition that was executed.
     */
    workflow: WorkflowDefinitionModel;

    /**
     * Specifies the result of the run: its final status, the ordered step results, the followed connections,
     * the last step that ran, and the error when the run failed or was cancelled.
     */
    result: WorkflowExecutionResult;
}

/**
 * Provides the callbacks a host event handler uses to finish a step that waits for the host
 * application, such as a Notify or Custom step. Only the first call to `complete` or `fail` takes
 * effect; later calls are ignored.
 */
export interface WorkflowCompletionController {
    /**
     * Specifies the signal that is aborted when the run is stopped or the step times out. Use it to cancel any pending work.
     */
    signal: AbortSignal;
    /**
     * Completes the step successfully.
     *
     * @param {Object} [result] - The step's response. Later steps can read it from the runtime context.
     * @returns {void}
     */
    complete: (result?: Object) => void;
    /**
     * Fails the step. The step's error handling then decides whether the run continues.
     *
     * @param {Error} error - The reason the step failed.
     * @returns {void}
     */
    fail: (error: Error) => void;
}

/**
 * Defines the resolved settings of a Notify step. Which fields are set depends on `channel`.
 */
export interface WorkflowNotification {
    /**
     * Specifies the channel the notification is delivered through, such as `'Email'`, `'SMS'`, `'Push'`,
     * `'Teams'`, `'Slack'`, `'Webhook'` or `'Custom'`.
     */
    channel: WorkflowNotifyChannel;

    /**
     * Specifies the notification message.
     */
    message: string;

    /**
     * Specifies the notification subject. Used by the Email, Push, Teams, Slack and Custom channels.
     */
    subject?: string;

    /**
     * Specifies the recipient address. Used by the Email channel.
     */
    to?: string;

    /**
     * Specifies the copied recipients. Used by the Email channel.
     */
    cc?: string[] | string;

    /**
     * Specifies the phone number. Used by the SMS channel.
     */
    phoneNumber?: string;

    /**
     * Specifies the device token. Used by the Push channel.
     */
    deviceToken?: string;

    /**
     * Specifies the user identifier. Used by the Push channel.
     */
    userId?: string;

    /**
     * Specifies the channel identifier. Used by the Teams and Slack channels.
     */
    channelId?: string;

    /**
     * Specifies the users to mention. Used by the Teams and Slack channels.
     */
    mentionUsers?: string[] | string;

    /**
     * Specifies the webhook URL. Used by the Webhook channel.
     */
    webhookUrl?: string;

    /**
     * Specifies the HTTP method of the webhook call, `'POST'` or `'PUT'`. Used by the Webhook channel.
     */
    method?: WorkflowNotifyWebhookMethod;

    /**
     * Specifies the headers of the webhook call. Used by the Webhook channel.
     */
    headers?: KeyValue[];

    /**
     * Specifies the body of the webhook call. Used by the Webhook channel.
     */
    body?: Object;

    /**
     * Specifies the delivery target. Used by the Custom channel.
     */
    target?: string;
}

/**
 * Provides the arguments for the `notifyRequested` event.
 * Triggered when a Notify step runs, so the host application can deliver the notification.
 * Call `complete` or `fail` to finish the step.
 */
export interface WorkflowNotifyRequestedEventArgs extends WorkflowCompletionController {
    /**
     * Specifies the Notify step that is requesting notification.
     */
    step: WorkflowStep;

    /**
     * Specifies the Notify step's notification settings, with any runtime-context expressions already resolved.
     */
    notification?: WorkflowNotification;

    /**
     * Specifies the results of the steps that ran so far, in run order.
     */
    stepResults: WorkflowStepResult[];

    /**
     * Specifies the result of the step that ran immediately before, if any.
     */
    previousStep?: WorkflowStepResult;
}

/**
 * Provides the arguments for the `customExecutionRequested` event.
 * Triggered when a Custom step runs, so the host application can perform the step's work.
 * Call `complete` or `fail` to finish the step.
 */
export interface WorkflowCustomExecutionRequestedEventArgs extends WorkflowCompletionController {
    /**
     * Specifies the Custom step requesting execution.
     */
    step: WorkflowStep;

    /**
     * Specifies the action type configured on the Custom step. Use it to decide what work to perform.
     */
    actionType?: string;

    /**
     * Specifies the input configured on the Custom step, with any runtime-context expressions already resolved.
     * Its shape is defined by the application.
     */
    input?: Object;

    /**
     * Specifies the results of the steps that ran so far, in run order.
     */
    stepResults: WorkflowStepResult[];

    /**
     * Specifies the result of the step that ran immediately before, if any.
     */
    previousStep?: WorkflowStepResult;
}

/**
 * Provides the arguments for the `aiAssistCompleted` event.
 * Triggered when AI Assist successfully generates a workflow.
 */
export interface WorkflowAIAssistCompletedEventArgs {
    /**
     * Specifies the workflow definition generated by AI Assist and applied to the canvas.
     */
    workflow: WorkflowDefinitionModel;
}

/**
 * Provides the arguments for the `aiAssistFailed` event.
 * Triggered when an AI Assist request fails.
 */
export interface WorkflowAIAssistFailedEventArgs {
    /**
     * Specifies the error that caused the AI Assist request to fail.
     */
    error: WorkflowExecutionError;
}

/**
 * Provides the arguments for the `approvalRequested` event.
 * Triggered when an Approval step runs. Call `complete` or `fail` to finish the step.
 *
 * @private
 */
export interface WorkflowApprovalRequestedEventArgs extends WorkflowCompletionController {
    /**
     * The Approval step requesting approval.
     */
    step: WorkflowStep;

    /**
     * Reviewers configured on the step.
     */
    reviewers?: unknown;

    /**
     * Request message with expressions resolved.
     */
    requestMessage?: string;

    /**
     * Request fields with expressions resolved.
     */
    requestFields?: unknown;

    /**
     * The runtime context when the approval was requested.
     */
    context: WorkflowRuntimeContext;
}

/**
 * Provides the arguments for the `credentialRequested` event.
 * Triggered when a credential is needed for an API Request, AI step, or AI Assist.
 * The host looks up `credentialRef` in its own secret store and calls `complete(secret)`.
 * For `ApiRequest`, `complete` also accepts `{ headers: { [name]: value } }`;
 * a plain string is sent as the `Authorization` header value.
 * @private
 */
export interface WorkflowCredentialRequestedEventArgs extends WorkflowCompletionController {
    /**
     * The reference stored on the step (`AI.credentialRef`, `ApiRequest.authRef`) or in `aiAssistSettings.credential`.
     */
    credentialRef: string;

    /**
     * What needs the credential: `'AI'` (AI step), `'ApiRequest'` (API Request step), or `'AIAssist'` (AI Assist).
     */
    purpose: 'AI' | 'ApiRequest' | 'AIAssist';

    /**
     * The step requesting the credential. Not set for `'AIAssist'`.
     */
    step?: WorkflowStep;
}

/**
 * Defines the kind of request raised by the `beforeRequestSend` event.
 */
export type WorkflowRequestType = 'ApiRequest' | 'AI' | 'AIAssist';

/**
 * Defines a message sent to the AI provider as conversation history.
 */
export interface WorkflowAIMessage {
    /**
     * Specifies who wrote the message, such as `'user'` or `'assistant'`.
     */
    role: string;

    /**
     * Specifies the text of the message.
     */
    content: string;
}

/**
 * Defines the request an API Request step is about to send. Handlers may change its values in place.
 */
export interface WorkflowApiRequest {
    /**
     * Specifies the HTTP method of the request.
     */
    method: WorkflowHttpMethod;

    /**
     * Specifies the URL the request is sent to.
     */
    url: string;

    /**
     * Specifies the headers sent with the request.
     */
    headers?: KeyValue[];

    /**
     * Specifies the query parameters appended to the URL.
     */
    queryParams?: KeyValue[];

    /**
     * Specifies how `body` is encoded: `'Json'`, `'Text'` or `'Expression'`.
     */
    bodyType?: WorkflowBodyType;

    /**
     * Specifies the request body. It is not set for methods that have no body, such as `GET` and `DELETE`.
     */
    body?: Object;
}

/**
 * Defines the request an AI step or AI Assist is about to send. Handlers may change its values in place.
 */
export interface WorkflowAIRequest {
    /**
     * Specifies how the request is sent: `'Direct'` calls the AI provider from the browser,
     * and `'Server'` posts it to `serverUrl`.
     */
    mode: WorkflowAIAssistTransportMode;

    /**
     * Specifies the AI provider, such as `'Gemini'`, `'OpenAI'` or `'Claude'`.
     */
    provider?: string;

    /**
     * Specifies the AI model.
     */
    model?: string;

    /**
     * Specifies the server the request is posted to in `'Server'` mode.
     */
    serverUrl?: string;

    /**
     * Specifies the headers sent to the server in `'Server'` mode, for example an `Authorization` header.
     */
    headers?: KeyValue[];

    /**
     * Specifies the system instructions sent with the prompt.
     */
    systemPrompt?: string;

    /**
     * Specifies the prompt sent to the AI.
     */
    prompt: string;

    /**
     * Specifies the previous messages sent as conversation history when AI memory is enabled.
     */
    memoryMessages?: WorkflowAIMessage[];

    /**
     * Specifies the format the response should use: `'Text'`, `'JSON'` or `'Markdown'`.
     */
    outputFormat?: WorkflowAIAssistOutputFormat;

    /**
     * Specifies the fields the response should contain for JSON output. Not set for AI Assist.
     */
    responseFields?: WorkflowOutputFieldModel[];
}

/**
 * Provides the arguments for the `beforeRequestSend` event.
 * Triggered before an API Request or AI step sends its request (once per attempt when the step retries).
 * The request never contains a resolved secret; credentials are attached after this event.
 *
 * Change `request` to adjust what is sent (for example, point `url` or `serverUrl` at your backend).
 * Set `response` to a value to use as the step's response; no request is sent.
 * Set `cancel` to true to skip the request; the step fails with code `'REQUEST_CANCELLED'`.
 */
export interface WorkflowBeforeRequestSendEventArgs {
    /**
     * Specifies the step that is about to send the request. Not set for `'AIAssist'` requests.
     */
    step?: WorkflowStep;

    /**
     * Specifies the kind of request: `'ApiRequest'` (API Request step), `'AI'` (AI step), or `'AIAssist'`.
     */
    requestType: WorkflowRequestType;

    /**
     * Specifies the resolved request, which handlers may change in place.
     * It is a `WorkflowApiRequest` when `requestType` is `'ApiRequest'`, and a `WorkflowAIRequest` otherwise.
     * No secret is attached yet when the event is raised.
     */
    request: WorkflowApiRequest | WorkflowAIRequest;

    /**
     * Specifies the response to use instead of sending the request. A promise of the response is also accepted.
     */
    response?: Object;

    /**
     * Set to true to skip the request; the step or AI Assist request fails with code `REQUEST_CANCELLED`.
     * Set it to a promise of a boolean to decide asynchronously; changes made to `request` before the
     * promise resolves are still sent.
     */
    cancel: boolean | Promise<boolean>;

    /**
     * Specifies the results of the steps that ran so far, in run order. Not set for `'AIAssist'` requests.
     */
    stepResults?: WorkflowStepResult[];

    /**
     * Specifies the result of the step that ran immediately before, if any. Not set for `'AIAssist'` requests.
     */
    previousStep?: WorkflowStepResult;
}

/**
 * Provides the arguments for the `beforeStepExecute` event.
 * Triggered before each step runs (including Loop steps).
 * Set `cancel` to true to end the run with status `'Cancelled'` before this step executes.
 * To decide asynchronously (for example after asking the user), set `cancel` to a promise of a boolean; the run waits for it.
 *
 * @private
 */
export interface WorkflowBeforeStepExecuteEventArgs {
    /**
     * The step about to execute.
     */
    step: WorkflowStep;

    /**
     * The runtime context before the step executes.
     */
    context: WorkflowRuntimeContext;

    /**
     * The step that ran immediately before this one on the current path, if any.
     */
    previousStep?: WorkflowStep;

    /**
     * The connection the run followed to reach this step, if any.
     */
    incomingConnection?: WorkflowConnection;

    /**
     * Set to true, or a promise that resolves to true, to cancel the run.
     */
    cancel: boolean | Promise<boolean>;
}

/**
 * Provides the arguments for the `beforeItemRemove` event.
 * Triggered before the user removes a step, connection or sticky note.
 * Set `cancel` to true to keep the item.
 * To decide asynchronously (for example with a confirmation dialog), set `cancel` to a promise of a boolean:
 * the item stays until the promise resolves, and is removed if it resolves to false.
 *
 * @private
 */
export interface WorkflowBeforeItemRemoveEventArgs {
    /**
     * The item about to be removed.
     */
    item: WorkflowStep | WorkflowConnection | WorkflowStickyNote;

    /**
     * Set to true, or a promise that resolves to true, to keep the item.
     */
    cancel: boolean | Promise<boolean>;
}

/**
 * Provides the arguments for the `beforeConnect` event.
 * Triggered before the user adds a connection. Set `cancel` to true to reject it.
 * When a step is inserted with its connections in one gesture, cancelling a connection leaves that step unconnected.
 *
 * @private
 */
export interface WorkflowBeforeConnectEventArgs {
    /**
     * The connection about to be added.
     */
    connection: WorkflowConnection;

    /**
     * Set to true to reject the connection.
     */
    cancel: boolean;
}
