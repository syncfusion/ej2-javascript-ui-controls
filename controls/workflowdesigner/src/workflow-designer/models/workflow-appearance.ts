/**
 * Defines the configurable visual appearance of a workflow step. On a step, `appearance` is the base
 * (Idle) appearance.
 */
export interface WorkflowStepAppearance {
    /**
     * Defines the CSS class for the step icon.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines the step border color.
     *
     * @default ''
     */
    strokeColor?: string;

    /**
     * Defines the step border width.
     *
     * @default 1
     */
    strokeWidth?: number;

    /**
     * Defines the step fill color.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Defines the step text color.
     *
     * @default ''
     */
    textColor?: string;
}

/**
 * Defines appearance overrides for the execution states of a workflow step. `appearance` is the base
 * (Idle) appearance, so there is no Idle entry here. Only the values that differ from the base need to
 * be set; a missing value falls back to the resolved base `appearance`, and then to the built-in look
 * of that state.
 */
export interface WorkflowStepStateAppearance {
    /**
     * Defines the appearance overrides while the step is running.
     *
     * @default {}
     */
    running?: WorkflowStepAppearance;

    /**
     * Defines the appearance overrides after the step completed.
     *
     * @default {}
     */
    completed?: WorkflowStepAppearance;

    /**
     * Defines the appearance overrides after the step failed.
     *
     * @default {}
     */
    failed?: WorkflowStepAppearance;
}
