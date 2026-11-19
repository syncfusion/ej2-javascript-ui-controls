import { _UniPlan } from '../pdf-document-helper';
/** Odd-parity (L-code) 7-module digit patterns, 1 = bar and 0 = space (ISO/IEC 15420). */
export const _eanLeftPatterns: ReadonlyArray<string> = Object.freeze([
    '0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'
]);
/** Right-hand (R-code) patterns: the bitwise complement of the L-codes. */
export const _eanRightPatterns: ReadonlyArray<string> = Object.freeze(_eanLeftPatterns.map((p: string): string => {
    return p.split('').map((c: string): string => c === '1' ? '0' : '1').join('');
}));
/** Start and end guard. */
export const _eanOuterGuard: string = '101';
/** Centre guard. */
export const _eanCentreGuard: string = '01010';
/**
 * Calculates the modulo-10 check digit of a numeric string whose last digit is weighted 3.
 *
 * @param {string} digits The data digits without the check digit.
 * @returns {number} The check digit.
 */
export function _eanCheckDigit(digits: string): number {
    let sum: number = 0;
    for (let i: number = 0; i < digits.length; i++) {
        const weight: number = (digits.length - i) % 2 === 1 ? 3 : 1;
        sum += (digits.charCodeAt(i) - 48) * weight;
    }
    return (10 - sum % 10) % 10;
}
/**
 * Builds the immutable plan from a module string where 1 is a bar and 0 is a space.
 *
 * @param {string} modules The module string, starting and ending with a bar.
 * @param {string} caption The human-readable text.
 * @returns {_UniPlan} The plan.
 */
export function _eanPlanFromModules(modules: string, caption: string): _UniPlan {
    const runs: number[] = [];
    let i: number = 0;
    while (i < modules.length) {
        let j: number = i;
        while (j < modules.length && modules.charAt(j) === modules.charAt(i)) {
            j++;
        }
        runs.push(j - i);
        i = j;
    }
    return Object.freeze({ runs: Object.freeze(runs), moduleCount: modules.length, displayText: caption });
}
