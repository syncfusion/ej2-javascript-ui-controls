/**
 * DeserializationError — thrown when DocumentSerializer cannot parse its input.
 *
 * Wraps the underlying parser error so callers do not have to catch two
 * different exception types.
 */
export class DeserializationError extends Error {
    public readonly name: string = 'DeserializationError';
    public readonly cause?: Error;

    constructor(message: string, cause?: Error) {
        super(`DeserializationError: ${message}`);
        this.cause = cause;
        Object.setPrototypeOf(this, DeserializationError.prototype);
    }
}
