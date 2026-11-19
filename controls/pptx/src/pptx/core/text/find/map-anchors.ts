import { arrayAt } from '../../util/es5-compat';
/**
 * Maps haystack offsets to text-part indices and in-run offsets.
 *
 * @remarks
 * Indices are UTF-16 code units (JS string index semantics), matching
 * `String.prototype` and {@link TextPart.text}.
 *
 * @internal
 */
import { AnchoredMatch, HaystackRun, ParagraphHaystack, RawMatch } from './types';
/**
 * Maps an inclusive start index to a text part and in-run offset.
 *
 * @internal
 * @param {*} runs - The runs value.
 * @param {number} haystackLength - The haystackLength value.
 * @param {number} index - The index value.
 * @returns {object} The result.
 */
export function mapStartOffset(runs: ReadonlyArray<HaystackRun>, haystackLength: number, index: number): {
    readonly textPartIndex: number;
    readonly offset: number;
} {
    if (runs.length === 0) {
        return { textPartIndex: 0, offset: 0 };
    }
    for (let i: number = 0; i < runs.length; i++) {
        const run: HaystackRun = arrayAt(runs, i);
        const runEnd: number = run.startInHaystack + run.text.length;
        // Prefer the run that owns this inclusive index; at a boundary between runs,
        // the next run starts at `runEnd` and owns the start anchor.
        if (index >= run.startInHaystack && index < runEnd) {
            return {
                textPartIndex: run.textPartIndex,
                offset: index - run.startInHaystack
            };
        }

    }
    // Empty match at end of haystack (or index clamped to length).
    if (index >= haystackLength) {
        const last: HaystackRun = runs[runs.length - 1];
        if (last === undefined) {
            return { textPartIndex: 0, offset: 0 };
        }
        return {
            textPartIndex: last.textPartIndex,
            offset: last.text.length
        };
    }
    // Fallback: nearest preceding run end (should be rare with well-formed maps).
    const last: HaystackRun = runs[runs.length - 1];
    if (last === undefined) {
        return { textPartIndex: 0, offset: 0 };
    }
    return {
        textPartIndex: last.textPartIndex,
        offset: last.text.length
    };
}
/**
 * Maps an exclusive end index to a text part and in-run offset.
 *
 * @internal
 * @param {*} runs - The runs value.
 * @param {number} index - The index value.
 * @returns {object} The result.
 */
export function mapEndOffset(runs: ReadonlyArray<HaystackRun>, index: number): {
    readonly textPartIndex: number;
    readonly offset: number;
} {
    if (runs.length === 0) {
        return { textPartIndex: 0, offset: 0 };
    }
    if (index <= 0) {
        const first: HaystackRun = runs[0];
        if (first === undefined) {
            return { textPartIndex: 0, offset: 0 };
        }
        return { textPartIndex: first.textPartIndex, offset: 0 };
    }
    for (let i: number = 0; i < runs.length; i++) {
        const run: HaystackRun = arrayAt(runs, i);
        const runEnd: number = run.startInHaystack + run.text.length;
        // Exclusive end prefers the run that ends at or after `index` and started before it.
        if (index > run.startInHaystack && index <= runEnd) {
            return {
                textPartIndex: run.textPartIndex,
                offset: index - run.startInHaystack
            };
        }

    }
    const last: HaystackRun = runs[runs.length - 1];
    if (last === undefined) {
        return { textPartIndex: 0, offset: 0 };
    }
    return {
        textPartIndex: last.textPartIndex,
        offset: last.text.length
    };
}
/**
 * Converts a raw haystack match into run-local anchors.
 *
 * @internal
 * @param {RawMatch} raw - The raw value.
 * @param {ParagraphHaystack} haystack - The haystack value.
 * @returns {AnchoredMatch} The result.
 */
export function mapRawToAnchors(raw: RawMatch, haystack: ParagraphHaystack): AnchoredMatch {
    const start: { readonly textPartIndex: number; readonly offset: number; } = mapStartOffset(haystack.runs, haystack.haystack.length,
                                                                                               raw.start);
    const end: { readonly textPartIndex: number; readonly offset: number; } = mapEndOffset(haystack.runs, raw.end);
    return {
        start: raw.start,
        end: raw.end,
        text: raw.text,
        startTextPartIndex: start.textPartIndex,
        startTextPartOffset: start.offset,
        endTextPartIndex: end.textPartIndex,
        endTextPartOffset: end.offset
    };
}
/**
 * Maps every raw match through {@link mapRawToAnchors}.
 *
 * @internal
 * @param {*} rawMatches - The rawMatches value.
 * @param {ParagraphHaystack} haystack - The haystack value.
 * @returns {*} The result.
 */
export function mapAllRawToAnchors(rawMatches: ReadonlyArray<RawMatch>, haystack: ParagraphHaystack): ReadonlyArray<AnchoredMatch> {
    return rawMatches.map((raw: RawMatch) => mapRawToAnchors(raw, haystack));
}
