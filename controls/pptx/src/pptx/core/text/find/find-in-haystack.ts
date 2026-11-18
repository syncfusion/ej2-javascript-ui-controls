/**
 * High-level find helpers over a single paragraph haystack.
 *
 * @internal
 */
import { mapAllRawToAnchors, mapRawToAnchors } from './map-anchors';
import { matchRegExp, matchRegExpFirst } from './match-regexp';
import { matchString, matchStringFirst } from './match-string';
import { AnchoredMatch, ParagraphHaystack, RawMatch } from './types';
/**
 * All string matches in one haystack, with run anchors.
 *
 * @internal
 * @param {ParagraphHaystack} haystack - The haystack value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {*} The result.
 */
export function findAllStringInHaystack(haystack: ParagraphHaystack, needle: string, caseSensitive: boolean,
                                        wholeWord: boolean): ReadonlyArray<AnchoredMatch> {
    const raw: ReadonlyArray<RawMatch> = matchString(haystack.haystack, needle, caseSensitive, wholeWord);
    return mapAllRawToAnchors(raw, haystack);
}
/**
 * First string match in one haystack, or `undefined`.
 *
 * @internal
 * @param {ParagraphHaystack} haystack - The haystack value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {AnchoredMatch | undefined} The result.
 */
export function findStringInHaystack(haystack: ParagraphHaystack, needle: string, caseSensitive: boolean,
                                     wholeWord: boolean): AnchoredMatch | undefined {
    const raw: RawMatch = matchStringFirst(haystack.haystack, needle, caseSensitive, wholeWord);
    if (raw === undefined) {
        return undefined;
    }
    return mapRawToAnchors(raw, haystack);
}
/**
 * All regex matches in one haystack, with run anchors.
 *
 * @internal
 * @param {ParagraphHaystack} haystack - The haystack value.
 * @param {RegExp} regex - The regex value.
 * @returns {*} The result.
 */
export function findAllRegExpInHaystack(haystack: ParagraphHaystack, regex: RegExp): ReadonlyArray<AnchoredMatch> {
    const raw: ReadonlyArray<RawMatch> = matchRegExp(haystack.haystack, regex);
    return mapAllRawToAnchors(raw, haystack);
}
/**
 * First regex match in one haystack, or `undefined`.
 *
 * @internal
 * @param {ParagraphHaystack} haystack - The haystack value.
 * @param {RegExp} regex - The regex value.
 * @returns {AnchoredMatch | undefined} The result.
 */
export function findRegExpInHaystack(haystack: ParagraphHaystack, regex: RegExp): AnchoredMatch | undefined {
    const raw: RawMatch = matchRegExpFirst(haystack.haystack, regex);
    if (raw === undefined) {
        return undefined;
    }
    return mapRawToAnchors(raw, haystack);
}
