import { WorkflowStep } from './workflow-step';

/**
 * Defines the execution state of a workflow step, as passed to `workflowStepTemplate`:
 * `'idle'` before the step runs, `'running'` while it runs, then `'completed'` or `'failed'`.
 */
export type WorkflowStepState = 'idle' | 'running' | 'completed' | 'failed';

/**
 * Defines the arguments passed to the `workflowStepTemplate` function.
 */
export interface WorkflowStepTemplateArgs {
    /**
     * Defines the workflow step being rendered, with its latest name, props, custom props,
     * size and appearance.
     */
    step: WorkflowStep;

    /**
     * Defines the current execution state of the step.
     */
    state: WorkflowStepState;
}
