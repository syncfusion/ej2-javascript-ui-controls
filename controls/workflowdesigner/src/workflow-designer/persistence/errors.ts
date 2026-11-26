import { WorkflowValidationMessage } from '../models/workflow-validation';

/**
 * Base class of every error the Workflow Designer raises to the host. `code` is a stable,
 * language-independent identifier such as `'RUN_IN_PROGRESS'`, or `'DESTROYED'` when a method is
 * called after `destroy()`; `message` is localized and may change between releases.
 */
export class WorkflowError extends Error {
    /** A stable identifier for the kind of failure. */
    public readonly code: string;

    /**
     * Creates a Workflow Designer error.
     *
     * @param {string} message - A localized description of the problem.
     * @param {string} [code] - A stable identifier for the kind of failure.
     */
    public constructor(message: string, code?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'WorkflowError';
        this.code = code || 'WORKFLOW_ERROR';
    }
}

/**
 * Raised when a workflow can't be imported. `code` tells why: `'IMPORT_INVALID_JSON'`,
 * `'IMPORT_TOO_LARGE'`, `'IMPORT_UNSUPPORTED_VERSION'`, `'IMPORT_INVALID_STRUCTURE'` (ids,
 * connections, cycles). The current
 * workflow is left unchanged.
 */
export class WorkflowImportError extends WorkflowError {
    /** Validation messages behind the failure, when available. */
    public readonly messages: WorkflowValidationMessage[];

    /**
     * Creates an import error.
     *
     * @param {string} message - A description of the problem.
     * @param {WorkflowValidationMessage[]} [messages] - Validation messages behind the failure.
     * @param {string} [code] - A stable identifier; defaults to `'IMPORT_INVALID'`.
     */
    public constructor(message: string, messages?: WorkflowValidationMessage[], code?: string) {
        super(message, code || 'IMPORT_INVALID');
        this.messages = messages || [];
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'WorkflowImportError';
    }
}
