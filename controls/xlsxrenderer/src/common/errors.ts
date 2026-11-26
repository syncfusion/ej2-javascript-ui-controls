
/**
 * Excel to PDF Converter Error Types.
 *
 * Typed errors for different conversion failure scenarios.
 */

import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Exception raised when an error occurs during Excel to PDF conversion operations.
 */
export class ExcelToPdfConverterException {
    private static DEFAULT_MESSAGE: string = 'Can\'t convert the Excel file to an PDF document.\n';

    /** Error name identifier. */
    public name: string = 'ExcelToPdfConverterException';

    /** Error description message. */
    public message: string;

    /**
     * Initializes a new instance of the `ExcelToPdfConverterException` class.
     *
     * @param {string} [message] Detailed error description.
     */
    constructor(message?: string) {
        this.message = ExcelToPdfConverterException.DEFAULT_MESSAGE + (isNullOrUndefined(message) ? '' : message);
    }
}

/**
 * Base conversion error
 */
export class ConversionError {
    /** Error name identifier. */
    public name: string = 'ConversionError';

    /** Error message. */
    public message: string;

    /** Error code. */
    public code: string;

    /** Error context. */
    public context?: unknown;

    /**
     * Creates an instance of ConversionError.
     *
     * @param {string} code - The error code.
     * @param {string} message - The error message.
     * @param {Object} [context] - Additional context.
     */
    constructor(code: string, message: string, context?: unknown) {
        this.code = code;
        this.message = message;
        this.context = context;
    }
}

/**
 * Validation error
 */
export class ValidationError extends ConversionError {
    /**
     * Creates an instance of ValidationError.
     *
     * @param {string} code - The error code.
     * @param {string} message - The error message.
     * @param {Object} [context] - Additional context.
     */
    constructor(code: string, message: string, context?: unknown) {
        super(code, message, context);
        this.name = 'ValidationError';
    }
}

/**
 * Limit exceeded error
 */
export class LimitExceededError extends ConversionError {
    /**
     * Creates an instance of LimitExceededError.
     *
     * @param {string} code - The error code.
     * @param {string} message - The error message.
     * @param {Object} [context] - Additional context.
     */
    constructor(code: string, message: string, context?: unknown) {
        super(code, message, context);
        this.name = 'LimitExceededError';
    }
}

/**
 * Input validation error codes
 */
export const InputErrorCode: { [key: string]: string } = {
    INVALID_INPUT: 'INVALID_INPUT',
    CORRUPT_WORKBOOK: 'CORRUPT_WORKBOOK',
    ENCRYPTED_WORKBOOK: 'ENCRYPTED_WORKBOOK',
    UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE'
};

/**
 * Limit exceeded error codes
 */
export const LimitErrorCode: { [key: string]: string } = {
    MAX_PAGES_EXCEEDED: 'MAX_PAGES_EXCEEDED',
    MAX_CELLS_EXCEEDED: 'MAX_CELLS_EXCEEDED',
    MAX_IMAGE_BYTES_EXCEEDED: 'MAX_IMAGE_BYTES_EXCEEDED',
    TIMEOUT_EXCEEDED: 'TIMEOUT_EXCEEDED'
};

/**
 * Generic error codes
 */
export const ErrorCode: { [key: string]: string } = {
    INVALID_INPUT: 'INVALID_INPUT',
    CORRUPT_WORKBOOK: 'CORRUPT_WORKBOOK',
    ENCRYPTED_WORKBOOK: 'ENCRYPTED_WORKBOOK',
    UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    MAX_PAGES_EXCEEDED: 'MAX_PAGES_EXCEEDED',
    MAX_CELLS_EXCEEDED: 'MAX_CELLS_EXCEEDED',
    MAX_IMAGE_BYTES_EXCEEDED: 'MAX_IMAGE_BYTES_EXCEEDED',
    TIMEOUT_EXCEEDED: 'TIMEOUT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR'
};
