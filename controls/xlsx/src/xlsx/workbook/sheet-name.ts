/**
 * Excel-compatible sheet name validation.
 *
 * Citations:
 * - Length ≤ 31 and uniqueness case-insensitive: [MS-OI29500] 2.1.578 sheet
 * - Forbidden base characters `' * [ ] \ : / ?`: [MS-XLSX] sheet-name-base-character
 *
 * @private
 */

import { InvalidSheetNameError } from '../core/errors';

/** Maximum sheet name length (Excel / [MS-OI29500]). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const MAX_SHEET_NAME_LENGTH: 31 = 31;

/**
 * Characters that must not appear in a sheet name (Excel-illegal base set).
 * Apostrophe is banned entirely for simplicity (leading/trailing rules collapse).
 */
const FORBIDDEN_SHEET_NAME_CHARS: Set<string> = new Set(['\'', '*', '[', ']', '\\', '/', '?', ':']);

/**
 * Validate a proposed sheet name. Throws {@link InvalidSheetNameError} when illegal.
 *
 * @param {string} name - The name parameter.
 * @returns {void} - Returns the result.
 */
export function validateSheetName(name: string): void {
    if (name.length === 0) {
        throw new InvalidSheetNameError('Sheet name must not be empty');
    }
    if (name.length > MAX_SHEET_NAME_LENGTH) {
        throw new InvalidSheetNameError(`Sheet name length ${name.length} exceeds maximum ${MAX_SHEET_NAME_LENGTH}`);
    }
    for (let i: number = 0; i < name.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = name[i];
        if (ch !== undefined && FORBIDDEN_SHEET_NAME_CHARS.has(ch)) {
            throw new InvalidSheetNameError(`Sheet name contains illegal character ${JSON.stringify(ch)}`);
        }
    }
}

/**
 * Case-insensitive sheet name equality (Excel uniqueness rule).
 *
 * @param {string} a - The a parameter.
 * @param {string} b - The b parameter.
 * @returns {boolean} - Returns the result.
 */
export function sheetNamesEqual(a: string, b: string): boolean {
    return a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0;
}

/**
 * Normalize for map keys: Unicode case-fold via lower-case. Excel treats names as case-insensitive; locale-independent lower is sufficient.
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
export function sheetNameKey(name: string): string {
    return name.toLocaleLowerCase();
}
