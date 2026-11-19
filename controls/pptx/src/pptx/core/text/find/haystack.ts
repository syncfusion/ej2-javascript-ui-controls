/**
 * Paragraph haystack construction from regular runs (`a:r` / {@link TextPart}).
 *
 * @remarks
 * Spec 035 / dml-main `CT_Paragraph` / `CT_RegularTextRun`: concat direct `a:t`
 * text only. `a:br`, `a:fld`, and unknown children are not part of the haystack.
 * Missing `a:t` (getter throws) → skip that run (fail soft).
 *
 * @internal
 */
import { Paragraph } from '../paragraph';
import { HaystackRun, ParagraphHaystack } from './types';
import { arrayAt } from '../../util/es5-compat';
import { TextPartCollection } from '../text-part-collection';
import { TextPart } from '../text-part';
/**
 * Builds the search haystack and run map for one paragraph.
 *
 * @internal
 * @param {Paragraph} paragraph - Paragraph whose `textParts` are regular runs only.
 * @param {number} paragraphIndex - Caller-supplied index within the text body.
 * @returns {ParagraphHaystack} The result.
 */
export function buildHaystack(paragraph: Paragraph, paragraphIndex: number): ParagraphHaystack {
    const parts: TextPartCollection = paragraph.textParts;
    const runs: HaystackRun[] = [];
    let haystack: string = '';
    for (let textPartIndex: number = 0; textPartIndex < parts.length; textPartIndex++) {
        const part: TextPart = arrayAt(parts, textPartIndex);
        if (part === undefined) {
            continue;
        }
        let text: string;
        try {
            text = part.text;
        }
        catch {
            // Missing/corrupt a:t — skip run; do not abort paragraph/document search.
            continue;
        }
        const startInHaystack: number = haystack.length;
        haystack += text;
        runs.push({
            textPartIndex,
            text,
            startInHaystack
        });
    }
    return {
        paragraphIndex,
        haystack,
        runs
    };
}
/**
 * Builds a haystack from plain run strings (unit tests / pure engine).
 *
 * @internal
 * @param {*} runTexts - In-order run text contributions (already extracted).
 * @param {number} paragraphIndex - Optional paragraph index (default `0`).
 * @returns {ParagraphHaystack} The result.
 */
export function buildHaystackFromRunTexts(runTexts: ReadonlyArray<string>, paragraphIndex: number = 0): ParagraphHaystack {
    const runs: HaystackRun[] = [];
    let haystack: string = '';
    for (let textPartIndex: number = 0; textPartIndex < runTexts.length; textPartIndex++) {
        const text: string = arrayAt(runTexts, textPartIndex);
        if (text === undefined) {
            continue;
        }
        const startInHaystack: number = haystack.length;
        haystack += text;
        runs.push({ textPartIndex, text, startInHaystack });
    }
    return { paragraphIndex, haystack, runs };
}
