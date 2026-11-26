/**
 * Defines the configurable retry policy for workflow step error handling.
 *
 * @private
 */
export interface WorkflowRetryPolicy {
    /**
     * Defines whether retry behavior is enabled.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Defines the maximum number of attempts, including the first attempt.
     *
     * @default 1
     */
    maxAttempts?: number;

    /**
     * Defines the delay between retry attempts in milliseconds.
     *
     * @default 0
     */
    delayMs?: number;
}

/**
 * Defines how a step behaves when it fails during a run.
 *
 * @private
 */
export interface WorkflowStepErrorHandling {
    /**
     * Defines how long the step can run, in milliseconds, before it fails with a timeout.
     * When `0`, the default timeout of 30 seconds is used.
     *
     * @default 0
     */
    timeoutMs?: number;

    /**
     * Defines whether the run continues to the next step when this step fails.
     *
     * @default false
     */
    continueOnError?: boolean;

    /**
     * Defines whether and how the step is retried when it fails: `enabled` turns retries on,
     * `maxAttempts` is the total number of attempts including the first one, and `delayMs` is the
     * delay between attempts in milliseconds.
     *
     * @default {}
     */
    retryPolicy?: { enabled?: boolean; maxAttempts?: number; delayMs?: number };

    /**
     * Defines whether the step has an `error` output port, so you can connect a recovery path that
     * runs when the step fails.
     *
     * @default false
     */
    errorPort?: boolean;
}
