import { WorkflowStepType } from './workflow-enums';
import { WorkflowWebhookRequestContext, WorkflowWebhookTriggerMessage } from '../runtime/workflow-webhook-trigger-api';

/**
 * Defines the result of a single step during a run. Results are stored in
 * `WorkflowRuntimeContext.nodes`, keyed by step identifier.
 */
export interface WorkflowStepResult {
    /**
     * Specifies the identifier of the step.
     */
    id: string;
    /**
     * Specifies the type of the step.
     */
    stepType: WorkflowStepType;
    /**
     * Specifies the display name of the step.
     */
    name?: string;
    /**
     * Specifies the response returned by the step.
     */
    response?: Object;
}

/**
 * Defines the input a run is started with.
 */
export interface WorkflowRunInput {
    /**
     * Specifies the data the run is started with, such as the values submitted to a form trigger.
     * Steps read it through the `$.input.response` expression.
     */
    response?: Object;

    /**
     * Specifies the webhook request details. The designer sets it when the run is started through `triggerWebhook`.
     *
     * @private
     */
    webhook?: WorkflowWebhookRequestContext & Pick<WorkflowWebhookTriggerMessage, 'workflowId' | 'triggerId' | 'eventId' | 'executionId'>;
}

/**
 * Defines the runtime data available during a run. Step settings can reference these
 * values through expressions, such as `$.previousStep.response` or `$.variables.name`.
 *
 * You can pass the input of a run to `runExecution` through the `input` property.
 */
export interface WorkflowRuntimeContext {
    /**
     * Specifies the input the run is started with.
     */
    input?: WorkflowRunInput;

    /**
     * The result of the step that ran immediately before the current step on the current path.
     * Inside a loop, `response` holds the current loop item.
     *
     * @private
     */
    previousStep?: WorkflowStepResult;

    /**
     * The results of every step that has run, keyed by step identifier.
     *
     * @private
     */
    nodes?: Record<string, WorkflowStepResult>;

    /**
     * The current loop iteration, available while a Loop step is running its body:
     * `all` is the array being iterated, `currentItem` is the item for the current iteration,
     * `index` is its zero-based position and `count` is the number of items.
     *
     * @private
     */
    loop?: { index: number; count: number; currentItem: unknown; all: unknown[] };

    /**
     * The variables created by Set Variable steps, keyed by variable name.
     *
     * @private
     */
    variables?: Record<string, unknown>;
}
