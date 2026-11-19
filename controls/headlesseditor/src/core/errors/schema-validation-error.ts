/**
 * SchemaValidationError — thrown when a document tree fails schema validation
 * after deserialization. Carries the full ValidationError[] list so consumers
 * can display every problem at once.
 */
import { ValidationError } from './validation-error';

export class SchemaValidationError extends Error {
    public readonly name: string = 'SchemaValidationError';
    public readonly errors: ValidationError[];

    constructor(errors: ValidationError[]) {
        const summary: string = errors
            .map((e: ValidationError) => `${e.path}: ${e.message}`)
            .join('; ');
        super(`SchemaValidationError: ${summary || 'document is invalid'}`);
        this.errors = errors;
        Object.setPrototypeOf(this, SchemaValidationError.prototype);
    }
}
