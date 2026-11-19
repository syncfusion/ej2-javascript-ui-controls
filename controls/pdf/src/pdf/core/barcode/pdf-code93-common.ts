import { _UniPlan, _Code93PatternMap } from '../pdf-document-helper';
/**
 * Code 93 element widths in modules (bar, space, bar, space, bar, space), nine modules per symbol.
 * The keys a, b, c and d are the internal names of the shift symbols ($), (%), (/) and (+) that can only occur as check characters.
 * The key `*` is the start symbol and `!` is the stop symbol, which carries the termination bar as its seventh element.
 */
export const _code93Patterns: _Code93PatternMap = Object.freeze({
    '0': '131112', '1': '111213', '2': '111312', '3': '111411', '4': '121113', '5': '121212',
    '6': '121311', '7': '111114', '8': '131211', '9': '141111',
    'A': '211113', 'B': '211212', 'C': '211311', 'D': '221112', 'E': '221211', 'F': '231111',
    'G': '112113', 'H': '112212', 'I': '112311', 'J': '122112', 'K': '132111', 'L': '111123',
    'M': '111222', 'N': '111321', 'O': '121122', 'P': '131121', 'Q': '212112', 'R': '212211',
    'S': '211122', 'T': '211221', 'U': '221121', 'V': '222111', 'W': '112122', 'X': '112221',
    'Y': '122121', 'Z': '123111', '-': '121131', '.': '311112', ' ': '311211', '$': '321111',
    '/': '112131', '+': '113121', '%': '211131',
    'a': '121221', 'b': '312111', 'c': '311121', 'd': '122211',
    '*': '111141', '!': '1111411'
});
/** Symbol values 0-46; the last four are the shift symbols used only as check characters. */
export const _code93Values: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd';
const _code93CheckNames: _Code93PatternMap = Object.freeze({ 'a': '($)', 'b': '(%)', 'c': '(/)', 'd': '(+)' });
/**
 * Returns the caption form of a check symbol; shift symbols are shown by their names.
 *
 * @param {string} symbol The check symbol.
 * @returns {string} The caption text.
 */
function _code93CheckName(symbol: string): string {
    const name: string = _code93CheckNames[symbol.charAt(0)];
    return name ? name : symbol;
}
/**
 * Calculates one Code 93 check symbol using weights 1..maxWeight from the rightmost symbol, modulo 47.
 *
 * @param {string} symbols The symbols to weigh.
 * @param {number} maxWeight The weight after which the cycle restarts at 1.
 * @returns {string} The check symbol.
 */
function _code93Check(symbols: string, maxWeight: number): string {
    let sum: number = 0;
    let weight: number = 1;
    for (let i: number = symbols.length - 1; i >= 0; i--) {
        sum += _code93Values.indexOf(symbols.charAt(i)) * weight;
        weight = weight === maxWeight ? 1 : weight + 1;
    }
    return _code93Values.charAt(sum % 47);
}
/**
 * Builds the immutable Code 93 plan from already validated symbols; shared with Code 93 Extended.
 *
 * @param {string} symbols The symbols to encode (values 0-42, without start/stop and check characters).
 * @param {string} caption The human-readable text before check and start/stop decoration.
 * @param {boolean} showCheck Whether the C and K symbols are shown in the caption.
 * @param {boolean} showStartStop Whether start/stop symbols are shown in the caption.
 * @returns {_UniPlan} The plan.
 * @private
 */
export function _createCode93Plan(symbols: string, caption: string, showCheck: boolean, showStartStop: boolean): _UniPlan {
    const text: string = symbols;
    const c: string = _code93Check(text, 20);
    const k: string = _code93Check(text + c, 15);
    const encoded: string = '*' + text + c + k + '!';
    const runs: number[] = [];
    let modules: number = 0;
    for (let i: number = 0; i < encoded.length; i++) {
        const pattern: string = _code93Patterns[encoded.charAt(i)];
        if (!pattern) {
            throw new Error('Code 93 symbol table is missing an entry at position ' + i + '.');
        }
        for (let j: number = 0; j < pattern.length; j++) {
            const width: number = pattern.charCodeAt(j) - 48;
            runs.push(width);
            modules += width;
        }
    }
    let display: string = caption;
    if (showCheck) {
        display += _code93CheckName(c) + _code93CheckName(k);
    }
    if (showStartStop) {
        display = '*' + display + '*';
    }
    return Object.freeze({ runs: Object.freeze(runs), moduleCount: modules, displayText: display });
}
