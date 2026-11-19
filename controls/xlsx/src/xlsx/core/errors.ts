/**
 * Typed library errors for `@syncfusion/ej2-xlsx`.
 *
 * @private Not part of the published package surface. Library code throws these;
 * tests may import them from `src/xlsx/core/errors.js`. Switch on {@link XlsxError.code},
 * never on message text.
 */

/**
 * Stable error code strings thrown by the library.
 *
 * @private
 */
export type XlsxErrorCode =
    | 'INVALID_PACKAGE'
    | 'UNSUPPORTED_ENCRYPTION'
    | 'PACKAGE_LIMIT'
    | 'IO_ERROR'
    | 'INVALID_WORKBOOK'
    | 'DUPLICATE_SHEET_NAME'
    | 'LAST_SHEET'
    | 'INVALID_SHEET_NAME'
    | 'MISSING_WORKSHEET_PART'
    | 'INVALID_SHARED_STRING_INDEX'
    | 'INVALID_SHARED_STRINGS'
    | 'INVALID_STYLE_INDEX'
    | 'INVALID_STYLES'
    | 'INVALID_NUMBER_FORMAT'
    | 'INVALID_ADDRESS'
    | 'INVALID_CELL_VALUE'
    | 'INVALID_ERROR_CODE'
    | 'INVALID_FORMULA'
    | 'INVALID_WORKSHEET'
    | 'INVALID_MERGE_REF'
    | 'MERGE_OVERLAP'
    | 'INVALID_DEFINED_NAME'
    | 'INVALID_DATA_VALIDATION'
    | 'INVALID_CONDITIONAL_FORMATTING'
    | 'INVALID_HYPERLINK'
    | 'INVALID_THREADED_COMMENT'
    | 'INVALID_TABLE'
    | 'INVALID_PIVOT_TABLE'
    | 'INVALID_CHART'
    | 'INVALID_SORT_STATE'
    | 'INVALID_AUTO_FILTER'
    | 'INVALID_PROTECTION'
    | 'INVALID_PASSWORD'
    | 'INVALID_COMMENT'
    | 'INVALID_ARGUMENT';

/**
 * Base error for all library failures.
 *
 * @private
 */
export class XlsxError extends Error {
    /**
     * Stable machine-readable code.
     *
     * @private
     */
    public readonly code: XlsxErrorCode;

    /**
     * Optional OPC part name or ZIP entry related to the failure.
     *
     * @private
     */
    public readonly partName: string | undefined;

    /**
     * Creates an instance.
     *
     * @param {XlsxErrorCode} code - The code parameter.
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(code: XlsxErrorCode, message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        // TS 3.3 Error constructor accepts message only; attach cause when present.
        super(message);
        this.name = 'XlsxError';
        this.code = code;
        this.partName = options == null ? undefined : options.partName;
        const cause: unknown = options == null ? undefined : options.cause;
        if (cause !== undefined) {
            try {
                Object.defineProperty(this, 'cause', {
                    value: cause,
                    configurable: true,
                    writable: true
                });
            } catch {
                // Environments without defineProperty on Error: ignore.
            }
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Package structure is missing, corrupt, or not a ZIP-based OPC container.
 *
 * @private
 */
export class InvalidPackageError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_PACKAGE', message, options);
        this.name = 'InvalidPackageError';
    }
}

/**
 * Encrypted Office package (CFB / OOXML encryption). Decrypt is out of scope.
 *
 * @private
 */
export class UnsupportedEncryptionError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('UNSUPPORTED_ENCRYPTION', message, options);
        this.name = 'UnsupportedEncryptionError';
    }
}

/**
 * ZIP/OPC safety ceiling exceeded (entry count, uncompressed size, etc.).
 *
 * @private
 */
export class PackageLimitError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('PACKAGE_LIMIT', message, options);
        this.name = 'PackageLimitError';
    }
}

/**
 * Underlying codec or byte I/O failure wrapped for consumers.
 *
 * @private
 */
export class IoError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('IO_ERROR', message, options);
        this.name = 'IoError';
    }
}

/**
 * Workbook part XML is missing, has the wrong root, or fails structural checks.
 *
 * @private
 */
export class InvalidWorkbookError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_WORKBOOK', message, options);
        this.name = 'InvalidWorkbookError';
    }
}

/**
 * Sheet name collides with an existing sheet (Excel case-insensitive uniqueness).
 *
 * @private
 */
export class DuplicateSheetNameError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('DUPLICATE_SHEET_NAME', message, options);
        this.name = 'DuplicateSheetNameError';
    }
}

/**
 * Attempted to remove the last worksheet from the workbook.
 *
 * @private
 */
export class LastSheetError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('LAST_SHEET', message, options);
        this.name = 'LastSheetError';
    }
}

/**
 * Sheet name is empty, too long, or contains Excel-illegal characters.
 *
 * @private
 */
export class InvalidSheetNameError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_SHEET_NAME', message, options);
        this.name = 'InvalidSheetNameError';
    }
}

/**
 * Workbook relationship target for a worksheet is missing from the package.
 *
 * @private
 */
export class MissingWorksheetPartError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('MISSING_WORKSHEET_PART', message, options);
        this.name = 'MissingWorksheetPartError';
    }
}

/**
 * Cell or API requested a shared-string index that is not present in the SST.
 *
 * @private
 */
export class InvalidSharedStringIndexError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_SHARED_STRING_INDEX', message, options);
        this.name = 'InvalidSharedStringIndexError';
    }
}

/**
 * Shared strings part XML is missing the expected root or is structurally invalid.
 *
 * @private
 */
export class InvalidSharedStringsError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_SHARED_STRINGS', message, options);
        this.name = 'InvalidSharedStringsError';
    }
}

/**
 * Cell or API requested a cellXfs / style index that is not present.
 *
 * @private
 */
export class InvalidStyleIndexError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_STYLE_INDEX', message, options);
        this.name = 'InvalidStyleIndexError';
    }
}

/**
 * Styles part XML is missing the expected root or is structurally invalid.
 *
 * @private
 */
export class InvalidStylesError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_STYLES', message, options);
        this.name = 'InvalidStylesError';
    }
}

/**
 * Custom number format code is empty or otherwise invalid for `numFmt` authoring.
 *
 * @private
 */
export class InvalidNumberFormatError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_NUMBER_FORMAT', message, options);
        this.name = 'InvalidNumberFormatError';
    }
}

/**
 * A1 address token is malformed or outside the Excel grid.
 *
 * @private
 */
export class InvalidAddressError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_ADDRESS', message, options);
        this.name = 'InvalidAddressError';
    }
}

/**
 * Cell value is not a supported {@link CellValue} shape.
 *
 * @private
 */
export class InvalidCellValueError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_CELL_VALUE', message, options);
        this.name = 'InvalidCellValueError';
    }
}

/**
 * Error cell code is not a recognized Excel error string.
 *
 * @private
 */
export class InvalidErrorCodeError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_ERROR_CODE', message, options);
        this.name = 'InvalidErrorCodeError';
    }
}

/**
 * Formula text or type is invalid for the cell formula API.
 *
 * Empty expression for a normal formula, or an unrecognized ST_CellFormulaType.
 * The library never evaluates formulas; this only covers API input checks.
 *
 * @private
 */
export class InvalidFormulaError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_FORMULA', message, options);
        this.name = 'InvalidFormulaError';
    }
}

/**
 * Worksheet part XML is missing the expected root or is structurally invalid.
 *
 * @private
 */
export class InvalidWorksheetError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_WORKSHEET', message, options);
        this.name = 'InvalidWorksheetError';
    }
}

/**
 * Merge range ref is unparseable, inverted, empty, or outside the Excel grid.
 *
 * @private
 */
export class InvalidMergeRefError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_MERGE_REF', message, options);
        this.name = 'InvalidMergeRefError';
    }
}

/**
 * New merge range overlaps an existing merge on the worksheet.
 *
 * @private
 */
export class MergeOverlapError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('MERGE_OVERLAP', message, options);
        this.name = 'MergeOverlapError';
    }
}

/**
 * Defined name is empty or otherwise invalid for authoring.
 *
 * @private
 */
export class InvalidDefinedNameError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_DEFINED_NAME', message, options);
        this.name = 'InvalidDefinedNameError';
    }
}

/**
 * Data validation rule or sqref is invalid (unknown enum, bad range, empty list source).
 *
 * @private
 */
export class InvalidDataValidationError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_DATA_VALIDATION', message, options);
        this.name = 'InvalidDataValidationError';
    }
}

/**
 * Conditional formatting rule or sqref is invalid (unknown enum, bad range, bad priority).
 *
 * @private
 */
export class InvalidConditionalFormattingError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_CONDITIONAL_FORMATTING', message, options);
        this.name = 'InvalidConditionalFormattingError';
    }
}

/**
 * Hyperlink ref or target is invalid (empty target, bad ref, unusable location).
 *
 * @private
 */
export class InvalidHyperlinkError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_HYPERLINK', message, options);
        this.name = 'InvalidHyperlinkError';
    }
}

/**
 * Threaded comment is invalid (duplicate cell thread, bad handle/target, empty text shape).
 *
 * @private
 */
export class InvalidThreadedCommentError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_THREADED_COMMENT', message, options);
        this.name = 'InvalidThreadedCommentError';
    }
}

/**
 * Table definition is invalid (duplicate displayName, bad range, empty columns,
 * unknown tableType/totalsRowFunction on authoring).
 *
 * @private
 */
export class InvalidTableError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_TABLE', message, options);
        this.name = 'InvalidTableError';
    }
}

/**
 * Pivot cache or pivot table definition is invalid (unusable source range,
 * blank or duplicate source headings, unknown field, duplicate name, or a
 * location that cannot hold the table).
 *
 * @private
 */
export class InvalidPivotTableError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_PIVOT_TABLE', message, options);
        this.name = 'InvalidPivotTableError';
    }
}

/**
 * Chart definition is invalid (unsupported type, missing series/data range,
 * bad anchor, or unusable chart package wiring).
 *
 * @private
 */
export class InvalidChartError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_CHART', message, options);
        this.name = 'InvalidChartError';
    }
}

/**
 * Sort state or sort condition is invalid (unparseable ref, condition ref
 * not contained in the state ref, unknown enum on authoring).
 *
 * @private
 */
export class InvalidSortStateError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_SORT_STATE', message, options);
        this.name = 'InvalidSortStateError';
    }
}

/**
 * AutoFilter or filter column is invalid (unparseable ref, bad colId on
 * authoring, stale handle after replace/clear).
 */
export class InvalidAutoFilterError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_AUTO_FILTER', message, options);
        this.name = 'InvalidAutoFilterError';
    }
}

/**
 * Sheet, workbook, or protected-range protection is invalid (bad password,
 * options, or hash material; unprotect mismatch).
 *
 * @private
 */
export class InvalidProtectionError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_PROTECTION', message, options);
        this.name = 'InvalidProtectionError';
    }
}

/**
 * The open password is missing or wrong for an encrypted workbook, or a password
 * supplied for encryption is not acceptable.
 *
 * @private
 */
export class InvalidPasswordError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_PASSWORD', message, options);
        this.name = 'InvalidPasswordError';
    }
}

/**
 * Classic comment / note is invalid (bad cell ref, author, text, or package
 * comments wiring).
 *
 * @private
 */
export class InvalidCommentError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_COMMENT', message, options);
        this.name = 'InvalidCommentError';
    }
}

/**
 * API argument is missing or empty where a value is required.
 *
 * @private
 */
export class InvalidArgumentError extends XlsxError {
    /**
     * Creates an instance.
     *
     * @param {string} message - The message parameter.
     * @param {Object} [options] - Optional error metadata.
     * @param {*} [options.cause] - Optional underlying cause.
     * @param {string} [options.partName] - Optional OPC part name.
     */
    public constructor(message: string, options?: { readonly cause?: unknown; readonly partName?: string }) {
        super('INVALID_ARGUMENT', message, options);
        this.name = 'InvalidArgumentError';
    }
}

/**
 * Type guard for {@link XlsxError}.
 *
 * @param {*} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
export function isXlsxError(value: unknown): value is XlsxError {
    return value instanceof XlsxError;
}
