/**
 * Public find match handle (Phase 7).
 *
 * @remarks
 * Spec 035 / ADR 2026-09-16. Find does not keep a live PowerPoint-style
 * selection; shape and slide handles remain valid until the consumer mutates
 * the underlying text or shape tree. Phase 7 never mutates the package through
 * this type (no replace / highlight).
 */
import { Shape } from '../../shapes/shape';
import { Slide } from '../../slideimplementation/slide';
/**
 * One read-only find hit within searchable slide body text.
 *
 * @public
 */
export interface TextFindMatch {
    /**
     * Matched text as it appears in the paragraph haystack
     * (string query: needle under case rules; regex: exact slice).
     */
    readonly text: string;
    /**
     * Zero-based slide index in {@link Presentation.slides} order.
     */
    readonly slideIndex: number;
    /** The slide containing the match. */
    readonly slide: Slide;
    /**
     * Shape that owns the text body (group-descendant shape when nested).
     * For table cell text, the graphic-frame shape hosting the table.
     */
    readonly shape: Shape;
    /**
     * When the match is inside a table cell, zero-based row index; otherwise
     * omitted.
     */
    readonly tableRow?: number;
    /**
     * When the match is inside a table cell, zero-based column index; otherwise
     * omitted.
     */
    readonly tableColumn?: number;
    /** Zero-based paragraph index within the searched text body. */
    readonly paragraphIndex: number;
    /** Inclusive start offset in the paragraph haystack (JS string index). */
    readonly startOffset: number;
    /** Exclusive end offset in the paragraph haystack. */
    readonly endOffset: number;
    /**
     * First text part (`a:r`) participating in the match, as an index into
     * {@link Paragraph.textParts}.
     */
    readonly startTextPartIndex: number;
    /**
     * Inclusive start offset within that part's {@link TextPart.text}.
     */
    readonly startTextPartOffset: number;
    /**
     * Last text part participating in the match (`Paragraph.textParts` index).
     */
    readonly endTextPartIndex: number;
    /**
     * Exclusive end offset within that part's {@link TextPart.text}.
     */
    readonly endTextPartOffset: number;
}
