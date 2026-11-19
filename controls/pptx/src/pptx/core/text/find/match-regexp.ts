/**
 * RegExp matcher over a paragraph haystack with lastIndex isolation.
 *
 * @remarks
 * Spec 035:
 * - Save/restore consumer `RegExp.lastIndex`.
 * - Collect all non-overlapping matches per haystack without requiring caller `g`.
 * - Honor caller flags `i` / `u` / `m` / `s` (and `y` when present on the clone).
 * - Zero-length matches: advance cursor by one UTF-16 code unit so findAll terminates.
 *
 * @internal
 */
import { RawMatch } from './types';
/**
 * Builds an internal global scanner from the consumer regex flags.
 *
 * @remarks
 * Always adds `g` for collection. Preserves `i`, `m`, `s`, `u`, `v`, `y` from the
 * consumer. Drops consumer `d` (indices) as unused. Does not mutate the consumer.
 *
 * @internal
 */
import { stringIncludes, arrayAt } from '../../util/es5-compat';
/**
 *
 * @param {RegExp} regex - The regex value.
 * @returns {RegExp} The result.
 */
function createScanner(regex: RegExp): RegExp {
    let flags: string = 'g';
    const sourceFlags: string = regex.flags;
    for (let i: number = 0; i < sourceFlags.length; i++) {
        const flag: string = arrayAt(sourceFlags, i);
        if (flag === 'g') {
            continue;
        }
        if (!stringIncludes(flags, flag)) {
            flags += flag;
        }

    }
    // Clone from a consumer RegExp only (source already compiled by the engine).
    // eslint-disable-next-line security/detect-non-literal-regexp -- flags remix of an existing RegExp
    return new RegExp(regex.source, flags);
}
/**
 * All non-overlapping regex matches in `haystack`.
 *
 * @internal
 * @param {string} haystack - Paragraph concatenated run text.
 * @param {RegExp} regex - Consumer pattern; `lastIndex` is saved and restored.
 * @returns {*} The result.
 */
export function matchRegExp(haystack: string, regex: RegExp): ReadonlyArray<RawMatch> {
    const savedLastIndex: number = regex.lastIndex;
    try {
        const scanner: RegExp = createScanner(regex);
        scanner.lastIndex = 0;
        const matches: RawMatch[] = [];
        for (;;) {
            const result: RegExpExecArray = scanner.exec(haystack);
            if (result === null) {
                break;
            }
            const start: number = result.index;
            const matched: string = result[0];
            const end: number = start + matched.length;
            matches.push({
                start,
                end,
                text: matched
            });
            if (matched.length === 0) {
                // Explicit empty-match guard (in addition to engine lastIndex quirks).
                if (start >= haystack.length) {
                    break;
                }
                scanner.lastIndex = start + 1;
            }
            else if (scanner.lastIndex === start) {
                // Pathological: engine did not advance — force progress.
                if (start >= haystack.length) {
                    break;
                }
                scanner.lastIndex = start + 1;
            }
        }
        return matches;
    }
    finally {
        regex.lastIndex = savedLastIndex;
    }
}
/**
 * First regex match in `haystack`, or `undefined`.
 *
 * @internal
 * @param {string} haystack - The haystack value.
 * @param {RegExp} regex - The regex value.
 * @returns {RawMatch | undefined} The result.
 */
export function matchRegExpFirst(haystack: string, regex: RegExp): RawMatch | undefined {
    const all: ReadonlyArray<RawMatch> = matchRegExp(haystack, regex);
    return all[0];
}
