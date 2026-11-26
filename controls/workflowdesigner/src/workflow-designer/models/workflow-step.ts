import { WorkflowStepType } from './workflow-enums';
import { WorkflowPosition } from './workflow-position';
import { WorkflowSize } from './workflow-size';
import { WorkflowStepAppearance, WorkflowStepStateAppearance } from './workflow-appearance';
import { WorkflowStepErrorHandling } from './workflow-error-handling';

/**
 * Defines a step of the workflow, such as a trigger, an action or a branching step.
 */
export interface WorkflowStep {
    /**
     * Defines the unique identifier of the step. It must be unique across all steps, connections and
     * sticky notes, and can contain only letters, digits, `_` and `-`.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines the type of the step, which determines what the step does and which settings it uses.
     *
     * @default 'ManualTrigger'
     */
    stepType?: WorkflowStepType;

    /**
     * Defines the display name of the step.
     *
     * @default ''
     */
    name?: string;

    /**
     * Defines the settings of the step, such as the URL of an API Request step or the rules of a
     * Condition step. The available settings depend on `stepType` and are listed in the step
     * reference of the documentation. Values must be JSON-safe.
     *
     * @default {}
     */
    props?: Record<string, unknown>;

    /**
     * Defines the identifier of the custom step definition (`stepCollectionSettings.custom`) that a
     * `Custom` step was created from. The values of its fields are stored in `props`.
     *
     * @default ''
     */
    customStepId?: string;

    /**
     * Defines application-specific JSON-safe values stored with the step. The Workflow Designer saves
     * these values but does not use them.
     *
     * @default {}
     */
    customProps?: Record<string, unknown>;

    /**
     * Defines the position of the step on the canvas.
     *
     * @default { x: 0, y: 0 }
     */
    position?: WorkflowPosition;

    /**
     * Defines the size of the step. When not set, the default size for the step is used.
     *
     * @default {}
     * @private
     */
    size?: WorkflowSize;

    /**
     * Defines the visual appearance of the step, such as its icon and colors.
     *
     * @default {}
     * @private
     */
    appearance?: WorkflowStepAppearance;

    /**
     * Defines appearance overrides for the running, completed and failed states. `appearance` is the base
     * (Idle) appearance; only the values that differ from it need to be set here. A missing value falls
     * back to the resolved base `appearance`. Applies to the built-in step content only; a
     * `workflowStepTemplate` can read it from `args.step.stateAppearance`.
     *
     * @default {}
     * @private
     */
    stateAppearance?: WorkflowStepStateAppearance;

    /**
     * Defines how the step behaves when it fails during a run, including timeouts, retries
     * and whether the run continues.
     *
     * @default {}
     * @private
     */
    errorHandling?: WorkflowStepErrorHandling;

}

