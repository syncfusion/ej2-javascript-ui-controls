/**
 * ValidationError — single reason why a schema or document validation failed.
 *
 * Carries the dot-path of the offending value (e.g. `nodes.paragraph.attrs.align`)
 * so consumers can produce meaningful error messages.
 */
export interface ValidationError {
    /** Dot-path to the failing field. Empty string for the whole document. */
    path: string;
    /** Short human-readable reason for the failure. */
    message: string;
}

/**
 * ValidationResult — outcome of validating a schema definition or a document tree.
 *
 * `valid` is true iff `errors` is empty. `errors` is never `undefined` so callers
 * do not need to null-check.
 */
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

/**
 * Helper — build a successful ValidationResult.
 *
 * @returns {ValidationResult} A result with `valid: true` and no errors.
 */
export function validResult(): ValidationResult {
    return { valid: true, errors: [] };
}

/**
 * Helper — build a failed ValidationResult from one or more errors.
 *
 * @param {ValidationError[]} errors - The errors that caused the failure.
 * @returns {ValidationResult} A result with `valid: false` and the supplied errors.
 */
export function invalidResult(errors: ValidationError[]): ValidationResult {
    return { valid: false, errors };
}
