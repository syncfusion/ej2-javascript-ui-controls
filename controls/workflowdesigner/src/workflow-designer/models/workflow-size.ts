/**
 * Defines the size of a workflow item on the Workflow Designer canvas.
 */
export interface WorkflowSize {
    /**
     * Defines the width of the workflow item.
     *
     * When not set, the default width for the item is used.
     *
     * @default null
     */
    width?: number;

    /**
     * Defines the height of the workflow item.
     *
     * When not set, the default height for the item is used.
     *
     * @default null
     */
    height?: number;
}
