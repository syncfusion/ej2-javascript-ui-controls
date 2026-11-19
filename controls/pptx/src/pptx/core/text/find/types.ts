/**
 * Internal find-engine types (Phase 7 TASK-1052).
 *
 * @remarks
 * Public {@link TextFindMatch} walk/shape fields are assembled in TASK-1053/1054.
 * Engine outputs haystack-local offsets and run anchors only.
 *
 * @internal
 */
/**
 * One regular-run contribution to a paragraph haystack.
 *
 * @internal
 */
export interface HaystackRun {
    /** Index into `Paragraph.textParts` for this `a:r`. */
    readonly textPartIndex: number;
    /** Direct `a:t` text for this run (UTF-16 code units). */
    readonly text: string;
    /** Inclusive start index of this run’s text in the paragraph haystack. */
    readonly startInHaystack: number;
}
/**
 * Concatenated regular-run text for one paragraph plus run map.
 *
 * @internal
 */
export interface ParagraphHaystack {
    /** Zero-based paragraph index supplied by the caller (walker). */
    readonly paragraphIndex: number;
    /** Concatenated `a:r` / `TextPart` text (JS string indices). */
    readonly haystack: string;
    /** Runs that contributed to {@link ParagraphHaystack.haystack}, in order. */
    readonly runs: ReadonlyArray<HaystackRun>;
}
/**
 * One match span in haystack coordinates (end exclusive).
 *
 * @internal
 */
export interface RawMatch {
    /** Inclusive start index in the haystack. */
    readonly start: number;
    /** Exclusive end index in the haystack. */
    readonly end: number;
    /** Matched slice (`haystack.slice(start, end)`). */
    readonly text: string;
}
/**
 * Raw match plus text-part anchors for a future {@link TextFindMatch}.
 *
 * @internal
 */
export interface AnchoredMatch {
    readonly start: number;
    readonly end: number;
    readonly text: string;
    readonly startTextPartIndex: number;
    readonly startTextPartOffset: number;
    readonly endTextPartIndex: number;
    readonly endTextPartOffset: number;
}
