/**
 * Marks an error as "the run was stopped" so run control flow never depends on message text.
 *
 * @private
 */
export const RUN_STOPPED_CODE: string = 'RUN_STOPPED';

/**
 * Creates the error used to unwind a run when it is stopped.
 *
 * @returns {Error} An error with `code` set to `RUN_STOPPED`.
 * @private
 */
export function runStoppedError(): Error & { type: string; code: string } {
    return Object.assign(new Error('The run was stopped.'), { type: 'Runtime', code: RUN_STOPPED_CODE });
}

/**
 * Whether an error is the run-stopped signal.
 *
 * @param {unknown} error - The error to test.
 * @returns {boolean} `true` for the error created by `runStoppedError`.
 * @private
 */
export function isRunStopped(error: unknown): boolean {
    return !!error && typeof error === 'object' && (error as { code?: unknown }).code === RUN_STOPPED_CODE;
}
