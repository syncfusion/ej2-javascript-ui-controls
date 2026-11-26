import { WorkflowErrorSettings } from '../models/workflow-error-settings';
import { WorkflowStepErrorHandling } from '../models/workflow-error-handling';
import { WorkflowRetryPolicy } from '../models/workflow-error-handling';
import { WorkflowStep } from '../models/workflow-step';

/**
 * Effective Error Policy.
 *
 * @private
 */
export interface EffectiveErrorPolicy {
    timeoutMs: number;
    continueOnError: boolean;
    retryPolicy: WorkflowRetryPolicy;
}

/**
 * Resolves step-level error settings over workflow defaults.
 *
 * @private
 */
export class ErrorPolicy {
    /**
     * Resolve.
     *
     * @param {WorkflowStep} step The step.
     * @param {WorkflowErrorSettings} defaults The defaults.
     * @returns {EffectiveErrorPolicy} The result.
     * @private
     */
    public static resolve(step: WorkflowStep, defaults?: WorkflowErrorSettings): EffectiveErrorPolicy {
        const handling: WorkflowStepErrorHandling = step.errorHandling || {};
        const retry: WorkflowRetryPolicy = handling.retryPolicy || (defaults && defaults.retryPolicy) || {};
        return {
            // A step's own value wins, including 0 to turn the workflow's default timeout off.
            timeoutMs: typeof handling.timeoutMs === 'number' && isFinite(handling.timeoutMs) && handling.timeoutMs >= 0
                ? handling.timeoutMs
                : (defaults && defaults.defaultTimeoutMs) || 0,
            continueOnError: handling.continueOnError !== undefined
                ? Boolean(handling.continueOnError)
                : Boolean(defaults && defaults.continueOnError),
            retryPolicy: {
                enabled: Boolean(retry.enabled),
                maxAttempts: retry.maxAttempts || 1,
                delayMs: retry.delayMs || 0
            }
        };
    }

    /**
     * Is Branching.
     *
     * @param {string} stepType The step type.
     * @returns {boolean} The result.
     * @private
     */
    public static isBranching(stepType?: string): boolean {
        return stepType === 'Condition' || stepType === 'Switch' || stepType === 'Loop'
            || stepType === 'Approve';
    }
}
