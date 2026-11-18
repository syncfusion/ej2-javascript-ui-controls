import { _UniPlan } from '../pdf-document-helper';
/**
 * Code 39 element widths (bar, space, bar, ...; 1 = narrow, 3 = wide), 9 elements per symbol.
 * Narrow:wide ratio is 1:3 and exactly three elements of every symbol are wide.
 */
export const _code39Patterns: { readonly [key: string]: string } = Object.freeze({
    '0': '111331311', '1': '311311113', '2': '113311113', '3': '313311111', '4': '111331113',
    '5': '311331111', '6': '113331111', '7': '111311313', '8': '311311311', '9': '113311311',
    'A': '311113113', 'B': '113113113', 'C': '313113111', 'D': '111133113', 'E': '311133111',
    'F': '113133111', 'G': '111113313', 'H': '311113311', 'I': '113113311', 'J': '111133311',
    'K': '311111133', 'L': '113111133', 'M': '313111131', 'N': '111131133', 'O': '311131131',
    'P': '113131131', 'Q': '111111333', 'R': '311111331', 'S': '113111331', 'T': '111131331',
    'U': '331111113', 'V': '133111113', 'W': '333111111', 'X': '131131113', 'Y': '331131111',
    'Z': '133131111', '-': '131111313', '.': '331111311', ' ': '133111311', '*': '131131311',
    '$': '131313111', '/': '131311131', '+': '131113131', '%': '111313131'
});
/** Symbol values 0-42 in Mod-43 order. */
export const _code39Alphabet: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
export const _code39StartStop: string = '*';
/**
 * Builds the immutable Code 39 plan from already validated, expanded symbols.
 *
 * @param {string} symbols The Code 39 symbols to encode (without start/stop).
 * @param {string} caption The human-readable text before check digit and start/stop decoration.
 * @param {boolean} enableCheck Whether the Mod-43 check symbol is encoded.
 * @param {boolean} showCheck Whether the check symbol is shown in the caption.
 * @param {boolean} showStartStop Whether start/stop are shown in the caption.
 * @returns {_UniPlan} The plan.
 * @private
 */
export function _createCode39Plan(symbols: string, caption: string, enableCheck: boolean,
                                  showCheck: boolean, showStartStop: boolean): _UniPlan {
    let sum: number = 0;
    for (let i: number = 0; i < symbols.length; i++) {
        const value: number = _code39Alphabet.indexOf(symbols.charAt(i));
        if (value < 0) {
            throw new Error('Code 39 symbol table is missing an entry at position ' + i + '.');
        }
        sum += value;
    }
    const check: string = enableCheck ? _code39Alphabet.charAt(sum % 43) : '';
    const encoded: string = _code39StartStop + symbols + check + _code39StartStop;
    const runs: number[] = [];
    let modules: number = 0;
    for (let i: number = 0; i < encoded.length; i++) {
        const pattern: string = _code39Patterns[encoded.charAt(i)];
        if (!pattern) {
            throw new Error('Code 39 symbol table is missing an entry at position ' + i + '.');
        }
        for (let j: number = 0; j < pattern.length; j++) {
            const w: number = pattern.charCodeAt(j) - 48;
            runs.push(w);
            modules += w;
        }
        if (i < encoded.length - 1) {
            runs.push(1);
            modules += 1;
        }
    }
    let display: string = enableCheck && showCheck ? caption + check : caption;
    if (showStartStop) {
        display = _code39StartStop + display + _code39StartStop;
    }
    return Object.freeze({ runs: Object.freeze(runs), moduleCount: modules, displayText: display });
}
