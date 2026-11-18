/**
 * String substring / whole-word matcher over a paragraph haystack.
 *
 * @remarks
 * Spec 035:
 * - Empty needle → no matches.
 * - Case-insensitive fold via `toLocaleLowerCase('en-US')` (deterministic).
 * - findAll is non-overlapping: advance by match length after each hit.
 *
 * @internal
 */
import { isWholeWord } from './whole-word';
import { RawMatch } from './types';
/**
 * Folds a string for case-insensitive compare (Phase 7 lock).
 *
 * @internal
 * @param {string} value - The value value.
 * @returns {string} The result.
 */
export function foldCase(value: string): string {
    // TS 3.3 lib typings: String#toLocaleLowerCase accepts 0 args only.
    // Runtime locales still work; fold stays ASCII-stable for en-US content.
    return value.toLocaleLowerCase();
}
/**
 * All non-overlapping string matches in `haystack`.
 *
 * @internal
 * @param {string} haystack - Paragraph concatenated run text.
 * @param {string} needle - Search text; empty → `[]`.
 * @param {boolean} caseSensitive - When false, compare with {@link foldCase}.
 * @param {boolean} wholeWord - When true, keep only {@link isWholeWord} hits.
 * @returns {*} The result.
 */
export function matchString(haystack: string, needle: string, caseSensitive: boolean, wholeWord: boolean): ReadonlyArray<RawMatch> {
    if (needle.length === 0) {
        return [];
    }
    const source: string = caseSensitive ? haystack : foldCase(haystack);
    const target: string = caseSensitive ? needle : foldCase(needle);
    const needleLength: number = target.length;
    if (needleLength === 0) {
        // foldCase should not empty a non-empty needle; guard anyway.
        return [];
    }
    const matches: RawMatch[] = [];
    let i: number = 0;
    while (i <= source.length - needleLength) {
        if (source.startsWith(target, i)) {
            const end: number = i + needleLength;
            if (!wholeWord || isWholeWord(haystack, i, end)) {
                matches.push({
                    start: i,
                    end,
                    text: haystack.slice(i, end)
                });
                // Non-overlapping policy: advance by match length.
                i = end;
                continue;
            }
        }
        i += 1;
    }
    return matches;
}
/**
 * First string match, or `undefined`.
 *
 * @internal
 * @param {string} haystack - The haystack value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {RawMatch | undefined} The result.
 */
export function matchStringFirst(haystack: string, needle: string, caseSensitive: boolean, wholeWord: boolean): RawMatch | undefined {
    const all: ReadonlyArray<RawMatch> = matchString(haystack, needle, caseSensitive, wholeWord);
    return all[0];
}
