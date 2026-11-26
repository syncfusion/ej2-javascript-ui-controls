import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Defines the execution log, the panel docked below the canvas that lists the progress and result
 * of each step during a run. The log is collapsed when the Workflow Designer is first
 * displayed.
 */
export class WorkflowExecutionLogSettings extends ChildProperty<WorkflowExecutionLogSettings> {
    /**
     * Defines whether the execution log is displayed.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

}
