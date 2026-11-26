/**
 * Defines configurable workflow-level error settings. Step-level error
 * handling overrides workflow-level settings; global settings apply when a
 * step does not define a value.
 *
 * @public
 * @private
 */
export interface WorkflowErrorSettings {
    /**
     * Defines the default timeout applied to workflow steps in milliseconds.
     *
     * @default 0
     */
    defaultTimeoutMs?: number;

    /**
     * Defines whether workflow processing continues after an error when a
     * step does not override this behavior.
     *
     * @default false
     */
    continueOnError?: boolean;

    /**
     * Defines the workflow-level retry policy applied when a step does not
     * define its own retry policy.
     *
     * @default {}
     */
    retryPolicy?: { enabled?: boolean; maxAttempts?: number; delayMs?: number };
}
