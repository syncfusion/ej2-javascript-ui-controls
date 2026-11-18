import { pointToTwips, twipsToPoint } from '../document/length';
import { PageOrientation } from './page-orientation';
import { PageNumberStyle, isPageNumberStyleWire } from './page-number-style';
import { SectionBreakCode } from './section-break-code';

/** Twips range for page size / margins (0–22 in). */
export const TWIPS_MAX: number = 31680;
/** Schema max for `w:cols/w:col` (`CT_Columns`). */
export const TEXT_COLUMNS_MAX: number = 45;
/** Default equal-column gap: 0.5 in (720 twips → points). */
export const DEFAULT_COLUMN_SPACE: number = twipsToPoint(720);

/**
 * @param {string} message - The message.
 * @returns {Error} The result.
 * @private
 */
export function sectionsError(message: string): Error {
    return new Error(`sections: ${message}`);
}

/**
 * Validate a section length in points against the 0…31680 twips range.
 *
 * @param {number} value - The value.
 * @param {string} label - The label.
 * @returns {number} The result.
 * @private
 */
export function validateSectionLength(value: number, label: string): number {
    const twips: number = pointToTwips(value);
    if (!Number.isFinite(twips) || twips < 0 || twips > TWIPS_MAX) {
        throw sectionsError(`${label} must be in 0…${String(TWIPS_MAX)} twips (0–22 in)`);
    }
    return value;
}

/**
 * @param {PageOrientation} value - The value.
 * @returns {PageOrientation} The result.
 * @private
 */
export function validatePageOrientation(value: PageOrientation): PageOrientation {
    switch (value) {
    case PageOrientation.Portrait:
    case PageOrientation.Landscape:
        return value;
    default: {
        const _exhaustive: never = value;
        void _exhaustive;
        throw sectionsError('orientation must be PageOrientation.Portrait or PageOrientation.Landscape');
    }
    }
}

/**
 * @param {SectionBreakCode} value - The value.
 * @returns {SectionBreakCode} The result.
 * @private
 */
export function validateSectionBreakCode(value: SectionBreakCode): SectionBreakCode {
    switch (value) {
    case SectionBreakCode.NewPage:
    case SectionBreakCode.Continuous:
    case SectionBreakCode.NewColumn:
    case SectionBreakCode.EvenPage:
    case SectionBreakCode.OddPage:
        return value;
    default: {
        const _exhaustive: never = value;
        void _exhaustive;
        throw sectionsError('breakCode must be a valid SectionBreakCode value');
    }
    }
}

/**
 * @param {PageNumberStyle} value - The value.
 * @returns {PageNumberStyle} The result.
 * @private
 */
export function validatePageNumberStyle(value: PageNumberStyle): PageNumberStyle {
    if (!isPageNumberStyleWire(value as string)) {
        throw sectionsError('pageNumberStyle is not a supported PageNumberStyle value');
    }
    return value;
}

/**
 * @param {number} value - The value.
 * @param {string} label - The label.
 * @returns {number} The result.
 * @private
 */
export function validatePositiveInteger(value: number, label: string): number {
    if (!Number.isInteger(value) || value < 1) {
        throw sectionsError(`${label} must be an integer ≥ 1`);
    }
    return value;
}

/**
 * @param {number} value - The value.
 * @param {string} label - The label.
 * @returns {number} The result.
 * @private
 */
export function validateNonNegativeInteger(value: number, label: string): number {
    if (!Number.isInteger(value) || value < 0) {
        throw sectionsError(`${label} must be a non-negative integer`);
    }
    return value;
}

/**
 * @param {number} count - The count.
 * @returns {number} The result.
 * @private
 */
export function validateColumnCount(count: number): number {
    if (!Number.isInteger(count) || count < 1 || count > TEXT_COLUMNS_MAX) {
        throw sectionsError(`columns.count must be an integer in 1…${String(TEXT_COLUMNS_MAX)}`);
    }
    return count;
}
