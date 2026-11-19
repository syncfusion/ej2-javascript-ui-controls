/**
 * Whole-word boundary helpers for string find (spec 035).
 *
 * @remarks
 * `isWordChar` = Unicode letter OR number OR underscore (`_`).
 * Node `>=20.11` / `ES2022` supports `\p{L}` / `\p{N}` with the `u` flag.
 * Underscore is included explicitly (not `\p{L}`) for common search parity.
 *
 * @internal
 */
/** Word-character test: `\p{L}` | `\p{N}` | `_` (one BMP/UTF-16 code unit or surrogate pair via `u`). */
const WORD_CHAR: RegExp = /^(?:\p{L}|\p{N}|_)$/u;
/**
 * Returns whether `ch` counts as a word character for whole-word find.
 *
 * @internal
 * @param {string} ch - A single JS string position’s character (may be a surrogate pair when taken via code point).
 * @returns {boolean} The result.
 */
export function isWordChar(ch: string): boolean {
    if (ch.length === 0) {
        return false;
    }
    return WORD_CHAR.test(ch);
}
/**
 * Character at UTF-16 index `index`, using a full code point when a surrogate pair starts there.
 *
 * @internal
 * @param {string} haystack - The haystack value.
 * @param {number} index - The index value.
 * @returns {string} The result.
 */
export function codePointAtIndex(haystack: string, index: number): string {
    if (index < 0 || index >= haystack.length) {
        return '';
    }
    const codePoint: number = haystack.codePointAt(index);
    if (codePoint === undefined) {
        return '';
    }
    return String.fromCodePoint(codePoint);
}
/**
 * True when `[start, end)` is a whole-word occurrence in `H`.
 *
 * @remarks Boundaries use the code point before `start` and the code point at `end`. Spec 035: `start === 0` or not word-char before; `end
 * === H.length` or not word-char at end.
 * @internal
 * @param {string} haystack - The haystack value.
 * @param {number} start - The start value.
 * @param {number} end - The end value.
 * @returns {boolean} The result.
 */
export function isWholeWord(haystack: string, start: number, end: number): boolean {
    if (start < 0 || end < start || end > haystack.length) {
        return false;
    }
    if (start > 0) {
        // Previous code point may start one or two UTF-16 units before `start`.
        const prevIndex: number = start - 1;
        const lead: number = prevIndex > 0 ? haystack.charCodeAt(prevIndex - 1) : 0;
        const isTrail: boolean = prevIndex > 0 &&
            lead >= 0xd800 &&
            lead <= 0xdbff &&
            haystack.charCodeAt(prevIndex) >= 0xdc00 &&
            haystack.charCodeAt(prevIndex) <= 0xdfff;
        const prevCpIndex: number = isTrail ? prevIndex - 1 : prevIndex;
        if (isWordChar(codePointAtIndex(haystack, prevCpIndex))) {
            return false;
        }
    }
    if (end < haystack.length) {
        if (isWordChar(codePointAtIndex(haystack, end))) {
            return false;
        }
    }
    return true;
}
