import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { WorkflowCredentialMode } from './workflow-enums';

/**
 * Defines how runs of the workflow are paced.
 */
export class WorkflowExecutionSettings extends ChildProperty<WorkflowExecutionSettings> {
    /**
     * Defines the delay, in milliseconds, between steps during a run, so the progress of the run can
     * be followed on the canvas. Set it to `0` to run without a delay.
     *
     * @default 550
     */
    @Property(550)
    public executionSpeed: number;

    /**
     * Defines how AI steps get their API key. In `Reference` mode (default), the step's `credentialRef`
     * holds a name that the host resolves through the `credentialRequested` event. In `Inline` mode, the
     * key is entered on the step and stored in its `apiKey` property, which is used directly from the
     * browser and never exported; use it only for development. An API Request step's `authRef` is always
     * resolved through `credentialRequested`.
     *
     * @default 'Reference'
     */
    @Property('Reference')
    public credentialMode: WorkflowCredentialMode;
}
