import { _UniPlan } from '../pdf-document-helper';
/**
 * Code 128 element widths (bar, space, bar, space, bar, space) indexed by symbol value 0-105 (ISO/IEC 15417 Table 1).
 * Index 103, 104 and 105 are Start A, Start B and Start C; index 106 is the stop symbol with its termination bar.
 */
export const _code128Patterns: ReadonlyArray<string> = Object.freeze([
    '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312',
    '132212', '221213', '221312', '231212', '112232', '122132', '122231', '113222',
    '123122', '123221', '223211', '221132', '221231', '213212', '223112', '312131',
    '311222', '321122', '321221', '312212', '322112', '322211', '212123', '212321',
    '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
    '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121',
    '313121', '211331', '231131', '213113', '213311', '213131', '311123', '311321',
    '331121', '312113', '312311', '332111', '314111', '221411', '431111', '111224',
    '111422', '121124', '121421', '141122', '141221', '112214', '112412', '122114',
    '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
    '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112',
    '421211', '212141', '214121', '412121', '111143', '111341', '131141', '114113',
    '114311', '411113', '411311', '113141', '114131', '311141', '411131', '211412',
    '211214', '211232', '2331112'
]);
export const _code128StartA: number = 103;
export const _code128StartB: number = 104;
export const _code128StartC: number = 105;
export const _code128Stop: number = 106;
export const _code128CodeB: number = 100;
export const _code128CodeC: number = 99;
export const _code128Fnc1: number = 102;
/**
 * Calculates the Mod-103 check value: the start value plus each following symbol value times its one-based position.
 *
 * @param {number[]} symbols The start symbol followed by the data and switch symbols.
 * @returns {number} The check value.
 */
export function _code128Check(symbols: number[]): number {
    let sum: number = symbols[0];
    for (let i: number = 1; i < symbols.length; i++) {
        sum += symbols[<number>i] * i;
    }
    return sum % 103;
}
/**
 * Builds the immutable plan from logical symbols; the check symbol and stop are appended here.
 *
 * @param {number[]} symbols The start symbol followed by the data and switch symbols.
 * @param {string} caption The human-readable text, which never contains control symbols.
 * @returns {_UniPlan} The plan.
 */
export function _createCode128Plan(symbols: number[], caption: string): _UniPlan {
    const all: number[] = symbols.concat([_code128Check(symbols), _code128Stop]);
    const runs: number[] = [];
    let modules: number = 0;
    for (let i: number = 0; i < all.length; i++) {
        const pattern: string = _code128Patterns[all[<number>i]];
        if (!pattern) {
            throw new Error('Code 128 symbol table is missing an entry at position ' + i + '.');
        }
        for (let j: number = 0; j < pattern.length; j++) {
            const width: number = pattern.charCodeAt(j) - 48;
            runs.push(width);
            modules += width;
        }
    }
    return Object.freeze({ runs: Object.freeze(runs), moduleCount: modules, displayText: caption });
}
