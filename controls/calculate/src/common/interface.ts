/**
 * Arguments for the {@link Calculate.onFailure} event when parsing or evaluation fails.
 */
export interface FailureEventArgs {
    /** Error message describing the failure. */
    message: string;
    /** Underlying exception object or message. */
    exception: Object;
    /** Whether the formula can be force-calculated despite the failure. */
    isForceCalculable: boolean;
    /** When set by a listener, requests force calculation. */
    computeForceCalculate?: boolean;
}

/**
 * Metadata and handler for a registered library formula.
 */
export interface IFormulaCollection {
    /** Bound `Compute*` handler invoked by the engine. */
    handler: Function;
    /** When `true`, the formula was registered via {@link Calculate.defineFunction}. */
    isCustom?: boolean;
    /** Category label for Insert Function UI. */
    category?: string;
    /** Short description of the formula. */
    description?: string;
    /** Formula syntax for Insert Function dialog. */
    syntax?: string;
}

/**
 * Working state for multi-criteria IFS formula evaluation.
 *
 * @hidden
 */
export interface StoredCellInfo {
    cellValue: string | string[];
    cellRange: string[];
    criteria: string[];
    argArray: string[];
    isCriteria: string;
    storedCells: string[];
    isCountIfS: string;
    countVal?: number;
}

/**
 * Catalog entry used when registering built-in formulas with {@link BasicFormulas}.
 *
 * @hidden
 */
export interface IBasicFormula {
    /** Excel function name (for example `"SUM"`). */
    formulaName: string;
    /** Category label (for example `"Math & Trig"`). */
    category?: string;
    /** Short description shown in formula UI. */
    description?: string;
    /** Formula syntax for Insert Function dialog. */
    syntax?: string;
}

/**
 * Sheet metadata exposed by a calculate host (workbook / xlsx adapter).
 *
 */
export interface CalculateSheetInfo {
    /** Visible sheet name shown to users. */
    visibleName: string;
    /** Internal sheet token/name used in formulas. */
    sheet: string;
    /** Zero-based sheet index in the host workbook. */
    index: number;
}

/**
 * Result of host-provided date / time parsing.
 *
 * @hidden
 */
export interface CalculateDateParseResult {
    /** Parsed JavaScript date when available. */
    dateObj?: Date;
    /** Whether the value was recognized as a date. */
    isDate?: boolean;
    /** Whether the value was recognized as a time. */
    isTime?: boolean;
    /** Optional normalized value string. */
    value?: string;
}

/**
 * Host contract for integrating Calculate with a workbook or xlsx model.
 *
 * Spreadsheet Workbook implements this; other libraries can provide their own adapter.
 */
export interface ICalculateHost {
    /**
     * Reads a cell value at 1-based row/column for a sheet family.
     *
     * @param {string | number | Object} sheetFamilyID - Sheet family identifier.
     * @param {number} row - 1-based row index.
     * @param {number} col - 1-based column index.
     * @param {string | number | Object} rest - Host-specific extra arguments.
     */
    getValueRowCol?(sheetFamilyID: number, row: number, col: number, ...rest: unknown[]): string | number;
    /**
     * Writes a cell value at 1-based row/column for a sheet family.
     *
     * @param {string | number | Object} sheetFamilyID - Sheet family identifier.
     * @param {string | number | boolean | Object} value - Value to store.
     * @param {number} row - 1-based row index.
     * @param {number} col - 1-based column index.
     * @param {string} formula - Optional formula text associated with the value.
     * @param {string | number | Object} rest - Host-specific extra arguments.
     */
    setValueRowCol?(sheetFamilyID: number, value: string | number, row: number, col: number, formula?: string, ...rest: unknown[]): void;
    /** Returns sheet metadata for name/token resolution. */
    getSheetInfo?(): CalculateSheetInfo[];
    /**
     * Parses locale-aware date/time text.
     *
     * @param {string | number | boolean | Object} value - Date or time string.
     */
    parseDate?(value: string): CalculateDateParseResult;
    /** Host module name (for example `"workbook"`). */
    getModuleName?(): string;
    /** Culture/locale id used for parsing and formatting. */
    locale?: string;
    /** Calculation mode such as `"Automatic"` or `"Manual"`. */
    calculationMode?: string;
}
