import { DocxErrorCode } from './error-codes';

/**
 * Optional cause bag for {@link DocxError} constructors.
 * Kept local so product emit does not depend on ej2-xlsx typings.
 * Aligns with the global ambient `ErrorOptions` in `src/ts33-compat.ts`.
 *
 * @private
 */
export interface ErrorOptions {
    cause?: unknown;
}

/**
 * Base error for every library failure. Consumers switch on {@link DocxError.code}, never on message text.
 *
 * @private
 */
export class DocxError extends Error {
    /**
     * Stable machine-readable identifier.
     */
    readonly code: DocxErrorCode;
    /**
     * Underlying cause of this error, when known. Assigned explicitly:
     * the pinned TypeScript 3.3.1 lib types the Error constructor with a
     * message parameter only, so `cause` cannot flow through `super`.
     */
    readonly cause?: unknown;
    constructor(code: DocxErrorCode, message: string, options?: ErrorOptions) {
        super(message);
        this.name = new.target.name;
        this.code = code;
        if (options !== undefined && options.cause !== undefined) {
            this.cause = options.cause;
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
/**
 * ZIP or OPC package problems.
 *
 * @private
 */
export class PackageError extends DocxError {
}
/**
 * Well-formedness, DTD, or XML limit failures.
 *
 * @private
 */
export class XmlError extends DocxError {
}
/**
 * Security-limit and untrusted-input failures.
 *
 * @private
 */
export class SecurityError extends DocxError {
}
/**
 * Markup Compatibility MustUnderstand and related failures.
 *
 * @private
 */
export class MarkupCompatibilityError extends DocxError {
}
/**
 * Exhaustiveness failure for a content union the compiler should have rejected.
 *
 * @private
 */
export class UnsupportedContentError extends DocxError {
    constructor(message: string, options?: ErrorOptions) {
        super('content/unsupported', message, options);
    }
}
/**
 * Mutation of an object after it was removed from its document.
 *
 * @private
 */
export class DetachedObjectError extends DocxError {
    constructor(message: string, options?: ErrorOptions) {
        super('model/detached-object', message, options);
    }
}
/**
 * API argument is missing or empty where a value is required.
 *
 * @private
 */
export class InvalidArgumentError extends DocxError {
    constructor(message: string, options?: ErrorOptions) {
        super('argument/invalid', message, options);
    }
}
/**
 * Underlying filesystem or byte I/O failure wrapped for consumers.
 *
 * @private
 */
export class IoError extends DocxError {
    constructor(message: string, options?: ErrorOptions) {
        super('io/error', message, options);
    }
}
