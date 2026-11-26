/**
 * Validation and run result types.
 */

import { WorkflowExecutionErrorType, WorkflowExecutionStatus, WorkflowValidationMessageType } from './workflow-enums';
import { WorkflowStepResult } from './workflow-runtime-context';

/**
 * Defines a single message produced by workflow validation.
 */
export interface WorkflowValidationMessage {
    /**
     * A stable code that identifies the kind of issue.
     */
    code?: string;

    /**
     * The severity of the message: `'Error'`, `'Warning'` or `'Info'`. Only errors make the workflow invalid.
     */
    type: WorkflowValidationMessageType;

    /**
     * A readable description of the issue.
     */
    message: string;

    /**
     * The identifier of the step the message refers to, if any.
     */
    stepId?: string;

    /**
     * The identifier of the connection the message refers to, if any.
     */
    connectionId?: string;

    /**
     * The path of the step property the message refers to, if any.
     */
    propertyPath?: string;
}

/**
 * Defines the result returned by `validateWorkflow`.
 */
export interface WorkflowValidationResult {
    /**
     * Whether the workflow is valid, that is, has no error messages.
     */
    isValid: boolean;

    /**
     * The validation messages, including errors, warnings and informational notes.
     */
    messages: WorkflowValidationMessage[];
}

/**
 * Defines an error that occurred during a run or an AI Assist request.
 */
export interface WorkflowExecutionError {
    /**
     * The category of the error, such as `'Validation'`, `'Timeout'` or `'ApiRequest'`.
     */
    type: WorkflowExecutionErrorType;

    /**
     * A code that identifies the error, if available.
     */
    code?: string;

    /**
     * A readable description of the error.
     */
    message: string;

    /**
     * The identifier of the step that failed, if any.
     */
    stepId?: string;

    /**
     * Additional details about the error, if available. Secrets are never included.
     */
    details?: unknown;
}

/**
 * Defines the result returned by `runExecution` and passed to the `executionCompleted` event.
 */
export interface WorkflowExecutionResult {
    /**
     * The final status of the run, such as `'Completed'`, `'Stopped'` or `'Failed'`.
     */
    status: WorkflowExecutionStatus;

    /**
     * Specifies the results of the steps that ran, in run order. A step that ran more than once, for example in a loop, appears once per visit.
     */
    stepResults: WorkflowStepResult[];

    /**
     * Specifies the identifiers of the connections that were followed, in order.
     */
    visitedConnections: string[];

    /**
     * Specifies the result of the last step that ran.
     */
    lastStep?: WorkflowStepResult;

    /**
     * The error that ended the run, when the run failed.
     */
    error?: WorkflowExecutionError;
}

/**
 * Status category for a single simulation-log entry.
 *
 * @private
 */
export type WorkflowExecutionLogEntryStatus =
    | 'Started'
    | 'Completed'
    | 'Skipped'
    | 'Retry'
    | 'Warning'
    | 'Error'
    | 'Stopped'
    | 'Validation'
    | 'Final'
    | 'NotRunning';

/**
 * A single simulation-log entry produced by the simulation engine and
 * consumed by the Simulation Log UI. Runtime-only; never persisted.
 *
 * @private
 */
export interface WorkflowExecutionLogEntry {
    /** Entry timestamp (milliseconds since epoch) or ISO string. */
    timestamp: number | string;

    /** Optional related step identifier. */
    stepId?: string;

    /** Optional related connection identifier. */
    connectionId?: string;

    /** Entry status category. */
    status: WorkflowExecutionLogEntryStatus;

    /** Human-readable entry message (JSON-safe; never secrets). */
    message: string;

    /**
     * Optional child messages when multiple issues share one step/connection
     * row (e.g. grouped validation errors). UI may expand these under the parent.
     */
    messages?: string[];

    /** Optional retry attempt number when applicable. */
    retryAttempt?: number;

    /** Optional simulation error when applicable. */
    error?: WorkflowExecutionError;

    /** Optional simplified runtime-context summary (JSON-safe; never secrets). */
    contextSummary?: unknown;
}
